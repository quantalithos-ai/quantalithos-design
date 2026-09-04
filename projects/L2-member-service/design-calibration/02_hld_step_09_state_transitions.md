# 02 概要校准 Step 9：状态定义与状态流转

> 状态：completed / pass
> 日期：2026-08-24
> 前序门禁：Step 8 completed / pass
> 本步目的：按 CMP-MS-01~07 冻结正交状态轴、状态含义、触发接口、允许 / 禁止迁移和向 history / material / projection 的传播，不建立压平所有语义的全局 HostStatus

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP、书写规范、ASCII 状态图 / 状态传播图规范已复核 |
| 已读取项目输入 | yes；正式 00 / 01、Step 6 对象状态、Step 7 接口 writer、Step 8 处理流和 pending 注册表已复核 |
| 当前 Step | Step 9：状态机与状态流转 |
| 本 Step 输出 | `design-calibration/02_hld_step_09_state_transitions.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 下一 Step | blocked；本步 completed / pass 前不得创建 Step 10 |

- [x] 判断全局状态机与正交状态轴边界。
- [x] 建立 29 个对象的状态适用性清单。
- [x] 逐项完成 CMP-MS-01~07 状态定义、迁移、图和停审。
- [x] 完成允许 / 禁止迁移、传播关系和跨状态审计。
- [x] 完成 Gate 自检并更新 flow / project ledger。

## 2. 状态模型总原则

本仓存在多个相互关联但不合并的局部状态轴，不存在可替代所有语义的单一 `HostStatus`。状态的 owner、触发者和传播层级必须保持如下分离：

```text
intent / decision
      │ explicit command
      ▼
qualification / assembly / readiness
      │ matching generation progression
      ▼
host / attempt / association
      │ registration and allowed signals
      ▼
registration / endpoint / Host Session
      │ signal assessment and formal control
      ▼
health / failure / recovery decision
      │ closure / cleanup / reconciliation
      ▼
closure / attempt / finding / case
      │ committed fact materialization
      ▼
outbox / handoff layers / projection
```

关键说明：
- 图表达状态轴之间的结构依赖和大致方向，不表达所有迁移、时序、事务或外部正向合同。
- `ready`、`active`、`healthy`、`locally-closed`、`submitted`、`delivered`、`observed`、`accepted` 各有独立 owner 语义，不可互相替代。
- stale、blocked、waiting、unknown、gap、residual 和 degraded 是可审计的非正向语义，不是“缺省成功”。

## 3. 29 个对象的状态适用性索引

| 对象 | 状态适用性 | 状态 owner 口径 |
|---|---|---|
| `HostIntent` | 有 | acceptance status：accepted / rejected / waiting / conflict |
| `HostOrchestrationDecision` | 有 | decision record：proposed / committed / superseded / voided |
| `HostControlPolicy` | 不设生命周期状态 | policy revision / guard 结果不是业务状态 |
| `HostQualificationContext` | 有 | resolution：resolved / partial / missing / stale / conflict / unknown |
| `HostAssembly` | 有 | collecting / progressing / complete / blocked / failed / unknown |
| `HostReadinessDecision` | 有 | ready / blocked / waiting / failed / unknown |
| `RequiredQualificationPolicy` | 不设生命周期状态 | required / freshness / no-fallback 规则由 revision 约束 |
| `MemberExecutionHost` | 有 | established / progressing / active / held / quiescing / terminated / superseded |
| `HostActionAttempt` | 有 | prepared / dispatched / succeeded / failed / unknown / cancelled |
| `HostExternalAssociation` | 有 | pending / active / stale / release-pending / released / invalid / unknown |
| `HostGenerationFence` | 不设业务生命周期状态 | current pointer / revision / unknown-effect guard |
| `HostRegistration` | 有 | received / accepted / rejected / replaced / invalidated |
| `HostEndpoint` | 有 | candidate / active / stale / replaced / invalid |
| `HostSession` | 有 | pending / active / blocked / stale / replaced / closed / unknown |
| `RegistrationSessionPolicy` | 不设生命周期状态 | active uniqueness / replay / credential-binding guard |
| `HealthSignalSnapshot` | 有 | accepted / duplicate / late / stale / conflict / rejected |
| `HostHealthAssessment` | 有 | record status current / superseded / invalidated；四个 health axes 另行表达 |
| `HostFailureClassification` | 有 | candidate / confirmed / superseded / withdrawn / unknown |
| `HostRecoveryDecision` | 有 | proposed / committed / superseded / voided |
| `HostClosure` | 有 | open / invalidating / cleanup-pending / locally-closed / residual / blocked / unknown |
| `CleanupAttempt` | 有 | prepared / dispatched / succeeded / failed / unknown / gap / cancelled |
| `ResidualFinding` | 有 | open / confirmed / disputed / resolved / superseded / unknown |
| `ReconciliationCase` | 有 | open / action-requested / holding / escalated / resolved / unknown |
| `HostFactMaterial` | 不设独立生命周期状态 | immutable material；传播状态由 outbox / handoff 持有 |
| `HostHandoffRecord` | 有 | pending / attempted / gap / feedback-linked / closed / unknown |
| `SafeHostView` | 不设独立写状态 | immutable read snapshot；freshness 属 projection state / view field |
| `HostProjectionState` | 有 | fresh / stale / rebuilding / degraded / unavailable |
| `HostOutboxRecord` | 有 | pending / attempted / submitted / gap / unknown / closed |
| `HostHistoryEntry` | 不设生命周期状态 | append-only；纠正通过新条目 / prior ref 表达 |

## 4. CMP-MS-01：Host intent and orchestration decision

### 4.1 `HostIntent` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `accepted` | 双锚、来源、scope 和动作通过本地受理门禁 | 是 | 可触发显式 orchestration decision；不直接触发外部动作 |
| `rejected` | 输入越界、无效或不可验证，受理被否定 | 否 | 终态事实保留 reason / source；不得自动升级 |
| `waiting` | 正式来源或 owner 事实暂不可判定 | 受限 | 只能等待新正式事实；不得 default allow |
| `conflict` | 与等价意图、当前事实或幂等语境冲突 | 否 | 可供人工 / 正式补偿判断；不形成第二 intent |

### 4.2 `HostOrchestrationDecision` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `proposed` | 候选决定已由 accepted intent 和 current facts 形成 | 受限 | 需通过本地 commit guard |
| `committed` | 决定已成为本仓正式控制输入 | 是 | 可触发 qualification / generation / closure downstream；不表示动作完成 |
| `superseded` | 后续正式决定替代当前效力 | 否 | 旧决定只作为 history basis |
| `voided` | 提交前发现边界、冲突或前置失效 | 否 | 不得用于任何外部动作 |

### 4.3 CMP-MS-01 状态流转图

#### 状态流转图：CMP-MS-01

```text
HostIntent
  │ AcceptHostIntentCommand
  ├─► accepted
  ├─► rejected
  ├─► waiting
  └─► conflict

