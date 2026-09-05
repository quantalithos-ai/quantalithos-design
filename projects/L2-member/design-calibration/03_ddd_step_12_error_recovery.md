# Step 12. 错误模型、异常分支与恢复口径

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md`
> 本文件状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 约束：这是 planned detailed-design contract，不是实现、运行、测试、事件投递、外部确认或运维证据。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12：错误模型、异常分支与恢复口径 |
| 输入基线 | 已停审的 Step 6～11；当前 `00/01/02` 正式设计；本项目 blocker 台账 |
| 输出 | `design-calibration/03_ddd_step_12_error_recovery.md` |
| 本步完成条件 | 错误有模块归属、对外 surface、异常分支和恢复分类；不把 blocker、transport 结果或外部 truth 伪写为本仓错误成功路径 |
| 停审结论 | 已完成本 Step 的设计收束；可按 full-03 授权串行进入 Step 13，正式 `03-详细设计.md` 仍仅在 Step 19 装配 |

## 2. 本步目标与非目标

本 Step 将 Step 6 的 public-carrier / domain validation、Step 7 的 Store / resolver / handoff / UoW Port failure、Step 8 的 Command / Query / Consumer / Job surface、Step 9 的异常分支、Step 10 的非法状态转换以及 Step 11 的版本、replay 和 commit 规则，收束为实现者可映射的分层错误模型。

实现者必须能据此判断：

1. 失败属于 `contracts`、`domain`、`application`、Port / adapter、`api`、`worker` 或 `jobs` 哪一层；
2. 请求应返回 `Rejected`、`Blocked`、`Waiting`、`Unknown`、`InFlight`、`Conflict`、安全 Query surface、Consumer receipt 或 Job disposition 中哪一种；
3. 是可在**同一 canonical relation** 下延后重试、必须由调用方修正、还是需要人工 / 实现前置修复；
4. local UoW 应 rollback、仅保存 typed non-positive result、还是可保存 member-local attempt / gap / degraded posture；
5. 哪些操作绝不构成 Runtime、host、downstream、observation、Tools、Governance、Conversation 或 Bus 的正向外部事实。

本 Step 不定义 HTTP / RPC code 数字、IPC / UDS 形态、Bus ack、topic、route、DLQ 名称、重试间隔、日志格式、告警阈值、物理数据库错误、锁产品、外部 SDK 错误文本或人工处置流程。这些没有当前 authority，且多数属于后续配置、可观测性、测试或运行设计。

## 3. 输入材料与使用边界

| 输入 | 本 Step 使用 | 不继承的内容 |
|---|---|---|
| Step 6 object contracts | `MemberContractError`、`DomainError`、状态对象、safe reason / typed ref / body-free 约束 | 不把 domain 变为 I/O、transport 或 raw-body 错误 owner |
| Step 7 Port / Adapter contracts | `MemberPortError`、`MemberExternalSeamOutcome<T>`、UoW / version / stored-result contract | 不把 adapter failure 直接暴露为 protocol body |
| Step 8 protocol contracts | `MemberWriteDisposition`、`MemberProtocolIssue`、Query surface、receipt、Job report / disposition | 不定义 member-specific wire envelope、route 或 event error schema |
| Step 9 flows | 10 Command、16 Query、14 Consumer、5 Job 及 24 blocked event candidate 的失败分支 | 不把伪代码视为已实现的 retry / delivery |
| Step 10 state matrix | `DomainError::IllegalTransition`、terminal / reserved transition 与 `L2M-DDD-004~007` 限制 | 不以 error handler 直接改写 state 字段 |
| Step 11 persistence | local rollback、optimistic version、typed replay、commit unknown、fake parity | 不选择 DB、DDL、outbox、queue、broker 或 retry product |
| `L1-governance` Step 12 | 错误层级、映射、恢复和 defect catalog 的组织粒度 | 不复制其 Governance truth、GRC、outbox 或 adapter 设计 |

## 4. 分批计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 12.1 | 目标、SOP 问题、错误层级与原则 | completed |
| 12.2 | domain / application / Port / protocol / worker / job 错误表 | completed |
| 12.3 | Command、Query、Consumer、Job、external seam 映射及异常分支 | completed |
| 12.4 | 恢复、marker 写入、delayed/rejected、consistency defect、反例与 Step 13 承接 | completed |

## 5. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 每个模块有哪些错误类型？ | `contracts` 有 `MemberContractError`；`domain` 有 `DomainError`；`application` 将 domain / port / resolution 后果归一为有限的 application error category；Port / infra 保留 `MemberPortError`；API 只输出 typed Command outcome 或 Query visibility surface；worker 只输出 typed Consumer disposition / receipt；jobs 只输出 typed Job disposition / report。 |
| 哪些错误映射到 HTTP / RPC / Event 失败？ | 当前只定义 transport-neutral protocol mapping。未来 HTTP / RPC adapter 可把 Command rejection 和 Query surface 映射到自身 transport；14 个 Consumer 映射为 receipt；24 个 outbound semantic candidate 尚无 event schema，不存在本仓 event failure contract。 |
| 哪些可重试？ | local technical unavailable、version conflict、`InFlight`、安全的 `Waiting` / `Unknown` 只能在后续正式 continuation 或相同 relation 的检查后重试；DTO、double anchor、body boundary、owner mismatch、unsupported schema、idempotency conflict、illegal transition 不可原样重试。missing stored carrier、commit unknown、缺 helper / contract、relation corruption 需人工或设计修复。 |
| 事务、并发、重复、外部失败如何处理？ | fresh write failure 在 commit 前 rollback；matching duplicate 只读精确 typed carrier；version conflict 不 merge；external seam 的 `Blocked/Waiting/Unknown` 只形成允许的 local non-positive outcome / attempt / gap，绝不推断外部 accepted、delivered、observed、healthy、authorized 或 ready。 |
| 哪些异常写审计、日志或事件？ | 本 Step 只定义 member-local trace / history / attempt / gap / projection-state / stored result 的写入资格。日志与指标切口留 Step 15；任何 member outbound event、publisher、outbox、route、DLQ 都被 `L2M-UP-005` 阻塞。 |

## 6. 错误设计原则

| 原则 | 强制口径 |
|---|---|
| 分层映射 | `domain` 不知晓 Store / IPC / Bus；`application` 是内部 error 到 public result 的唯一归一层；entry 不解析 Port error 文本。 |
| body-free | 错误只携带 `SafeReasonCategory`、`MemberProtocolIssue`、typed ref / blocker id；不得携带 raw source body、credential、prompt、plan、tool input/output、SQL、SDK、stack trace。 |
| Query no-write | Query 的 `NotVisible`、`NotReady`、`Stale`、`Degraded`、`NotAvailable` 或 Empty 只返回 surface，不 reserve、refresh、rebuild、reconcile、append 或修复。 |
| duplicate means replay | same channel + operation + key + canonical digest 的 duplicate 只读取 matching complete typed result / receipt / report；绝不重新执行业务 mutation、resolver、handoff、scan、projection 或 id generation。 |
| no silent retry | Store version conflict、unknown commit、unknown seam outcome、missing stored carrier 不得在 adapter / service 内自动 reload、merge、换 key 或重发。 |
| error is not truth | `Rejected`、`Blocked`、`Waiting`、`Unknown` 不变成 Runtime outcome、host session / health、delivery / observation confirmation、approval、conversation 或 capability truth。 |
| stable blocker | `L2M-UP-001~008`、`L2M-DDD-001~007` 与 `scope_supersede_gap` 进入 typed issue / blocker surface；不得通过默认配置、fake success、临时字符串或假阳性 error recovery 关闭。 |
| result relation integrity | accepted / non-positive stored result 与 idempotency completion 的 relation 必须是同一 UoW 的 exact record / channel / operation / digest / kind；缺失或错配属于 consistency defect，不从 current truth 重建。 |

## 7. 错误层级与可见性

```text
contracts factory / typed-ref guard
  -> MemberContractError
