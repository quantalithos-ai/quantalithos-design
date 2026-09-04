# 02 概要校准 Step 12：详细设计承接清单

> 状态：completed / pass
> 日期：2026-08-24
> 前序门禁：Step 11 completed / pass
> 本步目的：把 Step 4~11 已收稳的概要主语和边界交付给 `03-详细设计.md`，明确继续展开方向与回退规则；不新增对象、接口、流程或状态

## 1. Step 开工确认与计划

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes；概要设计 SOP Step 12、书写规范 §4.12、详细设计承接与回退规则已复核 |
| 已读取项目输入 | yes；Step 4~11 全部校准产物、正式 00 / 01、上游 blocker 注册表和历史 03 污染审计已复核 |
| 当前 Step | Step 12：详细设计承接清单 |
| 本 Step 输出 | `design-calibration/02_hld_step_12_detailed_design_handoff.md` |
| 正式文档写入 | forbidden；Step 14 前旧正式 02 仍为 historical_material |
| 历史 03 效力 | historical_material only；不得继承其 worker、RuntimeAction、CapabilityMount、ToolExecution、SandboxExecution、固定协议 / 产品 / schema 或实现证据 |
| 并行兄弟效力 | `L2-member`、`L2-member-images` 讨论不改变本仓承接清单；exact contract 继续 placeholder / pending |
| 下一 Step | blocked；本步 completed / pass 前不得创建 Step 13 |

- [x] 列出已由概要设计冻结的业务主要组成部分、实现层和运行角色。
- [x] 列出 29 个对象、`IB-MS-001~017`、关键处理流和状态轴的承接方向。
- [x] 列出 03 应继续展开的字段、函数、事务、协议、异常、配置和测试契约。
- [x] 区分稳定输入、条件输入和不能写入承接清单的未闭环项。
- [x] 建立概要设计回退规则与历史污染排除表。
- [x] 完成 Gate 自检并更新 flow / project ledger。

## 2. 承接原则与输入效力

### 2.1 稳定输入

以下结论已由 Step 4~11 收稳，03 可以直接作为结构输入：

- 七个业务主要组成部分 `CMP-MS-01~07` 及各自 owner / 非职责边界。
- 外部边界、Inbound / Operations、Application Services、Domain / Policies、Ports、Persistence / History、Projection / Outbox、Adapters / Wiring 的实现分层。
- `ProjectMemberRef` 执行主语与一致 `GlobalMemberRef` 身份锚；当前范围只支持项目型主语。
- 29 个关键对象的归属、最小字段类别、状态适用性和禁止事项。
- `IB-MS-001~017` 的 Command / Query / Consumer / Event / Job / Port 分类、owner 和 local result ceiling。
- local-first、expected revision、immutable generation、single-active、stable effect / publication / handoff key、unknown / gap / late fence。
- Query no-write、Consumer 不隐式创建 lifecycle decision、Job 不隐式创建 action / decision、Projection 不反写 source。
- 外部 truth 只以 typed ref、safe snapshot、freshness、redacted marker、body-free material 或允许 outcome 进入。
- 异常的 `rejected / conflict / waiting / blocked / stale / late / unknown / gap / residual` 语义与七个组成部分落点。
- 配置只影响 runtime wiring、entry、Consumer、Job、adapter、store、projection、publisher、handoff 和 safe read surface；domain / policy 不直接读配置。

### 2.2 条件输入

以下内容只有在对应双侧正式合同闭口后才能从 placeholder 细化：

| 条件输入 | 当前概要上限 | 03 的安全写法 |
|---|---|---|
| Runtime entry / Host Session / execution handoff | host-side port 与 session shell | 先写 boundary interface / blocked result；不得造 Runtime run、checkpoint 或 exact envelope。 |
| Member launch / register / heartbeat / status | request / signal owner 分工 | 只写 source mapping、safe summary 和 matching local consumer；字段 / IPC / credential context pending。 |
| Images pinned supply | pinned ref / qualification direction | 只承接 typed supply ref；manifest / variant / provenance / confirmation schema pending。 |
| SandboxBinding bind / release / cleanup | host-side association与 no-fallback | 只写 adapter / ref port；caller、receipt、failure contract pending。 |
| launch credential | instance-bound、revocable、可验证 safe ref | 不写签发、撤销、secret body 或 owner 实现。 |
| Core / Bus event family | shared category / carrier boundary | exact ID、envelope、route、receipt、version 留双侧合同。 |
| SDK compile target / Server self-test | limited compile / fake seam | 不声明准确 target、编译结果、测试结果或 evidence。 |

