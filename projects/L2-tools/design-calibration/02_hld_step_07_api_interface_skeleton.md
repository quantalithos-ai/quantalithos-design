# L2-tools 02 概要 Step 7: API / 接口骨架

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 从 Step 5 capability 与 Step 6 的 41 个对象推导正式用例入口、事件 skeleton、Job 与 external port；不写 HTTP / RPC path、DTO / event schema、topic、错误码、adapter 或实现。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 7 API / 接口骨架 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 1~6 主控与六个对象附录 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 7；概要书写规范 §4.7 |
| 已读取正式输入 | yes: 正式 00 §12 `IB-L2T-001~019/E01~E04`;正式 01 §10 同步 / 异步 / 后台边界 |
| 已读取参考粒度 | yes: Capability Hub、Governance、Method Library Step 7 |
| 旧材料处理 | `RegisterToolDefinition`、`QueryToolPolicy`、`InvokeTool`、固定 RPC / HTTP / event 只作 historical pollution |
| 进入条件 | pass: Step 6 completed |
| next_allowed_action | 按六部分收稳接口，再做分类总表与跨接口审计。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 问题回答 / 诊断 / 取舍 | done | §2~§4 | pass |
| 接口分类与公共输入纪律 | done | §5 | pass |
| 1 工具合同与演进 | done | Command / Query / Event skeleton | pass |
| 2 Binding 与受控来源 | done | Command / Query / Consumer / Job / Event | pass |
| 3 规范调用与受理 | done | Command / Query / inbound port | pass |
| 4 执行前置与条件交接 | done | Command / Query / blocked ports | pass |
| 5 Outcome、审计与安全交接 | done | Command / Query / Consumer / Event / ports | pass |
| 6 引用完整性与受控派生 | done | Query / Job / formal gap Command | pass |
| 分类总表 / IB 追溯 / 跨接口审计 | done | §12~§18 | pass |

## 2. SOP 问题回答

1. 改写本地 truth 的 Command 包括合同建立 / 演进 / 退役、Binding 建替 / 失效、invocation / admission、执行前置 / handoff、source / outcome / audit、安全提交和 gap resolution 记录。
2. Query 只读取四类稳定 view、五类派生 / report 与外部 ref 状态；Query 不刷新、不重评、不修复。
3. 外部事实 consumer 只承接 Hub change clue、authorization change clue、Sandbox execution source、Bus delivery feedback、Observability status / material ref；consumer 不直接写核心终态，必须进入正式 application boundary。
4. Outbound Event 只传播已经提交且通过 `SafeHandoffEligibility` 的合同、Binding、outcome / audit 和 gap 安全材料；名称仅为 L2-owned event skeleton，route / schema / topic 未闭口。
5. Binding / reference 检查、搜索 / diff / diagnostic / guidance rebuild 与 external status refresh 属于 Operations Job；Job 不取得核心写权。
6. 所有业务 Command 默认需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`、`TraceContext`；系统触发也必须有 `SystemActorContext`，不允许匿名写入。
7. 所有 Query 默认需要 `ActorContext`、`QueryMetadata` 与 `ConsumerContext`；稳定 ref 查询不得借此修改 truth。
8. 所有 Inbound Consumer 默认需要 `EventEnvelope`、`SourceEventId`、`DeduplicationKey`、`ContractVersion`、`SourceAuthorityRef`、`TraceContext`；来源 / 版本 / body 不合规即拒绝或 gap。
9. 接口按六个业务组成部分归属，并回指 Step 6 对象；port / store / adapter 不升级为 domain object。
10. 需求接口 `IB-L2T-019` 是本次 governed invocation 的同步结果消费；`IB-L2T-012` 只是异步变化线索，不能替代前者。
11. 六个组成部分均能由 Command / Query / Consumer / Event / Job 的适用子集承接，无对象 capability 孤儿。

## 3. 当前材料问题诊断

| 旧 / 模糊接口 | 问题 | 当前处理 |
|---|---|---|
| `RegisterToolDefinition` | 容易由 capability / adapter input 直接制造 Tool truth。 | `EstablishToolContract` 只消费正式 definition intent / source ref。 |
| `QueryToolPolicy` | 使 L2 拥有 allow / deny。 | `EvaluateExecutionPreconditions` + blocked `AuthorizationConsumptionPort`；只形成 L2 assessment。 |
| `InvokeTool` | 把 invocation、authorization、Sandbox execution、outcome 全压成同步调用。 | `SubmitToolInvocation`、`PrepareExecutionHandoff`、异步 source consumer、`AcceptExecutionSource` 分层。 |
| Host callback / stdout ingest | Raw execution material 直接成为结果。 | Consumer 只形成 source ref / clue，正式 Command 评估并归一化。 |
| Publish audit / metrics | Audit、safe material、delivery、observation 混合。 | `PrepareSafeExternalHandoff` 与安全 event skeleton；外部状态仅 ref / feedback。 |
| Health / repair API | 派生诊断拥有核心修复权。 | Query / Job 只读；核心变化重入 owner Command。 |

## 4. 设计取舍

- 采用 use-case 粒度 Command，不把 Step 6 每个成员函数都升级为 API。
- `SubmitToolInvocation` 原子形成 canonical invocation 与 admission；拒绝 / unavailable 分支同时形成 no-execution outcome / audit，避免留半状态。
- `PrepareExecutionHandoff` 聚合 execution requirement、同步 authorization result 消费、Sandbox readiness 判断与本地 attempt；其中外部调用由 port 承接，不假设正向 contract ready。
- `AcceptExecutionSource` 是 source material 到达后的正式语义入口；Inbound Consumer 不能直接写 outcome。
- `PrepareSafeExternalHandoff` 只在 outcome / audit 成立后生成 eligibility / material / local submission attempt；外部 delivered / observed 不作为返回成功。
- Event 名称是 L2-owned semantic skeleton，不是已发布 contract；`L2T-UP-004~007` 未闭口时 route 状态为 blocked。
- 本步不画图；规范明确流程图必须放 Step 8。

## 5. 接口分类与公共输入纪律

```text
Command API
  显式改写 L2 truth；需要 actor、metadata、idempotency 与 trace

