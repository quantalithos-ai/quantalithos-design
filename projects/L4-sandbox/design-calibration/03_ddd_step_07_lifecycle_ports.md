# L4-sandbox 详细设计 Step 7 回归中间产物：Lifecycle Ports

> 对应正式文档：`projects/L4-sandbox/03-详细设计.md`
>
> 当前任务：`S7-03B establish/launch/inspect/release ports`
>
> 当前状态：`completed_wait_user_review`（B5 已闭合 launch terminal failure carrier、conflict mapping 和静态差集）
>
> 本文件是 Step 7 中间产物，不是正式详细设计、实现代码、测试结果或验收事实。

## 1. Step 状态

| field | value |
|---|---|
| current document | `03-详细设计.md` |
| current Step | Step 7 regression / `7R-03B` |
| task | `S7-03B` |
| module | `application::ports` lifecycle traits；`infra` durable/fake adapter implementations |
| classification | `L1 主流程完整设计`；涉及隔离副作用、partial environment、run launch和cleanup release |
| status | `completed_wait_user_review` |
| consumed predecessor | `S7-03A` content completed and user-confirmed |
| current artifact | `03_ddd_step_07_lifecycle_ports.md` |
| next task | 等待用户复核；确认前不得启动`S7-03C` |
| Step 8 | `blocked_by_step_7_regression` |
| formal `03~07` | `historical_reviewed_revalidation_pending` |
| implementation | `CB-SBX-01A blocked / wait_design` |

### 1.1 写入批次状态

| batch | scope | status | completion gate |
|---|---|---|---|
| `S7-03B-B1` | source map、SOP回答、diagnosis、共同external-call契约 | `completed` | owner、依赖方向、四接缝和unknown总规则无歧义 |
| `S7-03B-B2` | environment establishment request/port/result/error | `completed` | exact guard/correlation、partial pair、no-side-effect unavailable闭合 |
| `S7-03B-B3` | controlled run launch request/port/observation/error | `completed` | committed permit、launch-only边界和same-run recovery闭合 |
| `S7-03B-B4` | environment inspect与guarded release request/port/outcome/error | `completed` | same-target observation、release basis、completion/failure分流闭合 |
| `S7-03B-B5` | cross-port audit、fake parity、回填草稿、自检和恢复同步 | `completed` | launch terminal failure carrier、conflict mapping和static差集归零 |

## 2. 本步输入与 Source Map

### 2.1 标准输入

| source | 本批消费内容 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | 逐模块port capability、exact trait签名、调用方/实现方、读取/写入面和停审门 |
| `standards/document/详细设计书写规范.md` | trait、参数、返回、error、Rustdoc和正式回填索引粒度 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段来源、typed correlation、状态触发、external side effect和fake parity闭环 |
| `standards/document/设计文档讨论中间产物规范.md` | 问题回答、诊断、改动前后、取舍、分批写入、回填草稿和恢复同步 |

### 2.2 项目 Current Source

| source | current authority | 本批用途 |
|---|---|---|
| Step 5 module contracts | `application`定义port trait；`infra`实现；domain与entry不得依赖provider | 固定依赖方向和文件owner |
| Step 6 context/boundary | `BoundaryRequirementSet`、`BackendCapabilitySummary`、guard decisions、descriptor、lifecycle observation、handle | 固定establish/inspect exact输入和结果对象 |
| Step 6 policy/run/capture | `03_ddd_step_06_object_contracts_policy_run_capture.md` §§14/27及物理EOF `S7-03B` overlay：`ControlledRunLaunchPermit`、`ControlledRunLifecycleObservation`、run transition | 固定launch只能消费已提交preflight proof；terminal failure复用run预绑定identity |
| Step 6 failure/cleanup/read | `CleanupReleaseBasis`、`CleanupCompletionBasis`、`CleanupReleaseFailureObservation/Basis`、`BackendLifecycleSummary` | 固定release authorization、confirmation/failure和cleanup owner |
| Step 6 application/infra/entry | application-owned establishment result、infra-private establishment outcome、`InfraError` | 固定application不得返回infra类型，raw provider数据止于adapter |
| Step 6 handoff `S7H-12` | establish/launch/inspect/release独立、exact correlation、commit-unknown inspect、无SDK泄漏 | 本任务完成门禁 |
| Step 7 `7R-01~02` | application facade、UoW/clock/identity、pre-call recovery、owner repository与stored replay | 固定external await不持有UoW，unknown不产生第二identity |
| Step 7 `S7-03A` | resolver与lifecycle port分离 | capability observation不执行establish或launch |

### 2.3 上游项目裁剪

| upstream | 本批只消费 | 本批明确排除 |
|---|---|---|
| `L2-tools` | 已验证tool scope ref可作为上游relation | tool invocation body、semantic execution、tool success |
| `L2-runtime` | runtime/runner generation与body-free correlation ref | agent loop、runner payload、runtime主状态和调度重试 |
| `L2-member-service` | member/host body-free identity relation | member lifecycle和host orchestration |
| `L1-identity` / `L1-work` | accepted typed refs和safe summaries | identity/work正文及其状态推进 |

未发现完成本批必须由上游新增的L1/L2接口。provider产品选择、SDK方法、endpoint、credential、route、topic和timeout数值
属于infra/config后续绑定，不得进入application trait。

## 3. SOP 问题回答

### Q1. 哪些模块定义 lifecycle trait？

只有`application::ports`定义四个独立trait：environment establishment、controlled run launch、environment lifecycle
inspection和guarded environment release。不得保留一个通过action enum分派的generic backend trait。

### Q2. 谁调用、谁实现？

| family | application caller | durable/fake implementer | direct entry/provider access |
|---|---|---|---|
| establish | boundary command service内部 | `infra::isolation_backend_adapters` | entry不得直调；provider不得回调repository |
| launch | run command service内部 | 同一generation isolation adapter | tools/runtime/member owner不得绕过Sandbox preflight |
| inspect | cleanup/reaper/recovery application flow | lifecycle inspection adapter | Query不得调用或用结果反写truth |
| release | cleanup release application flow | isolation release adapter | reaper、entry和operator flag不得直接调用 |

### Q3. 四个接缝承接哪些Step 6对象能力？

- establish承接十维`BoundaryRequirementSet`、fresh capability guard和body-free descriptor/lease window。
- launch承接已提交`Preparing` run形成的`ControlledRunLaunchPermit`及其prebound launch-failure identity，只确认Sandbox isolation-layer run launch。
- inspect承接exact handle/backend target/generation，对应四类environment lifecycle observation。
- release承接persisted `CleanupReleaseBasis`，并把结果分成lifecycle observation或definitive release failure observation。

### Q4. exact输入字段从哪里来？

context、identity、boundary、run、handle、lease和cleanup refs来自exact committed owner read；requirement、capability、permit和
release basis来自Step 6 checked factory；backend target只来自capability或persisted handle；trace只来自checked service call
context。launch terminal failure ref只来自`ControlledRunIdentityBundle`并随`Preparing` run持久化；route、topic、display name、
latest scan、provider response、error text和恢复时重新调用allocator均不是identity来源。

### Q5. 函数签名如何拆分？

每个trait使用family-specific checked request、typed result和closed error。establish和launch trait各自提供side-effect method及
same-correlation inspection method；environment inspect是只读port；release side effect后的恢复复用environment inspect并携带
同一persisted release basis，不新增authorization。

### Q6. 返回和错误怎样区分？

可信finite provider observation进入result；typed launch terminal failure也进入closed finite result，再由application转换为
canonical failure observation。无法形成可信observation、adapter binding错误、forbidden body和side-effect unknown
进入closed port error。`Unavailable`只有在typed provider contract明确证明对应finite语义时才是result；timeout、connection
reset或process interruption不能靠error string映射成`Unavailable`。

### Q7. 读取面是否足够支撑后续flow/state？

是。establish result可机械创建decision、optional partial handle和cleanup obligation；launch result可唯一进入`Running`或以
prebound failure ref形成formal failure owner；launch inspection另有五个closed disposition。environment inspect observation可映射
同源`BackendLifecycleSummary`；release result可唯一进入completion、definitive failure或same-basis
recovery分支。port本身不返回public DTO或stored result。

### Q8. 写入、Version、UoW与幂等如何闭合？

四类external call均不接受repository、`Version`或UoW。fresh write-capable invocation先以reservation-only UoW取得
`FreshReserved`并确认commit；在此之前不得读取business owner、分配business identity或外呼。随后application才组装并提交
attempt/permit/basis recovery point；run launch还必须把prebound failure ref内嵌于`Preparing` run。pre-call recovery commit
confirmed后，application释放transaction handle，fresh-read exact owner并重新authorize，再执行外呼；调用后再次fresh-read owner与
`Version`，在新UoW内执行domain transition。duplicate replay不外呼；任一commit unknown先执行对应exact persisted relation
inspection，不跨阶段猜测absence或重新分配identity。

### Q9. 哪些依赖只能经trait？

isolation provider SDK、container/VM/process lifecycle API、backend capability implementation和release API只能由infra concrete
adapter访问。domain、entry、repository、query和上游tools/runtime/member组件均不得直接依赖这些实现。

### Q10. 当前模块何时可以停审？

四个trait的request/result/error、caller/implementer、correlation、partial/unknown、owner transition、fake parity和negative
boundary全部闭合，且static audit无反向依赖、SDK/body泄漏或generic outcome后，本任务才可进入`completed_wait_user_review`。

### Q11. 是否存在重复port或反向依赖？

historical `IsolationBackendPort`同时拥有establish/launch/inspect/release并返回infra outcome，且另有重复
`BackendLifecycleInspectionPort`。两者都失去current authority；本文件四trait是唯一lifecycle external surface。

## 4. 当前文档问题诊断

| ID | historical material | 问题 | current disposition |
|---|---|---|---|
| `LCP-D01` | 旧`IsolationBackendPort` | 四种不同副作用/结果共享一个trait和generic outcome | `historical_material`；拆为四trait |
| `LCP-D02` | 旧establish返回`IsolationBackendAdapterOutcome` | application trait反向依赖infra type | `invalidated_dependency_direction`；返回application-owned result |
| `LCP-D03` | 旧launch返回establishment outcome或裸run lifecycle observation | 无法表达run ref、permit、typed terminal launch failure与inspection disposition | `invalidated`；side-effect返回`ControlledRunLaunchResult`，inspection返回独立closed result |
| `LCP-D04` | 旧inspect返回`BackendLifecycleSummary` | handle observation与cleanup support carrier混淆，且重复inspection port | `invalidated`；port先返回canonical lifecycle observation，再由唯一mapper形成summary |
| `LCP-D05` | 旧release只接收handle ref | cleanup permission可被caller bool或status替代，authorization无法恢复 | `invalidated`；必须消费persisted `CleanupReleaseBasis` |
| `LCP-D06` | 旧`ApplicationResult<T>` | finite business observation与call-aborted/unknown混合 | `invalidated`；family-specific result/error |
| `LCP-D07` | timeout/unavailable摘要 | 可能把已发生side effect误判为无副作用失败 | `security_conflict`；统一external side-effect unknown并inspect original correlation |
| `LCP-D08` | 正式`03`与旧Step 9/10 | 仍调用generic port/outcome shortcut | `historical_reviewed_revalidation_pending`；本批只生成回填草稿，不直接修改 |
| `LCP-D09` | `MUT-G04`只有launch recovery prose，run/capture bundle没有failure identity | terminal result或post-call commit unknown可能为同一launch分配第二个`FailureClassificationRef`；成功分支又不能预建`PendingInput` | `resolved_in_s7_03b`；run root在`Preparing`内嵌prebound ref，成功/terminal transition原子清空，不新增root/repository/status |

## 5. 改动前后与设计取舍

### 5.1 改动前后

| dimension | before | current contract | reason |
|---|---|---|---|
| port shape | one generic backend trait | four application-owned traits | side effect与result owner不同 |
| establish result | infra outcome | `IsolationEnvironmentEstablishmentResult` | 保持application不依赖infra |
| launch input | full run + handle | checked request carrying committed launch permit and prebound failure identity | 不能绕过policy/lease/boundary preflight；恢复不分配第二failure identity |
| inspect output | generic backend summary | `IsolationEnvironmentLifecycleObservation` | 先保留同源typed observation，再映射cleanup support |
| release input | handle ref / allowed bool | persisted `CleanupReleaseBasis` | crash后可恢复同一authorization |
| unknown | unavailable/failed/retryable猜测 | original correlation strict hold + typed inspect | unknown不等于absent |
| body boundary | prose-only prohibition | request/result/error closed fields | 结构上禁止SDK/raw body穿透 |

### 5.2 设计取舍

1. 四trait可重复少量error variant；不以generic action/error换取表面复用。
2. application request保存业务无关的exact correlation和checked proof，不保存provider参数；infra runtime binding完成产品映射。
3. establish与launch各有same-request inspection method，因为side-effect unknown不能通过重新调用side-effect method确认；launch
   inspection必须复用committed run内的prebound failure ref。
4. environment inspection是read-only；release unknown只能携带同一release basis调用inspection，不生成新guard/basis。
5. definitive release failure沿用Step 6统一`CleanupReleaseFailureObservation`，不创建orphan-private或adapter-privateterminal分类。
6. ordinary diagnostic hook、latency、retry counters和provider健康按L2处理；不扩写为第二套audit/observability系统。

## 6. Lifecycle Port 共同执行契约

### 6.1 Owner、文件与依赖方向

| contract family | trait/request/error owner | concrete implementation | domain truth owner | forbidden owner |
|---|---|---|---|---|
| establish | `crates/application/src/ports.rs` | `crates/infra/src/isolation_backend_adapters.rs` | boundary/handle/lease domain objects | `infra` trait declaration、entry/provider domain mutation |
| launch | `crates/application/src/ports.rs` | same-generation isolation adapter | `ControlledExecutionRun` | tools/runtime/member service |
| inspect | `crates/application/src/ports.rs` | lifecycle inspection adapter | handle/lease/orphan/cleanup owners | Query/projection/report |
| release | `crates/application/src/ports.rs` | isolation release adapter | cleanup/handle/lease/orphan/boundary owners | reaper/operator/entry direct call |

