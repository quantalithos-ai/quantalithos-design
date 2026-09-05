# Step 9 附录 CP04. Outbound Boundary 状态机

> 主控文件: `02_hld_step_09_state_machine.md`
> 对应对象: Step 6 CP04 的 `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap`、`OutboundMaterialPolicy`
> 对应接口 / 流: Step 7 CP04 与 Step 8 CP04
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. Step 状态、输入与模块门禁

| 项目 | 内容 |
|---|---|
| 当前模块 | CP04 Outbound Boundary 的 decision、publication attempt、gap 状态归属、迁移和传播 |
| 输入 | Step 6 CP04 对象骨架、Step 7 CP04 两个 Consumer / 一个 Job / 两个 Query、Step 8 CP04 的 committed-reception evaluation、relay 与 feedback 流，以及 Step 9 主控统一状态规则 |
| 结构化输出 | 三个状态定义表、两张 ASCII 图、允许 / 禁止迁移、对象反查与 pending 审计 |
| gate_status | pass |
| gate_reason | local outbound decision、immutable material、publication attempt 与 gap 的 owner、正常主线资格、反馈边界和 unknown fence 已收稳 |
| next_allowed_action | 更新主控与台账到 `state_machines:CP05_interaction_trace`；随后才允许创建 CP05 状态机附录 |
| source_files | `02_hld_step_06_key_objects_outbound.md`;`02_hld_step_07_interfaces_outbound.md`;`02_hld_step_08_flows_outbound.md`;`02_hld_step_09_state_machine.md` |

## 2. SOP 问题回答与当前材料诊断

### 2.1 本部分哪些状态影响主线

CP04 有三个正式状态主体：`OutboundDisposition`、`PublicationAttemptStatus` 与 `PublicationGapStatus`。`MemberOutboundMaterial` 是 immutable body-free material，`OutboundMaterialPolicy` 是 guard，二者不拥有独立可变生命周期。没有公共 publication Command；只有 CP03 已提交的 accepted reception 才能触发 outbound evaluation。

| 问题 | 收敛回答 |
|---|---|
| 哪些状态属于 CP04 | accepted Runtime material 的 member 出站资格、本地 publication seam attempt、以及 route / submission / feedback 未闭合的 gap。 |
| 每个状态是否能进入正常主线 | 只有 `OutboundDisposition.eligible` 可创建 material 与 prepared attempt；只有 `PublicationAttemptStatus.prepared` 可供 relay Job 评估调用 seam；feedback-linked 只关联外部 ref；gap 的 resolved 只表示本地缺口已有正式解释。 |
| 哪些入口触发迁移 | `RuntimeMaterialReceptionConsumer` 形成 decision、material、prepared attempt 或 route gap；`PublicationRelayJob` 形成 submitted / blocked / unknown attempt 与 gap；`DeliveryFeedbackConsumer` 关联 feedback 并形成 resolved / superseded / successor gap；Query 无写入。 |
| 是否有同名状态冲突 | eligible 不是 material created、submitted、Bus delivered 或 downstream accepted；feedback-linked 不是 delivered / observed；gap resolved 不是 publication success；blocked / pending 分别绑定 decision、attempt、gap 的原因。 |
| 状态如何传播 | committed local facts 可触发 semantic event candidate、CP05 trace、CP07 projection stale / read surface；外部 route、delivery、retry、Conversation / Artifact fact、downstream accepted / observed 不被本仓状态代答。 |

### 2.2 当前材料诊断

| 诊断项 | 风险 | 收敛处理 |
|---|---|---|
| 把 CP03 accepted reception 直接写成“已出站” | 会跳过 target / purpose / body / seam gate | reception 仅是 CP04 evaluation 输入，新的 `OutboundDecision` 必须独立形成。 |
| 把 `eligible` 压缩为发布成功 | 会混淆 decision、material、attempt 与外部 delivery | eligible 只允许创建 immutable material 与 prepared attempt。 |
| 把 `submitted` / `feedback_linked` 视为 delivered 或 accepted | 会把 Bus / downstream truth 写入 member | attempt 只记录本地 seam invocation 或 feedback ref，外部结论保持 ref / owner 外置。 |
| 把 gap `resolved` 视为业务成功 | 会把“信息已解释”误报成“下游已完成” | resolved 只关闭本地未闭合语义；反馈内容的业务 truth 仍归外部 owner。 |
| 对 unknown automatic retry | 会重复 publication 或造成下游副作用 | unknown 必须建立 / 保留 gap fence；新的 attempt 需要正式 resolution 与 idempotency evidence。 |

