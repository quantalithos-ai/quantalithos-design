# Step 9. 定义逐接口函数级处理流

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 9  
> 回填章节：未来正式 `03-详细设计.md` §8；本 Step 不修改正式文档  
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md`  
> 生成日期：2026-09-20  
> 状态：`in_progress`  
> 物理实现状态：`blocked`；本文中的 Rust-like 伪代码只表达语言中立的函数与顺序契约，不证明 Rust、crate、transport、store 或实现仓存在

---

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` calibration |
| current_step | Step 9 |
| current_module | `function_flows:final_cross_flow_audit` |
| gate_status | `completed_with_upstream_blockers` |
| gate_reason | 11/11 Command、12/12 Query、4/4 blocked-first Consumer、0 outbound residue、5/5 Operations Job 均完成独立停审；跨 flow 事务、状态、幂等、phase 和 truth-owner 审计通过，保留 `RUN-UP-001~008`、`RUN-DDD-001~003`。 |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| next_allowed_action | 读取 Step 10 SOP/规范与 L1-governance Step 10，建立 `03_ddd_step_10_state_matrix.md`；Step 10 完成后立即停审 |
| commit_required | `false` |

开工反查已修正两类前序逻辑接缝：Step 6 的 local `Id`/public `Ref`、selection/source/candidate transition；Step 7/8 的 facade 与 public outcome/response envelope。修正记录分别为 `RUN-S6-FIX-001~004`、`RUN-S7-FIX-001`、`RUN-S8-FIX-001`。Step 9 final audit 另记录 `RUN-S6-FIX-012`（job report projection/issue carrier）、`RUN-S7-FIX-010~011`（scoped eviction page、versioned section identity、preview exact-set lookup）。这些修正不改变概要接口目录、truth owner 或技术选择。

## 2. 本步目标、输入与非目标

### 2.1 目标

把 Step 8 固定的每一个入口展开为可编码的函数级处理流，并逐项闭合：

- public DTO → application context → domain/value mapping；
- repository/version、idempotency/stored replay 与 UoW 顺序；
- Step 6 factory/member method 和 Step 7 repository/required port 调用；
- external I/O 与 Runner local UoW 的硬隔离；
- typed rejected/conflict/unknown/degraded/not-visible 分支；
- Runner-owned 状态、副作用、无 outbound event 边界与测试切口；
- Step 10 状态机候选与触发函数。

### 2.2 输入

| 输入 | 本 Step 使用内容 | 使用上限 |
|---|---|---|
| 正式 `02-概要设计.md` §8～§10 | command/job 双事务骨架、query no-write、consumer blocked-first、状态传播 | 不改变接口数量或 ownership。 |
| `03_ddd_step_05_module_contracts_axis.md` | 七逻辑模块和依赖方向 | 不生成物理 package/path。 |
| `03_ddd_step_06_object_contracts.md` | factory、transition、state enum、application/entry/worker/job object | 缺函数必须先回写 Step 6。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repositories、UoW、id/result/operations、14 required ports、facades | 缺接缝必须先回写 Step 7；不得在本文件临时发明。 |
| `03_ddd_step_08_protocol_contracts.md` | request/result/view/receipt/report schema 和 finite dispatch unions | 不为迁就 flow 改字段。 |
| Step 9 SOP、详细设计书写规范 §5.8 | 单 flow 固定结构、ASCII、伪代码、事务/错误/副作用/测试/停审 | 本文件是 calibration，不是实现。 |

### 2.3 非目标

- 不定义 Step 10 的完整状态转换矩阵、Step 11 的物理持久化/锁/atomic primitive、Step 12 的错误码全集或 Step 13 的 retry/backoff 参数。
- 不选择 Rust、Tauri、Electron、Docker、gVisor、Firecracker、数据库、文件布局、scheduler、IPC、CLI 或进程模型。
- 不将 semantic port carrier 冒充现有 SDK DTO，不解除 `RUN-UP-001~008`、`RUN-DDD-001~003`。
- 不创建 outbound event/outbox/publisher/topic，不把 trace、本地日志、receipt、job report 升格为 evidence/audit truth。
- 不实现代码、不执行测试、不创建 implementation ledger/skeleton、不修改正式 `03-详细设计.md`、不提交 commit。

## 3. 分批写入计划

| 批次 | Flow 族 | 内容 | 状态 |
|---|---|---|---|
| 9.0 | shared discipline | inventory、entry/idempotency/UoW/query/consumer/job 模板、错误和无 event 规则 | [x] |
| 9.1-a | selection/material Command | `FLOW-C01~C06` | [x] |
| 9.1-b | lifecycle/recovery/handoff Command | `FLOW-C07~C11` | [x] |
| 9.2-a | context/selection/material Query | `FLOW-Q01~Q05` | [x] |
| 9.2-b | lifecycle/resource/recovery Query | `FLOW-Q06~Q08` | [x] |
| 9.2-c | preview/diagnosis/handoff/read-model Query | `FLOW-Q09~Q12` | [x] |
| 9.3 | planned Consumer | `FLOW-E01~E04`，只闭合当前负向可达路径 | [x] |
| 9.4 | outbound | 0 个，no-residue 审计 | [x] |
| 9.5 | Operations Job | `FLOW-J01~J05` | [x] |
| 9.6 | final audit | 32/32 停审、跨 flow transaction/state/idempotency/phase audit | [x] |

模块执行纪律：每条 flow 按“问题回答 → 诊断 → 取舍 → 调用图 → 伪代码 → 事务/错误/副作用/测试 → 单 flow 停审”完成；同一批上一条未停审，不进入下一条。共享模板只消除机械重复，不替代任一独立 flow。

## 4. SOP 问题回答

| 问题 | 本仓答案 |
|---|---|
| 哪些协议必须有独立 flow？ | 11 Command、12 Query、4 planned Consumer、5 Job，共 32 条；Outbound Event 为 0，做独立 no-residue 审计。 |
| 如何分批？ | 先 Command，后 Query，再 Consumer、Outbound、Job；每族按 Step 8 业务模块顺序。 |
| 入口在哪里？ | GUI/CLI/product shell 经 `RunnerEntryDispatchPort`；planned owner item 经 `RunnerWorkerDispatchPort`；显式 scheduler/operator 经 `RunnerOperationsDispatchPort`。 |
| DTO 在哪里校验/映射？ | entry 先校验 finite union variant/name/body、actor/metadata；application 再逐字段映射 public binding/ref 为 domain/application carrier，禁止 generic map/ref string parsing。 |
| 字段缺失怎么办？ | owner call 前返回 stored typed `Rejected/Conflict`；若外部副作用已可能发生则必须 `Unknown + RecoveryCase`，不能伪装 rollback。 |
| port 是否足够？ | Step 7 已覆盖主要读写面；Step 9 开工已修 outcome envelope。后续若发现缺函数，先回写 Step 6/7并编号。 |
| 事务边界？ | UoW 只包 Runner local writes。外部 read/submission/transfer/verify/redaction/probe 全在 UoW 外；有副作用 command/job 采用短事务 A → external call → 短事务 B/readback。 |
| duplicate 怎么处理？ | same key/name/digest 且 Completed：读取原完整 stored surface，标 `DuplicateReplayed` 并返回；绝不重跑 domain transition、owner call、transfer、verify、release 或 job scan。 |
| 状态/事件副作用？ | 只改变 Runner-owned object/technical state或 safe projection；当前无 Runner outbound event、outbox、publisher、topic。 |
| 每条至少测试什么？ | happy/blocked path、invalid input或state、version/basis conflict、duplicate replay、unknown/readback、禁止副作用；Query另测no-write，Consumer另测no-parse。 |

## 5. Flow inventory

### 5.1 Command inventory

| ID | Flow | 入口函数 | 主要对象 | 外部 I/O | Step 10 候选 |
|---|---|---|---|---|---|
| `FLOW-C01` | `SelectReleaseFlow` | `select_release` | context/generation/selection | context + authority read | `SelectionState`、idempotency/entry |
| `FLOW-C02` | `InvalidateSelectionFlow` | `invalidate_selection` | selection/cache/integrity/run/recovery | none | selection/material/integrity/run/recovery |
| `FLOW-C03` | `RequestMaterialAcquisitionFlow` | `request_material_acquisition` | selection/task | authority read/readiness | selection/acquisition |
| `FLOW-C04` | `PauseAcquisitionFlow` | `pause_acquisition` | task | none | `AcquisitionState` |
| `FLOW-C05` | `ResumeAcquisitionFlow` | `resume_acquisition` | task/selection | authority + source read | acquisition/recovery |
| `FLOW-C06` | `CancelAcquisitionFlow` | `cancel_acquisition` | task | cancellation observation only | acquisition/recovery |
| `FLOW-C07` | `RequestRunFlow` | `request_run` | selection/cache/integrity/guard/run/recovery | authority/platform/Sandbox | run/recovery |
| `FLOW-C08` | `RequestRunControlFlow` | `request_run_control` | run/control/projection/recovery | Sandbox/Runtime reads + Sandbox submit | control/recovery |
| `FLOW-C09` | `RequestCleanupFlow` | `request_cleanup` | control/guard/cache/recovery | protection/cleanup/cache release | control/protection/cache/recovery |
| `FLOW-C10` | `OpenManualReviewFlow` | `open_manual_review` | recovery | none | recovery |
| `FLOW-C11` | `RequestDiagnosticHandoffFlow` | `request_diagnostic_handoff` | diagnosis/handoff/recovery | redaction validation + handoff | handoff/recovery |

### 5.2 Query inventory

| ID | Flow | 入口函数 | 读取源 | 写入 | Step 10 候选读取 |
|---|---|---|---|---|---|
| `FLOW-Q01` | `ResolveRunnerContextFlow` | `resolve_runner_context` | context port + optional local context | none | visibility/freshness |
| `FLOW-Q02` | `ListSelectableReleasesFlow` | `list_selectable_releases` | authority safe page | none | authority read postures |
| `FLOW-Q03` | `GetSelectionPostureFlow` | `get_selection_posture` | selection + visibility/safe authority section | none | selection |
| `FLOW-Q04` | `GetMaterialPreparationFlow` | `get_material_preparation` | task/cache/integrity | none | acquisition/integrity/cache |
| `FLOW-Q05` | `GetCacheProtectionFlow` | `get_cache_protection` | cache + guard | none | cache/candidate/protection |
| `FLOW-Q06` | `GetRunLifecycleFlow` | `get_run_lifecycle` | run/control/owner projection | none | run/control/owner axes |
| `FLOW-Q07` | `GetResourceCleanupViewFlow` | `get_resource_cleanup_view` | committed safe resource/guard/recovery section | none | resource/protection/recovery |
| `FLOW-Q08` | `GetRecoveryCaseFlow` | `get_recovery_case` | recovery | none | recovery |
| `FLOW-Q09` | `GetOutputPreviewFlow` | `get_output_preview` | preview | none | safe presentation axes |
| `FLOW-Q10` | `GetFailureDiagnosisFlow` | `get_failure_diagnosis` | diagnosis | none | diagnosis certainty/next step |
| `FLOW-Q11` | `GetHandoffPostureFlow` | `get_handoff_posture` | handoff | none | handoff |
| `FLOW-Q12` | `GetRunnerReadModelFlow` | `get_runner_read_model` | committed safe sections | none | connectivity/read availability |

### 5.3 Consumer / outbound / Job inventory

| ID | Flow | 当前可达结果 | 写入边界 | 状态 |
|---|---|---|---|---|
| `FLOW-E01` | `ConsumeReleaseAuthorityChangeFlow` | Blocked/Unsupported/Rejected/Quarantined；stored Duplicate only | 当前不解析、不 apply | planned/blocked |
| `FLOW-E02` | `ConsumeSandboxLifecycleChangeFlow` | 同上 | 当前不解析、不 apply | planned/blocked |
| `FLOW-E03` | `ConsumeRuntimeStatusChangeFlow` | 同上 | 当前不解析、不 apply | planned/blocked |
| `FLOW-E04` | `ConsumeHandoffChangeFlow` | 同上 | 当前不解析、不 apply | planned/blocked |
| n/a | Runner Outbound Event | 0 | 无 event/outbox/publisher/topic | not applicable |
| `FLOW-J01` | `AcquireAndVerifyMaterialJobFlow` | Completed/Partial/Blocked/Failed/Unknown/Duplicate | task/cache/integrity/checkpoint/report | positive ports blocked |
| `FLOW-J02` | `EvaluateCacheEvictionJobFlow` | 同上 | candidate/guard/checkpoint/report；不 delete | logic closed/physical blocked |
| `FLOW-J03` | `ReconcileRunnerStateJobFlow` | 同上 | recovery/safe projection/report；不 owner mutation | positive reads blocked |
| `FLOW-J04` | `RefreshSafeDiagnosisJobFlow` | 同上 | preview/diagnosis/report | positive reads blocked |
| `FLOW-J05` | `RefreshVisibleSourcesJobFlow` | 同上 | generation-matched safe sections/report | positive reads blocked |

## 6. Shared entry、DTO 与错误纪律

### 6.1 Command entry

```text
[RunnerEntryDispatchPort.dispatch_command]
  | validate finite RunnerCommandRequest variant == command_name == body type
  | RunnerCommandEntry.receive(...)
  | call begin_validation()
  | call assert_metadata_complete()
  | call begin_dispatch()
  | call to_operation_context()
  v
[RunnerCommandApplicationService.<method>]
  | validate operation/channel + public DTO invariants
  | construct finite RunnerStableOperationInput variant
  | canonical digest; enter idempotency/UoW flow
  v
[RunnerCommandOutcome<T> -> RunnerHandlerResult]
  | call entry.complete(&handler_result) after safe result construction
```

Entry validation failure calls `RunnerCommandEntry.reject(...)` and never reserves idempotency or calls a repository/owner port. Application `RunnerContractError` before any external side effect maps to typed `Rejected` or `Conflict`; infrastructure corruption/contract-programming faults remain `ApplicationError` and must not be classified from strings.

### 6.2 Query entry

```text
[RunnerEntryDispatchPort.dispatch_query]
  | validate finite RunnerQueryRequest variant == query_name == body type
  | RunnerQueryEntry.receive(...)
  | call begin_validation()
  | call assert_query_metadata_complete() + assert_no_idempotency()
  | call begin_dispatch() + to_operation_context()
  v
[RunnerQueryApplicationService.<method>]
  | call context.assert_query_no_write()
  | resolve canonical read subject + visibility
  | read committed local/safe source
  | assemble RunnerQueryResponse<T> / RunnerPageResponse<T>
  v
[RunnerHandlerResult.query_surface]
  | call entry.complete(&handler_result) after safe surface construction
```

Query validation/visibility failure is body-free and no-write. `body=None/items=[]` with an explicit surface is distinct from an empty successful body; no query may reserve idempotency, begin a UoW, save, refresh, reconcile, transfer, verify, probe, cleanup or submit handoff.

### 6.3 Public/application/domain mapping

| Boundary | 必须显式转换 | 禁止 |
|---|---|---|
| public operation/result refs | `RunnerProtocol*` ↔ application `RunnerOperationName`/`RunnerApplicationResultRef` | 复制内部 string、prefix parsing |
| public local refs | Step 6 §7.1.1 `from_persisted_id/to_persisted_id` | 生成第二 identity |
| selection/material binding | `RunnerSelectionBinding`/`RunnerQualifiedMaterialBinding` → domain binding，逐字段比较 | serialize domain object 或 drop generation/digest/authority |
| page | `RunnerPageRequest` ↔ `RunnerRepositoryPage`，应用 limit gate | cursor 充当 version/source order |
| source/read result | `RunnerSemanticRead<T>` → public surface/body | Stale/Restricted/Unsupported 映射成 current/empty success |
| issues | domain/application/adapter typed reason → redacted protocol issue ref | raw exception、SDK body、URL、path、token、stack |

## 7. Shared Command idempotency、事务与 result storage

### 7.1 Reservation / duplicate gate

```rust
// [RunnerOperationContext.assert_write_metadata_complete()]
context.assert_write_metadata_complete()?;

// [RunnerCanonicalDigestPort.digest_write_input(RunnerOperationName, RunnerStableOperationInput)]
let digest = canonical_digest.digest_write_input(context.operation_name, stable_input)?;

// [RunnerIdempotencyRepository.get(RunnerOperationIdempotencyKey)]
match idempotency_repository.get(context.idempotency_key).await? {
    Some(versioned) if versioned.value.matches(context.channel, context.operation_name, digest) => {
        // Completed: get_command_result(result_ref), replay exact stored outcome.
        // Reserved/unknown: return typed Unknown/InProgress; never execute the operation again.
    }
    Some(versioned) => {
        // Return typed Conflict. Only a still-Reserved record may be marked Conflict by
        // RunnerIdempotencyRecord.mark_conflict(...) + repository.mark_conflict(...).
    }
    None => {
        // tx R: RunnerIdempotencyRecord.reserve(...) + repository.reserve(Absent) + commit.
    }
}
```

Completed 但 stored surface 缺失是 local consistency unknown：建立/关联 recovery 后返回 `Unknown`，不得重跑。Duplicate replay 保留原 `result_ref`、trace 和 outcome；只把 public replay marker映射为 `DuplicateReplayed`。

### 7.2 纯本地 Command

纯本地 transition 在 reservation 已 durable 后使用一个短 UoW：versioned read → domain transition → save Exact(version) → 创建完整 `RunnerStoredCommandResult`/shell → `save_command_result` → `RunnerIdempotencyRecord.complete` → `RunnerIdempotencyRepository.complete` → commit。任一 local write/version failure rollback；没有 outbound event/outbox/业务 audit append。

### 7.3 带 external read 的 Command

External read 永远在 UoW 外。读取结果只作为候选 basis；写事务内必须重新读取 local version/binding并比较。Stale/Restricted/Unavailable/Unsupported 映射为 stored typed rejection/blocked posture，不用历史 cache 补 Current。

### 7.4 带 external side effect 的 Command

```text
[idempotency reservation durable]
  v
[Local tx A]
  | re-read versions/basis
  | create persisted intent in pre-call state
  | commit
  v
[External port call -- no local UoW]
  | one call under exact operation/basis
  +-- explicit outcome --> [Local tx B: apply typed outcome + store result + complete]
  +-- ambiguous/crash --> [Local tx B/readback: Unknown + RecoveryCase + store result + complete]
```

若 tx A commit 结果未知，不得调用 external port；先 readback reservation/intent。若 external call 后 tx B commit 结果未知，不得重发；按 result/idempotency/owner readback收敛。具体 durability与 crash algorithm留 Step 11/13，但顺序不可改变。

### 7.5 Stored result 完成顺序

`result_ref` 由 `RunnerIdGeneratorPort.new_application_result_id()` 构造 application ref，再显式映射为 public ref。终态本地事务中必须按以下逻辑顺序：保存 domain/technical object → 构造 typed public outcome → `StoredRunnerOperationResult::from_surface` → `StoredRunnerResultRepository.save_command_result` → `RunnerIdempotencyRecord.complete` → `RunnerIdempotencyRepository.complete` → commit。这里不是新 helper；每条 flow 必须回指这些现有函数。

## 8. Shared Query read discipline

| 阶段 | 调用 | 结果/禁止 |
|---|---|---|
| entry | query entry validation/context | no idempotency/no UoW |
| subject | pure locator mapper + `ContextReadPort.resolve_read_visibility` | 不从 route/ref string/body猜 scope |
| denied | `RunnerReadVisibilityDecision.response_surface` | body None/items empty；不读隐藏对象存在性 |
| visible | object/read-section/authority read | committed data only；不 refresh |
| assemble | explicit domain/application → public mapper | 保留 source/freshness/visibility/degraded/page |
| return | query/page response + handler surface | 不存 result、不 append trace/audit/event |

所有 Query 测试 double 必须记录调用：`begin/reserve/save/external mutation` 调用次数恒为 0。

## 9. Shared planned Consumer blocked-first discipline

```text
[RunnerWorkerDispatchPort.check_readiness]
  | inspect header framing only: source family + schema version + optional ids
  +-- Blocked/Unsupported --> construct body-free receipt/result; STOP
  +-- Ready -------------> currently unreachable; Step 8 reopen required before parse
```

当前四类 flow 不调用 `dispatch_validated`、consumer facade、canonical payload digest、idempotency repository、applied marker repository、projection repository或 domain transition。若历史上已有完整 stored receipt，可按 header/dedup identity读取并 replay `Duplicate`；不能为制造 duplicate 而解析 payload。Quarantine 只可保存 opaque item/header ref和 issue，不可将 payload bytes写入 Runner state store。

## 10. Shared Operations Job orchestration

```text
[RunnerOperationsDispatchPort.dispatch_job]
  | validate finite request/job_kind + registry enabled
  | RunnerOperationsJobEntry.from_metadata(...)
  | canonical digest + idempotency lookup
  +-- Completed duplicate --> get_job_report; no claim/no facade/no scan
  v
[Local tx J-A]
  | reserve idempotency if absent
  | save entry Registered(Absent)
  | create/save RunnerJobClaim Claimed(Absent)
  | validate checkpoint.assert_resumable(current basis)
  | entry.mark_running(); save Exact(version); commit
  v
[RunnerJobApplicationService.<method>]
  | bounded reads/external work outside UoW
  | each checkpoint/local state update in short versioned UoW
  v
[Local tx J-Z]
  | close checkpoint/release claim when safe
  | build RunnerJobReportAssembly.finish(...)
  | entry.mark_completed(&report) or mark_failed/mark_unknown
  | save report + operations result + complete idempotency
  | commit
```

Claim/checkpoint unknown opens RecoveryCase and produces `Unknown`; no worker blindly reclaims or repeats a possibly executed external effect. A report disposition describes local job work only and never maps to approved、running、cleaned、evidence、verdict或signoff。

Job terminal mapping必须逐variant固定：report `Completed -> RunnerJobDisposition::Completed`、`Partial -> Partial`、`Blocked -> Blocked`、`Failed -> Failed`、`Unknown -> Unknown`；`DuplicateReplayed`只来自same-key/same-digest完整stored report，`Rejected`只来自pre-execution validation/registry gate。不得把可信Blocked report压成Partial/Failed，或因entry `Completed`把任一report升级为业务成功。

## 11. Shared error mapping and test discipline

| Source | Protocol/result mapping | State/write rule |
|---|---|---|
| malformed union/metadata/one-of | entry `Rejected` | no reservation/no write/no port |
| domain precondition/visibility/readiness | typed `Rejected`/Blocked/NotVisible | may store command result after reservation；no dangerous port |
| expected local version/generation/basis mismatch | `Conflict` | rollback candidate write；never overwrite |
| explicit owner rejection | typed `Rejected` plus local intent rejected where one was durably submitted | no success projection |
| stale/restricted/unavailable/unsupported read | degraded/rejected/blocked surface | fail closed；no fallback private API/cache truth |
| ambiguous external effect | `Unknown + RecoveryCase` | persist freeze；only read-only reconciliation |
| local store corruption/atomicity unavailable | `ApplicationError` or storage-unknown surface | no fallback in-memory/file store；no external call |

每条 flow 的测试切口均是未来测试设计接口，不是测试已执行声明。公共必测断言：external call不在UoW；duplicate无副作用；raw body/secret不落 store；任何 `Accepted` 不跨轴升级；无 outbound event/outbox调用。

## 12. Outbound Event 全局不适用规则

Step 9 不定义 outbound append/publish flow。任何 Command、Consumer、Job 的“状态/事件副作用”字段中，event 均必须写 `none`。若未来出现消费者需求，必须回退 00/01/02 和 Step 7/8，而不是在本 Step 新增 local event、outbox、publisher、topic或payload snapshot。

## 13. Command batch 9.1-a：selection / material

### 13.1 `FLOW-C01 SelectReleaseFlow`

#### 13.1.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerCommandRequest::SelectRelease` → `RunnerCommandApplicationService.select_release(context, input)` |
| DTO | `SelectReleaseInput`；exact scope/platform/release/version/change cause |
| 目标 | 建立可信 local context、单调 successor generation 与 exact selection；正式 authority 只决定 local `SelectionState`，不创建 approval/baseline truth |
| Step 6 | `RunnerContextRef::from_resolution`、`assert_usable`；`SelectionGeneration::initial/next`；`ReleaseSelection::select/begin_authority_check/bind_authority/mark_authority_*` |
| Step 7 | context/selection/idempotency/result repos、UoW、clock/id/digest/readiness、`ContextReadPort`、`ReleaseAuthorityReadPort` |
| 状态候选 | `SelectionState: Selected -> Checking -> Current/Stale/Blocked`；entry/idempotency |
| 当前 blocker | `RUN-UP-001/002/008` 使 exact authority positive adapter blocked；必须得到 stored blocked/rejected surface，不能伪造 Current |

DTO 构造诊断与取舍：`requested_scope_ref/release_ref/version_ref/change_cause` 直接进入 stable digest；`platform_ref`进入 context resolution。`context_id`、`selection_id`由 id generator产生，generation由 repository allocator产生，authority ref只来自正式 assessment。因为 authority query需要已经分配的 generation，本 flow采用 durable local tx A 先保存 `Checking` selection，再事务外读取 authority，最后 tx B 收敛；不得把网络 read 包进 generation allocation事务。

#### 13.1.2 函数级调用图

```text
[RunnerEntryDispatchPort.dispatch_command]
  | validate SelectRelease variant/name/body + actor/metadata
  | reserve idempotency (§7.1)
  v
[ContextReadPort.resolve_context -- outside UoW]
  | Current + usable only
  v
[Local tx A]
  | find_current_for_actor_scope + find_current_for_context
  | allocate_next_generation(expected_current)
  | RunnerContextRef::from_resolution / assert_usable
  | ReleaseSelection::select -> begin_authority_check
  | save context + selection; invalidate previous selection if UserChange
  | commit
  v
[ReleaseAuthorityReadPort.assess_exact_release -- outside UoW]
  v
[Local tx B]
  | re-read selection Exact(version) + assert same binding/generation
  | bind_authority OR mark_authority_stale/blocked
  | save selection + stored outcome + complete idempotency
  | commit
  v
[RunnerCommandOutcome<ReleaseSelectionResult>]
```

#### 13.1.3 关键伪代码

```rust
// [ContextReadPort.resolve_context(RunnerContextResolutionQuery)]
let resolved = context_read.resolve_context(RunnerContextResolutionQuery {
    actor_context: context.actor_context,
    requested_scope_ref: Some(input.requested_scope_ref),
    platform_ref: input.platform_ref,
}).await?; // outside UoW

let resolution = require_current_visible_context(resolved)?; // typed outcome mapping, not fallback
let now = clock.now().await?;

// [RunnerUnitOfWorkManager.begin()]
let tx_a = uow_manager.begin().await?;
let prior = selection_repository.find_current_for_context(local_context_id).await?;
let number = selection_repository
    .allocate_next_generation(local_context_id, prior_generation(prior), tx_a.as_ref()).await?;

// [RunnerContextRef::from_resolution(...)]
let local_context = RunnerContextRef::from_resolution(
    chosen_or_new_context_id, resolution.actor_ref, resolution.session_ref,
    resolution.project_ref, resolution.scope_ref, resolution.platform_ref,
    resolution.freshness, resolution.visibility,
)?;
local_context.assert_usable(&input.requested_scope_ref)?;

// [SelectionGeneration::initial/next(...)]
let generation = build_generation_from_repository_number(prior.as_ref(), number, input.change_cause, now)?;
// [ReleaseSelection::select(...)]
let mut selection = ReleaseSelection::select(
    ids.new_selection_id(), local_context, input.release_ref,
    input.version_ref, input.requested_scope_ref, generation,
)?;
// [ReleaseSelection::begin_authority_check()]
selection.begin_authority_check()?;
context_repository.save(selection.context_ref, context_expected_version, tx_a.as_ref()).await?;
selection_repository.save(selection, RunnerExpectedVersion::Absent, tx_a.as_ref()).await?;
uow_manager.commit(tx_a).await?;

// [ReleaseAuthorityReadPort.assess_exact_release(ReleaseAuthorityQuery)]
let assessment = authority.assess_exact_release(exact_query_from_persisted_selection).await?;

// [ReleaseSelectionRepository.get(RunnerSelectionId)]
let tx_b = uow_manager.begin().await?;
let mut current = require_exact_selection(selection_repository.get(selection_id).await?)?;
current.value.assert_binding(&input.release_ref, &input.version_ref, &input.requested_scope_ref, &generation)?;
match assessment {
    RunnerSemanticRead::Current { value, .. } if value.proves_approved_baselined_active_for_exact_binding() =>
        current.value.bind_authority(value.authority_ref, value.freshness)?,
    RunnerSemanticRead::Stale { .. } =>
        current.value.mark_authority_stale(SelectionInvalidation::SourceUnavailable)?,
    RunnerSemanticRead::Restricted { .. }
    | RunnerSemanticRead::Unavailable { .. }
    | RunnerSemanticRead::Unsupported { .. }
    | RunnerSemanticRead::Current { .. } =>
        current.value.mark_authority_blocked(mapped_selection_invalidation)?,
}
selection_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx_b.as_ref()).await?;
// Execute §7.5 using RunnerStoredCommandResult::SelectRelease(outcome), then commit tx_b.
```

`require_current_visible_context`、`prior_generation`、`build_generation_from_repository_number` 与 `proves_approved_baselined_active_for_exact_binding` 在上段只是逐字段 mapping/guard 的可读伪代码标签，不新增 port/repository/domain method；实现必须内联或落到纯 mapper/policy，不能用 generic map或本地 approval boolean。

#### 13.1.4 事务边界

| 边界 | 内容 | 回滚/未知 |
|---|---|---|
| reservation tx | idempotency reserve only | unknown readback；不进入 context/authority read |
| tx A | context/selection generation fence、previous selection invalidation、new `Checking` selection | commit不明时按 idempotency/context/selection readback；不得再次 allocate后覆盖 |
| external | context与authority read | 无 local UoW；只读可重试仍受原 operation，不产生 owner mutation |
| tx B | apply assessment、save complete public outcome、complete idempotency | version conflict返回Conflict；commit不明先readback，不重复创建selection |

`UserChange` 时 prior selection必须在 tx A调用 `invalidate(..., new generation)`；旧 material/intent不需要靠全量同步 rewrite 才能被阻止，因为所有 side-effect gate比较 immutable generation。显式 fan-out由 `FLOW-C02`承担；本 flow不得在无分页输入时发明无界扫描。

#### 13.1.5 错误映射

| 条件 | 结果 |
|---|---|
| implicit/empty/mutable selector、actor/scope mismatch、非法 cause | stored `Rejected(InvalidInput/StaleBasis)`；无 selection |
| context stale/restricted/unavailable/unsupported | stored `Rejected(VisibilityDenied/DependencyUnavailable/UnsupportedContract)`；无 tx A |
| current generation/expected basis changed | stored `Conflict`；不覆盖新selection |
| authority not approved/baselined/active或exact binding mismatch | local selection `Blocked/Stale` + Accepted local result，或在无可信local commit前 Rejected；绝不 Current |
| storage result/version unknown | `Unknown + RecoveryCase` where identity exists；不重分配generation |

