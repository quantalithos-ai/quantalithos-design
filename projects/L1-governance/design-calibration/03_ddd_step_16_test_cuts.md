# Step 16. 测试切口与最小验证清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 16 测试切口与最小验证清单 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~15 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md` |
| 停审方式 | 按模块测试、接口测试、状态机测试、一致性/幂等测试、错误/配置/观测测试和脚本契约分批写入;完成后做跨 Step 5~15 测试入口审计 |

## 2. 本步目标

本 Step 为实现者和后续 `05-测试方案.md` 提供最小验证入口,确保详细设计中已经定义的对象、协议、flow、状态、事务、错误、幂等、配置和观测契约均能被测试覆盖。

实现侧必须能从本 Step 判断:

- 每个实现模块至少需要哪些单元测试 / service test / fake adapter test。
- 每个 Command、Query、Inbound Event、Outbound Event 和 Operations Job 至少需要哪些正向和异常测试切口。
- 每个正式状态机至少如何覆盖合法转换和非法转换。
- 事务、一致性、幂等、并发、duplicate replay、commit unknown 和 partial failure 如何验证。
- 日志、指标、审计、trace、redaction、config validation 和 forbidden body 如何验证。
- 哪些测试细节留给 `05-测试方案.md` 展开,避免在详细设计中写完整测试计划。

本步不定义完整测试矩阵、用例编号、优先级、覆盖率目标、fixture 目录结构、测试数据全集、CI job 分层、真实 durable store / broker / sibling repo 联调、报告模板、执行排期或验收 evidence 编号。这些由 `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块测试主轴 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定对象不变量、factory、state enum、trace/audit/history/outbox/handoff/report object 的单元测试入口 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 repository、port、adapter、UoW、Clock、IdGenerator、stored result、fake failure injection 测试入口 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 23 个 Command、14 个 Query、9 个 Inbound Consumer、12 个 Outbound Event、7 个 Operations Job 的协议测试入口 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定 accepted/rejected/duplicate/no-write/partial failure 的 application flow 测试入口 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定 23 组状态机、合法转换、非法转换和 query no-write 状态约束 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定 version、transaction、outbox snapshot、projection dependency index、reference scope index、stored result、handoff marker persistence 测试入口 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定错误映射、recovery、retry、dead-letter、missing result、rollback failure 和 unsupported version 测试入口 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 idempotency key/digest、duplicate replay、job replay、event dedup、commit unknown、concurrency guard 测试入口 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 固定 config validation、adapter availability、sibling dependency boundary、disabled/degraded/unavailable 测试入口 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 固定日志、指标、审计、trace/span、redaction 和 forbidden field 自动检查入口 |

## 4. 分批写入计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 16.1 | 文件骨架、SOP 问题回答、当前文档诊断、测试切口总图 | [x] 已写入 |
| 16.2 | 模块测试切口、Command 接口测试切口 | [x] 已写入 |
| 16.3 | Query / Inbound Event / Outbound Event / Operations Job 测试切口 | [x] 已写入 |
| 16.4 | 状态机、一致性 / 幂等 / 并发测试切口 | [x] 已写入 |
| 16.5 | 错误 / 配置 / 观测测试、脚本契约、前序审计和回填草稿 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个模块至少需要哪些单元测试? | `contracts` 测 DTO / ref / reason / event / job / receipt / view schema 和 roundtrip;`domain` 测对象 factory、不变量、policy、state matrix、trace/history/outbox/handoff object;`application` 测 command/query/consumer/job 编排、UoW、幂等、error mapping、副作用顺序;`infra` 测 repository version/page/unique/transaction、fake adapter failure injection、runtime builder/config validation;`api` 测 handler validation 和 protocol mapping;`worker` 测 inbound dedup/unsupported/rejected/delayed 与 outbox publish;`jobs` 测 job input validation、partial failure、report、duplicate replay 和 no truth repair。 |
| 每个接口至少需要哪些正向和异常测试? | 每个 Command 至少覆盖 accepted success、invalid request/domain reject、duplicate replay、idempotency conflict、version/repository conflict。每个 Query 至少覆盖 hit、missing、not visible、degraded/stale/failed surface、query no-write。每个 Inbound Event 至少覆盖 accepted、duplicate、unsupported version、rejected/delayed。每个 Outbound Event 至少覆盖 payload mapping、stored snapshot、forbidden body absent、publish failure marker。每个 Job 至少覆盖 completed、duplicate report replay、invalid input、partial failure、no business truth repair。 |
| 状态机合法转换和非法转换如何测试? | 以 Step 10 的正式 enum 和转换矩阵为唯一真相源。每组状态机至少覆盖一条主线合法转换、一条边界合法转换和一条非法转换。非法转换必须断言 Step 10 / Step 12 指定的 `DomainError`、`ApplicationError`、`WorkerError`、`JobError` 或 protocol surface,并断言不写 accepted trace、history、outbox、projection marker 或 stored success result。 |
| 事务、一致性、幂等和并发如何验证? | 使用 fake / in-memory repository、fake UoW、fake resolver、fake publisher、fake handoff/export adapter、fake clock/id generator 注入 version conflict、unique conflict、storage unavailable、result missing、commit unknown、rollback failure、same key same digest、same key different digest、publisher race、projection cursor race、reference refresh race、job partial failure 和 adapter disabled/unavailable。测试必须断言 truth、history、trace、audit、outbox、projection、reference、handoff marker、idempotency record、stored result/report 的写入顺序和 rollback / no-write 边界。 |
| 哪些测试细节应留给测试方案? | 具体 TC 编号、优先级、覆盖率目标、fixture 文件、数据生成器、真实外部依赖联调、durable store / bus / archive / external GRC 产品绑定、CI job 名称、报告模板、evidence 编号和执行排期留给 `05-测试方案.md`。本 Step 只定义最小测试切口。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 5 | 七个模块职责已闭合,但缺模块级测试入口 | 本 Step 固定 module / crate 测试切口 |
| Step 8 | 协议 schema 已闭合,但正向/异常测试入口分散 | 本 Step 汇总 Command、Query、Inbound/Outbound Event、Job 表 |
| Step 9 | Flow 已有测试提示,但缺全局最小清单 | 本 Step 把 accepted/rejected/duplicate/no-write/partial failure 映射成 test cut |
| Step 10 | 状态矩阵完整,但需要测试反查表 | 本 Step 为 23 组状态机列合法/非法测试入口 |
| Step 11~13 | 一致性、错误、幂等、并发散落在不同 Step | 本 Step 统一汇总 transaction / duplicate / conflict / replay / race / commit unknown |
| Step 14 | config / adapter 绑定清楚,但需要验证边界 | 本 Step 增加 config validation、forbidden configurable boundary、sibling dependency 检查 |
| Step 15 | 埋点字段边界清楚,但需要自动检查入口 | 本 Step 增加 redaction、low-cardinality metric、audit refs-only 检查 |

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 详细设计是否写完整测试方案 | A. 写完整测试计划;B. 只写最小测试切口 | 采用 B。避免替代 `05-测试方案.md` |
| 接口测试粒度 | A. 只按模块测试;B. 每个 public protocol 都列 test cut | 采用 B。满足关键协议正反向覆盖 |
| 状态机测试 | A. 只测 happy path;B. 合法和非法转换都测 | 采用 B。非法转换是可落码性关键 |
| duplicate replay | A. 从 current truth 重算;B. 验证 stored result/report/receipt replay | 采用 B。与 Step 11 / 13 一致 |
| fake adapter | A. 只模拟 success;B. 必须支持 failure injection | 采用 B。需要验证 delayed、rejected、partial failure、dead-letter |
| 观测测试 | A. 只检查日志存在;B. 检查 forbidden body 和低基数标签 | 采用 B。落实 Step 15 安全边界 |

## 8. 测试切口总图

```text
Step 5 module contracts
  -> module / crate test cuts