domain factory / policy / state transition
  -> DomainError
application orchestration and outcome mapping
  -> MemberApplicationErrorCategory
Store / resolver / handoff / UoW / idempotency adapter
  -> MemberPortError or MemberExternalSeamOutcome<T>
api mapper
  -> MemberCommandOutcome<T> / MemberQueryResponse<T>
worker mapper
  -> MemberConsumerReceipt
jobs mapper
  -> MemberJobApplicationResult / MemberJobRunResult / MemberJobReport
```

| Layer | 可见输入 | 允许输出 | 明确禁止 |
|---|---|---|---|
| `contracts` | typed primitive、opaque ref、safe category | `MemberContractError` | transport status、payload、secret、external body |
| `domain` | 已验证的 local value / safe owner-bound ref | `DomainError` | Port / UoW / adapter / protocol error |
| `application` | domain result、typed Port error / seam outcome、operation context | planned `MemberApplicationErrorCategory` 或 typed application result | 把 raw adapter detail拼入 issue；自行创造 owner truth |
| `infra` | typed Port input / UoW | `MemberPortError` 或 seam outcome | 将 private map / DB / SDK exception穿透 public API |
| `api` | named service output | Command outcome / Query surface | 把 `MemberPortError` 或 domain enum 直接序列化 |
| `worker` | validated logical envelope、service output | receipt disposition | 声称 ack、quarantine、delivery 或 source-body persistence 已发生 |
| `jobs` | finite typed job input、service output | Job disposition / body-free report | 将 local completion写成 external effect proof、scheduler run 或 evidence |

## 8. 错误类型表

### 8.1 `contracts` 与 `domain`

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `MemberContractError::MissingRequiredValue` | `contracts` | required opaque value、selector、safe reason 或必需 typed ref 缺失 | 否；调用方修正 DTO / carrier | Command `Rejected(InvalidContext)`；Query invalid-request surface；Consumer / Job `Rejected` |
| `MemberContractError::UnsafeCarrier` | `contracts` | body-free / low-cardinality boundary 被违反 | 否；必须移除禁止内容 | `Rejected(ContractViolation)`；Consumer 不入 application；Job 拒绝 |
| `MemberContractError::OwnerMismatch` | `contracts` | external wrapper 的 expected owner / subject kind 不匹配 | 否；必须重新取得正式 owner-bound ref | `Rejected(ContractViolation)` 或 `Blocked(BlockedDependency)`，不能降级为正向 outcome |
| `DomainError::MissingRequiredInput` | `domain` | factory / transition 的 safe input、reason、basis、双锚或 predecessor 缺失 | 否；调用方补齐受 authority 约束的输入 | Command / Consumer / Job `Rejected`；Query 不制造 error truth |
| `DomainError::IllegalTransition` | `domain` | Step 10 矩阵外、terminal 后或 reserved helper 缺失的 transition | 否；等待合法 trigger 或补充正式 helper | `Rejected(ContractViolation)` / `Conflict`；不得直接写 state |
| `DomainError::InvariantViolation` | `domain` | subject、identity anchor、purpose、scope、correlation、body-free 或 object relation 不一致 | 否；输入 / 设计修复 | `Rejected(ContractViolation)`；若发现于已保存对象则 consistency defect |
| policy non-positive result | `domain::policy` | screening、presence、outbound / trace material、mirror / read policy 合法地产生非正向结论 | 依 result 而定；`Blocked/Waiting/Unknown` 仅经正式 source 后再评估 | preserving `MemberWriteDisposition::{Blocked,Waiting,Unknown}` 或 Query safe surface；不是 error text |

### 8.2 `application` 归一错误分类

`MemberApplicationErrorCategory` 是本 Step 规定的 planned mapping vocabulary；它不授权实现一个 generic catch-all，也不替换 Step 8 已闭合的 typed result carrier。

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `InvalidContext` | `application` | name / DTO / metadata / double anchor / canonical projection 在 entry gate 后仍不一致 | 否 | `Rejected` + `MemberProtocolErrorCode::InvalidContext` |
| `ContractViolation` | `application` | domain invariant、illegal transition、typed relation 或 cross-layer contract 被违反 | 否；需修输入或设计 | `Rejected` + `ContractViolation`；不写 success fact |
| `NotAvailable` | `application` | exact local object、view、required source relation 或 local adapter当前不可用 | 可在正式 source / Store恢复后重试；不得凭空 create | Command / Job `Blocked` 或 `Waiting`；Query `NotAvailable` |
| `BlockedDependency` | `application` | named upstream / sibling / helper blocker 阻断正向路径 | 仅 blocker 关闭后按正式 flow | `Blocked` + blocker id；无 fake success |
| `WaitingForSource` | `application` | source feedback / resolution 还未形成可消费的 formal result | 可由新的 Consumer / Job / Command relation继续 | `Waiting` + `WaitingForSource`；非 timeout success |
| `UnknownSideEffect` | `application` | handoff、commit 或 owner result不可安全证明 | 不可盲重试；必须先检查 local relation / follow-up formal source | `Unknown` + `UnknownSideEffect`，或 constrained Query posture |
| `VersionConflict` | `application` | `MemberPortError::VersionConflict` 被映射 | 可用**新 UoW 的 reload + policy re-evaluation**重试；不能 in-place merge | `Conflict`；Consumer / Job 可按后续 continuation返回 `Waiting` / partial |
| `IdempotencyConflict` | `application` | same key 与 channel / operation / digest 不匹配 | 否；调用方使用原 relation 或不同合法 key | `Conflict` + `Conflict` issue；无 mutation |
| `InFlight` | `application` | matching relation 仍 `Reserved` / in processing | 是，但只能等现有 relation结论可读 | `InFlight`；无新 reservation / result |
| `StoredResultUnavailable` | `application` | completed relation 指向 missing / wrong-kind / wrong-relation carrier | 否；人工 / storage consistency repair | conservative `Blocked` / `Unknown` + `StoredResultUnavailable`；绝不 recompute |
| `CommitStatusUnknown` | `application` | UoW commit return 无法证明 local durable status | 不可盲重跑；先 inspect same idempotency relation | `Unknown` / `Blocked`；进入 consistency defect catalog |
| `ConsistencyDefect` | `application` | impossible stored relation、missing required sidecar、forbidden persisted body、broken projection dependency index | 否；人工 / design / migration repair | conservative non-positive surface；不得掩盖为 normal business reject |
| `DependencyUnavailable` | `application` | Store / technical adapter 当前不能提供 required capability | 是，依技术依赖恢复 | Command `Blocked` / `Waiting`；Consumer delayed-like receipt；Job partial / failed local disposition |

### 8.3 Port / infrastructure errors

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `MemberPortError::Missing` | Store / read Port | exact local record、indexed relation 或 stored carrier 不存在 | 视 source 而定；不得 scan 猜补 | `NotAvailable` / `BlockedDependency`；Query safe missing surface |
| `MemberPortError::VersionConflict` | Store / UoW | matching `MemberStoreVersion` 已过期 | 是，须按 Step 13 重入保护 | `VersionConflict` / `Conflict` |
| `MemberPortError::DuplicateKey` | Store | append-only identity / unique key 冲突但不是 explicit idempotency duplicate | 否；先判断 relation corruption | `ConsistencyDefect` / `ContractViolation`；不能转为 `DuplicateReplayed` |
| `MemberPortError::ConsistencyViolation` | Store / adapter | type、subject、scope、result kind、same-UoW、dispatch target 或 staging 关系不一致 | 否；需修复 | `ConsistencyDefect` / `ContractViolation` |
| `MemberPortError::DependencyUnavailable` | Store / technical adapter | required local Store、configured adapter 或 declared binding不可用 | 是，依 dependency恢复 | `DependencyUnavailable` / `BlockedDependency` |
| `MemberUnitOfWorkManager::begin` failure | UoW technical seam | logical local boundary无法创建 | 是 | `DependencyUnavailable`；不写 reservation / fact |
| `commit` failure / unknown | UoW technical seam | staged write 的 durable outcome未证实 | 不可盲重试 | `CommitStatusUnknown`；下一次仅检查 same relation |
| `rollback` failure | UoW technical seam | staged effects能否完全丢弃不明 | 否；人工检查 | `ConsistencyDefect`；绝不返回 Accepted |
| `MemberDigestPort` failure / unavailable | technical seam | canonical body-free digest无法得到 | 否直到 canonical contract / adapter可用 | `BlockedDependency` / `InvalidContext`；不 reserve |
| `MemberIdGeneratorPort` failure | technical seam | required local opaque ID无法生成 | 是，依 adapter恢复 | `DependencyUnavailable`；不构造 partial object |

### 8.4 External seam outcomes 不是 Port errors

| 结果 | 所属接缝 | 含义 | retry / recovery | 对外映射 |
|---|---|---|---|---|
| `Completed(T)` | owner-specific resolver / handoff | adapter 已得到允许进入 local policy 的 body-free result | 仍须由 domain / application validation；不代表 external truth更广结论 | successful local result 或后续 local attempt successor |
| `Blocked` | host、Runtime、identity、policy、route、Tools / Method 等 named blocker | 缺少正向 contract / binding | blocker关闭后由正式 flow重新评估 | `Blocked(BlockedDependency)` |
| `Waiting` | formal feedback / resolution | required source尚未到达或尚不可用 | 新的 formal input 或 continuation | `Waiting(WaitingForSource)` |
| `Unknown` | handoff / source side effect | transport / owner outcome无法证明 | 先读取 local attempt / gap / stored relation；禁止 blind repeat | `Unknown(UnknownSideEffect)` |

`Completed` 不等于 Runtime loop / context / plan / outcome 被本仓拥有，不等于 host registration / session / health，不等于 delivery / observation accepted，不等于 governance approval、conversation truth、capability registry 或 observability backend 记录。

### 8.5 Protocol / worker / job surface

| Surface | 触发条件 | 对调用方的意义 | 禁止事项 |
|---|---|---|---|
| `MemberCommandOutcome::Rejected` | invalid context、contract violation、domain reject | 修正输入或等待合法状态；不能把同一无效请求重放为 accepted | 不写 success trace / fact / attempt |
| `Blocked` | named blocker阻断 | 等 owner / sibling / schema / helper关闭后再走正式 flow | 不以 fake / default config 代替 |
| `Waiting` | feedback / source尚未形成可消费结果 | 等新 source / continuation；不是 success | 不构造 positive result |
| `Unknown` | local / external effect不可证明 | 保留 conservative relation，并通过正式检查恢复 | 不删除 attempt / gap 或 retry 产生新 body |
| `DuplicateReplayed` | complete matching stored carrier可读 | 返回原 carrier；不可观察 current truth差异 | 不调用 named service |
| `InFlight` / `Conflict` | relation仍在处理 / key relation不一致 | 等或修正 key；无新 write | 不覆盖 existing reservation |
| `MemberVisibilitySurface` | query visibility / freshness / availability non-positive | caller得到 `NotVisible/NotReady/Degraded/NotAvailable/Stale/Empty` 的安全阅读面 | 不变成 generic exception或 lazy repair |
| `MemberConsumerReceipt` | pre-gate、duplicate、accepted、blocked、waiting、unknown、inflight / conflict | logical dispatch conclusion；非 transport ack / DLQ proof | 不解析 unsupported payload、不保存 raw body |
| `MemberJobRunDisposition` + `MemberJobReport` | finite continuation的 local result | `Completed/PartiallyCompleted/Failed/DuplicateReplayed/Rejected` 只说明 local report | 不当作 scheduler run、evidence 或 external effect |

## 9. 内部错误映射表

### 9.1 Command mapping

| 内部错误 / 条件 | protocol mapping | 调用方应如何处理 |
|---|---|---|
| DTO/name/double-anchor/canonical input invalid | `Rejected` + `InvalidContext` | 修正请求；不期待 stored replay（pre-gate invalid不 reserve） |
| public carrier / domain invariant / illegal transition | `Rejected` + `ContractViolation` | 修正输入或等待合法 state；不得直接修改 state |
| required local record / legal source absent | `Blocked` 或 `Waiting` + `NotAvailable` / `BlockedDependency` | 等正式 source / relation出现；不得 scan / create |
| named upstream / sibling contract pending | `Blocked` + exact blocker id | 等 owner关闭 blocker；不使用默认 adapter |
| resolver / handoff returns `Waiting` | `Waiting` + `WaitingForSource` | 等 feedback / resolution，必要时走既有 continuation |
| resolver / handoff returns `Unknown` | `Unknown` + `UnknownSideEffect` | 查询 existing local attempt / gap / relation后再处理 |
| `VersionConflict` | `Conflict` + `Conflict` issue | 按 Step 13 使用新 UoW reload / re-evaluate；不 merge |
| idempotency same key different relation | `Conflict` | 使用原请求或新合法 key；不执行 mutation |
| matching duplicate complete carrier | `DuplicateReplayed` | 采用原 typed result / rejection；不重跑 |
| matching duplicate carrier missing / wrong kind | `Blocked` / `Unknown` + `StoredResultUnavailable` | 人工修复 local consistency；不从 current truth重建 |
| UoW commit unknown / rollback failure | `Unknown` / `Blocked` + conservative issue | 只检查 same relation；禁止换 key盲重试 |

### 9.2 Query mapping

| 内部错误 / 条件 | Query surface | 调用方应如何处理 |
|---|---|---|
| query body / selector invalid | transport-neutral invalid-request rejection | 修正 selector / request；无写入 |
| visibility basis absent / denied | `NotVisible`，可带 redaction profile ref | 不推断 target不存在；无 refresh |
| projection未达 requested consistency | `NotReady` | 等正式 Consumer / Job；Query不 rebuild |
| committed view stale / degraded | `Stale` 或 `Degraded` + reason / freshness | 接受有限阅读面或等待 rebuild；不写 marker |
| exact view / local adapter unavailable | `NotAvailable` | 稍后重读或等待依赖恢复；不 synthetic view |
| legal empty set | `Empty` | 视为空结果，不当作 error / missing truth |
| projection / sidecar relation corruption | constrained `Degraded` / `NotAvailable` + safe issue | 人工修复；不从 raw source / private map修补 |

### 9.3 Consumer / worker mapping

| 内部错误 / 条件 | receipt disposition | 调用方应如何处理 |
|---|---|---|
| envelope name/source/double anchor/schema invalid | `Rejected` 或 `UnsupportedVersion` | boundary停止；不得调用 application / parse forbidden body |
| no authorized inspection marker / forbidden body | `Rejected` + `ContractViolation` | 丢弃 body；只保留允许的 safe issue，不声称 quarantine已发生 |
| missing required local attempt / committed fact / resolution | `Blocked` / `Waiting` | 等正式 local predecessor或 owner source；不泛扫 Store |
| valid external result but owner seam blocker | `Blocked` | 记录 typed non-positive receipt only if contract可构造；`L2M-DDD-003` 未关闭时不伪造 detail |
| source feedback unavailable | `Waiting` | 不升级 delivery / observation / host truth |
| source / handoff effect unprovable | `Unknown` | 保存允许的 local fence / receipt，若 helper缺失则 fail closed |
| matching duplicate | `DuplicateReplayed` | 返回 exact stored receipt；不重检 body、不重新 resolver / handoff |
| in-flight / conflict | `InFlight` / `Conflict` | 不写新 local fact；等待 / 修正 producer relation |
| receipt missing / wrong kind | `Rejected` / `Blocked` + `StoredResultUnavailable` | fail closed，人工修复；不从 fact重建 receipt |

### 9.4 Job mapping

| 内部错误 / 条件 | Job disposition | 恢复口径 |
|---|---|---|
| input kind / finite refs / metadata invalid | `Rejected` | 修正 typed input；不扫描补全 |
| dependency / Store temporarily unavailable | `Failed` 或 `PartiallyCompleted` 的 local report issue | 可由相同 logical continuation在 dependency恢复后按正式策略重试 |
| source / gap / material absent | `Failed` / partial | 不构造 placeholder；等 formal predecessor或人工修复 |
| external handoff `Blocked` | `Rejected` 或 `PartiallyCompleted` with blocker issue | 等 blocker关闭；不调用 fallback |
| external handoff `Waiting` | `PartiallyCompleted` / `Failed` with waiting issue | 等 formal feedback / continuation |
| external handoff `Unknown` | `PartiallyCompleted` / `Failed` with unknown issue | 查 local attempt/gap；不 blind retry |
| projection helper / relation gap (`L2M-DDD-004~007`) | `Rejected` / `Failed` with blocker issue | 不越过缺失 factory / transition；targeted design repair |
| matching duplicate report | `DuplicateReplayed` | typed `get_job_report` 原样返回；不重新 scan / rebuild / relay |
| report missing / relation mismatch | `Failed` / conservative blocked surface | consistency repair；禁止 recompute |

### 9.5 24 个 outbound semantic candidate 的唯一错误口径

由于 `L2M-UP-005` 未关闭，24 项仅是 semantic candidate，不是 event、publisher、outbox item 或 transport job。任何“发布失败”“event retry”“dead-letter”都不在本仓当前可定义范围。其唯一合法结果是：在需要正向 event contract 的 flow / test / config 处返回 `Blocked(BlockedDependency, L2M-UP-005)`；不得创建 fake envelope、route、publisher error、outbox state或 delivery receipt。

## 10. 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写 member-local audit / event |
|---|---|---|---|
| Command entry pre-gate invalid | API logical entry | 返回 typed rejection；不建 context / digest / reservation | 不写 fact、trace、attempt、gap、stored result或 event |
| Command domain reject after valid reservation | named application service | 同一 UoW 保存完整 `MemberCommandRejection`，complete reservation；无 accepted truth | 仅 typed rejection / result relation；无 success trace / event |
| Command blocked / waiting / unknown after valid relation | named application service | 只保存能由 Step 8 完整表达的 non-positive carrier；对应 seam outcome不得被正向化 | 可保存 allowed local relation；不写外部 success |
| Command target missing / version conflict | Store save / read | rollback fresh domain change；映射 `Blocked/Conflict` | 无 success fact / trace / attempt |
| Command duplicate | idempotency reserve | rollback current UoW，再 read exact typed carrier | 无新写入 / event |
| Command stored carrier missing | typed result Store | fail closed；不回到 service重算 | 不写 substitute result |
| UoW begin failure | application before first stage | 返回 dependency unavailable | 无写入 |
| UoW commit unknown | manager commit | 返回 unknown / blocked；后续只检查 same relation | 不写补偿 truth / duplicate result |
| Query invalid | Query entry | safe rejection | 无写入 |
| Query not visible / stale / unavailable | read policy / read Port | 返回 corresponding visibility surface | 无 refresh、rebuild、reservation、marker或 event |
| Consumer unsupported schema | worker pre-gate | `UnsupportedVersion`，不解析 / persist body | 不写 local fact / screening / projection；不声称 DLQ |
| Consumer forbidden body / source mismatch | worker body / source gate | `Rejected`，不进入 service | 无 snapshot、receipt detail伪造或 event |
| Consumer accepted local write failure | Store / UoW | rollback; map to `Waiting/Blocked/Conflict` by exact error | 无 partial fact / receipt |
| Consumer duplicate | idempotency reserve | only `get_consumer_receipt` | 无 body reinspection、source reread、fact / gap / marker write |
| Host / Runtime / publication / observation seam failure | named service / relay | `Blocked/Waiting/Unknown` only; preserve local prepared material / valid attempt | permitted local successor / gap only when existing helper allows; no external proof |
| projection rebuild input / view assembly failure | CP07 Job service | report local failure / partial; retain source truth | may append allowed projection-state successor; never repair CP01~06 truth |
| CP06 source resolve failure | mirror service / Job | append only legitimate resolution / gap result; unavailable adapter is application error, not inferred source state | no policy / credential / capability body copy |
| helper absent (`L2M-DDD-004~007`) | factory / transition point | stop before write; expose named blocker | no direct field mutation or fake successor |
| event candidate requested | any future publication point | `Blocked L2M-UP-005` | no envelope, outbox, publisher, route or event |

## 11. 恢复口径表

| 场景 | 分类 | 恢复方式 | 禁止事项 |
|---|---|---|---|
| local Store / technical adapter temporarily unavailable | retryable dependency | 在依赖恢复后，以同一 canonical relation重新检查 / 继续；具体 schedule待配置 / runtime authority | 改 key绕过幂等、fallback到 private map |
| optimistic `MemberStoreVersion` conflict | retryable after re-evaluation | 新 UoW reload exact version，再执行完整 domain guard / policy；只要仍合法才产生新 successor | stale version覆盖、自动 merge、用 revision / watermark代替 version |
| matching `InFlight` | retry later | 等现有 relation complete，再读取 typed carrier | 另起同 key mutation、猜测 outcome |
| source `Waiting` | continuation-required | 等正式 feedback / resolution或显式 future Job input | 把 timeout变成 success / accepted |
| side effect `Unknown` | inspect-first | 读取 member-local attempt / gap / stored relation，再由正式 source / flow推进 | direct resend、create a second claim、erase unknown marker |
| valid blocker | blocked | 等 identified owner关闭 blocker；重新走 typed mapping | default config、fake completed、自由字符串 adapter |
| invalid context / unsafe carrier / owner mismatch | non-retryable same input | 调用方提供经过 authority验证的 DTO / ref | 删除验证、保存 raw body、猜 owner |
| illegal transition / invariant failure | non-retryable same state | 等合法 Command / Consumer / Job trigger或 targeted design correction | set status field、将 terminal重开 |
| idempotency conflict | non-retryable same key | 使用 existing request，或以不同、合法且独立的 operation key执行 | 覆盖 existing relation / rewrite digest |
| missing / wrong stored carrier | manual consistency repair | 修复 idempotency / result relation后由 duplicate path再读 | 从 current truth / adapter response重算结果 |
| UoW commit unknown / rollback unknown | manual / same-key audit | 先读取 same relation并判定 local commitment；必要时运维检查 physical store（尚未选型） | 用新 key重复 mutation、compensating truth写入 |
| forbidden persisted body / impossible typed relation | manual data / design repair | 停止暴露正向结果、隔离 / 修复后重新校准 | 将 body复制到 trace / report、静默清除 history |
| missing legal helper / source contract | targeted design repair | 关闭对应 `L2M-DDD-*` 或 `L2M-UP-*` 后重新评估受影响 flow | private helper、fake state transition、schema shadow |

## 12. local trace、history、marker 与 stored-result 写入规则

这里的“写入”仅指 Step 11 所定义的 member-local logical Store / append-only record / successor；不表示 observability backend、Bus event、outbox、host status、Runtime outcome或外部 ledger。

| 分支 | local fact / history | local attempt / gap / projection marker | stored result / receipt / report | event / external truth |
|---|---|---|---|---|
| accepted Command | 仅该 Command 的 Step 9 flow规定的 local fact / history | 如该 flow已有合法 helper与关系，可同 UoW写必要 local marker | 保存 complete accepted result后 complete | 不生成 event；不证明外部成功 |
| valid-relation Command rejection | 不写 accepted fact / success trace | 不写 positive attempt / gap，除非具体 flow已定义 non-positive local object | 保存 complete typed rejection后 complete | 无 event / external truth |
| Command blocked / waiting / unknown | 不写 success fact | 仅 existing factory允许时写 local attempt / gap / posture | 保存完整 non-positive typed carrier时才 complete | 无 external proof |
| matching duplicate | 无新写入 | 无新写入 | read exact carrier only | 无 event |
| Query any result | 无写入 | 无写入 | 无 stored result | 无 event |
| accepted Consumer | 仅所属 CP 的 local fact / safe snapshot / resolution / feedback link | only required local stale / gap / attempt successor | complete typed receipt同 UoW保存 | 无 event / ack / delivery proof |
| Consumer pre-gate reject / unsupported | 无 local business write | 无 | receipt只有在 future formal contract明确可保存时才可；当前不伪造 | 无 event / DLQ claim |
| Job partial / failure | 不改 source fact | only legal local attempt / gap / projection successor | body-free report记录 advanced / unresolved refs | 无 event / external-effect claim |
| local consistency defect | 不补造新 truth | 保留可读既有关系；不得覆盖历史 | 不得伪造 replacement result | 无 event |

**`L2M-UP-005` fence：** 本表中的 “event” 始终为无。24 个 semantic candidate 未成为 envelope / outbox / publisher；本 Step 不引入 dead-letter record 或 event failure marker。

## 13. Rejected、Blocked、Waiting、Unknown、Delayed 与 dead-letter 语义

| 名称 | 当前是否为本仓正式 surface | 含义 | 写入 / 恢复 |
|---|---|---|---|
| `Rejected` | 是 | input / contract / policy在当前边界不可接受 | 修正 input / state；无 positive fact |
| `Blocked` | 是 | named contract、binding、source或 helper未就绪 | 保留 blocker id；待 owner关闭；无 fallback |
| `Waiting` | 是 | required formal feedback / resolution尚未形成 | 等新 source或显式 continuation；不是 retry success |
| `Unknown` | 是 | local / external side effect无法安全证明 | inspect existing local relation first；不盲重试 |
| `InFlight` | 是 | matching idempotency relation仍在处理 | 等同一 relation完成；不得并发重入 |
| `Conflict` | 是 | same key与 channel / operation / digest不匹配，或 optimistic control冲突 | 修正 key / retry after re-evaluation；不覆盖 |
| `Delayed` | 否，只有未来 worker runtime可能映射 | 当前设计不拥有 queue / retry schedule / ack | 若将来 owner定义，可从 `DependencyUnavailable` / `Waiting` 映射，但不得先写成 receipt / queue truth |
| `DeadLettered` | 否 | 当前没有 member event / outbox / broker item | `L2M-UP-005` 前不得创建此状态、record或操作 |

## 14. Consistency defect catalog

以下问题不是可掩盖为业务 `Rejected` 的普通输入错误；它们需要人工、实现前契约或物理存储修复，且 public surface 必须保持保守。

| defect | 检测位置 | 当前强制响应 |
|---|---|---|
| completed idempotency record找不到 matching typed Command / Consumer / Job carrier | duplicate replay | `StoredResultUnavailable`；不重跑、不从 current truth重建 |
| stored carrier的 channel / operation / digest / result kind / subject relation错配 | typed result getter | `ConsistencyDefect`；不把任一 carrier强转为 duplicate |
| mutable save使用不是同一 versioned read取得的 `MemberStoreVersion` | Store adapter / service review | `VersionConflict` / `ConsistencyDefect`；不以 domain revision补偿 |
| rollback / commit durable status未知 | UoW manager | `CommitStatusUnknown`；后续只同 relation检查 |
| immutable fact、material、snapshot、resolution、view或trace被 overwrite / delete | Store adapter | consistency defect；保留 history、停止正向结论 |
| query产生 reservation、append、refresh、rebuild、repair或cache truth | Query handler / adapter audit | contract violation；必须移除 write path |
| raw external body、credential、LLM reasoning、tool payload或外部 truth进入 local error / report | boundary validator / storage audit | unsafe carrier / consistency defect；不得继续暴露 |
| CP04/CP05/CP06/CP07 helper未存在却直写 successor | service / state audit | `L2M-DDD-004~007` blocker；不得绕过 factory |
| 把 `Completed` seam outcome、local attempt或 feedback ref升级成 host/runtime/downstream/observation成功 | application / adapter audit | contract violation；保持 local-only posture |
| 24 event candidate被表示为 event / publisher / outbox / DLQ | any implementation planning point | `L2M-UP-005` blocker；删除无 authority 的设计假设 |

## 15. Error anti-patterns

| 反例 | 为什么无效 | 正确规则 |
|---|---|---|
| 将 `MemberPortError` 原样返给 API / worker | 泄露 infra结构，且调用方无法得到稳定处理语义 | application 映射为 `MemberProtocolIssue` / typed surface |
| Query 读不到 view时同步 refresh / rebuild | 违反 Query no-write，掩盖 freshness | 返回 `NotReady/Degraded/NotAvailable` |
| duplicate 从 current object组装新结果 | result可能不同于原 transaction | 只读 exact stored typed carrier |
| version conflict后在 adapter内静默 reload / merge | 绕过 policy重评估与 idempotency | 返回 conflict；Step 13定义新 UoW重入规则 |
| `Unknown` 后立即重投 runtime/publication/observation | 可能重复外部副作用 | inspect local attempt / gap / source relation first |
| `Blocked` 用 default route、launch token、UDS、CloudEvents或 fake success绕过 | 旧材料未获当前 authority | 保留 exact blocker，等待正式契约 |
| Consumer unsupported schema仍解析 payload以找 subject | 违反 source / body gate | 不 parse，返回 `UnsupportedVersion` |
| stored receipt缺失时按 current facts重建 | 打破 duplicate / audit语义 | `StoredResultUnavailable`，人工修复 |
| 把 `Delayed` / dead-letter写成已存在worker或bus能力 | 当前无 queue / outbox / event contract | 仅记录 future authority gap，不能实现 / 设计为本仓 truth |
| 将 job report写成 run id、artifact、evidence、verdict或 readiness | 超出 `MemberJobReport` body-free local continuation边界 | 仅报告 committed local refs、unresolved refs和 typed issues |

## 16. 正式正文回填与前序承接

| 正式 `03` 章节 / 前序材料 | Step 19 必须回填的口径 | 来源 |
|---|---|---|
| §5 modules / objects | `contracts`、domain、application、Port、entry的 error ownership和禁止穿透规则 | §7、§8 |
| §7 protocol | `MemberWriteDisposition`、`MemberProtocolIssue`、Query surface、receipt、Job error mapping | §8.5、§9 |
| §8 processing flows | pre-gate / rollback / duplicate / blocked / waiting / unknown / commit-unknown branch | §10、§11 |
| §9 state matrix | `IllegalTransition`、reserved helper与 `L2M-DDD-004~007` 的 fail-closed handling | §8.1、§10、§14 |
| §10 persistence | stored result missing、version conflict、rollback、commit unknown、append-only recovery | §8.2～8.3、§11、§14 |
| §11 error recovery | 错误表、映射、异常分支、恢复与 anti-pattern | 全文 |
| §13 observability | log / metric / audit切口只能引用 safe error category、issue、blocker、typed ref；不可记录 raw body / secret | §6、§12 |
| §14 tests | retry / conflict / duplicate / no-write / unknown / defect边界的 planned test cut | §11、§14 |

## 17. 跨 Step 闭环审计

| 审查项 | 设计结论 | 保留问题 |
|---|---|---|
| Step 6 domain / contract error是否有 surface | 已将 `MemberContractError`、`DomainError` 映射为 finite protocol / receipt / job outcome | 具体 Rust `ApplicationError` enum仍属 planned implementation，非现有代码 |
| Step 7 Port / UoW error是否可分类 | `Missing`、version、duplicate key、consistency、dependency、commit / rollback均有处理 | 无物理 Store / UoW产品，不能声明实际 retry behavior |
| Step 8 result / replay是否保持 typed | matching duplicate only exact typed carrier；missing result fail closed | `L2M-DDD-003` 继续限制 Consumer detail闭合 |
| Step 9异常分支是否归一 | Command、Query、14 Consumer、5 Job、blocked event candidate均有归属 | CP04～07 helper / source gap继续被 `L2M-DDD-004~007` 限制 |
| Step 10非法 transition是否不被 error handler绕过 | 所有非法 / reserved state写入均返回 contract violation | targeted helper补齐前不能进入正向实现 |
| Step 11 transaction / replay是否不制造外部 truth | rollback、commit unknown、typed replay、Query no-write明确 | 物理 transaction / repair strategy待目标实现仓与配置设计 |
| event / outbox是否未被误造 | 24 candidate仅能 Blocked | `L2M-UP-005` open |
| sibling / upstream边界是否未被伪关闭 | external seam only `Completed/Blocked/Waiting/Unknown` | `L2M-UP-001~008` open |

## 18. Step 13 承接

| Step 13 topic | 本 Step 输入 |
|---|---|
| concurrent mutable update | `VersionConflict` 只能以同 Store version读取、新 UoW重评估的错误 / recovery边界 |
| idempotency key / relation | duplicate、in-flight、conflict、stored carrier missing和 commit unknown语义 |
| reentrant Consumer / Job | duplicate不重检 body、不重扫、不重建、不重投 seam的规则 |
| external unknown | `Unknown` 必须 inspect-first、不可 blind retry的口径 |
| partial continuation | Job `PartiallyCompleted/Failed` 只能以 local report表达，不证明外部结果 |
| test cuts | conflict、duplicate、missing carrier、no-write query、blocked / waiting / unknown等最小验证场景 |

## 19. Stop-review checklist

| 检查项 | 结论 |
|---|---|
| error 类型覆盖 contracts / domain / application / Port / api / worker / jobs | completed |
| Command / Query / Consumer / Job / external seam均有对外 mapping | completed |
| retryable、non-retryable、人工 / design repair已分开 | completed |
| rollback、version conflict、duplicate、commit unknown、external failure有处理口径 | completed |
| Query no-write、typed replay、append-only与body-free boundary未被错误路径绕过 | completed |
| 24 event candidate未被误写为 event / publisher / outbox / DLQ | completed / blocked_by_L2M-UP-005 |
| 上游 / sibling / helper blocker未被伪关闭 | completed / pass_with_blockers |
| 正式 `03-详细设计.md` 是否写入 | no；留 Step 19 |

```text
current_step = Step_12_error_recovery_completed_stop_review
gate_status = completed_pass_with_upstream_and_design_blockers_stop_review
next_allowed_action = begin_step_13_concurrency_idempotency
formal_03_write_allowed = false_until_step_19
implementation_repo_write_allowed = false
commit_required = false
```
