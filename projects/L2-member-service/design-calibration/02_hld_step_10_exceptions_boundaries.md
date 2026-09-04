# 02 概要校准 Step 10：异常与边界场景轮廓

> 状态：completed / pass
> 日期：2026-08-24
> 前序门禁：Step 9 completed / pass
> 本步目的：只收稳会改变对象、接口、处理流、状态机或跨仓协作的关键异常与边界；不写错误码全集、重试参数、补偿脚本或实现恢复步骤

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP、书写规范 §4.10、ASCII 异常影响图规则已复核 |
| 已读取项目输入 | yes；正式 00 / 01、Step 3 约束、Step 5 组成部分、Step 8 处理流、Step 9 状态机和 blocker 注册表已复核 |
| 当前 Step | Step 10：异常与边界场景轮廓 |
| 本 Step 输出 | `design-calibration/02_hld_step_10_exceptions_boundaries.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 并行兄弟效力 | `L2-member`、`L2-member-images` 当前讨论不作为正式 truth；只能引用已知职责方向，exact contract 保持 placeholder / pending |
| 下一 Step | blocked；本步 completed / pass 前不得创建 Step 11 |

- [x] 回答哪些异常必须在概要层先点名，以及哪些异常留给详细设计。
- [x] 按七个主要组成部分建立异常与边界场景表。
- [x] 为改变主流程、状态传播或跨部分协作的异常补影响图。
- [x] 反查 Step 7 接口、Step 8 处理流和 Step 9 状态落点。
- [x] 完成 fail-closed、pending、unknown、历史和非伪造审计。
- [x] 形成正式第 10 章回填草稿与 Gate 自检。

## 2. 本步范围与判断方法

### 2.1 必须在概要层点名的异常

本步只纳入下列至少满足一项的场景：

1. 会阻止或改变 `HostIntent`、`HostReadinessDecision`、`MemberExecutionHost`、`HostSession`、`HostHealthAssessment` 或 `HostClosure` 主线状态。
2. 会改变 Command、Consumer、Job、Query 或 external port 的协作顺序、写入者或事务边界。
3. 会触发 generation、single-active、stable effect key、handoff key、projection freshness 或历史连续性保护。
4. 会暴露跨仓 owner、source truth、forbidden body 或 pending contract 的边界。

普通参数校验、完整错误码、重试次数、超时数值、补偿脚本、数据库异常分类和运维操作步骤不在本步展开。

### 2.2 统一异常处置语义

| 语义 | 本仓在概要层的含义 |
|---|---|
| `rejected` | 输入或信号不具备进入本地主线的资格；保留原因和来源，不能隐式升级。 |
| `conflict` | 等价锚、scope、generation、revision 或 current pointer 互相矛盾；不能原地覆盖既有 truth。 |
| `waiting` | 允许等待的新正式事实尚未到达；不表示成功，也不自动重试外部动作。 |
| `blocked` | 必需 owner、合同或资格缺失；正向路径 fail closed。 |
| `stale` / `late` | 事实仍可入历史或不确定性层，但不能覆盖 current。 |
| `unknown` | 外部 effect、反馈或当前状态无法判定；保持稳定锚并进入 hold / reconciliation。 |
| `gap` | 路由、合同、发布、反馈或投影缺口已被本地确认；不回滚 source truth。 |
| `residual` | 本地收束后仍有外部关联、资源或摘要差异；转入 finding / case，不自动修复。 |

## 3. 异常与边界场景总表

| ID | 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|---|
| `EX-MS-001` | 非项目型主语、`ProjectMemberRef` 缺失或与 `GlobalMemberRef` 不一致 | CMP-MS-01 `HostIntent` acceptance / command entry | 入口直接 `rejected` 或 `conflict`；GlobalMemberRef 不能替代项目执行主语，不创建 host 或 decision。对应 `MSVC-UP-009` 当前范围已收稳。 |
| `EX-MS-002` | 相同 intent / decision key 重放，或相同锚承载不同意图 | CMP-MS-01 `HostIntent`、`HostOrchestrationDecision` 与 revision guard | 等价重放返回既有本地结论；同锚异意图形成 `conflict` 新事实；不生成第二 intent、decision 或 action。 |
| `EX-MS-003` | 当前 host、closure 或 control policy 在决定提交前发生 revision 竞争 | CMP-MS-01 decision service 与 local persistence boundary | 以 expected revision / current pointer guard 拒绝过期提交；保留 conflict / superseded history，要求新的显式决定。细节留 03。 |
| `EX-MS-004` | required subject、identity、supply、credential、Sandbox binding 或 carrier qualification 缺失 / 过期 / 冲突 / 未知 | CMP-MS-02 qualification、assembly、readiness | `HostQualificationContext` 为 missing / stale / conflict / unknown，`HostAssembly` 为 blocked / unknown，`HostReadinessDecision` 不得为 ready；不使用旧缓存或 fallback。 |
| `EX-MS-005` | `L2-member-images` pinned supply ref、manifest 或 provenance 无法验证 | CMP-MS-02 qualification / assembly 接缝 | 仅消费 typed pinned ref / safe summary；无法验证即 `blocked`，不解析 Role -> image，不把 sibling 草稿当供给确认。`MSVC-UP-003` 保持 pending。 |
| `EX-MS-006` | launch credential 缺失、撤销、过期、scope 不匹配或无法证明 instance binding | CMP-MS-02 qualification 与 CMP-MS-04 registration guard | 不保存或输出 secret；qualification / registration 保持 blocked / rejected / unknown，不能借 endpoint、heartbeat 或旧 credential 放行。`MSVC-UP-006` 保持 pending。 |
| `EX-MS-007` | `SandboxBinding` bind / release 合同缺失、返回冲突或结果未知 | CMP-MS-02 assembly 与 CMP-MS-06 closure | binding 只作为 host-side association / safe outcome；必需 binding 未闭合时 readiness blocked，release unknown 进入 cleanup unknown / residual；不创建 Sandbox truth。`MSVC-UP-004` 保持 pending。 |
| `EX-MS-008` | carrier / container / orchestration adapter 不可用、能力不匹配或产品状态无法映射 | CMP-MS-02 / CMP-MS-03 port / adapter seam | adapter 只返回中立 qualification / attempt outcome；能力缺失为 blocked / failed，未知效果为 unknown；产品 backend 状态不能直接成为 Host Truth。 |
| `EX-MS-009` | host generation 建立或 replacement 与另一个 active generation 并发 | CMP-MS-03 `MemberExecutionHost` 与 `HostGenerationFence` | single-active guard 只允许一个 current generation；竞争者转 held / conflict，replacement 形成新 generation，旧事实进入 superseded / history。 |
| `EX-MS-010` | external action 已越过 port 但 response 丢失、超时或 effect 无法判定 | CMP-MS-03 `HostActionAttempt` / association 与 reconciliation | attempt 保持 dispatched / unknown，effect key 不变；不得换 key 盲重放，不把 process existence 或后续 signal 当作本次成功。 |
| `EX-MS-011` | old generation action outcome、association feedback 或 process signal 迟到 | CMP-MS-03 outcome Consumer 与 generation fence | 标记 late / stale / rejected，最多进入历史或 matching old record；不得恢复 superseded host、覆盖 current pointer 或产生第二 active association。 |
| `EX-MS-012` | registration 重放、来源冒用、credential mismatch 或 generation 不匹配 | CMP-MS-04 registration acceptance | `HostRegistration` 为 rejected / invalidated；不得由 endpoint 或 heartbeat 把 received 直接改为 accepted。 |
| `EX-MS-013` | 两个 endpoint / session 同时声称 current，或旧 session 与新 replacement 交错 | CMP-MS-04 `RegistrationSessionPolicy` | single-active guard 选择一个带正式依据的 current；其他记录进入 replaced / stale / invalid，或以 conflict reason 保持非活动；closed / replaced session 不原地回 active。 |
| `EX-MS-014` | heartbeat / health signal 重复、迟到、stale、冲突、来源或时点缺失 | CMP-MS-05 signal Consumer | 只形成 duplicate / late / stale / conflict / rejected snapshot；不直接写 healthy、recovery committed 或 Runtime run state。 |
| `EX-MS-015` | health assessment basis 不完整、四轴结果互相冲突或 Observability 不可用 | CMP-MS-05 assessment / failure classification | `uncertainty_axis` 保持 incomplete / conflict / unknown，其他 health axes 可为 degraded / unknown；assessment record 只能 current 或 invalidated，处置可形成显式 hold；观测不可用不破坏本地 Host Truth。 |
| `EX-MS-016` | recovery / restart / terminate 决定与新 signal、closure 或 replacement 竞争 | CMP-MS-05 recovery decision 与 CMP-MS-03 / 06 接缝 | 只有显式 committed recovery decision 可下游；竞争决定 superseded / voided，动作结果经 attempt 回流，不回写旧 decision。 |
| `EX-MS-017` | closure 期间仍有 in-flight action、active session 或未确认 association | CMP-MS-06 closure / invalidation | 先建立 closure scope 并显式 invalidating；竞争 action 停止，cleanup-pending / blocked / unknown 保留，不能宣称 external cleanup complete。 |
| `EX-MS-018` | cleanup / release effect unknown、明确失败或 route / owner 缺口 | CMP-MS-06 `CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` | attempt 进入 unknown / failed / gap；本地 invalidation 可已完成，但 `HostClosure` 保持 residual 而不是 locally-closed，必须形成 finding / case，不自动重放或删除历史。 |
| `EX-MS-019` | residual 摘要冲突、owner 不明或 reconciliation 无法形成 resolution basis | CMP-MS-06 finding / case | finding 为 disputed / unknown，case 为 holding / escalated；Job 不隐式创建 restart、terminate 或 resolved。 |
| `EX-MS-020` | committed material 已形成但 outbox route、schema、publisher 或目标不可用 | CMP-MS-07 material / outbox / handoff | source truth、history 和 material 仍提交；outbox 为 gap / pending，handoff 不宣称 delivered；`MSVC-UP-007` 不因本仓需要而补 schema。 |
| `EX-MS-021` | publication effect unknown 或 publisher 返回重复 / 不可验证 receipt | CMP-MS-07 outbox / handoff | 保持 publication key 与 unknown / attempted；不换 key 盲重发，不把 submitted、delivery、observed、accepted 合并。 |
| `EX-MS-022` | handoff feedback 迟到、重复、目标或 generation 不匹配 | CMP-MS-07 handoff Consumer | 只更新 matching `HostHandoffRecord` 的 feedback layer，标记 gap / unknown / late；不回滚 source、outbox 或 projection。 |
| `EX-MS-023` | projection cursor 落后、change gap、rebuild 失败或 projection store 不可用 | CMP-MS-07 projection Job / Query | `HostProjectionState` 为 stale / rebuilding / degraded / unavailable；Query 返回 freshness marker 或明确不可用，不 refresh、不修复、不改 source。 |
| `EX-MS-024` | Query 要求的 freshness / visibility 超出可安全提供范围 | CMP-MS-07 Query service | 返回 safe slice + stale / unavailable / forbidden marker 或拒绝；Query 不创建命令、不补默认值、不返回 raw endpoint / secret / external body。 |
| `EX-MS-025` | Consumer / Job 收到 forbidden body、secret 或未授权外部正文 | 各 owner entry guard、material / history boundary | 立即拒绝或裁剪为 safe summary；正文不进入 truth、projection、event、log 或 history；不得因“便于排障”放宽边界。 |
| `EX-MS-026` | Runtime、Member、Images、Sandbox 或 Bus 的并行合同仍在讨论，单侧出现“ready”草稿 | 对应 host-side port / qualification / handoff boundary | 当前只记录 pending / blocked / waiting / placeholder；任何 sibling WIP、fake、局部 receipt 或 observed signal 都不能关闭正向 blocker。 |
| `EX-MS-027` | 本仓本地 persistence / history / outbox 提交冲突或部分提交 | 各 owner local transaction boundary | 未形成 committed local fact 时不越过 external port；已提交 source 不因 outbox / projection 失败回滚；具体 UoW、隔离和恢复策略留 03。 |
| `EX-MS-028` | 时钟、freshness 或顺序依据不足，无法判断信号和反馈是否当前 | CMP-MS-02 qualification、CMP-MS-05 health、CMP-MS-07 handoff / projection | 以 stale / unknown / waiting 处理，保留 captured / observed time 缺口；不借本地接收时间伪造当前性。 |

## 4. 按主要组成部分的异常落点与边界

### 4.1 CMP-MS-01：Host intent and orchestration decision

| 异常类别 | 影响对象 / 接口 | 当前处理边界 |
|---|---|---|
| 双锚或 scope 非法 | `HostIntent`、`AcceptHostIntentCommand` | 在入口拒绝；不生成后续 decision。 |
| 重放与冲突 | `HostIntent`、`HostOrchestrationDecision` | 稳定 key 命中既有结论；异意图追加 conflict，不原地修正。 |
| current revision 竞争 | decision service、history | 本地 guard 失败即 void / conflict；需要新的显式 command。 |

本部分的异常不会由 Query、Projection 或 Job 自动修复；其结果只能通过新的正式输入改变。

### 4.2 CMP-MS-02：Host qualification and assembly

| 异常类别 | 影响对象 / 接口 | 当前处理边界 |
|---|---|---|
| required source 缺失 / 过期 / 冲突 | `HostQualificationContext`、`ResolveHostQualificationCommand` | 保留 source gap 和 freshness；readiness 非正向。 |
| pinned supply / credential / binding 未闭合 | `HostAssembly`、`HostReadinessDecision` | 分项 blocked / unknown；不使用 fallback，不把 sibling 讨论当正式供给。 |
| carrier 能力不可判定 | assembly port、action attempt 前置 | assembly blocked / unknown；不得先创建“已就绪”宿主再补资格。 |

### 4.3 CMP-MS-03：Host instance and carrier progression

| 异常类别 | 影响对象 / 接口 | 当前处理边界 |
|---|---|---|
| generation 竞争 | `MemberExecutionHost`、`HostGenerationFence` | 单活动 guard；旧 generation 只进 history。 |
| external effect unknown | `HostActionAttempt`、`HostExternalAssociation` | 保持 stable effect key 和 unknown；进入 hold / reconciliation。 |
| late outcome | outcome Consumer | 只更新 matching old record 的历史层，不覆盖 current。 |

### 4.4 CMP-MS-04：Registration and Host Session

| 异常类别 | 影响对象 / 接口 | 当前处理边界 |
|---|---|---|
| registration 不可信 | `HostRegistration`、acceptance placeholder | rejected / invalidated；endpoint 不得反向授权 registration。 |
| current session 冲突 | `HostEndpoint`、`HostSession`、policy | 保持 single-active；replacement 产生新事实。 |
| Runtime / Member 合同未闭合 | session port / query | session 保持 pending / blocked / unknown；不声明 Runtime run active。 |

### 4.5 CMP-MS-05：Host health and recovery

| 异常类别 | 影响对象 / 接口 | 当前处理边界 |
|---|---|---|
| signal 不可验证 | `HealthSignalSnapshot` | rejected / late / stale / conflict；不直接改变 assessment。 |
| assessment 不确定 | `HostHealthAssessment`、`HostFailureClassification` | uncertainty 轴保留；处置 hold / unknown。 |
| recovery 竞争 | `HostRecoveryDecision`、generation / closure seam | 仅显式 committed decision 下游；旧决定 superseded / voided。 |

### 4.6 CMP-MS-06：Host closure and reconciliation

| 异常类别 | 影响对象 / 接口 | 当前处理边界 |
|---|---|---|
| closure 与 in-flight action 竞争 | `HostClosure`、`CleanupAttempt` | 先 invalidating，再 cleanup-pending；不接受竞争 action。 |
| cleanup unknown / gap | attempt、finding、case | 保留 unknown / gap / residual；不把本地 closed 写成外部完成。 |
| case 无法决策 | `ResidualFinding`、`ReconciliationCase` | disputed / holding / escalated；Job 不隐式改变 lifecycle。 |

### 4.7 CMP-MS-07：Host fact handoff and safe consumption

| 异常类别 | 影响对象 / 接口 | 当前处理边界 |
|---|---|---|
| outbox / handoff route 缺口 | `HostOutboxRecord`、`HostHandoffRecord` | local material 保留，传播状态 gap / pending；不伪造 delivered。 |
| feedback 不匹配 | handoff Consumer | 只写 matching feedback layer；late / unknown 可审计。 |
| projection 不可用或 Query 超出范围 | `HostProjectionState`、`SafeHostView`、Query | 返回 freshness / unavailable / forbidden marker；Query no-write。 |

## 5. 异常影响图

只有下列异常会改变主流程或跨部分协作，因此补图。图不表示错误码、重试参数、补偿脚本、transport schema 或运维步骤。

### 5.1 required qualification fail-closed

```text
accepted HostIntent / committed decision
  │ resolve required subject, identity, supply, credential, binding, carrier
  ▼
