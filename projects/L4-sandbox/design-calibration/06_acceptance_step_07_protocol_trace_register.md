# Step 7 分件 A. 55协议逐项验收登记

> 父Step: `06_acceptance_step_07_interfaces_events_sync.md`
> 同步 /停审分件: `06_acceptance_step_07_sync_review_register.md`
> 正式来源: `03-详细设计.md` §7 /§8;`03_ddd_step_08_protocol_contracts.md`;`05-测试方案.md` §6 /§9 /§13
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_8
> 本分件口径: `PG-SBX-001~055`是协议验收检查索引,不是新需求AC、TC、PER、ESLOT、EV、VETO或实现编号。每行逐项绑定exact formal protocol、surface、字段、正负TC、planned evidence、fixed source和裁决影响;当前只形成验收设计,不表示协议已实现、执行或通过。

---

## 1. 登记规则

### 1.1 编号与总数

| 协议族 | PG范围 | 数量 | Primary suite |
|---|---:|---:|---|
| Command | PG-SBX-001~010 | 10 | SUITE-SBX-004 /011 |
| Query | PG-SBX-011~023 | 13 | SUITE-SBX-004 /011 |
| Inbound Event Consumer | PG-SBX-024~032 | 9 | SUITE-SBX-005 /011 |
| Outbound Event | PG-SBX-033~045 | 13 | SUITE-SBX-005 /011 |
| Operations Job | PG-SBX-046~055 | 10 | SUITE-SBX-006 /011;OPS SUITE-012适用 |
| 合计 | PG-SBX-001~055 | 55 | 55项均必须独立定位 |

### 1.2 逻辑surface与transport边界

| 类别 | 稳定surface | 本登记使用 | 禁止写入 |
|---|---|---|---|
| Command | `Command/<FormalName>` | formal name + request / result DTO | HTTP path、RPC method、SDK product name |
| Query | `Query/<FormalName>` | formal name + selector / view / marker / page | HTTP path、repository query或DB selector |
| Consumer | `InboundEvent/<FormalName without Consume>` | formal consumer + envelope / payload / receipt | bus topic、queue、ack产品 |
| Outbound | `OutboundEvent/<FormalName>` | event kind + typed payload + source cursor | transport topic;只允许校验13-key binding完整性 |
| Job | `Job/<FormalName>` | typed input spec + public report | executable / cron / queue / scheduler product |

### 1.3 共用证据缩写

下表仅是本文阅读缩写,正式artifact必须保存完整ID和路径,不得保存缩写。

| 缩写 | 正式含义 |
|---|---|
| `P08` | `ESLOT-SBX-008 PROTOCOL` -> future `EV-SBX-PROTOCOL-008` |
| `P09` | `ESLOT-SBX-009 RELAY` -> future `EV-SBX-RELAY-009` |
| `P10` | `ESLOT-SBX-010 REPLAY` -> future `EV-SBX-REPLAY-010` |
| `P16` | `ESLOT-SBX-016 ARCH` -> future `EV-SBX-ARCH-016` |
| `MC-04` | MAIN-CONTRACT / SUITE-SBX-004 / `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-004.md` |
| `MC-05` | MAIN-CONTRACT / SUITE-SBX-005 / `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-005.md` |
| `MC-06` | MAIN-CONTRACT / SUITE-SBX-006 / `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-006.md` |
| `MC-11` | MAIN-CONTRACT / SUITE-SBX-011 / `reports/runs/<main_contract_run_id>/suites/SUITE-SBX-011.md` |
| `MS-05` | MAIN-SEAM / SUITE-SBX-005 / `reports/runs/<main_seam_run_id>/suites/SUITE-SBX-005.md` |
| `MS-11` | MAIN-SEAM / SUITE-SBX-011 / `reports/runs/<main_seam_run_id>/suites/SUITE-SBX-011.md` |
| `OPS-12` | OPS / SUITE-SBX-012 / `reports/runs/<ops_run_id>/suites/SUITE-SBX-012.md` |

所有协议还必须出现在`reports/runs/<main_contract_run_id>/protocol-inventory.md`和RELEASE evidence item / index中。只有真实pairing合法时才分配future EV;当前没有EV实例。

---

## 2. Command逐项登记

Command共用通过谓词: exact request DTO和`SandboxCommandMetadataDto`进入正式service;必填字段缺失走formal reject / pending / fail-closed;accepted / rejected / failed均保存完整`SandboxCommandResultDto`;same digest duplicate返回stored result且mutation / resolver / adapter不重跑。

