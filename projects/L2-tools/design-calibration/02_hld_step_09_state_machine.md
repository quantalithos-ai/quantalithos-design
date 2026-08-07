# L2-tools 02 概要 Step 9: 状态定义与状态流转

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 从 Step 6 对象状态、Step 7 触发接口和 Step 8 处理流收束多个 owner 状态族；不构造跨 authorization / Sandbox / Bus / Observability 的统一状态机，不写 enum 实现、DB 状态列、错误码或补偿脚本。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 9 状态定义与状态流转 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 5~8，直接状态主语来自 Step 6 / Step 8 §13 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 9；概要书写规范 §4.9 |
| 已读取正式输入 | yes: 正式 00/01 的 truth / snapshot / ref / attempt / external status 分层 |
| 已读取参考粒度 | yes: Governance、Capability Hub、Artifact、Method Library Step 9 |
| 旧材料处理 | `ToolHealth`、availability、retryable / non-retryable、host / Sandbox run state 仅作历史污染审计 |
| 进入条件 | pass: Step 8 completed |
| next_allowed_action | 按六部分定义状态、允许 / 禁止迁移、传播和跨状态审计。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 问题回答 / 状态类型取舍 | done | §2~§4 | pass |
| 1 工具合同与演进 | done | Lifecycle / revision / impact / source states | pass |
| 2 Binding 与受控来源 | done | Relation / assessment / ref / snapshot states | pass |
| 3 规范调用与受理 | done | Context / admission / no-execution propagation | pass |
| 4 执行前置与条件交接 | done | Requirement / auth / readiness / handoff / attempt states | pass |
| 5 Outcome、审计与安全交接 | done | Source / outcome / eligibility / submission / external refs | pass |
| 6 引用完整性与受控派生 | done | Ref / gap / report / freshness / authority states | pass |
| 状态传播 / 停审 / 跨状态审计 | done | Propagation graph、allowed / forbidden、owner audit | pass |

## 2. SOP 问题回答

1. 本仓存在多个正式状态族，而非单一全仓状态机：contract lifecycle、definition revision、Binding relation、invocation admission、execution requirement / assessment / handoff、outcome、safe handoff、reference / gap、derived freshness。
2. 只有本地 truth / relation / judgment 满足其正常状态且适用外部 assessment 为可验证时，受影响路径才能继续；外部状态 `unknown`、`unverifiable` 或 blocked 不得视为允许。
3. 持久状态触发动作均来自 Step 7 Command / Consumer / Job，并沿 Step 8 flow；Query 永不触发状态迁移。
4. 允许迁移只覆盖生命周期、正式重入和可重建派生；assessment、snapshot、attempt、outcome、audit 多数以新事实替代原地迁移。
5. Core truth / relation / outcome 变化可使 read view / projection stale，并在安全门禁后形成 event material；外围状态变化只形成新 ref / gap，不反写核心。
6. 所有状态归属 Step 6 对象；同名 `stale` / `unverifiable` / `unavailable` 必须保留对象限定语义。
7. 每个迁移触发均能回指 Step 7 / 8；没有新增接口或 flow。
8. 近义状态不合并：admission rejected、authorization accepted-deny、handoff blocked、outcome no-execution、submission route-blocked、external unknown 分属不同 owner 与时点。
9. 六个组成部分逐项停审后再做跨状态传播和禁止迁移审计。

## 3. 状态类型与更新纪律

| 状态类型 | 典型对象 | 更新纪律 | 禁止解释 |
|---|---|---|---|
| 本地生命周期 | `ToolContract`;`CapabilityBinding`;`ExecutionHandoff`;`ConsistencyGap` | 只由 owning Command 显式迁移，历史另行保留。 | 不由 Query、Job 或 external feedback 直接修改。 |
| 不可变 revision / terminal truth | `FormalToolDefinition`;`ToolInvocationOutcome`;`SafeHandoffMaterial`;`ToolAuditEntry` | 形成后不原地改写；语义变化产生新 revision / fact。 | 不由迟到材料、delivery 或 observation 覆盖。 |
| 消费时点评估 / snapshot | `CapabilityBindingAssessment`;`AuthorizationConsumptionAssessment`;`ExecutionSourceAssessment`;external snapshots | 每次消费形成新对象 / 新状态事实；旧对象保留当时解释。 | 不把后到来源变化写回历史调用。 |
| Append-only attempt | `ExecutionHandoffAttempt`;`ExternalSubmissionAttempt` | 每次尝试形成新 fact；外部反馈另建 ref / snapshot。 | 不把 local attempt 原地改成 accepted / delivered / observed。 |
| External ref 状态 | Hub / authorization / Sandbox / Bus / Observation refs | 新验证结果形成新 assessment / ref state 与 gap；不拥有外部 lifecycle。 | `resolved` 不等于外部业务成功。 |
| 可重建派生 freshness | Search / diff / diagnostic / guidance / report | Job 可标 stale / rebuilding / unavailable 或替换投影。 | 派生状态不定义核心 subject 状态。 |

## 4. 状态族总览

| 主要组成部分 | 状态族 | 正常主线条件 | 关键触发 |
|---|---|---|---|
| 工具合同与演进 | Contract lifecycle、definition revision、compatibility assessment、source ref | Active contract + current definition + usable source basis | Establish / assess / adopt / retire flows |
| Binding 与受控来源 | Relation、assessment、Hub ref / snapshot | Explicit-unbound，或 bound-active + valid assessment | Binding Commands、Hub clue / consistency check |
| 规范调用与受理 | Context sufficiency、admission、terminal reject propagation | Canonical invocation + admitted / awaiting applicable precondition | `SubmitToolInvocation` |
| 执行前置与条件交接 | Requirement classification、authorization assessment、readiness、handoff、attempt | All applicable preconditions verifiable + eligible handoff | Precondition / handoff flows |
| Outcome、审计与安全交接 | Source assessment、outcome terminal class、safe eligibility、submission、external refs | Terminal outcome + explainable audit；external handoff optional / post-truth | Source / outcome / safe handoff / feedback flows |
| 引用完整性与受控派生 | Ref assessment、gap lifecycle、report / projection freshness、Core authority | Core path uses valid required refs；peripheral views may degrade | Integrity / gap resolution / rebuild flows |

## 5. 工具合同与演进状态

### 5.1 状态定义表

