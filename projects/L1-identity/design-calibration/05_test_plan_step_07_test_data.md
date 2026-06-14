# Step 7. 设计测试数据

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节: `05-测试方案.md` §7 测试数据设计

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 设计测试数据 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 6 用例矩阵;`03` DTO / schema / 状态机 / 持久化契约;`04` profile / config / redaction |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_07_test_data.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 按数据类型和测试切口分批写入;完成后暂停,由用户审查后再进入 Step 8 |

## 2. 本步目标

定义 Step 6 中所有 P0 用例的数据如何构造、隔离、复用和清理。

本 Step 只回答:

- 哪些基础 member truth、lifecycle、role/capability、career、memory、handoff、projection、reference、outbox、job、config、redaction 和 fault injection 数据集必须存在。
- 哪些边界、异常、并发和恢复数据必须单独构造,不能复用 happy-path 数据掩盖断言。
- 数据如何按 run / tenant / member / operation namespace 隔离。
- 数据如何清理,避免跨用例污染。
- 哪些外部依赖使用 fake / controlled / disabled,不使用真实 sibling repo 或真实外部产品。
- 每个 P0 用例是否能回指可重复生成的数据集。

本 Step 不定义具体 fixture 文件路径、builder 函数名、seed 代码、真实 DB truncate 脚本、CI suite、artifact 路径或正式 evidence ID。这些由实现仓测试代码、Step 8 环境矩阵、Step 9 自动化门禁和 Step 13 证据归档继续固定。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已审核通过 | 提供 TC-ID-* 用例、前置条件和断言 |
| `00-需求文档.md` §11 / §13 / §14 | 正式输入 | 提供 truth / snapshot / reference / forbidden body 和 VETO 数据边界 |
| `01-架构设计.md` §9 / §13 | 正式输入 | 提供数据 ownership、依赖裁剪和安全 / 隐私边界 |
| `03_ddd_step_06_object_contracts.md` | 正式输入 | 提供 truth object、state、reason、ref、marker 和 body-free 字段 |
| `03_ddd_step_08_protocol_contracts.md` | 正式输入 | 提供 Command / Query / Event / Job DTO 和 response / receipt / report schema |
| `03_ddd_step_09_function_flows.md` | 正式输入 | 提供 command/query/consumer/outbox/job 需要的读取和写入前置 |
| `03_ddd_step_10_state_matrix.md` | 正式输入 | 提供 legal / illegal state fixture 组合 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 正式输入 | 提供 version、UoW、outbox payload snapshot、stored result/report、projection/reference state 数据需求 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 invalid request、dependency unavailable、unsupported version、rollback failure 等错误数据 |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 idempotency key/digest、duplicate replay、commit unknown、race 数据需求 |
| `04-配置设计.md` §6 / §8 / §9 / §11 / §12 | 正式输入 | 提供 P0 profile、strict config、redaction、degraded/no-write、topic completeness 和 disabled adapter 数据 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些基础数据必须存在? | 必须有 test run namespace、actor / operation metadata、established `GlobalMember`、`IdentityAnchorState`、initial `GlobalLifecycleState`、role/capability safe summary、career record、memory reference、trace handoff intent、projection view、reference state、outbox record、job report、idempotency record、config profile 和 redaction corpus。 |
| 哪些边界、异常、并发和恢复数据必须构造? | 必须构造 ref reuse、query missing member、high-risk lifecycle missing/invalid basis、source unavailable/unrecognized、ProjectMember body、memory body、unsupported schema version、same-key different digest、stored result missing、commit unknown、publisher failure、handoff receipt missing、unsafe config、redaction leak 和 dependency loop 数据。 |
| 数据如何隔离不同测试运行? | 所有数据集使用 `test_run_ref` 作为最高隔离键,再按 `tenant_ref`、`member_ref`、`operation_namespace`、`idempotency_key`、`event_dedup_key`、`job_run_ref`、`projection_view_ref` 或 `external_reference_ref` 分区。 |
| 数据如何清理? | P0 fake/in-memory 数据默认按 run namespace drop;fake resolver/publisher/handoff/UoW fault profile 每 case reset;redaction leak fixtures 必须只进入 isolated artifact fixture,不得进入 shared store。durable-like cleanup 留 P1/P2。 |
| 哪些外部依赖使用 fake / stub / real-like? | P0 使用 fake / controlled / disabled:governance basis resolver fake、role/source resolver fake、work participation event fixture、memory/archive resolver fake、publisher fake、handoff adapter fake、write-audit fake repository、fake UoW、fake clock/id generator、config parser fixture、redaction artifact fixture。真实 sibling repo、真实 DB/bus/archive/observability/secret provider 不作为 P0 数据来源。 |
| 每个 P0 用例的数据前置条件是否能由 fixture / builder / seed 稳定构造? | 是。§8.2 按测试切口映射数据集。若实现阶段发现某 DTO 或 state 无法通过正式 builder 构造,必须回写 `03` 或记录阻塞,不得临时补 schema。 |
| 哪些负向、边界、并发和恢复数据需要单独数据集? | forbidden body、unsupported version、same-key conflict、stored result missing、commit unknown、projection race、reference failure、publisher permanent failure、handoff receipt missing、rollback failure、unsafe config、redaction leak、dependency violation 均单独数据集,不得复用 happy path。 |
| 每个测试切口的数据设计完成后是否通过停审? | 通过。见 §8.5。 |
| 所有数据集完成后是否存在数据互相污染、清理缺失、外部依赖替身不明确或人工造数依赖? | 当前未发现 unresolved 冲突。见 §8.6。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 用例矩阵 | 每个 TC 有前置条件,但尚未明确数据集和隔离方式 | 本 Step 将前置条件转成数据集和映射 |
| 旧 `05-测试方案.md` | 旧数据口径未覆盖新版 role/career/memory、handoff、stored replay、redaction 和 config | 不继承旧数据表 |
| 详细设计 | 提供对象和 DTO,但不定义测试 fixture | 本 Step 定义 fixture / builder / seed 规则,不改详细设计 |
| config/redaction | `04` 给出测试主题,但需映射到具体配置数据 | 本 Step 增加 config 和 leak fixture 数据集 |
| fault injection | Step 6 需要 UoW / repository / adapter failure 数据 | 本 Step 明确 fake fault profile 数据集 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 基础数据 | 只在用例前置条件中口头出现 | 抽成 reusable baseline datasets | 避免人工造数和重复 fixture |
| 负向数据 | 分散在用例操作里 | 单独 negative datasets | 防止 happy-path 数据掩盖错误 |
| 外部依赖 | 用例只写 resolver/publisher fake | 明确 fake / controlled / disabled 数据归属 | 对齐产品中立和依赖裁剪 |
| 隔离 | 未说明 run/tenant/member 隔离 | 固定 `test_run_ref` + scoped refs | 防止跨用例污染 |
| 清理 | 未说明 | fake/in-memory drop namespace;durable future 再固定 | 支持自动化重复运行 |

