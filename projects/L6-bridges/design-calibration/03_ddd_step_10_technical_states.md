# L6-bridges 03 Step10：技术 phase 与有限结果消费

本附录只展开 Step6 已存在的四个 runtime/entry/adapter-local 载体：`RuntimeExecutionState`、`JobInvocationState`、`PlatformSourceSession`、`WorkerSchedulingBatch`。它们不是 Bridges 业务真相、平台成功状态或全局水位，也不增加 Domain 对象、port、outbox、run/report/evidence。状态名和成员以 Step6/Step7 原合同为准；这里仅给出 Step10 的 guard、非法边、副作用和 planned 测试切口。

## 1. 边界与共同纪律

| 载体 | 所属 | 保存什么 | 明确不保存/不代表 |
|---|---|---|---|
| `RuntimeExecutionState` | Infra `runtime/execution.rs` | 本地宿主 phase、装配资格、bounded budget、实际 unresolved 原 operation/effect 集合 | 业务提交、平台连接成功、全局运行水位、外部效果已撤销 |
| `JobInvocationState` | Jobs `invocation.rs` | 一次受信 bounded job 的 plan、调用 phase、当前安全结果、实际 unresolved 集合 | 平台/owner/consumer 成功、所有候选已完成、run/report/evidence |
| `PlatformSourceSession` | Worker `platform_sessions.rs` | 单一 installation/family/source/mode 的 session、epoch、session id、phase、bounded budget | stream cursor/gap coverage、平台全局水位、历史消息已消费 |
| `WorkerSchedulingBatch` | Worker `scheduling.rs` | 已获准候选、owned plan/in-flight、index、bounded 返回结果与 unresolved、batch phase | 新 operation、retry 权、平台投递成功、空页即全量完成 |

四机都遵守：

1. 四个技术载体的`from_parts`只接受各自合法初态，只有进程本地字段；Step6/7没有其`rehydrate`、local revision或repository，不新增durable恢复面。Domain原对象的`rehydrate`纪律不能套给这些载体。
2. phase 变化只在实际 entry/host 事实后发生；clock、lease、ACK、错误文字不能映射成业务成功。
3. 本地取消、断连、deadline、drop 和 shutdown 只能保留/合并 unresolved，不能把未知改成 `NoEffect`，不能清除原 operation/effect。
4. 技术 phase 本身不写 `SafeAuditRecord`；它所触发的 Application mutation 仍须遵循所属 UoW、CAS、dedup、immutable seed 和条件 handoff 规则。

