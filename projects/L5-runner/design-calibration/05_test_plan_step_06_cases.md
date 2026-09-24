# Step 6. 设计测试场景与用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节：`05-测试方案.md` §6
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与执行边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 6 |
| current_module | `cases:cut_by_cut_scenario_and_assertion_matrix` |
| gate_status | `pass_for_step_07` |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 已完成；进入 Step 7 |

本 Step 只生成测试设计合同：场景、前置、操作、正式字段/状态/错误断言、自动化候选和候选证据族。`TC-RUN-*`、`EV-CAND-RUN-*`、suite 名称和脚本名称不表示测试、fixture、artifact、report 或 evidence 已存在。真实 owner、Sandbox、Runtime、Observability、Archive、平台和 L0-sdk 正向路径继续保持 `planned/blocked`。

## 2. 本步目标、输入与非目标

### 2.1 目标

把 Step 5 的需求→设计→切口追溯矩阵落成可执行的用例向量，确保每个 P0 切口至少拥有：

1. 正向主线或明确的 blocked-positive 形状；
2. 关键负向、非法状态、边界、并发、恢复或一致性场景；
3. 正式 DTO、字段、状态、错误或副作用断言；
4. 可重复的数据前置和自动化候选；
5. 只规划、不伪造的候选证据族；
6. 与后续 phase、owner truth 和验收证据的边界。

### 2.2 输入基线

| 输入 | 本 Step 用途 |
|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 提供 18 个切口、FR/BR/AC/NFR 双向追溯和 TC/EV 候选族。 |
| `05_test_plan_step_03_test_objects_cuts.md` | 提供测试对象、风险红线和主发现层级。 |
| `05_test_plan_step_04_strategy_layers.md` | 固定 Contract/Unit、Service、Fake/Controlled Integration、Entry/Worker/Job、Release gate 分层。 |
| `03_ddd_step_06_object_contracts.md` | 固定正式对象、字段来源、 nominal ref 映射和 21 个状态主语。 |
| `03_ddd_step_08_protocol_contracts.md` | 固定 11 Command、12 Query、4 planned Consumer、0 outbound event、5 Job 的请求/结果面。 |
| `03_ddd_step_09_function_flows.md` | 固定 `FLOW-C01~C11`、`FLOW-Q01~Q12`、`FLOW-E01~E04`、`FLOW-J01~J05` 顺序和副作用边界。 |
| `03_ddd_step_10_state_matrix.md` | 固定合法/非法迁移、终态冻结、generation guard 和 technical state。 |
| `03_ddd_step_11_persistence_consistency.md`、`03_ddd_step_13_concurrency_idempotency.md` | 固定 UoW、expected version、stored result、commit-unknown、duplicate、claim/checkpoint 和 projection guard。 |
| `03_ddd_step_12_error_recovery.md` | 固定 typed error 与 `Rejected/Conflict/Blocked/Unknown/UnsupportedVersion/Duplicate` 映射。 |
| `03_ddd_step_14_config_dependencies.md`、`04-配置设计.md` §12 | 固定 strict profile、builder/readiness、configured/enabled/ready 和 failure posture。 |
| `03_ddd_step_15_observability_audit.md` | 固定安全日志、低基数指标、audit/trace 分层、禁止字段和 handoff 边界。 |

### 2.3 非目标

- 不创建测试代码、fixture、数据生成器、CI job、脚本、artifact、report 或 evidence。
- 不锁实现语言、测试 runner、文件路径、数据库/cache backend、transport、SDK 方法或平台命令。
- 不把 fake/controlled adapter 的语义通过写成真实跨仓 integration、durable parity、性能/SLO 或产品 readiness。
- 不在本 Step 确定最终 `EV-*` 编号、验收 verdict、signoff、baseline、commit 或 run_id；这些分别留给 Step 9/12/13/15 和真实执行阶段。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 每个 P0 正向主线怎么执行？ | 按 `validate → load/read → local transition/UoW → one external read/effect（如授权）→ stored result/report → disposition` 组织；Query 只读；Consumer 先 header/readiness；Job 先 claim/checkpoint。 |
| 关键反向和边界如何触发？ | 缺字段、隐式 selector、scope/binding/generation 漂移、非法 state、expected-version 冲突、duplicate digest、commit unknown、依赖 unavailable/unsupported、redaction failure、generation mismatch 和 forbidden output canary。 |
| 非法迁移如何断言？ | 使用 `DomainError::InvalidStateTransition` 或对应 `ApplicationError`/protocol surface；断言不写 accepted trace/history、stored accepted result、owner truth、projection fresh marker 或危险副作用。 |
| 事务回滚和副作用如何验证？ | 通过 controlled repository/UoW/port failure 注入，检查 local write set、调用次数、顺序、expected version、stored result/report 和 RecoveryCase；不依赖最终页面。 |
| 恢复如何复现？ | 同 key duplicate、same-key/different-digest、Reserved/InProgress、commit unknown、external timeout、owner read unavailable、claim/checkpoint ambiguity、projection race 和 partial report。恢复只允许正式 readback/人工审查，禁止 blind replay/resend/reclaim/resume。 |
| 用例断言哪些正式结果？ | 只使用 03/04 已存在的字段、状态、错误、flow 和 disposition；例如 `Accepted`、`Running`、`Complete`、`Verified`、`Qualified`、`Confirmed`、`Cleaned`、`Delivered` 各自独立。 |
| 是否有 phase 越界？ | 计划中的正向 owner success、正式 evidence、生产 SLO 和跨仓 durable parity 均标记 `blocked/future`，不能成为当前通过条件。 |
| 每个切口是否同时覆盖正向和负向？ | 是；若正向 seam 未获 authority，则保留 semantic positive shape + blocked-positive 断言，并至少有本地负向可达用例。 |

## 4. 用例设计统一约定

| 约定 | 规则 |
|---|---|
| 用例编号 | `TC-RUN-<CUT>-<三位序号>`；编号只在本 Step 作为计划标识。 |
| 候选证据 | `EV-CAND-RUN-<CUT>-<三位序号>`；Step 13 才绑定固定 run-scoped path。 |
| 前置 | 用 `D-*` 数据集候选描述，不创建实际 fixture；Step 7 细化。 |
| 自动化候选 | `contract`、`service`、`fake-integration`、`entry`、`worker`、`job` 或 `static-scan`；不表示已存在 runner。 |
| 调用次数 | 对 no-write/no-replay 用明确的 `=0` 断言；对真实外部调用只在受控 adapter 语义下断言。 |
| blocked-positive | 断言 `Blocked/Unsupported/Unknown` 和安全零副作用，不断言 owner success。 |
| evidence 边界 | 本 Step 只预留候选族，不生成证据、报告、verdict 或 signoff。 |