accepted HostIntent
  │ DecideHostOrchestrationCommand
  ▼
proposed HostOrchestrationDecision
  │ local commit guard
  ├─► committed
  └─► voided

committed decision
  │ replacement / superseding command
  ▼
superseded decision
```

关键说明：
- 只有 accepted intent 可形成 proposed decision，只有 committed decision 可进入下游主线。
- rejected / waiting / conflict intent 不得隐式重试为 accepted；必须有新的正式输入或显式补偿。
- superseded 只终结当前效力，不删除旧历史，也不把替代决定的结果反写到旧对象。

### 4.4 允许 / 禁止迁移

允许的核心迁移：

- `HostIntent`: `accepted` -> `rejected` 不允许原地回退；新的冲突事实必须追加为新记录。允许 `waiting` -> `accepted`、`waiting` -> `rejected`、新输入 -> `conflict`。
- `HostOrchestrationDecision`: `proposed` -> `committed` 或 `proposed` -> `voided`；`committed` -> `superseded` 只能由新的正式决定触发。

禁止的核心迁移：

- `rejected` / `conflict` -> `accepted` 原地改写。
- `committed` -> `proposed` / `voided` 原地回退。
- Query、Consumer、Projection 或 Job 直接把 intent / decision 推进为 committed。

### 4.5 状态传播与停审

`accepted` intent 与 `committed` decision 追加 `HostHistoryEntry`，并可形成 body-free material / outbox marker；`waiting`、`conflict` 和 `voided` 也必须可查询和可追溯，但不触发外部 action。Query 只读取这些状态。

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | 两个状态轴分别归 `HostIntent` / `HostOrchestrationDecision`；policy 不拥有业务状态。 |
| 触发覆盖 | pass | `IB-MS-001/002` 与 Step 8 两条 P0 流覆盖所有正常迁移。 |
| 允许 / 禁止迁移 | pass | 提交、替代、等待、冲突和 voided 语义明确，无原地成功回退。 |
| 传播 | pass | history / material 只传播已提交本地事实，不触发隐式动作。 |

停审结论：`CMP-MS-01` state transitions completed / pass；允许进入 CMP-MS-02。

## 5. CMP-MS-02：Host qualification and assembly

### 5.1 `HostQualificationContext` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `resolved` | 所有 required source 可验证且 freshness 合格 | 是 | 可进入 assembly；不直接等于 ready |
| `partial` | 仅部分 source 可用 | 否 | 缺口显式保留，不得用旧缓存补齐 |
| `missing` | required source 缺少正式 ref / body-free summary | 否 | 等待 owner 事实或保持 blocked |
| `stale` | source 超过允许 freshness | 否 | 需新正式事实；不能继续放行 |
| `conflict` | owner / scope / anchor / generation 不一致 | 否 | 需显式冲突处置；不覆盖旧 context |
| `unknown` | resolver / contract / outcome 无法判定 | 否 | fail closed，进入 hold / reconciliation |

### 5.2 `HostAssembly` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `collecting` | required item set 或资格来源尚未完整 | 受限 | 可等待 source / item，但不创建 ready |
| `progressing` | required item 已冻结，分项动作正在推进 | 是（受限） | 只能使用 matching generation 的 local outcome |
| `complete` | 所有 required item 有本地可接受 outcome | 受限 | 仍需独立 `HostReadinessDecision` |
| `blocked` | 合同、owner、required source 或 no-fallback 阻塞 | 否 | 正向 action 不得越过 |
| `failed` | 至少一个 required item 明确失败 | 否 | 可形成新的 recovery / closure 输入，但不自动触发 |
| `unknown` | 外部 effect 或回送结果无法判定 | 否 | 保持 unknown fence / reconciliation |

### 5.3 `HostReadinessDecision` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `ready` | 同一 generation 的 required qualification 与 assembly 均成立 | 是（仅装配语义） | 不等于 registered、healthy、Runtime ready |
| `blocked` | 正式 contract / owner / required boundary 阻止正向 | 否 | 不得通过 fallback 或 fake |
| `waiting` | 等待允许的新 source / item outcome | 受限 | 不代表已失败或已成功 |
| `failed` | required 条件有明确不可接受结果 | 否 | 需新的 decision / recovery 语境 |
| `unknown` | freshness / outcome / conflict 无法判定 | 否 | 不得升格为 ready |

### 5.4 CMP-MS-02 状态流转图

#### 状态流转图：CMP-MS-02

```text
HostQualificationContext
  │ ResolveHostQualificationCommand / source Consumer
  ├─► resolved
  ├─► partial / missing
  ├─► stale / conflict
  └─► unknown

resolved context
  │ CoordinateHostAssemblyCommand
  ▼
collecting HostAssembly
  │ required items freeze / local outcomes
  ├─► progressing
  ├─► blocked
  ├─► failed
  └─► unknown

complete assembly
  │ readiness evaluation
  ├─► ready
  ├─► waiting / blocked
  ├─► failed
  └─► unknown HostReadinessDecision