Command共用失败谓词: 协议缺失 /改名、metadata / scope / digest / idempotency旁路、非法输入形成Accepted、result缺primary / affected / audit / stored refs、duplicate重跑或raw external body进入任一carrier。目标实现仓 / required harness不存在为`Blocked`,不等于Fail或Pass。

| PG | Formal protocol / logical surface | Exact request -> result surface | 正向TC | 关键负向TC | Planned evidence / fixed source | Canonical AC /裁决影响 |
|---|---|---|---|---|---|---|
| PG-SBX-001 | `OpenControlledExecutionContext`;`Command/OpenControlledExecutionContext` | `metadata`,`execution_source_refs`,`responsibility_context`,`context_ref_summary_set`,`intake_guard_ref` -> context / environment identity / resolution refs + intake status | TC-SBX-CMD-001 | TC-SBX-CMD-002;CNS / replay supporting | P08 + P10;MC-04 / MC-11 | AC-SBX-006~008;缺identity / guard或旁路formal intake阻断 |
| PG-SBX-002 | `EstablishExecutionBoundary`;`Command/EstablishExecutionBoundary` | `metadata`,`context_ref`,`environment_identity_ref`,`boundary_requirements`,`backend_capability_summary_ref`;builder-bound profile / template / generation -> coherent boundary / decision / handle / lease refs | TC-SBX-CMD-003 | TC-SBX-CMD-004;CONF-001~006 supporting | P08;boundary / qualification slots supporting;MC-04 / MC-11 | AC-SBX-009~011;policy不得成为boundary前置;partial / weak fallback、错误identity或mixed generation阻断,P0-Q仍独立 |
| PG-SBX-003 | `EvaluatePolicyExecution`;`Command/EvaluatePolicyExecution` | `metadata`,`context_ref`,`boundary_requirement_ref`,`policy_source_refs`,`authorization_summary`,`high_risk_action_markers` -> policy decision / snapshot / high-risk refs | TC-SBX-CMD-005 | TC-SBX-CMD-006 /008 | P08;policy / error supporting;MC-04 / MC-11 | AC-SBX-012~015;missing / stale / unsafe仍allow阻断 |
| PG-SBX-004 | `StartControlledExecutionRun`;`Command/StartControlledExecutionRun` | `metadata`,`context_ref`,`coherent_boundary_ref`,`handle_ref`,`policy_decision_ref`,`launch_request_summary` -> run ref / status / relay refs | TC-SBX-CMD-007 | TC-SBX-CMD-008 | P08;execution / qualification supporting;MC-04 / MC-11 | AC-SBX-013 /016;非Accepted前置仍launch、进入tool semantics / agent loop或raw launch body阻断 |
| PG-SBX-005 | `RecordCaptureResult`;`Command/RecordCaptureResult` | `metadata`,`run_ref`,`execution_output_summary`,`captured_material_refs`,`observability_material`,`capture_failure_reason` -> capture / material / observability refs + status | TC-SBX-CMD-009 | TC-SBX-CMD-010 | P08;execution / audit supporting;MC-04 / MC-11 | AC-SBX-016~019;partial / failed伪Complete、artifact truth升格或raw output阻断 |
| PG-SBX-006 | `OpenMaterialHandoff`;`Command/OpenMaterialHandoff` | `metadata`,`capture_fact_ref`,`captured_material_refs`,`observability_material_ref`,`handoff_target_refs` -> handoff / relay refs + pending / degraded / failed | TC-SBX-CMD-011 | TC-SBX-CMD-012 | P08 + P09;MC-04 / MC-11;MS-05 / MS-11及OPS-12按handoff补强 | AC-SBX-017~019;target错配、伪Delivered或失败回滚capture阻断 |
| PG-SBX-007 | `SubmitSandboxControl`;`Command/SubmitSandboxControl` | `metadata`,`context_ref`,`control_kind`,`control_source_context`,`control_conflict_guard_ref` -> control / optional failure refs + stored result | TC-SBX-CMD-013 | TC-SBX-CMD-014 | P08 + P10;MC-04 / MC-11 | AC-SBX-020 /022;第二control truth、terminal重开或直接runtime recovery阻断 |
| PG-SBX-008 | `ClassifySandboxFailure`;`Command/ClassifySandboxFailure` | `metadata`,`context_ref`,`run_ref`,`failure_source_markers`,`policy_decision_ref`,`capture_fact_ref` -> failure ref / status / relay refs | TC-SBX-CMD-015 | TC-SBX-CMD-016 | P08;safety / error supporting;MC-04 / MC-11 | AC-SBX-020 /022;Unknown伪success、source错配或raw backend error阻断 |
| PG-SBX-009 | `EvaluateCleanupReadiness`;`Command/EvaluateCleanupReadiness` | `metadata`,`context_ref`,`capture_fact_ref`,`handoff_fact_ref`,`investigation_handoff_summary`,`cleanup_safety_guard_ref` -> cleanup guard / projection refs | TC-SBX-CMD-017 | TC-SBX-CMD-018 | P08;safety / lifecycle supporting;MC-04 / MC-11;OPS-12 supporting | AC-SBX-022 /023;missing evidence仍Allowed或command直接release阻断 |
| PG-SBX-010 | `RecordRedlineContainment`;`Command/RecordRedlineContainment` | `metadata`,`context_ref`,`coherent_boundary_ref`,`redline_kind`,`redline_containment_guard_ref`,`investigation_handoff_summary` -> containment / optional failure refs | TC-SBX-CMD-019 | TC-SBX-CMD-020 | P08;safety / audit / qualification supporting;MC-04 / MC-11;OPS-12 supporting | AC-SBX-021 /022;advisory-only、guard缺失仍Released或raw detector body阻断 |

