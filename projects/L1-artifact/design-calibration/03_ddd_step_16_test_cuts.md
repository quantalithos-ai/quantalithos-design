# Step 16. 测试切口与最小验证清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 回填章节: `03-详细设计.md` §5.16 测试切口与最小验证清单
> 生成日期: 2026-07-04
> 状态: 已完成;待用户审查

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 16 测试切口与最小验证清单 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~15 详细设计校准文档 |
| 输出文件 | `projects/L1-artifact/design-calibration/03_ddd_step_16_test_cuts.md` |
| 停审方式 | 按模块测试、协议测试、状态机测试、一致性 / 幂等 / 并发测试、错误 / 配置 / 观测测试和脚本契约分批写入;完成后只做跨 Step 5~15 闭环审计 |

## 2. 本步目标

本 Step 为实现者和后续 `05-测试方案.md` 提供最小验证入口,确保详细设计中已经定义的对象、协议、flow、状态、事务、错误、幂等、配置和观测契约均能被测试覆盖。

实现侧必须从本 Step 直接判断:

- 每个实现模块至少需要哪些单元测试 / service test / fake adapter test。
- 每个 Command、Query、Inbound Event、Outbound Event 和 Operations Job 至少需要哪些正向和异常测试切口。
- 每个正式状态机至少如何覆盖合法转换和非法转换。
- 一致性、幂等、并发、duplicate replay、commit unknown 和 partial failure 如何验证。
- 日志、指标、审计、trace、redaction、config validation 和 forbidden body 如何验证。
- 哪些测试细节留给 `05-测试方案.md` 展开,避免在详细设计中写完整测试计划。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块测试主轴 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 固定对象不变量、factory、state enum、trace / audit / history / relay / handoff / report object 的单元测试入口 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 固定 repository、port、adapter、UoW、Clock、IdGenerator、stored result、fake failure injection 测试入口 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 固定 16 个 Command、13 个 Query、6 个 Inbound Consumer、8 个 Outbound Event、6 个 Operations Job 的协议测试入口 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 固定 accepted / rejected / duplicate / no-write / partial failure 的 application flow 测试入口 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 固定状态机、合法转换、非法转换和 query no-write 状态约束 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 固定 version、transaction、relay snapshot、projection / reference index、stored result、handoff marker persistence 测试入口 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 固定错误映射、recovery、retry、dead-letter、missing result、rollback failure 和 unsupported version 测试入口 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 固定 idempotency key / digest、duplicate replay、job replay、event dedup、commit unknown、concurrency guard 测试入口 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 固定 config validation、adapter availability、sibling dependency boundary、disabled / degraded / unavailable 测试入口 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 固定日志、指标、审计、trace/span、redaction 和 forbidden field 自动检查入口 |
| `projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md` | 已读取 | 作为 Step 16 粒度框架参考,本文件按 Artifact 语义重写 |

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
| 每个模块至少需要哪些单元测试? | `contracts` 测 DTO / ref / reason / event / job / receipt / view schema 和 roundtrip;`domain` 测对象 factory、不变量、policy、state matrix、trace / audit / relay / handoff object;`application` 测 command / query / consumer / job 编排、UoW、幂等、error mapping、副作用顺序;`infra` 测 repository version / page / unique / transaction、fake adapter failure injection、runtime builder / config validation;`api` 测 handler validation 和 protocol mapping;`worker` 测 inbound dedup / unsupported / rejected / delayed 与 relay publish;`jobs` 测 job input validation、partial failure、report、duplicate replay 和 no truth repair。 |
| 每个接口至少需要哪些正向和异常测试? | 每个 Command 至少覆盖 accepted success、invalid request / domain reject、duplicate replay、idempotency conflict、version / repository conflict。每个 Query 至少覆盖 hit、missing、not visible、degraded / stale / failed surface、query no-write。每个 Inbound Event 至少覆盖 accepted、duplicate、unsupported version、rejected / delayed。每个 Outbound Event 至少覆盖 payload mapping、stored snapshot、forbidden body absent、publish failure marker。每个 Job 至少覆盖 completed、duplicate report replay、invalid input、partial failure、no business truth repair。 |
| 状态机合法转换和非法转换如何测试? | 以 Step 10 的正式 enum 和转换矩阵为唯一真相源。每组状态机至少覆盖一条主线合法转换、一条边界合法转换和一条非法转换。非法转换必须断言 Step 10 / Step 12 指定的 `DomainError`、`ApplicationError`、`WorkerError`、`JobError` 或 protocol surface,并断言不写 accepted trace、history、relay、projection marker 或 stored success result。 |
| 一致性、幂等和并发如何验证? | 使用 fake / in-memory repository、fake UoW、fake resolver、fake publisher、fake handoff / export adapter、fake clock / id generator 注入 version conflict、unique conflict、storage unavailable、result missing、commit unknown、rollback failure、same key same digest、same key different digest、publisher race、projection cursor race、reference refresh race、job partial failure 和 adapter disabled / unavailable。测试必须断言 truth、history、trace、audit、relay、projection、reference、handoff marker、idempotency record、stored result / report 的写入顺序和 rollback / no-write 边界。 |
| 哪些测试细节应留给测试方案? | 具体 TC 编号、优先级、覆盖率目标、fixture 文件、数据生成器、真实外部依赖联调、durable store / bus / archive / observability / sync 产品绑定、CI job 名称、报告模板、evidence 编号和执行排期留给 `05-测试方案.md`。本 Step 只定义最小测试切口。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 5 | 七个模块职责已闭合,但缺模块级测试入口 | 本 Step 固定 module / crate 测试切口 |
| Step 8 | 协议 schema 已闭合,但正向 / 异常测试入口分散 | 本 Step 汇总 Command、Query、Inbound / Outbound Event、Job 表 |
| Step 9 | Flow 已有测试提示,但缺全局最小清单 | 本 Step 把 accepted / rejected / duplicate / no-write / partial failure 映射成 test cut |
| Step 10 | 状态矩阵完整,但需要测试反查表 | 本 Step 为状态机列合法 / 非法测试入口 |
| Step 11~13 | 一致性、错误、幂等、并发散落在不同 Step | 本 Step 统一汇总 transaction / duplicate / conflict / replay / commit unknown / race 测试切口 |
| Step 14 | config / adapter 绑定清楚,但需要验证边界 | 本 Step 增加 config validation、forbidden configurable boundary、sibling dependency 检查 |
| Step 15 | 埋点字段边界清楚,但需要自动检查入口 | 本 Step 增加 redaction、low-cardinality metric、audit refs-only 检查 |

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 详细设计是否写完整测试方案 | A. 写完整测试计划;B. 只写最小测试切口 | 采用 B。避免替代 `05-测试方案.md` |
| 接口测试粒度 | A. 只按模块测试;B. 每个 public protocol 都列 test cut | 采用 B。满足关键协议正反向覆盖 |
| 状态机测试 | A. 只测 happy path;B. 合法和非法转换都测 | 采用 B。非法转换是可落码性关键 |
| duplicate replay | A. 从 current truth 重算;B. 验证 stored result / report / receipt replay | 采用 B。与 Step 11 / 13 一致 |
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

