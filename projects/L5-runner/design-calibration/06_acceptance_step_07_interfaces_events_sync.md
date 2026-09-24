# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7  
> 回填章节：`06-验收标准.md` §7 接口、事件与跨仓同步验收  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 7 |
| current_module | `interfaces:11_command_12_query_4_consumer_0_event_5_job` |
| gate_status | `pass_for_step_08` |
| protocol_denominator | 11 Command + 12 Query + 4 planned Consumer + 0 outbound Event + 5 Operations Job |
| actual_protocol_results | 0；全部 `not_evaluated` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 8 |

本步完成的是接口裁决合同，不是接口实现或集成结果。当前没有实现仓、SDK exact version、transport、owner positive contract、fixed run、artifact/report/evidence；所有名称、TC、slot、EV 和路径只引用正式 03/05 的 future contract。

## 2. 目标、输入与共同裁决规则

### 2.1 目标与权威输入

| 输入 | 本步用途 |
|---|---|
| 全局依赖规则、01 §8 | 区分编译期、运行期、事件协作、引用/adapter 关系，禁止跨仓源码依赖 |
| 03 §6～§8、Step 7～9 | 固定 DTO/helper、logical key/flow、11/12/4/0/5 协议与 owner adapter 边界 |
| 05 §6、§9、§13 | 固定 108 TC、12 suite、18 slot/EV alias、same-run evidence/report 关系 |
| Step 3～6 | target tier、slot manifest、功能门禁和架构红线 |

### 2.2 统一接口门禁

1. Command、Query、Consumer、Job 的 operation/variant/body 必须有限且一致；actor/scope/trace/basis 来自 trusted boundary，不得由 body 或 route 猜测。
2. 11 Command 全部要求 stable idempotency key/digest；12 Query 不 reserve、不写入；4 Consumer 当前只允许 header-first negative/strict stored Duplicate；5 Job 要求 idempotency、claim、checkpoint、report；outbound event 必须为零。
3. `reports/runs/<run_id>/evidence-index.md` 与 `reports/runs/<run_id>/gate-results.md` 是共同报告入口；每个 EV 还须有 `evidence/<evidence_id>.md` 及 same-run producer suite/raw/check pair。
4. T1 只裁决 Runner-owned schema/dispatch/negative/zero-side-effect；不能用 fake 推出真实 owner integration。T2～T4 baseline 若把某 slot 标为 required，则 formal public contract、真实 positive/negative/Unavailable/Unknown/recovery evidence 缺一即 `blocked/failed`，不能总体通过。
5. 未启用 slot 的 positive path 不从当前 P0 语义分母删除：其 safe `Blocked/Unsupported/Disabled` 必须证明；不贡献 integration pass，也不支持产品/发布结论。

## 3. SOP 问题回答与问题诊断

| 问题 | 收口答案 |
|---|---|
| 每个 P0 Command/Query 如何验收？ | 逐项回指正式 logical operation、flow、目标对象/read source、TC family、EV alias；Command 验 trusted metadata/idempotency/result，Query 验 surface/source/freshness 与 zero-write。 |
| Event 如何验可消费/重放？ | 当前没有 outbound event；4 inbound Consumer 仅验 header/readiness、unsupported/blocked/duplicate 与 no-payload/no-ACK。positive/replay 必须等正式 event seam 后重开 03/05/06。 |
| Job 如何验幂等和恢复？ | 每个 Job 都必须 reserve-before-work、claim/current-basis、bounded checkpoint、typed report、stored duplicate replay；Unknown 建 RecoveryCase 且 no reclaim/rerun。 |
| 跨仓成功是什么？ | 只由 target-tier baseline 启用的 public slot 的真实合同与 positive/negative/Unavailable/Unknown/recovery evidence 证明；ACK/HTTP 200/本地 log/fake 均不足。 |
| 下游未就绪怎么裁决？ | T1 验安全 blocked/negative 可成立；T2+ required slot 为 `blocked`，不得压成 pass/not-applicable，也不能用“有条件通过”绕过 required P0。 |
| 旧文档问题是什么？ | 旧 `CreateRun/Trigger*`、泛 API/DB evidence、直接 source dispatch 与下游完整实现假设全部淘汰；只保留正式协议清单。 |

## 4. 跨仓依赖类型与验收方式

