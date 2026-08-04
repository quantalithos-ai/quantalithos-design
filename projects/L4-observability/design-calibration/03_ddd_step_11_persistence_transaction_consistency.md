# L4-observability 03-详细设计 Step 11 · 持久化、事务与一致性契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义持久化、事务与一致性契约 |
| 当前状态 | `completed_design_record_with_affected_open` |
| 当前模式 | `full-restart` |
| 输入基线 | 当前正式 `00` / `01` / `02`,本轮 Step 01~10,详细设计 SOP 与书写规范 5.10 |
| 输出文件 | `projects/L4-observability/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` |
| 停审方式 | 按 ownership、logical store、repository、transaction、consistency / recovery 五批收口,最后做 Step 06~10 闭环审计 |
| 正式文档门禁 | 本 Step 不修改正式 `03-详细设计.md`;正式正文只在 Step 19 装配 |
| 下一步门禁 | M2 批次授权继续校准 Step 12；Step 15 完成后统一停在 Step 16 前 |

本文件中的局部 `pass` 只表示对应 logical store 或事务规则已有设计记录；M2 的聚合状态为
`pass_with_affected_open`。物理实现、上游 payload/owner、recovery class、external phase 和
result/report owner 未被本 Step 默认补齐。

## 2. 本步目标与非目标

本 Step 把 Step 06 的对象和 27 个状态 owner、Step 07 的 repository / UoW / outbox / projection port、Step 08 的 replay / event / job surface、Step 09 的函数级顺序以及 Step 10 的状态迁移收束成可直接实现的 persistence contract。

实现者必须能仅凭本文件回答:

1. 每个对象属于 owned truth、append-only record、reference snapshot、derived projection 还是 technical record。
2. 每个 logical store 的主键、唯一性、索引、version 和 append / replace 语义是什么。
3. 每个 repository 函数在哪种事务中调用,`expected_version` 从哪里取得,缺失和冲突如何表达。
4. Command、Consumer、Publisher、Job、Handoff / Export 和 Query 的事务边界及固定写入顺序是什么。
5. outbox、projection、reference、stored result、job report 和 handoff 发生部分失败时如何恢复,且为何不会反写外部业务 truth。

本 Step 不定义:

- 具体数据库、消息中间件、对象存储、搜索、APM、dashboard 或 GRC 产品。
- SQL DDL、物理表名、migration 文件、分区键、数据库隔离级别或锁语法。
- retry 次数、backoff、dead-letter exhaustion、并发 worker 数或 batch 默认值;这些进入 Step 13 / Step 14 / `04`。
- 完整错误 enum 和对外错误码;本 Step 只固定错误类别和恢复含义,Step 12 继续闭口。
- 实现 commit、真实 run id、真实 evidence alias、验收签署、测试结果或 implementation evidence。

物理 adapter 可以合并或拆分本文件列出的 logical store,但 durable adapter 与 in-memory fake 必须保持等价的 key、uniqueness、index lookup、version、append-only、transaction、cursor 和 no-write 语义。

## 3. 输入材料

| 输入 | 状态 | 本 Step 使用方式 |
|---|---|---|
| `01-架构设计.md` §9 | 当前架构基线 | 固定本仓只拥有 observation truth / audit projection / body-free linkage / handoff / retention / no-write truth,核心强一致,派生与外围最终一致 |
| `02-概要设计.md` §8 / §9 / §12 | 当前概要基线 | 承接对象族、接口族、状态传播和详细设计 handoff |
| `02_hld_step_12_detailed_design_handoff.md` | 当前承接产物 | 固定 truth/history/outbox/stale/result 的 transaction 方向和 no-write / no-repair 边界 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 owned object、append-only record、application helper、outbox、stored result 和 job report 字段 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并回补 | 提供 `ObservationUnitOfWork`、`Versioned<T>`、repository、projection、idempotency、outbox 和 delivery port |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并回补 | 提供 Command / Query / Consumer / Event / Job surface 以及 exact replay / payload snapshot schema |
| `03_ddd_step_09_function_flows.md` | 已完成并回补 | 提供 16 Command、14 Query、9 Consumer、12 Outbound、9 Job 的函数级顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供 27 个正式状态机、terminal / reserved transition 和跨状态副作用 |
| `详细设计讨论流程_SOP.md` Step 11 | 已读取 | 要求 ownership、store、repository、transaction 和 consistency 表全部闭口 |
| `详细设计书写规范.md` 5.10 | 已读取 | 固定本章必须输出格式与 outbox / projection 事务关系 |
| `L1-governance` Step 11 | 粒度参考 | 参考 repository / cursor / snapshot / recovery / anti-pattern 深度,不复制业务 truth |
| `L1-artifact` Step 11 | 粒度参考 | 参考 logical schema、transaction ordering 和 fake parity 深度,不复制业务 truth |

## 4. 分批写入记录

| 批次 | 内容 | 状态 | 停审结论 |
|---|---|---|---|
| 11.0 | SOP 回答、旧材料诊断、设计取舍、前序契约反查 | done | 旧 67 行文件降级为 historical material;发现并修正前序 signature / ordering 漂移 |
| 11.1 | 数据所有权实现表、logical store / collection / projection 契约 | done | owned truth、derived、reference、history、technical store 边界闭合 |
| 11.2 | Repository 函数持久化语义、version / cursor / identity 规则 | done | Step 07 所有 persistence port 均有读取、写入、CAS 和错误语义 |
| 11.3 | Command / Consumer / Publisher / Job / Handoff / Query 事务顺序 | done | 外部调用不持有长事务;accepted path 和 staged job 顺序闭合 |
| 11.4 | 一致性策略、failure recovery、cross-store invariant、logical schema | done | outbox / projection / reference / result / report / handoff 恢复闭合 |
| 11.5 | 前序回填、跨 Step 审计、后续 handoff、自检和门禁 | done | 无上游 blocker;等待用户确认 Step 12 |

## 5. SOP 问题回答

| SOP 问题 | 当前答案 |
|---|---|
| 哪些对象由本仓拥有? | `ObservationReceipt`、`SafetyDisposition`、`CorrelationContext`、`SafeSignal`、`SignalRollupWindow`、`AuditProjection`、`EvidenceLinkage`、`ReportHandoffRecord`、`AuthenticityHint`、`RetentionMarker`、`ActiveReferenceProtection`、`ReplayScope`、`NoWriteViolation`、`GapState`、`DegradedOutputState`、`PeripheralDeliveryState`、`ExternalAuditExportPreparation`、`ReferenceSnapshotState`、`ProjectionMaintenanceState`、`ReplayCoordinationState`、`RollupRebuildState` 及本仓 history / outbox / idempotency / stored result / job report。 |
| 哪些只是引用、快照或投影? | Identity、Governance、Artifact、Runtime、Sandbox、Archive、source audit、report consumer 和外部产品只允许 body-free typed ref / safe summary / digest / freshness / visibility snapshot。`ObservationReadModel`、`DiagnosticView`、`GapStatusView`、`DashboardAlertExportView`、`ReferenceSnapshotView`、`RebuildProgressView` 是可重建 projection。 |
| repository 函数如何命名和返回? | 函数签名以 Step 07 为唯一来源。mutable object 使用 `get_*_with_version` / versioned list 加 `save_*(..., expected_version, uow)`;append-only record 使用 `append_*`;projection 使用 versioned read + `replace_*`;outbox publication update 必须使用 pending list 返回的 version。 |
| 哪些 flow 需要事务? | 所有 accepted Command / Consumer、本地 publication marker update、projection / reference / gap / replay / rollup item update、handoff / export preparation and finalization、job draft / final report、stored result 与 idempotency complete 都需要 UoW。Query 不开启写 UoW。 |
| 需要什么锁和 version? | P0 使用 `ObservationRepositoryVersion` optimistic CAS,不要求显式行锁。existing row 的 version 只能来自同 repository 的 `Versioned<T>` read/list。`None` 只表示 create-if-absent。唯一键约束与 CAS 共同阻止 duplicate create / lost update。 |
| outbox 和 projection 如何保持一致? | accepted truth transaction 在 commit 前保存 immutable outbox payload snapshot,并以同一 committed cursor 标记 affected views stale。publish 与 rebuild 在后续短 UoW 更新 publication / view state;失败不得回滚 truth。 |
| 发布或 projection 失败如何恢复? | publish 保存 `Failed` / `DeadLettered`;projection 保留 `Stale` / `Rebuilding` / `Failed` / unavailable surface;reference 保存 `Stale` / `Unresolved` / `Invalid` / `Unavailable`;job report 保存 partial / failed / blocked refs。恢复只能重试外围动作或重建派生数据,不得修 source truth。 |

## 6. 历史材料诊断与前序反查

| 来源 | 发现的问题 | 本轮处理 |
|---|---|---|
| 旧 Step 11 | 仅 67 行,使用旧 `observation_envelopes` / raw metric / log / trace 表心智,未承接当前 27 个状态 owner | 全量替换;旧内容仅作为 historical material,不继承 |
| 旧 Step 11 | 没有 repository 函数级语义、version 来源、cursor namespace、projection dependency、stored result、job report 和 external-call transaction cut | 本文件 §10~§18 全面补齐 |
| Step 06 | Step 11 反查发现 audit subject、evidence purpose、handoff scope、rollup scope / cursor、outbox replay surface 与 job report 字段不足 | 已在进入本文件前回补当前 Step 06 |
| Step 07 | accepted UoW 规则曾把 cursor 分配放在 outbox / result 之后 | 已改为 truth/history staged 后分配 cursor,再写 outbox / stale / result |
| Step 07 | outbox payload、peripheral delivery、job report、reference / maintenance 读取与写入面不完整 | 已在进入本文件前补齐当前 port |
| Step 09 | projection replace 示例未传 `expected_version` | 已改为 versioned load 后分别传入 read model / diagnostic / progress version |
| Step 09 | publisher 示例未按 `Versioned<PendingObservationOutboxItem>` 解包,并使用了未定义的 `tx.commit()` | 已改为读取 `value.record` / `value.payload_snapshot` / `version`,并调用 UoW manager commit / rollback |
| Step 09 | shared Job 和 handoff 图把跨 batch / 外部调用表示为一个长事务 | 已改为 start / item / finalize 短 UoW;publisher / resolver / delivery 外部调用期间不持有数据库事务 |
| Step 07~09 | `PrepareReportHandoff` 只有 evidence-index ref,但没有 immutable snapshot repository;Query 又禁止写入 | 已补完整 view carrier、ID generator、repository get/save 和 Command validate-then-save;Query 仍只读 |
| Step 07 / 08 | 旧`load_by_key(key)`无法在actor-scoped typed operation uniqueness下精确recovery；job report / outbound event缺generator；Step 08 snapshot仍缺exact bytes/event/cursor | 已替换为context-bound reserve和`load_by_scope(operation,actor,key)`，补三个正式generator及protocol-to-storage一对一schema；不再要求adapter猜operation/actor、拼id或发布时重建payload |
| 正式 `03-详细设计.md` | 仍是旧 456 行 historical material | 不触碰;只在 Step 19 根据当前 Step 01~18 装配 |

上述缺口均能在当前详细设计内部闭口,没有要求修改 `00`、`01` 或 `02` 的上游 blocker。

## 7. 设计取舍

| 议题 | 备选方案 | 当前取舍 | 实现后果 |
|---|---|---|---|
| persistence 表达 | 直接绑定 SQL / 产品;logical contract | 采用 logical contract | adapter 可选物理承载,但 key/index/version/transaction 语义不可变 |
| core consistency | 所有链路最终一致;本地强一致 + 外围最终一致 | 采用后者 | observation-owned truth/state/history/result 在本地 UoW 原子成立;外围延迟显式化 |
| mutable concurrency | last-write-wins;row lock;optimistic CAS | 采用 optimistic CAS | existing update 必须传 loaded `ObservationRepositoryVersion` |
| append-only record | 覆盖 update;generated id append | 采用 generated id append | history / payload snapshot 不允许 in-place rewrite |
| cursor | timestamp / row id;UoW allocator | 采用 UoW allocator | cursor 只表达 committed order,不替代 version |
| outbox payload | publish 时重建;accepted tx 保存 exact bytes | 采用 exact stored snapshot | truth 后续变化不会污染已提交 event |
| projection stale | service 拼 view ref;dependency index resolve | 采用 dependency index | 只能 stale 已存在 view identity,missing index 不得猜 ref |
| reference refresh | 全表或正文扫描;formal scope index | 采用 formal scope/index | refresh 只遍历 tracked body-free snapshot |
| Query stale | inline repair;显式 stale/degraded | 采用显式 surface | Query 永远 no-write |
| long-running Job | 单一长事务;start/item/finalize | 采用 staged short UoW | item 可独立提交,report draft 精确解释 partial progress |
| external call | 在 DB transaction 内;transaction 外调用 + 短 finalize | 采用后者 | publisher / handoff / export / resolver 不占用长事务;本地 finalize 失败进入恢复 |
| retention | marker 后直接 delete;只写 marker / protection | 采用后者 | 当前不定义物理删除或 source cleanup |
| duplicate | 重跑 flow;replay immutable stored surface | 采用 stored replay | duplicate 不重扫、不重发、不重建、不交付 |

## 8. 数据所有权实现表

| 数据对象 / 对象族 | 拥有模块与 repository | 写入方 | 读取方 | 一致性要求与边界 |
|---|---|---|---|---|
| `ObservationReceipt` | `domain` / `ObservationIntakeRepository` | Submit / safety command,bus consumer | intake query,correlation / signal flow,projection job | owned mutable truth;create/update 使用 CAS;accepted admission 必须与 safety disposition / decision record 原子成立 |
| `SafetyDisposition` | `domain` / `ObservationIntakeRepository` | intake / safety command,bus or sandbox consumer | receipt guard,signal/audit/handoff guard,diagnostic | owned mutable truth;只保存 redaction marker、forbidden flag 与 safe summary ref,不保存 raw body |
| `CorrelationContext` | `domain` / `CorrelationSignalRepository` | correlation command,accepted signal consumer | signal,audit,query,rebuild | owned mutable truth;opaque trace / causation / source ref 不升级为业务 truth |
| `SafeSignal` | `domain` / `CorrelationSignalRepository` | signal command,runtime / sandbox consumer | rollup,diagnostic,query,rebuild | owned safe observation truth;只能由 accepted/redacted summary 形成,不得保存 raw log/metric/trace |
| `SignalRollupWindow` | `domain` / `CorrelationSignalRepository` | signal flow,rollup rebuild job | rollup query,diagnostic,peripheral rebuild | observation-derived state;CAS replacement,source cursor 单调,不表达业务状态 |
| `AuditProjection` | `domain` / `AuditEvidenceRepository` | audit command,source audit consumer | timeline,evidence,handoff,report/export rebuild | owned observation-side audit projection;不拥有 source audit / Governance truth;state 与 append record 同 UoW |
| `EvidenceLinkage` | `domain` / `AuditEvidenceRepository` | evidence command,artifact/governance consumer | evidence index,handoff,diagnostic,export | owned body-free relation;boundary ref + purpose + digest only,不保存 evidence/artifact body |
| immutable `EvidenceIndexInputView` snapshot | `contracts` + `ReportHandoffRepository` | `PrepareReportHandoff` accepted UoW after validating Query preview | handoff,hint,delivery,report query | owned immutable handoff input;contains refs/gaps/visibility only;Query assembles preview but never writes |
| `ReportHandoffRecord` + readiness | `domain` / `ReportHandoffRepository` | handoff command,hint command,delivery job / feedback consumer | handoff query,delivery job,export/report consumer | owned handoff fact;state/readiness 共用一行 version;不得生成 verdict、signoff、真实 run id 或 evidence alias |
| `AuthenticityHint` | `domain` / `ReportHandoffRepository` | authenticity command / handoff preparation | handoff query / readiness / report surface | owned observation hint;one current hint per handoff;placeholder / insufficient 必须可见 |
| `RetentionMarker` | `domain` / `RetentionGuardRepository` | retention command / scan / handoff guard | retention query,replay,maintenance,handoff/export | owned marker truth;与 active protection 强一致;`Released` 也不触发 source delete |
| `ActiveReferenceProtection` | `domain` / `RetentionGuardRepository` | protection command / retention job | retention release,handoff,replay | owned protection truth;consumer set 与 state CAS 更新,active consumer 阻止 release |
| `ReplayScope` | `domain` / `RetentionGuardRepository` | replay scope command | replay coordinator,maintenance,no-write guard | owned authorization scope;只允许 observation-side effect,不授权 source repair |
| `NoWriteViolation` | `domain` / `RetentionGuardRepository` | no-write command / blocked maintenance path | diagnostics,operations,audit | owned violation truth;violation + record 同 UoW;持久化失败也不得放行 forbidden write |
| `GapState` + `DegradedOutputState` | `domain` / `RetentionGuardRepository` | gap command,consumer,gap scan,maintenance | query,handoff,diagnostic,peripheral | owned explainability state;gap / degraded 可更新但不得合成 source success |
| `ReferenceSnapshotState` | `domain` / `ReferenceMaintenanceRepository` | reference command,context consumer,refresh job | guards,query,projection,handoff/export | local body-free snapshot state;最终一致;只保存 subject ref,safe summary ref,freshness / resolution and refresh record ref |
| `ProjectionMaintenanceState` | `domain` / `ReferenceMaintenanceRepository` | stale marker / rebuild job | query,job,no-write / replay guard | derived maintenance state;不覆盖 core truth;target current state 使用 CAS |
| `ReplayCoordinationState` | `domain` / `ReferenceMaintenanceRepository` | replay job | operations query/report,maintenance | owned execution coordination marker;必须回指 replay scope / no-write guard |
| `RollupRebuildState` | `domain` / `ReferenceMaintenanceRepository` | rollup rebuild job | progress query / report | derived execution state;source cursor 只前进,不读取 raw signal |
| `ExternalAuditExportPreparation` | `domain` / `PeripheralDeliveryRepository` | export command / delivery job | external export job,query,operations | owned preparation marker;body-free,不等于 external audit truth |
| `PeripheralDeliveryState` | `domain` / `PeripheralDeliveryRepository` | export job / feedback consumer | peripheral query,report,operations | owned delivery marker;delivered 不等于外部结论成立 |
| concrete history records | owning family repository | accepted transition / item UoW | audit timeline,diagnostic,operations,rebuild | append-only;same UoW as the state change they explain;不得替代 current truth |
| `ReadAccessRecord` | phase-reserved append-only logical store | 当前无同步 Query writer | future explicit audit consumer only | Query 本身不得 append;在新增独立异步审计 flow 前不允许启用 durable write |
| `DiagnosticView` + `DiagnosticScope` + `DiagnosticSummary` | `ObservationProjectionStore` diagnostic composite | rebuild item only | Query reads view;maintenance reads versioned composite | stable view/scope/freshness-marker refs + fresh immutable summary ref per replacement;scope body/view/current-summary pointer/dependency/freshness 使用一个 projection version 原子替换;request context 永不持久化 |
| six public projection families | `ObservationProjectionStore` | projection / peripheral / refresh / gap job | Query,report,handoff,peripheral consumer | replace-by-version;依赖、lookup、freshness metadata 同 UoW;永不反写 truth |
| `ObservationOutboxRecord` + payload snapshot | `ObservationOutboxRepository` | accepted mutation append;publisher marker update | publisher,operations,reconciliation | record/snapshot 与 truth 同 UoW append;publication later CAS;publisher 不重建 payload |
| `ObservationIdempotencyReservation` | `ObservationIdempotencyRepository` | Command / Consumer / Job | duplicate / conflict branch | logical unique `(operation_name,key)`;same digest replay,different digest conflict |
| `StoredObservationResult` | `ObservationStoredResultRepository` | accepted/rejected stored branch,job finalize | duplicate replay | immutable exact body-free protocol surface;save before idempotency complete |
| `ObservationJobReportDraft` | `ObservationJobReportRepository` | Job start/item/finalize | duplicate replay,operations | versioned draft;one report per local job execution ref;terminal report immutable |
| cursor / dependency / scope indexes | infra persistence support | UoW / projection / reference adapters | repositories and jobs | 本仓 technical truth;不属于业务 truth;只能从 formal refs / committed cursor 维护 |
| external source / identity / governance / artifact / runtime / archive bodies | 不归本仓 | 无合法 writer | 无合法 reader | forbidden persistence;只允许 body-free ref / summary / digest / visibility / freshness |