- 每个测试切口必须能回指至少一个 `design-calibration/03_ddd_step_*.md` 中间产物。
- 本 Step 不定义测试排期、优先级、覆盖率阈值或具体 fixture 文件结构。
- Query 测试必须额外断言 no-write,不得通过 query 触发 projection rebuild、resolver refresh、audit append 或 reconciliation repair。
- Job 测试必须额外断言 no business truth repair,不得让 maintenance job 静默修 core truth。

## 9. 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | Step 8 `contracts` DTO | Command / Query / Event / Job / View / Error DTO roundtrip、required fields、schema version、enum / newtype 稳定性 | contract unit |
| `contracts_metadata_validation` | Step 8 metadata | Command idempotency key、Event dedup key、Job idempotency key、TraceContext 必填;Query 不携带 idempotency key | contract unit |
| `contracts_operation_digest_profile` | Step 13 key / digest schema | operation namespace、canonical digest、volatile metadata 排除、same digest / different digest 判定 | contract unit |
| `domain_object_invariants` | Step 6 object contracts | fact、version、lineage、baseline、intake、review、automation、consumption、trace、relay、handoff object factory 和不变量 | domain unit |
| `domain_policy_accept_reject` | Step 6 policy contracts | fact establish、version publish、lineage endpoint、baseline membership、review responsibility、automation intake、consumption backref policy accept / reject | domain unit |
| `domain_state_matrix_transitions` | Step 10 state matrix | 状态机合法 / 非法转换和错误 surface | domain / helper unit |
| `application_command_orchestration` | Step 9 command template | validate -> reserve -> load -> domain -> save truth / history / trace / audit / relay / stale / result -> complete idempotency -> commit 顺序 | service test |
| `application_query_no_write` | Step 9 query template | Query 不开启 write UoW、不写 audit / relay / idempotency / projection repair / reference refresh | query service |
| `application_consumer_orchestration` | Step 9 consumer template | envelope validation、dedup、unsupported version、snapshot / reference / stale / receipt、optional marker trace | service test |
| `application_job_orchestration` | Step 9 job template | job idempotency、per-item transaction、partial failure、stored report replay、no truth repair | service test |
| `application_error_mapping` | Step 12 error model | domain / repository / resolver / publisher / handoff / UoW / idempotency error 到 public protocol surface | service test |
| `infra_repository_semantics` | Step 7 / 11 repository | `Versioned<T>`、`ArtifactRepositoryVersion`、unique key、page、dependency index、reference scope index、transaction rollback | repository fake |
| `infra_adapter_failure_injection` | Step 7 / 14 adapter | resolver、publisher、handoff、clock、id generator 的 retryable / permanent / body rejected / digest mismatch failure injection | adapter fake |
| `infra_runtime_config_validation` | Step 14 config | `ArtifactRuntimeConfig` validation、adapter slot binding、topic map、forbidden configurable boundary | config test |
| `api_handler_protocol_mapping` | Step 8 / 9 API | handler required fields、actor context、metadata validation、protocol error mapping、no domain direct call | handler test |
| `worker_consumer_and_relay` | Step 8 / 9 worker | inbound event intake、dedup、unsupported / rejected / delayed、relay publish state update | worker test |
| `jobs_runner_contract` | Step 8 / 9 jobs | job metadata validation、scope / page handling、duplicate report replay、partial report、no business truth repair | job runner |
| `observability_and_redaction_contract` | Step 15 observability | logs / metrics / audit / report 不含 raw body、secret、credential、external response、archive package body | observability check |

