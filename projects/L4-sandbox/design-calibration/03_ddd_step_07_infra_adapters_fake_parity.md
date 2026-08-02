# L4-sandbox 详细设计 Step 7 回归中间产物：Infra Adapter / Fake Parity

> 对应正式文档：`projects/L4-sandbox/03-详细设计.md`
>
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7
>
> 当前 owner：`7R-05 / S7-05`
>
> 当前状态：`7R-05-B1 completed_wait_user_review`
>
> 本文件是设计讨论中间产物，不是正式详细设计、实现代码、编译结果、测试结果、provider conformance、evidence 或验收签署。

## 1. 恢复点与批次范围

| field | current value |
|---|---|
| current document | `03-详细设计.md` |
| current step | Step 7 regression / `7R-05` |
| current blocker owner | `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` |
| upstream review consumed | `7R-04A-A4-P3` user review consumed for this owner batch |
| current artifact | `03_ddd_step_07_infra_adapters_fake_parity.md` |
| allowed scope | `infra` durable adapter、deterministic fake、runtime assembly parity、outcome mapper boundary、failpoint inventory |
| forbidden scope | formal `03` writeback、Step 8 protocol、Step 9 full flow、implementation repo、code、provider execution、test run、evidence |
| current stop | first batch writes source map and parity contract; later batches are still gated |
| implementation gate | `CB-SBX-01A blocked / wait_design` |

### 1.1 本 owner batch 的内部写入计划

| batch | scope | status | completion gate |
|---|---|---|---|
| `7R-05-B1` | recovery, SOP answers, scope, historical diagnosis and ownership | `[x]` | owner、allowed scope、forbidden scope and blocker relation are explicit |
| `7R-05-B2` | shared durable/fake execution semantics and common carrier rules | `[~]` | staging, commit, rollback, snapshot, version and identity budget are paired |
| `7R-05-B3` | capture / handoff / observability outcome parity by method | `[ ]` | each current method has request, candidate, error, unknown and no-rollback mapping |
| `7R-05-B4` | publisher / lifecycle / resolver / policy inherited parity audit | `[ ]` | existing traits are rechecked without creating duplicate owners |
| `7R-05-B5` | failpoint inventory, negative boundary, backfill draft, ledgers and review gate | `[ ]` | design-only closure is synchronized; no execution claim |

本次用户确认只授权启动 `7R-05`，不授权同时启动 `7R-04`、`7R-06`、Step 8 或正式正文回填。每个后续 batch 完成后继续停在独立用户复核门。

## 2. 本步输入与真相源顺序

| source | consumed authority | use in this batch |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | trait / port / adapter must have owner, caller, implementer, exact signature and stop audit | defines required output shape |
| `standards/document/设计文档讨论中间产物规范.md` | question answers -> diagnosis -> tradeoff -> structured artifact -> backfill -> review gate | defines this file's sections and write order |
| `standards/document/设计真相源闭环与可落码性标准.md` | exact callable surface, source map, lifecycle carrier, fake/durable equivalence and no private map | hard redlines |
| `projects/L4-sandbox/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | application port names, existing infra boundary and historical parity obligations | port inventory; not a reason to redefine signatures |
| `projects/L4-sandbox/design-calibration/03_ddd_step_07_lifecycle_ports.md` | current four lifecycle traits, finite result/error rules and release safety | inherited lifecycle parity audit |
| `projects/L4-sandbox/design-calibration/03_ddd_step_07_capture_handoff_publisher_observability.md` | current capture candidate, handoff candidate, same-attempt probe, commit-unknown and no-rollback rules | primary outcome parity source |
| `projects/L4-sandbox/design-calibration/03_ddd_step_07_cross_audit_b1_closure.md` | `OUTCOME-001` owner and B1 cross-audit disposition | blocker and downstream handoff |
| `projects/L4-sandbox/design-calibration/03_ddd_step_07_service_facades_inputs_outputs.md` | application owns domain mapping, stored result and facade side effects | prevents adapter/domain ownership leakage |
| `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | fake must preserve version, UoW, missing, conflict and outcome semantics | reference granularity |
| `projects/L1-artifact/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | durable/fake same callable surface and save/get symmetry | reference parity language |

权威顺序为：当前 Step 6 / Step 7 current overlay -> 本批已确认结论 -> 下游 revalidation。历史正文、旧 generic adapter 名称和 `/tmp` 旧快照只作为 `historical_material`，不能反向覆盖 current contract。

## 3. SOP 问题回答（B1）

### Q1. 哪些模块定义、实现和调用 adapter port？

| module | authority | allowed action | forbidden action |
|---|---|---|---|
| `application::ports` | 唯一 port trait owner | 定义 checked request、transient candidate、closed port error 和 adapter capability | 依赖 SDK、数据库、bus、object-store concrete type |
| `application` service | 唯一业务映射 owner | 读取 committed Sandbox truth，调用 port，验证 candidate，调用 domain factory 和 UoW | 解析 raw provider error、从 fake state 猜业务状态 |
| `infra` durable adapter | provider / durable implementation owner | 将 validated binding 映射为 current port request/result/error；维护 adapter-local technical state | 直接写 Sandbox truth、创建 domain status、改变 application trait |
| `infra` deterministic fake | contract test / local runtime implementation owner | 复现同一 request validation、finite result、missing/conflict/unknown 和 side-effect budget | 用私有 map、裸 bool、默认 success 或额外 fake-only result |
| `api` / `worker` / `jobs` | entry caller | 只调用 application facade / service | 直接访问 adapter、repository、UoW 或 provider |

### Q2. 本批必须闭口哪些 capability？

本批只闭合实现侧 parity，不重新发明主体 capability。当前必须逐项对齐的 existing application ports 为：

1. `CaptureCollectionPort::{collect_capture, inspect_capture}`。
2. `HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}`，其中 probe 的四分结果是 application-private transient carrier。
3. `MaterialHandoffPort` 与 `ObservabilityMaterialPort` 的既有 handoff outcome 映射。
4. `SandboxEventPublisherPort::publish` 及其 relay record version update 配对。
5. `BackendLifecycleInspectionPort`、establish / launch / release 四类 lifecycle port 的既有 finite result/error 语义。
6. resolver、policy、runtime availability adapter 的 fail-closed outcome 语义，仅作继承审计，不新增 port。

`SandboxTruthRepository`、`SandboxUnitOfWork`、idempotency 和 stored-result surface 只在本批作为 adapter side-effect / recovery 的约束来源；它们的 canonical owner 仍是既有 repository/UoW 中间产物，不在此文件创建第二个 owner。

### Q3. durable 与 fake 的“等价”具体指什么？

等价不是底层实现相同，也不是 provider 行为已被证明相同。等价至少包括：

- 相同的 application trait、方法名、参数来源和返回 carrier。
- 相同的 candidate / finite outcome variant 集合和 exhaustive mapping。
- 相同的 request lineage、generation、purpose、body-redline 和 correlation 校验。
- 相同的 stage-only 可见性、commit confirmed / `NotCommitted` / `StatusUnknown` 三分语义。
- 相同的 rollback 证明边界、snapshot generation、opaque version 和 identity allocation budget。
- 相同的 missing、wrong-kind、partial、conflict、unsupported、unknown 和 adapter-contract-error 分类。
- 相同的 no-rollback、duplicate replay zero-write 和 fail-closed default。

不要求：provider SDK、数据库引擎、网络协议、容器实现或真实外部系统在 durable 与 fake 中相同；这些属于 `infra` 内部或后续运行验证。

### Q4. 哪些结果属于 port error，哪些属于业务 candidate？

| category | meaning | application handling |
|---|---|---|
| finite candidate / observation | adapter 已形成受校验的 body-free external fact | 由 application 映射至既有 domain observation / truth factory |
| `ExternalSideEffectStatusUnknown` / equivalent | side effect 可能发生但 adapter 无法证明结果 | 保留原 recovery point，进入 exact same-correlation inspection；不得盲重试 |
| `AdapterUnavailableBeforeCall` | 明确证明外呼未开始且没有 external effect | 保留 pre-call recovery relation；不伪造 source-unavailable business fact |
| `AdapterContractViolation` | request/result/body/lineage 违反当前 port 契约 | fail-closed；不降级为 retryable/failed business outcome |
| `NotCommitted` / `StatusUnknown` | Sandbox UoW commit 状态，不是 provider outcome | 由 application whole-group inspection owner处理；不得由 adapter转换成 success |

### Q5. 当前批是否会新增 public status、stored kind 或 repository？

不会。`HandoffSameAttemptProbeResult` 仍是 application-private transient carrier；`FullyCommitted | FullyAbsent | Indeterminate` 仍是 application-local inspection result。当前批的静态差集目标为：

```text
new_public_status = 0
new_public_stored_kind = 0
new_repository = 0
new_identity = 0
new_generic_adapter_port = 0
new_same_call_duplicate_overlay = 0
```

## 4. 当前文档问题诊断（B1）

| ID | historical material / location | problem | current disposition |
|---|---|---|---|
| `IFP-D01` | 旧 `IsolationBackendPort` / generic `ApplicationResult<T>` | durable adapter 可把四类 lifecycle side effect 和普通调用错误混在同一 result | `historical_material`; 使用 `S7-03B` 四族 current port |
| `IFP-D02` | 旧 capture port 直接返回 `CaptureFact` / material rows | adapter 可跳过 `CaptureCompletenessGuard` 并成为 Sandbox truth owner | `invalidated`; 只返回 `CaptureCollectionCandidate` |
| `IFP-D03` | 旧 handoff outcome 只列 delivered / retryable / failed | same-attempt unknown 被迫猜成 retryable 或 failed | `invalidated`; probe 使用既有四分 private result，delivery candidate 仍三分 |
| `IFP-D04` | fake 只保存 aggregate/status | query/recovery 无法验证 member cardinality、version、partial visibility 和 no-rollback | `forbidden`; fake 必须复现 required member set 与 staged UoW |
| `IFP-D05` | fake 使用 local process、raw provider body 或 default success | 测试会绕过 L1 isolation、body redline 和 fail-closed | `forbidden`; fake 只生成 typed finite fixtures |
| `IFP-D06` | publish/handoff failure 与 source truth 共用回滚 | 外部失败会删除已确认 capture、handoff 或 relay truth | `invalidated`; source truth 与 external attempt 分层 no-rollback |
| `IFP-D07` | commit unknown 直接当失败或 absent | 可能重复外呼、重复 attempt 或第二 identity | `invalidated`; exact whole-group inspection and strict hold |
| `IFP-D08` | config / provider detail下沉到 domain/application | 实现者被迫把 SDK、URL、path、credential 或 raw error加入业务类型 | `forbidden`; provider binding只停在 infra adapter |
| `IFP-D09` | 旧正式 `03` 与当前 Step 7 overlay尚未统一回填 | 实现者无法判断旧 adapter 名称是否仍有效 | `historical_reviewed_revalidation_pending`; 本批只提供回填草稿 |

## 5. 设计取舍（B1）

| option | benefit | cost / risk | decision |
|---|---|---|---|
| A. durable 与 fake 共享 application port，逐方法定义 parity | application contract唯一；测试可复用同一校验和负向矩阵 | infra 中需要显式 adapter-local mapping | adopt |
| B. fake 只提供便捷 high-level success API | 初始 fixture少 | 隐藏 version、unknown、partial、redline 和 no-rollback缺口 | reject |
| C. 为每类 provider 新增 public outcome/status | 表面上便于暴露 provider差异 | 污染 domain/contracts，造成第二套状态机和 stored kind | reject |
| D. 把所有异常、审计、metric、retry counter展开为独立主流程 | 记录更细 | 延长设计周期且挤占主体闭环；普通 L2/L3 不需要同等粒度 | reject |

本批采用 A，并按用户已确认的复杂度原则处理 D：L1 安全、identity、side-effect unknown、commit/rollback visibility 和 no-rollback 逐方法闭合；普通诊断、审计 hook、provider telemetry、retry/backoff 和交付记录只记录 owner、safe fields、failure isolation 和后续文档归属，不扩展第二业务主流程。

## 6. 模块 / capability owner 结构化产物（B1）

| capability | current application port owner | durable implementer | fake implementer | Sandbox truth writer | current downstream |
|---|---|---|---|---|---|
| capture collection | `CaptureCollectionPort` | isolation/capture provider adapter | deterministic capture fake | application + domain capture factory | Step 9 capture flow; Step 16 parity cuts |
| target material delivery | `HandoffTargetDeliveryPort` | target-specific handoff adapter | deterministic delivery fake | application/domain handoff aggregate | Step 9 delivery/recovery flow |
| observability material handoff | `ObservabilityMaterialPort` | observability handoff adapter | bounded handoff fake | application material lifecycle owner | Step 15 hook/handoff |
| event publication | `SandboxEventPublisherPort` | bus/publisher adapter | deterministic publisher fake | relay repository/application | Step 9 relay flow |
| backend lifecycle observation | lifecycle port family from `S7-03B` | isolation backend adapter | lifecycle fake | application cleanup/reaper owner | Step 9/10 safety flow |
| context/reference resolution | resolver port family | source-specific adapter | controlled resolver fake | application/domain factory | intake/refresh flow |
| policy applicability | `PolicySummaryPort` | policy adapter | fail-closed policy fake | application policy service | policy/run flow |
| runtime availability | `SandboxRuntimeConfigPort` | validated config adapter | controlled availability fake | runtime builder/entry gate | Step 14 / startup gate |

### 6.1 统一 adapter invocation boundary

```text
application committed source / recovery point
        |
        v
checked request factory
        |
        +--> durable adapter  -- provider/DB/bus/object-store --> typed candidate or closed port error
        |
        +--> deterministic fake -------------------------------> same typed candidate or closed port error
        |
        v
application candidate validator
        |
        v