qualification result
  ├─► complete + matching generation
  │      ▼
  │   assembly / readiness evaluation
  │      ├─► ready (assembly semantic only)
  │      └─► waiting / blocked / failed / unknown
  │
  └─► missing / stale / conflict / unknown / pending
         ▼
      blocked or waiting HostReadinessDecision
         ├─► no host action
         └─► new formal source / reconciliation input
```

关键说明：
- 任一 required qualification 缺口都阻止 ready，不以旧缓存、默认值或 sibling WIP 补齐。
- readiness 变为非正向只影响本仓后续推进，不替上游 source owner 生成事实。
- `MSVC-UP-003/004/006` 未闭口时，受影响正向分支固定为 blocked / waiting。

### 5.2 unknown external effect and reconciliation

```text
local decision / attempt committed
  │ external port
  ▼
effect outcome
  ├─► matching success / failure summary
  │      ▼
  │   local attempt update
  │
  └─► timeout / lost response / ambiguous effect
         ▼
      unknown + stable effect key
         ├─► hold / no blind replay
         ├─► matching later feedback
         └─► reconciliation / residual case
```

关键说明：
- unknown 是本地正式结果，不是临时异常字符串，也不能被 timeout 直接解释为失败或成功。
- 后续 action 必须有相同 effect identity 和显式 disposition；不能换 key 逃避未知副作用。
- reconciliation 只能形成新的正式决定或 finding，不自动回滚既有 local truth。

### 5.3 generation replacement and late feedback

```text
current generation G
  │ replacement / recovery decision
  ▼