## 5. 按测试切口组织的用例批次

| CUT | 测试切口 | 用例批次 | 主层级 | 正向成熟度 | 候选证据族 | 停审状态 |
|---:|---|---|---|---|---|---|
| 01 | `context_selection_exact_binding` | `TC-RUN-CTX-001~006` | Contract/Domain/Service | semantic planned | `EV-CAND-RUN-CTX-*` | 已停审 / 通过 |
| 02 | `material_acquisition_integrity_axes` | `TC-RUN-MAT-001~007` | Domain/Service/Fake | source positive blocked | `EV-CAND-RUN-MAT-*` | 已停审 / 通过 |
| 03 | `run_intent_acceptance_boundary` | `TC-RUN-REQ-001~006` | Service/Controlled adapter | Sandbox positive blocked | `EV-CAND-RUN-REQ-*` | 已停审 / 通过 |
| 04 | `control_intent_result_separation` | `TC-RUN-CTL-001~005` | Domain/Service | owner result blocked | `EV-CAND-RUN-CTL-*` | 已停审 / 通过 |
| 05 | `owner_projection_truth_attribution` | `TC-RUN-OWN-001~005` | Service/Integration-like | Runtime read blocked | `EV-CAND-RUN-OWN-*` | 已停审 / 通过 |
| 06 | `resource_cleanup_guard` | `TC-RUN-RES-001~006` | Domain/Controlled adapter | platform/Sandbox blocked | `EV-CAND-RUN-RES-*` | 已停审 / 通过 |
| 07 | `unknown_recovery_manual_review` | `TC-RUN-REC-001~006` | Service/Job | readback blocked | `EV-CAND-RUN-REC-*` | 已停审 / 通过 |
| 08 | `bounded_redacted_presentation` | `TC-RUN-PRE-001~006` | Contract/Redaction fake | Observability positive blocked | `EV-CAND-RUN-PRE-*` | 已停审 / 通过 |
| 09 | `query_read_surface_no_write` | `TC-RUN-QRY-001~006` | Service/Entry | local semantic planned | `EV-CAND-RUN-QRY-*` | 已停审 / 通过 |
| 10 | `protocol_secondary_type_closure` | `TC-RUN-CON-001~006` | Contract/Entry | semantic planned | `EV-CAND-RUN-CON-*` | 已停审 / 通过 |
| 11 | `command_ordering_and_duplicate` | `TC-RUN-IDM-001~006` | Application service | local store blocked | `EV-CAND-RUN-IDM-*` | 已停审 / 通过 |
| 12 | `versioned_uow_commit_unknown` | `TC-RUN-UOW-001~006` | Repository/UoW fake | durable parity blocked | `EV-CAND-RUN-UOW-*` | 已停审 / 通过 |
| 13 | `entry_actor_scope_dispatch` | `TC-RUN-ENT-001~005` | Entry/Contract | semantic planned | `EV-CAND-RUN-ENT-*` | 已停审 / 通过 |
| 14 | `consumer_header_first_negative` | `TC-RUN-CNS-001~006` | Worker/Entry | all positive apply blocked | `EV-CAND-RUN-CNS-*` | 已停审 / 通过 |
| 15 | `job_claim_checkpoint_report` | `TC-RUN-JOB-001~008` | Job/Repository fake | external positive blocked | `EV-CAND-RUN-JOB-*` | 已停审 / 通过 |
| 16 | `config_builder_readiness_layers` | `TC-RUN-CFG-001~006` | Config/Builder integration | physical builder blocked | `EV-CAND-RUN-CFG-*` | 已停审 / 通过 |
| 17 | `observability_forbidden_field_boundary` | `TC-RUN-OBS-001~006` | Contract/Static scan | sink/SLO blocked | `EV-CAND-RUN-OBS-*` | 已停审 / 通过 |
| 18 | `cross_axis_non_escalation_and_event_zero` | `TC-RUN-BND-001~006` | Cross-cut call audit | semantic planned | `EV-CAND-RUN-BND-*` | 已停审 / 通过 |

## 6. 场景总表

| 场景组 | 覆盖切口 | 主要正向形状 | 关键负向/边界 | 主要正式断言 | phase 边界 |
|---|---|---|---|---|---|
| exact context/selection | 01、10、13 | explicit `ReleaseRef`/`ArtifactVersionRef`/scope 形成 `ReleaseSelection` | `latest/default/newest/tag/branch`、scope/generation/authority mismatch | `SelectionState::Current/Blocked/Stale/Invalidated`、`AuthorityBlocked`、`Conflict` | Current 不等 Qualified/Running |
| material qualification | 02、16 | task transfer、integrity check、cache promotion 的分轴组合 | source unavailable、digest/signature/platform/authority drift | `AcquisitionState`、`IntegrityState`、`MaterialCacheState` | Complete 不等 Verified/Qualified |
| run request | 03、11、12 | qualified binding + guard → `RunIntent`/Sandbox request posture | unqualified material、resource conflict、timeout/commit unknown | `RunIntentState::Accepted/Unknown/Rejected`、RecoveryCase | Accepted 不等 Running |
| control/cleanup | 04、06 | explicit Start/Stop/Cancel/Cleanup intent | ACK/receipt only、stale owner basis、unsafe guard | `ControlIntentState`、`ProtectionState`、`OwnerCleanupPosture` | Confirmed 不等 Cleaned/Released |
| owner read projection | 05、07 | safe owner snapshot appears in bounded view | read unavailable、stale/unknown, local observation | source/freshness/visibility, `OwnerExecutionPosture` | projection 不反写 owner |
| recovery | 07、11、12、15 | frozen case → explicit readback/manual review | replay/resend/reclaim/resume | `RecoveryState`、`ConsistencyUnknown`、RecoveryCase ref | Closed 不等 owner success |
| safe presentation | 08、17 | bounded/redacted preview and diagnosis | raw body/secret/path/PID/port/stack canary | `PreviewSafetyPosture`、`DiagnosisCertainty`、redaction issue | Delivered 不等 evidence/report |
| query surface | 09 | committed read model sections | refresh/reconcile/probe/dispatch from Query | no-write call log = 0, degraded markers | Query 不触发 Job |
| protocol/entry | 10、13、14 | finite DTO/entry dispatch | missing metadata, body/route mismatch, payload parse | `Rejected`/`UnsupportedVersion`/`Blocked` | transport status不升级业务 truth |
| operations | 15 | bounded claim/checkpoint/report | duplicate scan, blocked compression, owner repair | `RunnerJobDisposition`/`RunnerJobReport` | Job Completed 不等业务成功 |
| cross-axis/event absence | 18 | all formal axes remain independent | shortcut state, publisher/outbox/topic residue | state matrix and call audit | Runner outbound event count = 0 |

