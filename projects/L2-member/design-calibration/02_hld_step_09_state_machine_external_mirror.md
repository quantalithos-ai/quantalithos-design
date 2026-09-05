# Step 9 附录 CP06. External Context Mirror 状态机

> 主控文件: `02_hld_step_09_state_machine.md`
> 对应对象: Step 6 CP06 的 `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap`、`MirrorResolutionPolicy`
> 对应接口 / 流: Step 7 CP06 与 Step 8 CP06
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. Step 状态、输入与模块门禁

| 项目 | 内容 |
|---|---|
| 当前模块 | CP06 External Context Mirror 的 snapshot、purpose-specific resolution 与 source gap 状态归属、迁移和传播 |
| 输入 | Step 6 CP06 对象骨架、Step 7 CP06 两个 Command / 两个 Query / 五类 owner-specific Consumer / 一个 Job、Step 8 CP06 resolution / refresh / source-update 流，以及 Step 9 主控统一状态规则 |
| 结构化输出 | 两个状态定义表、两张 ASCII 图、五类 source owner 对照、允许 / 禁止迁移、对象反查与 pending 审计 |
| gate_status | pass |
| gate_reason | immutable snapshot、consumer-purpose isolated neutral resolution、append-only source gap、五类 source owner 和下游传播方向已收稳 |
| next_allowed_action | 更新主控与台账到 `state_machines:CP07_member_read_model`；随后才允许创建 CP07 状态机附录 |
| source_files | `02_hld_step_06_key_objects_external_mirror.md`;`02_hld_step_07_interfaces_external_mirror.md`;`02_hld_step_08_flows_external_mirror.md`;`02_hld_step_09_state_machine.md` |

## 2. SOP 问题回答与当前材料诊断

### 2.1 本部分哪些状态影响主线

CP06 有两个正式状态主体：`ExternalContextResolutionStatus` 与 `ExternalContextGapStatus`。`ExternalContextSnapshot` 是 immutable point-in-time support fact；`MirrorResolutionPolicy` 是 anti-corruption guard，二者均不拥有可变业务生命周期。resolution 始终绑定 `ExternalConsumerPurpose` 与 `ExternalContextScope`，不能被不同 consumer 复用或压平。

| 问题 | 收敛回答 |
|---|---|
| 哪些状态属于 CP06 | 特定 ref / snapshot 是否足以供某一 member consumer purpose 使用的 neutral resolution，以及该 purpose / scope 所需外部来源的 source gap。 |
| 每个状态是否能进入正常主线 | 只有 purpose / scope 精确匹配的 `ExternalContextResolutionStatus.resolved` 可供调用方 policy 继续判断；它不直接授权动作。所有非 resolved 状态和未闭合 gap 必须让受影响 consumer 处于 blocked / pending / stale / degraded 的保守姿态。 |
| 哪些入口触发迁移 | `ResolveExternalContext` 捕获 snapshot 并形成 resolution / gap；`RequestExternalContextRefresh` 只登记 gap refresh need；`ExternalContextRefreshJob` 追加新 snapshot / resolution / successor gap；五类 source update Consumer 追加 support fact；Query 无写入。 |
| 是否有同名状态冲突 | `resolved` 不是 authorized / healthy / accepted / available / ready；`stale` 不是 source owner 已失效；`blocked` gap 不是 CP01~05 decision；`unknown` 不能被 last-known snapshot 静默代答。 |
| 状态如何传播 | committed resolution / gap 可让受影响 component 的后续 policy 输入或 read posture 变为 stale / pending / blocked / degraded，也可驱动 CP07 projection stale / outlet marker；不反向重裁 CP01~05 已提交事实或外部 truth。 |

### 2.2 当前材料诊断

