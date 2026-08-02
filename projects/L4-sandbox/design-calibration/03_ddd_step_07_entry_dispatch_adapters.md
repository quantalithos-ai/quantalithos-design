# `7R-06` Entry Dispatch Adapters：输入效力、Context Factory 与 Source Map

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7
> 对应中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 当前批次：`7R-06A`；本文件是 entry adapter 的唯一 owner 中间产物
> 状态：`completed_wait_user_review`
> 正式文档：`03-详细设计.md` 尚未回填

## 1. 本批恢复点、输入与效力

### 1.1 Current recovery point

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = API + Worker + Jobs entry dispatch adapters
current_sub_batch = 7R-06A input authority, context factory and source map completed_wait_user_review
next_sub_batch = 7R-06B exact 42-entry mapping
gate_status = user_review_pending
formal_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
```

本文件只定义 entry 到 application 的调用接缝。协议 DTO 的 wire schema 仍由 Step 8 拥有；application callable、
`SandboxServiceCallContext`、`SandboxServiceOutcome`、stored result kind、worker/jobs transient carrier 和错误 enum
仍以 Step 6/7 canonical source 为准。本批不新增第 43 个 callable、不新增 public status、stored result kind、repository、
identity owner 或第二套 dispatch ref。

### 1.2 已读取输入与权威顺序

| 来源 | 本批读取内容 | 权威用途 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` | Step 7 按模块闭合 trait/adapter、函数签名、错误和下游承接要求 | 约束讨论结构和进入下一批门禁。 |
| `standards/document/详细设计书写规范.md` | 模块实现契约、trait/adapter 索引、字段来源和可落码要求 | 约束 source map 与函数级表达。 |
| `standards/document/设计文档讨论中间产物规范.md` | 三层恢复源、问题回答、诊断、取舍、结构化产物、回填草稿 | 约束本文件形态和批次纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | entry/facade exact callable、selector source、DTO 构造、error exhaustive、fake/durable 分界 | 约束禁止实现端推断的字段。 |
| `03_ddd_step_06_object_contracts_application_infra_entry.md` | `SandboxServiceCallContext`、API envelope/disposition、worker context/receipt、jobs context/exit/error | 本批 entry carrier 与 factory 的唯一上游 source。 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` | 10 Command、13 Query、9 Consumer、10 Job 的 exact method/input/output | 本批 42-entry 双向 mapping 的唯一 application source。 |
| `03_ddd_step_07_cross_audit_b1_closure.md` | 安全/负向边界和既有 blocker owner | entry 不得越界或提前关闭 blocker。 |

冲突裁决顺序固定为：标准 -> Step 4/5 owner -> Step 6 canonical carrier -> Step 7 facade source -> 本文件 current
overlay -> historical Step 7/Step 8/正式 `03`。任何旧文档中 generic dispatch、旧 actor/status/ref 或“Step 7 已通过”的文字
只作为 `historical_material`，不得反向覆盖 current source。

### 1.3 L1/L2/L3 粒度裁决

| entry 区域 | 当前粒度 | 本批必须闭合 | 明确停止点 |
|---|---|---|---|
| API command/query | L1 接缝 | closed selector、context factory、exact input source、facade result source、transport-free disposition | HTTP/RPC code、wire body、header 和 route 注册留 Step 8/9。 |
| Worker fulfillment/consumer/relay | L1 接缝 | trusted worker context、selector allow-set、receipt/loop source、ack 前置 disposition | ack/retry/backoff/dead-letter执行策略留 Step 9/12。 |
| Jobs runner | L1 接缝 | fixed runner kind、job context、exact input/selection、complete report source、process disposition | scheduler cadence、process exit code和运维编排留 Step 9/12/04。 |
| 普通 diagnostic/audit/telemetry | L2/L3 | 只登记 redaction、hook 和错误隔离接缝 | 不设计第二套审计/报告主体流程。 |

## 2. SOP 问题回答

| SOP 问题 | Current answer |
|---|---|
| 哪些 entry 需要 adapter | API command/query、Worker fulfillment/consumer/relay、Jobs ten runner均需要；每个 application callable有独立正向映射。 |
| selector 从哪里来 | API 来自已验证 Step 8 DTO closed variant；Consumer 来自已验证 event kind；Worker fulfillment 来自固定 runner capability；Worker relay 来自固定 `PublishSandboxEventRelay`；Jobs 来自 runner file 编译期固定 kind与已验证 job input kind一致性。 |
| operation name 从哪里来 | 只由 `SandboxServiceCallContext::{from_command,from_query,from_consumer,from_worker,from_worker_job,from_job}` 内的显式 closed mapping 产生；entry 不复制 mapping。 |
| request digest 从哪里来 | entry 在协议/事件/job 输入完成 canonicalization 后冻结并传入 factory；application/entry 不重新序列化 body或用 Debug 文本重算。 |
| idempotency key 从哪里来 | command/consumer/job 由已验证 metadata 或 worker/job runtime 输入提供；query 不允许 key；entry 不以 request id、trace id、retry count或当前时间替代。 |
| entry 是否拥有业务 truth | 否。entry 只组装 transient carrier、调用 application facade、映射既有 outcome/error；不创建 domain identity、Version、UoW、status、stored result或 repository事实。 |
| entry 如何选择 facade | 每个 closed selector 对应一个独立的 typed handler/method；禁止 `run(kind, payload)`、字符串、topic、route、binary name、DTO type name、typed-ref顺序和 fake map 推断。 |
| output 从哪里来 | API 从 application outcome/query result构造 `SandboxApiDisposition`；Worker 从 application outcome构造 `SandboxConsumerReceipt` 或 fulfillment/relay loop carrier；Jobs 从 application result构造 `SandboxJobExitDisposition`，不从 counters/repository重组。 |
| 异常如何处理 | 先由 owning carrier/factory 显式校验；API/Worker/Jobs 分别以 canonical `ApiError`/`WorkerError`/`JobsError` 映射；不得 wildcard 或按 retryable bool 单独决定 disposition。 |
| 本批是否关闭 blocker | 否。7R-06A 只准备 source map；`DISPATCH-001` 和 `ENTRY-001` 在 7R-06C 完成 exhaustive mapping 后才可候选关闭。 |

## 3. Historical 诊断与冲突登记

| historical material | 问题 | current disposition |
|---|---|---|
| API/worker/jobs 使用 `dispatch(kind, payload)` 或 `run_job(SandboxJobServiceInput)` | selector 到 input、输出和错误关系被压成运行时猜测，无法证明 42/42 | invalidated；改为每个 callable 独立 typed entry function。 |
| route、topic、binary name或 `OperationName` 作为 dispatch key | transport/部署命名变化会改变业务 identity，且绕过 closed mapping | forbidden；只允许 closed enum + canonical factory。 |
| entry 自己创建 `SandboxOpaqueRef`、status、stored result或Version | entry越权拥有 domain/application truth，产生第二身份/状态源 | invalidated；只消费 application carrier/accessor。 |
| worker 从 backend/publisher/repository读取 private state拼 receipt/report | entry结果与application outcome脱节，且可能重复外部调用 | forbidden；receipt/report必须从 application 返回的完整 carrier构造。 |
| jobs 只保留 counts、最后 cursor或当前 report再扫描 | 丢失逐项 result/reason/continuation，duplicate无法完整 replay | invalidated；只消费完整 batch chain与stored `JobReport` outcome。 |
| Step 6 旧段落中的 `initial_page_token` | 与其物理 EOF 的“首批 cursor 固定 None / 不保留 external initial continuation”修正冲突 | historical_material；本批遵循物理 EOF，Jobs entry 不新增该字段。 |
| 旧 Step 8 声称 Step 7 已闭口 | 与 current 四个 owner blocker和7R-06未完成事实冲突 | downstream revalidation pending；不得作为 entry source。 |

### 3.1 Current 设计取舍

1. 保留 Step 6 已定义的 envelope/context/receipt/report carrier，entry 只负责构造和消费，不复制其字段或 schema。
2. 将 selector source 与 operation source 分开：selector 由 entry 的可信输入确定，operation 由 application factory 唯一映射；两者必须做一致性校验。
3. 将 `EntryDisposition` 限定为一次调用的 transient 处置，不把它当作 public receipt/report status 或持久状态机。
4. 对普通审计、诊断、观测和交付只保留最小 hook/redaction/error isolation，主体功能仍由 application/domain owner 承接。

### 3.2 改动前后对比

| 检查面 | Historical 口径 | `7R-06A` current 口径 | 本批影响 |
|---|---|---|---|
| dispatch 选择 | 由 route/topic/binary 或 generic payload 间接选择 | 由 closed selector 直接选择；operation 由 canonical factory 映射 | 后续 B 批可做双向差集，不允许运行时猜分支。 |
| context 构造 | entry 可复制 operation、channel、metadata 校验 | entry 只调用 Step 6 factory，metadata/key/digest 由唯一 source 提供 | 避免第二套 identity 和 factory。 |
| facade 输入 | handler 可把 body、opaque refs 或 transport字段直接传 service | 先完成 per-callable typed input，再传 application facade | 42-entry matrix 必须逐项列出字段来源。 |
| result 组装 | entry 从 repository、adapter 或 counter 重建状态 | 只消费 application outcome、stored surface 和 checked carrier | receipt/report 完整性由 B/C 批审计。 |
| Jobs 首页状态 | 旧 `initial_page_token` 可从 entry context 传入 | 按当前 Step 6 EOF，首页 cursor 由 reader/application selection owner承接 | 不新增 entry-local cursor truth。 |
| 异常处置 | 以 retryable、字符串或 generic error 兜底 | API/Worker/Jobs 各自 exhaustive error mapper；disposition 与 public status 分离 | C 批检查 7/12/17 exact mapping。 |

## 4. Entry owner、文件边界与禁止依赖

| entry family | planned owner | allowed dependency | output owner | direct access forbidden |
|---|---|---|---|---|
| API command | `crates/api/src/command_handlers.rs` | contracts DTO、`SandboxApiCommandEnvelope`、application command facade、`SandboxApiDisposition` | `crates/api/src/routes.rs` 在 Step 8 mapper前消费 | repository、domain object、UoW、adapter、stored-result store。 |
| API query | `crates/api/src/query_handlers.rs` | contracts DTO、`SandboxApiQueryEnvelope`、application query facade、query result | `crates/api/src/routes.rs` | idempotency reservation、write UoW、projection repair、repository。 |
| Worker fulfillment | `crates/worker/src/fulfillment_worker.rs` 等四个固定 runner | trusted `SandboxWorkerRunContext`、application command facade、`SandboxFulfillmentLoopResult` | worker loop/Step 8 mapper | tools semantic executor、runtime agent loop、member lifecycle、repository、backend adapter。 |
| Worker consumer | `crates/worker/src/*_consumers.rs` | validated event envelope、`SandboxWorkerRunContext`/consumer metadata、application consumer facade、`SandboxConsumerReceipt` | ack boundary/Step 8 mapper | application truth repository、publisher private state、raw event body after validation。 |
| Worker relay | `crates/worker/src/event_relay_worker.rs` | `relay_call_context`、application relay job-kind facade、`SandboxRelayLoopResult` | worker ack/telemetry boundary | jobs crate、topic-to-operation inference、publisher direct status write。 |
| Jobs runner | `crates/jobs/src/<job_runner>.rs` | fixed `SandboxJobRunContext`、application job facade、`SandboxJobExitDisposition` | process/Step 8 report mapper | repository reader、scheduler/config scope expansion、worker crate、process code in public report。 |

Entry adapter 只能依赖 application public trait 和 canonical transient carrier。若需要 repository、resolver、port、adapter、
clock、id generator或UoW，说明 entry 设计越界，应回到 application/infra owner；entry 不得为了“方便映射”增加 facade 参数。

## 5. Context Factory 与 selector source contract

### 5.1 API command/query

```rust
impl SandboxApiCommandEnvelope {
    pub fn try_new(
        command_kind: SandboxCommandKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApiError>;
}

impl SandboxApiQueryEnvelope {
    pub fn try_new(
        query_kind: SandboxQueryKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
    ) -> Result<Self, ApiError>;
}
```

两者必须直接委托 `SandboxServiceCallContext::from_command` / `from_query`。command 的 `idempotency_key` 必须非空；
query 没有 key 且必须保持 `ApiQuery` channel。factory 失败在 application facade 调用前结束；不得创建 UoW、reservation、
identity或外部调用。

### 5.2 Worker

```rust
impl SandboxWorkerRunContext {
    pub fn fulfillment_call_context(
        &self,
        command_kind: SandboxCommandKind,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<SandboxServiceCallContext, WorkerError>;

    pub fn relay_call_context(
        &self,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<SandboxServiceCallContext, WorkerError>;
}
```

`fulfillment_call_context` 只允许 `StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、
`ClassifySandboxFailure`；`relay_call_context` 只允许 `PublishSandboxEventRelay` 并固定 `Worker` channel。Worker kind、
system actor、trace和开始时间由 trusted runtime context提供；digest/key由当前 frozen item/batch提供。worker 不创建 run ref，
不从 handle、topic或时间推导 digest/key。

### 5.3 Consumer

Consumer selector 由已验证 event kind 直接映射到 `SandboxConsumerKind`；actor、trace、digest、dedup key由 inbound envelope
的 checked metadata提供，并交给 `SandboxServiceCallContext::from_consumer`。事件 body不能生成 actor、operation、source scope、
status或identity。source/schema/dedup/guard validation失败必须在 application consumer facade 前映射为 `WorkerError`，不得把
未验证 body交给 domain。

```rust
impl SandboxServiceCallContext {
    pub fn from_consumer(
        consumer_kind: SandboxConsumerKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;
}
```

Consumer adapter 的调用顺序固定为：validated event kind -> checked metadata -> `from_consumer` -> exact
`SandboxConsumerService::<method>(typed_input)`。它不把 source event ref、event body或dedup proof复制进
`SandboxServiceCallContext`；这些字段只在对应的 consumer input / receipt carrier 中按 Step 7 source map 保留。

### 5.4 Jobs

每个 runner file 具有编译期固定 `SandboxJobKind`。`SandboxJobRunContext::try_new` 先验证 job run identity、system actor、
trace、digest和key，再调用 `SandboxServiceCallContext::from_job`；runner input kind 不一致返回 `JobsError::RunnerJobKindMismatch`。
首个 page cursor不作为当前 effective field；九个 paged job 使用 application 既有 selection contract，首页 cursor固定由
reader owner处理，reconciliation 使用完整 explicit scope。jobs entry 不从 binary name、CLI 文本、schedule/config或 topic 推断 kind。

```rust
impl SandboxJobRunContext {
    pub fn try_new(
        job_kind: SandboxJobKind,
        job_run_id: JobRunId,
        system_actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
        started_at: Timestamp,
    ) -> Result<Self, JobsError>;

    pub fn call_context(&self) -> Result<SandboxServiceCallContext, JobsError>;
}
```

`try_new` 的 `job_kind` 必须与编译期 runner kind和已验证 Step 8 job input kind逐项相等；不一致在调用
application facade 前返回 `JobsError::RunnerJobKindMismatch`。本批不重新引入 `initial_page_token` 参数；
首页 selection 的 cursor 规则由 application reader owner提供。

## 6. 本批结构化 source map（7R-06A）

| source field | canonical source | entry validation | forbidden fallback |
|---|---|---|---|
| selector kind | closed Step 8 DTO/event/job kind或fixed runner kind | variant exhaustive + runner/channel一致性 | route、topic、binary、type name、字符串。 |
| operation name | `SandboxServiceCallContext` factory | factory exhaustive mapping | entry自行拼接或复制字符串。 |
| channel | factory固定 | API/Consumer/Worker/Job allow-set | caller bool、config、route。 |
| actor | checked API principal / trusted worker system actor / trusted consumer actor | non-empty；worker/job additionally `System` | payload actor、username、role string。 |
| trace | checked metadata carrier | preserve only；不重新解析/生成 | request body、current time、stack text。 |
| request digest | entry canonicalization result | non-empty and source/body consistency | application reserialization、Debug、route。 |
| idempotency key | command/consumer/job metadata | required and non-empty；query forbidden | request id、trace id、retry count、job run id。 |
| business input | Step 8 DTO mapper / validated event / validated job selection | exact per-callable constructor before facade | typed-ref order、latest scan、fake map、raw body。 |
| result | application facade return | outcome shape and expected stored kind checked by owning carrier | repository/adapter scan、counter、status text。 |

本批 source map 只固定字段来源；42 个 callable 的逐项 input/output/function mapping、receipt/report relation和错误差集留在 `7R-06B/7R-06C`。

## 7. 本批自检与进入下一批条件

| check | current result |
|---|---|
| API/Worker/Jobs owner and direct-access redline | 已定义；repository/domain/UoW/adapter direct access = 0。 |
| context factory delegation | command/query/consumer/worker/job 均回指 Step 6 canonical factory；entry duplicate factory = 0。 |
| selector source | 已定义唯一来源和禁止推断集合；42-entry exact matrix尚未写入。 |
| new public type/status/stored kind/repository/identity | 0。 |
| tools semantic/runtime agent/member lifecycle leakage | 0。 |
| real implementation/test/evidence/commit | 未执行、未生成。 |

进入 `7R-06B` 前必须满足：本文件 `7R-06A` 内容完成；三层恢复源同步；用户复核门明确记录；不得以本批 source map 代替 42/42 mapping。

## 8. 回填草稿（冻结，尚未授权正式 03）

正式 `03` 未来只能回填以下结论：API、Worker、Jobs entry 是 application facade-only adapter；selector 来自 closed typed source；
operation/channel由 `SandboxServiceCallContext` factory 唯一生成；entry 不拥有 domain truth、identity、Version、UoW、repository、
adapter或 public status；完整 result/receipt/report 必须来自 application carrier。不得回填本文件的历史冲突过程或将 `7R-06A` 写成
42-entry closure。

## 9. 待确认事项

1. `7R-06A` 的 owner、context factory delegation、selector source 和 direct-access redline 是否可作为后续 42-entry matrix 的前置约束。
2. 是否接受 Jobs 首页 cursor不在 entry context 中保存，按 Step 6 物理 EOF由 reader/application selection owner承接。
3. 是否接受本批不关闭 `DISPATCH-001`/`ENTRY-001`，并继续等待 `7R-06B/7R-06C` 的逐项和穷尽审计。

## 10. 真实性声明

本批只形成设计中间产物和静态 source map。未执行代码、编译、测试、provider、fake/durable runtime parity或验收；未生成 run_id、
evidence alias、signoff或实现 commit。文中“已定义/自检通过”仅表示文档静态关系，不表示运行时事实。

## EOF Current Recovery Override: `7R-06A` completed, user review pending

本节位于本文件物理 EOF，是 `7R-06A` 的唯一 current authority。A 批只完成 entry owner、输入效力、context factory、selector
source map、历史冲突和 direct-access redline；42-entry 双向映射、output/receipt/report relation、7/12/17 exhaustive error
mapping 和 blocker closure 仍未完成。前文的 `in_progress` 仅保留为写入轨迹。

### A 批完成审计

| gate | 静态结果 |
|---|---|
| API command/query owner | `SandboxApiCommandEnvelope` / `SandboxApiQueryEnvelope` 均回指 Step 6 factory；query key 0。 |
| Consumer factory | `SandboxServiceCallContext::from_consumer` 签名、metadata 来源和 body-free 边界已固定。 |
| Worker factory | fulfillment 四项 allow-set和 relay `PublishSandboxEventRelay` 专用 `from_worker_job` 已固定。 |
| Jobs factory | fixed runner kind、`SandboxJobRunContext::try_new`、`call_context` 和首页 cursor owner已固定；未重新引入 `initial_page_token`。 |
| selector source | closed DTO/event/job kind或fixed runner kind；route/topic/binary/type-name/string fallback = 0。 |
| direct access | entry 直连 repository/domain/UoW/adapter/stored-result store = 0。 |
| scope redline | tools semantic execution、runtime agent loop、member lifecycle orchestration = 0。 |
| new truth | new callable/status/stored kind/repository/identity/dispatch ref = 0。 |
| 42-entry closure | 未完成；明确移交 `7R-06B`。 |
| error/output closure | 未完成；明确移交 `7R-06C`。 |

### A 批回填草稿冻结

正式 `03` 未来可引用本批的 entry owner、factory delegation、selector source 和禁止直接访问边界；不得把本批 source map
误写成 42/42 dispatch closure，也不得提前回填 API/Worker/Jobs public DTO、ack policy、process exit code或新的 status。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 entry dispatch adapter exact mapping
current_sub_batch = 7R-06A input authority, context factory and source map completed_wait_user_review
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = user_review_pending
batch_status = completed_wait_user_review
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A
next_internal_batch = 7R-06B exact API/Worker/Jobs callable mapping
next_allowed_action = wait_user_review_before_7r_06b
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## Historical-Position Foundation: `7R-06C-3` facade-only and side-effect reverse audit

> 本节因写入锚点位于文件前部，只承载C3-03完整设计正文，不单独充当current authority。C3-02的`ND-01~ND-16`和
> `SD-01~SD-12`继续有效；本节补齐47个physical slot的调用预算、结果后行为、跨family依赖和零副作用反向审计。
> 只有本文物理EOF的同批activation可以将C3-03标记完成；本节本身不改变任何blocker状态。

### C-3.6 计数口径与entry-owned budget

本审计区分application内部已经发生的业务动作与entry自己的动作。entry只能观察exact facade返回值；application可能在返回
`Accepted | Degraded | Failed`或typed error前已经提交合法truth、stored surface或side effect，entry不得把这种分支误记为
“全系统零副作用”。本节的`direct=0`只表示entry不拥有、重做、补偿或回滚这些动作。

| symbol | count unit | exact meaning |
|---|---|---|
| `E` | one-shot exact call | API command/query、Worker fulfillment/consumer或reconciliation对一个已选定application method的调用尝试；进入async method即计1。 |
| `P` | paged exact call | Worker relay或九个paged Jobs在同一invocation内对同一个fixed Job method发起的Start/Continue page调用数。 |
| `T` | report finalizer call | exhausted fresh page chain对既有application finalizer的调用；它不是第43个logical callable。 |
| `C` | post-result clock read | exact application返回后由entry读取可信完成时钟的次数；只保留Worker fulfillment既有例外。 |
| `D` | direct business dependency call | entry直接访问repository、domain transition、UoW、business port/adapter/backend/publisher或process launch。 |

`pre-dispatch reject`统一要求`E=P=T=C=D=0`。对已进入application的分支，entry不宣称application内部调用预算为0；它只保证
`D=0`、不追加第二facade调用，并按下表停止。

### C-3.7 Physical family facade-call budget

| physical family | slots | validated invocation budget | duplicate budget | error/terminal stop | post-result clock |
|---|---:|---|---|---|---|
| API command | 10 | 每个handler `E=1,T=0,D=0` | duplicate仍由同一次`E=1`返回完整stored command surface；entry read/write=`0` | `Err`或local relation error后additional `E=0` | `C=0` |
| API query | 13 | 每个handler `E=1,T=0,D=0`；reservation/write/external call=`0` | 不存在command式duplicate replay分支；只消费typed query result | `Err`后不repair/rebuild/requery | `C=0` |
| Worker fulfillment | 4 | 每个frozen item `E=1,T=0,D=0` | 同一次`E=1`返回exact stored command replay；不重新launch/capture/handoff/classify | `Err`后additional `E=0`；`Ok`后的carrier relation失败不重调 | `C<=1`，仅用于既有`SandboxFulfillmentLoopResult.finished_at`关系；不得选择method或派生业务status |
| Worker consumer | 9 | 每个validated event `E=1,T=0,D=0` | 同一次`E=1`返回完整consumer replay；entry不加载stored result | source/application/local error后additional `E=0` | `C=0` |
| Worker relay | 1 | fresh按linear permit执行`P>=1`；仅exhausted terminal执行`T=1`；`D=0` | Start返回duplicate时`P=1,T=0`，直接move完整replay source | 第k页或relation失败时`P=k`且不发下一页；finalizer失败后additional `P/T=0` | `C=0` |
| Jobs paged runner | 9 | fresh按各runner fixed kind执行`P>=1`；仅exhausted terminal执行`T=1`；`D=0` | Start返回duplicate时`P=1,T=0`，不构造accumulator/finalizer | 第k页或relation失败时`P=k`且不发下一页；finalizer失败后additional `P/T=0` | `C=0` |
| Jobs reconciliation | 1 | dedicated atomic method `E=1,T=0,D=0` | committed/duplicate均由同一次`E=1`的specialized envelope返回 | error后不进入paged/finalizer或generic report path | `C=0` |

因此37个one-shot physical slot均为`E<=1`，10个paged physical slot均只重复调用各自已经选定的同一logical Job method。
page continuation和shared finalizer不能改变selector，也不能产生新的logical callable。Worker fulfillment的`C<=1`是唯一entry
post-result clock allowance：`Err`分支为`C=0`；`Ok`分支最多读取一次并只校验`finished_at >= started_at`。API、Consumer、Worker
relay和全部Jobs共43个slot的post-result clock read固定为0，report time只来自application finalized/stored source。

### C-3.8 Branch side-effect and reread matrix

| branch | facade/page action | entry-owned write/external action | result authority | mandatory stop / forbidden recovery |
|---|---|---:|---|---|
| pre-dispatch decode/context/selector reject | `E=P=T=0` | `D=0` | existing typed entry error | 不创建reservation、identity、status或clock value；不换selector重试。 |
| application `Err` | 已尝试的exact `E`或`P/T`保持原计数 | additional write/external=`0` | 原`ApplicationError`包装为family error | 不按kind/retryable/reason做redispatch；不读repository判断“是否其实成功”。 |
| fresh `Accepted | NoChange` | 只消费当前exact return；paged terminal只消费一次finalizer return | entry direct action=`0` | application outcome/query result/receipt/report source | 只做owning carrier relation validation；不二次派生truth/status/report。 |
| fresh `Degraded | Rejected | Failed` | 不追加facade call | entry补偿/rollback/status write=`0` | application已确认的有限outcome与完整stored surface | 不把degraded改success，不因failed回滚已提交truth，不从counter/reason重组结果。 |
| duplicate replay | application内部完成reservation与same-snapshot stored validation | entry repository/current read、write、allocation、external=`0` | exact owned stored replay carrier | 不读current truth刷新原status/time，不重跑business callable或生成新identity。 |
| API Query visible/empty/restricted/stale/degraded/missing surface | `E=1` | reservation/UoW/repair/audit/external=`0` | typed query result | entry不触发refresh/rebuild；`NoWrite`原则不转成可写outcome。 |
| non-query `NoWrite`或missing/wrong stored relation | 当前exact return只进入local validator | fallback write/read/facade=`0` | family-local typed relation error或`ApplicationError::NoWriteViolation` | 不伪造empty success、receipt、report或stored surface。 |
| local carrier status/result/report relation mismatch | 当前调用计数不变 | repository reread、status rewrite、second mapper=`0` | `ApiError | WorkerError | JobsError` exact local variant | 不丢弃error后改用outcome status继续；不调用另一个facade。 |
| paged中途application/relation error | `P=k`，next page=`0`，`T=0` | entry rollback/repair=`0` | 已返回的typed error；先前application commit仍由owner管理 | 不回滚已提交page truth，不按last cursor/count重建permit，不生成partial success report。 |
| finalizer error或commit-unknown | 已尝试`T=1`，additional `T/P=0` | entry inspection/retry/identity allocation=`0` | application typed error / strict-hold outcome | whole-group inspection若需要只能由application recovery owner执行；entry不blind replay、不猜Committed。 |
| reconciliation committed/duplicate/error | dedicated `E=1` | generic finalizer/page/repair=`0` | specialized atomic envelope或typed error | 不转换成paged accumulator，不按current binding重组report。 |
| post-result diagnostic hook failure | business call计数不变 | business write/rollback/redispatch=`0` | 原主体outcome不变 | 只允许Step 15低基数、脱敏、隔离记录；不能成为第二业务流程。 |

`EntryDisposition`是caller-safe transient处置，不是第二business/public status。允许entry从已经校验的carrier或error穷尽映射
`EntryDisposition`，但禁止由它反向改写application outcome、receipt/report status、stored status、ack、process code或retry schedule。

### C-3.9 Direct-access reverse inventory

| forbidden entry capability | API | Worker | Jobs | current evidence requirement |
|---|---:|---:|---:|---|
| repository / stored-result store / current-binding read | 0 | 0 | 0 | duplicate和relation failure只消费application-owned carrier。 |
| domain object create/transition/save | 0 | 0 | 0 | entry只构造本family transient context/disposition/receipt/loop/exit carrier。 |
| UoW / transaction / core `Version` / reservation mutation | 0 | 0 | 0 | transaction与idempotency完全留在application。 |
| resolver / business reader / writer / id generator | 0 | 0 | 0 | selector、identity、status或missing field均不得通过fallback read生成。 |
| concrete infra adapter / backend / publisher | 0 | 0 | 0 | Worker不从provider/publisher private state补结果；Jobs不执行backend recovery。 |
| process launch / runtime agent loop / tools semantic execution | 0 | 0 | 0 | entry只驱动Sandbox-owned facade，不承接下游语义执行。 |
| current truth/result/status/report reread after facade return | 0 | 0 | 0 | fresh、duplicate、degraded、failed都只使用当前owned return。 |
| second business status/result/report derivation | 0 | 0 | 0 | entry只校验exact relation并形成transient disposition。 |
| error-driven redispatch / blind retry / compensating facade call | 0 | 0 | 0 | error结束当前exact invocation；后续policy留Step 8/9/12。 |

Worker fulfillment的单次completion clock不是上表中的business reader、status source或selector source。它来自trusted Worker runtime
clock接缝，只服务transient `finished_at`顺序校验；不得推广到Consumer、relay、Jobs或API，也不得进入stored/public report。

### C-3.10 Cross-family and crate dependency closure

| owner crate | allowed business-facing dependency | forbidden cross-family dependency | result |
|---|---|---|---|
| `api` | `contracts/core` checked types、application Command/Query facade及API-owned transient carrier | `worker`、`jobs`、concrete `infra`、repository implementation | pass_for_design |
| `worker` | `contracts/core` checked types、application Command/Consumer/Job facade及Worker-owned transient carrier | `jobs` crate、API route/DTO mapper、concrete publisher/backend implementation | pass_for_design |
| `jobs` | `contracts/core` checked types、application Job facade/finalizer及Jobs-owned transient carrier | `worker` crate、API route/DTO mapper、concrete repository/adapter implementation | pass_for_design |

Worker relay与Jobs runner可调用同一个application `publish_sandbox_event_relay` method，但彼此没有crate依赖；差异只在可信context
channel和entry-owned carrier。Worker不得复用`SandboxJobRunContext/SandboxJobExitDisposition`，Jobs不得复用
`SandboxWorkerRunContext/SandboxRelayLoopResult`。shared application carrier不等于共享entry orchestration。

### C-3.11 C3-03 reverse audit and C3-04 input

| audit | expected | current design result |
|---|---:|---:|
| one-shot physical slots with `E<=1` | 37 | `37/37` |
| paged physical slots with fixed-method linear `P` | 10 | `10/10` |
| pre-dispatch negative facade/page/finalizer calls | 0 | `0` |
| entry direct repository/domain/UoW/adapter/backend/publisher/process launch | `0/0/0/0/0/0/0` | `0/0/0/0/0/0/0` |
| current-truth reread / second business derivation / error redispatch | `0/0/0` | `0/0/0` |
| Query write/reservation/external call | `0/0/0` for 13 | `0/0/0` for `13/13` |
| non-fulfillment post-result clock read | 0 for 43 slots | `0` for `43/43` |
| fulfillment completion-clock allowance | at most 1 per `Ok` mapping | `4/4` slots constrained |
| Worker -> Jobs / Jobs -> Worker dependency | `0/0` | `0/0` |
| new public DTO/status/stored kind/callable/error | `0/0/0/0/0` | `0/0/0/0/0` |
| new L1/L2 blocker | 0 | `0` |

C3-03内容已完成。`DISPATCH-001`和`ENTRY-001`的7R-06 owner证据现已齐备，可进入C3-04裁决，但本节仍保持二者
`open_candidate`；`OUTCOME-001`和`READ-001`不属于本批owner，继续开放。C3-04必须复核blocker原始关闭条件、同步必要的Step 7
control owner、flow、项目台账和`/tmp`，并再次执行机械检查后才能改变状态。Step 7总gate、Step 8、正式`03`与implementation继续冻结。

```text
current_plan_version = v5.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06C-3 blocker adjudication and recovery-source closure
current_sub_batch = 7R-06C-3 C3-03 facade-only and side-effect reverse audit completed; C3-04 in_progress
gate_status = content_in_progress
batch_status = in_progress
c3_01_current_source_recovery = completed
c3_02_negative_dispatch_matrix = 16_runtime|12_static_completed
c3_03_facade_only_side_effect_audit = completed
c3_04_blocker_adjudication = in_progress
next_allowed_action = adjudicate_dispatch_entry_blockers_and_sync_control_sources
candidate_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
non_candidate_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## Historical-Position Foundation: `7R-06C-2` Jobs 16/16 mapping written

> 本节记录消费Step 6物理EOF current owner后的Jobs 16/16 entry映射正文。由于本节位于API、Worker foundation及
> 后续恢复块之前，它不单独充当current authority；C-2总静态审计与三层恢复源同步结论只由本文最后一个
> `EOF Current Recovery Amendment`激活。在该activation出现前，本节状态仍为
> `content_complete_static_audit_pending`，不得据此进入C-3。

### C-2.10 Jobs 16/16 local mapping

| # | `JobsError` variant | public kind | retryable | safe reason / trace | entry disposition |
|---:|---|---|---:|---|---|
| 1 | `Application(error)` | delegate `error.to_public_error_kind()` | delegate | checked reason与可选trace均借自error | 按C-2.3 Jobs列16/16 |
| 2 | `InvalidJobInput` | `Validation` | false | constructor-checked reason；继承已验证trace | `Rejected` |
| 3 | `UnsupportedVersion` | `UnsupportedVersion` | false | constructor-checked reason；继承已验证trace | `Rejected` |
| 4 | `DisabledJob` | `Disabled` | false | validated config reason；继承已验证trace | `Skipped` |
| 5 | `ForbiddenExternalBody` | `ForbiddenExternalBody` | false | body-exclusion reason；继承已验证trace | `Rejected` |
| 6 | `RunnerJobKindMismatch` | `Validation` | false | fixed `runner job kind mismatch`；trace=None | `Rejected` |
| 7 | `AccumulatorJobKindMismatch` | `Internal` | false | fixed `accumulator job kind mismatch`；trace=None | `Failed` |
| 8 | `AccumulatorPageTokenMismatch` | `Internal` | false | fixed `accumulator page token mismatch`；trace=None | `Failed` |
| 9 | `AccumulatorDuplicateTarget` | `Internal` | false | fixed `accumulator duplicate target`；trace=None | `Failed` |
| 10 | `AccumulatorAlreadyExhausted` | `Internal` | false | fixed `accumulator already exhausted`；trace=None | `Failed` |
| 11 | `ItemCountOverflow` | `Internal` | false | fixed `job item count overflow`；trace=None | `Failed` |
| 12 | `AccumulatorNotExhausted` | `Internal` | false | fixed `accumulator not exhausted`；trace=None | `Failed` |
| 13 | `StoredResultMissing` | `Internal` | false | fixed `job report stored result missing`；trace=None | `Failed` |
| 14 | `StoredResultKindMismatch` | `Internal` | false | fixed `job report stored result kind mismatch`；trace=None | `Failed` |
| 15 | `ReportStatusRelationMismatch` | `Internal` | false | fixed `job report status relation mismatch`；trace=None | `Failed` |
| 16 | `CompletionTimeBeforeStart` | `Internal` | false | fixed `job report time before run start`；trace=None | `Failed` |

四个input/config variant的trace只能继承已经验证的metadata；`RunnerJobKindMismatch`及十个local完整性variant没有可信
trace时保持`None`。`CompletionTimeBeforeStart`比较的是application finalized/stored report time与同一report run start，
不能为构造error再读取entry clock。15个local variant均不可重试；只有`Application(error)`可委托出三个retryable kind。

### C-2.11 Jobs implementation contract

```rust
fn jobs_application_entry_disposition(kind: ApplicationErrorKind) -> EntryDisposition {
    match kind {
        ApplicationErrorKind::Validation
        | ApplicationErrorKind::ForbiddenExternalBody
        | ApplicationErrorKind::NotAuthorized
        | ApplicationErrorKind::NotVisible
        | ApplicationErrorKind::IdempotencyConflict
        | ApplicationErrorKind::BoundaryRejected
        | ApplicationErrorKind::PolicyFailClosed
        | ApplicationErrorKind::UnsupportedVersion
        | ApplicationErrorKind::Quarantined => EntryDisposition::Rejected,
        ApplicationErrorKind::Disabled => EntryDisposition::Skipped,
        ApplicationErrorKind::ReferenceUnresolved
        | ApplicationErrorKind::VersionConflict
        | ApplicationErrorKind::PortUnavailable => EntryDisposition::Delayed,
        ApplicationErrorKind::DuplicateMissingResult
        | ApplicationErrorKind::NoWriteViolation
        | ApplicationErrorKind::Internal => EntryDisposition::Failed,
    }
}

impl JobsError {
    pub fn entry_disposition(&self) -> EntryDisposition {
        match self {
            JobsError::Application(error) => {
                jobs_application_entry_disposition(error.kind())
            }
            JobsError::InvalidJobInput { .. }
            | JobsError::UnsupportedVersion { .. }
            | JobsError::ForbiddenExternalBody { .. }
            | JobsError::RunnerJobKindMismatch { .. } => EntryDisposition::Rejected,
            JobsError::DisabledJob { .. } => EntryDisposition::Skipped,
            JobsError::AccumulatorJobKindMismatch { .. }
            | JobsError::AccumulatorPageTokenMismatch { .. }
            | JobsError::AccumulatorDuplicateTarget { .. }
            | JobsError::AccumulatorAlreadyExhausted { .. }
            | JobsError::ItemCountOverflow { .. }
            | JobsError::AccumulatorNotExhausted { .. }
            | JobsError::StoredResultMissing { .. }
            | JobsError::StoredResultKindMismatch { .. }
            | JobsError::ReportStatusRelationMismatch { .. }
            | JobsError::CompletionTimeBeforeStart { .. } => EntryDisposition::Failed,
        }
    }
}
```

两个match必须随着任一enum新增variant而编译失败；禁止`_` arm。`to_public_error_kind()`、`is_retryable()`、
`safe_reason()`和`trace_context()`也分别逐16项match。不得把`DisabledJob`改成空成功report，不得把`Delayed`直接转成
scheduler retry，不得从report status或`EntryDisposition`生成`i32` process code。

### C-2.12 Jobs source-to-error boundary

| source point | allowed Jobs error | forbidden substitute |
|---|---|---|
| public input/schema/config guard | `InvalidJobInput | UnsupportedVersion | DisabledJob | ForbiddenExternalBody` | raw argv/body/config path或版本原文 |
| fixed runner与input selector join | `RunnerJobKindMismatch` | binary name、operation字符串或DTO名称反推kind |
| fresh accumulator record | `AccumulatorJobKindMismatch | AccumulatorPageTokenMismatch | AccumulatorDuplicateTarget | AccumulatorAlreadyExhausted | ItemCountOverflow` | 丢batch、自动去重、截断count、生成新token |
| fresh terminal guard | `AccumulatorNotExhausted` | 提前finalize、伪造exhausted或空report |
| fresh report source validation | `StoredResultMissing | StoredResultKindMismatch | ReportStatusRelationMismatch | CompletionTimeBeforeStart` | reread current truth、第二clock或自由拼status/outcome/time |
| duplicate report source validation | `StoredResultMissing | StoredResultKindMismatch | ReportStatusRelationMismatch | CompletionTimeBeforeStart` | replay-only accumulator、重新selection或重建stored surface |
| application factory/facade/finalizer | `Application(error)` | 转成Worker error、解析Display或按public kind重分类 |

reconciliation仍消费专用atomic outcome。其application错误只包装为`JobsError::Application`；它不进入paged accumulator error，
也不为reconciliation新增同义local variant。

### C-2.13 Exhaustive audit specification

最终静态审计必须同时通过以下正向和反向检查，才能把C-2标记完成：

| audit surface | expected | pre-audit status |
|---|---:|---|
| `ApplicationErrorKind` per entry family | `16 * 3` | content_written |
| API local enum | `7/7` | content_written |
| Worker local enum | `12/12` | content_written |
| Jobs local enum | `16/16` | content_written |
| local enum total | `35/35` | content_written |
| removed `AccumulatorReplayOnly` in current authority | `0` positive arms | pending scan |
| wildcard arms / generic raw conversions | `0/0` | pending scan |
| local variant omitted or mapped twice | `0/0` | pending reverse audit |
| transport/ack/backoff/process policy introduced | `0` | pending scope scan |
| Markdown fence parity / diff whitespace | even / clean | pending mechanical audit |

Blocker裁决暂不提前执行。即使C-2静态审计通过，`DISPATCH-001`与`ENTRY-001`仍需C-3 negative dispatch和7R-06
closure gate；`OUTCOME-001`、`READ-001`继续由各自owner batch关闭。

```text
current_plan_version = v5.4-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-2 exhaustive static audit pending
application_entry_mapping = API_16/16|Worker_16/16|Jobs_16/16_content_written
api_error_mapping = 7/7_content_written
worker_error_mapping = 12/12_content_written
jobs_error_mapping = 16/16_content_written
local_error_total = 35/35_content_written
gate_status = content_in_progress
next_allowed_action = run_c2_forward_reverse_and_mechanical_audit
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

A 批完成后立即停在用户复核门；不得自动启动 `7R-06B`、其它 owner batch、Step 8、正式 `03` 或 implementation。

## EOF Current Recovery Override: `7R-06B` exact callable mapping completed, user review pending

本节位于本文件物理 EOF，是 `7R-06B` 的唯一 current authority。`7R-06A` 的用户确认已消费，本批只把既有
application facade 的 42 个 logical callable 投影到 API、Worker、Jobs entry adapter；不新增 callable、selector、status、
stored kind、repository、identity 或 protocol DTO。`7R-06C` 仍负责 output/receipt/report 关系的逐 variant 穷尽校验、
API/Worker/Jobs error mapping 和最终 blocker gate。

### B 批恢复点与读取结论

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 entry dispatch adapter exact mapping
current_sub_batch = 7R-06B exact API/Worker/Jobs callable mapping completed_wait_user_review
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = user_review_pending
batch_status = completed_wait_user_review
next_internal_batch = 7R-06C output/receipt/report and exhaustive error mapping
next_allowed_action = wait_user_review_before_7r_06c
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

本批重新读取并作为唯一上游的内容：

| 上游 | 本批消费的 current contract | 不消费的内容 |
|---|---|---|
| `03_ddd_step_06_object_contracts_application_infra_entry.md` | `SandboxServiceCallContext` 六类 factory、API envelope、worker context/receipt、jobs context/report/exit carrier、typed stored-kind owner | 旧 `initial_page_token`、entry 自有 identity/status、任何 historical generic mapper。 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` | 10 Command、13 Query、9 Consumer、10 Job 的 method、input carrier、selector、application result | service artifact 中的 historical recovery status；不把 facade contract改写为entry contract。 |
| `7R-06A` 本文件前一批 | selector source、direct-access redline、channel allow-set、factory delegation、Jobs首页 cursor owner | A 批未完成的 42-entry/output/error closure。 |
| `03_ddd_step_07_cross_audit_b1_closure.md` | entry 不拥有 domain truth、tools/runtime/member orchestration边界 | B 批不重开 B1 或 Step 6。 |

### B 批工作定义：logical callable 与 physical entry

`logical callable` 的计数单位固定为一组 `(closed selector, 独立 application method, 独立 checked input carrier,
application output carrier)`。`ctx`、entry handler、worker loop、jobs process disposition 都不是额外 callable。由此：

| family | logical callable | application method | exact input carrier | logical output |
|---|---:|---:|---:|---|
| Command | 10 | 10 | 10 | `ApplicationResult<SandboxServiceOutcome>` |
| Query | 13 | 13 | 13 | 13 个 typed query result |
| Consumer | 9 | 9 | 9 | `ApplicationResult<SandboxConsumerServiceResult>` |
| Job | 10 | 10 | 10 | 前 9 个 paged result；reconciliation 专用 atomic result |
| **合计** | **42** | **42** | **42** | **42** |

物理 entry 形态可以多于 42，但不产生第二个 logical callable：

| physical entry shape | 物理接缝 | 覆盖的 logical callable | 计数规则 |
|---|---|---|---|
| API command handler | `api` command adapter | Command 10/10 | 每个 closed command DTO variant 一个 handler；不按 route 数或 response 数重复计数。 |
| API query handler | `api` query adapter | Query 13/13 | 每个 closed query DTO variant 一个 handler；只读，不产生 reservation。 |
| Worker fulfillment runner | `worker` fulfillment adapter | Command 4/10：Start、Capture、Handoff、Failure | 同一四个 Command method 的另一可信入口，不新增四个 method。 |
| Worker consumer handler | `worker` consumer adapter | Consumer 9/9 | 每个已验证 event kind 一个 handler；topic/schema name不参与选择。 |
| Worker relay loop | `worker` relay adapter | Job `PublishSandboxEventRelay` 1/10 | 复用同一 Job logical method，但 channel 固定 `Worker`；不依赖 `jobs` crate，不计为第 11 个 Job。 |
| Jobs runner | `jobs` application adapter | Job 10/10 | 每个 runner file 编译期固定一个 `SandboxJobKind`；不把 finalizer计为第 11 个 Job。 |

因此 planned physical adapter slot 可以是 `10 + 13 + 4 + 9 + 1 + 10 = 47`，而 logical callable 永远是 `42`；
Worker fulfillment 与 API Command、Worker relay 与 Jobs relay 是物理多入口重叠，不得复制 facade。

### B 批统一逐项 mapping contract

每一行映射必须同时满足以下双向条件；缺一项就不是闭合映射：

1. `selector -> exactly one entry method -> exactly one facade method`；不存在 alias、generic method 或 wildcard branch。
2. `method -> exactly one selector`；method 名、route、topic、binary、DTO type name和 typed-ref 顺序都不能反向猜 selector。
3. input carrier 的每个字段均标明来自已验证 API DTO、已验证 inbound event 或已验证 job selection；entry 不从 repository、
   domain、resolver、port、adapter、counter、clock 或 stored result store补字段。
4. factory 唯一生成 `OperationName` 和 `SandboxOperationChannel`；entry 不复制 operation mapping，不把 channel 写入
   duplicate identity。
5. command、consumer、worker、job fresh path 使用 non-empty `IdempotencyKey`；query 固定无 key。duplicate identity固定为
   `operation_name + request_digest + idempotency_key`，其中 digest 已覆盖 selector 和该 input 的全部业务字段。
6. application 返回的 carrier 是唯一业务结果来源；entry 只能建立 API disposition、worker receipt/loop result 或 jobs
   exit disposition，不得读取 current truth 重组结果。

`request_digest` 的“覆盖全部业务字段”是来源约束，不等于 entry 重新序列化 body；canonicalization 在 Step 8/validated
event/job selection owner 完成，entry 只传递 checked fingerprint。

## B.1 Command 10/10 exact entry mapping

下表的 `source fields` 是 application input 的完整 caller-owned字段集合；generated ref、Version、status、decision、
receipt、audit、relay、stored result 均明确不在 input 内。`API` 是同步 command adapter，`Worker` 只允许表中标出的四项。

| # | closed selector | physical entry -> facade method | exact input carrier；source fields | factory / channel / idempotency | application output -> entry carrier |
|---:|---|---|---|---|---|
| 1 | `OpenControlledExecutionContext` | verified API command variant -> `handle_open_controlled_execution_context` -> `open_controlled_execution_context` | `OpenControlledExecutionContextInput`; `source_refs`, `responsibility`, `intake_guard_ref` 来自同一 command DTO variant | `from_command`; `ApiCommand`; required key | `ApplicationResult<SandboxServiceOutcome>` -> `SandboxApiDisposition::from_command_outcome`; stored kind `CommandResult` |
| 2 | `EstablishExecutionBoundary` | verified API command variant -> `handle_establish_execution_boundary` -> `establish_execution_boundary` | `EstablishExecutionBoundaryInput`; `context_ref`, `environment_identity_ref`, 4维 `resource_limits`、`filesystem`、`network`、`process`、`workspace`、`mounts`、`lifecycle` 来自 command DTO 的 checked requirement fields | `from_command`; `ApiCommand`; required key | `SandboxServiceOutcome` -> API command disposition；generation/capability/handle/lease只来自 application outcome |
| 3 | `EvaluatePolicyExecution` | verified API command variant -> `handle_evaluate_policy_execution` -> `evaluate_policy_execution` | `EvaluatePolicyExecutionInput`; `context_ref`, `requirement_ref`, `boundary_ref`, `required_sources` 来自 command DTO；binding/authorization/marker不属于输入 | `from_command`; `ApiCommand`; required key | `SandboxServiceOutcome` -> API command disposition；不由 entry 写 policy status |
| 4 | `StartControlledExecutionRun` | verified API command或trusted fulfillment item -> `handle_start_controlled_execution_run` -> `start_controlled_execution_run` | `StartControlledExecutionRunInput`; `context_ref`, `boundary_ref`, `isolation_handle_ref`, `policy_decision_ref` 来自 DTO 或 frozen fulfillment item；不带 tool/runtime/runner body | API `from_command` / `ApiCommand`; Worker `from_worker` / `Worker`; required key | application outcome -> API `SandboxApiDisposition` 或 Worker `SandboxFulfillmentLoopResult`; run/capture ref不由 entry 生成 |
| 5 | `RecordCaptureResult` | verified API command或trusted fulfillment item -> `handle_record_capture_result` -> `record_capture_result` | `RecordCaptureResultInput`; exact `run_ref` 来自 DTO 或 frozen fulfillment item；capture candidate/body由 application/typed collector拥有 | API `from_command` / `ApiCommand`; Worker `from_worker` / `Worker`; required key | application outcome -> API disposition或 `SandboxFulfillmentLoopResult`; raw capture body不经过 entry |
| 6 | `OpenMaterialHandoff` | verified API command或trusted fulfillment item -> `handle_open_material_handoff` -> `open_material_handoff` | `OpenMaterialHandoffInput`; exact source selector、target plan和 checked target fields 来自 DTO 或 frozen fulfillment item；不含 per-target attempt/result | API `from_command` / `ApiCommand`; Worker `from_worker` / `Worker`; required key | application outcome -> API disposition或 fulfillment loop result；handoff progress由 application 返回 |
| 7 | `SubmitSandboxControl` | verified API command -> `handle_submit_sandbox_control` -> `submit_sandbox_control` | `SubmitSandboxControlInput`; `target`、`control_kind`、`source_candidate`、`conflict_guard_ref` 来自 command DTO；effect/existing fact/disposition不入参 | `from_command`; `ApiCommand`; required key | application outcome -> API disposition；control fact/effect observation不由 entry 拼装 |
| 8 | `ClassifySandboxFailure` | verified API command或trusted fulfillment item -> `handle_classify_sandbox_failure` -> `classify_sandbox_failure` | `ClassifySandboxFailureInput`; `context_ref`、optional `pending_failure_ref`、non-empty typed `sources` 来自 DTO 或 frozen observation item；failure kind/impact/status不入参 | API `from_command` / `ApiCommand`; Worker `from_worker` / `Worker`; required key | application outcome -> API disposition或 fulfillment loop result；classification marker由 application owner生成 |
| 9 | `EvaluateCleanupReadiness` | verified API command -> `handle_evaluate_cleanup_readiness` -> `evaluate_cleanup_readiness` | `EvaluateCleanupReadinessInput`; closed `target` 与 `safety_guard_ref` 来自 command DTO；evidence、release、complete bool不入参 | `from_command`; `ApiCommand`; required key | application outcome -> API disposition；不触发 backend release，不由 entry 宣布 Allowed/Completed |
| 10 | `RecordRedlineContainment` | verified API command -> `handle_record_redline_containment` -> `record_redline_containment` | `RecordRedlineContainmentInput`; `context_ref`、optional `run_ref`、`boundary_ref`、`isolation_handle_ref`、typed `source`、`containment_guard_ref` 来自 command DTO；containment status/release不入参 | `from_command`; `ApiCommand`; required key | application outcome -> API disposition；stop-new-use/containment truth只由 application owner提交 |

Command 双向审计结果：10 个 selector、10 个 handler/facade method、10 个 input carrier 和 10 个 output source 均一一对应。
Worker fulfillment 的 4 行只是 Command allow-set 的物理重叠；它不能调用其它 6 个 Command，也不能把
`SandboxFulfillmentLoopResult` 当成 application 新结果类型。

## B.2 Query 13/13 exact entry mapping

Query entry 只接受 `ApiQuery`，不创建 idempotency reservation、write UoW、projection repair、audit append、relay 或
external attempt。`page_request` 只在两个 bounded query 中出现；Jobs 的首页 cursor规则不适用于 API Query。

| # | closed selector | physical entry -> facade method | exact input carrier；source fields | factory / channel / idempotency | application output -> entry carrier |
|---:|---|---|---|---|---|
| 1 | `GetSandboxExecutionStatus` | verified API query variant -> `handle_get_sandbox_execution_status` -> `get_sandbox_execution_status` | `GetSandboxExecutionStatusInput`; `selector.context_ref` 来自 query DTO | `from_query`; `ApiQuery`; key forbidden | `SandboxQueryResult<SandboxExecutionStatusView>` -> API query result mapper |
| 2 | `GetBoundaryStatus` | verified API query variant -> `handle_get_boundary_status` -> `get_boundary_status` | `GetBoundaryStatusInput`; `selector` 的 `Exact { context_ref,boundary_ref }` 或 `CurrentForContext { context_ref }` 来自 query DTO；不由 latest scan 补 pair | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<BoundaryStatusView>` -> API query result mapper |
| 3 | `GetPolicyDecisionSummary` | verified API query variant -> `handle_get_policy_decision_summary` -> `get_policy_decision_summary` | `GetPolicyDecisionSummaryInput`; exact/current selector及其 context/ref pair来自 query DTO | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<PolicyDecisionSummaryView>` -> API query result mapper |
| 4 | `GetCaptureSummary` | verified API query variant -> `handle_get_capture_summary` -> `get_capture_summary` | `GetCaptureSummaryInput`; `Exact { context_ref,run_ref,capture_ref }`或`ForRun { context_ref,run_ref }`来自 query DTO | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<CaptureSummaryView>` -> API query result mapper |
| 5 | `GetMaterialHandoffStatus` | verified API query variant -> `handle_get_material_handoff_status` -> `get_material_handoff_status` | `GetMaterialHandoffStatusInput`; exact/current handoff selector及 context/handoff refs来自 query DTO | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<MaterialHandoffStatusView>` -> API query result mapper |
| 6 | `GetFailureControlStatus` | verified API query variant -> `handle_get_failure_control_status` -> `get_failure_control_status` | `GetFailureControlStatusInput`; `context_ref`、validated bounded `page_request`来自 query DTO；cursor不回退第一页 | `from_query`; `ApiQuery`; no key | `FailureControlStatusQueryResult` -> API bounded query result mapper |
| 7 | `GetCleanupReadiness` | verified API query variant -> `handle_get_cleanup_readiness` -> `get_cleanup_readiness` | `GetCleanupReadinessInput`; closed `CleanupReadinessSelector`来自 query DTO；不含 release command fields | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<CleanupReadinessView>` -> API query result mapper |
| 8 | `GetRedlineContainmentStatus` | verified API query variant -> `handle_get_redline_containment_status` -> `get_redline_containment_status` | `GetRedlineContainmentStatusInput`; required context + exact `RedlineContainmentSelector`来自 query DTO | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<RedlineContainmentView>` -> API query result mapper |
| 9 | `GetSandboxReadProjection` | verified API query variant -> `handle_get_sandbox_read_projection` -> `get_sandbox_read_projection` | `GetSandboxReadProjectionInput`; exact/current projection selector及 context/projection refs来自 query DTO；不触发rebuild | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<SandboxReadProjection>` -> API query result mapper |
| 10 | `GetDerivedInspectPreviewTrend` | verified API query variant -> `handle_get_derived_inspect_preview_trend` -> `get_derived_inspect_preview_trend` | `GetDerivedInspectPreviewTrendInput`; required context/state/kind selector来自 query DTO；kind不从view推导 | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<DerivedInspectPreviewTrendView>` -> API query result mapper |
| 11 | `GetBackendCapabilityComparison` | verified API query variant -> `handle_get_backend_capability_comparison` -> `get_backend_capability_comparison` | `GetBackendCapabilityComparisonInput`; context、requirement、ordered non-empty capability summary refs来自 query DTO；不调用 capability port | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<BackendCapabilityComparisonView>` -> API query result mapper |
| 12 | `GetSandboxReconciliationReport` | verified API query variant -> `handle_get_sandbox_reconciliation_report` -> `get_sandbox_reconciliation_report` | `GetSandboxReconciliationReportInput`; exact report selector来自 query DTO；不接受 scope/latest precedence | `from_query`; `ApiQuery`; no key | `SandboxQueryResult<SandboxReconciliationReport>` -> API query result mapper；不执行 repair |
| 13 | `GetSandboxAuditTrace` | verified API query variant -> `handle_get_sandbox_audit_trace` -> `get_sandbox_audit_trace` | `GetSandboxAuditTraceInput`; context、subject、optional closed kind filter、validated `page_request`来自 query DTO | `from_query`; `ApiQuery`; no key | `SandboxAuditTraceQueryResult` -> API bounded trace mapper；不追加read audit |

Query 双向审计结果：13/13 selector、method、input、output和API physical handler均闭合；所有 query context factory均为
`from_query`，key 为 `0/13`，entry write/external/repository direct-access 为 `0/13`。

## B.3 Consumer 9/9 exact entry mapping

Consumer entry 的可信顺序固定为：已验证 event kind -> checked metadata -> `from_consumer` -> 对应独立
`SandboxConsumerService` method。source event ref、candidate、guard和其它业务字段进入对应 input，不进入 call context；
raw event body在 DTO/event validator之后不得再次传入 application。每行的 application result 只由 worker receipt factory
消费，entry 不重组 truth。

| # | closed selector | physical entry -> facade method | exact input carrier；source fields | factory / channel / idempotency | application output -> entry carrier |
|---:|---|---|---|---|---|
| 1 | `ConsumeCallerContextReferenceChanged` | validated event kind -> `handle_caller_context_reference_changed` -> `consume_caller_context_reference_changed` | `ConsumeCallerContextReferenceChangedInput`; `source_event_ref`、`context_ref`、`refresh_marker`来自 validated event | `from_consumer`; `Consumer`; required dedup key | `SandboxConsumerServiceResult` -> `SandboxConsumerReceipt::from_application_outcome`; stored kind `ConsumerReceipt` |
| 2 | `ConsumePolicySummaryChanged` | validated event kind -> `handle_policy_summary_changed` -> `consume_policy_summary_changed` | `ConsumePolicySummaryChangedInput`; source event、context、`source_role`、`policy_snapshot_ref`、`refresh_marker`来自 event | `from_consumer`; `Consumer`; required dedup key | local status/outcome -> worker consumer receipt；不由 entry 重评 policy |
| 3 | `ConsumeBackendCapabilitySummaryChanged` | validated event kind -> `handle_backend_capability_summary_changed` -> `consume_backend_capability_summary_changed` | `ConsumeBackendCapabilitySummaryChangedInput`; source event、context、`requirement_ref`、`capability_ref`、marker来自 event | `from_consumer`; `Consumer`; required dedup key | local result -> `SandboxConsumerReceipt`；不由 entry 选择 backend |
| 4 | `ConsumeIsolationBackendLifecycleSignal` | validated event kind -> `handle_isolation_backend_lifecycle_signal` -> `consume_isolation_backend_lifecycle_signal` | `ConsumeIsolationBackendLifecycleSignalInput`; source event、`isolation_handle_ref`、body-free lifecycle candidate来自 event | `from_consumer`; `Consumer`; required dedup key | local result -> consumer receipt；canonical observation和release basis由 application 生成 |
| 5 | `ConsumeMaterialHandoffStatusChanged` | validated event kind -> `handle_material_handoff_status_changed` -> `consume_material_handoff_status_changed` | `ConsumeMaterialHandoffStatusChangedInput`; source event、handoff、material target、attempt、delivery candidate、`observed_at`来自 event | `from_consumer`; `Consumer`; required dedup key | local result -> consumer receipt；不由 entry 写 material/artifact truth |
| 6 | `ConsumeObservabilityHandoffStatusChanged` | validated event kind -> `handle_observability_handoff_status_changed` -> `consume_observability_handoff_status_changed` | `ConsumeObservabilityHandoffStatusChangedInput`; source event、handoff、observability material、target、attempt、candidate、`observed_at`来自 event | `from_consumer`; `Consumer`; required dedup key | local result -> consumer receipt；不证明 observability store/retention |
| 7 | `ConsumeSandboxControlRequested` | validated event kind -> `handle_sandbox_control_requested` -> `consume_sandbox_control_requested` | `ConsumeSandboxControlRequestedInput`; source event、target、control kind、external source candidate、conflict guard来自 event | `from_consumer`; `Consumer`; required dedup key | local result -> consumer receipt；Consumer source只能 `External` |
| 8 | `ConsumeInvestigationHandoffStatusChanged` | validated event kind -> `handle_investigation_handoff_status_changed` -> `consume_investigation_handoff_status_changed` | `ConsumeInvestigationHandoffStatusChangedInput`; source event、redline、investigation candidate、containment guard来自 event | `from_consumer`; `Consumer`; required dedup key | local result -> consumer receipt；不由 entry 提交 preservation snapshot 或 release |
| 9 | `ConsumeSandboxTruthRelayFeedback` | validated event kind -> `handle_sandbox_truth_relay_feedback` -> `consume_sandbox_truth_relay_feedback` | `ConsumeSandboxTruthRelayFeedbackInput`; source event、relay record、active attempt、feedback candidate、`observed_at`来自 event | `from_consumer`; `Consumer`; required dedup key | local result -> consumer receipt；不由 entry 创建第二 attempt |

Consumer 双向审计结果：9/9 event selector、handler、input、factory、channel和application result闭合；`ConsumerReceipt`
的 status/outcome/stored relation仍由 `7R-06C` 做 7 variant exhaustive mapping，当前不关闭 `OUTCOME-001` 或 `ENTRY-001`。

## B.4 Job 10/10 exact entry mapping

Jobs runner 的 kind 由 runner file 编译期固定值与已验证 job input kind逐项比较；不由 binary name、CLI、schedule、config、
topic或字符串推导。前 9 个 Job 使用 selection-bound paged input，首页 cursor由 application reader/selection owner承接，
entry 不重新引入 `initial_page_token`。第 10 个 reconciliation 使用 Step 6 canonical whole-scope input和专用 atomic
result，不进入 generic page/finalizer路径。

| # | closed selector | physical entry -> facade method | exact input carrier；source fields | factory / channel / idempotency | application output -> entry carrier |
|---:|---|---|---|---|---|
| 1 | `PublishSandboxEventRelay` | fixed jobs runner或 Worker relay loop -> `publish_sandbox_event_relay` | `PublishSandboxEventRelayJobInput` / `PublishSandboxEventRelaySelection`; validated selector、scope、selection page/permit fields来自 job selection reader；relay loop只传 frozen relay batch | Jobs runner `from_job` / `Job`; Worker relay `from_worker_job(PublishSandboxEventRelay)` / `Worker`; required key | application paged result -> Jobs `SandboxJobExitDisposition` 或 Worker `SandboxRelayLoopResult`; Worker不调用 jobs crate、不伪装 Job channel |
| 2 | `RefreshSandboxReferenceStates` | fixed jobs runner -> `refresh_sandbox_reference_states` | `RefreshSandboxReferenceStatesJobInput` / selection; exact context/source-state selectors与page limit来自 validated selection；不从missing row补建 | `from_job`; `Job`; required key | `SandboxPagedJobInvocationResult<RefreshSandboxReferenceStatesSelection>` -> jobs report accumulator/exit disposition |
| 3 | `RefreshBackendCapabilitySummaries` | fixed jobs runner -> `refresh_backend_capability_summaries` | `RefreshBackendCapabilitySummariesJobInput` / selection; exact context、requirement、capability target refs与page fields来自 selection | `from_job`; `Job`; required key | paged result -> jobs report accumulator/exit disposition；不由 runner 调用 capability port |
| 4 | `RetryPendingMaterialHandoffs` | fixed jobs runner -> `retry_pending_material_handoffs` | `RetryPendingMaterialHandoffsJobInput` / selection; eligible handoff/target/attempt selectors、retry eligibility和page fields来自 selection | `from_job`; `Job`; required key | paged result -> jobs report accumulator/exit disposition；不回滚 capture truth |
| 5 | `RunLeaseOrphanReaper` | fixed jobs runner -> `run_lease_orphan_reaper` | `RunLeaseOrphanReaperJobInput` / selection; exact lease/orphan owner targets、guard lineage和page fields来自 selection | `from_job`; `Job`; required key | paged result -> jobs report accumulator/exit disposition；未知处置保持 strict hold |
| 6 | `EvaluatePendingCleanupGuards` | fixed jobs runner -> `evaluate_pending_cleanup_guards` | `EvaluatePendingCleanupGuardsJobInput` / selection; exact cleanup guard/evaluation targets、safety guard refs和page fields来自 selection | `from_job`; `Job`; required key | paged result -> jobs report accumulator/exit disposition；不执行 release |
| 7 | `MaintainRedlineContainmentHandoffs` | fixed jobs runner -> `maintain_redline_containment_handoffs` | `MaintainRedlineContainmentHandoffsJobInput` / selection; exact redline/preservation/guard targets和page fields来自 selection | `from_job`; `Job`; required key | paged result -> jobs report accumulator/exit disposition；不解除 containment |
| 8 | `RebuildSandboxReadProjections` | fixed jobs runner -> `rebuild_sandbox_read_projections` | `RebuildSandboxReadProjectionsJobInput` / selection; explicit projection refs、source watermark/selection identity和page fields来自 selection；不由 query 触发 repair | `from_job`; `Job`; required key | paged result -> jobs report accumulator/exit disposition；whole-group projection write由 application 负责 |
| 9 | `MaintainDerivedInspectPreviewTrend` | fixed jobs runner -> `maintain_derived_inspect_preview_trend` | `MaintainDerivedInspectPreviewTrendJobInput` / selection; exact derived state refs、formal target kind、source watermark和page fields来自 selection | `from_job`; `Job`; required key | paged result -> jobs report accumulator/exit disposition；不反写 Sandbox core truth |
| 10 | `RunSandboxReconciliation` | fixed jobs runner -> `run_sandbox_reconciliation` | canonical `RunSandboxReconciliationJobInput`; complete explicit reconciliation scope、source-set/proof/digest来自 validated job input；不接受 latest/current 隐式 scope | `from_job`; `Job`; required key | `SandboxReconciliationMaterializationWriteOutcome` -> jobs report mapper/exit disposition；不进入 `SandboxPagedJobInvocationResult` 或 `finalize_job_report` |

### B.4.1 Relay channel exception

`PublishSandboxEventRelay` 是唯一同时允许长驻 Worker relay loop 和 one-shot Jobs runner 的 logical Job selector。两种物理入口
必须共享同一 application method和同一 typed input/selection contract，但上下文构造不可混用：

| physical source | context factory | channel | allowed result adapter | prohibited relation |
|---|---|---|---|---|
| Worker relay loop | `SandboxServiceCallContext::from_worker_job(PublishSandboxEventRelay, ...)` | `Worker` | `SandboxRelayLoopResult` | 不调用 `SandboxJobRunContext`、jobs crate、process exit mapping或binary dispatch。 |
| Jobs relay runner | `SandboxJobRunContext::call_context` -> `from_job` | `Job` | `SandboxJobExitDisposition` / JobReport path | 不把 Worker kind、topic或long-lived loop state写入Job report。 |

`Worker` channel 不进入 duplicate identity；它只用于入口 allow-set和 actor/context 校验。Worker relay 仍必须使用 frozen
relay batch、同一 operation/digest/key和 application 的 stored `JobReport` kind规则，不能通过“自己是worker”绕过 reservation、
stored replay或attempt correlation。

### B.4.2 Paged Job 与 reconciliation 计数边界

- 前 9 个 row 各有一个独立 method、input、selection type和 `SandboxPagedJobInvocationResult<S>`；第一页没有 entry-owned
  cursor，后续 token只能由 application reader返回并随 linear permit回传。
- `finalize_job_report` 只接收已耗尽的九类 permit，负责原 operation 的 report/stored/idempotency relation；它不是
  `SandboxJobKind`、不是 physical dispatch selector、不是第 43 个 logical callable。
- `RunSandboxReconciliation` 的 `SandboxReconciliationMaterializationWriteOutcome` 是专用 atomic result；不能为了统一
  entry mapper而强制转换成 generic `SandboxServiceOutcome`、空 batch或 `SandboxJobReportAccumulator`。
- Jobs runner 只能消费 application 返回的完整 batch/report/result；不得自行读 repository、重算 selection、从 counter 或
  last cursor拼 report，也不得从 process exit code反向生成业务 status。

## B.5 42/42 双向 join 与 source coverage audit

### B.5.1 正向与反向覆盖

| coverage dimension | expected | current design result |
|---|---:|---:|
| Command selector -> method -> input -> output | 10 | 10/10 |
| Query selector -> method -> input -> output | 13 | 13/13 |
| Consumer selector -> method -> input -> output | 9 | 9/9 |
| Job selector -> method -> input -> output | 10 | 10/10 |
| logical selector -> exactly one facade method | 42 | 42/42 |
| facade method -> exactly one selector | 42 | 42/42 |
| exact input carrier | 42 | 42/42 |
| input field source declaration | 42 | 42/42 |
| context factory and channel | 42 | 42/42 |
| idempotency policy | 42 | 42/42; Query 0/13 keys, non-Query 29/29 required |
| application output source | 42 | 42/42 |
| generic `run(kind, payload)` / string dispatch | 0 | 0 positive occurrences |
| entry-created domain identity / Version / status / stored result | 0 | 0 |
| Worker relay dependency on `jobs` crate | 0 | 0 |
| Jobs reintroduced `initial_page_token` | 0 | 0 |

### B.5.2 Input field provenance rule

对每个 row，entry adapter 在 facade call 前必须已经拥有以下 provenance tuple：

```text
(validated selector kind,
 exact input carrier constructor,
 every input field's source: DTO | event | job selection,
 checked trace/digest/key metadata,
 context factory,
 expected application output carrier)
```

任意字段出现以下情况均判定 mapping invalid，并在 `7R-06C` 进入 typed error closure：

- 从 route、HTTP method、topic、schema name、binary name、Debug 文本、DTO type name或 typed-ref 顺序推导 selector/operation。
- 从 repository/latest scan、resolver、adapter/private provider state、stored result、counter或current clock补齐 caller input。
- 将 application result裁成 bool/status/string，再由 entry猜测 `Accepted`、`Delayed`、`Failed`、`Duplicate`或`Completed`。
- 把 source event body、tool command、runtime agent action、member lifecycle request、artifact正文、observability正文或
  investigation case正文放入 Sandbox input。

### B.5.3 Physical entry handoff matrix

| physical adapter | validates | calls | receives | never owns |
|---|---|---|---|---|
| API command | DTO closed variant、actor、trace、digest、key、input constructor | one of 10 Command methods | `SandboxServiceOutcome` | domain truth、UoW、repository、adapter、stored result |
| API query | DTO closed variant、actor、trace、digest、body/selector consistency | one of 13 Query methods | typed query result | reservation、write、repair、audit append、external call |
| Worker fulfillment | trusted worker kind、fixed command allow-set、system actor、frozen item digest/key | one of 4 allowed Command methods | outcome -> fulfillment loop carrier | tools/runtime/member loop、backend state、run identity |
| Worker consumer | event kind、source/schema/dedup proof、trusted metadata、body-free input | one of 9 Consumer methods | local result -> receipt | domain observation、status transition、publisher private state |
| Worker relay | frozen relay batch、active attempt metadata、Worker factory | `publish_sandbox_event_relay` only | paged result -> relay loop carrier | jobs crate、Job channel、topic dispatch、new attempt |
| Jobs runner | fixed job kind、system actor、run metadata、selection/input relation | one of 10 Job methods | paged/atomic result -> report/exit carrier | repository scan、scope expansion、process code as business status |

## B.6 B 批 gate、remaining work 与真实性声明

| gate | result |
|---|---|
| 42 logical selector/method/input/output mapping | pass for design: 42/42 |
| API command/query physical adapter ownership | pass for design |
| Worker fulfillment/consumer/relay physical adapter ownership | pass for design |
| Jobs fixed runner/reconciliation boundary | pass for design |
| context factory/channel/idempotency source map | pass for design |
| output/receipt/report variant exhaustive relation | deferred to `7R-06C` |
| API/Worker/Jobs exhaustive error mapping | deferred to `7R-06C` |
| existing Step 7 blockers | remain open; no premature closure |
| new L1/L2 upstream blocker | 0 |

本批完成后，唯一允许的下一内部批次是 `7R-06C output/receipt/report and exhaustive error mapping`。在用户复核前不得进入
`7R-06C`、`7R-04`、`S7-05`、Step 8、正式 `03` 回填或 implementation。

本批只形成静态设计关系。未执行代码、编译、测试、provider、fake/durable parity、runtime、evidence或验收；未生成 run_id、
evidence alias、signoff或实现 commit。`42/42`、`47` physical slot和各项 `pass for design` 仅表示文档静态覆盖，不表示
运行时结果。

## EOF Current Recovery Override: `7R-06C-1` output/receipt/report mapping in progress

本节是本中间产物物理 EOF 的唯一 current authority。`7R-06B` 已完成并经用户确认；`7R-06C-1` 只补既有 callable 的
结果载体关系，不新增 selector、method、status、stored kind、repository、identity 或 protocol DTO。正式
`03-详细设计.md` 尚未回填。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v4.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1A API command/query output mapping in_progress
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = content_in_progress
batch_status = in_progress
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B
next_internal_batch = 7R-06C-1B Worker consumer/fulfillment/relay output mapping
next_allowed_action = complete_7r_06c_1a_before_worker_mapping
tracked_tasks = 108_unique
task_status = 38_completed,1_in_progress,66_pending,1_blocked
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
logical_callable_join = Command 10/10|Query 13/13|Consumer 9/9|Job 10/10|total 42/42
physical_entry_slot_model = API 23|Worker fulfillment 4 overlap|Worker consumer 9|Worker relay 1 overlap|Jobs 10; planned slots 47
query_idempotency = 0/13
fresh_non_query_idempotency = 29/29
worker_relay_channel = Worker
jobs_reconciliation_result = SandboxReconciliationMaterializationWriteOutcome; not generic paged/finalizer
finalize_job_report_callable_count = 0 additional; not the 43rd callable
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

### C-1A.1 Output authority and entry conversion order

`7R-06C` 的结果映射以 application 已返回的 typed carrier 为唯一业务结果来源。entry 允许做的事情只有：

1. 校验物理入口的 closed selector、factory、channel、actor、trace、digest、key 与对应 facade 的静态关系。
2. 对 `ApplicationResult<T>` 的 `Ok(T)` 调用 Step 6 已拥有的 checked carrier factory，保留完整 outcome、typed body、stored
   result link、source event、job permit 或 report accumulator；不得裁成 bool、string、counter 或裸 status。
3. 对 `Err(ApplicationError)` 调用当前 surface 的 `ApiError`、`WorkerError` 或 `JobsError` 包装；错误穷举在 C-2 单独
   完成，C-1 不提前宣称 error closure。
4. 将已构造的 transient entry carrier交给 Step 8 protocol/ack/process mapper；entry不写 transport status/code、ack、process
   exit code、business audit、repository或stored-result store。

以下四类来源必须保持可区分：

| 来源类别 | 允许的 source | entry 允许生成的 carrier | 禁止行为 |
|---|---|---|---|
| fresh | application 本次调用返回的完整 typed outcome/result，且其 commit/stored relation 已在 application owner 校验 | API disposition、Worker loop/receipt、Jobs paged/exit carrier | 从 current truth、counter、latest scan或private provider outcome重组结果。 |
| duplicate | application outcome 中携带的 exact stored result，或 reconciliation atomic outcome 携带的原 stored envelope | 对应 replay carrier；不创建 fresh permit/batch | 重跑 callable、重新分配 identity、读取 current truth拼回旧 body。 |
| error | `ApplicationResult::Err` 的 typed `ApplicationError`，或入口自身的有限 relation/input error | `ApiError`、`WorkerError`、`JobsError` | raw provider cause穿透、把 error 改成业务成功/失败状态、用 wildcard兜底。 |
| no-write | Query 的 typed read surface；只读 application result 明确禁止 mutation | `SandboxApiDisposition::Query` | command/consumer/job 的 `NoWrite` 当作 accepted；query触发repair、audit、reservation或external call。 |

`Ok` carrier缺少必需 stored result、wrong stored kind、status relation不一致、context/channel不一致或完整性缺口时，
entry必须返回 typed relation error；不得将其降为 `Degraded`、`Rejected`、`Empty`、`Skipped` 或重新调用 application。
`NoWrite` 不是 entry 的通用成功分支：它只对 query surface 合法；command、worker fulfillment/relay、consumer receipt和
Jobs report若返回 `NoWrite`，均在对应 factory中拒绝。

### C-1A.2 API Command 10/10 output mapping

所有 API Command 的统一物理步骤固定为：

```text
validated ApiCommand variant
  -> fixed command_kind + SandboxServiceCallContext::from_command
  -> one exact application command method
  -> ApplicationResult<SandboxServiceOutcome>
  -> SandboxApiDisposition::from_command_outcome(command_kind, result_status, outcome)
  -> Step 8 response DTO mapper
```

`result_status` 必须由 Step 8 command result builder或可信 Worker fulfillment contract提供；API entry不能从 outcome 的
truth refs、side-effect refs、reason数量、stored status或方法名推断它。`from_command_outcome` 按 Step 6 的 7 项关系执行：
`Accepted -> Accepted/Completed`、`Rejected -> Rejected/Rejected`、`Degraded -> Degraded/Completed`、
`NoChange -> Pending/Completed`、`Failed -> Failed/Failed`、`DuplicateReplayed -> DuplicateReplayed/original stored
status`；`NoWrite` 没有合法 command disposition。以下表把 10 个 selector 逐项绑定到该共同规则，避免 generic command
adapter丢失 method identity：

| # | selector / facade method | fresh `Ok` output source | duplicate source | no-write / relation failure | entry carrier |
|---:|---|---|---|---|---|
| 1 | `OpenControlledExecutionContext` / `open_controlled_execution_context` | application 返回完整 `SandboxServiceOutcome`；context/identity/intake refs只从 outcome读取 | 同 operation/key/digest 的 stored `CommandResult` 由 outcome 原样携带 | `NoWrite`、缺 stored result、wrong kind或 command status mismatch -> `ApiError` | `SandboxApiDisposition::Command` |
| 2 | `EstablishExecutionBoundary` / `establish_execution_boundary` | outcome 的 boundary decision、capability、handle、lease refs及stored relation | 只 replay 原 `CommandResult`，不重新 qualification或读取当前 handle | 不得由 entry 生成 boundary status/handle；任何缺口 -> typed `ApiError` | `SandboxApiDisposition::Command` |
| 3 | `EvaluatePolicyExecution` / `evaluate_policy_execution` | outcome 的 policy decision、snapshot、fail-closed marker及stored relation | 只 replay 原 command surface；不重新评估policy | `NoWrite`或缺 policy result不能转 query/Rejected success；-> `ApiError` | `SandboxApiDisposition::Command` |
| 4 | `StartControlledExecutionRun` / `start_controlled_execution_run` | outcome 的 run/launch marker、truth refs、side effects和stored command result | duplicate只移动原 stored result；不再次 launch、生成 run ref或读取 runtime state | entry不接受 runtime/tool/agent loop body；relation mismatch -> `ApiError` | API `SandboxApiDisposition::Command`；Worker另走 fulfillment carrier |
| 5 | `RecordCaptureResult` / `record_capture_result` | outcome 的 capture/material/observability refs及stored result | duplicate不读取 capture repository、不重建 material refs | raw capture body不是 output source；NoWrite或missing stored -> `ApiError` | `SandboxApiDisposition::Command` |
| 6 | `OpenMaterialHandoff` / `open_material_handoff` | outcome 的 handoff/relay refs、pending/degraded result和stored surface | duplicate只 replay handoff command result，不重发 external attempt | entry不从 publisher状态推导 handoff status；-> `ApiError` | `SandboxApiDisposition::Command` |
| 7 | `SubmitSandboxControl` / `submit_sandbox_control` | outcome 的 control fact/effect observation、stored result和approved side effects | duplicate只 replay原 control surface，不再提交 control | entry不执行 control、创建第二 fact或读取 runtime；-> `ApiError` | `SandboxApiDisposition::Command` |
| 8 | `ClassifySandboxFailure` / `classify_sandbox_failure` | outcome 的 failure classification、source refs、containment/relay refs和stored result | duplicate只 replay原 classification，不重新分类或覆盖 prior failure | `NoWrite`不得成为 failure成功；raw detector/backend cause不得进入 output | `SandboxApiDisposition::Command` |
| 9 | `EvaluateCleanupReadiness` / `evaluate_cleanup_readiness` | outcome 的 cleanup guard、blocking refs、safe reasons和stored result | duplicate只 replay原 guard evaluation，不触发 release/reaper | entry不得把 `Allowed` 推断为 release complete；relation mismatch -> `ApiError` | `SandboxApiDisposition::Command` |
| 10 | `RecordRedlineContainment` / `record_redline_containment` | outcome 的 containment marker、preservation/investigation refs和stored result | duplicate只 replay原 containment surface，不解除 containment或重新调查 | entry不得把 containment status重写为 Released；-> `ApiError` | `SandboxApiDisposition::Command` |

Command disposition 的 `stored_result` 必须是 `SandboxStoredResultKind::CommandResult`，并由
`validate_for_command(command_kind)` 再次确认 operation、surface ref、status relation。entry不复制 truth/side-effect/reason
集合；这些集合仅由 Step 8 DTO mapper按已验证 outcome逐字段投影。`DuplicateReplayed` 的原 stored status 可以是
`Completed`、`Rejected`或`Failed`，但 entry disposition仍是 `Accepted`，因为本次动作是成功回放，而不是重新执行。

### C-1A.3 API Query 13/13 output mapping

Query 的统一物理步骤固定为：

```text
validated ApiQuery variant
  -> fixed query_kind + SandboxServiceCallContext::from_query (idempotency_key = None)
  -> one exact application query method
  -> typed SandboxQueryResult<T> / bounded query result
  -> SandboxApiDisposition::from_query_surface(surface_status)
  -> Step 8 typed query response mapper
```

`SandboxApiDisposition::Query` 只携带最终 `surface_status`；typed body、page info和safe reasons仍由 application result
原样交给 Step 8。entry不把 `Visible`、`Empty`、`Stale`、`Degraded`、`Rebuilding`等 surface 归一为一个 `ok`，也不把
`MissingProjection`、`Unavailable`、`NotVisible`伪装成 `Empty`。13项映射如下：

| # | selector / facade method | exact typed output | surface -> entry disposition | no-write boundary |
|---:|---|---|---|---|
| 1 | `GetSandboxExecutionStatus` / `get_sandbox_execution_status` | `SandboxQueryResult<SandboxExecutionStatusView>` | `Visible/Empty/Restricted/Stale/Degraded` -> `Accepted`；`NotVisible/Disabled` -> `Rejected`；`Rebuilding/MissingProjection/Unavailable` -> `Delayed`；`Failed` -> `Failed` | body/reasons来自结果；不补 run/cleanup/redline状态 |
| 2 | `GetBoundaryStatus` / `get_boundary_status` | `SandboxQueryResult<BoundaryStatusView>` | 按同一 11-status surface mapping；不因缺 handle重建 boundary | 不读取 capability port、不写 repair |
| 3 | `GetPolicyDecisionSummary` / `get_policy_decision_summary` | `SandboxQueryResult<PolicyDecisionSummaryView>` | 按 surface 原样映射；stale/degraded保持 caller-safe body/reasons | 不重评policy、不改 fail-closed decision |
| 4 | `GetCaptureSummary` / `get_capture_summary` | `SandboxQueryResult<CaptureSummaryView>` | 按 surface 原样映射；absence必须是 typed `Empty` proof | 不创建 capture/material/ref |
| 5 | `GetMaterialHandoffStatus` / `get_material_handoff_status` | `SandboxQueryResult<MaterialHandoffStatusView>` | 按 surface 原样映射；publisher unavailable不得变为 Delivered | 不重发 handoff、不改 attempt |
| 6 | `GetFailureControlStatus` / `get_failure_control_status` | `FailureControlStatusQueryResult` | `surface_status`与同 snapshot `page_info`一并交给 mapper；不从 window count猜status | 不 classify、control、retry或追加 audit |
| 7 | `GetCleanupReadiness` / `get_cleanup_readiness` | `SandboxQueryResult<CleanupReadinessView>` | `Allowed/Blocked/Pending`是 body内 guard truth，不改写 surface；surface仍按 11-status映射 | 不执行 release、reaper或guard refresh |
| 8 | `GetRedlineContainmentStatus` / `get_redline_containment_status` | `SandboxQueryResult<RedlineContainmentView>` | containment body与query surface分层；不把 `Contained`当 query `Visible`以外的新status | 不解除 containment、不触发 investigation |
| 9 | `GetSandboxReadProjection` / `get_sandbox_read_projection` | `SandboxQueryResult<SandboxReadProjection>` | `Rebuilding/MissingProjection`保持 Delayed；last-known body不能改成 fresh | 不重建 projection、不用 view 反写 truth |
| 10 | `GetDerivedInspectPreviewTrend` / `get_derived_inspect_preview_trend` | `SandboxQueryResult<DerivedInspectPreviewTrendView>` | stale/degraded body保留 safe reasons；derived failure不升格 core failure | 不启动 derived maintenance |
| 11 | `GetBackendCapabilityComparison` / `get_backend_capability_comparison` | `SandboxQueryResult<BackendCapabilityComparisonView>` | unsupported/degraded comparison保持 surface/body分层；不推断 capability allow | 不调用 capability port、不建立 boundary |
| 12 | `GetSandboxReconciliationReport` / `get_sandbox_reconciliation_report` | `SandboxQueryResult<SandboxReconciliationReport>` | report absence只有 exact `Empty` proof；finding/status来自 typed report | 不 repair、reconcile或 latest scan |
| 13 | `GetSandboxAuditTrace` / `get_sandbox_audit_trace` | `SandboxAuditTraceQueryResult` | surface、items、page_info、reasons必须同 snapshot转交；不从 item count生成 surface | 不追加 audit、不读取 raw audit body |

Query 的 `Empty` 只可来自 application 的 exact absence/complete empty-scope proof；entry 不将 repository `None`、timeout、
missing projection或not-visible结果改成 `Empty`。`FailureControlStatusQueryResult` 和 `SandboxAuditTraceQueryResult` 的
`page_info` 不转换成 Jobs page token，也不引入 `initial_page_token`；API page cursor 的 wire mapping由 Step 8 拥有。

### C-1A.4 API C-1A gate

| gate | result |
|---|---|
| API Command 10/10 selector -> outcome -> disposition | pass for design；10/10逐项记录 |
| API Query 13/13 typed result -> surface disposition | pass for design；13/13逐项记录 |
| fresh / duplicate / no-write source separation | pass for design；error exact variant mapping deferred to C-2 |
| API entry direct repository/domain/UoW/stored-store access | 0 by contract；未执行代码验证 |
| formal `03` writeback | not started；仍冻结 |

本小批只完成 C-1A 静态设计，下一小批为 `7R-06C-1B` Worker consumer/fulfillment/relay output mapping；不得跨到 C-2、Step 8
或正式文档回填。

## EOF Current Recovery Override: `7R-06C-1A` API command/query output mapping completed, user review pending

本节是本中间产物物理 EOF 的唯一 current authority。`7R-06C-1A` 已完成 API Command 10/10、API Query 13/13 的 output
carrier 映射与 fresh/duplicate/no-write 来源审计；error 的 7/12/17 variant 穷举仍留给后续 C-2。正式 `03-详细设计.md`
继续冻结。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v4.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1A API command/query output mapping completed_wait_user_review
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = user_review_pending
batch_status = completed_wait_user_review
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A
next_internal_batch = 7R-06C-1B Worker consumer/fulfillment/relay output mapping
next_allowed_action = wait_user_review_before_worker_mapping
tracked_tasks = 108_unique
task_status = 39_completed,0_in_progress,66_pending,1_blocked
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
logical_callable_join = Command 10/10|Query 13/13|Consumer 9/9|Job 10/10|total 42/42
physical_entry_slot_model = API 23|Worker fulfillment 4 overlap|Worker consumer 9|Worker relay 1 overlap|Jobs 10; planned slots 47
query_idempotency = 0/13
fresh_non_query_idempotency = 29/29
worker_relay_channel = Worker
jobs_reconciliation_result = SandboxReconciliationMaterializationWriteOutcome; not generic paged/finalizer
finalize_job_report_callable_count = 0 additional; not the 43rd callable
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

### C-1A 完成审计

| gate | result |
|---|---|
| API Command selector/method/outcome/disposition | pass for design: 10/10 |
| API Query selector/method/typed result/surface disposition | pass for design: 13/13 |
| fresh / duplicate / no-write source separation | pass for design；error carrier mapping deferred to C-2 |
| new callable、status、stored kind、repository或entry-owned truth | 0 |
| real implementation / test / evidence / signoff | 未执行、未生成 |

用户复核前不得进入 `7R-06C-1B`、`7R-06C-2`、`7R-04`、`S7-05`、Step 8、正式 `03` 回填或 implementation。

## EOF Current Recovery Override: `7R-06C-1B` Worker output mapping in progress

本节是本中间产物物理 EOF 的唯一 current authority。用户已确认 `7R-06C-1A`；本批只闭合 Worker consumer、fulfillment
和 relay 的既有结果载体关系，不新增 callable、selector、status、stored kind、repository、identity 或 jobs 依赖。
正式 `03-详细设计.md` 继续冻结。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v4.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1B Worker consumer/fulfillment/relay output mapping in_progress
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = content_in_progress
batch_status = in_progress
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A
next_internal_batch = 7R-06C-1C Jobs paged/exit/reconciliation output mapping
next_allowed_action = complete_7r_06c_1b_before_jobs_mapping
tracked_tasks = 108_unique
task_status = 39_completed,1_in_progress,65_pending,1_blocked
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
logical_callable_join = Command 10/10|Query 13/13|Consumer 9/9|Job 10/10|total 42/42
physical_entry_slot_model = API 23|Worker fulfillment 4 overlap|Worker consumer 9|Worker relay 1 overlap|Jobs 10; planned slots 47
query_idempotency = 0/13
fresh_non_query_idempotency = 29/29
worker_relay_channel = Worker
jobs_reconciliation_result = SandboxReconciliationMaterializationWriteOutcome; not generic paged/finalizer
finalize_job_report_callable_count = 0 additional; not the 43rd callable
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

本次切换只记录设计工作状态，不代表实现、测试、run、evidence 或验收事实。

### C-1B.1 Worker output authority and common conversion order

Worker 入口的业务结果来源固定为 application facade 的 typed result。Worker loop 不拥有 Sandbox truth、stored-result
store、repository、domain transition、ack state 或 publisher private outcome。每类入口的转换顺序如下：

```text
validated event / frozen fulfillment item / frozen relay batch
  -> exact Worker context factory
  -> one allow-listed application method
  -> typed application result
  -> Worker-owned checked carrier
  -> Step 8/9/12 ack, telemetry or process mapper
```

共同约束：

| rule | Worker contract |
|---|---|
| selector | 只能由已验证 event kind、frozen fulfillment command kind或固定 relay selector决定；不能从 topic、payload type name、Debug 文本或 status反推。 |
| context | Consumer 使用 `from_consumer`；fulfillment 使用 `from_worker`；relay 使用 `from_worker_job(PublishSandboxEventRelay, ...)`；channel 不可互换。 |
| output | 保留完整 application outcome、closed selector、source event/worker context、public status和完成时间；不得只返回 counter、bool或裸 error。 |
| fresh | 使用本次 application 返回的完整 result；不得从 current truth、repository scan、backend handle、publisher status或runtime state补字段。 |
| duplicate | 只搬运 application 返回的 exact stored surface；不重新调用 callable、不创建 attempt/run/receipt identity、不读 current truth重建。 |
| no-write | Consumer/fulfillment/relay 不接受 query-only `NoWrite`；构造对应 carrier时返回 `WorkerError::NoWriteOutcomeForbidden`。 |
| error | `ApplicationError`只包装为 `WorkerError::Application`；Worker-local缺口使用 closed WorkerError variant，raw cause不穿透。 |
| ownership | Worker carrier是transient，不持久化为第二 lifecycle/status；业务 truth、stored result和report由application owner保存。 |

### C-1B.2 Consumer 9/9 receipt mapping

所有 Consumer 入口统一执行：

```text
validated inbound envelope
  -> fixed SandboxConsumerKind + SandboxServiceCallContext::from_consumer
  -> one exact SandboxConsumerService method
  -> ApplicationResult<SandboxConsumerServiceResult>
  -> result.into_parts()
  -> SandboxConsumerReceipt::from_application_outcome(
       source_event_ref, consumer_kind, envelope.trace_context,
       receipt_status, outcome)
  -> Step 8 receipt mapper + Step 9/12 ack policy
```

`source_event_ref`、`consumer_kind`和`trace_context`必须来自同一个 validated envelope；Worker不能从 outcome、stored result或
topic重新构造它们。`SandboxConsumerServiceResult` 的 `receipt_status` 和 `outcome`必须逐字段传给 receipt factory，不能由
Worker重算。factory先验证 source ref、outcome shape、stored kind=`ConsumerReceipt`和 `validate_for_consumer`，再执行 7/7
status relation：

| receipt status | outcome status | stored status | receipt disposition | Worker boundary |
|---|---|---|---|---|
| `Accepted` | `Accepted` | `Completed` | `Accepted` | ack/retry不在receipt内决定 |
| `Duplicate` | `DuplicateReplayed` | original `Completed/Rejected/Failed` | `Accepted` | 不重跑原consumer callable |
| `Delayed` | `NoChange`或`Degraded` | `Completed` | `Delayed` | 由外层policy结合错误/lease决定重试 |
| `Rejected` | `Rejected` | `Rejected` | `Rejected` | 不构造success receipt |
| `Failed` | `Failed` | `Failed` | `Failed` | 不用raw cause填充receipt |
| `Quarantined` | `Rejected`或`NoChange` | 对应`Rejected`或`Completed` | `Rejected` | quarantine marker必须已由application形成完整surface |
| `NoOp` | `NoChange` | `Completed` | `Skipped` | 不把NoOp写成Accepted |

9 个 Consumer selector 到 receipt 的逐项映射如下。每行的 application result 都是同一个
`SandboxConsumerServiceResult` 类型，但 selector、input provenance、stored consumer operation和禁止的重组来源保持独立：

| # | Consumer selector / method | fresh output source | duplicate source | no-write / mismatch | Worker carrier |
|---:|---|---|---|---|---|
| 1 | `ConsumeCallerContextReferenceChanged` / `consume_caller_context_reference_changed` | application 返回 reference state / stale marker / projection或relay refs及完整 `ConsumerReceipt` stored relation | replay原 caller-context receipt；不重新解析external reference | `NoWrite`、缺receipt、wrong kind或status mismatch -> `WorkerError` | `SandboxConsumerReceipt` |
| 2 | `ConsumePolicySummaryChanged` / `consume_policy_summary_changed` | application 返回 policy reference/stale fence及完整 receipt；不重新评估policy | replay原 policy-change receipt；不由Worker判断allow/deny | 不从payload body或current policy scan补结果；relation mismatch -> `WorkerError` | `SandboxConsumerReceipt` |
| 3 | `ConsumeBackendCapabilitySummaryChanged` / `consume_backend_capability_summary_changed` | application 返回 capability reference/comparison stale marker及receipt | replay原 capability-change receipt；不选择backend或建立boundary | 不把source summary直接当 capability truth；NoWrite -> error | `SandboxConsumerReceipt` |
| 4 | `ConsumeIsolationBackendLifecycleSignal` / `consume_isolation_backend_lifecycle_signal` | application 返回 canonical lifecycle observation/orphan/failure marker及receipt | replay原 lifecycle receipt；不由Worker release/renew handle | 不上传 final handle/lease/cleanup status，不从backend state推导 | `SandboxConsumerReceipt` |
| 5 | `ConsumeMaterialHandoffStatusChanged` / `consume_material_handoff_status_changed` | application 返回 matching handoff observation/status refs及receipt | replay原 handoff receipt；不重发external attempt或回滚capture | 不把delivery candidate直接当Delivered truth；-> `WorkerError` on mismatch | `SandboxConsumerReceipt` |
| 6 | `ConsumeObservabilityHandoffStatusChanged` / `consume_observability_handoff_status_changed` | application 返回 observability handoff observation/marker及receipt | replay原 observability receipt；不证明retention/store truth | 不上传raw telemetry/body或推断observability complete | `SandboxConsumerReceipt` |
| 7 | `ConsumeSandboxControlRequested` / `consume_sandbox_control_requested` | application 返回 control fact/effect observation及receipt | replay原 control receipt；不再次提交control | Consumer source必须是`External`；不创建第二 control fact或调用runtime | `SandboxConsumerReceipt` |
| 8 | `ConsumeInvestigationHandoffStatusChanged` / `consume_investigation_handoff_status_changed` | application 返回 investigation observation/preservation marker及receipt | replay原 investigation receipt；不重新调查、release或提交preservation snapshot | 不上传case正文、cleanup status或containment决策 | `SandboxConsumerReceipt` |
| 9 | `ConsumeSandboxTruthRelayFeedback` / `consume_sandbox_truth_relay_feedback` | application 返回 exact relay attempt feedback / versioned status及receipt | replay原 relay-feedback receipt；不创建第二attempt或回滚source truth | 不把publisher HTTP/SDK/raw status直接写入 receipt；-> `WorkerError` | `SandboxConsumerReceipt` |

`SandboxConsumerReceipt::entry_disposition()` 只表达 `Accepted/Delayed/Rejected/Failed/Skipped` 的有限入口处置；具体
transport ack、retry、quarantine、dead-letter、backoff 和 telemetry 由 Step 9/12 读取 receipt 与 WorkerError 后决定。Worker
不得用 `receipt_status` 单独决定 ack，也不得把 `Delayed`自动变成 retry success。

### C-1B.3 Fulfillment 4/4 loop-result mapping

Fulfillment 是 API Command allow-set 的可信 Worker 物理重入口，只允许以下四个 command：
`StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、`ClassifySandboxFailure`。它们复用同一个
application facade method和 `SandboxServiceOutcome`，不新增 Worker-specific application result 或 callable。

统一转换顺序：

```text
trusted frozen fulfillment item
  -> SandboxServiceCallContext::from_worker(command_kind, ...)
  -> one of four allow-listed command methods
  -> ApplicationResult<SandboxServiceOutcome>
  -> SandboxFulfillmentLoopResult::finish(
       run_context, command_kind, result_status, outcome, finished_at)
  -> Step 8 command mapper / Step 9 worker loop policy
```

`run_context`、`command_kind`、`result_status`和`finished_at`来源分别固定为：trusted Worker runtime assembly、frozen item
selector、Step 8 command surface builder、application-return boundary clock。Worker不得从 run ref 生成 identity/digest/key，
不得从 outcome truth refs、stored status、item counter或backend handle state推导 `result_status`。`finish`必须校验：
worker kind=`ControlledExecutionFulfillment`、stored kind=`CommandResult`、`validate_for_command(command_kind)`、四项
allow-set和 `finished_at >= started_at`。

| # | command selector / method | fresh output source | duplicate source | no-write / mismatch | Worker carrier |
|---:|---|---|---|---|---|
| 1 | `StartControlledExecutionRun` / `start_controlled_execution_run` | application outcome的run marker、launch truth refs、side effects和完整 CommandResult stored relation | application返回原 stored command result；Worker不再次launch、不创建run ref | `NoWrite`、wrong worker kind、missing/wrong stored kind、status mismatch或时间倒序 -> `WorkerError` | `SandboxFulfillmentLoopResult` |
| 2 | `RecordCaptureResult` / `record_capture_result` | application outcome的capture/material/observability refs和完整 stored relation；raw capture body不在 carrier | replay原 capture command surface；不重读capture/material repository | 不从backend/runtime output补body或ref；任何 relation mismatch -> `WorkerError` | `SandboxFulfillmentLoopResult` |
| 3 | `OpenMaterialHandoff` / `open_material_handoff` | application outcome的handoff/relay refs、pending/degraded shape和stored relation | replay原 handoff result；不重发 publisher/external attempt | 不从publisher private status推导 handoff state；`NoWrite` -> `NoWriteOutcomeForbidden` | `SandboxFulfillmentLoopResult` |
| 4 | `ClassifySandboxFailure` / `classify_sandbox_failure` | application outcome的failure classification/source/containment refs和stored relation | replay原 failure result；不重分类、不覆盖prior failure | 不传 raw detector/backend body，不把 `NoWrite` 当分类成功 | `SandboxFulfillmentLoopResult` |

fulfillment loop result 的 status relation 是 7/7 closed matrix：

| outcome status | required command result status | loop disposition |
|---|---|---|
| `Accepted` | `Accepted` | `Accepted` |
| `Rejected` | `Rejected` | `Rejected` |
| `Degraded` | `Degraded` | `Accepted` |
| `NoChange` | `Pending` | `Accepted` |
| `NoWrite` | none | construction error |
| `Failed` | `Failed` | `Failed` |
| `DuplicateReplayed` | `DuplicateReplayed` | `Accepted` |

`SandboxFulfillmentLoopResult` 是 transient loop carrier，不是 run lifecycle、runtime agent loop、tools semantic execution或
backend execution result。Worker只把完整 carrier交给下游 mapper；不直接写 ack/status，也不把 loop disposition 当作业务
run status。

### C-1B.4 Worker relay 1/1 loop-result mapping

Worker relay 是 `PublishSandboxEventRelay` 的长驻物理入口，与 Jobs runner 共用同一 application method，但入口 context 和
输出 carrier严格分离：

```text
frozen relay batch + trusted Worker runtime
  -> SandboxServiceCallContext::from_worker_job(PublishSandboxEventRelay, ...)
  -> publish_sandbox_event_relay
  -> ApplicationResult<SandboxPagedJobInvocationResult<PublishSandboxEventRelaySelection>>
  -> application result unwrap/checked relay outcome
  -> SandboxRelayLoopResult::finish(run_context, report_status, outcome, finished_at)
  -> Worker relay ack/telemetry policy
```

Worker relay 的 channel 固定为 `Worker`，即使 logical selector 名称属于 Jobs family，也不能使用 `SandboxJobRunContext`、
`from_job`、jobs crate 或 process exit mapping。`SandboxRelayLoopResult` 的 stored kind固定为 `JobReport`；这是 application-owned
stored public surface，不是 jobs crate 的 report object。`report_status` 必须由 application relay facade/report finalizer明确提供，
不得由 Worker 从 publish counter、publisher private response、repository scan或latest relay record推导。

| relay path | application result source | Worker output | duplicate/no-write rule | prohibited recomposition |
|---|---|---|---|---|
| fresh `FreshBatch` | application返回完整 batch/linear permit及最终可重放 JobReport relation；Worker只消费本批 frozen result | `SandboxRelayLoopResult` with `Succeeded/PartialFailed/Degraded/Skipped` relation | duplicate不产生 fresh batch；由 application返回 `DuplicateReplayed` stored outcome后直接形成 replay loop result | 不从 batch count、last cursor或publisher response拼 report |
| duplicate `DuplicateReplayed` | exact stored JobReport outcome，status=`DuplicateReplayed`且通过 `validate_for_job(PublishSandboxEventRelay)` | `SandboxRelayLoopResult`，report status=`DuplicateReplayed`，entry disposition=`Accepted` | 不 selection、不 external publish、不创建新 permit/attempt | 不读取 current relay truth重建 stored report |
| application error | typed `ApplicationError` | `WorkerError::Application`或后续 C-2 exact mapping | 不把 error转换为 relay report status | raw provider/publisher cause不穿透 |
| no-write | `SandboxServiceOutcome::NoWrite`或缺少 required JobReport surface | construction error `NoWriteOutcomeForbidden` / stored-result error | 不形成 relay success、Skipped或empty report | 不把“没有待发事件”误写为 NoWrite；无 eligible item必须由 application形成合法 `NoChange`/`Skipped` report surface |

relay report status与 outcome status的 7/7 关系固定为：

| outcome status | allowed relay report status | relay disposition |
|---|---|---|
| `Accepted` | `Succeeded` | `Accepted` |
| `Rejected` | none | construction error；selection/input拒绝在 application/WorkerError边界结束 |
| `Degraded` | `PartialFailed`或`Degraded` | `Accepted` |
| `NoChange` | `Skipped` | `Skipped` |
| `NoWrite` | none | construction error |
| `Failed` | `Failed` | `Failed` |
| `DuplicateReplayed` | `DuplicateReplayed` | `Accepted` |

Worker relay `Succeeded`只表示 application-owned relay/report relation已完成；不表示 publisher全部成功、source truth已回滚或
下游消费者已处理。publish failure不回滚 source truth；relay attempt、retry、dead-letter和 ack 由 application/Step 9/12 owner
处理。Worker不得把 `report_status` 写入 Jobs process exit或伪装为 Job channel。

### C-1B.5 Worker C-1B gate

| gate | result |
|---|---|
| Consumer 9/9 receipt output mapping | pass for design；7/7 receipt status relation明确 |
| Fulfillment 4/4 loop result mapping | pass for design；7/7 outcome relation明确 |
| Worker relay 1/1 loop result mapping | pass for design；7/7 report relation明确，channel固定 `Worker` |
| fresh / duplicate / no-write separation | pass for design；Worker error variant exact mapping deferred to C-2 |
| Worker direct repository/domain/UoW/jobs access | 0 by contract；未执行代码验证 |
| formal `03` writeback | not started；仍冻结 |

本小批只完成 C-1B 静态设计。下一小批为 `7R-06C-1C` Jobs paged/exit/reconciliation output mapping；不得跨到 C-2、Step 8 或正式
文档回填。

## EOF Current Recovery Override: `7R-06C-1B` relay contract blocker registered

本节是本文件物理 EOF 的唯一 current authority，覆盖前文 C-1B 中将 Worker relay 标记为 `pass for design` 的结论。该结论
在本次静态 owner/type audit 中被撤回为 `historical_material_invalidated_by_7r_06c_1b_audit`；Consumer 与 Fulfillment
的正向映射仍然有效，Jobs、C-2、Step 8 和正式 `03-详细设计.md` 继续冻结。

### C-1B audit correction

| area | current result | audit basis |
|---|---|---|
| Worker Consumer 9/9 | pass for design | `SandboxConsumerServiceResult` 可由 Worker 转为 `SandboxConsumerReceipt`；source event、selector、trace、receipt status 与完整 `SandboxServiceOutcome` 均有唯一来源。 |
| Worker Fulfillment 4/4 | pass for design | 四个 command 均直接消费 `SandboxServiceOutcome`，由 `SandboxFulfillmentLoopResult::finish` 做 worker kind、stored kind、status relation 和时间校验。 |
| Worker relay duplicate path | conditionally structurally closed | `DuplicateReplayed` 已携带完整 `SandboxServiceOutcome`，可直接校验 `JobReport` surface；该结论不覆盖 fresh page path。 |
| Worker relay fresh path | blocked | `FreshBatch` 只返回 `SandboxJobInvocationPermit<S>` 与 `SandboxMaintenanceBatchOutcome`，没有 `SandboxServiceOutcome`、最终 `SandboxJobReportStatus` 或 finalization time。 |
| C-1B overall | blocked | relay fresh path不能合法构造 `SandboxRelayLoopResult`，因此不能关闭本小批或进入 C-1C。 |

### Fresh relay 的 owner/type 缺口

current contract 的类型链是：

```text
publish_sandbox_event_relay(...)
  -> ApplicationResult<SandboxPagedJobInvocationResult<PublishSandboxEventRelaySelection>>
  -> FreshBatch { permit, batch }
  -> ? complete batch accumulator / finalizer handoff
  -> SandboxRelayLoopResult::finish(run_context, report_status, outcome, finished_at)
```

该链不能在 entry adapter 中通过推断补齐：

1. `SandboxPagedJobInvocationResult::FreshBatch` 的唯一 application payload 是 `permit + batch`。`batch` 是一页的
   `SandboxMaintenanceBatchOutcome`，不是最终 `SandboxServiceOutcome`。
2. `SandboxRelayLoopResult::finish` 要求完整 `SandboxServiceOutcome`、`SandboxJobReportStatus` 和完成时间；Worker
   不得从 batch count、last cursor、publisher response、relay repository scan 或 latest relay record 推导这些字段。
3. current `finalize_job_report(FinalizeSandboxJobReportInput)` 要求已耗尽的
   `SandboxFinalizableJobPermit` 与完整 `Vec<SandboxMaintenanceBatchOutcome>`，并由 application owner 机械派生 report
   status 与最终 outcome。当前 FreshBatch 没有把这两个输入组成合法 finalizer input 的承接契约。
4. `SandboxJobReportAccumulator` 是 Jobs-local assembly helper。将其复制到 Worker、让 Worker直接依赖 Jobs crate、或让
   Worker自行生成 `SandboxServiceOutcome` 都会违反既有模块边界并引入第二个 report truth owner。

因此，前文“application 返回完整 batch/linear permit 及最终可重放 JobReport relation”的表述不能作为 current positive
contract；它没有对应的字段或 callable，现标记为历史草稿。当前不得采取以下伪修复：

| forbidden pseudo-fix | reason |
|---|---|
| 从 `FreshBatch` 直接调用 `SandboxRelayLoopResult::finish` | 缺少最终 outcome 与 report status，类型关系不成立。 |
| Worker 以 counter、cursor、publisher private response 或 current truth 拼装 report | 违反 application-owned report/source-of-truth 约束，且 duplicate/replay 不可证明。 |
| 在 Worker 新增 accumulator、finalizer 或 Worker-specific public report | 改变既有 Jobs/application owner，产生第二套 report contract。 |
| 每页调用一次 `finalize_job_report` 或把未耗尽 permit 当 terminal | 违反完整 page chain、linear permit 和 idempotency completion 规则。 |
| 让 Worker 使用 `SandboxJobRunContext`、Jobs crate 或 process exit carrier | 混淆 Worker relay 与 Jobs entry channel。 |

### Blocker registration and unblock condition

| blocker | owner | affected path | unblock condition |
|---|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-RELAY-001` | Step 7 application service facade + Worker/Jobs boundary owner | `PublishSandboxEventRelay` fresh paged path 到 `SandboxRelayLoopResult` 的 finalization handoff | 明确一个唯一、typed、可落码的 application-owned handoff：它必须承接完整 batch chain、exhausted permit、finalizer 调用和最终 outcome/report status；随后重新审计 Worker channel、duplicate/no-write 与 direct-access redline。 |

该 blocker 是 L4-sandbox 内部设计 blocker，不是新增 L1/L2 上游 blocker。解除前不得修改正式 `03`、新增实现类型、进入
`7R-06C-1C` 或把 Jobs finalization 责任转移给 Worker。若 owner 决定改变现有 facade/result contract，必须先在 Step 7
service facade 与对应 Jobs/Worker 中间产物中形成新的 current contract，再回到本文件复审；本文件不擅自选择替代方案。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v4.8-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1B Worker consumer/fulfillment/relay output mapping blocked_on_relay_contract
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = blocked_wait_user_review
batch_status = blocked
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A
next_internal_batch = 7R-06C-1B relay contract resolution
next_allowed_action = wait_user_review_before_relay_contract_resolution
tracked_tasks = 108_unique
task_status = 39_completed,0_in_progress,65_pending,2_blocked
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 5/7_open_with_owner
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001|SBX-DDD-GRANULARITY-STEP7-RELAY-001
logical_callable_join = Command 10/10|Query 13/13|Consumer 9/9|Job 10/10|total 42/42
physical_entry_slot_model = API 23|Worker fulfillment 4 overlap|Worker consumer 9|Worker relay 1 overlap|Jobs 10; planned slots 47
query_idempotency = 0/13
fresh_non_query_idempotency = 29/29
worker_relay_channel = Worker
jobs_reconciliation_result = SandboxReconciliationMaterializationWriteOutcome; not generic paged/finalizer
finalize_job_report_callable_count = 0 additional; not the 43rd callable
step_7_total_gate = blocked_by_internal_relay_contract
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

本次审计只记录设计 blocker，不代表实现、编译、测试、run、evidence 或验收事实；完成后停在用户复核门。

---

## EOF Current Recovery Override: `7R-06C-1B-R` relay contract resolved, C-1B completed

本节是本文件物理 EOF 的唯一 current authority。它消费以下两个已激活 owner contract：

- Step 6 entry-object EOF：`SandboxRelayLoopInvocation` 的字段、可信来源、trigger boundary 与 relay status correction。
- Step 7 service facade EOF：relay-only `Worker | Job` channel allow-set、完整分页循环、finalizer handoff与 failure boundary。

前文 `7R-06C-1B` blocker section保留为缺口发现记录；其中“fresh path blocked”和旧
`Accepted -> Succeeded / NoChange -> Skipped only` 关系均已失效。Consumer 9/9、Fulfillment 4/4 结论保持不变。

### C-1B-R.1 Worker relay input authority and first-page mapping

Worker relay 不再接收未定义的“frozen relay batch”。一次可调用的 entry input必须先形成唯一 Worker-local checked carrier：

```rust
SandboxRelayLoopInvocation::try_new(
    run_context,
    context_ref,
    job_run_id,
    page_limit,
    request_digest,
    idempotency_key,
)
```

| entry input / derived field | exact owner source | facade mapping | rejection / forbidden substitute |
|---|---|---|---|
| `run_context` | trusted Worker runtime assembly | 保留用于 call context、cutoff与最终 loop result | wrong kind拒绝；不从binary/payload构造 |
| `context_ref` | runtime已验证的显式 context-scoped trigger | `PublishSandboxEventRelaySelection.context_ref` | 缺失时不调用；禁止global/latest/first relay row |
| `job_run_id` | runtime invocation metadata | `SandboxJobPageInvocation::Start.job_run_id` | 禁止由key/time/relay ref/counter派生 |
| `started_at` | `run_context.started_at()` | Start `started_at` | 不读第二次clock |
| `selection_cutoff` | 同一个 `run_context.started_at()` | `PublishSandboxEventRelaySelection::try_new(context_ref, cutoff)` | 不用repository/publisher timestamp |
| `page_limit` | validated `eventRelay.publishBatchSize` snapshot | Start `page_limit`，permit全程不变 | invalid/越界拒绝，不clamp |
| `request_digest` | 同一 trigger canonical fingerprint | `from_worker_job` context | 不用Debug/JSON/topic重新计算 |
| `idempotency_key` | 同一 trigger checked retry metadata | `from_worker_job` context | 不用JobRunId/trace/retry count/random key |
| initial cursor | application fixed rule | Start repository cursor=`None` | caller/page token/stored cursor不得进入 |

没有显式 `context_ref` 的 Worker tick只允许返回 entry-local no-invocation/idle处置；它不得调用 repository发现一个 context，
也不得创建空 selection。跨 context 的周期性兜底由 one-shot `PublishSandboxEventRelay` Job 的正式调度/输入边界承接，
Worker trigger不成为第二个 scope expansion owner。

### C-1B-R.2 Exact fresh-path entry algorithm

```text
SandboxRelayLoopInvocation
  -> call_context(): Worker channel + PublishSandboxEventRelay operation
  -> selection(): explicit context + same started_at cutoff
  -> PublishSandboxEventRelayJobInput(Start)
  -> publish_sandbox_event_relay(ctx.clone(), input)
  -> FreshBatch { permit, batch }
  -> preserve whole batch in invocation-local Vec
  -> if nonterminal: Continue(move permit), same ctx, repeat
  -> if exhausted:
       SandboxFinalizableJobPermit::try_publish_sandbox_event_relay(move permit)
       FinalizeSandboxJobReportInput::try_new(finalizable, full batches)
       copy constructor-derived report_status
       finalize_job_report(move finalizer_input)
       receive complete SandboxServiceOutcome
       read Worker completion clock once
       SandboxRelayLoopResult::finish(run_context, report_status, outcome, finished_at)
```

Rust-facing entry伪代码固定为：

```rust
let call_context = invocation.call_context()?;
let selection = invocation.selection()?;
let run_context = invocation.run_context().clone();
let mut batches = Vec::<SandboxMaintenanceBatchOutcome>::new();
let mut page = SandboxJobPageInvocation::Start {
    job_run_id: invocation.job_run_id().clone(),
    started_at: run_context.started_at().clone(),
    selection,
    page_limit: invocation.page_limit(),
};

loop {
    let input = PublishSandboxEventRelayJobInput::try_new(page)?;
    match service
        .publish_sandbox_event_relay(call_context.clone(), input)
        .await?
    {
        SandboxPagedJobInvocationResult::DuplicateReplayed { outcome } => {
            require(batches.is_empty())?;
            return SandboxRelayLoopResult::finish(
                run_context,
                SandboxJobReportStatus::DuplicateReplayed,
                outcome,
                clock.now()?,
            );
        }
        SandboxPagedJobInvocationResult::FreshBatch { permit, batch } => {
            batches.push(batch);
            if permit.is_exhausted() {
                let permit =
                    SandboxFinalizableJobPermit::try_publish_sandbox_event_relay(permit)?;
                let input = FinalizeSandboxJobReportInput::try_new(permit, batches)?;
                let report_status = input.report_status();
                let outcome = service.finalize_job_report(input).await?;
                return SandboxRelayLoopResult::finish(
                    run_context,
                    report_status,
                    outcome,
                    clock.now()?,
                );
            }

            require(permit.call_context() == &call_context)?;
            page = SandboxJobPageInvocation::Continue(permit);
        }
    }
}
```

`require`表示既有 typed application/Worker relation error，不表示 `assert!`、panic或字符串错误。entry每页都传同一个
immutable cloned call context；application permit同时保存受检副本。只有 exact field equality 才允许 Continue，不能只比较
operation/digest/key而忽略 channel、actor或trace。

### C-1B-R.3 Batch preservation and finalization ownership

| concern | Worker entry responsibility | application responsibility | forbidden |
|---|---|---|---|
| batch storage | 在一个 async invocation 栈内按返回顺序整体move保存 | 构造并验证每个完整batch | flatten items、只留count/last cursor |
| continuation | 只move nonterminal permit到一次Continue | permit保存selector、cursor、limit、context、page count | clone/serialize/rebuild/parallel branch |
| exhaustion | 只读取 `permit.is_exhausted()` 决定进入constructor | reader与permit/batch relation证明terminal | empty vector或count猜terminal |
| finalizable union | 调 relay exact constructor | 重验relay variant、channel、operation和reservation | generic permit/string kind |
| report status | 只复制 `FinalizeSandboxJobReportInput.report_status()` | 从完整items机械派生 | Worker counter/publisher/current truth推导 |
| final outcome | 只消费 `finalize_job_report` 返回值 | 保存完整JobReport/stored/idempotency relation | Worker构造stored result或第二report |
| Worker finished time | finalizer返回后读取一次，用于loop carrier | report `finished_at/recorded_at`在application UoW中拥有 | 覆盖stored report time |

Worker invocation-local `Vec<SandboxMaintenanceBatchOutcome>` 不是 `SandboxJobReportAccumulator` 的复制品：它没有job/report
字段、status/count helper、persistence或public surface；唯一允许的消费点是
`FinalizeSandboxJobReportInput::try_new(finalizable, batches)`。因此 Worker仍不依赖 Jobs crate，application仍是唯一 report
truth owner。

### C-1B-R.4 Fresh, duplicate, no-write and error mapping

| path | required application result | Worker result | direct-access / recomposition budget |
|---|---|---|---:|
| fresh succeeded | finalizer status=`Succeeded`，outcome=`NoChange`，stored=`Completed` | `SandboxRelayLoopResult(Succeeded)`，disposition=`Accepted` | repository/publisher/jobs/count read=`0` |
| fresh skipped | finalizer status=`Skipped`，outcome=`NoChange`，stored=`Completed` | `SandboxRelayLoopResult(Skipped)`，disposition=`Skipped` | same `0` |
| fresh partial/degraded | status=`PartialFailed | Degraded`，outcome=`Degraded`，stored=`Completed` | matching loop result，disposition=`Accepted` | reasons只来自完整surface |
| fresh failed | status=`Failed`，outcome=`Failed`，stored=`Failed` | matching loop result，disposition=`Failed` | 不把failed当absent或重跑 |
| Start duplicate | outcome=`DuplicateReplayed`且exact JobReport validator通过 | report overlay=`DuplicateReplayed`，disposition=`Accepted` | selection/page/publisher/finalizer/write=`0` |
| duplicate after fresh batch | invalid invariant | typed error；不形成loop result | 不丢弃partial batches伪装duplicate |
| no-write / accepted / rejected final outcome | maintenance relation不合法 | relation-specific `WorkerError` | 不改写为Succeeded/Skipped |
| page/finalizer error | typed `ApplicationError` | `WorkerError::Application`，C-2再做17/12 exhaustive action map | 不从partial batches生成report |

current relay status relation不再使用旧表：

| outcome status | allowed relay report status | entry disposition |
|---|---|---|
| `NoChange` | `Succeeded` | `Accepted` |
| `NoChange` | `Skipped` | `Skipped` |
| `Degraded` | `PartialFailed | Degraded` | `Accepted` |
| `Failed` | `Failed` | `Failed` |
| `DuplicateReplayed` | `DuplicateReplayed` | `Accepted` |
| `Accepted | Rejected | NoWrite` | none | construction / relation error |

`NoChange`只说明 finalizer当前 UoW 没有再次提交业务truth，不能单独决定 report status；因此 Worker必须保存 application
constructor给出的 status字段，不能从 outcome status压缩推导。

### C-1B-R.5 Crash, ownership loss and security redlines

1. process crash、task cancellation或permit loss后，本 invocation不具备 resume authority；Worker不得按 `JobRunId`、last token、
   batch count或current index重建permit。
2. 已提交 relay attempt/item truth不因 entry/finalizer失败回滚；recovery只围绕原 operation/digest/key、reserved/completed
   relation与 exact same attempt执行 inspection/hold/classification。
3. finalizer commit unknown时，Worker不读取 stored surface或 current truth判断成功；只接受 application recovery owner返回的
   fully committed outcome。indeterminate保持fail closed。
4. Worker不直接访问 relay repository、selection reader、publisher、UoW、id generator或clock以外的业务port；clock只用于
   trusted run start与entry completion time。
5. Worker不执行 tools semantic execution、runtime agent loop或 member lifecycle orchestration；relay success也不表示下游
   consumer已经处理事件。
6. audit、diagnostic、telemetry和异常只保留body-free kind/reason/trace与低基数hook；不建立第二套report、evidence或审计主体。

### C-1B-R.6 Blocker resolution and C-1B gate

| blocker condition | resolution evidence | result |
|---|---|---|
| trusted first-page fields missing | `SandboxRelayLoopInvocation` 6字段 + derived cutoff/context/cursor join | resolved |
| Worker fresh batch chain missing | invocation-local complete batch vector + linear permit loop | resolved |
| exhausted permit to finalizer missing | relay finalizable constructor + `FinalizeSandboxJobReportInput::try_new` | resolved |
| final outcome/status missing | constructor getter + application `finalize_job_report` | resolved |
| Worker/Job channel conflict | relay-only `Worker | Job` allow-set，same invocation channel preserved | resolved |
| duplicate/no-write relation incomplete | exact duplicate branch + corrected status matrix | resolved |
| Worker direct Jobs/repository/publisher dependency risk | explicit deny-set and dependency count `0` | resolved |

`SBX-DDD-GRANULARITY-STEP7-RELAY-001` 现标记为 `resolved_internal_design_blocker`。没有新增 L1/L2 blocker。
其它 Step 7 owner blocker保持开放：

```text
SBX-DDD-GRANULARITY-STEP7-DISPATCH-001
SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
SBX-DDD-GRANULARITY-STEP7-READ-001
SBX-DDD-GRANULARITY-STEP7-ENTRY-001
```

| C-1B area | final result |
|---|---|
| Consumer 9/9 | pass_for_design |
| Fulfillment 4/4 | pass_for_design |
| Relay duplicate | pass_for_design |
| Relay fresh | pass_for_design after typed handoff repair |
| Worker direct repository/domain/UoW/jobs/publisher access | `0` by contract |
| C-1B overall | `completed_wait_user_review` |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v4.9-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1B Worker consumer/fulfillment/relay output mapping completed_wait_user_review
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = user_review_pending
batch_status = completed_wait_user_review
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A,7R-06C-1B,7R-06C-1B-R
next_internal_batch = 7R-06C-1C Jobs paged/exit/reconciliation output mapping
next_allowed_action = wait_user_review_before_jobs_mapping
tracked_tasks = 108_unique
task_status = 40_completed,0_in_progress,65_pending,1_blocked
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/7_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
logical_callable_join = Command 10/10|Query 13/13|Consumer 9/9|Job 10/10|total 42/42
physical_entry_slot_model = API 23|Worker fulfillment 4 overlap|Worker consumer 9|Worker relay 1 overlap|Jobs 10; planned slots 47
query_idempotency = 0/13
fresh_non_query_idempotency = 29/29
worker_relay_channel = Worker
relay_application_allow_set = Worker|Job
jobs_reconciliation_result = SandboxReconciliationMaterializationWriteOutcome; not generic paged/finalizer
finalize_job_report_callable_count = 0 additional; not the 43rd callable
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

本批已停在 C-1B 用户复核门。未经新的连续确认不得进入 `7R-06C-1C`、C-2、Step 8、正式 `03` 或 implementation。

---

## EOF Current Recovery Override: `7R-06C-1C` blocked by Jobs unique batch ownership gap

用户已确认 C-1B；本节进入 C-1C 并取代上一恢复点，成为本文件物理 EOF 的唯一 current authority。九个 paged Job 的
pre-terminal page、Start duplicate 与 reconciliation atomic outcome 已完成静态映射；但 paged fresh terminal path 暴露了
确定的 Rust ownership 缺口，不能把 C-1C 标记完成，也不能进入 C-2。正式 `03-详细设计.md` 继续冻结。

### C-1C.1 Step input、SOP answer 与 historical conflict

| required question | current answer |
|---|---|
| Jobs entry 的业务结果唯一来源是什么 | 九个 paged Job 只消费 `SandboxPagedJobInvocationResult<S>` 与 application finalizer；reconciliation 只消费 `SandboxReconciliationMaterializationWriteOutcome`。 |
| 哪一层拥有完整 page/item chain | application构造每个batch；Jobs-local accumulator在一次进程调用内唯一保存同一完整chain；public/stored report由application finalizer拥有。 |
| duplicate 是否经过 selection/finalizer | 否。paged Start duplicate直接返回完整stored `JobReport` outcome；reconciliation duplicate直接返回原typed stored envelope。 |
| process exit 是否等于 report status | 否。`SandboxJobExitDisposition`只形成typed `EntryDisposition`；`i32` exit code仍后移Step 9/12。 |
| reconciliation 是否可复用 generic accumulator | 否。它是whole-group atomic writer，不分页、不创建permit、不进入generic finalizer。 |
| 当前是否能1:1写出九个 fresh terminal runner | 否。唯一batch chain无法同时按值移入application finalizer并继续留在Jobs exit accumulator。 |

以下历史材料不得作为 C-1C current input：

| historical material | current ruling |
|---|---|
| `SandboxJobRunContext.initial_page_token` 与 accumulator同名字段 | 已由Step 6 current overlay删除；Start cursor固定`None`，Continue只move permit。 |
| capability refresh 使用 `External(IsolationBackend)`或`Truth(BackendCapabilitySummary)`作为target | 已失效；current exact target是 `BackendCapability { backend_ref, requirement_ref }`。 |
| 十个Job都进入generic accumulator/finalizer/exit | 已失效；reconciliation只走专用atomic outcome。 |
| Step 8扁平 `succeeded_refs/failed_refs/next_cursor` report | historical revalidation pending；current report必须保留逐batch、逐item、双token、result refs、reasons与trace。 |
| Jobs process code反推业务status | 禁止；process code不进入stored/public report，也不作为domain/job lifecycle。 |

### C-1C.2 Nine paged Jobs：已闭合部分与 terminal gate

九个runner共用同一线性算法，但每个runner仍编译期固定kind、独立input、selection type与finalizable constructor：

| # | fixed Job | finalizable constructor | current exact target | pre-terminal / duplicate | fresh terminal |
|---:|---|---|---|---|---|
| 1 | `PublishSandboxEventRelay` | `try_publish_sandbox_event_relay` | `EventRelay(ref)` | pass_for_design | blocked_on_unique_batch_ownership |
| 2 | `RefreshSandboxReferenceStates` | `try_refresh_sandbox_reference_states` | `Truth(ReferenceResolutionState)` | pass_for_design | blocked_on_unique_batch_ownership |
| 3 | `RefreshBackendCapabilitySummaries` | `try_refresh_backend_capability_summaries` | `BackendCapability { backend_ref, requirement_ref }` | pass_for_design | blocked_on_unique_batch_ownership |
| 4 | `RetryPendingMaterialHandoffs` | `try_retry_pending_material_handoffs` | `Truth(HandoffFact)`；group keys由同一item承接 | pass_for_design | blocked_on_unique_batch_ownership |
| 5 | `RunLeaseOrphanReaper` | `try_run_lease_orphan_reaper` | `Truth(LeaseRecord)` | pass_for_design | blocked_on_unique_batch_ownership |
| 6 | `EvaluatePendingCleanupGuards` | `try_evaluate_pending_cleanup_guards` | `Truth(CleanupGuard)` | pass_for_design | blocked_on_unique_batch_ownership |
| 7 | `MaintainRedlineContainmentHandoffs` | `try_maintain_redline_containment_handoffs` | `Truth(RedlineContainment)` | pass_for_design | blocked_on_unique_batch_ownership |
| 8 | `RebuildSandboxReadProjections` | `try_rebuild_sandbox_read_projections` | `Projection(ref)` | pass_for_design | blocked_on_unique_batch_ownership |
| 9 | `MaintainDerivedInspectPreviewTrend` | `try_maintain_derived_inspect_preview_trend` | `Derived(ref)` | pass_for_design | blocked_on_unique_batch_ownership |

Start与page loop的可落码前半段固定为：

```text
validated job input + fixed runner kind
  -> SandboxJobRunContext::try_new(without initial_page_token)
  -> call_context(): Job channel + fixed operation
  -> start_accumulator(): empty, expected first token=None
  -> JobInput::try_new(Start { job_run_id, started_at, exact selection, page_limit })
  -> exact facade method
  -> validate_for_job(fixed kind)
     DuplicateReplayed { outcome }
       -> require accumulator has no fresh batch
       -> clock.now once for entry completion
       -> SandboxJobExitDisposition::duplicate_replayed
     FreshBatch { permit, batch }
       -> accumulator.record_batch(batch) as a whole
       -> nonterminal: Continue(move permit), same call context
       -> terminal: exact SandboxFinalizableJobPermit::try_* (move permit)
```

该前半段已经闭合以下关系：

1. Start只出现一次，first repository cursor固定`None`；不存在caller resume token。
2. `record_batch`保留完整batch，不flatten items，不维护第二count或last-cursor truth。
3. nonterminal permit只进入一次Continue；不能clone、serialize、parallel branch或按`JobRunId`重建。
4. Start duplicate只在fresh batch为零时成立；selection/read/external/finalizer/write预算均为`0`。
5. duplicate outcome必须为`DuplicateReplayed`、stored kind=`JobReport`且通过fixed job validator；missing/wrong-kind不能重跑。
6. page/finalizer error不从partial accumulator生成report；C-2再做17/16 exact error-disposition exhaustive mapping。

### C-1C.3 Reconciliation atomic outcome mapping

`RunSandboxReconciliation` 不受 paged batch ownership blocker影响。它直接匹配canonical outcome的两个variant：

| outcome | required validation | report mapping source | entry disposition | forbidden |
|---|---|---|---|---|
| `Committed { binding, stored_job_report }` | fixed kind=`RunSandboxReconciliation`；binding/report/scope digest匹配；original status仅`Succeeded | Degraded | Failed`；完整finding/audit/optional relay/time relation有效 | 原样消费binding与完整stored envelope；`Clean | IssuesFound -> Succeeded`，`Degraded -> Degraded`，`Failed -> Failed` | `Succeeded | Degraded -> Accepted`；`Failed -> Failed` | generic item、empty batch、generic finalizer、从current binding重组report |
| `DuplicateReplayed { stored_job_report }` | exact original operation/fingerprint/stored kind/report bundle；不得要求原report仍为current | 保留original run/status/times/finding stream/audit/relay；本次public status只overlay `DuplicateReplayed` | `Accepted` | 返回current binding、覆盖original status、重读source或生成新identity |

reconciliation runner可以直接把canonical outcome交给Step 8 typed report mapper并穷尽派生`EntryDisposition`；它不需要也不得
创建 `SandboxReconciliationJobInvocationResult`、`SandboxJobReportAccumulator`、`SandboxJobExitDisposition`同义包装或
第11个application callable。public DTO字段仍由Step 8回归重建，本批只固定其唯一source requirement。

### C-1C.4 Exact Rust ownership blocker

current三个owner signature形成以下不可同时满足的关系：

```rust
// Jobs-local unique owner
pub struct SandboxJobReportAccumulator {
    batches: Vec<SandboxMaintenanceBatchOutcome>,
    // ... run/job/continuation state
}

// Application finalizer takes the same chain by value
pub fn FinalizeSandboxJobReportInput::try_new(
    permit: SandboxFinalizableJobPermit,
    batches: Vec<SandboxMaintenanceBatchOutcome>,
) -> ApplicationResult<FinalizeSandboxJobReportInput>;

// Jobs exit still requires the whole accumulator by value
pub fn SandboxJobExitDisposition::finish_fresh(
    accumulator: SandboxJobReportAccumulator,
    final_outcome: SandboxServiceOutcome,
    report_status: SandboxJobReportStatus,
    finished_at: Timestamp,
) -> Result<SandboxJobExitDisposition, JobsError>;
```

`SandboxJobReportAccumulator`只有`batches(&self) -> &[...]`，没有能在finalizer后返还同一chain的typed handoff。因而terminal
runner不存在合法的owned-move序列：

```text
accumulator owns Vec<Batch>
  -> finalizer needs Vec<Batch> by value
  -> moving Vec out makes accumulator partial/moved and unavailable to finish_fresh
  -> keeping accumulator requires cloning Vec<Batch>
  -> cloning creates prohibited second complete batch/item chain
```

同一位置还有一个authority冲突：Jobs accumulator的historical `fresh_report_status()`和application
`FinalizeSandboxJobReportInput::try_new`都遍历完整items派生status。C-1B-R已经确认application constructor是唯一
authoritative status derivation owner；Jobs不得先派生一个status再把它当caller truth传给finalizer或用来修正finalizer结果。

以下伪修复全部禁止：

| forbidden pseudo-fix | reason |
|---|---|
| `accumulator.batches().to_vec()` | clone完整batch/item chain，产生第二report truth和双内存owner。 |
| `into_batches()`后重建accumulator | continuation、replay_only、exhausted、run relation需要caller重组；且finalizer不返还batches。 |
| finalizer前生成public DTO，finalizer后只留DTO | 在commit确认前形成可见success surface，并让protocol DTO替代application stored truth。 |
| 从`SandboxServiceOutcome.stored_result`读取report body重建accumulator | outcome只持body-free stored carrier；entry不得直接读result repository/current truth。 |
| 只把count/status放进exit disposition | 丢失逐batch/item/result/reason/trace；duplicate parity不可证明。 |
| 把reconciliation也塞入generic path | 破坏whole-group atomic writer和typed stored envelope。 |
| 用process exit code决定report status | 反转entry与业务真相源；process code尚未在本Step定义。 |

建议由 owner 在 `7R-06C-1C-R` 优先审议最小修复：让 move-only finalizer input拥有permit、只借用caller唯一batch slice，
application在borrow有效期内完成stored report UoW；返回后borrow结束，Jobs再把原accumulator move进exit disposition。该方向同时
适用于Worker本地`Vec`，不新增public callable/DTO，也不clone chain。它尚未被激活，必须先由Step 6 Jobs object与Step 7
facade owner写成current contract并回审Worker/Jobs两条路径。若borrow方案不可行，owner必须定义一个消费input后返还唯一chain
的typed finalized handoff；entry不能自行选择。

另需在同一修复中澄清：`SandboxJobExitDisposition.finished_at`若保留，应只表示entry completion time；public/stored report的
`finished_at/recorded_at`唯一来自application finalizer UoW，Step 8 mapper不得用Jobs post-finalizer clock覆盖它。

### C-1C.5 Blocker registration and gate

| blocker | owner | affected surface | unblock condition |
|---|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001` | Step 6 Jobs entry objects + Step 7 application finalizer / Jobs boundary | 九个paged Job fresh terminal path；完整batch chain到finalizer再到exit disposition | 定义唯一、无clone、可落码的batch ownership handoff；application保持唯一status/report owner；澄清entry/report completion time；随后回审9/9 fresh、9/9 duplicate和reconciliation 2/2。 |

该项是L4-sandbox内部设计blocker，不是新增L1/L2 blocker。当前审计结果：

| C-1C area | result |
|---|---|
| paged pre-terminal page/continuation | `9/9 pass_for_design` |
| paged Start duplicate | `9/9 pass_for_design` |
| paged fresh terminal | `0/9 blocked_on_unique_batch_ownership` |
| reconciliation atomic variants | `2/2 pass_for_design` |
| Jobs direct repository/domain/UoW/adapter access | `0` by contract |
| process exit-code policy | deferred；未定义、未伪造 |
| C-1C overall | `blocked_wait_user_review` |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v5.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1C Jobs paged/exit/reconciliation output mapping blocked_on_batch_ownership_contract
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = blocked_wait_user_review
batch_status = blocked
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A,7R-06C-1B,7R-06C-1B-R
next_internal_batch = 7R-06C-1C-R Jobs batch ownership contract resolution and re-audit
next_allowed_action = wait_user_review_before_jobs_batch_ownership_resolution
tracked_tasks = 108_unique
task_status = 40_completed,0_in_progress,64_pending,2_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
new_l1_l2_blocker = 0
new_internal_blocker = SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001
remaining_step_7_internal_blockers = 5/8_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001
paged_jobs_preterminal_mapping = 9/9_pass_for_design
paged_jobs_duplicate_mapping = 9/9_pass_for_design
paged_jobs_fresh_terminal_mapping = 0/9_blocked_on_unique_batch_ownership
reconciliation_atomic_mapping = 2/2_pass_for_design
step_7_total_gate = blocked_by_jobs_batch_ownership_contract
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

本批只完成静态设计审计并登记blocker；未执行实现、编译、测试、provider、runtime或验收，也未生成run、evidence、signoff
或commit事实。用户确认前不得进入`7R-06C-1C-R`、C-2、C-3、Step 8、正式`03`或implementation。

---

## EOF Current Recovery Override: `7R-06C-1C-R` ownership resolved, C-1C completed

用户已确认C-1C-R。本节消费Step 6 Jobs/Worker owner、Step 7 facade与typed-store三个物理EOF activation，取代上一
`v5.0-active` blocked状态，成为本文件物理EOF的唯一current authority。九个paged Job fresh terminal现已达到可落码粒度；
本节不进入C-2 error mapping，不修改正式`03-详细设计.md`。

### C-1C-R.1 输入、诊断与裁决

| SOP项目 | current结论 |
|---|---|
| 已读owner | Step 6 §§11.15~11.17及C-1C-R EOF；facade §§40.5~40.7及C-1C-R EOF；typed store §§20/28/39及C-1C-R EOF。 |
| 原问题 | accumulator唯一owned `Vec<Batch>`被finalizer与exit同时按值要求，且Jobs/application形成双status derivation。 |
| current修复 | finalizer按值消费exhausted permit，只借用caller batch slice；store逐项stage；commit后返回typed fresh witness；borrow结束后Jobs move原accumulator。 |
| authority修复 | Jobs删除`fresh_report_status()`；entry不再传自由status/outcome tuple；application constructor/finalizer是唯一fresh status/report owner。 |
| time修复 | application UoW唯一拥有report `finished_at/recorded_at`；Jobs/Worker clock只形成`entry_completed_at`。 |
| 未采用 | clone/to_vec、move后重建accumulator、counts-only exit、从stored/current truth回读重组、consume-and-return第二owned handoff。 |

application-only `SandboxFinalizedJobReport`不是public DTO或第43个callable result。其字段private，只有commit-confirmed
finalizer可构造；Jobs/Worker只能整体消费。borrowed finalization future绑定caller lifetime，不能spawn、detach或要求`'static`。

### C-1C-R.2 九个paged Job exact terminal algorithm

以下模板由九个runner逐文件实例化；`call_exact_job_method`和`try_exact_finalizable`在每个runner中必须是表C-1C-R.3的
编译期固定method/constructor，不能实现为kind/string/generic payload dispatch。

```rust
let run_context = SandboxJobRunContext::try_new(/* validated metadata, no page token */)?;
let call_context = run_context.call_context()?;
let mut accumulator = run_context.start_accumulator();
let mut page = SandboxJobPageInvocation::Start {
    job_run_id: run_context.job_run_id().clone(),
    started_at: run_context.started_at().clone(),
    selection: validated_exact_selection,
    page_limit: validated_page_limit,
};

