# Step 6 分件 B. Consumer、Outbound Event 与 Operations Job 用例矩阵

> 父Step: `05_test_plan_step_06_cases.md`
> 正式来源: `03-详细设计.md` §7.5~§8.4;`03_ddd_step_08_protocol_contracts.md` §13~§15;`03_ddd_step_09_function_flows.md` §11~§13 / §16~§18
> 生成日期: 2026-07-12
> 状态: reviewed_passed_with_step_06
> 边界: 本分件定义formal test case,不定义bus产品、topic、ack实现、job命令、fixture、artifact或执行结果。Event用例验证stored payload与relay边界,不宣称事件已真实发布。

---

## 1. Consumer共用门禁

| 用例ID | 场景 /操作 | 预期结果与断言 | 层级 | CUT / PER |
|---|---|---|---|---|
| TC-SBX-CNS-001 | 合法trusted envelope通过schema / source / digest / forbidden-body gate | reserve dedup后才进入业务mapping;accepted写owning marker + stored receipt;cursor由UoW分配 | L1+L2+L4 | CUT-SBX-011/022;PER-SBX-011/022 |
| TC-SBX-CNS-002 | 分别缺event id / source / schema / dedup / digest,source authority不可信,或payload含synthetic body marker | `Rejected` / `Quarantined`;业务service与repository mutation=0;safe receipt无raw payload | L1+L4 | CUT-SBX-001/011/026/029;PER-SBX-001/011/026/029 |
| TC-SBX-CNS-003 | 同operation / dedup key / digest重复投递 | 返回stored receipt `Duplicate`;resolver / handoff / command / relay mutation均不重跑 | L2+L3+L4 | CUT-SBX-011/024;PER-SBX-011/024 |
| TC-SBX-CNS-004 | 同dedup key不同digest,或completed record缺stored receipt | `IdempotencyConflict` / `DuplicateMissingResult`或quarantine;不得重算receipt / truth | L2+L3 | CUT-SBX-024/026;PER-SBX-024/026 |

## 2. 9个Inbound Consumer用例

