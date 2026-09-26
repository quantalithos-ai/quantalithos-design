# Step 3. 抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3。
> 回填章节：未来正式 `05-测试方案.md` §3。
> 本步从已冻结的 03/04 契约抽取对象和最小切口；不增加新的业务对象或状态。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 3 / test_objects_cuts |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 上游回写 | `03=0`、`04=0`；未发现需要新增字段/状态/port/error/config leaf 的测试缺口 |
| 直接下一步 | Step 4：制定测试策略与分层 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 本步输入

| 输入 | 直接抽取 |
|---|---|
| `03-详细设计.md` §5～§15 | 29 个对象、ports、10 Command、13 Query、3 Consumer、3 Job、17 状态、UoW、错误、观测和 test-cut 族 |
| `03_ddd_step_16_test_cuts.md` | `TC-SYNC-MOD-*`、`TC-SYNC-PROTO-*`、`TC-SYNC-CMD-*`、`TC-SYNC-QRY-*`、`TC-SYNC-CONS-*`、`TC-SYNC-JOB-*`、`TC-SYNC-STATE-*` |
| `04-配置设计.md` §6～§12 | 42 leaf、4 profiles、source/validation/activation、redaction、failure/degradation |
| Step 2 scope | P0/P1/P2 边界和 VETO 负向责任 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 测试对象如何分组？ | 以 CP1 selection/access、CP2 working-copy metadata、CP3 source materialization、CP4 conflict/recovery、CP5 review handoff/provenance，加 shared protocol/consistency/config/observability 横切分组。 |
| 每个对象需要什么切口？ | 至少有构造/不变量、合法主线、非法输入或状态迁移、幂等/版本/恢复和禁止副作用切口；derived view 另加 zero-write。 |
| Command/Query/Consumer/Job 是否逐一覆盖？ | 是。10 Command、13 Query、3 Consumer、3 Job 各自拥有稳定 `TC-SYNC-*` 入口；Outward Event 保持 `not_applicable`，增加 architecture negative check。 |
| 是否创建新的 lifecycle？ | 否。只覆盖 03 的 17 个正式状态主语；`blocked/unknown/partial` 为 disposition/结果或已有状态值，不另建第 18 个主语。 |
| adapter 未闭合如何写？ | 定义 contract/failure/forbidden-call 断言为 planned；真实正向 SDK/Git/fs/physical metadata 接缝标 `blocked/waiting`。 |

## 4. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前抽取 |
|---|---|---|
| 对象命名 | 旧 SyncTask、同步结果、通用冲突视图 | 03 exact 29 objects；local truth 与 derived view 分开 |
| 接口覆盖 | 以 happy path 命令叙述 | 10 Command / 13 Query / 3 Consumer / 3 Job 一一登记 |
| 状态 | 体验层状态混用 | 17 个正式 state machine，各自 transition helper 和 terminal 规则 |
| 证据语义 | 用结果/ACK 代表完成 | local disposition、transport、probe、Decision 分层；不提升 accepted |
| 外部事件 | 假设有统一 outbound sync event | 03 已定 `Outbound Event = not_applicable`；只保留 inbound 条件消费者 |

## 5. 结构化对象与切口总表

### 5.1 29 个对象按 capability part

| CP | 对象 | 主要切口 | P0/P1 姿态 |
|---|---|---|---|
| CP1 selection/access | `SyncOperation`、`SyncSelection`、`AccessEvaluation`、`OperationEligibilityPolicy`、`ExternalOwnerSnapshot` | explicit selector、eligibility monotonicity、owner snapshot freshness、operation transition | P0 local / P1 owner read blocked |
| CP2 working-copy metadata | `WorkingCopyBinding`、`MetadataManifest`、`CursorState`、`MappingSet`、`WorkingCopyObservation`、`WorkingCopySafetyPolicy`、`MetadataIntegrityPolicy` | generation/source continuity、integrity、cursor continuity、mapping conflict、dirty/path safety、query observation no-write | P0 logical / physical store blocked |
| CP3 materialization | `MaterializationPlan`、`SourceDelta`、`PathChangeSet`、`MaterializationRun`、`MaterializationSafetyPolicy` | plan single-consume、comparator/gap、safe path set、prepare/apply/finalize、non-overwrite | P0 controlled local / source+tool blocked |
| CP4 conflict/recovery | `ConflictRecord`、`RecoveryCheckpoint`、`ManualResolution`、`ProbeRecord`、`RecoverySafetyPolicy` | conflict fact vs intent、checkpoint fingerprint、probe identity、no blind replay、resume/cancel | P0 local / formal probe blocked |
| CP5 handoff/provenance | `ReviewCandidate`、`HandoffAttempt`、`ProvenanceRecord`、`CandidateEligibilityPolicy`、`HandoffResultPolicy`、`LayeredHandoffStatus`、`SyncStatusView` | freeze digest/scope/generation、attempt-before-call、transport/probe/Decision layers、append/protect provenance、safe view | P0 local / owner handoff blocked |

### 5.2 横切 carrier / policy

| carrier / policy | 测试责任 | 禁止混同 |
|---|---|---|
| `OpaqueRef<K>`、explicit selection DTO | literal kind、selector completeness、ref 不可互换 | 不用裸 string 猜型 |
| `SyncCommandRequest` / `SyncQueryRequest` | required metadata、actor、correlation、idempotency、body-free public surface | Query 不含 mutation capability |
| `SyncProtocolResult` / `SyncQueryResponse` | typed disposition、completeness、freshness、next action | 无 top-level success/accepted/ready |
| `Versioned<T>` / expected version | optimistic concurrency、stale write reject、commit unknown reload | cursor 不作 entity version |
| idempotency carrier | channel/key/digest namespace、exact replay、digest conflict | 不以 log/cache 代替 stored result |
| `RuntimeBindingSnapshot` / capability snapshot | historical context continuity、capability map totality | bound/blocked/unsupported 不等健康/授权 |
| config typed profile | strict source、required leaf、redaction、fail-fast | raw secret/body/path 不出 boundary |

