# Step 11. 持久化、事务与一致性契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
> 回填章节: `03-详细设计.md` §10 数据持久化、事务与一致性契约
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 7 repository / UoW / projection / relay / idempotency 契约、Step 9 函数级事务顺序和 Step 10 状态矩阵基础上,定义 L4-sandbox 的 logical persistence shape、transaction boundary、version / cursor 来源、projection / relay / stored result 一致性和 fake / durable parity。本步不写物理 DDL、migration、数据库产品、topic、配置 key、真实测试结果、run_id、evidence alias、验收签署、实施 commit boundary 或正式 `03-详细设计.md`。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 11 | 是。Step 10 审查点后用户已回复“同意”,允许进入 Step 11。 |
| 项目级台账是否允许进入 Step 11 | 是。`project_execution_ledger.md` 原恢复点为 Step 10 `pass_wait_review`,用户确认后可进入 Step 11。 |
| 文档级 flow 是否允许进入 Step 11 | 是。`03_ddd_calibration_flow.md` 原记录 Step 11 `blocked_by_step_10_review`,用户确认后门禁满足。 |
| 是否已读取 Step 10 状态矩阵 | 是。Step 10 已闭口 8 个状态族、29 个状态机批次、非法转换和 Step 11 持久化 / 索引 handoff。 |
| 是否已读取 Step 7 port 契约 | 是。Step 7 已闭口 `SandboxUnitOfWork`、truth / audit / reference / snapshot / maintenance / projection / derived / relay / idempotency / stored result repository 和 fake parity。 |
| 是否已读取 Step 9 flow | 是。Step 9 已闭口 command、query、consumer、relay、job 的 UoW 顺序、query no-write、relay no-rollback、handoff no-rollback 和 stored replay。 |
| 是否已读取详细设计 SOP Step 11 | 是。本步必须输出数据所有权实现表、表 / collection / projection 契约表、repository 函数表、事务边界表和一致性策略表。 |
| 是否已读取详细设计书写规范 §5.10 | 是。本步不强制 DDL,但必须写清 repository 函数、事务边界和 outbox / projection 的事务关系或补偿关系。 |
| 是否已读取真相源闭环标准相关条目 | 是。重点检查 callable surface、repository read/write parity、UoW ordering、stored result save/get、cursor source、projection rebuild、rollback visibility 和 fake / durable parity。 |
| 是否发现阻塞 Step 11 的上游 blocker | 未发现阻塞本步生成的上游 blocker。Step 9 / Step 10 已登记的 direct selector / index 缺口在本步以 logical index 与 current callable boundary 双重口径收口。 |

---

## 2. 本步目标

本步把已收稳的对象、port、flow 和状态矩阵转译成实现者可以直接落 repository fake / durable adapter 的持久化与一致性契约。核心不是选择数据库,而是固定每类数据保存在哪里、由谁写、谁读、用什么 key、用什么 version、在哪个 UoW 内可见、rollback 后哪些内容不可见、哪些外围传播只能最终一致恢复。

本步必须闭口:

- sandbox-owned truth、external refs、body-free snapshot、projection、derived report、relay、audit trace、idempotency 和 stored result 的数据分层。
- `SandboxRepositoryVersion`、`Versioned<T>`、`expected_version`、`SandboxTruthCursor` 和 `SandboxRepositoryCursor` 的来源边界。
- command / consumer / job mutation 的 begin、save、append、mark stale、stored result、idempotency complete、cursor assign、commit / rollback 顺序。
- query no-write 的读取面和 missing / degraded / validation 口径。
- relay append in source transaction 与 publish in relay transaction 的分离。
- projection stale marking、projection rebuild、derived maintenance、latest reconciliation report 的一致性。
- fake adapter 与 durable adapter 在 UoW staging、rollback、version conflict、unique key、cursor、stored replay 和 page ordering 上的等价行为。

本步不处理:

- Step 12 的完整 error taxonomy、public error code、retry / recovery matrix 和 quarantine 细节。
- Step 13 的 digest canonicalization、幂等窗口、并发 retry/backoff 和 lock 粒度。
- Step 14 的 config key、默认值、adapter wiring、lease/retry/retention 数字。
- Step 16 的测试用例全集或真实测试结果。
- 物理数据库、迁移脚本、SQL index 名称、topic、transport route、部署拓扑或实施 boundary。

---

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 当前需求基线 | 固定 execution isolation truth ownership、外部正文禁止入仓、capture / handoff 分层、cleanup guard、redline、幂等 / 一致性和验收红线。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前架构基线 | 固定独立 truth center、核心强一致 + 外围最终一致、sync / async / background 分离、只读派生和配置不可越界。 |
| `projects/L4-sandbox/02-概要设计.md` | 当前概要基线 | 提供关键对象、接口骨架、处理流、状态机轮廓和 detailed design handoff。 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 truth object、状态 enum、audit / relay / projection / stored result carrier、factory 和 transition helper。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository / port / adapter callable surface、`Versioned<T>`、UoW、cursor、page、fake parity。 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 Command / Query / Consumer / Outbound Event / Job DTO、receipt、report、stored replay 和 public view surface。 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供每条 flow 的 transaction order、query no-write、consumer receipt、relay no-rollback、job report replay。 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供状态 carrier、允许 / 禁止迁移、状态副作用、direct selector / index handoff 和 Step 12~13 handoff。 |
| L1 governance / artifact Step 11 | 已参考 | 仅参考 logical store、repository 语义、事务表和一致性审计粒度,不继承业务对象。 |

---

## 4. 分批写入计划

