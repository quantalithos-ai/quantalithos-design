# L2-tools 02 概要 Step 8: 关键处理流 / 重要函数数据流

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 从 Step 7 接口和 Step 6 对象推导概要处理流；只表达入口、application service、domain object、store / projection / external port 与结果边界，不写完整调用链、协议、SQL、retry、事务脚本或实现。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 8 关键处理流 / 重要函数数据流 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 1~7，直接接口输入来自 Step 7 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 8；概要书写规范 §4.8 与 ASCII 图规则 |
| 已读取正式输入 | yes: 正式 00/01 的同步、异步、后台与 local-truth-first 口径 |
| 已读取参考粒度 | yes: Governance、Capability Hub、Method Library Step 8 |
| 旧材料处理 | 旧 monolithic `InvokeTool`、host callback、policy query、retryable result 流仅作污染审计 |
| 进入条件 | pass: Step 7 completed |
| next_allowed_action | 按六部分完成关键流、接口覆盖、状态反查和跨流审计。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 问题回答 / 诊断 / 取舍 | done | §2~§4 | pass |
| 通用处理流 | done | Command / Query / Consumer / Job / safe event 通用骨架 | pass |
| 1 工具合同与演进 | done | Contract establishment / evolution flows | pass |
| 2 Binding 与受控来源 | done | Binding mutation / change clue / consistency flows | pass |
| 3 规范调用与受理 | done | Canonical invocation + admission flow | pass |
| 4 执行前置与条件交接 | done | Precondition + Sandbox handoff flows | pass |
| 5 Outcome、审计与安全交接 | done | Source / outcome / audit / safe handoff / feedback flows | pass |
| 6 引用完整性与受控派生 | done | Integrity / rebuild / complex query / gap resolution flows | pass |
| 覆盖 / 状态反查 / 审计 | done | 接口映射、Step 9 主语、跨流审计 | pass |

## 2. SOP 问题回答

1. Command 先校验 actor / metadata / idempotency，装载当前 truth 与允许 refs，在 application service 内调用 domain 方法，随后只把 L2-owned aggregate / fact / assessment / attempt 写入对应 store；safe event material 始终在本地 truth 提交之后形成。
2. 简单 Query 走稳定 read-model 路径；search / diagnostic / guidance 等涉及 stale / rebuilding / unavailable 的 Query 走独立派生读取流，且无 fallback 到旧 truth 或外部正文。
3. Inbound Consumer 只验证 envelope / authority / dedup / version / forbidden body并形成 typed ref、safe snapshot、assessment candidate 或 gap；需要写核心 truth 时必须正式重入 Command。
4. Job 从已持久化 truth / refs / watermark 构建 assessment、report 或 projection；Job 不创建 / 修复 contract、Binding、invocation、outcome 或外部 truth。
5. 图中点名的函数调用只使用 Step 6 已定义函数，参数统一 `TypeName param_name`；返回类型、错误映射与 transaction 细节留给 03。
6. 概要层点名 owner 决策、正式重入、local commit、外部 port 与 failure branch；repository trait、outbox table、topic、lock、worker、retry 和 compensating action 后移。
7. P0 Command 流族为合同建立 / 演进、Binding mutation、invocation / admission、precondition、execution handoff、source / outcome / audit、safe handoff；改变本地 ref / gap 的 Consumer 和影响一致性的 Job 也独立展开。
8. Stable single-view Query 使用通用读路径；派生 view readiness / stale / gap 需要独立流。
9. 每条流归属一个主要组成部分，跨部分只通过 Step 5/7 已定义对象与 port。
10. 所有 Step 7 接口都必须映射到独立流族或明确的通用路径，无接口孤儿。
11. 每部分停审检查接口覆盖、对象定义、跨部分接缝、外部 owner 和详细设计越界。

## 3. 当前材料问题诊断

| 旧 / 潜在流 | 问题 | 当前修正 |
|---|---|---|
| `ToolDefinition -> ToolPolicy -> Invoke -> host -> result` 单线 | 把条件路径画成固定同步 pipeline，并合并 authorization / Sandbox / outcome owner。 | Contract、invocation、precondition、handoff 与 async source / outcome 分流。 |
| Caller request 直接持久化 | Raw / carrier body 成为工具 truth。 | Inbound 先 canonicalize，仅保存 `ToolInvocation` 与 safe refs。 |
| Policy query 决定 allow / deny | L2 self-authorization。 | 同步消费 external result，unverifiable fail closed。 |
| Sandbox callback 直接写 result | Capture / failure material 冒充 outcome。 | Consumer 形成 source candidate，再经 `AcceptExecutionSource` 正式受理。 |
| Publish 成功等同 observed | Local submission、Bus delivery、Observability observation 混合。 | Outcome / audit first，attempt 与 external refs 分层。 |
| Reconciliation / health repair | Job 变成第二核心写源或 Runtime recovery。 | Job 只写 assessment / gap / projection；修复重入正式 Command。 |

## 4. 处理流选择与覆盖策略