All traits are `Send + Sync`. Application signatures may reference `contracts`, `domain` and application-owned types, but never
`infra::IsolationBackendAdapterOutcome`, `InfraError`, provider SDK objects or concrete backend products.

### 6.2 External-call split

```text
validate fixed operation / channel / authority context / digest / idempotency key
  -> reservation-only UoW: claim_idempotency_reservation
  -> FreshReserved commit confirmed; freeze reservation ownership
  -> drop reservation UoW and all transaction handles
  -> only now load exact business owners + Version and allocate required business identities
  -> run pure guards/factories and freeze exact attempt/basis correlation
  -> preparation UoW: persist attempt/Preparing run/release basis + audit/recovery relation
  -> preparation commit confirmed
  -> drop UoW and all transaction handles
  -> fresh-read the persisted recovery point and reauthorize the exact request
  -> call exactly one lifecycle port method
  -> validate typed result against the frozen request
  -> finalization UoW: reload exact owners + fresh Version + persisted recovery point
  -> apply owner methods; stage audit/relay/stored result
  -> commit confirmed before returning fresh outcome
```

The reservation-only UoW and preparation UoW are distinct commits. A staged `FreshReserved` result is not execution permission;
business work starts only after reservation commit returns `Confirmed`. Existing/duplicate, `NotCommitted` and `StatusUnknown` branches
terminate or inspect at the reservation boundary and never allocate a run, capture, failure, boundary, release or attempt identity.

No external port method accepts a repository callback or `&mut dyn SandboxUnitOfWork`. A CAS conflict after the call invalidates the
old in-memory owner and old permit; application must inspect/reload exact correlation, not apply the result to latest owners.

### 6.3 Correlation 与 unknown总规则

| family | stable correlation before call | unknown recovery | forbidden replacement |
|---|---|---|---|
| establish | context + identity + pre-generated boundary + requirement + capability + generation | `inspect_environment_establishment` with same checked request | new boundary/requirement/capability target |
| launch | persisted Preparing run + `ControlledRunLaunchPermit` + prebound failure ref + backend handle + generation | `inspect_controlled_run_launch` with same run/handle correlation and same failure candidate | second run/capture/failure ref or tool payload |
| inspect | exact handle/backend target/lease/generation + inspection purpose | repeat read only under caller policy; no state claim without typed observation | latest-handle scan or query-derived target |
| release | persisted `CleanupReleaseBasis` including guard/audit/time/backend target/generation | environment inspect using same basis and backend target | new guard/basis, alternate backend target or blind release |

`InfraError::ExternalSideEffectCommitUnknown` is infra-internal. Concrete adapters map it exhaustively to the matching
application-owned port error without raw cause. Until typed inspection resolves the same correlation, application keeps the pre-call
recovery state and must not report Established, Running, Released, Completed, retryable success or definite absence.

### 6.4 Body-free与职责红线

Positive request/result/error fields may contain typed refs, checked requirements, permits, release basis, safe summaries, safe reasons,
generation, checked ages and trace context only. The following are structurally forbidden: command/tool body, argv, environment values,
stdout/stderr, file or artifact body, host/container/pod/process identity body, path, socket, endpoint, URL, credential, token, SDK response,
raw error, runtime agent action and member lifecycle instruction.

The ports establish and observe the Sandbox isolation boundary. They do not execute tool semantics, run an agent loop, orchestrate
members, own artifact truth, write an observability store, classify a core failure directly or close cleanup/context truth.

## 7. Isolation Environment Establishment Port

### 7.1 Capability 与 checked request

The establishment port applies one immutable ten-dimensional requirement set to the backend selected by one fresh capability snapshot.
Policy is deliberately absent: policy authorizes later launch and must not enlarge or weaken an environment boundary.

```rust
/// 冻结一次environment establishment的exact、body-free application request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EstablishIsolationEnvironmentRequest {
    /// exact accepted controlled execution context。
    context_ref: ControlledExecutionContextRef,
    /// exact active execution environment identity。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// application为本attempt预生成的coherent boundary identity。
    boundary_ref: CoherentBoundaryRef,
    /// backend必须逐项落实的immutable十维requirement object。
    requirements: BoundaryRequirementSet,
    /// call前通过hard guard的fresh capability snapshot identity。
    capability_ref: BackendCapabilitySummaryRef,
    /// capability snapshot绑定的exact isolation backend source。
    backend_ref: ExternalSourceRef,
    /// requirement、capability与backend source共用的canonical generation。
    generation_ref: ResourceRef,
    /// 原operation的body-free trace context；不属于幂等identity。
    trace_context: SandboxTraceContext,
}

impl EstablishIsolationEnvironmentRequest {
    /// 从accepted/active owner group和两个positive hard decisions冻结initial side-effect request。
    pub fn try_for_attempt(
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        coherence_decision: &BoundaryCoherenceDecision,
        capability_decision: &BackendCapabilityDecision,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, IsolationEnvironmentEstablishmentPortError>;

    /// 只替换diagnostic trace，保持全部side-effect correlation字段逐项不变。
    pub fn for_recovery_trace(
        &self,
        trace_context: SandboxTraceContext,
    ) -> Self;

    /// 返回accepted context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回active environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回本attempt预生成的boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回backend必须落实的immutable requirement object。
    pub fn requirements(&self) -> &BoundaryRequirementSet;
    /// 返回pre-call fresh capability ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回selected isolation backend source ref。
    pub fn backend_ref(&self) -> &ExternalSourceRef;
    /// 返回canonical generation ref。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回当前diagnostic trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 逐项比较application-owned result是否属于本request correlation。
    pub fn matches_result(
        &self,
        result: &IsolationEnvironmentEstablishmentResult,
    ) -> bool;
}
```

`try_for_attempt`的check顺序固定为：

1. context必须为`Accepted`，identity必须对该context为`Active`；两者refs与requirements owner refs相等。
2. requirements必须10/10 complete，`requirements.generation_ref()`等于显式generation source。
3. coherence decision的requirement ref相等且`is_coherent()`为true。
4. capability的assessed requirement、backend source version和generation相等，status为`Fresh`。
5. capability decision的requirement/capability refs相等且kind为`Supported`；
   `capability.supports_at_age(requirements, capability_decision.checked_age_millis())`必须为true。
6. `backend_ref`只从capability复制；boundary ref只从application预生成identity复制；provider没有字段回填权。

Request clone may be embedded in an operation-local recovery materialization, but it is not a new domain truth and has no independent
typed ref. `for_recovery_trace` must preserve equality of every field except trace; it cannot refresh capability, replace requirements or
change backend binding. Initial call requires the positive guard checks above. A later exact inspection consumes the already-frozen
request and does not reinterpret expired capability as permission for a new establishment side effect.

### 7.2 Trait 与 result

```rust
/// 对一个checked request建立环境，并支持同一correlation的无副作用结果检查。
pub trait IsolationEnvironmentEstablishmentPort: Send + Sync {
    /// 发起一次idempotent environment establishment side effect。
    async fn establish_environment(
        &self,
        request: &EstablishIsolationEnvironmentRequest,
    ) -> Result<
        IsolationEnvironmentEstablishmentResult,
        IsolationEnvironmentEstablishmentPortError,
    >;

    /// 检查同一request correlation的既有结果；本method不得创建environment。
    async fn inspect_environment_establishment(
        &self,
        request: &EstablishIsolationEnvironmentRequest,
    ) -> Result<
        IsolationEnvironmentEstablishmentResult,
        IsolationEnvironmentEstablishmentPortError,
    >;
}
```

Both methods return the Step 6 application-owned `IsolationEnvironmentEstablishmentResult`; the infra-private
`IsolationBackendAdapterOutcome` is created and consumed entirely inside the concrete adapter. The adapter freezes
`IsolationBackendEstablishmentCorrelation` from request getters, maps a typed provider result, calls `into_port_result`, and verifies
`request.matches_result(result)` before returning. It cannot expose the intermediate outcome or call a domain transition.

| disposition | descriptor / lease | reason | only allowed application route |
|---|---|---|---|
| `Established` | both `Some` | `None` | revalidate request/result; create checked handle + lease and established decision in outcome UoW |
| `BackendUnsupported` | both `None` | `Some` | record capability contradiction and fail/refresh; do not promote provider claim to capability truth |
| `Failed` with partial pair | both `Some` | `Some` | create matching `Created` partial handle and mandatory cleanup obligation; never activate/launch |
| `Failed` without partial pair | both `None` | `Some` | form honest failed decision without handle; no automatic backend switch |
| `Unavailable` | both `None` | `Some` | only typed proof that no environment side effect exists; no handle/lease and no weak fallback |

An inspection may return `Unavailable` only when the provider's typed idempotency/correlation lookup proves the environment was not
created. Inability to reach or classify the inspection API is an error and leaves the operation unknown; it is never this finite branch.

### 7.3 Closed port error

```rust
/// environment establishment request、adapter call或exact inspection的closed failure。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum IsolationEnvironmentEstablishmentPortError {
    /// request context不是`Accepted`。
    ContextWasNotAccepted {
        /// request构造时观察到的actual context status。
        actual: ControlledExecutionIntakeStatus,
    },
    /// environment identity不是matching context的`Active` identity。
    IdentityWasNotActiveForContext,
    /// requirement的context、identity、coverage或generation与attempt不一致。
    RequirementLineageInvalid,
    /// coherence decision不属于request requirement或不是`Coherent`。
    CoherenceDecisionInvalid {
        /// request构造时观察到的actual coherence decision kind。
        actual: BoundaryCoherenceDecisionKind,
    },
    /// capability snapshot不属于request requirement/backend/generation或不是`Fresh`。
    CapabilitySnapshotInvalid {
        /// request构造时观察到的actual capability status。
        actual: BackendCapabilitySummaryStatus,
    },
    /// capability decision不属于request snapshot或不是`Supported`。
    CapabilityDecisionInvalid {
        /// request构造时观察到的actual capability decision kind。
        actual: BackendCapabilityDecisionKind,
    },
    /// capability checked age已到期或十维不再全部supported。
    CapabilityNoLongerPermittedEstablishment,
    /// adapter在明确未调用provider前不可用；重试仍需重新验证request owner group。
    AdapterUnavailableBeforeCall {
        /// 不含endpoint、credential或provider message的caller-safe reason。
        reason: SandboxReason,
    },
    /// runtime assembly绑定了错误adapter/backend/generation。
    AdapterBindingInvalid {
        /// 不含config或provider正文的caller-safe reason。
        reason: SandboxReason,
    },
    /// typed finite outcome的descriptor/window/reason组合无效。
    OutcomeShapeInvalid,
    /// outcome或inspection result不属于exact request correlation。
    OutcomeCorrelationMismatch,
    /// provider result无法安全映射到四个finite disposition。
    OutcomeUnclassifiable {
        /// 固定或checked caller-safe reason；不得来自raw error Display。
        reason: SandboxReason,
    },
    /// adapter检测到禁止穿透的external body、path、credential或SDK object。
    ForbiddenExternalBody,
    /// side effect可能已发生，必须检查同一request；不得映射Failed/Unavailable或blind retry。
    ExternalSideEffectCommitUnknown {
        /// 固定caller-safe unknown reason，不含provider cause。
        reason: SandboxReason,
    },
    /// exact-correlation inspection当前不可达；operation仍为unknown。
    ExactInspectionUnavailable {
        /// caller-safe inspection availability reason。
        reason: SandboxReason,
    },
    /// configured adapter不支持exact-correlation inspection，禁止发起initial side effect。
    ExactInspectionUnsupported {
        /// caller-safe conformance reason。
        reason: SandboxReason,
    },
}
```

| error class | side effect knowledge | allowed recovery | forbidden |
|---|---|---|---|
| request/guard relation | call not started | rebuild only after exact owner re-read; usually fail current operation | call adapter anyway |
| `AdapterUnavailableBeforeCall` | proven not started | same operation may retry only after full revalidation and policy permits | report finite `Unavailable` result |
| shape/correlation/body | result untrusted | quarantine adapter result; preserve recovery point | apply partial fields or parse raw message |
| `ExternalSideEffectCommitUnknown` | may have started/committed | call `inspect_environment_establishment` with same frozen request | new boundary/ref/backend or second establish |
| exact inspection unavailable | still unknown | hold and retry inspection under bounded owner policy/manual containment | assume absent, Failed or Released |
| inspection unsupported | candidate non-conformant | block adapter activation before first side effect | best-effort establishment |

### 7.4 Owner transition and persistence handoff

The side-effect call occurs only after the idempotency reservation is independently commit-confirmed and the immutable requirement,
original correlation and audit recovery surface are then commit-confirmed in the preparation UoW. On a trusted finite result,
application reloads context/identity/requirement/capability and calls
`result.matches_attempt(...)` plus `request.matches_result(...)` before any factory. Established and partial-failure branches allocate or
reuse only refs pre-bound to the original operation; result data cannot choose local identities.

If outcome-UoW commit is unknown, application performs whole-group inspection across the original idempotency record, requirement,
decision/boundary/optional handle/lease, audit and stored surface. It does not call either establishment method until that inspection
proves the business group absent and the external inspection explicitly proves no environment exists. A stable partial descriptor is
never discarded, even if a later local transition fails; it remains a cleanup/security obligation.

## 8. Controlled Run Launch Port

### 8.1 Capability、correlation 与 checked request

The launch port starts only the Sandbox isolation-layer run lifecycle inside an already active handle. It does not receive a tool
invocation, command, runtime action, member instruction or runner payload. Those semantics remain outside Sandbox and cannot be smuggled
through an opaque map, string or provider extension field.

