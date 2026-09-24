# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8  
> 回填章节：`06-验收标准.md` §8 状态机、事务与一致性验收  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 8 |
| current_module | `state_tx_consistency:21_subjects_uow_recovery` |
| gate_status | `pass_for_step_09` |
| state_denominator | 21 个正式状态主语 + 1 个 projection generation guard |
| actual_results | 0；全部 `not_evaluated` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 9 |

本步把正式 03 的状态、UoW、expected version/generation、幂等、commit-unknown、claim/checkpoint 和 `RecoveryCase` 转成验收门禁。它不选择持久化产品，不运行测试，也不证明 durable/crash parity。

## 2. 输入、统一裁决和状态不等式

| 输入 | 用途 |
|---|---|
| 03 §8～§12、Step 9～13 | 32 flow、21 状态主语、事务顺序、错误恢复、并发/幂等真相源 |
| 05 §6、§9～§13 | 108 TC、UOW/SERVICE/JOB/REPLAY suites、slot/EV/report 资格 |
| Step 5～7 | 功能、架构红线、协议入口与 target-tier 裁决 |

共同规则：状态必须用正式 enum/disposition variant；合法转换需同时证明前态、typed trigger、basis/version、目标态和副作用；非法转换需证明 typed reject/conflict/blocked/unknown 与危险调用为零。每项 evidence 必须来自同一 fixed run 的 raw case、suite report、required checks 和 EV detail；仅状态截图或最终返回值不构成通过。

四组不可合并不等式是所有 tier 的 required gate：

```text
Acquisition Complete != Integrity Verified != MaterialCache Qualified
RunIntent Accepted != owner Boundary/Execution Running
ControlIntent Confirmed != owner Cleaned != local Released/Evicted
Handoff Delivered != Observability audit/evidence/report/verdict/signoff
```

任一 shortcut、字符串/UI label/ACK/PID/port/config 映射跨越上述轴，即对应项失败并进入 VETO 候选。

## 3. SOP 问题回答与历史诊断

| 问题 | 收口答案 |
|---|---|
| 哪些合法转换必须通过？ | 正式 03 Step 10 每个可达 variant 的 factory/transition、terminal 和 reserved 规则；本步按 21 主语逐项列出。 |
| 哪些非法转换必须拒绝？ | terminal reopen、跨轴 shortcut、stale version/generation overwrite、Unknown replay/reclaim/resume、Query mutation、Consumer positive 偷开、marker/build 原地恢复。 |
| 哪些事务必须原子？ | selection/result/idempotency、task transition/result、intent tx A/B、control/cleanup result/recovery、job claim/checkpoint/report/result、projection guarded replace 等 Runner-owned write set。 |
| 幂等/并发如何成立？ | reserve-before-effect；same key+digest replay exact stored surface；different digest conflict；missing result/commit unknown 建 RecoveryCase；expected version/generation 拒绝 stale writer。 |
| 失败如何裁决？ | required TC/assertion 失败或副作用非零即 item failed；durable/store positive 对 target tier required 而证据缺失则 blocked；不得用最终状态“看起来对”掩盖中间违规。 |
| 历史污染是什么？ | `RunnerRunState`、`RunQueueEntry`、`RunControlEntry`、旧 `Trigger*` 和口语 `running/success` 不进入分母；旧技术/DB 状态也不作为证据。 |

## 4. 21 个正式状态主语逐项门禁

共同 report 入口：`reports/runs/<run_id>/evidence-index.md`、`gate-results.md` 与对应 `evidence/<EV>.md`。下表中的 TC/EV 为主判定入口，secondary suite/raw/check 必须一并存在。