## 9. Logical store / collection / projection 契约

本章使用 logical store 名称描述实现语义,不是要求使用同名物理表。`version` 列中的 `repository_version` 均指 `ObservationRepositoryVersion`。`append-only` 表示没有 update/delete API;retention marker 也不授权物理删除。

### 9.1 Owned mutable truth / state stores

| Logical store | 用途 | 主键 / 唯一键 | 关键索引与稳定排序 | Version |
|---|---|---|---|---|
| `observation_receipts` | intake admission truth | PK `receipt_ref`;current source binding uniqueness 见 §12.3 | `source_ref`,`submission_purpose`,`admission_state`,`received_at`;list by received_at + ref | `repository_version` |
| `safety_dispositions` | safety / redaction truth | PK `disposition_ref`;unique `receipt_ref` | `receipt_ref`,`state`,`forbidden_body`,`sanitized_summary_ref` | `repository_version` |
| `correlation_contexts` | body-free correlation truth | PK `context_ref`;unique current `receipt_ref` | `receipt_ref`,`source_ref`,`trace_ref`,`state` | `repository_version` |
| `safe_signals` | safe log/metric/trace/summary observation | PK `signal_ref` | `correlation_context_ref`,`signal_kind`,`state`,`runtime_signal_ref`;list by ref | `repository_version` |
| `signal_rollup_windows` | rollup freshness / count state | PK `window_ref`;unique current logical window `(scope,window_kind)` | `scope`,`state`,`source_cursor`;list by scope + window_ref | `repository_version` |
| `audit_projections` | observation-side audit projection fact | PK `projection_ref`;unique logical source `(subject_ref,source_audit_ref)` | `subject_ref`,`correlation_context_ref`,`source_audit_ref`,`state` | `repository_version` |
| `evidence_linkages` | body-free evidence relation | PK `linkage_ref`;unique `(projection_ref,boundary_ref,evidence_purpose)` | `projection_ref`,`boundary_ref`,`evidence_purpose`,`state`,`digest_summary` | `repository_version` |
| `report_handoff_records` | handoff lifecycle + readiness co-state | PK `handoff_ref` | `handoff_scope_ref`,`consumer_ref`,`state`,`readiness`,`evidence_index_input_ref` | `repository_version` |
| `authenticity_hints` | evidence authenticity observation hint | PK `hint_ref`;unique current `handoff_ref` | `handoff_ref`,`state`,`evidence_origin` | `repository_version` |
| `retention_markers` | retention hold / release / conflict marker | PK `marker_ref`;unique current `protected_ref` | `protected_ref`,`state`,`active_protection_ref`,`archive_eligibility_ref` | `repository_version` |
| `active_reference_protections` | active consumer protection | PK `protection_ref`;unique current `protected_ref` | `protected_ref`,`state`;consumer refs use normalized membership index or equivalent | `repository_version` |
| `replay_scopes` | allowed observation-only replay scope | PK `scope_ref` | target membership,`allowed_effect`,`state` | `repository_version` |
| `no_write_violations` | forbidden write attempt truth | PK `violation_ref` | `trigger_context_ref`,`attempted_write_target`,`state` | `repository_version` |
| `gap_states` | missing / not-visible / unsafe lifecycle | PK `gap_ref` | `source_ref`,`gap_kind`,`state`,`degraded_ref` | `repository_version` |
| `degraded_output_states` | explicit degraded / blocked output | PK `degraded_ref` | `gap_ref`,`reason`,`state` | `repository_version` |
| `reference_snapshot_states` | tracked body-free external reference snapshot | PK `snapshot_ref`;unique current `subject_ref` | `subject_ref`,source family discriminator,`state`,`safe_summary_ref` | `repository_version` |
| `projection_maintenance_states` | projection stale / rebuild state | PK `maintenance_ref`;unique current `target_ref` | `target_ref`,`state`,`progress_ref` | `repository_version` |
| `replay_coordination_states` | one local replay coordination execution | PK `coordination_ref` | `scope_ref`,`state`,`no_write_guard_ref` | `repository_version` |
| `rollup_rebuild_states` | one rollup rebuild execution | PK `rebuild_ref` | `window_ref`,`state`,`source_cursor` | `repository_version` |
| `external_audit_export_preparations` | body-free export preparation | PK `preparation_ref` | `consumer_ref`,`view_ref`,`state`,visibility kind | `repository_version` |
| `peripheral_delivery_states` | peripheral delivery lifecycle | PK `delivery_ref`;unique current `preparation_ref` | `preparation_ref`,`consumer_ref`,`view_ref`,`state` | `repository_version` |

### 9.2 Append-only history / audit stores

| Logical store | Record | PK / uniqueness | 关键索引 | 写入规则 |
|---|---|---|---|---|
| `intake_decision_records` | `IntakeDecisionRecord` | PK `record_ref` | `receipt_ref`,change kind,actor,recorded_at,observation cursor | receipt transition 同 UoW append |
| `correlation_link_records` | `CorrelationLinkRecord` | PK `record_ref` | `context_ref`,change kind,recorded_at,cursor | correlation transition 同 UoW |
| `audit_append_records` | `AuditAppendRecord` | PK `record_ref` | `projection_ref`,append kind,recorded_at,cursor | audit projection/linkage transition 同 UoW;不含 source body |
| `handoff_lifecycle_records` | `HandoffLifecycleRecord` | PK `record_ref`;external preparation / receipt ref 仅作为 body-free detail | `handoff_ref`,change kind,preparation ref,receipt ref,recorded_at | prepare/deliver/fail/block 每次 append |
| `retention_change_records` | `RetentionChangeRecord` | PK `record_ref` | `marker_ref`,change kind,actor,recorded_at | marker/protection accepted transition 同 UoW |
| `no_write_violation_records` | `NoWriteViolationRecord` | PK `record_ref` | `violation_ref`,record kind,target ref,recorded_at | 与 violation create/update 原子 append |
| `gap_transition_records` | `GapTransitionRecord` | PK `record_ref` | `gap_ref`,transition kind,recorded_at,cursor | gap/degraded transition 同 UoW |
| `peripheral_delivery_records` | `PeripheralDeliveryRecord` | PK `record_ref` | `delivery_ref`,delivery kind,preparation ref,recorded_at | delivery marker update 同 UoW |
| `reference_refresh_records` | `ReferenceRefreshRecord` | PK `record_ref` | `snapshot_ref`,refresh kind,recorded_at,`ReferenceCursor` | snapshot state update 同 UoW |
| `projection_maintenance_records` | `ProjectionMaintenanceRecord` | PK `record_ref` | `maintenance_ref`,target ref,kind,recorded_at | maintenance state / view replace item 同 UoW |
| `gap_scan_records` | `GapScanRecord` | PK `record_ref` | target ref,scan kind,job report ref,recorded_at | scan item append;不自动关闭 gap |
| `replay_execution_records` | `ReplayExecutionRecord` | PK `record_ref` | `scope_ref`,coordination ref,kind,recorded_at | replay item / finalize append;不声明 source repaired |
| `read_access_records` | `ReadAccessRecord` | PK `record_ref` | request context,visibility kind,recorded_at | phase reserved;同步 Query 没有 writer,不得由 repository adapter 暗写 |

append-only store 的公共规则:

- PK 由 `IdGeneratorPort.new_history_record_ref` 或对应 typed generator 生成。
- 不使用 `repository_version`,也没有 update/delete 函数。
- duplicate PK 不允许覆盖。若相同 operation 重放,应由 idempotency 在进入 append 前拦截。
- record 的 subject、change kind、actor、reason、recorded_at 必须来自当前 transition / operation context,不得由 adapter 查询外部正文补齐。
- physical retention 以后只能由单独设计承接;当前 marker 不授权删除 history。

### 9.3 Derived projection stores

| Logical projection | Body / state owner | PK / lookup uniqueness | 关键索引 | Version / replacement |
|---|---|---|---|---|
| `observation_read_models` | `ObservationReadModel` + embedded visibility / freshness surface | generated read model ref PK;scope lookup unique by canonical `ObservationProjectionScope`;freshness marker ref unique | observation / correlation / audit subject / handoff / target scope | first create generates view + marker refs;versioned replacement preserves both;body + metadata + dependency rows atomic |
| `diagnostic_views` | `DiagnosticView` + current summary pointer | generated `DiagnosticViewRef` PK;canonical `ObservationProjectionScope` lookup unique;freshness marker ref unique | projection scope,diagnostic scope/current summary refs,freshness,gap refs | composite `repository_version`;first create generates view/scope/marker refs,replacement preserves them and swaps current summary pointer atomically;request context is absent |
| `diagnostic_scopes` | current versioned `DiagnosticScope` body | stable generated `DiagnosticScopeRef` PK;unique current `view_ref` | projection scope,canonical target refs,time window,visibility scope | no independent CAS;replaced under owning diagnostic view version;scope ref preserved |
| `diagnostic_summary_snapshots` | immutable `DiagnosticSummary` | generated `DiagnosticSummaryRef` PK | scope ref,freshness,safe signal/gap/no-write violation refs | append-only summary snapshot;each replacement allocates a new ref,old summary remains unchanged;view pointer update and insert are atomic |
| `gap_status_views` | `GapStatusView` | gap ref PK;freshness marker ref unique | gap state,source ref,degraded ref | first projection create generates marker ref;versioned replacement preserves it |
| `peripheral_export_views` | `DashboardAlertExportView` | generated view ref PK;canonical consumer + projection scope lookup unique | consumer ref,scope,read model ref,diagnostic/gap refs,visibility,freshness | versioned replace;first create generates ref,replacement preserves ref |
| `reference_snapshot_views` | `ReferenceSnapshotView` | snapshot ref PK;freshness marker ref unique | subject ref,state,freshness | first projection create generates marker ref;versioned replacement preserves it |
| `rebuild_progress_views` | `RebuildProgressView` | generated progress ref PK;target ref lookup unique | maintenance state,source cursor,job/report refs | versioned replace;first create generates ref,replacement preserves ref |
| `projection_freshness_markers` | dual-namespace freshness metadata for all projection families | generated marker ref PK;view ref unique | applied observation cursor,applied reference cursor,stale observation cursor,stale reference cursor,state,target ref | first projection create establishes one-to-one marker binding;each namespace monotonic independently;cannot move either watermark backward |
| `projection_dependency_index` | source ref -> existing view ref relation | unique `(source_ref,view_ref)` | source ref,view ref,projection kind,target ref | replace with view in same UoW;not a public truth object |
| `projection_lookup_index` | canonical scope -> existing view ref | unique `(projection_kind,canonical_scope)` | view ref,scope discriminator | replace with view in same UoW;Query missing returns formal missing/degraded surface |

### 9.4 Reference, idempotency, outbox and job technical stores

| Logical store | 用途 | PK / 唯一键 | 关键索引 | Version / mutability |
|---|---|---|---|---|
| `reference_scope_index` | support `ExplicitRefs` / `BySourceFamily` / `UnhealthyOnly` / `ByMaintenanceTarget` | unique `(snapshot_ref,scope_discriminator,scope_ref)` | subject ref,source family,state,maintenance target | maintained with snapshot/projection relation in UoW;row replace is adapter-internal |
| `maintenance_target_scope_bindings` | exact canonical member scopes of one rebuild target | unique `target_ref`;unique `(target_ref,canonical_scope)` membership | target ref,scope discriminator,typed scope ref | immutable after first bind;same canonical set retry is no-op,different set is conflict;created with maintenance/report start UoW |
| `projection_source_records` | current typed projection source metadata independent of scope membership | unique `ProjectionSourceRef` discriminator + typed ref | item kind,stable `source_observed_at`,tagged last-changed cursor,current typed repository owner | upsert only through accepted `record_committed_sources`;persists when memberships become empty so re-entry preserves time identity;no raw body |
| `projection_source_scope_index` | complete typed source membership for projection capture | unique `(canonical_scope,ProjectionSourceRef,dependency_role)` | scope discriminator,typed source discriminator/ref,item kind,dependency role | exact-membership replace with accepted source/reference change in same UoW;removed memberships delete index rows and bump old scopes;row references `projection_source_records`;aggregate `ByMaintenanceTarget` is forbidden as a member row |
| `projection_scope_positions` | dual upper positions + revision per canonical scope selector | unique `canonical_scope` | observation upper cursor,reference upper cursor,scope revision | each namespace monotonic;revision advances on membership or upper-position change;bound target aggregate row advances when any member changes |
| `evidence_index_input_snapshots` | exact body-free input accepted for one handoff | PK `input_ref`;immutable constituent refs / gaps / visibility | scope ref,linkage refs,audit projection refs,gap refs | immutable append;validated and saved before handoff row in same UoW |
| `observation_idempotency_reservations` | actor-scoped operation reservation / replay pointer | PK `idempotency_ref`;unique `(operation_name,actor_ref,idempotency_key)` | state,request digest,optional inbound event identity,stored result ref | repository-managed atomic Acquired/Replay/Conflict/InFlight；durable state onlyReserved/Completed |
| `observation_inbound_event_identities` | prevent producer dedup-key drift for one source event | unique `(consumer_operation,producer_family,source_event_ref)`;FK `idempotency_ref` | original scope/digest | created atomically withConsumer reservation；same event resolves original reservation |
| `stored_observation_results` | exact immutable duplicate replay | PK `result_ref`;unique `idempotency_ref` | operation,actor,request digest,public result ref,result kind,surface digest,stored_at | immutable append;no update |
| `observation_outbox_records` | publication lifecycle | PK `outbox_ref`;unique `event_ref`;unique `payload_snapshot_ref` | state,subject ref,tagged committed cursor,committed_at | `repository_version` for publication CAS |
| `observation_outbox_payload_snapshots` | exact serialized body-free event + immutable publication binding | PK `payload_snapshot_ref`;unique `event_ref` | subject ref,event name,effect binding ref,schema version,digest,cursor,stored_at | immutable append;one-to-one with outbox record;publication token durable landing;无独立 payload identity |
| `observation_job_report_drafts` | staged operations report | PK `report_ref`;unique `job_ref` | state,affected/failed/gap/progress membership,failure reason | `repository_version`;terminal report immutable |
| `observation_job_execution_plans` | immutable Job work-set/config snapshot + mutable item classification | PK `plan_ref`;unique `execution_ref`;unique `idempotency_ref` | operation/request/plan digest,config ref/canonical snapshot,typed work keys,item state/observed version | work identity/input/config immutable;item state CAS;terminal classifications not reopened |
| `observation_execution_claims` | durable execution/global item ownership | PK claim identity;unique active execution claim;unique active global typed `work_key` | execution ref,work key,fencing token,state | acquire issues strictly increasing token;renew/release CAS;commit-time fence validation |
| `observation_external_effect_intents` | stable handoff/export prepare/deliver token landing | PK `intent_ref`;typed unique semantic token identity | effect binding ref,local subject/preparation/view/consumer refs,material digest,state | immutable token fields;local phase marker CAS;no route/credential/body；publication token lands in outbox snapshot |
| `observation_cursor_sequence` | committed observation mutation order | logical namespace + monotonic value | transaction ref,cursor value | allocated once per accepted observation UoW;never reused |
| `reference_cursor_sequence` | committed reference-only change order | separate namespace + monotonic value | transaction ref,cursor value | allocated once per reference-only UoW;never reused |

### 9.4-a Projection source / role / scope 映射

`record_committed_sources` 不接受 store adapter 自由推断。application必须先在accepted UoW内调用`ObservationProjectionMembershipPlanner.plan_updates`,由typed planner从staged + committed formal relations生成完整`ProjectionSourceIndexUpdate`集合。`ref extractor`先验证item enum variant与owner ref相符,再构造匹配的`ProjectionSourceRef` variant；只有对外affected/report映射才lossless提取`BodyFreeRef`。禁止从debug string、JSON、hash、path或external body提取。

| `ProjectionSourceItem` | `ProjectionDependencyRole` | typed `ProjectionSourceRef` extractor | Cursor namespace | `source_observed_at` 初始来源 | Scope eligibility |
|---|---|---|---|---|---|
| `Receipt(value)` | `Observation` | `ProjectionSourceRef::Receipt(value.receipt_ref)` | observation | `value.received_at` | `ByObservation(value.receipt_ref)`；以及由该 receipt 正式派生的 correlation / audit-subject / handoff closure |
| `SafetyDisposition(value)` | `Safety` | `ProjectionSourceRef::SafetyDisposition(value.disposition_ref)` | observation | first-index `ClockPort.now` | 与 `value.receipt_ref` 的 receipt 完全相同的 canonical closure |
| `CorrelationContext(value)` | `Correlation` | `ProjectionSourceRef::CorrelationContext(value.context_ref)` | observation | first-index `ClockPort.now` | `ByCorrelation(value.context_ref)`、`ByObservation(value.receipt_ref)`；以及引用该 context 的 audit-subject / handoff closure |
| `SafeSignal(value)` | `Signal` | `ProjectionSourceRef::SafeSignal(value.signal_ref)` | observation | first-index `ClockPort.now` | 通过 `value.correlation_context_ref` 进入对应 `ByCorrelation`、receipt `ByObservation`、audit-subject / handoff closure |
| `AuditProjection(value)` | `Audit` | `ProjectionSourceRef::AuditProjection(value.projection_ref)` | observation | first-index `ClockPort.now` | `ByAuditSubject(value.subject_ref)`；并通过 context 进入 `ByCorrelation` / `ByObservation`,通过 accepted evidence input进入`ByReportHandoff` |
| `EvidenceLinkage(value)` | `Evidence` | `ProjectionSourceRef::EvidenceLinkage(value.linkage_ref)` | observation | first-index `ClockPort.now` | 继承 `value.projection_ref` 的 observation / correlation / audit-subject scopes；被 immutable evidence-index input引用时进入对应`ByReportHandoff` |
| `ReportHandoff(value)` | `Handoff` | `ProjectionSourceRef::ReportHandoff(value.handoff_ref)` | observation | first-index `ClockPort.now` | `ByReportHandoff(value.handoff_ref)`；其 immutable evidence-index input 可使其进入输入成员已建立的 observation / correlation / audit-subject scopes |
| `AuthenticityHint(value)` | `Authenticity` | `ProjectionSourceRef::AuthenticityHint(value.hint_ref)` | observation | first-index `ClockPort.now` | 与 `value.handoff_ref` 的 handoff scope closure完全一致 |
| `RetentionMarker(value)` | `Retention` | `ProjectionSourceRef::RetentionMarker(value.marker_ref)` | observation | first-index `ClockPort.now` | formal `protected_ref` relation index指向的所有 canonical member scopes |
| `ActiveProtection(value)` | `Protection` | `ProjectionSourceRef::ActiveProtection(value.protection_ref)` | observation | first-index `ClockPort.now` | formal `protected_ref` relation index指向的所有 canonical member scopes |
| `NoWriteViolation(value)` | `NoWrite` | `ProjectionSourceRef::NoWriteViolation(value.violation_ref)` | observation | first-index `ClockPort.now` | formal trigger / attempted-target relation index命中的 canonical member scopes；不得按自由文本 reason匹配 |
| `Gap(value)` | `Gap` | `ProjectionSourceRef::Gap(value.gap_ref)` | observation | first-index `ClockPort.now` | formal `value.source_ref` relation命中的 scopes；被 handoff immutable input引用时还进入对应`ByReportHandoff` |
| `DegradedOutput(value)` | `Degraded` | `ProjectionSourceRef::Degraded(value.degraded_ref)` | observation | first-index `ClockPort.now` | 与其 formal `gap_ref` 命中的 scope closure一致；无 gap relation时只能使用创建 flow显式携带的 typed member scopes |
| `ReferenceSnapshot(value)` | `Reference` | `ProjectionSourceRef::ReferenceSnapshot(value.snapshot_ref)` | reference-only UoW -> reference；mixed observation UoW -> observation | first-index `ClockPort.now` | formal `value.subject_ref` / reference-scope relation命中的 member scopes；target binding只聚合这些member,不成为membership |

