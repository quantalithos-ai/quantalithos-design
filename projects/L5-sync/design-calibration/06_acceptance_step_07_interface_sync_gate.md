# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7
> 回填位置：正式 `06-验收标准.md` §7

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 7 / interface_sync_gate |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 验收范围 | 10 Command、13 Query、3 Inbound Consumer、0 Outbound Event、3 Operations Job |
| 下一步 | `Step 8 / state_tx_consistency` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| Public envelope/result、Command/Query/Consumer/Job exact names | `03-详细设计.md` §7 | `available` | 协议真相源 |
| Function flows、error/recovery、Query zero-write | `03-详细设计.md` §8/§11 | `available` | 通过/失败条件 |
| TC/EV、依赖边界和 blocker | `05-测试方案.md` §1/§3/§6/§13 | `planned` | 只消费计划证据 |
| 全局 compile/runtime/event 依赖分类 | 全局依赖规则 §2/§4/§5 | `available` | 跨仓验收方式 |
| L0/L1/L4 专项正式文档 | 专项上游 | `contract_partial` | 只验 seam；精确合同未闭合保持 blocked |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个 P0 Command 如何验收？ | 验证 envelope、explicit selection、typed ref、validation、same/different digest、version/generation guard、prepare-before-effect、known/partial/unknown result、exact stored carrier 和禁止调用。 | 03 §7.2、05 §6.2 |
| 每个 P0 Query 如何验收？ | 验证 hit/missing/not-visible/partial/unavailable/stale slice；断言不 begin UoW、不 reserve idempotency、不锁写、不写 repo/provenance、不 probe/handoff、不发送 diagnostic。 | 03 §7.3、05 §6.3 |
| 每个 Inbound Consumer 如何验收？ | 验证 event envelope/source/schema/version/digest/idempotency；duplicate/quarantine 保守处理；只收紧 local snapshot/plan/candidate，不自动 pull/cancel/handoff/解释 Decision。 | 03 §7.4、05 §6.4 |
| 是否存在 Outbound Event？ | 不存在；正式值为 `not_applicable`，不得创建 outbox/topic/publisher 或把本地变化当 outbound truth。 | 03 §6.3/§7.4；05 §3.3 |
| 每个 Operations Job 如何验收？ | 验证 bounded input、system actor、per-item version/UoW、exact replay、partial/unknown、无 auto repair/migrate/rebind/delete/submit/readiness。 | 03 §7.4、05 §6.4 |
| 跨仓同步成功标准是什么？ | 按依赖类型区分：compile 只验允许的 core/sdk contract；runtime 验 SDK/adapter seam 与 typed error/availability；event 只验 inbound envelope/receipt/保守失效；不得要求下游完整实现或跨仓事务。 | 全局依赖规则 §2/§5；01 §8 |
| 下游未就绪时如何裁决？ | local protocol/negative 可 planned；owner/tool/physical positive 为 blocked/waiting；不能用 fake、cache、ACK、HTTP 200、remote object、job report 或 telemetry 替代。 | 05 §1/§14；Step 2/3 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 将所有协议当作“API 成功” | 混淆 local result、transport、probe、Decision 层 | 使用 exact layered result/disposition |
| Query 与 Command 共用副作用路径 | 可能隐式 refresh/probe/repair | 逐 Query 固定 zero-write 断言 |
| 把 Inbound Consumer 当 outbound publisher | 会新增不存在的 event truth | `Outbound Event = not_applicable`，Consumer 只收紧 local state |
| 以跨仓源码依赖代替 SDK/runtime seam | 违反全局依赖裁剪和 ownership | compile/runtime/event 分类验收 |
| 下游未就绪被写成失败或成功 | 结论失真 | blocked/waiting 与 P0 local gate 分离 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| Command | 泛化“调用接口成功” | 10 个 exact Command 各自有 guard、result 和禁止动作 | 可执行审计 |
| Query | 只验证返回值 | 13 个 Query 另有 zero-write 调用断言 | 防隐藏副作用 |
| Event | 可能默认双向同步 | 3 inbound conditional consumer，0 outbound event | 保持架构事实 |
| Job | 只看 batch 完成 | 3 Job per-item、replay、partial/unknown、无 repair | 防 operations 升格 truth |
| 跨仓 | 统一端到端 | compile/runtime/event 分型，正向未闭合 blocked | 对齐全局规则 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只验 CLI happy path | 简短 | 漏掉 Query/Consumer/Job 和依赖类型 | 拒绝 |
| 要求所有 sibling 仓完整可运行 | 表面完整 | 超出本仓范围且当前合同未闭合 | 拒绝 |
| exact protocol + seam-specific evidence + dependency-aware disposition | 能裁决本仓边界并保留 blocker | 需要多套证据入口 | 采用 |

