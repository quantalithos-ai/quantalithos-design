# Step 5 分件 A. 功能验收逐项追溯登记

> 父Step: `06_acceptance_step_05_function_gate.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_6
> 本分件口径: 按`AC-SBX-006~023`逐项固定需求 /设计、TC、planned ESLOT、future runtime EV form、source report与裁决影响。本文不创建run、EV、artifact、report、测试结果或验收结论。

---

## 1. 分件状态与引用纪律

| 项 | 规则 |
|---|---|
| 唯一功能验收项owner | 父Step §8.2;本分件不重定义通过 /失败条件 |
| canonical需求owner | 正式`00`的FR-SBX-001~018、BR-SBX-001~033、AC-SBX-006~023 |
| 设计owner | 正式`02/03`;对象、flow、protocol、状态和error必须使用正式名称 |
| TC owner | 正式`05` §6及测试Step 6主件 /分件;区间必须按正式ID展开消费 |
| slot owner | 正式`05` §13 /测试Step 13;ESLOT只表示planned catalog |
| runtime EV owner | 真实producer。只有raw / report / checks合法时才按`EV-SBX-<FAMILY>-<NNN>`分配 |
| 当前实例 | 0 run、0 runtime EV、0 report、0 item review;验收过程仍为`NotEntered` |

### 1.1 Future path与identity占位符

下列尖括号值是未来Step 3基线必须固定的角色占位符,不是当前事实:

| 占位符 | 唯一含义 |
|---|---|
| `<main_contract_run_id>` | MAIN-CONTRACT fixed source run;SBX-ENV-02 / SBX-PROFILE-02 |
| `<main_seam_run_id>` | MAIN-SEAM fixed source run;SBX-ENV-03 / SBX-PROFILE-03 |
| `<ops_run_id>` | OPS fixed source run;SBX-ENV-04 / SBX-PROFILE-04 |
| `<p0q_run_id>` | P0Q fixed source run;SBX-ENV-05 / SBX-PROFILE-05 |
| `<release_run_id>` | GATE-SBX-RELEASE aggregation run;只聚合四源,自身不产生P0证明效力 |

每个功能项未来必须能定位以下四层,缺任一层不可判定:

```text
raw case
  = artifacts/test/<source_run_id>/suites/<suite_id>/cases/<tc_id>/<parameter_id>.json
suite report
  = reports/runs/<source_run_id>/suites/<suite_id>.md
release evidence item
  = reports/runs/<release_run_id>/evidence/<evidence_id>.md
release index
  = reports/runs/<release_run_id>/evidence-index.md