### 2.3 不能伪装成承接输入的材料

- 历史正式 `03-详细设计.md`、旧 README、旧 `05/06` 和 `draft/` 不能提供当前对象、接口、状态或实现依据。
- sibling WIP、fake、adapter availability、局部 receipt、observed signal、日志或“ready”草稿不能关闭 `MSVC-UP-001~008`。
- 本承接清单不包含开发任务、排期、测试用例全集、实施指令、commit、run_id、artifact、report、verdict、signoff 或 readiness 证据。

## 3. 业务主要组成部分与实现分层承接

| 已由概要设计收稳 | 03 继续展开 |
|---|---|
| `CMP-MS-01` Host intent and orchestration decision | command entry mapping、application service boundary、intent / decision repository、scope / idempotency / expected-revision guard、local transaction 与 history / material marker。 |
| `CMP-MS-02` Host qualification and assembly | resolver port mapping、qualification context / assembly / readiness write model、required item evaluation、freshness / no-fallback guard、blocked / waiting error surface。 |
| `CMP-MS-03` Host instance and carrier progression | generation fence、host / attempt / association repository、local-first UoW、carrier / registry / binding adapter seam、unknown-effect reconciliation hook。 |
| `CMP-MS-04` Registration and Host Session | registration acceptance mapping、endpoint / session uniqueness constraint、credential qualification seam、Runtime / Member placeholder contract adapter、replacement / invalidation transaction。 |
| `CMP-MS-05` Host health and recovery | signal envelope mapping、snapshot dedup / order guard、assessment revision、four-axis health evaluation、explicit recovery decision and action handoff。 |
| `CMP-MS-06` Host closure and reconciliation | closure invalidation ordering、cleanup attempt / release port、residual finding / reconciliation case transitions、local vs external completion mapping。 |
| `CMP-MS-07` Host fact handoff and safe consumption | immutable material formation、outbox / handoff persistence、per-target feedback matching、projection cursor / rebuild、safe query visibility / freshness contract。 |
| Inbound / Operations / Application / Domain / Ports / Persistence / Projection / Adapter 双轴 | 具体 runtime builder、dependency injection、repository / UoW、port implementation and fake seam、entry / Consumer / Job wiring；不得把技术角色改写为业务组成部分。 |
| 三个逻辑运行角色：同步权威受理、后台生命周期推进、异步信号 / 维护 | 进程 / worker / scheduler 的实现选择、lease、batch、concurrency、failure isolation；不把运行角色写成新的 HostStatus。 |

## 4. 29 个关键对象承接清单

### 4.1 CMP-MS-01~03

| 对象 | 03 继续展开 | 必须保留的边界 |
|---|---|---|
| `HostIntent` | 完整字段约束、受理 / replay / conflict repository、command result mapping | 不拥有 Work / Identity / authorization truth。 |
| `HostOrchestrationDecision` | decision action、supersedes / voided relation、expected revision、UoW | 不表示 external action completed，不与 recovery decision 合并。 |
| `HostControlPolicy` | policy input、scope / principal guard、拒绝原因模型 | 不读取原始配置，不取得 Governance truth。 |
| `HostQualificationContext` | source resolution、freshness、gap / conflict mapping、revision | 不复制外部正文或成为 source owner。 |
| `HostAssembly` | required item set、item outcome、assembly revision、progression write path | complete 不自动等于 readiness ready。 |
| `HostReadinessDecision` |共同资格判定、blocked / waiting / failed / unknown result、transition guard | 不由 registration、heartbeat、backend 或 projection 反推 ready。 |
| `RequiredQualificationPolicy` | required set、freshness / no-fallback evaluator interface | 不变成 policy transmission owner；未闭口来源保持 pending。 |
| `MemberExecutionHost` | immutable generation、current pointer、lifecycle transition、predecessor / supersedes refs | 不等于 container / backend resource、Runtime run 或 Member 主体。 |
| `HostActionAttempt` | effect key、prepared / dispatched / outcome persistence、unknown fence | local attempt 不等于 external completion；Job 不创建新 decision。 |
| `HostExternalAssociation` | typed ref、association / release outcome、generation matching、stale / unknown | 不拥有 backend、registry 或 Sandbox truth。 |
| `HostGenerationFence` | current uniqueness、CAS / expected revision、late-result rejection | 不作为独立业务生命周期对象或全局状态。 |

