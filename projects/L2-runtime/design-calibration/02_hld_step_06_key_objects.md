# L2-runtime 02 概要 Step 6: 关键对象轮廓

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 6 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 5 八组成部分 capability / 对象候选池，Step 4 主体框架，Step 3 owner / data / state / pending 约束 |
| 目标 | 按组成部分正式化会被 Step 7 / 8 / 9 使用的关键对象、值、枚举、projection 和 history record |
| 禁止 | API / DTO / port / repository / service 升级为 domain object；完整 schema / Rust / Python 声明；DB / serialization / implementation |

## 1. 对象候选池筛选

| 候选类别 | 处理 | 理由 |
|---|---|---|
| Runtime-owned truth / decision / state | 独立成节 | 详细设计否则会重新发明主语、owner 和不变量。 |
| External ref / snapshot / availability | 独立成节 | 必须防止外部 body / truth 进入 Runtime。 |
| Safe projection / handoff material | 独立成节 | Query / outbound flow 必须能回指安全对象。 |
| Policy / guard result | 独立成节 | fail-closed、composition、progress、precondition 必须成为显式结果，不可隐藏在 service。 |
| History / feedback / side-effect / handoff records | 独立成节 | immutable history、unknown fence 和 local truth first 依赖这些记录。 |
| Service / Coordinator | 不作为对象展开 | Step 4 / 5 已定义角色；函数数据流留 Step 8。 |
| Port / Repository / API / DTO / Trigger | 不作为领域对象展开 | 接口骨架留 Step 7；完整协议留 03。 |
| 外部 owner body / raw SDK response | 排除 | 违反 owner separation / forbidden body。 |

## 2. 对象索引与分布

| 组成部分 | 正式对象 |
|---|---|
| Entry & Control | RuntimeTriggerContext、RuntimeAdmissionDecision |
| Run & Goal-Plan | ControlledRun、GoalPlanWorkspace、RunProgressDecision、RuntimeHistoryEntry |
| Context & Memory | WorkingContext、WorkingMemory、ContextCompositionDecision、MemoryCandidate、MemoryUseRecord |
| Model Decision | ModelIntent、ModelDecision、ModelTurn、ModelDisposition、SafeDecisionSummary |
| Action & Delegation | ActionDecision、Delegation、ActionPreconditionDecision、ActionFeedbackRecord |
| Checkpoint / Recovery / Handoff | RuntimeCheckpoint、RecoveryDecision、RuntimeOutcome、SideEffectMarker、HandoffAttempt、HandoffGap |
| External Truth Views | SourceReference、SourceSnapshot、SourceAvailability |
| Safe Runtime Views | SafeRuntimeView、SafeHandoffMaterial、ProjectionState |

类型记法为语言中立概要类型，例如 `RunId`、`Optional<CheckpointId>`、`List<SourceReference>`、`Set<ConstraintRef>`；它们不是 Rust / Python / DB / serialized schema。

## 3. Entry & Control 对象

### 3.1 RuntimeTriggerContext

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Entry & Control / 上下文值对象 / `FR-L2R-001`,`HLC-L2R-002` |
| 职责 | 封装正式 trigger 的 actor、scope、goal refs、source 和幂等语境，不保存产品正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| actor_ref | ActorRef | 正式主体引用 |
| scope | RuntimeScope | 运行允许范围 |
| goal_refs | List<TypedRef> | 外部目标 / 定义引用 |
| source | SourceReference | trigger 来源 |
| idempotency_key | IdempotencyKey | 重复受理判定 |
| metadata | CommandMetadata | 关联 / causation / 时间元数据 |

| 成员函数骨架 | 作用 |
|---|---|
| validate_scope(RuntimeScope allowed_scope) | 判断 trigger 是否在允许范围 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(ActorRef actor_ref, RuntimeScope scope, List<TypedRef> goal_refs, SourceReference source, IdempotencyKey idempotency_key, CommandMetadata metadata) | 创建经过类型封装的 trigger context |

禁止：携带 prompt、Work / Method / Artifact body、provider secret 或从 display text 猜 actor / scope。

### 3.2 RuntimeAdmissionDecision

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Entry & Control / decision record + state enum / `FR-L2R-001`,`BR-L2R-001~002` |
| 职责 | 表达 trigger / control 的 accepted、rejected、waiting、blocked 判断及安全理由。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_id | DecisionId | 稳定决定标识 |
| trigger_digest | Digest | 关联输入而不保存正文 |
| disposition | AdmissionDisposition | accepted / rejected / waiting / blocked |
| reason_category | SafeReasonCategory | body-free 理由 |
| source_refs | List<SourceReference> | 决定来源 |

| 状态 | 作用 |
|---|---|
| accepted / rejected | 允许创建 run / 正式拒绝 |
| waiting / blocked | 等输入 / 正式前置不成立 |

| 成员函数骨架 | 作用 |
|---|---|
| permits_run_creation() | 仅 accepted 返回允许 |

| 工厂函数骨架 | 作用 |
|---|---|
| decide(RuntimeTriggerContext trigger, PreconditionSummary preconditions) | 基于正式来源形成决定 |

禁止：把 accepted 当 completed / authorized execution，保存隐藏推理，或在 unknown 前置下 accepted。

## 4. Run & Goal-Plan 对象

### 4.1 ControlledRun

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Run & Goal-Plan / aggregate candidate / `FR-L2R-001~004` |
| 职责 | 维护 run identity、scope、status、current anchors、版本和 terminal disposition。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| run_id | RunId | Runtime run 唯一标识 |
| scope | RuntimeScope | 不可越过的运行范围 |
| status | RunStatus | active / waiting / blocked / cancelled / completed / failed / unknown |
| goal_plan_id | GoalPlanWorkspaceId | 当前工作目标 / 计划引用 |
| current_decision_id | Optional<DecisionId> | 当前已提交决定 |
| stable_checkpoint_id | Optional<CheckpointId> | 最近可证明稳定点 |
| version | RunVersion | 并发 / 历史版本 |

| 状态 | 作用 |
|---|---|
| active / waiting / blocked | 推进 / 等输入 / 前置阻塞 |
| cancelled / completed / failed / unknown | 四类不可压平终止 / 未知姿态 |

| 成员函数骨架 | 作用 |
|---|---|
| apply_progress(RunProgressDecision decision) | 按 guard 推进并追加历史 |
| attach_checkpoint(CheckpointId checkpoint_id) | 只关联可证明 stable checkpoint |

| 工厂函数骨架 | 作用 |
|---|---|
| create(RuntimeAdmissionDecision admission, RuntimeTriggerContext trigger) | 只从 accepted trigger 创建 run |

禁止：接纳外部直接状态覆盖、把 delivery / observed 写成 run status、原地删除历史或复制业务正文。

