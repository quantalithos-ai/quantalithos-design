# Step 7 Trait / Port / Adapter 粒度回归重审控制产物

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 创建日期: 2026-07-25
> 状态: `7r_03b_completed_wait_user_review`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游门禁: Step 6 `6R-07 review_confirmed`；Step 7 `S7-03A review_confirmed`
> 回归来源: `/tmp/L4-sandbox_03_step06_step10_granularity_review_and_completion_plan.md`
> 当前边界: `S7-03B`四类lifecycle port、六个async method、launch failure identity、reservation/UoW ordering与fake/durable parity已完成。当前停在用户复核前，不得进入`S7-03C`、Step 8、正式`03~07`、implementation boundary skeleton或实现仓。

---

## 1. 开工确认与恢复点

| 检查项 | 当前结论 |
|---|---|
| 用户是否确认当前内部批 | 是。用户本次“继续”已消费B5停审点并授权只执行`S7-02D-B6`；B6现已完成，未自动消费`S7-G02`。 |
| 当前文档 / Step | `03-详细设计.md` / Step 7 regression / `7R-02D completed_wait_user_review`。 |
| Step 6 current authority | 69-row registry、五份canonical source、七模块owner和`S7H-01~15` handoff继续有效；Step 7不得反向修改schema。 |
| historical Step 7效力 | 原§1~§24保留为historical reviewed material和缺口证据，不再拥有current callable authority。 |
| 本批允许修改 | B6 closure主产物、facade/repository current override、本控制文件、`03` flow、两份ledger和`/tmp`计划。 |
| 本批禁止修改 | 尚未启动的`7R-03~07`内容正文、Step 8~19、正式`03~07`、32件planned skeleton、实现仓和代码。 |
| implementation状态 | `CB-SBX-01A blocked / wait_design`；实现未开始。 |
| 新L1/L2 blocker | 0。`INPUT-001`和`REF-001`已关闭；`DISPATCH/OUTCOME/READ/ENTRY`四项仍按`7R-03~06` owner开放。 |
| `7R-M0`审查结果 | 用户“开始实施”已确认继续执行设计补全；该确认消费`7R-M0`内容门，不授权implementation或目标仓代码变更。 |
| 当前动作 | 等待用户审查`7R-02A~D`完整产物；确认后才允许启动`S7-03A`。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
upstream_step_6 = review_confirmed_consumed_by_7R_M0
consumed_review_gate = S7-G01
ref_blocker = resolved_in_7r_02d
remaining_step_7_internal_blockers = 4/6_open_with_owner
next_allowed_action = wait_user_review_before_s7_g02
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Draft (superseded): `S7-03A` completed, `S7-03B` pending

本节曾位于本文前部，现标记为历史草稿，不是当前 Step 7 control 恢复源。它只记录 `S7-03A` 内容闭合，
不关闭完整 `7R-03` 或任何尚未完成的 blocker；本文物理 EOF 的唯一 `S7-03A` override 才有权威性。

| control item | current result |
|---|---|
| completed batch | `S7-03A identity/reference/policy/capability resolver` |
| current artifact | `03_ddd_step_07_resolver_ports.md` |
| trait closure | four application-owned async resolver ports `4/4`；infra durable/fake implementer boundary explicit |
| relation closure | source carrier；required/deferred；policy binding/gap；marker lineage；pending-gap；capability target；generation/freshness all closed |
| capability closure | canonical verdict `10/10`；typed `Current/Stale` observation；classification priority `Invalid > Stale > Unsupported > Unknown > Fresh` |
| static closure | fence parity `0`；table mismatch `0`；public contract Rustdoc gap `0`；body/SDK/raw response positive fields `0` |
| open blockers | `DISPATCH/OUTCOME/READ/ENTRY = 4/6`；`OUTCOME-001` remains open until `7R-03B/C` and `7R-05` |
| current gate | `S7-03A user_review_pending` |
| next allowed action | confirmation后只启动 `S7-03B`；不得自动跨到 `S7-03C` |
| downstream | Step 8、正式 `03~07`、implementation和boundary skeleton继续冻结 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03A completed_wait_user_review
current_batch = S7-03A identity/reference/policy/capability resolver
batch_status = completed_wait_user_review
gate_status = user_review_pending
current_task = none
next_task = S7-03B establish/launch/inspect/release ports
next_allowed_action = wait_user_review_before_s7_03b
S7-03A_trait_closure = 4/4
S7-03A_capability_verdict = 10/10
S7-03A_direct_domain_truth_return = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
outcome_blocker = open_partial_resolver_only
new_l1_l2_blocker = 0
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## EOF Current Recovery Override: `S7-02D-B3-1` completed

本节位于物理EOF并覆盖本文所有前置activation。B3-1只完成surface owner/schema；B3-2尚未写typed store trait。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3
next_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
next_allowed_action = write_s7_02d_b3_batch_2
surface_schema = 3/3
new_l1_l2_blocker = 0
ref_blocker = in_progress_wait_s7_02d
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Overlay: `S7-02D-B3-1` completed, B3 remains in progress

本节覆盖前一个`S7-02D` activation overlay的下一动作。三类完整surface的application owner、字段、factory/accessor、
fresh构造顺序和JobReport specialization已经闭合；typed store exact trait/error、save/get交叉校验和missing/wrong/corrupt
矩阵仍由B3后续内部批次完成。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3 typed stored carrier and full surface stores
next_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
next_allowed_action = write_s7_02d_b3_batch_2
surface_schema = 3/3
stored_kind = 3/3
job_report_payload = Maintenance|Reconciliation
new_l1_l2_blocker = 0
ref_blocker = in_progress_wait_s7_02d
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## 21. `S7-02D` Current Activation：idempotency / stored result / bounded index

> 本节位于本文物理末尾，是当前恢复状态的唯一 control overlay（2026-07-26）。前文 `S7-02B`、`S7-02C`
> 状态保留为 historical audit trail；本节不改变已完成批次的内容，只激活 `S7-02D`。

| control item | current result |
|---|---|
| consumed predecessor | `S7-02C` immutable / audit / relay repository review已消费；`S7-G02`仍未完成。 |
| current task | `S7-02D` idempotency reservation、stored public result和必要bounded index。 |
| allowed authority | Step 6 canonical application types、`S7H-09`、`S7H-10`、repository §26、facade §52及本批新产物。 |
| required L1 closure | fresh claim、duplicate replay、digest conflict、in-flight、failed-terminal、commit-unknown、typed stored surface和same-UoW relation。 |
| allowed L2 closure | 运维/selection所需的bounded selector、唯一性和fake/durable parity；不设计完整运维查询系统。 |
| forbidden | generic result API、缺失结果重算、channel进入unique identity、Query write、第二identity owner、全表scan。 |
| downstream freeze | `S7-G02`、`S7-03~07`、Step 8~19、正式 `03~07`、implementation和boundary skeleton继续冻结。 |
| implementation | `CB-SBX-01A blocked / wait_design`；不修改代码、不生成运行事实。 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = content_in_progress
completed_predecessor = S7-02C immutable / audit / relay repository
current_artifact = 03_ddd_step_07_idempotency_stored_index_repositories.md
stored_result_contract = in_progress
idempotency_claim_contract = in_progress
bounded_index_contract = in_progress
application_callable = 42/42
query_write = 0/13
fresh_reservation_owner = 29/29
ref_blocker = in_progress_wait_s7_02d
new_l1_l2_blocker = 0
next_allowed_action = write_s7_02d_batch_1
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```


## 2. 本批目标与非目标

`7R-M0`解决“Step 7应如何串行重建以及每个缺口由哪个批次关闭”，不解决具体trait签名。它必须让
后续恢复者无需从旧1604行正文猜当前进度，也不得把Step 6 handoff误写成已经收稳的callable。

本批目标：

1. 将Step 6用户确认转换为Step 7可消费的正式输入门禁。
2. 撤销historical Step 7原`completed_wait_user_review`的current authority，但保留历史审查事实。
3. 固定七模块执行顺序、七个内容产物审查门和产物内任务连续执行规则。
4. 将`S7H-01~15`唯一分配到后续批次，禁止遗漏或并行重写。
5. 为六个预登记Step 7 blocker固定证据、关闭owner和关闭门禁。
6. 冻结Step 8~19、正式`03~07`和implementation，直到Step 7整体经用户确认。

本批明确不做：

- 不定义16个historical `*Input`的替代schema。
- 不选择42个entry最终采用独立method还是closed dispatch enum。
- 不定义repository、resolver、backend、capture、handoff或publisher exact trait。
- 不定义Step 8 DTO、route、topic、event payload或job report schema。
- 不修改Step 9 flow、Step 10 state matrix或Step 11 persistence。
- 不声明compile、test、run、provider、evidence、acceptance或implementation事实。

---

## 3. 权威输入与效力判定

| 输入 | 当前效力 | `7R-M0`使用方式 |
|---|---|---|
| Step 7 SOP | current process authority | 固定逐模块capability清单、exact trait、模块停审和跨模块审计门禁。 |
| 详细设计书写规范 §5.5/§5.6 | current output authority | 固定trait Rust片段、参数/返回/error与正式索引格式。 |
| 真相源闭环标准 | current quality authority | 固定read/write、Version/UoW、stored replay、page helper与fake parity检查。 |
| Step 5 module contracts | reviewed current owner input | 固定`contracts/domain/application/infra/api/worker/jobs`七模块owner和依赖方向。 |
| Step 6主控§29 + shared §8/§24 | current object/type authority | 提供69-row registry、core `Version/Timestamp/JobRunId`和shared carrier；Step 7不能复制schema。 |
| 五份Step 6 canonical分件 | current object capability authority | callable参数/返回只能引用其中的current object、view、outcome、error和guard。 |
| `6R-06` closure audit | review-confirmed audit input | 提供field/factory/guard/ref/status/error闭合结论，不成为port owner。 |
| `6R-07` handoff §9~§10 | current Step 7 intake authority | 提供七模块owner、`S7H-01~15`、42 entry、13 relay和六个blocker。 |
| 原Step 7 §1~§24 | historical reviewed material | 只用于提取旧名称、冲突和缺失，不得继承其签名为current。 |
| 原Step 8~11 | historical downstream conflict input | 只用于验证所需读取/写入面，不能反向定义Step 7。 |
| 正式`00/01/02` | current upstream boundary | 固定Sandbox职责、安全红线、通信和数据owner。 |
| 正式`03~07` | historical reviewed / revalidation pending | 不作为current implementation authority，不在本批修改。 |

### 3.1 冲突裁决顺序

```text
Step 7 SOP / writing standard
  -> Step 5 module owner and dependency direction
  -> Step 6 current registry and canonical object contract
  -> 6R-07 S7H handoff
  -> current 7R content artifact
  -> historical Step 7~11（只作诊断）