new generation G+1 becomes current
  ├─► G -> superseded / quiescing / terminated history
  └─► G+1 -> new registration / action / session path

late feedback tagged G
  │ generation / effect / handoff fence
  ├─► matching old record history
  ├─► late / stale / rejected marker
  └─► never overwrite G+1 current pointer
```

关键说明：
- generation replacement 是新事实，不是旧 host 的原地 reset。
- 迟到 feedback 可保留审计价值，但不能将旧 host、session 或 association 恢复为 current。
- 同一规则同时保护 registration、health、cleanup、outbox 和 handoff 反馈。

### 5.4 closure and residual handoff

```text
active host / session / association
  │ explicit CloseHostCommand
  ▼
invalidating -> cleanup-pending
  ├─► safe local closure
  ├─► cleanup failed / unknown / gap
  │      ▼
  │   residual finding -> reconciliation case
  └─► blocked by missing owner / contract

case disposition
  ├─► new explicit action marker
  ├─► holding / escalated
  └─► local resolution basis
```

关键说明：
- local closure、cleanup outcome、residual resolution 和 external cleanup completion 分属不同 owner / 状态轴。
- cleanup / reconciliation Job 只能推进已存在的 closure、attempt、finding 或 case，不隐式创造 lifecycle decision。
- `MSVC-UP-004` 未闭口时，release / cleanup positive path 保持 blocked / unknown。

## 6. 异常与 Step 7 / Step 8 / Step 9 反查

| 异常族 | Step 7 接口 / writer | Step 8 处理流 | Step 9 状态落点 | 反查结论 |
|---|---|---|---|---|
| scope / replay / revision | `IB-MS-001/002` | intent acceptance / decision flows | accepted / conflict / proposed / voided | covered |
| qualification / supply / credential / binding | `IB-MS-004/005/006` + source Consumer | qualification / assembly / readiness flows | missing / stale / blocked / unknown | covered_with_pending |
| generation / effect unknown / late | internal host Commands + outcome Consumer | generation / dispatch / outcome flows | held / superseded / unknown / late | covered |
| registration / session conflict | `IB-MS-007/008/009` | registration / session flows | rejected / replaced / stale / blocked | covered_with_placeholders |
| signal / assessment uncertainty | `IB-MS-010/011/012` | signal / health / recovery flows | stale / conflict / invalidated / candidate / unknown | covered |
| closure / cleanup / residual | `IB-MS-013/014/017` cleanup branch | close / cleanup / reconcile flows | cleanup-pending / residual / unknown / holding | covered_with_placeholders |
| outbox / feedback / projection | `IB-MS-015/016/017` handoff branch | publish / feedback / rebuild / query flows | gap / unknown / degraded / unavailable | covered_with_placeholders |

无异常场景需要新增业务对象、主要组成部分或状态轴；异常通过既有状态、gap、finding、case、history 和 placeholder seam 承接。

## 7. 不在本步展开的内容

| 内容 | 后续位置 | 当前原因 |
|---|---|---|
| 完整错误码、错误 envelope 和 transport status | 03 | 必须等待双侧 contract 和 Core schema；本步只收稳语义落点。 |
| timeout、heartbeat window、retry 次数和 backoff | 03 / 04 | 数值 authority 尚未闭口；不能用历史数字填充。 |
| unknown-effect reconciliation 算法、补偿脚本和人工操作 | 03 / 05 | 需要详细 UoW、adapter 和测试 / 验收策略。 |
| 数据库隔离、锁、cursor 存储和 outbox 扫描实现 | 03 | 概要层只固定 local-first、stable key 和 writer。 |
| Runtime / Member / Images / Sandbox / Bus exact payload、route、receipt | 双侧正式合同闭口后回填 03 | 并行兄弟讨论不提供正式 truth；当前保持 placeholder / blocked。 |
| 资源容量、性能阈值、健康数字 | 04~06 | `Q-MS-011` authority pending。 |

## 8. 当前 blocker 与非伪造审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 并行 sibling WIP 是否被当 truth | pass | `L2-member` / `L2-member-images` 只保留职责方向；exact contract、字段和 ready 结论未消费。 |
| `MSVC-UP-001~008` 是否仍显式 | pass | Runtime、Member、Images、Sandbox、credential、policy、Core / Bus、SDK seam 继续 pending / blocked / waiting。 |
| forbidden body / secret 是否越界 | pass | 异常处理只允许 ref、safe summary、marker、history 和 gap；不写正文。 |
| fail-closed 是否覆盖 required qualification | pass | missing / stale / conflict / unknown / pending 全部非正向。 |
| unknown / late / duplicate 是否被压平 | pass | 各自保留 owner-specific 状态和 stable key / generation fence。 |
| Query / Job / Consumer 是否越权 | pass | Query no-write；Job 不隐式决定；Consumer 只写 matching local snapshot / marker。 |
| 是否泄漏详细设计 | pass | 未写错误码全集、重试参数、补偿脚本、DDL、协议 schema 或实现调用链。 |

## 9. 正式第 10 章回填草稿

正式 §10 应使用异常与边界场景表，按 CMP-MS-01~07 归纳 `EX-MS-001~028` 的主线级场景；正文可保留四张异常影响图，但必须说明：

1. required qualification 任一缺口都 fail closed；不可用的并行 sibling 合同不被默认补齐。
2. unknown、late、duplicate、gap、residual 和 projection unavailable 是可审计的正式非正向语义，不是成功或失败的隐式别名。
3. generation / single-active / stable key 保护 replacement、反馈、清理和发布，旧事实不得覆盖 current。
4. local truth、external outcome、handoff feedback 和 projection freshness 分层；异常不会通过 Query、Job 或 Consumer 绕过正式 owner。
5. 错误码、重试、补偿、产品 adapter 和跨仓 exact contract 留给 03~07；并行讨论不能关闭 blocker。

## 10. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 关键异常覆盖 | pass | 28 个场景覆盖 scope、资格、代际、注册、健康、收束、交接、投影和依赖边界。 |
| 异常落点 | pass | 每个场景均有主要组成部分、对象或入口 owner；没有“系统处理”空泛落点。 |
| 主流程影响 | pass | 资格 fail-closed、unknown effect、generation replacement、closure residual 均补异常影响图。 |
| 状态承接 | pass | 每个异常可回指 Step 9 状态、gap、finding、case 或 immutable history。 |
| Step 7 / 8 反查 | pass | 所有异常族均有 writer / consumer / job / query 处理流；无孤立异常。 |
| pending / blocker 保真 | pass_with_blockers | `MSVC-UP-001~008` 与并行 sibling exact contract 继续 pending / blocked / waiting。 |
| 深度边界 | pass | 未提前写错误码、重试参数、补偿脚本、DDL、协议或测试证据。 |
| 正式文档写入 | pass | 未修改旧正式 02；Step 11 尚未创建。 |

```text
step_10_status = completed
step_10_gate = pass
exception_scenarios = 28
exception_cross_audit = pass_with_upstream_blockers
formal_02_write_allowed = false
next_allowed_step = Step 11 configuration_impact
```