Step 8 protocol contracts + Step 9 function flows
  -> command / query / consumer / outbound event / job test cuts
Step 10 state matrix
  -> legal / illegal transition test cuts
Step 11-13 consistency, error and idempotency
  -> transaction / duplicate / conflict / replay / commit unknown / race test cuts
Step 14 config binding
  -> config validation / adapter availability / dependency boundary test cuts
Step 15 observability and audit
  -> log / metric / audit / trace / redaction / forbidden field test cuts
```

关键说明:

- 每个测试切口必须能反查至少一个 `design-calibration/03_ddd_step_*.md` 中间产物。
- 本 Step 不定义测试排期、优先级、覆盖率阈值或具体 fixture 文件结构。
- Query 测试必须额外断言 no-write,不得通过 query 触发 projection rebuild、resolver refresh、audit append 或 reconciliation repair。
- Job 测试必须额外断言 no business truth repair,不得让 maintenance job 静默修 core Governance truth。

## 9. 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | Step 8 `contracts` DTO | Command / Query / Event / Job / View / Error DTO roundtrip、required fields、schema version、enum/newtype 稳定性 | contract unit |
| `contracts_metadata_validation` | Step 8 metadata | Command idempotency key、Event dedup key、Job idempotency key、TraceContext 必填;Query 不携带 idempotency key | contract unit |
| `contracts_operation_digest_profile` | Step 13 key / digest schema | operation namespace、canonical digest、volatile metadata 排除、same digest / different digest 判定 | contract unit |
| `domain_object_invariants` | Step 6 object contracts | context、input、gate、decision、responsibility、policy、control、conclusion、nonconformity、trace、outbox、handoff object factory 和不变量 | domain unit |
| `domain_policy_accept_reject` | Step 6 policy contracts | context readiness、decision finalization、responsibility delegation、policy conflict、control coverage、compliance approval、nonconformity closure policy accept / reject | domain unit |
| `domain_state_matrix_transitions` | Step 10 state matrix | 23 组状态机合法 / 非法转换和错误 surface | domain / helper unit |
| `application_command_orchestration` | Step 9 command template | validate -> reserve -> load -> domain -> save truth/history/trace/audit/outbox/stale/result -> complete idempotency -> commit 顺序 | service test |
| `application_query_no_write` | Step 9 query template | Query 不开启 write UoW、不写 audit / outbox / idempotency / projection repair / reference refresh | query service |
| `application_consumer_orchestration` | Step 9 consumer template | envelope validation、dedup、unsupported version、snapshot/reference/stale/receipt、optional marker trace | service test |
| `application_job_orchestration` | Step 9 job template | job idempotency、per-item transaction、partial failure、stored report replay、no truth repair | service test |
| `application_error_mapping` | Step 12 error model | domain / repository / resolver / publisher / handoff / UoW / idempotency error 到 public protocol surface | service test |
| `infra_repository_semantics` | Step 7 / 11 repository | `Versioned<T>`、`GovernanceVersion`、unique key、page、dependency index、reference scope index、transaction rollback | repository fake |
| `infra_adapter_failure_injection` | Step 7 / 14 adapter | resolver、publisher、handoff、external GRC、clock、id generator 的 retryable / permanent / body rejected / digest mismatch failure injection | adapter fake |
| `infra_runtime_config_validation` | Step 14 config | `GovernanceRuntimeConfig` validation、adapter slot binding、topic map、forbidden configurable boundary | config test |
| `api_handler_protocol_mapping` | Step 8 / 9 API | handler required fields、actor context、metadata validation、protocol error mapping、no domain direct call | handler test |
| `worker_consumer_and_outbox` | Step 8 / 9 worker | inbound event intake、dedup、unsupported/rejected/delayed、outbox publish state update | worker test |
| `jobs_runner_contract` | Step 8 / 9 jobs | job metadata validation、scope/page handling、duplicate report replay、partial report、no business truth repair | job runner |
| `observability_and_redaction_contract` | Step 15 observability | logs / metrics / audit / report 不含 raw body、secret、credential、external response、archive package body | observability check |

## 10. Command 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `CreateGovernanceContext_contract` | `CreateGovernanceContextFlow` | context created;reference pending/ready branch;trace/audit/outbox/stale/result same UoW;duplicate replay;missing subject/source;resolver unavailable;outbox failure rollback | API + application |
| `SubmitGovernanceInput_contract` | `SubmitGovernanceInputFlow` | input received only;context missing / terminal context rejected;forbidden body;duplicate replay;no external body saved;no accepted / pending evidence branch | API + application |
| `UpdateGovernanceInputState_contract` | `UpdateGovernanceInputStateFlow` | accept/reject/wait/supersede transitions;required reason/ref validation;pending evidence ref from request;accept resolves pending evidence when present;terminal input reject;version conflict rollback | API + application |
| `OpenGovernanceGate_contract` | `OpenGovernanceGateFlow` | no requirement => final gate `Open` and `required_responsibility_ref = None`;with approver requirement => requirement/responsibility/chain saved, `ResponsibilityTraceRecord` appended with `responsibility-required` / `responsibility-assigned`, and final gate `PendingDecision` with created responsibility ref;context not ready rejected;duplicate;missing requirement;history/trace/outbox saved | API + application |
| `RecordGovernanceDecision_contract` | `RecordGovernanceDecisionFlow` | requires preexisting `PendingDecision` gate and never performs `Open -> PendingDecision`;decision proposed/finalized and gate attached;approve/reject/waive branch;basis evidence unresolved;chain not satisfied;version conflict | API + application |
| `SupersedeGovernanceDecision_contract` | `SupersedeGovernanceDecisionFlow` | current finalized decision superseded by next;same gate guard;next finalization branch;superseded current cannot supersede again | API + application |
| `AssignApprovalResponsibility_contract` | `AssignApprovalResponsibilityFlow` | responsibility required/assigned and chain updated;actor capability snapshot resolved;duplicate active actor;capability unavailable | API + application |
| `RecordApprovalVote_contract` | `RecordApprovalVoteFlow` | vote recorded;chain satisfied branch;wrong actor rejected;duplicate vote;terminal responsibility reject | API + application |
| `DelegateApprovalResponsibility_contract` | `DelegateApprovalResponsibilityFlow` | delegate transition;delegate snapshot resolved;delegation policy reject;released/terminal responsibility reject | API + application |
| `ActivatePolicyEffectiveFact_contract` | `ActivatePolicyEffectiveFactFlow` | policy fact activated;request `subject_ref` / `scope_ref` resolved through `resolve_scope_subject_relation`;method policy snapshot required;`policy_snapshot.scope_ref` matches request scope;relation `Mismatch` / `Unknown` and snapshot scope mismatch rejected before fact save;conflict detection marker;duplicate;method unavailable | API + application |
| `UpdatePolicyEffectiveFactState_contract` | `UpdatePolicyEffectiveFactStateFlow` | activate/suspend/supersede/retire;required reason;terminal retired reject;conflict re-evaluation stale views | API + application |
| `UpdateSharedRuleSet_contract` | `UpdateSharedRuleSetFlow` | draft/activate/add/deprecate/retire shared rules;request `subject_ref` / `scope_ref` resolved through `resolve_scope_subject_relation`;relation `Mismatch` / `Unknown` rejected before save;rule refs body-free;policy conflict detection;invalid rule ref | API + application |
| `ResolvePolicyConflict_contract` | `ResolvePolicyConflictFlow` | pending/resolve/waive/invalidate conflict;decision ref guard;wrong state reject;outbox/stale/result saved | API + application |
| `AssessControlApplicability_contract` | `AssessControlApplicabilityFlow` | applicability assessed/marked applicable/not applicable/excluded;method control snapshot required;evidence pending branch;duplicate | API + application |
| `RecordControlReview_contract` | `RecordControlReviewFlow` | review plan/start/pass/fail/waive/supersede;required evidence/decision refs;nonconformity-required flag;version conflict | API + application |
| `SubmitAIIAConclusion_contract` | `SubmitAIIAConclusionFlow` | AIIA draft/submit;artifact ref body-free;approval gate/decision branch;`resolve_artifact_ref(...)` unresolved / stale / unavailable / invalid / digest mismatch save-before rejected with no conclusion/history/outbox/stale;duplicate replays stored command rejection without resolver rerun | API + application |
| `SubmitSoAConclusion_contract` | `SubmitSoAConclusionFlow` | SoA draft/submit with control coverage ref;coverage missing;`resolve_artifact_ref(...)` unresolved / stale / unavailable / invalid / digest mismatch save-before rejected with no conclusion/history/outbox/stale;duplicate replays stored command rejection without resolver rerun;AIIA-only fields absent | API + application |
| `ApproveComplianceConclusion_contract` | `ApproveComplianceConclusionFlow` | approve/reject/revoke AIIA/SoA;decision guard;archive-required flag;terminal conclusion reject | API + application |
| `RaiseNonconformity_contract` | `RaiseNonconformityFlow` | nonconformity raised from context/evidence/runtime signal;source unresolved;duplicate active issue;trace handoff required flag | API + application |
| `ConfirmNonconformityCause_contract` | `ConfirmNonconformityCauseFlow` | cause confirmed;invalid state reject;cause ref/reason required;history/trace/outbox saved | API + application |
| `PlanCorrectiveAction_contract` | `PlanCorrectiveActionFlow` | corrective action planned and nonconformity enters correction;invalid owner;terminal nonconformity reject;duplicate action | API + application |
| `CompleteCorrectiveAction_contract` | `CompleteCorrectiveActionFlow` | start/complete/cancel/fail corrective action;required reason/evidence;ready-for-verification branch;version conflict | API + application |
| `VerifyNonconformity_contract` | `VerifyNonconformityFlow` | verification result created;passed closes nonconformity when policy allows;failed keeps open;invalid verification state reject | API + application |

## 11. Query 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GetGovernanceContext_query` | `GetGovernanceContextFlow` | context view hit;missing;not visible body-free surface;degraded reference;query no-write | query handler |
| `GetGovernanceInput_query` | `GetGovernanceInputFlow` | input view hit;pending evidence surface;missing;not visible;no resolver call | query handler |
| `GetGateDecision_query` | `GetGateDecisionFlow` | gate/decision summary hit;pending decision;decision missing degraded;not visible;query no-write | query handler |
| `ListPendingGovernanceDecisions_query` | `ListPendingGovernanceDecisionsFlow` | projection page hit;empty page;stale/failed/rebuilding surface;per-item visibility filter | query handler |
| `GetApprovalResponsibility_query` | `GetApprovalResponsibilityFlow` | responsibility view hit;chain summary;missing actor snapshot degraded;not visible | query handler |
| `GetPolicyEffectiveView_query` | `GetPolicyEffectiveViewFlow` | policy projection fresh;stale;method snapshot unavailable;query does not rebuild | query handler |
| `GetPolicyConflict_query` | `GetPolicyConflictFlow` | conflict truth summary hit;resolved/waived/invalidate surface;missing;not visible | query handler |
| `GetControlCoverage_query` | `GetControlCoverageFlow` | coverage complete/gap/pending evidence/stale;not visible;no nonconformity auto-create | query handler |
| `GetComplianceConclusion_query` | `GetComplianceConclusionFlow` | AIIA/SoA conclusion hit;artifact degraded;not visible;terminal state surface | query handler |
| `GetNonconformityStatus_query` | `GetNonconformityStatusFlow` | nonconformity projection hit;stale;missing action/verification degraded;not visible | query handler |
| `SearchGovernanceFacts_query` | `SearchGovernanceFactsFlow` | search result page;empty;visibility filtered items;failed projection surface;no raw body | query handler |
| `GetGovernanceTrace_query` | `GetGovernanceTraceFlow` | trace page;not visible trace redacted;empty page;no missing trace repair;no external body | query handler |
| `GetGovernanceDashboard_query` | `GetGovernanceDashboardFlow` | dashboard projection hit;stale/degraded;missing source;query no-write | query handler |
| `GetGovernanceReconciliationReport_query` | `GetGovernanceReconciliationReportFlow` | clean/has-finding/failed report view;missing report;query does not repair drift | query handler |