| 诊断项 | 风险 | 收敛处理 |
|---|---|---|
| 把 snapshot 当 current truth | old data 会被静默当作可用 / 授权依据 | snapshot 只记录 point-in-time refs；是否可用由 purpose-specific resolution 决定。 |
| 把 `resolved` 写成 authorization、health 或 acceptance | Mirror 会成为第二 policy / registry / host truth owner | resolved 只回答“safe ref / snapshot 对此 purpose 是否足以进入调用方 policy”。 |
| 同一 resolution 跨 startup、screening、runtime-entry、outbound、observation、projection 复用 | scope / freshness 语义被混淆 | 每个 purpose / scope 形成独立 resolution / successor。 |
| 把五类 source Consumer 变成 generic adapter / hub | 外部 schema、registry 和 adapter lifecycle 会侵入 member core | 五类输入共用 envelope 骨架，但 owner authority、port、context kind、purpose 与禁止输出始终独立。 |
| source update 直接重裁 CP01~05 历史 | support truth 会反向改变 source owner 事实 | update 只追加 snapshot / resolution / gap 和受影响 posture；新 domain decision 必须由其自身 Command / Consumer 形成。 |

## 3. 设计取舍与改动前后对比

| 议题 | 未采用 / 改前风险 | 采用的状态设计 | 原因 |
|---|---|---|---|
| 单一 global external-context state | subject、policy、runtime、capability、host route 的 owner / scope / freshness 混在一起 | snapshot + purpose-specific resolution + source gap 三层 | Mirror 是 anti-corruption support truth，不是 registry。 |
| snapshot 原地 refresh | 旧来源历史和 freshness basis 丢失 | 每次 refresh 追加新 immutable snapshot | 保留 source / version / digest / scope 可回链性。 |
| `resolved` 代表业务可用 | Consumer policy 被 Mirror 替代 | resolved 仅允许调用方继续自己的 policy | 保持 owner truth、authorization 和 action guard 分层。 |
| source conflict 选择 last-known | stale / conflict 会 fail open | `stale` / `conflict` / `unresolved` / `unavailable` / `unknown` 显式保留 | 外部来源不可证明时 fail closed。 |
| source update 自动修复 consumer state | 会逆写 CP01~05 local domain truth | 只发布 support fact / affected posture；后续新 decision 使用新 basis | history append-only 且 owner 无环。 |

## 4. 状态归属与定义

### 4.1 `ExternalContextSnapshot`（不可变 support fact）

`ExternalContextSnapshot` 无可迁移生命周期。它只在 owner-specific safe response、source authority、scope、freshness basis 与 forbidden-body gate 可验证时，由 `ResolveExternalContext`、`ExternalContextRefreshJob` 或对应 source Consumer 创建。source change / refresh 形成新的 snapshot；旧 snapshot 不覆盖、不删除，也不自动成为 current / resolved。

### 4.2 `ExternalContextResolution` / `ExternalContextResolutionStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `resolved` | source ref、formal owner、required scope、purpose 与 freshness 均可证明；该 safe input 足以交给该 consumer 的 domain policy 继续判断。 | 受限；仅 `usable_for(...)` 相同 purpose / scope 的 local policy 可继续评估。 | `ResolveExternalContext`、`ExternalContextRefreshJob`、五类 source update Consumer；Step 8 §2~§4。 |
| `stale` | snapshot / source version 已过期或落后于可证明的新来源。 | 否；不能作为 current policy input。 | 同上。 |
| `conflict` | owner、version、scope 或多个正式来源互相冲突。 | 否；不得静默选择一方。 | 同上。 |
| `unresolved` | 尚无足够正式 source、mapping 或 safe snapshot 形成判断。 | 否。 | 同上。 |
| `unavailable` | 正式 owner resolver / seam 当前不可用。 | 否；不等于 owner truth 不存在。 | 同上。 |
| `unknown` | source completeness、freshness 或 resolution side effect 无法证明。 | 否；保持 fence，不用 last-known 放行。 | 同上。 |