| 依赖类型 | 项目/方向 | 正式协作方式 | T1 证据 | T2+ positive 证据 | 禁止 |
|---|---|---|---|---|---|
| 编译期 | `L0-core`、`L0-sdk`（exact surface 成立后） | shared contract 与 official client package | typed contract/finite union、dependency-boundary scan | exact package/client/version + compile/contract results | sibling source、shadow DTO、私有 backend/package |
| 运行期 | Artifact/Governance/Work/Workspace/Runtime/Sandbox/Observability/Archive/platform | SDK/API/public semantic adapter，query 或 intent request | semantic fake、Unavailable/Unsupported/Unknown 与 zero unsafe effect | selected owner/environment 的真实 request/read/result/recovery pair | direct DB/shared tx/internal HTTP/private implementation |
| 事件协作 | L0-bus 的正式 SDK/event seam → 4 planned Consumer | trusted framing/header、future typed envelope；当前 negative only | header-first、no payload/hash/store/ACK、strict Duplicate | 正式 schema/source/order/dedup/replay + positive apply（启用后） | internal topic/group、generic JSON、owner cursor 推断 |
| outbound event | Runner → consumers | 当前不适用 | publisher/outbox/topic/event count=0 | 新增前必须回写 00～06；本 baseline 仍为 0 | local trace/receipt/job report 升级为 event |
| 引用/安全 view | L5 consumer ↔ Runner | bounded query/ref；不得反写 | visibility/freshness/source 与 no-write | approved consumer contract（若 baseline 启用） | 直接读 local store 或借 ref 改 owner truth |

## 5. Command 验收项（11/11）

共同 evidence detail 包含对应 family EV，并关联 `EV-RUN-CON-010`、`EV-RUN-ENT-013`、`EV-RUN-IDM-011`、`EV-RUN-UOW-012` 的适用项；下表列主判定证据。

| ID / 正式协议 / flow | 通过条件 | 失败条件 | TC / runtime EV | tier 与裁决影响 |
|---|---|---|---|---|
| `IF-RUN-C01` `SelectRelease` / `FLOW-C01` | trusted context；exact Release/version/scope；successor generation；authority结果保真；same digest duplicate 零二次 effect | mutable selector、body 自报 actor/scope、缺 metadata、cache/role 补 authority、stale overwrite | `TC-RUN-CTX-001~006`、`CON-001~006`、`ENT-001~005`、`IDM-001~006`；`EV-RUN-CTX-001` | T1 required；T2+ authority positive enabled 时必须真实 |
| `IF-RUN-C02` `InvalidateSelection` / `FLOW-C02` | expected generation/version exact；先提交 invalidation fence；旧 generation 后续副作用冻结 | last-write-wins、原地恢复 Invalidated、修改 Release/Governance truth | `TC-RUN-CTX-006`、`UOW-001~006`、`IDM-001~006`；`EV-RUN-CTX-001`、`EV-RUN-UOW-012` | T1 required；失败阻断 |
| `IF-RUN-C03` `RequestMaterialAcquisition` / `FLOW-C03` | Current selection/authority；仅创建 bounded task；source readiness 不足 typed Blocked 且 call=0 | 调用时未校验 generation/authority、创建下载即宣告 verified/qualified | `TC-RUN-MAT-001~007`、`IDM-001~006`；`EV-RUN-MAT-002` | T1 semantic required；T2+ Artifact slot positive required |
| `IF-RUN-C04` `PauseAcquisition` / `FLOW-C04` | discriminator/binding/version exact；只改变 local task；terminal 拒绝 | 把 local pause 当 transport 确认，或 terminal reopen | `TC-RUN-MAT-006/007`、`IDM-001~006`；`EV-RUN-MAT-002` | T1 required |
| `IF-RUN-C05` `ResumeAcquisition` / `FLOW-C05` | Paused + current authority/source/generation 才可恢复；ambiguous 保持 recovery | reconnect/click/cache hit 自动 resume；旧 basis 继续 transfer | `TC-RUN-MAT-005~007`、`IDM-001~006`；`EV-RUN-MAT-002` | T1 required；T2+ source positive required if enabled |
| `IF-RUN-C06` `CancelAcquisition` / `FLOW-C06` | local cancellation intent 与 bytes/cache cleanup 分离；unknown 不伪造 Cancelled | cancel receipt 触发删除/eviction，或覆盖 ambiguous transfer | `TC-RUN-MAT-006/007`、`RES-002~006`；`EV-RUN-MAT-002`、`EV-RUN-RES-006` | T1 required |
| `IF-RUN-C07` `RequestRun` / `FLOW-C07` | exact qualified binding、resource/guard、durable intent；Sandbox receipt 仅 Accepted/Rejected/Unknown；duplicate no resend | unqualified material dispatch、ACK/PID/port→Running、timeout 自动重发 | `TC-RUN-REQ-001~006`、`IDM-001~006`、`UOW-004`；`EV-RUN-REQ-003`、`EV-RUN-IDM-011` | T1 semantic required；T2+ Sandbox slot required 时 positive 必须真实 |
| `IF-RUN-C08` `RequestRunControl` / `FLOW-C08` | control kind/basis/idempotency exact；Accepted/Confirmed/Unknown 与 owner execution 分离 | ACK→Confirmed/Running、Unknown 重发、local intent 修 owner truth | `TC-RUN-CTL-001~005`、`IDM-001~006`；`EV-RUN-CTL-004` | T1 required；T2+ Sandbox/Runtime positive required if enabled |
| `IF-RUN-C09` `RequestCleanup` / `FLOW-C09` | current guard/lease/capture/handoff/retention/orphan basis；cleanup receipt、Confirmed、Released/Evicted 分离 | guard missing/stale 仍调用、ACK→Cleaned、candidate→Evicted | `TC-RUN-RES-001~006`、`CTL-001~005`、`UOW-004`；`EV-RUN-RES-006` | T1 required；T2+ Sandbox/platform positive required if enabled |
| `IF-RUN-C10` `OpenManualReview` / `FLOW-C10` | exact RecoveryCase/state/reason；只更新 local recovery posture；stored duplicate replay | 创建虚假 owner result、自动 close/replay，或 Query 隐式打开 | `TC-RUN-REC-001~006`、`IDM-001~006`；`EV-RUN-REC-007` | T1 required |
| `IF-RUN-C11` `RequestDiagnosticHandoff` / `FLOW-C11` | bounded/redacted diagnosis、target visibility、local handoff posture；receipt≠evidence | raw body/secret 交接、ACK→evidence/verdict、Unknown 自动 resend | `TC-RUN-PRE-001~006`、`OBS-001~006`；`EV-RUN-PRE-008`、`EV-RUN-OBS-017` | T1 required；T2+ Observability slot positive required if enabled |

