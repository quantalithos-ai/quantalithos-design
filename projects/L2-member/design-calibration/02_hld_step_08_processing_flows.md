# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-08-24
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标、输入与边界

本步承接 Step 7 的接口骨架、Step 6 的 34 个对象和 Step 5 的七个业务组成部分,把 P0 Command、改写本地状态的 Consumer、影响传播 / 一致性的 Job 与带复杂 freshness / not-ready 边界的 Query 收束为概要级处理流。处理流只点名入口、Application Service、Domain Object / Projection / Store / Port 和结果边界,不展开完整函数链、协议字段、SQL、错误码、重试参数或实现代码。

Step 8 已严格按 `CP01 -> CP02 -> CP03 -> CP04 -> CP05 -> CP06 -> CP07` 串行完成。七个组成部分均已停审，跨处理流总审计通过；不得在 Step 9 之后回改本步，除非后续状态机审计发现可证明的接口或方向冲突。

## 2. Step 内计划

| 顺序 | 模块 | 输出文件 | 状态 | 门禁 |
|---:|---|---|---|---|
| 1 | 通用处理流、选择规则与 Step 8 反查 | 本主控文件 §3~§5 | completed / pass | Command / Query / external Consumer / committed-fact Consumer / Job 的共同边界已收稳 |
| 2 | CP01 Presence / Host | `02_hld_step_08_flows_presence_host.md` | completed / pass | 四个 Command、Host feedback、复杂 posture Query 的流与写后审计通过 |
| 3 | CP02 Inbound | `02_hld_step_08_flows_inbound.md` | completed / pass | scope、fact Consumer 与 screening Query 的流与写后审计通过；rule-source update 归 CP06 |
| 4 | CP03 Runtime Mediation | `02_hld_step_08_flows_runtime_mediation.md` | completed / pass | Runtime entry、late result、material reception 与 posture Query 的流与写后审计通过 |
| 5 | CP04 Outbound | `02_hld_step_08_flows_outbound.md` | completed / pass | committed reception、feedback、relay Job 与 publication posture 的流与写后审计通过 |
| 6 | CP05 Interaction Trace | `02_hld_step_08_flows_trace.md` | completed / pass | committed facts、observation feedback、relay Job 与 trace Query 的流与写后审计通过 |
| 7 | CP06 External Context Mirror | `02_hld_step_08_flows_external_mirror.md` | completed / pass | resolution、refresh、五类 source Consumer 与 resolution Query 的流与写后审计通过 |
| 8 | CP07 Member Read Model | `02_hld_step_08_flows_read_model.md` | completed / pass / stop_review | projection update、outlet update、rebuild/reconcile Job 与三类 Query 的流与写后审计 |
| 9 | 跨处理流总审计与最终 gate | 本主控文件 §7~§10 | completed / pass | CP01~07 已停审；接口 / 对象 / 流 / 事务与反向写总审计通过 |

## 3. 全局问题回答与处理流选择

### 3.1 通用 Command 写路径

```text
<Command>
  │
  ▼
<Command Boundary>
  - 校验 ActorContext、CommandMetadata、IdempotencyKey、subject 与 scope
  - 解析 typed refs / correlation,不从 display text 推断 owner 或权限
  │
  ▼
<Application Service>
  - 读取当前 local truth 与必要的 neutral external resolution
  - 调用 domain policy / guard,形成 accepted / rejected / blocked decision
  │
  ▼
<Domain Object + Store>
  - 由对象方法追加新 revision / attempt / support fact
  - 在单一本地提交边界内保存 source fact 与必要的 local event candidate
  │
  ▼
<Result / Semantic Event / Continuation>
  - 返回已提交 local result 或 blocked / unknown
  - external side effect、feedback、projection 与 trace 在各自后续流中继续
```

关键设计点：

- Command 的同步语义只保证本仓可证明的本地结果,不把宿主、Runtime、Bus、下游或观测端的 acceptance 伪装成返回值。
- 幂等与 expected revision 在入口 / domain 边界显式处理;duplicate、conflict、unknown 由后续 Step 9 / 10 继续细化。
- 事务、outbox、store 的具体协议留给 03;本步只冻结“本地事实先提交,外部副作用后续”的顺序。

