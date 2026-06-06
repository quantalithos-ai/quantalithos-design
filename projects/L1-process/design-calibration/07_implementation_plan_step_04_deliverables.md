# L1-process 07 实施计划 Step 4: 抽取实施对象与交付物

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §4 实施对象与交付物清单
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 抽取实施对象与交付物 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_04_deliverables.md` |

本步从 `03/04/05/06` 中抽取本轮实施对象、交付物和非交付物。本步只列交付边界,不排序阶段和提交。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 会新增或修改哪些代码模块 | 目标实现仓 7 个 crate、scripts、artifacts / reports root、config fixtures 和 tests。 |
| 会新增哪些接口 / 事件 / job | 13 Command、11 Query、7 inbound event、10 outbound event、7 operations job。 |
| 会新增哪些测试 | contract、domain、service、integration、entry-contract、config-security、recovery-replay、evidence-scripts、minimum-e2e、p1-real-like-smoke。 |
| 会产生哪些配置 / 证据 | `local-dev`、`ci-test`、`integration-like`、`operations-replay`;`artifacts/test/<run_id>`;`reports/runs/<run_id>`;`reports/acceptance`。 |
| 哪些对象不交付 | 真实 production adapter、deployment topology、on-call runbook、P2 运维平台、外部正文存储。 |

## 3. 结构化中间产物

### 3.1 实施对象清单

| 实施对象 | 本轮口径 | 完成判定 |
|---|---|---|
| Rust workspace | `contracts / domain / application / infra / api / worker / jobs` | workspace 可编译,依赖方向不反转 |
| `process-contracts` | typed ref、state / reason、Command / Query / Event / Job / View / Error DTO、fixtures | DTO roundtrip、required field、domain-only type absent tests 通过 |
| `process-domain` | RuntimeProcessShape、ProcessProfile、ProcessInstance、Activity、Token、Gateway、WaitingGate、Checkpoint、RecoveryAttempt、Stage、Timebox、reference / trace / outbox、policy | domain unit、16 状态机、invariant 和 forbidden body tests 通过 |
| `process-application` | command / query / consumer / job services、port trait、UoW、idempotency、operation result、error mapping | service tests 验证事务顺序、幂等、rollback 和副作用 |
| `process-infra` | in-memory store、repository adapter、projection store、resolver、publisher、handoff、config、runtime builder、clock / id、observability | integration、config、redaction 和 adapter tests 通过 |
| `process-api` | synchronous Command / Query handler、DTO mapper、error mapping、route assembly | API validation、error mapping、query no-write tests 通过 |
| `process-worker` | inbound consumers、outbox publisher loop、projection invalidation worker | consumer dedup、quarantine / delayed、outbox retry 和 projection worker tests 通过 |
| `process-jobs` | projection rebuild、reference refresh、reconciliation、trace handoff、archive handoff、recovery maintenance job runner | job idempotency、partial failure、report ref 和 rerun tests 通过 |

### 3.2 协议交付物

| 协议组 | 数量 | 交付物 | 完成判定 |
|---|---:|---|---|
| Command | 13 | request / result DTO、metadata、idempotency、handler、service、stored result | `TC-PROC-CMD-001~013`;`EV-SERVICE-001` |
| Query | 11 | request / response / view / page DTO、authorization、projection marker、handler | `TC-PROC-QUERY-001~011`;`EV-SERVICE-002` |
| Inbound Event | 7 | envelope / payload / receipt、dedup、consumer service、quarantine / delayed | `TC-PROC-EVENT-001~007`;`EV-WORKER-001` |
| Outbound Event | 10 | event payload、outbox kind、publisher dispatch、retry / failed marker | `TC-PROC-PUB-001`;`EV-WORKER-002` |
| Operations Job | 7 | job DTO、job runner、receipt / report、partial failure / rerun | `TC-PROC-JOB-001~007`;`EV-JOB-001` |

### 3.3 协议名称清单

| 协议组 | 正式名称 |
|---|---|
| Command | `SyncRuntimeProcessShape`;`AdoptProcessProfile`;`UpdateProcessProfileTailoring`;`StartProcessInstance`;`AdvanceProcessActivity`;`RecordActivityFeedback`;`OpenWaitingGate`;`ResumeWaitingGate`;`CreateProcessCheckpoint`;`StartRecoveryAttempt`;`CompleteRecoveryAttempt`;`BindProcessTimebox`;`UpdateProcessStageState` |
| Query | `GetRuntimeProcessShape`;`GetProcessProfile`;`GetProcessInstance`;`GetActivityStatus`;`GetWaitingGate`;`GetRecoveryStatus`;`GetProcessTimeline`;`GetProcessProgressSummary`;`SearchProcessInstances`;`GetProcessTrace`;`GetReconciliationReport` |
| Inbound Event | `MethodDefinitionChangedEvent`;`WorkContextChangedEvent`;`IdentityActorCapabilityChangedEvent`;`GovernanceDecisionChangedEvent`;`ArtifactEvidenceChangedEvent`;`RuntimeActivityFeedbackEvent`;`ConversationContextChangedEvent` |
| Outbound Event | `RuntimeProcessShapeChangedEvent`;`ProcessProfileChangedEvent`;`ProcessInstanceChangedEvent`;`ActivityProgressedEvent`;`WaitingGateChangedEvent`;`ProcessCheckpointCreatedEvent`;`RecoveryAttemptChangedEvent`;`ProcessTimingChangedEvent`;`ProcessTraceAvailableEvent`;`DerivedProcessViewChangedEvent` |
| Operations Job | `PublishProcessOutboxJob`;`RebuildProcessProjectionsJob`;`RefreshExternalContextSnapshotsJob`;`RunProcessReconciliationJob`;`PrepareProcessTraceHandoffJob`;`PrepareProcessArchiveHandoffJob`;`MaintainRecoveryAttemptsJob` |

### 3.4 配置、脚本与证据交付物

| 交付物 | 预计落点 | 完成判定 |
|---|---|---|
| runtime config loader | `crates/infra/src/config.rs` | P0 profiles valid / invalid tests 通过 |
| runtime builder | `crates/infra/src/runtime_builder.rs` | api / worker / job 可从 config 装配 |
| fake / controlled adapters | `crates/infra/src/*` | resolver / publisher / handoff unavailable 不伪成功 |
| gate script | `scripts/gates/run_ci_gate.sh` | 支持 `--run-id`、`--artifact-root`、`--config-profile` |
| report generator | `scripts/reports/generate_reports.sh` | 从 artifact 生成 `reports/runs/<run_id>` |
| redaction checker | `scripts/checks/check_redaction.sh` | raw secret / raw body / forbidden body 命中则失败 |
| artifacts root | `artifacts/test/<run_id>` | suite reports、gate results、evidence json 可追溯 |
| reports root | `reports/runs/<run_id>`、`reports/acceptance` | evidence index、redaction、handoff、veto、risk acceptance 固定路径 |

### 3.5 非交付物清单

| 非交付物 | 原因 |
|---|---|
| production DB / MQ / search / trace / archive implementation | P0 只要求 in-memory / fake / controlled seam |
| method / work / governance / artifact / runtime / conversation / workspace 正文存储 | 违反 Process 数据归属 |
| production SLO / capacity hard threshold | 06 明确当前只做性能 sample report |
| deployment topology / config center / secret provider / on-call runbook | 属于部署运维材料 |
| 自动修复 Process truth 的 job | 违反 job no truth repair |

## 4. 回填草稿

```markdown
## 4. 实施对象与交付物清单

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施对象清单”“协议交付物”“协议名称清单”“配置、脚本与证据交付物”和“非交付物清单”小节。

本轮交付 `process-contracts`、`process-domain`、`process-application`、`process-infra`、`process-api`、`process-worker`、`process-jobs` 七个 workspace member,以及 P0 scripts、config、fixtures、tests、artifacts 和 reports。
```

## 5. 进入下一步条件

- 交付对象、协议数量和 evidence 产物已列出。
- 非交付物已显式排除。
- 后续 Step 5 可以按可验证功能增量排序。
