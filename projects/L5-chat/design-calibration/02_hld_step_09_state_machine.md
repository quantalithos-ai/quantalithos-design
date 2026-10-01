# L5-chat 02 · Step 9 状态定义与状态流转

> Step 状态：`done`
> gate_status：`pass`
> 本步主题：把命令结果、访问姿态、材料新鲜度、正式变化连续性、平台能力、草稿和本地投影等状态轴单独收稳，明确允许/禁止迁移及传播关系。
> 生成依据：`standards/document/概要设计讨论流程_SOP.md` §5 Step 9；`standards/document/概要设计书写规范.md` §4.9。
> 上游输入：`02_hld_step_06_key_objects.md`、`02_hld_step_07_api_outline.md`、`02_hld_step_08_processing_flows.md`、`projects/L5-chat/00-需求文档.md` §7/§10、`projects/L5-chat/01-架构设计.md` §9/§10。

## 1. Step 内计划

| 子阶段 | 状态集合 | 状态 | 门禁 |
|---|---|---|---|
| 读取对象/流 | Step 6 对象、Step 7 接口、Step 8 处理流 | `done` | 状态触发点均有来源 |
| 命令结果轴 | draft/submitted/pending/confirmed/rejected/failed/unknown | `done` | 结果门控与非重放通过 |
| 安全/材料轴 | access、visibility、freshness | `done` | fail-closed 和来源语义通过 |
| 连续性轴 | fresh/stale/gap/reconnecting/resuming/restricted/blocked/needs-action | `done` | formal change/resume 边界通过 |
| 平台/本地轴 | platform capability、draft、local projection、accessibility | `done` | 不混入业务结果 |
| 状态传播与审计 | 传播关系图、允许/禁止迁移、跨部分审计 | `done` | 完成后 `pass` |

## 2. SOP 问题回答

### 2.1 本仓是否有独立业务状态机？

`L5-chat` 没有 Conversation、Governance、Artifact、Workspace、Runtime 或其他 owner 的独立业务状态机。它有一组必须分开的客户端状态轴：命令/意图结果、访问姿态、材料 freshness/visibility、变化连续性、草稿、平台能力、可访问性和本地 projection。每条轴只描述 Chat-owned 或 safe projection 语义；owner 业务状态由正式 owner 通过 SDK 结果/change 提供。

### 2.2 哪些动作触发状态迁移？

- 本地编辑/选择/平台生命周期触发 Chat-local draft、selection、platform 和 accessibility 迁移。
- 正式 SDK command submission/receipt/result/change 触发命令结果轴迁移，但必须经过 `CommandResultGate`。
- 正式 visibility/scope/revocation 结果触发 Access/Disclosure 和本地清理迁移。
- SDK formal change、resume、requery、gap/expired 触发 Continuity/Freshness 迁移。
- cache hit 只触发 cached/restored/stale 相关本地状态，不能触发 fresh/confirmed。

### 2.3 哪些迁移允许，哪些禁止？

允许的核心方向是：draft → submitted/pending → confirmed/rejected/failed/unknown；stale/gap/reconnecting → resuming → fresh 或 partial/blocked/needs-action；visible/fresh → restricted/redacted/cleared（由正式 visibility/revocation）；cached → restored → stale 或 revalidated。禁止直接从按钮/ACK/cache/reconnect/平台通知到 confirmed/fresh，也禁止 unknown 自动回到 submitted 或直接重放副作用。

## 3. 当前文档问题诊断

| 旧材料问题 | 影响 | 本步修正 |
|---|---|---|
| 一个 `status` 覆盖发送、流式、执行、等待、失败和缓存 | 不同 authority 被压成同一状态，容易伪成功 | 使用多轴状态，结果/连续性/可见性/平台/本地分离。 |
| `streaming`/websocket connected 直接等于业务完成 | transport 与 owner result 混淆 | 只有 formal receipt/result/change 可进入 confirmed。 |
| reconnect 成功直接把缓存标 fresh | 连接与来源水位混淆 | reconnecting/resuming 与 fresh 分开，必须 resume/requery。 |
| GateCard 的 UI 选中/提交状态被写成 Decision 状态 | Chat 越界治理 truth | 只保留 attempt/result posture，Decision 由 owner 提供。 |
| offline cache 复用为当前授权状态 | 可能展示过期敏感材料 | cache restored/stale/restricted，visibility 重验和清理。 |