### 3.2 通用 Query 读路径

```text
<Query>
  │
  ▼
<Query Boundary>
  - 校验 ActorContext、QueryMetadata、visibility / subject scope
  - 解析 ProjectionConsistencyHint
  │
  ▼
<Application Query Service>
  - 读取 local store / rebuildable projection
  - 识别 current、stale、degraded、unavailable、unknown
  │
  ▼
<Read Surface Assembler>
  - 只组装 body-free refs、safe categories、watermark 与 freshness
  │
  ▼
<Query Result>
  - 返回 view / page 或显式 not-ready / unavailable
```

Query 不打开隐式写事务,不触发 refresh、rebuild、gap repair 或外部 resolver。带 posture、fallback、projection-not-ready 或 external-truth 分层的 Query 在所属附录单独画图;简单投影读取只引用本通用路径。

### 3.3 外部 Event Consumer 路径

```text
<External Event / Feedback>
  │
  ▼
<Owner-specific Consumer>
  - 验证 EventEnvelope、SourceEventId、SchemaVersion、DeduplicationKey、TraceContext
  - 执行 source / version / body / duplicate gate
  │
  ▼
<Application Incorporation Service>
  - 把外部事实转换为 typed ref、snapshot、feedback link 或 gap
  - late / duplicate / conflict 只追加分类事实,不覆盖既有 source truth
  │
  ▼
<Local Domain Record + Store>
  - 提交本仓可归属的 support / link / gap fact
  │
  ▼
<Projection / Semantic Event Candidate>
  - 只从 committed local fact 派生;不声明外部 delivery / acceptance / health
```

### 3.4 本仓 committed-fact Consumer 路径

```text
<Committed Member Fact>
  │
  ▼
<Local Fact Consumer>
  - 验证 MemberFactEnvelope、MemberFactId、SchemaVersion、DeduplicationKey、TraceContext
  - 确认 fact 已提交且 source ref / watermark 可回链
  │
  ▼
<Application Propagation Service>
  - 追加 trace link、projection stale marker 或下游 preparation fact
  - 不复制 source body,不回滚 source commit
  │
  ▼
<Trace / Projection / Handoff Store>
  - 保存本地派生事实或 gap
  │
  ▼
<Semantic Event Candidate / Read Surface>
```

`MemberFactEnvelope` 是 transport-neutral 逻辑槽位,不等于 Core 已闭口的 member-specific carrier;exact outbox mapping 继续受 `L2M-UP-005` 阻塞。

### 3.5 通用 Operations Job 路径

```text
<Operations Job>
  │
  ▼
<Job Boundary>
  - 校验 JobMetadata、JobRunRef、system / operator ActorContext、IdempotencyKey
  - 读取已提交 facts、gaps、watermark 或 prepared attempts
  │
  ▼
<Application Continuation / Reconciliation Service>
  - 形成新 local revision、successor gap、relay attempt 或 projection revision
  - unknown side effect 进入 blocked / unknown,不猜测补齐
  │
  ▼
<Domain Object / Projection / Port>
  - 只追加本仓拥有的事实或调用明确 external seam
  │
  ▼
<Job Result>
  - completed / waiting / blocked / degraded / unknown 的设计面
```

Job 不能创建、修复或覆盖 Core / Runtime / Host / Bus / Conversation / Artifact / Observability truth,也不能把真实 `run_id`、测试结果或 evidence 写入本校准材料。

## 4. Step 8 处理流覆盖清单