## 10. Command 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `RegisterArtifactIntake_contract` | `RegisterArtifactIntakeFlow` | intake created;reference pending / ready branch;boundary audit / relay / stale / result same UoW;duplicate replay;missing source;resolver unavailable;relay append failure rollback | API + application |
| `EstablishArtifactFact_contract` | `EstablishArtifactFactFlow` | fact established;duplicate replay;forbidden body;policy reject;fact save + change record + relay + result same UoW | API + application |
| `CreateArtifactVersionCandidate_contract` | `CreateArtifactVersionCandidateFlow` | candidate created;duplicate replay;missing source / content context;version conflict;history / trace / relay saved | API + application |
| `PublishArtifactVersion_contract` | `PublishArtifactVersionFlow` | published / duplicate / invalid state / missing reference;fact current bind and relay snapshot saved | API + application |
| `SupersedeArtifactVersion_contract` | `SupersedeArtifactVersionFlow` | current version superseded by next;duplicate;same fact guard;version state updated | API + application |
| `EstablishArtifactLineageLink_contract` | `EstablishArtifactLineageLinkFlow` | lineage created;duplicate;endpoint uniqueness conflict;relation kind guard | API + application |
| `RejectArtifactLineageLink_contract` | `RejectArtifactLineageLinkFlow` | reject branch;invalid state;duplicate replay;terminal lineage guard | API + application |
| `CreateArtifactBaselineCandidate_contract` | `CreateArtifactBaselineCandidateFlow` | ordered members accepted;membership uniqueness;duplicate replay;baseline scope guard | API + application |
| `FreezeArtifactBaseline_contract` | `FreezeArtifactBaselineFlow` | baseline freeze;membership validation;duplicate;invalid transition | API + application |
| `SupersedeArtifactBaseline_contract` | `SupersedeArtifactBaselineFlow` | current baseline superseded;next baseline accepted;duplicate replay;version conflict | API + application |
| `OpenArtifactReviewAnchor_contract` | `OpenArtifactReviewAnchorFlow` | review anchor opened;requirement / responsibility branch;duplicate replay;missing truth anchor | API + application |
| `AssignArtifactResponsibility_contract` | `AssignArtifactResponsibilityFlow` | responsibility assigned;chain update;duplicate;capability unavailable | API + application |
| `RegisterAutomationArtifactInput_contract` | `RegisterAutomationArtifactInputFlow` | automation input registered;duplicate;source resolution branch;body-free source guard | API + application |
| `AcceptAutomationArtifactInput_contract` | `AcceptAutomationArtifactInputFlow` | accept/reject branch;duplicate;intake context guard;version conflict | API + application |
| `IssueConsumableArtifactReference_contract` | `IssueConsumableArtifactReferenceFlow` | consumable reference issued;duplicate;scope / anchor guard | API + application |
| `RecordArtifactConsumptionBackref_contract` | `RecordArtifactConsumptionBackrefFlow` | backref recorded;duplicate;consumer / consumable guard;trace append order | API + application |