| 批次 | 内容 | 状态 | 门禁 |
|---|---|---|---|
| 11.1 | 文件骨架、开工确认、SOP 问题回答、诊断和设计取舍 | done | 不修改正式 `03`,不新增 Step 12。 |
| 11.2 | 数据所有权实现表与 logical store / index 契约表 | done | owned truth、snapshot、projection、relay、stored result 分层清楚。 |
| 11.3 | Repository 函数持久化语义、version / cursor / rollback 规则 | done | 不新增 Step 7 未开放的 callable surface;缺 finder 明确 current boundary。 |
| 11.4 | 事务边界表、一致性策略表、projection / relay / stored result 恢复 | done | query no-write、job no core repair、relay / handoff no rollback 闭合。 |
| 11.5 | 回填草稿、自检、待确认事项、进入 Step 12 条件 | done | 停在用户审查点。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些数据对象由本仓拥有 | `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`BoundaryRequirementSet`、`BoundaryEstablishmentDecision`、`CoherentBoundary`、`IsolationEnvironmentHandle`、`PolicyExecutionDecision`、`HighRiskActionDecision`、`ControlledExecutionRun`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`ControlFact`、`LeaseRecord`、`OrphanRecoveryRecord`、`CleanupGuard`、`RedlineContainment`、`SandboxAuditTrace`、`SandboxReadProjection`、`DerivedInspectPreviewTrendState`、`SandboxReconciliationReport`、`SandboxEventRelayRecord`、`SandboxIdempotencyRecord`、`SandboxStoredOperationResult` 和 body-free maintenance records 由本仓逻辑拥有。 |
| 哪些只是引用、快照或投影 | actor / member / work / runner / tool / runtime / policy / backend / artifact / observability / investigation 正文不归本仓。它们只能以 typed ref、safe summary、body-free snapshot、source version marker、reference state、handoff ref、projection 或 derived report 进入。`PolicyApplicabilitySnapshot`、`BackendCapabilitySummary`、reference snapshots 和 status snapshot 是判断输入 / 本地快照,不是外部 truth。 |
| repository 函数如何命名,参数和返回是什么 | 函数签名以 Step 7 为准。本步只补持久化语义:`get_*_with_version(...) -> Option<Versioned<T>>` 提供 expected version;`save_*(&uow, object, expected_version)` 创建 / 更新 owned truth;append-only trace / relay append / stored result save 必须带 UoW;query read 使用 snapshot / projection / derived / audit read 函数且不得 begin write UoW。 |
| 哪些处理流需要事务,事务内必须完成哪些写入 | Command accepted / rejected replayable path、accepted consumer / reference marker path、relay publish status update、projection rebuild item、derived maintenance item、reconciliation report save、cleanup / redline / reaper marker update、job report stored replay 都需要 UoW。Query 不开写事务。 |
| 是否需要乐观锁、行锁、版本号、outbox 或 projection | 需要 `SandboxRepositoryVersion` + `expected_version` 的 optimistic update。当前不强制物理行锁或数据库隔离级别,但 durable / fake adapter 必须等价防 lost update。Relay record 等价 outbox;projection / derived 是 read-side materialization,不是真相源。 |
| 如果事件发布或 projection 更新失败,如何恢复 | Relay publish 失败只更新 relay record / job report,不回滚 source truth。Projection rebuild 失败写 projection degraded / unavailable 或 job item failed,query 返回 stale / degraded / missing projection。Reference refresh 失败写 reference unavailable / stale 和 job report,不反写 core truth。Handoff 失败写 `HandoffFact` retryable / failed 或 handoff job report,不回滚 capture truth。 |

---

## 6. 当前文档问题诊断

| 来源 | 已发现问题 | 本 Step 收口方式 |
|---|---|---|
| Step 7 port 契约 | callable surface 已有,但未映射 logical store、主键、索引、version、rollback 可见性和 fake staging;Step 6回查还发现policy需要按typed ref读取immutable boundary requirement。 | §8.2~§8.6 定义logical store、repository语义、version/cursor和parity,并补`get_boundary_requirement(...)`读取面。 |
| Step 9 flow | flow 已有事务顺序,但物理 transaction、cursor 分配和 rollback 隐藏范围未定义。 | §8.5~§8.6 固定 begin/save/append/stored result/cursor/commit 顺序和 rollback 不可见范围。 |
| Step 10 状态矩阵 | 状态 carrier 已定义,但 lease expiry、projection stale、relay pending、stored result unavailable 等需要存储形态与 version 来源。 | §8.1~§8.4 将状态主语映射到 store 和 repository 版本规则。 |
| Query direct selector 缺口 | `projection-by-context`、direct handoff/failure/cleanup/redline selector、latest reconciliation by scope 若无 index 容易诱导实现扫描 storage。 | §8.7 定义 logical index 和 current callable boundary:没有 Step 7 finder 的分支仍返回 validation / missing / degraded,不得扫描或拼 ref。 |
| Relay / handoff no-rollback | publish 或 handoff failure 容易被错误实现为回滚 source truth。 | §8.5 / §8.8 明确 append 与 publish 分离、handoff 与 capture 分层。 |
| Stored replay | duplicate path 若缺 stored result 会诱导重新执行 mutation 或从 current truth 重算。 | §8.4 / §8.8 固定 save/get 对称和 duplicate missing result handoff 到 Step 12。 |

---

## 7. 设计取舍

| 议题 | 可选方案 | 结论 |
|---|---|---|
| 是否写具体 DDL | A. 直接写 SQL DDL;B. 写 logical store 契约 | 采用 B。当前未锁数据库产品,但 fake / durable adapter 必须保持等价 key、index、version、append-only 和 transaction 语义。 |
| 并发控制 | A. adapter 自行决定;B. `Versioned<T>` + `SandboxRepositoryVersion` + `expected_version` | 采用 B。所有更新 existing truth / marker / projection / relay 的路径必须有正式 version 来源。 |
| cursor 来源 | A. 用 page cursor / version / timestamp;B. UoW 在 staged writes 后分配 truth / reference marker cursor | 采用 B。cursor 是 commit boundary marker,不得来自 page/version/time/id/digest。 |
| relay payload | A. publish 时重读 current truth;B. source transaction 内保存 pending relay + payload/ref snapshot | 采用 B。publisher 只处理已提交 relay record,防止 current truth 污染已提交事件。 |
| projection index | A. query 临时拼 projection ref;B. 通过 logical index 或明确 unsupported | 采用 B。index 必须由写路径 / rebuild 维护;当前 Step 7 未开放 finder 的分支不得临时扫描。 |
| duplicate replay | A. duplicate 重跑 service;B. typed stored result replay | 采用 B。duplicate 只读 `SandboxStoredOperationResult`;missing result 交 Step 12 错误恢复。 |
| fake repository | A. 为测试简化自动提交 / 忽略 version;B. 模拟 UoW staging、rollback、version conflict、unique key | 采用 B。fake 是 contract test 目标,不能绕过 durable 语义。 |

---

## 8. 结构化中间产物

### 8.1 数据所有权实现表

| 数据对象 | 拥有模块 / repository | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `ControlledExecutionContext` | `domain` / `SandboxTruthRepository` | `OpenControlledExecutionContextFlow`;cleanup close path | command service、query snapshot、projection rebuild、audit / reconciliation | mutable truth;create uses `expected_version=None`;update requires `get_context_with_version`;accepted/rejected/unresolved 与 audit / relay / stored result 同 UoW。 |
| `ExecutionEnvironmentIdentity` | `domain` / `SandboxTruthRepository` | intake accepted path;cleanup close path | boundary / policy / run service、query snapshot、audit | mutable truth;must share context linkage;identity close 与 context close / audit 同一 transaction when same flow。 |
| `ReferenceResolutionState` | `domain` / `SandboxReferenceStateRepository` | inbound reference consumers;reference refresh job | command guards、query degraded mapper、projection stale selector | local snapshot state;does not own external truth;save requires versioned read/list except first sighting;reference marker cursor only from UoW。 |
| `BoundaryRequirementSet` | `domain` / `SandboxTruthRepository.save_boundary_group` | `EstablishExecutionBoundaryFlow` | policy evaluation、boundary decision、query snapshot、audit | immutable owned requirement fact;must persist `context_ref`,`environment_identity_ref`,`boundary_profile_ref`,`limit_template_ref`,`runtime_generation_ref` plus explicit resource / filesystem / network / process / workspace requirements;policy reads it by exact typed ref,never reconstructs from current config or request。 |
| `BoundaryEstablishmentDecision` | `domain` / `SandboxTruthRepository.save_boundary_group` | boundary flow after backend capability / adapter outcome | run precheck、query snapshot、audit / relay | mutable decision truth;status update cannot use backend raw error;group save atomically includes `CoherentBoundary`,optional handle and optional lease。 |
| `CoherentBoundary` | `domain` / `SandboxTruthRepository` | boundary flow;cleanup release path | run launch、cleanup guard、query / projection | mutable truth;update uses expected boundary version;resource/fs/network/process boundary stored as body-free limits,not backend product config。 |
| `BackendCapabilitySummary` | `domain snapshot` / reference or capability adapter snapshot | boundary flow;capability refresh job | boundary guard、derived comparison、query degraded surface | body-free snapshot;not backend truth;stale / unsupported / unavailable does not mutate existing coherent boundary without formal flow。 |
| `IsolationEnvironmentHandle` | `domain` / boundary group at creation,then `SandboxTruthRepository.save_safety_group` | boundary establish;cleanup / reaper lifecycle update | run/capture/control/cleanup/reaper | creation is atomic with requirement / decision / boundary / lease;partial failed handle is persisted with failed boundary for cleanup;later lifecycle updates require versioned safety-group load。 |
| `LeaseRecord` | `domain` / boundary group at creation,then `SandboxTruthRepository.save_safety_group` | boundary establish;lease refresh;reaper job | cleanup / orphan selection、query snapshot | established handle must receive bounded lease in same boundary UoW;expiry may be derived from persisted window + now for selection,but state transition saves formal lease/orphan marker。 |
| `OrphanRecoveryRecord` | `domain` / `SandboxTruthRepository.save_safety_group` | reaper / backend inspection job | cleanup / query / audit | owned recovery fact;does not own backend host lifecycle;per-item UoW;failure becomes report item,not core success。 |
| `PolicyApplicabilitySnapshot` | `domain snapshot` / `SandboxTruthRepository.save_policy_group` | `EvaluatePolicyExecutionFlow`;policy consumer marker | policy decision guard、query snapshot、reconciliation | body-free policy summary snapshot;external policy truth not stored;missing / stale / conflicted requires fail-closed decision。 |
| `PolicyExecutionDecision` | `domain` / `SandboxTruthRepository.save_policy_group` | policy evaluation command | run launch precheck、query、audit / relay | mutable truth;accepted / blocked / fail-closed saved with snapshot and optional high-risk decision in one UoW。 |
| `HighRiskActionDecision` | `domain` / `SandboxTruthRepository.save_policy_group` | policy / redline flow | policy decision、redline containment、audit | owned decision fact;does not create approval truth;blocked action cannot be bypassed by adapter availability。 |
| `ControlledExecutionRun` | `domain` / `SandboxTruthRepository.save_run` | `StartControlledExecutionRunFlow`;control / failure flow | capture、failure、query / projection | mutable truth;launch outcome mapped before save;backend failure saves failed run,not host raw response。 |
| `CaptureFact` | `domain` / `SandboxTruthRepository.save_capture_handoff_group` | `RecordCaptureResultFlow` | handoff、cleanup guard、query、reconciliation | owned capture truth;candidate material refs only;stdout/stderr/body not persisted as external formal artifact truth。 |
| `HandoffFact` | `domain` / `SandboxTruthRepository.save_capture_handoff_group` | `OpenMaterialHandoffFlow`;handoff status consumer;retry job | cleanup guard、query、relay / audit | owned handoff truth;failure/retryable does not rollback capture;target ack body not stored。 |
| `FailureClassification` | `domain` / `SandboxTruthRepository.save_safety_group` | `ClassifySandboxFailureFlow`;backend lifecycle signal | control / cleanup / query / audit | owned failure fact;unknown remains pending/unknown,never success;classification update requires versioned safety group input。 |
| `ControlFact` | `domain` / `SandboxTruthRepository.save_safety_group` | `SubmitSandboxControlFlow`;control consumer | run/failure/cleanup/query | owned control fact;duplicate control uses stored result;conflict does not create runtime recover truth。 |
| `CleanupGuard` | `domain` / `SandboxTruthRepository.save_safety_group` | `EvaluateCleanupReadinessFlow`;handoff / investigation consumer | cleanup / reaper / query | owned guard truth;release requires `Allowed`;blocked/pending cannot be bypassed by job or query。 |
| `RedlineContainment` | `domain` / `SandboxTruthRepository.save_safety_group` | `RecordRedlineContainmentFlow`;investigation handoff consumer | cleanup guard、query、audit / investigation handoff | owned security containment truth;not advisory-only;release / close requires formal guard and investigation marker。 |
| `SandboxAuditTrace` | `domain` / `SandboxAuditTraceRepository` | accepted command / safety marker / selected consumer marker | audit query、reconciliation、handoff material | append-only;same UoW as source truth / marker;subject key comes from formal mapper,not string concatenation。 |
| `SandboxReadProjection` | `domain/read` / `SandboxProjectionRepository` | command / consumer stale marker;projection rebuild job | query service | derived read model;fresh/stale/degraded/unavailable never becomes truth;save_projection uses expected version when replacing。 |
| `DerivedInspectPreviewTrendState` | `domain/read` / `SandboxDerivedRepository` | derived maintenance job;accepted source marker | query / jobs / capacity comparison | derived maintenance state;failed/unavailable does not rewrite core truth;source refs body-free。 |
| `SandboxReconciliationReport` | `contracts/report` / `SandboxDerivedRepository` | reconciliation job | query / operations | report only;does not repair core truth;latest-by-scope requires logical index,not scan。 |
| `SandboxEventRelayRecord` | `domain/relay` / `SandboxEventRelayRepository` | accepted source transaction;publish job;relay feedback consumer | relay worker、query/report | outbox-like mutable publication marker;append in source UoW;publish status update in separate relay UoW;source truth unchanged on failure。 |
| `SandboxIdempotencyRecord` | `application` / `SandboxIdempotencyRepository` | command / consumer / job templates | duplicate path | unique by operation/channel/key;reserve inside UoW;complete links stored result;conflict never re-executes mutation。 |
| `SandboxStoredOperationResult` | `application` / `SandboxStoredResultRepository` | accepted / replayable rejected command;consumer receipt;job report | duplicate replay | immutable replay surface;duplicate missing result is Step 12 error,not recompute from current truth。 |
| `AdapterAvailabilityState` / `SandboxRuntimeConfigSummary` | `infra` runtime-local store | runtime builder / health check | entry / application availability checks | technical state only;does not override business allow,policy fail-closed,cleanup guard or redline containment。 |

### 8.2 Logical store / collection / projection 契约表

本表是 logical persistence contract,不是物理 DDL。durable adapter 可以合并或拆分物理表,但必须保持本表的主键 / 唯一键、查询索引、version、append-only、transaction 和 fake parity 语义。

| 存储对象 | 用途 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| `sandbox_contexts` | `ControlledExecutionContext` truth | PK `context_ref`;unique active `(caller_request_ref, operation_context_ref)` when idempotency policy requires | `intake_status`,`source_ref`,`actor_ref`,`work_ref`,`identity_ref` | `sandbox_repository_version` |
| `sandbox_environment_identities` | `ExecutionEnvironmentIdentity` truth | PK `identity_ref`;unique active `(context_ref)` | `context_ref`,`identity_status`,`responsibility_anchor_ref` | `sandbox_repository_version` |
| `sandbox_reference_states` | `ReferenceResolutionState` and body-free resolution markers | PK `reference_state_ref`;unique `(external_ref, reference_kind, source_scope_ref)` | `resolution_status`,`refresh_scope`,`source_version_marker`,`checked_at` | `sandbox_repository_version` |
| `sandbox_reference_snapshots` | body-free actor/work/policy/backend/handoff safe summary snapshots | PK `snapshot_ref`;unique current `(reference_state_ref, snapshot_kind)` | `external_ref`,`snapshot_kind`,`source_version_marker` | immutable by ref or `sandbox_repository_version` for current marker |
| `sandbox_boundary_groups` | `BoundaryRequirementSet` + `BoundaryEstablishmentDecision` + `CoherentBoundary` + optional handle / lease group root | PK `boundary_ref`;unique active `(context_ref, boundary_kind)` | `context_ref`,`environment_identity_ref`,`decision_status`,`boundary_status`,`backend_profile_ref`,`runtime_generation_ref` | `sandbox_repository_version` |
| `sandbox_boundary_requirements` | immutable requirement set sidecar | PK `requirement_ref`;unique `(boundary_ref)` | `context_ref`,`environment_identity_ref`,`boundary_profile_ref`,`limit_template_ref`,`runtime_generation_ref`,`required_resource_class`,`required_network_profile_ref` | immutable by ref;owned by boundary group create transaction |
| `sandbox_boundary_decisions` | boundary decision sidecar | PK `boundary_decision_ref`;unique `(boundary_ref)` | `decision_status`,`capability_snapshot_ref`,`reason_ref` | owned by boundary group version |
| `sandbox_environment_handles` | isolation handle marker | PK `handle_ref`;unique active `(boundary_ref)` | `handle_status`,`backend_handle_ref`,`lease_ref` | `sandbox_repository_version` or safety group version |
| `sandbox_lease_records` | lease / expiry / release marker | PK `lease_ref`;unique active `(handle_ref)` | `lease_status`,`expires_at`,`context_ref`,`handle_ref` | `sandbox_repository_version` |
| `sandbox_orphan_recovery_records` | orphan / reaper recovery fact | PK `orphan_recovery_ref`;unique active `(handle_ref, recovery_kind)` | `orphan_status`,`handle_ref`,`lease_ref`,`detected_at` | `sandbox_repository_version` |
| `sandbox_policy_groups` | `PolicyApplicabilitySnapshot` + `PolicyExecutionDecision` + optional `HighRiskActionDecision` | PK `policy_decision_ref`;unique latest `(context_ref, policy_scope_ref)` | `context_ref`,`decision_status`,`applicability_status`,`high_risk_status` | `sandbox_repository_version` |
| `sandbox_policy_snapshots` | body-free policy applicability / authorization snapshot | PK `policy_snapshot_ref`;unique `(policy_source_ref, source_version_marker)` | `applicability_status`,`policy_scope_ref`,`authorization_disposition`,`authorization_summary_refs`,`boundary_requirement_ref` | immutable by ref;current marker via policy group |
| `sandbox_high_risk_decisions` | high-risk action decision | PK `high_risk_decision_ref`;unique `(policy_decision_ref, action_ref)` | `action_status`,`action_kind`,`reason_ref` | owned by policy group version |
| `sandbox_runs` | `ControlledExecutionRun` truth | PK `run_ref`;unique active `(context_ref)` | `run_status`,`boundary_ref`,`policy_decision_ref`,`handle_ref` | `sandbox_repository_version` |
| `sandbox_capture_facts` | `CaptureFact` truth | PK `capture_ref`;unique `(run_ref, capture_kind)` | `capture_status`,`run_ref`,`material_ref`,`captured_at` | `sandbox_repository_version` |
| `sandbox_handoff_facts` | `HandoffFact` truth | PK `handoff_ref`;unique `(capture_ref, handoff_target_ref, handoff_kind)` | `handoff_status`,`target_ref`,`capture_ref`,`retry_after` | `sandbox_repository_version` |
| `sandbox_failure_classifications` | failure classification truth | PK `failure_ref`;unique active `(context_ref, source_ref, failure_kind)` when source is stable | `failure_status`,`failure_kind`,`run_ref`,`control_ref` | `sandbox_repository_version` |
| `sandbox_control_facts` | control action fact | PK `control_ref`;unique `(context_ref, control_signal_ref)` | `control_status`,`control_kind`,`run_ref`,`requested_at` | `sandbox_repository_version` |
| `sandbox_cleanup_guards` | cleanup readiness / material retention guard | PK `cleanup_guard_ref`;unique active `(context_ref, handle_ref)` | `guard_status`,`handoff_status`,`redline_status`,`lease_status` | `sandbox_repository_version` |
| `sandbox_redline_containments` | security redline containment fact | PK `redline_ref`;unique active `(context_ref, redline_kind, source_ref)` | `containment_status`,`investigation_ref`,`cleanup_guard_ref` | `sandbox_repository_version` |
| `sandbox_audit_traces` | append-only audit / trace records | PK `trace_record_ref`;unique `trace_record_ref` | `subject_ref`,`trace_kind`,`source_cursor`,`core_trace_id` | append-only;no optimistic overwrite |
| `sandbox_status_snapshots` | body-free status snapshot assembled from committed truth | PK `status_snapshot_ref`;unique latest `(context_ref)` | `context_ref`,`snapshot_status`,`source_cursor`,`projection_status` | replaced by snapshot version or immutable sequence |
| `sandbox_read_projections` | public read projection materialization | PK `projection_ref`;unique `(projection_kind, source_identity_ref)` | `projection_status`,`context_ref`,`source_cursor`,`stale_reason_ref` | `sandbox_repository_version` |
| `sandbox_projection_dependency_index` | truth/ref -> affected projection lookup | unique `(dependency_ref, dependency_kind, projection_ref)` | `dependency_ref`,`projection_ref`,`projection_kind` | rebuilt with projection;no standalone version |
| `sandbox_projection_context_index` | context -> stable projection refs for planned selector support | unique `(context_ref, projection_kind, projection_ref)` | `context_ref`,`projection_kind`,`projection_ref` | rebuilt with projection;no standalone version |
| `sandbox_derived_states` | derived inspect / preview / trend / comparison state | PK `derived_ref`;unique `(derived_kind, source_identity_ref)` | `freshness_status`,`source_ref`,`last_report_ref` | `sandbox_repository_version` |
| `sandbox_reconciliation_reports` | reconciliation job reports | PK `report_ref`;unique latest index `(scope_ref, report_kind)` | `scope_ref`,`report_status`,`created_at` | immutable report or superseded marker version |
| `sandbox_reconciliation_latest_index` | latest report by scope lookup | unique `(scope_ref, report_kind)` | `scope_ref`,`report_ref`,`report_status`,`created_at` | updated in report save UoW |
| `sandbox_handoff_status_index` | direct handoff selector support when callable surface is opened | unique `(handoff_ref, context_ref)` | `handoff_ref`,`context_ref`,`handoff_status` | maintained with handoff save |
| `sandbox_failure_status_index` | direct failure selector support when callable surface is opened | unique `(failure_ref, context_ref)` | `failure_ref`,`context_ref`,`failure_status` | maintained with safety group save |
| `sandbox_cleanup_status_index` | direct cleanup selector support when callable surface is opened | unique `(cleanup_guard_ref, context_ref)` | `cleanup_guard_ref`,`context_ref`,`guard_status` | maintained with safety group save |
| `sandbox_redline_status_index` | direct redline selector support when callable surface is opened | unique `(redline_ref, context_ref)` | `redline_ref`,`context_ref`,`containment_status` | maintained with safety group save |
| `sandbox_event_relay_records` | pending / retryable / delivered relay records | PK `relay_ref`;unique optional `(source_fact_ref, event_kind, payload_ref)` | `relay_status`,`event_kind`,`source_cursor`,`next_attempt_at` | `sandbox_repository_version` |
| `sandbox_event_payload_snapshots` | immutable outbound payload or payload source ref snapshot | PK `payload_ref`;unique `(event_kind, source_fact_ref, schema_version)` when payload is deterministic | `event_kind`,`source_fact_ref`,`schema_version` | immutable;no optimistic overwrite |
| `sandbox_idempotency_records` | operation idempotency reservation / completion | PK `idempotency_ref`;unique `(operation_name, channel, idempotency_key)` | `record_status`,`request_digest`,`stored_result_ref` | atomic reservation token or `sandbox_repository_version` |
| `sandbox_stored_results` | command result / consumer receipt / job report replay surface | PK `stored_result_ref`;unique optional `(operation_name, public_result_ref)` | `operation_name`,`result_status`,`created_at` | immutable after save |
| `sandbox_runtime_adapter_state` | adapter availability / runtime config technical state | PK `adapter_slot_ref` or `runtime_config_ref` | `availability_status`,`config_status`,`profile_ref` | runtime-local version;not sandbox truth version |

Store 契约说明:

- `sandbox_status_snapshots` 和 projection stores 只能从 committed truth / committed reference marker / stored report 构造,不得从 projection 自己重建 projection。
- direct selector index 只定义 storage 维护义务。当前 Step 7 没有 `find_*_by_*` callable surface 的 query 分支仍按 Step 9 返回 `Validation` / `MissingProjection` / `Degraded`;实现不得因此扫描 store 或拼 ref。
- `SandboxRepositoryCursor` 只用于 page/list 位置,不得进入 `source_cursor`、`expected_version`、audit trace 或 stored result。
- append-only store 不允许 update in place。需要状态推进的对象必须有独立 mutable marker,例如 relay record、projection state、handoff fact、cleanup guard。

### 8.3 Store 契约停审记录

| 停审项 | 结论 | 说明 |
|---|---|---|
| owned truth 是否列全 | 通过 | intake / identity / boundary / policy / run / capture / handoff / failure / control / cleanup / redline 均有 logical store。 |
| snapshot / ref / forbidden body 是否分层 | 通过 | external truth 仅以 ref、safe summary、body-free snapshot、source marker、handoff ref 保存。 |
| projection identity 是否闭合 | 通过 with current boundary | logical projection / dependency / context index 已定义;当前缺 callable finder 的 query 分支仍 unsupported,不得扫描。 |
| relay / outbox 是否闭合 | 通过 | relay record 与 payload/source snapshot 分离;append 与 publish 分离。 |
| stored replay 是否闭合 | 通过 | idempotency complete 指向 immutable stored result;duplicate 不重算。 |
| version 字段是否闭合 | 通过 | mutable truth / marker / projection / relay / idempotency 均有 `sandbox_repository_version` 或 atomic reservation token。 |

### 8.4 Repository 函数持久化语义表

本节承接 Step 7 trait,不新增 callable surface。若实施发现必须支持新的 finder / index read,必须回到 Step 7 / Step 8 / Step 9 修正 callable surface 和 protocol behavior,不能只在 adapter 内私加方法。

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| `SandboxUnitOfWorkManager.begin()` | 开启写事务 / staging boundary | command / consumer / job item / relay publish marker / projection rebuild item 调用;query 禁止调用写 UoW | `Box<dyn SandboxUnitOfWork>` | begin failure -> Step 12 operational error |
| `SandboxUnitOfWorkManager.commit(uow)` | 提交 staged writes | 所有 truth、trace、relay、stale、stored result、idempotency complete、cursor assignment 已完成后调用 | `()` | commit failure -> operation failure;不得部分可见 |
| `SandboxUnitOfWorkManager.rollback(uow)` | 丢弃 staged writes | validation after reserve、domain error、version conflict、port failure before accepted save、stored result failure 等路径调用 | `()` | rollback failure 交 Step 12;已 staged cursor 不得外泄 |
| `SandboxUnitOfWork.transaction_ref()` | 提供 transaction-local ref 供 adapter 断言 | 只能在 active UoW 内使用;不得持久化为 public truth id | `SandboxTransactionRef` | none |
| `SandboxUnitOfWork.assign_truth_change_cursor()` | 分配 accepted truth commit cursor | 必须在 changed truth、audit、relay、stale、stored result、idempotency complete 均 staged 后调用 | `SandboxTruthCursor` | cursor allocation failure -> rollback |
| `SandboxUnitOfWork.assign_reference_marker_cursor()` | 分配 reference-only marker cursor | 必须在 reference state / snapshot / stale marker 或 marker trace staged 后调用;不创建 `TruthChange` | `SandboxTruthCursor` | cursor allocation failure -> rollback |
| `SandboxTruthRepository.get_context_with_version(context_ref)` | 读取 context + optimistic version | read-only;update path 必须使用返回 version | `Option<Versioned<ControlledExecutionContext>>` | repository failure;missing 由 application 映射 |
| `SandboxTruthRepository.save_context(uow, context, expected_version)` | 创建 / 更新 context truth | create uses `None`;update uses loaded version;accepted/rejected result 与 audit / relay / stored result 同 UoW | `ControlledExecutionContextRef` | duplicate / version conflict / missing dependency |
| `SandboxTruthRepository.get_environment_identity_with_version(identity_ref)` | 读取 identity + version | read-only;close/update uses returned version | `Option<Versioned<ExecutionEnvironmentIdentity>>` | repository failure / missing |
| `SandboxTruthRepository.save_environment_identity(uow, identity, expected_version)` | 创建 / 更新 execution environment identity | create with accepted context transaction;close with cleanup / context close transaction | `ExecutionEnvironmentIdentityRef` | duplicate / version conflict |
| `SandboxTruthRepository.get_boundary_requirement(requirement_ref)` | 按typed ref读取immutable boundary requirement | read-only;policy flow必须校验requirement `context_ref`与request context一致;不得从latest boundary / current config重建 | `Option<BoundaryRequirementSet>` | missing / repository failure |
| `SandboxTruthRepository.get_boundary_with_version(boundary_ref)` | 读取 coherent boundary + version | read-only;release / update path uses returned version | `Option<Versioned<CoherentBoundary>>` | missing / repository failure |
| `SandboxTruthRepository.get_isolation_handle_with_version(handle_ref)` | 按coherent boundary携带的exact typed ref读取handle + version | read-only;run必须校验boundary / context / handle关系和`Active`;不得按context扫描latest handle | `Option<Versioned<IsolationEnvironmentHandle>>` | missing / repository failure |
| `SandboxTruthRepository.get_lease_with_version(lease_ref)` | 按active handle携带的exact typed ref读取持久化lease + version | read-only;run用logical clock校验`Active`且未过期;不得从current config重算window | `Option<Versioned<LeaseRecord>>` | missing / repository failure |
| `SandboxTruthRepository.save_boundary_group(uow, requirement, decision, boundary, handle, lease, expected_boundary_version)` | 原子保存boundary requirement / decision / coherent boundary / optional handle / optional lease | Established必须同时有active handle和lease;Rejected两者为空;Failed可有partial failed handle但不得有active lease;所有typed refs、identity/profile/template/generation必须一致 | `CoherentBoundaryRef` | version conflict;weak fallback rejection;group coherence violation;repository failure |
| `SandboxTruthRepository.get_policy_decision_with_version(decision_ref)` | 读取 policy decision + version | read-only;update/high-risk status uses returned version | `Option<Versioned<PolicyExecutionDecision>>` | missing / repository failure |
| `SandboxTruthRepository.save_policy_group(uow, snapshot, decision, high_risk_decision, expected_decision_version)` | 原子保存 policy snapshot / decision / high-risk decision | policy evaluation transaction;fail-closed and blocked are durable outcomes,not adapter errors | `PolicyExecutionDecisionRef` | version conflict;invalid snapshot;repository failure |
| `SandboxTruthRepository.get_run_with_version(run_ref)` | 读取 run + version | read-only;control/failure/capture update uses returned version | `Option<Versioned<ControlledExecutionRun>>` | missing / repository failure |
| `SandboxTruthRepository.save_run(uow, run, expected_version)` | 创建 / 更新 controlled run | launch outcome already classified;save with audit / relay / stored result in one UoW | `ControlledExecutionRunRef` | version conflict;invalid transition |
| `SandboxTruthRepository.save_capture_handoff_group(uow, capture, handoff, expected_capture_version, expected_handoff_version)` | 保存 capture 与 handoff fact | capture-only、handoff-only 或同事务 pair;handoff failure never rollback committed capture from earlier tx | `SandboxCaptureHandoffRefs` | version conflict;target mismatch;repository failure |
| `SandboxTruthRepository.save_safety_group(uow, group)` | 保存 failure / control / lease / orphan / cleanup / redline safety group | safety mutation transaction;must maintain direct selector indexes for future callable surface | `SandboxSafetyTruthRefs` | version conflict;guard violation;repository failure |
| `SandboxAuditTraceRepository.append_trace(uow, trace)` | append audit / trace record | same UoW as source truth / marker;append-only | `SandboxOpaqueRef` | duplicate trace ref / repository failure |
| `SandboxAuditTraceRepository.list_traces_by_subject(subject_ref, page)` | audit query page | read-only;stable order;page cursor not truth cursor | `Page<SandboxAuditTrace>` | repository failure |
| `SandboxAuditTraceRepository.get_trace(trace_ref)` | load one audit trace | read-only | `Option<SandboxAuditTrace>` | repository failure |
| `SandboxReferenceStateRepository.get_reference_state_with_version(reference_state_ref)` | load reference state + version | read-only;refresh/update uses returned version | `Option<Versioned<ReferenceResolutionState>>` | missing / repository failure |
| `SandboxReferenceStateRepository.list_reference_states_for_refresh(scope, page)` | maintenance selection for reference refresh | read-only;stable page;each item carries version | `Page<Versioned<ReferenceResolutionState>>` | invalid scope / repository failure |
| `SandboxReferenceStateRepository.save_reference_state(uow, state, expected_version)` | create/update local reference state | accepted consumer / refresh item transaction;cursor assigned after save staged | `ReferenceResolutionStateRef` | version conflict;duplicate mismatched ref |
| `SandboxTruthSnapshotRepository.load_status_snapshot(context_ref)` | body-free status read for query | read-only;must not begin write UoW;missing maps unavailable / degraded | `Option<SandboxExecutionStatusView>` | repository failure -> degraded/unavailable mapping |
| `SandboxTruthSnapshotRepository.load_projection_rebuild_snapshot(projection_ref)` | load committed truth inputs for projection rebuild | read-only;must contain all body-free inputs needed by view factory | `Option<SandboxProjectionRebuildSnapshot>` | missing snapshot -> degraded rebuild item |
| `SandboxTruthSnapshotRepository.load_reconciliation_snapshot(scope_ref, page)` | load committed truth snapshot page for reconciliation | read-only;does not repair truth | `Page<SandboxReconciliationSnapshotItem>` | partial/missing -> report degraded |
| `SandboxMaintenanceSelectionRepository.list_pending_handoffs(page)` | select pending handoff retries | read-only;returns versioned handoff facts | `Page<Versioned<HandoffFact>>` | repository failure |
| `SandboxMaintenanceSelectionRepository.list_expired_leases(now, page)` | select expired lease candidates | read-only;derived from persisted lease window + `now`;no state write | `Page<Versioned<LeaseRecord>>` | repository failure |
| `SandboxMaintenanceSelectionRepository.list_pending_cleanup_guards(page)` | select cleanup guard reevaluation targets | read-only;each item versioned | `Page<Versioned<CleanupGuard>>` | repository failure |
| `SandboxMaintenanceSelectionRepository.list_redline_handoff_pending(page)` | select redline investigation handoff targets | read-only;each item versioned | `Page<Versioned<RedlineContainment>>` | repository failure |
| `SandboxMaintenanceSelectionRepository.list_relay_retry_candidates(page)` | select relay retry candidates | read-only;versioned relay records | `Page<Versioned<SandboxEventRelayRecord>>` | repository failure |
| `SandboxProjectionRepository.get_projection(projection_ref)` | read projection for query | read-only;missing maps `MissingProjection`;query must not rebuild | `Option<SandboxReadProjection>` | repository failure -> degraded/unavailable |
| `SandboxProjectionRepository.list_projections_affected_by_truth(truth_refs, page)` | enumerate existing affected projection refs | read-only before stale marking;must return formal refs only | `Page<SandboxReadProjectionRef>` | repository failure;empty is allowed no-op |
| `SandboxProjectionRepository.save_projection(uow, projection, expected_version)` | save rebuilt projection | per-item rebuild transaction;expected version from loaded projection / `None` for first materialization | `SandboxReadProjectionRef` | version conflict;missing snapshot;repository failure |
| `SandboxProjectionRepository.mark_projection_stale(uow, projection_ref, marker_cursor, reason)` | mark existing projection stale | source cursor must be UoW truth or reference marker cursor;no ad-hoc projection ref | `()` | missing projection / cursor misuse / repository failure |
| `SandboxDerivedRepository.get_derived_state_with_version(derived_ref)` | read derived state + version | read-only;query no rebuild | `Option<Versioned<DerivedInspectPreviewTrendState>>` | missing / repository failure |
| `SandboxDerivedRepository.list_derived_rebuild_candidates(page)` | select derived maintenance targets | read-only;versioned targets | `Page<Versioned<DerivedInspectPreviewTrendState>>` | repository failure |
| `SandboxDerivedRepository.save_derived_state(uow, state, expected_version)` | save derived state transition | per-item job transaction;must not mutate core truth | `SandboxOpaqueRef` | version conflict;repository failure |
| `SandboxDerivedRepository.save_reconciliation_report(uow, report)` | save reconciliation report | report job transaction;updates latest index with report save | `SandboxOpaqueRef` | duplicate / repository failure |
| `SandboxDerivedRepository.get_reconciliation_report(report_ref)` | read reconciliation report by ref | read-only;scope-only latest lookup not callable unless Step 7 amended | `Option<SandboxReconciliationReport>` | missing / repository failure |
| `SandboxEventRelayRepository.append_pending_relay(uow, relay)` | append pending relay in source transaction | same UoW as source truth / marker and payload/source snapshot;append-only identity + mutable status | `SandboxOpaqueRef` | duplicate / payload missing / repository failure |
| `SandboxEventRelayRepository.list_pending_relay_records(page)` | select pending / retryable relay records | read-only;returns `Versioned<T>` for publish update | `Page<Versioned<SandboxEventRelayRecord>>` | repository failure |
| `SandboxEventRelayRepository.save_relay_record(uow, relay, expected_version)` | update relay publication status | publish job transaction;never touches source truth | `()` | version conflict;terminal transition violation |
| `SandboxIdempotencyRepository.reserve(uow, ctx)` | reserve operation idempotency key | first write in mutation UoW;unique operation/channel/key + digest | `SandboxIdempotencyReservation` | conflict returns safe application error |
| `SandboxIdempotencyRepository.get_record(operation_name, idempotency_key)` | inspect idempotency record | read-only;diagnostic / recovery only | `Option<SandboxIdempotencyRecord>` | repository failure |
| `SandboxIdempotencyRepository.complete(uow, idempotency_ref, stored_result_ref)` | link idempotency record to stored result | same UoW after stored result save;before cursor/commit | `()` | missing result / version conflict / repository failure |
| `SandboxIdempotencyRepository.fail(uow, idempotency_ref, reason)` | mark reservation failed without replayable result | same UoW or rollback handoff per Step 12;does not create fake result | `()` | repository failure |
| `SandboxStoredResultRepository.save_result(uow, result)` | save replayable command / consumer / job result | same UoW before idempotency complete;immutable result | `SandboxOpaqueRef` | duplicate / invalid result / repository failure |
| `SandboxStoredResultRepository.get_result(stored_result_ref)` | load replayable public result | read-only;duplicate path only | `Option<SandboxStoredOperationResult>` | missing -> duplicate missing result,not recompute |

Repository 函数补充规则:

- `expected_version = None` 只用于创建新 ref 所属对象;更新 existing object 必须使用 versioned read/list 返回的 version。
- page item version 只可用于更新该 item,不得迁移到 sibling object。
- append-only repository 不接受 update;需要状态推进时必须更新对应 mutable marker。
- query service 只可调用 read-only 函数;不得调用 `begin()`、`save_*`、`append_*`、`mark_projection_stale`、`complete` 或 `fail`。
- entry (`api` / `worker` / `jobs`) 不直接访问 repository;只能经 application facade。

### 8.5 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| Command accepted mutation | `SandboxCommandService::<command>` after protocol validation | truth / audit / relay / projection stale / stored result / idempotency complete / cursor staged 后 | idempotency conflict、domain invalid transition、resolver / adapter blocking failure、repository conflict、stored result save failure、cursor allocation failure | reserve idempotency;versioned reads;domain transition;save truth group;append audit;append pending relay where payload exists;list affected projections and mark stale;save stored result;complete idempotency;assign truth cursor。 |
| Command replayable rejected mutation | command service after validation when Step 8 says rejected result is replayable | rejected result / audit if formal / idempotency complete staged 后 | invalid request before reserve、repository conflict、stored result save failure | reserve idempotency;save rejected/unresolved truth when rejection is formal truth;save stored result;complete idempotency;assign truth cursor only if truth changed。 |
| Command duplicate replay | idempotency reserve returns duplicate | rollback/no-op immediately after duplicate detected | stored result missing or digest conflict | no mutation;read stored result returned by reserve or `get_result`;rollback opened UoW;return stored result;do not call resolver/adapter/domain/repository mutation。 |
| Boundary establishment group | Command 2 UoW after context / identity validation and idempotency reserve | requirement / decision / boundary / optional handle / optional lease plus audit / relay / stale / stored result staged 后 | identity/profile/template/generation mismatch、capability / adapter outcome malformed、weak fallback、group coherence violation、repository conflict | persist immutable requirement with identity/profile/template/generation refs;Established requires active handle + bounded lease;Rejected requires neither;Failed preserves any partial failed handle;all visible atomically。 |
| Policy evaluation group | Command 3 UoW after context and exact requirement load | snapshot / high-risk decision / final policy decision plus audit / relay / stale / stored result staged 后 | requirement-context mismatch、snapshot source mismatch、authorization / marker classification malformed、repository conflict | read persisted requirement by typed ref;save body-free policy / authorization snapshot,high-risk decision and Accepted / Rejected / Blocked / FailClosed decision atomically;never mutate boundary group。 |
| Query read | `SandboxQueryService` method | none;read call returns | no write rollback because no write UoW exists | normalize selector;read snapshot/projection/derived/audit;assemble DTO;map missing/degraded;never refresh/rebuild/handoff/cleanup/release。 |
| Inbound reference consumer accepted marker | `SandboxConsumerService` after envelope validation | reference state / stale / receipt / idempotency complete / cursor staged 后 | untrusted source、schema/digest invalid、forbidden body,version conflict,stored receipt save failure,cursor allocation failure | reserve dedup;save reference state or feedback marker;mark existing projections stale;save consumer receipt stored result;complete idempotency;assign reference marker cursor。 |
| Inbound feedback consumer updates truth | consumer flow after matched target loaded | matched handoff / relay / safety truth and receipt staged 后 | target mismatch、version conflict,invalid transition,stored receipt failure | load target with version;apply formal transition;save target;append audit if formal subject exists;save receipt;complete idempotency;assign truth cursor if core truth changed。 |
| Append pending relay | source command / maintenance transaction | source transaction commit | payload/source missing,relay append failure,source transaction rollback | build canonical payload/source snapshot;create pending relay;append in same UoW as source truth / marker;stored result includes relay refs。 |
| Publish relay record | `PublishSandboxEventRelayFlow` item UoW after publisher outcome | relay status / job report item staged 后 | version conflict,invalid terminal transition,stored job report failure | load versioned relay;publish outside source truth transaction;map outcome;save relay record;save job report item / stored report;source truth untouched。 |
| Projection stale marking | command / consumer / reference refresh UoW | source transaction commit | affected projection list failure when stale required,missing projection,invalid cursor | list existing affected projection refs;mark each stale with UoW cursor;do not create projection refs from input strings。 |
| Projection rebuild item | `RebuildSandboxReadProjectionsFlow` per target UoW | rebuilt projection / job item staged 后 | missing snapshot,version conflict,view factory failure,repository failure | load rebuild snapshot from committed truth;build projection from body-free inputs;save projection with expected version;save job report item;no core truth mutation。 |
| Derived maintenance item | `MaintainDerivedInspectPreviewTrendFlow` per target UoW | derived state / report item staged 后 | version conflict,builder failure,source missing | load versioned derived state;derive from committed refs/snapshots;save derived state;save report item;no core truth repair。 |
| Reconciliation report | `RunSandboxReconciliationFlow` after snapshot page read | report + latest index + stored job report staged 后 | snapshot integrity failure without degraded marker,report save failure,stored result failure | load committed truth snapshot page;assemble clean/issues/degraded report;save report;update latest index;save stored job report;no repair。 |
| Cleanup / reaper item | cleanup / reaper job per target UoW | safety group / audit / relay / report staged 后 | cleanup guard not allowed,redline unresolved,version conflict,release adapter failure mapped as retryable/failed | load guard/lease/handle version;verify guard;call backend release if allowed;save safety group;append audit/relay;save report item;never delete evidence before guard。 |
| Redline containment / investigation handoff | command or handoff job UoW | containment / handoff marker / stored result staged 后 | boundary mismatch,investigation handoff unavailable without pending marker,version conflict | save redline containment;append audit;save handoff pending/failed marker;save stored result;cleanup remains blocked unless guard allows。 |
| Idempotency fail without replayable result | failure path after reservation but before replayable result | fail marker commit or rollback per Step 12 policy | repository failure | mark idempotency failed only when failure state must be durable;otherwise rollback hides reservation;never fabricate stored result。 |

### 8.6 Version、cursor、rollback 与可见性规则

| 规则 | 正式口径 | 禁止替代 |
|---|---|---|
| optimistic version 来源 | 只能来自 `Versioned<T>.version` from `get_*_with_version` 或 versioned list item。 | page cursor、timestamp、id generator、trace id、stored result ref、source cursor、event sequence。 |
| create version | `expected_version=None` 只用于新对象创建;repository 必须拒绝同 ref / unique key 已存在且内容不一致。 | missing 时自动覆盖、fake auto-create、按 ref 文本推断 create/update。 |
| grouped save version | `save_boundary_group`、`save_policy_group`、`save_capture_handoff_group`、`save_safety_group` 必须把 group 内相关 object 作为一个 UoW 可见单元。 | 半组可见、fake 分别提交、后续 job 补另一半。 |
| truth cursor 分配 | accepted truth / safety / feedback truth staged 后由 `assign_truth_change_cursor()` 分配,再复制到 audit / relay / stale / stored result。 | `SandboxRepositoryCursor`、`SandboxRepositoryVersion`、timestamp、trace ref、idempotency digest、hard-coded string。 |
| reference marker cursor 分配 | reference-only consumer / refresh staged 后由 `assign_reference_marker_cursor()` 分配,只用于 projection stale、optional marker trace、receipt/report 对齐。 | source version、event dedup key、snapshot version、request digest。 |
| multiple truth subjects | 同一 accepted command 可复用一个 command boundary cursor;若实现选择 per-subject cursor,必须保证所有 trace / relay / stale / stored result 明确复制对应 cursor。当前设计默认一个 UoW boundary cursor。 | 每个 repository 私自生成 cursor。 |
| rollback visibility | rollback 后 truth、snapshot、audit trace、relay record、projection stale marker、stored result、idempotency complete/fail、cursor 全部不可见。 | fake 保留 staged map、stored result 可见、cursor 泄露到 receipt。 |
| commit visibility | commit 后同 UoW staged writes 原子可见;query 要么看到 commit 前,要么看到 commit 后,不能看到半组。 | query 看到 saved truth 但看不到 stored result / audit / stale marker 的半提交。 |
| append-only visibility | append record 只有 commit 后可见;append record 不可更新。 | update trace / audit / payload snapshot in place。 |
| fake cursor parity | fake 必须提供单调、稳定、可断言的 truth/reference marker cursor,并遵守 rollback 隐藏。 | fake 使用 timestamp / counter outside UoW 且 rollback 后仍占用可见 cursor。 |

### 8.7 Query selector / index 处理表

| Selector / read path | 当前 Step 7 callable surface | Logical index | 当前行为 | 后续开放条件 |
|---|---|---|---|---|
| status by `context_ref` | `SandboxTruthSnapshotRepository.load_status_snapshot(context_ref)` | `sandbox_status_snapshots` latest by context | executable read-only;missing -> unavailable/degraded | none |
| projection by `projection_ref` | `SandboxProjectionRepository.get_projection(projection_ref)` | `sandbox_read_projections` | executable read-only;missing -> `MissingProjection` | none |
| projection by `context_ref` | no finder in Step 7 | `sandbox_projection_context_index` | current boundary returns `MissingProjection` / degraded;no scan | Step 7 must add explicit `find_projection_ref_by_context`-style surface and Step 8/9 update protocol / flow。 |
| direct handoff by `handoff_ref` | no handoff getter in Step 7 except maintenance list | `sandbox_handoff_status_index` | current boundary returns validation unless context snapshot contains relation | Step 7 must add read surface or protocol must require `context_ref`。 |
| direct failure by `failure_ref` | no direct getter in Step 7 | `sandbox_failure_status_index` | current boundary returns validation / degraded | Step 7 amendment required。 |
| direct cleanup by `cleanup_guard_ref` | no direct getter in Step 7 | `sandbox_cleanup_status_index` | current boundary returns validation / degraded | Step 7 amendment required。 |
| direct redline by `redline_ref` | no direct getter in Step 7 | `sandbox_redline_status_index` | current boundary returns validation / degraded | Step 7 amendment required。 |
| latest reconciliation by `scope_ref` | `get_reconciliation_report(report_ref)` only | `sandbox_reconciliation_latest_index` | scope-only query returns validation until finder exists | Step 7 add latest-by-scope read or Step 8 require explicit report ref。 |
| audit trace by subject | `SandboxAuditTraceRepository.list_traces_by_subject(subject_ref,page)` | `sandbox_audit_traces.subject_ref` | executable read-only;empty page is valid | none |

Index rules:

- Logical indexes are maintained by write / rebuild paths so durable storage can support future finder functions without data migration ambiguity.
- Current implementation boundary must not expose index-backed branches unless callable surface and protocol flow are updated in design.
- Missing index row is not permission to derive ref from strings;it maps to missing projection / validation / degraded according to Step 9 and Step 12.

### 8.8 一致性策略表

| 一致性对象 | 策略 | 恢复 / 补偿 | 禁止行为 |
|---|---|---|---|
| core truth group | Strong within UoW;context/identity、boundary requirement/decision/coherent/handle/lease、policy snapshot/high-risk/decision、run/capture/safety groups each become visible atomically with required side effects。Run沿boundary -> handle -> lease exact refs读取已提交组并验证active / non-expired。 | rollback hides all staged writes;version conflict returns conflict and may be retried by caller with fresh read in later flow。 | half-save truth group;policy reconstructs requirement from current config;run scans latest handle / lease or recomputes window;fake auto-commit;repository overwrite without expected version。 |
| audit trace | append in same UoW as source truth / formal marker。 | if append fails before commit,rollback source mutation;after commit trace is immutable。 | query appends missing trace;adapter logs replace audit trace。 |
| relay / outbox | append pending relay in source UoW;publish in separate relay UoW。 | publish failure updates relay status / report only;retry/dead-letter via relay job。 | publish failure rolls back source truth;publisher rebuilds payload from current truth。 |
| projection stale | mark existing affected projections stale in source UoW using truth/reference cursor。 | rebuild job refreshes;missing affected refs means no-op only if no formal projection exists。 | construct projection ref from context string;query rebuilds stale view。 |
| projection rebuild | eventually consistent from committed truth snapshot。 | missing/partial snapshot writes degraded/unavailable report item;query surfaces stale/degraded。 | rebuild from existing projection body;repair core truth。 |
| derived state | eventually consistent from committed refs/snapshots。 | maintenance job saves failed/unavailable state and report;later retry can rebuild。 | derived failure changes run/capture/policy truth。 |
| reconciliation report | report-only consistency;reads committed truth snapshot。 | report `Degraded` / `Failed` if snapshot incomplete;does not repair。 | reconciliation job modifies core truth。 |
| idempotency + stored result | reservation, stored result save and complete in one UoW for replayable outcomes。 | duplicate missing stored result maps to Step 12 `DuplicateMissingResult`;do not recompute。 | duplicate reruns command/consumer/job;generic placeholder result。 |
| external snapshots / references | local eventual consistency;body-free snapshots can be stale/unavailable。 | reference refresh updates state and marks projections stale;core truth remains unchanged。 | save external body;turn missing policy/backend summary into allow。 |
| cleanup / reaper / redline | guard / containment priority over resource release。 | blocked/pending guard prevents release;redline pending keeps cleanup blocked;reaper records orphan recovery state。 | cleanup before material / investigation handoff;redline advisory-only。 |
| fake / durable parity | fake must model UoW staging,rollback,unique key,version conflict,cursor,stored result,page order。 | contract tests in Step 16 verify parity;implementation cannot simplify fake semantics. | fake private map scans,auto-create,ignore version,ignore rollback。 |

### 8.9 Projection rebuild source 表

| Projection / derived surface | Rebuild source | Source fields | Repository port | 缺失处理 |
|---|---|---|---|---|
| `SandboxExecutionStatusView` / status snapshot | committed context,identity,boundary,policy,run,capture,handoff,failure,cleanup,redline truth | body-free status fields、status enum、refs、safe reason markers、source cursor | `load_status_snapshot(context_ref)` / snapshot writer behind truth store | missing -> unavailable/degraded;query no repair。 |
| `SandboxReadProjection` by projection ref | `SandboxProjectionRebuildSnapshot` from committed truth | projection_ref、context_ref、view factory inputs、source cursor | `load_projection_rebuild_snapshot(projection_ref)` + `save_projection` | missing snapshot -> degraded rebuild item。 |
| Backend capability comparison view | body-free backend capability snapshots and boundary requirements | backend profile ref、capability status、supported limits summary refs | `SandboxDerivedRepository.get_derived_state_with_version` / maintenance builder | missing summary -> degraded comparison;no backend scan from query。 |
| Derived inspect / preview / trend state | committed capture/handoff/failure/lease/redline refs and safe summaries | source refs、freshness status、degraded markers | `list_derived_rebuild_candidates` + `save_derived_state` | failed/unavailable state;no core truth repair。 |
| Reconciliation report | committed truth snapshot page | refs、state enum、safe issue markers、source cursors | `load_reconciliation_snapshot(scope_ref,page)` + `save_reconciliation_report` | report degraded/failed;no repair。 |
| Relay pending view / retry report | committed relay records | relay ref、event kind、status、attempt markers | `list_pending_relay_records` + `save_relay_record` | retryable/dead-letter report;source unchanged。 |

### 8.10 Historical material / blocker 处理

| 项目 | 状态 | Step 11 处理 |
|---|---|---|
| 旧 `03-详细设计.md` 持久化 / bridge 假设 | historical_material | 未继承旧 store、bridge、provider、audit evidence 或 Docker/gVisor 物理口径。 |
| 旧 README 后端 / audit / event 线索 | historical_material | 只作为污染风险;不作为 logical store、event relay 或 persistence 产品选择来源。 |
| `SBX-DDD-FLOW-QUERY-001` | contained_for_step_11 | logical index 已定义;current callable surface 未开放的 query 分支仍 validation/missing/degraded,不阻塞 Step 12。 |
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | resolved_by_07_step_6_writeback | Step 6发现boundary若消费后序policy会形成PH-05 / PH-06循环。已明确immutable requirement保存identity/profile/template/generation refs,policy只按typed requirement ref读取;boundary group原子保存handle / lease,不消费policy。 |
| 正式 `04-配置设计.md` 缺失 | open_downstream | 不阻塞 Step 11;Step 14 和正式 04 承接 config owner / validator / boundary guard。 |
| 正式 `07-实施计划.md` 缺失 | open_downstream | 不阻塞 Step 11;进入 07 时必须同步 implementation ledger 和 planned boundary skeleton。 |

---

## 9. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§10 可按以下结构回填。本步不直接修改正式 `03`。

```md
## 10. 数据持久化、事务与一致性契约

