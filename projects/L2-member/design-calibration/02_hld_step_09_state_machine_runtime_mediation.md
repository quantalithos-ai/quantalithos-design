# Step 9 附录 CP03. Runtime Mediation 状态机

> 主控文件: `02_hld_step_09_state_machine.md`
> 对应对象: Step 6 CP03 的 `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception`、`RuntimeMediationPolicy`
> 对应接口 / 流: Step 7 CP03 与 Step 8 CP03
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. Step 状态、输入与模块门禁

| 项目 | 内容 |
|---|---|
| 当前模块 | CP03 Runtime Mediation 的 decision、submission、result-link 与 material-reception 状态归属、迁移和传播 |
| 输入 | Step 6 CP03 对象骨架、Step 7 CP03 两个 Command / 一个 Consumer / 两个 Query、Step 8 CP03 的本地两次提交流，以及 Step 9 主控统一状态规则 |
| 结构化输出 | 四层状态定义、两张 ASCII 图、允许 / 禁止迁移、对象反查与 pending 审计 |
| gate_status | pass |
| gate_reason | member local delivery / attempt / link / reception 的不同 owner、正常主线资格、unknown fence 和 Runtime truth 排除均已收稳 |
| next_allowed_action | 更新主控与台账到 `state_machines:CP04_outbound`；随后才允许创建 CP04 状态机附录 |
| source_files | `02_hld_step_06_key_objects_runtime_mediation.md`;`02_hld_step_07_interfaces_runtime_mediation.md`;`02_hld_step_08_flows_runtime_mediation.md`;`02_hld_step_09_state_machine.md` |

## 2. SOP 问题回答与当前材料诊断

### 2.1 本部分哪些状态影响主线

CP03 有三个本地可变 / 分类状态主体和一个不可变的外部结果分类关联：`RuntimeDeliveryDisposition`、`RuntimeSubmissionAttemptStatus`、`RuntimeMaterialReceptionDisposition` 与 `RuntimeResultClassification`。`RuntimeMediationPolicy` 是 guard，不拥有生命周期。`RuntimeResultLink` 一经形成不可变；其中的 classification 只描述已回链的 Runtime result，不可被 member 迁移或覆盖。

| 问题 | 收敛回答 |
|---|---|
| 哪些状态属于 CP03 | screening 到 Runtime entry 的本地 delivery decision、entry seam 的本地 attempt、已回链外部 result 的安全分类、以及 committed safe material 的本地 reception 分类。 |
| 每个状态是否能进入正常主线 | 只有 `RuntimeDeliveryDisposition.eligible` 可建 prepared attempt；只有 prepared attempt 可调用 entry seam；`submitted` / `result_linked` 不代表 Runtime acceptance；只有 `RuntimeMaterialReceptionDisposition.accepted` 可进入 CP04 outbound evaluation。 |
| 哪些入口触发迁移 | `SubmitScreenedFactToRuntime` 形成 decision / prepared attempt 并在端口调用后写 attempt successor；`LinkRuntimeAdmissionResult` 形成 immutable link；`RuntimeMaterialConsumer` 形成 reception classification；Query 无写入。 |
| 是否有同名状态冲突 | member `eligible` 不等于 Runtime admission accepted；member `submitted` 不等于 run created；result-link `accepted` 只复述受控 external classification；reception `accepted` 不等于 outbound decision / publication。 |
| 状态如何传播 | committed local facts 可以供 CP05 trace、CP07 projection 和 body-free query 使用；只有 accepted material reception 可作为 CP04 评估输入；任何传播均不反写 Runtime truth。 |

### 2.2 当前材料诊断