## 12. Inbound Event Consumer 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ConsumeIdentityActorCapabilityChanged_event` | `IdentityActorCapabilityChangedPayload` | actor capability snapshot + reference state saved;duplicate receipt replay;unsupported version no parse;missing actor snapshot rejected;affected views from repository | consumer |
| `ConsumeProcessGovernanceContextChanged_event` | `ProcessGovernanceContextChangedPayload` | process context ref + reference state saved;duplicate;unavailable source delayed;affected process/governance views stale;no process body persisted | consumer |
| `ConsumeWorkGovernanceContextChanged_event` | `WorkGovernanceContextChangedPayload` | work context ref + reference state saved;duplicate;unavailable source delayed;affected work/governance views stale;no work body persisted | consumer |
| `ConsumeArtifactEvidenceChanged_event` | `ArtifactEvidenceChangedPayload` | evidence summary ref + reference state saved;digest mismatch/body rejected;unsupported version;affected compliance/control views stale | consumer |
| `ConsumeMethodPolicyDefinitionChanged_event` | `MethodPolicyDefinitionChangedPayload` | method policy snapshot saved;duplicate;method unavailable;affected policy views stale;no policy body persisted | consumer |
| `ConsumeMethodControlDefinitionChanged_event` | `MethodControlDefinitionChangedPayload` | method control snapshot saved;duplicate;method unavailable;affected control coverage views stale;no control body persisted | consumer |
| `ConsumeRuntimeSignalRecorded_event` | `RuntimeSignalRecordedPayload` | runtime signal ref/reference state saved;optional pending input marker;duplicate;runtime body forbidden;dashboard stale | consumer |
| `ConsumeConversationContextChanged_event` | `ConversationContextChangedPayload` | source reference state / trace stale marker saved;duplicate;message body forbidden;affected trace/decision views stale | consumer |
| `ConsumeObservabilityAlertRaised_event` | `ObservabilityAlertRaisedPayload` | alert summary maps to runtime signal/source state or pending nonconformity marker;duplicate;alert body/stack trace forbidden | consumer |

