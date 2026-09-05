# Step 9 附录 CP02. Inbound Boundary 状态机

> 主控文件: `02_hld_step_09_state_machine.md`
> 对应对象: Step 6 CP02 的 `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision`、`SubscriptionScopePolicy`、`InboundScreeningPolicy`
> 对应接口 / 流: Step 7 CP02 与 Step 8 CP02
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. Step 状态、输入与模块门禁

| 项目 | 内容 |
|---|---|
| 当前模块 | CP02 Inbound Boundary 状态归属、迁移和传播 |
| 输入 | Step 6 CP02 对象骨架、Step 7 CP02 两个 Command / 一个 Consumer / 两个 Query、Step 8 CP02 scope revision / intake / screening 流，以及 Step 9 主控的统一状态规则 |
| 结构化输出 | 三个状态定义表、两张 ASCII 图、允许 / 禁止迁移、传播与对象反查表 |
| gate_status | pass |
| gate_reason | 三个可变状态主体的 owner、触发、正常主线资格、历史语义和外部 truth 排除均已收稳 |
| next_allowed_action | 更新主控与台账到 `state_machines:CP03_runtime_mediation`；随后才允许创建 CP03 状态机附录 |
| source_files | `02_hld_step_06_key_objects_inbound.md`;`02_hld_step_07_interfaces_inbound.md`;`02_hld_step_08_flows_inbound.md`;`02_hld_step_09_state_machine.md` |

## 2. SOP 问题回答与当前材料诊断

### 2.1 本部分哪些状态影响主线

CP02 有三个正式可变状态主体：`SubscriptionScopeStatus`、`InboundIntakeDisposition` 与 `ScreeningDisposition`。两个 policy 是 guard，不拥有独立业务生命周期；`TransientInspectionMarker` 和 `ScreeningInputSummary` 只在授权 inspection window 内形成，不能被提升为状态或持久对象。

| 问题 | 收敛回答 |
|---|---|
| 哪些状态属于 CP02 | scope 的 current / historical 资格、单条事实的本地 intake 分类，以及 accepted intake 的 member 预筛处置。 |
| 每个状态是否能进入正常主线 | 只有 `SubscriptionScopeStatus.active` 可作当前匹配依据；只有 `InboundIntakeDisposition.accepted` 可进入筛选；只有 `ScreeningDisposition.passed` 或明确收窄的 `degraded` 可进入下一步 Runtime delivery 评估。 |
| 哪些入口触发迁移 | scope 由两个 Command 建立或替换；intake / screening 由 `InboundFactConsumer` 的已校验输入形成；Query 无写入。CP06 的 `PolicyContextUpdateConsumer` 只更新中立规则 resolution / gap，不直接重写 CP02 历史。 |
| 是否有同名状态冲突 | `active` 不是 Bus subscription 或 Governance effective；`accepted` 不是 Bus delivered；`passed` 不是 Governance approval 或 Runtime acceptance；`blocked` / `pending` 也分别绑定 object 与原因。 |
| 状态如何传播 | 已提交 CP02 fact 可触发语义 event candidate、CP05 trace 和 CP07 projection stale / read surface；不回写 Bus、Governance 或 Runtime truth。 |

### 2.2 当前材料诊断

| 诊断项 | 风险 | 收敛处理 |
|---|---|---|
| 旧材料把 screening 或 scope 写成泛化订阅 / policy 状态 | 会把 Bus、Governance 与 member local truth 压平 | 只保留 CP02 的 local decision / intake record；外部 policy 仅以 CP06 neutral resolution ref 进入。 |
| rule update 曾被设想为 CP02 的第二个 Consumer | 会形成两个 rule-source owner，历史 re-screening 方向失控 | CP06 是唯一外部 rule-source update owner；CP02 只读取 resolution / gap，并在新输入上形成新决定或显式 stale posture。 |
| raw body 容易被误读为 intake / screening 状态依据 | 会使正文、secret 或 hidden material 进入 member truth | 只允许 `TransientInspectionMarker` / `ScreeningInputSummary` 的 body-free 摘要参与本地判断；它们不形成状态或传播材料。 |
| `passed` 容易被说成“投递成功” | 会越过 Runtime entry / acceptance owner | `passed` 仅解锁 CP03 的 member-side delivery evaluation；Runtime run、acceptance、outcome 仍外置。 |

