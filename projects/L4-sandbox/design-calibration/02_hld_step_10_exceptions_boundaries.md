# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 在 Step 8 关键处理流和 Step 9 状态机已收稳的前提下,点名那些会改变 sandbox 主线理解、状态推进、跨部分协作关系或相邻仓边界解释的关键异常与边界场景。本步允许说明异常落在哪个主要组成部分、application service、对象或边界,以及它会把哪些状态推到 rejected / pending / failed / blocked / degraded;不写完整错误码、重试参数、补偿脚本、恢复流程、运维步骤、topic / dead-letter payload 或测试结果。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 10 | 是。Step 9 审查点后用户已明确回复“同意”“继续”。 |
| 项目级台账是否允许进入 Step 10 | 是。`project_execution_ledger.md` 已将恢复点停在 `02-概要设计.md` Step 9,用户确认后允许进入 Step 10。 |
| 文档级 flow 是否允许进入 Step 10 | 是。`02_hld_calibration_flow.md` 已记录 Step 9 `pass_wait_review`,进入 Step 10 的门禁已满足。 |
| 是否已读取 Step 8 / Step 9 | 是。Step 8 提供异常触发处理流和 no-write / no-repair 边界;Step 9 提供异常会推动到的状态集合和禁止迁移。 |
| 是否已读取概要 SOP Step 10 和书写规范 §4.10 | 是。必须输出异常与边界场景表,仅在异常会改变主流程 / 状态传播 / 跨部分协作关系时补异常影响图。 |
| 是否发现阻塞 Step 10 的上游 blocker | 否。policy 来源矩阵、handoff ack 协议、failure taxonomy 细化、security profile、storage / retention 和 SLO 细节仍待后续阶段闭合,但不阻塞概要层先点名关键异常路径。 |

---

## 2. 本步目标

本步要把那些不能留到 `03-详细设计.md` 才发现的异常路径、边界场景和非 happy path 红线先在概要层讲清。

本步要回答:

- 哪些异常会直接打断 intake、boundary、policy、run、capture、handoff、cleanup 或 redline 主线。
- 哪些边界场景会改变 Command / Consumer / Job 的职责分工。
- 哪些失败只能推动 marker、report、degraded surface,不能反写核心 truth。
- 哪些失败会触发 cleanup guard、orphan recovery 或 redline containment。
- 哪些异常仍然只属于详细设计里的错误码、重试、补偿、恢复和人工处置细节。

本步不展开:

- 完整错误码全集。
- retry / backoff / dead-letter 参数。
- adapter outcome enum 全集。
- 恢复脚本、补偿脚本和运维步骤。
- 分页、队列、topic、event payload、DB schema、object store layout。
- 测试用例、验收签署和实施 boundary。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 Command / Query / Consumer / Job 主路径,以及 fail-closed、cleanup、redline、degraded surface 和 forbidden body 约束。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供异常会推动到的状态主题、允许 / 禁止迁移和传播关系。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供异常落在哪类接口、哪个主要组成部分和哪类 port / job。 |
| `02_hld_step_06_key_objects*.md` | 已完成 | 提供异常会落到的对象、guard、handle、view 和 relay 主语。 |
| `projects/L4-sandbox/00-需求文档.md` §7 / §9 / §11 / §13 / §14 / §16 | 当前正式需求基线 | 提供 C-SBX-1~5、BR / AC / VF 和一票否决线。 |
| `projects/L4-sandbox/01-架构设计.md` §4 / §6 / §8 / §9 / §10 / §15 / §16 | 当前正式架构基线 | 提供核心 / 支撑上下文、fail-closed、capture / handoff 分层、cleanup guard、redline containment 和依赖裁剪边界。 |
| L1 artifact / governance Step 10 样例 | 已读取 | 参考“场景表 + 影响图 + 停审 / 审计”的粒度。 |
| 旧 `README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于审计旧“普通命令执行器”“cleanup 脚本”“replay 恢复主线”污染风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取恢复点、Step 8 / 9、标准和 L1 样例。 | done | 确认只写关键异常,不改正式 `02`。 |
| 2 | 从处理流、状态机、BR / VF 中提炼会改写主线理解的异常场景。 | done | 形成按主要组成部分归属的异常候选池。 |
| 3 | 回答 Step 10 SOP 问题。 | done | 明确异常落点、概要层深度和后移边界。 |
| 4 | 输出异常与边界场景表。 | done | 每条场景都说明应落在哪个部分处理和当前概要口径。 |
| 5 | 输出异常影响图、状态机影响清单、停审记录和一致性审计。 | done | 保障 Step 11 / `03` 不会重新发明异常主线。 |
| 6 | 更新 flow 和项目级台账,并停在用户审查点。 | done | Step 10 完成后已进入 wait review,不跨到 Step 11。 |

---

## 5. SOP 问题回答

### 5.1 哪些关键异常路径必须在概要设计层先点名?

必须先点名的异常路径包括:

- `OpenControlledExecutionContext` 输入缺失 actor / responsibility / trace / idempotency,或调用方试图用旁路 / 宿主直跑补造正式语境。
- caller / identity / work / policy refs unresolved、stale、invalid、unavailable,以及外部正文越界进入 intake 或长期 reference tracking。
- `EstablishExecutionBoundary` 遇到 capability stale / unknown / unsupported,或任一 resource / filesystem / network / process 限制不可落实、不可验证、试图 silent degrade。
- `EvaluatePolicyExecution` 遇到 policy summary missing / conflicted / stale / unsupported,高风险动作未授权、后端不支持或 launch 前策略变化。
- `StartControlledExecutionRun` 遇到 boundary 已成立但 handle lifecycle 丢失、run 启动前 boundary / policy 被重判、运行中 backend lifecycle signal 失真。
- `RecordCaptureResult` 遇到 partial / failed / unavailable capture,以及 capture failure 被 handoff / observability 成功掩盖。
- `OpenMaterialHandoff` / `RetryPendingMaterialHandoffs` 遇到下游 pending / failed / retryable / no-receipt,以及 cleanup 先删材料。
- `SubmitSandboxControl` / `ClassifySandboxFailure` 遇到 duplicate / conflicted control、late failure classification、terminal failure 被静默回滚。
- `RunLeaseOrphanReaper` / `EvaluateCleanupReadiness` 遇到 lease expiry、orphan suspected、cleanup evidence 未交接、investigation summary 未放行。
- `RecordRedlineContainment` / `MaintainRedlineContainmentHandoffs` 遇到 redline during run / capture / cleanup,以及 containment 试图 advisory-only。
- `GetSandboxReadProjection` / `GetDerivedInspectPreviewTrend` / `GetSandboxReconciliationReport` 遇到 stale / rebuilding / unavailable / issues-found,以及 query 试图自修复。
- `PublishSandboxEventRelay` / `ConsumeSandboxTruthRelayFeedback` 遇到 relay failed / retryable / dead-letter,以及失败试图回滚 source fact。

### 5.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系?

会改写协作关系的边界场景包括:

- intake 未闭口时,Command 不得继续 boundary / policy / run 主线,只能停在 `PendingResolution`、`Unresolved` 或 `Rejected`。
- boundary 未正式建立时,policy 和 run 都不得自行判定 resource / fs / network / process 限制已生效。
- policy 或 high-risk judgment 未闭口时,run 不得启动;launch 前策略变化只允许把 decision 从 `Accepted` 重判到 `Blocked` / `FailClosed`,不能在后台静默继续。
- capture 与 handoff 必须分层: capture failure 不能靠 handoff 成功掩盖,handoff failure 也不能回滚 capture truth。
- cleanup 与 redline 必须先看 guard / investigation summary,不能直接复用 reaper 或 release path。
- Consumer 只能写 snapshot / marker / feedback / stale / lifecycle summary,不得直接创建核心 success。
- Query 只能返回 not-visible / stale / degraded / unavailable surface,不能 refresh、rebuild、repair、handoff 或解除 cleanup guard。
- Job 只能维护 relay、refresh、retry、rebuild、reconciliation 和 reaper,不能修复核心 truth 或生成第二套正式语义。

### 5.3 哪些失败不能留到详细设计才发现?

不能留到详细设计才发现的失败,都是会打穿 execution isolation truth ownership 或一票否决线的失败:

- 宿主直跑、旁路执行、匿名执行被宣称为正式 sandbox 执行。
- 必需边界 silent degrade、部分忽略或未验证即继续执行。
- policy 缺失、冲突、不支持、不可解析或高风险动作未授权仍继续执行。
- 外部正文、tool semantic、runtime recover、artifact truth、observability store、policy DSL、operator UI 正文入仓。
- candidate material / observability material 静默升格为下游 truth。
- cleanup / reaper 在证据、handoff、investigation 未安全交接前删除材料。
- orphan / redline 脱离托管收束路径继续运行。
- relay / query / derived / reconciliation 反向改写核心 truth。
- 不同调用方、不同承载或不同下游产生第二套正式 execution / policy / control 语义。

### 5.4 异常与边界场景在概要设计层需要讲到什么程度才足够?

概要层只需要讲清:

- 异常落在哪个主要组成部分、application service、对象或 guard。
- 它会在处理流哪一层断开主线。
- 它会把哪些对象或状态推到 pending / rejected / failed / blocked / degraded / terminal。
- 它不会越过哪些 truth / snapshot / ref / derived / handoff 边界。

错误码、retry、dead-letter payload、补偿脚本、恢复脚本、人工操作、并发冲突版本条件和 adapter 细节全部后移到 `03/04/05/06/07`。

### 5.5 哪些内容仍属于详细设计的错误码、重试、补偿或恢复细节,不应在本步展开?

以下内容不在本步展开:

- Command / Query / Consumer / Job 的正式错误码与 response / report schema。
- idempotency store、duplicate replay、expected version、conflict resolution 的精确结构。
- handoff ack、retryable、dead-letter、delivery receipt 和 callback 协议。
- cleanup retention window、safe deletion contract、lease schedule、reaper cadence。
- redline taxonomy 全集、release approval 流和 investigation system protocol。
- projection rebuild plan、page cursor、comparison / trend materialization 细节。

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 旧 README / 旧 `02` 的单线执行叙事 | 容易把异常压成“后端失败”一条线,遗漏 intake、policy、cleanup、redline、read-side 降级。 | 改为按 intake / boundary / policy / run / capture / cleanup / redline / read-side 分层点名异常。 |
| 旧 replay / cleanup / operator 叙事 | 容易让 runtime recover 或运维脚本吞掉 sandbox failure / control truth。 | 明确 replay-like 行为不属于 sandbox 主线,cleanup / reaper / redline 都必须由正式对象和 guard 承接。 |
| 旧 output / audit / artifact 混写 | 容易让 capture failure、handoff failure 和 observability failure 相互掩盖。 | 明确 capture、handoff、relay、observability 失败的分层边界。 |
| 旧 policy / allowlist 叙事 | 容易把策略异常写成“后端不支持时尽量继续”。 | 明确 missing / conflicted / unsupported 一律 fail-closed 或 blocked,不允许 permissive fallback。 |
| 旧 inspect / preview / comparison 强化叙事 | 容易让 read-side 异常触发隐式 repair。 | 明确 query / derived / reconciliation 只暴露 degraded / unavailable / issues-found,不修 core truth。 |

---

## 7. 异常筛选与展开原则

### 7.1 只展开会改写主线理解的异常

本步只保留以下四类异常:

1. 会阻断核心 Command 主线的异常。
2. 会改变状态机迁移方向或禁止迁移解释的异常。
3. 会改变跨部分协作关系的异常。
4. 会打穿相邻仓 truth 边界或一票否决线的异常。

以下内容不在本步列大全:

- 普通字段校验全集。
- adapter / SDK 返回码全集。
- 所有 HTTP / RPC / event envelope 异常细节。
- 纯展示层、分页层、UI 层局部错误。

### 7.2 异常落点分层

| 异常落点层 | 允许处理的东西 | 不允许处理的东西 |
|---|---|---|
| sync entry / inbound adapter | actor / metadata / idempotency / envelope 校验、forbidden body 拒绝 | domain success、policy truth、artifact truth |
| application service / domain guard | accept / reject / fail-closed / blocked / cleanup / contain 裁定 | runtime recover、operator workflow、下游 formal truth |
| consumer | snapshot / marker / stale / feedback / receipt | 核心 success、核心 truth rollback |
| operations job | relay / refresh / retry / rebuild / reconciliation / reaper | 新建核心 context、直接修核心 truth |
| query / read assembler | degraded / unavailable / not-visible surface | refresh、repair、cleanup、handoff、policy放行 |

---

## 8. 异常与边界场景表

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| actor / responsibility / trace / idempotency 缺失 | `Controlled execution intake and identity` / `Sandbox Sync Entry` / `ControlledExecutionIntakeGuard` | 不进入 `ControlledExecutionContext::Accepted`;仅返回 rejected / pending surface。 |
| 同一正式执行请求被不同调用方重复提交 | `Controlled execution intake and identity` / application idempotency support | 只能返回 duplicate / stored result 或拒绝第二套正式语义,不得形成第二个 accepted context。 |
| caller / identity / work refs unresolved、unavailable 或 conflicted | `Controlled execution intake and identity` / `ExecutionContextResolution` / `ContextReferenceResolution` | 主线停在 `PendingResolution`、`Unresolved` 或 `Rejected`,不得靠默认值补造语境。 |
| 外部正文越界进入 intake 或 reference refresh | `Controlled execution intake and identity` / `Local reference, projection and derived support` / `ExternalBodyExclusionGuard` | 只允许 refs 和 safe summary,正文拒绝或丢弃,不得入仓。 |
| boundary requirement 缺维度或 workspace / backend 摘要不全 | `Boundary establishment and enforcement` / `BoundaryRequirementSet` | 只能进入 `Required` / `PendingCapability`,不得假定边界已完整。 |
| backend capability stale / unknown / unsupported | `Boundary establishment and enforcement` / `BackendCapabilitySummary` / `BoundaryEstablishmentDecision` | 必须 `PendingCapability`、`Unsupported`、`Rejected` 或 `Failed`,不得 permissive fallback。 |
| 任一 resource / filesystem / network / process 限制不可落实 | `Boundary establishment and enforcement` / `CoherentBoundary` / `BoundaryCoherenceGuard` | `CoherentBoundary` 不得 `Established`;这是 silent degrade 红线。 |
| boundary 已建立但 handle lifecycle 丢失或与后端不一致 | `Boundary establishment and enforcement` + `Failure control and safety closure` / `IsolationEnvironmentHandle` / `LeaseRecord` | 进入 `Failed`、`OrphanSuspected` 或 reaper 路径,不得继续假装 run 可用。 |
| policy summary missing / conflicted / stale / unsupported | `Policy execution decision` / `PolicyApplicabilitySnapshot` / `FailClosedPolicyGuard` | 进入 `Pending`、`Rejected` 或 `FailClosed`,不得继续 launch。 |
| 高风险动作未授权、越界或后端不支持 | `Policy execution decision` / `HighRiskActionDecision` | 进入 `Blocked` 或 `Unsupported`,不得靠普通 accepted policy 绕过。 |
| launch 前 policy 变化导致已 accepted decision 失效 | `Policy execution decision` / `EvaluatePolicyExecution` | 只允许在 run 启动前把 decision 重判为 `Blocked` / `FailClosed`;不得后台继续执行。 |
| 尝试在 boundary 未 established、handle 非 active、policy 非 accepted 时启动 run | `Execution capture and material handoff` / `StartControlledExecutionRun` | 不得创建 `Running`;只能失败、拒绝或保持 preparing / blocked。 |
| 运行中 backend lifecycle signal 指向环境消失、超限或非托管 | `Execution capture and material handoff` + `Failure control and safety closure` / `ControlledExecutionRun` / `FailureClassification` | 进入 `Failed` 或 `Terminated`,并触发 failure classification / orphan / cleanup 路径。 |
| capture partial / failed / unavailable | `Execution capture and material handoff` / `CaptureFact` / `CaptureCompletenessGuard` | 必须显式落在 `Partial` / `Failed` / `Unavailable`,不能被 query 或 handoff success 抹平。 |
| candidate material 或 observability material 试图静默升格为下游 truth | `Execution capture and material handoff` / `CapturedMaterialRef` / `ObservabilityMaterial` / `HandoffOwnershipGuard` | 只能停留在 captured / handoff 状态,formal truth 仍由下游拥有。 |
| handoff pending / failed / retryable / 无 receipt | `Execution capture and material handoff` / `HandoffFact` / retry job | 进入 `Pending`、`Failed`、`Retryable`,不得回滚 capture truth。 |
| cleanup 在 handoff、capture audit 或 investigation 未放行前被请求 | `Failure control and safety closure` / `CleanupGuard` / `CleanupSafetyGuard` | 进入 `PendingEvidence`、`PendingInvestigation` 或 `Blocked`;不得先删材料。 |
| duplicate / conflicting control signal | `Failure control and safety closure` / `ControlFact` / `ControlConflictGuard` | 只能显式进入 `IgnoredDuplicate` 或 `Conflicted`,不得最后写入覆盖前序 control。 |
| lease expiring / expired 且 handoff / cleanup 仍未收束 | `Failure control and safety closure` / `LeaseRecord` / `CleanupGuard` | 只能进入 expiring / expired + blocked cleanup 路径,不得直接 release。 |
| orphan suspected 但 cleanup 仍 blocked | `Failure control and safety closure` / `OrphanRecoveryRecord` / `CleanupGuard` | reaper 只能保守回收,不能绕过 evidence / investigation guard。 |
| redline 在 run、capture、cleanup 或 reaper 中途被检测到 | `Failure control and safety closure` / `RedlineContainment` / `RedlineContainmentGuard` | 必须至少 `Detected -> Contained`,并阻断 cleanup / release 直到 handoff / terminal。 |
| investigation handoff 状态不可确认 | `Failure control and safety closure` / `CleanupGuard` / `RedlineContainment` | cleanup 和 containment release 都只能 pending / blocked,不能假定已放行。 |
| read projection stale / degraded / unavailable | `Local reference, projection and derived support` / `SandboxReadProjection` / query assembler | Query 只能显式返回 stale / degraded / unavailable,不得顺手 rebuild。 |
| derived inspect / preview / trend / comparison 失败或来源不可用 | `Local reference, projection and derived support` / `DerivedInspectPreviewTrendState` / `DerivedReadOnlyGuard` | 只影响读侧与辅助解释能力,不反写 core truth。 |
| relay publish failed / retryable / dead-letter | `Execution capture and material handoff` + `Local reference, projection and derived support` / `SandboxEventRelayRecord` | 只能影响 relay status、projection stale 或 reconciliation finding,不回滚 source fact。 |
| relay feedback 或 consumer source 乱序 / duplicate / unsupported version | `Local reference, projection and derived support` / consumer receipt + marker | 只能形成 duplicate / delayed / stale / failed / finding marker,不得创建核心 success。 |
| reconciliation issues-found / degraded / failed | `Local reference, projection and derived support` / `SandboxReconciliationReport` | 只产出 report / finding / degraded surface,修复必须回到正式 flow。 |
| inspect / replay / operator control 等外围增强不可用 | `Local reference, projection and derived support` / 外围 read / maintenance | 不能阻断核心 capture / cleanup 闭环,也不能变成第二套控制语义。 |

---

## 9. 异常影响图

```text
+====================================================================+
|                 Sandbox Exception Boundary Map                    |
+====================================================================+
| Request                                                            |
|   | missing actor / refs / idempotency / forbidden body            |
|   v                                                                |
| Intake reject / pending / unresolved                               |
|   | no accepted context, no downstream core write                  |
|   v                                                                |
| Boundary establish                                                 |
|   | stale capability / unsupported / silent degrade attempt        |
|   v                                                                |
| Rejected / pending-capability / failed boundary                    |
|   | no launch                                                      |
|   v                                                                |
| Policy evaluate                                                    |
|   | missing / conflicted / unsupported / high-risk unauthorized    |
|   v                                                                |
| Rejected / blocked / fail-closed                                   |
|   | no launch                                                      |
|   v                                                                |
| Run start / running                                                |
|   | backend loss / timeout / control / redline                     |
|   v                                                                |
| Failure classification / control fact / containment                |
|   |                                                                |
|   +--> Capture partial / failed / unavailable                      |
|   |         |                                                      |
|   |         +--> Handoff pending / failed / retryable              |
|   |                   |                                            |
|   |                   +--> CleanupGuard blocked / pending          |
|   |                                                                |
|   +--> Lease expiry / orphan suspected -> Reaper                   |
|   |                                |                               |
|   |                                +--> must respect CleanupGuard   |
|   |                                                                |
|   +--> Redline detected -> Contained -> Investigation handoff      |
|                                                                    |
| Read / relay / derived side                                        |
|   query stale / degraded / unavailable                             |
|   relay failed / dead-letter                                       |
|   reconciliation issues-found                                      |
|   => markers / reports / degraded surfaces only                    |
+====================================================================+
```

关键说明:

- 该图只表达异常如何改变主线轮廓和落点,不表达错误码、重试参数、补偿脚本或运维步骤。
- intake、boundary、policy 三层异常都属于“run 前阻断”,不能被后续 job 或 query 补成 success。
- run 后异常会分叉到 failure / control、capture / handoff、cleanup / reaper 和 redline containment,但这些分叉仍共享同一 execution isolation truth。
- read / relay / derived side 异常只允许形成 marker、report 和 degraded surface,不能修 core truth。

---

## 10. 状态机影响清单

| 异常类别 | 可能进入的状态 | 禁止进入的状态 |
|---|---|---|
| intake 输入缺失 / refs unresolved | `PendingResolution`;`Unresolved`;`Rejected` | `Accepted` |
| capability stale / unsupported / limit not enforceable | `PendingCapability`;`Unsupported`;`Rejected`;`Failed` | `Established` |
| policy missing / conflicted / high-risk unauthorized | `Pending`;`Rejected`;`Blocked`;`FailClosed` | `Accepted` without new summary |
| backend lifecycle 丢失 / orphan suspected | `Failed`;`OrphanSuspected`;`ReleasePending` | `Running` / `Active` as if nothing happened |
| capture partial / unavailable | `Partial`;`Failed`;`Unavailable` | `Complete` by handoff or observability shortcut |
| handoff failure / no receipt | `Pending`;`Failed`;`Retryable`;`BlockedByCleanupGuard` | source truth rollback |
| duplicate / conflicting control | `IgnoredDuplicate`;`Conflicted`;`Completed`;`Failed` | 第二套 terminal control 语义 |
| cleanup 未放行 | `PendingEvidence`;`PendingInvestigation`;`Blocked` | `Completed` / `Released` |
| redline detected | `Detected`;`Contained`;`HandoffPending`;`Terminal` | `Released` directly from detected |
| query / projection / derived failure | `Stale`;`Degraded`;`Unavailable`;`Failed`;`IssuesFound` | core truth mutation |
| relay dead-letter | `Failed`;`Retryable`;`DeadLetter` | `Published` by local assumption |

---

## 11. 按处理流族归类的异常口径

### 11.1 Command 写路径异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| 入口参数缺失、idempotency 缺失或 caller 身份不闭口 | 无核心 truth 变化 | 在 inbound / application 层拒绝,不进入 domain transition。 |
| expected current state 不满足 | 对象保持原状态或进入 rejected / blocked surface | 详细设计定义并发冲突和错误码;概要层只要求不得跨状态捷径。 |
| policy / boundary 前置不成立 | `Rejected` / `Blocked` / `FailClosed` / `PendingCapability` | run 不得启动。 |
| cleanup / redline 条件不满足 | `Blocked`;`PendingEvidence`;`PendingInvestigation`;`Contained` | release / cleanup / terminal 必须等 guard 或 investigation 明确推进。 |
| 同一成立边界中的 truth / audit / relay marker 写入失败 | 不形成 accepted truth | 详细设计闭口事务;概要层要求失败不能伪装为 success。 |

### 11.2 Query 只读异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| not-visible / restricted | 无持久状态变化 | 返回 not-visible / restricted surface,不泄露正文或存在性细节 beyond policy。 |
| projection stale / degraded / unavailable | 无持久状态变化 | 返回 freshness / degraded / unavailable,不 rebuild。 |
| derived failed / unavailable | 无持久状态变化 | 返回 failed / unavailable 只读面,不 refresh / repair。 |
| reconciliation issues-found | 无持久状态变化 | 返回 finding / degraded surface,不自动修复。 |
| audit / trace 缺口 | 无持久状态变化 | 显式暴露 trace gap,不补造 trace。 |

### 11.3 Consumer 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| duplicate source event | receipt only | 不重复写 snapshot、marker 或 feedback。 |
| unsupported schema version | delayed / rejected / failed marker | 不猜 payload,不写核心 truth。 |
| source body 越界 | 无核心 truth 状态变化 | 只提取 ref / summary,正文丢弃或拒绝。 |
| out-of-order / older source | `Stale`;ignored / delayed marker | 不倒退本地 truth 或 visible state。 |
| source unavailable | `Unavailable`;`Unresolved`;stale marker | 只推动 pending / degraded 语义。 |

### 11.4 Operations Job 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| refresh capability / refs failed | `Stale`;`Unknown`;`Unavailable`;`PendingCapability` | 只能影响后续判断和读侧降级。 |
| handoff retry failed | `Retryable`;`Failed`;`BlockedByCleanupGuard` | 不回滚 capture truth。 |
| reaper blocked by evidence / investigation | `Blocked`;`PendingEvidence`;`PendingInvestigation` | 不得先删环境或材料。 |
| derived rebuild failed | `Failed`;`Unavailable`;`Degraded` | 只影响派生只读面。 |
| relay publish dead-letter | `DeadLetter`;`IssuesFound` | 只影响传播和对账。 |

---

## 12. 逐组成部分停审记录

| 组成部分 | 停审检查点 | 结论 | 备注 |
|---|---|---|---|
| `Controlled execution intake and identity` | 已点名拒绝、未闭口、外部正文越界和 duplicate 入口 | pass | 正式入口不可绕过。 |
| `Boundary establishment and enforcement` | 已点名 capability stale / unsupported、silent degrade、handle lifecycle 丢失 | pass | boundary 红线保留。 |
| `Policy execution decision` | 已点名 missing / conflicted / unsupported / unauthorized / pre-launch rejudge | pass | fail-closed 未被弱化。 |
| `Execution capture and material handoff` | 已点名 partial capture、handoff failure、ownership promotion 风险 | pass | capture / handoff 分层清晰。 |
| `Failure control and safety closure` | 已点名 duplicate control、blocked cleanup、orphan、redline | pass | 非 happy path 仍是一等主线。 |
| `Local reference, projection and derived support` | 已点名 query degraded、relay failure、reconciliation finding、derived unavailable | pass | read-side 不反写核心。 |

---

## 13. 跨异常一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在把所有异常都归到 backend failure 的偷懒叙事 | pass | 已区分 intake、boundary、policy、run、capture、cleanup、redline、read-side。 |
| 是否把 query / derived / relay 失败误当成 core truth 失败 | pass | 它们只形成 degraded / failed / issue marker。 |
| 是否允许 cleanup / reaper 先删证据 | pass | `CleanupGuard` 和 `RedlineContainment` 仍然阻断 release。 |
| 是否允许 handoff / relay failure 回滚已提交 truth | pass | handoff / relay 只影响传播和 view,不回滚 source fact。 |
| 是否把 policy 变化和高风险动作异常简化为同一个 reject | pass | 已区分 `Rejected`、`Blocked`、`FailClosed`。 |
| 是否出现第二套正式 execution / policy / control 语义 | pass | duplicate request、duplicate control、cross-caller semantic drift 都被显式禁止。 |
| 是否让外部正文因 debug / inspect / replay 便利重新入仓 | pass | forbidden body 仍是硬边界。 |
| 是否把 redline 降成 advisory-only | pass | `Detected -> Contained / Terminal` 是强制路径。 |

---

## 14. Step 11 承接与反查清单

| Step 11 要展开的配置主题 | Step 10 已稳定的异常基础 | Step 11 需要补什么 |
|---|---|---|
| policy / high-risk boundary config | missing / conflicted / unauthorized / unsupported 场景已固定 | 哪些配置只能影响摘要接缝、不能影响 fail-closed 语义。 |
| capability / profile / backend selection config | stale / unsupported / silent degrade 红线已固定 | 哪些配置只影响 probe / adapter / profile 选择,不能绕过 coherent boundary。 |
| material retention / cleanup config | blocked cleanup、retention blocked、handoff pending 已固定 | 哪些配置只能影响窗口和策略,不能让 cleanup 先删证据。 |
| relay / retry / dead-letter config | relay failed / retryable / dead-letter 已固定 | 哪些配置能调节传播行为,哪些不能改变 source truth。 |
| derived / projection rebuild config | degraded / unavailable / issues-found 已固定 | 哪些配置只影响 rebuild cadence / scope,不能让 query 自修复。 |
| reaper / orphan / redline config | orphan suspected、containment blocked 已固定 | 哪些配置能影响巡检节奏,哪些不能弱化 redline / cleanup guard。 |

---

## 15. 回填 `02-概要设计.md` §10 草稿

正式 `02-概要设计.md` 在 Step 14 才能重建。当前可回填的 §10 草稿骨架如下:

1. 先写一段总述:
   `L4-sandbox` 的异常不是单独的错误码清单,而是会改变 intake、boundary、policy、run、capture、cleanup、redline 和 read-side 协作关系的结构性场景。
2. 再放异常与边界场景表:
   至少摘录 intake 未闭口、boundary silent degrade、policy fail-closed、capture partial / failed、handoff blocked、cleanup blocked、orphan suspected、redline detected、projection degraded、relay dead-letter、reconciliation issues-found。
3. 如果正式文档需要图:
   只放一张高层异常影响图,说明 run 前阻断、run 后收束、cleanup / redline 互锁和 read-side 降级。
4. 明确当前不展开的内容:
   错误码、retry、补偿、恢复、dead-letter payload、运维步骤和测试全部后移。

---

## 16. 自检

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否只点名关键异常与边界场景 | 是 | 未写错误码大全和补偿实现。 |
| 是否每条场景都说明了落点 | 是 | 场景表第二列均为主要组成部分 / service / object / boundary。 |
| 是否说明了异常对处理流或状态机的影响 | 是 | 场景表和状态机影响清单都已覆盖。 |
| 是否仅在需要时补图 | 是 | 异常确实会改变主流程、状态传播和跨部分协作,因此补了一张高层图。 |
| 是否把设计风险和待确认项全塞进本章 | 否 | 只保留会改变主线理解的异常,其余细节后移。 |
| 是否改动正式 `projects/L4-sandbox/02-概要设计.md` | 否 | 正式文档仍待 Step 14 重建。 |

---

## 17. 当前结论

`02-概要设计.md` Step 10 `异常与边界场景轮廓` 已完成当前中间产物收敛,并已同步更新 `02_hld_calibration_flow.md` 与 `project_execution_ledger.md`。

当前 next allowed action:

1. 停在用户审查点,等待用户审查 `02_hld_step_10_exceptions_boundaries.md`。
2. 只有在用户再次明确确认后,才允许进入 Step 11 `配置影响轮廓`。