```

若后续Step 7批次发现exact callable需要Step 6不存在的carrier、factory或owner error，必须登记并重开
Step 6；不得在port文件创建local domain替代类型。

---

## 4. SOP问题回答

| SOP问题 | `7R-M0`控制结论 |
|---|---|
| 哪些模块需要定义trait/port | `application`是唯一业务port trait owner；`infra`实现这些port并拥有runtime assembly；`api/worker/jobs`只定义entry adapter；`contracts/domain`不定义repository或external port。 |
| 哪些模块实现trait/port | durable/fake repository、resolver和external adapter由`infra`实现；entry adapter分别由`api/worker/jobs`实现；application service实现由application module提供。 |
| 哪些capability需要接缝 | `S7H-01~15`覆盖service、UoW/identity、mutable/immutable repository、idempotency、audit/relay、resolver、isolation、capture/handoff/publisher、read maintenance和runtime assembly。 |
| port如何承接Step 6对象能力 | 每个callable必须列registry对象、调用方、实现方、输入ownership、返回carrier、owned error和downstream consumer；不能只写trait名。 |
| repository/external函数签名 | 留给`7R-02~04`逐trait定义；本批只固定其必须包含exact typed I/O、Version/UoW、finite outcome和read/write pairing。 |
| 参数、返回和错误 | 禁止`SandboxOpaqueRef`、旧`SandboxRepositoryVersion`和generic error补位；使用Step 6 named ref、core `Version`及module-owned error。 |
| 读取面是否完整 | 必须逐Query/maintenance/DTO consumer证明read surface；historical `get_status/get_view/list`摘要不能视为闭合。 |
| 写入面是否闭合 | 每个write/append必须说明Version来源、UoW参与、commit visibility、idempotency/stored replay和rollback leakage。 |
| 哪些依赖只能经trait | application不得依赖infra concrete/provider type；entry不得访问repository/domain transition；domain不得访问repository/config/adapter。 |
| 模块停审方式 | `7R-01~07`按完整current产物停审；同一产物内A/B/C/D任务连续执行，每项完成后立即更新`/tmp`计划，但不逐项等待用户回复。 |
| 跨模块审计 | `7R-07`检查42/42 entry、13/13 relay、15/15 handoff、duplicate port、reverse dependency、read gap、Version/UoW和fake parity，unresolved非0不得关闭Step 7。 |

---

## 5. Historical Step 7问题证据

### 5.1 Service与dispatch缺口

| evidence | historical state | current判定 |
|---|---|---|
| Command facade | 10个method存在，但引用10个未定义command `*Input` | method名只作候选；input/output未闭合，`S7H-01`未通过。 |
| Query facade | 13 Query压成3个method，另有3个未定义input | selector、返回和absence/degraded读取面不唯一，`S7H-02`未通过。 |
| Consumer facade | 9 Consumer压成2个method，另有2个未定义input | source authority、dedup receipt和finite outcome不可逐consumer验证，`S7H-03`未通过。 |
| Job facade | 10 Job压成一个`run_job(SandboxJobServiceInput)` | selection/item/finalizer及fresh/duplicate路径缺失，`S7H-04`未通过。 |
| Entry adapter | `map_outcome`、opaque `consumer_context`和`record_job_outcome(ServiceOutcome)` | selector/status/result relation丢失，`S7H-05`未通过。 |

历史文件中16个只引用、无exact definition的input名称为：

```text
OpenControlledExecutionContextInput
EstablishExecutionBoundaryInput
EvaluatePolicyExecutionInput
StartControlledExecutionRunInput
RecordCaptureResultInput
OpenMaterialHandoffInput
SubmitSandboxControlInput
ClassifySandboxFailureInput
EvaluateCleanupReadinessInput
RecordRedlineContainmentInput
GetSandboxExecutionStatusInput
GetSandboxReadProjectionInput
GetSandboxAuditTraceInput
ConsumeReferenceChangeInput
ConsumeSandboxFeedbackInput
SandboxJobServiceInput
```

### 5.2 Ref、version、read和outcome缺口

| evidence | historical state | current判定 |
|---|---|---|
| optimistic version | 自定义`SandboxRepositoryVersion`并进入`Versioned<T>`及save方法 | 与current core `Version`重复，必须由`7R-02`移除。 |
| ID generation | 10个generator method仍返回`SandboxOpaqueRef` | 必须改用Step 6 named ref；transient entry carrier不得生成第二身份。 |
| snapshot/read helper | `Vec<SandboxOpaqueRef>`和opaque item/scope/report ref广泛存在 | 无法证明kind、bundle key、view factory输入和whole-group writer，对应`READ/REF` blocker。 |
| adapter outcome | historical adapter可由entry/service generic mapper转成domain/public status | 必须先映射typed observation/application result，再由Step 6 owner method接受。 |
| repository grouping | 多个`save_*_group`使用可选旧version，但未逐owner给same-UoW/CAS语义 | `7R-02`必须按20 mutable、13 immutable及audit/relay/stored surface重建。 |
| fake parity | 只有族级表，没有逐method finite outcome/error/order矩阵 | `7R-05`必须逐trait证明fake/durable相同surface与失败能力。 |

### 5.3 边界污染检查

- tools semantic execution不属于Step 7 callable。
- runtime agent loop不属于Step 7 callable。
- member lifecycle orchestration不属于Step 7 callable。
- artifact只接收body-free capture/handoff ref与safe summary，Sandbox不拥有artifact body。
- observability只接收body-free handoff并提供hook，不拥有Sandbox audit truth或观测存储。
- policy definition/approval/allowlist/capability truth仍属于上游；Sandbox只执行已接受snapshot/decision。

未发现需要退回L1/L2修改的上游blocker；以上均为L4-sandbox内部可关闭设计缺口。

---

## 6. 改动前后与设计取舍

### 6.1 改动前后

| 主题 | historical Step 7 | regression后要求 |
|---|---|---|
| authority | 单一1604行文件同时承载过程、schema候选、trait和pass结论 | historical正文只作诊断；current契约按分件唯一拥有，主控末尾只索引。 |
| service input | 16个名称无exact定义 | 42 entry逐个具备exact application-local input/output或closed exhaustive dispatch variant。 |
| callable mapping | 10 Command较细，13 Query/9 Consumer/10 Job被压缩 | 42/42唯一映射；13 outbound event由relay/publisher独立承接。 |
| ref/version | `SandboxOpaqueRef`和`SandboxRepositoryVersion` | Step 6 named ref + core `Version`；cursor/timestamp不得替代version。 |
| repository | 大组trait和族级说明 | 20 mutable、13 immutable、audit/relay/idempotency/stored result逐owner闭口read/write/UoW/CAS。 |
| external outcome | adapter结果可由generic mapper直接转status | finite typed outcome -> typed observation/application result -> object-owned method。 |
| read/maintenance | generic list/snapshot helper，key和whole-group写入面不完整 | exact selector/index/bundle key/body-free snapshot/whole-group replace对称。 |
| entry/fake | 族级mapper和parity摘要 | api/worker/jobs逐entry exact mapping；fake逐method覆盖成功、finite failure、unavailable和commit-unknown。 |

### 6.2 设计取舍

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| 直接在旧Step 7原章节就地修补 | 文件数量少 | historical与current混写，恢复者无法判断签名效力 | 不采用 |
| 删除旧Step 7重建 | current入口简洁 | 丢失历史审查与冲突证据 | 不采用 |
| 保留旧正文，创建current分件，主控末尾追加authority override | schema/callable owner唯一且保留审计轨迹 | 需要严格遵守末尾override | 采用 |
| 一次完成所有trait | 表面进度快 | 违反逐模块停审，容易让后批反向修前批 | 不采用 |
| 先定义Step 8 DTO再倒推input | 看似字段完整 | 违反Step顺序，historical DTO会污染current callable | 不采用 |
| 默认每协议独立method | mapping直接 | method数量较多 | 作为首选；closed enum只有在能证明42/42 exhaustive且不损失typed I/O时才允许。 |

---

## 7. Current产物与唯一owner

| batch | current产物 | 唯一拥有范围 | 明确不拥有 |
|---|---|---|---|
| `7R-M0` | 本文件 | 回归控制、批次、blocker、恢复门禁 | trait/input schema |
| `7R-01` | `03_ddd_step_07_service_facades_inputs_outputs.md` | 42 entry application callable、application-local input/output、DTO source requirement、dispatch strategy | repository/external adapter |
| `7R-02` | `03_ddd_step_07_repositories_uow_indexes.md` | core `Version`、UoW/clock/ID、mutable/immutable repository、idempotency/stored result、audit/relay persistence | external provider outcome |
| `7R-03` | `03_ddd_step_07_resolvers_external_ports_outcomes.md` | resolver、capability、isolation、capture、handoff、investigation、publisher finite outcome | infra implementation/parity |
| `7R-04` | `03_ddd_step_07_read_maintenance_runtime.md` | projection/derived/reference/reconciliation exact read/write、runtime config/availability/assembly | entry mapping |
| `7R-05` | `03_ddd_step_07_infra_adapters_fake_parity.md` | infra adapter implementation matrix、durable/fake parity、raw cause containment | 新application trait |
| `7R-06` | `03_ddd_step_07_entry_dispatch_adapters.md` | api/worker/jobs context、42 entry mapping、module errors和result/receipt/report relation | protocol DTO schema |
| `7R-07` | `03_ddd_step_07_callable_surface_audit.md` | 15 handoff /42 entry /13 relay join、duplicate/reverse dependency/read/version/parity审计 | 新callable/schema |
| master assembly | historical Step 7物理末尾current override | current source索引、正式回填草稿和Step 8 handoff | 第二套trait定义 |

每个current callable只能在上述一个分件定义。其他分件只能用exact名称和source section引用；发现必须
跨owner复制schema时，应登记blocker并退回owner批次。

---

## 8. 批次顺序与产物级停审门禁

| 顺序 | 批次 | 核心范围 | 完成门禁 | 下一动作 |
|---:|---|---|---|---|
| 0 | `7R-M0` | control / authority / freeze | 六blocker、15 handoff、七批owner和恢复源一致 | 用户确认后进入`7R-01` |
| 1 | `7R-01A` | 10 Command service input/output | 10/10 method、input field/source/optionality/output/error/transaction requirement | 连续进入`7R-01B` |
| 2 | `7R-01B` | 13 Query callable | 13/13 exact selector/input/output；access-first、zero-write、absence/degraded完整 | 连续进入`7R-01C` |
| 3 | `7R-01C` | 9 Consumer callable | 9/9 source envelope input、authority、dedup/stored receipt、finite outcome | 连续进入`7R-01D` |
| 4 | `7R-01D` | 10 Job callable + 42 mapping audit | 10/10 selection/item/finalizer/fresh-duplicate；42/42 exhaustive | 停审并确认完整`7R-01` |
| 5 | `7R-02A` | UoW/clock/typed ID | core `Version`唯一；generated/preserved/transient identity分类完整；rollback无泄漏 | 连续进入`7R-02B` |
| 6 | `7R-02B` | 20 mutable truth repository | exact get-with-version/create/save/CAS；same-UoW group和owner error完整 | 连续进入`7R-02C` |
| 7 | `7R-02C` | 13 immutable + audit/relay repository | get/append/create、replacement/source/correlation；append-only和pending selection完整 | 连续进入`7R-02D` |
| 8 | `7R-02D` | idempotency/stored result/index | reserve/complete/fail、typed save/get、duplicate replay、必要index完整 | 停审并确认完整`7R-02` |
| 9 | `7R-03A` | context/reference/policy/capability resolver | typed source input、body-free finite outcome、unavailable/invalid/stale完整 | 连续进入`7R-03B` |
| 10 | `7R-03B` | isolation establish/launch/inspect/release | 四port独立、exact correlation、commit-unknown inspect、无SDK泄漏 | 连续进入`7R-03C` |
| 11 | `7R-03C` | capture/handoff/investigation/publisher | per-target finite outcome、persisted attempt、observation apply、no-rollback | 停审并确认完整`7R-03` |
| 12 | `7R-04A` | projection/derived/reference maintenance | exact selector/index/bundle key、body-free snapshot、whole-group replace | 连续进入`7R-04B` |
| 13 | `7R-04B` | reconciliation + runtime assembly | same-snapshot report；18-slot availability/generation/build顺序 | 停审并确认完整`7R-04` |
| 14 | `7R-05` | infra/fake parity | L1逐method parity；L2同类结果、safe default且不可伪造success | 停审并确认完整`7R-05` |
| 15 | `7R-06A` | API entry | 10 command +13 query context和output mapping，错误类别穷尽 | 连续进入`7R-06B` |
| 16 | `7R-06B` | Worker entry | 9 consumer及fulfillment/relay mapping，安全结果路由完整 | 连续进入`7R-06C` |
| 17 | `7R-06C` | Jobs entry | 10 job context/item/report/exit mapping，安全job路由完整 | 停审并确认完整`7R-06` |
| 18 | `7R-07` | full closure audit + master assembly | 15/15 handoff、42/42 entry、13/13 relay、六blocker和跨模块差集均0 | Step 7正式停审 |

外部审查只发生在完整`7R-01`、`7R-02`、`7R-03`、`7R-04`、`7R-05`、`7R-06`和`7R-07`产物完成后。
产物内任务连续执行，但每完成一项必须立即更新`/tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md`。
若发现Step 6缺口，必须暂停并重开Step 6；若只发现当前产物缺口，则留在当前产物修正。

### 8.1 三级粒度与停止点

| 等级 | Step 7适用面 | 必须写入 | 明确停止点 |
|---|---|---|---|
| `L1 主流程完整设计` | identity、resource limits、filesystem/network/process/workspace boundary、launch policy、run、capture、handoff、lease/cleanup/reaper/release inspection和security redline | exact typed I/O、字段来源与可选性、callable/port、UoW/Version、idempotency/stored replay、state trigger、invariant、安全失败和禁止项 | 不把schema、事务、状态或safe default留给实现者选择。 |
| `L2 保障契约设计` | 普通validation/not-found/retry、audit、observability hook、运维read和非安全maintenance | owner、typed I/O类别、触发点、最小状态影响、safe default、升级L1条件和禁止反写主体truth | 不逐错误variant展开完整flow，不复制L1 schema，不设计审计存储或穷举测试矩阵。 |
| `L3 过程轮廓设计` | 本Step的审查、closure report和下游handoff | 范围、Gate、owner、产物、失败路由和禁止伪造 | 不进入callable正文，不逐case或evidence slot展开。 |

lease expiry、cleanup/reaper failure、release unknown、partial handle、commit unknown、silent isolation degrade、
capture partial、handoff no-rollback和redline均自动按`L1`处理，不得因其属于“异常”而降级为保障摘要。

---

## 9. `S7H-01~15`分配矩阵

| handoff | owner批次 | closure evidence |
|---|---|---|
| `S7H-01` 10 Command | `7R-01A` | 10 exact input/output/method或closed variant mapping |
| `S7H-02` 13 Query | `7R-01B` + `7R-04A` | 13 callable + exact read/index surface |
| `S7H-03` 9 Consumer | `7R-01C` | 9 source/authority/dedup/receipt mapping |
| `S7H-04` 10 Job | `7R-01D` + `7R-04` | 10 selection/item/finalizer/report mapping |
| `S7H-05` entry adapter | `7R-06A~C` | api/worker/jobs 42/42 exact mapping |
| `S7H-06` UoW/clock/ID | `7R-02A` | core types、identity allocation和rollback rules |
| `S7H-07` mutable truth repositories | `7R-02B` | 20/20 owner read/write/CAS/UoW |
| `S7H-08` immutable repositories | `7R-02C` | 13/13 owner get/append/source relation |
| `S7H-09` idempotency/stored surface | `7R-02D` | channel+operation+key+digest和typed replay symmetry |
| `S7H-10` audit/relay repositories | `7R-02C` | append/draft/finalize/pending/attempt Version |
| `S7H-11` resolver family | `7R-03A` | typed finite resolution outcome、body-free boundary |
| `S7H-12` isolation lifecycle | `7R-03B` | establish/launch/inspect/release独立port |
| `S7H-13` capture/handoff/publisher | `7R-03C` | per-target finite outcome和typed observation |
| `S7H-14` read maintenance | `7R-04A~B` | exact index/body input/whole-group writer/no-write query |
| `S7H-15` runtime assembly | `7R-04B` + `7R-05` | 18-slot availability、generation、binding parity |

---

## 10. Blocker关闭责任矩阵

| Blocker ID | current status | primary owner | 关闭证据 | Step 7结束要求 |
|---|---|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-INPUT-001` | resolved_in_7r_01_wait_review | `7R-01A~D` | 42/42 application input/output exact定义；undefined positive `*Input`=0；字段来源/optionality/error完整 | resolved |
| `SBX-DDD-GRANULARITY-STEP7-DISPATCH-001` | partial_service_42_of_42 | `7R-01` + `7R-06` | service侧42/42已闭合；仍需entry adapter双向唯一映射，无string/topic/opaque dispatch | resolved |
| `SBX-DDD-GRANULARITY-STEP7-REF-001` | resolved_in_7r_02d | `7R-02A~D` | `SandboxOpaqueRef`用于current callable=0；旧version wrapper=0；named ref/core Version、stored replay与bounded index join完整 | resolved |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | open_in_7r_m0 | `7R-03` + `7R-05` | 每adapter finite outcome到typed observation/application result映射，direct status write=0 | resolved |
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | open_in_7r_m0 | `7R-04` | exact selector/index/bundle key/body-free input/whole-group writer，Query zero-write | resolved |
| `SBX-DDD-GRANULARITY-STEP7-ENTRY-001` | open_in_7r_m0 | `7R-06` | 42 entry context/selector/status/result/receipt/report关系完整，module error exhaustive | resolved |