loop {
    let input = ExactJobInput::try_new(page)?;
    let result = call_exact_job_method(&service, call_context.clone(), input).await?;
    result.validate_for_job(FIXED_JOB_KIND)?;

    match result {
        SandboxPagedJobInvocationResult::DuplicateReplayed { outcome } => {
            require(accumulator.batches().is_empty())?;
            let entry_completed_at = clock.now()?;
            return SandboxJobExitDisposition::duplicate_replayed(
                &run_context,
                outcome,
                entry_completed_at,
            );
        }
        SandboxPagedJobInvocationResult::FreshBatch { permit, batch } => {
            accumulator.record_batch(batch)?;

            if !permit.is_exhausted() {
                require(permit.call_context() == &call_context)?;
                page = SandboxJobPageInvocation::Continue(permit);
                continue;
            }

            require(accumulator.is_exhausted())?;
            let finalizable = try_exact_finalizable(permit)?;
            let input = FinalizeSandboxJobReportInput::try_new(
                finalizable,
                accumulator.batches(),
            )?;
            let completion = service.finalize_job_report(input).await?;
            // input/future已消费并结束，accumulator的immutable borrow在此释放。
            let entry_completed_at = clock.now()?;
            return SandboxJobExitDisposition::finish_fresh(
                accumulator,
                completion,
                entry_completed_at,
            );
        }
    }
}
```

`require`是现有typed relation error，不是panic。该作用域中每次one-shot runner只有一个accumulator、一个当前linear permit和一个
page future；没有集合、并发spawn或可选择的第二accumulator，因此传给finalizer的slice必然来自随后move进exit的同一对象。
Rust borrow checker保证`await`期间不能move/mutate accumulator，future结束后才能move；不需要session clone、unsafe或重新组装。

finalizer error时permit已消费，runner返回`JobsError::Application`，原accumulator随栈释放；前序page已提交truth不回滚，entry
不从partial batches生成report。commit unknown按原operation/digest/key及stored/idempotency inspection处理，不能重新使用permit。

### C-1C-R.3 9/9 exact constructor与terminal映射

| # | fixed Job / exact facade | exact finalizable constructor | current target relation | fresh terminal |
|---:|---|---|---|---|
| 1 | `PublishSandboxEventRelay` / `publish_sandbox_event_relay` | `try_publish_sandbox_event_relay` | `EventRelay(ref)` | `pass_for_design` |
| 2 | `RefreshSandboxReferenceStates` / `refresh_sandbox_reference_states` | `try_refresh_sandbox_reference_states` | `Truth(ReferenceResolutionState)` | `pass_for_design` |
| 3 | `RefreshBackendCapabilitySummaries` / `refresh_backend_capability_summaries` | `try_refresh_backend_capability_summaries` | `BackendCapability { backend_ref, requirement_ref }` | `pass_for_design` |
| 4 | `RetryPendingMaterialHandoffs` / `retry_pending_material_handoffs` | `try_retry_pending_material_handoffs` | `Truth(HandoffFact)`；group details保留在同一item | `pass_for_design` |
| 5 | `RunLeaseOrphanReaper` / `run_lease_orphan_reaper` | `try_run_lease_orphan_reaper` | `Truth(LeaseRecord)` | `pass_for_design` |
| 6 | `EvaluatePendingCleanupGuards` / `evaluate_pending_cleanup_guards` | `try_evaluate_pending_cleanup_guards` | `Truth(CleanupGuard)` | `pass_for_design` |
| 7 | `MaintainRedlineContainmentHandoffs` / `maintain_redline_containment_handoffs` | `try_maintain_redline_containment_handoffs` | `Truth(RedlineContainment)` | `pass_for_design` |
| 8 | `RebuildSandboxReadProjections` / `rebuild_sandbox_read_projections` | `try_rebuild_sandbox_read_projections` | `Projection(ref)` | `pass_for_design` |
| 9 | `MaintainDerivedInspectPreviewTrend` / `maintain_derived_inspect_preview_trend` | `try_maintain_derived_inspect_preview_trend` | `Derived(ref)` | `pass_for_design` |

每行terminal都固定完成：terminal permit exact constructor -> borrowed input constructor -> one application finalizer -> one typed
witness -> one `finish_fresh`。status/outcome矩阵为：`Succeeded | Skipped -> NoChange/Completed`、
`PartialFailed | Degraded -> Degraded/Completed`、`Failed -> Failed/Failed`。entry不能改写该矩阵，`DuplicateReplayed`不进入fresh
witness。九个Start duplicate继续保持selection/page/item/finalizer/write=`0`并走`duplicate_replayed`专用factory。

### C-1C-R.4 Worker relay回审

Worker没有Jobs accumulator，仍由invocation-local唯一`Vec<Batch>`承接同一borrowed contract：

```rust
let finalizable = SandboxFinalizableJobPermit::try_publish_sandbox_event_relay(permit)?;
let input = FinalizeSandboxJobReportInput::try_new(finalizable, batches.as_slice())?;
let completion = service.finalize_job_report(input).await?;
let entry_completed_at = clock.now()?;
return SandboxRelayLoopResult::finish_fresh(
    run_context,
    completion,
    entry_completed_at,
);
```

duplicate改为`SandboxRelayLoopResult::duplicate_replayed(run_context, outcome, entry_completed_at)`。旧
`input.report_status()`复制后调用自由`finish(...)`的伪代码失效。Worker future结束后drop唯一local vector；不依赖Jobs crate，
不读取repository/UoW/publisher，不从counter/cursor/current truth推导report。故既有`RELAY-001`保持resolved，没有回归。

### C-1C-R.5 Report、entry time与Step 8 source requirement

| field | fresh唯一来源 | duplicate唯一来源 | 禁止来源 |
|---|---|---|---|
| original report status | `SandboxFinalizedJobReport.report_status` | exact stored typed JobReport original status；本次overlay为`DuplicateReplayed` | accumulator/count/outcome反推 |
| report finished/recorded time | witness的application UoW `report_recorded_at` | exact stored carrier/surface persisted time | post-finalizer Jobs/Worker clock |
| batches/items | fresh原accumulator；与application borrowed write source是同一chain | exact committed typed surface | flat counts/current repositories |
| entry completion time | finalizer/duplicate validation后一次trusted clock read | 同左 | stored report time替代 |
| entry disposition | report status穷尽映射 | fixed duplicate mapping | process exit code |

`SandboxJobExitDisposition.entry_completed_at`只用于entry时序与后续Step 9/12 process policy输入，不进入public JobReport。
`report_recorded_at`必须满足`started_at <= report_recorded_at <= entry_completed_at`。process `i32` exit code仍未定义，不能从
report status或`EntryDisposition`自动转换；C-1C不伪造该政策。

### C-1C-R.6 Reconciliation与边界保持

`RunSandboxReconciliation`仍直接穷尽匹配
`SandboxReconciliationMaterializationWriteOutcome::{Committed, DuplicateReplayed}`，保持`2/2 pass_for_design`。它不构造
accumulator、paged permit、borrowed finalizer input、fresh witness或generic exit wrapper。该专用路径不因paged ownership修复而
新增clone、current-binding read或report重算。

本批只设计Sandbox运行隔离基础的entry/report handoff。没有引入tools semantic execution、runtime agent loop、member lifecycle
orchestration、artifact正文、provider body或observability ledger正文。error、审查、测试和交付只保留必要fail-closed门禁，不在
C-1C扩写；7/12/17 exhaustive error mapping仍属于下一独立批C-2。

### C-1C-R.7 Static closure audit与blocker裁决

| audit | expected | current result |
|---|---:|---:|
| paged Start/Continue | `9` | `9/9 pass_for_design` |
| paged Start duplicate | `9` | `9/9 pass_for_design` |
| paged fresh terminal | `9` | `9/9 pass_for_design` |
| reconciliation variants | `2` | `2/2 pass_for_design` |
| complete caller-owned batch chains per invocation | `1` | `1` |
| application/store second owned complete chain | `0` | `0` |
| complete-chain clone/rebuild | `0 / 0` | `0 / 0` |
| fresh status derivation owner | `1` | application constructor only |
| caller-supplied fresh status/outcome tuple | `0` | `0` |
| borrow escape/spawn/`'static` | `0 / 0 / 0` | `0 / 0 / 0` |
| Jobs direct repository/domain/UoW/adapter access | `0` | `0` |
| new public DTO/callable/job kind | `0 / 0 / 0` | `0 / 0 / 0` |
| new L1/L2 blocker | `0` | `0` |

`SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001`的owner、entry和typed-store解除条件全部满足，状态改为
`resolved_in_7r_06c_1c_r`。这只解除L4-sandbox内部ownership blocker；`DISPATCH-001`、`OUTCOME-001`、`READ-001`、
`ENTRY-001`继续开放，等待C-2/C-3及其既定owner closure。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v5.2-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1C Jobs paged/exit/reconciliation output mapping completed_wait_user_review
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = user_review_pending
batch_status = completed_wait_user_review
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A,7R-06C-1B,7R-06C-1B-R,7R-06C-1C,7R-06C-1C-R
next_internal_batch = 7R-06C-2 API/Worker/Jobs exhaustive error mapping
next_allowed_action = wait_user_review_before_7r_06c_2
tracked_tasks = 108_unique
task_status = 41_completed,0_in_progress,64_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/8_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
paged_jobs_preterminal_mapping = 9/9_pass_for_design
paged_jobs_duplicate_mapping = 9/9_pass_for_design
paged_jobs_fresh_terminal_mapping = 9/9_pass_for_design
reconciliation_atomic_mapping = 2/2_pass_for_design
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

本批完成并停在C-1C用户复核门。未经新的连续确认不得进入C-2、C-3、Step 8、正式`03`或implementation。

---

## Historical-Position Foundation: `7R-06C-2` application and API error mapping activated