```rust
/// 冻结一次controlled run launch side effect的exact checked request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LaunchControlledRunRequest {
    /// exact committed Preparing run形成的短时launch permission。
    permit: ControlledRunLaunchPermit,
    /// committed `Preparing` run预绑定的唯一launch terminal failure candidate ref。
    launch_failure_ref: FailureClassificationRef,
    /// owning active handle保存的stable opaque backend environment source。
    backend_handle_ref: ExternalSourceRef,
    /// application clock在external call前计算的permit checked age。
    permit_checked_age_millis: u64,
    /// 原operation的body-free trace context。
    trace_context: SandboxTraceContext,
}

impl LaunchControlledRunRequest {
    /// 从committed launch permit与matching active handle构造initial call request。
    pub fn try_for_call(
        permit: &ControlledRunLaunchPermit,
        handle: &IsolationEnvironmentHandle,
        permit_checked_age_millis: u64,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 为unknown recovery替换trace；run/handle/generation与原checked age保持不变。
    pub fn for_recovery_trace(
        &self,
        trace_context: SandboxTraceContext,
    ) -> Self;

    /// 返回本request唯一授权的run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回本request唯一授权的accepted context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回本request唯一授权的active execution environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回本request唯一授权的boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回本request唯一授权的isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回本request唯一授权的lease ref。
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    /// 返回本request唯一授权的policy decision ref。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回本request唯一允许消费的launch terminal failure candidate ref。
    pub fn launch_failure_ref(&self) -> &FailureClassificationRef;
    /// 返回stable opaque backend environment source ref。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回run、handle、lease与policy共用的canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回call前checked permit age。
    pub fn permit_checked_age_millis(&self) -> u64;
    /// 返回exact group完成launch authorization的canonical time。
    pub fn permit_authorized_at(&self) -> &Timestamp;
    /// 返回current diagnostic trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 验证typed lifecycle observation属于本run/backend handle/generation。
    pub fn matches_observation(
        &self,
        observation: &ControlledRunLifecycleObservation,
    ) -> bool;

    /// 验证typed terminal failure source属于本request的完整failure lineage。
    pub fn matches_failure_source(
        &self,
        source: &ControlledRunLaunchFailureSource,
    ) -> bool;
}
```

`try_for_call` must verify `handle.handle_status() == Active`, permit handle/generation equal the handle, permit carries a non-colliding
`launch_failure_ref` copied from the committed `Preparing` run, backend handle source kind is
`IsolationBackend`, backend source version equals generation, and `permit.permits_backend_call_at_age(permit_checked_age_millis)` is
true. It does not reload policy, lease or boundary inside the adapter; those relations were revalidated by
`ControlledExecutionRun::authorize_launch` immediately before request construction.

The provider idempotency key is exactly `(run_ref, isolation_handle_ref, generation_ref)`. The application recovery correlation adds the
persisted `launch_failure_ref` as a mandatory collision-check field; it does not change provider key cardinality. Trace and checked age are
not key dimensions. A later call may carry a newly reauthorized permit only after exact inspection proved the same provider key was not
launched; it must reuse the same run/capture/failure identities and cannot switch handle/generation.

### 8.2 Launch result and inspection result

`ControlledRunLifecycleObservation` keeps its Step 6 canonical closed kinds `Launched | Completed`. The launch method has a separate
application-owned closed result: `Launched` carries the canonical observation, while `BackendLaunchFailed` carries a transient,
body-free terminal source that is immediately converted by the application into the existing Step 6
`SandboxFailureObservationKind::BackendLaunchFailed`. The launch port therefore cannot hide a terminal provider failure inside a
generic error. The launch inspection positive branch still accepts only `Launched`; `Completed` belongs to a later run lifecycle
observation and cannot skip `Preparing -> Running`.

```rust
/// 一次launch side effect的typed terminal failure source。
///
/// 这是application-owned transient carrier，不是`FailureClassification`、repository truth或第二套failure kind；它只能表达
/// `SandboxFailureObservationKind::BackendLaunchFailed`，并在fresh owner reload后被消费为Step 6 canonical observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledRunLaunchFailureSource {
    /// 本 source 唯一绑定的 accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// 本 source 唯一绑定的 active execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// 本 source 唯一绑定的 coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// 本 source 唯一绑定的 controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// 本 source唯一允许消费的prebound formal failure identity。
    launch_failure_ref: FailureClassificationRef,
    /// 本 source 唯一绑定的 Sandbox-local isolation handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// 本 source 唯一绑定的 isolation backend environment ref。
    backend_handle_ref: ExternalSourceRef,
    /// isolation backend 提供的 body-free failure summary ref。
    failure_summary_ref: SafeSummaryRef,
    /// adapter typed mapper 提供的 caller-safe failure reason。
    reason: SandboxReason,
    /// backend terminal failure 被观察到的时间。
    observed_at: Timestamp,
    /// 与run / handle共用的canonical generation。
    generation_ref: ResourceRef,
}

impl ControlledRunLaunchFailureSource {
    /// 从exact request构造唯一的`BackendLaunchFailed` source；不接受caller选择failure kind。
    pub fn backend_launch_failed(
        request: &LaunchControlledRunRequest,
        failure_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 返回source绑定的accepted context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回source绑定的active execution environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回source绑定的coherent boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回source绑定的controlled run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回本source唯一允许创建的formal failure classification ref。
    pub fn launch_failure_ref(&self) -> &FailureClassificationRef;
    /// 返回source绑定的Sandbox-local isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回source绑定的isolation backend handle ref。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回body-free terminal failure summary ref。
    pub fn failure_summary_ref(&self) -> &SafeSummaryRef;
    /// 返回typed mapper提供的caller-safe reason。
    pub fn reason(&self) -> &SandboxReason;
    /// 返回backend terminal observation time。
    pub fn observed_at(&self) -> &Timestamp;
    /// 返回canonical generation ref。
    pub fn generation_ref(&self) -> &ResourceRef;

    /// 在application完成fresh owner reload后构造Step 6 canonical failure observation。
    pub fn into_sandbox_failure_observation(
        self,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        run: &ControlledExecutionRun,
    ) -> Result<SandboxFailureObservation, FailureClassificationError>;
}

/// launch side effect允许交付给application的封闭finite result。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ControlledRunLaunchResult {
    /// backend明确确认same run / handle / generation已launch。
    Launched {
        /// matching canonical `Launched` lifecycle observation。
        observation: ControlledRunLifecycleObservation,
    },
    /// backend明确返回non-retryable launch terminal failure。
    BackendLaunchFailed {
        /// 只能由typed terminal mapper构造的failure source。
        source: ControlledRunLaunchFailureSource,
    },
}

/// launch side-effect finite result的封闭类别；只用于exhaustive mapper与collision comparison。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ControlledRunLaunchResultKind {
    /// matching backend launch confirmation。
    Launched,
    /// matching typed non-retryable backend launch failure。
    BackendLaunchFailed,
}

impl ControlledRunLaunchResult {
    /// 从matching `Launched` observation构造positive result。
    pub fn launched(
        request: &LaunchControlledRunRequest,
        observation: ControlledRunLifecycleObservation,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 从typed terminal source构造failure result。
    pub fn backend_launch_failed(
        request: &LaunchControlledRunRequest,
        failure_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 校验result属于exact request correlation及允许的launch result kind。
    pub fn validate_for_request(
        &self,
        request: &LaunchControlledRunRequest,
    ) -> Result<(), ControlledRunLaunchPortError>;

    /// 返回closed result kind；adapter mapper必须逐variant穷尽。
    pub fn result_kind(&self) -> ControlledRunLaunchResultKind;

    /// 返回positive `Launched` observation。
    pub fn lifecycle_observation(&self) -> Option<&ControlledRunLifecycleObservation>;
    /// 返回typed terminal failure source。
    pub fn failure_source(&self) -> Option<&ControlledRunLaunchFailureSource>;
}
```

`ControlledRunLaunchFailureSource::backend_launch_failed`必须复制request的context、identity、boundary、run、prebound failure、
local handle、backend handle和generation完整lineage，并验证failure summary的source kind为`IsolationBackend`、与backend source kind一致，且
`observed_at >= request.permit_authorized_at()`。它不能接收`SandboxFailureObservationKind`、failure kind、impact或run status
作为参数。`into_sandbox_failure_observation`只能在application fresh-read的context、identity、boundary、handle和run全部与
source/request相等时调用，并固定传入`BackendLaunchFailed`；任何`FailureClassificationError`都在owner flow内作为完整性错误
处理，不得降级成run failure或generic success。

`ControlledRunLaunchResult::launched`复用request correlation validation；`backend_launch_failed`只接受上述terminal source。
`Completed` observation、非matching source或failure ref、summary/source mismatch、时间倒退和任何缺失字段都返回typed port error。该
result是transient，不持久化为第二类run status；application随后用`FailureSourceMarker::from_observation`、
`FailureClassification::classify(request.launch_failure_ref(), ...)`和`require_run_failure_basis`形成唯一failure owner truth。

```rust
/// exact launch correlation inspection的有限transient disposition；不是run lifecycle status。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ControlledRunLaunchInspectionDisposition {
    /// backend返回matching `Launched` lifecycle observation。
    Launched,
    /// backend明确证明same key已形成typed non-retryable launch terminal failure。
    BackendLaunchFailed,
    /// backend明确证明same key尚未launch；可由application重新验证permit后决定是否重试。
    NotLaunched,
    /// inspection source当前不可达，不能证明已launch或未launch。
    Unavailable,
    /// provider inspection与same run/handle/generation correlation冲突。
    Conflicted,
}

/// 对同一run launch correlation的body-free checked inspection result。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledRunLaunchInspectionResult {
    /// exact inspected run ref。
    run_ref: ControlledExecutionRunRef,
    /// exact inspected `Preparing` run预绑定的launch terminal failure candidate ref。
    launch_failure_ref: FailureClassificationRef,
    /// exact inspected isolation handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// exact stable backend environment source ref。
    backend_handle_ref: ExternalSourceRef,
    /// exact correlation generation。
    generation_ref: ResourceRef,
    /// finite inspection disposition。
    disposition: ControlledRunLaunchInspectionDisposition,
    /// `Launched`唯一允许的canonical lifecycle observation。
    lifecycle_observation: Option<ControlledRunLifecycleObservation>,
    /// `BackendLaunchFailed`分支唯一允许的typed terminal source。
    failure_source: Option<ControlledRunLaunchFailureSource>,
    /// `NotLaunched | Unavailable | Conflicted`分支必有的body-free inspection summary。
    inspection_summary_ref: Option<SafeSummaryRef>,
    /// `NotLaunched | Unavailable | Conflicted`分支必有的caller-safe reason。
    reason: Option<SandboxReason>,
    /// typed inspection完成的application clock time。
    observed_at: Timestamp,
}

impl ControlledRunLaunchInspectionResult {
    /// 从matching `Launched` observation构造positive inspection result。
    pub fn launched(
        request: &LaunchControlledRunRequest,
        observation: ControlledRunLifecycleObservation,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 构造same key已经形成typed terminal launch failure的inspection result。
    pub fn backend_launch_failed(
        request: &LaunchControlledRunRequest,
        failure_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 构造typed proof确认same correlation没有launch side effect。
    pub fn not_launched(
        request: &LaunchControlledRunRequest,
        inspection_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 构造inspection source当前不可达的保守结果。
    pub fn unavailable(
        request: &LaunchControlledRunRequest,
        inspection_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 构造same correlation与provider lifecycle冲突的保守结果。
    pub fn conflicted(
        request: &LaunchControlledRunRequest,
        inspection_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ControlledRunLaunchPortError>;

    /// 校验inspection result的完整correlation、field cardinality、source kind和timestamp。
    pub fn validate_for_request(
        &self,
        request: &LaunchControlledRunRequest,
    ) -> Result<(), ControlledRunLaunchPortError>;

    /// 返回finite inspection disposition。
    pub fn disposition(&self) -> ControlledRunLaunchInspectionDisposition;
    /// 返回inspection唯一允许消费的prebound failure identity。
    pub fn launch_failure_ref(&self) -> &FailureClassificationRef;
    /// 返回`Launched` canonical observation。
    pub fn lifecycle_observation(&self) -> Option<&ControlledRunLifecycleObservation>;
    /// 返回`BackendLaunchFailed` typed terminal source。
    pub fn failure_source(&self) -> Option<&ControlledRunLaunchFailureSource>;
    /// 返回non-launched inspection summary ref。
    pub fn inspection_summary_ref(&self) -> Option<&SafeSummaryRef>;
    /// 返回non-launched caller-safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回typed inspection time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 消费positive result；其它disposition返回typed port error且不构造run truth。
    pub fn into_launched_observation(
        self,
    ) -> Result<ControlledRunLifecycleObservation, ControlledRunLaunchPortError>;

    /// 消费`BackendLaunchFailed` inspection result并返回其typed terminal source。
    pub fn into_failure_source(
        self,
    ) -> Result<ControlledRunLaunchFailureSource, ControlledRunLaunchPortError>;

    /// 将同一correlation的`Conflicted` inspection转换为Step 6 canonical failure observation。
    ///
    /// 该方法只接受`Conflicted`；`NotLaunched`和`Unavailable`仍是严格恢复状态，不能形成failure truth。
    pub fn into_conflict_failure_observation(
        self,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        run: &ControlledExecutionRun,
    ) -> Result<SandboxFailureObservation, FailureClassificationError>;
}
```