| ID / 状态主语 | 必须证明的合法 variant / 转换 | 必须拒绝或冻结 | 主 TC / EV | 裁决影响 |
|---|---|---|---|---|
| `ST-RUN-001` `SelectionState` | `Selected→Checking→Current/Stale/Blocked`；任一活跃态可显式 `Invalidated`；新选择用 successor generation | mutable selector、未检查直达 Current、`Invalidated→*`、cache/history 恢复 | `TC-RUN-CTX-001~006`；`EV-RUN-CTX-001` | T1 required；T2+ authority positive if enabled |
| `ST-RUN-002` `AcquisitionState` | `Absent→Resolving→Transferring↔Paused→Complete/Failed/Cancelled`，terminal 新建 task | disconnect 自动 resume、terminal reopen、Complete→Verified/Qualified | `TC-RUN-MAT-001~007`；`EV-RUN-MAT-002` | T1 required；source positive tiered |
| `ST-RUN-003` `IntegrityState` | `Pending→Verifying→Verified/Invalid/Stale/Blocked`；Verified 仅 same current binding | hash/HTTP success 直达 Verified、旧 result 复活、Invalid/Stale/Blocked 原地重验 | `TC-RUN-MAT-003~005`；`EV-RUN-MAT-002` | T1 required；verifier positive tiered |
| `ST-RUN-004` `MaterialCacheState` | `Quarantined→Qualified` 需 Verified+current authority+physical receipt；Stale/Invalid 安全释放后才 Evicted | 路径存在/rename→Qualified，candidate/releasable/cleanup ACK→Evicted，Evicted reopen | `TC-RUN-MAT-003~005`、`RES-002~006`；`EV-RUN-MAT-002`、`EV-RUN-RES-006` | T1 required |
| `ST-RUN-005` `ProtectionState` | `Protected/Releasable/Blocked/Unknown` 由完整 current guard evaluate；effect 前再次校验 | missing/stale/conflict 当 Releasable；Protected/Blocked/Unknown 下 release/delete | `TC-RUN-RES-001~006`；`EV-RUN-RES-006` | T1 required；失败 VETO 候选 |
| `ST-RUN-006` `RunIntentState` | `Draft→Submitting→Accepted/Rejected/Unknown`；basis drift→Invalidated；Unknown 只经 J03 formal read 收敛 | Accepted→Running；Unknown→Submitting/replay；Invalidated/rejected 原地重开 | `TC-RUN-REQ-001~006`、`REC-001~006`；`EV-RUN-REQ-003`、`EV-RUN-REC-007` | T1 required；Sandbox positive tiered |
| `ST-RUN-007` `ControlIntentState` | `Pending→Accepted→Confirmed` 或 Rejected/Conflict/Unknown；formal same-basis readback 才确认 | ACK→Confirmed；Confirmed→Cleaned；Unknown/Conflict 自动重发 | `TC-RUN-CTL-001~005`、`REC-001~006`；`EV-RUN-CTL-004`、`EV-RUN-REC-007` | T1 required；owner positive tiered |
| `ST-RUN-008` `RecoveryState` | `Frozen→Querying→Reconciled/Conflict/ManualReview→Closed`；close 需正式 resolution | Online/cache/cursor 自动 close；Closed reopen；reconcile 中 owner mutation/旧 effect replay | `TC-RUN-REC-001~006`；`EV-RUN-REC-007` | T1 required；positive readback tiered |
| `ST-RUN-009` `HandoffState` | `Draft→Pending→Accepted/Delivered/Failed/Blocked/Unknown`；receipt/basis 有来源 | Accepted→Delivered 猜测；Delivered→evidence；Unknown resend；terminal reopen | `TC-RUN-PRE-003/005/006`；`EV-RUN-PRE-008` | T1 required；Observability positive tiered |
| `ST-RUN-010` `ConnectivityState` | `Online/Degraded/Offline/Reconnecting/Reconciling/ManualReview` 只表达连接/read posture | Online 清除业务 stale/unknown、触发 replay/refresh/cleanup 或改 owner truth | `TC-RUN-QRY-003/005/006`、`REC-002`；`EV-RUN-QRY-009` | T1 required |
| `ST-RUN-011` `RunnerIdempotencyState` | absent→`Reserved→Completed`；reserved mismatch→Conflict；Completed exact replay | TTL 自动释放、Completed 改写、Reserved matching second execution、missing result rerun | `TC-RUN-IDM-001~006`；`EV-RUN-IDM-011` | T1 required |
| `ST-RUN-012` `RunnerEntryState` | `Received→Validating→Dispatching→Completed`；pre-dispatch validation→Rejected | post-dispatch业务 reject 误写 entry Rejected；多次 dispatch；terminal reopen | `TC-RUN-ENT-001~005`、`CON-002/003`；`EV-RUN-ENT-013` | T1 required |
| `ST-RUN-013` `RunnerHandlerDisposition` | finite `Accepted/Rejected/NotVisible/Degraded/Unknown` 从 typed outcome/view 映射 | HTTP/ACK/PID 猜 Accepted；Conflict/Unknown 压平；NotVisible 泄露 existence | `TC-RUN-ENT-005`、`QRY-002~005`、`BND-005`；`EV-RUN-ENT-013`、`EV-RUN-QRY-009` | T1 required |
| `ST-RUN-014` `RunnerConsumerLoopState` | Registered 可 Delayed/Stopped/Failed；Running 仅 future full-ready contract | 当前 start/Running、negative item→loop Failed、Stopped/Failed 原地 restart | `TC-RUN-CNS-001~006`；`EV-RUN-CNS-014` | T1 negative required；positive blocked |
| `ST-RUN-015` `RunnerConsumerItemDisposition` | 当前 `Rejected/UnsupportedVersion/Blocked` 与 exact stored `Duplicate`；其他 positive variants reserved | payload parse/hash/store/ACK；伪造 Accepted/Delayed/GapDetected/Quarantined；Duplicate 缺完整 receipt | `TC-RUN-CNS-001~006`；`EV-RUN-CNS-014` | T1 negative required；positive tiered/blocked |
| `ST-RUN-016` `RunnerJobEntryState` | `Registered→Running→Completed/Delayed/Failed`；pre-work Rejected；ambiguity=entry Failed + public Unknown/case | 无 claim 进入 Running；Completed 当业务成功；terminal rerun | `TC-RUN-JOB-001~008`；`EV-RUN-JOB-015` | T1 required |
| `ST-RUN-017` `RunnerJobClaimState` | repository absence→Claimed→Released，ambiguity→Unknown；release 在 checkpoint/report safety 后 | expiry 自动 Released/reclaim；local claim 当 Sandbox lease；Unknown takeover | `TC-RUN-JOB-001/003/004`；`EV-RUN-JOB-015` | T1 required；durable parity blocked |
| `ST-RUN-018` `RunnerCheckpointState` | Usable+same basis 可 resume；basis drift→Stale；ambiguity→Unknown；safe terminal→Closed | Stale/Unknown resume、sequence 当 owner cursor、Closed reopen | `TC-RUN-JOB-003/004/008`；`EV-RUN-JOB-015` | T1 required；durable parity blocked |
| `ST-RUN-019` `RunnerJobDisposition` | exact `Completed/Partial/Blocked/Failed/DuplicateReplayed/Rejected/Unknown` mapping | Blocked 压成 Partial/Failed；Unknown 无 case；Duplicate rescan/adapter call | `TC-RUN-JOB-002/005/007/008`、`BND-005`；`EV-RUN-JOB-015` | T1 required |
| `ST-RUN-020` `RunnerAdapterAvailabilityState` | Enabled 可单调到 Degraded/Unavailable/Blocked；DisabledByConfig reserved；恢复用新 marker | configured/connected→Enabled；Blocked 原地清除；marker 改业务 truth | `TC-RUN-CFG-003~006`；`EV-RUN-CFG-016` | T1 required；physical positive blocked |
| `ST-RUN-021` `RunnerRuntimeBuildState` | `NotStarted→ValidatingConfig→Assembling→Ready` 或 Failed；reload 用新 builder | core store不足仍 Ready、半 facade/fallback、Ready 回 Assembling、Ready=owner ready | `TC-RUN-CFG-001~006`；`EV-RUN-CFG-016` | T1 required；implementation evidence blocked |

