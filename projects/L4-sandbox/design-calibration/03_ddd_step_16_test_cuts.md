# Step 16. 定义测试切口与最小验证清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 回填章节: `03-详细设计.md` §15 测试切口与最小验证清单
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 5 模块契约、Step 8 协议契约、Step 9 函数级 flow、Step 10 状态矩阵、Step 11 持久化 / 事务、Step 12 错误恢复、Step 13 并发 / 幂等、Step 14 配置 / 外部依赖绑定和 Step 15 可观测性 / 审计契约基础上,定义 L4-sandbox 的最小测试切口。本步不写完整测试方案、测试用例编号、fixture 文件、真实测试结果、run_id、evidence alias、验收签署、CI 实现脚本或正式 `03-详细设计.md`。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 16 | 是。Step 15 审查点后用户已回复“同意”,允许进入 Step 16。 |
| 项目级台账是否允许进入 Step 16 | 是。原恢复点为 Step 15 `pass_wait_review`;用户确认后可进入本步。 |
| 文档级 flow 是否允许进入 Step 16 | 是。`03_ddd_calibration_flow.md` 原记录 Step 16 `blocked_by_step_15`,用户确认后门禁满足。 |
| 是否已读取 Step 16 SOP | 是。本步必须输出模块测试切口、接口测试切口、状态机测试切口、一致性 / 幂等测试切口。 |
| 是否已读取详细设计书写规范 §5.15 | 是。本章不替代测试方案;每个关键 Command / Query / Event / Job 至少有正向和异常测试切口;状态机覆盖合法与非法转换。 |
| 是否已读取上游 Step 5/8/9/10/11/12/13/15 | 是。已抽取模块、协议、flow、状态、事务、错误、幂等、观测和 Step 16 handoff。 |
| 是否发现阻塞 Step 16 的上游 blocker | 未发现阻塞本步生成的 blocker。`04-配置设计.md`、`05-测试方案.md`、`07-实施计划.md` 仍是 downstream gap,不阻塞本步。 |

---

## 2. 本步目标

本步为实现者和后续 `05-测试方案.md` 提供最小验证入口,确保详细设计已定义的模块、对象、接口、flow、状态、事务、错误、幂等、配置和观测契约都能被测试覆盖。

本步必须让后续实现者能判断:

- 每个实现模块至少要测哪些 unit / service / adapter / entry 切口。
- 每个 Command、Query、Inbound Consumer、Outbound Event / Relay 和 Operations Job 至少有哪些正向与异常切口。
- Step 10 每个状态族如何至少覆盖合法转换和非法转换。
- 事务、rollback、cursor、expected version、stored replay、duplicate、并发 race、query no-write、job no-repair、relay / handoff no-rollback 如何验证。
- Step 14 配置与 adapter availability 如何验证不改变 truth / fail-closed / cleanup / redline 语义。
- Step 15 log / metric / audit / trace / redaction 如何通过测试或检查入口验证。

本步不定义:

