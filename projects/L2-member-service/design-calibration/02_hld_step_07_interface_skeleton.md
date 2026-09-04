# 02 概要校准 Step 7：API / 接口骨架

> 状态：completed / pass
> 日期：2026-08-24
> 前序门禁：Step 6 completed / pass
> 本步目的：沿 CMP-MS-01~07 逐部分冻结 Command、Query、Inbound Consumer、Outbound Event、Operations Job 与 Port 骨架，并保持所有未闭口跨仓合同为 placeholder / blocked / waiting

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP、书写规范及通用中间产物 / 真相源 / 依赖裁剪纪律已复核 |
| 已读取项目输入 | yes；正式 00 / 01、02 flow / ledger、Step 4~6、正式 IB-MS-001~017 和相关上游边界已复核 |
| 当前 Step | Step 7：API / 接口骨架 |
| 本 Step 输出 | `design-calibration/02_hld_step_07_interface_skeleton.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 下一 Step | blocked；本步 completed / pass 前不得创建 Step 8 |

- [x] 回答接口分类、元数据、读写和外部合同上限问题。
- [x] 建立 IB-MS-001~017 到接口类别 / owner 的覆盖索引。
- [x] 逐项完成 CMP-MS-01~07 接口骨架与停审。
- [x] 汇总 Command / Query / Consumer / Event / Job / Port 分类表。
- [x] 完成对象 / capability / flow 反查与跨接口审计。
- [x] 完成 Gate 自检并更新 flow / project ledger。

## 2. 接口分类与统一判断

```text
Command API / use-case entry
  由正式 actor 或已授权内部语境显式调用，改写本仓 truth；
  必须带 ActorContext、CommandMetadata 和稳定幂等身份。

Query API
  读取 source truth、history 或 SafeHostView；必须带 ActorContext；
  不 refresh、不 repair、不 publish，也不隐式形成决定。

Inbound Event Consumer
  消费外部 owner 的可验证变化 / signal / feedback safe summary；
  必须保留 envelope placeholder、event / feedback identity、幂等身份、source 与 correlation；
  exact event family / payload 未闭口时只能 blocked / waiting。

Outbound Event Candidate
  只传播本仓已提交 truth 派生的 HostFactMaterial；
  event family / envelope / route 为 contract placeholder，local submit 不等于 delivered。

Operations Job
  只扫描和推进已持久化的 due attempt、outbox、projection 或 reconciliation work；
  不创建 formal intent / control decision，不把 schedule 触发解释为业务授权。

Application / Persistence Port
  由本仓 application 声明，外部 adapter 或本地 infrastructure 实现；
  runtime / event / ref / adapter seam 不转换为 sibling source dependency。