Query API
  只读 stable view / projection / report；需要 actor 与 consumer context

Inbound Event Consumer
  接收 external ref / safe summary / change clue；不得直接改写核心 truth

Outbound Event Skeleton
  传播已成立且通过安全门禁的 L2 fact material；不声明 route ready

Operations Job
  检测、报告、重建或状态摘要刷新；不得成为核心写源

External Port
  表达 compile / runtime / event / persistence seam；不等于外部协议已闭口
```

公共输入规则：

| 类别 | 公共输入骨架 | 规则 |
|---|---|---|
| Command | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TraceContext` | 重复输入返回同一语义、显式冲突或新正式变化；不得匿名写入。 |
| Query | `ActorContext`;`QueryMetadata`;`ConsumerContext` | 只读，可返回 stale / gap / unavailable；不得触发刷新或写入。 |
| Consumer | `EventEnvelope`;`SourceEventId`;`DeduplicationKey`;`ContractVersion`;`SourceAuthorityRef`;`TraceContext` | 重复 / 乱序 / 不支持版本 / forbidden body 显式拒绝、忽略或 gap。 |
| Job | `SystemActorContext`;`JobMetadata`;`JobRunKey`;`TruthWatermark` | `JobRunKey` 只是设计骨架，不是实际 run_id；不得伪造运行结果。 |

## 6. 工具合同与演进接口

| 接口 | 类别 | 输入 / 输出骨架 | 承接对象 | 读写与边界 |
|---|---|---|---|---|
| `EstablishToolContract` | Command | 输入:`FormalDefinitionIntent`;`DefinitionSourceRef`;`CapabilityBindingMode` + 公共 Command context；输出:`ToolContractView` | `ToolContract`;`FormalToolDefinition`;`ToolContractEvolutionFact` | 原子建立 identity / first revision；source 不可验证不留半合同。 |
| `AssessToolDefinitionChange` | Command | 输入:`ToolId`;`FormalDefinitionIntent`;`ConsumerReferenceSummary`；输出:`ToolCompatibilityImpact` | `ToolCompatibilityImpact` | 写入 assessment fact，不切换 current revision。 |
| `AdoptToolDefinitionRevision` | Command | 输入:`ToolId`;candidate definition;`CompatibilityImpactRef`；输出:`ToolContractView` | `ToolContract`;`FormalToolDefinition`;`ToolContractEvolutionFact` | 影响未收口 / unverifiable 时拒绝；旧 revision 保留。 |
| `RetireToolContract` | Command | 输入:`ToolId`;`ContractRetirementReason`；输出:`ToolContractView` | `ToolContract`;`ToolContractEvolutionFact` | 显式 request / complete 语义；不因 implementation 消失隐式退役。 |
| `GetToolContract` | Query | 输入:`ToolId` 或 stable ref；输出:`ToolContractView` | `ToolContractView` | 只读 T1 truth；不刷新 source。 |
| `CompareToolDefinitionRevisions` | Query | 输入:`ToolId`;base / target revision；输出:`ToolContractDiffSummary` | `ToolContractDiffSummary` | 只读派生；diff 不批准 revision。 |
| `ToolContractChanged` | Outbound Event skeleton | 产生:`SafeHandoffMaterial` with contract change fact ref；消费者:Runtime / event collaborators | `ToolContractEvolutionFact`;`SafeHandoffMaterial` | `IB-L2T-004`;event route / schema 未定，不参与合同提交。 |

