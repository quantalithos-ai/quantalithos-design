# Step 10. 状态机与转换矩阵

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10
> 回填章节：未来正式 `03-详细设计.md` §9；本 Step 不修改正式文档
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md`
> 生成日期：2026-09-21
> 状态：`completed_with_upstream_blockers`
> 物理实现状态：`blocked`；本文只固定逻辑状态、转换前置条件、非法转换和副作用边界，不证明实现仓、runtime、adapter、测试或 readiness 存在

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` calibration |
| current_step | Step 10 |
| current_module | `state_matrix:final_cross_state_audit` |
| gate_status | `stop_review_required` |
| gate_reason | 10.1～10.6、单机停审、跨状态副作用/forbidden/reserved/truth-owner 审计已完成；保留 `RUN-UP-001~008`、`RUN-DDD-001~003` |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 等待用户审查/明确授权；若继续，先读取 Step 11 SOP/书写规范与 L1-governance Step 11；不得直接修改正式 03 |

## 2. 本步目标、输入与非目标

### 2.1 目标

把 Step 6 已定义的 domain、projection、worker、entry、idempotency 与 job state enum，与 Step 9 已完成的 Command / Query / Consumer / Job flow 逐一闭合为可落码状态矩阵：

- 先确认哪些对象确实拥有独立生命周期；
- 排除 ref/id、value object、DTO wrapper、外部 owner truth、cache/lock/retry counter 和无独立迁移的 marker；
- 每个状态机使用 Step 6 原 enum variant，不新增同义状态；
- 每个转换回指 Step 6 factory/member method 或 Step 9 flow；
- 明确前置条件的 typed source、version、visibility、basis 与 readiness；
- 区分 domain method 的字段变化与 application flow 的 local write/result/recovery side effect；
- 对非法转换统一给出 `DomainError::InvalidStateTransition` / `ApplicationError::InvalidStateTransition` 占位，精确错误 taxonomy 留 Step 12；
- 明确 `reserved`、`blocked`、`planned` 与当前 boundary 不调用的转换。

### 2.2 输入

| 输入 | 本 Step 使用内容 | 使用上限 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 17 个正式对象、支撑 carrier、state enum、factory/member method、不变量 | 不新增对象或状态名；缺口先回写 Step 6 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | versioned repository、safe read、readiness、projection/ref/repository 来源 | 不选择 backend、SDK、transport 或 schema |
| `03_ddd_step_08_protocol_contracts.md` | Command/Query/Consumer/Job disposition、DTO、generation、receipt/report surface | DTO disposition 不改写 domain truth |
| `03_ddd_step_09_function_flows.md` | 32 条 flow 的触发顺序、UoW、unknown、no-write、no-owner-repair 规则 | 不重新设计 flow；状态冲突需回退 Step 9 |
| `详细设计讨论流程_SOP.md` Step 10、书写规范 §5.9 | 筛选表、状态族、ASCII、矩阵、停审和跨机审计 | 本文件是 calibration，不是正式 §9 |
| `L1-governance` Step 10 | 逐状态机粒度、停审格式、跨状态族审计方式 | 不继承 Governance 状态名或 outbox truth |

### 2.3 非目标

- 不定义 Step 11 的数据库 schema、锁、原子 primitive、migration 或 corruption repair algorithm；
- 不定义 Step 12 的最终错误码、HTTP/RPC 映射、retry/dead-letter 策略；
- 不创建实现仓、implementation ledger、boundary skeleton、测试结果、baseline、run_id、artifact、report、evidence、verdict、signoff 或 readiness；
- 不把 Runner local state、job report、receipt、projection、diagnosis 或 connectivity view 反写成 Release/Artifact/Governance/Sandbox/Runtime/Observability truth；
- 不新增 GlobalState/SystemState，不把不同状态族揉成一套全局状态机；
- 不进入 Step 11；完成本 Step 后立即停审。

## 3. SOP 问题回答

| 问题 | 本仓答案 |
|---|---|
| 哪些候选是正式状态主语？ | `SelectionState`、`AcquisitionState`、`IntegrityState`、`MaterialCacheState`、`ProtectionState`、`RunIntentState`、`ControlIntentState`、`RecoveryState`、`HandoffState`、`ConnectivityState`、`RunnerIdempotencyState`、`RunnerEntryState/RunnerHandlerDisposition`、`RunnerConsumerLoopState/RunnerConsumerItemDisposition`、`RunnerJobEntryState/RunnerJobClaimState/RunnerCheckpointState/RunnerJobDisposition`、`RunnerAdapterAvailabilityState/RunnerRuntimeBuildState`。 |
| 哪些候选排除？ | 所有 `*Id`/`*Ref`、binding、basis、source attribution、reason value、page/cursor、digest、raw/material handle、DTO wrapper、`RunnerReadModelAvailability` 派生枚举、`EvictionCandidatePosture` 观察字段、`LocalResourcePosture` observation、owner execution/approval/release truth、cache lock/retry counter 均不单独创建状态机。 |
| 状态族如何分组？ | A business/local truth；B source/integrity/protection；C owner request/control/recovery/handoff；D read/presentation/projection；E technical idempotency/entry/worker/job；F infra availability/build。 |
| 非法转换怎么处理？ | domain method 返回 `DomainError::InvalidStateTransition`；application/entry/worker/job 映射为 `ApplicationError::InvalidStateTransition` 或 typed rejected/conflict/blocked surface；不猜字符串，不静默 no-op。 |
| Query 如何处理状态？ | 只读取 committed object/section 并保留 stale/restricted/degraded surface；不触发 transition、refresh、reconcile、probe、cleanup 或 job。 |
| planned/blocked 如何处理？ | Consumer positive states `Accepted/GapDetected/Delayed/Quarantined` 只作为 future/reserved shape；当前 readiness 未 Ready 时不调用正向 transition。 |
| terminal 如何处理？ | `Invalidated/Cancelled/Failed/Rejected/Evicted` 等 terminal 或 local terminal posture 不原地重开；需新 selection/task/intent/job entry 或正式 replacement flow。Recovery `Closed` 只表示本地收束，不表示 owner success。 |

## 4. 状态主语筛选表

| 候选主语 | 来源对象 / 字段 | 是否进入 Step 10 | 原因 | 状态族 |
|---|---|---|---|---|
| Release selection | `ReleaseSelection.state: SelectionState` | 进入 | Runner-owned selection lifecycle，C01/C02/C03/Q03 读取和推进 | A business/local truth |
| Acquisition task | `AcquisitionTask.state: AcquisitionState` | 进入 | J01/C03~C06/Q04 的 transfer lifecycle | A business/local truth |
| Integrity posture | `IntegrityPosture.state: IntegrityState` | 进入 | J01 verifier/authority recheck 推进 | B source/integrity |
| Material cache | `MaterialCacheEntry.state: MaterialCacheState` | 进入 | J01/C07/C09/J02/Q04/Q05 的 local material qualification/release | B source/integrity |
| Eviction candidate | `MaterialCacheEntry.eviction_candidate: EvictionCandidatePosture` | 排除独立机 | bounded observation field，无独立 transition owner；由 J02 记录，不能授予 delete | B observation |
| Protection guard | `ProtectionGuard.state: ProtectionState` | 进入 | C09/J02 guard evaluate/release gate | B protection |
| Local resource observation | `ResourceObservation.posture: LocalResourcePosture` | 排除独立机 | platform observation，不拥有 lease/allocation lifecycle；Q05/Q07/J02 只读取 | B observation |
| Run intent | `RunIntent.state: RunIntentState` | 进入 | C07/C08/Q06/J03 读取和推进本地 request posture | C owner request |
| Control intent | `ControlIntent.state: ControlIntentState` | 进入 | C08/C09/Q06/J03 记录 control/cleanup effect posture | C owner control |
| Owner run projection | `OwnerRunProjection` 多轴字段 | 排除独立机 | attributed projection，不自行迁移；由 formal read/consumer/reconcile replacement 更新 | D projection |
| Recovery case | `RecoveryCase.state: RecoveryState` | 进入 | C07~C11/J03/Q08 冻结与只读对账 | C recovery |
| Diagnostic handoff | `HandoffPosture.state: HandoffState` | 进入 | C11/Q11/J04 交接 intent/receipt | C handoff |
| Output preview / diagnosis | `PreviewSafetyPosture`、`DiagnosisCertainty` 等 | 排除独立机 | 派生 safety/certainty posture，不作为业务 lifecycle；J04 refresh 后由 object fields替换 | D presentation |
| Read model availability | `ReadModelAvailability` | 排除独立机 | 纯 composition derivation；Q12/J05 不改变 business state | D presentation |
| Connectivity view | `ConnectivityView.state: ConnectivityState` | 进入 | presentation projection 有独立 refresh/reconcile posture；不反写业务 truth | D presentation |
| Idempotency record | `RunnerIdempotencyRecord.state: RunnerIdempotencyState` | 进入 | C/Job/Consumer duplicate/conflict gate | E technical |
| Stored result | `RunnerStoredResultKind` / result ref | 排除独立机 | kind/ref 是 immutable classification/identity；result surface由 idempotency state承接，不另造 lifecycle | E technical |
| Entry invocation | `RunnerEntryState`、`RunnerHandlerDisposition` | 进入（两个相关但分开的技术机） | entry validation/dispatch/result surface | E technical |
| Consumer loop | `RunnerConsumerLoopState` | 进入 | worker lifecycle independent of owner truth | E technical |
| Consumer item | `RunnerConsumerItemDisposition` | 进入（item disposition） | 每个 framing item 的 blocked/unsupported/rejected/duplicate boundary | E technical |
| Job entry | `RunnerJobEntryState` | 进入 | Operations entry local lifecycle | E technical |
| Job claim | `RunnerJobClaimState` | 进入 | local exclusive claim，不能等 owner lease | E technical |
| Job checkpoint | `RunnerCheckpointState` | 进入 | bounded resume/unknown/stale/closed | E technical |
| Job report/result | `RunnerJobDisposition` | 进入 | local report terminal posture，不能等 owner success | E technical |
| Adapter availability | `RunnerAdapterAvailabilityState` | 进入 | readiness gate and degraded/blocked surface | F infra |
| Runtime builder | `RunnerRuntimeBuildState` | 进入 | composition lifecycle before facade exposure | F infra |
| `RunnerReadSection` | `surface/body/generation` | 排除独立机 | section replacement is version/generation conditional write, not a free-running enum; Step 10 only audits generation guard | D projection |
| Owner approval/running/lease/evidence | upstream refs/postures | 排除 | external truth owned by Artifact/Governance/Sandbox/Runtime/Observability; Runner only reads safe projection | External truth |
| IDs/refs/bindings/bases/cursors | shared carriers | 排除 | identity/value objects without lifecycle | Value/identity |

## 5. 状态族分组与批次计划

| 批次 | 状态族 | 状态机 | 所属模块 | 主要触发 flow / 函数 | 停审顺序 |
|---|---|---|---|---|---|
| 10.1 | A business/local truth | `SelectionState`、`AcquisitionState` | domain/material | C01~C06、J01、Q03/Q04；`select`、`begin_resolution`、`complete`、`pause`、`resume`、`cancel` | 逐机停审 |
| 10.2 | B source/integrity/protection | `IntegrityState`、`MaterialCacheState`、`ProtectionState` | domain/material/resource | J01/J02、C09、Q05/Q07；`begin_verification`、`record_results`、`promote`、`evaluate`、`mark_evicted` | 逐机停审 |
| 10.3 | C owner request/control/recovery/handoff | `RunIntentState`、`ControlIntentState`、`RecoveryState`、`HandoffState` | domain/lifecycle/recovery/presentation | C07~C11、J03/J04、Q06/Q08/Q11；`mark_submitting`、`record_receipt`、`request_control`、`begin_query`、`reconcile`、`prepare/submit/record_receipt` | 逐机停审 |
| 10.4 | D read/presentation/projection | `ConnectivityState`、section generation guard | entry/domain/projection | Q01/Q07/Q12、J03/J05；`with_recovery`、`mark_manual_review`、`replace_projection_if_generation_matches` | 逐机停审 |
| 10.5 | E technical intake/replay/job | `RunnerIdempotencyState`、`RunnerEntryState`、`RunnerHandlerDisposition`、`RunnerConsumerLoopState`、`RunnerConsumerItemDisposition`、`RunnerJobEntryState`、`RunnerJobClaimState`、`RunnerCheckpointState`、`RunnerJobDisposition` | application/entry/worker/operations | all Command/Query/Consumer/Job；reserve/complete、entry dispatch、loop start/delay/stop、claim/release、checkpoint assert/close | 逐机停审 |
| 10.6 | F infra availability/build + final audit | `RunnerAdapterAvailabilityState`、`RunnerRuntimeBuildState`；跨机审计 | infra | builder/readiness and all flow gates | final stop |

## 6. 通用矩阵规则

| 规则 | Runner 正式口径 |
|---|---|
| 状态名 | 必须与 Step 6 enum variant 完全一致；public disposition 若与 domain state 同名，必须通过模块/对象前缀区分 |
| 触发函数 | 只能引用 Step 6 factory/member method、Step 9 flow/application service、Step 7 repository marker update；不以 UI action、ACK、PID、HTTP status 作为 state transition |
| 前置条件 | 只能引用 typed DTO input、formal read result、visibility/freshness、paired `Versioned<T>.version`、expected binding/basis、guard、readiness marker 或 stored result |
| Domain side effect | 仅更新对象自身字段/state；不写 trace、audit、outbox、projection、result store |
| Application side effect | 按 Step 9 flow 在短 UoW 中 save object/checkpoint/report/idempotency/recovery/projection；外部 I/O 永远在 UoW 外 |
| Query | 只 read committed state/section；不得迁移、repair、refresh、reconcile、probe 或 reserve |
| Illegal transition | domain：`DomainError::InvalidStateTransition`；application/entry/worker/job：typed `Rejected/Conflict/Blocked/Unknown` 或 `ApplicationError::InvalidStateTransition` |
| Unknown | 不当作 failure/success；需要 readback/RecoveryCase；禁止自动 replay可能已发生的外部 effect |
| Terminal | terminal/local closed posture 不原地 reopen；新 intent/task/selection/job entry 或明确 replacement flow |
| Reserved | 当前 positive consumer `Accepted/GapDetected/Delayed/Quarantined` 与未 Ready adapter path 标 reserved/blocked；当前不调用 |

## 7. 批次 10.1：business / local truth 状态矩阵

### 7.1 `SelectionState`

所属对象：`domain::ReleaseSelection`；enum：Step 6 `SelectionState`；主要 flow：`FLOW-C01`、`FLOW-C02`，`FLOW-C03/J01/Q03` 只读门禁。

```text
[ReleaseSelection]
  factory -> Selected -> Checking -> Current
                          |  |       | \
                          |  +------>|  Stale
                          +---------> Blocked

  Current/Stale/Blocked -- explicit new authority check --> Checking
  Selected/Checking/Current/Stale/Blocked -------------> Invalidated
  Invalidated ------------------------------------------> terminal
```

关键说明：

- `Current` 只表示 exact Release/version/scope/generation 的正式 authority 当前且 approved/baselined/active；不表示材料已取得、已验证或可运行。
- 当前 flow 只有新 selection 在 `FLOW-C01` 执行 `Selected -> Checking -> result`；旧 `Current/Stale/Blocked -> Checking` 是已定义但当前无独立入口调用的 reserved requalification 形状。
- `Invalidated` 终态必须通过新 selection 与 successor generation 重选，不能原地恢复。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Selected` | exact immutable refs 已由显式输入建立，authority 尚未检查 | 否 | `begin_authority_check`、`invalidate` |
| `Checking` | 正在比较正式 Release/Governance authority | 否 | `bind_authority`、`mark_authority_stale`、`mark_authority_blocked`、`invalidate` |
| `Current` | formal authority 与 exact binding 当前且通过 | 否 | side-effect gate 只读；显式 recheck；`mark_authority_stale`、`invalidate` |
| `Stale` | 曾可用 basis 已过期或漂移 | 否 | 显式新 basis recheck；`invalidate` |
| `Blocked` | contract/visibility/authority 无法证明资格 | 否 | 显式新 basis recheck；`invalidate` |
| `Invalidated` | generation/source/context 已被明确失效 | 是 | 无；创建新 selection |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Selected` | `ReleaseSelection::select(...)` | `FLOW-C01` | context usable；release/version/scope 非空且 exact immutable；拒绝 latest/default/mutable selector；generation 由 repository allocator 给出 | 写 selection identity/binding/generation；authority/reason 为空 | tx A 以 `Absent` 保存；不调用 authority、不生成 approval | `ApplicationError::InvalidStateTransition` / invalid input |
| `Selected` | `Checking` | `begin_authority_check()` | `FLOW-C01` | persisted exact selection 尚未 invalidated；同一 tx 内 generation fence 已建立 | state=`Checking`；不写 authority ref | tx A versioned save 后才在 UoW 外做 authority read | `DomainError::InvalidStateTransition` |
| `Current` / `Stale` / `Blocked` | `Checking` | `begin_authority_check()` | reserved explicit requalification；当前无独立 boundary 调用 | 新的正式 recheck operation 已固定 same selection/generation；不得由 Query/render/reconnect 触发 | state=`Checking`；旧 authority 不授予副作用 | 当前 phase 不调用；未来启用须先回 Step 8/9 增加明确 flow | `DomainError::InvalidStateTransition` |
| `Checking` | `Current` | `bind_authority(authority_ref, freshness)` | `FLOW-C01` | formal assessment 与 persisted binding/generation exact match；visible/current；approved+baselined+active；freshness=`Current` | 写 authority ref；清 reason；state=`Current` | tx B save Exact(version)，随后存 result并完成 idempotency | `DomainError::InvalidStateTransition` |
| `Checking` / `Current` | `Stale` | `mark_authority_stale(reason)` | `FLOW-C01` 对 Checking；Current 源漂移形状 reserved | typed reason；正式 freshness/basis stale；不得以 cache/history 判断 | state=`Stale`；写 reason；旧 authority 不再可用于 side effect | C01 tx B versioned save；reserved path 当前不隐式执行 | `DomainError::InvalidStateTransition` |
| `Checking` | `Blocked` | `mark_authority_blocked(reason)` | `FLOW-C01` | formal read restricted/unavailable/unsupported，或结果不能证明 exact approved/baselined/active | state=`Blocked`；写 reason；不得伪造 authority ref | tx B 保存明确 blocked local posture和stored result | `DomainError::InvalidStateTransition` |
| `Selected` / `Checking` / `Current` / `Stale` / `Blocked` | `Invalidated` | `invalidate(reason, next_generation)` | `FLOW-C01` prior user change；`FLOW-C02` | typed invalidation；`next_generation.is_successor_of(current)`；paired expected version | state=`Invalidated`；写 reason与generation fence；不改 owner truth | 先提交 selection fence，再分页冻结旧 material/integrity/run；partial propagation走RecoveryCase | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 六个 variant 与 Step 6 一致，无同义状态 |
| 触发函数 | 通过 | `select/begin_authority_check/bind_authority/mark_authority_stale/mark_authority_blocked/invalidate` 均存在 |
| 前置条件 | 通过 | exact binding、generation、authority ref/freshness 与 versioned repository 均有正式来源 |
| 非法转换 | 通过 | `Invalidated -> any`、未检查直接 Current、Blocked/Stale 隐式恢复均拒绝 |
| 副作用 | 通过 | domain 仅改 selection；无 event/outbox；owner Release/Governance truth 不写 |
| 测试切口 | 通过（未来） | exact selector、authority三结果、generation successor、terminal no-reopen、reserved path不调用、Current≠Qualified |