```

### 2.1 元数据与读写要求

| 类别 | 必需输入骨架 | 写入 / 读取规则 | 当前合同上限 |
|---|---|---|---|
| Command | `ActorContext`；`CommandMetadata`；领域输入 refs；`IdempotencyKey` / 稳定业务 key；`CorrelationId` | 只写 owner CMP 的 truth，并按需同事务追加 history / material marker / outbox；不得同步宣称外部完成 | 不定义 HTTP / RPC、完整 request / response schema、错误码全集 |
| Query | `ActorContext`；query selector；可选 freshness / visibility request | 只读 source truth / history / projection；返回 safe view + freshness / unknown / unavailable | 不写鉴权实现、分页 wire schema 或缓存策略 |
| Consumer | `ExternalEnvelopePlaceholder`；`ExternalMessageId`；`ExternalIdempotencyKey`；`ExternalSourceRef`；safe payload ref；`CorrelationId` | 可写 snapshot / matching local record / gap；不得从 event 隐式生成 command 或外部 truth | `MSVC-UP-001~007` 影响 exact family / envelope / payload / route |
| Outbound Event | `HostFactMaterialRef`；source change ref；event identity placeholder；correlation | 从 committed material / outbox 发布；不参与源 truth 原子成功语义 | event name 是本仓候选语义名，不代表 Core schema / Bus route ready |
| Job | `OperationsContext`；due-work selector；可选 cursor / work window | 只推进已有状态或重建派生；重复执行必须由 stable key / revision guard | cadence、batch、lease、backoff、timeout 留 04 / 03 |
| External Port | typed request refs / safe summaries / correlation / generation | 调用前先有 local decision / attempt；返回值只作 safe outcome | exact protocol / owner schema / product SDK 留 pending |
| Persistence Port | aggregate refs / expected revision / local change plan | 本地强一致、冲突显式；完整 trait / transaction mapping 留 03 | 不声明数据库、表、索引或 ORM |

## 3. 范围与 IB 覆盖索引

| 需求能力面 | Step 7 正式接口归属 | 类别 | 当前状态 |
|---|---|---|---|
| `IB-MS-001` 宿主意图受理 | CMP-MS-01 `AcceptHostIntentCommand` | Command | local skeleton defined |
| `IB-MS-002` 编排决定控制 | CMP-MS-01 `DecideHostOrchestrationCommand` | Command | local skeleton defined |
| `IB-MS-003` 当前宿主与决定查询 | CMP-MS-01 `QueryCurrentHostDecision` | Query | local skeleton defined |
| `IB-MS-004` 正式装配条件形成 | CMP-MS-02 `ResolveHostQualificationCommand` | Command | local skeleton；positive sources bounded |
| `IB-MS-005` 装配协调与就绪 | CMP-MS-02 `CoordinateHostAssemblyCommand` + CMP-MS-03 internal progression / job / ports | Command + internal use case + Job / Ports | local skeleton；external positive blocked where contract pending |
| `IB-MS-006` 装配与就绪查询 | CMP-MS-02 `QueryHostAssemblyReadiness` | Query | local skeleton defined |
| `IB-MS-007` 注册受理 / 替换 / 拒绝 | CMP-MS-04 `AcceptHostRegistrationCommandPlaceholder` | Command | host-side skeleton；exact Member / credential waiting |
| `IB-MS-008` endpoint / Host Session 维护 | CMP-MS-04 `MaintainHostSessionCommandPlaceholder` | Command | local shell；Runtime positive blocked |
| `IB-MS-009` endpoint / session 查询 | CMP-MS-04 `QueryHostAccessSession` | Query | local skeleton defined；external availability unknown allowed |
| `IB-MS-010` 健康信号 / 宿主反馈 | CMP-MS-05 `HostHealthSignalConsumerPlaceholder`；CMP-MS-03 action outcome consumer | Inbound Consumer | host-side skeleton；exact events pending |
| `IB-MS-011` 健康 / 失败查询 | CMP-MS-05 `QueryHostHealthFailure` | Query | local skeleton defined |
| `IB-MS-012` 恢复 / 重启 / 停止 / 终止控制 | CMP-MS-05 `DecideHostRecoveryCommand` | Command | local decision skeleton defined；external execution separate |
| `IB-MS-013` 下线 / 清理控制 | CMP-MS-06 `CloseHostCommand` | Command | local skeleton defined；external cleanup separate |
| `IB-MS-014` 残留 / 孤儿对账 | CMP-MS-06 `ReconcileHostResidualsJob` | Operations Job | local skeleton defined；external summaries bounded |
| `IB-MS-015` 宿主事实安全查询 | CMP-MS-07 `QuerySafeHostFacts` / `QueryHostHistory` | Query | local skeleton defined |
| `IB-MS-016` body-free 事实交接 | CMP-MS-07 `HostFactMaterialEventCandidate` + publish job / port | Outbound Event + Job / Port | event contract placeholder；local outbox semantics defined |
| `IB-MS-017` cleanup / delivery feedback | CMP-MS-06 cleanup outcome consumer + CMP-MS-07 handoff feedback consumer | Inbound Consumer | local matching skeleton；exact feedback pending |
| `IB-MS-E01~E04` 外围增强 | 无独立 API / Job | extension boundary only | 按 Step 2 不进入本轮分母；未来需重开范围 |

## 4. CMP-MS-01：Host intent and orchestration decision

### 4.1 Command API 骨架

| API | 暴露级别 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `AcceptHostIntentCommand` | formal use-case entry；`IB-MS-001` | `ActorContext`；`CommandMetadata`；`HostIntentKey`；`ProjectMemberRef`；`GlobalMemberRef`；`HostIntentSourceRef`；`HostLifecycleAction`；`HostControlScopeRef`；`CorrelationId` | `HostIntentRef` + acceptance status + reason / gap / conflict refs | 通过 `HostControlPolicy` 校验项目型双锚、来源、scope 和 replay | 写 `HostIntent`、`HostHistoryEntry`；accepted 不触发外部动作 |
| `DecideHostOrchestrationCommand` | formal use-case entry；`IB-MS-002` | `ActorContext`；`CommandMetadata`；`IdempotencyKey`；accepted `HostIntentRef`；current-fact selector；`CorrelationId` | `HostOrchestrationDecisionRef` + decision action / local status + conflict ref | 读取 current host / closure facts，形成 action / no-action / conflict 决定 | 写 `HostOrchestrationDecision`、`HostHistoryEntry`、material / outbox marker；不写 action completed |

统一判断：两项 Command 都需要 `ActorContext`、`CommandMetadata` 和稳定幂等身份；内部补偿也必须携带原正式 actor / source 关联，不以 system job 伪造新授权。

### 4.2 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `QueryCurrentHostDecision` | `ActorContext`；`ProjectMemberRef`；可选 `HostIntentRef` / `HostDecisionRef`；visibility / freshness request | intent / decision refs + current host safe slice + gap / freshness | CMP-MS-01 source truth、CMP-MS-03 current pointer、`SafeHostView` | 只读；不受理意图、不补决定、不刷新投影；不输出 L1 / external body |

Query 必须带 `ActorContext`；具体 authorization 实现和 response / pagination schema 留 03。

### 4.3 Application / Persistence Port 骨架

| Port | Seam | 输入骨架 | 输出骨架 | 边界 |
|---|---|---|---|---|
| `IntentDecisionStorePort` | local persistence | intent / decision refs；expected revision；local change plan | committed refs / current facts / conflict | 只定义持久化能力族；表、索引、trait 和 transaction mapping 留 03 |
| `CurrentHostFactsReaderPort` | local read port | `ProjectMemberRef`；可选 expected generation | current host / closure / decision safe facts | 只读 owner facts，不从 projection 或 backend 推断 current truth |

### 4.4 对象 / capability 承接

| Capability | 接口落点 | 对象落点 | Step 8 flow |
|---|---|---|---|
| CAP-MS-01 | `AcceptHostIntentCommand` | `HostIntent`、`HostControlPolicy` | intent acceptance flow |
| CAP-MS-02 | `DecideHostOrchestrationCommand` | `HostOrchestrationDecision` | orchestration decision flow |
| CAP-MS-03 | 两项 Command 的 stable key / conflict output | `HostIntent`、`HostControlPolicy` | common replay / conflict branch |
| CAP-MS-04 | `QueryCurrentHostDecision` | `SafeHostView`、source refs | safe query flow |

### 4.5 CMP-MS-01 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象 / capability 承接 | pass | CAP-MS-01~04 均有 Command / Query 与 Step 6 对象落点。 |
| 类别 | pass | 受理 / 决定为 Command；读取为 Query；未把 service helper 当 API。 |
| 元数据 | pass | Command actor / metadata / idempotency 明确，Query actor 明确。 |
| 边界 | pass | 不直接调 carrier，不拥有 L1 / governance truth，不从 Query / job 生成决定。 |

停审结论：`CMP-MS-01` interface skeleton completed / pass；允许进入 CMP-MS-02。

## 5. CMP-MS-02：Host qualification and assembly

### 5.1 Command API 骨架

| API | 暴露级别 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `ResolveHostQualificationCommand` | formal use-case entry；`IB-MS-004` | `ActorContext`；`CommandMetadata`；`IdempotencyKey`；committed decision ref；`ProjectMemberRef`；`GlobalMemberRef`；target `HostGeneration`；environment requirement ref；`CorrelationId` | `HostQualificationContextRef` + resolution / freshness + source gap refs | 经 resolver ports 获取 typed ref / safe snapshot，执行 required-source / no-fallback guard | 写 `HostQualificationContext`、history / material marker；missing / stale / unknown 非 ready |
| `CoordinateHostAssemblyCommand` | formal use-case entry；`IB-MS-005` host-side facade | `ActorContext`；`CommandMetadata`；`IdempotencyKey`；`HostQualificationContextRef`；`HostRef`；`HostGeneration`；required environment ref；`CorrelationId` | `HostAssemblyRef` + optional `HostReadinessDecisionRef` + item status / gap refs | 冻结 required items；记录 matching local outcomes；调用 CMP-MS-03 internal progression，不在同步边界伪造外部完成 | 写 `HostAssembly`、按事实形成 `HostReadinessDecision`、history / material marker；external action 另有 attempt |

两项 Command 均需要 actor / metadata / idempotency。第二项可返回 waiting / blocked / unknown，不承诺在一次同步调用内形成 ready。

### 5.2 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `QueryHostAssemblyReadiness` | `ActorContext`；`HostRef`；`HostGeneration`；可选 freshness request | qualification source states + assembly item outcomes + readiness decision / gap refs + freshness | `HostQualificationContext`、`HostAssembly`、`HostReadinessDecision` 或其 safe slice | 只读；不调用 resolver、不发起 assembly、不把 stale projection 修成 ready |

### 5.3 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `QualificationSourceChangedConsumerPlaceholder` | Identity / Work 的正式变化；Images / credential / Sandbox / carrier 仅在各自合同成立后 | `ExternalEnvelopePlaceholder`；`ExternalMessageId`；`ExternalIdempotencyKey`；`ExternalSourceRef`；subject / source ref；safe change summary；`CorrelationId` | 记录新 source resolution / freshness 输入，或使 matching qualification context 显式 stale / conflict；按需形成 re-evaluation marker | exact event family / envelope / payload pending；事件不直接 launch、不直接形成 ready、不反写 owner truth |

Consumer 必须具备 message identity、幂等和来源；credential owner 未闭口时不存在可声称 ready 的正向 source event。

### 5.4 External / Persistence Port 骨架

| Port | Seam / owner | 输入骨架 | 输出骨架 | 边界 / 状态 |
|---|---|---|---|---|
| `GlobalMemberQualificationResolverPort` | runtime/ref；L1-identity | `GlobalMemberRef`；scope / freshness request；correlation | safe identity / lifecycle qualification summary or unresolved | 不保存 Identity body；formal boundary available at capability level |
| `ProjectMemberQualificationResolverPort` | runtime/ref；L1-work | `ProjectMemberRef`；scope / freshness request；correlation | safe project-member / assignment qualification summary or unresolved | 不保存 Work body；formal boundary available at capability level |
| `PinnedImageSupplyResolverPortPlaceholder` | runtime/ref；L2-member-images | subject / environment refs；target generation；correlation | pinned supply ref / safe qualification or blocked | `MSVC-UP-003` exact manifest / ref / confirmation pending；不可验证即 blocked |
| `LaunchCredentialQualificationPortPlaceholder` | runtime/ref；owner pending | host / generation / subject refs；correlation | instance-bound qualification ref or blocked / unknown | `MSVC-UP-006` owner / schema pending；不得签发、撤销或返回 secret |
| `SandboxHostBindingQualificationPortPlaceholder` | runtime/ref；L4-sandbox | host / generation / isolation requirement ref；correlation | binding capability / safe qualification or blocked | `MSVC-UP-004` exact binding contract pending；required binding 无 host fallback |
| `HostCarrierCapabilityPort` | adapter；carrier platform | environment requirement ref；target generation；correlation | safe capability summary / unavailable / unknown | 产品中立；不以 backend status 定义 Host Truth |
| `QualificationAssemblyStorePort` | local persistence | context / assembly / readiness refs；expected revisions；change plan | committed refs / current facts / conflict | 完整 repository / UoW mapping 留 03 |

### 5.5 对象 / capability 承接

| Capability | 接口落点 | 对象落点 | Step 8 flow |
|---|---|---|---|
| CAP-MS-05 | resolution Command、source consumer、resolver ports | `HostQualificationContext`、`RequiredQualificationPolicy` | qualification resolution flow |
| CAP-MS-06 | assembly Command + CMP-MS-03 internal progression | `HostAssembly` | assembly formation / progression flow |
| CAP-MS-07 | action outcome consumer（CMP-MS-03）回送 matching local outcome | `HostAssembly` | assembly outcome correlation flow |
| CAP-MS-08 | assembly Command 内独立 decision stage | `HostReadinessDecision`、policy | readiness decision flow |

### 5.6 CMP-MS-02 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象 / capability 承接 | pass | CAP-MS-05~08、四个 CMP 对象、resolver / store ports 均有落点。 |
| 类别 | pass | qualification / assembly 是显式 Command；source change 是 Consumer；查询 no-write。 |
| 元数据 | pass | Command 与 Consumer 的 actor / metadata / stable identity 明确。 |
| 边界 | pass_with_blockers | `MSVC-UP-003/004/006/007` 继续限制 exact contract 和 positive readiness；无 Role->image、本地 credential 或 host fallback。 |

停审结论：`CMP-MS-02` interface skeleton completed / pass；允许进入 CMP-MS-03。

## 6. CMP-MS-03：Host instance and carrier progression

### 6.1 Internal Command / use-case 骨架

| API | 暴露级别 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `EstablishHostGenerationCommand` | internal use-case；仅由 committed launch / restart / replace orchestration 调用 | inherited `ActorContext`；`CommandMetadata`；stable decision key；`HostOrchestrationDecisionRef`；subject refs；expected current generation；`CorrelationId` | `HostRef` + immutable `HostGeneration` or replay / conflict / hold | 通过 `HostGenerationFence` 建立新 logical host 和 predecessor link | 写 `MemberExecutionHost`、current pointer、history / material marker；不创建 backend resource |
| `PrepareHostActionCommand` | internal use-case；由 committed orchestration / recovery / closure decision 调用 | inherited `ActorContext`；`CommandMetadata`；`IdempotencyKey`；`HostActionDecisionRef`；`HostRef`；`HostGeneration`；action / target refs；`CorrelationId` | `HostActionAttemptRef` + prepared / replay / conflict / hold | 校验 decision / generation / unknown fence，在 external call 前形成 attempt | 写 `HostActionAttempt`、history；不在本 Command 内宣称 external success |

内部 Command 仍必须携带原正式 actor / source 和稳定 key；“internal”只表示不直接对外暴露，不弱化授权、幂等或审计。

### 6.2 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `HostActionOutcomeConsumerPlaceholder` | carrier / registry adapter callback；Sandbox host-binding feedback；其他正式 action target | `ExternalOutcomeEnvelopePlaceholder`；outcome id；external effect key；source ref；host / generation / attempt correlation；safe outcome summary | 更新 matching `HostActionAttempt`；按类别建立 / 更新 `HostExternalAssociation`；向 CMP-MS-02 / 05 / 06 暴露 committed local outcome ref | exact callback / envelope / receipt pending；late / duplicate / conflict 不覆盖 current；unknown 不盲重放 |

### 6.3 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `DispatchPendingHostActionsJob` | `OperationsContext`；prepared `HostActionAttempt` selector；work window / cursor | local dispatched / failed-to-dispatch / unknown attempt update；matching safe outcome 可由 port return 或后续 consumer 关联 | 只推进已有 committed attempt；不创建 decision / generation；cadence、batch、lease、timeout / backoff 留 04 / 03 |

### 6.4 External / Persistence Port 骨架

| Port | Seam / owner | 输入骨架 | 输出骨架 | 边界 / 状态 |
|---|---|---|---|---|
| `HostCarrierLifecyclePort` | adapter；container runtime / orchestration platform | action attempt ref；host / generation；safe carrier request refs；effect key / correlation | dispatch acknowledgement / safe outcome / unknown | 产品中立；先有 local attempt；backend resource 不取得 host identity |
| `PinnedAssetAcquisitionPortPlaceholder` | adapter/runtime；registry + Images supply ref | attempt ref；pinned supply ref；host generation；effect key | safe acquisition outcome / failed / unknown | supply ref exact contract受 `MSVC-UP-003` 限制；不选择 variant、不保存 image body |
| `SandboxHostBindingLifecyclePortPlaceholder` | runtime/ref；L4-sandbox | attempt ref；host / generation；binding / release intent refs；effect key | safe binding / release outcome or blocked / unknown | `MSVC-UP-004` exact caller / schema / receipt pending；不承担逐动作 execute |
| `HostProgressionStorePort` | local persistence | host / attempt / association refs；expected revisions；current pointer change | committed refs / conflict / replay facts | 保证 local single-active / generation guard；具体 transaction 留 03 |

### 6.5 对象 / capability 承接

| Capability | 接口落点 | 对象落点 | Step 8 flow |
|---|---|---|---|
| CAP-MS-09 | establish internal Command | `MemberExecutionHost`、`HostGenerationFence` | generation establishment flow |
| CAP-MS-10 | prepare Command + dispatch Job + lifecycle ports | `HostActionAttempt` | external action progression flow |
| CAP-MS-11 | outcome Consumer / safe port result | `HostActionAttempt`、history | outcome correlation flow |
| CAP-MS-12 | outcome Consumer + persistence port | `HostExternalAssociation` | association maintenance flow |

### 6.6 CMP-MS-03 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象 / capability 承接 | pass | CAP-MS-09~12 与 host / attempt / association / fence 全部有 use-case / consumer / job / port 落点。 |
| 类别 | pass | 正式决定经 internal Command 建 attempt；Job 只 dispatch；外部结果经 Consumer / port 回送。 |
| 元数据 | pass | internal Command 保留 inherited actor、metadata、stable key；Consumer 有 outcome identity / effect key。 |
| 边界 | pass_with_blockers | carrier / registry / Sandbox 是 adapter / runtime seam，不是源码依赖；`MSVC-UP-003/004` exact positive contracts 继续 pending。 |

停审结论：`CMP-MS-03` interface skeleton completed / pass；允许进入 CMP-MS-04。

## 7. CMP-MS-04：Registration and Host Session

### 7.1 Command API 骨架

| API | 暴露级别 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `AcceptHostRegistrationCommandPlaceholder` | formal use-case entry；`IB-MS-007` | `ActorContext`；`CommandMetadata`；`IdempotencyKey` / `RegistrationInputFingerprint`；`HostRef`；`HostGeneration`；`ProjectMemberRef`；`GlobalMemberRef`；`MemberRegistrationRefPlaceholder`；`LaunchCredentialRefPlaceholder`；`CorrelationId` | `HostRegistrationRef` + accepted / rejected / replaced / blocked + reason / gap refs | 通过 `RegistrationSessionPolicy` 校验 source、双锚、generation、credential qualification 和 replay | 写 `HostRegistration`、`HostHistoryEntry`；不写 Member truth、不把 accepted 写成 ready |
| `MaintainHostSessionCommandPlaceholder` | formal use-case entry；`IB-MS-008` | `ActorContext`；`CommandMetadata`；`IdempotencyKey`；accepted registration ref；safe endpoint ref；Member association placeholder；optional Runtime association placeholder；`HostGeneration`；`CorrelationId` | `HostEndpointRef` + `HostSessionRef` + active / stale / blocked / replaced / closed + gap refs | 在唯一活动 guard 下建立 / 替换 / 失效 endpoint 与 Host Session 壳；Runtime association 未闭口时保持 blocked / waiting | 写 `HostEndpoint`、`HostSession`、history；不创建 / 推进 Runtime run |

两项 Command 都需要 actor / metadata / stable input identity。Member 的 request / report body、credential secret 和 Runtime run body 均不进入输入或输出骨架。

### 7.2 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `QueryHostAccessSession` | `ActorContext`；`HostRef`；可选 `HostGeneration` / `HostRegistrationRef`；visibility / freshness request | safe registration + endpoint + Host Session slice；active / stale / blocked / closed / unknown；history anchor | `HostRegistration`、`HostEndpoint`、`HostSession`、`SafeHostView` | 只读；不接受注册、不刷新 endpoint、不创建 Runtime association；不返回 raw endpoint / secret |

### 7.3 External Port 骨架

| Port | Seam / owner | 输入骨架 | 输出骨架 | 边界 / 状态 |
|---|---|---|---|---|
| `MemberRegistrationIntakePortPlaceholder` | runtime/ref；L2-member | host / generation / subject refs；registration input ref；correlation | safe registration input summary / unavailable / unknown | `MSVC-UP-002` exact request / IPC / credential context pending；不把 Member request truth迁入本仓 |
| `RuntimeHostSessionAssociationPortPlaceholder` | runtime/ref；L2-runtime | host / generation / Host Session ref；allowed association request ref；correlation | runtime association ref / blocked / unknown | `MSVC-UP-001` exact entry / session surface pending；不定义 run / checkpoint / execution outcome |
| `CredentialBindingQualificationPortPlaceholder` | runtime/ref；credential owner pending | host / generation / subject refs；credential ref; correlation | instance-bound qualification summary / invalid / unknown | 不签发、撤销或保存 credential secret；`MSVC-UP-006` remains pending |
| `RegistrationSessionStorePort` | local persistence | registration / endpoint / session refs；expected revisions；current pointer change | committed refs / active uniqueness conflict / replay facts | 保证本地 single-active；完整 UoW / repository contract 留 03 |

### 7.4 对象 / capability 承接

| Capability | 接口落点 | 对象落点 | Step 8 flow |
|---|---|---|---|
| CAP-MS-13 | `AcceptHostRegistrationCommandPlaceholder` | `HostRegistration`、`RegistrationSessionPolicy` | registration acceptance flow |
| CAP-MS-14 | `MaintainHostSessionCommandPlaceholder` + `QueryHostAccessSession` | `HostEndpoint` | endpoint activation / invalidation flow |
| CAP-MS-15 | `MaintainHostSessionCommandPlaceholder` + Runtime port | `HostSession` | Host Session association flow |
| CAP-MS-16 | same Command + closure / recovery inputs | `RegistrationSessionPolicy`、registration / endpoint / session history | replacement / late-input flow |

### 7.5 CMP-MS-04 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象 / capability 承接 | pass | CAP-MS-13~16 和四个 CMP 对象均有明确入口 / 查询 / port。 |
| 类别 | pass | registration / session 维护为 Command；可用性为 Query；Member / Runtime 是协作 Port。 |
| 元数据 | pass | request / replay fingerprint、actor、metadata、generation 和 correlation 均显式。 |
| 边界 | pass_with_blockers | `MSVC-UP-001/002/006` exact contract 未闭；Host Session shell 不被解释为 Runtime ready。 |

停审结论：`CMP-MS-04` interface skeleton completed / pass；允许进入 CMP-MS-05。

## 8. CMP-MS-05：Host health and recovery

### 8.1 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `HostHealthSignalConsumerPlaceholder` | Member heartbeat / status、Host Session、carrier、Sandbox binding 等允许 signal / feedback；`IB-MS-010` | `ExternalEnvelopePlaceholder`；`ExternalMessageId`；`ExternalIdempotencyKey`；`HealthSignalSourceKind`；`SignalSourceRefPlaceholder`；host / session / generation correlation；observed / captured time；safe signal summary | 校验 source / generation / order / freshness，写 `HealthSignalSnapshot`；accepted / duplicate / late / stale / conflict / rejected；不直接写 recovery action | `MSVC-UP-001/002/004/007` exact family / envelope / route pending；raw heartbeat、logs、checkpoint 和 business outcome forbidden |

### 8.2 Command API 骨架

| API | 暴露级别 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `DecideHostRecoveryCommand` | formal use-case entry；`IB-MS-012` | `ActorContext`；`CommandMetadata`；`IdempotencyKey`；`HostRef`；`HostGeneration`；current `HostHealthAssessmentRef`；optional `HostFailureClassificationRef`；formal control source ref；`HostRecoveryAction`；prerequisite refs；`CorrelationId` | `HostRecoveryDecisionRef` + recover / restart / stop / terminate / hold + local status / gap refs | 校验 current generation、health / failure basis 和 formal control，形成显式宿主侧处置决定 | 写 `HostRecoveryDecision`、history / material marker；不执行 Runtime recovery，不声明 action complete |

### 8.3 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `QueryHostHealthFailure` | `ActorContext`；`HostRef`；可选 generation / time range / freshness request | four-axis health slice；failure classification；recovery decision safe slice；unknown / stale markers | `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision`、`SafeHostView` | 只读；不因查询重评估、不隐式 recovery；不输出 raw signal / Runtime state |

### 8.4 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `EvaluateDueHostHealthJob` | `OperationsContext`；accepted snapshots / current host facts；assessment window selector | 新 `HostHealthAssessment`、optional `HostFailureClassification`、history / material marker | 可形成评估与分类，但不能隐式创建 `HostRecoveryDecision`；阈值 / window / schedule 留 04 |

### 8.5 External / Persistence Port 骨架

| Port | Seam / owner | 输入骨架 | 输出骨架 | 边界 / 状态 |
|---|---|---|---|---|
| `HealthSignalIntakePortPlaceholder` | event/runtime/ref；Member / Runtime / Sandbox / carrier | source / generation / correlation；safe signal envelope | accepted / duplicate / late / stale / conflict / unavailable | exact event / callback contract pending；只接收安全摘要 |
| `HostActionHealthBasisReaderPort` | local read port；CMP-MS-03 committed facts | host / generation；action / association fact selector | matching `HostActionAttemptRef` / `HostExternalAssociationRef` + safe local outcome refs | 只读本地 committed facts；不复制 action truth，不由 outcome 直接 restart / terminate |
| `HostHealthFactStorePort` | local persistence | snapshots / assessments / failure / decision refs；expected revisions | committed refs / current assessment / conflict | 本仓内强一致；不从 backend / projection 重建 source facts |
| `FormalRecoveryContextPort` | local control boundary | host / generation；formal control source ref；current facts selector | allowed control context / blocked / unresolved | 不取得 governance approval truth；只提供已形成的本地正式控制语境 |

### 8.6 对象 / capability 承接

| Capability | 接口落点 | 对象落点 | Step 8 flow |
|---|---|---|---|
| CAP-MS-17 | `HostHealthSignalConsumerPlaceholder` | `HealthSignalSnapshot` | signal intake / dedup flow |
| CAP-MS-18 | Consumer + `EvaluateDueHostHealthJob` | `HostHealthAssessment` | four-axis assessment flow |
| CAP-MS-19 | health job / assessment service | `HostFailureClassification` | failure classification flow |
| CAP-MS-20 | `DecideHostRecoveryCommand` | `HostRecoveryDecision` | explicit recovery decision flow |

### 8.7 CMP-MS-05 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象 / capability 承接 | pass | CAP-MS-17~20 与 snapshot / assessment / failure / decision 均有 Consumer、Job、Command、Query 落点。 |
| 类别 | pass | signal 是 Consumer；assessment job 只形成健康事实；recovery 是显式 Command；查询 no-write。 |
| 元数据 | pass | event identity、source、generation、freshness、correlation 与 command idempotency 均显式。 |
| 边界 | pass_with_blockers | 不把 heartbeat / backend / Runtime / observed truth当本仓健康；上游 event family 仍 pending。 |

停审结论：`CMP-MS-05` interface skeleton completed / pass；允许进入 CMP-MS-06。

## 9. CMP-MS-06：Host closure and reconciliation

### 9.1 Command API 骨架

| API | 暴露级别 | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|---|
| `CloseHostCommand` | formal use-case entry；`IB-MS-013` | `ActorContext`；`CommandMetadata`；`IdempotencyKey`；`HostRef`；`HostGeneration`；termination / replacement / release decision ref；closure scope；current registration / session / association refs；`CorrelationId` | `HostClosureRef` + local invalidation / cleanup attempt refs + locally-closed / pending / blocked / unknown | 显式失效本地 registration / endpoint / session / association，先形成 cleanup attempts，再交 external ports / jobs | 写 `HostClosure`、`CleanupAttempt`、history / material marker；不声明 external cleanup completed |

### 9.2 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `HostCleanupFeedbackConsumerPlaceholder` | Sandbox / carrier / registry cleanup or release owner；`IB-MS-017` cleanup branch | `ExternalFeedbackEnvelopePlaceholder`；`ExternalMessageId`；`ExternalIdempotencyKey`；cleanup effect key；target / host / generation refs；safe cleanup summary；`CorrelationId` | 更新 matching `CleanupAttempt`，推进 `HostClosure` local status，必要时形成 `ResidualFinding` / gap；不改写 termination truth | exact receipt / caller / route pending；request accepted / timeout 不等于 external completed |

### 9.3 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ProgressPendingHostCleanupJob` | `OperationsContext`；closure pending items；prepared / unknown-fenced `CleanupAttempt` selector | local dispatch / outcome / gap updates；matching closure progression | 只推进已有 closure / attempt；unknown effect 保持 stable key，不盲重放；schedule / lease 留 04 |
| `ReconcileHostResidualsJob` | `OperationsContext`；committed Host Truth；allowed external summaries；`IB-MS-014` | `ResidualFinding`、`ReconciliationCase`、hold / repair-request / escalate / resolved / unknown disposition | 只发现 / 记录 / 推进正式 case；不隐式创建 launch / restart / terminate，不修 sibling / backend truth |

