# L2-runtime 02 概要 Step 5: 主要组成部分、职责与边界

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 5 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4 八业务组成部分 / 实现分层，Step 3 硬约束，正式 00 / 01 capability、data、interaction |
| 目标 | 逐部分收敛 capability、代码主体候选、对象发现线索、非职责和接缝，并建立 Step 6 候选池 |
| 禁止 | 对象字段 / 函数、完整接口、处理流、状态机、代码目录、外部 owner 内部模块 |

## 1. 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| Runtime Entry & Control | 受理 / 拒绝 trigger、control、resume intent 与 safe query | RuntimeCommandAcceptance、RuntimeControlService、RuntimeQueryService | 产品 API / UI、principal truth、member / SDK lifecycle |
| Run & Goal-Plan | 维护 controlled run、goal / plan working state 与推进决定 | RunCoordinator、ControlledRun、GoalPlanWorkspace | Work / Process / Method / Artifact 正文与正式业务状态 |
| Context & Memory Mediation | 组合 source、working context / memory、retrieval / candidate 使用 | ContextCompositionService、WorkingContext、WorkingMemory | 外部正文、durable memory body / index / retention |
| Model Decision | 形成 provider-neutral intent、selection、turn disposition 与 safe summary | ModelDecisionService、ModelIntent、ModelDecision、ModelTurn | provider route / secret / quota / cost、raw response、hidden reasoning |
| Action & Delegation Orchestration | 形成 action choice、正式前置、Tool / child 编排与 result incorporation | ActionOrchestrationService、ActionDecision、Delegation | Tool execution / audit、approval、Sandbox run、member lifecycle |
| Checkpoint, Recovery & Handoff | 形成 stable checkpoint、recovery / reflection、local outcome、attempt / gap | RecoveryCoordinator、RuntimeCheckpoint、RecoveryDecision、RuntimeOutcome、HandoffAttempt | 外部 truth repair、delivery / observed / acceptance truth |
| External Truth Views | 解析并维护带 owner / freshness 的 ref / safe snapshot / availability / gap | ExternalTruthResolutionService、SourceReference、SourceSnapshot、SourceAvailability | 外部 registry / body / policy / artifact / memory source truth |
| Safe Runtime Views | 派生 body-free status / outcome / decision / handoff views 与 material | SafeViewProjectionService、RuntimeStatusView、RuntimeOutcomeView、SafeMaterialAssembler | Runtime truth mutation、Observability observed / retention truth |

## 2. 各部分交互总图

```text
External triggers / controls / queries
                 |
                 v
[Entry & Control] ---> [Run & Goal-Plan] <--> [Context & Memory]
                              |                       ^
                              v                       |
                       [Model Decision] <-------------+
                              |
                              v
                    [Action & Delegation]
                              |
                              v
                 [Checkpoint / Recovery / Handoff]
                    |          ^            |
                    |          | feedback   |
                    v          |            v
          [Safe Runtime Views] |   local handoff ports
                               |
                  [External Truth Views]
                    ^
                    |
        owner refs / snapshots / results / gaps
```

关键说明：
- 图表达组成部分间的语义承接，不表达函数调用顺序、协议、事务或部署。
- External Truth Views 是 owner-anchored 消费边界，不是外部 truth 副本；Safe Runtime Views 是可重建投影。
- Checkpoint / Recovery / Handoff 横切运行历史，图中末端位置不表示只在 run 结束发生。
- 外部 Tool / Sandbox / model / memory / event 正向 seam 仍为 candidate / blocked。

## 3. 逐部分 capability 与对象发现

### 3.1 Runtime Entry & Control

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| run trigger acceptance | actor / scope / goal refs / metadata | accepted / rejected / waiting | 只在合法时创建 run | Step 7 / 8 |
| control / resume intent acceptance | run ref / control intent / actor | accepted / blocked / unknown | 不直接修改外部 truth | Step 7 / 8 / 9 |
| safe query | run ref / read scope / freshness | status / progress / safe summary / gap | read-only | Step 7 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| RuntimeCommandAcceptance | inbound boundary | 验证 trigger / actor / scope / idempotency 前置 | Step 7 / 8 |
| RuntimeControlService | application service | 协调 pause / cancel / resume / recovery intent | Step 7 / 8 |
| RuntimeQueryService | query service | 读取 Safe Runtime Views | Step 7 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| policy / invariant | RuntimeAdmissionDecision | 独立成节；表达 accepted / rejected / waiting 与 reason category |
| reference | RuntimeTriggerContext | 独立成节；只保留 typed refs / scope，不含产品正文 |
| API / DTO | Command / Query inputs | 不作为领域对象；留 Step 7 |