### 7.2 `AcquisitionState`

所属对象：`domain::AcquisitionTask`；enum：Step 6 `AcquisitionState`；主要 flow：`FLOW-C03~C06`、`FLOW-C02`、`FLOW-J01`，`FLOW-Q04` 只读。

```text
[AcquisitionTask]
  factory -> Absent -> Resolving -> Transferring -> Complete
                         |              |   ^
                         +-----> Paused +---+
                                    |
                                    +-------> Complete

  Absent/Resolving/Transferring/Paused -> Failed
  Absent/Resolving/Transferring/Paused -> Cancelled
  Complete/Failed/Cancelled ------------> terminal
```

关键说明：

- `Complete` 只表示 transfer ended 且存在 quarantine handle；它不等于 `IntegrityState::Verified` 或 `MaterialCacheState::Qualified`。
- `Paused -> Transferring` 前必须重验 selection generation、authority 与 source basis；本地点击或 reconnect 不足以恢复。
- terminal task 不原地复用；重试必须建立新 task/operation basis。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Absent` | persisted task 已建立，尚未解析正式 source | 否 | `begin_resolution`、`fail`、`cancel` |
| `Resolving` | 正式 locator/transport constraint 正在解析 | 否 | `bind_source`、`record_progress`、`pause`、`fail`、`cancel` |
| `Transferring` | bytes 正进入 quarantine sink | 否 | `record_progress`、`pause`、`complete`、`fail`、`cancel` |
| `Paused` | transfer 被本地暂停，未声称 transport 停止成功 | 否 | `record_progress`、`resume`、`complete`、`fail`、`cancel` |
| `Complete` | transfer 已结束且绑定 opaque local handle | 是（本 task） | 只读；J01 后续另建 cache/integrity 对象 |
| `Failed` | transfer/source 以 redacted failure 收束 | 是 | 无；新 task 才可重试 |
| `Cancelled` | local acquisition intent 已取消 | 是 | 无；不表示 sink/cache已清理 |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Absent` | `AcquisitionTask::start(...)` | `FLOW-C03` | persisted selection `Current`；selection id与exact binding一致；authority revalidated；new task id | 写 selection id/binding；locator/progress/handle/failure 为空 | local tx save Absent + stored command result + idempotency complete；不下载 | `ApplicationError::InvalidStateTransition` / invalid input |
| `Absent` | `Resolving` | `begin_resolution()` | `FLOW-J01` | exact task/selection/input binding一致；authority/source readiness可调用；job claim/checkpoint basis有效 | state=`Resolving`；不生成 locator | 在 external source read 前持久化或由同阶段 version fence保护；无 qualification | `DomainError::InvalidStateTransition` |
| `Resolving` | `Transferring` | `bind_source(locator_ref)` | `FLOW-J01` | formal current source resolution与task binding匹配；locator ref非空且不含secret/body | 写 locator ref；state=`Transferring` | short UoW save Exact(version)+checkpoint；actual transfer在UoW外 | `DomainError::InvalidStateTransition` |
| `Resolving` / `Transferring` / `Paused` | same state | `record_progress(progress)` | `FLOW-J01` | progress bounded、同一 binding、observed_at来自trusted clock/source；不得倒退/越界 | 仅替换bounded progress；不改 qualification | optional versioned checkpoint/save；不产生 success | `DomainError::InvalidStateTransition` |
| `Resolving` / `Transferring` | `Paused` | `pause(reason)` | `FLOW-C04`；J01 safe pause result | typed reason；exact task/binding/version；无 terminal state | state=`Paused`；保存 reason/progress，不造 checkpoint ACK | C04 local tx + stored result；不调用 transfer/cache release | `DomainError::InvalidStateTransition` |
| `Paused` | `Transferring` | `resume(binding)` | `FLOW-C05` | persisted binding exact；selection仍Current；authority/source current；无 unresolved transfer ambiguity | state=`Transferring`；binding不变 | C05只保存local state；J01后续才继续transfer | `DomainError::InvalidStateTransition` |
| `Transferring` / `Paused` | `Complete` | `complete(material_handle)` | `FLOW-J01` | formal transfer completion与same sink/binding匹配；cache provider已bind opaque handle；handle非空 | 写 handle；state=`Complete`；不写 integrity/cache qualification | 同一 short UoW创建 cache Quarantined、integrity Pending；不跨轴升级 | `DomainError::InvalidStateTransition` |
| `Absent` / `Resolving` / `Transferring` / `Paused` | `Failed` | `fail(failure)` | `FLOW-J01` | typed/redacted failure；若外部 effect outcome ambiguous则不得走Failed，必须RecoveryCase/Unknown | state=`Failed`；failure必填；不保留raw transport | save task/checkpoint/report；不自动 retry或delete sink | `DomainError::InvalidStateTransition` |
| `Absent` / `Resolving` / `Transferring` / `Paused` | `Cancelled` | `cancel(reason)` | `FLOW-C06`；`FLOW-C02` invalidation propagation | typed reason；version/binding匹配；若 transfer outcome ambiguous同时创建/关联RecoveryCase | state=`Cancelled`；写 reason；不写cleanup/release结论 | local versioned save；正在运行job在下个gate观察；不把cancel当ACK | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 七个 variant 与 Step 6 一致 |
| 触发函数 | 通过 | factory及 begin/bind/progress/pause/resume/complete/fail/cancel 均存在 |
| 前置条件 | 通过 | exact selection/binding、formal locator、opaque handle、version与recovery来源闭合 |
| 非法转换 | 通过 | terminal不重开；Absent不可直接transfer/complete；Paused不可无重验resume |
| 副作用 | 通过 | task不保存bytes/secret；Complete不跨轴升级；event/outbox none |
| 测试切口 | 通过（未来） | 全from-state、progress self-update、pause/resume basis、unknown no-fail/no-replay、terminal no-reopen |

### 7.3 批次 10.1 停审

| 审查项 | 结论 |
|---|---|
| 状态机完成数 | 2/2 |
| business/local truth 分轴 | selection authority posture 与 transfer lifecycle 未混合 |
| terminal/new-attempt 规则 | Invalidated需新selection；task terminal需新task |
| owner truth 边界 | Release/Governance authority只读；transfer complete不改Artifact truth |
| 当前 blocker | `RUN-UP-001/002/008` 与 physical store/cache blocker保留；正向路径不宣称ready |
| 下一批 | 10.2 `IntegrityState -> MaterialCacheState -> ProtectionState` |

## 8. 批次 10.2：source / integrity / protection 状态矩阵

### 8.1 `IntegrityState`

所属对象：`domain::IntegrityPosture`；enum：Step 6 `IntegrityState`；主要 flow：`FLOW-J01`、`FLOW-C02`，`FLOW-Q04` 只读。

```text
[IntegrityPosture]
  factory -> Pending -> Verifying -> Verified
                 \           \----> Invalid
                  \----------------> Blocked

  Pending/Verifying/Verified -- source or authority drift --> Stale
  Pending/Verifying/Verified -- proved mismatch -----------> Invalid
  Pending/Verifying/Verified -- contract unavailable ------> Blocked
  Verified/Stale/Invalid/Blocked ----------------------------> no in-place reverify
```

关键说明：

- `Verified` 只证明同一 immutable material binding 下的 digest/signature/platform checks；不证明 Release approval、Sandbox acceptance、running 或成功。
- `record_results` 的结果映射已在 Step 6 固定：全量通过且 authority current 才 `Verified`；明确失败为 `Invalid`；unknown/unsupported或authority非Current为 `Blocked`。
- `Stale/Invalid/Blocked` 不原地改回 `Verified`；新验证轮次必须创建新 `IntegrityPosture`，防止改写历史结果。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | manifest/basis 已绑定，验证尚未开始或输入待齐 | 否 | `begin_verification`、`record_results`、`invalidate` |
| `Verifying` | verifier 正在对同一 binding 做检查 | 否 | `record_results`、`invalidate` |
| `Verified` | 所有 required checks 对 current basis 通过 | 是（本轮） | `assert_qualified`；basis drift 时 `invalidate` |
| `Invalid` | 已证明检查失败或 binding 不匹配 | 是 | 无；新 posture 才可重验 |
| `Stale` | 曾有结果，但 source/authority basis 已不当前 | 是 | 无；新 posture 才可重验 |
| `Blocked` | contract/policy/visibility/verifier不足以证明结果 | 是 | 无；新 posture 才可重验 |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `IntegrityPosture::begin(...)` | `FLOW-J01` | formal manifest ref、same immutable source binding、authority freshness显式；ID/ref同一次生成 | 写manifest/binding/freshness；检查结果不得默认Passed | 与 cache Quarantined 在同一 local tx 以Absent保存；不调用verifier | `ApplicationError::InvalidStateTransition` / invalid input |
| `Pending` | `Verifying` | `begin_verification()` | `FLOW-J01` | manifest/binding完整；required verifier/readiness可调用；authority basis非缺失 | state=`Verifying`；结果保持未决 | 先持久化/建立version fence，verifier I/O在UoW外 | `DomainError::InvalidStateTransition` |
| `Pending` / `Verifying` | `Verified` | `record_results(digest, signature, platform)` | `FLOW-J01` | digest=`Passed`；signature=`Passed`或owner明确`NotRequiredByOwnerPolicy`；platform=`Compatible`；authority_freshness=`Current` | 原样写三结果；state=`Verified` | versioned save posture；仍需authority recheck和cache promote | `DomainError::InvalidStateTransition` |
| `Pending` / `Verifying` | `Invalid` | `record_results(...)` | `FLOW-J01` | digest/signature任一`Failed`或platform=`Incompatible`；结果来自formal verifier | 写完整结果；state=`Invalid` | save posture/checkpoint/report issue；cache不得promote | `DomainError::InvalidStateTransition` |
| `Pending` / `Verifying` | `Blocked` | `record_results(...)` | `FLOW-J01` | 任一required result=`Unknown/Unsupported`，或authority freshness非Current；不能以其余Passed覆盖 | 写可得结果；state=`Blocked` | save bounded issue；cache保持Quarantined/Stale；不fallback本地hash/policy | `DomainError::InvalidStateTransition` |
| `Pending` / `Verifying` / `Verified` | `Stale` | `invalidate(SourceOrAuthorityStale)` | `FLOW-C02`；J01 authority recheck drift | formal source/authority/generation漂移；typed reason | state=`Stale`；既有check result不可重写 | versioned save；旧material side-effect gate失效 | `DomainError::InvalidStateTransition` |
| `Pending` / `Verifying` / `Verified` | `Invalid` | `invalidate(VerificationFailedOrMismatched)` | `FLOW-C02/J01` explicit mismatch path | formal binding/check mismatch可证明 | state=`Invalid`；保留原结果及typed cause | save/report；不修改Artifact content | `DomainError::InvalidStateTransition` |
| `Pending` / `Verifying` / `Verified` | `Blocked` | `invalidate(ContractUnavailableOrUnsupported)` | `FLOW-J01` blocked path | required contract/policy/visibility/verifier不可证明 | state=`Blocked`；不伪造新检查结果 | save/report blocked；无qualification | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 六个状态名与 Step 6 一致 |
| 触发函数 | 通过（经最小回写） | `record_results` finite mapping与`IntegrityInvalidation`三类映射已补齐，不留实现猜测 |
| 前置条件 | 通过 | check enum、manifest/binding、authority freshness均有Step 6/7/8来源 |
| 非法转换 | 通过 | terminal posture不原地重验；Verified不得由部分结果产生 |
| 副作用 | 通过 | 仅保存本地验证姿态；不创建approval/evidence，不修改Release body |
| 测试切口 | 通过（未来） | result笛卡尔映射、authority非Current、terminal no-reopen、Verified仍需cache promotion |

### 8.2 `MaterialCacheState`

所属对象：`domain::MaterialCacheEntry`；enum：Step 6 `MaterialCacheState`；主要 flow：`FLOW-J01`、`FLOW-C02`、`FLOW-C09`，`FLOW-J02/Q04/Q05` 只读或同状态更新。

```text
[MaterialCacheEntry]
  factory -> Quarantined -> Qualified
                |              |
                +------------> Stale
                |              |
                +------------> Invalid

  Quarantined/Qualified/Stale/Invalid -- safe release confirmed --> Evicted
  Evicted --------------------------------------------------------> terminal
```

关键说明：

- `Quarantined`、`Qualified`、`Evicted` 分别是本地材料隔离、资格与安全释放姿态，不是 Artifact Release truth。
- `Candidate`、last-used、protection refs 的更新不迁移 `MaterialCacheState`；尤其 candidate 不允许触发 `Evicted`。
- `mark_evicted` 必须发生在 formal cleanup（若适用）、第二次 current guard评估和local release receipt之后。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Quarantined` | bytes 位于不可信隔离区，尚未满足资格 | 否 | `promote`、`mark_stale`、`mark_invalid`、保护/candidate metadata更新、safe release |
| `Qualified` | current verified binding 可进入run gate | 否 | side-effect gate只读；`mark_stale`、`mark_invalid`、保护/candidate metadata更新、safe release |
| `Stale` | source/generation/authority漂移，禁止复用 | 否（可释放） | `mark_invalid`、保护/candidate metadata更新、safe release；不得promote |
| `Invalid` | integrity/compatibility明确失败 | 否（可释放） | 保护/candidate metadata更新、safe release；不得promote |
| `Evicted` | local material经安全release后不再可用 | 是 | 只读metadata；不得重建/复用同entry |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Quarantined` | `MaterialCacheEntry::quarantine(...)` | `FLOW-J01` | transfer `Complete`；opaque material handle已由cache provider绑定；same source binding；integrity posture ref存在 | 写binding/handle/posture ref；candidate默认保守；state=`Quarantined` | 与task Complete、integrity Pending在local tx保存；不公开path/bytes | `ApplicationError::InvalidStateTransition` / invalid input |
| `Quarantined` | `Qualified` | `promote(posture, authority_ref)` | `FLOW-J01` | posture=`Verified`且same binding；authority重新读取为Current/exact；physical promote receipt confirmed；version未漂移 | state=`Qualified`；更新matching posture/authority关联，不改source content | external promote在UoW外；terminal tx versioned save/report/idempotency | `DomainError::InvalidStateTransition` |
| `Quarantined` / `Qualified` | `Stale` | `mark_stale(reason)` | `FLOW-C02`；J01 authority recheck drift | typed reason来自source/generation/authority drift | state=`Stale`；bytes仍在；不得复用 | save Exact(version)；可能创建RecoveryCase；不delete | `DomainError::InvalidStateTransition` |
| `Quarantined` / `Qualified` / `Stale` | `Invalid` | `mark_invalid(reason)` | `FLOW-J01` explicit failed/mismatch path | formal integrity/compatibility/binding failure；typed reason；不能由缺失/unknown推为Invalid | state=`Invalid`；bytes仍隔离；不改名/重打包 | versioned save/report；无promote、run或delete | `DomainError::InvalidStateTransition` |
| `Quarantined` / `Qualified` / `Stale` / `Invalid` | `Evicted` | `mark_evicted()` | `FLOW-C09` only | exact subject；cleanup effect formal Confirmed（如适用）；fresh second guard=`Releasable`且same cleanup basis；`MaterialCachePort.release_material`返回confirmed local receipt | state=`Evicted`；metadata保留，handle不得再用于读取 | tx D保存cache与typed receipt/result；无evidence、无Artifact mutation | `DomainError::InvalidStateTransition` |
| `Quarantined` / `Qualified` / `Stale` / `Invalid` | same state | `record_eviction_candidate(...)` / `protect(...)` / `release_protection(...)` | `FLOW-J02`、`FLOW-C09` | candidate仅bounded observation；protection removal必须有formal confirmation ref | 仅更新candidate/last-used/protection refs；state不变 | versioned metadata save；绝不调用delete/cleanup | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 五个 variant 与 Step 6 一致；candidate明确排除独立生命周期 |
| 触发函数 | 通过 | quarantine/promote/stale/invalid/evicted与同态metadata helper均存在 |
| 前置条件 | 通过 | integrity posture、authority、guard、cleanup basis、release receipt均有typed来源 |
| 非法转换 | 通过 | stale/invalid不原地qualified；candidate/releasable不等Evicted；Evicted不重开 |
| 副作用 | 通过 | cache metadata与physical release分离；no event/outbox；不改Artifact truth |
| 测试切口 | 通过（未来） | Complete→Quarantined、Verified+authority+receipt→Qualified、second guard race、release unknown no-Evicted |

