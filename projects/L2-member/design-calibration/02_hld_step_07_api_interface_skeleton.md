# Step 7. API / 接口骨架主控

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-08-24
> 状态: completed / pass / CP01~07_stop_review / cross_interface_audit_pass
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标、输入与边界

本步从 Step 5 七个主要组成部分和 Step 6 的 34 个对象出发,冻结 language-neutral、transport-neutral 的正式接口主语、输入 / 输出对象骨架、读写性质与 owner 边界。本步不定义 HTTP / RPC / UDS、event schema / topic / route、完整 DTO、错误码、repository method、adapter 或实现。

## 2. Step 内计划

| 顺序 | 模块 | 输出文件 | 状态 | 门禁 |
|---:|---|---|---|---|
| 1 | 全局问题回答、分类与复杂度取舍 | 本主控文件 §3~§6 | completed / pass | API / Consumer / Event / Job / Port 分类与 pending 口径已收稳 |
| 2 | CP01 Presence / Host | `02_hld_step_07_interfaces_presence_host.md` | completed / pass | 接口分类、host owner 与写后审计通过 |
| 3 | CP02 Inbound | `02_hld_step_07_interfaces_inbound.md` | completed / pass | transient body、screening / external truth 与写后审计通过 |
| 4 | CP03 Runtime Mediation | `02_hld_step_07_interfaces_runtime_mediation.md` | completed / pass | entry / result / material Consumer 分层与写后审计通过 |
| 5 | CP04 Outbound | `02_hld_step_07_interfaces_outbound.md` | completed / pass | committed source、publication 分层与写后审计通过 |
| 6 | CP05 Interaction Trace | `02_hld_step_07_interfaces_trace.md` | completed / pass | committed-only trace、observation 边界与写后审计通过 |
| 7 | CP06 External Context Mirror | `02_hld_step_07_interfaces_external_mirror.md` | completed / pass | owner-specific source、neutral resolution 与写后审计通过 |
| 8 | CP07 Member Read Model | `02_hld_step_07_interfaces_read_model.md` | completed / pass | projection no-write、outlet non-authorizing 与写后审计通过 |
| 9 | 分类汇总、Step 8 反查与跨接口审计 | 本主控文件 §7~§10 | completed / pass | 10 / 16 / 14 / 24 / 5 分类、34 对象能力、metadata、依赖与 pending 审计通过 |

## 3. SOP 问题回答

### 3.1 接口分类

```text
Command API
  显式发起 member local truth / support truth 变化;需要 ActorContext、CommandMetadata 与 IdempotencyKey。

Query API
  读取 projection、trace 或 neutral resolution surface;需要 ActorContext / QueryMetadata,不得改写任何状态。

Inbound Event Consumer
  消费 formal envelope / source event / feedback / committed local fact,先做 source、version、dedup 与 body gate,再交 Application Service。

Outbound Event
  传播 member 已提交 local fact / support fact / projection change 的语义;只冻结事件主语和最小 ref,carrier / route pending。

Operations Job
  基于已持久化事实继续 publication、observation、refresh、rebuild 或 reconciliation;不得成为业务 Command 或修复 truth。

Inward Port / Persistence Interface
  隔离 external owner 与 physical carrier;是本仓 inward contract,不是 package dependency、正向 integration 或业务对象。
```

### 3.2 哪些能力采用 Command / Query

| 判断 | 结论 |
|---|---|
| startup admission、presence transition、scope change、controlled Runtime delivery | 需要显式 Command API;均改写 member local truth。 |
| outbound evaluation、trace append、Mirror resolution | 只在跨组成部分 / external trigger 需要稳定用例入口时设 Command;不把 application helper 暴露为公共 API。 |
| summary / outlet / diagnostics / trace / neutral resolution read | Query API;只读 projection / stored support surface。 |
| projection rebuild、refresh、gap reconcile、relay | Operations Job;不得由普通 Query 隐式触发。 |

### 3.3 哪些事实通过 Consumer / Event

