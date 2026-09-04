# Step 7. 定义接口、事件与跨仓同步验收 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 7
> 回填章节：`06-验收标准.md` §7 接口、事件与跨仓同步验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 定义接口、事件与跨仓同步验收 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 6；`03` §7~§8、§13；`04` §7；`05` §3、§6、§13；全局依赖裁剪规则 |
| 输出文件 | `design-calibration/06_acceptance_step_07_interfaces_events_sync.md` |
| 当前模块 | `command_query_protocol`、`consumer_material_job`、`dependency_seams` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 10 Command、6 Query、5 Consumer、1 material helper、7 Job 的接口门禁、依赖类型、下游未就绪和证据闭环均已固定；未伪造 outbound event family 或 sibling ready |
| next_allowed_action | 进入 Step 8，定义状态机、事务与一致性验收 |

### 1.1 Step 内计划

- [x] 读取 Step 6、`03` protocol / flow、`04` binding、`05` TC / EV。
- [x] 回答 Command / Query / Consumer / material / Job 和跨仓依赖问题。
- [x] 诊断旧接口名、transport 绑定和依赖类型误判。
- [x] 选择按协议族分组、按依赖类型验收的方案。
- [x] 产出依赖映射、接口同步表、协议闭环矩阵、下游未就绪裁决、停审和跨接口审计。
- [x] 形成 §7 回填草稿并自检。

## 2. 本步目标

验证本仓所有正式入口和交接接缝的可裁决边界：Command 的 metadata / 幂等 / accepted 写集，Query 的只读与可见性，Consumer 的版本 / 去重 / marker，`HostFactMaterialEventCandidate` 的 immutable material，以及 Operations Job 的 report / no-truth-repair。跨仓验收必须区分 compile、runtime、event、ref、adapter、fake seam，不把运行期协作写成源码依赖。