## 3. 设计取舍与改动前后对比

| 议题 | 未采用 / 改前风险 | 采用的状态设计 | 原因 |
|---|---|---|---|
| 单一 `OutboundSuccess` | local decision、material、publication invocation、feedback 与 gap 相互代答 | decision / material / attempt / gap 分层 | source、时点、owner 和失败语义不同。 |
| public direct publication Command | 任意 actor 可绕过 CP03 committed reception、target resolution 与 body gate | 仅 `RuntimeMaterialReceptionConsumer` 进入 evaluation，relay 由 Job 承接 | 守住 source-first 与 body-free 边界。 |
| material 作为可变 lifecycle | 会与 attempt 竞争提交真相 | material immutable，无状态 | 是否提交 / feedback / gap 由独立对象承接。 |
| feedback 原地改写 decision | 外部反馈会重裁 source decision | feedback 只令 attempt `feedback_linked`，并追加 / 关闭 / supersede gap | 保留 local truth first 和 append history。 |
| missing route 默认目标 | 未闭口 contract 被假装集成成立 | route / source / carrier 不可证明时形成 `blocked` / `pending` / gap | 服从 `L2M-UP-004/005` fail-closed。 |

## 4. 状态归属与定义

### 4.1 `OutboundDecision` / `OutboundDisposition`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `eligible` | CP03 accepted reception、target、purpose、body-free 与 publication-resolution 前置均可证明。 | 是；仅允许创建 `MemberOutboundMaterial` 与 prepared `PublicationAttempt`。 | `RuntimeMaterialReceptionConsumer`；Step 8 §2。 |
| `rejected` | source、purpose、target 或 allowed material category 已知不合法。 | 否。 | 同上。 |
| `blocked` | publication seam、route、source family 或 resolution 冲突 / 不可证明。 | 否；可伴随 route / contract gap。 | 同上。 |
| `pending` | 正在等待必要 target / seam resolution。 | 否；不得形成可提交 material。 | 同上。 |

`eligible` 是 member 本地出站资格，不等于 material 已创建、publication seam 已调用、Bus delivered、Conversation appended、下游 accepted 或 observed。decision 使用新 consumer input / resolution 形成 successor，不由 feedback、gap、query、job 或 projection 反向原地改写。

### 4.2 `PublicationAttempt` / `PublicationAttemptStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `prepared` | 已从 eligible decision 的 immutable material 创建并本地提交，尚未调用 publication seam。 | 是；仅供 `PublicationRelayJob` 评估 continuation。 | `RuntimeMaterialReceptionConsumer`；Step 8 §2。 |
| `submitted` | 已调用正式 publication seam 并保存 submission ref。 | 受限；等待 feedback / resolution，不代表 delivered / accepted / observed。 | `PublicationRelayJob`；Step 8 §3。 |
| `feedback_linked` | 已验证并关联正式 downstream feedback ref。 | 受限；仅表示 feedback ref 可回链。 | `DeliveryFeedbackConsumer`；Step 8 §4。 |
| `blocked` | seam、route、precondition 或 relay continuation 已知不成立，未作正向调用。 | 否；后续处理形成新 attempt / gap。 | `PublicationRelayJob` 的 guard。 |
| `unknown` | publication side effect 或 submission result 无法确认。 | 否；必须有 gap / resolution evidence，禁止盲重放。 | `PublicationRelayJob`；Step 8 §3。 |

`submitted` 与 `feedback_linked` 都是 member local attempt posture。feedback ref 的存在不能把 attempt 升格为 delivery / downstream acceptance；late、duplicate、conflict feedback 不覆盖旧 attempt 或 material，而是以新 link / gap history 记录。

