# Step 8 分件 A. 31 个 canonical 状态 enum entry 验收登记

> 父 Step: `06_acceptance_step_08_state_tx_consistency.md`
> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 8
> 正式来源: `03-详细设计.md` §9~§12;§15.3;`03_ddd_step_10_state_matrix.md`;`05-测试方案.md` §6.3 /§9 /§13
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_9
> 事实成熟度: `PassDesign`;0 target repo,0 fixed run,0 runtime EV,真实验收仍为 `NotEntered`

---

## 1. 登记口径

- `STCHK-SBX-001~031` 是 Step 8 检查索引,不是新的 canonical AC,不得写入需求或 runtime evidence 的 `ac_refs` 代替 `AC-SBX-*`。
- 状态名只能来自 `03_ddd_step_10_state_matrix.md` 中31个canonical enum entry;它们对应30个owner-level state machine。Step 6的39个shared status declaration是实现库存,不额外扩张STCHK分母;`Pending`、`Failed`、`Degraded`等同名variant只在各自owner内解释。
- 每项至少消费 `TC-SBX-STA-*` 的一条合法构造 /迁移、一条非法 /边界转换和 owner write-set 断言;仅 suite-level `Passed` 不足以裁决单项。
- 非法迁移必须同时证明 owner object、formal audit / relay / stored result 以及非 owner truth 没有半状态。
- Query 只读,maintenance 只写正式 marker / projection / derived / report / relay owner,adapter technical state 不能直接产生 allow。

### 1.1 证据缩写

| 缩写 | Planned slot -> future runtime form | 主证入口 |
|---|---|---|
| `I02` | `ESLOT-SBX-002 INTAKE` -> `EV-SBX-INTAKE-002` | `MC-02` + exact `STA-001~003` case raw |
| `B03` | `ESLOT-SBX-003 BOUNDARY` -> `EV-SBX-BOUNDARY-003` | `MC-02` + exact `STA-004~009` case raw |
| `P04` | `ESLOT-SBX-004 POLICY` -> `EV-SBX-POLICY-004` | `MC-02` + exact `STA-010~012` case raw |
| `E05` | `ESLOT-SBX-005 EXECUTION` -> `EV-SBX-EXECUTION-005` | `MC-02` + exact `STA-013~015 /031` case raw |
| `S06` | `ESLOT-SBX-006 SAFETY` -> `EV-SBX-SAFETY-006` | `MC-02` + exact `STA-016~019` case raw |
| `R07` | `ESLOT-SBX-007 READ` -> `EV-SBX-READ-007` | `MC-02` + exact `STA-020~023` case raw |
| `L09` | `ESLOT-SBX-009 RELAY` -> `EV-SBX-RELAY-009` | `MC-02` + exact `STA-024` case raw;relay suite 只按 exact assertion 补强 |
| `RP10` | `ESLOT-SBX-010 REPLAY` -> `EV-SBX-REPLAY-010` | `MC-02` + exact `STA-025~030` case raw;`ESLOT-SBX-013 CONFIG` 只补强 029~030 |
| `MC-02` | MAIN-CONTRACT / `SUITE-SBX-002` | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-002.md` |

Exact case raw 固定为 `artifacts/test/<main_contract_run_id>/suites/SUITE-SBX-002/cases/<tc_id>/<parameter_id>.json`;只有 raw / `report.json` / Markdown report / validation checks 合法配对后,RELEASE evidence generator 才能分配上表 future EV。当前所有 future EV 均未分配。

---

## 2. Intake / identity / reference

| 检查索引 / enum | 正式合法路径 | 必拒绝路径 | 触发 flow | 副作用与零半状态断言 | Canonical AC slice | TC / 证据 |
|---|---|---|---|---|---|---|
| `STCHK-SBX-001` `ControlledExecutionIntakeStatus` | `factory -> PendingResolution -> Accepted / Rejected / Unresolved`;`Unresolved -> PendingResolution`;`Accepted -> Closed` | `Rejected -> Accepted`;`Closed -> PendingResolution`;accepted context因reference stale降级 | `OpenControlledExecutionContextFlow`;正式close path | 非法时context / identity / audit / relay / result零写;stale只更新reference / projection | `AC-SBX-006/008 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-001`;`I02`;`MC-02` |
| `STCHK-SBX-002` `ExecutionEnvironmentIdentityStatus` | `factory -> Active -> Closed / Invalidated` | `Closed / Invalidated -> Active`;对同identity重写`Active` | intake / close / invalidate flow | terminal后新execution必须新identity;boundary / run调用0;无半identity | `AC-SBX-007 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-002`;`I02`;`MC-02` |
| `STCHK-SBX-003` `ReferenceResolutionStatus` | resolver outcome正式刷新`Resolved / Partial / Unresolved / Conflicted / Unavailable` | `Conflicted`仍支持context accepted;`Unavailable`无resolver结果直接`Resolved` | reference consumers;`RefreshSandboxReferenceStates` | marker + stale + receipt + reference cursor同UoW;cursor由UoW分配;不反写core truth | `AC-SBX-006/007 STATE-SLICE`;`AC-SBX-033 SNAPSHOT-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `TC-SBX-STA-003`;`I02`;`MC-02` |