### 4.2 GoalPlanWorkspace

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Run & Goal-Plan / domain entity / `FR-L2R-002~003` |
| 职责 | 保存 run 内 goal / plan working state、依赖、完成条件和 progress，不成为 Work / Process truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| workspace_id | GoalPlanWorkspaceId | 工作空间标识 |
| run_id | RunId | 所属 run |
| goal_refs | List<TypedRef> | 外部目标 / 定义引用 |
| plan_items | List<WorkingPlanItem> | 语言中立工作项摘要 |
| progress | GoalPlanProgress | 当前进度语义 |
| constraints | Set<ConstraintRef> | 正式约束引用 |

| 成员函数骨架 | 作用 |
|---|---|
| record_progress(RunProgressDecision decision) | 记录显式推进决定 |
| next_candidates() | 返回可评估工作候选，不隐式推进 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(RunId run_id, List<TypedRef> goal_refs, Set<ConstraintRef> constraints) | 创建 working-only workspace |

禁止：保存 ImplementationPlan / Method body，宣称正式 Work / Process 完成，或由 prompt 自动满足条件。

### 4.3 RunProgressDecision

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Run & Goal-Plan / policy decision / `FR-L2R-003~004`,`BR-L2R-004~006` |
| 职责 | 表达 proceed / wait / block / no-next-step / terminal 的显式进展决定。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_id | DecisionId | 决定标识 |
| run_id | RunId | 所属 run |
| disposition | ProgressDisposition | 推进姿态 |
| source_refs | List<SourceReference> | 判断来源 |
| reason_category | SafeReasonCategory | 安全理由分类 |

| 成员函数骨架 | 作用 |
|---|---|
| is_terminal() | 判断是否为终止决定 |

| 工厂函数骨架 | 作用 |
|---|---|
| decide(ControlledRun run, GoalPlanWorkspace workspace, DecisionInputs inputs) | 形成 source-anchored 进展决定 |

禁止：无 source 推进、把缺依赖当 completed、原地覆盖旧 decision。

### 4.4 RuntimeHistoryEntry

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Run & Goal-Plan / immutable history record / `BR-L2R-002`,`NFR-L2R-010~012` |
| 职责 | 追加记录 run 中已提交事实、source、causation、correlation 与版本。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| entry_id | HistoryEntryId | 记录标识 |
| run_id | RunId | 所属 run |
| fact_kind | RuntimeFactKind | 事实分类 |
| fact_ref | TypedRef | body-free 事实引用 |
| causation_ref | Optional<TypedRef> | 直接因果来源 |
| correlation | RuntimeCorrelation | run / turn / decision / action 关联 |
| committed_at | Timestamp | 本地提交时点 |

| 成员函数骨架 | 作用 |
|---|---|
| relates_to(RuntimeCorrelation correlation) | 判断关联关系 |

| 工厂函数骨架 | 作用 |
|---|---|
| append(RuntimeFactKind fact_kind, TypedRef fact_ref, RuntimeCorrelation correlation, Optional<TypedRef> causation_ref) | 形成不可变记录 |

禁止：update / delete 历史、保存 external body / hidden reasoning，或把 external delivery 当 local fact kind。

## 5. Context & Memory Mediation 对象

### 5.1 WorkingContext

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Context & Memory Mediation / 不可变上下文组合值 / `FR-L2R-005`,`HLC-L2R-006` |
| 职责 | 表达一次已排序、已裁剪并可供模型或动作决策使用的上下文引用集合。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| context_id | WorkingContextId | 组合结果标识 |
| run_id | RunId | 所属运行 |
| segment_refs | List<ContextSegmentRef> | 按顺序排列的安全片段引用 |
| composition_id | DecisionId | 形成该上下文的 composition decision |
| budget | ContextBudget | 概要级容量约束，不表示 provider token 配额 |
| source_refs | List<SourceReference> | 片段来源引用 |
| version | ContextVersion | 可重建版本 |

| 状态 | 作用 |
|---|---|
| assembling | 正在收集和校验候选片段 |
| assembled | 已通过 owner、顺序和预算检查 |
| frozen | 已作为某次模型 / 动作决定的输入冻结 |
| rejected | 组合不满足约束，不能继续使用 |

| 成员函数骨架 | 作用 |
|---|---|
| freeze() | 将 assembled 上下文固定为只读输入 |
| contains(ContextSegmentRef segment_ref) | 判断片段是否已被纳入 |
| references(SourceReference source_ref) | 判断是否引用指定来源 |

| 工厂函数骨架 | 作用 |
|---|---|
| compose(ContextCompositionDecision decision, List<ContextSegmentRef> segment_refs, ContextBudget budget) | 从 composition decision 形成排序后的上下文 |

禁止：保存 prompt / provider response / hidden reasoning、跨 run 复用 mutable segment、绕过 composition decision 直接拼装。

### 5.2 WorkingMemory

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Context & Memory Mediation / run-scoped working state / `FR-L2R-005`,`FR-L2R-006` |
| 职责 | 保存本次 run 可继续使用的短期工作条目；不拥有 durable memory body。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| memory_id | WorkingMemoryId | working memory 标识 |
| run_id | RunId | 所属运行 |
| entries | List<WorkingMemoryEntryRef> | 条目引用及顺序 |
| window_version | MemoryWindowVersion | 当前窗口版本 |
| source_refs | List<SourceReference> | 条目来源 |
| status | WorkingMemoryStatus | open / compacting / frozen / degraded |

| 状态 | 作用 |
|---|---|
| open | 可接受经过校验的新条目 |
| compacting | 正在形成下一窗口，旧窗口仍可追溯 |
| frozen | 当前窗口只读 |
| degraded | 部分来源不可用，只能按 fail-closed 规则使用 |

| 成员函数骨架 | 作用 |
|---|---|
| add(MemoryCandidate candidate) | 以引用方式加入候选条目 |
| freeze() | 停止窗口内的隐式修改 |
| compact(CompactionDecision decision) | 根据显式决定形成新窗口 |
| contains(TypedRef entry_ref) | 判断条目是否存在 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(RunId run_id, MemoryWindowVersion window_version) | 为 run 创建空的 working window |

禁止：充当 working 之外的 durable memory owner、存放完整外部正文、无 history 地删除条目或以配置改变 retention truth。

### 5.3 ContextCompositionDecision

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Context & Memory Mediation / policy decision / `FR-L2R-005~006`,`BR-L2R-007~009` |
| 职责 | 明确候选来源哪些可进入 working context、哪些被排除以及排除理由。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_id | DecisionId | 决定标识 |
| run_id | RunId | 所属运行 |
| disposition | CompositionDisposition | accepted / partial / waiting / blocked |
| selected_refs | List<MemoryCandidateRef> | 已选候选引用 |
| excluded_refs | List<MemoryCandidateRef> | 被排除候选引用 |
| reason_categories | List<SafeReasonCategory> | body-free 选择理由 |
| source_refs | List<SourceReference> | 决定来源 |

