# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7\
> 正式回填：`06-验收标准.md` §7\
> 日期：2026-09-13\
> 状态：`completed / thirty_entry_ac_closed_formal_seams_required_blocked / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 7：定义接口、事件与跨仓同步验收 |
| 目标 | 为 3C/5Q/5E/17J 的 30 logical entries / 32 method surfaces、依赖分类、formal seams 与 outbound absence 建立逐入口 P0 裁决 |
| gate_status | `completed / thirty_entry_ac_closed_formal_seams_required_blocked` |
| gate_reason | 30/30 logical entry 均有稳定 AC、正式 logical surface、exact TC、EV/report、通过/失败和裁决影响；E04/J12 双方法面独立断言；required formal seam 保持 blocked |
| next_allowed_action | 按连续授权创建并完成 Step 8 |
| source_files | 正式 01 §8/10；03 §6～8/11～13；04 §6～12；05 §6/8～10/13；Step 5～6；03 Step 08/09；05 Step 6 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 7A | 30 logical entry AC registry | done | 3+5+5+17 = 30，不聚合漏项 |
| 7B | 32 method surface 审计 | done | E04/J12 placement/lifecycle 双 surface 互斥 |
| 7C | dependency / formal seam 映射 | done | compile/runtime/event/ref/adapter/fake 分开 |
| 7D | 下游未就绪与 outbound absence | done | required P0 blocked，不造 topic/publisher |
| 7E | 逐项停审与跨接口审计 | done | 无名称、phase、证据或范围冲突 |

## 2. 协议与 transport 边界

正式 03 的 C/Q/E/J 名称是 transport-neutral logical contracts。未来实际验收必须固定实现 binding manifest 中的 route/subscription/job binding identity，但本文不发明 HTTP/RPC path、topic、provider SDK 或 ACK deadline。E01～E05 是 inbound Consumer，不等于 Archive 拥有 Bus delivery truth；`ArchiveJobPostureChanged`、`ArchiveBundleSealed`、`RestoreHandoffPostureChanged` 仍只是 blocked outbound candidates，不是正式事件分母。

每个逐入口 AC 的统一证据入口是 `reports/runs/<run_id>/evidence-index.md` 及 `reports/runs/<run_id>/evidence/<EV-ID>.md`，后者必须回指 same-run raw。表中列出的 suite report 是额外的固定可读入口。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 Command / Query 如何验收？ | C01～C03 与 Q01～Q05 各自独立 AC；Command 验 metadata/canonical input/UoW/stored result/duplicate/conflict/unknown，Query 验 current disclosure、snapshot/cursor/safe surface 和绝对 no-write。 |
| 每个 P0 Event 如何证明可消费/重放？ | E01～E05 各自以正式 envelope、unsupported-before-parse、correlation、stored receipt、same/same replay 与 local commit 后 ACK 边界裁决；真实 producer/Bus positive 仍需 formal run。 |
| 每个 P0 Job 如何证明幂等和恢复？ | J01～J17 各自验证 fixed target/basis、claim/fence、checkpoint/report、same/same replay、same/different conflict、commit unknown、partial resume；外部 effect 还须 intent-before-effect 与 exact probe。 |
| 跨仓同步成功标准是什么？ | 只证明具名 contract/version/config/target 下 Archive adapter 的输入分类、local durable result、外部 typed finality 与 handoff；不证明或修改相邻仓内部 truth。 |
| 下游未就绪如何验接缝？ | required formal target 缺失时相应 AC=`blocked` 且完整验收不能通过；local fake/negative 可证明映射与 fail-closed，但不能把 AC 或 formal seam 判 passed。 |
| 依赖如何分类？ | 仅经核验 `L0-core` shared contract 是 compile candidate；Bus 为 event/runtime adapter；L1/workspace/artifact/observability 为 runtime/ref/adapter/event；providers/receivers 为 runtime/ref/adapter；SDK/product 为 downstream runtime/ref/adapter；fake 仅 test-only。 |
| 每类依赖用什么证据？ | compile 用 actual dependency graph/contract compile；runtime/adapter 用 target manifest+conformance vectors+formal suite；event 用 envelope/receipt/replay；ref 用 provenance/classification；fake 用 isolation scan，不证明 formal finality。 |
| 能否回指正式字段、状态和证据？ | 可以；见 §7.1～7.4，每项引用正式 logical protocol、TC、EV 和 suite path，状态/UoW细节由 Step 8 再加严。 |
| route/topic/job 是否固定？ | logical protocol/job 名固定；实际 transport binding identity 必须在 future baseline 固定。无正式 outbound topic，禁止编造。 |
| 下游未就绪时是通过/失败/有条件通过？ | 当前为 prerequisite blocked、不是 verdict；实际完整验收时 required P0 blocked 不允许“有条件通过”。unexpected formal failure 则 AC failed。 |
| 是否逐项停审？ | 是；30/30 entry 加 formal seam/dependency/outbound 横切项均已设计停审。 |
| 是否有依赖误判、下游越界或证据缺失？ | 未发现设计层 unresolved 冲突；`AR-ARCH-001` 与 formal seam blocker 保持开放，不由本文解决。 |

## 4. Historical material 诊断与改动前后对比

| 旧口径 | 问题 | 当前处置 |
|---|---|---|
| 泛化 REST API / async job | 无法定位 30/32 正式 surface | 每一 logical entry 独立 AC |
| 下游响应/ACK 即同步成功 | 混淆 local commit、Bus delivery、storage/receiver commit | receipt、intent、typed outcome 与 finality 分开 |
| 恢复接口直接导入上游 | 赋予 Archive 跨域写权 | 仅 owner-specific material + formal receiver handoff |
| outbound 状态通知 | 无 payload/topic/UoW/publisher 合同 | 维持候选 blocked + absence AC |
| SDK/provider 作为 package | 依赖方向错误 | runtime/ref/adapter；actual graph 另验 |
| fake 接通即集成通过 | 无 authority/finality | 只证明 local mapping/negative |

## 5. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 入口 AC 粒度 | 30 个 logical entry 各一项 | 按 C/Q/E/J 四族一项 | 便于落码、缺陷与证据精确定位 |
| E04/J12 | logical entry 各一，但显式验两个互斥 method surfaces | 算成 4 个 logical entries 或只测一支 | 保持 30/32 正式分母 |
| transport names | 固定 logical name + future binding identity | 私造 route/topic | 当前无正式 transport authority |
| external not-ready | required P0 blocked | fake passed 或风险接受 | 用户价值依赖真实 authority/finality |
| outbound | 验候选全面不存在 | 以候选名当已发布事件 | `AR-HLD-Q-001` 未关闭 |

## 6. 跨仓依赖类型与验收方式

| 关联对象 | 类型 | 协作方式 | P0 验收证据 | 不得声称 |
|---|---|---|---|---|
| `L0-core` | compile candidate | shared ref/error/version contract | actual package/symbol/version/无环 graph + contract tests | 未核验即依赖可用 |
| `L0-bus` / producers | event + runtime adapter | inbound envelope/delivery，Archive receipt | producer/schema/trust binding、replay/unsupported、local commit/ACK | Bus delivery truth 或事件本身等于 authority |
| identity/conversation/work/process | runtime + ref + adapter + event | owner snapshot/export/ref 与 restore receiver | per-target contract/version/fence/coverage/error + formal vectors | 源码依赖、共享 DB、统一 version |
| `L1-governance` | runtime + ref + event + adapter | decision/hold/delete/risk current lookup/change hint | decision identity/applicability/current recheck + negative/formal run | Archive 可裁决政策/授权 |
| `L1-artifact` | runtime + ref + adapter | approved material/ref/lineage 与 restore handoff | material/ref/provenance/closure + formal vectors | ref set 等正文/血缘 truth |
| `L1-workspace` | runtime + ref + adapter | Auxiliary projection only | explicit class/revision/generation/coverage | canonical source 或 fallback |
| `L4-observability` | runtime + ref + adapter/event | approved redacted audit/evidence material | coverage/redaction/handoff formal vector | backend truth/完整链 |
| storage/integrity/KMS/compression | runtime + ref + adapter | typed capability/effect/probe | binding/config identity、input correlation、typed finality | provider ACK/ref/config = success |
| owner restore receivers | runtime + ref + adapter/event | material dispatch/probe/outcome/compensation | exact owner/receiver/schema/effect/outcome formal vectors | Archive 或 ACK 可判 owner restored |
| `L0-sdk`/Console/Sync | downstream runtime + ref + adapter | consume safe Archive public boundary | consumer compatibility only after direction closure | Archive→SDK compile 或 SDK 获跨域写权 |
| fake/test support | fake | deterministic local double | profile/marker/isolation/parity negative evidence | formal authority/commit/readiness |

`AR-ARCH-001` 的全局矩阵冲突仍由标准 owner 与 `L0-sdk` owning project 关闭；本仓继续禁止服务端反向依赖 client。

## 7. 结构化中间产物

### 7.1 Command 与 Query 逐入口 AC

| 验收项 ID | 正式 logical surface | 通过条件 | 失败条件 | exact TC / EV | suite report / 裁决 |
|---|---|---|---|---|---|
| `AC-AR-CMD-001` | C01 `RequestArchive` | checked scope/authority；request+job+stage+result/reservation 原子；全 disposition 与 replay 保真 | 缺 basis 仍 Accepted；半提交；Conflict 改旧记录；Unknown 重跑；推导 archived | COMMAND-001～002；COMMAND/UOW/IDEMP | `archive-service-flow.md`,`archive-consistency-replay.md`；formal authority blocked 时不得通过 |
| `AC-AR-CMD-002` | C02 `RequestRestore` | exact Bundle revision/owner set/authority；restore request+job+stage 原子；不 resolve receiver/产材料/写 owner | stale/missing/integrity/unsupported 仍 Accepted；空/重复 owner；admission dispatch；推导 restored | COMMAND-003～004；COMMAND/RESTORE | `archive-service-flow.md`,`archive-authority-restore-negative.md`；formal authority blocked 时不得通过 |
| `AC-AR-CMD-003` | C03 `RequestLifecycleExecution` | exact decision/action/current check；只提交 execution/initial intent/result；storage call=0 | decision missing/stale/conflict/hold 仍 accepted/dispatch；Archive 生成 retention/delete/risk decision | COMMAND-005～006；COMMAND/EFFECT | `archive-service-flow.md`,`archive-formal-seam.md`；governance formal blocked 时不得通过 |
| `AC-AR-QUERY-001` | Q01 `GetArchiveJobStatus` | current-visible committed snapshot；safe stage/components/page surface；zero write/effect | 混 snapshot、推进 job/last-read、枚举 hidden、推导 project state | QUERY-001；QUERY/SECURITY | `archive-service-flow.md`,`archive-security-observe.md`；失败不得通过 |
| `AC-AR-QUERY-002` | Q02 `GetArchiveBundle` | exact revision 下 manifest/closure/placement/lifecycle safe view 与 partial/stale/continuation | query assembly/repair/retrieve，跨 revision 拼接，private cursor 泄漏 | QUERY-002；QUERY/CONTRACT | `archive-service-flow.md`；continuation binding 未闭合时相应 lane blocked |
| `AC-AR-QUERY-003` | Q03 `VerifyArchiveBundle` | 只读 matching committed assessments/findings，Unknown/Unsupported/IntegrityFailed 保真 | 调 integrity/compatibility、创建 assessment、从 ref/fake 造 Verified | QUERY-003；QUERY/STATE | `archive-service-flow.md`；失败不得通过 |
| `AC-AR-QUERY-004` | Q04 `GetRestorePlan` | 同 revision 的 plan/items/handoffs/outcomes/compensations；visibility filtering 不重算 plan posture | 准备 material/dispatch/compensate；可见子集变 global state；撤权 body 复活 | QUERY-004；QUERY/RESTORE | `archive-service-flow.md`,`archive-authority-restore-negative.md`；失败不得通过 |
| `AC-AR-QUERY-005` | Q05 `GetRestoreHandoffStatus` | exact item/owner history、CommitUnknown/ReconcileRequired 保真；zero probe/retry | query probe/retry/compensate；一 item 推导 all-owner/project restored | QUERY-005；QUERY/RESTORE | `archive-service-flow.md`；失败不得通过 |

所有 Query 必须在 telemetry enabled/disabled 两组断言 `begin_uow/reserve/save/append/complete/claim/external_port = 0`；否则相关 AC 失败并进入红线/VETO 审查。

### 7.2 Inbound Consumer 逐入口 AC

| 验收项 ID | 正式 logical surface | 通过条件 | 失败条件 | exact TC / EV | suite report / 裁决 |
|---|---|---|---|---|---|
| `AC-AR-EVENT-001` | E01 `ConsumeArchiveTrigger` | trusted supported envelope；只形成 local observation/admission context+stored receipt；duplicate 完整重放 | unsupported 后解析 payload；arrival 绕 authority/改 project；ACK 在 local commit 前 | CONSUMER-001；CONSUMER/CONTRACT | `archive-entry-worker.md`,`archive-formal-seam.md`；producer/Bus positive blocked 时不得通过 |
| `AC-AR-EVENT-002` | E02 `ConsumeSourceExportFeedback` | exact attempt/fence/material/coverage 才 settle；partial/stale/missing/conflict/late 保真 | wrong correlation 覆盖 capture；unknown 当 empty；receipt 重构或重复写 | CONSUMER-002；CONSUMER/AUTHORITY | `archive-entry-worker.md`,`archive-formal-seam.md`；owner positive blocked 时不得通过 |
| `AC-AR-EVENT-003` | E03 `ConsumeGovernanceDecisionChange` | event 仅 change hint/basis；保存 re-evaluation/blocked posture；dispatch 前 current recheck | event 当 current decision；直接 lifecycle/compensation dispatch 或改 owner truth | CONSUMER-003；CONSUMER/EFFECT | `archive-entry-worker.md`,`archive-formal-seam.md`；governance positive blocked 时不得通过 |
| `AC-AR-EVENT-004` | E04 `ConsumeStorageActionFeedback` | persisted target 将 feedback 互斥路由到 placement 或 lifecycle method；ACK/commit/unknown 分离 | 两个 method surface 双写/错路由；ACK 当 commit；lifecycle 不重核 decision | CONSUMER-004；CONSUMER/EFFECT | `archive-entry-worker.md`,`archive-consistency-replay.md`；storage positive blocked 时不得通过 |
| `AC-AR-EVENT-005` | E05 `ConsumeRestoreReceiverFeedback` | exact owner/receiver/effect；per-item outcome/history+receipt；duplicate/late 冲突保真 | 一 owner广播；Succeeded 推导 restored；直接 owner DB write；ACK 当 receiver commit | CONSUMER-005；CONSUMER/RESTORE | `archive-entry-worker.md`,`archive-formal-seam.md`；receiver positive blocked 时不得通过 |

### 7.3 Operations Job 逐入口 AC

| 验收项 ID | 正式 Job | 通过条件 | 失败条件 | exact TC / EV | suite report / 裁决 |
|---|---|---|---|---|---|
| `AC-AR-JOB-001` | J01 `AdvanceArchiveJob` | exact committed components 保守推进；job+stage+checkpoint+report 同提交 | 跳 stage/kind；局部成功聚合 Completed；old fence 写入 | JOB-001；JOB/STATE/UOW | `archive-entry-worker.md`,`archive-consistency-replay.md`；失败不得通过 |
| `AC-AR-JOB-002` | J02 `PlanArchiveSources` | frozen declared scope 生成完整 8-class Planned set 后 bind；workspace Auxiliary；unknown 保留 | 漏 binding/fallback；bind 未知却 Bound；跨 source 传播 | JOB-002；JOB/AUTHORITY | `archive-entry-worker.md`,`archive-formal-seam.md`；owner binding positive blocked |
| `AC-AR-JOB-003` | J03 `CaptureArchiveSource` | intent/attempt 先 durable；exact fence/version/coverage；MayHaveDispatched 转 reconcile | 未提交 intent 调用；unknown blind recapture；late 覆盖 replacement | JOB-003；JOB/AUTHORITY/EFFECT | 同上；owner capture positive blocked |
| `AC-AR-JOB-004` | J04 `ReconcileSourceCapture` | original fixed input exact probe；NotFound/unknown/conflict/late 保真 | NotFound 当无 effect 后重派；旧 attempt 覆盖新 attempt | JOB-004；JOB/EFFECT | 同上；probe positive blocked |
| `AC-AR-JOB-005` | J05 `AssembleBundleManifest` | committed frozen inventory→immutable revision/exact difference/finding；无 external I/O | missing/extra/phantom/race 被静默吞并或 ClosureReady | JOB-005；JOB/OBJECT/UOW | `archive-entry-worker.md`,`archive-consistency-replay.md`；失败不得通过 |
| `AC-AR-JOB-006` | J06 `SealArchiveBundle` | 重读 exact closure/assessment/placement basis；仅 Complete+Verified+Supported+Committed seal；不造 digest | 旧/mismatch/Unknown/ACK-only seal；Sealed 推导 archived | JOB-006；JOB/STATE | `archive-entry-worker.md`,`archive-formal-seam.md`；positive basis blocked |
| `AC-AR-JOB-007` | J07 `AssessBundleIntegrity` | fixed binding→immutable typed assessment/finding/result；无合同保留 Unknown/Blocked | 私造 algorithm/key/digest；fake/ref 造 Verified；覆盖失败历史 | JOB-007；JOB/STATE | `archive-entry-worker.md`,`archive-formal-seam.md`；capability positive blocked |
| `AC-AR-JOB-008` | J08 `AssessBundleCompatibility` | exact revision/schema/target 的 immutable result；Unsupported/Unknown 独立 | 复用其他 target success、自动 migrate、压平 unknown | JOB-008；JOB/STATE | 同上；schema target positive blocked |
| `AC-AR-JOB-009` | J09 `PlaceArchiveBundle` | intent commit→Tx 外 storage→outcome commit；ACK≠Committed；unknown→J12 | intent 前调用、timeout 当 success、MayHaveDispatched 重派 | JOB-009；JOB/EFFECT | `archive-entry-worker.md`,`archive-formal-seam.md`；storage positive blocked |
| `AC-AR-JOB-010` | J10 `RetrieveArchiveBundle` | exact placement/revision intent；formal observation 才 Retrievable | placement committed 自动 retrievable；unknown 仍生成 restore material | JOB-010；JOB/EFFECT | 同上；retrieval positive blocked |
| `AC-AR-JOB-011` | J11 `ExecuteArchiveLifecycle` | dispatch 前 current decision/hold recheck/read-set；intent-before-effect；typed outcome | missing/stale/hold 仍 effect；ACK=commit；Archive 决定 purge | JOB-011；JOB/EFFECT | 同上；governance/storage positive blocked |
| `AC-AR-JOB-012` | J12 `ReconcileExternalAction` | persisted target 将 exact probe 互斥路由 placement/lifecycle；original key/input；history append-only | 两 method surfaces 双写/错路由；NotFound 触发重派；history 覆盖 | JOB-012；JOB/EFFECT | `archive-consistency-replay.md`,`archive-formal-seam.md`；probe positive blocked |
| `AC-AR-JOB-013` | J13 `BuildRestorePlan` | fixed request/Bundle/owner set，逐 owner resolve；immutable revision+完整 item set；无跨 owner Tx | 一 owner缺失被隐藏；换 receiver 原地改 plan；创建跨域事务 | JOB-013；JOB/RESTORE | `archive-entry-worker.md`,`archive-formal-seam.md`；receiver positive blocked |
| `AC-AR-JOB-014` | J14 `PrepareRestoreMaterial` | exact eligible item/revision；仅 owner-approved minimum material/ref；失败姿态不 MaterialReady | partial/stale/missing/unsupported/integrity/retrieval unknown 仍 material-ready；Bundle 变写权 | JOB-014；JOB/RESTORE/AUTHORITY | 同上；source/material positive blocked |
| `AC-AR-JOB-015` | J15 `DispatchRestoreHandoff` | current receiver exact match；intent commit 后 Tx 外 dispatch；unknown→J16 | mapping drift 仍 intent/effect；ACK=commit；直接 owner write | JOB-015；JOB/RESTORE/EFFECT | 同上；receiver positive blocked |
| `AC-AR-JOB-016` | J16 `ReconcileRestoreHandoff` | original handoff/key/input exact probe；late outcome append；unknown 可保持 | unknown 重派；late conflict 覆盖历史/其他 owner；推导 restored | JOB-016；JOB/RESTORE/EFFECT | `archive-consistency-replay.md`,`archive-formal-seam.md`；probe positive blocked |
| `AC-AR-JOB-017` | J17 `ExecuteRestoreCompensation` | exact formal authority→independent intent/effect/probe/record；原 outcome 保留 | 无 authority 执行；Completed 改原 handoff success/owner truth；unknown blind retry | JOB-017；JOB/RESTORE/EFFECT | 同上；authority/receiver positive blocked |

每个 Job 还必须通过共同 `TC-AR-UOW-001～004`、`TC-AR-IDEMP-001～004` 的适用 vector：wrong claim/fence、same/same stored report replay、same/different Conflict、Completed-result missing、local commit unknown、每个 commit boundary cancellation、显式 unresolved subset partial resume。

### 7.4 横切同步门禁

| 验收项 ID | 主题 | 通过条件 | 失败条件 | 证据 / report | 裁决影响 |
|---|---|---|---|---|---|
| `AC-AR-SYNC-001` | 30/32 protocol totality | 3C+5Q+5E+17J 全可发现；E04/J12 两分支各自执行且互斥；binding identity 固定 | 漏 entry/method、同名漂移、route 到错误 service 或 transport 未绑定仍声称可用 | CONTRACT-001～004、全部入口 TC；CONTRACT/COMMAND/QUERY/CONSUMER/JOB；`archive-contract-domain.md` | 失败不得通过 |
| `AC-AR-SYNC-002` | formal seam totality | 每 source/decision/capability/storage/receiver/audit target 有 owner/version/schema/config/vector/finality；formal suite 同 run passed | 缺 target/prerequisite 被 skip/N/A/fake；一个 target proof 覆盖其他 target | AUTHORITY/EFFECT/RESTORE + related E/J；`archive-formal-seam.md`,`blocked-lanes.md` | required blocked/failed/not-run 均不得通过/条件通过 |
| `AC-AR-SYNC-003` | dependency classification | actual graph/binding 与 §6 类型一致；无 sibling/SDK/provider compile、共享 DB/Tx | runtime/event/ref/adapter/fake 被写 package dependency；Core 未核验却使用 | DEPENDENCY-001；DEPENDENCY；`dependency-boundary.md` | 失败可能 VETO |
| `AC-AR-SYNC-004` | outbound absence | 三候选只有设计登记；runtime/config/store/report 均无 outbox/topic/publisher/delivery/evidence | 任一 ready/published/delivered 声明或 response/receipt 自动发 event | DEPENDENCY-002；DEPENDENCY；`dependency-boundary.md`,`blocked-lanes.md` | 命中即 VETO 候选 |

### 7.5 接口 / 事件验收项停审记录

| 范围 | 正式名称与 surface | 通过/失败 | TC/EV/report | not-ready 裁决 | 停审 |
|---|---|---|---|---|---|
| C01～C03 | 3/3 | 可判定 | fixed | authority/governance positive blocked | 通过设计停审 |
| Q01～Q05 | 5/5 | 可判定；no-write 明确 | fixed | cursor/durable target-specific | 通过设计停审 |
| E01～E05 | 5/5；E04=2 methods | 可判定；ACK/local commit 分离 | fixed | producer/owner/provider formal blocked | 通过设计停审 |
| J01～J17 | 17/17；J12=2 methods | 可判定；claim/report/effect/recovery 明确 | fixed | external positive target blocked | 通过设计停审 |
| SYNC-001～004 | totality/formal/dependency/outbound | 可判定 | fixed | blocker 不可 skip/fake/waive | 通过设计停审 |

### 7.6 跨接口同步门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| logical entry 分母 | 30/30：3+5+5+17 | 无孤儿入口 |
| method surface 分母 | 32/32：E04/J12 各双路 | 必须互斥执行，不改 logical count |
| 正式名称/phase | 与 03 §7/8 一致 | 无 historical API/topic |
| 每项 exact TC/EV/report | 完整 | EV 为 family，实际 instance 仍为 0 |
| dependency 类型 | compile/runtime/event/ref/adapter/fake 均分开 | `AR-ARCH-001` 保留，不私自改标准 |
| 下游范围 | 只验 formal seam 和 Archive 一侧 | 不要求 owner 内部完整实现 |
| formal requiredness | 未降级 | 当前相关 AC blocked，完整验收不可通过 |
| outbound | 无正式事件分母 | 三 candidate 继续 blocked，absence 被验 |
| phase/状态越级 | 未发现 | ACK、local commit、external commit、restored 分离 |
| 跨 run/静态证据 | 禁止 | Step 10 再做真实性总审计 |

## 8. 回填草稿

正式 §7 应保留 30 个逐入口 AC（可按 C/Q/E/J 四表呈现）、四项横切同步门禁和依赖类型矩阵。正文须明确 logical surface 与 transport binding 的区别、E04/J12 双方法面、formal target required-but-blocked、fake 证明上限、Bus ACK/finality 边界，以及三 outbound candidate 在 `AR-HLD-Q-001` 关闭前必须不存在。当前无接口执行结论。

## 9. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 03/04/05 回写 | 无；30/32、logical names、binding/fake/TC/EV 一致 |
| 新 blocker | 无 |
| 持续 blocker | 18 项全保留；`AR-ARCH-001`、`AR-HLD-Q-001` 在本 Step 有直接门禁 |
| 未固定 transport | future implementation binding manifest；不影响 logical AC 设计，阻止实际送验 |

## 10. 进入 Step 8 条件

- [x] 30/30 logical entries 与 32/32 method surfaces 有明确裁决。
- [x] 每个入口有正式 logical name、exact TC、EV、report、通过/失败和总体影响。
- [x] 依赖类型、formal seam、下游未就绪和 fake 上限清楚。
- [x] 逐项停审与跨接口审计无 unresolved 冲突。
- [x] 未私造 route/topic/outbound success 或外部 closure。

当前 `gate_status`：`completed / thirty_entry_ac_closed_formal_seams_required_blocked`。

`next_allowed_action`：按连续授权创建并完成 Step 8。
