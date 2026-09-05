# Step 13. 并发、幂等与重入保护

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13
> 粒度 / 格式参考：`projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
> 本文件状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 约束：这是 planned detailed-design contract，不是实现、运行、测试报告、事件投递或外部确认。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13：并发、幂等与重入保护 |
| 输入基线 | Step 8 协议契约、Step 9 函数级流、Step 11 持久化 / 事务、Step 12 错误 / 恢复 |
| 本仓协议分母 | 10 Command、16 Query、14 Consumer（10 external + 4 committed-fact）、24 个被 `L2M-UP-005` 阻塞的 outbound semantic candidate、5 Job |
| 输出 | `projects/L2-member/design-calibration/03_ddd_step_13_concurrency_idempotency.md` |
| 正式正文 | 不在本 Step 修改；正式 `03-详细设计.md` 只在 Step 19 装配 |
| 停审结论 | 本 Step 的并发场景、幂等键、digest、重复处理、重入恢复和测试切口已收束；保留上游 / 设计 blocker，允许按授权串行进入 Step 14 |

## 2. 本步目标与非目标

本 Step 把成员运行态的 mutable local truth、成员侧 IPC / adapter 接缝、入站 Consumer、出站 attempt / gap、镜像刷新、projection rebuild 和五类 logical Job 的并发、重复调用与部分失败规则收束为可落码矩阵。

实现者必须能据此判断：

1. 哪些资源以同一 Store 的 `MemberStoreVersion` 做 optimistic compare-and-swap，哪些资源以 append-only identity 或业务唯一键保护；
2. 哪些 Command / Consumer / Job 必须先建立幂等 reservation，哪些 Query 永远保持 no-write；
3. 每一个 Command、Consumer 和 Job 的幂等键如何从已验证的 metadata、event identity 或 job 参数计算；
4. `MemberRequestDigest` 的稳定输入、排除字段、结果种类和 replay 关系如何闭合；
5. same key + same digest、same key + different digest、in-flight、missing carrier、version conflict 与 `CommitStatusUnknown` 各自如何处理；
6. 重复事件、重复 relay、projection / mirror race、partial Job continuation 如何避免第二个 writer 或重复外部调用；
7. Step 16 可以从本 Step 直接拆出最小并发 / 幂等测试切口。

本步不定义幂等记录保留期、具体 hash crate、HTTP / RPC / UDS 状态码、Bus ack、topic / route、outbox、DLQ、worker backoff、scheduler、数据库锁产品、日志字段或告警阈值。成员不拥有 event transport、outbox 或 publisher backend；24 个 outbound candidate 在 `L2M-UP-005` 关闭前始终不是 Event。

## 3. 输入材料与使用边界

| 输入 | 本 Step 使用 | 不继承 / 不扩张 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | `MemberOperationContext`、`MemberIdempotencyRecord`、`StoredMemberOperationResult`、`MemberJobReport`、CP01~CP07 mutable / append-only object | 不把 object revision、source version、cursor 当 Store version；不引入新 domain object |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | `Versioned<T>`、`MemberStoreVersion`、`MemberUnitOfWork`、`MemberIdempotencyStore`、typed result Store、各 CP Store / resolver / handoff Port | 不改变既有 Port 签名；不把 runtime / event 协作变成 Cargo package dependency |
| `03_ddd_step_08_protocol_contracts.md` | 10 Command、16 Query、14 Consumer、24 blocked candidates、5 Job 的 envelope、metadata、result / receipt / report carrier | 不把 query 加入幂等写路径；不为 blocked candidate 发明 event schema |
| `03_ddd_step_09_function_flows.md` | reserve → domain / local write → typed carrier → complete → commit 的顺序和异常分支 | 不重排 UoW；不把伪代码当成实现 / delivery 证据 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 同一 UoW、append-only、version provenance、projection / mirror / handoff marker 的保存规则 | 不选择物理 Store、DDL、ORM、outbox 或 queue |
| `03_ddd_step_12_error_recovery.md` | `VersionConflict`、`IdempotencyConflict`、`InFlight`、`StoredResultUnavailable`、`CommitStatusUnknown` 的映射与人工修复边界 | 不把 `Blocked` / `Waiting` / `Unknown` 正向化，不静默重试 |
| `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | 并发表、幂等表、重入表、digest / replay 的粒度和格式 | 只借鉴组织方式；不继承 Governance truth、outbox、GRC 或其对象名 |

## 4. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 哪些处理流可能并发修改同一资源？ | 10 个 Command 可能并发修改 CP01~CP04 / CP06 mutable truth；14 个 Consumer 可能并发写入入站事实、反馈链接、镜像 successor、projection stale marker 和 trace；5 个 Job 可能并发推进 publication / observation attempt、mirror state、projection state 或 gap report。Query 只读，不参与写并发。 |
| 哪些接口、事件或 Job 可能重复调用？ | 所有 Command 可能因客户端超时重试；所有 external Consumer 可能因上游 at-least-once redelivery 重复；4 个 committed-fact Consumer 可能因同一 committed fact 被多个 continuation 再投递；5 个 Job 可能因 worker crash、scheduler / operator rerun 重复。 |
| 幂等键来自哪里？ | Command 来自 `CommandMetadata.idempotency_key`；external Consumer 来自 envelope 的 `dedup_key`；committed-fact Consumer 来自 `consumer_name + committed_fact_ref` 的稳定关系；Job 来自 `MemberJobMetadata.idempotency_key`。唯一键只保护 storage / business uniqueness，不能替代 typed result replay。 |
| 重复请求如何处理？ | same channel + operation + key + digest 且 relation `Completed` 时，只读取匹配 kind 的 stored carrier 并返回 `DuplicateReplayed`；same key 不同 digest / channel / operation 返回 `Conflict`；same relation `Reserved` 返回 `InFlight`；不进入第二次 domain、resolver、handoff、scan 或 rebuild。 |
| 并发冲突如何测试？ | 至少覆盖 presence / scope / runtime / attempt / mirror / projection 的 version conflict、业务唯一键冲突、10 Command replay、14 Consumer redelivery、5 Job duplicate / partial continuation、missing carrier、commit unknown 与 Query no-write。 |