## 7. 用例矩阵（一）：context、material、run、control

### 7.1 `context_selection_exact_binding`（CUT-01）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-CTX-001` | `D-CTX-VALID`：trusted actor/scope/platform；exact release/version 可解析 | 执行 `FLOW-C01 SelectRelease` | 生成 successor `SelectionGeneration`，selection 进入 `Checking` 后按 authority 结果保存 | `ReleaseSelection.release_ref`、`version_ref`、`scope_ref`、generation 一一对应；不含 selector 字符串 | contract/service | `EV-CAND-RUN-CTX-001` |
| `TC-RUN-CTX-002` | 同上，authority 返回 approved/baselined/active/current 的 semantic read | 完成 authority assessment | semantic positive 可映射 `SelectionState::Current`；不推导 material/run | authority ref、freshness、source attribution；`Current != Qualified` | fake-integration（正向 planned） | `EV-CAND-RUN-CTX-002` |
| `TC-RUN-CTX-003` | 缺 scope、platform 或 version | dispatch `SelectRelease` | `Rejected(MissingRequiredField/InvalidInput)`；所有 repo/port/UoW 调用 = 0 | entry `RunnerHandlerDisposition`；无 accepted trace/result | contract/entry | `EV-CAND-RUN-CTX-003` |
| `TC-RUN-CTX-004` | selector 输入使用 `latest/default/newest/tag/branch` 或 mutable alias | 尝试反序列化/调用 C01 | reject；不调用 authority、不创建 selection | exact ref 类型不可由隐式 selector 构造 | contract | `EV-CAND-RUN-CTX-004` |
| `TC-RUN-CTX-005` | authority unavailable/revoked/expired/scope conflict | controlled authority read 返回不可证明结果 | `SelectionState::Blocked` 或 `Stale`，带 `AuthorityBlocked/StaleBasis`；不补 cache | `authority_ref` 不伪造，run/material 后续不可用 | fake-integration（blocked） | `EV-CAND-RUN-CTX-005` |
| `TC-RUN-CTX-006` | 旧 generation 与新 selection 并发 invalidate | 使用 stale `expected_generation` 调 C02 | `Conflict/GenerationMismatch`；新 generation 不被覆盖 | successor generation 与 version fence；无 owner write | service/UoW fake | `EV-CAND-RUN-CTX-006` |

### 7.2 `material_acquisition_integrity_axes`（CUT-02）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-MAT-001` | `SelectionState::Current`、authority basis 可重验证 | 执行 C03 | 只创建 `AcquisitionTask::Absent`，不下载/验证 | `locator_ref=None`、source/verifier call = 0；`Complete/Verified/Qualified` 均不可达 | service | `EV-CAND-RUN-MAT-001` |
| `TC-RUN-MAT-002` | J01 source resolution 可用，返回 safe locator | 运行 material job 的 resolving→transferring | `AcquisitionState::Transferring`，locator 为 opaque ref | locator 不含 secret/body/path；checkpoint basis exact | fake-integration（planned） | `EV-CAND-RUN-MAT-002` |
| `TC-RUN-MAT-003` | transfer finished但 manifest/digest/signature尚未完成 | 完成 transfer，查询 Q04 | `AcquisitionState::Complete` 但 `IntegrityState::Pending/Verifying`、cache 不 Qualified | 不把 Complete 映射 Verified/Qualified | service/query | `EV-CAND-RUN-MAT-003` |
| `TC-RUN-MAT-004` | digest/signature/platform mismatch | J01 verifier 返回 mismatch | `IntegrityState::Invalid` 或 `Blocked`，cache 不 promote | `DigestCheckResult`/`SignatureCheckResult`/platform result 保留；无 run request | fake-integration | `EV-CAND-RUN-MAT-004` |
| `TC-RUN-MAT-005` | authority freshness drift或selection invalidated during transfer | 触发 C02/J01 race | task/cache/integrity 转 stale/blocked；RecoveryCase 如 effect unknown | generation/binding mismatch；不复用旧 material | service/UoW fake | `EV-CAND-RUN-MAT-005` |
| `TC-RUN-MAT-006` | Pause/Resume 在合法与 terminal 状态 | C04/C05 with `Paused`、`Complete`、`Cancelled` | 合法仅 `Transferring/Resolving→Paused→Transferring`；terminal pause/resume rejected | `DomainError::InvalidStateTransition`；不生成 ACK/transfer | domain/service | `EV-CAND-RUN-MAT-006` |
| `TC-RUN-MAT-007` | ambiguous transfer outcome、Cancel | C06 或 J01 timeout 后再取消 | `AcquisitionState::Unknown` 不存在于 acquisition enum时，映射为 failure/recovery posture而非伪造 `Cancelled` | `RecoveryCase`/safe issue；不删除 cache、不标 Evicted | service/job fake | `EV-CAND-RUN-MAT-007` |

### 7.3 `run_intent_acceptance_boundary`（CUT-03）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-REQ-001` | exact context/selection，`MaterialCacheState::Qualified`、integrity verified、guard safe | 执行 C07 `RequestRun` | 本地 `RunIntent` 进入 `Draft→Submitting`；controlled Sandbox acceptance 时为 `Accepted` | `RunRequestResult.sandbox_request_ref` 仅是 request ref；没有 Running/success 字段 | service/controlled | `EV-CAND-RUN-REQ-001` |
| `TC-RUN-REQ-002` | material Complete但未 Verified/Qualified | C07 | `Rejected` 或 `Blocked(SafetyBlocked)`；Sandbox call = 0 | qualified binding 不可构造；无 run intent accepted trace | service | `EV-CAND-RUN-REQ-002` |
| `TC-RUN-REQ-003` | requested resource 与 bounded local observation 冲突 | C07 preflight | `Blocked`/`Conflict`；不静默抢占或改资源 | resource request ≠ allocation truth；no owner mutation | fake-integration | `EV-CAND-RUN-REQ-003` |
| `TC-RUN-REQ-004` | Sandbox adapter unavailable/unsupported before effect | controlled port readiness negative | `Blocked/UnsupportedContract`；external effect call = 0 | configured/enabled/ready separation；RunIntent remains non-accepted | fake-integration | `EV-CAND-RUN-REQ-004` |
| `TC-RUN-REQ-005` | Sandbox call timeout/ambiguous response after durable intent | C07 external effect injection | `RunIntentState::Unknown` + `RecoveryCase`/`ConsistencyUnknown` | 不把 timeout 映射 Rejected/Running；不重发 | service/recovery | `EV-CAND-RUN-REQ-005` |
| `TC-RUN-REQ-006` | duplicate same key/digest and same key/different digest | replay C07 | exact stored `RunRequestResult`/`DuplicateReplayed`；different digest `Conflict` | second Sandbox call = 0；原 result 不重算 | service/idempotency | `EV-CAND-RUN-REQ-006` |