### 8.3 `ProtectionState`

所属对象：`domain::ProtectionGuard`；enum：Step 6 `ProtectionState`；主要 flow：`FLOW-C09`、`FLOW-J02`，`FLOW-Q05/Q07` 只读。

```text
[ProtectionGuard: full-set derivation]
  factory/evaluate
        |
        +-- missing / stale / restricted / conflicting input --> Unknown
        +-- current explicit owner/policy release block -------> Blocked
        +-- current active lease/capture/handoff/retention/
        |   orphan protection --------------------------------> Protected
        +-- every required input current and explicitly clear -> Releasable

  Protected/Releasable/Blocked/Unknown -- full re-evaluation --> any derived state
  Releasable -- assert only --> permits release attempt; state remains Releasable
```

关键说明：

- 该状态机是完整输入集的保守派生机，不是单调业务生命周期；每次改变任何输入轴都必须全量重算。
- 判定优先级固定为：输入不可证明→`Unknown`；可证明的显式阻断→`Blocked`；active protection→`Protected`；全量current且clear→`Releasable`。
- `Releasable` 只授权尝试 cleanup/release，不表示 `Released/Cleaned/Evicted`，也不能被缓存长期复用。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Protected` | 至少一个current保护轴明确active | 否 | `record_resolution`、`evaluate`；拒绝release |
| `Releasable` | 全部required输入current且明确clear | 否 | `assert_releasable`；任何后续动作前再次`evaluate` |
| `Blocked` | current formal owner/policy明确阻止release | 否 | `record_resolution`、`evaluate`；拒绝release |
| `Unknown` | 输入缺失、stale、restricted、unsupported或冲突 | 否 | `record_resolution`、`evaluate`；fail-closed拒绝release |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | derived one of four | `ProtectionGuard::from_inputs(...)` / `protect(...)` | explicit guard creation path；C09/J02不凭缺失guard造Releasable | exact protected subject；五轴输入及freshness/basis显式；缺失字段不填clear | 保存完整input set；按固定优先级派生state | save new guard只在正式creation/recovery path；缺失guard当前flow保持blocked | `ApplicationError::InvalidStateTransition` / invalid input |
| any state | `Unknown` | `evaluate(inputs)` | `FLOW-C09`、`FLOW-J02` | 任一required input missing/stale/restricted/unsupported/conflicting，或complete-set freshness非Current | 替换完整inputs/freshness；state=`Unknown` | versioned save；C09 no cleanup/release；J02 candidate Unknown/NotCandidate | `DomainError::InvalidStateTransition` |
| any state | `Blocked` | `evaluate(inputs)` | `FLOW-C09`、`FLOW-J02` | complete/current inputs中formal owner/policy明确禁止release；无更高优先Unknown | state=`Blocked`；保留blocking axis | save/report issue；不得调用cleanup/release | `DomainError::InvalidStateTransition` |
| any state | `Protected` | `evaluate(inputs)` | `FLOW-C09`、`FLOW-J02` | complete/current；至少一个lease/capture/handoff/retention/orphan axis active；无Unknown/explicit block | state=`Protected`；保存active axis | save；不得调用cleanup/release/delete | `DomainError::InvalidStateTransition` |
| any state | `Releasable` | `evaluate(inputs)` | `FLOW-C09` | complete/current；五轴全部明确clear/releasable；same subject/basis | state=`Releasable`；freshness=`Current` | tx A/C versioned save；只允许进入下一gate，不表示effect完成 | `DomainError::InvalidStateTransition` |
| any state | same/derived state | `record_resolution(resolution)` then `evaluate(full_inputs)` | `FLOW-C09/J02/J03` | resolution来自formal safe owner read且匹配subject/source/version；禁止receipt单独清轴 | 只更新对应输入轴；最终state必须由全量evaluate决定 | short UoW save；不得用局部resolution跳过其余轴 | `DomainError::InvalidStateTransition` |
| `Releasable` | `Releasable` | `assert_releasable(cleanup_basis)` | `FLOW-C09` | state/freshness/basis/guard ref全部exact；无状态写入 | 无 | 允许一次owner cleanup或local release尝试；effect后必须重新read/evaluate | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 四个 variant 与 Step 6 一致；不是全局resource状态 |
| 触发函数 | 通过 | from_inputs/protect/evaluate/record_resolution/assert_releasable均存在 |
| 前置条件 | 通过 | 五轴input、freshness、subject、cleanup basis来自正式carrier/port |
| 非法转换 | 通过 | partial input不可Releasable；receipt/candidate/disk pressure/UI均不能改变结论 |
| 副作用 | 通过 | guard只写自身；cleanup/release由application外部阶段编排 |
| 测试切口 | 通过（未来） | 判定优先级、每轴active/unknown/block、全clear、二次评估race、assert no-write |

### 8.4 批次 10.2 停审

| 审查项 | 结论 |
|---|---|
| 状态机完成数 | 3/3 |
| 分轴 | transfer、integrity、cache、protection分别持久化；无跨轴捷径 |
| fail-closed | unknown/unsupported/stale不得Verified/Qualified/Releasable |
| release一致性 | Candidate ≠ Releasable ≠ cleanup Confirmed ≠ local receipt ≠ Evicted |
| 当前 blocker | `RUN-UP-001~003/005~008`、`RUN-DDD-003` 保留；physical transfer/cache/release未声称存在 |
| 下一批 | 10.3 `RunIntentState -> ControlIntentState -> RecoveryState -> HandoffState` |

## 9. 批次 10.3：owner request / control / recovery / handoff 状态矩阵

### 9.1 `RunIntentState`

所属对象：`domain::RunIntent`；enum：Step 6 `RunIntentState`；主要 flow：`FLOW-C07`、`FLOW-C02`、`FLOW-J03`，`FLOW-Q06` 只读。

```text
[RunIntent]
  factory -> Draft -> Submitting -> Accepted
               |          |  \----> Rejected
               |          \-------> Unknown
               |                      |  \
               |                      |   +-- formal reconcile --> Rejected
               |                      +------ formal reconcile --> Accepted
               +------------------------------> Invalidated
  Submitting/Accepted/Unknown ----------------> Invalidated

  Rejected/Invalidated -> terminal
```

关键说明：

- `Accepted` 仅表示 Sandbox owner正式接受 request，不表示 boundary已创建、Runtime running或程序成功。
- `Unknown` 绝不回 `Submitting`；只能由 `FLOW-J03` 正式只读回查收敛为 Accepted/Rejected/Invalidated，或继续冻结。
- 任何 re-request 都必须新建 intent 与 idempotency identity，不原地复用。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | local intent已建立，owner call尚未开始 | 否 | `mark_submitting`、`reject`、`invalidate` |
| `Submitting` | durable intent在固定idempotency/basis下提交中 | 否 | `record_receipt`、`reject`、`mark_unknown`、`invalidate` |
| `Accepted` | owner request receipt已确认 | 稳定local结果 | 只读等待owner projection；binding drift时`invalidate` |
| `Rejected` | owner或pre-side-effect policy明确拒绝 | 是 | 无；新intent重试 |
| `Unknown` | request可能已发生但结果无法确认 | 否（冻结态） | 只读reconcile helper；`invalidate` only on formal basis drift |
| `Invalidated` | selection/material/context binding不再有效 | 是 | 无；不撤销owner truth |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `RunIntent::create(...)` | `FLOW-C07` | context usable；selection Current exact；cache Qualified；integrity Verified；guard/resources safe；same binding；metadata完整 | 写fixed context/bindings/metadata；owner ref空 | tx A以Absent保存；不调用Sandbox | `ApplicationError::InvalidStateTransition` / invalid input |
| `Draft` | `Submitting` | `mark_submitting(metadata)` | `FLOW-C07` | metadata与factory identity一致；submit basis rechecked；idempotency reserved | state=`Submitting`；固定提交身份 | tx A durable commit后才在UoW外调用Sandbox | `DomainError::InvalidStateTransition` |
| `Submitting` | `Accepted` | `record_receipt(request_ref, receipt)` | `FLOW-C07` | formal Sandbox outcome Accepted；request ref与persisted intent/basis匹配；非普通transport ACK | 写request ref；state=`Accepted`；不写execution axis | tx B save + stored outcome + idempotency complete | `DomainError::InvalidStateTransition` |
| `Draft` / `Submitting` | `Rejected` | `reject(reason)` | `FLOW-C07` | typed policy/owner rejection；若owner call可能发生但结果不明则禁止走Rejected | state=`Rejected`；写reason | save stored rejected outcome；不创建running/cleanup结论 | `DomainError::InvalidStateTransition` |
| `Submitting` | `Unknown` | `mark_unknown(reason)` | `FLOW-C07` | owner/commit outcome ambiguous；typed reason；不能证明Rejected/Accepted | state=`Unknown`；写reason | 同tx或readback创建/关联RecoveryCase Frozen；禁止replay | `DomainError::InvalidStateTransition` |
| `Unknown` | `Accepted` | `record_reconciled_receipt(request_ref, receipt)` | `FLOW-J03` | formal read-only owner snapshot同expected basis，明确request accepted并给safe ref/receipt | state=`Accepted`；写request ref；清unknown reason | save intent+case/projection refs；不重发request，不推running | `DomainError::InvalidStateTransition` |
| `Unknown` | `Rejected` | `reject_after_reconcile(reason)` | `FLOW-J03` | formal same-basis read明确owner rejection；unavailable/unsupported不能映射 | state=`Rejected`；写typed reason | save intent+recovery report；无owner mutation | `DomainError::InvalidStateTransition` |
| `Draft` / `Submitting` / `Accepted` / `Unknown` | `Invalidated` | `invalidate(mismatch)` | `FLOW-C02`；`FLOW-J03`仅formal drift | exact generation/material/authority mismatch；Unknown必须有formal basis drift | state=`Invalidated`；写mismatch；不清owner ref | versioned save；Accepted/Unknown同时保持RecoveryCase以防owner effect | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 六个variant与Step 6一致；无Running/Success伪状态 |
| 触发函数 | 通过（经最小回写） | Unknown正式收敛helper已补齐，J03不需直改字段 |
| 前置条件 | 通过 | exact binding、owner receipt/snapshot、version和RecoveryCase来源闭合 |
| 非法转换 | 通过 | Accepted不转Running；Unknown不回Submitting；terminal不重开 |
| 副作用 | 通过 | 只写Runner intent/recovery；无owner execution truth、event/outbox |
| 测试切口 | 通过（未来） | durable-before-call、ACK非running、unknown no-replay、三种reconcile、accepted invalidation |

### 9.2 `ControlIntentState`

所属对象：`domain::ControlIntent`；enum：Step 6 `ControlIntentState`；主要 flow：`FLOW-C08`、`FLOW-C09`、`FLOW-J03`，`FLOW-Q06` 只读。

```text
[ControlIntent]
  factory -> Pending -> Accepted -> Confirmed
                |  \       |  \
                |   \      |   +--> Unknown -- formal reconcile --> Accepted/Confirmed/Rejected
                |    \     +------> Conflict -- formal reconcile --> Accepted/Confirmed/Rejected
                |     +-----------> Rejected
                +-----------------> Unknown / Conflict

  Confirmed/Rejected -> terminal for this control intent
```

关键说明：

- `Accepted` 是控制请求被受理；只有formal effect posture才可 `Confirmed`。
- `Confirmed(Stop) != Cleaned/Released`，`Confirmed(Cancel) != terminal success`；cleanup还必须经过protection和local release。
- `Unknown/Conflict` 只能由J03 formal read同basis收敛；不得由PID、端口、重连或本地按钮重试改变。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | local control intent已durable，尚无owner acceptance | 否 | submit result映射为Accepted/Rejected/Conflict/Unknown |
| `Accepted` | owner仅接受control request | 否 | `record_confirmed`、`reject`、`mark_conflict`、`mark_unknown` |
| `Confirmed` | formal owner state确认该kind的effect | 是（该intent） | 无；不推导cleanup或run success |
| `Rejected` | owner明确拒绝 | 是 | 无；新control intent才可重试 |
| `Unknown` | effect/request结果不明 | 否（冻结态） | J03只读reconcile |
| `Conflict` | current owner basis与expected basis冲突 | 否（冻结态） | J03只读reconcile；新control需新basis/key |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `ControlIntent::start(...)` / `request(...)` | `FLOW-C08/C09` | explicit finite kind；run intent存在；formal owner safe basis current/exact；metadata完整；cleanup另需guard Releasable | 写kind/run/basis/metadata；result/reason空 | tx A以Absent保存并commit后才owner call | `ApplicationError::InvalidStateTransition` / invalid input |
| `Pending` | `Accepted` | `record_accepted(result_ref)` | `FLOW-C08/C09` | formal owner response只证明acceptance；result ref与kind/basis匹配 | state=`Accepted`；写result ref | tx B versioned save；不执行隐含effect | `DomainError::InvalidStateTransition` |
| `Accepted` | `Confirmed` | `record_confirmed(result_ref, posture)` | `FLOW-C08/C09` | formal current owner posture明确确认exact requested kind/effect；普通ACK=false | state=`Confirmed`；写result ref | stop/cancel仅返回scoped结果；cleanup才可进入second guard/release stages | `DomainError::InvalidStateTransition` |
| `Pending` / `Accepted` | `Rejected` | `reject(reason)` | `FLOW-C08/C09` | typed explicit owner/policy rejection；ambiguous不得使用 | state=`Rejected`；写reason | save outcome；不创建新intent/cleanup success | `DomainError::InvalidStateTransition` |
| `Pending` / `Accepted` | `Conflict` | `mark_conflict(actual_basis)` | `FLOW-C08/C09` | formal actual basis逐字段不等expected basis | state=`Conflict`；保存typed conflict/basis信息 | freeze/RecoveryCase as needed；停止进一步control | `DomainError::InvalidStateTransition` |
| `Pending` / `Accepted` | `Unknown` | `mark_unknown(reason)` | `FLOW-C08/C09` | owner或terminal commit outcome ambiguous | state=`Unknown`；写reason | create/associate RecoveryCase Frozen；不重发control | `DomainError::InvalidStateTransition` |
| `Unknown` / `Conflict` | `Accepted` | `reconcile_accepted(result_ref, accepted_posture)` | `FLOW-J03` | formal same-basis read只证明accepted，未确认effect | state=`Accepted`；写result ref | save in J03 local tx；no owner mutation | `DomainError::InvalidStateTransition` |
| `Unknown` / `Conflict` | `Confirmed` | `reconcile_accepted(result_ref, confirmed_posture)` | `FLOW-J03` | formal same-basis read明确effect confirmed且kind匹配 | helper收敛为Confirmed；写result ref | save/report；cleanup仍不自动markEvicted | `DomainError::InvalidStateTransition` |
| `Unknown` / `Conflict` | `Rejected` | `reconcile_rejected(reason)` | `FLOW-J03` | formal same-basis read明确rejected | state=`Rejected`；写reason | save/report；无owner mutation | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 六个variant与Step 6一致；Accepted/Confirmed明确分开 |
| 触发函数 | 通过（经最小回写） | J03收敛helper已补齐；不存在私有字段更新 |
| 前置条件 | 通过 | kind、owner basis、result ref/posture、guard均为typed输入 |
| 非法转换 | 通过 | Pending不能直接Confirmed；Unknown/Conflict不重发；terminal不重开 |
| 副作用 | 通过 | control状态不改owner truth；Confirmed不跨轴清理/运行成功 |
| 测试切口 | 通过（未来） | ACK-only、effect confirm、basis conflict、unknown、三类reconcile、stop≠cleanup |

### 9.3 `RecoveryState`

所属对象：`domain::RecoveryCase`；enum：Step 6 `RecoveryState`；主要 flow：`FLOW-C02/C05~C11` 创建，`FLOW-C10`、`FLOW-J03` 推进，`FLOW-Q08` 只读。

```text
[RecoveryCase]
  factory -> Frozen -> Querying -> Reconciled -> Closed
               ^          |  \        |
               |          |   \------> ManualReview -> Closed
               |          +----------> Conflict -----> Querying
               +----------------------> ManualReview

  Closed -> terminal