| 部分 | 独立处理流范围 | 通用 / 合并路径 | 选择原因 |
|---|---|---|---|
| CP01 | 4 Commands、`HostFeedbackConsumer`、`GetHostCollaborationPosture` | `GetMemberPresence` 使用 §3.2 | P0 presence / handoff、feedback link 与 host truth 分层 |
| CP02 | 2 Commands、`InboundFactConsumer`、`GetScreeningDisposition` | `GetCurrentSubscriptionScope` 使用 §3.2；Governance rule-source update 由 CP06 owner flow 承接 | transient body、scope revision、neutral rule resolution 会改变主线 |
| CP03 | 2 Commands、`RuntimeMaterialConsumer`、`GetRuntimeMediationPosture` | `GetRuntimeMaterialReception` 使用 §3.2 | Runtime admission / result / reception 不得压平 |
| CP04 | `RuntimeMaterialReceptionConsumer`、`DeliveryFeedbackConsumer`、`PublicationRelayJob`、`GetPublicationPosture` | `GetOutboundDecision` 使用 §3.2 | external side effect 与 delivery posture 需要独立边界 |
| CP05 | `MemberCommittedFactConsumer`、`ObservationFeedbackConsumer`、`ObservationRelayJob`、`GetInteractionTrace` / `ListInteractionGaps` | `GetObservationPosture` 使用 §3.2 | committed-only trace、body-free observation 与 observed truth 分离 |
| CP06 | 2 Commands、5 个 owner-specific source Consumers、`ExternalContextRefreshJob`、`GetExternalContextResolution` | `ListExternalContextGaps` 使用 §3.2 | source-specific support write、append-only refresh、neutral resolution |
| CP07 | `MemberProjectionUpdateConsumer`、`CapabilityOutletSourceUpdateConsumer`、2 Jobs、3 个 projection Queries | 两个 Consumer 都消费已提交 local facts；各 Query 共享读骨架,但需标明 not-ready / stale / optional差异 | freshness、rebuildability、outlet non-authorizing |

任何未单独成图的接口都必须在所属附录说明复用 §3.2 或同一处理流的理由;不得以“简单”作为省略依据。

## 5. 处理流层级与函数参数规则

| 层级 | 本步允许点名 | 本步禁止下沉 |
|---|---|---|
| Entry / Consumer / Job | API、Consumer、Job、Actor / metadata / envelope 槽位 | HTTP / RPC / UDS、topic、完整 carrier schema |
| Application | Service、policy / guard、projection builder、continuation service | 完整函数调用链、handler 框架、调度器实现 |
| Domain / Store / Port | 对象方法、store / port 角色、事务内外的大体边界 | SQL、DDL、完整 repository method、provider SDK |
| Result | local result、semantic event candidate、projection、gap、blocked / unknown | delivered / accepted / observed / evidence 的外部结论 |

处理流中出现函数调用时，参数必须写成 `TypeName parameter_name`；无参数函数可使用空参数列表。各附录只写能改变概要边界的少量调用。

## 6. 当前 pending 与处理流影响

| Pending | 影响的处理流 | 本步口径 |
|---|---|---|
| `L2M-UP-001` | CP01 host collaboration、CP06 host-route context、CP04 feedback | 只画 transport-neutral port / ref 分支;正向 carrier blocked。 |
| `L2M-UP-002` | CP01 宿主装配前置 | 不画 image build / lifecycle flow;只保留 pinned entry pending 注记。 |
| `L2M-UP-003` | CP03 Runtime entry / result | 只画 decision -> attempt -> port -> optional link;不画 run creation。 |
| `L2M-UP-004` | CP03 material、CP04 outbound、CP05 observation | committed / body-free ref gate;source direction / route pending。 |
| `L2M-UP-005` | 所有 external / internal event flow | envelope / semantic event 只画逻辑槽位;不声明 exact type / route / integration。 |
| `L2M-UP-006/007` | CP01 admission、CP02 screening、CP06 resolution | missing / stale / conflict / unknown 统一 fail closed 或 blocked。 |
| `L2M-UP-008` | CP01~CP07 subject-bearing flow | 正向只接受 `ProjectMemberRef`;未定义主语停在 blocked。 |

## 7. 跨处理流总审计

### 7.1 接口、对象与处理流覆盖

