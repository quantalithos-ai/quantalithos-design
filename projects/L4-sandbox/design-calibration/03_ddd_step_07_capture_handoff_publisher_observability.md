# L4-sandbox 详细设计 Step 7 回归中间产物：S7-03C-B1 Capture / Handoff L1 契约

> 对应正式文档：`projects/L4-sandbox/03-详细设计.md`
>
> 当前任务：`S7-03C-B1-D-1 checked delivery request / port boundary`
>
> 当前状态：`completed_wait_user_review`（B1-D-1 已完成；尚未回填正式 `03-详细设计.md`）
>
> 本文件性质：Step 7 中间产物，不是正式详细设计、实现代码、测试结果、运行证据、验收签署或 commit 事实。

## 1. Step 状态

| field | value |
|---|---|
| current document | `03-详细设计.md` |
| current Step | Step 7 regression / `7R-03` |
| current task | `S7-03C` capture / handoff / publisher / observability hooks |
| current internal batch | `S7-03C-B1-D-1` checked delivery request / port boundary |
| module scope | `application::ports`、`application::capture_handoff_service`、`domain` capture/handoff owners、`infra` typed adapters |
| design level | L1 主流程完整设计；涉及 material truth、handoff ownership、per-target progress、unknown recovery 和 no-rollback |
| status | `completed_wait_user_review` |
| formal `03-详细设计.md` | 不允许修改；等待 `S7-G03` 与 Step 19 统一装配 |
| implementation | `CB-SBX-01A blocked / wait_design` |
| new upstream blocker | `0` |
| next internal batch | `S7-03C-B1-D-2` attempt-before-call 与 candidate 到 observation 穷举映射 |
| next allowed action | 用户复核 `B1-D-1` 后，才允许写 `B1-D-2`；不得进入 B1-D-3、B1-E、B2 或 Step 8 |
| commit required | `no` |

### 1.1 本批内部写入计划

| batch | scope | status | completion gate |
|---|---|---|---|
| `B1-A` | 输入效力、历史冲突、owner 和 common port redlines | `completed` | current source 与 historical source 已分离；新 trait 不复用 generic outcome |
| `B1-B` | capture collection request / candidate / guard / decision / fact | `completed` | candidate、decision、fact、material rows 的 lineage、status、body-free 和 factory 关系闭合 |
| `B1-C` | handoff source / target / progress / aggregate 与 opening UoW | `completed` | source selector、coverage guard、完整 Pending progress、material lifecycle 和 atomic group 闭合 |
| `B1-D` | handoff delivery boundary、unknown / retry / no-rollback、cross-audit | `in_progress` | delivery request/result/error、same-attempt recovery、aggregate precedence 和禁止回滚闭合 |
| `B1-E` | 回填草稿、待确认项、静态审计和恢复同步 | `pending` | B1 差集归零；B2 仅在 B1 自检完成后启动 |

### 1.2 当前停审边界

本批只处理 capture / handoff 的 L1 truth 与 external seam。以下内容明确不在 B1 内：

- publisher 的 frozen event payload、relay attempt、dedup、publisher exact recovery；由 `S7-03C-B2` 处理。
- 普通非安全 observability hook 的最小 owner / input / output / redaction / failure isolation；由 `S7-03C-B3` 处理。
- 完整日志平台、审计查询平台、指标系统、告警路由、证据流水线和运维报表；保持 L2/L3 粒度。
- tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact formal truth、observability store truth。
- Step 8 DTO、Step 9 全量 flow、Step 10 状态矩阵、Step 11 physical schema、Step 16 测试结果和 implementation boundary。

## 2. 本步输入与效力

### 2.1 标准输入

| source | 本批读取内容 | 效力 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | 按模块定义 trait / port / adapter；参数、返回、错误、调用方、实现方、读取面、写入面和停审门 | current process authority |
| `standards/document/详细设计书写规范.md` | Rustdoc、完整签名、对象 owner、字段来源、正式章节回填边界 | current output authority |
| `standards/document/设计文档讨论中间产物规范.md` | 十段中间产物结构、分批写入、三层台账、历史材料后置和恢复门禁 | current execution authority |
| `standards/document/设计真相源闭环与可落码性标准.md` | typed identity、UoW / Version、stored replay、body-free、projection / material relation 和 fake parity | current quality authority |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L4 项目依赖裁剪与 sibling repo boundary | current dependency authority |

### 2.2 Step 6 current object source

| source | 本批消费结论 |
|---|---|
| `03_ddd_step_06_object_contracts_policy_run_capture.md` §§15~19 | `CaptureCollectionCandidate` 四类 disposition、`CaptureCompletenessGuard`、`CaptureCompletenessDecision`、`CaptureFact`、`CaptureRecordingIdentityBundle`、`CapturedMaterialRef` 的唯一字段 / factory / error / status relation。 |
| 同文件 §§20~22 | `HandoffTarget`、`HandoffTargetSet`、`HandoffTargetProgress`、`HandoffTargetProgressSet`、`HandoffOwnershipGuard`、`HandoffOwnershipDecision`、`HandoffFact` 及 aggregate precedence。 |
| 同文件 §17 | `ObservabilityMaterial` 是 Sandbox-owned body-free handoff material；不是 observability store、log、metric 或下游 truth。 |
| `03_ddd_step_06_object_contracts_application_infra_entry.md` | application-owned carrier 与 infra-private adapter outcome 分界；raw SDK / provider body 不得越过 adapter。 |
| `03_ddd_step_06_object_contracts_failure_cleanup_read.md` | cleanup block observation 由 cleanup owner 产生，handoff 只能消费 checked observation，不自行猜 cleanup status。 |

### 2.3 Step 7 current source

| source | 本批消费结论 |
|---|---|
| `03_ddd_step_07_service_facades_inputs_outputs.md` §§9~10、物理 EOF overlay | `RecordCaptureResultInput { run_ref }` 和 `OpenMaterialHandoffInput { source, target_plan }` 是 facade 唯一 current input；caller 不提交 capture ref、material、status、gap、attempt 或 receipt。 |
| `03_ddd_step_07_repositories_uow_indexes.md` current repository surface | `CapturedMaterialRepository` 使用 `(CaptureFactRef, CapturedMaterialKey)` typed composite key；`ObservabilityMaterialRepository` 与 `HandoffFactRepository` 为独立 exact root；progress 不拥有独立 repository。 |
| 同文件 §7、§19~§21 | reservation-only、pre-call recovery、external await 不持有 UoW、CAS 使用 core `Version`、commit 三分和 whole-group visibility。 |
| `03_ddd_step_07_immutable_audit_relay_repositories.md` | source operation 可产生 finalized relay relation，但 publisher 只能读取已提交 relay / frozen payload；B1 只保留 relay marker 接缝，不定义 publisher contract。 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` §50.3、§50.5 | capture group 必须来自同一 terminal snapshot；每个 material 逐 row create；handoff opening 不调用 delivery adapter；fresh non-Query invocation 先完成 idempotency reservation。 |

### 2.4 Historical material 处理

以下内容只作为冲突证据，不拥有当前 callable authority：

| historical material | 问题 | current disposition |
|---|---|---|
| `03_ddd_step_07_trait_port_adapter_contracts.md` `ExecutionCapturePort` | 接收完整 `ControlledExecutionRun`，直接返回 `CaptureCollectionOutcome`，adapter 似乎可构造 `CaptureFact`、material rows 和 observability refs | `historical_material`；改为 application 组装 truth，adapter 只返回 typed body-free candidate |
| 同文件 `MaterialHandoffPort` | 接收完整 `HandoffFact` 与 `Vec<CapturedMaterialRef>`，返回 infra-owned `MaterialHandoffAdapterOutcome` | `invalidated_dependency_direction`；改为窄 checked delivery request/result，infra outcome 不暴露给 application trait |
| 同文件 `ObservabilityMaterialPort` | 与普通 material delivery 重复，并将 observability material 当作独立 generic delivery port | `historical_material`；observability material 是 source material，target delivery 由 handoff target selection承接 |
| 正式 `03-详细设计.md` 旧 generic port 段 | 与 Step 6 current object、S7-02 repository 和 facade EOF overlay 冲突 | `historical_reviewed_revalidation_pending`；本批不直接修改正式正文 |
| 旧 `ApplicationResult<T>` generic adapter outcome | finite business observation、transport failure 和 side-effect unknown 混为一层 | `invalidated`；使用 family-specific result / error，并由 application mapper 定格 domain truth |

## 3. SOP 问题回答

### Q1. 哪些模块需要本批接缝？

`domain` 拥有 candidate 之后的 truth factory、guard、decision、material lifecycle 和 handoff aggregate；`application`
拥有 capture / handoff service、UoW 顺序和 external port trait；`infra` 只实现 capture collection / material delivery
adapter 并将 SDK / provider / storage outcome映射为 application-owned finite carrier；`api`、`worker`、`jobs` 只调用
application facade 或后续 maintenance service。

### Q2. capture port 的最小能力是什么？

它只针对一个已提交、terminal-eligible 的 run，收集 body-free output summary、candidate locator / digest / size / safe
summary 和 forbidden-body marker。它不得创建 `CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial`、audit、relay
或 stored result。若 collection side effect 或 material source 的状态无法判定，必须保留同一 capture correlation 供 exact
inspection，不得分配第二个 capture / observability identity。

### Q3. capture candidate 如何成为 truth？

application 先从 exact committed run 读取预绑定 `CaptureFactRef`，生成一次 `ObservabilityMaterialRef`，建立
`CaptureRecordingIdentityBundle`，再绑定 requirement / reason catalog 和 completeness guard。port candidate 经过 guard
纯评估得到 decision；只有同一 candidate、decision、guard、run lineage 和 material set 同时通过
`CaptureFact::record`，才允许进入一个完整 UoW。`Collected + RecordFailed gap` 仍保存安全 material，不能因 status
为 failed 而丢弃 material truth。

### Q4. handoff opening 与 delivery 是否同一能力？

不是。`open_material_handoff` 只验证 source ownership、target plan 和 coverage，创建一个完整 `Pending` aggregate 及
全部 per-target progress；它不调用 delivery adapter。target delivery 是后续按 `(handoff_ref, target_ref)` 逐项创建
attempt、外呼、接收 finite observation 并 CAS 更新 aggregate / material lifecycle 的另一条 L1 flow。

### Q5. 版本、事务和幂等如何闭合？

fresh invocation 先在 reservation-only UoW 完成 idempotency claim 并确认 commit；随后才读取 business owner、生成本次
所需 identity、调用 capture port 或创建 handoff recovery point。任何 external await 前必须释放 UoW；post-call 必须重新读取
exact owner 与 core `Version`。capture material group、handoff opening 和 target observation 各自使用完整 owner group；
stage 成功不等于 committed success，`NotCommitted` 与 `StatusUnknown` 必须分流。

### Q6. 哪些结果是业务 finite outcome，哪些是 port error？

四类 capture collection disposition 和三类 handoff delivery outcome 是有可信业务语义的 finite observation，应进入
typed candidate / observation；请求不合法、无法形成可信 body-free observation、adapter binding 错误、side-effect commit
unknown 或 relation integrity 失败进入 closed port error。不得从 timeout、连接错误、HTTP 状态码或 raw error 文本猜
`SourceUnavailable`、`Retryable` 或 `Delivered`。

### Q7. 本批安全与职责红线是什么？

Sandbox 只证明“材料已由 Sandbox 捕获并按明确 target plan 交接到某 target 的 body-free refs / summaries”；不证明
artifact、runtime、runner、observability store、investigation case 或 acceptance evidence 已形成。delivery 失败、retryable、
publisher failure 和 target partial success 均不能回滚 capture fact、terminal run、其它 target 的成功 progress 或已提交
material。

### Q8. 何时可以结束 B1？

必须同时满足：capture request / candidate / guard / decision / fact 的字段来源与 error closed；material repository key 与
UoW group exact；handoff source / target / progress / aggregate 的一一覆盖和 precedence exact；opening 与 delivery 的
external split、idempotency、unknown recovery、no-rollback 和 fake / durable parity 规则都有唯一 owner；旧 generic port
在正向 surface 中为零。满足后只允许进入 B2，不得自动进入 `S7-G03` 或 Step 8。

## 4. 当前文档问题诊断

| ID | historical gap / conflict | 风险 | B1 处置 |
|---|---|---|---|
| `C-H-D01` | capture port 直接返回 domain fact / material rows | adapter 可越过 domain factory，raw body 或不完整 material 直接成为 truth | adapter 只返回 `CaptureCollectionCandidate`；fact / material 由 application + domain factory 创建 |
| `C-H-D02` | capture request 以完整 run object 或 caller supplied capture ref 为输入 | caller 可提供过期 lineage、替换预绑定 identity 或把 run body带入 infra | request 只携带 checked exact refs；capture ref 从 committed run 读取并重验 |
| `C-H-D03` | `Collected`、required gap、adapter failure 和 source unavailable 没有机械 status matrix | 实现者可能将 `RecordFailed` 丢 material，或把 source unavailable 当普通 gap | 承接 Step 6 closed disposition / gap / status matrix，不允许自由映射 |
| `C-H-D04` | forbidden body 仅在 prose 中禁止 | locator、path、stdout/stderr、SDK object 可能穿透 domain | request/result/error positive fields 采用 body-free closed carrier；forbidden marker 只保留安全 marker |
| `C-H-D05` | capture 与 observability material 只有名称级关联 | failed / unavailable capture 可能无 observability material，或者由日志冒充 material truth | 预绑定 `CaptureRecordingIdentityBundle`，所有 capture status 都创建独立 observability material |
| `C-H-D06` | material key 被误当全局 identity | 不同 capture group 的相同 key 发生覆盖或错误 handoff | repository key 固定为 `(CaptureFactRef, CapturedMaterialKey)` typed composite |
| `C-H-D07` | handoff 只有 aggregate status，没有 per-target progress | `Delivered + Failed` 被最后一条 receipt 覆盖，多目标 partial truth 丢失 | target plan 与 progress set exact 1:1；aggregate status 按固定优先级机械推导 |
| `C-H-D08` | handoff opening 与 delivery 混为一次 adapter call | opening partial、外部 await 持有 UoW、失败回滚边界不明 | opening 只 create Pending aggregate；delivery 另按 target attempt 承接 |
| `C-H-D09` | delivery adapter 返回 infra `MaterialHandoffAdapterOutcome` | application 反向依赖 provider / SDK outcome，错误字符串决定业务状态 | application-owned finite observation / closed error；infra outcome 只在 adapter 内部 |
| `C-H-D10` | unknown / retry 重新创建 handoff、attempt 或 material | side effect 可能重复，形成第二 truth 或重复交付 | exact `(handoff_ref, target_ref, attempt_ref)` inspection；unknown 不盲目新建 |
| `C-H-D11` | handoff failure 被描述为 source rollback | 已捕获 material、terminal owner 或其它 target 可能被删除 | no-rollback matrix 固定 source truth 与 target progress 独立恢复 |
| `C-H-D12` | 普通 observability 与 L1 capture material 混写 | 为“完整”扩展完整日志平台，主体设计周期失控 | B1 只闭合 material truth 和交接边界；普通 hook 延后 B3，保持 L2 |

## 5. 改动前后对比

| dimension | before / historical | B1 current contract | reason |
|---|---|---|---|
| capture port | `ExecutionCapturePort::collect_capture(run, trace)` 返回 generic outcome | `CaptureCollectionPort` 接收 checked body-free request，返回 candidate 或 closed port error，并保留 same-correlation inspect | adapter 不拥有 Sandbox truth，unknown 可恢复 |
| capture identity | caller / adapter 可传 capture ref 或完整 run | run 的已提交预绑定 `CaptureFactRef` 是唯一来源；observability ref 在 application 一次生成并绑定 | 防止第二 identity 和 lineage drift |
| capture status | collection failure、gap、unavailable 混合 | disposition、gap、`CaptureFactStatus` 按 Step 6 矩阵一一映射 | 保留 material truth，避免错误降级 |
| material persistence | generic rows / bulk upsert / key 单独查询 | 逐 candidate 形成 `CapturedMaterialRef`，使用 typed composite key，逐 row `create` | 可审查 cardinality、CAS 和 source lineage |
| observability | optional log / ref，complete-only | 每个 capture status 都有独立 `ObservabilityMaterial`；它不等于 observability store | failed/unavailable 也可安全交接与保留 |
| handoff input | `HandoffFact` + material vector 直接交给 adapter | facade 只提交 source selector + validated target plan；opening factory 生成 aggregate | caller只表达意图，truth由application加载 |
| handoff status | single status / last receipt | target plan与progress 1:1；aggregate fixed precedence | 保留多目标 partial success |
| handoff adapter outcome | infra-owned generic outcome | target-specific application observation：`Delivered | Retryable | Failed` | 依赖方向和错误分类闭合 |
| unknown recovery | timeout后新 attempt / new handoff | exact persisted attempt + same target inspect；unknown 保守保持 recovery state | 避免重复 side effect |
| failure effect | delivery failure可能回滚 capture | capture/run/formal terminal owner 永不回滚；只更新 handoff/material/relay/report owner | source truth 与 delivery truth 分层 |
| observability scope | 试图在本步设计完整平台 | B1只定义 material owner 与最小 handoff relation；普通 hook为B3 L2 | 控制设计周期与主体粒度 |

## 6. 设计取舍

### 6.1 Candidate 与 truth 分层

采用 transient `CaptureCollectionCandidate -> CompletenessDecision -> CaptureFact` 三段链，而不是让 adapter 直接返回
`CaptureFact`。candidate 允许表达本次 collection 的有限观察，guard 负责纯判断，fact factory 负责 immutable truth 和
material cardinality。这样 `Collected + RecordFailed gap` 可以同时保存安全 candidates 与 `Failed` status，不需要在
adapter 中复制 domain policy。

### 6.2 一个 capture fact、一个 observability material

一个 completed run 只有一个预绑定 capture fact；一次 capture recording 只生成一个 observability material ref。两者不是
同一对象，但在同一 group 中原子创建。这样可以在 capture 失败或 source unavailable 时保留 body-free diagnostics，又不会
把 observability store、日志或 downstream receipt当作 Sandbox capture truth。

### 6.3 Opening 与 delivery 分离

handoff opening 不执行网络 / bus / object-store delivery。opening 只完成 ownership decision、完整 Pending progress、
source material lifecycle binding 和 recovery marker；每个 target 后续独立 attempt。这个分离是为了让 opening 的原子性
可证明，也为了让一个 target 的失败不影响其它 target 的已确认 progress。

### 6.4 Aggregate status 只从完整 progress 推导

不保存“最后一次 receipt 决定的总状态”。`Cleanup block > Failed > Retryable > all Delivered > Pending` 是唯一聚合顺序；
cleanup override 不改写 per-target progress。material-specific delivery 另从选中 target 子集推导，不能把无关 target 的
失败传播给本 material。

### 6.5 L1 与 L2 分界

会改变 capture、handoff、cleanup 或 security truth 的 unknown、partial、CAS、no-rollback 属于 L1，必须 exact。普通
latency、retry counter、adapter health、诊断 log、低基数 metric 只在 B3 记录 owner、触发、redaction、failure isolation
和升级条件，不复制完整平台设计。

## 7. Capture collection port：exact application surface

### 7.1 Port owner、调用方和实现方

| item | current contract |
|---|---|
| trait owner | `application::ports::CaptureCollectionPort` |
| application caller | `capture_handoff_service::record_capture_result` |
| durable / fake implementer | `infra::isolation_backend_adapters`；fake 必须支持同一 candidate / error / unknown 分类 |
| source owner | `ControlledExecutionRun` 的 exact terminal snapshot；capture ref 从 run 读取 |
| result owner | application-owned `CaptureCollectionCandidate` |
| domain owner | `CaptureCompletenessGuard`、`CaptureFact`、`CapturedMaterialRef`、`ObservabilityMaterial` |
| external side effect | capture collection；不得在 UoW 内执行 |
| forbidden caller | API / worker 直接持有 adapter；tools、runtime、member service 直接调用 capture backend |

capture collection 是 side-effecting port，所以必须同时提供 initial call 与同 correlation 的 read-only inspection。inspection
不是重新 collection，也不允许由 application 用 `run.status`、Query view 或 latest material scan 代替。

### 7.2 Checked request

```rust
/// 为一个已提交 terminal-eligible run 冻结一次 body-free capture collection correlation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureCollectionRequest {
    /// capture collection 的 exact controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// run 预绑定且本次唯一允许使用的 capture fact ref。
    capture_ref: CaptureFactRef,
    /// 本次 collection 使用的 isolation handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// run、handle 和 candidate 必须相等的 canonical generation。
    generation_ref: ResourceRef,
    /// 已校验的 body-free capture profile / requirement source ref。
    capture_profile_ref: ExternalSourceRef,
    /// 本次 fresh application invocation 已提交的幂等记录 ref；只用于 recovery / completion 关联。
    /// 它不是 capture、material、delivery attempt 或 evidence identity。
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    /// 不参与业务 identity 的 checked trace context。
    trace_context: SandboxTraceContext,
}

impl CaptureCollectionRequest {
    /// 从 exact committed completed run 与已验证 profile 冻结 collection request。
    pub fn try_for_run(
        run: &ControlledExecutionRun,
        capture_profile_ref: ExternalSourceRef,
        idempotency_record_ref: SandboxIdempotencyRecordRef,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, CaptureCollectionPortError>;

    /// 只替换诊断 trace，保持所有 capture correlation 字段不变。
    pub fn for_recovery_trace(
        &self,
        trace_context: SandboxTraceContext,
    ) -> Self;

    /// 返回 exact run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回 run 预绑定 capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回 exact isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 checked profile source ref。
    pub fn capture_profile_ref(&self) -> &ExternalSourceRef;
    /// 返回本次 invocation 的幂等记录 ref；不得解释为外部 operation identity。
    pub fn idempotency_record_ref(&self) -> &SandboxIdempotencyRecordRef;
    /// 返回 trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 校验 candidate 是否仍属于本次 exact collection correlation。
    pub fn matches_candidate(
        &self,
        candidate: &CaptureCollectionCandidate,
    ) -> bool;
}
```

`try_for_run` 的固定校验顺序：

1. run 必须是允许 capture 的 terminal status；当前 capture 主路径只接受已提交 `Completed` run。
2. `run.require_capture_target()` 必须成功，且其返回值等于 `capture_ref`；caller 不得另传 capture ref。
3. handle、generation、context、identity、boundary 的 lineage 从同一个 run snapshot 复制；不得从 adapter 或 Query 补全。
4. profile ref 只能来自已验证 runtime binding；request 不保存 profile body、required count、path、URL 或 provider 参数。
5. `idempotency_record_ref` 只把本次 collection 与已提交 invocation recovery / completion 关联；不得被解释为
   capture fact、material、attempt 或 evidence identity。adapter-side provider key 由已验证 run / handle / generation
   lineage形成，不由该 ref替代。

request 的正向字段闭集不包含 command、argv、environment、stdout、stderr、file bytes、locator path、URL、credential、SDK
response 或 raw error。adapter 可以在内部使用 provider-specific binding，但必须在返回前映射为本节 candidate / error。

### 7.3 Result 与 closed error

```rust
/// 对同一 capture correlation 返回 body-free finite candidate 或严格的 port error。
pub trait CaptureCollectionPort: Send + Sync {
    /// 发起一次 capture collection side effect；不得写 Sandbox repository。
    async fn collect_capture(
        &self,
        request: &CaptureCollectionRequest,
    ) -> Result<CaptureCollectionCandidate, CaptureCollectionPortError>;

    /// 检查同一 request correlation 的既有 collection 结果；不得重新 collection。
    async fn inspect_capture(
        &self,
        request: &CaptureCollectionRequest,
    ) -> Result<CaptureCollectionCandidate, CaptureCollectionPortError>;
}

/// capture adapter 无法形成可信 candidate 或违反 checked request 时的闭合错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureCollectionPortError {
    /// request 的 run / capture / handle / generation relation 不一致。
    RequestLineageMismatch,
    /// request 不是允许 capture 的 terminal owner 或 capture target 缺失。
    RequestWasNotCaptureEligible,
    /// profile binding 不是已验证的 body-free source。
    CaptureProfileBindingInvalid,
    /// adapter 返回的 candidate 与 request correlation 不一致。
    CandidateCorrelationMismatch,
    /// adapter 返回了 forbidden body、path、URL、secret 或 SDK/raw response。
    ForbiddenExternalBody,
    /// adapter 返回的字段组合不能通过 candidate closed relation。
    CandidateRelationInvalid,
    /// adapter / provider 未能形成任何可信 finite observation；side effect 可能已经发生。
    ExternalSideEffectStatusUnknown,
    /// adapter binding 或受控 capture capability 暂不可用，未形成 source disposition。
    AdapterUnavailable,
    /// adapter port 本身违反配置或实现 contract；不携带 raw cause。
    AdapterContractViolation,
}
```

`AdapterUnavailable` 不能自动映射为 `CaptureCollectionDisposition::SourceUnavailable`，除非 adapter 的 checked contract
明确证明 source 本身不可读；否则它是 port error，application 保留 pre-call recovery relation。`ExternalSideEffectStatusUnknown`
也不能映射为 `AdapterFailed`、`SourceUnavailable` 或 `Failed` fact；必须进入 exact inspection。`ForbiddenExternalBody` 是
port-level security error；若 adapter 已形成明确的 `ForbiddenBodyRejected` candidate，则该 candidate 才能作为可记录的
capture attempt truth，且不得携带 locator / material body。

### 7.4 Candidate relation contract

`CaptureCollectionCandidate` 直接承接 Step 6 §16.1 的四类 disposition，application 不增加第五类：

| disposition | required candidate fields | allowed materialization |
|---|---|---|
| `Collected` | matching refs、`Some(ExecutionOutputSummary)`、完整 ordered candidate set、empty forbidden marker、no adapter reason | guard 按 requirement 评估；即使形成 `Failed` gap 仍可保存安全 candidates |
| `AdapterFailed` | matching refs、empty summary / candidates / markers、one safe adapter reason | 不创建 captured material rows；仍创建 capture fact 和 observability material |
| `SourceUnavailable` | matching refs、empty summary / candidates / markers、one safe adapter reason | 不创建 captured material rows；status 为 `Unavailable` |
| `ForbiddenBodyRejected` | matching refs、empty summary / candidates、non-empty marker set、no locator | 不创建 material rows；status 为 `Failed` |

以下关系必须在 candidate constructor 或 port mapper 中拒绝：

- `Collected` 携带 adapter reason、或非空 forbidden marker。
- 非 `Collected` 携带 output summary、candidate material、或空 reason。
- candidate 的 capture / run / generation 与 request 不等；candidate key / locator source / summary source kind 不合法。
- `Collected` 的 output summary 不能证明其 output keys 都来自同一 candidate set。
- 任意 positive field 携带正文、path、URL、provider identity、secret 或 raw response。

## 8. Capture application algorithm

### 8.1 Fresh / duplicate 前置顺序

`record_capture_result` 的公开 input 仍只有：

```rust
pub struct RecordCaptureResultInput {
    run_ref: ControlledExecutionRunRef,
}
```

application 的 exact 顺序固定为：

```text
validate SandboxServiceCallContext + fixed command kind
  -> claim idempotency reservation in reservation-only UoW
  -> commit reservation
       DuplicateReplayed -> read original capture / stored result and return; zero collection call
       Existing / Conflict / InFlight -> typed application error; zero business read / allocation / port
       NotCommitted / StatusUnknown -> reservation inspection or strict hold; zero collection call
       Confirmed -> retain FreshReservationOwnership
  -> exact read ControlledExecutionRun + Version
  -> require run == Completed and capture target unbound
  -> generate exactly one ObservabilityMaterialRef and one CaptureCompletenessGuardRef
  -> build requirement set + reason catalog + CaptureRecordingIdentityBundle
  -> build CaptureCollectionRequest
  -> commit any required pre-call capture recovery relation if the adapter call is not inherently replay-safe
  -> drop UoW and call CaptureCollectionPort::collect_capture
  -> validate candidate against request; on unknown call inspect_capture with same request
  -> fresh-read exact run / capture binding / idempotency relation
  -> build guard and evaluate candidate
  -> build each CapturedMaterialRef from the same candidate
  -> build CaptureFact and ObservabilityMaterial from the same bundle / decision
  -> stage complete capture group and idempotency completion in one UoW
  -> commit confirmed -> return stored result
```

`capture_ref` 不在 capture invocation 内新分配；它来自 `ControlledExecutionRun::prepare` 时已提交的唯一 target。若
pre-call recovery relation需要单独持久化，必须回指同一 `idempotency_record_ref` 与 capture / run lineage，而不是另建
capture attempt truth。是否
需要额外 relay draft 由 source event gate 决定；gate 为 false 时不得分配 relay ref。

### 8.2 Candidate 到 domain truth 的固定顺序

```text
exact completed run snapshot
  -> CaptureCollectionRequest
  -> typed CaptureCollectionCandidate
  -> CaptureCompletenessGuard::bind
  -> CaptureCompletenessGuard::evaluate
  -> CaptureRecordingIdentityBundle::try_for_run
  -> CapturedMaterialRef::from_candidate (one per candidate, when allowed)
  -> CapturedMaterialRefSet::try_for_capture
  -> CaptureFact::record
  -> ObservabilityMaterial::prepare_from_capture
  -> same-UoW repository stage