## 7. 测试数据设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否使用真实 sibling repo 数据 | A. 使用真实仓;B. 使用 refs/safe snapshot/event fixture | 采用 B。P0 只测 identity seam |
| 是否把负向数据混在 happy fixture | A. 混用;B. 单独负向数据集 | 采用 B。便于明确触发错误和清理 |
| 是否固定 fixture 文件路径 | A. 本 Step 固定;B. 只固定数据集和构造规则 | 采用 B。路径由实现仓测试结构和 Step 9 决定 |
| 是否要求真实 DB 清理策略 | A. 当前固定;B. P0 fake/in-memory, durable future 再固定 | 采用 B。真实产品未锁定 |
| 是否生成正式 evidence 数据 | A. 生成 EV;B. 只保证可留证数据 | 采用 B。正式 evidence 留 Step 13 |

## 8. 结构化中间产物

### 8.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-ID-RUN-001 run namespace | 所有测试的最高隔离壳 | seed `test_run_ref`、`tenant_ref`、fixed clock/id range | `test_run_ref` | drop run namespace / in-memory reset | 全部 TC |
| DS-ID-ACTOR-001 actor and operation metadata | command/query/consumer/job metadata | actor ref builder + operation context + trace context | `test_run_ref` + actor ref | run namespace drop | TC-ID-CONTRACT-002;TC-ID-CMD-*;TC-ID-QUERY-* |
| DS-ID-MEMBER-001 established member baseline | anchor/lifecycle/query happy path | builder creates `GlobalMember`, `IdentityAnchorStateKind::Established`, `GlobalLifecycleStateKind::Available` | member ref | run namespace drop | TC-ID-DOMAIN-001;TC-ID-CMD-001;TC-ID-QUERY-001~002 |
| DS-ID-MEMBER-NEG-001 ref reuse / boundary | ref reuse、auth/runtime boundary、missing member | seed existing anchor, missing member ref, auth/runtime refs that are not member truth | member ref + negative tag | run namespace drop | TC-ID-CMD-002;TC-ID-QUERY-001;TC-ID-ARCH-001 |
| DS-ID-LIFECYCLE-001 lifecycle states and basis | lifecycle legal transitions and high-risk accepted path | builder creates `Available`, `Paused`, `Retired`, `Tombstoned`, valid `GovernanceBasisRef` summary | member ref + lifecycle state | run namespace drop | TC-ID-DOMAIN-002;TC-ID-CMD-003 |
| DS-ID-LIFECYCLE-NEG-001 illegal lifecycle / missing basis | invalid transition and VETO-ID-004 | builder creates `Retired` / `Tombstoned` current state and missing/invalid/unavailable basis refs | member ref + risk tag | run namespace drop | TC-ID-DOMAIN-003;TC-ID-CMD-004 |
| DS-ID-ROLE-001 resolved role source | role/capability summary happy path | fake resolver returns `SourceResolved`, source version, safe summary, evidence refs | role source ref + member ref | fake resolver reset | TC-ID-DOMAIN-004;TC-ID-CMD-005;TC-ID-QUERY-003 |
| DS-ID-ROLE-NEG-001 source unavailable/body | source stale/unavailable/unrecognized and forbidden definition body | fake resolver/event fixture returns non-resolved state or isolated forbidden body marker | source ref + negative tag | fake reset;forbidden body fixture delete | TC-ID-CMD-006;TC-ID-CONSUMER-001;TC-ID-OUTBOX-005 |
| DS-ID-CAREER-001 career append/correction | career append-only happy path | builder creates work participation ref, safe career summary, existing record and correction target | career record ref + member ref | run namespace drop | TC-ID-DOMAIN-005;TC-ID-CMD-007;TC-ID-OUTBOX-006 |
| DS-ID-CAREER-NEG-001 duplicate source / ProjectMember body | duplicate source, untrusted work source and forbidden ProjectMember body | seed duplicate source marker and isolated ProjectMember body fixture | source marker + negative tag | run namespace drop;body fixture delete | TC-ID-CMD-008;TC-ID-CONSUMER-002 |
| DS-ID-MEMORY-001 memory refs and archive state | memory reference, archive/handoff relation happy path | builder creates `MemoryReference`, formal `MemoryReferenceStateKind`, archive/handoff refs | memory ref + member ref | run namespace drop | TC-ID-DOMAIN-006;TC-ID-CMD-009;TC-ID-CONSUMER-003~004 |
| DS-ID-MEMORY-NEG-001 memory/archive forbidden body | memory text、embedding、archive package、receipt body negative | isolated forbidden material fixture + invalid source marker | memory ref + negative tag | delete isolated fixture | TC-ID-CMD-010;TC-ID-CONSUMER-004;TC-ID-REDACTION-001 |
| DS-ID-HANDOFF-001 trace handoff states | prepare/deliver/retry/callback tests | seed non-empty trace refs, target/scope refs, `TraceHandoffIntent` in `PendingHandoff` / `RetryableFailed` | handoff intent ref | run namespace drop | TC-ID-CMD-011;TC-ID-CONSUMER-005;TC-ID-JOB-004 |
| DS-ID-HANDOFF-NEG-001 empty trace / missing receipt | empty trace refs, unsupported target, delivery success without receipt | handoff fixture with empty refs or fake delivery outcome lacking `HandoffReceiptRef` | handoff intent ref + negative tag | run namespace drop;fake reset | TC-ID-CMD-012;TC-ID-IDEMP-010 |
| DS-ID-PROTOCOL-001 valid DTO set | DTO roundtrip and command/query/event/job requests | canonical DTO builders from Step 8 schema | DTO family + schema version | no persistent cleanup | TC-ID-CONTRACT-001 |
| DS-ID-PROTOCOL-NEG-001 invalid DTO/envelope | required metadata, unsupported version, malformed page/scope | mutate valid DTO by deleting required fields or changing version | case id | no persistent cleanup | TC-ID-CONTRACT-002~004;TC-ID-CONSUMER-006;TC-ID-JOB-007 |
| DS-ID-PROJECTION-001 views and freshness | member summary, projection state and query degraded tests | seed formal `MemberSummaryViewRef`, view body, freshness state, projection state | view ref + source cursor | run namespace drop | TC-ID-QUERY-003~015;TC-ID-JOB-001;TC-ID-IDEMP-008 |
| DS-ID-REFERENCE-001 tracked reference states | reference query and refresh scope | seed `ReferenceResolutionState` resolved/stale/unavailable/unrecognized with versions and last good snapshot | external reference ref + version | run namespace drop | TC-ID-QUERY-010;TC-ID-JOB-002;TC-ID-IDEMP-009 |
| DS-ID-OUTBOX-001 pending payload snapshots | Outbound material and publish tests | seed outbox records with stored payload markers for 10 material kinds | outbox ref + version | run namespace drop | TC-ID-OUTBOX-001~010;TC-ID-JOB-005 |
| DS-ID-REPORT-001 job/reconciliation reports | Job duplicate and reconciliation query | seed stored job report, reconciliation report clean/finding/failed | job run ref + report ref | run namespace drop | TC-ID-QUERY-011;TC-ID-JOB-003/006;TC-ID-IDEMP-004 |
| DS-ID-IDEMP-001 idempotency records | duplicate replay and conflict | seed reserved/completed/conflict records with canonical digest and stored result/report refs | operation namespace + idempotency key | run namespace drop | TC-ID-CMD-013~015;TC-ID-IDEMP-001~006 |
| DS-ID-FAULT-001 repository/UoW failures | rollback/version/store/commit unknown | fake repository/UoW fault profile | fault case id + operation ref | reset fake fault profile | TC-ID-CMD-015;TC-ID-IDEMP-005~007/011 |
| DS-ID-PUBLISHER-001 publisher/handoff failures | retryable/permanent publish and handoff failures | fake publisher/handoff adapter returns formal outcome markers | adapter slot + fault case id | reset fake adapter | TC-ID-OUTBOX-009~010;TC-ID-JOB-004~005 |
| DS-ID-CONFIG-001 valid P0 profiles | runtime builder and profile matrix | config fixtures for `local-dev`, `ci-test`, `integration-like`, `operations-replay` | profile ref + config digest | no persistent cleanup | TC-ID-CONFIG-001 |
| DS-ID-CONFIG-NEG-001 invalid config variants | strict JSON/source priority/topic/profile isolation/boundary override | mutate valid config into invalid cases | config case id + digest | no persistent cleanup | TC-ID-CONFIG-002~004 |
| DS-ID-REDACTION-001 safe output corpus | redaction positive checks | collect logs/metrics/audit/trace/report/outbox from representative successful runs | test_run_ref + artifact kind | drop artifact namespace | TC-ID-REDACTION-001~003 |
| DS-ID-REDACTION-NEG-001 leak corpus | redaction negative scanner | isolated artifact/report fixture containing dummy raw secret/body/full sensitive ref | leak case id | delete isolated fixture | TC-ID-REDACTION-001~002 |
| DS-ID-ARCH-001 dependency metadata | dependency boundary check | implementation dependency metadata fixture or generated dependency graph | package graph digest | no persistent cleanup | TC-ID-ARCH-001 |