| 对象 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `ToolContract::active` | Stable identity 与 current definition 正式成立。 | 是 | 仍需 invocation 时点验证适用 definition / Binding。 |
| `ToolContract::retirement_pending` | 已提出正式退役，但影响尚未收口。 | 受限 | 新 invocation 默认不应穿越待收口边界，具体 guard 留 03。 |
| `ToolContract::retired` | 合同已正式退役。 | 否 | 历史读取保留，禁止新 invocation。 |
| `FormalToolDefinition::current` | 由 contract 指向的当前 revision。 | 是 | 只对新 invocation 生效。 |
| `FormalToolDefinition::superseded` | 已被新 revision 替代。 | 否（新调用） | 可解释历史 invocation。 |
| `FormalToolDefinition::withdrawn` | Revision 被正式撤回。 | 否 | 不能重新成为 current；更正产生新 revision。 |
| `ToolCompatibilityImpact::compatible` | 当前证据支持演进。 | 是 | 仍需正式 adopt Command。 |
| `ToolCompatibilityImpact::conditionally_compatible` | 需迁移 / 重评后才可采用。 | 受限 | 不自动 adopt。 |
| `ToolCompatibilityImpact::incompatible` | 会破坏既有正式消费语义。 | 否 | 阻止 adoption。 |
| `ToolCompatibilityImpact::unverifiable` | 来源 / 消费影响不足。 | 否 | Fail closed，不默认为 compatible。 |
| `DefinitionSourceRef::resolved` | Authority / source revision 可验证。 | 是 | 仅说明 source ref 可消费。 |
| `DefinitionSourceRef::stale / conflicting / unverifiable` | 来源陈旧、冲突或不可验证。 | 否（新 formalization） | 既有 definition 不被原地改写；形成新 gap / assessment。 |

### 5.2 状态流转图

```text
<none>
  | EstablishToolContract
  v
ToolContract::active + Definition::current
  | AssessToolDefinitionChange
  +----------------------> CompatibilityImpact::<assessment fact>
  | AdoptToolDefinitionRevision when compatible / resolved
  v
old Definition::superseded + new Definition::current
  | RetireToolContract request
  v
ToolContract::retirement_pending
  | formal impact closure
  v
ToolContract::retired
```

关键说明：

- Compatibility impact 是 append-only assessment，不是 contract lifecycle state。
- Revision adoption 同时推进 old / new definition status 与 contract current pointer，但历史 revision 不删除。
- Source ref stale / conflict 只阻止新的 formalization / adoption，不穿越改写旧 invocation。

### 5.3 允许迁移

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `ToolContract` | `none -> active` | `EstablishToolContract` |
| `ToolContract` | `active -> retirement_pending -> retired` | `RetireToolContract` 及正式收口 |
| `FormalToolDefinition` | `candidate -> current` | Establish / adopt flow |
| `FormalToolDefinition` | `current -> superseded` | `AdoptToolDefinitionRevision` |
| `FormalToolDefinition` | `current / candidate -> withdrawn` | Formal correction / withdrawal boundary，03 细化入口 |
| `DefinitionSourceRef` | 新 `resolved -> stale / conflicting / unverifiable` observation | Hub / Core / source change clue 与 integrity flow；形成新事实，不改历史消费时点 |

### 5.4 禁止迁移

- 禁止 `retired -> active` 原地复活；需要新 Tool identity / contract 还是新 revision 由正式需求与 03 明确，不能默认。
- 禁止 `superseded / withdrawn -> current` 原地回滚；必须形成新正式 revision 与 impact fact。
- 禁止 `incompatible / unverifiable -> adopted` 绕过正式兼容收口。
- 禁止 search / diff / diagnostic / Job 触发 current pointer 变化。
- 禁止 source ref stale / conflict 删除或改写既有 definition / invocation history。

本部分停审：状态 owner、触发接口、current / history 和 source-time anchor 清晰；无 implementation / Hub / provider 状态混入，pass。

## 6. Capability Binding 与受控来源状态

### 6.1 状态定义表

| 对象 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `CapabilityBinding::bound_active` | 正式 bound relation 成立。 | 受限 | 必须有本次消费可用的 valid assessment。 |
| `CapabilityBinding::explicit_unbound` | 正式声明不依赖 Hub capability relation。 | 是 | 不由空 ref 推断。 |
| `CapabilityBinding::replacement_pending` | 正式替换意图已提出。 | 受限 | Current relation 仍按旧事实解释，新的受影响调用需保守判断。 |
| `CapabilityBinding::invalidated` | Relation 已正式失效。 | 否 | 历史保留，不回退 local registry。 |
| `CapabilityBindingAssessment::valid` | 本次消费时点 relation / source 可验证。 | 是 | 仅对锚定的消费语境成立。 |
| `CapabilityBindingAssessment::stale / conflicting / missing / unverifiable` | 当前来源不能支持 bound consumption。 | 否 | 受影响路径 fail closed。 |
| `HubControlledSnapshot::current_at_consumption` | 快照在原消费时点可验证。 | 是 | 后到变化不改原事实。 |
| `HubControlledSnapshot::stale_detected / conflict_detected / source_unavailable` | 新检测发现陈旧、冲突或来源不可用。 | 否（新消费） | 形成新 assessment / gap。 |
| `HubCapabilityRef::resolved` | Authority / identity / revision 可验证。 | 是 | 不等于 authorization。 |
| `HubCapabilityRef::stale / conflicting / unverifiable` | Ref 不足以支撑当前 bound path。 | 否 | 不得 fallback inventory / string match。 |

### 6.2 状态流转图

```text
<none>
  | DeclareCapabilityBinding(bound)
  v
CapabilityBinding::bound_active
  | consumption-time assessment
  +--> Assessment::valid ----------------> invocation may continue
  +--> Assessment::stale/conflicting/
       missing/unverifiable -------------> fail closed + gap
  |
  | ReplaceCapabilityBinding
  v
CapabilityBinding::replacement_pending
  | formal replacement closure
  v
CapabilityBinding::bound_active (new relation fact)
  | InvalidateCapabilityBinding
  v
CapabilityBinding::invalidated

<none> -- DeclareCapabilityBinding(unbound) --> explicit_unbound
```

关键说明：

- `explicit_unbound` 与 `bound_active` 是互斥正式分类；缺少 Hub ref 不自动迁移为 unbound。
- Assessment / snapshot 是时点事实，新检测结果追加而不是覆盖旧 invocation anchor。
- Relation change 与 source change 分离；Hub clue / Job 不能迁移 relation lifecycle。