### 9.4 External / Persistence Port 骨架

| Port | Seam / owner | 输入骨架 | 输出骨架 | 边界 / 状态 |
|---|---|---|---|---|
| `HostCleanupReleasePortPlaceholder` | runtime/ref / adapter；Sandbox / carrier / registry owner | `CleanupAttemptRef`；target refs；host / generation；effect key；safe release intent ref | dispatch acknowledgement / safe cleanup outcome / blocked / unknown | `MSVC-UP-004` caller / binding / receipt pending；不拥有 external cleanup truth |
| `ResidualObservationPortPlaceholder` | runtime/ref / adapter | host / generation / external association refs；observation correlation | safe external summary / unavailable / unknown | 只读取允许摘要；不将 resource absence自动写成 resolved |
| `ClosureReconciliationStorePort` | local persistence | closure / cleanup / finding / case refs；expected revisions；case disposition change | committed refs / current case / conflict | 本地 closure / case 强一致；不跨 owner transaction |

### 9.5 对象 / capability 承接

| Capability | 接口落点 | 对象落点 | Step 8 flow |
|---|---|---|---|
| CAP-MS-21 | `CloseHostCommand` | `HostClosure` | closure / invalidation flow |
| CAP-MS-22 | cleanup Command stage + `ProgressPendingHostCleanupJob` + cleanup port | `CleanupAttempt` | cleanup / release flow |
| CAP-MS-23 | `ReconcileHostResidualsJob` + observation port | `ResidualFinding` | residual discovery flow |
| CAP-MS-24 | same Job + case store | `ReconciliationCase` | reconciliation disposition flow |