### 8.2 按测试切口组织的数据前置映射表

| 测试切口 | 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|---|
| contracts protocol / metadata / body-free | TC-ID-CONTRACT-001 | DS-ID-PROTOCOL-001 | canonical DTO builders for all public families | none | no persistent cleanup |
| contracts protocol / metadata / body-free | TC-ID-CONTRACT-002~004 | DS-ID-PROTOCOL-NEG-001;DS-ID-REDACTION-NEG-001 | mutate metadata/schema/body fields | none / redaction fixture | no persistent cleanup / delete leak fixture |
| domain object / policy / state | TC-ID-DOMAIN-001~006 | DS-ID-MEMBER-001;DS-ID-LIFECYCLE-001;DS-ID-ROLE-001;DS-ID-CAREER-001;DS-ID-MEMORY-001 | domain object builders with valid and invalid state/policy inputs | fake resolver for safe snapshots where needed | run namespace drop |
| domain object / policy / state | TC-ID-STATE-001~002 | DS-ID-PROJECTION-001;DS-ID-REFERENCE-001;DS-ID-REPORT-001;DS-ID-OUTBOX-001;DS-ID-HANDOFF-001 | state-specific builders for terminal/no-repair cases | fake repositories for marker states | run namespace drop |
| command orchestration | TC-ID-CMD-001~004 | DS-ID-ACTOR-001;DS-ID-MEMBER-001;DS-ID-MEMBER-NEG-001;DS-ID-LIFECYCLE-001;DS-ID-LIFECYCLE-NEG-001 | command DTO builders + member/lifecycle/basis seeds | fake governance basis resolver, fake UoW | run namespace drop |
| command orchestration | TC-ID-CMD-005~006 | DS-ID-ROLE-001;DS-ID-ROLE-NEG-001;DS-ID-REFERENCE-001 | role source, safe summary, evidence and source unavailable seeds | fake role/source resolver | run namespace drop / reset fake |
| command orchestration | TC-ID-CMD-007~008 | DS-ID-CAREER-001;DS-ID-CAREER-NEG-001 | work participation and duplicate source seeds | work source event fixture | run namespace drop |
| command orchestration | TC-ID-CMD-009~012 | DS-ID-MEMORY-001;DS-ID-MEMORY-NEG-001;DS-ID-HANDOFF-001;DS-ID-HANDOFF-NEG-001 | memory refs, archive/handoff markers, empty trace refs | memory/archive/handoff fake | run namespace drop / delete body fixture |
| command orchestration | TC-ID-CMD-013~015 | DS-ID-IDEMP-001;DS-ID-FAULT-001 | duplicate, digest conflict, expected version conflict seeds | fake idempotency/result/UoW repositories | run namespace drop / reset fault profile |
| query no-write | TC-ID-QUERY-001~015 | DS-ID-MEMBER-001;DS-ID-MEMBER-NEG-001;DS-ID-ROLE-001;DS-ID-CAREER-001;DS-ID-MEMORY-001;DS-ID-PROJECTION-001;DS-ID-REFERENCE-001;DS-ID-REPORT-001;DS-ID-OUTBOX-001;DS-ID-HANDOFF-001 | projection/view/report/state seeds for each query | fake visibility policy, write-audit repository | run namespace drop / reset audit |
| inbound consumer / callback | TC-ID-CONSUMER-001~006 | DS-ID-PROTOCOL-001;DS-ID-PROTOCOL-NEG-001;DS-ID-ROLE-NEG-001;DS-ID-CAREER-001;DS-ID-MEMORY-001;DS-ID-MEMORY-NEG-001;DS-ID-HANDOFF-001 | event envelope builders + safe snapshot resolver | fake source resolver, fake receipt store | run namespace drop / reset fake |
| outbound material / publish | TC-ID-OUTBOX-001~010 | DS-ID-OUTBOX-001;DS-ID-MEMBER-001;DS-ID-LIFECYCLE-001;DS-ID-ROLE-001;DS-ID-CAREER-001;DS-ID-MEMORY-001;DS-ID-PUBLISHER-001 | stored payload markers for all event kinds | fake publisher success/failure | run namespace drop / reset adapter |
| operations job | TC-ID-JOB-001~008 | DS-ID-PROJECTION-001;DS-ID-REFERENCE-001;DS-ID-REPORT-001;DS-ID-OUTBOX-001;DS-ID-HANDOFF-001;DS-ID-IDEMP-001;DS-ID-FAULT-001;DS-ID-PUBLISHER-001 | job input and store seeds for rebuild/refresh/reconcile/publish/deliver/retry | fake repositories,resolvers,publisher,handoff adapter | run namespace drop / reset fault profile |
| consistency / idempotency / recovery | TC-ID-IDEMP-001~011 | DS-ID-IDEMP-001;DS-ID-REPORT-001;DS-ID-FAULT-001;DS-ID-OUTBOX-001;DS-ID-PROJECTION-001;DS-ID-REFERENCE-001;DS-ID-HANDOFF-NEG-001 | idempotency records, missing result/report, commit unknown, race and receipt missing seeds | fake idempotency/result/UoW/outbox/projection/reference/handoff repositories | run namespace drop / reset fault profile |
| config / redaction / dependency | TC-ID-CONFIG-*;TC-ID-REDACTION-*;TC-ID-ARCH-001 | DS-ID-CONFIG-001;DS-ID-CONFIG-NEG-001;DS-ID-REDACTION-001;DS-ID-REDACTION-NEG-001;DS-ID-ARCH-001 | valid/invalid profile fixtures, safe/leak corpus, generated dependency graph | config parser/builder fake, redaction checker | no persistent cleanup / delete leak fixture |