existing domain factory / UoW CAS / stored-result owner
```

关键说明：

- adapter 不接收 `SandboxUnitOfWork`、repository、domain aggregate mutable reference 或 caller status bool。
- adapter 返回值不直接成为 `CaptureFact`、`HandoffTargetProgress`、`SandboxEventRelayRecord` 或 cleanup state。
- fake 与 durable 共用 application-side checked request / candidate validator；若实现语言上无法共享具体函数，也必须共享同一字段和规则矩阵。
- provider body、SDK object、host path、network destination、credential、tool/runtime/member payload 在 adapter boundary 之外均不可见。

## 7. B1 停审与进入 B2 条件

| audit item | result |
|---|---|
| current owner and blocker | closed for B1; `OUTCOME-001` remains open until all later batches complete |
| port owner direction | application -> infra only |
| durable/fake scope | explicit; no code or runtime claim |
| public surface delta | zero intended |
| historical material handling | old generic ports marked historical, not current |
| primary vs non-primary scope | L1 parity exact; ordinary L2/L3 kept bounded |
| formal `03` modification | forbidden |
| implementation / test / provider execution | not started |

B1 只完成 owner、问题和边界诊断。进入 B2 前必须先在本文件补齐 common durable/fake semantics；不得直接把本批标为 `completed_wait_user_review`，也不得跳到 B3。

## 8. 待确认事项（B1）

1. `7R-05` 是否继续复用 `S7-03B` lifecycle finite outcome 和 `S7-03C` capture/handoff candidate，不新增 provider-specific public variant。
2. `HandoffSameAttemptProbeResult`、`FullyCommitted | FullyAbsent | Indeterminate` 是否继续保持 application-private，不进入 `contracts`、Step 8 DTO、stored kind 或 state matrix。
3. 普通 observability、audit、retry/backoff 和 delivery reporting 是否继续按 L2/L3 记录最小 owner/safe-field/failure-isolation，不展开为第二主流程。

在后续 batch 完成前，上述事项仅作为当前设计假设记录，不视为用户已额外确认的运行事实。

## 9. 正式 `03` 回填草稿（B1，冻结）

> 校准来源：`design-calibration/03_ddd_step_07_infra_adapters_fake_parity.md` §§1~8。

后续正式重装配时，`infra` 模块的 Trait / Port / Adapter 小节只从 B1 回填以下边界结论：

1. application 是 port trait、checked request、transient candidate 和 closed error 的唯一 owner；`infra` durable/fake 只实现这些 trait。
2. durable 与 fake 必须使用相同 callable surface、candidate/error 闭集、lineage/body 校验、unknown/no-rollback 和 fail-closed 语义。
3. adapter 不写 Sandbox truth、不创建 domain status、不向 application/domain/contracts 泄漏 SDK、raw body、path、URL、credential 或 provider error。
4. L1 safety parity 要逐方法闭合；普通 telemetry、audit、retry/backoff 和交付记录只保留 bounded owner/safe-field/failure-isolation。

B1 不允许回填 provider 产品、SDK 方法、配置 key、public DTO、测试结果、evidence、实现状态或 `OUTCOME-001` 已关闭的结论。

## 10. B1 完成门与真实性声明

| gate | result |
|---|---|
| SOP input and questions | source order and B1-relevant Step 7 questions answered |
| diagnosis and historical conflicts | `IFP-D01~D09` recorded with current disposition |
| tradeoff | shared application port with exact L1 parity adopted; fake shortcut rejected |
| structured artifact | module/capability owner matrix and invocation boundary completed |
| formal backfill draft | completed but frozen |
| new public status / stored kind / repository / identity | `0 / 0 / 0 / 0` |
| new L1/L2 upstream blocker | `0` |
| `OUTCOME-001` | remains open; B1 cannot close it |
| code / compile / test / provider / run / evidence / acceptance | not started / not created |
| formal `03-详细设计.md` | unchanged |
| commit required | no |

## EOF Current Recovery Override: `7R-05-B1` completed, user review pending

本节位于本文件物理 EOF，是 `7R-05` 当前恢复权威。B1 已完成 owner、范围、SOP 回答、历史诊断、取舍、结构化边界和正式回填草稿；B2~B5 尚未开始。这里的“完成”仅表示 B1 设计中间产物完成，不表示 durable/fake/provider conformance 或测试通过。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B1 source map, SOP answers and owner boundary completed_wait_user_review
completed_internal_batches = 7R-05-B1
pending_internal_batches = 7R-05-B2,7R-05-B3,7R-05-B4,7R-05-B5
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
batch_status = completed_wait_user_review
gate_status = content_completed_wait_user_review
next_internal_batch = 7R-05-B2 common durable/fake semantics
next_allowed_action = wait_user_review_before_7r_05_b2
s7_03c_component = completed_review_consumed
outcome_blocker = open_wait_7r_05_b2_b5
new_public_status = 0
new_stored_kind = 0
new_repository = 0
new_identity = 0
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 20. `7R-05-B3-C1` Capture method group: 逐方法 parity 中间产物

本节是 B3 的第一内部方法组，专门审查 `CaptureCollectionPort` 的两个 current method。它只把已经在
`03_ddd_step_07_capture_handoff_publisher_observability.md` 收口的 application contract 转译为 durable adapter
和 deterministic fake 的共同可观察要求；不创建新的 port、status、stored kind、repository 或 identity owner。

### 20.1 C1 输入、范围和复杂度判断

| item | current ruling |
|---|---|
| current application port | `application::ports::CaptureCollectionPort` |
| methods in this group | `collect_capture`; `inspect_capture` |
| request owner | application; `CaptureCollectionRequest` 是 checked、body-free、immutable invocation carrier |
| candidate owner | application; `CaptureCollectionCandidate` 只允许 `Collected`、`AdapterFailed`、`SourceUnavailable`、`ForbiddenBodyRejected` |
| port error owner | application; `CaptureCollectionPortError` 是 closed error，infra 不泄漏 raw cause |
| durable implementer | isolation/capture provider adapter；只做 provider binding 和 outcome mapping |
| fake implementer | deterministic capture fake；复现同一 request validator、candidate cardinality、unknown 和 redline |
| Sandbox truth writer | application service + existing domain factory/repository；adapter/fake 均为 `0` |
| method level | L1；capture 结果会影响 artifact/material truth、recovery 和 security redline |
| out of scope | handoff delivery、publisher、ordinary observability hook、tool semantic execution、runtime agent loop、member lifecycle |

C1 不把 `inspect_capture` 当作普通 Query。它是同一 external side effect 的 recovery probe，必须保留 exact
correlation、unknown 和 no-second-call 约束。C1 也不把 provider-side generation、operation key 或 fake sequence number
升级为 Sandbox `Version` 或业务 identity。

### 20.2 C1 专项 SOP 问题回答

| question | current answer |
|---|---|
| Q1. 两个方法是否共用一个 request validator？ | 是。`collect_capture` 和 `inspect_capture` 必须先执行同一 `CaptureCollectionRequest` 结构、lineage、profile、body-free 和 trace 规则；inspection 不能因为是 read-only 就放宽校验。 |
| Q2. `collect_capture` 的成功边界是什么？ | 只返回通过 correlation 和 candidate relation validator 的四类 candidate；不直接返回 `CaptureFact`、material row、observability material 或 provider response。 |
| Q3. `inspect_capture` 的成功边界是什么？ | 只有 exact same correlation 的既有 finite candidate 可以返回；“没有查到”不是 `SourceUnavailable`、`AdapterFailed` 或成功结果，无法证明时必须保留 `ExternalSideEffectStatusUnknown`。 |
| Q4. durable 与 fake 如何证明等价？ | 对相同 checked request、相同 injected provider observation 和相同 failpoint，返回相同 candidate/error 分类、相同 correlation rejection、相同 identity/UoW/no-rollback 计数；不要求底层 provider 或存储实现相同。 |
| Q5. unknown 后能否由 adapter 自动 retry？ | 不能。`collect_capture` unknown 只能交给 application 用同一 request 调 `inspect_capture`；inspection unknown 只能进入 recovery/hold，不能再次 collect。 |
| Q6. capture 是否在 adapter 内写入 Sandbox truth？ | 不能。capture fact、material、observability material、audit、relay 和 stored result 全由 application 既有 owner 组装和提交。 |
| Q7. ordinary telemetry 是否在 C1 展开？ | 不展开。C1 只要求低基数、body-free、失败隔离的 invocation diagnostics；普通 hook 的细节留给 B3-C5。 |

### 20.3 两个 method 的共同调用边界

```text
application committed run snapshot
  -> CaptureCollectionRequest::try_for_run
  -> no active write UoW
  -> durable adapter OR deterministic fake
  -> typed candidate OR CaptureCollectionPortError
  -> application candidate / error validator
  -> domain capture factory + existing UoW (application side only)
```

共同硬约束如下：

1. adapter method 不接收 repository、`SandboxUnitOfWork`、mutable aggregate、caller status bool 或任意 domain write
   callback。
2. request 中的 `capture_ref`、`run_ref`、`isolation_handle_ref`、`generation_ref` 和
   `idempotency_record_ref` 必须保持原值；adapter 不可替换、补全或重新生成其中任一值。
3. `generation_ref` 是 external correlation 的 checked reference，不是 core `Version`；core `Version` 仍只来自
   application committed `Versioned<T>` snapshot。
4. method 返回前必须把 provider body、path、URL、credential、SDK object、raw response 和 raw error 映射掉；这些值
   不得进入 candidate、port error、trace field 或 fake fixture 的 application-visible surface。
5. method 不能在调用期间持有 application write UoW。application 在 P2 external call 前释放 write UoW，P3/P4 另开
   fresh read/write scope。
6. method 的 provider correlation key 可以由 request 的既有字段稳定派生，但不得分配 Sandbox identity、attempt ref、
   material ref、failure ref、audit ref 或 stored-result ref。

### 20.4 `collect_capture` 逐方法 parity

| contract point | durable adapter | deterministic fake | shared observable rule |
|---|---|---|---|
| input | 接受完整 `CaptureCollectionRequest`，使用已验证 binding 调用 capture provider | 接受同一 request，不允许捷径构造 `Collected` | request validator、字段来源和拒绝优先级相同 |
| pre-call check | 验证 run/handle/generation/profile binding 可用于本次 capture | 使用同一 checked fixture 验证，不从 fake map 猜补字段 | invalid request 不产生 external call、Sandbox write 或业务 identity |
| provider correlation | 使用 request lineage 派生稳定 provider correlation | 使用同样字段派生 deterministic correlation；sequence 不是业务 identity | 同一 request 只对应一个 external correlation |
| finite success | 映射为 `Collected`，仅保留 summary、ordered candidate set 和 safe metadata | 注入同样的 `Collected` candidate，经同一 validator | candidate cardinality、order、empty marker 和 lineage 完全一致 |
| finite failure | provider 明确形成 safe `AdapterFailed` / `SourceUnavailable` / `ForbiddenBodyRejected` 时映射对应 candidate | 只能注入四个既有 variant，不得新增 fake-only status | business candidate 与 port error 的边界一致 |
| pre-call unavailable | 明确未外呼时返回 `AdapterUnavailable` 或既有 closed error | 同样返回 `AdapterUnavailable`；不得伪造 `SourceUnavailable` | adapter capability unavailable 不等于 source unavailable |
| external unknown | 返回 `ExternalSideEffectStatusUnknown`，不猜 candidate | 可确定性注入同一 error，不自动写成功 map | application 必须进入 same-request inspection |
| candidate mismatch | 返回 `CandidateCorrelationMismatch` / `CandidateRelationInvalid` | 注入 malformed candidate 后必须同样拒绝 | 不把 malformed candidate 降级为 `AdapterFailed` |
| forbidden body | raw body/path/credential crossing boundary 返回 `ForbiddenExternalBody`；已安全形成 marker 时才允许 `ForbiddenBodyRejected` | malformed fixture 也必须被拒绝或只形成无正文 marker | no forbidden field crosses application boundary |
| Sandbox write | `0`; 不保存 capture fact/material/observability | `0`; fake external ledger 不得冒充 Sandbox truth | truth owner remains application/domain |
| identity allocation | `0` new Sandbox identity | allocation counter must remain `0` | request refs are reused; no attempt/ref on provider call |
| UoW | no application write UoW across provider await | fake invocation also rejects active write-UoW binding | `active_write_uow_during_external_call = 0` |
| unknown recovery | same request passed to `inspect_capture`; no blind retry | same deterministic relation and no second collect | one collect correlation, then zero-or-more inspection reads only |
| post-call application failure | provider-side result is preserved for recovery; adapter does not erase it | fake preserves injected observation and attempt marker | later finalization failure cannot delete source run or known capture evidence |

`collect_capture` 的 candidate cardinality由既有 application validator 决定，不由 adapter 自行定义。逐 variant 要求为：

| candidate | required positive shape | forbidden shape |
|---|---|---|
| `Collected` | request refs exact match；`ExecutionOutputSummary` 存在；ordered candidate set完整；forbidden marker为空；adapter reason为空 | empty candidate set masquerading as complete、adapter reason、raw locator、provider id |
| `AdapterFailed` | request refs exact match；summary和candidate set为空；一个 safe reason | output summary、material locator、多个未分类 raw reasons |
| `SourceUnavailable` | request refs exact match；明确 source unreadable proof；summary和candidate set为空；一个 safe reason | only adapter timeout、capability unavailable、latest scan empty |
| `ForbiddenBodyRejected` | request refs exact match；candidate set和summary为空；marker非空且无 locator/body | secret/path/url、partial body、把未发现 body 当作 marker |

若 provider 只返回“调用失败”而不能证明 source unavailable，durable 和 fake 都必须返回 port error，不得擅自生成
`SourceUnavailable`。这条差异是 C1 的关键 fail-closed 边界。

### 20.5 `inspect_capture` 逐方法 parity

`inspect_capture` 只检查已经存在的 collection correlation。它不是 `collect_capture` 的重试别名，也不是对 Sandbox
repository、Query view 或 latest material 的查询。

| contract point | durable adapter | deterministic fake | shared observable rule |
|---|---|---|---|
| input | 接受原始 request 的 exact correlation；允许只替换 trace context | 接受同一 request key；trace 替换不改变 lookup key | `for_recovery_trace` 只能改诊断字段 |
| lookup | 以 run/capture/handle/generation/profile lineage 的稳定 correlation 查既有 provider observation | 以相同 key 查 deterministic observation ledger | 不允许 latest/scan/partial key fallback |
| matching result | 只有 full matching finite candidate 才返回 | 返回与 durable 相同 candidate variant和字段闭集 | matching candidate 必须再次过 request/candidate validator |
| no observation | 不把 absence 映射为 business candidate；若无法证明状态，返回 `ExternalSideEffectStatusUnknown` | 同样返回 unknown；不能以 fake map absence 证明未发生 | absence != `SourceUnavailable`，absence != `FullyAbsent` public result |
| provider inspection unavailable | 返回 `AdapterUnavailable` 或同一 closed error | 注入同类 unavailable | application 保持 recovery hold，不重新 collect |
| relation mismatch | 返回 `CandidateCorrelationMismatch` / `CandidateRelationInvalid` | 同样拒绝错误 key或错误 lineage | inspection 不能接受“最接近”的 observation |
| body/redline | 发现 provider body、path、URL、credential 或 raw response 时返回 `ForbiddenExternalBody` | malformed observation 同样被拒绝 | probe 也必须 body-free |
| external side effect | `0`; inspection 不调用 capture endpoint、不改变 provider state | `0`; inspection 不推进 fake sequence或生成新 observation | `inspect_call_does_not_recollect = true` |
| Sandbox write | `0` | `0` | inspection 不写 capture、material、audit、stored result或recovery row |
| identity allocation | `0` | `0` | 不创建 second capture/attempt/material/failure identity |
| unknown handling | 不能证明时返回 unknown，并把 exact correlation交 application recovery owner | 同样保留 unknown | no automatic retry, no success mapping |

`inspect_capture` 的“成功”只意味着 adapter 找到了同一 correlation 的 finite observation，不意味着 capture fact 已提交、
material 已落库或 application finalization 已完成。application 仍必须按既有 P3/P4 算法 fresh-read 并完成 whole-group
commit/inspection。

### 20.6 C1 failure / unknown mapping matrix

| scenario | `collect_capture` mapping | `inspect_capture` mapping | application action | forbidden action |
|---|---|---|---|---|
| request lineage invalid | `RequestLineageMismatch` | same error | fail closed; zero external call | repairing request from provider/latest truth |
| profile binding invalid | `CaptureProfileBindingInvalid` | same error | stop before candidate mapping | treating profile missing as source unavailable |
| capability unavailable before call | `AdapterUnavailable` | `AdapterUnavailable` | preserve pre-call recovery relation / bounded retry by application policy | generating business failure candidate |
| source explicitly unreadable | `SourceUnavailable` candidate | only return same candidate if exact prior observation exists | application records capture disposition | deriving source unavailable from adapter timeout |
| provider safe adapter failure | `AdapterFailed` candidate | same candidate only if exact prior observation exists | application records capture attempt failure | retrying inside adapter |
| body rejected safely | `ForbiddenBodyRejected` candidate | same exact marker candidate if recorded | application records security marker and preserves redline | storing body/path or retrying with weaker profile |
| external call status unknown | `ExternalSideEffectStatusUnknown` | same error if probe cannot prove result | call exact inspection once per recovery decision; otherwise hold | blind collect retry, new identity |
| matching finite observation | candidate | same candidate | application validates and finalizes | adapter writing domain truth |
| mismatched observation | correlation/relation error | correlation/relation error | quarantine/contract violation | choosing newest or closest observation |
| inspection read gap | not applicable to initial call | `ExternalSideEffectStatusUnknown` or unavailable closed error | strict recovery hold | mapping gap to absent or failed |

### 20.7 Identity, visibility and no-rollback audit

| audit item | `collect_capture` | `inspect_capture` | C1 result |
|---|---:|---:|---|
| new `CaptureFactRef` | 0 | 0 | only pre-bound `capture_ref` is accepted |
| new material / observability ref | 0 | 0 | application allocates existing refs before/after the external boundary as specified |
| new attempt / failure / audit / stored-result ref | 0 | 0 | adapter has no Sandbox identity allocator |
| Sandbox repository write | 0 | 0 | application remains sole truth writer |
| active write UoW across await | 0 | 0 | P2 call is outside write UoW |
| second collection call after unknown | 0 | 0 | same-correlation inspect only |
| rollback of committed source run | forbidden | forbidden | source truth and capture preservation are no-rollback |
| rollback of known external capture effect | forbidden | forbidden | preserve effect/recovery relation; do not erase evidence |
| fake-only success shortcut | forbidden | forbidden | fake must expose same finite/error/unknown boundary |

The adapter-local observation ledger, if needed by a concrete implementation or fake, is not a Sandbox repository and cannot be
read through an application Query. Its only permitted role is to answer the same request correlation during `inspect_capture`; it
must not become a second source of `CaptureFact`, material completeness or public status.

### 20.8 C1 static parity audit and backfill draft

| audit | expected | design result |
|---|---:|---|
| current methods covered | 2/2 | `collect_capture`, `inspect_capture` |
| shared request validator | 2/2 | same checked request and body-free rules |
| candidate variants introduced | 0 | existing four variants only |
| port errors introduced | 0 | existing closed error family only |
| durable/fake direct truth writes | 0/0 | forbidden |
| identity allocation in either method | 0/0 | forbidden |
| external retry from adapter | 0/0 | forbidden |
| inspection recollection | 0/0 | forbidden |
| unknown -> success/absence mapping | 0/0 | forbidden |
| raw body/path/credential crossing boundary | 0/0 | forbidden |
| implementation/test/provider/evidence claims | 0 | not claimed |

正式 `03` 后续只回填以下 C1 结论：

1. `CaptureCollectionPort` 的 durable adapter 和 fake 共用 `CaptureCollectionRequest`、四类
   `CaptureCollectionCandidate` 和 closed `CaptureCollectionPortError`；adapter 不拥有 capture truth。
2. `collect_capture` 是唯一 initial external collection method；`inspect_capture` 只读同一 correlation，不能重新收集。
3. source unavailable 必须有明确 source-level proof；adapter unavailable、inspection gap 和 external unknown 不得被
   映射为业务 candidate 或 success。
4. 两个 method 都必须保持 zero Sandbox write、zero new identity、body-free、no active write UoW 和 no-rollback。
5. fake 的 deterministic fixture 只能注入现有 candidate/error/failpoint；不得用默认成功、latest scan 或私有 truth map
   绕过 application validator。

### 20.9 C1 完成门与真实状态声明

| gate | result |
|---|---|
| C1 SOP questions | complete; method-specific questions and answers recorded |
| `collect_capture` parity | complete as design contract; request/candidate/error/unknown/no-rollback mapped |
| `inspect_capture` parity | complete as design contract; same-correlation/no-recollect/strict-unknown mapped |
| durable/fake negative audit | complete as static design target; no runtime conformance claim |
| new public callable/status/stored kind/repository/identity | `0 / 0 / 0 / 0 / 0` intended |
| new L1/L2 upstream blocker | `0` |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | remains open until B3-C2~C5 and B5 closure |
| formal `03-详细设计.md` | unchanged; writeback forbidden |
| code / compile / provider conformance / test / run / evidence / acceptance | not started / not created |
| commit required | no |

C1 只关闭 capture 方法组的设计中间产物，不关闭整个 B3。下一合法内部动作是 B3-C2 handoff 方法组；B4、Step 8、正式
`03` 和 implementation 仍被冻结，除非后续方法组和 B5 closure 完成并经用户复核。

## 11. `7R-05-B2` 激活、输入复核与内部任务

用户本次“同意”消费 `7R-05-B1` 内容复核门，只授权执行 `7R-05-B2`。B1 的三项待确认口径按既有 current
authority 继续成立：复用既有 finite outcome/candidate；两个 inspection result family 保持 application-private；普通
observability/audit/retry reporting 保持 L2/L3 最小设计。本批不把用户确认解释为 provider conformance、测试通过或实现授权。

### 11.1 本批直接输入

| input | B2 消费内容 | B2 不得覆盖 |
|---|---|---|
| `03_ddd_step_07_repositories_uow_indexes.md` §§7~13 | `SandboxUnitOfWork`、三分 commit、rollback、core `Version`、CAS、snapshot、identity allocator | repository/UoW trait、54 个 exact allocator method及 21 个 same-UoW group owner |
| `03_ddd_step_07_idempotency_stored_index_repositories.md` | fresh reservation、duplicate zero-write、typed stored replay、whole-group inspection | idempotency/status/stored kind/schema |
| `03_ddd_step_07_lifecycle_ports.md` §6 | reservation/preparation/external/finalization split、stable correlation、unknown inspection | lifecycle request/result/error signatures |
| `03_ddd_step_07_capture_handoff_publisher_observability.md` | attempt-before-call、post-call fresh CAS、same-result re-entry、no-rollback | capture/handoff/publisher per-method outcome；留给 B3 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` | application owns validation、domain mapping、stored finalization和 public surface | facade callable、domain transition、entry mapping |