### 4.3 `PublicationGap` / `PublicationGapStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `open` | route、contract、submission、delivery 或 feedback 之间尚无足够正式信息闭合。 | 否；可能阻止新 attempt。 | `RuntimeMaterialReceptionConsumer`、`PublicationRelayJob` 或 `DeliveryFeedbackConsumer`；Step 8 §2~§4。 |
| `resolution_pending` | 已形成显式 owner-side resolution / reconciliation continuation，尚未取得可回链结果。 | 否；不猜测结果。 | `PublicationRelayJob` 对已提交 open gap 的受控 continuation。 |
| `resolved` | 已取得可引用的正式 feedback / resolution ref，足以解释该 member local gap。 | 受限；不等于 publication success，也不自动启用新 attempt。 | `DeliveryFeedbackConsumer`；Step 8 §4。 |
| `superseded` | committed successor gap 或 attempt 语境已承接后续处理，旧 gap 仅保留历史。 | 否；只用于追溯。 | `PublicationRelayJob` / `DeliveryFeedbackConsumer` 的 append continuation。 |

`PublicationGap` 是本仓拥有的“未闭合关系”事实。它可以关联 delivery-failed 或 feedback-unresolved 的外部 ref，但不会拥有 Bus delivery、下游业务结论或修复权；`resolved` 只证明 member 对该 gap 获得了正式解释。

## 5. 状态流转图

#### CP04 状态流转图

```text
OutboundDecision
  <CP03 accepted reception + target / purpose resolution>
                    │ RuntimeMaterialReceptionConsumer
                    ▼
  eligible / rejected / blocked / pending
                    │ eligible only
                    ▼
MemberOutboundMaterial (immutable)
                    │ create prepared attempt
                    ▼
PublicationAttempt
  prepared ──> submitted ──> feedback_linked
      │             │
      ▼             ▼
   blocked       unknown
                    │
                    ▼
PublicationGap
  open ──> resolution_pending ──> resolved
    │              │
    └──────────────┴──────────> superseded
```

关键说明：

- 图只表达 member local outbound decision、material、attempt 与 gap；它不表达 Bus route / delivery / retry、downstream accepted / observed、Conversation / Artifact fact 或具体 transport。
- `eligible -> material -> prepared` 是显式跨对象资格链；`submitted` 仅发生在 relay Job 调用 publication seam 后。
- `feedback_linked` 可以与 `PublicationGap.resolved` 同时存在，但二者都不等于 delivered、accepted、observed 或业务完成。
- `unknown` 必须经 gap / resolution fence 保留；新 attempt 不是该状态图的自动回边，而需新的正式 evidence 与新的 attempt 语境。

#### CP04 状态传播关系图

```text
<Committed outbound decision / material / attempt / gap revision>
                    │
                    ▼
<MemberOutboundDecided /
 MemberOutboundMaterialPrepared /
 MemberPublicationAttemptRecorded /
 MemberPublicationGapChanged candidate>
                    │
                    ├─ <MemberCommittedFactConsumer> -> <CP05 trace link / gap>
                    │
                    ├─ <MemberProjectionUpdateConsumer> -> <CP07 projection stale / watermark>
                    │
                    ├─ <prepared attempt> -> <PublicationRelayJob continuation>
                    │
                    └─ <GetOutboundDecision / GetPublicationPosture>
                            -> <body-free local posture>
```

关键说明：

- candidate / committed-fact propagation 不是 exact event carrier、route、outbox delivery 或 downstream receipt；`L2M-UP-004/005` 未闭口。
- `DeliveryFeedbackConsumer` 只把 verified feedback 转为 local link / gap revision，不反写 decision、material 或外部 owner truth。
- CP05 trace 与 CP07 projection 只消费 committed local refs；projection stale / gap diagnostics 不得反向改变 attempt 或 gap。
- Query 不创建 material、attempt、gap，也不触发 relay、retry、feedback resolution 或任何外部副作用。

## 6. 允许的核心迁移

