# Step 11. 持久化、事务与一致性契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11
> 书写规范：`standards/document/详细设计书写规范.md` §5.10
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
> 回填位置：未来正式 `03-详细设计.md` §10；本文件是 calibration 中间产物
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态与门禁

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` calibration |
| current_step | Step 11 |
| current_module | `persistence:store_transaction_consistency` |
| gate_status | `pass_for_step_12` |
| physical_layout_status | `blocked` (`RUN-DDD-001~003`) |
| upstream_status | `blocked/pending` (`RUN-UP-001~008`) |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建 Step 12 错误模型与恢复中间产物 |

本步只固定 logical persistence contract。没有真实实现仓、语言/runtime、store/backend 或 owner exact schema 时，不生成目录、DDL、migration、Cargo/package 依赖或可用性结论。

## 2. 本步目标、输入与非目标

### 2.1 目标

把 Step 6 的 Runner-owned 对象、Step 7 的 repository/UoW/port、Step 9 的事务顺序和 Step 10 的状态机收束为：

- 数据所有权实现表；
- logical store / collection / projection 契约表；
- repository 函数及版本语义；
- Command、Query、Consumer、Job、handoff 的事务边界；
- generation/version、idempotency/result、checkpoint/claim、receipt 的一致性规则；
- 失败后 stale/unknown/recovery 的恢复口径。

### 2.2 输入

| 输入 | 本步使用内容 | 使用上限 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 17 个正式对象、support carrier、状态和 factory/member method | 不新增对象、字段或状态 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、`RunnerUnitOfWork`、14 required port、result/operations/read-section surface | 不选择具体 backend/transport |
| `03_ddd_step_08_protocol_contracts.md` | 11 Command、12 Query、4 planned Consumer、5 Job、stored result/receipt/report | 不改变 public DTO |
| `03_ddd_step_09_function_flows.md` | reservation、tx A/B、Query no-write、consumer blocked-first、job terminal ordering | 不重写 flow |
| `03_ddd_step_10_state_matrix.md` | 状态转换、generation guard、forbidden/reserved、unknown 规则 | 不新增 transition |
| `设计真相源闭环与可落码性标准.md` | version、result、projection、field/source closure | 未闭合处标 blocker |

### 2.3 非目标

- 不选择数据库、文件 store、lock primitive、schema language、migration 版本或目录路径；
- 不定义 Step 12 的最终错误 enum、Step 13 的 retry 次数或 Step 14 的完整配置；
- 不创建 outbox/topic；Runner outbound event 数量仍为 0；
- 不把本地 persistence/result/projection 提升为 Release、Artifact、Governance、Sandbox、Runtime 或 Observability truth；
- 不把 Query、reconnect、Online、ACK、PID、端口或本地日志当作写入触发器。

## 3. SOP 问题回答

| 问题 | Runner 答案 |
|---|---|
| 哪些数据由本仓拥有？ | explicit context/selection、acquisition task、integrity posture、cache metadata、protection guard、run/control intent、recovery case、handoff posture、bounded preview/diagnosis、connectivity/read sections、idempotency、stored result、entry/consumer/job technical records、adapter/build markers。 |
| 哪些只是引用、快照或投影？ | Release/Artifact/Governance authority、Sandbox request/lease/cleanup、Runtime execution/result、Observability diagnostic/evidence、Archive refs、actor/project/source body 均只以 typed ref、safe snapshot、attribution、freshness、visibility 或 generation 保存。 |
| repository 如何返回？ | 已有对象使用 `Option<Versioned<T>>`；bounded list 使用稳定顺序 `Page<Versioned<T>>`；append-only record 使用 generated id + unique key；所有 existing mutable save 必须带 `RunnerExpectedVersion`。 |
| 哪些 flow 需要事务？ | Command reservation 与 local commit、external-call 前 intent、external outcome 收束、Job claim/checkpoint/report、stored result + idempotency complete、projection replacement、local handoff/receipt 均需要短 UoW；Query 不开启写 UoW。 |
| 是否需要 optimistic version/generation？ | 需要。object version 防 lost update；selection/read-section generation 防旧上下文覆盖；cursor、timestamp、arrival order、PID、HTTP status 不得充当 version。 |
| 失败如何恢复？ | local write/version conflict 返回 Conflict；commit unknown 进入 `Unknown + RecoveryCase`；projection/preview failure 标 stale/degraded；external effect 不明绝不重放；缺 stored surface 不重跑原操作。 |

## 4. 持久化原则与不变量

1. `RunnerUnitOfWork` 只覆盖 Runner-owned local stores；任何 external I/O 必须在 UoW 外。
2. Domain transition、mutable object save、stored result、idempotency completion 的关系必须在本地边界内明确；不得“先副作用后补 reservation”。
3. `ExpectedVersion::Absent` 只用于新 identity；更新必须使用刚读取的 exact version；generation 是业务上下文代际，不等同于存储 version。
4. projection/read section 是 derived local surface；Query 只能读取 committed section，显式 refresh 才可按 generation/version guard replace。
5. append-only trace/receipt/history 不覆盖旧记录；它们不是 owner audit/evidence。
6. `Complete != Verified != Qualified`、`Accepted != Running`、`Confirmed != Cleaned`、`Delivered != evidence/report/verdict/signoff` 在 store 与 transaction 中都必须保持分轴。
7. local corruption、atomicity、durability 或 required version capability 无法证明时，builder 不得 Ready，且不得 fallback 到隐式 in-memory/file store。

## 5. 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| `RunnerContextRef` | domain/context | `FLOW-Q01` / command preflight / explicit refresh | Command、Query、Recovery、projection | safe ref only；scope/visibility/freshness 与 version 配对 |
| `ReleaseSelection` | domain/selection | `FLOW-C01/C02`、J03 invalidation | C03～C11、Q03/Q04/Q06、J01/J03 | explicit exact binding；generation successor；expected version |
| `AcquisitionTask` | domain/material | C03～C06、J01 | Q04、J01、J03 | progress/checkpoint 不代表 verified；bounded update |
| `IntegrityPosture` | domain/material | J01 verifier result / invalidation | Q04/Q05、J01、J03 | manifest/digest/signature/platform result + authority freshness |
| `MaterialCacheEntry` | domain/material | J01 promote、J02 local release | Q04/Q05/Q07、C07/C09 | bytes behind `MaterialCachePort`；metadata state 与 receipt 配对 |
| `ProtectionGuard` | domain/resource | C09/J02/J03 | Q05/Q07、cleanup gate | 缺失/stale/conflict 默认保守；不得由 UI 解除 |
| `RunIntent` | domain/lifecycle | C07、J03 reconcile | Q06、J03 | request axis 与 execution axis 分离；unknown 冻结 |
| `ControlIntent` | domain/lifecycle | C08/C09、J03 reconcile | Q06/Q07、J03 | kind/basis 绑定；Accepted 不等 Confirmed |
| `OwnerRunProjection` | domain/lifecycle | formal safe read / future consumer / J03 | Q06/Q12 | attributed projection；source version/generation 可追踪；不写 owner |
| `RecoveryCase` | domain/recovery | C07～C11/J03 | Q08、J03、Q06/Q07 | ambiguous effect、commit unknown、claim/checkpoint unknown 必须可查询 |
| `OutputPreview` / `FailureDiagnosis` | domain/presentation | J04、bounded diagnostic flow | Q09/Q10、C11 | already-redacted/bounded；无 raw body fallback |
| `HandoffPosture` | domain/presentation | C11/J03/J04 | Q11、J03 | local intent/receipt only；不生成 evidence |
| `ConnectivityView` / `RunnerReadSection` | domain/entry/projection | J05 explicit refresh/reconcile | Q01/Q07/Q12 | section subject/generation/version 一致；Online 不清 business stale |
| `RunnerIdempotencyRecord` | application | every write/consumer/job entry | duplicate gate/replay | key+operation+digest unique；complete 指向 immutable result |
| `StoredRunnerOperationResult` | application | command/consumer/job terminal path | duplicate replay/API/worker/job | complete public safe surface；缺失即 consistency unknown |
| entry/consumer/job records | entry/worker/operations | dispatch/claim/checkpoint/report | operations/query/recovery | local technical state，不升级 owner truth |
| adapter/build markers | infra | builder/readiness | facade/entry/operations | marker 不反写 domain；Configured 不等 Enabled |

## 6. Logical store / collection / projection 契约

本表是 logical contract，不是 DDL。durable adapter 可合并或拆分物理表，但必须保留以下主键、唯一性、索引、version、append-only 和 UoW 语义。

| logical store | 用途 | 主键 / 唯一键 | 必需索引 / lookup | 版本字段 |
|---|---|---|---|---|
| `runner_context_refs` | context safe ref | `context_id`；scope/actor current index | actor+scope、visibility/freshness | `runner_version` |
| `runner_selections` | explicit Release selection | `selection_id`；context+generation | context、generation、state | `runner_version` + immutable `selection_generation` |
| `runner_acquisition_tasks` | material transfer task | `task_id`；selection+attempt | selection/generation、state | `runner_version` |
| `runner_integrity_postures` | verification round | `posture_id`；cache+round | cache entry、binding、state | `runner_version` |
| `runner_cache_entries` | local material metadata | `cache_entry_id`；source binding | selection generation、candidate/state | `runner_version` |
| `runner_protection_guards` | cleanup guard inputs | `guard_id`；subject current index | subject、state、basis | `runner_version` |
| `runner_run_intents` | local run request | `run_intent_id`；formal request ref when present | selection generation、sandbox request ref | `runner_version` |
| `runner_control_intents` | local control request | `control_intent_id`；run+idempotency key | run intent、kind、state | `runner_version` |
| `runner_owner_projections` | attributed owner-safe axes | projection id; owner subject index | run intent/owner subject/source version | `runner_version` |
| `runner_recovery_cases` | local freeze/reconcile | `recovery_case_id`; open subject index | subject set、state、basis | `runner_version` |
| `runner_previews` / `runner_diagnoses` | bounded presentation | preview/diagnosis id; exact subject-set index | exact canonical subject set | `runner_version` |
| `runner_handoffs` | local handoff posture | handoff id; diagnosis ref | diagnosis, state | `runner_version` |
| `runner_read_sections` | committed safe section | formal projection ref; subject+section+generation index | exact subject/section/generation | `runner_version` + `composition_generation` |
| `runner_connectivity_views` | local connectivity projection | context/subject key | subject, observation time | `runner_version` |
| `runner_idempotency_records` | reservation/result binding | operation key unique | channel+operation+digest | `runner_version` |
| `runner_stored_results` | immutable replay surface | result ref unique | operation key/result kind | immutable metadata version |
| `runner_job_entries` / `claims` / `checkpoints` / `reports` | local operations | job run ref / claim ref | kind/state/runnable order | per-record `runner_version` |
| `runner_consumer_receipts` | blocked receipt / strict duplicate | trusted dedup identity unique | source family+dedup key | immutable receipt version |
| `runner_adapter_markers` / `runtime_builders` | infra readiness/build | marker/builder ref | slot/config identity | marker/builder version |

No store may contain Release bytes, raw payload, raw logs, credentials, sandbox private state, owner cursor, formal evidence body, report body, verdict or signoff.

## 7. Repository 函数持久化语义

### 7.1 通用函数规则

| 函数族 | 语义 | 锁/事务 | 返回 | 错误 |
|---|---|---|---|---|
| `get(id)` | exact typed identity read | read-only; no implicit refresh | `Option<Versioned<T>>` | not found / storage error |
| `find_current_*` | formal index + explicit scope/state lookup | read-only; bounded | `Option<Versioned<T>>` | index/visibility/storage error |
| `list_* (page)` | bounded stable ordering | read-only; cursor is page position only | `Page<Versioned<T>>` | invalid page / storage error |
| `save(value, expected, uow)` | optimistic versioned write | caller-owned short UoW | new `RunnerVersion` | version conflict / atomicity / corruption |
| `append(record, unique_key, uow)` | immutable trace/history/receipt | same UoW as requiring transition | generated ref / duplicate marker | duplicate / storage error |
| `replace_projection_if_generation_matches(...)` | guarded derived-section replacement | explicit refresh UoW only | new version or Conflict | generation/version mismatch |

### 7.2 Runner-owned repository surface

The exact trait signatures remain those in Step 7; this table fixes their persistence obligations without inventing new ports.

| repository | required reads | required writes | hard rule |
|---|---|---|---|
| `RunnerContextRepository` / `ReleaseSelectionRepository` | exact id, current-by-scope, bounded generation list | save with expected version; allocate generation in same UoW | no latest-by-time; no generation from timestamp |
| `AcquisitionTaskRepository` / `IntegrityPostureRepository` / `MaterialCacheEntryRepository` | exact id, binding/current, bounded runnable/candidate page | save metadata only | no bytes/path discovery; candidate does not delete |
| `RunIntentRepository` / `ControlIntentRepository` / `OwnerRunProjectionRepository` | exact id, request/run/subject indexes | save local axes with expected version | projection cannot mutate intent or owner |
| `ResourceObservationRepository` / `ProtectionGuardRepository` / `RecoveryCaseRepository` | exact/current subject and bounded open case scans | save observation/guard/case | no resource allocation; no automatic close/reclaim |
| `OutputPreviewRepository` / `FailureDiagnosisRepository` / `HandoffPostureRepository` | exact subject or canonical exact-set index | save bounded redacted objects | no raw read, redaction, evidence creation or mtime latest |
| `RunnerReadSectionRepository` | committed section/source, versioned section for explicit refresh | generation-guarded replace | missing projection identity returns `None`, never upsert |
| `RunnerIdempotencyRepository` / `StoredRunnerResultRepository` | key/shell/result/report/receipt | reserve, complete, conflict; save immutable surface | complete+missing surface => unknown, no replay |
| `RunnerOperationsRepository` | entry/claim/checkpoint/runnable page | local claim/checkpoint/report | claim ≠ Sandbox lease; unknown no reclaim |
| `RunnerConsumerReceiptRepository` | strict stored receipt and future marker | current negative receipt only; applied marker reserved | no owner cursor or payload parsing |

## 8. 事务边界表

| 场景 | 开始位置 | 提交位置 | 回滚/未知条件 | 同事务内必须完成 |
|---|---|---|---|---|
| `C01 SelectRelease` | idempotency reservation后 | selection + stored result + idempotency complete | version/storage failure rollback；commit unknown→RecoveryCase | exact selection、result shell/surface、complete record |
| `C02 InvalidateSelection` | loaded selection/generation | selection fence + local affected freezes where safely versioned | any conflict保留 old state并报告 conflict；partial propagation→RecoveryCase | selection invalidation fence；不得写 owner |
| `C03~C06` acquisition commands | reservation后、external read前 | task/selection local transition + result | external read unavailable→blocked/stored result；commit unknown→RecoveryCase | local task/intent transition、stored result、idempotency |
| `J01 AcquireAndVerify` stage | job claim/entry tx | each bounded checkpoint; terminal tx | checkpoint/version ambiguity→Unknown+case | checkpoint and local task/cache/integrity writes belonging to same stage |
| `C07 RequestRun` tx A | reservation + preflight complete | Draft→Submitting intent | tx A unknown→readback reservation; no external call | intent, basis, metadata, entry/result shell as specified |
| `C07` tx B | after one Sandbox call | typed receipt/rejection/unknown + result + idempotency | commit unknown→read-only reconcile; no resend | intent outcome, stored surface, recovery case if needed, complete |
| `C08/C09` control/cleanup | durable control intent before external call | accepted/rejected/unknown or local release receipt | ambiguous effect→RecoveryCase; never auto-repeat | intent/effect posture, result, protection evidence references |
| `J03` reconcile | read-only owner/local reads outside UoW | local reconciled posture and recovery closure | read unavailable remains open/manual review | only local posture/case/result; no owner mutation |
| `C10/C11` review/handoff | reservation and bounded source read | local recovery/handoff posture + safe receipt | redaction/visibility failure→blocked; no raw package | local posture, stored result, correlation refs |
| planned Consumer | header/readiness before any payload | body-free blocked receipt or strict duplicate replay | missing/ambiguous stored receipt→blocked/unknown | receipt/result only; no positive apply marker |
| `J02/J04/J05` jobs | entry+claim+checkpoint transaction | bounded report/section replacement terminal tx | claim/checkpoint/report commit unknown→RecoveryCase | claim/checkpoint/report/result/idempotency; generation guard for J05 |
| Query `Q01~Q12` | no write UoW | no commit | read failure maps body-free/degraded/unknown surface | none; no reservation/save/refresh/reconcile |

### 8.1 Command external-I/O ordering

```text
[validate + reserve idempotency]
              |
              v
       [Local tx A commit]
              |
              v
     [one external read/effect]
       | explicit     | ambiguous
       v              v