## 11. Query 接口测试切口汇总表

所有 API query handler 测试必须断言 `ArtifactQueryResponse` 的 surface 规则:visible 且非 degraded 的 query 返回 body;not-visible 返回 `NotVisible`;degraded / stale / unresolved 返回 `Degraded`;三类 query surface 均不得写 truth、trace、audit、relay、stored result、projection 或 reference repair。

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GetArtifactFact_query` | `GetArtifactFactFlow` | fact hit;missing;not visible;degraded;query no-write | query handler |
| `GetArtifactVersion_query` | `GetArtifactVersionFlow` | version hit;missing;not visible;degraded;query no-write | query handler |
| `ListArtifactVersionsByFact_query` | `ListArtifactVersionsByFactFlow` | page hit;empty page;stale page;visibility filtered items | query handler |
| `GetArtifactLineageSummary_query` | `GetArtifactLineageSummaryFlow` | lineage hit;missing;not visible;degraded | query handler |
| `GetArtifactBaseline_query` | `GetArtifactBaselineFlow` | baseline hit;missing;not visible;degraded | query handler |
| `GetArtifactReviewSummary_query` | `GetArtifactReviewSummaryFlow` | review hit;missing;not visible;degraded | query handler |
| `GetArtifactReadSurface_query` | `GetArtifactReadSurfaceFlow` | selector branch hit;invalid selector rejected;not visible;degraded read surface;no write | query handler |
| `GetArtifactTrace_query` | `GetArtifactTraceFlow` | trace page hit;empty page;not visible trace;no repair | query handler |
| `SearchArtifactFacts_query` | `SearchArtifactFactsFlow` | search page hit;empty page;visibility filtered results;stale summary | query handler |
| `GetArtifactPreview_query` | `GetArtifactPreviewFlow` | preview hit;missing;stale;degraded | query handler |
| `GetArtifactReport_query` | `GetArtifactReportFlow` | report hit;missing;failed state;no repair | query handler |
| `GetArtifactReconciliationReport_query` | `GetArtifactReconciliationReportFlow` | reconciliation report hit;missing;stale state;no repair | query handler |
| `GetExternalReferenceResolution_query` | `GetExternalReferenceResolutionFlow` | resolution hit;missing;degraded;unsupported selector rejected | query handler |

## 12. Inbound Event Consumer 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ConsumeWorkArtifactContextChanged_event` | `WorkArtifactContextChangedPayload` | work context ref + reference state saved;duplicate receipt replay;unsupported version no parse;unavailable source delayed;no body persisted | consumer |
| `ConsumeProcessArtifactContextChanged_event` | `ProcessArtifactContextChangedPayload` | process context ref + reference state saved;duplicate;unavailable source delayed;no body persisted | consumer |
| `ConsumeGovernanceArtifactContextChanged_event` | `GovernanceArtifactContextChangedPayload` | governance context ref + reference state saved;duplicate;unavailable source delayed;no body persisted | consumer |
| `ConsumeMethodArtifactDefinitionChanged_event` | `MethodArtifactDefinitionChangedPayload` | definition ref + reference state saved;duplicate;unsupported version;no definition body persisted | consumer |
| `ConsumeRuntimeArtifactSignalRecorded_event` | `RuntimeArtifactSignalRecordedPayload` | automation source ref / optional anchor copied;duplicate;quarantined / delayed branch;runtime body forbidden | consumer |
| `ConsumeExternalContentSourceChanged_event` | `ExternalContentSourceChangedPayload` | source ref + mirror snapshot / resolution state saved;duplicate;body forbidden;unsupported version | consumer |