| 成员函数骨架 | 作用 |
|---|---|
| permits_assembly() | 判断是否允许构造 WorkingContext |
| excludes(MemoryCandidateRef candidate_ref) | 判断候选是否被排除 |

| 工厂函数骨架 | 作用 |
|---|---|
| decide(RunId run_id, List<MemoryCandidate> candidates, ContextConstraints constraints) | 形成来源锚定的组合决定 |

禁止：把 provider token 预算、未授权正文或 hidden relevance rationale 作为 Runtime truth；unknown 来源不得生成 accepted。

### 5.4 MemoryCandidate

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Context & Memory Mediation / external candidate reference / `FR-L2R-005~006`,`L2R-UP-005` |
| 职责 | 以最小引用描述可供 Runtime 评估的 working / episodic / semantic 记忆候选。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| candidate_id | MemoryCandidateId | 候选标识 |
| memory_kind | MemoryKind | working / episodic / semantic |
| source_ref | SourceReference | durable 或 working owner 的引用 |
| snapshot_ref | Optional<SourceSnapshotId> | 已获取快照引用 |
| eligibility | CandidateEligibility | eligible / stale / unavailable / unknown |
| ordering_hint | Optional<OrderingHint> | 稳定排序提示，不是 relevance truth |

| 成员函数骨架 | 作用 |
|---|---|
| is_eligible() | 仅在来源满足安全条件时返回可用 |
| refers_to(SourceReference source_ref) | 判断候选来源 |

| 工厂函数骨架 | 作用 |
|---|---|
| from_source(SourceReference source_ref, MemoryKind memory_kind, Optional<SourceSnapshotId> snapshot_ref) | 构造不携带正文的候选 |

禁止：复制 durable memory body、宣称索引或 retention 归 Runtime 所有、把排序提示当授权或事实。

### 5.5 MemoryUseRecord

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Context & Memory Mediation / immutable use record / `NFR-L2R-010~012` |
| 职责 | 记录某候选是否被纳入某次上下文，便于追溯而不记录记忆正文。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| record_id | MemoryUseRecordId | 使用记录标识 |
| run_id | RunId | 所属运行 |
| candidate_ref | MemoryCandidateRef | 候选引用 |
| context_id | WorkingContextId | 目标上下文 |
| disposition | MemoryUseDisposition | selected / excluded / unavailable |
| source_snapshot_ref | Optional<SourceSnapshotId> | 使用时看到的来源快照 |
| committed_at | Timestamp | 本地提交时间 |

| 成员函数骨架 | 作用 |
|---|---|
| is_selected() | 判断是否进入上下文 |
| relates_to(WorkingContextId context_id) | 判断上下文关联 |

| 工厂函数骨架 | 作用 |
|---|---|
| record(RunId run_id, MemoryCandidateRef candidate_ref, WorkingContextId context_id, MemoryUseDisposition disposition, Optional<SourceSnapshotId> source_snapshot_ref) | 形成不可变使用记录 |

禁止：保存记忆正文、修改既有记录或把不可用来源记录为 selected。

## 6. Model Decision 对象

### 6.1 ModelIntent

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Model Decision / provider-neutral intent value / `FR-L2R-007`,`HLC-L2R-007` |
| 职责 | 描述一次模型评估的目的、输入引用和安全约束，不指定 provider route。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| intent_id | ModelIntentId | 意图标识 |
| run_id | RunId | 所属运行 |
| purpose | ModelPurpose | plan / compose / reflect / recover / decide_action |
| context_ref | WorkingContextRef | 输入上下文引用 |
| constraints | Set<ConstraintRef> | 必须遵守的约束 |
| source_refs | List<SourceReference> | 目的与输入来源 |

| 成员函数骨架 | 作用 |
|---|---|
| requires_context() | 判断是否必须有冻结上下文 |
| is_within(RuntimeScope scope) | 判断意图是否在 run scope 内 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(RunId run_id, ModelPurpose purpose, WorkingContextRef context_ref, Set<ConstraintRef> constraints) | 创建 provider-neutral intent |

禁止：携带 provider secret、具体 route / quota / cost、完整 prompt 或要求模型直接执行工具。

### 6.2 ModelDecision

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Model Decision / domain decision record / `FR-L2R-007~009`,`BR-L2R-010~012` |
| 职责 | 记录模型轮次在 Runtime 内转化后的 provider-neutral 决定及其安全分类。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_id | DecisionId | 决定标识 |
| turn_id | ModelTurnId | 所属模型轮次 |
| disposition | ModelDisposition | propose_action / ask_input / reflect / recover / stop / blocked |
| selected_action_ref | Optional<ActionDecisionId> | 可选动作决定引用 |
| summary_ref | SafeDecisionSummaryRef | body-free 摘要引用 |
| source_refs | List<SourceReference> | 决定来源 |

| 成员函数骨架 | 作用 |
|---|---|
| permits_action() | 仅 propose_action 且 guard 通过时允许动作编排 |
| is_safe_to_resume() | 判断是否允许进入恢复流 |

| 工厂函数骨架 | 作用 |
|---|---|
| derive(ModelTurn turn, ModelOutputClassification classification, SafeDecisionSummary summary) | 从分类结果形成 Runtime 决定 |

禁止：把原始模型输出、hidden reasoning、provider usage / cost 或 route truth 写入 Runtime 决定。

### 6.3 ModelTurn

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Model Decision / turn entity / `FR-L2R-007~008`,`NFR-L2R-006` |
| 职责 | 关联一次模型意图、冻结上下文、决定引用及适配器交互引用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| turn_id | ModelTurnId | 轮次标识 |
| run_id | RunId | 所属运行 |
| sequence | TurnSequence | run 内顺序 |
| intent_ref | ModelIntentId | 输入意图 |
| context_ref | WorkingContextId | 冻结上下文 |
| decision_ref | Optional<ModelDecisionId> | 已分类决定 |
| adapter_receipt_ref | Optional<TypedRef> | 外部适配交互引用 |
| status | ModelTurnStatus | pending / submitted / classified / failed / unknown |

| 状态 | 作用 |
|---|---|
| pending | 尚未提交适配器请求 |
| submitted | 已提交，等待外部结果 |
| classified | 已形成 provider-neutral decision |
| failed / unknown | 失败或交互结果未知，禁止盲重试 |

| 成员函数骨架 | 作用 |
|---|---|
| attach_decision(ModelDecisionId decision_id) | 关联已分类决定 |
| mark_unknown(UnknownReason reason) | 标记不可判定的外部交互 |