停审：接口覆盖建立、评估、采用、退役、稳定读取与安全变化输出；无 implementation / provider / SDK / event schema 越界，pass。

## 7. Capability Binding 与受控来源接口

| 接口 | 类别 | 输入 / 输出骨架 | 承接对象 | 读写与边界 |
|---|---|---|---|---|
| `DeclareCapabilityBinding` | Command | 输入:`ToolId`;`CapabilityBindingMode`;适用 `HubCapabilityRef` / `HubControlledSnapshot`；输出:`CapabilityBindingView` | `CapabilityBinding`;`CapabilityBindingAssessment`;`CapabilityBindingChangeFact` | Bound / explicit-unbound 显式成立；空 ref 不等于 unbound。 |
| `ReplaceCapabilityBinding` | Command | 输入:`CapabilityBindingId`;new ref / snapshot;`BindingChangeReason`；输出:`CapabilityBindingView` | 同上 | Relation 强一致替换；不复制 Hub truth。 |
| `InvalidateCapabilityBinding` | Command | 输入:`CapabilityBindingId`;`BindingInvalidationReason`；输出:`CapabilityBindingView` | `CapabilityBinding`;`CapabilityBindingChangeFact` | 不删除历史，不回退本地 registry。 |
| `GetCapabilityBinding` | Query | 输入:`ToolId` / `CapabilityBindingId`；输出:`CapabilityBindingView` | `CapabilityBindingView` | 返回 classification / assessment / gaps；不等于 authorization。 |
| `ConsumeHubCapabilityChangeClue` | Inbound Consumer | 来源:Hub controlled seam；输入:Hub change ref / safe summary + envelope；本地结果:new assessment / gap candidate | `HubCapabilityRef`;`HubControlledSnapshot`;`CapabilityBindingAssessment` | 不直接替换 relation 或改写既有 invocation。 |
| `CheckCapabilityBindingConsistency` | Operations Job | 输入:Binding truth + Hub refs + watermark；输出:`ReferenceConsistencyReport`;gaps | `CapabilityBindingAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport` | 检测不修复 relation。 |
| `CapabilityBindingChanged` | Outbound Event skeleton | 产生:`SafeHandoffMaterial` with binding change / gap ref | `CapabilityBindingChangeFact`;`ConsistencyGap` | `IB-L2T-008`;只传播已提交安全事实，route 未定。 |

停审：接口覆盖分类、建替、失效、读取、外部变化与一致性检查；Hub owner、registry、visibility、authorization 均未迁入，pass。

## 8. 规范调用与受理接口

| 接口 | 类别 | 输入 / 输出骨架 | 承接对象 | 读写与边界 |
|---|---|---|---|---|
| `SubmitToolInvocation` | Command | 输入:`FormalInvocationIntent`;`InvocationContextRefs` + 公共 Command context；输出:`ToolInvocationView`，拒绝时含 outcome ref | `ToolInvocation`;`InvocationContractAnchor`;`InvocationAdmission`;适用 `ToolInvocationOutcome`;`ToolAuditEntry` | 原子 canonicalize + admission；raw request 不入仓；真实执行前收口。 |
| `GetToolInvocation` | Query | 输入:`ToolInvocationId`；输出:`ToolInvocationView` | `ToolInvocationView` | 只读 invocation / admission / outcome ref；不拉取 Runtime body。 |
| `InvocationCallerPort` | Inbound runtime port | 输入:正式 caller intent / context refs；输出:Command result | `ToolInvocationService` | Runtime / direct caller 适配同一语义；不固定 RPC / DTO。 |

停审：`IB-L2T-009~010` 由单一原子用例承接，避免半 invocation；Query 与 caller port 不取得 Runtime orchestration 或 raw body，pass。

## 9. 执行前置与条件交接接口