| 诊断项 | 风险 | 收敛处理 |
|---|---|---|
| 把 screening `passed` 视为 Runtime 受理 | 会跳过 Runtime entry owner，伪造 run / acceptance | `passed` / controlled `degraded` 仅是 CP03 decision 输入；只有 mapping 可证时才形成 local `eligible`。 |
| 把 port invocation 写成 Runtime 成功 | external side effect 与 Runtime admission 被混为一层 | `prepared`、`submitted`、`result_linked` 与 external classification 分层；unknown side effect 必须 fenced。 |
| 把 `RuntimeResultLink.accepted` 当作 member state | member 会拥有 / 修改 Runtime admission truth | link immutable，只保存正式 ref 和安全分类；其出现最多推进 local attempt 到 `result_linked`。 |
| 把 safe material reception 写成 Runtime outcome 或出站成功 | 会复制 Runtime truth 并跳过 CP04 gate | reception 只验证 ref / digest / committed 语义；只有 `accepted` 可供 CP04 重新作独立 outbound decision。 |
| 用缺失 mapping / carrier 推进正向调用 | 会在 `L2M-UP-003/004/005` 未闭口时私造协议 | exact source 不可证明时保留 `blocked` / `pending` / `unknown`，不声明 IPC、run、delivery 或 integration ready。 |

## 3. 设计取舍与改动前后对比

| 议题 | 未采用 / 改前风险 | 采用的状态设计 | 原因 |
|---|---|---|---|
| 单一 `RuntimeDeliverySuccess` | decision、seam invocation、Runtime result 与 material reception 相互代答 | 四层 local fact / link 分离 | 四者 owner、来源、失败与后续消费者不同。 |
| `submitted` 直接等于 accepted | port 调用成功会被误当运行已建立 | `submitted` 仅记录 member-side invocation；Runtime classification 另以 result link 表达 | Runtime admission / run 仍归 `L2-runtime`。 |
| unknown 自动 retry | 会重复 Runtime entry 或外部副作用 | unknown 是 attempt fence；后续要么以正式 result link 收束，要么由新 command / new attempt 承接 | 保持 idempotency 和 side-effect safety。 |
| result link 原地改分类 | 会覆盖外部结果历史 | link immutable；duplicate / late / conflict 另作 link / trace / gap 分类 | member 不拥有 Runtime result truth。 |
| reception 自动升级为 outbound / publication | 会消除 CP04 的 target / material / delivery guard | accepted reception 仅成为 CP04 evaluation input | Runtime material 和 member outbound truth 不同。 |

## 4. 状态归属与定义

### 4.1 `RuntimeDeliveryDecision` / `RuntimeDeliveryDisposition`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `eligible` | permitted screening、subject、correlation、Runtime boundary 和 formal entry mapping 均可回链，member 可以建立 submission attempt。 | 是；只允许 `RuntimeSubmissionAttempt.prepare(...)`。 | `SubmitScreenedFactToRuntime`；Step 8 §2。 |
| `rejected` | screening、subject、scope 或 controlled material shape 已知不合法。 | 否。 | 同上。 |
| `blocked` | Runtime boundary、entry mapping 或必要 contract 不可用、冲突或不成立。 | 否；不调用 `RuntimeEntryPort`。 | 同上。 |
| `pending` | 正在等待必要 source / resolution；尚不能证明 entry mapping。 | 否；不调用 `RuntimeEntryPort`。 | 同上。 |

`eligible` 是 member 的 local controlled-delivery decision，不是 `RuntimeAdmissionDecision.accepted`，不表示 Runtime run 已创建。delivery decision 以新 command / 新事实形成 successor；它不通过 result link、material reception、Query 或 projection 被原地改写。