| 工厂函数骨架 | 作用 |
|---|---|
| start(ModelIntent intent, WorkingContext context, TurnSequence sequence) | 从意图和冻结上下文开启轮次 |

禁止：把 model route、secret、quota、cost 或 raw response 作为字段；classified 之前不得推进行动。

### 6.4 ModelDisposition

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Model Decision / disposition enum / `FR-L2R-007~009` |
| 职责 | 统一模型决定可被 Runtime 识别的高层姿态。 |

| 状态 | 作用 |
|---|---|
| propose_action | 提议进入动作前置检查 |
| ask_input | 等待外部或用户补充输入 |
| reflect | 请求本地 reflection / 修订工作状态 |
| recover | 请求 checkpoint / recovery 评估 |
| stop | 结束当前推进 |
| blocked | 前置、来源或接缝不足，fail-closed |

| 成员函数骨架 | 作用 |
|---|---|
| requires_action_guard() | 判断是否必须经过 ActionPreconditionDecision |
| is_terminal() | 判断是否可形成终止姿态 |

| 工厂函数骨架 | 作用 |
|---|---|
| from_classification(ModelOutputClassification classification) | 将分类映射为有限姿态集合 |

禁止：增加 provider-specific disposition、把 propose_action 当执行成功或把 blocked 压平为 stop。

### 6.5 SafeDecisionSummary

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Model Decision / redacted projection / `BR-L2R-011`,`HLC-L2R-004` |
| 职责 | 提供可审计且不含隐藏推理的决定摘要，供 history、view 和 handoff 使用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| summary_id | SafeDecisionSummaryId | 摘要标识 |
| decision_id | DecisionId | 对应决定 |
| category | SafeReasonCategory | 安全分类 |
| disposition | ModelDisposition | 对外可见姿态 |
| source_refs | List<SourceReference> | 来源引用 |
| redaction_profile | RedactionProfile | 明确已剔除的内容类别 |

| 成员函数骨架 | 作用 |
|---|---|
| is_body_free() | 确认摘要不含正文或 hidden reasoning |
| references(SourceReference source_ref) | 判断来源关联 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(ModelDecision decision, SafeReasonCategory category, List<SourceReference> source_refs, RedactionProfile redaction_profile) | 形成安全决定摘要 |

禁止：以摘要冒充原始模型证据、写入 token / cost / secret、推断未被 source 支持的结论。

## 7. Action & Delegation Orchestration 对象

### 7.1 ActionDecision

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Action & Delegation / action choice record / `FR-L2R-010~012`,`HLC-L2R-008` |
| 职责 | 表达 Runtime 选择某类动作、delegation 或 incorporation 的决定；不执行动作。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_id | ActionDecisionId | 动作决定标识 |
| run_id | RunId | 所属运行 |
| action_kind | ActionKind | tool / delegation / incorporate_feedback / no_action |
| target_ref | TypedRef | 外部能力 / 子 run / feedback 目标引用 |
| disposition | ActionDisposition | proposed / deferred / blocked / cancelled |
| precondition_ref | Optional<ActionPreconditionDecisionId> | 前置检查引用 |
| source_refs | List<SourceReference> | 决定来源 |

| 状态 | 作用 |
|---|---|
| proposed | 已选择但尚未满足执行前置 |
| deferred | 等待输入、资源或接缝 |
| blocked | 前置不成立或来源未知 |
| cancelled | 本地取消，不代表外部动作撤销 |

| 成员函数骨架 | 作用 |
|---|---|
| requires_precondition() | 判断是否必须做正式前置检查 |
| mark_blocked(SafeReasonCategory reason_category) | 形成 fail-closed 阻塞决定 |

| 工厂函数骨架 | 作用 |
|---|---|
| propose(RunId run_id, ActionKind action_kind, TypedRef target_ref, List<SourceReference> source_refs) | 创建动作选择记录 |

禁止：把 action choice 当 tools execution、capability registry 或 sandbox truth；不得携带工具参数正文、secret、quota 或成本事实。

### 7.2 Delegation

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Action & Delegation / bounded child-run record / `FR-L2R-012`,`HLC-L2R-010` |
| 职责 | 表达 parent run 向受限 child context 的委派关系和结果纳入边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| delegation_id | DelegationId | 委派标识 |
| parent_run_id | RunId | 父 run |
| child_run_ref | Optional<RunId> | 子 run 引用 |
| scope | RuntimeScope | 子上下文允许范围 |
| input_refs | List<TypedRef> | 最小输入引用 |
| status | DelegationStatus | proposed / accepted / rejected / running / completed / failed / unknown |
| result_ref | Optional<TypedRef> | 子 run 安全结果引用 |

| 状态 | 作用 |
|---|---|
| proposed / accepted / rejected | 委派待审 / 已接纳 / 被拒绝 |
| running | 子 run 已受理且未完成 |
| completed / failed / unknown | 结果已知完成、失败或不可判定 |

| 成员函数骨架 | 作用 |
|---|---|
| accept(RuntimeAdmissionDecision admission) | 仅基于 accepted admission 建立 child 关系 |
| incorporate(RunProgressDecision progress) | 将 child 的安全结果纳入 parent working state |
| is_within(RuntimeScope parent_scope) | 检查子范围没有越界 |

| 工厂函数骨架 | 作用 |
|---|---|
| propose(RunId parent_run_id, RuntimeScope scope, List<TypedRef> input_refs) | 形成最小输入委派候选 |

禁止：parent / child 共享 mutable body、Runtime 生成 method / role / process truth、把 child completion 当外部动作执行成功。

### 7.3 ActionPreconditionDecision

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Action & Delegation / guard decision / `BR-L2R-013~016`,`L2R-UP-001~004` |
| 职责 | 在 action choice 与外部执行之间提供 allowed / denied / waiting / unknown 的显式闸门。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_id | ActionPreconditionDecisionId | 闸门标识 |
| action_ref | ActionDecisionId | 被检查的动作 |
| disposition | PreconditionDisposition | allowed / denied / waiting / unknown |
| required_refs | List<TypedRef> | capability / governance / sandbox / source 前置引用 |
| reason_category | SafeReasonCategory | body-free 理由 |

| 状态 | 作用 |
|---|---|
| allowed | 允许交给外部执行边界，但不代表已执行 |
| denied | 正式禁止 |
| waiting | 合同或输入尚未闭合 |
| unknown | 无法确认，必须 fail-closed |

| 成员函数骨架 | 作用 |
|---|---|
| permits_dispatch() | 仅 allowed 返回允许派发 |
| is_fail_closed() | 判断是否需要阻断或转 waiting |