| disposition | lifecycle observation | failure source | summary / reason | owner action |
|---|---|---|---|---|
| `Launched` | `Some(kind=Launched)` | `None` | both `None` | reload Preparing run and call `mark_running` with matching permit/correlation |
| `BackendLaunchFailed` | `None` | `Some(BackendLaunchFailed)` | both `None` outside source | consume source through canonical failure owner flow; never retry launch |
| `NotLaunched` | `None` | `None` | both `Some` | keep run Preparing; only after full revalidation may retry same key |
| `Unavailable` | `None` | `None` | both `Some` | keep launch unknown/strict hold; do not retry or fail from absence |
| `Conflicted` | `None` | `None` | both `Some` | fresh-read owners, call `into_conflict_failure_observation`, then form formal failure/containment input; do not apply raw inspection result |

All inspection constructors copy `request.launch_failure_ref()` exactly. All summary refs must have source kind `IsolationBackend`;
backend handle source version and explicit generation must match. A
`Completed` observation in `launched(...)`, an observation outside `Launched`, a failure source outside `BackendLaunchFailed`, or any
disposition/field cardinality mismatch is an `InspectionShapeInvalid` error.

`into_conflict_failure_observation` must verify the fresh context, identity, boundary, handle and `Preparing` run against the stored
request correlation, including `run.require_prebound_launch_failure_ref() == self.launch_failure_ref()`, then call
`SandboxFailureObservation::try_for_run` with the inspection backend source, summary, reason, time and
the fixed `SandboxFailureObservationKind::BackendLifecycleConflicted`. It has no caller-selected kind and no wildcard. A technical
inspection error, `NotLaunched` or `Unavailable` cannot call this method and cannot form a stable failure marker.

### 8.3 Trait 与 closed error

```rust
/// 启动一个已提交Preparing run，并检查同一idempotent launch correlation。
pub trait ControlledRunLaunchPort: Send + Sync {
    /// 发起Sandbox isolation-layer run launch；finite result只能是matching `Launched`或typed `BackendLaunchFailed`。
    async fn launch_controlled_run(
        &self,
        request: &LaunchControlledRunRequest,
    ) -> Result<ControlledRunLaunchResult, ControlledRunLaunchPortError>;

    /// 无副作用检查same run/handle/generation launch correlation。
    async fn inspect_controlled_run_launch(
        &self,
        request: &LaunchControlledRunRequest,
    ) -> Result<ControlledRunLaunchInspectionResult, ControlledRunLaunchPortError>;
}

/// controlled run launch request、observation或same-key inspection的closed failure。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ControlledRunLaunchPortError {
    /// launch permit与target handle、lease、policy或generation relation不一致。
    LaunchPermitLineageInvalid,
    /// permit未携带committed `Preparing` run的prebound launch failure identity，或该identity发生typed collision。
    LaunchFailureIdentityInvalid,
    /// owning isolation handle不是`Active`。
    HandleWasNotActive {
        /// request构造时观察到的actual handle status。
        actual: IsolationEnvironmentHandleStatus,
    },
    /// backend handle不是matching isolation source/generation。
    BackendHandleRelationInvalid,
    /// external call前permit checked age已到effective validity window。
    LaunchPermitExpired,
    /// adapter在明确未调用provider前不可用。
    AdapterUnavailableBeforeCall {
        /// caller-safe availability reason。
        reason: SandboxReason,
    },
    /// runtime assembly绑定错误adapter、backend handle或generation。
    AdapterBindingInvalid {
        /// caller-safe binding reason。
        reason: SandboxReason,
    },
    /// launch observation不属于same run/backend handle/generation。
    ObservationCorrelationMismatch,
    /// launch success返回了非`Launched` canonical observation。
    ObservationKindInvalid {
        /// adapter实际返回的canonical observation kind。
        actual: ControlledRunLifecycleObservationKind,
    },
    /// terminal failure source的context/run/boundary/handle/backend/generation/failure-ref不属于exact request。
    TerminalFailureSourceCorrelationMismatch,
    /// terminal failure summary与backend source kind不是matching `IsolationBackend`。
    TerminalFailureSourceKindInvalid,
    /// terminal failure source缺少summary/reason，或其字段组合不能形成canonical observation。
    TerminalFailureSourceFieldRelationInvalid,
    /// terminal failure observation time早于permit authorization或不满足canonical timestamp contract。
    TerminalFailureSourceTimestampInvalid,
    /// same provider key返回了两个不同finite result kinds，或同kind的immutable字段发生碰撞。
    LaunchResultCollision {
        /// 已有可信result的closed kind。
        existing: ControlledRunLaunchResultKind,
        /// incoming result的closed kind。
        incoming: ControlledRunLaunchResultKind,
    },
    /// duplicate same-kind result的observation/source fields不逐项相等。
    DuplicateLaunchResultFieldMismatch {
        /// 发生字段差异的closed result kind。
        result_kind: ControlledRunLaunchResultKind,
    },
    /// inspection的run/handle/backend/generation/failure-ref不属于exact request correlation。
    InspectionCorrelationMismatch,
    /// inspection result的disposition、observation、summary或reason组合无效。
    InspectionShapeInvalid {
        /// shape无效的finite inspection disposition。
        disposition: ControlledRunLaunchInspectionDisposition,
    },
    /// inspection disposition与observation/failure source/summary source-kind之间的映射不成立。
    InspectionSourceRelationInvalid {
        /// source relation无法成立的finite inspection disposition。
        disposition: ControlledRunLaunchInspectionDisposition,
    },
    /// inspection observation time早于permit authorization或不满足canonical timestamp contract。
    InspectionTimestampInvalid,
    /// provider response或inspection无法安全映射到closed typed result。
    OutcomeUnclassifiable {
        /// caller-safe classification reason。
        reason: SandboxReason,
    },
    /// adapter检测到command/tool/runtime/member/SDK/raw body泄漏。
    ForbiddenExternalBody,
    /// launch side effect可能已发生；必须inspect same correlation，禁止blind retry。
    ExternalSideEffectCommitUnknown {
        /// caller-safe unknown reason。
        reason: SandboxReason,
    },
    /// exact launch inspection本身无法形成可信finite result。
    ExactInspectionFailed {
        /// caller-safe inspection reason。
        reason: SandboxReason,
    },
    /// adapter不支持same-correlation inspection，禁止激活launch capability。
    ExactInspectionUnsupported {
        /// caller-safe conformance reason。
        reason: SandboxReason,
    },
}
```

The concrete adapter must provide idempotency for the exact provider key. A repeated call for the same key may return only the same
finite result with field-for-field equal observation/source; it must not start a second backend execution. Different result kind maps to
`LaunchResultCollision`; same kind with different immutable fields maps to `DuplicateLaunchResultFieldMismatch`. Different handle,
generation or application recovery failure ref for the same run maps to the matching correlation/identity error, never a new attempt.
If the adapter cannot guarantee idempotency plus inspection, runtime assembly marks the launch slot non-conformant before any real launch.

The provider mapper and duplicate comparator are exhaustive over `ControlledRunLaunchResultKind::{Launched,
BackendLaunchFailed}` and `ControlledRunLaunchInspectionDisposition::{Launched, BackendLaunchFailed, NotLaunched, Unavailable,
Conflicted}`. A wildcard arm, unknown-as-unavailable branch, string classification or fallback success is forbidden. Error mapping is:

| detected condition | exact port error | side-effect/failure meaning |
|---|---|---|
| request permit/prebound ref invalid before call | `LaunchFailureIdentityInvalid` | call not started; no allocator retry in current operation |
| terminal source lineage/failure ref mismatch | `TerminalFailureSourceCorrelationMismatch` | result untrusted; no classification/run transition |
| terminal source or summary wrong source kind | `TerminalFailureSourceKindInvalid` | quarantine mapper output |
| terminal source missing/invalid finite fields | `TerminalFailureSourceFieldRelationInvalid` | no generic failure truth |
| terminal source time invalid | `TerminalFailureSourceTimestampInvalid` | no classification |
| duplicate kind collision | `LaunchResultCollision` | preserve original recovery point; consistency hold |
| duplicate same-kind field mismatch | `DuplicateLaunchResultFieldMismatch` | preserve original result; no last-write-wins |
| inspection correlation/failure ref mismatch | `InspectionCorrelationMismatch` | inspection untrusted; launch remains unknown |
| inspection cardinality invalid | `InspectionShapeInvalid` | no owner transition |
| inspection source-kind/result-kind mismatch | `InspectionSourceRelationInvalid` | no failure/absence inference |
| inspection time invalid | `InspectionTimestampInvalid` | no owner transition |
| timeout/transport/process interruption after possible call | `ExternalSideEffectCommitUnknown` | inspect exact same correlation; no terminal classification |
| inspection technical/unavailable | `ExactInspectionFailed` | strict hold; not `Unavailable` finite result unless typed mapper produced it |

### 8.4 Owner transition and failure handoff

After a committed reservation grants fresh execution ownership, launch uses two business transactions separated by the external call.
Thus a fresh end-to-end launch has three committed UoWs: reservation-only, run preparation and finalization. It never holds a UoW across
the external await, and it never lets an adapter call a run transition:

```text
validate fixed operation / channel / authority context / digest / idempotency key
  -> reservation-only UoW: claim_idempotency_reservation
  -> FreshReserved commit confirmed; drop reservation UoW
  -> only now load exact context / identity / boundary / handle / lease / policy owners
  -> allocate run / capture / launch-failure refs exactly once
  -> ControlledRunIdentityBundle::try_from_generated(...)
  -> ControlledExecutionRun::prepare(...) with prebound launch-failure ref
  -> preparation UoW: create Preparing run + capture relation + launch recovery/audit relation
  -> preparation commit confirmed; drop every UoW and transaction handle
  -> fresh-read exact Preparing run group + active handle/lease/policy + committed reservation
  -> read run.prebound_launch_failure_ref and authorize_launch(...)
  -> construct LaunchControlledRunRequest with permit.launch_failure_ref
  -> launch_controlled_run(request)
  -> validate result against request and closed result/source map
  -> fresh-read exact run group and all required recovery members
  -> finalization UoW: apply exactly one owner branch below; stage audit/failure/stored relation
  -> commit confirmed before returning the fresh application outcome
```

The five finite/recovery branches are mutually exclusive:

| branch | post-call proof | UoW-B exact order | resulting owner truth | retry rule |
|---|---|---|---|---|
| `Launched` | `ControlledRunLaunchResult::Launched`; observation and permit lineage exact; run still `Preparing`; prebound ref still same | reload run -> validate permit/ref/time -> `run.mark_running(...)` -> save run -> stage required audit/stored surface -> commit | `Preparing -> Running`; prebound failure ref becomes `None`; no `FailureClassification` is created | no launch retry; duplicate calls replay same observation only |
| `BackendLaunchFailed` | typed source kind, timestamp, summary and all refs exact; source ref equals run prebound ref | reload run -> build `SandboxFailureObservation::try_for_run` -> `FailureSourceMarker::from_observation` -> `FailureSourceMarkerSet::try_for_context` -> `FailureClassification::classify(run.prebound_launch_failure_ref(), markers, ...)` -> `require_run_failure_basis` -> `run.mark_failed(...)` -> create failure + save run + audit/stored relation -> commit | run `Preparing -> Failed`; classification remains canonical `Classified`; `run.terminal_basis = Failure(same prebound ref)`; no second failure ref | terminal run branch; never call launch again |
| `NotLaunched` | exact inspection proves same provider key has no launch side effect; run remains `Preparing` and prebound ref unchanged | no business transition; record only bounded recovery observation if current operation requires it; commit only a diagnostic/recovery update explicitly included in frozen group | `Preparing`; failure candidate remains available | reauthorize exact same run/handle/generation before reusing same key; no new refs |
| `Unavailable` | typed finite provider proof says lookup unavailable/unknown according to closed inspection contract, not transport error; prebound ref unchanged | strict hold; no run/failure/idempotency terminal transition; preserve original recovery group | `Preparing` with unknown external effect | no blind retry; bounded inspection/manual containment only |
| `Conflicted` | same-key inspection returns typed conflict; no raw provider status is trusted | reload exact owners -> `into_conflict_failure_observation` -> formal failure/control/redline owner wins by its own checked basis -> save affected owners and audit/recovery relation -> commit | canonical conflict truth; if failure owner wins, `Preparing -> Failed`; if control/redline wins, `Preparing -> Terminated` | no launch retry until a new checked owner flow explicitly authorizes it |

`Unavailable` in the table is a finite result only when the adapter's typed inspection contract proves that exact semantic. A timeout,
connection reset, process interruption, `ExternalSideEffectCommitUnknown`, malformed source, or unavailable inspection API remains a port
error and preserves strict unknown; it never enters the `Unavailable` row.

The `BackendLaunchFailed` path must use the ref read from the fresh committed run, not the transient request alone. If the fresh run is no
longer `Preparing`, the prebound ref is missing, or any classification/ref relation differs, UoW-B is rejected and the result is an
integrity hold. `FailureClassification::classify` is called only for this terminal branch; successful `Launched` and typed `NotLaunched`
paths do not create `PendingInput` facts. This branch does not call `FailureClassification::mark_terminal`: Step 6 permits
`require_run_failure_basis` directly from `Classified`, and the terminal state here belongs to the run (`Failed`), not to a fabricated
classification transition. If the failure UoW commit is `StatusUnknown`, whole-group inspection compares the original run,
the exact prebound ref, classification ref, terminal basis, audit and stored relation. It does not allocate another failure ref, rebuild a
missing surface, or call launch again.

If the launch call or result is unknown, the application calls `inspect_controlled_run_launch` with the same request correlation. An
inspection result is first validated for `(run_ref, isolation_handle_ref, backend_handle_ref, generation_ref, launch_failure_ref)` and
then mapped: `Launched` follows the first branch, `BackendLaunchFailed` follows the second, `NotLaunched` follows the third,
`Unavailable` follows the fourth, and `Conflicted` follows the fifth. No result is applied to a latest run, alternate handle, or newly
allocated capture/failure identity.

## 9. Isolation Environment Lifecycle Inspection Port

### 9.1 Closed purpose 与 exact request