#### 13.1.6 状态与事件副作用

- Runner local：new context（若不存在）、successor generation、new selection；prior selection可变为 `Invalidated`。
- `Current`只在 formal assessment同 binding、current、visible、approved、baselined、active时成立；仍非 material qualified/run allowed。
- trace仅保留 operation correlation；无 formal audit evidence。
- outbound event/outbox/publisher/topic：`none`。

#### 13.1.7 测试切口与停审

| 测试/审查项 | 预期 |
|---|---|
| exact initial selection | initial generation，`Checking -> Current`仅由 qualifying assessment触发 |
| user changes selection | monotonic successor；prior invalidated；old binding不能过任何 side-effect gate |
| authority blocked/stale | local posture精确保留；无历史cache fallback |
| concurrent selection | expected generation/version conflict；只一个successor提交 |
| duplicate | replay original result/ref；不resolve context、不read authority、不allocate generation |
| DTO/object/port/transaction/event | closed；只调用 Step 6/7已定义接缝，event none |

停审结论：`FLOW-C01` `pass_for_logic_with_upstream_blockers`。

### 13.2 `FLOW-C02 InvalidateSelectionFlow`

#### 13.2.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerCommandRequest::InvalidateSelection` → `invalidate_selection(context, input)` |
| 目标 | 在 generation fence 上失效 exact selection，并使旧 generation 的材料/完整性/运行意图不能继续；不修改或撤销 owner truth |
| Step 6 | `SelectionGeneration::next`、`ReleaseSelection::invalidate`、`MaterialCacheEntry.mark_stale`、`IntegrityPosture.invalidate`、`RunIntent.invalidate`、`RecoveryCase::freeze` |
| Step 7 | selection/task/cache/integrity/run/recovery repos、UoW、clock/id/result/idempotency |
| 外部 I/O | none |
| 状态候选 | selection、material、integrity、run、recovery |

取舍：first transaction只建立不可逆的 local generation fence并失效 selection；随后按 repository page做多个短事务传播。这样旧对象即使尚未逐条改写，也因 generation mismatch不能通过 side-effect gate。若传播中断，返回 `Unknown`并以 RecoveryCase冻结，而不是回滚已经提交的 generation fence或谎称全量完成。

#### 13.2.2 函数级调用图

```text
[Command service + idempotency]
  | load exact versioned selection; compare expected_generation/reason
  v
[Local tx A: generation fence]
  | allocate_next_generation
  | SelectionGeneration::next
  | ReleaseSelection.invalidate
  | save selection Exact(version); commit
  v
[Bounded local propagation loop]
  | list task by selection + cache/run intent pages for old generation
  | per page tx: cancel/freeze active tasks; mark cache/integrity stale; invalidate run intents
  | ambiguous submitted intent -> RecoveryCase.freeze
  v
[Terminal local tx]
  | save complete result + complete idempotency
  | commit
```

#### 13.2.3 关键伪代码

```rust
let loaded = require_selection(selection_repository.get(input.selection_id).await?)?;
if loaded.value.generation.value != input.expected_generation {
    return stored_conflict_without_mutation;
}
let now = clock.now().await?;

// [RunnerUnitOfWorkManager.begin()]
let tx_a = uow_manager.begin().await?;
let number = selection_repository.allocate_next_generation(
    loaded.value.context_ref.context_id,
    Some(input.expected_generation),
    tx_a.as_ref(),
).await?;
// [SelectionGeneration::next(...)]
let successor = SelectionGeneration::next(&loaded.value.generation, number, mapped_cause(input.reason), now)?;
// [ReleaseSelection::invalidate(SelectionInvalidation, SelectionGeneration)]
let mut selection = loaded.value;
selection.invalidate(input.reason, successor)?;
selection_repository.save(selection, RunnerExpectedVersion::Exact(loaded.version), tx_a.as_ref()).await?;
uow_manager.commit(tx_a).await?;

// Each list is bounded; each item is re-read/version-checked before save.
for task in task_repository.list_by_selection(input.selection_id, page).await?.items {
    let tx = uow_manager.begin().await?;
    if task.value.state_allows_local_invalidation() {
        // [AcquisitionTask::cancel(AcquisitionCancelReason)]
        task.value.cancel(mapped_invalidation_cancel_reason)?;
        task_repository.save(task.value, RunnerExpectedVersion::Exact(task.version), tx.as_ref()).await?;
    }
    // Any possibly in-flight/unknown transfer is associated with RecoveryCase::freeze(...).
    uow_manager.commit(tx).await?;
}
for cache in cache_repository.list_by_selection_generation(input.expected_generation, page).await?.items {
    let tx = uow_manager.begin().await?;
    // [MaterialCacheEntry::mark_stale(MaterialInvalidationReason)]
    cache.value.mark_stale(mapped_material_reason)?;
    cache_repository.save(cache.value, RunnerExpectedVersion::Exact(cache.version), tx.as_ref()).await?;
    if let Some(posture) = integrity_repository.find_current_for_cache_entry(cache.value.cache_entry_id).await? {
        // [IntegrityPosture::invalidate(IntegrityInvalidation)]
        posture.value.invalidate(mapped_integrity_reason)?;
        integrity_repository.save(posture.value, RunnerExpectedVersion::Exact(posture.version), tx.as_ref()).await?;
    }
    uow_manager.commit(tx).await?;
}
for intent in run_repository.list_by_selection_generation(input.expected_generation, page).await?.items {
    let tx = uow_manager.begin().await?;
    // [RunIntent::invalidate(BindingMismatch)]
    intent.value.invalidate(BindingMismatch::GenerationMismatch)?;
    run_repository.save(intent.value, RunnerExpectedVersion::Exact(intent.version), tx.as_ref()).await?;
    // Accepted/Unknown owner request => RecoveryCase::freeze(...), saved in the same tx.
    uow_manager.commit(tx).await?;
}
// Terminal tx follows §7.5 with RunnerStoredCommandResult::InvalidateSelection(outcome).
```

Task records remain bound to old generation and are rejected by `assert_binding`; if their transfer has possible in-flight effects, application includes them in RecoveryCase subjects. Repository pages continue until `next_cursor=None`; cursor is list position only, never generation/version.

#### 13.2.4 事务边界与错误映射

| 场景 | 行为 |
|---|---|
| selection missing / actor not visible | Rejected；不allocate generation |
| generation mismatch / already invalidated with different cause | Conflict；不rewrite current generation |
| tx A fails before commit | rollback；no propagation |
| tx A commit unknown | result Unknown/readback；不allocate another successor |
| later page version conflict | retry only that pure local item after fresh read within same operation budget；不能越过 new generation；无法收敛则 RecoveryCase + Unknown |
| accepted/unknown owner request in old intent | local intent invalidated + RecoveryCase；不发 cancel/revoke owner call |

#### 13.2.5 状态、副作用、测试与停审

- 状态：selection→Invalidated；matching cache→Stale；integrity→Stale/Invalid/Blocked按 typed reason；run intent→Invalidated；ambiguous owner effects→RecoveryCase Frozen。
- 不删除 cache bytes、不释放 protection、不修改 owner Release/Governance/Sandbox/Runtime truth。
- outbound event/outbox：`none`。
- 测试：missing/mismatch；generation fence先于fan-out；多页稳定遍历；item version conflict；accepted intent recovery；duplicate无scan；old binding立即不能过gate。

停审结论：DTO、domain methods、repository pages、short-UoW ordering、partial propagation recovery和no-owner-write均闭合；`FLOW-C02` `pass_for_logic`。

### 13.3 `FLOW-C03 RequestMaterialAcquisitionFlow`

#### 13.3.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerCommandRequest::RequestMaterialAcquisition` → `request_material_acquisition(context, input)` |
| 目标 | 为 exact current selection建立一个 persisted `AcquisitionTask::Absent`；下载/locator resolution/verification/promotion只由 `FLOW-J01`承担 |
| Step 6 | `ReleaseSelection.assert_binding/can_prepare_material`、`AcquisitionTask::start` |
| Step 7 | selection/task repos、authority read、adapter readiness、id/digest/UoW/result/idempotency |
| 状态候选 | task `Absent`；selection只读 |
| 当前 blocker | authority/material positive seam受 `RUN-UP-001/002/008`；blocked时不得创建 runnable task |

取舍：Command不调用 `MaterialSourcePort.resolve_source`，因此 result中的 `locator_ref=None`。这避免把 locator read、download或transfer藏在同步入口，也避免 `bind_source`误把未开始传输标成 `Transferring`。Job稍后调用 `begin_resolution`。

#### 13.3.2 函数级调用图

```text
[Command service + idempotency]
  | map RunnerSelectionBinding -> SelectionBinding
  | load selection + assert exact binding/current/context scope
  v
[Adapter readiness + ReleaseAuthorityReadPort.revalidate_authority -- outside UoW]
  | require Current/exact/approved/baselined/active
  v
[Local tx]
  | re-read selection Exact(version); assert unchanged
  | AcquisitionTask::start(new id, binding) -> Absent
  | save task Absent + stored result + complete idempotency
  | commit
```

#### 13.3.3 关键伪代码

```rust
let binding = map_public_selection_binding(input.expected_binding)?;
let selected = require_selection(selection_repository.get(input.selection_id).await?)?;
selected.value.assert_binding(
    &binding.release_ref, &binding.version_ref, &binding.scope_ref, &binding.generation,
)?;
if !selected.value.can_prepare_material() { return stored_rejection; }

let source_ready = adapter_registry.get_readiness(RunnerInfraAdapterSlot::MaterialSource).await?;
if source_ready.state != RunnerPortReadiness::Ready { return stored_blocked_rejection; }
// [ReleaseAuthorityReadPort.revalidate_authority(SelectionBinding, AuthoritySnapshotRef)]
let authority_now = authority.revalidate_authority(binding, input.expected_authority_ref).await?;
require_exact_current_authority(authority_now, binding, input.expected_authority_ref)?;

let tx = uow_manager.begin().await?;
let current = require_selection(selection_repository.get(input.selection_id).await?)?;
current.value.assert_binding(...)?; // same fields, checked again inside local commit window
// [AcquisitionTask::start(AcquisitionTaskId, RunnerSelectionId, SelectionBinding)]
let task = AcquisitionTask::start(ids.new_acquisition_task_id(), input.selection_id, binding)?;
task_repository.save(task, RunnerExpectedVersion::Absent, tx.as_ref()).await?;
// Store AcquisitionRequestResult { state: Absent, locator_ref: None } and complete idempotency (§7.5).
uow_manager.commit(tx).await?;
```

#### 13.3.4 事务、错误、状态、副作用

| 条件 | 结果/写入 |
|---|---|
| task ref/binding/authority field malformed | Rejected；no task |
| selection missing/not visible/not Current/context unsafe | Rejected/Blocked；no task |
| generation/binding/authority ref changed | Conflict；no task |
| authority stale/revoked/not approved/not baselined/unsupported | Rejected AuthorityBlocked/Unsupported；no task |
| current + ready | one task `Absent` persisted with `ExpectedVersion::Absent` |
| duplicate | stored result replay；no authority read/no second task |

本 flow不写 locator、不打开 quarantine、不下载、不verify、不创建cache/integrity、不宣称queued worker已运行。Outbound event/outbox：`none`。

#### 13.3.5 测试切口与停审

测试 exact binding success（在Ready fake语义下）、generation mismatch、authority ref drift、adapter Blocked、duplicate、task-id collision、authority read在UoW外、result `Absent/locator=None`、零source/cache/verifier调用。`FLOW-C03` 的对象/port/transaction/error/test闭合，positive runtime仍blocked；停审为 `pass_for_logic_with_upstream_blockers`。

### 13.4 `FLOW-C04 PauseAcquisitionFlow`

#### 13.4.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `PauseAcquisition` → `pause_acquisition(context, AcquisitionControlInput)` |
| discriminator | 必须为 `Pause { reason_ref }` |
| 目标 | exact task/binding的 local `Resolving/Transferring -> Paused`；不声称transport checkpoint、安全停止或材料释放 |
| Step 6/7 | `AcquisitionTaskRef.to_persisted_id`、`AcquisitionTask.pause`、task/idempotency/result repos、UoW |
| 外部 I/O/event | none / none |

#### 13.4.2 调用图与伪代码

```text
[Command service + idempotency]
  | validate Pause discriminator; ref -> persisted id
  | load task Versioned; compare complete binding
  v
[Local tx]
  | re-read task/version
  | AcquisitionTask.pause(mapped reason)
  | save Exact(version)
  | store AcquisitionControlResult + complete idempotency
  | commit
```

```rust
let task_id = input.task_ref.to_persisted_id()?;
let versioned = require_task(task_repository.get(task_id).await?)?;
require_pause_variant_and_matching_binding(&input, &versioned.value.selection_binding)?;
let tx = uow_manager.begin().await?;
let mut current = require_same_versioned_task(task_repository.get(task_id).await?, versioned.version)?;
// [AcquisitionTask::pause(AcquisitionPauseReason)]
current.value.pause(map_pause_reason(input.intent.reason_ref)?)?;
task_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx.as_ref()).await?;
// Store RunnerStoredCommandResult::PauseAcquisition and complete (§7.5).
uow_manager.commit(tx).await?;
```

#### 13.4.3 错误、状态、测试与停审

| 条件 | 结果 |
|---|---|
| wrong discriminator/ref/binding | Rejected；no write |
| task missing/not visible | Rejected without existence leak |
| task already Complete/Failed/Cancelled/Paused | typed state rejection/conflict；不是accepted no-op |
| version changed | Conflict；不覆盖progress/state |
| success | only `AcquisitionState::Paused`；progress可保留 |

测试包含每个非法源状态、binding/generation mismatch、duplicate replay、concurrent job progress update与零external call。Pause不释放sink/cache、不创建checkpoint、不更新integrity/qualification。`FLOW-C04` `pass_for_logic`。

### 13.5 `FLOW-C05 ResumeAcquisitionFlow`

#### 13.5.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `ResumeAcquisition` → `resume_acquisition(context, AcquisitionControlInput)`；discriminator必须 `Resume` |
| 目标 | 在重新证明selection/authority/source transfer basis后，将 local task `Paused -> Transferring`；实际继续transfer仍由Job承担 |
| Step 6 | `ReleaseSelection.assert_binding/can_prepare_material`、`AcquisitionTask.resume`、`RecoveryCase::freeze` |
| Step 7 | task/selection/recovery repos、authority/source ports、UoW/result/idempotency |
| 状态候选 | acquisition/recovery |

#### 13.5.2 函数级调用图

```text
[Command service + idempotency]
  | load Paused task + matching selection
  | assert complete binding
  v
[Authority revalidation + transfer outcome read -- outside UoW]
  | Current authority + Paused/safely resumable same binding required
  +-- Unknown/gap --> RecoveryCase Frozen; stored Unknown; STOP
  v
[Local tx]
  | re-read task + selection/version
  | AcquisitionTask.resume(binding)
  | save task Exact(version) + stored result + complete idempotency
  | commit
```

#### 13.5.3 关键伪代码

```rust
let task_id = input.task_ref.to_persisted_id()?;
let task = require_task(task_repository.get(task_id).await?)?;
let binding = map_public_selection_binding(input.expected_binding)?;
require_resume_variant_and_matching_binding(&input, &task.value.selection_binding)?;
let selection = require_selection(selection_repository.get(task.value.selection_id).await?)?;
selection.value.assert_binding(...)?;

let authority_now = authority.revalidate_authority(binding, selection.value.authority_ref.require()?).await?;
require_exact_current_authority(authority_now, binding, selection.value.authority_ref)?;
// [MaterialSourcePort.read_transfer_outcome(AcquisitionTaskId, SelectionBinding)]
let transfer_now = material_source.read_transfer_outcome(task_id, binding).await?;
if !is_same_binding_paused_or_safely_resumable(transfer_now) {
    // tx: RecoveryCase::freeze(...) + stored Unknown/Rejected; no task.resume().
    return frozen_result;
}

let tx = uow_manager.begin().await?;
let mut current = require_same_versioned_task(task_repository.get(task_id).await?, task.version)?;
let current_selection = require_same_selection(selection_repository.get(selection_id).await?, selection.version)?;
current_selection.value.assert_binding(...)?;
// [AcquisitionTask::resume(&SelectionBinding)]
current.value.resume(&binding)?;
task_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx.as_ref()).await?;
// Store ResumeAcquisition result + complete (§7.5); commit.
```

#### 13.5.4 错误、状态、副作用与测试

| 条件 | 结果 |
|---|---|
| non-Resume、non-Paused、binding mismatch | Rejected/Conflict；no external transfer start |
| selection/authority stale/revoked/unsupported | Blocked/Stale；task stays Paused |
| transfer outcome Unknown/unreadable/mismatched source | `Unknown + RecoveryCase::Frozen`；task stays Paused；不启动第二transfer |
| safe exact basis | local task becomes Transferring；Job later uses checkpoint/basis to perform work |
| duplicate | replay；no authority/source reads |

测试覆盖 stale authority、source mismatch、unknown readback、task/version race、recovery creation、duplicate、external reads outside UoW，以及本 flow对`transfer_to_quarantine`调用次数为0。Event/outbox为none。`FLOW-C05` `pass_for_logic_with_upstream_blockers`。

### 13.6 `FLOW-C06 CancelAcquisitionFlow`

#### 13.6.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `CancelAcquisition` → `cancel_acquisition(context, AcquisitionControlInput)`；discriminator必须 `Cancel { reason_ref }` |
| 目标 | 终止Runner-local取得意图；不证明外部transfer已停止、不删除quarantine/cache、不释放protection |
| Step 6/7 | `AcquisitionTask.cancel`、recovery open-case read、task/recovery/idempotency/result repos、UoW |
| 外部 I/O/event | none / none |

#### 13.6.2 调用图与伪代码

```text
[Command service + idempotency]
  | load task + exact binding
  | find_open_by_subjects(task)
  +-- existing transfer ambiguity --> stored Unknown with recovery ref; STOP
  v
[Local tx]
  | re-read task Exact(version)
  | AcquisitionTask.cancel(mapped reason)
  | save task + stored result + complete idempotency
  | commit
```

```rust
let task_id = input.task_ref.to_persisted_id()?;
let task = require_task(task_repository.get(task_id).await?)?;
require_cancel_variant_and_matching_binding(&input, &task.value.selection_binding)?;
let open = recovery_repository.find_open_by_subjects(
    task_subjects(task_id),
    bounded_first_page_for_recovery_links,
).await?;
if contains_transfer_ambiguity(open) {
    return store_unknown_referencing_existing_case_without_task_transition;
}
let tx = uow_manager.begin().await?;
let mut current = require_same_versioned_task(task_repository.get(task_id).await?, task.version)?;
// [AcquisitionTask::cancel(AcquisitionCancelReason)]
current.value.cancel(map_cancel_reason(input.intent.reason_ref)?)?;
task_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx.as_ref()).await?;
// Store CancelAcquisition result + complete (§7.5); commit.
```

上段 `task_subjects/contains_transfer_ambiguity` 仅表示构造既有 typed `RecoverySubjectRefSet`并检查返回case，不是新repository函数。若没有既有ambiguity，`Cancelled`只表示local intent；正在进行的Job必须在下一checkpoint/cancellation gate观察该状态，不得把此命令当transport ACK。

#### 13.6.3 错误、状态、测试与停审

| 条件 | 结果 |
|---|---|
| wrong discriminator/ref/binding | Rejected |
| Complete/Failed/Cancelled | typed illegal-state rejection；不accepted no-op |
| existing unknown transfer case | `Unknown`并复用case ref；不以Cancelled掩盖 |
| valid Absent/Resolving/Transferring/Paused | local `Cancelled`; no cleanup/release claim |
| version race | Conflict |
| duplicate | exact stored replay；no second transition |

测试必须断言 `MaterialCachePort.release_material`、cache/integrity save、Sandbox/owner port均未调用；取消后material handle如已存在仍受guard。DTO、函数、repository、事务、错误、状态、event none和测试切口闭合；`FLOW-C06` `pass_for_logic`。

### 13.7 Batch 9.1-a 停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| `FLOW-C01~C06` 独立覆盖 | 6/6 | §13.1～§13.6 |
| public DTO→domain mapping | pass | exact binding/ref conversion；无generic selector/map |
| Step 6 method / Step 7 port | pass | 无临时 repository/port method；纯mapper已注明 |
| external I/O vs UoW | pass | context/authority/source read均事务外 |
| duplicate/result storage | pass | shared §7 + per-flow terminal variant |
| state boundary | pass | selected/current、complete/verified、cancel/release均未跨轴 |
| outbound event/outbox | none | 全6条明确none |
| blockers | preserved | C01/C03/C05 positive owner paths继续受 `RUN-UP-001/002/008` |

Batch 9.1-a 完成；下一允许批次为 9.1-b `FLOW-C07~C11`。

## 14. Command batch 9.1-b：lifecycle / recovery / handoff

### 14.1 `FLOW-C07 RequestRunFlow`

#### 14.1.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerCommandRequest::RequestRun` → `request_run(context, RunRequestInput)` |
| 目标 | 在 exact context/selection/material/authority/resource/protection basis 上 durable创建并提交一个 run intent；formal Sandbox acceptance最多得到 `RunIntentState::Accepted` |
| Step 6 | `RunnerContextRef.assert_usable`、`ReleaseSelection.assert_binding`、`IntegrityPosture.assert_qualified`、`ProtectionGuard`只读门禁、`RunIntent::create/mark_submitting/record_receipt/reject/mark_unknown`、`RecoveryCase::freeze` |
| Step 7 | context/selection/cache/integrity/guard/run/recovery repos；authority/platform/Sandbox ports；UoW/id/result/readiness |
| 状态候选 | run intent、recovery、entry/idempotency；owner projection不由ACK升级execution |
| 当前 blocker | `RUN-UP-001~004/007/008`；正向 owner call只能在各slot Ready且exact mapping可证明时发生 |

DTO mapping：`RunnerSelectionBinding`、`RunnerQualifiedMaterialBinding`必须逐字段映射并与 loaded selection/cache/integrity比较；cache/integrity public refs经 nominal conversion定位。`requested_resources`保留typed key/amount/unit，只是请求，不是allocation。`context_id/selection_id`必须分别加载且互相绑定，不能只信body中的复合binding。

#### 14.1.2 函数级调用图

```text
[Command service + idempotency]
  | load context/selection/cache/integrity/guard
  | validate exact cross-object binding and protection
  v
[Authority re-read + platform probe/compatibility -- outside UoW]
  | all required current; conflict/unknown fail closed
  v
[Local tx A]
  | re-read all mutable/local basis
  | RunIntent::create -> Draft
  | RunIntent::mark_submitting -> Submitting
  | save intent Absent; commit
  v
[SandboxRunPort.request_run -- outside UoW]
  +-- Accepted --> [tx B: record_receipt -> Accepted]
  +-- Rejected --> [tx B: reject -> Rejected]
  +-- Conflict --> [tx B: invalidate/recovery + Conflict outcome]
  +-- Unknown --> [tx B: mark_unknown + RecoveryCase Frozen]
  +-- Blocked --> [tx B: reject/blocked local result]
  v
[stored RunRequest outcome + idempotency complete]
```

#### 14.1.3 关键伪代码

```rust
let local_context = require_context(context_repository.get(input.context_id).await?)?;
local_context.value.assert_usable(&input.selection_binding.scope_ref)?;
let selection = require_selection(selection_repository.get(input.selection_id).await?)?;
let selection_binding = map_public_selection_binding(input.selection_binding)?;
selection.value.assert_binding(...selection_binding fields...)?;

let cache_id = input.material_binding.cache_entry_ref.to_persisted_id()?;
let posture_id = input.material_binding.integrity_posture_ref.to_persisted_id()?;
let cache = require_cache(cache_repository.get(cache_id).await?)?;
let integrity = require_integrity(integrity_repository.get(posture_id).await?)?;
let qualified = map_and_cross_check_qualified_material(
    input.material_binding, &cache.value, &integrity.value, &selection.value,
)?;
integrity.value.assert_qualified(&cache.value.source_binding, &input.material_binding.authority_freshness)?;
require_current_non_protected_run_gate(guard_repository.find_by_subject(run_material_subject(cache_id)).await?)?;

let authority_now = authority.revalidate_authority(selection_binding, input.material_binding.authority_ref).await?;
require_exact_current_authority(authority_now, selection_binding, input.material_binding.authority_ref)?;
// [PlatformResourcePort.probe_resources(PlatformResourceProbeQuery)]
let resources = platform.probe_resources(build_bounded_probe(local_context.value.platform_ref, input.requested_resources)).await?;
require_no_current_blocking_conflict(resources)?;

let tx_a = uow_manager.begin().await?;
recheck_all_local_versions_and_bindings(...)?;
// [RunIntent::create(...)]
let mut intent = RunIntent::create(
    ids.new_run_intent_id(), local_context.value, selection_binding,
    qualified, context.command_metadata.require()?,
)?;
// [RunIntent::mark_submitting(RunnerCommandMetadata)]
intent.mark_submitting(context.command_metadata.require()?)?;
run_repository.save(intent, RunnerExpectedVersion::Absent, tx_a.as_ref()).await?;
uow_manager.commit(tx_a).await?;

// [SandboxRunPort.request_run(SandboxRunRequest)]
let owner = sandbox.request_run(build_sandbox_request_from_persisted_intent(...)).await?;
let tx_b = uow_manager.begin().await?;
let mut current = require_run(run_repository.get(run_intent_id).await?)?;
match owner {
    RunnerSubmissionOutcome::Accepted(receipt) =>
        current.value.record_receipt(receipt.request_ref, map_owner_request_receipt(receipt))?,
    RunnerSubmissionOutcome::Rejected(reason) => current.value.reject(map_run_rejection(reason))?,
    RunnerSubmissionOutcome::Conflict(conflict) => {
        current.value.invalidate(map_binding_conflict(conflict))?;
        save_frozen_recovery_for_run(&current.value, tx_b.as_ref()).await?;
    }
    RunnerSubmissionOutcome::Unknown(unknown) => {
        current.value.mark_unknown(map_unknown(unknown))?;
        save_frozen_recovery_for_run(&current.value, tx_b.as_ref()).await?;
    }
    RunnerSubmissionOutcome::Blocked(issue) => current.value.reject(map_blocked_run_reason(issue))?,
}
run_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx_b.as_ref()).await?;
// Save RunnerStoredCommandResult::RequestRun + complete idempotency (§7.5), then commit.
```

纯 mapper标签不新增domain/port方法；`save_frozen_recovery_for_run`展开为 `RecoveryCase::freeze` + `RecoveryCaseRepository.save(Absent)`。

#### 14.1.4 事务、错误、状态与测试

| 条件 | 结果 |
|---|---|
| cross-object id/binding/digest/authority mismatch | Rejected/Conflict before tx A；no Sandbox call |
| cache非Qualified、integrity非Verified、guard Protected/Unknown、resource conflict/unknown | SafetyBlocked；no intent submission |
| tx A commit unknown | readback intent/idempotency；no Sandbox call until Submitting durability proven |
| Sandbox Accepted | `RunIntent::Accepted` + request ref/owner basis；execution仍NotStarted/Unknown，绝不Running |
| owner Rejected/Conflict | intent Rejected/Invalidated + typed result；conflict may freeze recovery |
| owner Unknown or tx B unknown | intent Unknown + RecoveryCase；never auto replay request |
| duplicate | exact stored result；zero authority/platform/Sandbox calls |

状态副作用只包括 Runner intent/recovery；owner projection不由request receipt产生Runtime Running。无 outbound event/outbox。测试覆盖所有gate、resource conflict、tx A/B crash window、owner各outcome、duplicate以及明确断言Accepted响应无running/boundary/terminal字段。`FLOW-C07` `pass_for_logic_with_upstream_blockers`。

### 14.2 `FLOW-C08 RequestRunControlFlow`

#### 14.2.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RequestRunControl` → `request_run_control(context, RunControlInput)` |
| discriminator | `Start/Stop/Cancel`；`CleanupRequest`拒绝并指向C09 |
| 目标 | 基于formal current owner basis创建一次 control intent并提交Sandbox；Accepted与Confirmed分离 |
| Step 6 | `OwnerRunProjection.can_authorize_control`、`ControlIntent::start/request/record_accepted/record_confirmed/reject/mark_conflict/mark_unknown`、`RecoveryCase::freeze` |
| Step 7 | run/control/projection/recovery repos、Sandbox/Runtime ports、UoW/id/result |
| 状态候选 | control/recovery；owner request/execution/control仅投影输入 |

#### 14.2.2 调用图

```text
[Command service + idempotency]
  | load RunIntent + OwnerRunProjection
  | reject CleanupRequest; compare expected owner basis
  v
[Sandbox safe snapshot + optional Runtime safe read -- outside UoW]
  | require current exact basis; never use PID/port/log
  v
[Local tx A]
  | re-read run/projection
  | ControlIntent::start -> Pending
  | save Absent; commit
  v
[SandboxRunPort.request_control -- outside UoW]
  v
[Local tx B]
  | Accepted -> record_accepted only
  | explicit effect-confirming snapshot/result -> record_confirmed
  | Rejected/Conflict/Unknown -> respective transition + recovery
  | save control + stored outcome + complete idempotency; commit
```

#### 14.2.3 关键伪代码

```rust
require_supported_non_cleanup_kind(input.kind)?;
let run = require_run(run_repository.get(input.run_intent_id).await?)?;
let projection = require_projection(projection_repository.get_by_run_intent(input.run_intent_id).await?)?;
if !projection.value.can_authorize_control(&input.expected_owner_basis) {
    return stored_conflict;
}
let sandbox_now = sandbox.read_safe_snapshot(input.expected_owner_basis.subject_ref).await?;
require_same_current_owner_basis(sandbox_now, input.expected_owner_basis)?;
let runtime_now = read_runtime_if_present_without_inference(&projection.value, runtime_status).await?;
validate_control_kind_against_formal_axes(input.kind, sandbox_now, runtime_now)?;

let tx_a = uow_manager.begin().await?;
recheck_run_projection_versions(run.version, projection.version, input.expected_owner_basis)?;
// [ControlIntent::start(...)]
let intent = ControlIntent::start(
    ids.new_control_intent_id(), input.run_intent_id, input.kind,
    input.expected_owner_basis, context.command_metadata.require()?,
)?;
control_repository.save(intent, RunnerExpectedVersion::Absent, tx_a.as_ref()).await?;
uow_manager.commit(tx_a).await?;

let owner = sandbox.request_control(SandboxControlRequest { /* from persisted intent */ }).await?;
let tx_b = uow_manager.begin().await?;
let mut current = require_control(control_repository.get(control_id).await?)?;
match owner {
    RunnerSubmissionOutcome::Accepted(acceptance) => {
        current.value.record_accepted(acceptance.result_ref)?;
        if acceptance.formally_confirms_requested_effect() {
            current.value.record_confirmed(acceptance.result_ref, acceptance.control_posture)?;
        }
    }
    RunnerSubmissionOutcome::Rejected(r) => current.value.reject(map_control_rejection(r))?,
    RunnerSubmissionOutcome::Conflict(c) => current.value.mark_conflict(c.actual_basis)?,
    RunnerSubmissionOutcome::Unknown(u) => {
        current.value.mark_unknown(map_unknown(u))?;
        save_frozen_control_recovery(&current.value, tx_b.as_ref()).await?;
    }
    RunnerSubmissionOutcome::Blocked(i) => current.value.reject(map_blocked_control_reason(i))?,
}
control_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx_b.as_ref()).await?;
// Store RequestRunControl result + complete; commit.
```

