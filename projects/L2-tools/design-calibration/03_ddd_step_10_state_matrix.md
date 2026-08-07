# L2-tools 03 详细设计 Step 10: 状态主语与转换矩阵

> 创建日期: 2026-08-05
> 状态: completed / pass
> 模式: full-restart / single-agent-serial
> 正式文档: `projects/L2-tools/03-详细设计.md`（Step 19 前保持 write-closed）
> 回填章节: 正式 03 §9 状态机与转换矩阵

## 0. 开工确认与输入

| 项目 | 结论 |
|---|---|
| 前序门禁 | Step 9 R-9 `completed / pass`；37 条 flow 均有明确状态读取/写入位置。 |
| 直接输入 | Step 6 object cards/六个 module annex、Step 7 callable seams、Step 8 protocol cards、Step 9 five flow annexes。 |
| 对标 | `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md` 的逐状态机停审粒度。 |
| 非法转换占位 | `DomainError::InvalidStateTransition`；HTTP/RPC/event/job 精确映射在 Step 12 收口。 |
| 外部 blocker | `L2T-UP-001~009` 继续开放；正向 provider/route/receipt/observation/client 不在本 Step 假定已就绪。 |
| 本步禁止 | 新增 `GlobalState`、agent/runtime 状态、LLM planning、registry、Sandbox isolation truth、Bus/Observation store 或 SDK 状态。 |

## 1. SOP 问题回答

Step 10 只把“有独立生命周期、被 Step 9 读取/推进/暴露或回放”的主语纳入矩阵。不可变 assessment/classification 仍列出完整 enum 与构造快照，但禁止把后续 source clue 解释为原地迁移。Query、projection、job report 只能读取或替换派生材料，不能改变核心 truth。

状态副作用分为两层：领域方法只改变本对象字段；application flow 在同一已命名 UoW 中保存 subject、history/assessment/gap、stale marker、stored result 或 receipt。任何外部 side effect 都在本地 `Prepared`/claim commit 后发生，并由 Step 9 的 phase fence 约束。

## 2. 状态主语筛选表