## 5. 设计原则

| 原则 | 成员仓强制口径 |
|---|---|
| relation namespace | 幂等 relation 的唯一身份是 `channel + operation_name + idempotency_key`；相同 raw key 在不同 operation 或 channel 中不得互相 replay。 |
| stable digest | `MemberRequestDigest` 只覆盖会改变本次 local 结果的稳定、body-free、typed 输入；用于区分真正重复与 key reuse conflict。 |
| exact provenance | `MemberStoreVersion` 只能来自**同一 Store** 的 `Versioned<T>` read；revision、cursor、watermark、source version、digest、时间和 trace 都不能替代。 |
| reserve before mutation | fresh Command / Consumer / Job 必须先计算 digest、开启 UoW、reserve；只有 `Reserved` 可进入 application body。 |
| duplicate means replay | duplicate 只调用 `MemberStoredResultStore.get_command_result` / `get_command_rejection` / `get_consumer_receipt` / `get_job_report`，并验证 channel、operation、digest、result kind、subject relation；不从 current truth 重建。 |
| in-flight no second writer | 同 operation / key 仍为 `Reserved` 时，第二调用返回 `InFlight` / retryable unavailable，不执行 domain transition、resolver、handoff、relay 或 Job body。 |
| Query no-write | 16 个 Query 不计算幂等 digest、不 reserve、不写 stored result、不 refresh、不 rebuild、不 reconcile、不 append marker 或 successor。 |
| local-first side effect fence | publication / observation / Runtime / host handoff 先记录允许的 local attempt / material relation；`Completed` / `Unknown` 只代表本地接缝结果，不代表外部 accepted、delivered、observed、healthy 或 ready。 |
| job item isolation | Job 的每个 item 都以已读取的 typed version / identity 处理；单 item conflict 进入 report 的 unresolved refs，不回滚已提交 source truth，也不重新处理已完成 item。 |
| fake parity | durable adapter 与 in-memory fake 必须同时实现 reservation、CAS、typed replay、missing-carrier fail-closed 和 no-write Query 语义；fake 私有 map 不能提供第二种事实来源。 |
| no event inflation | 24 个 semantic outbound candidate 不是 event、publisher、outbox 或 retry record；`L2M-UP-005` 未关闭时唯一结果是 `Blocked(L2M-UP-005)`。 |

## 6. 当前闭环诊断