```

关键说明：
- `resolved -> assembly` 只是资格到装配的允许方向；`ready` 必须由同 generation 的 required item 共同支持。
- partial / missing / stale / conflict / unknown 不能直接进入 ready；新 source change 通过 Consumer 形成新 context / revision。
- assembly 的 complete 不传播成 registered / healthy；这些状态由 CMP-04 / CMP-05 独立拥有。

### 5.5 允许 / 禁止迁移与传播

允许的核心迁移：

- `HostQualificationContext`: `partial` / `missing` / `stale` -> `resolved` 只能由新的正式 owner source 使其重新判定；任何状态都可因新 source 变为 `conflict` / `unknown`。
- `HostAssembly`: `collecting` -> `progressing` -> `complete`，或从 progressing 转 `blocked` / `failed` / `unknown`。
- `HostReadinessDecision`: 新 revision 可形成 `waiting` / `blocked` / `failed` / `unknown`；只有全部 required 条件在同一 generation 成立才可形成 `ready`。

禁止的核心迁移：

- `HostAssembly.complete` -> `HostReadinessDecision.ready` 无独立 readiness evaluation。
- `HostReadinessDecision.blocked` / `unknown` -> `ready` 通过 registration、heartbeat、backend status、projection 或 fake。
- 旧 generation context / assembly / outcome 直接覆盖 current generation 状态。

状态传播：

- context / assembly / readiness 每次 committed change 追加 history，并可形成 material / projection slice。
- readiness 变化可作为 CMP-04 registration 前置读取，但不会反向修改 registration；source Consumer 只触发 re-evaluation marker。

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | context、assembly、readiness 三轴各自归 CMP-MS-02 对象；policy 不变成状态。 |
| 触发覆盖 | pass | `IB-MS-004/005/006`、source Consumer 和 Step 8 流可回指。 |
| fail-closed | pass_with_blockers | `MSVC-UP-003/004/006` 使对应 positive item 继续 blocked / waiting。 |
| 传播 | pass | history / material / safe view 可传播摘要；不传播外部正文或 health truth。 |

停审结论：`CMP-MS-02` state transitions completed / pass；允许进入 CMP-MS-03。

## 6. CMP-MS-03：Host instance and carrier progression

### 6.1 `MemberExecutionHost` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `established` | host identity / generation 已本地提交 | 受限 | 尚不表示 backend resource、ready 或 session 存在 |
| `progressing` | generation-bound action 正在推进 | 是（受限） | 必须有 committed `HostActionAttempt` |
| `active` | 本地 host lifecycle 允许当前关联继续存在 | 是（仅 host 语义） | 不等于 ready、healthy、registered 或 Runtime ready |
| `held` | conflict / unknown effect / dependency gap 冻结推进 | 否 | 需新正式事实或 reconciliation |
| `quiescing` | stop / terminate / replacement 决定已成立，正在收束 | 受限 | 不接受新的竞争 lifecycle action |
| `terminated` | 本地 host lifecycle 已终结 | 否 | cleanup / external deletion 可仍 pending |
| `superseded` | 新 generation 已取得 current 效力 | 否 | 旧 host history 保留，不原地删除 |

### 6.2 `HostActionAttempt` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `prepared` | attempt / effect key 已在 external call 前提交 | 是（受限） | 可由 dispatch job 推进 |
| `dispatched` | 已越过 external port，未声明外部接受 / 完成 | 受限 | 等待 safe outcome 或 feedback |
| `succeeded` | matching safe outcome 已关联 | 受限 | 不自动产生 readiness / health / cleanup complete |
| `failed` | 明确失败摘要已关联 | 否（需新决定） | 可作为 recovery / assembly / reconciliation basis |
| `unknown` | effect / response 无法判定 | 否 | stable effect key + hold / reconciliation |
| `cancelled` | 在无未知副作用阶段被正式取消 | 否 | 历史保留 |

### 6.3 `HostExternalAssociation` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | typed association 意图已成立，外部 ref / outcome 尚未确认 | 受限 | 不得作为 ready 或 active backend truth |
| `active` | 本地确认该 ref 可作为当前 generation 关联 | 是（仅关联语义） | 不等于外部资源健康 / 完成 |
| `stale` | ref / summary 不再满足 freshness | 否 | 需新 owner summary |
| `release-pending` | 正式 release / closure 已成立，外部完成待确认 | 受限 | 不得盲重放 |
| `released` | matching safe release summary 已关联 | 否（关联终结） | 不等于全局资源 cleanup truth |
| `invalid` | owner / scope / generation / ref 验证失败 | 否 | 保留 invalidation history |
| `unknown` | association / release outcome 无法判定 | 否 | 进入 reconciliation |

### 6.4 CMP-MS-03 状态流转图

#### 状态流转图：CMP-MS-03

```text
MemberExecutionHost
  │ EstablishHostGenerationCommand
  ▼
established
  │ PrepareHostActionCommand
  ▼
progressing
  ├─► active
  ├─► held
  └─► quiescing

progressing action
  │ dispatch / feedback
  ├─► prepared -> dispatched -> succeeded
  ├─► prepared / dispatched -> failed
  ├─► prepared / dispatched -> unknown
  └─► prepared -> cancelled

active host
  │ restart / replacement decision
  ▼
superseded old host -> established new host generation

quiescing host
  │ CloseHostCommand / local closure
  ▼