| 候选主语 | 来源 | 是否进入 Step 10 | 原因 | 状态族 |
|---|---|---:|---|---|
| `ToolContract.lifecycle_state` | Step 6 `ToolContractLifecycleState` | 是 | 拥有正式生命周期，CF-01/03/04 推进。 | business truth |
| `FormalToolDefinition.revision_state` | Step 6 `DefinitionRevisionState` | 是 | revision current/superseded/withdrawn 影响新消费。 | business truth |
| `ToolCompatibilityImpact.impact_class` | Step 6 enum | 是（快照） | 是一次不可变判断，不是可回写生命周期。 | business truth assessment |
| `DefinitionSourceRef.resolution_state` | Step 6 `ExternalReferenceState` | 是（快照） | 消费时点来源判断；新观察产生新 ref/assessment。 | source/reference |
| `CapabilityBinding.lifecycle_state` | Step 6 `BindingLifecycleState` | 是 | relation replacement/invalidation 有独立生命周期。 | business truth |
| `CapabilityBindingAssessment.assessment_state` | Step 6 `BindingAssessmentState` | 是（快照） | 每次消费形成新 assessment，不修改 relation。 | source/reference |
| `HubControlledSnapshot.resolution_state` | Step 6 `ExternalReferenceState` | 是（快照） | snapshot 是时点事实，不拥有 Hub 生命周期。 | source/reference |
| `InvocationContextRefs.sufficiency` | Step 6 `ContextSufficiency` | 是（快照） | Submit 时决定 admission 输入；不表示 invocation running。 | runtime/entry |
| `InvocationAdmission.state` | Step 6 `AdmissionState` | 是（不可变事实） | 真实执行前的正式决策事实。 | runtime/entry |
| `AuthorizationConsumptionAssessment.state` | Step 6 `AuthorizationConsumptionState` | 是（快照） | invocation-bound consumption 结果；不拥有 authorization truth。 | source/reference |
| `ExecutionRequirement` requirement class | Step 6 typed classification | 是（分类） | 由 definition 派生，不是 allow/deny 状态。 | business truth assessment |
| `SandboxReadinessSnapshot.mapping_state` | Step 6 `SandboxMappingState` | 是（快照） | readiness/mapping 结果，不是 Sandbox run。 | source/reference |
| `ExecutionHandoff.state` | Step 6 `HandoffState` | 是 | L2 是否允许一次 handoff attempt。 | runtime/adapter |
| `ExecutionHandoffAttempt.state` | Step 6 `HandoffAttemptState` | 是 | 本地 call fence 有一次性生命周期。 | runtime/adapter |
| `ExecutionSourceAssessment.state` | Step 6 `ExecutionSourceAssessmentState` | 是（快照） | source attribution/mapping 判断。 | source/reference |
| `ToolInvocationOutcome.outcome_class` | Step 6 `ToolOutcomeClass` | 是（终态） | invocation 唯一不可变 semantic outcome。 | business truth |
| `SafeHandoffEligibility.state` | Step 6 `SafeHandoffEligibilityState` | 是（快照） | 四项安全检查的 target-specific conjunction。 | outbox/handoff |
| `ExternalSubmissionAttempt.state` | Step 6 `ExternalSubmissionAttemptState` | 是 | 本地提交尝试与 call ambiguity 的 fence。 | outbox/handoff |
| `BusDeliveryStatusRef.status` | Step 6 `ExternalStatusState` | 是（外部 ref 快照） | 独立 delivery ref；不等于 local submitted。 | source/reference |
| `ObservationMaterialRef.status` | Step 6 `ObservationStatusState` | 是（外部 ref 快照） | 独立 observation ref；不等于 observed。 | source/reference |
| `ReferenceValidityAssessment.state` | Step 6 `ReferenceValidityState` | 是（快照） | owner/ref validity 判断。 | source/reference |
| `ConsistencyGap.state` | Step 6 `ConsistencyGapState` | 是 | gap 有正式 resolution lifecycle。 | integrity |
| `ReferenceConsistencyReport.state` | Step 6 `DerivedReportState` | 是 | report coverage/failure 生命周期。 | projection/report |
| `ToolContractSearchProjection.freshness` | Step 6 `FreshnessState` | 是 | projection maintenance 状态。 | projection/report |
| `ToolContractDiffSummary.freshness` | Step 6 `FreshnessState` | 是（快照） | 比较材料 freshness，不修改 revision。 | projection/report |
| `ToolDiagnosticSummary.freshness` | Step 6 `FreshnessState` | 是（快照） | diagnostic material freshness。 | projection/report |
| `ToolConsumerGuidanceView.freshness` | Step 6 `FreshnessState` | 是（快照） | guidance material freshness。 | projection/report |
| `SharedContractAuthorityRef.state` | Step 6 `SharedAuthorityResolutionState` | 是（快照） | compile authority resolution；当前为 candidate-only。 | source/reference |
| `TypedSubjectRef`, IDs, `PageCursor`, `CorrelationRef` | Step 6 carriers | 否 | 只有 identity/location，无独立生命周期。 | excluded |
| `CommandMetadata`, `Page<T>`, protocol request/response | Step 6/8 carriers | 否 | DTO wrapper；其 disposition 在 entry 状态机单独处理。 | excluded |
| external provider delivery/run/observation state | blocker owners | 否 | 外部 owner truth 不属于 L2。 | excluded |
| cache, SQL lock, retry counter, worker lease | implementation detail | 否 | Step 10 不把技术细节伪装成业务状态。 | excluded |

## 3. 状态族分组与批次

| 批次 | 状态族 | 状态机 / 主语 | 所属模块 | 主要触发 flow / 函数 | 停审状态 |
|---:|---|---|---|---|---|
| 10.1 | 合同演进 | `ToolContractLifecycleState`; `DefinitionRevisionState`; `ToolCompatibilityImpact`; `DefinitionSourceRef` | `domain::contract` | CF-01/02/03/04, QF-01/02, JF-02 | pass |
| 10.2 | Binding / 受控来源 | `BindingLifecycleState`; `BindingAssessmentState`; Hub snapshot/ref | `domain::binding` | CF-05/06/07, IF-01, JF-01/02 | pass |
| 10.3 | 调用受理 | `ContextSufficiency`; `AdmissionState` | `domain::invocation` | CF-08/09/11, IF-03, QF-04/05 | pass |
| 10.4 | 执行前置 / 交接 | requirement classification; auth assessment; readiness; `HandoffState`; `HandoffAttemptState` | `domain::precondition`, `domain::handoff` | CF-09/10, IF-02, QF-05 | pass |
| 10.5 | Outcome / 安全交接 | source assessment; outcome class; eligibility; submission attempt; Bus/Obs refs | `domain::outcome`, `domain::safe_handoff` | CF-11/12, IF-03/04/05, OF-01~04, QF-06, JF-04 | pass |
| 10.6 | 完整性 / 派生 | ref assessment; gap; report; projection freshness; Core authority | `domain::integrity`, `application`, `infra` | CF-13, QF-02/07~11, JF-01~03 | pass |