## 6. Query 验收项（12/12）

全部 Query 使用 `RunnerViewSurface`，保留 subject/projection generation/visibility/freshness/degraded/source attribution；共同要求 reservation/UoW/save/refresh/reconcile/probe/cleanup/job-dispatch 为零。共同主证据为 `TC-RUN-QRY-001~006`、`ESLOT-RUN-009`、`EV-RUN-QRY-009`。

| ID / Query / flow | 正式 read source 与通过条件 | 失败条件 | secondary evidence / tier |
|---|---|---|---|
| `IF-RUN-Q01` `ResolveRunnerContext` / `FLOW-Q01` | committed context/local safe ref；not-visible body-free | fallback existence leak、refresh context 或写 generation | `CTX/CON/ENT`；T1 required |
| `IF-RUN-Q02` `ListSelectableReleases` / `FLOW-Q02` | authority safe bounded page；cursor 只分页，source/visibility/freshness 保留 | `latest`/mtime 排序成 authority、空结果掩盖 restricted、写 selection | `CTX/CON`；T1 negative，T2+ Artifact/Governance positive if enabled |
| `IF-RUN-Q03` `GetSelectionPosture` / `FLOW-Q03` | selection + authority projection 两轴；stale/blocked 保真 | cache/history 补 Current，Query requalify/invalidate | `CTX/OWN`；T1 required |
| `IF-RUN-Q04` `GetMaterialPreparation` / `FLOW-Q04` | task/cache/integrity 分轴，Complete≠Verified≠Qualified | 发现文件路径即 promote，Query 下载/验证 | `MAT`；T1 required |
| `IF-RUN-Q05` `GetCacheProtection` / `FLOW-Q05` | cache/guard、protected/unknown/releasable 保真 | disk pressure 或 candidate 导致 release/delete | `RES/MAT`；T1 required |
| `IF-RUN-Q06` `GetRunLifecycle` / `FLOW-Q06` | local run/control intent 与 attributed owner projection 并列 | Accepted/PID/port→Running，stale owner view 当 current | `OWN/CTL/BND`；T1 required，T2+ Runtime positive if enabled |
| `IF-RUN-Q07` `GetResourceCleanupView` / `FLOW-Q07` | observation/guard/recovery 分离，conflict/unknown 可见 | probe→allocation/lease/cleaned，查询触发 cleanup | `RES/REC`；T1 required |
| `IF-RUN-Q08` `GetRecoveryCase` / `FLOW-Q08` | exact case/expected basis/current state 只读 | reconnect 自动 reconcile/close、missing case upsert | `REC`；T1 required |
| `IF-RUN-Q09` `GetOutputPreview` / `FLOW-Q09` | committed bounded redacted preview；truncation/source/freshness 可见 | raw stdout/body fallback、生成 evidence | `PRE/OBS`；T1 required |
| `IF-RUN-Q10` `GetFailureDiagnosis` / `FLOW-Q10` | safe diagnosis/issue/next-step refs；certainty/visibility 保真 | stack/path/secret 泄露、读取触发 refresh/handoff | `PRE/OBS`；T1 required |
| `IF-RUN-Q11` `GetHandoffPosture` / `FLOW-Q11` | local intent/receipt 与 source attribution；非 evidence | receipt→audit/evidence/verdict，Query resend | `PRE/OBS`；T1 required |
| `IF-RUN-Q12` `GetRunnerReadModel` / `FLOW-Q12` | 只组合 committed sections；每 section 独立 freshness/degraded；generation 不混写 | cache miss upsert、Online 清业务 stale、跨 generation 拼接 | `QRY/UOW-005/006/BND`；T1 required |