## 13. Outbound Event 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ArtifactFactChanged_event_schema` | `ArtifactFactChangedPayload` | payload from accepted fact truth;subject / refs only;stored snapshot equals relay record;publisher only reads snapshot | contract + publisher |
| `ArtifactVersionChanged_event_schema` | `ArtifactVersionChangedPayload` | version / fact / state refs;no body;publish failure marks relay only | contract + publisher |
| `ArtifactLineageChanged_event_schema` | `ArtifactLineageChangedPayload` | relation refs / kind only;no lineage body | contract + publisher |
| `ArtifactBaselineChanged_event_schema` | `ArtifactBaselineChangedPayload` | baseline / scope / state refs only;no baseline member body | contract + publisher |
| `ArtifactReviewChanged_event_schema` | `ArtifactReviewChangedPayload` | review / responsibility / state refs only;no actor profile | contract + publisher |
| `ConsumableArtifactReferenceChanged_event_schema` | `ConsumableArtifactReferenceChangedPayload` | consumable / anchor / state refs only;no consumer body | contract + publisher |
| `ArtifactTraceAvailable_event_schema` | `ArtifactTraceAvailablePayload` | trace / anchor / optional handoff refs only;no observability span body | contract + publisher |
| `ArtifactDerivedViewStateChanged_event_schema` | `ArtifactDerivedViewStateChangedPayload` | view / freshness refs only;no projection body dump | contract + publisher |

## 14. Operations Job 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `PublishPendingArtifactRelays_job` | `PublishPendingArtifactRelaysFlow` | pending batch from `list_pending_with_payload`;publish success / retryable / failed / dead-letter;report carries scanned / published / failed relay refs;duplicate report replay;truth unchanged | job runner |
| `RebuildArtifactDerivedViews_job` | `RebuildArtifactDerivedViewsFlow` | rebuild selected derived views from snapshot scope;missing state first materialization;stale / failed -> fresh;partial failure report;duplicate replay;no truth repair | job runner |
| `RefreshExternalReferenceStates_job` | `RefreshExternalReferenceStatesFlow` | explicit / unhealthy / scoped state expansion;resolver dispatch by reference kind;success / unresolved / failed;versioned save;refresh record append;duplicate replay | job runner |
| `RunArtifactReconciliation_job` | `RunArtifactReconciliationFlow` | clean / drift / failed report;stored report refs and inspected refs;duplicate replay;no inline repair | job runner |
| `PrepareArtifactArchiveHandoff_job` | `PrepareArtifactArchiveHandoffFlow` | trace / report refs validation;archive target disabled;prepared / failed marker;no archive package body | job runner |
| `PrepareArtifactObservabilityHandoff_job` | `PrepareArtifactObservabilityHandoffFlow` | truth anchor / trace refs validation;observability target disabled;prepared / delivered / retryable / failed marker;no observability body | job runner |
| `PrepareArtifactSyncHandoff_job` | `PrepareArtifactSyncHandoffFlow` | consumer scope and read surface refs validation;sync target disabled;prepared / delivered / retryable / failed marker;no sync private body | job runner |

