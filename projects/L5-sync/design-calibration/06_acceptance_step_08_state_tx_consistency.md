# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8
> 回填位置：正式 `06-验收标准.md` §8

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 8 / state_tx_consistency |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 验收范围 | 17 状态主语、合法/非法迁移、UoW、原子可见性、commit unknown、幂等与并发 |
| 下一步 | `Step 9 / nonfunctional` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 17 个状态主语与 exact enum | `03-详细设计.md` §9 | `available` | 状态唯一真相源 |
| UoW、logical stores、commit unknown | `03-详细设计.md` §10 | `available` | 原子一致性验收来源 |
| 错误/恢复矩阵 | `03-详细设计.md` §11 | `available` | invalid/blocked/unknown/defect 口径 |
| 并发、幂等、重入 | `03-详细设计.md` §12 | `available` | duplicate/race/replay 口径 |
| State/consistency test cuts | `05-测试方案.md` §6.5、§12/§14 | `planned` | 未来 evidence 入口 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些合法迁移必须通过？ | 只允许 03 状态矩阵定义的主线；NeedsAction 只能显式 Resume→Validating，Partial/OutcomeUnknown 不可直接 Finalized，Invalidated/terminal 不原地复活。 | 03 §9 |
| 哪些非法迁移必须拒绝？ | terminal reopen、表外跳转、context/generation/ref mismatch、unknown→known 伪造、intent→effect 直达、non-Fresh→Fresh 本地恢复、Conflict→Safe 无新观察。 | 03 §9/§11 |
| 哪些事务必须原子提交？ | operation transition、binding/generation、materialization finalize、handoff prepare、probe prepare/finalize、accepted Consumer、completed Job 的规定写集必须共同可见。 | 03 §10 |
| 如何判定幂等和并发？ | 同 identity+digest exact replay；同 identity 不同 digest conflict/zero effect；in-flight 不得第二 writer；version/generation/lease/fingerprint race 必须拒绝或转 needs_action。 | 03 §12 |
| 失败时如何裁决？ | 状态/事务失败、commit unknown 无法 reload、carrier/provenance 缺失、stale overwrite、cursor 过早推进均 P0 不通过；VETO 命中不可风险接受。 | 00 BR-013/014；05 §12.3 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 使用口语状态如“同步中/完成” | 无法映射 17 个正式主语和 enum | 只使用 03 exact state vocabulary |
| 把 disposition 当 lifecycle state | 会新增不存在的状态并掩盖 owner boundary | `blocked/unknown/partial` 按对应主语或结果层表达 |
| 只检查最终状态 | 中间 prepare、checkpoint、cursor、provenance 可能丢失 | 验收写集与阶段性副作用断言 |
| 以重试次数判断 unknown | 可能盲重放外部 effect | 固定 identity/digest reload + probe/manual |
| Query/Job 参与业务修复 | 破坏 zero-write/no-repair | state/tx 门禁明确 query/job 禁止写 truth |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 状态口径 | 单一 SyncStatus | 17 个主语各自 lifecycle；view/disposition 不冒充 state | 可落码、可审计 |
| Finalized | 可能由 apply/ACK 推断 | 仅 known finalize UoW 可达；cursor/mapping 同步可见 | 防过早推进 |
| Unknown | 可换 key 重试 | 原 identity/digest reload，ProbeRequired/StillUnknown 保留 | 防盲重放 |
| 事务 | 只看 repository save | 写集、prepare-before-effect、carrier/provenance 原子可见 | 闭合 local truth |
| 并发 | 依赖单一 lock | version + generation + fingerprint + namespaced digest | 覆盖 stale/duplicate/race |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只测最终文件结果 | 直观 | 漏状态、cursor、provenance、unknown | 拒绝 |
| 只测状态 enum | 易自动化 | 漏 UoW、外部 effect 和写集 | 拒绝 |
| 状态矩阵 + flow trigger + UoW write-set + replay/race evidence | 能判断状态和副作用是否一致 | 测试切口较多 | 采用 |

## 7. 结构化中间产物

### 7.1 17 个状态主语验收矩阵