[Local tx B]   [readback/recovery tx]
       |              |
       +------> [stored surface + idempotency complete]
```

The diagram is a semantic ordering contract, not an implementation or transport choice.

### 8.2 Query no-write boundary

Queries may read committed objects and sections, compose public views, and return freshness/visibility/degraded markers. They must not reserve idempotency, allocate generation, begin UoW, save, replace projection, refresh source, probe resources, reconcile cases, dispatch jobs, call cleanup, or create audit/evidence.

## 9. 一致性策略表

| 一致性问题 | 规则 | 失败表面 | 恢复方式 |
|---|---|---|---|
| lost update | every mutable save uses exact `RunnerVersion` | `Conflict` | reread; do not overwrite |
| selection generation race | allocate successor and save fence atomically | `Conflict/Blocked` | new explicit selection or J03 case |
| idempotency reservation crash | read reservation before any external call | `Unknown/InProgress` | readback/reconcile; no replay |
| stored result missing | idempotency Completed but result absent is inconsistency | `Unknown` + RecoveryCase | repair local store under later approved recovery; no operation rerun |
| external effect ambiguity | owner readback with same basis | `Unknown` | RecoveryCase; no resend/reclaim |
| projection stale/failure | derived section marked stale/failed | degraded/stale view | explicit J05 refresh with existing identity/generation |
| generation mismatch | reject old section replacement | `Conflict` | reload current generation; no overwrite |
| partial selection invalidation | selection fence commits first; downstream pages bounded | `Partial/Unknown` local report | J03 reconcile/manual review; owner truth untouched |
| cache metadata vs bytes | metadata never assumes bytes from path existence | `Blocked/Unknown` | MaterialCachePort formal read; no delete/promote |
| claim/checkpoint ambiguity | local claim and checkpoint are versioned | `Unknown` | RecoveryCase; no automatic reclaim/resume |
| receipt duplicate | strict header/dedup identity + complete stored receipt | `Duplicate` or `Blocked` | missing fields remain blocked |

## 10. Projection and generation consistency

1. `RunnerReadSection.composition_generation` is allocated by an explicit local generation source; it is not an owner event sequence or wall-clock timestamp.
2. J05 may call `load_section_versioned` only for an existing formal projection identity; `None` is `Blocked`, not permission to create one.
3. `replace_projection_if_generation_matches` compares requested subject, section key, expected generation, and local expected version in one guarded write.
4. Query composition does not replace sections. `Online`, reconnect, render, or cache hit cannot clear `Stale/Unknown/Conflict` business surfaces.
5. A section with `body=None` remains a committed bounded unavailable/restricted/disabled section and participates in the same composition generation.

## 11. Idempotency, stored-result and append-only consistency

| 记录 | 原子关系 | 不允许 |
|---|---|---|
| `RunnerIdempotencyRecord` + command result | result surface first, then `complete(record,result_ref)` in same terminal UoW | external effect before reservation; result reconstructed from current state |
| Job entry + claim + checkpoint | claim and entry state versioned; checkpoint basis exact | claim treated as owner lease; unknown auto reclaim |
| Job report + stored report + idempotency | report disposition preserved variant-for-variant, then complete | `Blocked` compressed to `Partial/Failed`; duplicate rescan |
| Consumer receipt + stored receipt | body-free negative receipt or complete strict duplicate surface | payload hash/parse to manufacture dedup |
| Handoff posture + local receipt | local intent/receipt only | receipt promoted to evidence/report/verdict/signoff |
| Trace/history | append-only with unique transition key | overwriting history or using local trace as formal audit |

## 12. Failure recovery table

| 失败点 | 已提交内容 | 本地处理 | 后续允许动作 |
|---|---|---|---|
| reservation commit unknown | unknown | read reservation; if uncertain create/associate RecoveryCase | read-only reconciliation |
| external call timeout | tx A intent | mark intent `Unknown`, store safe result | formal owner readback only |
| terminal result commit unknown | external effect may exist | do not resend; reconcile idempotency/result/owner | new intent only after explicit closure |
| version conflict | no candidate overwrite | return Conflict and preserve current record | reread/reissue with new basis |
| projection replace conflict | old section retained | return conflict/degraded item | explicit refresh from current generation |
| local store unavailable/corrupt | no unsafe write | `ApplicationError`/blocked readiness | repair infrastructure; no fallback store |
| partial job page | prior checkpoints | report Partial/Blocked with bounded items | later explicit job run; no hidden replay |
| missing stored duplicate surface | idempotency marker exists | consistency Unknown + recovery | local store repair; never rerun operation |

## 13. Cross-step closure audit

| 审计项 | 结论 | 依据 / blocker |
|---|---|---|
| owner truth boundary | pass | Step 6/7/10；local stores只保存 refs/projections |
| every mutable object has version source | pass for logical contract | physical schema/backend `RUN-DDD-003` |
| every repository read needed by flow exists | pass | Step 7 repository matrix、Step 9 flow inventory |
| Query no-write | pass | Step 9 §8、Q01～Q12 |
| idempotency/result atomicity | pass for semantic order | durable adapter not available (`RUN-DDD-001~003`) |
| generation guard | pass | Step 7 read-section port、Step 10 §10.4 |
| external I/O outside UoW | pass | Step 9 §7、§10 |
| outbound event/outbox | not applicable | Runner outbound event count 0 |
| exact owner schema / positive consumer | blocked | `RUN-UP-001~008` |

## 14. Reserved / blocked surfaces carried forward

- physical store/backend, migration, locking and corruption repair remain `RUN-DDD-003`;
- exact SDK client/error/redaction/trace mapping remains `RUN-UP-008`;
- positive Artifact/Governance/Sandbox/Runtime/Observability adapters remain blocked;
- planned Consumer positive apply, applied marker and owner ordering remain reserved;
- no Step 11 decision selects Docker/Tauri/Electron/gVisor/Firecracker/Rust/store product.

## 15. Step 12 handoff

Step 12 must derive exact error classes and public mappings for: `InvalidStateTransition`, `Conflict`, `Blocked`, `Unknown`, `NotVisible`, storage failure/corruption, external unavailable/unsupported, redaction failure, duplicate result missing, claim/checkpoint ambiguity, and projection generation conflict. Each error must preserve the transaction/recovery rules above and must not turn Unknown into Failed or Accepted into Running.

## 16. Step 11 完成条件与停审

| 条件 | 结论 |
|---|---|
| 数据所有权实现表 | completed |
| logical store / key / index / version 表 | completed as semantic contract |
| repository 函数和读取面 | completed by Step 7 + persistence obligations |
| Command/Query/Consumer/Job/UoW 边界 | completed |
| projection/generation/idempotency consistency | completed |
| failure recovery and no-replay rules | completed |
| physical implementation / backend | blocked and explicitly not selected |
| Step 12 gate | `pass_for_step_12` |

Step 11 完成。本文不证明任何 store、adapter、测试、baseline、run、report、evidence、verdict、signoff 或 readiness 已存在。