### 4.1 Projection generation guard（非第 22 个状态机）

| ID | 通过条件 | 失败条件 | TC / EV |
|---|---|---|---|
| `ST-RUN-G01` `RunnerReadSection` | J05 只对既有 projection identity 以 exact subject/section/composition generation/local version guarded replace；Q01～Q12 只读 | missing identity upsert、mtime/wall-clock generation、旧结果覆盖新 generation、Query replace/refresh | `TC-RUN-UOW-005/006`、`QRY-003/005/006`；`EV-RUN-UOW-012`、`EV-RUN-QRY-009` |

## 5. 事务、幂等、并发与恢复门禁

| ID / 主题 | 通过条件与必需副作用 | 失败条件 | TC / EV / report | tier 影响 |
|---|---|---|---|---|
| `TX-RUN-001` Runner-owned UoW | external I/O 永在 UoW 外；每个短 UoW 要么完整提交 object/result/idempotency/marker，要么候选不可见 | external call 持锁/入事务、半提交、owner shared tx | `TC-RUN-UOW-001~004`；`EV-RUN-UOW-012` | T1 required；durable parity target-tier required when baseline enables |
| `TX-RUN-002` intent tx A/B | C07/C08/C09 effect 前 durable intent/reservation；一次 external call；tx B 保存 typed outcome/result/RecoveryCase/complete | effect-before-reserve、timeout resend、ACK success shortcut | `REQ-001~006`、`CTL-001~005`、`UOW-004`；`EV-RUN-REQ-003`、`EV-RUN-CTL-004`、`EV-RUN-UOW-012` | T1 semantic required；T2+ positive real |
| `TX-RUN-003` expected version | 每次 mutable save 用 paired `RunnerVersion`；stale candidate Conflict 且 current record 不变、owner calls=0 | last-write-wins、page cursor/time 代 version | `TC-RUN-UOW-002`、`CTX-006`；`EV-RUN-UOW-012` | T1 required |
| `TX-RUN-004` generation/fence | selection successor 与 invalidation fence 原子；projection exact generation；旧结果不覆盖 | timestamp generation、跨 generation 拼接、invalidated material/run 继续 | `CTX-006`、`UOW-005/006`；`EV-RUN-CTX-001`、`EV-RUN-UOW-012` | T1 required |
| `TX-RUN-005` idempotency/result | reserve-before-effect；same key+digest exact stored replay、calls=0；different digest Conflict；result-before-Completed | 重算 current result、二次 effect、Completed missing result仍 rerun | `TC-RUN-IDM-001~006`；`EV-RUN-IDM-011` | T1 required |
| `TX-RUN-006` commit/external unknown | ambiguous commit/effect 保留 Unknown + exact `RecoveryCase`/issue/basis；只读 readback | Unknown→Rejected/Failed/success，换 key 重发、自动 reclaim/resume | `TC-RUN-UOW-004`、`REC-001~006`；`EV-RUN-UOW-012`、`EV-RUN-REC-007` | T1 required；失败 VETO 候选 |
| `TX-RUN-007` job claim/checkpoint/report | reservation+claim before body；checkpoint same basis/monotonic；report/result/idempotency terminal 原子；Blocked variant保真 | expiry takeover、Unknown checkpoint resume、report压缩、duplicate rescan | `TC-RUN-JOB-001~008`；`EV-RUN-JOB-015` | T1 required；durable parity blocked until store exists |
| `TX-RUN-008` Consumer receipt | current negative receipt/body-free，strict Duplicate 要可信 header + complete stored receipt；positive marker不可达 | payload hash造 key、missing receipt补 Duplicate、推进 owner cursor | `TC-RUN-CNS-001~006`；`EV-RUN-CNS-014` | T1 negative required |
| `TX-RUN-009` cleanup/resource consistency | guard/current basis 前后复核；candidate、cleanup receipt、owner Confirmed、Released、Evicted 分离；unknown 保持 protected | delete/promote based on path/pressure/ACK；guard conflict仍 effect | `TC-RUN-RES-001~006`；`EV-RUN-RES-006` | T1 required；T2+ owner/platform real positive |
| `TX-RUN-010` append/trace/evidence boundary | history/transition unique append；local trace/receipt/report 不改 raw/owner truth且不成为 formal evidence | overwrite history、用 trace/log 重建结果或生成 verdict、outbox residue | `TC-RUN-UOW-003`、`OBS-003~006`、`BND-003/005`；`EV-RUN-UOW-012`、`EV-RUN-OBS-017`、`EV-RUN-BND-018` | T1/T4 required |