### 11.2 内部任务状态

| task | status | scope | completion evidence |
|---|---|---|---|
| `7R-05-B2-1` | `[x]` | 输入、SOP 问题、owner/carrier taxonomy | §§11~12；重复 owner 与新增 public carrier 均为 0 |
| `7R-05-B2-2` | `[x]` | staging、snapshot、core `Version`、identity budget | §§13~15；五阶段模型和逐阶段预算完整 |
| `7R-05-B2-3` | `[x]` | commit、rollback、unknown、no-rollback matrix | §§16~16.4；三分 commit、rollback unknown、external unknown 和 no-rollback 均有 owner 与安全动作 |
| `7R-05-B2-4` | `[x]` | durable/fake parity、负向审计、回填草稿和恢复同步 | §§17~19；静态差集为设计目标，恢复源同步后停在用户复核门 |

### 11.3 B2 专项 SOP 问题回答

| question | current answer |
|---|---|
| common semantics 由谁定义 | application 已有 port/request/candidate/error 和 repository/UoW contract 定义 observable semantics；infra 只实现。 |
| durable 与 fake 是否共享 concrete base class | 不要求。共享的是 application trait、字段规则、阶段可见性和结果闭集，不新增 `GenericAdapter` 或公共执行器。 |
| staged success 是否可作为成功返回 | 不可。只有 `SandboxCommitReceipt` confirmed 且 relation 校验通过后，application 才可返回 fresh surface。 |
| provider generation 是否可充当 core `Version` | 不可。provider generation 只能作为 checked request/candidate 的 typed source relation；`Version` 只来自 committed repository snapshot。 |
| adapter 是否可分配 Sandbox identity | external adapter 不可。UoW/identity adapter 只能实现既有 exact port；business identity 的调用时点和用途由 application owner 决定。 |
| fake 是否可省略 unknown/rollback failure | 不可。fake 必须可表达与 durable 相同的 `NotCommitted`、`StatusUnknown`、rollback `Failed/StatusUnknown`，且不得默认成功。 |

## 12. Common carrier taxonomy 与 owner redline

本批不创建 `AdapterExecutionResult<T>`、`FakeOutcome<T>`、generic snapshot 或 generic recovery repository。共同 carrier
只复用已经存在的分层类型：

| carrier family | owner | durable/fake obligation | forbidden interpretation |
|---|---|---|---|
| port-specific checked request | `application::ports` | 通过相同 getter 读取 exact refs、generation、purpose、correlation和 safe trace | provider config、SDK request或 mutable aggregate |
| port-specific finite candidate/result | application Step 7 owner | 返回相同 variant/field shape并执行同一 relation validator | committed Sandbox truth或 public success proof |
| port-specific closed error | application Step 7 owner | exhaustive mapping；reason body-free且 caller-safe | raw driver/provider cause或自由字符串分类 |
| `Versioned<T>` + core `Version` | repository/UoW application port | exact committed snapshot读取；CAS只消费同一读取所得 token | time、cursor、provider generation或可加减整数 |
| `SandboxCommitReceipt` | UoW application port | 仅 durable status confirmed 时构造并逐项回显 transaction/cursor | stage receipt、provider receipt或业务 recovery key |
| `SandboxCommitError` | UoW application port | 保持 `NotCommitted | StatusUnknown` 二分且不降级 | provider finite outcome或普通 retry hint |
| `SandboxRollbackError` | UoW application port | 保持 `Failed | StatusUnknown`；两者都不证明 absent | successful rollback或可忽略 warning |
| stored result / typed surface | idempotency/stored owner | commit confirmed 后 exact replay；fake 不从 current truth 重建 | adapter-local cache、candidate或 per-target result |
| `FullyCommitted | FullyAbsent | Indeterminate` family | application-private inspection owner | 只由 exact committed snapshot和完整 relation predicate形成 | public DTO、stored kind或 adapter return variant |

### 12.1 Adapter-local 类型的允许边界

durable adapter 可以有 SDK request、DB transaction state、provider correlation和 raw error；deterministic fake 可以有
fixture selector、transaction-local staged overlay、committed test state和 deterministic sequence。它们都必须满足：

1. adapter-local 类型不能出现在 application trait signature、domain object、contracts DTO、stored surface 或 event payload。
2. adapter-local mapper 必须一次性、穷尽地生成 application-owned candidate/error；无法映射时 fail closed。
3. fake committed state 必须按既有 typed repository/port surface 可观察，不能以一个 aggregate/status 私图代替 required member set。
4. durable/fake 都不得借 adapter-local cache 绕过 fresh `Version`、same-snapshot read、CAS 或 exact-correlation inspection。
5. raw body、path、URL、socket、credential、token、argv、environment、stdout/stderr和 SDK object不得进入安全 reason、candidate或诊断 hook。

## 13. 共同五阶段执行模型

五阶段是既有 application flow 的实现约束，不是新增 public orchestrator。具体 method 是否需要全部阶段仍由其 current owner
决定；有 external side effect 的 L1 method 必须满足完整 split，纯外部观察 method 可以省略 preparation side-effect record，
但同样不得在 write UoW 内 await external adapter。

```text
P0 exact duplicate / reservation preflight
  -> completed duplicate: exact stored replay; stop with zero business work
  -> fresh: reservation-only UoW commit confirmed

P1 preparation (side-effecting methods only)
  -> load exact owners + same-snapshot Version
  -> freeze named identities and exact correlation
  -> stage persisted attempt / recovery point / required relation
  -> preparation commit confirmed; drop all transaction handles

P2 external invocation or exact inspection
  -> reconstruct checked request from committed recovery point
  -> call one durable or fake port method with no active write UoW
  -> validate candidate/error against frozen correlation

P3 local finalization
  -> begin fresh UoW
  -> reload complete owner group + fresh Version
  -> apply existing domain factory/owner method
  -> stage complete truth/audit/relay/marker/stored group
  -> commit confirmed before returning fresh surface

P4 recovery inspection
  -> read-only committed snapshot
  -> inspect exact frozen identities and mandatory relation set
  -> FullyCommitted | FullyAbsent | Indeterminate (application-private)
```

### 13.1 阶段可见性与调用预算

| phase | visible input | staged/committed effect | external call budget | write-UoW rule |
|---|---|---|---:|---|
| P0 duplicate | committed idempotency + stored relation only | none | 0 | duplicate不得开启 business write UoW |
| P0 fresh reservation | validated operation/key/digest + exact reservation identity | reservation only；commit confirmed 才进入 P1 | 0 | 与 business group 分离 |
| P1 preparation | exact owners、fresh `Version`、flow-declared named identities | attempt/recovery relation whole group | 0 | 失败整组终结；不得外呼 |
| P2 call | committed recovery point重建的 immutable checked request | adapter不写 Sandbox truth | initial 或 inspect 恰好一个 owner-authorized call | active write UoW 必须为 0 |
| P3 finalization | frozen candidate + fresh owner snapshot | complete finalization group | 0 | old pre-call `Version`不可复用 |
| P4 inspection | exact frozen relation keys | zero write、zero repair | 仅 port owner明确要求的 exact external inspection；local inspection为 0 | read-only committed snapshot |

## 14. Staging 与 snapshot 共同语义

### 14.1 Transaction-local staging

| rule | durable adapter | deterministic fake |
|---|---|---|
| stage location | durable transaction内，shared committed readers不可见 | transaction-local overlay；shared committed map/readers不可见 |
| repeated save | 按 existing repository method和expected `Version`检查 | 相同 owner/key/method检查；不得自动 merge或 last-write-wins |
| group completeness | commit前验证既有 same-UoW mandatory member set | 使用同一 mandatory member manifest；缺成员不能自动补默认 row |
| cursor | write set完整后每类至多分配一次；commit前不证明可见 | truth/reference sequence分离；只在transaction overlay中暂存 |
| stage failure | handle仍可 rollback；不返回 candidate作为 success | 丢弃内存 candidate只在rollback confirmed后证明本组不可见 |

fake 可以使用 map 实现存储，但必须区分 committed store 与 transaction-local overlay，并以 exact typed key、kind、lineage和
mandatory relation执行校验。被禁止的是绕过 repository contract 的“业务真相私图”，不是底层数据结构本身。

### 14.2 Snapshot 分类