| 流族 | 独立图 | 覆盖接口 | 选择理由 |
|---|---|---|---|
| Contract establishment | yes | `EstablishToolContract` | Stable identity / first definition 原子成立，是 P0 起点。 |
| Contract evolution | yes | Assess / adopt / retire | Current、impact、history 分权会改变主路径。 |
| Binding mutation | yes | Declare / replace / invalidate | Relation 强一致且 explicit-unbound 不能由空值推断。 |
| Binding external clue / check | yes | Hub Consumer + consistency Job | 会写 snapshot / assessment / gap并影响调用可用性。 |
| Canonical invocation / admission | yes | `SubmitToolInvocation` | 必须在真实执行前收口，拒绝分支形成 no-execution。 |
| Execution precondition | yes | `EvaluateExecutionPreconditions` | Governed 同步消费与 fail-closed 是安全 P0。 |
| Sandbox handoff | yes | `PrepareExecutionHandoff` | Local eligibility / attempt 与 external execution 分权。 |
| Execution source / outcome / audit | yes | Source Consumer + `AcceptExecutionSource` | Async delivery 与同步正式语义重入必须分开。 |
| Safe external handoff | yes | Prepare + event port | 四项合取、local-truth-first 与 route blocked。 |
| External feedback | yes | Bus / Observability Consumers + refresh Job | 外部状态不能穿越改写 outcome。 |
| Integrity / gap resolution | yes | Integrity Job + gap resolution Command | Job no-write 与 formal resolution re-entry 分权。 |
| Derived rebuild / complex read | yes | Rebuild Job + search / diagnostic / guidance | Freshness / unavailable 不得阻塞核心或 fallback。 |
| Simple stable Queries | common | Get contract / binding / invocation / outcome / report | 只读单一 view，无额外 branch。 |

## 5. 通用处理流骨架

#### GenericCommandWritePath 处理流

```text
<Command API>
  - ActorContext / CommandMetadata / IdempotencyKey / TraceContext
  - typed intent / refs / safe summaries
  |
  v
<Inbound Boundary>
  - validate context, ownership, idempotency and forbidden body
  |
  v
<Application Service>
  - load current L2 truth and allowed refs / snapshots
  - invoke typed domain methods
  |
  v
<Domain Aggregate / Fact / Assessment>
  - accept, reject, fail closed or expose gap
  |
  v
<Persistence Boundary>
  - atomically store the L2-owned result and required history / audit
  |
  v
<Command Result>
  - stable view / explicit rejection / gap
```

关键设计点：

- “Atomically”只说明 L2 内部关系不能留下半状态，不指定数据库或 transaction API。
- 外部调用、delivery / observation 与派生重建不进入本地 truth commit 条件。
- Idempotency 算法、错误码、repository 签名与锁策略留给 03。

#### GenericStableQueryPath 处理流

```text
<Query API>
  - ActorContext / QueryMetadata / ConsumerContext / subject ref
  |
  v
<Query Application Service>
  - validate consumer boundary
  - load stable view or declared projection
  |
  v
<Read Model / Projection>
  - body-free result with current local status and explicit gaps
  |
  v
<Query Result>
  - current / stale / rebuilding / unavailable / not-found
```

关键设计点：

- Query 不刷新 ref、重评 assessment、修复 gap 或触发外部调用。
- 外部状态 unknown 不转换为本地 success / failure。
- Pagination、filter grammar、consistency token 和 transport 留给 03。

#### GenericInboundConsumerPath 处理流

```text
<Inbound Event / Callback Clue>
  - EventEnvelope / SourceEventId / DeduplicationKey
  - ContractVersion / SourceAuthorityRef / TraceContext
  |
  v
<Consumer Boundary>
  - verify authority, version, dedup and forbidden body
  |
  v
<Application Service>
  - create typed ref / safe snapshot / assessment candidate / gap
  - route any core change through a formal Command
  |
  v
<D1 Reference / Snapshot / Gap>
  - append new consumption-time fact; never overwrite history
  |
  v
<Consumer Result>
  - accepted clue / duplicate / rejected / unresolved / blocked
```

关键设计点：

- Consumer 不直接采用 definition、替换 Binding 或写 outcome。
- 迟到材料形成新 ref / snapshot / assessment / gap，不穿越覆盖旧 invocation。
- Topic、callback schema、consumer group、retry / DLQ 留给 03；未闭口 seam 不假设存在。

#### GenericOperationsJobPath 处理流

```text
<Operations Job>
  - SystemActorContext / JobMetadata / JobRunKey / TruthWatermark
  |
  v
<Job Application Service>
  - read persisted truth, refs, snapshots and projection watermark
  |
  v
<Assessment / Report / Projection Builder>
  - check, compare, rebuild or refresh allowed derived state
  |
  v
<D1 Persistence>
  - append assessment / gap or replace rebuildable projection
  |
  v
<Job Result Surface>
  - current / partial / stale / rebuilding / unavailable / failed
```

关键设计点：

- `JobRunKey` 是接口骨架，不是本轮真实 run_id，也没有伪造运行结果。
- Job 只能更新 D1 / gap fact，不能修改 T1 / T2 subject truth。
- Scheduler、lease、retry、checkpoint、batch size 和 worker topology 留给 03 / 04。