| 接口 | 类别 | 输入 / 输出骨架 | 承接对象 | 读写与边界 |
|---|---|---|---|---|
| `EvaluateExecutionPreconditions` | Command | 输入:`ToolInvocationId`;适用 `AuthorizationResultRef`;`SandboxReadinessSnapshot`；输出:`ExecutionRequirement`;`AuthorizationConsumptionAssessment`;precondition summary | `ExecutionRequirement`;`AuthorizationConsumptionAssessment` | Governed 场景同步消费本次 result；不可验证 fail closed。 |
| `PrepareExecutionHandoff` | Command | 输入:admitted invocation;precondition refs;`CanonicalExecutionSafeSummary`；输出:`ExecutionHandoff`;`ExecutionHandoffAttempt` 或 no-execution outcome ref | `ExecutionHandoff`;`ExecutionHandoffAttempt`;适用 `ToolInvocationOutcome`;`ToolAuditEntry` | Sandbox-required 不旁路；attempt 不等于 accepted / receipt / run。 |
| `GetExecutionPreconditionView` | Query | 输入:`ToolInvocationId`；输出:requirement / assessment / handoff summary | `ToolInvocationView`;`ExecutionHandoff`;`ExecutionHandoffAttempt` | 只读 L2 judgments / attempts；不返回 external decision / execution body。 |
| `AuthorizationConsumptionPort` | Blocked runtime port | 输入:invocation-bound authorization request context；输出:`AuthorizationResultRef` + safe summary | `AuthorizationResultRef` | `IB-L2T-019`;owner / source / schema 未闭口，不能声称 ready。 |
| `SandboxExecutionPort` | Logical runtime port | 输入:`ExecutionHandoff`;输出:carrier-level local response | `ExecutionHandoff`;`ExecutionHandoffAttempt` | Mapping / receipt blocked；local response 不是 Sandbox lifecycle truth。 |

停审：Requirement、authorization result consumption、Sandbox handoff 与 local attempt 分权；`L2T-UP-001~004` 未被伪闭合，pass。

## 10. Outcome、审计与安全交接接口