### 4.2 CMP-MS-04~05

| 对象 | 03 继续展开 | 必须保留的边界 |
|---|---|---|
| `HostRegistration` | input fingerprint、source / credential / generation validation、replacement history | Member request truth 外置；accepted 不等于 ready。 |
| `HostEndpoint` | safe endpoint material、current uniqueness、stale / invalidation handling | 不返回 raw endpoint / secret；endpoint active 不等于 healthy。 |
| `HostSession` | association refs、session revision、pending / blocked / stale / closed mapping | 只是 host-session 壳，不是 Runtime run / checkpoint。 |
| `RegistrationSessionPolicy` | active uniqueness、replay、credential binding、replacement guard | 不拥有 credential authority 或 Runtime truth。 |
| `HealthSignalSnapshot` | source / time / sequence / generation validation、dedup / late classification | 不直接写 assessment healthy 或 recovery decision。 |
| `HostHealthAssessment` | revision、four-axis values、uncertainty basis、supersede / invalidate | `degraded` 等为 health-axis value，不新增 record lifecycle state。 |
| `HostFailureClassification` | candidate / confirmed / withdrawn / unknown basis、source mapping | 不代表业务或 Runtime failure。 |
| `HostRecoveryDecision` | explicit control input、action disposition、supersede / void guard | 不与 orchestration decision 合并，不声明 action executed。 |

### 4.3 CMP-MS-06~07

| 对象 | 03 继续展开 | 必须保留的边界 |
|---|---|---|
| `HostClosure` | invalidation ordering、cleanup-pending、residual / blocked / unknown transition、local closure commit | locally-closed 不等于 external cleanup completed。 |
| `CleanupAttempt` | cleanup effect key、dispatch / outcome / gap、unknown fence、matching feedback | 不与 HostActionAttempt 合并，不盲换 key 重放。 |
| `ResidualFinding` | finding basis、disputed / confirmed / resolved relation、safe observation mapping | 不自动修复外部资源或 sibling truth。 |
| `ReconciliationCase` | case aggregation、holding / escalated / resolution basis、explicit action marker | Job 不隐式创建 lifecycle decision。 |
| `HostFactMaterial` | committed-change source refs、body-free validator、redaction / immutable formation | 不含 secret、外部正文、delivery / acceptance 结果。 |
| `HostHandoffRecord` | per-target handoff key、attempt / gap / feedback layer、closed / unknown handling | delivery、observation、acceptance 三层独立。 |
| `SafeHostView` | safe slice composition、visibility、source revision、freshness marker | immutable read snapshot；Query 不 refresh / repair。 |
| `HostProjectionState` | cursor、revision、apply / rebuild、fresh / stale / degraded / unavailable | 不反写 CMP-MS-01~06，不以 broker offset定义领域 truth。 |
| `HostOutboxRecord` | source-material binding、publication key、attempt / submitted / gap / unknown、close | submitted 不等于 delivered / observed / accepted。 |
| `HostHistoryEntry` | append-only schema、prior / supersedes / correlation chain、body-free audit | 不原地改写或删除，不成为 command source。 |

对象承接结论：03 不得新增第 30 个业务对象来承接“worker、capability mount、execution handle、Runtime action、Sandbox run、external report”之类历史主语；这些名称要么被当前边界排除，要么只能作为字段类型 / external ref / adapter result。

