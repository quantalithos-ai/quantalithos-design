# Step 8. 关键处理流 / 重要函数数据流

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 8 / 关键处理流与重要函数数据流 |
| 状态 | `completed` |
| 当前模块 | `processing_flows:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 六个组成部分的 P0 Command、计划中变更型 Consumer、一致性 Job 与复杂 Query 已逐流展开；事务内外、副作用、unknown/reconcile、对象与接口承接均无 unresolved 冲突。 |
| next_allowed_action | `read_and_start_step_09` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 恢复项目台账、02 flow、Step 7，并读取概要 SOP Step 8、书写规范 §4.8 与 ASCII 图规则。
- [x] 建立统一写路径、读路径、Consumer 和 Job 处理骨架。
- [x] 按六个主要组成部分逐一展开接口处理流并停审。
- [x] 为 P0 Command、计划中变更型 Consumer、一致性 Job 和复杂 Query 画独立处理流。
- [x] 审计事务内外、外部副作用、unknown/reconcile、对象引用和跨部分接缝。
- [x] 形成正式文档回填草稿、历史污染扫描与下一步门禁。

## 2. 本步输入与问题回答

| 输入 | 使用方式 |
|---|---|
| Step 5 | 六个主要组成部分、capability、非职责与跨部分接缝。 |
| Step 6 | 17 个正式关键对象及其不变量、状态和禁止事项。 |
| Step 7 | Command、Query、planned Consumer、Job 与 required port 的唯一接口入口。 |
| 正式 00 §9～14 | 核心主线、fail-closed 规则、数据归属与验收红线。 |
| 正式 01 §8～10 | 依赖方向、同步意图、异步 owner 事实、后台取得与恢复边界。 |
| `RUN-UP-001~008` | 限制所有正向 owner adapter、event schema 与成功结论。 |

问题回答：

1. P0 Command 定义为会创建或失效选择、开始取得、提交运行/控制/清理副作用、进入人工恢复或提交诊断交接的入口；这些入口均独立画图。取得 pause/resume/cancel 共用同一控制骨架，但 `resume` 额外重验 binding/authority。
2. Query 一律 no-write。简单本地投影读取走通用读路径；有 authority 缺口、双视图、裁剪、fallback、not-ready 或跨部分组合的 Query 独立画图。
3. 四个 Inbound Consumer 都会在合同闭合后改写本地 projection，故均画 planned/blocked 流；当前必须在 readiness gate 停止，不能用自造 envelope 进入正向分支。
4. 五个 Job 均影响材料资格、淘汰安全、恢复一致性、诊断 freshness 或组合视图一致性，故均独立画图。
5. 本地事务只覆盖 Runner-owned state、dedup/index 与 safe projection；网络、下载、平台 probe、验证器和 owner 提交均在事务外。外部结果通过新事务按 expected version/basis 应用。
6. 任何副作用结果无法确认时写 `unknown` 并建立/关联 `RecoveryCase`；不在入口、job 或 reconnect 中自动 replay。

## 3. 通用处理流骨架

### 3.1 Command 通用写路径

```text
Command + ActorContext + CommandMetadata + IdempotencyKey
  │
  ▼
Inbound / RunnerEntryFacade
  - 校验输入形态、显式引用、actor/context 与幂等身份
  │
  ▼
Application Service
  - 事务外读取 owner-safe basis / local observation
  - 调用 DomainObject.assert_basis(ExpectedBasis expected_basis)
  │
  ▼
Local transaction A
  - expected-version 校验、创建 Runner-owned intent/state
  - 保存 correlation/idempotency；提交后才允许外部副作用
  │
  ▼
Required Port（事务外）
  - 提交一次正式 owner 请求；不得持有本地事务
  │
  ├─ 明确 receipt/result ─► Local transaction B：按 owner ref 更新本地姿态
  └─ timeout/ambiguous ───► Local transaction B：unknown + RecoveryCase
  │
  ▼
Typed Result（accepted/rejected/blocked/unknown；不推导 owner success）
```

关键设计点：

- 本地事务与外部调用分离；不得通过跨仓共享事务制造原子性假象。
- 幂等键固定同一 intent，不授权自动 retry；`unknown` 只允许先 query/reconcile。
- 详细设计继续展开 expected-version、operation record、错误分类与 crash window，但不得改变 owner 边界。

### 3.2 Query 通用读路径

```text
Query + ActorContext
  │
  ▼
Inbound Query Adapter
  - 校验 visibility context；禁止隐式 refresh
  │
  ▼
Query Service（只读）
  - 读取 Runner local truth / safe projection / observation
  │
  ▼
Projection / View Composer
  - 保留 source、freshness、visibility 与各独立状态轴
  │
  ▼
Typed View
  - current/stale/partial/restricted/unavailable/not-ready
```

关键设计点：

- Query、render、reconnect view 均不得写本地或 owner truth，也不得触发下载、reconcile 或 repair。
- 缺失不能被空成功、旧 cache 或默认值补齐；fallback 只能返回有来源标记的更弱视图。
- 详细设计继续展开 snapshot read consistency 和分页，不改变 no-write 约束。

### 3.3 Planned Inbound Consumer 通用路径

```text
Owner event candidate
  │
  ▼
Contract readiness gate
  ├─ 当前：schema/client/source 未闭合 ─► blocked；不解析、不写 projection
  └─ 未来：正式合同可验证
              │
              ▼
Consumer Inbound
  - 校验 envelope、event id、source version、visibility
              │
              ▼
Local transaction
  - dedup + gap/order 检查 + ProjectionBuilder.apply(OwnerEvent event)
  - gap/conflict 只标 stale 并创建 RecoveryCase
              │
              ▼
