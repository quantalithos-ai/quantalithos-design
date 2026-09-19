## Step 9. 状态机与状态流转

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 9
- 回填章节：正式 `02-概要设计.md` §9「状态定义与状态流转」

#### 1.1 Step 内计划

- [x] 读取 Step 6 对象状态、Step 7 触发接口和 Step 8 关键处理流
- [x] 区分 Console-owned 状态机、owner-safe 状态轴和外部 owner 状态引用
- [x] 按五个主要组成部分完成状态归属、定义、允许/禁止迁移和停审
- [x] 独立收敛语境、可见性、视图多轴、草稿、请求经历、正式结果引用、主题激活、降级/恢复状态
- [x] 形成状态流转图和状态传播关系图/不画图说明
- [x] 完成跨状态同名语义、触发覆盖、传播边界和三层门禁审计

### 2. 本步输入

- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `projects/L5-console/00-需求文档.md` §10、§13～§14
- `projects/L5-console/01-架构设计.md` §9～§10、§13
- `standards/document/概要设计书写规范.md` §4.9

### 3. SOP 问题回答

1. **本仓有哪些影响主线成立的正式状态？**

   Console 自己正式拥有的状态只有客户端交互状态：`ContextLifecycleState`、`NavigationState`、`DraftValidationState`/草稿阶段、`RequestPhase`、`TopicActivationState` 的消费姿态、局部 `DegradationState`、`RecoveryPlan` 和 `AccessibilityState`。`SourceStatusAxes` 与 `OwnerResultState` 是 owner-safe 结果/引用的保真映射，不是 Console 可推进的业务状态机。

2. **状态含义与正常主线如何判断？**

   verified/visible/fresh-complete-available-coherent/reviewable/active 等只能在各自正式前置成立时进入适用主线；restricted/partial/stale/pending 属于受限主线；expired/revoked/conflict/unknown/unavailable/blocked 必须暂停相应披露或动作。任何一个“绿色”轴都不能覆盖另一个失败轴。

3. **哪些接口或动作触发迁移？**

   `ResolveAccessContext`、`RequestAccessContextSwitch`、`GetNavigationVisibility`、`QueryOwnerView`、`SubmitControlledIntent`、`ReconcileRequestResult`、`GetTopicActivation`、`ConsumeSdkInvalidationHint` 和 `ApplyRecoveryAction` 是主要触发。外部正式 owner result/ref 只更新对应引用/呈现；不能由 Console 内部 timer、route、toast、cache 或 flag 触发业务终态。

4. **哪些迁移允许，哪些禁止？**

   允许显式重验、正式结果应用、owner-safe requery、撤销/过期收紧、局部 recovery；禁止 unknown→confirmed、accepted→confirmed（无正式 result）、revoked/expired→verified（无重验）、pending/blocked→active（无正式 activation）、partial/stale→complete/fresh（无新 owner result）、任何 UI signal→owner terminal。

5. **状态变化如何传播？**

   Console 没有 outbox、业务事件或下游 projection。状态传播只在客户端内部从正式输入/交互状态到 view model、导航收紧、动作禁用、恢复计划、焦点/播报和安全诊断。可选 SDK invalidation hint 只标记本地影子失效，随后必须重新 Query。

6. **每个状态属于哪个组成部分或对象？**

   见 §7.1 状态归属表。相同词（如 `unknown`、`pending`）必须带主语：context unknown、source unknown、request unknown、activation pending，不能合为全局 `ConsoleStatus`。

7. **触发接口和处理流是否已定义？**

   是，所有迁移均可回指 Step 7 接口和 Step 8 流；没有“定时自动成功”“后台重试”“统一健康计算”等无来源触发。

8. **是否存在跨部分同名/近义状态冲突？**

   通过“状态主语 + 来源”消解：`RequestPhase.confirmed` 只能由 `ResultReference` 的 owner 正式终态触发；`TopicActivationState.active` 只表示消费 surface 可用，不表示 capability readiness；`availability=available` 只表示该来源可访问，不表示合规/健康。

9. **每个组成部分是否通过停审？**

   五部分均通过，见 §7.11；owner 状态机、审批/治理、archive/sandbox 任务和 capability readiness 均未迁入。

### 4. 当前文档问题诊断