- 完整测试矩阵、TC 编号、优先级、覆盖率目标、fixture 目录结构、测试数据全集、property test 生成器和真实 durable store / bus / backend 联调。
- CI job 名称、测试报告模板、真实 evidence alias、真实 run_id、验收门禁签署和执行排期。
- 具体脚本实现。若后续实现仓需要脚本,本步只给脚本契约,不创建脚本文件。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 已读取 | 固定 `contracts/domain/application/infra/api/worker/jobs` 七个模块测试主轴。 |
| `03_ddd_step_06_object_contracts.md` | 已承接 | 固定对象 factory、不变量、state enum、trace / audit / relay / handoff / report carrier 的 unit test 入口。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已承接 | 固定 repository、UoW、resolver、backend、handoff、publisher、fake parity 和 adapter failure injection 入口。 |
| `03_ddd_step_08_protocol_contracts.md` | 已读取 | 固定 10 个 Command、13 个 Query、9 个 Inbound Consumer、13 个 Outbound Event、10 个 Operations Job 的协议 surface。 |
| `03_ddd_step_09_function_flows.md` | 已读取 | 固定 accepted / rejected / duplicate / no-write / no-rollback / partial failure flow 测试入口。 |
| `03_ddd_step_10_state_matrix.md` | 已读取 | 固定状态 enum、合法 / 禁止迁移和非法转换错误口径。 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已读取 | 固定 logical store、transaction、cursor、rollback visibility、projection rebuild、relay publish 和 fake / durable parity。 |
| `03_ddd_step_12_error_recovery.md` | 已读取 | 固定错误 taxonomy、public surface、恢复 / 不恢复口径、dead-letter、quarantine、no-write / no-repair violation。 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已读取 | 固定 idempotency key / digest、duplicate replay、job report replay、event dedup、expected version 和 race 测试入口。 |
| `03_ddd_step_14_config_external_binding.md` | 已承接 | 固定 config validation、adapter availability、topic binding、external dependency 和 sibling dependency boundary。 |
| `03_ddd_step_15_observability_audit.md` | 已读取 | 固定 log / metric / audit / trace / redaction / forbidden field 检查入口。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 恢复项目级台账、文档级 flow 和 Step 15 当前文件。 | done | 确认用户已允许进入 Step 16。 |
| 2 | 读取 Step 16 SOP 和详细设计书写规范 §5.15。 | done | 明确四类必出测试切口表和脚本契约条件。 |
| 3 | 从 Step 5/8/9/10/11/12/13/14/15 抽取测试候选池。 | done | 形成模块、接口、状态、一致性 / 幂等、配置 / 观测候选。 |
| 4 | 输出模块测试切口汇总表。 | done | 覆盖七个实现模块。 |
| 5 | 输出接口测试切口汇总表。 | done | 覆盖 Command / Query / Consumer / Outbound / Job。 |
| 6 | 输出状态机和一致性 / 幂等 / 并发测试切口。 | done | 覆盖合法 / 非法转换、fake / durable parity。 |
| 7 | 输出错误、配置、观测、脚本契约、historical material / blocker、回填草稿和 Step 17 handoff。 | done | 当前恢复点停在 Step 16 审查点,不跨到 Step 17。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 每个模块至少需要哪些单元测试 | `contracts` 测 DTO / ref / metadata / event / job / receipt / error schema roundtrip;`domain` 测对象 factory、不变量、状态迁移、guard、redline / cleanup policy;`application` 测 command / query / consumer / job 编排、UoW、idempotency、error mapping、副作用顺序;`infra` 测 repository version / cursor / transaction、fake adapter failure injection、config validation、runtime builder;`api` 测 handler validation、metadata mapping、public error surface;`worker` 测 inbound consumer、fulfillment / feedback、relay publish、ack / retry / quarantine;`jobs` 测 job input、selection、per-item report、duplicate report replay、no core truth repair。 |
| 每个接口至少需要哪些正向和异常测试 | 每个 Command 至少测 accepted / formal rejected or fail-closed / duplicate replay / idempotency conflict / version or adapter failure。每个 Query 至少测 visible hit / missing or empty / not-visible / degraded or stale / no-write。每个 Consumer 至少测 accepted / duplicate receipt / unsupported or invalid envelope / delayed or quarantined。每个 Outbound Event 至少测 payload source / body-free fields / append relay / publish failure no rollback。每个 Job 至少测 success / duplicate report replay / invalid input or selection empty / partial failure / no core truth repair。 |
| 状态机合法转换和非法转换如何测试 | 以 Step 10 enum 和迁移表为唯一真相源。每个状态族至少覆盖一条主线合法转换、一条边界合法转换和一条非法转换。非法转换必须断言 `DomainError` / `ApplicationError` / public error surface,并断言不写 accepted audit、relay、projection stale、stored success result 或 downstream handoff。 |
| 事务、一致性、幂等和并发如何验证 | 使用 fake / in-memory repository、fake UoW、fake clock / id generator、fake resolver、fake backend、fake handoff、fake publisher 注入 duplicate、digest mismatch、stored result missing、expected version conflict、unique conflict、commit unknown、rollback failure、adapter unavailable、publish failure、handoff failure、parallel reserve race、lease / cleanup / redline race。测试必须断言 rollback visibility、cursor 来源、stored replay、不重算、不扫描、不回滚 source truth。 |
| 哪些测试细节应留给测试方案 | 用例编号、优先级、覆盖率目标、测试数据、fixture 文件、property test 生成策略、真实 DB / bus / backend / observability / artifact / investigation 联调、CI job 编排、报告模板、evidence alias 和验收签署留给 `05/06/07`。本 Step 只定义最小验证入口。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 5 模块契约 | 模块 owner 已固定,但测试入口未汇总。 | 本步输出七个模块测试切口。 |
| Step 8 协议契约 | 协议数量多,正向 / 异常测试入口分散。 | 本步按 Command / Query / Consumer / Outbound / Job 分表。 |
| Step 9 flow | flow 已有局部测试提示,但缺最小全局清单。 | 本步统一 accepted、rejected、duplicate、no-write、no-rollback、partial failure 测试口径。 |
| Step 10 状态矩阵 | 状态族完整,但后续测试方案需要反查入口。 | 本步列状态机测试切口,覆盖合法 / 非法迁移。 |
| Step 11~13 | 事务、rollback、cursor、idempotency、concurrency 分散。 | 本步汇总一致性 / 幂等 / 并发测试切口。 |
| Step 14 | 配置和外部依赖绑定已闭口,但需要验证禁止配置化边界。 | 本步增加 config validation / adapter availability / sibling dependency boundary 切口。 |
| Step 15 | log / metric / audit / redaction 已闭口,但需要检查入口。 | 本步增加 redaction、low-cardinality metric、audit refs-only、no raw body 检查切口。 |

---

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 详细设计是否写完整测试方案 | A. 写完整测试计划;B. 只写最小测试切口 | 采用 B。避免替代 `05-测试方案.md`。 |
| 协议覆盖粒度 | A. 只列协议族;B. 每个关键协议列切口 | 采用 B。保障实现者不遗漏 Command / Query / Event / Job。 |
| 状态测试 | A. 只测 happy path;B. 合法与非法转换都测 | 采用 B。非法迁移是安全边界。 |
| fake adapter | A. 只模拟成功;B. 必须支持 failure / race injection | 采用 B。需要验证 fail-closed、no-rollback、dead-letter 和 quarantine。 |
| duplicate replay | A. 从 current truth 重算;B. 验证 stored result / receipt / report replay | 采用 B。与 Step 11 / 13 一致。 |
| 观测测试 | A. 只看日志存在;B. 检查 forbidden body、低基数标签、audit refs-only | 采用 B。落实 Step 15 安全边界。 |