terminated
```

关键说明：
- host lifecycle、attempt outcome 和 external association 是三条并行状态轴；图中箭头只表达主要依赖，不表示它们共享一个枚举。
- `unknown` 和 `held` 阻止竞争 action；restart / replacement 只能建立新 generation，旧 host 进入 superseded / terminated history。
- `succeeded` 是 matching safe outcome 的本地状态，不是 backend completion 或 readiness。

### 6.5 允许 / 禁止迁移与传播

允许的核心迁移：

- `MemberExecutionHost`: `established` -> `progressing` -> `active`；正式 recovery / closure 可使其进入 `held` / `quiescing`；本地终结后 `terminated`；新 generation 建立后旧实例 `superseded`。
- `HostActionAttempt`: `prepared` -> `dispatched` -> `succeeded` / `failed` / `unknown`；未越过 external port 可 `cancelled`。
- `HostExternalAssociation`: `pending` -> `active` / `invalid` / `unknown`；active -> `stale` / `release-pending`；release-pending -> `released` / `unknown`。

禁止的核心迁移：

- old generation 的 feedback 将 `superseded` host、旧 attempt 或旧 association 原地改回 current / active。
- `unknown` attempt / association 直接回到 prepared 并生成新 effect key。
- backend resource existence、container process alive 或 registration accepted 直接将 host 置为 active / ready / healthy。
- `terminated` host 原地回到 active；必须形成新 host generation。

状态传播：

- host / attempt / association 变化追加 `HostHistoryEntry`，并按 committed change 形成 material / outbox marker。
- attempt / association safe outcome 可成为 CMP-02 readiness、CMP-05 health 或 CMP-06 closure 的 basis ref；不跨 owner 直接写其状态。
- generation replacement 传播 predecessor / supersedes ref 到安全视图和下游 handoff，但不传播外部资源正文。

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | host、attempt、association 分轴；fence 是 guard 而非状态对象。 |
| 触发覆盖 | pass | generation / attempt Command、dispatch Job、outcome Consumer、close / recovery flows 已定义。 |
| generation / unknown fence | pass | 迟到、重放、竞争和 unknown 不会产生第二 current host 或盲重放。 |
| 传播 | pass | history / material / safe basis refs 分层，不反写上游或外部 truth。 |

停审结论：`CMP-MS-03` state transitions completed / pass；允许进入 CMP-MS-04。

## 7. CMP-MS-04：Registration and Host Session

### 7.1 `HostRegistration` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `received` | registration input 已完成边界 mapping，尚未判定 | 受限 | 需 registration guard |
| `accepted` | source、subject、credential context 和 generation 均通过 | 是（仅 registration） | 不等于 endpoint / session / Runtime ready |
| `rejected` | 冒用、重放、冲突、旧世代或资格失败 | 否 | 终态保留 reason |
| `replaced` | 新 registration 取得 current 效力 | 否 | 旧 history 保留 |
| `invalidated` | host replacement / closure / explicit invalidation 终结活动效力 | 否 | 不删除 registration truth |

### 7.2 `HostEndpoint` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `candidate` | safe endpoint material 已映射，尚未成为唯一 current | 受限 | 不能作为当前接入成功 |
| `active` | 与 accepted registration / generation 唯一关联 | 是（仅 endpoint） | endpoint 可用不等于健康 |
| `stale` | 接入材料 freshness 失效 | 否 | 需新 registration / endpoint |
| `replaced` | 新 endpoint 取得 current 效力 | 否 | 旧 endpoint history 保留 |
| `invalid` | source / scope / registration / generation 不匹配 | 否 | 不得继续作为接入依据 |

### 7.3 `HostSession` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | 本地前置成立，对端 association 尚未闭口 | 受限 | Runtime surface pending 时的正式语义 |
| `active` | host / registration / endpoint 与允许 refs 唯一关联 | 是（仅 Host Session 壳） | 不等于 Runtime run active |
| `blocked` | contract / credential / prerequisite 阻止正向建立 | 否 | 不得 fallback |
| `stale` | endpoint / registration / external ref 过时 | 否 | 需显式 replacement / new input |
| `replaced` | 新 Host Session 取得 current 效力 | 否 | 旧会话历史保留 |
| `closed` | closure / invalidation 已终结本地关联 | 否 | 不等于 Runtime run stopped |
| `unknown` | 对端关联或 current status 无法判定 | 否 | 保持 unknown / reconciliation |

### 7.4 CMP-MS-04 状态流转图

#### 状态流转图：CMP-MS-04

```text
HostRegistration
  │ AcceptHostRegistrationCommandPlaceholder
  ├─► received -> accepted
  ├─► rejected
  └─► replaced / invalidated by explicit new fact

accepted registration
  │ MaintainHostSessionCommandPlaceholder
  ▼
candidate HostEndpoint
  ├─► active
  ├─► stale
  ├─► replaced
  └─► invalid

accepted registration + active endpoint
  │ Runtime association seam
  ▼
pending HostSession
  ├─► active
  ├─► blocked / unknown
  ├─► stale / replaced
  └─► closed by closure / invalidation
```

关键说明：
- registration、endpoint、Host Session 各有状态轴，但 active 关联必须共享同一 host generation 和 single-active guard。
- Runtime seam 未闭口时 Host Session 可保持 pending / blocked；不得用 endpoint 或 heartbeat 直接跳到 active Runtime run。
- closure / replacement 只追加失效和替代事实，不原地删除旧关联。

### 7.5 允许 / 禁止迁移与传播

允许的核心迁移：

- `HostRegistration`: `received` -> `accepted` / `rejected`；新 registration 可使旧记录 `replaced`；closure / host replacement 可使 current registration `invalidated`。
- `HostEndpoint`: `candidate` -> `active` / `stale` / `invalid`；新 endpoint 使旧 endpoint `replaced`。
- `HostSession`: `pending` -> `active` 仅在 formal association contract 与 local guard 均成立；任何状态可因 stale / replacement / closure 进入相应终态或 blocked / unknown。

禁止的核心迁移：

- endpoint `active` 直接把 Host Session 置为 active，无 session association guard。
- heartbeat / process alive 直接把 registration 从 received 置为 accepted。
- old generation registration / endpoint / session 覆盖 current。
- `closed` / `replaced` Host Session 原地回到 active。

状态传播：

- registration / endpoint / session 状态变化追加 history，并形成 safe access slice / material marker。
- session stale / closed 可作为 CMP-05 health basis 或 CMP-06 closure input，但不反向改变 host lifecycle。
- external Runtime association feedback 只能更新 matching session / handoff layer，不能创建 Runtime run truth。

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | registration、endpoint、session 各自归 CMP-MS-04；policy 只 guard。 |
| 触发覆盖 | pass | `IB-MS-007/008/009` 和 Step 8 registration/session flows 已覆盖。 |
| 单活动 / 代际约束 | pass | active 关联必须同 generation；旧实例与 late input 不覆盖 current。 |
| 跨边界 | pass_with_blockers | Runtime / Member / credential exact contract pending；pending / blocked 不解释为 ready。 |

停审结论：`CMP-MS-04` state transitions completed / pass；允许进入 CMP-MS-05。

## 8. CMP-MS-05：Host health and recovery

### 8.1 `HealthSignalSnapshot` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `accepted` | 来源、generation、顺序和 freshness 允许进入评估 | 是（仅 snapshot 输入） | 不等于健康结论 |
| `duplicate` | 等价信号已存在 | 否（不新增结论） | 可关联既有 snapshot |
| `late` | 合法但晚于当前评估窗口 | 否（仅历史） | 不覆盖 current assessment |
| `stale` | freshness 不满足评估要求 | 否 | 可作为 uncertainty basis |
| `conflict` | source / generation / sequence / summary 冲突 | 否 | 需显式调查 / reconciliation |
| `rejected` | 来源、范围或 body boundary 不允许 | 否 | 记录原因，不进入健康评估 |

### 8.2 `HostHealthAssessment` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `current` | 当前 generation 最新可用 assessment record | 是（健康判断） | 四个 health axes 另行表达 |
| `superseded` | 新 assessment 取得 current 效力 | 否 | 旧 assessment 仍为 history basis |
| `invalidated` | generation / basis 冲突使 assessment 不可用 | 否 | 不得触发 recovery |

四轴健康值不是额外的单一状态机，而是 assessment 的并行结论：

| 健康轴 | 允许语义 | 禁止替代 |
|---|---|---|
| `host_axis` | healthy / degraded / unhealthy / unknown | 不替代 session / backend / Runtime health |
| `session_axis` | host-session 可用 / degraded / unavailable / unknown | 不替代 Runtime run state |
| `backend_axis` | allowed backend summary healthy / degraded / unavailable / unknown | 不拥有 backend truth |
| `uncertainty_axis` | complete / stale / incomplete / conflict / unknown | 不能被其他轴忽略 |

### 8.3 `HostFailureClassification` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `candidate` | 有异常线索但依据不足 | 受限 | 可等待新 snapshot / assessment |
| `confirmed` | 本地依据足以形成 host-side failure 类别 | 是（处置输入） | 不等于 business / Runtime failure |
| `superseded` | 新分类替代当前效力 | 否 | 历史保留 |
| `withdrawn` | 新事实证明分类不再适用 | 否 | 不自动恢复 host |
| `unknown` | 层级 / 类别无法可靠判定 | 否 | 只能支持 hold / investigation |

### 8.4 `HostRecoveryDecision` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `proposed` | 候选 recover / restart / stop / terminate / hold 决定 | 受限 | 需 formal control / generation guard |
| `committed` | 宿主侧处置决定已正式成立 | 是（下游 action input） | 不等于 action executed / Runtime recovered |
| `superseded` | 新处置决定替代当前效力 | 否 | 旧决定 history 保留 |
| `voided` | control / generation / prerequisite 不再满足 | 否 | 不得推进 action |

### 8.5 CMP-MS-05 状态流转图

#### 状态流转图：CMP-MS-05

```text
HealthSignalSnapshot
  │ HostHealthSignalConsumerPlaceholder
  ├─► accepted
  ├─► duplicate / late
  ├─► stale / conflict
  └─► rejected

