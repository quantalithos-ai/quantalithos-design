# Step 7. 设计测试数据

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节: `05-测试方案.md` §7 测试数据设计

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 设计测试数据 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;`03` DTO / schema / 状态机 / 持久化契约;`04` profile / config / redaction |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_07_test_data.md` |
| 停审方式 | 按数据类型和测试切口分批写入;完成后暂停,由用户审查后再进入 Step 8 |

## 2. 本步目标

定义 Step 6 中所有 P0 用例的数据如何构造、隔离、复用和清理。

本 Step 只回答:

- 哪些基础 truth、DTO、snapshot、projection、outbox、job、config、redaction 和 fault injection 数据集必须存在。
- 哪些边界、异常、并发和恢复数据必须单独构造,不能复用 happy-path 数据掩盖断言。
- 数据如何按 run / tenant / context / operation namespace 隔离。
- 数据如何清理,避免跨用例污染。
- 哪些外部依赖使用 fake / stub / controlled / disabled,不使用真实 sibling repo 或真实外部产品。
- 每个 P0 用例是否能回指可重复生成的数据集。

本 Step 不定义具体 fixture 文件路径、builder 函数名、seed 代码、真实 DB truncate 脚本、CI suite、artifact 路径或正式 evidence ID。这些由实现仓测试代码、Step 8 环境矩阵、Step 9 自动化门禁和 Step 13 证据归档继续固定。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 TC-GOV-* 用例、前置条件和断言 |
| `03_ddd_step_06_object_contracts.md` | 正式输入 | 提供 truth object、state、reason、ref、marker 和 body-free 字段 |
| `03_ddd_step_08_protocol_contracts.md` | 正式输入 | 提供 Command / Query / Event / Job DTO 和 response / receipt / report schema |
| `03_ddd_step_09_function_flows.md` | 正式输入 | 提供 command/query/consumer/outbox/job 需要的读取和写入前置 |
| `03_ddd_step_10_state_matrix.md` | 正式输入 | 提供 legal / illegal state fixture 组合 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 正式输入 | 提供 version、UoW、outbox payload snapshot、stored result/report、projection/reference state 数据需求 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 invalid request、dependency unavailable、unsupported version、rollback failure 等错误数据 |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 idempotency key/digest、duplicate replay、commit unknown、race 数据需求 |
| `04-配置设计.md` §6 / §8 / §9 / §11 / §12 | 正式输入 | 提供 P0 profile、strict config、redaction、degraded/no-write、topic completeness 和 external GRC disabled 数据 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些基础数据必须存在? | 必须有 actor/scope/project-like subject refs、GovernanceContext、GovernanceInput、Gate、GovernanceDecision、ApprovalResponsibility、PolicyEffectiveFact、SharedRuleSet、PolicyConflictRecord、ControlApplicability、ControlReview、AIIA/SoA conclusion、Nonconformity、CorrectiveAction、VerificationResult、trace/audit/outbox/projection/reference/report/handoff/idempotency 基础数据集。 |
| 哪些边界、异常、并发和恢复数据必须构造? | 必须构造 missing metadata、unsupported schema version、forbidden body、invalid external ref、non-ready context、terminal state、wrong actor、same key different digest、version conflict、stored result missing、commit unknown、publisher failure、target disabled、projection race、reference unavailable、unsafe config、redaction leak 和 sibling dependency 数据。 |
| 数据如何隔离不同测试运行? | 所有数据集使用 `test_run_ref` 作为最高隔离键,再按 `tenant_ref`、`governance_context_ref`、`operation_namespace`、`idempotency_key`、`event_dedup_key`、`job_run_ref`、`projection_view_ref` 或 `external_reference_ref` 分区。 |
| 数据如何清理? | P0 fake/in-memory 数据默认按 run namespace drop;durable-like future 数据采用 run-scoped cleanup 或 transaction rollback。redaction leak fixtures 必须只进入 isolated artifact fixture,不得进入 shared store。 |
| 哪些外部依赖使用 fake / stub / real-like? | P0 使用 fake / controlled / disabled:source resolver fake、publisher fake、handoff fake、external GRC disabled/fake、write-audit fake repository、fake UoW、fake clock/id generator、config parser fixture、redaction artifact fixture。真实 sibling repo、真实 DB/bus/external GRC 不作为 P0 数据来源。 |
| 每个 P0 用例的数据前置条件是否能由 fixture / builder / seed 稳定构造? | 是。§8.2 按测试切口映射数据集。若实现阶段发现某 DTO 或 state 无法通过正式 builder 构造,必须回写 `03` 或记录阻塞,不得临时补 schema。 |
| 哪些负向、边界、并发和恢复数据需要单独数据集? | forbidden body、unsupported version、same-key conflict、stored result missing、commit unknown、projection race、reference failure、publisher permanent failure、rollback failure、unsafe config、redaction leak、dependency violation 均单独数据集,不得复用 happy path。 |
| 每个测试切口的数据设计完成后是否通过停审? | 通过。见 §8.3。 |
| 所有数据集完成后是否存在数据互相污染、清理缺失、外部依赖替身不明确或人工造数依赖? | 当前未发现 unresolved 冲突。见 §8.4。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 用例矩阵 | 每个 TC 有前置条件,但尚未明确数据集和隔离方式 | 本 Step 将前置条件转成数据集和映射 |
| 旧 `05-测试方案.md` | 旧数据口径未覆盖新版外部引用、snapshot、outbox、job report、redaction 和 config | 不继承旧数据表 |
| 详细设计 | 提供对象和 DTO,但不定义测试 fixture | 本 Step 定义 fixture / builder / seed 规则,不改详细设计 |
| config/redaction | `04` 给出测试主题,但需映射到具体配置数据 | 本 Step 增加 config 和 leak fixture 数据集 |
| fault injection | Step 6 需要 UoW / repository / adapter failure 数据 | 本 Step 明确 fake fault profile 数据集 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 基础数据 | 只在用例前置条件中口头出现 | 抽成 reusable baseline datasets | 避免人工造数和重复 fixture |
| 负向数据 | 分散在用例操作里 | 单独 negative datasets | 防止 happy-path 数据掩盖错误 |
| 外部依赖 | 用例只写 resolver/publisher fake | 明确 fake / controlled / disabled 数据归属 | 对齐产品中立和依赖裁剪 |
| 隔离 | 未说明 run/tenant/context 隔离 | 固定 `test_run_ref` + scoped refs | 防止跨用例污染 |
| 清理 | 未说明 | fake/in-memory drop namespace;durable future run cleanup | 支持自动化重复运行 |

## 7. 测试数据设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否使用真实 sibling repo 数据 | A. 使用真实仓;B. 使用 refs/safe snapshot fake | 采用 B。P0 只测 Governance seam |
| 是否把负向数据混在 happy fixture | A. 混用;B. 单独负向数据集 | 采用 B。便于明确触发错误和清理 |
| 是否固定 fixture 文件路径 | A. 本 Step 固定;B. 只固定数据集和构造规则 | 采用 B。路径由实现仓测试结构和 Step 9 决定 |
| 是否要求真实 DB 清理策略 | A. 当前固定;B. P0 fake/in-memory, durable future 再固定 | 采用 B。真实产品未锁定 |
| 是否生成正式 evidence 数据 | A. 生成 EV;B. 只保证可留证数据 | 采用 B。正式 evidence 留 Step 13 |

## 8. 结构化中间产物

### 8.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-GOV-RUN-001 run namespace | 所有测试的最高隔离壳 | seed `test_run_ref`、`tenant_ref`、fixed clock/id range | `test_run_ref` | drop run namespace / in-memory reset | 全部 TC |
| DS-GOV-ACTOR-001 actor and capability | command metadata、approval、visibility、capability snapshot | actor ref builder + capability summary fake | `test_run_ref` + actor ref | run namespace drop | TC-GOV-CONTRACT-002;TC-GOV-CMD-001~009;TC-GOV-CONSUMER-001 |
| DS-GOV-CONTEXT-001 ready context | context/input/gate/policy/control/compliance 主线 | builder creates `GovernanceContextState::Ready` with body-free subject/source refs | context ref | rollback/drop context namespace | TC-GOV-CMD-001~023;TC-GOV-QUERY-001 |
| DS-GOV-CONTEXT-002 pending/invalid/closed context | context negative and degraded branches | builder creates `PendingReference`、`Invalid`、`Closed` variants | context ref + state tag | run namespace drop | TC-GOV-DOMAIN-001;TC-GOV-STATE-001;TC-GOV-CMD-001 |
| DS-GOV-INPUT-001 governance input states | Submit/Update input cases | builder creates `Received`、`Accepted`、`PendingEvidence`、`Rejected`、`Superseded` | input ref + context ref | run namespace drop | TC-GOV-CMD-002~003;TC-GOV-QUERY-002;TC-GOV-STATE-002 |
| DS-GOV-GATE-001 gate decision chain | Gate / Decision / Approval command and state cases | builder creates gate `Open/PendingDecision/Decided`, decision `Proposed/Approved`, chain states | gate ref + decision ref | run namespace drop | TC-GOV-CMD-004~009;TC-GOV-STATE-003~004;TC-GOV-QUERY-003~005 |
| DS-GOV-POLICY-001 policy and shared rules | Policy effective, shared rules, conflict tests | builder creates active policy fact, shared rules, lower-scope candidate, conflict record | policy scope ref + policy ref | run namespace drop | TC-GOV-DOMAIN-003;TC-GOV-CMD-010~013;TC-GOV-QUERY-006~007 |
| DS-GOV-CONTROL-001 control coverage | Control applicability/review and coverage query | builder creates method control snapshot ref, applicability states, review states | control ref + context ref | run namespace drop | TC-GOV-CMD-014~015;TC-GOV-QUERY-008 |
| DS-GOV-COMPLIANCE-001 AIIA / SoA refs | Compliance conclusion tests | builder creates artifact/evidence refs, coverage refs, conclusion states | conclusion ref + artifact ref | run namespace drop | TC-GOV-DOMAIN-004;TC-GOV-CMD-016~018;TC-GOV-QUERY-009 |
| DS-GOV-NC-001 nonconformity loop | Nonconformity corrective flow | builder creates NC, action, verification states and source refs | nonconformity ref | run namespace drop | TC-GOV-DOMAIN-005;TC-GOV-CMD-019~023;TC-GOV-QUERY-010 |
| DS-GOV-PROTOCOL-001 valid DTO set | DTO roundtrip and command/query/event/job requests | canonical DTO builders from Step 8 schema | DTO family + schema version | no persistent cleanup | TC-GOV-CONTRACT-001 |
| DS-GOV-PROTOCOL-NEG-001 invalid DTO/envelope | required metadata, unsupported version, malformed page/scope | mutate valid DTO by deleting required fields or changing version | case id | no persistent cleanup | TC-GOV-CONTRACT-002~004;TC-GOV-CMD-024;TC-GOV-CONSUMER-012;TC-GOV-JOB-009 |
| DS-GOV-EXTREF-001 resolved safe snapshots | source resolver success for identity/process/work/artifact/method/runtime/conversation/observability | fake resolver returns refs/safe summaries/digests only | external reference ref | fake resolver reset | TC-GOV-CONSUMER-001~009;TC-GOV-CMD-010/014/016/019 |
| DS-GOV-EXTREF-NEG-001 forbidden body / digest mismatch | external body boundary and digest mismatch | fake resolver/event includes forbidden body or mismatched digest | external reference ref + negative tag | isolated fake reset;do not persist body | TC-GOV-CMD-030;TC-GOV-CONSUMER-004;TC-GOV-REDACTION-* |
| DS-GOV-REFERENCE-001 tracked reference states | refresh scope and query degraded tests | seed `ReferenceResolutionState` resolved/stale/unavailable with versions and last good snapshot | external reference ref + version | run namespace drop | TC-GOV-JOB-003;TC-GOV-IDEMP-009~010;TC-GOV-CONFIG-008 |
| DS-GOV-PROJECTION-001 views and freshness | Query hit/stale/degraded and projection rebuild | seed formal `DerivedGovernanceViewRef`, view body, freshness state, dependency index | view ref + source cursor | run namespace drop | TC-GOV-QUERY-001~016;TC-GOV-JOB-002;TC-GOV-IDEMP-007~008 |
| DS-GOV-OUTBOX-001 pending payload snapshots | Outbound event and publish tests | seed outbox records with stored payload snapshots for 12 event kinds | outbox ref + version | run namespace drop | TC-GOV-OUTBOX-001~015;TC-GOV-JOB-001 |
| DS-GOV-REPORT-001 job/reconciliation reports | Job duplicate and reconciliation query | seed stored job report, reconciliation report clean/finding/failed | job run ref + report ref | run namespace drop | TC-GOV-JOB-004/008;TC-GOV-QUERY-014;TC-GOV-IDEMP-002 |
| DS-GOV-HANDOFF-001 handoff/archive/export markers | Trace/archive/external GRC job tests | seed non-empty trace refs, target refs, marker states, disabled target case | handoff target ref + job run ref | run namespace drop | TC-GOV-JOB-005~007;TC-GOV-IDEMP-011~012 |
| DS-GOV-IDEMP-001 idempotency records | duplicate replay and conflict | seed reserved/completed/conflict records with canonical digest and stored result/report refs | operation namespace + idempotency key | run namespace drop | TC-GOV-CMD-025~026;TC-GOV-JOB-008;TC-GOV-IDEMP-001~005 |
| DS-GOV-FAULT-001 repository/UoW failures | rollback/version/store/commit unknown | fake repository/UoW fault profile | fault case id + operation ref | reset fake fault profile | TC-GOV-CMD-027~029;TC-GOV-IDEMP-004~006/013 |
| DS-GOV-PUBLISHER-001 publisher/handoff failures | retryable/permanent publish and handoff failures | fake publisher/handoff/export adapter fault profile | adapter slot + fault case id | reset fake adapter | TC-GOV-OUTBOX-014~016;TC-GOV-JOB-005~007 |
| DS-GOV-CONFIG-001 valid P0 profiles | runtime builder and profile matrix | config fixtures for `local-dev`、`ci-test`、`integration-like`、`operations-replay` | profile ref + config digest | no persistent cleanup | TC-GOV-CONFIG-001 |
| DS-GOV-CONFIG-NEG-001 invalid config variants | strict JSON/source priority/topic/profile isolation/boundary override | mutate valid config into invalid cases | config case id + digest | no persistent cleanup | TC-GOV-CONFIG-002~006 |
| DS-GOV-REDACTION-001 safe output corpus | redaction positive checks | collect logs/metrics/audit/trace/report/outbox from representative successful runs | test_run_ref + artifact kind | drop artifact namespace | TC-GOV-REDACTION-001~003 |
| DS-GOV-REDACTION-NEG-001 leak corpus | redaction negative scanner | isolated artifact/report fixture containing dummy raw secret/body/full ref | leak case id | delete isolated fixture after scanner | TC-GOV-REDACTION-004 |
| DS-GOV-ARCH-001 dependency metadata | dependency boundary check | implementation dependency metadata fixture or generated dependency graph | package graph digest | no persistent cleanup | TC-GOV-ARCH-001 |

### 8.2 按测试切口组织的数据前置映射表

| 测试切口 | 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|---|
| contracts protocol / metadata / digest | TC-GOV-CONTRACT-001 | DS-GOV-PROTOCOL-001 | canonical DTO builders for all public families | none | no persistent cleanup |
| contracts protocol / metadata / digest | TC-GOV-CONTRACT-002~004 | DS-GOV-PROTOCOL-NEG-001;DS-GOV-IDEMP-001 | mutate metadata/schema/digest fields;seed idempotency record | fake idempotency repo | no persistent cleanup / run namespace drop |
| domain object / policy / state | TC-GOV-DOMAIN-001~005 | DS-GOV-CONTEXT-001;DS-GOV-GATE-001;DS-GOV-POLICY-001;DS-GOV-COMPLIANCE-001;DS-GOV-NC-001 | domain object builders with valid and invalid state/policy inputs | fake resolver for safe snapshots where needed | run namespace drop |
| domain object / policy / state | TC-GOV-STATE-001~006 | DS-GOV-CONTEXT-002;DS-GOV-INPUT-001;DS-GOV-GATE-001;DS-GOV-POLICY-001;DS-GOV-PROJECTION-001;DS-GOV-REPORT-001 | state-specific builders for terminal/illegal transition cases | fake repositories for marker states | run namespace drop |
| command orchestration | TC-GOV-CMD-001~003 | DS-GOV-ACTOR-001;DS-GOV-CONTEXT-001/002;DS-GOV-INPUT-001;DS-GOV-EXTREF-001;DS-GOV-REFERENCE-001 | command DTO builders + context/input/reference seeds | fake resolver, fake UoW | run namespace drop |
| command orchestration | TC-GOV-CMD-004~009 | DS-GOV-ACTOR-001;DS-GOV-CONTEXT-001;DS-GOV-GATE-001 | gate/decision/responsibility chain seeds | fake capability resolver, fake UoW | run namespace drop |
| command orchestration | TC-GOV-CMD-010~015 | DS-GOV-POLICY-001;DS-GOV-CONTROL-001;DS-GOV-EXTREF-001 | policy/control/method snapshot seeds | fake method resolver | run namespace drop |
| command orchestration | TC-GOV-CMD-016~023 | DS-GOV-COMPLIANCE-001;DS-GOV-NC-001;DS-GOV-EXTREF-001 | compliance/nonconformity/evidence/source seeds | fake artifact/evidence/runtime resolver | run namespace drop |
| command orchestration | TC-GOV-CMD-024~030 | DS-GOV-PROTOCOL-NEG-001;DS-GOV-IDEMP-001;DS-GOV-FAULT-001;DS-GOV-EXTREF-NEG-001 | invalid request, duplicate, conflict, rollback, forbidden body seeds | fake UoW/repository/resolver | run namespace drop / reset fake fault profile |
| query no-write | TC-GOV-QUERY-001~014 | DS-GOV-PROJECTION-001;DS-GOV-CONTEXT-001;DS-GOV-INPUT-001;DS-GOV-GATE-001;DS-GOV-POLICY-001;DS-GOV-CONTROL-001;DS-GOV-COMPLIANCE-001;DS-GOV-NC-001;DS-GOV-REPORT-001 | projection/view/report seeds for each query | fake read repositories with write audit disabled for baseline | run namespace drop |
| query no-write | TC-GOV-QUERY-015~016 | DS-GOV-PROJECTION-001;DS-GOV-REFERENCE-001;DS-GOV-FAULT-001 | not-visible/degraded/write-audit state seeds | fake visibility policy, write-audit repository | run namespace drop / reset audit |
| inbound consumer | TC-GOV-CONSUMER-001~009 | DS-GOV-PROTOCOL-001;DS-GOV-EXTREF-001;DS-GOV-REFERENCE-001;DS-GOV-PROJECTION-001 | event envelope builders + safe snapshot resolver | fake source resolver, fake receipt store | run namespace drop |
| inbound consumer | TC-GOV-CONSUMER-010~012 | DS-GOV-PROTOCOL-NEG-001;DS-GOV-IDEMP-001;DS-GOV-EXTREF-NEG-001;DS-GOV-FAULT-001 | duplicate receipt, unsupported version, source unavailable seeds | fake receipt store, fake resolver | run namespace drop / reset fake fault profile |
| outbound event / publish | TC-GOV-OUTBOX-001~013 | DS-GOV-OUTBOX-001;DS-GOV-CONTEXT-001;DS-GOV-GATE-001;DS-GOV-POLICY-001;DS-GOV-CONTROL-001;DS-GOV-COMPLIANCE-001;DS-GOV-NC-001 | stored payload snapshots for all event kinds | fake publisher success | run namespace drop |
| outbound event / publish | TC-GOV-OUTBOX-014~016 | DS-GOV-OUTBOX-001;DS-GOV-PUBLISHER-001;DS-GOV-FAULT-001 | pending outbox with versions + retryable/permanent/parallel publish faults | fake publisher, fake repository version conflict | run namespace drop / reset adapter |
| operations job | TC-GOV-JOB-001~004 | DS-GOV-OUTBOX-001;DS-GOV-PROJECTION-001;DS-GOV-REFERENCE-001;DS-GOV-REPORT-001 | job input and store seeds for publish/rebuild/refresh/reconcile | fake repositories and resolvers | run namespace drop |
| operations job | TC-GOV-JOB-005~007 | DS-GOV-HANDOFF-001;DS-GOV-CONFIG-001;DS-GOV-PUBLISHER-001 | trace refs, target refs, disabled target/export config | fake handoff/archive/export adapter;external GRC disabled/fake | run namespace drop / reset adapter |
| operations job | TC-GOV-JOB-008~010 | DS-GOV-IDEMP-001;DS-GOV-REPORT-001;DS-GOV-FAULT-001 | stored job report, malformed job input, truth write-audit | fake job result store, write-audit repository | run namespace drop / reset audit |
| consistency / idempotency / recovery | TC-GOV-IDEMP-001~006 | DS-GOV-IDEMP-001;DS-GOV-REPORT-001;DS-GOV-FAULT-001;DS-GOV-OUTBOX-001 | idempotency records, missing result/report, commit unknown, outbox failure | fake idempotency/result/UoW/outbox repositories | run namespace drop / reset fault profile |
| consistency / idempotency / recovery | TC-GOV-IDEMP-007~010 | DS-GOV-PROJECTION-001;DS-GOV-REFERENCE-001;DS-GOV-EXTREF-NEG-001 | dependency index, projection cursor race, tracked references, last good snapshot | fake projection/reference repositories and resolver | run namespace drop |
| consistency / idempotency / recovery | TC-GOV-IDEMP-011~013 | DS-GOV-HANDOFF-001;DS-GOV-PUBLISHER-001;DS-GOV-FAULT-001 | empty trace refs, export marker trace, rollback failure | fake handoff/export/UoW adapters | run namespace drop / reset fault profile |
| config | TC-GOV-CONFIG-001~008 | DS-GOV-CONFIG-001;DS-GOV-CONFIG-NEG-001;DS-GOV-REFERENCE-001;DS-GOV-PROJECTION-001 | valid and invalid profile/config fixtures | config parser/builder fake, write-audit repository | no persistent cleanup / reset audit |
| redaction | TC-GOV-REDACTION-001~004 | DS-GOV-REDACTION-001;DS-GOV-REDACTION-NEG-001;DS-GOV-EXTREF-NEG-001 | safe corpus and isolated leak corpus | redaction checker fixture | delete isolated leak fixture |
| dependency boundary | TC-GOV-ARCH-001 | DS-GOV-ARCH-001 | generated dependency metadata or fixture graph | none | no persistent cleanup |

### 8.3 数据构造规则

| 规则 | 正式口径 |
|---|---|
| deterministic ids | test builders use deterministic id ranges scoped by `test_run_ref`;no wall-clock random ids in assertions |
| fixed clock | time-dependent states use fake clock seeded by run;no real current time in expected values |
| canonical digest | idempotency and request digest fixtures use the same canonicalization profile as Step 13;volatile metadata excluded |
| body-free snapshots | external resolver fixtures return refs, safe summaries, digest refs and status only;forbidden body fixtures stay isolated in negative datasets |
| versioned state | any existing state update fixture includes expected version;cursor is not used as optimistic version |
| formal refs only | projection/handoff/outbox fixtures use formal `DerivedGovernanceViewRef`, outbox ref, trace ref and marker refs;no ad hoc string refs |
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
| DS-GOV-RUN-001 | 是否提供全局 run 隔离 | 通过 | 具体 run id 生成留实现仓 |
| actor/context/input/gate/policy/control/compliance/NC datasets | 是否覆盖核心 truth 主线与状态前置 | 通过 | builder 函数名留实现仓 |
| DS-GOV-PROTOCOL-001 / NEG-001 | 是否覆盖 DTO roundtrip、missing metadata、unsupported version | 通过 | schema generator 由实现决定 |
| DS-GOV-EXTREF-001 / NEG-001 | 是否覆盖 safe snapshot 和 forbidden body | 通过 | negative body 只留 isolated fixture |
| DS-GOV-REFERENCE-001 | 是否覆盖 tracked state、last good snapshot、degraded | 通过 | version source 必须来自 repository fixture |
| DS-GOV-PROJECTION-001 | 是否覆盖 query hit/stale/degraded and rebuild race | 通过 | view refs 必须 formal |
| DS-GOV-OUTBOX-001 | 是否覆盖 12 outbound event stored payload snapshots | 通过 | 不从 current truth 重建 payload |
| DS-GOV-REPORT-001 | 是否覆盖 reconciliation/job duplicate report | 通过 | stored report kind 必须匹配 operation |
| DS-GOV-HANDOFF-001 | 是否覆盖 non-empty trace refs and disabled target | 通过 | empty trace refs 单独 negative |
| DS-GOV-IDEMP-001 | 是否覆盖 duplicate replay and digest conflict | 通过 | namespace isolation 必须显式 |
| DS-GOV-FAULT-001 / PUBLISHER-001 | 是否覆盖 rollback/version/commit unknown/publish failure | 通过 | fault profile 每 case reset |
| DS-GOV-CONFIG-001 / NEG-001 | 是否覆盖 P0 profiles、strict JSON、source priority、topic/profile isolation | 通过 | formal env key/path 留 Step 8/9 |
| DS-GOV-REDACTION-001 / NEG-001 | 是否覆盖 safe corpus and leak scanner | 通过 | 只使用 dummy leak data |
| DS-GOV-ARCH-001 | 是否覆盖 dependency boundary | 通过 | check tool 留 Step 9 |

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

- 测试数据按 run namespace、truth objects、protocol DTO、external safe snapshots、projection/reference/outbox/report/handoff/idempotency、fault injection、config、redaction 和 dependency metadata 组织。
- 每个 P0 用例必须回指可重复生成的数据集。
- 数据隔离以 `test_run_ref` 为最高隔离键,并按 context/ref/operation/job/view 等二级键分区。
- P0 外部依赖使用 fake / controlled / disabled,不使用真实 sibling repo 或真实外部产品。
- forbidden body、raw secret、unsupported version、same-key conflict、commit unknown、rollback failure、unsafe config 和 dependency violation 必须使用单独负向数据集。
- 清理方式必须是 run namespace drop、fake profile reset、isolated fixture delete 或 future durable run cleanup,不得依赖人工清理。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| fixture 文件目录和 builder 函数名 | 影响实现仓测试结构 | 当前不固定;Step 9 / implementation handoff 再承接 |
| write-audit fake repository 的实现方式 | 影响 query no-write / job no truth repair 数据断言 | Step 9 自动化门禁固定 |
| redaction leak corpus 的 dummy 字段集合 | 影响 redaction scan 覆盖 | Step 9 / Step 13 固定报告和 scanner |
| dependency metadata 从 manifest 生成还是 fixture graph | 影响 VF-GOV-010 gate | Step 9 固定 |
| future durable-like data cleanup | 影响 P1/P2 selected-run | 当前非 P0,Step 14 记录残余风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 用例的数据前置条件可满足 | 通过 | 见 §8.2 |
| 每个 P0 测试切口数据已停审 | 通过 | 见 §8.5 |
| 跨数据审计没有 unresolved 冲突 | 通过 | 见 §8.6 |
| 不依赖人工造数或真实 sibling repo | 通过 | P0 使用 fixture / builder / seed + fake / controlled / disabled |
| 可进入 Step 8 | 通过 | 下一步设计测试环境与配置矩阵;进入前等待用户审查 |