| snapshot | authority | consistency requirement | forbidden use |
|---|---|---|---|
| write transaction snapshot | UoW/repository | 同一 UoW 内每个 `Versioned<T>`来自同一 committed base；stage不反向污染 reads | 跨 UoW拼接 Version、读取 latest winner后套用旧candidate |
| read-only committed snapshot | exact reader / inspection owner | mandatory relation、binding、stored surface和absence proof在一个稳定可见性边界读取 | repair、allocation、external side effect或将 unavailable当 absent |
| checked request freeze | application port owner | exact refs/generation/purpose/correlation除 safe trace外不可变化 | 当作 persisted truth、DB snapshot或刷新 capability 的许可 |
| provider source generation | corresponding external source owner | 只与 request/candidate lineage比较 | 转换为 core `Version`、cursor或 Sandbox identity |

### 14.3 Core `Version` 的 opaque 规则

1. durable implementation 只可从 committed repository read 构造 `Versioned<T>`；底层 row version/etag/revision 的映射留在 infra。
2. fake 为每个 mutable owner维护可重复的 committed generation，并实现 first-winner/second-conflict；对 application 仍只暴露 core `Version`。
3. application 只能保存、比较并把 exact read 的 `Version`传回 matching repository method；不得做加减、排序、猜零值或跨 owner交换。
4. CAS conflict 使旧 snapshot、guard、permit、candidate和 completion 全部失效；只能完整重读，不能把旧结果套到 latest row。
5. immutable source version、provider generation、truth/reference cursor、page token和 transaction ref均不能替代 core `Version`。

## 15. Identity allocation budget

identity budget 由既有 flow-specific owner清单决定，B2 不改变 54 个 exact allocator method，也不创建 generic allocator。

| path/phase | allowed Sandbox identity allocation | mandatory zero set |
|---|---|---|
| duplicate preflight/replay | 0 | truth、attempt、audit、relay、stored/surface、cursor均 0 |
| fresh reservation | 仅 existing idempotency owner明确要求的 exact reservation/ref；不得预分 business result group | run/capture/handoff/failure/control等业务 identity为 0 |
| P1 preparation | 只分配 current flow列出的 named correlation/safety identities；pairwise non-collision并在外呼前冻结 | generic `ResourceRef`、provider-selected identity、备用 identity为 0 |
| P2 external call/inspect | 0 | durable/fake adapter均不得调用 Sandbox identity allocator |
| P3 finalization | 不替换任何 correlation/safety identity；仅 existing owner明确允许的未发布 local materialization candidate可在 definite local retry重建 | unknown/CAS-loser路径的第二attempt、第二target或第二failure identity为 0 |
| commit/rollback status unknown | 0 | 新 stored/surface/audit/relay/attempt identity和新 cursor均 0 |
| P4 whole-group inspection | 0 | write、clock、cursor、external side effect和 repair allocation均 0 |
| Query / ordinary diagnostic hook | 0 | business identity、truth/reference cursor和 stored relation均 0 |

`SandboxTransactionRef`由每次 UoW begin产生，只用于线性 handle/诊断关联，不属于业务 recovery key。truth/reference cursor
由既有 UoW method在完整 write set stage 后每类最多分配一次，也不属于可由 external adapter生成的 business identity。

## 16. Commit、rollback、unknown 与 no-rollback 共同契约

本节只组合既有 `SandboxUnitOfWorkManager`、repository CAS、stored replay 和 external attempt 规则，不创建新的 transaction
status、public outcome、repository 或 recovery identity。durable adapter 与 fake 必须对 application 呈现相同的可观察边界；底层
存储如何实现不属于本节的公共契约。

### 16.1 UoW 终结矩阵

| termination | adapter 能证明的事实 | application action | fresh surface | identity / external rule |
|---|---|---|---|---|
| `Confirmed(receipt)` | transaction 的 staged group、cursor 和 relation 已提交且可读 | 校验 receipt 与冻结 UoW relation；再构造 fresh result 或进入下一已授权阶段 | 允许，仅在 mandatory group 完整时 | 不补造 identity；receipt 中的 transaction/cursor 原样消费 |
| `NotCommitted(VersionConflict)` | 整组未生效，竞争者拥有 current Version | 丢弃旧 decision/candidate，按 owner 重新完整读；同一栈帧不得套用旧结果 | 不返回 fresh success | 不重复 external call；新调用须重新走 reservation/preflight |
| `NotCommitted(StoreUnavailable)` | commit 前已证明没有 staged write 可见 | 返回既有 unavailable/typed persistence error | 不返回 stored ref | 不用 local fallback、默认 success 或新 identity 掩盖不可用 |
| `NotCommitted(IntegrityRejected)` | staged group 被完整性约束拒绝且未生效 | 进入既有 invariant/integrity error owner | 不返回 partial surface | 不删除或修补其他已提交 source truth |
| `StatusUnknown` | 无法证明 commit 或 absence | 冻结原 transaction、operation、identity 和 relation，进入 exact whole-group inspection | 不返回 fresh success/absence | 禁止盲重试、第二 attempt、第二 stored/surface identity |
| rollback confirmed | 当前尚未提交的 staged group 已明确不可见 | 返回原始 typed error；关闭 transaction handle | 不返回 staged result | staged cursor 不可引用；不影响此前已提交 source truth |
| rollback `Failed` | rollback 命令失败，visibility 未知 | 转 consistency/integrity hold；保留原 transaction relation | 不返回 success 或 absent | 不继续外呼、不重建 group、不静默清 fake map |
| rollback `StatusUnknown` | rollback 完成性未知，visibility 未知 | 与 commit unknown 相同进入 exact inspection | 不返回 success 或 absent | 原 identity/correlation 冻结；不产生第二 group |

`SandboxCommitReceipt` 只能由 confirmed 分支构造。`NotCommitted` 不等于 rollback confirmed；commit handle 已被消费后，
application 不得再调用 rollback 或假设 staged group 可见性。`StatusUnknown` 也不等于失败，必须以 whole-group inspection
判定 `FullyCommitted`、`FullyAbsent` 或 `Indeterminate`。

### 16.2 Whole-group inspection 算法

```text
freeze operation + idempotency key + request digest
freeze transaction ref and every pre-generated named identity
close write handles; open one committed read snapshot
read exact reservation / idempotency relation
read every mandatory owner, attempt, audit, relay, stored and cursor relation
validate kind, lineage, generation, Version, cardinality and completeness
  complete valid group       -> FullyCommitted(original frozen surface)
  every mandatory relation absent -> FullyAbsent
  partial / corrupt / unavailable / mixed generation -> Indeterminate
```

| inspection result | allowed continuation | prohibited continuation |
|---|---|---|
| `FullyCommitted` | replay原 stored surface或原 attempt observation；如上层允许，返回原 frozen outcome overlay | rebuild result、重新申请 identity、重复 external call、修复缺失 sidecar |
| `FullyAbsent` | 关闭本次调用；由显式 recovery invocation按原 owner 规则决定是否重新开始 | 当前栈帧静默重跑、复用不匹配 candidate、报告原调用 success |
| `Indeterminate` | fail-closed、quarantine/hold、交给既有 reconciliation/cleanup owner | 猜 commit、删 partial row、补写 index、把 unknown 降为 absent/failed |

inspection 本身必须是 zero-write、zero-identity、zero-cursor、zero-repair。缺少一个 mandatory relation 时，不能用 current
truth、latest row、provider response或计数摘要补齐 whole-group proof。`FullyCommitted | FullyAbsent | Indeterminate` 只在
application 内部使用；adapter 可以返回既有 port-specific observation/error，但不得把该三分结果加入 public port。

### 16.3 External side effect unknown 与 no-rollback

| boundary | side effect / local truth关系 | unknown或failure处理 | 不得做的事 |
|---|---|---|---|
| preparation commit | recovery point尚未确认持久化 | `NotCommitted` 结束本次；`StatusUnknown` 先 inspect reservation/recovery group | 在没有 committed recovery point 时外呼 |
| external port call | provider side effect可能已开始 | 只调用同一 correlation 的 inspect method；保留原 attempt | blind retry、换 backend、换 handle、换 generation |
| external result finite | candidate尚未成为 Sandbox truth | P3 fresh read + exact correlation validator + domain owner transition | adapter直接写 truth或返回 domain status |
| P3 finalization commit | external attempt 已有独立 persisted relation | confirmed 才返回 fresh surface；unknown 进入 whole-group inspection | 把 local commit unknown 映为 external absent；重复外呼 |
| source/capture truth | call前已确认的 source truth | external failure、publisher failure或handoff retry不回滚已确认 source truth | 用 external failure 删除 capture/source/requirement |
| handoff/delivery attempt | attempt 是恢复和 no-duplicate 边界 | same-attempt inspection / bounded recovery；保留 attempt identity | 新建第二 attempt 或把 unknown 改成 retryable success |
| publisher/relay | source event/relay payload snapshot 与 delivery status 分层 | publish failure只影响 relay attempt/report；source truth保持可读 | 回滚 source fact、重建 event payload、改变 original cursor |
| release/cleanup | release basis、guard、lease 和 handle 是安全真相 | unknown 保持 strict hold，只有同 basis inspection 可形成 definitive observation | 报告 Released、生成新 basis、换 target blind release |
| partial capture/material | 已捕获 material 的 preservation 与完整性独立于 handoff | partial/unknown 保留 evidence/recovery obligation，进入既有 capture owner | 丢弃 partial material、重跑 collection 以覆盖原 attempt |

因此“no-rollback”不是所有本地失败都不回滚。它的边界是：外部 side effect 或已提交 source truth 不能由后续 adapter/publisher/
handoff 失败删除；同一 P3 UoW 内尚未提交的 local group 仍必须整体 rollback 或进入 unknown hold。该区别必须在 durable 与 fake
中同时可观察。

### 16.4 CAS conflict 与 candidate 生命周期

1. P2 candidate 只绑定 frozen request/recovery point；它不携带可替换的 owner `Version`。
2. P3 重新读取完整 owner group，每个 mutable owner 使用该次 snapshot 返回的具名 `Version`。不得把 P1 的 Version 传入 save。
3. 任一 owner CAS conflict 使本次 candidate、decision、permit 和 completion 失效；不能只 reload 冲突 row 后继续保存其他旧对象。
4. 已确认 external attempt 不因 P3 CAS loser 被删除；application 先按 exact attempt/operation relation 检查是否已完成，再决定 hold 或显式 recovery。
5. fake 必须能注入 first-winner/second-conflict、partial group和 post-call CAS loser，并呈现与 durable 相同的 external call budget。

## 17. Durable / deterministic fake parity 与 failpoint 设计

本节是实现契约和静态审计，不是运行测试。`durable` 表示未来真实存储/外部 adapter 的实现类别，`fake` 表示 deterministic
contract implementation；当前没有 provider conformance、compile、test、run 或 evidence 事实。

### 17.1 Common observable contract

| parity dimension | durable adapter | deterministic fake | required equal observation |
|---|---|---|---|
| callable surface | 实现既有 application port method | 实现同一 trait 和 method set | method/name/typed input/output/error 闭集一致 |
| request validation | 从 committed application binding 构造并校验 | 从同一 checked request 构造并校验 | lineage、purpose、generation、body redline、correlation 一致 |
| candidate mapping | provider result先过 adapter mapper，再返回 typed candidate | fixture result先过同一字段/variant规则 | candidate variant、optional pair和reason shape一致 |
| error mapping | raw cause只在 infra 内部，映射 closed port error | 注入 typed failure，不暴露 raw fixture detail | unavailable、contract violation、unknown、unsupported和integrity分类一致 |
| staging visibility | durable transaction未 commit时 shared reader 不可见 | transaction-local overlay未 commit时 shared reader 不可见 | pre-commit zero visibility |
| commit terminal | confirmed、NotCommitted、StatusUnknown可区分 | 三分都可 deterministic 注入 | 不把 unknown 转为 confirmed/absent |
| rollback terminal | confirmed、Failed、StatusUnknown可区分 | 三分均可注入 | Failed/unknown都进入 hold，不静默清除 |
| Version/CAS | committed snapshot的 core `Version`，single winner | per-owner deterministic generation，single winner | stale write、winner/loser和旧 candidate失效语义一致 |
| identity budget | 只调用既有 exact allocator boundary | 记录并拒绝越界 allocator call | duplicate/inspect/P2 均 zero allocation |
| cursor | complete staged write 后分配，confirmed 后可见 | truth/reference overlay 分离，confirmed 后可见 | cursor visibility、一次性和 rollback/unknown语义一致 |
| external await | write UoW关闭后调用 provider | fake port也拒绝 active write UoW | active write UoW call count = 0 |
| duplicate replay | 读取 exact stored carrier/surface | 读取同一 typed fake surface | zero business read/write/allocation/external call；不从 current truth重建 |
| unknown inspection | exact correlation + whole-group committed snapshot | 同一 key/relation predicate | `FullyCommitted/FullyAbsent/Indeterminate` mapping一致 |
| no-rollback | source truth与external attempt分层 | fake也保留 source truth/attempt，不用 failure清除 | source preservation、attempt identity和strict hold一致 |
| body/redline | provider body/credential/path停在infra | body marker注入同样被拒绝 | no forbidden field crosses boundary |
| ordinary hook | hook failure不改变L1 truth | fake hook failure同样隔离 | L2 diagnostic failure isolation一致 |

### 17.2 Failpoint inventory

以下是未来实现和 contract test 的 failpoint 目录，不是已执行测试。每个 failpoint 由既有 owner 注入，fake 必须能表达，durable
实现必须在同一 application-visible 分类下收敛：

| failpoint | owner | expected classification | required safe action |
|---|---|---|---|
| UoW begin unavailable | UoW manager | `PortUnavailable` / existing begin error | zero write、zero identity、显式新调用才可重走 |
| invalid transaction binding | UoW adapter | invariant/contract error | fail closed，不调用 repository或external port |
| exact identity unavailable | typed allocator | `PortUnavailable` | 不用 string/generic fallback，不进入 P2 |
| identity collision | typed allocator / group validator | integrity/invariant error | 冻结 flow，不换 identity 掩盖错误 |
| cursor allocation before complete stage | UoW usage | usage error | 不分配 cursor，不返回 source linkage |
| stage shape / mandatory relation missing | repository/UoW | integrity error | rollback；若 rollback unknown 进入 hold |
| CAS first-winner / second-conflict | repository | `VersionConflict` | loser不写 audit/relay/stored residue，不调用 external |
| commit confirmed | UoW manager | `Confirmed` | 只消费 exact receipt；允许下一阶段 |
| commit definite not committed | UoW manager | `NotCommitted` | 丢弃 staged success；不盲重试 |
| commit status unknown | UoW manager | `StatusUnknown` | freeze original group，P4 inspection |
| rollback confirmed | UoW manager | original typed error | staged group不可见；不影响 committed source |
| rollback failed | UoW manager | consistency hold | 不宣称 absent，不继续 side effect |
| rollback status unknown | UoW manager | consistency hold | exact inspection；不清理 partial map |
| external unavailable before call | concrete adapter | `AdapterUnavailableBeforeCall` | 保留 recovery point；按 owner policy重新校验 |
| external side effect unknown | concrete adapter | `ExternalSideEffectStatusUnknown` | same-correlation inspect；禁止 blind retry |
| candidate correlation mismatch | candidate validator | `AdapterContractViolation` | 不应用 candidate，不改变 owner truth |
| forbidden body/path/credential | redline validator | forbidden-body error | quarantine/fail closed；不落 Sandbox/domain |
| post-call owner CAS conflict | application repository | version conflict / recovery hold | exact attempt inspect；不套用 latest |
| mandatory audit/relay append failure | existing append owner | atomic group error or pending relay | source truth按 no-rollback 保留；不伪造 completion |
| ordinary hook failure | observability hook owner | bounded diagnostic failure | 不回滚主体 truth，不改变 public result |