#### SafeOutboundMaterialPath 处理流

```text
<Committed L2 Fact / Audit / Gap>
  |
  v
<SafeHandoffService>
  - evaluate minimal necessary + body-free + redacted + correlated
  |
  +-- ineligible / unverifiable --> <No submission + explicit gap>
  |
  v eligible
<SafeHandoffMaterial>
  |
  v
<SafeEventCollaborationPort>
  - record only local submission response
  |
  v
<ExternalSubmissionAttempt>
  - submitted_locally / locally_failed / route_blocked / degraded
```

关键设计点：

- 本地 fact / audit 先提交，safe handoff 的任何失败都不回滚它们。
- Local submission 不等于 Bus delivered 或 Observability observed。
- Event schema、route、outbox、delivery feedback 与 observation source 仍受 blocker 约束。

## 6. 工具合同与演进处理流

#### EstablishToolContract 处理流

```text
<EstablishToolContract Command>
  - FormalDefinitionIntent / DefinitionSourceRef / CapabilityBindingMode
  - ActorContext / CommandMetadata / IdempotencyKey
  |
  v
<ToolContractService>
  - validate source authority and forbidden-body boundary
  - call FormalToolDefinition.formalize(
      ToolId tool_id,
      DefinitionRevision revision,
      FormalDefinitionIntent intent,
      DefinitionSourceRef source_ref)
  |
  v
<ToolContract>
  - call ToolContract.establish(
      ToolId tool_id,
      FormalToolDefinition definition,
      CapabilityBindingMode binding_mode)
  |
  v
<ToolContractStore>
  - atomically persist contract + first definition + evolution fact
  |
  v
<ToolContractView / safe change candidate>
```

关键设计点：

- Stable Tool identity 与首个 current definition 必须共同成立，source 不可验证时不留半合同。
- `CapabilityBindingMode` 只声明后续 relation 分类，不在此复制 Hub truth。
- Tool ID 分配、revision 算法、store transaction 与 event contract 留给 03。

#### Assess / Adopt / Retire Tool Contract 处理流

```text
<AssessToolDefinitionChange / AdoptToolDefinitionRevision / RetireToolContract>
  |
  v
<ToolContractEvolutionService>
  - load ToolContract + current FormalToolDefinition + allowed consumer refs
  - call ToolCompatibilityImpact.assess(
      FormalToolDefinition current,
      FormalToolDefinition candidate,
      ConsumerReferenceSummary consumers)
  |
  +-- assess only --> <persist impact fact; current revision unchanged>
  |
  +-- incompatible / unverifiable --> <reject adoption; explicit gap>
  |
  v adopt or retire
<ToolContract>
  - call adopt_revision(FormalToolDefinition definition, ToolCompatibilityImpact impact)
    or request_retirement(ContractRetirementReason reason)
  |
  v
<ToolContractStore>
  - persist current change + append ToolContractEvolutionFact
  |
  v
<ToolContractView / safe change candidate>
```

关键设计点：

- Assessment 不自动采用 revision，diff / reconciliation 也不能触发 adoption。
- Retired contract 拒绝新 invocation，但历史 definition / facts 继续可读。
- Migration algorithm、consumer enumeration 和 retirement completion workflow 留给 03 / 07。

本部分停审：合同建立与演进接口均有处理口径，使用 Step 6 对象且保持 current / history 分权；无实现 / provider / SDK 越界，pass。

## 7. Capability Binding 与受控来源处理流

#### Declare / Replace / Invalidate Capability Binding 处理流

```text
<Binding Command>
  - ToolId / CapabilityBindingMode / optional HubCapabilityRef
  - optional HubControlledSnapshot / BindingChangeReason
  |
  v
<CapabilityBindingService>
  - load ToolContract and current relation
  - reject missing ref being interpreted as explicit-unbound
  - validate Hub authority / snapshot without copying body
  |
  v
<CapabilityBinding>
  - establish_bound(ToolId tool_id, HubCapabilityRef capability_ref)
    or declare_unbound(ToolId tool_id, BindingClassificationReason reason)
    or replace_ref(HubCapabilityRef capability_ref, BindingChangeReason reason)
    or invalidate(BindingInvalidationReason reason)
  |
  v
<BindingAssessmentService>
  - create consumption-time CapabilityBindingAssessment
  |
  v
<CapabilityBindingStore>
  - persist relation + assessment + append change fact
  |
  v
<CapabilityBindingView / safe change candidate>
```

关键设计点：

- Bound / explicit-unbound 是 L2 relation truth；Hub ref 缺失只产生 missing / unverifiable。
- Hub visibility / applicability 不在此变成 authorization，Job 不能自动修复 relation。
- Snapshot freshness algorithm、Hub adapter 与 store transaction 留给 03 / 04。

#### Hub Change Clue / Binding Consistency 处理流