### 5.3 Public protocol cuts

| 协议族 | 数量 | P0 切口 | 必须断言 |
|---|---:|---|---|
| Command | 10 | `TC-SYNC-CMD-001~010` | request validation、same/different digest、version/generation guard、durable prepare、known/partial/unknown、禁止调用 |
| Query | 13 | `TC-SYNC-QRY-001~013` | hit/missing/not-visible/partial/unavailable、selector、zero UoW/write/lock/probe/handoff |
| Inbound Consumer | 3 | `TC-SYNC-CONS-001~003` | envelope/schema/source/digest、duplicate receipt、quarantine、保守 invalidation |
| Outbound Event | 0 | `TC-SYNC-ARCH-OUTBOUND-001` | 静态/架构检查无 outbox/topic/publisher truth |
| Operations Job | 3 | `TC-SYNC-JOB-001~003` | bounded scope、item result、exact report replay、partial/unknown、no truth repair |

### 5.4 17 个状态切口

| 编号 | 状态主语 | 测试重点 |
|---:|---|---|
| 1 | `SyncOperationState` | planned→validating→ready/running、needs_action resume、terminal 不复活 |
| 2 | `EligibilityOutcome` | eligible/denied/blocked/unknown/stale 单调收紧 |
| 3 | `FreshnessState` | fresh→stale/unknown/invalidated/unavailable；不本地恢复 fresh |
| 4 | `WorkingCopyBindingState` | initializing/bound/restricted/needs_migration/needs_rebind/invalidated |
| 5 | `MetadataIntegrityState` | valid/needs_migration/corrupt/unknown/read_only_protected |
| 6 | `CursorContinuityState` | unset/continuous/gap/unknown/unsupported；gap 不推进 |
| 7 | `MappingIntegrityState` | valid/conflict/unknown/invalidated；需新 known run 才恢复 |
| 8 | `MaterializationPlanState` | draft/validated/invalidated/consumed；validated 只消费一次 |
| 9 | `PathChangeSafetyState` | draft/safe/conflict/blocked/unknown；非 safe 不强制 |
| 10 | `MaterializationRunState` | prepared/applying/applied_pending_finalize/finalized/partial/outcome_unknown/blocked/failed_known |
| 11 | `ConflictState` | open/awaiting_decision/resolution_recorded/superseded/closed |
| 12 | `RecoveryCheckpointState` | captured/resumable/invalidated/probe_required/completed |
| 13 | `ManualResolutionState` | recorded→validated→applied；rejected/superseded不可越级 |
| 14 | `ProbeRecordState` | prepared/in_flight/resolved_known/still_unknown/unsupported/failed_known |
| 15 | `ReviewCandidateState` | inspecting/eligible/frozen/invalidated/handed_off |
| 16 | `HandoffAttemptState` | prepared/calling/transport_known/outcome_unknown/probe_required/external_pending/terminal_known |
| 17 | `ProvenanceRecordState` | active/protected/superseded/integrity_unknown；无 delete/伪造 |

## 6. 测试设计取舍

1. 每个 object 只测其 owner 规则；跨 feature 组合由 application flow 测，不在 domain 单元中复制外部 truth。
2. 每个 Command 的 positive local path 和 negative path 成对出现；每个 Query 的 hit 和 no-write 成对出现；每个 Consumer/Job 至少有 accepted/duplicate/unsupported 或 partial 分支。
3. Physical `.qs-sync`、owner source、Review Decision 和 Git/fs positive 成功仅登记接口与阻断理由；不能用内存 fake 声称真实集成已通过。
4. `TC-SYNC-*` 是计划 ID，不是 case/file/run/evidence 实例；Step 6 才展开为场景与用例矩阵。

## 7. 回填草稿（未来正式 §3）

测试对象按五个 capability part 和横切协议/一致性/配置/观测组织。正式方案必须逐一覆盖 29 个对象、10 个 Command、13 个 zero-write Query、3 个 Consumer、3 个 Job 和 17 个状态主语；Outward Event 当前为 `not_applicable`，以架构负向检查防止误建 publisher。所有切口均保留 P0/P1 blocker 姿态和证据上限。

## 8. 待确认事项

| 事项 | 处理 |
|---|---|
| `TC-SYNC-*` 最终 case 文件命名 | 由 07/实现前 local toolchain 决定；05 只锁语义 ID。 |
| Consumer event source/topic/order | `SYNC-UP-017`/`SYNC-UP-001` 类依赖保持 blocked；只测试 envelope validator 和保守 transition。 |
| physical metadata repository | `SYNC-UP-006` 关闭前不把 repository contract 写成可执行正向结果。 |
| 需要新增对象/状态的发现 | design-change-required，暂停相关后续切口并回写 03。 |

## 9. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 29 对象、10 Command、13 Query、3 Consumer、3 Job 逐一列出 | pass |
| 17 状态主语和值与 03 完全一致 | pass |
| Outbound Event `not_applicable` 未被误扩展 | pass |
| P0/P1 和 blocker 姿态清晰 | pass_with_upstream_blockers |
| 没有新增业务真相、字段、状态或外部能力 | pass |
| 允许进入 Step 4 | pass |

## 10. 下一步门禁

Step 4 只能为上述对象和切口分配 unit/contract/application/adapter/entry/release 层级。任何切口若需要真实 owner/tool/store 才能证明，必须标记 `blocked/waiting` 并保留替代的 local negative/contract 断言。