| 接口 | 类别 | 输入 / 输出骨架 | 承接对象 | 读写与边界 |
|---|---|---|---|---|
| `ConsumeSandboxExecutionSource` | Inbound Consumer | 来源:Sandbox logical source seam；输入:execution source ref / safe summary + envelope；本地结果:source candidate / gap | `SandboxExecutionSourceRef`;`ConsistencyGap` | Consumer 不直接写 outcome；carrier / mapping / receipt blocked。 |
| `AcceptExecutionSource` | Command | 输入:`ToolInvocationId`;`SandboxExecutionSourceRef`;`ExecutionSourceSafeSummary`;mapping assessment；输出:`OutcomeAuditView` | `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`ToolAuditEntry` | Source 受理、normalized outcome 与 audit 原子收口；mapping blocked 时不伪造终态。 |
| `PrepareSafeExternalHandoff` | Command | 输入:`ToolInvocationOutcomeId`;`ToolAuditEntryId`;target class;sensitivity context；输出:`SafeHandoffEligibility`;material;attempt | `SafeHandoffEligibility`;`SafeHandoffMaterial`;`ExternalSubmissionAttempt` | 四项合取；外部失败不回滚 outcome / audit。 |
| `GetOutcomeAudit` | Query | 输入:`ToolInvocationId` / outcome ID；输出:`OutcomeAuditView` | `OutcomeAuditView` | 只读 L2 truth 与允许 refs；不穿透写外部状态。 |
| `ConsumeBusDeliveryStatusFeedback` | Conditional Inbound Consumer | 来源:Bus formal feedback；输入:delivery ref / summary + envelope；本地结果:`BusDeliveryStatusRef` / gap | `BusDeliveryStatusRef`;`ConsistencyGap` | 只有正式 feedback 存在时启用；submitted 不推导 delivered。 |
| `ConsumeObservationStatusFeedback` | Blocked Inbound Consumer | 来源:Observability formal source；输入:material / status ref + envelope；本地结果:`ObservationMaterialRef` / gap | `ObservationMaterialRef`;`ConsistencyGap` | Producer / source / route 未闭口；不得声称 observed。 |
| `ToolOutcomeAuditMaterialAvailable` | Outbound Event skeleton | 产生:`SafeHandoffMaterial` with outcome / audit refs；消费者:Bus / logical Observability | `SafeHandoffMaterial`;`ExternalSubmissionAttempt` | `IB-L2T-017`;route / event schema blocked，local submitted != delivered / observed。 |
| `SafeEventCollaborationPort` | Blocked event port | 输入:`SafeHandoffMaterial`;输出:local submission response | `ExternalSubmissionAttempt` | 不拥有 publish / delivery / retry / DLQ / replay truth。 |
| `ExecutionSourceIntakePort` | Logical inbound port | 输入:source ref / safe summary / envelope；输出:consumer acceptance / gap | `SandboxExecutionSourceRef` | Delivery 不等于 outcome；source contract blocked。 |

停审：Source、outcome、audit、安全材料、本地 submission 和两类外部状态完全分层；`L2T-UP-003~007` 持续开放，pass。

## 11. 引用完整性与受控派生接口

| 接口 | 类别 | 输入 / 输出骨架 | 承接对象 | 读写与边界 |
|---|---|---|---|---|
| `GetReferenceConsistencyReport` | Query | 输入:inspection scope / watermark；输出:`ReferenceConsistencyReport` | `ReferenceConsistencyReport` | 只读 report；partial / stale 显式。 |
| `SearchToolContracts` | Query | 输入:body-free search criteria；输出:`ToolContractSearchProjection` collection | `ToolContractSearchProjection` | 外围增强；不成为 registry / authorization。 |
| `CompareToolContracts` | Query | 输入:tool / revision pair；输出:`ToolContractDiffSummary` | `ToolContractDiffSummary` | Diff 不批准演进。 |
| `GetToolDiagnostic` | Query | 输入:diagnostic subject ref；输出:`ToolDiagnosticSummary` | `ToolDiagnosticSummary` | 不等于 ToolHealth / Observability / Runtime recovery。 |
| `GetToolConsumerGuidance` | Query | 输入:`ToolId`;consumer context；输出:`ToolConsumerGuidanceView` | `ToolConsumerGuidanceView` | 不生成 SDK client / Runtime plan / authorization。 |
| `RecordConsistencyGapResolution` | Command | 输入:`ConsistencyGapId`;formal resolution evidence ref / decision ref；输出:updated gap view | `ConsistencyGap` | 只关闭 gap，不直接修复 subject；禁止伪 evidence alias。 |
| `CheckReferenceIntegrity` | Operations Job | 输入:core truth / typed refs / watermark；输出:assessments / gaps / report | `ReferenceValidityAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport` | 检测只读 subject，正式修复重入 owner。 |
| `RebuildToolDerivedViews` | Operations Job | 输入:stable views / watermark / projection scope；输出:search / diff / diagnostic / guidance projections | 四类派生对象 | Stale / rebuilding / unavailable 不阻塞核心。 |
| `RefreshExternalStatusRefs` | Conditional Operations Job | 输入:formal feedback sources / local attempt refs；输出:new external status refs / gaps | `BusDeliveryStatusRef`;`ObservationMaterialRef` | 无正式 source 时维持 unknown / blocked，不轮询制造 truth。 |
| `SharedContractAuthorityPort` | Compile authority port | 输入:Core authority / contract family；输出:`SharedContractAuthorityRef` | `SharedContractAuthorityRef` | Core-only compile；Tools-specific package / type 仍 candidate。 |

停审：Query / Job / gap resolution 均不反写核心或外部 truth；Core / SDK 缺口保持 candidate / future，pass。

## 12. Command API 骨架总表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `EstablishToolContract` | Definition intent / source ref / binding mode + Command context | `ToolContractView` | 原子建立 stable identity 与 first revision | Contract、definition、evolution fact |
| `AssessToolDefinitionChange` | Tool / candidate / consumer refs + Command context | `ToolCompatibilityImpact` | 评估兼容影响 | Impact fact，不改 current |
| `AdoptToolDefinitionRevision` | Tool / candidate / impact ref + Command context | `ToolContractView` | 正式采用新 revision | Current contract + evolution fact |
| `RetireToolContract` | Tool / reason + Command context | `ToolContractView` | 显式退役收口 | Lifecycle + evolution fact |
| `DeclareCapabilityBinding` | Tool / mode /适用 Hub ref / snapshot + Command context | `CapabilityBindingView` | 建立 bound / explicit-unbound relation | Binding、assessment、change fact |
| `ReplaceCapabilityBinding` | Binding / new ref / reason + Command context | `CapabilityBindingView` | 强一致替换 relation | Binding + change fact |
| `InvalidateCapabilityBinding` | Binding / reason + Command context | `CapabilityBindingView` | 显式使关系失效 | Binding + change fact |
| `SubmitToolInvocation` | Formal intent / context refs + Command context | `ToolInvocationView` | Canonicalize + admission；拒绝适用时收口 no-execution | Invocation、anchor、admission；适用 outcome / audit |
| `EvaluateExecutionPreconditions` | Invocation /适用 auth ref / Sandbox snapshot + Command context | Requirement / assessment summary | 工具要求 + 同步正式结果消费 + fail-closed | Requirement、authorization assessment |
| `PrepareExecutionHandoff` | Invocation / precondition refs / safe execution summary + Command context | Handoff / attempt 或 no-execution ref | 判断 eligibility 并调用 execution port | Handoff、local attempt；适用 outcome / audit |
| `AcceptExecutionSource` | Invocation / source ref / safe summary / mapping assessment + Command context | `OutcomeAuditView` | 正式 source assessment + normalized outcome / audit 收口 | Source assessment、outcome、audit |
| `PrepareSafeExternalHandoff` | Outcome / audit / target / sensitivity + Command context | Eligibility / material / attempt | 四项合取门禁与 local submission | Eligibility、material、submission attempt / gap |
| `RecordConsistencyGapResolution` | Gap / formal evidence ref / decision ref + Command context | Gap view | 验证正式闭口依据 | Gap state only；subject 修复另行重入 |

所有 Command 均继承 §5 公共 `ActorContext`、`CommandMetadata`、`IdempotencyKey`、`TraceContext`；本表不重复字段，也不表示已定 DTO。

## 13. Query API 骨架总表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetToolContract` | Tool / stable ref + Query context | `ToolContractView` | T1 contract truth | 不刷新 source / definition |
| `CompareToolDefinitionRevisions` | Tool / revision pair + Query context | `ToolContractDiffSummary` | Definition / impact refs | Diff 不批准变化 |
| `GetCapabilityBinding` | Tool / Binding + Query context | `CapabilityBindingView` | Binding truth /指定 assessment | 不等于 authorization |
| `GetToolInvocation` | Invocation + Query context | `ToolInvocationView` | T2 invocation / admission | 不拉取 Runtime body |
| `GetExecutionPreconditionView` | Invocation + Query context | Requirement / assessment / handoff summary | T2 judgments / attempts | 不返回外部正文 / lifecycle |
| `GetOutcomeAudit` | Invocation / outcome + Query context | `OutcomeAuditView` | T2 outcome / audit + allowed refs | 外部状态不反写 |
| `GetReferenceConsistencyReport` | Scope / watermark + Query context | `ReferenceConsistencyReport` | D1 report | Partial / stale 显式 |
| `SearchToolContracts` | Safe criteria + Query context | Search projections | D1 projection | 不成为 registry / allowlist |
| `CompareToolContracts` | Tool / revision pair + Query context | Diff summary | D1 projection / truth refs | 不写 current |
| `GetToolDiagnostic` | Subject ref + Query context | Diagnostic summary | T1/T2/D1 read | 不拥有 health / recovery |
| `GetToolConsumerGuidance` | Tool / consumer context | Guidance view | Stable views / gaps | 不生成 SDK / plan / auth |

