# Step 9 附录 CP05. Interaction Trace 状态机

> 主控文件: `02_hld_step_09_state_machine.md`
> 对应对象: Step 6 CP05 的 `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt`、`TraceMaterialPolicy`
> 对应接口 / 流: Step 7 CP05 与 Step 8 CP05
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. Step 状态、输入与模块门禁

| 项目 | 内容 |
|---|---|
| 当前模块 | CP05 Interaction Trace 的 correlation gap 与 observation attempt 状态归属、迁移和传播 |
| 输入 | Step 6 CP05 对象骨架、Step 7 CP05 两个 Consumer / 一个 Job / 三个 Query、Step 8 CP05 committed-fact trace、observation relay / feedback 流，以及 Step 9 主控统一状态规则 |
| 结构化输出 | 两个状态定义表、两张 ASCII 图、允许 / 禁止迁移、对象反查与 pending 审计 |
| gate_status | pass |
| gate_reason | trace entry / observation material 的 immutable 边界、interaction gap 与 observation attempt 的 state owner、feedback / observed truth 分离和 unknown fence 已收稳 |
| next_allowed_action | 更新主控与台账到 `state_machines:CP06_external_mirror`；随后才允许创建 CP06 状态机附录 |
| source_files | `02_hld_step_06_key_objects_trace.md`;`02_hld_step_07_interfaces_trace.md`;`02_hld_step_08_flows_trace.md`;`02_hld_step_09_state_machine.md` |

## 2. SOP 问题回答与当前材料诊断

### 2.1 本部分哪些状态影响主线

CP05 有两个正式状态主体：`InteractionGapStatus` 与 `ObservationAttemptStatus`。`InteractionTraceEntry` 与 `ObservationMaterial` 是 immutable local truth；`TraceMaterialPolicy` 是 guard，不拥有生命周期。Trace 只能从 CP01~CP04 已提交 local fact 消费，不能由公共 Command 伪造或改写 source truth。

| 问题 | 收敛回答 |
|---|---|
| 哪些状态属于 CP05 | 未闭合 correlation / trace / source 关系的 gap，以及向 formal observation seam 交接安全材料的本地 attempt。 |
| 每个状态是否能进入正常主线 | trace entry 没有可迁移状态；`ObservationAttemptStatus.prepared` 才可被 relay Job 评估调用 seam；gap 的 `resolved` 仅说明关系取得解释，不能把 source、observed 或 evidence 说成已修复。 |
| 哪些入口触发迁移 | `MemberCommittedFactConsumer` 追加 immutable trace 或 gap；`ObservationRelayJob` 创建 material / prepared attempt，并在 side effect 后写 submitted / blocked / unknown；`ObservationFeedbackConsumer` 关联 feedback 并按需追加 gap；Query 无写入。 |
| 是否有同名状态冲突 | trace `resolved` 不等于 CP04 publication gap resolved；observation `submitted` / `feedback_linked` 不等于 backend ingested / observed；gap `unknown` 不等于 source fact unknown。 |
| 状态如何传播 | committed trace / gap / observation facts 可触发 CP07 projection与 body-free Query；它们不反写 CP01~04 source facts、observability backend、evidence、report 或 external observed truth。 |

### 2.2 当前材料诊断

| 诊断项 | 风险 | 收敛处理 |
|---|---|---|
| 把 trace 当 central event truth / complete log | CP05 会复制或覆盖各 source owner 的事实 | trace entry 只追加 typed refs、低基数 category、purpose 与 correlation，且不可变。 |
| trace append 失败回滚 source | 下游关联失败会重写 CP01~04 committed truth | 失败只形成 `InteractionGap`，source fact 保持已提交。 |
| 将 `ObservationAttempt.submitted` 视为 ingested / observed | 会把 observability backend truth 写入 member | submitted 只记录 member seam invocation，observed 仍由 formal owner 持有。 |
| feedback-linked 被当 evidence / verdict | 会伪造运行证据和验收结论 | feedback 只形成 ref；不得生成 evidence、verdict、report 或 readiness。 |
| unknown 自动重放 | 会造成重复 observation side effect | unknown 是 attempt fence；新 attempt 要求正式 resolution / idempotency evidence。 |

## 3. 设计取舍与改动前后对比