```

runtime form列只表达slot规定的未来派生形式。例如`ESLOT-SBX-002 / INTAKE`只有在真实producer成立后才可能形成`EV-SBX-INTAKE-002`;本文件中的形式不是alias分配、证据引用或通过事实。

用户已明确回复“同意”并放行父Step进入Step 6;该确认只批准本追溯设计,不形成run、runtime EV、报告、单项裁决或总体结论。

### 1.2 紧凑引用唯一展开规则

逐项矩阵为控制列宽使用以下紧凑记法,其展开是机械规则,不创建新编号族:

| 紧凑记法 | 唯一展开 |
|---|---|
| `CMD-001 /002` | `TC-SBX-CMD-001`;`TC-SBX-CMD-002` |
| `STA-001~003` | `TC-SBX-STA-001`;`TC-SBX-STA-002`;`TC-SBX-STA-003` |
| `SUITE-001 /004` | `SUITE-SBX-001`;`SUITE-SBX-004` |
| `MAIN-CONTRACT SUITE-004` | `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-004.md`及同run机器raw配对 |
| `P0Q SUITE-013` | `reports/runs/<p0q_run_id>/suites/SUITE-SBX-013.md`及qualification raw / report配对 |
| `ESLOT-SBX-003 BOUNDARY -> EV-SBX-BOUNDARY-003` | 左侧是planned slot,右侧只是满足生成条件后的future runtime form;当前均不存在 |

正式机器artifact、runtime evidence item和review记录不得保存紧凑token、range、slash或占位符,必须展开为逐个完整ID和真实fixed `run_id`。

---

## 2. 需求与设计契约追溯矩阵

| 验收项 | 正式需求 /规则 | 正式设计对象 / port | 正式flow /协议契约 |
|---|---|---|---|
| AC-SBX-006 | C-SBX-1;FR-SBX-001;BR-SBX-001~003 /005 | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ContextReferenceResolverPort`;`SandboxIdempotencyRepository`;`SandboxStoredResultRepository` | `OpenControlledExecutionContext`;`OpenControlledExecutionContextFlow`;shared command transaction template |
| AC-SBX-007 | C-SBX-1;FR-SBX-002;BR-SBX-001 /004 /005 | `ControlledExecutionContext`;`ExecutionEnvironmentIdentity`;`ReferenceResolutionState`;`SandboxActorContextDto`;`ContextReferenceResolverPort` | `OpenControlledExecutionContext`;`OpenControlledExecutionContextFlow`;`GetSandboxExecutionStatus` read flow |
| AC-SBX-008 | C-SBX-1;FR-SBX-003;BR-SBX-003 /004 | `SandboxProtocolMetadataDto`;`SandboxActorContextDto`;`SandboxCommandService`;API / worker / jobs entry shells | shared carrier;`OpenControlledExecutionContextFlow`;`ConsumeSandboxControlRequested` formal command path;Step 5.8 entry boundary |
| AC-SBX-009 | C-SBX-2;FR-SBX-004;BR-SBX-006 /009 | `BoundaryEstablishmentDecision`;`CoherentBoundary`;`IsolationEnvironmentHandle`;`LeaseRecord`;`IsolationBackendPort` | `EstablishExecutionBoundary`;`EstablishExecutionBoundaryFlow`;`StartControlledExecutionRunFlow` |
| AC-SBX-010 | C-SBX-2;FR-SBX-005;BR-SBX-007 /008 /010 | `BoundaryRequirementSet`;`BackendCapabilitySummary`;`CoherentBoundary`;`BackendCapabilityPort`;`IsolationBackendPort` | `EstablishExecutionBoundary`;coherent four-dimensional decision;qualified bounded probe flow |
| AC-SBX-011 | C-SBX-2;FR-SBX-006;BR-SBX-008~010 | `BoundaryEstablishmentDecision`;`BackendCapabilitySummary`;`IsolationBackendAdapterOutcome`;`BoundaryCoherenceStatus` | `EstablishExecutionBoundaryFlow`;`StartControlledExecutionRunFlow` guard;`WeakBoundaryFallbackRejected`;`BoundaryCoherenceViolation` |
| AC-SBX-012 | C-SBX-3;FR-SBX-007;BR-SBX-011 /014 /015 /017 | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision`;`PolicySummaryPort` | `EvaluatePolicyExecution`;`EvaluatePolicyExecutionFlow`;`ConsumePolicySummaryChanged`;`GetPolicyDecisionSummary` |
| AC-SBX-013 | C-SBX-3;FR-SBX-008;BR-SBX-011~013 /017 | `PolicyExecutionDecision`;`HighRiskActionDecision`;`ControlledExecutionRun`;`IsolationBackendPort` | `EvaluatePolicyExecutionFlow`;`StartControlledExecutionRunFlow`;high-risk launch guard;qualified redline probe |
| AC-SBX-014 | C-SBX-3;FR-SBX-009;BR-SBX-012 /014 /017 | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`AdapterAvailabilityState`;`PolicySummaryPort` | `EvaluatePolicyExecutionFlow`;`StartControlledExecutionRunFlow` guard;`PolicyFailClosedBypass` |
| AC-SBX-015 | C-SBX-3;FR-SBX-010;BR-SBX-014~016 | shared metadata / actor carrier;`SandboxCommandService`;`SandboxConsumerService`;idempotency / stored result objects | shared command / consumer templates;`EvaluatePolicyExecution`;`ConsumePolicySummaryChanged`;formal control fulfillment path |
| AC-SBX-016 | C-SBX-4;FR-SBX-011;BR-SBX-018 /021 /024 | `ControlledExecutionRun`;`CaptureFact`;`CaptureFactStatus`;`CaptureCollectionPort::{collect_capture, inspect_capture}`;body-free collection candidate / material refs | `StartControlledExecutionRunFlow`;`RecordCaptureResultFlow`;unknown只inspect同一capture correlation;`GetCaptureSummary`;`SandboxCaptureChanged` |
| AC-SBX-017 | C-SBX-4;FR-SBX-012;BR-SBX-018 /019 /021 /022 | `CaptureFact`;`HandoffFact`;`HandoffFactStatus`;`HandoffTargetProgressStatus`;`HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}`;material / artifact safe refs | `RecordCaptureResultFlow`;`OpenMaterialHandoffFlow`只提交fixed target plan和完整`Pending` progress set;per-target先提交`Attempting`再外呼;feedback / retry只更新matching attempt;`SandboxMaterialHandoffChanged` |
| AC-SBX-018 | C-SBX-4;FR-SBX-013;BR-SBX-018 /020 /022 /024 | `CaptureFact`;`HandoffFact`;`SandboxAuditTrace`;`HandoffTargetDeliveryPort`;observability material source与target-owned handoff marker | `RecordCaptureResultFlow`;`OpenMaterialHandoffFlow`;observability material按fixed target plan交付;ordinary hook仅post-return / post-inspection且失败隔离;`GetSandboxAuditTrace` |
| AC-SBX-019 | C-SBX-4;FR-SBX-014;BR-SBX-021 /023 /024 | `CaptureFact`;`HandoffFact`;`SandboxEventRelayRecord`;stored result / receipt / job report | capture / handoff command flows;feedback consumers;canonical outbound relay;`RetryPendingMaterialHandoffs` |
| AC-SBX-020 | C-SBX-5;FR-SBX-015;BR-SBX-025 /030 /032 | `FailureClassification`;`FailureClassificationStatus`;`SandboxFailureKind`;正式`03` §11链接的`03_ddd_step_12_error_recovery.md` exact 38 typed errors和safe mapper | `ClassifySandboxFailureFlow`;`GetFailureControlStatus`;failure event / report surfaces |
| AC-SBX-021 | C-SBX-5;FR-SBX-016;BR-SBX-026 /030 /033 | `RedlineContainment`;`CleanupGuard`;`InvestigationHandoffPort`;`RedlineContainmentStatus` | `RecordRedlineContainmentFlow`;investigation feedback;`MaintainRedlineContainmentHandoffs`;redline qualified probe |
| AC-SBX-022 | C-SBX-5;FR-SBX-017;BR-SBX-027 /028 /030 /032 /033 | `ControlFact`;`FailureClassification`;`CleanupGuard`;`SandboxAuditTrace`;relay / job report objects | `SubmitSandboxControlFlow`;failure / cleanup / redline flows;control consumer;outbound relay;operations jobs |
| AC-SBX-023 | C-SBX-5;FR-SBX-018;BR-SBX-028~032 | `LeaseRecord`;`OrphanRecoveryRecord`;`IsolationEnvironmentHandle`;`CleanupGuard`;lifecycle backend outcome | `EvaluateCleanupReadinessFlow`;lifecycle consumer;`RunLeaseOrphanReaper`;`EvaluatePendingCleanupGuards`;qualified inspect / release flow |

---

## 3. TC、planned evidence与report追溯矩阵

表中TC分为功能主证和必要补强。后续Step 7~10可以审查同一补强TC的协议 /一致性 /证据属性,但不能删除本表的功能断言。source report列列出item review的主要定位入口;每个列出的slot仍必须按正式`05` §13 catalog消费其全部适用producer suite / source role,不得只挑本列显示的有利报告或删掉Failed / Blocked producer。

| 验收项 | 功能主证TC | 必要负向 /资格补强TC | planned slot -> future runtime form（均未分配） | 主要固定source report入口 | 裁决影响 |
|---|---|---|---|---|---|
| AC-SBX-006 | TC-SBX-CMD-001 /002 | CTR-003;TXN-007 /010 /011;ERR-014 /015 | ESLOT-SBX-002 INTAKE -> `EV-SBX-INTAKE-002`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-010 REPLAY -> `EV-SBX-REPLAY-010` | MAIN-CONTRACT SUITE-001 /004 /007 /010;RELEASE item / index | 任一required分支或stored replay断裂则不通过 |
| AC-SBX-007 | TC-SBX-CMD-001 /002;STA-001~003 | CTR-002;ERR-014 /015;QRY-001 /002 | ESLOT-SBX-001 CONTRACT -> `EV-SBX-CONTRACT-001`;ESLOT-SBX-002 INTAKE -> `EV-SBX-INTAKE-002`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008` | MAIN-CONTRACT SUITE-001 /002 /004 /010;RELEASE item / index | identity /责任链不可归责或ref混族则不通过 |
| AC-SBX-008 | TC-SBX-CMD-001 /002;CNS-017 /018 | CTR-003 /004;ARCH-003;CONF-011 /012及caller-kind参数 | ESLOT-SBX-001 CONTRACT -> `EV-SBX-CONTRACT-001`;ESLOT-SBX-002 INTAKE -> `EV-SBX-INTAKE-002`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-016 ARCH -> `EV-SBX-ARCH-016`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-001 /003 /004 /005 /011;MAIN-SEAM SUITE-005 /011;P0Q SUITE-013 | 第二入口或资格替代使功能不通过;可触发后续VETO |
| AC-SBX-009 | TC-SBX-CMD-003 /004 /007 /008;STA-004~009 | RACE-004 /005;ERR-006 /007;CONF-001 /006 /011 /012 | ESLOT-SBX-003 BOUNDARY -> `EV-SBX-BOUNDARY-003`;ESLOT-SBX-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-011 CONSISTENCY -> `EV-SBX-CONSISTENCY-011`;ESLOT-SBX-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-002 /004 /009 /010;P0Q SUITE-013 | P0-C或P0-Q任一缺失均不通过 |
| AC-SBX-010 | TC-SBX-CMD-003 /004;STA-004~007 | CFG-005 /010~018适用;CONF-001~005 | ESLOT-SBX-003 BOUNDARY -> `EV-SBX-BOUNDARY-003`;ESLOT-SBX-013 CONFIG -> `EV-SBX-CONFIG-013`;ESLOT-SBX-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-002~004 /008;P0Q SUITE-013 | 四维任一未真实施加即不通过 |
| AC-SBX-011 | TC-SBX-CMD-004 /008 | ERR-006 /007 /027 /029 /030;CONF-006 /011 /012 | ESLOT-SBX-003 BOUNDARY -> `EV-SBX-BOUNDARY-003`;ESLOT-SBX-004 POLICY -> `EV-SBX-POLICY-004`;ESLOT-SBX-012 ERROR -> `EV-SBX-ERROR-012`;ESLOT-SBX-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-004 /010;MAIN-SEAM SUITE-010;P0Q SUITE-013 | weak fallback / partial success或P0-Q缺口即不通过 |
| AC-SBX-012 | TC-SBX-CMD-005 /006 /008;STA-010~012 | CNS-007 /008;ERR-005 /008;CTR-006适用 | ESLOT-SBX-004 POLICY -> `EV-SBX-POLICY-004`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-012 ERROR -> `EV-SBX-ERROR-012`;ESLOT-SBX-015 AUDIT -> `EV-SBX-AUDIT-015` | MAIN-CONTRACT SUITE-001 /002 /004 /005 /010;MAIN-SEAM SUITE-005 /010 | 无前置policy snapshot或body污染即不通过 |
| AC-SBX-013 | TC-SBX-CMD-005~008;STA-011 /012 | ERR-005;RACE-007;CONF-004 /005 /007 /010 | ESLOT-SBX-004 POLICY -> `EV-SBX-POLICY-004`;ESLOT-SBX-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-SBX-011 CONSISTENCY -> `EV-SBX-CONSISTENCY-011`;ESLOT-SBX-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-002 /004 /009 /010;P0Q SUITE-013 | unauthorized真实动作成功或非Accepted launch即不通过 /候选VETO |
| AC-SBX-014 | TC-SBX-CMD-006 /008;STA-010~012 | CNS-008;ERR-005 /027~030;CONF-006 /012 | ESLOT-SBX-004 POLICY -> `EV-SBX-POLICY-004`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-012 ERROR -> `EV-SBX-ERROR-012`;ESLOT-SBX-013 CONFIG -> `EV-SBX-CONFIG-013`;ESLOT-SBX-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-002~005 /008 /010;MAIN-SEAM SUITE-005 /008 /010;P0Q SUITE-013 | 任一fail-open / fallback或Blocked被吞并即不通过 |
| AC-SBX-015 | TC-SBX-CMD-005 /006 /008;CNS-007 /008 /017 /018 | CTR-004;TXN-007~012;caller / channel参数 | ESLOT-SBX-001 CONTRACT -> `EV-SBX-CONTRACT-001`;ESLOT-SBX-004 POLICY -> `EV-SBX-POLICY-004`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-010 REPLAY -> `EV-SBX-REPLAY-010` | MAIN-CONTRACT SUITE-001 /004 /005 /007 /011;MAIN-SEAM SUITE-005 /011 | 任一调用方第二policy语义或replay重算即不通过 |
| AC-SBX-016 | TC-SBX-CMD-007~010;STA-013 /014;QRY-007 /008 | CTR-006;CFG-030;CONF-007 /008 /013 | ESLOT-SBX-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-015 AUDIT -> `EV-SBX-AUDIT-015`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-001 /003 /004;P0Q SUITE-013 | capture缺失 /误分类 /raw泄漏或P0-Q缺失即不通过 |
| AC-SBX-017 | TC-SBX-CMD-009~012;CNS-013 /014;EVT-005 /006 | ERR-009 /037 /038;CFG-030;CONF-008 /013 | ESLOT-SBX-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-012 ERROR -> `EV-SBX-ERROR-012`;ESLOT-SBX-015 AUDIT -> `EV-SBX-AUDIT-015`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-003~005 /010;MAIN-SEAM SUITE-005 /010;P0Q SUITE-013 | candidate升格或handoff回滚capture即不通过 |
| AC-SBX-018 | TC-SBX-CMD-009~012;CNS-015 /016;EVT-005 /006 | QRY-025 /026;EVT-015;CTR-006;CFG-030;CONF-008 /013 | ESLOT-SBX-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-SBX-007 READ -> `EV-SBX-READ-007`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-009 RELAY -> `EV-SBX-RELAY-009`;ESLOT-SBX-015 AUDIT -> `EV-SBX-AUDIT-015`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-001 /003~005 /009;MAIN-SEAM SUITE-005;OPS适用SUITE-012;P0Q SUITE-013 | audit / observability混层、rollback或raw泄漏即不通过 |
| AC-SBX-019 | TC-SBX-CMD-009~012;CNS-013~016 /021 /022;EVT-004~006 /015;JOB-004 | JOB-001;TXN-008~011;CONF-008 /011 /012 | ESLOT-SBX-005 EXECUTION -> `EV-SBX-EXECUTION-005`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-009 RELAY -> `EV-SBX-RELAY-009`;ESLOT-SBX-010 REPLAY -> `EV-SBX-REPLAY-010`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-004~007 /009;MAIN-SEAM SUITE-005;OPS SUITE-012;P0Q SUITE-013 | 第二回收链、重建payload或downstream反写即不通过 |
| AC-SBX-020 | TC-SBX-CMD-013~016;STA-016 | ERR-001~038适用;QRY failure surface;CONF-002 /005 /007 /008 | ESLOT-SBX-006 SAFETY -> `EV-SBX-SAFETY-006`;ESLOT-SBX-007 READ -> `EV-SBX-READ-007`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-012 ERROR -> `EV-SBX-ERROR-012`;ESLOT-SBX-017 QUAL-BOUNDARY -> `EV-SBX-QUAL-BOUNDARY-017`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-002 /004 /010 /011;MAIN-SEAM SUITE-010;OPS SUITE-010 /012适用;P0Q SUITE-013 | unknown伪成功、error不闭合或真实失败不可分类即不通过 |
| AC-SBX-021 | TC-SBX-CMD-019 /020;CNS-019 /020;STA-019 | ERR-011;JOB-007;CFG-030;CONF-010 /012 /013 | ESLOT-SBX-006 SAFETY -> `EV-SBX-SAFETY-006`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-012 ERROR -> `EV-SBX-ERROR-012`;ESLOT-SBX-015 AUDIT -> `EV-SBX-AUDIT-015`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-002~006 /010;OPS SUITE-012;P0Q SUITE-013 | advisory-only、auto-release或真实containment缺失即不通过 /候选VETO |
| AC-SBX-022 | TC-SBX-CMD-013~020;CNS-017~022;EVT-007~010 /015;JOB-001 /005~007 | TXN-007~011;CTR-006;CFG-030;CONF-007~010 | ESLOT-SBX-006 SAFETY -> `EV-SBX-SAFETY-006`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-009 RELAY -> `EV-SBX-RELAY-009`;ESLOT-SBX-010 REPLAY -> `EV-SBX-REPLAY-010`;ESLOT-SBX-015 AUDIT -> `EV-SBX-AUDIT-015`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-001 /003~007 /009 /010;MAIN-SEAM SUITE-005 /010 /011适用;OPS SUITE-012;P0Q SUITE-013 | 非happy path无owner事实 /safe audit或材料先删即不通过 |
| AC-SBX-023 | TC-SBX-CMD-017 /018;CNS-011 /012 /019 /020;STA-007~009 /018;JOB-005 /006 | RACE-012;CFG-022;ERR-010;CONF-009 /011 /012 | ESLOT-SBX-003 BOUNDARY -> `EV-SBX-BOUNDARY-003`;ESLOT-SBX-006 SAFETY -> `EV-SBX-SAFETY-006`;ESLOT-SBX-008 PROTOCOL -> `EV-SBX-PROTOCOL-008`;ESLOT-SBX-011 CONSISTENCY -> `EV-SBX-CONSISTENCY-011`;ESLOT-SBX-013 CONFIG -> `EV-SBX-CONFIG-013`;ESLOT-SBX-018 QUAL-LIFECYCLE -> `EV-SBX-QUAL-LIFECYCLE-018`;ESLOT-SBX-019 QUAL-IDENTITY -> `EV-SBX-QUAL-IDENTITY-019` | MAIN-CONTRACT SUITE-002~006 /009 /010;OPS SUITE-012;P0Q SUITE-013 | orphan脱管、guard bypass、fake release或无disposition即不通过 /候选VETO |