### 8.3 数据构造规则

| 规则 | 正式口径 |
|---|---|
| deterministic ids | test builders use deterministic id ranges scoped by `test_run_ref`;no wall-clock random ids in assertions |
| fixed clock | time-dependent states use fake clock seeded by run;no real current time in expected values |
| canonical digest | idempotency and request digest fixtures use the same canonicalization profile as Step 13;volatile metadata excluded |
| body-free snapshots | external resolver fixtures return refs, safe summaries, digest refs and state only;forbidden body fixtures stay isolated in negative datasets |
| versioned state | any existing state update fixture includes expected version;cursor is not used as optimistic version |
| formal refs only | projection/handoff/outbox fixtures use formal member summary view refs, outbox refs, trace refs and marker refs;no ad hoc string refs |
| data minimality | each dataset includes only fields needed by the target assertion;do not carry hidden happy-path state that can mask negative assertions |
| fake fidelity | fake repositories/adapters must enforce formal version, unique, rollback, failure and redaction behavior;fake success may not bypass state/receipt/report |

### 8.4 数据隔离与清理规则

| 数据类型 | 隔离键 | 清理方式 | 注意事项 |
|---|---|---|---|
| in-memory truth / projection / reference / outbox / report stores | `test_run_ref` + subject/ref namespace | drop run namespace or reset store | no global singleton state across tests |
| idempotency / stored result / receipt / report | operation namespace + idempotency/event/job key | drop run namespace | duplicate tests must not reuse keys across unrelated cases |
| fake resolver / publisher / handoff fault profiles | adapter slot + fault case id | reset fake profile after case | failure injection must not leak to happy-path cases |
| config parser / runtime builder fixtures | config case id + digest | no persistent cleanup | invalid config must not update shared default config |
| artifact / redaction leak corpus | leak case id | delete isolated fixture | dummy secrets/bodies only;never real secret material |
| dependency metadata | package graph digest | no persistent cleanup | generated graph must be run-scoped if taken from implementation repo |
| future durable-like stores | `test_run_ref` + schema namespace | transaction rollback or run-scoped cleanup | not P0;must be specified before real durable suite |