## 5. 接口与处理流承接清单

### 5.1 `IB-MS-001~017`

| 接口族 | 已冻结接口 / writer | 03 继续展开 | 条件 / blocker |
|---|---|---|---|
| `IB-MS-001` | `AcceptHostIntentCommand` | mapping、authorization context、idempotency replay、UoW、error result | 双锚和 source guard 不可配置绕过。 |
| `IB-MS-002` | `DecideHostOrchestrationCommand` | current facts read、decision transition、supersede / conflict、transaction | 不调用 external port，不写 action complete。 |
| `IB-MS-003` | `QueryCurrentHostDecision` | safe read contract、visibility / freshness、source-vs-projection selection | Query no-write；不由查询补决定。 |
| `IB-MS-004` | `ResolveHostQualificationCommand` + source Consumer | resolver adapter mapping、freshness / gap、required-source error taxonomy | Identity / Work stable；Images / credential / Sandbox exact contract pending。 |
| `IB-MS-005` | `CoordinateHostAssemblyCommand` | item freeze、assembly UoW、progression handoff、readiness re-evaluation | 不把 external action synchronous success写成 ready。 |
| `IB-MS-006` | `QueryHostAssemblyReadiness` | safe assembly / readiness view、blocked / stale / unknown response | Query no-write。 |
| `IB-MS-007` | `AcceptHostRegistrationCommandPlaceholder` | registration fingerprint、credential / generation guard、replacement handling | Member / credential exact request pending；placeholder 不能声明 ready。 |
| `IB-MS-008` | `MaintainHostSessionCommandPlaceholder` | endpoint / session uniqueness、association mapping、close / replace | Runtime Host Session contract pending；不创建 Runtime run。 |
| `IB-MS-009` | `QueryHostAccessSession` | safe endpoint / session view、visibility / freshness | 不输出 raw endpoint / secret。 |
| `IB-MS-010` | `HostHealthSignalConsumerPlaceholder` + action outcome Consumer | envelope validation、dedup / order / generation guard、snapshot write | Member / Runtime / Sandbox / carrier / Bus event family pending。 |
| `IB-MS-011` | `QueryHostHealthFailure` | four-axis safe view、uncertainty / stale / unavailable mapping | 不因 Query 重新评估或 recovery。 |
| `IB-MS-012` | `DecideHostRecoveryCommand` | formal control context、decision UoW、action handoff | 不执行 Runtime recovery，不隐式由 signal / Job 创建。 |
| `IB-MS-013` | `CloseHostCommand` | invalidation ordering、cleanup attempt creation、closure UoW | Sandbox / carrier cleanup contract pending。 |
| `IB-MS-014` | `ReconcileHostResidualsJob` | scan selector、finding / case write、stable disposition | Job 不修 sibling / backend truth，不创建 lifecycle decision。 |
| `IB-MS-015` | `QuerySafeHostFacts` / `QueryHostHistory` | safe slice、history cursor、visibility / freshness | no refresh / repair / publish；pagination detail留 03。 |
| `IB-MS-016` | `HostFactMaterialEventCandidate` + `PublishHostFactOutboxJob` | materialization boundary、outbox UoW、publisher adapter、submission result | route / envelope / receipt `MSVC-UP-007` pending。 |
| `IB-MS-017` | cleanup feedback + handoff feedback Consumers | matching key、feedback layer、late / duplicate / unknown、gap | exact feedback contract pending；不推断 delivered / observed / accepted。 |

`IB-MS-E01~E04` 继续作为扩展边界，不进入 03 核心接口分母；若要纳入，必须先回退 Step 2、5、7、8。

### 5.2 关键处理流

03 应按 Step 8 已冻结的流继续展开以下顺序，不得换成历史“allocate -> execute -> callback”主线：

1. intent acceptance -> orchestration decision。
2. qualification source resolution -> assembly -> readiness。
3. generation establishment -> local action attempt -> dispatch -> matching outcome。
4. registration acceptance -> endpoint / Host Session association。
5. signal intake -> health assessment -> failure classification -> explicit recovery decision。
6. close / invalidation -> cleanup attempt -> residual finding -> reconciliation case。
7. committed fact -> immutable material / history -> outbox / handoff -> projection / safe query。