Command family result:10 /10协议具有独立surface、字段、正负TC、planned evidence和裁决影响;设计停审见同步 /停审分件。

---

## 3. Query逐项登记

Query共用通过谓词: exact selector映射正式`SandboxQueryResponseDto<T>`或paged response;visible / empty / not-visible / restricted / stale / degraded / failed / rebuilding / disabled / missing projection按协议适用;view / marker / cursor来源一致;write UoW、refresh、repair、command / backend / handoff调用为0。

Query共用失败谓词: selector不支持却scan truth store /拼ref、restricted泄漏view、stale / missing伪fresh、page cursor与truth cursor混用、query创建truth / projection / failure / report或调用mutation port。required read harness缺失为`Blocked`。

| PG | Formal protocol / logical surface | Selector -> exact view /关键字段 | 正向TC | 关键负向TC | Planned evidence / fixed source | Canonical AC /裁决影响 |
|---|---|---|---|---|---|---|
| PG-SBX-011 | `GetSandboxExecutionStatus`;`Query/GetSandboxExecutionStatus` | `context_ref` -> `SandboxExecutionStatusViewDto`:intake / identity / boundary / policy / run / cleanup / redline status | TC-SBX-QRY-001 | TC-SBX-QRY-002 | P08;read supporting;MC-04 / MC-11 | AC-SBX-007及相关功能read slice;restricted泄漏或write阻断 |
| PG-SBX-012 | `GetBoundaryStatus`;`Query/GetBoundaryStatus` | `context_ref?` / `boundary_ref?` -> `BoundaryStatusViewDto`:decision / requirement / capability / handle / lease refs | TC-SBX-QRY-003 | TC-SBX-QRY-004 | P08;boundary / read supporting;MC-04 / MC-11 | AC-SBX-009~011;unsupported direct selector scan或missing handle伪正常阻断 |
| PG-SBX-013 | `GetPolicyDecisionSummary`;`Query/GetPolicyDecisionSummary` | `context_ref?` / `policy_decision_ref?` -> decision / snapshot / high-risk / fail-closed markers | TC-SBX-QRY-005 | TC-SBX-QRY-006 | P08;policy supporting;MC-04 / MC-11 | AC-SBX-012~015;stale映射allow、读取policy body或refresh阻断 |
| PG-SBX-014 | `GetCaptureSummary`;`Query/GetCaptureSummary` | `run_ref?` / `capture_fact_ref?` -> capture status / body-free material / observability refs / safe reason | TC-SBX-QRY-007 | TC-SBX-QRY-008 | P08;execution / read supporting;MC-04 / MC-11 | AC-SBX-016 /018;缺capture时生成fact、读取artifact body或伪Complete阻断 |
| PG-SBX-015 | `GetMaterialHandoffStatus`;`Query/GetMaterialHandoffStatus` | `context_ref?` / `handoff_fact_ref?` -> capture / target / handoff / relay refs | TC-SBX-QRY-009 | TC-SBX-QRY-010 | P08;execution / relay supporting;MC-04 / MC-11 | AC-SBX-017 /019;query retry、拼handoff ref或改capture阻断 |
| PG-SBX-016 | `GetFailureControlStatus`;`Query/GetFailureControlStatus` | `context_ref?` / `failure_ref?` -> failure kind / status、control refs / latest status、lease status | TC-SBX-QRY-011 | TC-SBX-QRY-012 | P08;safety / read supporting;MC-04 / MC-11 | AC-SBX-020 /022;Unknown伪success、safe reason外泄或classify调用阻断 |
| PG-SBX-017 | `GetCleanupReadiness`;`Query/GetCleanupReadiness` | `context_ref?` / `cleanup_guard_ref?` -> guard status / blocking refs / capture / handoff / investigation refs | TC-SBX-QRY-013 | TC-SBX-QRY-014 | P08;safety / read supporting;MC-04 / MC-11 | AC-SBX-022 /023;query评估guard、release或missing projection伪Allowed阻断 |
| PG-SBX-018 | `GetRedlineContainmentStatus`;`Query/GetRedlineContainmentStatus` | `context_ref?` / `redline_containment_ref?` -> redline kind / status / boundary / investigation summary | TC-SBX-QRY-015 | TC-SBX-QRY-016 | P08;safety / read supporting;MC-04 / MC-11 | AC-SBX-021 /022;restricted泄漏、investigation call或query release阻断 |
| PG-SBX-019 | `GetSandboxReadProjection`;`Query/GetSandboxReadProjection` | `projection_ref?` / `context_ref?` -> projection status / nested execution view / source cursor | TC-SBX-QRY-017 | TC-SBX-QRY-018 | P08;ESLOT-007 READ;MC-04 / MC-11 | AC-SBX-018 /020~023适用;query rebuild、source /page cursor混同或scan阻断 |
| PG-SBX-020 | `GetDerivedInspectPreviewTrend`;`Query/GetDerivedInspectPreviewTrend` | `scope_ref`,`source_refs` -> derived state / kind / freshness / source refs / safe failure summary | TC-SBX-QRY-019 | TC-SBX-QRY-020 | P08;ESLOT-007 READ;MC-04 / MC-11 | derived功能slice;derived升格core / artifact truth、触发maintenance / failure阻断 |
| PG-SBX-021 | `GetBackendCapabilityComparison`;`Query/GetBackendCapabilityComparison` | `scope_ref`,`backend_profile_refs` -> comparison / capability refs / unsupported limit kinds / freshness | TC-SBX-QRY-021 | TC-SBX-QRY-022 | P08;read / architecture supporting;MC-04 / MC-11 | AC-SBX-009~011 supporting;stale仍资格 / allow、query refresh / establish阻断 |
| PG-SBX-022 | `GetSandboxReconciliationReport`;`Query/GetSandboxReconciliationReport` | `report_ref?` / `scope_ref?` -> report status / finding refs / generated_at | TC-SBX-QRY-023 | TC-SBX-QRY-024 | P08;ESLOT-007 READ;MC-04 / MC-11;OPS-12 supporting | safety / reconciliation read slice;query run / repair / latest scan阻断 |
| PG-SBX-023 | `GetSandboxAuditTrace`;`Query/GetSandboxAuditTrace` | `subject_ref`,`trace_kind_filter?`,page -> paged trace / subject / operation / occurred / source cursor | TC-SBX-QRY-025 | TC-SBX-QRY-026 | P08;ESLOT-015 AUDIT;MC-04 / MC-11 | AC-SBX-018 /022;invalid cursor泄漏、query append或raw audit body阻断 |