## 3. Boundary / capability / handle / lease / orphan

| 检查索引 / enum | 正式合法路径 | 必拒绝路径 | 触发 flow | 副作用与零半状态断言 | Canonical AC slice | TC / 证据 |
|---|---|---|---|---|---|---|
| `STCHK-SBX-004` `BoundaryDecisionStatus` | `Required -> PendingCapability / Established / Rejected / Failed`;`PendingCapability -> Established / Rejected / Failed` | stale / unknown capability直接`Established`;`Rejected / Failed`原地重开 | `EstablishExecutionBoundaryFlow`;capability refresh | 无fresh capability时handle / lease / launch零写;重建使用新boundary ref | `AC-SBX-009/011 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-004`;`B03`;`MC-02` |
| `STCHK-SBX-005` `BoundaryCoherenceStatus` | `factory -> Pending -> Coherent / Rejected / Failed`;`Coherent -> Released` | 四维partial或非同代 -> `Coherent`;`Released / Failed -> Coherent` | boundary establish;lifecycle / guarded release | `Coherent`必须同代resource / filesystem / network / process + active handle;release需`Allowed` guard | `AC-SBX-009/010 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-005`;`B03`;`MC-02` |
| `STCHK-SBX-006` `BackendCapabilityStatus` | adapter outcome形成`Unknown / Stale / Unavailable / Fresh / Unsupported`;refresh可产生新`Fresh` summary | `Unknown / Stale / Unsupported`直接授权boundary / launch | capability consumer;`RefreshBackendCapabilitySummaries` | technical summary不写allow truth;unsupported整体拒绝,不做weak fallback | `AC-SBX-011 STATE-SLICE`;`AC-SBX-033 SNAPSHOT-SLICE` | `TC-SBX-STA-006`;`B03`;`MC-02` |
| `STCHK-SBX-007` `IsolationHandleStatus` | `Active -> ReleasePending -> Released`;`Active -> OrphanSuspected / Failed`;`ReleasePending -> Failed` | `Released -> Active`;非`Allowed` guard开始release | boundary / lifecycle;reaper / release path | terminal不复活;guard不成立release port calls `=0`;raw SDK outcome不入仓 | `AC-SBX-009/023 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-007`;`B03`;`MC-02` |
| `STCHK-SBX-008` `LeaseStatus` | `Active -> Expiring / Expired -> OrphanSuspected / Released` | `Released -> Active`;无expiry / lifecycle evidence直接`OrphanSuspected` | lifecycle consumer;`RunLeaseOrphanReaper` | lease不代表backend truth;reaper不绕cleanup guard;不确定时保持blocking state | `AC-SBX-023 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-008`;`B03`;`MC-02` |
| `STCHK-SBX-009` `OrphanRecoveryStatus` | `Suspected -> Confirmed -> Recovering -> Recovered`;任一非终态 -> `Failed` | `Recovered -> Failed`;无`Allowed` guard在`Recovering`调release | `RunLeaseOrphanReaper`;lifecycle recovery | terminal不改写;failed保留manual marker / capture / audit / investigation refs;release calls受guard | `AC-SBX-023 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-009`;`B03`;`MC-02` |

## 4. Policy / high-risk

