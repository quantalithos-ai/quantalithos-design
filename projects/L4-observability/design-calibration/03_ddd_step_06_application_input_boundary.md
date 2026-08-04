# L4-observability 03-详细设计 Step 06 - R06.6 application 输入边界与对象 inventory

> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 当前模式: full-restart 定向粒度修复
> 当前子批次: `R06.6` 输入边界（已消费）
> 当前状态: `R06.6-D2_done_waiting_user`
> 正式回填状态: `blocked_until_R06.8_and_step_19`

## 1. 当前状态与写入门禁

| 项 | 当前裁定 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application-input-boundary`（已消费） -> `application::jobs / R06.6-D2` identity/fence/work-key checkpoint |
| 上一停审点 | `R06.5-G_done_waiting_user` |
| 本次工作 | R06.6 输入与A/B/C/D-1已完成；D-2已闭口execution ref、plan ref、fencing token和global work-key四张对象卡 |
| 本次未做 | D-3 item state/outcome/item、D-4 plan/config、D-5 claim、D-6 closure、report、service、Step 07或正式`03`章节 |
| gate_status | `R06.6-D2_done_waiting_user` |
| gate_reason | D-2四张对象卡、三层identity、nine-variant global work key和downstream affected definitions已完成；必须等待用户确认后才能进入D-3 |
| next_allowed_action | `wait_user_confirmation_before_R06.6-D3_job_item_state_outcome_item_cards` |
| 外部上游 blocker | `none` |
| 内部质量 blocker | `03-RPR-S06-GRANULARITY=open`；identity/work-key owner冲突已在D-2关闭；`R06.6-JOB-CONFIG-OWNER=open_controlled_by_D1`；D-3~D-6与E/F仍未开始 |
| 是否允许进入 Step 07 | 否；R06.6~R06.8 和受影响审计尚未完成 |
| 是否允许修改正式 `03` | 否；仍处于 `blocked_until_step_19` |
| 是否需要提交 | 不需要；本轮只修改设计仓文档，未提交 commit |

### 1.1 写入前检查

| 检查项 | 本次结论 |
|---|---|
| 写入类型 | Step 输入边界 / inventory 中间产物 |
| 目标文件 | `design-calibration/03_ddd_step_06_application_input_boundary.md`、主控 flow、项目执行台账 |
| 对应模块 | `application-input-boundary` |
| 项目级门禁 | 允许在 `03` Step 06 读取并记录 R06.6 输入；不允许跨到 Step 07 或正式回填 |
| 文档级门禁 | `03_ddd_calibration_flow.md` 允许 R06.6 输入审查，不允许直接写对象卡 |
| Step / 模块级门禁 | 本文件只允许问题回答、诊断、inventory 和计划；对象卡仍 blocked |
| 思考记录状态 | `done` |
| 正式正文污染 | `no`；没有修改 `03-详细设计.md` |
| 批次规则误用 | `no`；本次只写输入边界，不以 inventory 冒充对象契约 |

## 2. 本轮输入与权威顺序

本轮先读取项目级台账，再读取文档级 flow、Step 06 主控与 R06.5-G 结果，随后读取详细设计 SOP / 书写规范和概要设计 application use-site。输入只用于确认 R06.6 的对象发现边界，不把冻结的后续 Step 反向升级为 definition owner。

| 输入 | 读取范围 | 本轮效力 |
|---|---|---|
| `projects/L4-observability/design-calibration/project_execution_ledger.md` | 当前恢复点、全局 blocker、下一 Step 清单 | 项目级恢复真相源 |
| `projects/L4-observability/design-calibration/03_ddd_calibration_flow.md` | Step 状态台账、文档 / Step 门禁 | 文档级恢复真相源 |
| `03_ddd_step_06_object_contracts.md` | §6.6 application inventory、§6.14 R06.5-G 摘要、历史 application 草稿 | 当前 Step 主控与 repair input；旧 application schema 不可直接落码 |
| `03_ddd_step_06_policy_guard_records.md` | §§67~73，尤其 H12 reserved input、record owner 和 truth boundary | R06.5-G 的唯一上游 record 边界 |
| `03_ddd_step_06_domain_truth_signal_audit.md` | §24 H11 affected-definition | domain transition / post-state 的消费边界 |
| `03_ddd_step_06_boundary_read_maintenance.md` | §24 H8/H9/H10/H11/H13 affected-definition | boundary / maintenance transition 的消费边界 |
| `02-概要设计.md` | §6、§8、§9、§12 中 application、outbox、stored result、job、report 候选 | 直接上游语义与非目标边界 |
| `02_hld_step_06_key_objects*.md` | application / projection / reference / maintenance 对象骨架 | 对象发现输入，不是完整实现契约 |
| `02_hld_step_08_processing_flows.md` | Command / Query / Consumer / Event / Job 处理流骨架 | use-site 诊断；不替代 Step 09 |
| `02_hld_step_09_state_machine.md` | application / publication / job report 状态候选 | 状态主语反查；不替代 Step 10 |
| `02_hld_step_12_detailed_design_handoff.md` | application service、stored result、outbox、job report 承接清单 | 详细设计必须覆盖的输入面 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | application port / repository / publisher 的冻结 use-site | 只登记后续接缝缺口，不在本轮定义 trait |
| `03_ddd_step_08_protocol_contracts.md` | result / receipt / report public mapping | 只反查二级类型与命名冲突 |
| `03_ddd_step_09_function_flows.md` | idempotency、outbox、job、report flow use-site | 只反查调用需要，不在本轮写 flow |
| `03_ddd_step_11_persistence_transaction_consistency.md` | logical store、save order、durable state use-site | 只反查持久化责任，不在本轮写 schema / UoW |
| `03_ddd_step_13_concurrency_idempotency.md` | duplicate、digest、plan、claim、fence、token 约束 | application carrier 的并发输入来源 |
| L1-governance / L1-artifact Step 06 / 07 | application helper、stored result、job report 的组织粒度 | 仅参考粒度，不复制相邻域 truth |

### 2.1 权威冲突处理

| 冲突 | 当前处理 |
|---|---|
| 旧正式 `03-详细设计.md` 与当前 Step 06 application 草稿的对象深度不同 | 旧正式文档和草稿均作为 repair input；只有 R06.6 当前对象卡可成为后续实现契约来源 |
| Step 07 / 08 / 09 / 11 / 13 已经写出 application 类型 | 这些文件是冻结 use-site；它们可以证明“需要该类型”，不能在本轮夺取唯一 definition owner |
| Step 10 反向补 `OutboxPublicationState`、`JobReportState` | 记录为 R06.6 affected use；状态 owner 必须回到 application 对象卡，再由 Step 10 重建回指 |
| Step 14 重复定义 `ExternalEffectBindingRef` / `JobExecutionConfigSnapshot` | 记录为 owner conflict；在对象卡前不得复制、alias 或静默选择任一版本 |
| H12 需要 accepted item result | 只承接与 H12 兼容的最小 result shape；H12 不授权 job / plan / claim / run / report schema |

## 3. R06.6 的责任边界

### 3.1 R06.6 必须闭口的 application capability

R06.6 负责把已经由协议入口确认的安全输入，组织成 application-owned control carrier，并为后续 port、flow、persistence、concurrency 和 protocol 提供唯一对象来源：

| capability | application 拥有的语义 | 明确不拥有 |
|---|---|---|
| operation identity | 有限的 Command / Query / Consumer / Job operation namespace | route 自由字符串、业务 truth lifecycle |
| operation context | actor-safe ref、trace context、request digest、idempotency / event identity 的组合 | actor 授权 truth、外部身份 truth、raw request body |
| idempotency control | logical scope、reservation、incoming replay / conflict / in-flight 分类 | accepted business truth、exactly-once 外部效果 |
| stored result | immutable、body-free、可精确重放的 result / receipt / job report surface | provider payload、source body、验收签署、真实 evidence alias |
| outbox material | 已提交 observation fact 的 immutable publication snapshot 及 local publication state | 当前 truth 重建 payload、下游消费 truth、bus ack truth |
| external effect intent | local effect identity、binding snapshot、phase token 的一致性输入 | endpoint、topic、credential、provider response、外部成功结论 |
| job plan / item | immutable target set、planned input、item outcome、resume-safe coordination | source repair、业务 job truth、真实运行平台的 run identity |
| claim / fence | application-side ownership / stale-writer protection | exactly-once proof、worker / host / pod truth |
| report / disposition | observation-side execution summary、consumer / job one-shot result | final verdict、signoff、external acceptance |
| application service | capability 编排入口和依赖 owner | repository / port trait 定义、协议 DTO 定义、事务顺序实现细节 |

### 3.2 R06.6 与相邻模块的接缝

```text
contracts typed refs / finite enums / public result carriers
                 |
                 v