## 6. RecoveryCase 强制创建/关联矩阵

| 歧义点 | 必须保存 | 禁止动作 | 后续唯一允许方向 |
|---|---|---|---|
| reservation/terminal commit unknown | operation/key/digest、expected basis、safe issue、已知写集 | 重新 reserve 新 key、重算结果 | 读 reservation/result；不能证明则 case 保持 Frozen/ManualReview |
| Sandbox/control/cleanup/handoff effect unknown | exact intent/control/handoff ref、owner request/basis、trace/issue | resend/reclaim、映射 rejected/success | formal owner read-only query，经 J03 收敛 |
| job claim/checkpoint/report unknown | job run/key/basis、claim/checkpoint refs、last safe stage | 新 worker 自动 takeover、从 offset 猜 resume | read local store/owner safe refs；显式新 job 仅在 closure 后 |
| missing/wrong-kind stored result | completed marker/ref、expected result kind | 从 current state 重建、执行原操作 | local consistency repair contract；原 effect 不重跑 |
| selection/projection generation conflict | expected/current generation/version 与 subject | 覆盖 current、隐式创建 identity | reload current；新显式 selection/refresh basis |

## 7. 逐项停审与跨一致性审计

| 分组 | 分母 | 正式名/variant | legal+illegal | 副作用/证据 | 设计停审 | Actual result |
|---|---:|---:|---:|---:|---:|---|
| business/projection states | 10 | pass | pass | pass | pass | 10×`not_evaluated` |
| application/entry/worker/job states | 9 | pass | pass | pass | pass | 9×`not_evaluated` |
| infra states | 2 | pass | pass | pass | pass | 2×`not_evaluated` |
| projection guard | 1 | pass | pass | pass | pass | `not_evaluated` |
| transaction/consistency items | 10 | pass | pass | pass | pass | 10×`not_evaluated` |