本仓当前没有已闭合的 outbound event family 数量；只验已提交 `HostFactMaterial` 的 candidate / outbox / publication marker 接缝。Core / Bus route、envelope、receipt 和具体 topic 仍是 pending。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 协议 inventory / metadata / result | `03` §7 | 正式入口名称和结果边界 |
| 函数级处理流 | `03` §8 | accepted / negative / side effect 顺序 |
| 依赖分类 | `01` §11~§12、`03` §13 | compile / runtime / event / ref / adapter / fake 映射 |
| 配置 binding | `04` §3、§7 | topic-neutral / target / availability 资格 |
| 测试用例和证据 | `05` §6、§13 | TC、EV、suite、report 路径 |
| 上游 blocker | `project_execution_ledger.md` | 下游未就绪和正向限制 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个 P0 Command / Query 如何验收？ | 10 个 Command 必须证明 metadata、双锚 / scope、reserve、expected revision、UoW 写集、stored result 和 negative；6 个 Query 必须证明 visible / not-visible / degraded / unavailable / no-write。 | `03` §7.2~§7.3、§8.2~§8.3；`05` TC-CMD / QUERY |
| 每个 P0 Event 如何证明可消费 / 可重放？ | 本仓只对 5 个 Inbound Consumer 和一个 material/outbox candidate 验收；必须证明 version / source / correlation / generation 校验、duplicate receipt / marker replay、unsupported no-parse/no-write。未闭合的 outbound event family 不声明可消费。 | `03` §7.4~§7.5；`05` §6.6~§6.7 |
| 每个 P0 Job 如何证明幂等和恢复？ | 7 个 Job 只能选择已提交 work，保留 stable key / cursor，生成 item report，支持 duplicate replay、partial、unknown、gap；不得创建 intent / decision / generation 或修复核心 truth。 | `03` §7.5、§8.5；`05` TC-JOB / IDEMP |
| 跨仓同步成功标准是什么？ | 本仓成功标准是安全 ref / snapshot / marker / receipt / report 正确落本地，且下游 unavailable 时有 delayed / blocked / unknown / gap。不得以目标外部 accepted 代替本地接缝成立。 | `03` §7.6、§10.4；`05` §2.4 |
| 下游未就绪时如何验接缝？ | 使用 fake、controlled、disabled 或 placeholder seam 验证本地语义；真实正向合同受 `MSVC-UP-001~004/006/007` 限制，保持 blocked / waiting / unavailable，不计为 ready。 | `04` §3、§13；`05` §5.6 |
| 跨仓验收项属于哪些依赖类型？ | `L0-core` / core-contracts 是 compile；Identity / Work / Member / Images / Runtime / Sandbox 是 runtime/ref/event；Bus / Observability 是 event/handoff；容器 / registry / carrier 是 adapter；fake 是测试替身。 | `01` §12；`03` §13.3 |
| 每类依赖用什么证据？ | compile 用 `EV-MS-ARCH-*` / dependency-boundary；runtime 用 adapter failure / safe ref 证据；event 用 consumer receipt / outbox marker；ref 用 body-free contract；adapter / fake 用 controlled suite；均回指固定 report path。 | `05` §13.2、§13.6 |
| 每个接口项能否回指正式字段 / 状态 / TC / EV？ | 可以。§8.3 列出全部正式入口；§8.2、§8.4 规定协议、TC、EV、report 和 blocker。 | 06 书写规范 §5.7 |
| 如何处理未闭合 outbound event family？ | 不创建伪造 event 数量、topic 或 schema；只验 `HostFactMaterialEventCandidate`、`HostOutboxRecord`、publication marker 和 no-recompute 约束。 | `03` §7.5；`05` 明确“不引入伪造 outbound event 数量” |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `06` 功能表 | 把 REST / RPC / callback 当成正式协议，未列 Query、Consumer、Job 和 result disposition | 按 10/6/5/1/7 inventory 分组验收 |
| 旧 `06` 证据 | 写 API response / adapter trace，未说明版本、去重、stored payload 和 report | 增加 protocol / evidence / report 闭环 |
| 历史详细校准 | 曾出现 outbound event 数量猜测或聚合 carrier key | 只使用当前 `03` inventory；outbound family 保持 pending，carrier 仅 availability |
| 依赖描述 | 容易把 sibling path / SDK client 写成运行期源码依赖 | 按 compile / runtime / event / ref / adapter / fake 显式分类 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 入口分母 | 泛化 API / callback | 10 Command、6 Query、5 Consumer、1 material、7 Job | 与 `03`、`05` 一致 |
| 事件口径 | 暗示 outbound event 已 ready | candidate / outbox marker，Core/Bus exact pending | 不伪造共享 schema |
| 依赖类型 | “依赖某仓” | compile / runtime / event / ref / adapter / fake | 适配全局裁剪规则 |
| 失败处理 | 只写调用失败 | delayed / blocked / unknown / gap / no-parse / no-write | 支持可裁决接缝 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否为每个入口建立独立正式 AC | A. 30+ 条逐项正文；B. 按协议族分组并在矩阵列出全部入口 | 采用 B，保持可读性且不丢入口分母 |
| 是否写真实 HTTP/RPC/topic | A. 写具体 route；B. route-neutral / topic-neutral | 采用 B，真实 transport 属配置 / 部署且 exact contract pending |
| 是否要求 sibling 仓完整实现 | A. 要求；B. 只验 seam | 采用 B，本仓只裁决本地边界 |
| 是否将 outbound event family 计入分母 | A. 猜数量；B. 只验 material/outbox candidate | 采用 B，避免伪造未闭合 schema |
| Job 是否允许修复 truth | A. 允许；B. 只推进已提交 marker / report | 采用 B，Job no-truth-repair 是硬边界 |

## 8. 结构化中间产物

### 8.1 跨仓依赖类型与验收方式映射表