### 9.6 CMP-MS-06 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象 / capability 承接 | pass | CAP-MS-21~24 与 closure / attempt / finding / case 均有 Command、Consumer、Job、Port。 |
| 类别 | pass | closure 是 Command；cleanup / residual 是 Job + Port；外部结果是 Consumer；Query 不承担清理。 |
| 元数据 | pass | cleanup effect key、feedback identity、generation、actor、metadata、correlation 均显式。 |
| 边界 | pass_with_blockers | Sandbox / carrier / registry cleanup receipt 仍 pending；local closure 与 external completion 分层。 |

停审结论：`CMP-MS-06` interface skeleton completed / pass；允许进入 CMP-MS-07。

## 10. CMP-MS-07：Host fact handoff and safe consumption

### 10.1 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `QuerySafeHostFacts` | `ActorContext`；`ProjectMemberRef`；optional `HostRef` / generation；visibility / freshness request | `SafeHostView` + source revision refs + stale / degraded / unavailable markers | committed CMP-MS-01~06 facts、`SafeHostView`、`HostProjectionState` | 只读；不 refresh / reconcile / publish / repair；不输出 forbidden body |
| `QueryHostHistory` | `ActorContext`；subject / host selector；history cursor / time selector；visibility request | body-free `HostHistoryEntry` page / history anchor + freshness | append-only `HostHistoryEntry`、source refs、safe projection | 只读；不把 history replay 当命令、不改变 current truth；wire pagination 留 03 |