## 3. 设计取舍与改动前后对比

| 议题 | 未采用 / 改前风险 | 采用的状态设计 | 原因 |
|---|---|---|---|
| 单一 `InboundStatus` | scope、intake、screening 相互覆盖，无法区分当前范围与单条事实 | 三个对象各自拥有状态类型 | owner、触发和失败语义不同。 |
| scope 原地修改 | 当前范围与历史依据消失 | 新 revision 成为 `active`，旧 active 成为 `superseded` | 保留可解释历史并阻止无来源扩权。 |
| duplicate 重新筛选 | 形成第二事实 / decision 主线 | `duplicate` 只复用已保存 receipt / classification | 幂等边界不等于重新授权。 |
| rule change 自动改变历史 screening | CP02 会反写已有 local truth 或把 mirror 当 policy owner | 新 rule resolution 仅影响新 intake 或可见 stale / pending / blocked posture | 历史决定 append-only，re-screening 需要未来重开 owner / idempotency 设计。 |
| unknown / stale 默认通过 | 未闭口 source 会 fail open | `blocked` / `pending` 或显式受控 `degraded` | 服从 `L2M-UP-005/007` 的 fail-closed 口径。 |

## 4. 状态归属与定义

### 4.1 `SubscriptionScopeDecision` / `SubscriptionScopeStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `active` | 当前 project-scoped、来源可回链且 freshness 足够的 member 入站匹配范围。 | 是；只允许作为 `InboundFactConsumer` 的 scope match basis。 | `EstablishSubscriptionScope` / `ReplaceSubscriptionScope`；Step 8 §2。 |
| `superseded` | 已由后一 revision 替换的历史范围决定。 | 否；仅解释既有 fact / screening 的历史依据。 | `ReplaceSubscriptionScope`；Step 8 §2。 |
| `rejected` | proposed scope 已知越界、主语不一致或输入无效。 | 否。 | 两个 scope Command；Step 8 §2。 |
| `blocked` | 必需 source resolution missing / stale / conflict / unknown，不能正向形成范围。 | 否；等待新的显式 command 与正式 source basis。 | 两个 scope Command；Step 8 §2。 |

`active` 只是 member 的当前匹配范围；它不等于 Bus subscription 已建立、Governance authorization effective、source owner accepted 或 Runtime permission。一个 `active` decision 只能在同一 project subject、presence 和明确 revision 语境下使用。

### 4.2 `InboundFactRecord` / `InboundIntakeDisposition`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `accepted` | envelope / source / version / subject / scope 语境可识别，已形成 body-free local fact。 | 是；仅允许形成该 fact 的 `ScreeningDecision`。 | `InboundFactConsumer`；Step 8 §3。 |
| `duplicate` | 同一 source fact 已被本地识别和分类。 | 否；只返回既有 receipt / classification，不建第二主线。 | `InboundFactConsumer`；Step 8 §3。 |
| `unsupported` | contract、schema version 或 fact kind 不在已闭口的 member 范围。 | 否。 | `InboundFactConsumer`；Step 8 §3。 |
| `blocked` | source authority、envelope、安全前置、current scope 或必要 source 完整性不可证明。 | 否；不能进入正向筛选。 | `InboundFactConsumer`；Step 8 §3。 |

`accepted` 表示 member 对 body-free intake context 的本地承接，不表示 L0-bus delivered、source business truth valid、Governance authorized 或 Runtime accepted。raw body 只在 adapter 授权 inspection window 短暂存在，不会成为 `InboundIntakeDisposition` 的持久解释物。