`resolved` 从不等于 Governance authorization / approval、host health / session、Runtime admission / run、Tools invocation authorization、Bus delivery、downstream acceptance 或 capability outlet available。任何 resolution 都必须以 `consumer_purpose + required_scope` 限定；同一 source ref 在不同 purpose 下可形成不同、甚至相反的 neutral resolution，而不构成冲突。

### 4.3 `ExternalContextGap` / `ExternalContextGapStatus`

| 状态 | 含义 | 是否可进入下一 member 主线 | 触发入口 / 流 |
|---|---|---|---|
| `open` | consumer 所需 source、mapping、freshness 或 safe snapshot 目前不充分，尚未建立 refresh / resolution continuation。 | 否；受影响 consumer 保留保守 posture。 | `ResolveExternalContext`、五类 source Consumer、refresh continuation；Step 8 §2~§4。 |
| `blocked` | exact contract、owner seam 或 required source 未闭口 / 已知不可用，当前无法正向解析。 | 否。 | 同上或 `RequestExternalContextRefresh`。 |
| `resolution_pending` | 已登记显式 refresh / resolution request，尚未得到新的可回链 result。 | 否；不由 Query 或时间流逝结束。 | `RequestExternalContextRefresh`；Step 8 §3。 |
| `resolved` | 已有 matching neutral resolution / formal reference 足以解释该 local source gap。 | 受限；不等于 consumer action 被授权，consumer 仍须读取 resolution status 并运行自身 policy。 | `ExternalContextRefreshJob` 或 owner-specific source update incorporation。 |
| `unknown` | source or refresh side effect、freshness 或 owner response 无法确认。 | 否；必须保持 fence。 | `ExternalContextRefreshJob` / source update Consumer。 |
| `superseded` | 后继 gap / resolution / snapshot 语境已承接处理，旧 gap 只保留历史。 | 否；只用于追溯。 | append-only refresh / source-update continuation。 |

gap 的 `resolved` 可以表示“该 source gap 已获得正式解释”，但不能遮蔽一个仍为 `stale`、`conflict`、`unavailable` 或 `unknown` 的 resolution；在这种情况下，affected consumer 仍必须 fail closed / degraded / pending。gap 不是外部 source truth，也不拥有自动修复权。

## 5. 五类 source owner 与影响方向

| CP06 Consumer | 唯一允许的 source 语义 | 可追加的 CP06 support truth | 可影响的下游姿态 | 绝不形成或修改 |
|---|---|---|---|---|
| `SubjectIdentityContextUpdateConsumer` | Work / Identity 的 project subject、identity anchor、scope safe refs | subject / identity snapshot、purpose-specific resolution / gap | CP01 startup、CP02 scope 的后续 source freshness / blocked posture | 第三种 execution subject、member / identity body、ProjectMember / GlobalMember truth |
| `PolicyContextUpdateConsumer` | Governance policy snapshot / effective-result ref | policy-source snapshot、screening purpose resolution / gap | CP02 新 intake 的 screening source posture | rule body、approval、authorization；CP02 的第二 rule Consumer |
| `RuntimeBoundaryContextUpdateConsumer` | Runtime boundary / entry contract / safe source refs | runtime-entry / material-source resolution / gap | CP03 后续 mapping / reception posture | Runtime trigger schema、admission、run、context、plan、outcome |
| `CapabilityContextUpdateConsumer` | Tools / Method contract、binding、definition safe refs | capability-source resolution / gap | CP07 outlet stale / gap / not-available marker | capability registry、definition body、provider route、invocation authorization；CP07 直接 source Consumer |
| `HostRouteContextUpdateConsumer` | host / publication / observation boundary safe refs | host / route resolution / gap | CP01 host seam、CP04 publication、CP05 observation 的后续 route posture | host health / registry / session、Bus delivery、route truth |

该表只表达 CP06 到本仓 local support / posture 的单向影响。它不允许这些 consumer 修改外部 owner truth，也不允许 CP01~CP07 反向写 CP06 snapshot / resolution / gap；任何新的 source input 仍须经本表相应 consumer 或 owner-specific port。