非职责：不拥有 principal、product entry、member lifecycle 或 query view truth。接缝：向 Run & Goal-Plan 提交已受理 trigger / control；query 只读 Safe Runtime Views。

### 3.2 Run & Goal-Plan

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| controlled run lifecycle | admitted trigger / control / history | run state / disposition | Runtime local truth | Step 6 / 8 / 9 |
| goal / plan working state | goal / definition refs / progress facts | working goal / plan / progress decision | 不替代 Work / Process truth | Step 6 / 8 |
| next-step decision | context / current plan / outcomes | proceed / wait / block / terminal | 追加 decision history | Step 8 / 9 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| RunCoordinator | application service | 协调 run progression 与提交边界 | Step 8 |
| ControlledRun | domain aggregate candidate | 维护 run identity、status、scope 与 current decision anchors | Step 6 / 9 |
| GoalPlanWorkspace | domain entity / context | 维护 goal / plan working state 与 progress | Step 6 / 8 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / state | ControlledRun、GoalPlanWorkspace | 均独立成节 |
| policy / invariant | RunProgressDecision | 独立成节；不能由 prompt 隐式推进 |
| audit / history | RuntimeHistoryEntry | 独立成节；immutable / causation |

非职责：不拥有 WorkItem、ProcessInstance、ImplementationPlan 或 Method body。接缝：消费 Entry、Context、Model、Action / Recovery 的 local facts；通过 repository responsibility 提交。

### 3.3 Context & Memory Mediation

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| source resolution / composition | typed refs / snapshots / goal / budget | composed context / omissions / gaps | working truth / source-use history | Step 6 / 8 |
| working memory | observations / decisions / pending inputs | bounded working items | Runtime local truth | Step 6 / 9 |
| durable retrieval / candidate mediation | retrieval request / candidate | refs / unavailable / pending | no durable write claim | Step 7 / 8 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ContextCompositionService | application service | 解析来源、预算、冲突并形成 composition | Step 8 |
| WorkingContext | domain context | 表达当前 turn 的已选 sources / omissions / budget | Step 6 |
| WorkingMemory | domain state | 维护 bounded working items | Step 6 / 9 |
| SourceResolverPort / DurableMemoryPort | ports | 外部 ref / retrieval / candidate seam | Step 7 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / state | WorkingContext、WorkingMemory | 独立成节 |
| policy | ContextCompositionDecision | 独立成节；source precedence / omission / gap |
| reference / audit | MemoryUseRecord、MemoryCandidate | 独立成节；不含 durable body |

非职责：不保存 method / policy / memory body 或建立 vector index。接缝：经 External Truth Views / memory port 消费安全来源，向 Model / Run 输出 bounded context。

### 3.4 Model Decision

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| model intent / logical selection | goal / context / constraints / budget | intent / selection / no-model / blocked | decision history | Step 6 / 8 |
| model turn correlation | neutral turn / adapter result | result / refusal / timeout / unavailable / unknown | late result 不逆写 | Step 6 / 7 / 9 |
| safe decision summary | sources / selection / disposition | body-free summary | projection candidate | Step 6 / 7 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ModelDecisionService | application service | 协调 intent、candidate、selection 和 result incorporation | Step 8 |
| ModelIntent / ModelDecision / ModelTurn | domain objects | 表达 provider-neutral model semantics | Step 6 / 9 |
| ModelAdapterPort | port candidate | neutral request / semantic result boundary | Step 7 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / state | ModelIntent、ModelDecision、ModelTurn | 组合为三个独立对象小节 |
| policy | ModelDisposition | 作为 ModelTurn 状态 / value enum 展开 |
| projection | SafeDecisionSummary | 独立成节；body-free |