## 13. Outbound Event 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GovernanceContextChanged_event_schema` | `GovernanceContextChangedPayload` | payload from accepted context/input truth;subject/source/input refs only;schema `v1`;stored snapshot equals outbox record kind/subject/trace | contract + publisher |
| `GateChanged_event_schema` | `GateChangedPayload` | gate/context/state/decision/responsibility refs;no process waiting body;publish failure marks outbox only | contract + publisher |
| `GovernanceDecisionChanged_event_schema` | `GovernanceDecisionChangedPayload` | decision/gate/outcome/basis refs and state from committed decision;no evidence body | contract + publisher |
| `ApprovalResponsibilityChanged_event_schema` | `ApprovalResponsibilityChangedPayload` | responsibility/chain/context/actor/vote refs only;no actor profile;stored snapshot publish | contract + publisher |
| `PolicyEffectiveFactChanged_event_schema` | `PolicyEffectiveFactChangedPayload` | policy fact scope/state/method snapshot refs including snapshot scope marker;no AIPolicyDef body | contract + publisher |
| `SharedRuleSetChanged_event_schema` | `SharedRuleSetChangedPayload` | rule set scope/state/rule refs;no rule expression/standard body | contract + publisher |
| `PolicyConflictChanged_event_schema` | `PolicyConflictChangedPayload` | conflict scope/state/policy refs/resolution ref;no policy body | contract + publisher |
| `ControlApplicabilityChanged_event_schema` | `ControlApplicabilityChangedPayload` | applicability/context/state/control snapshot/evidence ref;no control definition/evidence body | contract + publisher |
| `ComplianceConclusionChanged_event_schema` | `ComplianceConclusionChangedPayload` | conclusion/context/state/artifact/decision/coverage refs;no artifact/AIIA/SoA body | contract + publisher |
| `NonconformityChanged_event_schema` | `NonconformityChangedPayload` | nonconformity/action/verification refs and state;no work/evidence/runtime body | contract + publisher |
| `GovernanceTraceAvailable_event_schema` | `GovernanceTraceAvailablePayload` | trace subject/ref/kind and optional handoff marker;no observability span body | contract + publisher |
| `DerivedGovernanceViewChanged_event_schema` | `DerivedGovernanceViewChangedPayload` | view ref/freshness/source cursor/degraded marker;no projection body dump | contract + publisher |