| 依赖 / 对方 | 类型 | 协作方式 | P0 验收方式 | 禁止误判 |
|---|---|---|---|---|
| `L0-core` / core-contracts | compile | shared ID / ref / metadata / error 类别 | dependency graph、contract compile、`EV-MS-ARCH-001` | 不得复制或 shadow core schema |
| `L0-sdk` | compile / self-test baseline | 仅按批准 target 消费 | dependency classification | 不把 SDK runtime client 当 host truth 依赖 |
| `L1-identity` | runtime + ref + event | GlobalMember safe ref / freshness | fake resolver、source marker、blocked case | 不验 Identity 正文 |
| `L1-work` | runtime + ref + event | ProjectMember safe ref / allocation summary | subject validation、stale / conflict | 不验 Work truth |
| `L2-member` | runtime + event | registration / heartbeat / status placeholder | safe mapper、replay / late / unavailable | 不验 Member body / IPC product |
| `L2-member-images` | runtime + ref | pinned supply placeholder | opaque ref、availability、no Role→image bypass | 不验 manifest / digest body |
| `L2-runtime` | runtime + ref + event | HostSession / handoff ref | blocked placeholder、layer marker | 不验 run / turn / checkpoint |
| `L4-sandbox` | runtime + ref + adapter | host bind / release / cleanup | required seam no-fallback、unknown | 不验 backend / policy / tool execute |
| `L0-bus` / Observability | event + handoff | material submission / feedback / safe sink | outbox marker、gap、redaction | 不把 receipt 推 delivered / observed |
| container / registry / carrier | adapter | lifecycle / availability marker | controlled failure / fake parity | adapter `Ok` 不等完成 |
| fake seam | test substitute | deterministic local contract | failure injection、replay | fake 通过不等真实 ready |

### 8.2 接口 / 事件 / 同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| `AC-MS-SYNC-001` | 10 Command | 本仓 public / internal protocol | typed metadata + idempotency + UoW | 10 个 Command 均有正式字段、accepted 写集、stored result、negative、duplicate / conflict | 缺入口、metadata / digest / result、accepted partial write、duplicate 重跑 | `EV-MS-CONTRACT-001`;`EV-MS-CMD-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| `AC-MS-SYNC-002` | 6 Query | 本仓 read protocol | safe view + visibility / freshness | 6 个 Query 均覆盖 visible、not-visible、degraded、unavailable、empty 和 no-write | Query 写 truth / projection / reference / report，或泄露 forbidden body | `EV-MS-QUERY-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| `AC-MS-SYNC-003` | 5 Inbound Consumer | event / runtime / ref | versioned envelope placeholder + receipt | 5 个 Consumer 校验 version/source/correlation/generation，支持 duplicate / late / unsupported no-parse/no-write | 解析不支持 payload、保存正文、写 intent / decision / ready / new key | `EV-MS-CONSUMER-001`;`reports/runs/<run_id>/suites/entry-worker-job.md` |
| `AC-MS-SYNC-004` | `HostFactMaterialEventCandidate` + outbox | event / handoff pending | committed material snapshot + marker | material immutable、body-free、source cursor 已提交，publisher 只读 stored payload | 从 current truth 现查现组包、source cursor 未确认、publish failure 回滚 truth | `EV-MS-MATERIAL-001`;`EV-MS-ARCH-001`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| `AC-MS-SYNC-005` | 7 Operations Job | job / adapter / handoff | selector + item report | 7 个 Job 只推进已提交 work，保留 key/cursor，partial / unknown / replay 可审计 | Job 创建授权 / decision / generation、换 key 盲重放或修复 source truth | `EV-MS-JOB-001`;`EV-MS-IDEMP-001`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| `AC-MS-SYNC-006` | config / target binding | config + event / adapter | topic-neutral key / opaque target ref | enabled seam 有 validated binding；disabled / blocked 清楚且不伪造完成 | enabled 缺 binding 仍启动、把 target 当 schema、carrier 添加未批准 ref | `EV-MS-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` |
| `AC-MS-SYNC-007` | cross-repo boundary | compile / runtime / event / ref / adapter / fake | safe seam + dependency report | 除 `L0-core` 外无 sibling compile dependency；未就绪有 blocked / waiting / residual | 要求下游源码依赖、把 unavailable 标 P0 passed、外部 truth 入仓 | `EV-MS-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md` |

### 8.3 协议闭环矩阵