accepted snapshots + current facts
  │ EvaluateDueHostHealthJob
  ▼
current HostHealthAssessment
  │ new revision / basis conflict
  ├─► superseded
  └─► invalidated

assessment
  │ classification
  ├─► candidate -> confirmed
  ├─► candidate / confirmed -> unknown
  └─► confirmed -> withdrawn / superseded

formal control + assessment / failure
  │ DecideHostRecoveryCommand
  ▼
proposed HostRecoveryDecision
  ├─► committed
  ├─► voided
  └─► superseded by new decision
```

关键说明：
- signal、assessment、failure 和 recovery decision 是四个不同层级；signal 不直接触发 recovery。
- assessment 的四轴 health 不能被单一 status 覆盖；uncertainty axis 为 stale / conflict / unknown 时，处置可被 hold。
- committed recovery decision 只把 action / closure 交给 CMP-03 / CMP-06，不能声明 Runtime checkpoint 恢复或 external action complete。

### 8.6 允许 / 禁止迁移与传播

允许的核心迁移：

- `HealthSignalSnapshot`: intake 可形成 accepted / duplicate / late / stale / conflict / rejected；只有 accepted matching snapshot 才作为新 assessment basis。
- `HostHealthAssessment`: current -> superseded 或 invalidated；新评估必须追加 revision，不原地修改旧结论。
- `HostFailureClassification`: candidate -> confirmed / unknown；新依据可 supersede / withdraw。
- `HostRecoveryDecision`: proposed -> committed / voided；committed -> superseded 只能由新正式决定触发。

禁止的核心迁移：

- signal accepted -> recovery committed 无 assessment / formal command。
- backend / heartbeat / Observability alert 直接把 assessment 置 healthy 或 recovery 置 committed。
- `unknown` / stale assessment 被当 confirmed failure 或 ready input，除非新正式 basis 形成。
- `committed` recovery decision 回退 proposed / voided 原地改写。

状态传播：

- assessment / failure / recovery 状态变化追加 history / material marker，并可进入 safe health view。
- committed recovery decision 可作为 CMP-03 new generation / action 或 CMP-06 closure 的输入；下游结果通过 attempt / feedback 回流，不反写 decision。
- health view stale / unavailable 不改变 source assessment，projection 只读派生。

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | snapshot、assessment、failure、decision 四轴独立；四个 health axes嵌于 assessment。 |
| 触发覆盖 | pass | `IB-MS-010/011/012`、health Job 和 Step 8 flows 全部可回指。 |
| 控制边界 | pass | 只有 formal recovery Command 形成 committed decision；signal / Job 不隐式控制。 |
| 传播 | pass | history / material / safe view 只传播本地结论和 uncertainty，不吸收 Runtime / backend truth。 |

停审结论：`CMP-MS-05` state transitions completed / pass；允许进入 CMP-MS-06。

## 9. CMP-MS-06：Host closure and reconciliation

### 9.1 `HostClosure` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `open` | closure scope 已建立，尚未完成本地失效 | 受限 | 可推进 invalidation |
| `invalidating` | registration / endpoint / session / association 正在显式失效 | 受限 | 不接受竞争新 action |
| `cleanup-pending` | 本地失效已提交，仍有 cleanup / release work | 受限 | external completion 未知时保持 |
| `locally-closed` | 本仓 required invalidation / local records 已收束 | 是（仅 local closure） | 不等于 external cleanup completed |
| `residual` | 仍有关联 residual / orphan / drift finding | 否（需 case） | 不删除历史 |
| `blocked` | required owner / port / contract 阻止收束 | 否 | fail closed |
| `unknown` | local / external effect 无法判定 | 否 | hold / reconciliation |

### 9.2 `CleanupAttempt` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `prepared` | cleanup / release attempt 与 effect key 已提交 | 是（受限） | 可由 Job 推进 |
| `dispatched` | 已越过 cleanup port | 受限 | 等待 safe feedback |
| `succeeded` | matching safe outcome 已记录 | 受限 | 不等于 external cleanup truth |
| `failed` | 明确失败已记录 | 否（需新 disposition） | 可形成 residual / case |
| `unknown` | effect / result 无法判定 | 否 | stable key + hold |
| `gap` | route / contract / feedback 缺口 | 否 | 保留本地缺口 |
| `cancelled` | 未产生未知副作用前正式取消 | 否 | 历史保留 |

### 9.3 `ResidualFinding` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `open` | 差异已发现，尚无 disposition | 受限 | 等待 case |
| `confirmed` | local facts 与 safe summary 足以确认差异 | 是（对账输入） | 不自动修复 |
| `disputed` | 摘要冲突，无法确认 | 否 | 只能 hold / escalate |
| `resolved` | 有显式 case resolution basis | 受限 | 仅本地 finding 闭合 |
| `superseded` | 新 finding 替代当前描述 | 否 | 历史保留 |
| `unknown` | owner / time / outcome 不可判定 | 否 | 保持未知 |

### 9.4 `ReconciliationCase` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `open` | findings 已聚合，尚无 disposition | 受限 | 可形成正式 case decision |
| `action-requested` | local repair / cleanup request 已形成 | 受限 | 不等于 action complete / accepted |
| `holding` | unknown / conflict / prerequisite gap 使 case 暂停 | 否 | 不盲重试 |
| `escalated` | 已交给正式 owner / operator 语境 | 受限 | 不等于对端接受 |
| `resolved` | 本地 resolution basis 已提交 | 受限 | 不泛化为 external completion |
| `unknown` | disposition / effect 无法判定 | 否 | 继续 hold / investigate |

### 9.5 CMP-MS-06 状态流转图

#### 状态流转图：CMP-MS-06

```text
HostClosure
  │ CloseHostCommand
  ▼