```

关键说明：

- RecoveryCase 冻结的是危险副作用，不拥有owner cursor或修复权；`Querying`只允许formal read。
- `Reconciled` 表示expected/actual basis已对齐，最多允许新command重新过gate；不能继续旧请求。
- `Closed` 仅收束本地bookkeeping，不表示run、cleanup、handoff或evidence成功。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Frozen` | ambiguous/gap/drift已冻结副作用 | 否 | `begin_query`、`require_manual_review` |
| `Querying` | formal read-only reconcile进行中 | 否 | `record_snapshot`、`reconcile`、`require_manual_review` |
| `Reconciled` | current formal reads与expected basis一致 | 否（可收束） | `close`；新command可重新过gate，不续旧effect |
| `Conflict` | formal sources/basis明确冲突 | 否 | `begin_query`、`require_manual_review` |
| `ManualReview` | 无法自动证明，等待显式人工处置 | 否（冻结） | `close`仅需正式resolution；无override |
| `Closed` | local recovery bookkeeping已收束 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Frozen` | `RecoveryCase::freeze(...)` | C02/C05~C11、Job ambiguous paths | non-empty finite subjects；typed trigger；expected basis完整到声明轴；ID generated | 写trigger/subjects/expected basis；resolution空；state=`Frozen` | same tx与ambiguous local state保存或Absent创建；绝不发owner command | `ApplicationError::InvalidStateTransition` / invalid input |
| `Frozen` / `Conflict` | `Querying` | `begin_query(cursor)` | `FLOW-J03` | exact case/state/basis input；local cursor仅本地；job claim/checkpoint有效 | state=`Querying`；更新local cursor | short UoW durable commit后才formal reads | `DomainError::InvalidStateTransition` |
| `Querying` | `Querying` | `record_snapshot(snapshot)` | `FLOW-J03` | formal safe read带source/version/freshness/visibility且匹配case subjects；body-free refs | append/dedup resolution refs；不关闭case | versioned save可与最终reconcile同tx；no owner mutation | `DomainError::InvalidStateTransition` |
| `Querying` | `Reconciled` | `reconcile(actual)` | `FLOW-J03` | expected与actual逐字段一致；所有required source current/visible enough | state=`Reconciled`；保存resolution refs；清unresolved reason | 可调用同basis run/control/handoff reconcile helper；不replay旧effect | `DomainError::InvalidStateTransition` |
| `Querying` | `Conflict` | `reconcile(actual)` | `FLOW-J03` | formal reads完整但basis/source明确不一致 | state=`Conflict`；写typed failure；保持冻结 | save/report；不覆盖expected basis、不owner mutation | `DomainError::InvalidStateTransition` |
| `Querying` | `ManualReview` | `reconcile(actual)` | `FLOW-J03` | inputs不足以证明一致或冲突，且typed failure可表达 | state=`ManualReview`；写unresolved reason | save/report partial/unknown；no override | `DomainError::InvalidStateTransition` |
| `Frozen` / `Querying` / `Conflict` | `ManualReview` | `require_manual_review(failure)` | `FLOW-C10`；J03 | visible exact case；expected state/version匹配；typed failure | state=`ManualReview`；写reason | local command/result only；不改其他truth | `DomainError::InvalidStateTransition` |
| `Reconciled` / `ManualReview` | `Closed` | `close(resolution)` | explicit future recovery resolution flow；当前Step 9无调用 | formal resolution ref非空且匹配subjects；禁止用reconnect/refresh/local click代替 | state=`Closed`；append resolution ref | 当前boundary reserved；未来启用须先补Step 8/9 flow | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 六个variant与Step 6一致 |
| 触发函数 | 通过 | freeze/query/snapshot/reconcile/manual/close均存在；close显式reserved |
| 前置条件 | 通过 | subjects、expected/actual basis、cursor、resolution ref均有正式carrier |
| 非法转换 | 通过 | Frozen不能直接Reconciled/Closed；Closed不重开；reconnect不迁移 |
| 副作用 | 通过 | 只写local case/safe projection；no replay/no owner cursor/no owner mutation |
| 测试切口 | 通过（未来） | create freeze、begin-query durability、match/conflict/insufficient、manual sources、reserved close |

### 9.4 `HandoffState`

所属对象：`domain::HandoffPosture`；enum：Step 6 `HandoffState`；主要 flow：`FLOW-C11`、`FLOW-J03`，`FLOW-Q11/J04`只读或引用。

```text
[HandoffPosture]
  factory -> Draft -> Pending -> Accepted -> Delivered
               |        |  \        |  \
               |        |   \       |   +--> Unknown
               |        |    \      +------> Failed/Blocked
               |        |     +-----------> Failed/Blocked/Delivered
               +-------> Blocked

  Unknown -- formal read-only reconcile --> Accepted/Delivered/Failed/Blocked
  Delivered/Failed/Blocked -> terminal for this handoff
```

关键说明：

- `Accepted`/`Delivered`只描述owner handoff receipt posture；绝不等于Observability evidence、report、verdict或signoff。
- `Unknown`不能auto resend；唯一收敛来源是J03经`ObservabilityHandoffPort.read_posture`的same-basis正式结果。
- visibility/redaction/freshness不足在factory或submit前fail-closed为`Blocked`，不fallback原始日志。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | safe/redacted refs已准备，尚未提交 | 否 | `submit`、`block` |
| `Pending` | durable handoff intent已提交，等待formal result | 否 | `record_receipt`、`mark_unknown`、`block` |
| `Accepted` | owner接受handoff，尚未证明delivery | 否 | formal reconcile `record_receipt`、`mark_unknown` |
| `Blocked` | contract/visibility/policy明确阻止 | 是 | 无；新handoff intent才可重试 |
| `Delivered` | formal receipt确认delivery | 是 | 无；不生成evidence |
| `Failed` | owner明确报告handoff failure | 是 | 无；新handoff intent才可重试 |
| `Unknown` | delivery outcome不明 | 否（冻结态） | formal read-only reconcile only |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `prepare(...)` / `from_diagnosis(...)` | `FLOW-C11` | current actionable diagnosis；non-empty bounded allowed refs；target/metadata完整；visibility/freshness满足 | 写safe refs/target/metadata；state=`Draft`；无receipt | tx A中随后显式submit；不复制raw body | `ApplicationError::InvalidStateTransition` / invalid input |
| factory | `Blocked` | `prepare(...)` | `FLOW-C11` rejected/blocked pre-submit shape | freshness/visibility/redaction/target contract不满足且typed reason可得 | state=`Blocked`；content仍body-free | 可保存blocked result或在无可信object时只返回Rejected；no owner call | `ApplicationError::InvalidStateTransition` |
| `Draft` | `Pending` | `submit()` | `FLOW-C11` | metadata fixed；all safe refs逐项revalidated；same diagnosis version | state=`Pending`；不造receipt | tx A durable save后才调用handoff port | `DomainError::InvalidStateTransition` |
| `Pending` | `Accepted` / `Delivered` / `Failed` / `Blocked` | `record_receipt(receipt_ref, posture)` | `FLOW-C11` | formal owner result；receipt required for Accepted/Delivered；posture finite且target/basis匹配 | 写receipt（如允许）、state按posture；failure/block写reason | tx B save outcome+complete idempotency；不创建evidence | `DomainError::InvalidStateTransition` |
| `Draft` / `Pending` | `Blocked` | `block(reason)` | `FLOW-C11` | typed contract/visibility/policy/rejection reason；不得存raw response | state=`Blocked`；写reason | save result；no retry/raw fallback | `DomainError::InvalidStateTransition` |
| `Pending` / `Accepted` | `Unknown` | `mark_unknown(reason)` | `FLOW-C11` | submit/receipt/commit outcome ambiguous | state=`Unknown`；写reason；已有receipt可保留但不解释 | create/associateRecoveryCase；禁止resend | `DomainError::InvalidStateTransition` |
| `Accepted` / `Unknown` | `Accepted` / `Delivered` / `Failed` / `Blocked` | `record_receipt(receipt_ref, posture)` | `FLOW-J03` only | formal read_posture same target/expected basis；不能以旧receipt/reconnect推导 | state按formal posture；更新safe receipt/reason | save with recovery reconciliation；no submit/no evidence | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 七个variant与Step 6一致 |
| 触发函数 | 通过（经最小回写） | record_receipt明确支持J03 same-basis formal read收敛 |
| 前置条件 | 通过 | diagnosis、redaction proof、target、receipt/posture、freshness/visibility有正式来源 |
| 非法转换 | 通过 | Unknown不resend；terminal不重开；receipt不升级evidence |
| 副作用 | 通过 | 只保存safe refs/local posture；no raw log/evidence/outbox |
| 测试切口 | 通过（未来） | draft/blocked factory、durable-before-submit、all owner outcomes、unknown reconcile、receipt≠evidence |

### 9.5 批次 10.3 停审

| 审查项 | 结论 |
|---|---|
| 状态机完成数 | 4/4 |
| owner/local分轴 | run/control/handoff只拥有local intent/posture；owner axes只经formal receipt/safe read输入 |
| ambiguous effect | 全部Unknown + RecoveryCase；无自动replay/resend |
| cleanup/evidence边界 | control Confirmed不等cleanup；handoff Delivered不等evidence/signoff |
| 当前 blocker | `RUN-UP-003~005/008`保留；正向Sandbox/Runtime/Observability adapter未ready |
| 下一批 | 10.4 `ConnectivityState` 与 projection generation guard |

## 10. 批次 10.4：read / presentation / projection 状态矩阵

### 10.1 `ConnectivityState`

所属对象：`domain::ConnectivityView`（presentation projection）；enum：Step 6 `ConnectivityState`；主要 flow：`FLOW-J05` 构造并条件替换 committed section，`FLOW-J03` 只提供正式 recovery resolution basis，`FLOW-Q01/Q07/Q12` 只读。

```text
[ConnectivityView candidate]
  safe observation -> Online
                   -> Degraded
                   -> Offline
                   -> Reconnecting

  Offline/Degraded/Reconnecting -- explicit recovery query --> Reconciling
  any non-terminal projection --- insufficient/conflicting basis --> ManualReview

  Reconciling/ManualReview -- formal recovery resolution + new safe observation
                           --> Online / Degraded / Offline / Reconnecting

  committed view -- FLOW-J05 same-generation conditional replacement --> new candidate
  committed view -- Query/render/reconnect alone ----------------------> no transition
```

这里的箭头描述的是 presentation candidate 的派生和 committed section 的显式 replacement，不是 connectivity 对业务对象的反向迁移。`ConnectivityView` 没有终态；每次替换都必须来自新的 typed safe observation、当前 recovery basis 与同一 composition generation，不能用旧 view 原地推断。

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Online` | 当前 transport 与本次要求的 visible source reads 可尝试/可达 | 否 | 只作读取提示；新显式 refresh 可重建 candidate |
| `Degraded` | 部分 source 可读，至少一个 source stale/restricted/gap/unsupported | 否 | 暴露受影响 source 与 typed reason；显式 refresh/recovery |
| `Offline` | required transport 当前不可用 | 否 | 只读展示；等待新的 observation；不得 replay command |
| `Reconnecting` | transport 已恢复或正在恢复，但受影响 source 尚未完成正式对账 | 否 | 显式 J03/J05 read/reconcile；不得清业务 stale/unknown |
| `Reconciling` | 已关联 RecoveryCase，正式 read-only reconciliation 正在进行 | 否 | 等待 J03 resolution basis；不得发 owner mutation |
| `ManualReview` | connectivity/source basis 无法自动证明或明确冲突 | 否（冻结展示态） | 显式人工处置 recovery case；不得 override truth |

`Online` 只说明 connectivity presentation posture：它不等于 selection `Current`、material `Qualified`、integrity `Verified`、Sandbox request `Accepted`、Runtime `Running`、cleanup `Confirmed`、handoff `Delivered`，也不能清除任一 section 已有的 `Stale/Unknown/Conflict/Restricted/Unavailable`。

| From | To | 触发函数 / replacement | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Online` | `ConnectivityView::from_observation(observation)` | `FLOW-J05` candidate mapping | observation覆盖请求的全部 required source families；transport/read posture可达；freshness可接受；无source gap/recovery conflict；attribution完整 | state=`Online`；reason/recovery ref为空；写observed_at/freshness/sources/attribution | 仅产生candidate；随后仍须通过section generation guard；不更新业务对象 | `RunnerContractError` / projection contract violation |
| factory | `Degraded` | `from_observation(observation)` | `FLOW-J05` | observation为finite、safe、attributed；至少一部分source可达且存在typed stale/gap/restricted/unsupported原因；不得把unknown默认为online | state=`Degraded`；写affected sources与typed reason | candidate可作为同generation unavailable/degraded section替换；不fallback local truth | 同上 |
| factory | `Offline` | `from_observation(observation)` / `unavailable(...)` | `FLOW-J05` | required transport明确unavailable，或安全contract只能形成body-free offline surface；affected sources显式 | state=`Offline`；reason=`DependencyUnavailable`或可证明的typed原因 | same-generation candidate；不触发retry/replay/owner call | 同上 |
| factory | `Reconnecting` | `from_observation(observation)` | `FLOW-J05` | transport恢复 observation可得，但至少一个受影响source尚无current formal read；reason=`ReconcilePending/SourceGap/SourceStale` | state=`Reconnecting`；保留affected sources；不得清recovery ref | candidate replacement only；安排/执行reconcile必须走显式Job boundary | 同上 |
| `Offline` / `Degraded` / `Reconnecting` | `Reconciling` | `with_recovery(case_ref, Reconciling)` | `FLOW-J03` basis供给；`FLOW-J05` projection candidate | exact visible RecoveryCase属于affected source；case已durable且为`Querying`；safe candidate与case subject/basis一致 | state=`Reconciling`；写local recovery case ref；reason=`ReconcilePending` | 只更新presentation candidate/section；J03仍只读owner，不关闭case、不重发effect | `RunnerContractError` |
| `Offline` / `Degraded` / `Reconnecting` / `Reconciling` / `Online` | `ManualReview` | `mark_manual_review(reason)` | `FLOW-J03` unresolved/conflict结果；`FLOW-J05`投影 | reason仅允许`ReconcileConflict/ManualReviewRequired/UnsupportedContract`等typed fail-closed原因；有case时保留exact ref | state=`ManualReview`；写reason；保留受影响sources/attribution | conditional section replacement；不创建override、不修改RecoveryCase或业务轴 | `RunnerContractError` |
| `Reconciling` / `ManualReview` | `Online` / `Degraded` / `Offline` / `Reconnecting` | 新 `from_observation(...)` candidate + `replace_projection_if_generation_matches(...)` | `FLOW-J05` after J03 | J03提供所有受影响case的明确resolution basis；新observation仍current/attributed；candidate逐variant满足上述factory guard；same subject/generation/version | committed view被新candidate替换；旧recovery ref只在candidate契约允许时清除 | versioned conditional replacement；不调用`RecoveryCase::close`；不改业务truth | generation/version conflict / projection contract violation |
| any committed state | same or another derived state | `replace_projection_if_generation_matches(...)` | `FLOW-J05` | candidate是本次显式source read结果；key/body/subject/scope/generation一致；existing projection identity与exact version来自repository | 原子替换单一safe section；不持久化composite model | checkpoint/report记录local refresh结果；无event/outbox/owner mutation | typed Conflict/Blocked；不得覆盖 |
| any | no transition | Query/read/render path | `FLOW-Q01/Q07/Q12` | 无；Query只能读committed view | none | no save/replace/refresh/recovery mutation | 若实现尝试写入即测试失败 / contract violation |

补充约束：

- `with_recovery` 当前只允许把已有 degraded/offline/reconnecting candidate推进为`Reconciling`；传入`Online/Degraded/Offline/Reconnecting/ManualReview`作为目标均非法，后者必须走对应factory或`mark_manual_review`。这一限制是对Step 6既有宽签名的状态矩阵收紧，不新增函数。
- `Online -> Reconnecting`、`Offline -> Online`等 observation 变化不是在Query中原地迁移，而是J05构造新 candidate 后做 generation/version 条件替换。
- `FLOW-J03`只形成formal recovery resolution basis和safe refs；当前Step 9没有授权它调用section replace。需要更新connectivity committed section时仍由显式`FLOW-J05`承接。
- 网络恢复、应用重启、resume、GUI重新打开、端口可见或本地进程存在都不足以产生`Online`或关闭RecoveryCase。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 六个variant与Step 6一致；没有Healthy/Recovered伪状态 |
| 触发函数 | 通过（矩阵收紧） | 使用既有`from_observation/unavailable/with_recovery/mark_manual_review`与repository replace；未新增方法 |
| 前置条件 | 通过 | safe observation、source attribution、freshness、affected sources、RecoveryCase basis与projection generation均有既有carrier |
| 非法转换 | 通过 | reconnect本身不Online；Query不迁移；ManualReview不override；Online不跨轴清状态 |
| 副作用 | 通过 | 仅替换Runner-owned safe presentation section；无owner mutation、command replay、event/outbox |
| 测试切口 | 通过（未来） | 六variant factory/guard、unknown非online、reconnecting需reconcile、manual review、online不清各业务stale/unknown、Query write spies=0 |

### 10.2 `RunnerReadSection` projection generation guard

`RunnerReadSection`不是独立enum状态机。本小节固定一个条件替换协议：`existing committed section + candidate + expected generation + exact repository version -> Replaced | Rejected`。它防止旧source结果覆盖用户已经切换的context/selection generation；它不创建新的业务状态，也不把`RunnerReadModel`持久化为第二truth。

```text
[Explicit FLOW-J05 refresh]
  source read -> typed candidate section
       |
       +-- wrong subject/key/body/scope/generation --> Reject; no write
       v
  load_section_versioned
       +-- missing projection identity ------------> Blocked; no create
       v
  compare expected generation + Exact(version)
       +-- generation mismatch --------------------> Conflict; discard old result
       +-- version conflict ------------------------> Conflict; no overwrite
       v
  replace one committed safe section -> checkpoint/report