### 6.3 允许迁移

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `CapabilityBinding` | `none -> bound_active` | `DeclareCapabilityBinding` with resolved ref |
| `CapabilityBinding` | `none -> explicit_unbound` | `DeclareCapabilityBinding` with formal classification reason |
| `CapabilityBinding` | `bound_active / explicit_unbound -> replacement_pending -> bound_active / explicit_unbound` | `ReplaceCapabilityBinding` formal closure |
| `CapabilityBinding` | `bound_active / explicit_unbound / replacement_pending -> invalidated` | `InvalidateCapabilityBinding` |
| Assessment / snapshot / ref | 新时点形成 valid / stale / conflict / missing / unverifiable fact | Hub clue / consistency flow / current consumption |

### 6.4 禁止迁移

- 禁止 `invalidated -> bound_active / explicit_unbound` 原地恢复；需新正式 relation / replacement 语义。
- 禁止空 `HubCapabilityRef`、字符串名称或 inventory 命中触发 `explicit_unbound` 或 `valid`。
- 禁止 Hub visibility / exposure / applicability 触发 authorization allow 状态。
- 禁止 Job / Consumer 从 stale / conflict 自动替换 / 修复 Binding。
- 禁止新 Hub snapshot 原地覆盖历史 invocation 绑定的 assessment / snapshot。

本部分停审：Relation、assessment、snapshot / ref 的 owner 与时点分开；触发动作已在 Step 7/8，pass。

## 7. 规范调用与受理状态

### 7.1 状态定义表

| 对象 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `InvocationContextRefs::sufficient` | 必需 caller / correlation refs 在建立时点可解释。 | 是 | 不表示调用已受理。 |
| `InvocationContextRefs::degraded` | 非关键引用存在 gap，仍能解释当前允许路径。 | 受限 | Gap 必须可见。 |
| `InvocationContextRefs::insufficient` | 必需 refs 缺失或含 forbidden body。 | 否 | Invocation 不得进入执行。 |
| `InvocationAdmission::admitted` | 合同内调用可继续执行前置 / carrier 判断。 | 是 | 不表示授权或执行完成。 |
| `InvocationAdmission::awaiting_precondition` | 调用已受理但需适用 authorization / Sandbox 前置。 | 受限 | 只能进入部分 4。 |
| `InvocationAdmission::rejected` | 合同 / relation / context 不满足，真实执行不得发生。 | 否 | 触发 no-execution outcome。 |
| `InvocationAdmission::unavailable` | 合同或必要正式来源当前不可用。 | 否 | 触发 no-execution unavailable。 |

`ToolInvocation` 本身是已建立的 canonical truth，不设置 running / completed 状态；其后续可消费语义由 admission、precondition 和 outcome 独立对象承载。

### 7.2 状态流转图

```text
<FormalInvocationIntent>
  | SubmitToolInvocation / canonicalize
  v
ToolInvocation + InvocationContextRefs
  |
  +-- insufficient ------------------> Admission::rejected
  |
  +-- contract/source unavailable ---> Admission::unavailable
  |
  +-- applicable preconditions ------> Admission::awaiting_precondition
  |
  +-- no additional precondition ----> Admission::admitted

Admission::rejected / unavailable
  | same SubmitToolInvocation flow
  v
ToolInvocationOutcome::no_execution_* + ToolAuditEntry
```

关键说明：

- Admission 是一次执行前 decision fact；形成后不因后续前置或执行材料原地改为其他状态。
- `awaiting_precondition` 不表示后台等待队列或 Runtime checkpoint，只表示 L2 下一判断边界。
- No-execution outcome 是另一对象的 terminal fact，与 admission 通过 basis ref 关联。

### 7.3 允许迁移 / 新事实形成

| 对象 | 允许动作 | 触发 |
|---|---|---|
| `InvocationContextRefs` | Establish as sufficient / degraded / insufficient | `SubmitToolInvocation` |
| `InvocationAdmission` | Establish as admitted / awaiting-precondition / rejected / unavailable | `SubmitToolInvocation` |
| `ToolInvocationOutcome` | From rejected / unavailable admission create no-execution terminal fact | 同一原子 reject branch |

### 7.4 禁止迁移

- 禁止 `rejected / unavailable -> admitted` 原地翻转；新的正式意图形成新 invocation / admission。
- 禁止 `awaiting_precondition -> admitted` 通过修改原 admission；前置结果另建 requirement / assessment / handoff facts。
- 禁止 execution source、Sandbox run 或 external feedback 反推 admission 状态。
- 禁止将 Runtime waiting / retry / checkpoint 映射为 invocation admission 状态。

本部分停审：Canonical truth、context sufficiency、admission 与 no-execution outcome 分层，触发只来自 `SubmitToolInvocation`，pass。

## 8. 执行前置与条件交接状态

### 8.1 状态定义表

| 对象 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `ExecutionRequirement::requirements_satisfied_without_governance` | 不要求 authorization，仍需适用 carrier checks。 | 是 | 不表示真实执行已开始。 |
| `ExecutionRequirement::authorization_required` | 必须消费正式 authorization result。 | 受限 | Owner / source blocked 时 fail closed。 |
| `ExecutionRequirement::sandbox_required` | 必须经 Sandbox isolation seam。 | 受限 | Mapping / readiness 必须可验证。 |
| `ExecutionRequirement::authorization_and_sandbox_required` | 两类前置均必需。 | 受限 | 任一不满足即 no-execution。 |
| `ExecutionRequirement::unsupported` | 当前合同无法表达 / 满足承载要求。 | 否 | 不得私换 carrier。 |
| `AuthorizationConsumptionAssessment::accepted_allow` | 正式来源可验证且允许继续。 | 是 | 只表示本次 result 可消费。 |
| `AuthorizationConsumptionAssessment::accepted_constrained` | 允许继续但有适用约束。 | 受限 | 约束必须由 handoff evaluation 验证。 |
| `AuthorizationConsumptionAssessment::accepted_deny` | 正式来源可验证且要求 no-execution。 | 否 | 不等于 admission rejected；这是外部结果消费事实。 |
| `AuthorizationConsumptionAssessment::missing / stale / conflicting / unverifiable` | 结果不可用于本次 governed invocation。 | 否 | Fail closed。 |
| `SandboxReadinessSnapshot::eligible_source_available` | 有正式安全来源可用于 L2 前置评估。 | 受限 | 不等于 Sandbox ready / accepted。 |
| `SandboxReadinessSnapshot::mapping_blocked / stale / conflicting / unavailable` | Mapping 或来源条件不成立。 | 否 | 禁止正向 handoff / 宿主直跑。 |
| `ExecutionHandoff::preparing` | L2 正在验证前置与最小语境。 | 否 | 尚不能调用 execution port。 |
| `ExecutionHandoff::eligible` | L2 判断适用前置满足。 | 是（交接） | 不等于 external accepted。 |
| `ExecutionHandoff::blocked` | 本地前置、mapping 或 carrier gap 阻止交接。 | 否 | 形成 no-execution / gap。 |
| `ExecutionHandoff::invalidated` | 交接前发现 anchor / snapshot 已不适用。 | 否 | 需新 handoff context。 |
| `ExecutionHandoffAttempt::attempted` | L2 已调用 execution port。 | 不适用 | 只描述 local attempt。 |
| `ExecutionHandoffAttempt::locally_failed / carrier_unavailable / blocked_gap` | Local boundary 失败或开放合同阻断。 | 否 | 不拥有外部 run lifecycle。 |