## 7. Planned Consumer、outbound Event 与同步验收

| ID / 正式 surface / flow | 当前通过条件 | 当前失败条件 | TC / EV / report | future positive 启用条件与裁决 |
|---|---|---|---|---|
| `IF-RUN-E01` `ConsumeReleaseAuthorityChange` / `FLOW-E01` | header/source/schema/readiness 先验；只允许 Blocked/Unsupported/Rejected/Quarantined 或 exact stored Duplicate；no payload/hash/store/ACK | generic JSON、默认 schema、写 selection authority、自动下载/run、推进 owner cursor | `TC-RUN-CNS-001~006`；`EV-RUN-CNS-014`；CONSUMER suite + evidence detail | Artifact/Governance/SDK 正式 schema/source/order/dedup/visibility 闭合且 baseline enabled；required 未闭合→blocked |
| `IF-RUN-E02` `ConsumeSandboxLifecycleChange` / `FLOW-E02` | 同上；不得把 request/cleanup ACK 映射 Running/Cleaned | 私有 Sandbox/Docker/gVisor/Firecracker payload、ACK success、lease truth write | 同上 | Sandbox/SDK formal event seam + recovery/replay；required 未闭合→blocked |
| `IF-RUN-E03` `ConsumeRuntimeStatusChange` / `FLOW-E03` | 同上；PID/port/stdout 不能成为 status event truth | terminal/status 猜测、RunIntent success writeback、owner cursor推进 | 同上 | Runtime/SDK formal event seam + exact run/result/order；required 未闭合→blocked |
| `IF-RUN-E04` `ConsumeHandoffChange` / `FLOW-E04` | 同上；receipt 仅更新 future safe projection shape | payload携 evidence/report/verdict正文、Unknown 自动 resend | 同上 | Observability/SDK formal seam；required 未闭合→blocked |
| `IF-RUN-E00` outbound event = 0 | manifest/import/call graph/runtime spy 中 event/outbox/publisher/topic 数为 0；local trace/report 不升级 | 任一 outbound family/envelope/topic/outbox 或隐式 publish | `TC-RUN-BND-003/006`；`EV-RUN-BND-018`；`dependency-boundary.md`、`gate-results.md` | 本 baseline 所有 tier required；非零即失败/VETO 候选；新增必须回写 00～06 |

Consumer 当前的设计停审通过只证明“安全负向 surface 可判定”，不证明事件可消费、可重放或 owner projection 可正向同步。

## 8. Operations Job 验收项（5/5）

共同主证据为 `TC-RUN-JOB-001~008`、`ESLOT-RUN-015`、`EV-RUN-JOB-015`，并关联 JOB/UOW/REPLAY suite。Job entry `Completed` 或 report `Blocked` 只描述本地 job 收束，不能升级为业务/owner success。