## 4. 状态定义表

### 4.1 命令结果状态轴 `CommandResultPosture`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `draft` | 只有本地意图/草稿 | 受限 | 不代表已发送、已审批或已写入 owner。 |
| `submitted` | SDK 正式接收或已发起 attempt | 是（等待结果） | 只表示提交边界成立，不代表 owner committed。 |
| `pending` | owner/SDK 明确表示仍在处理或等待 | 是（等待结果） | 页面可等待或提供安全查询；不能当 confirmed。 |
| `confirmed` | 正式 owner receipt/result/change 满足结果门控 | 是 | 只由 `CommandResultGate` 允许；不是 UI/transport 状态。 |
| `rejected` | 正式结果明确拒绝 | 受限 | 需显示安全原因和下一步；不自动重试。 |
| `failed` | 正式失败且副作用语义可解释 | 受限 | 是否重试需 capability/guard；不等于 unknown。 |
| `unknown` | 无法安全判断副作用是否成立 | 否（需查询/决定） | 禁止自动重放；进入 probe/wait/user decision。 |

### 4.2 访问与操作状态轴 `AccessPosture`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `available` | 正式语境允许安全查看/按能力操作 | 是 | 仍需每个 command 的 capability/结果门控。 |
| `read_only` | 可读但不能执行当前操作 | 受限 | 不推断拒绝对象是否不存在。 |
| `restricted` | 只能展示有限材料或原因 | 受限 | 保护 scope/visibility。 |
| `unavailable` | 能力或依赖暂不可用 | 否 | 可保留安全入口/恢复提示。 |
| `blocked` | 继续会越过安全/合同边界 | 否 | 必须 fail-closed。 |
| `hidden` | 正式结果要求不暴露入口/材料 | 否 | 清理或遮蔽本地相关材料。 |

### 4.3 材料新鲜度状态轴 `FreshnessState`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `fresh` | 在已知来源水位内可解释 | 是 | 不代表业务动作已完成。 |
| `stale` | 可能落后于正式来源 | 受限 | 可展示但需标注并触发 requery/resume。 |
| `partial` | 只有部分范围/字段/变化 | 受限 | 不得当完整历史或完整摘要。 |
| `unknown` | 无法判断来源水位 | 否/受限 | 需要正式查询或等待。 |
| `expired` | 已超过可安全使用范围 | 否 | 清理或重新获取。 |

### 4.4 材料可见性/披露状态轴 `DisclosurePosture`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `visible` | 正式结果允许展示安全材料 | 是 | 仍受 freshness 和本地 redaction 约束。 |
| `redacted` | 只能展示脱敏/最小摘要 | 受限 | 不暴露原文或隐藏字段。 |
| `restricted` | scope/policy 只允许受限入口 | 受限 | 不从缓存补全。 |
| `unavailable` | 没有安全可用材料 | 否/受限 | 显示安全原因或恢复提示。 |
| `cleared` | 因撤销/登出/过期已清理 | 否 | 旧材料不得继续渲染。 |

### 4.5 连续性状态轴 `ContinuityPhase`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `fresh` | formal change/resume 水位连续 | 是 | 只代表客户端来源连续性。 |
| `stale` | 尚未确认最新变化 | 受限 | 触发 resume/requery。 |
| `gap` | 发现变化缺口 | 否/受限 | 暂停把后续变化当连续。 |
| `reconnecting` | SDK/宿主连接恢复中 | 否/受限 | 不代表业务恢复。 |
| `resuming` | 正在执行 formal resume/requery | 受限 | 等待正式结果。 |
| `restricted` | scope/visibility 变化要求收紧 | 受限 | 与 Access/Disclosure 联动。 |
| `blocked` | 缺少安全/合同能力 | 否 | 不私自 fallback。 |
| `needs_action` | 需要用户/支持角色决定下一步 | 否/受限 | 例如 unknown 或宿主权限。 |