### 7.4 `control_intent_result_separation`（CUT-04）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-CTL-001` | existing RunIntent；valid owner basis | C08 `Start/Stop/Cancel` | 创建独立 `ControlIntent`，先 `Pending`，按 adapter result 映射 | `ControlIntent.kind`、expected basis、owner result ref 分离；不修改 RunIntent 为 Running | service | `EV-CAND-RUN-CTL-001` |
| `TC-RUN-CTL-002` | owner ACK/receipt only | C08 returns accepted receipt | `ControlIntentState::Accepted`，不为 `Confirmed` | ACK/transport receipt ≠ control outcome；owner projection unchanged | fake-integration | `EV-CAND-RUN-CTL-002` |
| `TC-RUN-CTL-003` | owner readback formally proves outcome | controlled Runtime/Sandbox safe read (planned) | future `Confirmed` shape only when authority seam ready；当前 positive remains blocked | no PID/port/log inference; exact source/freshness required | integration（blocked） | `EV-CAND-RUN-CTL-003` |
| `TC-RUN-CTL-004` | stale basis or concurrent control | C08 with wrong expected owner basis/version | `Conflict/StaleBasis`；no second effect | control key/basis exact；old intent preserved | service/UoW fake | `EV-CAND-RUN-CTL-004` |
| `TC-RUN-CTL-005` | control timeout/duplicate | timeout then retry same key | `Unknown` + RecoveryCase; duplicate reads stored result; no resend | `Confirmed != Cleaned`; cleanup only C09 | service/recovery | `EV-CAND-RUN-CTL-005` |

## 8. 用例矩阵（二）：owner、resource、recovery、presentation

### 8.1 `owner_projection_truth_attribution`（CUT-05）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-OWN-001` | owner safe snapshot 含 formal refs/source version/freshness | Q06/Q07 读取 | `OwnerRunProjection`/section 带 source attribution | owner subject/ref、freshness、visibility 原样映射；local state 不替代 | fake-integration（planned） | `EV-CAND-RUN-OWN-001` |
| `TC-RUN-OWN-002` | owner read unavailable/unsupported | Q06 | bounded `Unknown/Unavailable/Degraded` view；不从 PID/port/ACK补齐 | `OwnerExecutionPosture` 不猜；no write | service/query | `EV-CAND-RUN-OWN-002` |
| `TC-RUN-OWN-003` | local intent Accepted，owner projection缺失/旧 | Q06 | 两轴并列显示，Accepted 不升级 Running | `RunIntentState::Accepted` 与 projection freshness 独立 | service | `EV-CAND-RUN-OWN-003` |
| `TC-RUN-OWN-004` | owner terminal result read | Q06/J03 | safe ref/projection only；不把结果反写为 local success beyond contract | no truth repair; no owner write | service/job | `EV-CAND-RUN-OWN-004` |
| `TC-RUN-OWN-005` | owner source version/generation mismatch | controlled read | `Conflict/StaleBasis`，RecoveryCase if ambiguous | stale projection not treated current | fake-integration | `EV-CAND-RUN-OWN-005` |

### 8.2 `resource_cleanup_guard`（CUT-06）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-RES-001` | bounded `ResourceObservation` and requested resource set | Q07/C07 | observation shown separately from request/allocation | no allocation claim from local probe; source/freshness visible | contract/service | `EV-CAND-RUN-RES-001` |
| `TC-RUN-RES-002` | active lease/capture/handoff/retention protection | C09 | `ProtectionState::Protected` or `Blocked`; cleanup effect = 0 | guard basis all required axes; no cache release | domain/service | `EV-CAND-RUN-RES-002` |
| `TC-RUN-RES-003` | guard input missing/stale/conflict | C09 | `ProtectionState::Unknown/Blocked`; `SafetyBlocked` | no destructive action and no `Evicted` | domain/fake | `EV-CAND-RUN-RES-003` |
| `TC-RUN-RES-004` | guard `Releasable` and owner cleanup accepted | C09 controlled adapter | local cleanup receipt may be recorded; `OwnerCleanupPosture::Accepted`, not Confirmed/Cleaned | `Releasable != Released/Evicted`; local receipt bounded | service/controlled | `EV-CAND-RUN-RES-004` |
| `TC-RUN-RES-005` | cleanup ACK/timeout/unknown | C09 | `Unknown` + RecoveryCase; no retry/reclaim | `Confirmed != Cleaned`; protected material remains | service/recovery | `EV-CAND-RUN-RES-005` |
| `TC-RUN-RES-006` | eviction job sees candidate with unknown guard | J02 | candidate marker/report only; no `MaterialCacheState::Evicted` | `EvictionCandidatePosture` independent; delete/release call = 0 | job/fake | `EV-CAND-RUN-RES-006` |

### 8.3 `unknown_recovery_manual_review`（CUT-07）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-REC-001` | external effect may have dispatched | C07/C08/C09 timeout | create/freeze `RecoveryCase` with expected basis | `RecoveryState::Frozen`/`Querying` and safe issue ref; no replay | service | `EV-CAND-RUN-REC-001` |
| `TC-RUN-REC-002` | owner read unavailable | J03/Q08 | case remains `Frozen/ManualReview`; view degraded | no inferred success/rejection; no owner mutation | job/query | `EV-CAND-RUN-REC-002` |
| `TC-RUN-REC-003` | owner readback proves matching basis/outcome (future seam) | J03 controlled read | semantic `Reconciled` shape only when formal seam available; current positive marked blocked | exact subject/basis/version; no local truth shortcut | job integration（blocked） | `EV-CAND-RUN-REC-003` |
| `TC-RUN-REC-004` | explicit `OpenManualReview` on eligible case | C10 | `RecoveryState::ManualReview`; original intent/selection unchanged | no close/replay/resend; reason ref required | domain/service | `EV-CAND-RUN-REC-004` |
| `TC-RUN-REC-005` | already Closed/terminal/not visible case | C10/Q08 | invalid transition or body-free not-visible response | no existence leak; `InvalidStateTransition` where visible | domain/query | `EV-CAND-RUN-REC-005` |
| `TC-RUN-REC-006` | commit unknown or missing stored result | duplicate gate/J03 | `ConsistencyUnknown` + RecoveryCase; no rerun | result missing never reconstructed from current state | UoW/service | `EV-CAND-RUN-REC-006` |