Lifecycle inspection is read-only and never grants release permission. Its request carries the full Sandbox lineage because a stable
backend source alone cannot distinguish an expired-lease inspection, recovery of one persisted release authorization, or a fresh
inspection after a definitive failed authorization. The purpose is a closed application value, not a provider action string.

```rust
/// environment lifecycle inspection唯一允许的application purpose。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum IsolationEnvironmentLifecycleInspectionPurpose {
    /// expired lease或existing lifecycle conflict的reaper/orphan inspection。
    LeaseOrphanInspection {
        /// lease owner形成并提交的exact eligibility marker。
        reaper_marker: ReaperEligibilityMarker,
        /// existing incident存在时的exact orphan attempt；不得扫描latest incident。
        orphan_record_ref: Option<OrphanRecoveryRecordRef>,
    },
    /// 对一个仍active的persisted cleanup release authorization做same-target recovery inspection。
    AuthorizedReleaseRecovery {
        /// guard row中读取的immutable authorization proof。
        release_basis: CleanupReleaseBasis,
    },
    /// definitive failure终结旧authorization后，为新guard取得fresh same-target observation。
    DefinitiveReleaseFailureRecovery {
        /// immediately preceding blocked guard保存的terminal failure proof。
        prior_failure_basis: CleanupReleaseFailureBasis,
    },
}

/// 冻结一次无副作用environment lifecycle inspection的exact application request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InspectIsolationEnvironmentLifecycleRequest {
    /// exact controlled execution context。
    context_ref: ControlledExecutionContextRef,
    /// exact execution environment identity。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// exact coherent boundary。
    boundary_ref: CoherentBoundaryRef,
    /// exact Sandbox-local isolation handle。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// handle预绑定的lease identity；无persisted row的partial handle也必须保留。
    prebound_lease_ref: LeaseRecordRef,
    /// 当前purpose实际读取到的persisted lease row；partial handle为`None`。
    persisted_lease_ref: Option<LeaseRecordRef>,
    /// purpose绑定的existing orphan attempt；fresh recovery不得在此生成new attempt。
    orphan_record_ref: Option<OrphanRecoveryRecordRef>,
    /// exact stable isolation backend environment source。
    backend_handle_ref: ExternalSourceRef,
    /// handle、backend source、lease与purpose proof共用的canonical generation。
    generation_ref: ResourceRef,
    /// closed inspection purpose及其checked proof。
    purpose: IsolationEnvironmentLifecycleInspectionPurpose,
    /// body-free diagnostic trace；不参与target identity。
    trace_context: SandboxTraceContext,
}

impl InspectIsolationEnvironmentLifecycleRequest {
    /// 从expired/conflicted lease owner group和committed reaper marker构造inspection request。
    pub fn try_for_lease_orphan(
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        lease: &LeaseRecord,
        reaper_marker: &ReaperEligibilityMarker,
        orphan: Option<&OrphanRecoveryRecord>,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, IsolationEnvironmentLifecycleInspectionPortError>;

    /// 从仍active的persisted release basis和matching ReleasePending owner group构造recovery request。
    pub fn try_for_authorized_release_recovery(
        cleanup: &CleanupGuard,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        lease: Option<&LeaseRecord>,
        orphan: Option<&OrphanRecoveryRecord>,
        release_basis: &CleanupReleaseBasis,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, IsolationEnvironmentLifecycleInspectionPortError>;

    /// 从旧blocked authorization和fresh current owner group构造definitive-failure recovery inspection。
    pub fn try_for_definitive_release_failure_recovery(
        prior_cleanup: &CleanupGuard,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        lease: Option<&LeaseRecord>,
        prior_orphan: Option<&OrphanRecoveryRecord>,
        prior_failure_basis: &CleanupReleaseFailureBasis,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, IsolationEnvironmentLifecycleInspectionPortError>;

    /// 只替换diagnostic trace；全部target、purpose与proof逐项保持不变。
    pub fn for_recovery_trace(&self, trace_context: SandboxTraceContext) -> Self;

    /// 返回exact context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回exact environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回exact boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回exact isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回handle预绑定lease ref。
    pub fn prebound_lease_ref(&self) -> &LeaseRecordRef;
    /// 返回optional persisted lease row ref。
    pub fn persisted_lease_ref(&self) -> Option<&LeaseRecordRef>;
    /// 返回purpose绑定的optional existing orphan attempt。
    pub fn orphan_record_ref(&self) -> Option<&OrphanRecoveryRecordRef>;
    /// 返回stable backend environment source。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回closed inspection purpose。
    pub fn purpose(&self) -> &IsolationEnvironmentLifecycleInspectionPurpose;
    /// 返回body-free diagnostic trace。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 对port返回的canonical observation执行target、generation、kind/time关系检查。
    pub fn validate_observation(
        &self,
        observation: &IsolationEnvironmentLifecycleObservation,
    ) -> Result<(), IsolationEnvironmentLifecycleInspectionPortError>;
}
```

All three factories verify context/identity/boundary/handle lineage field by field, require the backend source kind to be
`IsolationBackend`, and require `backend_handle_ref.source_version_ref() == generation_ref`. The persisted lease cardinality and orphan
cardinality are purpose-owned, not caller-selected:

| purpose | handle / lease position | proof relation | observation lower bound |
|---|---|---|---|
| `LeaseOrphanInspection` | handle `Active | OrphanSuspected`; matching persisted lease is not `Released` | marker lease/handle/generation equals owners; optional orphan equals the exact current incident and is nonterminal | `observed_at >= marker.marked_at` |
| `AuthorizedReleaseRecovery` | handle `ReleasePending`; lease row presence equals basis; optional orphan is matching `Recovering` | cleanup still stores the exact basis, has no completion/failure basis, and remains the same active authorization | `observed_at >= basis.authorized_at` |
| `DefinitiveReleaseFailureRecovery` | handle remains `ReleasePending`; lease/orphan presence equals old basis | old cleanup is `Blocked`, stores exactly the supplied failure basis, and optional old orphan is terminal `Failed`; no new guard/orphan is created | `observed_at > prior failure observation time` |

`try_for_lease_orphan` accepts a lifecycle-conflict marker only when its lease owner position permits the marker; it does not parse the
marker reason. A release basis with `lease_record_present=false` still retains `prebound_lease_ref`, while `persisted_lease_ref=None`.
This distinction prevents partial-handle recovery from inventing a lease row or dropping its pre-bound identity.

### 9.2 Trait、canonical result 与唯一 summary mapper

```rust
/// 对一个exact isolation environment执行无副作用lifecycle inspection。
pub trait IsolationEnvironmentLifecycleInspectionPort: Send + Sync {
    /// 返回same target的canonical finite observation；本method不得establish、launch或release。
    async fn inspect_environment_lifecycle(
        &self,
        request: &InspectIsolationEnvironmentLifecycleRequest,
    ) -> Result<
        IsolationEnvironmentLifecycleObservation,
        IsolationEnvironmentLifecycleInspectionPortError,
    >;
}

/// 将canonical handle observation唯一映射为cleanup/reaper使用的body-free summary。
pub fn map_backend_lifecycle_summary(
    observation: &IsolationEnvironmentLifecycleObservation,
) -> Result<BackendLifecycleSummary, BackendLifecycleSummaryError>;
```

The mapper has no alternative input and performs this exhaustive mapping without a wildcard:

| canonical observation kind | `BackendLifecycleObservationKind` |
|---|---|
| `ObservedPresent` | `Present` |
| `ReleaseConfirmed` | `Released` |
| `Unavailable` | `Unavailable` |
| `Conflicted` | `Conflicted` |

It copies the exact backend handle, observation summary, generation, reason and observed time. Therefore the lifecycle observation and
`BackendLifecycleSummary` produced for one call must be equal in all shared fields; adapters, services, fakes and event consumers may not
perform a second backend read or construct a summary from different data. `BackendLifecycleSummaryError` remains the canonical mapper
failure type; no application `Other` or raw provider fallback is added.

`Unavailable` is a trusted finite observation that the lifecycle source is currently unable to determine presence/release. A transport
timeout, connection reset, malformed SDK result or missing inspection capability is a port error, not a fabricated `Unavailable`
observation. In all cases inspection itself has side-effect budget zero.

### 9.3 Purpose-specific application routing

| purpose + observation | only allowed route | forbidden claim |
|---|---|---|
| lease/orphan + `ObservedPresent` | map one summary; after fresh Version reload, evaluate expired lease/orphan suspicion and exact incident | release, cleanup completion, runtime failure |
| lease/orphan + `Unavailable` | after fresh owner reload, exact expired-owner proof may keep or form the same incident at `Suspected`; otherwise preserve current truth and report bounded degraded inspection | advance to `Confirmed`, infer absence/release, or bypass lease/orphan owner methods |
| lease/orphan + `Conflicted` | map one summary; route through exact orphan/failure/containment owner proof | direct `Failed` or generic adapter failure |
| lease/orphan + `ReleaseConfirmed` | route to reconciliation/guarded-cleanup input; do not mutate owners from reaper path | direct handle/lease/orphan `Released | Recovered` |
| authorized release + `ReleaseConfirmed` | fresh-read release owner group and form matching completion basis | completion from status/bool or stale redline coverage |
| authorized release + `ObservedPresent | Unavailable` | preserve same authorization and `ReleasePending/Recovering`; inspect or idempotent release only under bounded owner policy | new basis, fallback backend, completed/failed |
| authorized release + `Conflicted` | use the closed result factory in §10.3 to form same-authorization `BackendLifecycleConflict` failure observation | caller-selected failure kind or reason parsing |
| definitive-failure recovery + `ObservedPresent | Unavailable | Conflicted` | map fresh summary for a new cleanup evaluation; `Unavailable` forces pending evidence | reopen old guard/orphan or copy old authorization |
| definitive-failure recovery + `ReleaseConfirmed` | late-confirmation reconciliation against the old attempt | create new guard evidence or silently overwrite old failure |

For `LeaseOrphanInspection`, `Unavailable` is evidence only that lifecycle presence cannot currently be decided. It may participate in
`LeaseRecord::mark_orphan_suspected` and `OrphanRecoveryRecord::suspect` only when the same fresh UoW proves the exact lease is already
expired, the marker still matches `(lease, handle, generation)`, and no different incident won the race. It cannot call `confirm`, because
confirmation requires a matching `Present | Conflicted` summary. The read-only port itself never creates or preserves an incident; those
effects remain application/domain owner transitions guarded by fresh `Version`s.

### 9.4 Closed inspection error

```rust
/// lifecycle inspection request、binding、canonical observation或mapping的closed failure。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum IsolationEnvironmentLifecycleInspectionPortError {
    /// context、identity、boundary、handle或generation owner relation不一致。
    TargetLineageInvalid,
    /// current handle status不允许该inspection purpose。
    HandleStatusNotInspectable {
        /// request factory读取的actual handle status。
        actual: IsolationEnvironmentHandleStatus,
    },
    /// persisted lease存在性、ref、status或pre-bound ref与purpose proof不一致。
    LeaseRelationInvalid,
    /// reaper marker未绑定exact lease/handle/generation或owner position不支持该marker。
    ReaperMarkerRelationInvalid,
    /// optional existing orphan不属于exact lease/handle/generation/incident或status不适用。
    OrphanAttemptRelationInvalid,
    /// active recovery没有从guard读取同一persisted release basis。
    ReleaseAuthorizationNotCurrent,
    /// definitive-failure recovery没有绑定immediately preceding blocked guard和exact failure basis。
    PriorReleaseFailureRelationInvalid,
    /// backend source kind/version与exact handle/generation不一致。
    BackendTargetRelationInvalid,
    /// purpose payload与request common correlation字段不一致。
    PurposeCorrelationInvalid,
    /// runtime assembly绑定了错误backend target或generation adapter。
    AdapterBindingInvalid {
        /// caller-safe binding reason。
        reason: SandboxReason,
    },
    /// inspection dependency当前不可达，不能形成canonical observation。
    ExactInspectionUnavailable {
        /// caller-safe dependency reason；不得来自raw error Display。
        reason: SandboxReason,
    },
    /// configured adapter不支持exact target inspection，相关lifecycle capability不可激活。
    ExactInspectionUnsupported {
        /// caller-safe conformance reason。
        reason: SandboxReason,
    },
    /// provider result不能穷尽映射为四类canonical lifecycle observation。
    ObservationUnclassifiable {
        /// caller-safe classification reason。
        reason: SandboxReason,
    },
    /// canonical observation backend source或generation不属于request。
    ObservationCorrelationMismatch,
    /// canonical observation time早于purpose proof要求的下界。
    ObservationTimeInvalid,
    /// adapter检测到SDK/raw response、path、credential、process或其它forbidden body。
    ForbiddenExternalBody,
}
```

Inspection errors never authorize a state transition. Because the method is read-only, bounded retry may repeat the same request after
the technical dependency recovers, but it cannot replace target/purpose proof or synthesize a newer observation time. A correlation,
shape or body error quarantines the adapter result and preserves current Sandbox truth.

### 9.5 Owner/UoW 与 fake parity

Application loads the exact owner group and `Version`, freezes the request, drops UoW, performs one inspection, validates the observation,
and invokes the unique mapper before opening a fresh mutation UoW. The fresh UoW reloads every affected owner and rejects stale request
relations. The port and mapper allocate no Sandbox identity, do not reserve idempotency on their own, and write no audit/repository row.

The durable and fake adapters must expose the same four observation kinds and the same error distinctions. Fake behavior is keyed by the
full `(context, identity, boundary, handle, prebound lease, optional persisted lease, optional orphan, backend handle, generation,
purpose proof)` correlation. It may not key by handle string alone, default unknown to `ReleaseConfirmed`, omit observation times, or
create an orphan/release side effect while serving inspection.

## 10. Guarded Isolation Environment Release Port

### 10.1 Persisted authorization request