| 验收项 | 正式协议 / surface | 主要 TC | EV / report | 裁决影响 |
|---|---|---|---|---|
| `AC-MS-SYNC-001` | `AcceptHostIntentCommand`;`DecideHostOrchestrationCommand`;`ResolveHostQualificationCommand`;`CoordinateHostAssemblyCommand`;`EstablishHostGenerationCommand`;`PrepareHostActionCommand`;`AcceptHostRegistrationCommandPlaceholder`;`MaintainHostSessionCommandPlaceholder`;`DecideHostRecoveryCommand`;`CloseHostCommand` | `TC-CONTRACT-*`;`TC-INTENT-*`;`TC-DECISION-*`;`TC-QUAL-*`;`TC-ASSEMBLY-*`;`TC-GENERATION-*`;`TC-ACTION-*`;`TC-REG-*`;`TC-SESSION-*`;`TC-RECOVERY-*`;`TC-CLOSE-*` | `EV-MS-CONTRACT-001`;`EV-MS-CMD-001`;`EV-MS-IDEMP-001` / `reports/runs/<run_id>/suites/contract-domain-fast.md`;`service-flow-fast.md` | 任一 P0 Command 缺 metadata、写集、result 或 negative，不通过 |
| `AC-MS-SYNC-002` | `QueryCurrentHostDecision`;`QueryHostAssemblyReadiness`;`QueryHostAccessSession`;`QueryHostHealthFailure`;`QuerySafeHostFacts`;`QueryHostHistory` | `TC-QUERY-001~006`;`TC-QUERY-NEG-001` | `EV-MS-QUERY-001` / `reports/runs/<run_id>/suites/service-flow-fast.md` | 任一 Query 写入或隐式修复，触发不通过 / VF-MS-007 |
| `AC-MS-SYNC-003` | `QualificationSourceChangedConsumerPlaceholder`;`HostActionOutcomeConsumerPlaceholder`;`HostHealthSignalConsumerPlaceholder`;`HostCleanupFeedbackConsumerPlaceholder`;`HostHandoffFeedbackConsumerPlaceholder` | `TC-CONSUMER-001~005`;`TC-CONTRACT-003` | `EV-MS-CONSUMER-001` / `reports/runs/<run_id>/suites/entry-worker-job.md` | unsupported / late / duplicate 处理错误，不通过 |
| `AC-MS-SYNC-004` | `HostFactMaterialEventCandidate`、`HostOutboxRecord`、publication marker；Core/Bus event family pending | `TC-MATERIAL-001`;`TC-JOB-005`;`TC-REPORT-001` | `EV-MS-MATERIAL-001`;`EV-MS-REPORT-001` / `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`operations-replay-core.md`;`report-audit.md` | 不得伪造 outbound event ready 或现查现发 |
| `AC-MS-SYNC-005` | `DispatchPendingHostActionsJob`;`EvaluateDueHostHealthJob`;`ProgressPendingHostCleanupJob`;`ReconcileHostResidualsJob`;`PublishHostFactOutboxJob`;`RebuildSafeHostProjectionJob`;`ReconcileHostHandoffGapsJob` | `TC-JOB-001~007`;`TC-JOB-NEG-001`;`TC-IDEMP-*` | `EV-MS-JOB-001`;`EV-MS-IDEMP-001` / `reports/runs/<run_id>/suites/operations-replay-core.md` | Job repair truth、换 key 或缺 report，不通过 |

### 8.4 下游未就绪裁决表

| 场景 | P0 裁决 | 证据要求 | 不允许 |
|---|---|---|---|
| `MSVC-UP-001` Runtime surface 未闭合 | host session / handoff seam 可做 blocked / unknown；Runtime 正向联调 residual | placeholder / failure injection / safe marker | 创建 Runtime run / checkpoint 或标 ready |
| `MSVC-UP-002` Member contract 未闭合 | safe registration / signal mapper、重放 / 迟到 / unsupported 负向可验；正向 waiting | `EV-MS-CONSUMER-001`、`EV-MS-DOMAIN-*` | 保存 Member body、把 placeholder positive 当 reachable |
| `MSVC-UP-003` Images contract 未闭合 | opaque pinned ref / availability / no-bypass 可验；launch positive blocked | `EV-MS-DOMAIN-001`、`EV-MS-CONFIG-001` | 解析 manifest / digest 或 default ready |
| `MSVC-UP-004` Sandbox contract 未闭合 | required binding no-fallback、local attempt / gap 可验；release positive blocked | `EV-MS-JOB-001`、`EV-MS-MATERIAL-001` | 以 host fallback 绕过隔离或宣称 external cleanup |
| `MSVC-UP-006` credential owner 未闭合 | 不保存 / 不复用 / 不可证拒绝可验；sign / revoke positive waiting | redaction / boundary evidence | 本地签发、持有 secret 或默认 allow |
| `MSVC-UP-007` Core/Bus exact schema 未闭合 | topic-neutral material/outbox/marker 可验；route / receipt 正向 pending | `EV-MS-MATERIAL-001`、`EV-MS-ARCH-001` | 猜 event family、topic、receipt 或 delivered |
| `MSVC-UP-008` SDK target 未闭合 | 只验依赖分类和 fake compile seam | dependency report | 宣称准确 target / self-test passed |
| publisher / adapter unavailable | accepted local truth 保留，publication / handoff 为 pending / unknown / gap | outbox / job report | 回滚 truth、换 key 盲重发 |

### 8.5 接口 / 事件验收项停审记录

| 验收项 | 正式名称 / 分母 | 依赖类型 | 下游未就绪处理 | 结论 |
|---|---|---|---|---|
| `AC-MS-SYNC-001` | 10 Command 与 `HostCommandOutcome` | 本仓 protocol | 只裁决本地 flow；外部调用前置不扩张 | 通过 |
| `AC-MS-SYNC-002` | 6 Query 与 `HostQueryOutcome` | 本仓 read protocol | degraded / unavailable 保留；严格 no-write | 通过 |
| `AC-MS-SYNC-003` | 5 Consumer 与 receipt | event / runtime / ref | unsupported no-parse、duplicate / late marker | 通过 |
| `AC-MS-SYNC-004` | 1 material helper；无伪造 event 数量 | event / handoff pending | stored payload / marker；route / receipt pending | 通过 |
| `AC-MS-SYNC-005` | 7 Job 与 `HostJobDisposition` | job / adapter / handoff | only committed work；partial / unknown report | 通过 |
| `AC-MS-SYNC-006~007` | config binding / dependency boundary | config / compile / runtime | blocked / waiting / fake seam | 通过 |

### 8.6 跨接口同步门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 protocol 是否有孤儿入口 | 未发现 | 10/6/5/1/7 全部列出并有 TC / EV 入口 |
| 是否把 outbound event family 伪造为 ready | 未发现 | 只保留 material candidate；Core/Bus exact pending |
| 依赖类型是否误判 | 未发现 | compile 仅 Core；其他为 runtime/event/ref/adapter/fake |
| 是否要求下游完整实现 | 未发现 | 采用 seam / controlled / disabled 裁决 |
| 是否存在 route / topic / credential 泄漏 | 未发现 | 使用 topic-neutral / opaque ref |
| Query / Job no-write / no-truth-repair 是否覆盖 | 已覆盖 | Step 8 将进一步验证事务和一致性副作用 |
| 证据路径是否固定 | 设计层完整 | 真实 run / artifact / report 待未来执行 |

## 9. 回填草稿

正式 §7 应按协议族验收 10 个 Command、6 个 Query、5 个 Inbound Consumer、1 个 `HostFactMaterialEventCandidate` 和 7 个 Operations Job。Command 必须具备 metadata、幂等、accepted 写集、stored result 和 negative；Query 必须严格 no-write；Consumer 必须支持版本、去重、迟到、unsupported no-parse/no-write；material / outbox 必须 immutable、body-free 且不从 current truth 重算；Job 必须只推进已提交 work、保留 stable key / cursor 并生成 report。跨仓依赖按 compile / runtime / event / ref / adapter / fake 区分；未闭合 sibling 只以 blocked / waiting / placeholder / unknown 表达。当前不定义 outbound event family 数量、真实 topic、route 或 receipt。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| Core / Bus event family、route、receipt | material / publication / handoff 正向互操作 | `MSVC-UP-007` pending；不猜测 |
| Member / Runtime / Sandbox exact mapper | Consumer / session / cleanup 正向联调 | `MSVC-UP-001~004` waiting / blocked |
| SDK exact compile target | dependency gate | `MSVC-UP-008` pending |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 接口族均有门禁 | 通过 | 见 §8.2~§8.3 |
| 依赖类型和协作方式清楚 | 通过 | 见 §8.1 |
| 下游未就绪裁决清楚 | 通过 | 见 §8.4 |
| 接口项停审完成 | 通过 | 见 §8.5 |
| 跨接口审计无 unresolved 冲突 | 通过 | 见 §8.6 |
| 可进入 Step 8 | 通过 | 定义状态、事务与一致性验收 |