Applied / Duplicate / Stale-Reconcile Result
```

关键设计点：

- 当前四类 Consumer 全部是 planned/blocked，图中的未来分支不是 readiness 声明。
- Consumer 只承接 owner 已提交事实；乱序、gap 或未知版本不得按“最新事件”覆盖当前 projection。
- 详细设计只有在 owner 合同闭合后才能定义 envelope、cursor、dedup persistence 和订阅承载。

### 3.4 Operations Job 通用路径

```text
Explicit trigger / persisted due work
  │
  ▼
Operations Job
  - 取得本地 execution claim；重读 persisted basis
  │
  ▼
Application Service
  - 校验 generation/source/digest/lease/expected version
  │
  ▼
External read/work（事务外）
  - formal port / verifier / bounded platform operation
  │
  ▼
Local transaction
  - 仅在 basis 仍匹配时提交 local state / safe projection
  │
  ▼
Completed / Blocked / Stale / Unknown-Reconcile
```

关键设计点：

- Job completion 只说明本地工作收束，不证明 approval、running、cleanup、evidence 或 verdict。
- Job 发现 basis 漂移必须放弃旧结果；外部副作用不因 worker 重启自动重放。
- 详细设计继续展开 claim、cancellation、checkpoint 与并发模型，不在概要层锁数值。

## 4. 处理流覆盖清单

| 接口 | 归属 | 独立处理流 | 原因 / 处理口径 |
|---|---|---:|---|
| `SelectRelease` | Context/selection | 是 | P0；创建 generation/selection 并失效旧链。 |
| `InvalidateSelection` | Context/selection | 是 | P0 安全入口；冻结旧材料与 intent。 |
| `ResolveRunnerContext`、`GetSelectionPosture` | Context/selection | 否 | 走通用只读路径；不 refresh。 |
| `ListSelectableReleases` | Context/selection | 是 | authority/visibility/not-ready，禁止 cache 补齐。 |
| `ConsumeReleaseAuthorityChange` | Context/selection | 是 | planned state-changing consumer，当前 blocked。 |
| `RequestMaterialAcquisition` | Material | 是 | P0；创建 task，实际取得由 Job 承担。 |
| `Pause/Resume/CancelAcquisition` | Material | 是（共用） | 本地控制骨架；resume 需重验，cancel 不等 cleanup。 |
| `GetMaterialPreparation`、`GetCacheProtection` | Material | 否 | 走通用只读路径，各状态轴原样返回。 |
| `AcquireAndVerifyMaterialJob` | Material | 是 | 长时副作用与资格一致性。 |
| `EvaluateCacheEvictionJob` | Material/resource | 是 | 影响保护与删除安全。 |
| `RequestRun` | Lifecycle | 是 | P0 owner 副作用；accepted != running。 |
| `RequestRunControl` | Lifecycle | 是 | P0 start/stop/cancel；unknown 禁止 replay。 |
| `GetRunLifecycle` | Lifecycle | 是 | owner/local 多轴、not-ready/freshness。 |
| `ConsumeSandboxLifecycleChange` | Lifecycle/resource | 是 | planned state-changing consumer，当前 blocked。 |
| `ConsumeRuntimeStatusChange` | Lifecycle | 是 | planned state-changing consumer，当前 blocked。 |
| `RequestCleanup` | Resource/recovery | 是 | P0；保护门禁与 owner cleanup 独立。 |
| `OpenManualReview` | Resource/recovery | 是 | P0 恢复收束；不改变 owner truth。 |
| `GetResourceCleanupView` | Resource/recovery | 是 | local probe/owner allocation 双视图与冲突。 |
| `GetRecoveryCase` | Resource/recovery | 否 | 走通用只读路径；不触发 reconcile。 |
| `ReconcileRunnerStateJob` | Resource/recovery | 是 | unknown/断线恢复一致性核心。 |
| `RequestDiagnosticHandoff` | Diagnosis/handoff | 是 | P0 外部交接；receipt 非 evidence。 |
| `GetOutputPreview` | Diagnosis/handoff | 是 | bounded/redacted/partial/fallback。 |
| `GetFailureDiagnosis` | Diagnosis/handoff | 是 | 多来源裁剪与 uncertainty。 |
| `GetHandoffPosture` | Diagnosis/handoff | 否 | 走通用读路径；receipt 保留 owner attribution。 |
| `ConsumeHandoffChange` | Diagnosis/handoff | 是 | planned state-changing consumer，当前 blocked。 |
| `RefreshSafeDiagnosisJob` | Diagnosis/handoff | 是 | 影响诊断 freshness/visibility。 |
| `GetRunnerReadModel` | Entry/presentation | 是 | 跨部分组合、部分不可用与 no-write。 |
| `RefreshVisibleSourcesJob` | Entry/presentation | 是 | 查询一致性维护必须与 render 分离。 |

## 5. 按主要组成部分展开处理流

## 5.1 Context and explicit selection

#### SelectRelease 处理流

```text
SelectRelease(ActorContext actor, SelectReleaseInput input,
              CommandMetadata metadata, IdempotencyKey idempotency_key)
  │
  ▼
RunnerEntryFacade
  - 拒绝 latest/default branch/directory newest；解析可信 context
  │
  ▼
SelectionService（事务外只读）
  - 调用 ReleaseAuthorityReadPort.read(ReleaseAuthorityQuery query)
  - 校验 immutable release/version/scope 与 authority visibility
  │
  ▼
Local transaction
  - 调用 SelectionGeneration.next(SelectionGeneration previous,
                                   SelectionChangeCause cause)
  - 调用 ReleaseSelection.select(RunnerContextRef context_ref, ReleaseRef release_ref,
                                  ArtifactVersionRef version_ref, RunnerScopeRef scope_ref,
                                  SelectionGeneration generation)
  - 保存选择；将旧 generation 的资格/意图标为不可继续
  │
  ▼
ReleaseSelectionResult
  - selected/checking/current/blocked；不生成 approval