### 4.6 草稿状态轴 `DraftState`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `empty` | 没有本地草稿 | 是 | 等待输入。 |
| `editing` | 用户正在编辑 | 是 | 只影响本地。 |
| `locally_valid` | 通过本地可检查条件 | 是（可创建 intent） | 不代表 owner 接受。 |
| `invalid` | 本地可解释地不能提交 | 否/受限 | 不替代 owner validation。 |
| `submitting` | 已关联提交 attempt | 受限 | 由 CommandResultPosture 继续收敛。 |
| `restored` | 从本地安全存储恢复 | 受限 | 需要重新验证语境。 |
| `cleared` | 已清除 | 是 | 不代表 owner 取消或失败。 |

### 4.7 本地投影状态轴 `LocalProjectionState`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `absent` | 没有本地材料 | 是（走正式 query） | 不推断 owner 不存在。 |
| `cached` | 有来源绑定的安全缓存 | 受限 | 必须重新验证 freshness/visibility。 |
| `restored` | 已恢复到页面 | 受限 | 不等于 fresh/current。 |
| `stale` | 来源可能过期 | 受限 | 需要 requery/resume。 |
| `restricted` | 只能显示受限材料 | 受限 | 保护 scope/visibility。 |
| `evicting` | 正在清理 | 否/受限 | 不应继续渲染受影响材料。 |
| `cleared` | 已删除 | 是（需正式 query） | 不代表 owner 删除。 |

### 4.8 平台能力状态轴 `CapabilityAvailability`

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `available` | 宿主能力可用 | 是 | 仍不改变业务授权。 |
| `restricted` | 受宿主权限或策略限制 | 受限 | 可提供等价路径或提示。 |
| `unavailable` | 当前宿主不提供 | 否/受限 | shared core 继续维持语义。 |
| `needs_action` | 需要用户完成宿主动作 | 否/受限 | 不把动作完成当业务结果。 |
| `unknown` | 无法确定能力 | 否/受限 | fail-closed。 |

## 5. 状态归属表

| 主要组成部分 | 正式状态轴/对象 | 触发接口或处理流 | 传播对象 | 不得混用的状态 |
|---|---|---|---|---|
| 协作体验语境 | `SelectionState`、`TurnPresentationModel`、页面 `AccessPosture/FreshnessState` | `LoadConversationSurface`、`ConsumeFormalChange` | `ConversationSurfaceViewModel`、`StatusAnnouncement` | 不等于 Conversation/Turn lifecycle、attention 或 owner confirmation。 |
| 受控协作意图 | `DraftState`、`CommandResultPosture`、`CommandAttemptState` | `Submit*Intent`、`ConsumeCommandReceiptOrResult`、`ResolveUnknownAttempt` | `IntentFeedbackViewModel`、`RecoveryViewModel` | 不等于 transport state、Decision/Turn result。 |
| 安全语境与导航 | `AccessPosture`、`DisclosurePosture` | `ResolveEntryAccess`、`ConsumeVisibilityChange`、`EvictLocalMaterial` | `RouteContext`、`LocalProjectionEntry` | 不等于 Identity/Governance authorization state。 |
| 变化与恢复连续性 | `ContinuityPhase`、`ResumeContext`、`FreshnessState` | `ConsumeFormalChange`、`ResumeChangeContext`、`RequeryAfterGap` | `RecoveryViewModel`、safe material | 不等于 bus delivery/owner repair/reconnect success。 |
| 平台体验与可访问性 | `CapabilityAvailability`、`AccessibilityState` | `ProbePlatformCapability`、`ConsumeShellLifecycle` | `StatusAnnouncement`、platform adapter | 不等于 command/owner result。 |
| owner-safe 材料镜像 | `FreshnessState`、`DisclosurePosture`、material availability | safe query/preview/revision consumer | `SafeMaterialSnapshot`、view model | 不等于 owner lifecycle/version truth。 |
| 本地展示与恢复投影 | `LocalProjectionState`、cache lifecycle | `RestoreAfterShellRestart`、`PersistLocalProjection`、`EvictLocalMaterial` | `LocalProjectionEntry`、`RecoveryContext` | 不等于 current truth、authorization 或 audit/evidence。 |

## 6. 状态流转图

#### 命令结果状态流转图