### 8.2 状态流转图

```text
Admission::awaiting_precondition / admitted
  | EvaluateExecutionPreconditions
  v
ExecutionRequirement::<classification>
  |
  +-- authorization required --> AuthorizationAssessment
  |      +-- accepted_allow / constrained --> continue
  |      +-- accepted_deny / missing / stale /
  |          conflict / unverifiable -------> no-execution outcome
  |
  +-- sandbox required --> SandboxReadinessSnapshot
         +-- eligible source + formal mapping --> Handoff::eligible
         +-- mapping_blocked / stale / conflict /
             unavailable --------------------> Handoff::blocked

Handoff::eligible
  | PrepareExecutionHandoff / port call
  v
ExecutionHandoffAttempt::attempted
  (external accepted / run / receipt are not L2 states)
```

关键说明：

- Requirement classification、authorization assessment、Sandbox snapshot 与 handoff lifecycle 是四个不同状态族。
- `accepted_deny` 与 `Handoff::blocked` 都导致 no-execution，但 owner / reason / timing 不同。
- Attempt 形成后不迁移为 Sandbox accepted / running / completed；未来 external receipt 另建 ref。

### 8.3 允许迁移 / 新事实形成

| 对象 | 允许动作 | 触发 |
|---|---|---|
| `ExecutionRequirement` | Establish one classification fact | `EvaluateExecutionPreconditions` |
| Authorization assessment | Establish accepted-allow / constrained / deny / conservative state | 同步 result consumption / fail-closed |
| `ExecutionHandoff` | `preparing -> eligible / blocked / invalidated` | `PrepareExecutionHandoff` |
| `ExecutionHandoffAttempt` | Append attempted / locally-failed / carrier-unavailable / blocked-gap fact | Port call or blocked branch |
| `ToolInvocationOutcome` | Append no-execution fact for deny / conservative / blocked branch | Precondition / handoff flow |

### 8.4 禁止迁移

- 禁止 missing / stale / conflict / unverifiable authorization assessment 迁移为 allow，除非新正式 result 形成新的 assessment。
- 禁止 `mapping_blocked / unavailable -> eligible_source_available` 原地覆盖历史 snapshot；新消费形成新 snapshot。
- 禁止 `Handoff::blocked / invalidated -> eligible` 原地恢复；需新 context / assessment refs。
- 禁止 `ExecutionHandoffAttempt::attempted -> accepted / running / completed / receipt`。
- 禁止 Sandbox-required path 从 blocked 分支迁移为 host direct execution。
- 禁止 `accepted_allow` 被理解为 L2 self-authorization 或整体 execution ready。

本部分停审：Requirement、external result consumption、readiness、handoff 与 local attempt 分权；blocked seams / fail-closed 状态完整，pass。

## 9. Outcome、审计与安全交接状态

### 9.1 状态定义表

| 对象 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `ExecutionSourceAssessment::accepted` | Source authority / correlation / mapping 可支持归一化。 | 是 | 只对本次消费成立。 |
| `ExecutionSourceAssessment::rejected / missing / conflicting / unverifiable / mapping_blocked` | Source 不足以形成可信 outcome。 | 否 | 保留 assessment / gap，不伪造终态。 |
| `ToolInvocationOutcome::succeeded` | 可信 source 形成 normalized result。 | 终态 | 可进入 audit / safe handoff。 |
| `ToolInvocationOutcome::tool_failed` | 工具语义失败。 | 终态 | 与 execution failure 分开。 |
| `ToolInvocationOutcome::execution_failed` | 执行承载失败被映射为 normalized error。 | 终态 | 不等于 Sandbox failure body。 |
| `ToolInvocationOutcome::capture_failed` | 执行材料捕获失败。 | 终态 | 不伪造 result。 |
| `ToolInvocationOutcome::no_execution_rejected` | 执行前正式拒绝，真实执行未发生。 | 终态 | 回链 admission / authorization deny。 |
| `ToolInvocationOutcome::no_execution_unavailable` | 必要来源 / carrier 不可用，真实执行未发生。 | 终态 | 回链 conservative gap。 |
| `SafeHandoffEligibility::eligible` | 四项合取门禁全部通过。 | 是（可准备材料） | 只对 target class 成立。 |
| `SafeHandoffEligibility::ineligible / unverifiable` | 至少一项失败或无法证明。 | 否 | 不创建 material / attempt。 |
| `ExternalSubmissionAttempt::prepared` | Material 已准备，尚未调用 event port。 | 不适用 | Outcome / audit 已先成立。 |
| `ExternalSubmissionAttempt::submitted_locally` | L2 已调用 event port。 | 不适用 | 不等于 delivered / observed。 |
| `ExternalSubmissionAttempt::locally_failed / route_blocked / degraded` | 本地失败、route 未闭口或外部状态不可验证。 | 不适用 | 不回滚 outcome / audit。 |
| `BusDeliveryStatusRef::unknown / referenced / stale / conflicting / unverifiable` | 外部 Bus 状态引用的 L2 消费语义。 | 不适用 | `referenced` 不改变本地 submission。 |
| `ObservationMaterialRef::route_blocked / unknown / referenced / stale / conflicting / unverifiable` | Observability material / status 引用语义。 | 不适用 | 当前 route-blocked 为保守主态。 |