```

关键设计点：

- authority 读取在本地事务外，提交时必须再次比较 context 与前一 generation 的 expected version。
- “选择成功”不等于 authority current、材料 qualified 或可运行；选择变化不得复用旧 intent。
- 详细设计展开并发换选、idempotency collision 和失效 fan-out 的持久化方式。

#### InvalidateSelection 处理流

```text
InvalidateSelection(ActorContext actor, SelectionInvalidationInput input,
                    CommandMetadata metadata)
  │
  ▼
RunnerEntryFacade / SelectionService
  - 校验 source、selection id、expected generation 与失效原因
  │
  ▼
Local transaction
  - 调用 ReleaseSelection.invalidate(SelectionInvalidation reason,
                                     SelectionGeneration next_generation)
  - 将相关 IntegrityPosture / RunIntent 标为 stale 或 invalidated
  - 对未确认副作用建立 RecoveryCase.freeze(RecoveryTrigger trigger,
                                               RecoverySubjectRefSet subject_refs,
                                               RecoveryExpectedBasis expected_basis)
  │
  ▼
SelectionInvalidationResult
  - invalidated + affected refs；不撤销或修改 owner Release
```

关键设计点：

- 这是 Runner 本地失效边界，不是 Artifact revoke 或 Governance decision。
- 已经发出的 owner 请求不能靠本地事务撤回；未确认者进入 reconcile，不自动 cancel/replay。
- 详细设计展开关联对象索引与批量失效的原子边界。

#### ListSelectableReleases 处理流

```text
ListSelectableReleases(ActorContext actor, ReleaseSelectionQueryInput input)
  │
  ▼
Query Adapter（只读）
  - 解析 scope / visibility；禁止隐式默认版本
  │
  ▼
SelectionQueryService（事务外只读）
  - 读取 Artifact/Governance safe view
  │
  ├─ current + visible ─► 过滤为 immutable exact choices
  ├─ partial/restricted ─► 返回受限条目与明确缺口
  └─ unavailable/not-ready ─► blocked/unavailable；不回退旧 cache 为可选项
  │
  ▼
SelectableReleasePage（带 source/freshness/visibility）
```

关键设计点：

- Query 不建立 selection，也不把历史使用记录变成候选 authority。
- fallback 只允许返回“历史参考且不可选择”的弱视图，不允许生成 `latest`。
- 详细设计展开分页合并和 visibility 裁剪，不改变 authority owner。

#### ConsumeReleaseAuthorityChange 处理流

```text
ConsumeReleaseAuthorityChange(OwnerEventEnvelope<ReleaseAuthorityChange> event)
  │
  ▼
Release authority event contract readiness gate
  ├─ 当前 RUN-UP-001/002/008 ─► blocked；不解析、不写 selection
  └─ 未来正式合同闭合
              │
              ▼
Consumer / SelectionService
  - 校验 event id/source version/scope/visibility 与 selection binding
              │
              ▼
Local transaction
  - dedup；调用 ReleaseSelection.invalidate(SelectionInvalidation reason,
                                             SelectionGeneration next_generation)
  - gap/冲突只标 stale 并创建 RecoveryCase
              │
              ▼
Applied / Duplicate / Stale-Reconcile
```

关键设计点：

- 当前没有可实现的正向事件路径；显式 query/reconcile 仍是保守路径。
- 即使未来启用，Consumer 也只应用 owner authority 变化，不生成本地 approval。
- 详细设计须等待 event schema、source version 与 SDK surface 正式闭合。

本部分停审：接口均有处理流口径；使用 `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection`；与 Artifact/Governance 的接缝保持 required/blocked；无越层实现。`pass`。

## 5.2 Material acquisition and qualification

#### RequestMaterialAcquisition 处理流

```text
RequestMaterialAcquisition(ActorContext actor, AcquisitionRequestInput input,
                           CommandMetadata metadata, IdempotencyKey idempotency_key)
  │
  ▼
RunnerEntryFacade / AcquisitionService
  - 重验 context、ReleaseSelection current 与 selection generation
  - 事务外读取 current authority / locator availability posture
  │
  ▼
Local transaction
  - 调用 ReleaseSelection.assert_binding(ReleaseRef release_ref,
                                         ArtifactVersionRef version_ref,
                                         SelectionGeneration generation)
  - 调用 AcquisitionTask.start(SelectionBinding selection_binding,
                               AcquisitionTaskId task_id)
  - 保存 due work；不得创建 verified/qualified
  │
  ▼
AcquisitionRequestResult
  - accepted/blocked/conflict；后台 Job 引用
```

关键设计点：

- Command 只创建取得任务；locator 解析、下载和验证不在请求事务内执行。
- 已存在同 binding 的任务按幂等身份复用结果；不同 binding 不得合并。
- 详细设计展开任务调度、用户前台进度订阅和本地 crash recovery。

#### Pause / Resume / Cancel Acquisition 处理流

```text
PauseAcquisition | ResumeAcquisition | CancelAcquisition
  │
  ▼
Acquisition Command Adapter
  - 校验 ActorContext、task id、expected task version
  │
  ▼
AcquisitionService
  ├─ pause ─► 调用 AcquisitionTask.pause(AcquisitionPauseReason reason)
  ├─ resume ─► 事务外重验 selection/authority/source binding
  └─ cancel ─► 标记 cancelled；发出本地 cancellation signal
  │
  ▼
Local transaction
  - expected-version 更新 task；保存 control posture
  │
  ▼
AcquisitionControlResult
  - paused/transferring/cancelled/blocked/conflict
```

关键设计点：

- `resume` 不是盲续传；source/generation/authority 漂移时保持 blocked/stale。
- cancel 只终止取得意图，不证明 quarantine bytes 已删除；删除另走保护/淘汰门禁。
- 详细设计展开 cooperative cancellation 与传输 provider checkpoint，不锁 retry 数值。

#### AcquireAndVerifyMaterialJob 处理流

```text
AcquireAndVerifyMaterialJob(AcquisitionTaskId task_id)
  │
  ▼