## 15. 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `artifact_fact_state_transitions` | `ArtifactFactState` | PendingIntake / Established / Suspended / Closed 合法转换和终态拒绝 | domain unit |
| `artifact_content_context_state_transitions` | `ArtifactContentFactContextState` | Linked / PendingCheck / Verified / Unavailable 合法转换和终态拒绝 | domain unit |
| `artifact_version_state_transitions` | `ArtifactVersionState` | Candidate / Published / Superseded / Frozen / Retired 合法转换和终态拒绝 | domain unit |
| `artifact_version_candidate_state_transitions` | `ArtifactVersionCandidateState` | Draft / Ready / Rejected / Superseded 之类合法转换和 terminal guard | domain unit |
| `artifact_lineage_state_transitions` | `ArtifactLineageState` | Proposed / Established / Rejected / Retired 合法转换和终态拒绝 | domain unit |
| `artifact_baseline_state_transitions` | `ArtifactBaselineState` | Candidate / Frozen / Superseded / Retired 合法转换和终态拒绝 | domain unit |
| `artifact_intake_state_transitions` | `ArtifactIntakeState` | Draft / Pending / Accepted / Rejected / Superseded | domain unit |
| `artifact_review_state_transitions` | `ArtifactReviewState` | Open / Pending / Closed / Invalidated | domain unit |
| `artifact_responsibility_state_transitions` | `ArtifactResponsibilityAssignmentState` | Required / Assigned / Released / Invalidated | domain unit |
| `automation_input_state_transitions` | `AutomationArtifactInputState` | Received / PendingReview / Accepted / Rejected / Superseded | domain unit |
| `consumable_reference_state_transitions` | `ConsumableArtifactReferenceState` | Ready / Stale / Unavailable / Retired | domain unit |
| `artifact_consumption_backref_state_transitions` | `ArtifactConsumptionBackrefState` | Recorded / Explained / Failed | domain unit |
| `derived_view_freshness_state_transitions` | `ArtifactDerivedFreshnessState` | Fresh / Stale / Rebuilding / Failed / Unavailable | projection test |
| `reference_resolution_state_transitions` | `ArtifactExternalResolutionState` | Resolved / Unresolved / Stale / Failed / Unavailable | reference test |
| `relay_publication_outcome_transitions` | `ArtifactRelayOutcome` + `ArtifactCommittedChangeRelayRepository.mark_*` | Pending relay item -> Published / Retryable / Failed through expected-version marker update | relay / worker test |
| `reconciliation_report_state_transitions` | `ArtifactReconciliationState` | Generated / Failed / Superseded | job/report test |
| `handoff_state_transitions` | `ArtifactHandoffState` | Prepared / Delivered / Failed / Retryable | handoff job |
| `job_report_state_transitions` | `ArtifactJobOutcome` | Completed / PartiallyCompleted / Failed / DuplicateReplayed / Rejected | job runner |
| `idempotency_reservation_transitions` | `ArtifactIdempotencyReservation` | Reserved / Duplicate / Conflict branches and complete / mark_conflict repository effects | idempotency fake |
| `runtime_entry_states` | `ArtifactRuntimeConfig` validation + entry dispositions | config accepted / rejected, API not-visible / degraded, worker unsupported, job duplicate replay | infra / entry tests |