### 8.5 测试数据停审记录

| 测试切口 / 数据集 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| DS-ID-RUN-001 | 是否提供全局 run 隔离 | 通过 | 具体 run id 生成留实现仓 |
| DS-ID-MEMBER / LIFECYCLE datasets | 是否覆盖 member anchor、ref reuse、legal/illegal lifecycle and high-risk basis | 通过 | builder 函数名留实现仓 |
| DS-ID-ROLE / CAREER / MEMORY datasets | 是否覆盖 role source、career append、memory refs and forbidden bodies | 通过 | negative body 只留 isolated fixture |
| DS-ID-HANDOFF datasets | 是否覆盖 pending handoff、receipt required and empty trace negative | 通过 | delivery fake outcome 由 Step 9 固定 |
| DS-ID-PROTOCOL datasets | 是否覆盖 DTO roundtrip、missing metadata、unsupported version | 通过 | schema generator 由实现决定 |
| DS-ID-PROJECTION / REFERENCE datasets | 是否覆盖 query hit/stale/degraded, refresh and rebuild race | 通过 | version source 必须来自 repository fixture |
| DS-ID-OUTBOX / REPORT datasets | 是否覆盖 material snapshot、publish failure、job report replay | 通过 | 不从 current truth 重建 payload/report |
| DS-ID-IDEMP / FAULT datasets | 是否覆盖 duplicate replay、digest conflict、commit unknown、rollback failure | 通过 | fault profile 每 case reset |
| DS-ID-CONFIG datasets | 是否覆盖 P0 profiles、strict JSON、source priority、topic/target completeness | 通过 | formal env key/path 留 Step 8/9 |
| DS-ID-REDACTION / ARCH datasets | 是否覆盖 safe corpus、leak scanner and dependency boundary | 通过 | 只使用 dummy leak data |