### 10.2 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `HostHandoffFeedbackConsumerPlaceholder` | Bus / Observability / authorized consumer owner；`IB-MS-017` delivery / observed / accepted branches | `ExternalFeedbackEnvelopePlaceholder`；`ExternalMessageId`；`ExternalIdempotencyKey`；`HandoffKey`；target ref；delivery / observation / acceptance safe summary；`CorrelationId` | 更新 matching `HostHandoffRecord` feedback layer；记录 gap / unknown / history；不回滚 source facts、outbox 或 projection truth | exact route / receipt / consumer contract pending；delivered / observed / accepted 互不推断 |

### 10.3 Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `HostFactMaterialEventCandidate` | committed `HostFactMaterial` + `HostOutboxRecord`；`IB-MS-016` | L0-bus、L4-observability、authorized consumers、按正式合同的 L2-runtime / L2-member | 传播 body-free source change / material ref、subject / host / generation / correlation 和 local handoff identity 的候选语义；event envelope / route / receipt / version 全部 placeholder；published / submitted 不等于 delivered |

### 10.4 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `PublishHostFactOutboxJob` | `OperationsContext`；pending `HostOutboxRecord`；publication cursor / work window | publisher attempt、submitted / gap / unknown outbox update；对应 `HostHandoffRecord` 建立或推进 | 只发布已提交 material；不创建 source truth、不声明 delivery / observation / acceptance；route / batch / retry 留 03 / 04 |
| `RebuildSafeHostProjectionJob` | `OperationsContext`；committed change cursor；`HostProjectionState` | apply / rebuild `HostProjectionState`，产生 fresh / stale / rebuilding / degraded `SafeHostView` | 只从 committed facts 重建；不反写 CMP-MS-01~06；projection unavailable 不阻塞核心 writes |
| `ReconcileHostHandoffGapsJob` | `OperationsContext`；handoff gap / unknown selector；feedback cursor | stable-key retry decision marker、gap / unknown update、matching feedback link | 不盲重放不可逆外部效果；不把本地 retry 变成 delivered / accepted；具体 retry policy 留 04 |

### 10.5 External / Persistence Port 骨架