```text
<ConsumeHubCapabilityChangeClue or CheckCapabilityBindingConsistency Job>
  |
  v
<Consumer Boundary / ReferenceIntegrityService>
  - verify envelope or JobMetadata / TruthWatermark
  - load CapabilityBinding + HubCapabilityRef + allowed snapshot
  |
  v
<BindingAssessmentService>
  - call CapabilityBindingAssessment.assess(
      CapabilityBinding binding,
      HubControlledSnapshot snapshot,
      AssessmentTime assessed_at)
  |
  +-- valid --> <append new assessment>
  |
  +-- stale / conflict / missing / unverifiable --> <append assessment + ConsistencyGap>
  |
  v
<D1 Assessment / ReferenceConsistencyReport>
  - no relation mutation
  |
  v
<Consumer / Job Result>
```

关键设计点：

- External clue 与 scheduled check 共用评估语义，但输入 envelope / Job context 不同。
- 新 assessment 不改写历史 invocation 的 Binding anchor；受影响的新调用 fail closed。
- Formal relation change 必须重入 Binding Command。

本部分停审：Binding mutation、外部变化与一致性检查均有流；relation、assessment、snapshot、gap 写权分离，pass。

## 8. 规范调用与受理处理流

#### SubmitToolInvocation 处理流

```text
<SubmitToolInvocation Command via InvocationCallerPort>
  - FormalInvocationIntent / InvocationContextRefs
  - ActorContext / CommandMetadata / IdempotencyKey / TraceContext
  |
  v
<ToolInvocationService>
  - load active ToolContract + FormalToolDefinition
  - load explicit binding mode and required valid assessment
  - call InvocationContractAnchor.anchor(
      ToolContract contract,
      FormalToolDefinition definition,
      CapabilityBindingView binding_view,
      ConsumptionTime consumed_at)
  - call ToolInvocation.canonicalize(
      FormalInvocationIntent intent,
      InvocationContractAnchor anchor,
      InvocationContextRefs context_refs)
  |
  v
<InvocationAdmissionService>
  +-- contract / context / binding invalid --> reject or unavailable
  |     - create InvocationAdmission
  |     - create no-execution ToolInvocationOutcome + ToolAuditEntry
  |
  +-- governed / sandbox preconditions needed --> awaiting_precondition
  |
  +-- no additional precondition --> admitted
  |
  v
<ToolInvocationStore / OutcomeAuditStore>
  - atomically persist invocation + anchor + admission
  - persist no-execution outcome / audit only for terminal reject branch
  |
  v
<ToolInvocationView>
```

关键设计点：

- Raw caller / transport body 在 inbound boundary 被拒绝或归一化后丢弃，不能进入 invocation truth。
- Admission 必须在真实执行前成立；reject 分支原子形成消费者可见 no-execution 与 audit。
- Governed / Sandbox 只是条件分支，不代表所有调用固定经过外部 seam。
- Idempotency / correlation resolution、canonical parameter schema 和 error taxonomy 留给 03。

本部分停审：`SubmitToolInvocation` 覆盖 canonicalization、contract anchor、admission 与 reject/no-execution，所有对象已在 Step 6 定义；无 Runtime plan / retry / recovery 越界，pass。

## 9. 执行前置与条件交接处理流

#### EvaluateExecutionPreconditions 处理流

```text
<EvaluateExecutionPreconditions Command>
  - ToolInvocationId / optional AuthorizationResultRef
  - optional SandboxReadinessSnapshot
  |
  v
<ExecutionPreconditionService>
  - load admitted ToolInvocation + FormalToolDefinition + applicable Binding assessment
  - call ExecutionRequirement.derive(
      ToolInvocation invocation,
      FormalToolDefinition definition,
      CapabilityBindingAssessment binding_assessment)
  |
  +-- no authorization required --> continue applicable carrier checks
  |
  +-- authorization required --> <AuthorizationConsumptionPort>
  |     - synchronously obtain invocation-bound ref / safe summary if formal seam exists
  |     - call AuthorizationConsumptionAssessment.consume(
  |         ToolInvocation invocation,
  |         ExecutionRequirement requirement,
  |         AuthorizationResultRef result_ref,
  |         AuthorizationDecisionSafeSummary summary,
  |         ConsumptionTime consumed_at)
  |
  +-- deny / missing / stale / conflict / unverifiable --> fail closed
  |     - persist assessment
  |     - create no-execution outcome + audit
  |
  v
<ExecutionHandoffStore / OutcomeAuditStore>
  - persist requirement + assessment and applicable terminal branch
  |
  v
<Precondition Summary / no-execution OutcomeAuditView>
```

关键设计点：

- `AuthorizationConsumptionPort` 当前 owner / source / result contract blocked；因此 governed positive path 不能声明 ready，实际逻辑默认 fail closed。
- 异步 authorization change clue 不替代本次同步 result consumption，也不能跨 invocation 复用。
- L2 只判断 source/result 可消费性，不生成 external allow / deny。

#### PrepareExecutionHandoff 处理流