### 4.2 `RuntimeSubmissionAttempt` / `RuntimeSubmissionAttemptStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `prepared` | 已由 eligible decision 创建并本地提交，尚未调用 Runtime entry seam。 | 是；只可进入明确 port continuation 或被明确阻断。 | `SubmitScreenedFactToRuntime`；Step 8 §2 local commit 1。 |
| `submitted` | Runtime entry seam 已被调用，保存本地 submission ref；不表示 Runtime accepted 或 run created。 | 受限；等待正式 result link 或后续相关 material，不触发盲重放。 | 同一 Command 的 local incorporation phase。 |
| `result_linked` | 已关联一个已验证 Runtime result ref。 | 受限；只证明 external result ref 可回链，不代答 run / outcome。 | `LinkRuntimeAdmissionResult` 或同步 result incorporation；Step 8 §2 / §3。 |
| `blocked` | prepared attempt 在正向调用前发现 mapping、boundary 或 local precondition 已不成立。 | 否；下一次提交必须创建新 attempt。 | `SubmitScreenedFactToRuntime` 的 continuation guard。 |
| `unknown` | entry side effect 或 submission result 无法确认。 | 否；必须由正式 result / resolution evidence 收束，禁止盲重放。 | `SubmitScreenedFactToRuntime` 的 local incorporation phase。 |

`submitted` 不能替代 `RuntimeResultLink.classification`；`unknown` 不是 timeout，不能随 retry 次数或时间流逝自动回到 prepared / submitted。新的正向提交始终使用新 attempt 和新 idempotency / correlation 语境。

### 4.3 `RuntimeResultLink` / `RuntimeResultClassification`

| 分类 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `accepted` | 已验证的 Runtime admission / result ref 报告 accepted。 | 不直接；只令关联 attempt 可记为 `result_linked`。 | `LinkRuntimeAdmissionResult` 或同步 result incorporation；Step 8 §2 / §3。 |
| `rejected` | 已验证的 ref 报告 Runtime 拒绝。 | 否；member 不覆写 delivery decision。 | 同上。 |
| `waiting` | 已验证的 ref 表示 Runtime 仍等待外部前置。 | 否；不是 member `pending` 的同义词。 | 同上。 |
| `blocked` | 已验证的 ref 表示 Runtime 的外部阻断。 | 否；不是 member delivery decision 的 `blocked`。 | 同上。 |
| `unknown` | 正式 ref 或其安全分类仍无法证明更具体结果。 | 否；保留未知而不猜测 Runtime 状态。 | 同上。 |

该表是 immutable result-link classification，而非 member 可迁移 lifecycle。`RuntimeResultLink` 只能由已验证 source / submission / boundary correlation 形成；其分类不得覆盖 `RuntimeDeliveryDecision`、修改 Runtime admission truth，或被解释为 Runtime outcome / handoff conclusion。

### 4.4 `RuntimeMaterialReception` / `RuntimeMaterialReceptionDisposition`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `accepted` | committed producer、source、digest、correlation 与 body-free gate 可证明，已承接 Runtime safe material ref。 | 是；仅进入 CP04 outbound evaluation。 | `RuntimeMaterialConsumer`；Step 8 §4。 |
| `rejected` | material 不安全、source 无效或语义不支持。 | 否。 | 同上。 |
| `duplicate` | 同一正式 material 已被本地承接。 | 否；不建立第二 outbound 主线。 | 同上。 |
| `late` | material 对应旧 correlation 或旧 member 语境。 | 否；只追加关联 / trace，不覆盖当前决定。 | 同上。 |
| `blocked` | source family、carrier 或 committed contract 未闭口。 | 否。 | 同上。 |
| `unknown` | digest、source 或 committed status 无法证明。 | 否；不得继续。 | 同上。 |

reception disposition 是 immutable local classification。对于同一 material 的未知 / 冲突，当前概要设计不定义自动 promotion；必须等待正式 Runtime source contract 与 idempotency 语义闭口，再以新的可回链事实决定是否形成 successor record，不能原地把 `unknown` 写成 `accepted`。

## 5. 状态流转图

#### CP03 状态流转图