> 本节记录C-2共同application投影和API 7/7 foundation。由于同批内容继续在物理EOF追加，本节不再单独充当current
> authority；恢复时以本文最后一个`EOF Current Recovery Amendment`为准。

### C-2.1 输入、SOP回答与粒度边界

| item | current answer |
|---|---|
| canonical owner | Step 6 §§9.5、11.6~11.7、11.12、11.18；C-1C-R EOF的Jobs 16项修正 |
| error responsibility | application保留exact detail/kind；entry只做caller-safe public kind、retry hint、safe reason、trace和一次性处置投影 |
| implementation owner | API disposition helper在`crates/api/src/routes.rs`；`ApiError`字段与四个基础accessor仍由`crates/api/src/errors.rs`拥有 |
| downstream consumer | Step 8 protocol mapper读取public kind/reason/trace；Step 9/12读取typed disposition与retry hint决定transport或调度策略 |
| forbidden inference | public kind、retryable bool、reason文本、HTTP code、ack policy、report status和process code均不能反推entry disposition |
| current scope | application 16-kind common projection + API 7/7；不重写application detail到kind owner表 |
| explicitly deferred | HTTP/RPC status、retry header、ack/nack、backoff、dead-letter、quarantine执行、process exit和telemetry payload |

本批不画ASCII图：错误投影是有限笛卡尔关系，逐variant表和compile-time exhaustive match比流程图更能暴露漏项。

