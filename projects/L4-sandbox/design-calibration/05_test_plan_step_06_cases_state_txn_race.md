# Step 6 分件 C. 状态、事务、幂等与并发用例矩阵

> 父Step: `05_test_plan_step_06_cases.md`
> 正式来源: `03-详细设计.md` §9~§12;`03_ddd_step_06_object_contracts.md` §25;`03_ddd_step_10_state_matrix.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`
> 生成日期: 2026-07-12
> 状态: reviewed_passed_with_step_06
> 边界: 本分件定义deterministic状态 / transaction / race test contract,不选择数据库、锁、线程工具或fixture实现。fake必须保持正式UoW / version / cursor语义,但不能证明真实backend隔离。

---

## 1. 31个 Step 10 canonical 状态enum用例

每个状态用例至少覆盖一条合法构造 /迁移和一条代表性非法迁移。非法时断言owner object、formal audit / relay / stored result和非owner truth均不产生半状态;同名`Failed`只在对应owner内解释。`STA-001~031`是31个稳定测试槽，对应30个owner-level state machines；本表是设计清单，不是执行结果。

| 用例ID | enum /合法路径 | 关键非法或边界触发 | 断言 | CUT / PER |
|---|---|---|---|---|
| TC-SBX-STA-001 | `ControlledExecutionIntakeStatus`: PendingResolution -> Accepted / Rejected / Unresolved;Accepted -> Closed | Rejected -> Accepted;Closed -> PendingResolution;Accepted -> PendingResolution | `InvalidStateTransition`;terminal不重开;reference stale只改reference / projection | CUT-SBX-014;PER-SBX-014 |
| TC-SBX-STA-002 | `ExecutionEnvironmentIdentityStatus`: factory Active -> Closed / Invalidated | Closed / Invalidated -> Active;duplicate重写Active | 新execution必须新identity;失效后boundary / run被阻断 | CUT-SBX-014;PER-SBX-014 |
| TC-SBX-STA-003 | `ReferenceResolutionStatus`: Resolved / Partial / Unresolved / Conflicted / Unavailable间由resolver outcome正式刷新 | Conflicted支持context Accepted;Unavailable无resolver直接Resolved | fail-closed / delayed;marker cursor来自UoW;不反写core truth | CUT-SBX-014/019;PER-SBX-014/019 |
| TC-SBX-STA-004 | `BoundaryDecisionStatus`: Required / PendingCapability -> Established / Rejected / Failed | stale capability直接Established;Rejected / Failed重开 | 无fresh capability不得allow;新boundary ref才能重建 | CUT-SBX-015;PER-SBX-015 |
| TC-SBX-STA-005 | `BoundaryCoherenceStatus`: Pending -> Coherent / Rejected / Failed;Coherent -> Released | partial四维 -> Coherent;Released / Failed -> Coherent | 四维同代 + active handle必需;release需Allowed guard | CUT-SBX-015;PER-SBX-015 |
| TC-SBX-STA-006 | `BackendCapabilityStatus`: Unknown / Stale / Unavailable经adapter outcome -> Fresh;Unsupported | Stale / Unknown / Unsupported直接授权boundary | technical summary不决定allow;unsupported整体reject | CUT-SBX-015/021;PER-SBX-015/021 |
| TC-SBX-STA-007 | `IsolationHandleStatus`: Active -> ReleasePending -> Released;Active -> OrphanSuspected / Failed | Released -> Active;非Allowed guard开始release | terminal不复活;release port调用受guard;raw SDK outcome不保存 | CUT-SBX-015/018;PER-SBX-015/018 |
| TC-SBX-STA-008 | `LeaseStatus`: Active -> Expiring / Expired -> OrphanSuspected / Released | Released -> Active;未expiry / lifecycle evidence直接OrphanSuspected | lease不代表backend truth;reaper不得绕guard | CUT-SBX-015/018;PER-SBX-015/018 |
| TC-SBX-STA-009 | `OrphanRecoveryStatus`: Suspected -> Confirmed -> Recovering -> Recovered;任一非终态 -> Failed | Recovered -> Failed;Recovering未Allowed guard调用release | terminal不改写;failure保留manual marker与材料 | CUT-SBX-015/018;PER-SBX-015/018 |
| TC-SBX-STA-010 | `PolicyApplicabilityStatus`: Applicable / Missing / Conflicted / Unsupported / Stale由summary构造;新summary可Applicable | 非Applicable直接产生Accepted decision | `PolicyFailClosed`;refresh创建formal snapshot / marker,query不修 | CUT-SBX-016;PER-SBX-016 |
| TC-SBX-STA-011 | `PolicyExecutionDecisionStatus`: Pending -> Accepted / Rejected / FailClosed;high-risk可Blocked | Rejected / FailClosed / Blocked -> Accepted同decision | launch仅Accepted;恢复需新decision / command | CUT-SBX-016;PER-SBX-016 |
| TC-SBX-STA-012 | `HighRiskActionDecisionStatus`: Allowed / Blocked / PendingAuthorization / Unsupported | 非Allowed动作进入launch | run / backend调用0;unknown / pending保持blocked | CUT-SBX-016;PER-SBX-016 |
| TC-SBX-STA-013 | `ControlledExecutionRunStatus`: Preparing -> Running -> Completed;Preparing / Running -> Failed;Running -> Terminated | Preparing -> Completed;terminal -> Running;agent-loop内部状态写入 | `InvalidStateTransition`;新run才可重启;只保存stable backend summary | CUT-SBX-017;PER-SBX-017 |
| TC-SBX-STA-014 | `CaptureFactStatus`: `CaptureFact::record(...)` factory -> Complete / Partial / Failed / Unavailable | `Pending`参与构造;Partial / Failed / Unavailable同capture原地改为Complete | capture创建即定格;retry创建新capture;无artifact / output body | CUT-SBX-017;PER-SBX-017 |
| TC-SBX-STA-015 | `HandoffFactStatus`: 从完整target progress set派生 Pending / InProgress / Delivered / Retryable / Failed / BlockedByCleanupGuard | adapter直接设aggregate;material `DeadLetter`;终态重开;failure回滚capture | 聚合每次只机械派生;complete plan不缺项;capture / source truth保持 | CUT-SBX-017/020;PER-SBX-017/020 |
| TC-SBX-STA-016 | `FailureClassificationStatus`: PendingInput -> Classified -> Terminal / Superseded | Terminal -> PendingInput / Classified;Unknown直接success | failure source可回链;terminal阻断后续execution | CUT-SBX-018;PER-SBX-018 |
| TC-SBX-STA-017 | `ControlFactStatus`: Accepted -> Completed / Failed / Conflicted;factory IgnoredDuplicate | Conflicted -> Accepted;IgnoredDuplicate写new control | duplicate只replay;control不做business replay / runtime recovery | CUT-SBX-018;PER-SBX-018 |
| TC-SBX-STA-018 | `CleanupGuardStatus`: PendingEvidence -> PendingInvestigation / Blocked / Allowed;Allowed -> Completed | non-Allowed调用release;Completed -> Allowed | release调用0;blocking refs保留;新证据只走正式重评 | CUT-SBX-018;PER-SBX-018 |
| TC-SBX-STA-019 | `RedlineContainmentStatus`: Detected -> Contained -> HandoffPending -> Released或Terminal | Detected -> Released;advisory-only;Released -> Contained | containment truth必建;cleanup blocked;release需investigation + guard | CUT-SBX-018;PER-SBX-018 |
| TC-SBX-STA-020 | `QueryAccessStatus`: factory Visible / NotVisible / Restricted / Degraded / Unavailable | Degraded在query中重建成Visible;surface驱动truth success | write=0;restricted先裁决后读body;query状态非truth lifecycle | CUT-SBX-019;PER-SBX-019 |
| TC-SBX-STA-021 | `SandboxProjectionStatus`: Fresh -> Stale -> Rebuilding -> Fresh / Degraded / Unavailable | query Stale -> Fresh;拼projection ref后mark stale | rebuild只从truth snapshot;expected version;不反写truth | CUT-SBX-019;PER-SBX-019 |
| TC-SBX-STA-022 | `DerivedFreshnessStatus`: Fresh -> Stale -> Rebuilding -> Fresh / Failed / Unavailable;Failed -> Stale | derived Failed写core failure;query触发rebuild | failure只写derived / report;source refs body-free | CUT-SBX-019;PER-SBX-019 |
| TC-SBX-STA-023 | `ReconciliationReportStatus`: factory Clean / IssuesFound / Degraded / Failed | report状态驱动truth repair;scope无index扫描latest | stored immutable report;finding仅IssuesFound;no repair | CUT-SBX-019;PER-SBX-019 |
| TC-SBX-STA-024 | `SandboxEventRelayStatus`: Pending / Retryable / Failed -> Published / Retryable / Failed / DeadLetter | Published / DeadLetter -> Pending;unknown猜状态;同attempt重新publish;publish失败回滚source | publisher只消费frozen committed bundle + exact attempt;source truth不变;new source才new relay | CUT-SBX-020;PER-SBX-020 |
| TC-SBX-STA-025 | `IdempotencyRecordStatus`: Reserved -> Completed / Failed / Conflict;Completed -> Duplicate | Duplicate -> Reserved;Failed same record -> Completed | single executor;duplicate不mutation;conflict不覆盖digest | CUT-SBX-021/024;PER-SBX-021/024 |
| TC-SBX-STA-026 | `StoredResultStatus`: Completed / Rejected / Failed可按正式result replay;lookup -> Unavailable | Unavailable从current truth重算;wrong kind强转 | `DuplicateMissingResult`;0 resolver / port / mutation | CUT-SBX-021/024;PER-SBX-021/024 |
| TC-SBX-STA-027 | `ConsumerReceiptStatus`: Accepted / Duplicate / Delayed / Rejected / Failed / Quarantined | Duplicate重跑flow;Delayed写accepted truth | ack / retry由formal status;stored receipt不可改写 | CUT-SBX-011/021;PER-SBX-011/021 |
| TC-SBX-STA-028 | `JobReportStatus`: Succeeded / PartialFailed / Failed / Skipped / Degraded | partial隐藏为Succeeded;duplicate重跑job | failed / skipped / degraded refs和counts持久化可replay | CUT-SBX-013/021;PER-SBX-013/021 |
| TC-SBX-STA-029 | `AdapterAvailabilityStatus`: Available / Degraded / Unavailable / Disabled | Degraded / Disabled授权policy或boundary;Disabled关闭hard guard | technical state仅映射error / bounded read;hard guard保持 | CUT-SBX-021/028;PER-SBX-021/028 |
| TC-SBX-STA-030 | `RuntimeConfigStatus`: Valid / StartupBlocked / Degraded | invalid / required missing映射Degraded并启动mutation | invalid / partial必须StartupBlocked;Degraded仅合格read / maintenance | CUT-SBX-021/028;PER-SBX-021/028 |
| TC-SBX-STA-031 | `HandoffTargetProgressStatus`: Pending / eligible Retryable -> Attempting;Attempting -> Delivered / Retryable / Failed | direct Pending / Retryable -> terminal;未commit attempt先外呼;同attempt重新deliver;unknown猜终态;target / attempt mismatch | opening调用delivery=0;attempt-before-call先commit;每attempt最多一次deliver;unknown只inspect same attempt;aggregate重新派生 | CUT-SBX-017/020/025;PER-SBX-017/020/025 |