---

## 8. 测试切口总图

```text
Step 5 module contracts
  -> module / crate test cuts
Step 8 protocol contracts + Step 9 function flows
  -> command / query / consumer / outbound event / job test cuts
Step 10 state matrix
  -> legal / illegal transition test cuts
Step 11-13 persistence, error, idempotency and concurrency
  -> transaction / rollback / cursor / duplicate / conflict / race test cuts
Step 14 config binding
  -> config validation / adapter availability / dependency boundary test cuts
Step 15 observability and audit
  -> log / metric / audit / trace / redaction / forbidden field test cuts
```

通用测试规则:

- 每个测试切口必须能回指至少一个 `03_ddd_step_*.md` 中间产物。
- 本步不声明任何测试已运行,不创建 evidence alias,不伪造 run_id。
- Query 测试必须断言 no-write:不 begin write UoW、不 append audit、不 mark stale、不 refresh、不 rebuild、不 handoff、不 cleanup、不 release。
- Job 测试必须断言 no core truth repair:不 accepted context、不建立 boundary、不允许 policy、不启动 run、不修复 capture truth。
- Relay / handoff 测试必须断言 no-rollback:publish / delivery failure 只更新 relay / handoff / report,不回滚 source / capture truth。
- Redaction 测试必须断言 logs、metrics、audit、receipt、report、handoff marker 均不保存 raw body、secret、stack trace、external package body。

---

## 9. 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_protocol_schema_roundtrip` | Step 8 `contracts` DTO | Command / Query / Event / Job / View / Receipt / Error DTO 必填字段、schema version、enum / typed ref roundtrip。 | contract unit |
| `contracts_metadata_boundary` | Step 8 metadata;Step 13 digest | Command 必须携带 idempotency key;Consumer 必须携带 dedup key;Job 必须携带 idempotency key;Query 不创建 idempotency record;TraceContext 不含 raw body。 | contract unit |
| `domain_object_factory_invariants` | Step 6 object contracts | context、identity、boundary、policy、run、capture、handoff、failure、control、cleanup、redline、projection、relay、audit trace factory 和不变量。 | domain unit |
| `domain_state_transition_guards` | Step 10 state matrix | 每个 state enum 的合法 / 非法迁移、terminal guard、fail-closed、cleanup / redline guard。 | domain unit |
| `application_command_orchestration` | Step 9 command template;Step 11 transaction | reserve -> read / adapter -> domain -> save truth -> audit / relay / stale -> stored result -> complete idempotency -> cursor -> commit 顺序。 | service test |
| `application_query_no_write_guard` | Step 9 query;Step 11 no-write | Query 不开启 write UoW、不写 audit / relay / idempotency / projection repair、不调用 mutating adapter。 | query service |
| `application_consumer_orchestration` | Step 9 consumer;Step 13 event dedup | envelope validation、dedup、unsupported、reference / marker write、stored receipt、optional trace、ack / retry / quarantine。 | service / worker |
| `application_job_orchestration` | Step 9 jobs;Step 13 job replay | job input validation、selection、per-item transaction、partial failure report、stored report replay、no core truth repair。 | job service |
| `application_error_mapping` | Step 12 error model | validation、domain、repository、adapter、UoW、idempotency、duplicate missing、no-write、no-repair 到 public surface 映射。 | service test |
| `infra_repository_semantics` | Step 7 / 11 repositories | versioned load/save、unique create、page cursor、truth / reference cursor、rollback visibility、append-only audit、relay status update。 | repository fake |
| `infra_fake_adapter_failure_injection` | Step 7 / 14 adapters | resolver unavailable、policy missing、backend unsupported、launch failed、capture failed、handoff retryable、publisher dead-letter、config disabled。 | adapter fake |
| `infra_runtime_config_validation` | Step 14 config | forbidden configurable boundary、adapter slot binding、topic-neutral route binding、`core-contracts` only path dependency、startup blocked / degraded。 | config test |
| `api_handler_mapping` | Step 8 / 9 API | request validation、metadata mapping、command / query dispatch、public error redaction、no direct repository / domain bypass。 | handler test |
| `worker_consumer_relay_runtime` | Step 8 / 9 worker | inbound consumer ack / retry / quarantine、fulfillment feedback、relay publish loop,source truth unchanged on publish failure。 | worker test |
| `jobs_runner_contract` | Step 8 / 9 jobs | job input validation、page / scope handling、report item refs、duplicate report replay、partial failure、no truth repair。 | job runner |
| `observability_redaction_contract` | Step 15 observability | log / metric / audit / receipt / report 不含 raw body、secret、credential、adapter response、stack trace、external package body。 | check / unit |

---