| 用例ID | Consumer /场景 | 前置 /输入操作 | 预期receipt | 正式状态 /副作用断言 | 层级 / PER |
|---|---|---|---|---|---|
| TC-SBX-CNS-005 | `ConsumeCallerContextReferenceChanged` accepted | trusted caller safe summary,matched tracked refs | `Accepted` | `ReferenceResolutionState`更新;existing projections stale;reference marker cursor非source version;不保存caller body | L2+L4;PER-SBX-011/031 |
| TC-SBX-CNS-006 | caller ref unavailable / forbidden | resolver unavailable或payload含body marker | `Delayed` / `Quarantined` | 不猜context truth;不创建accepted context;old reference state不改写 | L2+L3+L4;PER-SBX-011/026/029 |
| TC-SBX-CNS-007 | `ConsumePolicySummaryChanged` accepted | trusted body-free policy summary | `Accepted` | 只更新policy reference state与projection stale;既有`PolicyExecutionDecision`不从FailClosed / Rejected变Accepted | L2+L4;PER-SBX-011/016 |
| TC-SBX-CNS-008 | policy missing / stale / unsafe | source delayed、conflicted或含policy body | `Delayed` / `Quarantined` | fail-closed仍成立;不保存DSL / approval body;不触发run | L1+L2+L4;PER-SBX-005/011/026 |
| TC-SBX-CNS-009 | `ConsumeBackendCapabilitySummaryChanged` supported / unsupported | body-free capability summary matched backend profile | `Accepted` | capability reference state更新;comparison stale;不建立`CoherentBoundary` | L2+L4;PER-SBX-011/015 |
| TC-SBX-CNS-010 | capability stale / source unavailable | stale marker或port unavailable | `Delayed` | existing boundary truth不被降级 /放宽;不default allow或host fallback | L2+L3;PER-SBX-011/026/036 |
| TC-SBX-CNS-011 | `ConsumeIsolationBackendLifecycleSignal` matched orphan / failure | event handle / lease refs匹配existing truth | `Accepted` | 仅通过versioned safety group写orphan / failure / lease marker;必要时cleanup pending;不release | L2+L3+L4;PER-SBX-011/018 |
| TC-SBX-CNS-012 | lifecycle handle missing / mismatched | unknown handle、wrong environment identity或unsafe outcome | `Delayed` / `Quarantined` | 不造fake handle / lease;不把unknown写success;不执行cleanup | L2+L3;PER-SBX-011/026/035 |
| TC-SBX-CNS-013 | `ConsumeMaterialHandoffStatusChanged` delivered / retryable / failed | handoff / target / exact attempt与committed `Attempting` progress匹配 | 对应accepted receipt | 只更新 `HandoffTargetProgressStatus`，再从完整progress set机械派生`HandoffFactStatus`;capture / material refs / source truth不回滚 | L2+L3+L4;PER-SBX-011/017/020 |
| TC-SBX-CNS-014 | material handoff target / attempt mismatch or terminal reopen | wrong target / attempt或per-target Delivered / Failed后试图回Pending | `Quarantined` / rejected | `HandoffTargetMismatch`或exact transition error;progress / aggregate / capture unchanged;不重新调用delivery port | L1+L2+L3;PER-SBX-011/026 |
| TC-SBX-CNS-015 | `ConsumeObservabilityHandoffStatusChanged` accepted / failed marker | observability material ref与target匹配 | `Accepted` | 只记录handoff marker / receipt;不宣称observability store truth;无body dump | L2+L4;PER-SBX-011/017/029 |
| TC-SBX-CNS-016 | observability material missing / body present | missing ref或payload含raw telemetry | `Rejected` / `Quarantined` | 不生成ref、不写provider body;capture fact保持 | L1+L2+L4;PER-SBX-011/026/029 |
| TC-SBX-CNS-017 | `ConsumeSandboxControlRequested` formal command path | trusted source、control ref / kind / guard完整 | `Accepted`或formal command result | 先consumer dedup,再走`SubmitSandboxControl`;inner command idempotency / version guard不被绕过 | L2+L4;PER-SBX-009/011/024 |
| TC-SBX-CNS-018 | control source不可信 / conflict | untrusted envelope、same signal different kind或terminal target | `Quarantined` / `Rejected` / conflict | 不创建第二`ControlFact`;不直接调用runtime control adapter | L1+L2+L4;PER-SBX-011/025/026 |
| TC-SBX-CNS-019 | `ConsumeInvestigationHandoffStatusChanged` matched | cleanup / redline ref与target匹配 | `Accepted` | 只更新formal investigation marker;guard可重评但不直接Allowed / Released;containment仍owner | L2+L3+L4;PER-SBX-011/018 |
| TC-SBX-CNS-020 | investigation mismatch / release request | wrong target或feedback试图直接release | `Quarantined` / `Rejected` | cleanup / redline / handle不释放;安全阻断与audit marker保留 | L1+L2+L3;PER-SBX-011/026/035 |
| TC-SBX-CNS-021 | `ConsumeSandboxTruthRelayFeedback` published / retryable / dead-letter | relay ref / exact attempt与publisher observation匹配 | 对应accepted receipt | 只更新versioned `SandboxEventRelayStatus`;success只写`Published`;source truth / source cursor不变 | L2+L3+L4;PER-SBX-011/020 |
| TC-SBX-CNS-022 | relay terminal reopen / mismatched feedback | Published / DeadLetter后Pending、wrong relay / attempt ref或unknown猜终态 | `Rejected` / `Quarantined` / bounded recovery | terminal record不复活;同attempt不重新publish;unknown只inspect exact attempt;不创建new relay;source truth不变 | L1+L2+L3;PER-SBX-011/020/026 |

## 3. 13个Outbound Event payload用例

共用断言: payload必须来自同一source transaction中保存的canonical body-free snapshot;`source_truth_ref`、`source_cursor`、`payload_ref`、`audit_trace_ref`正式可回链。缺canonical payload时不append relay,不得从current truth重建。publish outcome只改变relay record,不回滚source truth。