所有 Query 均继承 §5 公共 `ActorContext`、`QueryMetadata`、`ConsumerContext`，只能返回 read model / projection / report / gap。

## 14. Inbound Event Consumer 骨架总表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeHubCapabilityChangeClue` | Hub controlled runtime seam | Hub change ref / safe summary + common envelope | New snapshot / assessment / gap candidate | 不自动改 Binding / old invocation |
| `ConsumeAuthorizationResultChangeClue` | Pending authorization seam | Result change ref / safe summary + common envelope | Ref validity assessment / gap candidate | `IB-L2T-012`;不替代同步 `IB-L2T-019`，当前 blocked |
| `ConsumeSandboxExecutionSource` | Sandbox logical source seam | Execution source ref / safe summary + common envelope | Source candidate / gap | 不直接写 outcome；mapping blocked |
| `ConsumeBusDeliveryStatusFeedback` | Conditional Bus feedback seam | Delivery ref / safe summary + common envelope | New `BusDeliveryStatusRef` / gap | 无正式反馈时不启用；submitted != delivered |
| `ConsumeObservationStatusFeedback` | Blocked Observability source | Material / status ref + common envelope | New `ObservationMaterialRef` / gap | Producer / source / route blocked；不声称 observed |

所有 Consumer 继承 §5 `EventEnvelope`、`SourceEventId`、`DeduplicationKey`、`ContractVersion`、`SourceAuthorityRef`、`TraceContext`；本地结果进入 assessment / gap 或后续正式 Command，不由 consumer 直接覆盖核心 truth。