| 材料/位置 | 当前问题 | 修正 |
|---|---|---|
| 旧 `PanelState` / `UnifiedDashboard` | loading/success/error 可能压平所有 owner 与业务语义 | 拆为 context、source axes、request/result、activation、degradation 等带主语状态 |
| 旧 action flow | accepted/toast/refresh 与 completed 混淆 | `RequestPhase` 与 `OwnerResultState` 分层，正式 result 才能收口 |
| 旧 permission hint | visible/disabled 可能被理解为本地授权状态机 | `TopicVisibility` 只消费正式结果并可进一步收紧，不生成 allow/deny |
| draft/上游参考 | Workspace/治理/capability/archive/sandbox 状态机可能被复制 | 只保留 owner-safe ref/status axes；owner state transition 完全留在 owner |
| 状态传播 | 未说明变化如何影响导航、动作、缓存和 a11y | 明确客户端内部传播，且无业务 event/outbox/projection |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态主语 | 全局 panel/dashboard 状态 | 每个对象/owner/主题独立状态 | 防止语义串线 |
| 权限状态 | 本地 permission hint | 正式 visibility/qualification 的呈现姿态 | 防止 fail-open |
| 结果状态 | request 与 business result 合并 | draft/request/result 三层 | 保持 receipt/unknown/终态边界 |
| 健康状态 | 单一 loading/error/green | freshness/coverage/availability/consistency 多轴 | 防止伪造 health/compliance/readiness |
| 传播 | 隐含全局刷新 | 明确局部 invalidation→view/action/a11y | 保持故障隔离和可访问等价 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：统一 `ConsoleStatus` 状态机 | 实现表面简单 | 压平来源、权限、结果和故障，产生第二真相 | 不采用 |
| 方案 B：复制每个 owner 的领域状态机 | 页面看似完整 | Console 变成 owner truth 的副本，难以同步撤销和演进 | 不采用 |
| 方案 C：只定义客户端交互状态机，并将 owner 状态保持为不可推进的多轴/ref | 单一真相清晰、可局部降级、支持恢复 | 状态主语较多，需要严格命名 | 采用 |

### 7. 结构化中间产物

#### 7.1 按主要组成部分的状态归属表

| 主要组成部分 | 状态主语 | 状态所有权 | 触发接口/流 | 是否为独立状态机 |
|---|---|---|---|---|
| 访问语境与导航 | `ContextLifecycleState`、`NavigationState`、`TopicVisibility` | Console 只拥有生命周期/导航呈现；正式 actor/scope/visibility 归 owner | bootstrap、context switch、visibility query、invalidation | 是（客户端安全状态机） |
| 来源保真视图 | `SourceStatusAxes`、snapshot validity | 多轴值来自 owner-safe result；Console 只拥有快照失效姿态 | owner query、safe link、invalidation/requery | 否（保真状态轴，不可本地推进 owner truth） |
| 受控意图与结果 | `DraftIntent`、`RequestPhase`、`OwnerResultState` 引用 | draft/request 经历归 Console；result state 归 owner | draft、submit、receipt、reconcile | Draft/Request 是；OwnerResult 不是 |
| 管理主题组织 | `TopicActivationState`、`TopicVisibility` | 消费 surface 姿态归 Console；activation authority/资格归 owner | activation query、topic query、contract change | 是（能力级消费姿态，不是 readiness） |
| 韧性与可访问交互 | `DegradationState`、`RecoveryPlan`、`AccessibilityState` | Console 交互/呈现状态 | query/command failure、invalidation、recovery action | 是（局部交互状态） |

#### 7.2 语境生命周期状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `unresolved` | 尚无可验证的正式语境 | 否 | 只能显示最小壳和重验入口 |
| `verified` | actor/scope/visibility 引用已在当前时点可验证 | 是（受正式 visibility 上限） | 不是永久认证或本地授权证明 |
| `restricted` | 只允许最小披露或有限入口 | 受限 | reason 仅按正式允许粒度呈现 |
| `expired` | 语境有效期/当前性不足 | 否 | 清理敏感选择和旧 safe view/ref，等待重验 |
| `revoked` | 正式来源撤销旧语境/资格 | 否 | 立即收紧，不继续沿用缓存 |
| `conflict` | 多个正式材料互相冲突 | 否 | 不由 Console 选一个“更可信”来源放行 |
| `unknown` | 无法安全判定语境 | 否 | fail-closed，保留最小恢复方向 |