| 跨门禁审计 | 结论 | 处理 |
|---|---|---|
| 21 状态主语有无孤儿/旧名 | pass | 21/21；`RunnerRunState` 等历史名为 0 |
| 四组不等式 | pass | BND/REQ/CTL/PRE/OBS evidence family 共同覆盖 |
| 非法转换是否有 typed outcome + zero side-effect | pass | 每组均列 reject/conflict/blocked/unknown 与禁止调用 |
| UoW 与 external I/O | pass | tx A/effect/tx B 分离；无跨 owner transaction |
| version/generation/idempotency | pass | exact paired token、stored replay、missing-result recovery |
| commit unknown/claim/checkpoint | pass | `RecoveryCase` + no replay/reclaim/resume |
| Query/Consumer/Job phase | pass | no-write/header-first/no-owner-repair 保持 |
| target tier 越级 | pass | T1 semantic 不升级 durable/integration/product/release |
| 当前事实 | pass | 无实现/store/run/evidence；所有 actual result 未评估 |

## 8. 回填草稿、blocker 与下一步门禁

正式 §8 应保留四组不等式、21 主语表、projection guard、10 个 `TX-RUN-*` 门禁、RecoveryCase 矩阵和跨一致性审计。状态详情可引用正式 03 Step 10，但必须在正文保留通过/失败、TC/EV/report 与 tier 影响。

| blocker | 影响 | 当前处理 |
|---|---|---|
| `RUN-DDD-001~003` | 无真实 backend、atomicity、crash/restart parity、locking/corruption evidence | T1 语义合同可设计；实际进入与 durable proof blocked |
| `RUN-UP-001~008` | owner positive state/readback/cleanup/handoff 未闭合 | safe negative/Unknown 可设计；T2+ required positive blocked |
| `RUN-OPS-002` | 无真实 integration/GRC environment | 不生成 integration/release result |

- [x] 21 个正式状态主语和 projection generation guard 均有可裁决门禁。
- [x] 合法/非法/terminal/reserved 转换与副作用断言明确。
- [x] 四组不等式、UoW、version/generation、idempotency、commit unknown、claim/checkpoint、RecoveryCase 全覆盖。
- [x] 每项绑定正式 TC、EV alias 与 fixed report 入口，实际结果保持 `not_evaluated`。
- [x] 跨状态一致性审计无 unresolved 内部冲突。
- [x] 允许进入 Step 9；正式 06 仍禁止写入。