| 工厂函数骨架 | 作用 |
|---|---|
| evaluate(ActionDecision action, PreconditionInputs inputs) | 汇总 typed 前置并形成 guard 结果 |

禁止：Runtime 自行补 capability / governance / sandbox truth；unknown 不得变成 allowed。

### 7.4 ActionFeedbackRecord

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Action & Delegation / immutable feedback reference / `FR-L2R-011`,`L2R-UP-001~004` |
| 职责 | 记录外部 action feedback 的引用、归因和本地接纳状态，不拥有执行 receipt body。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| feedback_id | ActionFeedbackId | feedback 标识 |
| action_ref | ActionDecisionId | 对应动作决定 |
| feedback_kind | FeedbackKind | accepted / rejected / completed / failed / pending / unknown |
| receipt_ref | Optional<TypedRef> | 外部 receipt / observation 引用 |
| source_refs | List<SourceReference> | feedback 来源 |
| committed_at | Timestamp | 本地接纳时间 |

| 状态 | 作用 |
|---|---|
| pending / unknown | 尚未闭合或结果不可判定 |
| accepted / rejected | 外部边界已接纳 / 拒绝 |
| completed / failed | 外部边界报告已完成 / 失败 |

| 成员函数骨架 | 作用 |
|---|---|
| is_known_terminal() | 判断 feedback 是否为已知终态 |
| can_update_run() | 仅允许符合 source 和顺序的本地更新 |

| 工厂函数骨架 | 作用 |
|---|---|
| record(ActionDecision action, FeedbackKind feedback_kind, Optional<TypedRef> receipt_ref, List<SourceReference> source_refs) | 形成不可变反馈记录 |

禁止：写入工具执行正文、伪造 receipt、把 acknowledged / delivered 当 completed，或重复反馈逆写本地历史。

## 8. Checkpoint, Recovery & Handoff 对象

### 8.1 RuntimeCheckpoint

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Checkpoint, Recovery & Handoff / stable-point record / `FR-L2R-013`,`BR-L2R-017~020` |
| 职责 | 记录可恢复的 Runtime-owned anchors、history cursor 和 side-effect fence。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| checkpoint_id | CheckpointId | 检查点标识 |
| run_id | RunId | 所属运行 |
| checkpoint_kind | CheckpointKind | stable / provisional |
| run_version | RunVersion | 形成时 run 版本 |
| state_refs | List<TypedRef> | 可重建状态引用 |
| history_cursor | HistoryCursor | 已提交本地历史位置 |
| side_effect_refs | List<SideEffectMarkerId> | 已知副作用围栏 |
| status | CheckpointStatus | preparing / committed / invalid / unknown |

| 状态 | 作用 |
|---|---|
| preparing | 尚未形成可恢复证明 |
| committed | 本地稳定点已提交 |
| invalid | 依赖或版本不再满足 |
| unknown | 持久化提交结果不可判定 |

| 成员函数骨架 | 作用 |
|---|---|
| is_stable() | 仅 stable + committed 返回 true |
| covers(HistoryCursor cursor) | 判断是否覆盖指定本地历史 |
| invalidate(InvalidationReason reason) | 以新事实标记不可恢复 |

| 工厂函数骨架 | 作用 |
|---|---|
| prepare(ControlledRun run, List<TypedRef> state_refs, HistoryCursor history_cursor, List<SideEffectMarkerId> side_effect_refs) | 准备候选检查点，不宣称已提交 |

禁止：保存外部正文、未提交的 checkpoint 作为 stable、以配置绕过事务 / commit-unknown 处理或把 checkpoint 当全局 snapshot owner。

### 8.2 RecoveryDecision

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Checkpoint, Recovery & Handoff / recovery policy decision / `FR-L2R-013~014`,`BR-L2R-020~022` |
| 职责 | 在 stable checkpoint、side-effect marker 和当前 local truth 上决定 resume / restart / wait / block / manual_review。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_id | RecoveryDecisionId | 决定标识 |
| run_id | RunId | 所属运行 |
| checkpoint_ref | Optional<CheckpointId> | 参考检查点 |
| disposition | RecoveryDisposition | resume / restart / wait / block / manual_review |
| reason_category | SafeReasonCategory | 安全理由 |
| source_refs | List<SourceReference> | 决定依据 |

| 成员函数骨架 | 作用 |
|---|---|
| permits_resume() | 仅 resume 且 side-effect fence 已闭合时允许恢复 |
| requires_manual_review() | 判断是否必须人工处理未知副作用 |

| 工厂函数骨架 | 作用 |
|---|---|
| decide(ControlledRun run, Optional<RuntimeCheckpoint> checkpoint, List<SideEffectMarker> markers, RecoveryInputs inputs) | 形成 fail-closed recovery 决定 |

禁止：没有 stable point 时宣称 resume、unknown side effect 下盲重试、把 restart 当补偿执行。

### 8.3 RuntimeOutcome

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Checkpoint, Recovery & Handoff / local outcome record / `FR-L2R-014~015`,`BR-L2R-023` |
| 职责 | 表达 Runtime 对一次 run 的本地终局判断和可否交接，不冒充外部观测或验收结论。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| outcome_id | RuntimeOutcomeId | 结果标识 |
| run_id | RunId | 所属运行 |
| disposition | OutcomeDisposition | succeeded / partial / blocked / failed / cancelled / unknown |
| summary_ref | SafeDecisionSummaryRef | 安全摘要引用 |
| terminal_checkpoint_ref | Optional<CheckpointId> | 终局检查点引用 |
| handoff_eligibility | HandoffEligibility | eligible / ineligible / pending |
| source_refs | List<SourceReference> | 结果依据 |

| 状态 | 作用 |
|---|---|
| succeeded / partial | Runtime 本地完成或部分完成 |
| blocked / failed / cancelled | 阻塞、失败或取消 |
| unknown | 关键外部副作用或提交结果未知 |

| 成员函数骨架 | 作用 |
|---|---|
| can_handoff() | 仅 eligible 且 source 完整时允许生成 handoff candidate |
| is_terminal() | 判断本地 outcome 是否终止 |

| 工厂函数骨架 | 作用 |
|---|---|
| finalize(RunId run_id, OutcomeDisposition disposition, SafeDecisionSummaryRef summary_ref, Optional<CheckpointId> terminal_checkpoint_ref, List<SourceReference> source_refs) | 形成 local outcome |

禁止：宣称 external observed / artifact verdict / acceptance readiness，或把 pending / unknown 压平为 succeeded。