### 8.6 跨数据隔离 / 清理审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 用例是否都有数据集来源 | 通过 | 见 §8.2 |
| 是否存在人工临时造数依赖 | 通过 | 所有数据均通过 fixture / builder / seed 或 generated metadata |
| negative 数据是否与 happy 数据隔离 | 通过 | forbidden body、unsupported version、fault、redaction leak、invalid config 均单独数据集 |
| 外部依赖替身是否明确 | 通过 | P0 均为 fake / controlled / disabled,无真实 sibling repo |
| 数据清理方式是否明确 | 通过 | run namespace drop、fake reset、isolated fixture delete |
| 是否存在 cursor-as-version 风险 | 通过 | versioned state rule 明确 expected version 来源 |
| 是否存在 ad hoc view/ref 风险 | 通过 | projection/handoff/outbox 使用 formal refs |
| 是否存在 raw secret/body 进入共享数据风险 | 通过 | leak corpus isolated;safe corpus body-free |
| 是否提前固定实现文件路径 | 通过 | 本 Step 只定义数据集和构造规则 |
| 是否要求真实 durable product | 通过 | durable-like 标记 future,不进入 P0 |

## 9. 对上游设计的影响判定

| 数据结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 所有 P0 用例均可映射数据集 | 否 | 测试数据细化 | 无需回写 |
| P0 只使用 fake / controlled / disabled 外部依赖 | 否 | 与 Step 2/4/04 一致 | 无需回写 |
| 负向数据单独隔离 | 否 | 测试安全约束 | 无需回写 |
| 具体 fixture file / builder function 未固定 | 否 | 实现细节 | Step 9 或实现仓测试结构承接 |
| 若实现阶段无法从正式 DTO 构造某数据集 | 是 | 可验证性缺口 | 回写 `03` 或记录阻塞 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_07_test_data.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试数据集表”“按测试切口组织的数据前置映射表”“数据构造规则”“数据隔离与清理规则”和“跨数据隔离 / 清理审计表”小节,了解 P0 用例如何获得可重复、可隔离、可清理的数据前置。