### 8.4 `bounded_redacted_presentation`（CUT-08）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-PRE-001` | safe bounded diagnostic source and redaction succeeds | J04/Q09/Q10 | `OutputPreview`/`FailureDiagnosis` contains bounded redacted value/ref | `PreviewSafetyPosture`、source/freshness/visibility、truncated marker correct | contract/fake | `EV-CAND-RUN-PRE-001` |
| `TC-RUN-PRE-002` | raw secret/token/body/path/PID/port/URL/stack canary | diagnostic/trace/report outputs | redaction removes or blocks field; no raw fallback | forbidden-field scan = 0 findings | static-scan | `EV-CAND-RUN-PRE-002` |
| `TC-RUN-PRE-003` | one item fails redaction in multi-item handoff | C11 | all-or-nothing `HandoffState::Blocked`/value absent | no partial unsafe package; no handoff call | service/redaction fake | `EV-CAND-RUN-PRE-003` |
| `TC-RUN-PRE-004` | safe preview source stale/partial/not visible | Q09/Q10 | bounded unavailable/partial/degraded surface | no body/existence leak; certainty/next step explicit | query | `EV-CAND-RUN-PRE-004` |
| `TC-RUN-PRE-005` | handoff accepted/delivered receipt | C11/Q11 | local `Accepted/Delivered` posture only | receipt ≠ evidence/report/verdict/signoff | service | `EV-CAND-RUN-PRE-005` |
| `TC-RUN-PRE-006` | duplicate handoff or unknown delivery | C11 retry | exact stored receipt replay or `Unknown` + RecoveryCase; no resend | same key/digest; handoff state terminal rules | service/idempotency | `EV-CAND-RUN-PRE-006` |

## 9. 用例矩阵（三）：query、protocol、idempotency、UoW、entry

### 9.1 `query_read_surface_no_write`（CUT-09）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-QRY-001` | committed visible context/selection/material snapshot | Q01~Q05 | views return bounded data/page | reservation/save/UoW/refresh/reconcile/probe/dispatch calls = 0 | service write-audit | `EV-CAND-RUN-QRY-001` |
| `TC-RUN-QRY-002` | missing/not-visible object | Q01/Q03/Q08 | restricted/not-visible body-free response | no fallback lookup or existence leak | query/entry | `EV-CAND-RUN-QRY-002` |
| `TC-RUN-QRY-003` | stale/partial/degraded section | Q04/Q06/Q07/Q12 | per-section freshness/availability retained | Query does not clear stale or create projection identity | service | `EV-CAND-RUN-QRY-003` |
| `TC-RUN-QRY-004` | output/diagnosis/handoff views | Q09~Q11 | safe views only | no raw content, no evidence generation, no handoff dispatch | service/write-audit | `EV-CAND-RUN-QRY-004` |
| `TC-RUN-QRY-005` | Query called during reconnect or cache miss | Q01/Q07/Q12 | `ConnectivityState`/read availability changes only in view | no migration, refresh, reconcile, cleanup or job dispatch | service | `EV-CAND-RUN-QRY-005` |
| `TC-RUN-QRY-006` | all 12 Query repeated concurrently | Q01~Q12 | deterministic committed read surfaces | idempotency reservation count = 0; writes remain zero | service/entry | `EV-CAND-RUN-QRY-006` |

### 9.2 `protocol_secondary_type_closure`（CUT-10）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-CON-001` | construct every Command/Query/Consumer/Job public union | round-trip typed DTOs | finite variant and secondary types preserve refs/state/reason | `RunnerCommandRequest`/`RunnerQueryRequest` variant matches name/body | contract | `EV-CAND-RUN-CON-001` |
| `TC-RUN-CON-002` | missing actor/trace/idempotency/basis metadata | entry validation | `Rejected(MissingRequiredField)`; no UoW/reservation/port | metadata is trusted-boundary supplied, not body supplied | contract/entry | `EV-CAND-RUN-CON-002` |
| `TC-RUN-CON-003` | command name vs body variant mismatch | dispatch finite union | `Rejected(InvalidInput)`; zero dispatch | no route/body coercion | entry | `EV-CAND-RUN-CON-003` |
| `TC-RUN-CON-004` | unsupported error/enum/schema variant | decode/map result | `UnsupportedContract`/`UnsupportedVersion`; no default fallback | unknown variant cannot become success | contract | `EV-CAND-RUN-CON-004` |
| `TC-RUN-CON-005` | body-free view/result boundary | put raw body/path/secret into candidate fields | reject/redact; public result remains refs/markers | no private upstream DTO leakage | contract/static-scan | `EV-CAND-RUN-CON-005` |
| `TC-RUN-CON-006` | public nominal ref ↔ persistence ID conversion | convert valid and malformed refs | valid round-trip; malformed `RunnerContractError` | conversion does not grant visibility/scope | contract | `EV-CAND-RUN-CON-006` |

### 9.3 `command_ordering_and_duplicate`（CUT-11）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-IDM-001` | absent idempotency record, valid C01/C03/C07 | execute command | reserve → local tx → external (if allowed) → terminal result | no external effect before reservation; order trace exact | service/fake | `EV-CAND-RUN-IDM-001` |
| `TC-RUN-IDM-002` | Completed same key/digest with complete stored result | invoke same command | exact stored result, `DuplicateReplayed`; all domain/port/cache calls = 0 | no current-truth recomputation | service | `EV-CAND-RUN-IDM-002` |
| `TC-RUN-IDM-003` | Completed same key, different stable input | invoke command | `Conflict(IdempotencyConflict)`; original record unchanged | volatile trace/time changes do not create conflict; semantic diff does | contract/service | `EV-CAND-RUN-IDM-003` |
| `TC-RUN-IDM-004` | Reserved/InProgress record | concurrent second invocation | `InProgress/Unknown`; no takeover or second effect | reservation remains owned; RecoveryCase if ambiguous | repository/service | `EV-CAND-RUN-IDM-004` |
| `TC-RUN-IDM-005` | Completed marker, missing/wrong-kind result | duplicate invocation | `ConsistencyUnknown` + RecoveryCase | no result reconstruction or rerun | service/UoW fake | `EV-CAND-RUN-IDM-005` |
| `TC-RUN-IDM-006` | Query or Consumer negative path presented as Command | route mismatch | reject; Query does not reserve, Consumer does not parse | channel classification exact | entry/worker | `EV-CAND-RUN-IDM-006` |