| 议题 | 未采用 / 改前风险 | 采用的状态设计 | 原因 |
|---|---|---|---|
| 单一 `TraceStatus` | trace completeness、source fact、observation delivery 和 evidence 混为一层 | gap 与 attempt 分开；entry / material immutable | link、缺口和 side effect 的 owner / 失败语义不同。 |
| public trace append Command | 调用方可伪造审计链或绕过 source owner | 仅 `MemberCommittedFactConsumer` 从 committed refs 追加 entry / gap | 保证 trace 是后置关联。 |
| observation material 具备 delivered / observed 状态 | material 会与 backend / attempt 竞争 owner | material immutable，无可变状态 | 提交状态归 attempt；observed 真相保持外置。 |
| gap resolved 修复 source fact | 容易把相关性解释误写为业务修复 | resolved 只关闭本地关联缺口 | 不反写 CP01~04 或外部 truth。 |
| feedback 重裁 trace entry | 外部观察会改写 history | feedback 只变 attempt link / 追加 gap | immutable trace / material 得以保留。 |

## 4. 状态归属与定义

### 4.1 `InteractionGap` / `InteractionGapStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `open` | 已知 trace / correlation / source relationship 不完整，尚未建立正式 resolution continuation。 | 否；Query / projection 必须保留 incomplete posture。 | `MemberCommittedFactConsumer`、`ObservationRelayJob` 或 `ObservationFeedbackConsumer`；Step 8 §2~§4。 |
| `blocked` | 必要 owner、source、route 或 formal seam 未闭口 / 不可用。 | 否；不猜测补齐关联。 | 同上。 |
| `resolution_pending` | 已形成显式 resolution / reconciliation continuation，尚未取得可回链结果。 | 否。 | 对已提交 gap 的受控 continuation；不由 Query 触发。 |
| `resolved` | 取得正式 / local `GapResolutionRef`，足以解释该 relation gap。 | 受限；不等于 source fact、delivery、observed 或 evidence 已修复。 | `ObservationFeedbackConsumer` 或正式 resolution incorporation。 |
| `unknown` | 无法判断 gap 的影响、ordering 或 side effect，必须保守暴露。 | 否；不自动补推断。 | `MemberCommittedFactConsumer` / observation continuation 的 attributable unknown。 |
| `superseded` | 后继 gap / trace / attempt 语境已承接处理，旧 gap 保留历史。 | 否；仅用于追溯。 | append-only continuation。 |

`InteractionGap` 只记录可证明的关联缺失或冲突。`resolved` 表示 member 获得了解释该缺口的 reference，不表示 source business fact、publication、observation、evidence 或 external system 已成功；任何 correction / late link 都用 successor history 记录。

### 4.2 `ObservationAttempt` / `ObservationAttemptStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `prepared` | committed trace / gap 已形成低敏、低基数、body-free material，并本地创建 attempt，尚未调用 observation seam。 | 是；仅供 `ObservationRelayJob` 评估 continuation。 | `ObservationRelayJob`；Step 8 §3。 |
| `submitted` | 已调用正式 observation seam 并保存 submission ref。 | 受限；等待 feedback / resolution，不表示 delivered / ingested / observed。 | `ObservationRelayJob`；Step 8 §3。 |
| `feedback_linked` | 已验证并关联正式 observation feedback ref。 | 受限；仅表示 feedback ref 可回链。 | `ObservationFeedbackConsumer`；Step 8 §4。 |
| `blocked` | producer、route、contract、body / cardinality gate 或 continuation 不成立，未正向调用 seam。 | 否；后续处理形成新 attempt / gap。 | `ObservationRelayJob` 的 guard。 |
| `unknown` | observation side effect 或 submission result 无法确认。 | 否；必须有 gap / resolution evidence，禁止盲重放。 | `ObservationRelayJob`；Step 8 §3。 |

`submitted` 与 `feedback_linked` 都是 member local attempt posture；不得由它们推出 observability backend 已 ingest、observed、retained，或产生 report / evidence / verdict。late、duplicate、conflict feedback 保留旧 attempt / material，以新 link / gap history 承接。

## 5. 状态流转图

#### CP05 状态流转图

```text
CP01~04 committed local fact
            │ MemberCommittedFactConsumer
            ▼
InteractionTraceEntry (immutable)
            │ correlation unavailable / conflict / ordering fence
            ▼
InteractionGap
  open / blocked / unknown ──> resolution_pending ──> resolved
          │                       │
          └───────────────────────┴────────────────> superseded

Committed trace / gap
            │ ObservationRelayJob
            ▼
ObservationMaterial (immutable)
            │ create prepared attempt
            ▼
ObservationAttempt
  prepared ──> submitted ──> feedback_linked
      │             │
      ▼             ▼
   blocked       unknown
```

关键说明：

- 图只表达 member local link、gap、material 与 observation attempt；不表达完整日志、observability backend ingest / storage / query、evidence、verdict、report 或 observed truth。
- `InteractionTraceEntry` 与 `ObservationMaterial` 创建后不可变。trace append 失败 / correlation 不完整时产生 gap，而不会回滚 CP01~04 source fact。
- `resolved` gap 只表示关联层有正式解释；`feedback_linked` 只表示 observation feedback ref 已回链，二者均不代表 external success。
- observation `unknown` 必须保留 fence；新的 observation attempt 不是自动回边，需新的 formal resolution 与 idempotency basis。