### 8.4 SideEffectMarker

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Checkpoint, Recovery & Handoff / side-effect fence record / `BR-L2R-018~022`,`L2R-UP-001~004` |
| 职责 | 以 idempotency 和 typed receipt 标记外部动作副作用是否已知。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| marker_id | SideEffectMarkerId | 围栏标识 |
| run_id | RunId | 所属运行 |
| action_ref | ActionDecisionId | 对应动作 |
| idempotency_key | IdempotencyKey | 去重键 |
| effect_state | EffectState | none / requested / completed / failed / unknown / compensated |
| receipt_ref | Optional<TypedRef> | 外部回执引用 |
| source_refs | List<SourceReference> | 状态来源 |

| 状态 | 作用 |
|---|---|
| none / requested | 未见副作用 / 已请求 |
| completed / failed | 已知完成 / 失败 |
| unknown | 无法确认是否发生 |
| compensated | 外部 owner 已报告补偿，但 Runtime 不拥有补偿逻辑 |

| 成员函数骨架 | 作用 |
|---|---|
| is_retry_safe() | 仅 none 或有明确幂等证明时允许重试评估 |
| mark_unknown(UnknownReason reason) | 建立未知副作用围栏 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(ActionDecision action, IdempotencyKey idempotency_key) | 为动作建立副作用标记 |

禁止：由 Runtime 猜测 external effect、在 unknown 时清除围栏、把 compensated 写成 Runtime 已完成。

### 8.5 HandoffAttempt

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Checkpoint, Recovery & Handoff / outbound attempt record / `FR-L2R-015`,`HLC-L2R-011` |
| 职责 | 记录安全 handoff candidate 的生成、提交和回执状态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| attempt_id | HandoffAttemptId | 交接尝试标识 |
| run_id | RunId | 所属运行 |
| target_ref | TypedRef | 外部 handoff 目标引用 |
| material_ref | SafeHandoffMaterialId | 安全材料引用 |
| status | HandoffAttemptStatus | candidate / submitted / acknowledged / rejected / unknown |
| correlation | RuntimeCorrelation | 关联 run / outcome / source |
| source_refs | List<SourceReference> | 交接来源 |

| 状态 | 作用 |
|---|---|
| candidate | 本地已生成，尚未宣称发送 |
| submitted | 已交给 outbound seam，等待结果 |
| acknowledged / rejected | 外部接缝已确认接收 / 拒绝 |
| unknown | 发送或接收状态不可判定 |

| 成员函数骨架 | 作用 |
|---|---|
| mark_submitted(SubmissionRef submission_ref) | 记录本地提交事实 |
| mark_unknown(UnknownReason reason) | 形成未知交接姿态 |
| is_delivered() | 仅 acknowledged 返回 true，不表示业务完成 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(RuntimeOutcome outcome, TypedRef target_ref, SafeHandoffMaterial material) | 仅从可交接 outcome 创建 candidate |

禁止：把 acknowledged 当业务完成、携带 artifact / report body、伪造外部 receipt 或把 outbound adapter 当 Runtime owner。

### 8.6 HandoffGap

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Checkpoint, Recovery & Handoff / gap record / `FR-L2R-015`,`BR-L2R-023` |
| 职责 | 显式记录 local outcome 与 handoff / external acknowledgment 之间未闭合的差距。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| gap_id | HandoffGapId | gap 标识 |
| attempt_ref | HandoffAttemptId | 对应交接尝试 |
| expected_ref | TypedRef | 期望的后续事实引用 |
| observed_ref | Optional<TypedRef> | 已见的外部事实引用 |
| disposition | GapDisposition | open / closed / blocked / unknown |
| reason_category | SafeReasonCategory | body-free 原因 |

| 成员函数骨架 | 作用 |
|---|---|
| is_open() | 判断是否仍有未闭合差距 |
| close(TypedRef observed_ref) | 以新的外部事实关闭 gap |

| 工厂函数骨架 | 作用 |
|---|---|
| open(HandoffAttemptId attempt_ref, TypedRef expected_ref, SafeReasonCategory reason_category) | 创建显式 gap |

禁止：无 observed source 关闭 gap、把 gap 当失败 verdict、写入外部 body 或直接改写 RuntimeOutcome。

## 9. External Truth Views 对象

### 9.1 SourceReference

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | External Truth Views / typed boundary reference / `HLC-L2R-003~005` |
| 职责 | 指向外部 owner 的最小、可校验引用，供 Runtime 记录来源而不接管 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| source_id | SourceId | 引用标识 |
| owner_kind | ExternalOwnerKind | tools / capability / method / governance / sandbox / observability / memory / artifact |
| object_ref | TypedRef | 外部对象引用 |
| version_or_digest | SourceVersion | 版本或摘要 |
| authority | AuthorityClass | owner / producer / observer / adapter |

| 成员函数骨架 | 作用 |
|---|---|
| belongs_to(ExternalOwnerKind owner_kind) | 检查 owner 分类 |
| has_stable_identity() | 判断引用是否足以追溯 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(ExternalOwnerKind owner_kind, TypedRef object_ref, SourceVersion version_or_digest, AuthorityClass authority) | 构造 typed boundary reference |

禁止：将 reference 当 body、由 Runtime 重新定义 owner truth、从未签名 display text 猜 source identity。

### 9.2 SourceSnapshot

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | External Truth Views / read snapshot reference / `HLC-L2R-005`,`NFR-L2R-010` |
| 职责 | 记录 Runtime 在某时刻读取到的外部来源版本、完整性和裁剪状态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| snapshot_id | SourceSnapshotId | 快照标识 |
| source_ref | SourceReference | 来源引用 |
| captured_at | Timestamp | 读取时点 |
| digest | Digest | 内容一致性摘要，不携带正文 |
| completeness | SnapshotCompleteness | complete / partial / unavailable / unknown |
| redaction_profile | RedactionProfile | 已应用的裁剪规则 |

| 状态 | 作用 |
|---|---|
| complete | 可按声明范围使用 |
| partial | 只能用于允许的部分语义 |
| unavailable / unknown | 不可据此形成正向结论 |

| 成员函数骨架 | 作用 |
|---|---|
| supports_positive_decision() | 判断完整性是否允许正向决定 |
| matches(SourceReference source_ref) | 检查来源和版本一致 |

| 工厂函数骨架 | 作用 |
|---|---|
| capture(SourceReference source_ref, Digest digest, SnapshotCompleteness completeness, RedactionProfile redaction_profile) | 创建无正文快照记录 |

禁止：把 digest 当 content、把 partial / unknown 当 complete、持有 provider secret 或外部 owner 的写权限。

### 9.3 SourceAvailability

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | External Truth Views / availability projection / `L2R-UP-001~008`,`HLC-L2R-005` |
| 职责 | 表达某 external source 当前是否可用于 Runtime 决策，并明确 pending / fail-closed。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| source_ref | SourceReference | 被检查来源 |
| status | AvailabilityStatus | available / unavailable / pending / stale / unknown |
| checked_at | Timestamp | 检查时点 |
| reason_category | SafeReasonCategory | body-free 原因 |
| evidence_ref | Optional<TypedRef> | 可追溯检查证据引用 |