| Port | Seam / owner | 输入骨架 | 输出骨架 | 边界 / 状态 |
|---|---|---|---|---|
| `HostFactPublicationPortPlaceholder` | event/ref；L0-bus / observability / target owner | `HostFactMaterialRef`；`PublicationKey`；target class；source change / correlation | local submit summary / unavailable / unknown | `MSVC-UP-007` route / envelope / receipt pending；不声明 delivery |
| `HandoffFeedbackIntakePortPlaceholder` | event/ref | target / handoff key；feedback envelope ref；safe outcome summary | accepted / duplicate / late / conflict / unknown | 只允许更新 matching handoff layer；不反写 source truth |
| `SafeProjectionStorePort` | local persistence | view scope；committed change cursor；projection revision | committed projection state / safe view / gap | 可重建、最终一致、只读消费；不成为 command source |
| `HostMaterialHistoryStorePort` | local persistence | material / history / outbox / handoff refs；expected revisions | committed local refs / conflict | 只保存 body-free local records；完整 repository / transaction contract 留 03 |

### 10.6 对象 / capability 承接

| Capability | 接口落点 | 对象落点 | Step 8 flow |
|---|---|---|---|
| CAP-MS-25 | committed change materializer + `PublishHostFactOutboxJob` / outbound event | `HostFactMaterial`、`HostOutboxRecord` | material / outbox formation flow |
| CAP-MS-26 | outbound event、publish / gap jobs、feedback Consumer | `HostHandoffRecord` | per-target handoff flow |
| CAP-MS-27 | `QuerySafeHostFacts`、`QueryHostHistory` | `SafeHostView`、`HostHistoryEntry` | safe query flow |
| CAP-MS-28 | `RebuildSafeHostProjectionJob` | `HostProjectionState`、`SafeHostView` | projection rebuild flow |

### 10.7 CMP-MS-07 停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 对象 / capability 承接 | pass | CAP-MS-25~28 与 material / handoff / view / projection / outbox / history 均有 Query、Consumer、Event、Job、Port。 |
| 类别 | pass | Query 严格 no-write；material 是 outbound event 来源；publish / projection / gap 是 Job；feedback 是 Consumer。 |
| 元数据 | pass | actor / visibility、material / publication / handoff stable key、event identity、feedback identity 和 cursor 均显式。 |
| 边界 | pass_with_blockers | Bus / Observability / consumer route 与 receipt 仍 pending；local attempt / gap 不升格为 delivered / observed / accepted。 |

停审结论：`CMP-MS-07` interface skeleton completed / pass；允许执行 Step 7 跨接口终审。

## 11. 全局接口分类表

### 11.1 Command API / use-case entry

| API | 正式能力 | 归属 | 主要 owner 对象 | ActorContext | 幂等信息 | 写入范围 |
|---|---|---|---|---|---|---|
| `AcceptHostIntentCommand` | `IB-MS-001` | CMP-MS-01 | `HostIntent`、`HostControlPolicy` | required | `HostIntentKey` + `CommandMetadata` | intent / history / local material marker |
| `DecideHostOrchestrationCommand` | `IB-MS-002` | CMP-MS-01 | `HostOrchestrationDecision` | required | decision idempotency key + intent ref | decision / history / marker |
| `ResolveHostQualificationCommand` | `IB-MS-004` | CMP-MS-02 | `HostQualificationContext`、`RequiredQualificationPolicy` | required | decision + generation + command key | qualification context / history |
| `CoordinateHostAssemblyCommand` | `IB-MS-005` | CMP-MS-02 facade；CMP-MS-03 progression | `HostAssembly`、`HostReadinessDecision` | required / inherited | assembly command key + generation | assembly / readiness / history / attempts by separate use case |
| `AcceptHostRegistrationCommandPlaceholder` | `IB-MS-007` | CMP-MS-04 | `HostRegistration`、`RegistrationSessionPolicy` | required | registration fingerprint + generation | registration / history |
| `MaintainHostSessionCommandPlaceholder` | `IB-MS-008` | CMP-MS-04 | `HostEndpoint`、`HostSession` | required | association key + generation | endpoint / session / history |
| `DecideHostRecoveryCommand` | `IB-MS-012` | CMP-MS-05 | `HostRecoveryDecision` | required | recovery decision key + generation | recovery decision / history |
| `CloseHostCommand` | `IB-MS-013` | CMP-MS-06 | `HostClosure`、`CleanupAttempt` | required | closure key + generation | closure / invalidation / cleanup attempt / history |

内部 `EstablishHostGenerationCommand` 和 `PrepareHostActionCommand` 是 CMP-MS-03 的 application use-case 骨架，不增加正式 IB 编号；它们只能由已提交决定调用，并继承 actor / source / correlation，不成为外部绕过入口。

### 11.2 Query API

| API | 正式能力 | 归属 | 主要读取对象 / 视图 | ActorContext | 写入规则 |
|---|---|---|---|---|---|
| `QueryCurrentHostDecision` | `IB-MS-003` | CMP-MS-01 | intent / decision source facts + `SafeHostView` | required | no-write |
| `QueryHostAssemblyReadiness` | `IB-MS-006` | CMP-MS-02 | qualification / assembly / readiness | required | no-write |
| `QueryHostAccessSession` | `IB-MS-009` | CMP-MS-04 | registration / endpoint / session | required | no-write |
| `QueryHostHealthFailure` | `IB-MS-011` | CMP-MS-05 | signal / assessment / failure / recovery | required | no-write |
| `QuerySafeHostFacts`、`QueryHostHistory` | `IB-MS-015` | CMP-MS-07 | `SafeHostView`、`HostHistoryEntry`、projection state | required | no-write；不 refresh / repair |

### 11.3 Inbound Event Consumer

| Consumer family | 正式能力 | 归属 | 允许写入 | 稳定关联 | 当前上限 |
|---|---|---|---|---|---|
| `QualificationSourceChangedConsumerPlaceholder` | supporting boundary for CAP-MS-05 | CMP-MS-02 | source resolution / freshness / qualification gap | external message id + source ref + generation | Identity / Work / Images / credential / Sandbox exact event contracts pending |
| `HostActionOutcomeConsumerPlaceholder` | CAP-MS-11 / CAP-MS-12 | CMP-MS-03 | matching attempt / association outcome | effect key + attempt ref + generation | carrier / registry / binding callback contract pending |
| `HostHealthSignalConsumerPlaceholder` | `IB-MS-010` | CMP-MS-05 | `HealthSignalSnapshot` and freshness | event id + external idempotency key + source / generation | Member / Runtime / Sandbox / carrier event family pending |
| `HostCleanupFeedbackConsumerPlaceholder` | `IB-MS-017` cleanup branch | CMP-MS-06 | cleanup attempt / closure / residual gap | cleanup effect key + generation | Sandbox / carrier / registry receipt pending |
| `HostHandoffFeedbackConsumerPlaceholder` | `IB-MS-017` delivery branch | CMP-MS-07 | handoff outcome layers only | handoff key + target + event id | Bus / Observability / consumer receipt pending |

`IB-MS-017` 是一个正式反馈能力族而非两个互相竞争的 API；按 target owner 分支落到 CMP-MS-06 或 CMP-MS-07，二者都不得修改另一方的 source truth。

### 11.4 Outbound Event

| Event family | 正式能力 | 产生来源 | 主要消费者 | 本地写前提 | 外部结果边界 |
|---|---|---|---|---|---|
| `HostFactMaterialEventCandidate` | `IB-MS-016` | committed `HostFactMaterial` + `HostOutboxRecord` | Bus、Observability、授权 consumer、按合同的 Runtime / Member | source change、material、outbox 已提交 | local submitted / publisher acknowledgement 不等于 delivered、observed 或 accepted |

### 11.5 Operations Job

