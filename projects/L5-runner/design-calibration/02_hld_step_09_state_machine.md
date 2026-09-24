# Step 9. 状态机与状态流转

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 9 / 状态机与状态流转 |
| 状态 | `completed` |
| 当前模块 | `state_machines:self_reviewed` |
| gate_status | `pass` |
| gate_reason | Runner-owned 状态机、owner 投影轴和只读观察轴已按六部分分离；核心迁移、禁止迁移、触发接口与跨轴传播均收稳，无单一 success 或反写 owner truth。 |
| next_allowed_action | `read_and_start_step_10` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 恢复台账、02 flow、Step 8，读取概要 SOP Step 9 与书写规范 §4.9。
- [x] 从 Step 6 对象提取正式状态族，区分 local state、owner projection 与 read-only observation。
- [x] 按六个组成部分逐一收稳状态定义、核心迁移、禁止迁移与触发来源。
- [x] 画必要状态流转图与状态传播关系图。
- [x] 审计近义状态、跨轴传播、接口/流程触发覆盖与详细设计承接。
- [x] 回填 Step 6 中材料生命周期与删除资格混轴问题。

## 2. 本步输入与核心判断

| 输入 | 使用方式 |
|---|---|
| Step 6 | 17 个对象及其状态候选；状态必须归属现有对象。 |
| Step 7 | 会触发状态变化的 Command、planned Consumer 与 Job。 |
| Step 8 | 事务边界、owner result、unknown/reconcile 与 propagation 路径。 |
| 正式 00 §9～14 | `accepted != running`、保护、no replay、redaction/evidence 等验收红线。 |
| 正式 01 §9～10 | 本地强一致、owner 最终一致投影、多轴 lifecycle 与恢复策略。 |

核心判断：

- 本仓存在多个相互正交的正式状态机，不存在统一 `RunnerRun.status` 或单一 success 状态机。
- Runner-owned 可迁移状态机：`ReleaseSelection`、`AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture`、`RunIntent`、`ControlIntent`、`ProtectionGuard`、`RecoveryCase`、`HandoffPosture`。
- Owner-attributed projection axes：request、execution、owner control/result、lease/cleanup/handoff receipt 等。Runner 只能应用正式 snapshot/event/ref，不得决定这些 owner 状态的合法迁移。
- Read-only/derived axes：`ResourceObservation.posture`、preview visibility/freshness/truncation、diagnosis uncertainty/freshness、`ConnectivityView.state` 与 `RunnerReadModel` section posture。它们可被观察/重建，但不是运行成功状态机。
- `SelectionGeneration` 是 immutable monotonic boundary，不是可原地迁移的枚举状态；每次选择变化创建 successor。
- 当前无 Runner outbound event family/outbox propagation。状态传播只到本地 projection、保护/失效标记、Query view 和显式 operations trigger；跨域 truth 不被反写。

## 3. 状态轴总表