## 4. 通用矩阵规则

| 规则 | 实现口径 |
|---|---|
| 状态名称 | 与 Step 6 enum variant 完全一致；正式章节不使用旧 lower-case 口语名。 |
| 触发来源 | 只能是 Step 6 factory/member、Step 7 exact port/store method 或 Step 9 已编号 flow。 |
| 前置条件 | 必须可回指 DTO 字段、`Loaded<T>`、repository watermark/version、typed resolver result 或 job scope。 |
| 非法转换 | domain `DomainError::InvalidStateTransition`; application `ApplicationError::InvalidStateTransition`;详细 taxonomy 在 Step 12。 |
| 领域副作用 | 只写本对象字段；不得在 domain 调 Port、写 outbox 或读外部系统。 |
| Flow 副作用 | accepted path 按 Step 9 同事务写 history/assessment/gap/stale/stored result/receipt；query 无写。 |
| terminal | terminal 不得重开；新语义必须新 fact/new subject/replacement。 |
| phase reserved | 外部 `Delivered/Observed/RunAccepted`、provider lifecycle、DLQ/retry/cleanup 均 reserved/blocked，当前 boundary 不调用。 |

## 5. ASCII 总图

```text
[contract lifecycle] ----current definition----> [invocation anchor]
        |                                                |
        +--> [binding relation + assessment] ------------+
                                                         v
                                            [admission decision]
                                                         |
                         +-------------------------------+------------------+
                         |                                                  |
                 [no-execution outcome]                             [precondition]
                                                                                |
                                                                       [handoff eligibility]
                                                                                |
                                                               [local attempt / outcome source]
                                                                                |
                                                                      [terminal outcome + audit]
                                                                                |
                                                              [safe material / local submission]
                                                                                |
                                              [external status refs and derived gaps/projections]
```

图中箭头表示可回指的输入/影响关系，不表示一个全局状态枚举；每个方框由对应附录的独立状态机负责。

## 6. 跨状态机命名、触发与副作用审计

| 审计项 | 结论 | 证据 / 处理 |
|---|---|---|
| 状态 enum 是否与 Step 6 一致 | pass | 六个附录逐项引用 canonical object card；发现旧 lower-case 仅保留为 historical wording。 |
| `Active/Retired` 与 `Admitted/Rejected` 是否混用 | pass | Contract lifecycle 与 invocation admission 是不同 owner/时点。 |
| `Bound/ExplicitUnbound` 与 authorization allow 是否混用 | pass | Binding 只表示 relation；authorization assessment 单独 fail closed。 |
| `Eligible` 是否被解释为 Sandbox accepted | pass | Handoff eligibility 只允许一次 L2 seam call。 |
| `SubmittedLocally` 是否被解释为 delivered/observed | pass | Bus/Observation refs 独立且可 Unknown/Blocked。 |
| `Outcome` 是否可被迟到 source 覆盖 | pass | 唯一 terminal outcome；迟到材料只创建 `TerminalConflict` gap。 |
| `Stale/Rebuilding/Failed` 是否改写核心 truth | pass | 仅 projection/report/read material；Query 不 rebuild。 |
| `ConsistencyGap::Resolved` 是否可由 Job 自行宣称 | pass | 需 formal evidence ref + resolution decision + owner re-read。 |
| `Prepared`/`SubmissionOutcomeUnknown` 是否自动重复外部 call | pass | Step 9 phase fence；仅人工/正式 recovery owner 可决定。 |
| Core/Hub/Sandbox/Bus/Obs/SDK 状态是否越界 | pass | `L2T-UP-001~009` 保持 blocked；未新增 provider lifecycle。 |
| Step 9 flow 覆盖 | pass | 37 flows 的 state reads/effects 在六族附录中有回指；无新 flow。 |
| 测试回指 | pass | 每个附录末尾列出 legal/illegal、phase、replay、blocked test cuts；Step 16 将统一汇总。 |

## 7. Step 10 总停审

| Gate | 结论 |
|---|---|
| 先筛选状态主语且排除 ref/DTO/external/cache/lock/retry | pass |
| 六状态族均有独立 owner、enum、触发源和停审 | pass |
| 每个纳入状态机有合法/非法转换和副作用边界 | pass |
| 状态名、flow、error、phase、测试能够互相回指 | pass |
| 未伪造外部 positive provider、delivery、observation、run、SDK 或 evidence | pass |
| Step 11 输入 | 已闭合：每个 Store 的 subject、version、append-only fact、projection/report 和两阶段 UoW 关系均已命名。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_11_persistence_transaction_consistency
formal_03_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