```

以下顺序禁止：先创建 material 再计算 completeness；用 candidate 的 status 覆盖 guard decision；在 forbidden body 分支
创建 locator；用 query empty 或 page count证明 zero materials；由 observability hook补造 capture fact；adapter 直接写
repository。

### 8.3 Capture status 与 materialization矩阵

| candidate disposition / guard result | `CaptureFact` | captured material rows | `ObservabilityMaterial` | source run |
|---|---|---|---|---|
| `Collected` + no gap | `Complete` | 全部安全 candidates | `Prepared` | 不变；仍是 `Completed` |
| `Collected` + only `RecordPartial` gaps | `Partial` | 全部安全 candidates | `Prepared`，含 diagnostic signal | 不变 |
| `Collected` + any `RecordFailed` gap | `Failed` | 全部安全 candidates，不能丢失 | `Prepared`，含 diagnostic signal | 不变 |
| `AdapterFailed` | `Failed` | 0 | `Prepared`，含 diagnostic signal / safe reason | 不变 |
| `SourceUnavailable` | `Unavailable` | 0 | `Prepared`，含 diagnostic signal / safe reason | 不变 |
| `ForbiddenBodyRejected` | `Failed` | 0；不得保存 locator | `Prepared`，保留 marker，不保存正文 | 不变 |

capture status 描述 capture attempt，不改变 `ControlledExecutionRun` lifecycle。`Failed | Unavailable` 需要后续 failure /
cleanup owner 处理时，application 只登记 typed obligation 或安全 marker；不得在本 flow 直接把 run 改为 failed。

### 8.4 Atomic write set

在 post-collection fresh UoW 中，必须按以下逻辑依赖顺序 stage：

1. 从 exact committed run / capture binding读取 source relation；run 不写回，除非后续 owner contract明确要求 capture marker。
2. `create_capture_fact`（immutable fact repository 的 exact method 名由已完成 `S7-02C` surface 承接）。
3. 对每个 safe candidate 调用 `CapturedMaterialRepository::create_captured_material(material, uow)`；key 必须是
   `CapturedMaterialRepositoryKey::new(capture_ref, material_key)`，不得按 material key 单独写入。
4. 调用 `ObservabilityMaterialRepository::create_observability_material(observability_material, uow)`。
5. stage required audit、conditional relay / projection marker 和 typed stored result。
6. 以 matching operation / digest 更新 idempotency completion。
7. commit confirmed 后才返回 fresh `SandboxServiceOutcome`。

`CaptureFact`、每个 material row、observability material、required audit、required relay relation 和 stored result 属于
同一可见性 group。任一 stage error 在 commit 前发生时，整组 rollback；rollback failure / unknown 进入 integrity hold，
不得返回 partial success。source run 不回滚，也不能因 capture group失败而被删除或重建。

### 8.5 Commit-unknown recovery

| boundary | exact inspection | allowed result | forbidden |
|---|---|---|---|
| reservation commit unknown | operation key + request digest + idempotency record | `DuplicateReplayed`、`FreshReservationConfirmed` 或 `Indeterminate`；后者 hold | 读取 run、生成 observability ref、调用 capture |
| collection call unknown | exact `(run_ref, capture_ref, idempotency_record_ref, generation)` plus provider-side run/handle key via `inspect_capture` | matching finite candidate；否则保留 recovery state | 新 capture ref、blind retry、把 timeout当SourceUnavailable |
| finalization commit unknown | exact capture ref、observability ref、material composite keys、stored surface 和 idempotency relation | whole group `Committed`、`FullyAbsent` 或 `Indeterminate`；只有完整 group 才可 replay | 用内存对象猜提交、缺一行就补写或生成第二 identity |

`FullyAbsent` 只有在 repository / idempotency exact inspection 证明整组没有任何 committed relation 时，才允许由新的显式
recovery invocation沿用原 capture ref继续；若出现 capture fact 已有但 material / observability / stored relation缺失，必须
进入 integrity / quarantine 路由，不得把缺行当作“尚未执行”而重复 collection。

## 9. Handoff opening：source snapshot 与 exact load

### 9.1 Opening 的 callable 边界

本节只定义 `open_material_handoff` 的 opening kernel。它消费已经提交的 Sandbox source，创建一个尚未执行任何
downstream delivery 的 handoff aggregate。它不调用 `MaterialHandoffPort`、`ObservabilityMaterialPort`、publisher、bus、
object-store 或任意下游业务 API。

公开 facade input 保持 Step 7 §10 的唯一形状：

```rust
pub struct OpenMaterialHandoffInput {
    source: MaterialHandoffSourceSelector,
    target_plan: HandoffTargetSet,
}
```

以下字段永远由 application / domain 形成，不能从 caller input 读取：

| field | canonical owner | opening rule |
|---|---|---|
| `handoff_ref` | `SandboxIdentityAllocator` | 只有 reservation confirmed 且 source/plan shape 可进入 ownership evaluation 后分配；recovery 复用原值。 |
| `ownership_guard_ref` | `SandboxIdentityAllocator` | 与本次 handoff evaluation 一一对应；不由 target plan 字符串派生。 |
| `opened_at` / evaluation time | trusted application clock | 同一 opening assembly 只读取一次；不使用 backend time、caller time 或 receipt time。 |
| `audit_trace_ref` | application audit kernel | 在 write group 内形成并与 source / decision / handoff exact 关联。 |
| `relay` / projection marker | source event gate / projection owner | 只在 gate 明确要求时分配；opening 不发布、不调用 publisher。 |
| `stored_result_ref` / surface ref | idempotency / stored-result kernel | 由 reservation whole-group 计划冻结；duplicate 不重新分配。 |
| `Version` | repository read | 只来自同一 committed snapshot；caller 不得提交版本。 |

`HandoffFactRef` 在 rejected ownership decision 中可以作为本次评估的 transient correlation，但 rejected branch 不创建
`HandoffFact`、不绑定 source material、不产生 delivery attempt。只有 `HandoffFact::open` 成功并进入 opening write set
后，该 ref 才成为已提交 handoff truth identity。

### 9.2 Application-owned transient source carrier

source load 必须先形成一个 application-private、body-free、不可直接对外暴露的完整 carrier。它不是 domain truth、DTO、
repository root 或新的 identity owner；它只把同一 committed snapshot 中的对象交给 guard / factory。

```rust
/// open_material_handoff 在同一 committed snapshot 中使用的 transient source carrier。
/// 不进入 public DTO，不提供 latest / scan / repair 方法。
pub enum OpenHandoffSourceSnapshot {
    Capture {
        run: Versioned<ControlledExecutionRun>,
        capture: ImmutableSnapshot<CaptureFact>,
        materials: Vec<Versioned<CapturedMaterialRef>>,
        observability_material: Versioned<ObservabilityMaterial>,
    },
    TerminalRun {
        run: Versioned<ControlledExecutionRun>,
        terminal_owner: TerminalHandoffOwnerSnapshot,
        observability_material: Versioned<ObservabilityMaterial>,
    },
}

/// terminal basis 与 source-owned material binding 的 transient union。
/// 不拥有 FailureClassification / ControlFact / RedlineContainment 的 truth。
pub enum TerminalHandoffOwnerSnapshot {
    Failure(ImmutableSnapshot<FailureClassification>),
    Control(Versioned<ControlFact>),
    Redline(Versioned<RedlineContainment>),
}
```

上面的 carrier 不是对现有 repository trait 的新增 generic `load_group` API。它表示 application load kernel 必须完成的
最小 join；具体 reader 由 `7R-04` / `READ-001` 的 exact read surface 提供。任何实现若需要按时间、latest、全表扫描、
Query view、日志或 material key 反查 source，都违反本节。

### 9.3 Capture source exact load

`MaterialHandoffSourceSelector::Capture { capture_ref }` 的加载顺序固定如下：

```text
open committed read snapshot
  -> get exact ControlledExecutionRun by run binding of the selected capture
  -> require run.status == Completed
  -> require run.capture_ref == input.capture_ref
  -> get exact immutable CaptureFact by capture_ref
  -> get all expected material rows by (capture_ref, material_key)
  -> get exact expected ObservabilityMaterial by CaptureFact.expected_observability_material_ref
  -> assemble OpenHandoffSourceSnapshot::Capture
  -> validate whole-group lineage and cardinality
```

每一个读取步骤都必须使用相同的 committed read snapshot。不能先读 capture fact，再重新开 snapshot 读 material；也不能
对每个 material row 单独读取后以 latest Version 拼接。完整性条件如下：

| relation | required exact condition | fail-closed result |
|---|---|---|
| run status | `Completed` | `SourceRunNotCaptureEligible`；不降格为 terminal source。 |
| run binding | run 的预绑定 `capture_ref` 等于 selector | `CaptureSourceLineageMismatch`。 |
| capture lineage | capture 的 run/context/identity/boundary/handle/generation 与 run 全等 | `CaptureSourceLineageMismatch`。 |
| expected key set | material rows 的 `(capture_ref, material_key)` 集合与 `CaptureFact` immutable key set 双向相等 | `CaptureMaterialGroupIncomplete`。 |
| material row state | 每行属于该 capture、lineage 全等、`can_open_handoff()` 为 true、未绑定其它 handoff | `CaptureMaterialNotOpenable` 或 `HandoffSourceAlreadyBound`。 |
| observability relation | ref 等于 capture 预绑定 ref；source basis 为 matching `Capture`；run/generation/status/disposition 全等 | `CaptureObservabilityRelationMismatch`。 |
| observability lifecycle | opening 前必须是 `Prepared` 且 `handoff_ref == None` | 已绑定则 `HandoffSourceAlreadyBound`；其它 shape 为 integrity error。 |
| body boundary | locator、path、URL、正文、provider response、secret 和下游 truth identity 均不存在于 carrier | `ForbiddenExternalBody`。 |

`CaptureFactStatus` 可以是 `Complete`、`Partial`、`Failed` 或 `Unavailable`，但它必须原样保留。`Partial` / `Failed` 的
安全 material rows 仍必须全部加载和覆盖；`Unavailable` 或 zero-material `Failed` 只允许在 immutable fact 已明确保存
zero-material relation 时形成空 set。缺 row、读不到 row、Query 返回空页都不是 zero-material proof。

### 9.4 Terminal run exact load

`MaterialHandoffSourceSelector::TerminalRun { run_ref }` 不允许通过缺失 capture row 推导。它必须消费 formal terminal owner
已提交的 source binding：

```text
open committed read snapshot
  -> get exact ControlledExecutionRun by run_ref
  -> require run.status in {Failed, Terminated}
  -> require run.terminal_basis is present and kind/status compatible
  -> load the formal terminal owner named by terminal_basis
  -> load the owner-persisted exact observability material binding
  -> get ObservabilityMaterial by that exact material ref
  -> assemble OpenHandoffSourceSnapshot::TerminalRun
  -> validate owner, material source basis and lineage as one group
```

terminal source 的 observability ref 必须来自 formal terminal preservation / source-binding relation。当前 mutable
`ObservabilityMaterialRepository` 只有按 named material ref 的 exact read；因此 application 不得自行增加
`find_latest_by_run`、`scan_by_run` 或“唯一一行” fallback。若 `READ-001` 的 exact reader 没有返回 owner-to-material binding，
opening 直接返回 typed `TerminalObservabilityBindingUnavailable` 或 integrity error，不能分配新的 material ref，也不能
把 terminal source 伪装成 capture source。

terminal branch 的闭合矩阵：

| terminal basis | allowed run status | required owner | required material source basis | allowed target kinds |
|---|---|---|---|---|
| `Failure(failure_ref)` | `Failed` | exact `FailureClassification` with matching run/context/lineage | `ObservabilityMaterialSourceBasis::TerminalRun { run_status: Failed, terminal_basis: Failure(failure_ref) }` | `Observability`，有明确需要时 `Investigation` |
| `Control(control_ref)` | `Terminated` | exact `ControlFact` with matching termination basis | matching `TerminalRun { Terminated, Control(control_ref) }` | `Observability`，有明确需要时 `Investigation` |
| `Redline(redline_ref)` | `Terminated` | exact `RedlineContainment` / redline termination proof | matching `TerminalRun { Terminated, Redline(redline_ref) }` | `Observability` + `Investigation` 两类均须覆盖 |

terminal source 必须满足：`capture_ref == None`、captured material set 为空、observability material lifecycle 为
`Prepared`、`handoff_ref == None`。任何 captured selection、completed run、缺 formal owner、wrong terminal basis、错误
generation 或已绑定 handoff 都是 typed rejection / integrity error，不是可重试的普通 delivery outcome。

### 9.5 Source load 与 target plan 的边界

source load 只证明 Sandbox-owned source group 已提交且可被 ownership guard 消费；它不证明 target 存在、可用、已接收或
拥有下游 formal truth。target plan 只表达受信任 entry 已构造的 typed intent。application 在 opening 前仍必须重验：

1. `HandoffTargetSet` 非空、ordered-unique、target kind 与 `ExternalSourceKind` 相匹配。
2. `EventRelay` 与 `Other` 不得进入普通 material handoff；relay 只能走独立 relay owner。
3. `CapturedMaterials` / `CapturedAndObservability` 的 key set 非空，且每个 key 必须属于已加载 source set。
4. `ObservabilityMaterial` / `CapturedAndObservability` 的 ref 必须等于 source snapshot 的 exact observability ref。
5. target selection 内部不能重复 key；target 之间允许显式重复同一 source key，但不得借重复项掩盖未覆盖 key。
6. plan 不携带 attempt、receipt、aggregate status、artifact/evidence identity、observability-store identity 或正文。

输入 shape 错误在 ownership evaluation 前返回 typed application error；合法但不满足 source ownership 的 plan 进入
`HandoffOwnershipDecision::Rejected`，以固定 rejection kind / subject / reason 记录，不能创建 partial aggregate。

## 10. Handoff ownership evaluation 与 opening decision

### 10.1 Fresh opening 的固定顺序

```text
validate SandboxServiceCallContext + OpenMaterialHandoff operation
  -> claim idempotency reservation in reservation-only UoW
  -> commit reservation
       DuplicateReplayed -> read exact stored result and return; zero source load / allocation / write / delivery
       Existing / Conflict / InFlight -> typed application error; zero business load and zero delivery
       NotCommitted / StatusUnknown -> reservation inspect or strict hold; zero business load and zero allocation
       Confirmed -> retain FreshReservationOwnership
  -> exact-load source snapshot from §9
  -> revalidate target-plan shape and source binding
  -> allocate handoff_ref and ownership_guard_ref exactly once
  -> build fixed HandoffOwnershipReasonCatalog
  -> bind_capture_source(...) or bind_terminal_source(...)
  -> evaluate immutable target plan
       Rejected -> stage rejection audit + stored result + idempotency completion; no HandoffFact/material transition
       Allowed  -> continue to HandoffFact::open
  -> open full Pending aggregate
  -> stage source lifecycle transitions and whole opening group
  -> commit confirmed -> return accepted opening outcome
```

`HandoffOwnershipGuard::evaluate` 是纯函数式 domain evaluation：它不读 repository、不分配 target attempt、不调用
adapter，也不修改 source。rejection precedence 固定为：

```text
TerminalTargetRejected
  > TargetSelectionRejected
  > SourceMaterialMismatch
  > IncompleteCoverage
```

同一 rejection kind 按 target plan 的 canonical 顺序取首个 subject；不得以迭代最后一项、raw error 文本或 caller 自带
reason 改写决定。`Allowed` decision 的四类 rejection 字段全部为 `None`；`Rejected` decision 的 kind、subject、reason
必须全部存在。

### 10.2 Rejected ownership branch

合法 target carrier 但 ownership 不允许时，opening 命令只记录拒绝事实：

| item | rejected branch rule |
|---|---|
| `HandoffFact` | 不创建。 |
| `HandoffTargetProgress` | 不创建；不存在独立 progress row。 |
| captured material rows | 不改变 `Captured` / 既有 retention status。 |
| observability material | 不改变 `Prepared`。 |
| delivery adapter | 调用次数为 0。 |
| audit | 必须保存 decision kind、finite rejection kind/subject、source lineage 和 safe reason；不得保存正文。 |
| relay / projection | 只有 rejection event gate 明确要求时保存 marker；不发外部 relay。 |
| stored result | 保存完整 rejected surface，并与同一 idempotency completion 关联。 |

rejected branch 的 `HandoffFactRef` 若仅作为 decision correlation 出现，不能被 query、retry job 或 cleanup 当作已存在
handoff root。任何后续以该 ref 读取到半成品都属于 integrity violation。

### 10.3 Allowed decision 的 source-to-fact 约束

只有 `decision.allows_handoff()` 为 true 时，application 才能调用：

```rust
HandoffFact::open(
    &guard,
    decision,
    &source_observability_material,
    &source_materials,
    audit_trace_ref,
    opened_at,
)
```

调用前必须再次验证以下 relation，防止 transient source 在 guard evaluation 后被替换：

| check | required relation |
|---|---|
| decision / guard | guard ref、handoff ref、source refs、generation、target plan 完全相等。 |
| capture branch | source materials keys 等于 guard `available_material_keys()`；每项 row 仍 `can_open_handoff()` 且 handoff 未绑定。 |
| terminal branch | `source_materials.is_empty()`；run terminal basis 与 material source basis 全等；没有 capture ref。 |
| source material | observability material ref 与 guard/decision 一致；material lifecycle 仍为 `Prepared`。 |
| target coverage | capture keys 与 observability ref 的 coverage 仍满足 Step 6 §21.3；不能由 application 另算一套 aggregate。 |

任何 relation 失败均返回 `HandoffSourceChangedDuringOpening` / chained domain error；不得重新 bind 新 guard、生成第二个
handoff ref 或用 latest source 重试。

## 11. `HandoffFact::open` 的完整 Pending 形状

### 11.1 Aggregate 与 progress cardinality

`HandoffFact::open` 必须一次性生成完整 aggregate，不能先写 handoff root 再补 progress。对于 `N = target_plan.len()`：

```text
target_plan.len() == N, N >= 1
target_progress.len() == N
target_plan[i].identity == target_progress[i].identity for every i
target_progress[i].progress_status == Pending
target_progress[i].attempt_ref == None
target_progress[i].receipt_ref == None
target_progress[i].status_reason == None
target_progress[i].retry_not_before_age_millis == None
target_progress[i].attempt_count == 0
target_progress[i].attempt_started_at == None
handoff_status == Pending
cleanup_guard_ref == None
status_reason == None
```

target plan 顺序必须原样传入 progress set。禁止按 target kind 排序后丢失 entry order，禁止将 progress 保存成独立
repository，禁止以 `Vec<Option<...>>` 或缺行表示尚未创建。`Attempting`、receipt、retry age 和 failure reason 只能在
后续 `MUT-G08/G09` target flow 中出现。

### 11.2 Opening factory 的 reject set

`HandoffFact::open` 或其 application wrapper 必须拒绝：

- decision 不是 `Allowed`，或 decision / guard 的 handoff ref 不一致；
- source run、context、identity、boundary、handle、generation 任一 lineage 不一致；
- capture source 的 material key set 与 guard available set不等，或 terminal source携带任何 captured row；
- source observability material 已有 handoff、状态不是 `Prepared`，或 ref/source basis不匹配；
- target plan 与 decision 不同、target/progress coverage 不完整、任何 progress 非 `Pending` shape；
- timestamp 早于 source owner status / material prepared time / guard activation time；
- input、factory 或 repository carrier携带正文、path、URL、secret、SDK response 或下游 formal identity。

这些是 opening integrity/domain errors，不得映射成 `Retryable`、`Failed` target observation，也不能调用 delivery adapter。

## 12. `MUT-G07` opening UoW 与 source material lifecycle

### 12.1 Exact write set

在 source snapshot 与 `Allowed` decision 已确认后，opening 使用一个新的 write UoW。UoW 不跨任何 external await。逻辑
stage 顺序固定为：

```text
read exact source Version / relation snapshot
  -> create HandoffFact(Pending) with complete target progress
  -> for each selected CapturedMaterialRef (once per material key):
       mark_handoff_pending(handoff, audit_trace_ref, opened_at)
       save_captured_material(material, expected_material_version, uow)
  -> mark_handoff_pending on source ObservabilityMaterial once
       save_observability_material(observability_material, expected_material_version, uow)
  -> stage required audit trace and source relation
  -> stage conditional relay / projection marker
  -> create typed stored result carrier / surface
  -> mark idempotency completion with exact operation digest
  -> commit UoW
```

对应 repository / owner group：

| root / relation | operation | cardinality | CAS / create rule |
|---|---|---:|---|
| `HandoffFact` | `HandoffFactRepository::create_handoff` | exactly 1 | insert-if-absent；对象必须已经包含全量 progress。 |
| captured material | `CapturedMaterialRepository::save_captured_material` | 每个 source key exactly 1；同 key只保存一次 | 使用该 row 同一 snapshot 的 core `Version`；不按 target 次数重复保存。 |
| observability material | `ObservabilityMaterialRepository::save_observability_material` | exactly 1 | 使用 source snapshot Version；capture/terminal 两分支均必须执行。 |
| immutable audit | staged append | required 1 或由 owner gate明确的有限集合 | 与 handoff/source/decision lineage同组；不能 post-commit best-effort补 required audit。 |
| relay/projection marker | conditional | gate为 true 时 exact required relation | 不调用 publisher；marker failure按组失败。 |
| stored result / idempotency | exact one completion relation | exactly 1 | stored carrier、surface、record ref、digest四者全等。 |

capture source 没有 material rows 时仍必须保存 observability material 的 `HandoffPending` transition；不能用零 captured
rows 跳过 source observability lifecycle。terminal source 只更新 observability material，不创建或更新 capture fact。

### 12.2 Atomicity 与 no-rollback matrix

| 发生点 | 本次 opening 可见性 | 已提交 source truth | 处置 |
|---|---|---|---|
| source read / guard bind 失败 | 无 opening write | 不变 | typed error；不分配 delivery identity。 |
| target ownership rejected | 无 handoff aggregate | capture/run/terminal owner/material 不变 | 保存 rejected surface / audit（若该分支要求），不创建 progress。 |
| `create_handoff` 或任一 material stage 失败 | 整个 G07 不可见 | 已提交 capture fact、run、terminal owner不回滚 | rollback；返回 typed failure；不得留下 partial opening。 |
| required audit / relay marker / stored stage 失败 | 整个 G07 不可见 | source truth不回滚 | rollback；marker 不得由普通 telemetry替代。 |
| commit 明确 `NotCommitted` | 整组明确不可见 | source truth不变 | 进入 exact absent inspection；只能沿原 reservation / identity recovery。 |
| commit `StatusUnknown` / rollback unknown | 不能判定 opening 是否可见 | 任何既有 source truth保持 | 冻结原 handoff / operation identity，进入 integrity hold；不重开、不delivery。 |
| opening 已提交，后续 target delivery 失败 | opening 与已成功 progress 保留 | capture/run/terminal owner保留 | 只更新对应 target/material lifecycle；禁止 source rollback。 |

`HandoffFactStatus::Pending` 只是 opening 后的 domain aggregate status，不表示 command 未完成。opening command 在 G07
commit confirmed 后返回 `ServiceOutcomeStatus::Accepted`，其 truth refs 至少包含 `HandoffFactRef`，side effect 包含
`SandboxSideEffectRef::MaterialHandoff(handoff_ref)`；它不包含 receipt，也不表示任何 target 已接收。

### 12.3 Source lifecycle synchronization invariant

opening commit 后必须成立：

```text
every selected CapturedMaterialRef.handoff_ref == Some(handoff_ref)
every selected CapturedMaterialRef.material_status == HandoffPending
source ObservabilityMaterial.handoff_ref == Some(handoff_ref)
source ObservabilityMaterial.material_status == HandoffPending
HandoffFact.target_progress is complete 1:1 Pending
HandoffFact.handoff_status == Pending
CaptureFact is byte-for-byte immutable and unchanged
ControlledExecutionRun is unchanged
formal terminal owner is unchanged
```

同一 captured material 被多个 target 选择时，只发生一次 lifecycle transition；target 数量不能乘大 material 保存次数。
`HandoffFact` 的 aggregate status 不得反写 `CaptureFactStatus`，也不得将 `HandoffPending` 解读为下游未创建 formal truth。

## 13. Duplicate、race 与 commit-unknown recovery

### 13.1 Duplicate / conflict matrix

| reservation / source relation | exact action | forbidden action |
|---|---|---|
| same operation + same digest + completed stored surface | read exact stored result and return `DuplicateReplayed` | load source、allocate handoff/guard、读 current material、调用 adapter。 |
| same operation + different digest | typed idempotency conflict | 以新 target plan覆盖旧 operation。 |
| same operation reservation `InFlight` | typed in-flight result | 并发打开第二 handoff。 |
| different operation，source already bound to same existing handoff | typed `HandoffSourceAlreadyBound` / conflict；保留已有 handoff | 创建第二 handoff 或迁移 source ownership。 |
| source binding与stored result不一致 | integrity error / recovery hold | 读取 latest 选择一个 winner。 |
| `create_handoff` unique collision | exact handoff + source + stored relation inspection | 把 `AlreadyExists` 直接当 duplicate 或生成新 ref。 |

duplicate replay 的 stored surface 必须包含原始 source selector digest、原始 target plan、原始 `HandoffFactRef` 和 opening
outcome；当前调用的 trace、time、target status 或 source material 不得替换 frozen fields。

### 13.2 Opening group inspection

opening commit unknown 只允许使用原 operation / handoff identity 执行只读 whole-group inspection。inspection 必须同时核对：

1. idempotency record 是否为该 operation、request digest、handoff result kind 和 stored result ref；
2. `HandoffFact` 是否存在且 lineage、target plan、全量 progress、status `Pending` 完整相等；
3. 每个 captured material row 的 handoff ref、status、audit ref 和 expected core Version relation；
4. observability material 的 handoff ref/status/source basis/generation；
5. required audit、conditional relay/projection marker、stored carrier/surface 是否齐全；
6. source capture fact、run、formal terminal owner 是否保持原 immutable / terminal shape。

inspection 结果闭集：

| result | required proof | recovery action |
|---|---|---|
| `FullyCommitted` | 上述全组 cardinality、lineage、status、stored relation 均完整 | 只 replay 原 stored opening outcome；不执行任何 transition 或 external call。 |
| `FullyAbsent` | handoff root、opening material transitions、required audit、stored completion 均明确不可见；source 原状态未被 opening 改写 | 可由显式 recovery invocation 沿用原 reservation、原 handoff identity 和原 plan重做同一 G07。 |
| `Indeterminate` | 任一半提交、relation缺失、snapshot unavailable、rollback unknown 或结果互相矛盾 | integrity / quarantine hold；不补行、不删除、不重开、不delivery。 |

`FullyAbsent` 不是“handoff row查不到”。例如 handoff root 缺失但一个 source material 已经是 `HandoffPending`，必须是
`Indeterminate`；不能把 source row 当作可忽略的 projection。任何 partial group 都禁止使用 new `HandoffFactRef` 修复，
也禁止以 latest row 选择 winner。

### 13.3 Recovery identity rule

recovery 复用：

```text
same operation name
same idempotency key / request digest
same SandboxIdempotencyRecordRef
same HandoffFactRef candidate
same source selector
same ordered target plan
same source material / observability refs
```

recovery 不复用：current time、new audit identity（除非 recovery audit owner明确要求追加）、new target attempt、new
observability material ref 或 new capture ref。opening recovery 仍不调用 delivery adapter；只有 `FullyCommitted` 才能返回
原结果，只有 `FullyAbsent` 才能重新执行同一 opening write group。

## 14. B1-C 静态审计与完成门禁

### 14.1 Contract closure

| audit item | required | current result |
|---|---:|---:|
| source selector variants | 2 | 2/2：`Capture`、`TerminalRun`；无散装 material input。 |
| capture source exact load | 1 | 1/1：run/capture/all composite material rows/observability 同 snapshot，cardinality 双向相等。 |
| terminal source exact load | 1 | 1/1：run/terminal owner/material binding 同组；缺 binding fail-closed；无 run scan/latest fallback。 |
| target plan shape guard | 1 | 1/1：kind/source/selection/uniqueness/body-free revalidation。 |
| ownership decision | 2 | 2/2：`Allowed` / `Rejected`；rejection precedence、subject、reason固定。 |
| progress coverage | 1 | 1/1：target plan 与 progress exact 1:1，全部初始 `Pending`。 |
| opening UoW | 1 | 1/1：`MUT-G07` create handoff + source lifecycle + audit/conditional marker/stored completion。 |
| delivery call in opening | 0 | 0；delivery、attempt、receipt、retry留给 B1-D。 |
| independent progress repository | 0 | 0。 |
| source rollback on opening/delivery failure | 0 | 0；capture/run/formal terminal owner不回滚。 |
| raw body / provider response / downstream truth positive field | 0 | 0。 |

### 14.2 Fake / durable parity obligation

尚未执行测试；以下是实现阶段必须满足的 parity contract，不是测试结果：

| dimension | durable adapter | deterministic fake | required parity |
|---|---|---|---|
| source snapshot | same exact named refs and snapshot cardinality | same carrier factory and cardinality checks | fake 不允许省略 material/observability relation。 |
| ownership rejection | same finite rejection kind/subject/reason | same finite result for same source/plan | 不以 fake bool 直接返回 rejected。 |
| progress shape | one aggregate with embedded 1:1 progress | same aggregate factory | 不产生 fake-only progress repository。 |
| lifecycle transition | all selected rows once + obs once | same transition count and state relation | 不按 target 数量重复写 material。 |
| commit failure | `NotCommitted` / `StatusUnknown` distinction | inject same distinction | fake 不把 unknown 当 absent。 |
| duplicate | exact stored replay, zero source mutation | same zero-write replay | fake 不重建 current source。 |
| partial opening | whole group invisible | whole group invisible | 不暴露 partial success。 |
| body boundary | same forbidden-body rejection | same rejection and no raw payload retention | fake 不保存 path/body/SDK object。 |

### 14.3 Residual owner and stop point

`SBX-DDD-GRANULARITY-STEP7-READ-001` 仍是既有 Step 7 内部 blocker，owner 为后续 `7R-04` exact read surface；本批不把
它伪标为 resolved，也不把它升级为新的 L1/L2 上游 blocker。B1-C 对 reader 的要求已经冻结为：

- exact selector -> one committed source snapshot；
- capture source 使用 `(CaptureFactRef, CapturedMaterialKey)` composite key；
- terminal source 使用 formal terminal owner persisted binding；
- missing / half-commit / snapshot unavailable 都是 typed error 或 `Indeterminate`；
- reader 不创建 identity、写 truth、调用 external port 或修复缺行。

B1-C 至此完成。下一批只允许进入 `S7-03C-B1-D`：application-owned checked delivery request、attempt-before-call、
per-target finite observation、same-attempt unknown recovery、aggregate precedence 的 delivery 侧审计和 no-rollback
matrix。不得在 B1-D 中重开 source selector、`HandoffFact::open` 或 progress repository 边界。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1
completed_sub_batch = B1-A,B1-B,B1-C
next_sub_batch = B1-D handoff delivery boundary / unknown / no-rollback
B1-C_status = completed
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-03C-B1-D-2` completed, user review pending