```text
<draft>
   │ submit intent
   ▼
<submitted>
   │ owner/SDK says waiting
   ▼
<pending>
   ├──────── formal success result/change ───────► <confirmed>
   ├──────── formal rejection ───────────────────► <rejected>
   ├──────── formal failure ─────────────────────► <failed>
   └──────── result authority unavailable ────────► <unknown>

<unknown>
   │ formal probe/query
   ├──────── success result/change ───────────────► <confirmed>
   ├──────── rejection result ───────────────────► <rejected>
   └──────── unresolved ─────────────────────────► <unknown>
```

关键说明：
- 只有正式 receipt/result/change 经过 `CommandResultGate` 才能进入 confirmed/rejected/failed。
- `unknown` 不允许直接回到 submitted，也不允许自动重放原 command。
- failed 是否可创建新的 attempt 由新的 capability/guard 和用户动作决定，不是隐式迁移。

#### 连续性与材料状态流转图

```text
<cached / restored>
          │ freshness not proven
          ▼
       <stale> ── gap detected ──► <gap>
          │                         │ resume/requery
          │ reconnect               ▼
          └──────────────► <reconnecting> ──► <resuming>
                                             ├─ formal success ─► <fresh>
                                             ├─ partial result ──► <stale/partial>
                                             ├─ visibility change ► <restricted>
                                             └─ contract failure ─► <blocked/needs_action>

<fresh / visible>
          │ revoke/logout/expiry
          ▼
     <restricted/redacted> ── clear ──► <cleared>
```

关键说明：
- reconnecting/resuming 只表示客户端连续性工作，不表示 owner 业务结果。
- fresh 必须由正式来源水位/恢复结果支持；cache hit、页面重绘或连接恢复不能直接触发。
- visibility/scope 变化优先收紧或清理，不能等待普通刷新后继续显示敏感材料。

#### 本地投影与平台能力流转图

```text
<absent>
   │ safe material + safety guard
   ▼
<cached> ── shell restart ──► <restored> ── validate ──► <fresh or stale>
   │ revoke/logout/expiry
   ▼
<evicting> ─────────────────────────────────────────────► <cleared>

<unknown capability>
   │ platform probe
   ├──────── capability available ─────► <available>
   ├──────── host restriction ─────────► <restricted/needs_action>
   └──────── unavailable ──────────────► <unavailable>
```

关键说明：
- 本地投影清理只影响 Chat-local 持有面，不代表 owner 对象被删除。
- 平台能力状态只控制宿主路径/等价表达，不改变业务权限和结果。
- accessibility/focus 状态不进入业务状态机；它由共享 view model 状态投影得到。

## 7. 状态传播关系

#### 状态传播关系图

```text
Formal owner result/change / SDK resume
                  │
                  ▼
      CommandResultGate / ChangeAcceptanceRecord
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
CommandAttemptState     ContinuityState
        │                   │
        ▼                   ▼
IntentFeedbackViewModel  SafeMaterialSnapshot / FreshnessMarker
        │                   │
        └─────────┬─────────┘
                  ▼
      ConversationSurfaceViewModel / RecoveryViewModel
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 LocalProjectionEntry   StatusAnnouncement
        │
        ▼
 Eviction / cleanup on visibility, logout, expiry
```

关键说明：
- 正式结果/变化只通过 gate/reducer 进入 Chat-local 状态和 safe projection。
- Projection、announcement 和 cache 都是下游表达，不能反向成为 owner authority。
- visibility/revoke/expiry 的传播优先触发 restricted/clear；不等待普通渲染或缓存刷新。
- 该图不表达数据库、broker、协议字段、函数实现或 Observability audit/evidence。

## 8. 允许的核心迁移