## 14. Operations Job 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `PublishGovernanceOutbox_job` | `PublishGovernanceOutboxFlow` | pending batch from `list_pending_with_payload`;publish success;retryable failed marker;dead-letter;version conflict single-winner;duplicate report replay;truth unchanged | job runner |
| `RebuildGovernanceProjections_job` | `RebuildGovernanceProjectionsFlow` | rebuild selected projections from `GovernanceTruthSnapshot`;replace view/state/dependency index;partial failure report;duplicate report replay;no truth repair | job runner |
| `RefreshExternalContextSnapshots_job` | `RefreshExternalContextSnapshotsFlow` | `ExplicitRefs` / `UnhealthyReferences` / `GovernanceScope` expansion through tracked reference states;resolver success/failure;versioned save;affected views stale;duplicate replay | job runner |
| `RunGovernanceReconciliation_job` | `RunGovernanceReconciliationFlow` | clean report;finding report;failed report;report saved/readable;no inline repair of truth/projection/outbox | job runner |
| `PrepareGovernanceTraceHandoff_job` | `PrepareGovernanceTraceHandoffFlow` | non-empty trace refs;target disabled rejected;prepared/delivered/failed marker;package/receipt refs only;duplicate replay | job runner |
| `PrepareGovernanceArchiveHandoff_job` | `PrepareGovernanceArchiveHandoffFlow` | trace/report refs validation;archive target disabled;prepared/failed marker;no archive package body;partial report | job runner |
| `PrepareExternalGrcExport_job` | `PrepareExternalGrcExportFlow` | truth snapshot validation;external GRC disabled;marker trace created first;non-empty trace refs;package/receipt/failure refs only;no external document body | job runner |