### 17.3 Negative boundary audit

| forbidden path | design target |
|---|---:|
| new public status / stored kind / repository / identity | `0 / 0 / 0 / 0` |
| new generic adapter trait or generic result carrier | `0 / 0` |
| durable/fake direct Sandbox truth write | `0` |
| adapter receives repository, UoW or mutable aggregate | `0` |
| active write UoW held across external await | `0` |
| raw provider body, URL, path, credential or SDK object crossing boundary | `0` |
| fake default-success path that skips validation | `0` |
| fake committed-map shortcut that bypasses typed relation | `0` |
| blind external retry after unknown | `0` |
| second attempt/handle/failure identity after unknown or CAS loser | `0` |
| rollback of already committed source truth due external failure | `0` |
| Query write/identity/cursor allocation | `0/13` |
| duplicate business write/new identity/external call | `0 / 0 / 0` |
| `FullyCommitted/FullyAbsent/Indeterminate` leaked to public protocol | `0` |

这些是设计差集目标和 future test input，不是“差集测试已通过”的声明。若后续真实实现无法维持任一行，必须回到
application port/UoW owner修正，而不是在 fake 中放宽断言。

## 18. 正式 `03` 回填草稿（B2，冻结）

后续正式文档重装配时，`infra` 与 `application` 接缝只回填以下 B2 结论：

1. durable 与 fake 共用既有 application port、checked request、candidate/error 闭集和同一 relation validator；不创建 generic adapter port。
2. external side-effect method 按 reservation、preparation、external call、fresh finalization、unknown inspection 分离；write UoW 不跨 external await。
3. stage 不等于 commit；`Confirmed`、`NotCommitted`、`StatusUnknown` 和 rollback `Failed/StatusUnknown` 必须保持可区分。
4. core `Version` 只来自 committed `Versioned<T>`，provider generation、cursor、transaction ref和 page token不得替代；CAS loser必须完整重读。
5. durable/fake 都必须保持 duplicate zero-write、identity budget、body redline、fail-closed、same-correlation inspection 和 no-rollback。
6. 已确认 source truth、capture preservation、attempt和relay payload不会因 external/publisher/handoff failure回滚；未提交的同一 P3 local group仍整体终结。

B2 回填草稿不包含 provider 产品、SDK 方法、配置 key、存储引擎、测试结果、evidence、run_id、验收签署或实现 commit。

## 19. B2 完成门与真实性声明

| gate | result |
|---|---|
| B2-1 input / SOP / owner review | complete; existing owner reused and no new carrier owner |
| B2-2 staging / snapshot / Version / identity budget | complete; five-phase model and zero sets explicit |
| B2-3 commit / rollback / unknown / no-rollback | complete; finite terminal and recovery actions explicit |
| B2-4 parity / failpoint / negative audit | complete as design contract; no execution claim |
| public status / stored kind / repository / identity delta | `0 / 0 / 0 / 0` intended |
| generic adapter / direct adapter truth write / active-UoW external call | `0 / 0 / 0` intended |
| new L1/L2 upstream blocker | `0` |
| `OUTCOME-001` | remains open until B3, B4 and B5; B2 only supplies common semantics |
| formal `03-详细设计.md` | unchanged; writeback forbidden |
| code / compile / provider conformance / test / run / evidence / acceptance | not started / not created |
| commit required | no |

B2 完成后不自动进入 B3。下一合法动作是用户复核本批共同语义；确认后只启动 `7R-05-B3`，逐方法审查
capture/handoff/observability outcome parity。

## EOF Current Recovery Override: `7R-05-B2` completed, user review pending

本节位于本文物理 EOF，是 B2 的当前恢复权威。前面的 B1 EOF 段和旧历史 overlay 保留作审计轨迹；若状态冲突，以本节为准。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B2 common durable/fake semantics completed_wait_user_review
current_internal_task = B2 user review gate before 7R-05-B3
completed_internal_batches = 7R-05-B1,7R-05-B2
pending_internal_batches = 7R-05-B3,7R-05-B4,7R-05-B5
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
batch_status = completed_wait_user_review
gate_status = content_completed_wait_user_review
next_internal_batch = 7R-05-B3 capture/handoff/observability per-method parity
next_allowed_action = wait_user_review_before_7r_05_b3
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
outcome_blocker_status = open_wait_7r_05_b3_b5
new_public_status = 0
new_stored_kind = 0
new_repository = 0
new_identity = 0
new_generic_adapter_port = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Recovery Override: `7R-05-B3-C1` completed, `C2` in progress

本节位于本文真实物理 EOF，是 B3 方法组的当前权威覆盖。`7R-05-B3-C1` 已完成两个 capture method 的设计静态 parity；
用户本次“继续”后只启动 C2 handoff method group。旧 B1/B2 状态和旧计划表保留为审计轨迹，不再覆盖本节。

| internal task | status | scope | completion / next gate |
|---|---|---|---|
| `7R-05-B3-C1` | `[x]` | `CaptureCollectionPort::{collect_capture,inspect_capture}` | request、candidate/error、same-correlation unknown、redline、identity budget、no-rollback and durable/fake parity recorded |
| `7R-05-B3-C2` | `[~]` | `HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}` | next: exact delivery/probe parity and no-second-attempt audit |
| `7R-05-B3-C3` | `[ ]` | legacy material/observability negative audit | pending C2 |
| `7R-05-B3-C4` | `[ ]` | publisher method seam | pending C3 |
| `7R-05-B3-C5` | `[ ]` | ordinary observability hook minimum contract | pending C4 |

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C2 handoff method group
current_module = handoff delivery and same-attempt inspection
completed_internal_tasks = 7R-05-B3-C1
pending_internal_tasks = 7R-05-B3-C2|7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md §§20.1~20.9
capture_method_group = completed_design_static_only
handoff_method_group = not_started
gate_status = in_progress
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
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
next_allowed_action = write_7r_05_b3_handoff_method_group
```

## 21. `7R-05-B3-C2` Handoff method group: 逐方法 parity 中间产物

本节审查 `HandoffTargetDeliveryPort` 的两个 current method：`deliver` 与 `inspect_same_attempt`。它只把现行
application contract 转译为 durable adapter / deterministic fake 的共同实现门禁，不创建第二个 handoff port、attempt
repository、receipt owner、public status 或 stored kind。

### 21.1 C2 范围、等级与历史冲突裁决

| item | current ruling |
|---|---|
| current application surface | `application::ports::HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}` |
| checked request | `HandoffTargetDeliveryRequest`，由已提交 `Attempting` progress 和同一 committed source snapshot 构造 |
| `deliver` return | application-owned transient `HandoffDeliveryOutcomeCandidate`: `Delivered`, `Retryable`, `Failed` |
| `inspect_same_attempt` return | application-private transient `HandoffSameAttemptProbeResult`: `Delivered`, `NotDelivered`, `Unknown`, `Unsupported` |
| port error | existing closed `HandoffTargetDeliveryPortError`; raw provider/SDK detail remains infra-private |
| durable owner | `infra` target delivery adapter；可写 provider-owned side effect，但不写 Sandbox truth |
| fake owner | deterministic delivery fake；只复现 checked correlation、finite result、unknown和call budget |
| Sandbox truth owner | application finalizer + `HandoffFact` / selected material existing repositories |
| method level | L1；attempt identity、external side effect unknown、handoff truth和material no-rollback均受影响 |
| out of scope | legacy material port restoration、publisher、ordinary observability hook、tools semantic execution、runtime agent loop、member lifecycle |

历史冲突必须显式保留而不能默默覆盖：

| historical position | conflict | current disposition |
|---|---|---|
| early B1-D-1 / B1-D-2 prose | 两个 method 都返回三分 `HandoffDeliveryOutcomeCandidate` | `historical_material`; 仅 `deliver` 保留三分 candidate |
| D3-A current correction | `inspect_same_attempt` 改为四分 private probe | `current`; `HandoffSameAttemptProbeResult` 不进入 domain/contracts/stored surface |
| old `MaterialHandoffPort` | adapter 接收完整 `HandoffFact` / material rows并返回 infra outcome | `invalidated`; 不恢复为第二 application callable surface |
| provider operation id / fake sequence | 可能被当作 attempt、receipt或Sandbox Version | `forbidden substitute`; 只能作为 adapter-local correlation，且不能越过 port |

C2 以现行 D3-A/D3-B current correction为准：`NotDelivered` 不是 `Retryable`，`Unknown` 不是 `NotDelivered`，
`Unsupported` 不是 capability-unavailable business failure；后三者都不能由 adapter/fake直接改变 Sandbox progress。

### 21.2 C2 专项 SOP 问题回答

| question | current answer |
|---|---|
| Q1. `deliver` 何时可以被调用？ | application 必须先完成 exact target selection、分配并提交唯一 `HandoffDeliveryAttemptRef`、以 handoff core `Version` CAS提交 `Attempting`，再从 committed row重建 request并释放 write UoW；未确认 commit不得外呼。 |
| Q2. `deliver` 是否允许 adapter retry？ | 不允许。每个 request/attempt只允许一次 initial delivery call；timeout、response loss或side-effect unknown只能交同一 attempt 的 inspection。 |
| Q3. `inspect_same_attempt` 是否是第二次 delivery？ | 不是。它是只读 external probe，只能查询同一 `(handoff_ref,target_ref,attempt_ref)`，不得发送、补写、删除或修复 provider事实。 |
| Q4. 为什么 inspection 不能复用三分 candidate？ | 三分 candidate无法表达明确外部未发生、无法判定和能力不支持；压缩会改变重入资格并造成重复 side effect。因此 probe 使用 application-private四分结果。 |
| Q5. 哪些结果可进入 domain observation？ | `deliver` 的三个 finite candidate和 probe 的 `Delivered` 可以在 application fresh-read后进入同一 finalization kernel；`NotDelivered`、`Unknown`、`Unsupported` 均不直接构造 observation。 |
| Q6. durable/fake 等价的观察面是什么？ | 相同 checked request validator、correlation/body redline、candidate/probe闭集、call count、unknown/no-retry、identity budget和Sandbox no-write；底层 provider/存储实现不要求相同。 |
| Q7. post-call CAS loser能否重新调用 adapter？ | 不能。CAS loser只允许以同一 frozen result做 bounded local-only reapply；attempt identity和external call budget保持不变。 |
| Q8. ordinary delivery telemetry是否在本批展开？ | 不展开。C2只要求低基数、body-free、失败隔离；普通 hook归C5，不能反向拥有 attempt或delivery truth。 |

### 21.3 两个 method 的共同 invocation boundary

```text
application exact committed Attempting snapshot
  -> HandoffTargetDeliveryRequest::from_committed_attempt
  -> verify no active write UoW
  -> durable adapter OR deterministic fake
       deliver(request) once
       OR inspect_same_attempt(request) once
  -> candidate / private probe / closed port error
  -> application correlation and body-free validation
  -> fresh application read/write finalizer only when ingress is allowed