| ID / Job / flow | 通过条件 | 失败条件 | secondary EV / tier |
|---|---|---|---|
| `IF-RUN-J01` `AcquireAndVerifyMaterialJob` / `FLOW-J01` | exact task/binding/authority；claim/checkpoint current；transfer/verify/qualify 分轴；Blocked 保真；duplicate no work | report Completed→Qualified、stale resume、redownload/reverify duplicate、raw locator/body | `EV-RUN-MAT-002`、`EV-RUN-UOW-012`；T1 semantic，T2+ source/verifier positive if enabled |
| `IF-RUN-J02` `EvaluateCacheEvictionJob` / `FLOW-J02` | bounded candidate/guard evaluation only；no destructive release/delete；unknown protected | candidate/capacity observation→Evicted、job cleanup owner truth | `EV-RUN-RES-006`；T1 required |
| `IF-RUN-J03` `ReconcileRunnerStateJob` / `FLOW-J03` | formal read-only owner calls；local projection/case update；Unknown no resend/reclaim/close | owner mutation/cursor advance、Online推导完成、missing result补 success | `EV-RUN-REC-007`、`EV-RUN-OWN-005`；T1 semantic，T2+ owner read positive if enabled |
| `IF-RUN-J04` `RefreshSafeDiagnosisJob` / `FLOW-J04` | bounded source + mandatory redaction；只写 local preview/diagnosis；blocked 无 raw fallback | local logs/container stdout/host file fallback、report→evidence、自动 handoff | `EV-RUN-PRE-008`、`EV-RUN-OBS-017`；T1 required，T2+ diagnostic positive if enabled |
| `IF-RUN-J05` `RefreshVisibleSourcesJob` / `FLOW-J05` | existing projection identity、exact generation/version；per-source partial/blocked；old generation no overwrite | missing identity upsert、一个 source success 清全部 stale、Archive 失败影响 core success | `EV-RUN-QRY-009`、`EV-RUN-UOW-012`；T1 required，T2+ enabled source positive required |

## 9. 接口逐项停审与跨同步审计

### 9.1 分母停审

| 类别 | 正式数 | 逐项覆盖 | 协议名/flow | TC/EV/report | 下游 blocked 规则 | Actual result |
|---|---:|---:|---:|---:|---:|---|
| Command | 11 | 11/11 pass | pass | pass | pass | 11×`not_evaluated` |
| Query | 12 | 12/12 pass | pass | pass | pass | 12×`not_evaluated` |
| planned Consumer | 4 | 4/4 pass | pass | pass | pass | 4×`not_evaluated` |
| outbound Event | 0 | no-residue item pass | pass | pass | n/a | `not_evaluated` |
| Operations Job | 5 | 5/5 pass | pass | pass | pass | 5×`not_evaluated` |

### 9.2 跨接口同步门禁审计

| 审计项 | 结论 | 缺口/处理 |
|---|---|---|
| 协议分母/命名漂移 | pass | 11/12/4/0/5 与正式 03 一致；旧 CreateRun/Trigger* 为 0 |
| 依赖类型误判 | pass | compile/runtime/event/reference 分开；不要求下游源码或完整实现 |
| route/topic/job surface | pass | logical operation/flow/job 固定；transport/topic 未获 authority 不伪造 |
| 下游未就绪裁决 | pass | T1 safe blocked 可判；T2+ required positive 不齐即 blocked，不能条件放行 |
| Query write / Consumer parse / Job repair / outbound event | pass | 分别由 QRY/CNS/JOB/BND evidence family 阻断 |
| evidence 路径断裂 | pass | same-run detail/index/suite/raw/check；slot/alias 不作实例 |
| fake 冒充真实 integration | pass | controlled fake 只证明 semantic mapping；T2+ 需真实 environment/authority |
| 当前事实诚实 | pass | 32 个入口/absence item 均无实际 result，无 protocol readiness 声明 |

## 10. 回填草稿、待确认与下一步门禁

正式 §7 应保留共同规则、依赖类型表、11 Command/12 Query/4 Consumer/0 Event/5 Job 门禁、target-tier blocked 规则和跨同步审计。正文不得写具体 HTTP/RPC/topic/SDK 方法、不得要求 sibling 源码，也不得把设计停审写成接口可用。

| 待确认 / blocker | 影响 | 当前处理 |
|---|---|---|
| `RUN-UP-008` SDK exact package/client/error/redaction/trace | compile/runtime positive | T1 contract only；T2+ blocked |
| `RUN-UP-001~007` owner/platform formal seams | runtime/event positive | slot 未启用只验安全 blocked；required 未闭合则不能通过 |
| `RUN-DDD-001~003` implementation/store/runtime | 无法执行 protocol/manifest/call graph | 不创建、不伪造 |
| event transport/topic/schema | Consumer positive/replay | 当前 header-first negative only；outbound=0 |

- [x] 11 Command、12 Query、4 Consumer、0 outbound Event、5 Job 全部逐项闭合。
- [x] compile/runtime/event/reference 依赖与证据方式分开。
- [x] 每项有正式协议/flow、TC、EV/report、通过/失败和 tier 裁决。
- [x] 每类完成停审，跨接口审计无 unresolved 内部冲突。
- [x] 实际结果全部 `not_evaluated`，上游 positive blocker 未被掩盖。
- [x] 允许进入 Step 8；正式 06 仍禁止写入。