`ToolAuditEntry` 与 `SafeHandoffMaterial` 是 append-only / immutable 对象：形成后不定义可变 lifecycle；缺口另建 `ConsistencyGap`，新目标 / 内容另建 eligibility / material。

### 9.2 状态流转图

```text
SandboxExecutionSourceRef / safe summary
  | AcceptExecutionSource
  v
ExecutionSourceAssessment
  +-- rejected/missing/conflict/
  |   unverifiable/mapping_blocked --> gap; no fabricated outcome
  |
  +-- accepted --> ToolInvocationOutcome::<terminal class>
                       + ToolAuditEntry
                       |
                       | PrepareSafeExternalHandoff
                       v
                 SafeHandoffEligibility
                   +-- ineligible/unverifiable --> no submission + gap
                   +-- eligible --> SafeHandoffMaterial
                                        |
                                        v
                              ExternalSubmissionAttempt
                              prepared -> submitted_locally
                                     or locally_failed/
                                        route_blocked/degraded

External feedback --> BusDeliveryStatusRef / ObservationMaterialRef
                     (never transitions ToolInvocationOutcome)
```

关键说明：

- `ToolInvocationOutcome` 每个 invocation 只有一个 L2 terminal semantic fact；新外部材料不能原地改变它。
- Tool audit 与 outcome 同边界收口；safe handoff 是 post-truth 可选路径。
- External submission 和 feedback 状态独立于本地终态，且 Bus / Observability refs 不互相替代。

### 9.3 允许迁移 / 新事实形成

| 对象 | 允许动作 | 触发 |
|---|---|---|
| Source assessment | Establish accepted / conservative source fact | `AcceptExecutionSource` |
| `ToolInvocationOutcome` | Establish exactly one terminal class | Source acceptance or earlier no-execution branch |
| `ToolAuditEntry` | Append audit alongside outcome; append explicit gap fact if needed | Outcome / audit flow |
| Safe eligibility | Establish eligible / ineligible / unverifiable per target | `PrepareSafeExternalHandoff` |
| `ExternalSubmissionAttempt` | `prepared -> submitted_locally / locally_failed / route_blocked / degraded` | Event port flow |
| External status refs | Append unknown / referenced / stale / conflict / unverifiable ref per feedback consumption time | Feedback Consumer / refresh Job |

### 9.4 禁止迁移

- 禁止任何 terminal `ToolInvocationOutcome` 迁移为另一 terminal class；纠错语义需在 03 定义显式 correction fact，不得覆盖。
- 禁止 source `rejected / missing / conflict / unverifiable / mapping_blocked -> accepted` 原地翻转；新 source / mapping 形成新 assessment。
- 禁止 `ineligible / unverifiable -> eligible` 原地修改；新目标 / 安全材料形成新 eligibility。
- 禁止 `submitted_locally -> delivered / observed / accepted`；外部状态另建 refs。
- 禁止 Bus delivery / Observability observation 修改 outcome、audit、admission、handoff 或驱动 Runtime recovery。
- 禁止 delivery ref 与 observation ref 合并为 single external-success state。
- 禁止 raw / secret body 通过任何 eligibility / material 状态进入 event collaboration。

本部分停审：Source、terminal outcome、audit、safe eligibility、local submission 与 external refs 状态分层完整；local-truth-first 成立，pass。

## 10. 引用完整性与受控派生状态

### 10.1 状态定义表

| 对象 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `ReferenceValidityAssessment::valid` | Ref 在指定时点可验证。 | 是（适用路径） | 只对本次 assessment scope 成立。 |
| `ReferenceValidityAssessment::stale / conflicting / missing / unverifiable` | Ref 不足以支持受影响消费。 | 否 / 受限 | 依 impact fail closed 或 peripheral degrade。 |
| `ConsistencyGap::open` | 已知缺口当前成立。 | 依 impact | Core-blocking gap 禁止受影响路径；peripheral gap 只降级。 |
| `ConsistencyGap::resolution_pending` | 有正式闭口线索，尚未验证 subject 已经由 owner 修复。 | 否（关闭判断） | 不等于 resolved。 |
| `ConsistencyGap::resolved` | Subject 已通过正式 owner boundary 修复并验证。 | 是 | 历史 gap 保留。 |
| `ConsistencyGap::superseded` | 被更准确 gap fact 替代。 | 不适用 | 不删除历史。 |
| `ReferenceConsistencyReport::current / partial / stale / failed` | 报告覆盖、部分、陈旧或生成失败。 | 不适用 | Report 不定义 subject 状态。 |
| Derived projection `fresh` | 覆盖声明 truth watermark。 | 是（派生读） | 不表示核心 truth 新状态。 |
| Derived projection `stale` | 落后于核心 truth。 | 受限 | 可返回 stale surface / stable truth ref。 |
| Derived projection `rebuilding` | 正在重建。 | 受限 | 不阻塞核心。 |
| Derived projection `unavailable / failed` | 暂不可读或生成失败。 | 否（派生读） | 不 fallback inventory / allowlist。 |
| `SharedContractAuthorityRef::resolved` | Core 中存在可引用正式 contract authority。 | 是 | 才允许具体 compile ref。 |
| `SharedContractAuthorityRef::candidate_only / missing / conflicting / unverifiable` | Tools-specific authority 未正式闭口或冲突。 | 否（受影响 contract） | `L2T-UP-008` 继续开放。 |

### 10.2 状态流转图

```text
Typed refs + expected authorities
  | CheckReferenceIntegrity
  v
ReferenceValidityAssessment::<state>
  +-- valid --------------------------> report current/partial
  +-- stale/conflict/missing/
      unverifiable --> ConsistencyGap::open
                           |
                           | formal subject-owner repair completed
                           v
                     resolution_pending
                           |
                           | RecordConsistencyGapResolution verifies evidence
                           v
                       resolved

Core truth change --> projection stale
projection stale -- RebuildToolDerivedViews --> rebuilding --> fresh
                                       +-- failure -------> unavailable/failed
```

关键说明：

- Gap resolution 只关闭 gap，不修 subject；subject 必须先经自身正式 owner flow 修复。
- Projection freshness 可反复重建，但不会推动 contract / Binding / outcome 状态迁移。
- Core authority `candidate_only` 是设计状态，不得在 03 前润色成 resolved package / type。

### 10.3 允许迁移 / 新事实形成