## 7. 结构化中间产物

### 7.1 依赖类型与验收方式映射

| 关联项目/边界 | 全局关系 | L5-sync 使用方式 | 依赖类型 | 当前验收姿态 |
|---|---|---|---|---|
| `L0-core` | L5 产品编译期基础 | shared typed refs、error、contract | 编译期 | P0 compile contract；不改变 core truth |
| `L0-sdk` | L5-sync 编译期/SDK 入口 | typed owner/source/access/handoff/decision/probe adapter surface | 编译期 + 运行时 adapter | `SYNC-UP-001`；exact API/DTO blocked |
| `L1-identity` | SDK/runtime capability | principal/actor/capability snapshot/access read | 运行期 | `SYNC-UP-001/003`；unknown fail-closed |
| `L1-work` | SDK/runtime capability | Project/member/posture/access read | 运行期 | `SYNC-UP-003`；不拥有 Project truth |
| `L1-artifact` | SDK/runtime capability | Artifact/version/source/ref read | 运行期 | `SYNC-UP-001/002`；不拥有 Artifact truth |
| `L1-workspace` | SDK/runtime capability | Workspace projection/binding/source read | 运行期 | `SYNC-UP-002`；不拥有 projection truth |
| `L1-governance` | SDK/runtime capability | Review handoff/Decision read/probe seam | 运行期 | `SYNC-UP-004/005`；ACK 不等 accepted |
| `L4-archive` | SDK/runtime capability | archived posture/ref read | 运行期 | archive ref only；不 restore/archive |
| `L4-observability` | cross-cutting runtime | safe diagnostic/telemetry sink | 运行期 | body-free/best-effort；不证明业务成功 |
| `L0-bus` / inbound event surface | event collaboration backbone | conditional consumer envelope/receipt only | 事件协作 | 3 Consumer planned/blocked；无 outbound publisher |
| Git/filesystem | local tool boundary | observe/path lock/atomic materialize | 运行时本地 adapter | `SYNC-UP-007/009/010`、`SYNC-LOCAL-*`；positive blocked |

### 7.2 Command 验收矩阵（10）

| Command | 主要契约/门禁 | 测试计划 | 通过条件 | 失败条件 | EV / report path |
|---|---|---|---|---|---|
| `CloneWorkingCopy` | explicit selection、safe path、empty/compatible target、Finalized | `TC-SYNC-CMD-001`、`TC-SYNC-PROTO-001/002/005` | known-safe plan/apply/finalize；local finalize 不升格 Artifact/Baseline | fetch/push/merge/rebase/stash/overwrite；unknown 继续 | `EV-SYNC-FLOW-001`; `reports/runs/<run_id>/evidence-index.md` |
| `MigrateSyncMetadata` | expected generation、new generation、old chain protected | `TC-SYNC-CMD-002` | migration result 和 provenance 同 UoW 可回链 | corrupt/unsupported/commit unknown 被当成功；删除/原地覆写历史 | `EV-SYNC-TRACE-001`; `reports/runs/<run_id>/...` |
| `RebindWorkingCopy` | explicit new selection/reason、new identity/generation | `TC-SYNC-CMD-003` | 新 binding/generation/provenance 关系明确，旧链保护 | 目录/Git/default 猜测；dirty 下 overwrite/materialize | `EV-SYNC-TRACE-001`; `reports/runs/<run_id>/...` |
| `PullWorkingCopy` | full/incremental/no-op、plan/run、apply→finalize | `TC-SYNC-CMD-004`、`TC-SYNC-CONSISTENCY-001` | comparator/gap/dirty/path/access known-safe；Finalized 后才 cursor advance | gap/unknown/dirty 仍 apply；自动 merge/rebase/stash；partial 推 cursor | `EV-SYNC-FLOW-001`; `reports/runs/<run_id>/...` |
| `RecordConflictResolution` | human actor、bounded scope、Recorded→Validated | `TC-SYNC-CMD-005` | 只记录 intent，形成新本地关联 | system actor、intent 直接当 effect、调用 file/cursor/handoff | `EV-SYNC-CONSISTENCY-001`; `reports/runs/<run_id>/...` |
| `ResumeSyncOperation` | exact checkpoint/fingerprint/generation/resolution | `TC-SYNC-CMD-006`、`TC-SYNC-STATE-011` | 仅按 typed next action 恢复 | force retry、绕过 safety gate、接管旧 unknown | `EV-SYNC-CONSISTENCY-001`; `reports/runs/<run_id>/...` |
| `ProbeUnknownOutcome` | prior attempt/checkpoint、new probe identity、formal mapping | `TC-SYNC-CMD-007` | 只 probe prior attempt，保留 StillUnknown | 原 submit/resubmit；log/telemetry 代替 probe | `EV-SYNC-HANDOFF-001`; `reports/runs/<run_id>/...` |
| `CancelSyncOperation` | local continuation cancel、result/provenance retained | `TC-SYNC-CMD-008` | 只结束 local continuation，不宣称 remote rollback | remote cancel、清理/回滚 claim、删除 history | `EV-SYNC-CONSISTENCY-001`; `reports/runs/<run_id>/...` |
| `PushReviewCandidate` | candidate freeze、prepared attempt、pre-call revalidate | `TC-SYNC-CMD-009`、`TC-SYNC-PROTO-003` | transport/probe/Decision 分层；ACK 只停在 transport | Git push、dirty/unknown 仍 submit、ACK→accepted | `EV-SYNC-HANDOFF-001`; `reports/runs/<run_id>/...` |
| `RefreshReviewHandoffStatus` | Decision read/formal probe、body-free snapshot | `TC-SYNC-CMD-010`、`TC-SYNC-PROTO-003/005` | 只读外部状态并保留分层 | 创建/改 Gate/Decision；missing 默认 pending/accepted；blind probe | `EV-SYNC-HANDOFF-001`; `reports/runs/<run_id>/...` |