### 4.3 `ScreeningDecision` / `ScreeningDisposition`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `passed` | accepted fact、active scope、rule resolution 与 inspection summary 已满足 member 预筛要求。 | 是；仅进入 CP03 的 Runtime delivery evaluation。 | `InboundFactConsumer` 内的 `ScreeningDecision.decide(...)`；Step 8 §3。 |
| `degraded` | 正式收窄规则明确允许的受控处理语境，保留其 safe reason 与约束。 | 受限；可被 CP03 评估，但不等于 passed / authorized。 | 同上；必须经 `InboundScreeningPolicy.permits_degraded(...)`。 |
| `blocked` | 已知边界、scope、规则或安全要求不满足。 | 否；不得提交 Runtime。 | 同上。 |
| `pending` | rule resolution、必要判断或 source freshness 尚未闭口。 | 否；等待新的正式 resolution 后，在新输入上形成新决定。 | 同上。 |

`ScreeningDisposition` 是 member-side pre-screening，不能代表 Governance policy / approval decision，也不能代表 Runtime admission、run creation、outcome 或 Bus delivery。`degraded` 的收窄资格不能在 Query 或 projection 中被改写为 `passed`。

## 5. 状态流转图

#### CP02 状态流转图

```text
SubscriptionScopeDecision
  <new scope command>
          │ EstablishSubscriptionScope
          │ ReplaceSubscriptionScope
          ▼
  active / rejected / blocked
          │ replace with verified new basis
          ▼
  prior active -> superseded

InboundFactRecord
  <validated source event>
          │ InboundFactConsumer
          ▼
  accepted / duplicate / unsupported / blocked
          │ accepted only
          ▼
ScreeningDecision
  passed / degraded / blocked / pending
```

关键说明：

- 图只表达 CP02 local decision、intake classification 与 screening disposition；不表达 Bus topic / route、full envelope、rule body、adapter implementation、transaction 或 retry 参数。
- `accepted` intake 到 screening 是显式跨对象资格关系，不是同一状态机中的“成功升级”；`active` scope 是其前置依据，不是 external subscription truth。
- `superseded` 只描述被替换的 scope revision，不能承接新的入站匹配；`duplicate`、`unsupported` 和 `blocked` intake 都不能隐式进入 screening。
- `passed` / `degraded` 仅把 safe context 交给 CP03 的评估入口，不直接创建 Runtime run 或宣称 Runtime accepted。

#### CP02 状态传播关系图

```text
<Committed scope / intake / screening revision>
          │
          ▼
<MemberSubscriptionScopeChanged /
 MemberInboundFactRecorded /
 MemberScreeningDecided candidate>
          │
          ├─ <MemberCommittedFactConsumer> -> <CP05 trace link / gap>
          │
          ├─ <MemberProjectionUpdateConsumer> -> <CP07 projection stale / watermark>
          │
          ├─ <Screening passed or controlled degraded>
          │       -> <CP03 delivery evaluation, not Runtime acceptance>
          │
          └─ <GetCurrentSubscriptionScope / GetScreeningDisposition>
                  -> <body-free status / freshness surface>
```

关键说明：

- semantic event candidate 与 logical committed-fact propagation 不等于 exact L0-bus carrier、route 或 delivery；这些继续受 `L2M-UP-005` 阻塞。
- CP06 rule resolution / gap 可使新 intake 的 screening 形成 `pending` / `blocked` 或正式收窄的 `degraded`，但 CP02 不消费第二个 rule-source event，也不反写 Governance truth。
- CP05 / CP07 只能消费 committed local refs；它们不能把 projection freshness、trace gap 或 outlet availability 反向改写 scope、intake 或 screening source fact。
- Query 只返回 body-free posture，不触发 scope replacement、rule refresh、re-screening、Runtime submission 或任何状态迁移。

## 6. 允许的核心迁移