## 2. UoW、可见性、cursor与幂等用例

| 用例ID | 触发点 /操作 | 预期结果 | 完整断言 | CUT / PER |
|---|---|---|---|---|
| TC-SBX-TXN-001 | accepted Command依次成功stage reserve、truth group、audit、relay、stale、stored result、complete、cursor后commit | command成功 | commit后全部原子可见;cursor复制一致;无repository私有cursor | CUT-SBX-022;PER-SBX-022 |
| TC-SBX-TXN-002 | 在begin / reserve / domain / truth save / audit append / relay append / stale / stored result / complete / cursor任一点注入失败 | command失败 / rollback | truth、audit、relay、stale、stored result、idempotency complete / fail和cursor全部不可见 | CUT-SBX-022/026;PER-SBX-022/026 |
| TC-SBX-TXN-003 | commit返回confirmed failure或unknown | 不自动重试副作用;`TransactionCommitFailed` / manual surface | 不出现可判定半组;后续按same key先查record / stored result / truth,不得盲写第二次 | CUT-SBX-022/026;PER-SBX-022/026 |
| TC-SBX-TXN-004 | rollback本身失败 | `RollbackFailed` / `Internal`,manual integrity required | 不宣称未提交 /成功;不伪造result / evidence;安全信号无raw detail | CUT-SBX-022/026;PER-SBX-022/026 |
| TC-SBX-TXN-005 | reference-only consumer / refresh accepted | marker + stale + receipt + idempotency + reference cursor同UoW | 不分配truth cursor;source version / dedup key不作marker cursor | CUT-SBX-022/023;PER-SBX-022/023 |
| TC-SBX-TXN-006 | query与mutation commit竞态 | query只见commit前或后完整snapshot | 无write UoW、repair或half group;不因竞态写VersionConflict retry | CUT-SBX-010/022/025;PER-SBX-010/022/025 |
| TC-SBX-TXN-007 | Command same key same digest completed | replaystored command result | resolver / backend / domain / repo mutation / audit / relay调用0 | CUT-SBX-024;PER-SBX-024 |
| TC-SBX-TXN-008 | Consumer same key same digest completed | replaystored receipt | reference / handoff / control / relay mutation=0;ack语义保持 | CUT-SBX-024;PER-SBX-024 |
| TC-SBX-TXN-009 | Job same key same digest completed | replaystored report | selection / target port / report item重建=0;原counts / refs不变 | CUT-SBX-024;PER-SBX-024 |
| TC-SBX-TXN-010 | 任一channel same key differentdigest / operation | `IdempotencyConflict` | 原record / result不可覆盖;新请求不进入mutation | CUT-SBX-024/026;PER-SBX-024/026 |
| TC-SBX-TXN-011 | Completed但stored result missing / wrong kind | `DuplicateMissingResult` | 不从current truth / receipt / report重算;进入manual integrity | CUT-SBX-021/024/026;PER-SBX-021/024/026 |
| TC-SBX-TXN-012 | existing Reserved same digest并发重入 | retryable in-flight / delayed | 第二调用不执行;首调用仍唯一owner;不阻塞复用同UoW | CUT-SBX-021/024/025;PER-SBX-021/024/025 |
| TC-SBX-TXN-013 | stale expected version更新existing truth / marker / relay / projection | `VersionConflict`;current UoW rollback | committed version不覆盖;fresh-read后仅同key + same digest可重试 | CUT-SBX-023/025/026;PER-SBX-023/025/026 |
| TC-SBX-TXN-014 | create用None但ref / unique active key已存在 | conflict / validation | fake不得auto-create / merge / overwrite;只有一个active truth | CUT-SBX-023/025;PER-SBX-023/025 |