#### 7.3 语境生命周期状态流转图

```text
<unresolved>
      │ ResolveAccessContext（正式可验证）
      ▼
  <verified> ── visibility 收紧 ──> <restricted>
      │ 过期 / 撤销 / 冲突 / 无法判定
      ├────────> <expired>
      ├────────> <revoked>
      ├────────> <conflict>
      └────────> <unknown>

<restricted / expired / revoked / conflict / unknown>
      │ 显式 ResolveAccessContext / RequestAccessContextSwitch
      │ 且获得新的正式可验证结果
      └──────────────────────────────> <verified 或 restricted>
```

关键说明：

- 只有正式重验结果能进入 `verified`；本地 route、flag、cache 或用户选择不能。
- `revoked`/`expired` 不自动恢复；旧快照和敏感导航必须先收紧。
- `restricted` 是可用上限而非错误或隐式 allow。
- 图不表示 identity/session owner 的内部认证状态机。

允许的核心迁移：

- `unresolved -> verified | restricted | unknown`
- `verified -> restricted | expired | revoked | conflict | unknown`
- `restricted -> verified | expired | revoked | conflict | unknown`（须有正式新结果）
- `expired | revoked | conflict | unknown -> verified | restricted`（须显式重验和正式新结果）

禁止的核心迁移：

- `expired | revoked | conflict | unknown -> verified`（无正式重验）
- `route/menu/button/cache/feature-flag -> verified`
- 任一客户端状态 -> 正式 actor/scope/授权 truth

#### 7.4 Topic visibility 状态定义与迁移

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `visible` | 正式结果允许发现适用主题/动作 | 是（仍受资格和语境约束） | 不等于 command 可执行或已批准 |
| `restricted` | 可安全说明受限，但不能披露更多 | 受限 | reason 最小披露 |
| `disabled` | 入口可见但当前正式条件不允许动作 | 受限/只读 | 不能仅靠前端开关恢复 |
| `unknown` | visibility/资格不可判定 | 否 | fail-closed，不泄露对象存在性 |
| `unavailable` | 正式 surface 或来源不可用 | 否/局部 | 与 denied/restricted 不同 |

允许迁移：正式 visibility/qualification 查询或撤销提示可在上述状态间更新；Console guard 只能从更开放姿态收紧为 `restricted/disabled/unknown/unavailable`。

禁止迁移：本地角色、route、menu、flag、缓存、历史页面或 mock 不得把任何状态提升为 `visible`；`unknown` 不得等同 `restricted` 或 `denied`。

#### 7.5 Owner view 多轴状态定义

| 状态主语 | 状态集合 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `freshness` | `fresh / stale / expired / unknown` | `fresh` 是；`stale` 受限；其余否 | 不写固定 TTL；以 owner/SDK 当前性语义为准 |
| `coverage` | `complete / partial / missing / not_covered` | complete 是；partial 受限；其余否/不适用 | 正式空与 missing/not-covered 分离 |
| `availability` | `available / degraded / unavailable / unknown` | available 是；degraded 受限；其余否 | 只描述该 owner surface，不代表整体可用性 |
| `consistency` | `coherent / conflict / unknown` | coherent 是；其余否 | 不由 Console 解决 owner 冲突 |
| snapshot validity | `current / stale / invalidated / revoked` | current 是；stale 受限；其余否 | 只描述本地影子是否仍可呈现 |

状态轴更新规则：

- `QueryOwnerView` 的正式安全结果可以更新各轴和 snapshot validity。
- `ConsumeSdkInvalidationHint`（若激活）只能把 snapshot 收紧为 stale/invalidated，不能把任何轴提升为成功。
- requery 获得新正式结果后才能恢复 fresh/complete/available/coherent/current。
- 任一轴失败都必须保留；禁止把 `(fresh, partial, available, conflict)` 压成单一成功或失败。

本部分不画独立状态流转图：这些是彼此正交的 owner-safe 状态轴，不应被误画为一个线性生命周期。其传播已在 §7.12 总图中说明。