### 3.1 Report展开规则

上表的`MAIN-CONTRACT SUITE-004`必须展开为:

```text
reports/runs/<main_contract_run_id>/suites/SUITE-SBX-004.md
artifacts/test/<main_contract_run_id>/suites/SUITE-SBX-004/report.json
artifacts/test/<main_contract_run_id>/suites/SUITE-SBX-004/cases/<tc_id>/<parameter_id>.json
```

其他role / suite同理。每项还必须从RELEASE `evidence-index.md`定位exact evidence item detail并验证:

- `evidence_slot_id`与本表planned slot一致。
- slot的全部适用producer suite / source role按正式catalog齐全;本表主要入口不是producer裁剪白名单。
- `suite_refs`,`tc_refs`,`per_refs`,`cut_refs`,`ac_refs`包含本项正式完整ID,不是range / wildcard。
- evidence item、source context、suite report和case artifact digest一致。
- item来自本项要求的source role;P0-Q只能来自`<p0q_run_id>`且qualification identity完整。
- shared item只能按其exact TC / assertion证明本项,不得复制计数或泛化为18项全部通过。

---

## 4. 逐项追溯自检

| 自检项 | 当前设计结论 |
|---|---|
| FR-SBX-001~018是否各出现一次为主owner | 是,18 /18 |
| AC-SBX-006~023是否各出现一次为主owner | 是,18 /18 |
| 每项是否有正式对象 / flow | 是 |
| 每项是否有正向与负向TC | 是;资格项另有CONF / identity补强 |
| 每项是否有planned slot与future runtime form | 是;均显式标注未分配 |
| 每项是否有source suite report与RELEASE入口 | 是;路径使用未来role占位符 |
| P0-Q是否被低profile / fake替代 | 否 |
| 是否创建真实run、EV、report或结果 | 否 |