Query family result:13 /13协议具有独立selector、view / marker、正负TC和zero-write裁决;状态 /事务层面的write audit由Step 8继续加严。

---

## 4. Inbound Event Consumer逐项登记

Consumer共用通过谓词: `SandboxInboundEventEnvelopeDto<T>`的event / source / schema / dedup / trace / digest / forbidden markers完整;source authority可信且不绕gate;accepted / duplicate / delayed / rejected / failed / quarantined / no-op均保存typed receipt;duplicate返回stored receipt且mapping / resolver / command / mutation不重跑。

Consumer共用失败谓词: invalid / unsupported / untrusted / body-bearing envelope仍解析或写业务对象、same key different digest不冲突、duplicate二写、receipt重算、external feedback创建核心success或反写source truth。required fake consumer entry不存在为`Blocked`。

| PG | Formal consumer / logical surface | Typed payload关键字段 -> owning write / receipt | 正向TC | 关键负向TC | Planned evidence / fixed source | Canonical AC /裁决影响 |
|---|---|---|---|---|---|---|
| PG-SBX-024 | `ConsumeCallerContextReferenceChanged`;`InboundEvent/CallerContextReferenceChanged` | changed refs / change kind / safe summaries / reference version -> reference state + projection stale / receipt | TC-SBX-CNS-005 | TC-SBX-CNS-006;CNS-001~004共用 | P08 + P10;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-006~008 supporting;caller正文、猜context truth或duplicate二写阻断 |
| PG-SBX-025 | `ConsumePolicySummaryChanged`;`InboundEvent/PolicySummaryChanged` | policy refs / affected contexts / applicability / safe summaries -> policy reference state + stale marker | TC-SBX-CNS-007 | TC-SBX-CNS-008;CNS-001~004 | P08 + P10;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-012 /014 /015;body / stale使decision变Accepted或触发run阻断 |
| PG-SBX-026 | `ConsumeBackendCapabilitySummaryChanged`;`InboundEvent/BackendCapabilitySummaryChanged` | backend profile / capability summary / limit kinds / freshness -> capability reference + comparison stale | TC-SBX-CNS-009 | TC-SBX-CNS-010;CNS-001~004 | P08 + P10;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-009~011 supporting;consumer建立boundary、default allow或host fallback阻断 |
| PG-SBX-027 | `ConsumeIsolationBackendLifecycleSignal`;`InboundEvent/IsolationBackendLifecycleSignal` | handle / backend profile / lifecycle / lease / safe reason -> lifecycle / orphan / failure marker | TC-SBX-CNS-011 | TC-SBX-CNS-012;CNS-001~004 | P08 + P10;safety / qualification supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-020 /022 /023;unknown handle造success、错identity或直接release阻断 |
| PG-SBX-028 | `ConsumeMaterialHandoffStatusChanged`;`InboundEvent/MaterialHandoffStatusChanged` | handoff / target / status / delivery marker / reason -> matched handoff transition / receipt | TC-SBX-CNS-013 | TC-SBX-CNS-014;CNS-001~004 | P08 + P10;execution / relay supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-017 /019;target错配、terminal重开或capture回滚阻断 |
| PG-SBX-029 | `ConsumeObservabilityHandoffStatusChanged`;`InboundEvent/ObservabilityHandoffStatusChanged` | observability material / handoff / status / reason -> observability handoff marker / receipt | TC-SBX-CNS-015 | TC-SBX-CNS-016;CNS-001~004 | P08 + P10;execution / audit supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-018 /019;raw telemetry、伪造ref或宣称observability store truth阻断 |
| PG-SBX-030 | `ConsumeSandboxControlRequested`;`InboundEvent/SandboxControlRequested` | context / control kind / source context / expected version -> formal `SubmitSandboxControl` path / receipt | TC-SBX-CNS-017 | TC-SBX-CNS-018;CNS-001~004 | P08 + P10;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-008 /015 /022;绕command idempotency / conflict guard、直调runtime adapter阻断 |
| PG-SBX-031 | `ConsumeInvestigationHandoffStatusChanged`;`InboundEvent/InvestigationHandoffStatusChanged` | redline? / cleanup? / investigation summary / reason -> investigation marker + guard re-evaluation eligibility | TC-SBX-CNS-019 | TC-SBX-CNS-020;CNS-001~004 | P08 + P10;safety supporting;MC-05 / MC-11;MS-05 / MS-11;OPS-12 supporting | AC-SBX-021~023;feedback直接Allowed / Released或外部正文入仓阻断 |
| PG-SBX-032 | `ConsumeSandboxTruthRelayFeedback`;`InboundEvent/SandboxTruthRelayFeedback` | relay record / publisher outcome / feedback marker / reason -> versioned relay status / receipt | TC-SBX-CNS-021 | TC-SBX-CNS-022;CNS-001~004 | P08 + P09 + P10;MC-05 / MC-11;MS-05 / MS-11;OPS-12 | AC-SBX-019 /022;terminal重开、新relay或source truth回滚阻断 |