The release port does not evaluate cleanup safety. It consumes one `CleanupReleaseBasis` already persisted in the owning guard row and
can target only the backend source frozen in that basis. The request embeds the complete basis rather than a handle ref plus caller bool,
so crash recovery can reconstruct exactly the same operation without recalculating `Allowed`.

```rust
/// 冻结一个已提交cleanup authorization对应的exact guarded release request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReleaseIsolationEnvironmentRequest {
    /// guard row中读取并逐项重验的immutable release authorization。
    release_basis: CleanupReleaseBasis,
    /// body-free diagnostic trace；不参与authorization或idempotency identity。
    trace_context: SandboxTraceContext,
}

impl ReleaseIsolationEnvironmentRequest {
    /// 从persisted authorization与matching current owner group构造release call request。
    pub fn try_from_persisted_authorization(
        cleanup: &CleanupGuard,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        lease: Option<&LeaseRecord>,
        orphan: Option<&OrphanRecoveryRecord>,
        release_basis: &CleanupReleaseBasis,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, GuardedIsolationEnvironmentReleasePortError>;

    /// 只替换diagnostic trace；persisted authorization逐字段保持不变。
    pub fn for_recovery_trace(&self, trace_context: SandboxTraceContext) -> Self;

    /// 返回完整persisted release authorization。
    pub fn release_basis(&self) -> &CleanupReleaseBasis;
    /// 返回owning cleanup guard ref。
    pub fn cleanup_guard_ref(&self) -> &CleanupGuardRef;
    /// 返回exact context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回exact environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回optional exact run ref。
    pub fn run_ref(&self) -> Option<&ControlledExecutionRunRef>;
    /// 返回exact boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回exact isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回stable backend release target。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回pre-bound lease ref。
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    /// 返回authorization时persisted lease row是否存在。
    pub fn lease_record_present(&self) -> bool;
    /// 返回optional exact orphan recovery attempt。
    pub fn orphan_record_ref(&self) -> Option<&OrphanRecoveryRecordRef>;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回authorization audit identity。
    pub fn authorization_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回authorization time。
    pub fn authorized_at(&self) -> &Timestamp;
    /// 返回body-free diagnostic trace。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}
```

`try_from_persisted_authorization` executes the following checks in order:

1. `cleanup.release_basis() == Some(release_basis)`, `guard_status == Allowed`, blockers are empty, and completion/failure basis are both
   absent. A blocked old guard or a guard with a terminal outcome cannot be reused.
2. Context, identity, optional run, boundary, handle, pre-bound lease, optional orphan and generation in the basis equal the cleanup
   owner fields. Context remains accepted lineage; identity remains its active lineage source; boundary is `Established | Failed`.
3. Handle is `ReleasePending`; its backend source, context, identity, boundary, lease and generation equal the basis. A partial handle is
   not moved through `mark_release_pending` again during a later authorized recovery.
4. `lease.is_some() == release_basis.lease_record_present()`. A present lease has the exact ref/lineage and is not `Released`; an absent
   row is legal only for the Step 6 boundary-only partial-handle path.
5. `orphan.is_some() == release_basis.orphan_record_ref().is_some()`. A present orphan is the exact `Recovering` attempt and stores the
   same release basis; no orphan may be inferred from lease/handle status.
6. Backend source and summary roles are `IsolationBackend`; backend source version and explicit generation are equal. Authorized status
   is exactly `Allowed`, and audit/time/reason/coverage are copied from the persisted basis without caller replacement.

The application correlation key is the full immutable basis. The concrete adapter's stable idempotency tuple is
`(cleanup_guard_ref, authorization_audit_trace_ref, authorized_at, backend_handle_ref, generation_ref)` and every remaining basis field
is a mandatory collision check. Trace, retry count, worker/job identity and current wall clock are not key dimensions. A different guard
or authorization time is a different release authorization even when it targets the same backend resource.

### 10.2 Typed retryable observation

A retryable result is a finite adapter statement, not an exception string interpreted by application code. It never proves release and
never creates a failure basis.

```rust
/// 已授权release operation可返回的有限nonterminal retry position。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum IsolationEnvironmentReleaseRetryableKind {
    /// backend明确拒绝本次effect且证明side effect未开始；同一basis可在完整重验后有界重试。
    RejectedBeforeEffect,
    /// backend已接受operation但尚未形成terminal observation；必须先inspect same target。
    AcceptedStillPending,
}

/// 对一个exact release authorization形成的body-free typed retryable observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationEnvironmentReleaseRetryableObservation {
    /// finite retry position；不得由reason文本推导。
    retryable_kind: IsolationEnvironmentReleaseRetryableKind,
    /// exact backend release target。
    backend_handle_ref: ExternalSourceRef,
    /// body-free isolation backend retry summary。
    retry_summary_ref: SafeSummaryRef,
    /// exact authorization generation。
    generation_ref: ResourceRef,
    /// owner-provided caller-safe reason。
    reason: SandboxReason,
    /// typed provider observation time。
    observed_at: Timestamp,
}

impl IsolationEnvironmentReleaseRetryableObservation {
    /// 从exact request和finite retry position构造checked retryable observation。
    pub fn try_new(
        request: &ReleaseIsolationEnvironmentRequest,
        retryable_kind: IsolationEnvironmentReleaseRetryableKind,
        retry_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, GuardedIsolationEnvironmentReleasePortError>;

    /// 返回finite retry position。
    pub fn retryable_kind(&self) -> IsolationEnvironmentReleaseRetryableKind;
    /// 返回exact backend release target。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回body-free retry summary ref。
    pub fn retry_summary_ref(&self) -> &SafeSummaryRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回caller-safe reason。
    pub fn reason(&self) -> &SandboxReason;
    /// 返回typed observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 验证retryable observation属于同一persisted authorization target。
    pub fn matches_request(&self, request: &ReleaseIsolationEnvironmentRequest) -> bool;
}
```

The summary source kind must be `IsolationBackend`, source/generation must equal the request, and
`observed_at >= request.authorized_at()`. `RejectedBeforeEffect` is allowed only with typed provider proof that no release side effect was
started. `AcceptedStillPending` says the opposite: an operation may be progressing, so application must inspect before any repeat. Neither
kind promises that a retry will occur; bounded retry timing/count remains an application/config policy outside this result.

### 10.3 Closed release result 与 trait

The release adapter cannot hand an arbitrary `CleanupReleaseFailureObservation` to the result factory, because the canonical carrier does
not persist the provenance of its finite failure kind. The transient source below closes that provenance before the application creates
the Step 6 carrier; it is not a second persisted failure truth and has no independent identity.

```rust
/// release adapter向application交付的两类typed definitive failure origin。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum GuardedIsolationEnvironmentReleaseDefinitiveFailureSource {
    /// 同一release operation明确返回non-retryable terminal failure。
    ReleaseAttempt {
        /// exact isolation backend safe summary。
        failure_summary_ref: SafeSummaryRef,
        /// owner-provided caller-safe failure reason。
        reason: SandboxReason,
        /// typed terminal observation time。
        observed_at: Timestamp,
    },
    /// 同一authorization的confirmation inspection明确返回non-retryable terminal failure。
    LifecycleConfirmationInspection {
        /// exact isolation backend safe summary。
        failure_summary_ref: SafeSummaryRef,
        /// owner-provided caller-safe failure reason。
        reason: SandboxReason,
        /// typed terminal inspection time。
        observed_at: Timestamp,
    },
}

impl GuardedIsolationEnvironmentReleaseDefinitiveFailureSource {
    /// 构造release operation terminal failure source；不接受timeout或port error。
    pub fn release_attempt(
        failure_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Self;

    /// 构造confirmation inspection terminal failure source；不接受technical inspection error。
    pub fn lifecycle_confirmation_inspection(
        failure_summary_ref: SafeSummaryRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Self;
}
```

Only a concrete adapter's typed finite mapper may construct the second source after proving that the exact confirmation inspection
completed and returned a non-retryable terminal classification. There is no conversion from
`IsolationEnvironmentLifecycleInspectionPortError`, timeout, transport interruption, malformed SDK result, missing capability or
unsupported inspection to this source. The source is immediately consumed by the result factory and is never stored separately.

```rust
/// guarded release port对一个persisted authorization返回的application-owned closed result。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum GuardedIsolationEnvironmentReleaseResult {
    /// matching canonical lifecycle observation；result内只保留非conflict finite kinds。
    LifecycleObservation {
        /// `ReleaseConfirmed | ObservedPresent | Unavailable`之一。
        observation: IsolationEnvironmentLifecycleObservation,
    },
    /// matching definitive non-retryable failure observation。
    DefinitiveFailure {
        /// Step 6唯一canonical release failure carrier。
        observation: CleanupReleaseFailureObservation,
    },
    /// matching typed nonterminal retry position。
    Retryable {
        /// 不得形成completion或failure basis的retryable observation。
        observation: IsolationEnvironmentReleaseRetryableObservation,
    },
}

impl GuardedIsolationEnvironmentReleaseResult {
    /// 从canonical lifecycle observation构造closed result；`Conflicted`机械转为definitive conflict failure。
    pub fn from_lifecycle_observation(
        request: &ReleaseIsolationEnvironmentRequest,
        observation: IsolationEnvironmentLifecycleObservation,
    ) -> Result<Self, GuardedIsolationEnvironmentReleasePortError>;

    /// 从typed definitive origin构造对应Step 6 terminal failure result。
    pub fn definitive_failure(
        request: &ReleaseIsolationEnvironmentRequest,
        source: GuardedIsolationEnvironmentReleaseDefinitiveFailureSource,
    ) -> Result<Self, GuardedIsolationEnvironmentReleasePortError>;

    /// 从checked nonterminal observation构造retryable result。
    pub fn retryable(
        request: &ReleaseIsolationEnvironmentRequest,
        observation: IsolationEnvironmentReleaseRetryableObservation,
    ) -> Result<Self, GuardedIsolationEnvironmentReleasePortError>;

    /// 返回optional canonical lifecycle observation。
    pub fn lifecycle_observation(&self) -> Option<&IsolationEnvironmentLifecycleObservation>;
    /// 返回optional definitive failure observation。
    pub fn definitive_failure_observation(&self) -> Option<&CleanupReleaseFailureObservation>;
    /// 返回optional retryable observation。
    pub fn retryable_observation(&self) -> Option<&IsolationEnvironmentReleaseRetryableObservation>;

    /// 对request重新执行target、generation、kind和time relation validation。
    pub fn validate_for_request(
        &self,
        request: &ReleaseIsolationEnvironmentRequest,
    ) -> Result<(), GuardedIsolationEnvironmentReleasePortError>;
}

/// 对persisted cleanup authorization执行一个idempotent isolation environment release。
pub trait GuardedIsolationEnvironmentReleasePort: Send + Sync {
    /// 发起或恢复same authorization的guarded release side effect。
    async fn release_environment(
        &self,
        request: &ReleaseIsolationEnvironmentRequest,
    ) -> Result<
        GuardedIsolationEnvironmentReleaseResult,
        GuardedIsolationEnvironmentReleasePortError,
    >;
}
```

`from_lifecycle_observation` validates source, generation and `observed_at >= authorized_at`. It keeps `ReleaseConfirmed`,
`ObservedPresent` and `Unavailable` as lifecycle observations. For `Conflicted`, it must call
`CleanupReleaseFailureObservation::try_new(BackendLifecycleConflict, ...)` using exactly the same backend source, summary, generation,
reason and time, then return `DefinitiveFailure`; there is no caller-selected mapping and no wildcard.

The `definitive_failure` factory consumes the two typed terminal sources below; the `Conflicted` lifecycle branch is converted by
`from_lifecycle_observation`. Together these are the only three routes to Step 6's closed failure kinds:

| failure kind | required typed origin | forbidden origin |
|---|---|---|
| `ReleaseAttemptFailed` | matching release operation explicitly reports non-retryable terminal failure | timeout, retry exhaustion chosen by caller, raw status code |
| `LifecycleInspectionFailed` | release adapter's matching exact-target confirmation operation returns a typed, finite, non-retryable terminal inspection failure | any §9 port error, timeout, dependency unavailable, malformed result, missing capability, unsupported inspection |
| `BackendLifecycleConflict` | matching canonical `Conflicted` observation mapped field-for-field | generic provider conflict string or different target summary |

All failure observations must match request backend target/generation and be observed at or after authorization. Application does not
promote a port error, retryable observation, `ObservedPresent` or `Unavailable` into one of these kinds.
`LifecycleInspectionFailed` therefore cannot be constructed from
`IsolationEnvironmentLifecycleInspectionPortError::{ExactInspectionUnavailable, ExactInspectionUnsupported,
ObservationUnclassifiable, ObservationCorrelationMismatch, ObservationTimeInvalid, ForbiddenExternalBody}`. Those errors leave the
authorization unresolved and route to inspection recovery, adapter quarantine or activation failure according to their exact class.

### 10.4 Closed release error