```text
<PrepareExecutionHandoff Command>
  - admitted ToolInvocation / ExecutionRequirement
  - AuthorizationConsumptionAssessment if applicable
  - SandboxReadinessSnapshot if sandbox-required
  |
  v
<SandboxHandoffService>
  - verify applicable preconditions and isolation requirement
  - call ExecutionHandoff.prepare(
      ToolInvocation invocation,
      ExecutionRequirement requirement,
      PreconditionAssessmentRefs assessment_refs,
      CanonicalExecutionSafeSummary summary)
  - call ExecutionHandoff.evaluate_eligibility(
      ExecutionRequirement requirement,
      AuthorizationConsumptionAssessment authorization,
      SandboxReadinessSnapshot readiness)
  |
  +-- blocked / mapping missing / seam unavailable -->
  |     - record ExecutionHandoffAttempt.blocked_gap
  |     - create no-execution outcome + audit
  |
  +-- eligible and direct-eligible -->
  |     - return execution boundary intent without changing canonical semantics
  |
  +-- eligible and sandbox-required --> <SandboxExecutionPort>
        - record local ExecutionHandoffAttempt
        - never infer accepted / receipt / run
  |
  v
<ExecutionHandoffStore / optional OutcomeAuditStore>
  |
  v
<Handoff / Attempt summary or no-execution OutcomeAuditView>
```

关键设计点：

- Sandbox-required 分支不得降级宿主直跑；mapping / carrier / receipt 缺口显式阻断。
- `ExecutionHandoffAttempt` 只记录 L2 local port call，不拥有 Sandbox lifecycle。
- Direct-eligible 只表示合同允许某类非 Sandbox carrier，具体执行者仍不由 L2 定义；03 必须闭合其正式 boundary 或保持 unsupported。
- Mapping、request schema、receipt、timeout、cleanup 和 adapter implementation 留给 03，且受 `L2T-UP-003~004` 约束。

本部分停审：执行要求、authorization consumption、Sandbox readiness、handoff 与 attempt 已分层；fail-closed / no-execution 与 isolation redline 有明确流，pass。

## 10. Outcome、审计与安全交接处理流

#### ConsumeSandboxExecutionSource / AcceptExecutionSource 处理流

```text
<Sandbox execution source clue>
  - EventEnvelope / SourceEventId / SandboxAuthorityRef
  - ExternalSandboxExecutionRef / CorrelationRef / safe summary
  |
  v
<ConsumeSandboxExecutionSource Consumer>
  - verify envelope, authority, dedup, version and forbidden body
  - create SandboxExecutionSourceRef or explicit source gap
  - do not write outcome
  |
  v formal re-entry
<AcceptExecutionSource Command / OutcomeNormalizationService>
  - load ToolInvocation + contract anchor + applicable handoff
  - call ExecutionSourceAssessment.assess(
      ToolInvocation invocation,
      SandboxExecutionSourceRef source_ref,
      ExecutionSourceSafeSummary summary,
      ExecutionOutcomeMappingAssessment mapping)
  |
  +-- rejected / missing / conflict / unverifiable / mapping-blocked -->
  |     - persist assessment + gap; no fabricated outcome
  |
  +-- accepted success source -->
  |     - call ToolInvocationOutcome.succeed(
  |         ToolInvocation invocation,
  |         ExecutionSourceAssessment source,
  |         NormalizedToolResultSummary result)
  |
  +-- accepted failure source -->
        - call ToolInvocationOutcome.fail(
            ToolInvocation invocation,
            ExecutionSourceAssessment source,
            ToolOutcomeClass failure_class,
            NormalizedToolErrorSummary error)
  |
  v
<ToolAuditService>
  - call ToolAuditEntry.record(
      ToolInvocation invocation,
      ToolInvocationOutcome outcome,
      ToolJudgmentRefSet judgment_refs,
      AllowedSourceRefSet source_refs)
  |
  v
<OutcomeAuditStore>
  - atomically persist accepted assessment + outcome + audit
  |
  v
<OutcomeAuditView>
```

关键设计点：

- Consumer delivery 与 Command semantic acceptance 是两个边界；异步消费者不能直接写终态。
- Capture / provider response 只作为 source，必须有正式 mapping 才能形成 normalized outcome。
- Mapping 未闭口时只保留 source assessment / gap，不因“已有材料”声称 result / error ready。
- Result / error payload schema、mapping table、transaction、dedup 和 error code 留给 03。

#### PrepareSafeExternalHandoff 处理流

```text
<PrepareSafeExternalHandoff Command>
  - ToolInvocationOutcomeId / ToolAuditEntryId
  - ExternalCollaborationClass / SensitivityContext
  |
  v
<SafeHandoffService>
  - load committed ToolInvocationOutcome + ToolAuditEntry
  - call SafeHandoffEligibility.evaluate(
      ToolInvocationOutcome outcome,
      ToolAuditEntry audit,
      ExternalCollaborationClass target_class,
      SensitivityContext sensitivity)
  |
  +-- ineligible / unverifiable -->
  |     - persist eligibility + gap; no material / submission
  |
  v eligible
<SafeHandoffMaterial>
  - call SafeHandoffMaterial.prepare(
      SafeHandoffEligibility eligibility,
      BodyFreeFactSummary summary,
      SafeCorrelationRefSet correlations,
      LocalTruthRefSet truth_refs)
  |
  v
<SafeEventCollaborationPort>
  +-- route blocked --> record ExternalSubmissionAttempt.route_blocked
  +-- local failure --> record ExternalSubmissionAttempt.local_failure
  +-- local call accepted --> record ExternalSubmissionAttempt.submitted_locally
  |
  v
<ExternalSubmissionStore>
  - persist eligibility + material + local attempt / gap
  |
  v
<OutcomeAuditView with local handoff summary>
```