### C-2.2 Historical material与冲突裁决

| historical material | current disposition | reason |
|---|---|---|
| C-1C及更早段落中的`7/12/17` | historical only；current=`7/12/16` | `AccumulatorReplayOnly`及replay-only accumulator已由C-1C-R删除 |
| `retryable=true -> Delayed`通用规则 | forbidden | disposition还受entry family和error语义约束；不能用一个bool替代16-kind match |
| `SandboxPublicErrorKind -> EntryDisposition`通用mapper | forbidden | public kind会有语义压缩，例如`PortUnavailable -> AdapterUnavailable`，不能反向恢复application kind |
| `ApiError::InvalidEntryMetadata`等旧variant | invalidated | current API闭集只有本节7项 |
| raw `Display`、stack、request body或adapter response作为reason | forbidden | reason只来自checked `SandboxReason`或variant固定ASCII template |
| error直接决定HTTP code、worker ack或job process exit | deferred | 分别属于Step 8、Step 9/12；C-2只提供typed输入 |

### C-2.3 Application 16-kind共同投影

`ApplicationError`进入任一entry时必须保留原对象；`to_public_error_kind()`、`is_retryable()`、`reason()`和
`trace_context()`直接委托application owner。三类entry只对`error.kind()`执行各自的显式16-arm处置映射：