| 检查项 | 结论 | 依据 / 仍开放事项 |
|---|---|---|
| reservation surface | 通过 | Step 7 `MemberIdempotencyStore.reserve` 返回 `Reserved` / `Duplicate` / `InFlight` / `Conflict`。 |
| typed replay surface | 通过 | Step 8 / 11 的 Command value / rejection、Consumer receipt、Job report 有独立 getter 和 result kind。 |
| save-before-complete | 通过 | fresh path 在同一 UoW 先保存完整 typed carrier，再以同一 relation `complete`。 |
| mutable version provenance | 通过 | CP01~CP07 mutable record 使用同 Store `get_*_with_version` 返回的 `MemberStoreVersion`。 |
| Query no-write | 通过 | Step 8、9、12 明确 Query 不触碰 reservation、stored result、refresh、rebuild 或 repair。 |
| Job partial continuation | 通过 | `MemberJobReport` 记录 scanned / advanced / unresolved typed refs；不伪造 scheduler run 或外部效果。 |
| external side-effect fence | 通过边界 | attempt / gap 可表达本地准备、提交或未知；Runtime / host / publication / observation 正向反馈仍受 `L2M-UP-003/004`、`L2M-UP-005` 等 blocker 约束。 |
| upstream / design blockers | 未关闭 | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`；24 candidates 受 `L2M-UP-005` 阻塞。 |

## 7. 并发场景表

控制语义统一为“同一 Store versioned read → domain successor / append → expected version save → same UoW commit”。发生冲突时，当前 invocation 不静默 reload、merge 或覆盖；是否重试由第 10 节的新 relation / 新 UoW 规则决定。

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 同一 Command 并发首次执行 | `MemberIdempotencyRecord(channel, operation, key)` | atomic `reserve`；仅一个调用获得 `Reserved` | `InFlight` / `IdempotencyConflict` | `TC-MEM-IDEM-001` |
| `AdmitMemberStartup` 并发建立同一双锚 admission | startup admission active identity / local uniqueness | reservation first；`PresenceStore` 业务唯一键与 domain guard 同一 UoW | `DuplicateKey` / `ContractViolation` | `TC-MEM-CONC-PRES-001` |
| `EstablishMemberPresence` 与 `TransitionMemberPresence` 并发 | `MemberPresence` current state / version | `get_presence_with_version` + successor save expected version | `VersionConflict` / `IllegalTransition` | `TC-MEM-CONC-PRES-002` |
| 两次 `TransitionMemberPresence` 并发 | 同一 `MemberPresenceId` | CAS；第二 writer 必须重新以新 operation 读取并完整重评估 | `VersionConflict` | `TC-MEM-CONC-PRES-003` |
| `PrepareHostCollaboration` 与 Host feedback Consumer 并发 | `HostCollaborationAttempt` / feedback link | attempt versioned read；feedback 只能按 attempt relation 追加 successor | `VersionConflict` / `ConsistencyViolation` | `TC-MEM-CONC-HOST-001` |
| 建立 / 替换 subscription scope 并发 | `SubscriptionScopeDecision` current index / presence relation | same Store version + active uniqueness；不以 scope revision 代替 version | `VersionConflict` / `DuplicateKey` | `TC-MEM-CONC-SCOPE-001` |
| Inbound fact Consumer 与 Policy / Identity update Consumer 并发 | inbound fact、screening decision、mirror snapshot relation | 各 Consumer 独立 reservation；写入前读取所需 version，禁止跨 UoW覆盖 | `VersionConflict` / `BlockedDependency` | `TC-MEM-CONC-INBOUND-001` |
| 同一 Runtime screening 被两个提交调用 | `RuntimeDeliveryDecision` / submission attempt | command idempotency + attempt expected version；第二调用不得重复 handoff | `InFlight` / `VersionConflict` | `TC-MEM-CONC-RUNTIME-001` |
| Runtime material reception 与 admission-result link 并发 | `RuntimeMaterialReception` / `RuntimeResultLink` | 各自 typed identity；link 只接受正式 predecessor，CAS 保存 local relation | `Conflict` / `ContractViolation` | `TC-MEM-CONC-RUNTIME-002` |
| publication relay 与 DeliveryFeedback Consumer 并发 | `PublicationAttempt` / `PublicationGap` | attempt / gap `Versioned<T>`；feedback 不覆盖 prepared / unknown successor | `VersionConflict` / `UnknownSideEffect` | `TC-MEM-CONC-PUB-001` |
| 两个 publication relay worker 处理同一 attempt | publication attempt state | expected version 只允许一个 successor；另一项写入 item report | `VersionConflict` | `TC-MEM-CONC-PUB-002` |
| observation relay 与 ObservationFeedback Consumer 并发 | `ObservationAttempt` / interaction gap | attempt CAS；feedback link 使用显式 attempt identity | `VersionConflict` / `ConsistencyViolation` | `TC-MEM-CONC-OBS-001` |
| 同一 interaction trace predecessor 被重复追加 | append-only trace identity / predecessor relation | immutable identity + explicit uniqueness；不修改既有 trace | `DuplicateKey` / `ConsistencyDefect` | `TC-MEM-CONC-TRACE-001` |
| `ResolveExternalContext` 与 refresh Consumer / Job 并发 | `ExternalContextSnapshot` / `ExternalContextResolution` / gap | snapshot append-only；resolution / gap successor 用同 Store version | `VersionConflict` / `WaitingForSource` | `TC-MEM-CONC-MIRROR-001` |
| 不同 owner update 同一 mirror relation | external resolution current state | owner-specific Consumer reservation + expected version；不以 source version 当 local CAS token | `VersionConflict` / `OwnerMismatch` | `TC-MEM-CONC-MIRROR-002` |
| `RequestExternalContextRefresh` 与已有 gap 重入 | refresh request / `ExternalContextGap` | existing relation identity + command idempotency；不从 stale Query 创建第二 gap | `InFlight` / `DuplicateKey` | `TC-MEM-CONC-MIRROR-003` |
| committed-fact Consumer 与 projection update 并发 | committed fact read relation / projection stale marker | fact identity dedup；projection marker cursor 单调推进 | `Conflict` / `VersionConflict` | `TC-MEM-CONC-PROJ-001` |
| 多个 projection rebuild worker 处理同一 view | `MemberProjectionState` / view revision | job reservation + projection state expected version + cursor monotonicity | `VersionConflict` / item partial | `TC-MEM-CONC-PROJ-002` |
| older rebuild 与 newer accepted fact race | projection state cursor / freshness | older cursor 不得覆盖 newer cursor；freshness 由 state successor 判断 | `VersionConflict` / stale item | `TC-MEM-CONC-PROJ-003` |
| GapReconciliation 与 source gap successor 并发 | projection gap relation / read-side state | 只读取已提交 gap / successor；read-side CAS，不创建或关闭 source gap | `VersionConflict` / `BlockedDependency` | `TC-MEM-CONC-GAP-001` |
| Job report 保存与 reservation complete 并发 | `MemberStoredResultStore` carrier + idempotency record | report 同 UoW 保存后再 complete；relation mismatch fail closed | `ConsistencyDefect` / `CommitStatusUnknown` | `TC-MEM-CONC-JOB-001` |
| duplicate Consumer 同时读取 stored receipt | completed receipt carrier | typed getter 只读；不得再次检查 source body 或写 snapshot | `StoredResultUnavailable` | `TC-MEM-IDEM-002` |
| duplicate Job 同时重跑 | completed Job report | `reserve` 返回 `Duplicate(JobReport)`，只 replay report | `InFlight` / `StoredResultUnavailable` | `TC-MEM-IDEM-003` |
| Query 与任何写路径并发 | Query read surface / mutable Store | Query 使用 read Port；不 reserve、不 refresh、不 rebuild、不修复 | 无写错误；返回 `Stale` / `NotReady` / `NotAvailable` | `TC-MEM-QUERY-NOWRITE-001` |

### 7.1 资源控制补充

- `MemberStoreVersion` 是唯一 optimistic token；`PresenceRevision`、`SubscriptionScopeRevision`、`ProjectionWatermark`、`MemberRepositoryCursor`、`SourceVersion`、trace / request / idempotency key 均不是 CAS token。
- immutable fact、safe snapshot、trace entry、material 和 result carrier 只能 append；同一 identity 的再次 append 是 storage / consistency error，不能被转换成业务 duplicate replay。
- external handoff 的 `Completed` 仅表示 named adapter 返回了 body-free seam result；外部 side effect 不与 local truth 原子合并，`Unknown` 必须保留为 unknown fence。
- projection / mirror Job 只能从 committed local source 读取；不得通过 Query 触发 repair，也不得反向修改 CP01~CP06 source truth。

## 8. 幂等键与 canonical digest

### 8.1 幂等键表

幂等 relation 的逻辑窗口是“从 reservation 建立到 `Completed` 或明确 consistency repair”；保留期、清理策略和物理索引留 Step 14 / 实施阶段。表中的“重复处理”只描述本仓 local surface，不代表 transport ack 或外部确认。

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| `AdmitMemberStartup` Command | `CommandMetadata.idempotency_key` + operation `AdmitMemberStartup` | relation lifetime | replay stored `StartupAdmission` value / rejection；不再次解析 credential 或 source |
| `EstablishMemberPresence` Command | metadata key + operation name | relation lifetime | replay stored `MemberPresence` value / rejection；不重新建立 presence |
| `TransitionMemberPresence` Command | metadata key + operation name | relation lifetime | replay exact stored successor / rejection；不使用 current presence 重建结果 |
| `PrepareHostCollaboration` Command | metadata key + operation name | relation lifetime | replay host material / attempt carrier；不再次调用 Host adapter |
| `EstablishSubscriptionScope` Command | metadata key + operation name | relation lifetime | replay stored `SubscriptionScopeDecision`；不重新读取 policy body或扩权 |
| `ReplaceSubscriptionScope` Command | metadata key + operation name | relation lifetime | replay stored scope successor / rejection；不覆盖 newer decision |
| `SubmitScreenedFactToRuntime` Command | metadata key + operation name | relation lifetime | replay local runtime-delivery value；不重新 handoff Runtime |
| `LinkRuntimeAdmissionResult` Command | metadata key + operation name | relation lifetime | replay exact `RuntimeResultLink` / rejection；不由 ack 或 current status 推导 |
| `ResolveExternalContext` Command | metadata key + operation name | relation lifetime | replay snapshot / resolution carrier；不再次调用 owner resolver |
| `RequestExternalContextRefresh` Command | metadata key + operation name | relation lifetime | replay refresh request / gap carrier；不从 Query 或 stale flag创建新 request |
| 10 external Consumers：`HostFeedbackConsumer`、`InboundFactConsumer`、`RuntimeMaterialConsumer`、`DeliveryFeedbackConsumer`、`ObservationFeedbackConsumer`、`SubjectIdentityContextUpdateConsumer`、`PolicyContextUpdateConsumer`、`RuntimeBoundaryContextUpdateConsumer`、`CapabilityContextUpdateConsumer`、`HostRouteContextUpdateConsumer` | `consumer_name` + normalized external `dedup_key`（经 `MemberOperationContext::from_consumer`）；digest 同时覆盖 source / schema / body-free inspected refs | relation lifetime | replay exact stored `MemberConsumerReceipt`；不重检 raw body、snapshot、feedback link 或 handoff |
| `RuntimeMaterialReceptionConsumer` | consumer name + stable source reception identity (`reception_id` / source relation) | relation lifetime | replay stored receipt；不重复追加 reception / trace |
| `MemberCommittedFactConsumer` | consumer name + `MemberCommittedFactRef` + subject anchor | relation lifetime | replay stored receipt；不重新读取 source fact或追加 trace |
| `MemberProjectionUpdateConsumer` | consumer name + committed fact ref + target watermark relation | relation lifetime | replay receipt；不重复标 stale / rebuild |
| `CapabilityOutletSourceUpdateConsumer` | consumer name + source resolution / gap relation identity | relation lifetime | replay receipt；不重新解析 capability / method definition |
| `PublicationRelay` Job | `MemberJobMetadata.idempotency_key` + job kind | relation lifetime | replay stored `MemberJobReport`；不重新 list / handoff / append attempt |
| `ObservationRelay` Job | job metadata key + job kind | relation lifetime | replay stored report；不重新提交 observation material |
| `ExternalContextRefresh` Job | job metadata key + job kind | relation lifetime | replay stored report；不再次调用 resolver，未完成 item 由新合法 continuation 处理 |
| `MemberProjectionRebuild` Job | job metadata key + job kind | relation lifetime | replay stored report；不重新扫描或 rebuild |
| `GapReconciliation` Job | job metadata key + job kind | relation lifetime | replay stored report；不重新产生 gap、source fact 或 report |
| 16 Query | 无幂等键；只使用 typed selector / page | 不适用 | 正常读取当前 authorized surface；不得建立 reservation / stored result |
| 24 outbound semantic candidates | 无可用 event / publisher key | blocked | 仅返回 `Blocked(L2M-UP-005)`；不创建 event、outbox、retry 或 delivery relation |

### 8.2 relation 必须完整保存

每一次 reserve / duplicate 判断都必须同时约束以下六元组，不得只按 raw key 去重：

```text
(channel, operation_name, idempotency_key, request_digest, result_kind, result_ref)
```

`result_ref` 由 reservation 返回或由 fresh application 在同一 UoW 生成并保存；`result_kind` 必须与调用方的 typed surface 相同：Command value / rejection、Consumer receipt、Job report。`MemberStoredResultRelationExpectation` 还必须校验 `record_ref`、subject / operation context 和 same-UoW 关系。

### 8.3 canonical digest include / exclude

| Include（稳定且会影响结果） | Exclude（易变、敏感或结果生成后才存在） |
|---|---|
| channel、有限 operation name、双锚 subject、route-bound local refs | idempotency key 本身、request id、event delivery id、job run id |
| Command body 的 typed fields、expected version（当该字段是语义 guard） | trace id / trace context random fields、received_at、requested_at、当前时间 |
| external Consumer 的 source event ref、source authority、schema version、payload digest、inspection marker 的安全分类 | raw event body、prompt、plan、tool input / output、credential、secret、adapter private state |
| committed-fact Consumer 的 fact ref、predecessor refs、purpose 和 source version ref | worker attempt、bus offset、delivery attempt、retry counter |
| Job kind、finite typed input refs、scope、page / continuation、target refs、影响结果的已声明 binding ref | scheduler attempt、process / container id、随机生成的 local truth id |
| 明确影响筛选 / visibility / freshness 的 safe policy / resolution refs | 由本次 operation 产生的 revision、watermark、result ref、timestamp |

Canonical projection 缺字段、包含 forbidden body 或无法确定 operation / channel 时必须 fail closed；不得拼 JSON `Value`、字段顺序、字符串 route 或 current Store state 作为 digest 输入。Query 永不调用 digest Port。

## 9. 重复处理矩阵

| Existing relation / reserve outcome | Incoming relation | Service 行为 | 对外结果 |
|---|---|---|---|
| no record | valid digest | `reserve` → `Reserved`；继续对应 named service / Job | accepted、typed rejection、blocked / waiting / unknown 或 local Job report |
| completed same channel / operation / key | same digest + same result kind | rollback current empty UoW；typed getter 读取完整 carrier | `DuplicateReplayed`，携带原 result / receipt / report |
| completed same key | different channel / operation / digest | 不进入 domain / resolver / Job body | `Conflict` + `IdempotencyConflict` |
| reserved same key | same digest | 不创建第二 reservation，不执行第二 writer | `InFlight` / retryable unavailable |
| reserved same key | different digest | 不覆盖 reservation，不执行 mutation | `Conflict` |
| completed relation but carrier missing | same digest | 不从 current truth、projection、fake map、external response重建 | `StoredResultUnavailable` / `ConsistencyDefect`，需修复 |
| completed relation but carrier wrong kind / wrong operation | same digest | typed getter 失败即停止 | `StoredResultUnavailable` / conservative `Blocked` |
| reservation Store unavailable | any | 不写业务 truth、attempt、snapshot 或 report | `DependencyUnavailable` / `Blocked` |
| versioned save conflict | fresh relation | rollback current UoW；新尝试必须新 UoW reload 并完整重评估 | `Conflict` / item-level partial |
| Query repeated | n/a | 只读 current authorized Store / projection surface | `Visible` / `Stale` / `NotReady` / `NotAvailable` / `Empty` |
| same publication / observation item by two Job workers | n/a | item version / expected version 只允许一个 successor | 另一 worker 的 report item 为 conflict；不重复 handoff |

## 10. 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command 在 accepted commit 后客户端超时 | 同 key client retry | completed relation 指向 stored typed value | same key + digest 只 replay；不追加 truth / trace / attempt |
| Command 在 rejection / blocked / waiting / unknown carrier 提交后超时 | client retry | stored `MemberCommandRejection` 与 relation 同 UoW complete | replay 原 non-positive outcome；不重跑 resolver / policy |
| Command 第一次仍 in-flight 时并行重试 | parallel client | `Reserved` relation 返回 `InFlight` | 调用方稍后仍用同一 key；不创建新 key 绕过保护 |
| same key 改变 body 或 subject | client bug / replay drift | canonical digest mismatch | `Conflict`；调用方修正原请求或使用独立合法 operation key |
| `CommitStatusUnknown` | connection / Store outcome unknown | 后续只能 inspect same relation；不得换 key | 见第 11 节；duplicate replay / in-flight / manual defect 三分支 |
| stored result save 在 complete 前失败 | Store failure | same UoW rollback；不能留下 completed-without-carrier | same relation 重试前先确认 rollback / reservation 状态 |
| idempotency complete 在 result save 后失败 | Store / UoW failure | rollback 或进入 commit-unknown audit | same key inspect；不重新 domain mutation |
| external Consumer redelivery | at-least-once source | source dedup key + body-free digest + stored receipt | duplicate replay；不再次保存 snapshot / feedback / stale marker |
| external Consumer 同 dedup key 不同 payload digest | upstream defect | digest conflict before application body | `Conflict` / boundary reject；不覆盖旧 receipt，不声称 DLQ |
| unsupported schema redelivery | worker retry | schema gate 早于 body parse / inspection | 返回 typed `UnsupportedVersion`；不调用 application、不写 local truth |
| committed-fact Consumer redelivery | projection / trace continuation | fact ref identity dedup + stored receipt | replay receipt；不再次 append trace / projection marker |
| PublicationRelay worker crash after one item | crash / rerun | 每 item attempt / gap version 和 report ref 独立 | 新合法 Job 可处理剩余 items；旧 key replay 旧 report，不重处理已完成 item |
| ObservationRelay worker crash after partial items | crash / rerun | observation attempt / gap expected version | 保留成功 item；失败 item 进入 report unresolved；不回滚 source trace |
| ExternalContextRefresh partial failure | resolver unavailable / source waiting | per-reference resolution / gap version；report 保存 advanced / unresolved refs | 新 continuation 只处理 unresolved refs；成功 snapshot 不重写 |
| Projection rebuild crash | worker crash | projection state version + target watermark / cursor | 新 Job 从 committed local facts rebuild；duplicate key只回放 report |
| older rebuild 完成晚于 newer fact | race | cursor monotonicity + projection state CAS | older successor 被拒绝 / item partial；不得把新状态标旧 |
| GapReconciliation 与 Query 同时发生 | operator / query | Query 永远 no-write；Job 只写 read-side successor | Query 返回当时 freshness surface；不等待或触发 repair |
| publication / observation feedback 在 attempt 已 terminal 后到达 | late source feedback | feedback Consumer 以 state matrix / expected version 校验 | 返回 conflict / waiting；不得重开 terminal attempt |
| Runtime / host handoff 返回 `Unknown` | adapter / connection uncertainty | local attempt / unknown fence 先持久化；不补偿发送 | 读取 same attempt / gap / formal feedback 后再继续；禁止盲重发 |
| duplicate Job same key | scheduler / operator duplicate | `Duplicate(JobReport)` | exact stored report replay；不 scan、resolver、handoff 或 rebuild |

## 11. `CommitStatusUnknown` 重入口径

`CommitStatusUnknown` 表示 `MemberUnitOfWorkManager::commit` 无法证明 local durable outcome。它不是成功，也不是失败确认。任何 entry、service、worker 或 Job runner 都不得用新 key 盲重试、补写 truth、补发 handoff 或删除 reservation。

```text
Input: original channel + operation_name + idempotency_key + original stable MemberRequestDigest