六项均为Step 7内部blocker，不升级为L1/L2 blocker。任一状态非`resolved`时，`7R-07`必须失败，Step 8
保持`blocked_by_step_7_regression`。

---

## 11. 模块执行顺序与边界

| 顺序 | module | Step 7职责 | 停审关注点 |
|---:|---|---|---|
| 1 | `contracts` | 不定义port；只验证current callable引用的public/shared carrier归属 | 反向依赖domain/application/infra为0；不新增同义ref/status。 |
| 2 | `domain` | 不定义repository/external port；只提供Step 6 object-owned callable/error | repository/config/adapter引用为0；generic state error替代为0。 |
| 3 | `application` | service facade、UoW、repository、resolver和external port唯一trait owner | exact I/O/error/async/read-write/version/UoW/idempotency完整。 |
| 4 | `infra` | 实现application port、runtime assembly与fake/durable parity | provider type不泄漏；fake可制造所有finite outcome。 |
| 5 | `api` | command/query entry context和mapping | 不访问repository/domain transition；23/23 entry mapping。 |
| 6 | `worker` | 9 consumer、fulfillment和relay entry mapping | source authority、receipt、loop result；不吸收tools/runtime/member语义。 |
| 7 | `jobs` | 10 one-shot job context/item/report/exit mapping | 不扫描repository私有state；job不伪装command。 |