### 9.4 `versioned_uow_commit_unknown`（CUT-12）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-UOW-001` | valid local write set | accepted local C01/C04/C10 | object transition, result, idempotency completion and required marker share terminal UoW | either all visible or all absent; no partial accepted trace | UoW fake | `EV-CAND-RUN-UOW-001` |
| `TC-RUN-UOW-002` | expected version stale | save mutable object | `VersionConflict`; current record preserved | no last-write-wins; no owner call | repository fake | `EV-CAND-RUN-UOW-002` |
| `TC-RUN-UOW-003` | append unique trace/history/result | duplicate transition key | one append only; duplicate reads stored result | append uniqueness and refs stable | repository fake | `EV-CAND-RUN-UOW-003` |
| `TC-RUN-UOW-004` | commit response lost after local terminal write | C07/C08/C09 terminal tx | `Unknown`/RecoveryCase; no resend/reclaim/replay | commit knowledge distinct from effect outcome | UoW/service | `EV-CAND-RUN-UOW-004` |
| `TC-RUN-UOW-005` | J05 existing projection identity and matching generation | replace section | guarded replacement succeeds only on exact version/generation | missing identity/generation mismatch = no-write | projection fake | `EV-CAND-RUN-UOW-005` |
| `TC-RUN-UOW-006` | Query invokes projection replacement path | Q12 with stale section | view remains stale/degraded; replace spy = 0 | Query cannot create/refresh projection | service/write-audit | `EV-CAND-RUN-UOW-006` |

### 9.5 `entry_actor_scope_dispatch`（CUT-13）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-ENT-001` | trusted command metadata and valid body | dispatch one Command | `Received→Validating→Dispatching→Completed` or typed rejected | exactly-one application dispatch; entry state not domain state | entry/service | `EV-CAND-RUN-ENT-001` |
| `TC-RUN-ENT-002` | actor scope differs from context/request scope | dispatch C01/C07 | `VisibilityDenied`/`Rejected`; no repository/port | scope is not body-overridable | entry | `EV-CAND-RUN-ENT-002` |
| `TC-RUN-ENT-003` | transport route/name/body mismatch | dispatch | `Rejected(InvalidInput)`; no operation reservation | route label cannot define operation | entry/contract | `EV-CAND-RUN-ENT-003` |
| `TC-RUN-ENT-004` | invalid metadata before dispatch | missing trace/idempotency/expected basis | entry rejected; all side-effect spies = 0 | no accepted trace/result | entry | `EV-CAND-RUN-ENT-004` |
| `TC-RUN-ENT-005` | handler returns Unknown/Blocked | complete entry | disposition preserved exactly; no conversion to Failed/Accepted | entry result is not owner truth | entry/service | `EV-CAND-RUN-ENT-005` |

## 10. 用例矩阵（四）：Consumer、Job、配置、观测、边界

### 10.1 `consumer_header_first_negative`（CUT-14）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-CNS-001` | missing source/schema/event/dedup header | E01~E04 worker entry | `Rejected`/`Blocked`；payload read/parse/hash/store/ACK = 0 | `RunnerConsumerItemDisposition` preserves header failure | worker/entry | `EV-CAND-RUN-CNS-001` |
| `TC-RUN-CNS-002` | unsupported schema version or source family | header-first check | `UnsupportedVersion`/`Blocked`; body untouched | no default payload contract | worker | `EV-CAND-RUN-CNS-002` |
| `TC-RUN-CNS-003` | complete trusted header, no stored receipt | current positive path | `Blocked/PositiveConsumerContractNotAuthorized`; no payload parse | positive apply remains blocked under `RUN-UP-*` | worker | `EV-CAND-RUN-CNS-003` |
| `TC-RUN-CNS-004` | complete header and exact stored receipt | redelivery | strict `Duplicate`; return stored receipt/result ref | compare header fields only; no payload digest | worker/repository | `EV-CAND-RUN-CNS-004` |
| `TC-RUN-CNS-005` | stored receipt incomplete or conflicting | redelivery | `Blocked/Unknown`; do not guess duplicate | missing receipt never synthesized | worker/repository | `EV-CAND-RUN-CNS-005` |
| `TC-RUN-CNS-006` | future payload contains lifecycle status/ACK | reserved positive vector | even if later enabled, ACK/accepted does not map `Running/Confirmed/evidence` | no owner cursor/truth mutation in current path | worker/contract | `EV-CAND-RUN-CNS-006` |

### 10.2 `job_claim_checkpoint_report`（CUT-15）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-JOB-001` | valid job metadata/input, absent key | J01~J05 entry | validate → reserve → claim → bounded stages → report/result | claim is local; report refs/counters bounded | job/service | `EV-CAND-RUN-JOB-001` |
| `TC-RUN-JOB-002` | same key/digest completed report | rerun job | `DuplicateReplayed` with exact stored report; no claim/scan/adapter | no redownload/reverify/refresh | job/idempotency | `EV-CAND-RUN-JOB-002` |
| `TC-RUN-JOB-003` | claim conflict or stale fence | two workers | `Conflict/Unknown`; no takeover/reclaim | old fence cannot save report/effect | job/repository | `EV-CAND-RUN-JOB-003` |
| `TC-RUN-JOB-004` | checkpoint unknown/stale basis | resume J01/J03/J05 | `Unknown`/`Blocked` + RecoveryCase; no auto resume | basis/sequence exact; checkpoint ≠ owner cursor | job | `EV-CAND-RUN-JOB-004` |
| `TC-RUN-JOB-005` | J01 transfer/integrity mixed outcomes | run bounded stages | report preserves `Completed/Partial/Blocked/Failed/Unknown` per variant | `Blocked` not compressed; Complete ≠ Qualified | job/fake | `EV-CAND-RUN-JOB-005` |
| `TC-RUN-JOB-006` | J02 candidate and guard unknown | eviction evaluation | candidate/report only; no delete/evict | J02 never invokes destructive release | job/fake | `EV-CAND-RUN-JOB-006` |
| `TC-RUN-JOB-007` | J03 owner read unavailable/ambiguous | reconcile | recovery/report only; no owner mutation/close | Unknown paired with RecoveryCase | job/fake | `EV-CAND-RUN-JOB-007` |
| `TC-RUN-JOB-008` | J04/J05 redaction or generation failure | refresh diagnosis/sources | safe report `Blocked/Partial/Conflict`; no raw output/upsert missing identity | Query remains no-write; J05 generation guard | job/static | `EV-CAND-RUN-JOB-008` |