Consumer family result:9 /9协议具有独立payload、accepted / negative TC、receipt / replay和source authority裁决。

---

## 5. Outbound Event逐项登记

Outbound共用通过谓词: `SandboxOutboundEventEnvelopeDto<T>`和exact typed payload family匹配;payload来自同一accepted transaction保存的canonical body-free snapshot或正式maintenance state;`source_truth_ref`,`source_cursor`,`payload_ref`,`audit_trace_ref`可回链;relay append与publish分离;publish failure只改relay状态。

Outbound共用失败谓词: 缺canonical payload仍append / publish、kind / payload family错配、publish时从current truth重建、使用page cursor / timestamp替source cursor、携带raw external / SDK / output body、publisher failure回滚source truth。13 formal key缺启用binding导致启动仍成功时失败;真实topic本Step不要求。

| PG | Formal event / logical surface | Exact payload关键字段 / source | 正向TC | 关键负向TC | Planned evidence / fixed source | Canonical AC /裁决影响 |
|---|---|---|---|---|---|---|
| PG-SBX-033 | `SandboxExecutionContextChanged`;`OutboundEvent/SandboxExecutionContextChanged` | context / identity / resolution / intake status / audit trace;source=context truth | TC-SBX-EVT-001 | EVT-014 /015共用 | P08 + P09;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-006~008 supporting;caller body、缺source或publish回滚context阻断 |
| PG-SBX-034 | `SandboxBoundaryChanged`;`OutboundEvent/SandboxBoundaryChanged` | context / boundary? / decision / status / handle? / lease?;source=boundary decision | TC-SBX-EVT-002 | EVT-014 /015 | P08 + P09;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-009~011;partial写coherent、raw backend outcome或source rollback阻断 |
| PG-SBX-035 | `SandboxPolicyDecisionChanged`;`OutboundEvent/SandboxPolicyDecisionChanged` | context / decision / snapshot or fail-closed marker / high-risk refs;source=policy decision | TC-SBX-EVT-003 | EVT-014 /015 | P08 + P09;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-012~015;stale写Accepted、DSL / approval body或missing fail-closed marker阻断 |
| PG-SBX-036 | `SandboxRunChanged`;`OutboundEvent/SandboxRunChanged` | context / run / handle / run status / lifecycle marker;source=run truth | TC-SBX-EVT-004 | EVT-014 /015 | P08 + P09;execution supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-016 /019;tool command / agent loop正文、failed伪completed或rollback阻断 |
| PG-SBX-037 | `SandboxCaptureChanged`;`OutboundEvent/SandboxCaptureChanged` | run / capture / status / material / observability refs;source=capture truth | TC-SBX-EVT-005 | EVT-014 /015 | P08 + P09;execution / audit supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-016~019;output正文、failed有material伪Complete或handoff反写阻断 |
| PG-SBX-038 | `SandboxMaterialHandoffChanged`;`OutboundEvent/SandboxMaterialHandoffChanged` | handoff / capture / targets / status / relay ref;source=handoff truth | TC-SBX-EVT-006 | EVT-014 /015 | P08 + P09;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-017 /019;宣称artifact / obs truth、target空或capture回滚阻断 |
| PG-SBX-039 | `SandboxFailureChanged`;`OutboundEvent/SandboxFailureChanged` | context / failure / kind / status / source markers;source=failure truth | TC-SBX-EVT-007 | EVT-014 /015 | P08 + P09;safety supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-020 /022;Unknown伪success、raw stack / SDK或改run历史阻断 |
| PG-SBX-040 | `SandboxControlChanged`;`OutboundEvent/SandboxControlChanged` | context / control fact / kind / status / source marker;source=control truth | TC-SBX-EVT-008 | EVT-014 /015 | P08 + P09;safety supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-022;operator正文、event执行control副作用或source rollback阻断 |
| PG-SBX-041 | `SandboxCleanupChanged`;`OutboundEvent/SandboxCleanupChanged` | context / guard / status / blocking refs / handoff?;source=cleanup guard | TC-SBX-EVT-009 | EVT-014 /015 | P08 + P09;safety supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-022 /023;payload把Allowed当Released、缺evidence仍完成或rollback阻断 |
| PG-SBX-042 | `SandboxRedlineContainmentChanged`;`OutboundEvent/SandboxRedlineContainmentChanged` | context / containment / kind / status / investigation ref;source=redline truth | TC-SBX-EVT-010 | EVT-014 /015 | P08 + P09;safety / audit supporting;MC-05 / MC-11;MS-05 / MS-11 | AC-SBX-021 /022;advisory伪Contained、Released无guard或source rollback阻断 |
| PG-SBX-043 | `SandboxProjectionChanged`;`OutboundEvent/SandboxProjectionChanged` | projection / status / affected truth refs / source cursor;source=projection state | TC-SBX-EVT-011 | EVT-014 /015 | P08 + P09;read supporting;MC-05 / MC-11;MS-05 / MS-11;OPS-12 supporting | derived / read slice;dump projection body、从view重建truth或cursor混同阻断 |
| PG-SBX-044 | `SandboxDerivedViewChanged`;`OutboundEvent/SandboxDerivedViewChanged` | derived state / kind / freshness / source refs / failure summary;source=derived state | TC-SBX-EVT-012 | EVT-014 /015 | P08 + P09;read supporting;MC-05 / MC-11;MS-05 / MS-11;OPS-12 supporting | derived slice;preview正文、derived failure创建core failure或真相升格阻断 |
| PG-SBX-045 | `SandboxReconciliationFindingAvailable`;`OutboundEvent/SandboxReconciliationFindingAvailable` | report / scope / status / nonempty finding refs;source=reconciliation report | TC-SBX-EVT-013 | EVT-014 /015 | P08 + P09;read supporting;MC-05 / MC-11;MS-05 / MS-11;OPS-12 | reconciliation slice;Clean / Failed伪finding、event修truth或空finding publish阻断 |