```text
RuntimeDeliveryDecision
  <new SubmitScreenedFactToRuntime>
                 │ validated screening + formal mapping
                 ▼
  eligible / rejected / blocked / pending
                 │ eligible only
                 ▼
RuntimeSubmissionAttempt
  prepared ──> submitted ──> result_linked
      │             │             ^
      ▼             ▼             │ verified Runtime result ref
   blocked       unknown ──────────┘

RuntimeMaterialReception
  <validated RuntimeMaterialConsumer>
                 │
                 ▼
  accepted / rejected / duplicate / late / blocked / unknown
                 │ accepted only
                 ▼
  CP04 outbound evaluation
```

关键说明：

- 图只表达 member local decision、attempt 和 reception 的状态方向；Runtime admission、run、context、plan、checkpoint、outcome、safe material owner 和 IPC transport 均在图外。
- `result_linked` 表示 local attempt 已关联正式 Runtime result ref；link 的 `accepted` / `waiting` / `blocked` 等分类不等于 attempt 自身的新外部 lifecycle。
- `unknown -> result_linked` 只在验证到 matching formal result / resolution evidence 时成立；它不是 retry，也不保证 Runtime accepted。
- `accepted` reception 到 CP04 是显式跨组成部分资格关系；它不能跳过 CP04 的 outbound decision、material policy 或 publication attempt。

#### CP03 状态传播关系图

```text
<Committed delivery decision / attempt / result link / reception>
                 │
                 ▼
<MemberRuntimeDeliveryDecided /
 MemberRuntimeSubmissionAttemptRecorded /
 MemberRuntimeResultLinked /
 MemberRuntimeMaterialReceived candidate>
                 │
                 ├─ <MemberCommittedFactConsumer> -> <CP05 trace link / gap>
                 │
                 ├─ <MemberProjectionUpdateConsumer> -> <CP07 projection stale / watermark>
                 │
                 ├─ <accepted material reception>
                 │       -> <CP04 outbound evaluation, not publication>
                 │
                 └─ <GetRuntimeMediationPosture /
                     GetRuntimeMaterialReception>
                         -> <body-free local posture>
```

关键说明：

- semantic event candidate / local committed-fact propagation 不等于 exact L0-bus route、member-specific carrier、Runtime delivery 或 observed fact；`L2M-UP-005` 仍未闭口。
- CP06 contract resolution 只影响随后形成的 delivery decision；CP03 不反写 Runtime entry contract 或 source family truth。
- result link、reception、trace 与 projection 都只保留 refs、digest、classification、correlation 和 safe reason；不得传播 model output、hidden reasoning、tool body、secret 或 Runtime outcome 副本。
- Query 不拉取 Runtime run / context / plan / checkpoint / outcome，不触发 result resolution、material fetch、retry 或状态迁移。

## 6. 允许的核心迁移