## 10. Command 接口测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `OpenControlledExecutionContext_command` | `OpenControlledExecutionContextFlow` | accepted context + identity + audit + stored result;unresolved refs;forbidden body rejected;duplicate replay;rollback hides staged context。 | API + service |
| `EstablishExecutionBoundary_command` | `EstablishExecutionBoundaryFlow` | coherent resource / filesystem / network / process boundary established;unsupported rejected;backend unavailable failed / pending;weak fallback rejected;duplicate replay。 | service + fake backend |
| `EvaluatePolicyExecution_command` | `EvaluatePolicyExecutionFlow` | policy accepted;missing / stale / conflicted fail-closed;high-risk blocked;policy body not persisted;duplicate replay。 | service + fake policy |
| `StartControlledExecutionRun_command` | `StartControlledExecutionRunFlow` | accepted context + coherent boundary + exact active handle + exact active non-expired persisted lease + policy allow starts run;handle / lease mismatch、inactive / expired、policy denied或boundary missing时backend call=0;backend launch unavailable maps failure;no runtime agent loop truth。 | service + fake backend |
| `RecordCaptureResult_command` | `RecordCaptureResultFlow` | complete / partial / failed capture;material / observability refs only;no stdout / stderr body;capture saved independent of later handoff;duplicate replay。 | service + fake capture |
| `OpenMaterialHandoff_command` | `OpenMaterialHandoffFlow` | delivered / retryable / failed handoff;observability handoff marker optional;target unknown validation;adapter failure no capture rollback;duplicate replay。 | service + fake handoff |
| `SubmitSandboxControl_command` | `SubmitSandboxControlFlow` | kill / cancel / timeout accepted;conflicting control rejected;does not perform runtime recover;duplicate replay。 | service |
| `ClassifySandboxFailure_command` | `ClassifySandboxFailureFlow` | policy deny / timeout / backend / capture / redline classified;unknown markers remain pending input;not success;duplicate replay。 | domain + service |
| `EvaluateCleanupReadiness_command` | `EvaluateCleanupReadinessFlow` | allowed / blocked / pending evidence / pending investigation;query-like release not called;cleanup before handoff/investigation rejected。 | service |
| `RecordRedlineContainment_command` | `RecordRedlineContainmentFlow` | detected -> contained / handoff pending;investigation handoff unavailable marker;redline not advisory-only;cleanup blocked until guard allows。 | service + fake investigation |

---

## 11. Query 接口测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GetSandboxExecutionStatus_query` | `GetSandboxExecutionStatusFlow` | visible success;missing snapshot unavailable;not visible redacted;stale/degraded surface;assert no write UoW。 | query handler |
| `GetBoundaryStatus_query` | `GetBoundaryStatusFlow` | context-backed boundary visible;pending capability visible;direct boundary ref without read surface returns validation / missing;no backend call。 | query handler |
| `GetPolicyDecisionSummary_query` | `GetPolicyDecisionSummaryFlow` | accepted / rejected / fail-closed visible;missing snapshot degraded;no policy DSL body;no refresh。 | query handler |
| `GetCaptureSummary_query` | `GetCaptureSummaryFlow` | complete / partial / failed / empty capture;no artifact body;no handoff retry。 | query handler |
| `GetMaterialHandoffStatus_query` | `GetMaterialHandoffStatusFlow` | delivered / retryable / failed visible;direct handoff selector without index rejected;query no retry。 | query handler |
| `GetFailureControlStatus_query` | `GetFailureControlStatusFlow` | classified / pending input / control conflict visible;missing failure empty;no write。 | query handler |
| `GetCleanupReadiness_query` | `GetCleanupReadinessFlow` | allowed / blocked / pending investigation view;query never calls release adapter。 | query handler |
| `GetRedlineContainmentStatus_query` | `GetRedlineContainmentStatusFlow` | detected / contained / handoff pending;no redline empty;query never releases containment。 | query handler |
| `GetSandboxReadProjection_query` | `GetSandboxReadProjectionFlow` | fresh / stale / missing projection;context-only branch no ad-hoc projection ref;no rebuild。 | query handler |
| `GetDerivedInspectPreviewTrend_query` | `GetDerivedInspectPreviewTrendFlow` | fresh / stale / rebuilding / failed derived view;missing empty;no derived rebuild。 | query handler |
| `GetBackendCapabilityComparison_query` | `GetBackendCapabilityComparisonFlow` | comparison visible;missing / stale degraded;no backend capability refresh or scan。 | query handler |
| `GetSandboxReconciliationReport_query` | `GetSandboxReconciliationReportFlow` | clean / issues / degraded / failed report;scope-only current boundary rejected;no reconciliation run。 | query handler |
| `GetSandboxAuditTrace_query` | `GetSandboxAuditTraceFlow` | first page / next page / empty page;not visible trace redacted;page cursor not truth cursor;no audit append。 | query handler |

---