`formally_confirms_requested_effect`是对 typed owner carrier的逐字段判定；普通Accepted ACK必须为false。若Step 7具体 `SandboxControlAcceptance`只含受理ref，则本flow只到Accepted，确认只能由后续formal read/reconcile更新，不能猜字段。

#### 14.2.4 错误、状态、副作用、测试与停审

- stale/missing projection、basis mismatch、unsupported kind → Rejected/Conflict，no control intent submission。
- owner Accepted → `Pending -> Accepted`；只有明确effect posture才 `Accepted -> Confirmed`。
- owner Unknown/tx B unknown → `Unknown + RecoveryCase`；不重发。
- `Confirmed(Stop)`不触发cleanup、lease release、cache release或Evicted；`Confirmed(Cancel)`不等terminal success。
- outbound event/outbox none。
- 测试：三kind合法gate、Cleanup discriminator拒绝、basis race、ACK-only不Confirmed、explicit confirm、unknown recovery、duplicate无read/submit，以及PID/port/log输入不可用于确认。

停审：`FLOW-C08` `pass_for_logic_with_upstream_blockers`。

### 14.3 `FLOW-C09 RequestCleanupFlow`

#### 14.3.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RequestCleanup` → `request_cleanup(context, CleanupRequestInput)` |
| 目标 | 先全量重读保护输入并建立cleanup control intent，提交formal owner cleanup；owner Confirmed后仍需再次评估guard，再显式safe local release并最终mark Evicted |
| Step 6 | `ProtectionGuard.evaluate/assert_releasable/record_resolution`、`ControlIntent::start/...`、`MaterialCacheEntry.mark_evicted`、`RecoveryCase::freeze` |
| Step 7 | run/control/guard/cache/recovery repos；Sandbox protection/cleanup port、MaterialCachePort；UoW/id/result |
| 状态候选 | protection/control/cache/recovery；owner cleanup posture仅投影 |
| 当前 blocker | `RUN-UP-003/005~008` + physical cache `RUN-DDD-003` |

该flow只在 `protected_subject=CacheEntry` 时存在local release/evict阶段；RunIntent/LocalMaterial subject的owner cleanup结果不会凭空定位cache。`guard_ref`经nominal conversion加载，并必须 `guard.subject == input.protected_subject` 且 `OwnerCleanupBasis.protection_guard_ref`相同。

#### 14.3.2 函数级调用图

```text
[Command service + idempotency]
  | load guard; verify subject/ref/basis
  v
[SandboxRunPort.read_protection_inputs -- outside UoW]
  | map complete lease/capture/handoff/retention/orphan inputs
  v
[Local tx A]
  | re-read guard; evaluate; assert_releasable
  | ControlIntent::start(CleanupRequest) -> Pending
  | save guard/control; commit
  v
[SandboxRunPort.request_cleanup -- outside UoW]
  v
[Local tx B]
  | apply Accepted/Rejected/Conflict/Unknown to control
  | Unknown => RecoveryCase; commit intermediate posture
  v
[If and only if formal cleanup Confirmed]
  | read_protection_inputs again -- outside UoW
  | tx C: guard.evaluate + assert_releasable; commit guard
  | MaterialCachePort.release_material -- outside UoW
  | tx D: on Confirmed receipt mark_evicted + store terminal result + complete
```

#### 14.3.3 关键伪代码

```rust
let guard_id = input.guard_ref.to_persisted_id()?;
let guard = require_guard(guard_repository.get(guard_id).await?)?;
require_guard_subject_and_basis(&guard.value, input.protected_subject, input.expected_cleanup_basis)?;
// [SandboxRunPort.read_protection_inputs(ProtectedSubjectRef)]
let owner_inputs = sandbox.read_protection_inputs(input.protected_subject).await?;
let protection_inputs = require_complete_current_protection_inputs(owner_inputs, local_handoff_and_retention_refs)?;

let tx_a = uow_manager.begin().await?;
let mut current_guard = require_same_guard(guard_repository.get(guard_id).await?, guard.version)?;
// [ProtectionGuard::evaluate(ProtectionInputs)]
current_guard.value.evaluate(protection_inputs)?;
// [ProtectionGuard::assert_releasable(&OwnerCleanupBasis)]
current_guard.value.assert_releasable(&input.expected_cleanup_basis)?;
let control = ControlIntent::start(
    ids.new_control_intent_id(), input.run_intent_id,
    ControlIntentKind::CleanupRequest,
    input.expected_cleanup_basis.owner_state_basis,
    context.command_metadata.require()?,
)?;
guard_repository.save(current_guard.value, RunnerExpectedVersion::Exact(current_guard.version), tx_a.as_ref()).await?;
control_repository.save(control, RunnerExpectedVersion::Absent, tx_a.as_ref()).await?;
uow_manager.commit(tx_a).await?;

// [SandboxRunPort.request_cleanup(SandboxCleanupRequest)]
let cleanup = sandbox.request_cleanup(build_cleanup_request_from_persisted_control_guard(...)).await?;
apply_cleanup_submission_in_short_tx(cleanup)?; // expands to existing ControlIntent methods/repos
if !formal_cleanup_is_confirmed(cleanup) {
    return store_non_release_cleanup_outcome_and_complete;
}

let inputs_after = sandbox.read_protection_inputs(input.protected_subject).await?;
let tx_c = uow_manager.begin().await?;
let mut guard_after = require_guard(guard_repository.get(guard_id).await?)?;
guard_after.value.evaluate(require_complete_current_protection_inputs(inputs_after, ... )?)?;
guard_after.value.assert_releasable(&input.expected_cleanup_basis)?;
guard_repository.save(guard_after.value, RunnerExpectedVersion::Exact(guard_after.version), tx_c.as_ref()).await?;
uow_manager.commit(tx_c).await?;

if let ProtectedSubjectRef::CacheEntry(cache_ref) = input.protected_subject {
    let cache_id = cache_ref.to_persisted_id()?;
    let cache = require_cache(cache_repository.get(cache_id).await?)?;
    // [MaterialCachePort.release_material(...)] outside UoW
    let release = cache_port.release_material(
        cache_ref, cache.value.storage_handle, input.guard_ref, input.expected_cleanup_basis,
    ).await?;
    let tx_d = uow_manager.begin().await?;
    match release {
        RunnerEffectOutcome::Confirmed(receipt) => {
            let mut current_cache = require_same_cache(cache_repository.get(cache_id).await?, cache.version)?;
            let current_guard = require_guard(guard_repository.get(guard_id).await?)?;
            current_guard.value.assert_releasable(&input.expected_cleanup_basis)?;
            // [MaterialCacheEntry::mark_evicted()]
            current_cache.value.mark_evicted()?;
            cache_repository.save(current_cache.value, RunnerExpectedVersion::Exact(current_cache.version), tx_d.as_ref()).await?;
            // store receipt in CleanupRequestResult, complete idempotency
        }
        RunnerEffectOutcome::Unknown(u) => save_release_recovery_and_unknown(... )?,
        RunnerEffectOutcome::Failed(f) | RunnerEffectOutcome::Conflict(f) | RunnerEffectOutcome::Blocked(f) =>
            store_non_evicted_failure(... )?,
    }
    uow_manager.commit(tx_d).await?;
}
```

Union match的失败类型在真实实现分别映射，伪代码合写仅表示都不得mark Evicted；不能要求不同generic type统一。若cleanup Accepted但非Confirmed，terminal result可包含 cleanup ref/posture Accepted且 `local_release_receipt=None`。

#### 14.3.4 事务、错误、状态与测试

| Gate/outcome | 行为 |
|---|---|
| guard missing/mismatched/protected/blocked/unknown/stale | SafetyBlocked；no cleanup/no release |
| tx A unknown | readback control/guard；no cleanup until durable Pending proven |
| cleanup Accepted only | control Accepted；owner posture Accepted；no local release |
| cleanup Confirmed | control Confirmed only for CleanupRequest；then mandatory second guard read/evaluation |
| release Confirmed | only then cache mark Evicted + formal local receipt |
| cleanup/release Unknown | control/cache remain non-success + RecoveryCase Frozen；never resend/release again blindly |
| version/basis drift at any phase | Conflict；stop at that phase |

测试覆盖五类protection input缺失/active/stale、subject/guard mismatch、Accepted≠Confirmed、second guard changes back toProtected、release各outcome、crash windows、duplicate，以及stop-confirmed不进入本flow的断言。无outbound event/outbox；receipt不是evidence删除证明。`FLOW-C09` `pass_for_logic_with_upstream_blockers`。

### 14.4 `FLOW-C10 OpenManualReviewFlow`

#### 14.4.1 入口、调用图与伪代码

| 项 | 契约 |
|---|---|
| 协议/入口 | `OpenManualReview` → `open_manual_review(context, ManualReviewInput)` |
| 目标 | 对visible exact RecoveryCase执行 `require_manual_review`；不override任何authority/guard/owner truth |
| Step 6/7 | `RecoveryCase.require_manual_review`、recovery/idempotency/result repos、UoW |
| 外部 I/O/event | none / none |

```text
[Command service + idempotency]
  | load RecoveryCase Versioned; compare expected_state; authorize visibility/scope
  v
[Local tx]
  | re-read exact version
  | RecoveryCase.require_manual_review(mapped reason)
  | save Exact(version) + stored result + complete idempotency
  | commit
```

```rust
let case = require_visible_recovery_case(recovery_repository.get(input.recovery_case_id).await?, context.actor_context)?;
if case.value.state != input.expected_state { return stored_conflict; }
let tx = uow_manager.begin().await?;
let mut current = require_same_case(recovery_repository.get(input.recovery_case_id).await?, case.version)?;
// [RecoveryCase::require_manual_review(ReconcileFailure)]
current.value.require_manual_review(map_manual_review_reason(input.reason_ref)?)?;
recovery_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx.as_ref()).await?;
// Store OpenManualReview result + complete (§7.5), commit.
```

#### 14.4.2 错误、状态、测试与停审

Missing/not-visible返回body-free Rejected；state mismatch为Conflict；只有 `Frozen/Querying/Conflict` 等Step 6允许源状态可进ManualReview，Reconciled/Closed/既有ManualReview不得accepted no-op。结果不改变selection/material/run/control/guard，不关闭case、不允许replay/cleanup/release/signoff。测试覆盖每个源状态、visibility、version race、duplicate和零external call。`FLOW-C10` `pass_for_logic`。

### 14.5 `FLOW-C11 RequestDiagnosticHandoffFlow`

#### 14.5.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RequestDiagnosticHandoff` → `request_diagnostic_handoff(context, DiagnosticHandoffInput)` |
| 目标 | 校验 current visible diagnosis与每个already-safe material ref的redaction proof，durable保存Pending handoff后提交Observability；receipt只更新handoff posture |
| Step 6 | `FailureDiagnosis.is_actionable`、`HandoffPosture::prepare/submit/record_receipt/block/mark_unknown`、`RecoveryCase::freeze` |
| Step 7 | diagnosis/handoff/recovery repos；`RedactionPort.validate_safe_handoff_ref`、`ObservabilityHandoffPort.submit/read_posture`；UoW/id/result |
| 状态候选 | handoff/recovery |
| 当前 blocker | `RUN-UP-005/008`，不得声称正向handoff ready |

#### 14.5.2 函数级调用图

```text
[Command service + idempotency]
  | diagnosis ref -> persisted id; load visible/current diagnosis
  | validate ordered unique bounded material refs
  v
[RedactionPort.validate_safe_handoff_ref(each) -- outside UoW]
  | all must remain safe for target + actor
  v
[Local tx A]
  | re-read diagnosis/version
  | HandoffPosture::prepare -> Draft/Blocked
  | if Draft: submit -> Pending
  | save Absent; commit
  v
[ObservabilityHandoffPort.submit -- outside UoW]
  v
[Local tx B]
  | Accepted/Delivered/Failed/Blocked -> record_receipt/block
  | Unknown -> mark_unknown + RecoveryCase
  | save handoff + stored outcome + complete idempotency; commit
```

#### 14.5.3 关键伪代码

```rust
let diagnosis_id = input.diagnosis_ref.to_persisted_id()?;
let diagnosis = require_visible_current_diagnosis(diagnosis_repository.get(diagnosis_id).await?, context.actor_context)?;
if !diagnosis.value.is_actionable() { return stored_blocked_rejection; }
validate_ordered_unique_bounded_refs(&input.material_refs)?;
for material_ref in input.material_refs.iter() {
    // [RedactionPort.validate_safe_handoff_ref(SafeHandoffMaterialRef, HandoffTargetRef, ActorContext)]
    require_safe_validation(redaction.validate_safe_handoff_ref(
        material_ref.clone(), input.target_ref, context.actor_context,
    ).await?)?;
}

let tx_a = uow_manager.begin().await?;
let current_diagnosis = require_same_diagnosis(diagnosis_repository.get(diagnosis_id).await?, diagnosis.version)?;
let metadata = map_command_to_handoff_metadata(context.command_metadata.require()?)?;
// [HandoffPosture::from_diagnosis(...)]
let mut handoff = HandoffPosture::from_diagnosis(
    &current_diagnosis.value, input.material_refs, input.target_ref, metadata,
)?;
// [HandoffPosture::submit()]
handoff.submit()?;
handoff_repository.save(handoff, RunnerExpectedVersion::Absent, tx_a.as_ref()).await?;
uow_manager.commit(tx_a).await?;

// [ObservabilityHandoffPort.submit(ObservabilityHandoffRequest)] outside UoW
let owner = handoff_port.submit(build_request_from_persisted_handoff(...)).await?;
let tx_b = uow_manager.begin().await?;
let mut current = require_handoff(handoff_repository.get(handoff_id).await?)?;
match owner {
    RunnerSubmissionOutcome::Accepted(snapshot) => {
        let receipt = snapshot.receipt_ref.require_for_accepted_or_delivered()?;
        current.value.record_receipt(receipt, snapshot.posture)?;
    }
    RunnerSubmissionOutcome::Rejected(r) => current.value.block(map_handoff_failure(r))?,
    RunnerSubmissionOutcome::Conflict(c) => current.value.block(map_handoff_conflict(c))?,
    RunnerSubmissionOutcome::Unknown(u) => {
        current.value.mark_unknown(map_unknown(u))?;
        save_frozen_handoff_recovery(&current.value, tx_b.as_ref()).await?;
    }
    RunnerSubmissionOutcome::Blocked(i) => current.value.block(map_handoff_block(i))?,
}
handoff_repository.save(current.value, RunnerExpectedVersion::Exact(current.version), tx_b.as_ref()).await?;
// Store RequestDiagnosticHandoff result + complete; commit.
```

#### 14.5.4 错误、状态、副作用与测试

| 条件 | 结果 |
|---|---|
| diagnosis missing/not visible/stale/unactionable | Rejected/Blocked；no handoff |
| any ref unbounded/duplicate/unknown/redaction invalid for target/actor | Rejected/Blocked；no submit/raw fallback |
| tx A unknown | readback Pending handoff；do not submit until durability proven |
| owner Accepted/Delivered | handoff state scoped to receipt posture only |
| owner Unknown/tx B unknown | Handoff Unknown + RecoveryCase；no resend |
| owner Blocked/Rejected/Conflict | Handoff Blocked/Failed as typed mapping；no evidence field |
| duplicate | stored result replay；no revalidation/resubmit |

测试覆盖one bad material among many（all-or-nothing submit gate）、target/actor visibility变化、redaction Unsupported、各owner outcome、crash windows、duplicate，以及receipt不生成evidence/report/verdict/signoff。无outbound event/outbox。`FLOW-C11` `pass_for_logic_with_upstream_blockers`。

### 14.6 Batch 9.1-b 停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| `FLOW-C07~C11` 独立覆盖 | 5/5 | §14.1～§14.5 |
| 双事务 / external I/O | pass | C07/C08/C09/C11 durable intent→outside call→result tx；C10 local-only |
| unknown/replay | pass | all ambiguous effects freeze RecoveryCase；duplicate never resubmits |
| accepted/running | separated | C07 receipt只到Accepted；Runtime execution未被推导 |
| stop/cleanup/release/evict | separated | C08不cleanup；C09四阶段独立 |
| handoff/evidence | separated | safe-ref proof + receipt posture；无evidence字段 |
| Step 6/7 fixes | recorded | `RUN-S6-FIX-005`、`RUN-S7-FIX-002` |
| outbound | 0 | all event side effects none |
| blockers | preserved | `RUN-UP-001~005/007/008`、`RUN-DDD-003` |

11/11 Command flow均完成单flow停审。下一允许批次为 Query 9.2-a `FLOW-Q01~Q05`。

## 15. Query batch 9.2-a：context / selection / material

### 15.1 `FLOW-Q01 ResolveRunnerContextFlow`

#### 15.1.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::ResolveRunnerContext` → `RunnerQueryApplicationService.resolve_runner_context(context, input)` |
| DTO / response | `RunnerContextQueryInput` → `RunnerQueryResponse<RunnerContextView>` |
| 目标 | 从 formal resolver 返回 body-free actor/session/project/scope/platform safe context；仅在已有 matching committed local context 时附加 `context_id` |
| Step 6 | `RunnerQueryEntry`、`RunnerOperationContext.assert_query_no_write`、`RunnerReadVisibilityDecision::from_resolver/response_surface` |
| Step 7 | `ContextReadPort.resolve_read_visibility/resolve_context`、`RunnerContextRepository.find_current_for_actor_scope` |
| 写入 / 事务 | none；不生成 id、不保存 context、不创建 selection、不开始 UoW |
| 当前 blocker | exact SDK/Work/Workspace context mapping受 `RUN-UP-008` 及对应 owner contract成熟度约束；Unavailable/Unsupported必须原样暴露 |

取舍：visibility resolution 使用 finite `RunnerReadSubjectLocator::ContextRequest`，先取得 canonical read subject；不得从 `platform_ref`、scope字符串或 route 拼 subject。formal context resolution是本 response 的事实来源；local repository只允许补充已存在且逐字段一致的 local identity，不能用旧 local context覆盖 session/project/freshness/visibility。

#### 15.1.2 函数级调用图

```text
[RunnerEntryDispatchPort.dispatch_query]
  | validate variant/name/body + metadata + no idempotency
  | context.assert_query_no_write()
  v
[ContextReadPort.resolve_read_visibility(ContextRequest) -- outside UoW]
  +-- not visible --> body=None + canonical body-free surface; STOP
  v
[ContextReadPort.resolve_context -- outside UoW]
  | preserve Current/Stale/Restricted/Unavailable/Unsupported
  +-- no safe value --> body=None + degraded surface; STOP
  v
[RunnerContextRepository.find_current_for_actor_scope]
  | optional committed local identity; exact-field consistency check
  v
[explicit mapper -> RunnerContextView]
  | formal fields + optional matching context_id
  v
[RunnerQueryResponse<RunnerContextView>]
```

#### 15.1.3 关键伪代码与映射

```rust
context.assert_query_no_write()?;

// [ContextReadPort.resolve_read_visibility(...)]
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::ContextRequest {
        requested_scope_ref: input.requested_scope_ref,
        platform_ref: input.platform_ref,
    },
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref,
    visibility.actor_ref,
    visibility.scope_ref,
    visibility.visibility,
    visibility.freshness,
    visibility.degraded,
    visibility.resolution_source_ref,
    visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: ResolveRunnerContext,
        surface: decision.response_surface(),
        body: None,
    });
}

// [ContextReadPort.resolve_context(...)] -- still no UoW
let resolved = context_read.resolve_context(RunnerContextResolutionQuery {
    actor_context: context.actor_context,
    requested_scope_ref: input.requested_scope_ref,
    platform_ref: input.platform_ref,
}).await?;

match resolved {
    RunnerSemanticRead::Current { value, attribution }
    | RunnerSemanticRead::Stale { value, attribution, .. } => {
        // Explicit comparisons, not a generic helper:
        // actor == envelope actor; requested scope (when Some), resolved scope and
        // visibility scope agree; platform == input; visibility allows safe body.
        if value.actor_ref != context.actor_context.actor_ref
            || value.scope_ref != visibility.scope_ref
            || value.platform_ref != input.platform_ref
            || input.requested_scope_ref.is_some_and(|scope| scope != value.scope_ref)
        {
            return Ok(body_free_conflict_surface(decision, attribution));
        }

        let local = context_repository
            .find_current_for_actor_scope(value.actor_ref, value.scope_ref)
            .await?;
        let local_context_id = match local {
            Some(v) if v.value.actor_ref == value.actor_ref
                && v.value.session_ref == value.session_ref
                && v.value.project_ref == value.project_ref
                && v.value.scope_ref == value.scope_ref
                && v.value.platform_ref == value.platform_ref => Some(v.value.context_id),
            Some(_) => None, // surface becomes degraded Conflict; formal fields win.
            None => None,    // valid formal context with no local record.
        };

        Ok(RunnerQueryResponse {
            query_name: ResolveRunnerContext,
            surface: merge_visibility_and_context_surface(decision, &value, attribution),
            body: Some(RunnerContextView {
                context_id: local_context_id,
                actor_ref: value.actor_ref,
                session_ref: value.session_ref,
                project_ref: value.project_ref,
                scope_ref: value.scope_ref,
                platform_ref: value.platform_ref,
                source_freshness: value.freshness,
                visibility: value.visibility,
                source_attribution: value.source_attribution,
            }),
        })
    }
    RunnerSemanticRead::Restricted { .. }
    | RunnerSemanticRead::Unavailable { .. }
    | RunnerSemanticRead::Unsupported { .. } =>
        Ok(body_free_surface_from_context_read(decision, resolved)),
}
```

`body_free_conflict_surface`、`merge_visibility_and_context_surface` 与 `body_free_surface_from_context_read` 只是 application-local逐字段 response mapper 标签：它们不能读 store、调用 port、改变 visibility或生成 source attribution。实现必须对 `RunnerSemanticRead`、freshness、visibility 和 issue ref逐 variant映射，不能解析错误字符串。

#### 15.1.4 事务、错误、状态与副作用

| 条件 | response / 行为 |
|---|---|
| malformed metadata、Query带write key、非法platform/scope shape | entry Rejected；port/repository均不调用 |
| visibility Restricted/Unknown/Unavailable | canonical surface + `body=None`；不读 local context，避免泄露existence |
| resolver Current + no local record | `body=Some`、`context_id=None`；不是错误，也不保存新记录 |
| resolver Stale且policy允许safe summary | body可保留；surface必须Stale/degraded，不能用于Command side effect basis |
| resolver actor/scope/platform不一致 | body-free Conflict/Unavailable surface；不使用任一旧 local record补齐 |
| local index命中但字段与formal resolution不一致 | 不返回local id；surface标Conflict/Partial，formal字段保持不变 |
| resolver Unsupported/Unavailable | `body=None`；不fallback local role、profile、history或README默认平台 |

状态改变、stored result、idempotency、UoW、trace append、outbox、outbound event：全部 `none`。Query response不是 context truth snapshot，也不授予后续副作用；Command必须按自己的 flow重新解析当前 basis。

#### 15.1.5 测试切口与停审

| 测试/审查项 | 预期 |
|---|---|
| formal current + matching local | body含formal safe refs和matching local id |
| formal current + no local | id=None；repository无save/id generation |
| local/formal mismatch | 不泄露错误local id；degraded Conflict/Partial |
| restricted/unavailable/unsupported | body None；denied path不读local repo |
| stale formal resolution | stale可见但不可被标Current |
| no-write spy | begin/reserve/save/refresh/allocate/outbox调用恒为0 |

停审结论：DTO、formal/local source优先级、canonical subject、no-write与degraded mapping闭合；`FLOW-Q01` `pass_for_logic_with_upstream_blockers`。

### 15.2 `FLOW-Q02 ListSelectableReleasesFlow`

#### 15.2.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::ListSelectableReleases` → `list_selectable_releases(context, input)` |
| DTO / response | `ReleaseSelectionQueryInput` → `SelectableReleasePage` |
| 目标 | 在明确scope与bounded page内展示 formal owner 已证明为 exact immutable、approved、baselined、active、visible、current 的候选；不做自动选择 |
| Step 7 | `ContextReadPort.resolve_read_visibility`、`ReleaseAuthorityReadPort.list_selectable_releases`、`SelectableReleaseSummary` |
| 写入 / 事务 | none；不查 local selection/cache作为fallback，不刷新 authority |
| 当前 blocker | `RUN-UP-001/002/008`：exact safe page与SDK mapping未闭合，正向Current page不得声明ready |

`RUN-S7-FIX-003` 已使每个 safe page item在同一 formal read 中携带 approval/baseline/lifecycle/digest posture。Application不得为没有 selection generation 的列表项临时调用 `assess_exact_release`，也不得从 `authority_ref` 或本地成功历史推导这些字段。

#### 15.2.2 函数级调用图

```text
[Query entry]
  | validate exact scope + bounded page; no latest/default/sort selector
  | assert_query_no_write
  v
[ContextReadPort.resolve_read_visibility(Scope) -- outside UoW]
  +-- denied --> items=[] + body-free surface/page_info; STOP
  v
[map RunnerPageRequest -> RunnerRepositoryPage]
  | validate limit <= configured contract bound; cursor opaque
  v
[ReleaseAuthorityReadPort.list_selectable_releases -- outside UoW]
  | one formal safe page
  v
[validate every item + explicit view/page mapper]
  v
[SelectableReleasePage]
```

#### 15.2.3 关键伪代码与逐项 gate

```rust
context.assert_query_no_write()?;
if input.scope_ref != context.actor_context.scope_ref {
    return Ok(body_free_scope_conflict_page(input.page));
}
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::Scope(input.scope_ref),
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(SelectableReleasePage {
        query_name: ListSelectableReleases,
        surface: decision.response_surface(),
        page_info: RunnerPageInfo { next_cursor: None, has_more: false },
        items: vec![],
    });
}

// Explicit boundary conversion; public cursor remains opaque and limit is bounded.
let page = RunnerRepositoryPage {
    cursor: input.page.cursor.map(map_public_cursor_without_parsing),
    limit: validate_query_page_limit(input.page.limit)?,
};
let read = authority.list_selectable_releases(SelectableReleaseQuery {
    actor_ref: context.actor_context.actor_ref,
    scope_ref: input.scope_ref,
    page,
}).await?;

match read {
    RunnerSemanticRead::Current { value: page, attribution } => {
        let mut items = Vec::with_capacity(page.items.len());
        for item in page.items {
            // Explicit field checks; no `is_approved` local boolean or first-item rule.
            if item.approval_posture != AuthorityApprovalPosture::Approved
                || item.baseline_posture != AuthorityBaselinePosture::Baselined
                || item.lifecycle_posture != AuthorityLifecyclePosture::Active
                || item.freshness != SourceFreshness::Current
                || item.visibility != VisibilityPosture::Visible
            {
                return Err(ApplicationError::AdapterContractViolation);
            }
            items.push(SelectableReleaseView {
                release_ref: item.release_ref,
                version_ref: item.version_ref,
                authority_ref: item.authority_ref,
                approval_posture: item.approval_posture,
                baseline_posture: item.baseline_posture,
                lifecycle_posture: item.lifecycle_posture,
                source_digest_ref: item.source_digest_ref,
                freshness: item.freshness,
                visibility: item.visibility,
                source_attribution: item.source_attribution,
            });
        }
        Ok(map_current_owner_page(decision, attribution, items, page.next_cursor))
    }
    RunnerSemanticRead::Stale { .. } =>
        Ok(empty_degraded_page(decision, RunnerDegradedKind::Stale)),
    RunnerSemanticRead::Restricted { .. } =>
        Ok(empty_restricted_page(decision)),
    RunnerSemanticRead::Unavailable { .. } =>
        Ok(empty_degraded_page(decision, RunnerDegradedKind::Unavailable)),
    RunnerSemanticRead::Unsupported { .. } =>
        Ok(empty_degraded_page(decision, RunnerDegradedKind::Unsupported)),
}
```

所有 `map_*` / `empty_*_page` 都是纯 response mapper：只能复制 formal safe字段、转换 opaque cursor并合并更保守的surface；不能发第二次 owner read、读取cache、改变item顺序或把empty解释为default。Current page若含不完整/非qualified item是adapter contract violation，而不是由Runner过滤后伪装成完整owner page。

#### 15.2.4 错误、状态、副作用与测试

| 条件 | 结果 |
|---|---|
| `scope_ref`空/不匹配、page limit非法、cursor非法编码 | body-free Rejected/Conflict page；不调用authority |
| visibility denied | items empty、next_cursor None；不泄露candidate数量或owner cursor |
| Current + empty owner page | 正常空集合；不选默认、不读取local history |
| Stale/Restricted/Unavailable/Unsupported | empty degraded page；不得将stale items暴露为“可运行” |
| Current item非Approved/Baselined/Active/Current/Visible | adapter contract error；不返回部分“成功”page |
| positive exact adapter尚blocked | Unsupported/Unavailable；不能用README、tag、branch、latest或cache补页 |

无 repository write、idempotency、UoW、stored result、authority refresh、selection creation、outbox或outbound event。测试覆盖empty current page、multiple exact items、page cursor round-trip、limit gate、denied no-call、各semantic read分支、invalid Current item、首项绝不自动选择以及所有write spies为0。

停审结论：page identity、formal qualification字段、blocked-first positive path、no-default/no-write均闭合；`FLOW-Q02` `pass_for_logic_with_upstream_blockers`。

### 15.3 `FLOW-Q03 GetSelectionPostureFlow`

#### 15.3.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetSelectionPosture` → `get_selection_posture(context, input)` |
| locator | `selection_id` 或 `context_id` 恰有一个；前者 `get`，后者 `find_current_for_context` |
| response | `RunnerQueryResponse<SelectionPostureSection>` |
| 目标 | 展示 persisted explicit selection 与同 canonical subject 的 committed authority safe projection；local state不改写approval/baseline/lifecycle truth |
| Step 7 | `ContextReadPort.resolve_read_visibility`、selection repository、`RunnerReadSectionRepository.load_section(..., Selection, ...)` |
| 写入 / 事务 | none；不调用 `assess_exact_release/revalidate_authority`，不调用selection transition或save |

取舍：先用 finite locator做visibility，denied时不读 selection existence。visible后再按 exact repository index读取本地selection，并读取 committed selection section。Projection可缺失/stale，但其 identity/binding若存在必须与本地对象逐字段一致；冲突不能选“更新的一边”。

#### 15.3.2 函数级调用图