| 对象 | 允许迁移 | 触发动作 / 前置 | 本地结果与边界 |
|---|---|---|---|
| `RuntimeDeliveryDecision` | `<new> -> eligible` | `SubmitScreenedFactToRuntime`；passed / controlled-degraded screening、fact / subject / correlation 与 formal entry mapping 可证明 | 追加 local decision；仅授予建立 prepared attempt 的资格。 |
| `RuntimeDeliveryDecision` | `<new> -> rejected` | screening、scope、subject 或 controlled shape 已知不合法 | 追加 rejected decision；不调用 Runtime port。 |
| `RuntimeDeliveryDecision` | `<new> -> blocked` | entry mapping / Runtime boundary conflict、missing 或 `L2M-UP-003` 未闭口 | 追加 blocked decision；不私造 trigger schema。 |
| `RuntimeDeliveryDecision` | `<new> -> pending` | 必要 resolution 尚未形成或 freshness 不足 | 追加 pending decision；不调用 Runtime port。 |
| `RuntimeDeliveryDecision` | `rejected / blocked / pending -> eligible / rejected / blocked / pending` | 新的显式 Command、screening / source / mapping basis | 形成 successor decision；历史 decision 不原地覆盖。 |
| `RuntimeSubmissionAttempt` | `<new> -> prepared` | 仅由 eligible delivery decision 与新 `IdempotencyKey` 创建 | 先在本地提交 prepared attempt。 |
| `RuntimeSubmissionAttempt` | `prepared -> submitted` | `RuntimeEntryPort` 已被调用并返回可回链 `RuntimeSubmissionRef` | 追加 submitted revision；不宣称 Runtime accepted / run created。 |
| `RuntimeSubmissionAttempt` | `prepared -> blocked` | 调用前发现 formal seam、mapping 或 local continuation 已不成立 | 追加 blocked attempt；不执行正向 port side effect。 |
| `RuntimeSubmissionAttempt` | `prepared / submitted -> unknown` | entry side effect 或 submission result 无法确认 | 追加 unknown fence；禁用盲重放。 |
| `RuntimeSubmissionAttempt` | `submitted / unknown -> result_linked` | `LinkRuntimeAdmissionResult` 或同步 incorporation 已验证 matching Runtime result ref / correlation | 追加 immutable link 与 attempt successor；classification 不代答 outcome。 |
| `RuntimeMaterialReception` | `<new> -> accepted` | `RuntimeMaterialConsumer` 可验证 committed producer、source family、digest、correlation 与 body-free gate | 追加 reception；只开放 CP04 evaluation。 |
| `RuntimeMaterialReception` | `<new> -> rejected / duplicate / late / blocked / unknown` | consumer 的 source、dedup、ordering、contract 或 integrity gate 产生对应分类 | 追加不可变分类；不创建第二 outbound 主线或改写 Runtime truth。 |
| `RuntimeResultLink` | `<new> -> accepted / rejected / waiting / blocked / unknown classification` | `LinkRuntimeAdmissionResult` 验证 Runtime source / submission / boundary correlation | 形成 immutable body-free link；仅可关联 attempt。 |

## 7. 禁止迁移与状态红线

| 禁止迁移或行为 | 原因 |
|---|---|
| screening `passed` / `degraded` 直接变为 Runtime accepted、run created 或 outcome | CP02 screening 与 Runtime admission / run / outcome 是不同 owner truth。 |
| `RuntimeDeliveryDecision.eligible` 因 Query、result link、projection 或时间流逝自动变为 submitted / accepted | decision 只授予 attempt creation；port side effect 与 Runtime result 必须单独形成 local facts。 |
| `blocked` / `pending` delivery decision 自动变为 eligible | 必须有新的 command 与正式 mapping / resolution basis。 |
| `RuntimeSubmissionAttempt.prepared` 在无 `RuntimeSubmissionRef` 时写成 submitted | submitted 必须证明 member 调用了 formal seam，而不证明 external acceptance。 |
| `RuntimeSubmissionAttempt.unknown` 自动 retry、回到 prepared / submitted 或创建第二 run | unknown 是副作用 fence；新 attempt 需要显式 command 与 resolution / idempotency evidence。 |
| `RuntimeResultLink.accepted` 覆盖 delivery decision、直接创建 material reception 或代表 outcome success | link 只保存 Runtime result ref 的安全分类；material reception 由独立 Consumer 形成。 |
| late / duplicate / conflict result link 逆写既有 attempt 或 Runtime result | history append-only；只形成新 link、trace / gap 分类或 blocked surface。 |
| `RuntimeMaterialReception.accepted` 直接变为 publication submitted / delivered / observed | CP04 仍必须完成独立 outbound decision、material / target guard 与 attempt 语义。 |
| reception `duplicate` / `late` / `blocked` / `unknown` 自动晋升为 accepted | source / digest / committed proof 未闭口时必须保持 fence；不原地补推断。 |
| CP04 / CP05 / CP07、Query 或 Job 反向修改 CP03 source state | outbound、trace、projection、read 和 operation continuation 不拥有 Runtime mediation truth。 |

## 8. 状态触发覆盖、对象反查与传播审计