| # | `ApplicationErrorKind` | public kind | retryable | API | Worker | Jobs |
|---:|---|---|---:|---|---|---|
| 1 | `Validation` | `Validation` | false | `Rejected` | `Rejected` | `Rejected` |
| 2 | `ReferenceUnresolved` | `ReferenceUnresolved` | true | `Delayed` | `Delayed` | `Delayed` |
| 3 | `ForbiddenExternalBody` | `ForbiddenExternalBody` | false | `Rejected` | `Rejected` | `Rejected` |
| 4 | `NotAuthorized` | `NotAuthorized` | false | `Rejected` | `Rejected` | `Rejected` |
| 5 | `NotVisible` | `NotVisible` | false | `Rejected` | `Rejected` | `Rejected` |
| 6 | `VersionConflict` | `VersionConflict` | true | `Delayed` | `Delayed` | `Delayed` |
| 7 | `IdempotencyConflict` | `IdempotencyConflict` | false | `Rejected` | `Rejected` | `Rejected` |
| 8 | `DuplicateMissingResult` | `DuplicateMissingResult` | false | `Failed` | `Failed` | `Failed` |
| 9 | `BoundaryRejected` | `BoundaryRejected` | false | `Rejected` | `Rejected` | `Rejected` |
| 10 | `PolicyFailClosed` | `PolicyFailClosed` | false | `Rejected` | `Rejected` | `Rejected` |
| 11 | `PortUnavailable` | `AdapterUnavailable` | true | `Delayed` | `Delayed` | `Delayed` |
| 12 | `UnsupportedVersion` | `UnsupportedVersion` | false | `Rejected` | `Rejected` | `Rejected` |
| 13 | `Quarantined` | `Quarantined` | false | `Rejected` | `Rejected` | `Rejected` |
| 14 | `Disabled` | `Disabled` | false | `Rejected` | `Rejected` | `Skipped` |
| 15 | `NoWriteViolation` | `NoWriteViolation` | false | `Failed` | `Failed` | `Failed` |
| 16 | `Internal` | `Internal` | false | `Failed` | `Failed` | `Failed` |