| 对象 | 允许迁移 | 触发动作 / 前置 | 本地结果与边界 |
|---|---|---|---|
| `SubscriptionScopeDecision` | `<new> -> active` | `EstablishSubscriptionScope` 或 `ReplaceSubscriptionScope`；presence、project subject、source purpose / freshness 与 scope policy 可证明 | 追加 current active revision；仅供 member 入站匹配。 |
| `SubscriptionScopeDecision` | `<new> -> rejected` | scope 越 project / subject 边界，或输入已知无效 | 追加 rejected decision；不改变已有 active revision。 |
| `SubscriptionScopeDecision` | `<new> -> blocked` | resolution missing / stale / conflict / unknown，或 `L2M-UP-007/008` 影响前置 | 追加 blocked decision；不得静默继承旧 source 扩权。 |
| `SubscriptionScopeDecision` | `active -> superseded` | `ReplaceSubscriptionScope` 已成功形成新的 active revision | 旧 revision 保留为历史；不是原地覆盖。 |
| `SubscriptionScopeDecision` | `blocked / rejected -> active / rejected / blocked` | 新的显式 scope Command 与新的正式 basis | 形成 successor decision；旧记录不改写。 |
| `InboundFactRecord` | `<new> -> accepted` | `InboundFactConsumer` 完成 envelope / source / version / dedup / scope gate，且 current active scope covers fact descriptor | 追加 body-free fact；只允许后续 screening。 |
| `InboundFactRecord` | `<new> -> duplicate` | dedup store 能回链既有 source event / local receipt | 返回既有分类；不创建第二 fact 或 screening 主线。 |
| `InboundFactRecord` | `<new> -> unsupported` | fact kind、schema version 或 formal contract 不在当前范围 | 追加安全分类；不推断兼容性。 |
| `InboundFactRecord` | `<new> -> blocked` | source / envelope / scope / inspection authorization 不可证明 | 追加 blocked classification；不得进入 screening。 |
| `ScreeningDecision` | `<new> -> passed` | accepted fact、active matching scope、fresh rule resolution 与 inspection summary 都可证明符合 policy | 追加 member pre-screening decision；只供 CP03 评估。 |
| `ScreeningDecision` | `<new> -> degraded` | accepted fact 且正式收窄规则通过 `permits_degraded(...)` 明确允许 | 追加受控 disposition 与 safe reason；不能改写为 passed。 |
| `ScreeningDecision` | `<new> -> blocked` | 已知违反 scope / rule / safety gate | 追加 fail-closed decision；不得提交 Runtime。 |
| `ScreeningDecision` | `<new> -> pending` | rule resolution、freshness 或必要判断尚未闭口 | 追加 pending decision；等待新的 formal basis，不自动放行。 |
| `ScreeningDecision` | `pending / blocked -> passed / degraded / blocked / pending` | 仅针对新 intake 或显式新 decision，且具有新的 accepted fact / source resolution basis | 形成新 decision / correlation；不原地重裁历史 decision。 |

## 7. 禁止迁移与状态红线

| 禁止迁移或行为 | 原因 |
|---|---|
| `SubscriptionScopeDecision.active` 原地扩权或静默修改 scope | 必须通过显式 revision 和正式 source basis；旧决定只能 superseded。 |
| `superseded` scope 再次作为当前入站匹配依据 | 防止历史范围重新取得当前授权语义。 |
| `rejected` / `blocked` scope 因时间流逝或 Query 自动变为 active | source 缺口必须由新的 command 与正式 resolution 处理。 |
| 在非 `active` scope 下将新事实标为 accepted | 防止绕过 member 的当前匹配边界。 |
| `duplicate` / `unsupported` / `blocked` intake 形成新的 screening decision | 只有 accepted intake 可被筛选；避免第二主线或 fail open。 |
| 用 Bus delivered、source sender identity 或 raw body 直接把 intake 升为 accepted | delivery / source truth 外置；raw body 不得成为持久状态依据。 |
| `pending` / `blocked` screening 自动变为 passed 或 degraded | unknown / stale / gap 必须有新 formal basis；不能按时间、retry 或 read path升级。 |
| `degraded` 被 Query、projection 或 CP03 默认视作 passed / authorized | degraded 的受控收窄语义必须保留。 |
| rule update 直接重写既有 `ScreeningDecision` 或触发隐式 backlog re-screening | CP06 是 source-update owner；历史重裁需另行定义 owner、idempotency 与审计。 |
| screening state 直接创建 Runtime run、Runtime acceptance 或 Governance decision | CP02 仅交 member-side pre-screening / delivery evaluation input。 |
| CP05 / CP07、Query 或 Job 反向修改 CP02 source status | trace、projection、read 和 operation continuation 不拥有 scope / intake / screening truth。 |