| 类别 | 结论 |
|---|---|
| 外部事实与 external feedback | 经 Consumer;必须携带 `EventEnvelope`、`SourceEventId` / feedback ref、schema version、dedup key、trace context。 |
| 本仓 committed fact | 经本地 Consumer;必须携带 `MemberFactEnvelope`、`MemberFactId`、schema version、dedup key、trace context。该名称只是 transport-neutral 逻辑槽位,不声明 Core member-specific carrier 已闭口。 |
| Runtime committed material | 经专用 Consumer / source port;只承接正式 safe material ref,不接正文。 |
| external source change | 经 owner-specific Consumer;只触发新 snapshot / resolution / gap,不重裁旧事实。 |
| member 已提交事实 | 可形成语义 Outbound Event skeleton;只输出 truth ref / change kind / correlation。 |
| member-specific event carrier | 不在本步闭口;`L2M-UP-005` 继续阻塞 exact event family / route。 |

### 3.4 Context、metadata 与幂等判断

| 接口类别 | 必需语境 | 例外 / 说明 |
|---|---|---|
| Command | `ActorContext`;`CommandMetadata`;`IdempotencyKey` | 系统触发也必须使用 system actor,不得匿名写入。 |
| Query | `ActorContext`;`QueryMetadata` | visibility / scope 仍需检查;Query 不创建 refresh / gap。 |
| external Consumer | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext` | exact field carrier 归 Core / source contract;当前只冻结槽位。 |
| internal committed-fact Consumer | `MemberFactEnvelope`;`MemberFactId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext` | 只接已提交本地事实;exact carrier / outbox mapping 受 `L2M-UP-005` 阻塞。 |
| Job | `JobMetadata`;`JobRunRef`;system / operator `ActorContext`;`IdempotencyKey` | `JobRunRef` 只是设计类型,不记录或声称真实 run_id。 |
| Port | typed request / ref / result / blocked-aware error | 不继承 provider SDK / sibling package type。 |

### 3.5 接口复杂度与拆分取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 一个 `MemberApi` 承担全部读写 | 不采用 | 会压平七个 owner、Command / Query 与状态语义。 |
| 每个 domain method 都升格接口 | 不采用 | 内部 invariant helper 不应成为 transport / use-case contract。 |
| 一个 generic external event consumer / adapter | 不采用 | 会绕过 owner-specific source、schema 和 body gate。 |
| 按七部分附录收敛 | 采用 | 可以逐部分验证对象能力、读写类别和越界。 |
| 将 Port 写成 package dependency | 禁止 | 除 Core compile authority 外,所有 host / Runtime / Bus / owner seam 均为 runtime / event / ref。 |

## 4. 接口命名纪律

- Command 使用动词用例名,例如 `AdmitMemberStartup`;不使用 transport route 名。
- Query 使用 `Get` / `List` / `Read` 语义且保证 no-write。
- Consumer 使用来源事实语义 + `Consumer`,不使用 generic listener。
- Event 使用已提交本地事实的过去式 / 变化语义;不能把 attempt 命名为 delivered / observed / accepted。
- Job 使用 continuation 目的 + `Job`;不能以 Job 名义创建或修复 core truth。
- Port 使用能力边界 + `Port`;Store 使用 owner 数据域 + `Store`,但 method / transaction 留 03。

## 5. 七部分接口发现入口

| 部分 | 主要入口 / continuation | 主要 ports / stores | 重点否决 |
|---|---|---|---|
| CP01 | presence Commands;host feedback Consumer | subject / identity / credential / host ports;presence / host attempt stores | host accepted / healthy 不成为本地输出 |
| CP02 | scope Command;`InboundFactConsumer`;screening Query | event intake / neutral rule-source port;inbound store | raw body、Policy truth、Bus delivery 不入仓 |
| CP03 | Runtime delivery Command;result / material intake | Runtime entry / material ports;mediation store | Runtime admission / run / outcome 不归 member |
| CP04 | outbound evaluation use case;delivery feedback;publication Job | event publication / feedback ports;outbound store | submitted 不等于 delivery / accepted |
| CP05 | committed-fact trace intake;trace Query;observation Job | observation port;trace store | trace / attempt 不等于 observed / evidence |
| CP06 | resolution use case / Query;source updates;refresh Job | owner-specific resolver ports;mirror store | resolved 不等于 authorized / healthy / available |
| CP07 | projection Consumers;member Queries;rebuild / reconcile Jobs | source view ports;projection store | Query / Job 无 core write,outlet 非 registry |

## 6. 当前 pending 对接口的影响

| Pending | 接口层影响 | 当前口径 |
|---|---|---|
| `L2M-UP-001` | host request / feedback carrier、direction、credential mapping | Port / Consumer skeleton 可定义;positive adapter blocked。 |
| `L2M-UP-002` | image handoff / component release | 不形成本仓业务 API;留 implementation supply boundary。 |
| `L2M-UP-003/004` | Runtime entry result / committed material direction 与 mapping | transport-neutral Command / Consumer / Port;exact carrier blocked。 |
| `L2M-UP-005` | member event envelope specialization / route | 语义 Event / Consumer 可点名;schema / type / topic / route blocked。 |
| `L2M-UP-006/007` | credential verification、screening source | owner-specific Port / Consumer;unknown fail closed。 |
| `L2M-UP-008` | execution subject | 所有正向 Command / Query 只接受 `ProjectMemberRef`;其他主语 blocked。 |

## 7. 接口分类与归属汇总

### 7.1 分类总表

| 类别 | 数量 | CP01~07 分布 | 正式名称 |
|---|---:|---|---|
| Command API | 10 | 4 / 2 / 2 / 0 / 0 / 2 / 0 | `AdmitMemberStartup`;`EstablishMemberPresence`;`TransitionMemberPresence`;`PrepareHostCollaboration`;`EstablishSubscriptionScope`;`ReplaceSubscriptionScope`;`SubmitScreenedFactToRuntime`;`LinkRuntimeAdmissionResult`;`ResolveExternalContext`;`RequestExternalContextRefresh` |
| Query API | 16 | 2 / 2 / 2 / 2 / 3 / 2 / 3 | `GetMemberPresence`;`GetHostCollaborationPosture`;`GetCurrentSubscriptionScope`;`GetScreeningDisposition`;`GetRuntimeMediationPosture`;`GetRuntimeMaterialReception`;`GetOutboundDecision`;`GetPublicationPosture`;`GetInteractionTrace`;`ListInteractionGaps`;`GetObservationPosture`;`GetExternalContextResolution`;`ListExternalContextGaps`;`GetMemberSummary`;`GetCapabilityOutlet`;`GetMemberDiagnostics` |
| Inbound Event Consumer | 14 | 1 / 1 / 1 / 2 / 2 / 5 / 2 | `HostFeedbackConsumer`;`InboundFactConsumer`;`RuntimeMaterialConsumer`;`RuntimeMaterialReceptionConsumer`;`DeliveryFeedbackConsumer`;`MemberCommittedFactConsumer`;`ObservationFeedbackConsumer`;`SubjectIdentityContextUpdateConsumer`;`PolicyContextUpdateConsumer`;`RuntimeBoundaryContextUpdateConsumer`;`CapabilityContextUpdateConsumer`;`HostRouteContextUpdateConsumer`;`MemberProjectionUpdateConsumer`;`CapabilityOutletSourceUpdateConsumer` |
| semantic Outbound Event | 24 | 3 / 3 / 4 / 4 / 4 / 2 / 4 | 七附录 §4 中的 `Member*` 已提交事实语义;exact type / source / subject / payload / route 未闭口 |
| Operations Job | 5 | 0 / 0 / 0 / 1 / 1 / 1 / 2 | `PublicationRelayJob`;`ObservationRelayJob`;`ExternalContextRefreshJob`;`MemberProjectionRebuildJob`;`GapReconciliationJob` |
| unique Port / Store | 30 | 6 / 4 / 4 / 3 / 3 / 6 / 4 | 23 个 inward / source / read port + 7 个 store;CP06 另有 1 行显式复用 CP01 source ports,不重复计数 |

24 个 semantic Outbound Event 只冻结业务语义和最小 ref 方向。它们不是已存在的 Core schema、Bus topic、route 或已完成 integration;`L2M-UP-005` 解除前不能激活 carrier。

### 7.2 七部分接口归属与对象能力覆盖

| 部分 | 对象能力承接 | 接口分类结论 | 停审 |
|---|---|---|---|
| CP01 Presence / Host | `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt` 由 4 Commands / 2 Queries / feedback Consumer / 3 Events承接;`PresenceAdmissionPolicy` 只由 application use case 调用 | host request / feedback 与 local presence分离,无 container lifecycle接口 | pass / stop_review |
| CP02 Inbound | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision` 由 2 Commands / 2 Queries / 1 Consumer / 3 Events承接;两 policy不暴露为 bypass API,rule-source update归CP06 | formal envelope触发筛选,raw body仅瞬时检查 | pass / stop_review |
| CP03 Runtime Mediation | 4 个事实对象由 2 Commands / 2 Queries / material Consumer / 4 Events承接;`RuntimeMediationPolicy` 保持内部 invariant | entry submission、late result link、committed material reception分层 | pass / stop_review |
| CP04 Outbound | 5 个对象由 committed-fact Consumer、feedback Consumer、2 Queries、relay Job与4 Events承接 | 无任意发布 Command;submitted不升级 delivery / accepted | pass / stop_review |
| CP05 Interaction Trace | 5 个对象由 committed-fact / feedback Consumers、3 Queries、relay Job与4 Events承接 | 无任意 trace append Command;trace / observed / evidence分层 | pass / stop_review |
| CP06 External Mirror | 4 个对象由 2 Commands / 2 Queries / 5 owner-specific Consumers / refresh Job与2 Events承接 | resolve write与read分离;无 generic source hub | pass / stop_review |
| CP07 Member Read Model | 5 个对象由 3 Queries / 2 Consumers / 2 Jobs与4 Events承接 | 无 core write Command / port;projection可重建,outlet非授权 | pass / stop_review |
| Total | Step 6 的 34/34 对象或对象能力均有 use-case / read / continuation 承接;policy对象不被误升格为公共 API | 无无人承接接口、悬空对象能力或隐藏第八部分 | pass |