## 6. 状态流转图

#### CP06 状态流转图

```text
Owner-specific safe source / update
            │ ResolveExternalContext /
            │ source update Consumer /
            │ ExternalContextRefreshJob
            ▼
ExternalContextSnapshot (immutable)
            │ purpose + scope + freshness evaluation
            ▼
ExternalContextResolution
  resolved / stale / conflict / unresolved / unavailable / unknown
            │ non-usable / source gap detected
            ▼
ExternalContextGap
  open / blocked / unknown ──> resolution_pending ──> resolved
          │                       │
          └───────────────────────┴────────────────> superseded
```

关键说明：

- 图表达 member support truth 的 append-only 方向；snapshot、resolution 与 gap 不是 Work、Identity、Governance、Runtime、Tools、Method、host、Bus 或 downstream truth 的副本。
- resolution status 在同一 `consumer_purpose + required_scope` 内通过新 resolution / successor 记录更新；不同 purpose 之间不是同一状态机迁移。
- `resolved` resolution 只开放调用方继续判断；它不能让任何 consumer 自动成为 accepted、authorized、healthy、available 或 ready。
- refresh / source update 形成新 snapshot / resolution / successor gap，不覆盖旧 snapshot，也不 retroactively 重裁 CP01~05 已提交 fact。

#### CP06 状态传播关系图

```text
<Committed snapshot / resolution / gap revision>
            │
            ▼
<MemberExternalContextResolutionChanged /
 MemberExternalContextGapChanged candidate>
            │
            ├─ <affected CP01~05 future policy / read posture>
            │      -> <blocked / pending / stale / degraded as applicable>
            │
            ├─ <CapabilityContext resolution / gap>
            │      -> <CP07 outlet stale / gap / not_available marker>
            │
            ├─ <MemberProjectionUpdateConsumer>
            │      -> <CP07 projection stale / watermark>
            │
            └─ <GetExternalContextResolution /
                ListExternalContextGaps>
                    -> <body-free neutral posture>
```

关键说明：

- propagation only changes subsequent local policy input, explicit posture, trace / projection marker, or read surface. It does not rewrite an already committed CP01~05 decision, attempt, gap, trace entry or material.
- `PolicyContextUpdateConsumer` is the single rule-source update owner; CP02 reads its committed neutral resolution through `ScreeningRuleSourcePort`, not a second Governance event stream.
- `CapabilityContextUpdateConsumer` is the single Tools / Method source update owner; CP07 consumes committed capability resolution / gap, not a direct Tools / Method source event.
- Query is no-write: it does not resolve, refresh, authorize, choose a source, repair a consumer state, or hide stale / conflict / unknown behind a last-known snapshot.

## 7. 允许的核心迁移