本节追加于本文件真正物理 EOF，是当前唯一权威恢复点。中部 `B1-D-2` 详细段落和早期 `B1-D-1` 段落均保留为历史轨迹；
当前恢复必须先读取本节，再按下表定位详细契约。

| current item | value |
|---|---|
| document / step | `03-详细设计.md` / Step 7 regression / `S7-03C` |
| completed batch | `S7-03C-B1-D-2` |
| artifact | `03_ddd_step_07_capture_handoff_publisher_observability.md` |
| detailed contract | historical-position `B1-D-2` sections `§16.1~§17.6`；本节重新声明其 current applicability |
| next batch | `S7-03C-B1-D-3` same-attempt inspection and post-call UoW/CAS |
| next action | `wait_user_review_before_B1-D-3` |
| new L1/L2 upstream blocker | `0` |
| existing Step 7 blockers | `DISPATCH/OUTCOME/READ/ENTRY = 4/6 open with owner`; `READ-001` remains open |
| formal `03-详细设计.md` | unchanged; `historical_reviewed_revalidation_pending` |
| implementation | `CB-SBX-01A blocked / wait_design` |
| real execution / evidence | not started / not created |
| commit required | `no` |

### Current contract digest

`MUT-G08` 的唯一允许顺序是：exact target selection -> allocate typed attempt ref -> fresh-read full handoff/source/binding
snapshot -> `HandoffFact::begin_target_attempt` -> same-UoW stage existing handoff/audit/recovery relation -> handoff `Version`
CAS commit confirmed -> rebuild checked body-free `HandoffTargetDeliveryRequest` from committed Attempting row -> release UoW
and call `deliver` once. 不创建 progress/attempt 独立 repository 或 generic index；不确认 commit 不外呼。

candidate 只有 `Delivered`、`Retryable`、`Failed` 三个 variant。application 必须 exhaustive-match，并分别通过
`HandoffReceiptRef::try_from_adapter`（仅 Delivered）和既有
`HandoffTargetDeliveryObservation::try_from_adapter`；candidate 不得携带或改写 handoff/target/attempt/generation、时间、
aggregate/material status 或 provider body。`observed_at` 使用 trusted Sandbox clock，且不早于 committed attempt start。

durable adapter 与 deterministic fake 共享 request/carrier validator、correlation/body redlines、三分支 mapping、call-count
和 side-effect-unknown boundary；不构造 domain observation、不写 Sandbox repository、不生成真实 evidence。B1-D-3 才处理
same-attempt inspection、post-call fresh-read/CAS、stored receipt/recovery 和 commit-unknown inspection。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-2 completed_wait_user_review
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1,B1-D-2
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
next_allowed_action = wait_user_review_before_B1-D-3
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
outcome_blocker = open_wait_s7_03c_s7_05
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批不修改正式正文，不进入 `B1-D-3`、`B1-D-4`、`B1-E`、B2、Step 8 或实现；未生成实现 commit、run_id、真实 evidence
alias、验收签署或测试结果。

---

## Historical-Position Draft (superseded by physical EOF): `S7-03C-B1-D-2` contract summary

该段落曾被插入到中部，现只保留为 historical-position material；真正 current authority 位于本文件物理 EOF。

### Current B1-D-2 contract

#### G08 pre-call sequence

1. 从 immutable target plan 的 exact `(handoff_ref, target_ref)` selection 生成唯一
   `HandoffDeliveryAttemptRef`；不复用 receipt、idempotency ref 或旧 attempt。
2. 在任何 external call 前打开短 UoW，fresh-read `HandoffFact`、selected `HandoffTarget`、嵌入的
   `HandoffTargetProgress`、required body-free material rows、adapter binding/generation 和全部 expected `Version`。
3. 对 fresh aggregate 调用 `HandoffFact::begin_target_attempt(...)`；仅允许 `Pending` 或 age 已满足的 `Retryable`，结果必须是
   `Attempting`，由 domain 校验 attempt count、timestamp、target relation 和 retry age。
4. 在同一 UoW stage handoff aggregate、已有 audit/recovery relation 和 required stored linkage；不创建 progress/attempt 独立
   repository 或 generic index。
5. 以 handoff core `Version` CAS commit，并明确确认 committed；CAS loser、未提交或 commit unknown 都不得外呼。
6. commit confirmed 后，从 committed `Attempting` row 和同一 checked source snapshot 构造
   `HandoffTargetDeliveryRequest`；request 不暴露 `Version`、UoW、idempotency ref、正文或 provider detail。
7. 释放 UoW 后调用 matching adapter `deliver(request)` 一次；adapter 只返回 candidate 或闭集 port error，不直接写 Sandbox
   truth。

`Delivered`、`Retryable`、`Failed` 是 candidate 的全部业务分支。`Attempting` 不得新建 attempt；cleanup block、terminal
   progress、not-ready retry 和 relation integrity error 都不调用 adapter。多 target 按 immutable plan 顺序逐个处理，不提前
   批量分配 attempts。

#### Candidate mapping

```text
HandoffDeliveryOutcomeCandidate::Delivered { receipt_ref }
  -> HandoffReceiptRef::try_from_adapter(loaded_target kind/ref, receipt_ref)
  -> HandoffTargetDeliveryOutcome::Delivered { typed receipt }
  -> HandoffTargetDeliveryObservation::try_from_adapter(
       committed handoff_ref, loaded target, committed attempt_ref, outcome, trusted observed_at)

HandoffDeliveryOutcomeCandidate::Retryable { reason, retry_not_before_age_millis }
  -> HandoffTargetDeliveryOutcome::Retryable { reason, retry_not_before_age_millis }
  -> HandoffTargetDeliveryObservation::try_from_adapter(...)

HandoffDeliveryOutcomeCandidate::Failed { reason }
  -> HandoffTargetDeliveryOutcome::Failed { reason }
  -> HandoffTargetDeliveryObservation::try_from_adapter(...)
```

The mapping is exhaustive. No wildcard, `Failed(String)`, `Retryable(bool)`, HTTP status mapping, error-string parsing, provider
timestamp, caller-supplied identity, aggregate status, material lifecycle status or downstream formal truth may enter the chain.
`observed_at` comes from the trusted Sandbox clock and must be no earlier than the committed attempt start. Any receipt, reason, age,
handoff, target, attempt, generation or carrier relation failure stops before `apply_target_observation` and preserves the exact
recovery identity.

#### Adapter parity and stop boundary

The durable adapter and deterministic fake must share the request/carrier validator, the three-way explicit mapping, correlation and
body redlines, call-count rule, and before-call/side-effect-unknown distinction. Neither adapter may construct a domain observation,
write a repository, retry internally, or generate real evidence. This batch does not define same-attempt inspection decisions,
post-call fresh-read/CAS write set, stored receipt recovery, material lifecycle finalization, or commit-unknown inspection; those belong
to `S7-03C-B1-D-3`.

### B1-D-2 completion gate

| gate | result |
|---|---|
| retry selection and eligibility | closed for `Pending`, ready/not-ready `Retryable`, terminal, blocked and `Attempting` |
| attempt-before-call order | closed as seven ordered operations with commit confirmation before external call |
| candidate mapping | 3/3 exhaustive branches mapped to existing canonical outcome and observation factories |
| identity / time / body-free boundary | closed; no caller/provider substitution allowed |
| durable/fake parity | planned contract closed; no test execution claimed |
| upstream blocker | no new L1/L2 blocker; existing `READ-001` remains open with owner |
| formal document / implementation | formal `03-详细设计.md` unchanged; implementation blocked / wait_design |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-2 completed_wait_user_review
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1,B1-D-2
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
next_allowed_action = wait_user_review_before_B1-D-3
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
outcome_blocker = open_wait_s7_03c_s7_05
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Recovery Draft (superseded by physical EOF): `S7-03C-B1-D-2`

该段落曾被插入到中部，现只保留为 historical recovery trace；真正 current recovery override 位于本文件物理 EOF。

### Current authority index

| contract area | current section | authority |
|---|---|---|
| retry selection、eligibility、fresh read | historical-position `§16.1~§16.3` | 当前 B1-D-2 契约；不得按 aggregate status 或 latest row 替代。 |
| `MUT-G08` attempt-before-call | historical-position `§16.4~§16.5` | 当前 B1-D-2 契约；attempt reservation 必须先 commit confirmed，再释放 UoW 外呼。 |
| candidate shape / correlation / time | historical-position `§17.1~§17.2` | 当前 B1-D-2 契约；只允许三类 candidate，不能猜测 unknown。 |
| exhaustive mapping | historical-position `§17.3~§17.4` | 当前 B1-D-2 契约；唯一进入 `HandoffTargetDeliveryObservation::try_from_adapter` 的链路。 |
| durable / deterministic fake parity | historical-position `§17.5` | planned implementation gate；未执行测试。 |
| static audit / stop point | historical-position `§17.6` | B1-D-2 completion gate；下一批为 B1-D-3。 |

### Corrected G08 persistence boundary

`MUT-G08` 只使用既有 `HandoffFact` aggregate 的持久化入口、handoff core `Version` CAS、已有 audit/recovery relation
和 identity allocation port。它不创建独立的 `HandoffTargetProgress` repository、attempt repository 或新的 generic index。
若 `7R-02C/02D` 已为 exact attempt recovery 提供必要 relation，该 relation 只能作为同一 pre-call UoW 的既有 write set；不能
在本批借名新增持久化 root。`HandoffTargetProgress` 仍嵌入 `HandoffFact`，没有独立 `Version`、ref 或 save owner。

### B1-D-2 completion facts

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-2 completed_wait_user_review
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1,B1-D-2
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
next_allowed_action = wait_user_review_before_B1-D-3
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
outcome_blocker = open_wait_s7_03c_s7_05
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批未修改正式 `projects/L4-sandbox/03-详细设计.md`，未进入 `B1-D-3`、`B1-D-4`、`B1-E`、B2、Step 8 或实现；未生成
实现 commit、run_id、真实 evidence alias、验收签署或测试结果。

---

## Historical-Position Draft (superseded by physical EOF): `S7-03C-B1-D-2` attempt selection

本节是 `B1-D-2` 的 current contract 起点。上一节 `§15` 保留为已完成的
`B1-D-1` 交付边界；本批只补 attempt selection、attempt-before-call 顺序和 candidate 到 canonical observation 的
闭集映射，不修改 `HandoffTargetDeliveryRequest` 的字段定义，不进入 same-attempt unknown recovery、post-call CAS
或正式 `03-详细设计.md`。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-2 in_progress
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1
next_allowed_action = write_b1_d2_attempt_selection_and_candidate_mapping
new_l1_l2_blocker = 0
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Draft (superseded by physical EOF): `S7-03C-B1-D-2` candidate mapping and boundary closure

本节追加于本文件物理 EOF，是 `B1-D-2` 的 current contract overlay。前面的 `§16.1~§16.5` 保存本批 attempt
selection 与 `MUT-G08` 顺序；本节把三类 candidate 映射为唯一 canonical observation，并登记 shape、correlation、time
和 durable/fake parity。中部 `B1-D-1` 段落仍是历史完成记录，不再覆盖本节。`B1-D-3` 以前不得定义 unknown inspection
的恢复写入、post-call CAS write set 或 material lifecycle finalization。

### 17.1 Candidate ingress 与三层转换链

`HandoffTargetDeliveryPort::deliver` 和 `inspect_same_attempt` 都只能返回同一闭集的
`HandoffDeliveryOutcomeCandidate`，或返回已登记的 port-local error。candidate 是 adapter boundary 的 transient carrier，
不是 domain outcome、progress status、aggregate status、receipt truth 或 stored result。

转换链固定为：

```text
provider / deterministic fake result
  -> explicit adapter match
  -> HandoffDeliveryOutcomeCandidate
  -> application shape + correlation + time validation
  -> HandoffTargetDeliveryOutcome
  -> HandoffTargetDeliveryObservation::try_from_adapter(...)
  -> HandoffFact::apply_target_observation(...)
```

只有最后一步才允许改变 Sandbox-owned progress；本批只规定到 observation factory 的边界，transition 的 UoW 和 CAS
由 `B1-D-3` 承接。任何 provider error、HTTP status、SDK object、raw response、payload body 或错误文本都不能在链上
被“猜测”为 candidate variant。

candidate 的 planned shape 必须保持以下闭集：

| variant | allowed fields | absent fields | semantic owner |
|---|---|---|---|
| `Delivered` | body-free `receipt_ref: ExternalSourceRef` | `reason`、`retry_not_before_age_millis`、handoff/target/attempt、observed time、aggregate status | adapter 只声明 target 对本次 refs/summaries 的接收；application 负责绑定 target kind/ref。 |
| `Retryable` | typed `SandboxReason`、non-zero `retry_not_before_age_millis` | receipt、handoff/target/attempt、observed time、aggregate status | adapter 只声明本 attempt 可在相对年龄达到后再尝试；application/domain 负责保存 retryable progress。 |
| `Failed` | typed `SandboxReason` | receipt、retry age、handoff/target/attempt、observed time、aggregate status | adapter 只声明本 attempt 的 terminal delivery failure；application/domain 负责保存 failed progress。 |

candidate 不得增加第四个 `Unknown`、`Absent`、`Skipped` 或 `Accepted` variant。`Unknown` 是 external side-effect recovery
问题，`Absent` 是同-attempt inspection 的事实分类，二者不应在本批被伪装成 delivery outcome；`Skipped` 是 job item 的
处理结果，`Accepted` 不是 Sandbox handoff truth。

### 17.2 Candidate shape、correlation 与时间校验

application 在任何 domain mapping 前必须执行下列检查。检查失败返回既有 application/infra owner error，不形成
`HandoffTargetDeliveryObservation`，也不改变 progress。

| check | exact source | acceptance rule | failure owner |
|---|---|---|---|
| candidate variant | port return type + `HandoffDeliveryOutcomeCandidate::validate_shape` | 只能逐项进入 `Delivered`、`Retryable`、`Failed`；实现必须 exhaustive match，不得使用 wildcard。 | `AdapterOutcomeShapeInvalid` -> existing internal invariant mapping。 |
| receipt relation | loaded immutable target + candidate receipt | `HandoffReceiptRef::try_from_adapter(target_kind, target_ref, receipt_ref)` 成功；receipt kind 与 target kind 相等，receipt identity 合法且不等于 target ref；不携带正文。 | `AdapterOutcomeShapeInvalid` 或既有 `OutcomeShapeInvalid`；不得降级为 failed。 |
| retry reason | candidate `SandboxReason` | reason 已是 caller-safe typed value；不得从 raw string、HTTP code、SDK status 生成。 | `AdapterOutcomeShapeInvalid` / existing reason validation owner。 |
| retry age | candidate `NonZeroU64` + committed attempt start | age 非零；相对 `attempt_started_at` 解释；checked addition / age relation 不溢出。 | `AdapterOutcomeShapeInvalid` 或既有 time/integrity owner。 |
| failure reason | candidate `SandboxReason` | reason 是 finite、脱敏、caller-safe typed reason；不存在 receipt 或 retry age。 | `AdapterOutcomeShapeInvalid` / existing reason validation owner。 |
| handoff relation | fresh committed `HandoffFact` | application 使用 loaded `handoff_ref`，candidate 不可提供替代 identity；request ref 必须与 loaded fact 相等。 | request relation / committed invariant owner。 |
| target relation | fresh immutable `HandoffTarget` | application 使用 loaded target kind/ref；candidate 不可改绑 target；request kind/ref、plan selection 和 target 全等。 | `AdapterOutcomeCorrelationMismatch` 或 relation invariant owner。 |
| attempt relation | committed `Attempting` progress | `request.attempt_ref == progress.attempt_ref`，且 attempt 属于 `(handoff_ref,target_ref)`；不得用新的或 caller supplied ref。 | `AdapterOutcomeCorrelationMismatch` / `HandoffDeliveryObservationMismatch`。 |
| attempt time | committed progress | `observed_at >= attempt_started_at`；时间由 trusted application clock 在 candidate 返回后取得，不使用 provider timestamp。 | `HandoffTargetProgressTimestampInvalid` / existing time owner。 |
| generation / material | request snapshot and checked binding | candidate 不得改变 generation、selection 或 carrier；request 的所有 carrier 仍是同一 committed source snapshot。 | `RequestRelationInvalid` / `RequestMaterialShapeInvalid`。 |
| trace | checked `SandboxServiceCallContext` | observation mapping沿用原 call frame trace；candidate不能携带第二 trace、provider log 或 payload metadata。 | existing context/integrity owner。 |

`observed_at` 的来源必须是 Sandbox trusted clock。由于 canonical port candidate 不携带时间，provider 返回的 server time、
message timestamp 或 SDK metadata 不得越过 port boundary；如果 application 无法取得合法 observation time，不能应用
candidate，也不能把它改成 `Retryable` 或 `Failed`。external side effect 已可能发生时，原 attempt 必须保留并交由后续
same-attempt recovery。

### 17.3 Exhaustive candidate 到 canonical observation mapping

下表是唯一 application mapping。三行均必须执行 `HandoffTargetDeliveryObservation::try_from_adapter`；application、worker、
fake 或 adapter 都不能直接构造 observation、progress 或 aggregate status。

| candidate branch | application exact mapping | observation input | immediate domain meaning | forbidden mapping |
|---|---|---|---|---|
| `Delivered { receipt_ref }` | 先 `HandoffReceiptRef::try_from_adapter(loaded_target.target_kind(), loaded_target.target_ref().clone(), receipt_ref)`，再构造 `HandoffTargetDeliveryOutcome::Delivered { receipt_ref: typed_receipt }`。 | loaded `handoff_ref`、loaded immutable target、committed active `attempt_ref`、mapped outcome、trusted `observed_at`。 | matching target attempt 已确认接收 body-free refs/summaries；后续 transition 才能进入 per-target `Delivered`。 | receipt ref 直接当 `ArtifactRef` / evidence / runtime result；用最后 receipt 覆盖整个 aggregate；跳过 observation factory。 |
| `Retryable { reason, retry_not_before_age_millis }` | `HandoffTargetDeliveryOutcome::Retryable { reason, retry_not_before_age_millis }`，保留 typed reason 和 relative age。 | 同上；不生成 receipt。 | 当前 attempt 可在 persisted age 达到后被 selection；本批不立即生成新 attempt。 | `Retryable(bool)`；错误文本分类；zero age；立即重试；把 retryable 当 aggregate success。 |
| `Failed { reason }` | `HandoffTargetDeliveryOutcome::Failed { reason }`，保留 typed terminal reason。 | 同上；不生成 receipt 或 retry age。 | 当前 target 可进入 terminal `Failed`；其他 target/capture truth 不回滚。 | timeout/unknown 映射 failed；自动创建 next attempt；把 failed reason 写成 raw provider cause。 |

固定伪代码如下；`match` 必须覆盖全部 candidate variant，未来增加 variant 时必须触发设计和实现审计：

```rust
let observed_at = trusted_clock.checked_now()?;
let canonical_outcome = match candidate {
    HandoffDeliveryOutcomeCandidate::Delivered { receipt_ref } => {
        let receipt_ref = HandoffReceiptRef::try_from_adapter(
            loaded_target.target_kind(),
            loaded_target.target_ref().clone(),
            receipt_ref,
        )?;
        HandoffTargetDeliveryOutcome::Delivered { receipt_ref }
    }
    HandoffDeliveryOutcomeCandidate::Retryable {
        reason,
        retry_not_before_age_millis,
    } => HandoffTargetDeliveryOutcome::Retryable {
        reason,
        retry_not_before_age_millis,
    },
    HandoffDeliveryOutcomeCandidate::Failed { reason } => {
        HandoffTargetDeliveryOutcome::Failed { reason }
    }
};

let observation = HandoffTargetDeliveryObservation::try_from_adapter(
    committed_handoff_ref,
    loaded_target,
    committed_attempt_ref,
    canonical_outcome,
    observed_at,
)?;
```

上面的 `?` 代表既有 typed error mapping，不代表把错误压成某个 candidate。receipt factory 或 observation factory 返回
relation、shape、timestamp 错误时，application 必须保留 exact recovery identity；若错误来自已提交 row 的内部矛盾，交给
`InternalInvariantViolation` owner；若是 inbound candidate shape，则交给既有 `OutcomeShapeInvalid` owner。两者都不允许
调用 `HandoffFact::apply_target_observation`。

### 17.4 Request / candidate / observation 字段绑定矩阵

为了防止 mapping helper 从错误的 current row 拼接对象，字段来源固定如下：

| field | owner/source | mapping rule | candidate influence |
|---|---|---|---|
| `handoff_ref` | committed `HandoffFact` | 传入 observation factory 的 exact aggregate identity；必须与 request 相等。 | none；candidate 不可携带。 |
| `target_kind` | immutable `HandoffTarget` | 只由 loaded target 传给 receipt factory 和 observation factory。 | none；不能从 receipt kind 或 provider route 反推。 |
| `target_ref` | immutable `HandoffTarget` | 只接受 plan 中 exact target ref。 | none；candidate 不可改绑。 |
| `attempt_ref` | committed `HandoffTargetProgress` after G08 | 必须是 current `Attempting` attempt；不是 invocation idempotency ref。 | none；candidate 不可携带。 |
| `attempt_started_at` | committed progress | 只用于校验 `observed_at` 和 retry-age semantics；不进入 outcome payload。 | retry age 以该值为基准，但 candidate 不可替换 start time。 |
| `observed_at` | trusted application clock | candidate 返回后读取一次；必须不早于 attempt start。 | none；provider timestamp forbidden。 |
| `receipt_ref` | candidate `Delivered` branch | 仅经 `HandoffReceiptRef::try_from_adapter` typed bind。 | supplies one body-free external receipt identity only. |
| `reason` | candidate `Retryable` / `Failed` branch | 只保留 typed safe reason；不做字符串重分类。 | supplies branch-specific reason only. |
| `retry_not_before_age_millis` | candidate `Retryable` branch | 必须 non-zero、relative、checked；不立即触发新 attempt。 | supplies delay age only. |
| `generation_ref` / carriers | committed request snapshot | mapping 不重读 latest、重算 digest 或补 material。 | none；candidate 不可修改。 |
| trace / audit | checked call frame | transition audit使用原 trace context；candidate不传第二诊断对象。 | none。 |

因此，candidate 的最小权限是“声明 provider 已分类的有限结果”；它没有能力声明结果属于哪个 Sandbox aggregate、哪个
target、哪个 attempt，也没有能力声明 Sandbox material lifecycle 或 downstream formal truth。

### 17.5 Durable adapter 与 deterministic fake parity

本批的 parity 是实现门禁，不是已执行测试事实。durable adapter 和 deterministic fake 必须对同一 checked request 产生
相同的 finite candidate / port error 分类；二者不能各自发明 status 或 retry 规则。

| parity surface | durable adapter requirement | deterministic fake requirement | forbidden divergence |
|---|---|---|---|
| request validation | 复用或等价实现 `HandoffTargetDeliveryRequest` / carrier closed-shape validator；拒绝 wrong lineage、body 和 duplicate carrier。 | 使用同一 validator 与相同 rejection branch；不得直接消费 fixture domain object。 | durable 拒绝而 fake 接受，或 fake 绕过 generation/material coverage。 |
| provider mapping | 对 provider finite response 使用显式三分支 match；只有合法 receipt 才构造 `Delivered`。 | 注入三类 candidate 和每个 port-local error；返回 shape 与 durable adapter一致。 | HTTP code、错误文本、SDK default branch自动决定 retryability。 |
| correlation | provider operation correlation 必须与 request 的 exact handoff/target/attempt binding相符；不符返回 `AdapterOutcomeCorrelationMismatch`。 | 可注入 matching / mismatching correlation，并返回同名 error；不产生重绑 candidate。 | fake 直接以 fixture key 修复 mismatch。 |
| external body | provider body 只能停留在 infra-private boundary；发现禁止 body 返回 `ForbiddenExternalBody`。 | 注入 body marker 时同样拒绝，不截断或清洗后继续。 | fake 忽略 body、把 body 写入 reason 或 receipt。 |
| call count | `deliver` 只在 G08 commit confirmed 后调用一次；adapter 不自发 retry。 | 记录 exact request、调用次数和调用前 commit gate；同一 attempt 不隐式重复调用。 | fake 自动重试、自动写 progress 或把 inspection 当第二 delivery。 |
| observation ownership | 只返回 candidate；不构造 domain observation、不写 Sandbox repository。 | 只返回 candidate；不模拟 fake-only state transition 或 stored result。 | 任一 adapter直接改变 aggregate/material status。 |
| unknown boundary | timeout/response loss/process interruption按 side-effect unknown owner返回；不能伪造 before-call unavailable。 | 可注入 unknown / unavailable 的明确分支，保持相同 recovery identity。 | 把所有异常压成 `Retryable` 或 `AdapterUnavailableBeforeCall`。 |

fake 的记录内容只能用于 planned contract tests 和 deterministic diagnostics：exact handoff/target/attempt correlation、
body-free request digest/shape、call count 和 injected outcome kind。它不得生成真实 evidence alias、真实 receipt、run_id、
commit、验收签署或测试结果。

### 17.6 B1-D-2 static audit and stop point

| audit item | required | result |
|---|---:|---|
| eligible target read rule | 1 closed rule | `Pending` / ready `Retryable` / terminal / blocked / `Attempting` 分支已区分；integrity error 不降级。 |
| `MUT-G08` sequence | 7 ordered operations | attempt allocation、fresh-read、domain begin、same-UoW stage、CAS confirm、request rebuild、external call顺序已固定。 |
| candidate variants | 3/3 exhaustive | `Delivered`、`Retryable`、`Failed` 逐项 match；没有 wildcard 或 generic outcome。 |
| canonical outcome reuse | 1 | 只复用 `HandoffTargetDeliveryOutcome`，不新增 outcome/status。 |
| canonical observation reuse | 1 | 只调用 `HandoffTargetDeliveryObservation::try_from_adapter`。 |
| identity/time binding | closed | handoff、target、attempt、generation、trusted observation time 的 source matrix 已登记。 |
| receipt/reason boundary | closed | receipt 只经 typed factory；reason/age 不解析、不跨界补造。 |
| durable/fake parity | planned closed | validator、finite mapping、correlation、body、call count、unknown injection 六面一致；未执行测试。 |
| implementation / run / evidence | 0 | 未实现、未编译、未测试、未生成真实 run/evidence/签署。 |
| new upstream blocker | 0 | 未发现新的 L1/L2 upstream blocker。 |

`B1-D-2` 完成。下一批仅允许进入 `S7-03C-B1-D-3`：same-attempt unknown inspection、post-call fresh-read、whole-group
CAS、stored receipt/recovery surface 和 commit-unknown inspection；不得提前进入 B1-D-4、B1-E、B2、Step 8、正式正文或
implementation。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-2 completed_wait_user_review
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1,B1-D-2
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
next_allowed_action = wait_user_review_before_B1-D-3
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
outcome_blocker = open_wait_s7_03c_s7_05
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

### 16.1 B1-D-2 scope and non-scope

| item | current batch treatment |
|---|---|
| eligible target selection | closed read rule over one fresh handoff snapshot；只选择 exact selected target，不按 aggregate status 猜测。 |
| attempt-before-call | `begin_target_attempt`、attempt identity reservation、handoff `Version` CAS、commit confirmation 和 request construction 的固定顺序。 |
| candidate mapping | `Delivered`、`Retryable`、`Failed` 三个 candidate 逐一映射到既有 `HandoffTargetDeliveryOutcome` 与 `HandoffTargetDeliveryObservation`。 |
| shape / relation validation | candidate fields、attempt、target、handoff、generation、trace 和 observation time 的闭合校验。 |
| durable/fake parity | 相同 request validator、candidate validator、finite mapping、调用次数和 unknown 注入边界。 |
| deferred | `inspect_same_attempt` 的恢复决策、post-call UoW/CAS write set、commit-unknown whole-group inspection、material lifecycle finalization 和 B1-D-3/B1-D-4。 |

### 16.2 Retry selection 的 exact read surface

`retry_pending_material_handoffs` 对每个 `PendingMaterialHandoffGroup` 按 immutable target plan 的 canonical 顺序处理，
但每次 target attempt 都必须以一个 fresh committed snapshot 开始。selection 不从 query projection、上一次 job result、
“最新 receipt”或 caller supplied status 恢复 target。

一次 eligible-target selection 必须读取并绑定以下对象及其 `Version`：

1. `HandoffFact`，包括 handoff ref、context/run/environment/boundary/handle/generation lineage、immutable target plan、
   per-target progress 和 cleanup guard override。
2. 当前 selected target 的 immutable `HandoffTarget` 与对应 `HandoffTargetProgress`；两者的 `target_kind`、`target_ref`、
   source lineage 和 plan selection 必须 exact match。
3. 当前 target selection 所需的 captured material rows 和/或 `ObservabilityMaterial`；carrier coverage 必须按 `§15.4`
   双向校验，且所有 row 与 handoff source generation 相等。
4. target adapter binding / generation fence；binding 只用于选择实现，不得以 binding 内容补造 request 字段。
5. active cleanup block observation（如存在）；任何 block 都使本次 target `ineligible`，且不得分配 attempt ref。

selection 的输出不是新的 domain status，而是 application-private `HandoffDeliverySelection`，其最小内容为：

```text
handoff_ref
target_kind
target_ref
selected_material_selection
source_generation_ref
checked_handoff_version
checked_source_versions
checked_adapter_binding_generation
```

`HandoffDeliverySelection` 不携带 `Version` 到 external request，也不携带 receipt、retry flag、aggregate status 或
provider endpoint。它只允许在 pre-call application frame 内存在；selection 一旦对应的 committed snapshot 过时，必须
丢弃，不能通过重新读取 latest target plan 继续使用原 selection。

### 16.3 Eligibility decision table

eligibility 由 loaded progress 的 typed status、checked age 和 cleanup guard 共同决定。表中 `skip` 是本次 job 对该
target 不作 mutation；它不是新的 target outcome。