AcquisitionJob
  - 取得本地 execution claim；重读 task/selection/authority basis
  │
  ▼
AcquisitionService（事务外）
  - 调用 MaterialSourcePort.resolve(MaterialSourceQuery query)
  - 调用 MaterialSourcePort.transfer(MaterialTransferRequest request)
  │
  ▼
Short local transactions
  - 调用 AcquisitionTask.record_progress(TransferProgress progress)
  - 完成后调用 MaterialCacheEntry.quarantine(MaterialSourceBinding source_binding,
                                               LocalMaterialHandle storage_handle)
  │
  ▼
QualificationService（事务外验证）
  - 调用 IntegrityVerifierPort.verify(IntegrityVerificationRequest request)
  │
  ▼
Final local transaction
  ├─ basis current + all checks pass ─► IntegrityPosture verified；cache qualified
  ├─ mismatch/invalid ─► invalid/quarantine
  └─ missing/ambiguous ─► blocked/stale；不晋级
```

关键设计点：

- 下载、cache quarantine、验证、authority current 与 qualified 是独立检查点。
- 传输/验证在长事务外；每次本地提交都比较 task version 与 immutable source binding。
- `RUN-UP-001/002/008` 未关闭时正向 resolve/transfer/verify 为 blocked，不能以 HTTP 200 或文件存在替代。

#### EvaluateCacheEvictionJob 处理流

```text
EvaluateCacheEvictionJob(CacheEvaluationScope scope)
  │
  ▼
Eviction Operations Job
  - 读取 cache entries、capacity observation 与 protection refs
  │
  ▼
ResourceRecoveryService（事务外只读）
  - 读取 owner lease/capture/handoff/retention/orphan posture
  - 调用 ProtectionGuard.evaluate(ProtectionInputs inputs)
  │
  ▼
Local transaction
  ├─ releasable + basis current ─► 仅标记 evictable candidate
  ├─ protected/blocked ─► 保存保护姿态
  └─ missing/unknown ─► 保守 protected/unknown
  │
  ▼
EvictionEvaluationResult（候选，不等于已经删除）
```

关键设计点：

- 本 Job 只做一致性评估，不直接删除；实际释放还需独立执行与再次 guard。
- 磁盘压力、last-used 和用户点击不能覆盖 active/unknown protection。
- 详细设计展开候选选择与安全释放操作，不在概要层固定容量阈值。

本部分停审：取得、控制、验证与淘汰均有对象承接；transaction/side effect 分离；`complete != verified != qualified`；保护未被绕过。`pass`。

## 5.3 Run intent and lifecycle

#### RequestRun 处理流

```text
RequestRun(ActorContext actor, RunRequestInput input,
           CommandMetadata metadata, IdempotencyKey idempotency_key)
  │
  ▼
RunnerEntryFacade / RunLifecycleService
  - 事务外重验 context、authority、selection generation
  - 校验 qualified material binding、ProtectionGuard 与资源冲突影响
  │
  ▼
Local transaction A
  - 调用 IntegrityPosture.assert_qualified(MaterialSourceBinding binding,
                                            SourceFreshness freshness)
  - 调用 RunIntent.create(RunnerContextRef context_ref,
                          SelectionBinding selection_binding,
                          QualifiedMaterialBinding material_binding,
                          RunnerCommandMetadata metadata)
  - 调用 RunIntent.mark_submitting(RunnerCommandMetadata metadata)
  │
  ▼
SandboxRunPort.request(SandboxRunRequest request)（事务外；当前 blocked）
  │
  ├─ owner receipt ─► Local transaction B：record_receipt；accepted/rejected
  └─ ambiguous ─────► Local transaction B：mark_unknown + RecoveryCase
  │
  ▼
RunRequestResult（accepted 不等于 boundary/running）
```

关键设计点：

- 这是唯一正式 run request 出口；入口不得直接调用 Sandbox 私有实现或 Runtime。
- selection/material/authority 必须在提交前同 binding；owner 调用返回 ACK 只更新 request 轴。
- 详细设计展开 crash window 与正式幂等合同；合同未闭合时只能形成 blocked 本地结果，不能伪造 request ref。

#### RequestRunControl 处理流

```text
RequestRunControl(ActorContext actor, RunControlInput input,
                  CommandMetadata metadata, IdempotencyKey idempotency_key)
  │
  ▼
RunnerEntryFacade / ControlService
  - 读取 RunIntent 与 current OwnerRunProjection
  - 校验 expected request/run/lease basis；unknown 时不创建 replay
  │
  ▼
Local transaction A
  - 调用 ControlIntent.request(ControlIntentKind kind, RunIntentId run_intent_id,
                               OwnerStateBasis expected_owner_basis,
                               RunnerCommandMetadata metadata)
  │
  ▼
SandboxRunPort.control(SandboxControlRequest request)（事务外；当前 blocked）
  │
  ├─ result ─► Local transaction B：record_owner_result
  ├─ basis conflict ─► mark_conflict；冻结
  └─ timeout/ambiguous ─► unknown + RecoveryCase；禁止自动重发
  │
  ▼
RunControlResult（accepted/confirmed/rejected/conflict/unknown）
```

关键设计点：

- start/stop/cancel 共用 typed intent，但各自不压平为单一 success；stop confirmed 仍不等 cleanup。
- PID、端口、socket 或本地进程变化只进入 resource observation，不确认控制效果。
- 详细设计须等待 owner expected-basis/idempotency/error 合同，不得本地发明 kill 旁路。

#### GetRunLifecycle 处理流

```text
GetRunLifecycle(ActorContext actor, RunLifecycleQueryInput input)
  │
  ▼