### 7.3 actor、metadata、envelope 与幂等审计

| 审计面 | 覆盖 | 结论 |
|---|---|---|
| 10 Commands | 每个输入均显式含 `ActorContext`、`CommandMetadata`、`IdempotencyKey` | pass;system trigger也不得匿名写入 |
| 16 Queries | 每个输入均显式含 `ActorContext`、`QueryMetadata` | pass;全部 no-write,不会隐式 refresh / rebuild / reconcile |
| 10 external Consumers | 每个输入均显式含 `EventEnvelope`、`SourceEventId`、`SchemaVersion`、`DeduplicationKey`、`TraceContext` | pass;source / version / duplicate / body gate可落到03继续展开 |
| 4 internal committed-fact Consumers | 每个输入均显式含 `MemberFactEnvelope`、`MemberFactId`、`SchemaVersion`、`DeduplicationKey`、`TraceContext` | pass;只接已提交 local facts,logical carrier仍 blocked by `L2M-UP-005` |
| 5 Jobs | 每个输入均显式含 `JobMetadata`、`JobRunRef`、system / operator `ActorContext`、`IdempotencyKey` | pass;只定义类型骨架,未记录真实 run_id / result |

### 7.4 依赖类型与 pending 审计

| 依赖类别 | 接口表达 | 审计结论 |
|---|---|---|
| compile | 仅 Core shared primitive / authority候选 | 唯一 package dependency候选;member-specific Core type仍 pending |
| runtime | host、Runtime entry、credential verification、owner source、refresh / handoff ports | 均为 inward port,不是 sibling package dependency |
| event | inbound、feedback、publication、observation与 semantic event | route / delivery / retry / accepted / observed truth外置 |
| ref | Work、Identity、Governance、Runtime、Tools、Method、Conversation / downstream typed refs | 只传 ref / safe category / digest,不复制正文或转移 owner |
| adapter | 每个 owner / carrier 的 adapter候选 | 留03;禁止 generic external adapter |
| fake | Step 7 未定义 fake contract | 后续测试替身必须标 fake,不得伪装 positive integration |
| persistence | 七个 owner store interface | 是本仓内部持久化边界,不是外部 package dependency;schema / transaction留03 |