open
  │ local invalidation
  ▼
invalidating -> cleanup-pending
  ├─► locally-closed
  ├─► blocked
  ├─► unknown
  └─► residual

CleanupAttempt
  │ ProgressPendingHostCleanupJob
  ▼
prepared -> dispatched
  ├─► succeeded
  ├─► failed
  ├─► unknown
  ├─► gap
  └─► cancelled

ResidualFinding
  │ ReconcileHostResidualsJob
  ▼
open -> confirmed / disputed / unknown
  │ explicit case resolution
  ├─► resolved
  └─► superseded

ReconciliationCase
  │ disposition
  ├─► action-requested
  ├─► holding
  ├─► escalated
  ├─► resolved
  └─► unknown
```

关键说明：
- `locally-closed`、cleanup `succeeded`、finding `resolved` 和 case `resolved` 是不同的本地语义，不能拼成 external cleanup completed。
- feedback / observation 只能推进匹配 attempt / finding / case；不能把 closure 重新变成 open 或恢复 host。
- unknown / disputed / holding 保留 gap 与历史，直到正式新事实或 owner disposition。

### 9.6 允许 / 禁止迁移与传播

允许的核心迁移：

- `HostClosure`: `open` -> `invalidating` -> `cleanup-pending` -> `locally-closed`；未闭合差异可进入 `residual`；依赖缺口可进入 `blocked` / `unknown`。
- `CleanupAttempt`: `prepared` -> `dispatched` -> `succeeded` / `failed` / `unknown` / `gap`；允许阶段可 cancelled。
- `ResidualFinding`: `open` -> `confirmed` / `disputed` / `unknown`，有 case resolution 才可 `resolved`，新准确事实可 `superseded`。
- `ReconciliationCase`: `open` -> `action-requested` / `holding` / `escalated` / `unknown`；有 local basis 才可 `resolved`。

禁止的核心迁移：

- host terminated / local invalidation 直接把 closure 置为 external cleanup completed。
- cleanup request receipt / timeout / resource absence 直接把 attempt 置 succeeded 或 finding resolved。
- Job 直接将 case resolved 而没有 resolution basis，或由 case 隐式创建 restart / terminate。
- `locally-closed` / `resolved` closure 原地回到 open；需要新 closure / new generation 事实。

状态传播：

- closure / attempt / finding / case 状态追加 history / material；safe view 可显示 local closure、residual 和 gap 层。
- closure invalidation 可使 CMP-04 registration / endpoint / session 进入 invalidated / closed；不得反向恢复。
- case disposition 可授权后续 action marker，但 external cleanup / owner acceptance 必须通过 feedback layer 单独表示。

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | closure、cleanup、finding、case 四轴独立；外部完成状态不本地化。 |
| 触发覆盖 | pass | `IB-MS-013/014/017` cleanup branch、cleanup / reconcile Jobs 和 Step 8 flows 已覆盖。 |
| 迁移安全 | pass | unknown / gap / disputed / holding 不会被默认成功清除；不可逆动作保持 effect fence。 |
| 传播 | pass | closure invalidation向 CMP-04 单向传播；history / material / view 不回写 source。 |

停审结论：`CMP-MS-06` state transitions completed / pass；允许进入 CMP-MS-07。

## 10. CMP-MS-07：Host fact handoff and safe consumption

### 10.1 无独立生命周期状态的对象

| 对象 | 状态判断 | 约束 |
|---|---|---|
| `HostFactMaterial` | 无独立生命周期状态 | 只能从单一 committed source change 形成 immutable body-free material；传播进度由 outbox / handoff 持有。 |
| `SafeHostView` | 无独立写状态 | 是带 source revision 与 freshness 的 immutable read snapshot；是否可供读取由 projection state 表达。 |
| `HostHistoryEntry` | 无独立生命周期状态 | append-only；纠正通过新 entry、prior / supersedes ref 表达，禁止原地改写。 |

这三个对象不是“缺少状态设计”，而是刻意不承担 progression truth。material formed、view generated 和 history appended 均不等于 published、delivered、observed、accepted 或 source current。

### 10.2 `HostHandoffRecord` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | material-target 交接记录已建立，尚无本地 attempt | 受限 | 不声明 route ready 或对端存在。 |
| `attempted` | 至少一次相同 handoff key 的本地尝试已记录 | 受限 | 不等于 delivered。 |
| `gap` | route、contract、publisher 或 feedback 缺口已确认 | 否 | source truth 不回滚；等待正式合同或可验证新事实。 |
| `feedback-linked` | 已关联至少一种正式 owner 的安全反馈摘要 | 受限 | delivery、observation、acceptance 三层仍相互独立。 |
| `closed` | 本地 policy 已显式结束该 handoff 的推进 | 否（本地终结） | 不表示 accepted，也不补齐缺失反馈。 |
| `unknown` | attempt effect 或反馈关联结果不可判定 | 否 | 保持 stable handoff key，进入 hold / reconciliation。 |

### 10.3 `HostProjectionState` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `fresh` | 已追上当前可知 committed cursor 且无未闭合 gap | 是（只读供给） | 仍是 projection，不替代 source truth。 |
| `stale` | 投影已落后，但可带明确 freshness 提供受限读取 | 受限 | Query 不得借机 refresh。 |
| `rebuilding` | 正从 committed source 显式重建 | 受限 | 不反写 CMP-MS-01~06。 |
| `degraded` | 部分 slice 或 source gap 不可用 | 受限 | 必须返回缺失 / 降级标记。 |
| `unavailable` | 当前无法提供可靠 projection | 否 | 核心 source write 不因此失败；Query 不得伪造默认视图。 |

### 10.4 `HostOutboxRecord` 状态定义

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| `pending` | committed change 与 material 已绑定，等待 publisher | 是（本地传播） | 不声明 route 或 transport ready。 |
| `attempted` | 已记录相同 publication key 的本地发布尝试 | 受限 | 不等于 submitted / delivered。 |
| `submitted` | publication port 返回允许记录的本地提交摘要 | 受限 | 不等于 Bus delivered、observed 或 accepted。 |
| `gap` | route、contract、publisher 或 target 缺口已确认 | 否 | 保留记录并显式阻塞。 |
| `unknown` | 提交 effect 无法判定 | 否 | 不得换 key 盲重发。 |
| `closed` | 本地 policy 已显式结束 outbox progression | 否（本地终结） | 外部 outcome 仍只由 handoff record 分层承接。 |

### 10.5 CMP-MS-07 状态流转图

#### 状态流转图：CMP-MS-07

```text
committed source change
  │ materialize / enqueue
  ▼