```rust
/// guarded release request、binding、result correlation或side-effect knowledge的closed failure。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum GuardedIsolationEnvironmentReleasePortError {
    /// guard未保存与request完全相等的release authorization。
    ReleaseBasisNotPersisted,
    /// persisted authorization已由completion或definitive failure终结。
    ReleaseAuthorizationAlreadyFinalized,
    /// context、identity、optional run、boundary、handle、lease或generation relation不一致。
    TargetLineageInvalid,
    /// owning handle未保持`ReleasePending`。
    HandleWasNotReleasePending {
        /// request factory读取的actual handle status。
        actual: IsolationEnvironmentHandleStatus,
    },
    /// persisted lease presence/ref/status与release basis不一致。
    LeaseRelationInvalid,
    /// optional orphan presence/ref/status/persisted basis与release basis不一致。
    OrphanAttemptRelationInvalid,
    /// backend source kind/version与release basis generation不一致。
    BackendTargetRelationInvalid,
    /// adapter在明确未调用provider前不可用。
    AdapterUnavailableBeforeCall {
        /// caller-safe availability reason。
        reason: SandboxReason,
    },
    /// runtime assembly绑定了错误backend target/generation adapter。
    AdapterBindingInvalid {
        /// caller-safe binding reason。
        reason: SandboxReason,
    },
    /// configured release adapter无法保证same-authorization idempotency。
    IdempotentReleaseUnsupported {
        /// caller-safe conformance reason。
        reason: SandboxReason,
    },
    /// result variant与其observation kind或field cardinality不一致。
    ResultShapeInvalid,
    /// result backend target/generation不属于request authorization。
    ResultCorrelationMismatch,
    /// result observation time早于release authorization。
    ResultTimeInvalid,
    /// same authorization的重复调用返回互相冲突的finite result。
    ResultCollision,
    /// provider result无法安全映射为closed lifecycle/failure/retryable result。
    OutcomeUnclassifiable {
        /// caller-safe classification reason；不得来自raw error Display。
        reason: SandboxReason,
    },
    /// adapter检测到SDK/raw response、credential、path、process或其它forbidden body。
    ForbiddenExternalBody,
    /// release side effect可能已发生或提交；必须inspect same persisted authorization target。
    ExternalSideEffectCommitUnknown {
        /// caller-safe unknown reason。
        reason: SandboxReason,
    },
    /// runtime assembly没有为release slot绑定exact lifecycle inspection能力。
    RecoveryInspectionUnsupported {
        /// caller-safe conformance reason。
        reason: SandboxReason,
    },
}
```

`ExternalSideEffectCommitUnknown` is the only port-error route when the adapter cannot prove a finite result after the release may have
started. It must never be downgraded to `Retryable`, `Unavailable` or `ReleaseAttemptFailed`. Runtime assembly rejects a release adapter
that lacks both same-authorization idempotency and the §9 exact inspection capability before any real release.

### 10.5 Result-to-owner matrix

| port result/error | side-effect knowledge | only allowed application action | forbidden transition |
|---|---|---|---|
| lifecycle `ReleaseConfirmed` | matching teardown confirmed | unique-map summary; fresh-read complete redline coverage; form `CleanupCompletionBasis`; atomically close exact owners | complete from adapter bool or skip owner relation checks |
| lifecycle `ObservedPresent` | target still observed; release not terminal | retain `Allowed + basis`, `ReleasePending`, optional `Recovering`; bounded inspect/same-basis policy | `Released`, `Blocked`, new basis or backend switch |
| lifecycle `Unavailable` | lifecycle source cannot determine terminal result | retain same authorization and inspect later | infer absent/released, retry as if no side effect |
| definitive `ReleaseAttemptFailed` | same operation terminal non-retryable failure | `cleanup.record_release_failure`; optional orphan `mark_failed`; one failure UoW | handle/lease/boundary released or old guard reopened |
| definitive `LifecycleInspectionFailed` | same-target confirmation inspection terminal non-retryable | same failure-basis route | treat dependency timeout/unavailable as this kind |
| definitive `BackendLifecycleConflict` | exact canonical conflict | same failure-basis route plus formal containment/failure handoff as applicable | reason-parsed generic failure |
| retryable `RejectedBeforeEffect` | typed proof this call did not start release | keep same basis; after full owner revalidation, bounded policy may retry same request | new authorization or claim release absent globally |
| retryable `AcceptedStillPending` | operation accepted and may still progress | inspect same authorization target before any repeat | blind release retry or failure/completion |
| `AdapterUnavailableBeforeCall` | proven not called | preserve authorization; retry only after owner/binding revalidation | create finite backend observation |
| `ExternalSideEffectCommitUnknown` | may have started/committed | construct §9 `AuthorizedReleaseRecovery` request from same persisted basis and inspect | retry release, create new guard/basis, mark failed/completed |
| shape/correlation/body/collision | returned data untrusted | quarantine result/adapter and preserve recovery point | apply any partial field or parse raw cause |

Only the first row can call `CleanupGuard::require_completion_basis`. Only the three definitive rows can call
`CleanupGuard::record_release_failure`. Timeout, dependency unavailable, lifecycle `Unavailable`, both retryable kinds, outcome
unclassifiable, process interruption, response loss and transaction commit unknown leave the original authorization unchanged.

### 10.6 Completion/failure UoW ordering

The pre-call UoW has already persisted the release basis, moved the handle to `ReleasePending`, moved an optional orphan to `Recovering`,
and saved audit/stored recovery relations. The port is called only after that commit is confirmed and all transaction handles are dropped.

On a matching confirmation, application validates the result against the request, invokes `map_backend_lifecycle_summary`, reloads the
complete owner group with fresh `Version`s and complete redline coverage, and follows the Step 6 order:

```text
cleanup.require_completion_basis(same basis, same observation, same summary, fresh coverage)
  -> handle.mark_released(same observation)
  -> optional lease.mark_released(same completion basis)
  -> optional orphan.mark_recovered(same completion basis, same summary)
  -> boundary.mark_released(same completion basis)
  -> cleanup.settle_release_confirmation(same owners, fresh coverage)
  -> optional context/identity closure only when the settled guard permits it
  -> stage audit/relay/stored result and commit one UoW
```

On a definitive failure, application reloads the same basis and owners, calls `cleanup.record_release_failure`, then passes the resulting
`CleanupReleaseFailureBasis` to the exact optional orphan before committing guard/orphan/audit/stored result in one UoW. Handle remains
`ReleasePending`, lease remains non-released, and boundary remains `Established | Failed`. A commit-unknown after either UoW triggers
whole-group repository inspection; it never causes another release or a contradictory terminal basis.

### 10.7 Durable/fake parity and activation gate

Durable and fake implementations must support every result branch and error class relevant to safety. At minimum both can deterministically
produce `ReleaseConfirmed`, `ObservedPresent`, lifecycle `Unavailable`, each of the three definitive failure kinds, both retryable kinds,
pre-call unavailable, result correlation mismatch, result collision and side-effect commit unknown. The fake cannot default to success,
derive retryability from reason text, mutate domain owners, omit exact times, or return a different result for an exact duplicate unless it
explicitly produces `ResultCollision`.

Runtime activation requires all of the following as one conformance unit:

1. same-authorization release idempotency;
2. exact lifecycle inspection for the same backend target/generation;
3. exhaustive provider-to-closed-result mapping with no wildcard success;
4. body-free request/result/error boundary;
5. durable/fake parity for confirmation, nonterminal, definitive failure and unknown paths.

Missing any member disables the release slot fail-closed; config, operator override or a weaker fake cannot selectively bypass it.

## 11. `S7-03B` Cross-port Closure Audit

本节是本批 B5 closure。它审计四个 lifecycle port 之间的接缝，不新增第五个 port、第二套 lifecycle observation 或第二套
cleanup failure truth。审计结论只表示设计契约的静态闭合，不表示 Rust 编译、provider 调用、fake/durable test、run、evidence
或验收已经发生。

### 11.1 Current contract inventory

| family | application owner | public methods | side-effect budget | finite application result | error owner | Sandbox truth owner |
|---|---|---:|---|---|---|---|
| establishment | `IsolationEnvironmentEstablishmentPort` | `2` (`establish` + same-request `inspect`) | first method may establish; second is read-only | `IsolationEnvironmentEstablishmentResult` | `IsolationEnvironmentEstablishmentPortError` | boundary decision, handle, lease and cleanup obligation |
| launch | `ControlledRunLaunchPort` | `2` (`launch` + same-key `inspect`) | first method may launch one isolation-layer run; second is read-only | `ControlledRunLaunchResult` or `ControlledRunLaunchInspectionResult` | `ControlledRunLaunchPortError` | `ControlledExecutionRun` plus matching formal failure owner only on typed terminal branch |
| lifecycle inspection | `IsolationEnvironmentLifecycleInspectionPort` | `1` read-only method | zero Sandbox and provider lifecycle mutation | `IsolationEnvironmentLifecycleObservation` | `IsolationEnvironmentLifecycleInspectionPortError` | handle, lease, orphan, cleanup and reconciliation owners |
| guarded release | `GuardedIsolationEnvironmentReleasePort` | `1` idempotent release method | may release only one persisted authorization | `GuardedIsolationEnvironmentReleaseResult` | `GuardedIsolationEnvironmentReleasePortError` | cleanup guard, completion/failure basis, handle, lease, orphan and boundary |

The six async methods above have four family-specific checked request types and four family-specific closed port errors. The only
non-trait helper in this batch is `map_backend_lifecycle_summary`; it accepts one canonical observation and has no alternative source,
repository access or backend call. The release transient failure source is not a fifth result family and is consumed before the public
release result is returned.

### 11.2 Correlation, generation and field-source join

| contract | stable identity / collision key | mandatory generation relation | field source | excluded from identity |
|---|---|---|---|---|
| establishment | `(context_ref, environment_identity_ref, boundary_ref, requirement_ref, capability_ref, backend_ref, generation_ref)` | requirement, capability, backend source version and result descriptor all equal `generation_ref` | committed owner group, checked requirement/capability decisions and application-prebound boundary ref | trace, provider body, current wall clock and adapter retry count |
| launch | provider key `(run_ref, isolation_handle_ref, generation_ref)` plus recovery collision field `launch_failure_ref` | permit, handle backend source, result/inspection and prebound failure relation all equal the run generation/identity group | committed `Preparing` run, `ControlledRunLaunchPermit`, its prebound failure ref and exact active handle | trace and checked permit age; provider cannot choose failure identity |
| lease/orphan inspection | full request lineage plus purpose proof and optional exact incident refs | backend source version, handle, lease marker and purpose basis all equal | fresh owner snapshot, committed reaper marker or persisted release/failure basis | query selector, latest row, reason text and scan order |
| guarded release | full immutable `CleanupReleaseBasis`; adapter tuple `(cleanup_guard_ref, authorization_audit_trace_ref, authorized_at, backend_handle_ref, generation_ref)` plus all remaining basis fields as collision checks | release basis backend source version and every returned observation equal the authorization generation | persisted guard authorization only | trace, worker/job identity, retry count and current clock |

The four rows are independently checked before and after every external call. A result cannot select a new Sandbox ref, backend target,
generation, failure candidate, lease row, orphan incident or cleanup authorization. `SandboxTraceContext` is diagnostic only and is replaceable through the
recovery-trace factory without changing any target or proof field.

### 11.3 Exhaustive result and failure mapping

#### Establishment

| source / disposition | required carrier relation | allowed owner route | forbidden shortcut |
|---|---|---|---|
| `Established` | descriptor and lease window both `Some`; reason absent | revalidate and create checked established handle/lease group | provider status directly written to boundary |
| `BackendUnsupported` | descriptor and lease both absent; safe reason present | record capability contradiction and fail/refresh | relax requirement or switch backend silently |
| `Failed` with partial pair | descriptor and lease both present; safe reason present | preserve `Created` partial handle and cleanup obligation | discard partial handle or retry as absent |
| `Failed` without partial pair | both absent; safe reason present | honest failed boundary decision | map to `Unavailable` |
| `Unavailable` | both absent; typed proof of no side effect | preserve no-handle result and bounded retry policy | map timeout or commit unknown to absent |

`inspect_environment_establishment` returns the same application result set and never creates an environment. Its technical inspection
errors remain errors; only a typed no-side-effect provider observation can form finite `Unavailable`.

#### Launch

| source / disposition | allowed positive carrier | owner route | forbidden shortcut |
|---|---|---|---|
| launch method `Launched` | matching `ControlledRunLifecycleObservation(kind=Launched)` | fresh read then `Preparing -> Running` | accept `Completed` or call `mark_running` inside adapter |
| launch method `BackendLaunchFailed` | matching terminal source carrying the run-prebound failure ref | canonical observation -> marker -> classification with same ref -> failure basis -> `Preparing -> Failed` | adapter error direct failure、second failure ref、eager `PendingInput` |
| inspection `Launched` | same positive carrier and request correlation | same `Preparing -> Running` branch | treat inspection as a second launch |
| inspection `BackendLaunchFailed` | same terminal carrier and prebound failure ref | same formal failure branch | allocate recovery classification identity |
| inspection `NotLaunched` | no lifecycle observation; typed summary and reason | keep `Preparing`; reauthorize before any same-key retry | create a second run, capture or failure ref |
| inspection `Unavailable` | no lifecycle observation; typed summary and reason | strict unknown hold | infer absent and blind retry |
| inspection `Conflicted` | no lifecycle observation; typed summary and reason | canonical conflict observation then formal failure/control/redline owner | mark run failed directly from port or replace prebound ref |
| any `Completed` launch observation | rejected by `ObservationKindInvalid` / `InspectionShapeInvalid` | no state mutation | skip `Preparing -> Running` |

Both terminal rows use `SandboxFailureObservation::try_for_run`, `FailureSourceMarker::from_observation`,
`FailureClassification::classify` and `FailureClassification::require_run_failure_basis` in that order after a fresh owner reload. The
failure classification ref is the exact ref stored on the `Preparing` run; no mapper or recovery invocation allocates it.

#### Lifecycle inspection and summary

The canonical observation has exactly four kinds and the mapper is the only summary route:

| `IsolationEnvironmentLifecycleObservationKind` | `BackendLifecycleObservationKind` | completion/failure meaning |
|---|---|---|
| `ObservedPresent` | `Present` | target is still observed; no release completion |
| `ReleaseConfirmed` | `Released` | may be consumed by the matching cleanup/reconciliation owner |
| `Unavailable` | `Unavailable` | presence/release is unknown; no terminal claim |
| `Conflicted` | `Conflicted` | exact conflict input; no generic failure inference |

The mapper copies backend source, safe summary, generation, reason and observation time field-for-field. A second backend read, a second
summary mapper, a wildcard arm, a status-only summary or a latest-handle lookup is forbidden. The mapper cannot create a completion or
failure basis.