| 状态 | 作用 |
|---|---|
| available | 允许按来源能力继续判断 |
| unavailable / pending | 不能形成正向决定，分别表示不可用 / 待闭合 |
| stale / unknown | 只能按明确 freshness 或 fail-closed 规则处理 |

| 成员函数骨架 | 作用 |
|---|---|
| permits_positive_use() | 仅 available 且 freshness 满足要求时返回 true |
| is_fail_closed() | 判断是否必须阻断消费者 |

| 工厂函数骨架 | 作用 |
|---|---|
| assess(SourceReference source_ref, AvailabilityInputs inputs) | 形成来源可用性视图 |

禁止：Runtime 自报外部 readiness、把 fake / design file 当 evidence、以配置忽略 pending 或 stale。

## 10. Safe Runtime Views 对象

### 10.1 SafeRuntimeView

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Safe Runtime Views / read-only projection / `FR-L2R-016`,`HLC-L2R-012` |
| 职责 | 提供由 local truth、safe summary 和 source availability 重建的只读运行视图。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| view_id | SafeRuntimeViewId | 视图标识 |
| run_id | RunId | 所属运行 |
| projection_state | ProjectionState | 当前投影状态 |
| run_status | RunStatus | 本地 run 状态 |
| outcome_ref | Optional<RuntimeOutcomeId> | 本地结果引用 |
| summary_refs | List<SafeDecisionSummaryRef> | 安全摘要引用 |
| source_availability | List<SourceAvailability> | 来源可用性 |
| history_cursor | HistoryCursor | 视图读取位置 |

| 状态 | 作用 |
|---|---|
| current | 已追到最新可重建 local truth |
| stale | 视图落后但可识别 |
| degraded | 部分来源不可用，已显式降级 |
| unknown | 无法证明视图完整性 |

| 成员函数骨架 | 作用 |
|---|---|
| is_safe_to_expose() | 视图不得包含 forbidden body 且 projection 可解释 |
| is_stale() | 判断是否落后于 local history |

| 工厂函数骨架 | 作用 |
|---|---|
| rebuild(ControlledRun run, List<RuntimeHistoryEntry> history, List<SourceAvailability> availability) | 从本地事实重建只读视图 |

禁止：以 view 反写 run truth、掩盖 stale / unknown、暴露 provider / governance / sandbox 内部正文或伪造 observed status。

### 10.2 SafeHandoffMaterial

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Safe Runtime Views / outbound projection / `FR-L2R-015~016`,`HLC-L2R-011` |
| 职责 | 从 Runtime local outcome 和允许引用中构造可交接、可重放且 body-free 的材料。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| material_id | SafeHandoffMaterialId | 材料标识 |
| run_id | RunId | 所属运行 |
| purpose | HandoffPurpose | 交接用途 |
| outcome_ref | RuntimeOutcomeId | 本地 outcome |
| allowed_refs | List<TypedRef> | 可交接的最小引用集合 |
| source_refs | List<SourceReference> | 材料来源 |
| redaction_profile | RedactionProfile | 内容裁剪规则 |
| projection_version | ProjectionVersion | 可重建版本 |

| 成员函数骨架 | 作用 |
|---|---|
| is_body_free() | 确认材料不含禁止正文 |
| can_replay() | 判断材料是否具有稳定关联和幂等语境 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(RuntimeOutcome outcome, HandoffPurpose purpose, List<TypedRef> allowed_refs, List<SourceReference> source_refs, RedactionProfile redaction_profile) | 创建安全交接候选 |

禁止：携带 artifact / report body、完整模型输出、工具 receipt body、secret 或把 candidate 当已发送。

### 10.3 ProjectionState

| 基本信息 | 内容 |
|---|---|
| 所属部分 / 类型 / 来源 | Safe Runtime Views / projection state value / `NFR-L2R-010~012` |
| 职责 | 标记安全投影追到哪个 local history cursor 以及是否可重建。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| projection_id | ProjectionId | 投影标识 |
| status | ProjectionStatus | current / stale / rebuilding / degraded / unknown |
| source_cursor | HistoryCursor | 已应用本地事实位置 |
| generated_at | Timestamp | 生成时点 |
| rebuildable | Boolean | 是否可从 local truth 重建 |
| reason_category | Optional<SafeReasonCategory> | 非 current 状态原因 |

| 状态 | 作用 |
|---|---|
| current | 已追平允许的 local truth |
| stale | 可识别落后 |
| rebuilding | 正在重建，不可宣称 current |
| degraded / unknown | 来源不足或完整性未知 |

| 成员函数骨架 | 作用 |
|---|---|
| can_expose() | 仅满足投影安全条件时允许读取 |
| can_rebuild() | 判断是否具备从 history 重建条件 |

| 工厂函数骨架 | 作用 |
|---|---|
| create(HistoryCursor source_cursor, ProjectionStatus status, Boolean rebuildable) | 创建投影状态值 |

禁止：用 projection status 证明业务完成、把 stale / degraded 隐藏为 current 或将 view 写回 local truth。

## 11. 八组成部分对象正式化停审表

| 组成部分 | 候选处理 | 功能来源 | 接缝审计 | 越界检查 | 结论 |
|---|---|---|---|---|---|
| Runtime Entry & Control | RuntimeTriggerContext、RuntimeAdmissionDecision 正式化；API / trigger protocol 留 Step 7 | `FR-L2R-001` | governance / source 仅 ref，admission 不执行 | 未拥有 approval truth | pass |
| Run & Goal-Plan | ControlledRun、GoalPlanWorkspace、RunProgressDecision、RuntimeHistoryEntry 正式化 | `FR-L2R-002~004` | goal / method / artifact 只引用 | 未承接 Work / Process truth | pass |
| Context & Memory Mediation | WorkingContext、WorkingMemory、ContextCompositionDecision、MemoryCandidate、MemoryUseRecord 正式化 | `FR-L2R-005~006` | durable memory 只 source ref | 未拥有 memory body / retention | pass |
| Model Decision | ModelIntent、ModelDecision、ModelTurn、ModelDisposition、SafeDecisionSummary 正式化 | `FR-L2R-007~009` | model adapter 只 adapter seam | 未拥有 route / secret / cost | pass |
| Action & Delegation Orchestration | ActionDecision、Delegation、ActionPreconditionDecision、ActionFeedbackRecord 正式化 | `FR-L2R-010~012` | tools / capability / sandbox / governance 只 typed boundary | 未实现执行与 registry | pass_with_pending_upstream |
| Checkpoint, Recovery & Handoff | RuntimeCheckpoint、RecoveryDecision、RuntimeOutcome、SideEffectMarker、HandoffAttempt、HandoffGap 正式化 | `FR-L2R-013~016` | persistence / outbound acknowledgement pending | 未拥有 artifact / evidence / delivery truth | pass_with_pending_contract |
| External Truth Views | SourceReference、SourceSnapshot、SourceAvailability 正式化 | `HLC-L2R-003~005`,`L2R-UP-001~008` | source / adapter / observer 分类明确 | 未复制外部 body | pass_with_pending_upstream |
| Safe Runtime Views | SafeRuntimeView、SafeHandoffMaterial、ProjectionState 正式化 | `FR-L2R-015~016`,`HLC-L2R-011~012` | read-only projection / handoff candidate | 未反写 local truth、未伪造 observed | pass |