application context / idempotency / stored result / outbox / plan / report
        |                         |                         |
        v                         v                         v
domain transition + record   Step 07 ports          Step 08/09/11/13 consumers
        |                         |                         |
        +------------ same-UoW / immutable boundary ------------+

infra resolves bindings and adapters; api / worker / jobs own entry-local state.
None of these edges grants application ownership of business or external truth.
```

关键说明：

- 图只表达 application carrier 的责任方向，不表达函数调用时序或实施顺序。
- `contracts` 提供可跨边界传递的 typed carrier；application 负责组合和一致性，不得让 domain 反向依赖 application。
- `domain` 只产生 accepted transition / post-state；record 的三输入约束由 R06.5 保持，application 不得从 current row 猜历史。
- `infra` 只解析已校验的 binding / adapter capability；不得把 locator、credential 或 provider body注入 application 对象。
- `api`、`worker`、`jobs` 的 process-local entry state 属于 R06.7；R06.6 只定义它们必须消费的 application result surface。

### 3.3 本轮明确不进入 R06.6 的对象

| 对象 / 类型族 | 处理 | 后续 owner |
|---|---|---|
| repository / UnitOfWork / publisher / resolver / adapter trait | `DX`；只记录所需 capability 和读写面 | Step 07、Step 11、Step 14 |
| Command / Query / Event / Job request / response DTO | `DX`；R06.6 只能提供 handler target 与 result carrier | Step 08 |
| 每个接口的 validation、save order、outbox order、retry branch | `DX` | Step 09、Step 11、Step 13 |
| 完整状态转换矩阵和 transport error mapping | `DX` | Step 10、Step 12 |
| `ObservationCommandHandlerState`、`ObservationQueryHandlerState` | `DX`；入口 state 不是 application durable truth | R06.7 |
| `OutboxPublisherLoopState`、`ProjectionWorkerLoopState` | `DX`；loop state 不等于 outbox record / maintenance state | R06.7 |
| `ObservationJobRunnerContext`、`EntryDisposition` | `DX`；runner / entry 一次性 carrier 归入口模块 | R06.7 |
| config key、schedule registration、runtime builder、adapter product selection | `DX` | Step 14、`04-配置设计.md` |
| `GapScanRecord` 本身 | `ET/use-only`；唯一 owner 已在 R06.5-G | R06.5-G，不在 R06.6 重定义 |

## 4. capability 到候选对象组

### 4.1 对象组与实际输出

| 组 | 负责 capability | 计划输出形态 | 当前输入审查结论 |
|---|---|---|---|
| A | operation / context / idempotency | 逐 enum、context、scope、reservation、outcome 卡 | 必须先做；所有写入对象和 duplicate 分支依赖它 |
| B | stored result / replay surface | 逐 result kind、serialized surface、stored result、disposition 卡 | 必须与 A 绑定；不能把 public protocol DTO 当 stored truth |
| C | outbox / external effect | 逐 outbox record、publication state、intent / binding、五类 token 卡 | 必须单独审查 binding owner 和 immutable snapshot |
| D | job plan / item / claim | 逐 execution ref、plan ref、work key、item state/outcome/item、plan、claim、fence、config snapshot 卡 | 必须单独审查 H12 compatibility、resume 和 stale fence |
| E | report / disposition / service | 逐 scope item report、job report、consumer/job disposition、application error、四类 service 卡 | 必须区分 durable report、one-shot result、public outcome 和 entry state |

### 4.2 预定对象卡批次

| 子批次 | 覆盖范围 | 输入审查状态 | 进入条件 |
|---|---|---|---|
| `R06.6-A` | operation namespace、event identity、operation context、idempotency scope / reservation / state / incoming outcome | `done_waiting_user` | `03_ddd_step_06_application_operation_context_idempotency.md` §§1~12；11 个对象卡、family matrix、secondary event identity 和 Query no-reservation gate |
| `R06.6-B` | stored result kind / serialized surface / result / result disposition、outbox record / publication state | `done_confirmed_historical_checkpoint` | 用户已确认；对象定义继续有效并被 C 批消费 |
| `R06.6-C` | effect intent / binding、publication / handoff / export token/result/probe | `done_waiting_user` | 16 个对象卡、source-token-result chain、owner/state/affected-use审计完成 |
| `R06.6-D` | execution ref / plan / item / claim / fence / config snapshot | `D1_done_waiting_user` | D-1输入权威、冲突、capability、11对象资格与D-2~D-6计划已完成；对象卡尚未开始 |
| `R06.6-E` | scope item report、job report、consumer/job disposition、ApplicationError、service objects | `planned` | A~D 完成，public / durable / entry result 分层已闭合 |
| `R06.6-F` | application 跨组字段、状态、owner、Step 07 承接和 affected-use 审计 | `planned` | A~E 全部对象卡完成 |

每个子批次仍需逐对象独立小节；本文件的组表和批次表不能替代对象卡。

## 5. application 候选 inventory（输入审查版）

下表是“需要审查的对象全集”，不是已确认的实现契约。`FC` 表示必须形成独立 full card，`TC` 表示只有在透明 newtype 条件全部成立时才可采用模板卡，`UR` 表示存在 owner / shape 冲突，`DX` 表示不在本批定义。

### 5.1 operation / context / idempotency / stored result

| ID | 候选对象 | 资格 | 输入证据 | R06.6 需要裁定的核心问题 |
|---|---|---|---|---|
| APP-A01 | `ObservationOperationName` | FC | §6.6.1；Step 08 route map | 四个 operation family 是否唯一；禁止 free-text / alias |
| APP-A02 | `ObservationCommandOperation` | FC | §6.6.1；16 command use-site | variant 全集、静态 route、digest identity |
| APP-A03 | `ObservationQueryOperation` | FC | §6.6.1；14 query use-site | query 可建 context 但不得建立 idempotency reservation |
| APP-A04 | `ObservationInboundConsumerOperation` | FC | §6.6.1；9 consumer use-site | producer family、source event、dedup binding |
| APP-A05 | `ObservationJobOperation` | FC | §6.6.1；9 job use-site | public job name 与 application operation 的一对一映射 |
| APP-A06 | `ObservationInboundEventIdentity` | FC | §6.6.1；Step 13 dedup | consumer + producer + source event ref 的唯一性与不可替代性 |
| APP-A07 | `ObservationOperationContext` | FC | 旧草稿 §7.7；Step 08/09/13 | command/query/consumer/job 四类 factory 的必填/禁填字段 |
| APP-A08 | `ObservationIdempotencyScope` | FC | §6.6.1；Step 11/13 | operation + effective actor + key 的 canonical identity |
| APP-A09 | `ObservationIdempotencyReservation` | FC | §6.6.1；Step 11/13 | reservation row 的 immutable key、result-before-complete、CAS 边界 |
| APP-A10 | `IdempotencyReservationState` | FC | Step 10/11/13 | 仅 `Reserved -> Completed`；Replay / Conflict / InFlight 不得变成 durable state |
| APP-A11 | `ObservationIdempotencyReserveOutcome` | FC | §6.6.1；Step 13 | Acquired / Replay / Conflict / InFlight 的 payload 与 zero-write 语义 |
| APP-A12 | `StoredObservationResultKind` | FC | §6.6.1；Step 08 | Command result / rejection / consumer receipt / job report 的有限分类 |
| APP-A13 | `StoredObservationReplaySurface` | FC | §6.6.1；Step 08/11/13 | schema version、serialized surface、digest 的精确重放约束 |
| APP-A14 | `BodyFreeSerializedResult` | FC | §6.6.1；body-free redline | bytes 的边界、解码 owner、Debug / body 泄露禁止 |
| APP-A15 | `StoredObservationResult` | FC | §6.6.1；Step 11/13/17 | idempotency / actor / operation / digest / kind 与 public result ref 的一致性 |
| APP-A16 | `OperationResultDisposition` | FC | §6.6.1；Step 10/12 | application result 分类与 domain state / public outcome 的映射边界 |

### 5.2 outbox / external effect

| ID | 候选对象 | 资格 | 输入证据 | R06.6 需要裁定的核心问题 |
|---|---|---|---|---|
| APP-B01 | `ObservationOutboxRecord` | FC | §6.6.2；Step 10/11/13 | event / subject / immutable payload snapshot / cursor / publication state 的完整绑定 |
| APP-B02 | `OutboxPublicationState` | FC | §6.6.2；Step 10 | `Pending -> Published/Failed/DeadLettered`；Failed 不回 Pending |
| APP-B03 | `ExternalEffectIntentRef` | TC/UR | §6.6.2；Step 13 | local effect identity 的 mint owner；不得成为外部运行 identity |
| APP-B04 | `ExternalEffectBindingRef` | UR | §6.6.2；Step 14 重复定义 | application snapshot 与 infra/config catalog 的唯一 owner、可见字段和禁止 locator |
| APP-B05 | `ObservationPublicationToken` | FC | Step 13/11 | outbox、event、binding、payload digest、schema 的 immutable equality |
| APP-B06 | `HandoffPreparationToken` | FC | Step 13/09 | handoff intent、binding、prepared material digest 的同一性 |
| APP-B07 | `HandoffDeliveryToken` | FC | Step 13/09 | preparation/delivery phase、intent、binding 不可漂移 |
| APP-B08 | `ExportPreparationToken` | FC | Step 13/09 | product-neutral export preparation 的稳定 identity |
| APP-B09 | `ExportDeliveryToken` | FC | Step 13/09 | 原 binding / material 的 delivery 复用；禁止 fallback current target |

### 5.3 job plan / item / claim

| ID | 候选对象 | 资格 | 输入证据 | R06.6 需要裁定的核心问题 |
|---|---|---|---|---|
| APP-C01 | `ObservationJobExecutionRef` | FC | §6.6.2；Step 11/13 | local execution identity 与 core / external `run_id` 的隔离 |
| APP-C02 | `ObservationJobExecutionPlanRef` | TC/FC | §6.6.2；Step 13 | transparent ref 条件、durable plan owner、生成和 rehydrate |
| APP-C03 | `ObservationFencingToken` | FC | §6.6.2；Step 13 | 正值、单调递增、claim 来源；不得降级为普通 `u64` |
| APP-C04 | `ObservationJobWorkKey` | FC | §6.6.2；9 job variants | 跨 execution 全局 typed uniqueness 与 payload variant 完整性 |
| APP-C05 | `ObservationJobPlanItemState` | FC | §6.6.2；Step 10/13 | Planned / Running / finalizable / retry / blocked / skipped 的状态主语 |
| APP-C06 | `ObservationJobPlanItemOutcome` | FC | §6.6.2；H12 | success refs、failed refs、gap refs、typed reason、digest 的互斥与完备 |
| APP-C07 | `ObservationJobPlanItem` | FC | §6.6.2；Step 11/13 | planned input / observed version immutable；state/outcome CAS 边界 |
| APP-C08 | `ObservationJobExecutionPlan` | FC | §6.6.2；Step 11/13/17 | canonical item set、config snapshot、plan digest、resume 不 relist |
| APP-C09 | `ObservationExecutionClaimState` | FC | §6.6.2；Step 10/13 | Active / Released / Expired 及 stale claimant 拒绝 |
| APP-C10 | `ObservationExecutionClaim` | FC | §6.6.2；Step 13 | execution / work key / plan / fence / lease 的 ownership 绑定 |
| APP-C11 | `JobExecutionConfigSnapshot` | UR | Step 14 §相关 use-site | application durable snapshot 与 config definition owner 的分界；resume 不热读 config |

### 5.4 report / disposition / service

| ID | 候选对象 | 资格 | 输入证据 | R06.6 需要裁定的核心问题 |
|---|---|---|---|---|
| APP-D01 | `ProjectionScopeItemReport` | FC | §6.6.3；Step 11/17 | 一个 canonical scope 一行、成功/失败 accounting 的 durable owner |
| APP-D02 | `ProjectionScopeItemOutcome` | FC | §6.6.3；Step 11/17 | success refs 与 failure reason/gaps 的互斥关系 |
| APP-D03 | `ObservationJobReportDraft` | FC | §6.6.3；Step 10/11/13/17 | plan/execution/digest/fence/item fold、draft 到 terminal seal |
| APP-D04 | `JobReportState` | FC | Step 10/12 | durable report state 与 public `ObservationJobOutcome` 分离 |
| APP-D05 | `JobError` | FC | §6.6.3；Step 12 | report mutation invariant error；不得成为 public transport code |
| APP-D06 | `ObservationConsumerDisposition` | UR | §6.6.3；Step 07/08 | 与 public outcome、stored receipt、entry disposition 的层级冲突；不得直接复用同名 enum |
| APP-D07 | `ObservationJobDisposition` | UR | §6.6.3；Step 08/12 | 与 public outcome、`JobReportState`、entry disposition 的层级冲突；待 E 批裁定 |
| APP-D08 | `ApplicationError` | UR | Step 07/12 当前定义/use | application error 唯一 owner、domain/protocol/entry mapping 和 safe detail |
| APP-D09 | `ObservationVisibilityDecision` | HX | 历史 §7.7；R06.4/P11 | historical exclusion；当前只借用 canonical `ReadVisibilityDecision`，不创建 application visibility authority |
| APP-D10 | `ObservationCommandService` | FC | §6.6.3；Step 05/09 | constructor dependency owner、command capability 面；exact port callables后置 |
| APP-D11 | `ObservationQueryService` | FC | §6.6.3；Step 08/09 | query capability、visibility assembly、zero-writer boundary |
| APP-D12 | `ObservationConsumerService` | FC | §6.6.3；9 consumer flows | consumer dispatch boundary、idempotency / receipt / quarantine 组合 |
| APP-D13 | `ObservationJobService` | FC | §6.6.3；9 job flows | plan / claim / report orchestration boundary；不修 source truth |

## 6. SOP 问题回答

### 6.1 本轮输入是否足以开始 R06.6 对象卡

输入足以开始对象卡，但不允许把输入审查直接当成对象契约完成。当前已经具备：

- application 模块的 capability 边界和不拥有项；
- 由概要设计、R06.5-G 和冻结下游 use-site 共同形成的候选 inventory；
- 每个候选的资格、来源、后续裁定问题和对象卡批次；
- H12 accepted item result 的最小兼容边界；
- `ExternalEffectBindingRef`、`JobExecutionConfigSnapshot`、`ApplicationError` 等尚未唯一收口的冲突登记。

尚未具备的内容必须留给 `R06.6-A` 及后续子批次：字段类型、factory 输入、member 函数、enum variant 注释、状态去向、rehydration、error surface 和跨组字段审计。

### 6.2 application 的功能是否都有对象承接

| capability | 当前承接状态 | 说明 |
|---|---|---|
| operation identity / routing namespace | 有候选承接 | 四类 operation enum 需要逐对象闭口，不能以字符串 route 代替 |
| operation context / request binding | 有候选承接 | `ObservationOperationContext` 与 `ObservationInboundEventIdentity` 需先于幂等对象 |
| idempotency reservation / incoming classification | 有候选承接 | durable state 与 incoming outcome 已在 inventory 中分开 |
| exact stored replay | 有候选承接 | `StoredObservationResult` 及其 serialized surface 需独立卡 |
| outbox publication | 有候选承接 | outbox record 与 publication state 必须从 Step 10 反向补口回收 |
| external effect phase identity | 有候选承接但有 owner conflict | intent、binding、token 不能由 config 或 adapter 私自定义 |
| job plan / item / claim / fence | 有候选承接 | H12 只提供 item-result compatibility，不提供 execution lifecycle |
| job report / consumer disposition | 有候选承接 | durable report、one-shot result、public outcome、entry state 必须分层 |
| application service façade | 有候选承接 | Step 06 先闭口依赖 owner 和 capability；trait/function exact surface 后置 Step 07 |

当前没有发现“功能完全无人承接”的外部上游缺口；发现的是若直接沿用冻结文件，会出现重复 owner 或把后续层定义倒灌到 application 的风险。

### 6.3 哪些对象必须在 R06.6 闭口，哪些明确 defer

必须在 R06.6 逐卡闭口：

```text
operation namespace
operation context / inbound event identity
idempotency scope / reservation / durable state / incoming outcome
stored result kind / replay surface / body-free serialized result / stored result
outbox record / publication state
effect intent / binding decision / publication-handoff-export token
job execution ref / plan / item / item outcome / claim / fence
application-owned execution config snapshot, if it remains a required durable field
scope item report / job report / report state / report-local error
consumer disposition / job disposition / application error
application command / query / consumer / job service object
```

明确 defer：

```text
repository, UnitOfWork, publisher, resolver, adapter and runtime traits
transport DTO and event envelope schema
per-interface validation and save-order flow
full state transition matrix and transport mapping
api / worker / jobs process-local entry and loop state
config keys, schedule registration and runtime builder shape
```

“defer”只表示后续 owner 已被命名，不表示实现端可以自行补字段；后续 Step 必须回指本文件的 candidate ID 和 R06.6 对象卡。

## 7. 当前文档问题诊断

| 位置 | 诊断 | R06.6 输入审查结论 |
|---|---|---|
| 主控 §6.6 application inventory | 多个对象仍以 family 合写，服务对象只有代表函数 | 保留 candidate 全集，后续按 A~E 子批次逐对象拆卡 |
| 冻结 Step 10 | outbox / job report 状态曾从状态矩阵反向补入 Step 06 | 记录为 affected use；R06.6 成为 application state owner，Step 10 后续只回指 |
| 冻结 Step 13 | plan / claim / token / digest 约束已较细，但对象 owner 仍分散 | 作为输入约束，不把 Step 13 直接当 definition source |
| 冻结 Step 14 | `ExternalEffectBindingRef`、`JobExecutionConfigSnapshot` 有重复定义 | 登记 `UR-APP-EXT-01`；未裁定前禁止复制或 alias |
| 冻结 Step 07 / 08 | consumer/job disposition、stored result、application error 与 public outcome 层级交叉 | R06.6 先区分 durable / one-shot / public / entry 四层，再交给后续协议和入口 Step |
| R06.5-G H12 | record 需要 accepted item result，但明确禁止 job schema | 只保留最小兼容输入；不创建第二个 job truth owner |

## 8. 设计取舍

| 方案 | 优点 | 风险 | 当前选择 |
|---|---|---|---|
| 一次性写完全部 application 对象 | 表面上能快速消除 inventory | 容易把 operation、stored result、job、entry 和 outbox 混写，无法逐对象停审 | 不采用 |
| 只闭口 idempotency 和 stored result，把 job / outbox 推迟 | 当前篇幅较小 | Step 09/11/13 会再次私补 publication、plan、claim 和 report carrier | 不采用 |
| 按 capability 组分为 R06.6-A~F，组内逐对象停审 | 能先稳定依赖顺序，并保留跨组审计入口 | 总文档较长，需要持续维护 owner registry | 采用 |
| 直接继承 Step 10/13/14 的既有类型定义 | 可减少重复 | 后置文件存在反向补型、重复 owner 和协议层混入实现层的问题 | 不采用；只继承其 use-site 和约束 |

R06.6 的第一组必须从 operation context / idempotency 开始，因为所有 command、consumer、job 写路径的 reserve、replay、conflict、in-flight 分支都依赖同一 operation identity 和 digest binding。Query context 可以共享 operation namespace，但不能因此进入 idempotency writer lane。

## 9. 回填草稿边界

本轮不回填正式 `03-详细设计.md`。未来正式章节只允许在以下条件全部满足后生成：

1. `R06.6-A~E` 每个 candidate 都有独立对象卡或具名 `DX/UR/ET` 决议；
2. `R06.6-F` 完成字段来源、状态 owner、重复声明和 Step 07 承接审计；
3. `R06.7` 完成 entry / runtime carrier，且 R06.8 关闭 `03-RPR-S06-GRANULARITY`；
4. formal `03` 的对象章节按当前对象卡重新装配，不从历史 §7.7 草稿摘录。

未来回填位置预登记为：

| 正式章节 | 允许引用的当前来源 | 当前状态 |
|---|---|---|
| `03-详细设计.md` §5 application 模块对象契约 | 本文件 + `R06.6-A~E` 当前对象卡 + `R06.6-F` 审计 | blocked |
| `03-详细设计.md` §6 全局对象 / Trait / API 索引 | R06.6 owner registry 与后续 Step 07/08 当前产物 | blocked |
| 正式 §8 / §9 / §10 | 后续 protocol / flow / state / persistence 产物 | 不属于本轮 |

## 10. 待确认事项与 blocker

| ID | 类型 | 当前状态 | 影响 | 未确认前处理 |
|---|---|---|---|---|
| `R06.6-INPUT-01` | 用户门禁 | resolved | 用户已确认进入并完成 `R06.6-A` | 不再作为 current gate |
| `R06.6-A-REVIEW` | 子批次用户门禁 | resolved | 用户已确认进入并完成 `R06.6-B` | 不再作为 current gate |
| `R06.6-B-REVIEW` | 子批次用户门禁 | resolved | 用户已确认并完成 `R06.6-C` | 不再作为 current gate |
| `R06.6-C-REVIEW` | 子批次用户门禁 | resolved | 用户已确认进入`R06.6-D`，D-1已完成 | 不再作为current gate |
| `R06.6-D1-REVIEW` | D内子批次用户门禁 | resolved | 用户已确认进入并完成D-2 identity / fence / work-key对象卡 | 不再作为current gate |
| `R06.6-D2-REVIEW` | D内子批次用户门禁 | open_waiting_user | 是否进入D-3 item state / outcome / item对象卡 | 停在D-2，不读取或写D-3~D-6 |
| `R06.6-APP-EXT-OWNER` | 内部 owner conflict | resolved_in_C | `ExternalEffectBindingRef` / phase 唯一 owner=`application::runtime`；Step14只派生/装配 | 后续文件只import，不复制或 alias |
| `R06.6-JOB-CONFIG-OWNER` | 内部 owner conflict | open_controlled_by_D1 | durable stable carrier owner方向已裁为`application::jobs`；Step14只派生/装配，exact support/schema仍未闭口 | D-4前不得写plan final schema或热读current config |
| `R06.6-D-JOB-IDENTITY-UPSTREAM` | internal identity conflict | resolved_in_D2 | public correlation=`JobRunId`；local execution=`ObservationJobExecutionRef`；真实run absent；无alias/wrapper转换 | Step07/08/11/13按D-2 affected register传播 |
| `R06.6-D-WORK-KEY-PAYLOAD-OWNER` | internal owner conflict | resolved_in_D2_with_downstream_affected_definitions | snapshot使用`ReferenceSnapshotStateRef`；peripheral key使用consumer id + projection scope；不生成`PeripheralConsumerScopeRef` | Step08/09/11/13按D-2 affected register传播 |
| `R06.6-D-CONFIG-SUPPORT-OWNER` | internal owner conflict | open_controlled | typed executable support objects仍只在frozen Step14首次定义 | D-4写snapshot前逐项闭口 |
| `R06.6-D-H12-COMPAT` | internal compatibility | open_controlled | generic item outcome尚不能证明H12 exact target snapshot/outcome字段 | D-3/D-6逐字段兼容或affected-definition |
| `R06.6-D-CLAIM-SHAPE` | internal schema conflict | open_controlled | old claim缺identity/plan/owner/lease/heartbeat | D-5禁止沿用旧四字段shape |
| `R06.6-APP-ERROR-OWNER` | 内部 owner conflict | open | `ApplicationError` 与 Step 07 / Step 12 / entry error mapping 的唯一归属 | 对象卡前不扩展 error variant |
| `R06-F-AFFECT-UOW-01` | controlled downstream | open_controlled | record metadata cursor 与后续 save 顺序 | R06.8 后 affected-only 回灌，不在本轮改 Step 09/11 |
| `03-RPR-S08-PER-PROTOCOL` | downstream quality | open_controlled | 协议逐项审查尚未开始 | 保持 Step 08 冻结 |
| `03-RPR-S09-PER-FLOW` | downstream quality | open | flow 逐接口重写尚未开始 | 保持 Step 09 冻结 |

外部上游 blocker 仍为 `none`。上述内部项不会通过猜测解决；若对象卡输入无法唯一裁定，必须保留 `UR` 并暂停对应子批次。

## 11. R06.6-D2 完成与进入下一批条件

输入边界、A/B/C、D-1与D-2均已完成。进入D-3前必须等待用户明确确认；下一批开始时必须先重新读取：

- D专项§§8~14，特别是stable work identity与planned material分层；
- R06.5-G H12 accepted gap-scan result、exact target snapshot与typed outcome reservation；
- frozen Step10 Job item/report state use-site、Step11 item CAS/outcome persistence和Step12 recovery classes；
- nine Job flow逐项成功、retryable、permanent、blocked、equivalent-terminal分类输入；
- B/C批outbox/external-effect result owner，避免item outcome复制其lifecycle truth。

D-3只允许写`ObservationJobPlanItemState`、`ObservationJobPlanItemOutcome`和`ObservationJobPlanItem`三张独立对象卡及H12 compatibility decision；不得进入D-4~D-6、report、service、ApplicationError、Step07、正式`03`或任何`04`文件。

当前停审结论：`R06.6-D2_done_waiting_user`。下一动作：`wait_user_confirmation_before_R06.6-D3_job_item_state_outcome_item_cards`。