pending HostOutboxRecord
  │ PublishHostFactOutboxJob
  ▼
attempted
  ├─► submitted
  ├─► gap
  ├─► unknown
  └─► closed by explicit local policy

HostHandoffRecord.open(material, target, stable key)
  ▼
pending
  │ publish attempt / matching feedback
  ├─► attempted
  ├─► gap
  ├─► unknown
  ├─► feedback-linked
  └─► closed by explicit local policy

HostProjectionState
  ├─► fresh -> stale / degraded / unavailable
  ├─► stale / degraded / unavailable -> rebuilding
  └─► rebuilding -> fresh / degraded / unavailable
```

关键说明：
- outbox、per-target handoff 和 projection 是三条独立状态轴；一个轴的正向状态不能替代另一个轴的结果。
- `submitted` 只表示本地 publication boundary 的允许摘要；delivered / observed / accepted 必须来自各自正式 owner 的 matching feedback。
- `gap` / `unknown` 只有在新正式事实、相同 stable key 和显式 reconciliation guard 下才可继续推进，不能盲重放。
- `HostFactMaterial`、`SafeHostView` 和 `HostHistoryEntry` 保持 immutable，不因传播或投影状态改变而原地迁移。

### 10.6 允许 / 禁止迁移与传播

允许的核心迁移：

- `HostOutboxRecord`: `pending` -> `attempted` -> `submitted` / `gap` / `unknown`；相同 publication key 经显式可重试判定后，`gap` 可重新进入 attempted；unknown 只有 effect 被正式判清后才能继续；各状态可由显式本地 policy 进入 `closed`。
- `HostHandoffRecord`: `pending` -> `attempted` / `gap` / `unknown` / `feedback-linked`；matching 正式反馈可使 attempted / gap / unknown 进入 `feedback-linked`；显式本地 policy 可进入 `closed`。
- `HostProjectionState`: `fresh` -> `stale` / `degraded` / `unavailable`；stale / degraded / unavailable 可显式进入 `rebuilding`；有完整 committed-source basis 后 rebuilding -> fresh，否则进入 degraded / unavailable；顺序 apply 闭合落后时 stale 可恢复 fresh。

禁止的核心迁移：

- `HostOutboxRecord.submitted` -> delivered / observed / accepted，或由 timeout / local acknowledgement 推断这些外部结果。
- `HostHandoffRecord.feedback-linked` 自动补齐 delivery、observation、acceptance 中未出现的层级。
- `gap` / `unknown` 在没有新正式依据时换 stable key 进入 attempted，或因兄弟项目并行草稿而升级为 ready。
- projection `stale` / `degraded` / `unavailable` 由 Query 直接改成 fresh，或 projection 状态反写 source facts。
- `closed` outbox / handoff 原地回到 pending；需要新的正式 local policy / identity 形成新记录。

状态传播：

- CMP-MS-01~06 committed change 可形成 immutable material、append-only history 和 pending outbox；任何传播失败都不回滚 source truth。
- outbox progression 只传播本地 publication 语义；per-target feedback 只更新 matching handoff record。
- projection apply / rebuild 只更新 projection state 与新 `SafeHostView`；stale / degraded / unavailable 必须对 Query 可见。
- `L2-member`、`L2-member-images`、Runtime、Bus、Observability 或其他 consumer 的 exact route / receipt / feedback 当前未闭合，只能保留 placeholder / blocked / waiting。

| 审查项 | 结论 | 说明 |
|---|---|---|
| 状态归属 | pass | handoff、projection、outbox 三轴分别归对应对象；material / view / history 明确 immutable。 |
| 触发覆盖 | pass | `IB-MS-015/016/017`、publish / projection / gap Jobs 和 Step 8 flows 均可回指。 |
| outcome 分层 | pass | local attempted / submitted 与 delivered / observed / accepted 不互推。 |
| 跨项目边界 | pass_with_blockers | exact route、receipt 和 sibling feedback 均为 placeholder；并行讨论不提供 ready 证明。 |

停审结论：`CMP-MS-07` state transitions completed / pass；允许执行 Step 9 跨状态终审。

## 11. 状态传播关系

#### 状态传播关系图

```text
CMP-MS-01~06 committed local change
  ├─► append-only HostHistoryEntry
  ├─► immutable HostFactMaterial
  │       │ local enqueue
  │       ▼
  │    HostOutboxRecord
  │       │ publication placeholder
  │       ▼
  │    HostHandoffRecord per target
  │       ├─► local attempt / gap / unknown
  │       └─► delivery / observation / acceptance safe layers
  │
  └─► HostProjectionState apply / rebuild
          │
          ▼
       immutable SafeHostView
          │ Query only
          ▼
       authorized safe consumption