每条流的详细设计应给出：输入类型、writer、读集、domain guard、local transaction / expected revision、external port boundary、outcome mapping、异常语义、history / material / outbox 影响和 05 / 06 测试承接点；不得在概要承接清单中提前写完整调用链或协议 schema。

## 6. 状态、异常与配置承接

| 已冻结主题 | 03 继续展开 | 禁止暗改 |
|---|---|---|
| 正交状态轴，无全局 `HostStatus` | transition function、expected revision、CAS / conflict、history / projection propagation | 不合并 `ready / active / healthy / completed`；不新增万能状态。 |
| generation / single-active / late fence | concurrency model、effect / handoff / publication key、unknown reconciliation hook | 不允许旧 generation 覆盖 current，不以新 key掩盖 unknown。 |
| required qualification fail-closed | resolver outcome taxonomy、assembly evaluator、blocked / waiting error mapping | 不用 fallback、旧缓存、fake 或 sibling WIP 生成 ready。 |
| local / external outcome layering | attempt / gap / submitted / delivery / observation / acceptance mapping | 不把 local receipt、timeout、observed signal写成 external completion。 |
| 28 个异常与四张影响图 | detailed error category、recovery / compensation contract、test matrix | 本步不将异常改成默认重试或静默成功。 |
| 配置影响轮廓 | `RuntimeConfig` / `ConfigLoader` / `ConfigValidator`、`AdapterConfig`、`JobConfig`、`ReadConfig`、`HandoffConfig`、builder injection | 不提前定义 key、默认值、JSON、secret 或让配置绕过红线。 |

## 7. 详细设计继续展开的实现契约方向

| 方向 | 03 应回答 | 当前上限 |
|---|---|---|
| Domain / state | 对象行为、transition guard、revision / conflict、immutable / append-only | 不新增对象 / 状态；仍受上游 blocker 约束。 |
| Application / UoW | use-case mapping、读集 / 写集、local transaction、outbox marker 顺序 | 不伪造跨 owner 分布式事务。 |
| Persistence | repository / store capability、expected version、history / outbox / projection persistence | 不锁数据库产品、表结构或共享 sibling storage。 |
| Ports / adapters | exact function-level boundary、adapter-neutral result、fake / placeholder behavior | 双侧 contract 未闭口时保留 blocked / placeholder。 |
| Public / event contract | Core type mapping、envelope / version / route / receipt | 只有正式 owner 闭口后才能写 exact schema；否则不能单方定义。 |
| Error / recovery | error category、unknown-effect disposition、hold / reconciliation / degraded surface | 不在 02 预支错误码全集、retry 数值或脚本。 |
| Configuration | runtime builder、validation、adapter / job / read / handoff binding | 04 负责可填写配置；03 不写部署参数。 |
| Security / redaction | visibility、forbidden-body validator、secret reference boundary | 不将 raw endpoint / credential / external body带入对象或日志。 |
| Tests / evidence handoff | unit / contract / integration seam、failure matrix、traceability to AC / VF | 不声明任何测试结果、artifact、report、evidence 或 readiness。 |

## 8. 历史 03 污染排除审计