| 对象 | 允许迁移 | 触发动作 / 前置 | 本地结果与边界 |
|---|---|---|---|
| `OutboundDecision` | `<new> -> eligible` | `RuntimeMaterialReceptionConsumer` 仅接受 CP03 accepted reception，且 target / purpose / body / seam resolution 可证明 | 追加 local decision；仅授予 material / prepared attempt 创建资格。 |
| `OutboundDecision` | `<new> -> rejected` | source、purpose、target 或 material category 已知不合法 | 追加 rejected decision；不创建 material / attempt。 |
| `OutboundDecision` | `<new> -> blocked` | route、seam、source family、carrier 或 target resolution 冲突 / 缺失 | 追加 blocked decision 与适用 gap；不猜测默认目标。 |
| `OutboundDecision` | `<new> -> pending` | 必要 external resolution 尚未形成或 freshness 不足 | 追加 pending decision；不形成可提交 material。 |
| `OutboundDecision` | `rejected / blocked / pending -> eligible / rejected / blocked / pending` | 新的 committed reception / target resolution 语境进入 Consumer | 形成 successor decision；既有 decision 不原地覆盖。 |
| `PublicationAttempt` | `<new> -> prepared` | eligible decision 已生成 body-free material，且本地创建准备记录 | 先本地提交 prepared attempt。 |
| `PublicationAttempt` | `prepared -> submitted` | `PublicationRelayJob` 已调用 `EventPublicationPort` 并得到可回链 `PublicationSubmissionRef` | 追加 submitted revision；不声明 delivery。 |
| `PublicationAttempt` | `prepared -> blocked` | relay Job 发现 seam、route、precondition 或 fence 不成立 | 追加 blocked attempt；不执行正向 port side effect。 |
| `PublicationAttempt` | `prepared / submitted -> unknown` | publication side effect 或 submission result 无法确认 | 追加 unknown attempt 和适用 gap fence；禁用盲重放。 |
| `PublicationAttempt` | `submitted -> feedback_linked` | `DeliveryFeedbackConsumer` 验证 source / attempt / correlation 后关联 `DownstreamFeedbackRef` | 追加 feedback link；不重裁 decision。 |
| `PublicationGap` | `<new> -> open` | route unresolved、contract blocked、submission unknown、delivery failed 或 feedback unresolved 的已提交 local basis | 追加 body-free gap；可与 decision 或 attempt 关联。 |
| `PublicationGap` | `open -> resolution_pending` | `PublicationRelayJob` 对 open gap 建立受控的 owner-side continuation，且不越过 existing fence | 追加 pending revision；不猜测 resolution。 |
| `PublicationGap` | `open / resolution_pending -> resolved` | `DeliveryFeedbackConsumer` 获得 matching formal feedback / resolution ref | 追加 resolved revision；只关闭本地 gap，不宣称 publication success。 |
| `PublicationGap` | `open / resolution_pending / resolved -> superseded` | 新的 committed successor gap 或新 attempt 语境明确承接后续处理 | 追加 superseded revision；保留历史与 correlation。 |

## 7. 禁止迁移与状态红线

| 禁止迁移或行为 | 原因 |
|---|---|
| 非 CP03 accepted reception 形成 eligible outbound decision / material | 防止绕过 committed source、body gate 与 Runtime owner 边界。 |
| `eligible` 直接变为 submitted、delivered、accepted 或 observed | decision、material、attempt、external delivery / downstream truth 必须分层。 |
| `MemberOutboundMaterial` 被 retry / feedback / query 改写 | material immutable；任何新语境需新 material / attempt / gap 链。 |
| `PublicationAttempt.prepared` 在无 `PublicationSubmissionRef` 时写成 submitted | submitted 只能证明 seam invocation，且不代表 external acceptance。 |
| `PublicationAttempt.unknown` 自动 retry、回到 prepared / submitted 或默认创建 successor | unknown side effect 必须有正式 resolution / idempotency evidence，不能由 scheduler 猜测补齐。 |
| `feedback_linked` 自动升格为 delivered / downstream accepted / observed | feedback ref 不是外部业务结论的复制或 member 侧签发。 |
| `PublicationGap.resolved` 自动代表 publication success、关闭 Runtime / downstream truth 或解锁新 attempt | resolved 只表达 local gap 已得到正式解释；是否可继续仍受 policy / idempotency guard。 |
| `PublicationGap` 被删除、原地覆盖或由 Query 静默关闭 | append history 与 no-write 查询是本步红线。 |
| CP05 / CP07、Job、Query 或 external feedback 反向重裁 `OutboundDecision` | trace、projection、continuation 和 feedback 不拥有 source decision truth。 |