Lifecycle Query Adapter（只读）
  │
  ▼
RunLifecycleQueryService
  - 读取 RunIntent / ControlIntent / OwnerRunProjection
  │
  ▼
RunPostureComposer
  ├─ owner refs current ─► 分别展示 request/execution/control/result
  ├─ projection stale/partial ─► 保留 last-known + stale/partial 标签
  └─ owner ref absent/not-ready ─► execution unknown/not-started；不从本地补齐
  │
  ▼
RunPostureSection（带 source/freshness/visibility）
```

关键设计点：

- Query 不刷新 owner，不把 accepted/PID/端口/toast 推为 running 或 terminal。
- last-known 只能作为带 stale 标记的历史视图，不能授权控制或 cleanup。
- 详细设计展开多 source snapshot read 和展示优先级。

#### ConsumeSandboxLifecycleChange 处理流

```text
ConsumeSandboxLifecycleChange(OwnerEventEnvelope<SandboxLifecycleChange> event)
  │
  ▼
Sandbox event contract readiness gate
  ├─ 当前 RUN-UP-003/007/008 ─► blocked；不写 owner projection
  └─ 未来正式合同闭合
              │
              ▼
Sandbox Lifecycle Consumer
  - 校验 event/source version/request/boundary/lease binding
              │
              ▼
Local transaction
  - dedup；调用 OwnerRunProjection.apply_owner_snapshot(OwnerRunSnapshot snapshot)
  - gap/conflict 标 stale，建立 RecoveryCase；不推断 running/cleanup
              │
              ▼
Applied / Duplicate / Stale-Reconcile
```

关键设计点：

- ACK 或 receipt 事件若不含正式 execution posture，不能更新 running 轴。
- Sandbox 仍拥有 boundary/lease/cleanup truth；Runner 只保留安全投影。
- exact event 与 adapter 受 blocker 控制。

#### ConsumeRuntimeStatusChange 处理流

```text
ConsumeRuntimeStatusChange(OwnerEventEnvelope<RuntimeStatusChange> event)
  │
  ▼
Runtime event contract readiness gate
  ├─ 当前 RUN-UP-004/008 ─► blocked；不写 execution/result projection
  └─ 未来正式合同闭合
              │
              ▼
Runtime Status Consumer
  - 校验 event id/source version/runtime run ref/visibility
              │
              ▼
Local transaction
  - dedup；将 owner-safe status/result refs 应用到 OwnerRunProjection
  - gap/乱序标 stale 并触发只读 reconcile
              │
              ▼
Applied / Duplicate / Stale-Reconcile
```

关键设计点：

- Runtime status 只能更新其正式拥有的执行/结果轴，不反写 RunIntent 为“成功”。
- 不消费 raw runtime loop、raw output 或未知 payload。
- 详细设计等待 Runner-facing safe status surface。

本部分停审：run/control/query/两类 Consumer 均回指 `RunIntent`、`ControlIntent`、`OwnerRunProjection`；`accepted != running` 与 unknown 冻结贯穿所有路径。`pass`。

## 5.4 Resource, cleanup and recovery protection

#### RequestCleanup 处理流

```text
RequestCleanup(ActorContext actor, CleanupRequestInput input,
               CommandMetadata metadata, IdempotencyKey idempotency_key)
  │
  ▼
RunnerEntryFacade / ResourceRecoveryService
  - 事务外读取 owner lease/cleanup/capture/handoff/retention/orphan basis
  - 调用 ProtectionGuard.evaluate(ProtectionInputs inputs)
  │
  ├─ protected/blocked/unknown ─► blocked；不调用 cleanup、不删除材料
  └─ releasable + basis current
              │
              ▼
Local transaction A
  - 调用 ProtectionGuard.assert_releasable(OwnerCleanupBasis cleanup_basis)
  - 建立 cleanup ControlIntent；保存 expected owner basis
              │
              ▼
SandboxRunPort.cleanup(SandboxCleanupRequest request)（事务外；当前 blocked）
              │
              ├─ confirmed ─► Local transaction B：记录 owner ref；重新评估保护
              └─ ambiguous ─► unknown + RecoveryCase；仍保持保护
              │
              ▼
CleanupRequestResult（不直接标 released/evicted）
```

关键设计点：

- cleanup intent、owner accepted、owner confirmed、resource released 和 local material evicted 是不同阶段。
- guard 必须在请求前与确认后检查；任何缺失默认 unknown/protected。
- 详细设计展开 owner cleanup basis、释放执行和材料删除 crash safety，不能共享 Sandbox 私有 guard。

#### OpenManualReview 处理流

```text
OpenManualReview(ActorContext actor, ManualReviewInput input,
                 CommandMetadata metadata)
  │
  ▼
Recovery Command Adapter / ResourceRecoveryService
  - 校验 RecoveryCase 处于 conflict/unknown/frozen 且 actor 可见
  │
  ▼
Local transaction
  - 调用 RecoveryCase.require_manual_review(ReconcileFailure reason)
  - 保留 protection 与 source refs；记录安全说明
  │
  ▼
ManualReviewResult
  - manual_review + allowed next actions；不改变 owner state
```

关键设计点：

- 人工复核是一种保守恢复状态，不是绕过 authority/guard 的管理员后门。
- 进入 manual review 不自动解冻副作用，必须由未来有依据的显式命令收束。
- 详细设计展开授权视图和人工决策输入，但不得把本地记录升级为 signoff。

#### GetResourceCleanupView 处理流

```text
GetResourceCleanupView(ActorContext actor, ResourceCleanupQueryInput input)
  │
  ▼
Resource Query Adapter（只读）
  │
  ▼
ResourceRecoveryQueryService
  - 读取 ResourceObservation / ProtectionGuard / owner allocation-lease-cleanup refs
  │
  ▼