Outbound family result:13 /13 event payload、source truth、common kind-family negative和relay no-rollback已逐项闭合;`transport_topic_bindings`只验13-key closed map,未发明topic。

---

## 6. Operations Job逐项登记

Job共用通过谓词: `SandboxJobInputDto<TSpec>`的job kind / scope / spec / page参与digest;正式selection port选择target;每项形成body-free item refs;partial / failed / skipped / degraded如实写`SandboxJobReportDto`;same digest duplicate返回完整stored report且selection / port / mutation调用0;不得修core truth。

Job共用失败谓词: invalid / partial伪Succeeded、failed不存report、item refs私造、job_run_ref作幂等key、different digest未冲突、duplicate重跑、maintenance / derived / report升格或修复core truth。required job entry / store / fake port缺失为`Blocked`。

| PG | Formal job / logical surface | Typed spec -> report item refs /边界 | 正向TC | 关键负向TC | Planned evidence / fixed source | Canonical AC /裁决影响 |
|---|---|---|---|---|---|---|
| PG-SBX-046 | `PublishSandboxEventRelay`;`Job/PublishSandboxEventRelay` | relay scope / status filter -> delivered / retryable / dead-letter / failed relay refs;publisher typed outcome | TC-SBX-JOB-001 | JOB-011 /012共用 | P08 + P09 + P10;MC-06 / MC-11;OPS-12 | AC-SBX-019 /022;terminal重发、source rollback或payload重建阻断 |
| PG-SBX-047 | `RefreshSandboxReferenceStates`;`Job/RefreshSandboxReferenceStates` | refresh scope / source kind filter -> refreshed refs / stale projections / failed refs | TC-SBX-JOB-002 | JOB-011 /012 | P08 + P10;read supporting;MC-06 / MC-11;OPS-12 supporting | AC-SBX-007 /012 /033 supporting;source version当cursor、修core truth或partial隐藏阻断 |
| PG-SBX-048 | `RefreshBackendCapabilitySummaries`;`Job/RefreshBackendCapabilitySummaries` | backend profile refs / capability scope -> summary / affected boundary / failed profile refs | TC-SBX-JOB-003 | JOB-011 /012 | P08 + P10;boundary / read supporting;MC-06 / MC-11;OPS-12 supporting | AC-SBX-009~011 supporting;job建立boundary /授权launch / default allow阻断 |
| PG-SBX-049 | `RetryPendingMaterialHandoffs`;`Job/RetryPendingMaterialHandoffs` | handoff scope / target kinds -> delivered / retryable / failed handoff refs | TC-SBX-JOB-004 | JOB-011 /012 | P08 + P10;execution / relay supporting;MC-06 / MC-11;OPS-12 | AC-SBX-017 /019;terminal重送、capture / material / guard回滚或假Delivered阻断 |
| PG-SBX-050 | `RunLeaseOrphanReaper`;`Job/RunLeaseOrphanReaper` | lease scope / safe reaper reason -> orphan / released lease / cleanup guard / failed lease refs | TC-SBX-JOB-005 | JOB-011 /012 | P08 + P10;safety / qualification supporting;MC-06 / MC-11;OPS-12 | AC-SBX-022 /023;绕guard release、raw inspect reason或fake Released阻断 |
| PG-SBX-051 | `EvaluatePendingCleanupGuards`;`Job/EvaluatePendingCleanupGuards` | cleanup scope / explicit include-blocked -> allowed / blocked / pending / failed guard refs | TC-SBX-JOB-006 | JOB-011 /012 | P08 + P10;safety supporting;MC-06 / MC-11;OPS-12 | AC-SBX-022 /023;job执行release、missing evidence伪Allowed或partial伪全成阻断 |
| PG-SBX-052 | `MaintainRedlineContainmentHandoffs`;`Job/MaintainRedlineContainmentHandoffs` | redline scope / status filter -> opened / released / terminal / failed redline refs | TC-SBX-JOB-007 | JOB-011 /012 | P08 + P10;safety / audit supporting;MC-06 / MC-11;OPS-12 | AC-SBX-021 /022;无investigation / cleanup guard release、containment降级或假成功阻断 |
| PG-SBX-053 | `RebuildSandboxReadProjections`;`Job/RebuildSandboxReadProjections` | projection scope / refs -> rebuilt / still stale / missing snapshot / failed refs | TC-SBX-JOB-008 | JOB-011 /012 | P08 + P10;ESLOT-007 READ;MC-06 / MC-11;OPS-12 | read slice;从旧view重建、写core truth、missing snapshot伪Fresh阻断 |
| PG-SBX-054 | `MaintainDerivedInspectPreviewTrend`;`Job/MaintainDerivedInspectPreviewTrend` | derived scope / kind filter -> rebuilt / stale / failed derived refs | TC-SBX-JOB-009 | JOB-011 /012 | P08 + P10;ESLOT-007 READ;MC-06 / MC-11;OPS-12 | derived slice;failure创建core `FailureClassification`、写policy / artifact truth阻断 |
| PG-SBX-055 | `RunSandboxReconciliation`;`Job/RunSandboxReconciliation` | reconciliation scope / target kinds -> report / finding / degraded / failed refs | TC-SBX-JOB-010 | JOB-011 /012 | P08 + P10;ESLOT-007 READ;MC-06 / MC-11;OPS-12 | reconciliation slice;自动修truth / projection、latest marker非原子或Degraded伪Clean阻断 |