关键设计点：

- Minimal necessary、body-free、redacted、correlated 四项全部通过才允许 material。
- Outcome / audit 已先成立；eligibility / material / submission 失败不回滚它们。
- `submitted_locally` 不等于 delivered / observed，且当前 Observability producer / route 仍 blocked。
- Redaction algorithm、event payload / route、outbox 与 delivery contract 留给 03 / 04。

#### External Delivery / Observation Feedback 处理流

```text
<Bus delivery or Observability status feedback clue>
  - common EventEnvelope / formal authority ref
  - ExternalSubmissionAttemptId / external status ref / safe summary
  |
  v
<Conditional / Blocked Feedback Consumer>
  - verify formal source, correlation, dedup and version
  |
  +-- source / route unavailable --> append unknown / route-blocked gap
  |
  +-- valid Bus feedback --> create BusDeliveryStatusRef
  |
  +-- valid Observation feedback --> create ObservationMaterialRef
  |
  v
<D1 External Status Ref Persistence>
  - append consumption-time ref / summary
  - never update ToolInvocationOutcome or ToolAuditEntry
  |
  v
<OutcomeAuditView / Diagnostic projection refresh hint>
```

关键设计点：

- Bus delivery 与 Observability observation 保持两个 owner、两类 ref，不能统一为“handoff success”。
- 后到反馈形成新 ref / snapshot / gap，不原地修改旧 submission attempt 或 outcome。
- 当前 positive Observability path 没有正式 source / route，因此只能保留 blocked logical flow。

本部分停审：Execution material consumer、formal outcome / audit、safe handoff 与 external feedback 都有独立流；local / external truth、两类 attempt 与 forbidden body 分权完整，pass。

## 11. 引用完整性与受控派生处理流

#### CheckReferenceIntegrity 处理流

```text
<CheckReferenceIntegrity Operations Job>
  - SystemActorContext / JobMetadata / JobRunKey / TruthWatermark
  - ReferenceInspectionScope
  |
  v
<ReferenceIntegrityService>
  - read T1/T2 truth and typed P1-P6 refs / snapshots
  - call ReferenceValidityAssessment.assess(
      TypedExternalReference subject_ref,
      ExpectedAuthorityRef authority_ref,
      ExpectedRevisionRef revision_ref,
      AssessmentTime assessed_at)
  |
  +-- valid --> append assessment
  |
  +-- stale / conflict / missing / unverifiable -->
  |     - call ConsistencyGap.detect(
  |         ConsistencyGapScope scope,
  |         GapSubjectRefSet subjects,
  |         ConsistencyGapClass gap_class,
  |         GapImpactClass impact)
  |
  v
<ReferenceConsistencyReport>
  - call ReferenceConsistencyReport.generate(
      ReferenceInspectionScope scope,
      ReferenceAssessmentRefSet assessments,
      ConsistencyGapRefSet gaps,
      LocalTruthWatermark watermark)
  - assessments + gaps + source watermark
  |
  v
<ProjectionStore>
  - persist assessment / gap / report only
  |
  v
<Job result: current / partial / stale / failed>
```

关键设计点：

- Job 不修复 contract、Binding、invocation、outcome 或 external refs；只发现并分类 gap。
- Gap impact 决定受影响新路径 fail-closed、integration blocked 或外围 degraded，但不会改变历史 truth。
- Actual scheduling、batch / watermark algorithm 和 report storage 留给 03 / 04。

#### RecordConsistencyGapResolution 处理流

```text
<RecordConsistencyGapResolution Command>
  - ConsistencyGapId / GapResolutionEvidenceRef / ResolutionDecisionRef
  - ActorContext / CommandMetadata / IdempotencyKey
  |
  v
<ReferenceIntegrityService>
  - load open ConsistencyGap and affected subject refs
  - verify evidence ref points to a formal authority / owner decision
  - do not treat text, commit guess, run id or signoff claim as evidence
  |
  +-- evidence insufficient --> keep open; append rejection reason
  |
  +-- subject still inconsistent --> mark resolution_pending
  |
  +-- formal owner re-entry already repaired subject and verification passes -->
        call ConsistencyGap.resolve(
          GapResolutionEvidenceRef evidence_ref,
          ResolutionDecisionRef decision_ref)
  |
  v
<ProjectionStore>
  - persist gap state only
  |
  v
<Gap view / optional safe gap change candidate>
```

关键设计点：

- This Command closes a gap only after the subject was repaired through its own formal boundary; it never repairs the subject itself.
- No implementation commit, run_id, evidence alias or acceptance signoff is fabricated in this design.
- Evidence verification contract and role checks留给 03 / 05 / 06。

#### RebuildToolDerivedViews 处理流