```text
[Query entry]
  | validate exactly-one locator + no-write context
  v
[ContextReadPort.resolve_read_visibility(Selection|Context)]
  +-- denied --> body=None; no repository existence read; STOP
  v
[ReleaseSelectionRepository.get OR find_current_for_context]
  +-- missing --> body=None + Missing surface; STOP
  v
[RunnerReadSectionRepository.load_section(subject, Selection)]
  | validate key/subject/variant/surface/binding
  v
[explicit local + authority-safe mapper]
  v
[RunnerQueryResponse<SelectionPostureSection>]
```

#### 15.3.3 关键伪代码

```rust
context.assert_query_no_write()?;
let locator = match (&input.selection_id, &input.context_id) {
    (Some(selection_id), None) => RunnerReadSubjectLocator::Selection(*selection_id),
    (None, Some(context_id)) => RunnerReadSubjectLocator::Context(*context_id),
    _ => return Ok(body_free_invalid_locator_response(GetSelectionPosture)),
};
let visibility = context_read
    .resolve_read_visibility(context.actor_context, locator).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetSelectionPosture,
        surface: decision.response_surface(),
        body: None,
    });
}

let local = match (input.selection_id, input.context_id) {
    (Some(selection_id), None) => selection_repository.get(selection_id).await?,
    (None, Some(context_id)) => selection_repository.find_current_for_context(context_id).await?,
    _ => unreachable_after_finite_match,
};
let Some(local) = local else {
    return Ok(missing_query_response(GetSelectionPosture, decision));
};

// Scope/context checks are explicit; loaded body does not create the resolution.
if local.value.scope_ref != visibility.scope_ref
    || input.context_id.is_some_and(|id| id != local.value.context_ref.context_id)
    || local.value.context_ref.actor_ref != context.actor_context.actor_ref
{
    return Ok(body_free_conflict_response(GetSelectionPosture, decision));
}

let section = read_sections.load_section(
    visibility.read_subject_ref,
    ReadModelSection::Selection,
    context.actor_context,
).await?;
let projected = match (section.section, section.body) {
    (ReadModelSection::Selection, Some(RunnerReadSectionBody::Selection(view)))
        if section.subject_ref == visibility.read_subject_ref => Some(view),
    (ReadModelSection::Selection, None)
        if section.subject_ref == visibility.read_subject_ref => None,
    _ => return Err(ApplicationError::ProjectionContractViolation),
};

let binding = RunnerSelectionBinding {
    release_ref: local.value.release_ref,
    version_ref: local.value.version_ref,
    scope_ref: local.value.scope_ref,
    generation: local.value.generation.value,
};
if let Some(p) = &projected {
    if p.selection_id != local.value.selection_id
        || p.context_id != local.value.context_ref.context_id
        || p.binding != binding
        || p.state != local.value.state
        || p.authority_ref != local.value.authority_ref
        || p.invalidation_reason != local.value.invalidation_reason
    {
        return Ok(body_free_conflict_response(GetSelectionPosture, decision));
    }
}

let (approval, baseline, lifecycle, surface) = match projected {
    Some(p) => (p.approval_posture, p.baseline_posture, p.lifecycle_posture,
                merge_more_restrictive_surface(decision.response_surface(), p.surface)),
    None => (AuthorityApprovalPosture::Unknown,
             AuthorityBaselinePosture::Unknown,
             AuthorityLifecyclePosture::Unknown,
             mark_missing_authority_projection(decision.response_surface())),
};
Ok(RunnerQueryResponse {
    query_name: GetSelectionPosture,
    surface,
    body: Some(SelectionPostureSection {
        selection_id: local.value.selection_id,
        context_id: local.value.context_ref.context_id,
        binding,
        state: local.value.state,
        authority_ref: local.value.authority_ref,
        approval_posture: approval,
        baseline_posture: baseline,
        lifecycle_posture: lifecycle,
        invalidation_reason: local.value.invalidation_reason,
        surface,
    }),
})
```

`missing_query_response`、`merge_more_restrictive_surface` 等均是纯逐字段mapper。特别地，projection缺失时 authority三轴必须为 `Unknown`；local `SelectionState::Current` 和 `authority_ref=Some` 也不能被mapper翻译成 Approved/Baselined/Active。

#### 15.3.4 错误、状态、副作用与测试

| 条件 | 结果 |
|---|---|
| zero/two locators | body-free invalid-locator response；no repository read |
| visibility denied | body None；不探测selection存在性 |
| exact/current-index missing | body None + Missing；不扫描history或任取list item |
| local scope/actor/context mismatch | body-free Conflict；不暴露body |
| committed authority section missing | local selection可见，authority三轴Unknown，surface Missing/Partial |
| section stale/restricted | safe body仅按policy保留；surface取更保守值 |
| projection/local binding或state冲突 | body-free Conflict；不刷新/repair任一侧 |

状态、UoW、idempotency、save、authority read、projection replace、outbox/outbound event均为 `none`。测试覆盖两种locator、invalid one-of、denied no-existence-read、missing current index、projection missing、stale safe projection、identity/binding/state conflict、local Current不推authority，以及所有write/external-refresh spy为0。

停审结论：locator、visibility-first、local/authority双视图、projection一致性和no-refresh闭合；`FLOW-Q03` `pass_for_logic`。

### 15.4 `FLOW-Q04 GetMaterialPreparationFlow`

#### 15.4.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetMaterialPreparation` → `get_material_preparation(context, input)` |
| locator | `selection_id`、`task_ref`、`cache_entry_ref` 恰有一个 |
| response | `RunnerQueryResponse<MaterialPostureSection>`；transfer/integrity/cache/authority保持分轴且可选 |
| Step 7 | `ContextReadPort.resolve_read_visibility`、`RunnerReadSectionRepository.load_section(Material)`；exact task/cache/integrity repository仅用于已给exact locator的一致性校验 |
| 写入 / 事务 | none；不transfer、不resolve source、不verify、不promote、不更新progress/last-used |
| blocker | committed safe section的正向刷新仍受 `RUN-UP-001/002/007/008`；本Query不解除 |

取舍：material view跨 `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` 三个对象，且 selection 可以有多次attempt。Query不按时间选一个attempt；三种 locator先由formal resolver变为canonical subject，然后读取该subject的committed material section。`task_ref/cache_entry_ref` 分支额外读取exact object链作一致性校验；`selection_id`分支不扫描/任取task，section缺失就返回Missing，而非伪造 `AcquisitionState::Absent`。

#### 15.4.2 函数级调用图

```text
[Query entry]
  | exactly-one locator + no-write
  v
[ContextReadPort.resolve_read_visibility(Selection|Task|Cache)]
  +-- denied --> body=None; no local object read; STOP
  v
[RunnerReadSectionRepository.load_section(subject, Material)]
  | require key=Material, matching subject, finite body variant
  +-- body None --> Missing/degraded response; STOP
  v
[optional exact consistency reads]
  | task_ref -> task.get
  | cache_ref -> cache.get + integrity.get(exact posture ref)
  | selection_id -> no attempt scan
  v
[explicit mapper / consistency gate]
  v
[RunnerQueryResponse<MaterialPostureSection>]
```

#### 15.4.3 关键伪代码

```rust
context.assert_query_no_write()?;
let locator = match (&input.selection_id, &input.task_ref, &input.cache_entry_ref) {
    (Some(id), None, None) => RunnerReadSubjectLocator::Selection(*id),
    (None, Some(task_ref), None) => RunnerReadSubjectLocator::AcquisitionTask(*task_ref),
    (None, None, Some(cache_ref)) => RunnerReadSubjectLocator::CacheEntry(*cache_ref),
    _ => return Ok(body_free_invalid_locator_response(GetMaterialPreparation)),
};
let visibility = context_read
    .resolve_read_visibility(context.actor_context, locator).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetMaterialPreparation,
        surface: decision.response_surface(),
        body: None,
    });
}

let section = read_sections.load_section(
    visibility.read_subject_ref,
    ReadModelSection::Material,
    context.actor_context,
).await?;
let view = match (section.section, section.body) {
    (ReadModelSection::Material, Some(RunnerReadSectionBody::Material(view)))
        if section.subject_ref == visibility.read_subject_ref => view,
    (ReadModelSection::Material, None)
        if section.subject_ref == visibility.read_subject_ref =>
            return Ok(missing_query_response(GetMaterialPreparation, decision)),
    _ => return Err(ApplicationError::ProjectionContractViolation),
};

match (input.selection_id, input.task_ref, input.cache_entry_ref) {
    (Some(selection_id), None, None) => {
        let selection = selection_repository.get(selection_id).await?;
        let Some(selection) = selection else {
            return Ok(missing_query_response(GetMaterialPreparation, decision));
        };
        let exact = RunnerSelectionBinding {
            release_ref: selection.value.release_ref,
            version_ref: selection.value.version_ref,
            scope_ref: selection.value.scope_ref,
            generation: selection.value.generation.value,
        };
        if selection.value.scope_ref != visibility.scope_ref
            || view.selection_binding != exact
        {
            return Ok(body_free_conflict_response(GetMaterialPreparation, decision));
        }
        // No task list/"latest attempt" read. Optional task fields come only from section.
    }
    (None, Some(task_ref), None) => {
        let task = acquisition_repository.get(task_ref.to_persisted_id()?).await?;
        let Some(task) = task else {
            return Ok(missing_query_response(GetMaterialPreparation, decision));
        };
        if view.task_ref != Some(task_ref)
            || view.selection_binding != map_selection_binding(&task.value.selection_binding)
            || view.acquisition_state != Some(task.value.state)
            || view.transfer_progress != task.value.progress
            || task.value.selection_binding.scope_ref != visibility.scope_ref
        {
            return Ok(body_free_conflict_response(GetMaterialPreparation, decision));
        }
    }
    (None, None, Some(cache_ref)) => {
        let cache = cache_repository.get(cache_ref.to_persisted_id()?).await?;
        let Some(cache) = cache else {
            return Ok(missing_query_response(GetMaterialPreparation, decision));
        };
        let integrity_id = cache.value.integrity_posture_ref.to_persisted_id()?;
        let integrity = integrity_repository.get(integrity_id).await?;
        if view.cache_entry_ref != Some(cache_ref)
            || view.cache_state != Some(cache.value.state)
            || view.selection_binding != map_selection_binding(&cache.value.source_binding.selection)
            || view.source_digest_ref != cache.value.source_binding.digest_ref
            || view.integrity_posture_ref != Some(cache.value.integrity_posture_ref)
            || !integrity_matches_material_view(integrity.as_ref(), &view)
            || cache.value.source_binding.selection.scope_ref != visibility.scope_ref
        {
            return Ok(body_free_conflict_response(GetMaterialPreparation, decision));
        }
    }
    _ => unreachable_after_finite_match,
}

let surface = merge_more_restrictive_surface(decision.response_surface(), view.surface);
Ok(RunnerQueryResponse {
    query_name: GetMaterialPreparation,
    surface,
    body: Some(MaterialPostureSection { surface, ..view }),
})
```

`map_selection_binding` 是 Step 8 已要求的逐字段 domain→public mapper；`integrity_matches_material_view` 必须展开为 posture id、source binding、manifest、digest/signature/platform result、authority freshness与state逐字段比较，只是纯predicate，不得调用verifier或将missing posture当Verified。`acquisition_state=None` 表示该section没有唯一可归属的attempt轴，绝不等于 `Absent`。

#### 15.4.4 错误、状态、副作用与测试

| 条件 | 结果 |
|---|---|
| locator one-of非法 | body-free invalid response；no resolver/repository read |
| visibility denied | body None；不读task/cache/integrity existence |
| committed material section missing | body None + Missing；不启动refresh job |
| selection locator命中多次attempt语义 | 只使用subject section；绝不按last-created/mtime/list first选attempt |
| exact task/cache missing | body None + Missing；不从文件存在性补状态 |
| section/object binding/state/check结果冲突 | body-free Conflict；不repair projection/object |
| transfer Complete | 只显示Complete；integrity/cache轴按自身字段，不能推Verified/Qualified |
| integrity Verified | 不推cache Qualified、authority Approved或run allowed |

Query无UoW、idempotency、stored result、repository save、source/transfer/verifier/cache port、last-used update、outbox或outbound event。测试覆盖三locator、one-of错误、denied no-read、section missing、task exact mapping、cache+integrity mapping、multiple attempts no scan、Complete/Verified/Qualified分轴、binding/digest/ref冲突和所有write/external spies为0。

停审结论：三locator、committed section、exact一致性、material多轴与no-transfer/no-verify闭合；`FLOW-Q04` `pass_for_logic_with_upstream_blockers`。

### 15.5 `FLOW-Q05 GetCacheProtectionFlow`

#### 15.5.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetCacheProtection` → `get_cache_protection(context, input)` |
| DTO / response | exact `cache_entry_ref` + optional `guard_ref` → `RunnerQueryResponse<CacheProtectionView>` |
| 目标 | 并列展示 local cache state/candidate 与 persisted conservative guard各保护轴；只读，不重新evaluate或release |
| Step 7 | `ContextReadPort.resolve_read_visibility`、cache repository、`ProtectionGuardRepository.get/find_by_subject` |
| 写入 / 事务 | none；不probe Sandbox/Runtime/Platform，不调用 `evaluate/assert_releasable/release_protection/mark_evicted` |
| blocker | guard owner-input刷新与physical release仍受 `RUN-UP-003~007/008`、`RUN-DDD-003`；Query只显示committed posture |

#### 15.5.2 函数级调用图

```text
[Query entry + no-write]
  v
[ContextReadPort.resolve_read_visibility(CacheEntry)]
  +-- denied --> body=None; no cache/guard existence read; STOP
  v
[MaterialCacheEntryRepository.get(exact cache id)]
  +-- missing --> Missing; STOP
  v
[ProtectionGuardRepository.get(optional exact guard)
 OR find_by_subject(CacheEntry exact enum)]
  | exact guard, if supplied, must equal subject-index result
  v
[explicit cache + guard mapper]
  | missing/stale/conflicting guard => protection Unknown, never Releasable
  v
[RunnerQueryResponse<CacheProtectionView>]
```

#### 15.5.3 关键伪代码

```rust
context.assert_query_no_write()?;
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::CacheEntry(input.cache_entry_ref),
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetCacheProtection,
        surface: decision.response_surface(),
        body: None,
    });
}

let cache_id = input.cache_entry_ref.to_persisted_id()?;
let cache = cache_repository.get(cache_id).await?;
let Some(cache) = cache else {
    return Ok(missing_query_response(GetCacheProtection, decision));
};
if cache.value.source_binding.selection.scope_ref != visibility.scope_ref {
    return Ok(body_free_conflict_response(GetCacheProtection, decision));
}

let subject = ProtectedSubjectRef::CacheEntry(input.cache_entry_ref);
let indexed = guard_repository.find_by_subject(subject).await?;
let guard = match input.guard_ref {
    Some(guard_ref) => {
        let exact = guard_repository.get(guard_ref.to_persisted_id()?).await?;
        match (exact, indexed) {
            (Some(exact), Some(indexed))
                if exact.value.guard_id == indexed.value.guard_id
                    && exact.value.subject == subject => Some(exact),
            (None, None) => None,
            _ => return Ok(body_free_conflict_response(GetCacheProtection, decision)),
        }
    }
    None => indexed,
};

let (guard_ref, protection, lease, capture, handoff, retention, orphan,
     freshness, surface) = match guard {
    Some(g) if g.value.subject == subject => (
        Some(ProtectionGuardRef::from_persisted_id(&g.value.guard_id)),
        g.value.state,
        g.value.lease_posture,
        g.value.capture_posture,
        g.value.handoff_posture,
        g.value.retention_posture,
        g.value.orphan_posture,
        g.value.freshness,
        decision.response_surface(),
    ),
    Some(_) => return Ok(body_free_conflict_response(GetCacheProtection, decision)),
    None => (
        None,
        ProtectionState::Unknown,
        OwnerLeasePosture::Unknown,
        CaptureProtectionPosture::Unknown,
        HandoffProtectionPosture::Unknown,
        RetentionProtectionPosture::Unknown,
        OrphanProtectionPosture::Unknown,
        SourceFreshness::Unknown,
        mark_missing_guard(decision.response_surface()),
    ),
};

let surface = merge_freshness_conservatively(surface, freshness);
Ok(RunnerQueryResponse {
    query_name: GetCacheProtection,
    surface,
    body: Some(CacheProtectionView {
        cache_entry_ref: input.cache_entry_ref,
        material_state: cache.value.state,
        eviction_candidate: cache.value.eviction_candidate,
        active_guard_ref: guard_ref,
        protection_state: protection,
        owner_lease_posture: lease,
        capture_posture: capture,
        handoff_posture: handoff,
        retention_posture: retention,
        orphan_posture: orphan,
        freshness,
        surface,
    }),
})
```

`merge_freshness_conservatively` 只能选择更保守的freshness/degraded marker；不能把guard Stale/Unknown与visibility Current合成Current。`cache.state=Evicted`来自既有local lifecycle；`eviction_candidate=Candidate`或`guard.state=Releasable`均不能被mapper改成Evicted/Released/Cleaned。

#### 15.5.4 错误、状态、副作用与测试

| 条件 | 结果 |
|---|---|
| invalid cache/guard nominal ref | entry/body-free invalid response；不解析prefix定位 |
| visibility denied | body None；不读cache/guard存在性 |
| cache missing | body None + Missing |
| optional exact guard与subject index不一致 | body-free Conflict；不任选其一 |
| guard missing | cache body可见；所有保护轴Unknown + Missing/Partial surface |
| guard subject mismatch | Conflict；不得显示该guard或Releasable |
| guard stale/unknown | 原样显示并降级surface；不得现场owner probe/evaluate |
| Candidate/Releasable | 仅展示候选/许可姿态；不调用release、delete、mark_evicted |

状态、UoW、idempotency、stored result、cache/guard save、external owner/platform read、outbox/outbound event全部 `none`。测试覆盖guard ref absent/present、exact/index一致与冲突、missing guard defaults Unknown、各保护轴映射、stale conservatism、Candidate/Releasable不升级、denied no-existence-read以及所有mutation spy为0。

停审结论：cache/guard精确定位、subject index、保守missing/stale语义与no-evaluate/no-release闭合；`FLOW-Q05` `pass_for_logic_with_upstream_blockers`。

### 15.6 Batch 9.2-a 停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| `FLOW-Q01~Q05` 独立覆盖 | 5/5 | §15.1～§15.5 |
| visibility-first / denied no existence leak | pass | 所有local object read均在 `decision.is_visible()` 后 |
| Query no-write | pass | 无UoW/idempotency/save/result/outbox；external仅Q01/Q02 formal read |
| latest/default/first/mtime fallback | prohibited | Q02不默认选择；Q03正式current index；Q04 committed subject section；Q05 subject guard index |
| owner/local truth边界 | pass | context/authority posture来自formal safe read/committed section；local selection/cache不反推owner truth |
| material分轴 | pass | acquisition optional；Complete≠Verified≠Qualified；protection另轴 |
| cache/protection边界 | pass | Candidate/Releasable≠Evicted/Released/Cleaned |
| Step 6/7/8 fixes | recorded | `RUN-S6-FIX-006`、`RUN-S7-FIX-003~005`、`MaterialPostureSection.acquisition_state` optional |
| blockers | preserved | `RUN-UP-001~008`、`RUN-DDD-001~003` |

5/5 context/selection/material Query flow均完成单flow停审。下一允许批次为 Query 9.2-b `FLOW-Q06~Q08`。

## 16. Query batch 9.2-b：lifecycle / resource / recovery

### 16.1 `FLOW-Q06 GetRunLifecycleFlow`

#### 16.1.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetRunLifecycle` → `get_run_lifecycle(context, input)` |
| DTO / response | exact `RunLifecycleQueryInput.run_intent_id` → `RunnerQueryResponse<RunPostureSection>` |
| 目标 | 并列展示 Runner local intent、bounded local control intents 与 committed owner-attributed projection；request/execution/control/result轴不压平 |
| Step 6 | `RunIntent`、`ControlIntent`、`OwnerRunProjection`、`RunnerReadVisibilityDecision`；本flow不调用任何transition |
| Step 7 | context visibility、run/control/projection repositories、`RunnerEmbeddedCollectionBounds.control_intents` |
| 写入 / 外部 I/O | none；不读 Sandbox/Runtime live source、不refresh projection、不提交control/cleanup |
| blocker | committed owner projection正向来源受 `RUN-UP-003/004/008`；缺失/stale只显示Unknown/degraded |

控制历史是 local intent 摘要，不是 owner control truth。非分页 response 只读取从cursor=None开始的一个 bounded page；若 `next_cursor=Some`，返回当前安全摘要并把surface标 `Partial`，不无界遍历，也不把列表末项解释为current control posture。

#### 16.1.2 函数级调用图

```text
[Query entry + assert_query_no_write]
  v
[ContextReadPort.resolve_read_visibility(RunIntent)]
  +-- denied --> body=None; no existence read; STOP
  v
[RunIntentRepository.get(exact id)]
  +-- missing --> Missing; STOP
  v
[ControlIntentRepository.list_by_run_intent(cursor=None, configured bound)]
  | local summaries only; next_cursor => Partial
  v
[OwnerRunProjectionRepository.get_by_run_intent]
  | optional committed safe axes; no owner refresh
  v
[explicit three-source consistency + view mapper]
  v
[RunnerQueryResponse<RunPostureSection>]
```

#### 16.1.3 关键伪代码

```rust
context.assert_query_no_write()?;
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::RunIntent(input.run_intent_id),
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetRunLifecycle,
        surface: decision.response_surface(),
        body: None,
    });
}

let run = run_repository.get(input.run_intent_id).await?;
let Some(run) = run else {
    return Ok(missing_query_response(GetRunLifecycle, decision));
};
if run.value.context_ref.actor_ref != context.actor_context.actor_ref
    || run.value.context_ref.scope_ref != visibility.scope_ref
{
    return Ok(body_free_conflict_response(GetRunLifecycle, decision));
}

let controls = control_repository.list_by_run_intent(
    input.run_intent_id,
    RunnerRepositoryPage {
        cursor: None,
        limit: embedded_bounds.control_intents,
    },
).await?;
let mut control_views = Vec::with_capacity(controls.items.len());
for versioned in controls.items {
    if versioned.value.run_intent_id != input.run_intent_id {
        return Err(ApplicationError::RepositoryContractViolation);
    }
    control_views.push(ControlIntentSummaryView {
        control_intent_ref: ControlIntentRef::from_persisted_id(
            &versioned.value.control_intent_id,
        ),
        kind: versioned.value.kind,
        state: versioned.value.state,
        owner_result_ref: versioned.value.owner_result_ref,
    });
}

let projection = owner_projection_repository
    .get_by_run_intent(input.run_intent_id).await?;
let local_binding = map_selection_binding(&run.value.selection_binding);
let mut surface = decision.response_surface();
let owner = match projection {
    Some(p) => {
        if p.value.run_intent_id != input.run_intent_id
            || both_some_and_different(
                &run.value.sandbox_request_ref,
                &p.value.sandbox_request_ref,
            )
        {
            return Ok(body_free_conflict_response(GetRunLifecycle, decision));
        }
        surface = merge_owner_projection_surface(
            surface, p.value.freshness, p.value.visibility,
            p.value.source_attribution,
        );
        (
            p.value.sandbox_request_ref.or(run.value.sandbox_request_ref),
            p.value.boundary_ref,
            p.value.runtime_run_ref,
            p.value.request_posture,
            p.value.execution_posture,
            p.value.control_posture,
            p.value.result_refs,
            p.value.owner_basis,
        )
    }
    None => {
        surface = mark_missing_owner_projection(surface);
        let request = if run.value.state == RunIntentState::Draft
            && run.value.sandbox_request_ref.is_none()
        {
            OwnerRequestPosture::NotSubmitted
        } else {
            OwnerRequestPosture::Unknown
        };
        let execution = if request == OwnerRequestPosture::NotSubmitted {
            OwnerExecutionPosture::NotStarted
        } else {
            OwnerExecutionPosture::Unknown
        };
        (
            run.value.sandbox_request_ref,
            None,
            None,
            request,
            execution,
            OwnerControlPosture::None,
            OwnerResultRefSet(vec![]),
            None,
        )
    }
};
if controls.next_cursor.is_some() {
    surface = mark_embedded_collection_partial(surface);
}

Ok(RunnerQueryResponse {
    query_name: GetRunLifecycle,
    surface,
    body: Some(RunPostureSection {
        run_intent_id: run.value.run_intent_id,
        local_intent_state: run.value.state,
        selection_binding: local_binding,
        sandbox_request_ref: owner.0,
        boundary_ref: owner.1,
        runtime_run_ref: owner.2,
        request_posture: owner.3,
        execution_posture: owner.4,
        control_posture: owner.5,
        control_intents: control_views,
        result_refs: owner.6,
        owner_basis: owner.7,
        surface,
    }),
})
```

`both_some_and_different` 与 `merge_owner_projection_surface` 是纯逐字段比较/mapper。Projection的 `owner_basis` 只可原样映射 formal safe snapshot；缺失时不得从 request/boundary/runtime refs拼装。Local `RunIntentState::Accepted` 也不能替代 owner projection的 request/execution posture。

#### 16.1.4 错误、状态、副作用与测试

| 条件 | response / 规则 |
|---|---|
| visibility denied | body None；不读run/control/projection存在性 |
| run missing | body None + Missing |
| actor/scope mismatch | body-free Conflict |
| projection missing + local Draft/no owner ref | request=NotSubmitted、execution=NotStarted、control=None |
| projection missing + Submitting/Accepted/Unknown或有request ref | request/execution=Unknown；不从local state推owner success |
| projection Stale/Restricted | last-known safe axes仅按policy展示；surface必须更保守，owner_basis不得用于Command |
| run/projection request ref冲突 | body-free Conflict；不任选其一 |
| controls超过bound | 返回首个稳定bounded page + Partial；不读取后续页、不称完整history |

无状态改变、UoW、idempotency、save、owner read、projection refresh、stored result、outbox或outbound event。测试覆盖denied no-read、missing run、projection absent/current/stale/conflict、Accepted≠Running、control Accepted≠Confirmed、bounded control partial、列表末项不决定owner control，以及所有mutation/external spy为0。

停审结论：local/owner多轴、bounded controls、owner basis来源、Accepted≠Running与no-refresh闭合；`FLOW-Q06` `pass_for_logic_with_upstream_blockers`。

### 16.2 `FLOW-Q07 GetResourceCleanupViewFlow`

#### 16.2.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetResourceCleanupView` → `get_resource_cleanup_view(context, input)` |
| DTO / response | finite `ProtectedSubjectRef` → `RunnerQueryResponse<ResourceCleanupSection>` |
| 目标 | 并列展示 committed local resource observations、current local protection guard、committed owner cleanup轴、local release receipt与open recovery links |
| Step 7 | visibility、read-section、resource/guard/recovery repositories、embedded bounds |
| 写入 / 外部 I/O | none；不probe、不读owner live source、不evaluate guard、不cleanup/release/evict、不reconcile |
| blocker | owner cleanup/lease safe projection与platform portability受 `RUN-UP-003~008`；physical release受 `RUN-DDD-003` |

Owner cleanup posture/ref/local release receipt只能来自 committed `ResourceCleanup` safe section，不能从历史Command result或control末项猜current。Guard和RecoveryCase是Runner-owned current records，可直接读取后与section并列；section冲突必须显式降级，不能覆盖owner轴。

#### 16.2.2 函数级调用图

```text
[Query entry + no-write]
  v
[ContextReadPort.resolve_read_visibility(ProtectedSubject)]
  +-- denied --> body=None; STOP
  v
[RunnerReadSectionRepository.load_section(ResourceCleanup)]
  | committed owner/local safe section; exact subject/variant check
  +-- missing --> body=None + Missing; STOP
  v
[bounded exact local verification]
  | each section observation id -> ResourceObservationRepository.get
  | subject -> ProtectionGuardRepository.find_by_subject
  | subject set -> RecoveryCaseRepository.find_open_by_subjects(first bounded page)
  v
[dual-view assembler]
  | owner cleanup fields remain section-owned
  | guard/recovery use current Runner-owned records
  | conflicts/partial are explicit
  v
[RunnerQueryResponse<ResourceCleanupSection>]
```

#### 16.2.3 关键伪代码

```rust
context.assert_query_no_write()?;
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::ProtectedSubject(input.protected_subject),
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetResourceCleanupView,
        surface: decision.response_surface(),
        body: None,
    });
}

let section = read_sections.load_section(
    visibility.read_subject_ref,
    ReadModelSection::ResourceCleanup,
    context.actor_context,
).await?;
let projected = match (section.section, section.body) {
    (ReadModelSection::ResourceCleanup,
     Some(RunnerReadSectionBody::ResourceCleanup(view)))
        if section.subject_ref == visibility.read_subject_ref
            && view.protected_subject == input.protected_subject => view,
    (ReadModelSection::ResourceCleanup, None)
        if section.subject_ref == visibility.read_subject_ref =>
            return Ok(missing_query_response(GetResourceCleanupView, decision)),
    _ => return Err(ApplicationError::ProjectionContractViolation),
};
if projected.local_observations.len()
    > embedded_bounds.resource_observations as usize
{
    return Err(ApplicationError::ProjectionContractViolation);
}

let mut observations = Vec::with_capacity(projected.local_observations.len());
for view in projected.local_observations {
    let stored = resource_repository.get(view.observation_id).await?;
    let Some(stored) = stored else {
        return Ok(body_free_conflict_response(GetResourceCleanupView, decision));
    };
    if stored.value.resource_key != view.resource_key
        || stored.value.posture != view.posture
        || stored.value.observed_at != view.observed_at
        || stored.value.freshness != view.freshness
        || stored.value.source_attribution != view.source_attribution
    {
        return Ok(body_free_conflict_response(GetResourceCleanupView, decision));
    }
    observations.push(view);
}

let guard = guard_repository.find_by_subject(input.protected_subject).await?;
let (guard_ref, protection, lease, capture, handoff, retention, orphan,
     guard_freshness) = match guard {
    Some(g) if g.value.subject == input.protected_subject => (
        Some(ProtectionGuardRef::from_persisted_id(&g.value.guard_id)),
        g.value.state, g.value.lease_posture, g.value.capture_posture,
        g.value.handoff_posture, g.value.retention_posture,
        g.value.orphan_posture, g.value.freshness,
    ),
    Some(_) => return Ok(body_free_conflict_response(GetResourceCleanupView, decision)),
    None => (
        None, ProtectionState::Unknown, OwnerLeasePosture::Unknown,
        CaptureProtectionPosture::Unknown, HandoffProtectionPosture::Unknown,
        RetentionProtectionPosture::Unknown, OrphanProtectionPosture::Unknown,
        SourceFreshness::Unknown,
    ),
};

let recovery_subjects = recovery_subject_set_from_protected_subject(
    input.protected_subject,
)?; // finite enum match; no string parsing.
let recoveries = recovery_repository.find_open_by_subjects(
    recovery_subjects,
    RunnerRepositoryPage {
        cursor: None,
        limit: embedded_bounds.recovery_links,
    },
).await?;
let mut recovery_refs = Vec::with_capacity(recoveries.items.len());
for case in recoveries.items {
    if !case.value.subject_refs.contains_exact_protected_subject(input.protected_subject) {
        return Err(ApplicationError::RepositoryContractViolation);
    }
    recovery_refs.push(case.value.recovery_case_id);
}

let mut surface = merge_more_restrictive_surface(
    decision.response_surface(), projected.surface,
);
surface = merge_freshness_conservatively(surface, guard_freshness);
if recoveries.next_cursor.is_some() {
    surface = mark_embedded_collection_partial(surface);
}
if projected.guard_ref != guard_ref
    || projected.protection_state != protection
    || projected.owner_lease_posture != lease
    || projected.capture_posture != capture
    || projected.handoff_posture != handoff
    || projected.retention_posture != retention
    || projected.orphan_posture != orphan
{
    surface = mark_local_projection_conflict(surface);
}

Ok(RunnerQueryResponse {
    query_name: GetResourceCleanupView,
    surface,
    body: Some(ResourceCleanupSection {
        protected_subject: input.protected_subject,
        local_observations: observations,
        guard_ref,
        protection_state: protection,
        owner_lease_posture: lease,
        capture_posture: capture,
        handoff_posture: handoff,
        retention_posture: retention,
        orphan_posture: orphan,
        owner_cleanup_posture: projected.owner_cleanup_posture,
        cleanup_ref: projected.cleanup_ref,
        local_release_receipt: projected.local_release_receipt,
        recovery_case_refs: recovery_refs,
        surface,
    }),
})
```