- `DraftState.empty -> editing -> locally_valid`。
- `DraftState.locally_valid -> submitting`，仅由用户/产品动作创建 local attempt。
- `CommandResultPosture.draft -> submitted -> pending`，由 SDK 正式提交/等待语义触发。
- `CommandResultPosture.pending -> confirmed`，仅由 `CommandResultGate` 接受正式 owner result/change。
- `CommandResultPosture.pending -> rejected/failed/unknown`，仅由正式结果 authority 或安全不确定性触发。
- `CommandResultPosture.unknown -> confirmed/rejected`，仅由正式 probe/query/result/change 收敛；未收敛时保持 unknown。
- `ContinuityPhase.fresh -> stale/gap/reconnecting`，由正式变化缺口、生命周期或 freshness 失效触发。
- `ContinuityPhase.stale/gap/reconnecting -> resuming`，由正式 resume/requery job 开始触发。
- `ContinuityPhase.resuming -> fresh/partial/restricted/blocked/needs_action`，由正式结果和安全 guard 触发。
- `DisclosurePosture.visible -> redacted/restricted/unavailable/cleared`，由 visibility/scope/revocation/expiry 触发。
- `LocalProjectionState.cached -> restored -> stale`，由 shell restart/恢复和 freshness 验证触发。
- `LocalProjectionState.cached/restored/stale/restricted -> evicting -> cleared`，由 logout/revoke/expiry/clear policy 触发。
- `CapabilityAvailability.unknown -> available/restricted/unavailable/needs_action`，由平台 capability probe 触发。

## 9. 禁止的核心迁移

- `CommandResultPosture.draft/submitted/pending -> confirmed` 仅凭按钮点击、表单通过、transport/HTTP/AG-UI ACK、toast、通知或连接恢复。
- `CommandResultPosture.unknown -> submitted/confirmed` 仅凭重试按钮、缓存命中、socket reconnect 或页面刷新。
- `CommandResultPosture.rejected/failed -> confirmed` 无新的正式 attempt/result/change。
- `ContinuityPhase.reconnecting/resuming -> fresh` 无正式来源水位或 resume/requery 结果。
- `FreshnessState.stale/unknown/expired -> fresh` 仅凭本地 cache、墙上时间或 SDK transport connected。
- `DisclosurePosture.restricted/cleared -> visible` 无新的正式 visibility/scope 结果。
- `LocalProjectionState.cleared -> restored` 无安全材料、语境验证和清理策略允许。
- `CapabilityAvailability.unavailable/unknown -> available` 仅凭平台偏好或 feature flag。
- 任何 Chat-local 状态直接迁移为 Conversation/Turn/Gate/Decision/Artifact/Workspace/Runtime/Observability owner 状态。
- 任何状态迁移绕过 `VisibilityGuard`、`CommandResultGate`、`ChangeAcceptanceRecord` 或 `PersistenceSafetyGuard`。

## 10. 各主要组成部分状态停审

| 主要组成部分 | 状态停审结论 |
|---|---|
| 协作体验语境 | Selection/Turn presentation/page freshness 可独立表达；不创建 owner lifecycle；Query/change 触发已在 Step 8 定义。 |
| 受控协作意图 | command result 轴、draft、unknown/retry 已分离；confirmed 只由正式 authority。 |
| 安全语境与导航 | Access/Disclosure fail-closed，visibility revoke 触发 restricted/clear；不推断存在性。 |
| 变化与恢复连续性 | Continuity 与 Freshness 独立于 transport/platform；gap/resume/requery 迁移闭环。 |
| 平台体验与可访问性 | capability/focus/announcement 不进入业务结果状态；宿主缺失有等价/needs-action 姿态。 |
| owner-safe 材料镜像 | fresh/stale/partial/unknown 与 visible/restricted/redacted 分轴；不表示 owner lifecycle。 |
| 本地展示与恢复投影 | cached/restored/stale/evicting/cleared 有界；不延长授权、不写 owner。 |

## 11. 跨状态一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 同名/近义状态是否跨部分冲突 | 无 unresolved | `confirmed` 只属于命令结果轴；`fresh` 只属于来源连续性/材料轴；`available` 只属于能力/访问姿态。 |
| 状态触发接口是否已在 Step 7/8 定义 | 是 | Command、receipt/result、change、resume/requery、visibility、platform probe、persist/evict 均有入口。 |
| 允许/禁止迁移是否清楚 | 是 | 已分别列出。 |
| 状态传播是否会反向改 owner truth | 否 | 传播终点是 Chat-local projection/view/announcement/cache。 |
| unknown/blocked/unavailable 是否有安全姿态 | 是 | 保持查询、等待、清理、用户决定或 needs-action。 |
| 是否把 UI 展示规则混入状态机 | 否 | 状态机只写语义和传播，文案/组件留给实现层。 |
| 是否需要 owner domain state machine | 不需要 | owner 状态由专项 owner；本仓只定义客户端状态轴。 |