以下`CV`为pure成员的实际返回，`PE`仅宿主调用资格/driver/dispatcher时的已有安全错误，不由pure方法返回或凭错误推进phase。全签名分别回指[Step6 Infra](03_ddd_step_06_infra_contracts.md#runtimeexecutionstate)、[Step6 Entry](03_ddd_step_06_entry_contracts.md#jobinvocationstate)及[Step7 Entry覆盖](03_ddd_step_07_entry_contracts.md#41-共同边界与所有权纠正)；本附录不新增签名。

## 2. M18 / `RuntimeExecutionState` / `RuntimeExecutionPhase`

### 状态与 ASCII

`RuntimeExecutionPhase` exact 状态为 `Constructed`、`Active`、`Draining`、`StoppedLocal`、`StoppedWithUnknown`。初始 `Constructed`，只有全部 required seam 的 actual current qualification 成立才能开始。

| 状态 | 作用 | 本实例终态 | 允许关键操作 |
|---|---|---|---|
| Constructed | 只已构造，尚未启动 | 否 | begin，须actual全部required资格 |
| Active | 本地宿主接收获准工作 | 否 | begin_shutdown，不授业务成功 |
| Draining | 不接新项，等待local收束并保原unknown | 否 | record_local_stop，未决不清除 |
| StoppedLocal | 本地停止且actual未决集合为空 | 是 | 只读本地phase，不复活实例 |
| StoppedWithUnknown | 本地停止且原op/effect仍未决 | 是 | 交原恢复责任，零新work/NoEffect推断 |

```text
from_parts
    |
    v
Constructed --begin(all required current)--> Active --begin_shutdown--> Draining
                                                                          |
                                                         record_local_stop(actual unresolved)
                                                                          |
                                                 +------------------------+------------------+
                                                 v                                           v
                                          StoppedLocal(empty)                    StoppedWithUnknown(non-empty)
```

`StoppedLocal` 只表示本地停止时 unresolved 集合为空；`StoppedWithUnknown` 表示仍有原 operation/effect 未决。两者都没有本次实例回边，也不能被新宿主当作旧业务已完成。

### 转换矩阵

| From | To | 具名成员 / 宿主触发 | 必要 guard | 副作用上限 | 非法处置 |
|---|---|---|---|---|---|
| Constructed | Active | `RuntimeExecutionState::begin` @ runtime composition | `RuntimeRequiredSeams` 全部 Required seam actual current、`RuntimeAvailability::Qualified`、budget 有界、actual now | 只建立本地 host；不创建业务 effect | `CV::InconsistentFields` / `CV::MissingRequired` / `PE::NotEstablished` |
| Active | Draining | `begin_shutdown` @ runtime host | 仅Active；shutdown_budget bounded、四资源元组与原budget全等；deadline由受信host在本次停止事件经同域clock+批准窗口checked派生；全部guard通过后替换budget，输入unresolved与既有集合并集 | 本地停止旗标；不撤销外部IO；guard失败零修改 | `CV::InconsistentFields` / `CV::UnknownEffect` |
| Draining | StoppedLocal | `record_local_stop` | 实际 unresolved 集合为空，所有 scoped wait/session 已结束 | 只写本地 phase | `CV::UnknownEffect` / `CV::InconsistentFields` |
| Draining | StoppedWithUnknown | `record_local_stop` | 实际 unresolved 集合非空，逐项保留 typed 原 op/effect | 只写本地 phase；交 Application 原恢复责任 | `CV::InconsistentFields` |

`begin_shutdown` 不能从 `Constructed`、`Stopped*` 调用；`record_local_stop` 不能在仍 Active 或有未回收 scoped work 时伪造 `StoppedLocal`。`RuntimeExecutionPhase` 不与 `DeliveryIntentState`、`InboundHandoffState` 或 `SafeHandoffState` 合并。

### 单机停审

| 项目 | 结论 |
|---|---|
| exact enum、4 条迁移、成员回指 | `pass_design_static`；与 Step6 Infra 卡和 Step7 shutdown 顺序一致 |
| unknown/取消/secret/平台边界 | `fail_closed_external`；未选 runtime/provider/四平台不改变 phase 结论 |
| planned 切口 | A/C/L/P/I/W/J：required seam 缺失、shutdown unresolved 并集、deadline/drop 不清 unknown、无 detached task；未执行 |

## 3. M19 / `JobInvocationState` / `JobInvocationPhase`

### 状态与 ASCII

exact 状态为 `Pending`、`Dispatched`、`CompletedLocal`、`CancelledLocal`、`Indeterminate`。`CompletedLocal` 只表示本次 bounded invocation 已返回且没有 unresolved，不表示平台/owner/consumer 成功。

| 状态 | 作用 | 本调用终态 | 允许关键操作 |
|---|---|---|---|
| Pending | 原bounded plan尚未交Application | 否 | mark_dispatched/cancel_local_wait |
| Dispatched | actual已交Application，非提交证明 | 否 | record_returned/cancel_local_wait |
| CompletedLocal | actual summary已返回且无未决 | 是 | into_parts，按原plan移交safe结果 |
| CancelledLocal | 仅停止本地等待，原unknown仍保留 | 是 | into_parts交停止/未决分支，零自动重入队 |
| Indeterminate | 原调用带未决结果，禁止推成功 | 是 | into_parts保原身份，交恢复责任 |

```text
from_parts(plan, Pending, None)
        |
        +--mark_dispatched--> Dispatched --record_returned(no unresolved)--> CompletedLocal
        |                           |  \--record_returned(unresolved/unknown)--> Indeterminate
        |                           \--cancel_local_wait-----------------------> CancelledLocal
        \--cancel_local_wait----------------------------------------------------> CancelledLocal
```

### 转换矩阵

| From | To | 具名成员 / flow | 必要 guard | 副作用上限 | 非法处置 |
|---|---|---|---|---|---|
| Pending | Dispatched | `mark_dispatched` @ 五 J entry | plan/context/continuity/budget/runtime qualification actual valid；实际已交 Application | 不创建新 op；只 phase 变更 | `CV::InconsistentFields` / `PE::Denied` / `PE::NotEstablished` |
| Pending | CancelledLocal | `cancel_local_wait` @ local cancel | 只停止本地等待；unresolved 取并集，不清旧项 | 不撤回 claim/IO，不生成 no-effect | `CV::UnknownEffect` / `CV::InconsistentFields` |
| Dispatched | CompletedLocal | `record_returned` @ 五 J result | actual bounded `SafeJobResultSummary` 可见且 unresolved 为空；原 plan/subject/op 一致 | 只保存 local result；不宣称 foreign success | `CV::MissingRequired` / `CV::OutOfScope` / `PE::Unavailable` |
| Dispatched | Indeterminate | `record_returned` @ J/driver unknown | 返回或错误携同 invocation 原 unresolved；不能以空结果覆盖已有 unknown | 保原 op/effect；交恢复责任 | `PE::Indeterminate{original,phase}` |
| Dispatched | CancelledLocal | `cancel_local_wait` @ shutdown | actual local cancellation；可能已产生 effect 时 unresolved 必须保留 | 不重入队、不换 operation | `CV::UnknownEffect` |

`into_parts` 是 Step7 为 Worker 所需的一次性 owned carrier，不是 phase 迁移；只有 `CompletedLocal + Some(result)` 可交 batch 的 `record_returned`。`CancelledLocal`、`Indeterminate` 或无结果必须进入 batch unresolved/stop 分支。不能从 `ApiEntryDisposition::AdmittedForDispatch` 直接构造 `CompletedLocal`。

### 单机停审

`pass_design_static_fail_closed`：5 个 exact phase、5 条迁移、`mark_dispatched`/`record_returned`/`cancel_local_wait`/`into_parts` 与 Step6/7/8/9 一致；`CompletedLocal`、`CancelledLocal`、`Indeterminate` 的语义不跨越业务状态。planned A/C/L/I/W/J，未执行。

## 4. M20 / `PlatformSourceSession` / `SourceSessionPhase`

### 状态与 ASCII

exact 状态为 `Configured`、`Active`、`Disconnected`、`NotEstablished`、`Stopped`。每个 installation/family/source/mode 只能有一个 active session；epoch 变化不能比较旧 position。

| 状态 | 作用 | 本session终态 | 允许关键操作 |
|---|---|---|---|
| Configured | 原source注册已构造，尚未实际连接 | 否 | record_connected/record_unavailable/stop_local |
| Active | actual source/session/epoch已核 | 否 | record_disconnect/stop_local，零业务水位推断 |
| Disconnected | actual断开，保旧epoch/session | 否 | record_connected/record_unavailable/stop_local |
| NotEstablished | 当前source/mode资格未齐 | 否 | record_connected完整重核/stop_local |
| Stopped | 本地session已停止，未证明history覆盖 | 是 | 只读；新session另from_parts/资格，不复活旧实例 |

```text
Configured --record_connected--> Active --record_disconnect--> Disconnected
     |                              |                            |
     |                              +--stop_local--> Stopped     +--record_connected--> Active
     +--record_unavailable--> NotEstablished --record_connected--> Active
     |                              |                            +--record_unavailable--> NotEstablished
     +------------------------------+----------------------------+--stop_local--> Stopped
```

连接成功仅在 actual `PlatformSourceConnection`、registration/source/mode/epoch/basis/validity 全部核验后调用 `record_connected`。`None` poll、session sequence、message id、timestamp、队列空和 reconnect 都不能推进 cursor、关闭 gap 或证明 coverage。

### 转换矩阵

| From | To | 具名成员 / flow | 必要 guard | 副作用上限 | 非法处置 |
|---|---|---|---|---|---|
| Configured | Active | `record_connected` @ E01/E03 runner | same registration/family/mode/source；epoch actual；stateful mode session Established；basis kind exact | 只保存 adapter-local session；不写 cursor/gap | `CV::WrongKind` / `CV::MissingRequired` / `PE::NotEstablished` |
| Configured | NotEstablished | `record_unavailable` @ connect failure | actual qualification/connection 缺口与 finite reason | 保历史，不造 Active | `CV::InconsistentFields` |
| Configured | Stopped | `stop_local` @ shutdown | host stop sequence actual | 只本地停止 | `CV::InconsistentFields` |
| Active | Disconnected | `record_disconnect` @ driver/source loss | actual disconnect；保旧 epoch/session | 仅通知 Application 记录 gap 的输入；不直写 gap | `CV::InconsistentFields` |
| Active | Stopped | `stop_local` | 停止接收并 close local host | 不证明外部无效果 | `CV::InconsistentFields` |
| Disconnected | Active | `record_connected` @ qualified reconnect | 新/同 epoch actual proof；不得跨 epoch 比较 position | 只建立本地连接 | `CV::WrongKind` / `PE::Stale` |
| Disconnected | NotEstablished | `record_unavailable` | actual source/mode/binding 缺口 | 保 old epoch/session | `PE::NotEstablished` |
| Disconnected | Stopped | `stop_local` | actual stop | 只本地停止 | `CV::InconsistentFields` |
| NotEstablished | Active | `record_connected` | 完整新 qualification；不能从配置 bool 推断 | 只保存 session | `PE::NotEstablished` / `CV::MissingRequired` |
| NotEstablished | Stopped | `stop_local` | actual stop | 只本地停止 | `CV::InconsistentFields` |

`Stopped` 无本次实例回边；新 session 必须新建载体并重新取得 qualification，不得复活旧 session 或跨 epoch advance。平台 SDK/OAuth/API Key/KMS/Gateway/poll 参数仍是未选 seam，本文不填具体产品值。

### 单机停审

`pass_design_static_fail_closed`：5 状态、10 条迁移与 Step6 Entry/Step7 Worker 连接及 shutdown 合同一致；session active 不等平台全局水位，disconnect 不自动 retry。planned B/C/I/P/W/J，未执行。

## 5. M21 / `WorkerSchedulingBatch` / `WorkerBatchPhase`

### 状态与 owned-plan 纪律

exact 状态为 `Collected`、`Dispatching`、`CompletedLocal`、`StoppedLocal`、`StoppedWithUnknown`。factory 只允许 `Collected/index=0/returned empty/in_flight=None`；候选数不能超过 bounded limit。最终 Step7 的 owned API 是 `take_next_plan`，不是早期借用 `next_plan` 草案。`CompletedLocal`仅本batch候选/在途返回收齐或空batch；按原卡unresolved仍保留，并不要求原继承集合为空，也不等任何foreign成功。Jobs M19的`CompletedLocal`有其独立无未决guard，不能移植给batch。

| 状态 | 作用 | 本batch终态 | 允许关键操作 |
|---|---|---|---|
| Collected | actual bounded候选/index0，无在途 | 否 | take_next_plan/stop_local |
| Dispatching | 原owned plan顺序分派/返回 | 否 | record_returned/take_next_plan/stop_local，各核in_flight |
| CompletedLocal | 原候选消费/返回已收齐或空batch，unresolved仍保留 | 是 | 只读bounded summary/原未决，不等foreign成功 |
| StoppedLocal | 本地停止且原未决/在途为空 | 是 | 只读；不证明所有外部动作完成 |
| StoppedWithUnknown | 本地停止且仍有原在途/unknown | 是 | 原identity交恢复责任，零重入队/新operation |

```text
from_parts(candidates, Collected, index=0)
       |
       +--take_next_plan(has item)--> Dispatching --more item--> Dispatching
       |                                  |
       |                                  +--all actual returns/no in-flight--> CompletedLocal
       |                                  +--stop_local(empty unresolved)-----> StoppedLocal
       |                                  +--stop_local(non-empty)-------------> StoppedWithUnknown
       \--take_next_plan(no item)--> CompletedLocal
```

### 转换矩阵

| From | To | 具名成员 / flow | 必要 guard | 副作用上限 | 非法处置 |
|---|---|---|---|---|---|
| Collected | Dispatching | `take_next_plan` @ worker scheduling | candidate head current/budget/scope valid；`in_flight=None`；成功后才消费 index 并建立 owned plan | 无 IO；不 mint operation/key | `CV::InconsistentFields` / `CV::Expired` / `PE::Conflict` |
| Collected | CompletedLocal | `take_next_plan(None)` @ empty bounded batch | 无候选、无 in-flight；继承unresolved不清，空页不是coverage | 只本地 phase；不是无未知证明 | `CV::InconsistentFields` |
| Collected | StoppedLocal | `stop_local` @ shutdown | actual unresolved 集合为空且无 in-flight | 只本地停止 | `CV::UnknownEffect` |
| Collected | StoppedWithUnknown | `stop_local` @ shutdown | actual unresolved 或 in-flight 原 op 存在 | 保原 candidate/operation identity | `CV::UnknownEffect` |
| Dispatching | Dispatching | `record_returned`（尚有候选） / `take_next_plan`（后续项） @ worker | returned核原in_flight subject/op/context、清在途并合并unresolved；下一take须已清在途、next candidate current/budget valid | append actual summary或换下一owned plan；两个触发各自guard，无跳项/重排 | `CV::InconsistentFields` / `CV::OutOfScope` / `PE::Conflict` |
| Dispatching | CompletedLocal | `record_returned`（最后actual返回） / `take_next_plan(None)`（已收齐） @ worker | actual原returned plan一致、所有候选已消费且无in_flight；unresolved并集仍保留 | append bounded safe summary或仅phase；非外部成功/无未知证明 | `CV::OutOfScope` / `CV::MissingRequired` |
| Dispatching | StoppedLocal | `stop_local` @ shutdown | no unresolved and no in-flight effect | 只本地停止 | `CV::UnknownEffect` |
| Dispatching | StoppedWithUnknown | `stop_local` @ shutdown/cancel | in-flight 或 actual unresolved 非空 | 合并 unresolved；不重入队 | `CV::UnknownEffect` |

`record_returned`的returned_plan必须是同一次take移出的owned plan；重复returned/wrong subject/op/空输入清旧unresolved均fail-closed。8条矩阵计distinct状态对，Dispatching同态有return/take两个不同触发，CompletedLocal也有return/empty-take两个原触发；不是只列8次函数调用。按照Step7 runner，Job CancelledLocal/Indeterminate或None结果必须转batch停止/未决分支，不调用record_returned伪完成。batch不写cursor/gap/业务对象，Application持有原恢复责任。

### 单机停审

`pass_design_static_fail_closed`：5状态、8个distinct状态对（含Dispatching同态）；X补齐两个同态/收齐原触发并按Step6/7保CompletedLocal中的继承unresolved，不改源合同或添新边。empty batch不代表外部队列完成，取消不等NoEffect。planned A/C/L/I/W/J，未执行。

## 6. 有限结果/分类消费表（不新建状态机）

下表只说明已有exact enum的来源、消费方和禁止升级；定义唯一来源为Step6原卡及已停审的Step7 support新增/Entry精确覆盖，均按受权repair后的当前合同。这里列分支label用于穷尽消费，payload/factory/getter仍回原卡，不增加Unknown/Other/free-text fallback。

| exact 类型 | 允许消费位置 | 可支持的有限分支 | 禁止的跨层推断 |
|---|---|---|---|
| `ProbeOutcome` | J02/J03 `RecoveryRecord.resolve`、原 result 读取 | `Owner`/`Action`/`Platform`/`Consumer`/`Coverage`/`NoEffect`/`Unknown`/`Unavailable` | Unknown/Unavailable/NotFound/timeout 不变 NoEffect；Coverage 不等 cursor advance |
| `KnownPlatformBusinessResultKind` | DeliveryAttempt/PlatformReceipt/Recovery FinalizeOnly | `Accepted`/`Rejected` | HTTP/SDK ACK 不变业务 kind；Rejected 不自动 no-effect |
| `OwnerResultKind` | Inbound/Callback result finalize | `Accepted`/`Rejected`/`Pending`/`Indeterminate` | 不创建 Turn/Decision；Pending/Indeterminate 不变 Accepted |
| `ConsumerResultKind` | SafeHandoff result finalize | `Accepted`/`Rejected`/`Pending`/`Indeterminate` | ACK 不变 Accepted；Accepted 不变 evidence/verdict |
| `LocalAttemptDispositionKind` | DeliveryAttempt/Lane release | `KnownFinal`/`Unknown`/`NoIo` | NoIo 不变 NoEffect；Unknown 不清 head/重试 |
| `SafeRecoveryResolutionKind` | RecoveryRecord | `Unresolved`/`FinalizeOnly`/`SameEffectRetryEligible`/`GapCovered`/`Manual` | local commit 单独不变 Resolved；Resolved 不发新 IO |
| `ProtocolAckDisposition` | E01/E02/E03/E04/Worker ACK carrier | `NotSent`/`Acknowledged`/`Deferred`/`Rejected`/`Failed` | 不变 Turn、owner、platform、consumer 结果 |
| `ConsumeDisposition` | E01/E02/E03/E04 Application result | `AcceptedLocal`/`Duplicate`/`Blocked`/`Rejected`/`Quarantined`/`Indeterminate`/`UnsupportedVersion` | 不创建 GlobalMember/Conversation/Turn；Duplicate 不重执行 |
| `JobResultDisposition` | 五 J `SafeJobResultSummary` | `Completed`/`Partial`/`Blocked`/`Indeterminate`/`Duplicate`/`Cancelled` | Completed 只 bounded local；Cancelled 不变 NoEffect |
| `ApiEntryDisposition` | API/CLI entry | `AdmittedForDispatch`/`Rejected`/`Unavailable` | Admitted 不变业务 commit；Unavailable 不造空结果 |
| `WorkerItemDisposition` | Worker E02/E04 单项 | `Pending`/`Dispatched`/`ReturnedLocal`/`Rejected`/`Indeterminate` | ACK 不变 ReturnedLocal；Indeterminate 不重入队 |
| `LocalCommitKind` / `LocalCommitDisposition` | LocalUoW/Recovery/J result | `Committed`/`RolledBack`/`Indeterminate`（typed proof） | 不变 owner/platform/consumer result；Indeterminate 不新 apply |
| `LocalCasDisposition` | 各 repository CAS | `Matched`/`Conflict`/`NotEstablished` | 不变业务终态；Conflict 不换 key/op |
| `StoredResultReuseDecision` | dedup/result-first read | `FreshReservationAllowed`/`Visible`/`NotDisclosed`/`OriginalPending`/`Conflict`/`Expired`/`Unavailable` | Fresh只是合格首建分支，不是原key可重执行；不换op/覆immutable payload |
| `MutationObservationRequirement` | UoW/Audit/O01 conditional branch | `Mandatory`/`OptionalQualified`/`OwnerPermitsAuditOnly`/`NonRecursiveResultOnly` | 缺正式 rule 不 fallback；不生成通用 outbox |
| `BridgePortError` | 所有 Application/Infra/Entry Future | `InvalidInput`/`Denied`/`NotEstablished`/`Unsupported`/`Stale`/`Conflict`/`Unavailable`/`Cancelled`/`Indeterminate`/`InvariantViolation` | 不用 raw error/HTTP 文案推成功；`Indeterminate` 必带原 op/phase |
| `ContractViolation` | Domain/Contracts pure guard | `InvalidValue`/`WrongKind`/`InconsistentFields`/`ForbiddenMaterial`/`MissingRequired`/`OutOfScope`/`Expired`/`UnknownEffect` | 不携 raw body/token/secret；拒绝零隐式补字段 |

主文件筛选表的其余有限载荷按下列原类型闭口，不隐含新增projection/report机：

| exact类型 / 原卡 | 有限消费面 | 禁止升级 / 副作用 |
|---|---|---|
| `ProtocolAckAction` / Step6 shared | Acknowledge/Defer/Reject/NoAckRequired：trusted原source及一次性ACK executor消费 | ACK意图不等actual ACK；不得证明local/owner/platform/consumer成功 |
| `BridgeQualificationOutcome<T>` / Step7 support | Qualified/Blocked/Unavailable/Unsupported/Stale；只有Qualified取typed current载荷 | shape/Blocked reason/checked_at不转authority，不生成Established或durable Blocked |
| `IngressVerificationResult` / Step6 Application | Verified/Rejected/Unavailable，E01 owning验证面 | Verified只来源，不自动建GlobalMember/owner op或豁免required材料 |
| `RuntimeAvailability` / Step6 Infra | NotSelected/NotEstablished/Qualified，原required-seam总检查 | Qualified非任何业务成功，不因enable/ref shape变Qualified |
| `PreparedResultPayload` / Step6 Application | LocalMutation/Known，seal前拟写原seed | prepared不是actual commit；不预造CommittedLocalMutationRef |
| `StoredResultPayload` / Step6 shared | Local/Owner/Action/Platform/Consumer/Probe/Qualification/Pending，原immutable stored结果 | 不覆盖A载荷，不从Local/Pending推业务终态，不二次execute |
| `BridgeCommandResult` / Step6 shared | LocalCommitted/OriginalReused/Indeterminate/Rejected/Unavailable/NotDisclosed | 本地/复用/隐藏不等foreign成功；不暴露hidden subject/count |
| `BridgeReadResult` / Step6 shared | View/NotVisible/NotFound/Unavailable，四Q | NotFound是read返回，不等NoEffect；零probe/repair/audit/dedup写 |
| `SafeViewDisposition` / Step6 shared | Qualified/Degraded/Denied/Unavailable | 可读不是可执行，Degraded不补正文/审批或持久stale sidecar |
| `ViewFreshnessKind` / Step6 shared | ExistingRevision/Stale/Degraded/Indeterminate | freshness不替visibility/authority，不能Query修复 |
| `SafeLocalBusinessState` / Step6 shared | Installation/Binding/IdentityMapping/LocationMapping/MessageMapping/Inbound/Presentation/Intent/Attempt/Action/Callback/Dedup/Cursor/Gap/Lane/Recovery/Handoff，exact17主语标签 | 只包当前获准的原enum与local revision，不构造GlobalState |
| `SafeStageObservation` + `SafeStageSlice` / Step6 shared | Protocol/LocalCommit/Owner/Platform/Consumer/Business；Slice过滤原observations+basis | 分阶段来源不可互换/合总成功；未披露stage不伪None成功，不补写history |
| 具名Slot、selector、read/expected/Ref/seed包装 / 原Step6~8卡 | 按主文件§4归属与原逐variant guard/read-set消费，Missing/NotApplicable等只原kind适用 | 值/分类不是lifecycle；zero隐式authority/new operation、无新结果variant |

`LocalCommitDisposition`是已有enum，三个variant各携真实CommittedLocalMutationRef/LocalRollbackProof/LocalMutationRef；不能只用无载荷的LocalCommitKind顶替。所有result/qualification只actual source返回后消费，原载荷验证失败用CV，port wrapper沿PE::InvalidInput或原安全错误。

有限结果只在 actual source/port 取得后消费；`validate`/factory 只是 shape 校验。任何 result 分类都不能制造平台账号、token、secret、GlobalMember、Conversation/Turn、Gate/Decision、Artifact、Workspace 或 Observability truth。

## 7. 技术跨审与停审结论

| 跨审项 | 结论 |
|---|---|
| phase 与业务 state | 四机只有本地from_parts及具名成员、无rehydrate/store。M19 CompletedLocal要求无未决，M21 CompletedLocal仍保继承unknown；两者都不得替owner/platform/consumer/local truth |
| source/session 与 cursor/gap | `Active`/reconnect/empty poll 不推进 cursor，不关闭 gap；新 epoch 不能跨比较旧 position |
| job/batch 与 operation | 原 plan/subject/op 必须贯穿；candidate 过期、CAS 冲突、cancel 或 unknown 不换 key/op、不重入队逃避恢复 |
| error 与 unknown | only `BridgePortError::Indeterminate{original,phase}` 或 typed unresolved 集合保留未知；timeout/NotFound/ACK lost 不是 NoEffect |
| side effect / audit | 技术 phase 零独立 audit；由 Application 产生的 actual mutation 仍走唯一 audit/conditional O01 规则；不建 outbox/report/evidence |
| 测试边界 | A/C/R/D/B/L/P/S/I/W/J仅原planned索引；Worker采用consumer_dispatch_tests.rs，不新造target；未运行编译、测试、平台连接或投递 |

四个技术机逐项自检均为 `pass_design_static_fail_closed`。外部 runtime/provider、SDK/OAuth/API Key/KMS/router、四平台安装和 BR-UP-001~009 不因本附录关闭；本附录不是 implementation ledger、boundary skeleton、run 或 readiness。