[Q01/Q07/Q12]
  load committed section/source set -> compose/read only
  expected generation mismatch -> Stale/Conflict surface; NEVER replace
```

| Guard posture | 可证明条件 | 允许动作 | 禁止动作 / 结果 |
|---|---|---|---|
| candidate valid | finite section key；body variant与key一致或body显式None；subject/scope、wrapper/inner surface、source attribution和candidate generation一致 | 继续读取existing identity/version | generic map/downcast、缺失degraded marker的None body、跨subject拼装 |
| identity present | `load_section_versioned`返回existing，`projection_ref`来自该record | 使用该ref与`Exact(existing.version)` | 从subject/key字符串拼ref；missing时insert/upsert；猜latest |
| generation current | input expected generation、candidate generation、existing当前允许替换generation三者按repository contract匹配 | 调用`replace_projection_if_generation_matches` | mismatch必须Conflict/Partial；不得读取旧generation snapshot后覆盖 |
| version current | paired versioned read仍为当前 | 原子替换一个section | conflict时blind retry/last-write-wins |
| replaced | repository返回new local version | 保存section checkpoint和bounded report ref | 把replacement解释为source truth current、业务成功或composite success |
| rejected | 任一identity/generation/version/contract guard失败 | 不写section；item=`Conflict/Blocked/Failed`，job至少`Partial/Blocked` | 降级guard、改expected generation、用其他section填洞 |

| 调用面 | 是否可调用 replace | generation mismatch 语义 | 副作用 |
|---|---|---|---|
| `FLOW-J05 RefreshVisibleSourcesJobFlow` | 是，且仅在显式job、逐section guard通过后 | 丢弃当前旧结果；记录Conflict/Partial；不自动重新读取或换generation | replace单section + checkpoint/report；无event/outbox |
| `FLOW-J03 ReconcileRunnerStateJobFlow` | 当前否 | formal snapshot/basis只供recovery收敛；不能借机覆盖section | 只保存Step 9允许的case/safe refs |
| `FLOW-Q01/Q07` | 否 | 返回已提交surface中的stale/degraded姿态 | strict no-write |
| `FLOW-Q12 GetRunnerReadModelFlow` | 否 | caller expected generation不等committed generation时，当前safe body可返回但顶层必须Stale/Conflict | pure compose/redact；replace/refresh/job spies为0 |
| GUI/CLI/render/reconnect | 否 | 只能展示已提交generation与缺口 | 不触发隐式refresh |

Generation 术语必须分离：

- `ReadModelGeneration`是projection composition generation，不是`SelectionGenerationNumber`、repository `RunnerVersion`、owner source version、event cursor或时间戳。
- `RunnerExpectedVersion::Exact`防同generation并发覆盖；generation guard防旧业务视图覆盖新context/selection。两者必须同时满足，不能互相替代。
- 一个section refresh成功不允许把其他section提升为current；`load_sources`只能返回同一committed composition generation的完整七键集合，缺失body仍须显式保留。
- Connectivity section为`Online`也不能消除selection/material/run/resource/handoff section自身的stale/unknown；overall availability只由pure composer逐section派生。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否误建状态机 | 通过 | 明确为conditional replacement guard，不新增enum或第二truth |
| identity / version来源 | 通过 | 仅`load_section_versioned`提供projection ref和paired version；missing fail-closed |
| generation分离 | 通过 | composition、selection、repository、source version/cursor均不混用 |
| Query边界 | 通过 | Q01/Q07/Q12不调用replace；mismatch仅返回stale/conflict surface |
| 旧结果处理 | 通过 | generation mismatch拒绝并报告，不覆盖、不改expected、不读旧snapshot |
| 测试切口 | 通过（未来） | wrong key/body/subject/scope/generation、missing identity、version conflict、same-generation replace、Q12 no-write、Online不清stale |

### 10.3 批次 10.4 停审

| 审查项 | 结论 |
|---|---|
| 状态机 / guard完成数 | 1个presentation状态机 + 1个generation conditional-write guard，2/2 |
| projection边界 | connectivity与read sections均为Runner-owned safe projection；不拥有Artifact/Governance/Sandbox/Runtime/Observability truth |
| reconnect边界 | transport恢复只进入Reconnecting/允许read；不能关闭RecoveryCase或清业务stale/unknown |
| generation边界 | mismatch拒绝旧结果；`ReadModelGeneration`、selection generation、repository version严格分离 |
| Query边界 | Q01/Q07/Q12全部no-write；不调用replace、不隐式dispatch refresh/reconcile |
| 当前 blocker | `RUN-UP-001~008`、`RUN-DDD-003`保留；正式source adapter、projection physical store与exact readiness未声称存在 |
| 下一批 | 10.5 idempotency / entry / consumer / job technical state matrices |

## 11. 批次 10.5：idempotency / entry / consumer / job 技术状态矩阵

本批的状态与 disposition 只约束 Runner 本地技术执行面。`Completed/Accepted/Running`等词必须连同主语读取：entry completed、job running、handler accepted均不等于软件正在运行、Sandbox effect完成、材料已清理或任何上游truth成功。

### 11.1 `RunnerIdempotencyState`

所属对象：`application::RunnerIdempotencyRecord`；主要 flow：全部11个Command与5个Job的shared reservation/terminal template；四个Consumer仅保留未来positive contract，12个Query禁止使用。

```text
[RunnerIdempotencyRecord]
  repository absent -- reserve --> Reserved -- complete ------> Completed
                                      |
                                      +-- digest/name mismatch --> Conflict

  Reserved matching replay  -> Unknown/InProgress surface; no execution
  Completed matching replay -> read exact stored surface; no execution
  Completed/Conflict         -> terminal; never overwritten or reopened
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Reserved` | key/channel/operation/stable digest已durable，结果尚未安全保存 | 否（冻结执行身份） | `complete`；仅still-Reserved mismatch可`mark_conflict`；matching retry只readback |
| `Completed` | 完整safe stored result已保存并由result ref关联 | 是 | exact same request读取stored result并replay |
| `Conflict` | 同key在reservation阶段出现不同channel/name/digest | 是 | 返回typed conflict；不得执行或覆盖原intent |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| repository absent | `Reserved` | `RunnerIdempotencyRecord::reserve(context, digest)` + repository `reserve(..., Absent)` | Command §7.1；Job §10；future Consumer only | context channel为Command/InboundEvent/OperationsJob；write metadata与key完整；canonical digest只含stable input；repository `get(key)=None` | 固定key/channel/name/digest；result/conflict为空 | 在任何domain mutation、scan或external effect前以独立local tx durable；Query禁止调用 | invalid metadata / version conflict / `ApplicationError::InvalidStateTransition` |
| `Reserved` | `Completed` | object `complete(result_ref)` + repository `complete(record, Exact(version), uow)` | Command §7.5；Job terminal J-Z；future Consumer terminal | 完整typed safe result surface已先保存；result ref operation与record一致；domain/technical writes与stored result处于同一terminal UoW；paired version current | state=`Completed`；写result ref；conflict为空 | commit后duplicate只读完整surface；commit unknown先readback，禁止重做effect | `ApplicationError::InvalidStateTransition` / version conflict |
| `Reserved` | `Conflict` | `mark_conflict(reason)` + repository `mark_conflict(...)` | shared duplicate gate | 同key record仍为Reserved，但channel/name/stable digest至少一项明确不等；reason已redact；不能把读失败当mismatch | state=`Conflict`；写reason；result ref保持None | versioned local write或直接返回conflict（由Step 11/13定durability）；业务/application body不执行 | `ApplicationError::InvalidStateTransition` |
| `Reserved` | no transition | `matches(...)` + readback | duplicate/in-progress branch | same channel/name/digest；result尚无；reservation可能对应正在进行或commit结果未知 | none | 返回typed Unknown/InProgress；不claim、不dispatch、不调用owner、不自动expire/re-reserve | n/a；stored inconsistency按ApplicationError/Recovery处理 |
| `Completed` | no transition | `matches(...)` + `StoredRunnerResultRepository.get_*` | all duplicate branches | exact same channel/name/digest；result ref和完整同variantsurface存在 | none | 返回原result ref/trace/outcome并仅标DuplicateReplayed；不重跑 | surface缺失→consistency Unknown + RecoveryCase；绝不重跑 |
| `Completed` / `Conflict` | no transition | mismatch handling | duplicate conflict branch | 同key但name/digest不同，或record已terminal | none；不得把Completed改Conflict | 返回typed conflict；保留原record/result | attempted mutation=`InvalidStateTransition` |

强制规则：没有TTL自动释放、`Reserved -> Reserved`续租、`Completed -> Conflict`、`Conflict -> Reserved`或删除后重用key的当前合同。若将来需要reservation expiry，必须重开Step 6～13并证明external-effect safety。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | `Reserved/Completed/Conflict`与Step 6一致 |
| 触发函数 | 通过 | object与repository的reserve/complete/mark_conflict均已定义 |
| digest/version顺序 | 通过 | stable digest、Absent reserve、Exact complete与stored-result-before-complete已固定 |
| duplicate边界 | 通过 | Reserved不重跑；Completed只replay完整surface；missing result进入consistency recovery |
| Query/Consumer phase | 通过 | Query永不reserve；Consumer current blocked-first路径也不reserve，positive path仍reserved |
| 测试切口 | 通过（未来） | first reserve、same duplicate三状态、different digest、volatile字段不入digest、missing stored result、commit unknown no-replay |

### 11.2 `RunnerEntryState`

所属对象：`entry::RunnerCommandEntry` / `entry::RunnerQueryEntry`；主要 flow：Step 9 §6 shared Command/Query entry。

```text
[CommandEntry / QueryEntry]
  factory -> Received -> Validating -> Dispatching -> Completed
                |           |
                +-----------+-- boundary validation failure --> Rejected

  application typed Rejected/Conflict/Unknown after Dispatching
      -> safe HandlerResult -> entry Completed
      (not entry Rejected)
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Received` | transport-neutral metadata已结构化，尚未完成boundary validation | 否 | `begin_validation`、`reject` |
| `Validating` | finite variant/name/body、actor、metadata、page/key等正在校验 | 否 | assertions、`begin_dispatch`、`reject` |
| `Dispatching` | boundary允许调用且operation context已可构造 | 否 | exactly-one application dispatch；构造safe handler result后`complete` |
| `Completed` | 本次invocation已产生安全handler surface | 是 | 返回surface；不解释内部业务结果 |
| `Rejected` | application调用前的boundary validation失败 | 是 | 返回body-free/redacted rejection；不dispatch |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Received` | `RunnerCommandEntry::receive/from_inbound(...)`或`RunnerQueryEntry::receive/from_inbound(...)` | §6.1/§6.2 | finite command/query name与tagged-union variant预匹配；entry ref generated；actor/metadata/trace只来自trusted boundary；不携带raw body | state=`Received`；保存body-free metadata/refs | 不读repository、不reserve、不调用adapter | `EntryError` invalid input |
| `Received` | `Validating` | `begin_validation()` | §6.1/§6.2 | 同一entry尚未终态；entry kind/name一致 | state=`Validating` | 执行纯结构/metadata validation；无UoW | `EntryError::InvalidStateTransition` |
| `Validating` | `Dispatching` | `begin_dispatch()` | §6.1/§6.2 | Command metadata/key/expected basis完整，或Query metadata/page完整且`assert_no_idempotency`通过；blocking issues为空 | state=`Dispatching` | `to_operation_context`后恰一次调用匹配的application service；entry本身不直连port/store | 同上 |
| `Dispatching` | `Completed` | `complete(&handler_result)` | all C/Q flows | handler entry kind/ref与entry一致；application outcome或query surface已安全映射；body leak assertion通过 | state=`Completed` | 仅返回surface；Command mutation属于application flow；Query仍no-write | 同上 |
| `Received` / `Validating` | `Rejected` | `reject(issue_ref)` | entry validation negative branch | finite redacted issue；尚未dispatch；不得按raw error string分类 | state=`Rejected`；记录issue | application/idempotency/repository/owner调用均为0 | 同上 |

`Dispatching -> Rejected`不是当前对象迁移。application在dispatch后返回typed `Rejected/Conflict/Unknown`时，entry仍通过`complete`进入`Completed`，而精确业务结果保留在public/stored outcome与handler disposition；这样“入口执行完成”不会被混同为“业务接受”。若dispatch产生不可安全表达的programming/storage error，则返回typed `EntryError/ApplicationError`，不得强行伪造terminal state。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 五个variant与Step 6一致 |
| Command/Query共用性 | 通过 | 同一lifecycle，metadata断言不同；Query明确无key/no-write |
| pre/post-dispatch拒绝分轴 | 通过 | pre-dispatch=`Rejected`；application safe negative outcome=`Completed`+精确surface |
| 副作用 | 通过 | entry不访问repo/SDK/OS，不把transport success当业务success |
| terminal | 通过 | Completed/Rejected不重开；新调用建立新entry ref |
| 测试切口 | 通过（未来） | variant/name mismatch、missing metadata、Query key rejection、exactly-one dispatch、all application outcomes complete、terminal no-reopen |

### 11.3 `RunnerHandlerDisposition`

所属对象：`entry::RunnerHandlerResult`。这是一次handler输出的terminal分类，不是会持续迁移的truth状态机；下面矩阵是构造/映射矩阵。

```text
[safe entry/application result]
  command Accepted / visible-current query -> Accepted
  boundary or typed command rejection/conflict -> Rejected
  query visibility denies body              -> NotVisible
  query safe partial/stale/unavailable body  -> Degraded
  ambiguous write + RecoveryCase             -> Unknown
```

| disposition | 语义 | 必须保留的carrier | 禁止解释 |
|---|---|---|---|
| `Accepted` | command有明确safe accepted result，或query返回visible non-degraded surface | command result ref或query visibility surface | Sandbox accepted≠Running；entry accepted≠program success |
| `Rejected` | boundary拒绝，或application返回typed Rejected/Conflict | redacted issues；若已有stored outcome则精确typed public outcome/ref另行保留 | 不把Conflict压成可重试generic error，不调用owner |
| `NotVisible` | formal query visibility为Restricted/Unknown/Unavailable且body不可返回 | visibility/freshness/degraded marker；body None/items empty | 不泄露existence，不当Missing success |
| `Degraded` | query可返回受限safe body但freshness/source/section为stale/partial/missing/rebuilding/unsupported/conflict | per-section surface与degraded marker | 不刷新、不提升Current |
| `Unknown` | write/owner effect或terminal commit无法确认且已有RecoveryCase | redacted issue和stored `RunnerProtocolUnknown`中的case ref | 不映射Accepted/Rejected，不自动replay |

| Source | Disposition | 触发函数 / mapper | 前置条件 | Flow副作用 | 非法映射 |
|---|---|---|---|---|---|
| `RunnerCommandOutcome::Accepted` | `Accepted` | `RunnerHandlerResult::accepted_command(entry_ref, result_ref)` | complete stored command result存在；entry/ref/operation一致 | transport只转发safe surface | 不可据ACK/HTTP code/PID自行构造 |
| pre-dispatch validation failure | `Rejected` | `RunnerHandlerResult::rejected(...)` / entry `reject` | issue refs非空且redacted；application未调用 | no idempotency/no write/no port | 不得生成fake result ref |
| application `Rejected` / `Conflict` | `Rejected` shell，精确protocol outcome不变 | Step 9 explicit outcome→handler mapper | typed stored outcome已构造；Conflict的surface/recovery ref不得丢失或改成Accepted | entry完成；原stored result可按其正式ref返回/replay | 不得只靠handler enum替代typed public outcome |
| visible current query | `Accepted` | `query_surface(...)` finite mapper | visibility允许；无degraded marker；Query context no-write | return safe body/page | 不得将empty page当NotVisible |
| not-visible query | `NotVisible` | `query_surface(...)` finite mapper | formal visibility denies或unknown/unavailable；body必须None/items empty | strict no-write/no-existence-probe | 不得以transport 404猜测 |
| partial/stale query | `Degraded` | `query_surface(...)` finite mapper | safe body符合visibility；surface含明确degraded/freshness/source marker | strict no-write | Connectivity Online不得覆盖此disposition |
| command `Unknown` | `Unknown` | `RunnerHandlerResult::unknown(...)` + typed stored outcome mapper | RecoveryCase已关联；issue redacted；若result已存则duplicate identity保持 | freeze + later read-only reconciliation | 不得自动映射Failed或retry |