| 主要组成部分 | 对象 / 状态轴 | 状态来源 | 本仓是否拥有迁移 | 正常主线门禁 |
|---|---|---|---:|---|
| Context and explicit selection | `SelectionGeneration` | local immutable value | 创建 successor | current generation 才能绑定后续副作用。 |
| Context and explicit selection | `ReleaseSelection.state` | local + owner authority basis | 是 | 仅 `current` 可开始材料取得。 |
| Material acquisition and qualification | `AcquisitionTask.state` | local job/control | 是 | `complete` 只允许进入验证，不允许运行。 |
| Material acquisition and qualification | `IntegrityPosture.state` | local verifier + owner policy refs | 是 | 仅 current `verified` 参与 qualification。 |
| Material acquisition and qualification | `MaterialCacheEntry.state` | local material lifecycle | 是 | 仅同 binding 的 `qualified` 可用于 run。 |
| Material acquisition and qualification / Resource | `ProtectionGuard.state` | local conservative evaluation of owner refs | 是（派生重算） | 仅 `releasable` 可进入释放；不影响材料资格本身。 |
| Run intent and lifecycle | `RunIntent.state` | local command + owner receipt | 是 | `accepted` 只说明请求接收。 |
| Run intent and lifecycle | `ControlIntent.state` | local command + owner result | 是 | `confirmed` 只确认该控制效果。 |
| Run intent and lifecycle | owner request/execution/control axes | Sandbox/Runtime owner-safe source | 否；只投影 | running/terminal 必须由 owner axis 证明。 |
| Resource, cleanup and recovery | `ResourceObservation.posture` | local platform observation | 否；替换新观察 | available 不等于 owner allocation。 |
| Resource, cleanup and recovery | `RecoveryCase.state` | local recovery process + owner reads | 是 | 仅 `reconciled/closed` 可在重新验门禁后解除对应冻结。 |
| Preview, diagnosis and handoff | preview/diagnosis postures | derived safe sources | 否；替换新投影/记录 | 不进入运行成功判定。 |
| Preview, diagnosis and handoff | `HandoffPosture.state` | local intent + owner receipt | 是 | delivered 也不等 evidence/verdict。 |
| Entry and presentation | `ConnectivityView.state` | local observation + recovery projection | 否；替换新投影 | online 不解除其他轴的 stale/unknown。 |
| Entry and presentation | `RunnerReadModel` section postures | composition | 否 | 每 section 独立，不产生总 success。 |

## 4. Context and explicit selection 状态集合

### 4.1 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `selected` | 用户已选择 exact immutable Release/version，但 authority 尚未证明。 | 否 | 只能进入 checking。 |
| `checking` | 正在读取/比对正式 authority 与 scope basis。 | 否 | 期间禁止取得和运行副作用。 |
| `current` | authority current、可见且与 release/version/scope/generation 一致。 | 是，受限 | 只允许进入材料取得；后续仍需验证。 |
| `stale` | 曾有依据但 freshness/source basis 已不足。 | 否 | 必须重验，不能沿用旧资格。 |
| `invalidated` | 用户换选、撤销/过期、context/scope/source 变化使本世代失效。 | 否 | terminal for generation；创建新 generation 才可重选。 |
| `blocked` | 合同、可见性、冲突或 owner 不可用使 authority 不可证明。 | 否 | 可在新依据出现后重新 checking。 |

### 4.2 ReleaseSelection 状态流转图

```text
<no selection>
    │ SelectRelease / create generation
    ▼
selected
    │ authority check starts
    ▼
checking
    ├─ authority current + binding match ─► current
    ├─ visibility/contract/conflict ──────► blocked
    └─ source/freshness drift ────────────► stale

current
    ├─ refresh required ──────────────────► checking
    └─ change/revoke/expire/context drift ► invalidated

stale ── explicit recheck ────────────────► checking
blocked ─ new verifiable basis ───────────► checking
```

关键说明：

- `invalidated` 不回到 current；换选创建新的 `SelectionGeneration` 与新 `ReleaseSelection`。
- current 只证明当前选择可进入材料准备，不证明 material qualified 或 run allowed。
- authority change Consumer 当前 blocked；现阶段迁移由显式 check/refresh/reconcile 依据驱动。

允许的核心迁移：

- `selected -> checking -> current|blocked|stale`
- `current -> checking|stale|invalidated`
- `stale|blocked -> checking`
- `Generation(n) -> Generation(n+1)`，只能创建 successor，不能修改 `n`。

禁止的核心迁移：

- `selected -> current`（跳过正式 authority check）。
- `blocked|stale -> current`（没有新 owner basis）。
- `invalidated -> *`（原世代 terminal）。
- 任意状态通过 cache、角色、历史成功、`latest` 或默认分支进入 current。

本部分停审：状态归属 `ReleaseSelection/SelectionGeneration`；触发来自 `SelectRelease`、`InvalidateSelection`、authority check/refresh、planned Consumer 与 reconcile；没有本地 approval。`pass`。

## 5. Material acquisition and qualification 状态集合