> 校准来源:
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `design-calibration/03_ddd_step_09_function_flows.md`
> - `design-calibration/03_ddd_step_10_state_matrix.md`
> - `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“数据所有权实现表”“Logical store / collection / projection 契约表”“Repository 函数持久化语义表”“事务边界表”和“一致性策略表”,了解本章如何把 port、flow 和状态矩阵转译为可实现持久化契约。

L4-sandbox 的持久化契约采用 logical store 口径,不绑定具体数据库或 DDL。实现必须保持 sandbox-owned truth、external refs、body-free snapshot、projection、derived report、relay、audit trace、idempotency 和 stored result 分层。外部 identity / work / runtime / tool / policy / backend / artifact / observability / investigation 正文不得进入 sandbox truth。

所有 mutation path 必须经 `SandboxUnitOfWork`。更新 existing truth / marker / projection / relay 必须先读取 `Versioned<T>` 并使用 `SandboxRepositoryVersion` 作为 `expected_version`;不得用 page cursor、timestamp、trace id、source cursor 或 stored result ref 代替 version。accepted truth cursor 与 reference marker cursor 只能由 UoW 在 staged writes 后分配,rollback 后不得对外可见。

Command accepted path 按 reserve -> read/adapter -> domain transition -> save truth -> append audit / relay -> mark stale -> save stored result -> complete idempotency -> assign cursor -> commit 执行。Query 只读,不得 begin write UoW、refresh、rebuild、handoff、cleanup 或 release。Relay append 在 source transaction 内完成,publish 在独立 relay transaction 内更新 relay record;publish failure 不回滚 source truth。Projection rebuild、derived maintenance 和 reconciliation 只能读取 committed truth / snapshot,不得修复 core truth。

Boundary establishment必须在一个UoW内保存immutable `BoundaryRequirementSet`、decision、coherent / rejected / failed boundary、optional handle和optional lease。requirement必须持久保存context / environment identity / boundary profile / limit template / runtime generation refs及显式五维要求。Policy evaluation只通过`get_boundary_requirement(requirement_ref)`读取该事实并校验context归属,不得从current config或latest boundary重建;policy snapshot / high-risk decision / final policy decision在独立后序UoW原子保存。

Run launch必须沿`CoherentBoundary.isolation_handle_ref -> IsolationEnvironmentHandle.lease_ref -> LeaseRecord`精确读取已提交组,校验context / ref关系、handle `Active`、lease `Active`且logical now未越过持久化window后才可调用backend。run不得选择lease profile、重算window、扫描latest handle / lease或在失败时创建replacement lease。

Direct query selector 和 projection-by-context / latest-report-by-scope 读取必须有正式 repository callable surface。当前 Step 7 未开放 finder 的分支继续返回 validation、missing projection 或 degraded,实现不得扫描 storage 或拼接 ref。Logical index 作为持久化维护义务保留,供后续设计正式开放读取面时使用。
```