`L2M-UP-001~008` 均已映射到相应 Port / Consumer / Event / typed-ref 槽位。它们继续阻塞 exact carrier、schema、route、adapter activation、正向 integration与后续 evidence / readiness,但不造成 Step 7 内部接口归属冲突。

## 8. Step 8 处理流覆盖清单

| 部分 | 必须独立展开 | 可复用 / 合并路径 | 原因 |
|---|---|---|---|
| CP01 | 4 Commands;`HostFeedbackConsumer` | `GetMemberPresence`走通用只读路径;`GetHostCollaborationPosture`单列复杂 Query | P0 local truth、external submission与feedback link |
| CP02 | 2 Commands;`InboundFactConsumer` | `GetCurrentSubscriptionScope`走通用只读;`GetScreeningDisposition`单列安全 Query;Governance rule update由CP06 owner flow承接 | scope revision、transient body与neutral rule-resolution读取边界 |
| CP03 | 2 Commands;`RuntimeMaterialConsumer` | `GetRuntimeMaterialReception`走通用 body-free read;`GetRuntimeMediationPosture`单列复杂 Query | decision / attempt / result / reception四层分离 |
| CP04 | `RuntimeMaterialReceptionConsumer`;`DeliveryFeedbackConsumer`;`PublicationRelayJob`;`GetPublicationPosture` | `GetOutboundDecision`走通用只读 | local commit、external side effect与多层 publication posture |
| CP05 | `MemberCommittedFactConsumer`;`ObservationFeedbackConsumer`;`ObservationRelayJob`;安全 trace Query | `GetObservationPosture`走通用 posture read;trace / gap Queries可共享一个明确分支图 | committed-only、no rollback、body-free与observed边界 |
| CP06 | 2 Commands;5 个 owner-specific source Consumers;`ExternalContextRefreshJob`;`GetExternalContextResolution` | `ListExternalContextGaps`走通用只读;五个 Consumer可共享骨架但必须逐一标出 owner差异 | support write、append-only refresh与neutral resolution |
| CP07 | 2 Consumers;2 Jobs;3 个 projection Queries | Queries共享 projection read骨架但必须逐接口标出 not-ready / stale / optional差异 | freshness、rebuildability、gap closure与non-authorizing outlet |