### 5.1 AcquisitionTask 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `absent` | 尚无取得工作。 | 否 | 只是起点。 |
| `resolving` | 正在取得 formal locator/transport constraints。 | 否 | 不表示已经下载。 |
| `transferring` | 正在传输 bytes。 | 否 | 进度不证明完整性。 |
| `paused` | 本地取得被安全暂停。 | 否 | resume 前重验 binding/authority。 |
| `complete` | 传输完成并形成 quarantine handle。 | 受限 | 只允许进入验证。 |
| `failed` | 本次取得明确失败。 | 否 | 可由显式新请求创建新任务，不原地伪装恢复。 |
| `cancelled` | 用户取消本次取得。 | 否 | 不表示材料已删除。 |

### 5.2 IntegrityPosture 与 MaterialCacheEntry 状态定义表

| 状态轴 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Integrity `pending` | 尚缺输入或未验证。 | 否 | cache 保持 quarantine。 |
| Integrity `verifying` | 正在按 owner-provided basis 验证。 | 否 | 不允许 run。 |
| Integrity `verified` | digest/signature/platform/source/freshness 所需检查通过。 | 是，受限 | 不等 approved/running；还需 cache binding current。 |
| Integrity `invalid` | 明确内容、签名、平台或 source 不匹配。 | 否 | 不可通过改名或本地 override 放行。 |
| Integrity `stale` | 先前验证的 authority/manifest/source 已过时。 | 否 | 必须从 pending/verifying 重验。 |
| Integrity `blocked` | 合同/可见性不足，无法完成验证。 | 否 | fail-closed。 |
| Cache `quarantined` | 本地材料存在但未放行。 | 否 | 下载 complete 后的默认状态。 |
| Cache `qualified` | 同一 binding 的 integrity 与 current authority 满足放行。 | 是 | 只允许创建 run intent，不代表 owner 会接受。 |
| Cache `stale` | binding/authority/generation 已漂移。 | 否 | 不得继续用于新副作用。 |
| Cache `invalid` | 材料已证明无效。 | 否 | 只能安全释放或保留诊断。 |
| Cache `evicted` | 本地材料已安全释放。 | 否 | terminal for entry；不改变 Artifact truth。 |

`protected/releasable/blocked/unknown` 属于独立 `ProtectionGuard` 轴；`eviction_candidate` 只是观察，不是 `MaterialCacheState`。这一分离已同步回填 Step 6。

### 5.3 材料状态流转图

```text
AcquisitionTask:
absent ─ request ─► resolving ─ locator ─► transferring
                                      ├─ pause ─► paused ─ valid resume ─► transferring
                                      ├─ transfer failure ──────────────► failed
                                      ├─ cancel ────────────────────────► cancelled
                                      └─ transfer complete ─────────────► complete

Material / Integrity:
complete ─► cache quarantined + integrity pending
                                   │ begin verification
                                   ▼
                               verifying
                 ┌─────────────────┼─────────────────┐
                 ▼                 ▼                 ▼
              verified          invalid        stale/blocked
                 │ current authority + same binding
                 ▼
             cache qualified
                 ├─ source/generation drift ─► cache stale
                 └─ safe release + guard releasable ─► cache evicted
```

关键说明：

- transfer、integrity、qualification 与 protection/releasability 是四个独立轴。
- cache `qualified` 后任何 authority/generation/digest 漂移都先失效，不能直接沿用。
- cache release 还需独立 ProtectionGuard；图不表示删除实现或固定淘汰策略。

允许的核心迁移：

- Acquisition：`absent -> resolving -> transferring -> complete|failed|cancelled`；`transferring -> paused -> transferring`（重验通过）。
- Integrity：`pending -> verifying -> verified|invalid|stale|blocked`；`stale|blocked -> pending`（获得新 basis 后新一轮验证）。
- Cache：`quarantined -> qualified|invalid|stale`；`qualified -> stale`；`quarantined|stale|invalid|qualified -> evicted` 仅在 guard releasable 且安全释放确认后。