### 7.3 Query 验收矩阵（13，全部 zero-write）

| Query | 读取主题 | 必须通过 | 必须失败/禁止 | 测试/EV |
|---|---|---|---|---|
| `GetAccessEvaluation` | exact selection/access | hit/missing/not-visible/stale 显式 | 不 owner refresh、不默认 Eligible | `TC-SYNC-QRY-001`; `EV-SYNC-QRY-001` |
| `GetSyncOperation` | local operation/result | completed 仍 local-only，carrier kind exact | 不重跑、不修复、不升格 accepted | `TC-SYNC-QRY-001`; `EV-SYNC-QRY-001` |
| `GetWorkingCopyBinding` | binding/generation | exact ref/visibility | 不 repair/migrate/rebind | `TC-SYNC-QRY-001`; `EV-SYNC-QRY-001` |
| `GetMetadataHealth` | integrity view | valid/degraded/unknown 显式 | 不自动 repair/scan mutation | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `InspectWorkingCopy` | read-only Git/fs observation | 观察结果 bounded、无 persist | 不 lock/fetch/apply/persist | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `GetMaterializationStatus` | plan/run/cursor | pending-finalize/partial/unknown 显式 | 不 finalize/advance cursor | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `GetConflict` | one conflict | source/path/mapping/impact/provenance refs 可见 | 不生成 resolution | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `ListConflicts` | typed page/index | page completeness/visibility 显式 | 不全库猜扫、不写 cursor | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `GetRecoveryStatus` | persisted checkpoint/next action | 只基于事实建议 | 不 probe、不写 recovery | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `GetSyncStatus` | CP1～CP5 layered view | complete/partial/missing/unavailable/freshness 分层 | 不折叠为 clean/ready、不 emit diagnostic 影响结果 | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `GetReviewHandoffStatus` | layered handoff | transport/probe/Decision 分离 | 不在 Query 调 probe/Decision mutation | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `GetProvenance` | provenance page | missing parent/integrity unknown 显式 | 不补造 parent/digest、不删除 | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |
| `GetSyncDiagnosticSummary` | persisted safe diagnostic | body-free/bounded | 不反查 telemetry sink、不写/修/refresh | `TC-SYNC-QRY-004~006`; `EV-SYNC-QRY-001` |

### 7.4 Consumer、Outbound Event 与 Job 验收矩阵