| 检查索引 / enum | 正式合法路径 | 必拒绝路径 | 触发 flow | 副作用与零半状态断言 | Canonical AC slice | TC / 证据 |
|---|---|---|---|---|---|---|
| `STCHK-SBX-010` `PolicyApplicabilityStatus` | 正式summary构造`Applicable / Missing / Conflicted / Unsupported / Stale`;新summary可新建`Applicable` snapshot | 非`Applicable`直接产生`Accepted` decision | policy consumer;`EvaluatePolicyExecutionFlow` | fail-closed;refresh仅建formal snapshot / marker;query不修复;launch calls `=0` | `AC-SBX-012/014 STATE-SLICE`;`AC-SBX-033 SNAPSHOT-SLICE` | `TC-SBX-STA-010`;`P04`;`MC-02` |
| `STCHK-SBX-011` `PolicyExecutionDecisionStatus` | `Pending -> Accepted / Rejected / FailClosed / Blocked` | `Rejected / FailClosed / Blocked -> Accepted`同decision | `EvaluatePolicyExecutionFlow`;policy source feedback | 只有`Accepted`可进launch;恢复必须新decision / command;旧audit不改写 | `AC-SBX-012~015 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-011`;`P04`;`MC-02` |
| `STCHK-SBX-012` `HighRiskActionDecisionStatus` | 正式裁定`Allowed / Blocked / PendingAuthorization / Unsupported` | 非`Allowed`动作进入backend launch | policy evaluation;run preflight | unknown / pending保持blocked;run truth / backend calls `=0`;不补造approval truth | `AC-SBX-013 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-012`;`P04`;`MC-02` |

## 5. Run / capture / handoff

| 检查索引 / enum | 正式合法路径 | 必拒绝路径 | 触发 flow | 副作用与零半状态断言 | Canonical AC slice | TC / 证据 |
|---|---|---|---|---|---|---|
| `STCHK-SBX-013` `ControlledExecutionRunStatus` | `factory -> Preparing -> Running -> Completed / Failed / Terminated`;`Preparing -> Failed` | `Preparing -> Completed`;terminal -> `Running`;写入runtime agent-loop内部状态 | `StartControlledExecutionRunFlow`;lifecycle / control / timeout | run单调;终态重启必须新run;只保存stable backend summary;capture / failure分owner | `AC-SBX-013/016 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-013`;`E05`;`MC-02` |
| `STCHK-SBX-014` `CaptureFactStatus` | `CaptureFact::record(...)`创建时直接定格`Complete / Partial / Failed / Unavailable`,之后不可变 | 给capture fact写`Pending`;同fact从`Partial / Failed / Unavailable`改为`Complete`;unknown时重新collect而非inspect同一correlation | `RecordCaptureResultFlow`;`CaptureCollectionPort::{collect_capture, inspect_capture}` | application校验body-free candidate后一次性组装capture group;retry使用新capture identity;raw body不入truth;failure不伪Complete | `AC-SBX-016~018 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-014`;`E05`;`MC-02` |
| `STCHK-SBX-015` `HandoffFactStatus` | opening以完整`Pending` progress set派生`Pending`;后续按`BlockedByCleanupGuard > Failed > Retryable > Delivered > Pending`从完整progress set和guard override机械派生 | caller直接写aggregate;material使用`DeadLetter`;缺progress仍伪`Delivered`;delivery失败回滚capture | `OpenMaterialHandoffFlow`;matching target observation / cleanup guard reevaluation | aggregate不是外呼结果;capture / material source truth不变;receipt / safe reason只写handoff owner;exhausted material保持`Failed` | `AC-SBX-017~019 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-015`;`E05`;`MC-02` |
| `STCHK-SBX-031` `HandoffTargetProgressStatus` | opening创建完整`Pending` set;`Pending / eligible Retryable -> Attempting`;`Attempting -> Delivered / Retryable / Failed` | `Pending / Retryable`直接到terminal;未commit attempt先外呼;同attempt重新deliver;unknown猜终态;target / attempt mismatch | `OpenMaterialHandoffFlow`;`RetryPendingMaterialHandoffs`;`HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}` | opening delivery calls `=0`;attempt-before-call先commit;每attempt最多一次deliver;unknown只inspect同一attempt;post-call CAS后重派生aggregate;capture不变 | `AC-SBX-017~019 STATE-SLICE`;`AC-SBX-032/040 CONSISTENCY-SLICE` | `TC-SBX-STA-031`;`E05`;`MC-02` |