禁止的核心迁移：

- Acquisition `complete -> transferring` 以隐式重试复用旧任务。
- `complete -> qualified` 跳过 quarantine/integrity/authority。
- Integrity `invalid|stale|blocked -> verified` 没有新验证轮次。
- Cache `stale|invalid|evicted -> qualified` 通过改字段恢复。
- 任意 cache 状态在 ProtectionGuard 非 releasable 时进入 evicted。

本部分停审：三状态族归 `AcquisitionTask/IntegrityPosture/MaterialCacheEntry`，保护轴外置；触发来自取得 commands、AcquireAndVerify Job、selection invalidation 与 safe release。`pass`。

## 6. Run intent and lifecycle 状态集合

### 6.1 RunIntent 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `draft` | 本地请求意图已创建，尚未提交。 | 受限 | 尚无 owner request ref。 |
| `submitting` | 请求正在跨正式 port 提交，结果尚未确认。 | 否 | 不允许重复提交。 |
| `accepted` | Sandbox owner 已接收请求。 | 受限 | 不等于 boundary created、starting 或 running。 |
| `rejected` | Owner 明确拒绝本次请求。 | 否 | terminal for intent。 |
| `unknown` | 提交结果不可确认。 | 否 | 冻结并 reconcile，不自动 replay。 |
| `invalidated` | context/selection/material binding 已失效。 | 否 | 不得继续推进。 |

### 6.2 ControlIntent 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | 本地 start/stop/cancel/cleanup intent 已建立。 | 受限 | 等待 owner。 |
| `accepted` | Owner 已受理控制。 | 受限 | 不等于控制效果完成。 |
| `confirmed` | 正式 owner result 证明该控制效果。 | 是，受限 | stop confirmed 不等 cleaned/released。 |
| `rejected` | Owner 明确拒绝。 | 否 | terminal for control intent。 |
| `unknown` | 结果不可确认。 | 否 | 必须 reconcile。 |
| `conflict` | expected owner basis 不匹配。 | 否 | 不可覆盖 owner current state。 |

### 6.3 OwnerRunProjection 状态定义表

| Owner 投影轴 / 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Request `pending/accepted/rejected/unknown` | Sandbox request owner 姿态。 | 依状态 | Runner 不决定迁移；accepted 非 running。 |
| Execution `not_started/starting/running/stopping/terminal/unknown` | Sandbox/Runtime 正式执行姿态。 | 依状态 | 只有正式 current owner source 可显示 running/terminal。 |
| Control owner posture | 正式控制结果姿态。 | 依状态 | 不由本地 intent 反推。 |
| Projection freshness/visibility | 投影当前性和可见限制。 | 受限 | stale/restricted 时不能授权新副作用。 |

### 6.4 RunIntent / ControlIntent 状态流转图

```text
RunIntent:
draft ─ submit ─► submitting
                    ├─ owner accepted ─► accepted
                    ├─ owner rejected ─► rejected
                    └─ ambiguous ──────► unknown ─ reconcile ─► accepted|rejected|invalidated

draft|submitting|accepted
    └─ context/selection/material invalidated ─► invalidated

ControlIntent:
pending
  ├─ owner accepted ─► accepted ─ owner effect result ─► confirmed
  ├─ owner rejected ───────────────────────────► rejected
  ├─ expected basis mismatch ──────────────────► conflict
  └─ ambiguous ────────────────────────────────► unknown

unknown|conflict ─ read-only reconcile ─► accepted|confirmed|rejected|conflict
```

关键说明：

- reconcile 应用 owner 已有结果，不重新提交原副作用。
- local accepted/confirmed 仅属于各自 intent 轴；owner execution 和 cleanup 仍独立。
- owner projection 的状态序列由 owner 合同定义，Runner 只校验 source/order 并投影。

允许的核心迁移：