## 16. 一致性 / 幂等 / 并发测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_duplicate_same_key_same_digest` | Step 13 duplicate replay | 返回 stored command result;无新 truth、history、trace、audit、relay、resolver call | application |
| `command_same_key_different_digest_conflict` | Step 13 idempotency conflict | 返回 conflict surface;不进入 domain transition;不写 accepted audit | application |
| `operation_namespace_isolation` | Step 13 operation namespace | 同 raw key 在不同 command / event / job operation 下不互相 duplicate | idempotency fake |
| `duplicate_result_missing_no_recompute` | Step 11 / 12 / 13 stored result | completed idempotency 指向 missing / wrong result kind 时返回 consistency error;不得从 current truth 重算 | application |
| `job_duplicate_same_key_replays_report` | Step 8 / 13 job duplicate | duplicate job 读取完整 stored job report;relay refs、view_refs、reference refs、report refs、handoff refs 与首跑一致;不重新 scan / publish / rebuild / refresh / reconcile / handoff / export | jobs |
| `consumer_duplicate_replays_receipt` | Step 8 / 13 consumer duplicate | duplicate inbound event 读取 stored receipt / result;不重写 snapshot / stale marker | worker |
| `commit_unknown_same_key_recovery` | Step 12 / 13 commit unknown | retry same key 先读 idempotency / result store,不盲写第二次 truth | service + fake UoW |
| `stored_result_saved_before_idempotency_complete` | Step 11 ordering | result save 失败 rollback;idempotency complete 不可见 | repository fake |
| `idempotency_complete_failure_rolls_back` | Step 11 ordering | complete 失败时 truth / history / trace / relay / result 不提交 | service + fake UoW |
| `relay_enqueue_failure_rolls_back_truth` | Step 11 relay consistency | relay append / payload snapshot save failure rollback entire accepted command | service |
| `relay_publisher_parallel_single_winner` | Step 13 publish concurrency | 两个 publisher 对同 relay 只有一个 mark succeeds;另一方 version conflict / partial report | worker / repository |
| `projection_dependency_index_is_only_source` | Step 11 projection index | affected views 只能来自 repository dependency index;禁止 ad hoc view ref | application + repository |
| `projection_rebuild_race_preserves_newer_cursor` | Step 13 projection race | older cursor 不覆盖 newer fresh state;failed marker 不清除 newer state | projection fake |
| `reference_scope_list_uses_tracked_state` | Step 7 / 11 reference scope index | refresh scope 只列 tracked reference state with matching refresh target;不扫描 sibling body / private map | reference fake |
| `reference_refresh_preserves_last_good_snapshot` | Step 12 / 13 reference failure | unavailable / digest mismatch / body rejected 不删除 last successful snapshot | reference fake |
| `handoff_marker_trace_refs_non_empty` | Step 9 / 11 handoff marker | trace / archive / sync marker 保存前必须有非空 trace refs | job runner |
| `query_no_write_side_effects` | Step 9 query no-write | Query 不 begin write UoW、不调用 resolver、不修 projection / reference / audit | query service |
| `maintenance_job_no_truth_repair` | Step 9 job discipline | rebuild / refresh / reconciliation / handoff / export 不修改 core truth | job runner |
| `rollback_failure_surfaces_manual_intervention` | Step 12 rollback failure | rollback failure 返回 temporary unavailable / diagnostic,不做隐藏补偿写 | service + fake UoW |