依赖方向保持：

```text
core-contracts <- contracts <- domain <- application <- infra
                                             ^
                                             |
                                    api / worker / jobs
```

`api/worker/jobs -> infra`只允许startup wiring；业务callable只指向application facade。entry模块之间不得互调。

---

## 12. 下游冻结与失效传播

| downstream | current state | `7R-M0`期间允许动作 | 禁止动作 |
|---|---|---|---|
| Step 8 | historical reviewed / blocked | 只读冲突和protocol inventory | 修改DTO/schema或解决actor authority |
| Step 9 | historical reviewed / blocked | 只读required callable/order | 修改flow或把旧signature当current |
| Step 10 | historical reviewed / blocked | 只读trigger/read需求 | 修改state matrix或计数 |
| Step 11~18 | downstream revalidation pending | 登记受影响面 | 写pass结论或定向修正文 |
| 正式`03~07` | historical reviewed / revalidation pending | 不修改 | 把current calibration摘要直接patch入正式正文 |
| implementation ledger | `CB-SBX-01A blocked / wait_design` | 只同步design recovery point | 修改boundary status、Gate、allowed scope或skeleton |
| target repo | absent / not activated | 不创建、不写代码 | commit/run/test/evidence/acceptance事实 |

Step 7回归会影响historical Step 8 protocol-to-service mapping、Step 9 identifier/signature join、Step 11
persistence surface和`07` boundary references。这些只登记为downstream revalidation pending，不能在Step 7
尚未完成时并行修补。

---

## 13. 正式回填草稿

本节只固定未来Step 7完成后的装配结构，不修改正式`03-详细设计.md`，也不预写尚未产生的trait签名。

| 正式位置 | future current source | 必须装配 | 不得装配 |
|---|---|---|---|
| §5 `contracts/domain`模块trait边界 | `7R-07` module audit | 明确两模块不拥有repository/external port、只暴露shared/object-owned callable | historical generic `DomainError`或port候选。 |
| §5 `application` Trait/Port | `7R-01~04` | service、UoW、repository、resolver/external/read/runtime trait的exact Rust contract | 16个悬空input、opaque ref、旧version wrapper。 |
| §5 `infra` Adapter | `7R-05` | 每trait实现位置、finite outcome、raw cause containment和fake/durable parity | provider/SDK type穿透、族级“等价”摘要。 |
| §5 `api/worker/jobs` entry adapter | `7R-06` | 42/42 context/input/output/error mapping与直接访问禁止项 | generic mapper、按route/topic/string分派。 |
| §6 Trait/Port/Adapter索引 | `7R-07` registry | 名称、类型、owner、planned path和唯一definition section | 新设计判断或第二套method signature。 |

正式正文必须按七模块展开完整收口契约，不能只引用calibration文件要求实现者自行拼接。过程性批次表、
blocker历史和停审记录留在calibration，不进入正式正文。

---

## 14. 待确认事项与后续owner

| item | current disposition | exact owner | 是否阻塞`7R-M0` |
|---|---|---|---:|
| 42 entry采用独立method还是closed dispatch enum | 默认逐协议独立method；只有完整typed variant和exhaustive mapping才能采用closed dispatch | `7R-01` | 否；必须在`7R-01A`开工时固定 |
| 16个historical input名称是否保留 | 仅作候选；按current Step 6字段来源逐个重建，可重命名但需登记old-to-current mapping | `7R-01` | 否 |
| 13 Query direct selector | 每个selector必须有exact read surface；否则留给Step 8删除protocol surface，不能“接受但永远拒绝” | `7R-01B` + `7R-04A` | 否 |
| repository trait拆分粒度 | 按mutable/immutable owner、UoW grouping和read/write parity决定，不继承historical大trait | `7R-02` | 否 |
| application-local page/index helper | 只允许支持repository读取；public page DTO由Step 8定义 | `7R-02D` + Step 8 | 否 |
| external finite outcome命名 | 必须复用Step 6 infra outcome或明确typed observation mapper，不能新增domain status | `7R-03` | 否 |
| 18-slot runtime assembly具体trait | exact config carrier仍引用Step 6 runtime summary；真实config key留给Step 14/正式`04` | `7R-04B` | 否 |
| historical actor authority冲突 | P0 worker/job继续core `ActorKind::System` only | Step 8 regression | 否 |
| edition/rust-version/core revision/design baseline | 仍未固定 | implementation Activation | 否；implementation保持blocked |
| 目标实现仓 | 不存在且本轮不创建 | `CB-SBX-01A` Activation | 否；implementation保持blocked |

上述事项均已有later owner，不是新L1/L2 blocker。任何内容批次若发现上游对象能力本身无法支持exact
callable，才触发Step 6 reopen；不得把“有later owner”当作继续猜签名的理由。

---

## 15. `7R-M0`完成门禁

| check | expected | current result |
|---|---:|---:|
| Step 6 review consumed | 1 | 1 |
| historical Step 7 current authority revoked | 1 | 1 |
| current artifact owner | 8 | 8 planned unique |
| serial content/audit batches | 19 rows | 19 unique ordered rows |
| `S7H` allocation | 15 | 15/15 |
| Step 7 blocker owner | 6 | 6/6 |
| module order | 7 | 7/7 |
| new L1/L2 blocker | 0 | 0 |
| formal doc / Step 8 / skeleton / code modification | 0 | 0 |

完成状态同步后，本批恢复口径必须为：

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-M0
current_batch = 7R-M0 regression control completed_wait_user_review
step_status = reopened_control_ready
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_7R_01_service_facades
upstream_step_6 = review_confirmed_consumed_by_7R_M0
historical_step_7 = reviewed_invalidated_by_design_reopen
handoff_groups = 15/15_allocated
entry_callable_target = 42/42
outbound_relay_target = 13/13
step_7_internal_blockers = 6/6_open_with_owner
new_l1_l2_blocker = 0
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 16. `7R-M0`静态审计与负向事实

### 16.1 审计口径

修正版静态检查器`/tmp/audit_l4_sandbox_7rm0.pl`读取以下六个current设计输入：

1. 本控制产物；
2. Step 7主控产物；
3. `03_ddd_calibration_flow.md`；
4. `project_execution_ledger.md`；
5. `implementation_execution_ledger.md`；
6. Step 6 handoff assembly。

检查器只解析Markdown中的handoff分配、blocker owner、模块顺序、串行停审批次、产物owner、恢复字段和
scope redline。早期内联检查器因审计器局部变量遮蔽产生的29项`unexpected`不构成设计差异，已废弃且
不得作为门禁结果；修正版对expected set与observed set分别命名后重新执行。

该检查器不是compiler、linter、test runner、runtime probe或evidence producer。结果只证明本次读取的
Markdown控制集合闭合；任一输入后续发生修改，必须重新执行同一审计。

### 16.2 最终结果

修正版以Perl解释器执行，命令退出码为0，最终输出`audit_failures=0`：

| check | expected | observed | unresolved |
|---|---:|---:|---:|
| `S7H` allocation | 15 | 15 | 0 |
| Step 7 blocker owner | 6 | 6 | 0 |
| module order | 7 | 7 | 0 |
| serial review row | 19 | 19 | 0 |
| current artifact owner | 8 | 8 | 0 |
| completed recovery source | 12 | 12 | 0 |
| scope and no-content guard | 6 | 6 | 0 |

这里的`scope and no-content guard`验证三条相邻仓职责红线、implementation冻结口径、控制文件中不存在
current `pub trait`声明且`7R-01`产物尚未创建。它不证明后续42个entry callable、repository、external
port或entry adapter已经闭合；这些内容仍分别由`7R-01~07`负责。

### 16.3 负向事实

| fact | result |
|---|---|
| `7R-M0`定义current trait、method或input schema | 0 |
| `7R-01`内容产物创建 | 0 |
| historical Step 7 trait正文重写 | 0；只在主控物理末尾追加current authority override与恢复口径。 |
| Step 8正文或正式`03~07`本批修改 | 0 |
| implementation boundary skeleton、Gate或allowed scope修改 | 0 |
| 实现仓、实现代码或实现commit创建 | 0 |
| compile、test、run、provider、evidence alias或验收事实 | 0 |
| 新L1/L2 blocker | 0 |

因此本节保留`7R-M0 completed_wait_user_review`时点的审计事实。六个Step 7内部blocker当时仍为
`open_in_7r_m0`；该静态审计不表示Step 7通过或implementation解锁。

---

## 17. `S7-001` current override：三级粒度与加速节奏

用户于2026-07-25以“开始实施”确认继续执行本设计补全计划。该措辞在本仓只消费`S7-GM0`内容审查门，
不构成实现代码、目标仓、boundary activation、commit、run、测试或验收授权。

`S7-001`已完成以下控制同步：