| 状态主语 | 正式状态值/关键合法路径 | 必须拒绝的迁移 | 主要测试/EV |
|---|---|---|---|
| `SyncOperationState` | `planned→validating→ready→running→completed/needs_action/failed_known/cancelled`；NeedsAction 仅显式 Resume | terminal reopen、unknown 隐式 completed | `TC-SYNC-STATE-001`、`EV-SYNC-CONSISTENCY-001` |
| `EligibilityOutcome` | `eligible/denied/blocked/unknown/stale`；只由 owner evaluation 形成 | unknown/stale 本地升 Eligible | `TC-SYNC-STATE-002`、`EV-SYNC-TRACE-001` |
| `FreshnessState` | `fresh/stale/unknown/invalidated/unavailable`；新 owner read 才能新鲜 | cache/telemetry 使 non-Fresh→Fresh | `TC-SYNC-STATE-003`、`EV-SYNC-OPS-001` |
| `WorkingCopyBindingState` | `initializing→bound/restricted/needs_migration/needs_rebind/invalidated` | invalidated 复活、旧 identity 原地 rebind | `TC-SYNC-STATE-004`、`EV-SYNC-TRACE-001` |
| `MetadataIntegrityState` | `valid/needs_migration/corrupt/unknown/read_only_protected` | degraded/corrupt 静默 Valid、Query 修复 | `TC-SYNC-STATE-005`、`EV-SYNC-CONFIG-001` |
| `CursorContinuityState` | `unset→continuous`；`gap/unknown/unsupported` 保留 | gap/unknown 猜 continuous、partial 推进 | `TC-SYNC-STATE-006`、`EV-SYNC-CONSISTENCY-001` |
| `MappingIntegrityState` | `valid/conflict/unknown/invalidated`；新 known run 后才可收束 | conflict 静默 valid、invalidated 复活 | `TC-SYNC-STATE-007`、`EV-SYNC-CONSISTENCY-001` |
| `MaterializationPlanState` | `draft→validated→consumed` 或 invalidated | validated 重复消费、drift 后原地复用 | `TC-SYNC-STATE-008`、`EV-SYNC-FLOW-001` |
| `PathChangeSafetyState` | `draft→safe` 或 conflict/blocked/unknown | unknown 强制 safe、自动解决 path conflict | `TC-SYNC-STATE-009`、`EV-SYNC-FLOW-001` |
| `MaterializationRunState` | `prepared→applying→applied_pending_finalize→finalized`；partial/unknown/blocked/failed_known 保留 | 跳过 pending-finalize、partial/unknown→finalized | `TC-SYNC-STATE-010`、`TC-SYNC-CONSISTENCY-001` |
| `ConflictState` | `open→awaiting_decision→resolution_recorded→superseded/closed` | intent 直达 closed、删除 conflict history | `TC-SYNC-STATE-011`、`EV-SYNC-CONSISTENCY-001` |
| `RecoveryCheckpointState` | `captured/resumable/probe_required/completed/invalidated` | possible effect 直接 resumable、invalidated 复活 | `TC-SYNC-STATE-012`、`EV-SYNC-CONSISTENCY-001` |
| `ManualResolutionState` | `recorded→validated→applied` 或 rejected/superseded | recorded→applied 无实际 known result | `TC-SYNC-STATE-013`、`EV-SYNC-CONSISTENCY-001` |
| `ProbeRecordState` | `prepared→in_flight→resolved_known/still_unknown/unsupported/failed_known` | StillUnknown 由 log/telemetry 改 known、重提 submit | `TC-SYNC-STATE-014`、`EV-SYNC-HANDOFF-001` |
| `ReviewCandidateState` | `inspecting→eligible→frozen→handed_off`；drift→invalidated | frozen 后静默 scope/generation 改写、invalidated 复活 | `TC-SYNC-STATE-015`、`EV-SYNC-HANDOFF-001` |
| `HandoffAttemptState` | `prepared→calling→transport_known/outcome_unknown/probe_required/external_pending/terminal_known` | ACK→accepted、unknown→calling 重提 | `TC-SYNC-STATE-016`、`EV-SYNC-HANDOFF-001` |
| `ProvenanceRecordState` | `active→protected/superseded/integrity_unknown`；append/protect/supersede | delete、伪造 parent/digest、integrity unknown 隐藏 | `TC-SYNC-STATE-017`、`EV-SYNC-TRACE-001` |

### 7.2 UoW 与原子可见性验收

| UoW 边界 | 必须同一 local commit 可见的写集 | 失败条件 | EV/path |
|---|---|---|---|
| operation transition | operation revision + transition + terminal local result + provenance | 状态已 terminal 但 result/provenance/carrier 缺失 | `EV-SYNC-CONSISTENCY-001`; `reports/runs/<run_id>/...` |
| binding/generation | new generation objects + old protected refs + metadata transition + provenance | 旧链被覆盖/删除、new binding 缺 ref | `EV-SYNC-TRACE-001`; `reports/runs/<run_id>/...` |
| materialization finalize | run Finalized + cursor + mapping + manifest/binding + plan/path + provenance + stored result/idempotency | cursor 先动、run 与 mapping 不一致、partial 当 Finalized | `EV-SYNC-FLOW-001`、`EV-SYNC-CONSISTENCY-001`; fixed report root |
| handoff prepare | Prepared attempt + invocation identity + checkpoint + candidate relation before call | effect 已发但 attempt/checkpoint 不可回链 | `EV-SYNC-HANDOFF-001`; fixed report root |
| probe prepare/finalize | probe record/invocation before probe；result + attempt/checkpoint/provenance after | probe 结果覆盖 prior unknown、缺 stored carrier | `EV-SYNC-HANDOFF-001`; fixed report root |
| accepted consumer | conservative transitions + provenance + full receipt + idempotency completion | receipt 缺失、raw payload 入库、consumer 修改 owner truth | `EV-SYNC-OPS-001`; fixed report root |
| completed job | committed per-item changes + typed job result + idempotency completion | batch completed 隐藏 item failure、job report 冒充 readiness | `EV-SYNC-OPS-001`; fixed report root |