```text
<RebuildToolDerivedViews Operations Job>
  - ProjectionScope / TruthWatermark / Job context
  |
  v
<ToolDerivedViewService>
  - load ToolContractView / CapabilityBindingView / allowed outcome summaries / gaps
  - choose projection builders by requested scope
  |
  v
<Projection Builders>
  - ToolContractSearchProjection.project(
      ToolContractView contract_view,
      CapabilityBindingView binding_view,
      LocalTruthWatermark watermark)
  - call ToolContractDiffSummary.compare(
      FormalToolDefinition base,
      FormalToolDefinition target,
      ToolCompatibilityImpact impact)
  - call ToolDiagnosticSummary.derive(
      ToolDiagnosticSubjectRef subject_ref,
      LocalTruthSafeSummary truth,
      ExternalAssessmentSafeSummary assessments,
      LocalAttemptSafeSummary attempts,
      ConsistencyGapRefSet gaps)
  - call ToolConsumerGuidanceView.project(
      ToolContractView contract_view,
      CapabilityBindingView binding_view,
      ConsistencyGapRefSet gaps)
  |
  +-- build failure --> mark only projection failed / unavailable
  |
  v
<ProjectionStore>
  - replace rebuildable projection at declared watermark
  |
  v
<Job result: fresh / stale / rebuilding / unavailable / failed>
```

关键设计点：

- Projection build failure does not alter contract / invocation / outcome or block their stable Query paths.
- Search、diff、diagnostic 与 guidance 各自有 freshness surface，不能合并成 ToolHealth truth。
- Index product、query engine、refresh schedule 和 storage layout 留给 03 / 04。

#### Derived Search / Diagnostic / Guidance Query 处理流

```text
<SearchToolContracts / CompareToolContracts / GetToolDiagnostic / GetToolConsumerGuidance>
  - ActorContext / QueryMetadata / ConsumerContext / safe criteria
  |
  v
<ToolDerivedViewService>
  - verify consumer boundary and forbidden criteria
  - load requested projection + watermark / gap state
  |
  +-- fresh --> return body-free projection
  +-- stale --> return stale surface and stable truth reference
  +-- rebuilding --> return rebuilding surface; do not wait on core path
  +-- unavailable / failed --> return explicit unavailable; no inventory / allowlist fallback
  |
  v
<Derived Query Result>
```

关键设计点：

- Stale / rebuilding / unavailable are first-class read results, not reasons to reconstruct truth in Query.
- Guidance does not create SDK client / Runtime plan or authorization decision.
- Search filter / pagination / ranking and fallback UX留给 03 / 产品层，但 fallback 不能越过 truth 边界。

本部分停审：Integrity Job、gap formal resolution、derived rebuild 与 complex read 均有流；Jobs / Queries 不反写核心，Core / SDK blocker 未被伪闭口，pass。

## 12. 接口到处理流覆盖清单

| Step 7 接口组 | 处理流口径 | 未单独画图理由 / 差异 |
|---|---|---|
| `EstablishToolContract` | 独立 Contract establishment | P0 起点。 |
| Assess / adopt / retire contract | 独立 Contract evolution family | 同族共享 current / impact / history 分权，分支差异已在图内。 |
| `GetToolContract` | `GenericStableQueryPath` | 单一 stable view 读取。 |
| Contract compare Queries | Derived complex Query flow | 含 projection freshness / unavailable。 |
| Contract outbound event | `SafeOutboundMaterialPath` | 事实提交后统一安全材料路径。 |
| Declare / replace / invalidate Binding | 独立 Binding mutation family | 同族 relation change，差异在 domain method。 |
| `GetCapabilityBinding` | `GenericStableQueryPath` | Stable relation / assessment view。 |
| Hub change Consumer / Binding consistency Job | 独立 shared assessment flow | Envelope 与 Job context 不同，但 domain assessment 同构。 |
| Binding outbound event | `SafeOutboundMaterialPath` | 不重复画 event route。 |
| `SubmitToolInvocation`;`InvocationCallerPort` | 独立 invocation / admission | P0 sync pre-execution judgment。 |
| `GetToolInvocation` | `GenericStableQueryPath` | Stable view 读取。 |
| `EvaluateExecutionPreconditions`;auth port | 独立 precondition flow | Governed fail-closed 分支。 |
| `PrepareExecutionHandoff`;Sandbox port | 独立 Sandbox handoff flow | Isolation / attempt boundary。 |
| Precondition Query | `GenericStableQueryPath` | 只读 L2 judgments / attempts。 |
| Sandbox source Consumer / intake port / `AcceptExecutionSource` | 独立 source / outcome / audit flow | Async clue 与 formal re-entry 分层。 |
| `PrepareSafeExternalHandoff`;event port / event skeleton | 独立 safe handoff flow | 四项合取与 local-truth-first。 |
| `GetOutcomeAudit` | `GenericStableQueryPath` | Stable local outcome / audit view。 |
| Bus / Observability feedback Consumers + status refresh Job | 独立 external feedback flow | 两 owner refs 同构，route status 不同。 |
| Stable report Query | `GenericStableQueryPath` | Report state 已显式。 |
| Search / compare / diagnostic / guidance Queries | 独立 derived complex read | Freshness / rebuilding / unavailable 无 fallback。 |
| Integrity Jobs | 独立 integrity flow | 影响 gap / query consistency。 |
| Rebuild Job | 独立 derived rebuild flow | 影响 projection freshness。 |
| Gap resolution Command | 独立 formal resolution flow | 必须证明不修 subject。 |
| Shared authority / persistence / projection ports | 对应 Command / Query / Job 流中的 boundary | Port 不单独形成业务 use case。 |