1. `7R-01~07`按完整current产物设置外部停审，产物内A/B/C/D任务连续执行。
2. 每个内部任务仍是可恢复原子项，完成后立即更新`/tmp`计划状态，不以减少停审为由合并事实。
3. L1主流程继续要求exact callable/port/transaction/state/safe failure；L2保障只写最小契约；L3过程只写Gate轮廓。
4. 安全关键异常自动提升为L1，不能按普通异常、审计或维护契约降级。
5. Step 8、正式`03~07`、32件planned boundary skeleton和implementation继续冻结。

当前恢复口径：

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-01D
current_batch = 7R-01D Job callable + 42/42 join
batch_status = in_progress
gate_status = content_in_progress
consumed_review_gate = S7-GM0
completed_control_task = S7-001
completed_content_tasks = S7-01A,S7-01B,S7-01C
next_allowed_action = complete_7R_01D_job_callable_then_stop_at_S7_G01
external_review_gate = S7-G01 after complete 7R-01A~D
step_8 = blocked_by_step_7_regression
step_7_internal_blockers = 6/6_open_with_owner
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## 18. `7R-01` completion override：42/42 callable closed

本节是对前述`7R-M0`和`S7-001`恢复段落的更晚current override；历史段落保留供审计，不再表示当前批次仍在`7R-01D`执行。

| audit | expected | observed |
|---|---:|---|
| Command callable | 10/10 | 10/10；独立method、exact input和typed output。 |
| Query callable | 13/13 | 13/13；access-first、zero-write和bounded result。 |
| Consumer callable | 9/9 | 9/9；source authority、dedup、receipt ownership。 |
| Job callable | 10/10 | 10/10；9 paged + 1 reconciliation-specific。 |
| total application callable | 42/42 | 42/42；canonical selector到service method唯一映射。 |
| positive generic dispatch | 0 | 0；entry adapter尚由`7R-06`闭合。 |
| positive opaque/latest/all-scan path | 0 | 0；仅在禁止项或historical diagnosis中出现。 |
| reconciliation generic finalizer path | 0 | 0。 |

`SBX-DDD-GRANULARITY-STEP7-INPUT-001`在本批关闭，关闭依据是`03_ddd_step_07_service_facades_inputs_outputs.md` §42~§43的42/42 exact input/output join。`DISPATCH-001`只记录service-side `42/42` partial evidence，不能提前关闭；`REF-001`、`OUTCOME-001`、`READ-001`、`ENTRY-001`保持open并沿既定owner前进。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-01 completed_wait_user_review
current_batch = 7R-01 application callable
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_batches = 7R-01A,7R-01B,7R-01C,7R-01D
current_callable_defined = 42/42
input_blocker = resolved_in_7r_01_wait_review
dispatch_blocker = partial_service_42_of_42_wait_7R_06
remaining_step_7_internal_blockers = 5/6 open with owner
next_allowed_action = wait_user_review_before_7R_02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 19. `7R-02A` completion override: consistency foundation closed

本节位于物理文件末尾，是对§1、§17~§18旧恢复快照的current override。`S7-G01`已由用户确认消费，
`7R-02A`只闭合repository前置的一致性基础，不提前声明`7R-02B~D` repository method。

| audit | expected | observed |
|---|---:|---|
| UoW / manager owner | 1 / 1 | application唯一声明，infra durable / fake实现。 |
| trusted clock / optimistic version | core `Timestamp` / core `Version` | local time/version wrapper正向路径均0。 |
| typed allocator methods | 54 | 52/52 canonical named refs集合差集0，另加handoff / relay attempt各1；重复0。 |
| cross-crate checked constructor | 7 / 7 | transaction、versioned snapshot、commit receipt、2 commit carrier、2 cursor均有唯一可调用入口。 |
| transaction termination | confirmed / not committed / unknown | 三分闭合；rollback failed / unknown不得解释为absent。 |
| external call with write UoW | 0 | call前committed recovery point，call后fresh UoW + fresh `Version`。 |
| query / duplicate allocation | 0 / 0 / 0 | write、new identity、cursor分配均为0。 |
| positive old/generic ref path | 0 | old wrapper和generic allocator只存在于historical / forbidden文本。 |
| Markdown fence / trailing whitespace | even / 0 | 本批静态检查通过；不表示Rust编译或测试。 |

cursor复核发现并已定向修复`contracts -> infra`构造可见性：shared types物理末尾§26把两个constructor
统一为public checked `try_from_sequence`。该修复不改变69-row registry、39 status owner、52 named ref、
cursor schema或分配权，不构成新L1/L2上游blocker。`REF-001`仍需`7R-02B~D`的repository、stored result与
index join完成后才能关闭。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02A completed_ready_for_7R_02B
current_batch = 7R-02A UoW / clock / typed ID / core Version
batch_status = completed
gate_status = internal_batch_completed
completed_content_tasks = S7-01A,S7-01B,S7-01C,S7-01D,S7-02A
current_callable_defined = 42/42
typed_identity_allocator = 54/54
canonical_named_ref_join = 52/52
input_blocker = resolved_in_7r_01_wait_review
ref_blocker = in_progress_wait_7r_02b_02d
remaining_step_7_internal_blockers = 5/6 open with owner
new_l1_l2_blocker = 0
next_allowed_action = start_7R_02B
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## 20. `7R-02B` Current Completion Override：control与停审

> 本节位于本文物理末尾，是Step 7 control产物对`S7-02B`的唯一current状态。前文`7R-02A`恢复块和
> `7R-02B in_progress`描述保留为历史轨迹；本节不启动`7R-02C`、Step 8或implementation。

| gate | current result |
|---|---|
| mutable root registry | 20/20 mutable owner -> 19/19 persisted root；`HandoffTargetProgress`不新增repository |
| repository symmetry | 19/19 trait、57/57 exact `get/create/save` methods、21/21 same-UoW groups |
| callable closure | Command 10/10、Query 13/13、Consumer 9/9、Job 10/10；42/42 total |
| first-create reachability | intake reference、capture `C*`、projection first、derived first、failure/cleanup/orphan安全kernel均有唯一owner |
| zero-write / reservation | Query mutable write 0/13；29/29 fresh non-Query callable绑定`reserve_fresh_operation` |
| static hygiene | facade current activation唯一且位于物理EOF；相关产物fence parity为偶数、trailing whitespace为0 |
| blocker | 未发现新L1/L2上游blocker；`REF-001`保持open，等待`7R-02C/02D` |

`S7-02B`的设计内容和静态审计已完成，状态为`completed_wait_user_review`。这只是文档闭合事实，不是compile、test、run、
evidence、验收签署、implementation或commit事实。`S7-G02`尚未完成，用户确认前不得把`7R-02C`标为in-progress。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02B completed_wait_user_review
current_batch = 7R-02B mutable truth repositories
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_content_task = S7-02B
mutable_owner_join = 20/20
logical_repository_root = 19/19
repository_trait = 19/19
repository_method = 57/57
same_uow_group = 21/21
application_callable_join = 42/42
query_mutable_write = 0/13
fresh_idempotency_owner = 29/29
ref_blocker = open_wait_7r_02c_02d
next_allowed_action = wait_user_review_before_7R_02C
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Overlay: `S7-02D` activation

本节位于物理 EOF，优先级高于本文中段的同名历史位置草稿。`S7-02C` 已完成；当前唯一进行中的设计任务是
`S7-02D`。中段同名块只保留为恢复轨迹，不得作为当前状态读取。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = content_in_progress
completed_predecessor = S7-02C immutable / audit / relay repository
current_artifact = 03_ddd_step_07_idempotency_stored_index_repositories.md
required_l1 = fresh claim + typed replay + terminal failure + commit-unknown inspection
required_l2 = bounded selector/index + durable/fake parity
completed_internal_batches = S7-02D-B1,S7-02D-B2
current_internal_batch = S7-02D-B3 typed stored carrier and full surface stores
application_callable = 42/42
fresh_reservation_owner = 29/29
query_write = 0/13
new_l1_l2_blocker = 0
ref_blocker = in_progress_wait_s7_02d
next_allowed_action = write_s7_02d_b3_batch_1
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B3-1` completed, B3-2 next

本节位于物理EOF并覆盖本文全部前置activation。B3-1只完成surface owner/schema；B3-2尚未写typed store trait。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-1
current_internal_batch = S7-02D-B3
next_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
next_allowed_action = write_s7_02d_b3_batch_2
surface_schema = 3/3
new_l1_l2_blocker = 0
ref_blocker = in_progress_wait_s7_02d
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B3-2` completed, B3-3 active

本节位于物理 EOF，覆盖前置 B3-1 activation。B3-2 的 exact persistence port 已由主产物定义并同步：generic carrier
为 `create/get = 2`，三类 typed surface 为 `save/get = 6`，写句柄实际为 `4/4`，读句柄为 `6/6`；当前仍只做 B3-3
交叉校验，不宣称 fresh/duplicate whole-group 已完成。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = content_in_progress
completed_internal_batches = S7-02D-B1,S7-02D-B2
completed_internal_sub_batch = S7-02D-B3-2 typed store exact traits and errors
current_internal_batch = S7-02D-B3
next_internal_sub_batch = S7-02D-B3-3 cross-validation
next_allowed_action = write_s7_02d_b3_batch_3
carrier_method = 2/2
typed_surface_method = 6/6
write_handle = 4/4
read_handle = 6/6
error_family = 4/4
public_callable_added = 0
query_write = 0/13
new_l1_l2_blocker = 0
ref_blocker = in_progress_wait_s7_02d
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B4` completed, B5 gated

本节位于 Step 7 control 物理 EOF，覆盖前置 B3 activation。B4 已关闭 fresh/duplicate/failure/commit-unknown 的
application algorithm与exact inspection，不新增第43个callable、repository method、DTO或public error。

| control item | current result |
|---|---|
| reservation | 29/29 non-Query callable经唯一kernel；reservation commit confirmed前business/external为0 |
| existing classification | conflict / in-flight / completed / failed `4/4` |
| finalizer | replayable completion + terminal failure `2/2` |
| unknown | ReservationOnly / ReplayableCompletion / TerminalFailure `3/3`；FullyCommitted / FullyAbsent / Indeterminate `3/3` |
| deny-set | inspection write/identity/cursor/clock/external `0/0/0/0/0`；duplicate rerun `0` |
| blocker | `S7-02D-INT-04` closed；`INT-05`与`REF-001`等待B5/B6 |
| downstream | `S7-G02`、Step 8、正式 `03~07`、implementation继续冻结 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = user_confirmation_pending_for_internal_batch
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4
completed_internal_batch = S7-02D-B4
next_internal_batch = S7-02D-B5 necessary bounded selector/index and parity join
next_allowed_action = wait_user_confirmation_before_s7_02d_b5
application_callable = 42/42
fresh_reservation_owner = 29/29
query_write = 0/13
public_callable_added = 0
repository_method_added_in_b4 = 0
whole_group_mode = 3/3
whole_group_result = 3/3
S7-02D-INT-03 = closed
S7-02D-INT-04 = closed
S7-02D-INT-05 = open
new_l1_l2_blocker = 0
ref_blocker = open_wait_s7_02d_b5_b6
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B5` completed, B6 gated