## 12. Inbound Event Consumer 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ConsumeCallerContextReferenceChanged_event` | reference consumer | accepted reference state + projection stale;duplicate stored receipt;forbidden body quarantined;`trace_record_ref=None`;reference cursor not source version。 | consumer |
| `ConsumePolicySummaryChanged_event` | policy summary consumer | policy reference state;affected projections stale;missing / stale source delayed;does not change rejected policy decision to accepted;no policy body。 | consumer |
| `ConsumeBackendCapabilitySummaryChanged_event` | capability consumer | backend reference state and comparison stale;unsupported capability visible;does not establish boundary;duplicate replay。 | consumer |
| `ConsumeIsolationBackendLifecycleSignal_event` | lifecycle consumer | handle / lease relation loaded from existing truth;orphan / failure marker when enough truth;missing relation delayed;no cleanup release。 | consumer |
| `ConsumeMaterialHandoffStatusChanged_event` | handoff feedback consumer | delivered / retryable / failed matched update;target mismatch quarantine;failed handoff no capture rollback;trace only when formal subject exists。 | consumer |
| `ConsumeObservabilityHandoffStatusChanged_event` | observability handoff consumer | observability marker only;missing observability material rejected;no observability store truth/body;receipt may have `trace_record_ref=None`。 | consumer |
| `ConsumeSandboxControlRequested_event` | trusted control consumer | maps to formal control command path;preserves command idempotency;conflict rejected;trusted source cannot bypass command gate。 | consumer + command |
| `ConsumeInvestigationHandoffStatusChanged_event` | investigation feedback consumer | cleanup / redline handoff marker updated only when matching truth;mismatch quarantine;does not release containment。 | consumer |
| `ConsumeSandboxTruthRelayFeedback_event` | relay feedback consumer | relay delivered / retryable / dead-letter update;source truth untouched;duplicate stored receipt。 | consumer |

---

## 13. Outbound Event / Relay 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `SandboxExecutionContextChanged_event` | context payload | accepted / rejected context payload uses context / identity / resolution refs only;no caller body;append relay in source UoW。 | contract + relay |
| `SandboxBoundaryChanged_event` | boundary payload | boundary / decision / handle refs;established / rejected payload;no backend raw response;no weak fallback event。 | contract + relay |
| `SandboxPolicyDecisionChanged_event` | policy payload | accepted / fail-closed / blocked decision refs;policy summary refs only;no policy DSL body。 | contract + relay |
| `SandboxRunChanged_event` | run payload | running / failed / terminated payload from run truth;no runtime agent loop body。 | contract + relay |
| `SandboxCaptureChanged_event` | capture payload | complete / partial / failed payload;material / observability refs only;no stdout / stderr / artifact body。 | contract + relay |
| `SandboxMaterialHandoffChanged_event` | handoff payload | delivered / retryable / failed;handoff failure no capture rollback;receipt refs only。 | contract + relay |
| `SandboxFailureChanged_event` | failure payload | classified / pending input;unknown not success;source marker refs only。 | contract + relay |
| `SandboxControlChanged_event` | control payload | kill / cancel / conflict visible;does not assert runtime recovery。 | contract + relay |
| `SandboxCleanupChanged_event` | cleanup payload | allowed / blocked / pending evidence;no release unless explicit guarded flow later。 | contract + relay |
| `SandboxRedlineContainmentChanged_event` | redline payload | detected / contained / handoff pending;redline not advisory-only;investigation refs only。 | contract + relay |
| `SandboxProjectionChanged_event` | projection payload | stale / fresh source cursor from truth / reference marker;no projection body dump。 | contract + relay |
| `SandboxDerivedViewChanged_event` | derived payload | rebuilt / failed derived status;source refs only;derived failure does not become core failure。 | contract + relay |
| `SandboxReconciliationFindingAvailable_event` | reconciliation payload | finding / degraded refs from report;does not repair truth。 | contract + relay |
| `PublishSandboxEventRelay_job_item` | relay publish | delivered / retryable / dead-letter;version conflict single-winner;publish failure updates relay / report only;source truth unchanged。 | worker / job |

---

## 14. Operations Job 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `PublishSandboxEventRelay_job` | `PublishSandboxEventRelayFlow` | pending batch;publish success / retryable / dead-letter;stored report replay;source truth unchanged。 | job runner |
| `RefreshSandboxReferenceStates_job` | `RefreshSandboxReferenceStatesFlow` | explicit / stale scope selection;resolver success / unavailable;reference marker cursor;affected projections from repository only;duplicate report replay。 | job runner |
| `RefreshBackendCapabilitySummaries_job` | `RefreshBackendCapabilitySummariesFlow` | supported / unsupported / stale / unavailable capability summary;no default allow;boundary not established by refresh。 | job runner |
| `RetryPendingMaterialHandoffs_job` | `RetryPendingMaterialHandoffsFlow` | pending / retryable handoff delivered / retryable / failed;capture truth unchanged;partial failure report。 | job runner |
| `RunLeaseOrphanReaper_job` | `RunLeaseOrphanReaperFlow` | expired lease selected;orphan suspected;backend lifecycle unavailable;release not called without cleanup guard。 | job runner |
| `EvaluatePendingCleanupGuards_job` | `EvaluatePendingCleanupGuardsFlow` | allowed / blocked / pending evidence / pending investigation;does not call release adapter。 | job runner |
| `MaintainRedlineContainmentHandoffs_job` | `MaintainRedlineContainmentHandoffsFlow` | investigation handoff opened / failed / pending;redline not released without guard;no advisory-only。 | job runner |
| `RebuildSandboxReadProjections_job` | `RebuildSandboxReadProjectionsFlow` | snapshot present fresh;missing snapshot degraded;stale -> rebuilding -> fresh;rebuild not from projection body;duplicate report replay。 | job runner |
| `MaintainDerivedInspectPreviewTrend_job` | `MaintainDerivedInspectPreviewTrendFlow` | source complete fresh;source missing failed / unavailable derived;no core failure classification。 | job runner |
| `RunSandboxReconciliation_job` | `RunSandboxReconciliationFlow` | clean / issues / degraded / failed report;stored report replay;does not repair truth / projection / relay。 | job runner |