| cleanup override | progress | checked age relation | B1-D-2 action | adapter call | attempt allocation |
|---|---|---|---|---:|---:|
| present | any | any | `blocked`，保留 exact block reason | 0 | 0 |
| absent | `Delivered` | n/a | `skip_terminal` | 0 | 0 |
| absent | `Failed` | n/a | `skip_terminal` | 0 | 0 |
| absent | `Pending` | n/a | `eligible_first_attempt` | 1 after commit | 1 after reservation |
| absent | `Retryable` | `< retry_not_before_age_millis` | `defer_not_ready` | 0 | 0 |
| absent | `Retryable` | `>= retry_not_before_age_millis` | `eligible_retry_attempt` | 1 after commit | 1 after reservation |
| absent | `Attempting` | n/a | `inspect_or_recover_same_attempt` (deferred to B1-D-3) | 0 in this path | 0 |

以下情况不是 eligibility 分支，而是 application/integrity error：missing target progress、duplicate target key、wrong
handoff ref、wrong generation、selection/cardinality mismatch、missing required material、missing adapter binding、Version
join 不一致、或 cleanup observation 与 handoff lineage 不一致。错误时不得把 target 改成 `Retryable`，不得生成 replacement
attempt，也不得调用 adapter。

`Pending` 的 `retry_checked_age_millis` 必须为 `None`；`Retryable` 的值必须为 fresh trusted clock 相对于该 progress
`attempt_started_at` 的 checked age，且达到（含等于）persisted not-before age。caller 不得传入布尔 retry、任意时间戳或
caller supplied attempt age。年龄计算溢出、时钟结果不单调或时间早于 attempt start 时，返回既有 typed time/integrity
error，不降级为 not-ready。

### 16.4 `MUT-G08` attempt-before-call exact order

对一个 `eligible_first_attempt` 或 `eligible_retry_attempt`，application 必须严格执行下列顺序；序号是行为约束，不能由
repository、adapter 或 generic helper 重排：

| order | operation | required invariant | forbidden shortcut |
|---:|---|---|---|
| 1 | 以 selection 中的 exact `(handoff_ref, target_ref)` 预生成唯一 `HandoffDeliveryAttemptRef` | identity allocation 发生在任何 external call 前；attempt ref 不由 provider 返回。 | 用 UUID 字符串临时占位、复用旧 receipt/ref、按 target kind 拼接。 |
| 2 | 开启短 application UoW，fresh-read handoff、target progress、required source rows 和所有 expected `Version` | reservation 只能基于仍匹配的 committed snapshot；旧 selection 不可直接写入。 | 只读 aggregate status、只读 latest row、跳过 source revalidation。 |
| 3 | 对 fresh-loaded `HandoffFact` 调用 `begin_target_attempt(target_ref, attempt_ref, retry_checked_age_millis, audit_trace_ref, started_at)` | domain 自己验证 `Pending/Retryable`、age、attempt count、timestamp 和 target relation；结果为 `Attempting`。 | caller 直接设置 status/attempt fields；对 `Attempting` 再调用 begin。 |
| 4 | 在同一 UoW stage handoff fact、attempt relation/audit 和 recovery index reservation（若该 index 属于 G08 write set） | attempt ref、target ref、handoff ref 和 generation 作为同一 recovery identity 原子可见。 | 先 commit attempt 再异步补 audit/index；把 application idempotency ref 当 attempt ref。 |
| 5 | 以 handoff core `Version` 执行 CAS commit，并确认 `committed` | 未确认 commit 不得进入 adapter；CAS loser 不得外呼。 | 把 flush、返回成功或本地对象变更当作 commit confirmed。 |
| 6 | commit confirmed 后，按已提交 progress 和同一 source snapshot 重新构造 checked `HandoffTargetDeliveryRequest` | request 的 attempt ref/start time 必须来自 committed `Attempting` row；material carrier 仍需 exact coverage。 | 从旧内存 aggregate 直接发 request；用 current clock 重算 start time；补 latest material。 |
| 7 | 在 UoW 已释放后调用 matching adapter `deliver(request)` 一次 | external call 只接 body-free request；同一 active attempt 最多一次正常 deliver。 | 持有 UoW/DB lock await；一个 target 预建多个 attempt 后并行外呼。 |

第 5 步确认的 commit 是“Sandbox attempt reservation 已提交”，不是 target delivery 成功。第 7 步前的任何失败都不能
形成 `Delivered`、`Retryable` 或 `Failed` observation；若失败已越过 external boundary，必须保留 exact attempt 并由后续
same-attempt recovery 处理。B1-D-2 不定义该 recovery 的后续写入。

### 16.5 多 target group 的 selection 顺序

一个 group 中 target 按 immutable plan 顺序逐个处理。当前 target 完成 `pre-call commit` 后才可调用 adapter；只有该
target 的结果已进入 B1-D-2 规定的 observation mapping（或被标记为 deferred recovery）后，application 才能读取下一个
target。实现不得先为整个 group 分配一批 attempt refs，也不得把一个 target 的 transient candidate 放入下一个 target
的 request。

以下结果允许继续遍历下一个 selected target：`Delivered`、`Retryable`、`Failed` 的 canonical observation 已由 factory
接受，或该 target 已是 terminal/not-ready/cleanup-blocked 的无 mutation 分支。以下结果终止本次 item/page：relation
integrity error、request shape error、CAS conflict、adapter contract violation、或无法确认本次 attempt 是否已提交；终止
时不得把未处理 target 报告为成功或失败。

---

## 15. EOF Current Contract Batch: `S7-03C-B1-D-1` completed

本节追加于本文件物理 EOF，是 `B1-D-1` 的唯一 current contract authority。此前关于旧
`MaterialHandoffPort`、`MaterialHandoffAdapterOutcome` 的正向定义只保留为 historical material；它们不能再作为
`application::ports` 的 callable surface。当前只登记一个 application-owned delivery request 与一个 delivery port，
不修改正式 `03-详细设计.md`，不进入 `B1-D-2`。

### 15.1 Canonical surface 与所有权

`HandoffTargetDeliveryRequest` 和 `HandoffTargetDeliveryPort` 是本批登记的 planned canonical 名称。它们目前只存在于
本中间产物，不能被描述为已经实现的 Rust 类型、真实文件或运行事实。

| item | canonical decision |
|---|---|
| request owner | `application::ports`；只保存一次 target attempt 的 checked、body-free delivery snapshot。 |
| port owner | `application::ports::HandoffTargetDeliveryPort`；application 不依赖 infra-owned outcome。 |
| caller | `application::capture_handoff_service::retry_pending_material_handoffs`；opening `open_material_handoff` 调用次数为 0。 |
| durable implementer | `infra` handoff adapter；从 provider / SDK 私有结果映射为 application candidate 或 port-local error。 |
| deterministic fake | `infra` test adapter；必须复用相同 request validator、candidate factory、error mapping 和 unknown 注入点。 |
| domain consumer | application 从 loaded target、attempt 和 candidate 构造既有 `HandoffTargetDeliveryObservation`；domain 不接收 provider response。 |
| canonical outcome | 只使用既有 `HandoffDeliveryOutcomeCandidate` 的 `Delivered`、`Retryable`、`Failed` 三个 variant；不新增 outcome。 |
| canonical observation | 只使用既有 `HandoffTargetDeliveryObservation`；不新增 receipt、progress 或 aggregate owner。 |
| repository / UoW | 由 application flow 持有；adapter 不读写 Sandbox repository、不持有 UoW、不执行 CAS。 |

### 15.2 Planned Rust surface

下面的签名是实现级约束草案，不是实现代码。`HandoffMaterialCarrier` 是 application-private transient carrier，
不属于 domain truth、public DTO、repository root 或独立 identity owner。

```rust
/// 一个 target attempt 在 external delivery boundary 上可见的 body-free material carrier。
/// carrier 不携带 material lifecycle、handoff status 或下游正文。
pub enum HandoffMaterialCarrier {
    /// capture source 中一个 exact `(capture_ref, material_key)` row 的安全投影。
    Captured {
        /// owning immutable capture fact ref。
        capture_ref: CaptureFactRef,
        /// capture group 内的 stable material key。
        material_key: CapturedMaterialKey,
        /// canonical material role。
        material_kind: MaterialKind,
        /// controlled opaque locator；不暴露 path、URL 或 provider。
        locator: CapturedMaterialLocator,
        /// Sandbox material digest，不是 Artifact / evidence digest。
        material_digest: SandboxMaterialDigest,
        /// body-free safety summary ref。
        safety_summary_ref: SafeSummaryRef,
        /// adapter 声明的正 material size。
        size_bytes: NonZeroU64,
        /// source run lineage，用于 adapter 绑定检查。
        run_ref: ControlledExecutionRunRef,
        /// source 与 request 共用的 generation。
        generation_ref: ResourceRef,
    },
    /// exact observability material 的安全投影。
    Observability {
        /// Sandbox-owned observability material identity。
        observability_material_ref: ObservabilityMaterialRef,
        /// source basis；不携带 terminal owner 正文。
        source_basis: ObservabilityMaterialSourceBasis,
        /// finite signal kinds。
        signal_kinds: ObservabilitySignalKindSet,
        /// body-free safe summary refs。
        summary_refs: SafeSummaryRefSet,
        /// 已检查的 forbidden-body marker；不携带正文。
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        /// source run lineage。
        run_ref: ControlledExecutionRunRef,
        /// source 与 request 共用的 generation。
        generation_ref: ResourceRef,
    },
}

/// 与一个 immutable target selection 双向精确覆盖的 application-private carrier 集合。
/// 不拥有 identity、lifecycle、repository 或独立 Version。
pub struct HandoffMaterialCarrierSet(Vec<HandoffMaterialCarrier>);

impl HandoffMaterialCarrierSet {
    /// 从已加载 source rows 按 immutable selection 构造 checked carrier set。
    pub(crate) fn try_for_selection(
        selection: &HandoffMaterialSelection,
        materials: Vec<HandoffMaterialCarrier>,
    ) -> ApplicationResult<Self>;

    /// 返回按 immutable selection 顺序排列的只读 carriers。
    pub fn as_slice(&self) -> &[HandoffMaterialCarrier];
    /// 返回 carrier 数量；不能代替 key/ref coverage 检查。
    pub fn len(&self) -> usize;
    /// 判断 carrier set 是否为空。
    pub fn is_empty(&self) -> bool;
}

/// 一个 target attempt 要交给 external delivery adapter 的 immutable body-free request。
pub struct HandoffTargetDeliveryRequest {
    /// owning Sandbox handoff aggregate identity。
    handoff_ref: HandoffFactRef,
    /// immutable target plan 中的 closed target kind。
    target_kind: HandoffTargetKind,
    /// immutable target plan 中的 stable downstream target ref。
    target_ref: ExternalSourceRef,
    /// immutable plan item 的 exact material selection。
    material_selection: HandoffMaterialSelection,
    /// 与 selection 双向 exact 覆盖的 body-free material carriers。
    materials: HandoffMaterialCarrierSet,
    /// 已在 Sandbox 中持久化为 `Attempting` 的唯一 attempt ref。
    attempt_ref: HandoffDeliveryAttemptRef,
    /// loaded progress 中的 attempt start time。
    attempt_started_at: Timestamp,
    /// handoff/source 共用的 canonical generation。
    generation_ref: ResourceRef,
    /// application call context 提供的 checked trace。
    trace_context: SandboxTraceContext,
}

impl HandoffTargetDeliveryRequest {
    /// 从同一 committed snapshot 的 handoff、target、active attempt 和 material rows 构造 request。
    pub(crate) fn from_committed_attempt(
        handoff: &Versioned<HandoffFact>,
        target: &HandoffTarget,
        progress: &HandoffTargetProgress,
        materials: HandoffMaterialCarrierSet,
        trace_context: SandboxTraceContext,
    ) -> ApplicationResult<Self>;

    /// 返回 owning handoff ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回 closed target kind。
    pub fn target_kind(&self) -> HandoffTargetKind;
    /// 返回 stable downstream target ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回 immutable material selection。
    pub fn material_selection(&self) -> &HandoffMaterialSelection;
    /// 返回 exact body-free material carrier set。
    pub fn materials(&self) -> &HandoffMaterialCarrierSet;
    /// 返回 persisted active attempt ref。
    pub fn attempt_ref(&self) -> &HandoffDeliveryAttemptRef;
    /// 返回 persisted attempt start time。
    pub fn attempt_started_at(&self) -> &Timestamp;
    /// 返回 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 checked trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}

/// application-owned delivery seam；candidate 仍需由 application 绑定 loaded target/attempt 后形成 domain observation。
pub trait HandoffTargetDeliveryPort: Send + Sync {
    /// 对 exact persisted attempt 执行一次 external delivery side effect。
    async fn deliver(
        &self,
        request: &HandoffTargetDeliveryRequest,
    ) -> Result<HandoffDeliveryOutcomeCandidate, HandoffTargetDeliveryPortError>;

    /// 只检查同一个 `(handoff_ref, target_ref, attempt_ref)`，不得创建新 attempt 或再次 delivery。
    async fn inspect_same_attempt(
        &self,
        request: &HandoffTargetDeliveryRequest,
    ) -> Result<HandoffDeliveryOutcomeCandidate, HandoffTargetDeliveryPortError>;
}
```

`HandoffTargetDeliveryPortError` 只作为 `application::ports` 的 transient seam error；它不进入 `contracts`、domain、stored
surface 或 public protocol。实现必须对下列闭集逐项 match，并在 port boundary 立即映射到已有
`SandboxApplicationError` / `InfraError` owner；不得提供 `Failed(String)`、`Retryable(bool)`、HTTP status 或 raw provider
cause 字段。

```rust
/// handoff delivery port 的 transient boundary error；不是新的业务结果或持久化 truth。
pub enum HandoffTargetDeliveryPortError {
    /// request factory / adapter 观察到 handoff、target、attempt、generation或source lineage不一致。
    RequestRelationInvalid,
    /// request 的selection与body-free carrier set不满足双向覆盖或closed shape。
    RequestMaterialShapeInvalid,
    /// adapter binding在external call明确开始前不可用。
    AdapterUnavailableBeforeCall {
        /// 已脱敏、caller-safe availability reason。
        reason: SandboxReason,
    },
    /// adapter返回的finite candidate字段组合不合法。
    AdapterOutcomeShapeInvalid,
    /// adapter candidate不属于request的exact correlation。
    AdapterOutcomeCorrelationMismatch,
    /// provider结果无法安全映射到三类candidate。
    AdapterOutcomeUnclassifiable,
    /// adapter检测到禁止越过boundary的external body。
    ForbiddenExternalBody,
    /// external side effect可能已经开始或提交，必须沿同一attempt检查。
    ExternalSideEffectCommitUnknown {
        /// 已脱敏、caller-safe unknown reason。
        reason: SandboxReason,
    },
}
```

上述 wrapper 的 owner mapping 固定为：

| port error | boundary mapping | recovery meaning |
|---|---|---|
| `RequestRelationInvalid` | request factory若是调用方输入/loaded relation错误，映射 `ApplicationErrorDetail::OutcomeShapeInvalid`；若由已提交 row 矛盾证明，则映射 `InternalInvariantViolation`。 | 不调用 external port 或不应用 candidate；保留原 operation / attempt identity。 |
| `RequestMaterialShapeInvalid` | `ApplicationErrorDetail::OutcomeShapeInvalid`；持久化 cardinality / lineage corruption 映射 `InternalInvariantViolation`。 | 不发送不完整 selection；不从 current/latest row 修复。 |
| `AdapterUnavailableBeforeCall` | `InfraError::AdapterUnavailable` -> `ApplicationErrorDetail::PortUnavailable`。 | 只有明确证明未调用时，才可在完整 revalidation 后重试。 |
| `AdapterOutcomeShapeInvalid` | `InfraError::AdapterOutcomeShapeInvalid` -> `ApplicationErrorDetail::InternalInvariantViolation`。 | candidate 不可信；不执行 domain transition。 |
| `AdapterOutcomeCorrelationMismatch` | `InfraError::AdapterOutcomeCorrelationMismatch` -> `ApplicationErrorDetail::InternalInvariantViolation`。 | 不改绑 target/attempt；沿原 attempt recovery。 |
| `AdapterOutcomeUnclassifiable` | `InfraError::AdapterOutcomeUnclassifiable` -> `ApplicationErrorDetail::InternalInvariantViolation`。 | 不从字符串、HTTP code或SDK分支猜 outcome。 |
| `ForbiddenExternalBody` | `InfraError::ForbiddenExternalBody` -> `ApplicationErrorDetail::ForbiddenExternalBody`。 | reject / quarantine；不得删字段后继续。 |
| `ExternalSideEffectCommitUnknown` | `InfraError::ExternalSideEffectCommitUnknown` -> `ApplicationErrorDetail::InternalInvariantViolation`。 | 只允许同 `(handoff_ref, target_ref, attempt_ref)` 的 `inspect_same_attempt`；禁止 blind retry。 |

`PersistenceCommitUnknown` 不属于该 port error；它由 application 的 post-call UoW owner按 whole-group inspection 处理。
同理，`HandoffTargetDeliveryPortError` 不创建 `HandoffTargetDeliveryOutcome`、`HandoffTargetDeliveryObservation`、receipt 或
progress status。

`Versioned<HandoffFact>` 只在 `from_committed_attempt` 的 application-private factory 中用于取得 expected CAS
version；request 本身不暴露 `Version`。`deliver` 与 `inspect_same_attempt` 都只能消费已经通过 constructor 的 request；
adapter 不允许自行从 `handoff_ref` 回查 Sandbox 当前状态来补字段。

### 15.3 Request field source matrix

所有正向字段必须来自同一个 exact committed snapshot。`materials` 的 carrier 不是“把 domain object 原样传给 adapter”，
而是由 application 从 source row 逐项投影出的 body-free carrier。

| request field | exact source | construction rule | adapter interpretation | forbidden substitute |
|---|---|---|---|---|
| `handoff_ref` | committed `HandoffFact.handoff_ref()` | 从已存在 aggregate 复制；不得在 delivery call 中分配。 | external operation correlation 的 Sandbox opaque component。 | 新 handoff ref、source ref 字符串拼接、current latest handoff。 |
| `target_kind` | immutable `HandoffTarget.target_kind()` | 必须与 `target_ref`、selection 和 active progress 全等。 | 选择已装配的 target adapter slot；不能从 ref 字符串反推。 | caller kind、provider topic、HTTP status。 |
| `target_ref` | immutable `HandoffTarget.target_ref()` | 只能是不透明、已验证的 downstream target ref。 | external target correlation；不等于 endpoint、URL 或 formal truth identity。 | path、URL、topic、artifact/runtime/evidence object id。 |
| `material_selection` | immutable target plan item | 原样复制；carrier set 必须与其双向 exact coverage。 | 描述本次 attempt 应接收的 Sandbox-owned refs / summaries。 | current target status、latest selection、caller replacement plan。 |
| `materials` | same-snapshot captured rows / observability material | capture 使用 `(capture_ref, material_key)` exact key；observability 使用 exact material ref；无重复、无额外 row。 | 只读取 body-free locator/ref、digest、safe summary、kind、size 和必要 lineage。 | full `CapturedMaterialRef`、full `ObservabilityMaterial`、正文或按 target 重复保存 row。 |
| `attempt_ref` | committed `HandoffTargetProgress.attempt_ref()` after `begin_target_attempt` | 必须非空且属于当前 target；commit confirmed 后才能建 request。 | provider idempotency / inspect correlation 的 exact attempt component。 | 临时 UUID、new attempt、`SandboxIdempotencyRecordRef`。 |
| `attempt_started_at` | committed progress `attempt_started_at()` | 必须与 active attempt 完全相等；不由 adapter 或 current clock重算。 | 仅用于 provider correlation / checked retry age relation。 | current time、receipt time、caller time。 |
| `generation_ref` | committed handoff/source generation | 与所有 material carrier generation 相等；adapter binding 只接受该 generation。 | adapter/config generation fence。 | config latest generation、provider version、run status。 |
| `trace_context` | checked `SandboxServiceCallContext` | 只复制已校验 context；adapter 可产生内部 telemetry，但不能替换返回 trace。 | diagnostic correlation，不是 business identity。 | raw trace id、span body、provider log、payload metadata。 |
| `Version` | same committed repository snapshot | 不进入 request；由 application call frame 保存并用于 post-call CAS。 | 不可见；adapter 不得以它决定 external truth。 | request field、provider idempotency key、status version。 |
| `SandboxIdempotencyRecordRef` | fresh invocation reservation | 仅用于 application recovery / stored completion 关联；不进入 request。 | 不可见。 | handoff/attempt/receipt/evidence identity。 |

### 15.4 Material carrier shape and coverage

`HandoffMaterialCarrierSet` 是本批唯一允许跨过 delivery port 的 material carrier 集合。它不新增 repository、ref 或
生命周期状态，且不能从正文重新计算 digest、size 或 summary。

| carrier branch | required fields | source relation | allowed use |
|---|---|---|---|
| `Captured` | `capture_ref`、`material_key`、`material_kind`、opaque `locator`、`material_digest`、`safety_summary_ref`、positive `size_bytes`、`run_ref`、`generation_ref` | row key 为 `(capture_ref, material_key)`；capture/run/generation 全等；row 已通过 `can_open_handoff()`。 | 仅被 `CapturedMaterials` 或 `CapturedAndObservability` selection 选择。 |
| `Observability` | `observability_material_ref`、`source_basis`、finite `signal_kinds`、`summary_refs`、safe body markers、`run_ref`、`generation_ref` | ref 等于 handoff source snapshot；source basis、run、generation 与 loaded material 全等。 | 仅被 `ObservabilityMaterial` 或 `CapturedAndObservability` selection 选择。 |

构造 `HandoffMaterialCarrierSet` 时必须同时满足：

1. `CapturedMaterials` 的 key set 与 carrier 中所有 captured keys 双向相等，不能用数量相等代替 key 相等。
2. `ObservabilityMaterial` 的 exact ref 只能出现一次；缺失、重复或多余 carrier 都拒绝。
3. carrier 顺序继承 immutable selection 的 canonical 顺序；adapter 不得排序后选择 winner。
4. 同一 captured material 被多个 target 选择时，每个 target request 可以各自携带同一 body-free carrier，但 Sandbox material
   lifecycle 只由 handoff aggregate 的 material-specific helper 转换一次，不按 target 数量重复写 source row。
5. `source_basis`、signal kind 和 safe marker 只能来自已提交 `ObservabilityMaterial`；不能从日志、metrics、trace 或
   downstream receipt反向补造。

### 15.5 Port ownership、读取面、写入面和副作用边界

| boundary | application side | durable adapter side | deterministic fake side |
|---|---|---|---|
| callable owner | 定义 request、candidate、port-local error 和 candidate validator。 | 实现 `deliver` / `inspect_same_attempt`，不改变 trait。 | 实现相同两个方法和相同闭集结果。 |
| pre-call read | fresh-read handoff、target、active progress、selected material rows、source generation 和 their Versions。 | 不读 Sandbox repository；只接收 checked request 与 validated adapter binding。 | 不绕过 request factory 直接读 fixture domain object。 |
| external delivery | 释放 UoW 后调用 `deliver`；每个 target 一次 active attempt。 | 允许写 downstream target 或 provider-owned idempotency/receipt marker；只使用 request snapshot。 | 记录调用次数、exact correlation 和 injected finite/unknown result。 |
| same-attempt inspection | `ExternalSideEffectCommitUnknown` 或结果不可信时调用 `inspect_same_attempt`；不得换 identity。 | 只读取同一 external operation correlation；不发起第二次 delivery。 | 对相同 correlation 返回与 durable adapter相同的 inspection分类。 |
| post-call write | fresh-read handoff/material/Versions；以 observation 更新 aggregate，再在一个 UoW 保存 fact、material、audit、marker、stored surface。 | 无 Sandbox write、无 UoW、无 CAS。 | 不模拟 fake-only repository 或隐式自动 transition。 |
| trace / error | application 保留 checked trace，并将 port-local error映射到既有 `SandboxApplicationError`。 | raw provider error只在 adapter私有日志/diagnostic边界内，不能进入 result。 | 不把异常文本变成业务 reason 或 retryability。 |

`deliver` 的 external await 不得跨持有 application UoW。`inspect_same_attempt` 也不具备修复职责：它不能补写缺失
receipt、删除 partial provider record、创建新 attempt、改变 target plan 或推断 Sandbox aggregate status。

### 15.6 Closed port-local error and existing owner mapping

本批允许实现者使用上方 `application::ports` private 的 `HandoffTargetDeliveryPortError` wrapper 来表达 delivery seam
错误；它不是新的 domain error、public error kind 或持久化 truth。其 variant 必须严格落入上方闭集，不得增加 generic
`Failed(String)`、`Retryable(bool)` 或 wildcard。下表保留 cross-audit，明确每个既有 infra/application owner 的映射。

| port-local branch | source / owner | existing application mapping | current action |
|---|---|---|---|
| `RequestRelationInvalid` | checked request factory或adapter发现 handoff、target、attempt或generation relation不一致 | `ApplicationErrorDetail::OutcomeShapeInvalid`；若已证明是持久化矛盾则 `InternalInvariantViolation` | 不调用或不应用 observation；保留 exact recovery identity，进入 integrity owner。 |
| `RequestMaterialShapeInvalid` | checked carrier set发现 selection与material carrier relation不一致 | `ApplicationErrorDetail::OutcomeShapeInvalid`；若已证明是持久化 cardinality / lineage 矛盾则 `InternalInvariantViolation` | 不发送不完整 selection；不从 current/latest row 修复。 |
| `AdapterUnavailableBeforeCall` | `InfraError::AdapterUnavailable`；调用尚未发生 | `ApplicationErrorDetail::PortUnavailable` | 不伪造 `Retryable` / `Failed`；按 revalidation policy 决定后续调用。 |
| `AdapterOutcomeShapeInvalid` | `InfraError::AdapterOutcomeShapeInvalid` | `ApplicationErrorDetail::InternalInvariantViolation` | 丢弃 candidate，不应用 domain transition；修复 durable/fake parity。 |
| `AdapterOutcomeCorrelationMismatch` | `InfraError::AdapterOutcomeCorrelationMismatch` | `ApplicationErrorDetail::InternalInvariantViolation` | 不改绑 target/attempt；沿 exact attempt 做 recovery / inspection。 |
| `AdapterOutcomeUnclassifiable` | `InfraError::AdapterOutcomeUnclassifiable` | `ApplicationErrorDetail::InternalInvariantViolation` | 不解析错误字符串、HTTP code或SDK variant；保留 recovery point。 |
| `ForbiddenExternalBody` | `InfraError::ForbiddenExternalBody` | `ApplicationErrorDetail::ForbiddenExternalBody` | reject / quarantine；不能删字段后继续 delivery。 |
| `ExternalSideEffectCommitUnknown` | `InfraError::ExternalSideEffectCommitUnknown` | `ApplicationErrorDetail::InternalInvariantViolation` | 只允许同 `(handoff_ref,target_ref,attempt_ref)` inspection；不得 blind retry。 |
| post-call persistence unknown | `InfraError::PersistenceCommitUnknown`，owner 为 application UoW | `ApplicationErrorDetail::InternalInvariantViolation` | 不归 port；按 whole-group CAS / stored-surface inspection 处理。 |

`AdapterUnavailableBeforeCall` 只有在 adapter 能证明 external call 尚未开始时才可使用。timeout、connection reset、process
interruption、response loss 或 provider 返回无法分类的结果，不得被压成该分支；它们分别进入 `ExternalSideEffectCommitUnknown`
或 `AdapterOutcomeUnclassifiable`。port 不向 application 暴露 `MaterialHandoffAdapterOutcome`；该 historical infra carrier
只能在 concrete adapter 内部暂存并逐字段映射。

### 15.7 Positive / negative boundary audit

| category | allowed positive fields | forbidden fields |
|---|---|---|
| identity | `HandoffFactRef`、`HandoffTargetKind`、opaque `target_ref`、`HandoffDeliveryAttemptRef`、typed material refs | artifact/evidence/runtime result/runner completion/investigation case/observability store formal identity。 |
| material | locator kind + opaque ref、material key、digest、safe summary、signal kind、positive size、source/generation lineage | path、URL、bucket/container/host/pod、正文、file bytes、stdout、stderr、command、argv、environment。 |
| control | immutable selection、attempt start、checked trace、generation | aggregate status、progress status、material lifecycle status、cleanup bool、receipt、retry flag supplied by caller。 |
| errors | finite port-local branch、existing `SandboxApplicationError` detail、safe reason where already typed | raw provider response、HTTP status as business state、SDK object、secret、raw error Display、stack、payload body。 |
| persistence | application-owned expected `Version` in private CAS frame | `Version` in external request、UoW handle、repository trait、idempotency record ref。 |

Security redlines remain Sandbox-owned: the adapter may use provider credentials and provider-specific endpoint details internally,
but none may cross the application port result, request accessors, stored receipt, audit reason or domain observation. `Delivered` means
only that the target acknowledged the body-free refs / summaries represented by this request. It does not establish Artifact, Runtime,
Runner, Observability Store, Investigation or acceptance formal truth.

### 15.8 B1-D-1 completion audit and stop point

| audit item | required | result |
|---|---:|---:|
| application-owned delivery request | 1 | `HandoffTargetDeliveryRequest` planned canonical only。 |
| application-owned delivery port | 1 | `HandoffTargetDeliveryPort` with `deliver` and `inspect_same_attempt`。 |
| candidate variants | 3 | 复用既有 `HandoffDeliveryOutcomeCandidate`，无第二套 outcome。 |
| domain observation owner | 1 | 复用既有 `HandoffTargetDeliveryObservation`。 |
| request field source matrix | 10 | handoff/target/selection/material/attempt/time/generation/trace/CAS/idempotency均已登记。 |
| body-free material carrier | 2 branches | `Captured` / `Observability`；不拥有生命周期或 repository。 |
| port read/write/side-effect boundary | closed | application、infra durable、fake 三方职责已列出。 |
| error mapping | closed | 只映射既有 `InfraError` 与 `ApplicationErrorDetail`；未新增 public canonical error。 |
| old generic port positive use | 0 | `MaterialHandoffPort` / `MaterialHandoffAdapterOutcome` 仅 historical/private。 |
| implementation/test evidence | 0 | 未执行实现、编译、测试、run 或 evidence。 |