| 对象 | 允许动作 | 触发 |
|---|---|---|
| Ref assessment | Append valid / stale / conflict / missing / unverifiable fact | Integrity Job / consumption flow |
| `ConsistencyGap` | `open -> resolution_pending -> resolved` | Formal owner repair clue + gap resolution Command |
| `ConsistencyGap` | `open / resolution_pending -> superseded` | New more precise gap fact |
| Reports | `current -> stale`;build -> current / partial / failed | Truth watermark change / integrity Job |
| Projections | `fresh -> stale -> rebuilding -> fresh`;`rebuilding -> unavailable / failed` | Core truth change / rebuild Job |
| Shared authority ref | New candidate / resolved / missing / conflict / unverifiable assessment | Core formal contract change / integrity flow |

### 10.4 禁止迁移

- 禁止 `open -> resolved` 仅凭文本说明、猜测 commit / run_id、伪 evidence alias 或验收签署。
- 禁止 integrity Job / report 自动修改 subject truth 或 external ref body。
- 禁止 projection `fresh` 反推 contract / Binding / outcome 为 valid / successful。
- 禁止 projection unavailable 触发 local registry / allowlist / old cache fallback。
- 禁止 Core authority `candidate_only / missing / unverifiable -> resolved` 由 L2 私造 package / type。
- 禁止 SDK consumer guidance / state 进入本仓 status truth；SDK seam 仍 future / excluded。

本部分停审：Reference assessment、gap lifecycle、report / projection freshness 和 Core authority 状态分权；formal re-entry 与 no-write 完整，pass。

## 11. 全局状态传播关系

#### 状态传播关系图

```text
ToolContract::active + FormalToolDefinition::current
  + CapabilityBinding::<formal relation>
  + consumption-time source / relation assessments
  |
  | SubmitToolInvocation
  v
ToolInvocation + InvocationAdmission::<decision fact>
  |
  +-- rejected / unavailable ------------------------------+
  |                                                        |
  +-- admitted / awaiting_precondition                     |
       |                                                   |
       v                                                   |
ExecutionRequirement + applicable external assessments     |
       |                                                   |
       +-- deny / unverifiable / blocked ------------------+
       |                                                   |
       v                                                   |
ExecutionHandoff::eligible                                 |
       | PrepareExecutionHandoff                           |
       v                                                   |
ExecutionHandoffAttempt::<local attempt>                   |
       |                                                   |
       | later formal execution source                     |
       v                                                   v
ExecutionSourceAssessment ---------------------> ToolInvocationOutcome::<terminal>
                                                    + ToolAuditEntry
                                                    |
                                                    | optional post-truth path
                                                    v
                                           SafeHandoffEligibility
                                                    |
                                                    v
                                           ExternalSubmissionAttempt
                                                    |
                                                    v
                                      BusDeliveryStatusRef / ObservationMaterialRef

Any typed-ref problem ---> ReferenceValidityAssessment ---> ConsistencyGap
Core truth watermark ---> derived projection stale ---> rebuilding ---> fresh / failed
```

关键说明：

- 该图表达多个 L2-owned 状态族之间的传播顺序，不构造跨 authorization、Sandbox、Bus 或 Observability 的统一事务或统一状态机。
- `ToolInvocationOutcome` 与 `ToolAuditEntry` 先于可选的安全外发成立；external submission、delivery 和 observation 均不能反向改写本地终态。
- 外部来源变化只产生新的 assessment、snapshot、ref 或 gap；既有 invocation 始终保留建立时的 contract / definition / Binding anchor。
- 派生 freshness 只影响 search、diff、diagnostic、guidance 和 report 的可读性，不影响 core truth 的有效性。
- 图中的正向 execution source 路径仍受 `L2T-UP-001~006` 约束；逻辑存在不表示 schema、mapping、route、receipt 或 readiness 已闭口。

## 12. 全局允许迁移清单

| 状态族 | 允许的核心迁移 / 新事实形成 | 唯一合法触发边界 |
|---|---|---|
| Contract lifecycle | `none -> active -> retirement_pending -> retired` | Establish / retire formal Command flow |
| Definition revision | `candidate -> current -> superseded`;candidate / current 可正式 withdrawal | Establish / adopt / correction formal Command flow |
| Binding relation | `none -> bound_active / explicit_unbound`;active classification `-> replacement_pending ->` new formal relation;active `-> invalidated` | Binding owning Commands |
| Invocation context / admission | 每个 invocation 建立一组 immutable sufficiency 与 admission decision fact | `SubmitToolInvocation` |
| Requirement / external assessment | 每次适用消费建立新的 classification、assessment 和 snapshot | Precondition Command or validated clue / check flow |
| Execution handoff | `preparing -> eligible / blocked / invalidated`;每次 port call append local attempt | `PrepareExecutionHandoff` |
| Source / outcome / audit | 每个可信 source 建 assessment；每个 invocation 恰有一个 terminal outcome，并同边界追加 audit | `AcceptExecutionSource` 或早期 no-execution owning branch |
| Safe external handoff | 每个 target 新建 eligibility / material；`prepared -> submitted_locally / locally_failed / route_blocked / degraded` | `PrepareSafeExternalHandoff` |
| External status refs | 每次正式 feedback 消费追加 unknown / referenced / stale / conflict / unverifiable ref | Feedback Consumer / conditional refresh Job |
| Gap lifecycle | `open -> resolution_pending -> resolved`;open / pending `-> superseded` | Subject owner 先修复，再经 gap resolution Command 验证 |
| Report / projection freshness | `fresh/current -> stale -> rebuilding -> fresh/current`;build 可到 partial / unavailable / failed | Truth watermark 与 Operations Job |

这里的“新事实形成”与“状态迁移”刻意分开：assessment、snapshot、attempt、outcome、audit 和 external ref 不能因新材料到达而原地改写。

## 13. 全局禁止迁移红线