| 用例ID | Outbound Event / source | 触发与预期payload断言 | 负向断言 | 层级 / PER |
|---|---|---|---|---|
| TC-SBX-EVT-001 | `SandboxExecutionContextChanged` / context + identity + resolution | accepted / rejected intake提交后payload保留context / identity refs与正式intake status | 无caller正文;publish失败不回滚context | L1+L3+L4;PER-SBX-012/014 |
| TC-SBX-EVT-002 | `SandboxBoundaryChanged` / requirement + decision + handle | established / rejected / pending / failed decision与四维summary同代 | 不携带raw backend outcome;不把partial写Coherent | L1+L3+L4;PER-SBX-012/015 |
| TC-SBX-EVT-003 | `SandboxPolicyDecisionChanged` / policy snapshot + decision | accepted / rejected / fail-closed和high-risk decision refs准确 | 无DSL / approval body;stale不写Accepted | L1+L3+L4;PER-SBX-012/016 |
| TC-SBX-EVT-004 | `SandboxRunChanged` / controlled run | run status、context / boundary / policy / handle refs来自committed run | 不含tool command / agent loop正文;failed不伪completed | L1+L3+L4;PER-SBX-012/017 |
| TC-SBX-EVT-005 | `SandboxCaptureChanged` / capture fact | Complete / Partial / Failed与material / observability refs准确 | 无output body;handoff失败不改payload source | L1+L3+L4;PER-SBX-012/017/029 |
| TC-SBX-EVT-006 | `SandboxMaterialHandoffChanged` / handoff fact | Pending / InProgress / Delivered / Retryable / Failed / BlockedByCleanupGuard聚合状态与fixed target progress refs准确 | 不宣称artifact / observability truth;不写material `DeadLetter`;capture不回滚 | L1+L3+L4;PER-SBX-012/017/020 |
| TC-SBX-EVT-007 | `SandboxFailureChanged` / failure classification | kind、status、safe source markers可回链;Unknown保持非success | 无raw SDK / stack;不改run历史 | L1+L3+L4;PER-SBX-012/018/026 |
| TC-SBX-EVT-008 | `SandboxControlChanged` / control fact | control kind / status / signal ref与conflict结果准确 | 不携带operator正文;不执行control副作用 | L1+L3+L4;PER-SBX-012/018 |
| TC-SBX-EVT-009 | `SandboxCleanupChanged` / cleanup guard | Allowed / Blocked / PendingEvidence / PendingInvestigation及证据refs准确 | payload不代表backend已Released | L1+L3+L4;PER-SBX-012/018 |
| TC-SBX-EVT-010 | `SandboxRedlineContainmentChanged` / containment | Detected / Contained / HandoffPending / Released / Terminal及investigation refs准确 | 不把advisory当contained;Released必须已有formal guard来源 | L1+L3+L4;PER-SBX-012/018 |
| TC-SBX-EVT-011 | `SandboxProjectionChanged` / projection state | Fresh / Stale / Rebuilding / Degraded与source cursor准确 | 不dump projection body;不重建current truth | L1+L3+L4;PER-SBX-008/012/019 |
| TC-SBX-EVT-012 | `SandboxDerivedViewChanged` / derived state | freshness / derived kind / source refs准确 | derived Failed不创建core failure;无preview正文 | L1+L3+L4;PER-SBX-008/012/019 |
| TC-SBX-EVT-013 | `SandboxReconciliationFindingAvailable` / report | 仅IssuesFound且有formal finding refs时append | Clean / Failed不伪造finding;event不修truth | L1+L3+L4;PER-SBX-008/012/019 |
| TC-SBX-EVT-014 | 13 event schema与event kind闭集 | 逐event roundtrip并故意交换kind / payload family | family匹配全部通过;交换后`InvalidCarrier`;kind不能替代payload | L1;CUT-SBX-001/012;PER-SBX-001/012 |
| TC-SBX-EVT-015 | relay append / exact-attempt publisher failure共用 | source tx在append前 /后分别注入失败;publisher消费frozen committed bundle并返回published / retryable / dead-letter / unknown | source tx失败则truth与relay全不可见;source已提交后只改relay-local status;unknown只inspect same attempt;不从 latest truth重建payload | L2+L3;CUT-SBX-012/020/022;PER-SBX-012/020/022 |

## 4. 10个Operations Job用例

所有Job另受共用case约束: duplicate same digest返回完整stored report且0 target call;different digest conflict;missing report不重跑。每个job使用typed input、formal selection port和per-item UoW;内部`JobReportStatus`必须显式映射为public `SandboxJobReportStatus`,部分失败不得隐藏为Succeeded。

