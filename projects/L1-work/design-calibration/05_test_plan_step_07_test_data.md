# Step 7. 设计测试数据

> 本步定义 `05-测试方案.md` §7 的测试数据集、fixture / builder / seed 规则、隔离键和清理方式。本步只定义测试数据设计,不提前写测试环境拓扑、CI 命令或验收裁决。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 7 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §7 测试数据设计 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_06_cases_matrix.md` | P0 用例前置条件、输入 / 操作、预期结果和断言点 |
| `03_ddd_step_06_object_contracts.md` | Project、Backlog、WorkItem、PromoteResult、Dependency、Blocker、Iteration、Reference、Projection、Config 等对象契约 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | in-memory repository、fake resolver、fake publisher、fake handoff、deterministic clock / id 契约 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Event / Job DTO 和 metadata / page / idempotency 字段来源 |
| `03_ddd_step_09_function_flows.md` | 每个 flow 需要的前置 truth、reference state、projection state 和失败注入点 |
| `03_ddd_step_10_state_matrix.md` | 合法 / 非法状态组合和终态样本 |
| `04-配置设计.md` §6~§12 | P0 profile、配置项、敏感配置、加载校验、失败模式和 fake / configured adapter 边界 |
| `测试方案讨论流程_SOP.md` Step 7 | 本步问题、期望表格和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些基础数据必须存在? | 必须有 deterministic run scope、actor / metadata、Project + Backlog、ProjectMember + capability snapshot、formal Work、source / evidence / timebox ref、idempotency record、trace / audit / outbox、projection / reference state 和 profile config 数据集。 |
| 哪些边界、异常、并发和恢复数据必须构造? | 必须构造 missing / not visible、unresolved / failed resolver、forbidden body、locked / archived / terminal state、cycle graph、version conflict、idempotency conflict、publisher failure、projection failed、handoff failure 和 replay digest mismatch 数据。 |
| 数据如何隔离不同测试运行? | 所有测试数据使用测试运行隔离键 `test_run_id` 和 deterministic id prefix。`test_run_id` 只是测试隔离标签,不是 Work domain 字段、协议字段或正式配置项。 |
| 数据如何清理? | P0 默认使用 per-test in-memory store / temp directory;测试后 drop store、删除 temp dir、reset fake adapter queues、清空 captured log / report。real-like 数据只允许在后续 Step 8 环境矩阵中单独声明清理策略。 |
| 哪些外部依赖使用 fake / stub / real-like? | P0 `local-dev` / `ci-test` 使用 deterministic fake;`integration-like` 可使用 controlled configured adapter refs,但不要求真实生产 endpoint;`operations-replay` 使用脱敏历史状态和 event / job replay seed。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 6 用例矩阵 | 已有前置条件,但没有统一 fixture / seed 来源 | 本步建立数据集表和数据到用例映射 |
| `03-详细设计.md` §15 | 只要求可测切口,未说明测试数据如何隔离和清理 | 本步定义 run-scoped isolation 和 cleanup |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已列 P0 fake / in-memory adapter,但未映射到测试数据 | 本步把 fake adapter 能力映射到 success / unresolved / unavailable / failure seed |
| `04-配置设计.md` §12 | 已承接配置测试,但没有配置 fixture 规则 | 本步定义 profile config、invalid config、sensitive output 数据集 |

## 5. 改动前后对比

| 维度 | Step 6 后 | Step 7 收敛后 |
|---|---|---|
| 用例前置条件 | 可执行骨架 | 每个 P0 用例族有数据集来源 |
| 外部依赖 | 说明使用 fake / configured | 定义 fake resolver / publisher / handoff 的 success / failure seed |
| 隔离 | 尚未定义 | 使用 `test_run_id`、deterministic id prefix、per-test store / temp dir |
| 清理 | 尚未定义 | drop store、删除 temp dir、reset fake queues、清空 captured output |
| 上游影响 | 无 | 无;本步不新增 domain 字段、DTO、trait 或配置项 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 所有用例共享一套全量 golden dataset | 准备简单 | 用例耦合,状态污染和并发测试不可控 | 不采用 |
| 方案 B: 每个用例完全独立手写数据 | 隔离强 | 数据重复,维护成本高,容易与正式 schema 漂移 | 不采用 |
| 方案 C: 按数据集族设计 reusable builder + per-test seed override,每次运行用 `test_run_id` 隔离 | 可复用、可重复、可隔离,支持故障注入 | 需要 Step 9 再落到自动化套件组织 | 采用 |

采用方案 C。

原因:

- P0 用例既需要稳定主线数据,也需要大量失败注入和并发变体。
- `InMemory*Repository`、`Fake*Port`、`FixedClock`、`DeterministicWorkIdGenerator` 已在详细设计中作为 P0 fake 契约存在,适合承载可重复 seed。
- 本步不把 fixture builder 名写成实施契约;正式实现文件和测试函数名留给 `07-实施计划.md` 和实际代码仓。

## 7. 结构化中间产物

### 7.1 测试数据命名与隔离规则

| 规则 | 口径 |
|---|---|
| 测试运行隔离键 | `test_run_id`,仅用于测试命名空间和临时目录,不是 Work domain / DTO / config 字段 |
| deterministic id prefix | `work-test-{test_run_id}-{dataset}-{sequence}` |
| deterministic time | 每个用例从固定 `Timestamp` 起步,按操作顺序递增,用于 trace / outbox / event 断言 |
| deterministic metadata | Command / Query / Job metadata 使用 run-scoped request id、actor ref、trace context ref 和 idempotency key |
| fake adapter seed | 每个 fake adapter 以 ref -> outcome map 注入 success / unresolved / unavailable / body-leak / failure |
| event replay seed | Inbound event 使用 run-scoped source_event_id、topic、source_ref、payload digest |
| forbidden body sentinel | 需要验证 body 禁止时使用明显 sentinel 字符串;断言 repository、event、log、report 中均不存在 |
| cleanup scope | 每个用例默认独立 store;共享 fixture 只允许只读 seed,不得跨用例复用 mutable store |

### 7.2 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `DS-WORK-RUN-BASE` | 提供 deterministic clock / id / metadata / actor 基线 | run-scoped builder 生成 `CommandMetadata`、`QueryMetadata`、job metadata、trace context | `test_run_id` + metadata prefix | drop in-memory runtime;清空 captured logs | 全部 P0 |
| `DS-WORK-PROJECT-BASE` | Project + Backlog 正向主线 | seed empty store 后通过 `CreateProject` 或 builder 生成 Project `Active`、Backlog `Open` | project id prefix | drop `InMemoryProjectRepository` / `InMemoryBacklogRepository` | `CORE-001`、`FORMAL-*`、`ITER-*`、`QUERY-*` |
| `DS-WORK-PROJECT-ARCHIVE` | lifecycle close / archive 和非法 reopen | 基于 `DS-WORK-PROJECT-BASE` 生成 `Closed` / `Archived` project 和 `Archived` backlog | project id prefix + version | drop store | `CORE-003`、状态非法迁移 |
| `DS-WORK-MEMBER-CAPABILITY` | 成员承担成功 | fake identity seed 返回 `GlobalMemberRef`、`CapabilityRefSet`、`MemberCapabilitySnapshot` | member ref prefix | reset `FakeMemberReferencePort` queue | `MEMBER-001`、`FORMAL-001` |
| `DS-WORK-MEMBER-UNRESOLVED` | identity unresolved / unavailable / body leak | fake identity seed 返回 unresolved、unavailable、或 body sentinel | member ref prefix | reset fake map;清空 captured output | `MEMBER-002`、`MEMBER-003`、`NFR-003` |
| `DS-WORK-BACKLOG-WORK` | WorkItem / ChildWorkItem 正向主线 | seed Project `Active`、Backlog `Open`、member capability、source ref success | project + work id prefix | drop work / backlog / reference stores | `FORMAL-001`、`FORMAL-005`、`QUERY-002/003` |
| `DS-WORK-WORK-BOUNDARY` | locked backlog、terminal work、invalid parent、body 禁止 | builder 生成 `BacklogState::LockedForMaintenance`、terminal work、child parent、source body sentinel | work id prefix | drop store;scan output | `FORMAL-002`~`005`、状态非法迁移 |
| `DS-WORK-PROMOTE` | promote request / review accept / reject | seed source ref success、PromoteResult `PendingReview`、accept intent、reject reason | promote id prefix + version | drop promote / work stores | `PROMOTE-001`~`003` |
| `DS-WORK-PROMOTE-BOUNDARY` | runtime body reject、duplicate source、concurrent review | fake source resolver body-leak / unresolved;two expected versions | promote id prefix + version pair | reset fake map;drop stores | `PROMOTE-004`、`PROMOTE-005`、`NFR-004` |
| `DS-WORK-DEPENDENCY-GRAPH` | dependency link、cycle、state update | seed formal upstream / downstream work 和 graph snapshot | dependency id prefix | drop dependency / work stores | `DEP-001`~`003` |
| `DS-WORK-BLOCKER-EVIDENCE` | blocker open / resolve / evidence reject | seed blocker cause ref、verified / rejected / missing evidence refs | blocker + evidence ref prefix | reset evidence fake;drop dependency store | `DEP-004`、`DEP-005` |
| `DS-WORK-ITERATION` | open / commit / update / close iteration | seed process timebox ref、formal candidates、iteration planning / committed states | iteration id prefix | drop iteration / work stores | `ITER-001`~`005` |
| `DS-WORK-QUERY-VIEWS` | 8 Query hit / missing / stale / failed / no-write | seed truth summaries、projection views、trace pages、visibility deny samples | query subject prefix | drop projection / audit stores | `QUERY-001`~`008` |
| `DS-WORK-REFERENCE-STATES` | reference resolved / unresolved / stale / failed | seed `ReferenceResolutionState` 和 last successful snapshot | reference ref prefix | drop reference store | `OPS-003`、`CFG-014`、`NFR-002` |
| `DS-WORK-OUTBOX` | outbox publish success / failure / concurrency | seed pending `WorkOutboxRecord`、publisher success / failure outcomes | outbox id prefix + version | drop outbox store;reset publisher fake | `OPS-001`、outbound event coverage |
| `DS-WORK-PROJECTION-REBUILD` | projection rebuild success / failure / query surface | seed `ProjectWorkTruthSnapshot`、truth cursor、projection batch failure injection | project + cursor prefix | drop projection store | `OPS-002`、`QUERY-004/005/008` |
| `DS-WORK-TRACE-HANDOFF` | trace handoff / archive handoff | seed trace records、archive summaries、handoff target ref success / failure | trace subject prefix | drop audit store;reset handoff fake | `OPS-005`、`OPS-006`、`QUERY-007` |
| `DS-WORK-RECONCILIATION` | reconciliation clean / gap report | seed truth cursor、projection gaps、outbox pending、reference stale refs | report scope prefix | drop report / temp dir | `OPS-004` |
| `DS-WORK-CONSUMER-EVENTS` | 7 inbound consumer success / dead-letter / duplicate | event envelope seed with topic、source_event_id、source_ref、payload digest | source_event_id prefix | clear dedup store and fake queues | Consumer coverage matrix |
| `DS-WORK-IDEMPOTENCY` | duplicate / conflict / in-flight / commit unknown | seed `IdempotencyRecord` with same digest、different digest、reserved、completed | idempotency key prefix | drop idempotency store | `CORE-004`、`NFR-004` |
| `DS-WORK-CONCURRENCY` | version conflict and single-winner race | clone same object with stale expected version;two operation attempts | object id + version pair | drop store after assertion | `PROMOTE-005`、`ITER-005`、`OPS-001` |
| `DS-WORK-CONFIG-PROFILE` | P0 profile loading | config seed for `local-dev`、`ci-test`、`integration-like`、`operations-replay` | temp config dir + profile | delete temp dir;clear env overrides | `CFG-001`~`004` |
| `DS-WORK-CONFIG-INVALID` | malformed / unknown / invalid / cross-field config | config snippets with duplicate key、unknown key、invalid duration / retry / page / batch | temp config dir | delete temp dir;clear env overrides | `CFG-005`~`009`、`CFG-017` |
| `DS-WORK-SENSITIVE-OUTPUT` | raw secret / payload / redaction gate | seed raw secret / token / payload sentinel and ref-only sensitive samples | sentinel id prefix | scan then delete temp output | `CFG-010`~`012`、`NFR-003/005` |
| `DS-WORK-OPS-RECOVERY` | replay / failed marker / rerun | seed failed outbox、failed projection、failed reference、handoff timeout、replay digest mismatch | replay run id | delete replay temp root;drop stores | `OPS-*`、`CFG-004/015/016`、`NFR-002/004` |
| `DS-WORK-NFR-OBS` | metric / log / audit / trace boundary | seed accepted、rejected、duplicate、failed flows and captured output sink | run id + trace context | clear captured output | `NFR-002`~`005` |

### 7.3 fixture / builder / seed 规则

| 规则 | 要求 | 禁止事项 |
|---|---|---|
| builder 输入 | 只能接收正式 DTO / ref / state / metadata 字段,或测试隔离参数 `test_run_id` | 不得添加 domain-only 隐式字段 |
| builder 输出 | 输出正式对象、正式 request / event / job input,或 fake adapter seed | 不得输出 production-only 配置或真实 secret |
| deterministic id | id generator 从 `DS-WORK-RUN-BASE` 的 prefix 顺序生成 | 不得用系统随机数影响 P0 断言 |
| deterministic time | fixed clock 每个操作递增一个固定步长 | 不得调用真实系统时间断言顺序 |
| version seed | 并发测试必须显式 seed version pair | 不得靠真实线程竞态制造唯一证据 |
| request digest | duplicate / conflict 数据必须显式区分 stable payload 和 volatile metadata | 不得把 request_id / trace / requested_at 写入 digest 断言 |
| fake resolver outcome | 每个 ref 明确 success / unresolved / unavailable / rejected / body-leak | fake success 不得伪装 configured success |
| event seed | inbound event 必须有 topic、source_event_id、source_ref、payload digest 和 trace context | 不得省略 dedup 所需字段 |
| forbidden output | 使用 sentinel 后必须扫描 repository、event、log、audit、report、artifact | 不得只断言 command reject |
| shared seed | 只读基础 seed 可复用;可变状态每个用例独立实例 | 不得跨用例共享 mutable store |

### 7.4 外部依赖测试替身表

| 外部依赖 | P0 协作方式 | seed outcome | 关联数据集 | 覆盖用例 |
|---|---|---|---|---|
| identity member | `FakeMemberReferencePort` | capability success、unresolved、unavailable、body-leak | `DS-WORK-MEMBER-*` | `MEMBER-*` |
| method definition | `FakeMethodDefinitionResolverPort` | definition success、missing、unavailable | `DS-WORK-CONSUMER-EVENTS` | `FORMAL-002`、`QUERY-006` |
| source work / conversation / runtime | `FakeSourceWorkResolverPort` | summary success、unresolved、rejected、body-leak | `DS-WORK-WORK-BOUNDARY`、`DS-WORK-PROMOTE-*` | `FORMAL-*`、`PROMOTE-*` |
| artifact / governance evidence | `FakeEvidenceResolverPort` | `EvidenceVerifiedState::Verified`、`Rejected`、`Unverified`、missing | `DS-WORK-BLOCKER-EVIDENCE` | `DEP-003/005` |
| process timebox | `FakeProcessTimeboxResolverPort` | resolved、missing、unavailable | `DS-WORK-ITERATION` | `ITER-001`、consumer process event |
| outbox publisher | `FakeWorkOutboxPublisher` | publication ref success、publish failure、timeout | `DS-WORK-OUTBOX` | `OPS-001` |
| trace handoff | `FakeTraceHandoffAdapter` | handoff ref success、failure / timeout | `DS-WORK-TRACE-HANDOFF` | `OPS-005` |
| archive handoff | `FakeArchiveHandoffAdapter` | archive ref success、failure / timeout | `DS-WORK-TRACE-HANDOFF` | `OPS-006` |
| store / UoW | `InMemoryWorkStores` + `InMemoryUnitOfWork` | commit、rollback、version conflict、commit unknown | `DS-WORK-IDEMPOTENCY`、`DS-WORK-CONCURRENCY` | command / job / NFR |

### 7.5 边界、异常、并发和恢复数据映射

| 场景族 | 必备数据 | 预期断言 |
|---|---|---|
| missing / not visible | missing project / work / trace subject;unauthorized consumer | `Missing` / `NotVisible`;query no-write |
| unresolved external ref | unresolved identity / source / evidence / timebox ref | `ExternalReferenceUnresolved`、`ReferenceResolutionStatus` marker 或 dead-letter |
| forbidden body | source body、identity body、artifact body、raw payload sentinel | repository / event / log / audit / report 中不存在 sentinel |
| invalid state transition | archived project、released member、locked backlog、terminal work、closed iteration | `DomainRejected`;version / truth / outbox 不变 |
| graph policy reject | dependency cycle / orphan edge | no dependency history;no outbox |
| idempotency duplicate | same operation、same key、same digest、completed result | existing result replay;无重复 side effect |
| idempotency conflict | same operation、same key、different digest | `IdempotencyConflict`;无 business truth |
| optimistic version conflict | stale expected version pair | `VersionConflict`;losing path rollback |
| publisher failure | pending outbox + fake publish failure | `OutboxPublicationState::Failed`;不回滚 source truth |
| projection rebuild failure | truth snapshot success + projection build failure | `DerivedFreshnessState::Failed`;query exposes failed / stale |
| reference refresh failure | last good snapshot + resolver failure | failed marker;last good snapshot preserved |
| handoff failure | trace / archive target failure | failed refs / report;不写 external body |
| replay mismatch | operations-replay baseline digest mismatch | job / startup fail-fast;不修 truth |

### 7.6 数据隔离与清理矩阵

| 数据类型 | 隔离方式 | 清理方式 | 备注 |
|---|---|---|---|
| in-memory truth / projection / reference / outbox / idempotency store | 每个用例独立 store instance 或 run-scoped namespace | drop store instance | P0 默认方式 |
| temp config / report / replay root | `test_run_id` 子目录 | 删除 temp dir | 不保存 raw secret / raw payload |
| fake resolver / publisher / handoff queues | 每个用例独立 outcome map | reset fake map / captured calls | captured calls 可作为证据输入 |
| captured log / metric / audit output | run-scoped sink | 清空 sink | Step 13 再定义归档 |
| event dedup records | event key prefix = topic + source_event_id + source_ref | drop idempotency / dedup store | duplicate / conflict 可复现 |
| env overrides | key prefix 或 test process scoped env | 用例后 clear env | Step 8 / 9 再定义并行环境安全策略 |
| controlled configured adapter refs | integration-like profile 下 ref-only sample | reset configured local adapter state | 不接真实生产 endpoint |
| operations-replay historical seed | 脱敏 replay bundle + run id | 删除 replay temp root | 不包含历史 raw secret / raw source body |

### 7.7 数据集到用例族映射

| 用例族 | 必需数据集 | 说明 |
|---|---|---|
| `CORE` | `DS-WORK-RUN-BASE`、`DS-WORK-PROJECT-BASE`、`DS-WORK-PROJECT-ARCHIVE`、`DS-WORK-IDEMPOTENCY` | 覆盖 create、lifecycle、duplicate、implicit create reject |
| `MEMBER` | `DS-WORK-RUN-BASE`、`DS-WORK-PROJECT-BASE`、`DS-WORK-MEMBER-CAPABILITY`、`DS-WORK-MEMBER-UNRESOLVED` | 覆盖 capability success / unresolved / body boundary / released transition |
| `FORMAL` | `DS-WORK-BACKLOG-WORK`、`DS-WORK-WORK-BOUNDARY`、`DS-WORK-MEMBER-CAPABILITY` | 覆盖 root / child formal work、locked backlog、invalid parent、body absent |
| `PROMOTE` | `DS-WORK-PROMOTE`、`DS-WORK-PROMOTE-BOUNDARY`、`DS-WORK-IDEMPOTENCY`、`DS-WORK-CONCURRENCY` | 覆盖 pending / accept / reject / runtime body / concurrent review |
| `DEP` | `DS-WORK-DEPENDENCY-GRAPH`、`DS-WORK-BLOCKER-EVIDENCE`、`DS-WORK-REFERENCE-STATES` | 覆盖 dependency graph、cycle、evidence 和 blocker |
| `ITER` | `DS-WORK-ITERATION`、`DS-WORK-CONCURRENCY`、`DS-WORK-QUERY-VIEWS` | 覆盖 timebox、commit candidates、commitment change、close / cancel |
| `QUERY` | `DS-WORK-QUERY-VIEWS`、`DS-WORK-PROJECTION-REBUILD`、`DS-WORK-TRACE-HANDOFF` | 覆盖 hit / missing / not visible / stale / failed / empty / no-write |
| `OPS` | `DS-WORK-OUTBOX`、`DS-WORK-PROJECTION-REBUILD`、`DS-WORK-REFERENCE-STATES`、`DS-WORK-RECONCILIATION`、`DS-WORK-TRACE-HANDOFF`、`DS-WORK-OPS-RECOVERY` | 覆盖 publish、rebuild、refresh、reconciliation、handoff 和 rerun |
| `CFG` | `DS-WORK-CONFIG-PROFILE`、`DS-WORK-CONFIG-INVALID`、`DS-WORK-SENSITIVE-OUTPUT`、`DS-WORK-OPS-RECOVERY` | 覆盖 profile、loader、validation、sensitive 和 unsupported hot reload |
| `NFR` | `DS-WORK-NFR-OBS`、`DS-WORK-IDEMPOTENCY`、`DS-WORK-CONCURRENCY`、`DS-WORK-SENSITIVE-OUTPUT` | 覆盖 availability、security、idempotency、observability 和性能专项输入 |

### 7.8 不提前写入的数据范围

| 不提前写入项 | 原因 | 后续承接 |
|---|---|---|
| production-like durable DB / MQ seed | P1/P2,不属于 P0 测试数据事实源 | Step 8 环境矩阵和后续部署运维 |
| real secret material / KMS / Vault sample | 04 只允许 ref-only sensitive | 安全运维专项 |
| config center / admin override / hot reload 数据 | P0 unsupported | 后续范围变更先回写 04 |
| 外围增强 `FR-WORK-E01`~`E05` 数据 | 不进入 P0 硬覆盖 | Step 14 残余风险 |
| 验收 pass / fail evidence bundle | `06-验收标准.md` 职责 | Step 13 和 06 |
| 具体测试函数名 / CI job name | `07-实施计划.md` 和实现仓职责 | Step 9 / 07 |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 用例前置条件可由 run-scoped fixture / builder / fake seed 满足 | 否 | 测试数据设计,无设计契约变化 | 无 | 无回写 |
| `test_run_id` 仅作为测试隔离键,不进入 Work domain / DTO / config | 否 | 测试隔离约定 | 无 | 无回写 |
| P0 使用 in-memory store、deterministic fake 和 controlled adapter ref,不要求真实生产 endpoint | 否 | 承接 03 / 04 已有 fake / profile 口径 | 无 | 无回写 |
| forbidden body / sensitive output 通过 sentinel + scan 数据集验证 | 否 | 测试证据设计,不新增安全配置 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果 Step 8 在环境矩阵中需要引入真实运行期依赖或新的配置字段,必须先回写 `04-配置设计.md` 和必要的详细设计契约。
```