```

关键说明：
- 图只表达已提交状态变化向 history、material、outbox、handoff 和 projection 的传播，不表达跨 owner 分布式事务。
- source truth、传播进度、外部 outcome 和只读投影各有 owner；任何下游失败均不得逆写 source truth。
- 兄弟项目和外部系统只在正式双侧合同闭口后成为可验证 target；当前未闭口分支保持 placeholder / blocked / waiting。
- Query 只消费 source / projection / history，不触发 publish、rebuild、repair、reconciliation 或 lifecycle action。

## 12. 跨状态一致性审计

| 审计项 | 结论 | 处理 / 证据 |
|---|---|---|
| 全局状态模型 | pass | 不设单一 `HostStatus`；acceptance、readiness、host lifecycle、registration、session、health、closure、handoff 和 projection 保持正交。 |
| `active` 近义冲突 | pass | host active、association active、endpoint active、Host Session active 各有 owner 和限定语义，不互相推断。 |
| `ready` / `healthy` | pass | readiness 只证明装配条件；四轴 health 只证明本地运行评估；均不等于 Runtime ready。 |
| `current` / `accepted` | pass | current assessment、accepted registration / signal 和 external acceptance layer 不共享状态轴。 |
| `succeeded` 近义冲突 | pass | host action / cleanup attempt succeeded 只代表 matching safe local outcome，不代表 readiness、external cleanup 或 handoff accepted。 |
| `closed` / `resolved` | pass | local closure、session closed、outbox / handoff closed、finding / case resolved 各自终结本地语义，不合并成 external completion。 |
| `stale` / `unknown` / `gap` | pass | 各对象保留 owner-specific uncertainty；禁止用另一状态轴的正向状态覆盖。 |
| generation 一致性 | pass | host、attempt、association、registration、endpoint、session、signal与 feedback 均受 matching generation / stable key guard；旧世代只进历史。 |
| writer 唯一性 | pass | Command 写正式决定，Consumer 写 matching local snapshot / feedback，Job 推进既有 work；Query 永不写。 |
| 状态传播 | pass | committed source -> history / material / outbox / projection 单向传播；handoff feedback 不回滚 source / outbox。 |
| immutable 对象 | pass | material、view、history 不伪造 lifecycle；纠正与重建产生新记录 / snapshot。 |
| 外部合同保真 | pass_with_blockers | `MSVC-UP-001~008` 及并行 sibling exact contracts 均未被状态名补闭；positive path 保持 blocked / waiting。 |
| 详细设计可承接性 | pass | 03 可继续展开 revision guard、UoW、transition function、effect fence、cursor 与错误模型，不需新增业务状态轴。 |

## 13. Step 7 / Step 8 触发覆盖反查

| 状态轴 | Step 7 触发骨架 | Step 8 处理流 | 结论 |
|---|---|---|---|
| intent / orchestration decision | `IB-MS-001/002` Commands | acceptance / decision P0 flows | covered |
| qualification / assembly / readiness | `IB-MS-004/005/006` + source Consumer | qualification / assembly / source-change / query flows | covered |
| host / action / association | internal Commands + action outcome Consumer | generation / prepare / dispatch / outcome flows | covered |
| registration / endpoint / Host Session | `IB-MS-007/008/009` | registration / session / access query flows | covered_with_placeholders |
| health / failure / recovery | `IB-MS-010/011/012` + health Consumer / Job | signal / evaluate / decide / query flows | covered |
| closure / cleanup / reconciliation | `IB-MS-013/014/017` cleanup branch + Jobs | close / cleanup / feedback / reconcile flows | covered_with_placeholders |
| outbox / handoff / projection | `IB-MS-015/016/017` handoff branch + Jobs | material / publish / feedback / rebuild / gap / query flows | covered_with_placeholders |

反查结论：全部正式状态轴均有 Step 7 writer / trigger 和 Step 8 处理流；无孤立状态。带 placeholder 的触发只证明本仓 local skeleton 已定义，不证明 sibling / external contract ready。

## 14. 正式第 9 章回填草稿

正式 §9 应先声明“无单一全局 `HostStatus`”，给出 29 对象状态适用性索引，再按 CMP-MS-01~07 保留状态定义表、状态流转图、允许 / 禁止迁移和传播关系。正文不复制逐部分停审表，但必须保留以下结论：

1. `ready`、`active`、`healthy`、`locally-closed`、`submitted`、delivered、observed、accepted 不得互相替代。
2. generation immutable、single-active、stable effect / publication / handoff key、unknown hold 和 late fence 是所有正向迁移的共同 guard。
3. material、safe view、history 为 immutable；outbox、handoff、projection 分别持有传播、外部反馈和读取进度。
4. Query 不写入，Consumer 不隐式创建 formal decision，Job 不隐式创建 lifecycle action。
5. `MSVC-UP-001~008` 和并行 sibling exact contract 未闭口时，相关正向状态只能 pending / blocked / waiting / unknown，不得伪造 ready。

## 15. 待确认事项与详细设计上限

| 事项 | 当前概要结论 | 后续上限 |
|---|---|---|
| transition guard / expected revision / UoW | 状态 owner、允许方向与 local-first 已冻结 | 03 定义函数、事务和并发冲突；不得合并状态轴。 |
| retry / unknown-effect disposition | stable key、hold、显式 reconciliation 已冻结 | 03 / 04 定义策略与配置影响；未知效果不得盲重放。 |
| Runtime / Member / Images / Sandbox 状态映射 | 只保存 typed ref / safe summary / placeholder | 双侧正式合同前不得增加 exact mapping 或推断对端状态。 |
| Bus / Observability / consumer outcome | submitted、delivery、observation、acceptance 已分层 | route / envelope / receipt / feedback schema 继续 `MSVC-UP-007` pending。 |
| projection freshness / cadence | fresh / stale / rebuilding / degraded / unavailable 已冻结 | 03 / 04 定义 cursor、触发和参数；Query 保持 no-write。 |

## 16. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 七部分逐项停审 | pass | CMP-MS-01~07 均完成状态归属、定义、迁移、传播和独立停审。 |
| 状态定义完整性 | pass | 29 个对象逐项判断；有状态对象全部展开，无状态对象说明 immutable / policy / guard 原因。 |
| 状态图与传播图 | pass | 七部分状态图及全局状态传播图均为 `text`，图后有关键说明。 |
| 允许 / 禁止迁移 | pass | 核心正常、异常、unknown、replacement、closure 和 feedback 迁移均有边界。 |
| 触发与处理流反查 | pass | 所有状态 writer / trigger 可回指 Step 7 / 8；无 Query 写入或 Job 越权。 |
| 近义状态审计 | pass | active / ready / healthy / succeeded / closed / resolved / accepted 未发生跨 owner 压平。 |
| 状态传播 | pass | source、history、material、outbox、handoff、projection / view 分层，失败不逆写 source。 |
| 外部 blocker | pass_with_blockers | `MSVC-UP-001~008` 与并行 sibling exact contract 继续 pending / blocked / waiting。 |
| 实现泄漏 | pass | 未写状态机代码、数据库列、错误码全集、补偿脚本、协议 schema 或 UI 规则。 |
| 正式文档写入 | pass | 未修改旧正式 02；只有 Step 14 可重建正式文档。 |

```text
step_09_status = completed
step_09_gate = pass
component_stop_reviews = 7_of_7
state_cross_audit = pass_with_upstream_blockers
formal_02_write_allowed = false
next_allowed_step = Step 10 exception_boundaries
```