---

## 15. 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `intake_identity_reference_states` | `ControlledExecutionIntakeStatus`;`ExecutionEnvironmentIdentityStatus`;`ReferenceResolutionStatus` | pending -> accepted / rejected / unresolved;identity active -> closed;reference resolved / stale / unavailable;accepted terminal no duplicate mutation。 | domain / reference |
| `boundary_capability_handle_lease_states` | `BoundaryDecisionStatus`;`BoundaryCoherenceStatus`;`BackendCapabilityStatus`;`IsolationHandleStatus`;`LeaseStatus`;`OrphanRecoveryStatus` | required -> established / rejected / failed;weak fallback illegal;active lease -> expired -> orphan suspected;release only after cleanup guard。 | domain + fake backend |
| `policy_high_risk_states` | `PolicyApplicabilityStatus`;`PolicyExecutionDecisionStatus`;`HighRiskActionDecisionStatus` | missing / stale / conflicted never allow;accepted / rejected / fail-closed / blocked;high-risk blocked path。 | domain + service |
| `run_capture_handoff_states` | `ControlledExecutionRunStatus`;`CaptureStatus`;`HandoffStatus` | preparing -> running -> completed / failed / terminated;capture complete / partial / failed / unavailable;handoff delivered / retryable / failed / dead-letter;handoff failure no capture rollback。 | domain + service |
| `failure_control_cleanup_redline_states` | `FailureClassificationStatus`;`ControlFactStatus`;`CleanupGuardStatus`;`RedlineContainmentStatus` | classified / pending input;control conflict;cleanup pending / blocked / allowed;redline detected -> contained -> handoff pending / terminal;no release before guard。 | domain + service |
| `read_projection_derived_reconciliation_states` | `QueryAccessStatus`;`SandboxProjectionStatus`;`DerivedFreshnessStatus`;`ReconciliationReportStatus` | visible / not-visible / degraded;fresh / stale / rebuilding / degraded;derived fresh / failed;reconciliation clean / issues / failed;query repair illegal。 | query + job |
| `relay_states` | `EventRelayStatus` | pending -> delivered / retryable / failed / dead-letter;delivered / dead-letter terminal;publish failure source unchanged。 | relay job |
| `idempotency_stored_replay_states` | `IdempotencyRecordStatus`;`StoredResultStatus` | reserved -> completed / failed / conflict;completed duplicate returns stored result;missing result returns duplicate missing,not recompute。 | idempotency fake |
| `consumer_job_entry_states` | `ConsumerReceiptStatus`;`JobReportStatus` | accepted / duplicate / delayed / failed / quarantined receipt;job succeeded / partial / failed / skipped / degraded / duplicate replay。 | worker / job |
| `adapter_runtime_states` | `AdapterAvailabilityStatus`;`RuntimeConfigStatus` | available / degraded / unavailable / disabled;valid / startup blocked / degraded;config cannot weaken hard guards。 | infra |

---

## 16. 一致性 / 幂等 / 并发测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_uow_ordering` | Step 9 / 11 | reserve -> read / adapter -> domain -> save truth -> audit / relay / stale -> stored result -> complete idempotency -> cursor -> commit 顺序。 | service + fake UoW |
| `rollback_visibility` | Step 11 / 13 | rollback 后 truth、audit、relay、projection stale、stored result、idempotency complete / failed、cursor 全部不可见。 | repository fake |
| `truth_cursor_source` | Step 11 | accepted truth cursor 由 UoW 分配并复制到 audit / relay / stored result;不得等于 page cursor、version、timestamp、trace id。 | repository fake |
| `reference_marker_cursor_source` | Step 11 / 13 | reference-only consumer / refresh cursor 来自 UoW reference marker cursor;不使用 source version / dedup key。 | consumer / repository |
| `expected_version_conflict` | Step 11 / 13 | stale `Versioned<T>.version` 更新冲突;rollback current UoW;允许 fresh-read same key retry。 | repository fake |
| `idempotency_parallel_reserve_race` | Step 13 | same operation/channel/key 并发 reserve 单赢家;second in-flight delayed / retryable;无重复 mutation。 | idempotency fake |
| `same_key_same_digest_duplicate` | Step 13 | completed duplicate 返回 stored command result / receipt / report;不重跑 resolver、backend、publisher、handoff、job。 | service / worker / job |
| `same_key_different_digest_conflict` | Step 13 | same key different digest 返回 `IdempotencyConflict` / quarantine;不 merge payload。 | idempotency fake |
| `duplicate_missing_result` | Step 12 / 13 | completed record missing stored result returns `DuplicateMissingResult`;不从 current truth 重算。 | service + fake store |
| `event_dedup_redelivery` | Step 13 | consumer redelivery returns stored receipt;不重复 reference / handoff / relay / control write。 | consumer |
| `job_duplicate_report_replay` | Step 13 | duplicate job returns stored report with same item refs;不重跑 publish / refresh / rebuild / reaper / reconciliation。 | job runner |
| `relay_publish_no_rollback` | Step 9 / 11 / 13 | publisher failure updates relay/report only;source truth remains committed。 | relay job |
| `handoff_no_capture_rollback` | Step 9 / 13 | handoff delivery failure updates handoff/report only;capture truth remains committed。 | handoff job |
| `query_no_write_violation_guard` | Step 9 / 12 / 15 | fake exposes write attempt;query missing projection returns surface;no UoW begin / audit append / adapter call。 | query service |
| `job_no_core_repair_guard` | Step 9 / 12 | maintenance job cannot accepted context / policy / run / capture truth;partial failure report-only。 | job runner |