`B1-D-1` 至此完成。下一批只允许进入 `S7-03C-B1-D-2`，内容为 `MUT-G08` attempt-before-call 顺序与
`HandoffDeliveryOutcomeCandidate -> HandoffTargetDeliveryObservation` 的 exhaustive mapping；再下一批才处理
same-attempt unknown inspection、post-call UoW 和 CAS。不得在用户复核前修改本节、进入 `B1-D-3`、`B1-E`、B2、Step 8、正式
正文或 implementation。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-1 completed_wait_user_review
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-2 attempt-before-call and exhaustive candidate mapping
next_allowed_action = wait_user_review_before_B1-D-2
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-03C-B1-D-2` completed, user review pending

本节位于本文件真正物理 EOF，是唯一 current authority。此前所有 `B1-D-2` historical-position 段落保存本批详细契约，
所有 `B1-D-1` 状态段落保存历史完成轨迹；恢复时以本节为准。

`B1-D-2` 已闭合：retry selection 与 eligibility、`MUT-G08` attempt-before-call 七步顺序、三类
`HandoffDeliveryOutcomeCandidate` 到既有 `HandoffTargetDeliveryOutcome` / `HandoffTargetDeliveryObservation` 的 exhaustive
mapping、trusted observation time、exact handoff/target/attempt/generation 绑定，以及 durable adapter / deterministic fake
parity。G08 不新增 progress/attempt 独立 repository 或 generic index；commit 未确认不得外呼。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-2 completed_wait_user_review
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1,B1-D-2
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
next_allowed_action = wait_user_review_before_B1-D-3
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
outcome_blocker = open_wait_s7_03c_s7_05
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批不修改正式 `03-详细设计.md`，不进入 `B1-D-3`、`B1-D-4`、`B1-E`、B2、Step 8 或 implementation；未生成实现
commit、run_id、真实 evidence alias、验收签署或测试结果。
---

## EOF Current Working Batch: S7-03C-B1-D-3-A same-attempt inspection contract

本节位于本文件真正物理 EOF，是当前中间产物的唯一 working authority。此前 B1-D-2 内容和状态段落保留为 historical
position；本批只修正 inspect_same_attempt 的恢复语义，不回填正式 03-详细设计.md。

### 18.1 Batch state and review gate

| field | value |
|---|---|
| document / Step | 03-详细设计.md / Step 7 regression / S7-03C |
| current batch | S7-03C-B1-D-3 |
| current sub-batch | S7-03C-B1-D-3-A same-attempt inspection contract |
| status | in_progress |
| upstream blocker | new L1/L2 blocker 0 |
| existing Step 7 blockers | DISPATCH/OUTCOME/READ/ENTRY = 4/6 open with owner; READ-001 remains open with owner |
| formal document | unchanged; historical_reviewed_revalidation_pending |
| implementation | CB-SBX-01A blocked / wait_design |
| real execution / evidence | not started / not created |
| commit | not required |
| next sub-batch | S7-03C-B1-D-3-B post-call fresh-read and observation CAS |
| review gate | complete this sub-batch, run static audit, then stop for user review |

### 18.2 SOP question answers

#### Q1. Why is the existing inspection return type insufficient?

inspect_same_attempt 目前复用 HandoffDeliveryOutcomeCandidate 的 Delivered | Retryable | Failed 三分返回面。该面适合
表达一次已被 adapter 明确分类的 delivery call，不适合表达恢复 probe 的四种事实：明确已交付、明确未交付、无法判定、能力不支持。
如果 probe 继续返回三分 candidate，application 必须把 NotDelivered 猜成 Retryable 或 Failed，或者把 Unknown 错压成
NotDelivered；两种做法都会改变重入资格并可能产生重复 external side effect。

因此 inspection 使用独立的 application-private transient carrier。它不新增 domain progress variant，不新增 repository，也不改变
既有 HandoffTargetDeliveryOutcome 的三分闭集。

#### Q2. 四种 probe 事实的语义边界是什么？

Delivered 只表示 provider 以同一 attempt correlation 明确证明了本次 body-free refs / summaries 已产生交付，并允许携带 typed、
body-free receipt。NotDelivered 只表示 provider 明确证明同一 attempt 没有产生外部交付副作用；超时、断链、进程中断或“查不到”
都不满足该定义。Unknown 表示 provider 无法证明 delivered 或 not delivered。Unsupported 表示 adapter 没有同一 attempt
的可验证 inspection 能力，而不是一种 negative outcome。

Unknown 与 Unsupported 必须保留原 Attempting recovery point，不生成 observation、不创建新 attempt、不改变 aggregate 或
material lifecycle。NotDelivered 也不会直接成为 domain observation；它只是让后续 application recovery 判断“是否具备 formal
abort proof”，具体 post-call transition 交给 D3-B。

#### Q3. probe 是否可以写 Sandbox truth 或修复 provider 记录？

不可以。probe 是只读 external inspection，不能打开 Sandbox write UoW、写 HandoffFactRepository、写 progress / receipt / audit、
生成 identity、补 provider marker、修复 provider record、删除重复交付或重建 material。probe 只读取与 exact attempt correlation
绑定的 provider-side fact，并返回经过 body-free validator 的 transient result；application 后续是否 finalize，必须另开 fresh-read
短 UoW。

#### Q4. inspection 的 correlation 从哪里来？

所有 correlation 字段都从已提交的 Attempting aggregate snapshot 和原始 immutable request 复制，不能由 caller、provider response、
current route 或 current clock 重建。最小 exact key 是 (handoff_ref, target_ref, attempt_ref)；同时必须验证 target_kind、
generation_ref、material selection digest / carrier set 和 adapter binding 与该 attempt 的 committed snapshot 一致。probe result
不得携带第二套 identity 或把 provider operation id 升级为 Sandbox identity。

#### Q5. probe 结果何时可以重新进入 delivery？

只有 NotDelivered 且 application 另行取得 formal abort proof 时，后续阶段才可能按 policy 基于原 attempt 证据创建新的 typed
attempt；原 attempt identity 和 recovery fact 必须保留，不能复用原 attempt 再次调用 deliver。Unknown / Unsupported 永远不能被
当作 not delivered。Delivered 只走 local finalize-only；不再次调用 deliver。
本批不决定 abort proof 的持久化来源、post-call CAS write set 或 stored receipt，这些由 D3-B / D3-C 承接。

### 18.3 Historical gap diagnosis and correction

| ID | historical gap | implementation risk | D3-A correction |
|---|---|---|---|
| C-H-D13 | inspect_same_attempt 与 delivery call 共享三分 candidate | provider 无法表达明确 absent；实现者被迫猜 retry / failure | 引入独立四分 transient probe result；不新增 domain state |
| C-H-D14 | unknown、unsupported、not delivered 在 prose 中混用 | timeout 或 capability 缺失被错误地当作 negative，导致 blind retry | 固定四分语义和不可压缩矩阵；unknown / unsupported strict hold |
| C-H-D15 | inspection 可能沿 latest row 或 provider operation id 补 identity | 旧 attempt 被改绑到新 target、generation 或 material | exact committed snapshot correlation matrix；result 不得提供 Sandbox identity |
| C-H-D16 | probe 的读操作与 recovery finalize 没有 phase boundary | probe 直接写 repository 或伪造 receipt，破坏 read-only 语义 | probe no-write contract；finalize 必须由后续 fresh-read UoW 承担 |
| C-H-D17 | NotDelivered 可能被直接转换为 Retryable observation | 未取得 abort proof 就新建 attempt，重复副作用风险 | NotDelivered 仅是 recovery input；不直接调用 observation factory |

### 18.4 Before / after decision table

| dimension | before / historical | D3-A current decision | owner |
|---|---|---|---|
| probe return | HandoffDeliveryOutcomeCandidate 三分 | application-private HandoffSameAttemptProbeResult 四分 | application port |
| positive result | Delivered(receipt) | Delivered(typed body-free receipt)，沿 exact attempt finalize-only | application + D3-B |
| negative result | 缺失；只能猜 Retryable / Failed | NotDelivered，只表示 formal external absence candidate | adapter probe + application recovery |
| indeterminate | 可能被压成 failed / retryable | Unknown，严格保留 Attempting | application recovery |
| capability gap | 可能被压成 unavailable / failed | Unsupported，严格保留 Attempting 并转 bounded/manual owner | adapter capability owner |
| inspection write | 未明确 | zero Sandbox repository / zero identity / zero repair write | probe adapter |
| re-entry | timeout 后新 attempt 或新 handoff | 仅 NotDelivered + formal abort proof 可由后续 policy 决定；不能换 identity | D3-B / D3-C |

### 18.5 Canonical transient probe carrier

该 carrier 只存在于 application::ports 或其 application-private call frame。它不是 contracts public type、domain outcome、stored
result、query view、audit event 或 implementation evidence。

```rust
/// 同一已提交 delivery attempt 的只读 external inspection 结果。
/// 该 carrier 不拥有 Sandbox identity、progress mutation 或 provider body。
pub enum HandoffSameAttemptProbeResult {
    /// provider 明确证明同一 attempt 已产生交付，并返回 body-free receipt relation。
    Delivered {
        receipt_ref: ExternalSourceRef,
    },
    /// provider 明确证明同一 attempt 未产生外部交付副作用。
    NotDelivered,
    /// provider 无法证明 delivered 或 not delivered。
    Unknown,
    /// adapter 不支持同一 attempt 的可验证 inspection。
    Unsupported,
}
```

The result is exhaustive: no wildcard, Absent(String), Retryable(bool), HTTP status, raw SDK value, provider body, provider
operation id, provider timestamp, caller-supplied attempt, or free-form error string is allowed. Delivered is the only branch that
may carry a receipt, and the receipt is converted through the existing HandoffReceiptRef::try_from_adapter factory using the loaded
target; the probe result itself never carries target kind, target ref, handoff ref, generation, material, or trace.

The port surface is revised only for inspect_same_attempt; deliver keeps the B1-D-2 candidate contract:

```rust
pub trait HandoffTargetDeliveryPort: Send + Sync {
    async fn deliver(
        &self,
        request: &HandoffTargetDeliveryRequest,
    ) -> Result<HandoffDeliveryOutcomeCandidate, HandoffTargetDeliveryPortError>;

    async fn inspect_same_attempt(
        &self,
        request: &HandoffTargetDeliveryRequest,
    ) -> Result<HandoffSameAttemptProbeResult, HandoffTargetDeliveryPortError>;
}
```

The existing HandoffTargetDeliveryPortError remains the error owner. A provider response that cannot be classified as one of the four
probe facts is AdapterOutcomeUnclassifiable; it is not Unknown unless the adapter has a typed, explicit provider-side indication
that the effect status is indeterminate. A missing inspection capability is Unsupported in the result surface, not
AdapterUnavailableBeforeCall, because the latter only describes a delivery call proven not to have started.

### 18.6 Exact correlation matrix

| correlation field | source | probe check | forbidden substitute |
|---|---|---|---|
| handoff_ref | committed HandoffFact.handoff_ref() | request and probe call frame use the same aggregate identity | new handoff, caller ref, provider operation id |
| target_kind | immutable HandoffTarget.target_kind() | adapter slot and receipt factory use the loaded kind | provider topic, route name, HTTP status |
| target_ref | immutable target plan item | exact target ref is unchanged from committed Attempting row | current target, URL, path, latest plan |
| attempt_ref | committed HandoffTargetProgress.attempt_ref() | probe is called only for the active Attempting attempt | new UUID, receipt ref, idempotency record ref |
| attempt_started_at | committed progress | retained for recovery age and observation ordering; probe cannot replace it | provider timestamp, current time |
| generation_ref | committed handoff/source binding | adapter binding generation equals request generation | latest config generation, provider version |
| material selection | committed immutable target plan + checked carrier set | provider inspection is scoped to the exact body-free digest / refs | current rows, rebuilt material, raw body |
| trace context | original checked call frame | diagnostic context is propagated internally only | provider trace, response metadata |
| Sandbox Version | application-private committed snapshot | never serialized into request or provider correlation | caller version, adapter-local version |

The minimum probe key is exact (handoff_ref, target_ref, attempt_ref). The other fields are equality fences, not alternative lookup
keys. If any equality fence fails, the application returns the existing correlation / invariant error, does not use the probe result, and
keeps the original Attempting recovery point.

### 18.7 Probe algorithm and no-write boundary

The application calls inspection only after a committed Attempting row is read and the original request is reconstructed from that row.
The algorithm is intentionally read-only:

\`\`\`text
1. fresh-read exact HandoffFact and selected target progress;
2. require progress = Attempting and active attempt_ref is present;
3. rebuild the checked body-free request from the committed snapshot;
4. release any Sandbox UoW before awaiting the external probe;
5. call inspect_same_attempt(request) exactly once;
6. validate the four-way result and target/receipt relation;
7. return a transient probe result to the recovery coordinator;
8. do not write Sandbox repository, allocate identity, mutate progress, update material lifecycle,
   create audit/relay/result, repair provider records, or call deliver from this function.
\`\`\`

The call must not be made for Pending, Retryable not-yet-eligible, Delivered, Failed, cleanup-blocked, missing relation, or uncommitted
Attempting rows. Unknown and Unsupported return without observation construction and without a new attempt. Delivered returns only a
validated body-free receipt candidate for a later finalize-only path. NotDelivered returns only an external-absence fact; the next phase
must independently prove abort and decide whether any same-token action is allowed.

### 18.8 Probe result to recovery re-entry matrix

| current durable progress | probe result | immediate action | new attempt | observation / write in D3-A |
|---|---|---|---:|---|
| Attempting | Delivered(receipt) | retain exact attempt; schedule local finalize-only | 0 | none; D3-B maps and CASes |
| Attempting | NotDelivered | retain exact attempt; pass to abort-proof policy | 0 | none; no negative observation |
| Attempting | Unknown | strict hold / bounded inspection or manual route | 0 | none; no observation |
| Attempting | Unsupported | strict hold / capability escalation or manual route | 0 | none; no observation |
| any non-Attempting | any | do not inspect; reload and classify stale invocation | 0 | none |
| missing / corrupt correlation | any | invariant failure and exact recovery handoff | 0 | none |

NotDelivered is deliberately not mapped to HandoffTargetDeliveryOutcome::Retryable or Failed. The existing domain graph remains
Pending -> Attempting -> Delivered | Retryable | Failed; a probe fact is an input to a later recovery decision, not a fourth domain
state. This preserves the distinction between “external absence proved” and “delivery attempt may be retried under policy”.

### 18.9 Probe error and boundary mapping

| condition | port / application surface | recovery rule | forbidden downgrade |
|---|---|---|---|
| request relation mismatch | RequestRelationInvalid or existing invariant mapping | no probe result is applied; retain exact attempt | rebuild from latest row |
| target / attempt correlation mismatch | AdapterOutcomeCorrelationMismatch or invariant mapping | stop and route exact identity to integrity owner | bind result to caller target |
| receipt shape or target-kind mismatch | AdapterOutcomeShapeInvalid / OutcomeShapeInvalid | reject positive result; no observation | treat malformed receipt as Failed |
| provider explicitly says effect unknown | ExternalSideEffectCommitUnknown or typed Unknown result | strict hold and inspect again under bounded owner policy | map to NotDelivered |
| provider explicitly lacks probe capability | Unsupported result | strict hold / manual capability route | map to NotDelivered or AdapterUnavailableBeforeCall |
| adapter returns unclassifiable response | AdapterOutcomeUnclassifiable | preserve Attempting; integrity/manual route | parse text, HTTP code or SDK variant |
| probe call definitely never started | AdapterUnavailableBeforeCall | retain exact Attempting; after full revalidation may retry the inspection call | classify as NotDelivered or authorize delivery retry |
| Sandbox read / clock failure | existing application read/clock error | no external call or no observation; retain recovery point | fabricate observation time |

AdapterUnavailableBeforeCall remains narrowly limited to the method call proven not to have started. For inspect_same_attempt, it proves
only that the inspection call did not start; it says nothing about whether the original delivery side effect happened. A timeout, connection
reset, process interruption, lost response, or provider result without explicit classification remains unknown/indeterminate and cannot be
compressed into that error or into NotDelivered.

### 18.10 Conversion boundary to the existing domain outcome

The probe result is not passed directly to HandoffTargetDeliveryObservation::try_from_adapter. Conversion is intentionally split:

| probe result | allowed next-phase input | D3-A behavior | domain outcome now |
|---|---|---|---|
| Delivered(receipt_ref) | typed receipt candidate plus exact loaded target | validate only; retain exact attempt | none |
| NotDelivered | external absence fact plus same attempt | validate only; require later formal abort proof | none |
| Unknown | indeterminate marker in transient recovery frame | retain Attempting; no observation factory | none |
| Unsupported | capability gap in transient recovery frame | retain Attempting; no observation factory | none |

Only D3-B may, after a fresh committed read and policy decision, invoke the existing typed factories and
HandoffFact.apply_target_observation. D3-A does not create Retryable or Failed from probe errors and does not create a synthetic
HandoffTargetDeliveryObservation for a negative or indeterminate result.

### 18.11 Durable adapter and deterministic fake parity

Both the durable adapter and deterministic fake must implement the same four-way inspection contract and the same validator:

| parity obligation | durable adapter | deterministic fake | shared assertion |
|---|---|---|---|
| exact request correlation | provider lookup uses exact frozen request | fixture lookup keyed by exact frozen request | no latest-target fallback |
| positive receipt | maps only body-free provider receipt | returns only fixture body-free receipt | target kind/ref factory validation |
| NotDelivered | only explicit provider abort proof | only explicit fixture absent fact | never inferred from missing fixture |
| Unknown | explicit provider indeterminate result | explicit unknown fixture | no observation / no new attempt |
| Unsupported | capability declaration / result | capability fixture | never mapped to negative |
| side effects | read-only provider probe | zero mutation of Sandbox fake store | call count = one; no repository write |
| forbidden body | reject at adapter boundary | reject same fixture shape | body-free scanner parity |

The fake must not return a convenient three-way candidate from inspect_same_attempt, and the durable adapter must not expose a provider
SDK enum or response body merely because the fake has no equivalent. Any parity difference is a design / implementation blocker, not a
test-only exception.

### 18.12 D3-A static audit

| audit item | required | result |
|---|---:|---|
| independent probe carrier | 1 | closed as application-private four-way enum |
| positive receipt branch | 1 | closed; body-free and target-bound only |
| explicit negative branch | 1 | closed as NotDelivered; no direct domain mapping |
| indeterminate branches | 2 | closed as Unknown / Unsupported; strict hold |
| exact identity correlation | 3 required refs + equality fences | closed for handoff / target / attempt; generation/material/trace fences listed |
| probe no-write boundary | zero Sandbox writes / identity allocation / repair | closed |
| external await transaction boundary | UoW released before probe | closed |
| domain state additions | 0 | closed; existing three-way domain graph unchanged |
| repository additions | 0 | closed; no progress/attempt/probe repository |
| durable/fake parity | same four-way carrier and redlines | planned contract closed; no execution claimed |
| formal document writeback | forbidden | unchanged |
| new L1/L2 blocker | 0 | existing Step 7 blockers remain tracked |

### 18.13 Stop point and next batch

S7-03C-B1-D-3-A is complete as a design sub-batch only after this section's static audit is accepted. The next permitted sub-batch is
S7-03C-B1-D-3-B, which must define fresh-read after deliver or probe, observation factory invocation, whole aggregate / material
write set, and HandoffFact CAS. It must not be started by this batch's author without the user review gate.

This batch does not modify the formal 03 document, create implementation boundaries, run tests, create evidence, assign run IDs, or
claim acceptance/sign-off.
---

## EOF Current Recovery Override: S7-03C-B1-D-3-A completed, user review pending

本节位于本文件真正物理 EOF，是当前唯一 working authority。D3-A 的 same-attempt inspection transient contract、四分 probe
语义、exact correlation、no-write boundary、re-entry matrix、domain conversion boundary 和 durable/fake parity audit 已完成。
此前 D3-A in_progress 段落保留为本批执行轨迹；用户复核前不得进入 D3-B。

| audit item | result |
|---|---|
| probe return surface | application-private HandoffSameAttemptProbeResult: Delivered / NotDelivered / Unknown / Unsupported |
| positive receipt | only Delivered may carry typed body-free receipt; target binding remains application-owned |
| negative semantics | NotDelivered requires explicit proof of no external side effect; it is not a domain observation |
| indeterminate semantics | Unknown and Unsupported retain Attempting; no observation, new attempt, aggregate mutation or material mutation |
| correlation | exact handoff_ref / target_ref / attempt_ref plus target kind, generation, material carrier and trace equality fences |
| probe phase | fresh-read committed Attempting, release UoW, inspect once, read-only return |
| no-write boundary | no Sandbox repository, identity allocation, audit, relay, stored result, provider repair or delivery call |
| conversion boundary | D3-A never invokes HandoffFact.apply_target_observation; D3-B owns fresh-read and CAS |
| retry boundary | only later policy with formal abort proof may create a new typed attempt; original attempt remains immutable recovery evidence |
| adapter error boundary | probe-not-started only permits probe revalidation; it never proves original delivery absence |
| durable/fake parity | same four-way result, body-free validator, correlation fence and call-count rule; no execution claimed |
| new upstream blocker | 0 |
| formal document | unchanged; no writeback |
| implementation / test / evidence | blocked / not started / not created |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-3-A completed_wait_user_review
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1,B1-D-2,B1-D-3-A
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-3-B post-call fresh-read and observation CAS
next_allowed_action = wait_user_review_before_s7_03c_b1_d3_b
new_l1_l2_blocker = 0
existing_step_7_internal_blocker = READ-001 remains open with owner
outcome_blocker = open_wait_s7_03c_s7_05
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批停在用户复核门，不进入 D3-B、B1-D-4、B1-E、B2、Step 8、正式正文或 implementation；未生成实现 commit、run_id、真实
evidence alias、验收签署或测试结果。

---

## EOF Current Working Batch: `S7-03C-B1-D-3-B` post-call fresh-read and observation CAS

### 19.1 Batch state、input 与停审门

用户最新“同意”已消费 `D3-A` 复核门。本批只闭合 direct `deliver` 或 same-attempt probe 返回可信 positive
result 后，Sandbox application 如何重新读取已提交 truth、构造既有 observation、推进 aggregate / selected material 并以
core `Version` CAS 提交。`D3-C` 的 typed stored receipt、idempotency completion 和 whole-group completion relation，及
`D3-D` 的 commit-unknown / full parity closure 均不在本批提前完成。

| input | 本批消费结论 |
|---|---|
| Step 6 `HandoffTargetDeliveryObservation` | 只通过 `try_from_adapter` 构造；绑定 exact handoff / target / attempt / trusted time。 |
| Step 6 `HandoffFact` | 只通过 `apply_target_observation` 改变内嵌 progress，并机械重算 aggregate；progress 没有独立 repository。 |
| Step 6 material lifecycle | captured / observability material 只消费 aggregate 的 material-specific helper；不能复制 aggregate status。 |
| Step 7 mutable repositories | `get_*_with_version` 提供同一 committed snapshot 的 core `Version`；`save_handoff` 是唯一 aggregate CAS 入口。 |
| Step 7 UoW / clock | external await 后使用新 UoW；trusted clock 产生 observation time；任何 post-call external recall 都禁止。 |
| D1 / D2 | request 是 committed `Attempting` snapshot；direct candidate 三分 mapping、body-free receipt/reason/age 已闭口。 |
| D3-A | probe 只有 `Delivered` 可进入 local finalize；`NotDelivered / Unknown / Unsupported` 均不生成 observation。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_internal_batch = S7-03C-B1-D-3-B in_progress
completed_sub_batches = B1-A,B1-B,B1-C,B1-D-1,B1-D-2,B1-D-3-A
next_internal_batch = S7-03C-B1-D-3-C typed stored receipt and completion relation
formal_document_writeback = forbidden
implementation = blocked_wait_design
```

### 19.2 SOP 问题回答

#### Q1. external result 返回后为什么不能直接修改 pre-call aggregate？

pre-call `Versioned<HandoffFact>` 只证明 attempt commit 当时的 snapshot。external await 期间其它 target、cleanup guard 或
retention owner可能合法提交新版本；继续保存 pre-call clone 会覆盖这些已提交变化。因此 result 只能作为 transient input，
application 必须打开新的 post-call UoW，按 exact handoff ref读取完整 aggregate与当前 core `Version`。

#### Q2. fresh-read 后什么条件允许构造 observation？

只有 loaded target仍存在于 immutable plan、kind/ref/selection/generation 与 frozen request全等，且该 target progress仍是同一
`Attempting` attempt、start time和count未被替换时才允许。cleanup override 可以在 external await期间出现；它不改写
progress，因此 matching `Attempting` 仍可记录已发生的 external result，但 aggregate显示继续服从 cleanup precedence。

#### Q3. direct delivery 与 probe positive 是否走两套写入？

否。direct delivery 的三分 candidate 和 probe 的 `Delivered` 在进入 domain factory前来源不同，fresh-read之后共用同一个
local finalization kernel。probe 的 `NotDelivered / Unknown / Unsupported` 永远不进入该 kernel，也不能借此生成
`Retryable / Failed` observation。

#### Q4. observation time 来自哪里，CAS 重试时是否重读？

`observed_at` 在 external result 返回后由 `SandboxClockPort` 读取一次，既不用 provider timestamp，也不用 repository time。
它必须不早于 frozen request和fresh progress的 `attempt_started_at`。若发生只重做 local finalization 的 CAS 竞争，同一
result继续使用同一个 frozen `observed_at`，不能为了抢占新版本而读取更晚时间并改变事实顺序。

#### Q5. 哪些对象属于本次 core truth write set？

exact one `HandoffFact` root（包含完整 target progress set）、当前 target selection覆盖且 material-specific lifecycle实际需要
迁移的 captured rows、最多一个 selected observability material、matching required audit及已有 gate要求的 marker。target
progress没有独立 row；未被当前 target选择的 material不会因为 aggregate status变化而被批量改写。

#### Q6. CAS loser 是否可以再次调用 adapter？

不可以。CAS loser只证明本次 Sandbox delta没有提交，不推翻已经发生或可能发生的 external side effect。application可以在
有限预算内用同一 frozen candidate重新 fresh-read并执行 local-only finalization；它不能调用 `deliver`，也不能分配新
attempt。预算耗尽或relation变化时，保留 exact attempt并进入显式恢复。

### 19.3 当前缺口诊断与改动前后

| historical / incomplete position | 风险 | D3-B current correction |
|---|---|---|
| adapter返回 candidate 后直接调用 domain method | 使用pre-call stale aggregate，覆盖其它target或cleanup更新 | 先新UoW exact fresh-read，再构造 observation和CAS。 |
| request保存的 old `Version` 直接用于post-call save | external await期间的合法并发被误判或覆盖 | old version只作correlation frame；实际CAS token只来自post-call read。 |
| probe `Delivered` 被当作已提交 Sandbox receipt | provider positive与Sandbox truth混成一个事实 | probe positive只进入同一local finalizer；commit confirmed前仍是transient。 |
| CAS conflict后重新 `deliver` | 同一attempt产生重复external side effect | 只允许local-only re-read/reapply；external call count保持原值。 |
| 最后一条 target outcome直接写所有material | 无关material被误标failed/delivered | 仅加载当前selection，并逐material调用aggregate helper机械推导。 |
| target progress单独save | aggregate/progress Version分叉 | progress只随exact one `save_handoff`提交。 |
| `NotDelivered` 映射为Retryable | absence proof越权决定domain retryability | D3-B保持Attempting且零observation；abort policy留给后续显式设计。 |

### 19.4 Post-call ingress 分类与 frozen frame

post-call coordinator只接受以下有限入口。它不是新的domain status、public DTO或repository root：

| ingress | allowed payload | may enter observation finalizer | forbidden interpretation |
|---|---|---:|---|
| direct `Delivered` | body-free external receipt candidate | yes | downstream formal artifact/evidence/runtime truth。 |
| direct `Retryable` | typed safe reason + non-zero relative retry age | yes |立即创建next attempt或generic transport retry。 |
| direct `Failed` | typed terminal safe reason | yes | unknown/timeout/raw provider failure。 |
| probe `Delivered` | body-free external receipt candidate | yes, Delivered only | probe本身等于Sandbox commit。 |
| probe `NotDelivered` | explicit external-absence fact | no | `Retryable`、`Failed`或authorization to deliver。 |
| probe `Unknown / Unsupported` | transient indeterminate/capability marker | no | negative result、new attempt或material status。 |

进入 finalizer 前固定下列 frame fields；这些字段只活在 application 调用栈 / explicit recovery frame，不持久化第二份 truth：

```text
frozen request = exact handoff_ref + target kind/ref + selection + carriers
               + attempt_ref + attempt_started_at + generation + checked trace
frozen result  = one direct candidate OR one probe Delivered receipt candidate
observed_at    = one trusted clock read after result return
audit relation = current checked application call context; no provider trace replacement
external call budget after freeze = 0
```

clock读取失败、`observed_at < request.attempt_started_at`、result shape失败或body redline失败时，不打开mutation path，不构造
observation，也不把result降级成另一个branch。external effect可能已发生时仍保留原 attempt供same-attempt recovery。

### 19.5 Post-call exact fresh-read snapshot

每次 local finalization attempt 都打开新的短 write UoW，并在任何domain mutation前读取：

| read member | exact selector | required relation | `Version` use |
|---|---|---|---|
| `HandoffFact` | frozen `handoff_ref` | full immutable lineage、ordered plan、全部progress和cleanup override完整 | fresh handoff core CAS token。 |
| target / progress | frozen `target_ref` inside loaded aggregate | kind/ref/selection全等；progress为same `Attempting` attempt；start time与request相等 | embedded；没有独立Version。 |
| captured materials | selection中的每个 `(capture_ref, material_key)` | exact coverage、handoff ref、capture/run/generation与loaded fact相等 | 每个可能transition row自己的CAS token。 |
| observability material | selection中的exact ref，0..1 | ref/source basis/run/generation/handoff全等 | selected row自己的CAS token。 |
| required source/audit gate | loaded handoff lineage与当前operation gate | gate只决定本次组成员，不改变outcome | 按已有owner contract。 |