本节位于 Step 7 control 物理 EOF，覆盖前置 B4 recovery block。B5 已闭合 necessary bounded selector/index、九个 exact
read-only reader、snapshot-bound cursor、retention redline和fake/durable parity；`7R-02D`整体仍等待B6总closure。

| control item | current result |
|---|---|
| selector / reader | existing selector type `9/9`；exact reader `9/9`；generic/opaque reader `0` |
| capability identity | stable/report identity均为 backend source + immutable requirement ref；同backend多requirement不碰撞 |
| cursor / token | repository cursor可重复只读且绑定immutable snapshot；PageToken codec为encode-only，decode consumer `0` |
| action boundary | index hit后必须exact owner + `Version` + domain eligibility重验；reader write/external/repair/delete为0 |
| callable join | application `42/42`；fresh reservation `29/29`；Query maintenance/write `0/13`；reconciliation reader `0/1` |
| blocker | `S7-02D-INT-05` closed；`REF-001`等待B6完整差集审计，不提前关闭 |
| downstream | B6、`S7-G02`、Step 8、正式 `03~07`、implementation继续冻结 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D in_progress
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = in_progress
gate_status = user_confirmation_pending_for_internal_batch
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5
completed_internal_batch = S7-02D-B5 necessary bounded selector/index and parity join
next_internal_batch = S7-02D-B6 closure audit and recovery-source synchronization
next_allowed_action = wait_user_confirmation_before_s7_02d_b6
maintenance_selector = 9/9
maintenance_reader = 9/9
capability_target_identity = backend_source_plus_requirement_ref
page_token_codec_surface = encode_only
page_token_decode_consumer = 0
application_callable = 42/42
fresh_reservation_owner = 29/29
query_maintenance_index = 0/13
query_write = 0/13
reconciliation_paged_reader = 0/1
S7-02D-INT-05 = closed
new_l1_l2_blocker = 0
ref_blocker = open_wait_s7_02d_b6
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-02D-B6` completed, `S7-G02` pending

本节位于 Step 7 control 物理 EOF，覆盖 B5 recovery block。B6 已完成 B1~B5 current authority的集合差集、
正式回填草稿和恢复源同步；它不代表用户已通过 `S7-G02`，也不启动 `7R-03A`。

| control closure | current result |
|---|---|
| B1~B6 | `6/6 completed`；B3内部批`4/4 completed` |
| internal item | `S7-02D-INT-01~05 = 5/5 closed` |
| exact repository sets | idempotency `5/5`、carrier `2/2`、typed surface `6/6`、reader `9/9` |
| callable join | application `42/42`、fresh reservation `29/29`、Query maintenance/write `0/13` |
| identity/version join | named ref/core `Version` positive gap `0`；`REF-001 resolved_in_7r_02d` |
| remaining Step 7 blocker | `DISPATCH/OUTCOME/READ/ENTRY = 4/6 open with owner` |
| downstream | `S7-G02` user review pending；Step 8、正式`03~07`、implementation继续冻结 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02D completed_wait_user_review
current_batch = S7-02D idempotency / stored result / bounded index
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_internal_batches = S7-02D-B1,S7-02D-B2,S7-02D-B3,S7-02D-B4,S7-02D-B5,S7-02D-B6
current_internal_batch = none
internal_items = 5/5_closed
application_callable = 42/42
fresh_reservation_owner = 29/29
query_maintenance_index = 0/13
query_write = 0/13
ref_blocker = resolved_in_7r_02d
remaining_step_7_internal_blockers = 4/6_open_with_owner
next_gate = S7-G02 user review of 7R-02A~D
next_allowed_action = wait_user_review_before_s7_g02
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Draft (superseded): `S7-03A` completed, `S7-03B` pending

本节曾位于 Step 7 control 物理 EOF，是 `S7-03A` 的历史恢复点。用户确认后已进入 `S7-03B`；当前唯一权威恢复源
为本文物理 EOF 的 `S7-03B` override。它只关闭 `S7-03A` 内容任务，不关闭完整 `7R-03`、其余 Step 7 blocker、正式文档或 implementation。

| control item | current result |
|---|---|
| completed task | `S7-03A identity/reference/policy/capability resolver` |
| current artifact | `03_ddd_step_07_resolver_ports.md` |
| trait closure | application-owned async resolver port `4/4`；infra durable/fake implementer boundary explicit |
| relation closure | source carrier、required/deferred、policy binding/gap、marker lineage、pending-gap、capability target与freshness均闭合 |
| capability closure | canonical verdict `10/10`；classification priority为`Invalid > Stale > Unsupported > Unknown > Fresh` |
| static closure | fence parity `0`；table mismatch `0`；public contract Rustdoc gap `0`；body/SDK/raw-response positive field `0`；direct domain-truth return `0` |
| open blocker | `DISPATCH/OUTCOME/READ/ENTRY = 4/6 open with owner`；`OUTCOME-001`等待`S7-03B/C`与`S7-05` |
| current gate | `S7-03A user_review_pending` |
| next allowed action | 用户确认后只读取并启动`S7-03B establish/launch/inspect/release ports` |
| downstream | `S7-03C`、Step 8、正式`03~07`、implementation和boundary skeleton继续冻结 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03A completed_wait_user_review
current_batch = S7-03A identity/reference/policy/capability resolver
batch_status = completed_wait_user_review
gate_status = user_review_pending
current_task = none
completed_task = S7-03A
next_task = S7-03B establish/launch/inspect/release ports
next_allowed_action = wait_user_review_before_s7_03b
S7-03A_trait_closure = 4/4
S7-03A_policy_partition = closed
S7-03A_pending_gap_relation = closed
S7-03A_capability_verdict = 10/10
S7-03A_direct_domain_truth_return = 0
remaining_step_7_internal_blockers = 4/6_open_with_owner
outcome_blocker = open_partial_resolver_only
new_l1_l2_blocker = 0
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Draft (superseded): `S7-03B` in progress

本节曾位于 Step 7 control 物理 EOF，现保留为历史执行轨迹。当前只处理 establish、launch、inspect、release 四组
lifecycle port；resolver、capture、handoff、observability和entry adapter不在本批内。物理 EOF 的 `S7-03B` completed override 才是 current authority。

| control item | current result |
|---|---|
| current task | `S7-03B establish/launch/inspect/release ports` |
| predecessor | `S7-03A` user review confirmed |
| current artifact | `pending_create_03_ddd_step_07_lifecycle_ports` |
| required closure | exact request/outcome/error、correlation、unknown、guard/factory mapping、fake/durable parity |
| current gate | `design_in_progress`; implementation remains blocked |
| open blockers | `DISPATCH/OUTCOME/READ/ENTRY = 4/6 open with owner` |
| next allowed action | write and audit `S7-03B` only; do not start `S7-03C` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03B in_progress
current_batch = S7-03B establish/launch/inspect/release ports
batch_status = in_progress
gate_status = design_in_progress
current_task = S7-03B establish/launch/inspect/release ports
completed_task = S7-03A
next_task = complete S7-03B only
next_allowed_action = write_s7_03b_lifecycle_ports_only
S7-03B_port_families = 4
S7-03B_exact_contracts = 0/4
S7-03B_static_audit = not_started
remaining_step_7_internal_blockers = 4/6_open_with_owner
new_l1_l2_blocker = 0
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## EOF Current Recovery Override: `S7-03B` completed, user review pending

本节位于 Step 7 control 产物物理 EOF，是 `S7-03B` 当前唯一权威恢复源。它消费 lifecycle、repository、facade 和 Step 6
run overlay 的物理 EOF；前部同名段均为 `historical_material`。本批已完成内容闭合，但用户复核前不得进入 `S7-03C`。

| control item | current result |
|---|---|
| current task | `S7-03B establish/launch/inspect/release ports` |
| content status | `completed` |
| review status | `user_review_pending` |
| lifecycle trait families | `4/4`：establishment、launch、lifecycle inspection、guarded release |
| async methods | `6/6`：establishment `2`、launch `2`、inspection `1`、release `1` |
| launch side-effect result | `2/2`：`Launched`、`BackendLaunchFailed` |
| launch inspection disposition | `5/5`：`Launched`、`BackendLaunchFailed`、`NotLaunched`、`Unavailable`、`Conflicted` |
| canonical lifecycle observation | `4/4`：`ObservedPresent`、`ReleaseConfirmed`、`Unavailable`、`Conflicted` |
| release definitive sources | `3/3`；只有同一 authorization 下的 typed source可形成 failure basis |
| launch failure identity | `ControlledRunIdentityBundle`预生成；`Preparing` run、terminal failure、inspection和recovery复用同一ref |
| reservation/UoW ordering | reservation-only commit -> run preparation commit -> external call outside UoW -> finalization UoW |
| `BackendLaunchFailed` transition | typed observation -> marker -> marker set -> `classify` -> `require_run_failure_basis` -> `mark_failed`; 不调用`mark_terminal` |
| generic/direct launch signature difference | `0` |
| public SDK/raw body/provider error positive fields | `0` |
| tools/runtime/member semantic execution positive fields | `0` |
| durable/fake parity obligation | `8/8` dimensions recorded; no implementation/test execution claimed |
| new L1/L2 blocker | `0` |
| existing Step 7 blockers | `DISPATCH/OUTCOME/READ/ENTRY = 4/6 open with owner`; `OUTCOME-001`等待`S7-03C`与`S7-05` |

### Current source join

| source | current authority consumed |
|---|---|
| Step 6 run identity | `03_ddd_step_06_object_contracts_policy_run_capture.md` physical EOF `S7-03B` overlay |
| lifecycle contract | `03_ddd_step_07_lifecycle_ports.md` physical EOF `S7-03B` completed package |
| repository/UoW | `03_ddd_step_07_repositories_uow_indexes.md` physical EOF `S7-03B` overlay |
| facade algorithm | `03_ddd_step_07_service_facades_inputs_outputs.md` physical EOF `S7-03B` overlay |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-03B completed_wait_user_review
current_batch = S7-03B establish/launch/inspect/release ports
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_task = S7-03A,S7-03B
current_task = none
next_task = S7-03C capture/handoff/publisher/observability hooks
next_allowed_action = wait_user_review_before_s7_03c
S7-03B_exact_contracts = 4/4
S7-03B_async_methods = 6/6
S7-03B_launch_result_kinds = 2/2
S7-03B_launch_inspection_dispositions = 5/5
S7-03B_canonical_lifecycle_observations = 4/4
S7-03B_release_definitive_sources = 3/3
S7-03B_static_audit = completed
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

---

## EOF Current Control Delta: `7R-06C-3` completed

本节是 Step 7 control 文件的物理 EOF current authority，仅更新 blocker 控制面。此前 `S7-03B` 恢复段继续作为其 owner
正文，但其中 `4/6 open` 是历史快照。

| control item | current result |
|---|---|
| `DISPATCH-001` | `resolved_in_7r_06c_3`；42/42 logical、47/47 physical、16 runtime negative、12 static forbidden 已闭合 |
| `ENTRY-001` | `resolved_in_7r_06c_3`；context/source/result/error/read-write boundary 已闭合，current error=`7/12/16` |
| `OUTCOME-001` | open；owner 仍为 `7R-03C + 7R-05` |
| `READ-001` | open；下一 owner 为 `7R-04A` |
| Step 7 gate | blocked；不能因 `7R-06` 完成而进入 Step 8 |
| scope discipline | 主流程保持可落码粒度；异常、审查、观测、测试和交付只保留必要 gate |

```text
current_plan_version = v5.8-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06 completed_wait_user_review
current_batch = 7R-06C-3 negative dispatch audit and closure gate
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_task = 7R-06A,7R-06B,7R-06C-1,7R-06C-2,7R-06C-3
current_task = none
next_task = 7R-04A exact read and maintenance surface
next_allowed_action = wait_user_review_before_7r_04a
tracked_tasks = 108_unique
task_status = 43_completed,0_in_progress,62_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
remaining_step_7_internal_blockers = 2/8_open_with_owner
remaining_step_7_primary_blockers = 2/6_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Control Delta: `7R-05-B3-C2` completed, `C3` current