```

共同硬约束：

1. adapter/fake 只接收 checked request 和 validated adapter binding；不得接收 `SandboxUnitOfWork`、repository、mutable
   `HandoffFact`、progress引用、domain callback或caller status bool。
2. `handoff_ref`、`target_kind`、`target_ref`、`material_selection`、carrier set、`attempt_ref`、`attempt_started_at`和
   `generation_ref`必须来自同一 committed snapshot；adapter不能补字段、替换字段或从 latest row修复。
3. request 不携带 core `Version`、`SandboxIdempotencyRecordRef`、stored surface、audit ref、receipt owner或provider
   response；这些由 application frame / existing owner管理。
4. request 和 candidate/probe 都必须 body-free。provider body、URL、host path、credential、SDK object、raw response、
   provider timestamp、HTTP code和自由文本reason不得越过 boundary。
5. `deliver` 与 `inspect_same_attempt` 的 external await 均在 application write UoW之外；inspection不得以“只读”名义
   持有可写事务或执行 Sandbox read-repair。
6. 两个 method 都不得调用 Sandbox identity allocator。`attempt_ref`已在 method前提交；receipt只由 application typed
   factory创建或验证，probe不会创建第二 receipt identity。
7. provider-local idempotency key / observation ledger若存在，只能由 request exact correlation派生；不能替代或回写 Sandbox
   attempt、Version、handoff、material、audit或stored identity。

### 21.4 `deliver` 逐方法 parity

`deliver` 是唯一 initial external delivery method。它接收一个已经提交的 `Attempting` attempt，并且只返回三类
application candidate或闭合 port error；它不直接返回 `HandoffTargetDeliveryObservation`、progress、aggregate status或
stored result。

| contract point | durable adapter | deterministic fake | shared observable rule |
|---|---|---|---|
| request ingress | 验证完整 `HandoffTargetDeliveryRequest` 与已验证 target binding后调用 provider | 先执行同一 checked request validator；fixture不能直接注入 domain aggregate | wrong lineage/material shape在外呼前拒绝 |
| attempt gate | 只接受已在Sandbox commit confirmed后形成的 `Attempting` request | 记录 request的 pre-call commit gate；未确认时拒绝 | `attempt_commit_confirmed_before_deliver = true` |
| target correlation | 使用 exact handoff/target/attempt/generation/material selection correlation | 使用相同字段组成 deterministic key | 不从target ref、route或fixture label反推字段 |
| finite delivered | 仅映射合法、body-free、target-bound receipt为 `Delivered { receipt_ref }` | 只能注入同形状 receipt candidate并经同一validator | receipt不成为Sandbox truth，后续由application factory绑定 |
| finite retryable | 仅映射 typed safe reason + non-zero relative retry age | 注入同样的 typed reason/age；不接受bool/raw text | `Retryable`不创建新attempt、不立即重试 |
| finite failed | 仅映射 typed terminal safe reason | 注入同样的 finite failed candidate | `Failed`不回滚source truth或其它target |
| unavailable before call | provider binding明确证明本次调用未开始时返回 `AdapterUnavailableBeforeCall` | 只有显式 pre-call failpoint可返回同类 error | unavailable不等于业务 `Failed`或`Retryable` |
| external effect unknown | timeout/lost response/process interruption等无法证明结果时返回 `ExternalSideEffectCommitUnknown`或既有 unknown error | 可确定性注入同一 error；不自动写成功 observation | application只允许 same-attempt inspection |
| outcome shape invalid | receipt/reason/age/correlation不合法时返回 `AdapterOutcomeShapeInvalid` / correlation error | malformed fixture必须走同一 error | 不把 malformed candidate降级为 `Failed` |
| unclassifiable provider result | 无法安全映射三分candidate时返回 `AdapterOutcomeUnclassifiable` | 不用默认分支或错误字符串猜variant | fail closed，保留原attempt |
| forbidden body | 发现body/path/credential/SDK response crossing boundary时返回 `ForbiddenExternalBody` | body marker fixture同样拒绝 | 不截断、清洗或把body写入reason/receipt |
| external call count | matching request每个 attempt最多一次 `deliver`；adapter不隐式retry | 记录 exact request和调用次数；超限即contract failure | `deliver_call_count_per_attempt <= 1` |
| Sandbox side effect | `0`;不写handoff/progress/material/audit/stored result | `0`; fake provider ledger不是Sandbox truth | application是唯一Sandbox truth writer |
| identity allocation | `0`;复用已提交 attempt | `0`;拒绝fake-only attempt生成 | no second attempt/receipt/handoff identity |
| UoW | 不接收、不持有application write UoW | active write-UoW fixture必须被拒绝 | external await与write UoW完全分离 |
| post-call failure | provider-side effect/recovery correlation保留；adapter不撤销它 | 注入结果和call marker保留供inspection | finalization failure不得触发第二`deliver` |

`deliver` candidate的闭集关系必须逐项满足：

| candidate | required shape | forbidden shape |
|---|---|---|
| `Delivered { receipt_ref }` | receipt可由 loaded target kind/ref通过 `HandoffReceiptRef::try_from_adapter` 验证；无body、无provider raw identity | receipt直接冒充Artifact/evidence/runtime truth；携带第二attempt或handoff ref |
| `Retryable { reason, retry_not_before_age_millis }` | reason为caller-safe typed value；age非零且不溢出；无receipt | `Retryable(bool)`、zero age、HTTP/status解析、立即生成新attempt |
| `Failed { reason }` | reason为caller-safe typed terminal reason；无receipt和retry age | timeout/unknown压成failed、raw provider error、删除source truth |

以下情况不属于 candidate，必须保持 port error：adapter unavailable、external side-effect unknown、malformed relation、
forbidden body和unclassifiable provider response。尤其不能把 provider capability unavailable 或“没有返回行”自动变成
`Failed`/`Retryable`。

### 21.5 `inspect_same_attempt` 逐方法 parity

`inspect_same_attempt` 是同一 external attempt 的只读 probe。它不能被实现为 `deliver` 的隐式第二次调用，也不能把
provider-side absence 直接翻译成 Sandbox target status。其返回面以较新的 D3-A current correction 为准，旧的三分返回签名
只保留为 historical material。

| probe branch | durable adapter requirement | deterministic fake requirement | shared observable rule |
|---|---|---|---|
| `Delivered { receipt_ref }` | 只在 provider 以同一 handoff/target/attempt correlation明确证明交付，并给出 body-free receipt时返回 | 只能注入显式 matching receipt；receipt必须通过相同 target-bound validator | 仅此分支可进入后续 local finalize；probe自身不写 Sandbox truth |
| `NotDelivered` | 只有 provider 明确证明该 attempt没有产生外部交付副作用时返回 | 只能注入 explicit absence proof；fixture map缺行不算 proof | 保留原 `Attempting`；不构造 `Retryable`/`Failed` observation |
| `Unknown` | provider无法证明 delivered或not delivered时返回 typed indeterminate result或对应 closed error | 可确定性注入 unknown；不能用异常默认映射 | 保留原 attempt，进入 strict hold/bounded recovery；不新建 identity |
| `Unsupported` | adapter没有该 target/attempt 的可验证 inspection capability时返回 | capability fixture必须显式标记 unsupported | capability gap不等于外部未交付，不映射为 `NotDelivered` |
| relation mismatch | provider observation的 correlation、generation或material fence不匹配时返回 closed correlation/invariant error | malformed key/lineage fixture必须同样拒绝 | 不选择“最近”或 latest observation |
| unclassifiable response | provider response无法安全落入四分 probe时返回 `AdapterOutcomeUnclassifiable` | 不使用 wildcard/default candidate | 不把 unclassifiable 降级为 unknown、failed或retryable |
| probe call unavailable | 明确证明本次 inspection method尚未开始时返回 `AdapterUnavailableBeforeCall` | 仅显式 pre-call failpoint可注入 | 只说明 probe没开始，不说明原始 delivery没发生 |
| forbidden body | 任意 provider body、path、URL、credential、SDK object或raw response越界即拒绝 | 同形状 body fixture必须拒绝 | probe result和error均保持 body-free |

probe 的四分 carrier 必须保持 application-private：

```text
HandoffSameAttemptProbeResult =
    Delivered { typed-candidate-receipt }
  | NotDelivered
  | Unknown
  | Unsupported
```

它不得携带 `handoff_ref`、`target_ref`、`target_kind`、`attempt_ref`、`generation_ref`、material carrier、trace、provider
operation id、provider timestamp或自由文本。所有 correlation 与 equality fence 均从调用前已提交的
`HandoffTargetDeliveryRequest` 和 application fresh snapshot 得到。`Delivered` 的 receipt只是一项 transient candidate，
最终是否成为 Sandbox progress/receipt truth由 application 的既有 factory 和 CAS finalizer决定。

#### 21.5.1 Probe 调用前后边界

每次 probe invocation 的 observable sequence 固定为：

```text
fresh-read committed HandoffFact + selected Attempting progress
  -> reconstruct exact checked HandoffTargetDeliveryRequest
  -> close/release any write UoW
  -> inspect_same_attempt(request) exactly once
  -> validate four-way result and receipt/correlation fences
  -> return transient probe frame
```

以下调用前状态禁止进入 probe：`Pending`、retry age 未到的 `Retryable`、已 `Delivered`、已 `Failed`、cleanup-blocked 且
没有 active `Attempting`、missing/corrupt relation、未确认的 attempt reservation，以及任何不再匹配原 request 的 target。
禁止通过 Query view、latest scan、provider operation id、fake private map或 caller status恢复一个新的 probe request。

| probe side effect / allocation | durable | fake | C2 requirement |
|---|---:|---:|---|
| second `deliver` call | 0 | 0 | inspection不能重发 |
| Sandbox repository write | 0 | 0 | probe只读external observation |
| Sandbox identity allocation | 0 | 0 | 不创建attempt/receipt/failure/audit/stored identity |
| provider record repair/delete | 0 | 0 | adapter不得补偿外部事实 |
| progress/material/aggregate mutation | 0 | 0 | 由后续 application finalizer决定 |
| active write UoW across external await | 0 | 0 | read-only不改变事务红线 |
| implicit probe retry within one method call | 0 | 0 | bounded re-inspection只能由上层显式调度 |

`inspect_same_attempt` 每次方法调用只能产生一项 probe observation。若 application recovery policy允许后续再次 probe，
每次都必须重新验证同一 committed attempt，并且仍不得调用 `deliver`、替换 attempt或使用新的 material selection；adapter
自身不能实现无界循环或隐藏重试。

#### 21.5.2 Probe branch 到 application action 的 parity

| probe result | durable/fake return condition | immediate application action | forbidden action |
|---|---|---|---|
| `Delivered(receipt)` | exact attempt、target kind/ref、generation和receipt relation全部通过 | 保留同一 attempt，交统一 positive finalizer；fresh-read后才可构造 observation | 直接认为 Sandbox 已提交、重复 deliver、创建第二 receipt |
| `NotDelivered` | explicit external absence proof | 保留 `Attempting`，交后续 formal abort-proof/policy owner | 直接映射 Retryable/Failed、立刻重发 |
| `Unknown` | effect state indeterminate | strict hold，冻结原 attempt和recovery frame | 映射 NotDelivered、Retryable、Failed或成功 |
| `Unsupported` | inspection capability unavailable | bounded/manual capability route，保留原 attempt | 映射 NotDelivered或AdapterUnavailableBeforeCall(original delivery) |
| probe port error | request/relation/body/unknown boundary error | typed integrity/recovery route，按原 correlation继续 | 以 candidate代替error或修复request |

`NotDelivered` 的 explicit absence proof是 external recovery 输入，不是 Sandbox domain state。只有后续 owner取得 formal
abort proof并经过独立 policy，才可能决定是否开始新的 attempt；该动作不属于 adapter/fake method，也不允许复用原
`attempt_ref` 盲发。`Unknown` 与 `Unsupported` 永远不能作为 absence proof。

### 21.6 C2 的统一 positive finalization 与 no-rollback parity

durable/fake只负责返回 method-level candidate/probe；positive result之后的 Sandbox mutation仍由 application 的既有
post-call finalizer负责。C2 必须验证两类实现返回值能进入同一后续契约，而不是在 adapter里复制 finalizer。

#### 21.6.1 Positive ingress 的统一规则

| ingress | can enter finalizer | finalizer input | adapter/fake responsibility ends at |
|---|---:|---|---|
| `deliver -> Delivered` | yes | body-free receipt candidate + exact frozen request | candidate shape/correlation validation |
| `deliver -> Retryable` | yes | typed reason + non-zero age + exact frozen request | finite candidate mapping |
| `deliver -> Failed` | yes | typed terminal reason + exact frozen request | finite candidate mapping |
| `inspect_same_attempt -> Delivered` | yes | body-free receipt candidate + exact same-attempt correlation | four-way probe validation |
| `inspect_same_attempt -> NotDelivered` | no | absence fact only | read-only probe return |
| `inspect_same_attempt -> Unknown` | no | indeterminate recovery marker | read-only probe return |
| `inspect_same_attempt -> Unsupported` | no | capability-gap marker | read-only probe return |

进入 finalizer后，direct candidate和probe `Delivered`必须使用同一 application sequence：trusted clock frame、fresh full
handoff/progress/material read、existing receipt/observation factories、`HandoffFact::apply_target_observation`、selected
material helper、same-group UoW、fresh core/material `Version` CAS。adapter/fake不得直接调用或模拟其中任一 Sandbox write。

#### 21.6.2 CAS loser、commit unknown 与 external call budget

| post-call condition | durable/fake method behavior | application recovery | forbidden |
|---|---|---|---|
| finalizer commit confirmed | no additional adapter call | return committed local disposition; stored completion remains existing owner | treating stage as committed before confirmation |
| finalizer `NotCommitted(VersionConflict)` | no adapter re-entry | fresh-read full group and bounded local-only reapply with same frozen result/attempt | call `deliver` or `inspect_same_attempt` again |
| finalizer `NotCommitted` unavailable/integrity | no adapter re-entry | return existing persistence/integrity route; preserve attempt | fabricate success or new attempt |
| finalizer `StatusUnknown` | adapter result and request remain frozen | D3-D whole-group inspection; zero new identity/call until proof | blind retry, second attempt, map to absent |
| rollback confirmed before local commit | no adapter re-entry | staged local delta discarded; previously committed source/attempt remains | remove committed source truth |
| rollback failed/unknown | no adapter re-entry | strict consistency hold; inspect exact group | clear fake map or claim absent |
| selected material CAS conflict | no adapter re-entry | local-only full-group re-read/reapply under bounded policy | save only aggregate or overwrite winner |

The only allowed local reapply frame is:

```text
same handoff_ref + target_ref + attempt_ref
same frozen candidate or probe Delivered receipt
same trusted observed_at / changed_at relation
external adapter call budget after first call = 0
new delivery-attempt allocation = 0
new handoff/material/stored identity = 0
```

An uncommitted audit trace candidate may be rebuilt by the existing application owner on a known local CAS loser, subject to the
existing bounded allocator rule. That exception never authorizes a new attempt, receipt, handoff, external call or stored surface.
When commit visibility is `StatusUnknown`, even that audit candidate remains frozen until whole-group inspection.

#### 21.6.3 No-rollback facts that both implementations must preserve

| already confirmed or possibly effected fact | later delivery/finalization failure | must remain | forbidden rollback |
|---|---|---|---|
| source `CaptureFact`, terminal run, or source `ObservabilityMaterial` | target delivery failure/unknown | source lineage, material identity and source status | delete/rebuild capture or change run terminal state |
| committed handoff opening and earlier target progress | later target failure or CAS loss | handoff root, earlier target result, attempt and receipt/reason | reset earlier target or replace aggregate with last result |
| external delivery effect is confirmed or unknown | Sandbox finalization failure | exact attempt correlation and recovery obligation | blind redelivery, new attempt, erase provider fact |
| selected material transition already committed for another target | current target failure | prior material status/audit linkage | roll back another target's material lifecycle |
| cleanup/redline containment | any delivery result | safety block and strict hold | use Delivered/Retryable to clear containment |

No-rollback does not mean an uncommitted local UoW may be exposed. A staged handoff/material/audit group still rolls back as one group
when rollback is confirmed; rollback failure or unknown enters hold. The distinction must be observable in both durable and fake
implementations.

### 21.7 C2 durable/fake parity matrix

| parity dimension | durable adapter | deterministic fake | required equal observation |
|---|---|---|---|
| request validation | checked request and provider binding validation before external call | same validator before fixture lookup | identical reject set and no-call budget |
| `deliver` candidate mapping | explicit three-branch mapping | explicit three-branch injected fixture | `Delivered/Retryable/Failed` shape and reason rules identical |
| `inspect_same_attempt` mapping | explicit four-branch provider inspection mapping | explicit four-branch fixture mapping | `Delivered/NotDelivered/Unknown/Unsupported` identical |
| unknown boundary | effect unknown remains closed unknown error/probe | injected unknown remains same | no unknown-to-failure/retry/success conversion |
| unsupported boundary | capability gap returns `Unsupported` probe | capability fixture returns `Unsupported` | no unsupported-to-absence conversion |
| correlation | exact handoff/target/attempt/generation/material fences | exact key/fence comparison | no latest/nearest/private-map repair |
| body redline | provider body/raw SDK/path/credential stopped in infra | malformed body fixture stopped identically | no body crosses application boundary |
| call count | one initial `deliver`; inspection never calls delivery | exact counters and no hidden retry | same external call budget |
| Sandbox write | zero from both methods | zero from fake adapter ledger | application-only truth ownership |
| identity budget | zero during both methods | zero and over-allocation rejection | no second attempt/receipt/handoff/failure identity |
| UoW boundary | no active application write UoW across await | same active-UoW rejection | external-await split identical |
| CAS loser | adapter not re-entered | counter remains unchanged | local-only recovery semantics identical |
| no-rollback | provider/source/earlier target facts preserved | fake preserves same committed facts | later failure cannot erase known truth |

### 21.8 C2 static difference audit and backfill draft

| audit item | expected | C2 design result |
|---|---:|---|
| current methods covered | 2/2 | `deliver`, `inspect_same_attempt` |
| historical three-way inspection signature restored | 0 | rejected; later four-way private probe is current |
| new public probe/status/outcome | 0 | `HandoffSameAttemptProbeResult` remains application-private |
| durable/fake direct Sandbox truth write | 0/0 | forbidden |
| inspection invoking delivery | 0/0 | forbidden |
| adapter-internal retry after unknown | 0/0 | forbidden |
| second attempt/receipt/handoff identity in either method | 0/0 | forbidden |
| `NotDelivered` direct domain observation | 0 | forbidden; formal abort proof deferred to existing owner |
| `Unknown`/`Unsupported` success or absence mapping | 0 | forbidden; strict hold |
| post-call CAS loser external calls | 0 | closed; local-only reapply only |
| source/earlier target/no-rollback violation | 0 | forbidden |
| new repository/stored kind/public callable | 0/0/0 | no additions |
| implementation/compile/provider/test/run/evidence/acceptance claim | 0 | not claimed |

正式 `03` 后续只回填以下 C2 结论：

1. `deliver` 只接收 committed `Attempting` request并返回既有三分 candidate；adapter/fake不拥有 handoff truth。
2. `inspect_same_attempt` 使用 application-private 四分 probe；只查同一 attempt，不能再次 delivery、写 Sandbox或分配 identity。
3. `NotDelivered` 需要 explicit external absence proof；`Unknown` 和 `Unsupported` 保留原 `Attempting`，不得映射为
   `Retryable`、`Failed`、success或新的 attempt。
4. direct positive candidate与probe `Delivered`共享 application fresh-read/finalization/CAS kernel；CAS loser不重调任何 external
   method，commit unknown交 whole-group inspection。
5. durable/fake必须保持相同 correlation/body redline、call budget、UoW split、identity zero set和no-rollback；旧
   `MaterialHandoffPort`及早期三分 inspection签名不恢复。

### 21.9 C2 完成门与真实性声明

| gate | result |
|---|---|
| C2 SOP questions | complete; delivery/probe-specific questions and answers recorded |
| `deliver` parity | complete as design contract; request/candidate/error/call budget mapped |
| `inspect_same_attempt` parity | complete as design contract; four-way probe/no-recollect/strict-unknown mapped |
| post-call/no-rollback parity | complete as design contract; positive finalizer and CAS loser boundaries mapped |
| durable/fake negative audit | complete as static design target; no runtime conformance claim |
| new public callable/status/stored kind/repository/identity | `0 / 0 / 0 / 0 / 0` intended |
| new L1/L2 upstream blocker | `0` |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | remains open until B3-C3~C5 and B5 closure |
| formal `03-详细设计.md` | unchanged; writeback forbidden |
| code / compile / provider conformance / test / run / evidence / acceptance | not started / not created |
| commit required | no |

C2 只关闭 handoff method group的设计中间产物，不关闭整个 B3。下一合法内部动作是 B3-C3 legacy material/observability
negative audit；B4、Step 8、正式 `03` 和 implementation 仍被冻结。

## EOF Current Recovery Override: `7R-05-B3-C2` completed, `C3` current

本节是本文物理 EOF 的当前恢复覆盖。C2 的 `deliver` / `inspect_same_attempt` durable/fake parity 已完成设计静态闭合；本节不把
静态契约写成 provider conformance、运行测试或实现结果。C3 仅进入读取门，尚未写入 C3 正文。

| internal task | status | current scope |
|---|---|---|
| `7R-05-B3-C1` | `[x]` | capture `collect_capture` / `inspect_capture` method parity |
| `7R-05-B3-C2` | `[x]` | handoff `deliver` / `inspect_same_attempt` method parity |
| `7R-05-B3-C3` | `[~]` | legacy material/observability negative audit; source-read gate |
| `7R-05-B3-C4` | `[ ]` | publisher method seam |
| `7R-05-B3-C5` | `[ ]` | ordinary observability hook minimum contract |
| `7R-05-B4` | `[ ]` | inherited publisher/lifecycle/resolver/policy parity audit |
| `7R-05-B5` | `[ ]` | failpoints, negative audit, blocker ruling and recovery synchronization |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v7.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C3 legacy material/observability negative audit (source-read gate)
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
completed_internal_tasks = 7R-05-B1|7R-05-B2|7R-05-B3-C1|7R-05-B3-C2
pending_internal_tasks = 7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
gate_status = in_progress
gate_reason = C2 design-static parity complete; C3-C5 and B4-B5 remain open
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
read_blocker_status = resolved_in_7r_04a_design_static_only
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
next_required_reads = 详细设计讨论中间产物规范.md|详细设计讨论流程_SOP.md|03_ddd_step_07_capture_handoff_publisher_observability.md|03_ddd_step_07_trait_port_adapter_contracts_regression_control.md|03_ddd_step_07_infra_adapters_fake_parity.md|project_execution_ledger.md|implementation_execution_ledger.md
next_allowed_action = read_7r_05_b3_c3_sources_then_write_legacy_negative_audit
```