表中 observation / reference 是 source family的默认namespace requirement,最终 tagged cursor由整个UoW决定。一个mixed UoW只分配observation cursor,其中`ReferenceSnapshot` record也携带该observation tag并推进member scope的observation upper position；只有不含任何observation-owned change的reference-only UoW才使用reference cursor。planner/store必须以UoW assigned tag验证全部updates,不得按item variant为同一事务分配第二cursor。

canonical closure 只允许以下有限 join,并必须由 typed repository key / relation index完成:

1. `ByObservation(receipt)`：receipt -> safety、correlation -> signal、audit -> evidence,再连接明确引用这些成员的 handoff / gap / retention / protection / reference rows。
2. `ByCorrelation(context)`：context -> receipt/safety、signal、audit -> evidence,再连接明确引用这些成员的 handoff / gap / guard / reference rows。
3. `ByAuditSubject(subject)`：subject -> audit -> context -> receipt/safety/signal及 evidence,再连接明确引用这些成员的 handoff / gap / guard / reference rows。
4. `ByReportHandoff(handoff)`：handoff -> immutable evidence-index input -> evidence/audit/gap,再通过上述反向 typed relations闭合 context/receipt/safety/signal、authenticity、guard和reference rows。

这些 join 求得的是有限 least fixed point,每个 `(scope,role)` canonical sorted unique。planner不得扫描serialized object body或把scope与role做cross product。`ProjectionSourceChangeSet.affected_relation_anchors`必须同时覆盖relation before-image与staged after-image的typed roots；planner先从old membership rows扩展旧成员,再从staged current relations扩展新成员,取并集作为待重算source set。由此间接受影响existing source即使domain row未修改也不能遗漏。状态/关系变化后若一个source不再属于任何canonical member scope,planner必须输出`memberships=[]`；这表示exact full withdrawal,不是字段缺失。source record仍保留,所有旧scope及引用它们的bound target aggregate position/revision使用当前tagged cursor推进。后续re-entry必须复用原`source_observed_at`,不得用新的Job时间重置diagnostic ordering。

### 9.5 27 个状态 owner 持久化审计

| 状态机 | 持久化 owner | Logical store | Update 方式 |
|---|---|---|---|
| `ObservationReceiptState` | `ObservationReceipt.admission_state` | `observation_receipts` | CAS |
| `SafetyDispositionState` | `SafetyDisposition.state` | `safety_dispositions` | CAS |
| `CorrelationContextState` | `CorrelationContext.state` | `correlation_contexts` | CAS |
| `SafeSignalState` | `SafeSignal.state` | `safe_signals` | CAS |
| `AuditProjectionState` | `AuditProjection.state` | `audit_projections` | CAS + append record |
| `EvidenceLinkageState` | `EvidenceLinkage.state` | `evidence_linkages` | CAS + audit record |
| `ReportHandoffState` | `ReportHandoffRecord.state` | `report_handoff_records` | CAS |
| `HandoffReadinessState` | `ReportHandoffRecord.readiness` | same handoff row | 与 lifecycle state 使用同一 CAS |
| `AuthenticityHintState` | `AuthenticityHint.state` | `authenticity_hints` | CAS |
| `RetentionMarkerState` | `RetentionMarker.state` | `retention_markers` | CAS + change record |
| `ActiveReferenceProtectionState` | `ActiveReferenceProtection.state` | `active_reference_protections` | CAS |
| `ReplayScopeState` | `ReplayScope.state` | `replay_scopes` | CAS |
| `NoWriteViolationState` | `NoWriteViolation.state` | `no_write_violations` | violation + record atomic CAS |
| `GapLifecycleState` | `GapState.state` | `gap_states` | CAS + transition record |
| `DegradedOutputKind` | `DegradedOutputState.state` | `degraded_output_states` | CAS;replacement cannot hide blocked |
| `SignalRollupState` | `SignalRollupWindow.state` | `signal_rollup_windows` | CAS + source cursor guard |
| `ReadVisibilityKind` | read model / request-derived owner | projection body / no standalone query write | projection replace only |
| `DiagnosticFreshnessState` | `DiagnosticSummary.freshness` | immutable summary snapshot + current diagnostic view pointer | composite projection replace only |
| `ReferenceSnapshotStateKind` | `ReferenceSnapshotState.state` | `reference_snapshot_states` | CAS + refresh record |
| `ProjectionMaintenanceStateKind` | `ProjectionMaintenanceState.state` | `projection_maintenance_states` | CAS + maintenance record |
| `ReplayCoordinationKind` | `ReplayCoordinationState.state` | `replay_coordination_states` | CAS |
| `RollupRebuildKind` | `RollupRebuildState.state` | `rollup_rebuild_states` | CAS + source cursor guard |
| `PeripheralDeliveryKind` | `PeripheralDeliveryState.state` | `peripheral_delivery_states` | CAS + delivery record |
| `ExportPreparationState` | `ExternalAuditExportPreparation.state` | `external_audit_export_preparations` | CAS |
| `OutboxPublicationState` | `ObservationOutboxRecord.state` | `observation_outbox_records` | pending-list version CAS |
| `IdempotencyReservationState` | `ObservationIdempotencyReservation.state` | `observation_idempotency_reservations` | repository atomic reserve/complete；durable state仅`Reserved` / `Completed`，Replay / Conflict / InFlight只是incoming outcome |
| `JobReportState` | `ObservationJobReportDraft.state` | `observation_job_report_drafts` | versioned Draft -> one terminal state |

### 9.6 Store 契约停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 06 owned object 是否都有 store | pass | 21 个 mutable owner、append-only family、technical objects 全覆盖 |
| Step 10 27 个状态机是否都有持久化 owner | pass | §9.5 一一映射;Query-derived state 无隐藏 write |
| raw log / metric / trace / audit / evidence body 是否进入 store | no | 只保存 typed ref、safe summary、digest、state、surface 和 cursor |
| logical key / index / version 是否足以实现 Step 07 read/write | pass | singular find、scope list、versioned replace、pending publish 均有索引 |
| phase-reserved record 是否误授权当前 writer | no | `ReadAccessRecord` 明确没有同步 Query writer |
| 是否提前绑定数据库产品或 DDL | no | 只定义 logical contract |

## 10. Repository 函数持久化语义

### 10.1 公共语义

| 规则 | 正式契约 |
|---|---|
| committed read | 所有不带 UoW 参数的 get/find/list/page 只返回 committed rows。它们可在 begin 后读取,但 consistency authority 是随后 save 的 CAS,不是隐式 snapshot transaction。 |
| version source | `ObservationRepositoryVersion` 只能来自同 repository 的 `Versioned<T>` get/find/list/page。不得使用 cursor、timestamp、row id、event sequence、page token、constant 或外部 version。 |
| create | `expected_version = None` 只允许 create-if-absent。若 PK 或 logical unique key 已存在,返回 conflict 类 `ApplicationError`,不得覆盖。 |
| update | `expected_version = Some(v)` 必须执行 compare-and-swap。受影响行数不是 1 时返回 optimistic conflict,整个 UoW 回滚。 |
| absent read | get/find 返回 `Ok(None)`;list/page 返回空 page。是否映射为 not-found、missing、gap 或 create 由 application flow 决定。 |
| stable page | page 必须有稳定排序和 opaque cursor。cursor 只编码已定义排序位置;不能编码 secret/body,也不能当 version。 |
| append | append-only function 只接受当前 UoW 产生的 typed record。duplicate PK / unique identity 返回 conflict;不做 upsert overwrite。 |
| atomic composite | `save_no_write_violation`、outbox record+snapshot、projection body+metadata+index 等 composite write 必须在 adapter 内保持原子。 |
| error type | Step 07 统一返回 `ApplicationError`。本 Step 固定 missing / conflict / invariant / unavailable / serialization / commit-unknown 类别,最终 variant 由 Step 12 定义。 |
| fake parity | memory fake 必须实现同样的 uniqueness、CAS、rollback visibility、cursor monotonicity、stable page、append-only 和 exact snapshot;不能用 HashMap overwrite 模糊冲突。 |

### 10.2 UoW manager

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 失败语义 |
|---|---|---|---|---|
| `begin() -> Box<dyn ObservationUnitOfWork>` | 创建本地 write set | 一个 flow phase 一个 UoW;entry 不直接调用 | transaction handle | begin failure 无 durable side effect |
| `assign_observation_cursor(&uow) -> ObservationCursor` | 为已 staged observation truth/history 分配 committed order | 每 UoW 最多一次;必须在 outbox/stale/result 前 | same cursor for this UoW | failure rollback all staged writes |
| `assign_reference_cursor(&uow) -> ReferenceCursor` | 为 reference-only change 分配独立 order | 与 observation namespace/type 分离;每 UoW 最多一次 | reference cursor | failure rollback |
| `commit(uow)` | 原子公开 staged writes | commit 前 invariant 全部通过 | unit | known failure rollback / unknown outcome 按 §15 探测 |
| `rollback(uow)` | 丢弃 staged writes | duplicate/conflict/branch failure | unit | rollback failure 不得把 operation 当成功 |

### 10.3 Intake / correlation repositories

| 函数 | Store / 作用 | Transaction / version | 返回与错误 |
|---|---|---|---|
| `get_receipt_with_version(receipt_ref)` | PK read `observation_receipts` | committed read | `Option<Versioned<ObservationReceipt>>` |
| `find_receipt_by_source(source_ref)` | current source binding lookup | deterministic current rule §12.3 | versioned receipt or None |
| `list_receipts_by_scope(scope,page)` | state / source scope page | stable received_at + ref order | versioned page |
| `save_receipt(receipt,expected_version,uow)` | create/update receipt | CAS;linked safety/decision write same UoW when required | ref;conflict/invariant errors |
| `get_safety_disposition_with_version(disposition_ref)` | PK read safety | committed read | versioned or None |
| `find_safety_by_receipt(receipt_ref)` | unique receipt lookup | committed unique index | versioned or None |
| `save_safety_disposition(disposition,expected_version,uow)` | create/update safety | CAS;forbidden body must not serialize | ref;conflict/invariant |
| `append_intake_decision(record,uow)` | append receipt decision evidence | same UoW as transition | unit;duplicate/invariant |
| `get_correlation_with_version(context_ref)` | PK read correlation | committed read | versioned or None |
| `find_correlation_by_receipt(receipt_ref)` | unique current context | committed unique index | versioned or None |
| `save_correlation(context,expected_version,uow)` | create/update context | CAS | ref;conflict |
| `get_safe_signal_with_version(signal_ref)` | PK read signal | committed read | versioned or None |
| `list_signals_by_context(context_ref,page)` | signal page | stable signal ref order | versioned page |
| `save_safe_signal(signal,expected_version,uow)` | create/update safe signal | CAS;summary must be body-free | ref;conflict/invariant |
| `get_rollup_with_version(window_ref)` | PK read rollup | committed read | versioned or None |
| `list_rollups_by_scope(scope,page)` | scope page | stable window ref order | versioned page |
| `save_rollup(rollup,expected_version,uow)` | create/update rollup | CAS + non-regressing source cursor | ref;conflict/cursor regression |
| `append_correlation_record(record,uow)` | append correlation/signal history | same UoW as transition | unit |

### 10.4 Audit / handoff / peripheral repositories

| 函数 | Store / 作用 | Transaction / version | 返回与错误 |
|---|---|---|---|
| `get_audit_projection_with_version(projection_ref)` | PK read audit projection | committed read | versioned or None |
| `list_audit_projections_by_subject(subject_ref,page)` | audit subject timeline source | stable cursor + ref order | versioned page |
| `save_audit_projection(projection,expected_version,uow)` | create/update observation audit projection | CAS + source/subject uniqueness | ref;conflict/body-boundary |
| `get_evidence_linkage_with_version(linkage_ref)` | PK read linkage | committed read | versioned or None |
| `list_evidence_linkages_by_projection(projection_ref,page)` | projection linkage page | stable linkage ref | versioned page |
| `list_evidence_linkages_by_scope(scope,page)` | handoff/evidence index scope page | formal scope index only | versioned page |
| `save_evidence_linkage(linkage,expected_version,uow)` | create/update body-free relation | CAS + logical unique key | ref;conflict/body-boundary |
| `append_audit_record(record,uow)` | append audit transition | same UoW as projection/linkage transition | unit |
| `page_audit_timeline(query,page)` | projection + append record read model | read-only stable cursor | page;no hidden write |
| `get_handoff_with_version(handoff_ref)` | PK read handoff | committed read | versioned or None |
| `get_evidence_index_input(input_ref)` | immutable snapshot PK read | committed read;never rebuild from current evidence relation | exact view or None |
| `save_evidence_index_input(input,uow)` | append exact validated body-free input | same accepted UoW before handoff save;no version/update | input ref;duplicate ref with different content -> conflict |
| `list_handoffs_by_consumer(consumer_ref,page)` | consumer handoff page | stable state/ref order | versioned page |
| `save_handoff(handoff,expected_version,uow)` | create/update state + readiness | one CAS covers both co-states | ref;conflict/readiness invariant |
| `get_authenticity_hint_with_version(hint_ref)` | PK read hint | committed read | versioned or None |
| `find_authenticity_hint_by_handoff(handoff_ref)` | unique current hint | committed unique index | versioned or None |
| `save_authenticity_hint(hint,expected_version,uow)` | create/update hint | CAS;placeholder cannot be rewritten as real | ref;conflict/state invariant |
| `append_lifecycle_record(record,uow)` | append prepare/deliver/fail/block details | same local UoW as handoff state update | unit |
| `get_export_preparation_with_version(preparation_ref)` | PK read export preparation | committed read | versioned or None |
| `save_export_preparation(preparation,expected_version,uow)` | create/update export marker | CAS | ref;conflict/visibility invariant |
| `get_delivery_with_version(delivery_ref)` | PK read delivery | committed read | versioned or None |
| `find_delivery_by_preparation(preparation_ref)` | unique current delivery | committed unique index | versioned or None |
| `save_delivery(delivery,expected_version,uow)` | create/update delivery state | CAS;external result does not bypass local guard | ref;conflict |
| `append_delivery_record(record,uow)` | append delivery outcome | same UoW as delivery/preparation transition | unit |

### 10.5 Retention / gap repository

| 函数 | Store / 作用 | Transaction / version | 返回与错误 |
|---|---|---|---|
| `get_retention_with_version(marker_ref)` | PK read retention | committed read | versioned or None |
| `find_retention_by_protected_ref(protected_ref)` | unique current marker | committed unique index | versioned or None |
| `save_retention(marker,expected_version,uow)` | create/update retention marker | CAS;release guard rechecked before save | ref;conflict/protection invariant |
| `append_retention_record(record,uow)` | append marker transition | same UoW | unit |
| `get_active_protection_with_version(protection_ref)` | PK read protection | committed read | versioned or None |
| `list_active_protections(protected_ref,page)` | protection / consumer page | stable protection ref | versioned page |
| `save_active_protection(protection,expected_version,uow)` | create/update protection | CAS;consumer set normalized equivalently | ref;conflict |
| `get_replay_scope_with_version(scope_ref)` | PK read replay scope | committed read | versioned or None |
| `save_replay_scope(scope,expected_version,uow)` | create/update replay scope | CAS;allowed effect no source write | ref;conflict/boundary |
| `append_replay_execution_record(record,uow)` | append replay execution | item/finalize UoW | unit |
| `get_no_write_violation_with_version(violation_ref)` | PK read violation | committed read | versioned or None |
| `save_no_write_violation(violation,record,expected_version,uow)` | atomic violation + record | composite CAS/append in one UoW | ref;conflict/invariant |
| `get_gap_with_version(gap_ref)` | PK read gap | committed read | versioned or None |
| `list_gaps_by_source(source_ref,page)` | source gap page | stable state/ref order | versioned page |
| `save_gap(gap,expected_version,uow)` | create/update gap | CAS | ref;conflict/state invariant |
| `get_degraded_output_with_version(degraded_ref)` | PK read degraded state | committed read | versioned or None |
| `save_degraded_output(degraded,expected_version,uow)` | create/update explicit output state | CAS;Blocked cannot silently become None | ref;conflict/state invariant |
| `append_gap_record(record,uow)` | append gap transition | same UoW as gap/degraded update | unit |

### 10.6 Reference / maintenance / job report repository

| 函数 | Store / 作用 | Transaction / version | 返回与错误 |
|---|---|---|---|
| `get_snapshot_with_version(snapshot_ref)` | PK read tracked snapshot | committed read | versioned or None |
| `list_snapshots_by_scope(scope,page)` | explicit/source-family/unhealthy/target listing | reads formal `reference_scope_index` only | versioned page;index inconsistency error |
| `save_snapshot(snapshot,expected_version,uow)` | create/update body-free snapshot | CAS;refresh record and applicable scope index same UoW | ref;conflict/body-boundary |
| `append_refresh_record(record,uow)` | append resolver outcome | same UoW as snapshot state | unit |
| `get_maintenance_with_version(maintenance_ref)` | PK read maintenance | committed read | versioned or None |
| `find_maintenance_by_target(target_ref)` | unique current target lookup | committed read from unique target index | versioned or None;duplicate target rows -> consistency error |
| `get_maintenance_target_scope_binding(target_ref)` | exact immutable canonical member set | committed read | binding or None;malformed/duplicate member -> consistency error |
| `bind_maintenance_target_scopes(binding,uow)` | first bind target to non-empty sorted/unique scopes and initialize its aggregate position/revision from all member scope rows | create-if-absent in Job start UoW;same set no-op,different set conflict;same-UoW target capture must read the staged binding/aggregate | unit or target-scope/member-position/read-your-writes conflict |
| `list_maintenance_by_scope(scope,page)` | maintenance target page | canonical scope index | versioned page |
| `save_maintenance(state,expected_version,uow)` | create/update stale/rebuild state | CAS | ref;conflict/state invariant |
| `get_replay_coordination_with_version(coordination_ref)` | PK read coordination | committed read | versioned or None |
| `save_replay_coordination(state,expected_version,uow)` | create/update coordination | CAS + replay/no-write refs required | ref;conflict/boundary |
| `get_rollup_rebuild_with_version(rebuild_ref)` | PK read rebuild | committed read | versioned or None |
| `save_rollup_rebuild(state,expected_version,uow)` | create/update rebuild state | CAS + source cursor non-regression | ref;conflict/cursor regression |
| `append_projection_maintenance_record(record,uow)` | append rebuild/refresh execution record | same item/finalize UoW | unit |
| `get_report_with_version(report_ref)` | PK read job report draft | committed read | versioned or None |
| `find_report_by_job(job_ref)` | unique local job execution lookup | committed unique index | versioned or None |
| `save_report(report,expected_version,uow)` | create/update Draft or finalize terminal report | CAS;terminal cannot be rewritten | ref;conflict/report invariant |