ResourceCleanupComposer
  ├─ local 与 owner 一致 ─► 并列展示两类来源
  ├─ 冲突 ─► conflict + 影响；owner truth 不被覆盖
  └─ 任一来源 stale/unavailable ─► unknown/partial + 保护提示
  │
  ▼
ResourceCleanupSection（双视图）
```

关键设计点：

- local port/process/path observation 不等于 reserved/leased/released。
- Query 不执行新 probe；新观察只能由显式 command/job 产生并带 freshness。
- 详细设计展开平台差异化展示和 safe resource key。

#### ReconcileRunnerStateJob 处理流

```text
ReconcileRunnerStateJob(RecoveryCaseId recovery_case_id)
  │
  ▼
ReconcileJob
  - 重读 frozen RecoveryCase / expected basis；确认副作用仍冻结
  │
  ▼
ResourceRecoveryService（事务外只读）
  - 经正式 ports 查询 context、authority、Sandbox、Runtime、handoff current state
  │
  ▼
Reconciliation decision
  - 调用 RecoveryCase.reconcile(RecoveryExpectedBasis expected,
                                 OwnerRecoverySnapshot actual)
  │
  ▼
Local transaction
  ├─ 可证明一致 ─► 更新 safe projections；reconciled
  ├─ 明确不一致 ─► conflict；继续冻结
  └─ 不可见/缺失 ─► manual_review 或保持 querying/frozen
  │
  ▼
ReconcileResult（绝不 replay owner command）
```

关键设计点：

- reconnect/online 只允许启动本 Job，不代表恢复成功。
- 对账只读 owner current state；不推进 owner cursor、不修复 owner truth、不补发未知请求。
- 详细设计展开 source query fan-in、partial result 与本地提交顺序。

本部分停审：resource observation、protection、cleanup 与 recovery 保持四类语义；双视图和 no-replay 明确；`RUN-UP-003/007/008` 未被正向假设绕过。`pass`。

## 5.5 Preview, diagnosis and handoff

#### RequestDiagnosticHandoff 处理流

```text
RequestDiagnosticHandoff(ActorContext actor, DiagnosticHandoffInput input,
                         CommandMetadata metadata, IdempotencyKey idempotency_key)
  │
  ▼
RunnerEntryFacade / HandoffService
  - 读取 FailureDiagnosis 与 allowed source refs
  - 调用 RedactionPort.redact(RedactionRequest request)（事务外）
  - 校验 visibility、freshness、target 与 material bound
  │
  ▼
Local transaction A
  - 调用 HandoffPosture.prepare(FailureDiagnosisRef diagnosis_ref,
                                SafeHandoffMaterialRefSet material_refs,
                                HandoffTargetRef target_ref)
  - 调用 HandoffPosture.submit(HandoffCommandMetadata metadata)
  │
  ▼
ObservabilityHandoffPort.submit(DiagnosticHandoffRequest request)
  （事务外；当前 blocked）
  │
  ├─ receipt ─► Local transaction B：record_receipt
  └─ ambiguous ─► mark_unknown；建立 RecoveryCase，禁止自动重发
  │
  ▼
DiagnosticHandoffResult（receipt 非 evidence/report/verdict/signoff）
```

关键设计点：

- 未通过 redaction/visibility 校验的材料不得持久化为待交接正文，也不得发送。
- accepted/delivered 只说明交接姿态，不迁移 Observability/Archive ownership。
- 详细设计等待 handoff/receipt 合同，并展开安全材料封装与本地留存策略。

#### GetOutputPreview 处理流

```text
GetOutputPreview(ActorContext actor, OutputPreviewQueryInput input)
  │
  ▼
Preview Query Adapter（只读）
  │
  ▼
PreviewService
  - 读取 owner-safe output material ref 与已有 redacted projection
  │
  ▼
OutputPreview policy
  ├─ safe/current/visible ─► bounded content + source/freshness
  ├─ safe but stale/partial ─► clipped last-known + 明确标签
  ├─ restricted ─► metadata-only restricted view
  └─ not-ready/unavailable ─► unavailable；不读取 raw body 作 fallback
  │
  ▼
OutputPreviewView
```

关键设计点：

- Query 不调用 raw log endpoint、不现场抓取 stdout/stderr、不保存 body。
- fallback 从不放宽 redaction 或可见性；空内容与 unavailable 必须可区分。
- 详细设计展开裁剪预算和 view DTO，但数值由配置设计承接。

#### GetFailureDiagnosis 处理流

```text
GetFailureDiagnosis(ActorContext actor, FailureDiagnosisQueryInput input)
  │
  ▼
Diagnosis Query Adapter（只读）
  │
  ▼
DiagnosisService
  - 读取已有 FailureDiagnosis、安全 source refs 与 RecoveryCase posture
  │
  ▼
Diagnosis view composition
  ├─ sources sufficient/current ─► classification + impact + safe next step
  ├─ partial/stale/conflicting ─► uncertain + reconcile/manual-review guidance
  └─ restricted/unavailable ─► source-attributed limited view
  │
  ▼
FailureDiagnosisView（不生成 verdict）
```

关键设计点：

- Query 只展示已建立诊断；refresh/classify 写入必须由独立 Job 完成。
- `next_step` 不得建议对 unknown 副作用自动 replay。
- 详细设计展开 failure signal precedence 和本地化展示，不改 owner 失败事实。

#### ConsumeHandoffChange 处理流

```text
ConsumeHandoffChange(OwnerEventEnvelope<HandoffChange> event)
  │
  ▼
Handoff event contract readiness gate
  ├─ 当前 RUN-UP-005/008 ─► blocked；不写 handoff posture
  └─ 未来正式合同闭合
              │
              ▼
Handoff Consumer
  - 校验 event id/source version/handoff ref/visibility
              │
              ▼