本节覆盖本文旧的 C2 in-progress 状态。C2 只完成 handoff adapter/fake 方法级设计静态 parity；C3 尚未产出，当前先经过 legacy
material/observability 负向审计的来源读取门。Step 7、正式 `03`、Step 8 和 implementation 继续冻结。

```text
current_plan_version = v7.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C3 legacy material/observability negative audit (source-read gate)
completed_internal_tasks = 7R-05-B3-C1|7R-05-B3-C2
pending_internal_tasks = 7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
gate_status = in_progress
gate_reason = C2 complete; C3-C5 method groups and B4-B5 closure remain
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
next_required_reads = 详细设计讨论中间产物规范.md|详细设计讨论流程_SOP.md|03_ddd_step_07_capture_handoff_publisher_observability.md|03_ddd_step_07_infra_adapters_fake_parity.md|project_execution_ledger.md|implementation_execution_ledger.md
next_allowed_action = read_7r_05_b3_c3_sources_then_write_legacy_negative_audit
```

## EOF Current Control Delta: `7R-05-B3-C1` completed, `C2` in progress

本节是 Step 7 control 的物理 EOF current authority。C1 只关闭 capture method group 的 design-static parity；`OUTCOME-001`
仍开放，B3 其余方法组未完成。无运行、测试、provider conformance、evidence、验收或 commit 声明。

| control item | current result |
|---|---|
| `7R-05-B3-C1` | `completed_design_static_only` |
| `7R-05-B3-C2` | `in_progress`; handoff delivery and same-attempt inspection |
| `7R-05-B3-C3~C5` | `pending` |
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | `resolved_in_7r_04a_design_static_only` |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | `open_wait_7r_05_b3_b5` |
| new L1/L2 upstream blocker | `0` |
| formal `03-详细设计.md` | frozen; writeback forbidden |

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C2 handoff method group
completed_internal_tasks = 7R-05-B3-C1
pending_internal_tasks = 7R-05-B3-C2|7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5
gate_status = in_progress
gate_reason = C1 complete; C2~C5 and B5 closure remain
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001
new_public_status_or_stored_kind_or_repository_or_identity = 0/0/0/0
application_callable = 42/42_unchanged
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_7r_05_artifact|capture_handoff_current|step7_flow_current|project_execution_ledger_current|implementation_ledger_current|reopen_plan_current
next_allowed_action = write_7r_05_b3_handoff_method_group
```

---

## EOF Current Control Delta: `7R-04A-A1` inventory completed

本节取代 `7R-06` completed control delta，成为 Step 7 control 的物理 EOF current authority。用户已消费 `7R-06`
复核门，`7R-04A` 现已完成 A1 inventory，但 exact reader、outcome/writer 和 blocker closure 尚未开始。

| control item | current result |
|---|---|
| public Query inventory | logical/facade/input/output=`13/13` |
| carrier classification | full reuse `5`、partial extension `7`、new formal carrier `1` |
| paged maintenance reader | existing `9/9` preserved；public Query use=`0/13` |
| `READ-001` | open；A2 exact reader、A3 outcome/writer、A4 closure audit pending |
| `OUTCOME-001` | open；不属于 `7R-04A-A1` |
| Step 7 gate | blocked；不得进入 Step 8 |

```text
current_plan_version = v5.9-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_batch = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A1 current inventory completed_wait_user_review
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
batch_status = completed_wait_user_review
gate_status = content_in_progress_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = pending
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_inventory = 13/13
carrier_reuse_partial_new = 5/7/1
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/13
next_task = 7R-04A-A2 execution/boundary/policy exact reader contracts
next_allowed_action = wait_user_review_before_7r_04a_a2
tracked_tasks = 108_unique
task_status = 43_completed,1_in_progress,61_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
remaining_step_7_internal_blockers = 2/8_open_with_owner
remaining_step_7_primary_blockers = 2/6_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Control Delta: `7R-04A-A2-F1` completed

本节取代 A1 control delta，成为 Step 7 control 的物理 EOF current authority。A2 第一 family 已建立
execution/boundary/policy 三个 Query 的 exact reader/index/bundle contract；后四个 family与A3/A4仍未完成。

| control item | current result |
|---|---|
| consumed gate | `7R-04A-A1 completed_wait_user_review` |
| completed family | `A2-F1 execution/boundary/policy` |
| request / method / outcome / source | `3/3 | 3/3 | 3/3 | 3/3` |
| selector variants | execution `1` + boundary `2` + policy `2` = `5/5` |
| access / snapshot | permitted request first；one fair committed snapshot；write UoW=`0` |
| absence/integrity | typed proof only；current `>1`、owner mismatch、dangling binding、half-commit downgrade=`0` |
| forbidden read alias | generic/alias/wildcard/latest/`Option<View>`=`0/0/0/0/0` |
| `READ-001` | open；A2-F2~F5、A3 writer/outcome与A4 closure audit pending |
| `OUTCOME-001` | open；本family不裁决 |
| Step 7 gate | blocked；不得进入Step 8或正式正文回填 |

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_batch = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A2-F1 execution/boundary/policy completed_wait_user_review
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
batch_status = completed_wait_user_review
gate_status = content_in_progress_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = in_progress_1_of_5_families_completed
a2_f1_execution_boundary_policy = completed
a2_f2_capture_handoff = pending
a2_f3_failure_cleanup_redline = pending
a2_f4_projection_derived_comparison = pending
a2_f5_reconciliation_audit = pending
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_reader_coverage = 3/13
selector_variant_coverage = 5/5_for_completed_family
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/3_completed_family
next_task = 7R-04A-A2-F2 capture/handoff exact reader contracts
next_allowed_action = wait_user_review_before_7r_04a_a2_f2
tracked_tasks = 108_unique
task_status = 43_completed,1_in_progress,61_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
remaining_step_7_internal_blockers = 2/8_open_with_owner
remaining_step_7_primary_blockers = 2/6_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Control Delta: `7R-04A-A2-F2` completed

本节取代 A2-F1 control delta，成为 Step 7 control 的物理 EOF current authority。A2 第二 family 已闭合
capture/handoff 两个 Query 的 exact reader、index、whole-group source 与 facade mapping；后续 family、A3/A4均未开始。