---

## 10. Step 12 handoff items

| 后续 Step | 承接项 | 约束 |
|---|---|---|
| Step 12 error / recovery | version conflict、duplicate missing result、cursor allocation failure、rollback failure、projection missing、relay dead-letter、handoff retryable/failed、cleanup guard rejection、redline handoff pending。 | 本步只定义 transaction / consistency;Step 12 必须给 exact error variant、public mapping 和 recovery口径。 |
| Step 13 concurrency / idempotency | idempotency key uniqueness、digest canonicalization、reservation conflict、concurrent expected version conflict、duplicate replay under retry。 | duplicate 不重算;concurrent write 不放宽状态迁移。 |
| Step 14 config / external binding | lease window、retry / dead-letter threshold、projection rebuild cadence、reference refresh cadence、adapter availability storage、runtime config profile refs。 | 配置不得改变 truth owner、fail-closed、cleanup guard、redline 或 no-write。 |
| Step 16 test cuts | fake/durable UoW rollback、version conflict、cursor source、stored replay、query no-write、relay no-rollback、projection rebuild from committed truth。 | 不伪造真实测试结果;只定义测试切口。 |
| Step 17 implementation handoff | repository fake / durable parity、logical store skeleton、index current boundary、implementation boundary 前置 surface。 | 07 才能形成 commit boundary;当前不写实施计划。 |