Local transaction
  - dedup；调用 HandoffPosture.record_receipt(HandoffReceiptRef receipt_ref,
                                              OwnerHandoffPosture posture)
  - gap/conflict 标 unknown/stale 并创建 RecoveryCase
              │
              ▼
Applied / Duplicate / Unknown-Reconcile
```

关键设计点：

- event 只能确认 handoff 姿态，不能创建 evidence/report/verdict/signoff。
- 当前合同未闭合，显式 receipt query/reconcile 是唯一保守路径。
- 详细设计等待正式 owner schema 与 retention/visibility 规则。

#### RefreshSafeDiagnosisJob 处理流

```text
RefreshSafeDiagnosisJob(DiagnosticSubjectRefSet subjects)
  │
  ▼
Diagnosis Operations Job
  - 读取 source refs、旧 freshness 与 visibility
  │
  ▼
DiagnosisService（事务外）
  - 经 DiagnosticReadPort 读取 bounded safe signals
  - 调用 RedactionPort.redact(RedactionRequest request)
  - 调用 FailureDiagnosis.diagnose(DiagnosticSubjectRefSet subjects,
                                    FailureSignals signals,
                                    RedactionResult redaction)
  │
  ▼
Local transaction
  ├─ basis/current visibility 匹配 ─► 替换 safe diagnosis/preview projection
  ├─ restricted ─► 保存 metadata-only restricted posture
  └─ gap/ambiguous ─► mark_uncertain；不抓 raw logs
  │
  ▼
DiagnosisRefreshResult（非 evidence）
```

关键设计点：

- Job 读取的仍必须是 owner-safe material；redaction 不是接受 raw secret 的补救理由。
- 更新只影响 Runner local diagnosis/projection，不改变 source failure。
- 详细设计展开 signal mapping、cancellation 和 redaction failure handling。

本部分停审：handoff、preview、diagnosis、Consumer 与 Job 均保持 bounded/redacted/source-attributed；没有任何路径生成正式证据或结论。`pass`。

## 5.6 Entry and presentation composition

#### GetRunnerReadModel 处理流

```text
GetRunnerReadModel(ActorContext actor, RunnerReadModelQueryInput input)
  │
  ▼
GUI / CLI / Product Query Adapter（只读）
  │
  ▼
RunnerReadModelComposer
  - 并列读取 context/selection/material/run/resource/diagnosis/connectivity sections
  - 调用 RunnerReadModel.compose(RunnerReadSources sources)
  - 调用 RunnerReadModel.redact_for(ActorContext actor,
                                    VisibilityContext visibility)
  │
  ▼
Composition policy
  ├─ all ready ─► 多轴完整 view
  ├─ partial/stale ─► section-level partial/stale；其余 section 仍可读
  └─ context unavailable ─► RunnerReadModel.unavailable；禁止隐式 refresh
  │
  ▼
RunnerReadModel（纯组合，不持久化第二 truth）
```

关键设计点：

- 页面、CLI 与产品入口共享同一 Query；UI render 不调用 adapter、不触发 repair。
- 某 section 可用不证明其他 section current，顶层不得压成单一 success/status。
- 详细设计展开并行读、snapshot token 与 presenter mapping，不锁桌面壳技术。

#### RefreshVisibleSourcesJob 处理流

```text
RefreshVisibleSourcesJob(VisibleSourceRefreshScope scope)
  │
  ▼
Explicit foreground/scheduled Operations Trigger
  - 与 query/render 分离；建立本地 refresh generation
  │
  ▼
VisibleSourceRefreshService（事务外只读）
  - 经 formal read ports 读取允许来源
  - 对每个结果保留 source version/freshness/visibility
  │
  ▼
Local transaction
  ├─ generation/current basis 匹配 ─► 更新对应 safe projections
  ├─ partial/restricted ─► 更新限制姿态，不用旧值补 current
  └─ conflict/gap ─► 标 stale；创建/关联 RecoveryCase
  │
  ▼
RefreshResult（per-source；不修改 owner truth）
```

关键设计点：

- Refresh 是显式 Operations，用于维护可读 projection；不能藏在 Query 或页面 lifecycle 中。
- 多 source 部分失败必须逐来源表达，不能以整体 HTTP 200 覆盖缺口。
- 详细设计展开 refresh generation、source fan-out 和 backpressure，不写固定频率。

本部分停审：组合查询和 refresh job 明确分离；所有入口只经过共同 facade/service；未绑定 Tauri、Electron、Web 或 CLI-only。`pass`。

## 6. 接口—对象—流程对应关系

| 处理流族 | 接口 | 主要对象 | 跨部分接缝 |
|---|---|---|---|
| context/selection | `SelectRelease`、`InvalidateSelection`、release queries/consumer | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection` | authority 变化使材料/intent 失效。 |
| acquisition/qualification | acquire/control/job/eviction | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture`、`ProtectionGuard` | selection binding、resource protection。 |
| run/control/lifecycle | `RequestRun`、`RequestRunControl`、run query/consumers | `RunIntent`、`ControlIntent`、`OwnerRunProjection` | qualified material、Sandbox/Runtime refs、recovery。 |
| resource/cleanup/recovery | cleanup/manual review/resource query/reconcile | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | 所有 unknown 路径、cache/diagnosis 保护。 |
| preview/diagnosis/handoff | handoff、preview/diagnosis queries、consumer/job | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture`、`RecoveryCase` | owner safe source、redaction、retention protection。 |
| entry/presentation | read model query/source refresh | `RunnerReadModel`、`ConnectivityView` + 全部 section source | 只组合，不创造跨部分 truth。 |

没有接口引用 Step 6 之外的新领域对象；图中的 request/input/result、port query 和 refresh scope 均为接口/传递类型骨架，完整字段留 03。

## 7. 未单独展开的接口与取舍