1. 禁止 `retired -> active`、`invalidated -> active`、`superseded / withdrawn -> current` 原地复活；需要新的正式 identity、revision 或 relation fact。
2. 禁止 `rejected / unavailable admission -> admitted`，也禁止用后续 authorization、Sandbox 或 execution 材料反推受理结果。
3. 禁止 `accepted_deny / missing / stale / conflicting / unverifiable authorization assessment -> allow` 原地翻转；新 result 必须形成新 assessment。
4. 禁止 Sandbox-required 路径从 mapping blocked、readiness unavailable 或 handoff blocked 迁移为 host direct execution。
5. 禁止 `ExecutionHandoffAttempt::attempted -> Sandbox accepted / running / completed / receipt`。
6. 禁止 source assessment 的 conservative 状态原地变为 accepted；新 source / mapping 形成新 assessment。
7. 禁止任一 terminal `ToolInvocationOutcome` 迁移为另一 terminal class；迟到、重复或冲突材料只能形成 assessment / gap / future correction fact。
8. 禁止 `ExternalSubmissionAttempt::submitted_locally -> delivered / observed / accepted`；Bus 与 Observability 分别保留自己的 ref。
9. 禁止 external delivery / observation 修改 contract、Binding、admission、outcome、audit、handoff或触发 Runtime recovery。
10. 禁止 Query、Consumer clue、integrity / rebuild / refresh Job 直接修改 core subject truth；修复必须重入 owning Command。
11. 禁止 projection `fresh`、search 命中、diagnostic healthy 或 guidance available 反推 core truth / authorization / execution success。
12. 禁止缺 ref、字符串匹配、inventory / allowlist 命中或旧 cache 触发 explicit-unbound、authorization allow、Sandbox bypass 或 fallback execution。
13. 禁止用配置开关放宽 forbidden-body、安全外发四项合取、formal re-entry、local-truth-first 或 owner 分权。
14. 禁止将 `candidate_only`、logical port、event skeleton、unknown external status 或开放 blocker 润色为 schema / route / provider / client / readiness 已存在。

## 14. 六组成部分状态归属与停审

| 组成部分 | Own 的正式状态 / 事实 | 只消费或引用的外部状态 | 触发覆盖 | 状态传播口径 | 停审 |
|---|---|---|---|---|---|
| 工具合同与演进 | Contract lifecycle、definition revision、compatibility / evolution facts | Definition source、Core authority ref | Establish / assess / adopt / retire flows | Core change 使相关 Binding assessment / projections stale，但不改历史 invocation | pass |
| Binding 与受控来源 | Relation lifecycle、binding assessment、change fact | Hub ref / snapshot | Binding Commands、Hub clue、consistency Job | Relation change影响新 invocation admission；旧 anchor 不回写 | pass |
| 规范调用与受理 | Context sufficiency、admission、canonical anchor | Caller / work / trace refs | Submit invocation flow | Reject / unavailable 同边界形成 no-execution outcome；不制造 execution attempt | pass |
| 执行前置与条件交接 | Requirement、authorization consumption assessment、handoff、local attempt | Authorization result、Sandbox readiness | Precondition / handoff flows | Fail-closed 形成 no-execution；eligible 仅允许本地 port attempt | pass |
| Outcome、审计与安全交接 | Source assessment、terminal outcome、audit、eligibility、material、submission attempt | Sandbox source、Bus delivery、Observation refs | Source / outcome、safe handoff、feedback flows | Local outcome / audit first；外围只追加 ref / gap | pass |
| 引用完整性与受控派生 | Ref assessment、gap lifecycle、report / projection freshness | 所有 typed external authority refs | Integrity / rebuild / refresh Jobs 与 gap resolution Command | 核心变化使派生 stale；检测与派生不得修 subject | pass |

六部分均满足：状态归属于 Step 6 对象，触发接口 / 流存在于 Step 7 / 8，允许与禁止迁移明确，跨部分传播不取得相邻 owner 写权。

## 15. 跨状态一致性审计

### 15.1 近义状态语义审计

| 近义状态 | Owner / 时点 | 不可合并原因 | 审计结论 |
|---|---|---|---|
| Admission `rejected` | L2 受理时 | 合同、Binding 或 context 不满足 | 独立保留，pass |
| Authorization `accepted_deny` | 正式结果消费时 | 外部 owner 的 deny 被 L2 验证消费 | 不等于 self-reject，pass |
| Handoff `blocked` | 执行交接准备时 | Carrier、mapping 或适用前置不足 | 不等于 admission，pass |
| Outcome `no_execution_*` | L2 terminal truth | 汇总“真实执行未发生”的消费者语义 | 通过 basis ref 回链而不吞并原因，pass |
| Submission `route_blocked` | Outcome 后外发时 | 只影响外围材料交接 | 不回滚 outcome，pass |
| External ref `unknown / unverifiable` | Feedback 消费时 | L2 不拥有 delivery / observation truth | 两 owner ref 不合并，pass |
| Ref / projection `stale` | 指定 ref 或派生 view | 前者影响消费依据，后者只影响可重建读取 | 对象限定完整，pass |
| Source / carrier `unavailable` | 外部来源或 port 时点 | 不等于 contract unavailable 或 terminal tool failure | Reason / object-qualified，pass |

### 15.2 触发、写权与传播审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 状态触发覆盖 | pass | Step 8 §13 的 12 类状态主题均在 §5~§10 与允许迁移表有 owner flow。 |
| Command write owner | pass | Contract、Binding、invocation、precondition、handoff、outcome / audit、safe handoff、gap closure 分别只由 owning Command 改写。 |
| Query no-write | pass | Stable / derived Query 只返回 current / stale / rebuilding / unavailable / gap，不刷新或修复。 |
| Consumer clue no-write | pass | Consumer 只追加 typed ref、snapshot、assessment candidate 或 gap；核心变化 formal re-entry。 |
| Job no-write | pass | Job 只写 assessment、report、projection、gap 或 external status ref，不写 T1 / T2 subject truth。 |
| Local-truth-first | pass | Outcome / audit 成立不等待 Bus / Observability；外围失败不参与本地 commit。 |
| Projection propagation | pass | Core watermark 可使派生 stale；派生恢复不反推 core state。 |
| Historical anchor | pass | Contract / definition / Binding / external assessment 均保留 consumption-time anchor。 |
| Detailed-design handoff | pass | 03 仍需定义 enum / sum type、transition guard、transaction、idempotency、ordering、correction fact 与 persistence mapping。 |

### 15.3 迟到、重复、乱序与冲突材料审计

| 输入情况 | 当前状态处理 | 禁止行为 | 结果 |
|---|---|---|---|
| 迟到 Hub / authorization / Sandbox / feedback clue | 建新 ref / snapshot / assessment / gap，并绑定其消费时点 | 覆盖历史 invocation anchor 或 terminal outcome | pass |
| 重复 Command | 依 idempotency key 返回同一语义、显式冲突或正式新变化 | 重复推进 lifecycle / 创建第二 terminal outcome | pass |
| 重复 Consumer material | 依 source event / dedup identity 识别并保持历史 | 重复写核心或推断 delivered / observed | pass |
| 乱序 external revision / feedback | 形成 stale / conflict / unverifiable assessment | 自动采用旧 revision 或逆向迁移本地 truth | pass |
| 冲突 owner material | 建 explicit conflict gap，受影响路径 fail closed | 选择“更方便”的来源继续执行 | pass |
| 新证据证明旧判断有误 | 03 定义显式 correction / superseding fact 方向 | 原地改写 outcome、audit 或 assessment | pass |