### 10.7 Projection store

| 函数 | 持久化语义 | Transaction / version | 失败处理 |
|---|---|---|---|
| `ObservationProjectionSourceReader.capture(scope,uow)` | resolve formal scope selector,read one complete bounded body-free source set,derive canonical targets/window,capture observation/reference upper positions and issue scope-bound read fence | must execute inside the same UoW later used by replace;no external call;does not persist or mutate | empty/incomplete/oversized source,unknown dependency/missing timestamp,position unavailable or fence unavailable -> item failure;never truncate or claim Fresh |
| `ObservationProjectionMembershipPlanner.plan_updates(changes,uow)` | read staged/current formal relations,expand all direct/indirect affected sources and return exact no-cursor plans | same accepted UoW before cursor assignment;read-your-writes;no persistence | malformed relation/item/ref/time,unbounded closure or incomplete affected-source expansion -> rollback accepted mutation |
| `record_committed_sources(updates,committed_cursor,uow)` | upsert current typed source record,replace each source's exact formal `(scope,role)` memberships,preserve stable source_observed_at,and advance every added/retained/removed scope plus affected bound target aggregate position/revision | same accepted source/reference UoW,after its sole cursor assignment and before outbox/stale/result;all updates use same tagged cursor;empty memberships means validated full withdrawal | aggregate membership,invalid item/ref/scope/role,duplicate update,cursor/time mismatch,index/position/target aggregate write failure -> rollback accepted mutation |
| `get_observation_read_model(scope)` | canonical scope lookup + body read | read-only | None -> missing/stale surface,不创建 view |
| `page_observation_read_models(scope,page)` | stable projection page | read-only | index inconsistency -> repository error |
| `replace_observation_read_model(view,source_position,expected_version,uow)` | body/metadata/dependencies/lookups + applied dual-watermark atomic replace | CAS | conflict rolls back item |
| `get_diagnostic_view(scope)` | canonical projection scope lookup + public view body read | read-only;request context never participates | None -> formal missing |
| `get_diagnostic_projection_with_version(scope)` | maintenance-only atomic read of view + current versioned scope body + immutable current summary | read-only;one composite version | missing member/pointer mismatch/scope mismatch -> consistency error;None only when canonical lookup absent |
| `replace_diagnostic_view(replacement,source_position,expected_version,uow)` | insert new immutable summary,replace stable scope body/view/current pointer,gap/dependency/lookup and applied dual-watermark as one composite | create-if-absent or exact composite CAS;validates all refs/scope/fence | conflict or any bundle mismatch rolls back whole item;no partial save |
| `get_gap_status(gap_ref)` | gap projection read | read-only | None -> missing/stale |
| `replace_gap_status(view,source_position,expected_version,uow)` | gap status + dependency + applied dual-watermark replace | CAS | conflict |
| `get_peripheral_export_view(consumer_ref,scope)` | canonical consumer/scope lookup | read-only | None -> unavailable/missing |
| `get_peripheral_export_view_by_ref(view_ref)` | generated projection PK lookup for export Command/delivery validation | read-only;caller must validate loaded consumer against request | None -> rejected/missing;consumer mismatch -> boundary error |
| `replace_peripheral_export_view(view,source_position,expected_version,uow)` | view + consumer lookup + dependency + applied dual-watermark replace | CAS | conflict |
| `get_reference_snapshot_view(snapshot_ref)` | reference projection read | read-only | None -> missing/stale |
| `replace_reference_snapshot_view(view,source_position,expected_version,uow)` | view + lookup/dependency + applied dual-watermark replace | CAS | conflict |
| `get_rebuild_progress(target_ref)` | target progress read | read-only | None -> not-started/missing surface |
| `get_rebuild_progress_by_ref(progress_ref)` | generated progress identity lookup used by a persisted `Rebuilding { progress_ref }` surface | read-only;adapter returns the exact stored progress row and its target,never infers target from ref text | a referenced row missing,returned ref mismatch,or target/progress lookup disagreement is consistency error,not ordinary missing |
| `replace_rebuild_progress(view,source_position,expected_version,uow)` | progress + target lookup + applied dual-watermark replace | CAS;read fence scope must equal `ByMaintenanceTarget(view.target_ref)` | conflict / target binding or fence mismatch |
| `resolve_affected_views(source_refs,page)` | read existing view identities from dependency index | read-only,stable page | empty means no tracked views;不得拼 ref |
| `mark_views_stale(affected,committed_cursor,uow)` | monotonic stale marker upsert for explicit source/view set | same UoW as committed source/reference change;参数为 `ObservationCommittedCursor` | 同 namespace lower cursor is no-op or invariant error;cross-namespace cursor按独立 position保存,不得丢 tag 后比较 |

#### 10.7.1 `record_committed_sources` adapter algorithm

planner先保证同一UoW的`updates`按typed `source_ref` canonical排序且无重复；store再次验证后逐source执行:

1. 验证 `ProjectionSourceItem` variant、ref extractor、`ProjectionDependencyRole`、cursor namespace、scope eligibility符合 §9.4-a；每个 non-empty membership必须是普通 member scope,不得为`ByMaintenanceTarget`。
2. 读取 existing `projection_source_records` 和旧 membership set。首次 index 时接受formal object timestamp或planner从同一accepted boundary传入的time;已有 source 必须保持旧 `source_observed_at`,incoming值不同即 invariant error。
3. 由`record_committed_sources`的唯一`committed_cursor`参数构造并保存current typed `ProjectionSourceRecord`。update本身不得携带第二个cursor。`memberships=[]`仍执行该写入,并作为exact full withdrawal继续后续步骤。
4. 原子计算 added / retained / removed `(scope,role)`。insert added,保留/校验 retained,delete removed；所有 touched member scopes 都把当前 namespace upper position推进到committed cursor并将scope revision至少递增一次。
5. 找出包含任一 touched member scope 的 immutable target bindings。每个 target aggregate row在同一 UoW按member positions重新求namespace max并推进aggregate revision；不得从当前 update 的scope子集猜aggregate。
6. commit前验证source current row、membership set、member positions、target aggregate positions/revisions全部一致。任一失败回滚原 accepted mutation。

同一 source 的 retained membership 也推进position/revision,因为typed object body/state可能变化而scope集合不变。没有旧membership且incoming为空是合法的tracked-without-scope状态,但仍必须通过item/ref/time/cursor验证；它不会创建任何member scope row。

### 10.8 Idempotency / stored result / outbox

| 函数 | 持久化语义 | Transaction / version | 失败处理 |
|---|---|---|---|
| `reserve_or_load(context,uow)` | atomic insert-or-read by `(operation,actor,key)` plus optional Consumer source-event secondary unique | current start/accepted UoW | absent -> Acquired；Reserved same digest -> InFlight；Completed same digest -> Replay；different digest -> Conflict；不覆盖old row |
| `load_by_scope(scope)` | diagnostic/recovery lookup by exact actor-scoped logical key | read-only;typed operation required | None or reservation |
| `load_by_inbound_event(identity)` | resolve original reservation despite dedup-key drift | read-only;typed consumer/producer/source event | None or reservation；mismatch is consistency error |
| `mark_completed(reservation,result_ref,uow)` | bind existing stored result and terminal completion | same UoW,after `save_result` | missing result/incompatible operation -> invariant error |
| `save_result(result,uow)` | immutable exact replay surface append | before idempotency complete | duplicate ref/digest mismatch -> conflict |
| `get_result(result_ref)` | exact immutable result read | read-only | completed reservation + missing result -> consistency error,不得重建 |
| `append(record,payload,uow)` | one outbox marker + one immutable snapshot | same UoW as source change,cursor already assigned | identity/schema/digest mismatch rolls back source change |
| `list_eligible_with_payload(eligibility,cursor,limit)` | committed Pending or typed retryable Failed item + exact snapshot + version page | read-only;stable order;start freezes result intoJob plan | terminal/permanent Failed absent；missing snapshot consistency error,不得重建 |
| `mark_published(outbox_ref,receipt,expected_version,uow)` | Pending/eligible Failed -> Published CAS | short publication UoW + current global item fence | conflict means another worker won/stale claimant;truth unchanged |
| `mark_failed(outbox_ref,failure,expected_version,uow)` | Pending/Failed -> Failed CAS | short publication UoW + current global item fence | conflict;truth unchanged;never rewrite toPending |
| `mark_dead_letter(outbox_ref,reason,expected_version,uow)` | Pending/Failed -> DeadLettered CAS | short publication UoW | conflict;payload remains immutable |

### 10.9 Repository 停审

| 审查项 | 结论 |
|---|---|
| Step 07 persistence port 是否全部有语义 | pass |
| every existing-state save 是否有 version source | pass |
| append-only / mutable / replace 是否区分 | pass |
| singular find 的 uniqueness / deterministic rule 是否可实现 | pass,见 §12.3 |
| Query 使用的函数是否全部 read-only | pass |
| publisher 是否只能取得 stored payload | pass |
| fake 是否必须模拟冲突和 rollback | pass |

## 11. Version、cursor 与 identity 规则

### 11.1 `ObservationRepositoryVersion`

| 场景 | Allowed source | 禁止来源 | Save 规则 |
|---|---|---|---|
| existing truth/state update | corresponding `get_*_with_version` / versioned find/list | request field,clock,cursor,row id,external version | `Some(loaded.version)` |
| existing projection replace | corresponding projection get/page result | source cursor,maintenance state version | `Some(loaded.version)` |
| outbox publication update | `list_eligible_with_payload` item version frozen into immutable execution plan | event schema version,outbox cursor,claim token | exact non-optional version + current item fence |
| job report draft update | `get_report_with_version` / `find_report_by_job` | job execution ref,affected count | `Some(loaded.version)` |
| create new object | no prior row | hard-coded zero/one | `None`,enforced create-if-absent |
| append-only record/result/snapshot | no version | any synthetic version | append API only |

repository version:

- 仅在对应 row 成功 create/update 后推进。
- rollback 后新 version 不可见。
- 不要求跨 store 使用相同 version。
- serialization format 可由 adapter 决定,但 application-facing type 始终是 non-negative opaque counter。
- migration 若改变存储形状,不得把 old row 全部重置成同一可覆盖 version。

### 11.2 Observation / reference cursor

| 规则 | Observation cursor | Reference cursor |
|---|---|---|
| namespace | accepted observation-owned state change | reference-only snapshot / refresh change |
| allocator | `assign_observation_cursor` | `assign_reference_cursor` |
| allocation point | truth/state/history staged 后,outbox/stale/result 前 | snapshot/refresh staged 后,outbox/stale/result 前 |
| transaction count | one cursor at most per UoW | one cursor at most per UoW |
| use | outbox payload,stale marker,rollup/rebuild source position,report/progress traceability | reference stale marker,refresh progress,projection dependency freshness |
| rollback | cursor must not identify a visible commit;backend may leave a gap but must never reuse value | same |
| ordering | committed values strictly monotonic in namespace | committed values strictly monotonic in namespace |

跨两类 mutation 的 technical carrier 必须使用 `ObservationCommittedCursor::Observation(ObservationCursor)` 或 `ObservationCommittedCursor::Reference(ReferenceCursor)`。outbox、projection freshness marker 和 dependency freshness 保存完整 tag;同 namespace 可比较 position,跨 namespace 只能分别跟踪,不得比较裸数值或推导全局总序。

cursor 是 opaque committed-order marker,不是:

- row version;
- page cursor;
- event schema version;
- external source version;
- wall-clock timestamp;
- business sequence;
- completeness proof。

同一个 accepted UoW 产生多个 outbound event 时,它们共享该 UoW cursor,并以 `event_ref` / `outbox_ref` 提供内部稳定排序。消费者不得从 cursor gap 推断数据丢失。

### 11.3 Identity 与 singular lookup

| Lookup | Identity rule | 并发 / replacement rule |
|---|---|---|
| `find_receipt_by_source` | current binding keyed by `(source_ref,submission_purpose)`;repository input只有 source 时按非-superseded current + latest committed cursor 解析 | 创建 replacement 必须在同 UoW supersede old binding或命中 unique conflict;不得随机返回 |
| `find_safety_by_receipt` | one safety disposition per receipt | replacement 建新 receipt或显式 future protocol,当前不覆盖 terminal disposition |
| `find_correlation_by_receipt` | one current context per receipt | CAS update existing;不静默创建 second current |
| `find_authenticity_hint_by_handoff` | one current hint per handoff | terminal placeholder 不改成 real;new evaluation requires new handoff/hint according state matrix |
| `find_retention_by_protected_ref` | one current marker per protected ref | state transition updates same row |
| `find_delivery_by_preparation` | one current delivery marker per export preparation | delivery attempts append record,不创建 competing current markers |
| `find_report_by_job` | one report per local `JobRunRef` / mapped job execution ref | duplicate loads same report;不得创建 new terminal report |
| idempotency reservation | unique `(operation_name,actor_ref,idempotency_key)`；Consumer secondary unique `(consumer_operation,producer_family,source_event_ref)` | same digest loads old；different digest conflict；in-flight不执行第二writer；old result immutable |
| outbox snapshot | one record,one event ref,one payload snapshot | no payload replacement after commit |
| projection canonical lookup | one existing view ref per projection kind + canonical scope | rebuild replaces same view;missing lookup不得拼新 ref unless current flow is explicit create |

所有 generated identity 必须来自 Step 07 `IdGeneratorPort`。其中 evidence input、outbox record/event/snapshot、read model、diagnostic view、peripheral export view、rebuild progress、freshness marker和job report分别使用对应 `new_*_ref` 函数。canonical scope只作为lookup/index key;adapter 不从 scope、hash、timestamp、external id、path 或 payload body 拼接本仓 owned ref。

public `ObservationJobMetadata.job_execution_ref: JobExecutionRef` 经 `ObservationJobRunnerContext::from_metadata` lossless 包装为 application-local `JobRunRef`。该转换不生成第二个 run identity,也不把 scheduler ref 宣称为真实 external execution / CI / acceptance run id。

## 12. Transaction boundary

### 12.1 总表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同 UoW 必须完成 |
|---|---|---|---|---|
| accepted Command | application service after metadata validation | exact result + idempotency complete 后 | validation after reserve,missing dependency,policy/state/CAS/outbox/result/commit error | reservation,truth/state,history,cursor,outbox snapshot,stale marker,result,complete |
| accepted local Consumer | envelope/schema validation 后 | stored consumer receipt + complete 后 | payload boundary,missing required local relation,CAS/outbox/result error | local state/snapshot/history,cursor,optional outbox/stale,result,complete |
| unsupported/rejected Consumer | normally no UoW | no commit | not applicable | 不解析 payload、不写 local truth;若 Step 12 定义 durable rejection,必须独立短 UoW |
| outbox publish item | immutable plan item loaded and global item claim acquired 后 | publication marker + plan/report classification CAS 后 | token/payload/probe/fence/CAS/repository/commit error | current claim fence,outbox marker,plan item outcome,report classification |
| projection / rollup / gap / reference item | immutable plan item loaded and global item claim acquired 后 | item state/view/plan/report draft update 后 | guard/source-version/read-fence/execution-fence/CAS/replace/report error | current claim fence,item-owned derived state/history/view/progress,plan item outcome,report draft |
| rebuild Job start | validated operation context / canonical bounded work-set 后 | reservation + immutable plan + target-scope binding + Draft report + maintenance Rebuilding + target progress 后 | reserve outcome,binding/replay/policy/state/capture/CAS/create error | idempotency reservation,execution/plan,binding,report,maintenance record/state,target-scoped progress |
| rebuild Job scope item | start UoW committed and item claim acquired 后 | one scope's read model + diagnostic composite + dependencies/freshness + plan/report success classification 后 | capture/guard/assembly/read-fence/execution-fence/CAS/report/commit error | one scope replacement and one mutually exclusive plan/report classification;no target Fresh transition |
| rebuild Job failure accounting | failed item rollback and a valid current claim exists 后 | failed scope/reason written to plan + Draft report 后 | report/plan missing or terminal,execution-fence/CAS/commit error | plan/report failure classification only;no projection/progress/source write |
| Job finalize | no plan item is Planned/Running、every item has valid finalizable outcome and execution claim acquired 后 | terminal report + exact result + completed reservation 后 | claim/membership/freshness/completeness/fence/report/result/complete/commit error | target recapture/progress + maintenance terminal-for-attempt transition when applicable,plan/report/result/idempotency complete |
| handoff/export prepare intent | readiness/visibility/retention/no-write accepted 后 | immutable preparation intent token + plan progress 后 | guard/token/plan/report/CAS error | stable body-free token committed before external prepare |
| handoff/export delivery intent | prepared result已local finalize 后 | immutable delivery intent token + plan progress 后 | preparation/token/plan/report/CAS error | stable body-free token committed before external deliver |
| handoff/export local finalize | external probe/call returned formal result 后 | prepared/delivered/failed marker,history,outbox/plan/report 后 | token/fence/CAS/invariant/outbox/report error | local delivery facts only;external success never repeated merely because finalize failed |
| Query | no write UoW | not applicable | read/map error | nothing;no outbox/history/result/refresh/rebuild |

### 12.2 Accepted mutation 固定顺序

所有 Command 和单事务 local Consumer accepted path 使用以下不可交换顺序:

```text
1. validate metadata / envelope and normalize digest
2. begin UoW
3. reserve_or_load(context,uow),atomically binding operation + actor + key + digest + optional inbound event identity
4. Acquired/Replay/Conflict/InFlight branch before resolver or domain transition
5. versioned load local truth/state and read required body-free snapshots
6. run policy guards and domain transition
7. save changed truth/state with expected_version
8. append mandatory history / audit record
9. plan exact post-commit projection memberships from staged/current typed relations
10. assign exactly one observation cursor or reference cursor
11. record committed projection source records/memberships,advance member and target positions/revisions
12. when a committed event exists,resolve its exact `OutboundEvent(event_name)` binding from the injected application catalog and append immutable outbox record + payload snapshot carrying that `effect_binding_ref`
13. resolve existing affected views and mark them stale with the assigned cursor
14. serialize and save exact StoredObservationResult replay surface
15. mark idempotency completed with the stored result ref
16. commit UoW
17. return the exact committed response surface
```

约束:

- Step 9 planner必须读取当前UoW staged + committed formal relations,并扩展全部直接/间接受影响source；它只输出无cursor计划,不得写index。
- Step 10 前不得记录source position或append payload snapshot,因为index/outbox/stale marker必须引用assigned committed cursor。
- Step 12 binding resolution is application-local and must return exactly one `EventPublisher/Publication` binding；missing/duplicate/family/capability mismatch rolls back the accepted mutation。Raw endpoint/topic/credential is not read or persisted in this UoW。
- Step 14 必须在 Step 15 前,否则 duplicate 可能指向 missing result。
- event publication 不在该 transaction 内。
- source-scope index / position update 是 source mutation 的 mandatory technical write;失败必须 rollback accepted mutation。affected view resolution 若 dependency index 无记录可返回 empty set,但 source position仍必须推进以支持 future first create;不得拼 view ref。
- `source_index_updates` 必须覆盖本次所有changed projection-source objects及因formal relation变化而间接受影响的existing sources,包括exact membership变为空的对象；不允许通过省略update表达withdrawal。first-index无formal object time的对象在进入UoW前由boundary `ClockPort`捕获一次,重试/更新从source record复用,不得在repository adapter内部调用clock。
- rollback 后必须从 stored result store 读取 duplicate response;不得返回尚未提交的内存 result。