post-call handoff core `Version` 不要求等于 pre-call version。若只是另一个 target先提交而当前 target仍为same `Attempting`，
application应在最新完整 aggregate上应用本result。下列任一情况则停止在mutation前：handoff missing、target missing/duplicate、
immutable plan或generation变化、material coverage缺失/多余、material绑定其它handoff、attempt ref/start不匹配、persisted row
shape损坏。禁止读取 latest handoff、按target ref扫描、替换selection或从candidate补material。

### 19.6 Candidate / probe positive 的统一 observation finalization kernel

`D3-B` 不为 direct delivery 和 same-attempt inspection 维护两套 domain 写入路径。两类入口只在 external ingress 阶段不同；
一旦取得可信的 body-free positive 或 direct finite candidate，必须进入同一个 application-private local finalization kernel。
该 kernel 不是 public service、domain object、repository 或新的状态机；它只消费一个已经冻结的 transient result frame。

#### 19.6.1 Allowed ingress 与 canonical mapping

| ingress | result frame 中允许保留的值 | fresh-read 后的第一步 | 是否可生成 observation |
|---|---|---|---:|
| direct `Delivered { receipt_ref }` | opaque external receipt candidate、原始 checked request relation、一次 trusted `observed_at` | 用fresh-loaded target调用`HandoffReceiptRef::try_from_adapter` | 是 |
| direct `Retryable { reason, retry_not_before_age_millis }` | typed safe reason、non-zero relative age、原始 checked request relation、一次 trusted `observed_at` | 复用既有`HandoffTargetDeliveryOutcome::Retryable` | 是 |
| direct `Failed { reason }` | typed terminal safe reason、原始 checked request relation、一次 trusted `observed_at` | 复用既有`HandoffTargetDeliveryOutcome::Failed` | 是 |
| probe `Delivered { receipt_ref }` | probe positive的body-free receipt candidate、same-attempt correlation、一次 trusted `observed_at` | 与direct Delivered完全相同地重新绑定fresh-loaded target | 是 |
| probe `NotDelivered` | 仅外部无副作用事实与same-attempt correlation | 退出finalization kernel，交后续formal-abort policy | 否 |
| probe `Unknown` / `Unsupported` | 仅transient recovery marker与same-attempt correlation | 退出finalization kernel，保留原Attempting | 否 |

probe 的 `Delivered` 不能携带或补充 `target_kind`、`target_ref`、`handoff_ref`、`attempt_ref`、generation、material
selection 或 trace。所有这些字段都必须从本次 fresh-read 的完整 `HandoffFact` 与其 immutable target plan 重新取得。probe
之前的 transient target 只用于诊断关联，不能给 receipt factory 或 observation factory提供权威字段。

#### 19.6.2 Receipt 与 observation 的精确转换

下列转换顺序是唯一允许的 application mapping；其中任何一步失败，都停在 mutation 前，不生成部分 observation：

```text
external result returned
  -> read trusted SandboxClockPort exactly once as observed_at
  -> open a new short post-call UoW
  -> get_handoff_with_version(frozen handoff_ref)
  -> select the exact target from loaded immutable target_plan
  -> validate loaded progress is the same Attempting attempt
  -> if Delivered:
       HandoffReceiptRef::try_from_adapter(
         loaded_target.target_kind(),
         loaded_target.target_ref(),
         transient_receipt_ref,
       )
  -> map the finite result to HandoffTargetDeliveryOutcome
  -> HandoffTargetDeliveryObservation::try_from_adapter(
       loaded_handoff.handoff_ref(),
       loaded_target,
       loaded_attempt_ref,
       canonical_outcome,
       observed_at,
     )
  -> HandoffFact::apply_target_observation(observation, audit_trace_ref, changed_at)
```

`changed_at` 也来自同一 trusted application clock frame；不得从 provider timestamp、receipt timestamp、repository
Version或本地系统默认时间推导。若既有 clock port 将 `observed_at` 与 `changed_at`作为同一 checked read返回，application
必须保持该已确认关系；若需要两个值，二者都必须不早于 attempt start，且不得在CAS重试中重新读取并改变事实顺序。

`HandoffReceiptRef::try_from_adapter`必须逐项确认：

1. receipt的closed source kind等于loaded target kind；
2. receipt的target ref等于loaded target ref；
3. receipt identity非空、body-free，且不等于target ref；
4. receipt不属于`ArtifactRef`、runtime result、runner completion、observability store record或acceptance evidence；
5. transient receipt没有携带第二份handoff、attempt、generation或provider operation identity。

`HandoffTargetDeliveryObservation::try_from_adapter`必须逐项确认：

1. `handoff_ref`等于loaded aggregate的exact ref；
2. `target_ref`等于immutable plan中的exact target ref；
3. `attempt_ref`等于progress当前`Attempting` attempt，且属于该handoff/target pair；
4. `Delivered`只有typed receipt，`Retryable`只有typed reason与non-zero age，`Failed`只有typed reason；
5. `observed_at >= attempt_started_at`，且不早于该progress既有status time；
6. outcome不携带raw response、HTTP code、SDK object、provider body、path、URL、secret或自由文本；
7. observation的source lineage、generation和material selection仍由loaded aggregate证明，而不是由candidate补齐。

application不得直接构造`HandoffTargetProgress`字段、直接写`receipt_ref`或把probe result cast为domain outcome。上述两个
factory的任何`RelationInvalid`、`TimestampInvalid`、`OutcomeShapeInvalid`或既有typed error都必须保留原
`(handoff_ref, target_ref, attempt_ref)` recovery identity，并返回既有application error mapping；不得降级为`Retryable`或
`Failed` observation。

#### 19.6.3 Kernel 的阶段边界

local finalization kernel只能执行以下六个阶段，阶段之间不得交换owner职责：

| 阶段 | application动作 | 允许写入 | 禁止动作 |
|---:|---|---|---|
| 1 | 固定result frame并读取trusted time | transient memory only | 重新调用`deliver`或`inspect_same_attempt` |
| 2 | exact fresh-read全部aggregate、progress、selected material与Versions | read snapshot | latest scan、按target ref搜索、从candidate补selection |
| 3 | 用loaded target构造receipt、observation并调用domain factory | transient domain values | 直接设置status/receipt/reason |
| 4 | 调`HandoffFact::apply_target_observation`并调用selected material的既有helper | in-memory domain transition | 新增domain status、改变capture/run/formal terminal owner |
| 5 | stage exact root/material/audit/conditional marker group | current UoW staged writes | 单独保存progress、先提交部分material、调用publisher |
| 6 | 用fresh core Version和各material Version执行CAS并commit | commit-confirmed group only | 把stage成功、flush成功或本地对象变化当作已提交 |

`D3-B` 不创建 `SandboxStoredOperationResult`、typed stored receipt 或 idempotency completion schema；这些由下一内部批次
`D3-C` 承接。因而本批的CAS确认只能证明本次Sandbox handoff/progress/material/audit group已提交，不能单独返回
stored command/job completion，也不能把外部receipt伪装为Sandbox stored result。

### 19.7 `HandoffFact::apply_target_observation` 与完整新状态

#### 19.7.1 唯一domain transition顺序

application在fresh-read和observation factory成功后，只能按以下顺序调用既有domain方法：

```text
loaded HandoffFact + loaded target + matching Attempting progress
  -> HandoffTargetDeliveryObservation::try_from_adapter(...)
  -> HandoffFact::apply_target_observation(observation, audit_trace_ref, changed_at)
       -> embedded HandoffTargetProgress::apply_observation(...)
       -> mechanical HandoffFact::derive_status(...)
       -> preserve cleanup override precedence
  -> read material-specific delivery kinds from the resulting fact
  -> apply only the selected material lifecycle transitions
```

`HandoffFact::apply_target_observation`是progress与aggregate的唯一transition入口。application不得调用
`HandoffTargetProgress::apply_observation`、`get_mut`或任何未登记的`save_target_progress`；这些仅是aggregate内部实现
细节，不构成跨层callable。

#### 19.7.2 Target 与 aggregate resulting state matrix

以下表描述 domain method成功后的完整关系。当前target之外的progress逐字段保留；只有当前target的progress允许发生变化。

| canonical observation | 当前target结果 | attempt / count / start | receipt | reason / retry age | aggregate derive（无cleanup override） |
|---|---|---|---|---|---|
| `Delivered` | `Delivered` | 保留matching attempt、count、start | 保存typed `HandoffReceiptRef` | 均为`None` | 若全部target Delivered则`Delivered`，否则按其它target继续推导 |
| `Retryable` | `Retryable` | 保留matching attempt、count、start | `None` | 保存typed reason与non-zero relative age | 无Failed且至少一项Retryable时`Retryable` |
| `Failed` | `Failed` | 保留matching attempt、count、start | `None` | 保存typed terminal reason，retry age为`None` | 任一Failed时`Failed` |

aggregate必须重新满足完整优先级：

```text
cleanup_guard_ref is Some -> BlockedByCleanupGuard
else any target Failed   -> Failed
else any target Retryable -> Retryable
else all targets Delivered -> Delivered
else                       -> Pending
```

因此：

- cleanup block存在时，target observation仍可更新progress，但aggregate显示保持`BlockedByCleanupGuard`，cleanup ref和
  cleanup safe reason不得被delivery结果清除或替换；
- 已有其它target的`Delivered` receipt不会被当前target的`Retryable`或`Failed`覆盖、删除或重置；
- `Retryable + Failed`仍为`Failed`，`Delivered + Failed`仍为`Failed`，`Delivered + Retryable`仍为`Retryable`；
- `Delivered` aggregate只表示所有required target已确认接收本批body-free refs/summaries，不表示Artifact、Runtime、Runner、
  observability store、Investigation或acceptance formal truth成立；
- `status_reason`只在aggregate为`Failed`或`BlockedByCleanupGuard`时按Step 6 relation存在，不能由caller传入；
- `last_audit_trace_ref`、`status_changed_at`和target progress的transition time由domain既有relation更新，application不复制
  或自行重算这些字段。

#### 19.7.3 Concurrent finalizer already committed branch

fresh-read发现当前target不再是原`Attempting`时，application不能机械地重做`apply_target_observation`。必须先读取完整的
已提交 truth group，再执行下表的 exact same-attempt comparison；progress/result相同但 aggregate、selected material 或
required audit/marker relation不完整时，不得判定为same-result：

| fresh progress | 与frozen result关系 | local action | 新observation / 新写入 |
|---|---|---|---:|
| `Delivered` | attempt/receipt逐字段相等，且完整truth group逐字段满足same-result predicate | 视为同一结果已由winner提交，返回local idempotent-finalized disposition | 0 |
| `Retryable` | attempt/reason/retry age逐字段相等，且完整truth group逐字段满足same-result predicate | 视为同一结果已由winner提交，返回local idempotent-finalized disposition | 0 |
| `Failed` | attempt/reason逐字段相等，且完整truth group逐字段满足same-result predicate | 视为同一结果已由winner提交，返回local idempotent-finalized disposition | 0 |
| 任一terminal / non-terminal | result属于其它attempt或字段不相等 | typed relation conflict / recovery hold | 0 |
| `Pending` | 原Attempting relation消失且无可证明的同attempt completion | 不得把结果套到Pending；进入exact recovery | 0 |

该comparison只读已提交aggregate、完整target plan/progress、selected material rows和required audit/marker relation，不调用
任何external adapter，不分配新attempt，不生成第二个receipt。只有fresh target仍是同一`Attempting` attempt，且全部
preflight relation通过时，才允许执行本节的observation mutation；group不完整时进入既有integrity/recovery mapping，不能
用局部相等字段掩盖半提交。

### 19.8 Selected material lifecycle 的精确写集

material lifecycle不是aggregate status的复制字段。每次target observation后，application必须从**更新后的完整
`HandoffFact`**调用material-specific helper；不能从candidate、最后receipt或aggregate字符串直接决定material状态。

#### 19.8.1 Captured material rows

当前target的`HandoffMaterialSelection`中每个captured key都必须在fresh-read中按
`(capture_ref, material_key)` exact composite key加载一次，并验证：

1. row的capture/run/generation与loaded handoff完全相等；
2. row的`handoff_ref`等于当前handoff，不能是另一个batch；
3. target plan对该key的selection coverage完整，不能有缺行、重复或增项；
4. row的status/receipt/reason/time关系通过Step 6 `CapturedMaterialError` closed matrix；
5. 同一captured key被多个target选择时只加载、只可能保存一次，不能按target数倍增写入。

每个selected captured row的derived kind和写动作固定如下：

| `captured_material_delivery_kind(material_key)` | 当前material status | local action | `save_captured_material` |
|---|---|---|---:|
| `Pending` / `Retryable` | `HandoffPending` | 保持pending；若domain方法要求恢复则调用既有`mark_handoff_pending` | 仅状态实际变化时1次 |
| `Pending` / `Retryable` | `RetentionBlocked` | 保留retention block；不清除block、不提前改写为Accepted/Failed | 0 |
| `Failed` | `HandoffPending` | 调`mark_handoff_failed(handoff, audit_trace_ref, changed_at)` | 1 |
| `Failed` | `HandoffFailed` | same-result relation已成立时不重复写；若reason/lineage不等则integrity hold | 0 |
| `Delivered` | `HandoffPending` | 调`mark_handoff_accepted(handoff, audit_trace_ref, changed_at)` | 1 |
| `Delivered` | `HandoffAccepted` | same-result relation已成立时不重复写 | 0 |
| 任意 kind | `Captured`且handoff缺失，或其它非法组合 | typed material relation error，整组不进入stage | 0 |

`RetentionBlocked`是另一个owner的安全保留事实。delivery finalizer不得清除它；后续unblock flow必须重新调用同一handoff
的material-specific helper，再决定`HandoffPending`、`HandoffFailed`或`HandoffAccepted`。如果material row的现有状态与
derived kind无法形成Step 6允许的关系，视为integrity mismatch，不得用默认状态修复。

#### 19.8.2 Selected observability material

只有当前target selection包含exact `observability_material_ref`时，才加载并可能写入该row；captured-only target不得因为
aggregate变化触碰observability material。fresh-read必须验证source basis、run、context、environment identity、boundary、
handle、generation和handoff ref逐字段相等。

| `observability_material_delivery_kind()` | 当前material status | local action | `save_observability_material` |
|---|---|---|---:|
| `Pending` / `Retryable` | `HandoffPending` | 保持pending；需要恢复时调用既有`mark_handoff_pending` | 仅状态实际变化时1次 |
| `Failed` | `HandoffPending` | 调`mark_handoff_failed(handoff, audit_trace_ref, changed_at)` | 1 |
| `Failed` | `HandoffFailed` | same-result relation已成立时不重复写；其它关系进入integrity hold | 0 |
| `Delivered` | `HandoffPending` | 调`mark_handoff_recorded(handoff, audit_trace_ref, changed_at)` | 1 |
| `Delivered` | `HandoffRecorded` | same-result relation已成立时不重复写 | 0 |
| 任意 kind | `Prepared`无handoff或source lineage不匹配 | typed observability relation error，整组不stage | 0 |

observability material只记录Sandbox-owned material已被selected target接收的handoff事实；它不反写capture/run/failure/control/
redline，也不证明L4-observability或其它下游store已经保存正式记录。selected row没有实际lifecycle变化时，不为它单独生成
第二份“成功”audit或marker。

#### 19.8.3 Material write cardinality invariant

一次成功的local finalization最多产生：

```text
1 HandoffFact root save
+ N selected captured material saves, where N <= selected captured key count
+ 1 selected observability material save at most
+ existing required audit / marker group only
```

其中 `N` 的每个key最多一次；同一row不会因target选择重复、因aggregate status重复或因CAS local reapply重复保存。未被
当前target selection覆盖的material永远不进入本次write set，即使它们属于同一handoff且其它target状态发生变化。

### 19.9 Required audit / marker 与同组可见性

本批只承接既有audit、relay、projection和marker owner，不新增第二套audit object或generic marker repository。对于确实发生
target progress/material transition的finalization，必须沿已有owner gate形成一个完整的source group；只读、same-result no-op、
`NotDelivered`、`Unknown`、`Unsupported`和relation error均不得伪造transition audit。

#### 19.9.1 Group members 与 cardinality

| group member | cardinality | source / relation | 是否与本次CAS同UoW |
|---|---:|---|---:|
| `HandoffFact` aggregate + embedded progress | exactly 1 | frozen handoff ref；完整ordered plan与progress | 是 |
| changed captured material rows | 0..N | exact composite keys，N不超过当前selection覆盖 | 是 |
| changed observability material | 0..1 | exact selected observability ref | 是 |
| required `SandboxMaterialHandoffAudit`（或已有target-kind专用handoff audit） | gate要求时exact 1 | handoff/target/outcome/receipt-or-reason/source cursor | 是 |
| `SandboxObservabilityHandoffAudit` / projection / relay marker | 0..1或由既有gate决定 | 只使用已登记的marker/relation owner | 是 |
| typed stored completion | 0 in D3-B | 由D3-C承接，不在本批声明完成 | 不适用 |

audit event的业务命名沿用Step 15既有表；实现不得因为本批增加`HandoffFinalizationAudit`、`DeliverySuccessMarker`或
第二个handoff root。audit payload只保存body-free typed refs、safe reason、target/handoff status、receipt relation和source
cursor，不保存provider response、raw body、URL、path、secret、SDK error或下游formal identity。

#### 19.9.2 Stage 顺序与cursor关系

```text
fresh-read all roots and Versions
  -> validate frozen result, full plan/progress, selected material and required audit/marker gate
  -> if a real transition remains possible, allocate one transient SandboxAuditTraceRef
  -> apply HandoffFact observation using that trace candidate
  -> derive selected material kinds and apply existing material helpers
  -> stage HandoffFact with fresh handoff Version
  -> stage each changed captured material with its own fresh Version
  -> stage changed observability material with its own fresh Version
  -> build required audit / conditional marker drafts from the resulting objects
  -> assign one truth cursor after truth writes are staged, when required
  -> assign one reference cursor only when the existing marker/relation owner requires it
  -> finalize audit / marker relation using the assigned cursor(s)
  -> commit the complete staged group
```

`SandboxAuditTraceRepository::append_staged_audit_trace`只能接收已经通过source relation proof的draft；repository不生成
trace ref、cursor或source relation。stage成功不是可见性，只有`SandboxUnitOfWorkManager::commit`返回confirmed时，
aggregate、material、audit与marker才可被Query或下游publisher读取。任何required member stage、cursor分配、finalize或
commit失败都不得返回“handoff finalization success”。

### 19.10 Core / material CAS 与 local-only recovery

#### 19.10.1 Version token 规则

| token | 来源 | 允许用途 | 禁止用途 |
|---|---|---|---|
| handoff core `Version` | post-call `get_handoff_with_version(frozen_handoff_ref)` | `HandoffFactRepository::save_handoff` exactly once per UoW | 使用pre-call Version、从material Version推导、latest fallback |
| captured row `Version` | exact composite-key fresh read | matching `save_captured_material` | 按target复制、使用旧opening Version、跨row复用 |
| observability row `Version` | exact selected ref fresh read | matching `save_observability_material` | 用handoff Version代替、跨source复用 |
| truth/reference cursor | current UoW allocation after stage | audit/marker source relation | Version、timestamp、page cursor或receipt ref |

pre-call `Version`只保留为correlation/debug frame，不得进入post-call `save_handoff`。任何repository `save_*`都必须收到从
同一fresh committed snapshot取得的完整对象和对应core Version；不能传`None`、默认Version或上一次CAS使用过的token。

#### 19.10.2 Winner、loser 与 relation matrix

| 场景 | 读取/写入事实 | 精确动作 | external adapter调用 |
|---|---|---|---:|
| CAS winner，commit confirmed | handoff、所有changed material、required audit/marker整组可见 | 返回Sandbox-local finalized disposition；不生成stored completion | 0 |
| 另一个target先提交，当前target仍为同一`Attempting` | core Version冲突但当前target relation仍合法 | 丢弃旧domain clone，fresh-read完整aggregate与material，使用同一frozen result重新local finalize | 0 |
| 另一个finalizer已提交完全相同的当前target result | fresh progress/result逐字段相等，且aggregate、selected material、required audit/marker relation完整并逐字段匹配 | local idempotent-finalized no-op；不save、不追加audit、不写material | 0 |
| 另一个finalizer已提交不同result或不同attempt | relation不能证明同一事实 | typed conflict/integrity hold；保留已提交winner，不覆盖 | 0 |
| material row CAS冲突 | 部分stage未commit，material current Version已变化 | rollback整组；fresh-read所有root/relation后仅local reapply | 0 |
| fresh row为其它handoff/generation/selection | source relation已改变或损坏 | mutation前失败并进入integrity/reconciliation | 0 |
| core row missing/duplicate或progress shape损坏 | 无法证明当前aggregate | exact recovery hold；不创建replacement | 0 |
| commit返回`NotCommitted(VersionConflict)` | adapter证明整组零可见 | 在有限local retry budget内重做fresh-read/finalize；耗尽则返回typed conflict | 0 |
| commit返回`StatusUnknown` | 无法证明整组可见性 | 冻结本批identity并交D3-D whole-group inspection | 0 |

CAS loser绝不再次调用 `deliver`，也不调用 `inspect_same_attempt`；它只能执行Sandbox repository的fresh read、domain
comparison和local-only reapply。原因是CAS冲突只说明本次Sandbox delta未提交，不能证明external side effect没有发生；再次调用
任何external adapter都会把一个attempt变成潜在重复side effect。已提交的`HandoffDeliveryAttemptRef`始终冻结；local
reapply若重新进入真实transition path，只能按既有typed allocator分配一个尚未提交的`SandboxAuditTraceRef` candidate，不能
分配第二个attempt、替换原attempt或把旧draft重复finalize。

#### 19.10.3 Bounded local reapply

local reapply使用原始 frozen frame：

```text
same handoff_ref + target_ref + attempt_ref
same canonical candidate / probe Delivered receipt
same observed_at and changed_at ordering frame
external call budget = 0
new attempt allocation = 0
new audit candidate = at most 1 per local reapply UoW; never durable before confirmed commit
```

重试次数必须是有限的 application/config policy输入；本批不规定数值，不允许实现者默认为无界循环。每轮都必须重新读取
完整handoff、immutable plan、当前target progress、selected material rows及Versions。任一轮出现relation mismatch、
integrity violation、clock/relation不能重验或预算耗尽，立即保留原attempt并返回typed conflict/deferred recovery；不能把
local CAS conflict变成新的`Retryable`/`Failed` observation，也不能创建第二个handoff或attempt。

### 19.11 Negative / indeterminate ingress 的零 observation 写集

以下分支即使external side effect可能存在，也不得在本批通过“缺少结果”推导domain状态。它们的写集必须严格为零：

```text
HandoffTargetDeliveryObservation::try_from_adapter = 0
HandoffFact::apply_target_observation = 0
HandoffFactRepository::save_handoff = 0
CapturedMaterialRepository::save_captured_material = 0
ObservabilityMaterialRepository::save_observability_material = 0
non-audit identity allocation = 0
audit trace allocation = 0 for negative/no-op paths; at most one transient candidate for each positive local reapply UoW
audit append / relay / projection marker = 0
new attempt allocation = 0
deliver / inspect_same_attempt re-entry = 0 within this finalizer
```

| ingress / failure | required durable state | allowed next action | forbidden mapping |
|---|---|---|---|
| probe `NotDelivered` | 原`Attempting` progress不变 | 等待formal abort proof与后续policy；本批不做transition | `Retryable`、`Failed`、授权新deliver |
| probe `Unknown` | 原`Attempting` progress不变 | bounded inspection / manual recovery，由D3-D或owner承接 | `NotDelivered`、`Retryable`、`Failed` |
| probe `Unsupported` | 原`Attempting` progress不变 | capability route / manual recovery | `NotDelivered`、`Retryable`、`Failed` |
| probe receipt malformed / correlation mismatch | 原attempt作为recovery evidence保留 | typed invariant route | malformed positive当`Failed` |
| direct adapter port error，external effect unknown | 原`Attempting` progress不变 | exact same-attempt recovery | generic retryable observation |
| trusted clock unavailable / timestamp invalid | 原`Attempting` progress不变 | new invocation或clock recovery | 使用system time、provider time或默认时间 |
| candidate reason/age/receipt shape invalid | 原`Attempting` progress不变 | typed input/integrity error | 从错误文本猜另一branch |

`NotDelivered`的外部无副作用证明本身不是Sandbox domain transition；只有后续独立policy取得formal abort proof后，才能决定
原attempt是否可进入某个既有恢复路径。该policy不属于本批，且不得借D3-B的CAS成功或material lifecycle helper提前授权。

### 19.12 Durable adapter / deterministic fake parity 与静态差集审计

本节记录设计门禁，不宣称已经编译、运行测试或产生evidence。durable与fake必须共享以下行为；fake不能因为便于测试而
直接修改aggregate或跳过CAS。

#### 19.12.1 Parity matrix

| parity surface | durable implementation | deterministic fake | 必须相等的结果 |
|---|---|---|---|
| positive mapping | direct candidate/probe Delivered均经fresh target receipt factory | 注入同样两种positive入口，使用同一validator | matching `HandoffReceiptRef`或同一typed shape error |
| observation factory | 只返回application candidate，domain由application调用 | 不直接构造observation/progress | factory输入字段、错误owner和no-write边界相同 |
| aggregate transition | `apply_target_observation`后按Step 6 precedence重算 | 使用同一domain object或行为等价实现 | 五种progress、五种aggregate关系逐项相同 |
| material cardinality | exact composite/ref reads；changed rows各最多save一次 | 记录读取key、save次数和selection coverage | 0/1/N cardinality及无关material零写相同 |
| UoW visibility | stage在commit前不可读，组内失败整体不可见 | transaction-local staged map，commit前隐藏 | confirmed / NotCommitted / StatusUnknown三分语义相同 |
| Version CAS | stale core/material Version返回对应VersionConflict | 可注入每个root的stale conflict | conflict位置、rollback可见性、local-only recovery相同 |
| CAS loser call budget | 不调用deliver或inspect，保留原attempt | 暴露exact external call counter并断言为0 | external adapter call count相同且不递增 |
| same-result re-entry | exact attempt/result逐字段相等且完整aggregate/material/audit/marker group逐字段匹配时local no-op | 可注入已提交完整相同truth group或缺失/半提交group | 仅完整group no-op；缺失/半提交不误报成功且不重复external call |
| mismatch recovery | different attempt/result/lineage进入typed hold | 可注入relation mismatch | 不覆盖winner、不新建attempt相同 |
| negative probe | NotDelivered/Unknown/Unsupported四类均零Sandbox writes | 每类均可注入并观察所有write counters为0 | branch、reason、recovery identity相同 |
| body/redline | raw provider body永不进入 candidate/domain/repository | 注入body marker必须同样拒绝 | `ForbiddenExternalBody`等既有typed error相同 |

#### 19.12.2 Static difference inventory

| audit item | expected current result | D3-B result |
|---|---:|---:|
| direct Delivered 与 probe Delivered共用local finalizer | 1 kernel | closed |
| `HandoffReceiptRef::try_from_adapter` owner | 1 existing factory | closed;未新增receipt owner |
| `HandoffTargetDeliveryObservation::try_from_adapter` owner | 1 existing factory | closed;未新增observation type |
| `HandoffFact::apply_target_observation` mutation entry | 1 aggregate entry | closed;progress无独立save |
| aggregate precedence | 1 fixed order | closed;cleanup override保留 |
| selected captured material save cardinality | each composite key <= 1 | closed |
| selected observability material save cardinality | <= 1 | closed |
| required audit/marker whole-group relation | existing gate only | closed;无新generic marker |
| post-call CAS token source | fresh `Versioned<T>` only | closed;pre-call Version不入save |
| CAS loser external calls | exactly 0 | closed |
| NotDelivered/Unknown/Unsupported observation writes | exactly 0 | closed |
| progress repository / target save / bulk material save additions | 0 | closed |
| new public status / outcome / receipt / recovery identity | 0 | closed |
| D3-B stored result/idempotency completion | 0;deferred to D3-C | closed as deferred |
| implementation/test/run/evidence/acceptance facts | 0 | closed as not claimed |

#### 19.12.3 D3-B completion gate

`D3-B`只有在以下条件全部满足后才能标记为`completed_wait_user_review`：

1. direct candidate与probe `Delivered`均能回指同一receipt/observation/domain/CAS链；
2. `NotDelivered`、`Unknown`、`Unsupported`和所有shape/clock/correlation failure均有零写矩阵；
3. aggregate、target progress、captured material、observability material的字段来源和cardinality无未命名分支；
4. required audit/marker的source cursor、UoW visibility和same-group关系已明确，且未偷渡D3-C stored completion；
5. core/material Version来源、CAS winner/loser、stale row、relation mismatch、commit unknown deferred boundary均已闭合；
6. durable/fake parity和静态差集审计通过，且未声称实现、测试、run、evidence或验收结果；
7. same-result no-op只有在aggregate、全部selected material和required audit/marker relation完整且逐字段匹配时成立；
8. known CAS loser允许重新分配未提交audit candidate，但attempt identity、external call budget和stored completion边界不变；
9. 三层恢复台账同步到本批完成状态后，停止等待用户复核，不自动进入`D3-C`。

### 19.13 D3-B 语义闭合：完整 group re-entry 与 audit candidate 生命周期

本节是对本批前述同名规则的权威细化。它不新增 public status、outcome、repository、identity kind 或 recovery owner；只
规定既有 aggregate、material、audit、marker、UoW 和 typed allocator 在 concurrent finalization 中的组合条件。

#### 19.13.1 Same-result predicate 必须覆盖完整 committed truth group

`local idempotent-finalized` 不是“当前target progress看起来一样”。只有下列 predicate 全部成立，application 才能把一个
已提交 winner 当作同一结果并返回 no-op：