### 15.4 Blocker 跨状态审计

| Blocker | 受影响状态 | 当前保守状态口径 | 未伪造事实 |
|---|---|---|---|
| `L2T-UP-001~002` authorization owner / taxonomy / result | Requirement、authorization assessment | Required 且来源未闭口时 missing / unverifiable，fail closed | 无 allow / deny schema、provider 或 policy truth |
| `L2T-UP-003~004` Sandbox mapping / receipt | Readiness、handoff、source assessment | mapping blocked / unavailable；local attempt 不等于 receipt | 无 generic mapping、accepted / run / receipt 状态 |
| `L2T-UP-005~006` Observability source / readiness | Observation ref、submission attempt | route blocked / unknown；不声明 observed | 无 producer enum、route、store 或 readiness |
| `L2T-UP-007` uncommitted workspace baseline | 全部来源 attribution | 只声明 current workspace input | 无冻结 commit 声明 |
| `L2T-UP-008` Core Tools shared contract | Shared authority ref | candidate-only / missing / unverifiable 时阻断具体 compile contract | 无 package / type / schema |
| `L2T-UP-009` SDK Tools client | Consumer guidance / downstream seam | Future consumer；不进入 L2 state machine | 无 client / compatibility ready 声明 |

结论：`L2T-UP-001~009` 不阻塞逻辑概要状态设计完成，但阻塞具体状态 schema、mapping、route、provider、client、readiness 和正向验收声明。

## 16. Historical pollution 审计

| 历史材料线索 | 若沿用会造成的问题 | 当前处理 | 结果 |
|---|---|---|---|
| `ToolHealth` / healthy-unhealthy 全局状态 | 把派生诊断、执行可用性和合同有效性合并 | 拆为 object-qualified assessment、gap 与 projection freshness | 未继承 |
| `available / unavailable` 单一工具状态 | 隐藏 contract、source、carrier、projection 等不同 owner | 所有 unavailable 必须带对象与时点 | 未继承 |
| retryable / non-retryable result | 将重试策略写进 terminal truth 并侵入 Runtime orchestration | Outcome 只表达工具消费者语义；重试 / recovery 留给 owner 和 03 | 未继承 |
| host / Sandbox running / completed | L2 冒领 execution lifecycle | 只保存 readiness、local handoff attempt、source ref / assessment | 未继承 |
| publish success = delivered / observed | 合并 L2 attempt、Bus delivery 和 Observability observation | 三层状态分离且外围不反写 | 未继承 |
| Job reconciliation 自动修复 | 派生维护成为第二核心写源 | Job 只检测 / 重建；修复 formal re-entry | 未继承 |
| Local registry / allowlist fallback | 缺少正式来源时制造有效 / allow 状态 | Required ref 不可验证时 fail closed | 未继承 |

## 17. Step 10 异常场景反查入口

Step 10 至少必须覆盖以下会改变主线分支但不得展开为错误码 / 重试实现的场景：

- Contract / definition / Binding source missing、stale、conflicting 或 unverifiable。
- Invocation context 不足、raw / secret body 混入、重复或幂等冲突。
- Authorization result 缺失、迟到、冲突、accepted-deny 或 constrained 条件不可验证。
- Sandbox-required 但 mapping / readiness / carrier / receipt seam 未闭口，及不得 host bypass。
- Execution source 重复、乱序、归属冲突、mapping blocked、capture failed 或无法形成可信 outcome。
- Terminal outcome 已存在后到达冲突材料。
- Audit 不能与 outcome 同边界收口。
- Safe handoff 不满足四项合取、route blocked、local submission 失败或 external feedback unknown。
- Integrity gap unresolved / fake evidence、projection stale / rebuild failed，以及外围退化不得阻塞核心。
- Core / SDK / upstream contract 仅 candidate / future，不能被解释为 implementation ready。

## 18. 正式 §9 回填草稿

正式第 9 章应按以下结构吸收本 Step，而不是复制全部中间审计：

1. 先声明 L2-tools 拥有多个对象限定状态族，不存在跨 authorization / Sandbox / Bus / Observability 的统一状态机。
2. 汇总 §4 的六类状态族和正常主线条件。
3. 保留一张全局状态传播图，并对 contract / Binding、invocation / admission、precondition / handoff、outcome / audit / external refs、gap / projection 各给必要的局部迁移说明。
4. 单列允许的核心迁移和 §13 的禁止迁移红线。
5. 明确 assessment / snapshot / attempt / outcome / audit 的 append-only 或 immutable 纪律，以及迟到材料处理。
6. 保留 `L2T-UP-001~009` 对受影响状态的保守口径，不写具体 enum、字段、错误码、表列或恢复实现。

## 19. Step 完成门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 正式状态与 owner 明确 | pass | 六部分状态均归属 Step 6 对象或明确 external ref。 |
| 触发接口 / 流完整 | pass | 所有迁移可回指 Step 7 / 8，无新增接口。 |
| 允许 / 禁止迁移完整 | pass | Lifecycle、immutable fact、assessment、attempt、external ref 与 projection 分型。 |
| 状态传播完整 | pass | Local truth、外部 ref、gap、派生投影传播方向清楚。 |
| 六部分逐项停审 | pass | 每部分状态、触发、传播和边界均无 unresolved 冲突。 |
| 跨状态近义词审计 | pass | Reject、deny、blocked、no-execution、route-blocked、unknown 等未合并。 |
| Query / Consumer / Job 写权审计 | pass | 非 owning flow 不反写核心。 |
| 迟到 / 重复 / 乱序审计 | pass | 新事实追加，不穿越改写历史。 |
| Blocker 诚实性 | pass | 开放 seam 保持 blocked / candidate / future。 |
| 历史污染审计 | pass | ToolHealth、host lifecycle、retryable、registry fallback 未回流。 |
| Step 10 可承接 | pass | 异常反查入口已建立。 |
| 详细设计越界 | pass | 未写 enum、状态列、错误码、重试、补偿或实现代码。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_10_exception_boundary_scenarios
formal_document_write_allowed = false
commit_required = false
```