#### 7.6 DraftIntent 状态定义与流转

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `editing` | 用户正在编辑未提交意图 | 是（本地） | 不代表 owner 对象存在或可修改 |
| `invalid` | 本地格式/需求级检查未通过 | 否（不可提交） | 不替代 owner 业务校验 |
| `reviewable` | 可进入提交前复核 | 是（受限） | 仍需当前语境/资格/正式 surface 重验 |
| `submitted` | 已作为一次 command 尝试的来源 | 不适用 | 不表示 accepted/confirmed，是否继续编辑由详细生命周期决定 |
| `discarded` | 用户放弃或安全清理 | 否（终止） | 不向 owner 产生业务副作用 |

```text
<editing> ── 本地校验失败 ──> <invalid>
    │              │ 修正
    │ 校验通过     └──────────> <editing>
    ▼
<reviewable> ── 正式前置通过且显式确认 ──> <submitted>
    │
    └── 用户放弃 / 安全清理 ───────────> <discarded>
<editing / invalid> ── 用户放弃 / 安全清理 ──> <discarded>
```

关键说明：

- `reviewable` 不是 owner-valid 或 authorized；提交前必须重新验证。
- `submitted` 只连接到 `RequestPresentation`，不转换成 owner 对象生命周期。
- `discarded` 清理本地草稿，不撤销/删除任何 owner 对象。

禁止迁移：`invalid -> submitted`、`discarded -> submitted`、`reviewable -> confirmed`；草稿状态不能直接触发 owner 终态。

#### 7.7 RequestPresentation 与 ResultReference 分层状态

| 层次 | 状态 | 含义 | 是否可进入正常主线 | 来源 |
|---|---|---|---|---|
| Request | `submitted` | 已发起交互尝试 | 受限 | Console 入口记录 |
| Request | `accepted` | owner 正式 receipt 表示已受理 | 受限 | `ReceiptReference` |
| Request | `pending` | owner 工作尚未形成终态 | 受限 | 正式 status/result ref |
| Request | `confirmed` | owner 正式结果确认成功 | 是（结果已判别） | `ResultReference` + `CompletionGuard` |
| Request | `rejected` | owner 正式拒绝/失败终态 | 否（结果已判别） | `ResultReference` |
| Request | `unknown` | 提交/响应中断或无法判定 | 否 | transport ambiguity / 缺正式回查 |
| Owner Result Ref | `confirmed / rejected / pending / unknown` | owner 正式状态引用 | 只读映射 | owner formal result/reconciliation |

#### 7.8 请求经历与正式结果状态流转图

```text
DraftIntent.reviewable
      │ SubmitControlledIntent + 显式确认 + 前置重验
      ▼
  <submitted>
      │ formal receipt                 │ 拒绝（正式结果）
      ▼                                ▼
  <accepted> ── owner still working ─> <pending>
      │                │                    │
      │ formal result  │ interruption       │ formal result
      ▼                ▼                    ├────> <confirmed>
<confirmed / rejected> <unknown>             └────> <rejected>
                           │
                           │ ReconcileRequestResult + 正式结果
                           └──────────────> <pending / confirmed / rejected / unknown>
```

关键说明：

- `accepted`/`pending` 不是成功；只有正式 `ResultReference` 能进入 confirmed/rejected。
- 任一阶段发生不可判定中断可进入 `unknown`；unknown 通过 Query 回查，而不是 command 重放。
- `confirmed/rejected` 是本地对 owner 正式结果的呈现终态，不是 Console 自己生成的业务终态。
- 图不表达 owner 内部长时任务、审批或事务状态机。

允许的核心迁移：

- `submitted -> accepted | pending | confirmed | rejected | unknown`（后四者须正式结果/不可判定事实）
- `accepted -> pending | confirmed | rejected | unknown`
- `pending -> confirmed | rejected | unknown`
- `unknown -> pending | confirmed | rejected | unknown`（仅正式 reconciliation）

禁止的核心迁移：

- `transport_success | toast | refresh | cache_hit -> confirmed`
- `accepted -> confirmed`（无正式 ResultReference）
- `unknown -> submitted`（自动重放）
- 本地随机 key/时间戳 -> 正式幂等证明