- RunIntent：`draft -> submitting -> accepted|rejected|unknown`；活动状态可因 binding 漂移进入 `invalidated`；`unknown` 仅经 reconcile 应用 owner result。
- ControlIntent：`pending -> accepted|rejected|unknown|conflict`；`accepted -> confirmed|rejected|unknown`；unknown/conflict 仅经 reconcile 收敛。
- Owner projection：仅应用同 request/run ref、可验证 source version 的正式 snapshot/event。

禁止的核心迁移：

- RunIntent `draft -> accepted`（未提交正式 port）。
- RunIntent/ControlIntent `unknown -> pending/submitting` 以自动 replay。
- `accepted -> running|terminal` 跨轴推导。
- `confirmed stop -> cleaned|released` 跨轴推导。
- PID、端口、socket、toast、本地日志触发 owner execution 迁移。

本部分停审：本地 intent 与三类 owner projection 轴分离；触发来自 `RequestRun`、`RequestRunControl`、planned consumers 与 reconcile；`accepted != running` 完整保留。`pass`。

## 7. Resource, cleanup and recovery protection 状态集合

### 7.1 ProtectionGuard 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `protected` | 至少一项 lease/capture/handoff/retention/orphan 保护活动。 | 可运行，不可释放 | 不能删除受保护材料。 |
| `releasable` | 所有必要 owner 依据 current 且确认允许释放。 | 是（仅释放路径） | 是释放必要条件，不是释放结果。 |
| `blocked` | 明确 owner policy/状态阻止清理。 | 否（释放路径） | 保持材料。 |
| `unknown` | 必要依据缺失、stale、restricted 或冲突。 | 否（释放路径） | 保守等同保护，不 fail-open。 |

### 7.2 RecoveryCase 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `frozen` | 受影响危险副作用已暂停。 | 否 | disconnect/suspend/restart/mismatch/gap 后的起点。 |
| `querying` | 正通过正式 read ports 获取 owner current basis。 | 否 | 仍禁止 replay。 |
| `reconciled` | 可证明 local expectation 与 owner state 已收敛。 | 受限 | 需重新跑当前 command gate，不直接恢复旧副作用。 |
| `conflict` | Owner/local basis 明确冲突。 | 否 | 保持冻结。 |
| `manual_review` | 无法自动证明，等待有权限的显式判断。 | 否 | 不是 override。 |
| `closed` | 本地恢复案例安全收束。 | 不适用 | 不表示 owner run success。 |

### 7.3 保护与恢复状态流转图

```text
ProtectionGuard（每次输入变化重新保守评估）:
unknown
  ├─ active protection confirmed ─► protected
  ├─ explicit owner block ────────► blocked
  └─ all required release basis current ─► releasable

protected|blocked|releasable
  └─ basis stale/missing/conflict ─► unknown

RecoveryCase:
frozen ─ reconcile starts ─► querying
                              ├─ basis matches ─► reconciled ─ safe close ─► closed
                              ├─ mismatch ─────► conflict ─ new read ─────► querying
                              └─ cannot prove ─► manual_review
manual_review ─ explicit safe resolution + new basis ─► querying|closed
```

关键说明：

- Guard 是保守派生状态机；releasable 不是材料已删除或 Sandbox 已 cleaned。
- RecoveryCase 只读对账，不以 reconnect、cursor 或旧 cache 自动恢复副作用。
- ResourceObservation 的 available/conflict/unknown/unavailable 是带 freshness 的独立观察，不能迁移 owner lease/allocation。

允许的核心迁移：

- Guard 任一状态在输入变化后重新评估到 `protected|releasable|blocked|unknown`，但 releasable 需要全量 current basis。
- Recovery：`frozen -> querying -> reconciled|conflict|manual_review`；`reconciled -> closed`；conflict/manual review 只有新依据才可重新 querying/安全关闭。

禁止的核心迁移：

- Guard `unknown|protected|blocked -> releasable` 基于用户点击、磁盘压力、stop ACK 或默认值。
- Guard `releasable -> evicted/cleaned` 直接推导；实际结果属于独立操作/owner 轴。
- Recovery `frozen|querying|conflict|manual_review -> closed` 没有 resolution basis。
- `offline -> online` 直接令 RecoveryCase reconciled 或重发 command。
- local ResourceObservation `available -> owner allocated/leased`。