| 对象 | 允许迁移 | 触发动作 / 前置 | 本地结果与边界 |
|---|---|---|---|
| `ExternalContextSnapshot` | `<new> -> immutable snapshot` | owner-specific safe result 的 source authority、scope、version / digest、freshness basis 与 body-free gate 可验证 | 追加 point-in-time support fact；不成为 current truth。 |
| `ExternalContextResolution` | `<new> -> resolved` | snapshot / source ref、owner、purpose、required scope 与 freshness 可证明 | 追加 purpose-specific neutral resolution；只允许 consumer policy 继续判断。 |
| `ExternalContextResolution` | `<new> -> stale` | snapshot 过期、版本落后或 freshness evidence 不满足 | 追加 stale resolution；affected consumer 不得将其作为 current input。 |
| `ExternalContextResolution` | `<new> -> conflict` | owner、version、scope 或多 source evidence 冲突 | 追加 conflict resolution；不得择一默认放行。 |
| `ExternalContextResolution` | `<new> -> unresolved` | source / mapping / snapshot 不足，尚不能形成判断 | 追加 unresolved resolution / applicable gap。 |
| `ExternalContextResolution` | `<new> -> unavailable` | formal resolver / owner seam 无法使用 | 追加 unavailable resolution / applicable gap；不推断 owner truth。 |
| `ExternalContextResolution` | `<new> -> unknown` | source completeness、freshness 或 resolution side effect 不可证明 | 追加 unknown fence / applicable gap。 |
| `ExternalContextResolution` | `stale / conflict / unresolved / unavailable / unknown -> any successor status` | 新的 explicit resolve / refresh / owner-specific update 具有同 purpose / scope 的新 evidence | 创建新 resolution / successor；旧 resolution 不原地覆盖。 |
| `ExternalContextGap` | `<new> -> open` | source missing、stale、conflict、mapping unknown 或 other known insufficiency 有 local basis | 追加 gap；affected consumer 显式保持保守姿态。 |
| `ExternalContextGap` | `<new> -> blocked` | exact contract、owner seam 或 source owner boundary 未闭口 / 不可用 | 追加 blocked gap；不私造 source contract。 |
| `ExternalContextGap` | `<new> -> unknown` | refresh / source side effect、freshness 或 owner response 无法确认 | 追加 unknown gap；不以旧 snapshot 升级。 |
| `ExternalContextGap` | `open / blocked / unknown -> resolution_pending` | `RequestExternalContextRefresh` 已登记 `ExternalRefreshRequestRef` | 追加 pending revision；Command 不长时调用 owner。 |
| `ExternalContextGap` | `open / blocked / resolution_pending / unknown -> resolved` | refresh Job 或 owner-specific update 形成 matching neutral resolution / formal reference | 追加 resolved gap；consumer 仍按 resolution status / own policy 判断。 |
| `ExternalContextGap` | `open / blocked / resolution_pending / resolved / unknown -> superseded` | 新 snapshot、new resolution 或 successor gap 明确承接后续问题 | 追加 superseded revision；保留旧 source / purpose / scope history。 |

## 8. 禁止迁移与状态红线

| 禁止迁移或行为 | 原因 |
|---|---|
| `ExternalContextSnapshot` 被原地 refresh、删除或默认为 current truth | snapshot 是 immutable point-in-time fact；新 source 必须形成新 snapshot。 |
| 一个 `resolved` resolution 跨 consumer purpose / scope 复用 | source sufficient 的语义取决于 purpose、scope 与 freshness。 |
| `resolved` resolution 自动授予 authorization、approval、health、host session、Runtime acceptance、capability invocation 或 outlet availability | Mirror 是 neutral support truth，不拥有业务裁决或外部状态。 |
| `stale` / `conflict` / `unresolved` / `unavailable` / `unknown` 因时间、Query、配置或 last-known snapshot 自动变成 resolved | fail-closed 需要新的 formal evidence 与新的 resolution record。 |
| 五类 source Consumer 被 generic adapter / registry / arbitrary source hub 替代 | 必须保持 owner-specific authority、adapter 和 forbidden-body boundary。 |
| CP06 source update 直接覆盖 CP01~05 已提交 decision、attempt、gap、trace或 material | support fact 只影响后续 policy / read posture，不能反向改 source truth。 |
| CP02 接收第二个 Governance rule-source Consumer，或 CP07 直接接收 Tools / Method source event | 会破坏 CP06 唯一 source owner 与无环传播。 |
| `ExternalContextGap.resolved` 自动让 affected consumer action 成功或清除其 own gap | gap resolved 只解释 Mirror local gap；consumer / source owner 仍独立判断。 |
| Query 创建 snapshot、refresh、gap、authorization 或 consumer state migration | Query 是 no-write read surface。 |

## 9. 状态触发覆盖、对象反查与传播审计