## 15. 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `governance_context_state_transitions` | `GovernanceContextState` | `Draft/PendingReference -> Ready`;`Ready -> PendingReference`;`Invalid/Closed` terminal reject | domain unit |
| `governance_input_state_transitions` | `GovernanceInputState` | `Received -> Accepted/Rejected/PendingEvidence/Superseded`;terminal reject;pending evidence guard | domain unit |
| `gate_state_transitions` | `GateState` | `Open -> PendingDecision -> Decided`;`OpenGovernanceGate` no-requirement path stays `Open`, requirement path calls `request_decision_by_ref`;expire/cancel;decided gate cannot attach second decision | domain unit |
| `governance_decision_state_transitions` | `GovernanceDecisionState` | `Proposed -> Approved/Rejected/Waived`;finalized -> Superseded/Revoked;terminal guard | domain unit |
| `approval_responsibility_state_transitions` | `ApprovalResponsibilityState` | `Required -> Assigned -> Accepted/Voted/Delegated`;released/terminal reject | domain unit |
| `responsibility_chain_state_transitions` | `ResponsibilityChainState` | open/partially satisfied/satisfied/released;cannot vote after satisfied/released | domain unit |
| `policy_effective_state_transitions` | `PolicyEffectiveState` | proposed/active/suspended/superseded/retired transitions;scope mismatch rejects before propose / activate;retired terminal guard | domain unit |
| `shared_rule_set_state_transitions` | `SharedRuleSetState` | draft/active/deprecated/retired and add/deprecate rule guards | domain unit |
| `policy_conflict_state_transitions` | `PolicyConflictState` | detected/pending decision/resolved/waived/invalidated;resolved/waived terminal guard | domain unit |
| `control_applicability_state_transitions` | `ControlApplicabilityState` | assessed/applicable/not applicable/excluded/superseded;invalid evidence guard | domain unit |
| `control_review_state_transitions` | `ControlReviewState` | planned/in progress/passed/failed/waived/superseded;terminal guard | domain unit |
| `compliance_conclusion_state_transitions` | `ComplianceConclusionState` | draft/submitted/approved/rejected/superseded/revoked;wrong conclusion kind rejected | domain unit |
| `nonconformity_state_transitions` | `NonconformityState` | raised/cause confirmed/correction in progress/ready for verification/closed/reopened/rejected | domain unit |
| `corrective_action_state_transitions` | `CorrectiveActionState` | planned/in progress/completed/cancelled/failed;terminal guard | domain unit |
| `verification_state_transitions` | `VerificationState` | pending/passed/failed;passed can close nonconformity only through verified flow | domain unit |
| `derived_governance_view_freshness_transitions` | `DerivedGovernanceViewFreshnessState` | fresh/stale/rebuilding/failed/unavailable;query-triggered repair rejected | projection test |
| `reference_resolution_kind_transitions` | `ReferenceResolutionKind` | unresolved/stale/unavailable -> resolved;invalid/digest mismatch not resolved implicitly | reference test |
| `outbox_publication_state_transitions` | `OutboxPublicationState` | pending -> published/failed/dead-letter;failed -> pending retry;published/dead-letter terminal | outbox job / repository |
| `reconciliation_report_state_transitions` | `ReconciliationReportState` | generated/failed/superseded;report does not repair drift | job/report test |
| `handoff_marker_state_transitions` | `GovernanceHandoffState` | prepared -> delivered/failed;failed retry creates new marker;trace refs non-empty | handoff job |
| `job_report_state_transitions` | `GovernanceJobReportState` | completed/partially completed/failed;duplicate replay returns stored report | job runner |
| `idempotency_state_transitions` | `GovernanceIdempotencyState` | reserved -> completed/conflict;completed duplicate replay;conflict no mutation | idempotency fake |
| `runtime_entry_states` | `GovernanceAdapterAvailabilityState` / `GovernanceRuntimeBuildState` / API / worker / job dispositions | enabled/degraded/unavailable, runtime ready/failed, API not-visible/degraded, worker unsupported, job duplicate replay | infra / entry tests |