## 15. Outbound Event 骨架总表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `ToolContractChanged` | 已提交 `ToolContractEvolutionFact` + eligible safe material | Runtime / event collaborators | 合同变化语义 skeleton；route / schema 未定。 |
| `CapabilityBindingChanged` | 已提交 `CapabilityBindingChangeFact` 或 gap + eligible safe material | Runtime / event collaborators | Binding 变化 / gap skeleton；不携带 Hub body。 |
| `ToolOutcomeAuditMaterialAvailable` | 已提交 outcome / audit + eligible safe material | Bus / logical Observability | Outcome / audit 安全材料 skeleton；local submitted 不等于 delivered / observed。 |
| `ToolConsistencyGapChanged` | 已提交 gap change + eligible safe material | 运维 / event collaborators | Gap open / resolved 安全变化 skeleton；不包含 evidence body。 |

所有 Event 都是 L2-owned semantic skeleton，不是已发布协议事实；只有对应 truth 已提交且安全门禁通过后才可形成材料。Event ID、payload、topic、outbox、relay、retry / DLQ / replay 与 route 均留给 03，且受 blocker 约束。

## 16. Operations Job 骨架总表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `CheckCapabilityBindingConsistency` | Binding truth / Hub refs / watermark | Assessments / gaps / report | 不创建 / 修复 relation |
| `CheckReferenceIntegrity` | T1/T2 truth / typed refs / watermark | Assessments / gaps / report | 不修改 subject / external truth |
| `RebuildToolDerivedViews` | Stable views / truth watermark / projection scope | Search / diff / diagnostic / guidance projections | 可 stale / rebuilding / unavailable；不阻塞核心 |
| `RefreshExternalStatusRefs` | Formal feedback sources / local attempts | New external refs / gaps | 无 source 时 unknown / blocked；不轮询制造 truth |

所有 Job 继承 §5 `SystemActorContext`、`JobMetadata`、`JobRunKey`、`TruthWatermark`。这里只定义设计输入骨架，未产生真实 run_id、执行记录或结果。

## 17. External Port 骨架

| Port | 依赖类型 / 状态 | 输入 | 输出 | 边界 |
|---|---|---|---|---|
| `SharedContractAuthorityPort` | compile / candidate | Core authority + contract family | `SharedContractAuthorityRef` | Core-only；Tools-specific type 未闭口。 |
| `HubControlledSourcePort` | runtime / current logical | Tool / capability refs | `HubControlledSnapshot` / ref | 不复制 Hub truth。 |
| `InvocationCallerPort` | runtime inbound / current logical | Formal intent / context refs | Submit command result | Caller / carrier 不分叉合同。 |
| `AuthorizationConsumptionPort` | pending / blocked | Invocation-bound consumption context | Result ref / safe summary | Owner / source / schema 未闭口，fail closed。 |
| `SandboxExecutionPort` | runtime / logical blocked mapping | `ExecutionHandoff` | Carrier-level local response | Attempt != accepted / receipt / run。 |
| `ExecutionSourceIntakePort` | runtime inbound / logical blocked source | Source ref / safe summary / envelope | Consumer acceptance / gap | Delivery != outcome。 |
| `SafeEventCollaborationPort` | event / blocked route | `SafeHandoffMaterial` | Local submission response | 不拥有 delivery / retry / DLQ / observation。 |
| `ToolContractStore`;`CapabilityBindingStore`;`ToolInvocationStore`;`ExecutionHandoffStore`;`OutcomeAuditStore`;`ExternalSubmissionStore` | persistence / internal | Corresponding aggregates / facts | Stable reads / write result | Repository signature / transaction / DB design 留 03。 |
| `ProjectionStore` | projection / internal | Reports / projections / watermarks | Derived reads / rebuild result | 不反写 T1 / T2。 |

## 18. 需求接口追溯与跨接口审计

### 18.1 `IB-L2T` 承接

| 需求接口 | 概要接口承接 | 结论 |
|---|---|---|
| `IB-L2T-001~004` | Contract Commands / Query / `ToolContractChanged` | complete |
| `IB-L2T-005~008` | Binding Commands / Query / Job / `CapabilityBindingChanged` | complete |
| `IB-L2T-009~010` | `SubmitToolInvocation`;适用 no-execution outcome / audit | complete |
| `IB-L2T-011` | `GetExecutionPreconditionView` | complete |
| `IB-L2T-012` | `ConsumeAuthorizationResultChangeClue` | logical blocked；不替代同步消费 |
| `IB-L2T-013` | `PrepareExecutionHandoff`;`SandboxExecutionPort` | logical blocked mapping / receipt |
| `IB-L2T-014` | `ConsumeSandboxExecutionSource`;`AcceptExecutionSource` | logical blocked source / mapping |
| `IB-L2T-015~016` | `GetOutcomeAudit`;稳定 views | complete at logical L2 boundary |
| `IB-L2T-017` | `PrepareSafeExternalHandoff`;event skeleton / port | logical blocked route |
| `IB-L2T-018` | `GetOutcomeAudit`;external refs / gaps | complete at local-truth boundary |
| `IB-L2T-019` | `EvaluateExecutionPreconditions`;`AuthorizationConsumptionPort` | owner / source blocked，fail closed |
| `IB-L2T-E01` | Search / compare Queries | peripheral / non-blocking |
| `IB-L2T-E02` | Integrity / rebuild Jobs | peripheral / no-write |
| `IB-L2T-E03` | Diagnostic / guidance Queries | peripheral / no SDK implementation |
| `IB-L2T-E04` | 正式 Commands 的 management-facing adapter seam | 不新增 CRUD / UI / 第二写入口 |