| 审计面 | 结论 | 证据与边界 |
|---|---|---|
| 10 Commands | pass | Step 7 分类总表中的 10 个 Command 均在 CP01、CP02、CP03、CP06 附录或通用 Command 路径中有入口、local commit 与 blocked / unknown 结果。 |
| 16 Queries | pass | 16 个 Query 均有所属附录独立流或明确复用 §3.2；projection 三 Query 的 not-ready / stale / optional 差异已展开。 |
| 14 Consumers | pass | 10 个 external Consumer 走 §3.3；4 个 internal committed-fact Consumer 走 §3.4；无重复 Governance rule-source owner。 |
| 5 Jobs | pass | `PublicationRelayJob`、`ObservationRelayJob`、`ExternalContextRefreshJob`、`MemberProjectionRebuildJob`、`GapReconciliationJob` 均独立成流。 |
| 24 semantic Events | pass | 事件只从 committed local fact / projection candidate 派生；exact carrier / route 继续受 `L2M-UP-005` 阻塞。 |
| Step 6 对象 | pass | 34/34 对象均在至少一个处理流、Query、Job 或 policy 骨架中被引用；无孤儿对象。 |

### 7.2 唯一 source owner 与方向审计

| 事实族 | 唯一 source owner | 允许的下游方向 | 禁止方向 |
|---|---|---|---|
| Governance rule source | CP06 `PolicyContextUpdateConsumer` / Mirror resolution | CP02 通过 `ScreeningRuleSourcePort` 读取 neutral resolution | CP02 不接第二个 rule Consumer，不写 Governance truth |
| Tools / Method capability source | CP06 `CapabilityContextUpdateConsumer` / Mirror resolution | CP07 消费 committed capability resolution / gap，形成 outlet projection | CP07 不直接消费 source event，不复制 definition / registry |
| CP01~06 member facts | 各自 owner Consumer / Command | CP05 trace、CP07 projection、语义 Event | CP05 / CP07 不回写 source owner |
| publication / observation feedback | CP04 / CP05 各自 feedback Consumer | gap / posture / projection propagation | Read Model 不关闭 source gap |

### 7.3 事务与外部副作用审计

```text
local validation
  -> local domain revision / support fact commit
  -> local semantic-event candidate / projection marker
  -> external port or downstream continuation
  -> feedback / observation / projection refresh
```

- Command、external Consumer 与 internal committed-fact Consumer 都先提交本仓可证明事实；外部 host、Runtime、Bus、Conversation、Tools、Method、Observability side effect 不进入同步成功语义。
- Query 是 no-write；不会隐式触发 refresh、rebuild、gap reconciliation、resolver 或外部副作用。
- Job 只能追加本仓 continuation / projection revision 或调用明确 port；未知副作用保持 `blocked / unknown`，不猜测补齐。

### 7.4 依赖分类、pending 与 forbidden-body 审计

| 审计面 | 结论 |
|---|---|
| compile / runtime / event / ref / adapter / fake | pass；只有 Core shared primitive 是 compile 候选，其余按 runtime、event、ref、adapter、fake 分列。 |
| `L2M-UP-001~008` | pass；exact carrier、schema、route、subject、adapter、positive integration 与 evidence / readiness 仍为 pending / blocked。 |
| forbidden body | pass；raw inbound body、LLM output、hidden reasoning、tool / method definition body、secret、complete log、evidence body 不进入对象、事件或 projection。 |
| 反向写 | pass；CP05 / CP07 / Mirror / Query / Job 不修改 Core、Runtime、Host、Bus、Conversation、Artifact、Governance、Tools、Method 或 Observability truth。 |

### 7.5 Step 9 反查与最终 gate

| Gate | 结论 | 说明 |
|---|---|---|
| CP01~07 逐部分停审 | pass | 七个附录均为 `completed / pass / stop_review`。 |
| 接口 / 对象 / 流覆盖 | pass | 10 / 16 / 14 / 24 / 5 与 34/34 覆盖一致。 |
| source owner 唯一且方向无环 | pass | CP06 承接外部 source update，CP07 只消费 committed resolution；无 CP07→CP01~06 反向写。 |
| 外部副作用与本地事务边界 | pass | local commit 先于 continuation；unknown / blocked 显式。 |
| Step 9 进入条件 | pass | Step 8 的处理流、覆盖、依赖与非伪造审计全部通过。 |

Step 8 结论为 `completed / pass / stop_review`。下一允许动作是更新 flow / ledger 到 `Step 9 / state_machines:CP01`，读取 Step 9 对应 SOP 与书写规范并创建 Step 9 中间产物；未经本步收口不得进入 Step 10。