#### CP05 状态传播关系图

```text
<Committed trace entry / interaction gap / observation material / attempt>
            │
            ▼
<MemberInteractionTraceRecorded /
 MemberInteractionGapChanged /
 MemberObservationMaterialPrepared /
 MemberObservationAttemptRecorded candidate>
            │
            ├─ <MemberProjectionUpdateConsumer> -> <CP07 projection stale / watermark>
            │
            ├─ <prepared observation attempt> -> <ObservationRelayJob continuation>
            │
            └─ <GetInteractionTrace / ListInteractionGaps /
                GetObservationPosture>
                    -> <body-free incomplete / freshness / posture surface>
```

关键说明：

- CP05 已是 committed-fact consumer；它不再把 trace fact 反向供给 CP01~04 写路径，也不修改 source fact、Runtime / Bus / host truth。
- event candidate / local propagation 不等于 exact event / observation route、backend delivery、ingest 或 observed；`L2M-UP-004/005` 仍未闭口。
- CP07 只能投影 committed status、safe refs、watermark 和 incomplete posture；不得把 projection current / stale 反写 trace / gap / attempt。
- Query 只能读取 body-free trace、gap、material、attempt / feedback refs，不能追加 entry、请求 resolution、触发 relay 或产生 evidence。

## 6. 允许的核心迁移

| 对象 | 允许迁移 | 触发动作 / 前置 | 本地结果与边界 |
|---|---|---|---|
| `InteractionTraceEntry` | `<new> -> immutable entry` | `MemberCommittedFactConsumer` 验证 CP01~04 fact 已 committed，subject / purpose / correlation / predecessor refs 可回链 | 追加 body-free trace link；不改变 source fact。 |
| `InteractionGap` | `<new> -> open` | missing ref、correlation conflict、trace append failure、source unresolved 或 ordering unknown 有可证明 local basis | 追加 local gap；Query / projection 保留 incomplete posture。 |
| `InteractionGap` | `<new> -> blocked` | owner / seam / source 必需前置未闭口或不可用 | 追加 blocked gap；不猜测补齐。 |
| `InteractionGap` | `<new> -> unknown` | 关联影响、ordering 或 external side effect 无法证明 | 追加 unknown fence；不得自动缩小影响。 |
| `InteractionGap` | `open / blocked / unknown -> resolution_pending` | 有显式 resolution / reconciliation continuation，且不由 Query 驱动 | 追加 pending revision；未取得结果前不写 resolved。 |
| `InteractionGap` | `open / blocked / resolution_pending / unknown -> resolved` | 有 matching `GapResolutionRef` 且 correlation 可验证 | 追加 resolved revision；不补造或改写缺失 source truth。 |
| `InteractionGap` | `open / blocked / resolution_pending / resolved / unknown -> superseded` | 新 gap、late link 或 new attempt 语境明确承接后续处理 | 追加 superseded revision；保留 predecessor / correlation。 |
| `ObservationAttempt` | `<new> -> prepared` | `ObservationRelayJob` 已从 committed trace / gap 形成 body-free、low-sensitive、low-cardinality material | 先本地提交 material 与 prepared attempt。 |
| `ObservationAttempt` | `prepared -> submitted` | `ObservationHandoffPort` 已被调用并返回可回链 `ObservationSubmissionRef` | 追加 submitted revision；不宣称 backend ingest。 |
| `ObservationAttempt` | `prepared -> blocked` | observation producer、route、contract、body / cardinality gate 或 fence 不成立 | 追加 blocked attempt；不调用 external seam。 |
| `ObservationAttempt` | `prepared / submitted -> unknown` | observation side effect 或 submission result 无法确认 | 追加 unknown attempt 与适用 interaction gap；禁用盲重放。 |
| `ObservationAttempt` | `submitted -> feedback_linked` | `ObservationFeedbackConsumer` 验证 source / attempt / correlation 后关联 `ObservationFeedbackRef` | 追加 feedback link；不改变 trace entry / material / source fact。 |

## 7. 禁止迁移与状态红线