### 12.3 16 个 Command 的同事务写集

| Command flow | Versioned load | Mandatory owned writes before cursor | Cursor 后 mandatory / conditional writes |
|---|---|---|---|
| `SubmitObservationMaterial` | existing receipt by source if any | receipt,safety disposition,IntakeDecisionRecord | receipt event if committed,affected views,result,complete |
| `RecordSafetyDisposition` | receipt + disposition | disposition,linked receipt transition,IntakeDecisionRecord | safety/receipt event,stale,result,complete |
| `BindCorrelationContext` | receipt,current context if any | correlation context,CorrelationLinkRecord | optional event/stale,result,complete |
| `RecordSafeSignal` | correlation,signal/rollup if existing | safe signal,applicable rollup state,CorrelationLinkRecord | signal event,rollup/diagnostic stale,result,complete |
| `AppendAuditProjection` | correlation,projection if existing | audit projection,AuditAppendRecord | audit event,timeline/handoff stale,result,complete |
| `LinkBodyFreeEvidence` | projection,linkage if existing | evidence linkage,AuditAppendRecord | linkage event,handoff/evidence views stale,result,complete |
| `PrepareReportHandoff` | evidence linkages/audit projections/gaps,retention,handoff if existing | validate and append immutable evidence-index input snapshot;handoff + HandoffLifecycleRecord | handoff event,report/peripheral stale,result,complete |
| `EvaluateAuthenticityHint` | handoff,current hint | authenticity hint,handoff readiness/lifecycle | handoff event,stale,result,complete |
| `SetRetentionMarker` | marker + active protection | retention marker,RetentionChangeRecord | retention event,maintenance/handoff stale,result,complete |
| `ProtectActiveReference` | protection + marker | protection,applicable marker transition,RetentionChangeRecord | retention event,stale,result,complete |
| `DefineReplayScope` | existing scope / retention / no-write refs | replay scope | optional local event/stale,result,complete |
| `RecordNoWriteViolation` | violation if existing | atomic violation + NoWriteViolationRecord | violation event,diagnostic stale,result,complete |
| `RecordGapState` | gap + degraded state | gap,degraded output,GapTransitionRecord | gap event,affected views stale,result,complete |
| `PrepareExternalAuditExport` | export preparation/view/visibility | export preparation,optional delivery marker | peripheral event/stale,result,complete |
| `RegisterReferenceSnapshot` | current snapshot by subject | snapshot + ReferenceRefreshRecord | reference cursor,event,affected stale,result,complete |
| `UpdateReferenceSnapshotState` | snapshot | snapshot + ReferenceRefreshRecord | reference cursor,event,affected stale,result,complete |

conditional outbox 表示只有 Step 09 / Step 08 mapping 规定 committed event 时才 append;没有业务变化的 no-op 不得伪造 event。

### 12.4 9 个 Consumer transaction ordering

| Consumer | Pre-UoW gate | Accepted local write set | Forbidden write |
|---|---|---|---|
| `ConsumeBusObservationMaterial` | envelope required fields/schema before payload parse | receipt,safety,decision,cursor,outbox/stale,stored consumer receipt | source body/business truth |
| `ConsumeSourceAuditMaterial` | schema + body-free audit ref | audit projection/input marker,audit record,gap when needed,cursor,result | source audit body/Governance decision |
| `ConsumeIdentityObservationContext` | schema + subject ref | reference snapshot,refresh record,reference cursor,stale,result | identity profile/lifecycle |
| `ConsumeGovernanceAuditContext` | schema + evidence ref/digest | body-free reference snapshot or gap,refresh/audit marker,result | governance truth/body |
| `ConsumeArtifactEvidenceContext` | schema + linkage purpose/digest | linkage input/snapshot/gap,records,cursor,result | artifact/evidence body |
| `ConsumeRuntimeSignalSummary` | schema + safe signal summary ref | safe signal input/snapshot/correlation gap,records,cursor,result | runtime execution truth/raw signal |
| `ConsumeSandboxSignalSummary` | schema + safe summary | safety/signal marker or reference snapshot,quarantine/gap,result | sandbox body/result truth |
| `ConsumeArchiveHandoffFeedback` | schema + known handoff/ref | handoff lifecycle/delivery marker,record,cursor,outbox,result | archive package/recovery truth |
| `ConsumeReportConsumerFeedback` | schema + known delivery/consumer | peripheral delivery,gap,records,cursor,outbox,result | report consumer/external audit truth |

duplicate:

1. `reserve_or_load(context,uow)` finds same digest and stored result ref；source-event secondary identity resolves the original reservation even if dedup key drifted;
2. rollback current UoW;
3. load exact stored `ObservationConsumerReceipt`;
4. return duplicate outcome without parsing payload,calling resolver,or writing state。

每个会更新reference/snapshot/projection输入的Consumer还必须在domain transition前比较同producer + same source的`ObservationSourceVersionRef`。Older version返回no-write stale/duplicate classification；equal version必须与原digest兼容；newer version才允许继续CAS。Version缺失时只能按协议定义的degraded/unknown-order surface处理，禁止用`occurred_at`、本地clock、schema version、cursor或repository version猜顺序。

### 12.5 Publisher transaction ordering

```text
Job start UoW:
  reserve_or_load(context,uow);only Acquired may list candidates
  list_eligible_with_payload([Pending,RetryableFailed],cursor,limit)
  validate and freeze exact record/snapshot/version/effect-binding/token material into immutable plan
  persist the relevant JobExecutionConfigSnapshot and include its canonical digest in plan_digest
  save plan + config snapshot + Draft report;commit

one planned publication item:
  load immutable plan item;terminal item performs no external call
  acquire global Outbox(outbox_ref) claim and fresh fencing token
  reload exact stored payload and validate it against planned digest/version/effect_binding_ref
  probe the stable ObservationPublicationToken first when a prior call outcome is unknown
  call publish(token,exact stored payload) outside UoW only when probe/recovery permits
  begin short UoW;reload outbox + plan + Draft report
  register current item fence
  mark_published OR mark_failed OR mark_dead_letter with frozen expected version
  classify the same plan item and report exactly once;commit
```

publisher 外部调用期间不得持有数据库事务。`Failed`不转换回`Pending`;typed retryable failure由下一次Job start的eligible selector选入新execution,而same execution resume只读取原plan。`ObservationPublicationToken(effect_binding_ref,event_ref,outbox_ref,payload_digest,schema_version)`在所有attempt稳定，且 `effect_binding_ref` 只能从stored snapshot复制。publish success但local finalize失败或不确定时必须先用同token probe；known external success只做finalize-only。任何分支都不得回滚original truth、重建payload、改写event ref、改用current binding或宣称cross-system exactly-once。

### 12.6 Staged Operations Job ordering

#### Start UoW

```text
validate job metadata and normalized digest
begin
reserve_or_load(context,uow)
if Replay:rollback and replay exact stored report
if Conflict/InFlight:rollback without listing or creating an execution
if Acquired:derive the single execution_ref and freeze the complete bounded work-set
derive and persist the operation-specific JobExecutionConfigSnapshot;for external effects resolve exact typed subject binding once
create ObservationJobExecutionPlan with canonical unique work keys,immutable planned inputs,and config snapshot digest
create ObservationJobReportDraft(Draft) linked to execution_ref/plan_ref/plan_digest
for target-scoped rebuild: canonicalize and bind exact non-empty member scopes
on first bind:initialize ByMaintenanceTarget aggregate dual position/revision from every member row
derive Scheduled authorization,or load/validate optional Approved ReplayScope;load target maintenance by unique lookup
if maintenance is absent:create generated Stale maintenance,then start Rebuilding
if maintenance exists:CAS Stale -> Rebuilding after policy/target/binding checks
capture ByMaintenanceTarget(target) in this UoW
create/replace target progress as Rebuilding with the target-scoped source position
append maintenance start record and save report progress ref
commit
```

首次 target bind 后的 capture 依赖 transaction read-your-writes:它必须看到本 UoW staged binding和刚初始化的aggregate row。若存储实现无法提供该语义,整个 start UoW adapter不合格,不能以commit后另开事务capture替代,因为binding/maintenance/progress/report将失去原子成立关系。

#### Item loop

```text
load one exact item and its JobExecutionConfigSnapshot from the committed immutable plan;never relist or read current config on resume
skip Succeeded/FailedPermanent/Blocked/SkippedTerminal;for FailedRetryable follow current Draft execution retry policy;otherwise acquire its global typed work-key claim
reload current local owner and recheck planned identity/version,source version,state,retention,visibility and no-write
call resolver/publisher/delivery outside UoW with the stable planned token and frozen effect binding when applicable
begin short item UoW
versioned reload plan,every mutable local owner,report and target-scope binding
register the current item claim fence
recheck state / retention / visibility / no-write guard and source-version monotonicity
capture one complete bounded source snapshot for the canonical item scope
assemble detached derived objects from captured items only
replace only this scope's views/dependencies/freshness with expected_version
update plan item and report draft with exactly one compatible success classification
validate both the same-UoW source read fence and execution claim fence
commit item UoW

on item failure:rollback first,retain/reacquire a valid claim,then open a separate short UoW
reload plan + Draft report,register the current fence,and add exactly one failed/gap classification
commit failure accounting without any view/progress/source write
```

#### Finalize UoW

```text
acquire/reuse the current execution claim and fresh fencing token
begin
load immutable plan + report draft with versions
register the current execution fence
for target-scoped rebuild:load immutable target-scope binding and recapture ByMaintenanceTarget(target)
verify no plan item is Planned/Running,every finalizable item has a valid structured outcome,and report sets/reason equal their canonical fold
verify each successful member view/diagnostic marker is still fresh against its own dual watermarks
if all members succeeded:CAS maintenance Rebuilding -> Fresh and target progress -> completed
if any member failed/staled:CAS maintenance Rebuilding -> Failed or Stale and keep explicit progress/report surface
transition Draft to exactly one terminal JobReportState
save report with expected_version and fencing token
save exact StoredObservationResult(JobReport) with idempotency/operation/actor/request-digest compatibility fields
mark idempotency completed
commit
```

Start / item / failure-accounting / finalize 是互不嵌套的短 UoW。Job失败不能回滚已经提交的earlier item。Immutable plan是exact completeness owner；report、target binding和progress是可见摘要/guard，不得替代plan。Resume必须复用原plan和 `JobExecutionConfigSnapshot`，只处理未终态或明确retryable item；不得读取current config、route或target替换原binding。Fresh claim token、source read fence、mutable row version三类证明必须同时成立。Finalize known failure只重做finalize；unknown outcome先probe plan/report/result/reservation。一个item read fence不能证明target Fresh，claim也不能证明source-set一致。

### 12.7 9 个 Job 的持久化写集

| Job | Item UoW writes | External call cut | Final report requirement |
|---|---|---|---|
| `PublishObservationOutbox` | outbox publication marker + report draft progress | publisher call outside UoW | published/failed/dead-letter refs complete |
| `RebuildObservationReadModels` | start:binding/maintenance/progress/report;item:read model + diagnostic view/scope/new immutable summary + dependency/freshness + report;finalize:target progress/maintenance/report/result | none required;source reader is local persistence read only | every bound scope exactly classified;Fresh only if all member markers and target fence pass |
| `RebuildSignalRollups` | rollup window,rebuild state,maintenance record,progress,report | none;reads stored safe signals only | rebuilt/failed windows and stale gaps |
| `RefreshReferenceSnapshots` | snapshot,refresh record,reference view,scope index,stale marker,report | resolver call outside item UoW | resolved/invalid/unavailable refs explicit |
| `ScanObservationGaps` | gap/degraded state,transition/scan record,gap view,report | none required | opened/updated/failed source refs |
| `CoordinateObservationReplay` | replay coordination,execution record,maintenance/progress,violation/gap when blocked,report | any source adapter is read-only and outside UoW | no-write/retention outcome explicit |
| `PrepareReportHandoffDelivery` | handoff state/lifecycle,preparation/receipt refs,stale/outbox,report | prepare + deliver outside UoW | no verdict/signoff/run id/evidence alias |
| `PrepareExternalAuditExportDelivery` | export preparation,delivery state/record,outbox/report | prepare + deliver outside UoW | body-free package/receipt/failure refs |
| `RebuildPeripheralViews` | peripheral view,dependency/lookup,delivery/progress state,report | none required | rebuilt views,failed consumers,gaps |

### 12.8 Report handoff / export external-call ordering

```text
Phase A: local start and preparation intent
  reserve job + create immutable plan/report draft
  versioned read handoff/export marker and required body-free view
  evaluate readiness / visibility / retention / no-write
  resolve exact ReportConsumer/PeripheralConsumer binding from injected catalog
  freeze effect binding in JobExecutionConfigSnapshot + plan digest
  generate and persist stable preparation intent token,including the same effect binding ref,in plan/local intent store
  commit before any external prepare call

Phase B: external prepare/probe, no DB UoW
  if prior outcome unknown,probe exact preparation token first
  call prepare_handoff(token,...) or prepare_export(token,...) only when allowed
  begin short UoW
  versioned reload local owner + plan + report;register item fence
  save Prepared state + lifecycle/delivery record + preparation ref + plan/report progress
  commit

Phase C: local delivery intent
  begin short UoW
  reload exact committed preparation + plan/report;register item fence
  generate and persist stable delivery intent token derived from the exact preparation and copying the original effect binding ref
  commit before any external delivery call

Phase D: external delivery/probe, no DB UoW
  if prior outcome unknown,probe exact delivery token first
  call deliver_handoff(token,preparation) or deliver_export(token,package) only when allowed

Phase E: local finalize
  begin short UoW
  versioned reload owner/plan/report;register item or execution fence
  recheck terminal / cancellation / protection state
  save Delivered or Failed local marker + append record + plan item classification
  assign cursor and append applicable outbox snapshot
  finalize report + stored result + idempotency
  commit
```

每个intent包含typed `intent_ref`、immutable `effect_binding_ref`、local subject/preparation/view/consumer refs和stable material digest；不得包含attempt、claim、clock、endpoint、route、credential或external body。外部receipt只证明adapter报告了一次transport result。只有Phase E commit后，本仓`ReportHandoffState` / `PeripheralDeliveryKind`才成立。External success后local known failure只能finalize-only；unknown先按local marker/result和exact token probe。`Unknown` / `Unsupported`不得映射为NotPrepared/NotDelivered，也不得blind retry。具体timeout/backoff/lease数字后移Step 14/`04`，但binding freeze、token-before-call和probe-before-repeat不可配置关闭。

### 12.9 Query no-write boundary

14 个 Query 均遵守:

| 允许 | 禁止 |
|---|---|
| committed get/find/list/page | `begin` / `commit` / `rollback` write UoW |
| read projection/reference/history/report | save/append/replace/mark stale |
| evaluate visibility/freshness in memory | refresh reference,probe 后写 snapshot |
| return missing/not-visible/stale/rebuilding/failed/disabled/degraded | close gap,repair projection,advance cursor |
| map application page to public page | save stored result/idempotency reservation |

`GetDiagnosticView` 在该no-write边界内使用以下完整读取顺序:

1. 只用canonical `ObservationProjectionScope`调用`get_diagnostic_view(scope)`；`DiagnosticRequestContextRef`、actor、visibility metadata和requested time均不得参与lookup或持久化。lookup absent是普通`NotFound` surface；present但`view.scope`或stale marker identity不一致是consistency error。
2. `DiagnosticView.diagnostic_freshness`只解释current immutable `DiagnosticSummary` completeness；`DiagnosticView.freshness`只解释persisted dual-watermark projection freshness。两者不得互相推导或覆盖。
3. 若persisted freshness为`Rebuilding { progress_ref: Some(ref) }`,必须调用`get_rebuild_progress_by_ref(ref)`；`None`、missing row、returned ref mismatch均为consistency error。随后按progress中的typed `target_ref`读取`find_maintenance_by_target`和`get_maintenance_target_scope_binding`。
4. progress identity、progress内嵌rebuild surface、progress freshness、maintenance progress ref、maintenance `Rebuilding`状态、target identity和binding target必须自洽。普通请求scope必须是binding member；`ByMaintenanceTarget(t)`只允许`t == binding.target_ref`。任一失败均不得猜target、拼progress/cursor或降级为普通missing。
5. visibility、diagnostic summary mapping、degraded merge和`ObservationConsistencyHint` body gate全部在内存完成。response始终保留exact persisted freshness/availability/rebuild surface；body是否为空不反向修改这些surface。

| `ObservationConsistencyHint` / persisted state | committed body规则 | 必须保留的surface |
|---|---|---|
| `RequireFresh` + Fresh | visibility允许且availability为Available时返回 | exact Fresh / availability / visibility |
| `RequireFresh` + Stale / Rebuilding / Unknown | `view=None` | exact Stale marker或validated Rebuilding surface或Unknown；不等待 |
| `AllowStale` + Fresh / Stale / Rebuilding | visibility允许且availability为Available时可返回已有committed body | stale marker或validated rebuild surface不得改写为Fresh |
| `BestEffort` + Fresh / Stale / Rebuilding | visibility允许时可返回最安全committed body；Unavailable仅在existing degraded surface明确`limited_consumption_allowed=true`时允许 | exact availability + merged degraded + freshness/rebuild |
| 任意 hint + Unknown / Disabled / Failed / blocked / not-visible | 不返回body | exact missing/availability/visibility/freshness；不得构造placeholder |

`ObservationConsistencyHint` 是transient request preference,没有logical store、version、cursor或idempotency landing。`Rebuilding` validation读取的progress、maintenance和binding也全部是committed no-UoW read；Query不能借此start/finalize Job、replace progress、close gap或mark projection Fresh。

`ReadAccessRecord` 不能成为绕过规则的借口。若 Step 15 需要 durable read audit,必须设计独立 asynchronous accepted audit envelope / consumer;当前 Query response path 不等待也不执行该写入。

### 12.10 Projection source snapshot / read-fence algorithm

`ObservationProjectionSourceReader.capture(scope,uow)` 不是普通分页查询。durable adapter 与 in-memory fake 必须实现以下等价步骤:

1. 校验 `scope` typed variant。普通 item scope 直接选择一组正式 repository/index predicates;`ByMaintenanceTarget(target)` 必须先读取 immutable `maintenance_target_scope_bindings`,再对全部 member predicates 做 union。start UoW first bind时该读取必须包含transaction-local staged binding。禁止解析 ref 字符串、扫描 serialized body 或临时全表猜测。
2. 在当前 `uow.transaction_ref()` 对应的 consistent read snapshot 内读取 `projection_source_scope_index` 全部成员,按 item kind + typed source ref稳定排序,join `projection_source_records` 后再join对应 typed repository current row,形成 scoped records。index dangling、source record与current owner不一致、item/ref owner不匹配或同一`(member_scope,source_ref,role)`重复均为一致性失败。零membership source record不属于任何capture result。
3. 校验所需 family completeness,并按typed source identity对 records做canonical dedup、scope membership检查和non-empty `target_refs`生成。同一 source/role 经多个bound member scope进入`ByMaintenanceTarget` union是合法重叠,必须折叠为一个`ProjectionSourceRecord`,不能误报duplicate；若同一source出现不同item body/time/cursor则为一致性失败。所需 family由有限 `ProjectionSourceItem` + dependency role映射确定;任何声明依赖无法判断完整性时失败。当前read-model/diagnostic rebuild不允许用empty set创建Fresh projection。
4. 从每个 source record 的本仓 `source_observed_at` 计算 `DiagnosticTimeWindow { starts_at=Some(min), ends_at=max }`。若 metadata缺失、范围不可界定或超出配置上限,返回item failure;不得用external occurred_at、`ClockPort.now`、job requested_at或默认epoch补齐。
5. 在同一 read snapshot 读取 `projection_scope_positions` 的 observation/reference upper positions与scope revision。projection 对namespace有依赖时position必须为`Some`;只有正式依赖映射为no-dependency时才能为`None`。每条record tagged cursor不得超过对应captured upper position。`input.source_cursor`仅在application层验证captured observation position `>= minimum`,不参与source filtering。
6. 创建 `ProjectionReadFence { transaction_ref:uow.transaction_ref(), scope, scope_revision }` 并注册commit validation。adapter可额外使用serializable predicate/range fence;无论实现方式,commit必须检测capture后会改变该scope membership、upper position或revision的并发提交。