```text
same_result_noop :=
  exact handoff root exists exactly once
  && immutable ordered target plan is complete and unchanged
  && every target progress row is present, unique and relation-valid
  && current target attempt/result fields match the frozen result exactly
  && aggregate status/reason/cleanup override mechanically derives from full progress
  && every selected captured row is present under its exact composite key
  && every selected observability row is present under its exact ref when selected
  && each selected material status/receipt/reason/time/handoff relation matches its derived kind
  && every required audit/marker member exists exactly once and is source-linked
  && audit/marker outcome, target, receipt-or-reason, material refs and source cursor match
  && no D3-C stored completion is required or silently substituted
```

上述“逐字段匹配”分为两类：

| 字段族 | no-op 时的比较规则 |
|---|---|
| handoff core / plan / progress | `handoff_ref`、lineage、generation、ordered plan、全部target identity、status、attempt ref/count/start、receipt、reason、retry age、status time和cleanup relation逐字段相等；aggregate按固定precedence重算后必须相等。 |
| selected captured material | `(capture_ref, material_key)`、handoff ref、generation、material status、receipt/reason、transition time和material的`last_audit_trace_ref`必须与该group的已提交关系相等；未选row不参与写入或补齐。 |
| selected observability material | exact observability ref、source basis、handoff/generation、status、receipt/reason、transition time和audit linkage逐字段相等；未选row不参与比较。 |
| required audit / marker | kind、source fact、subject、handoff、target、outcome、receipt-or-reason、material ref set、source truth cursor、generation和Linked/marker relation必须完整相等；新生成的`trace_ref`或marker ref不与未提交candidate比较，而是要求已提交关系存在并正确回链。 |

如果任一required member缺失、重复、只stage未commit、cursor不一致、material sidecar缺失或字段不等，结果就不是
same-result。application不得为了“完成”而再次调用`apply_target_observation`、覆盖winner、补写缺失sidecar或新建attempt；应沿
既有 integrity/conflict/recovery mapping 返回。该规则同样适用于 deterministic fake，fake不得以只保存progress的简化map
伪造no-op。

#### 19.13.2 Audit trace ref 是 transient candidate，不是 attempt recovery identity

Step 6 的 `SandboxAuditTraceDraft` 是线性 transient assembly。D3-B 允许在进入该 assembly 之前做一次不分配、不写入的
handoff/group relation preflight，但一旦决定进入正向 transition path，Step 6 的既有顺序必须原样保留如下；preflight不等于
`SandboxAuditSourceBinding`，也不生成或持有 draft：

```text
fresh-read + non-mutating handoff/group relation preflight
  -> confirm a real positive transition is still possible
  -> next_sandbox_audit_trace_ref()
  -> build / validate final source relation and SandboxAuditSourceBinding
  -> SandboxAuditTraceDraft::record(..., trace candidate, ...)
  -> build domain transition with the same trace candidate
  -> stage truth/material/required audit/marker group
  -> assign truth cursor after truth writes are staged
  -> finalize the draft once
  -> append and commit the complete group
```

规则如下：

1. `next_sandbox_audit_trace_ref()`只能由当前handoff finalizer在positive transition path调用；negative/indeterminate ingress、完整
   same-result no-op、relation preflight failure和只读分支的调用次数为零。
2. trace candidate在`commit Confirmed`前不是可见audit事实。若已知`NotCommitted(VersionConflict)`、stage failure或rollback，
   该candidate与其draft必须丢弃，不能进入Query、receipt、log业务字段或recovery identity。
3. known CAS loser进入下一轮local-only reapply时，可以在新的非写入 relation preflight通过后，再次调用同一个既有typed allocator
   生成一个新的transient audit candidate，并重新遵守上述 Step 6 binding -> draft 顺序；这是因为旧draft已经线性消费/丢弃，
   且新UoW需要新的append-only audit relation。该动作不创建新的handoff、material或attempt，不改变frozen result，不调用
   external adapter。
4. `HandoffDeliveryAttemptRef`是external side effect的持久恢复点；无论CAS loser、material Version conflict还是bounded
   local reapply，都必须原样复用该attempt ref，且attempt allocation为零。
5. `StatusUnknown`不是known loser。原始audit candidate、frozen result、attempt ref和source relation必须冻结并交由D3-D的
   whole-group inspection；在inspection结论前不得分配新的audit candidate、attempt或调用任何external adapter。
6. audit trace ref与`SandboxTruthCursor`是不同身份：前者由typed identity allocator提供，后者由当前UoW在truth stage后
   分配；不得互相推导，也不得用Version、timestamp、receipt或attempt ref替代。

#### 19.13.3 CAS loser action matrix

| branch | audit trace candidate | delivery attempt | external adapter | allowed result |
|---|---:|---:|---:|---|
| positive finalization, first UoW not committed | old candidate discarded | same committed attempt | 0 | bounded local reapply or typed conflict |
| known CAS loser, target still matching `Attempting` | allocate at most one new transient candidate in new UoW | reuse exact original attempt; allocate 0 | 0 | local reapply only |
| fresh full group is exact same-result | allocate 0 | allocate 0 | 0 | local idempotent-finalized no-op |
| fresh group is partial, duplicate or mismatched | allocate 0 until recovery owner decides | allocate 0 | 0 | integrity/conflict/recovery hold |
| commit `StatusUnknown` | freeze original candidate; allocate 0 | freeze original attempt; allocate 0 | 0 | D3-D whole-group inspection |
| `NotDelivered` / `Unknown` / `Unsupported` / malformed or clock failure | allocate 0 | allocate 0 | 0 | original `Attempting` remains unchanged |

表中的“allocate at most one”是每个local reapply UoW的上限，不是整个 operation的第二个业务身份。任何实现若把 audit
candidate的重新分配扩展为attempt、handoff、stored completion或external call的重新分配，即违反本批边界。

#### 19.13.4 D3-B static closure result

| audit | expected | result |
|---|---:|---:|
| same-result predicate covers core + all selected material + required audit/marker | 1 complete predicate | closed |
| known loser may reallocate uncommitted audit candidate | allowed, bounded, transient only | closed |
| known loser may reallocate delivery attempt | 0 | closed / forbidden |
| known loser may call `deliver` or `inspect_same_attempt` | 0 | closed / forbidden |
| negative/no-op path audit allocation | 0 | closed |
| `StatusUnknown` new allocation before D3-D inspection | 0 | closed / deferred |
| new public status/outcome/repository/identity owner | 0 | closed |
| D3-C stored result/idempotency completion | 0 | deferred; not claimed |
| implementation, test, run, evidence or acceptance facts | 0 | not claimed |

以上规则补齐了D3-B尚未显式写出的两个语义缺口。它们不构成实现、测试、run、evidence或验收结果。

### 19.14 D3-B completion record: `completed_wait_user_review`

本批中间产物已完成静态闭合，当前停止在用户复核门。正式 `03-详细设计.md`、D3-C stored completion、D3-D commit-unknown
inspection、Step 8和implementation均保持冻结。

```text
current_internal_batch = S7-03C-B1-D-3-B completed_wait_user_review
batch_status = completed_wait_user_review
same_result_group_predicate = closed
audit_candidate_lifecycle = closed
cas_loser_attempt_reallocation = forbidden
cas_loser_external_call = 0
negative_or_noop_audit_allocation = 0
new_l1_l2_blocker = 0
step_7_internal_blockers = 4/6 open with owner
next_internal_batch = S7-03C-B1-D-3-C typed stored receipt and completion relation
next_allowed_action = wait_user_review_before_s7_03c_b1_d3_c
formal_03_07 = historical_reviewed_revalidation_pending
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

完成本批不生成实现commit、run_id、真实evidence alias、验收签署或测试结果；必须等待用户复核后才能启动D3-C。

## EOF Current Recovery Override: `S7-03C-B1-D-3-B` completed, user review pending

本节位于本文物理 EOF，是当前 Step 7 handoff finalization 中间产物的唯一权威覆盖。D3-B 的完整 truth group re-entry、selected
material lifecycle、audit candidate lifecycle、CAS winner/loser、negative zero-write matrix和durable/fake parity静态审计均已
闭合；formal `03-详细设计.md`、D3-C、D3-D、Step 8和implementation保持冻结。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_task = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
current_sub_batch = S7-03C-B1-D-3-B post-call fresh-read and observation CAS completed_wait_user_review
completed_task = S7-03A,S7-03B
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_sub_batch = S7-03C-B1-D-3-C typed stored receipt and completion relation
next_allowed_action = wait_user_review_before_s7_03c_b1_d3_c
task_status = 33_completed,0_in_progress,72_pending,1_blocked
batch_status = completed_wait_user_review
same_result_group_predicate = closed
audit_candidate_lifecycle = closed
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
outcome_blocker = open_wait_s7_03c_s7_05
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

D3-B 完成后停止等待用户复核；不得自动进入 D3-C，不得生成实现 commit、run_id、真实 evidence alias、验收签署或测试结果。

## 20. D3-C typed stored receipt 与 completion relation

### 20.1 开工门禁、输入和边界

本批消费 `S7-03C-B1-D-3-B` 的完整 truth-group finalization、selected material lifecycle、audit candidate lifecycle
和 CAS loser 规则，补齐 handoff 结果如何进入既有 idempotency / stored-result kernel。这里的“receipt”是 application
completion surface 对已提交 Sandbox-owned facts 的冻结关系，不是 external provider 正文，也不是新的
`HandoffReceiptRef` owner。

| item | D3-C current decision |
|---|---|
| stored result kind | 只使用既有 `SandboxStoredResultKind::CommandResult \| ConsumerReceipt \| JobReport`；handoff 不新增 kind。 |
| generic carrier | 只使用既有 `SandboxStoredOperationResult`；保存 operation、kind、stored status、surface ref、recorded time 等 body-free relation。 |
| typed surface owner | opening command 使用既有 `SandboxCommandResultSurface`；retry job 使用既有 `SandboxMaintenanceJobReportSurface` 的 `Maintenance` payload。 |
| completion owner | opening 由 `open_material_handoff` 的 command finalization suffix 完成一次；retry 由 `RetryPendingMaterialHandoffs` 完整 batch chain 耗尽后交 `FinalizeSandboxJobReportInput` 完成一次。target finalizer 不完成 idempotency。 |
| per-target persistence | target progress、attempt、external receipt、selected material lifecycle和audit属于 handoff truth group；不各自生成 stored carrier、surface或idempotency record。 |
| public disposition | `DuplicateReplayed` 只属于本次调用的 application/entry disposition overlay；不得写入 stored status、JobReport original status或任一 frozen surface。 |
| current formal document | 正式 `03-详细设计.md` 仍冻结；本批只写 calibration artifact，不代表实现、测试、run、evidence或验收完成。 |

本批必须复用以下既有 owner，不得通过“handoff completion repository”或“per-target result repository”绕开：

```text
SandboxIdempotencyRecordRepository
  -> get_idempotency_by_ref / find_idempotency_by_binding
  -> claim_idempotency_reservation
  -> save_idempotency_completion / save_idempotency_failure

SandboxStoredOperationResultRepository
  -> create_stored_operation_result
  -> get_stored_operation_result_with_version

SandboxCommandResultSurfaceStore
  -> save_command_result_surface / get_command_result_surface_with_version

SandboxJobReportSurfaceStore
  -> save_job_report_surface / get_job_report_surface_with_version

SandboxReplaySurfaceOutcome
  -> operation-specific typed surface draft
  -> SandboxStoredOperationResult::try_new
  -> carrier/surface validator
  -> SandboxServiceOutcome materialization
```

`SandboxConsumerReceipt` 在本批不被 handoff retry 使用。该 kind 保留给 inbound consumer 的既有 owner；不能因为
external handoff 有 provider receipt 就把它伪装成 `ConsumerReceipt`。external `HandoffReceiptRef` 只能作为
`HandoffTargetDeliveryOutcome`、target progress、audit或 maintenance item 的 typed field/relation，不能成为 stored
surface identity。

### 20.2 Handoff item 到 typed JobReport surface 的映射

`RetryPendingMaterialHandoffs` 是 job-level operation。selection 中每个 `PendingMaterialHandoffGroup` 对应一个且仅一个
`SandboxMaintenanceItemOutcome`，其 primary result ref 是 `SandboxMaintenanceTargetRef::Truth(HandoffFact)`。组内 target
keys、target outcome、external receipt/reason、material refs 和 audit refs必须进入该 item 已有的完整 result/reason
surface，但不扩张 item identity。

```text
one RetryPendingMaterialHandoffs invocation
  -> one Reserved idempotency record
  -> zero or more paged FreshBatch results
  -> one exhausted SandboxFinalizableJobPermit::RetryPendingMaterialHandoffs
  -> one FinalizeSandboxJobReportInput
  -> one SandboxMaintenanceJobReportSurfaceDraft { Maintenance(...) }
  -> one SandboxStoredOperationResult { kind = JobReport }
  -> one Completed idempotency relation
```

对于一页中的 `G` 个 handoff groups，batch item cardinality必须为 `G`；对于完整 invocation，所有 page 的 group identity
必须 ordered-unique。每个 group 的 item必须满足：

| item field family | exact source | D3-C rule |
|---|---|---|
| primary result | 已提交 `HandoffFactRef` | 只引用该 group 的 handoff root；不能由最后一个 target receipt替代。 |
| group target scope | `PendingMaterialHandoffGroup.targets` 与 frozen target plan/progress的交集 | 按 selection/plan canonical order保存；不得从当前 status scan扩张。 |
| target result/reason | D3-B 已提交 observation与完整 progress | 保存每个 selected target 的 final status、attempt ref、receipt-or-reason、observed time和 safe reason；不重跑 external adapter。 |
| material result refs | D3-B 同一 UoW confirmed 的 selected material transition | 只附加实际发生且已提交的 material truth ref；未选 material不进入 report。 |
| audit / marker refs | D3-B required group relation | 必须逐一可回链到 handoff、target、source cursor和generation；transient candidate不能进入 surface。 |
| item status | 完整 group item mapper | `Succeeded/Skipped/Degraded/Failed` 只由已提交 group facts机械派生；不能由 stored finalizer猜测。 |
| external receipt | `HandoffReceiptRef` typed field | 是 item detail，不是 `SandboxMaintenanceResultRef`、stored surface ref或第二 item。 |

因此 JobReport 的 `Maintenance` payload 保存的是完整 batch/item/token chain；它不保存一个新的
`HandoffReceipt` envelope，也不把 group 内每个 target flatten 成独立 job item。`FinalizeSandboxJobReportInput::try_new`
只验证 exhausted permit、page chain、candidate coverage、item shape和机械 report status；它不再次读取 handoff current
truth，不再次执行 D3-B transition。

### 20.3 Opening command 与 retry job 的 completion owner 矩阵

opening 与 retry 是两个不同 application operation，必须各自使用自己的 idempotency identity。opening 的
`SandboxCommandResultSurface` 和 retry 的 `SandboxMaintenanceJobReportSurface` 不得共享 carrier 或 record。

| operation | reservation owner | business group | typed surface | completion point | stored status | duplicate replay |
|---|---|---|---|---|---|---|
| `open_material_handoff` | opening command reservation | `HandoffFact(Pending)` + source material lifecycle + required opening audit/marker | `CommandResult` | opening G07 同一 finalization UoW | `Completed` for Accepted; `Rejected` for rejected surface | exact CommandResult；零 source load、identity、delivery和write |
| `retry_pending_material_handoffs` | job invocation reservation | each selected group的已提交 target/material/audit facts | `JobReport/Maintenance` | all pages exhausted后 shared report finalizer | `Completed` for Succeeded/Skipped/Degraded report; `Failed` only for complete replayable Failed report | exact JobReport；零 selection read、owner reload、delivery和write |
| per-target `deliver` | 不单独拥有 application idempotency | pre-call attempt + post-call handoff/material/audit group | 不产生 typed stored surface | 由所属 command/job operation finalizer统一收口 | 不适用 | 不能独立 duplicate replay |
| `inspect_same_attempt` | 不单独拥有 application idempotency | 只读 probe candidate；不产生 truth | 不产生 typed stored surface | 不适用 | 不适用 | 不得伪装 stored completion |

硬性禁止关系：

1. `open_material_handoff` 成功后，target retry 不得再次调用 opening command finalizer，也不得把 opening 的
   `CommandResult` carrier标记为 retry job 的完成结果。
2. retry job 不得把 opening 的 `HandoffFactRef` 当作自己的 idempotency record、stored result ref或job run id；它只能在
   `Maintenance` report item中引用该 truth ref。
3. 一个 retry job invocation 只能完成自己的一个 `JobReport` carrier/record；不能每个 handoff group 完成一个 record，
   也不能为每个 target 分配 `JobRunId`、stored surface ref或audit completion identity。
4. target finalization 的 truth commit confirmed 是 item可返回的前置事实，但不是 invocation completion；若后续 report
   finalizer失败或 commit unknown，已经提交的 target truth不回滚，job record沿 exact stored/report inspection处理。
5. opening command 的 `CommandResult` 不包含 target delivery receipt；opening 只保存 `Pending` aggregate和 opening
   side-effect relation。retry report 才可携带后续 target receipt/reason。

### 20.4 Fresh completion UoW 的 exact order

#### 20.4.1 Opening `CommandResult` finalization

opening G07 的业务组已经在 §12 定义；D3-C 只规定其 completion suffix必须嵌入同一允许的 finalization UoW，顺序为：

```text
fresh reservation confirmed
  -> exact-read Reserved idempotency record + current Version
  -> validate committed opening truth/audit/marker group
  -> build SandboxReplaySurfaceOutcome(Accepted or Rejected)
  -> build SandboxCommandResultSurfaceDraft with reserved stored_result_ref
  -> save typed CommandResult surface in the same UoW
  -> construct SandboxStoredOperationResult(kind=CommandResult, status=Completed or Rejected, surface_ref, recorded_at)
  -> validate carrier/surface/operation/digest relation
  -> create generic stored carrier in the same UoW
  -> record.mark_completed(...)
  -> save_idempotency_completion(... exact current Version ...)
  -> commit all opening truth + surface + carrier + completion relations once
  -> materialize fresh Accepted/Rejected service outcome
```

`save_command_result_surface` 的 stage success和 `save_idempotency_completion` 的 stage success都不是 commit confirmed。
任一 pre-commit failure使 opening group、surface、carrier和completion不可见；opening source truth按 §12 的 atomicity规则
处理。`StatusUnknown` 冻结 opening 的原 operation、handoff candidate、stored/surface identity和全组 relation，交
20.7 的 whole-group inspection，不得执行第二次 delivery或重新分配 opening identity。

#### 20.4.2 Retry `JobReport/Maintenance` finalization

retry job 的每个 page 只处理 business item。最后一页耗尽后，jobs 将原样 move 的 batch chain和 exhausted permit交给
application shared finalizer；唯一 completion UoW顺序为：

```text
all retry pages completed
  -> build FinalizeSandboxJobReportInput from exhausted permit + full batch chain
  -> exact-read Reserved job idempotency record + current Version
  -> derive SandboxJobReportStatus from complete items
  -> build SandboxReplaySurfaceOutcome(NoChange / Degraded / Failed)
  -> build SandboxMaintenanceJobReportSurfaceDraft { Maintenance(...) }
  -> save typed JobReport surface in the same UoW
  -> construct SandboxStoredOperationResult(kind=JobReport, status=Completed or Failed, surface_ref, recorded_at)
  -> validate carrier/surface/job kind/original run/status/time relation
  -> create generic stored carrier in the same UoW
  -> record.mark_completed(...)
  -> save_idempotency_completion(... exact current Version ...)
  -> commit report surface + carrier + completion once
  -> return fresh NoChange/Degraded/Failed outcome with complete stored relation
```

这里的 `Failed` 只有在完整 `JobReport` surface已经形成且可 replay时才使用 stored status `Failed`；若根本无法形成
完整 report surface，则只能按既有 `save_idempotency_failure` terminal-failure owner处理，不能创建半成品 JobReport。
前序 page 的 handoff truth 已提交，report finalizer失败不回滚这些 truth，也不重新执行 page item。

### 20.5 Duplicate exact replay 与 zero-write

opening 和 retry duplicate 都必须在任何业务读取、selection读取、identity allocation、clock读取或 external call之前
结束。两者只复用对应 operation 的 completed idempotency relation：

```text
find exact existing binding
  -> require same operation + same key + same request digest
  -> get exact idempotency record in one committed snapshot
  -> require Completed + exact stored_result_ref
  -> get generic SandboxStoredOperationResult
  -> require expected kind (CommandResult or JobReport)
  -> get matching typed surface by (surface_ref, stored_result_ref, operation)
  -> validate full carrier/surface/relation bundle
  -> return DuplicateReplayed overlay over original frozen surface
```

duplicate deny-set固定为：

| action | allowed count |
|---|---:|
| source / handoff / material / target progress read for business execution | 0 |
| selection page read / job permit creation or continuation | 0 |
| `deliver` / `inspect_same_attempt` / publisher / resolver | 0 |
| stored carrier or typed surface allocation/save | 0 |
| handoff / attempt / audit / material / truth identity allocation | 0 |
| business write UoW / idempotency transition / cursor allocation | 0 |
| diagnostic hook | only post-return low-cardinality hook; failure cannot change replay |

缺失、wrong-kind、half-commit、carrier/surface字段不一致或 typed surface 不可 rehydrate 时，返回既有
`DuplicateMissingResult` / integrity error；不得从当前 handoff progress、report count、last receipt或source material
重新构造 completion。`DuplicateReplayed` 只在内存返回 envelope 时附加，原始 `SandboxJobReportStatus`、stored status、
original run id、times、target item和receipt refs全部保持不变。

### 20.6 `NotCommitted`、`StatusUnknown` 与 `save_idempotency_failure`

| branch | committed fact | completion action | identity / external rule |
|---|---|---|---|
| pre-commit `NotCommitted` | 本 UoW staged delta 已证明不可见 | 丢弃 surface/carrier candidate；返回 typed persistence error或由 explicit recovery owner决定 | 不重用 candidate；不调用 external；不分配第二 stored/surface ref |
| pre-commit `StatusUnknown` | 不能证明 whole group committed/absent | 冻结原 record、stored/surface refs、handoff/group relation和attempts，进入 whole-group inspection | 不返回 success；不生成第二 record、surface、attempt或delivery call |
| completion UoW rollback confirmed | staged completion group不可见 | 保留已提交 handoff/page truth；按原 operation error policy返回 | 不把 rollback success当 business completion |
| 无法形成完整 replayable surface | 没有合法 typed surface/carrier | 仅在 record仍 Reserved 且 owner决定 terminal failure时调用 `record.mark_failed` + `save_idempotency_failure` | stored linkage必须为空；不伪造 Failed JobReport/CommandResult |
| 完整 replayable Failed surface | full typed surface和carrier已形成 | 走 `mark_completed` + `save_idempotency_completion`，stored status=`Failed` | record为 Completed；可 exact duplicate replay |

`save_idempotency_failure` 不代表 handoff target failed，也不改变 `HandoffFactStatus::Failed`；它只表示 application
operation 未能形成可 replay 的 public stored surface。target `Failed` 必须留在 handoff progress/group item，由 opening/retry
operation的正常 completion surface承载。

### 20.7 Whole-group inspection boundary for completion unknown

D3-C 只定义 inspection 输入和三分结果，不新增 recovery repository或 public status。inspection 必须冻结并 exact-read：

```text
operation + idempotency key + request digest
idempotency_record_ref + record Version/status
stored_result_ref + expected stored kind/status
typed surface_ref + typed surface relation
handoff_ref + complete plan/progress/attempt vector
selected material refs + material Versions/statuses
required audit/marker refs + source cursor/generation
job_run_id + original report status + complete batch/item/token chain (retry job only)
```

| inspection result | proof | allowed mapping |
|---|---|---|
| `FullyCommitted` | idempotency `Completed`、generic carrier exactly one、typed surface完整可 rehydrate，且 opening/retry business group cardinality、lineage、status、audit/marker relation全部匹配 | 只返回原 frozen outcome；本次调用可 overlay `DuplicateReplayed`；不读 current/latest，不执行业务。 |
| `FullyAbsent` | idempotency completion、carrier、typed surface和本次 operation 的 completion relation全部不存在；若 operation是 opening，还必须证明 source material未被 opening改写 | 只允许由显式 recovery invocation沿原 operation/identity继续；不得在当前栈帧盲重试。 |
| `Indeterminate` | 任一 half-commit、dependent row缺失、wrong relation、snapshot不可用或 source/material 已部分改变 | fail-closed integrity/recovery hold；冻结原 identity和attempt，交 D3-D whole-group inspection owner。 |

opening 与 retry 的 `FullyCommitted` proof不同：opening必须证明 `HandoffFact(Pending)`、source lifecycle和
`CommandResult` 同组完整；retry必须证明所有已提交 page item关系、完整 `Maintenance` report surface和 `JobReport` carrier
同组完整。retry 的一个 group item缺失不能由读取 current handoff补写；opening 的一个 material row缺失不能由 retry job修复。

### 20.8 Durable / fake parity 与静态差集

本批只形成实现约束，不声称测试结果。durable adapter和deterministic fake必须共享以下 observable contract：

| dimension | required parity | fake forbidden shortcut |
|---|---|---|
| stored kind/status mapping | `CommandResult` 与 `JobReport` 的 status/ref/time relation完全一致 | 只保存 outcome enum或把 `DuplicateReplayed`持久化 |
| cardinality | 一个 operation 一个 idempotency record，一个 opening command或retry job一个 stored carrier/surface | 每个 target一个 fake result record；缺行自动补齐 |
| duplicate | exact carrier + typed surface replay，zero business read/write/call | 重跑 handoff map、从当前 progress重组 report |
| commit visibility | stage success与commit confirmed严格区分，unknown进入同一三分 inspection | fake commit直接可见或把异常当 rollback |
| missing/corrupt relation | wrong-kind、missing、half-commit均为 integrity/duplicate-missing | 以默认 empty/Failed/Skipped掩盖缺失 |
| target receipt | receipt只在 progress/item detail中出现，不成为 stored identity | receipt ref当 surface ref或第二 item |
| failure finalizer | 无完整 surface才允许 stored linkage为空的 terminal failure | 生成 placeholder Failed surface |

静态差集必须为零：

```text
new stored result kind                         = 0
new handoff completion repository              = 0
new per-target idempotency record              = 0
new per-target stored/surface identity         = 0
opening finalizer invocation during retry      = 0
retry finalizer invocation per handoff group   = 0 (one per job invocation only)
DuplicateReplayed persisted as original status = 0
blind retry after StatusUnknown                 = 0
implementation/test/run/evidence/acceptance claims = 0
```

### 20.9 D3-C completion gate

`D3-C` 只有在以下条件全部满足后才能标记完成：

1. typed stored kind、generic carrier、opening CommandResult、retry JobReport/Maintenance surface和external receipt字段
   的 owner/cardinality已逐项闭合；
2. opening command 与 retry job 的 completion owner、UoW 顺序和禁止混用关系已明确；
3. fresh completion、duplicate zero-write、missing/wrong-kind、NotCommitted、StatusUnknown、terminal failure和
   replayable Failed 的动作矩阵已覆盖；
4. retry job 的一个 handoff group -> 一个 maintenance item -> 一个 job-level report relation已证明，不存在 per-target
   stored identity；
5. opening/retry whole-group inspection 所需冻结字段、三分结果和 D3-D 承接边界已明确；
6. durable/fake parity 和静态差集为设计闭合，不冒充运行测试；
7. calibration flow、project ledger、`/tmp`计划已同步到本批完成状态；
8. 正式 `03-详细设计.md`、Step 8、implementation、run/evidence/acceptance均保持未启动。

### 20.10 D3-C completion record: `completed_wait_user_review`

本批中间产物已完成静态设计闭合，当前停在用户复核门。D3-D 的 commit-unknown/no-rollback 深化、B1 closure、Step 8、
正式 `03`和 implementation 均保持冻结。

```text
current_internal_batch = S7-03C-B1-D-3-C completed_wait_user_review
batch_status = completed_wait_user_review
stored_result_kinds = CommandResult|ConsumerReceipt|JobReport (unchanged)
handoff_opening_completion_owner = existing CommandResult finalizer
handoff_retry_completion_owner = existing JobReport/Maintenance finalizer
per_target_stored_identity = forbidden
duplicate_write_budget = 0
new_l1_l2_blocker = 0
step_7_internal_blockers = 4/6 open with owner
next_internal_batch = S7-03C-B1-D-3-D commit-unknown and no-rollback inspection
next_allowed_action = wait_user_review_before_s7_03c_b1_d3_d
formal_03_07 = historical_reviewed_revalidation_pending
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批完成后停止等待用户复核；不得自动进入 D3-D、B1-E、Step 8或implementation，不生成实现 commit、run_id、真实 evidence
alias、验收签署或测试结果。

## EOF Current Recovery Override: `S7-03C-B1-D-3-C` completed, user review pending

本节位于本文物理 EOF，是当前 Step 7 handoff finalization 中间产物的唯一权威覆盖。D3-C 已闭合既有 typed stored result、
opening command completion、retry job report completion、per-target/cardinality、duplicate zero-write、failure与unknown
边界；正式 `03-详细设计.md`、D3-D、Step 8和implementation保持冻结。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_task = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
current_sub_batch = S7-03C-B1-D-3-C typed stored receipt and completion relation completed_wait_user_review
completed_task = S7-03A,S7-03B
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-D-3-D commit-unknown and no-rollback inspection
next_allowed_action = wait_user_review_before_s7_03c_b1_d3_d
task_status = 34_completed,0_in_progress,71_pending,1_blocked
batch_status = completed_wait_user_review
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
outcome_blocker = open_wait_s7_03c_s7_05
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

D3-C 完成后停止等待用户复核；不得自动启动 D3-D、B1-E、Step 8或implementation，不生成实现 commit、run_id、真实 evidence
alias、验收签署或测试结果。

## 21. D3-D commit-unknown、no-rollback 与 parity closure

### 21.1 开工门禁与 current correction

本批消费 D3-C 的 typed stored completion、opening/retry completion owner 和三分 inspection 输入，继续收口 handoff
finalizer 在 commit / rollback 结果未知时的 exact action。D3-D 不新增 public status、public error、repository、stored
kind、recovery identity 或 generic inspector；它只把既有 `SandboxUnitOfWorkManager`、exact repository reads、
`FrozenGroupPlan` 和 operation-specific owner 组合成可执行的 application-local 规则。