本部分停审：保护、恢复、资源观察三轴分离；触发来自 cleanup、eviction evaluation、connectivity observations、planned owner changes 与 Reconcile Job。`pass`。

## 8. Preview, diagnosis and handoff 状态集合

### 8.1 HandoffPosture 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `draft` | 已准备 redacted/allowed refs，尚未提交。 | 受限 | 非 evidence。 |
| `pending` | 已提交 handoff，等待 owner receipt/result。 | 受限 | 结果未确认。 |
| `accepted` | Owner 已接受交接。 | 是，受限 | 不等 delivered/evidence。 |
| `blocked` | 合同、权限、visibility 或 redaction 阻止交接。 | 否 | 不放宽材料。 |
| `delivered` | 正式 receipt 确认交接送达。 | 是，受限 | 不等 evidence/report/verdict/signoff。 |
| `failed` | Owner 明确交接失败。 | 否 | 可显式创建新 intent，不原地自动重发。 |
| `unknown` | 提交结果不可确认。 | 否 | 只读 reconcile。 |

### 8.2 HandoffPosture 状态流转图

```text
draft ─ submit ─► pending
                   ├─ owner accepted ─► accepted ─ delivery receipt ─► delivered
                   ├─ owner blocked ────────────────────────────────► blocked
                   ├─ owner failure ────────────────────────────────► failed
                   └─ ambiguous ────────────────────────────────────► unknown

unknown ─ read-only reconcile ─► accepted|delivered|blocked|failed|unknown
```

关键说明：

- preview visibility/freshness/truncation 与 diagnosis uncertainty 是派生只读姿态，不随 Handoff 状态升级。
- delivered 只影响保护评估所需的 handoff input；仍需 retention/lease/capture/orphan 等全量 basis。
- 当前 Consumer 与 port 受 `RUN-UP-005/008` 阻塞，正向 owner 迁移不可宣称可用。

允许的核心迁移：

- `draft -> pending -> accepted|blocked|failed|unknown`；`accepted -> delivered|failed|unknown`；unknown 只经 owner read/reconcile 收敛。

禁止的核心迁移：

- `draft -> delivered` 或 `pending -> delivered` 没有正式 receipt。
- `unknown|failed -> pending` 自动重发原 intent。
- `accepted|delivered -> evidence|report|verdict|signoff`（这些不是 Runner 状态）。
- preview/diagnosis 可见性不足时通过 handoff 绕过 redaction。

本部分停审：Handoff 本地意图/receipt 姿态与 preview/diagnosis 派生姿态分离；触发来自 handoff command、planned Consumer 和 reconcile。`pass`。

## 9. Entry and presentation composition 状态集合

### 9.1 ConnectivityView 状态定义表

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `online` | 当前连接观察可用。 | 受限 | 不证明任一业务 source current。 |
| `degraded` | 部分正式来源/能力不可用或受限。 | 受限 | 各 section 独立显示缺口。 |
| `offline` | 当前无法完成所需网络协作。 | 否（新跨域副作用） | 本地安全读取可继续但保持 freshness。 |
| `reconnecting` | 正在恢复连接。 | 否（危险副作用） | 不自动 replay。 |
| `reconciling` | 已连接并进行只读 owner 对账。 | 否（对应冻结范围） | 关联 RecoveryCase。 |
| `manual_review` | 无法自动证明收敛。 | 否 | 仍不是业务 verdict。 |

### 9.2 ConnectivityView 状态流转图

```text
online
  ├─ partial source loss ─► degraded
  └─ required connectivity lost ─► offline

degraded ─ full loss ─► offline
offline|degraded ─ transport returns ─► reconnecting
reconnecting ─ start read-only recovery ─► reconciling
reconciling
  ├─ all affected cases reconciled ─► online|degraded
  └─ cannot prove ──────────────────► manual_review
manual_review ─ new safe basis ─────► reconciling
```