### 18.2 跨接口一致性审计

| 审计主题 | 结论 | 说明 |
|---|---|---|
| Command / Query 分类 | pass | 所有 truth write 只有 Command；Query 无刷新 / 修复副作用。 |
| Consumer / Command 分工 | pass | 外部 clue / material 先形成 ref / candidate / gap，再经正式 Command 写核心。 |
| Event / truth 提交顺序 | pass | Truth 先成立，eligibility / material 后成立，外部 event 不参与本地事务。 |
| Job 写权 | pass | Job 只写 assessment / gap / D1 projection / allowed refs，不修改 T1/T2 subject。 |
| 公共上下文 | pass | Command、Query、Consumer、Job 均明确 actor / metadata / idempotency / envelope / watermark 要求。 |
| 对象承接 | pass | 每个接口输入 / 输出均回指 Step 6 对象或明确字段 / summary 类型，无新 domain object。 |
| 接口 capability 覆盖 | pass | 六组成部分能力均有入口；无孤儿对象能力。 |
| Sync / async / background | pass | Admission / precondition / material acceptance 同步收口；external clues / propagation 异步；派生后台。 |
| Authorization 双路径 | pass | 同步 result consumption 与异步 change clue 分离，均不产生 external decision。 |
| 两类 attempt | pass | Execution handoff 与 external submission 由不同 Commands / ports 承接。 |
| Blocked seam | pass | Authorization、Sandbox、Observability、Core、SDK 均未被接口名润色为 ready。 |
| 协议层级 | pass | 未写 HTTP / RPC、DTO schema、event payload、topic、错误码、repository signature 或 adapter。 |
| Historical pollution | pass | 旧 `QueryToolPolicy` / monolithic `InvokeTool` / host callback / health repair 均未继承。 |

## 19. Step 8 / Step 9 反查

| 接口组 | Step 8 必须展开 | Step 9 触发状态 |
|---|---|---|
| Contract Commands | Establish / change-adopt / retire flows | Contract lifecycle、definition revision、evolution facts |
| Binding Commands / Job / Consumer | Declare / replace / invalidate / reassess flows | Relation / assessment / ref / gap states |
| `SubmitToolInvocation` | Canonical invocation + admission + reject/no-execution flow | Admission / outcome states |
| Precondition / handoff Commands | Governed fail-closed + sandbox-required flow | Requirement / auth assessment / handoff / attempt |
| Source Consumer + `AcceptExecutionSource` | Source intake / assessment / outcome / audit flow | Source / outcome / audit-gap states |
| Safe handoff Command / event port | Eligibility / material / local submission flow | Eligibility / submission / external-ref states |
| Integrity / rebuild Jobs | Reference check / projection rebuild flows | Gap / report / projection freshness states |

## 20. 回填草稿与完成门禁

正式 §7 回填 §5 分类说明、§12~§17 六类接口总表和 §18 blocker 摘要；各部分推导与停审保留在本中间产物。正式文档不得将 event skeleton 写成已发布事件，也不得将 logical / blocked port 写成已可调用协议。

| 门禁 | 结果 | 说明 |
|---|---|---|
| 六组成部分接口停审 | pass | 每部分均有对象 / capability 来源和清晰边界。 |
| 五类接口 + ports 完整 | pass | Command、Query、Consumer、Event、Job 和 external / persistence ports 均已收稳。 |
| `IB-L2T` 全量追溯 | pass | 19 核心 + 4 外围接口均有概要承接与状态。 |
| 跨接口无冲突 | pass | Read/write、sync/async/background、local/external 状态分权。 |
| Step 8 / 9 可承接 | pass | P0 流与状态触发入口已列明。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_08_processing_flows
formal_document_write_allowed = false
commit_required = false
```