| 用例ID | Job /场景 | 前置 /操作 | 预期report与状态 | 核心副作用断言 | 层级 / PER |
|---|---|---|---|---|---|
| TC-SBX-JOB-001 | `PublishSandboxEventRelay` mixed batch | Pending / Retryable relay含published / retryable / dead-letter / unknown observations | `PartialFailed`或Succeeded;逐item refs / exact attempt status | 每attempt最多一次publish;unknown只inspect same attempt;CAS loser不重发;success=`Published`;source truth不变 | L2+L3+L4;PER-SBX-013/020/025 |
| TC-SBX-JOB-002 | `RefreshSandboxReferenceStates` success / unavailable | explicit stale refs;resolver分别success / unavailable | refreshed与failed refs分列;partial如实 | 只写reference state + existing projection stale;marker cursor由UoW分配 | L2+L3+L4;PER-SBX-013/019/023 |
| TC-SBX-JOB-003 | `RefreshBackendCapabilitySummaries` supported / unsupported / unavailable | selected backend profile refs | report body-free capability refs与degraded项 | 不建立boundary、不授权launch、不default allow | L2+L3+L4;PER-SBX-013/015/019 |
| TC-SBX-JOB-004 | `RetryPendingMaterialHandoffs` mixed delivery | pending / eligible retryable targets;port返回delivered / retryable / failed / unknown | `PartialFailed`;逐target item / exact attempt status | 先commit `Attempting`再每attempt外呼一次;unknown只inspect same attempt;aggregate机械派生;capture / material refs / cleanup guard不回滚;terminal不重送 | L2+L3+L4;PER-SBX-013/017/020 |
| TC-SBX-JOB-005 | `RunLeaseOrphanReaper` expiry / inspect failure | expired lease与active redline / handoff combinations | orphan / blocked / failed item如实 | inspect可写lease / orphan marker;cleanup guard非Allowed时release=0 | L2+L3+L4;PER-SBX-013/018/035 |
| TC-SBX-JOB-006 | `EvaluatePendingCleanupGuards` mixed readiness | pending guards含证据齐全 /缺失 /investigation pending | allowed / blocked / pending item + honest counts | 只评估 /保存guard;`release_environment`调用0 | L1+L2+L4;PER-SBX-013/018 |
| TC-SBX-JOB-007 | `MaintainRedlineContainmentHandoffs` success / unavailable | HandoffPending containments;port outcome mixed | Succeeded / PartialFailed / Degraded | 只更新investigation marker / containment;不release redline / cleanup | L2+L3+L4;PER-SBX-013/018/035 |
| TC-SBX-JOB-008 | `RebuildSandboxReadProjections` snapshot success / missing | stale projection refs;truth snapshot完整 /缺失 | Fresh与Degraded item分列 | 从truth snapshot重建;不从旧view body;core truth不写 | L2+L3+L4;PER-SBX-008/013/019 |
| TC-SBX-JOB-009 | `MaintainDerivedInspectPreviewTrend` success / source missing | derived candidates与body-free sources | Fresh / Failed derived items;可Degraded report | derived failure不创建`FailureClassification`;不写core truth | L2+L3+L4;PER-SBX-008/013/019 |
| TC-SBX-JOB-010 | `RunSandboxReconciliation` clean / issues / degraded | snapshot page完整、有finding或partial | stored `Clean` / `IssuesFound` / `Degraded` report;finding relay按条件 | 不修truth / projection;latest marker原子更新 | L2+L3+L4;PER-SBX-008/013/019 |
| TC-SBX-JOB-011 | all-job duplicate replay | 对每个job预存completed idempotency + report | 逐10 job以same digest重放 | 返回`DuplicateReplayed` stored report;selection / port / mutation调用0 | L2+L4;PER-SBX-013/024 |
| TC-SBX-JOB-012 | all-job invalid / empty / partial surface | 对每个job构造invalid selector、empty selection与单item failure | invalid为Failed / Skipped;empty为Succeeded / Skipped按正式spec;partial不伪全成 | report refs / counts一致;失败也保存可replay report;无core repair | L2+L3+L4;PER-SBX-013/026 |

## 5. 本分件停审

| 审查项 | 结论 | 后续边界 |
|---|---|---|
| 9 Consumer是否逐项覆盖accepted与关键delayed / quarantine | 通过 | Step 7提供envelope / outcome数据族 |
| 13 Event是否逐项绑定committed snapshot | 通过 | Step 9才绑定publisher / route / suite |
| 10 Job是否逐项含partial / replay / no-repair | 通过 | Step 7分配selection与per-item数据;Step 13定义report artifact |
| duplicate / no rollback / source owner | 通过 | Consumer / relay / handoff / job均未重算或回滚非owner truth |
| 是否创建真实event / report / evidence | 否 | 全部是用例设计和planned PER引用 |