`ByMaintenanceTarget(target)` 的 Step 5 position/revision必须来自target aggregate row,并与当前binding全部member positions重新计算结果相等。首次bind的aggregate revision不是常量零:adapter创建一个新revision值并绑定到本UoW读取的member position snapshot；同UoW后续capture据此签发fence。member无对应namespace dependency时不参与该namespace max；任一有dependency的member position缺失则start/finalize失败,不得用`None`替代。

返回后 application 只可从 `ProjectionSourceSnapshot.items/target_refs/diagnostic_time_window` 组装 view;不得在 capture 与 replace 之间调用 resolver、publisher、delivery port或额外读取 mutable source来补字段。所有使用该 snapshot 的 `replace_*` 必须收到原 `source_position`,且在 adapter 内验证:

```text
source_snapshot.scope == replacement canonical scope
source_position.read_fence.scope == replacement canonical scope
source_position.read_fence.transaction_ref == current uow.transaction_ref
source_position.read_fence.scope_revision == current scope revision at commit
captured source set is complete and within the configured bound
captured namespace positions satisfy the projection dependency declaration
commit-time fence validation still passes
```

任一条件失败时整个 item rollback。first create 也不能跳过 fence:canonical lookup absent 只允许生成新 identity,不降低 source completeness、watermark或并发证明要求。

## 13. 一致性策略

| 关系 / 场景 | 一致性模型 | 成立条件 | 失败 / 延迟 surface |
|---|---|---|---|
| receipt + safety + decision | local strong consistency | admission transition、safety disposition、mandatory history 同 UoW | rollback / rejected / quarantined / degraded |
| correlation + safe signal | local strong consistency | body-free source/context valid;signal and mandatory record atomic | partial / invalid / gap,不保存 raw signal |
| audit projection + append record | local strong consistency | source audit ref、subject、correlation、record all present | pending/restricted/suppressed/gap |
| evidence linkage + digest/purpose | local strong + reference validity | body-free ref,digest,purpose and projection valid | not-visible/stale/body-blocked/gap |
| evidence-index input + handoff | local strong consistency | complete preview constituents validated,immutable snapshot appended before handoff references it | reject/block;ref-only or mismatched preview commits nothing |
| handoff state + readiness + hint | local strong consistency | same handoff version and lifecycle record;readiness guards pass | pending/blocked/degraded/failed |
| retention + active protection | local strong consistency | release rechecks current protection version/set | active hold/conflict;never source delete |
| replay + no-write guard | local strong consistency | scope/effect/guard refs valid in item UoW | blocked/failed + violation/report |
| gap + degraded output | local strong consistency | explicit gap reason/source and output classification | open/acknowledged/suppressed/blocked |
| outbox record + payload + source truth | local strong consistency | same UoW,one cursor,identity/digest/schema equality | append failure rolls back source mutation |
| idempotency + stored result | local strong consistency | actor-scoped typed reservation and exact compatible result saved before complete | InFlight/conflict不产生第二writer；missing/mismatch result是consistency error,no rerun |
| inbound source version + local snapshot/projection input | producer-scoped monotonic guard + local CAS | only a trusted producer/resolver marker is comparable within the same producer/source namespace | older no-write；missing/unknown explicit degraded；never order by time/cursor/schema/local version |
| job plan + claim + report + stored result | staged local consistency + fenced short UoW | immutable work-set,global typed work claim,monotonic fence,lossless report and exact terminal replay surface | stale claimant rejected；draft/partial progress remains recoverable |
| external source -> local reference snapshot | eventual + body-free boundary | resolver result persisted as state/record | stale/unresolved/invalid/unavailable |
| truth -> projection / rollup / diagnostic | eventual + monotonic cursor | stale marker at source commit,rebuild from committed facts | stale/rebuilding/failed/unavailable |
| diagnostic view + scope + summary | local strong inside one projection replacement | stable view/scope/marker identities,new immutable summary,scope/view/ref equality and one composite version | old complete bundle remains visible or new complete bundle commits;never partial |
| maintenance target -> member scopes | immutable local binding + staged rebuild | first Job start binds exact canonical set;all later item/finalize reads use same set | conflict/blocked;never silently add/drop scope |
| source membership -> member/target position | local strong consistency | typed source record、exact membership replacement、all touched member positions and bound-target aggregate revisions in one accepted UoW | rollback accepted mutation;old projection remains stale/old |
| truth -> outbox publication | transactional outbox + at-least-once delivery | immutable payload + effect binding committed,global item fence,stable publication token,publication marker CAS | pending/failed/dead-lettered/indeterminate probe；binding unavailable is manual,not reroute |
| handoff/export external delivery | eventual + local marker consistency | stable prepare/deliver intent + effect binding committed before call,external call outside UoW,probe before uncertain repeat,local result finalized by fence + CAS | prepared/pending/failed/indeterminate/manual；never switch destination on resume |
| duplicate / out-of-order input | idempotent + state monotonic | operation/key/digest match;state matrix prevents regression | duplicate replay/conflict/delayed/dead-letter |
| Query read | committed read + explicit freshness | no local write,body only when visibility、availability和`ObservationConsistencyHint`共同允许；Rebuilding linkage先完整校验 | missing/not-visible/stale/rebuilding/degraded/consistency error |

## 14. Cross-store consistency invariants

| Invariant ID | 必须恒真 | Enforced at |
|---|---|---|
| `PCI-OBS-001` | Accepted receipt 引用的 safety disposition 必须存在且为 Safe/Redacted;Rejected/Quarantined 不得进入 normal signal/audit path | intake UoW + repository FK/equivalent validation |
| `PCI-OBS-002` | `safety_dispositions.receipt_ref` 与 receipt.`safety_disposition_ref` 双向一致 | same UoW save |
| `PCI-OBS-003` | SafeSignal 的 correlation context 存在且未 Invalid;summary/body boundary validation 已通过 | signal UoW guard |
| `PCI-OBS-004` | Rollup source cursor 不小于上一 committed cursor,且只聚合 stored SafeSignal | rollup CAS |
| `PCI-OBS-005` | AuditProjection subject/source/correlation refs 必须 body-free;latest append ref 必须指向同 UoW record | audit UoW |
| `PCI-OBS-006` | EvidenceLinkage projection/purpose/digest/boundary ref 全部存在,唯一关系不重复 | linkage unique key + UoW |
| `PCI-OBS-006A` | Handoff 引用的 EvidenceIndexInputView 必须已在同一或更早 committed UoW immutable保存,且每个 linkage/projection/gap ref 在 accepted validation 时存在 | handoff accepted UoW |
| `PCI-OBS-007` | Handoff state/readiness 在同一 row/version;Ready 不得与 required gap/no-write/retention block 冲突 | handoff CAS + policy |
| `PCI-OBS-008` | AuthenticityHint.handoff_ref 与 handoff.authenticity_hint_ref 一致;placeholder 不可被原地升级为 real | same UoW or guarded two-row UoW |
| `PCI-OBS-009` | Retention Released 前 active protection 集为空且 marker 已从 ReleaseEligible 转换 | retention UoW recheck |
| `PCI-OBS-010` | ReplayCoordination 必须回指 Approved replay scope 和 no-write guard;execution record 不得声明 source repaired | replay item UoW |
| `PCI-OBS-011` | NoWriteViolation 与 mandatory violation record 同时可见或同时不可见 | composite repository write |
| `PCI-OBS-012` | Gap.degraded_ref 若存在,对应 degraded output 必须指回同 gap;Blocked 不得映射成 visible success | gap UoW + projection assembler |
| `PCI-OBS-013` | Reference snapshot 只含 body-free safe summary;latest refresh ref 指向同 snapshot | reference item UoW |
| `PCI-OBS-014` | Projection body、version、canonical lookup、dependency rows、freshness metadata 同一 replace UoW;source position fence scope/transaction 必须匹配该 replacement | projection adapter + UoW commit validation |
| `PCI-OBS-014A` | Diagnostic composite 恒满足 `view.scope == scope.projection_scope`,`view.diagnostic_scope_ref == scope.scope_ref == summary.scope_ref`,`view.diagnostic_summary_ref == summary.summary_ref`,`view.diagnostic_freshness == summary.freshness`;`view.freshness`来自同一sidecar双水位;view/scope/marker identity replacement时保持,summary ref每次新生成 | diagnostic composite CAS |
| `PCI-OBS-014B` | Maintenance target 只有一个 immutable canonical non-empty member-scope set;同 target 重试可复用相同 set,不同 set 必须 conflict | target-scope unique binding + Job start UoW |
| `PCI-OBS-014C` | Target maintenance/progress Fresh 需要所有 bound member read/diagnostic markers各自通过双水位 freshness,且 finalize 的 `ByMaintenanceTarget` fence仍有效;任一 item fence不能代替target fence | rebuild finalize UoW |
| `PCI-OBS-014D` | 每个 projection source 的current typed record、stable `source_observed_at`、exact post-commit membership set和tagged cursor一致；空set只表示full withdrawal,旧membership全部删除且所有旧scope revision推进 | accepted source/index UoW |
| `PCI-OBS-014E` | first target bind同时从全部member positions初始化`ByMaintenanceTarget` aggregate row；同UoW target capture read-your-writes；后续任一member position/revision变化都推进该target aggregate revision | bind / source-index UoW + capture fence |
| `PCI-OBS-014F` | Diagnostic view若持久化`Rebuilding { progress_ref }`,该ref必须同时命中唯一progress row、progress内嵌surface/freshness、同target Rebuilding maintenance和覆盖请求scope的immutable binding；任一索引/引用不得分叉 | progress replace / maintenance start UoW + Query referential-integrity read |
| `PCI-OBS-015` | observation/reference stale/applied watermark 在各自 namespace 只能前进;Query不得改fresh;跨namespace不得比较裸值 | mark/replace adapter |
| `PCI-OBS-015A` | `ObservationConsistencyHint`没有持久化landing,只决定committed body是否返回；不得改变visibility/freshness/availability/rebuild surface或触发同步写入 | Query application mapper |
| `PCI-OBS-016` | Outbox record,event ref,subject,payload snapshot ref,tagged committed cursor 和 immutable payload snapshot 对应字段相等 | outbox append |
| `PCI-OBS-016A` | 每个outbox payload snapshot保存accepted flow按exact event name解析出的一个immutable `effect_binding_ref`；raw route不入store，missing old binding不得用current default替换 | accepted append + publication preflight |
| `PCI-OBS-017` | Published/Failed/DeadLettered只改publication row，永不改payload bytes或source truth；retryable Failed可直接被eligible selector选中但不得改回Pending | publisher short UoW |
| `PCI-OBS-017A` | 每次publication call使用由同一effect binding/event/outbox/payload digest/schema构成的stable `ObservationPublicationToken`；token binding必须等于snapshot/plan binding，unknown outcome必须probe，任一mismatch禁止external call | publication preflight + adapter port |
| `PCI-OBS-018` | reservation unique key为`(operation_name,actor_ref,idempotency_key)`；Completed必须指向存在且idempotency ref、operation、actor、request digest、result kind/schema/surface digest全部compatible的immutable result | atomic reserve + result/complete same UoW |
| `PCI-OBS-018A` | Consumer source-event secondary identity`(consumer_operation,producer_family,source_event_ref)`只能绑定一个reservation；dedup key drift不得创建second execution | atomic reserve/index constraint |
| `PCI-OBS-018B` | trusted `ObservationSourceVersionRef`只能在同producer/source comparator namespace单调前进；occurred_at、clock、schema、cursor、repository version均不得替代 | Consumer/reference guard + CAS |
| `PCI-OBS-019` | one accepted Job execution只有一个immutable canonical plan、一个linked report和一个reservation；每个finalizable item有structured outcome；report sets/reason必须等于all item outcomes的canonical lossless fold；terminal report封存plan，之后任何item都不重开 | Job start/item/finalize UoWs |
| `PCI-OBS-019A` | global typed work key同一时刻最多一个Active claim；reacquire产生严格更大fencing token；item/report/marker commit必须验证current claim，stale worker零写入 | claim store + commit validation |
| `PCI-OBS-019B` | accepted Job的完整 `JobExecutionConfigSnapshot` 与其digest随plan持久化；external Job的plan/token/intent引用同一binding revision，resume不得读取current config重建 | Job start + plan/config snapshot repository validation |
| `PCI-OBS-020` | external preparation/receipt/failure refs只作为body-free handoff/delivery record detail，不等于验收或外部truth | handoff/export assembler |
| `PCI-OBS-020A` | handoff/export每个prepare/deliver effect在external call前已有一个immutable typed intent token和`effect_binding_ref`；delivery从preparation复制同一binding，all retries复用，Unknown/Unsupported probe不得当negative | intent store + plan/config snapshot + delivery port preflight |
| `PCI-OBS-021` | 一个 UoW 不同时分配 observation cursor 和 reference cursor;混合 truth change 使用 observation cursor | UoW adapter |
| `PCI-OBS-022` | 所有 external body / secret / credential / raw signal / evidence body 在 serialization 前被拒绝或 quarantine | boundary validator + adapter serialization |

## 15. Failure recovery

| Failure | Durable state before failure | Recovery action | 禁止事项 |
|---|---|---|---|
| validation/schema failure before begin | none | return rejection/unsupported surface | 解析 unsupported payload或写 marker |
| idempotency same key/different digest | old reservation/result unchanged | conflict response;Step 12 maps error | 覆盖 digest/result |
| idempotency same key/digest Reserved | original reservation remains Reserved | return typed in-flight/delayed；single-UoW mutation不得按timeout接管 | enter a second mutation body or change key to bypass ownership |
| duplicate same digest | old completed result/report | rollback current UoW,load exact result | rerun resolver/domain/job/delivery |
| missing required truth before transition | reservation staged only | rollback;return missing/delayed/gap per flow | create synthetic external truth |
| evidence-index preview missing/ref-only/constituent mismatch | reservation staged only | rollback;return rejection/gap/block surface | persist dangling input ref or reconstruct it during delivery |
| policy/state transition rejected | no accepted truth change | rollback;optional separate rejection surface only if Step 12 defines | append normal-path outbox |
| optimistic conflict | concurrent winner committed | rollback and return/retry according Step 13 | last-write-wins overwrite |
| history append failure | truth still staged | rollback whole accepted UoW | commit untraceable state |
| cursor allocation failure | truth/history staged only | rollback | publish without cursor |
| outbox append/snapshot serialization failure | truth/history/cursor staged only | rollback accepted UoW | commit truth then reconstruct event later |
| stale marker failure | source/outbox staged | rollback when marker is mandatory for affected known views | silently leave known view fresh |
| stored result save / complete failure | accepted writes staged | rollback whole single-transaction flow;staged job item exception uses report rules | completed reservation pointing to missing result |
| known commit failure | no committed transaction | rollback/return infrastructure failure | return accepted |
| commit outcome unknown | may be committed | probe exact actor-scoped operation context and exact stored result before any retry | blindly execute again or infer abort from missing cursor/outbox |
| source event older/equal/unknown version | newer local snapshot/input may exist | older no-write；equal requires digest compatibility；unknown exposes degraded ordering | order by occurred_at/clock/schema/cursor/local version |
| publisher retryable failure | source/outbox committed | short UoW keeps/marks typed retryable Failed；future eligible selection uses same immutable payload/token | change Failed toPending,rollback source,mutate payload |
| publication call unknown | stable token intent exists,local marker may not be terminal | probe same token；Published -> finalize-only，NotPublished + formal abort proof -> same-token retry，Unknown/Unsupported -> manual | blind republish or generate a new token |
| payload missing/corrupt | outbox row committed,invariant broken | mark/report dead-letter or consistency failure without reconstruction | query current truth to rebuild bytes |
| stored external binding missing/corrupt/retired | outbox snapshot or external intent/plan remains committed | stop before external call；load the exact historical binding revision or classify manual consistency/operations recovery | resolve current route/target,change token binding,or treat dependency as negative outcome |
| projection capture incomplete/oversized/unknown dependency | source truth committed,view stale/old | rollback item;separate failure-accounting UoW records typed failed scope;retain old bundle | truncate,page partial,default window/position or claim fresh |
| source exact-membership withdrawal/index update failure | source truth/history still staged | rollback whole accepted mutation;retain old source record/memberships/positions | commit source state with stale membership,drop source record,or treat empty as omitted |
| projection read fence invalid at replace/commit | concurrent scoped mutation may have committed | rollback item,re-read under a new item UoW and classify/retry by Step 13 | reuse old snapshot/fence or clear newer stale watermark |
| projection rebuild item failure | source truth committed,view stale/old | rollback item;separate failure-accounting UoW marks failed;retain old view + stale surface | mutate source truth,write partial diagnostic bundle or claim fresh |
| projection CAS conflict | competing rebuild committed | rollback item,re-read and classify/retry | overwrite newer view |
| diagnostic bundle member/pointer mismatch on read | previously committed persistence invariant is broken | return consistency failure;keep Query body unavailable and raise operations diagnostic | reconstruct scope/summary from current truth in Query |
| diagnostic Rebuilding progress/maintenance/binding link missing or mismatched | committed derived metadata is inconsistent | Query returns consistency error with no write;an independent maintenance/rebuild recovery flow may inspect and repair derived metadata under its own UoW | guess target/progress,drop rebuild surface,return placeholder body,or repair inside Query |
| target-scope binding differs on duplicate/retry | old immutable binding/report remain | conflict/block before item work;operator/new target required | widen/narrow target under same idempotency execution |
| target first-bind member position missing or aggregate init fails | no committed binding/maintenance/report/progress from this start UoW | rollback complete start UoW;classify infrastructure/consistency failure | commit binding then repair aggregate later,or capture with fabricated zero/None |
| target finalize sees member stale/failure or fence conflict | item successes/old views remain;maintenance Rebuilding/Failed/Stale | save explicit partial/failed report and non-Fresh target progress in valid finalize UoW | mark target Fresh from last successful item |
| execution/item fence conflict | old claimant lost authority；winner may have committed | rollback,reload immutable plan/current claim/item/report outcome；resume only under fresh formal claim | reuse stale fencing token or classify success from lease expiry |
| reference resolver unavailable | old snapshot may exist | persist Unavailable/Stale + refresh record/report as flow allows | copy external body or mark Resolved |
| reference Invalid | terminal local snapshot | create new explicit snapshot only under future accepted protocol | Invalid -> Resolved in place |
| handoff/export external prepare failure | committed preparation intent + local Draft/plan/report exist | short fenced UoW mark failed/blocked + record/report；same-token retry only bytyped recovery | fabricate preparation ref/token or rebuild material from current view |
| external delivery success,local finalize known failure | committed delivery intent + body-free receipt available | retry local finalize using exact token/preparation/receipt | immediately redeliver |
| external delivery success,local commit unknown | marker/result may or may not be terminal | probe local marker/result then exact external token before action | assume either success or failure |
| Job item partial failure | earlier items/report progress committed | classify failed/gap refs,continue or finalize partial per Step 13 | rollback earlier items conceptually |
| Job finalize failure | Draft report + item progress committed | retry finalize only after completeness audit | rerun completed items |
| completed reservation but result missing | corrupted consistency | fail closed,raise operations diagnostic | reconstruct from current truth |
| no-write violation persistence failure | forbidden write remains blocked | return failure and operations signal when possible | allow attempted source write |
| retention/protection race | one CAS loses | rollback/reload current protection and reevaluate | release/delete on stale read |
| cursor value gap after rollback | no visible commit uses skipped value | continue with next monotonic cursor | reuse skipped cursor or infer data loss |