## 9. 回填草稿

正式 `05-测试方案.md` §7 建议采用以下结构:

```text
7. 测试数据设计
  7.1 测试数据命名与隔离规则
  7.2 测试数据集表
  7.3 fixture / builder / seed 规则
  7.4 外部依赖测试替身表
  7.5 边界、异常、并发和恢复数据映射
  7.6 数据隔离与清理矩阵
  7.7 数据集到用例族映射
  7.8 不提前写入的数据范围
  7.9 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §7.1 | 本中间产物 §7.1 |
| §7.2 | 本中间产物 §7.2 |
| §7.3 | 本中间产物 §7.3 |
| §7.4 | 本中间产物 §7.4 |
| §7.5 | 本中间产物 §7.5 |
| §7.6 | 本中间产物 §7.6 |
| §7.7 | 本中间产物 §7.7 |
| §7.8 | 本中间产物 §7.8 |
| §7.9 | 本中间产物 §8 |

## 10. 待确认事项

无阻塞进入 Step 8 的待确认事项。

后续 Step 必须继续收口:

- Step 8 把这些数据集映射到 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 环境和依赖协作方式。
- Step 9 定义哪些数据集进入哪些自动化 suite、CI gate 和 release gate。
- Step 13 定义 `EV-WORK-*` 如何引用 captured output、report、fake adapter calls 和 redaction scan 结果。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例的数据前置条件可满足 | 通过 | `CORE`~`NFR` 用例族均映射到数据集 |
| 测试数据可重复生成 | 通过 | deterministic id、fixed clock、run-scoped metadata 和 fake outcome map |
| 数据隔离清楚 | 通过 | `test_run_id`、per-test store、temp dir 和 fake queue reset |
| 数据清理清楚 | 通过 | drop store、delete temp dir、clear env / captured output |
| 不依赖人工临时造数 | 通过 | 所有数据都由 builder / seed / fake adapter outcome 构造 |