---

## 11. 待确认事项

| 待确认 | 当前处理 | 是否阻塞 Step 11 |
|---|---|---|
| 具体数据库 / object store / transaction isolation level | 本步采用 logical store contract;物理产品后续在配置 / 实施阶段选择。 | 否 |
| direct selector finder 是否正式开放 | 当前不开放;logical index 仅定义维护义务;缺 Step 7 surface 的 query 分支仍 validation/missing/degraded。 | 否 |
| lease expiry 是状态字段还是由窗口派生 | selection 可由 persisted lease window + `now` 派生,但正式 expiry / orphan / release 必须保存 lease/orphan/safety truth。 | 否 |
| relay retry / dead-letter 阈值 | 本步只定义状态与事务;阈值交 Step 13 / Step 14。 | 否 |
| stored rejected result 的完整 replay scope | Step 8 已定义 public result surface;Step 12 / Step 13 继续细化哪些 rejection 持久 replay、哪些 rollback-only。 | 否 |
| fake adapter cursor sequence 具体实现 | 本步要求单调、稳定、rollback hidden;测试切口交 Step 16。 | 否 |

---

## 12. 自检

| 检查项 | 结论 |
|---|---|
| 是否创建 Step 11 中间产物 | 通过。本文为 `03_ddd_step_11_persistence_transaction_consistency.md`。 |
| 是否修改正式 `03-详细设计.md` | Step 6可落码性回查要求同步回写正式§10摘要;该回写不改变协议 /状态数量。 |
| 是否提前创建 Step 12 | 未创建。 |
| 是否输出数据所有权实现表 | 通过。见 §8.1。 |
| 是否输出 logical store / projection 契约表 | 通过。见 §8.2。 |
| 是否输出 Repository 函数表 | 通过。见 §8.4。 |
| 是否输出事务边界表 | 通过。见 §8.5。 |
| 是否输出一致性策略表 | 通过。见 §8.8。 |
| 是否闭合 version / cursor / rollback | 通过。见 §8.6。 |
| 是否闭合 relay / projection / stored replay | 通过。见 §8.5、§8.8、§8.9。 |
| 是否保持 query no-write | 通过。query 不 begin write UoW,不 save,不 append,不 mark stale,不 rebuild。 |
| 是否保持 job no core repair | 通过。projection / derived / reconciliation / relay job 只维护 read side / marker / report。 |
| 是否保持 relay / handoff no-rollback | 通过。publish / handoff failure 不回滚 source truth / capture truth。 |
| boundary / policy持久化顺序是否闭合 | 通过。boundary group先保存immutable requirement与handle / lease;policy后序按typed ref读取,无反向依赖。 |
| 是否混入禁止范围 | 未混入。未把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store、policy definition / approval / allowlist / capability truth 写入 sandbox persistence。 |
| 是否发现上游 blocker | 未发现阻塞 Step 11 的上游 blocker。direct selector gap 已作为 current callable boundary 收口。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