| 历史主语 /做法 | 当前判断 | 承接处理 |
|---|---|---|
| `MemberRuntimeSession`、`WorkerSlot`、`HostLifecycleState` 作为旧核心对象 | 与当前 29 对象集合和 Runtime Session 分层冲突 | 不继承；`HostSession`、`MemberExecutionHost` 和对应字段边界以当前 Step 6 为准。 |
| `CapabilityMount`、`ToolScopeBinding`、`ActorContextBinding` | 会吞并 Tools / capability / Identity truth | 不建立对象；只保留 qualification / safe ref / material 语义。 |
| `RuntimeActionIntake`、`HostDispatchAction`、`ExecutionHandle`、`ToolExecutionHandle` | 会把 Runtime / Tools execution truth迁入本仓 | 不继承；host-side `HostActionAttempt` 仅记录本地 effect attempt。 |
| `SandboxExecutionHandle`、Sandbox policy / capture / cleanup | 会吞并 L4-sandbox isolation truth | 不继承；只使用 host-level binding / release port placeholder。 |
| 直接实现 `ExecuteRuntimeAction`、同步 tool invoke | 越过 Runtime / Tools owner 和 execution handoff | 不进入当前接口或处理流；Runtime entry surface pending。 |
| 固定 Docker / Kubernetes / gRPC / HTTP / 数据库 / topic / 具体数字 | 无当前 authority，属于 historical material | 只保留 product-neutral adapter、依赖类型和配置影响类别。 |
| 旧 callback / report / metrics body 作为本仓 truth | 违反 body-free / external outcome layering | 改为 typed ref、safe summary、material、handoff、projection。 |

## 9. 回退规则

详细设计若发现以下任一主语需要改变，必须暂停 03，并回退到对应概要 Step 修正后再继续：

| 发现的变化 | 必须回退 |
|---|---|
| 需要新增 / 删除业务主要组成部分、改变职责 owner 或引入新执行主语 | Step 2、Step 4、Step 5；必要时回退 00 / 01。 |
| 需要新增 / 合并 / 拆分关键对象 | Step 6，并重新审计 Step 7~10。 |
| 需要新增接口、改变 Command / Query / Consumer / Job / Event / Port 分类或 writer | Step 7、Step 8。 |
| 需要新增状态、合并正交状态轴或改变允许 / 禁止迁移 | Step 9；若改变业务语义则回退 00 / 01。 |
| 需要改变异常 fail-closed、unknown、gap、residual 或跨仓边界 | Step 10，并重新审计 Step 9。 |
| 需要让配置改变 owner、状态、审计、安全或 no-fallback | Step 11，并回退对应约束 / 架构。 |
| 需要接受 Member / Images / Runtime / Sandbox / Bus 单侧未闭口的 exact contract | 停在 blocker 注册表，不能在 03 单方补齐；必要时等待双侧正式停审。 |

回退不是 03 内部的局部重构；任何主语变化都必须产生新的概要校准记录、重新执行受影响跨 Step 审计，并保留旧结论历史。

## 10. 正式第 12 章回填草稿

正式 §12 应使用“已由概要设计收稳 / 详细设计继续展开”表，按七个 CMP、29 个对象、`IB-MS-001~017`、7 条关键处理流、正交状态轴、异常语义和配置方向归纳本文件第 3~7 节。正文必须保留以下回退规则：

> 如果详细设计发现上述主语、对象、接口、流程、状态或 owner 需要变更，说明概要设计尚未真正收稳，必须先回退概要设计对应 Step 修正，不得在 `03-详细设计.md` 中暗改。

历史 03 中与当前边界冲突的 worker / action execution / capability mount / Sandbox execution 内容不作为承接输入。

## 11. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 稳定输入完整 | pass | 主要组成部分、对象、接口、流、状态、异常和配置影响均有承接位置。 |
| 03 继续展开方向 | pass | 字段、函数、UoW、repository、port、schema、error、config、test / evidence seam 均有明确上限。 |
| 未新增主语 | pass | 未新增对象、接口、流程或状态；历史主语仅用于污染排除。 |
| 回退规则 | pass | 主语、owner、对象、接口、状态、异常和配置红线均有明确回退 Step。 |
| 历史材料裁剪 | pass | 旧 03 不被直接继承，冲突内容列为 historical_material。 |
| pending / blocker 保真 | pass_with_blockers | `MSVC-UP-001~008` 与并行 sibling exact contract 继续 pending / blocked / waiting。 |
| 非伪造 | pass | 未写开发任务、排期、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 正式文档写入 | pass | 未修改旧正式 03 或 02；Step 13 尚未创建。 |

```text
step_12_status = completed
step_12_gate = pass
handoff_cross_audit = pass_with_upstream_blockers
formal_02_write_allowed = false
next_allowed_step = Step 13 risks_open_questions
```