Step 8 还必须提供通用 Command / Query / Consumer / Job 结构骨架,并在每个图中使用 `TypeName parameter_name` 点名关键函数参数。任何未画独立图的接口都必须在覆盖清单中说明复用路径,不得用“简单”作为遗漏理由。

## 9. 跨接口一致性审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 分类完整且名称唯一 | pass | 10 Commands、16 Queries、14 Consumers、24 Events、5 Jobs无重名或未分类入口 |
| Command / Query读写语义 | pass | write均有actor / metadata / idempotency;Query均no-write |
| Consumer authority与幂等 | pass | 10 external source Consumers与4 internal committed-fact Consumers分型,均有identity / schema / dedup / trace槽位;Governance rule source只由CP06拥有 |
| Job边界 | pass | 只做relay / observation / refresh / rebuild / reconciliation,不创建或修复core / external truth |
| 对象能力承接 | pass | Step 6的34/34对象或policy能力均有明确接口或内部use-case位置 |
| 跨组成部分方向 | pass | CP01~06 committed facts单向进入Trace / Read;CP07无反向write;CP04只接CP03 accepted reception |
| truth与状态分层 | pass | submitted != accepted / delivered / observed / completed;resolved != authorized / healthy / available |
| forbidden body | pass | raw body、hidden reasoning、secret、definition body、complete log、evidence body均不得持久化或出站 |
| 依赖分类 | pass | compile / runtime / event / ref / adapter / fake / persistence未混写 |
| pending诚实性 | pass | `L2M-UP-001~008` 未被接口名伪装成exact contract或positive integration |
| Step 8可反查 | pass | 所有P0 Command、state-writing Consumer、reliability / consistency Job与复杂 Query已入覆盖清单;CP02无重复rule-source flow |
| 历史污染与非伪造 | pass | 未继承AG-UI、UDS、launch token、固定member event family / route、Rust / supervisord或旧SLA;未声明实现、test、evidence、verdict、signoff、readiness |

## 10. Step 7 最终 gate 与停审

| Gate | 结论 | 说明 |
|---|---|---|
| 七个组成部分逐一停审 | pass | CP01~07均为 `completed / pass / stop_review` |
| 正式接口分类足以承接详细设计 | pass | 输入 / 输出对象骨架、读写性质、owner边界和pending均可反查 |
| 跨接口无 unresolved 冲突 | pass | exact upstream合同仍blocked-aware,但没有本仓可自行关闭的接口冲突 |
| Step 8进入条件 | pass | 处理流覆盖范围已冻结;不得在Step 8新增未讨论接口 |

Step 7 结论为 `completed / pass / stop_review`。下一允许动作是更新 flow / ledger 到 `Step 8 / processing_flows:CP01`,读取 Step 8 规范入口并只创建 CP01 处理流中间产物;Step 8 通过前不得创建 Step 9。