For `LeaseOrphanInspection`, a fresh expired lease/owner proof plus `ObservedPresent`, `Unavailable` or `Conflicted` may maintain or
form the same `Suspected` incident according to the lease/orphan owner methods. Only `ObservedPresent` or `Conflicted` can support the
later `Suspected -> Confirmed` transition; `Unavailable` never confirms and never proves absence or release. `ReleaseConfirmed` is a
reconciliation input, not a direct `Released` or `Recovered` transition.

#### Guarded release

| source | canonical release result | Step 6 basis route |
|---|---|---|
| lifecycle `ReleaseConfirmed` | `LifecycleObservation` | one matching `CleanupCompletionBasis`, then one completion UoW |
| lifecycle `ObservedPresent` / `Unavailable` | `LifecycleObservation` | preserve same authorization; no completion or failure basis |
| lifecycle `Conflicted` | `DefinitiveFailure` with `BackendLifecycleConflict` | one matching failure basis and blocked guard |
| typed `ReleaseAttempt` source | `DefinitiveFailure` with `ReleaseAttemptFailed` | one matching failure basis and blocked guard |
| typed `LifecycleConfirmationInspection` source | `DefinitiveFailure` with `LifecycleInspectionFailed` | one matching failure basis and blocked guard |
| `RejectedBeforeEffect` | `Retryable` | same basis; bounded same-key retry only after revalidation |
| `AcceptedStillPending` | `Retryable` | same basis; inspect before any repeat |
| technical port error / side-effect unknown | port `Err` | strict recovery inspection; no basis completion/failure |

`LifecycleInspectionFailed` has one typed finite source and cannot be manufactured from an inspection port error. In particular,
`ExactInspectionUnavailable`, `ExactInspectionUnsupported`, malformed or unclassifiable result, correlation mismatch, timeout,
transport interruption and forbidden-body quarantine do not enter `CleanupReleaseFailureKind::LifecycleInspectionFailed`.

### 11.4 Owner, UoW and side-effect join

| phase | establishment | launch | inspection | release |
|---|---|---|---|---|
| reservation prefix | reservation-only claim and confirmed commit before business read/allocation | same; no run/capture/failure allocation before confirmed commit | caller operation reservation, when applicable; port itself remains read-only | reservation-only claim and confirmed commit before release preparation |
| pre-call read | exact context/identity/requirement/capability owner group after reservation | exact owners after reservation; after preparation commit, fresh exact `Preparing` run, permit and active handle | exact handle plus purpose proof and all optional sibling rows | exact guard with persisted `CleanupReleaseBasis` and matching owners |
| pre-call write | attempt and audit recovery relation; reservation is already committed | run preparing with prebound capture/failure identities and audit/recovery relation; reservation is already committed | none; read-only port | handle `ReleasePending`, optional orphan `Recovering`, release basis and audit; reservation is already committed |
| external call | UoW dropped; one establish method | UoW dropped; one launch method | UoW dropped; one read | UoW dropped; one release method |
| post-call read | fresh owner versions and result relation | fresh run/handle/prebound-failure/permit relation | validate observation, then map one summary | fresh owners, basis, redline coverage and result relation |
| post-call write | checked handle/lease/decision or partial cleanup obligation | `mark_running` with candidate retirement, or formal failure owner + `mark_failed` with the same ref | only caller/domain owner may write; port/mapper write zero | completion or definitive failure UoW; retry/unknown preserves authorization |

Every post-call mutation rejects stale `Version` and old in-memory owners. A commit-unknown result triggers whole-group inspection using
the original correlation; it never creates a second identity, retries a side effect blindly, or applies a result to the latest unrelated
owner.

### 11.5 Duplicate and unknown matrix

| condition | exact recovery identity | allowed action | prohibited action |
|---|---|---|---|
| pre-call adapter unavailable | original checked request / persisted basis | retry only after full owner and binding revalidation | report finite success or synthetic `Unavailable` |
| side effect commit unknown | original request key, prebound launch failure ref or release basis | exact same-correlation inspection | second establish/launch/release or replacement failure ref |
| duplicate with same finite result | same key, same result kind and field-equal carrier | replay the known observation or stored application result | new attempt or new ref |
| duplicate with different finite result | same key, kind or immutable fields conflicting | family-specific `*ResultCollision` / `Duplicate*FieldMismatch`, quarantine and preserve recovery | last-write-wins |
| post-call UoW commit unknown | original idempotency/stored-result and operation recovery relation | whole-group repository inspection including launch failure ref | rerun external side effect or allocate identity from missing local row |
| inspection unavailable | original inspection request and purpose | bounded retry/hold | infer absent, released, confirmed orphan or terminal failure |

### 11.6 Duplicate port and reverse-dependency audit

| audit | result | explanation |
|---|---|---|
| current lifecycle trait count | `4/4` | exactly establishment, launch, inspection and guarded release; no generic action dispatcher |
| current lifecycle method count | `6/6` async methods | two establishment, two launch, one inspection and one release method |
| old generic port authority | `0` | `IsolationBackendPort` and `BackendLifecycleInspectionPort` remain historical conflict material only |
| application -> infra type in public contract | `0` | infra outcome/error names occur only in source-map or prohibition prose, not public field/signature positions |
| second lifecycle summary mapper | `0` | `map_backend_lifecycle_summary` is the only mapper and has one canonical input |
| repository/UoW accepted by external trait | `0` | all external calls use frozen request values and execute outside UoW |
| tool semantic / runtime loop / member orchestration dependency | `0` positive contract fields | only body-free lineage and safe summaries cross the boundary |
| artifact body / observability store ownership | `0` | capture, handoff and observability remain later port families and external truth owners |
| latest scan / full-table fallback | `0` | every request carries an exact target and purpose proof |

Historical references in this file and older Step 7 files are retained as `historical_material` and are not positive current-contract
matches. They must be removed or rewritten only during the later master assembly; this batch does not silently rewrite history.

### 11.7 Durable/fake parity closure

The following are obligations for both implementations, not executed tests:

| parity dimension | durable adapter | deterministic fake | closure requirement |
|---|---|---|---|
| request validation | validates the same lineage, generation, purpose and basis relation before provider access | uses the same checked request constructors and rejects malformed fixtures | no permissive fake-only path |
| establishment | exposes all five finite dispositions, exact inspection and unknown/error classes | can select each disposition without creating domain truth | partial pair and no-side-effect `Unavailable` remain distinguishable |
| launch | exposes side-effect `Launched | BackendLaunchFailed`, five same-key inspection dispositions, prebound failure relation and commit-unknown | can inject/replay both side-effect results and all five inspection dispositions while preserving exact failure ref | no second launch or second failure identity on duplicate |
| lifecycle inspection | exposes all four canonical observation kinds and technical errors | same four kinds, same timestamp/cardinality/body rules | no default `ReleaseConfirmed` |
| release | exposes confirmation, present, unavailable, conflict, two retryable kinds, three definitive sources and unknown errors | deterministic injection for every branch with same correlation checks | no reason-text classification or owner mutation |
| time and generation | returns typed observation time and exact source generation | supplies explicit fixture time/generation and rejects omissions | no provider wall-clock/body substitution |
| owner/write isolation | adapter does not mutate Sandbox owners or repositories | fake does not mutate owners while serving a port call | owner transitions remain application/domain responsibility |
| duplicate collision | same key returns same finite result or typed collision | same behavior and field comparison | no last-write-wins |

The parity obligation is a design closure, not a test pass. No fake, durable adapter, provider, run, evidence alias or test result was
created in this batch.

## 12. 正式 `03` 回填草稿

> 校准来源：`design-calibration/03_ddd_step_07_lifecycle_ports.md` §§6~11。

正式 `03` 的 lifecycle port 小节只保留以下实现结论，不搬入本文件的历史诊断、逐项审计和用户停审记录：

1. `application::ports` 定义四个独立 lifecycle trait。establishment、launch各自提供同一 correlation 的只读 inspection；
   lifecycle inspection 本身零副作用；guarded release 只消费持久化 `CleanupReleaseBasis`。
2. application trait 只接受 checked request，返回 application/domain-owned finite observation 或 closed port error；provider SDK、
   raw body、`InfraError` 和 concrete backend outcome 止于 `infra` adapter。
3. establishment 的 `Established`、partial `Failed` 和 typed no-side-effect `Unavailable` 保留不同语义；launch side-effect result
   只有`Launched | BackendLaunchFailed`，inspection只有五个closed disposition。`Launched`进入`Preparing -> Running`；typed
   terminal result使用run预绑定的同一`FailureClassificationRef`形成formal owner后进入`Failed`，不得承接 tool semantic execution、
   runtime agent loop 或 member orchestration。
4. lifecycle observation 只有 `ObservedPresent`、`ReleaseConfirmed`、`Unavailable`、`Conflicted` 四类，由唯一 mapper形成
   `BackendLifecycleSummary`；`Unavailable` 不确认 orphan、不证明 absence/release。
5. release result 只有 matching confirmation、nonterminal retry、same-authorization definitive failure和strict unknown/error
   路径。只有 `ReleaseConfirmed` 形成 completion basis，只有三个 typed definitive failure kind 形成 failure basis。
6. fresh write invocation先独立提交reservation，再提交pre-call recovery，随后UoW外呼、fresh owner reload、Version/CAS和
   single-winner recovery；launch成功时原子
   retire prebound failure candidate，terminal/commit-unknown时复用同一ref。unknown不得盲重试、根据stored output缺失重启或创建第二身份。

## 13. Downstream Handoff、待确认事项与停审

| downstream | handoff | owner / next step | current disposition |
|---|---|---|---|
| Step 8 protocol | 四 trait、六方法、request/result/error名称和body-free字段类别 | Step 8 protocol package | blocked until Step 7 overall gate |
| Step 9 flow | pre-call commit、external split、fresh reload、four-purpose inspection和completion/failure ordering | Step 9 flow package | blocked |
| Step 10 state | handle/run/lease/orphan/cleanup状态触发和非法转换入口 | Step 10 state package | blocked |
| Step 11 persistence | idempotency key、basis/recovery relation、Version/CAS和whole-group inspection | downstream revalidation | blocked |
| Step 16 tests | L1 positive、unknown、relation、body redline和fake/durable parity categories | formal `05` revalidation | pending; no cases or results created |
| Step 17 implementation | named application traits, infra implementation boundary, no-code scope and blocker state | formal `07` revalidation | pending; no activation |

| item | current handling | blocker |
|---|---|---|
| provider product/SDK/config binding | defer to infra/config and formal `04` | not a blocker for application contract |
| public protocol/route/topic/page schema | defer to Step 8 | not a blocker for this port batch |
| exact flow pseudocode and state matrices | defer to Step 9/10 | Step 7 overall gate remains required |
| durable schema/migration/index | defer to Step 11/14 | not a new upstream blocker |
| test execution/evidence/acceptance/commit | not created and not claimed | none; prohibited in design batch |

`DISPATCH/OUTCOME/READ/ENTRY = 4/6 open with owner` remains an existing Step 7 blocker set. `OUTCOME-001` remains open until
`S7-03C` and `S7-05`; no new L1/L2 upstream blocker was found. The current batch may stop at user review even though the complete
`7R-03` package and Step 7 gate are not complete.

## 14. B5 Static Self-check and Authenticity Statement

| check | result | scope / qualification |
|---|---|---|
| four lifecycle trait families | `4/4` | current artifact contract sections 7~10 |
| async method inventory | `6/6` | two establishment, two launch, one inspection, one release |
| exact request family | `4/4` | each side-effect family has a checked request; inspection purposes are closed |
| canonical lifecycle observation mapping | `4/4 -> 4/4` | one mapper, no wildcard or second read |
| release completion/failure gates | `1/1` and `3/3` | only confirmation completes; three typed definitive kinds fail |
| unknown / retryable strict hold | `closed` | timeout, unavailable, retryable and commit-unknown cannot form basis |
| orphan unavailable semantics | `closed` | exact expired proof may maintain/form `Suspected`; never `Confirmed` or released |
| correlation/generation join | `closed` | all four family keys and source-version equality named |
| old generic port current authority | `0` | old names retained only as historical conflict material |
| public SDK/raw body positive fields | `0` | prose mentions are prohibition/source-map references, not contract fields |
| durable/fake parity obligation | `8/8` dimensions | obligation recorded; no implementation/test execution claimed |
| Markdown fence parity | `38` markers, parity `0` | mechanical check after B5 write |
| Markdown table columns | `0` mismatch | inline-code pipes excluded by the checker |
| public Rustdoc presence | `0` static gap | public types, variants, traits and methods have preceding Rustdoc |
| formal `03` modified | `no` | formal assembly remains frozen until later Step 19 |
| implementation/code/test/run/evidence/acceptance facts | `not_created` | no target implementation action occurred |
| commit required | `no` | user did not request a commit |

The remaining fence/table checks are mechanical document checks performed after the B5 append. A successful static check does not mean
compile, test, provider, run, evidence or acceptance success.

## 15. `S7-03B` 进入用户复核门

`S7-03B-B1~B5`内容、自检和恢复源同步完成后，本文件状态为 `completed_wait_user_review`。用户确认前不得进入
`S7-03C`，不得启动 Step 8、正式 `03~07` 重装配、implementation 或 boundary skeleton。

```text
artifact = 03_ddd_step_07_lifecycle_ports.md
artifact_content_status = completed
artifact_review_status = user_review_pending
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03B completed_wait_user_review
current_batch = S7-03B establish/launch/inspect/release ports
completed_internal_batches = S7-03B-B1,S7-03B-B2,S7-03B-B3,S7-03B-B4,S7-03B-B5
port_family_closure = 4/4
async_method_closure = 6/6
canonical_observation_mapping = 4/4
release_definitive_source_closure = 3/3
static_audit = completed
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
outcome_blocker = open_wait_s7_03c_s7_05
next_allowed_action = wait_user_review_before_s7_03c
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```