Job family result:10 /10协议具有独立spec、report refs、主TC、all-job replay / invalid负向和no-repair裁决;事务 / race精确性留Step 8。

---

## 7. 55项planned evidence与source完整性审计

| 审计项 | 设计结论 |
|---|---|
| PG-SBX-001~055是否连续且唯一 | 是,55 /55,无重复 /断号 |
| 五族正式协议计数 | 10 /13 /9 /13 /10,与正式`03`和SUITE-SBX-011一致 |
| 每项是否有exact formal protocol和logical surface | 是 |
| 每项是否列正式字段 / view / payload / report重点 | 是;字段来自详细设计协议契约,未由验收新造 |
| 每项是否有正向与关键负向TC | 是;Command / Query成对,Consumer逐项+共用CNS-001~004,Event逐项+EVT-014 /015,Job逐项+JOB-011 /012 |
| 每项是否绑定P08 future form | 是;P09 / P10 /领域slot按适用补强 |
| 每项是否绑定fixed source / suite / report | 是;Command / Query MC,Consumer / Event MC+MS,Job MC+OPS适用 |
| 每项是否可定位case artifact | 是;按`artifacts/test/<run_id>/suites/<suite_id>/cases/<tc_id>/<parameter_id>.json` |
| 是否把planned slot写成真实EV | 否 |
| 是否允许inventory总数替代单项结果 | 否;55项均要求exact disposition |
| 是否把supporting slot提升为primary | 否;P08为协议primary,其他只按exact assertion补强 |
| 是否创建run / report / evidence / result | 否 |