## 12. 回填草稿（正式 §9）

> 校准来源：本文件 `§4 状态定义表`、`§6 状态流转图`、`§7 状态传播关系`、`§8 允许的核心迁移`、`§9 禁止的核心迁移`、`§11 跨状态一致性审计`。

正式 §9 将声明 `L5-chat` 没有独立的 owner 业务状态机，而是维护互相隔离的客户端状态轴：

- `CommandResultPosture`：`draft`、`submitted`、`pending`、`confirmed`、`rejected`、`failed`、`unknown`。
- `AccessPosture`：`available`、`read_only`、`restricted`、`unavailable`、`blocked`、`hidden`。
- `FreshnessState`：`fresh`、`stale`、`partial`、`unknown`、`expired`。
- `DisclosurePosture`：`visible`、`redacted`、`restricted`、`unavailable`、`cleared`。
- `ContinuityPhase`：`fresh`、`stale`、`gap`、`reconnecting`、`resuming`、`restricted`、`blocked`、`needs_action`。
- `DraftState` 和 `LocalProjectionState`：分别表达未提交编辑与本地安全投影生命周期。
- `CapabilityAvailability`：表达宿主能力姿态，不改变业务权限或结果。

状态迁移必须由已定义的命令/查询/变化/恢复/清理入口触发。`confirmed` 只由正式结果门控，`fresh` 只由正式来源水位/恢复结果支持，visibility 收紧优先于缓存和普通渲染；unknown 不自动重放，清理和平台状态不产生 owner truth。

## 13. 待确认事项

| 待确认 | 影响 | 当前挂起口径 |
|---|---|---|
| owner receipt/result/change 的 authority ordering | confirmed/rejected/failed/unknown 的精确迁移 | 只接受正式 `CommandResultGate` 输入；未知保持 unknown。 |
| SDK cursor/revision/resume 与 freshness 的映射 | fresh/stale/gap/resuming 的触发 | 保留来源/水位抽象，不把 transport state 当 fresh。 |
| visibility/revoke 的跨 owner 传播时序 | restricted/redacted/cleared 和 cache eviction | fail-closed，先收紧/清理，等待正式结果。 |
| 平台 lifecycle 与恢复触发粒度 | reconnecting/resuming/restored 的进入 | shell 只触发恢复作业，不改变业务结果。 |

## 14. 自检与门禁

### 14.1 Step 自检

| 检查项 | 结论 |
|---|---|
| 是否单独输出状态定义表？ | 是；8 个状态轴均有状态、含义、主线资格和说明。 |
| 是否画状态流转图和传播关系图？ | 是；命令、连续性/材料、本地/平台和传播图均有。 |
| 状态触发是否能回指 Step 7/8 接口/流？ | 是。 |
| 是否把 UI 文案或 owner domain state 混入？ | 否。 |
| 是否明确允许/禁止迁移？ | 是。 |
| 是否将 confirmed/fresh 与 ACK/cache/reconnect 分离？ | 是。 |
| 是否定义了 unknown 的安全姿态？ | 是；probe/query/wait/user decision，不自动重放。 |
| 是否存在跨状态近义冲突？ | 无 unresolved。 |

### 14.2 进入下一步条件

- 命令结果、访问、材料、新鲜度、连续性、草稿、平台和本地投影状态轴已独立定义。
- 状态触发、允许/禁止迁移和传播关系能回指前序接口/处理流。
- 未闭合 owner state/event semantics 保持 pending/blocked，不在 Chat 创造业务状态。

### 14.3 门禁结论

`gate_status = pass`。Step 9 已完成，下一动作是创建并执行 `02_hld_step_10_exceptions_boundaries.md`；Step 10 将只补必须在概要层先点名的异常与边界，不展开错误码、重试参数或补偿实现。

## 2026-10-01 当前状态复核计划/诊断