`recovery_subject_set_from_protected_subject` 必须是三个 finite branches：CacheEntry→`RecoverySubjectRef::CacheEntry`、RunIntent→`RunIntent`、LocalMaterial→内部`LocalMaterial`；不得解析ref prefix。`contains_exact_protected_subject`同样只是finite union equality predicate，不新增repository/domain method。Owner cleanup fields保留section source；current guard只替换Runner-owned保护轴，二者冲突由surface表达而非互相覆盖。

#### 16.2.4 错误、状态、副作用与测试

| 条件 | response / 规则 |
|---|---|
| visibility denied | body None；不读section/observation/guard/recovery existence |
| cleanup section missing | body None + Missing；不启动refresh |
| section subject/variant mismatch | projection contract error |
| observation missing/field mismatch | body-free Conflict；不发new probe |
| guard missing | 五保护轴和aggregate均Unknown；owner cleanup轴仍按safe section展示 |
| guard与section不一致 | 使用current Runner guard轴 + Conflict surface；不改owner cleanup posture |
| open recovery超过bound | bounded refs + Partial；不无界扫描 |
| cleanup Confirmed, receipt None | 原样展示；Confirmed不等local release/eviction |
| local receipt Some, material metadata not shown Evicted | 两轴并列；Query不调用mark_evicted修复 |

无UoW、idempotency、save、platform/owner live read、guard evaluate、cleanup、material release、eviction、reconcile、outbox或outbound event。测试覆盖三protected subject variants、denied no-read、section missing、observation exact validation、guard missing/stale/conflict、bounded recovery partial、Confirmed≠Released、Releasable≠Cleaned/Evicted与所有mutation spy为0。

停审结论：local/owner双视图、current guard、bounded recovery links、cleanup/release/evict分阶段与no-probe/no-cleanup闭合；`FLOW-Q07` `pass_for_logic_with_upstream_blockers`。

### 16.3 `FLOW-Q08 GetRecoveryCaseFlow`

#### 16.3.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetRecoveryCase` → `get_recovery_case(context, input)` |
| DTO / response | exact `RecoveryCaseId` → `RunnerQueryResponse<RecoveryCaseView>` |
| 目标 | 只读展示case state、可见Runner-local subjects、immutable expected basis、formal resolution refs与typed unresolved posture |
| Step 6/8 | `RecoveryCase` + `RecoverySubjectRefSet/RecoveryExpectedBasis/ReconcileFailure` → public finite view |
| Step 7 | visibility resolver、recovery repository、embedded subject/resolution bounds |
| 写入 / 外部副作用 | none；不调用 `begin_query/record_snapshot/reconcile/require_manual_review/close`，不启动Job |

Case本身可见并不自动授权所有subject。先解析case visibility并load exact case；随后对每个可公开subject用finite locator逐一解析visibility，denied项丢弃并把surface标Restricted/Partial。内部 `LocalMaterialHandle` 永不进入public view。

#### 16.3.2 函数级调用图

```text
[Query entry + no-write]
  v
[ContextReadPort.resolve_read_visibility(RecoveryCase)]
  +-- denied --> body=None; no case existence read; STOP
  v
[RecoveryCaseRepository.get(exact id)]
  +-- missing --> Missing; STOP
  v
[bounded finite subject mapping]
  | internal subject -> public local ref candidate
  | each candidate -> resolve_read_visibility(candidate locator)
  | denied/internal-only -> drop + Restricted/Partial
  v
[expected basis / resolution refs / failure posture pure mapping]
  v
[RunnerQueryResponse<RecoveryCaseView>]
```

#### 16.3.3 关键伪代码

```rust
context.assert_query_no_write()?;
let case_visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::RecoveryCase(input.recovery_case_id),
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    case_visibility.read_subject_ref, case_visibility.actor_ref,
    case_visibility.scope_ref, case_visibility.visibility,
    case_visibility.freshness, case_visibility.degraded,
    case_visibility.resolution_source_ref,
    case_visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetRecoveryCase,
        surface: decision.response_surface(),
        body: None,
    });
}

let case = recovery_repository.get(input.recovery_case_id).await?;
let Some(case) = case else {
    return Ok(missing_query_response(GetRecoveryCase, decision));
};
if case.value.subject_refs.len() > embedded_bounds.recovery_subjects as usize
    || case.value.resolution_refs.len() > embedded_bounds.resolution_refs as usize
{
    return Err(ApplicationError::RepositoryContractViolation);
}

let mut public_subjects = Vec::new();
let mut restricted_subject = false;
for subject in case.value.subject_refs.iter() {
    let Some((locator, public_ref)) = map_recovery_subject_to_public_candidate(subject)
    else {
        // RecoverySubjectRef::LocalMaterial is intentionally internal-only.
        restricted_subject = true;
        continue;
    };
    let subject_visibility = context_read.resolve_read_visibility(
        context.actor_context,
        locator,
    ).await?;
    let subject_decision = RunnerReadVisibilityDecision::from_resolver(
        subject_visibility.read_subject_ref,
        subject_visibility.actor_ref,
        subject_visibility.scope_ref,
        subject_visibility.visibility,
        subject_visibility.freshness,
        subject_visibility.degraded,
        subject_visibility.resolution_source_ref,
        subject_visibility.source_attribution,
    )?;
    if subject_decision.is_visible()
        && subject_visibility.scope_ref == case_visibility.scope_ref
    {
        public_subjects.push(public_ref);
    } else {
        restricted_subject = true;
    }
}

let expected = RunnerExpectedBasisMarker {
    selection_generation: case.value.expected_basis.selection_generation,
    authority_ref: case.value.expected_basis.authority_ref,
    owner_basis: case.value.expected_basis.owner_basis,
    source_digest_ref: case.value.expected_basis.source_digest_ref,
};
let resolution_refs = case.value.resolution_refs.0.clone();
let unresolved = case.value.unresolved_reason.map(map_reconcile_failure_variant);
let mut surface = decision.response_surface();
if restricted_subject {
    surface = mark_subjects_restricted(surface);
}

Ok(RunnerQueryResponse {
    query_name: GetRecoveryCase,
    surface,
    body: Some(RecoveryCaseView {
        recovery_case_id: case.value.recovery_case_id,
        subject_refs: public_subjects,
        state: case.value.state,
        expected_basis: expected,
        resolution_refs,
        unresolved_posture: unresolved,
        surface,
    }),
})
```

`map_recovery_subject_to_public_candidate` 是 exhaustive finite match：Context/Selection/Task/Cache/Integrity/Run/Control/Guard/Preview/Diagnosis/Handoff分别映射相同nominal public ref与对应 `RunnerReadSubjectLocator`；LocalMaterial返回None。`map_reconcile_failure_variant` 对 `ReconcileFailure` 与 `ReconcileFailurePosture` 一一映射；未知未来variant必须使response Unsupported，而不是字符串化或吞掉。

#### 16.3.4 错误、状态、副作用与测试

| 条件 | response / 规则 |
|---|---|
| case visibility denied | body None；不读case existence |
| case missing | body None + Missing |
| subject/resolution集合违反bound或ordered-unique invariant | repository contract error；不静默截断 |
| individual subject denied/different scope | 从body丢弃并标Restricted/Partial；不探测其object body |
| LocalMaterial internal subject | 永不公开handle；标Restricted/Partial |
| expected basis optional轴 | 原样逐字段复制；不得以actual resolution覆盖或填默认ref |
| ManualReview | 展示ManualReview + typed posture；不成为override/signoff |
| Reconciled/Closed | 仅展示local state；不映射为run/cleanup/evidence success |

无transition、UoW、idempotency、save、owner reconcile read、Job dispatch、stored result、outbox或outbound event。测试覆盖denied no-read、missing case、所有finite subject variants、individual visibility filtering、LocalMaterial drop、bound violation、expected basis exact mapping、每个failure variant、ManualReview/Closed非成功与所有mutation/job spy为0。

停审结论：case/subject双层visibility、internal-handle隐藏、basis/failure逐字段mapping与no-reconcile闭合；`FLOW-Q08` `pass_for_logic`。

### 16.4 Batch 9.2-b 停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| `FLOW-Q06~Q08` 独立覆盖 | 3/3 | §16.1～§16.3 |
| owner lifecycle多轴 | pass | request/execution/control/result/basis独立；local intent/control不反推owner truth |
| embedded collections bounded | pass | `RunnerEmbeddedCollectionBounds` + single bounded page；超页Partial、invariant超限error |
| resource/cleanup双视图 | pass | committed owner cleanup轴与current Runner guard/recovery并列；冲突显式 |
| cleanup phase separation | pass | Confirmed≠Released；Releasable≠Cleaned/Evicted |
| recovery visibility/evidence边界 | pass | subject逐项visibility；LocalMaterial不公开；Closed非owner success/evidence |
| Query no-write/no-live-repair | pass | 无UoW/save/owner live read/probe/cleanup/reconcile/job |
| Step 6/7/8 fixes | recorded | `RUN-S6-FIX-007`、`RUN-S7-FIX-006~007`、`RUN-S8-FIX-003` |
| blockers | preserved | `RUN-UP-003~008`、`RUN-DDD-001~003` |

3/3 lifecycle/resource/recovery Query flow均完成单flow停审。下一允许批次为 Query 9.2-c `FLOW-Q09~Q12`。

## 17. Query batch 9.2-c：preview / diagnosis / handoff / read model

### 17.1 `FLOW-Q09 GetOutputPreviewFlow`

#### 17.1.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetOutputPreview` → `get_output_preview(context, input)` |
| locator | `preview_ref` 或 `subject_ref` 恰有一个；subject分支只走正式current subject index |
| response | `RunnerQueryResponse<OutputPreviewView>`；只包含已持久化bounded/redacted content与safe refs |
| Step 6 | `OutputPreview.is_displayable`；`subject_refs/safety/visibility/freshness/truncation`只读 |
| Step 7 | context visibility、`OutputPreviewRepository.get/find_for_subject`、embedded diagnostic/source bounds |
| 写入 / 外部 I/O | none；不读stdout/stderr/host file/raw log，不调用DiagnosticRead/Redaction port，不mark stale |
| blocker | safe diagnostic/redaction正向刷新受 `RUN-UP-004/005/008`；本Query不解除 |

`RUN-S6-FIX-008` 已固定 preview 的 exact subject index 与 persisted safety posture。subject lookup不得按mtime/last insert选记录；preview ref lookup也必须逐字段验证resolver scope/visibility。当前visibility只能进一步收紧已存preview，不能把历史Restricted/Blocked内容升级为Safe。

#### 17.1.2 函数级调用图

```text
[Query entry]
  | exactly-one locator + metadata/no-idempotency/no-write
  v
[ContextReadPort.resolve_read_visibility(OutputPreview|DiagnosticSubject)]
  +-- denied --> body=None; no preview existence read; STOP
  v
[OutputPreviewRepository.get OR find_for_subject]
  +-- missing --> body=None + Missing; STOP
  v
[subject/index + bounded/redacted/safety consistency checks]
  | current visibility/freshness may only restrict/clear content
  v
[explicit OutputPreview -> OutputPreviewView mapper]
  v
[RunnerQueryResponse<OutputPreviewView>]
```

#### 17.1.3 关键伪代码

```rust
context.assert_query_no_write()?;
let locator = match (&input.preview_ref, &input.subject_ref) {
    (Some(preview_ref), None) => RunnerReadSubjectLocator::OutputPreview(*preview_ref),
    (None, Some(subject_ref)) => RunnerReadSubjectLocator::DiagnosticSubject(*subject_ref),
    _ => return Ok(body_free_invalid_locator_response(GetOutputPreview)),
};
let visibility = context_read
    .resolve_read_visibility(context.actor_context, locator).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetOutputPreview,
        surface: decision.response_surface(),
        body: None,
    });
}

let preview = match (input.preview_ref, input.subject_ref) {
    (Some(preview_ref), None) =>
        preview_repository.get(preview_ref.to_persisted_id()?).await?,
    (None, Some(subject_ref)) =>
        preview_repository.find_for_subject(subject_ref).await?,
    _ => unreachable_after_finite_match,
};
let Some(preview) = preview else {
    return Ok(missing_query_response(GetOutputPreview, decision));
};
if input.preview_ref.is_some_and(|r|
        r != OutputPreviewRef::from_persisted_id(&preview.value.preview_id))
    || input.subject_ref.is_some_and(|s| !preview.value.subject_refs.contains_exact(s))
{
    return Ok(body_free_conflict_response(GetOutputPreview, decision));
}
if preview.value.subject_refs.len() > embedded_bounds.diagnostic_subjects as usize
    || preview.value.source_refs.len() > embedded_bounds.output_source_refs as usize
{
    return Err(ApplicationError::RepositoryContractViolation);
}

let safety = match preview.value.safety {
    PreviewSafetyPosture::Safe => RunnerPreviewSafetyPosture::Safe,
    PreviewSafetyPosture::Restricted => RunnerPreviewSafetyPosture::Restricted,
    PreviewSafetyPosture::Unavailable => RunnerPreviewSafetyPosture::Unavailable,
    PreviewSafetyPosture::Blocked => RunnerPreviewSafetyPosture::Blocked,
};
let mut content = preview.value.content;
if content.value.is_some() && !content.redacted {
    return Err(ApplicationError::RepositoryContractViolation);
}
if matches!(safety,
        RunnerPreviewSafetyPosture::Unavailable | RunnerPreviewSafetyPosture::Blocked)
    && content.value.is_some()
{
    return Err(ApplicationError::RepositoryContractViolation);
}
if matches!(preview.value.visibility,
        VisibilityPosture::Unknown | VisibilityPosture::Unavailable)
    || !preview.value.is_displayable()
{
    content.value = None; // only remove already-safe value; never recover a raw value.
}

let mut surface = decision.response_surface();
surface = merge_preview_surface(
    surface,
    preview.value.visibility,
    preview.value.freshness,
    preview.value.source_attribution,
    preview.value.safety,
)?;
Ok(RunnerQueryResponse {
    query_name: GetOutputPreview,
    surface,
    body: Some(OutputPreviewView {
        preview_ref: OutputPreviewRef::from_persisted_id(&preview.value.preview_id),
        source_refs: preview.value.source_refs,
        content,
        safety,
        truncation: preview.value.truncation,
        generated_at: preview.value.generated_at,
        surface,
    }),
})
```

`contains_exact` 是 ordered-unique set membership，不是字符串检索。`merge_preview_surface` 是纯mapper：visibility/freshness/safety任一更保守时只降级surface或清空safe value，不能调用redaction、改变stored preview或生成新content。`content.redacted=true`只证明当前存储值经过mandatory redaction，不证明run success/evidence/report。

#### 17.1.4 错误、状态、副作用与测试

| 条件 | response / 规则 |
|---|---|
| zero/two locators | body-free invalid response；no repository read |
| visibility denied | body None；不泄露preview existence/source refs |
| subject current index missing | Missing；不按时间扫描history |
| subject/index or exact preview id mismatch | Conflict；不返回body |
| source/subject collection over bound | repository contract error；不静默截断 |
| content.value Some且redacted=false | contract error；不得展示或调用redaction补救 |
| safety Blocked/Unavailable但value Some | contract error；fail closed |
| stored/current visibility或freshness降级 | safe body仅按policy保留；surface显式Restricted/Stale/Unavailable |

无UoW、idempotency、save、refresh、redaction、diagnostic read、raw fallback、stored result、outbox或outbound event。测试覆盖两locator、one-of错误、denied no-read、current-index missing、bounded sets、redacted invariant、四safety variants、stale/restricted清空或降级、raw fallback spy为0及全部write spy为0。

停审结论：exact locator、persisted safety、mandatory-redaction invariant、no-raw/no-refresh与presentation-only语义闭合；`FLOW-Q09` `pass_for_logic_with_upstream_blockers`。

### 17.2 `FLOW-Q10 GetFailureDiagnosisFlow`

#### 17.2.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetFailureDiagnosis` → `get_failure_diagnosis(context, input)` |
| locator | `diagnosis_ref` 或 non-empty canonical `subject_refs` 恰有一个 |
| response | `RunnerQueryResponse<FailureDiagnosisView>`；local classification/impact/next-step/certainty + body-free refs |
| Step 6 | `FailureDiagnosis`字段只读；domain enum逐variant映射public enum；不调用classify/mark_uncertain/refresh_basis |
| Step 7 | visibility、diagnosis repository exact id/exact-set index、embedded diagnostic/failure bounds |
| 写入 / 外部 I/O | none；不读raw signals、不调用DiagnosticRead/Redaction、不启动Refresh/Reconcile Job |

Diagnosis 是 Runner local safe interpretation，不是 owner verdict/evidence。subject-set分支必须使用 canonical ordered-unique exact-set index；subset/superset、last-created和“第一条匹配”均不可命中。`next_step=RetryRead/Reconcile/ManualReview` 只是显示值，Query绝不执行它。

#### 17.2.2 函数级调用图

```text
[Query entry]
  | exactly-one locator; subject set non-empty/bounded/ordered-unique
  v
[ContextReadPort.resolve_read_visibility(FailureDiagnosis|DiagnosticSubjects)]
  +-- denied --> body=None; no diagnosis existence read; STOP
  v
[FailureDiagnosisRepository.get OR find_for_subjects(exact-set)]
  +-- missing --> Missing; STOP
  v
[identity/set/bounds + freshness/source checks]
  v
[exhaustive domain enum -> public enum mapper]
  v
[RunnerQueryResponse<FailureDiagnosisView>]
```

#### 17.2.3 关键伪代码

```rust
context.assert_query_no_write()?;
let locator = match (&input.diagnosis_ref, &input.subject_refs) {
    (Some(diagnosis_ref), None) =>
        RunnerReadSubjectLocator::FailureDiagnosis(*diagnosis_ref),
    (None, Some(subjects)) if subjects.is_non_empty_ordered_unique()
        && subjects.len() <= embedded_bounds.diagnostic_subjects as usize =>
        RunnerReadSubjectLocator::DiagnosticSubjects(subjects.clone()),
    _ => return Ok(body_free_invalid_locator_response(GetFailureDiagnosis)),
};
let visibility = context_read
    .resolve_read_visibility(context.actor_context, locator).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetFailureDiagnosis,
        surface: decision.response_surface(),
        body: None,
    });
}

let diagnosis = match (input.diagnosis_ref, input.subject_refs.as_ref()) {
    (Some(diagnosis_ref), None) =>
        diagnosis_repository.get(diagnosis_ref.to_persisted_id()?).await?,
    (None, Some(subjects)) =>
        diagnosis_repository.find_for_subjects(subjects.clone()).await?,
    _ => unreachable_after_finite_match,
};
let Some(diagnosis) = diagnosis else {
    return Ok(missing_query_response(GetFailureDiagnosis, decision));
};
if input.diagnosis_ref.is_some_and(|r|
        r != FailureDiagnosisRef::from_persisted_id(&diagnosis.value.diagnosis_id))
    || input.subject_refs.as_ref().is_some_and(|subjects|
        subjects != &diagnosis.value.subject_refs)
{
    return Ok(body_free_conflict_response(GetFailureDiagnosis, decision));
}
if diagnosis.value.subject_refs.len() > embedded_bounds.diagnostic_subjects as usize
    || diagnosis.value.source_failures.len()
        > embedded_bounds.source_failure_refs as usize
{
    return Err(ApplicationError::RepositoryContractViolation);
}

let classification = map_failure_class_exhaustive(diagnosis.value.classification)?;
let impact = map_failure_impact_exhaustive(diagnosis.value.impact)?;
let next_step = map_safe_next_step_exhaustive(diagnosis.value.next_step)?;
let certainty = map_diagnosis_certainty_exhaustive(diagnosis.value.certainty)?;
let surface = merge_diagnosis_surface(
    decision.response_surface(),
    diagnosis.value.freshness,
    diagnosis.value.source_attribution,
    diagnosis.value.certainty,
)?;
Ok(RunnerQueryResponse {
    query_name: GetFailureDiagnosis,
    surface,
    body: Some(FailureDiagnosisView {
        diagnosis_ref: FailureDiagnosisRef::from_persisted_id(
            &diagnosis.value.diagnosis_id,
        ),
        subject_refs: diagnosis.value.subject_refs,
        source_failure_refs: diagnosis.value.source_failures,
        classification,
        impact,
        next_step,
        certainty,
        diagnosed_at: diagnosis.value.diagnosed_at,
        surface,
    }),
})
```

四个 `map_*_exhaustive` 必须是 Step 6 domain enum 到 Step 8 public enum 的显式match，不能按ordinal、Debug/string或generic serialize映射；未来新增variant时返回Unsupported contract surface。`certainty=Uncertain`、freshness非Current或source conflict都必须使surface更保守，但Query不得重分类已有diagnosis。

#### 17.2.4 错误、状态、副作用与测试

| 条件 | response / 规则 |
|---|---|
| locator one-of非法、subject set空/重复/超bound | body-free invalid response；no repository read |
| visibility denied | body None；不泄露diagnosis/source failures |
| exact id/exact-set index missing | Missing；不按subset/superset/time fallback |
| loaded identity/subject set不匹配 | Conflict；不返回body |
| source failure refs超bound | repository contract error；不截断后称完整 |
| stale/uncertain diagnosis | safe body可按policy显示；surface显式Stale/Partial，next_step保持原值 |
| next_step=Reconcile/ManualReview/RetryRead | 仅展示；job/command dispatch次数为0 |

无UoW、idempotency、save、classify、refresh、redaction、diagnostic read、job dispatch、stored result、outbox或outbound event。测试覆盖两locator、exact-set语义、denied no-read、all enum variants、future unknown variant fail-closed、Uncertain不升级、next-step无动作、evidence/report/verdict/signoff字段不存在与所有mutation/external spy为0。

停审结论：exact-set index、enum显式映射、uncertainty/next-step边界、no-reclassify/no-job与non-evidence语义闭合；`FLOW-Q10` `pass_for_logic_with_upstream_blockers`。

### 17.3 `FLOW-Q11 GetHandoffPostureFlow`

#### 17.3.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetHandoffPosture` → `get_handoff_posture(context, input)` |
| DTO / response | exact `DiagnosticHandoffId` → `RunnerQueryResponse<HandoffPostureView>` |
| 目标 | 展示 Runner-owned handoff intent、已验证safe material refs、target与formal body-free receipt posture；不展示或生成evidence |
| Step 6 | `HandoffPosture`字段只读；不调用submit/record_receipt/mark_unknown/block/requires_reconcile产生动作 |
| Step 7 | context visibility、`HandoffPostureRepository.get`、embedded safe-material bound |
| 写入 / 外部 I/O | none；不调用Observability/Archive、Redaction、owner readback，不resend、不reconcile |
| blocker | exact handoff owner read/receipt mapping受 `RUN-UP-005/006/008`；Query只显示committed posture |

Handoff locator本身由formal visibility resolver授权；loaded object的persisted `visibility/freshness` 只能进一步收紧。当前 public schema没有字段级partial material列表，因此任一当前或persisted visibility不是 `Visible` 时，整个body保持隐藏，而不是删几个ref后伪装完整。

#### 17.3.2 函数级调用图

```text
[Query entry + assert_query_no_write]
  v
[ContextReadPort.resolve_read_visibility(Handoff)]
  +-- denied/partial-only --> body=None; no handoff existence read; STOP
  v
[HandoffPostureRepository.get(exact id)]
  +-- missing --> Missing; STOP
  v
[identity + visibility/freshness + bounded safe-ref + receipt/state invariants]
  v
[explicit HandoffPosture -> HandoffPostureView mapper]
  v
[RunnerQueryResponse<HandoffPostureView>]
```

#### 17.3.3 关键伪代码

```rust
context.assert_query_no_write()?;
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::Handoff(input.handoff_id),
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if visibility.visibility != VisibilityPosture::Visible
    || !decision.is_visible()
{
    return Ok(RunnerQueryResponse {
        query_name: GetHandoffPosture,
        surface: decision.response_surface(),
        body: None,
    });
}

let handoff = handoff_repository.get(input.handoff_id).await?;
let Some(handoff) = handoff else {
    return Ok(missing_query_response(GetHandoffPosture, decision));
};
if handoff.value.handoff_id != input.handoff_id {
    return Err(ApplicationError::RepositoryContractViolation);
}
if handoff.value.material_refs.len()
    > embedded_bounds.safe_handoff_material_refs as usize
    || !handoff.value.material_refs.is_ordered_unique()
{
    return Err(ApplicationError::RepositoryContractViolation);
}
if handoff.value.visibility != VisibilityPosture::Visible {
    return Ok(RunnerQueryResponse {
        query_name: GetHandoffPosture,
        surface: merge_handoff_surface(
            decision.response_surface(),
            handoff.value.visibility,
            handoff.value.freshness,
        ),
        body: None,
    });
}
match (handoff.value.state, &handoff.value.receipt_ref) {
    (HandoffState::Accepted | HandoffState::Delivered, None) =>
        return Err(ApplicationError::RepositoryContractViolation),
    (HandoffState::Draft | HandoffState::Pending, Some(_)) =>
        return Err(ApplicationError::RepositoryContractViolation),
    _ => {}
}

let surface = merge_handoff_surface(
    decision.response_surface(),
    handoff.value.visibility,
    handoff.value.freshness,
);
Ok(RunnerQueryResponse {
    query_name: GetHandoffPosture,
    surface,
    body: Some(HandoffPostureView {
        handoff_id: handoff.value.handoff_id,
        diagnosis_ref: handoff.value.diagnosis_ref,
        material_refs: handoff.value.material_refs,
        target_ref: handoff.value.target_ref,
        state: handoff.value.state,
        receipt_ref: handoff.value.receipt_ref,
        surface,
    }),
})
```

`merge_handoff_surface` 是纯mapper；freshness非Current只能降级展示，不能触发owner readback。`Unknown` 可以保留已有receipt（例如Accepted后结果变得不可确认），但Query不得据此转回Accepted/Delivered或resend。Receipt只作为opaque owner acknowledgment ref；response不存在evidence/report/verdict/signoff字段。

#### 17.3.4 错误、状态、副作用与测试

| 条件 | response / 规则 |
|---|---|
| visibility denied/partial且schema无法安全裁字段 | body None；不读handoff existence |
| handoff missing | body None + Missing |
| safe material refs重复/超bound | repository contract error；不静默去重/截断 |
| persisted visibility Restricted/Unknown/Unavailable | body None；不返回diagnosis/material/target refs |
| Accepted/Delivered无receipt | repository contract error；不伪造receipt |
| Unknown有/无receipt | 原样显示Unknown；不resend、不read-reconcile |
| Accepted/Delivered | 仅handoff posture；不生成evidence、report、verdict、signoff或readiness |

无UoW、idempotency、save、owner read、redaction validation、handoff submit/resend、reconcile/job dispatch、stored result、outbox或outbound event。测试覆盖各state/receipt组合、denied no-read、persisted visibility收紧、stale surface、bounded safe refs、Unknown no-resend、Delivered non-evidence与所有mutation/external spy为0。

停审结论：handoff/receipt、visibility、bounded safe refs、Unknown no-resend与receipt≠evidence闭合；`FLOW-Q11` `pass_for_logic_with_upstream_blockers`。

### 17.4 `FLOW-Q12 GetRunnerReadModelFlow`

#### 17.4.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议/入口 | `RunnerQueryRequest::GetRunnerReadModel` → `get_runner_read_model(context, input)` |
| DTO / response | canonical `RunnerReadSubjectRef` + optional expected composition generation → `RunnerQueryResponse<RunnerReadModel>` |
| 目标 | 从一次 committed stable-generation source set纯组合context + 六个safe section；保留每section body缺口、surface与多轴状态 |
| Step 6 | `RunnerReadModel::compose/redact_for/is_stale_against`、`RunnerComposedSection<T>`；均纯函数 |
| Step 7 | context visibility、`RunnerReadSectionRepository.load_sources`、finite section/source carrier、attribution bound |
| 写入 / 外部 I/O | none；不replace projection、不refresh owner、不启动RefreshVisibleSourcesJob、不保存composite model |
| blocker | 各section正向refresh受相应 `RUN-UP-001~008`；Query只消费committed safe set |

`expected_generation` 只是caller stale-detection marker，不是selection generation、repository version或refresh command。Mismatch时可返回当前safe body，但顶层surface必须Conflict/Stale；不得为了满足caller隐式刷新或读取旧generation snapshot。

#### 17.4.2 函数级调用图

```text
[Query entry + assert_query_no_write]
  v
[ContextReadPort.resolve_read_visibility(Canonical subject)]
  +-- denied --> body=None; no section read; STOP
  v
[RunnerReadSectionRepository.load_sources(subject, actor)]
  | one committed source set
  v
[finite structural audit]
  | 7/7 keys exactly once; same subject; same composition generation
  | body variant matches key; body/surface invariants; attribution bounded
  +-- context body missing/not visible --> top-level body=None; STOP
  v
[RunnerReadModel::compose -> redact_for -- pure]
  v
[explicit domain composed section -> public wrapper mapper]
  | missing non-context section => body=None + degraded surface
  | expected generation mismatch => top-level Conflict/Stale
  v
[RunnerQueryResponse<RunnerReadModel>]
```

#### 17.4.3 关键伪代码