## 8. 状态触发覆盖、对象反查与传播审计

| 状态主体 / 非状态对象 | Step 7 触发接口 | Step 8 处理流 | 传播 / 查询承接 | 审计结论 |
|---|---|---|---|---|
| `OutboundDecision` | `RuntimeMaterialReceptionConsumer` | CP04 §2 evaluation flow | `MemberOutboundDecided`;`GetOutboundDecision`;CP05 / CP07 | pass |
| `MemberOutboundMaterial` | 同一 Consumer 内 `MemberOutboundMaterial.create(...)` | CP04 §2 | `MemberOutboundMaterialPrepared`;`PublicationRelayJob`;CP05 | pass；immutable，无独立可变状态 |
| `PublicationAttempt` | `RuntimeMaterialReceptionConsumer`;`PublicationRelayJob`;`DeliveryFeedbackConsumer` | CP04 §2 / §3 / §4 | `MemberPublicationAttemptRecorded`;`GetPublicationPosture`;CP05 / CP07 | pass |
| `PublicationGap` | 两个 Consumer；`PublicationRelayJob` | CP04 §2 / §3 / §4 | `MemberPublicationGapChanged`;`GetPublicationPosture`;CP05 / CP07 | pass |
| `OutboundMaterialPolicy` | Consumer / Job 内 guard | CP04 §2 / §3 | 无独立 lifecycle 或传播 | pass；policy 不是状态主体 |

## 9. 待确认事项与 CP04 停审

| 待确认项 | 当前状态 | 对 CP04 的影响与处理 |
|---|---|---|
| `L2M-UP-004` Runtime handoff source family、下游 / observation direction | pending / blocked | source、feedback或 route 不可证明时形成 `blocked` / `pending` / gap；不宣称 delivered / observed。 |
| `L2M-UP-005` member-specific event family、carrier、route | pending / blocked | semantic candidate、logical envelope 与 `EventPublicationPort` 不等于 exact Bus / IPC integration。 |
| Downstream feedback semantics / resolution evidence | pending / blocked | feedback 只形成 ref / gap revision；不能由 member 分类为 business acceptance。 |
| Publication retry / reconciliation policy | deferred | 当前只定义 unknown fence 与 new-attempt prerequisite；具体 retry、outbox、DLQ、scheduler / retention 留 03 / 04。 |

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属完整 | pass | decision、attempt、gap 各有状态 owner；material / policy 未被误升格。 |
| Step 7 / 8 触发覆盖 | pass | 两个 Consumer、一个 Job、两个 Query 和 local-first continuation 均可反查。 |
| allowed / forbidden 清楚 | pass | accepted-source-only、eligible-only material、submitted proof、feedback link、gap fence 和 no-retry 红线已明确。 |
| 同名 / 近义状态未压平 | pass | eligible / prepared / submitted / feedback-linked / resolved 分别绑定 object，且均不代答外部 truth。 |
| 状态传播不过度 | pass | 只到 trace、projection、job continuation 和 body-free query；不反写 decision 或声明 delivery / observed。 |
| forbidden body 边界 | pass | Runtime body、Conversation body、Artifact / evidence body、secret、hidden reasoning、provider / tool body 均不进入状态、event、trace、projection 或 material。 |
| pending 诚实性 | pass | `L2M-UP-004/005` 和 feedback / retry contract 保持 pending / blocked / fail-closed，不伪造 route 或 integration readiness。 |
| 未下沉到详细设计 | pass | 未定义 topic、carrier schema、outbox、DB 列、retry实现、真实 job run、测试结果或证据。 |

CP04 结论为 `completed / pass / stop_review`。下一允许动作是更新 Step 9 主控、概要 flow 与项目台账到 `state_machines:CP05_interaction_trace`，然后创建 CP05 状态机附录；不得提前创建 CP06~CP07 或进入 Step 10。