---

## 8. 当前成熟度与执行限制

| 维度 | 当前事实 | 裁决限制 |
|---|---|---|
| 设计登记 | 55项完成 | 只可称`PassDesign`,不可称runtime Pass |
| 目标实现仓 | 不存在 | SUITE-004~006 /011和dependency inventory真实执行均Blocked |
| MAIN source runs | 不存在 | 不能分配EV-SBX-PROTOCOL-008或任何PG Pass |
| MAIN-SEAM | 不存在 | Consumer / Event controlled seam未执行 |
| OPS | 不存在 | Operations补强未执行 |
| P0-Q | candidate / lab / provider identity不存在 | backend相关qualification保持Blocked,不得由P08或seam替代 |
| 真实下游联合集成 | 未激活 | 保持NotEvaluated / conditional,不要求完整下游实现 |

---

## 9. 分件自检

| 自检项 | 结论 |
|---|---|
| 是否逐项登记55协议 | 是 |
| 是否存在五族摘要替代逐项 | 否 |
| 是否发明route / topic / job executable | 否 |
| 是否回指正式TC / slot / suite | 是 |
| 是否区分Pass / Fail / Blocked / NotEvaluated | 是,由父Step共用谓词控制 |
| 是否吞并状态 /事务 /证据完整性 | 否;Step 8 /10责任保留 |
| 是否发现协议级上游blocker | 未发现设计blocker;执行缺口已诚实记录 |
| 当前状态 | completed_reviewed_passed_to_step_8;用户确认只表示设计流程放行,不表示55协议runtime Passed |

---

## 10. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | 验收语义影响 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6协议闭环复核 | PG-SBX-002原把`policy_snapshot_ref`列为Boundary request字段。 | 移除policy字段,改为验收context / identity / explicit requirements / capability与builder-bound profile / template / generation的同代闭环。 | PG数量、TC、planned evidence和AC映射不变;新增明确失败条件为policy前置或mixed generation。 |