1. 以同一 channel / operation / key / digest 重建原 typed context；Query 不适用此流程。
2. 开启只用于检查的 logical UoW，调用 MemberIdempotencyStore::reserve(context, digest, uow)。
3. reserve -> Duplicate(result_ref, result_kind)：rollback 检查 UoW，按 result_kind 读取完整 typed carrier；正确则 DuplicateReplayed。
4. reserve -> Conflict：返回 IdempotencyConflict；不进入 domain、resolver、handoff 或 Job body。
5. reserve -> InFlight / technical unavailable：返回 InFlight / DependencyUnavailable；不进行第二次 mutation。
6. reserve -> Reserved：只有 adapter-specific audit 已确认原 UoW 未提交时才允许继续；P0 默认保持 conservative unavailable / manual reconciliation。
7. stored carrier missing / wrong kind / wrong relation：返回 StoredResultUnavailable / ConsistencyDefect；绝不从 current truth 重算。
```

自动清理 stuck reservation、合成缺失 result、推断外部 side effect 或把 unknown 转 accepted 都需要新的 durable repair contract；当前实现不得自行补。

## 12. Consumer、Job 与接缝的细化规则

### 12.1 Consumer boundary

1. worker 先校验有限 Consumer name、source、schema version、双锚和 body-inspection marker；unsupported / forbidden body 在 reserve 前停止，不解析或保存 raw body。
2. 通过 `MemberOperationContext::from_consumer` 形成 channel、operation、normalized dedup key 和 digest；只有 `Reserved` 才进入 owner-specific Consumer service。
3. accepted Consumer 的 local fact、safe snapshot、feedback link、trace 或 projection marker 与完整 `MemberConsumerReceipt` 在同一 UoW 保存，再 complete reservation。
4. duplicate 只调用 `get_consumer_receipt` 并验证 relation；不得重新读取 source body、调用 resolver、重建 snapshot 或覆盖 stale marker。
5. 10 external Consumer 的 source owner、4 committed-fact Consumer 的 fact identity 均不可由字符串 route、current query 或 private map 推断。

### 12.2 五类 Job

| Job | 并发控制 | partial / duplicate 口径 | 明确禁止 |
|---|---|---|---|
| `PublicationRelay` | prepared `PublicationAttempt` / `PublicationGap` 的 versioned read + expected version；handoff 输入使用已保存 material / target | 每 item 记录 local advanced / unresolved ref；duplicate 只 replay report | 不创建 event / outbox，不把 handoff result写成 delivered / accepted，不从 current truth重建 material |
| `ObservationRelay` | `ObservationAttempt` / interaction gap CAS；material digest 与 attempt relation固定 | successful item 不重复提交；failed / unknown item留 report | 不把 local observation attempt写成 observed / evidence，不重建 trace body |
| `ExternalContextRefresh` | 每个 resolution / gap 使用同 Store version；resolver target 来自显式 `ExternalContextRefreshTarget` | duplicate 只 replay report；new continuation只处理未完成 relation | 不扫描所有 source、不从 source ref 字符串选 resolver、不复制 owner body |
| `MemberProjectionRebuild` | projection state version + declared watermark / cursor 单调性 | duplicate 不 rebuild；partial report列出已重建 / unresolved view refs | 不修改 CP01~CP06 source truth，不由 Query 触发，不声明 current / ready |
| `GapReconciliation` | 只读取已提交 `MemberProjectionGapRef` 与 successor；read-side state CAS | duplicate replay report；source gap 不因 read-side完成而被创建或关闭 | 不伪造 predecessor / successor，不删除 source gap，不把 report当 repair evidence |

### 12.3 外部接缝与 24 candidates

`RuntimeEntryPort`、`HostCollaborationPort`、`PublicationHandoffPort`、`ObservationHandoffPort`、owner-specific resolver 只接受 Step 7 的 body-free submission。`Completed` 允许形成 local submission / attempt successor；`Blocked`、`Waiting`、`Unknown` 只能形成相应 typed local surface。

24 个 outbound semantic candidates 没有可用的 member-specific event schema、source、subject、route、publisher 或 outbox relation。任何“event retry”“publish duplicate”“DLQ”写法均越界；其并发 / 幂等结果固定为 `Blocked(L2M-UP-005)`。

## 13. 依赖 / adapter / fake 一致性要求

| 依赖类别 | 并发 / 幂等要求 | 不得伪装的内容 |
|---|---|---|
| compile-time Core contract | 仅承载 typed metadata、ref、safe category；版本由 Core authority提供 | 不把 runtime / event transport 当 package dependency |
| local Store / UoW adapter | 实现同 Store version、同 UoW staging、atomic reservation、typed carrier getter | 不暴露 SQL、锁、SDK、物理事务或 row 细节，不静默 merge |
| runtime / host / owner Port | body-free seam result 的 `Completed / Blocked / Waiting / Unknown` | 不把 adapter return 当 accepted / delivered / healthy |
| event collaboration | 仅作为 14 Consumer 的外部 logical input；source identity 参与 digest / dedup | 不创建本地 topic、route、ack、outbox、DLQ 或 publisher |
| durable adapter / in-memory fake | 相同 duplicate / conflict / in-flight / CAS / missing-carrier fail-closed 结果 | 不使用 fake 私有 map 作为第二 truth，不让 fake bypass reservation |

## 14. 并发与幂等测试切口

| 测试切口 | 覆盖点 | 建议测试类型 |
|---|---|---|
| `TC-MEM-IDEM-001` | 10 Command same key + same digest replay exact value / rejection；无新 truth / attempt | application service |
| `TC-MEM-IDEM-002` | Consumer completed relation replay exact typed receipt；不重检 body、不写 snapshot | Consumer service |
| `TC-MEM-IDEM-003` | Job duplicate replay exact `MemberJobReport`；不 scan / resolver / handoff / rebuild | Job service |
| `TC-MEM-IDEM-004` | same key different operation / channel / digest 返回 Conflict | contract / application |
| `TC-MEM-IDEM-005` | in-flight relation 返回 InFlight；无第二 writer | idempotency fake |
| `TC-MEM-IDEM-006` | completed relation missing / wrong-kind carrier 返回 StoredResultUnavailable；不重算 | result-store fake |
| `TC-MEM-DIGEST-001` | digest 包含 subject / operation / typed body / source refs / relevant binding | contract unit |
| `TC-MEM-DIGEST-002` | digest 排除 request / trace / timestamp / retry / run id / raw body / generated IDs | contract unit |
| `TC-MEM-COMMIT-001` | commit unknown 后同 key reserve / duplicate / in-flight 分支 | UoW + fake |
| `TC-MEM-CONC-PRES-001` | presence CAS conflict 不覆盖新状态；新 UoW 才能 re-evaluate | repository fake |
| `TC-MEM-CONC-SCOPE-001` | scope active uniqueness / expected version 冲突 | repository fake |
| `TC-MEM-CONC-RUNTIME-001` | Runtime submission 同一 attempt 只允许一个 successor / handoff | application + handoff fake |
| `TC-MEM-CONC-PUB-001` | dual publication relay 对同一 attempt 只允许一个 versioned update | Job + Store fake |
| `TC-MEM-CONC-OBS-001` | observation relay / feedback race 产生 conflict，不重开 terminal | Consumer + Store fake |
| `TC-MEM-CONC-MIRROR-001` | refresh 与 source update race 保留 existing state，报告 item conflict | mirror fake |
| `TC-MEM-CONC-PROJ-001` | older projection cursor 不覆盖 newer state | projection fake |
| `TC-MEM-CONC-GAP-001` | GapReconciliation 只更新 read-side，不创建 / 关闭 source gap | Job service |
| `TC-MEM-EVENT-001` | external Consumer redelivery same digest replay receipt | worker / service |
| `TC-MEM-EVENT-002` | same dedup key different digest 被拒绝，不覆盖旧 relation | worker / service |
| `TC-MEM-EVENT-003` | unsupported schema 在 body parse 前返回 `UnsupportedVersion` | worker contract |
| `TC-MEM-JOB-001` | PublicationRelay partial report 逐 item 保存，duplicate 不重处理完成 item | Job service |
| `TC-MEM-JOB-002` | ExternalContextRefresh 仅重试 unresolved refs，成功 snapshot 不重写 | Job service |
| `TC-MEM-JOB-003` | ProjectionRebuild duplicate 不执行 rebuild，返回 stored report | Job service |
| `TC-MEM-FAKE-001` | durable / fake reservation、CAS、typed replay、missing carrier 结果一致 | adapter parity |
| `TC-MEM-QUERY-NOWRITE-001` | repeated Query 不产生 reservation、digest、refresh、rebuild、marker 或 repair write | query service |
| `TC-MEM-EVENT-BLOCK-001` | 24 semantic candidate 始终 `Blocked(L2M-UP-005)`，不生成 event / outbox / route | boundary contract |

## 15. 前序契约回填审计

| 前序 Step | 审计结论 | 是否需要回填 |
|---|---|---|
| Step 6 object contracts | operation context、idempotency record、stored result carrier、Job report、state factory / transition 已提供本 Step 所需身份 | 不需要；仅将 digest / result relation 细化于本 Step |
| Step 7 Port / Adapter | `MemberStoreVersion`、versioned read / save、reservation、typed stored-result getter、UoW、owner-specific resolver / handoff 已存在 | 不需要；未新增 Port |
| Step 8 protocol | 10 / 16 / 14 / 24 / 5 分母、metadata key、dedup key、typed result / receipt / report 与 Query no-write 已闭合 | 不需要；24 candidates 继续 blocked |
| Step 9 flows | fresh path、duplicate path、rollback、external fence、Job report 顺序可直接承接 | 不需要；本 Step 补充 race / retry matrix |
| Step 10 state matrix | terminal、illegal transition、projection / gap / attempt 状态边界支持 CAS 和 late feedback rejection | 不需要；缺 helper 的 `L2M-DDD-004~007` 仍开放 |
| Step 11 persistence | same-UoW save-before-complete、append-only、version provenance、projection / mirror consistency 与 fake parity 已闭合 | 不需要；物理 durability 留实施 / 配置阶段 |
| Step 12 error recovery | `InFlight`、`Conflict`、`StoredResultUnavailable`、`CommitStatusUnknown`、`UnknownSideEffect` 恢复口径已能承接本 Step | 不需要；本 Step 只细化顺序 |

## 16. 回填草稿

> 校准来源：
> - `projects/L2-member/design-calibration/03_ddd_step_13_concurrency_idempotency.md`
>
> 延伸阅读：
> - §7「并发场景表」：按 CP、Consumer、Job 和 Query 列出的冲突资源与测试切口；
> - §8「幂等键与 canonical digest」：10 Command、14 Consumer、5 Job 的 key 来源、relation 六元组和 digest 排除字段；
> - §9~§12：duplicate / conflict / in-flight、commit unknown、Consumer / Job 重入与 event blocker。

### 5.12 并发、幂等与重入保护

成员所有 fresh Command / Consumer / Job 写路径使用以下固定顺序：

```text
canonical typed digest
  -> MemberUnitOfWorkManager::begin
  -> MemberIdempotencyStore::reserve
  -> only Reserved enters named application service / Job body
  -> load Versioned<T> and create successor / append
  -> save complete typed value / receipt / report
  -> MemberIdempotencyStore::complete
  -> commit