## 16. 一致性 / 幂等 / 并发测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_duplicate_same_key_same_digest` | Step 13 duplicate replay | 返回 stored command result;无新 truth、history、trace、audit、outbox、resolver call | application |
| `command_same_key_different_digest_conflict` | Step 13 idempotency conflict | 返回 conflict surface;不进入 domain transition;不写 accepted audit | application |
| `operation_namespace_isolation` | Step 13 operation namespace | 同 raw key 在不同 command / event / job operation 下不互相 duplicate | idempotency fake |
| `duplicate_result_missing_no_recompute` | Step 11 / 12 / 13 stored result | completed idempotency 指向 missing / wrong result kind 时返回 consistency error;不得从 current truth 重算 | application |
| `job_duplicate_same_key_replays_report` | Step 8 / 13 job duplicate | duplicate job 读取 stored job report;不重新 scan/publish/rebuild/handoff/export | jobs |
| `consumer_duplicate_replays_receipt` | Step 8 / 13 consumer duplicate | duplicate inbound event 读取 stored receipt/result;不重写 snapshot/stale marker | worker |
| `commit_unknown_same_key_recovery` | Step 12 / 13 commit unknown | retry same key 先读 idempotency/result store,不盲写第二次 truth | service + fake UoW |
| `stored_result_saved_before_idempotency_complete` | Step 11 ordering | result save 失败 rollback;idempotency complete 不可见 | repository fake |
| `idempotency_complete_failure_rolls_back` | Step 11 ordering | complete 失败时 truth/history/trace/outbox/result 不提交 | service + fake UoW |
| `outbox_enqueue_failure_rolls_back_truth` | Step 11 outbox consistency | outbox append / payload snapshot save failure rollback entire accepted command | service |
| `outbox_publisher_parallel_single_winner` | Step 13 publish concurrency | 两个 publisher 对同 outbox 只有一个 mark succeeds;另一方 version conflict / partial report | worker / repository |
| `projection_dependency_index_is_only_source` | Step 11 projection index | affected views 只能来自 `list_views_affected_by_*`;禁止 ad hoc view ref | application + repository |
| `projection_rebuild_race_preserves_newer_cursor` | Step 13 projection race | older cursor 不覆盖 newer fresh state;failed marker 不清除 newer state | projection fake |
| `reference_scope_list_uses_tracked_state` | Step 11 reference scope index | refresh scope 只列 tracked `ReferenceResolutionState`;不扫描 sibling body | reference fake |
| `reference_refresh_preserves_last_good_snapshot` | Step 12 / 13 reference failure | unavailable/digest mismatch/body rejected 不删除 last successful snapshot | reference fake |
| `handoff_marker_trace_refs_non_empty` | Step 9 / 11 handoff marker | trace/archive/external GRC marker 保存前必须有非空 trace refs | job runner |
| `external_grc_export_marker_trace_first` | Step 9 / 11 external GRC | export marker 创建前先追加 marker trace;empty trace refs rejected | job runner |
| `query_no_write_side_effects` | Step 9 query no-write | Query 不 begin write UoW、不调用 resolver、不修 projection/reference/audit | query service |
| `maintenance_job_no_truth_repair` | Step 9 job discipline | rebuild/refresh/reconciliation/handoff/export 不修改 core Governance truth | job runner |
| `rollback_failure_surfaces_manual_intervention` | Step 12 rollback failure | rollback failure 返回 temporary unavailable / diagnostic,不做隐藏补偿写 | service + fake UoW |

## 17. 错误 / 配置 / 观测测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `invalid_request_no_uow` | Step 8 / 12 protocol validation | missing metadata / actor / idempotency / required field 时不 begin UoW、不调用 application mutation | handler test |
| `domain_reject_no_success_trace` | Step 10 / 12 invalid transition | invalid state / policy reject 不写 success trace、history、outbox、stored accepted result | domain + service |
| `unsupported_event_version_no_parse` | Step 8 / 12 / 13 inbound version | unsupported version 不解析 payload、不写 snapshot、不 mark stale、不写 accepted trace | worker |
| `source_unavailable_mapping` | Step 12 / 14 dependency unavailable | command -> temporarily unavailable/rejected;consumer -> delayed;job -> partial/failed report | service + adapter fake |
| `digest_mismatch_and_body_rejected` | Step 12 / 15 body boundary | digest mismatch/body rejected 不写 resolved marker;logs/report 不含 raw body | consumer / job |
| `publisher_retryable_failure_marker` | Step 12 / 15 outbox recovery | retryable publish failure -> outbox failed marker + report;truth unchanged | worker |
| `publisher_dead_letter_marker` | Step 12 / 13 outbox dead-letter | fatal/exhausted publish failure -> dead-letter state;duplicate job does not republish terminal record | worker |
| `handoff_failure_marker_or_report` | Step 12 / 15 handoff recovery | handoff/export failure saves failed marker/report;no package/document body | job runner |
| `config_validation_fail_fast` | Step 14 / 15 config validation | invalid store/publisher/topic/handoff/external GRC binding fails with redacted issue | config test |
| `forbidden_boundary_not_configurable` | Step 14 config invariant | config cannot disable metadata、idempotency、visibility、audit/outbox、query no-write、job no-truth-repair、redaction | config test |
| `non_core_sibling_not_cargo_dependency` | Step 3 / 14 dependency boundary | 除 `core-contracts` 外 sibling repo 不进入 Cargo dependency | architecture check |
| `logs_do_not_include_forbidden_body` | Step 15 structured logs | logs 不含 raw request/event/adapter response、external body、secret、stack trace | observability check |
| `metrics_low_cardinality_labels` | Step 15 metrics | metric labels 不含 request ref、actor ref、subject ref、trace id、outbox id、free text、secret | observability check |
| `audit_uses_refs_only` | Step 15 audit | audit/history/trace/handoff marker 只记录 refs/state/reason/cursor/count;不保存 body | observability check |
| `redaction_scan_blocks_raw_secret` | Step 15 redaction | redaction checker 发现 raw secret、credential、external response、archive package body 时失败 | script check |