每个`RunnerHandlerResult`构造后即terminal，无`Accepted -> Unknown`等迁移。Duplicate replay必须复用原typed outcome：原Accepted仍Accepted，原Rejected/Conflict仍Rejected shell，原Unknown仍Unknown；`DuplicateReplayed`只是public replay marker，不是handler disposition。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 五个variant与Step 6一致 |
| 构造来源 | 通过 | entry helpers + Step 9 finite mapper；不从transport status猜测 |
| Conflict保存 | 通过 | handler可归类Rejected，但typed `RunnerProtocolConflict`与stored surface必须原样保留 |
| Query边界 | 通过 | NotVisible/Degraded保持surface，均no-write |
| Unknown边界 | 通过 | 仅write ambiguity + RecoveryCase；不replay |
| 测试切口 | 通过（未来） | command四outcomes、query visible/not-visible/degraded、duplicate保持原语义、Accepted≠Running |

### 11.4 `RunnerConsumerLoopState`

所属对象：`worker::RunnerConsumerLoop`，并作为`RunnerInboundConsumerEntry.loop_state`的受控marker；主要 flow：`FLOW-E01~E04`。四类positive consumer仍`planned/blocked`。

```text
[RunnerConsumerLoop]
  factory -> Registered -- delay --> Delayed
                |  \                   |
                |   \-- stop/fail      +-- stop/fail
                |
                +-- start [reserved] --> Running -- delay/stop/fail

  Stopped / Failed -> terminal for this loop instance
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Registered` | logical consumer已注册，尚未获准解析/消费 | 否 | delay/stop/fail；`start`仅future contract |
| `Running` | contract-ready loop正在处理item | 否；当前不可达 | `record_item`、delay/stop/fail |
| `Delayed` | source/readiness/backoff暂不可用，identity保留 | 否 | stop/fail；`start`仅重新全量过gate后future可达 |
| `Stopped` | validated runtime composition显式停止 | 是（本loop instance） | 无；config reload创建新loop |
| `Failed` | loop级fatal failure需人工/rebuild | 是（本loop instance） | 无；不得自动重启 |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Registered` | `RunnerConsumerLoop::registered(...)` | runtime/worker registration | entry ref与finite source family有效；不创建subscription/client | state=`Registered`；item/recovery markers空 | logical registration only | `WorkerError` invalid input |
| `Registered` / `Delayed` | `Running` | `start()` | future positive E01~E04 only | formal envelope schema、source registration、client、readiness、dedup/order/gap、visibility与application contract全部ready；当前`RUN-UP-*`使此guard恒不通过 | state=`Running` | 才允许poll/parse/dispatch；当前reserved/unreachable | `WorkerError::PositiveConsumerContractNotAuthorized` / invalid transition |
| `Registered` / `Running` | `Delayed` | `delay(issue_ref)`；entry `mark_delayed` | future temporary dependency branch；当前可用于composition posture | redacted temporary issue；若item在手必须保留identity且不得ACK success | state=`Delayed`；append issue | no payload apply/no owner cursor/no replay | `WorkerError::InvalidStateTransition` |
| `Registered` / `Running` / `Delayed` | `Stopped` | `stop()` | validated runtime stop | explicit composition stop/cancellation已确认；无in-flight ambiguous application effect | state=`Stopped` | 停止新poll；不改projection/domain truth | 同上 |
| `Registered` / `Running` / `Delayed` | `Failed` | `fail(issue_ref)` | loop-level fatal path | redacted fatal loop issue；不能由单item rejection或owner业务failure擅自升级 | state=`Failed`；append issue | operator/rebuild posture；no truth repair | 同上 |
| `Running` | no state transition | `record_item(result)` | future positive path | result同entry/source family；只含safe refs；Gap关联RecoveryCase | 更新last safe event/dedup与case ref；state仍Running | 不推进owner cursor；item Accepted也不改owner truth | `WorkerError` contract violation |

当前E01～E04只执行header-first负向路径，因此loop不得进入`Running`并调用`record_item`。Blocked/Unsupported/Rejected item是一次candidate结果，不自动使loop `Failed`；runtime可保留Registered或用显式issue进入Delayed。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 五个variant与Step 6一致 |
| current reachability | 通过 | Running/start明确reserved；未伪造schema/client/readiness |
| terminal/restart | 通过 | Stopped/Failed不原地重开；新composition创建新loop |
| item/loop分轴 | 通过 | item negative disposition不自动升级loop failure |
| ownership | 通过 | loop不推进owner cursor、不写domain truth、不ACK-as-success |
| 测试切口 | 通过（未来） | blocked start、delay identity保留、stop/fail terminal、item rejection≠loop fail、positive spies=0 |

### 11.5 `RunnerConsumerItemDisposition`

所属对象：`worker::RunnerConsumerItemResult`。这是单个candidate的terminal构造矩阵，不是持久化迁移状态机。

```text
[header/item candidate]
  full future gates + safe stored receipt -> Accepted        [reserved]
  exact complete stored receipt          -> Duplicate
  temporary ready contract dependency    -> Delayed         [reserved]
  malformed/conflicting header           -> Rejected
  unsupported schema                     -> UnsupportedVersion
  formal owner order gap                 -> GapDetected      [reserved]
  contract/readiness unavailable         -> Blocked
  formal opaque isolation                -> Quarantined      [reserved]
```

| disposition | 当前可达性 | 构造函数 / 来源 | 必须条件 | 副作用 / 禁止 |
|---|---|---|---|---|
| `Accepted` | reserved | `RunnerConsumerItemResult::accepted(...)` | future typed payload、source/auth/schema/dedup/order/visibility全部通过；application已保存safe projection/applied marker/完整receipt并返回result ref | 只表示application接受owner fact；不创建owner truth，不等run success |
| `Duplicate` | 条件可达 | `duplicate(...)` |可信framing dedup key；stored receipt与当前header所有safe字段逐项一致；完整同族stored result可读 | 只replay；不parse payload、不dispatch、不写projection |
| `Delayed` | reserved | `delayed(...)` | future已知positive contract下temporary dependency unavailable；event identity保留 | 当前blocked-first路径用Blocked而非伪造Delayed；不得丢item/ACK success |
| `Rejected` | 可达 | `rejected(...)` | source family/header identity/trace/attribution冲突或缺失，typed issue可得 | no parse/no receipt write/no application call |
| `UnsupportedVersion` | 可达 | `unsupported(...)` / `block_unsupported(...)` | source family可识别，但schema/contract version不支持 | no payload decode、no applied marker |
| `GapDetected` | reserved | `gap(...)` | future formal order marker明确gap/conflict；event ref与RecoveryCase存在 | freeze local projection；不last-arrival-wins、不推进owner cursor |
| `Blocked` | 可达且当前默认 | `blocked(...)` | readiness为Blocked/Unavailable/Degraded，或positive contract尚未授权；issue redacted | header-only；no UoW/idempotency/projection/domain/outbox |
| `Quarantined` | reserved/unreachable | `quarantined(...)` | formal transport isolation已完成且只保存opaque item/header ref；当前无isolation port | 不保存payload bytes；不等Archive保存或Accepted |

`RunnerConsumerItemDisposition`没有`Unknown` variant。stored receipt缺失/损坏、readback不明等不能被实现私加Unknown item；应返回consistency `ApplicationError`或由已授权application path建立RecoveryCase。每个result一经构造即terminal，不在同一item上从Blocked转Accepted；未来重试是新的受控attempt且必须保留正式dedup/order语义。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / variant覆盖 | 通过 | 八个variant逐项闭合 |
| current allowed set | 通过 | Blocked/UnsupportedVersion/Rejected + exact stored Duplicate；Quarantined无provider不可达 |
| positive path | 通过（reserved） | Accepted/Delayed/Gap需Step 8/9 reopen，不得实现偷开 |
| payload边界 | 通过 | 当前所有可达路径不parse/hash/save payload |
| truth边界 | 通过 | receipt/ACK/item Accepted均不创建上游truth |
| 测试切口 | 通过（未来） | 每variant factory invariant、strict duplicate comparison、missing dedup no lookup、Ready unauthorized、quarantine no bytes |

### 11.6 `RunnerJobEntryState`

所属对象：`operations::RunnerOperationsJobEntry`；主要 flow：shared Job J-A/J-Z与`FLOW-J01~J05`。

```text
[RunnerOperationsJobEntry]
  factory -> Registered -> Running -> Completed
                |           |  \
                |           |   +--> Delayed -- resume --> Running
                |           |             \------> Completed / Failed
                |           +---------------------> Failed
                +--> Delayed / Failed / Rejected

  ambiguous claim/checkpoint/terminal persistence:
    Running/Delayed -- mark_unknown --> Failed entry + Unknown public disposition + RecoveryCase
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Registered` | metadata/finite job kind已建立，尚未可信执行 | 否 | `mark_running`、`mark_delayed`、`mark_failed`、`reject` |
| `Running` | local claim current且bounded job body执行中 | 否 | checkpoint、`mark_delayed/completed/failed/unknown` |
| `Delayed` | dependency/cancellation/backoff阻止继续，checkpoint未丢 | 否 | exact-basis resume、`mark_completed/failed/unknown` |
| `Completed` | 一个可信terminal report已收束 | 是 | 返回对应result；不解释report为owner成功 |
| `Failed` | 无法产生可信正常/blocked terminal，或ambiguous已冻结 | 是 | 返回Failed或Unknown result；不自动rerun |
| `Rejected` | pre-execution metadata/registry/input拒绝 | 是 | 返回Rejected；无claim/application body |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Registered` | `from_metadata(...)` | shared Job dispatch | finite kind/operation对应；explicit run ref/key/actor/trace/basis/scope/page有效；registry enabled在执行前复核 | state=`Registered`；issues/case空 | 仅结构化entry；validation失败可直接返回Rejected result而不保存 | `JobError` invalid input |
| `Registered` / `Delayed` | `Running` | `mark_running()` | J-A / explicit resume | idempotency Reserved durable；local claim Claimed且current；checkpoint缺失或Usable+same basis；required readiness可按本job语义执行；Delayed resume不得复用Unknown claim | state=`Running` | versioned save后才执行job body；外部I/O在UoW外 | `JobError::InvalidStateTransition` / conflict |
| `Registered` / `Running` | `Delayed` | `mark_delayed(issue_ref)` | precheck或bounded safe pause | temporary typed issue；尚未发生ambiguous effect；Running时checkpoint/basis durable | state=`Delayed`；append issue；保留case/checkpoint identity | 不执行/继续危险effect；不丢checkpoint | 同上 |
| `Running` / `Delayed` | `Completed` | `mark_completed(&report)` | J-Z | report同job kind/run ref且已完整组装；disposition只可Completed/Partial/Blocked；checkpoint已safe close且claim可release | state=`Completed` | 同一terminal boundary保存report/result并complete idempotency | 同上 |
| `Registered` / `Running` / `Delayed` | `Failed` | `mark_failed(issue_ref)` | fatal local job branch | redacted fatal issue；若有report则为Failed且identity匹配；不得用它掩盖ambiguous effect | state=`Failed`；append issue | safe failure result/report；no truth repair | 同上 |
| `Registered` | `Rejected` | `reject(issue_ref)` | pre-execution registry/input gate | invalid/disabled kind、metadata/bounds/basis错误；尚未claim/reserve/application call | state=`Rejected`；append issue | no claim/checkpoint/body/adapter；是否保存technical rejection留Step 11/13 | 同上 |
| `Running` / `Delayed` | `Failed` + public `Unknown` | `mark_unknown(case_ref, issue_ref)` | claim/checkpoint/result/commit ambiguous | RecoveryCase已durable或同安全boundary建立；无法证明normal failure/success；不得重做可能发生的effect | state=`Failed`；写case+issue | `RunnerOperationsJobResult::unknown`；idempotency/readback冻结；no auto rerun | 同上 |

`Completed` entry允许report为Blocked，因为这表示“阻塞事实已可信收束并保存”，不是工作成功。相反，entry `Failed` + public `Unknown`是有意分轴：entry没有Unknown variant，RecoveryCase与result disposition承载歧义。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 六个variant与Step 6一致 |
| report/entry分轴 | 通过 | Completed可承载Completed/Partial/Blocked report；不等owner success |
| ambiguity | 通过 | mark_unknown落entry Failed + result Unknown + RecoveryCase；不伪造新状态 |
| claim/checkpoint gate | 通过 | Running/resume必须current claim与same-basis Usable checkpoint |
| terminal | 通过 | Completed/Failed/Rejected不原地重开；新运行用新entry/run/key |
| 测试切口 | 通过（未来） | registry reject、claim-before-running、delayed resume gates、三类completed report、fatal、unknown no-rerun |

### 11.7 `RunnerJobClaimState`

所属对象：`operations::RunnerJobClaim`。它只表示Runner operation store中的本地exclusive claim，不是Sandbox lease、OS process lock或owner allocation。

```text
[logical claim posture]
  repository absent / Unclaimed -- claim factory --> Claimed
                                              |  
                                              |   +--> Unknown
                                              +------> Released

  Released / Unknown -> terminal for this claim identity
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Unclaimed` | logical无active claim姿态 | 当前不持久化对象 | 仅由repository absence表达；随后原子create Claimed |
| `Claimed` | 一个local worker持有当前job-run claim | 否 | `is_current`、safe `release`、ambiguity `mark_unknown` |
| `Released` | safe stop/checkpoint/terminal后本claim已释放 | 是（本claim identity） | 无 |
| `Unknown` | claim durability/expiry/worker ownership无法证明 | 是（冻结态） | readback/recovery；不得自动reclaim |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| repository absent（logical `Unclaimed`） | `Claimed` | `RunnerJobClaim::claim(...)` + operation repository create Absent | J-A | exact job run；new claim ref；paired expected job version；trusted time/expiry；不存在active/unknown claim | 新对象初态Claimed；固定run/ref/version/time | 与entry/reservation J-A同一local transaction；不调用owner | `JobError` / create conflict |
| `Claimed` | `Released` | `release()` | J-Z或safe delayed stop | claim仍current；checkpoint已Closed或safe resumable posture已durable；没有ambiguous in-flight effect | state=`Released` | versioned save；随后entry可terminal；不释放Sandbox lease/material | `JobError::InvalidStateTransition` |
| `Claimed` | `Unknown` | `mark_unknown(case_ref)` | crash/expiry/commit ambiguity | exact RecoveryCase关联；不能证明old worker/effect停止；expiry observation不能替代proof | state=`Unknown`；写case ref | freeze entry/result；禁止另一个worker盲claim/rerun | 同上 |
| any | no transition | `is_current(now)` | pre-work/recovery check | trusted local time + stored expiry | none | false只阻止执行；不会自动Released/Unknown | n/a |

`Unclaimed` enum在当前flow中是logical repository-absence posture，不创建state=`Unclaimed`的record；这是显式reserved representation，不允许实现自行保存一个可竞争的Unclaimed row。新attempt只能在旧claim已正式Released，或RecoveryCase明确收束并按未来reopen合同创建新claim identity后开始。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 四variant覆盖；Unclaimed明确为logical absence/reserved representation |
| claim/lease分离 | 通过 | local claim不证明owner lease/allocation/process状态 |
| ambiguity | 通过 | Unknown terminal freeze；expiry不自动reclaim |
| release gate | 通过 | checkpoint/stop安全边界先于release |
| duplicate | 通过 | duplicate在claim前返回stored report |
| 测试切口 | 通过（未来） | create conflict、current/expired pure check、safe release、unknown case required、Released/Unknown no reclaim |

### 11.8 `RunnerCheckpointState`

所属对象：`operations::RunnerJobCheckpoint`；主要 flow：`FLOW-J01~J05`逐阶段短事务。

```text
[RunnerJobCheckpoint]
  factory -> Usable -- basis drift --> Stale
                |  \                    |
                |   +-- durability ? --> Unknown
                |                       ^
                +-- safe terminal ----> Closed
  Stale -- safe terminal --> Closed

  Unknown / Closed -> no resume; current contract has no reopen
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Usable` | body-free checkpoint可在exact same basis继续bounded work | 否 | `assert_resumable`、mark stale/unknown、safe close |
| `Stale` | selection/source/generation/job basis已漂移 | 否（不可resume） | safe close；ambiguity时mark unknown |
| `Unknown` | checkpoint写入/durability/readback不明 | 是（冻结当前checkpoint） | recovery/readback only；不resume/close by assumption |
| `Closed` | 当前job run的checkpoint已安全收束 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 可落码前置条件 | 状态副作用 | Flow副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Usable` | `RunnerJobCheckpoint::create(...)` | each J01~J05 checkpoint write | exact job run；sequence满足repository单调约束；processed refs bounded/body-free；basis显式且与当前item/work一致 | state=`Usable`；写sequence/refs/basis | versioned short UoW save；不表示external effect完成 | `JobError` invalid input/conflict |
| `Usable` | no transition | `assert_resumable(current_basis)` | J-A resume gate | stored state Usable且current basis逐字段相等 | none | 允许进入下一bounded phase；仍须claim/readiness/current local versions | mismatch=`JobError`; no adapter call |
| `Usable` | `Stale` | `mark_stale(issue_ref)` | any job basis drift | formal/local current basis明确与stored basis不等；typed issue redacted | state=`Stale`；append issue | 旧结果不得覆盖新generation；job Partial/Blocked/Conflict | `JobError::InvalidStateTransition` |
| `Usable` / `Stale` | `Unknown` | `mark_unknown(issue_ref)` | durability/readback ambiguity | checkpoint commit/readback无法证明；不得以retry覆盖 | state=`Unknown`；append issue | RecoveryCase + public Unknown as required；不盲resume/replay | 同上 |
| `Usable` / `Stale` | `Closed` | `close()` | J-Z / safe stop | terminal report或explicit safe stop已durable；processed refs/counters一致；claim随后可release | state=`Closed` | versioned save；不表示owner success/cleanup/evidence | 同上 |
| `Unknown` / `Closed` | no transition | none | recovery/read path only | n/a | none | Unknown需future explicit recovery contract；Closed terminal | attempted mutation=`InvalidStateTransition` |

后续phase生成更高sequence的checkpoint是一个受repository version/sequence保护的新candidate写入，不是将`Closed`重开，也不是用page cursor、selection generation或owner cursor替代sequence。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 四variant与Step 6一致 |
| resumability | 通过 | 仅Usable+same exact basis；claim/readiness仍独立校验 |
| sequence/basis分离 | 通过 | checkpoint sequence不等page/owner cursor/generation/version |
| ambiguity | 通过 | Unknown不resume、不自动close；进入RecoveryCase |
| terminal | 通过 | Closed不重开；不表示业务/owner成功 |
| 测试切口 | 通过（未来） | same/different basis、monotonic sequence、stale no-call、unknown no-replay、safe close ordering |

### 11.9 `RunnerJobDisposition`

所属对象：`operations::RunnerOperationsJobResult`；public counterpart：Step 8 `RunnerProtocolJobDisposition`。这是一次Job返回的terminal分类，与`RunnerJobEntryState`和`JobReportDisposition`分轴。

Step 10反查发现：Step 8 `JobReportDisposition`与Step 9均已有`Blocked`，而Step 6/8 job result disposition曾漏项。已最小回写`RunnerJobDisposition::Blocked`、`RunnerProtocolJobDisposition::Blocked`与`RunnerOperationsJobResult::blocked(...)`，避免实现把可信Blocked report压成Partial/Failed；未改变Job数量、truth owner或readiness。

```text
[job terminal mapping]
  fresh report Completed -> Completed
  fresh report Partial   -> Partial
  fresh report Blocked   -> Blocked
  fresh report Failed    -> Failed
  exact stored replay    -> DuplicateReplayed
  pre-execution reject   -> Rejected
  ambiguous + case       -> Unknown