---

## 13. 进入下一步条件

```text
当前 Step 11 已完成并停在用户审查点。

用户确认后,才能进入 Step 12 `定义错误模型、异常分支与恢复口径`。
进入 Step 12 前必须读取:
1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_11_persistence_transaction_consistency.md`
4. `03_ddd_step_09_function_flows.md`
5. `03_ddd_step_10_state_matrix.md`
6. 详细设计 SOP Step 12
7. 详细设计书写规范 §5.11
8. 真相源标准中 error mapping、duplicate missing result、query degraded marker、relay dead-letter、handoff failure、no-write violation 和 recovery boundary 相关条目

Step 12 必须闭口错误 taxonomy、异常 surface、恢复 / 不恢复口径和禁止行为;
不得在用户确认前创建 Step 12 文件。
```

---

## 14. PHYSICAL EOF Current Persistence Override: capture / handoff / relay (`v7.8`)

本节覆盖本文单层 `sandbox_handoff_facts`、generic handoff adapter 和 relay `delivered` 的 historical persistence 快照。它只更新
logical store / UoW contract，不选择数据库，不创建独立 progress / attempt repository，也不声明任何 durable implementation 已存在。

### 14.1 Logical ownership

| logical root | current shape | version / uniqueness | write owner |
|---|---|---|---|
| `sandbox_capture_facts` | immutable `CaptureFact`，创建即为 `Complete / Partial / Failed / Unavailable`；无 `Pending` | PK `capture_ref`；同 terminal snapshot / capture kind 唯一 | fresh post-adapter capture UoW |
| captured / observability material rows | body-free source rows；只保存 typed refs、safe summary、lineage 和 lifecycle | composite key按 Step 7 repository owner；不携带 body | capture group UoW |
| `sandbox_handoff_facts` | `HandoffFact` root 内嵌 immutable `HandoffTargetSet` 与完整 `HandoffTargetProgressSet` | PK `handoff_ref`；aggregate 使用一个 `Version` / expected CAS | opening / per-target delivery application owner |
| embedded target progress | 每 fixed target 恰一项；保存 status、current attempt relation、typed receipt / safe reason、retry age | 无独立 PK、Version、repository 或 generic index | `HandoffFact` aggregate methods only |
| exact attempt recovery relation | 绑定 `(handoff_ref,target_ref,attempt_ref,generation,request relation)` 的既有 recovery write set | external call 前必须 committed；same-attempt inspect复用 | per-target job item UoW |
| `sandbox_event_relay_records` + frozen payload | source transaction 中提交；publisher 只读 exact committed pair | relay / attempt expected Version；source cursor immutable | source UoW append + relay-local publish UoW |

### 14.2 UoW ordering

| operation | required commit boundary | forbidden half state |
|---|---|---|
| capture collection | external call期间无 write UoW；candidate 返回后 fresh-read lineage，再原子保存 capture/material/audit/relay/stale/result | pending capture、adapter-owned truth、unknown直接成功、body row |
| handoff opening | fixed target plan、完整 Pending progress set、aggregate、audit/relay/result 同 UoW；delivery call `=0` | root先可见而progress缺项、opening内attempt / receipt |
| begin target attempt | `Pending | eligible Retryable -> Attempting` 与 exact attempt relation先 commit | 未提交 attempt 即外呼、一个 target 多 current attempt |
| deliver / inspect | write UoW 外执行；每 attempt 最多一次 `deliver`，unknown仅同 attempt inspection | blind retry、new attempt inspection、adapter repository write |
| apply observation | fresh-read aggregate / expected Version；progress 与 aggregate derive 同 UoW | progress terminal但aggregate未重算、earlier target被删除 |
| relay publish | frozen pair和attempt先 committed；publish后只更新 relay-local status / report | latest truth payload rebuild、publish失败回滚source / cursor |

### 14.3 Status persistence

```text
CaptureFactStatus = Complete | Partial | Failed | Unavailable
HandoffTargetProgressStatus = Pending | Attempting | Delivered | Retryable | Failed
HandoffFactStatus = Pending | InProgress | Delivered | Retryable | Failed | BlockedByCleanupGuard
SandboxEventRelayStatus = Pending | Published | Failed | Retryable | DeadLetter
```

`HandoffFactStatus` 只能从完整 progress set 与可选 cleanup guard override 机械派生；没有 material `DeadLetter`。relay success 只使用
`Published`，不得持久化 `Delivered` alias。

```text
new_repository = 0
new_uow_group = 0
progress_repository = forbidden
opening_external_call = forbidden
source_no_rollback = required
real_durable_store = not_implemented
real_test_execution = not_started
commit_required = no
```