## 13. Step 9 状态触发反查

| 状态主题 | 触发处理流 | Step 6 状态对象 |
|---|---|---|
| Contract lifecycle / definition revision | Establish / evolution | `ToolContract`;`FormalToolDefinition`;`ToolContractEvolutionFact` |
| Compatibility assessment | Contract evolution | `ToolCompatibilityImpact` |
| Binding relation / assessment / ref | Binding mutation / external clue / check | `CapabilityBinding`;`CapabilityBindingAssessment`;`HubCapabilityRef`;`HubControlledSnapshot` |
| Admission / no-execution | Submit invocation | `InvocationAdmission`;`ToolInvocationOutcome` |
| Requirement / auth consumption | Precondition | `ExecutionRequirement`;`AuthorizationConsumptionAssessment`;`AuthorizationResultRef` |
| Handoff / local attempt / readiness | Sandbox handoff | `ExecutionHandoff`;`ExecutionHandoffAttempt`;`SandboxReadinessSnapshot` |
| Source assessment / outcome / audit gap | Source / outcome / audit | `ExecutionSourceAssessment`;`ToolInvocationOutcome`;`ToolAuditEntry`;`ConsistencyGap` |
| Safe eligibility / submission | Safe external handoff | `SafeHandoffEligibility`;`ExternalSubmissionAttempt` |
| Delivery / observation refs | External feedback | `BusDeliveryStatusRef`;`ObservationMaterialRef` |
| Ref validity / gap / report | Integrity / gap resolution | `ReferenceValidityAssessment`;`ConsistencyGap`;`ReferenceConsistencyReport` |
| Projection freshness | Rebuild / complex read | Search / diff / diagnostic / guidance objects |
| Core authority resolution | Integrity / stable reference read | `SharedContractAuthorityRef` |

## 14. 跨处理流一致性审计

| 审计主题 | 结论 | 说明 |
|---|---|---|
| 接口覆盖 | pass | Step 7 所有 Command / Query / Consumer / Event / Job / Port 都有独立或通用流口径。 |
| 对象引用 | pass | 图中 domain / ref / view / assessment 主语均在 Step 6 定义；service / store / port 来自 Step 5/7。 |
| 参数类型 | pass | 所有点名函数的带参输入均为 `TypeName param_name`，无裸参数 / `...`。 |
| Sync / async / background | pass | Admission / precondition / source acceptance 同步；clue / propagation 异步；checks / rebuild 后台。 |
| Transaction-like boundary | pass | 只声明 L2 内部原子关系；外部调用 / delivery / observation 不进入 commit。 |
| Formal re-entry | pass | External clue / Job 不能直接改核心；source / gap / relation 变化均有正式 Command。 |
| Admission / no-execution | pass | Reject / fail-closed 在真实执行前，且不生成 Sandbox facts。 |
| Source / outcome | pass | Delivery / ref / assessment / normalized outcome 分层；mapping blocked 不伪造结果。 |
| 两类 attempt | pass | Execution handoff 与 post-outcome submission 分别由独立 flow 承接。 |
| Local / external status | pass | L2 attempt / outcome / audit 与 accepted / run / delivered / observed 分离。 |
| Derived no-write | pass | Checks / rebuild / Queries 不修改 T1/T2；projection failure 不改 subject。 |
| Blocker 诚实 | pass | Authorization、Sandbox、Observability、Core、SDK seam 仍有 blocked / candidate / future 分支。 |
| 详细设计越界 | pass | 未写协议字段、错误码、repository trait、SQL、topic、retry、锁、worker 或实现代码。 |
| 历史污染 | pass | Monolithic invoke、ToolPolicy decision、host callback result、health repair 未回流。 |

## 15. 回填草稿与完成门禁

正式 §8 回填 §4 的覆盖策略、§5 通用路径、§6~§11 的 12 个独立流族和 §12 接口覆盖摘要。正式文档必须保留 flow 图后关键设计点；不得把 blocked logical path 绘成已经存在的正向 integration。

| 门禁 | 结果 | 说明 |
|---|---|---|
| 六组成部分逐项停审 | pass | 每部分接口、对象、接缝和禁止事项完整。 |
| P0 / Consumer / Job / complex Query 选择完整 | pass | 关键写流与一致性流均独立展开。 |
| 接口无遗漏 | pass | 所有 Step 7 接口有 flow family。 |
| Step 9 可承接 | pass | 状态 owner / 触发流均有对象主语。 |
| 图与参数规范 | pass | 每图使用 text block + 关键点，点名函数参数均有类型。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_09_state_machine
formal_document_write_allowed = false
commit_required = false
```