非职责：不拥有 provider registry、route、secret、quota / cost 或 raw response。接缝：消费 Context、Hub safe view；通过 blocked ModelAdapterPort 获得 semantic result。

### 3.5 Action & Delegation Orchestration

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| action choice / precondition | run / plan / model disposition / owner results | no-action / Tool / child / wait / reject | local decision | Step 6 / 8 / 9 |
| Tool orchestration / incorporation | canonical action context / outcome ref | attempt / incorporated / unknown / blocked | 不拥有 execution truth | Step 7 / 8 |
| child delegation / incorporation | parent scope / budget / context boundary | child lifecycle / result incorporation | bounded child state | Step 6 / 8 / 9 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ActionOrchestrationService | application service | 协调 choice、preconditions、submission、feedback | Step 8 |
| ActionDecision / Delegation | domain objects | 表达 local choice 与 bounded child contract | Step 6 / 9 |
| Tools / Governance / Sandbox / Child Ports | port candidates | 正式 owner seams | Step 7 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / state | ActionDecision、Delegation | 独立成节 |
| policy | ActionPreconditionDecision | 独立成节；fail closed |
| reference / history | ActionFeedbackRecord | 独立成节；source / correlation / late handling |

非职责：不执行 Tool / Sandbox、不生成 Governance truth、不创建 member / container。接缝：消费 Model / External Truth Views，向 Checkpoint / Recovery 交接 local decision 和 feedback record。

### 3.6 Checkpoint, Recovery & Handoff

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| stable checkpoint | committed local state / side-effect markers | checkpoint / commit-unknown | local truth responsibility | Step 6 / 8 / 9 |
| resume / reflection / recovery | checkpoint / history / feedback | new recovery decision | immutable history append | Step 6 / 8 / 9 |
| local outcome / handoff | committed run disposition / safe material | outcome / attempt / gap | local truth first | Step 6 / 7 / 8 / 9 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| RecoveryCoordinator | application service | 协调 stable point、recovery、outcome 和 continuation | Step 8 |
| RuntimeCheckpoint / RecoveryDecision / RuntimeOutcome | domain objects | 持有恢复与终态语义 | Step 6 / 9 |
| HandoffAttempt / HandoffGap | domain records | 持有本地传播尝试 / 缺口 | Step 6 / 9 |
| StateRepository / FactHandoff Ports | port candidates | 本地状态责任 / 外部传播 seam | Step 7 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| truth / state | RuntimeCheckpoint、RecoveryDecision、RuntimeOutcome | 独立成节 |
| audit / history | SideEffectMarker、HandoffAttempt、HandoffGap | 独立成节或作为相关对象组逐项定义 |

非职责：不修复外部 truth，不把 delivery / observed / acceptance 变为 local outcome。接缝：读取所有 committed local facts；向 Safe Views 与 FactHandoffPort 输出 body-free material。

### 3.7 External Truth Views

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| typed ref resolution | owner / ref / scope / purpose / time | safe snapshot / missing / stale / conflict | local consumption fact | Step 6 / 7 / 8 |
| availability / change feedback | owner result / change signal | new availability / gap | 不修改 source truth | Step 6 / 9 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ExternalTruthResolutionService | application service | 协调 owner-specific resolvers | Step 8 |
| SourceReference / SourceSnapshot / SourceAvailability | reference / view objects | 安全表达外部来源消费状态 | Step 6 / 9 |
| Owner Resolver Ports | ports | Method / Hub / Governance / Artifact 等 seams | Step 7 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| reference | SourceReference | 独立成节 |
| projection | SourceSnapshot | 独立成节；body-free |
| state | SourceAvailability | 独立成节；available / stale / missing / conflict / unknown |

非职责：不写 source truth、registry、policy、artifact 或 memory body。接缝：为其他组成部分提供 owner-anchored ref / snapshot / gap。