| 状态主体 / 非状态对象 | Step 7 触发接口 | Step 8 处理流 | 传播 / 查询承接 | 审计结论 |
|---|---|---|---|---|
| `ExternalContextSnapshot` | 两个 Command；五类 source Consumer；`ExternalContextRefreshJob` | CP06 §2 / §3 / §4 | resolution / gap source refs；CP07 projection stale | pass；immutable，无独立可变状态 |
| `ExternalContextResolution` | 同上 | CP06 §2 / §3 / §4 / §5 | `MemberExternalContextResolutionChanged`;CP01~05 future policy;CP07;`GetExternalContextResolution` | pass |
| `ExternalContextGap` | 两个 Command；五类 source Consumer；refresh Job | CP06 §2 / §3 / §4 | `MemberExternalContextGapChanged`;affected posture;CP07;`ListExternalContextGaps` | pass |
| `MirrorResolutionPolicy` | Command / Consumer / Job 内 guard | CP06 §2 / §3 / §4 | 无独立 lifecycle 或传播 | pass；policy 不是状态主体 |

## 10. 待确认事项与 CP06 停审

| 待确认项 | 当前状态 | 对 CP06 的影响与处理 |
|---|---|---|
| `L2M-UP-001` host lifecycle / endpoint / feedback contract | pending / blocked | HostRoute source / resolution 无法证明时保持 blocked / gap；不形成 host health / session / registry truth。 |
| `L2M-UP-003/004` Runtime entry mapping、material / handoff source family | pending / blocked | RuntimeBoundary resolution 只能是 ref / safe category；CP03 保持 blocked / pending / unknown，不创建 Runtime schema。 |
| `L2M-UP-005` member-specific carrier / route | pending / blocked | source update envelope、semantic candidate 和 affected marker 不等于 exact event integration。 |
| `L2M-UP-006/008` credential / project execution subject owner contract | pending / blocked | SubjectIdentity resolution 不可证明时 CP01 / CP02 后续路径 fail closed；不建第三种 subject。 |
| `L2M-UP-007` Governance rule taxonomy / freshness contract | pending / blocked | Policy resolution 未闭口时 CP02 新 screening 只能 pending / blocked / formal degraded；Mirror 不创建 rule body或 allowlist。 |
| source refresh cadence、retention、provider / adapter activation | deferred | 当前只定义 append-only refresh / unknown fence；配置、adapter、storage和实现 contract 留 03 / 04。 |

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属完整 | pass | resolution 与 source gap 有独立状态 owner；snapshot / policy 未被误升格。 |
| Step 7 / 8 触发覆盖 | pass | 两个 Command、两 Query、五类 owner-specific Consumer、一个 Job 与 no-write read path 均可反查。 |
| unique source owner | pass | Governance rule update 仅 CP06；Tools / Method update 仅 CP06；CP02 / CP07 只消费 committed neutral support truth。 |
| allowed / forbidden 清楚 | pass | purpose isolation、append-only snapshot、new-evidence successor、gap fence和 no generic hub 均明确。 |
| 同名 / 近义状态未压平 | pass | resolved / stale / blocked / unknown 均绑定 Mirror object，且不代答 consumer或外部 truth。 |
| 状态传播不过度 | pass | 只影响 future policy / explicit posture、CP07 projection、body-free query；不反写 CP01~05、外部 owner或 source body。 |
| forbidden body 边界 | pass | credential、policy / rule body、definition / registry body、Runtime object、host / route body、secret 与 complete log 不进入 snapshot、resolution、gap、event或 projection。 |
| pending 诚实性 | pass | `L2M-UP-001~008` 保持 pending / blocked / fail-closed，不伪造 source contract、route、authorization或 readiness。 |
| 未下沉到详细设计 | pass | 未定义 provider SDK、schema、cache、transaction、DB 列、scheduler实现、真实 job run、测试结果或证据。 |

CP06 结论为 `completed / pass / stop_review`。下一允许动作是更新 Step 9 主控、概要 flow 与项目台账到 `state_machines:CP07_member_read_model`，然后创建 CP07 状态机附录；不得进入 Step 10。