```rust
context.assert_query_no_write()?;
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::Canonical(input.subject_ref),
).await?;
let decision = RunnerReadVisibilityDecision::from_resolver(
    visibility.read_subject_ref, visibility.actor_ref, visibility.scope_ref,
    visibility.visibility, visibility.freshness, visibility.degraded,
    visibility.resolution_source_ref, visibility.source_attribution,
)?;
if visibility.read_subject_ref != input.subject_ref || !decision.is_visible() {
    return Ok(RunnerQueryResponse {
        query_name: GetRunnerReadModel,
        surface: decision.response_surface(),
        body: None,
    });
}

let sources = read_sections.load_sources(
    input.subject_ref,
    context.actor_context,
).await?;
if sources.source_attribution.len()
    > embedded_bounds.source_attributions as usize
{
    return Err(ApplicationError::ProjectionContractViolation);
}

let generation = sources.composition_generation;
for section in [
    &sources.context,
    &sources.selection,
    &sources.material,
    &sources.run,
    &sources.resource_cleanup,
    &sources.preview_diagnosis,
    &sources.connectivity,
] {
    if section.subject_ref != input.subject_ref
        || section.surface.read_subject_ref != input.subject_ref
        || section.projection_generation != Some(generation)
        || section.surface.projection_generation != Some(generation)
        || !section_key_matches_body_variant(section.section, &section.body)
    {
        return Err(ApplicationError::ProjectionContractViolation);
    }
    if section.body.is_none() && section.surface.degraded.is_none() {
        return Err(ApplicationError::ProjectionContractViolation);
    }
    assert_inner_surface_matches_wrapper_where_present(section)?;
}

let context_view = match (&sources.context.section, &sources.context.body) {
    (ReadModelSection::Context,
     Some(RunnerReadSectionBody::Context(view)))
        if sources.context.surface.visibility == VisibilityPosture::Visible
            || sources.context.surface.visibility == VisibilityPosture::Partial =>
        view.clone(),
    (ReadModelSection::Context, None) => {
        let surface = merge_more_restrictive_surface(
            decision.response_surface(), sources.context.surface,
        );
        return Ok(RunnerQueryResponse {
            query_name: GetRunnerReadModel,
            surface,
            body: None,
        });
    }
    _ => return Err(ApplicationError::ProjectionContractViolation),
};
if context_view.actor_ref != context.actor_context.actor_ref
    || context_view.scope_ref != visibility.scope_ref
{
    return Ok(body_free_conflict_response(GetRunnerReadModel, decision));
}

// [RunnerReadModel::compose] and [RunnerReadModel::redact_for] are pure.
let composed = RunnerReadModel::compose(sources, generation)?;
let redacted = composed.redact_for(
    context.actor_context,
    VisibilityContext {
        read_subject_ref: input.subject_ref,
        scope_ref: visibility.scope_ref,
        visibility: visibility.visibility,
        freshness: visibility.freshness,
    },
)?;
let mut surface = merge_model_surface(decision.response_surface(), &redacted)?;
if input.expected_generation.is_some_and(|expected| expected != generation) {
    surface = mark_generation_conflict(surface);
}

let public_model = map_composed_model_to_public(redacted)?;
Ok(RunnerQueryResponse {
    query_name: GetRunnerReadModel,
    surface,
    body: Some(public_model),
})
```

`section_key_matches_body_variant` 是 exhaustive 7-way match：Context/Selection/Material/Run/ResourceCleanup/PreviewDiagnosis/Connectivity；body=None只校验key。`assert_inner_surface_matches_wrapper_where_present` 对含inner surface的selection/material/run/resource/preview section要求完全一致；context/connectivity只使用wrapper surface。`map_composed_model_to_public` 逐section构造 `RunnerReadModelSection<T>`，不得serialize domain object或以其他section填洞；availability只由各section可用性派生，绝不等于healthy/running/success。

#### 17.4.4 Generation、partial 与映射规则

| 条件 | response / 规则 |
|---|---|
| canonical subject resolver mismatch | body-free Conflict；不读/不返回另一subject source set |
| any section subject/generation/variant mismatch | projection contract error；不拼跨generation模型 |
| context body missing/restricted不可安全返回 | whole response `body=None`；不造anonymous/default context |
| non-context section body missing | public wrapper `body=None` + typed degraded surface；model availability Partial/Unavailable按规则派生 |
| expected generation matches | normal current/degraded surface按section决定 |
| expected generation mismatches | 当前safe body可返回；top-level Conflict/Stale marker；不refresh、不读取旧generation |
| section stale/restricted | 只影响对应section及overall availability；不能被Connectivity Online覆盖 |
| connectivity Online | 不清除selection/material/run/cleanup/handoff stale/unknown |

#### 17.4.5 状态、副作用、测试与停审

状态改变、UoW、idempotency、repository save/replace、external read、refresh/reconcile/job dispatch、stored result、trace append、outbox与outbound event全部 `none`。Composite model不持久化为第二truth。

测试覆盖：visible complete；context missing→whole body None；每个非context section missing→only that wrapper None + Partial；七种wrong variant；cross-subject/cross-generation；inner/wrapper surface mismatch；attribution overbound；expected generation match/mismatch；stale owner section不被Online覆盖；Accepted不变Running；Confirmed不变Cleaned；Delivered不变evidence；所有replace/refresh/job/external/write spies为0。

停审结论：stable-generation source set、finite variant、context hard gate、section-level partial、expected-generation no-refresh与no-secondary-truth闭合；`FLOW-Q12` `pass_for_logic_with_upstream_blockers`。

### 17.5 Batch 9.2-c 停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| `FLOW-Q09~Q12` 独立覆盖 | 4/4 | §17.1～§17.4 |
| raw diagnostic fallback | prohibited | Q09/Q10只读already-redacted/bounded records；无Diagnostic/Redaction call |
| subject/current index | pass | preview exact subject index；diagnosis canonical exact-set index；不按mtime/latest |
| handoff receipt/evidence | separated | Q11 receipt仅ack ref；Accepted/Delivered不生成evidence/report/verdict/signoff |
| read-model generation | pass | 7 sections same subject/generation/finite variant；mismatch不refresh |
| partial/unavailable | pass | context missing使whole body None；其他missing保留per-section body None |
| Query no-write | pass | 无UoW/idempotency/save/replace/refresh/reconcile/job/outbox |
| Step 6/7/8 fixes | recorded | `RUN-S6-FIX-008~010`、`RUN-S7-FIX-007~008`、`RUN-S8-FIX-004` |
| blockers | preserved | `RUN-UP-004~006/008`、`RUN-DDD-001~003` |

4/4 preview/diagnosis/handoff/read-model Query flow均完成单flow停审；12/12 Query全部完成。下一允许批次为 planned Consumer 9.3 `FLOW-E01~E04`，仅执行blocked-first/header-only路径。

## 18. Planned Consumer flow batch 9.3

本批只实现当前合同允许的安全负向路径。四类 Consumer 的正向 payload schema、source registration、order marker、应用投影和 applied marker 仍受 `RUN-UP-001~005/008` 与 `RUN-S8-OPEN-006` 阻塞；因此本批不得反序列化 payload、计算 payload digest、调用 `RunnerConsumerApplicationService`、写 projection/applied marker 或把 transport ACK 映射为成功。

### 18.1 Shared header-only Consumer template

#### 18.1.1 批次表

| Flow | 协议 | 所属模块 | 目标对象 | 依赖 port | 当前结果 | 停审状态 |
|---|---|---|---|---|---|---|
| `FLOW-E01` | `ConsumeReleaseAuthorityChange` | worker / authority projection | body-free worker result / optional stored receipt replay | `RunnerWorkerDispatchPort`、`RunnerConsumerReceiptRepository`、`StoredRunnerResultRepository`、`RunnerIdGeneratorPort`、`ClockPort` | Blocked/Unsupported/Rejected/Quarantined；已有完整 receipt 才可 Duplicate | planned |
| `FLOW-E02` | `ConsumeSandboxLifecycleChange` | worker / lifecycle projection | body-free worker result / optional stored receipt replay | 同上 | 同上 | planned |
| `FLOW-E03` | `ConsumeRuntimeStatusChange` | worker / runtime projection | body-free worker result / optional stored receipt replay | 同上 | 同上 | planned |
| `FLOW-E04` | `ConsumeHandoffChange` | worker / handoff projection | body-free worker result / optional stored receipt replay | 同上 | 同上 | planned |

#### 18.1.2 统一调用图

```text
[transport/worker receives envelope bytes]
  |
  | inspect framing header only
  v
[RunnerWorkerDispatchPort.check_readiness(header)]
  +-- ApplicationError / marker Unavailable/Degraded --> body-free Blocked; STOP
  +-- marker Blocked ---------------------------------> body-free Blocked; STOP
  +-- marker Unsupported -----------------------------> body-free UnsupportedVersion; STOP
  v
[header completeness and source-family match]
  +-- missing/conflicting safe header --> Rejected; STOP
  v
[optional header.dedup_key]
  +-- absent ---------------------------> do not read receipt; Blocked/Rejected; STOP
  +-- present --> receipt_repo.get_by_dedup_key(...)
                 +-- no record --------> Blocked/Unsupported; STOP
                 +-- record exists ----> exact header comparison
                                      +-- mismatch/missing --> Rejected; STOP
                                      +-- match --> result_repo.get_consumer_receipt(result_ref)
                                                     +-- complete --> Duplicate replay; STOP
                                                     +-- missing/incomplete --> consistency error; STOP

[positive parse / dispatch / projection]
  `unreachable while current readiness is Blocked/Unsupported`
```

#### 18.1.3 共享伪代码与边界

```rust
// [RunnerWorkerDispatchPort.check_readiness(OwnerEventHeaderCandidate header)]
// 只把 framing metadata 交给 readiness；payload 尚未读取/解码。
let readiness = worker_dispatch.check_readiness(header.clone()).await?;
match readiness.state {
    RunnerPortReadiness::Blocked
    | RunnerPortReadiness::Unavailable
    | RunnerPortReadiness::Degraded => {
        // [RunnerConsumerItemResult::blocked(...)]
        return Ok(RunnerConsumerItemResult::blocked(
            entry_ref,
            header.event_ref.clone(),
            issue_from_readiness(readiness),
        )?);
    }
    RunnerPortReadiness::Unsupported => {
        // [RunnerConsumerItemResult::unsupported(...)]
        return Ok(RunnerConsumerItemResult::unsupported(
            entry_ref,
            header.event_ref.clone(),
            issue_from_readiness(readiness),
        )?);
    }
    RunnerPortReadiness::Ready => {
        // 逻辑上暂不可达：Step 8 的 positive payload contract 尚未闭合。
        return Err(WorkerError::PositiveConsumerContractNotAuthorized);
    }
}
```

上段 `issue_from_readiness` 只能是 application-local 的纯 mapper，把有限 readiness marker 映射为已脱敏 `RunnerWorkerIssueRef`；不得保存 config slot、raw error 或 payload。若未来 readiness 真的为 `Ready`，必须先重开 Step 8/本 Step，补齐 typed payload、digest/order、visibility、应用 facade 和存储顺序后，才允许增加正向分支。

Header-only 分支不建立 UoW、不 reserve/complete `RunnerIdempotencyRepository`、不调用 `dispatch_validated`、不调用四个 consumer facade、不调用 canonical payload digest、`save_applied_marker`、projection repository、domain transition、outbox 或 outbound event。它也不发送“成功 ACK”；transport 层若需要确认消费，只能使用与本结果一致的 blocked/unsupported/rejected 语义，不能把网络确认当业务成功。

#### 18.1.4 Stored Duplicate 的严格条件

只有以下条件同时成立时，才允许读取已有 receipt 并返回 `Duplicate`：

1. header 已有正式 framing `dedup_key`；
2. `RunnerConsumerReceiptRepository.get_by_dedup_key(source_family, dedup_key)` 返回完整 stored receipt；
3. stored receipt 的 consumer/source/schema/event/subject/source attribution/trace/dedup 字段与当前 header 逐字段一致；
4. receipt 指向的 `result_ref` 存在，且 `StoredRunnerResultRepository.get_consumer_receipt(result_ref)` 返回完整同族 receipt；
5. receipt 的 disposition 是可重放的 body-free receipt，不能把 `Accepted` 或未闭合的 payload surface 当作当前可应用事实。

任何字段缺失、source family 不匹配、schema 不匹配、dedup 冲突、stored surface 缺失或读取异常，都不能“尽力”当 Duplicate；应返回 body-free `Rejected`/`Blocked` 或 `ApplicationError` consistency failure。不得为了生成 dedup key 而读取 payload、拼接 event ref、使用 arrival time、trace 或本地 hash。

#### 18.1.5 共享停审边界

| 审查项 | 结论 | 依据 / 仍待闭合 |
|---|---|---|
| header 在 payload 前处理 | pass | `OwnerEventHeaderCandidate` / `RunnerInboundEventHeader` |
| readiness blocked/unsupported | pass | 四类当前均不得 Ready |
| positive branch | unreachable | `RUN-S8-OPEN-006` 与上游 event authority |
| duplicate | conditional only | 仅可信 framing dedup + complete stored receipt |
| 新写入 | none | 无 idempotency/applied marker/projection/domain/outbox |
| payload/digest | none | 不解析、不 hash、不保存 opaque bytes |
| quarantine | planned but unreachable | 当前没有正式 isolation port；不得伪造 Quarantined |
| owner truth | unchanged | 不创建/修改 Release、Sandbox、Runtime、Handoff truth |

### 18.2 `FLOW-E01 ConsumeReleaseAuthorityChangeFlow`

#### 18.2.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 | `RunnerInboundEventHeader` / logical key `runner.consumer.ConsumeReleaseAuthorityChange` |
| 入口函数 | `RunnerWorkerDispatchPort.check_readiness(header)`；当前不进入 `RunnerConsumerApplicationService.consume_release_authority_change(...)` |
| source family | `RunnerConsumerSourceFamily::ReleaseAuthority`（public protocol 同名 variant 需显式 match） |
| 目标 | 仅表达 authority event contract 未就绪、版本不支持、header 不完整或已有 receipt duplicate；不改 Selection、Material、Release 或 Governance truth |
| 当前 blocker | `RUN-UP-001/002/008`、`RUN-S8-OPEN-006` |

#### 18.2.2 函数级调用图

```text
[RunnerWorkerDispatchPort.dispatch_candidate(header, opaque item)]
  | read header.source_family/schema/event_ref/dedup_key only
  | assert source_family == ReleaseAuthority
  v
[RunnerWorkerDispatchPort.check_readiness(header)]
  +-- Blocked/Unavailable/Degraded --> RunnerConsumerItemResult::blocked; STOP
  +-- Unsupported -------------------> RunnerConsumerItemResult::unsupported; STOP
  +-- Ready --------------------------> PositiveConsumerContractNotAuthorized; STOP
  v
[header completeness]
  +-- missing event/schema/source attribution/trace --> rejected; STOP
  +-- dedup_key None --------------------------------> blocked; STOP
  v
[RunnerConsumerReceiptRepository.get_by_dedup_key(ReleaseAuthority, dedup)]
  +-- None --> blocked (no new receipt persistence); STOP
  +-- Some(receipt) --> compare exact safe header fields
                         +-- mismatch --> rejected; STOP
                         +-- match --> StoredRunnerResultRepository.get_consumer_receipt(result_ref)
                                      +-- complete --> Duplicate; STOP
                                      +-- missing --> ApplicationError consistency; STOP
```

#### 18.2.3 关键伪代码

```rust
let entry_ref = id_generator.new_worker_entry_ref();
let family = match header.source_family {
    RunnerProtocolConsumerSourceFamily::ReleaseAuthority => RunnerConsumerSourceFamily::ReleaseAuthority,
    _ => return Ok(RunnerConsumerItemResult::rejected(
        entry_ref,
        header.event_ref.clone().map(map_protocol_event_ref),
        issue("consumer_source_family_mismatch"),
    )?),
};

let candidate = OwnerEventHeaderCandidate {
    source_family: family,
    schema_version: map_protocol_schema_version(header.schema_version.clone()),
    event_ref: header.event_ref.clone().map(map_protocol_event_ref),
    dedup_key: header.dedup_key.clone().map(map_protocol_dedup_key),
    source_attribution: header.source_attribution.clone(),
};
let readiness = worker_dispatch.check_readiness(candidate.clone()).await?;
match readiness.state {
    RunnerPortReadiness::Blocked
    | RunnerPortReadiness::Unavailable
    | RunnerPortReadiness::Degraded => {
        return Ok(RunnerConsumerItemResult::blocked(
            entry_ref, candidate.event_ref, issue_from_readiness(readiness),
        )?);
    }
    RunnerPortReadiness::Unsupported => {
        return Ok(RunnerConsumerItemResult::unsupported(
            entry_ref, candidate.event_ref, issue_from_readiness(readiness),
        )?);
    }
    RunnerPortReadiness::Ready => {
        return Err(WorkerError::PositiveConsumerContractNotAuthorized);
    }
}
```

上面的 match 是当前实际可达路径；后续 header completeness / duplicate 分支属于 readiness contract 重新开放后的安全负向接缝，只能在 readiness marker 允许检查 stored receipt 时启用。即使检查 stored receipt，也不调用 `RunnerConsumerApplicationService`，不构造 `OwnerEventEnvelope<ReleaseAuthorityChange>`，不访问 payload bytes。`map_protocol_*` 与 `issue_from_readiness` 均为 application-local 纯 mapper，不能被解释为 Step 7 新增 port。

#### 18.2.4 事务、错误、状态与副作用

| 类别 | 规则 |
|---|---|
| 事务 | no UoW；没有 local transaction A/B。 |
| 错误 | readiness error → body-free Blocked 或 `ApplicationError`；source/schema/header 缺失 → Rejected；unsupported schema → UnsupportedVersion；stored surface 缺失 → consistency `ApplicationError`；不按字符串猜测。 |
| 状态 | 仅可产生 worker item disposition / issue ref；不改 SelectionState、MaterialCacheState、IntegrityPosture、RunIntent 或 owner projection。 |
| receipt | 当前不创建新的 durable receipt；只有已有完整 stored receipt 才可 Duplicate replay。 |
| event/outbox | `none`；不 append、publish、ACK-as-success 或保存 payload snapshot。 |
| quarantine | 当前无 isolation provider，Quarantined 不可达；不得把本地 raw bytes 写入 state store。 |

#### 18.2.5 测试切口与停审

未来测试 double 至少断言：

- source family mismatch 在任何 readiness 之后均 Rejected；
- readiness Blocked/Unsupported 时 payload decoder、digest、consumer facade、projection、idempotency、UoW 和 ACK-success spy 调用次数为 0；
- header 缺 dedup key 时不查询 receipt、不返回 Duplicate；
- 同 dedup 但 source/schema/event/subject/trace 任一不一致时不 replay；
- complete stored receipt 只返回 Duplicate，不重跑 transition；
- stored result 缺失时返回 consistency failure，不伪造 Duplicate；
- 不产生 Release/Approval/Selection 变更，也不产生 outbound event/outbox。

停审结论：`FLOW-E01` 的 header-only blocked/unsupported/rejected 路径、严格 duplicate 前置条件、无 payload parse/apply/no-write 边界闭合；正向 authority payload 仍 `planned/blocked`。`FLOW-E01` `pass_for_logic_with_upstream_blockers`。

### 18.3 `FLOW-E02 ConsumeSandboxLifecycleChangeFlow`

#### 18.3.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 | `RunnerInboundEventHeader` / logical key `runner.consumer.ConsumeSandboxLifecycleChange` |
| 入口函数 | `RunnerWorkerDispatchPort.check_readiness(header)`；当前不进入 `consume_sandbox_lifecycle_change(...)` |
| source family | `RunnerConsumerSourceFamily::SandboxLifecycle` |
| 目标 | 仅返回 blocked/unsupported/rejected 或已有完整 receipt duplicate；不更新 RunIntent、ControlIntent、owner boundary/lease/cleanup projection |
| 当前 blocker | `RUN-UP-003/007/008`、`RUN-S8-OPEN-006` |

#### 18.3.2 函数级调用图

```text
[worker candidate]
  | framing-only source/schema/event/dedup
  v
[family match SandboxLifecycle]
  +-- mismatch --> Rejected; STOP
  v
[check_readiness(header)]
  +-- Blocked/Unavailable/Degraded --> body-free Blocked; STOP
  +-- Unsupported -------------------> body-free UnsupportedVersion; STOP
  +-- Ready --------------------------> PositiveConsumerContractNotAuthorized; STOP
  v
[future safe-header gate only]
  | no dedup -> Blocked; no receipt lookup
  | dedup -> exact stored receipt check only
  v
[positive sandbox payload / lease / boundary dispatch]
  unreachable; no SDK/private implementation call
```

#### 18.3.3 关键伪代码

```rust
let entry_ref = id_generator.new_worker_entry_ref();
let family = match header.source_family {
    RunnerProtocolConsumerSourceFamily::SandboxLifecycle => RunnerConsumerSourceFamily::SandboxLifecycle,
    _ => return Ok(RunnerConsumerItemResult::rejected(
        entry_ref,
        header.event_ref.clone().map(map_protocol_event_ref),
        issue("consumer_source_family_mismatch"),
    )?),
};
let candidate = OwnerEventHeaderCandidate {
    source_family: family,
    schema_version: map_protocol_schema_version(header.schema_version.clone()),
    event_ref: header.event_ref.clone().map(map_protocol_event_ref),
    dedup_key: header.dedup_key.clone().map(map_protocol_dedup_key),
    source_attribution: header.source_attribution.clone(),
};
let readiness = worker_dispatch.check_readiness(candidate.clone()).await?;
match readiness.state {
    RunnerPortReadiness::Blocked
    | RunnerPortReadiness::Unavailable
    | RunnerPortReadiness::Degraded => Ok(RunnerConsumerItemResult::blocked(
        entry_ref, candidate.event_ref, issue_from_readiness(readiness),
    )?),
    RunnerPortReadiness::Unsupported => Ok(RunnerConsumerItemResult::unsupported(
        entry_ref, candidate.event_ref, issue_from_readiness(readiness),
    )?),
    RunnerPortReadiness::Ready => Err(WorkerError::PositiveConsumerContractNotAuthorized),
}
```

Sandbox 的 ACK、request accepted、boundary allocated、lease observed、stop acknowledged 和 cleanup acknowledged 都不是当前 Consumer 的成功依据；它们必须等正式 owner event schema、order/dedup、visibility 和 safe projection contract 闭合后，才由 application facade 显式映射。当前不得订阅或编译 Sandbox 私有实现，也不得以 Docker、gVisor、Firecracker、PID、port、socket 或本地 container 状态补造 payload。

#### 18.3.4 事务、错误、状态与副作用

| 类别 | 规则 |
|---|---|
| 事务 / 持久化 | no UoW、no idempotency reserve、no receipt save、no applied marker、no projection save。 |
| 错误 | readiness blocked/unavailable/degraded → Blocked；unsupported → UnsupportedVersion；family/header mismatch → Rejected；正向 Ready 在当前 contract 中报 `PositiveConsumerContractNotAuthorized`。 |
| 状态 | 不改变 RunIntent、ControlIntent、OwnerRunProjection、ResourceObservation、ProtectionGuard 或 RecoveryCase；只返回 item disposition。 |
| owner boundary | 不创建、租约、释放或清理 Sandbox truth；ACK 不升级 Running/Confirmed/Released/Evicted。 |
| event/outbox | `none`。 |

#### 18.3.5 测试切口与停审

测试必须验证：header-only 调用顺序；payload decoder/digest/private Sandbox client 为 0；blocked 与 unsupported 的 body-free result；缺 dedup 不查 stored receipt；stored duplicate 不调用 facade；ACK/lease/port/PID 绝不改变 Runner 状态；任何本地 quarantine bytes 都不会写入 Runner state store。

停审结论：`FLOW-E02` 只闭合 Sandbox lifecycle 的负向 header path；未把 ACK、lease、boundary 或 cleanup 映射为 Runner/owner 成功。`FLOW-E02` `pass_for_logic_with_upstream_blockers`。

### 18.4 `FLOW-E03 ConsumeRuntimeStatusChangeFlow`

#### 18.4.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 | `RunnerInboundEventHeader` / logical key `runner.consumer.ConsumeRuntimeStatusChange` |
| 入口函数 | `RunnerWorkerDispatchPort.check_readiness(header)`；当前不进入 `consume_runtime_status_change(...)` |
| source family | `RunnerConsumerSourceFamily::RuntimeStatus` |
| 目标 | 仅返回 blocked/unsupported/rejected 或已有完整 receipt duplicate；不把 Runtime 的运行状态、结果、PID、port、socket、stdout/stderr写为 Runner truth |
| 当前 blocker | `RUN-UP-004/008`、`RUN-S8-OPEN-006` |

#### 18.4.2 函数级调用图

```text
[worker candidate]
  | framing-only source/schema/event/dedup
  v
[family match RuntimeStatus]
  +-- mismatch --> Rejected; STOP
  v
[RunnerWorkerDispatchPort.check_readiness(header)]
  +-- Blocked/Unavailable/Degraded --> body-free Blocked; STOP
  +-- Unsupported -------------------> body-free UnsupportedVersion; STOP
  +-- Ready --------------------------> PositiveConsumerContractNotAuthorized; STOP
  v
[future safe-header gate]
  | no dedup -> Blocked; no receipt lookup
  | dedup -> exact stored receipt/header identity comparison
  +-- mismatch/missing --> Rejected; STOP
  +-- complete match --> Duplicate replay; STOP
  v
[Runtime payload decode / status projection]
  unreachable until formal Runtime event contract reopens this flow
```

#### 18.4.3 关键伪代码

```rust
let entry_ref = id_generator.new_worker_entry_ref();
let family = match header.source_family {
    RunnerProtocolConsumerSourceFamily::RuntimeStatus => RunnerConsumerSourceFamily::RuntimeStatus,
    _ => return Ok(RunnerConsumerItemResult::rejected(
        entry_ref,
        header.event_ref.clone().map(map_protocol_event_ref),
        issue("consumer_source_family_mismatch"),
    )?),
};
let candidate = OwnerEventHeaderCandidate {
    source_family: family,
    schema_version: map_protocol_schema_version(header.schema_version.clone()),
    event_ref: header.event_ref.clone().map(map_protocol_event_ref),
    dedup_key: header.dedup_key.clone().map(map_protocol_dedup_key),
    source_attribution: header.source_attribution.clone(),
};
let readiness = worker_dispatch.check_readiness(candidate.clone()).await?;
match readiness.state {
    RunnerPortReadiness::Blocked
    | RunnerPortReadiness::Unavailable
    | RunnerPortReadiness::Degraded => Ok(RunnerConsumerItemResult::blocked(
        entry_ref, candidate.event_ref, issue_from_readiness(readiness),
    )?),
    RunnerPortReadiness::Unsupported => Ok(RunnerConsumerItemResult::unsupported(
        entry_ref, candidate.event_ref, issue_from_readiness(readiness),
    )?),
    RunnerPortReadiness::Ready => Err(WorkerError::PositiveConsumerContractNotAuthorized),
}
```

当前不会把 `RuntimeStatus` header 映射为 `RuntimeSafeSnapshot`，也不会调用 `RuntimeStatusReadPort`；那是未来 validated payload 的 application 责任，不是 worker 的 header inspection。尤其禁止从 PID、port、socket、HTTP health、进程存在、stdout/stderr 或本地连接状态推导 `Running`、`Succeeded` 或 terminal result。`map_protocol_*`、`issue_from_readiness` 是纯 mapper，不是新的 adapter/port。

#### 18.4.4 事务、错误、状态与副作用

| 类别 | 规则 |
|---|---|
| 事务 / 持久化 | no UoW、no idempotency reserve、no consumer receipt save、no applied marker、no `OwnerRunProjectionRepository.save`。 |
| 错误 | readiness blocked/unavailable/degraded → Blocked；unsupported → UnsupportedVersion；family/header mismatch → Rejected；正向 Ready → `WorkerError::PositiveConsumerContractNotAuthorized`；stored surface inconsistency → ApplicationError/Unknown，不重跑。 |
| 状态 | 不改变 `RunIntent`、`OwnerRunProjection`、`RecoveryCase`、`SelectionState` 或 `MaterialCacheState`；只产生 body-free worker item disposition。 |
| truth boundary | Runtime execution/result truth 仍归 Runtime；Runner 不将消息到达、ACK、PID、port、socket 或 local probe 升格为 Running/Success。 |
| event/outbox | `none`；不 append、publish、snapshot 或本地广播。 |

#### 18.4.5 测试切口与停审

测试至少覆盖：Runtime family mismatch；readiness Blocked/Unsupported 的 payload decoder、digest、Runtime read port、projection save、domain transition、UoW 和 ACK-success spy 全为 0；缺 dedup 时不查 receipt；header 精确匹配的 stored receipt 只 replay Duplicate；任何 PID/port/socket/HTTP/local process 信号均不会写 Running/Success；不产生 evidence、report、verdict 或 outbound event。

停审结论：`FLOW-E03` 已闭合 Runtime status 的 header-only negative path，保留 Runtime truth ownership 与 accepted≠running 边界；正向 schema/order/visibility/application mapping 仍 `planned/blocked`。`FLOW-E03` `pass_for_logic_with_upstream_blockers`。

### 18.5 `FLOW-E04 ConsumeHandoffChangeFlow`

#### 18.5.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 | `RunnerInboundEventHeader` / logical key `runner.consumer.ConsumeHandoffChange` |
| 入口函数 | `RunnerWorkerDispatchPort.check_readiness(header)`；当前不进入 `consume_handoff_change(...)` |
| source family | `RunnerConsumerSourceFamily::Handoff` |
| 目标 | 仅返回 blocked/unsupported/rejected 或已有完整 receipt duplicate；不创建 evidence、report、verdict、signoff，也不把 handoff receipt 当成 Observability truth |
| 当前 blocker | `RUN-UP-005/006/008`、`RUN-S8-OPEN-006` |

#### 18.5.2 函数级调用图

```text
[worker candidate]
  | framing-only source/schema/event/dedup
  v
[family match Handoff]
  +-- mismatch --> Rejected; STOP
  v
[RunnerWorkerDispatchPort.check_readiness(header)]
  +-- Blocked/Unavailable/Degraded --> body-free Blocked; STOP
  +-- Unsupported -------------------> body-free UnsupportedVersion; STOP
  +-- Ready --------------------------> PositiveConsumerContractNotAuthorized; STOP
  v
[future safe-header gate]
  | no dedup -> Blocked; no receipt lookup
  | dedup -> exact stored receipt/header identity comparison
  +-- mismatch/missing --> Rejected; STOP
  +-- complete match --> Duplicate replay; STOP
  v
[Handoff payload parse / posture projection]
  unreachable until formal Observability handoff event contract reopens this flow
```

#### 18.5.3 关键伪代码