| 状态主体 / 非状态对象 | Step 7 触发接口 | Step 8 处理流 | 传播 / 查询承接 | 审计结论 |
|---|---|---|---|---|
| `RuntimeDeliveryDecision` | `SubmitScreenedFactToRuntime` | CP03 §2 submission flow | `MemberRuntimeDeliveryDecided`;`GetRuntimeMediationPosture`;CP05 / CP07 | pass |
| `RuntimeSubmissionAttempt` | `SubmitScreenedFactToRuntime`;`LinkRuntimeAdmissionResult` | CP03 §2 / §3 | `MemberRuntimeSubmissionAttemptRecorded`;`GetRuntimeMediationPosture`;CP05 / CP07 | pass |
| `RuntimeResultLink` | `LinkRuntimeAdmissionResult`；同步 result incorporation | CP03 §2 / §3 | `MemberRuntimeResultLinked`;`GetRuntimeMediationPosture`;CP05 / CP07 | pass；immutable classification，不是 lifecycle owner |
| `RuntimeMaterialReception` | `RuntimeMaterialConsumer` | CP03 §4 | `MemberRuntimeMaterialReceived`;CP04 evaluation;`GetRuntimeMaterialReception`;CP05 / CP07 | pass |
| `RuntimeMediationPolicy` | Command / Consumer 内 guard | CP03 §2 / §4 | 无独立 lifecycle 或传播 | pass；policy 不是状态主体 |

## 9. 待确认事项与 CP03 停审

| 待确认项 | 当前状态 | 对 CP03 的影响与处理 |
|---|---|---|
| `L2M-UP-003` member delivery 与 `RuntimeTriggerContext` exact mapping | pending / blocked | delivery decision 在 mapping 不可证明时为 `blocked` / `pending`；不产生正向 carrier 或 Runtime run 声明。 |
| `L2M-UP-004` committed Runtime material source family / direction | pending / blocked | material reception 只能保留 ref / digest / classification；source 不可证明时 `blocked` / `unknown`。 |
| `L2M-UP-005` member-specific envelope / route | pending / blocked | semantic event candidate、result ingress 与 consumer 逻辑槽位不等于 event / IPC integration。 |
| Runtime polling / resolution continuation | deferred | 当前不设 retry Job；若正式 Runtime contract 要求 polling，必须回开 Step 7 / 8 并定义 resolution evidence、idempotency 与 source owner。 |

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属完整 | pass | delivery、attempt、immutable result link、reception 各有独立 owner / source；policy 未被误升格。 |
| Step 7 / 8 触发覆盖 | pass | 两个 Command、一个 Consumer、两个 Query 与两次本地提交 / external seam 边界可反查。 |
| allowed / forbidden 清楚 | pass | eligible-only preparation、submitted proof、unknown fence、immutable link 和 accepted-reception-only CP04 entry 已明确。 |
| 同名 / 近义状态未压平 | pass | eligible / submitted / accepted / result-linked / reception-accepted 分别绑定 object，且不代答 Runtime truth。 |
| 状态传播不过度 | pass | 只到 trace、projection、body-free query 和 CP04 evaluation；不反写 Runtime 或宣称 delivery / observed。 |
| forbidden body 边界 | pass | raw trigger、model output、hidden reasoning、tool body、secret、outcome 副本均不进入状态、event、trace、projection 或 outbound material。 |
| pending 诚实性 | pass | `L2M-UP-003/004/005` 仍为 pending / blocked / fail-closed，不伪造 IPC、carrier、run 或 integration readiness。 |
| 未下沉到详细设计 | pass | 未定义 schema、enum code、IPC、DB 列、retry实现、run_id、测试结果或证据。 |

CP03 结论为 `completed / pass / stop_review`。下一允许动作是更新 Step 9 主控、概要 flow 与项目台账到 `state_machines:CP04_outbound`，然后创建 CP04 状态机附录；不得提前创建 CP05~CP07 或进入 Step 10。