| scope | D3-D current decision |
|---|---|
| commit errors | 继续复用 `SandboxCommitError::{NotCommitted, StatusUnknown}`；二者不可合并。 |
| rollback errors | 继续复用 `SandboxRollbackError::{Failed, StatusUnknown}`；rollback failure不证明delta absent。 |
| inspection result | 只使用既有 private conceptual `FullyCommitted \| FullyAbsent \| Indeterminate`；不持久化、不进入Step 8 DTO。 |
| completion recovery | `FullyCommitted` 恢复原 fresh outcome；当前同一调用不得叠加 `DuplicateReplayed`。后续新的 exact duplicate invocation才允许 overlay `DuplicateReplayed`。 |
| target recovery | target truth或material group未知时只允许 exact local-only recovery；不得重新 `deliver`、`inspect_same_attempt`、分配attempt或回滚source。 |
| report recovery | retry report completion未知时只重验/恢复report completion；不得重读selection、重跑page item或修改已提交handoff truth。 |
| formal boundary | 正式 `03-详细设计.md`、B1-E、Step 8、implementation均保持冻结。 |

D3-C §20.7 中“`FullyCommitted` 后本次调用可 overlay `DuplicateReplayed`”只作为历史批次草稿保留；它与既有 B4
§57.2 的 fresh finalization 规则冲突，D3-D current authority改为：

```text
same in-flight invocation + completion inspection FullyCommitted
  -> restore original fresh outcome from exact frozen stored surface
  -> do not add DuplicateReplayed

later new invocation + exact completed idempotency binding
  -> exact duplicate read
  -> add DuplicateReplayed only as current-call disposition overlay
```

该修正不改变 persisted original status、stored status、job run、times、item refs、target receipts或任何已提交 truth。

### 21.2 Frozen plan：在 commit / rollback 前锁定完整成员集合

D3-D 沿用既有 `FrozenGroupPlan` private conceptual carrier。它不能实现 `Serialize`、不能进入 DTO、不能由 transaction ref
反查生成，也不能在 inspection 中被 current/latest source 替换。plan 必须在调用 `commit` 或 `rollback` 前完成，并至少冻结：

| plan member | handoff exact content | inspection purpose |
|---|---|---|
| phase/mode | `ReservationOnly`、`ReplayableCompletion`、`TerminalFailure` 或 `RollbackAfterStageFailure`；另保存 application-local handoff phase label | 决定允许的 after/before relation和是否允许恢复原结果。 |
| operation identity | operation、idempotency key、request digest、binding、record ref、reserved time | 防止按route、target、当前context猜测winner。 |
| transaction | original `SandboxTransactionRef`、`commit_eligible`、trusted time frame | 只作诊断和成功资格判断；transaction ref不是store lookup key。 |
| before relation | idempotency record/binding、handoff core、material rows、audit/marker、surface/carrier的 exact before shape与Version | 区分本次delta absent和其它调用已推进。 |
| after relation | expected handoff/progress/material/audit/marker/stored/completion candidate及完整cardinality | 证明whole group而不是单行已提交。 |
| identity set | handoff ref、attempt ref、audit trace candidate/ref、truth cursor candidate、stored result ref、surface ref、job run id | 约束unknown后不得换identity。 |
| external correlation | exact target、attempt、generation、payload/material selection relation | 只用于已有 same-attempt recovery，不允许重新外呼。 |
| optional set | 在stage前已决定的required/conditional audit、relay、projection marker和selected material集合 | inspection不能临时增加、删除或忽略optional member。 |
| actual staged set | stage failure/rollback路径中逐项记录已成功stage的成员 | 防止partial subset被误判为完整success。 |

plan禁止保存 provider body、raw response、stdout/stderr、path、secret、SQL、driver cause或外部正文。若现有 Step 7
exact reader无法按 named ref读取required member，结果固定为 `Indeterminate`；不得新增 generic `inspect_group` API。

### 21.3 六类终结阶段的 expected group

下表是 handoff 相关 commit / rollback boundary的唯一阶段矩阵。每一行的 expected group都必须在plan中逐项列出；不能以
“handoff已存在”“report count正确”或“最后receipt存在”替代完整成员集合。

| phase | `commit_eligible` | expected committed group | unknown后外部调用 | completion owner |
|---|---:|---|---:|---|
| attempt reservation before `deliver` | yes | `HandoffFact` current `Attempting` progress、exact attempt relation、required pre-call audit/recovery marker | 0；未确认attempt commit前不得调用adapter | handoff target owner；不产生stored completion |
| post-call target/material finalization | yes | handoff core/progress、selected material/observability lifecycle、required audit/marker、truth cursor relation | 0；finite observation只可local-only reapply | handoff target finalizer；不完成job idempotency |
| opening command completion | yes | opening `HandoffFact(Pending)`、selected source lifecycle、required opening audit/marker、typed `CommandResult` surface、generic carrier、Completed idempotency record | 0；只做whole-group inspection | existing command finalizer |
| retry job report completion | yes | complete prior page/item chain、typed `JobReport/Maintenance` surface、generic carrier、Completed idempotency record | 0；不重读selection或重跑item | existing shared job report finalizer |
| terminal operation failure | yes | exact Reserved -> Failed record、terminal time、required safety audit/recovery marker；stored/carrier必须为空 | 0 | existing failure finalizer |
| rollback after stage failure | no | actual staged subset only；不得把任何subset定义为success group | 0 | original stage-error owner / consistency recovery |

opening 的 rejected branch使用同一 `ReplayableCompletion` 规则，但其 business group明确为 rejection audit + typed
`CommandResult` + carrier + completion；不得凭空加入 `HandoffFact` 或 source lifecycle。retry report finalizer的
expected group不包含任何新的 handoff transition，因为page item truth已经由前序UoW确认提交。

### 21.4 Exact whole-group inspection algorithm

所有 D3-D inspection都必须按以下顺序执行。inspection是只读动作，不持有可写UoW，不分配clock/cursor/identity，不调用
external adapter，也不调用bounded selection index：

```text
freeze operation-specific plan before commit / rollback
  -> open one SandboxCommittedReadSnapshot
  -> read exact idempotency binding and record by named ref
  -> read every frozen handoff/progress/material/observability member with its Version
  -> read every frozen audit/marker/cursor relation by exact ref
  -> for replayable completion, read generic carrier and exactly one expected typed surface
  -> validate before/after shape, lineage, generation, cardinality and operation relation
  -> close the committed snapshot
  -> classify only after all reads and close succeed
```

inspection的固定 deny-set：

| action | budget | rule |
|---|---:|---|
| write UoW / `save_*` / `mark_*` | 0 | inspection不修复、不补行、不推进状态。 |
| identity / cursor / trusted clock allocation | 0 | candidate、surface、audit、attempt和cursor均沿plan读取。 |
| `deliver` / `inspect_same_attempt` / publisher / resolver | 0 | external side effect只能由后续显式 owner决定。 |
| source latest/all/index scan | 0 | 只读plan内exact refs；缺失不降级为Absent。 |
| current truth重组stored surface | 0 | replay必须来自已冻结typed surface。 |
| diagnostic hook | post-commit或inspection结束后才允许 | hook失败不改变三分结果。 |

一个member读取失败后可以继续读取其余exact members供内部诊断，但最终不能从 `Indeterminate` 升级。snapshot open、
任何read或close unavailable，均为 `Indeterminate`。不能用多个snapshot拼接before/after，也不能用timestamp、row count、
serialized equality或假定 `Version + 1` 代替typed relation proof。

### 21.5 Member matcher 与三分分类

| member class | `after` match | `before/absent` match | other result |
|---|---|---|---|
| handoff create/open | exact ref存在，lineage、plan、progress、status和generation逐字段等于candidate | exact ref不存在且所有source lifecycle仍为opening前shape | same ref不同body、wrong kind、partial progress、unavailable -> `Indeterminate` |
| mutable handoff/material update | object等candidate且current Version不同于frozen before Version；所有selected rows均匹配 | object等before且Version等before；未选row保持原样 | 只匹配object、只匹配Version、row缺失或被第三者推进 -> `Indeterminate` |
| append-only audit/marker | exact ref、source binding、cursor、cardinality和payload relation等candidate | exact ref不存在且owner relation也不存在 | duplicate、ref-only、wrong source/generation -> `Indeterminate` |
| truth/reference cursor | cursor被完整group成员引用且同代关系成立 | 未分配或所有before成员保持原cursor relation | 孤立cursor、cursor存在但成员缺失 -> `Indeterminate` |
| idempotency record | exact binding、record status、terminal time、stored ref和Version符合phase after | phase before relation逐字段保持；completion模式仍为Reserved | multi-winner、wrong digest/status/time -> `Indeterminate` |
| generic carrier + typed surface | exactly one expected kind，carrier/surface validator全通过 | completion candidate二者均absent；failure/reservation按plan要求为空 | proper subset、wrong kind、mixed time/ref -> `Indeterminate` |

`FullyCommitted` 只有所有 required members都匹配after、所有 selected optional members按plan存在且没有额外member时成立。
`FullyAbsent` 只有所有 attempted create/append均absent、所有update仍匹配before、且phase-specific before relation完整时成立。
任何 subset、mixed after/before、concurrent replacement、wrong relation或无法读取均为 `Indeterminate`。

### 21.6 各阶段的 conservative mapping

#### 21.6.1 Attempt reservation unknown

| inspection | exact proof | current mapping | next action |
|---|---|---|---|
| `FullyCommitted` | unique binding指向exact Reserved record，attempt relation和pre-call audit完整 | `IdempotencyInFlight` / delayed-safe；不开始deliver | 保留同一attempt和record，等待后续显式 recovery owner。 |
| `FullyAbsent` | binding、attempt、pre-call audit和candidate relation全不存在 | `InternalInvariantViolation`；当前调用终止 | 显式新调用才可重新preflight；不得复用未证实candidate。 |
| `Indeterminate` | partial relation、wrong winner、unavailable或generation conflict | `InternalInvariantViolation` + hold | 冻结attempt和operation；不外呼、不换attempt。 |

#### 21.6.2 Post-call target/material finalization unknown

`HandoffTargetDeliveryObservation`已经形成且external call已结束时，inspection只判断 Sandbox truth group是否提交；它不重新
解释provider结果：

| inspection | exact proof | current mapping | forbidden |
|---|---|---|---|
| `FullyCommitted` | handoff/progress、selected materials、audit/marker、cursor全匹配after | 从已提交group形成原 item outcome；fresh continuation可返回原 item | `DuplicateReplayed` overlay、重调adapter、生成新attempt |
| `FullyAbsent` | all attempted mutations absent，handoff/material仍为before，原attempt relation仍可exact read | 交 operation-specific local-only recovery；可在显式 owner批准后重用同一finite observation和attempt | 当前栈帧重commit、重新deliver、换attempt、回滚capture |
| `Indeterminate` | 任一material/audit/progress partial或snapshot不可用 | integrity/recovery hold | 选多数成员、只看aggregate、补sidecar |

若external结果本身为 `Unknown`，必须先走 D3-A same-attempt probe；不能因为 Sandbox truth group `FullyAbsent` 就把
provider side effect假定为absent。只有 probe 已得到可重放的 finite observation，才可能由 local-only recovery owner再次提交
同一 attempt；该路径的 external call 和 attempt allocation均为0。

#### 21.6.3 Opening command completion unknown

| inspection | exact proof | current mapping | forbidden |
|---|---|---|---|
| `FullyCommitted` | opening handoff/source lifecycle、audit/marker、CommandResult surface、carrier和Completed record全匹配 | 从exact persisted CommandResult恢复原 `Accepted` 或 `Rejected` fresh outcome；不加duplicate overlay | 读取current source重组、再开handoff、再分配guard/material |
| `FullyAbsent` | handoff/source lifecycle/required completion relation均absent且source仍为opening前shape | 交显式 opening completion recovery；沿原operation/identity重做同一组 | 新handoff ref、第二stored/surface ref、delivery call |
| `Indeterminate` | partial handoff、material改写、stored half-commit或read gap | integrity/quarantine hold | 把source row当absent、补一行或回滚capture |

`FullyCommitted` 的返回是原始 fresh command outcome，不是 duplicate。后续同一 operation 的新调用才从 Completed record
走 duplicate exact replay。

#### 21.6.4 Retry JobReport completion unknown

| inspection | exact proof | current mapping | forbidden |
|---|---|---|---|
| `FullyCommitted` | full prior page/item/token chain、Maintenance surface、carrier和Completed record全匹配 | 从exact persisted JobReport恢复原 `NoChange`、`Degraded`或`Failed` fresh job outcome | 新job run、重读selection、重跑handoff target |
| `FullyAbsent` | report surface/carrier/completion relation全absent；已提交page truth仍保持，job record仍Reserved | 交 completion-only recovery；只重做report surface/completion，不执行任何page item | 新page、selection scan、delivery、第二record |
| `Indeterminate` | report partial、carrier wrong-kind、item chain缺失或snapshot gap | internal/quarantine hold | 从current handoff重建report、按count补item |

report completion的失败不能回滚已提交 page truth。`FullyCommitted`也不把原调用改写成 `DuplicateReplayed`；仅后续
exact duplicate invocation有该overlay。

#### 21.6.5 Terminal failure completion unknown

| inspection | exact proof | current mapping | forbidden |
|---|---|---|---|
| `FullyCommitted` | record exact Failed、terminal time和required safety audit/marker全匹配，stored linkage为空 | 返回原 safe failure disposition；same key保持 `IdempotencyFailedTerminal` | 创建placeholder surface、改Completed |
| `FullyAbsent` | before Reserved完整，failure delta和marker均absent | consistency/safety hold；不自动重跑 | 重新执行业务、假定失败已记录 |
| `Indeterminate` | partial Failed/marker、concurrent completion或read gap | internal consistency hold | 删除partial、补marker、选择winner |

#### 21.6.6 Rollback failed / rollback unknown

rollback发生在 `commit_eligible = false` 的stage-failure路径。无论 inspection观察到什么，都不允许形成fresh success：

| inspection | allowed mapping | reason |
|---|---|---|
| all actual staged members exact absent，所有before成员保持原样 | 返回原 stage error | 只能证明attempt delta absent，不证明业务operation完成。 |
| 任一candidate/member可见或关系partial | `InternalInvariantViolation` + hold | rollback failed/unknown不能把subset升级为commit。 |
| snapshot/read/close unavailable | `InternalInvariantViolation` + hold | 无法证明absent。 |

### 21.7 No-rollback matrix

Sandbox handoff 的 no-rollback 规则按事实所有权分层。任何补偿动作都不能删除或反转已确认的 source truth、external
side effect或其它 target 的结果：

| already known fact | failure/unknown after it | must remain | forbidden rollback |
|---|---|---|---|
| immutable `CaptureFact`、completed run或formal terminal owner | opening/retry/target completion failure | 原对象、lineage、capture material identity和source status | 删除capture、把run改回running、重建terminal owner |
| earlier selected material transition already committed | later target retryable/failed或report finalizer failure | material lifecycle、receipt/reason、audit relation | 回退material到Prepared/Captured、清除audit |
| earlier target progress/receipt already committed | later target failure/commit unknown | earlier target status、attempt和receipt | 用最后一个receipt覆盖全aggregate、重开 earlier attempt |
| external `deliver`已确认或状态未知 | Sandbox post-call persistence failure | same attempt correlation和provider recovery point | blind redelivery、new attempt、把unknown转Retryable |
| retry page truth已提交 | final JobReport surface/carrier completion失败 | page item truth、handoff progress、material/audit facts | 重跑selection/page、回滚target truth |
| cleanup guard/redline containment已阻断 | any handoff completion outcome | safety block、containment和strict hold | 通过report或stored completion解除guard/containment |

opening 的同组 write 若出现 `StatusUnknown`，不能先假定 source 已写入再做补偿；必须用 21.6.3 的 whole-group proof。若
group为 `Indeterminate`，source truth和已分配identity都冻结，交 recovery/quarantine owner；不得用“no-rollback”名义删除
部分可见成员。

### 21.8 Durable / fake parity 与 failpoint inventory

以下是实现阶段必须保持的 parity contract和静态 failpoint inventory，不是已执行测试。durable adapter与deterministic fake
必须暴露等价的可观察终结语义：

| boundary | durable requirement | fake requirement | forbidden shortcut |
|---|---|---|---|
| attempt stage | stage-only不可见，Confirmed后才可外呼 | transaction-local stage map；未Confirmed不可被shared read看到 | fake直接改current progress |
| target truth stage | all selected material/audit/marker与handoff同组 | same member cardinality和Version matcher | 只保存aggregate/status |
| stored surface stage | typed surface、carrier、record relation同UoW | exact kind/status/ref/time校验 | 只保存JSON/outcome enum |
| commit result | independently produce Confirmed/NotCommitted/StatusUnknown | 三类可注入且保持同一mapping | unknown自动转Confirmed |
| rollback result | confirmed rollback证明delta absent；failed/unknown不证明 | 可注入两种rollback failure并保留partial state | failure自动清空共享state |
| snapshot | one committed generation for all inspection reads | opened snapshot冻结，外部mutation不改变视图 | latest reload拼接 |
| version | opaque per-owner Version，不能假定递增 | opaque generation与durable比较规则一致 | `version + 1` shortcut |
| missing relation | missing/wrong-kind/half-commit均保守分类 | 同样返回integrity/indeterminate | 默认Skipped/Failed补行 |
| identity budget | unknown/inspection不再分配identity | fake计数与durable contract相同 | 便捷生成第二attempt/surface |
| no-rollback | 已提交source/page/target事实不可回退 | fake也保留既有事实 | reset whole fake state |

实现阶段的 failpoint 必须覆盖：每个required member stage后、cursor分配后、typed surface保存后、carrier保存后、idempotency
completion stage后、commit三种结果、rollback两种未知/失败结果、inspection每类read/close gap。此处只登记覆盖面，不生成
case id、run id、evidence alias或测试结论。

### 21.9 D3-D static difference audit

| audit item | expected | D3-D design result |
|---|---:|---:|
| new public commit-unknown/recovery status | 0 | closed / forbidden |
| new generic inspection repository/API | 0 | closed / forbidden |
| new handoff completion owner | 0 | opening CommandResult + retry JobReport existing owners only |
| same-call `FullyCommitted` -> `DuplicateReplayed` overlay | 0 | closed / forbidden |
| external call after attempt or completion `StatusUnknown` | 0 | closed / forbidden |
| new attempt after target truth unknown | 0 | closed / forbidden |
| new stored/surface/idempotency identity during inspection | 0 | closed / forbidden |
| page item rerun after retry report completion unknown | 0 | closed / forbidden |
| source/capture/material rollback | 0 | closed / forbidden |
| rollback unknown treated as success | 0 | closed / forbidden |
| fake-only repair or auto-success | 0 | closed / forbidden |
| implementation/test/run/evidence/acceptance claims | 0 | not claimed |

### 21.10 D3-D completion gate

`D3-D` 只有在以下条件全部满足后才能标记完成：

1. attempt reservation、target truth/material、opening completion、retry report completion、terminal failure和rollback
   六类阶段的 expected group 与 `commit_eligible` 已逐项冻结；
2. exact whole-group inspection 的读取顺序、deny-set、member matcher和三分分类已闭合；
3. `FullyCommitted`、`FullyAbsent`、`Indeterminate` 对各阶段的 application mapping已明确，且 fresh recovery与后续
   duplicate overlay严格分离；
4. external side-effect unknown、Sandbox truth commit unknown、stored completion unknown和rollback unknown未被混为一类；
5. source truth、已提交material、先前target/page事实和cleanup/redline安全阻断的 no-rollback 矩阵已闭合；
6. durable/fake parity、failpoint inventory和静态差集已记录，但未冒充测试执行结果；
7. 三层台账和 `/tmp` 计划同步到 `completed_wait_user_review`；
8. 正式 `03-详细设计.md`、B1-E、Step 8、implementation、run/evidence/acceptance均未启动。

### 21.11 D3-D completion record: `completed_wait_user_review`

本批中间产物已完成静态设计闭合，当前停在用户复核门。下一批只允许进行 B1 closure / cross-audit；不得自动进入 Step 8、
正式 `03`或implementation。

```text
current_internal_batch = S7-03C-B1-D-3-D completed_wait_user_review
batch_status = completed_wait_user_review
commit_unknown_modes = attempt|target_truth|opening_completion|retry_report|terminal_failure|rollback
inspection_result = FullyCommitted|FullyAbsent|Indeterminate (private conceptual result)
same_call_duplicate_overlay = forbidden
external_call_after_unknown = 0
new_identity_during_inspection = 0
source_rollback = forbidden
new_l1_l2_blocker = 0
step_7_internal_blockers = 4/6 open with owner
next_internal_batch = S7-03C-B1-E cross-audit and B1 closure
next_allowed_action = wait_user_review_before_s7_03c_b1_e
formal_03_07 = historical_reviewed_revalidation_pending
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

D3-D 完成后停止等待用户复核；不得自动进入 B1-E、Step 8或implementation，不生成实现 commit、run_id、真实 evidence alias、
验收签署或测试结果。

## EOF Current Recovery Override: `7R-05-B3-C2` completed, `C3` current

本节是 capture/handoff owner 中间产物的当前恢复覆盖。C2 已完成 handoff method group 的 design-static durable/fake parity，
包括同一 attempt inspection、unknown/unsupported 保留、no-rollback 和 zero external re-entry。旧 D3 段落仍是历史审计材料；当前
不恢复旧 `MaterialHandoffPort` 正向 surface，也不把 C2 结果写成运行事实。C3 尚未写正文，仅等待按 SOP 读取来源。

```text
current_plan_version = v7.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C3 legacy material/observability negative audit (source-read gate)
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
completed_internal_tasks = 7R-05-B3-C1|7R-05-B3-C2
pending_internal_tasks = 7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
historical_material = S7-03C old MaterialHandoffPort/ObservabilityMaterialPort positive signatures
current_delivery_surface = HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}
gate_status = in_progress
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = read_7r_05_b3_c3_sources_then_write_legacy_negative_audit
```

## EOF Current Recovery Override: `7R-05-B3-C1` completed, `C2` current

本节是 capture/handoff owner 的最新恢复覆盖。capture collection 两个 method 的 durable/fake 设计静态 parity 已由
`03_ddd_step_07_infra_adapters_fake_parity.md` §20 收口；当前只转入 handoff delivery method group。这里不把 C1 设计结果写成
provider conformance、编译、测试、run、evidence 或验收事实。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C2 HandoffTargetDeliveryPort method group
completed_internal_tasks = 7R-05-B3-C1 capture method group
pending_internal_tasks = 7R-05-B3-C2|7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5
capture_method_group = completed_design_static_only
current_delivery_surface = HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}
old_material_handoff_surface = historical_or_invalidated; not restored as second application callable surface
formal_03_writeback = forbidden
outcome_blocker = open_wait_7r_05_b3_b5
new_l1_l2_blocker = 0
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = write_7r_05_b3_handoff_method_group
```

## EOF Current Recovery Override: `7R-05-B2` consumed, `7R-05-B3` in progress

本节追加于本文真正物理 EOF。前文 `S7-03C` 批次和 B1-E 状态均保留为 historical material；本节只同步当前恢复点，不能把
`MaterialHandoffPort` 旧正向签名恢复为 application callable surface。B2 的共同 durable/fake 语义已由用户本次“继续”消费，
当前只允许在 `7R-05` parity 中间产物中推进 B3。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
consumed_review_gate = 7R-05-B2
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
historical_material = S7-03C old ExecutionCapturePort/MaterialHandoffPort positive surface
current_capture_surface = CaptureCollectionPort::{collect_capture,inspect_capture}
current_delivery_surface = HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}
observability_material_surface = bounded source-material handoff only; no observability truth ownership
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = write_7r_05_b3_capture_method_group
```

## EOF Current Recovery Override: `S7-03C-B1-E` consumed, `7R-05-B1` current

本节位于本文真正物理 EOF，是 capture/handoff owner 的当前恢复覆盖。D3-D 后续的 B1-E cross-audit 已完成并经用户确认消费；当前 owner 已切换到 `7R-05-B1`。本节不把 capture/handoff 设计静态闭合写成 durable/fake/provider conformance。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
s7_03c_status = B1-E_static_cross_audit_completed_review_consumed
s7_03c_detailed_artifact = 03_ddd_step_07_cross_audit_b1_closure.md
current_sub_batch = 7R-05-B1 completed_wait_user_review
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
outcome_blocker = open_wait_7r_05_b2_b5
next_allowed_action = wait_user_review_before_7r_05_b2
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## EOF Current Recovery Override: `7R-05-B1` authoritative before B2

本节追加于本文物理 EOF，覆盖前文历史执行轨迹。B1 已完成并等待用户复核消费；本次恢复先以该状态作为 B2 的唯一进入依据。

```text
current_plan_version = v7.5-active
current_step = Step 7 regression / 7R-05
current_sub_batch = 7R-05-B1 completed_wait_user_review
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
next_allowed_action = wait_user_review_before_7r_05_b2
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## EOF Current Recovery Join: `S7-03C-B1-E` consumed, `7R-05-B1` current

本节修正本文旧物理 EOF 停在 D3-D 的恢复不一致。D3-D 后续 B1-E 已在 `03_ddd_step_07_cross_audit_b1_closure.md` 完成并经用户确认消费；capture/handoff owner 的设计静态部分因此可作为 `7R-05` 输入，但不单独关闭 `OUTCOME-001`。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
s7_03c_status = B1-E_static_cross_audit_completed_review_consumed
s7_03c_detailed_artifact = 03_ddd_step_07_cross_audit_b1_closure.md
current_sub_batch = 7R-05-B1 completed_wait_user_review
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
outcome_blocker = open_wait_7r_05_b2_b5
next_allowed_action = wait_user_review_before_7r_05_b2
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## EOF Current Recovery Override: `S7-03C-B1-D-3-D` completed, user review pending

本节位于本文物理 EOF，是当前 Step 7 handoff finalization 中间产物的唯一权威覆盖。D3-D 已完成 commit-unknown、rollback
unknown、no-rollback、six-phase inspection mapping和durable/fake parity静态闭合；D3-C 中与 fresh completion overlay冲突的
表述由本批 current correction取代。正式 `03-详细设计.md`、B1-E、Step 8和implementation保持冻结。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / S7-03C
current_task = S7-03C-B1-D-3 same-attempt inspection and post-call UoW/CAS
current_sub_batch = S7-03C-B1-D-3-D commit-unknown and no-rollback inspection completed_wait_user_review
completed_task = S7-03A,S7-03B
completed_internal_batches = S7-03C-B1-A,S7-03C-B1-B,S7-03C-B1-C,S7-03C-B1-D-1,S7-03C-B1-D-2,S7-03C-B1-D-3-A,S7-03C-B1-D-3-B,S7-03C-B1-D-3-C,S7-03C-B1-D-3-D
current_artifact = 03_ddd_step_07_capture_handoff_publisher_observability.md
next_internal_batch = S7-03C-B1-E cross-audit and B1 closure
next_allowed_action = wait_user_review_before_s7_03c_b1_e
task_status = 35_completed,0_in_progress,70_pending,1_blocked
batch_status = completed_wait_user_review
commit_unknown_modes = attempt|target_truth|opening_completion|retry_report|terminal_failure|rollback
same_call_duplicate_overlay = forbidden
new_l1_l2_blocker = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
outcome_blocker = open_wait_s7_03c_s7_05
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

D3-D 完成后停止等待用户复核；不得自动进入 B1-E、Step 8或implementation，不生成实现 commit、run_id、真实 evidence alias、
验收签署或测试结果。

## PHYSICAL EOF Current Recovery Override: `7R-05-B3-C3` completed, C4 gated

这是本文物理 EOF 的最终恢复覆盖。C3 的 legacy material/observability 负向审计已经完成设计静态收口，旧三个 port 的正向
surface 未恢复，publisher method seam 和 ordinary observability hook 仍未展开。正式 `03-详细设计.md`、Step 8 和 implementation
继续冻结；本覆盖不构成运行或 conformance 证据。

```text
current_plan_version = v7.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity completed_wait_user_review
current_internal_task = 7R-05-B3-C3 legacy material/observability negative audit completed_wait_user_review
completed_internal_tasks = 7R-05-B1|7R-05-B2|7R-05-B3-C1|7R-05-B3-C2|7R-05-B3-C3
pending_internal_tasks = 7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
gate_status = content_completed_wait_user_review
gate_reason = C3 static closure complete; explicit user review required before C4
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
outcome_blocker_status = open_wait_7r_05_b3_c4_b5
new_l1_l2_blocker = 0
new_public_callable = 0
new_public_status_or_stored_kind_or_repository_or_identity = 0/0/0/0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = wait_user_review_before_7r_05_b3_c4
```

## PHYSICAL EOF Current Closeout Override: `v7.8`

用户已授权一次性完成剩余设计收口。C4 publisher seam、C5 ordinary hook、B4 inherited-owner parity 与 B5 negative/failpoint audit 的权威正文位于 `03_ddd_step_07_infra_adapters_fake_parity.md` §§23~24；本文件只同步结果,不重复定义第二套 port。

```text
current_plan_version = v7.8-closeout
step_7_outcome_component = completed_design_static_only
completed_internal_tasks = 7R-05-B1|7R-05-B2|7R-05-B3-C1|7R-05-B3-C2|7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
current_callable_surface = CaptureCollectionPort::{collect_capture,inspect_capture}|HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}
historical_invalid_ports = ExecutionCapturePort|MaterialHandoffPort|ObservabilityMaterialPort
historical_invalid_outcome = MaterialHandoffAdapterOutcome|generic_adapter_outcome
publisher_contract = frozen_committed_relay_bundle|exact_attempt|one_external_call|max|unknown_inspect|no_source_rollback
ordinary_hook_contract = post_return_or_inspection|body_free|low_cardinality|failure_isolated
new_public_surface = 0
new_l1_l2_blocker = 0
outcome_blocker_status = resolved_for_step_7_design_static_closeout
formal_03_writeback = allowed_for_reassembly
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```