## 6. Failure / control / cleanup / redline

| 检查索引 / enum | 正式合法路径 | 必拒绝路径 | 触发 flow | 副作用与零半状态断言 | Canonical AC slice | TC / 证据 |
|---|---|---|---|---|---|---|
| `STCHK-SBX-016` `FailureClassificationStatus` | `factory -> PendingInput -> Classified -> Terminal / Superseded` | `Terminal -> PendingInput / Classified`;`Unknown`直接success | `ClassifySandboxFailureFlow`;lifecycle / capture / reaper source | failure source可回链;terminal阻断后续execution;不改写run历史 | `AC-SBX-020/022 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-016`;`S06`;`MC-02` |
| `STCHK-SBX-017` `ControlFactStatus` | `Accepted -> Completed / Failed / Conflicted`;factory可形成`IgnoredDuplicate` | `Conflicted -> Accepted`;duplicate新建control truth | `SubmitSandboxControlFlow`;control consumer | duplicate只重放result / receipt;control不执行business replay / runtime recovery;最多一个formal fact | `AC-SBX-022 STATE-SLICE`;`AC-SBX-040 REPLAY-SLICE` | `TC-SBX-STA-017`;`S06`;`MC-02` |
| `STCHK-SBX-018` `CleanupGuardStatus` | `PendingEvidence -> PendingInvestigation / Blocked / Allowed`;`PendingInvestigation / Blocked -> Allowed`;`Allowed -> Completed` | non-`Allowed`调release;`Completed -> Allowed` | `EvaluateCleanupReadinessFlow`;pending cleanup job;guarded release | non-Allowed时release calls `=0`;blocking refs保留;新evidence只走正式re-evaluation | `AC-SBX-022/023 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-018`;`S06`;`MC-02` |
| `STCHK-SBX-019` `RedlineContainmentStatus` | `Detected -> Contained -> HandoffPending -> Released / Terminal`;`Contained -> Terminal` | `Detected -> Released`;advisory-only;`Released -> Contained` | `RecordRedlineContainmentFlow`;investigation feedback / maintenance | containment truth必建;cleanup blocked;release需target-matched investigation + `Allowed` guard;不可普通receipt解除 | `AC-SBX-021/022 STATE-SLICE`;`AC-SBX-032 STATE-OWNER-SLICE` | `TC-SBX-STA-019`;`S06`;`MC-02` |

## 7. Query / projection / derived / reconciliation

| 检查索引 / enum | 正式合法路径 | 必拒绝路径 | 触发 flow | 副作用与零半状态断言 | Canonical AC slice | TC / 证据 |
|---|---|---|---|---|---|---|
| `STCHK-SBX-020` `QueryAccessStatus` | query decision构造`Visible / NotVisible / Restricted / Degraded / Unavailable` | query中`Degraded -> Visible` rebuild;surface驱动truth success | 13 Query service / visibility guard | write UoW / truth / marker / relay / repair calls全部`=0`;restricted先裁决再组view | `AC-SBX-032 NO-SECOND-WRITER-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `TC-SBX-STA-020`;`R07`;`MC-02` |
| `STCHK-SBX-021` `SandboxProjectionStatus` | `Fresh -> Stale -> Rebuilding -> Fresh / Degraded / Unavailable` | query `Stale -> Fresh`;拼projection ref后mark stale | source mutation stale marker;`RebuildSandboxReadProjections` | rebuild只读committed truth snapshot;用expected version;不反写truth;读者不见half view | `AC-SBX-032 OWNER-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `TC-SBX-STA-021`;`R07`;`MC-02` |
| `STCHK-SBX-022` `DerivedFreshnessStatus` | `Fresh -> Stale -> Rebuilding -> Fresh / Failed / Unavailable`;`Failed -> Stale` | derived `Failed`写core failure;query触发rebuild | `MaintainDerivedInspectPreviewTrend` | failure只写derived / report;source refs body-free;不建policy / artifact / failure truth | `AC-SBX-025 ENHANCEMENT-BOUNDARY-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `TC-SBX-STA-022`;`R07`;`MC-02` |
| `STCHK-SBX-023` `ReconciliationReportStatus` | immutable report构造`Clean / IssuesFound / Degraded / Failed` | report状态驱动truth repair;scope无index私扫latest | `RunSandboxReconciliation`;query report | finding只对`IssuesFound`;只写report / latest index;不写core truth / projection repair | `AC-SBX-030 NO-REPAIR-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `TC-SBX-STA-023`;`R07`;`MC-02` |