### 3.8 Safe Runtime Views

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| status / outcome projection | committed Runtime truth | body-free view / stale / rebuilding / gap | projection only | Step 6 / 7 / 9 |
| safe material assembly | committed facts / purpose / target ref | eligible material / rejected / gap | no delivery claim | Step 6 / 8 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| SafeViewProjectionService | application / projection service | 构建可查询的 safe views | Step 8 |
| RuntimeStatusView / RuntimeOutcomeView | projections | 对外最小可见面 | Step 6 / 7 / 9 |
| SafeMaterialAssembler | domain / projection service | 构建 body-free handoff material | Step 8 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| projection | RuntimeStatusView、RuntimeOutcomeView | 可合并为 SafeRuntimeView 对象小节并区分 variant |
| policy | SafeHandoffMaterial | 独立成节；purpose / target / source refs / redaction |
| state | ProjectionState | 作为 SafeRuntimeView 状态展开 |

非职责：无 local truth mutation、无 Observability observed / retention、无下游 acceptance。接缝：只读 committed facts，服务 Query 和 outbound handoff。

## 4. 对象发现维度总表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| Entry & Control | AdmissionDecision | admission guard | - | TriggerContext | request metadata 留 Step 7 | RuntimeAdmissionDecision、RuntimeTriggerContext |
| Run & Goal-Plan | ControlledRun、GoalPlanWorkspace | RunProgressDecision | - | business refs | RuntimeHistoryEntry | 四项 |
| Context & Memory | WorkingContext、WorkingMemory | CompositionDecision | - | MemoryCandidate | MemoryUseRecord | 五项 |
| Model Decision | ModelIntent、ModelDecision、ModelTurn | ModelDisposition | SafeDecisionSummary | adapter ref | turn history in ModelTurn | 四对象 + disposition enum |
| Action & Delegation | ActionDecision、Delegation | PreconditionDecision | - | Tool / child refs | ActionFeedbackRecord | 四项 |
| Checkpoint / Recovery / Handoff | Checkpoint、RecoveryDecision、Outcome | stable / unknown guards | - | SideEffectMarker | HandoffAttempt / Gap | 六项 |
| External Truth Views | SourceAvailability | resolution guard | SourceSnapshot | SourceReference | source-use linked elsewhere | 三项 |
| Safe Runtime Views | ProjectionState | material eligibility | SafeRuntimeView | SafeHandoffMaterial | projection gap in view | 两项 + state enum |

## 5. 逐部分停审与跨部分审计

| 组成部分 | capability 清楚 | 候选对象有来源 | 接缝 / 非职责清楚 | 越界 | 停审 |
|---|---|---|---|---|---|
| Entry & Control | pass | pass | pass | 无 product / principal truth | pass |
| Run & Goal-Plan | pass | pass | pass | 无 Work / Process / Artifact body | pass |
| Context & Memory | pass | pass | pass | 无 durable body / index | pass |
| Model Decision | pass | pass | pass | 无 provider control | pass |
| Action & Delegation | pass | pass | pass | 无 execution / approval / isolation truth | pass |
| Checkpoint / Recovery / Handoff | pass | pass | pass | 无 external repair / delivery writeback | pass |
| External Truth Views | pass | pass | pass | 无 source mutation | pass |
| Safe Runtime Views | pass | pass | pass | 无 domain mutation / observed truth | pass |

| 跨部分审计 | 结论 | 状态 |
|---|---|---|
| 重复对象 | Decision 均带限定语；SourceSnapshot 与 SafeRuntimeView 分属输入消费 / 输出投影 | pass |
| 职责重叠 | Entry 受理、Run 推进、Recovery 恢复、View 查询分离 | pass |
| 接缝冲突 | 外部 owner 全经 External Views / Ports；无 sibling package | pass |
| 候选遗漏 | Step 8 / 9 预计使用的 run / context / model / action / checkpoint / feedback / view 均有候选 | pass |
| 后续位置 | object -> Step 6，interface / port -> 7，flow -> 8，state -> 9，无悬空 | pass |

## 6. Step 6 展开门禁与回填

Step 6 必须按八组成部分处理候选池，并为未来可能成为 struct / enum / value / projection / history record 的对象独立定义骨架；API inputs、ports、repositories 和 services 不升级为 domain objects。正式第 5 章回填组成部分总表、交互图、逐部分 capability / 主体 / 对象线索摘要与停审结论；字段 / 函数留 Step 6。

```text
gate_status = pass
next_allowed_action = create_02_hld_step_06_key_objects
formal_02_write_allowed = false
future_step_files_allowed = false_until_step_06_start
```