| 入口 | 类型 | 通过条件 | 失败条件 | 计划证据 / 裁决 |
|---|---|---|---|---|
| `ConsumeAccessOrPostureInvalidated` | inbound event consumer | envelope/source/schema/version/digest/idempotency 校验；snapshot/evaluation stale；未消费 plan/candidate invalidated；duplicate receipt 可回放 | raw payload 保存、auto cancel/pull/handoff、invalid input 继续 | `EV-SYNC-OPS-001`; `reports/runs/<run_id>/...`; local P0，event positive blocked |
| `ConsumeMaterialSourceInvalidated` | inbound event consumer | cursor→Unknown；plan/candidate invalidated；unsupported/quarantine 显式 | auto pull/rollback/cursor advance、把 invalidation 当 source success | `EV-SYNC-OPS-001`; `reports/runs/<run_id>/...`; local P0，event positive blocked |
| `ConsumeReviewDecisionChanged` | inbound event consumer | exact attempt 关联 body-free Decision snapshot；保留 owner boundary | 创建/解释/改写 Decision、raw payload 保存 | `EV-SYNC-OPS-001`; `reports/runs/<run_id>/...`; Governance positive blocked |
| Outbound Event | `not_applicable` | 静态检查确认无 outbox/topic/publisher/event state | 新增 publisher/outbox、把 local transition 当平台 event truth | `EV-SYNC-ARCH-001`; dependency-boundary report；一旦出现即不通过 |
| `ScanMetadataIntegrity` | operations job | bounded scope、分类和完整 item result 可 exact replay；只收紧 local posture | repair/migrate/rebind/delete、把 job report 当 readiness | `EV-SYNC-OPS-001`; `reports/runs/<run_id>/...` |
| `ProbePendingHandoffAttempts` | operations job | 每个 ProbeRequired 使用新 probe identity；partial/unknown 保留；结果逐项保存 | submit/resubmit、以 batch completed 代替 resolution | `EV-SYNC-OPS-001`、`EV-SYNC-HANDOFF-001`; `reports/runs/<run_id>/...` |
| `MarkStaleOwnerSnapshots` | operations job | formal freshness rule 后保守收紧 snapshot/evaluation/plan/candidate | owner refresh、non-Fresh→Fresh、用 cache 补新鲜度 | `EV-SYNC-OPS-001`; `reports/runs/<run_id>/...` |

### 7.5 跨接口同步门禁审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 10 Command exact vocabulary | pass | 与 03/05 一致；无旧 API 名称 |
| 13 Query exact vocabulary及 zero-write | pass | 全部列入；真实 spy 证据待未来执行 |
| 3 Consumer exact vocabulary | pass | 保守失效；topic/owner exact contract blocked |
| Outbound Event 数量 | pass | 固定 `0 / not_applicable`，不得创建 outbox/publisher |
| 3 Job exact vocabulary | pass | bounded/per-item/replay/no-repair |
| compile/runtime/event 分类 | pass | 无 sibling compile dependency；正向 runtime/event 保持 blocked/waiting |
| 协议字段/状态/TC/EV/path 回链 | pass (planned) | 实际 artifact/report 尚不存在 |
| 下游完整实现是否被误要求 | pass | 只验 seam，不将 sibling 业务 truth纳入范围 |

## 8. 回填草稿

正式 §7 应声明：接口验收覆盖 10 个 exact Command、13 个 zero-write Query、3 个条件 Inbound Consumer、0 个 Outbound Event（`not_applicable`）和 3 个 Operations Job。每个接口按正式字段、状态、error/disposition、禁止调用、TC/EV 和固定 report root 裁决；跨仓依赖按 compile/runtime/event 分类。下游未就绪时 local contract 可验，owner/tool/physical positive 保持 blocked/waiting，不得由 fake、ACK、HTTP 200、job report 或静态 mapping 冒充成功。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| L0-sdk exact API/DTO/error/version | Command/Query/Consumer/Job positive seam | `SYNC-UP-001` 解锁 |
| Review handoff/Decision/probe contract | `PushReviewCandidate`/`RefreshReviewHandoffStatus`/probe positive | `SYNC-UP-004/005` |
| event source/schema/topic contract | 3 Consumer registration/replay | 事件合同闭合 |
| CLI parser/exit code/Git library | entry-level interface evidence | `SYNC-LOCAL-004/005` |

## 10. 进入下一步条件

- [x] 10 Command、13 Query、3 Consumer、0 Event、3 Job 均使用正式名称并有验收口径。
- [x] 每类接口已区分通过条件、失败条件、依赖类型、TC/EV 和 report root。
- [x] Query zero-write 与 Outbound Event `not_applicable` 已锁定。
- [x] 下游未就绪的 blocked/waiting 裁决已记录。
- [x] 本步停审；进入 Step 8 前读取 03 §9～§12、05 consistency/idempotency/state 切口。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 所有协议的设计门禁已闭合；真实 adapter/event/report 仍不存在，未声称接口通过。
- 下一步阅读：03 状态、UoW、一致性、错误恢复、并发幂等章节和 `TC-SYNC-STATE-001~017`，创建 Step 8。