| control item | current result |
|---|---|
| consumed gate | `7R-04A-A2-F1 completed_wait_user_review` |
| completed family | `A2-F2 capture/handoff` |
| request / method / outcome / source | `2/2 | 2/2 | 2/2 | 2/2`；累计 Query reader=`5/13` |
| selector variants | capture `Exact + ForRun`、handoff `Exact + CurrentForContext`=`4/4`；累计=`9/9` |
| access / snapshot | matching permitted request first；one fair committed snapshot；technical read failure不伪装absence/degraded |
| read boundary | Query write/UoW/identity/repair/external/business-audit=`0/0/0/0/0/0` |
| integrity | owner/cardinality/dangling binding/unknown child/half-commit/cursor relation损坏均为typed error |
| `READ-001` | open；A2-F3~F5、A3 writer/outcome与A4 closure audit pending |
| `OUTCOME-001` | open；本family不裁决 |
| Step 7 gate | blocked；不得进入Step 8或正式正文回填 |

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_batch = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A2-F2 capture/handoff completed_wait_user_review
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
batch_status = completed_wait_user_review
gate_status = content_in_progress_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = in_progress_2_of_5_families_completed
a2_f1_execution_boundary_policy = completed
a2_f2_capture_handoff = completed
a2_f3_failure_cleanup_redline = pending
a2_f4_projection_derived_comparison = pending
a2_f5_reconciliation_audit = pending
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_reader_coverage = 5/13
selector_variant_coverage = 9/9_for_completed_families
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/5_completed_queries
next_task = 7R-04A-A2-F3 failure/cleanup/redline exact reader contracts
next_required_reads = current_artifact_physical_EOF|service_facade_22_3_24_3|step6_failure_control_cleanup_redline_source_lookup_contracts|bounded_page_and_committed_snapshot_contract
next_allowed_action = wait_user_review_before_7r_04a_a2_f3
tracked_tasks = 108_unique
task_status = 43_completed,1_in_progress,61_pending,1_blocked
task_status_classification_sum = 106; historical_delta_to_tracked_tasks = 2; preserve_until_task_register_audit
remaining_step_7_internal_blockers = 2/8_open_with_owner
remaining_step_7_primary_blockers = 2/6_open_with_owner
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Control Delta: `7R-04A-A4-P1` completed, P2 in progress

本节取代 A2-F2 control delta，成为 Step 7 control 的物理 EOF current authority。A4-P1 已完成 13 个 Query 的正向
owner/source/reader/consumer total audit；A4-P2 仍需反向审计 maintenance/materialization/global registry，因此
`READ-001` 继续 open。

```text
current_plan_version = v7.2-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_batch = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A4-P2 reverse maintenance/materialization/global registry audit
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
batch_status = in_progress
gate_status = in_progress
a1_inventory = completed
a2_exact_reader_contracts = completed
a3_outcome_writer_boundary = completed
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = in_progress
a4_p3_read_blocker_ruling_and_sync = pending
query_reader_coverage = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/13
materialization_source_consumer_closure = 11/11
mutable_logical_roots = 19/19_unchanged
same_uow_groups = 21/21_unchanged
application_callable = 42/42_unchanged
query_write = 0/13
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
next_required_reads = current_artifact_108|maintenance_selector_registry|materialization_owner_registry|repository_root_uow_registry|callable_registry
next_allowed_action = complete_A4_P2_reverse_audit_only
```

## EOF Current Control Delta: `7R-04A-A4-P2` completed, P3 user review pending

本节是 Step 7 control artifact 的物理 EOF current authority。A4-P2 已对 maintenance reader、materialization writer、root、
same-UoW group、callable 和 forbidden set 完成反向差集审计；`READ-001` 仍保持 open，等待 A4-P3 裁决。此处不产生实现或测试
事实，也不允许正式 `03` 回填。

```text
current_plan_version = v7.3-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_batch = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A4-P2 reverse maintenance/materialization/global registry audit completed_wait_user_review
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
batch_status = completed_wait_user_review
gate_status = content_completed_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = completed
a3_outcome_writer_boundary = completed
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = completed
a4_p3_read_blocker_ruling_and_sync = pending_user_review
query_reader_coverage = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
existing_maintenance_reader = 9/9_preserved
maintenance_reader_job_consumer = 9/9
maintenance_reader_orphan = 0
maintenance_reader_duplicate = 0
query_maintenance_reader_use = 0/13
maintenance_reader_reconciliation_use = 0/1
materialization_source_consumer_closure = 11/11
materialization_writer_duplicate_owner = 0
mutable_logical_roots = 19/19
repository_method_reachability = 57/57
same_uow_groups = 21/21
new_same_uow_group = 0
application_callable = 42/42_unchanged
new_application_callable = 0
query_write = 0/13
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_109|step7_flow_current|project_ledger_current|implementation_ledger_current|reopen_plan_current
next_allowed_action = wait_user_review_before_A4_P3
```

## EOF Current Control Delta: `7R-04A-A4-P3` completed, `READ-001` resolved, user review pending

本节是 Step 7 control artifact 的物理 EOF current authority。A4-P3 消费 read artifact §110 的 SOP 回答、正反向证据矩阵和
design-static ruling；它只关闭 read/maintenance 设计缺口，不把 conformance、编译、测试、provider、run、evidence、验收或
commit 写成已发生事实。正式 `03-详细设计.md` 继续冻结。

| blocker | previous state | A4-P3 current evidence | current state |
|---|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | `open_wait_A4-P3_ruling` | Query=`13/13`；field source=`104/104`；maintenance reader=`9/9` unique Job；materialization=`11/11`；root/method/group/callable=`19/19`,`57/57`,`21/21`,`42/42`；forbidden positive=`0` | `resolved_in_7r_04a_design_static_only` |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | `open_wait_s7_03c_s7_05` | A4-P3 不拥有 capture/handoff/publisher 或 infra/fake parity | `open_wait_s7_03c_s7_05` |
| `BLK-SBX-CANONICAL-001` | open implementation gate | read static closure不改变 canonical writer/verifier前置 | open |

```text
current_plan_version = v7.4-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_batch = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A4-P3 READ-001 ruling and recovery-source synchronization completed_wait_user_review
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
batch_status = completed_wait_user_review
gate_status = content_completed_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = completed
a3_outcome_writer_boundary = completed
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = completed
a4_p3_read_blocker_ruling_and_sync = completed_wait_user_review
query_reader_coverage = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
existing_maintenance_reader = 9/9_preserved
maintenance_reader_job_consumer = 9/9
maintenance_reader_orphan = 0
maintenance_reader_duplicate = 0
query_maintenance_reader_use = 0/13
maintenance_reader_reconciliation_use = 0/1
materialization_source_consumer_closure = 11/11
materialization_writer_duplicate_owner = 0
mutable_logical_roots = 19/19
repository_method_reachability = 57/57
same_uow_groups = 21/21
new_same_uow_group = 0
application_callable = 42/42_unchanged
new_application_callable = 0
query_write = 0/13
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001|SBX-DDD-GRANULARITY-STEP7-READ-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
read_blocker_status = resolved_in_7r_04a_design_static_only
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = step7_outcome_current|step7_cross_audit_current|project_execution_ledger_current|implementation_ledger_current|reopen_plan_current
next_allowed_action = wait_user_review_before_next_step7_owner
```

## EOF Current Control Delta: `7R-05-B1` completed, user review pending

本节是 Step 7 control 的物理 EOF current authority。A4-P3 复核门已消费，`S7-03C` component 已完成；`7R-05-B1` 只建立 infra durable/fake parity 的 owner、范围和共同边界，`OUTCOME-001` 继续等待 B2~B5。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B1 source map, SOP answers and owner boundary completed_wait_user_review
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
gate_status = content_completed_wait_user_review
completed_internal_batches = 7R-05-B1
pending_internal_batches = 7R-05-B2,7R-05-B3,7R-05-B4,7R-05-B5
s7_03c_status = completed_review_consumed
read_blocker_status = resolved_in_7r_04a_design_static_only
outcome_blocker_status = open_wait_7r_05_b2_b5
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_public_status_or_stored_kind = 0
new_repository_or_identity = 0
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_outcome_owner_in_progress
next_allowed_action = wait_user_review_before_7r_05_b2
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## PHYSICAL EOF Current Recovery Override: `7R-05-B3-C3` completed, C4 gated

这是本文物理 EOF 的最终控制覆盖。C3 的静态负向审计已完成并等待用户复核；C4 publisher method seam 不得自动开始。当前
application callable、status、stored kind、repository、identity 和既有 UoW 数量均保持不变。

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
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_public_callable = 0
new_public_status_or_stored_kind_or_repository_or_identity = 0/0/0/0
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = wait_user_review_before_7r_05_b3_c4
```

## PHYSICAL EOF Current Control Override: `v7.8`

Step 7 outcome owner 已按 `03_ddd_step_07_infra_adapters_fake_parity.md` §§23~24完成设计静态收口。此前 C3 review gate、`formal_03_writeback = forbidden` 和 `OUTCOME-001 open` 均为 historical execution snapshots,由本节覆盖。

```text
current_plan_version = v7.8-closeout
current_step = Step 7 regression closeout
completed_internal_tasks = 7R-05-B1|7R-05-B2|7R-05-B3-C1|7R-05-B3-C2|7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
step_7_outcome_blocker = resolved_for_design_static_closeout
step_7_read_blocker = resolved_in_7r_04a_design_static_only
new_public_callable = 0
new_public_status_or_stored_kind_or_repository_or_identity = 0/0/0/0
formal_03_writeback = allowed_for_reassembly
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = reassemble_formal_03_and_propagate_downstream_design_only
```