正式 `05-测试方案.md` §7 应回填:

- 测试数据按 run namespace、member/lifecycle truth、role/career/memory、handoff、protocol DTO、projection/reference/outbox/report/idempotency、fault injection、config、redaction 和 dependency metadata 组织。
- 每个 P0 用例必须回指可重复生成的数据集。
- 数据隔离以 `test_run_ref` 为最高隔离键,并按 member/ref/operation/job/view 等二级键分区。
- P0 外部依赖使用 fake / controlled / disabled,不使用真实 sibling repo 或真实外部产品。
- forbidden body、raw secret、unsupported version、same-key conflict、commit unknown、rollback failure、unsafe config 和 dependency violation 必须使用单独负向数据集。
- 清理方式必须是 run namespace drop、fake profile reset、isolated fixture delete 或 future durable run cleanup,不得依赖人工清理。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| fixture 文件目录和 builder 函数名 | 影响实现仓测试结构 | 当前不固定;Step 9 / implementation handoff 再承接 |
| write-audit fake repository 的实现方式 | 影响 query no-write / job no truth repair 数据断言 | Step 9 自动化门禁固定 |
| redaction leak corpus 的 dummy 字段集合 | 影响 redaction scan 覆盖 | Step 9 / Step 13 固定报告和 scanner |
| dependency metadata 从 manifest 生成还是 fixture graph | 影响 VETO-ID-006 gate | Step 9 固定 |
| future durable-like data cleanup | 影响 P1/P2 selected-run | 当前非 P0,Step 14 记录残余风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例的数据前置条件可满足 | 通过 | 见 §8.2 |
| 每个 P0 测试切口数据已停审 | 通过 | 见 §8.5 |
| 跨数据审计没有 unresolved 冲突 | 通过 | 见 §8.6 |
| 不依赖人工造数或真实 sibling repo | 通过 | P0 使用 fixture / builder / seed + fake / controlled / disabled |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 8 | 待用户确认 | 用户审核通过后进入 Step 8: 设计测试环境与配置矩阵 |