输入：Step9 SOP/规范§4.9、当前§6～8和现有§9。旧图只从pending画终态，漏submitted立即结果；连续性图暗示gap恢复需先重连且将Freshness.partial混入ContinuityPhase。改为每轴分别定义迁移，Process/Gateway/Governance状态仅正式外部输入。needs-action文案不是新枚举，规范代码状态统一needs_action。

SOP回答/取舍：新增PageLoadPosture归项目/流程/节点/关系/目录VM；ProjectNavigationState.selection与ClientConsumptionContext独立；optimistic为可撤销本地表现轴，不代表业务结果。source-local fresh不等于全项目fresh；拓扑/状态不匹配使partial/stale，不推join。

回填§9状态表/迁移图/传播/归属；复杂度需状态和传播图，复用既有图修正并增局部消费图。所有触发来自§7/8，无实现枚举代码。

### 当前Step9部分停审：协作体验语境

对象归属、触发和允许/禁止迁移见当前§9.6～9.8；对照本部分§6对象与§8流复核完成。当前ready/active/selected/fresh/confirmed按对象轴区分，不能向Process/Work/Governance投射；状态传播限当前source/context的安全投影/缓存/公告。独立gate pass，正向合同blocked。

当前Step14一致性回查：failed后用户明确选择新attempt且capability/SDK幂等重试合同获准，原attempt保留；不自动重发。该项整理既有RetryDecisionCoordinator/CommandResultGate.allows_retry边界。needs-action为文案，代码状态轴统一needs_action。gate pass，合同blocked。


## 当前Step9收口

跨状态审计：submitted立即终态已补；unknown只有正式失败证明才failed；partial保留Freshness/PageLoad轴，不新增Continuity枚举；消费失效与新建代次分开；拓扑/Gateway与Governance Gate正式状态未复制。本地图/列表/焦点一致，restricted隐藏关系也不得AT泄露。正式§9原位修复完成，Step9 done gate pass，进入Step10。无实现/测试/提交。


### 当前Step9部分停审：本地展示与恢复投影

对象归属、触发和允许/禁止迁移见当前§9.6～9.8；对照本部分§6对象与§8流复核完成。当前ready/active/selected/fresh/confirmed按对象轴区分，不能向Process/Work/Governance投射；状态传播限当前source/context的安全投影/缓存/公告。独立gate pass，正向合同blocked。


### 当前Step9部分停审：owner-safe 材料镜像

对象归属、触发和允许/禁止迁移见当前§9.6～9.8；对照本部分§6对象与§8流复核完成。当前ready/active/selected/fresh/confirmed按对象轴区分，不能向Process/Work/Governance投射；状态传播限当前source/context的安全投影/缓存/公告。独立gate pass，正向合同blocked。


### 当前Step9部分停审：平台体验与可访问性

对象归属、触发和允许/禁止迁移见当前§9.6～9.8；对照本部分§6对象与§8流复核完成。当前ready/active/selected/fresh/confirmed按对象轴区分，不能向Process/Work/Governance投射；状态传播限当前source/context的安全投影/缓存/公告。独立gate pass，正向合同blocked。


### 当前Step9部分停审：变化与恢复连续性

对象归属、触发和允许/禁止迁移见当前§9.6～9.8；对照本部分§6对象与§8流复核完成。当前ready/active/selected/fresh/confirmed按对象轴区分，不能向Process/Work/Governance投射；状态传播限当前source/context的安全投影/缓存/公告。独立gate pass，正向合同blocked。


### 当前Step9部分停审：安全语境与导航

对象归属、触发和允许/禁止迁移见当前§9.6～9.8；对照本部分§6对象与§8流复核完成。当前ready/active/selected/fresh/confirmed按对象轴区分，不能向Process/Work/Governance投射；状态传播限当前source/context的安全投影/缓存/公告。独立gate pass，正向合同blocked。


### 当前Step9部分停审：受控协作意图

对象归属、触发和允许/禁止迁移见当前§9.6～9.8；对照本部分§6对象与§8流复核完成。当前ready/active/selected/fresh/confirmed按对象轴区分，不能向Process/Work/Governance投射；状态传播限当前source/context的安全投影/缓存/公告。独立gate pass，正向合同blocked。