```

| disposition | Entry/report要求 | 构造函数 / source | 禁止解释 |
|---|---|---|---|
| `Completed` | entry Completed；stored report disposition Completed | `RunnerOperationsJobResult::completed(...)` | 不等material Qualified、run success、cleanup/evidence |
| `Partial` | entry Completed；stored report Partial且counters/issues解释未完成项 | `completed(...)` finite mapping | 不自动续跑剩余项，不隐藏failed count |
| `Blocked` | entry Completed；stored report Blocked且required contract/source/capability明确阻止工作 | `blocked(...)` | 不等job implementation failure或owner rejection；不降级绕过blocker |
| `Failed` | entry Failed；report可选但若有必须Failed且identity一致 | `failed(...)` | 不补造owner failure/success，不自动retry |
| `DuplicateReplayed` | 不创建claim/scan；完整same-key/digest stored job report存在 | `duplicate_replayed(...)` | 不返回新report/ref，不重做任何job body |
| `Rejected` | entry Rejected或未保存的pre-execution rejection；无claim/checkpoint/application body | `rejected(...)` | 不把adapter Blocked误作input rejection |
| `Unknown` | entry Failed；RecoveryCase必填；claim/checkpoint/effect/terminal commit无法确认 | `unknown(...)` | 不映射Failed/Partial，不盲rerun |

| Source | To disposition | 可落码前置条件 | Flow副作用 | 非法时错误 |
|---|---|---|---|---|
| fresh `JobReportDisposition::Completed` | `Completed` | report/run/kind与entry一致；stored report+result ref已保存；entry可mark completed | idempotency complete同terminal boundary | `JobError` contract mismatch |
| fresh `Partial` | `Partial` | bounded report完整；至少一个未完成/失败/blocked item由counters/issues表达；checkpoint posture一致 | 返回partial，不隐式dispatch continuation | 同上 |
| fresh `Blocked` | `Blocked` | current readiness/source/contract明确blocked；无正向side effect被伪造；report完整可重放 | 保存blocked report并complete entry/idempotency | 同上 |
| fresh `Failed` | `Failed` | fatal local failure可证明；ambiguous=false；report若有同identity | 保存可信failure surface；no repair | 同上 |
| same-key/digest complete record | `DuplicateReplayed` | idempotency Completed；result ref指向完整同kind/run stored report | pure read/replay；claim/checkpoint/ports=0 | missing surface→consistency Unknown，不构造Duplicate |
| pre-execution validation/registry gate | `Rejected` | metadata/kind/bounds/basis/config invalid且application未执行 | no reservation（若尚未建立）/claim/body/adapter | invalid mapping |
| ambiguous local/external posture | `Unknown` | RecoveryCase + issue；无法证明其他六类；entry `mark_unknown`已冻结 | readback/reconcile only；no automatic rerun | case missing=`JobError` |

所有result disposition构造后terminal，无`Partial -> Completed`或`Unknown -> Failed`原地迁移。继续工作必须是同一job合同允许的explicit bounded resume（在terminal前），或新job run/key；不能修改已经返回的stored result。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / protocol一致性 | 通过（经最小回写） | domain/application/public均含七个variant；report五variant逐项映射 |
| entry/result/report分轴 | 通过 | entry Completed可对应Completed/Partial/Blocked；entry Failed可对应Failed/Unknown |
| duplicate | 通过 | exact stored report only；no claim/no rescan/no adapter |
| blocker真实性 | 通过 | 上游未ready返回Blocked，不伪造Partial/Failed/Completed |
| truth边界 | 通过 | 所有job disposition仅描述local work，不生成approval/running/cleanup/evidence/verdict/signoff |
| 测试切口 | 通过（未来） | 七variant、identity mismatch、blocked exact mapping、unknown case required、duplicate zero-side-effect |

### 11.10 批次 10.5 停审

| 审查项 | 结论 |
|---|---|
| 技术状态/分类完成数 | 9/9：idempotency、entry、handler、consumer loop/item、job entry/claim/checkpoint/disposition |
| 同名词分轴 | entry/job `Running/Completed`、handler/item `Accepted`均绑定技术主语，不映射软件运行或owner success |
| replay纪律 | Command/Job Completed仅replay完整stored surface；Reserved/Unknown/claim/checkpoint ambiguity均不自动重跑 |
| Consumer phase | Running/Accepted/Delayed/Gap positive branchesreserved；当前只允许安全负向与strict stored Duplicate |
| Job blocker mapping | `JobReportDisposition::Blocked -> RunnerJobDisposition::Blocked`已闭合，不压成Partial/Failed |
| local claim边界 | claim/checkpoint不是Sandbox lease、owner cursor或process lock；Unknown冻结 |
| 当前 blocker | `RUN-UP-001~008`、`RUN-DDD-001~003`全部保留；没有声称consumer、adapter、store、cache或physical runtime ready |
| 下一批 | 10.6 adapter availability / runtime build + 跨状态机与最终审计 |

## 12. 批次 10.6：infra availability / runtime build 状态矩阵

### 12.1 `RunnerAdapterAvailabilityState`

所属对象：`infra::RunnerAdapterAvailabilityMarker`；调用面：runtime composition/readiness gate以及所有需要semantic port的Command/Query/Consumer/Job。Marker描述一个logical slot在一次validated config/build中的本地可调用姿态，不是owner服务健康、contract发布、approval、Sandbox/Runtime状态或集成readiness证明。

```text
[one marker / one validated config build]
  factory -> Enabled -- mark_degraded ----> Degraded
             |   \                           |
             |    +-- mark_unavailable ------+--> Unavailable
             |    +-- mark_blocked ----------+--> Blocked
             |
  factory -> Blocked

  DisabledByConfig: reserved factory/state for a future config-contract reopen

  Degraded/Unavailable/Blocked/DisabledByConfig
    -- config reload / formal recovery --> NEW marker + NEW builder
    (no in-place Enabled transition in the current contract)
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Enabled` | logical slot在已声明semantic contract下本地可调用 | 否 | `is_usable`；mark degraded/unavailable/blocked；每次call仍看result/readiness |
| `DisabledByConfig` | validated config明确禁用optional slot | 是（当前marker）/reserved construction | no call；config reload创建新marker |
| `Degraded` | slot可调用但所有结果必须保留partial/degraded语义 | 是（当前marker） | `is_usable`仅当capability明确允许；新build才能恢复/恶化 |
| `Unavailable` | configured slot当前不可用 | 是（当前marker） | no positive call；query/job返回degraded/blocked/unknown |
| `Blocked` | contract、authority、capability或技术门禁未闭合 | 是（当前marker） | no positive call；保留planned seam |

| From | To | 触发函数 | Flow / build phase | 可落码前置条件 | 状态副作用 | Flow副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Enabled` | `RunnerAdapterAvailabilityMarker::enabled(...)` | runtime assembly | slot/config ref exact；factory与semantic capability negotiation均成功；capability明确支持该slot；`RUN-UP/RUN-DDD` blocker不适用于该positive capability | 写slot/config/capability；issue=None | builder可记录marker；application call仍必须经per-port readiness和typed result | `InfraError` invalid input/capability |
| factory | `Blocked` | `blocked(...)` | current runtime assembly | slot/config ref可识别；正式contract/SDK/client/capability/physical authority未闭合；typed redacted issue存在 | state=`Blocked`；写issue/capability unknown-or-limited | builder记录planned seam；所有positive calls为0 | 同上 |
| factory | `DisabledByConfig` | reserved `disabled_by_config(...)` | future Step 14 config contract | optional slot由validated config显式禁用且core invariant仍安全 | state=`DisabledByConfig`；issue按future contract | 当前Step 6无factory，不能由实现私造；未来启用须先回写Step 6/9/10/14 | 当前boundary不允许 |
| `Enabled` | `Degraded` | `mark_degraded(issue_ref)` | readiness/probe/call classification | typed redacted issue；slot仍满足明确允许的subset capability；不能把unknown当degraded usable | state=`Degraded`；写issue | Query/Job/Consumer surface显式degraded/partial；不改domain/owner truth | `InfraError::InvalidStateTransition` |
| `Enabled` / `Degraded` | `Unavailable` | `mark_unavailable(issue_ref)` | readiness/probe/call classification | temporary/local availability明确失败；issue redacted；ambiguous owner effect另走RecoveryCase | state=`Unavailable`；写issue | subsequent positive call blocked；不回滚已完成truth/intent | 同上 |
| `Enabled` / `Degraded` / `Unavailable` | `Blocked` | `mark_blocked(issue_ref)` | contract/capability authority failure | schema/version/capability/authority不成立或被撤销；typed issue | state=`Blocked`；写issue | positive branch关闭；consumer Ready不可达；不修改业务state | 同上 |
| `Degraded` / `Unavailable` / `Blocked` / `DisabledByConfig` | new `Enabled` marker | config reload/rebuild，非本对象迁移 | future explicit composition operation | same logical slot但新validated config/build identity；formal blocker已关闭；重新协商capability | 原marker不改；新marker factory决定状态 | 新builder完成后才能替换exposed facade；旧in-flight work按原basis收束 | 禁止原地恢复 |

当前blocker映射是状态机输入，不是测试/ready事实：Artifact/Governance/Sandbox/Runtime/Observability/Archive/SDK相关positive slots必须为`Blocked/Unavailable`或明确`Degraded` negative-read posture；local store/cache slots因`RUN-DDD-001~003`也不能宣称Enabled。`ClockConnectivity/IdGenerator`等logical slot即使语义已定义，也没有物理provider证据可据此声称Enabled。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 五variant与Step 6一致 |
| factory/transition | 通过（含reserved） | Enabled/Blocked与三种降级method存在；DisabledByConfig明确reserved，无私造helper |
| recovery模型 | 通过 | 当前marker单调；恢复/config reload创建new marker/builder，不原地清issue |
| readiness边界 | 通过 | configured/client constructed/transport connected均不自动Enabled |
| truth边界 | 通过 | availability变化只影响调用门禁与surface，不迁移任何business/owner state |
| 测试切口 | 通过（未来） | enabled capability guard、blocked positive-call=0、degraded propagation、unavailable、new-build recovery、disabled reserved |

### 12.2 `RunnerRuntimeBuildState`

所属对象：`infra::RunnerRuntimeBuilderState`；调用面：`RunnerRuntimeCompositionPort.validate_config/build_facade`。每个builder绑定一个profile/config identity，是单次构建状态机；`Ready`不表示GUI/server/process已启动，也不表示每个owner adapter ready。