### 7.3 Commit unknown / 幂等 / 并发门禁

| 场景 | 通过条件 | 失败条件 | 主要测试 |
|---|---|---|---|
| same key + same digest + completed | exact stored typed carrier replay，零新 effect | 重新执行 domain/effect/scan/probe | `TC-SYNC-IDEMP-001` |
| same identity + different digest | `idempotency_conflict`，zero write/effect | 覆盖旧 reservation 或合并语义 | `TC-SYNC-IDEMP-001` |
| reserved/in-flight | already-in-progress/delayed，第二 writer 为 0 | 超时接管、换 key 重提 effect | `TC-SYNC-IDEMP-001` |
| commit status unknown | 原 identity/digest reload idempotency、carrier、version、attempt/checkpoint；缺失则 consistency defect/manual | 用文件时间、Git status、ACK、log、retry count 猜成功/失败 | `TC-SYNC-CONSISTENCY-001` |
| optimistic version race | stale UoW rollback/reload/revalidate；不 stale overwrite | 旧 revision 覆盖新 revision | `TC-SYNC-CONSISTENCY-001`、`TC-SYNC-STATE-001~017` |
| target/generation/fingerprint race | needs_action/conflict，新 operation 才可继续 | 原 run 强制继续或跨 generation apply | `TC-SYNC-CONSISTENCY-001` |
| Query re-entry | 每次只读，不占写锁、不写 idempotency、无 probe/handoff | Query 修复、refresh、repair 或改变上游 | `TC-SYNC-QRY-001`、`TC-SYNC-QRY-004~006` |

### 7.4 跨状态一致性审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 17 状态主语和 exact values | pass | 与 03/05 一致，无旧 SyncStatus |
| 每个迁移有正式 trigger surface | pass (planned) | 未来实现/TC 必须保持；无 trigger 的迁移回写 03 |
| 非法转换/terminal reopen 有负向断言 | pass (planned) | `TC-SYNC-STATE-001~017` 计划覆盖 |
| UoW write-set 与 flow 对齐 | pass | 以 03 §10 为唯一来源 |
| commit unknown/duplicate/race 口径 | pass | 不用替代信号关闭 |
| Query zero-write / Job no-repair | pass | 与 Step 7/05 一致 |
| 真实 repository/physical integration | blocked | `SYNC-UP-005/006/008`、`SYNC-LOCAL-*` |

## 8. 回填草稿

正式 §8 应声明：验收使用 03 的 17 个状态主语和 exact enum，逐项检查合法/非法迁移、terminal/invalidated 不复活、context/generation/ref mismatch、UoW 原子写集、cursor/manifest/mapping/provenance 一致性、commit unknown reload、exact replay、digest conflict、in-flight second writer 和 race protection。partial/unknown/commit-unknown 不能被压成 Finalized/成功；Query zero-write、Consumer/Job no-repair 继续适用。任一状态、事务或一致性硬门禁失败不得通过，命中 VETO 时不可风险接受。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| repository physical atomicity/driver | UoW positive integration | `SYNC-UP-006` |
| comparator/gap/replay exact contract | Cursor/Mapping positive | `SYNC-UP-008` |
| Git/fs partial/unknown semantics | MaterializationRun positive | `SYNC-UP-007/010` |
| formal probe/idempotency contract | Handoff/Probe positive | `SYNC-UP-004/005` |

## 10. 进入下一步条件

- [x] 17 个状态主语、合法/非法迁移均有验收口径和测试计划入口。
- [x] UoW、commit unknown、幂等、并发、Query zero-write、Job no-repair 已形成门禁。
- [x] 状态/事务验收项已停审，跨状态一致性审计无 unresolved 设计冲突。
- [x] 正式 §8 回填草稿已形成。
- [x] 本步停审；进入 Step 9 前读取 00 NFR、03 observability/config、04 profiles、05 nonfunctional。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 状态与 local consistency 门禁可判定；physical/owner positive 仍 blocked/waiting，未声称执行或通过。
- 下一步阅读：00 §13、03 §13/§14、04 §6/§9/§11、`05_test_plan_step_10_nonfunctional.md`，创建 Step 9。