| Job | 正式能力 / 支撑 | 归属 | 读取来源 | 可写结果 | 禁止事项 |
|---|---|---|---|---|---|
| `DispatchPendingHostActionsJob` | CAP-MS-10 support | CMP-MS-03 | prepared `HostActionAttempt` | dispatch / unknown / gap | 不建 decision / host，不盲重试 |
| `EvaluateDueHostHealthJob` | CAP-MS-18 / 19 support | CMP-MS-05 | snapshots + current facts | assessment / classification | 不隐式建 recovery decision |
| `ProgressPendingHostCleanupJob` | `IB-MS-013` support | CMP-MS-06 | closure + cleanup attempts | dispatch / outcome / gap | 不把 receipt 写成 external completed |
| `ReconcileHostResidualsJob` | `IB-MS-014` | CMP-MS-06 | local facts + safe external summaries | finding / case / disposition | 不改 sibling / backend truth，不隐式 lifecycle action |
| `PublishHostFactOutboxJob` | `IB-MS-016` support | CMP-MS-07 | outbox + material | publication attempt / handoff | 不创建 source truth，不声明 delivery |
| `RebuildSafeHostProjectionJob` | CAP-MS-28 support | CMP-MS-07 | committed change cursor + projection state | projection state / safe view | 不反写 core truth |
| `ReconcileHostHandoffGapsJob` | CAP-MS-26 support | CMP-MS-07 | handoff gap / unknown | stable-key retry marker / feedback link | 不盲重放不可逆 action，不声明 accepted |

## 12. Application Port / Persistence Port seam 矩阵

| Port 家族 | 代表接口 | Seam 类型 | owner / 依赖类别 | 输入 / 输出上限 | fail-closed / fake 口径 |
|---|---|---|---|---|---|
| Core shared contract port | `CoreTypeCategoryPortPlaceholder` | compile | L0-core | shared type category / validation result；不定义 member-service-specific schema | schema 未闭口则 placeholder；fake 只验证 mapping 语义 |
| SDK boundary port | `SdkServerBoundaryPortPlaceholder` | compile | L0-sdk | client / server boundary category；准确 target pending | 不成为运行期 host client；fake 不证明 SDK target ready |
| Identity / Work qualification ports | `GlobalMemberQualificationResolverPort`；`ProjectMemberQualificationResolverPort` | runtime + ref | L1-identity / L1-work | typed subject ref + safe qualification summary | unresolved / stale / conflict -> blocked；不复制正文 |
| Images supply port | `PinnedImageSupplyResolverPortPlaceholder` | runtime + ref | L2-member-images | pinned supply ref / safe qualification | exact manifest / variant / confirmation pending；不可验证 -> launch blocked |
| Credential port | `LaunchCredentialQualificationPortPlaceholder`；`CredentialBindingQualificationPortPlaceholder` | runtime + ref | owner pending | instance-bound safe qualification ref | 不签发 / 撤销 / 保存 secret；unknown -> blocked |
| Member intake port | `MemberRegistrationIntakePortPlaceholder` | runtime + ref | L2-member | registration input safe summary | exact request / IPC / credential pending；不迁移 Member truth |
| Runtime host-session port | `RuntimeHostSessionAssociationPortPlaceholder` | runtime + ref | L2-runtime | host-session association ref / blocked | 不定义 run / checkpoint / entry contract；positive blocked |
| Sandbox host-binding ports | `SandboxHostBindingQualificationPortPlaceholder`；`SandboxHostBindingLifecyclePortPlaceholder`；`HostCleanupReleasePortPlaceholder` | runtime + ref | L4-sandbox | host-level bind / release safe outcome | exact caller / receipt pending；不承担 tool execute / policy enforcement |
| Health / feedback event intake | `HealthSignalIntakePortPlaceholder`；`HandoffFeedbackIntakePortPlaceholder` | event + ref | Member / Runtime / Sandbox / Bus / consumers | envelope placeholder + safe summary | event identity / route / receipt unknown -> duplicate / gap / blocked |
| Host carrier / registry adapters | `HostCarrierCapabilityPort`；`HostCarrierLifecyclePort`；`PinnedAssetAcquisitionPortPlaceholder` | adapter | container runtime / orchestration / registry | adapter-neutral capability / outcome | backend product state不定义 Host Truth；unknown fenced |
| Publication / handoff target | `HostFactPublicationPortPlaceholder` | event + ref | L0-bus / Observability / authorized targets | material ref + target class + local submission summary | submitted != delivered / observed / accepted；route pending |
| Local domain stores | `IntentDecisionStorePort`、`QualificationAssemblyStorePort`、`HostProgressionStorePort`、`RegistrationSessionStorePort`、`HostHealthFactStorePort`、`ClosureReconciliationStorePort`、`SafeProjectionStorePort`、`HostMaterialHistoryStorePort` | local persistence | 本仓 infrastructure seam | aggregate refs、expected revisions、local change plan | 本地强一致；完整 trait / UoW / storage product 留 03 |
| Clock / ID / operation context | `ClockPort`、`IdGenerationPort`、`OperationsContextPort`（candidate） | local adapter / fake seam | 本仓支持层 | timestamp / stable id / job context | fake 只用于受控语义验证，不证明真实 backend / event route |

### 12.1 Seam 禁止转换

| 禁止转换 | 说明 |
|---|---|
| runtime / event / ref -> sibling compile dependency | 运行期协作只经 port / consumer / safe ref；不能引用兄弟仓源码路径。 |
| adapter result -> Host Truth | carrier / registry / Sandbox backend 的状态只能成为 attempt / association / safe outcome。 |
| event submission -> delivered / observed / accepted | 交接层级必须由正式 owner 反馈分别关联。 |
| fake pass -> integration readiness | fake 只证明本地分类、幂等和 fail-closed 语义。 |
| Query -> Command / Job | 查询不刷新、不修复、不发布、不恢复。 |
| Job trigger -> authorization | job 只能推进已提交事实或已授权 disposition。 |

## 13. 按主要组成部分的接口闭环索引

| CMP | Command | Query | Consumer | Event | Job | Port / store | 闭环结论 |
|---|---|---|---|---|---|---|---|
| CMP-MS-01 | `IB-MS-001/002` | `IB-MS-003` | — | local material marker | — | intent / decision store、current facts reader | pass |
| CMP-MS-02 | `IB-MS-004/005` | `IB-MS-006` | qualification source change | — | — | six qualification / assembly ports + store | pass_with_upstream_blockers |
| CMP-MS-03 | internal generation / attempt commands | — | action outcome | — | pending action dispatch | carrier / asset / binding / progression store | pass_with_upstream_blockers |
| CMP-MS-04 | `IB-MS-007/008` | `IB-MS-009` | — | — | — | Member / Runtime / credential / session store | pass_with_upstream_blockers |
| CMP-MS-05 | `IB-MS-012` | `IB-MS-011` | `IB-MS-010` + action bridge | — | health evaluation | signal / recovery / health store | pass_with_upstream_blockers |
| CMP-MS-06 | `IB-MS-013` | — | `IB-MS-017` cleanup branch | — | `IB-MS-014` + cleanup progress | cleanup / observation / case store | pass_with_upstream_blockers |
| CMP-MS-07 | — | `IB-MS-015` | `IB-MS-017` handoff branch | `IB-MS-016` | publish / projection / gap reconciliation | publication / feedback / projection / history stores | pass_with_upstream_blockers |

## 14. Step 8 / Step 9 反查清单