---

## 17. 错误 / 配置 / 观测测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `public_error_redaction` | Step 8 / 12 / 15 | public error 不含 raw SQL、IO、HTTP、SDK body、panic stack、fake-only error、secret。 | error mapper |
| `unsupported_event_version` | Step 8 / 12 | unsupported version 不解析 payload、不写 reference state、不写 accepted trace,返回 rejected / delayed / quarantined receipt。 | worker |
| `adapter_unavailable_mapping` | Step 12 / 14 | resolver / backend / handoff / publisher unavailable 映射到 fail-closed、degraded、retryable、dead-letter 或 report,不 silent allow。 | adapter fake |
| `config_forbidden_boundary` | Step 14 | config 不能关闭 policy fail-closed、idempotency、query no-write、cleanup guard、redline containment、external body exclusion。 | config validation |
| `runtime_builder_blocked_degraded` | Step 14 / 15 | required adapter missing => startup blocked;optional read-side adapter unavailable => degraded surface;不写业务 audit before store。 | infra |
| `sibling_dependency_boundary` | Step 3 / 14 | 只有 `core-contracts` 可为 Cargo path dependency;其他 sibling repo 只能 port / event / handoff / fake。 | static check |
| `log_redaction_check` | Step 15 | structured logs 不含 raw request、raw event payload、adapter response body、stack trace、secret、external package body。 | check |
| `metric_label_cardinality_check` | Step 15 | metric labels 不含 request id、actor id、subject id、trace id、relay id、payload digest、free text、secret、raw endpoint。 | check |
| `audit_trace_refs_only` | Step 15 | `SandboxAuditTrace` 只含 body-free refs、state、reason、source cursor、receipt / report / diagnostic ref。 | repository / check |
| `observability_handoff_body_exclusion` | Step 15 | observability material / handoff marker 不保存 observability ledger body、archive package body、investigation document body。 | handoff fake |

---

## 18. 脚本契约表

