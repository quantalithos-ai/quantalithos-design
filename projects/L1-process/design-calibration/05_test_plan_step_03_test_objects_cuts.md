# Step 3. 抽取测试对象与测试切口

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 3 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节: `05-测试方案.md` §3 测试对象与测试切口
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。测试对象以 `03_ddd_step_16_test_cuts.md` 的最小验证清单为主输入,并结合 `03-详细设计.md` 正式章节和 `04-配置设计.md` 的配置测试交接。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 模块切口 | 7 个 crate 均有测试入口 |
| `03_ddd_step_06_object_contracts.md` | 对象 / policy / state holder | domain object、value object、policy、outbox、trace / archive 对象必须单测 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Event / Job DTO | public protocol 必须 roundtrip 和 required-field 测试 |
| `03_ddd_step_09_function_flows.md` | 写流、读流、consumer、job | application / worker / job orchestration 必须 service test |
| `03_ddd_step_10_state_matrix.md` | 16 状态机 | legal / illegal transition 必须 domain test |
| `03_ddd_step_11_persistence_transaction_consistency.md` | repository / UoW / result store | repository fake 与 transaction failure 必须测试 |
| `03_ddd_step_12_error_recovery.md` | public error 和恢复 | source unavailable、digest mismatch、rollback failure、permanent failure 必须测试 |
| `03_ddd_step_13_concurrency_idempotency.md` | 幂等和并发 | duplicate / conflict / commit unknown / race 必须测试 |
| `03_ddd_step_15_observability_audit.md` | 观测和审计 | forbidden body、low cardinality、audit refs、redaction 必须测试 |
| `04_config_step_12_downstream_handoff.md` | 配置测试交接 | config profile、secret、adapter、topic、drift 场景进入切口 |

---

## 3. SOP 问题回答

1. 哪些 domain object / value object / policy 必须单测?

   回答:RuntimeProcessShape、ProcessProfile、ProcessInstance、Activity、Token、Gateway、WaitingGate、ProcessCheckpoint、RecoveryAttempt、StageState、TimeboxBinding、ReferenceResolutionState、ProcessOutboxRecord、ProcessTraceRecord、TraceHandoffRecord、ArchiveHandoffRecord、ProcessReconciliationResult 及相关 policy / rule set 均需覆盖构造、不变量和状态迁移。

2. 哪些 application service 必须做 service test?

   回答:ProcessShapeSyncService、ProcessProfileCommandService、ProcessInstanceCommandService、ActivityProgressionService、WaitingGateCoordinationService、ProcessRecoveryService、ProcessRhythmService、AuthorizedProcessQueryService、ProcessConsumerService、ProcessOutboxService 和 operations job services 均需验证编排顺序、UoW、idempotency、operation result 和 error mapping。

3. 哪些 repository / adapter / worker 必须做集成测试?

   回答:truth repository、projection store、idempotency store、operation result store、outbox repository、source resolver、publisher、handoff adapter、runtime builder、inbound consumer、outbox publisher loop 和 job runner 均需 fake / in-memory 集成测试;durable / real-like 集成为 P1。

4. 哪些 Command / Query / Event / Job 必须做协议和流程测试?

   回答:13 个 Command、11 个 Query、7 个 inbound event、10 个 outbound event、7 个 operations job 全部必须有协议和流程测试入口,不得只挑 happy path。

5. 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口?

   回答:16 组状态机、UoW ordering、save result before idempotency complete、outbox consistency、rollback failure、version conflict、duplicate replay、same key different digest、commit unknown、partial failure、source unavailable、quarantine、delayed、no auto repair 必须单列切口。

6. 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口?

   回答:Command metadata 缺 idempotency key、Event dedup key 缺失、Job idempotency key 缺失、Query 误带写入语义、required field 缺失、enum variant 非法、source digest mismatch、payload body forbidden、raw secret config、topic map missing、configured adapter fallback fake 均需负向测试。

7. 哪些状态名必须以详细设计正式 enum variant 为准?

   回答:所有状态断言必须使用 `RuntimeProcessShapeState`、`ProcessProfileState`、`ProcessInstanceState`、`ActivityState`、`TokenState`、`GatewayState`、`WaitingGateState`、`CheckpointState`、`RecoveryAttemptState`、`StageState`、`TimeboxBindingState`、`ProjectionFreshnessState`、`ReferenceResolutionLifecycleState`、`TraceHandoffState`、`OutboxPublicationState`、`ReconciliationResultState`、`ProcessProgressState` 的正式 variant。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 测试对象只覆盖旧主线,缺 Command / Query / Event / Job 全量协议切口 | 新切口覆盖所有 public protocol |
| `03` §15 | 切口已完整,但不是正式测试方案章节结构 | 本 Step 转为测试对象总表 |
| `04` §12 | 配置测试交接未并入对象切口 | 本 Step 将 config / runtime builder / adapter binding 纳入切口 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 对象切口 | Template / Profile / Instance 方向性描述 | domain object、DTO、repository、adapter、worker、job、script 全切口 |
| 状态切口 | 少量运行态状态 | 16 组正式状态机 |
| 事务切口 | checkpoint / recovery 粗粒度 | UoW、operation result、idempotency、outbox、rollback、version conflict |
| 配置切口 | dev / test / staging 环境 | config loader、validator、runtime builder、secret、redaction、topic、dependency scan |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否把所有切口都做 E2E | 否。对象和状态在 unit 层发现,编排在 service 层发现,跨模块接缝在 integration / worker / job 层发现 |
| 是否每个 protocol 都有测试入口 | 是。public protocol 是实现边界,缺测试会导致 1:1 落码回归难以定位 |
| 是否单列脚本测试 | 是。`03` 已给 gate / report / redaction script 契约,必须进入测试方案 |
| 是否允许 query 修 projection | 否。Query no-write 是 P0 切口 |