| 后续位置 | 必须承接的接口 | 反查对象 / 状态 | 结论 |
|---|---|---|---|
| Step 8 P0 intent acceptance | `AcceptHostIntentCommand` | `HostIntent`、acceptance state、history | defined |
| Step 8 P0 orchestration decision | `DecideHostOrchestrationCommand` | `HostOrchestrationDecision`、decision state | defined |
| Step 8 qualification / assembly | `ResolveHostQualificationCommand`、`CoordinateHostAssemblyCommand`、resolver ports | context / assembly / readiness states | defined |
| Step 8 generation / action progression | internal generation / attempt commands、dispatch job、outcome consumer、carrier ports | host / attempt / association / fence | defined |
| Step 8 registration / session | registration / session commands、Member / Runtime ports | registration / endpoint / session | defined but positive contract blocked |
| Step 8 health signal / assessment | health consumer、health job、signal port | snapshot / assessment / failure | defined |
| Step 8 recovery | `DecideHostRecoveryCommand` | recovery decision + generation | defined |
| Step 8 closure / cleanup | `CloseHostCommand`、cleanup job / consumer / port | closure / cleanup attempt | defined |
| Step 8 residual / reconciliation | `ReconcileHostResidualsJob`、observation port | finding / case | defined |
| Step 8 material / publication | material event、outbox job、publication port | material / outbox / handoff | defined but route pending |
| Step 8 safe query / projection | query APIs、projection rebuild job / store | view / projection state / history | defined |
| Step 9 command-owned states | Commands above | intent / decision / readiness / registration / session / recovery / closure | each has explicit writer |
| Step 9 consumer-owned states | signal / outcome / feedback consumers | snapshot / attempt / association / handoff feedback layers | consumers never create hidden command |
| Step 9 job-owned states | health / cleanup / reconciliation / publication / projection jobs | assessment, gap, case, outbox, projection | jobs only advance existing authority |

## 15. 跨接口一致性审计

| 审计项 | 结论 | 处理 / 证据 |
|---|---|---|
| 正式接口覆盖 | pass | `IB-MS-001~017` 全部出现；001/002、004/005、007/008、012/013、015/016 分别有唯一 host-side owner。 |
| Command / Query 分类 | pass | 8 项正式变更接口改写 truth；5 项查询只读；无 Query 写入或 Command 伪装为 event。 |
| Consumer 分类 | pass | 010 承接信号，017 承接 cleanup / delivery feedback；所有 Consumer 均保存 source / event identity / generation / correlation。 |
| Outbound Event 分类 | pass | 016 只从 committed material / outbox 产生；不把 publish 或 receipt 当 delivered。 |
| Job 权限 | pass | Jobs 只推进 persisted attempt / assessment / case / outbox / projection；不隐式创建 formal decision。 |
| `IB-MS-005` 归属 | pass | CMP-02 拥有对外 assembly facade；CMP-03 只承接 host-side progression，不另造对外能力。 |
| `IB-MS-017` 归属 | pass | 一个反馈能力族按 cleanup / handoff target 分支；各自只更新匹配本地记录。 |
| Actor / metadata / idempotency | pass | 每个 Command 显式 actor + metadata + stable key；Query 显式 actor；Consumer 显式 event / feedback identity。 |
| local transaction / external eventual | pass | Command 本地 change / history / marker 可同本地提交；external port / event / feedback 不纳入跨 owner 原子性。 |
| object back-reference | pass | Step 6 的 29 个对象均至少有一个接口、job、consumer、port 或 query 承接；无接口孤儿。 |
| state writer uniqueness | pass | readiness、health、registration、session、closure、handoff、projection 等状态轴各有明确 writer；projection 不回写 source。 |
| external truth boundary | pass_with_blockers | Runtime / Member / Images / Sandbox / credential / Bus / SDK exact contract 继续 `MSVC-UP-001~008` pending；没有单方 ready。 |
| optional extension contamination | pass | E01~E04 明确停留为扩展边界，不进入当前 API / Job / state 分母。 |
| implementation leakage | pass | 无 HTTP path、RPC method、topic、完整 JSON / proto、数据库表、trait、SDK client 或产品配置。 |
| fake honesty | pass | fake 只作 seam 验证说明，不计真实 backend、route、compile target 或 integration readiness。 |

## 16. 接口命名、输入输出与错误边界审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 名称稳定 | pass | Command / Query / Consumer / Event / Job 名称均以 use-case / owner / outcome 语义命名，不使用产品或 transport 名。 |
| 输入骨架 | pass | Command 有 actor / metadata / idempotency；Consumer 有 envelope / event identity / source / correlation；Query 有 actor / selector。 |
| 输出骨架 | pass | 输出均为 local ref、decision、safe slice、attempt、gap、projection 或 safe outcome；没有外部正文。 |
| 失败语义 | pass | rejected / waiting / blocked / stale / conflict / unknown / gap / unavailable 可在各类别表达。 |
| 详细设计上限 | pass | 错误码、协议字段、路由、重试参数、调度策略、事务细节留 03 / 04。 |

## 17. 正式第 7 章回填草稿

正式 §7 应先保留接口分类说明，再按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五类表格回填。正式正文可将 CMP 分组索引压缩为能力归属说明，但必须保留以下边界结论：

1. `IB-MS-001~017` 的能力语义已覆盖，但 Member / Runtime / Images / Sandbox / credential / Core / Bus exact 双侧合同仍是 placeholder / blocked / waiting。
2. Command 改写本仓 truth；Query no-write；Consumer 只承接外部 safe fact / feedback；Outbound Event 只传播 committed body-free material；Job 不取得隐式业务授权。
3. `IB-MS-005` 的外部 facade 与 CMP-MS-03 内部 progression 分层；`IB-MS-017` 按 target branch 分层但保持一个正式能力族。
4. 所有 transport、schema、错误码、route、receipt、UoW 和 adapter 细节交给 03；所有 cadence、timeout、backoff、batch 和 config key 交给 04。

## 18. 待确认事项与后续上限

| 事项 | 当前结论 | 对 Step 8 / 后续影响 |
|---|---|---|
| Runtime host-session / entry surface | host-side port skeleton only；positive blocked | Step 8 只能写 blocked / placeholder 分支，不能写 Runtime run 正向时序。 |
| Member registration / signal exact contract | requirement owner 分工成立，字段 / IPC / credential waiting | Consumer / Command 保持 placeholder；不能声称真实联调。 |
| Images pinned supply、Sandbox binding、credential | typed ref / safe summary skeleton | qualification / action flow 缺口必须 fail closed。 |
| Core event family / Bus route / receipt | event candidate only | publish / feedback flow 保持 local attempt / gap / unknown。 |
| SDK target / Server self-test | compile boundary only | 不把 SDK client 当 runtime dependency；准确 target 留 03 / 05。 |
| Optional E01~E04 | extension boundary only | 若未来纳入，须回开 Step 2、5、7，不可在 03 偷加接口。 |

## 19. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 七部分逐项接口停审 | pass | CMP-MS-01~07 均完成 Command / Query / Consumer / Event / Job / Port 小循环与独立停审。 |
| 正式 IB 覆盖 | pass | IB-MS-001~017 全部有唯一归属和反查位置。 |
| 读写分类 | pass | Command / Query / Consumer / Event / Job 没有互相越权或隐式转换。 |
| 对象 / capability 承接 | pass | 29 个对象与 CAP-MS-01~28 均可由接口或 supporting port / job 反查。 |
| 输入元数据 | pass | ActorContext、CommandMetadata、幂等身份、event identity、generation、correlation 已显式。 |
| seam 分类 | pass | compile / runtime / event / ref / adapter / fake 均有禁止转换和 positive ceiling。 |
| 外部 blocker | pass_with_blockers | `MSVC-UP-001~008` 继续 pending / blocked / waiting；未伪造 exact contract 或 readiness。 |
| 正式文档写入 | pass | 未修改旧正式 02；Step 8 尚未创建。 |

```text
step_07_status = completed
step_07_gate = pass
formal_interfaces_covered = IB-MS-001..017
component_stop_reviews = 7_of_7
cross_interface_audit = pass_with_upstream_blockers
formal_02_write_allowed = false
next_allowed_step = Step 8 processing_flows
```
