# L1-process 07 实施计划 Step 6: 阶段任务、编写顺序与提交边界

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_06_tasks_commits.md` |

本步把 PH-01~PH-10 拆成可执行任务、代码批次和 commit boundary。本步不执行实现仓代码修改。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-10 阶段顺序 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承实施对象、交付物和非交付物 |
| `03-详细设计.md` | 已完成 | 提取协议、flow、状态、事务、幂等、配置和测试切口 |
| `05-测试方案.md` | 已完成 | 提取 TC / EV / suite / artifact 门禁 |
| `06-验收标准.md` | 已完成 | 提取 AC / VF / ST / RL 门禁 |
| `standards/document/实施计划书写规范.md` | 已读取 | 约束提交边界、批次规模和 commit message |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个阶段有哪些实施动作 | 每阶段按 contract/test fixture、domain/state、application flow、infra/entry wiring、evidence gate 五类动作拆分。 |
| 阶段内代码顺序 | 先锁定 DTO / fixture / negative tests,再写 domain,再写 application,再接 infra / API / worker / jobs,最后跑门禁。 |
| 是否先锁定外部契约和测试切口 | 是。Command / Query / Event / Job DTO 与失败用例先于内部实现。 |
| 哪些必须同提交 | 同一可验证纵切内的 DTO、domain、service、fake adapter 和 tests 可同提交;不同阶段或不同状态链不得混提交。 |
| 哪些不能提交 | 未编译、未跑本 boundary 门禁、缺 stored result / evidence、混入 production adapter 或无关用户改动时不得提交。 |
| 是否存在过大批次 | PH-02~PH-09 都可能过大,因此每阶段至少拆成 contract/domain 与 service/entry 两类 boundary;超过 300 行继续拆。 |
| 发现设计冲突如何处理 | 暂停当前 boundary,记录精确文件 / 行号 / 影响范围,回写 design repo,不得在实现侧自行补 schema、状态或 phase scope。 |

## 4. 结构化中间产物

### 4.1 全局编写顺序规则

| 顺序 | 动作 | 原因 |
|---:|---|---|
| 1 | 阅读当前 phase / boundary 的正式章节和对应 calibration | 确认字段、DTO、状态、事务、测试和 phase scope |
| 2 | 写或更新 DTO / fixture / negative case / expected evidence skeleton | 先锁定外部行为 |
| 3 | 写 domain object、policy、state transition 和 unit tests | 让不变量独立可测 |
| 4 | 写 application service、port、UoW、idempotency 和 result replay | 集中事务、幂等和副作用 |
| 5 | 写 infra fake / in-memory adapter、API / worker / job wiring | 支撑 P0 可验证路径 |
| 6 | 跑本批次门禁并记录 artifact | 确认当前批次可验证 |
| 7 | 达到 commit boundary 后提交 | 只提交已验证的可 review 增量 |

### 4.2 Commit Boundary 总表

| 提交边界 | 对应阶段 | 提交时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|---|
| commit-01-a | PH-01 | workspace 和 7 crate skeleton 可编译后 | root `Cargo.toml`、7 crate、唯一 `core-contracts` dependency | 业务 DTO、domain、API route | `cargo check`;dependency scan |
| commit-01-b | PH-01 | config / scripts / evidence roots 可检查后 | config fixtures、runtime builder skeleton、gate/report/redaction script shell、artifact/report roots | 业务测试完整实现、最终 EV page | script `--help`;path grep |
| commit-02-a | PH-02 | shape/profile contracts + domain tests 通过后 | `SyncRuntimeProcessShape`、`AdoptProcessProfile`、`UpdateProcessProfileTailoring` DTO、shape/profile domain、fixtures | application service wiring | contract + domain tests |
| commit-02-b | PH-02 | shape/profile write flow 可重复验证后 | service、handler、repo/UoW fake、idempotency、operation result、outbox intent | instance/activity | command service tests;rollback/duplicate tests |
| commit-03-a | PH-03 | instance/activity contracts + domain tests 通过后 | `StartProcessInstance`、`AdvanceProcessActivity`、`RecordActivityFeedback` DTO、instance/activity/token/gateway domain | waiting/recovery、consumer | contract + state tests |
| commit-03-b | PH-03 | instance/activity service 和 progression tests 通过后 | service、handler、progression UoW、trace/outbox/result | query、jobs | command / tx / idempotency tests |
| commit-04-a | PH-04 | waiting/checkpoint/recovery contracts + domain tests 通过后 | gate/checkpoint/recovery DTO、domain state、fixtures | service orchestration | contract + recovery state tests |
| commit-04-b | PH-04 | waiting/recovery services 和 failure tests 通过后 | gate/checkpoint/recovery services、repo fake、rollback / commit unknown handling | rhythm、jobs | recovery / integration tests |
| commit-05-a | PH-05 | rhythm contracts + domain tests 通过后 | `BindProcessTimebox`、`UpdateProcessStageState` DTO、stage/timebox domain | service wiring | contract + state tests |
| commit-05-b | PH-05 | rhythm service / handler tests 通过后 | rhythm service、work snapshot marker、trace/outbox/result | query read model | command + boundary tests |
| commit-06-a | PH-06 | query/view contracts 和 fixtures 通过后 | 11 Query DTO、view DTO、page/status/marker fixtures | repository implementation | query contract tests |
| commit-06-b | PH-06 | authorized read model / projection service tests 通过后 | projection store、query services、trace read、no-write guard | API handlers / search final wiring | query no-write + projection tests |
| commit-06-c | PH-06 | query handlers、search、timeline、reconciliation read tests 通过后 | API query handlers、search/timeline/trace/report read surface | inbound consumer | `TC-PROC-QUERY-001~011` |
| commit-07-a | PH-07 | inbound shared envelope / receipt contracts 通过后 | `InboundEventEnvelope`、consumer receipt、dedup/quarantine shared refs、`MethodDefinitionChangedEvent`、`WorkContextChangedEvent` fixtures | 其他 inbound DTO、consumer service implementation | targeted event contract tests |
| commit-07-b | PH-07 | external governance / evidence inbound DTO fixtures 通过后 | `IdentityActorCapabilityChangedEvent`、`GovernanceDecisionChangedEvent`、`ArtifactEvidenceChangedEvent` DTO 和 negative fixtures | runtime / conversation inbound DTO、consumer services | targeted event contract tests |
| commit-07-c | PH-07 | runtime / conversation inbound DTO fixtures 通过后 | `RuntimeActivityFeedbackEvent`、`ConversationContextChangedEvent` DTO、digest/body negative fixtures | consumer service implementation | event contract tests;redaction targeted |
| commit-07-d | PH-07 | external reference consumer service tests 通过后 | method / work / identity / governance / artifact consumers、resolver fake、snapshot/stale/pending/quarantine store | runtime feedback consumer、outbound publisher | `TC-PROC-EVENT-001~005`;redaction |
| commit-07-e | PH-07 | runtime feedback / conversation consumer tests 通过后 | runtime feedback consumer、conversation context consumer、duplicate/quarantine/delayed receipt replay | outbound publisher | `TC-PROC-EVENT-006~007`;`EV-WORKER-001` slice |
| commit-08-a | PH-08 | outbound shared envelope / shape/profile payload tests 通过后 | outbound envelope、topic map seed、outbox event kind、`RuntimeProcessShapeChangedEvent`、`ProcessProfileChangedEvent` payload builders | instance/activity payloads、publisher loop | targeted publisher contract + redaction tests |
| commit-08-b | PH-08 | instance / activity / timing payload builder tests 通过后 | `ProcessInstanceChangedEvent`、`ActivityProgressedEvent`、`ProcessTimingChangedEvent` DTO 和 payload builders | waiting/recovery/trace/view payloads、publisher loop | targeted payload mapping tests |
| commit-08-c | PH-08 | waiting / checkpoint / recovery payload builder tests 通过后 | `WaitingGateChangedEvent`、`ProcessCheckpointCreatedEvent`、`RecoveryAttemptChangedEvent` DTO 和 payload builders | trace/view payloads、publisher loop | targeted payload mapping tests |
| commit-08-d | PH-08 | trace / derived view outbound mapping tests 通过后 | `ProcessTraceAvailableEvent`、`DerivedProcessViewChangedEvent` DTO、complete 10-event mapping/redaction matrix | publisher loop | full outbound contract + redaction tests |
| commit-08-e | PH-08 | publisher retry/failure tests 通过后 | publisher port/fake、worker loop、retry/failed state、topic map verification | operations jobs | `TC-PROC-PUB-001`;`EV-WORKER-002` |
| commit-09-a | PH-09 | shared job schema / publish job DTO tests 通过后 | job metadata、job idempotency、`JobRunReceipt`、`JobError`、report refs、`PublishProcessOutboxJob` DTO | non-publish job DTO、job runners | job shared contract tests |
| commit-09-b | PH-09 | projection / refresh / reconciliation job DTO tests 通过后 | `RebuildProcessProjectionsJob`、`RefreshExternalContextSnapshotsJob`、`RunProcessReconciliationJob` DTO 和 report fixtures | handoff/recovery job DTO、job runners | targeted job contract tests |
| commit-09-c | PH-09 | handoff / recovery job DTO tests 通过后 | `PrepareProcessTraceHandoffJob`、`PrepareProcessArchiveHandoffJob`、`MaintainRecoveryAttemptsJob` DTO 和 invalid input fixtures | job runners | job contract tests;no truth repair fixture |
| commit-09-d | PH-09 | projection / refresh / reconciliation runner tests 通过后 | projection rebuild、external context refresh、reconciliation runners、partial reports | handoff/recovery maintenance runners | `TC-PROC-JOB-002~004`;partial report tests |
| commit-09-e | PH-09 | trace/archive handoff runner tests 通过后 | trace handoff runner、archive handoff runner、handoff fake、failed/delayed marker | recovery maintenance runner | `TC-PROC-JOB-005~006`;handoff evidence |
| commit-09-f | PH-09 | recovery maintenance and full job suite 通过后 | recovery maintenance runner、rerun behavior、full job evidence report | final release reports | `TC-PROC-JOB-001~007`;`EV-JOB-001`;no truth repair |
| commit-10-a | PH-10 | release scripts 和最小 evidence index 壳可运行后 | final gate script, path checks, redaction checker, minimal evidence index shell | final EV detail pages / acceptance conclusion | `TC-PROC-SCRIPT-001~003`;redaction |
| commit-10-b | PH-10 | final EV pages、acceptance handoff、veto 和 risk report 生成后 | EV detail pages、acceptance handoff、veto checklist、risk acceptance | 新功能 / production adapter | release gate;`EV-E2E-001`;AC/VF check |

### 4.3 阶段任务拆分

| 阶段 | 任务编号 | 编写顺序 | 实施动作 | 输出 | 完成判定 |
|---|---|---:|---|---|---|
| PH-01 | IMPL-01-01 | 1 | 创建 target repo、workspace 和 7 crate | root workspace / empty crates | `cargo check` |
| PH-01 | IMPL-01-02 | 2 | 接入唯一 `core-contracts` dependency | path dependency | dependency scan 通过 |
| PH-01 | IMPL-01-03 | 3 | 创建 config/runtime builder skeleton | config fixtures / loader shell | config smoke 通过 |
| PH-01 | IMPL-01-04 | 4 | 创建 gate/report/redaction scripts 与 evidence roots | scripts / artifacts / reports | script help / path checks |
| PH-02 | IMPL-02-01 | 1 | 定义 shape/profile DTO 和 fixtures | contracts tests | roundtrip / required field 通过 |
| PH-02 | IMPL-02-02 | 2 | 实现 RuntimeProcessShape / ProcessProfile domain | domain tests | state / policy 通过 |
| PH-02 | IMPL-02-03 | 3 | 实现 shape/profile service、idempotency、result replay | service tests | duplicate / conflict / rollback 通过 |
| PH-02 | IMPL-02-04 | 4 | 接 API handler 和 pending outbox | API / outbox tests | AC-PROC-001/006 证据可生成 |
| PH-03 | IMPL-03-01 | 1 | 定义 instance/activity/progression DTO | contracts tests | success / negative fixture 通过 |
| PH-03 | IMPL-03-02 | 2 | 实现 ProcessInstance / Activity / Token / Gateway state | domain tests | legal / illegal transition 通过 |
| PH-03 | IMPL-03-03 | 3 | 实现 start / advance / feedback services | service tests | trace/outbox/result 同 UoW |
| PH-04 | IMPL-04-01 | 1 | 定义 waiting/checkpoint/recovery DTO | contracts tests | DTO validation 通过 |
| PH-04 | IMPL-04-02 | 2 | 实现 WaitingGate / Checkpoint / RecoveryAttempt state | domain tests | recovery continuity 通过 |
| PH-04 | IMPL-04-03 | 3 | 实现 gate / checkpoint / recovery services | integration tests | commit unknown / no fork 通过 |
| PH-05 | IMPL-05-01 | 1 | 定义 rhythm command DTO | contracts tests | DTO validation 通过 |
| PH-05 | IMPL-05-02 | 2 | 实现 ProcessStageState / TimeboxBinding | domain tests | work truth 不混淆 |
| PH-05 | IMPL-05-03 | 3 | 实现 rhythm service 和 snapshot marker | service tests | outbox / trace / result 闭合 |
| PH-06 | IMPL-06-01 | 1 | 定义 11 Query / view / page DTO | query contract tests | no idempotency key / status stable |
| PH-06 | IMPL-06-02 | 2 | 实现 read model / projection / trace read | service tests | no-write / degraded marker 通过 |
| PH-06 | IMPL-06-03 | 3 | 接 API query handlers、search、timeline、report read | handler tests | `TC-PROC-QUERY-*` 通过 |
| PH-07 | IMPL-07-01 | 1 | 定义 inbound envelope / receipt 和 method / work DTO | event contract tests | envelope / dedup key stable |
| PH-07 | IMPL-07-02 | 2 | 定义 identity / governance / artifact inbound DTO | event contract tests | source / digest / forbidden body negative |
| PH-07 | IMPL-07-03 | 3 | 定义 runtime feedback / conversation inbound DTO | event contract tests | runtime feedback digest 与 conversation context ref stable |
| PH-07 | IMPL-07-04 | 4 | 实现外部 reference consumer services 和 resolver fake | worker tests | accepted / duplicate / quarantine / delayed |
| PH-07 | IMPL-07-05 | 5 | 实现 runtime feedback / conversation consumers | worker tests | receipt replay 与 targeted redaction |
| PH-08 | IMPL-08-01 | 1 | 定义 outbound envelope、topic map seed、shape/profile payload | contract tests | payload ref-only / no body |
| PH-08 | IMPL-08-02 | 2 | 定义 instance / activity / timing payload builder | contract tests | truth change mapping stable |
| PH-08 | IMPL-08-03 | 3 | 定义 waiting / checkpoint / recovery payload builder | contract tests | payload snapshot 不重算 current truth |
| PH-08 | IMPL-08-04 | 4 | 定义 trace / derived view payload builder 和完整映射矩阵 | contract tests | 10 event mapping / redaction complete |
| PH-08 | IMPL-08-05 | 5 | 实现 publisher fake、topic map、retry / failed | worker tests | publish / retry / failed |
| PH-09 | IMPL-09-01 | 1 | 定义 job shared schema 和 publish outbox job DTO | job contract tests | metadata / receipt / error stable |
| PH-09 | IMPL-09-02 | 2 | 定义 projection / refresh / reconciliation job DTO | job contract tests | duplicate / invalid input |
| PH-09 | IMPL-09-03 | 3 | 定义 handoff / recovery maintenance job DTO | job contract tests | no truth repair fixture |
| PH-09 | IMPL-09-04 | 4 | 实现 projection / refresh / reconciliation runners | job tests | partial report / no repair |
| PH-09 | IMPL-09-05 | 5 | 实现 trace/archive handoff runners 和 fake adapter | job tests | handoff evidence / delayed marker |
| PH-09 | IMPL-09-06 | 6 | 实现 recovery maintenance runner 与 full job suite | job tests | rerun / `EV-JOB-001` |
| PH-10 | IMPL-10-01 | 1 | 完成 gate/report/redaction/path checks | script tests | fixed run path / no latest |
| PH-10 | IMPL-10-02 | 2 | 生成 EV detail、acceptance handoff、veto、risk report | reports | AC / VF 可判定 |

### 4.4 开工前设计闭环复核矩阵

| Boundary 类型 | 开工前必须复核 | 未闭合处理 |
|---|---|---|
| Contract / DTO | 字段、required、enum variant、metadata、idempotency、JSON 示例、fixture | 暂停,回写 Step 8 / protocol |
| Domain / State | 字段来源、构造函数、legal / illegal transition、错误类型、测试切口 | 暂停,回写 Step 6 / 10 |
| Service / UoW | flow 顺序、expected version、operation result store、duplicate replay、rollback | 暂停,回写 Step 9 / 11 / 13 |
| Query / Projection | view schema、projection source、degraded marker、no-write、authorization | 暂停,回写 Step 7 / 8 / 9 / 11 |
| Consumer | envelope、dedup、source resolver、quarantine / delayed、forbidden body | 暂停,回写 Step 7 / 8 / 9 / 12 |
| Outbox / Job | truth change mapping、payload builder、retry / failed、report materialization | 暂停,回写 Step 6 / 8 / 9 / 10 |
| Script / Evidence | artifact root、report root、EV id、redaction input、acceptance path | 暂停,回写 `05/06/07` |

### 4.5 提交粒度判断表

| 判断项 | 可以提交 | 必须继续拆分或暂停 |
|---|---|---|
| 一句话描述 | 能说清一个 boundary 的功能纵切 | 需要列多个无关能力才能说明 |
| 验证 | 本 boundary 门禁全部通过 | 只通过 fmt / check,业务测试缺失 |
| 改动范围 | 相关 contracts/domain/service/adapter/tests | 混入其他 phase、production adapter 或文档无关修改 |
| 代码量 | 100~300 行为主,高风险逻辑可更小 | 单批预计超过 500 行 |
| 回退 | 可独立 revert 而不破坏前序 phase | 与后续 phase 互相依赖 |

## 5. 回填草稿

```markdown
## 6. 阶段任务拆分、编写顺序与提交边界

> 校准来源:
> - `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Commit Boundary 总表”“阶段任务拆分”“开工前设计闭环复核矩阵”和“提交粒度判断表”小节。

每个 commit boundary 必须对应一个可验证功能纵切。提交前必须通过本 boundary 声明的 fmt/check/test/gate,并且不得混入当前 boundary 之外的用户改动或后续 phase 功能。
```

## 6. 进入下一步条件

- commit-01-a 到 commit-10-b 的阶段顺序已固定;PH-07 / PH-08 / PH-09 内部细分为 commit-07-a~e、commit-08-a~e、commit-09-a~f,用于降低协议 / job 批次风险。
- 阶段任务、编写顺序、开工复核和提交粒度已定义。
- 后续 Step 7 可以嵌入测试与验收门禁。