```rust
let entry_ref = id_generator.new_worker_entry_ref();
let family = match header.source_family {
    RunnerProtocolConsumerSourceFamily::Handoff => RunnerConsumerSourceFamily::Handoff,
    _ => return Ok(RunnerConsumerItemResult::rejected(
        entry_ref,
        header.event_ref.clone().map(map_protocol_event_ref),
        issue("consumer_source_family_mismatch"),
    )?),
};
let candidate = OwnerEventHeaderCandidate {
    source_family: family,
    schema_version: map_protocol_schema_version(header.schema_version.clone()),
    event_ref: header.event_ref.clone().map(map_protocol_event_ref),
    dedup_key: header.dedup_key.clone().map(map_protocol_dedup_key),
    source_attribution: header.source_attribution.clone(),
};
let readiness = worker_dispatch.check_readiness(candidate.clone()).await?;
match readiness.state {
    RunnerPortReadiness::Blocked
    | RunnerPortReadiness::Unavailable
    | RunnerPortReadiness::Degraded => Ok(RunnerConsumerItemResult::blocked(
        entry_ref, candidate.event_ref, issue_from_readiness(readiness),
    )?),
    RunnerPortReadiness::Unsupported => Ok(RunnerConsumerItemResult::unsupported(
        entry_ref, candidate.event_ref, issue_from_readiness(readiness),
    )?),
    RunnerPortReadiness::Ready => Err(WorkerError::PositiveConsumerContractNotAuthorized),
}
```

Handoff 的 `Accepted`、`Delivered`、target receipt、archive reference 或 transport ACK 仅能在未来 formal event contract 中更新 bounded local posture；它们不能生成或携带 evidence、audit report、verdict、signoff，也不能让 `FailureDiagnosis` 变成正式 Observability evidence。当前不得读 raw diagnostic material、调用 redaction 以外的手工补救、调用 Archive 私有实现或重发未知 handoff。

#### 18.5.4 事务、错误、状态与副作用

| 类别 | 规则 |
|---|---|
| 事务 / 持久化 | no UoW、no idempotency reserve、no receipt/applied-marker/projection save；已有完整 receipt 才可 replay。 |
| 错误 | readiness blocked/unavailable/degraded → Blocked；unsupported → UnsupportedVersion；family/header mismatch → Rejected；正向 Ready → `WorkerError::PositiveConsumerContractNotAuthorized`；stored surface inconsistency → ApplicationError/Unknown。 |
| 状态 | 只返回 worker disposition；不改变 `HandoffPosture`、`OutputPreview`、`FailureDiagnosis`、`RecoveryCase` 或任何 evidence/verdict/signoff 状态。 |
| truth boundary | Handoff/Observability/Archive truth 不归 Runner；receipt 不等 delivered，更不等 evidence。 |
| event/outbox | `none`；不 append、publish、handoff、archive 或 evidence event。 |

#### 18.5.5 测试切口与停审

测试至少覆盖：Handoff family mismatch；readiness negative path 的 payload decoder/digest/redaction/raw-log/archive/private-client/UoW/save spy 为 0；缺 dedup 不查 stored receipt；精确 stored duplicate 不重复 handoff；Accepted/Delivered/ACK 不产生 evidence/report/verdict/signoff；不产生 outbound event/outbox。

停审结论：`FLOW-E04` 已闭合 Handoff 的 header-only negative path，并明确 receipt、Archive ref 与 evidence/verdict/signoff 的边界；正向 handoff payload 仍 `planned/blocked`。`FLOW-E04` `pass_for_logic_with_upstream_blockers`。

### 18.6 Batch 9.3 停审

| 审查项 | 结论 | 依据 / 仍待闭合 |
|---|---|---|
| Consumer 数量与入口 | 4/4 | `FLOW-E01~E04` 各自独立 flow；四个 logical key 与 Step 8 一一对应 |
| header/readiness first | pass | 所有 flow 先构造 `OwnerEventHeaderCandidate`，再调用 `RunnerWorkerDispatchPort.check_readiness(...)` |
| positive payload branch | unreachable | `RUN-UP-001~005/008`、`RUN-S8-OPEN-006`；Ready 只能进入显式 contract-not-authorized error |
| payload parsing/digest | none | 不解析 bytes、不计算 payload digest、不使用 generic JSON/map/local hash |
| duplicate | conditional only | 只有可信 framing `dedup_key` + exact header match + complete stored receipt 才可 replay；不创建新 Duplicate |
| writes | none on current path | 不 reserve idempotency、不建 UoW、不写 projection/applied marker/consumer receipt/domain/outbox |
| owner truth | preserved | Release/approval、Sandbox boundary/lease/cleanup、Runtime execution/result、Handoff/evidence 均不由消息到达或 ACK 改写 |
| quarantine | unreachable | 当前没有正式 isolation port；不能将 raw payload 写入 Runner state store |
| per-flow stop review | pass with blockers | `FLOW-E01~E04` 均已停审；positive schema/client/order/visibility 留待 authority reopen |

四条 Consumer 全部完成当前授权范围，下一批进入 `9.4 outbound` no-residue audit；该批只扫描并证明不存在 Runner-owned outbound append/publish surface，不新增 event/outbox/publisher/topic。

## 19. Outbound Event batch 9.4：zero/no-residue audit

### 19.1 审计范围与结论

Step 8 inventory 已明确 Runner Outbound Event 数量为 `0`。本节不定义 flow，而是对 Step 9 全文和四类入口族做 no-residue 审计，防止在 Command、Consumer、Query 或 Job 的副作用字段中隐式添加 local event。

| 审计面 | 检查结果 | 结论 |
|---|---|---|
| Command 11/11 | 每条 flow 的 event/outbox/trace append 字段均为 `none`；accepted 只保存 Runner-owned object、stored result 与 idempotency completion | pass |
| Query 12/12 | 无 UoW、save、refresh、trace append、outbox、publisher、broadcast；Query result 不成为 event snapshot | pass |
| Consumer 4/4 | blocked-first path 不解析 payload、不写 applied marker、不调用 facade；Duplicate 只 replay stored receipt | pass |
| Operations Job 5/5 的预留边界 | job report/checkpoint/result 只描述 local work；不拥有 outbound event，尚待逐 job flow落文 | pass as constraint |
| outbox repository/append/publisher | Step 7 没有 Runner outbox port；Step 8 没有 outbound envelope/topic/payload schema；Step 9 不得临时补齐 | pass |
| event-like local objects | trace、receipt、job report、handoff posture、projection marker、checkpoint 都保持原语义；不升格为 event/audit/evidence truth | pass |
| 技术选择残留 | 未出现 Docker/Tauri/IPC/topic/broker/transport/publisher 技术绑定 | pass |

### 19.2 Allowed / forbidden side effects

| 入口族 | 允许的本地副作用 | 明确禁止 |
|---|---|---|
| Command | versioned Runner object、idempotency record、stored command result、RecoveryCase | outbound event、outbox、publisher、topic、广播；本地 trace 也不能冒充 event |
| Query | none；只读 committed surface | refresh、repair、projection replace、event append、audit append |
| Consumer | 当前只有 body-free worker disposition；未来 Accepted 也只能 safe projection/receipt/applied marker | Runner event、owner truth、last-arrival-wins、raw payload snapshot |
| Job | entry/claim/checkpoint/report/result、local recovery marker | outbound event、owner cursor、evidence/verdict/signoff、隐式 scheduler notification |

### 19.3 No-residue search checklist

后续任何 Step 9 改动必须通过以下文字级检查；出现命中不代表一定违规，但必须回指本节规则并解释其语义：

- `outbound/outbox/publisher/topic/publish/append_event/broadcast` 只能出现在本节的禁止清单、历史冲突扫描或 `event = none` 说明中；不得出现在可执行 flow 调用图中。
- `event` 字段如果出现在 flow 表，只能明确写 `none`；不得写 local event name、payload、delivery、retry 或 snapshot。
- `trace`、`receipt`、`job report`、`checkpoint`、`handoff`、`projection` 不能被命名为 evidence/audit/verdict/signoff 或 outbound message。
- Consumer 的 `RunnerConsumerApplicationService` 只有未来 readiness 全部 Ready 且 Step 8 reopen 后才能调用；本 Step 当前 flow 中调用次数为 0。

### 19.4 Batch 9.4 停审

| 审查项 | 结论 |
|---|---|
| Outbound Event flow count | `0`；不创建独立 outbound flow |
| no-residue audit | pass；Command/Query/Consumer 当前路径无 outbox/publisher/topic |
| Job承接 | 5 条 Job 必须继续携带 `event = none` 与 no-owner-repair 约束 |
| formal document | 不回填正式 `03`；仅保留 calibration evidence |
| 下一允许动作 | 进入 `9.5 Operations Job`，按 `FLOW-J01 → J02 → J03 → J04 → J05` 串行停审 |

## 20. Operations Job flow batch 9.5

本批处理五个显式 Operations Job。Job 只拥有本地 entry、claim、checkpoint、report 与 stored result；任何 `Completed/Partial/Blocked/Failed/Unknown` 都不等于 approved、baselined、running、cleaned、evicted、evidence、verdict 或 signoff。每条 flow 均先经过 §10 的 registry/idempotency/claim/checkpoint 门禁，duplicate 直接 replay 完整 stored `RunnerJobReport`，不重新扫描、不重新调用 adapter。

### 20.1 Shared Operations Job function template

#### 20.1.1 入口与终态顺序

```text
[RunnerOperationsDispatchPort.dispatch_job(entry, finite RunnerJobRequest)]
  | validate variant == metadata.job_kind; validate actor/trace/key/basis/input bounds
  | RunnerOperationsJobEntry::from_metadata(...)
  | RunnerCanonicalDigestPort.digest_write_input(job operation, stable input)
  | RunnerIdempotencyRepository.get(key)
  +-- Completed + same digest --> StoredRunnerResultRepository.get_job_report(result_ref)
  |                              +-- complete --> RunnerOperationsJobResult::duplicate_replayed; STOP
  |                              +-- missing --> consistency Unknown/ApplicationError; STOP
  +-- Reserved -----------------> in-progress/unknown surface; no claim/no facade; STOP
  +-- Conflict -----------------> rejected/conflict; no claim/no facade; STOP
  +-- None ----------------------> [Local tx J-A]
                                      reserve idempotency
                                      save entry Registered(Absent)
                                      create/save local RunnerJobClaim
                                      load/check checkpoint and assert_resumable(basis)
                                      entry.mark_running(); save Exact(version)
                                      commit
                                      v
                                  [RunnerJobApplicationService.<method>]
                                      bounded local/external reads and explicitly allowed writes
                                      each checkpoint update in short versioned UoW
                                      v
                                  [Local tx J-Z]
                                      close checkpoint when safe
                                      release claim or mark Unknown + RecoveryCase
                                      RunnerJobReportAssembly::finish(disposition)
                                      entry.mark_completed(&report) or mark_failed/mark_unknown
                                      save report + operations result
                                      idempotency.complete
                                      commit
```

#### 20.1.2 通用 gate、错误与禁止事项

| 阶段 | 允许 | 失败 / 禁止 |
|---|---|---|
| entry validation | finite job kind、metadata、basis、scope/page/subject bounds | malformed union/one-of → Rejected；不 reserve、不读 repository、不调用 adapter |
| duplicate gate | 仅通过 exact key + stable digest 读取 stored report | 不 acquire claim、不重新 scan、不重做 transfer/verify/reconcile/refresh |
| claim/checkpoint | local exclusive claim、same basis checkpoint、versioned save | 不等 owner lease、owner cursor、process lock；Unknown 不盲 reclaim |
| job body | 只调用该 Job 已列出的 application port/repository；外部 I/O 在 UoW 外 | 不绕过 facade 直连 infra，不把 Query/render 当 job |
| report | refs/counters/typed issue/partial/blocked/unknown | 不保存 raw body、bytes、secret、owner response、test/evidence/verdict |
| terminal write | report、operations result、idempotency completion 同一 local terminal boundary | commit unknown → readback/RecoveryCase；不重跑可能已发生的副作用 |
| event | `none` | 不 append/publish/outbox/topic/broadcast |

#### 20.1.3 通用测试与 truth boundary

每条 Job 至少覆盖：variant/metadata/basis reject；duplicate stored replay；claim conflict；checkpoint stale/unknown；bounded page；adapter Blocked/Unsupported/Unavailable；partial item；terminal commit unknown；report bounds；no owner mutation；no outbound event。所有 test 仍是未来测试切口，不代表已执行。

### 20.2 `FLOW-J01 AcquireAndVerifyMaterialJobFlow`

#### 20.2.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 / 入口 | `RunnerJobRequest::AcquireAndVerifyMaterial` → `RunnerJobApplicationService.acquire_and_verify_material(context, input)` |
| 输入 | exact `task_ref`、`expected_binding`、`expected_authority_ref`、optional checkpoint sequence；不接受 latest/default/path/filename selector |
| 目标 | 将一个 exact acquisition task 按 `resolve → quarantine → transfer → bind → verify → authority recheck → promote` 顺序推进；每个阶段保持 Transfer/Verified/Qualified 分轴 |
| 主要对象 | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture`、`RunnerJobCheckpoint`、`RunnerJobReportAssembly` |
| 主要 port | `AcquisitionTaskRepository`、`ReleaseSelectionRepository`、`ReleaseAuthorityReadPort`、`MaterialSourcePort`、`MaterialCachePort`、`IntegrityVerifierPort`、`MaterialCacheEntryRepository`、`IntegrityPostureRepository`、operations ports |
| 当前 blocker | `RUN-UP-001/002/008`、`RUN-DDD-003`；正向 source/verifier/cache adapter 未 Ready 时只能报告 Blocked/Partial/Unknown |

#### 20.2.2 函数级调用图

```text
[Operations entry + shared J-A]
  v
[AcquisitionTaskRepository.get(task_id)]
  | exact selection_id/binding/state/version check
  v
[ReleaseSelectionRepository.get(selection_id)]
  | compare persisted generation/binding with input.expected_binding
  v
[ReleaseAuthorityReadPort.assess_exact_release(query)] -- outside UoW
  +-- blocked/stale/restricted/unsupported --> report Blocked; no transfer
  v
[AcquisitionTask::begin_resolution; MaterialSourcePort.resolve_source(query)] -- outside UoW
  +-- no safe resolution --> task Failed/Blocked; checkpoint/report; STOP
  v
[Local tx J-1]
  | task.bind_source(locator_ref)
  | save task Exact(version); checkpoint sequence; commit
  v
[MaterialCachePort.open_quarantine_sink(task_id, binding)] -- outside UoW
  +-- blocked/failed/conflict --> report Blocked/Failed; no transfer
  v
[MaterialSourcePort.transfer_to_quarantine(request)] -- outside UoW
  +-- Progress/Paused --> checkpoint and report Partial; bounded continuation
  +-- Unknown --> RecoveryCase/Unknown; no second transfer
  +-- Complete --> bind completion
  v
[MaterialCachePort.bind_completed_material(...)] -- outside UoW
  v
[Local tx J-2]
  | task.complete(handle); create/save cache Quarantined + integrity Pending
  | checkpoint; commit
  v
[IntegrityPosture::begin/begin_verification + IntegrityVerifierPort.verify(...)] -- outside UoW
  +-- failed/unknown/unsupported --> integrity Invalid/Blocked; cache not Qualified
  v
[Local tx J-3]
  | integrity.record_results(...); save posture; checkpoint; commit
  v
[ReleaseAuthorityReadPort.revalidate_authority(binding, expected_authority_ref)] -- outside UoW
  +-- not Current/exact mismatch --> cache/task stale or blocked; no promote
  v
[IntegrityPosture::assert_qualified + MaterialCacheEntry::promote]
  | MaterialCachePort.promote_verified(...) -- outside UoW
  v
[Local tx J-Z]
  | save cache Qualified / terminal task posture / checkpoint close
  | report + result + idempotency complete; commit
```

#### 20.2.3 关键伪代码

```rust
let task_id = input.task_ref.to_persisted_id()?;
let task_v = require_task(task_repository.get(task_id).await?)?;
if task_v.value.selection_binding != input.expected_binding {
    return finish_blocked_job("task_binding_mismatch");
}
let selection_v = require_selection(
    selection_repository.get(task_v.value.selection_id).await?,
)?;
selection_v.value.assert_binding(input.expected_binding.clone())?;

let authority = authority_read.assess_exact_release(
    build_exact_authority_query(input.expected_binding.clone(), input.expected_authority_ref),
).await?;
let authority_assessment = require_current_authority(authority)?;

let source = source_port.resolve_source(MaterialSourceQuery {
    binding: input.expected_binding.clone(),
    authority_ref: input.expected_authority_ref,
    platform_ref: selection_v.value.platform_ref,
}).await?;
let source_resolution = require_current_source(source)?;

let mut task = task_v.value;
task.begin_resolution()?;
let tx_1 = uow_manager.begin().await?;
task.bind_source(source_resolution.locator_ref)?;
let task_version_after_j1 = task_repository.save(
    task.clone(), RunnerExpectedVersion::Exact(task_v.version), tx_1.as_ref(),
).await?;
save_job_checkpoint(job_run_ref, checkpoint_after("source_resolved"), tx_1.as_ref()).await?;
uow_manager.commit(tx_1).await?;

let sink = cache_port.open_quarantine_sink(task_id, source_resolution.binding.clone()).await?;
let sink_ref = require_quarantine_sink(sink)?;
let transfer = source_port.transfer_to_quarantine(MaterialTransferRequest {
    task_id,
    binding: source_resolution.binding.clone(),
    locator_ref: source_resolution.locator_ref,
    quarantine_sink_ref: sink_ref,
    resume_marker: load_matching_resume_marker(input.resume_from_checkpoint).await?,
}).await?;
let completion = require_transfer_complete_or_checkpoint(transfer)?;
let bound_handle = cache_port.bind_completed_material(
    sink_ref, completion, source_resolution.binding.clone(),
).await?;
let material_handle = require_bound_handle(bound_handle)?;

let tx_2 = uow_manager.begin().await?;
task.complete(material_handle)?;
task_repository.save(
    task.clone(), RunnerExpectedVersion::Exact(task_version_after_j1), tx_2.as_ref(),
).await?;
let integrity_posture_id = ids.new_integrity_posture_id();
let integrity_posture_ref = IntegrityPostureRef::from_persisted_id(&integrity_posture_id);
let cache = MaterialCacheEntry::quarantine(
    ids.new_cache_entry_id(), source_resolution.binding.clone(),
    material_handle, integrity_posture_ref,
)?;
cache_repository.save(cache.clone(), RunnerExpectedVersion::Absent, tx_2.as_ref()).await?;
let integrity = IntegrityPosture::begin(
    integrity_posture_id, source_resolution.binding.clone(),
    source_resolution.manifest_ref, authority_assessment.freshness,
)?;
integrity.begin_verification()?;
integrity_repository.save(integrity.clone(), RunnerExpectedVersion::Absent, tx_2.as_ref()).await?;
uow_manager.commit(tx_2).await?;

let verification = verifier.verify(IntegrityVerificationRequest {
    task_id,
    cache_entry_ref: CacheEntryRef::from_persisted_id(&cache.cache_entry_id),
    material_handle,
    source_binding: source_resolution.binding.clone(), manifest_ref: integrity.manifest_ref,
    authority_ref: input.expected_authority_ref, platform_ref: selection_v.value.platform_ref,
}).await?;
let verified = require_verification_result(verification)?;
let tx_3 = uow_manager.begin().await?;
let mut integrity_current = require_integrity(integrity_repository.get(integrity.posture_id).await?)?;
integrity_current.value.record_results(verified.digest_result, verified.signature_result, verified.platform_result)?;
integrity_current.value.assert_qualified(&source_resolution.binding, &verified.authority_freshness)?;
integrity_repository.save(integrity_current.value, RunnerExpectedVersion::Exact(integrity_current.version), tx_3.as_ref()).await?;
uow_manager.commit(tx_3).await?;

let authority_again = authority_read.revalidate_authority(
    input.expected_binding, input.expected_authority_ref,
).await?;
let current_authority = require_current_authority(authority_again)?;
let promotion = cache_port.promote_verified(
    CacheEntryRef::from_persisted_id(&cache.cache_entry_id),
    material_handle, verified, current_authority.authority_ref,
).await?;
let promotion_receipt = require_promotion_confirmed(promotion)?;

let tx_z = uow_manager.begin().await?;
let mut cache_current = require_cache(cache_repository.get(cache.cache_entry_id).await?)?;
cache_current.value.promote(&integrity_current.value, current_authority.authority_ref)?;
cache_repository.save(cache_current.value, RunnerExpectedVersion::Exact(cache_current.version), tx_z.as_ref()).await?;
let report = report_assembly
    .record_acquisition(
        vec![AcquisitionTaskRef::from_persisted_id(&task_id)],
        1,
    )?
    .finish(JobReportDisposition::Completed)?;
save_job_terminal_result(report, promotion_receipt, tx_z.as_ref()).await?;
uow_manager.commit(tx_z).await?;
```

上面 `require_*`、`build_exact_authority_query`、`checkpoint_after`、`finish_blocked_job` 和 `save_job_terminal_result` 仅表示 application-local typed mapper/orchestration；它们不得成为未在 Step 6/7 定义的新 port。`IntegrityPostureId` 与 `IntegrityPostureRef` 由同一次 `new_integrity_posture_id()` 生成和既有 nominal conversion 配对；不得调用不存在的 `new_integrity_posture_ref()`，也不得从字符串拼接 ref。`task_version_after_j1` 必须是第一次 versioned save 的返回 token，不得从旧读取版本猜测。

#### 20.2.4 事务、错误、状态与副作用

| 分支 | 规则 |
|---|---|
| task/selection/binding mismatch | Rejected/Conflict；不打开 sink、不 transfer、不 verify |
| authority/source readiness blocked | `Blocked` report；task 不伪造 Resolving/Complete，保留 issue |
| transfer Progress/Paused | checkpoint + Partial；不把进度当 Complete，不重复启动新 task |
| transfer Unknown / checkpoint unknown | `Unknown + RecoveryCase`；不再次 transfer、不覆盖旧 sink |
| bind/cache failure | Failed/Partial；cache 不进入 Qualified |
| verifier Failed/Unsupported/Unknown | Integrity `Invalid/Blocked`；cache 仍 Quarantined/Stale，不 promote |
| authority recheck mismatch | cache/task stale/blocked；不 promote，即使本地 verifier 通过 |
| promotion confirmed | 仅 local cache `Qualified`；不表达 approved/running |
| terminal commit unknown | readback report/idempotency/cache；不重复 promote |
| event/outbox | `none`；不保存 bytes/digest body、evidence 或 owner result |

#### 20.2.5 测试切口与停审

测试至少覆盖：exact binding与selection id mismatch；authority/source blocked；quarantine sink失败；progress/pause/resume checkpoint；transfer Unknown no-replay；bind/verify/promotion各失败；authority recheck drift；`Complete != Verified != Qualified`；duplicate no-scan/no-port；所有 external call 在 UoW 外；report 不含 bytes/digest/approval；无 event/outbox。

停审结论：`FLOW-J01` 已闭合阶段顺序、版本化 checkpoint、transfer/verify/qualification 分轴和 ambiguous no-replay；正向 Artifact/Governance/source/verifier/cache adapter 仍受 blocker 约束。`FLOW-J01` `pass_for_logic_with_upstream_blockers`。

### 20.3 `FLOW-J02 EvaluateCacheEvictionJobFlow`

#### 20.3.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 / 入口 | `RunnerJobRequest::EvaluateCacheEviction` → `RunnerJobApplicationService.evaluate_cache_eviction(context, input)` |
| 输入 | exact `scope_ref`、bounded `RunnerPageRequest`、optional typed `capacity_observation_ref`；不从磁盘压力、目录顺序或 mtime 选删除对象 |
| 目标 | 扫描有界 eviction candidates，重读每个 subject 的 current protection inputs，记录 `Candidate/NotCandidate/Unknown`；不执行 release/delete/cleanup，不标 `Evicted` |
| 主要对象 | `MaterialCacheEntry`、`ProtectionGuard`、`ResourceObservation`、`RunnerJobCheckpoint`、`RunnerJobReportAssembly` |
| 主要 port | `MaterialCacheEntryRepository`、`ProtectionGuardRepository`、`ResourceObservationRepository`、`SandboxRunPort.read_protection_inputs`、`ArchiveReferencePort`（仅若正式 retention ref 必须读取）、operations ports |
| 当前 blocker | `RUN-UP-003/005~008`、`RUN-DDD-003`；cache physical capability 未闭合时保持 Blocked/Unknown |

#### 20.3.2 函数级调用图

```text
[Operations entry + shared J-A]
  v
[ResourceObservationRepository.get(optional capacity ref)]
  +-- missing/stale/unknown --> retain capacity posture Unknown; do not delete
  v
[MaterialCacheEntryRepository.list_eviction_candidates(scope_ref, page)]
  +-- repository unavailable --> report Blocked/Failed; STOP
  v
[for each bounded candidate]
  | exact cache metadata + version
  | ProtectionGuardRepository.find_by_subject(CacheEntry)
  +-- missing --> guard Unknown; candidate remains protected
  | SandboxRunPort.read_protection_inputs(CacheEntry) -- outside UoW
  | optional formal retention/archive/handoff reads, only when required by declared guard axis
  | ProtectionGuard::evaluate(inputs)
  | MaterialCacheEntry::record_eviction_candidate(posture, observed_at)
  | [short UoW] save guard + cache metadata + checkpoint
  v
[next page / bounded completion]
  +-- page cursor remains --> Partial + checkpoint; no unbounded scan
  v
[terminal report/result/idempotency]
```

#### 20.3.3 关键伪代码

```rust
let capacity = match input.capacity_observation_ref {
    Some(observation_id) => resource_repository.get(observation_id).await?,
    None => None,
};
let capacity_posture = map_capacity_observation(capacity)?; // pure, typed, conservative
let page = cache_repository.list_eviction_candidates(
    input.scope_ref.clone(), input.page.to_repository_page()?,
).await?;
if page.items.len() > bounds.cache_candidates as usize {
    return Err(ApplicationError::RepositoryContractViolation);
}

for candidate_v in page.items {
    let cache_id = candidate_v.value.cache_entry_id;
    let subject = ProtectedSubjectRef::CacheEntry(CacheEntryRef::from_persisted_id(&cache_id));
    let guard_v = guard_repository.find_by_subject(subject).await?;
    let owner_inputs = sandbox.read_protection_inputs(subject).await?;
    let inputs = map_protection_snapshot_with_capacity(
        owner_inputs, capacity_posture, handoff_repository, archive_reference,
    ).await?;

    let mut guard = match guard_v {
        Some(versioned) => versioned,
        None => create_unknown_guard_marker(subject, ids.new_protection_guard_id())?,
    };
    let state = guard.value.evaluate(inputs)?;
    let candidate_posture = if state == ProtectionState::Releasable
        && candidate_v.value.state == MaterialCacheState::Qualified
        && capacity_posture.allows_candidate()
    {
        EvictionCandidatePosture::Candidate
    } else if state == ProtectionState::Protected || state == ProtectionState::Blocked {
        EvictionCandidatePosture::NotCandidate
    } else {
        EvictionCandidatePosture::Unknown
    };
    let mut cache = candidate_v.value;
    cache.record_eviction_candidate(candidate_posture, Some(clock.now().await?))?;
    let tx_i = uow_manager.begin().await?;
    if guard_v.is_some() {
        guard_repository.save(guard.value, RunnerExpectedVersion::Exact(guard.version), tx_i.as_ref()).await?;
    }
    cache_repository.save(cache, RunnerExpectedVersion::Exact(candidate_v.version), tx_i.as_ref()).await?;
    save_job_checkpoint_for_item(job_run_ref, cache_id, tx_i.as_ref()).await?;
    uow_manager.commit(tx_i).await?;
    report_assembly.record_cache(vec![CacheEntryRef::from_persisted_id(&cache_id)], 1)?;
}
```

`map_capacity_observation`、`map_protection_snapshot_with_capacity`、`create_unknown_guard_marker`、`save_job_checkpoint_for_item` 是 application-local pure mapper/orchestration labels；不代表新增 port。若已有 guard 缺失，不能在同一 flow 中凭空持久化一个 releasable guard；可记录 body-free issue/report，或在后续明确的 recovery path 由正式 factory 创建 `Unknown`，当前正向 safe release 不可达。`clock.now()` 只能提供 local observation 时间，不可替代 owner freshness。

#### 20.3.4 事务、错误、状态与副作用

| 分支 | 规则 |
|---|---|
| candidate page unavailable | Blocked/Failed report；不扫描隐藏目录、不按 mtime fallback |
| capacity missing/stale/unknown | 保守 Unknown/NotCandidate；不授予 delete permission |
| guard missing/stale/conflict | candidate `Unknown/NotCandidate`；不释放、不删除 |
| owner protection read blocked | candidate Unknown；checkpoint/report保留 issue |
| guard Releasable + candidate qualified | 只写 `eviction_candidate=Candidate`；不调用 `release_material`/`mark_evicted` |
| page has next cursor | bounded Partial；下一次 job 必须携带明确 checkpoint/basis，不隐式全表扫描 |
| terminal commit unknown | readback candidate/guard/report；不重跑 release/delete |
| event/outbox | `none`；容量/候选报告不产生事件 |

#### 20.3.5 测试切口与停审

测试覆盖 bounded candidate page、scope filter、capacity missing/stale、guard missing/protected/releasable/unknown、owner protection unavailable、candidate state mismatch、next cursor Partial、duplicate no-scan、`release_material`/`mark_evicted`/Sandbox cleanup/delete spy 为 0、mtime/directory order fallback 禁止、report 不表示 eviction。所有 cache physical implementation blocker 保留。

停审结论：`FLOW-J02` 已闭合候选评估、guard 保守语义、分页/checkpoint与“只记录 candidate、不删除”边界；物理 cache/atomic release 仍 blocked。`FLOW-J02` `pass_for_logic_with_upstream_blockers`。

### 20.4 `FLOW-J03 ReconcileRunnerStateJobFlow`

#### 20.4.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 / 入口 | `RunnerJobRequest::ReconcileRunnerState` → `RunnerJobApplicationService.reconcile_runner_state(context, input)` |
| 输入 | exact `recovery_case_id`、expected `RecoveryState`、`RunnerExpectedBasisMarker`；不接受隐式 current case、latest case 或 reconnect 即成功 |
| 目标 | 对 frozen/conflict/unknown/gap case 做 bounded、read-only owner reconciliation，记录 safe snapshots/refs并推进本地 `RecoveryCase`；不重发旧 command、不推进 owner cursor |
| 主要对象 | `RecoveryCase`、`OwnerRunProjection`、`RunnerReadModel` safe sections、`RunnerJobCheckpoint`、`RunnerJobReportAssembly` |
| 主要 port | `RecoveryCaseRepository`、`ContextReadPort`、`ReleaseAuthorityReadPort`、`SandboxRunPort` safe reads、`RuntimeStatusReadPort`、`ObservabilityHandoffPort.read_posture`、`ArchiveReferencePort`（外围）、相关 projection repositories、operations ports |
| 当前 blocker | `RUN-UP-001~008`；owner read schema、source order 与 recovery closure 仍 blocked |

#### 20.4.2 函数级调用图

```text
[Operations entry + shared J-A]
  v
