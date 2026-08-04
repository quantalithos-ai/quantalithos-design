# L4-observability 05-测试方案 Step 03：抽取测试对象与测试切口

## Step 状态

| 字段 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案.md` |
| step | `03 / 抽取测试对象与测试切口` |
| mode | `full-restart` |
| status | `completed_current_design_record` |
| gate_status | `pass` |
| next_allowed_action | `start_current_05_step_04` |
| formal_document_write | `not_allowed_until_step_15` |
| source_baseline | current `02/03/04` plus current Step 01~02 |
| test_execution | `not_run` |
| evidence | `planned_only`; no real alias or run id |
| commit | not required; no commit requested |

本步已完成 current 设计记录；此前项目台账未同步本步完成状态，现由 `05_test_plan_calibration_flow.md` 和
`project_execution_ledger.md` 统一收口。后续 Step 只能消费本文件的 current 结论，不得把提前生成的未来 Step
草稿视为已确认来源。

## 1. 本步输入和问题回答

本步按 `standards/document/测试方案讨论流程_SOP.md` Step 03 执行，直接消费：

- current `02-概要设计.md` §4~§12 的组成部分、协议骨架、处理流、状态和配置轮廓；
- current `03-详细设计.md` §5~§17 的七模块契约、60 个协议、27 个正式状态 owner、UoW/持久化、错误恢复、并发幂等、配置绑定、观测审计和 Step 16 最小切口；
- current `04-配置设计.md` §6~§13 的 profile、敏感字段、complete-or-error assembly、变更、失败、迁移和 handoff；
- Step 01 的输入边界和 Step 02 的 P0/P1/P2/Forbidden scope。

旧 `05` 和旧 Step 03 只作为 historical material。它们包含相邻项目的协议、数量和状态，不作为切口输入。

### 1.1 SOP 问题回答收口

| 问题 | 当前回答 |
|---|---|
| 哪些 domain object/value object/policy 单测 | `contracts` 的 typed ref/metadata/DTO/schema；`domain` 的 observation-owned fact、policy、guard、state、history、body-free invariant；不测试外部 truth owner |
| 哪些 application service 做 service test | `ObservationTruthWriteService`、`ObservationReadService`、`ObservationInboundEventService`、`ObservationMaintenanceService`、`ObservationPublicationService` 的 exact flow、UoW、幂等、错误、no-write 和 report fold |
| 哪些 repository/adapter/worker 做集成测试 | `ObservationUnitOfWork`、各 repository、body-free resolver、publisher/delivery、runtime builder、API/worker/jobs façade 和 registrar；以 fake/durable conformance 及 controlled failure 为主 |
| 哪些协议必须单列 | 16 Command、14 Query、9 Consumer、12 Event、9 Job 全部单列；不能用 family 表替代 exact name/body/missing behavior |
| 哪些状态/一致性行为单列 | 27 formal state owner、`ObservationJobPlanItemState`、accepted UoW、rollback、CAS/cursor/version、outbox snapshot、stored replay、claim/fence、external phase、Query zero-write |
| 哪些字段/DTO失败单列 | required field、typed ref owner、schema version、producer mapping、source version、visibility/freshness、body-free digest、secondary type、report/result ref、cursor binding |
| 正式状态名规则 | 只使用 `03` §9 的 exact variant；一次性 outcome/carrier 不升级为 lifecycle state |
| 每个 P0 是否停审 | 本文件 §6 逐组记录；孤儿契约、重复切口、名称漂移和 phase 越界均已审计，无 unresolved 结构冲突 |

## 2. 测试对象与切口总表

| 测试对象 | 设计来源 | current 测试切口 | 主要风险 | 推荐层级 | 优先级 |
|---|---|---|---|---|---:|
| `contracts` public carriers | `03` §5.1、§6.2、§7 | `contracts_protocol_roundtrip`、`contracts_typed_ref_owner_isolation`、`contracts_secondary_type_exhaustiveness`、`contracts_body_free_schema_scan` | DTO缺字段、ref混同、schema/variant漂移、禁止正文泄漏 | contract unit / schema scan | P0 |
| `domain` observation truth and policies | `03` §5.2、§6、§9 | `domain_factory_policy_invariants`、`domain_state_and_history_pairing`、`domain_no_external_dependency` | owner/不变量错误、非法状态、副作用越界 | domain unit / static scan | P0 |
| `application` write/read façades | `03` §5.3、§8、§10~§13 | `application_command_consumer_uow_order`、`application_query_no_write`、`application_job_plan_item_finalize`、`application_typed_error_mapping` | 顺序、事务、幂等、恢复、query隐藏写入 | service / integration | P0 |
| `infra` repositories/UoW | `03` §5.4、§10~§13 | `infra_repository_conformance`、`infra_uow_atomicity_and_rollback`、`infra_cursor_version_binding` | CAS/append/cursor/rollback/fence不一致 | repository contract | P0 |
| `infra` resolver/publisher/delivery | `03` §5.4、§11、§13~§14 | `infra_external_adapter_conformance`、`infra_historical_binding_probe`、`infra_forbidden_material_boundary` | wrong target、Unknown误判、body/secret泄漏、fallback | adapter contract / scan | P0/P1 |
| `infra` runtime/config | `03` §13；`04` §6~§13 | `infra_runtime_builder_totality`、`config_profile_matrix`、`config_redline_fail_fast`、`config_historical_work_pinning` | partial runtime、配置绕过不变量、old work读current config | builder / config test | P0 |
| `api` entry | `03` §5.5、§7~§8 | `api_handler_facade_only`、`api_metadata_and_error_surface` | 直连 repository/domain、route/body mismatch、错误映射漂移 | handler/contract | P0 |
| `worker` inbound/outbox | `03` §5.6、§7.4~§7.5、§8.4~§8.5 | `worker_consumer_boundary`、`worker_ack_after_commit`、`worker_outbox_snapshot_publication` | payload先parse/ack、重复写、current truth重建、发布失败反写 | worker/integration | P0 |
| `jobs` operations runner | `03` §5.7、§7.6、§8.6、§12 | `jobs_runner_facade_only`、`jobs_immutable_plan_claim_fence`、`jobs_report_fold` | job成为业务写源、plan漂移、report伪造、partial丢失 | runner/integration | P0 |
| five protocol families | `03` §7、§8、Step 08/09 | 60 个 exact protocol cuts（见 §4） | 漏协议、generic handler、family discriminator冲突 | contract + service | P0 |
| formal state owners | `03` §9、Step 10 | 27 state owner cuts（见 §5） | 非法迁移、terminal/reserved绕过、history/outbox副作用错误 | domain/service | P0 |
| consistency/recovery | `03` §10~§13、Step 11~13 | `accepted_uow_effect_set`、`rollback_zero_partial`、`commit_unknown_probe`、`duplicate_replay`、`claim_fence_race`、`external_phase_link` | partial commit、second writer、blind retry、wrong token | integration/failure injection | P0 |
| telemetry/audit/security | `03` §14；`04` §8、§11 | `telemetry_schema_allowlist`、`redaction_before_serialization`、`correlation_no_truth_derivation`、`report_evidence_body_free`、`self_observation_recursion_guard` | secret/body、高基数、correlation冒充truth、递归 | schema/scan/integration | P0 |
| dependency boundary | `01` §8；`03` §3、§5、§16；`00` `VF-OBS-008` | `workspace_dependency_direction`、`entry_capability_isolation` | sibling compile dependency、entry越权能力 | static/build | P0 |

## 3. 模块切口的字段、状态和错误边界

| 切口 | 必须使用的正式来源 | 最小断言 | 禁止替代 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | `03` §7.1~§7.6 | exact name、metadata、required field、schema version、outcome、view/page/error roundtrip；16/14/9/12/9 数量不变 | 裸 `String`、free-text parser、默认 variant |
| `contracts_typed_ref_owner_isolation` | `03` §5.1、§6.2 | `ObservationReceiptRef`、`SafeSignalRef`、`AuditProjectionRef`、`EvidenceLinkageRef`、`ReportHandoffRecordRef`、`RetentionMarkerRef`、`GapStateRef`、outbox/report refs 不互换 | alias/wrapper conversion、domain-private ref泄漏 |
| `contracts_secondary_type_exhaustiveness` | `03` §6.2.1、Step 08 affected register | `SchemaVersion`、`SourceFamilyKind`、`ObservationProducerFamily`、`ReportConsumerRef`、`PeripheralConsumerRef`、14 Query operation map exhaustive | `Other`、wildcard/default、按名称猜 producer |
| `contracts_body_free_schema_scan` | `00` DO/VF；`03` §7、§14；`04` §8 | public DTO/event/job/report/error/config-safe projection 不含 raw body、secret、credential、endpoint、provider body、真实 run/evidence/verdict/signoff | hash/base64/debug 绕过 |
| `domain_factory_policy_invariants` | `03` §5~§6 | factory 拒绝 missing/wrong-owner/body-bearing；policy 不产生外部 truth；初始状态与首个 Command 可执行 | 测试侧直接构造私有字段 |
| `domain_state_and_history_pairing` | `03` §9、Step 10 | 合法 transition 返回 native record；非法/terminal/reserved 不改变 state/history/outbox/stale/result | 通过日志判断状态、把 outcome当state |
| `application_command_consumer_uow_order` | `03` §8、§10、`R06-F-AFFECT-UOW-01` | stage owner/post-state+membership -> assign one cursor -> cursor-bound history/outbox/stale -> result -> complete -> commit | 旧 `append -> assign cursor` 顺序、commit后补副作用 |
| `application_query_no_write` | `03` §7.3、§8.3、§10.8、§14.9 | 14 Query 不 begin write UoW、reserve、save、refresh、rebuild、mark stale、append audit/outbox | miss/stale时隐式修复 |
| `application_job_plan_item_finalize` | `03` §8.6、§12.6~§12.7 | immutable plan/config/binding、claim/fence、item outcome、report fold、terminal seal闭合 | 每次resume重新list或改scope |
| `application_typed_error_mapping` | `03` §11 | exact error code、recovery class、retryability total mapping；不解析 message | wildcard/default、错误字符串匹配 |
| `infra_repository_conformance` | `03` §10~§13 | fake/durable 对 CAS、append-only、unique、cursor、reservation、claim/fence、rollback visibility 一致 | fake额外success path |
| `infra_external_adapter_conformance` | `03` §11、§13~§14；`04` §11 | Disabled/Unavailable/Degraded/Misconfigured、Unknown/Unsupported、stable token/probe/finalize和old binding | current config fallback、blind retry、provider body |
| `infra_runtime_builder_totality` | `03` §13；`04` §9 | 13-stage assembly 成功暴露完整 runtime，任一失败无 partial entry/registrar | partial route、automatic LKG、hot swap |
| `api_handler_facade_only` | `03` §5.5、§8 | API只做route、metadata、DTO、error mapping、facade call | 直连 repository/UoW/domain/adapter |
| `worker_consumer_boundary` | `03` §7.4、§8.4、`04` CFG-FAIL-11 | envelope/header/schema/producer先验证，unsupported/raw body不parse、不ack、不写 | 全订阅、任选事件、payload覆盖header |
| `worker_outbox_snapshot_publication` | `03` §7.5、§8.5、§10.6 | 只读stored immutable snapshot，同token/binding/bytes发布，failure只写marker | current truth rebuild、发布失败rollback owner |
| `jobs_runner_facade_only` | `03` §5.7、§8.6 | runner只parse/dispatch/report/exit | 直接调用 adapter/repository或生成验收结论 |
| `workspace_dependency_direction` | `00` `VF-OBS-008`；`01` §8；`03` §3/§16 | 仅允许 `core-contracts` compile dependency；sibling通过event/port/ref/handoff | package依赖 `L0-bus` 或 L1/L2/L3/L4 sibling |

## 4. 60 个 exact protocol 测试入口

每一项必须至少登记一个正向入口和一个异常/边界入口；Step 06 才展开完整用例、数据和断言矩阵。本表使用 `03`
§7 的正式名称和 `03` §8 的 flow 名，不把设计记录当作执行结果。

### 4.1 Command 16/16

| ID | Protocol | Positive cut | Abnormal/boundary cut | 主要来源 |
|---|---|---|---|---|
| C01 | `SubmitObservationMaterial` | safe source/purpose -> receipt/intake UoW | missing source/purpose、raw body、resolver unavailable | `03` §7.2、§8.2、§11 |
| C02 | `RecordSafetyDisposition` | `Pending -> Safe/Redacted` + record | missing receipt、invalid transition、forbidden marker | `03` §7.2、§9.2 |
| C03 | `BindCorrelationContext` | source/trace/causation -> `Bound/Partial` | source mismatch、opaque ref conflict、identity derivation attempt | `03` §7.2、§8.2、§14 |
| C04 | `RecordSafeSignal` | safe summary/context -> `Recorded` | raw signal、invalid context、suppressed rewrite | `03` §7.2、§9.2、§14 |
| C05 | `AppendAuditProjection` | body-free audit/subject/context -> `Appended` | source body、wrong owner、missing summary/context | `03` §7.2、§8.2 |
| C06 | `LinkBodyFreeEvidence` | digest/purpose/body-free boundary -> `Linked` | body input、missing digest、not-visible/stale | `03` §7.2、§9.2 |
| C07 | `PrepareReportHandoff` | complete immutable input -> `Draft/Prepared` | ref-only mismatch、blocking gap、not-visible/retention block | `03` §7.2、§8.2、§10 |
| C08 | `EvaluateAuthenticityHint` | formal origin -> typed hint | unproven real claim、missing input、terminal rewrite | `03` §7.2、§9.3 |
| C09 | `SetRetentionMarker` | protected ref -> hold/release eligibility | active protection conflict、cleanup attempt、terminal reopen | `03` §7.2、§9.3 |
| C10 | `ProtectActiveReference` | consumer set attach/protect | empty/mismatched consumer、release conflict | `03` §7.2、§9.3 |
| C11 | `DefineReplayScope` | approved observation-side scope | source-write/external target/empty scope -> blocked | `03` §7.2、§9.3、H13 affected |
| C12 | `RecordNoWriteViolation` | detect attempted forbidden target -> local record | persistence failure、forbidden call still attempted | `03` §7.2、§9.3 |
| C13 | `RecordGapState` | open/ack/mitigate/close with local basis | no-basis close、wrong source、suppressed reopen | `03` §7.2、§9.3 |
| C14 | `PrepareExternalAuditExport` | body-free view/consumer -> local preparation | raw package、unsupported consumer、blocked visibility | `03` §7.2、§8.2、§11 |
| C15 | `RegisterReferenceSnapshot` | typed subject/source -> `Pending`/formal resolver outcome | body, wrong owner, duplicate mismatch | `03` §7.2、§9.4 |
| C16 | `UpdateReferenceSnapshotState` | newer comparable source -> versioned transition | older rollback、uncomparable winner guess、invalid rewrite | `03` §7.2、§9.4 |

### 4.2 Query 14/14

| ID | Protocol | Positive cut | Abnormal/boundary cut | no-write assertion |
|---|---|---|---|---|
| Q01 | `GetObservationReceipt` | visible receipt/surface | missing vs not-visible | zero write |
| Q02 | `GetIntakeStatus` | page and pending safety semantics | dangling relation/empty page | zero write |
| Q03 | `GetSafeSignal` | body-free signal surface | forbidden summary/stale/not-visible | zero write |
| Q04 | `GetSignalRollup` | window/count/freshness surface | require-fresh stale/rebuild not triggered | zero write |
| Q05 | `GetAuditTimeline` | canonical subject page/order | restricted/empty/missing distinction | zero write |
| Q06 | `GetEvidenceIndexInput` | sorted unique linkage/audit/gap set | incomplete or not-visible input | preview not saved |
| Q07 | `GetReportHandoff` | handoff/readiness/hint surface | blocked/degraded/mismatch | no prepare/deliver |
| Q08 | `GetRetentionProtection` | marker/protection/consumer set | active conflict/dangling relation | no release/delete |
| Q09 | `GetObservationReadModel` | stable composite read | stale/missing/rebuild relation | no rebuild/mark |
| Q10 | `GetDiagnosticView` | scope/view/summary/freshness bundle | partial/corrupt composite | no repair |
| Q11 | `GetGapStatus` | gap lifecycle/visibility surface | suppressed vs resolved; missing | no ack/close |
| Q12 | `GetPeripheralExportView` | consumer+scope product-neutral view | disabled/unavailable/not-visible | no external call |
| Q13 | `GetReferenceSnapshotView` | six resolution states | stale/invalid/source mismatch | no refresh |
| Q14 | `GetRebuildProgress` | target/plan/report progress | missing/mismatched progress | no start/finalize |

### 4.3 Consumer 9/9、Event 12/12、Job 9/9

| ID | Protocol | Positive cut | Abnormal/boundary cut | 主要来源 |
|---|---|---|---|---|
| I01 | `ConsumeBusObservationMaterial` | valid envelope -> local receipt/safety | unsupported/raw/duplicate/delayed | `03` §7.4、§8.4 |
| I02 | `ConsumeSourceAuditMaterial` | source audit -> local projection | missing context/body/older source | `03` §7.4、§8.4 |
| I03 | `ConsumeIdentityObservationContext` | safe identity ref -> snapshot | missing upstream schema/binding/consumer writer capability | affected register |
| I04 | `ConsumeGovernanceAuditContext` | safe governance context -> projection/reference | missing payload/binding/authority | affected register |
| I05 | `ConsumeArtifactEvidenceContext` | conditional only after canonical upstream schema/binding | unsupported/missing schema -> no parse/no write | `S08-E-I05-*` |
| I06 | `ConsumeRuntimeSignalSummary` | safe runtime summary -> signal/reference | body/older/unsupported | `03` §7.4、§14 |
| I07 | `ConsumeSandboxSignalSummary` | safe sandbox summary -> signal/safety | body/terminal rewrite | `03` §7.4、§14 |
| I08 | `ConsumeArchiveHandoffFeedback` | handoff feedback -> local lifecycle | older delivery/unknown | `03` §7.4、§9.3 |
| I09 | `ConsumeReportConsumerFeedback` | consumer delivery feedback -> local delivery/gap | reopen/unknown/wrong consumer | `03` §7.4、§9.5 |
| E01-E12 | each exact outbound event in `03` §7.5 | committed typed source -> immutable snapshot payload | missing snapshot/body/redaction/publisher failure | `03` §7.5、§8.5、§14 |
| J01 | `PublishObservationOutbox` | frozen eligible set -> item report | corrupt snapshot/unknown publish/duplicate | `03` §7.6、§12 |
| J02 | `RebuildObservationReadModels` | bounded scope capture -> atomic replacement | membership/source/fence failure | `03` §7.6、§10 |
| J03 | `RebuildSignalRollups` | stored signal -> fixed cursor rollup | raw source/incomplete cursor | `03` §7.6、§9 |
| J04 | `RefreshReferenceSnapshots` | immutable target set -> resolver outcomes | unavailable/body/stale fence | `03` §7.6、§12 |
| J05 | `ScanObservationGaps` | expected refs -> gap scan/report | no-basis close/synthetic material | `03` §7.6、§9 |
| J06 | `CoordinateObservationReplay` | conditional controlled blocked/manual; future positive reserved | H13 open/source-write/guard failure | `R06.6-F2-H13-UPSTREAM` |
| J07 | `PrepareReportHandoffDelivery` | historical handoff binding -> prepare/deliver report | mismatch/unknown/retry accounting | `03` §7.6、§13 |
| J08 | `PrepareExternalAuditExport` | export preparation -> delivery result | missing preparation/body/wrong target | `03` §7.6、§13 |
| J09 | `RebuildPeripheralViews` | fixed safe source -> product-neutral view | source revision/visibility/assembly failure | `03` §7.6、§10 |

E01-E12 必须在 Step 06 进一步展开为 12 个独立 case group；“每个 event”不得替换为一张 family
模板。J06 的 positive 只保留为 reserved/blocked contract。

## 5. 正式状态与一致性测试切口

### 5.1 27 个 formal state owner

| 状态组 | owner 数 | 测试要求 |
|---|---:|---|
| observation truth/safety | 6 | 每个 owner 至少一个合法迁移、非法/terminal/reserved 迁移，断言 history/outbox/stale 副作用 |
| handoff/retention/gap | 9 | 每个 owner 验证 visibility/gap/retention/no-write 约束和 terminal/reserved 边界 |
| read/reference/maintenance | 7 | 每个 owner 验证 freshness、source version、rebuild/refresh 只经正式 Job/Command 改变 |
| propagation/idempotency/report | 5 | 每个 owner 验证 snapshot、claim/fence、duplicate、report fold 和 terminal语义 |
| technical coordination | `ObservationJobPlanItemState` | 单独验证 claim/item/fence；不写成业务 truth 或第 28 个 formal state |

### 5.2 状态切口规则

| 切口 | 断言 |
|---|---|
| `state_legal_transition` | 正式 trigger + exact from/to + native record/history + allowed side effects |
| `state_illegal_transition` | invalid input/owner/phase 返回 typed error，无 state/history/outbox/stale/result 变化 |
| `state_terminal_and_reserved_guard` | terminal 保持不可变；reserved transition 返回 `ReservedTransition`，不由测试绕过 |
| `state_cross_object_side_effect` | state 变化带出的 marker、gap、stale、outbox、handoff、report 与 UoW set 一致 |
| `job_item_state_claim_fence` | `Planned -> Running -> Succeeded/FailedRetryable/FailedPermanent/Blocked/SkippedTerminal` 由 immutable plan + claim/fence 驱动 |

## 6. 一致性、错误、配置和安全切口索引

| 领域 | 独立切口 | 关键断言 |
|---|---|---|
| accepted UoW | `accepted_uow_effect_set` | owner/post-state、membership、one cursor、history、outbox/stale、result、completion、commit 集合和顺序一致 |
| rollback | `rollback_zero_partial` | 任一 staged failure 回滚本地 staged set；external call 前的准备失败不产生 deliver；commit unknown 不猜成功 |
| duplicate/idempotency | `duplicate_replay_same_digest`、`duplicate_conflict_different_digest`、`inflight_single_winner` | same digest 读 stored result/report；different digest conflict；in-flight 无 second writer |
| persistence | `repository_cas_append_cursor` | version/CAS、append-only、cursor tag/order、projection membership、old snapshot 可见性一致 |
| recovery | `typed_recovery_mapping`、`commit_unknown_probe`、`external_unknown_manual` | exact error->recovery class；probe-before-action；Unknown/Unsupported 不盲重试/换 token |
| external phase | `external_phase_link_and_retry_accounting` | preparation/call/probe/finalize 使用同一 intent/token/binding；attempt/probe/finalize 计数分离 |
| configuration | `config_profile_matrix`、`config_complete_or_error`、`config_redline_fail_fast`、`config_historical_binding` | `LocalTest/IntegrationLike/RuntimeLike` guard、strict source priority、13-stage totality、old work pinned；`RuntimeLike` 禁止 fake/control |
| telemetry | `telemetry_schema_allowlist`、`telemetry_cardinality_guard`、`correlation_no_truth_derivation` | fields/labels/span attrs finite、安全、低基数；correlation不推导业务 truth |
| redaction | `redaction_before_serialization`、`forbidden_material_scan` | mapping失败抑制整组不安全字段；hash/base64/debug不能绕过 |
| report/evidence | `report_handoff_body_free`、`evidence_candidate_truthfulness` | handoff/input/hint body-free；planned/candidate 不是真实 alias/verdict/signoff |
| retention/no-write | `retention_active_reference_guard`、`no_write_violation_block` | active reference不误删；Query/Job/rebuild/replay/export不写 source truth |
| dependency | `workspace_dependency_direction`、`entry_capability_isolation` | only `core-contracts` compile dependency；entry无repository/UoW/raw handle能力 |

## 7. P0 测试切口停审记录

| 切口组 | 来源是否具体 | 风险是否具体 | 层级是否合理 | 用例是否可落地 | 结论 |
|---|---|---|---|---|---|
| 七模块 | `03` §5~§6、Step 16 | 是 | 是 | 是，Step 06 展开 | `pass` |
| 16 Command | `03` §7.2/§8.2、C01~C16 | 是 | 是 | 是，逐项展开 | `pass` |
| 14 Query | `03` §7.3/§8.3、Q01~Q14 | 是 | 是 | 是，逐项展开并保留 zero-write | `pass` |
| 9 Consumer | `03` §7.4/§8.4、I01~I09 | 是 | 是；I05 conditional | 是，blocked/positive 分开 | `pass` |
| 12 Event | `03` §7.5/§8.5、E01~E12 | 是 | 是 | 是，逐 event 展开 | `pass` |
| 9 Job | `03` §7.6/§8.6、J01~J09 | 是 | 是；J06 controlled | 是，逐 job 展开 | `pass` |
| 27 state owner | `03` §9、Step 10 | 是 | 是 | 是，逐组展开 | `pass` |
| UoW/error/idempotency/concurrency | `03` §10~§13 | 是 | 是 | 是，failure injection/harness | `pass` |
| config/telemetry/redaction/no-write | `03` §13~§14、`04` | 是 | 是 | 是，静态+运行组合 | `pass` |

## 8. 跨切口设计来源审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 孤儿 P0 协议 | `pass`；60/60 已登记 | Step 06 必须保留 exact ID，不用 family 模板替代 |
| 孤儿 P0 状态 owner | `pass`；27/27 + technical Job item | Job item 独立标注，不增加业务 state 数量 |
| 孤儿 P0 设计契约 | `pass`；模块/协议/flow/state/UoW/error/config/telemetry 均有切口 | Step 05 做双向覆盖矩阵 |
| 重复切口 | `pass`；shared cut 只承接共性，exact protocol 另有入口 | 不重复生成第二 owner |
| 状态/字段命名漂移 | `pass`；以 current `03` formal name 为准 | 旧 Artifact/legacy 名称禁止进入后续 Step |
| phase boundary 越界 | `pass`；J06/I05 条件化，external phase 保留 | Step 06 逐用例复核 |
| affected 隐藏 | `pass`；12 项保持 open/conditional | `06/07` 继续消费，不在 `05` 关闭 |
| 真实执行状态 | `not_run` | 所有 evidence/结果继续 planned/candidate |

## 9. 回填草稿

本步回填正式 `05-测试方案.md` §3。正式正文只承载：测试对象按七模块、五族 exact protocol、27 formal
state owner、一致性/恢复/幂等、配置运行时、观测审计安全和依赖边界组织；每个 P0 切口回指 current
`02/03/04` 的具体章节或 `03_ddd_step_16_test_cuts.md`；60 个协议必须逐项有正向与异常入口，Query
保持 strict no-write，I05/J06 和 inherited affected 用 conditional/blocked 语义；完整用例、数据、环境和
证据在后续 Step 展开。

## 10. 待确认事项

| ID | 内容 | 状态 | 影响 |
|---|---|---|---|
| `Q-05-03-OBJECT` | I05 canonical payload/binding、J06 H13 positive、若干 affected 的 owner/field closure | inherited open | 对应 exact positive path 标 conditional/blocked |
| `Q-05-04-OBJECT` | target repo 和真实 adapter/physical store 尚不存在或未核实 | not established | 只形成 design cut，不形成 execution evidence |
| `Q-05-05-OBJECT` | performance/capacity/freshness threshold 尚无 current workload source | candidate | 后续 NFR test 标 not_evaluated |

## 11. 门禁与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 七模块均有测试对象和切口 | `pass` |
| 60 个 exact protocol 均有独立入口 | `pass`；16/14/9/12/9 |
| 27 个正式状态 owner 均有切口 | `pass`；Job item 另列技术状态 |
| 关键字段/DTO/引用混同有负向切口 | `pass` |
| UoW/错误/恢复/幂等/并发/配置/观测均有独立切口 | `pass` |
| 每个 P0 切口已停审 | `pass` |
| 孤儿契约、重复、命名漂移和 phase 越界审计 | `pass` |
| blocker/affected 是否被关闭 | `no`；保持 inherited/conditional |
| 测试、evidence、验收、实现、commit 是否真实存在 | `not_run/not_established` |
| Step gate | `pass` |
| next_allowed_action | `start_current_05_step_04` |

## 12. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 03
- `standards/document/测试方案书写规范.md` §三.3
- `projects/L4-observability/design-calibration/05_test_plan_step_01_input_boundary.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_02_scope.md`
- `projects/L4-observability/02-概要设计.md` §4~§12
- `projects/L4-observability/03-详细设计.md` §5~§17
- `projects/L4-observability/design-calibration/03_ddd_step_16_test_cuts.md`
- `projects/L4-observability/04-配置设计.md` §6~§13