## 22. `7R-05-B3-C3` Legacy material / observability negative audit

本批是 `7R-05-B3` 的第三个方法组审计，等级为 `L2 保障契约设计`，不重新打开已经由 C1/C2 闭合的 `L1` capture 与
handoff method contract。目标是把旧 generic material / observability surface 与当前窄 application seam 分开，防止实现者
从旧正式文档、概要设计或旧 Step 7 trait 表恢复第二套 port、第二个 truth owner 或完整 observability 平台。

### 22.1 C3 输入、范围与来源效力

| source | consumed evidence | authority in C3 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | port 必须有 owner、caller、implementer、typed I/O、error 和停审；历史材料必须后置差异审计 | required process gate |
| `standards/document/设计文档讨论中间产物规范.md` | 问题回答 -> 诊断 -> 取舍 -> 结构化产物 -> 回填草稿 -> 自检 | required artifact shape |
| `03_ddd_step_07_capture_handoff_publisher_observability.md` §§2.4、15、D3-A/D3-B current correction | 旧 generic port 的冲突位置、窄 delivery request、source material ownership、probe 与 hook boundary | current semantic source |
| `03_ddd_step_07_infra_adapters_fake_parity.md` §§1~21 | application/infra direction、durable/fake parity、body redline、no-rollback 和 C1/C2 current surface | current infra boundary |
| `03_ddd_step_07_immutable_audit_relay_repositories.md` §§9.1~9.4 | relay paired persistence、frozen payload、publisher attempt 和 exact inspection owner | publisher boundary source |
| `03_ddd_step_07_trait_port_adapter_contracts.md` §12.8 | `ExecutionCapturePort`、`MaterialHandoffPort`、`ObservabilityMaterialPort` 的历史正向定义 | historical evidence only |
| `projects/L4-sandbox/02-概要设计.md` §§4~5 | 旧概要层 port 名称和 broad responsibility | historical/upstream conflict evidence |
| `projects/L4-sandbox/03-详细设计.md` §§5.6~6.2 | 旧正式 port / infra carrier 索引仍未统一回填 | formal reassembly input; not current C3 authority |

C3 的真相优先级固定为：Step 6 current object owner -> C1/C2 current Step 7 overlay -> 本批负向审计结论 -> 旧 trait / 正式
正文差异记录。正式 `03-详细设计.md` 当前仍含旧名称，不将其误报为已回填；它继续处于 `historical_reviewed_revalidation_pending`。

### 22.2 C3 SOP 问题回答

| question | answer |
|---|---|
| Q1. 旧的三个 material / observability port 是否仍是 current callable surface？ | 否。`ExecutionCapturePort`、`MaterialHandoffPort`、`ObservabilityMaterialPort` 的正向签名全部是 historical 或 invalidated material；current capture/handoff surface 由 C1/C2 的窄 checked port 承接。 |
| Q2. `ObservabilityMaterial` 是否属于 L4 observability store truth？ | 否。它是 Sandbox-owned、body-free 的 source material lifecycle truth，只记录 capture/terminal source 的安全摘要、marker、lineage 和交接关系；不证明下游 observability store、log、metric、trace 或 investigation 已落库。 |
| Q3. 为什么不能保留一个 generic `MaterialHandoffPort` 兼容所有 target？ | 它把 source material、target selection、attempt、provider outcome 和 Sandbox truth 混在同一个调用面，无法表达 target-specific correlation、same-attempt unknown 和 per-target no-rollback；保留它会形成第二 owner。 |
| Q4. publisher 与 material handoff 的边界是什么？ | publisher 只消费已提交 relay persistence group 中的 frozen payload、source binding、dedup key 和 committed attempt；普通 material handoff 不调用 publisher，`EventRelay` 也不能伪装成普通 material target。 |
| Q5. 普通 observability hook 在 C3 需要定义到什么程度？ | 只固定 owner、触发时机、body-free safe fields、低基数约束、failure isolation 和不得写主 truth；具体 method seam 留给 C4/C5，不新增公共 trait 或 stored kind。 |
| Q6. durable/fake 如何证明没有恢复旧 surface？ | 两者都拒绝完整 aggregate / material vector 输入、generic outcome、raw provider body、默认成功和 direct Sandbox write；两者只接受现行 checked request，并保持相同 zero set。 |
| Q7. 旧正式文档和概要设计的冲突是否构成新的 L1/L2 blocker？ | 不构成新的上游 blocker；这是已登记的 formal reassembly 差异。正式正文仍冻结，后续装配必须引用本 C3 回填草稿并清除旧正向 surface。 |
| Q8. C3 完成后允许进入什么？ | 只允许进入 C4 publisher method seam；不进入 C5、B4、Step 8、正式 `03` 或 implementation。C4/C5 仍需各自独立停审。 |

### 22.3 历史 surface 差异审计

| historical material | old positive shape | current problem | disposition | formal backfill impact |
|---|---|---|---|---|
| `03_ddd_step_07_trait_port_adapter_contracts.md:983` `ExecutionCapturePort` | `collect_capture(ControlledExecutionRun, trace) -> ApplicationResult<CaptureCollectionOutcome>` | adapter 接收完整 run，并返回可直接构造 `CaptureFact`、material rows 和 observability refs 的 carrier；caller supplied object 可绕过 exact committed lineage | `historical_material` / invalidated positive shape | 删除旧正向签名；回填 C1 的 `CaptureCollectionPort` checked request/candidate/error 结论 |
| `03_ddd_step_07_trait_port_adapter_contracts.md:993` `MaterialHandoffPort` | `handoff_material(HandoffFact, Vec<CapturedMaterialRef>, trace) -> MaterialHandoffAdapterOutcome` | opening aggregate、source rows、target selection、attempt 和 provider result混成一次调用；无法闭合 external await/UoW split | `invalidated_dependency_direction` | 不恢复；回填 C2 的 `HandoffTargetDeliveryPort::deliver` 及 exact attempt request |
| `03_ddd_step_07_trait_port_adapter_contracts.md:1004` `ObservabilityMaterialPort` | `handoff_observability_material(CaptureFact, Vec<ObservabilityMaterialRef>, trace) -> MaterialHandoffAdapterOutcome` | 把 source material 当作独立 generic delivery domain，并暗示 observability adapter拥有 material handoff truth | `historical_material` | 删除独立正向 port；observability material 作为 source selection 的既有 member，由 target delivery seam承接 |
| `CaptureCollectionOutcome` historical struct | `capture_fact + material_refs + observability_refs` | adapter-owned aggregate truth、cardinality 和 identity allocation 越界 | `invalidated` | 只保留 body-free candidate 到 application/domain factory 的映射 |
| `MaterialHandoffAdapterOutcome` | infra-owned generic delivered/retryable/failed carrier | provider classification 与 domain observation混为一层，unknown无法表达 | `invalidated` | 不进入 application trait、domain、contracts、stored surface或protocol |
| `ApplicationResult<T>` as universal adapter result | generic success/error wrapper | finite observation、contract violation、provider unavailable、side-effect unknown 失去边界 | `invalidated for these external seams` | family-specific candidate/error；不新增 `Failed(String)`、`Retryable(bool)` 或 raw cause |
| `projects/L4-sandbox/02-概要设计.md:116,285` old port inventory | material / observability port listed as separate broad components | 概要层 inventory 未反映 C1/C2 的窄 seam 和 source ownership correction | `historical_upstream_material` | 正式重装配时以 current Step 7 contract替换，不把旧 inventory作为实现授权 |
| `projects/L4-sandbox/03-详细设计.md:502,533,596` old index | `MaterialHandoffPort`、`MaterialHandoffAdapterOutcome`、infra carrier仍在正式正文 | 当前 formal text尚未完成 reassembly，存在实现者误读风险 | `historical_reviewed_revalidation_pending` | 本批不修改正式正文；Step 19 统一清理并标注 C3 来源 |

### 22.4 改动前后边界对比

| dimension | historical direction | C3 current direction | reason |
|---|---|---|---|
| capture input | full run object / caller supplied refs | committed run-derived checked request | source lineage与identity只能由 application exact read决定 |
| capture output | adapter returns `CaptureFact` and material refs | adapter returns body-free candidate or closed error; application owns factory/UoW | adapter不拥有 Sandbox truth |
| material delivery | one generic handoff call receives aggregate + rows | per-target committed `Attempting` request enters `deliver`; same attempt uses private probe | target correlation、attempt-before-call和unknown可证明 |
| observability material | separate generic delivery port | existing source material member selected by current handoff target plan | 不创建第二 delivery owner；仍保留 material lifecycle truth |
| publisher input | broad material/event handoff or reconstructed current truth | complete committed relay bundle with immutable frozen payload and dedup relation | publisher不回读 current truth重建 payload |
| ordinary hook | unspecified or mixed with material truth | bounded post-return/post-inspection diagnostic signal | hook failure不能改写主流程或 replay |
| adapter error | generic application result/raw cause | family-specific closed port error with caller-safe reason only | unknown、contract violation和finite outcome不可混淆 |
| fake behavior | convenience map/default success | checked request, deterministic failpoint, same candidate/error and zero-set | fake必须暴露真实边界而非遮蔽缺口 |

### 22.5 Current ownership map

| concern | current owner | allowed input | allowed output / side effect | C3 forbidden restoration |
|---|---|---|---|---|
| capture collection | `application::ports::CaptureCollectionPort` + existing capture application/domain factory | checked exact run/capture/generation request | body-free candidate; application creates capture/material/observability truth in existing group | adapter returns `CaptureFact`, material rows or stored result |
| captured material lifecycle | existing `CapturedMaterialRef` repository/domain methods | exact `(capture_ref, material_key)` and expected Version | lifecycle transition paired with handoff target finalizer | generic material repository or key-only global lookup |
| observability material lifecycle | existing `ObservabilityMaterial` owner/repository and capture/terminal factory | exact source basis, ref, generation and lifecycle Version | Sandbox-owned material status/marker/lineage | observability store, log record, metric sample or external ack as Sandbox truth |
| target delivery | `HandoffTargetDeliveryPort::{deliver,inspect_same_attempt}` | committed body-free `HandoffTargetDeliveryRequest` | transient delivery candidate/private probe; provider side effect only in adapter | `MaterialHandoffPort`, direct aggregate input, second attempt or adapter truth write |
| relay persistence | `SandboxEventRelayRecordRepository` existing paired root | exact relay selection/ref, frozen payload and Version | paired relay record/payload/dedup/attempt persistence | second relay root, lazy payload rebuild or generic material relay |
| publisher invocation | existing application publisher owner and current relay method seam | committed relay bundle + committed attempt + frozen payload | one external publish call and typed observation | publisher called by opening/material adapter or current truth reconstruction |
| ordinary observability hook | existing bounded hook owner, detailed later in C5 | low-cardinality body-free diagnostic frame after allowed boundary | isolated diagnostic disposition; no business mutation | new public status, audit truth, retry authority, stored result or UoW write |