| 接口 | 原因 | 适用骨架 |
|---|---|---|
| `ResolveRunnerContext` | 单一 owner-safe context 读取，无 fallback 写入 | Query 通用只读路径。 |
| `GetSelectionPosture` | 只读 local selection + authority snapshot | Query 通用只读路径。 |
| `GetMaterialPreparation` | 只读取得/验证/资格独立轴 | Query 通用只读路径。 |
| `GetCacheProtection` | 只读 cache + guard，不执行淘汰 | Query 通用只读路径。 |
| `GetRecoveryCase` | 只读恢复姿态，不启动 reconcile | Query 通用只读路径。 |
| `GetHandoffPosture` | 只读 local posture + owner receipt ref | Query 通用只读路径。 |

这些接口并非遗漏；它们不得因未来页面需要而在 Query 内加入 refresh、probe、cleanup 或 owner 写入。

## 8. 事务、副作用与 unknown 出口审计

| 路径 | 本地事务内 | 事务外 | ambiguous/unknown 出口 | 禁止事项 |
|---|---|---|---|---|
| selection | generation/selection/失效标记 | context/authority read | blocked/stale；必要时 recovery | 不生成 approval。 |
| acquisition | task/cache/integrity short commits | locator/transfer/verifier | blocked/stale/quarantine | 不以 complete 推 verified。 |
| run/control | intent、metadata、receipt refs | Sandbox formal request/control | unknown + `RecoveryCase` | 不自动 replay，不以 ACK 推 running。 |
| cleanup | guard/cleanup intent/result ref | owner protection read + cleanup request | protected/unknown + recovery | 不直接标 released/删除。 |
| handoff | posture/receipt refs | redaction + formal handoff | unknown + recovery | 不生成 evidence/verdict。 |
| consumer | dedup/projection/gap posture | broker/SDK delivery | stale + reconcile | 当前 blocked，不自造 event。 |
| refresh/reconcile | safe projection/current basis | formal read ports | partial/stale/manual-review | 不修复 owner truth。 |
| query | 无写入 | 允许只读 repository/projection | partial/restricted/unavailable | 不触发副作用。 |

## 9. 跨处理流一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Step 7 接口覆盖 | pass | 所有 Command/Query/Consumer/Job 均有独立图或明确通用口径。 |
| Step 6 对象引用 | pass | 所有领域动作均落到已定义对象；无临场万能 `RunnerRun`。 |
| 组成部分归属 | pass | 每条流有唯一主要归属；跨部分只经已定义 binding/ref/guard 接缝。 |
| 参数类型 | pass | 图中所有点名函数调用均使用 `TypeName param_name`。 |
| 事务粒度 | pass | 本地事务不包网络、下载、owner 调用或长验证；结果以新事务应用。 |
| unknown/reconcile | pass | 影响副作用的 ambiguous 结果全部冻结并进入 RecoveryCase，无自动 replay。 |
| Query no-write | pass | query/render 不 refresh、probe、repair 或持久化。 |
| Consumer readiness | pass with blockers | 四类 Consumer 明确 planned/blocked；未来路径不构成可用声明。 |
| Owner truth | pass | Release/approval/execution/lease/cleanup/evidence 等均未转为 Runner truth。 |
| 证据边界 | pass | local logs、diagnosis、receipt、job success 均未作为审计证据或 signoff。 |
| 详细设计承接 | pass | 函数签名、事务机制、crash window、DTO/error/test matrix 均留 03。 |

## 10. 历史材料污染扫描

| 历史候选 | 扫描结论 |
|---|---|
| README 的 Tauri/Rust/Docker 直连路径 | 未进入处理流；所有技术承载仍由 port/adapter 隔离并待 03 重新核验。 |
| 旧 02 的 queue/retry/replay/kill | 未继承；unknown 统一 query/reconcile，禁止任意 replay 或私有 kill。 |
| draft 的页面/模块顺序 | 未作为处理流来源；GUI/CLI/product 共用 use case。 |
| HTTP 200/PID/端口/本地日志成功语义 | 均被限制为 receipt/local observation/non-authoritative diagnostic。 |
| `latest` 与旧 cache fallback | 明确禁止成为可选版本或 authority。 |

## 11. 回填草稿

正式 §8 应保留：四类通用处理骨架；处理流覆盖表；按六个组成部分组织的 P0 Command、planned Consumer、一致性 Job 和复杂 Query 图；未展开接口理由；事务/unknown 审计。为控制正文篇幅，可以合并重复关键设计点，但不得删除 transaction/side-effect 分离、`accepted != running`、guard、no-write、planned/blocked 和 evidence 边界。

## 12. 待确认事项

- Owner exact request/query/event/receipt 方法、schema、error、idempotency 与 source version 仍由 `RUN-UP-001~008` 阻塞；图中 port/method 名是 Runner required semantic skeleton，不证明真实 API 存在。
- 本地 repository、operation record、execution claim、dedup、refresh generation 和 crash-window 算法留 03；不由旧实现或 README 自动继承。
- 取得、验证、redaction、平台 probe 与材料删除的具体 provider/线程/进程边界仍未选择。
- 当前无 Runner outbound event flow；如出现正式消费者需求，须回退 Step 7/8 重新校准。

## 13. 进入下一步条件

- [x] 六个主要组成部分的接口均有处理流口径并分别停审。
- [x] P0 Command、变更型 planned Consumer、一致性 Job 和复杂 Query 均有独立 `text` 处理流图。
- [x] 图中点名的函数参数均带类型，未写完整签名、伪代码、SQL、协议字段或 retry 数值。
- [x] 本地事务、事务外副作用、expected basis、unknown/reconcile 出口明确。
- [x] 接口→对象→流程、跨部分接缝和未展开理由一致，无 unresolved 冲突。
- [x] 未宣称 owner adapter/event 可用，未伪造运行、测试、证据或 readiness。

结论：`gate_status=pass`，允许进入 Step 9“状态机与状态流转”。