### 10.3 `config_builder_readiness_layers`（CUT-16）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-CFG-001` | `test-deterministic` strict JSON with all required logical slots | load/build | immutable validated snapshot; builder can expose semantic facade | profile/source/config identity present; no raw map | config/unit | `EV-CAND-RUN-CFG-001` |
| `TC-RUN-CFG-002` | unknown/duplicate/malformed key or invalid finite bound | parse/validate | fail-fast `InvalidInput`/config issue; no partial activation | no fallback to old/default value | config/unit | `EV-CAND-RUN-CFG-002` |
| `TC-RUN-CFG-003` | missing core local store/UoW/corruption guarantee | build | `RunnerRuntimeBuildState::Failed`/not Ready; facade absent | no in-memory fallback or half facade | builder/fake | `EV-CAND-RUN-CFG-003` |
| `TC-RUN-CFG-004` | slot configured but adapter disabled/unavailable/not ready | build readiness | per-slot `Blocked/Unavailable/Degraded`; no `Enabled/Ready` fabrication | configured ≠ enabled ≠ ready | builder/integration | `EV-CAND-RUN-CFG-004` |
| `TC-RUN-CFG-005` | reload/new config snapshot | attempt hot reload or in-place repair | unsupported/rejected; new builder/marker required | existing basis/truth unchanged | config/service | `EV-CAND-RUN-CFG-005` |
| `TC-RUN-CFG-006` | product/integration profile without upstream authority | build | profile remains `integration-pending/product-pending`; no product readiness | profile label cannot close `RUN-UP-*` | config/gate | `EV-CAND-RUN-CFG-006` |

### 10.4 `observability_forbidden_field_boundary`（CUT-17）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-OBS-001` | command/query/consumer/job invocation | collect safe log/trace fields | safe kind/ref/outcome/duration/diagnostic ref present | no raw body/secret/path/URL/PID/port/stack | static-scan/contract | `EV-CAND-RUN-OBS-001` |
| `TC-RUN-OBS-002` | free-text actor/subject/request/result/trace IDs as metric labels | emit metrics | label validation rejects/strips high-cardinality fields | only finite low-cardinality labels | static-scan | `EV-CAND-RUN-OBS-002` |
| `TC-RUN-OBS-003` | accepted vs rejected/blocked/duplicate/failed command | emit trace/history/metric | accepted local transition only gets accepted trace/history; others operational marker | no rejected-as-accepted audit | contract/fake | `EV-CAND-RUN-OBS-003` |
| `TC-RUN-OBS-004` | Unknown external effect | emit issue/trace | correlation includes RecoveryCase/issue ref, no success/evidence | Unknown not downgraded | service/static | `EV-CAND-RUN-OBS-004` |
| `TC-RUN-OBS-005` | handoff/diagnostic output | inspect stored marker/report/receipt | only safe refs/markers; no L4/L6 body | handoff receipt ≠ formal evidence | static-scan | `EV-CAND-RUN-OBS-005` |
| `TC-RUN-OBS-006` | redaction/telemetry sink unavailable | invoke diagnostic flow | bounded degraded/blocked posture; business result unaffected | telemetry non-interference; no raw fallback | fake-integration | `EV-CAND-RUN-OBS-006` |

### 10.5 `cross_axis_non_escalation_and_event_zero`（CUT-18）