唯一entry-family差异是`Disabled`：API和Worker拒绝当前调用，Jobs在validated runtime guard下安全跳过。`Skipped`不是
application success、persisted job lifecycle或scheduler acknowledgement。三个retryable kind仍只表示“条件变化后可由外层策略
考虑再次调度”，当前entry不得循环重试、重建duplicate surface或重新读取truth。

### C-2.4 API 7/7 local mapping

| # | `ApiError` variant | public kind | retryable | safe reason / trace | entry disposition |
|---:|---|---|---:|---|---|
| 1 | `Application(error)` | delegate `error.to_public_error_kind()` | delegate | checked reason与可选trace均借自error | 按C-2.3 API列16/16 |
| 2 | `InvalidRequest` | `Validation` | false | constructor-checked reason；只继承已验证trace | `Rejected` |
| 3 | `UnsupportedVersion` | `UnsupportedVersion` | false | constructor-checked compatibility reason；只继承已验证trace | `Rejected` |
| 4 | `ForbiddenExternalBody` | `ForbiddenExternalBody` | false | body-exclusion reason；只继承已验证trace | `Rejected` |
| 5 | `CommandOutcomeMissingStoredResult` | `Internal` | false | fixed `command outcome missing stored result`；trace=None | `Failed` |
| 6 | `CommandStoredResultKindMismatch` | `Internal` | false | fixed `command stored result kind mismatch`；trace=None | `Failed` |
| 7 | `CommandStatusRelationMismatch` | `Internal` | false | fixed `command status relation mismatch`；trace=None | `Failed` |

API entry不新增public方法；`SandboxApiDisposition::entry_disposition()`的`Error`分支调用同模块私有helper。实现骨架固定为：

```rust
fn api_application_entry_disposition(kind: ApplicationErrorKind) -> EntryDisposition {
    match kind {
        ApplicationErrorKind::Validation
        | ApplicationErrorKind::ForbiddenExternalBody
        | ApplicationErrorKind::NotAuthorized
        | ApplicationErrorKind::NotVisible
        | ApplicationErrorKind::IdempotencyConflict
        | ApplicationErrorKind::BoundaryRejected
        | ApplicationErrorKind::PolicyFailClosed
        | ApplicationErrorKind::UnsupportedVersion
        | ApplicationErrorKind::Quarantined
        | ApplicationErrorKind::Disabled => EntryDisposition::Rejected,
        ApplicationErrorKind::ReferenceUnresolved
        | ApplicationErrorKind::VersionConflict
        | ApplicationErrorKind::PortUnavailable => EntryDisposition::Delayed,
        ApplicationErrorKind::DuplicateMissingResult
        | ApplicationErrorKind::NoWriteViolation
        | ApplicationErrorKind::Internal => EntryDisposition::Failed,
    }
}

fn api_error_entry_disposition(error: &ApiError) -> EntryDisposition {
    match error {
        ApiError::Application(error) => api_application_entry_disposition(error.kind()),
        ApiError::InvalidRequest { .. }
        | ApiError::UnsupportedVersion { .. }
        | ApiError::ForbiddenExternalBody { .. } => EntryDisposition::Rejected,
        ApiError::CommandOutcomeMissingStoredResult { .. }
        | ApiError::CommandStoredResultKindMismatch { .. }
        | ApiError::CommandStatusRelationMismatch { .. } => EntryDisposition::Failed,
    }
}
```

两个match均禁止`_` arm。`ApiError::Application`必须委托application四个accessor，不能在API重新定义public/retry/reason/trace；
三个relation defect虽携带finite enum用于诊断分支选择，但safe reason不得插值这些值或序列化outcome/DTO。

### C-2.5 API小循环审计与当前门禁

| audit | expected | current result |
|---|---:|---:|
| application kinds forward coverage | 16 | `16/16 exact_once` |
| application kinds reverse duplicate | 0 | `0` |
| API local variants forward coverage | 7 | `7/7 exact_once` |
| API local variants reverse duplicate | 0 | `0` |
| wildcard / raw-cause conversion | 0 / 0 | `0 / 0` |
| HTTP/RPC code or retry header defined | 0 | `0` |
| new error/public/retry type | 0 | `0` |
| new L1/L2 blocker | 0 | `0` |

```text
current_plan_version = v5.4-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-2 WorkerError 12/12 mapping in_progress
application_entry_mapping = API_16/16|Worker_16/16|Jobs_16/16
api_error_mapping = 7/7_exact_once
worker_error_mapping = pending
jobs_error_mapping = pending_current_16_owner_activation
gate_status = content_in_progress
next_allowed_action = write_c2_worker_error_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Recovery Amendment: `7R-06C-1C-R` complete report-source closure

> 本节取代上一`v5.2-active` C-1C-R结论并成为本文件物理EOF的唯一current authority。第一次ownership回审解决了
> `Vec` move冲突，但输出审计发现body-free duplicate outcome和被drop的Worker fresh vector不足以构造完整JobReport。本amendment
> 消费最新Step 6/facade/store owner EOF，补齐四类完整report source后重新审计；不进入C-2。

### C-1C-R.8 Current Jobs exact algorithm

```rust
let run_context = SandboxJobRunContext::try_new(/* validated metadata */)?;
let call_context = run_context.call_context()?;
let mut accumulator = run_context.start_accumulator();
let mut page = SandboxJobPageInvocation::Start {
    job_run_id: run_context.job_run_id().clone(),
    started_at: run_context.started_at().clone(),
    selection: validated_exact_selection,
    page_request: SandboxJobPageRequest::try_new(None, validated_page_limit)?,
};

loop {
    let result = call_exact_job_method(
        &service,
        call_context.clone(),
        ExactJobInput::try_new(page)?,
    ).await?;
    result.validate_for_job(FIXED_JOB_KIND)?;

    match result {
        SandboxPagedJobInvocationResult::DuplicateReplayed { replay } => {
            require(accumulator.batches().is_empty())?;
            return SandboxJobExitDisposition::duplicate_replayed(
                run_context,
                replay,
            );
        }
        SandboxPagedJobInvocationResult::FreshBatch { permit, batch } => {
            accumulator.record_batch(batch)?;
            if !permit.is_exhausted() {
                require(permit.call_context() == &call_context)?;
                page = SandboxJobPageInvocation::Continue(permit);
                continue;
            }

            let finalizable = try_exact_finalizable(permit)?;
            return finalize_paged_job_exit(
                &service,
                run_context,
                accumulator,
                finalizable,
            ).await;
        }
    }
}
```

九个runner必须分别绑定C-1C-R.3既有的exact facade与exact finalizable constructor；`call_exact_job_method`和
`try_exact_finalizable`只是模板元语法，不允许实现成runtime generic dispatch。`finalize_paged_job_exit`是Step 6 jobs-local私有
helper：它按值接收唯一accumulator，在内部借用batches完成await，再move同一accumulator与application finalized header。

duplicate由application在Start duplicate分支同snapshot加载generic carrier和完整Maintenance typed surface，返回
`SandboxReplayedMaintenanceJobReport`。Jobs不构造replay-only accumulator、不读clock、不读store、不从current truth重建。
current `SandboxJobExitDisposition`保留本次run context与`Fresh | DuplicateReplayed` report-source enum；Step 8 mapper在duplicate
时只用run context表达本次entry metadata，不得覆盖stored original run/trace/selection/status/time。

### C-1C-R.9 Worker relay exact algorithm

Worker fresh必须通过`event_relay_worker.rs`私有helper封装唯一local vector：

```rust
async fn finalize_relay_loop_result<'a>(
    service: &'a dyn SandboxJobService,
    run_context: SandboxWorkerRunContext,
    batches: Vec<SandboxMaintenanceBatchOutcome>,
    permit: SandboxFinalizableJobPermit,
) -> Result<SandboxRelayLoopResult, WorkerError> {
    let input = FinalizeSandboxJobReportInput::try_new(
        permit,
        batches.as_slice(),
    )?;
    let report = service.finalize_job_report(input).await?;
    SandboxRelayLoopResult::finish_fresh(run_context, batches, report)
}
```

loop terminal调用该helper；duplicate固定为：

```rust
SandboxPagedJobInvocationResult::DuplicateReplayed { replay } => {
    require(batches.is_empty())?;
    SandboxRelayLoopResult::duplicate_replayed(run_context, replay)
}
```

因此Worker fresh report source为唯一local vector + finalized header，duplicate source为完整owned typed surface + matching outcome。
两条路径post-result clock read均为`0`；旧`entry_completed_at`、自由status/outcome拼接和drop batches口径失效。Worker仍不依赖
Jobs crate、repository、UoW或publisher。

### C-1C-R.10 Four-branch complete source matrix

| branch | application/entry source | Step 8可见完整字段 | forbidden substitute |
|---|---|---|---|
| Jobs fresh 9/9 | `SandboxJobReportSource::Fresh { accumulator, finalized header }` | original run/trace/selection/initial request/batches/items/status/outcome/start/report time | current run clock、count-only、stored reread |
| Worker relay fresh | `SandboxRelayReportSource::Fresh { batches, finalized header }` | 同上；Worker run context只表达当前loop | drop vector、publisher/current relay scan |
| paged duplicate 9/9 | `DuplicateReplayed { SandboxReplayedMaintenanceJobReport }` | exact stored original run/trace/selection/batches/items/status/outcome/start/report time + current duplicate overlay | empty accumulator、body-free outcome only、current truth |
| reconciliation 2/2 | canonical specialized committed/duplicate envelope | scope/report/finding/audit/relay/status/times | generic batch/finalizer |

fresh finalized header与caller batch chain在application write source中已共同校验并同UoW保存；entry constructor再次校验
job/run/start/token/status/outcome关系，但不重派生status。duplicate完整surface已在same snapshot与generic carrier交叉校验，entry只
验证fixed job kind后move保存。四个branch都没有第二complete batch chain。

### C-1C-R.11 Error-count correction

replay-only empty accumulator被删除后，`JobsError::AccumulatorReplayOnly`无consumer并从current enum删除。C-2 current输入改为：

```text
ApiError = 7 variants
WorkerError = 12 variants
JobsError = 16 variants
```

本批不提前执行error-to-disposition exhaustive mapping，只校准其输入基数。历史`7/12/17`记录降为historical material；C-2必须
对`7/12/16`逐variant exact-once审计，并复核application error kind映射。该变化不新增blocker，也不伪造C-2完成。

### C-1C-R.12 Final static closure

| audit | expected | current result |
|---|---:|---:|
| paged Start/Continue | `9` | `9/9 pass_for_design` |
| paged duplicate complete source | `9` | `9/9 pass_for_design` |
| paged fresh terminal complete source | `9` | `9/9 pass_for_design` |
| Worker relay fresh/duplicate | `2` | `2/2 pass_for_design` |
| reconciliation atomic variants | `2` | `2/2 pass_for_design` |
| caller-owned fresh complete batch chains | `1/invocation` | `1/invocation` |
| application/store second complete chain | `0` | `0` |
| clone/rebuild/drop-before-mapping | `0/0/0` | `0/0/0` |
| duplicate business/current reads after application result | `0` | `0` |
| duplicate clock/write/allocation/external | `0/0/0/0` | `0/0/0/0` |
| fresh status derivation owner | `1` | application finalizer only |
| report fields from entry post-clock | `0` | `0` |
| new public DTO/logical callable/stored kind | `0/0/0` | `0/0/0` |
| new L1/L2 blocker | `0` | `0` |

`SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001`现为`resolved_in_7r_06c_1c_r`。C-1C整体为
`completed_wait_user_review`。开放owner blocker仍只有`DISPATCH-001 | OUTCOME-001 | READ-001 | ENTRY-001`，分别等待
C-2/C-3及既定owner closure；本批不提前关闭。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v5.3-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06 output/receipt/report and exhaustive error mapping
current_sub_batch = 7R-06C-1C Jobs paged/exit/reconciliation output mapping completed_wait_user_review
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = user_review_pending
batch_status = completed_wait_user_review
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A,7R-06C-1B,7R-06C-1B-R,7R-06C-1C,7R-06C-1C-R
next_internal_batch = 7R-06C-2 API/Worker/Jobs exhaustive error mapping 7/12/16
next_allowed_action = wait_user_review_before_7r_06c_2
tracked_tasks = 108_unique
task_status = 41_completed,0_in_progress,64_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/8_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
paged_jobs_preterminal_mapping = 9/9_pass_for_design
paged_jobs_duplicate_mapping = 9/9_pass_for_design
paged_jobs_fresh_terminal_mapping = 9/9_pass_for_design
worker_relay_report_source_mapping = 2/2_pass_for_design
reconciliation_atomic_mapping = 2/2_pass_for_design
next_error_mapping_cardinality = API_7|Worker_12|Jobs_16
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

本批完成并停在C-1C用户复核门。未经新的连续确认不得进入C-2、C-3、Step 8、正式`03`或implementation。

---

## EOF Current Recovery Amendment: `7R-06C-2` Worker 12/12 mapping complete

> 本节消费C-2.1~C-2.5 foundation，取代上一C-1C-R恢复块并成为本文物理EOF的唯一current authority。共同
> application 16-kind和API 7/7已完成；本节闭合Worker 12/12。Jobs current 16项尚未激活，C-2仍为进行中。

### C-2.6 Worker 12/12 local mapping

Worker三种调用形态共用同一个`WorkerError`闭集，但错误处置不拥有consumer ack、fulfillment重新入队或relay
dead-letter策略。`entry_disposition()`只给这些后续policy提供有限、body-free输入。

| # | `WorkerError` variant | public kind | retryable | safe reason / trace | entry disposition |
|---:|---|---|---:|---|---|
| 1 | `Application(error)` | delegate `error.to_public_error_kind()` | delegate | checked reason与可选trace均借自error | 按C-2.3 Worker列16/16 |
| 2 | `InvalidEnvelope` | `Validation` | false | constructor-checked reason；继承已验证trace | `Rejected` |
| 3 | `UnsupportedVersion` | `UnsupportedVersion` | false | constructor-checked reason；继承已验证trace | `Rejected` |
| 4 | `Quarantined` | `Quarantined` | false | source/schema guard reason；继承已验证trace | `Rejected` |
| 5 | `WorkerKindMismatch` | `Internal` | false | fixed `worker kind mismatch`；trace=None | `Failed` |
| 6 | `StoredResultMissing` | `Internal` | false | fixed `worker outcome missing stored result`；trace=None | `Failed` |
| 7 | `StoredResultKindMismatch` | `Internal` | false | fixed `worker stored result kind mismatch`；trace=None | `Failed` |
| 8 | `ReceiptStatusRelationMismatch` | `Internal` | false | fixed `consumer receipt status relation mismatch`；trace=None | `Failed` |
| 9 | `NoWriteOutcomeForbidden` | `Internal` | false | fixed `worker outcome cannot be no-write`；trace=None | `Failed` |
| 10 | `CompletionTimeBeforeStart` | `Internal` | false | fixed `worker completion time before start`；trace=None | `Failed` |
| 11 | `FulfillmentStatusRelationMismatch` | `Internal` | false | fixed `fulfillment status relation mismatch`；trace=None | `Failed` |
| 12 | `RelayStatusRelationMismatch` | `Internal` | false | fixed `relay status relation mismatch`；trace=None | `Failed` |

`Quarantined -> Rejected`只表示当前entry不进入application success路径。是否ack、隔离、dead-letter或保留原消息由Step 9/12
基于typed error和source policy决定；不能把`Quarantined`改成`Delayed`来暗示当前Worker自行重试。八个Worker-local
relation/context缺陷都属于wiring完整性失败，不能因某个依赖可能恢复而改成retryable。

### C-2.7 Worker implementation contract

`WorkerError`既有五个accessor保持Step 6签名不变。`Application`分支委托application四个accessor；三个inbound分支返回其
checked reason/trace；其余八项使用固定ASCII reason且trace为`None`。处置实现必须显式穷尽：

```rust
fn worker_application_entry_disposition(kind: ApplicationErrorKind) -> EntryDisposition {
    match kind {
        ApplicationErrorKind::Validation
        | ApplicationErrorKind::ForbiddenExternalBody
        | ApplicationErrorKind::NotAuthorized
        | ApplicationErrorKind::NotVisible
        | ApplicationErrorKind::IdempotencyConflict
        | ApplicationErrorKind::BoundaryRejected
        | ApplicationErrorKind::PolicyFailClosed
        | ApplicationErrorKind::UnsupportedVersion
        | ApplicationErrorKind::Quarantined
        | ApplicationErrorKind::Disabled => EntryDisposition::Rejected,
        ApplicationErrorKind::ReferenceUnresolved
        | ApplicationErrorKind::VersionConflict
        | ApplicationErrorKind::PortUnavailable => EntryDisposition::Delayed,
        ApplicationErrorKind::DuplicateMissingResult
        | ApplicationErrorKind::NoWriteViolation
        | ApplicationErrorKind::Internal => EntryDisposition::Failed,
    }
}