## 17. 错误 / 配置 / 观测测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `invalid_request_no_uow` | Step 8 / 12 protocol validation | missing metadata / actor / idempotency / required field 时不 begin UoW、不调用 application mutation | handler test |
| `domain_reject_no_success_trace` | Step 10 / 12 invalid transition | invalid state / policy reject 不写 success trace、history、relay、stored accepted result | domain + service |
| `unsupported_event_version_no_parse` | Step 8 / 12 / 13 inbound version | unsupported version 不解析 payload、不写 snapshot、不 mark stale、不写 accepted trace | worker |
| `source_unavailable_mapping` | Step 12 / 14 dependency unavailable | command -> temporarily unavailable / rejected;consumer -> delayed;job -> partial / failed report | service + adapter fake |
| `digest_mismatch_and_body_rejected` | Step 12 / 15 body boundary | digest mismatch / body rejected 不写 resolved marker;logs / report 不含 raw body | consumer / job |
| `publisher_retryable_failure_marker` | Step 12 / 15 relay recovery | retryable publish failure -> relay failed marker + report;truth unchanged | worker |
| `publisher_terminal_failure_marker` | Step 12 / 13 relay failure | terminal publish failure -> failed marker;duplicate relay loop does not republish published / failed terminal record | worker |
| `handoff_failure_marker_or_report` | Step 12 / 15 handoff recovery | handoff / export failure saves failed marker / report;no package / document body | job runner |
| `config_validation_fail_fast` | Step 14 / 15 config validation | invalid store / publisher / topic / handoff / adapter binding fails with redacted issue | config test |
| `forbidden_boundary_not_configurable` | Step 14 config invariant | config cannot disable metadata、idempotency、visibility、audit / relay、query no-write、job no-truth-repair、redaction | config test |
| `non_core_sibling_not_cargo_dependency` | Step 3 / 14 dependency boundary | 除 `core-contracts` 外 sibling repo 不进入 Cargo dependency | architecture check |
| `logs_do_not_include_forbidden_body` | Step 15 structured logs | logs 不含 raw request / event / adapter response、external body、secret、stack trace | observability check |
| `metrics_low_cardinality_labels` | Step 15 metrics | metric labels 不含 request ref、actor ref、subject ref、trace id、relay id、marker id、free text、secret | observability check |
| `audit_uses_refs_only` | Step 15 audit | audit / history / trace / handoff marker 只记录 refs / state / reason / cursor / count;不保存 body | observability check |
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
| 七个实现模块是否都有测试入口 | 通过 | §9 覆盖 `contracts / domain / application / infra / api / worker / jobs` |
| 16 个 Command 是否都有正向和异常切口 | 通过 | §10 逐项覆盖 |
| 13 个 Query 是否都有 hit / missing / not-visible / degraded / no-write 切口 | 通过 | §11 逐项覆盖 |
| 6 个 Inbound Consumer 是否都有 accepted / duplicate / unsupported / rejected / delayed 切口 | 通过 | §12 逐项覆盖 |
| 8 个 Outbound Event 是否都有 payload snapshot / forbidden body / publish failure 切口 | 通过 | §13 逐项覆盖 |
| 6 个 Operations Job 是否都有 success / duplicate / invalid / partial / no-truth-repair 切口 | 通过 | §14 逐项覆盖 |
| 状态机合法 / 非法转换是否有入口 | 通过 | §15 覆盖 Step 10 状态矩阵批次 |
| 一致性 / 幂等 / 并发是否有入口 | 通过 | §16 覆盖 duplicate、stored result、UoW、relay、projection、reference、handoff、query no-write |
| 错误 / 配置 / 观测是否有入口 | 通过 | §17 覆盖 Step 12 / 14 / 15 |
| 是否越界替代测试方案 | 通过 | 只写最小 test cut,不写 TC 编号、优先级、覆盖率、fixture 目录或 CI 排期 |

## 20. 回填草稿

正式 `03-详细设计.md` §5.16 应回填:

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
- Duplicate replay 必须断言 stored result / report / receipt,不得从 current truth 重算。
- Redaction / observability 测试必须断言 forbidden body absent 和 low-cardinality metric labels。

## 21. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 模块测试切口明确 | 通过 | 七个模块均有最小测试入口 |
| 接口测试切口明确 | 通过 | Command / Query / Consumer / Outbound Event / Job 均覆盖 |
| 状态机测试切口明确 | 通过 | 合法 / 非法转换入口明确 |
| 一致性、错误、幂等、并发测试切口明确 | 通过 | UoW、duplicate、stored result、relay、projection、reference、handoff、commit unknown 均覆盖 |
| 配置和观测测试切口明确 | 通过 | config validation、redaction、metric label、audit refs-only 均覆盖 |
| 可进入 Step 17 | 通过 | Step 17 应收口详细设计到实施计划的承接清单,并为 `07-实施计划.md` 的 phase / commit boundary 审计提供输入 |