## 8. Relay / replay / technical states

| 检查索引 / enum | 正式合法路径 | 必拒绝路径 | 触发 flow | 副作用与零半状态断言 | Canonical AC slice | TC / 证据 |
|---|---|---|---|---|---|---|
| `STCHK-SBX-024` `SandboxEventRelayStatus` | source UoW创建`Pending`;`Pending / Retryable / Failed -> Published / Retryable / Failed / DeadLetter` | `Published / DeadLetter -> Pending`;success写`Delivered`;从latest truth重建payload;同attempt重发或unknown猜终态 | source UoW appendfrozen bundle;publish job提交exact attempt;`SandboxEventPublisherPort::publish`;unknown inspect same attempt | publisher只消费committed frozen bundle + exact attempt;source truth / cursor不变;每attempt最多一次publish;只有新source event才新relay | `AC-SBX-019/022 STATE-SLICE`;`AC-SBX-032/040 CONSISTENCY-SLICE` | `TC-SBX-STA-024`;`L09`;`MC-02` |
| `STCHK-SBX-025` `IdempotencyRecordStatus` | `Reserved -> Completed / Failed / Conflict`;completed duplicate表面为`Duplicate` | `Duplicate -> Reserved`;visible `Failed -> Completed`同record | Command / Consumer / Job shared template | atomic reserve仅一executor;duplicate零mutation;conflict不覆盖digest | `AC-SBX-040 REPLAY-SLICE` | `TC-SBX-STA-025`;`RP10`;`MC-02` |
| `STCHK-SBX-026` `StoredResultStatus` | typed result为`Completed / Rejected / Failed`;lookup可得`Unavailable` | `Unavailable`从current truth重算;wrong kind强转 | duplicate path / stored result repository | `DuplicateMissingResult`;resolver / backend / domain / mutation calls全部`=0`;manual integrity handoff | `AC-SBX-040 REPLAY-SLICE` | `TC-SBX-STA-026`;`RP10`;`MC-02` |
| `STCHK-SBX-027` `ConsumerReceiptStatus` | `Accepted / Duplicate / Delayed / Rejected / Failed / Quarantined` | `Duplicate`重跑flow;`Delayed`写accepted truth | 9 Consumer shared template | receipt决定ack / retry / quarantine;stored receipt不改写;duplicate owner writes `=0` | `AC-SBX-040 REPLAY-SLICE`;affected functional AC exact slice | `TC-SBX-STA-027`;`RP10`;`MC-02` |
| `STCHK-SBX-028` `JobReportStatus` | `Succeeded / PartialFailed / Failed / Skipped / Degraded` | partial隐藏为`Succeeded`;duplicate重跑job | 10 Operations Job shared template | failed / skipped / degraded refs和counts持久可重放;不修core truth | `AC-SBX-040 REPLAY-SLICE`;affected maintenance AC exact slice | `TC-SBX-STA-028`;`RP10`;`MC-02` |
| `STCHK-SBX-029` `AdapterAvailabilityStatus` | runtime builder / health产生`Available / Degraded / Unavailable / Disabled` | `Degraded / Disabled`授权policy / boundary;disabled关闭hard guard | runtime builder;adapter health / call mapper | technical state只映射typed error / bounded read;hard guard不可降级allow | `AC-SBX-011/014 STATE-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `TC-SBX-STA-029`;`RP10`;`MC-02`;CONFIG只补强 |
| `STCHK-SBX-030` `RuntimeConfigStatus` | validated generation为`Valid / StartupBlocked / Degraded` | invalid / required missing映射`Degraded`并启动mutation | config loader / runtime builder startup | invalid / partial hard guard必须`StartupBlocked`;`Degraded`仅允许合格read / maintenance | `AC-SBX-011/014 STATE-SLICE`;`AC-SBX-040 CONSISTENCY-SLICE` | `TC-SBX-STA-030`;`RP10`;`MC-02`;CONFIG只补强 |

---

## 9. 31 项状态独立停审

| 检查索引 | 正式状态名 | 当前设计停审 | 触发 flow / phase | TC / evidence 定位 | 副作用断言 | Runtime disposition |
|---|---|---|---|---|---|---|
| STCHK-SBX-001 | pass;exact enum | pass;legal / illegal / terminal闭合 | pass;intake / close | pass;STA-001 / I02 / MC-02 | pass;stale不降级core | `NotEvaluated` |
| STCHK-SBX-002 | pass;exact enum | pass;terminal identity不复活 | pass;intake / invalidation | pass;STA-002 / I02 / MC-02 | pass;boundary / run零旁路 | `NotEvaluated` |
| STCHK-SBX-003 | pass;exact enum | pass;fail-closed refresh | pass;consumer / refresh job | pass;STA-003 / I02 / MC-02 | pass;marker cursor / no core write | `NotEvaluated` |
| STCHK-SBX-004 | pass;exact enum | pass;fresh capability guard | pass;boundary flow | pass;STA-004 / B03 / MC-02 | pass;no weak fallback / no partial group | `NotEvaluated` |
| STCHK-SBX-005 | pass;exact enum | pass;four-dimension coherence | pass;boundary / release | pass;STA-005 / B03 / MC-02 | pass;guard-first release | `NotEvaluated` |
| STCHK-SBX-006 | pass;exact enum | pass;technical state不授权 | pass;consumer / refresh | pass;STA-006 / B03 / MC-02 | pass;no allow truth write | `NotEvaluated` |
| STCHK-SBX-007 | pass;exact enum | pass;terminal handle guard | pass;lifecycle / reaper | pass;STA-007 / B03 / MC-02 | pass;release call guard / no SDK body | `NotEvaluated` |
| STCHK-SBX-008 | pass;exact enum | pass;lease不代表backend | pass;lifecycle / reaper | pass;STA-008 / B03 / MC-02 | pass;uncertain保守 | `NotEvaluated` |
| STCHK-SBX-009 | pass;exact enum | pass;recovery terminal单调 | pass;reaper / recovery | pass;STA-009 / B03 / MC-02 | pass;manual refs retained | `NotEvaluated` |
| STCHK-SBX-010 | pass;exact enum | pass;non-applicable fail-closed | pass;policy evaluation / consumer | pass;STA-010 / P04 / MC-02 | pass;launch=0 / query no repair | `NotEvaluated` |
| STCHK-SBX-011 | pass;exact enum | pass;decision不原地改allow | pass;policy evaluation | pass;STA-011 / P04 / MC-02 | pass;new decision recovery | `NotEvaluated` |
| STCHK-SBX-012 | pass;exact enum | pass;high-risk non-Allowed阻断 | pass;policy / run preflight | pass;STA-012 / P04 / MC-02 | pass;backend call=0 | `NotEvaluated` |
| STCHK-SBX-013 | pass;`Preparing`已回写漂移 | pass;run terminal单调 | pass;run / lifecycle / control | pass;STA-013 / E05 / MC-02 | pass;no agent-loop state | `NotEvaluated` |
| STCHK-SBX-014 | pass;exact enum | pass;capture immutable | pass;capture flow | pass;STA-014 / E05 / MC-02 | pass;no output / artifact body | `NotEvaluated` |
| STCHK-SBX-015 | pass;exact enum | pass;handoff terminal guard | pass;command / feedback / retry | pass;STA-015 / E05 / MC-02 | pass;capture no rollback | `NotEvaluated` |
| STCHK-SBX-016 | pass;exact enum | pass;failure terminal guard | pass;classify / lifecycle | pass;STA-016 / S06 / MC-02 | pass;source linked / run history stable | `NotEvaluated` |
| STCHK-SBX-017 | pass;exact enum | pass;duplicate无新control | pass;command / consumer | pass;STA-017 / S06 / MC-02 | pass;no runtime recovery | `NotEvaluated` |
| STCHK-SBX-018 | pass;exact enum | pass;non-Allowed no release | pass;cleanup command / job | pass;STA-018 / S06 / MC-02 | pass;blocking refs retained | `NotEvaluated` |
| STCHK-SBX-019 | pass;exact enum | pass;containment / investigation guard | pass;redline / feedback | pass;STA-019 / S06 / MC-02 | pass;no advisory / auto-release | `NotEvaluated` |
| STCHK-SBX-020 | pass;exact enum | pass;query access不成truth | pass;Query only | pass;STA-020 / R07 / MC-02 | pass;all writes=0 | `NotEvaluated` |
| STCHK-SBX-021 | pass;exact enum | pass;projection versioned rebuild | pass;stale / rebuild job | pass;STA-021 / R07 / MC-02 | pass;snapshot only / no truth write | `NotEvaluated` |
| STCHK-SBX-022 | pass;exact enum | pass;derived不升格 | pass;derived job | pass;STA-022 / R07 / MC-02 | pass;failure only derived / report | `NotEvaluated` |
| STCHK-SBX-023 | pass;exact enum | pass;report immutable / no repair | pass;reconciliation job | pass;STA-023 / R07 / MC-02 | pass;latest index only | `NotEvaluated` |
| STCHK-SBX-024 | pass;exact enum | pass;relay terminal / no rollback | pass;source tx / publish / feedback | pass;STA-024 / L09 / MC-02 | pass;source truth / cursor stable | `NotEvaluated` |
| STCHK-SBX-025 | pass;exact enum | pass;single executor | pass;three-channel shared template | pass;STA-025 / RP10 / MC-02 | pass;duplicate mutation=0 | `NotEvaluated` |
| STCHK-SBX-026 | pass;exact enum | pass;typed stored replay | pass;duplicate path | pass;STA-026 / RP10 / MC-02 | pass;missing result no recompute | `NotEvaluated` |
| STCHK-SBX-027 | pass;exact enum | pass;receipt controls disposition | pass;consumer template | pass;STA-027 / RP10 / MC-02 | pass;duplicate owner writes=0 | `NotEvaluated` |
| STCHK-SBX-028 | pass;exact enum | pass;partial report honest | pass;job template | pass;STA-028 / RP10 / MC-02 | pass;no rerun / no repair | `NotEvaluated` |
| STCHK-SBX-029 | pass;exact enum | pass;technical availability不放宽 | pass;builder / health | pass;STA-029 / RP10 / MC-02 | pass;hard guard remains | `NotEvaluated` |
| STCHK-SBX-030 | pass;exact enum | pass;startup block不伪degraded success | pass;config builder | pass;STA-030 / RP10 / MC-02 | pass;no partial generation mutation | `NotEvaluated` |
| STCHK-SBX-031 | pass;exact enum | pass;attempt-before-call / exact-attempt inspection | pass;handoff opening / retry job | pass;STA-031 / E05 / MC-02 | pass;opening calls=0 / one delivery per attempt / aggregate derived | `NotEvaluated` |

31 /31项完成设计停审,覆盖30个owner-level state machine,0项引用口语状态,0项把future EV伪装为runtime evidence。`PassDesign`不是实际验收通过;目标仓、suite、run、raw、report和EV不存在时,全部runtime disposition保持`NotEvaluated / NotEntered`。

---

## 10. 分件自检

| 检查项 | 结论 |
|---|---|
| 31个canonical enum entry是否连续覆盖 | 通过;`STCHK-SBX-001~031` / `TC-SBX-STA-001~031`一一对应;对应30个owner-level state machine。 |
| 是否使用 exact variant | 通过;run只使用`Preparing`;capture无`Pending`;material handoff无`DeadLetter`;relay success只用`Published`。 |
| 每项是否有合法 /非法路径与 trigger flow | 通过;31 /31。 |
| 每项是否有副作用 /零半状态断言 | 通过;31 /31。 |
| 每项是否回指 canonical AC / TC / slot / future EV / report | 通过;runtime artifact 中 range必须展开为exact ID。 |
| 是否混入tools semantic execution / runtime agent loop / member lifecycle | 否;run仅保存stable backend summary,外部lifecycle仅以ref / safe marker进入。 |
| 是否产生新AC或真实证据 | 否;STCHK仅为检查索引,future EV未分配。 |