| 禁止迁移或行为 | 原因 |
|---|---|
| 未提交、body-only 或 source-unknown fact 创建 trace entry | trace 只承接可验证 CP01~04 committed refs，不能伪造审计链。 |
| trace append / gap 状态回滚或修改 CP01~04 source fact | trace 是后置关联，失败只能显式保留 gap。 |
| `InteractionGap.resolved` 自动代表 source fact 修复、publication delivered、observation observed 或 evidence valid | resolved 仅关闭 member local relationship gap。 |
| Query 把 open / blocked / unknown gap 变为 pending / resolved，或触发 owner resolution | Query no-write，不具备 reconciliation owner。 |
| `ObservationMaterial` 由 feedback、retry、query 或 projection 改写 | material immutable；新语境必须创建新 material / attempt。 |
| `ObservationAttempt.prepared` 无 `ObservationSubmissionRef` 即写成 submitted | submitted 只能证明 member 调用了 formal seam。 |
| `ObservationAttempt.unknown` 自动 retry、回到 prepared / submitted 或宣称 backend unchanged | unknown side effect 必须有 formal resolution / idempotency evidence。 |
| `feedback_linked` 自动升格为 delivered / ingested / observed / evidence / verdict | feedback ref 不是 backend truth 或验收结论。 |
| CP07 projection、Job、Query 或 feedback 反向修改 trace / gap / attempt source state | projection、continuation和消费面不拥有 CP05 source truth。 |

## 8. 状态触发覆盖、对象反查与传播审计

| 状态主体 / 非状态对象 | Step 7 触发接口 | Step 8 处理流 | 传播 / 查询承接 | 审计结论 |
|---|---|---|---|---|
| `InteractionTraceEntry` | `MemberCommittedFactConsumer` | CP05 §2 trace flow | `MemberInteractionTraceRecorded`;`GetInteractionTrace`;CP07 | pass；immutable，无独立可变状态 |
| `InteractionGap` | `MemberCommittedFactConsumer`;`ObservationRelayJob`;`ObservationFeedbackConsumer` | CP05 §2 / §3 / §4 | `MemberInteractionGapChanged`;`ListInteractionGaps`;`GetInteractionTrace`;CP07 | pass |
| `ObservationMaterial` | `ObservationRelayJob` 内 `ObservationMaterial.create(...)` | CP05 §3 | `MemberObservationMaterialPrepared`;`GetObservationPosture`;CP07 | pass；immutable，无独立可变状态 |
| `ObservationAttempt` | `ObservationRelayJob`;`ObservationFeedbackConsumer` | CP05 §3 / §4 | `MemberObservationAttemptRecorded`;`GetObservationPosture`;CP07 | pass |
| `TraceMaterialPolicy` | Consumer / Job 内 guard | CP05 §2 / §3 | 无独立 lifecycle 或传播 | pass；policy 不是状态主体 |

## 9. 待确认事项与 CP05 停审

| 待确认项 | 当前状态 | 对 CP05 的影响与处理 |
|---|---|---|
| `L2M-UP-004` observation source / downstream direction | pending / blocked | route、feedback、source或 observed 前置不可证明时保持 blocked / gap / unknown；不声明 backend success。 |
| `L2M-UP-005` member-specific event / observation carrier / route | pending / blocked | semantic candidate、logical `MemberFactEnvelope` / `ObservationHandoffPort` 不等于 exact integration。 |
| Observation feedback / reconciliation semantics | pending / blocked | feedback 仅形成 local ref / gap revision，不能产生 evidence、verdict、report或 readiness。 |
| Observation retry / retention policy | deferred | 当前只有 unknown fence 与 new-attempt prerequisite；具体 backend、retry、retention、report 留 03 / 04 / 07。 |

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属完整 | pass | interaction gap 与 observation attempt 各有状态 owner；entry / material / policy 未被误升格。 |
| Step 7 / 8 触发覆盖 | pass | 两个 Consumer、一个 Job、三个 Query、committed-only trace 与 local-first observation continuation 均可反查。 |
| allowed / forbidden 清楚 | pass | committed-only entry、gap resolution basis、prepared-only handoff、submitted proof、feedback link、unknown fence 已明确。 |
| 同名 / 近义状态未压平 | pass | open / blocked / resolved / submitted / feedback-linked 均绑定 object，且不代答 source、backend或 evidence truth。 |
| 状态传播不过度 | pass | 只到 CP07 projection、job continuation 和 body-free query；不反写 CP01~04 或外部 owner。 |
| forbidden body 边界 | pass | complete log、raw event、model / tool body、secret、evidence / report body 均不进入状态、trace、material、event或 projection。 |
| pending 诚实性 | pass | `L2M-UP-004/005` 与 feedback / retry contract 保持 pending / blocked / fail-closed，不伪造 route、observed或 readiness。 |
| 未下沉到详细设计 | pass | 未定义 backend schema、storage、retention、DB 列、retry实现、真实 job run、evidence或测试结果。 |

CP05 结论为 `completed / pass / stop_review`。下一允许动作是更新 Step 9 主控、概要 flow 与项目台账到 `state_machines:CP06_external_mirror`，然后创建 CP06 状态机附录；不得提前创建 CP07 或进入 Step 10。