## 8. 状态触发覆盖、对象反查与传播审计

| 状态主体 / 非状态对象 | Step 7 触发接口 | Step 8 处理流 | 传播 / 查询承接 | 审计结论 |
|---|---|---|---|---|
| `SubscriptionScopeDecision` | `EstablishSubscriptionScope`;`ReplaceSubscriptionScope` | CP02 §2 scope revision flow | `MemberSubscriptionScopeChanged`;`GetCurrentSubscriptionScope`;CP05 / CP07 | pass |
| `InboundFactRecord` | `InboundFactConsumer` | CP02 §3 inbound fact flow | `MemberInboundFactRecorded`;CP05 / CP07 | pass |
| `ScreeningDecision` | `InboundFactConsumer` 内 `ScreeningDecision.decide(...)` | CP02 §3 inbound fact flow；§4 body-free query | `MemberScreeningDecided`;CP03 evaluation;`GetScreeningDisposition`;CP05 / CP07 | pass |
| `SubscriptionScopePolicy` | 两个 scope Command 内 guard | CP02 §2 | 无独立 lifecycle 或传播 | pass；policy 不是状态主体 |
| `InboundScreeningPolicy` | `InboundFactConsumer` 内 guard | CP02 §3 | 无独立 lifecycle；不持有 rule body | pass；policy 不是状态主体 |
| `TransientInspectionMarker` / `ScreeningInputSummary` | adapter 授权 inspection window | CP02 §3 | 不传播，不进入 trace / projection / event | pass；仅短暂 body-free input |

## 9. 待确认事项与 CP02 停审

| 待确认项 | 当前状态 | 对 CP02 的影响与处理 |
|---|---|---|
| `L2M-UP-005` member-specific event family、carrier、route | pending / blocked | semantic event candidate / logical envelope 不能解释为 Bus integration 或 delivered。 |
| `L2M-UP-007` rule taxonomy、source freshness 与 exact rule contract | pending / blocked | source 不可证明时 screening 停在 `pending` / `blocked`；`degraded` 只能由已正式化的收窄规则触发。 |
| `L2M-UP-003` member-to-Runtime entry mapping | pending / blocked | `passed` / `degraded` 仅进入 CP03 delivery evaluation，不能定义 Runtime admission。 |
| backlog re-screening 是否必要 | deferred | 当前不设置 Job，也不改变历史 decision；若提出需求，必须回开 owner / idempotency / audit 设计。 |

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属完整 | pass | scope、intake、screening 三个状态只归各自 local record；policy / marker 未被误升格。 |
| Step 7 / 8 触发覆盖 | pass | 两个 Command、一个 Consumer、两个 Query 与 CP06 rule-source owner 的分工均可反查。 |
| allowed / forbidden 清楚 | pass | revision、accepted-only screening、unknown fence 与 no-re-screening 红线明确。 |
| 同名 / 近义状态未压平 | pass | active / accepted / passed / degraded 分别绑定对象与外部 truth 排除。 |
| 状态传播不过度 | pass | 仅传播 committed local fact、body-free read posture、trace / projection marker 与 CP03 evaluation input。 |
| forbidden body 边界 | pass | raw body、rule body、inspection body 不进入状态、对象、event、trace、projection 或 outbound material。 |
| pending 诚实性 | pass | `L2M-UP-003/005/007/008` 仍为 pending / blocked / fail-closed，不伪造 exact integration 或 readiness。 |
| 未下沉到详细设计 | pass | 未定义 enum、schema、DB 列、topic、route、retry 实现、测试结果或证据。 |

CP02 结论为 `completed / pass / stop_review`。下一允许动作是更新 Step 9 主控、概要 flow 与项目台账到 `state_machines:CP03_runtime_mediation`，然后创建 CP03 状态机附录；不得提前创建 CP04~CP07 或进入 Step 10。