[RecoveryCaseRepository.get(exact case id)]
  +-- missing/state/basis mismatch --> Rejected/Blocked report; STOP
  v
[RecoveryCase::begin_query(local cursor)] -- local short UoW
  v
[formal read-only sources, all outside UoW]
  | ContextReadPort / ReleaseAuthorityReadPort
  | SandboxRunPort.read_safe_snapshot / read_request_outcome
  | RuntimeStatusReadPort.read_by_runtime_run/find_by_sandbox_request
  | ObservabilityHandoffPort.read_posture
  | optional ArchiveReferencePort.read_restore_posture
  +-- Unavailable/Unsupported/Unknown --> record bounded failure; no owner mutation
  v
[RecoveryCase::record_snapshot(OwnerRecoverySnapshot)]
  | compare expected basis with actual safe basis
  +-- exact convergence --> RecoveryCase::reconcile -> Reconciled
  +-- basis conflict ------> reconcile -> Conflict; freeze
  +-- cannot prove ---------> require_manual_review; ManualReview
  v
[Local tx J-R]
  | apply only explicit same-basis run/control/handoff reconcile helpers
  | save case/projection safe markers/checkpoint/report
  | no command/control/cleanup/handoff submission
  v
[terminal report/result/idempotency]
```

#### 20.4.3 关键伪代码

```rust
let case_v = require_recovery_case(
    recovery_repository.get(input.recovery_case_id).await?,
)?;
if case_v.value.state != input.expected_state
    || !case_v.value.expected_basis.matches_marker(&input.expected_basis)
{
    return finish_blocked_job("recovery_basis_or_state_mismatch");
}

let tx_q = uow_manager.begin().await?;
let mut querying = case_v.value;
querying.begin_query(next_local_recovery_cursor(&querying))?;
recovery_repository.save(
    querying.clone(), RunnerExpectedVersion::Exact(case_v.version), tx_q.as_ref(),
).await?;
uow_manager.commit(tx_q).await?;

let context_read = read_context_for_recovery(&querying).await?;
let authority_read = read_authority_for_recovery(&querying).await?;
let sandbox_read = read_sandbox_safe_for_recovery(&querying).await?;
let runtime_read = read_runtime_safe_for_recovery(&querying, sandbox_read.as_ref()).await?;
let handoff_read = read_handoff_posture_for_recovery(&querying).await?;
let archive_read = read_archive_peripheral_for_recovery(&querying).await?;
let actual = build_owner_recovery_snapshot(
    context_read, authority_read, sandbox_read, runtime_read,
    handoff_read, archive_read,
)?;

let tx_r = uow_manager.begin().await?;
let mut current = require_recovery_case(
    recovery_repository.get(input.recovery_case_id).await?,
)?;
current.value.record_snapshot(actual.clone())?;
let disposition = match current.value.reconcile(actual) {
    Ok(RecoveryState::Reconciled) => RecoveryState::Reconciled,
    Ok(RecoveryState::Conflict) => RecoveryState::Conflict,
    Ok(RecoveryState::ManualReview) => RecoveryState::ManualReview,
    other => other?,
};
apply_explicit_same_basis_reconcile_results(
    &current.value,
    &actual,
    tx_r.as_ref(),
)?; // expands only to RunIntent/ControlIntent/HandoffPosture formal reconcile helpers
recovery_repository.save(
    current.value.clone(), RunnerExpectedVersion::Exact(current.version), tx_r.as_ref(),
).await?;
save_safe_projection_refs_without_owner_mutation(&current.value, tx_r.as_ref()).await?;
save_job_checkpoint_for_recovery(job_run_ref, &current.value, tx_r.as_ref()).await?;
let report = report_assembly.record_recovery(
    vec![current.value.recovery_case_id],
    if disposition == RecoveryState::Reconciled { 1 } else { 0 },
)?;
save_job_terminal_report(report.finish(map_recovery_job_disposition(disposition))?, tx_r.as_ref()).await?;
uow_manager.commit(tx_r).await?;
```

`read_*_for_recovery`、`build_owner_recovery_snapshot`、`apply_explicit_same_basis_reconcile_results`、`save_safe_projection_refs_without_owner_mutation` 和 `map_recovery_job_disposition` 均为 application-local orchestration/mapper。`apply_explicit_same_basis_reconcile_results` 只能调用 Step 6 已定义的 `RunIntent::record_reconciled_receipt/reject_after_reconcile/invalidate`、`ControlIntent::reconcile_accepted/reconcile_rejected/mark_conflict` 或 `HandoffPosture::record_receipt`，且只能在 formal safe read 对同一 expected basis 给出明确 posture时调用；不得直改字段、直连 concrete adapter、解析 raw body 或新增 owner mutation port。若任何 formal read 返回 body unavailable，只能写 typed unresolved posture；不得用 local PID/port/log、last arrival、cache 或 reconnect 状态填补 basis。

#### 20.4.4 事务、错误、状态与副作用

| 分支 | 规则 |
|---|---|
| case missing/state/basis mismatch | Rejected/Conflict；不读 owner、不创建新 case、不发 command |
| begin_query commit unknown | Recovery/Unknown；不继续读并声称 Querying 已 durable |
| owner read unavailable/unsupported | 记录 unresolved typed issue；case 保持 Querying/ManualReview，report Partial/Unknown |
| expected/actual basis exact match | case 可转 Reconciled；只表示本地对账完成，不表示 owner operation success |
| basis conflict | case Conflict；冻结危险副作用，不自动重发 |
| insufficient proof | ManualReview；不提供 override，不关闭 case |
| reconnect/Online | 仅作为允许尝试安全 read 的环境提示；不能直接关闭 RecoveryCase |
| event/outbox | `none`；不广播 reconciliation result、不推进 owner cursor |

#### 20.4.5 测试切口与停审

测试覆盖 exact case/state/basis；begin_query crash；各 owner read Current/Stale/Restricted/Unavailable/Unsupported/Unknown；Sandbox accepted不被重发；Runtime PID/port/log不作证据；basis match/conflict/manual review；duplicate no-read/no-facade；owner mutation spies=0；report 只有 recovery/projection refs和local counters。

停审结论：`FLOW-J03` 已闭合 read-only reconciliation、RecoveryCase 状态承接和 no-replay/no-owner-mutation；owner safe read schema 与 exact recovery closure 仍受 blocker 约束。`FLOW-J03` `pass_for_logic_with_upstream_blockers`。

### 20.5 `FLOW-J04 RefreshSafeDiagnosisJobFlow`

#### 20.5.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 / 入口 | `RunnerJobRequest::RefreshSafeDiagnosis` → `RunnerJobApplicationService.refresh_safe_diagnosis(context, input)` |
| 输入 | non-empty bounded `DiagnosticSubjectRefSet`、optional expected `ReadModelGeneration`；不接受 raw path/log selector、空 subject 或自动最新 diagnosis |
| 目标 | 读取 bounded diagnostic material/failure refs，强制 redaction/validation，构造或刷新 `OutputPreview`、`FailureDiagnosis`，保留 stale/restricted/uncertain；不生成 evidence/verdict/signoff，不自动 handoff |
| 主要对象 | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` refs、`RunnerJobCheckpoint`、`RunnerJobReportAssembly` |
| 主要 port | `DiagnosticReadPort`、`RedactionPort`、`OutputPreviewRepository`、`FailureDiagnosisRepository`、`HandoffPostureRepository`、`RunnerReadSectionRepository`（safe section only）、operations ports |
| 当前 blocker | `RUN-UP-004/005/008`、`RUN-DDD-003`；diagnostic/redaction exact DTO 与 local persistence 未闭合 |

#### 20.5.2 函数级调用图

```text
[Operations entry + shared J-A]
  v
[validate non-empty bounded canonical subject set]
  v
[DiagnosticReadPort.read_bounded_material(query)] -- outside UoW
  +-- Restricted/Unavailable/Unsupported --> explicit unavailable preview + uncertain diagnosis; no raw fallback
  v
[RedactionPort.redact(request)] -- outside UoW
  +-- Blocked/Unsupported --> no displayable content; diagnosis Uncertain; STOP item
  +-- Safe/Restricted --> RedactionPort.validate_safe_material(...)
  v
[OutputPreview::compose/unavailable + FailureDiagnosis::diagnose/unavailable -- pure]
  v
[Local tx J-D]
  | exact subject index lookup (get current preview/diagnosis)
  | versioned save preview + diagnosis + safe section refs
  | checkpoint/report; commit
  v
[terminal report/result/idempotency]
```

#### 20.5.3 关键伪代码

```rust
let subjects = input.subject_refs.validate_bounded_unique(bounds.diagnostic_subjects)?;
let material = diagnostic_read.read_bounded_material(DiagnosticReadQuery {
    subject_refs: subjects.clone(),
    result_refs: resolve_formal_result_refs(&subjects)?,
    requested_window: bounded_window_from_input(context)? ,
    requested_bound: bounded_content_limit(context)?,
    actor_context: context.actor_context,
}).await?;

let (preview_candidate, diagnosis_candidate) = match material {
    RunnerSemanticRead::Current { value, attribution } => {
        let redacted = redaction.redact(RedactionRequest {
            material_ref: value.opaque_material_ref,
            actor_context: context.actor_context,
            visibility: VisibilityPosture::Visible,
            required_policy_ref: required_redaction_policy(context)?,
            content_bound: value.bound,
        }).await?;
        match redacted {
            RedactionOutcome::Safe(safe) | RedactionOutcome::Restricted(safe) => {
                redaction.validate_safe_material(
                    safe.clone(), required_redaction_policy(context)?,
                ).await?;
                let preview = OutputPreview::compose(
                    ids.new_output_preview_id(), subjects.clone(),
                    map_safe_output_material(safe.clone()),
                    map_redaction_result(safe), VisibilityPosture::Visible,
                    attribution.freshness, clock.now().await?,
                )?;
                let failure_refs = diagnostic_read.read_safe_failure_refs(subjects.clone()).await?;
                let diagnosis = build_diagnosis_from_safe_refs(
                    ids.new_failure_diagnosis_id(), subjects.clone(), failure_refs,
                    attribution, clock.now().await?,
                )?;
                (preview, diagnosis)
            }
            RedactionOutcome::Blocked(reason) | RedactionOutcome::Unsupported(reason) => (
                OutputPreview::unavailable(
                    ids.new_output_preview_id(), subjects.clone(),
                    empty_safe_source_refs(), VisibilityPosture::Restricted,
                    SourceFreshness::Unknown, map_preview_unavailable(reason),
                    clock.now().await?,
                )?,
                FailureDiagnosis::unavailable(
                    ids.new_failure_diagnosis_id(), subjects.clone(),
                    map_diagnostic_unavailable(reason), clock.now().await?,
                )?,
            ),
        }
    }
    RunnerSemanticRead::Stale { value, attribution, issue_ref } => {
        // Stale material remains opaque and must pass the same mandatory
        // redaction gate. Its attribution is preserved and never upgraded.
        let redacted = redaction.redact(RedactionRequest {
            material_ref: value.opaque_material_ref,
            actor_context: context.actor_context,
            visibility: attribution.visibility,
            required_policy_ref: required_redaction_policy(context)?,
            content_bound: value.bound,
        }).await?;
        match redacted {
            RedactionOutcome::Safe(safe) | RedactionOutcome::Restricted(safe) => {
                redaction.validate_safe_material(
                    safe.clone(), required_redaction_policy(context)?,
                ).await?;
                let preview = OutputPreview::compose(
                    ids.new_output_preview_id(), subjects.clone(),
                    map_safe_output_material(safe.clone()),
                    map_redaction_result(safe), attribution.visibility,
                    attribution.freshness, clock.now().await?,
                )?;
                let failure_refs = diagnostic_read.read_safe_failure_refs(subjects.clone()).await?;
                let diagnosis = build_stale_diagnosis_from_failure_refs(
                    ids.new_failure_diagnosis_id(), subjects.clone(), failure_refs,
                    attribution, issue_ref, clock.now().await?,
                )?;
                (preview, diagnosis)
            }
            RedactionOutcome::Blocked(reason) | RedactionOutcome::Unsupported(reason) => (
                OutputPreview::unavailable(
                    ids.new_output_preview_id(), subjects.clone(),
                    empty_safe_source_refs(), VisibilityPosture::Restricted,
                    attribution.freshness, map_preview_unavailable(reason),
                    clock.now().await?,
                )?,
                FailureDiagnosis::unavailable(
                    ids.new_failure_diagnosis_id(), subjects.clone(),
                    map_diagnostic_unavailable(reason), clock.now().await?,
                )?,
            ),
        }
    }
    RunnerSemanticRead::Restricted { attribution, .. } => (
        OutputPreview::unavailable(
            ids.new_output_preview_id(), subjects.clone(), empty_safe_source_refs(),
            VisibilityPosture::Restricted, attribution.freshness,
            map_preview_unavailable_read(), clock.now().await?,
        )?,
        FailureDiagnosis::unavailable(
            ids.new_failure_diagnosis_id(), subjects.clone(),
            map_diagnostic_unavailable_read(), clock.now().await?,
        )?,
    ),
    RunnerSemanticRead::Unavailable { issue_ref }
    | RunnerSemanticRead::Unsupported { issue_ref } => (
        OutputPreview::unavailable(
            ids.new_output_preview_id(), subjects.clone(), empty_safe_source_refs(),
            VisibilityPosture::Restricted, SourceFreshness::Unavailable,
            map_preview_unavailable_issue(issue_ref), clock.now().await?,
        )?,
        FailureDiagnosis::unavailable(
            ids.new_failure_diagnosis_id(), subjects.clone(),
            map_diagnostic_unavailable_issue(issue_ref), clock.now().await?,
        )?,
    ),
};

let tx_d = uow_manager.begin().await?;
let current_preview = preview_repository.find_for_subjects(subjects.clone()).await?;
let current_diagnosis = diagnosis_repository.find_for_subjects(&subjects).await?;
let preview_expected = current_preview.as_ref().map(|v| RunnerExpectedVersion::Exact(v.version)).unwrap_or(RunnerExpectedVersion::Absent);
let diagnosis_expected = current_diagnosis.as_ref().map(|v| RunnerExpectedVersion::Exact(v.version)).unwrap_or(RunnerExpectedVersion::Absent);
preview_repository.save(preview_candidate.clone(), preview_expected, tx_d.as_ref()).await?;
diagnosis_repository.save(diagnosis_candidate.clone(), diagnosis_expected, tx_d.as_ref()).await?;
save_safe_diagnosis_section_refs(&subjects, &preview_candidate, &diagnosis_candidate, input.expected_projection_generation, tx_d.as_ref()).await?;
save_job_checkpoint_for_diagnosis(job_run_ref, &subjects, tx_d.as_ref()).await?;
let report = report_assembly.record_diagnosis(
    vec![FailureDiagnosisRef::from_persisted_id(&diagnosis_candidate.diagnosis_id)],
    Vec::new(),
)?;
save_job_terminal_report(report.finish(map_diagnosis_job_disposition(&preview_candidate, &diagnosis_candidate))?, tx_d.as_ref()).await?;
uow_manager.commit(tx_d).await?;
```

上面 preview/diagnosis lookup 均使用 Step 7 已定义的 canonical exact-set indexes；不得临时新增 `find_for_subjects_exact` port。`build_diagnosis_from_safe_refs`、`build_stale_diagnosis_from_failure_refs`、`save_safe_diagnosis_section_refs` 等均为 application-local typed mapper/orchestration，不能读取 raw material。Job report 只写正式 schema 已提供的 `diagnosis_refs`；preview 通过其 exact subject index 和 safe section 承接，不把 `OutputPreviewRef` 冒充 `FailureDiagnosisRef` 或 `RunnerProjectionRef`。Redaction 任何失败都只能产生 unavailable/uncertain，不可把空正文当 Safe。

#### 20.5.4 事务、错误、状态与副作用

| 分支 | 规则 |
|---|---|
| empty/unbounded/duplicate subject set | Rejected；不调用 Diagnostic/Redaction、不写入 |
| diagnostic read restricted/unavailable/unsupported | 显式 unavailable preview + uncertain diagnosis；不 raw fallback |
| redaction blocked/unsupported/validation failure | content None / diagnosis Uncertain；不保存原文、不 handoff |
| stale source | 保留 stale/freshness/attribution；不覆盖较新的 exact set，不称 current |
| generation mismatch | Partial/Conflict marker；不 refresh old generation或覆盖新 selection |
| exact current index conflict | body-free Conflict；不按 latest/mtime/last-insert选一条 |
| successful safe material | 只保存 bounded redacted preview/diagnosis；不生成 evidence/report/verdict/signoff |
| event/outbox | `none`；诊断刷新不是 outbound fact |

#### 20.5.5 测试切口与停审

测试覆盖 subject bound/exact-set、diagnostic source各semantic read、mandatory redaction各结果、raw fallback为0、safe material validation、stale/generation mismatch、preview/diagnosis version conflict、duplicate stored replay、handoff submit为0、evidence/verdict/signoff字段不存在、无 outbound event。

停审结论：`FLOW-J04` 已闭合 bounded read→mandatory redaction→preview/diagnosis→versioned save/report；不生成 evidence、不自动 handoff、不 fallback raw。`FLOW-J04` `pass_for_logic_with_upstream_blockers`。

### 20.6 `FLOW-J05 RefreshVisibleSourcesJobFlow`

#### 20.6.1 入口与目标

| 项 | 契约 |
|---|---|
| 协议 / 入口 | `RunnerJobRequest::RefreshVisibleSources` → `RunnerJobApplicationService.refresh_visible_sources(context, input)` |
| 输入 | canonical `subject_ref`、explicit `scope_ref`、non-empty finite `source_kinds`、expected `ReadModelGeneration`、optional bounded page |
| 目标 | 由显式 Job 按 source kind 读取安全来源，构造同一 generation 的 committed sections并条件替换；保留每个 section freshness/visibility/degraded，不把某一来源成功压平为整体健康 |
| 主要对象 | `RunnerReadSection`、`RunnerReadSources`/section wrappers、`RunnerReadModelGeneration`、`ConnectivityView`、`RunnerJobCheckpoint`、`RunnerJobReportAssembly` |
| 主要 port | `RunnerReadSectionRepository`、`ContextReadPort`、`ReleaseAuthorityReadPort`、`SandboxRunPort` safe reads、`RuntimeStatusReadPort`、`DiagnosticReadPort`/`RedactionPort`（仅 safe source）、`ObservabilityHandoffPort.read_posture`、`ArchiveReferencePort`、`PlatformResourcePort`、operations ports |
| 当前 blocker | `RUN-UP-001~008`、`RUN-DDD-003`；exact source adapters、generation persistence 与 physical projection store 未闭合 |

#### 20.6.2 函数级调用图

```text
[Operations entry + shared J-A]
  v
[validate canonical subject/scope/source-kind set/generation]
  +-- mismatch/empty/overbound --> Rejected; STOP
  v
[ContextReadPort.resolve_read_visibility(subject)]
  +-- denied/restricted --> body-free section surface; no protected source read
  v
[for each finite source kind, outside UoW]
  | resolve/read formal safe source with exact subject/scope
  | map source result -> RunnerReadSection (body may be None)
  | preserve source attribution/freshness/visibility/degraded
  +-- source unavailable/unsupported --> explicit section unavailable; continue boundedly
  v
[Local tx J-S per section or bounded batch]
  | load existing section identity/version
  | replace_projection_if_generation_matches(... expected generation ...)
  | save checkpoint/report refs
  v
[terminal report/result/idempotency]
```

#### 20.6.3 关键伪代码

```rust
let source_kinds = input.source_kinds.validate_finite_non_empty(bounds.visible_sources)?;
let visibility = context_read.resolve_read_visibility(
    context.actor_context,
    RunnerReadSubjectLocator::Canonical(input.subject_ref),
).await?;
if visibility.read_subject_ref != input.subject_ref {
    return finish_conflict_job("canonical_subject_mismatch");
}

let mut sections = Vec::new();
for kind in source_kinds.iter() {
    let section = match kind {
        RunnerVisibleSourceKind::Context => load_context_section(
            input.subject_ref, input.scope_ref, context.actor_context,
        ).await?,
        RunnerVisibleSourceKind::ReleaseAuthority => load_release_authority_section(
            input.subject_ref, input.scope_ref, context.actor_context,
        ).await?,
        RunnerVisibleSourceKind::SandboxLifecycle => load_sandbox_section(
            input.subject_ref, input.scope_ref, context.actor_context,
        ).await?,
        RunnerVisibleSourceKind::RuntimeStatus => load_runtime_section(
            input.subject_ref, input.scope_ref, context.actor_context,
        ).await?,
        RunnerVisibleSourceKind::DiagnosticHandoff => load_safe_diagnosis_handoff_section(
            input.subject_ref, input.scope_ref, context.actor_context,
        ).await?,
        RunnerVisibleSourceKind::ArchiveReference => load_archive_reference_section(
            input.subject_ref, input.scope_ref, context.actor_context,
        ).await?,
        RunnerVisibleSourceKind::PlatformResources => load_platform_resource_section(
            input.subject_ref, input.scope_ref, context.actor_context,
        ).await?,
    };
    assert_section_subject_scope_generation(
        &section, input.subject_ref, input.scope_ref, input.expected_projection_generation,
    )?;
    sections.push(section);
}

for section in sections {
    let current = read_sections.load_section_versioned(
        input.subject_ref.clone(), section.section, context.actor_context,
    ).await?;
    let Some(current) = current else {
        report_assembly.record_issue(map_job_issue("projection_identity_missing")?)?;
        continue;
    };
    let Some(projection_ref) = current.value.projection_ref.clone() else {
        report_assembly.record_issue(map_job_issue("projection_identity_missing")?)?;
        continue;
    };
    let tx_s = uow_manager.begin().await?;
    let _version = read_sections.replace_projection_if_generation_matches(
        projection_ref,
        section.clone(),
        input.expected_projection_generation,
        RunnerExpectedVersion::Exact(current.version),
        tx_s.as_ref(),
    ).await?;
    save_job_checkpoint_for_section(job_run_ref, &section, tx_s.as_ref()).await?;
    uow_manager.commit(tx_s).await?;
    report_assembly.record_projection(vec![projection_ref], 1)?;
}
```

`load_*_section`、`assert_section_subject_scope_generation` 与 `expected_version_or_absent` 均为 application-local typed mapper/lookup；`load_section_versioned` 是 Step 7 正式 repository seam，返回的 `RunnerReadSection.projection_ref` 是唯一 projection identity 来源。缺失 identity 只记录 bounded issue/failed item并继续其余有限 sections，最终 disposition 至少为 Partial/Blocked；不得从 subject/ref 字符串拼 projection ref，不得创建缺失 projection identity，不得将 Query 的 `RunnerReadModel::compose` 当 refresh。若 `replace_projection_if_generation_matches` 返回 generation conflict，当前 section report 为 Conflict/Partial；不能读取旧 generation 或覆盖用户新 context/selection。

#### 20.6.4 事务、错误、状态与副作用

| 分支 | 规则 |
|---|---|
| input empty/overbound/subject-scope mismatch | Rejected/Conflict；不读 source、不写 projection |
| visibility denied | body-free section surface；不探测隐藏对象存在性 |
| source Current | 只更新该 source 对应 section；保留 attribution/freshness |
| source Stale/Restricted/Unavailable/Unsupported | 保存显式 degraded/unavailable section或报告 Partial；不以 local fallback覆盖 |
| projection identity missing | failed item/Blocked；不临时拼接或创建未知 ref |
| generation mismatch | Conflict/Partial；旧 section 不覆盖新 generation |
| ArchiveReference unavailable | 外围 section degraded；不改变 core context/selection/material/run truth |
| terminal commit unknown | readback section/report/idempotency；不重试可能已写入的 replace |
| event/outbox | `none`；refresh 不产生 Runner event |

#### 20.6.5 测试切口与停审

测试覆盖 finite source-kind match、canonical subject/scope/generation；visibility denied no-existence-read；各 source semantic read posture；section variant/subject/generation mismatch；projection generation conflict；Archive peripheral degradation；duplicate no-refresh；Query 不被隐式调用；所有 event/outbox/owner mutation spy 为 0。

停审结论：`FLOW-J05` 已闭合显式 source refresh、section-level surface、generation 条件替换与 Archive 外围降级；不由 Query 隐式触发、不创建第二 truth。`FLOW-J05` `pass_for_logic_with_upstream_blockers`。

## 21. Step 9 final cross-flow audit（9.6）

### 21.1 覆盖与停审索引

| 入口族 | 数量 | 独立 flow | 停审结论 |
|---|---:|---|---|
| Command | 11 | `FLOW-C01~C11` | 11/11；每条均有 DTO → context → domain/repository/port → result/idempotency 顺序与测试切口 |
| Query | 12 | `FLOW-Q01~Q12` | 12/12；visibility-first、committed read/no-write、section/page bounds 与 stale surface 已闭合 |
| planned Consumer | 4 | `FLOW-E01~E04` | 4/4；header/readiness-first；当前 positive payload 不可达，不解析、不 hash、不 apply |
| Runner outbound | 0 | no-residue audit | 0；无 outbox/publisher/topic/envelope/schema；receipt/trace/report/projection 不升格 |
| Operations Job | 5 | `FLOW-J01~J05` | 5/5；entry/claim/checkpoint/report/result；外部 I/O 与 local UoW 分离 |

`32/32` flow 均有独立停审；Job 的 J04/J05 前序接缝已回写 Step 6/7，未在本文件新增 port 或隐式 identity。

### 21.2 跨 flow 事务与副作用审计

| 审计轴 | 结论 | 证据 / 强制规则 |
|---|---|---|
| external I/O 与 UoW | pass | Command/Job 的 source、authority、Sandbox、Runtime、diagnostic、redaction、handoff、cache transfer/release 全在 UoW 外；UoW 只包 Runner-owned writes |
| local short transaction | pass | intent/checkpoint/report/idempotency/versioned object 各在 bounded local tx；不可知 commit 走 readback/RecoveryCase，不盲重发 |
| Query no-write | pass | 12 Query 不 reserve idempotency、不 begin UoW、不 save/replace/refresh/reconcile/probe/submit |
| Consumer current path | pass | readiness negative path 不建 UoW、不写 receipt/applied marker/projection、不调用 consumer facade；Duplicate 只读既有完整 receipt |
| Job no-owner-repair | pass | J01 不改 Release/Governance；J02 不 release/delete/evict；J03 不 owner mutation/cursor/replay；J04 不 handoff/evidence；J05 不创造 projection identity |
| outbound residue | pass | flow 中仅 `event = none`；没有 Runner outbox/publisher/topic 或 local event payload |

### 21.3 状态、truth-owner 与 phase boundary 审计

| 轴 | 结论 | 规则 |
|---|---|---|
| selection/authority | pass | `latest`/default/branch 不可表示；approved/baselined/Release truth 只来自 formal authority read |
| acquisition/integrity/qualification | pass | `Complete != Verified != Qualified`；J01 以同一次 ID generator 输出配对 `IntegrityPostureId/Ref`，authority recheck 后才 promote |
| run/control/owner execution | pass | request Accepted 不等 Running；PID/port/socket/ACK/local log 不得升级 owner projection |
| cleanup/protection/cache | pass | `Releasable != Confirmed != Released != Evicted`；J02 只记录 candidate，C09 cleanup/release 仍按四阶段分离 |
| diagnosis/preview/handoff | pass | raw material 必须 bounded + mandatory redaction；diagnosis/preview/handoff receipt 不生成 evidence/report/verdict/signoff |
| recovery/connectivity | pass | reconnect/Online 只允许显式 read/reconcile；不直接关闭 RecoveryCase，不自动 replay |
| projection/read model | pass | section key/body/surface/subject/generation 一致；J05 只替换已存在且有正式 `projection_ref` 的 section |
| consumer | pass | framing `dedup_key` 缺失时不查 receipt；Ready 当前报 contract-not-authorized；不猜 payload/schema/order |
| technology/physical phase | pass | Docker/Tauri/gVisor/Firecracker、路径、store schema、真实 SDK/client 均未被 flow 选定；`RUN-DDD-001~003` 保持 blocked/pending |

### 21.4 幂等、版本与 identity 审计

| 检查 | 结论 |
|---|---|
| Command 11/11 idempotency key + stable digest | pass；same key/digest replay stored result，different digest conflict，unknown 不重跑 |
| Query 12/12 idempotency | pass；Query metadata 禁止 write key/reservation |
| Consumer dedup | pass with blocker；只接受正式 framing `dedup_key`，不得 payload hash/arrival time/local metadata 推导 |
| Job 5/5 idempotency/claim/checkpoint | pass；duplicate replay report，不 rescan；claim/checkpoint unknown 进入 recovery |
| expected version | pass；existing object save 只用 paired `Versioned<T>.version`；J01 保存后使用返回 version，J05 使用 `load_section_versioned` 的 version |
| nominal refs | pass；`*Id ↔ *Ref` 只用 contracts-owned conversion；J05 不从 section kind/subject string 拼 projection ref；J04 不把 preview ref 塞入 diagnosis refs |

### 21.5 Step 6/7/8/9 接缝回写记录

| 修正 ID | 文件 | 内容 | 影响 |
|---|---|---|---|
| `RUN-S6-FIX-012` | `03_ddd_step_06_object_contracts.md` | `RunnerJobReportAssembly` 增加 `record_projection` 与 `record_issue`；report 保持 body-free | 不新增对象/port；J04/J05 report 可落码 |
| `RUN-S7-FIX-010` | `03_ddd_step_07_trait_port_adapter_contracts.md` | `list_eviction_candidates(scope_ref, page)`；增加 `load_section_versioned` | scoped candidate 与既有 projection identity/version 有正式来源 |
| `RUN-S7-FIX-011` | `03_ddd_step_07_trait_port_adapter_contracts.md` | `OutputPreviewRepository.find_for_subjects(exact-set)` | J04 preview replacement 不再使用临时 helper |
| flow 修正 | `03_ddd_step_09_function_flows.md` | J01 ID/version pairing；J02 scoped page；J04 stale redaction、typed diagnosis report；J05 versioned projection carrier | 消除 undefined helper、wrong ref、旧 state variant 接缝 |

### 21.6 Final audit 停审与下一步

| 审查项 | 结论 |
|---|---|
| flow coverage | `32/32` pass |
| cross-flow transaction/UoW | pass |
| state/phase/truth ownership | pass with `RUN-UP-001~008` / `RUN-DDD-001~003` |
| idempotency/dedup/version/ref | pass；positive owner/event/physical seams仍 blocked |
| no-residue outbound | pass；0 event/outbox/publisher/topic |
| formal document write | forbidden；正式 `03-详细设计.md` 保持未修改 |
| implementation/test/commit | forbidden/not run/`commit_required=false` |
| Step 9 status | `completed_with_upstream_blockers`；本 Step 停审 |
| next allowed action | 读取 Step 10 SOP、详细设计书写规范 §5.9 与 `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md`，创建并完成 Runner Step 10；完成后立即停审，不进入 Step 11 |