关键说明：

- ConnectivityView 是 local read projection；状态变化不修改 selection/run/cleanup/handoff 状态。
- online 之后必须等各 owner source refresh/reconcile，不能清除 section 的 stale/unknown。
- RunnerReadModel 只组合 section 状态，没有顶层 `success/healthy/running` 状态。

允许的核心迁移：

- 根据新连接观察替换 `online/degraded/offline/reconnecting`；恢复流程关联时进入 `reconciling/manual_review`。
- `reconciling -> online|degraded` 仅在所有受影响 RecoveryCase 有明确收敛依据后。

禁止的核心迁移：

- `offline|reconnecting -> online` 同时把业务 section 标 current。
- `online -> selection current|run running|cleanup complete` 跨轴推导。
- Query/render 触发 connectivity 或任何业务状态迁移。

本部分停审：Connectivity 是投影，不是 domain success；触发来自 platform/connectivity observation、Refresh Job 与 RecoveryCase；多入口展示不改变状态。`pass`。

## 10. 跨轴状态传播关系图

```text
ReleaseSelection / SelectionGeneration change
  │
  ├─► IntegrityPosture stale + MaterialCacheEntry stale
  ├─► unsubmitted/unsafe RunIntent invalidated
  └─► ambiguous submitted intent ─► RecoveryCase frozen

Acquisition complete
  └─► cache quarantined + IntegrityPosture pending
         └─ verified + current authority + same binding
              └─► cache qualified ─► permits RequestRun gate only

RunIntent / ControlIntent owner result
  ├─► OwnerRunProjection (owner-attributed axes only)
  └─ ambiguous/gap ─► RecoveryCase frozen/querying

Owner lease/capture/handoff/retention/orphan projection
  └─► ProtectionGuard re-evaluation
         └─ releasable ─► permits cleanup/release gate only

Safe output/failure sources
  └─► OutputPreview / FailureDiagnosis
         └─ explicit handoff ─► HandoffPosture

All local truth + safe owner projections + observations
  └─► RunnerReadModel sections（no write / no aggregate success）
```

关键说明：

- 箭头表示本地失效、派生或 gate 影响，不表示跨域反写或分布式事务。
- 当前没有 Runner outbound event/outbox；owner change Consumer 仍 planned/blocked。
- “permits gate” 不等于执行动作或结果成功，Command 仍需重验全部 current basis。
- 任何 gap、source mismatch 或 ambiguous side effect 都传播为 stale/unknown/recovery，而非乐观成功。

## 11. 触发接口 / 处理流覆盖表

| 状态族 | 创建/迁移触发 | Step 7/8 承接 | 覆盖结论 |
|---|---|---|---|
| Selection/generation | select、invalidate、authority refresh/change | `SelectRelease`、`InvalidateSelection`、Consumer/Refresh | covered；Consumer blocked。 |
| Acquisition | request、pause/resume/cancel、transfer result | acquire commands + Acquire Job | covered。 |
| Integrity/cache | verification、promotion、source drift、safe release | Acquire Job、selection invalidation、eviction/release seam | covered；exact ports blocked。 |
| Run intent | run request receipt/ambiguity/binding invalidation | `RequestRun` + reconcile | covered。 |
| Control intent | control request/result/conflict/ambiguity | `RequestRunControl` + reconcile | covered。 |
| Owner execution projection | owner query/event snapshots | lifecycle Consumers/Refresh/Reconcile | covered；Consumers blocked。 |
| Protection | owner protection inputs/capacity evaluation | cleanup/eviction/reconcile | covered。 |
| Recovery | disconnect/restart/mismatch/gap/unknown | Reconcile Job、manual review | covered。 |
| Handoff | submit/receipt/failure/unknown | handoff command/Consumer/reconcile | covered；owner seam blocked。 |
| Connectivity/read model | observations/recovery/compose | Refresh Job、GetRunnerReadModel | covered；queries no-write。 |