| 用例 ID | 场景与前置 | 输入/操作 | 预期结果 | 正式断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-RUN-BND-001` | compose all lifecycle axes with accepted/complete/delivered values | run cross-axis mapper | no shortcut states generated | Accepted≠Running；Complete≠Verified≠Qualified；Confirmed≠Cleaned；Delivered≠evidence | contract/property | `EV-CAND-RUN-BND-001` |
| `TC-RUN-BND-002` | local selection/material/run mutation attempts owner writes | inspect adapter/store call graph | calls rejected or zero; only semantic adapters allowed | no Release/Governance/Sandbox/Runtime/Observability truth write | static/call-audit | `EV-CAND-RUN-BND-002` |
| `TC-RUN-BND-003` | all 11 Command, 12 Query, 4 Consumer, 5 Job fake call logs | scan publisher/outbox/topic/event emit | count = 0 | no Runner outbound event residue; local trace ≠ event | static/call-audit | `EV-CAND-RUN-BND-003` |
| `TC-RUN-BND-004` | Query/render/reconnect triggers | observe side effects | no refresh/reconcile/cleanup/dispatch | Query no-write and Job explicit trigger boundary | service/write-audit | `EV-CAND-RUN-BND-004` |
| `TC-RUN-BND-005` | `Blocked`/`Unknown`/`Duplicate` mapper | map to protocol/job surface | variants preserved exactly | Blocked not Partial/Failed; Unknown has recovery; Duplicate replays stored surface | contract | `EV-CAND-RUN-BND-005` |
| `TC-RUN-BND-006` | forbidden implementation dependency scan | inspect manifests/import/call graph when repo exists | planned gate fails on private Sandbox/SDK bypass or product tech leakage | SDK/API/public adapter only; no Docker/Tauri/gVisor/Firecracker assumption | static-scan（blocked） | `EV-CAND-RUN-BND-006` |

## 11. 单测试切口用例停审

| CUT | 设计来源与分母 | 正向/blocked-positive | 负向/边界/并发/恢复 | 正式断言完整性 | 数据/自动化/EV 候选 | 结论 |
|---|---|---|---|---|---|---|
| 01 context | C01/C02、SelectionState | semantic Current | selector、authority、generation race | refs/generation/state/error | D-CTX；contract/service；EV-CTX | 通过 |
| 02 material | C03~C06/J01 | source path blocked | transfer/integrity/terminal/race | acquisition/integrity/cache axes | D-MAT；service/fake；EV-MAT | 通过 |
| 03 run | C07 | Sandbox positive blocked | qualification/resource/timeout/duplicate | RunIntent/RecoveryCase | D-RUN；service/controlled；EV-REQ | 通过 |
| 04 control | C08/C09 | owner outcome blocked | ACK/basis/unknown/cleanup separation | ControlIntent/OwnerCleanupPosture | D-CTL；service；EV-CTL | 通过 |
| 05 owner | Q06/J03 | read positive blocked | unavailable/stale/attribution | owner projection/freshness | D-OWNER；fake/query；EV-OWN | 通过 |
| 06 resource | C09/J02/Q07 | physical positive blocked | guard/protection/candidate | ProtectionState/resource posture | D-RES；fake/job；EV-RES | 通过 |
| 07 recovery | C10/J03/Q08 | formal readback blocked | unknown/manual review/consistency | RecoveryState/case/ref | D-REC；service/job；EV-REC | 通过 |
| 08 presentation | J04/C11/Q09/Q10/Q11 | safe semantic path planned | redaction/visibility/handoff | safety/certainty/handoff | D-PRE；redaction fake；EV-PRE | 通过 |
| 09 query | Q01~Q12 | local read planned | no-write/degraded/reconnect | zero-write + view fields | D-QRY；write-audit；EV-QRY | 通过 |
| 10 protocol | all public unions | semantic planned | missing/mismatch/unsupported | finite DTO/disposition | D-CON；contract；EV-CON | 通过 |
| 11 idempotency | all Command | local stored-result shape | duplicate/conflict/in-flight/missing | key/digest/call count | D-IDM；service/repo；EV-IDM | 通过 |
| 12 UoW | C/J/J05 | semantic fake | version/append/commit unknown | atomic write set/generation | D-UOW；UoW fake；EV-UOW | 通过 |
| 13 entry | command/query entry | semantic planned | actor/scope/route/dispatch | entry state/disposition | D-ENT；entry；EV-ENT | 通过 |
| 14 consumer | E01~E04 | blocked-first only | header/body/duplicate | no parse/hash/store/ACK | D-CNS；worker；EV-CNS | 通过（positive blocked） |
| 15 job | J01~J05 | external positive blocked | claim/checkpoint/report | job disposition/report | D-JOB；job fake；EV-JOB | 通过 |
| 16 config | 04 §6/§9/§12 | deterministic profile planned | strict/failure/reload/readiness | build/slot markers | D-CFG；builder；EV-CFG | 通过 |
| 17 observability | 03 §14/04 §8 | semantic output planned | forbidden fields/cardinality | safe fields/audit split | D-OBS；scan；EV-OBS | 通过 |
| 18 boundary | Step16 cross-axis | semantic planned | shortcut/event/dependency | state/event zero | D-BND；call audit；EV-BND | 通过 |

## 12. 跨用例断言、phase 与证据审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| P0 每个切口有正向或 blocked-positive 主线 | 通过 | 18/18；跨仓正向明确 blocked，不删除设计形状。 |
| 每个切口有关键负向/边界 | 通过 | 缺字段、非法 selector/state、scope/generation/version、dependency、redaction、no-write 均覆盖。 |
| 并发/恢复/一致性覆盖 | 通过 | C02/C07/C08/C09、duplicate、UoW、claim/checkpoint、projection race 均单列。 |
| 状态与错误命名来自详细设计 | 通过 | 使用正式 enum/typed error；不使用旧 `RunnerRun` 等历史对象。 |
| Query no-write | 通过 | 12 Query 和 cross-axis 皆有 call-log/write-spy 断言。 |
| Consumer header-first/no-parse | 通过 | 四 Consumer 均先 header/readiness，当前 positive apply blocked。 |
| Job `Blocked`/`Unknown` 保真 | 通过 | 不压成 Partial/Failed；Unknown 关联 RecoveryCase。 |
| phase 越界 | 无 unresolved | 不断言 Running/Cleaned/evidence/report/verdict/signoff 或 production SLO。 |
| fake 与真实 evidence 混淆 | 无 unresolved | EV 仅 `EV-CAND-*`；真实 artifact/report/run_id 留 Step 9/13。 |
| 候选证据 ID 冲突 | 无 | CUT/序号分区唯一；Step 13 再正式化。 |
| 只测 happy path | 无 | 每个 CUT 至少主线 + negative/boundary；高风险再加 race/recovery。 |

## 13. 结构化回填草稿

正式 §6 应收录：

- 18 个切口批次表和场景总表；
- 11 Command、12 Query、4 Consumer、5 Job 的逐入口主线/拒绝/重复/冲突/未知边界摘要；
- `SelectionState`、`AcquisitionState`、`IntegrityState`、`MaterialCacheState`、`ProtectionState`、`RunIntentState`、`ControlIntentState`、`RecoveryState`、`HandoffState`、`ConnectivityState` 及 entry/worker/job/infra 技术状态的非法迁移与冻结断言；
- UoW、expected version、generation、idempotency、commit-unknown、claim/checkpoint、redaction 和 event-zero 组合断言；
- 明确 `TC-*`/`EV-CAND-*` 是计划标识，不是执行结果。

正文不得复制本文件的历史诊断、讨论取舍或“通过”措辞；只写收口后的计划和 blocker 边界。

## 14. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓、语言和 test runner（`RUN-DDD-001/002`） | 无法给出真实命令、fixture 路径或 CI job | 仅保留逻辑 suite/case contract。 |
| durable store/cache 方案（`RUN-DDD-003`） | 无法证明 crash/restart parity | UoW/repository fake 只验证语义顺序，标 blocked。 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/SDK seam（`RUN-UP-001~008`） | 正向跨仓测试和 Consumer apply blocked | 使用 blocked/unknown/unsupported 负向路径。 |
| telemetry/SLO 与真实 integration/GRC（`RUN-OPS-001~002`） | 不设生产阈值、不产 release evidence | Step 10/13 继续保持 planned/blocked。 |
| 06 尚未重建（`RUN-DOC-002`） | EV 不能形成验收 verdict | 仅候选族，06 后续消费。 |

## 15. Step 6 进入下一步门禁

- [x] 18 个 P0 切口均有明确用例批次。
- [x] 每个批次至少有正向/blocked-positive、负向/边界和正式断言。
- [x] 并发、恢复、一致性、no-write、no-parse、redaction 和 event-zero 均有用例。
- [x] 每个用例有数据前置候选、自动化候选和 EV 候选族。
- [x] 逐切口停审完成，跨用例/phase/证据审计无 unresolved 冲突。
- [ ] 测试执行、artifact、report、evidence、verdict、signoff、readiness：未执行且不作为本 Step 条件。

Step 6 完成，允许进入 Step 7；正式 `05-测试方案.md` 仍不可写。