```

`Duplicate`、`InFlight`、`Conflict` 不进入业务 body。matching duplicate 只读取完整 typed stored carrier；missing / wrong-kind carrier fail closed。`MemberStoreVersion` 只能来自同一 Store 的 `Versioned<T>` read；version conflict 要求新的 UoW reload 并完整 re-evaluate，禁止 merge / overwrite。Query 不计算 digest、不 reserve、不写 result、不 refresh / rebuild / reconcile。`CommitStatusUnknown` 只能同 relation 检查，不能换 key 盲重试。24 个 outbound semantic candidates 在 `L2M-UP-005` 关闭前唯一结果是 `Blocked`，不产生 event、publisher、outbox、route 或 delivery receipt。

## 17. 完成门禁与停审

| 门禁 | 结论 |
|---|---|
| mutable truth、attempt / gap、mirror、projection、Consumer、Job 并发资源均有表格 | 通过 |
| 10 Command、14 Consumer、5 Job 幂等键可由 typed metadata / identity 计算 | 通过 |
| 16 Query 明确 no-write，24 candidates 明确 blocked | 通过 |
| digest include / exclude、relation channel / operation / key / digest / kind / ref 已闭合 | 通过 |
| Duplicate、Conflict、InFlight、missing carrier、version conflict、commit unknown 有处理顺序 | 通过 |
| partial Job、late feedback、fake / durable parity 有重入保护与测试切口 | 通过 |
| 上游 blocker / 设计 blocker 是否关闭 | 未关闭，已按规则显式保留 |
| 正式 `03-详细设计.md` 是否已回填 | 否；留 Step 19 |

下一步：在本 Step 停审记录后，读取 Step 14 SOP / 书写规范、`L1-governance` Step 14 及成员 Step 3 / 4 / 5 / 7 输入，创建 `03_ddd_step_14_configuration_external_bindings.md`。