---

## 7. 结构化中间产物

### 7.1 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `contracts` DTO | `03` §7 | Command / Query / Event / Job / View / Error roundtrip、required fields、enum variant | public protocol 与实现漂移 | contract unit |
| Command metadata / operation digest | `03` §7 / §12 | idempotency key、operation namespace、canonical digest、volatile metadata 排除 | duplicate replay 错误 | contract unit |
| Query metadata | `03` §7 / §8 | Query 不携带 idempotency key,不写 truth | 读路径污染状态 | contract + query |
| RuntimeProcessShape / ProcessProfile | `03` §6 / §9 | adoption、tailoring、retired / stale / active 状态转换 | profile 错误启动实例 | domain unit |
| ProcessInstance / Activity / Token / Gateway | `03` §6 / §9 | start、advance、route、join、terminal guard;commit-03-a 只覆盖 running subset,waiting/recovery reserved | 运行态推进错误 | domain unit + service |
| WaitingGate / ProcessCheckpoint / RecoveryAttempt | `03` §6 / §9 | PH-04 起覆盖 open、resume、checkpoint、recover、abandon、expired guard | 恢复链断裂 | domain unit + service |
| StageState / TimeboxBinding | `03` §6 / §9 | stage activate / pause / complete / skip;timebox stale / release | 节奏状态污染 Work truth | domain unit + service |
| ReferenceResolutionState | `03` §6 / §9 / §11 | resolved / stale / unavailable / invalid;last good snapshot | 外部 snapshot 污染 truth | reference fake |
| ProcessOutboxRecord | `03` §6 / §10 / §15 | truth change mapping、publication state、retry / failure | 下游事件漏发或乱发 | domain + worker |
| ProcessTraceRecord / audit | `03` §6 / §14 | accepted change trace、reject 不写 success trace、refs only | 审计不可追溯或泄露正文 | service + observability |
| TraceHandoffRecord / ArchiveHandoffRecord | `03` §6 / §9 / §11 | delivered / failed / cancelled、retry / permanent failure、no body persisted | 交接重复或敏感正文入库 | domain + job |
| ReconciliationResult | `03` §6 / §9 | clean / has issues / failed / partial,report 不修 truth | reconciliation 越权修复 | job |
| 13 Command flows | `03` §7 / §8 | success、reject、duplicate、conflict、rollback | 写路径 partial commit | API + service |
| 11 Query flows | `03` §7 / §8 | hit、missing、not visible、degraded、no-write | query 副作用 | query handler |
| 7 inbound event consumers | `03` §7 / §8 | accepted、duplicate、quarantine、delayed、noop | 外部事件污染状态 | worker |
| 10 outbound event payloads | `03` §7 / §8 | payload mapping、forbidden body absent、publish failure marker | event contract 漂移 | publisher contract |
| 7 operations jobs | `03` §7 / §8 | invalid input、duplicate receipt、partial failure、no auto repair | job 越权修改 truth | job runner |
| Repository / UnitOfWork | `03` §10 / §12 | version conflict、rollback、save result before complete | 一致性破坏 | infra fake |
| Idempotency / operation result store | `03` §10 / §12 | same key same digest replay、same key different digest conflict、result missing | duplicate 重放错误 | service + fake store |
| Config loader / validator / runtime builder | `04` §5~§12 | defaults、JSON、env、secret ref、topic map、adapter binding、fail-fast | 配置绕过红线 | config test |
| Source resolver / publisher / handoff adapter | `03` §6~§8 / `04` §7 | retryable / permanent failure、configured 不 fallback fake、body rejected | 外部接缝伪成功 | adapter fake |
| Gate / report / redaction scripts | `03` §15 | script args、artifact / report paths、failure semantics、redaction scan | 证据不可审计 | script test |

### 7.2 P0 切口覆盖清单

| P0 切口 | 覆盖要求 |
|---|---|
| 模块 | 7 个 workspace member 均有测试入口 |
| Command | 13 个 Command 每个 success + reject/error + duplicate/conflict |
| Query | 11 个 Query 每个 hit + missing/not visible/degraded + no-write |
| Inbound event | 7 个 event 每个 accepted + duplicate + quarantine/delayed/noop |
| Outbound event | 10 个 event 每个 payload mapping + forbidden body absent + publish failure |
| Operations job | 7 个 job 每个 completed + duplicate + invalid input + partial failure |
| 状态机 | P0 总体验收覆盖 16 组状态机每个 legal + illegal transition;单个 commit boundary 只覆盖该 boundary 非 reserved 子集 |
| 横切 | duplicate replay、idempotency conflict、result missing、version conflict、commit unknown、rollback failure |
| 安全 / 配置 | forbidden body、raw secret、config validation、topic map missing、no fake fallback |
| 证据 | gate artifact、report、evidence index、redaction check |

---

## 8. 回填草稿

`05-测试方案.md` §3 应以表格列出测试对象、来源章节、测试切口、风险和推荐测试层级。正文必须强调所有 P0 测试对象可以反查 `03-详细设计.md` 或 `04-配置设计.md`,且用例断言不得使用旧状态名或临时字段。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP03-OPEN-001 | durable store / real broker / real sibling adapter 的具体环境 | P1 接缝测试先用 fake / in-memory,真实环境进入 Step 8 / Step 14 风险 |
| TP03-OPEN-002 | future P2 remote config / admin override 测试对象 | 只记录演进风险,不进入当前用例矩阵 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 测试对象都有明确切口 | 通过 |
| 测试切口能回指设计真相源 | 通过 |
| 字段 / 状态 / protocol 不使用旧口径 | 通过 |