### 22.6 Publisher and ordinary hook negative boundary

The following separation is a C3 design boundary, not a new public API:

```text
committed source / relay truth
        |
        +--> existing application owner loads exact frozen relay bundle
        |        -> reserves / commits one publisher attempt
        |        -> external publisher call (C4 method seam)
        |        -> exact attempt observation + relay CAS
        |
        +--> optional bounded diagnostic hook
                 -> low-cardinality, body-free frame
                 -> isolated failure / diagnostic marker only
                 -> no source, handoff, relay, stored-result or identity mutation
```

The hook cannot be used to fill any gap in the relay/material group. A required audit or relay marker remains owned by its existing
application/repository group; ordinary telemetry is not a substitute for that marker. A publisher failure changes only the relay attempt
and its recovery/report surface under the existing owner; it cannot delete source capture, terminal run, selected material truth or an
earlier target success.

### 22.7 Durable/fake negative parity matrix

| negative dimension | durable adapter must reject | deterministic fake must reject | equal observable result |
|---|---|---|---|
| legacy capture input | full `ControlledExecutionRun`, caller capture ref, mutable aggregate | same shapes even if fixture has a convenient map | checked request error; zero external call and zero identity |
| legacy material input | full `HandoffFact` + arbitrary material vector | same aggregate/vector fixture shortcut | request-shape/relation error; no delivery and no Sandbox write |
| separate observability port | direct `CaptureFact` + observability ref vector as a new method | fake-only observability handoff helper | no callable surface; source material must flow through existing target plan |
| generic outcome | `ApplicationResult<T>` with raw/provider-specific payload | wildcard/default outcome or bool success | closed family error; no domain mapping |
| provider body | body/path/URL/credential/SDK object in candidate or error | body-bearing fixture silently accepted | forbidden-body error; no body crosses boundary |
| publisher reconstruction | latest/current source read to rebuild payload | private fake map used to synthesize payload | integrity/relation error; frozen relay pair remains authoritative |
| hook ownership | hook writes domain/repository/UoW/identity | fake hook mutates fake business map | bounded diagnostic failure only; public result and truth unchanged |
| rollback behavior | external failure deletes committed source/material/earlier target | fake reset clears committed facts | no-rollback preservation; uncommitted local group only may rollback |
| retry behavior | hook/publisher/adapter error silently calls another method | fake hidden retry or counter reset | call budget unchanged; unknown enters existing recovery owner |

### 22.8 C3 static difference audit

| audit item | expected | C3 result |
|---|---:|---|
| old `ExecutionCapturePort` positive callable restored | 0 | rejected; current capture surface remains C1 checked port |
| old `MaterialHandoffPort` positive callable restored | 0 | rejected; current delivery surface remains C2 per-target port |
| old `ObservabilityMaterialPort` positive callable restored | 0 | rejected; material is source member, not second port |
| generic `MaterialHandoffAdapterOutcome` crosses application boundary | 0 | rejected; infra-local historical carrier only |
| generic adapter result used for finite/unknown/error mapping | 0 | rejected; family-specific closed candidate/error required |
| `ObservabilityMaterial` reclassified as L4 observability store truth | 0 | rejected; Sandbox source material boundary retained |
| publisher called from opening/material adapter | 0 | rejected; existing relay publisher owner only |
| publisher payload rebuilt from latest/current truth | 0 | rejected; frozen paired relay payload required |
| ordinary hook writes Sandbox truth or allocates identity | 0 | rejected; bounded diagnostic only |
| durable/fake legacy shortcut or default-success path | 0/0 | rejected; same checked validator and failpoint surface |
| raw body/path/credential/SDK detail crosses boundary | 0 | rejected by redline |
| new public callable/status/stored kind/repository/identity | `0/0/0/0/0` | no additions intended |
| new L1/L2 upstream blocker | 0 | none found in static audit |
| implementation/compile/provider/test/run/evidence/acceptance claim | 0 | not claimed |

### 22.9 C3 design choices and complexity decision

| option | benefit | risk | decision |
|---|---|---|---|
| restore old ports for compatibility | less apparent rename work | duplicate owner, broad input, unknown ambiguity and truth leakage | reject |
| retain one generic material/observability port but narrow prose | fewer names | signature still permits aggregate/vector misuse and cannot enforce target attempt boundary | reject |
| define a full observability platform in Sandbox | seemingly complete telemetry story | mixes L2/L3 operations with Sandbox L1 truth and extends design cycle | reject |
| keep source material, relay publisher and ordinary hook as separate existing owners | preserves ownership and makes negative boundaries testable | requires later C4/C5 method-level audits | adopt |

C3 不新增公共 trait、DTO、status、stored kind、repository 或 identity。C4 只需审查现有 publisher method seam；C5 只需补齐普通
hook 的最小输入/输出/失败隔离，不应借机扩展日志平台、告警编排、指标存储或 delivery report schema。

### 22.10 Formal `03` backfill draft (frozen)

后续正式 `03-详细设计.md` 重装配时，只允许回填以下收口结论：

1. 历史 `ExecutionCapturePort`、`MaterialHandoffPort`、`ObservabilityMaterialPort` 及 generic adapter outcome 不属于当前
   application callable surface；它们只保留在 calibration 的 historical diff 中。
2. capture adapter 只返回 checked、body-free candidate；handoff adapter 只消费 committed per-target attempt request，
   `deliver` 与 same-attempt inspection 不拥有 Sandbox truth、repository 或 identity。
3. `ObservabilityMaterial` 是 Sandbox-owned source material lifecycle，不是 L4 observability store truth；其交接由现有 target
   selection / delivery owner承接，不能恢复独立 generic observability port。
4. publisher 只消费已提交 relay persistence group 的 frozen payload 和 exact attempt；ordinary observability hook 只产生低基数、
   body-free、失败隔离的诊断结果，不改变主体 truth、public result、retry 或 stored replay。
5. durable/fake 必须拒绝旧 surface、默认成功、raw body、latest truth payload rebuild 和 hidden retry，并保持相同的 call/identity/
   write zero set；本 C3 仍是 design-static contract，不是运行验证结果。

### 22.11 C3 completion gate and next stop

| gate | result |
|---|---|
| C3 SOP questions | complete; eight questions answered with source and owner boundary |
| historical surface inventory | complete; old port/result positions and formal conflicts recorded |
| current ownership map | complete; capture/material/relay/publisher/hook owners separated |
| durable/fake negative parity | complete as design target; no runtime conformance claim |
| L2 complexity boundary | complete; ordinary hook/telemetry/reporting kept bounded |
| formal `03-详细设计.md` writeback | forbidden; unchanged in this batch |
| new public surface / repository / identity | `0 / 0 / 0` intended |
| new L1/L2 upstream blocker | `0` |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | remains open until C4/C5/B4/B5 closure |
| next legal internal action | user review gate, then C4 publisher method seam |
| implementation / compile / provider / test / run / evidence / acceptance | not started / not created |
| commit required | no |

## EOF Current Recovery Override: `7R-05-B3-C3` completed, user review pending

C3 的 legacy material/observability 负向审计已完成设计静态收口。物理 EOF、Markdown fence、历史 surface、owner separation、
durable/fake negative parity 和复杂度边界均已检查；未恢复旧三个 port，未新增公共 callable、status、stored kind、repository
或 identity。此处只记录设计审计事实，不等同于编译、provider conformance、运行测试或真实 evidence。

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
gate_reason = C3 design-static negative audit complete; C4 publisher method seam requires explicit review entry
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
outcome_blocker_status = open_wait_7r_05_b3_c4_b5
read_blocker_status = resolved_in_7r_04a_design_static_only
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

C4、C5、B4、B5 尚未开始；不得在本恢复覆盖之后自动写入 C4 正文、正式 `03-详细设计.md`、Step 8 或 implementation。

## 23. Continuous closeout batch: C4/C5/B4/B5

本批在用户授权连续完成后一次性收口 `7R-05-B3-C4`、`7R-05-B3-C5`、`7R-05-B4` 和 `7R-05-B5`。这些任务只补齐 Step 7
已有 owner 的方法级边界、负向 parity 和交接审计，不新增 Sandbox 主体能力，也不把普通审计 / telemetry / delivery report
扩展为新的业务流程。

### 23.1 C4 publisher method seam

| item | durable adapter / application owner | deterministic fake obligation | forbidden behavior |
|---|---|---|---|
| input | 已提交 relay persistence group 的 frozen payload、source binding、dedup relation、exact `EventRelayAttemptRef` | 只能读取同一 frozen bundle；不得从 fake business map 重建 payload | 传入 source aggregate、latest truth、raw body、credential、SDK object |
| pre-call | fresh read exact attempt；CAS `Pending -> Sending`；同一 correlation / attempt 只允许一次 external call | 与 durable 使用相同 CAS 和 call counter | 在 CAS loser、duplicate 或 inspection path 重复调用 publisher |
| external result | 映射到既有 relay outcome：`Published`、`Retryable`、`Failed`、`Unknown`；provider body只留安全分类 | 相同 closed mapping、same unknown preservation、same body redline | `bool`/generic result、把 timeout 当失败、把 unknown 当 retry/success |
| post-call | fresh read exact attempt；CAS observation；写 relay attempt / safe marker / stored report 所属 UoW | 相同 write set、version conflict 和 local-only reapply | 删除 source truth、重建 payload、改变 original cursor、回滚 earlier target |
| retry | 只有既有 retry job / application owner 可创建下一 attempt；publisher adapter 不自发重试 | fake 不隐藏重试、不重置预算 | adapter loop、hook loop、CAS loser重新 external call |

固定顺序：`load committed bundle -> reserve exact attempt -> external call once -> fresh inspect -> CAS observation -> commit relay-local
result`。source capture、handoff material、terminal run 和 earlier target success 永远不属于 publisher rollback 集合。

### 23.2 C5 ordinary observability hook minimum contract

普通 hook 只在 application 已完成允许的 return / inspection boundary 后接收一个 body-free diagnostic frame。其最小字段为：
`correlation_ref`、`operation_kind`、`owner_kind`、`outcome_class`、`safe_reason_code`、`attempt_ordinal`（仅适用时）和
`diagnostic_version`。字段必须低基数、不可逆、不可包含 body / path / URL / argv / environment / credential / token / SDK
对象或 provider 原始文本。

| hook rule | required result |
|---|---|
| invocation timing | post-return / post-inspection；不得在安全 guard 前替代 required audit marker |
| output | infra-private `DiagnosticDisposition::{Recorded,Suppressed,Rejected}` 或既有 bounded diagnostic result；不进入 Sandbox truth |
| failure | hook failure 只产生 isolated diagnostic marker；不改变 public result、retry、replay、state、UoW、identity 或 cleanup decision |
| ownership | 不写 domain repository、relay repository、idempotency、stored result、identity 或 audit truth |
| durable/fake | 相同 safe-field validator、body redline、call budget 和 failure isolation；fake 不得借 hook 修改业务 map |

该 hook 不是 observability store、audit ledger、alert router、delivery report 或 repair mechanism；缺失的 required marker 必须由其
原 owner 补齐，不能以普通 hook 代替。

### 23.3 B4 inherited owner parity audit

| inherited owner | parity checks | current result |
|---|---|---|
| lifecycle / resolver | exact request relation、typed closed outcome、unknown preservation、zero identity allocation on rejection | preserve existing owner; no duplicate port |
| repository / UoW / index | same read/write set、version/CAS、commit-unknown inspection、query zero-write | preserve existing Step 11 owner; no new repository |
| policy / launch | fail-closed, coherent boundary prerequisite、no tool/runtime semantic execution | preserve policy owner; Sandbox only consumes decision summary |
| publisher / relay | frozen paired payload、exact attempt、no source rollback、single external call | C4 contract above; no call from capture/opening adapter |
| cleanup / lease / reaper | guard before delete、lease/orphan classification、evidence/material preservation | preserve existing cleanup owner; no hook-driven release |

The audit explicitly rejects a second owner for any existing status, stored kind, identity, repository, UoW group or external call.

### 23.4 B5 failpoint and negative closure

The following are design failpoints for future implementation tests, not executed results:

| failpoint | required durable/fake observation | forbidden shortcut |
|---|---|---|
| capture candidate contains body | checked request error; zero write / identity / external call | redact-and-accept or log body |
| publisher CAS loser | no second external call; local inspection only | call publisher again |
| publisher result unknown | preserve `Unknown`; enter existing recovery owner | map to `Failed`, `Retryable` or `Published` |
| hook throws / times out | isolated diagnostic failure; primary result unchanged | retry primary operation or rollback truth |
| latest truth differs from frozen relay payload | integrity / relation error; frozen bundle remains authoritative | rebuild from latest truth |
| external failure after source commit | source, capture, material and earlier target remain readable | delete or rewrite source truth |
| fake-only default success | same rejection as durable adapter | wildcard success / bool fallback |
| cleanup guard incomplete | delete/release rejected and marker preserved | force cleanup or release by telemetry |

### 23.5 Cross-audit and formal backfill

Cross-audit result: `0` new public callable, `0` new status, `0` new stored kind, `0` new repository, `0` new identity, `0` new UoW
group, `0` new L1/L2 upstream blocker. Historical three-port surfaces remain `historical_material` / invalidated and are not restored.

Formal `03` may only backfill the following: publisher consumes frozen committed relay bundle and exact attempt; ordinary hook emits bounded
body-free diagnostic disposition; durable/fake share validators, call budget, unknown and no-rollback behavior; inherited owners remain
single-source. No runtime test, provider conformance, evidence, acceptance or commit claim is created by this batch.

## 24. Continuous closeout gate

| task | status | gate |
|---|---|---|
| `7R-05-B3-C4` publisher method seam | `[x]` design-static complete | frozen bundle, exact attempt, one-call, unknown and no-rollback closed |
| `7R-05-B3-C5` ordinary hook minimum contract | `[x]` design-static complete | bounded safe fields and failure isolation closed |
| `7R-05-B4` inherited owner parity | `[x]` design-static complete | existing owner reuse and zero new surface closed |
| `7R-05-B5` failpoints / negative audit / blocker ruling | `[x]` design-static complete | durable/fake negative matrix and recovery sync closed |
| formal `03` writeback | `[x]` permitted after this batch | only frozen conclusions above |
| implementation / compile / test / provider / evidence / acceptance | `[ ]` | not started; no claims |

```text
continuous_closeout = completed_design_static_only
completed_internal_tasks = 7R-05-B1|7R-05-B2|7R-05-B3-C1|7R-05-B3-C2|7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
new_public_surface = 0
new_l1_l2_blocker = 0
outcome_blocker_status = resolved_for_step_7_design_static_closeout
formal_03_writeback = allowed_for_reassembly
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = complete_step_7_cross_audit_then_reassemble_formal_03
```