本步不创建脚本。若后续实现仓需要交付测试门禁、报告生成或 redaction 检查脚本,脚本契约如下,由 `05/07` 判断是否纳入正式实施 boundary。

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id`;`--artifact-root`;`--config-profile` | 源码、配置、测试环境 | `artifacts/test/<run_id>` | 非 0 exit code;保留 failure report;不得伪造成功 evidence。 |
| `scripts/reports/generate_reports.sh` | report | `--run-id`;`--artifact-root`;`--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 非 0 exit code;说明缺失 artifact 或格式错误。 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root`;`--report-root` | artifacts + reports | `reports/runs/<run_id>/redaction-check.md` | 发现 raw secret / raw body / raw adapter response / stack trace 时失败。 |

脚本契约规则:

- artifact root 固定为 `artifacts/test/<run_id>`,report root 固定为 `reports/`。
- `run_id` 由真实执行环境生成;设计文档不得伪造。
- 脚本只作为后续实现契约候选,本 Step 不写脚本内容、不声明执行结果。

---

## 19. Historical Material / Blocker

| ID | 类型 | 状态 | 描述 | 本步处理 |
|---|---|---|---|---|
| SBX-DDD-TEST-001 | blocker | resolved_for_step_16 | Step 5~15 已定义模块、协议、flow、状态、事务、错误、幂等、配置和观测契约,但缺少统一最小测试入口,实现侧可能只测 happy path。 | 本步已输出模块、接口、状态机、一致性 / 幂等、错误 / 配置 / 观测测试切口。 |
| SBX-DDD-TEST-HIST-001 | historical_material | contained_as_historical_material | 旧 `05-测试方案.md` 和旧 README 的 backend / Docker / 性能 / 审计测试线索可能回流为当前 Step 16 真实测试结论。 | 本步不继承旧测试结果或旧用例,只按当前 Step 5~15 契约重建测试入口。 |
| SBX-DOC-GAP-TEST-001 | downstream_gap | open_downstream | 正式 `05-测试方案.md` 尚未重建。 | 不阻塞 Step 16;后续 `05` 必须承接本文测试切口并扩展为完整测试方案。 |
| SBX-DOC-GAP-001 | downstream_gap | open_downstream | 正式 `04-配置设计.md` 缺失。 | 不阻塞 Step 16;后续 `04` 承接 config profile、adapter health、observability backend、采样 / 保留等细节。 |
| SBX-DOC-GAP-002 | downstream_gap | open_downstream | 正式 `07-实施计划.md` 缺失。 | 不阻塞 Step 16;后续 `07` 创建 implementation ledger 和 planned boundary skeleton。 |

---

## 20. 回填草稿: `03-详细设计.md` §15

> 以下为 Step 19 装配正式 `03-详细设计.md` 时的候选正文草稿。当前 Step 不直接修改正式 `03-详细设计.md`。

L4-sandbox 的详细设计测试切口按模块、接口、状态机、一致性 / 幂等、配置 / 观测五类组织。模块测试覆盖 `contracts/domain/application/infra/api/worker/jobs` 七个实现模块。接口测试覆盖 10 个 Command、13 个 Query、9 个 Inbound Consumer、13 个 Outbound Event / Relay 和 10 个 Operations Job。状态机测试以 Step 10 enum 和迁移表为唯一真相源,每个状态族至少覆盖合法转换和非法转换。

所有 Query 测试必须断言 no-write:不 begin write UoW、不 append audit、不 mark stale、不 refresh/rebuild/handoff/cleanup/release。所有 Job 测试必须断言 no core truth repair。所有 duplicate replay 测试必须断言使用 stored result / receipt / report,不得重跑 resolver、backend、publisher、handoff、projection rebuild 或 job selection。Relay / handoff failure 测试必须断言 source / capture truth 不回滚。

所有配置和观测测试必须覆盖安全边界:配置不得弱化 fail-closed、cleanup guard、redline containment、external body exclusion、query no-write 或 idempotency;日志、指标、audit、receipt、report 和 handoff marker 不得保存 raw body、secret、stack trace、adapter response body、observability ledger body、archive package body 或 investigation document body。

---

## 21. Step 17 Handoff

| 交给 Step 17 的承接项 | 来源 |
|---|---|
| 模块测试切口已覆盖七个实现模块 | §9 |
| Command / Query / Consumer / Outbound / Job 测试切口已覆盖 Step 8 / Step 9 协议 | §10~§14 |
| 状态机测试切口已覆盖 Step 10 合法 / 非法迁移 | §15 |
| 事务 / rollback / cursor / idempotency / concurrency 测试切口已覆盖 Step 11~13 | §16 |
| 配置 / adapter / sibling dependency 测试切口已覆盖 Step 14 | §17 |
| log / metric / audit / redaction 测试切口已覆盖 Step 15 | §17 |
| 脚本契约候选已列出,但未创建脚本或真实结果 | §18 |
| `05-测试方案.md` 仍需完整展开用例、fixture、报告和真实门禁 | §19 |

---

## 22. 待确认事项

| 待确认项 | 当前处理 | 是否阻塞 Step 17 |
|---|---|---|
| 具体测试框架、fixture 目录、coverage 目标 | 留给 `05-测试方案.md` / `07-实施计划.md`。 | 否 |
| Durable store / bus / backend / observability / artifact / investigation 真实联调范围 | 留给 `05/07` 按实现 phase 判断。 | 否 |
| 脚本是否进入实现 boundary | 本步只给候选契约;`07` 决定是否创建 planned boundary skeleton。 | 否 |
| Direct selector index 是否后续开放 | 当前保持 validation / missing / degraded;若后续开放,必须回 Step 7/8/11 修正后再补测试。 | 否 |
| Release environment 的 exact command / job binding | 当前只测试 guard-before-release;exact implementation boundary 后续 `07` 承接。 | 否 |

---

## 23. 自检

| 检查项 | 结论 |
|---|---|
| 是否输出模块测试切口汇总表 | 通过。见 §9。 |
| 是否输出接口测试切口汇总表 | 通过。见 §10~§14。 |
| 是否输出状态机测试切口表 | 通过。见 §15。 |
| 是否输出一致性 / 幂等测试切口表 | 通过。见 §16。 |
| 是否回答 SOP 五个问题 | 通过。见 §5。 |
| 每个关键 Command / Query / Event / Job 是否有正向和异常入口 | 通过。见 §10~§14。 |
| 状态机是否覆盖合法 / 非法转换 | 通过。见 §15。 |
| 是否保留 query no-write、job no-repair、relay / handoff no-rollback | 通过。见 §8、§16。 |
| 是否禁止伪造测试结果 / run_id / evidence alias | 通过。本文未声明真实执行结果。 |
| 是否修改正式 `03-详细设计.md` | 未修改。本步只创建中间产物。 |
| 是否创建 Step 17 文件 | 未创建。 |

---

## 24. 进入下一步条件

```text
Step 16 已完成并停在用户审查点。
用户确认本文件后,才允许进入 Step 17 `收口详细设计到实施计划的承接清单`。
进入 Step 17 前必须读取:
1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_16_test_cuts.md`
4. Step 1~16 的全部已完成中间产物
5. 项目实施计划书写规范
6. 提交规范、git config 用户、Rust 编码规范、注释规范
7. 详细设计 SOP Step 17
8. 详细设计书写规范 §5.16
9. `设计文档讨论中间产物规范.md` 5.10 跨文档一致性复核规则
```