## 12. Step 8 / Step 9 反查清单

| 后续使用点 | 必须出现的对象 | 当前定义位置 | 反查结果 |
|---|---|---|---|
| trigger admission / run creation | RuntimeTriggerContext、RuntimeAdmissionDecision、ControlledRun | 3、4.1 | defined |
| goal / plan progress | GoalPlanWorkspace、RunProgressDecision、RuntimeHistoryEntry | 4.2~4.4 | defined |
| context composition | MemoryCandidate、ContextCompositionDecision、WorkingMemory、WorkingContext、MemoryUseRecord | 5.1~5.5 | defined |
| model turn | ModelIntent、ModelTurn、ModelDecision、ModelDisposition、SafeDecisionSummary | 6.1~6.5 | defined |
| action dispatch guard | ActionDecision、ActionPreconditionDecision、SideEffectMarker、ActionFeedbackRecord | 7.1、7.3、8.4、7.4 | defined |
| bounded delegation | Delegation、RuntimeAdmissionDecision、RunProgressDecision | 7.2、3.2、4.3 | defined |
| checkpoint / recovery | RuntimeCheckpoint、RecoveryDecision、SideEffectMarker、RuntimeOutcome | 8.1~8.4 | defined |
| run / event handoff | RuntimeOutcome、SafeHandoffMaterial、HandoffAttempt、HandoffGap | 8.3、10.2、8.5~8.6 | defined |
| external source readiness | SourceReference、SourceSnapshot、SourceAvailability | 9.1~9.3 | defined |
| safe query / projection rebuild | SafeRuntimeView、ProjectionState、RuntimeHistoryEntry | 10.1、10.3、4.4 | defined |

## 13. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| identity owner | pass | `RunId`、decision ids、attempt ids 各有单一 Runtime owner；外部 identity 只在 `TypedRef` / `SourceReference` 中出现。 |
| state vocabulary | pass | run、turn、action、checkpoint、handoff、projection 的状态不互相冒充；unknown / pending / blocked 均保留。 |
| action 与 execution 分离 | pass | `ActionDecision` / `ActionPreconditionDecision` 只表达选择和闸门，`ActionFeedbackRecord` 只引用外部反馈。 |
| model 与 provider 分离 | pass | `ModelIntent` / `ModelDecision` 不拥有 route、secret、quota、cost 或 raw response。 |
| working 与 durable memory 分离 | pass | `WorkingMemory` 可持有运行窗口，`MemoryCandidate` 只引用外部记忆 owner。 |
| local history / external delivery | pass | `RuntimeHistoryEntry` 仅记录本地提交事实；`HandoffAttempt` / `HandoffGap` 保留交接不确定性。 |
| checkpoint / side-effect fence | pass_with_pending_contract | `RuntimeCheckpoint`、`SideEffectMarker` 已定义 stable / unknown 语义；持久化事务和 commit-unknown 协议留 Step 7 / 03。 |
| safe projection | pass | `SafeRuntimeView` / `SafeHandoffMaterial` 只读、可重建、body-free；不反写 owner truth。 |
| external owner boundaries | pass_with_pending_upstream | Tools、sandbox、observability、memory、model adapter 的正向接口未闭合，所有正向用法保持 pending / fail-closed。 |
| name drift / duplicate owner | pass | 未发现旧 `ExecutionInstance`、`WorkItem`、`PromoteRequest` 等历史主语被复活；`RuntimeOutcome` 与外部 artifact / verdict 不混用。 |

## 14. 回填草稿

第 6 章应按“对象候选池筛选 -> 对象分布 -> 关键对象独立小节”的顺序装配本文件已通过审计的对象。正式正文只保留对象类型、责任、关键字段、状态、函数 / 工厂骨架、禁止事项和对应校准来源，不携带本文件的讨论过程或历史污染分析。

## 15. 待确认事项与持续 blocker

| 编号 | 待确认 / blocker | 影响 | 当前安全姿态 |
|---|---|---|---|
| `L2R-UP-001~004` | tools / capability / governance / sandbox action mapping、receipt、feedback、cleanup 正向合同未全部闭合 | ActionPreconditionDecision、ActionFeedbackRecord、SideEffectMarker、RecoveryDecision | pending / fail-closed |
| `L2R-UP-005` | durable memory owner、查询、快照和 retention 合同未闭合 | MemoryCandidate、SourceSnapshot、WorkingMemory | pending / ref-only |
| `L2R-UP-006~008` | model adapter、Core / Bus / Observability runtime-specific seam 和观测实现 readiness 未闭合 | ModelTurn、RuntimeHistoryEntry、HandoffAttempt、SourceAvailability | pending / adapter-or-event-only |
| `L2R-CP-001` | checkpoint persistence、事务提交、commit-unknown 处理未定 | RuntimeCheckpoint、RecoveryDecision | blocked / no stable claim |
| `L2R-LANG-001` | 实现语言和物理承载未选择 | 全部对象仅保持语言中立骨架 | not_selected |

## 16. Step 6 自检与门禁

| 检查项 | 结果 |
|---|---|
| 候选池已区分正式对象、字段类型、接口 / port / repository 和详细设计项 | pass |
| 32 个正式对象均独立成节，关键字段 / 状态 / 成员函数 / 工厂函数 / 禁止事项已分别表达 | pass |
| 每个对象回指 Step 5 组成部分并有功能来源 | pass |
| 成员函数和工厂函数参数均使用 `TypeName param_name` | pass |
| Step 8 / Step 9 反查对象均已定义 | pass |
| 跨对象重复、归属冲突、状态漂移和 owner 越界 | pass |
| 未下沉完整 schema、实现、DDL、provider / external body | pass |
| pending / blocker 未被伪造为 ready | pass |

**Step 6 结论：** `done`。允许进入 Step 7 API / 接口骨架；必须先更新文档 flow、项目执行台账并创建 Step 7 中间产物。正式 `02-概要设计.md` 仍不得装配，且不能进入 Step 8。