impl WorkerError {
    pub fn entry_disposition(&self) -> EntryDisposition {
        match self {
            WorkerError::Application(error) => {
                worker_application_entry_disposition(error.kind())
            }
            WorkerError::InvalidEnvelope { .. }
            | WorkerError::UnsupportedVersion { .. }
            | WorkerError::Quarantined { .. } => EntryDisposition::Rejected,
            WorkerError::WorkerKindMismatch { .. }
            | WorkerError::StoredResultMissing { .. }
            | WorkerError::StoredResultKindMismatch { .. }
            | WorkerError::ReceiptStatusRelationMismatch { .. }
            | WorkerError::NoWriteOutcomeForbidden { .. }
            | WorkerError::CompletionTimeBeforeStart { .. }
            | WorkerError::FulfillmentStatusRelationMismatch { .. }
            | WorkerError::RelayStatusRelationMismatch { .. } => EntryDisposition::Failed,
        }
    }
}
```

`to_public_error_kind()`、`is_retryable()`、`safe_reason()`和`trace_context()`也必须各自逐12项匹配，禁止共享一个
`public kind -> disposition`反向mapper，禁止`_` arm。`From<ApplicationError>`只移动原error；不存在
`From<InfraError>`、`From<JobsError>`、raw publisher/backend error或`Box<dyn Error>`。

### C-2.8 Worker source-to-error boundary

| source point | allowed Worker error | forbidden substitute |
|---|---|---|
| validated consumer envelope before facade | `InvalidEnvelope | UnsupportedVersion | Quarantined` | raw payload、topic字符串、SDK error文本 |
| runtime context/helper allow-set | `WorkerKindMismatch` | binary name或config字符串反推kind |
| consumer outcome conversion | `StoredResultMissing | StoredResultKindMismatch | ReceiptStatusRelationMismatch | NoWriteOutcomeForbidden` | 生成empty receipt、读取repository补surface |
| fulfillment conversion | `StoredResultMissing | StoredResultKindMismatch | NoWriteOutcomeForbidden | CompletionTimeBeforeStart | FulfillmentStatusRelationMismatch` | 从runtime/backend body拼command result |
| relay conversion/finalization | `StoredResultMissing | StoredResultKindMismatch | NoWriteOutcomeForbidden | CompletionTimeBeforeStart | RelayStatusRelationMismatch` | 从counter、publisher或current truth拼report |
| application factory/facade/finalizer | `Application(error)` | 按Display文本重新分类为Worker-local variant |

同一variant可以由多个合法source point构造，但每个具体错误值进入五个accessor时只有一个match arm；`12/12 exact_once`
统计的是enum variant覆盖，不伪称每个调用点只可能产生一种error。

### C-2.9 Worker小循环审计与下一门禁

| audit | expected | current result |
|---|---:|---:|
| Worker local variants forward coverage | 12 | `12/12 exact_once` |
| Worker local variants reverse duplicate | 0 | `0` |
| Worker application kinds | 16 | `16/16 exact_once` |
| checked trace-bearing local variants | 3 | `3/3` |
| no-trace local relation/context variants | 8 | `8/8` |
| wildcard / raw-cause conversion | 0 / 0 | `0 / 0` |
| ack/backoff/dead-letter policy defined | 0 | `0` |
| new public DTO/error/retry type | 0 | `0` |
| new L1/L2 blocker | 0 | `0` |

```text
current_plan_version = v5.4-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-2 JobsError current 16 owner activation in_progress
application_entry_mapping = API_16/16|Worker_16/16|Jobs_16/16
api_error_mapping = 7/7_exact_once
worker_error_mapping = 12/12_exact_once
jobs_error_mapping = pending_current_16_owner_activation
gate_status = content_in_progress
next_allowed_action = activate_jobs_error_16_owner_then_write_entry_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Recovery Amendment: `7R-06C-2` exhaustive error mapping complete

> 本节位于本文物理EOF并成为C-2唯一current authority。它明确采纳本文的C-2.1~C-2.13 foundation以及Step 6
> 物理EOF的16项`JobsError` owner；此前Jobs段的错误物理位置和Worker进行中恢复块均降为historical material。
> 本批只闭合entry caller-safe错误投影，不定义或执行transport、调度、观测、交付和process policy。

### C-2.14 正反向静态审计

审计以Step 6 current enum为正向源，以三个entry显式match为反向源。计数单位是enum variant，不把一个variant可由多个
source point构造重复计数，也不把红线文字中的禁止项误算为正向契约。

| audit surface | expected | current result |
|---|---:|---:|
| `ApplicationErrorKind` owner | `16` | `16/16 exact_once` |
| application到API/Worker/Jobs投影 | `16 * 3` | `48/48 exact_once` |
| `ApiError` owner到entry match | `7` | `7/7 exact_once` |
| `WorkerError` owner到entry match | `12` | `12/12 exact_once` |
| `JobsError` owner到entry match | `16` | `16/16 exact_once` |
| 三类entry error总覆盖 | `35` | `35/35 exact_once` |
| owner遗漏 / entry重复 | `0 / 0` | `0 / 0` |
| application或entry wildcard arm | `0` | `0` |
| current owner中的`AccumulatorReplayOnly`正向variant/alias/constructor/match arm | `0/0/0/0` | `0/0/0/0` |
| raw/generic跨entry error转换 | `0` | `0` |
| HTTP/RPC、ack/nack、backoff、dead-letter、quarantine执行、process exit定义 | `0` | `0` |
| 新public DTO / error variant / application callable | `0/0/0` | `0/0/0` |
| 新L1/L2 blocker | `0` | `0` |

唯一family差异继续是`ApplicationErrorKind::Disabled`：API/Worker为`Rejected`，Jobs为`Skipped`。三个family均只把
`ReferenceUnresolved | VersionConflict | PortUnavailable`映射为`Delayed`，只把
`DuplicateMissingResult | NoWriteViolation | Internal`映射为`Failed`。这一矩阵不能由public kind、retryable、reason、
report status、transport status或process code反推。

### C-2.15 完成边界与后继门禁

| item | current disposition |
|---|---|
| C-2 output | application `48/48`、API `7/7`、Worker `12/12`、Jobs `16/16`和local total `35/35`均通过设计静态审计 |
| deferred policy | HTTP/RPC映射到Step 8；ack/nack、backoff、dead-letter、quarantine执行和process exit继续由Step 9/12拥有 |
| open blockers | `DISPATCH-001 | OUTCOME-001 | READ-001 | ENTRY-001`继续开放；C-2不提前关闭 |
| next batch | 仅在用户复核后允许`7R-06C-3 negative dispatch audit and closure gate` |
| forbidden transition | 不得进入Step 8、正式`03`回填、implementation、真实测试或验收 |
| truthfulness | 未执行代码、编译、测试、provider、runtime或验收；未创建run、evidence alias、签署或commit事实 |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v5.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06C-2 API/Worker/Jobs exhaustive error mapping 7/12/16
current_sub_batch = 7R-06C-2 exhaustive error mapping completed_wait_user_review
current_artifacts = 03_ddd_step_06_object_contracts_application_infra_entry.md|03_ddd_step_07_entry_dispatch_adapters.md
gate_status = completed_wait_user_review
batch_status = completed_wait_user_review
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D,S7-03C-B1-E,7R-06A,7R-06B,7R-06C-1A,7R-06C-1B,7R-06C-1B-R,7R-06C-1C,7R-06C-1C-R,7R-06C-2
next_internal_batch = 7R-06C-3 negative dispatch audit and closure gate
next_allowed_action = wait_user_review_before_7r_06c_3
tracked_tasks = 108_unique
task_status = 42_completed,0_in_progress,63_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
application_entry_mapping = API_16/16|Worker_16/16|Jobs_16/16_exact_once
api_error_mapping = 7/7_exact_once
worker_error_mapping = 12/12_exact_once
jobs_error_mapping = 16/16_exact_once
local_error_total = 35/35_exact_once
wildcard_omitted_duplicate = 0/0/0
removed_accumulator_replay_only_positive_contract = 0
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/8_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
transport_policy = deferred_to_step8_step9_step12
process_exit_code = undefined_deferred
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

C-2完成并停在用户复核门。未经新的连续确认不得进入C-3、Step 8、正式`03`或implementation。

---

## EOF Current Recovery Amendment: `7R-06C-3` negative selector and dispatch matrix

> 用户已确认消费C-2复核门。本节位于本文物理EOF并成为C3-02 current authority；它消费A批selector source、B批
> 42/42 exact mapping、C-1完整output source和C-2 `7/12/16` error闭集。当前只完成negative selector/dispatch矩阵，
> facade-only与副作用反向审计、blocker裁决和三层恢复源最终同步仍属于C3-03/C3-04。

### C-3.1 输入、SOP回答与历史冲突裁决

| item | current answer |
|---|---|
| Step 7 owner | entry只拥有validated inbound到exact application facade的接缝；application拥有operation、业务处理、UoW和结果 |
| positive basis | Command `10/10`、Query `13/13`、Consumer `9/9`、Job `10/10`，合计`42/42` logical callable |
| physical basis | API `23`、Worker fulfillment `4`、Worker consumer `9`、Worker relay `1`、Jobs `10`，合计`47` physical slots |
| overlap rule | fulfillment四项复用Command callable；Worker relay复用Job callable；物理入口不产生第二application method |
| selector authority | closed DTO/event/job kind、固定Worker capability或runner file固定kind；operation只由Step 6 context factory映射 |
| historical conflict | B1-E旧`7/12/17`和本文件旧C-1错误基数只作historical material；current固定`7/12/16` |
| forbidden authority | route/topic/binary/CLI/schedule/config/Display/Debug/DTO type name/typed-ref顺序/private map均不是selector source |
| downstream boundary | route注册、wire unknown响应、ack/nack、process exit留Step 8/9/12；本批只保证它们不能改变facade选择 |

本小批不画ASCII图。可信链只有五类固定线性接缝，逐场景矩阵比流程图更能机械检查每个拒绝点、typed error和零副作用预算。

### C-3.2 五类可信dispatch链

| physical family | only accepted selector source | exact join | mismatch stop point | selector substitutes forbidden |
|---|---|---|---|---|
| API command | 已验证closed command DTO variant | variant -> 独立command handler -> matching input constructor -> matching command facade | DTO/variant/input/context factory完成前；facade call=`0` | route、HTTP method、body字符串、DTO type name、handler name |
| API query | 已验证closed query DTO variant | variant -> 独立query handler -> matching input constructor -> matching query facade | selector/body/key/channel guard完成前；facade call=`0` | route、query parameter name、view type、latest scan、idempotency key |
| Worker fulfillment | 固定runner capability与frozen item中的closed command kind，且命中四项allow-set | fixed helper -> `from_worker` -> 四个既有command facade之一 | worker kind/allow-set/item relation完成前；facade call=`0` | queue/topic、runtime action name、run ref、tool name、config |
| Worker consumer | schema/source guard验证后的closed event kind | event kind -> 独立consumer handler -> `from_consumer` -> matching consumer facade | source/schema/body/metadata/dedup/variant relation完成前；facade call=`0` | topic、schema text、payload type name、publisher map、event body文本 |
| Worker relay | fixed `EventRelay` worker capability + fixed `PublishSandboxEventRelay` allow-set | `from_worker_job(PublishSandboxEventRelay)` -> exact relay facade | worker kind/frozen batch/attempt relation完成前；facade call=`0` | topic、publisher response、jobs binary、Job channel、last cursor |
| Jobs runner | runner file编译期固定`SandboxJobKind`与已验证input kind exact equal | fixed runner -> `from_job` -> same-kind job facade | input/config/version/kind relation完成前；facade call=`0` | binary/CLI/schedule/config name、topic、report status、process code |

API route可以在Step 8注册到一个protocol decoder或typed handler，但它不能替代closed selector，也不能覆盖DTO selector；route与
decoded variant冲突时必须拒绝。Worker topic和Jobs binary同理只属于部署/transport绑定，不进入business dispatch identity。

### C-3.3 Runtime negative selector matrix

下表中的`zero budget`统一表示：matching application facade、reservation、repository/UoW、domain identity/Version/status、
business clock/id generator、external adapter、publisher和process launch均为`0`。协议层是否ack或返回何种wire status不在本批定义。

| ID | negative input/relation | rejection owner and allowed typed error | zero budget | forbidden recovery |
|---|---|---|---|---|
| `ND-01` | API command/query discriminator missing、unknown或malformed | Step 8 decoder/entry validator；`ApiError::InvalidRequest`或`ApiError::UnsupportedVersion` | required | route/default command补selector |
| `ND-02` | API closed selector与decoded body variant不一致 | matching envelope/input validator；`ApiError::InvalidRequest` | required | DTO type name、字段集合或route决定胜者 |
| `ND-03` | command selector进入query handler，或query selector进入command handler | channel/context factory；`ApiError::Application(error)`，其中`error.detail()`为`ChannelMismatch | InvalidOperationMapping` | required | 改channel、补/删idempotency key后继续 |
| `ND-04` | API command缺key、query携带key或digest不覆盖当前validated variant | context factory；`ApiError::Application(error)`，其中detail为`IdempotencyKeyMissing | IdempotencyKeyForbidden | RequestDigestInvalid` | required | request/trace id、clock或route生成替代key/digest |
| `ND-05` | Worker runtime kind与fixed fulfillment helper不一致 | Worker context guard；`WorkerError::WorkerKindMismatch` | required | runtime action、binary或queue名重选helper |
| `ND-06` | fulfillment item selector不在Start/Capture/Handoff/Failure四项allow-set | worker/application context guard；`WorkerError::Application(error)`，其中detail为`ChannelMismatch | InvalidOperationMapping` | required | generic command facade或转API channel |
| `ND-07` | fulfillment frozen item kind与exact input carrier不一致 | typed item/input validator；`WorkerError::InvalidEnvelope`或`WorkerError::Application(error)`，其中`error.kind() == Validation` | required | 从run ref、tool body或字段形状猜command |
| `ND-08` | Consumer source/schema/body guard失败、event kind missing/unknown | Worker inbound validator；`WorkerError::InvalidEnvelope | WorkerError::UnsupportedVersion | WorkerError::Quarantined` | required | topic或payload type name选择consumer |
| `ND-09` | Consumer closed event kind与body-free input variant不一致 | typed event/input validator；`WorkerError::InvalidEnvelope`或`WorkerError::Application(error)`，其中`error.kind() == Validation` | required | private publisher map、字段顺序或source ref猜分支 |
| `ND-10` | topic/schema registration与decoded closed event kind冲突 | source/schema guard；`WorkerError::Quarantined`或`WorkerError::InvalidEnvelope` | required | 信任topic并覆盖typed kind |
| `ND-11` | Worker relay run context不是`EventRelay`或试图调用其它Job kind | relay context guard；`WorkerError::WorkerKindMismatch`或`WorkerError::Application(error)`，其中detail为`ChannelMismatch` | required | topic、last cursor、publisher response选择job |
| `ND-12` | Worker relay试图使用`Job` channel、Jobs context或jobs crate | compile-time dependency/constructor absence；若context已形成则为detail=`ChannelMismatch`的`WorkerError::Application(error)` | required | channel改写后重用输入 |
| `ND-13` | Jobs input kind missing/unknown、version/input guard失败 | Jobs input validator；`JobsError::InvalidJobInput | JobsError::UnsupportedVersion | JobsError::ForbiddenExternalBody` | required | binary/CLI/schedule/config生成kind |
| `ND-14` | runner file固定kind与validated job input kind不一致 | runner relation guard；`JobsError::RunnerJobKindMismatch` | required | generic job dispatcher、alias或重写input kind |
| `ND-15` | paged Job kind与permit/selection/batch/finalizable kind不一致 | exact constructor/accumulator guard；`JobsError::AccumulatorJobKindMismatch`或包裹kind=`Validation`的`JobsError::Application(error)` | no next facade/page/finalizer call | last cursor、report status或counter重选job |
| `ND-16` | reconciliation被送入paged/finalizer路径，或paged Job被送入atomic reconciliation路径 | compile-time distinct input/result boundary；若在共享外层校验被发现则为包裹kind=`Validation`的`JobsError::Application(error)` | required | empty batch、generic outcome或wrapper强制统一 |

`ApiError/WorkerError/JobsError::Application(error)`只表示entry保留Step 6 current application error；上表不新增application
detail或entry error variant。若某个
非法组合在Rust类型层无法构造，则以constructor/dependency absence作为负向证据，不为不可达路径增加runtime error。

### C-3.4 Static forbidden-dispatch matrix

这些项目必须通过API surface和依赖图的“缺席”实现，不应新增runtime fallback再返回错误。

| ID | forbidden implementation shape | required current shape | static expected |
|---|---|---|---:|
| `SD-01` | `dispatch(kind, payload)`、`run(kind, payload)`或`call_exact_*` runtime generic实现 | 每个selector独立typed handler和exact facade method | positive generic callable `0` |
| `SD-02` | wildcard/default arm把unknown映射到相近selector | exhaustive closed match；unknown在decoder/validator结束 | wildcard/default dispatch arm `0` |
| `SD-03` | selector alias、多selector共享一个facade method或一个method反向对应多selector | `42 selector <-> 42 method`双向一一关系 | alias/duplicate join `0/0` |
| `SD-04` | route/HTTP method/topic/schema text作为business selector | protocol registration只进入对应decoder/guard，closed kind仍须验证 | transport-derived selector `0` |
| `SD-05` | binary/CLI/schedule/config profile决定Jobs business method | runner source固定kind并与closed input kind比较 | deployment-derived selector `0` |
| `SD-06` | `OperationName`、Display、Debug、reason或error文本反向选择handler | operation只由context factory从closed selector正向映射 | text reverse dispatch `0` |
| `SD-07` | DTO/input/result type name或typed-ref字段顺序反推selector | selector和matching source variant显式携带 | shape/order inference `0` |
| `SD-08` | repository/latest scan、adapter/provider state、counter、clock、stored result补selector | entry在任何business read之前已有完整provenance tuple | fallback selector read `0` |
| `SD-09` | fake/private map提供production没有的dispatch branch或missing-row success | fake与durable共享application trait和closed selector | fake-only branch `0` |
| `SD-10` | API/Worker/Jobs error互转或按public kind/retryable重新选择facade | error只结束当前exact invocation并映射caller-safe disposition | error-driven redispatch `0` |
| `SD-11` | Worker relay复制Job method或依赖jobs crate | 同一application relay method，Worker/Job仅context和entry carrier不同 | extra callable/dependency `0/0` |
| `SD-12` | finalizer、receipt/report mapper或process exit mapper成为新dispatch selector | 它们只消费已选择callable的typed result | extra logical callable `0` |

### C-3.5 C3-02 forward/reverse audit

| audit | expected | current design result |
|---|---:|---:|
| trusted positive logical joins | `42` | `42/42` |
| physical slots with declared trusted selector source | `47` | `47/47` |
| runtime negative relation classes | `16` | `16/16 specified` |
| static forbidden implementation shapes | `12` | `12/12 specified` |
| generic/wildcard/alias dispatch | `0/0/0` | `0/0/0` |
| string/topic/route/debug/config/private-map selector authority | `0` | `0` |
| negative matching-facade calls | `0` | `0` by contract |
| new selector/handler/facade/error/public type | `0/0/0/0/0` | `0/0/0/0/0` |
| new L1/L2 blocker | `0` | `0` |

`DISPATCH-001`和`ENTRY-001`此时仍只是closure candidate。C3-03必须继续证明entry direct repository/port/backend调用、
结果二次派生、拒绝路径副作用和cross-family dependency均为0；未完成该反向审计前不得改变blocker状态。

```text
current_plan_version = v5.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06C-3 negative dispatch audit and closure gate
current_sub_batch = 7R-06C-3 negative selector dispatch matrix completed; facade-only audit pending
gate_status = content_in_progress
batch_status = in_progress
c3_01_current_source_recovery = completed
c3_02_negative_dispatch_matrix = 16_runtime|12_static_completed
next_allowed_action = run_c3_facade_only_and_side_effect_reverse_audit
candidate_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Recovery Amendment: `7R-06C-3` C3-03 complete, C3-04 in progress

> 本节位于本文物理EOF并成为唯一current authority。它显式采纳前部
> `Historical-Position Foundation: 7R-06C-3 facade-only and side-effect reverse audit`的C-3.6~C-3.11全部契约，
> 同时保留紧邻前部C3-02的`ND-01~ND-16`、`SD-01~SD-12`和`42/42 logical | 47/47 physical`审计结论。

| activation item | current result |
|---|---|
| C3-01 current source recovery | completed |
| C3-02 negative selector/dispatch | `16/16 runtime`、`12/12 static`、generic/wildcard/alias=`0/0/0` |
| C3-03 facade-call budget | one-shot `37/37 E<=1`；paged `10/10`只调用已固定的同一Job method；pre-dispatch call=`0` |
| C3-03 direct-access budget | entry repository/domain/UoW/adapter/backend/publisher/process launch=`0/0/0/0/0/0/0` |
| C3-03 reverse behavior | current-truth reread、second business derivation、error redispatch=`0/0/0` |
| completion clock | Worker fulfillment `Ok` path最多一次；其余physical slots `43/43` post-result clock=`0` |
| cross-family dependency | Worker -> Jobs=`0`；Jobs -> Worker=`0`；三类entry只依赖checked contracts/core、application facade和本family carrier |
| candidate blockers | `DISPATCH-001 | ENTRY-001`证据齐备但仍为`open_candidate`，等待C3-04正式裁决 |
| non-candidate blockers | `OUTCOME-001 | READ-001`继续开放；不属于7R-06 owner |
| downstream | Step 7总gate、Step 8、正式`03`和implementation继续冻结 |

C3-04只能复核原始关闭条件、同步control/flow/ledger/plan并执行机械检查；不得重写主体facade或借候选关闭宣告Step 7总通过。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v5.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = 7R-06C-3 blocker adjudication and recovery-source closure
current_sub_batch = 7R-06C-3 C3-03 completed; C3-04 in_progress
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = content_in_progress
batch_status = in_progress
c3_01_current_source_recovery = completed
c3_02_negative_dispatch_matrix = completed
c3_03_facade_only_side_effect_audit = completed
c3_04_blocker_adjudication = in_progress
next_allowed_action = adjudicate_dispatch_entry_blockers_and_sync_step7_control
candidate_blockers = SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
non_candidate_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Closure: `7R-06C-3` completed, user review pending

> 本节位于本文物理 EOF，是 `7R-06` entry dispatch owner 的唯一 current authority。C3-04 已按原始关闭条件复核
> C3-01~C3-03 证据；旧 `7/12/17` 基数仅作为 historical material，现行 entry local error 闭集为
> API `7/7`、Worker `12/12`、Jobs `16/16`。

### C-3.12 Blocker 最终裁决

| blocker | current closure evidence | deferred but non-blocking surface | adjudication |
|---|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-DISPATCH-001` | `42/42` selector、handler、input、facade method、output 双向一一闭合；`47/47` physical slot 均有唯一 trusted selector source；runtime negative `16/16`、static forbidden `12/12`；generic/wildcard/alias 和 string/topic/route/debug/config selector authority 均为 `0` | Step 8 只绑定 route/topic/binary 到已固定 decoder/handler，不得成为 business selector | `resolved_in_7r_06c_3` |
| `SBX-DDD-GRANULARITY-STEP7-ENTRY-001` | API/Worker/Jobs context factory、selector source、status/result/receipt/report source 全部闭合；entry direct repository/domain/UoW/adapter/backend/publisher/process launch 为 `0`；decode、authorization、unknown、duplicate、degraded 均有 no-write 或 application-owned disposition；local error `7/12/16` 为 `35/35 exact_once` | ack/nack、HTTP wire mapping、process exit 分别由 Step 8/9/12 定向回归，不改变已闭合的 entry business ownership | `resolved_in_7r_06c_3` |

关闭只表示 Step 7 设计 owner 已满足静态条件，不表示协议、实现、编译、测试、provider、evidence 或验收完成。`OUTCOME-001`
与 `READ-001` 不属于 `7R-06`，继续开放，因此 Step 7 总 gate 仍为 blocked。

### C-3.13 C3-04 完成检查

| check | current result |
|---|---|
| C3-01 current source recovery | completed |
| C3-02 negative selector/dispatch | runtime `16/16`、static `12/12` |
| C3-03 facade-only / side-effect reverse audit | one-shot `37/37 E<=1`、paged `10/10 fixed method`；direct access / reread / second derivation / redispatch=`0` |
| C3-04 blocker adjudication | `DISPATCH-001`、`ENTRY-001` resolved |
| remaining Step 7 blockers | `OUTCOME-001 | READ-001`，`2/8` internal、`2/6` primary |
| new L1/L2 blocker | `0` |
| next owner after review | `7R-04A exact read and maintenance surface` |
| forbidden transition | 用户复核前不得进入 `7R-04A`；始终不得跳到 Step 8、正式 `03` 回填或 implementation |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v5.8-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_module = 7R-06 entry_dispatch_adapters
current_task = none
current_sub_batch = 7R-06C-3 completed_wait_user_review
current_artifact = 03_ddd_step_07_entry_dispatch_adapters.md
gate_status = completed_wait_user_review
batch_status = completed_wait_user_review
c3_01_current_source_recovery = completed
c3_02_negative_dispatch_matrix = completed
c3_03_facade_only_side_effect_audit = completed
c3_04_blocker_adjudication = completed
next_internal_batch = 7R-04A exact read and maintenance surface
next_allowed_action = wait_user_review_before_7r_04a
tracked_tasks = 108_unique
task_status = 43_completed,0_in_progress,62_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
current_error_mapping_cardinality = API_7|Worker_12|Jobs_16
local_error_total = 35/35_exact_once
remaining_step_7_internal_blockers = 2/8_open_with_owner
remaining_step_7_primary_blockers = 2/6_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

`7R-06` 已完成并停在用户复核门。用户确认后只允许启动 `7R-04A`；不得自动跨到 Step 8、正式文档回填或实现。