#### 7.9 TopicActivationState 定义与流转

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | exact contract 或 activation 未闭口 | 否/仅显示说明 | 当前八类主题默认从此姿态开始 |
| `read_only` | 正式安全 Query 可用，Command 不成立 | 是（只读） | 是完整且诚实的只读闭环 |
| `partial` | 只有部分 owner/能力/safe-field 可用 | 受限 | 必须逐 owner/区域说明 coverage |
| `active` | 所需正式 surface、safe-field、资格和结果语义均可判别 | 是 | 只表示 Console 消费能力可用，不表示 owner readiness |
| `blocked` | 缺安全前置、资格、合同或 reconciliation | 否 | 禁止以 flag/mock 绕过 |

```text
<pending>
    │ 正式 read surface + safe-field 成立
    ├────────────> <read_only>
    │ 部分 owner / 能力成立
    ├────────────> <partial>
    │ 全部适用前置成立
    └────────────> <active>

<read_only / partial / active>
    │ 合同缺失、撤销、语境/资格无法验证、结果语义冲突
    └────────────> <blocked 或 pending/partial>
```

关键说明：

- 激活按主题/owner/能力独立，不存在一键“Console ready”。
- `active` 不生成 capability、archive 或 sandbox readiness，也不证明集成/测试已发生。
- 从 blocked/pending 提升必须有正式 owner/SDK authority；配置和 UI 状态只能收紧。

禁止迁移：`feature_flag/mock/page_exists/plan -> active`；`read_only -> active`（无正式 command/result/资格）；一个 owner active 不使整个主题 active。

#### 7.10 DegradationState 与 RecoveryPlan 状态

| 状态主语 | 状态集合 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| availability | `available / degraded / unavailable` | 是 / 受限 / 否 | 局部 owner/topic/interaction |
| freshness | `fresh / stale / expired / unknown` | 是 / 受限 / 否 / 否 | 不固定 TTL |
| coverage | `complete / partial / missing` | 是 / 受限 / 否 | 不把 missing 当 empty |
| consistency | `coherent / conflict / unknown` | 是 / 否 / 否 | 冲突不自动择优 |
| recovery posture | `requery / revalidate / reconcile / keep_draft / exit / blocked` | 取决于原因 | allowed/blocked action 集，不是 owner 状态 |

```text
<local normal posture>
      │ query/command/visibility 失败、失效提示或结果冲突
      ▼
<degraded / stale / partial / unavailable / conflict / unknown>
      │ RecoveryPlan 按原因选择
      ├─ requery ─────> 等待新的 owner-safe Query
      ├─ revalidate ──> 等待新的正式 AccessContext
      ├─ reconcile ───> 等待正式 ResultReference
      ├─ keep_draft ──> 保留安全本地草稿
      ├─ exit ────────> 清理敏感呈现并离开
      └─ blocked ─────> 无安全恢复，不推进

新的正式结果到达 ──> 更新对应局部状态；未到达前不提升为正常
```

关键说明：

- recovery 不统一为 retry；unknown 副作用没有正式依据时必须 blocked。
- 状态始终局部到 owner/topic/interaction，禁止生成全局 health/compliance/readiness。
- a11y 焦点/播报跟随同一状态变化，不改变迁移规则。

#### 7.11 五个主要组成部分状态归属停审

| 组成部分 | 状态是否归属于 Step 6 对象 | 触发接口/流是否存在 | 允许/禁止迁移是否清楚 | 越界检查 | 结果 |
|---|---|---|---|---|---|
| 访问语境与导航 | 是 | bootstrap/context switch/invalidation | 是 | 无 identity/authorization state machine | 通过 |
| 来源保真视图 | 是；明确为多轴/快照状态 | owner query/invalidation/requery | 是；不强画线性机 | 无 owner projection/truth | 通过 |
| 受控意图与结果 | 是；draft/request/result 分层 | draft/submit/reconcile | 是 | 无 owner 业务/审批/幂等机 | 通过 |
| 管理主题组织 | 是 | activation/topic query | 是 | active 不等于 readiness | 通过 |
| 韧性与可访问交互 | 是 | failure/invalidation/recovery | 是 | 无全局 health/audit | 通过 |

#### 7.12 状态传播关系图