## 3. 19类deterministic并发用例

| 用例ID | 正式race | 调度点 | single-winner与loser断言 | CUT / PER |
|---|---|---|---|---|
| TC-SBX-RACE-001 | same idempotency key Command | 两调用同时reserve | 一次resolver / backend / truth save;同digest loser in-flight / replay,不同digest conflict | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-002 | 同caller request不同key open context | create unique barrier | 仅一个active context / identity;loser rollback并`VersionConflict` / Validation | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-003 | context / identity close vs intake update | 两方读同version后交错save | close或update单赢家;closed不得reopen;无半identity | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-004 | boundary establish vs capability refresh | decision save前刷新marker | boundary按固定snapshot成立 /拒绝或conflict重试;refresh不改established truth | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-005 | 两个boundary establish | 同context / kind同时create | 仅一套coherent boundary / handle / lease;loser无partial handle | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-006 | policy evaluation vs summary consumer | policy group save与reference save交错 | fail-closed decision不被consumer静默改Accepted;loserversion conflict / delayed | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-007 | start run vs control / failure | run与safety group交错 | final run单调;terminal control后不得Running;最多一个formal control / failure path | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-008 | capture vs failure / terminate | capture save与terminal run save交错 | failed run不被capture Complete改回Completed;loser rollback / Failed | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-009 | handoff open / per-target delivery / feedback / retry | 同handoff version及exact target attempt交错 | opening外呼0;committed `Attempting`单赢家;每attempt deliver最多1次;CAS loser不重新外呼;target mismatch quarantine;capture不变 | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-010 | API control vs control event | same `control_signal_ref`双入口 | 一个`ControlFact`;consumer receipt和command result各自幂等;无旁路 | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-011 | classification vs lifecycle / reaper | versioned safety group交错 | unknown / orphan不被改success;loserconflict / skipped且可报告 | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-012 | cleanup evaluation vs reaper release | guard / lease / handle同version | non-Allowed / redline pending时release=0;allowed分支最多一次release attempt | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-013 | redline command vs investigation feedback | containment version交错 | feedback不直接Released;target匹配且guard成立才迁移;cleanup不绕过 | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-014 | relay publish vs feedback | relay exact attempt expected version交错 | Published / DeadLetter只一次terminal;CAS loser不重新publish;unknown只inspect same attempt;source truth与cursor不变 | CUT-SBX-020/025;PER-SBX-020/025 |
| TC-SBX-RACE-015 | reference consumer vs refresh job | reference expected version交错 | 单一reference state;cursor来自winner UoW;无event key cursor | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-016 | projection stale vs rebuild | projection version交错 | query只见old / stale / rebuilt完整状态;不见half view;conflict可重试 | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-017 | derived jobs duplicate / concurrent | reserve与derived expected version交错 | same key replay;different key单赢家;builder failure仅derived / report | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-018 | reconciliation duplicate / concurrent | report save + latest index交错 | immutable report均可留;latest index原子单赢家;core truth不写 | CUT-SBX-025;PER-SBX-025 |
| TC-SBX-RACE-019 | query vs mutation commit | query读点置于commit前 /中 /后 | 只见before或after;write=0;不mark stale / repair | CUT-SBX-010/022/025;PER-SBX-010/022/025 |

## 4. 本分件停审

| 审查项 | 结论 | 后续边界 |
|---|---|---|
| 31个 Step 10 canonical enum是否逐项有合法 /非法断言 | 设计静态闭合,31 /31 | Step 7按状态族准备数据;不得新增口语状态或声明已执行 |
| UoW staged failure是否覆盖全链 | 通过 | Step 9选择failure injection和write-audit实现 |
| Command / Consumer / Job stored replay是否三族齐全 | 通过 | retention / expiry留Step 7 /14,当前不设数字 |
| 正式并发场景是否全量承接 | 通过,19 /19 | 使用deterministic schedule,不依赖偶现压力 |
| fake证明上限 | 明确 | 证明语义parity,不证明CUT-SBX-034~036真实隔离 |