### 15.1 Step 12 recovery classification overlay

本节不改变上述transaction truth,只把failure映射到Step 12正式分类:

| Step 11 failure family | `ObservationRecoveryClass` | Public / runner mapping |
|---|---|---|
| invalid metadata/schema/ref/page | `RetryAfterInputChange` or unsupported `DoNotRetrySameInput` | invalid request / unsupported schema |
| policy/state/no-write hard reject | `DoNotRetrySameInput` or `RetryAfterStateChange` | rejected / blocked / not-visible |
| idempotency digest conflict | `DoNotRetrySameInput` | `IdempotencyConflict` |
| idempotency same-digest in-flight | `RetryAfterStateChange` | `IdempotencyInFlight`；Delayed/in-progress,public retryable=false |
| duplicate same digest | replay,not an error/retry | exact stored response/receipt/report |
| optimistic conflict / projection read fence conflict | `RetryAfterReload` | `VersionConflict` / failed retryable item |
| execution/item claim fence conflict | `RetryAfterStateChange` | `ExecutionFenceConflict`；reload plan/claim/item outcome before runner decision |
| repository/resolver/publisher/delivery unavailable | `RetryAfterDependencyRecovery` | dependency unavailable / delayed / failed retryable |
| known commit failure with confirmed abort | `RetryAfterDependencyRecovery` | dependency failure;no accepted claim |
| commit/finalize outcome unknown | `ProbeBeforeRetry` | `CommitOutcomeUnknown`;retryable=false until probe |
| external success + known local finalize failure | `RetryFinalizeOnly` | no Delivered claim;reuse same receipt/preparation |
| missing stored result/payload、wrong result kind、corrupt index/composite/linkage、rollback unknown | `ManualIntervention` | `ConsistencyFailure`;fail closed |
| projection capture incomplete/oversized by formal bound | input/state change or manual by exact cause | failed item;old view retained |
| target/report classification incomplete but valid | `RetryFinalizeOnly` or `RetryAfterStateChange` | partial/failed report;target non-Fresh |
| no-write marker persistence failure | `ManualIntervention` | attempted forbidden write remains blocked |

Adapter and application code must match the Step 12 enum variant,not parse this table's prose。Retry count、backoff、claim和exhaustion are not authorized by this overlay。

## 16. Logical persistence schema notes

### 16.1 Outbox record + payload snapshot schema

| Field | Type / source | Rule |
|---|---|---|
| `outbox_ref` | `OutboxRecordRef` / id generator | outbox PK |
| `event_ref` | `OutboundEventRef` / payload builder | unique;record/snapshot same value |
| `event_name` | `ObservationOutboundEventName` / accepted flow | stored snapshot routing identity;publisher不得从bytes/current truth重建 |
| `effect_binding_ref` | `ExternalEffectBindingRef` / injected application catalog | exact publication destination/idempotency namespace revision selected at acceptance；opaque/body-free；publisher token copies it unchanged |
| `subject_ref` | `BodyFreeRef` / committed change | record/snapshot same body-free subject |
| `payload_snapshot_ref` | `OutboxPayloadSnapshotRef` / id generator | one-to-one immutable snapshot |
| `schema_version` | `SchemaVersion` / outbound contract | captured at append;publisher cannot upgrade in place |
| `serialized_payload` | `BodyFreeSerializedEvent` | exact immutable bytes;redaction/body-free validation before append |
| `payload_digest` | `DigestSummary` / serialized bytes | validated on read/publish;not an evidence body |
| `committed_cursor` | `ObservationCommittedCursor` wrapping the current UoW allocator result | assigned before append;record/snapshot/stale marker tags and positions match;cross-namespace values are not compared |
| `trace_ref` | optional `TraceCorrelationRef` / operation context | body-free correlation only |
| `state` | `OutboxPublicationState` | starts Pending;not stored in immutable snapshot |
| `publication_receipt` / `last_failure` / `dead_letter_ref` | publisher result | mutually valid according state matrix;body-free |
| snapshot `stored_at` / record `committed_at` | one `ClockPort.now` value captured by append helper | values must match for one pair;metadata,not version/order authority |

append invariant:

```text
record.event_ref == snapshot.event_ref
record.subject_ref == snapshot.subject_ref
record.payload_snapshot_ref == snapshot.payload_snapshot_ref
snapshot.event_name == accepted_flow_selected_event_name
snapshot.effect_binding_ref == accepted_flow_selected_external_binding_ref
snapshot.payload_digest == digest(snapshot.serialized_payload)
record.state == Pending
record.committed_cursor == snapshot.committed_cursor == tagged_current_uow_cursor
record.committed_at == snapshot.stored_at
```

### 16.2 Projection dependency / lookup schema

#### Projection source record and membership schema

| Logical field | Source | Rule |
|---|---|---|
| `source_ref` | §9.4-a variant-specific `ProjectionSourceRef` extractor | unique `(variant,typed ref)` identity;item/ref/owner mismatch is corruption;raw body-free value alone is not a key |
| `item_kind` / current typed item | `ProjectionSourceItem` | row points to and agrees with current repository owner;serialized body remains body-free |
| `source_observed_at` | formal local object timestamp or first-index boundary clock | immutable for this source identity across state updates,withdrawal and re-entry |
| `last_changed_cursor` | current accepted UoW | tagged observation/reference variant matching item family and UoW allocator |
| membership `canonical_scope` | §9.4-a typed closure | ordinary member scope only;never `ByMaintenanceTarget` |
| membership `dependency_role` | finite item/role mapping | one compatible role for the item variant;no free string |

`projection_source_records` has one current row per typed source even when its membership set is empty。`projection_source_scope_index` has zero or more rows referencing it。The empty set is represented by absence of membership rows plus the present source record and current cursor;it is never inferred from an omitted `ProjectionSourceIndexUpdate`。A source's complete current membership is the exact set of all rows for its typed identity,not a delta log。

For every touched member scope,`projection_scope_positions` stores:

| Field | Rule |
|---|---|
| `canonical_scope` | typed unique selector |
| `observation_upper_cursor` | max committed observation cursor that changed a current/former member;optional only for formally no observation dependency |
| `reference_upper_cursor` | equivalent reference namespace upper position |
| `scope_revision` | advances whenever membership or either upper position changes,including full withdrawal |

Bound target aggregate rows use `canonical_scope=ByMaintenanceTarget(target)` but are not source memberships。Their namespace positions equal the max of all dependency-relevant bound member rows at the aggregate revision's snapshot。The adapter stores enough revision/dependency metadata to validate this equality at capture/commit;it cannot derive freshness from the target ref alone。

| Logical field | 来源 | Rule |
|---|---|---|
| `source_ref` | committed truth/snapshot/history typed ref | body-free;must identify an existing tracked source |
| `view_ref` | projection object identity | existing generated ref;never string concatenation |
| `projection_kind` | replace function branch | finite adapter mapping to six projection families |
| `canonical_scope` | `ObservationProjectionScope` or consumer/snapshot/target identity | typed serialization;no payload scan |
| `maintenance_target_ref` | view / job target when applicable | enables target rebuild and reference scope join |
| `source_position.observation_cursor` | fixed rebuild snapshot observation position | optional only when projection formally has no observation dependency;monotonic applied watermark,not row version |
| `source_position.reference_cursor` | fixed rebuild snapshot reference position | optional only when projection formally has no reference dependency;monotonic applied watermark,not external version |
| `dependency role` | assembler mapping | subject/correlation/audit/handoff/reference/gap/retention/consumer relation |
| `read_fence.transaction_ref` | current item UoW | must equal replace UoW transaction ref;never persisted as reusable authorization |
| `read_fence.scope` | exact capture input | must equal view canonical scope;target progress uses `ByMaintenanceTarget(target)` only |
| `read_fence.scope_revision` | item or target aggregate position row | captured inside the replace UoW and revalidated at commit;not reusable across transactions |

replace rules:

1. source reader captures complete bounded source set,dual positions and same-UoW scope fence;
2. application assembles typed view only from captured objects and explicit Job scope fields;
3. adapter validates view identity,canonical scope,fence transaction/scope and namespace dependency declaration;
4. adapter CAS replaces view body;diagnostic branch also inserts immutable summary and replaces versioned scope/current pointer atomically;
5. old lookup/dependency rows for that view are replaced with rows derived from the new typed view;
6. freshness marker advances each applied watermark to `source_position` without lowering either stale watermark;
7. commit-time fence validation succeeds;otherwise all operations roll back。

Freshness calculation is namespace-aware:

```text
observation_fresh = stale_observation_cursor is None
                 or applied_observation_cursor >= stale_observation_cursor
reference_fresh   = stale_reference_cursor is None
                 or applied_reference_cursor >= stale_reference_cursor
projection Fresh  = observation_fresh and reference_fresh and maintenance state is Fresh
```

`mark_views_stale` 只推进当前 `ObservationCommittedCursor` variant 对应的 stale watermark。replace 发生时若并发 mutation 已推进更高 stale watermark,adapter 必须保留该更高值,使 projection 继续 Stale;不得因一次旧 snapshot rebuild 清除另一 namespace 或更新后的 stale 信号。

`resolve_affected_views` returns only index rows. A missing row means no tracked affected view or an explicit consistency issue;service cannot invent view identity。

### 16.2-a Diagnostic composite schema

| Logical field | Source | Rule |
|---|---|---|
| `view_ref` | first create `IdGeneratorPort.new_diagnostic_view_ref` | stable PK;canonical scope lookup points here |
| `freshness_marker_ref` | first create `new_projection_freshness_marker_ref` | stable one-to-one binding with view |
| `scope_ref` | first create `new_diagnostic_scope_ref` | stable across replacements;not derived from scope/targets |
| `summary_ref` | every replacement `new_diagnostic_summary_ref` | new immutable snapshot identity;old summary remains unchanged |
| `projection_scope` | capture input / view field | view scope,scope body and lookup key must be equal |
| `target_refs` | complete captured source set | canonical sorted unique,non-empty,all members scope-valid |
| `time_window` | persisted captured source timestamps | bounded;no wall-clock/default fill |
| `visibility_scope_ref` | validated rebuild Job input | persisted projection constraint;Query metadata only narrows/evaluates it,never replaces it |
| `summary member refs` | captured safe signals/gaps/no-write violations | canonical sorted unique and present in captured source set |
| `diagnostic_freshness` | exact current summary state | view value must equal summary freshness |
| `freshness` | sidecar dual-watermark evaluation | independent from summary completeness;Partial does not by itself mean cursor-stale |
| `repository_version` | composite projection row/version | one version covers view,current scope body,current summary pointer,dependencies and freshness metadata |

`get_diagnostic_view(scope)` may return only the public view.`get_diagnostic_projection_with_version(scope)` must resolve and validate the full composite at one committed version。A missing canonical lookup returns `None`;a present lookup with missing scope/summary/marker is corruption,not missing。

#### Diagnostic rebuilding lookup schema

| Logical field / lookup | Source | Rule |
|---|---|---|
| diagnostic `freshness.progress_ref` | persisted `DiagnosticView.freshness=Rebuilding` | required `Some(RebuildProgressViewRef)` for diagnostic Rebuilding;not derived from request context or scope text |
| progress PK lookup | `get_rebuild_progress_by_ref(progress_ref)` | exact generated ref lookup;returned `RebuildProgressView.progress_ref` must equal requested ref |
| progress target lookup | `RebuildProgressView.target_ref` + unique target index | `get_rebuild_progress(target_ref)` must identify the same progress row;ref/target indexes cannot disagree |
| progress embedded surface | `RebuildProgressView.rebuild` | `rebuild.progress_ref=Some(progress_ref)` and `rebuild.target_ref=target_ref`;cursor ref is copied only from this persisted surface |
| progress freshness | `RebuildProgressView.freshness` | while diagnostic claims Rebuilding,it must also be `Rebuilding { progress_ref: Some(same_ref) }` |
| maintenance link | unique `ProjectionMaintenanceState.target_ref` | maintenance target equals progress target,state is `Rebuilding`,and `maintenance.progress_ref=Some(progress_ref)` |
| target binding | `maintenance_target_scope_bindings` | binding target equals progress target;ordinary requested scope is a canonical member,while aggregate request must be exactly `ByMaintenanceTarget(target_ref)` |

This lookup chain is a referential-integrity read,not an optional enrichment。Once a committed diagnostic view names a rebuilding progress ref,missing progress/maintenance/binding or any ref/target/scope mismatch is a consistency error。The Query must not return an unvalidated `Rebuilding` surface,guess target identity,drop the rebuild field,or create/repair any row。`ObservationConsistencyHint` is applied only after this chain succeeds and therefore cannot suppress referential-integrity validation。

### 16.2-b Maintenance target-scope binding schema

| Logical field | Source | Rule |
|---|---|---|
| `target_ref` | validated rebuild Job input | unique binding owner;not a generated view ref |
| `canonical_scope` | canonicalized `input.scopes` member | typed discriminator + lossless typed ref;no hash/string concat |
| `ordinal` | canonical typed ordering | stable serialization/debug only;not a page cursor or business order |
| `bound_at` | start UoW clock | audit metadata only;not version/freshness authority |
| `aggregate observation/reference position` | max of all dependency-relevant member position rows at first bind/current update | initialized atomically with first binding;never default zero/epoch |
| `aggregate revision` | target position row | new value on first bind and whenever any bound member position/revision changes |

First bind、aggregate position/revision initialization、missing-maintenance Stale create、Stale -> Rebuilding、target-scoped progress start和Draft report 必须在一个 start UoW 提交。重复调用若 canonical set逐项相同可视为 no-op,但不得重置aggregate;任一成员不同则 conflict。same-UoW target capture必须读取staged binding/aggregate。finalize 重新读取 binding,并要求 report classification set 与其一一对应。

### 16.3 Reference scope index schema

| Scope variant | Index resolution | Returned rows |
|---|---|---|
| `ExplicitRefs(refs)` | intersect refs with tracked snapshot_ref / subject_ref index | existing versioned snapshots only |
| `BySourceFamily(family)` | source-family discriminator derived from typed subject ref / accepted snapshot input | matching tracked snapshots |
| `UnhealthyOnly` | state in Stale/Unresolved/Invalid/Unavailable | matching tracked snapshots,stable ref order |
| `ByMaintenanceTarget(target)` | join target -> projection dependency -> reference snapshot relation | snapshots explicitly linked to target |

index row 只保存 snapshot ref、subject ref、source family、state、optional maintenance target 和 link source ref。link source 必须来自 accepted Command / Consumer / projection replace / Job input 的 formal typed ref,不得通过字符串前缀、JSON body scan、全文搜索或 resolver 私有缓存推导。

若 index 指向不存在的 snapshot,或 source family / target 与 tracked state 冲突,repository 返回 consistency error 或 failed item;不得自动创建 Resolved snapshot。

### 16.3-a Evidence-index input snapshot schema

| Field | Source | Rule |
|---|---|---|
| `input_ref` | `IdGeneratorPort.new_evidence_index_input_view_ref` used by Query preview assembler | immutable PK;Command must carry the complete view,not only this ref |
| `scope_ref` | `GetEvidenceIndexInputRequest.scope_ref` / handoff validation | body-free evidence/report scope;must be compatible with handoff scope |
| `linkage_refs` | `AuditEvidenceRepository.list_evidence_linkages_by_scope` | canonical sorted unique refs;every ref exists at accepted validation |
| `audit_projection_refs` | audit timeline/projection reads | canonical sorted unique refs;no source audit body |
| `gap_refs` | retention/gap reads | canonical sorted unique refs;must remain visible to consumer |
| `visibility` | visibility policy result | accepted snapshot preserves restricted/not-visible/degraded meaning |

Query 可生成完整 preview 和新的 input ref,但不调用 repository write。`PrepareReportHandoff` 接收完整 `EvidenceIndexInputView`,逐项重新读取和校验,然后在保存 handoff 之前调用 `save_evidence_index_input`。snapshot 一旦 committed 不可 replace;underlying linkage后续变化只会使 handoff/projection stale,不能改写原交接输入。delivery/hint 根据 ref读取 exact snapshot,不得从 current linkage重新组装后冒充原输入。

### 16.4 Stored result schema

| Field | Source | Rule |
|---|---|---|
| `result_ref` | id generator | PK,immutable |
| `idempotency_ref` | acquired reservation | unique owner；must equal Completed reservation pointer |
| `operation_name` | application service | must equal idempotency operation |
| `actor_ref` | operation context | must equal actor component of reservation scope；replay still revalidates current entry authorization |
| `request_digest` | operation context | must equal reservation digest；immutable stable logical input digest |
| `public_result_ref` | committed response / receipt / report | body-free typed ref |
| `disposition` | accepted/rejected/consumer/job mapping | immutable classification |
| `replay_surface.result_kind` | CommandResult / CommandRejection / ConsumerReceipt / JobReport | selects exact protocol decoder |
| `replay_surface.schema_version` | Step 08 protocol | duplicate replays same version;no implicit upgrade |
| `replay_surface.serialized_surface` | exact response assembler output | immutable body-free bytes |
| `replay_surface.digest_summary` | serialized surface digest | validated before replay |
| `stored_at` | clock | metadata only |

| Duplicate branch | Required kind | Missing / mismatch behavior |
|---|---|---|
| Command accepted | `CommandResult` | consistency error;no domain rerun |
| durable Command rejection | `CommandRejection` | consistency error;no resolver rerun |
| Consumer | `ConsumerReceipt` | consistency error;no payload parse |
| Job | `JobReport` | consistency error;no scan/publish/rebuild/deliver |

### 16.5 Job report persistence schema

| Field | Rule |
|---|---|
| `report_ref` | local Observability draft report PK;不是验收签署 |
| `job_ref` | local job execution identity;不得声称是真实 external run id |
| `execution_ref` | one accepted local execution identity linked from plan/report | unique；same idempotency reservation cannot create a second execution |
| `plan_ref` / `plan_digest` | immutable execution plan | report must reference the exact canonical work-set and digest |
| `last_fencing_token` | latest accepted execution/item fence | strictly monotonic；stale token cannot save report |
| `state` | Draft -> exactly one terminal `JobReportState` |
| `affected_refs` | set semantics;all locally changed/body-free refs,stable serialization order |
| `failed_refs` | set semantics;every attempted failed item once |
| `gap_refs` | set semantics;explicit missing/not-visible/unsafe gaps |
| `progress_refs` | set semantics;references to durable progress / preparation / execution markers |
| `projection_scope_items` | application-local canonical typed list;one `ProjectionScopeItemReport` per requested scope;success and failure mutually exclusive;not exposed as a fabricated public ref |
| `failure_reason` | typed body-free reason;required for partial/failed/blocked as Step 10 says |
| `repository_version` | required for every item update/finalize |

completeness rules:

- `Completed` requires every immutable plan item terminal Succeeded/compatible SkippedTerminal,`failed_refs` empty,and report classification exactly equals the plan；projection jobs additionally equal target binding。
- `PartiallyCompleted` requires both successful and failed `ProjectionScopeItemOutcome` values or the equivalent formal item classifications for another Job;不能用一句 summary 隐藏 item。
- `FailedRetryable` / `FailedPermanent` / `Blocked` require typed reason and failed/gap refs where an item identity exists。
- duplicate/re-entry with the same typed work key and exact terminal outcome is a no-op；different outcome/ref/reason is conflict；nonterminal resume requires current durable claim/fence and never creates a new plan。
- duplicate 读取 terminal report和 exact stored result,不把 stored state改成 `DuplicateReplayed`。
- report 中不保存 final verdict、signoff、真实 evidence alias、测试 pass/fail 或伪造 run id。

### 16.5-a Job plan / claim persistence schema

| Field family | Rule |
|---|---|
| plan identity | `plan_ref` PK；unique `execution_ref` and unique `idempotency_ref` |
| plan compatibility | operation、request digest、plan digest and canonical typed work keys immutable after start commit |
| config snapshot | complete operation-specific `JobExecutionConfigSnapshot` persisted with plan；its canonical digest is part of `plan_digest`；missing/corrupt/unknown profile is consistency/manual failure,never rebuilt from current config |
| plan item input | work key、planned input digest、observed version immutable；item state + structured outcome only move through a compatible CAS classification |
| plan item outcome | affected/failed/gap/progress refs canonical sorted unique；typed failure reason按state required/forbidden；`outcome_digest`覆盖state + exact refs + reason |
| claim identity | one Active execution claim per execution and one Active item claim per global typed work key |
| fencing token | successful acquire allocates a strictly larger durable token；renew never decreases；release/expire does not authorize an old token |
| commit validation | every plan/report/owned marker mutation registers the exact current claim in its UoW；commit rejects non-Active,wrong-owner or stale token as`ExecutionFenceConflict` |
| expiry metadata | lease/heartbeat timestamps are operations metadata only；they do not enter request/plan digest or prove item rollback |

Plan work-set不可replace。Item state/outcome CAS也不能增加、删除、重排work key或修改planned input。`Planned`初始outcome为None；Succeeded / FailedPermanent / Blocked / SkippedTerminal必须保存compatible exact outcome；FailedRetryable保存本次typed failure outcome，并只允许在report仍为Draft且fresh claim/policy允许时进入下一attempt。Finalize要求没有Planned/Running；它可把含FailedRetryable的当前execution收束为PartiallyCompleted/FailedRetryable等terminal report。Terminal report、stored result和Completed reservation同UoW提交后封存整个plan，任何item都不得再变。Finalize canonical fold每个item的current classification/outcome得到report sets和failure summary；任一差异拒绝terminal report。Fake与durable adapter必须同样执行该fold、global uniqueness、token monotonicity和commit-time fence validation。

### 16.6 Handoff / export lifecycle record schema

| Field family | Source | Rule |
|---|---|---|
| subject | handoff ref or delivery ref | must identify local owned marker |
| scope / consumer | handoff/export object | body-free boundary identity |
| change kind | local domain transition | Draft/Prepared/Delivered/Failed/Blocked/Cancelled compatible |
| preparation ref | adapter prepare result | optional except Prepared/Delivered paths;not a package body |
| receipt ref | adapter delivery result | required for local Delivered;not acceptance signoff |
| failure reason/ref | classified adapter result | body-free;required for Failed |
| evidence index/view ref | committed local projection | no evidence body or real alias |
| actor / trace / recorded_at | operation context + clock | audit context only |
| observation cursor | local finalization UoW when outbound change committed | not external sequence |

prepared record、delivered/failed record和 local marker version共同构成 report handoff trail。外部 adapter response不得直接覆盖 handoff row;必须先 versioned reload并通过 state/readiness/no-write/retention guard。

### 16.6-a External effect intent schema

| Field | Rule |
|---|---|
| `intent_ref` | generated body-free PK；one immutable local identity per planned prepare/deliver effect |
| effect kind | finite HandoffPrepare / HandoffDeliver / ExportPrepare / ExportDeliver discriminator；Publication token lands in §16.1 outbox snapshot and has no fabricated `intent_ref` |
| `effect_binding_ref` | exact immutable destination + provider idempotency namespace revision selected before plan/intent commit；delivery must copy its preparation binding |
| local bindings | exact outbox/event/handoff/preparation/delivery/view/consumer refs required by that kind；other fields absent |
| material digest | canonical digest of exact body-free prepared material identity；never includes body,credential,endpoint,clock,attempt or claim token |
| token state | intent committed before call；local Prepared/Delivered marker links back to the same intent/token |
| probe state | Prepared/Delivered / NotPrepared/NotDelivered / Unknown / Unsupported kept distinct；probe itself is read-only |

External call没有已提交matching intent或intent/plan/config snapshot binding不一致时必须拒绝。Local finalize只能保存与原token/material/binding兼容的body-free preparation/receipt；不能从current evidence/view重建后沿用旧intent，也不能按current config重定向。

### 16.7 Cursor / transaction audit schema

adapter 可以用 transactional sequence、counter row 或等价机制实现 cursor,但必须保留:

| Logical field | Rule |
|---|---|
| namespace | observation / reference two distinct values |
| transaction_ref | equals current `ObservationTransactionRef` |
| cursor value | monotonic,opaque,never reused |
| assigned once | second assign in same UoW is invariant error or returns exact same value;不得产生 two order positions |
| visibility | only visible through committed outbox/stale/progress rows |
| rollback | no visible row may reference rolled-back transaction cursor |

## 17. Consistency anti-patterns

| Anti-pattern | Why invalid | Correct rule |
|---|---|---|
| `expected_version = Some(1)` | hard-coded value destroys CAS semantics | load `Versioned<T>` |
| use cursor/timestamp as version | order和concurrency token不同 | use repository version |
| `None` update existing row | turns update into silent upsert | None only create-if-absent |
| HashMap insert overwrite in fake | hides duplicate/conflict bugs | enforce create/update/CAS separately |
| publish current truth | payload changes after original commit | publish exact stored snapshot |
| rebuild corrupt payload from current row | falsifies committed event history | dead-letter / consistency error |
| call publisher/delivery while DB tx open | creates long transaction and ambiguous rollback | external call outside,short local finalize |
| one transaction for whole Job page/batch | lock/time/failure blast radius too large | start/item/finalize UoWs |
| Job duplicate reruns scan | duplicates side effects | replay stored report |
| query refreshes stale snapshot | hidden mutation | return stale/unavailable |
| query appends read access history | violates no-write contract | future independent audit consumer only |
| construct projection ref from strings | breaks identity closure | dependency/lookup index |
| reference refresh scans serialized body | crosses body boundary | formal scope index |
| handoff request carries only evidence-index ref | no durable owner can prove original contents | carry full body-free preview,validate and append immutable snapshot |
| mark projection fresh before view/index commit | query may see inconsistent freshness | atomic replace |
| complete idempotency before result | duplicate may point to missing surface | result first,complete second |
| terminal report edited on duplicate | changes historical execution evidence | original report immutable |
| retention Released deletes source | marker does not own cleanup | no physical/source delete |
| external Delivered treated as accepted verdict | delivery is transport fact only | keep handoff/acceptance separate |
| save raw log/metric/trace/evidence for debugging | violates forbidden body boundary | typed ref/safe summary/digest only |
| no-write record failure allows original write | guard becomes fail-open | remain blocked/fail closed |
| cursor gap interpreted as missing event | allocator rollback may skip | cursor opaque;use committed records |

## 18. 前序契约回填记录

本 Step 为闭合 persistence truth 已实际回补:

| 文件 | 已回补内容 | 原因 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | audit subject、evidence purpose、handoff scope、rollup scope/cursor、peripheral linkage、`ObservationConsistencyHint`、exact replay surface、job report fields | persistence identity / index / replay schema以及transient Query preference必须有对象来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | scope / affected view / exact query carrier / exact payload helper、`ProjectionSourceRef` / change set / relation anchor / membership planner、full withdrawal、read fence、target aggregate read-your-writes、diagnostic composite、`get_rebuild_progress_by_ref`、missing repositories/functions、versioned projection replace、accepted cursor顺序、evidence input get/save、operation-aware idempotency lookup、missing ID generators | Step 11 store / transaction必须有 port承接 |
| `03_ddd_step_08_protocol_contracts.md` | audit subject、evidence purpose、handoff scope mapping、PrepareHandoff complete evidence input carrier、query request/surface、diagnostic composite和rebuild Job schema | public input到persisted identity、只读surface和immutable handoff/rebuild input闭合 |
| `03_ddd_step_09_function_flows.md` | factory mapping、projection expected version、planner-before-cursor/store-after-cursor顺序、UoW借用与conflict rollback、completed reservation result判空、Versioned pending item解包、staged Job和handoff external-call cut、evidence preview validate/save、完整diagnostic Query/progress linkage/consistency mapper、rebuild pure helper签名、target aggregate start语义 | 函数流与本 Step repository / transaction一致 |
| `03_ddd_step_10_state_matrix.md` | persisted identity字段的factory前置条件 | state owner create/update前置条件闭合 |
| Step 14反查本文件 | outbox snapshot / external intent / Job config snapshot的`effect_binding_ref` landing、transaction ordering、PCI和recovery | 防止配置切换把old token重定向到new destination，并闭合publication与四类handoff/export token的durable source |

正式 `03-详细设计.md` 仍未修改。Step 19 装配时必须把本文件 §8~§17 回填到正式 §10,并在函数流 / 状态章节引用 transaction / CAS / cursor / recovery rule。

## 19. Cross-step closure audit

| 审查项 | 结论 | 证据 |
|---|---|---|
| Step 06 object field 是否有 persistence landing | pass | §8 / §9 / §16 |
| 27 个状态 owner 是否全部可持久化 | pass | §9.5 |
| Step 07 repository 函数是否有 store/version/transaction/error 语义 | pass | §10 |
| Step 08 event / result / receipt / report 是否有 exact storage surface | pass | §9.4 / §16 |
| Step 09 Command/Consumer/Publisher/Job/Handoff 顺序是否闭合 | pass | §12 |
| Step 10 terminal/reserved transition 是否不会被 persistence绕过 | pass | §9.5 / §11 / §14 |
| optimistic version来源是否唯一 | pass | §11.1 |
| observation/reference cursor是否与version/page cursor分离 | pass | §11.2 |
| outbox payload是否在accepted UoW immutable保存 | pass | §10.8 / §12.2 / §16.1 |
| external binding是否随outbox/intent/plan immutable保存且resume不读current route | pass | §9.4 / §12.5~§12.8 / §14 / §16.1 / §16.5-a / §16.6-a |
| projection identity/dependency/freshness是否闭合 | pass | §9.3 / §16.2 |
| typed source ref/role/namespace/time/scope mapping是否闭合 | pass | §9.4-a / §10.7 / §12.10 / §16.2 |
| membership planner/change set/relation anchor是否在cursor前完整规划且不写store | pass | §9.4-a / §10.7 / §12.2 |
| source退出全部scope是否不会留下幽灵membership或丢stable time | pass | empty exact withdrawal + persistent source record,见§9.4-a / §10.7 / §16.2 |
| first target binding是否有aggregate init和read-your-writes | pass | §10.6 / §12.6 / §12.10 / §16.2-b |
| reference refresh scope是否无需body scan | pass | §9.4 / §16.3 |
| evidence-index Query preview到handoff immutable input是否闭合 | pass | §10.4 / §12.3 / §16.3-a |
| stored result / report duplicate replay是否闭合 | pass | §16.4 / §16.5 |
| handoff/export是否不持有外部调用长事务 | pass | §12.8 |
| Diagnostic Query canonical lookup、progress-ref反查、target/binding校验是否闭合 | pass | §10.7 / §12.9 / §16.2-a |
| `ObservationConsistencyHint`三态是否只影响body且保留exact surface | pass | §12.9；无logical persistence landing |
| Query是否no-write | pass | §12.9；包括diagnostic progress/maintenance/binding committed reads |
| retention/no-write是否fail closed且不执行source delete/repair | pass | §13~§15 |
| external/raw body是否有任何合法store | no | §8 / §14 / §17明确禁止 |

### 19.1 Protocol-family persistence closure index

| 协议族 | 数量 | accepted landing / read boundary | UoW、cursor、version与replay约束 | 当前状态 |
|---|---:|---|---|---|
| Command C01-C16 | 16 | owned truth/marker + append-only history + typed cursor + immutable outbox snapshot + stored result | one accepted UoW；先 stage truth/history，再规划 membership，分配 observation cursor，append snapshot/stale，保存 result，完成 reservation，最后 commit | `pass_with_affected_open`; `R06-F-AFFECT-UOW-01`、secondary owner和部分 landing affected 保留 |
| Query Q01-Q14 | 14 | least-authority committed read facet / composite carrier；无写 landing | 不创建 write UoW、reservation、stored result、history、outbox、gap、refresh、rebuild 或 read-audit；page cursor 不是 freshness/version | `pass_with_affected_open`; Q-specific carrier、presence、visibility、freshness affected 保留 |
| Consumer I01-I09 | 9 | header-before-payload 后写 local receipt/marker/snapshot/gap/history；可选 typed local outbox | source-event uniqueness + operation reservation；source-version comparator 先于 local transition；commit unknown 不选择 wildcard worker action | `pass_with_affected_open`; `S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、I03-I05 owner affected 保留 |
| Outbound Event E01-E12 | 12 | accepted source UoW 内的 typed immutable payload snapshot + outbox publication marker | encoder 只能消费 committed local change；J01 只能 claim/publish stored snapshot；publish failure 不回滚 source truth | `pass_with_affected_open`; producer binding、payload schema、publication phase affected 保留 |
| Operations Job J01-J09 | 9 | immutable plan + claim/fence + item result/report + native maintenance/delivery landing | J01 publication 与 J02-J09 maintenance/delivery 分开；item UoW 可独立提交，target finalize 必须重新 capture aggregate fence；external phases 不持有长事务 | `pass_with_affected_open`; `R06.6-F2-H13-UPSTREAM`、`S08-JOB-REPORT-REF-OWNER-01`、`R07-EXTERNAL-PHASE-*` 保留 |
| 合计 | 60 | 16 mutation + 14 read-only + 9 local consumer + 12 snapshot event + 9 job/report | `60/60` 有 persistence boundary 记录；`0/60` 无条件完成 | `pass_with_affected_open` |

该索引与 Step 09 exact-flow cards 一一对应。任何实现者若无法从协议行进入唯一 store、
repository、cursor/version 和 recovery landing，必须按 affected 回退 owner，不得从第一条记录、
当前 projection 或 Query 结果反推持久化真相。

## 20. Step 12~16 handoff

| 后续 Step | 必须继续闭合 | 本 Step 固定输入 |
|---|---|---|
| Step 12 Error / recovery | exact `ApplicationError` / DomainError / protocol mapping;commit unknown,missing result,index inconsistency,payload corruption,external finalize failure | §10.1 / §15 |
| Step 13 Concurrency / idempotency | reservation in-progress、CAS retry、outbox Failed retry、worker claim、job item re-entry、handoff/export at-least-once dedup、retention race | §11 / §12 / §15 |
| Step 14 Config / external binding | store/publisher/resolver/delivery adapter binding,limits,timeouts,disabled/degraded mapping;不得改变 logical contract | §7 / §9 / §12 |
| Step 15 Observability / audit | transaction begin/commit/rollback,version conflict,cursor,outbox dead-letter,projection stale,reference unavailable,no-write violation telemetry | §14 / §15 |
| Step 16 Test cuts | fake parity,CAS,rollback,cursor,outbox snapshot,projection index,reference scope,query no-write,staged job,duplicate replay,handoff split transaction tests | §9~§17 |

## 21. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,第 10 章至少包含:

```md
## 10. 数据持久化、事务与一致性契约

### 10.1 数据所有权与 logical store
写入 owned truth / snapshot / projection / history / technical store 表,并明确 external body forbidden。

### 10.2 Repository 与 version / cursor
写入 repository语义、ObservationRepositoryVersion唯一来源、observation/reference cursor namespace和identity规则。

### 10.3 Transaction ordering
写入 accepted mutation固定顺序、Consumer、Publisher、staged Job、handoff/export以及Query no-write。

### 10.4 Consistency and recovery
写入 local strong / eventual consistency、cross-store invariant、failure recovery和anti-pattern。
```

正式文档不得把 logical store 表压缩成“使用数据库保存”；也不得恢复旧 `ObservationEnvelope`、raw log/metric/trace table、hash-chain、产品表名或旧自动顺推心智。

## 22. 待确认事项与 blocker

| 项目 | 当前结论 | 是否阻塞 Step 12 |
|---|---|---|
| 具体 database / queue / object store产品 | 留给 Step 14 / `04` / implementation | 否 |
| SQL DDL / migration / partition / index物理名 | 实施前由infra binding细化,必须符合logical contract | 否 |
| outbox retry interval/exhaustion/claim | Step 13 | 否 |
| Job lease / parallel item claim / in-progress duplicate | Step 13 | 否 |
| handoff/export external idempotency token和target binding | Step 13 / Step 14 | 否 |
| read access durable audit | 当前phase-reserved;若需要必须新增独立异步flow,Query仍no-write | 否 |
| 目标实现仓当前未发现 | Step 17 / `07-实施计划`实施前置gate | 否,不阻塞design |
| 上游 `00` / `01` / `02` truth conflict | 未发现 | 否 |

## 23. 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 是否读取 Step 11 SOP、书写规范、架构ownership、Step 06~10和L1参考 | pass |
| 是否把旧 Step 11降级为historical material并全量重建 | pass |
| 是否输出数据所有权实现表 | pass |
| 是否输出logical store / collection / projection契约 | pass |
| 是否输出Repository函数表和完整持久化语义 | pass |
| 是否输出version / cursor / identity规则 | pass |
| 是否覆盖16 Command、9 Consumer、publisher、9 Job、handoff/export和14 Query transaction boundary | pass_with_affected_open |
| 是否按协议族登记60项 persistence closure | pass_with_affected_open | §19.1；物理 owner/上游能力 affected 保留 |
| 是否覆盖27个状态owner | pass_with_affected_open | logical landing 已登记；secondary owner/实现 capability 不宣称完成 |
| 是否闭合outbox payload、typed projection source/index、diagnostic composite、target binding、reference scope、stored result、job report和handoff record schema | pass |
| source full withdrawal、stable time和bound target aggregate推进是否闭合 | pass |
| Query request/result carrier、diagnostic mapper和typed per-scope report是否可落码 | pass |
| Diagnostic `Rebuilding { progress_ref }` 是否按ref读取并验证progress/maintenance/binding/request scope | pass |
| `AllowStale` / `RequireFresh` / `BestEffort` 是否逐态定义body/availability/rebuild规则且不持久化 | pass |
| `ProjectionSourceRef`、change set、relation anchor、membership planner是否定义使用闭合 | pass |
| evidence-index input是否有完整DTO、ID generator、immutable repository和transaction landing | pass |
| 是否定义consistency、failure recovery和cross-store invariant | pass |
| 是否明确Query no-write、Job no-repair、retention no-delete、peripheral no-truth-write | pass |
| 是否避免数据库/产品/配置值/DDL提前绑定 | pass |
| 是否未伪造commit、run id、evidence alias、验收签署或测试结果 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否发现新的上游blocker | no |
| inherited affected 是否保留 | yes | `S08-E-I05-*`、`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-*`、`S08-CONSUMER-*`、`S08-JOB-REPORT-REF-OWNER-01` |

## 24. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `pass_with_affected_open` | 已按当前 Step 06~10和架构ownership记录 ownership、logical store、repository、version/cursor、transaction、consistency/recovery 契约；60项协议均有 landing，但 inherited affected 未关闭 | continue_M2_step_12; stop_after_step_15_before_step_16 |