```text
正式输入
  AccessContext / visibility / owner result / receipt / result ref / invalidation hint
          │
          ▼
Console 状态对象
  ContextLifecycleState
  SourceStatusAxes + snapshot validity
  DraftIntent + RequestPresentation
  TopicActivationState + DegradationState
          │
          ├────────> NavigationState / TopicViewModel（入口和动作收紧）
          ├────────> OwnerViewModel / ResultPresentationView（来源和结果保真）
          ├────────> RecoveryPlan（允许/阻断恢复动作）
          ├────────> AccessibilityState（焦点、播报、非颜色语义）
          └────────> DiagnosticContext（最小安全诊断，非 audit）

不存在：Console outbox / 业务事件 / owner projection / 下游 truth 传播
```

关键说明：

- 状态传播只影响客户端呈现、交互和恢复上限，不反写 owner。
- 正式结果/撤销可以收紧或更新对应状态；本地呈现不能反向生成正式状态。
- 诊断是旁路，失败不改变业务结果、资格或恢复安全。
- 图不表达组件更新机制、store、event loop 或实现级订阅方式。

#### 7.13 跨状态一致性审计

| 审计项 | 结论 |
|---|---|
| 状态主语 | 每个状态均绑定 context/source/snapshot/draft/request/result/topic/degradation/recovery；没有全局 `ConsoleStatus`。 |
| 同名状态 | `unknown`/`pending` 等必须带主语；不能跨对象自动等价或传播成功。 |
| 触发覆盖 | 每个迁移都有 Step 7 接口或 Step 8 处理流来源；无 timer/toast/cache/flag 伪触发。 |
| 结果分层 | 草稿、请求经历、receipt、owner result ref 独立；confirmed 只来自正式结果。 |
| Owner 状态 | governance/audit/capability/archive/sandbox/workspace 等状态只读映射，不复制其状态机。 |
| 传播边界 | 只传播至 view/navigation/action/recovery/a11y/diagnostic；无 outbox、下游事件或业务 projection。 |
| 降级边界 | 各 owner/topic 局部、多轴保真；成功不掩盖 partial/stale/conflict/unknown。 |
| Pending 保真 | exact contract、scope/visibility、safe-field、reconciliation、activation、生命周期和量化仍 open。 |

### 8. 回填草稿

正式 §9 回填：状态归属表、语境生命周期、Topic visibility、owner view 多轴、DraftIntent、Request/Result 分层、Topic activation、Degradation/Recovery 的定义与核心迁移；保留语境、草稿、请求结果、activation、recovery 五张状态图和状态传播图。完整停审与跨状态审计留在 calibration。

正式正文应明确：`SourceStatusAxes` 和外部 `OwnerResultState` 是只读保真映射，不是 Console 可推进的状态机；没有统一 health/compliance/audit/readiness 状态机。

### 9. 待确认事项

- owner exact 状态、result terminal、receipt、reconciliation 和撤销传播决定 Request/Result 状态映射的精确细节；当前不发明枚举全集。
- freshness/coverage/availability/consistency 的每 owner 表达和时间依据未闭口；当前只固定必须独立保真。
- Topic activation 的 exact 条件和八类主题逐能力矩阵未闭口；默认 `pending/blocked/read_only/partial`。
- 草稿/request/pref 的持久介质、生命周期、跨会话/设备和清理触发未闭口；不影响 owner truth。
- SDK invalidation hint 重复/乱序/范围和 a11y 播报去重交给 03/04/05；当前不伪造支持矩阵。

### 10. 进入下一步条件与三层门禁

- 已明确 Console 存在客户端交互状态机，但不存在 owner 业务/治理/执行状态机副本。
- 五个主要组成部分完成状态归属停审；每个状态可回指 Step 6 对象、Step 7 接口和 Step 8 流。
- 状态定义、允许/禁止迁移、状态图与传播边界完整；多轴状态未被强行线性化。
- unknown、revoked、expired、conflict、partial、stale、blocked 未被降级成成功；无统一 readiness/health/compliance/audit 状态。

| 门禁 | 结论 | 证据 |
|---|---|---|
| Step / 模块级 | `pass` | 状态定义、五张状态图、传播图、允许/禁止迁移、逐部分停审和跨状态审计完成。 |
| 文档级 | `pass` | 对象/接口/处理流/状态主语一致；未引用未定义对象或迁入 owner 状态机。 |
| 项目级 | `pass` | 允许进入 Step 10 异常与边界；正式 `02` 仍锁定至 Step 14，持续 blocker 原样传递。 |