```text
[RunnerRuntimeBuilderState]
  factory -> NotStarted -> ValidatingConfig -> Assembling -> Ready
                |               |                |
                +---------------+----------------+--> Failed

  Ready / Failed -> terminal for this builder
  config reload/change -> NEW builder; never Ready -> Assembling
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `NotStarted` | builder绑定config identity但尚未校验 | 否 | `start_validation`、`mark_failed` |
| `ValidatingConfig` | refs、invariant、required slots/capability要求正在校验 | 否 | record safe issues；`start_assembly`或`mark_failed` |
| `Assembling` | local stores、markers、services/facade正在逻辑组装 | 否 | record adapter/store capability；`mark_ready/failed` |
| `Ready` | application facade可在per-slot readiness门禁下暴露 | 是（本builder） | `can_expose_facade`；不修改builder |
| `Failed` | 未产生可安全暴露的facade | 是（本builder） | no facade；新config/build创建新builder |

| From | To | 触发函数 | build flow | 可落码前置条件 | 状态副作用 | Flow副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `NotStarted` | `RunnerRuntimeBuilderState::for_config(config)` | composition initialization | config由`RunnerRuntimeConfig::from_validated_refs`构造；profile/config/store/adapter refs body-free且唯一；不复制raw config/secret | 写profile/config identity；marker/capabilities/issues初始空 | 不创建concrete adapter，不暴露facade | `InfraError` invalid config identity |
| `NotStarted` | `ValidatingConfig` | `start_validation()` | `validate_config` | config identity与refs可加载；invariant-safe validation准备完成 | state=`ValidatingConfig` | 校验logical refs/requirements；记录redacted issues | `InfraError::InvalidStateTransition` |
| `ValidatingConfig` | `Assembling` | `start_assembly()` | build_facade pre-assembly | config invariant safe；required ref集合完整；无blocking config issue；未把configured当ready | state=`Assembling` | 依次构建local capability/adapter marker/service graph；不对外暴露 | 同上 |
| `Assembling` | `Assembling` | `record_adapter(marker)` / `record_store_capability(capability)` | build loop | slot+config或store kind唯一；marker/capability来源为正式probe/factory；不足保持blocked | append finite markers/capabilities；state不变 | 不保存adapter instance到state；不调用业务operation | duplicate/conflict=`InfraError` |
| `Assembling` | `Ready` | `mark_ready()` | final composition gate | required local store semantics全部可证明；所有required slot均有marker；blocking issue不存在；service graph完整；positive owner slot可Blocked但对应capability必须在facade中fail-closed，不得造成invariant bypass | state=`Ready` | 此后才可返回opaque facade handle；每次operation仍逐slot gate | `InfraError::InvalidStateTransition` |
| `NotStarted` / `ValidatingConfig` / `Assembling` | `Failed` | `mark_failed(issue_ref)` | any validation/assembly failure | blocking issue redacted；无法安全暴露完整facade | state=`Failed`；append issue | 丢弃/不暴露半装配facade；不fallback alternate private/local impl | 同上 |
| `Ready` / `Failed` | new builder `NotStarted` | config reload/profile change | future explicit lifecycle outside this object | newvalidated config identity；旧builder不可修改 | old state retained；new object starts NotStarted | facade swap/old in-flight drainage留Step 11/13/14；不可热改truth invariant | no in-place transition |

`Ready`只证明Runner application facade的依赖图在fail-closed语义下可暴露：某个command/job仍可因相关marker `Blocked/Unavailable`返回blocked；四类Consumer仍因positive contract未授权而不能Running。若local state/result/operation/projection store所需transaction/version/durability/corruption guarantees不能证明，builder绝不能Ready，因为这些不是可降级的外围能力。

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum / 状态名 | 通过 | 五variant与Step 6一致 |
| lifecycle | 通过 | 单次builder单调；Ready/Failed terminal；reload=new builder |
| Ready语义 | 通过 | facade composition ready≠owner adapters ready≠process/GUI running |
| local store hard gate | 通过 | core transaction/version/durability能力不可用时不得Ready |
| fallback | 通过 | assembly failure不选择README旧技术、private SDK、in-memory/file替代 |
| 测试切口 | 通过（未来） | each transition、duplicate slot、missing core capability、blocked owner marker+safe facade、failed no handle、reload new identity |

### 12.3 批次 10.6 状态机停审

| 审查项 | 结论 |
|---|---|
| 状态机完成数 | 2/2 |
| availability/build分轴 | marker描述单slot；builder描述single config composition；两者均不拥有业务truth |
| positive readiness | 未宣称；所有`RUN-UP/RUN-DDD` blocker逐slot保留，local physical capability也未伪造 |
| recovery/config reload | new marker + new builder；无原地恢复或Ready回Assembling |
| technology | Docker/Tauri/gVisor/Firecracker/Rust/store产品/路径均未被状态机选择 |
| 下一动作 | 执行跨状态机副作用、forbidden/reserved/truth-owner/future-test与Step 11～16 handoff最终审计 |

## 13. 跨状态机副作用一致性

| 副作用 / 结果 | 唯一允许来源与顺序 | 允许写入 | 永久禁止 |
|---|---|---|---|
| selection current/invalidation | C01 formal authority assessment；C02/new generation fence | Runner selection/context generation | local cache hit、latest/default、connectivity/GUI选择覆盖authority |
| acquisition progress/complete | J01 exact task/source transfer outcome，逐阶段short UoW | task progress/handle-safe refs/checkpoint | Complete直接Verified/Qualified；修改Release content |
| integrity verified | J01 formal manifest/digest/signature/platform verifier + current authority | integrity posture/results | local hash-only、HTTP 200、曾运行成功、policy guess |
| cache qualified/evicted | J01 verified+authority recheck后promote；C09 cleanup/guard/local release receipt后evict | Runner cache metadata与local receipt refs | Candidate/Releasable/cleanup Confirmed直接Evicted；删除bytes后补状态 |
| run intent accepted | C07 durable Submitting后Sandbox formal receipt | local intent/request ref | ACK/port/PID/socket/Online推Running；反写Sandbox truth |
| owner execution projection | formal Runtime/Sandbox safe read/event（当前positive consumer blocked） | safe attributed projection only | RunIntent/handler/job state推导Running/Success |
| control confirmed | C08/C09 formal same-kind effect posture；J03 formal same-basis reconcile | local control intent/result refs | Accepted直接Confirmed；Stop Confirmed推Cleaned/Evicted |
| recovery reconciliation | J03 exact case/basis read-only reads | RecoveryCase、显式same-basis local intent/handoff helper、safe refs | resend旧command、owner mutation、reconnect/Online关case |
| preview/diagnosis | J04 bounded formal diagnostic material→mandatory redaction | bounded safe projection/diagnosis refs | raw local log/stdout/stderr/host file作fallback或审计证据 |
| handoff posture | C11 durable intent→formal result；J03 formal read_posture | local safe refs/receipt/posture | Delivered/receipt生成evidence/report/verdict/signoff |
| read section replacement | J05 explicit source reads→subject/key/body/scope/generation/version guards | existing Runner projection section | Query/render/reconnect replace；创建缺失identity；跨generation覆盖 |
| connectivity projection | J05 safe observation + optional J03 resolution basis | connectivity section only | Online清任何business stale/unknown或关闭case |
| idempotency completion | stored safe result先保存，同terminal UoW complete record | local result/idempotency records | external effect后无reservation；missing stored surface时重跑 |
| Consumer item | current header-only negative path或strict stored Duplicate | current path不新写；future only safe receipt/projection | parse/hash/store unknown payload、ACK success、owner cursor推进 |
| Job terminal | checkpoint/report/claim安全收束→entry/result/idempotency | local entry/claim/checkpoint/report/result | Job Completed反写approved/running/cleaned/evidence；duplicate rescan |
| adapter/build posture | validated config/capability/readiness/build | infra-local marker/builder | availability/build状态修改domain/owner truth或选择private fallback |
| outbound event | 不适用（Runner outbound数量0） | none | 将trace/receipt/report/checkpoint/projection升格为event/outbox/audit/evidence |

跨对象事务原则：domain/object method只改变自身字段；application在版本化Runner-owned UoW内编排相关对象、stored result与idempotency。任何external I/O均在UoW外；external effect不明或terminal commit不明必须`Unknown + RecoveryCase/readback`，绝不假装回滚或盲重发。精确atomic groups、schema与crash algorithm留Step 11/13。

## 14. Forbidden transition summary

| 状态机 / guard | Forbidden transition / shortcut | 正式处理 |
|---|---|---|
| `SelectionState` | `Invalidated -> Current/Checking`；`Selected -> Current`跳过formal assessment | reject；新selection+successor generation |
| `AcquisitionState` | `Complete/Failed/Cancelled -> Transferring`；Paused因reconnect自动resume | reject；new attempt或显式same-basis resume |
| `IntegrityState` | `Invalid/Stale/Blocked -> Verified`原地改旧结果；Pending跳过Verifying | reject；新verification posture/round |
| `MaterialCacheState` | `Quarantined -> Qualified`无Verified+authority；Candidate/Releasable/Confirmed直接Evicted | reject；完整promote或safe release sequence |
| `ProtectionState` | missing/stale/conflicting input -> Releasable | derive Unknown fail-closed；禁止release |
| `RunIntentState` | `Accepted -> Running`；`Unknown -> Submitting`；terminal重开 | owner execution独立投影；read-only reconcile或new intent |
| `ControlIntentState` | `Pending -> Confirmed`仅靠ACK；`Unknown/Conflict`重发；Confirmed推cleanup | reject；formal effect/same-basis reconcile；cleanup独立 |
| `RecoveryState` | `Frozen -> Reconciled/Closed`；`Closed -> any`；Online/reconnect关case | explicit Querying+formal reads；new case if needed |
| `HandoffState` | `Unknown -> Pending`resend；terminal->Draft；Delivered->evidence | formal read-only reconcile或new handoff；evidence永不由Runner生成 |
| `ConnectivityState` | reconnect直接Online；Online清其他section；Query迁移state | J05 new observation candidate + guards；projection only |
| projection guard | generation/version mismatch仍replace；missing projection ref时create；Q12 replace | Conflict/Blocked no-write；explicit future provisioning需重开合同 |
| idempotency | `Reserved`自动expire/re-reserve；`Completed/Conflict -> Reserved`；missing result重跑 | Unknown/readback/RecoveryCase；new independent intent uses new key |
| entry | `Received -> Dispatching`跳validation；`Dispatching -> Rejected`掩盖typed outcome；terminal重开 | reject；application negative outcome走Completed+exact surface |
| consumer loop/item | current `Registered -> Running`；item Blocked->Accepted；gap last-arrival-wins；Quarantined存payload | contract-not-authorized；new attempt after formal reopen；freeze gap |
| job entry/claim/checkpoint | Running无current claim；Unknown claim自动reclaim；Stale/Unknown checkpoint resume；terminal entry重开 | reject/freeze；RecoveryCase；new run/key/claim only after formal closure |
| job disposition | Blocked压成Partial/Failed；Duplicate重新scan；Unknown无case | exact finite mapping；consistency error/recovery |
| adapter marker | Blocked/Unavailable原地Enabled；configured=Enabled；DisabledByConfig当前私造 | new config/build marker；future Step 14 reopen |
| runtime builder | Ready->Assembling；Failed fallback半runtime；缺core store capability仍Ready | new builder；no facade exposure；fail closed |

## 15. Reserved / blocked / phase-boundary audit

| Reserved / blocked surface | 当前状态 | 重新开放必须补齐 | 当前实现口径 |
|---|---|---|---|
| selection same-generation requalification | reserved | explicit Step 8 boundary + Step 9 flow + authority contract | method存在但无调用；不得由Query/reconnect触发 |
| RecoveryCase `close` | reserved | formal resolution operation/protocol/flow及persistence semantics | Reconciled/ManualReview保持可见；不得local click close |
| four Consumer positive paths | blocked | typed owner payload、source registration、schema/version、client、dedup/order/gap、visibility、application mapping、receipt persistence | header-only Blocked/Unsupported/Rejected；strict stored Duplicate |
| Consumer `Running/Accepted/Delayed/GapDetected` | reserved/blocked | 同上；逐variant Step 8/9/10 reopen | state/result shape存在，不构成readiness |
| Consumer `Quarantined` | blocked | formal transport isolation port及opaque-ref retention/deletion contract | 当前不可达；payload bytes不得落Runner store |
| `DisabledByConfig` marker construction | reserved | Step 14 finite optional-slot config semantics + Step 6 factory + build flow | 不私造factory/transition |
| adapter recovery toEnabled | reserved as new-build only | formal capability/readiness recovery、facade swap/drain、config identity | current marker terminal；new marker/builder |
| projection identity provisioning | blocked | Step 11 provisioning/index/version semantics与explicit operation | J05 missing identity返回Blocked，不upsert |
| positive owner adapters / exact SDK mapping | `RUN-UP-001~008` | published/current upstream contract与L0 SDK exact client/error/redaction/trace surface | semantic port + Blocked/Unavailable/Unsupported only |
| local durable stores/cache | `RUN-DDD-001~003` | real repo/language/runtime/store/cache authority与capability proof | required guarantees only；不选backend/path/product |
| technology choices | pending/blocked | formal authority record | Docker/Tauri/gVisor/Firecracker/Rust等均不继承 |

## 16. Truth-owner / evidence-boundary final audit

| 主语 | Runner可拥有/持久化 | Runner只能读取/投影 | Runner不得拥有/回写 | 结论 |
|---|---|---|---|---|
| user selection/context | explicit exact choice、local context/generation、visibility refs | formal context/authority assessment | Release/version/baseline/approval truth | pass；no latest/default |
| material | acquisition request/progress、quarantine/cache metadata、integrity results、local receipt | Artifact locator/manifest/digest/signature/platform/authority safe surfaces | Release/Artifact content/truth；修改/重编产物 | pass；Complete≠Verified≠Qualified |
| run/control | local run/control intents、request/result refs、RecoveryCase | Sandbox request/boundary/lease/cleanup与Runtime execution/result safe views | Sandbox execution/isolation truth、Runtime truth | pass；Accepted≠Running；Confirmed≠Cleaned |
| resource/cleanup | bounded local observation、guard/candidate/release receipt refs | owner allocation/lease/capture/retention/orphan/cleanup posture | owner allocation/cleanup truth | pass；Candidate≠Releasable≠Evicted |
| presentation | bounded redacted preview、local diagnosis、handoff intent/receipt posture、connectivity/read sections | Observability diagnostic/handoff与Archive safe refs | official logs/audit/evidence/report/verdict/signoff/archive truth | pass；receipt/local log非evidence |
| project/governance | local display/ref only | Governance approval/decision/scope/freshness | project status、approval/baseline/decision truth | pass；no upstream writeback |
| technical execution | idempotency、stored safe results、entry/consumer/job/claim/checkpoint、availability/build marker | formal readiness/capability | owner cursor、Sandbox lease、process truth、implementation readiness | pass；technical Completed不升级business state |

本Step未定义任何Runner outbound event、upstream truth update API、audit/evidence writer或private owner dependency。`RunnerRun`/intent、local report、trace、receipt、diagnosis、preview、job result均不能作为上游truth或formal audit evidence回写。

## 17. Step 11～16 handoff items

| 后续 Step | 必须承接的事项 | 本Step冻结的不可变边界 |
|---|---|---|
| Step 11 persistence / transaction / consistency | object tables/records/indexes、version token、Absent/Exact semantics、generation allocation、idempotency+stored result atomicity、intent tx A/B、RecoveryCase atomic relation、projection identity/provisioning与seven-section stable generation、claim/checkpoint/report/release receipt durability、builder marker persistence（若持久化） | no external I/O in UoW；missing projection identity不由J05创建；unknown不重做 |
| Step 12 error / recovery | 精确domain/application/entry/worker/job/infra error taxonomy；typed adapter outcome mapping；not-visible/degraded/blocked/conflict/unknown public mapping；redaction与raw-error containment；每个illegal transition响应 | 不按字符串/HTTP code/ACK猜状态；Unknown必须RecoveryCase/readback |
| Step 13 concurrency / idempotency / re-entry | generation/version races、reservation crash/readback、stored-result missing、intent call/terminal commit ambiguity、job claim/expiry/checkpoint recovery、J05 concurrent replacement、duplicate zero-side-effect、consumer future order/dedup策略 | no auto replay/resend/reclaim；Completed result不可改写；new intent/new key |
| Step 14 config / dependency binding | required/optional slot矩阵、hard vs degraded capabilities、finite bounds、profile/config reload、new builder/marker与facade swap/drain、SDK-first exact bindings、technology authority gate | configured≠Enabled；Ready≠owner ready；旧README技术不继承 |
| Step 15 observability / audit | local trace/metric/log marker位置、transition rejection/unknown/recovery/connectivity/degraded/job report可观测性、redaction与cardinality bounds、安全handoff correlation | local logs/trace/report不是formal audit/evidence；不得记录raw body/secret/path |
| Step 16 tests | 每台状态机all legal/illegal transitions、每个reserved path不可达、cross-axis non-implication、transaction/external-call spies、duplicate/no-replay、generation conflict、Query no-write、consumer header-only、job/claim/checkpoint、adapter/build fail-closed与fake/durable parity | 测试切口不等测试已运行；不得伪造结果/readiness |

Step 17还必须把上述逻辑对象/ports/protocol/flows/states映射为planned implementation boundary，并继续受Step 4真实仓/物理路径门禁约束；当前Step 10不创建implementation ledger或skeleton。

## 18. 跨状态机命名 / 触发 / 测试最终审计

| 审计项 | 结论 | 依据 / 仍待闭合 |
|---|---|---|
| 状态主语覆盖 | pass | 21个 enum/state 主语均已覆盖（10个业务/投影、9个 application/entry/worker/job 技术状态、2个 infra 状态），另有 1 个非 enum 的 generation conditional-write guard 独立审计 |
| enum variant来源 | pass with one recorded fix | 全部来自Step 6；Job `Blocked`为Step 8/9已要求但Step 6漏项，已最小回写为`RUN-S6-FIX-013/RUN-S8-FIX-006` |
| 状态图/集合/矩阵 | pass | 每台persistent/object state有ASCII、状态语义、guard、trigger、side effect、error；disposition有exhaustive construction matrix |
| trigger存在性 | pass | factory/method/repository helper均回指Step 6/7；J03 reconcile helper缺口已在10.3前回写；无实现侧直改字段 |
| 前置条件可落码 | pass for logic | 只引用typed DTO、versioned read、formal semantic result、stored surface、case/basis、capability marker；exact adapter/persistence仍blocked |
| terminal/retry | pass | terminal对象不重开；retry/new attempt/new config均创建new identity或走explicit same-basis nonterminal path |
| Unknown纪律 | pass | external/commit/claim/checkpoint ambiguity进入Unknown+RecoveryCase/readback；不自动replay/resend/reclaim |
| Query纪律 | pass | Q01～Q12 no-write；无transition/save/replace/refresh/reconcile/job dispatch |
| Consumer phase | pass with blockers | current only header negative + strict Duplicate；positive variantsreserved且Ready contract-not-authorized |
| Job分轴 | pass | entry/report/result/claim/checkpoint分开；Blocked mapping闭合；Completed不等owner success |
| 跨状态副作用 | pass | §13固定唯一来源与永久禁止；无outbound residue、owner truth writeback或evidence生成 |
| reserved标记 | pass | §15逐项列出重新开放条件；实现不得自行启用 |
| future test slices | pass as design | 每台单机停审与§17 Step 16 handoff均有future测试切口；未执行测试 |
| technology/physical truth | blocked as required | `RUN-DDD-001~003`；未选语言/runtime/GUI/process/store/cache/path/product |
| upstream truth/contracts | blocked as required | `RUN-UP-001~008`；没有声称positive adapter/integration/readiness |

### 18.1 Step 10 反查修正记录

| 修正 ID | 文件 | 内容 | 影响 |
|---|---|---|---|
| `RUN-S6-FIX-013` | `03_ddd_step_06_object_contracts.md` | `RunnerJobDisposition`补`Blocked`；`RunnerOperationsJobResult`补`blocked(...)`factory | 让既有Blocked report无损映射；不新增job/owner truth |
| `RUN-S8-FIX-006` | `03_ddd_step_08_protocol_contracts.md` | public `RunnerProtocolJobDisposition`补`Blocked` | 与既有`JobReportDisposition::Blocked`及Step 9保持exhaustive |
| `RUN-S9-FIX-001` | `03_ddd_step_09_function_flows.md` | shared Job terminal mapping逐variant固定 | 禁止Blocked压成Partial/Failed或entry Completed升级业务成功 |

其余Step 10前置最小回写（Run/Control/Handoff reconcile helper、Integrity invalidation、entry/job/consumer transition helper）已记录在对应Step 6/9文档；本批未新增port、protocol family、flow、truth owner或技术选型。

## 19. Step 10 完成条件与停审

| 条件 | 结论 |
|---|---|
| 状态主语筛选 / 批次计划 | completed |
| 业务/local truth状态机 | 2/2 completed |
| source/integrity/protection状态机 | 3/3 completed |
| owner intent/control/recovery/handoff状态机 | 4/4 completed |
| read/presentation状态机 + generation guard | 2/2 completed |
| idempotency/entry/consumer/job技术状态/分类 | 9/9 completed |
| infra availability/build状态机 | 2/2 completed |
| 单机停审 | completed；每机/guard/disposition均有审计与future test slice |
| 跨状态副作用/forbidden/reserved/truth-owner审计 | completed |
| Step 11～16 handoff | completed as design input；未开工 |
| 上游/物理blocker | preserved：`RUN-UP-001~008`、`RUN-DDD-001~003` |
| 正式03/实现/测试/commit | 未修改/未实现/未执行/未提交 |
| Step 10 status | `completed_with_upstream_blockers` |
| gate | `stop_review_required`；依据用户授权，立即停审，不进入Step 11 |
| next allowed action | 等待用户明确审查/授权；若授权继续，先读取Step 11 SOP、书写规范对应章节与L1-governance Step 11，不得直接写正式03 |

Step 10到此停审。本文只证明逻辑状态合同已达到后续持久化设计可引用的粒度；不证明实现仓、adapter、store/cache、SDK、测试、Release、artifact、run、report、evidence、verdict、signoff或readiness存在。