## 18. 脚本契约表

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | 源码、配置、fake / in-memory profile | `artifacts/test/<run_id>` | 非 0 exit code,保留 failure summary 到 artifact root |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 非 0 exit code,说明缺失 artifact 或报告生成失败 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root` / `--report-root` | artifacts + reports | `reports/runs/<run_id>/redaction-check.md` | 发现 raw body、external body、secret、token、credential、package body 时失败 |

脚本契约规则:

- 参数名必须与实现仓目录规范一致。
- artifact root 固定为 `artifacts/test/<run_id>`。
- report root 固定为 `reports/runs/<run_id>`。
- 脚本不得从静态 JSON 伪造 evidence / veto / report 结论;必须从真实 suite artifact 或显式输入报告生成。
- redaction check 只检查禁入字段和泄露风险;不替代功能测试。
- 完整 suite 分层、EV 编号、release gate、acceptance summary 留给 `05/06/07`。

## 19. 前序闭环审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 七个实现模块是否都有测试入口 | 通过 | §9 覆盖 `contracts/domain/application/infra/api/worker/jobs` |
| 23 个 Command 是否都有正向和异常切口 | 通过 | §10 逐项覆盖 |
| 14 个 Query 是否都有 hit/missing/not-visible/degraded/no-write 切口 | 通过 | §11 逐项覆盖 |
| 9 个 Inbound Consumer 是否都有 accepted/duplicate/unsupported/rejected/delayed 切口 | 通过 | §12 逐项覆盖 |
| 12 个 Outbound Event 是否都有 payload snapshot / forbidden body / publish failure 切口 | 通过 | §13 逐项覆盖 |
| 7 个 Operations Job 是否都有 success/duplicate/invalid/partial/no-truth-repair 切口 | 通过 | §14 逐项覆盖 |
| 状态机合法/非法转换是否有入口 | 通过 | §15 覆盖 Step 10 状态矩阵批次 |
| 一致性 / 幂等 / 并发是否有入口 | 通过 | §16 覆盖 duplicate、stored result、UoW、outbox、projection、reference、handoff、query no-write |
| 错误 / 配置 / 观测是否有入口 | 通过 | §17 覆盖 Step 12 / 14 / 15 |
| 是否越界替代测试方案 | 通过 | 只写最小 test cut,不写 TC 编号、优先级、覆盖率、fixture 目录或 CI 排期 |

## 20. 回填草稿

正式 `03-详细设计.md` §5.15 应回填:

- 本 Step §8 的测试切口总图。
- 本 Step §9 的模块测试切口汇总表。
- 本 Step §10~§14 的 Command / Query / Event / Job 接口测试切口。
- 本 Step §15 的状态机测试切口表。
- 本 Step §16 的一致性 / 幂等 / 并发测试切口表。
- 本 Step §17 的错误 / 配置 / 观测测试切口表。
- 本 Step §18 的脚本契约表。

回填时必须保留以下约束:

- 本 Step 不替代 `05-测试方案.md`;只提供最小验证入口。
- 每个关键协议至少有正向和异常测试切口。
- 状态机必须覆盖合法转换和非法转换。
- Query 测试必须断言 no-write。
- Job 测试必须断言 no business truth repair。
- Duplicate replay 必须断言 stored result/report/receipt,不得从 current truth 重算。
- Redaction / observability 测试必须断言 forbidden body absent 和 low-cardinality metric labels。

## 21. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 模块测试切口明确 | 通过 | 七个模块均有最小测试入口 |
| 接口测试切口明确 | 通过 | Command / Query / Consumer / Outbound Event / Job 均覆盖 |
| 状态机测试切口明确 | 通过 | 合法 / 非法转换入口明确 |
| 一致性、错误、幂等、并发测试切口明确 | 通过 | UoW、duplicate、stored result、outbox、projection、reference、handoff、commit unknown 均覆盖 |
| 配置和观测测试切口明确 | 通过 | config validation、redaction、metric label、audit refs-only 均覆盖 |
| 可进入 Step 17 | 通过 | Step 17 应收口详细设计到实施计划的承接清单,并为 `07-实施计划.md` 的 phase / commit boundary 审计提供输入 |