## 12. 近义状态与跨状态一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| `selected/current/qualified` | pass | 分别是用户选择、authority current、材料可提交资格，不能互推。 |
| `complete/verified/qualified` | pass | 传输、完整性、cache 放行三轴分离。 |
| `accepted/running/confirmed/terminal` | pass | request、execution、control、outcome 分属不同来源。 |
| `protected/releasable/cleaned/evicted` | pass | guard、owner cleanup、local material release 分离；Step 6 混轴已修正。 |
| `unknown/stale/blocked/conflict` | pass | unknown=结果不可确认；stale=依据过时；blocked=明确无法继续；conflict=basis 不一致。 |
| `online/current/reconciled` | pass | connection、业务 source freshness、恢复收敛分离。 |
| `accepted/delivered/evidence` (handoff) | pass | 交接姿态不进入 evidence/report/verdict。 |
| Trigger coverage | pass | 每个 Runner-owned 迁移均回指 Step 7/8；owner axes 只投影。 |
| Propagation | pass | 只传播失效/派生/gate/view，不反写上游 truth。 |
| No outbound events | pass | 无正式 event family，因此不伪造 outbox；未来需要须回退 Step 7～9。 |
| Blockers | pass with blockers | exact owner enum/order/event contract 仍受 `RUN-UP-001~008` 控制。 |

## 13. 历史材料污染扫描与取舍

| 历史倾向 | 当前处理 |
|---|---|
| 单一 `RunnerRun` / card status | 不采用；用 local intents、owner projections、protection/recovery 和 read model 多轴组合。 |
| ACK/PID/端口作为 running | 明确禁止；只有 owner execution current projection 支撑。 |
| stop 后直接 cleaned | 明确禁止；control、cleanup、release、eviction 分轴。 |
| retry/replay 作为 unknown 出口 | 明确禁止；unknown 进入 frozen/query/reconcile/manual-review。 |
| cache protected/evictable 混进材料状态 | 已修正：删除资格归 `ProtectionGuard`，candidate 仅观察。 |
| UI loading/error 当 domain state | 不纳入；presentation 仅渲染正式/派生 posture。 |

## 14. 回填草稿

正式 §9 应先声明“多个正交状态轴、无统一 RunnerRun success”，再提供状态轴总表；按六部分收录核心状态定义、迁移图与允许/禁止迁移；最后给出跨轴传播图和近义状态审计。正式正文可压缩重复定义，但必须保留 selection/material/run-control/protection-recovery/handoff/connectivity 的独立性，以及 owner projection 不归 Runner 迁移的说明。

## 15. 待确认事项

- Sandbox/Runtime/Observability 等 owner exact enum、允许迁移、source version 与 event ordering 仍未闭合；本 Step 只定义 Runner 投影所需语义轴，不声称上游 enum 相同。
- Cleanup owner posture、local safe release operation 及 `MaterialCacheEntry -> evicted` 的 crash-safe 顺序留 03，并受 `RUN-UP-003/007/008` 限制。
- Preview/diagnosis 的完整 derived posture、freshness 算法和 retention 留 03/04；不得扩大为 evidence lifecycle。
- 本地历史记录是否形成 operation journal、如何保留与压缩留 03/04，且不构成正式审计证据。

## 16. 进入下一步条件

- [x] 已明确本仓存在多个正交 Runner-owned 状态机、owner projection 轴和 derived observation 轴。
- [x] 每个主要组成部分均有状态定义、核心迁移、允许/禁止迁移、触发接口与停审记录。
- [x] 状态流转图和跨轴传播图符合概要粒度，并有关键说明。
- [x] 跨部分同名/近义状态、触发覆盖和传播影响审计无 unresolved 冲突。
- [x] 未写状态机代码、数据库列、错误码全集、UI loading 状态或 owner 虚假迁移。
- [x] `RUN-UP-001~008` 继续限制正向 owner 合同，不影响本地负向闭环。

结论：`gate_status=pass`，允许进入 Step 10“异常与边界场景轮廓”。
