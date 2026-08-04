# L4-observability 03-详细设计 Step 06 - R06.6-D application job plan / item / claim / fence / config snapshot 对象契约

> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 上游输入: `design-calibration/03_ddd_step_06_application_input_boundary.md`
> 前置对象卡: `design-calibration/03_ddd_step_06_application_operation_context_idempotency.md`、`design-calibration/03_ddd_step_06_application_stored_result_outbox.md`、`design-calibration/03_ddd_step_06_application_external_effect_intent_tokens.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 当前模式: full-restart 定向粒度修复
> 当前子批次: `R06.6-D / D-6`
> 当前状态: `R06.6-D6_done_waiting_user`

## 1. D-4 状态与写入门禁（historical checkpoint; consumed by D-5）

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application::jobs`，并登记 `contracts` public metadata、Step 07/08/09/11/13 的受影响边界 |
| 上游停审点 | `R06.6-D3_done_waiting_user`；用户已明确确认进入 D-4 |
| 本次覆盖 | `ConfigBindingRef`、typed execution support values、`JobConfigBinding`、`JobExecutionConfigSnapshot`、`ObservationJobExecutionPlan` 及 operation/binding compatibility |
| 本次不覆盖 | claim state/claim/lease transition、report/service、repository/port exact trait、ApplicationError owner、Step 07、正式 `03` 或任何 `04` 正文 |
| 当前 gate_status | `R06.6-D4_done_waiting_user`（historical checkpoint; superseded by D-5 sections below） |
| 当前允许动作 | 只允许审查 D-4；用户明确确认后才可进入 D-5 claim state / claim 对象卡 |
| 外部上游 blocker | `none` |
| 当前内部 blocker | `03-RPR-S06-GRANULARITY=open`；`R06.6-D-H12-COMPAT=resolved_in_D3_fieldwise_with_D6_integration_followup`；`R06.6-D-CLAIM-SHAPE=open_controlled`；`R06.6-DIGEST-CANONICALIZER=open_controlled`；其他 application blocker 不在 D-4 消费 |
| 本批已关闭 | `R06.6-JOB-CONFIG-OWNER=resolved_in_D4`；`R06.6-D-CONFIG-SUPPORT-OWNER=resolved_in_D4`；plan/config snapshot 的字段、owner、rehydrate、resume 与 digest coverage已闭口 |
| 正式回填 | blocked；D-4 只闭口 plan/config snapshot object contract，正式 `03` 仍冻结至 Step 19 |
| 是否需要提交 | 不需要；本轮仅修改设计仓中间产物与恢复台账 |

### 1.1 写入前检查

| 检查项 | D-1 结论 |
|---|---|
| 用户授权 | 已确认进入 `R06.6-D4`，没有授权进入 D-5~D-6 |
| Step 06 标准 | 必须先做 capability、功能到对象映射、对象资格与批次计划，再逐对象写卡 |
| 后置 Step 使用方式 | Step 08/09/11/13/14 只作为冻结 use-site / constraint input，不成为对象 definition owner |
| historical material | 主控旧 `Job execution plan / claim / fencing objects` 代码块及后置同名 schema 均为 repair input；不得直接复制 |
| 对象卡写入 | D-4 support types、`JobConfigBinding`、`JobExecutionConfigSnapshot`、`ObservationJobExecutionPlan`；不写 claim/report/service |
| 正式正文污染 | `no`；未修改 `03-详细设计.md` |
| 实现与证据纪律 | 未实现代码，未伪造 commit、run id、evidence alias、签署或测试结果 |

## 2. D 批输入权威与使用顺序

| 顺序 | 输入 | D 批用途 | 权威限制 |
|---:|---|---|---|
| 1 | `project_execution_ledger.md`、`03_ddd_calibration_flow.md` | 当前恢复点、冻结范围、blocker 与停审规则 | 只有 current pointer 可以授权写入 |
| 2 | Step 06 SOP、书写规范、真相源闭环标准 | 对象卡最低结构、字段来源、状态闭环、job duplicate / config snapshot / phase boundary 规则 | 标准不替代项目语义 |
| 3 | application input inventory §5.3、主控 §6.6.2 / §6.17 | 11 个候选、资格、C 批前置 owner 与 D 范围 | inventory / 旧大代码块不等于 current object contract |
| 4 | A 批 operation/context/idempotency current cards | `ObservationJobOperation`、job context、reservation、digest 与 duplicate gate | local execution identity不得进入 idempotency scope，也不得替代 public metadata |
| 5 | B/C 批 current cards | stored result/outbox exact snapshot、external binding/token/result/probe | claim/fence不得替代 stable external token、outbox version 或 binding equality |
| 6 | R06.4 maintenance/peripheral owners、R06.5-G §§71 / 73.4 | maintenance target、gap-scan accepted result reservation 与 H12 compatibility | H12 不拥有 job/plan/item/claim/run/report lifecycle |
| 7 | frozen Step 08 `ObservationJobMetadata` / Job protocol | public request identity、nine job catalog、report surface与 no-real-run boundary | public DTO 是 use-site，不得反向定义 application execution object |
| 8 | frozen Step 09 shared Job path / nine Job flows | start/item/finalize capability、候选冻结与 no-source-repair 边界 | flow 顺序不授权猜对象字段或 trait |
| 9 | frozen Step 11 logical stores / staged ordering | durable plan、item classification、claim/fence、resume 所需 persistence shape | store schema后置；不能成为 Step 06 object owner |
| 10 | frozen Step 13 §§18.1~18.5 | immutable plan、global work key、fenced reentry、resume/finalize invariants | 同名 Rust block降级为 repair input；D 批逐卡重建 |
| 11 | frozen Step 14 typed runtime config / §9.5 | executable typed values、claim lease、retry、external capability、snapshot use-site | raw config、source priority和 key 仍归 Step 14 / `04`；snapshot stable carrier须回到 Step 06 |
| 12 | L1-governance / L1-artifact Step 06 | application helper逐对象粒度、owner/defer/停审组织 | 只参考粒度，不复制相邻域 job truth |

### 2.1 后置材料降级清单

| 后置材料 | 当前可保留的约束 | 不得直接继承的内容 |
|---|---|---|
| Step 08 public Job schema | public `job_execution_ref` 是 entry/scheduler 输入且不是真实 external run id；9 个 Job operation 完整 | 悬空的 `JobExecutionRef` 具体 owner/shape、application plan identity、claim/fence 字段 |
| Step 09 shared flow | reserve 后才冻结计划；start/item/finalize 分段；resume 不 relist | sample code中的直接字段构造、repository signature、错误分类 |
| Step 11 logical stores | plan durable、item mutable classification、global active work claim、commit-time fence | PK/column 名、claim identity缺失的旧 schema、后置 function signature |
| Step 13 §18 | immutable planned material、global work-key、monotonic fence、fresh-claim resume | 旧 11 类型代码块和只有四字段的 claim shape |
| Step 14 §9.5 | snapshot持久化 executable typed values；resume 不热读 current config | Step 14 同名 `JobExecutionConfigSnapshot` / `JobConfigBinding` 作为 definition owner |

## 3. D 批 capability 与边界

### 3.1 capability 清单

| capability | 输入 | 输出 | durable state / side effect | 后续承接 |
|---|---|---|---|---|
| establish local execution identity | accepted job operation context + generated local identity material | one application-local execution ref | binds one acquired reservation to one plan/report lineage | D-2 identity cards；Step 07 ID generator / repository |
| establish immutable plan identity | generated plan identity + accepted execution | one stable plan ref | durable lookup / rehydrate anchor | D-2；Step 07 repository |
| address globally competing work | exact typed candidate identity | one finite `ObservationJobWorkKey` | global active-claim uniqueness across executions | D-2；Step 13 affected review |
| protect stale local writers | durable acquire/renew/release decision | positive monotonic fencing token | commit-time stale claimant rejection | D-2/D-5；Step 07/11/13 |
| classify one frozen item | immutable planned material + current guarded result | item state + exact structured outcome | CAS of mutable classification only | D-3；Step 10/11/12 |
| retain exact accepted work-set | operation/context + bounded canonical candidates + execution config snapshot | immutable execution plan | resume/finalize source; never relist | D-4；Step 09/11/13 |
| retain executable configuration | validated application runtime values relevant to one accepted job | durable typed config snapshot | plan digest input and resume dependency | D-4；Step 14 derives values only |
| represent durable claim ownership | claim identity + exact subject + owner/lease/fence metadata | claim state and current owner proof | acquire/renew/release/expire lifecycle | D-5；Step 07/11/13 |
| supply H12-compatible accepted scan result | exact gap-scan item result and target snapshot | field-compatible accepted-result carrier | same-UoW input for H12 record factory | D-6 compatibility review |

### 3.2 D 批不拥有的事实

- public Job request / response / report wire schema仍由 Step 08 定义；D 批只定义 application durable coordination carrier。
- scheduler invocation identity、application-local execution identity和真实 external/runtime run identity是三个不同角色；任何二者都不得隐式 alias。
- plan、item、claim和fence不是业务 truth、source truth、external acceptance、final verdict、signoff或验收 evidence。
- claim/fence只保护本地 durable writer；它不证明 external exactly-once、source snapshot freshness、repository version匹配或下游消费成功。
- snapshot只保存 body-free executable typed values和稳定 binding identity；不保存 raw endpoint、topic、credential、secret、provider response或配置源正文。
- Job只能维护本仓 observation-side projection、marker、outbox、handoff/export preparation和report协调；不得修复或反写 source / sibling business truth。

### 3.3 功能到对象组映射

| 对象组 | 承接 capability | 当前 Step 06 责任 | 禁止替代 |
|---|---|---|---|
| execution / plan identity | accepted execution与durable plan lookup | D-2逐对象闭口 identity source、rehydrate、no-alias | public `JobExecutionRef`、真实 run id、report ref、idempotency ref |
| fencing / work key | global work ownership与stale-writer rejection | D-2闭口positive token、finite work variants和global uniqueness | hash/string、attempt、clock、row version、external token |
| item state / outcome / item | exact mutable classification和report fold input | D-3闭口state/outcome compatibility、planned material immutability与CAS边界 | public outcome、job report state、H12 record schema、current truth reconstruction |
| execution plan / config snapshot | exact work-set与resume material | D-4闭口immutable plan、snapshot owner、typed executable values与digest participation | current config、raw config、candidate relist、report summary |
| claim state / claim | execution或global item durable owner | D-5闭口claim identity、subject、owner/lease/heartbeat/fence与transition invariants | process lock、worker telemetry、external token、local-clock expiry |
| H12 compatibility / cross-object closure | accepted gap-scan result到record factory | D-6逐字段兼容或登记 controlled affected-definition | 用H12反向定义通用 plan/item/claim/report |

## 4. 冲突诊断与当前裁定

### 4.1 Job identity 三层隔离

| identity role | 当前 use-site | D-1 裁定 | 后续动作 |
|---|---|---|---|
| public invocation identity | Step 08 `ObservationJobMetadata.job_execution_ref: JobExecutionRef`，由scheduler/job entry提供 | 只表示public invocation correlation；不是application execution row、plan identity或真实 external run id | `JobExecutionRef` 在当前可检索上游 contracts/Step 06 未找到正式 declaration，登记 `R06.6-D-JOB-IDENTITY-UPSTREAM`；D-2不得静默 wrapper/alias |
| application-local accepted execution identity | candidate `ObservationJobExecutionRef` | 必须由本仓生成并绑定一次Acquired reservation、one plan lineage和后续 report；不进入idempotency logical key | D-2独立 full card裁定是否保留现名及与public metadata的explicit relation |
| real external/runtime run identity | 明确禁止在设计材料伪造 | 不属于本仓 D 对象，不得由public/local ref声称或推导 | 保持 absent；未来真实执行 evidence由真实运行阶段产生 |

因此冻结 Step 13 的 `ObservationJobExecutionRef(pub JobRunRef)` 不能直接沿用：`JobRunRef` 当前在本项目与可检索 `core-contracts` 中没有正式定义，且 wrapper 会混淆三种 identity。该问题不阻塞 D-1，但在 D-2 identity card完成前阻塞 plan / claim card。

### 4.2 Claim shape 不足

冻结 Step 13 的 claim 只有 `execution_ref / work_key / fencing_token / state`。该 shape 无法回答：

1. 当前 durable row是哪一个 claim，renew/release针对哪个 identity；
2. claim绑定哪一个 immutable plan，避免同execution错误读取另一plan；
3. 当前 owner是谁，durable adapter如何区分旧owner与fresh claimant；
4. lease何时开始、最后一次heartbeat何时被持久化、何时由durable authority判为Expired；
5. rehydrate后如何校验 execution claim 与 item claim 的subject互斥；
6. commit-time fence如何验证 exact claim identity、owner和token，而不是只比较一个裸数字。

D-5必须重建 claim identity、plan binding、owner token与lease/heartbeat时间边界；worker/host/pod/thread等可观测标签不得成为public identity或plan digest字段。

### 4.3 Global work-key 与其他并发证明

| 证明 | 保护范围 | 不能证明 |
|---|---|---|
| global typed `ObservationJobWorkKey` + active item claim | 不同execution不能同时拥有同一outbox/scope/window/snapshot/target/handoff/export/peripheral work | current source set、row version、external acceptance |
| `ObservationFencingToken` | old claimant不能在fresh acquire之后提交本地受保护writer | exactly-once、transaction success、external dedup |
| repository expected version | 当前mutable row未被另一提交改写 | claim仍Active、source capture仍fresh |
| source read fence / cursor | projection item读取的source membership/position未越界变化 | claim owner、row CAS、external result |
| C批 stable external token | same external material/binding/phase的调用identity稳定 | local claim、plan completeness、external service一定去重 |

item claim必须按global typed `work_key`唯一，而不是只按 `(execution_ref, work_key)`；否则两个不同idempotency key / execution可以并发处理同一outbox、projection scope或handoff。Work key不得降级为字符串、hash、serialized debug值或只在plan内唯一的序号。

冻结 Step 13 的 nine-variant work-key payload 还存在两处 definition/use 漂移：

| frozen payload | current diagnosis | D-2 gate |
|---|---|---|
| `ReferenceSnapshot(ReferenceSnapshotRef)` | `ReferenceSnapshotRef`已被R06.2/R06.4明确废弃；current canonical identity是`ReferenceSnapshotStateRef`，且禁止生成alias | D-2只能使用current canonical type，并登记Step08/09/11/13 affected use |
| `PeripheralScope(PeripheralConsumerScopeRef)` | `PeripheralConsumerScopeRef`只在冻结Step08/13出现，Step06、正式`02`和可检索current owner中均无definition | D-2不得猜transparent ref；必须裁定是补一个有上游语义来源的scope object，还是把work identity改为已有`PeripheralConsumerRef`与canonical projection/scope组合 |

其余七个payload type均已有current owner或current object card入口。上述漂移登记为`R06.6-D-WORK-KEY-PAYLOAD-OWNER=open_controlled`；它不阻塞D-1完成，但阻塞D-2的`ObservationJobWorkKey`卡标记pass。

### 4.4 Immutable plan 与 mutable classification 分层

| material | mutability | authority |
|---|---|---|
| execution / plan / idempotency / operation / request compatibility | start commit后immutable | accepted start UoW |
| canonical ordered work-set | immutable；不得增加、删除、重排、relist | exact bounded candidate materialization |
| per-item work identity / planned input material / observed version | immutable | start UoW captured material |
| config snapshot / plan digest | immutable | validated application values frozen at start |
| item state / current structured outcome | CAS mutable until terminal report seals plan | item/failure-accounting UoW under current fence |
| report sets / summary | mutable derived fold，非exact plan owner | E批 report object；必须lossless等于plan item classifications |

冻结 Step 13 把 immutable plan和mutable item classifications放在同一 struct并不自动错误，但 D-4必须给出结构/方法边界，使任何 update都不能替换work-set、planned material或snapshot。Report不拥有完整性，不能反向重建plan item。

### 4.5 `JobExecutionConfigSnapshot` owner 冲突（D-1 diagnosis; D-4 current closure）

| 争议 | D-1 裁定 |
|---|---|
| snapshot是否只是 `ConfigBindingRef` | 否。只保存ref并在resume热读current config会改变候选集、claim lease、retry和external binding，违反immutable plan |
| snapshot是否归infra / Step 14 | raw source、parse、priority、profile、secret/locator resolution与validated root归infra/Step 14；但被accepted plan持久化并由application执行/rehydrate的stable snapshot carrier归`application::jobs` |
| Step 14的 `JobConfigBinding` / snapshot是否可直接作为current definition | 否；二者在 D-4 由 Step 06 逐对象闭口，Step 14只保留 derivation / runtime assembly use-site |
| snapshot应保存什么 | 只保存改变该job candidate set、parallelism、claim lease、retry或external call semantics的typed executable values，以及可恢复的body-free config/binding revision identity |
| snapshot不得保存什么 | raw config map、source path、env key、endpoint/topic/credential/secret、provider body、schedule、worker/process identity |
| resume行为 | load persisted snapshot and compatible historical bindings；missing/corrupt/unknown profile -> consistency/manual，禁止current-config substitution |

`R06.6-JOB-CONFIG-OWNER` 已在 D-4 关闭：`JobExecutionConfigSnapshot`、`JobConfigBinding` 与 `ObservationJobExecutionPlan` 的 durable carrier owner 是 `application::jobs`；可复用的 typed executable value owner 是 `application::runtime`。Step 14 保留 raw-to-validated derivation、catalog assembly 与 startup validation，不再拥有同名 durable object definition。

### 4.6 Typed config support object 缺口（D-1 diagnosis; D-4 current closure）

当前只有 `AdapterFamily` 已在 Step 06 contracts专项收稳，`ExternalEffectBindingRef` / `ExternalEffectPhase` 已在 C 批收稳。以下 executable types仍只在冻结 Step 14 后置声明：

- `ConfigBindingRef`
- `PositiveDurationMillis`
- `PositiveLimit`
- `RetryBackoffConfig`
- `RetryPolicyConfig`
- `ClaimLeaseConfig`
- `ProbeCapability`
- `StableTokenCapability`
- `ExternalEffectCapabilityConfig`
- `JobConfigBinding`

D-4 已逐项闭口这些 support type：`ConfigBindingRef`、positive values、retry、lease 与 capability 均由 `application::runtime` 提供 typed executable value；`JobConfigBinding`、`JobExecutionConfigSnapshot` 与 plan carrier 由 `application::jobs` 组合并持久化。不得把 raw config struct、locator、credential 或 secret 搬进 application。`R06.6-D-CONFIG-SUPPORT-OWNER=resolved_in_D4`。

### 4.7 H12 compatibility

H12 current reservation owner固定为 `domain::records::gap_scan`：

```text
GapScanAcceptedItemResult
  target_ref
  target_snapshot
    target_ref
    projection_scopes
    dependency_namespaces
    authorization_mode
    observation_cursor
    reference_cursor
    maintenance_policy_basis
  discovered_gap_refs
  outcome = Completed | Failed(MaintenanceFailureReason) | Blocked(MaintenanceBlockReason)
  completed_at
```

D 批必须遵守：

1. H12只消费accepted gap-scan item result，不消费execution、plan、claim、fence、attempt、run、report或schedule。
2. 通用 `ObservationJobPlanItemOutcome` 不能只靠四个generic ref sets证明H12字段齐全；D-3必须提供typed accepted-result payload / association，或D-6登记受控 affected-definition并同步H12 owner。
3. `GapScanTargetSnapshot`七类语义字段必须逐项保留，不得压成target ref、plan digest或generic progress ref。
4. `GapScanOutcome`的typed failure/block reason不能被generic `JobFailureReason`无损性未经证明地替代。
5. H12 record factory的same-UoW exact-copy、OperationsJob origin和Observation committed cursor规则保持不变；claim/fence不替代metadata cursor。

## 5. D 批对象资格总账

| ID | 候选对象 | 当前资格 | canonical owner方向 | D-1 裁定 / 对象卡前置 |
|---|---|---|---|---|
| APP-C01 | `ObservationJobExecutionRef` | `FC` | `application::jobs` | `pass_D2_execution_ref`；generated local identity，public=`JobRunId` correlation，real run absent |
| APP-C02 | `ObservationJobExecutionPlanRef` | `FC` | `application::jobs` | `pass_D2_plan_ref`；independent generated PK、one execution/idempotency plan lineage |
| APP-C03 | `ObservationFencingToken` | `FC` | `application::jobs` | `pass_D2_fencing_token`；positive same-subject monotonic generation，不是裸`u64` proof |
| APP-C04 | `ObservationJobWorkKey` | `FC` | `application::jobs` | `pass_D2_work_key`；nine typed variants、global uniqueness、versioned canonical bytes |
| APP-C05 | `ObservationJobPlanItemState` | `FC` | `application::jobs` | state owner；D-3逐variant/transition compatibility，不由Step10反补 |
| APP-C06 | `ObservationJobPlanItemOutcome` | `FC` | `application::jobs` | structured classification与H12 typed payload compatibility；D-3独立卡 |
| APP-C07 | `ObservationJobPlanItem` | `FC` | `application::jobs` | immutable planned material + mutable CAS classification；D-3独立卡 |
| APP-C08 | `ObservationJobExecutionPlan` | `FC` | `application::jobs` | D-4 independent card completed；exact immutable work-set/config/compatibility owner |
| APP-C09 | `ObservationExecutionClaimState` | `FC` | `application::jobs` | Active/Released/Expired及durable authority；D-5独立卡 |
| APP-C10 | `ObservationExecutionClaim` | `FC` | `application::jobs` | 旧四字段shape不足；D-5重建claim identity/plan/subject/owner/lease/fence |
| APP-C11 | `JobExecutionConfigSnapshot` | `FC` | `application::jobs` | D-4 independent card completed；stable typed snapshot and resume carrier |

### 5.1 资格变更说明

- `ObservationJobExecutionPlanRef` 暂不按轻量 `TC`处理。它虽可能是transparent newtype，但其 mint authority、plan repository identity、rehydrate compatibility和与execution/idempotency唯一关系均有独立责任；D-2必须按 full-card最低结构审查。
- `ObservationJobExecutionRef` 不得继续透明包装悬空 `JobRunRef`。D-2必须从本仓local identity capability推导正式inner source，并显式说明与public invocation identity的关系。
- `ObservationExecutionClaimState` 即使只有三个variant，也因lease/fresh-acquire/stale-writer语义成为独立状态对象；不能与claim struct合写一张表。
- `JobExecutionConfigSnapshot` 已在 D-4 闭口为 application durable carrier；其 raw source、profile resolution 与 adapter assembly 仍不越过 infra/Step 14 边界。

## 6. D 子批次写入计划

| 子批次 | 覆盖内容 | 必须读取 | 产出要求 | 当前状态 / 停审点 |
|---|---|---|---|---|
| D-1 | status、input authority、conflicts、capability、qualification ledger、plan | SOP、A/B/C、H12、Step 08/09/11/13/14、L1粒度 | 本文件 §§1~7；零对象Rust声明 | `done_waiting_user` |
| D-2 | execution ref、plan ref、fencing token、global work key | D-1、contracts refs/id-generation规则、nine Job materialization、public Job identity | 4张独立对象卡；先关闭identity relation，再写plan ref/fence/work key | `done_waiting_user`；§§8~14 |
| D-3 | item state、item outcome、item | D-2、H12 exact reservation、Step 10 state use、Step 11 CAS use、Step 12 recovery classes | 3张独立对象卡；state/outcome/payload compatibility与planned/mutable分层 | `done_waiting_user`；§§15~21 |
| D-4 | immutable execution plan、config support owner、config snapshot | D-2/D-3、Step 14 executable values、C binding types、Step 11 persistence | support types、binding、snapshot、plan独立卡；operation matrix、digest/resume closure | `done_waiting_user`；§§22~30 |
| D-5 | claim state、claim、lease/fence invariants | D-2/D-4、Step 11 store/commit validation、Step 13 claim/reentry、Step 14 lease | 2张独立对象卡；claim identity/subject/owner/time/fence与transition矩阵 | `done_waiting_user`；§§31~38 |
| D-6 | H12 compatibility、cross-object closure、affected-use、Step 07 handoff、backfill draft、static checks、stop gate | D-2~D-5全部卡、H12、A/B/C owner、frozen downstream use | zero-unowned-field、identity/fence/config/H12闭环；`R06.6-D_done_waiting_user` | `waiting_user_confirmation_after_D5` |

### 6.1 每个后续对象卡的最低审查项

每张D-2~D-5对象卡必须独立包含：

1. capability / object source；
2. Rust-facing type definition与中文设计说明；
3. private fields或公开边界、exact field types和每个字段来源；
4. factory / rehydrate / accessor / transition signatures；
5. enum variant Rustdoc、允许来源、允许去向；
6. persistence identity、mutability、CAS/fence/digest关系；
7. public/application/domain/infra owner边界与禁止替代；
8. H12 / report / external token / source fence affected use；
9. planned test redlines和对象级停审结论。

对象卡不得使用family总表代替，也不得在一张plan卡内顺带首次定义state、outcome、claim或config support type。

## 7. D-1 blocker、下一阅读与停审（historical checkpoint）

### 7.1 blocker ledger

| blocker | 状态 | D-1 结论 | 未关闭前处理 |
|---|---|---|---|
| external upstream blocker | `none` | 正式`00/01/02`足以支持job只维护observation-side derived/propagation truth | 不升级上游 |
| `03-RPR-S06-GRANULARITY` | `open` | D-1只完成输入与计划，11对象仍未逐卡闭口 | Step 06继续blocked |
| `R06.6-D-JOB-IDENTITY-UPSTREAM` | `open_controlled` | public `JobExecutionRef`与Step13 `JobRunRef`均未发现可检索正式声明；三层identity不得alias | D-2首张卡必须先裁定relation/owner；不得复制悬空type |
| `R06.6-D-WORK-KEY-PAYLOAD-OWNER` | `open_controlled` | frozen work-key仍使用historical `ReferenceSnapshotRef`，且`PeripheralConsumerScopeRef`无current owner | D-2改用`ReferenceSnapshotStateRef`；先裁定peripheral scope语义，不得猜wrapper |
| `R06.6-JOB-CONFIG-OWNER` | `open_controlled_by_D1` | durable snapshot owner方向=`application::jobs`，Step14只派生/装配；exact schema未完成 | D-4前不得写plan final schema |
| `R06.6-D-CONFIG-SUPPORT-OWNER` | `open_controlled` | 10个typed executable support type仍只在frozen Step14首次定义 | D-4写snapshot前逐项闭口或调整D/R06.7顺序 |
| `R06.6-D-H12-COMPAT` | `resolved_in_D3_fieldwise_with_D6_integration_followup` | D-3已保留H12五个顶层字段、snapshot七类语义、typed outcome、completed_at与same-UoW复制要求；跨对象闭环留D-6 | D-6只做cross-object/affected-use closure，不得改变字段语义 |
| `R06.6-D-CLAIM-SHAPE` | `open_controlled` | old claim缺identity/plan/owner/lease/heartbeat | D-5禁止沿用旧四字段shape |
| `R06.6-DISPOSITION-LAYER` | `open_controlled_out_of_scope` | D不定义public/durable/entry disposition分层 | 留E批 |
| `R06.6-APP-ERROR-OWNER` | `open_out_of_scope` | D对象卡不得扩展ApplicationError variants | 留E批 |
| `R06.6-DIGEST-CANONICALIZER` | `open_controlled` | D只记录plan/outcome/snapshot需要canonical digest，不定义encoding profile | 留F批/Step13 affected review |

### 7.2 D-2 开始前必须读取

用户确认后，下一批只进入 D-2，并先读取：

- 本文件 §§1~7，特别是§4.1 identity三层隔离、§4.3 proof分层、§5资格总账；
- contracts专项中 `BodyFreeRef`、typed ref模板、`AdapterFamily`、所有9类work-key payload类型的current owner卡；
- A批 `ObservationJobOperation`、`ObservationOperationContext::for_job`、idempotency scope不含execution ref的规则；
- Step 08 `ObservationJobMetadata` 与9个Job input，确认public invocation identity仅为use-site；
- Step 09/13 nine-job materialization table，确认work-key variants和global uniqueness；
- Step 07 / IdGenerator use-site中是否已有local execution / plan ref生成函数，只作D-2 affected-input；
- `/home/aris/Projects/quantalithos-core` 可检索结果，确认没有可直接引用的 `JobExecutionRef` / `JobRunRef` 正式实现声明。

D-2读取work-key payload时必须显式确认：`ReferenceSnapshotStateRef`是唯一canonical snapshot identity；`PeripheralConsumerScopeRef`当前无owner，必须先完成scope语义裁定，不能从类型名生成一个`BodyFreeRef` wrapper。

未经用户确认，不得读取或写入 D-2 对象卡。即使确认，也不得进入 D-3~D-6、R06.6-E/F、R06.7/R06.8、Step 07、正式 `03`、任何 `04` 文件或实现代码。

### 7.3 D-1 stop gate

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `R06.6-D1_done_waiting_user` | D批输入权威、后置材料降级、9项capability、11对象资格、identity/config/claim/H12冲突和D-2~D-6计划已完成；没有写任何对象卡 | `wait_user_confirmation_before_R06.6-D2_execution_plan_identity_fence_work_key_cards` |

当前正式文档仍为 `03-详细设计.md`，当前 Step 仍为 Step 06。D-1完成后必须停审；当前不需要提交。

## 8. D-2 输入复核与冲突裁决

### 8.1 本批实际读取与权威排序

| 顺序 | current input | 本批消费内容 | 本批不得继承 |
|---:|---|---|---|
| 1 | 本文件 §§1~7 | identity 三层隔离、proof 分层、4 个对象资格与 D-2 范围 | D-1 的 `waiting_user` 指针已经被本次授权消费 |
| 2 | `03_ddd_step_06_contracts_carriers.md` §§4~7、§§10.5~10.6、§13.1、§19.2、§29 | `BodyFreeRef`/typed-ref 模板、9 类 payload owner、`JobRunId` external type、outbox refs | historical `ReferenceSnapshotRef`、无 owner `PeripheralConsumerScopeRef` |
| 3 | A 批 §§6.5、8~9 | nine Job operations、`for_job`、idempotency scope 只含 operation/actor/key | execution ref、plan ref、fence、attempt 不进入 logical idempotency scope |
| 4 | frozen Step 08 §7.4 / §7.9 | public metadata use-site、nine Job input 与 report surface | `JobExecutionRef` 名称、`ReferenceSnapshotRef` 与 `PeripheralConsumerScopeRef` 旧 shape |
| 5 | frozen Step 09 §11~12、Step 13 §18 | global item competition、plan materialization、no-relist/fenced reentry | 同名旧 Rust declarations、execution/public identity alias、后置 canonicalizer 实现 |
| 6 | frozen Step 07 §7.3、Step 11 §16.5 | typed id generation use-site、plan/execution unique relation、global claim uniqueness | 缺失 execution-ref generator、旧 `JobRunRef` 参数、repository exact trait shape |
| 7 | `/home/aris/Projects/quantalithos-core` current source | `core_contracts::metadata::JobRunId` 存在；`JobExecutionRef`/`JobRunRef` 不存在 | 不把 core implementation state 或测试数据写成 L4 evidence |

### 8.2 identity owner 裁决

| identity role | canonical type / owner | creation source | relation | 禁止事项 |
|---|---|---|---|---|
| public invocation correlation | `core_contracts::metadata::JobRunId`，由 Step 08 public metadata 直接引用 | scheduler / operator entry经协议校验后的输入 | 首次accepted start可原样保存为correlation，但不成为local PK；duplicate incoming value不覆盖原accepted value | 不再生成 `JobExecutionRef` / `JobRunRef` alias；不声称 external/runtime真实 run |
| application-local accepted execution identity | `ObservationJobExecutionRef` / `application::jobs` | `IdGeneratorPort.new_job_execution_ref()`，只在 idempotency `Acquired` 后且 plan start UoW 内生成 | 一个 accepted execution绑定一个 reservation、一个 immutable plan lineage和一个 report lineage | 不由 public `JobRunId`、key、digest、clock、attempt、claim或report ref派生 |
| durable plan identity | `ObservationJobExecutionPlanRef` / `application::jobs` | `IdGeneratorPort.new_job_execution_plan_ref()`，与 execution ref 在同一 start UoW 建立关系 | one-to-one with accepted execution；repository lookup / rehydrate anchor | 不从 execution ref、plan digest、item set或report ref派生 |
| real external/runtime execution | absent from D objects | 仅未来真实执行系统/evidence owner可产生 | 与前三者无自动映射 | 不伪造、不保留 placeholder、不把任何 local/public ref命名为真实 `run_id` |

该裁决关闭旧链条 `JobExecutionRef -> JobRunRef -> ObservationJobExecutionRef`。Public metadata 的 current affected definition必须改为 `job_run_id: JobRunId`，application start input同时携带该 correlation value与独立生成的 `ObservationJobExecutionRef`。Step 08边界必须对`JobRunId.as_str()`执行`1..=256`字节、ASCII token `[A-Za-z0-9][A-Za-z0-9._:-]*`、no whitespace/control/slash/locator校验；校验不把它转换成`BodyFreeRef`，日志只允许redacted correlation。该值不进入idempotency scope/request digest；同logical request的later duplicate即使携带不同`JobRunId`，也只重放原result并不得覆盖首次accepted correlation。两类identity无 `From`、无 lossless wrapper、无 same-value invariant。

### 8.3 peripheral work identity 裁决

`DashboardAlertExportView` current owner已把 durable projection identity固定为 `consumer_ref + ObservationProjectionScope`，其中 consumer 的稳定 identity 是 `PeripheralConsumerRefId`。`PeripheralConsumerState`、`ExportAllowedFlag`、`PeripheralConsumerKind` 与 catalog `ConsumerScope`必须在 start materialization 时验证并进入 planned input/config compatibility，但它们可能随 catalog/policy演进，不能构成 global active-claim key。

因此 D-2 采用：

```text
PeripheralView {
  consumer_ref_id: PeripheralConsumerRefId,
  projection_scope: ObservationProjectionScope,
}
```

而不是新建 `PeripheralConsumerScopeRef`。Frozen Step 08 `RebuildPeripheralViewsJobInput.consumer_scopes` 必须在后续逐协议审查中改成能提供完整 `PeripheralConsumerRef + ObservationProjectionScope` 的 typed item；D-2只登记该 affected definition，不提前重写 Step 08。Plan material仍需保存完整 validated consumer snapshot，work key只保存稳定 global identity。

### 8.4 D-2 capability 到对象映射

| 对象 | 承接 capability | 对象类别 | 本批闭口能力 | 明确不承接 |
|---|---|---|---|---|
| `ObservationJobExecutionRef` | establish local execution identity | application-owned generated identity | generated/rehydrated opaque identity、no-alias、one accepted lineage anchor | public invocation、idempotency scope、claim owner、真实 run |
| `ObservationJobExecutionPlanRef` | establish immutable plan identity | application-owned generated identity | generated/rehydrated opaque PK、execution one-to-one lookup anchor | plan digest、work-set、report identity、execution identity |
| `ObservationFencingToken` | protect stale local writers | durable monotonic value object | positive value、checked successor、ordering、rehydrate validation | claim identity、row version、lease time、source/external proof |
| `ObservationJobWorkKey` | address globally competing work | finite typed coordination enum | exact 9 variants、canonical bytes/order、stable global identity | planned material、config、candidate completeness、authorization、business truth |

## 9. `ObservationJobExecutionRef` 对象卡

### 9.1 capability / object source

该对象标识“一次已通过 idempotency `Acquired` 门禁、准备持久化 immutable plan 的本仓 application execution”。它存在是为了让 plan、claim、item classification与report共享同一 local lineage，而不是复用 scheduler correlation或伪造真实 runtime run。

### 9.2 Rust-facing definition

```rust
/// Stable local identity of one accepted observability operations-job execution.
#[repr(transparent)]
pub struct ObservationJobExecutionRef(BodyFreeRef);
```

| field / property | exact type | source | 约束 |
|---|---|---|---|
| private inner ref | `BodyFreeRef` | `IdGeneratorPort.new_job_execution_ref()` | 必须通过 `BodyFreeRef` generated-value validation；每个成功提交的新execution只有一个durable value |
| canonical owner | `application::jobs` | Step 06 D-2 | public contracts不使用该类型；不得把 declaration上提来迁就旧 public metadata |
| persistence role | execution unique key | plan/report/claim repository mapping | one accepted reservation最多一个 execution ref；duplicate replay复用原 execution lineage，不再 mint |

### 9.3 factory / static functions

| exact signature | 作用 | 参数来源 | 返回 / 失败 | 使用场景 |
|---|---|---|---|---|
| `pub fn try_from_generated(value: BodyFreeRef) -> Result<Self, ApplicationError>` | 包装本仓新生成 identity | infra `IdGeneratorPort` implementation | malformed generated ref -> consistency/infrastructure error | idempotency `Acquired` 后由typed generator返回 |
| `pub fn try_rehydrate(value: BodyFreeRef) -> Result<Self, ApplicationError>` | 校验 durable identity shape | persistence adapter decoded value | malformed/locator-like -> persistence consistency error | load plan/report/claim |

### 9.4 member functions

| exact signature | 作用 | 返回 | 副作用 / 不变量 |
|---|---|---|---|
| `pub fn as_body_free_ref(&self) -> &BodyFreeRef` | typed repository/digest borrow | inner ref borrow | 无；不暴露裸 `str` |
| `pub fn into_body_free_ref(self) -> BodyFreeRef` | persistence ownership transfer | validated inner ref | 无跨 wrapper conversion |
| `pub fn canonical_bytes(&self) -> Vec<u8>` | canonical equality/digest/repository input | type discriminator + inner canonical bytes | encoding profile owner留 F 批；禁止 debug/string hashing |

### 9.5 relation、persistence 与 no-alias invariants

1. mint 只发生在 idempotency repository返回 `Acquired` 之后；Replay/Conflict/InFlight均不得生成 execution ref。Start UoW rollback可消耗一个永不落库的generated value；“恰好一个”约束的是每个成功提交execution的durable identity，不要求ID序列无空洞。
2. accepted start UoW必须建立 `idempotency_ref -> execution_ref -> plan_ref -> report_ref` 的唯一 lineage；后续对象卡闭口字段，但 D-2 已固定 identity不可替换。
3. public `JobRunId`只作 invocation correlation，可原样保存在 plan/report material；它与 execution ref允许值不同且预期通常不同。
4. 不实现 `From<JobRunId>`、`From<IdempotencyRef>`、`From<JobReportRef>`、`Display`、`AsRef<str>`或基于时间/key/digest的构造。
5. execution ref不进入 `ObservationIdempotencyScope`、request digest、plan work key、external effect token或真实 evidence alias。
6. rehydrate只验证值形态；是否存在、是否绑定正确 reservation/plan/report由repository/application cross-object guard验证。

### 9.6 planned test redlines / stop

| test cut | 必须证明 |
|---|---|
| generated / rehydrate shape | legal body-free value round-trip；empty、locator、slash、whitespace拒绝 |
| mint gate | Replay/Conflict/InFlight路径零 mint；每个committed Acquired start只有一个durable identity；rollback产生的未落库ID不可见且不可复用 |
| no alias | 相同文本的 `JobRunId`、plan ref、report ref不能静态/运行时隐式转换 |
| canonical discriminator | execution ref与其他 wrapper inner相同仍有不同 canonical bytes |
| debug safety | Debug redacted；无 Display / raw string escape |
| lineage uniqueness | 一个 idempotency reservation不能绑定第二 execution；duplicate load返回原 identity |

对象停审结论：`pass_D2_execution_ref`。`R06.6-D-JOB-IDENTITY-UPSTREAM` 的 application-local部分关闭；public identity裁决见 §8.2，下游 affected definition见 §13.1。

## 10. `ObservationJobExecutionPlanRef` 对象卡

### 10.1 capability / object source

该对象标识一个 durable immutable execution plan。虽然其存储 shape 是 transparent ref，但它拥有独立 mint authority、repository PK、rehydrate边界和 execution one-to-one关系，因此本轮按 full object card审查，不降级成未说明责任的通用 `TC`。

### 10.2 Rust-facing definition

```rust
/// Stable local identity of one durable immutable observability job execution plan.
#[repr(transparent)]
pub struct ObservationJobExecutionPlanRef(BodyFreeRef);
```

| field / property | exact type | source | 约束 |
|---|---|---|---|
| private inner ref | `BodyFreeRef` | `IdGeneratorPort.new_job_execution_plan_ref()` | accepted start UoW内每个成功提交的新execution恰好一个durable plan ref |
| canonical owner | `application::jobs` | Step 06 D-2 | 不是 public DTO identity；application repository/model独占生命周期 |
| persistence role | plan PK / lookup anchor | start UoW plan creation | unique execution ref、unique idempotency ref约束在 D-4/Step 11承接 |

### 10.3 factory / static functions

| exact signature | 作用 | 参数来源 | 返回 / 失败 | 使用场景 |
|---|---|---|---|---|
| `pub fn try_from_generated(value: BodyFreeRef) -> Result<Self, ApplicationError>` | 包装 id generator输出 | infra `IdGeneratorPort` implementation | malformed output fail closed | 与 execution ref同一 accepted start materialization |
| `pub fn try_rehydrate(value: BodyFreeRef) -> Result<Self, ApplicationError>` | 校验 persisted PK | persistence mapper | malformed / wrong encoded owner -> consistency error | plan lookup、report resume |

### 10.4 member functions

| exact signature | 作用 | 返回 | 副作用 / 不变量 |
|---|---|---|---|
| `pub fn as_body_free_ref(&self) -> &BodyFreeRef` | typed key borrow | inner ref | 无 |
| `pub fn into_body_free_ref(self) -> BodyFreeRef` | persistence mapping | inner ref | 不提供 cross-wrapper conversion |
| `pub fn canonical_bytes(&self) -> Vec<u8>` | typed canonical identity | discriminator + inner bytes | 不等于 `plan_digest` |

### 10.5 identity 与 lifecycle invariants

1. `plan_ref` 与 `execution_ref` 分开生成；禁止从 execution inner value复制、加前后缀或hash派生。Rollback可消耗未落库plan ref，但该值不可在resume/duplicate中复用或暴露。
2. `plan_ref`只标识 plan row，不证明 work-set完整、config snapshot有效、item classification终态或report一致；这些由 D-3/D-4/D-6对象与guard负责。
3. start commit后 plan ref永久不变。Resume只能按该 ref或唯一 execution index加载原 plan，不得创建replacement plan ref来吸收 current candidates/config。
4. plan digest、request digest、idempotency ref、report ref、claim ref和真实 run id均不能替代 plan ref。
5. rehydrate不 mint，不读取 current config，不重新 list candidate，不修复缺失 plan。

### 10.6 planned test redlines / stop

| test cut | 必须证明 |
|---|---|
| generator use | each committed new execution恰好一个durable plan ref；rollback未落库值不可见；duplicate/resume零 mint |
| no derivation | execution ref、plan digest、clock、item count不能构造 plan ref |
| wrapper separation | 与 execution/report/maintenance ref相同 inner仍不可互换 |
| rehydrate | legal round-trip；malformed/locator拒绝；不读取 config/candidates |
| one-to-one | 同 execution第二 plan ref被repository unique guard拒绝；同 idempotency ref第二 plan同样拒绝 |
| immutable lookup | terminal/resume始终回到原 plan ref |

对象停审结论：`pass_D2_plan_ref`。Step 07 的 `IdGeneratorPort.new_job_execution_plan_ref()` use-site保留，并新增 execution-ref generator affected requirement；不在本批直接修改冻结 Step 07。

## 11. `ObservationFencingToken` 对象卡

### 11.1 capability / object source

该对象是 durable claim store在一次成功 fresh acquire时签发的本地写入世代号。它只用于拒绝同一 claim subject上的 stale local writer；没有 claim subject、claim identity、owner与current durable row的联合校验时，一个 token值本身不授予任何写权限。

### 11.2 Rust-facing definition

```rust
/// Positive durable fencing generation issued for one acquired claim ownership epoch.
#[repr(transparent)]
pub struct ObservationFencingToken(NonZeroU64);
```

| field / property | exact type | source | 约束 |
|---|---|---|---|
| private generation | `NonZeroU64` | claim repository atomic acquire result | zero永远非法；successful fresh acquire对同一 subject必须大于所有历史 committed token |
| canonical owner | `application::jobs` | Step 06 D-2 | repository/infra只实现持久化分配与比较，不重定义语义 |
| comparison domain | one exact claim subject | execution subject或global work-key subject | 不同 subject之间的数值大小没有 ownership语义 |

### 11.3 factory / static functions

| exact signature | 作用 | 参数来源 | 返回 / 失败 | 使用场景 |
|---|---|---|---|---|
| `pub fn try_from_acquire(value: u64) -> Result<Self, ApplicationError>` | 校验 claim store签发值 | successful atomic acquire adapter | zero -> invariant error | fresh execution/item claim构造 |
| `pub fn try_rehydrate(value: u64) -> Result<Self, ApplicationError>` | 校验 persisted token | claim/plan/report persistence mapper | zero/corrupt -> consistency error | resume、commit-time fence check |

`try_from_acquire`不自行读取旧值、不自增、不证明 acquire原子成功；adapter必须先在 durable authority内完成 subject uniqueness、owner epoch与monotonic allocation，再把结果交给该 factory。

### 11.4 member functions

| exact signature | 作用 | 返回 | 副作用 / 不变量 |
|---|---|---|---|
| `pub const fn get(&self) -> u64` | persistence/diagnostic-safe numeric access | positive value | 不授予 ownership |
| `pub(crate) fn is_strictly_newer_value_than(&self, previous: &Self) -> bool` | 同 subject acquire验证辅助 | `self > previous` | 调用前必须已验证 subject相同；不可跨 subject推导 |
| `pub const fn canonical_bytes(&self) -> [u8; 8]` | stable storage/key encoding | unsigned big-endian bytes | 不使用 decimal string、Debug或serde bytes |

### 11.5 durable monotonicity 与 proof boundary

1. 一个 claim ownership epoch内 token固定。Heartbeat/renew只能延长同一 owner epoch并保留同一 token；若 durable owner改变或 expired/released后重新 acquire，必须产生 strictly larger token。
2. monotonic scope是 exact claim subject：execution claim按 `execution_ref`，item claim按 global `work_key`。实现可使用全局 sequence，但正确性只能按同 subject比较。
3. token不可回绕、复用、归零或因row删除而重置。`u64::MAX` 后无法继续分配时必须 fail closed/manual，不得 wrap。
4. commit-time验证必须同时匹配 current Active claim identity、subject、owner epoch和token；裸 `MAX(token)` 或只比较数值不足。
5. token不替代 `ObservationRepositoryVersion`、source read fence/cursor、transaction outcome、lease authority、stable external effect token或external exactly-once证明。
6. token不进入 request digest、idempotency scope、plan digest、work key、external material digest或public metadata。Report后续可保存 last accepted fence作local consistency，但不能公开成run/evidence。

### 11.6 planned test redlines / stop

| test cut | 必须证明 |
|---|---|
| positive validation | zero拒绝；1与`u64::MAX`可合法rehydrate |
| fresh acquire | 同 subject successive ownership epochs严格递增 |
| renew | same owner heartbeat/renew保持token不变 |
| release/expire/reacquire | release/expire不授权old token；reacquire token更大 |
| stale commit | old owner + old token即使row version/source fence有效仍零写入 |
| proof separation | new token不能替代wrong row version/source fence/external token |
| exhaustion | `u64::MAX` 后下一 acquire fail closed，不wrap为1 |
| encoding | exact 8-byte big-endian round-trip；禁止decimal/debug key |

对象停审结论：`pass_D2_fencing_token`。Claim identity/subject/owner/lease字段与transition仍由 D-5闭口；本卡不预写 claim shape。

## 12. `ObservationJobWorkKey` 对象卡

### 12.1 capability / object source

该对象把九类 operations Job materialization出的“可跨 execution竞争的同一 observation-side work”表示为有限 typed identity。它是 global active item-claim uniqueness key和immutable plan ordering key，不是候选完整性、planned input、authorization、current state或执行结果。

### 12.2 Rust-facing definition

```rust
/// Finite global identity of one observation-side work subject shared by competing job executions.
pub enum ObservationJobWorkKey {
    /// One durable outbox publication marker and its immutable stored payload lineage.
    Outbox(OutboxRecordRef),

    /// One canonical observation projection lookup scope.
    ProjectionScope(ObservationProjectionScope),

    /// One stable safe-signal rollup window identity.
    SignalRollup(SignalRollupWindowRef),

    /// One canonical local reference-snapshot state identity.
    ReferenceSnapshot(ReferenceSnapshotStateRef),

    /// One stable tracked gap-source identity, excluding its mutable resolution state.
    GapSource(GapSourceRefId),

    /// One stable observation-side maintenance target identity used for replay coordination.
    ReplayTarget(MaintenanceTargetRefId),

    /// One local report-handoff record identity.
    ReportHandoff(ReportHandoffRecordRef),

    /// One local external-audit export preparation identity.
    ExternalExport(ExternalAuditExportPreparationRef),

    /// One peripheral consumer projection identified by stable consumer id and canonical projection scope.
    PeripheralView {
        /// Stable logical peripheral consumer identity from the validated catalog.
        consumer_ref_id: PeripheralConsumerRefId,
        /// Exact canonical observation projection scope rebuilt for that consumer.
        projection_scope: ObservationProjectionScope,
    },
}
```

### 12.3 variant contract table

| variant | exact payload source | global sameness rule | planned material另需保存 | 禁止替代 |
|---|---|---|---|---|
| `Outbox` | eligible `ObservationOutboxRecord.outbox_ref` | same typed outbox ref | event/snapshot/binding/digest/cursor/observed version | event ref、payload ref、cursor、attempt |
| `ProjectionScope` | canonical requested/bound `ObservationProjectionScope` | same `canonical_lookup_bytes()`；`ByMaintenanceTarget`只按target id | target binding、visibility/replay/min cursor、source fence inputs | view ref、scope hash、maintenance state |
| `SignalRollup` | exact materialized `SignalRollupWindowRef` | same window ref | rollup scope/window kind/min cursor/observed version | time string、scope hash、cursor |
| `ReferenceSnapshot` | exact `ReferenceSnapshotStateRef` | same canonical snapshot-state ref | refresh scope/policy/source version/observed version | historical `ReferenceSnapshotRef`、external object ref |
| `GapSource` | `GapSourceRef.gap_source_ref_id` | same stable local tracked source id | full structured source snapshot、visibility/state/current gap version | mutable `GapSourceRef`全对象、external source ref、gap state ref |
| `ReplayTarget` | `MaintenanceTargetRef.maintenance_target_ref_id` | same stable target id | full immutable target/effect/no-write snapshot、replay scope/protection refs | full object debug bytes、replay scope ref、execution record ref |
| `ReportHandoff` | exact `ReportHandoffRecordRef` | same handoff ref | scope/consumer/evidence-index/readiness/version/binding/tokens | report ref、consumer ref、delivery receipt |
| `ExternalExport` | exact `ExternalAuditExportPreparationRef` | same local preparation ref | export scope/consumer/view/version/binding/tokens | external audit id、package ref、delivery ref |
| `PeripheralView` | validated `PeripheralConsumerRef.peripheral_consumer_ref_id` + exact projection scope | both stable components equal | full consumer kind/scope/export/state snapshot、source cursor/current view/dependency versions | unowned `PeripheralConsumerScopeRef`、consumer state、view ref、product route |

### 12.4 factory / static functions

| exact signature | 作用 | 关键 validation | 使用场景 |
|---|---|---|---|
| `pub(crate) fn for_outbox(outbox_ref: OutboxRecordRef) -> Self` | outbox item key | typed ref already validated | publication candidate materialization |
| `pub(crate) fn for_projection_scope(scope: ObservationProjectionScope) -> Result<Self, ApplicationError>` | projection item key | scope canonical lookup可编码；aggregate member compatibility由plan assembler验证 | read-model rebuild |
| `pub(crate) fn for_signal_rollup(window_ref: SignalRollupWindowRef) -> Self` | rollup item key | typed stable ref | rollup candidate materialization |
| `pub(crate) fn for_reference_snapshot(snapshot_ref: ReferenceSnapshotStateRef) -> Self` | snapshot item key | canonical current type only | reference refresh |
| `pub(crate) fn for_gap_source(source: &GapSourceRef) -> Result<Self, ApplicationError>` | 提取stable gap-source id | structured source通过current owner validation；只clone id | gap scan |
| `pub(crate) fn for_replay_target(target: &MaintenanceTargetRef) -> Result<Self, ApplicationError>` | 提取stable target id | target kind/effect/no-write compatibility先通过 | replay coordination |
| `pub(crate) fn for_report_handoff(handoff_ref: ReportHandoffRecordRef) -> Self` | handoff item key | typed stable ref | handoff delivery preparation |
| `pub(crate) fn for_external_export(preparation_ref: ExternalAuditExportPreparationRef) -> Self` | export item key | typed stable local ref | external audit export delivery |
| `pub(crate) fn for_peripheral_view(consumer: &PeripheralConsumerRef, projection_scope: ObservationProjectionScope) -> Result<Self, ApplicationError>` | peripheral projection item key | consumer非Retired、catalog scope与projection scope兼容；只保存stable id+scope | peripheral view materialization |

Persistence rehydrate不提供`discriminator + Vec<BodyFreeRef>`或raw string总入口。Adapter必须先按format version/variant code检查arity，再使用payload current owner的typed decoder恢复参数，最后调用下列exact factory：

| exact rehydrate factory | typed persisted input | validation boundary |
|---|---|---|
| `pub fn try_rehydrate_outbox(outbox_ref: OutboxRecordRef) -> Result<Self, ApplicationError>` | one decoded outbox ref | exact owner；不接受event/snapshot ref |
| `pub fn try_rehydrate_projection_scope(scope: ObservationProjectionScope) -> Result<Self, ApplicationError>` | one decoded structured scope | canonical lookup encoding必须成功 |
| `pub fn try_rehydrate_signal_rollup(window_ref: SignalRollupWindowRef) -> Result<Self, ApplicationError>` | one decoded rollup ref | exact owner |
| `pub fn try_rehydrate_reference_snapshot(snapshot_ref: ReferenceSnapshotStateRef) -> Result<Self, ApplicationError>` | one decoded current snapshot-state ref | historical alias无decoder路径 |
| `pub fn try_rehydrate_gap_source(source_ref_id: GapSourceRefId) -> Result<Self, ApplicationError>` | one decoded stable local source id | 不要求热读current mutable `GapSourceRef` |
| `pub fn try_rehydrate_replay_target(target_ref_id: MaintenanceTargetRefId) -> Result<Self, ApplicationError>` | one decoded stable target id | 不要求热读current mutable target snapshot |
| `pub fn try_rehydrate_report_handoff(handoff_ref: ReportHandoffRecordRef) -> Result<Self, ApplicationError>` | one decoded handoff ref | exact owner |
| `pub fn try_rehydrate_external_export(preparation_ref: ExternalAuditExportPreparationRef) -> Result<Self, ApplicationError>` | one decoded local preparation ref | provider/external id拒绝 |
| `pub fn try_rehydrate_peripheral_view(consumer_ref_id: PeripheralConsumerRefId, projection_scope: ObservationProjectionScope) -> Result<Self, ApplicationError>` | exactly two decoded typed parts | scope canonical encoding必须成功；完整persisted consumer snapshot由plan guard另行校验 |

这些 factory只恢复work identity，不读取current catalog/source/business truth。Plan/claim load后仍须把key与immutable planned material逐项校验；缺失、wrong owner或non-canonical payload均为consistency failure，不允许用current object重新推导并替换stored key。

### 12.5 member functions 与 canonical identity

| exact signature | 作用 | 返回 / 规则 |
|---|---|---|
| `pub const fn discriminator(&self) -> &'static str` | stable persistence/debug-safe variant tag | exact tokens：`outbox`、`projection_scope`、`signal_rollup`、`reference_snapshot`、`gap_source`、`replay_target`、`report_handoff`、`external_export`、`peripheral_view` |
| `pub fn canonical_bytes(&self) -> Vec<u8>` | global uniqueness、sorting与persistence input | exact encoding见下表；不得使用 Debug、JSON、route或database id |
| `pub fn same_global_work_as(&self, other: &Self) -> bool` | structural global identity比较 | exact canonical bytes equality |
| `pub fn canonical_cmp(&self, other: &Self) -> Ordering` | plan sorted/unique | unsigned lexicographic canonical bytes order |

Canonical bytes格式只服务 work identity，不替代 F批的通用 request/plan/outcome digest canonicalizer：

```text
byte 0      = work-key format version 0x01
byte 1      = variant code 0x01..0x09,按本卡variant顺序
each part   = u32 big-endian byte length + exact payload canonical bytes
single-part variants have exactly one part
PeripheralView has exactly two parts: consumer_ref_id, projection_scope
```

Payload canonical source：transparent ref使用wrapper discriminator + inner `BodyFreeRef` bytes；`ObservationProjectionScope`使用其 current `canonical_lookup_bytes()`。Unknown version/code、wrong part count、empty part、wrong typed owner或non-canonical scope均 fail closed。Rust `PartialEq/Eq/Hash/Ord` 若实现，必须基于该 canonical identity；不能直接 derive full structured payload equality，因为 `ByMaintenanceTarget` lookup identity只按stable target id。

### 12.6 global uniqueness、immutability 与 boundary invariants

1. active item claim唯一键只使用 `canonical_bytes(work_key)`，不附加 `execution_ref`。同一 work key在不同 operation execution/idempotency key之间也只能有一个 Active owner。
2. 同一 immutable plan内 work key canonical sorted/unique；重复 candidate必须在start materialization中去重或按协议规则拒绝，不能生成两个item。
3. work key进入 plan digest的 typed identity部分，但不包含 planned input digest、observed version、config、claim/fence、clock、attempt、worker或outcome。
4. key只标识本仓 observation-side effect subject，不授予读取/写入source truth，不证明candidate仍eligible，不绕过visibility/retention/no-write/policy。
5. `ReferenceSnapshotStateRef`是唯一 current snapshot payload；不得产生 `ReferenceSnapshotRef` alias。
6. `PeripheralConsumerScopeRef`不生成。Peripheral global identity固定为 stable consumer id + projection scope；完整 consumer snapshot进入planned material而非claim key。
7. `GapSource`与`ReplayTarget`只使用stable id，避免mutable state/policy snapshot改变global identity；完整 snapshot必须由D-3/D-4 plan item material保留。
8. key不替代 row version、source fence、fencing token、external effect token、binding equality或report completeness。

### 12.7 planned test redlines / stop

| test cut | 必须证明 |
|---|---|
| variant totality | nine exact variants/token/code一一映射；unknown/Other拒绝 |
| owner separation | snapshot historical alias、gap state ref、replay scope、external audit id、provider route均不能构造对应key |
| projection stability | same maintenance target id即使snapshot presentation不同仍same key；不同id不同key |
| gap/replay stability | mutable source/target snapshot变化不改变stable id key；planned digest可变化 |
| peripheral composite | same consumer id + same projection scope冲突；任一分量变化均不同；consumer state/flag变化不改变key |
| canonical encoding | version/tag/length-prefix exact golden vectors；truncation、extra part、wrong owner拒绝 |
| global uniqueness | 两个不同 execution竞争同key只有一个Active claim；不能用 `(execution,key)` 唯一约束绕过 |
| plan ordering | 输入顺序变化得到同canonical sorted set和plan identity input |
| proof separation | 拿到work key不代表claim/fence/version/source/external call合法 |

对象停审结论：`pass_D2_work_key`。`R06.6-D-WORK-KEY-PAYLOAD-OWNER`关闭为 `resolved_in_D2_with_downstream_affected_definitions`。

## 13. D-2 affected definitions 与后续承接

### 13.1 downstream affected definition register

| affected location | historical/current conflict | D-2 current correction | 何时传播 |
|---|---|---|---|
| Step 07 `IdGeneratorPort` | 只有direct-return plan ref generator，缺local execution ref generator且无法传播generated-value validation失败 | 改为`new_job_execution_ref() -> Result<ObservationJobExecutionRef, ApplicationError>`与`new_job_execution_plan_ref() -> Result<ObservationJobExecutionPlanRef, ApplicationError>` | R06.8后 Step 07 affected review |
| Step 07 runner/report helper | 使用悬空 `JobRunRef` | public correlation直接用`JobRunId`；local lineage独立用execution ref，无wrapper转换 | R06.7 entry carrier review |
| Step 08 `ObservationJobMetadata` | `JobExecutionRef`无owner | 字段改为 `job_run_id: JobRunId`；语义仅 invocation correlation | Step 08逐协议重组 |
| Step 08 reference refresh | `ReferenceSnapshotRef` historical alias | 全部改用`ReferenceSnapshotStateRef` | Step 08逐协议重组 |
| Step 08 peripheral rebuild | `Vec<PeripheralConsumerScopeRef>`无owner | named protocol item必须提供完整 `PeripheralConsumerRef + ObservationProjectionScope`；不得只给scope字符串/ref | Step 08逐协议重组 |
| Step 09/13 materialization | snapshot/peripheral旧payload；gap/replay使用full mutable structured object | 按 §12.2 exact key variants，并把完整snapshot移入planned material | Step 09/13 affected review |
| Step 11 claim persistence | old execution alias；work key可能按execution-local unique | execution/plan refs为generated local opaque identity；item Active unique按canonical work key，token按subject monotonic | Step 11 affected review |
| Step 17/19/formal `03` | 只声明local identity非真实run，但未闭口public relation | 回指§8.2三层identity和四对象卡 | R06.8后逐Step审计/Step19重装配 |

### 13.2 D-2 object-to-Step 07 handoff

| Step 07 contract group | 必须消费 | 实现暂停条件 |
|---|---|---|
| ID generator | 两个独立fallible函数分别生成execution/plan ref，infra implementation经对象factory验证后返回 | direct unchecked return、缺execution generator、从public run/key/time派生、两个ref同值复制 |
| job execution repository | typed get/find/save/acquire接口不得用裸string/u64/debug key | trait仍使用`JobRunRef`/`JobExecutionRef`或execution-local work uniqueness |
| UoW fence registration | exact claim subject/owner/token与UoW绑定 | 只登记token数值或在commit前不复核current Active claim |
| fake/durable parity | identity mint、work-key bytes、global uniqueness、token monotonic/exhaustion行为一致 | fake允许duplicate Active、token复用或非canonical排序 |

### 13.3 object group field-source audit

| object | 字段/variant来源是否闭口 | rehydrate边界 | 仍待后续闭口 |
|---|---|---|---|
| `ObservationJobExecutionRef` | yes；application id generator only | BodyFreeRef shape + repository lineage guard | exact plan/report fields D-4/E |
| `ObservationJobExecutionPlanRef` | yes；application id generator only | BodyFreeRef shape + unique execution/idempotency indexes | plan schema D-4 |
| `ObservationFencingToken` | yes；durable successful acquire only | positive u64 + same-subject current claim validation | claim identity/owner/lease D-5 |
| `ObservationJobWorkKey` | yes；nine typed candidate identities | tagged versioned canonical schema | planned input material D-3/D-4 |

## 14. D-2 blocker closure、自检与停审（historical checkpoint）

### 14.1 blocker ledger after D-2

| blocker | D-2 status | 结论 / 下一约束 |
|---|---|---|
| external upstream blocker | `none` | core `JobRunId`与本仓 current contracts/object owners足以闭口本批 |
| `R06.6-D-JOB-IDENTITY-UPSTREAM` | `resolved_in_D2` | public=`JobRunId`;local=`ObservationJobExecutionRef`;real run absent；无alias/wrapper conversion |
| `R06.6-D-WORK-KEY-PAYLOAD-OWNER` | `resolved_in_D2_with_downstream_affected_definitions` | snapshot canonical type修正；peripheral key=`consumer id + projection scope`；不生成悬空ref |
| `03-RPR-S06-GRANULARITY` | `open` | 四张D-2对象卡完成；D-3~D-6、E/F、R06.7/R06.8仍未完成 |
| `R06.6-JOB-CONFIG-OWNER` | `open_controlled_by_D1` | D-4闭口snapshot exact schema；本批未越界 |
| `R06.6-D-CONFIG-SUPPORT-OWNER` | `open_controlled` | D-4前处理 |
| `R06.6-D-H12-COMPAT` | `open_controlled` | D-3/D-6处理 |
| `R06.6-D-CLAIM-SHAPE` | `open_controlled` | D-5处理；本批只固定token/work subject基础 |
| `R06.6-DIGEST-CANONICALIZER` | `open_controlled` | work-key局部identity编码已闭口；通用request/plan/outcome/snapshot canonicalizer仍留F |

### 14.2 D-2 self-review

| 审查项 | 结论 | 依据 |
|---|---|---|
| 是否四个对象独立成卡 | pass | §§9~12各自含definition、fields、factory/member、invariants/tests |
| identity是否三层隔离 | pass | §8.2；删除旧alias链，真实run保持absent |
| 是否存在无owner字段/variant | pass | 所有payload回指current owner；peripheral无owner类型已消除 |
| work key是否global | pass | §12.6按canonical key唯一，不含execution ref |
| fence是否可替代其他proof | no | §11.5显式分离row/source/external/token/lease |
| 是否提前写item/plan/claim/report | no | D-3~D-5对象仍未定义 |
| 是否修改正式`03`或冻结Step 07+ | no | 只登记affected definitions |
| 是否伪造实现/测试/evidence | no | 全部测试为planned redline，未声称运行 |

### 14.3 下一批开始前必须读取

用户确认后只进入 D-3，并读取：

- 本文件 §§8~14，特别是 stable work identity与planned material分层；
- R06.5-G H12 `GapScanAcceptedItemResult`、`GapScanTargetSnapshot`、typed outcome与same-UoW exact-copy reservation；
- frozen Step 10 Job item/report state use-site，确认后置state不能反向补型；
- frozen Step 11 item CAS / outcome persistence与Step 12 recovery classes；
- nine Job flow对成功、retryable、permanent、blocked、equivalent terminal的逐项分类输入；
- B/C批 outbox/external effect result owners，避免item outcome复制其 lifecycle truth。

D-3只允许写`ObservationJobPlanItemState`、`ObservationJobPlanItemOutcome`、`ObservationJobPlanItem`三张独立对象卡和H12 compatibility decision；不得进入D-4~D-6、E/F、R06.7/R06.8、Step07、正式`03`或任何`04`。

### 14.4 D-2 stop gate（historical checkpoint）

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `R06.6-D2_done_waiting_user` | execution/plan identity、positive subject-scoped fencing token与nine-variant global work key四张对象卡已闭口；两个D-2 blocker已解决并登记downstream affected definitions | `wait_user_confirmation_before_R06.6-D3_job_item_state_outcome_item_cards` |

当前正式文档仍为`03-详细设计.md`，当前Step仍为Step 06。D-2完成后必须停审；当前不需要提交。

## 15. D-3 输入复核与当前写入范围

### 15.1 本批权威输入

| 顺序 | 输入 | 本批使用 | 不能反向定义的内容 |
|---:|---|---|---|
| 1 | 本文件 §§8~14 与 D-2 object cards | execution/plan identity、global work key、planned material 分层与 affected register | 不改变 D-2 identity/work-key 语义 |
| 2 | `03_ddd_step_06_policy_guard_records.md` H12 §71 / §73 | `GapScanAcceptedItemResult`、`GapScanTargetSnapshot`、`GapScanOutcome`、same-UoW exact-copy、OperationsJob/OperationsOnly/cursor 规则 | H12 不拥有 job/plan/item/claim/report lifecycle |
| 3 | `03_ddd_step_10_state_matrix.md` §12.5-a | item 七状态与迁移、finalize gate、retry/reentry 条件 | Step 10 是 use-site，不是 Step 06 object owner |
| 4 | `03_ddd_step_11_persistence_transaction_consistency.md` §§9.3、11、18 | item row CAS、`ObservationRepositoryVersion`来源、plan/item/report UoW相对顺序 | repository/table 名称不是对象定义来源 |
| 5 | `03_ddd_step_12_error_recovery.md` §13 与 Step 09 nine-job classifications | retryable/permanent/blocked/equivalent-terminal 分类和 unknown outcome 红线 | 不恢复 generic `JobFailureReason` |
| 6 | R06.6-B/C current cards | outbox snapshot、publication/external result、binding/token 的 exact refs | item outcome 不复制 publication/external lifecycle |

### 15.2 D-3 结论摘要

1. `ObservationJobPlanItemState` 是 application coordination state，只有七个固定变体；它不是业务 truth、H12 record state、public job outcome 或 report state。
2. `ObservationJobPlanItemOutcome` 只保存 observation-side item classification。reason/result 必须通过已有 owner-qualified typed association 承载；不得新增公共 generic `JobFailureReason`。
3. `ObservationJobPlanItem` 的 durable identity 为 `(plan_ref, work_key)`。`work_key`、planned material、planned digest 和 captured observed version immutable；state/outcome 是唯一可通过受保护 CAS 修改的部分。
4. planned material 使用 item 内部的 private tagged carrier。它保存 exact typed candidate material、target/scope/consumer snapshot、source/reference cursor 或 version、binding/effect material及 H12 所需完整上下文；resume 禁止 relist、热读 current truth 或 current config 重建。
5. `ObservationRepositoryVersion` 仅用于 item row CAS。它不能替代计划 material 中的 `observed_version`、source version、cursor、external token 或 claim/fence。

### 15.3 当前不处理

| 项 | 当前处理 |
|---|---|
| execution plan / config snapshot | D-4 |
| claim state / claim / lease / heartbeat | D-5；本批只要求 classification 提交时联合校验 current claim/fence |
| generic digest canonicalizer | 留 `R06.6-DIGEST-CANONICALIZER`；本批只冻结覆盖字段 |
| ApplicationError owner 与新增 error variant | 留 `R06.6-APP-ERROR-OWNER`；本批沿用既有错误层级作为签名占位 |
| public Job outcome / report service / repository trait | 后续 affected review；本批不定义 |

## 16. `ObservationJobPlanItemState` 对象卡

### 16.1 owner、字段与职责

`ObservationJobPlanItemState` 的唯一 owner 是 `application::jobs`。它表示一个已进入 immutable plan 的 item 在本地协调层所处的 durable classification state。它不表示 source state、projection freshness、H12 `GapScanOutcome`、external effect state、acceptance verdict、signoff 或业务 truth。

```rust
/// Durable coordination state of one item in an accepted immutable job plan.
pub enum ObservationJobPlanItemState {
    /// The item is frozen and has not acquired execution ownership.
    Planned,
    /// A current durable claimant may execute or classify the item.
    Running,
    /// The intended local observation-side effect or equivalent fact is committed.
    Succeeded,
    /// The current attempt failed with a typed recovery class that may permit retry.
    FailedRetryable,
    /// The item has a permanent failure classification for this execution.
    FailedPermanent,
    /// A formal observation-side guard prevented the protected effect.
    Blocked,
    /// An equivalent durable terminal fact was verified without re-execution.
    SkippedTerminal,
}
```

| 变体 | 初始/来源 | 是否 terminal | 必须满足 | 禁止解释 |
|---|---|---:|---|---|
| `Planned` | item factory；start UoW冻结work key和planned material | 否 | outcome为`None` | 不是候选扫描中的临时状态 |
| `Running` | `Planned`或受控 retry reentry | 否 | current claim/fence已取得；report仍`Draft` | 不是worker内存心跳或进程存活 |
| `Succeeded` | `Running` | 是 | local effect/derived marker/equivalent fact与item分类同一受保护UoW提交 | 不代表source/business success |
| `FailedRetryable` | `Running` | 可在report Draft期间重新进入`Running` | exact typed retryable association、failed/gap/progress refs与digest | 不自动调度、不保证下一次一定成功 |
| `FailedPermanent` | `Running` | 是 | exact permanent typed reason/result与refs | 不是public job terminal outcome |
| `Blocked` | `Running` | 是 | formal policy/visibility/retention/no-write/dependency block与typed reason | 不把拒绝伪装成成功或外部失败 |
| `SkippedTerminal` | `Running` | 是 | probe证明同一work key、同一planned material和等价durable terminal fact | 不可由“看起来已完成”或current truth推断 |

### 16.2 合法迁移与成员函数

合法迁移全集固定为：

```text
factory -> Planned
Planned -> Running
Running -> Succeeded | FailedRetryable | FailedPermanent | Blocked | SkippedTerminal
FailedRetryable -> Running
```

`FailedRetryable -> Running` 不是 state enum 自己授权的普通转换，必须同时通过：report 仍为 `Draft`、planned material/digest/observed version 未变、重新取得 fresh claim/fence。`Succeeded`、`FailedPermanent`、`Blocked`、`SkippedTerminal` 不得回到 `Running`。Finalize 看到任何 `Planned` 或 `Running` 都必须拒绝。

| 函数 | 精确责任 | 约束 |
|---|---|---|
| `pub(crate) fn is_terminal(&self) -> bool` | 判断四个 terminal state | 纯读，不读取当前 truth |
| `pub(crate) fn is_finalizable(&self) -> bool` | 判断是否可参与 report fold | `Planned`/`Running`为false；terminal为true |
| `pub(crate) fn can_start_from(&self, report_is_draft: bool) -> bool` | 只表达 state-level reentry前置 | 不替代claim/fence/material校验 |
| `pub(crate) fn try_rehydrate(token: &str) -> Result<Self, ApplicationError>` | 解析已持久化有限 token | unknown、alias、`Other`、大小写折叠均拒绝；不改变状态 |

状态迁移由 `ObservationJobPlanItem` 的受保护 member 完成，不提供 `set_state`、`force_running` 或绕过 CAS 的 public setter。`ApplicationError` 的 canonical owner 尚未在本批关闭，故本表只引用既有错误层级，不新增 variant。

### 16.3 state-level planned test redlines

| test cut | 必须证明 |
|---|---|
| finite token | 七个 variant 有唯一持久化 token；unknown/alias/`Other` fail closed |
| transition totality | 只接受上表五类运行迁移和一次 retry reentry；所有 terminal reopen拒绝 |
| finalize gate | 任一`Planned`/`Running`阻止 finalize；四类terminal可参与 fold |
| durable semantics | 重启后从 durable row rehydrate 的`Running`不能由 worker memory 自动恢复为成功 |
| boundary | state 不携带 source truth、external acceptance、signoff、real run id 或 evidence alias |

## 17. `ObservationJobPlanItemOutcome` 对象卡

### 17.1 current schema 与 owner-qualified association

该对象是 application-local、body-free、可持久化的 item classification。旧草稿中的 `JobFailureReason` 已降级为 `historical_material / repair input`，不得出现在 current schema。原因和结果必须回指已经存在的 owner；没有 owner 的新失败分类必须先登记 blocker，不得用字符串或 generic enum 补位。

```rust
/// Exact body-free classification folded into one job report.
pub struct ObservationJobPlanItemOutcome {
    affected_refs: BodyFreeRefSet,
    failed_refs: BodyFreeRefSet,
    gap_refs: GapStateRefSet,
    progress_refs: BodyFreeRefSet,
    association: Option<ObservationJobPlanItemOutcomeAssociation>,
    outcome_digest: DigestSummary,
}

/// Private tagged association; no fourth public object card is introduced.
enum ObservationJobPlanItemOutcomeAssociation {
    MaintenanceFailure(MaintenanceFailureReason),
    MaintenanceBlock(MaintenanceBlockReason),
    PublicationFailure(PublicationFailureKind),
    PublicationDeadLetter {
        reason: DeadLetterReason,
        dead_letter_ref: DeadLetterRef,
        retained_failure: Option<PublicationFailureKind>,
    },
    ExportFailure(ExportFailureReason),
    ExternalEffectAttemptFailure {
        intent_ref: ExternalEffectIntentRef,
        ordinal: ExternalEffectAttemptOrdinal,
        phase: ExternalEffectPhase,
        failure: ExternalEffectAttemptFailure,
    },
    ExportBlock(ExportBlockReason),
    ReplayBlock(ReplayBlockReason),
    ReferenceResolution(ReferenceResolutionReason),
    DiagnosticUnavailable(DiagnosticUnavailableReason),
    Staleness(StalenessReason),
    GapScanAccepted(GapScanAcceptedItemResult),
}
```

`ObservationJobPlanItemOutcomeAssociation` 是 `application::jobs` 内的 private tagged association，不是新的 public domain enum。它的每个 variant 必须引用现有 canonical owner；禁止增加 `GenericFailure`、`UnknownFailure`、`Other(String)`、raw adapter error 或未归属 result。`PublicationDeadLetter` 是 R06.8-B 对本 owner 的 current addendum：它保留 terminal outbox record 的 exact `DeadLetterReason`、`DeadLetterRef` 和可选 retained publication failure，不创建第二个 dead-letter state/reason owner。`ExternalEffectAttemptFailure` 是 S07-D affected correction：它保留 non-publication phase completion 的 exact intent、ordinal、phase 和 canonical failure，不能退化为现有宽泛 `ExportFailure`、`ApplicationError` 或当前 owner state。

`PublicationDeadLetter` 只与 `FailedPermanent` 相容。其
`retained_failure` 在且仅在 source outbox record 保留 compatible
`PublicationFailure` 时为 `Some(exact kind)`；合法 direct dead-letter 且无
retained failure 时为 `None`。分类前必须验证 item work key 是 exact
`Outbox(outbox_ref)`、terminal outbox record 的 reason/ref/failure 与
association 逐字段相等、`affected_refs` 含该 `outbox_ref` 且
`progress_refs` 含该 `dead_letter_ref`。不得从 ref、provider文本或 current
payload 推导 reason/failure，也不得把 `OutcomeUnknown` 自动改成
dead-letter。

| 字段 | 类型 | 来源与语义 | 不能替代 |
|---|---|---|---|
| `affected_refs` | `BodyFreeRefSet` | 本 item 变更或验证的 observation-side durable refs；canonical sorted/unique | 完整 plan、business truth |
| `failed_refs` | `BodyFreeRefSet` | 本 item 尝试但失败的 durable refs；同一 identity最多一次 | reason、retry policy |
| `gap_refs` | `GapStateRefSet` | explicit missing/not-visible/unsafe/degraded gap refs；空集合有效 | source completeness verdict |
| `progress_refs` | `BodyFreeRefSet` | progress/preparation/receipt/equivalent-effect marker refs | report state、claim/fence |
| `association` | private tagged association | typed reason或H12 exact accepted result | generic error string、public outcome |
| `outcome_digest` | `DigestSummary` | 覆盖 state、四个canonical ref sets、association tag/payload与字段版本 | repository version、cursor、claim token |

### 17.2 factory、rehydrate 与校验

| 函数 | 精确责任 | 关键验证 |
|---|---|---|
| `pub(crate) fn try_new_for(state, affected_refs, failed_refs, gap_refs, progress_refs, association, outcome_digest) -> Result<Self, ApplicationError>` | 从当前 item state 构造 outcome | state/association total matrix；sets canonical；digest覆盖完整字段 |
| `pub(crate) fn try_rehydrate_for(state, persisted_fields...) -> Result<Self, ApplicationError>` | 从 durable row恢复 | 不重跑policy、扫描source或读取current truth；unknown association/version拒绝 |
| `pub(crate) fn validate_for(&self, state: ObservationJobPlanItemState) -> Result<(), ApplicationError>` | 检查 state 与 outcome 共存关系 | `Planned`/`Running`不得有final outcome；terminal必须有兼容 outcome |
| `pub(crate) fn is_exactly_equal_to(&self, other: &Self) -> bool` | 幂等分类比较 | 逐字段、typed association和digest均相等才为true |
| typed read-only accessors | 供report fold、H12 factory和repository mapper读取 | 只返回借用/不可变值；无mutating setter |

状态/字段矩阵：

| item state | association要求 | refs要求 | outcome digest |
|---|---|---|---|
| `Planned` | 必须无outcome | 不适用 | 不适用 |
| `Running` | current outcome为None；历史attempt另存append-only记录 | 不在current outcome中预写成功/失败结论 | 不适用 |
| `Succeeded` | 通常无failure reason；若是H12 gap scan必须为`GapScanAccepted`且其 outcome为`Completed` | `failed_refs`为空；gap/progress可为空或有明确结果 | 必须 |
| `FailedRetryable` | typed retryable owner reason，或H12 `Failed(reason)` exact carrier | failed/gap/progress refs与reason相容 | 必须 |
| `FailedPermanent` | typed permanent owner reason、`PublicationDeadLetter` exact terminal association，或H12 `Failed(reason)`按owner分类为permanent | dead-letter必须保留 exact outbox/dead-letter refs及compatible retained failure；不能用空集合隐藏已知失败 identity | 必须 |
| `Blocked` | typed block owner reason，或H12 `Blocked(MaintenanceBlockReason)` exact carrier | protected effect未执行；gap/progress refs保留阻断上下文 | 必须 |
| `SkippedTerminal` | 只能是已验证 equivalent durable fact 的 typed association/refs；不得伪造H12 accepted result | refs必须能定位等价事实 | 必须 |

相同 state、refs、association 和 digest 的重复分类写可作为 idempotent no-op；任一字段不一致必须返回 consistency failure。不能以“state相同”掩盖 reason、refs、typed result 或 digest 差异。

## 18. `ObservationJobPlanItem` 对象卡

### 18.1 durable identity 与字段

```rust
/// One immutable planned input plus its current fenced classification.
pub struct ObservationJobPlanItem {
    plan_ref: ObservationJobExecutionPlanRef,
    work_key: ObservationJobWorkKey,
    planned_material: ObservationJobPlanItemPlannedMaterial,
    planned_input_digest: RequestDigest,
    observed_version: Option<ObservationSourceVersionRef>,
    state: ObservationJobPlanItemState,
    outcome: Option<ObservationJobPlanItemOutcome>,
}

/// Private tagged carrier owned by the item; not a fourth public object card.
enum ObservationJobPlanItemPlannedMaterial {
    Outbox { candidate: OutboxRecordRef, snapshot: ObservationOutboxPayloadSnapshot, captured_repository_version: ObservationRepositoryVersion },
    ProjectionScope { candidate: ObservationProjectionScope, target_binding: Option<MaintenanceTargetPolicySnapshot>, observation_cursor: Option<ObservationCursor>, reference_cursor: Option<ReferenceCursor>, captured_repository_version: Option<ObservationRepositoryVersion> },
    SignalRollup { candidate: SignalRollupWindowRef, scope: SignalRollupScope, window_kind: RollupWindowKind, observation_cursor: Option<ObservationCursor>, captured_repository_version: Option<ObservationRepositoryVersion> },
    ReferenceSnapshot { candidate: ReferenceSnapshotStateRef, state_snapshot: ReferenceSnapshotState, source_version: Option<ObservationSourceVersionRef>, reference_cursor: Option<ReferenceCursor>, captured_repository_version: Option<ObservationRepositoryVersion> },
    GapSource { candidate: GapSourceRefId, source_snapshot: GapSourceRef, scan_target_snapshot: GapScanTargetSnapshot, observation_cursor: Option<ObservationCursor>, reference_cursor: Option<ReferenceCursor>, captured_repository_version: Option<ObservationRepositoryVersion> },
    ReplayTarget { candidate: MaintenanceTargetRef, target_snapshot: MaintenanceTargetPolicySnapshot, approval_snapshot: ReplayApprovalSnapshot, observation_cursor: Option<ObservationCursor>, captured_repository_version: Option<ObservationRepositoryVersion> },
    ReportHandoff { candidate: ReportHandoffRecordRef, evidence_input: EvidenceIndexInputView, consumer_ref: ReportConsumerRef, observation_cursor: Option<ObservationCursor>, binding_material: Option<ExternalEffectBindingRef>, captured_repository_version: Option<ObservationRepositoryVersion> },
    ExternalExport { candidate: ExternalAuditExportPreparationRef, view_snapshot: DashboardAlertExportView, consumer_ref: PeripheralConsumerRef, binding_material: Option<ExternalEffectBindingRef>, observation_cursor: Option<ObservationCursor>, captured_repository_version: Option<ObservationRepositoryVersion> },
    PeripheralView { consumer_ref: PeripheralConsumerRef, projection_scope: ObservationProjectionScope, consumer_snapshot: PeripheralConsumerPolicySnapshot, view_snapshot: DashboardAlertExportView, observation_cursor: Option<ObservationCursor>, captured_repository_version: Option<ObservationRepositoryVersion> },
}
```

上述 carrier 的字段均为 private；示意中的 nested values 必须由各自 current owner 提供完整 validated snapshot，不允许以 `String`、hash、Debug bytes、当前 row pointer 或只保存 ref 的短形状替代。`GapSource` 分支中的 `scan_target_snapshot` 是 H12 所需 immutable input context；它不是 H12 accepted result，也不包含 job/claim/report identity。

旧草稿的 `observed_version: Option<ObservationRepositoryVersion>` 被标记为 historical repair input。current 语义改为：

- `observed_version` 是计划 material 捕获的业务/来源观察版本，使用已有 `ObservationSourceVersionRef`，没有可比较来源时保留明确 `None`；
- `captured_repository_version` 只表示对应 local row 在候选冻结时的 repository CAS 版本，使用既有 `ObservationRepositoryVersion`；
- repository version 不能替代 source version、cursor、external binding revision、claim/fence或计划 digest；
- item 当前 row 的 expected repository version由 `Versioned<T>` load 提供，并在 CAS 时传入，不由 cursor、时间、work key或 observed version伪造。

### 18.2 planned material variant 要求

| variant | 必须冻结的 exact material | resume 禁止行为 |
|---|---|---|
| `Outbox` | `OutboxRecordRef`、完整 `ObservationOutboxPayloadSnapshot`、captured repository version；snapshot内 event/subject/binding/schema/digest/cursor保持原值 | 从 current outbox 或 current binding重建payload |
| `ProjectionScope` | canonical scope、target binding（如适用）、observation/reference cursor、source/version guard与local row version | 重新枚举scope、改变target binding或用current view替换 |
| `SignalRollup` | window ref、scope、window kind、source cursor/observed version与local row version | 重新扫描signal或移动window边界 |
| `ReferenceSnapshot` | `ReferenceSnapshotStateRef`、完整 body-free state snapshot、source version、reference cursor与local row version | 读取current snapshot并替换原计划 |
| `GapSource` | stable source id、完整 source snapshot、H12 target snapshot七类语义与dual cursor/version上下文 | 从current gaps/source membership重建候选或target snapshot |
| `ReplayTarget` | target/effect/no-write snapshot、exact replay approval/protection/retention basis、observation cursor | 重新计算authorization或扩大scope |
| `ReportHandoff` | handoff ref、完整 immutable `EvidenceIndexInputView`、consumer/scope/visibility/gap/retention relation、binding material | 从Query preview或current evidence重新组装 |
| `ExternalExport` | preparation ref、完整 export view snapshot、consumer ref、visibility/gap/readiness relation、binding/effect material | 使用current route/binding或重新生成package input |
| `PeripheralView` | stable consumer ref、canonical projection scope、consumer policy snapshot、view snapshot、dependencies/cursor与local version | 只按consumer id重新查scope/view并替换原材料 |

每个分支都必须在 start UoW 通过 work-key/material compatibility 校验后才进入 item row。material 进入 plan 后不可增加、删除、重排、merge、split 或被 current truth 覆盖。完整 plan 的 canonical ordering由 D-4 定义，但 D-3 已固定单 item 不可改变其 own material。

### 18.3 factory、rehydrate、CAS 与 retry member

| member | 责任 | 关键前置 |
|---|---|---|
| `pub(crate) fn try_new(plan_ref, work_key, planned_material, planned_input_digest, observed_version) -> Result<Self, ApplicationError>` | 建立`Planned` item | key与material variant一致；material完整；digest覆盖exact typed material；初始outcome为None |
| `pub(crate) fn try_rehydrate(plan_ref, work_key, planned_material, planned_input_digest, observed_version, state, outcome) -> Result<Self, ApplicationError>` | 恢复 durable item | 不relist、不热读current truth/config；验证key/material/digest/state/outcome全一致 |
| `pub(crate) fn classify_with_cas(...) -> Result<(), ApplicationError>` | 应用一次受保护 state/outcome分类 | 必须同时带loaded `ObservationRepositoryVersion`与D-5定义的current claim/fence proof；提交时再次联合校验 |
| `pub(crate) fn retry_from_failed_retryable(...) -> Result<(), ApplicationError>` | 受控清除旧current outcome并回到Running | report Draft、material/digest/version不变、fresh claim/fence；历史attempt不能被覆盖 |
| `pub(crate) fn validate_h12_result(&self, result: &GapScanAcceptedItemResult) -> Result<(), ApplicationError>` | 验证GapSource planned context与H12 result兼容 | target、snapshot、cursor/namespace、work key与result字段逐项匹配 |
| read-only accessors | 暴露plan/work key、material、state、outcome | 不提供material/state/outcome的裸setter |

`classify_with_cas` 的具体 claim proof type留给 D-5；D-3 已冻结其必要性，禁止用裸 `ObservationFencingToken` 或 worker identity替代。repository 的 CAS 版本仍必须来自同 repository 的 `Versioned<ObservationJobPlanItem>` read。

### 18.4 item invariants

1. durable identity 固定为 `(plan_ref, work_key)`；同一 plan 内 work key canonical unique，跨 execution 的 active uniqueness继续按 D-2 的 global work key执行。
2. `plan_ref`、`work_key`、private planned material、`planned_input_digest`、`observed_version` 和每个 variant 的 captured version immutable。
3. 只有 `state` 与 current `outcome` 可在 item row 上通过 current claim/fence + repository CAS 修改；worker memory、report summary或current truth不能直接修改。
4. `state` 与 `outcome` 必须通过 total compatibility matrix；相同分类可 no-op，不同分类必须 consistency failure，不能 last-write-wins。
5. `FailedRetryable -> Running` 必须保留历史失败记录或等价 append-only attempt evidence；current outcome 的清除不是删除历史。
6. finalize 前没有 `Planned`/`Running`，每个 terminal item 都有 compatible outcome；report 是从 item current classifications 的 lossless canonical fold派生，不反向拥有完整性。
7. item 不拥有 source/business truth、H12 `GapState` open/close、external acceptance、real run id、signoff、evidence alias或测试结果。

## 19. H12 `GapScanAcceptedItemResult` 逐字段兼容矩阵

### 19.1 canonical owner 与五个顶层字段

| H12 字段 | exact type / owner | item planned material relation | current outcome relation | compatibility conclusion |
|---|---|---|---|---|
| `target_ref` | `MaintenanceTargetRef`; `domain::records::gap_scan` reservation owner | `GapSource` material必须保存同一 target ref及其 target/effect identity | H12 association内原值保留；不得从work key单独重建 | exact compatible |
| `target_snapshot` | `GapScanTargetSnapshot`; G/H12 current owner | `GapSource` material保存完整 immutable input context；不是只保存ref | association内完整复制；七类语义逐项保留 | exact compatible |
| `discovered_gap_refs` | canonical `GapStateRefSet` | planned material不预造发现结果；只能保存扫描输入边界 | association内完整保留，空集合仍是有效结果；item `gap_refs`只能由其canonical set映射 | exact compatible |
| `outcome` | `GapScanOutcome = Completed \| Failed(MaintenanceFailureReason) \| Blocked(MaintenanceBlockReason)` | planned material保存决定扫描边界的policy/authorization basis，不预写结果 | association内保留 exact typed variant/reason；不得转成`JobFailureReason` | exact compatible |
| `completed_at` | `ObservedAt`，单一完成时点 | planned material不以worker clock替代；执行结果产生时取得 | association内保留一个 exact value；不能用 cursor/repository version替代 | exact compatible |

### 19.2 `GapScanTargetSnapshot` 七类语义

| 语义 | 必须保留的内容 | 丢失后的后果 |
|---|---|---|
| target ref | snapshot内的`target_ref`与top-level `target_ref` | 无法证明目标一致性 |
| projection scopes | canonical `MaintenanceProjectionScopeSet` | 可能把不同scope结果误合并 |
| dependency namespaces | `MaintenanceDependencyNamespaceSet` | 无法证明依赖读取边界 |
| authorization mode | `MaintenanceAuthorizationMode` | 不能把claim/fence当授权证明 |
| observation cursor | `Option<ObservationCursor>`，按namespace要求保留 | 无法回溯观察侧提交边界 |
| reference cursor | `Option<ReferenceCursor>`，与observation cursor不互换 | 会把reference顺序误当observation顺序 |
| maintenance policy basis | 完整 `PolicyEvaluationBasis` | 无法证明当前scan是哪个policy decision的结果 |

`target_ref` 顶层字段必须与 `target_snapshot.target_ref` 相等；不相等、namespace/cursor arity错误、policy basis不匹配均为 consistency failure。`discovered_gap_refs` 必须是canonical set；空集合不能被当作缺失结果或自动推导 source complete。

### 19.3 outcome mapping 与 same-UoW reservation

| H12 result | item state | item outcome association | 额外规则 |
|---|---|---|---|
| `Completed` | `Succeeded` | `GapScanAccepted(exact result)` | item `failed_refs`为空；discovered set可为空；H12 record与item classification使用同一 post-state |
| `Failed(reason)` | `FailedRetryable`或`FailedPermanent` | `GapScanAccepted(exact result)`，保留原 `MaintenanceFailureReason` | retryability由现有 owner/recovery mapping决定；不能丢reason或改成generic failure |
| `Blocked(reason)` | `Blocked` | `GapScanAccepted(exact result)`，保留原 `MaintenanceBlockReason` | protected effect未执行；不能将block转成Failed或Completed |
| 等价已存在 terminal fact | `SkippedTerminal` | 只能引用经验证的等价 durable fact | 不得伪造新的 `GapScanAcceptedItemResult`，也不得从current gap state猜结果 |

H12 factory仍只接受 `GapScanAcceptedItemResult`、same-UoW `GapScanPostState`和typed metadata，并逐字段验证 exact copy。item claim/fence只能保护 application item row 和本地写入，不能替代 H12 metadata 的 committed Observation cursor，也不能使 H12 拥有 job/plan/item lifecycle。H12 不自动 open/close `GapState`；若业务需要 gap mutation，必须走独立 H8/P12 accepted mutation。

## 20. D-3 cross-object invariants、affected use 与 planned tests

### 20.1 cross-object invariants

| 关系 | 必须成立 | 禁止替代 |
|---|---|---|
| work key -> planned material | variant、stable identity和完整 candidate material相容 | 只存work-key hash或current lookup |
| planned material -> observed version | source/business observed version只来自captured typed source marker | repository version、clock、cursor |
| item row -> CAS | expected `ObservationRepositoryVersion` + current exact claim/fence proof同时有效 | 裸 token、worker id、report version |
| item state -> outcome | total compatibility matrix；terminal lossless | state-only summary |
| outcome -> report | report sets/reason/progress是所有 current item outcomes的canonical fold | report反向补item或summary猜reason |
| GapSource material -> H12 | target/snapshot/cursor/policy basis逐项兼容 | claim/fence代替target snapshot |
| H12 result -> record | five top-level fields exact copy；metadata origin/cursor/visibility合规 | 从item refs重新生成result |
| resume -> material | 读取原plan/item material；只处理未终态或明确retryable item | relist、current config、current source truth |

### 20.2 affected definitions register

| affected location | D-3 correction | 传播时点 |
|---|---|---|
| frozen Step 10 §12.5-a | state/token/migration可保留；旧generic outcome字段和`JobFailureReason`改为historical/use-site，回指本批 owner-qualified association | D-6 affected closure / Step 10 repair |
| frozen Step 11 §§9.3、11、18 | item row保留 immutable material + mutable classification；CAS同时校验 repository version与current claim/fence；`observed_version`不得再写成 repository version | D-6 / Step 11 repair |
| frozen Step 12 §13 | retry only under Draft + unchanged material + fresh claim/fence；unknown commit outcome不得分类为retryable | D-6 / Step 12 affected review |
| frozen Step 09 nine Job flows | each item flow must return exact typed association or explicit no-classification consistency error；H12 branch copies exact accepted result | D-6 / Step 09 per-flow repair |
| H12 G record factory | consume exact result and same-UoW post-state; no job identity fields added | D-6 cross-object review |
| old main Step 06 job/report draft | marked historical; no `JobFailureReason` current owner | R06.8 current object scan |

### 20.3 planned test redlines

| test cut | 必须证明 |
|---|---|
| state transition | exact seven-state graph；terminal reopen、invalid direct transitions、finalize with Planned/Running均拒绝 |
| outcome totality | every terminal state has compatible outcome；missing/extra reason、refs或digest fail closed |
| typed owner | each association decodes through its canonical owner；generic failure string/unknown variant不能落库 |
| idempotent CAS | exact same state/refs/association/digest is no-op；任何差异返回 consistency failure |
| stale writer | wrong repository version或stale/expired/wrong claim-fence zero-write；不能靠reload后复用旧 authority |
| retry reentry | only Draft + unchanged material + fresh claim/fence allows `FailedRetryable -> Running`; terminal report blocks it |
| material immutability | attempted work-key/planned-material/digest/observed-version replacement rejected |
| resume | crash/restart resumes from stored material；spy confirms no candidate relist/current-config substitution |
| H12 fields | five top-level fields and all seven snapshot semantics retained; top-level/snapshot target refs equal |
| H12 outcomes | Completed/Failed/Blocked mappings preserve exact typed reason; empty discovered set valid; no fabricated SkippedTerminal result |
| H12 same-UoW | result, post-state, metadata cursor and item classification commit/rollback atomically; cursor namespace not replaced by claim/fence |
| publication dead-letter | only `FailedPermanent` accepts the eleventh owner-qualified association；work key/outbox record/reason/ref/retained failure and required ref sets match exactly |
| truth boundary | item/report/H12 integration never writes business/source truth or opens/closes GapState implicitly |

## 21. D-3 stop gate（historical checkpoint）

| gate | status | evidence / remaining constraint |
|---|---|---|
| three independent object cards | `pass_design_only` | §§16~18 each include owner、schema、field source、factory/rehydrate/member、invariants和planned tests |
| state graph | `resolved` | seven fixed variants and legal transitions exactly match Step 10/11/12 use-site |
| outcome owner boundary | `resolved_for_D3` | no new public `JobFailureReason`; private association uses existing typed owners and H12 exact result |
| planned material | `resolved_for_D3` | private tagged carrier preserves exact typed candidate context; resume cannot relist or reconstruct |
| H12 fieldwise compatibility | `resolved_in_D3_fieldwise` | five top-level fields, seven snapshot semantics, typed outcome, completed_at and same-UoW copy fixed; D-6 handles cross-object closure |
| external upstream blocker | `none` | current `00/01/02` ownership remains sufficient |
| internal quality blocker | `03-RPR-S06-GRANULARITY=open` | D-4~D-6、R06.7/R06.8及affected audits仍未完成 |
| current gate | `R06.6-D3_done_waiting_user` | stop here; do not enter D-4 without explicit user confirmation |

### 21.1 下一批阅读清单

用户确认后只进入 `R06.6-D4_execution_plan_config_snapshot_cards`，先读：

- 本文件 §§15~21，特别是 private planned-material carrier、observed/source version 与 repository version 分离、H12 matrix；
- Step 14 executable typed values / §9.5 与 `R06.6-D-CONFIG-SUPPORT-OWNER` 的完整冲突清单；
- Step 11 plan store、plan digest、config snapshot persistence与resume ordering；
- D-2 execution/plan/work-key cards及本批 item identity/material compatibility；
- R06.6-C binding/token cards，只用于配置 snapshot 的 stable binding revision relation；
- Step 10/12 finalize、retry、unknown-outcome use-site，只作 D-4 constraint input。

不得在下一批之前写 claim、report/service、Step 07、formal `03` 或任何 `04` 文件。当前不需要提交 commit。

## 22. D-4 输入复核、范围与 owner 裁决

### 22.1 本批实际消费的输入

| 输入 | 采用结论 | 当前 authority 限制 |
|---|---|---|
| Step 06 SOP、书写规范与可落码标准 | 每个 support type、binding、snapshot、plan 都必须有独立卡、字段来源、factory、rehydrate、immutability、测试红线和停审结论 | 不用一张 config family 表替代对象卡 |
| D-2 identity、plan-ref、fence、work-key cards | execution、plan、idempotency、public metadata 和 global work-key 的隔离关系继续有效 | D-4 不重定义这些对象；只消费其 relation |
| D-3 item / planned-material cards | item identity 为 `(plan_ref, work_key)`；planned material、planned digest、source/observed version immutable；item classification 只能 CAS | D-4 定义完整 plan ordering，不改变单 item material |
| Step 14 §9.1 / §9.5 | typed executable values、binding variants、snapshot骨架、required job matrix和job timeout use-site | Step 14 同名 schema降级为 use-site；raw config仍归 infra |
| Step 11 plan store / start / resume ordering | accepted start UoW 内冻结 bounded work-set；plan、snapshot、item初始状态共同持久化；resume只读原plan | 不继承旧 PK、column 或未闭合 repository signature |
| Step 13 §18 | plan digest覆盖 operation、request digest、canonical snapshot、item key/material/version；claim、worker、attempt、clock排除 | canonical byte encoding / profile 留 `R06.6-F` 与 affected review |
| C 批 external binding / phase / token cards | `ExternalEffectBindingRef`、`ExternalEffectPhase` 是 application runtime 的既有 owner；snapshot只保存 stable binding identity与capability declaration | 本批不重新定义 binding ref或phase |
| Step 08/09/12 frozen Job use-site | 九个 finite Job operation、start/item/finalize分段、retry/unknown-outcome边界 | frozen code block只能作为 affected input |

### 22.2 D-4 关闭与保留的 blocker

| blocker | D-4 结论 | 后续处理 |
|---|---|---|
| `R06.6-JOB-CONFIG-OWNER` | `resolved_in_D4`；durable snapshot、binding carrier和plan owner明确 | Step 07/11/14只消费；不重复声明 |
| `R06.6-D-CONFIG-SUPPORT-OWNER` | `resolved_in_D4`；typed executable values归`application::runtime`，job binding/snapshot归`application::jobs` | R06.7只审 runtime assembly 与 entry-safe carrier |
| `R06.6-D-H12-COMPAT` | D-3字段级结论保持；D-4只保证 GapSource material随plan冻结 | D-6做跨对象闭环，不改变H12字段 |
| `R06.6-D-CLAIM-SHAPE` | 保持 `open_controlled`；plan只提供 claim 的 exact plan binding，不定义 claim | D-5独立定义 claim identity、owner、lease、heartbeat、fence |
| `R06.6-DIGEST-CANONICALIZER` | 仍为 `open_controlled`；本批关闭 coverage 和排除集合，不关闭 normalized encoding/profile | R06.6-F / Step 13 affected review |
| external upstream blocker | `none` | 不回退 `00/01/02` |

### 22.3 本批明确不承载的配置

`JobExecutionConfigSnapshot` 不是 raw configuration container。以下材料不允许出现在任何 application-owned field、canonical bytes、plan digest、report、log、metric、trace 或 evidence linkage 中：

- raw map、serde body、source path、environment variable name、profile locator；
- endpoint、topic、route、bucket、credential、secret、provider account 或 adapter-private handle；
- schedule、cron、worker/process/host identity、thread identity；
- public request body、provider response body、external acceptance、real runtime run id；
- `job_timeout` invocation budget。

`job_timeout` 由 `jobs` entry wrapper 按一次 invocation 注入。它可以让 runner 在安全 phase boundary 返回 in-progress / bounded unavailable，但不能取消一个已经发出的 external call、改变 plan、替换 snapshot、自动写 item terminal outcome，或证明 rollback。若未来要让 timeout 成为 durable execution semantics，必须新增 typed binding 并重新做 affected-definition，不得把现有 timeout 静默塞进 snapshot。

## 23. Typed execution support object cards

本节的 support object 都是 `application::runtime` 的 typed executable value。它们可以被 `application::jobs` 的 binding / snapshot 引用，但不携带 raw config source 或 infra locator。`ExternalEffectBindingRef` 与 `ExternalEffectPhase` 已在 C 批闭口，本节只引用，不重复定义。

### 23.1 `ConfigBindingRef`

**Capability / source**

它标识一个可恢复的 validated configuration revision，使 resume 能确认历史 snapshot 的来源版本。它不是 profile 名、文件路径、环境变量名或配置正文。

```rust
/// Opaque identity of one validated configuration revision.
#[repr(transparent)]
pub struct ConfigBindingRef(BodyFreeRef);
```

| 项 | 契约 |
|---|---|
| owner | `application::runtime`; infra validator 负责从完整 validated revision 提供值 |
| inner source | validated `BodyFreeRef`; 不从 profile string、path、timestamp 或 plan digest 派生 |
| factory | `pub fn try_from_validated_revision(value: BodyFreeRef) -> Result<Self, ApplicationError>`; 只接受已完成 raw-to-validated 校验的值 |
| rehydrate | `pub fn try_rehydrate(value: BodyFreeRef) -> Result<Self, ApplicationError>`; 只校验 opaque identity，不读取 current config |
| accessors | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`; `pub fn into_body_free_ref(self) -> BodyFreeRef` |
| equality | exact revision equality; 不证明当前 runtime 可用，也不证明任何 adapter 已存在 |
| persistence | immutable; 进入 `JobExecutionConfigSnapshot`，并通过 snapshot canonical material参与 plan digest |
| forbidden | secret、locator、raw source、schedule、run id、evidence alias、业务 truth |

**Test redlines**

invalid opaque value、cross-wrapper conversion、missing persisted value、attempted current-config substitution 和 secret-bearing debug/serialization 都必须 fail closed。

### 23.2 `PositiveDurationMillis`

**Capability / source**

承载已经解析为毫秒的正 duration，用于 lease、heartbeat、retry backoff 和 external call timeout。单位在类型名中固定，避免 `Duration` 的隐式单位歧义。

```rust
/// Positive duration after infra parsing and range validation, in milliseconds.
#[repr(transparent)]
pub struct PositiveDurationMillis(u64);
```

| 项 | 契约 |
|---|---|
| owner | `application::runtime` |
| factory | `pub fn try_new(value: u64) -> Result<Self, ApplicationError>`; `0`、overflow、infinite sentinel拒绝 |
| validated factory | `pub(crate) fn from_validated(value: u64) -> Result<Self, ApplicationError>`; 由 infra validator / runtime builder使用，须通过 `04` hard bound |
| accessor | `pub const fn get(&self) -> u64` |
| comparison | ordinary numeric comparison; 不读取 clock、不创建 deadline |
| persistence | immutable typed scalar; 只有被某个 binding引用时进入snapshot |
| forbidden | negative/string duration、implicit seconds、local-clock expiry、raw config source |

**Boundary**

该对象表达数值，不表达 timeout 后发生了什么。commit timeout、external timeout 和 query timeout 的 recovery 仍由各自 Step 12/13 flow 决定。

### 23.3 `PositiveLimit`

**Capability / source**

承载 candidate、parallelism 或 loop 的正整数上限。它不表示分页 cursor，也不承载 source truth。

```rust
/// Positive bounded count used by an accepted job execution.
#[repr(transparent)]
pub struct PositiveLimit(u32);
```

| 项 | 契约 |
|---|---|
| owner | `application::runtime` |
| factory | `pub fn try_new(value: u32) -> Result<Self, ApplicationError>`; `0`拒绝 |
| bounded validation | `pub(crate) fn from_validated(value: u32, hard_max: u32) -> Result<Self, ApplicationError>`; 超界拒绝，不截断 |
| accessor | `pub const fn get(&self) -> u32` |
| use | `CandidateLimit`、`MaxParallelism`及同 owner的 typed limit |
| persistence | immutable; 有效 candidate limit / parallelism进入snapshot |
| forbidden | `usize`隐式转换、unbounded sentinel、把limit当已完成数量、把limit当分页证明 |

Job request 显式给出的 limit只能收窄 validated runtime limit。effective value必须在 start phase 固定；不能在 resume 用 current default 替换。

### 23.4 `RetryBackoffConfig`

**Capability / source**

描述 known-failure additional attempt 的 backoff 参数。它不触发 retry，也不保存当前 attempt 或 wall clock。

```rust
/// Backoff parameters for additional attempts after a known retryable failure.
pub struct RetryBackoffConfig {
    initial_delay: PositiveDurationMillis,
    maximum_delay: PositiveDurationMillis,
    multiplier_milli: u32,
    jitter_ratio_milli: u16,
}
```

| 字段 | 来源 / 约束 |
|---|---|
| `initial_delay` | validated runtime execution config; 大于0 |
| `maximum_delay` | validated runtime execution config; 不小于 initial |
| `multiplier_milli` | typed integer; 不得低于 `1000`，避免每次 retry 缩短 |
| `jitter_ratio_milli` | typed ratio; 范围 `0..=1000`，不记录随机结果 |

| member | exact contract |
|---|---|
| factory | `pub fn try_new(initial_delay: PositiveDurationMillis, maximum_delay: PositiveDurationMillis, multiplier_milli: u32, jitter_ratio_milli: u16) -> Result<Self, ApplicationError>` |
| validation | `pub fn validate(&self) -> Result<(), ApplicationError>`; 检查顺序关系和 ratio bound |
| accessors | 四个 read-only accessor; 不暴露 mutable field reference |
| canonical material | `pub(crate) fn append_canonical_material(&self, out: &mut Vec<u8>)`; 字段按固定顺序写入，具体 profile由 F 批闭口 |
| forbidden | RNG、clock、attempt history、sleep、adapter call、automatic state transition |

### 23.5 `RetryPolicyConfig`

**Capability / source**

描述某一 operation family 可使用的 additional attempt budget。第一次调用不计入 `max_additional_attempts`。

```rust
/// Retry budget and backoff for one frozen operation family.
pub struct RetryPolicyConfig {
    max_additional_attempts: u32,
    backoff: RetryBackoffConfig,
}
```

| member | exact contract |
|---|---|
| factory | `pub fn try_new(max_additional_attempts: u32, backoff: RetryBackoffConfig) -> Result<Self, ApplicationError>` |
| accessor | `pub const fn max_additional_attempts(&self) -> u32`; `pub fn backoff(&self) -> &RetryBackoffConfig` |
| decision helper | `pub const fn allows_additional_attempt(&self, completed_additional_attempts: u32) -> bool`; 只做纯判断 |
| exhaustion helper | `pub const fn is_exhausted(&self, completed_additional_attempts: u32) -> bool` |
| persistence | immutable; 作为 `ResolverRetry`、`PublicationRetry`、`HandoffRetry` 或 `ExportRetry` binding value |
| digest | policy fields进入snapshot canonical material; 实际 attempt number不进入 request/plan/external token digest |
| forbidden | retrying permanent/unknown/unsupported result、把 exhaustion写成成功、清除历史失败记录 |

`max_additional_attempts == 0` 是合法的 no-auto-retry policy。是否某一 failure class允许消费预算由 Step 12 / operation flow决定，不由该 value object自行改变。

### 23.6 `ClaimLeaseConfig`

**Capability / source**

为 D-5 claim object提供 typed lease/heartbeat参数；它不拥有 claim state，也不能凭 local clock 将 claim 标记为 Expired。

```rust
/// Durable claim lease and heartbeat parameters.
pub struct ClaimLeaseConfig {
    lease_duration: PositiveDurationMillis,
    heartbeat_interval: PositiveDurationMillis,
}
```

| member | exact contract |
|---|---|
| factory | `pub fn try_new(lease_duration: PositiveDurationMillis, heartbeat_interval: PositiveDurationMillis) -> Result<Self, ApplicationError>` |
| invariant | `heartbeat_interval < lease_duration`; 相等也拒绝 |
| accessors | `pub fn lease_duration(&self) -> &PositiveDurationMillis`; `pub fn heartbeat_interval(&self) -> &PositiveDurationMillis` |
| persistence | immutable snapshot input; 同一 plan resume必须使用原值 |
| D-5 relation | D-5 claim store使用该值请求 acquire/renew; durable authority决定 Active/Released/Expired |
| forbidden | process-local lock、worker id作为 owner、clock-only expiry、renew时改变 work key或plan digest |

### 23.7 `ProbeCapability`

```rust
/// Whether one external-effect binding can answer a stable-token probe.
pub enum ProbeCapability {
    /// The adapter declares support for a formal stable-token probe.
    Supported,
    /// No stable-token probe is available; absence is not a negative result.
    Unsupported,
}
```

| 项 | 契约 |
|---|---|
| owner | `application::runtime`; C 批 probe result仍归`application::external_effects` |
| factory / parse | `pub const fn from_wire_token(token: &str) -> Result<Self, ApplicationError>`; 只接受有限 token，无 `Other` |
| accessor | `pub const fn as_wire_token(&self) -> &'static str` |
| semantics | `Supported`只表示可询问；不表示 external call 已成功，`Unsupported`不表示 call 未发生 |
| persistence | external binding snapshot capability; 按 phase与binding ref一同冻结 |
| forbidden | 将 Unsupported映射为 NotPublished/NotDelivered，或将 Supported当作 acceptance proof |

### 23.8 `StableTokenCapability`

```rust
/// Whether the external target formally guarantees deduplication by stable token.
pub enum StableTokenCapability {
    /// The target declares stable-token deduplication for this phase.
    Enforced,
    /// The target does not guarantee stable-token deduplication.
    NotGuaranteed,
}
```

| 项 | 契约 |
|---|---|
| owner | `application::runtime` |
| factory / parse | `pub const fn from_wire_token(token: &str) -> Result<Self, ApplicationError>`; 有限 token |
| accessor | `pub const fn as_wire_token(&self) -> &'static str` |
| semantics | 这是 validated declaration，不是本仓对 external exactly-once 的证明 |
| phase gate | required phase若没有满足的 capability，startup/phase preflight必须返回 disabled/unavailable/manual classification；不能假装成功 |
| forbidden | 用 claim fence替代 external token，用一次 positive probe推导长期 guarantee |

### 23.9 `ExternalEffectCapabilityConfig`

`ExternalEffectBindingRef` 和 `ExternalEffectPhase` 的 type owner已在 C 批闭口；本卡只定义 capability declaration 的组合对象。

```rust
/// Capability declaration for one exact external-effect phase.
pub struct ExternalEffectCapabilityConfig {
    phase: ExternalEffectPhase,
    stable_token: StableTokenCapability,
    probe: ProbeCapability,
}
```

| member | exact contract |
|---|---|
| factory | `pub fn try_new(phase: ExternalEffectPhase, stable_token: StableTokenCapability, probe: ProbeCapability) -> Result<Self, ApplicationError>` |
| accessors | `phase()`, `stable_token()`, `probe()` read-only accessors |
| equality | exact tuple equality `(phase, stable_token, probe)` |
| collection invariant | one capability per phase; `JobConfigBinding::ExternalEffect`内按phase排序、去重，duplicate phase拒绝 |
| persistence | immutable snapshot value; 与 exact `effect_binding_ref`、family、call timeout共同参与 plan digest |
| forbidden | endpoint/credential、provider capability response body、phase alias、automatic phase conversion |

### 23.10 Support object cross-card closure

| relation | required proof | forbidden substitution |
|---|---|---|
| config ref -> snapshot | exact validated revision identity | current profile name / path |
| positive value -> binding | value passed validation before snapshot factory | raw integer/string in job plan |
| retry -> operation | variant-specific policy association | one generic retry map or global mutable policy |
| lease -> claim | D-5 consumes immutable lease parameters | local clock / process lock |
| capability -> external phase | exact binding ref + phase + declaration equality | adapter family name or boolean `enabled` |
| support value -> digest | canonical typed field material | `Debug`, JSON serialization, pointer address |

## 24. `JobConfigBinding` object card

### 24.1 Capability and Rust-facing definition

`JobConfigBinding` 是一个 accepted Job 需要冻结的、有限且 operation-scoped 的执行设置。它不是 raw key/value map，也不允许通过字符串新增 variant。

```rust
/// One finite execution setting frozen for an accepted operations job.
pub enum JobConfigBinding {
    CandidateLimit(PositiveLimit),
    MaxParallelism(PositiveLimit),
    ClaimLease(ClaimLeaseConfig),
    ResolverRetry(RetryPolicyConfig),
    PublicationRetry(RetryPolicyConfig),
    HandoffRetry(RetryPolicyConfig),
    ExportRetry(RetryPolicyConfig),
    ExternalEffect {
        effect_binding_ref: ExternalEffectBindingRef,
        family: AdapterFamily,
        call_timeout: PositiveDurationMillis,
        capabilities: Vec<ExternalEffectCapabilityConfig>,
    },
}
```

### 24.2 Variant and field contract

| variant | field source | cardinality | semantic boundary |
|---|---|---:|---|
| `CandidateLimit` | effective request limit bounded by validated runtime limit and hard `max_plan_items` | 1 | freezes candidate materialization bound; 不证明候选已完整 |
| `MaxParallelism` | validated execution runtime value | 1 | freezes local concurrency bound; 不改变 global work-key uniqueness |
| `ClaimLease` | validated execution runtime value | 1 | input to D-5 claim authority; 不持有 claim state |
| `ResolverRetry` | validated resolver policy | 0 or 1 | only resolver-known retryable classes may consume it |
| `PublicationRetry` | validated publication policy | 0 or 1 | same outbox snapshot/token only |
| `HandoffRetry` | validated handoff policy | 0 or 1 | prepare/deliver flow-specific; unknown/unsupported not auto-retried |
| `ExportRetry` | validated export policy | 0 or 1 | prepare/deliver flow-specific; no new package on retry |
| `ExternalEffect` | C-batch binding ref + validated family/timeout/capabilities | 0..n | one row per distinct effect binding used by plan items |

`ExternalEffect` 的 `capabilities` 必须至少覆盖该 binding 在当前 operation 实际使用的 phases，且只保存 declaration；外部 adapter 的 raw binding、route、credential 和 provider response留在 infra/application adapter boundary。

### 24.3 Factory, validation and canonical members

| member | exact signature / contract |
|---|---|
| variant constructor | Rust enum constructor; 只接受已验证 typed value，不接受 raw scalar或locator |
| operation validation | `pub(crate) fn validate_for_operation(&self, operation: ObservationJobOperation) -> Result<(), ApplicationError>`; 检查 variant是否允许、phase是否匹配 |
| external validation | `pub(crate) fn validate_external_catalog_match(&self, catalog: &ExternalEffectBindingCatalog) -> Result<(), ApplicationError>`; 检查 ref/family/timeout/capabilities exact equality；catalog type由 C/Step14 affected owner提供 |
| discriminator | `pub const fn discriminator(&self) -> JobConfigBindingKind`; `JobConfigBindingKind`是内部 finite discriminator，不作为新的 public config map |
| canonical material | `pub(crate) fn append_canonical_material(&self, out: &mut Vec<u8>)`; 字段顺序和 collection sort固定，encoding profile留 F 批 |
| equality | exact typed equality; 不同 variant不得被数值或字符串折叠 |

### 24.4 Collection invariants

1. 同一 snapshot 中每个 non-external variant最多出现一次。
2. `ExternalEffect` 按 `effect_binding_ref` canonical sort，ref不得重复。
3. capability vector按 `ExternalEffectPhase` sort，phase不得重复。
4. bindings 不包含与 operation 无关的设置；无关配置变化不能改变 plan digest。
5. 不允许 empty binding 伪装“使用默认配置”；operation matrix要求的 binding缺失必须在 start UoW 前或 start UoW 内 fail closed。
6. `max_plan_items` 是全局 hard guard，不新增一个可绕过它的 binding variant；effective `CandidateLimit`必须不超过该 guard。

## 25. `JobExecutionConfigSnapshot` object card

### 25.1 Exact schema and ownership

```rust
/// Immutable executable configuration required to rehydrate one job plan.
pub struct JobExecutionConfigSnapshot {
    config_ref: ConfigBindingRef,
    operation_name: ObservationJobOperation,
    bindings: Vec<JobConfigBinding>,
}
```

| field | source | invariant / use |
|---|---|---|
| `config_ref` | validated runtime configuration revision | immutable; exact historical revision identity; 不含 raw config |
| `operation_name` | accepted Job operation from typed request/context | must equal operation used to create plan and idempotency scope |
| `bindings` | validated effective values + plan-specific external binding catalog | canonical sorted/unique typed list; 只保留影响 work-set、parallelism、lease、retry或external call semantics的值 |

Owner is `application::jobs` because this object is persisted with the accepted plan and governs resume. `application::runtime` owns the support value types and derives the validated catalog; `infra::config` owns raw source parsing. No other layer may redeclare this object.

`ExternalEffectBindingCatalog` remains a validated application-visible catalog assembled by Step 14/R06.7. D-4 only consumes its safe metadata (`effect_binding_ref`、family、timeout、capabilities); it does not move endpoint, credential or adapter handles into the snapshot.

### 25.2 Factory and rehydrate members

| member | exact contract |
|---|---|
| start factory | `pub(crate) fn try_new(config_ref: ConfigBindingRef, operation_name: ObservationJobOperation, bindings: Vec<JobConfigBinding>) -> Result<Self, ApplicationError>`; canonicalize and validate before returning |
| rehydrate factory | `pub(crate) fn try_rehydrate(config_ref: ConfigBindingRef, operation_name: ObservationJobOperation, bindings: Vec<JobConfigBinding>) -> Result<Self, ApplicationError>`; 不访问 current config、不补默认值 |
| operation accessor | `pub const fn operation_name(&self) -> ObservationJobOperation` |
| config accessor | `pub fn config_ref(&self) -> &ConfigBindingRef` |
| binding lookup | `pub fn binding(&self, kind: JobConfigBindingKind) -> Option<&JobConfigBinding>`; 只读，不能返回 mutable reference |
| external lookup | `pub fn external_binding(&self, ref_: &ExternalEffectBindingRef) -> Option<&JobConfigBinding>` |
| canonical material | `pub(crate) fn append_canonical_material(&self, out: &mut Vec<u8>)`; 包括 config ref、operation和canonical bindings |
| catalog check | `pub(crate) fn validate_against_catalog(&self, catalog: &ExternalEffectBindingCatalog) -> Result<(), ApplicationError>`; 只校验 safe metadata与historical binding availability |

`JobConfigBindingKind` 是 `application::jobs` 内部 finite discriminator，不是新的 raw configuration map：

```rust
/// Internal discriminator used to index one binding variant.
enum JobConfigBindingKind {
    CandidateLimit,
    MaxParallelism,
    ClaimLease,
    ResolverRetry,
    PublicationRetry,
    HandoffRetry,
    ExportRetry,
    ExternalEffect,
}
```

`ExternalEffect` lookup additionally requires an exact `ExternalEffectBindingRef`; a kind-only lookup is insufficient when one plan uses multiple external subjects.

### 25.3 Operation-specific compatibility matrix

| Job operation | required non-external bindings | external phase requirement | forbidden / missing behavior |
|---|---|---|---|
| `PublishObservationOutbox` | `CandidateLimit`、`MaxParallelism`、`ClaimLease`、`PublicationRetry` | plan items中每个 distinct publication binding必须有 `Publication` capability | missing binding、duplicate ref或phase mismatch -> start rollback |
| `RebuildObservationReadModels` | `CandidateLimit`、`MaxParallelism`、`ClaimLease` | none | external binding、retry binding或缺 required value -> consistency failure |
| `RebuildSignalRollups` | `CandidateLimit`、`MaxParallelism`、`ClaimLease` | none | 同上 |
| `RefreshReferenceSnapshots` | `CandidateLimit`、`MaxParallelism`、`ClaimLease`、`ResolverRetry` | none | resolver不能借用 publication retry |
| `ScanObservationGaps` | `CandidateLimit`、`MaxParallelism`、`ClaimLease` | none | H12 scan不因外部 effect binding而改变 |
| `CoordinateObservationReplay` | `CandidateLimit`、`MaxParallelism`、`ClaimLease` | none | replay approval/target snapshot来自item material，不由config生成 |
| `PrepareReportHandoffDelivery` | `ClaimLease`、`HandoffRetry` | each used binding must declare `HandoffPreparation` and `HandoffDelivery` | 任何一阶段缺失都不能调用对应 external phase |
| `PrepareExternalAuditExportDelivery` | `ClaimLease`、`ExportRetry` | each used binding must declare `ExportPreparation` and `ExportDelivery` | package prepare/deliver不能跨binding重试 |
| `RebuildPeripheralViews` | `CandidateLimit`、`MaxParallelism`、`ClaimLease` | none | 不读取 external route或consumer endpoint |

The matrix is total, not a defaulting table. The effective candidate limit is computed once from request input, the validated runtime bound and the hard plan cap. A request may narrow the bound but cannot widen it or create a missing binding.

### 25.4 Snapshot immutability and failure behavior

- The start factory rejects missing, duplicate, unknown or operation-incompatible bindings; it never silently drops an unrecognized binding.
- Rehydrate requires the exact historical `config_ref`, operation and canonical binding list. Missing/corrupt/unknown revision is a consistency/manual condition.
- Resume loads this object from the persisted plan; it does not call the current config loader, current target catalog or current source listing to fill fields.
- Snapshot does not contain state/outcome, claim/fence, attempt, worker, clock, report summary or repository version.
- Snapshot is immutable after start commit. Config reload/rollback only changes eligibility of new work; it cannot rewrite existing plans, items, intents or reports.

### 25.5 Snapshot planned tests

| test cut | must prove |
|---|---|
| canonical order | same bindings in different input order produce one canonical representation; duplicate variants/ref/phase reject |
| operation matrix | all nine operations accept exactly the required bindings and reject forbidden/missing variants |
| catalog equality | changed family, timeout, capability or binding ref is not accepted as historical equivalent |
| no raw material | serialization/debug/accessors expose no path, endpoint, topic, credential or secret |
| restart | rehydrate uses stored snapshot and never calls current config loader or candidate lister |
| missing revision | absent/corrupt/unknown config or external binding produces manual consistency classification and zero plan mutation |
| timeout separation | changing invocation `job_timeout` does not change snapshot or plan digest |

## 26. `ObservationJobExecutionPlan` object card

### 26.1 Capability and exact Rust-facing definition

The plan is the durable source of truth for one accepted observation-side work-set. It is not business truth, a source snapshot owner, a report owner, a claim owner or an external run record.

```rust
/// Immutable accepted work-set with mutable item classifications.
pub struct ObservationJobExecutionPlan {
    plan_ref: ObservationJobExecutionPlanRef,
    execution_ref: ObservationJobExecutionRef,
    idempotency_ref: IdempotencyRef,
    job_run_id: JobRunId,
    operation_name: ObservationJobOperation,
    request_digest: RequestDigest,
    config_snapshot: JobExecutionConfigSnapshot,
    items: Vec<ObservationJobPlanItem>,
    plan_digest: RequestDigest,
}
```

`JobRunId` is the first accepted public invocation correlation value. It is not a unique plan key, not an idempotency key, not a local execution identity and not a real external/runtime run id. It is deliberately excluded from `plan_digest`.

### 26.2 Field source and mutability

| field | source | mutability / boundary |
|---|---|---|
| `plan_ref` | D-2 application ID generator at accepted start | immutable durable PK/rehydrate anchor |
| `execution_ref` | D-2 local accepted execution identity | immutable one-plan lineage |
| `idempotency_ref` | acquired idempotency reservation | immutable relation; not derived from plan ref |
| `job_run_id` | accepted public Job metadata | immutable correlation only; excluded from uniqueness and digest |
| `operation_name` | typed Job operation | immutable; must equal snapshot operation and context operation |
| `request_digest` | canonicalized accepted Job input | immutable; duplicate/conflict material, not external proof |
| `config_snapshot` | D-4 snapshot factory after candidate/binding validation | immutable; no current-config substitution |
| `items` | bounded exact candidate materialization + D-3 item factory | work-set and each item's planned fields immutable; only item state/outcome mutate through D-3 CAS |
| `plan_digest` | canonical plan material after all immutable fields are validated | immutable; mismatch is consistency failure |

### 26.3 Plan factory and read methods

| member | exact contract |
|---|---|
| start materialization | `pub(crate) fn try_materialize(plan_ref: ObservationJobExecutionPlanRef, execution_ref: ObservationJobExecutionRef, idempotency_ref: IdempotencyRef, job_run_id: JobRunId, operation_name: ObservationJobOperation, request_digest: RequestDigest, config_snapshot: JobExecutionConfigSnapshot, items: Vec<ObservationJobPlanItem>, plan_digest: RequestDigest) -> Result<Self, ApplicationError>` |
| rehydrate | `pub(crate) fn try_rehydrate(plan_ref: ObservationJobExecutionPlanRef, execution_ref: ObservationJobExecutionRef, idempotency_ref: IdempotencyRef, job_run_id: JobRunId, operation_name: ObservationJobOperation, request_digest: RequestDigest, config_snapshot: JobExecutionConfigSnapshot, items: Vec<ObservationJobPlanItem>, plan_digest: RequestDigest) -> Result<Self, ApplicationError>` |
| identity accessors | `plan_ref()`, `execution_ref()`, `idempotency_ref()`, `job_run_id()`, `operation_name()` read-only |
| material accessors | `request_digest()`, `config_snapshot()`, `items()`, `plan_digest()` read-only |
| item lookup | `pub fn item(&self, work_key: &ObservationJobWorkKey) -> Option<&ObservationJobPlanItem>`; canonical key comparison only |
| completeness check | `pub(crate) fn validate_finalize_ready(&self) -> Result<(), ApplicationError>`; rejects Planned/Running and checks item outcome totality |
| digest check | `pub(crate) fn validate_plan_digest(&self, expected: &RequestDigest) -> Result<(), ApplicationError>`; no recomputation from current truth |

The factory verifies operation equality, the idempotency/execution relation supplied by the accepted start UoW, snapshot operation equality, canonical item ordering, global work-key uniqueness within the plan, item plan-ref equality and stored digest coverage. Exact canonical byte encoding remains the controlled F-batch dependency; an implementation must not accept an unchecked arbitrary digest.

### 26.4 Canonical item ordering and plan digest coverage

Items are sorted by the versioned canonical bytes of `ObservationJobWorkKey`. Duplicate keys are rejected before persistence. The plan digest covers exactly:

1. `operation_name` finite discriminator;
2. `request_digest`;
3. canonical `JobExecutionConfigSnapshot`, including `config_ref`, operation and sorted typed bindings;
4. for each canonical item: work key, `planned_input_digest` and `observed_version` / source version;
5. the canonical digest profile marker once F/Step 13 closes its exact encoding.

The digest does **not** cover:

- `plan_ref`, `execution_ref`, `idempotency_ref` or `job_run_id`;
- item current state/outcome, retry attempt, claim identity, fencing token, lease heartbeat or worker identity;
- repository row version / transaction version / local clock;
- report summary, public response, external provider response or evidence alias.

Captured repository versions may remain in private planned material for CAS/source-fence checks, but they are deliberately not plan identity material. Source/observed version markers are included because they bind the accepted observation-side input revision.

### 26.5 Plan invariants and mutation boundary

1. A plan has one execution lineage and one idempotency reservation relation; neither is inferred from `job_run_id`.
2. `config_snapshot`, work-key set, item order, planned material, planned input digest and source/observed version cannot be replaced after accepted start commit.
3. Plan-level code exposes no setter, append-item, remove-item, reorder-item or replace-snapshot method.
4. Item state/outcome changes use D-3 `classify_with_cas` under the D-5 claim/fence proof; a plan method may only delegate a validated item CAS, never mutate the immutable work-set.
5. `plan_digest` remains stable across item execution and report folding.
6. Report is a derived projection of item classifications; it cannot add an item, repair a missing item or redefine plan completeness.
7. Plan contains observation-side coordination material only. It does not own source truth, business truth, external acceptance, final verdict, signoff, real run id or test evidence.

### 26.6 Plan tests

| test cut | must prove |
|---|---|
| identity separation | equal public `JobRunId` values do not collide plans; local execution/plan/idempotency refs remain distinct |
| canonicalization | shuffled items produce one canonical order; duplicate global work key rejects |
| material compatibility | work-key variant and D-3 planned-material variant mismatch rejects; current truth cannot reconstruct a missing material |
| digest inclusion | changing operation, request digest, snapshot binding/value, item key, planned digest or source version changes expected material |
| digest exclusion | changing plan/execution/idempotency ref, public JobRunId, claim/fence, worker, attempt, clock or report summary does not change digest material |
| immutability | attempts to append/remove/reorder item or replace snapshot after start are rejected |
| rehydrate | exact persisted plan round-trips; corrupt/missing snapshot, item or digest gives consistency failure and zero write |
| finalize guard | Planned/Running, missing outcome or incompatible outcome prevents finalize; terminal item fold is lossless |

## 27. D-4 start, resume and persistence ordering

### 27.1 Accepted start UoW

The following order is part of the object contract. Step 09/11 will later give exact port signatures, but no implementation may reorder the semantic stages:

1. Validate typed Job metadata, actor, operation, idempotency key and request digest.
2. Reserve or load the idempotency scope. `Replay`, `Conflict` and `InFlight` return before candidate listing; they do not create a second plan.
3. For a newly acquired reservation, mint local `ObservationJobExecutionRef` and `ObservationJobExecutionPlanRef` and retain the accepted public `JobRunId` only as correlation.
4. Materialize the bounded candidate set exactly once from the operation-specific observation-side source. Enforce hard `max_plan_items`, complete pagination/cursor conditions and work-key/material compatibility. No external effect call occurs.
5. Derive the operation-specific typed `JobExecutionConfigSnapshot`, including only the distinct external binding revisions actually required by the frozen items. Validate against the safe catalog and historical binding availability.
6. Construct every D-3 item as `Planned + outcome=None`, canonical-sort the items and reject duplicate global work keys.
7. Build/verify plan digest using the exact coverage table in §26.4. An unknown digest profile or unchecked digest is a start consistency failure.
8. Persist plan, snapshot, all initial items, execution/idempotency linkage and Draft report linkage in the same accepted start UoW. A candidate overflow, incomplete page, missing binding, invalid snapshot or digest mismatch rolls back the whole start; no partial plan is accepted.
9. Commit successfully before acquiring item claims, making external calls, or reporting an accepted durable work-set.

The snapshot is derived after the exact work-set is known because external effect bindings are plan-item-dependent. It is still persisted atomically with the plan and is immutable thereafter.

### 27.2 Resume / rehydrate

1. Load the persisted plan by plan ref, execution ref or the idempotency relation and validate exact identity relations.
2. Rehydrate the stored snapshot, items and plan digest; resolve compatible historical binding revisions by their typed refs only.
3. If any snapshot, binding, item material, digest profile or cross-field relation is missing/corrupt/unknown, stop with consistency/manual classification. Do not use current config, current candidate listing, current source truth, current target policy or current external route to repair it.
4. Obtain a fresh D-5 execution/item claim and current fence before any mutable classification or protected local write. A local clock or worker identity cannot substitute durable claim authority.
5. Process only stored nonterminal/retryable items according to their exact material. Do not add, delete, merge, split, reorder or relist items.
6. Retry uses the frozen retry policy and same typed material/token rules. Unknown commit or external outcome remains unknown/manual according to Step 12; it is not converted to a new candidate or generic success.
7. Finalize only after the item CAS and report fold see a complete terminal-compatible set under a current claim/fence.

### 27.3 Terminal duplicate replay

Terminal duplicate handling loads the original durable plan/report/stored result and validates operation, actor-scoped idempotency scope and request digest. It does not load current configuration, rerun candidate listing, call an external adapter or create a new plan. `job_run_id` of the incoming invocation remains correlation for the new entry response and does not replace the original plan's accepted correlation.

## 28. D-4 affected definitions and handoff

| affected location | D-4 correction | required downstream action |
|---|---|---|
| frozen Step 08 Job metadata | retain public `job_run_id: JobRunId` as correlation only; do not expose local execution/plan/claim as public run identity | Step 08 per-Job protocol audit |
| frozen Step 09 Job flows | make reserve-before-list, snapshot-after-materialization, atomic plan start and commit-before-claim explicit per Job | Step 09 per-flow rewrite |
| frozen Step 11 plan store | store exact plan/snapshot/items and relations; plan immutable fields cannot be updated by item CAS; start/resume ordering is authoritative | Step 11 affected persistence audit |
| frozen Step 11 resume code | remove current-config/current-candidate reconstruction; missing historical binding is consistency/manual | Step 11 resume section repair |
| frozen Step 13 §18 | replace old plan shape with D-2/D-3/D-4 fields; include JobRunId correlation and exact digest include/exclude set | Step 13 affected review / F digest closure |
| frozen Step 14 §9.1 / §9.5 | keep support value derivation and catalog assembly; downgrade duplicate `JobConfigBinding`/snapshot definitions to use-site | Step 14 owner audit |
| D-3 item card | plan supplies canonical ordering and immutable snapshot relation; item remains sole mutable classification owner | D-5 claim proof and D-6 cross-object closure |
| `04-配置设计.md` | no current write; future config document must define raw keys/source/profile/defaults without changing typed object ownership or snapshot semantics | only after `03` repair chain unfreezes `04` |

### 28.1 D-5 input reservation

D-5 may consume, but may not redefine, these D-4 facts:

- every claim is bound to one exact `plan_ref` and either the execution subject or global typed work key;
- lease parameters come from the frozen `ClaimLease` binding;
- claim/fence/current owner/heartbeat are mutable coordination facts and never enter plan digest;
- a fresh claim is required before item CAS, plan/report protected writes or resume;
- a claim does not change snapshot, work-set, item planned material or external stable token.

## 29. D-4 planned validation cuts

| cut | required assertion | result status |
|---|---|---|
| support type validation | zero, overflow, invalid ratio, reversed duration, heartbeat >= lease and unknown wire token fail closed | planned; not run |
| owner scan | exactly one current owner for each support type, binding, snapshot and plan; Step 14 is use-site only | planned; not run |
| operation matrix | nine Job operations have total required/forbidden binding coverage | planned; not run |
| external binding equality | ref/family/timeout/capabilities and required phases match safe catalog exactly | planned; not run |
| snapshot round trip | canonical sorted bindings rehydrate without current-config read | planned; not run |
| snapshot secrecy | no raw locator, credential, secret, endpoint, topic, schedule or provider body crosses application boundary | planned; not run |
| plan ordering | work-key canonical ordering and uniqueness are deterministic and versioned | planned; not run |
| plan digest | inclusion/exclusion matrix in §26.4 is enforced; arbitrary debug/string hash is rejected | planned; not run |
| start atomicity | candidate overflow, incomplete page, snapshot error or digest mismatch produces no partial plan/item/report | planned; not run |
| resume | spy/fake source confirms no relist, current-config substitution or target re-resolution | planned; not run |
| timeout separation | invocation timeout changes no durable plan field and cannot fabricate terminal result | planned; not run |
| no truth write | plan/snapshot construction does not modify source/business truth or create external acceptance | planned; not run |

No test, implementation run, evidence alias, real run id or acceptance signature is claimed by this design-only batch.

## 30. D-4 stop gate

| gate | status | evidence / remaining constraint |
|---|---|---|
| typed support cards | `pass_design_only` | §§23.1~23.10 individually define owner, exact fields, factories/accessors, validation and forbidden substitutions |
| `JobConfigBinding` card | `pass_design_only` | §24 closes finite variants, cardinality, operation validation and external catalog equality |
| `JobExecutionConfigSnapshot` card | `pass_design_only` | §25 closes owner, exact three-field schema, canonical ordering, historical rehydrate and nine-operation matrix |
| `ObservationJobExecutionPlan` card | `pass_design_only` | §26 closes public/local identity separation, fields, item ordering, digest coverage and mutation boundary |
| start/resume order | `resolved_for_D4` | §27 requires exact work-set freeze, atomic plan persistence, no relist and no current-config substitution |
| config owner blockers | `resolved_in_D4` | `R06.6-JOB-CONFIG-OWNER` and `R06.6-D-CONFIG-SUPPORT-OWNER` closed |
| digest encoding | `open_controlled` | coverage is closed; canonical byte/profile implementation remains R06.6-F / Step 13 affected review |
| claim shape | `open_controlled` | D-5 must define exact claim identity/subject/owner/lease/heartbeat/fence |
| overall Step 06 quality blocker | `open` | `03-RPR-S06-GRANULARITY` still requires D-5/D-6, R06.7/R06.8 and downstream affected audits |
| external upstream blocker | `none` | no `00/01/02` rollback required |
| current gate | `R06.6-D4_done_waiting_user` | stop here; do not enter D-5 without explicit user confirmation |

### 30.1 下一批阅读清单

用户确认后只进入 `R06.6-D5_claim_state_claim_cards`，先读取：

- 本文件 §§22~30，特别是 plan exact binding、ClaimLease relation、start/resume order和digest exclusions；
- D-2 `ObservationFencingToken` / `ObservationJobWorkKey` cards；
- D-3 item CAS、state/outcome compatibility、planned material immutability cards；
- Step 11 job execution store、claim acquire/renew/release、commit-time fence和resume ordering；
- Step 13 §18.3 claim/fencing use-site、global work-key uniqueness和fresh-claim reentry rules；
- Step 14 `ClaimLeaseConfig` validation and runtime assembly sections；
- Step 12 stale writer、lease expiration、commit unknown、retry and manual classification sections。

D-5 只允许写 `ObservationExecutionClaimState` 和 `ObservationExecutionClaim` 两张独立对象卡及 lease/fence transition matrix；不得进入 D-6、R06.6-E/F、R06.7/R06.8、Step 07、正式 `03`、任何 `04` 文件或实现代码。当前不需要提交 commit。

## 31. R06.6-D5 输入复核、范围与写入门禁（completed checkpoint）

### 31.1 当前批次状态

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application::jobs`，具体为 durable claim state / claim authority |
| 当前批次 | `R06.6-D5_claim_state_claim_cards` |
| 上游恢复点 | D-4 plan/config snapshot 已完成；用户已确认进入 D-5 |
| 本批覆盖 | `ObservationExecutionClaimState`、`ObservationExecutionClaim`、claim subject、claim/owner identity、lease/heartbeat/fence transition matrix、commit-time authority rules |
| 本批不覆盖 | D-6 H12 cross-object closure、report/disposition/error owner、canonical digest encoding、Step 07 trait finalization、Step 08/09 per-protocol/per-flow rewrite、正式 `03` 或任何 `04` 正文 |
| 当前 gate_status | `R06.6-D5_done_waiting_user` |
| 外部上游 blocker | `none` |
| 当前内部 blocker | `03-RPR-S06-GRANULARITY=open`；`R06.6-DISPOSITION-LAYER`、`R06.6-APP-ERROR-OWNER`、`R06.6-DIGEST-CANONICALIZER` 仍不由本批关闭 |
| 正式回填 | `blocked_until_step_19`;本批只写 calibration 中间产物，正式 `03` 继续冻结 |
| 是否需要提交 | 不需要 |

### 31.2 写入前检查

| 检查项 | 结论 |
|---|---|
| D-4 输入 | 已读取 §§22~30；claim 只能绑定已提交 `plan_ref`，lease 参数来自冻结 snapshot，claim/fence 不进入 plan digest |
| D-2 输入 | 已读取 execution ref、plan ref、`ObservationFencingToken` 与 `ObservationJobWorkKey` 卡；item claim 的 global uniqueness 按 typed work key 保持 |
| D-3 输入 | 已读取 item state/outcome/item CAS 与 planned-material immutability；claim 不拥有 item state，也不能改变 planned material |
| Step 11 输入 | 已读取 job store、unique active subject、CAS、`register_fence`、commit-time validation 和 resume ordering |
| Step 12 输入 | 已读取 stale writer、lease expiration、commit unknown、probe/manual 与 retry classification；lease expiry 不等于 rollback 或 external abort |
| Step 13 输入 | 已读取 global work-key competition、fresh-claim reentry、monotonic fence 和 no-blind-retry 约束 |
| Step 14 输入 | 已读取 `ClaimLeaseConfig`；本批不复制 raw config 或 profile schema |
| shared carrier 检查 | `BodyFreeRef`、`ObservedAt`、`ObservationRepositoryVersion`、`ObservationFencingToken`、execution/plan/work-key 类型可复用；claim-row identity 与 lease-owner epoch 尚无现成 owner，必须在本批显式登记 |
| historical claim | 旧四字段 `execution_ref/work_key/fencing_token/state` 仅为 repair input；不得直接恢复 |
| 实现与证据纪律 | 不实现代码，不声称测试、commit、真实 run、evidence alias 或验收签署 |

### 31.3 D-5 的严格边界

D-5 只定义“谁在当前 durable claim epoch 内有权限提交本地 observation-side mutable write”。它不定义或拥有：

- source truth、business truth、report verdict、external acceptance、evidence、signoff 或真实 runtime run；
- `ObservationJobPlanItemState` / `ObservationJobPlanItemOutcome` 的变体和分类语义；
- repository row version、projection source read fence、committed cursor 或 external stable effect token；
- actor authorization。`ActorSafeRef` 仍是 operation context 的可信主语，不得用它替代一次 worker lease owner；
- worker host、pod、thread、process id、schedule id、endpoint、credential、raw provider response 或配置正文。

Claim/fence 只证明当前本地 writer 的 durable authority。即使 claim 为 `Active`，也必须分别满足 item CAS、source read fence、retention/no-write guard、external token/probe 和 repository commit 条件。

## 32. D-5 输入权威、冲突裁决与对象模型

### 32.1 本批实际读取的权威顺序

| 顺序 | 输入 | 本批消费内容 | 不继承 |
|---:|---|---|---|
| 1 | D-4 §§22~30 | immutable plan、exact `plan_ref` binding、`ClaimLeaseConfig` 来源、start/resume 顺序 | 旧 claim 字段、Step 14 duplicate definition |
| 2 | D-2 §§9~12 | execution identity、plan identity、global typed work key、positive monotonic fence | public `JobRunId` 作为 claim identity、裸整数 token |
| 3 | D-3 §§16~20 | item planned material、CAS、state/outcome compatibility | claim 改写 item planned fields 或 report fold |
| 4 | Step 11 §§16.5-a、18.3 与 job ordering | durable unique active indexes、claim repository calls、commit-time fence | 物理表名、未闭合 adapter schema、长事务包住整个 Job |
| 5 | Step 12 §§13~15 与 recovery matrix | stale / expired / unknown / manual 分层 | lease expiry 推导“未执行”或“external 未接收” |
| 6 | Step 13 §§8、18、25 | global competition、fresh reentry、fake/durable parity | process mutex、same stale token retry、current-config repair |
| 7 | Step 14 §9.5、§13~§14 | lease/heartbeat typed values和runtime capability gate | 在 claim 中复制 raw key、default、profile 或 locator |

### 32.2 旧 shape 的修复裁决

旧 claim 只有 `execution_ref`、可选 `work_key`、`fencing_token` 和 `state`，存在五个不可落码缺口：

1. 没有独立 claim identity，无法区分同一 subject 的不同 ownership epoch，也无法安全定位 renew/release 目标。
2. 没有 `plan_ref`，同一 execution 的 plan relation 无法在 commit 时验证。
3. `Option<work_key>` 允许 execution claim 与 item claim 的非法混形，无法表达 subject 互斥规则。
4. 没有 owner epoch，旧 worker 可能仅凭相同 actor 或 token 伪装为当前 owner。
5. 没有 acquisition/heartbeat/deadline/transition time，durable authority 无法 rehydrate 或审计 lease 生命周期。

因此本批采用“每次成功 acquire 一个新的 claim identity + 一个新的 owner epoch；terminal claim 不重新激活”的模型。旧 claim row 保留为 `Released` 或 `Expired` 历史，新的 active row 通过 subject unique index 取得唯一 ownership。若 adapter 选择物理复用 row，必须在逻辑层仍表现为新的 claim identity和新的 ownership epoch；不能让旧 ref/token 看起来被复活。

### 32.3 claim subject 的精确定义

```rust
/// The exact local subject whose mutable writes are protected by one claim.
pub(crate) enum ObservationExecutionClaimSubject {
    /// Plan-level ownership for report/finalize and execution-scoped local writes.
    Execution {
        /// Accepted local execution lineage bound to the immutable plan.
        execution_ref: ObservationJobExecutionRef,
    },
    /// Item-level ownership; the work key is globally unique across executions.
    Item {
        /// Accepted local execution that materialized the item.
        execution_ref: ObservationJobExecutionRef,
        /// Global typed identity competing across all job executions.
        work_key: ObservationJobWorkKey,
    },
}
```

| subject | active uniqueness | allowed protected writes | cannot authorize |
|---|---|---|---|
| `Execution { execution_ref }` | one active claim per execution ref | plan/report finalize, execution-level report/result/idempotency coordination | another execution, a work key not in the plan, external acceptance |
| `Item { execution_ref, work_key }` | one active claim per global `work_key`; execution ref is a relation check, not part of global uniqueness | exact item owner/marker/outbox/projection/handoff local mutation and item classification | plan-level finalize, a different work key, source truth or external retry by itself |

The item subject must satisfy all of the following before acquire: `plan_ref` resolves to a committed plan; plan `execution_ref` equals subject `execution_ref`; the work key occurs exactly once in that plan; the item is not terminal; and the requested operation is compatible with the frozen item material. An execution subject must not carry a work key, and an item subject must never be represented as `None` plus a side field.

### 32.4 acquire/reentry semantic sequence

The exact repository trait remains a Step 07 output, but the following semantic ordering is already part of the D-5 object contract:

1. Load the committed immutable plan by `plan_ref` and validate the execution relation; start UoW cannot acquire a claim before its plan commit.
2. Resolve the exact subject and, for an item, validate global work-key membership and terminal state.
3. Inspect the durable current claim under the subject unique index. A current `Active` claim with a valid authority window returns a typed conflict/in-flight result; it never gets adopted by another owner.
4. If the current claim is durably proven expired, transition that row to `Expired` in the same atomic claim operation before creating the new row. A local worker clock alone cannot perform this takeover.
5. Mint a new `ObservationExecutionClaimRef`, a new `ObservationClaimOwnerRef`, and a strictly larger `ObservationFencingToken` for the exact subject. The old token and owner remain invalid forever.
6. Persist the new `Active` claim with acquisition/heartbeat/deadline metadata, then return it to the runner. No source/business truth or external call occurs in this operation.
7. Before every protected local save, register the exact claim identity, subject, owner and fence in the current short UoW. Commit validation rechecks the durable active row and authority window atomically.

Resume after process loss or explicit release follows the same sequence against the stored plan. It does not regenerate the plan, read current config, relist candidates, or infer that an item was rolled back merely because a prior claim expired.

## 33. D-5 claim support carriers

### 33.1 `ObservationExecutionClaimRef`

```rust
/// Durable identity of one claim ownership epoch.
#[repr(transparent)]
pub struct ObservationExecutionClaimRef(BodyFreeRef);
```

| 卡片项 | exact contract |
|---|---|
| canonical owner | `application::jobs`；不进入 public protocol、plan digest 或 report result identity |
| mint source | application ID generator at successful durable acquire; the generator method is a downstream Step 07 affected definition, not assumed to exist today |
| rehydrate | `pub(crate) fn try_rehydrate(value: BodyFreeRef) -> Result<Self, ApplicationError>`;只校验 body-free identity，不访问 current plan/config |
| accessors | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`; `pub(crate) fn canonical_bytes(&self) -> &[u8]` |
| identity rule | 每次 successful acquire 新建；`Released` / `Expired` 的 claim ref 永不重新变为 `Active` |
| persistence role | claim row PK / commit-validation lookup anchor；不是 plan ref、execution ref、work key 或 attempt ref |
| forbidden | 从 `plan_ref`、`execution_ref`、work-key bytes、clock、fencing token、worker host 或 hash 派生；不得与任何 other ref 做 `From` 转换 |

`BodyFreeRef` 的统一长度、字符集与 redacted debug 规则继续适用。该 ref 是本地 durable identity，不证明 owner 当前仍有 authority；authority 必须由 current claim row + subject + owner + token + state 联合验证。

### 33.2 `ObservationClaimOwnerRef`

```rust
/// Opaque owner epoch held by one local claimant for one claim row.
#[repr(transparent)]
pub struct ObservationClaimOwnerRef(BodyFreeRef);
```

| 卡片项 | exact contract |
|---|---|
| canonical owner | `application::jobs`，private/application-internal carrier；不属于 actor、protocol 或 business truth |
| mint source | fresh owner capability generated for each successful acquire; it must not be copied from host/pod/thread/process identity |
| rehydrate | `pub(crate) fn try_rehydrate(value: BodyFreeRef) -> Result<Self, ApplicationError>`;只校验 opaque value |
| accessors | `pub(crate) fn as_body_free_ref(&self) -> &BodyFreeRef`;无 public wire accessor |
| lifecycle | heartbeat/renew 保留同一 owner ref；release/expiry 后永不复用；fresh acquire 必须生成新 owner ref |
| proof role | 与 `claim_ref`、subject、plan_ref、`ObservationFencingToken` 联合构成 local ownership proof；单独 owner ref 不授予写权 |
| forbidden | `ActorSafeRef`、`JobRunId`、trace ref、worker name、pod id、credential、random attempt label、external id 或 plan digest material |

该类型不承诺密码学不可伪造，也不把本地 claim 提升为安全认证。它只防止 durable store 把不同 ownership epoch 或不同 claim row 混为同一 owner；真正的 authority 仍由 store-side CAS/fence validation 提供。

### 33.3 Support carrier closure

| carrier | owner | current use | downstream affected definition |
|---|---|---|---|
| `ObservationExecutionClaimRef` | `application::jobs` | claim row PK、renew/release target、commit registration | Step 07 `IdGeneratorPort::new_execution_claim_ref`; Step 11 claim PK/index mapping |
| `ObservationClaimOwnerRef` | `application::jobs` | ownership epoch held by one claimant | Step 07 acquire input/output and runtime owner-token lifetime |
| `ObservationExecutionClaimSubject` | `application::jobs` | finite execution/item subject and uniqueness key | Step 07 claim repository signatures; Step 11 active unique indexes |
| `ObservedAt` | existing `contracts::metadata` owner | acquisition, heartbeat, deadline and transition metadata | Step 07 clock/claim authority time mapping; no new timestamp type |
| `ObservationRepositoryVersion` | existing application port carrier | CAS envelope for claim row | Step 07/11 `Versioned<ObservationExecutionClaim>` and expected-version signatures |

No new public contract, config key, report field or domain truth type is introduced by these carriers. The two new opaque refs must be included in the later owner scan; until the affected Step 07/11 definitions are synchronized, this D-5 batch remains design-only and does not claim implementation readiness.

## 34. `ObservationExecutionClaimState` 对象卡

### 34.1 Rust-facing definition

```rust
/// Durable lifecycle state of one local execution or item claim row.
pub enum ObservationExecutionClaimState {
    /// The claim is the current durable authority for its exact subject.
    Active,
    /// The owner explicitly relinquished the claim before a replacement epoch.
    Released,
    /// Durable claim authority classified the lease as expired and invalidated the owner.
    Expired,
}
```

This enum's subject is one claim row, not a Job plan, plan item, report, external effect or worker process. `Released` and `Expired` are terminal historical states for that claim identity. A fresh acquire creates a new claim row; it never transitions either terminal variant back to `Active`.

### 34.2 Variant contract and transition matrix

| variant | creation source | allowed outgoing transition | forbidden interpretation |
|---|---|---|---|
| `Active` | successful atomic acquire after plan/subject/unique-index validation | `Active` heartbeat/renew; `Released` explicit owner release; `Expired` durable expiry classification | not proof of source freshness, external success, or exactly-once |
| `Released` | current owner release committed with exact claim/fence/CAS | none; new acquire creates a new claim identity | not proof that item work rolled back or external call did not happen |
| `Expired` | durable authority observes deadline breach and atomically invalidates current owner | none; new acquire creates a new claim identity | not proof of rollback, cancellation, or external non-delivery |

| from | operation | required proof | result |
|---|---|---|---|
| absent / terminal prior claim | acquire | committed plan, exact subject, no active conflict, new owner, strictly newer token, lease window | new `Active` claim |
| `Active` | heartbeat / renew | same claim ref, plan, subject, owner, token; current row/version; authority time before expiry; valid frozen lease config | same claim identity/state/token, newer heartbeat/deadline |
| `Active` | release | same claim ref, plan, subject, owner, token; current row/version; release is still against current active row | `Released` claim |
| `Active` | expire | current row/version; durable authority proves `authority_time >= lease_expires_at`; no local-clock-only takeover | `Expired` claim |
| `Released` / `Expired` | renew/release/commit | none | `ExecutionFenceConflict` or invalid transition; zero write |
| any stale row | protected local save | exact current claim identity + subject + owner + token + active authority + row CAS | stale writer rejected; staged UoW rolled back |

### 34.3 State members and pure guards

| member | exact signature | contract |
|---|---|---|
| `is_active` | `pub const fn is_active(&self) -> bool` | only `Active` returns `true`; read-only |
| `is_terminal` | `pub const fn is_terminal(&self) -> bool` | `Released` and `Expired` return `true`; does not imply work completion |
| `can_renew` | `pub(crate) fn can_renew(&self) -> bool` | only checks state; caller must still validate identity, version and authority time |
| `can_release` | `pub(crate) fn can_release(&self) -> bool` | only `Active` is eligible; no write occurs |
| `can_expire` | `pub(crate) fn can_expire(&self) -> bool` | only `Active` is eligible; this predicate cannot classify expiry by itself |
| `canonical_discriminator` | `pub(crate) const fn canonical_discriminator(&self) -> u8` | explicit stable state code for claim persistence; not part of plan digest |

The enum has no `take_over`, `force_release`, `reset`, `reopen`, `cancel`, or `success` member. Those names would allow a worker to manufacture authority or conflate claim lifecycle with item/report outcome.

### 34.4 State-level planned validation cuts

| test cut | must prove | result status |
|---|---|---|
| variant decoding | exactly `Active`, `Released`, `Expired`; unknown token fails closed; no `Other(String)` | planned; not run |
| terminality | terminal claim cannot renew, release again, or return to active | planned; not run |
| durable expiry | only authority-backed deadline breach yields `Expired`; local predicate alone cannot take over | planned; not run |
| release semantics | explicit current-owner release yields `Released`; old token remains invalid | planned; not run |
| state separation | claim state changes never change item state, report state, source truth or external token | planned; not run |
| canonical code | explicit state code round-trips without enum ordinal fallback | planned; not run |

Object stop conclusion: `pass_design_only_for_state`; claim field, authority and repository closure continues in §35~§38 below.

## 35. `ObservationExecutionClaim` 对象卡

### 35.1 capability 与对象职责

`ObservationExecutionClaim` 是一条 durable local ownership epoch 的完整 carrier。它把一个已提交 immutable plan、一个精确 claim subject、一个独立 owner epoch、一个同 subject 单调递增的 fencing token 和 lease 生命周期绑定在一起，供 claim repository 做 acquire / renew / release / expiry CAS 以及供短 UoW 做 commit-time fence validation。

它不是：

- Job execution plan、plan item、report 或 idempotency reservation 的替代品；
- worker identity、actor authorization、process lock 或安全认证凭据；
- source read fence、repository row version、committed cursor 或 external effect token；
- 对 item 已执行、source 已回滚、external 已未接收或业务操作已成功的证明。

### 35.2 Rust-facing definition

```rust
/// Durable local authority for one execution-level or globally competing item subject.
pub struct ObservationExecutionClaim {
    /// Unique identity of this ownership epoch and claim row.
    claim_ref: ObservationExecutionClaimRef,
    /// Immutable plan to which the claim is bound.
    plan_ref: ObservationJobExecutionPlanRef,
    /// Exact execution-level or item-level subject protected by this claim.
    subject: ObservationExecutionClaimSubject,
    /// Opaque owner epoch minted for this claim acquisition.
    owner_ref: ObservationClaimOwnerRef,
    /// Monotonic fence for this subject ownership epoch.
    fencing_token: ObservationFencingToken,
    /// Durable lifecycle of this claim row.
    state: ObservationExecutionClaimState,
    /// Authority time at which this claim became Active.
    acquired_at: ObservedAt,
    /// Last authority heartbeat accepted for this owner epoch.
    last_heartbeat_at: ObservedAt,
    /// Lease deadline computed from the frozen plan ClaimLease binding.
    lease_expires_at: ObservedAt,
    /// Authority time of acquisition, release, or expiry transition.
    last_state_transition_at: ObservedAt,
}
```

所有字段保持 private。不能通过 public struct literal、serde constructor、`Default` 或无校验 clone 改变 claim identity、subject、owner、token、state 或 deadline。持久化 row version 由 `Versioned<ObservationExecutionClaim>` / repository read envelope 携带，不嵌入该对象，也不进入 plan digest。

### 35.3 字段来源、持久化角色与不变量

| 字段 | exact type | 来源 | 持久化 / 不变量 |
|---|---|---|---|
| `claim_ref` | `ObservationExecutionClaimRef` | successful durable acquire 的 application ID generator | claim row PK；每个 acquire 新值；terminal row 永不复活 |
| `plan_ref` | `ObservationJobExecutionPlanRef` | committed immutable plan | 必须指向已提交 plan；renew/release/commit 不能替换 |
| `subject` | `ObservationExecutionClaimSubject` | plan-level finalize 或 exact plan item runner | execution subject 不带 work key；item subject 的 key 必须在该 plan 中恰好一次 |
| `owner_ref` | `ObservationClaimOwnerRef` | successful acquire 的 fresh owner capability | heartbeat/renew 保持；release/expiry 后永不复用 |
| `fencing_token` | `ObservationFencingToken` | durable claim authority | 同一 exact subject 的 fresh acquire 严格递增；renew 不改变；不跨 subject比较 |
| `state` | `ObservationExecutionClaimState` | acquire / release / durable expiry transition | `Active` 可续租或结束；`Released` / `Expired` terminal |
| `acquired_at` | `ObservedAt` | durable authority clock at acquire | immutable；不得由 worker local time 或 request time填充 |
| `last_heartbeat_at` | `ObservedAt` | durable authority at acquire/renew | 不早于 `acquired_at`；renew只能单调前进 |
| `lease_expires_at` | `ObservedAt` | authority time + frozen `ClaimLeaseConfig.lease_duration` | Active authority window；overflow或非未来 deadline fail closed；不由 current config替换 |
| `last_state_transition_at` | `ObservedAt` | authority at acquire/release/expiry | 不早于 acquire/heartbeat；仅表示 claim lifecycle transition，不表示 item outcome |

Claim row 不保存 raw lease key、profile、duration source、heartbeat configuration object、worker host、pod、thread、attempt、retry count、external binding、provider response、report summary 或 plan digest material。Lease 参数从同一 immutable plan snapshot 读取；row 只保存计算后的 authority timestamps。

### 35.4 factory / rehydrate 契约

| member | exact signature | 前置与结果 |
|---|---|---|
| active acquire | `pub(crate) fn try_acquire(claim_ref: ObservationExecutionClaimRef, plan: &ObservationJobExecutionPlan, subject: ObservationExecutionClaimSubject, owner_ref: ObservationClaimOwnerRef, fencing_token: ObservationFencingToken, authority_now: ObservedAt, lease: &ClaimLeaseConfig) -> Result<Self, ApplicationError>` | 验证 plan 已提交语义、subject 与 plan/exact item 相容、item 非 terminal、token positive、owner/ref fresh、`authority_now` 可计算未来 deadline；返回 `Active` |
| rehydrate | `pub(crate) fn try_rehydrate(claim_ref: ObservationExecutionClaimRef, plan_ref: ObservationJobExecutionPlanRef, subject: ObservationExecutionClaimSubject, owner_ref: ObservationClaimOwnerRef, fencing_token: ObservationFencingToken, state: ObservationExecutionClaimState, acquired_at: ObservedAt, last_heartbeat_at: ObservedAt, lease_expires_at: ObservedAt, last_state_transition_at: ObservedAt) -> Result<Self, ApplicationError>` | 只校验 persisted fields 的 cross-field invariant；不读 current config、source truth 或 current plan to fill missing values |
| acquire deadline | `pub(crate) fn checked_lease_deadline(authority_now: &ObservedAt, lease: &ClaimLeaseConfig) -> Result<ObservedAt, ApplicationError>` | 纯计算 helper；duration overflow、非未来结果或时间格式非法均 fail closed；不改变 state |

`try_acquire` 不能自己判断 global uniqueness、当前 claim 是否 Active 或 token 是否严格大于历史值；这些必须先由 durable claim authority 原子完成。factory 负责拒绝不一致的组合，repository 负责唯一索引、CAS、token 分配和提交可见性。

`try_rehydrate` 的最低校验为：

1. 所有 opaque refs 均通过各自 typed factory；claim ref、owner ref、plan ref 不得 alias 到同一未标记字符串语义。
2. `subject` 的 execution ref 与 plan relation 可由调用方随后精确核验；item subject 不得为空 work key，且不能同时出现另一个侧栏 subject。
3. `acquired_at <= last_heartbeat_at <= lease_expires_at`；`last_state_transition_at >= acquired_at`。
4. `Active` 必须仍具备可计算的 lease deadline；`Released` / `Expired` 不得被 rehydrate 成可续租状态。
5. `fencing_token` 非零；任何状态都不允许减少或重置历史 token。

### 35.5 read-only members

| member | exact signature | 语义 |
|---|---|---|
| claim identity | `pub fn claim_ref(&self) -> &ObservationExecutionClaimRef` | 返回本 ownership epoch 的 durable identity |
| plan binding | `pub fn plan_ref(&self) -> &ObservationJobExecutionPlanRef` | 返回不可替换的 immutable plan anchor |
| subject | `pub fn subject(&self) -> &ObservationExecutionClaimSubject` | 返回 exact execution/item subject；只读 |
| owner | `pub(crate) fn owner_ref(&self) -> &ObservationClaimOwnerRef` | 仅 application/port fence registration 使用；不进入 public wire |
| fence | `pub const fn fencing_token(&self) -> &ObservationFencingToken` | 返回当前 epoch token；不单独授予写权 |
| state | `pub const fn state(&self) -> ObservationExecutionClaimState` | 返回 copyable finite state |
| acquire time | `pub fn acquired_at(&self) -> &ObservedAt` | 读取 durable acquisition metadata |
| heartbeat time | `pub fn last_heartbeat_at(&self) -> &ObservedAt` | 读取最后一次 accepted heartbeat |
| expiry time | `pub fn lease_expires_at(&self) -> &ObservedAt` | 读取当前 epoch deadline |
| transition time | `pub fn last_state_transition_at(&self) -> &ObservedAt` | 读取 claim state transition metadata |
| execution predicate | `pub const fn is_execution_claim(&self) -> bool` | subject variant 为 `Execution` 时为 true |
| item predicate | `pub const fn is_item_claim(&self) -> bool` | subject variant 为 `Item` 时为 true |
| authority predicate | `pub(crate) fn is_authoritative_at(&self, authority_now: &ObservedAt) -> bool` | 只对 `Active` 且 `authority_now < lease_expires_at` 返回 true；不执行持久化 expiry |

对象不提供 `set_state`、`set_owner`、`set_token`、`set_subject`、`set_deadline`、`take_over` 或 `reopen`。所有变化必须通过下节的受控 transition，并由 repository 对当前 row/version 做 CAS。

### 35.6 transition members

| member | exact signature | 前置 / 返回 |
|---|---|---|
| renew | `pub(crate) fn renew(&self, owner_ref: &ObservationClaimOwnerRef, fencing_token: &ObservationFencingToken, authority_now: ObservedAt, lease: &ClaimLeaseConfig) -> Result<Self, ApplicationError>` | 只接受 Active、exact owner/token、`authority_now` 不早于上次 heartbeat 且仍在 deadline 前；返回同 claim/plan/subject/owner/token 的 Active copy，仅更新 heartbeat/deadline；不含 repository CAS |
| release | `pub(crate) fn release(&self, owner_ref: &ObservationClaimOwnerRef, fencing_token: &ObservationFencingToken, authority_now: ObservedAt) -> Result<Self, ApplicationError>` | 只接受 Active、exact owner/token 和合法 authority time；返回 Released，保留 identity/plan/subject/owner/token/timestamps，更新 state transition time |
| expire | `pub(crate) fn expire_after_durable_authority(&self, authority_now: ObservedAt) -> Result<Self, ApplicationError>` | 只由已证明 durable expiry 的 claim authority 调用；要求 Active 且 `authority_now >= lease_expires_at`；返回 Expired，不接受 worker owner/token 伪造 expiry |
| commit validation | `pub(crate) fn validate_commit_authority(&self, claim_ref: &ObservationExecutionClaimRef, plan_ref: &ObservationJobExecutionPlanRef, subject: &ObservationExecutionClaimSubject, owner_ref: &ObservationClaimOwnerRef, fencing_token: &ObservationFencingToken, authority_now: &ObservedAt) -> Result<(), ApplicationError>` | 联合校验 exact identity/plan/subject/owner/token、Active state、authority window；不替代 row version、item CAS 或 source fence |
| subject match | `pub(crate) fn protects(&self, plan_ref: &ObservationJobExecutionPlanRef, subject: &ObservationExecutionClaimSubject) -> bool` | 纯读比较；不检查 current durable row，不授权写入 |

`renew` / `release` 返回新对象只是 domain/application-side transition candidate；只有 repository 在 current `ObservationRepositoryVersion`、current claim identity和唯一 subject index均匹配时提交，状态才可见。`expire_after_durable_authority` 的调用前提必须由 durable store 提供，local process 不得直接调用它作为 takeover shortcut。

### 35.7 claim object invariants

1. `claim_ref`、`owner_ref` 和 `fencing_token` 三者共同标识一个 ownership epoch，但三者各自有独立 owner，不能以同一字符串或同一 digest代替。
2. `plan_ref` 永远 immutable；claim 不能从一个 plan 转移到另一个 plan，也不能在 resume 时读取 current plan 来修复缺失关系。
3. Execution subject 的 active uniqueness 以 `execution_ref` 为准；Item subject 的 active uniqueness 以 `ObservationJobWorkKey` 为准，subject 中的 execution ref只做 plan relation / provenance validation。
4. Heartbeat 只延长当前同一 owner epoch；它不产生新 fence，不改变 work key，不改 plan digest，不重建 item material。
5. Release / expiry 使旧 owner 和旧 token 永久失效；新 acquire 必须创建新 claim ref、owner ref 和更大的 same-subject token。
6. Claim state terminal 不等于 item/report terminal。`Released` / `Expired` 之后，runner必须 probe/reload plan、item、report和external marker，再决定是否 fresh resume。
7. Claim authority 不绕过 `ObservationRepositoryVersion`、source read fence、retention/no-write guard、stable external token 或 probe result。

Object stop conclusion: `pass_design_only_for_claim_shape`; exact repository trait and port signatures remain affected handoff, not implementation-ready in this batch.

## 36. D-5 lease / fence transition matrix

### 36.1 Authority inputs and comparison rules

| input | canonical source | comparison / persistence rule | cannot substitute |
|---|---|---|---|
| claim identity | `ObservationExecutionClaimRef` | exact typed equality; identifies one ownership epoch | plan ref, work key, attempt label |
| plan binding | committed `ObservationJobExecutionPlanRef` | exact equality; plan must remain immutable | current plan, idempotency key, request digest |
| subject | `ObservationExecutionClaimSubject` | variant and payload must match; item global key is unique across executions | string subject, hash, report ref |
| owner epoch | `ObservationClaimOwnerRef` | exact equality for renew/release/commit; fresh acquire always changes it | `ActorSafeRef`, host/pod/thread, public `JobRunId` |
| fence | `ObservationFencingToken` | exact equality at commit; fresh same-subject acquire is strictly greater | repository version, cursor, timestamp, external token |
| authority time | `ObservedAt` from durable claim authority / configured clock boundary | `Active` iff `authority_now < lease_expires_at`; equality at deadline is expired | worker local time, request time, external timestamp |
| row version | `ObservationRepositoryVersion` | current-row CAS for claim mutation and commit registration | fence token, lease deadline, cursor |

The authority tuple for a protected local write is therefore:

```text
(claim_ref, plan_ref, subject, owner_ref, fencing_token, state=Active,
 authority_now < lease_expires_at, current_claim_row_version)
```

Every component is required. A matching fence without a matching claim identity, owner, subject, active state, lease window or row version is insufficient. Conversely, an active claim does not waive item state/CAS, source read-fence, retention/no-write or external token checks.

### 36.2 Lifecycle transition matrix

| current durable row | requested operation | atomic precondition | durable result | stale / invalid result |
|---|---|---|---|---|
| absent | `acquire(Execution)` | committed plan, exact execution relation, no active execution claim, fresh claim/owner refs, next same-subject token | new row `Active` | conflict/consistency; no row |
| absent | `acquire(Item)` | committed plan, exact item membership, item nonterminal, no active global work-key claim, fresh refs, next same-subject token | new row `Active` | conflict/consistency; no row |
| `Active` | `acquire` by any caller | current active row and authority window still valid | no takeover; preserve current row | typed in-flight/fence conflict; no second active row |
| `Active` | `reuse` by exact current owner | exact claim/plan/subject/owner/token, current row version, authority window valid | same row remains `Active`; no new token | fence conflict; zero write |
| `Active` | `renew` | exact claim/plan/subject/owner/token, current row version, `now >= last_heartbeat_at`, `now < lease_expires_at`, checked new deadline | same claim/owner/token, heartbeat and deadline advance | fence/state/time conflict; old row unchanged |
| `Active` | `release` | exact claim/plan/subject/owner/token, current row version, authority window valid | same row `Released`; transition time advances | fence/state conflict; no release |
| `Active` | `expire` | durable authority proves `now >= lease_expires_at`, current row version | same row `Expired`; transition time advances | no expiry; active row remains authoritative |
| `Released` | `acquire` same subject | terminal row remains historical; new refs and strictly larger same-subject token | new claim row `Active` | token allocation / unique-index failure; old row unchanged |
| `Expired` | `acquire` same subject | same as above; expiry was durably committed | new claim row `Active` | token allocation / unique-index failure; old row unchanged |
| `Released` / `Expired` | `renew`, `release`, `expire`, `reuse` | no legal transition | none | `ExecutionFenceConflict` or invalid transition; zero write |

`reuse` is a validation/read operation, not a second acquire and not a way to adopt another worker's active claim. If the original owner cannot prove the exact tuple, it must stop and wait for a formal `Released` / `Expired` row before fresh acquisition.

### 36.3 Lease timestamp rules

1. Acquire captures one authority timestamp and computes `lease_expires_at` from the immutable plan snapshot's `ClaimLeaseConfig`; it does not read a new current configuration.
2. Renew captures one later authority timestamp and computes a new deadline from that same frozen lease duration. It preserves claim ref, owner ref, subject and fencing token.
3. `heartbeat_interval` is a scheduling/health bound for the runner; failure to send one heartbeat does not itself mutate the row to `Expired`.
4. Expiry is a durable classification performed by claim authority. A worker may observe that its local lease seems old, but it cannot write `Expired`, take over, or classify item success from that observation.
5. Release is an explicit owner transition. If the lease has already expired in durable authority, release loses and the row remains or becomes `Expired`; it must not manufacture `Released` after authority loss.
6. Clock rollback, equal heartbeat time, timestamp overflow or an unrepresentable future deadline fails closed and never extends authority.

### 36.4 Fence and protected-write matrix

| writer action | claim proof required | other proof required | commit behavior |
|---|---|---|---|
| item state/outcome CAS | item claim exact tuple | item repository version; planned material and compatible state/outcome | commit only if both CAS and claim fence pass |
| outbox/local marker update | item claim exact tuple | outbox version, frozen payload/binding/token equality | stale or payload mismatch rolls back; no source rollback |
| projection replacement | item claim exact tuple | source read fence, target/member version and no-write/retention guards | any failed proof rolls back the item UoW |
| handoff/export local finalize | item claim exact tuple | immutable intent/token, local owner version, probe/result classification | known local failure may finalize-only; unknown stays indeterminate |
| execution report draft update | execution claim exact tuple | report row version, canonical item fold and plan digest | stale report writer gets fence conflict; no report rewrite |
| terminal report/result/reservation completion | execution claim exact tuple | all items terminal-compatible, lossless fold, stored-result relation | one final UoW; commit unknown requires probe, not blind retry |

Claim registration is a commit-time guard, not a preflight boolean. The UoW must retain the exact claim tuple and recheck it against the durable current row immediately before commit. Reloading a row after a stale check without a new registration does not restore authority.

## 37. Persistence, resume and recovery handoff

### 37.1 Logical claim store shape

The logical store is `observation_execution_claims`. Physical schema remains a Step 11 / adapter concern, but the following fields and indexes are mandatory for semantic compatibility:

| logical field / index | rule |
|---|---|
| `claim_ref` | primary identity; immutable for one row |
| `plan_ref` | immutable relation to committed immutable plan |
| `subject_kind` + subject payload | lossless tagged representation of `Execution` or `Item`; no nullable side-channel shape |
| `owner_ref` | immutable for one ownership epoch; exact CAS input |
| `fencing_token` | positive durable token; same-subject fresh acquire strictly increases |
| `state` | only `Active`, `Released`, `Expired`; explicit finite encoding |
| `acquired_at`, `last_heartbeat_at`, `lease_expires_at`, `last_state_transition_at` | canonical `ObservedAt` values; no database-default substitution |
| `repository_version` | claim-row optimistic CAS version, separate from fence |
| active execution unique index | at most one `Active` row per `execution_ref` |
| active item unique index | at most one `Active` row per global typed `work_key`, independent of execution |
| historical lookup | claim ref and plan/subject lookup remain available after release/expiry; history is not deleted to enable takeover |

The active item index must include the canonical work-key discriminator and payload, not a debug string or an unversioned hash. If a physical adapter uses a computed index, it must preserve collision detection and retain the typed canonical bytes needed to prove equality.

### 37.2 Repository semantic operations

The exact trait signatures remain Step 07 material, but each operation must provide these semantics:

| operation | atomic responsibility | zero-write / retry rule |
|---|---|---|
| `acquire_execution_claim(plan_ref, execution_ref, lease)` | validate committed plan and active execution uniqueness; allocate claim ref/owner/token; insert Active row | active conflict returns in-flight/fence classification; do not adopt current owner |
| `acquire_item_claim(plan_ref, execution_ref, work_key, lease)` | validate exact item and global active work-key uniqueness; allocate fresh row | terminal item is not claimed; global winner remains unchanged |
| `renew_claim(claim, expected_version, lease)` | exact tuple CAS; advance heartbeat/deadline without changing token | stale/expired/terminal owner gets fence conflict; no partial heartbeat |
| `release_claim(claim, expected_version)` | exact tuple CAS Active -> Released | release failure does not undo already committed item work |
| `expire_claim(claim_ref, expected_version, authority_now)` | authority-backed Active -> Expired; invalidate old owner/token | local worker cannot force expiry; no item classification is implied |
| `register_fence(claim, uow)` | attach exact authority tuple to short UoW commit validation | registration failure blocks commit; it is not a warning |
| `probe_claim(claim_ref)` | read current claim row/state/version for recovery | probe is read-only; ambiguous backend result remains indeterminate/manual |

No operation may silently upsert a claim, reset a token after deletion, convert an active conflict into a new row, or infer claim state from process liveness. `release_claim` may be best-effort after a successful protected commit; failure to release does not roll back that committed local mutation, but the active row must later be resolved by durable expiry or an explicit owner action.

### 37.3 Resume and failure classification

| situation | claim action | allowed next action | forbidden shortcut |
|---|---|---|---|
| process crash before item UoW commit | old claim may remain Active/uncertain | probe item/owner/report and claim; fresh claim only after durable Released/Expired; execute exact stored material if no committed outcome | assume lease expiry means rollback or rerun immediately |
| item UoW known abort | release or let authority expire; reload item | fresh claim and one compatible classification attempt | reuse old token |
| item UoW commit unknown | do not release/reacquire blindly | probe claim, item, report and result; manual if ambiguity remains | classify success/failure or allocate new token without probe |
| stale writer / wrong owner | no claim mutation | rollback, reload current claim/plan/item/report; wait or fresh acquire after terminal claim | retry same CAS with same token |
| lease heartbeat rejected | old authority lost or state changed | stop item; probe claim; resume only with fresh active claim | extend deadline locally |
| external call outcome unknown | claim remains only local authority | probe exact stable external token and local marker; classify per Step 12 | treat claim as external abort or send again |
| terminal item / terminal report | no new item claim | replay/read exact stored material; no external call | reopen item because a claim is available |

Claim expiry is a coordination fact only. It does not decide `ObservationJobPlanItemState`, `ObservationJobPlanItemOutcome`, `JobReportState`, `StoredObservationResult`, source truth or external delivery status. Those objects must be probed and classified by their own owners.

### 37.4 Boundary ownership and forbidden substitutions

| concern | owner | D-5 use | forbidden substitution |
|---|---|---|---|
| raw lease keys, profiles, defaults, source priority | `infra::config` / Step 14 / `04` | none; D-5 consumes typed snapshot value only | claim row storing raw configuration |
| typed lease value | `application::runtime::ClaimLeaseConfig` | deadline/renew input | claim redefining config type |
| claim lifecycle and authority | `application::jobs` | object/state/repository contract | report or worker entry state |
| item classification | `application::jobs` D-3 item owner | claim proof only | claim state as item outcome |
| row CAS version | application port carrier / infra store | commit guard companion | fencing token as row version |
| source freshness | projection/source owner | independent commit guard | claim as source read fence |
| external repeat safety | C batch stable token + probe capability | independent pre-call/finalize guard | claim as external exactly-once |
| actor authorization | operation context / policy flow | prerequisite outside claim | owner ref as actor identity |

## 38. D-5 planned validation cuts and stop gate

### 38.1 Object and transition validation cuts

| cut | required assertion | result status |
|---|---|---|
| subject shape | execution subject has no work key; item subject has exact plan membership and one work key; nullable side-channel shape is rejected | planned; not run |
| claim identity | every successful acquire mints a new claim ref; terminal claim ref never returns Active | planned; not run |
| owner epoch | renew preserves owner; release/expiry never reuses owner; fresh acquire changes owner | planned; not run |
| token monotonicity | same-subject reacquire is strictly greater; renew is equal; cross-subject numeric comparison has no meaning | planned; not run |
| lease arithmetic | heartbeat interval is less than lease duration; deadline overflow/regression/equal heartbeat fails closed | planned; not run |
| active uniqueness | one Active execution claim per execution; one Active item claim per global typed work key across executions | planned; not run |
| acquire conflict | active claim is never adopted by another owner; conflict leaves current row unchanged | planned; not run |
| durable expiry | only authority-backed deadline breach produces Expired; local clock cannot take over | planned; not run |
| release race | release loses after durable expiry or owner replacement; it cannot resurrect Released over Expired | planned; not run |
| renew race | stale owner/token/version cannot extend heartbeat or deadline | planned; not run |
| commit fence | wrong claim ref, plan, subject, owner, token, state, lease window or row version causes zero-write | planned; not run |
| proof separation | valid claim cannot bypass item CAS, source fence, retention/no-write guard or stable external token/probe | planned; not run |
| resume | crash/restart never relists, reads current config, regenerates plan or assumes rollback from expiry | planned; not run |
| unknown outcome | commit/external ambiguity probes exact local/external identity before new mutation; unresolved ambiguity is manual | planned; not run |
| fake parity | fake and durable adapters agree on unique indexes, token generation, expiry, CAS and stale-writer rejection | planned; not run |

No test run, implementation result, real run id, evidence alias, acceptance signature or commit is claimed by these cuts.

### 38.2 Affected-definition register

| affected location | D-5 handoff | required later action |
|---|---|---|
| Step 07 `IdGeneratorPort` | add claim-ref and owner-epoch minting capability, with exact error mapping owned by E/Step 07 | per-port contract review; no implementation assumption in D-5 |
| Step 07 `ObservationJobExecutionRepository` | consume tagged subject, lease snapshot, expected row version and exact claim tuple; expose acquire/renew/release/expire/probe semantics | trait signature closure after Step 06 repair |
| Step 11 claim logical store | persist all ten claim fields plus repository version and active execution/work-key unique indexes | schema/transaction audit; physical DDL remains downstream |
| Step 11 UoW commit validation | register claim identity + plan + subject + owner + token + active authority and row CAS | affected persistence repair; stale commit must be zero-write |
| Step 12 recovery matrix | map fence conflict, rejected heartbeat, expiry, commit unknown and external unknown without treating expiry as rollback | affected error/recovery review |
| Step 13 §18.3 | replace four-field claim use-site with D-5 exact shape and global item subject rule | affected concurrency/digest review |
| Step 14 `ClaimLeaseConfig` | keep typed lease/heartbeat derivation and snapshot freeze; no duplicate claim state | affected config/runtime review |
| Step 15 telemetry | later define redacted claim acquire/renew/release/expire/fence-conflict fields and low-cardinality labels | do not add telemetry schema in D-5 |

### 38.3 D-5 stop gate

| gate | status | evidence / remaining constraint |
|---|---|---|
| claim subject model | `pass_design_only` | §32.3 closes execution vs item subject, plan relation and global work-key uniqueness |
| claim support carriers | `pass_design_only` | §33 separately owns claim ref, owner epoch and subject; shared time/version/fence carriers are referenced without redefinition |
| claim state card | `pass_design_only` | §34 closes variants, terminality, allowed transitions and pure guards |
| claim object card | `pass_design_only` | §35 closes exact fields, factory/rehydrate, accessors, transitions and authority invariant |
| lease/fence matrix | `pass_design_only` | §36 closes acquire/reuse/renew/release/expire and protected-write proof composition |
| persistence/resume handoff | `pass_design_only` | §37 closes logical store, active indexes, recovery and no-rollback inference |
| exact Step 07 trait signature | `deferred` | downstream port owner remains frozen until Step 06 repair chain reaches Step 07 |
| exact ApplicationError owner | `deferred` | D-5 uses existing semantic classes; R06.6-E must close error layer |
| overall Step 06 quality blocker | `open` | `03-RPR-S06-GRANULARITY` still requires D-6, R06.7/R06.8 and affected audits |
| external upstream blocker | `none` | no `00/01/02` rollback required |
| current gate | `R06.6-D5_done_waiting_user` | stop here; do not enter D-6 without explicit user confirmation |

### 38.4 D-6 启动输入清单（historical gate; consumed by D-6）

用户确认后只进入 `R06.6-D6_cross_object_closure`，先读取：

- D-2~D-5 全部对象卡，尤其 subject/claim/fence、item CAS、plan snapshot 和 H12 reservation；
- H12 `GapScanAcceptedItemResult` canonical owner 与 D-3 typed outcome association；
- Step 07~14 中受 D-2~D-5 影响的 definition/use；
- Step 08/09 的 Job metadata、每个 Job input/flow 与 start/item/finalize 顺序；
- Step 11 claim/item/report/result UoW 与 exact commit validation；
- Step 12/13 recovery、digest、global uniqueness、unknown probe与resume rules；
- Step 14 typed snapshot/runtime assembly；Step 15/16 的 field/test handoff。

D-6 只做跨对象 zero-unowned-field、identity/fence/config/H12 compatibility、affected-use register、Step 07 handoff、backfill draft 与静态 closure；不得进入 R06.6-E/F、R06.7/R06.8、Step 07 正式推进、formal `03` 或任何 `04` 文件。当前不需要提交 commit。

## 39. R06.6-D6 输入复核、范围与写入门禁

### 39.1 当前批次状态

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前子批次 | `R06.6-D / D-6`：cross-object identity / fence / config / H12 closure |
| 本批输入 | D-2~D-5 对象卡、H12 accepted-result reservation、Step 07~14 frozen definition/use、Step 11 UoW、Step 12 recovery、Step 13 concurrency、Step 14 snapshot assembly |
| 本批写入 | 四张交叉矩阵、跨对象裁决、affected-definition register、Step 07 handoff、正式正文回填草稿、planned static validation |
| 本批不写 | 正式 `03-详细设计.md`、Step 07~14 正文、任何 `04` 文件、实现代码、测试结果、implementation ledger、boundary skeleton |
| 当前外部上游 blocker | `none`；未发现 `00/01/02` truth ownership 或依赖方向冲突 |
| 当前内部 blocker | `03-RPR-S06-GRANULARITY`、`R06.6-DISPOSITION-LAYER`、`R06.6-APP-ERROR-OWNER`、`R06.6-DIGEST-CANONICALIZER`、`R06-F-AFFECT-UOW-01` 仍开放或受控 |
| 当前写入纪律 | 只修改本 D 专项、Step 06 主控、03 flow 和项目执行台账；不修改冻结后置文档 |

### 39.2 D-6 的判定标准

D-6 不重新定义 D-2~D-5 已经闭口的对象。它只回答四个可审查问题：

1. 每一个 durable 字段、identity 和证明是否有唯一 owner，且没有由后置文档偷偷新增的第二来源；
2. 每一个受保护写入是否同时携带 claim authority、row CAS、source fence、retention/no-write 和 external token 所需的独立证明；
3. `GapScanAcceptedItemResult` 从计划 material、item outcome、same-UoW post-state 到 H12 record factory 是否逐字段无损；
4. Step 07~14 的现有 definition/use 是否已经消费 current object shape，或是否明确登记为后续 affected-definition。

“矩阵完成”只表示设计侧关系已经显式化。后置文件尚未回填时，不能把 affected-definition 当成实现已完成，也不能把 frozen 文档中的 `pass` 当成 current gate。

### 39.3 实际读取与观察到的历史 use-site

| 输入位置 | 当前可消费内容 | 观察到的未同步内容 | D-6 处理 |
|---|---|---|---|
| Step 07 `IdGeneratorPort`、`ObservationJobExecutionRepository` | ID、UoW、repository port 的组织方式，以及 plan/claim 的现有接缝 | 缺少 claim ref / owner ref mint；acquire 只接收 execution/work key；没有 plan、lease、expected row version、expire、probe 的完整语义；`save_plan` 仍接收裸 `fencing_token` | 不修改 Step 07；登记为 `A07-CLAIM-PORT-SURFACE` 与 `A07-PLAN-SAVE-AUTHORITY` |
| Step 08 §7.9 Operations Job | 九个 Job 的 public input/output、report surface、no-real-run 与 no-truth-write 边界 | `ReferenceSnapshotRef`、`PeripheralConsumerScopeRef` 等历史 work-key/use 仍出现；public `job_execution_ref` 与 local execution identity 的关系没有逐 Job 明确 | 保留 public DTO 作为 use-site；登记 `A08-JOB-IDENTITY-AND-WORK-KEY`，不把 claim/ref 加入 public surface |
| Step 09 §12 Operations Job flow | start/item/finalize 以及外部调用与短 UoW 的意图 | 共享模板不能证明九个 Job 各自先冻结 material、再 claim、再 item CAS、再 finalize；部分 flow 仍允许用 current lookup 解释 resume | 登记 `A09-PER-JOB-ORDER` 与 `A09-NO-RELIST-RESUME`，要求后续逐 Job 展开 |
| Step 11 §16.5-a、§12.6~§12.8 | plan/item/report 的 logical persistence、短 UoW、commit unknown 方向 | claim row 字段和 active unique index 未与 current exact tuple 完整对齐；report lookup 仍以历史 `JobRunRef` 语义出现；commit-time fence 与 item CAS 的联合验证没有逐写集闭口 | 登记 `A11-CLAIM-STORE-AND-FENCE`、`A11-REPORT-EXECUTION-RELATION` |
| Step 12 §11、§10.5 | fence conflict、commit unknown、external unknown、manual/probe 的分类框架 | expiry、heartbeat rejection、claim terminal 与 item/report state 的关系仍需明确；expiry 不能被解释为 rollback 或 external abort | 登记 `A12-CLAIM-RECOVERY-CLASSIFICATION` |
| Step 13 §18.1~§18.5 | immutable plan、global work key、fresh reentry、stable external token 与 probe | 旧 `ObservationJobExecutionRef(pub JobRunRef)`、旧 work-key payload、四字段 claim 和不完整 repository trait 仍在 frozen block | 登记 `A13-PLAN-CLAIM-USE`；current D-2~D-5 shape 优先 |
| Step 14 §9.5、§13~§14 | typed lease/retry/capability derivation、snapshot freeze、runtime binding | 同名 `JobConfigBinding` / `JobExecutionConfigSnapshot` 仍像独立 definition；需明确本文件 D-4 是唯一 durable owner | 登记 `A14-SNAPSHOT-DERIVATION-ONLY` |

上述历史 use-site 不构成外部上游 blocker，但在 affected-definition 完成前阻塞 Step 06 的 overall `pass` 与 Step 07 正式进入。

## 40. Cross-object Matrix A：identity、reference 与唯一 owner

### 40.1 Identity 分层矩阵

| identity / carrier | canonical owner | 创建或取得时点 | 允许进入 | 明确排除 |
|---|---|---|---|---|
| public Job invocation correlation | `core_contracts::metadata::JobRunId` / Step 08 public metadata | entry 接受 Job metadata 时 | public request/report correlation、plan 的只读 relation | local plan PK、idempotency scope、claim identity、真实 runtime run |
| application-local execution identity | `application::jobs::ObservationJobExecutionRef` | accepted start 在 reservation 成功后由本仓 ID generator mint | plan lineage、execution claim subject、report relation、resume lookup | public `JobRunId` alias、worker/process identity、真实 external run |
| plan identity | `application::jobs::ObservationJobExecutionPlanRef` | accepted start materialization | plan PK、rehydrate anchor、claim plan binding | execution ref、report ref、digest、claim ref |
| idempotency reservation identity | `application::idempotency` / A 批 | reserve UoW | duplicate/replay/conflict lookup、stored result relation | plan ref、execution ref、claim ref |
| item work identity | `application::jobs::ObservationJobWorkKey` | bounded start materialization | plan item identity、global active item uniqueness、item claim subject | string/hash/debug bytes、execution-local ordinal、claim token |
| claim ownership epoch | `application::jobs::ObservationExecutionClaimRef` + `ObservationClaimOwnerRef` | each successful fresh acquire | claim row、renew/release/probe、commit registration | actor ref、JobRunId、host/pod/thread、plan digest |
| fencing token | `application::jobs::ObservationFencingToken` | each successful fresh acquire; same subject strictly increases | exact current claim proof | row version、cursor、timestamp、external stable token |
| repository row version | application port carrier / durable adapter | `Versioned<T>` read from the same store | row CAS and claim-row CAS | fencing token、source version、cursor、attempt |
| configuration revision | `application::runtime::ConfigBindingRef` as typed value; snapshot durable owner remains `application::jobs` | validated start assembly | immutable `JobExecutionConfigSnapshot`, plan digest, historical binding resolution | raw key/path/env/secret/endpoint/current-config fallback |
| H12 accepted result identity | `domain::records::gap_scan` H12 owner | item operation produces accepted result | H12 record factory, item outcome association, same-UoW post-state | job/plan/claim/report lifecycle, source/business truth |
| report identity | `application::jobs::JobReportRef` / report owner | accepted start | report draft, terminal report, stored result relation | public JobRunId alias、claim identity、signoff/evidence alias |
| external runtime run identity | no current owner in this design phase | only real runtime can produce it | future real evidence, if actually observed | design-time generation、plan/claim/report fabrication |

### 40.2 Identity relation rules

1. `JobRunId` 可以出现在 plan 的 correlation field，但不能成为 `ObservationJobExecutionRef` 的 inner value，也不能通过 transparent wrapper 转换为 claim owner、claim ref 或 report PK。
2. `ObservationJobExecutionRef` 与 `ObservationJobExecutionPlanRef` 必须分别 mint；同一 execution 只能绑定一个 accepted immutable plan lineage，但二者不是同一类型、同一 bytes 或同一 lookup key。
3. `ObservationJobWorkKey` 的 canonical variant 和 payload 是 active item uniqueness 的唯一业务协调 identity。Item subject 的 `execution_ref` 只用于证明该 work key 属于该 plan，不进入跨 execution 的 unique key。
4. `ObservationRepositoryVersion` 只能包在 `Versioned<T>` 或等价 current-row carrier 中。它不属于 `ObservationExecutionClaim` 的 semantic fields，不能被写进 claim 的 `fencing_token`。
5. H12 `GapScanAcceptedItemResult` 只保留 target/result/typed metadata；Job execution、plan、item、claim、report 的 relation 由 application item/UoW 负责，不向 H12 record 添加 application identity字段。

### 40.3 Zero-unowned-field matrix

| current object | field group | source of truth | consumer | 不得由谁补造 |
|---|---|---|---|---|
| `ObservationJobExecutionPlan` | `plan_ref`, `execution_ref`, `idempotency_ref` | D-2 ID/ref factories + accepted reservation relation | plan repository、resume、claim plan validation | Step 08 DTO、Step 14 config loader、report service |
| `ObservationJobExecutionPlan` | `job_run_id`, `operation_name`, `request_digest` | accepted public metadata + typed Job context + canonical input | public correlation/report mapping、duplicate compatibility | worker identity、claim、current request reparse |
| `ObservationJobExecutionPlan` | `config_snapshot`, `plan_digest` | D-4 snapshot factory + controlled canonicalizer | start commit、resume、digest validation | current config、Step 14 duplicate object、adapter serialization |
| `ObservationJobExecutionPlan` | ordered `items` | bounded candidate materialization in start UoW | item claim/flow/finalize | relist、current source query、report summary |
| `ObservationJobPlanItem` | `plan_ref`, `work_key`, `planned_material`, `planned_input_digest`, source/observed version | D-2/D-3 item factory and exact source capture | item resume、H12 validation、source fence | repository version、worker memory、current row |
| `ObservationJobPlanItem` | `state`, `outcome` | D-3 classification owner under D-5 proof | report fold、H12 record handoff | claim state、report setter、JobRunId |
| `ObservationExecutionClaim` | all ten D-5 semantic fields | claim factory + durable claim authority | acquire/renew/release/expire/probe/commit registration | local clock, process liveness, Step 14 raw config |
| `ObservationExecutionClaim` | current row version | outer `Versioned<ObservationExecutionClaim>` | claim-row CAS | claim field, fence token, cursor |
| `JobExecutionConfigSnapshot` | config ref, operation, canonical typed bindings | D-4 object card; typed values from `application::runtime` | plan digest and resume | Step 14 duplicate definition, raw config, endpoint/secret |
| H12 accepted result | target ref, target snapshot, discovered refs, typed outcome, completed time | H12 result producer + D-3 typed association | H12 factory and record persistence | item claim, current gap state, report fold |
| report | execution/plan relation, current item fold, report state | report owner + finalize UoW | public Job response, stored result | public outcome enum, claim state, JobRunId alias |

“Zero-unowned”要求的是每个字段只有一个 current source，不要求每个字段都由同一个模块物理存储。跨模块复制只能是有明确 relation 的 immutable snapshot 或 exact association，不能形成第二个可变 truth。

## 41. Cross-object Matrix B：claim、fence、row version 与 source proof

### 41.1 受保护写入证明矩阵

| 写入场景 | claim proof | row / state proof | source / policy proof | external proof | 失败时的结果 |
|---|---|---|---|---|---|
| start 保存 immutable plan | 尚无 execution claim；不能使用裸 fence | reservation acquire、plan create-if-absent、idempotency relation | candidate completeness、config binding totality、bounded material | 若 plan item 带外部 effect，只保存 stable binding identity 与 digest-covered planned material；不保存 token/intent/phase link，不发 call | 回滚 start；不得用未来 claim 补救 |
| execution-level report draft | exact execution claim tuple：claim ref/plan/subject/owner/fence/Active/lease/current claim row version | report `Versioned<T>` expected version、plan digest、item fold | report state transition合法 | stored result relation只在 finalize时检查 | stale/fence conflict zero-write |
| item state/outcome CAS | exact item claim tuple，不能只传 token | item row expected `ObservationRepositoryVersion` + state/outcome compatibility | planned material、source observed version、retention/visibility/no-write guard | stable token/probe if flow has external phase | rollback item UoW；stale writer不得写 failure classification |
| projection/read-model replacement | exact item claim tuple | target/view/dependency expected versions | source read fence、dual cursor、target binding、retention/no-write | none unless external phase | rollback；不能标 Fresh |
| outbox/local marker update | exact item claim tuple | outbox expected version、immutable payload/binding/token equality | local no-write/retention guard | stable publication token and probe | marker unchanged；不得重建 payload |
| handoff/export local finalize | exact item claim tuple | local preparation/delivery/report row versions | readiness、visibility、retention、same preparation relation | exact external receipt/token probe | finalize-only or manual；不得 blind repeat external call |
| terminal report/result/reservation completion | exact execution claim tuple | report row version、all item terminal compatibility、result/idempotency relation | lossless canonical fold、plan digest | all external phases classified/probed | known failure rollback finalize；unknown先 probe |

### 41.2 Exact authority tuple

对于任何受保护的 local mutable write，UoW 必须保存并在 commit boundary 重新注册下列完整 tuple：

```text
(claim_ref,
 plan_ref,
 subject,
 owner_ref,
 fencing_token,
 state = Active,
 authority_now < lease_expires_at,
 current_claim_row_version)
```

以下任意单项都不能替代完整 tuple：

- `fencing_token` 不能替代 claim identity、owner、lease window 或 row CAS；
- `ObservationRepositoryVersion` 不能替代 claim authority 或 source read fence；
- local clock、heartbeat miss、process liveness 不能把 claim 变为 `Expired` 或授权 takeover；
- item claim 不能证明 source snapshot fresh、external call exactly-once、report terminal 或 H12 cursor committed；
- stable external token 不能证明本地 claim、plan completeness 或 source version。

### 41.3 Start / item / finalize cross-object order

| phase | mandatory order | prohibited shortcut |
|---|---|---|
| start | validate public input/context -> reserve idempotency -> materialize bounded candidates -> derive typed snapshot -> create immutable plan/items + Draft report -> commit -> only then acquire claims | list before reservation、partial plan、claim before plan commit、current config fallback |
| item | load stored plan/item material -> acquire or validate fresh item claim -> perform local/external phase outside UoW where required -> begin short UoW -> reload mutable rows -> register exact fence -> recheck source/policy guards -> classify item -> commit | relist、用旧 token重试、长事务包住 external call、先写 report 再写 item |
| failure accounting | rollback failed item UoW -> separate short accounting UoW -> register current claim -> append exact failed/gap classification | 把未知 commit 直接标 retryable、在 stale claim 下补写失败 |
| finalize | acquire execution claim -> load plan/report/result relation -> register fence -> verify every item terminal and lossless fold -> save report/result/reservation in one final UoW -> commit | 从 report 反推缺失 item、重做已提交 item、把 duplicate 改写为 report state |
| resume | load immutable plan/snapshot/material -> probe claim/item/report/result as needed -> fresh acquire only after durable terminal claim state -> execute exact stored material | relist、热读 current config、从 expiry 推断 rollback、重建 digest |

### 41.4 D-6 对 Step 07 的最小语义 handoff

Step 07 的 exact Rust trait 仍由 Step 07 承担，但 D-6 固定以下不可删减的输入/输出语义：

```rust
// Shape is semantic handoff, not the final Step 07 trait declaration.
acquire_claim(plan_ref, subject, frozen_lease, authority_now)
renew_claim(claim_ref, owner_ref, fencing_token, expected_claim_version,
           frozen_lease, authority_now)
release_claim(claim_ref, owner_ref, fencing_token, expected_claim_version,
             authority_now)
expire_claim(claim_ref, expected_claim_version, authority_now_from_authority)
probe_claim(claim_ref)
register_fence(exact_claim_tuple, short_uow)
```

每个 operation 必须能表达：

1. tagged `Execution` / `Item` subject；
2. committed `plan_ref` relation；
3. frozen `ClaimLeaseConfig`，而不是 raw key/default；
4. current claim row version 与 durable authority time；
5. fresh claim ref、owner ref、strictly newer same-subject fence；
6. `Active` / `Released` / `Expired` 的失败闭口与 probe；
7. commit-time exact tuple registration，而不是 preflight boolean。

这组语义不授权 Step 07 直接在本批落代码，也不授权 Step 07 自行决定 `ApplicationError` 的最终 owner；后者留给 R06.6-E。

## 42. Cross-object Matrix C：H12、item、plan、report 与 same-UoW

### 42.1 H12 carrier 全链路

| 阶段 | 唯一输入 | 必须保留 | 允许发生的转换 | 禁止行为 |
|---|---|---|---|---|
| start materialization | `GapSource` planned material | stable source id、完整 `GapScanTargetSnapshot`、dual cursor/version、policy basis、target relation | 构造 `ObservationJobPlanItemPlannedMaterial::GapSource` | 从 current gap list 重建 target snapshot；把 claim 当 authorization snapshot |
| item execution | exact planned GapSource material + current policy/source reads | original target snapshot and work boundary | 产生 typed `GapScanAcceptedItemResult` | 从 current config/source membership 替换计划输入 |
| item classification | accepted result + D-3 item state/outcome | target ref、seven snapshot semantics、discovered set、typed outcome/reason、completed_at | `GapScanAccepted(result)` association；state mapping按D-3矩阵 | 把 `MaintenanceFailureReason` 转为 generic `JobFailureReason`；丢空集合语义 |
| same-UoW H12 factory | exact accepted result + `GapScanPostState` + typed metadata | committed observation/reference cursor、post-state refs、metadata relation | 逐字段 exact copy into H12 record | 读取另一个 transaction 的 current row；用 item fence代替 committed cursor |
| record persistence | H12 record + committed cursor | append-only record identity、exact result、post-state relation | record owner的 append/factory | H12 record拥有 plan/claim/report lifecycle；record反写 source/business truth |
| report fold | item current classification | item-level affected/failed/gap/progress refs与 reason | lossless canonical fold到 report surface | report 反向制造 H12 result、从 gap state猜成功 |

### 42.2 H12 逐字段闭环

| H12 字段 | 来源 | item/planned relation | record/finalize 校验 |
|---|---|---|---|
| `target_ref` | H12 gap-scan owner / accepted result producer | 必须等于 `GapSource.scan_target_snapshot.target_ref` | top-level 与 nested snapshot exact equality |
| `target_snapshot` | immutable GapSource material carried into execution result | seven semantics完整复制：scopes、namespaces、authorization、observation cursor、reference cursor、policy basis及target ref | arity、namespace、cursor kind、policy basis不匹配 -> consistency failure |
| `discovered_gap_refs` | current scan result producer | 不属于 planned input；空集合是有效已完成结果 | canonical sorted/unique；不得从 current gap state补造 |
| `outcome` | gap-scan result classifier | `Completed`/`Failed(reason)`/`Blocked(reason)` 原变体保留 | reason type与item state total matrix一致；不得泛化 |
| `completed_at` | trusted `ObservedAt` at result completion | 不由 repository version、cursor、worker timestamp替代 | 一个 exact value；same-UoW factory不得重取另一个时间 |

### 42.3 H12 与 claim/fence 的边界

H12 记录可以由持有 item claim 的 application flow 写入，但它的 authority 证明分为两层：

- item claim/fence 只证明该 flow 有权提交 observation-side item、H12 record 和 local report/accounting mutation；
- H12 `GapScanTargetSnapshot` 中的 authorization mode、policy basis 与 committed cursor 仍来自 H12/maintenance/source owners，不能由 claim、owner ref 或 fence token 推导。

因此 `GapScanAcceptedItemResult` 不携带 claim ref、owner ref、fencing token、plan ref、execution ref 或 report ref。需要审计 claim 的位置是 application audit/telemetry handoff，不能污染 H12 domain record schema。

### 42.4 Current H12 status

`R06.6-D-H12-COMPAT` 在 D-6 关闭为 `resolved_in_D6_design_only_with_affected_use_register`：D-3 的字段语义没有被改变，D-6 已闭合其从 GapSource planned material 到 item/report/UoW/H12 factory 的跨对象关系。该关闭不表示 H12 record factory、Step 09 flow 或 Step 11 persistence 已被回填；这些位置仍是 affected-definition。

## 43. Cross-object Matrix D：config snapshot、resume 与 external binding

### 43.1 Config field-source matrix

| config material | definition owner | accepted start source | resume source | forbidden source |
|---|---|---|---|---|
| `ConfigBindingRef` | `application::runtime` typed value | validated runtime slice | persisted snapshot | raw config key、path、env name、current default |
| `CandidateLimit` / `MaxParallelism` | `application::runtime` | request bound + validated runtime bound + hard cap | persisted snapshot | current config reload、worker local limit |
| `ClaimLeaseConfig` | `application::runtime` | validated runtime value captured into snapshot | persisted snapshot | local clock、Step 14 raw profile |
| retry policies | `application::runtime` | operation-specific validated binding | persisted snapshot | current retry policy、attempt counter |
| external effect binding/capability/timeout | `application::runtime` safe metadata assembled from infra catalog | exact typed subject lookup during start | persisted snapshot and stable intent/token relation | current route、endpoint、credential、provider response |
| raw source/locator/secret | `infra::config` / Step 14 | never enters plan | never reloaded by job | application/domain/report/log/metric/trace/evidence |
| invocation `job_timeout` | entry wrapper | per invocation only | not persisted as execution semantics | plan digest、claim lease、item outcome |

### 43.2 Resume proof matrix

| resume situation | required reads | allowed action | prohibited interpretation |
|---|---|---|---|
| process loss before item commit | plan, item, report, claim, result/reservation as applicable | probe; fresh claim only after durable Released/Expired; execute exact material if no committed outcome | claim expiry means rollback |
| heartbeat rejected | current claim row/version and item/report | stop old owner; probe and wait/fresh acquire | extend locally or reuse token |
| item commit unknown | claim, item, report, stored result/reservation, external token if any | probe all relevant identities; manual if ambiguous | classify success/failure or rerun blindly |
| config revision rotated | persisted snapshot and historical binding availability | continue with original snapshot if resolvable; otherwise consistency/manual | substitute current config |
| terminal item/report replay | stored plan/report/result | read/replay exact surface; no claim or external call | reopen terminal item because a claim is available |
| active claim conflict | current durable claim | return in-flight/fence classification; do not adopt | copy owner or create second active row |

### 43.3 Config owner correction for Step 14

Step 14 may define raw-to-validated derivation, catalog assembly, startup validation, adapter capability and historical binding resolution. It may not redeclare the durable `JobConfigBinding` or `JobExecutionConfigSnapshot` object cards. Any Step 14 tables or code blocks that look like a second definition must be treated as derivation/use-site and marked with the D-4 owner relation:

```text
infra raw source -> Step 14 validated runtime slice
                 -> application::jobs JobConfigBinding
                 -> application::jobs JobExecutionConfigSnapshot
                 -> immutable ObservationJobExecutionPlan
                 -> resume / claim / item flow
```

The arrow is one-way for configuration material. A plan or claim cannot write back to the current configuration, and a current configuration reload cannot rewrite a committed plan.

## 44. Affected-definition register

The following register is the current D-6 handoff. “Affected” means the later document must replace or explicitly annotate the old use-site; it does not mean D-6 has edited that file.

| ID | affected file / section | observed drift | required correction | owner / timing |
|---|---|---|---|---|
| `A07-CLAIM-ID-MINT` | Step 07 §7.3 `IdGeneratorPort` | no claim-ref or owner-epoch generator | add typed mint capability for `ObservationExecutionClaimRef` and `ObservationClaimOwnerRef`; fresh acquire must use both | Step 07 after R06.8; exact error mapping in R06.6-E |
| `A07-PLAN-SAVE-AUTHORITY` | Step 07 §9.2 / Job repository `save_plan` | plan save accepts naked `fencing_token`, although start commit precedes any claim | remove naked token as start authority; start uses reservation/UoW/plan relation; post-start mutable writes use registered exact execution/item claim | Step 07 + Step 11 affected review |
| `A07-CLAIM-PORT-SURFACE` | Step 07 Job repository trait | acquire takes only execution/work key; no plan/subject/lease/version/expire/probe contract | consume tagged subject, committed plan ref, frozen lease, authority time, expected row version, fresh identity and exact tuple; expose renew/release/expire/probe semantics | Step 07 affected definition |
| `A07-REPORT-RELATION` | Step 07 `ObservationJobReportRepository` | report lookup is not explicitly bound to local execution and plan | report read/save must carry or validate `execution_ref` + `plan_ref` + plan digest; public JobRunId remains correlation only | Step 07/11 |
| `A08-JOB-IDENTITY-AND-WORK-KEY` | Step 08 §7.9 Job DTO and field mapping | historical `JobRunRef`/`ReferenceSnapshotRef`/`PeripheralConsumerScopeRef` use remains | retain public JobRunId correlation; use current `ReferenceSnapshotStateRef` and `consumer_id + projection_scope` semantics; never expose claim owner/fence as public identity | Step 08 per-protocol repair |
| `A08-REPORT-SURFACE` | Step 08 Job output/report surface | public outcome and durable report are described together in places | keep `ObservationJobOutcome`, `JobReportState`, stored result and `EntryDisposition` as separate layers; duplicate replay reads old report | Step 08 + R06.6-E |
| `A09-PER-JOB-ORDER` | Step 09 §12 Job flows | shared template does not prove nine independent start/item/finalize contracts | add per Job candidate material, work-key variant, claim subject, external cut, item UoW, failure accounting UoW and finalize fold | Step 09 after Step 07 |
| `A09-NO-RELIST-RESUME` | Step 09 shared Job flow and branch notes | current lookup/relist can be inferred during resume | resume must load immutable plan/snapshot/item material; no relist/current config/current route | Step 09 |
| `A11-CLAIM-STORE-AND-FENCE` | Step 11 §16.5-a / claim schema | active indexes and claim fields are not fully aligned with D-5 | persist claim ref, plan ref, tagged subject, owner ref, fence, state, four timestamps and separate row version; active execution uniqueness and global typed work-key uniqueness | Step 11 |
| `A11-START-AND-COMMIT-UOW` | Step 11 §12.6~§12.8 | commit-time fence is described broadly but not per write set | register exact tuple immediately before commit; combine claim validation with item/report/outbox/projection CAS and source/no-write guards; stale authority is zero-write | Step 11 |
| `A11-REPORT-EXECUTION-RELATION` | Step 11 `find_report_by_job` and report schema | historical `JobRunRef` can become local report identity | use local execution/plan relation; public JobRunId is a non-unique correlation field; terminal report/result/reservation finalize together | Step 11 |
| `A12-CLAIM-RECOVERY-CLASSIFICATION` | Step 12 §11 / §10.5 | expiry, rejected heartbeat and terminal claim are not fully separated from item/report outcome | classify expiry as coordination-only; rejected heartbeat/fence conflict stops old writer; commit/external unknown requires probe; no expiry=>rollback inference | Step 12 |
| `A12-ERROR-OWNER` | Step 12 §8.6 and Step 07 shared `ApplicationError` | application error owner remains cross-defined | R06.6-E assigns one application owner and maps claim/fence/config/H12 consistency classes without changing D-5 semantics | R06.6-E |
| `A13-PLAN-CLAIM-USE` | Step 13 §18.1~§18.3 | old `ObservationJobExecutionRef(pub JobRunRef)`, old work-key variants and four-field claim | replace use-site with D-2~D-5 current carriers; digest excludes claim/fence; item active uniqueness is global typed work key | Step 13 affected review |
| `A13-FRESH-REENTRY` | Step 13 §18.4~§18.5 | reentry text can be read as same-token retry or relist | fresh claim ref/owner/fence only after durable terminal prior claim; exact stored material; probe unknown outcomes | Step 13 |
| `A14-SNAPSHOT-DERIVATION-ONLY` | Step 14 §9.5 / §19.1 | same-named snapshot/binding block appears as a second definition | mark D-4 `application::jobs` object as sole durable owner; Step 14 only derives, validates and assembles typed values/catalog | Step 14 affected review |
| `A14-LEASE-SEMANTICS` | Step 14 ClaimLease tables | config value and claim lifecycle can be conflated | `ClaimLeaseConfig` supplies immutable parameters; durable claim authority alone decides expiry; config cannot mutate claim state | Step 14 |
| `A10-STATE-OWNER` | Step 10 claim/item/report references | state matrix may imply claim state drives item/report state | keep claim state separate from item/report/H12/business state; affected review only | Step 10 after Step 06 |
| `A15-CLAIM-TELEMETRY` | Step 15 handoff | claim fields may be logged as high-cardinality/raw identity | later define redacted, low-cardinality acquire/renew/release/expire/fence-conflict fields; no new schema in D-6 | Step 15 |
| `A16-CLAIM-AND-H12-CUTS` | Step 16 test cuts | existing tests do not necessarily combine all proofs or exact H12 copy | add matrix-driven tests for global uniqueness, exact tuple zero-write, resume no-relist, snapshot immutability and H12 same-UoW field equality | Step 16 |

### 44.1 Affected register closure rules

1. An affected file cannot be marked `pass` merely because its old text mentions “fencing”, “immutable plan” or “same UoW”; the exact current carrier and proof tuple must be named.
2. A later document may add an adapter-specific representation only if it is lossless for the tagged subject, typed work key, claim identity, row version and H12 fields. Hash-only, nullable side-channel and debug-string representations fail this rule.
3. If a later document needs a new field not present in D-2~D-5, it must add a new blocker or reopen the owning Step 06 object card. It may not silently add the field to Step 07/08/09/11/13/14.
4. Affected-definition completion must update this register and the project ledger; until then, the later file remains frozen repair input.

## 45. Step 07 handoff and formal `03` backfill draft

### 45.1 Step 07 entry checklist

Step 07 can be opened only after the user confirms the D-6 stop gate and the current Step 06 repair policy permits it. Its first read/write batch must, in order, consume:

| order | required action | acceptance condition |
|---:|---|---|
| 1 | import the D-2~D-5 current types without redeclaring them | no duplicate ref, work-key, snapshot, claim, state or config definition |
| 2 | rewrite `IdGeneratorPort` affected surface | plan/execution/claim/owner refs have typed mint methods; no path/hash/time-derived IDs |
| 3 | rewrite Job repository semantic surface | tagged subject, plan relation, lease, expected row version, authority time and probe are expressible |
| 4 | separate start plan save from post-start fenced mutation | no naked fence token authorizes plan creation; start UoW is reservation/plan atomic |
| 5 | add exact report relation | report has local execution/plan relation and lossless item fold input |
| 6 | bind UoW fence registration | commit validates exact tuple plus each owned row/version/source guard |
| 7 | add fake/durable semantic parity notes | both adapters reject stale owner, global duplicate work key and local-clock expiry takeover |
| 8 | record unresolved error ownership | Step 07 does not invent final `ApplicationError` hierarchy before R06.6-E |

### 45.2 Formal `03` §5/§6 backfill draft

正式正文仍冻结。Step 19 未来装配时，§5/§6 中与 Job coordination 相关的最小 current text 应保持以下关系：

```md
### application::jobs / Operations Job coordination

`ObservationJobExecutionPlan` 持有一次 accepted Job 的 immutable bounded work-set、planned material、typed execution config snapshot 和 plan digest；`ObservationJobPlanItem` 只允许在 current claim/fence、repository row CAS、source/policy guard 均有效时改变 state/outcome。`ObservationExecutionClaim` 只提供 observation-side local writer authority，不拥有 source truth、business truth、H12 lifecycle、external exactly-once 或 report verdict。

Job start 先 reserve idempotency，再冻结 candidate/material/config snapshot，提交 plan 和 Draft report；提交成功后才 acquire execution/item claim。Resume 只加载原 plan/material/snapshot，不 relist、不热读 current config、不从 claim expiry 推导 rollback 或 external 未发生。每个 item、report、marker 和 terminal result 的 short UoW 在 commit 前注册 exact claim tuple，并与各自 row CAS、source read fence、retention/no-write guard 和 stable external token/probe 独立组合。

`GapScanAcceptedItemResult` 仍由 H12 owner 定义；Job 只传递 D-3 accepted result、完整 target snapshot 和 same-UoW post-state，不向 H12 注入 plan/claim/report identity。Report 由 item current classifications 做 lossless fold，public Job outcome、durable report state、stored result 和 EntryDisposition 不互相替代。
```

该草稿不是正式正文写入，也不关闭 `R06.6-DISPOSITION-LAYER`、`R06.6-APP-ERROR-OWNER` 或 `R06.6-DIGEST-CANONICALIZER`。

## 46. Planned static validation and evidence discipline

### 46.1 D-6 static cuts

| 检查 | 目标 | 当前状态 |
|---|---|---|
| scope guard | 本轮只修改 D 专项、Step 06 主控、03 flow、项目台账 | planned；待写入后执行 |
| formal freeze | `projects/L4-observability/03-详细设计.md` 内容不变 | planned；待写入后执行 |
| downstream freeze | Step 07~14 与任何 `04` 文件不被本批改写 | planned；待写入后执行 |
| heading/fence | D-6 新增 Markdown heading 层级和 fenced code 数量闭合 | planned；待写入后执行 |
| owner scan | D-6 新增矩阵中每个 field group 有 canonical owner，未出现 `TBD` / 无 owner 的实现字段 | planned；待写入后执行 |
| stale-use scan | 旧 `JobRunRef`、旧 work-key variant、四字段 claim 的剩余位置均已登记为 affected-use，而不是误标 current | planned；待写入后执行 |
| truthfulness scan | 不出现实现 commit、真实 run id、evidence alias、验收签署或已运行测试的虚假断言 | planned；待写入后执行 |
| diff hygiene | `git diff --check` 无尾随空白；不触碰用户/其他项目改动 | planned；待写入后执行 |

### 46.2 What D-6 does not claim

- 没有运行实现测试；表内验证均为 `planned / not run`，不生成测试结果或 evidence alias；
- 没有验证真实 durable adapter、数据库唯一索引、clock authority 或 external probe；这些属于后续实现/测试边界；
- 没有创建 implementation ledger 或 planned boundary skeleton；按照项目规则，它们必须等正式 `07-实施计划.md` 完成时统一创建；
- 没有提交 git commit，也不要求用户当前提交。

## 47. D-6 stop gate

### 47.1 Gate result

| gate | status | basis |
|---|---|---|
| identity separation | `pass_design_only` | public JobRunId、local execution、plan、claim、work key、report、external run 已分层；无 alias/wrapper conversion |
| zero-unowned-field matrix | `pass_design_only` | §40.3 为 plan/item/claim/config/H12/report 指定唯一 source and consumer |
| claim/fence proof composition | `pass_design_only` | §41 固定 exact tuple，并与 row CAS、source fence、no-write、external token 独立组合 |
| start/item/finalize ordering | `pass_design_only` | §41.3 固定 reserve-before-list、commit-before-claim、short UoW、no-relist resume |
| H12 cross-object compatibility | `resolved_in_D6_design_only_with_affected_use_register` | §42 逐字段闭合 planned material -> accepted result -> same-UoW post-state -> record/report fold |
| config snapshot / resume boundary | `pass_design_only` | §43 固定 D-4 owner、historical snapshot source 和 no-current-config substitution |
| Step 07 handoff | `pass_design_only` | §45 给出八项不可删减语义和顺序；exact trait 仍留 Step 07 |
| affected-definition register | `pass_design_only` | §44 登记 Step 07/08/09/10/11/12/13/14/15/16 的具体 drift and required correction |
| formal `03` backfill | `draft_only` | §45.2 仅为 Step 19 来源草稿，正式正文仍冻结 |
| implementation readiness | `not_ready` | affected downstream definitions、R06.6-E/F、R06.7/R06.8 尚未完成；无代码/测试/evidence |
| external upstream blocker | `none` | 当前未发现 `00/01/02` 需要回滚或补充的 blocker |
| overall Step 06 quality blocker | `open` | `03-RPR-S06-GRANULARITY` 还需 R06.6-E/F、R06.7、R06.8 及后置 affected review |

### 47.2 Current pointer after D-6 write

`R06.6-D6` 的设计侧工作在本专项完成后标记为 `R06.6-D6_done_waiting_user`。下一允许动作只有：用户明确确认后，重新读取 R06.6-E 的 SOP/规范和本 D-6 current handoff，再进入 application error/disposition layer。不得自动进入 R06.6-E/F、R06.7/R06.8、Step 07~19、formal `03` 或任何 `04` 文件。

当前不需要提交 commit。

## 48. S07-D cross-crate persistence visibility addendum

> Current affected correction: this section was discovered while writing Step 07 S07-D and supersedes only the Rust visibility and report-claim statements listed below. It does not reopen D-2~D-6 field, lifecycle, digest, claim-authority or no-relist decisions.

### 48.1 Why an affected correction is required

The target is a multi-crate workspace: `observability-application` owns the objects and public port traits, while `observability-infra` implements those traits and durable codecs. Several D cards correctly kept fields private but also marked rehydrate functions, persistence selectors, the claim subject and planned material as `pub(crate)`. The separate infra crate could therefore name a public repository trait but could not decode or encode its parameter/result objects.

That is an implementation blocker. It is not a reason to move these objects to `contracts`, duplicate their schemas in infra, use unchecked serde field access, or collapse the workspace into one crate. The correction follows one rule:

```text
Rust visibility for a durable application carrier may cross the application/infra crate boundary;
construction remains validated, fields remain non-public wherever Rust permits, and no visibility
change grants entry callers claim authority, mutation authority, protocol exposure or business truth.
```

### 48.2 Exact Job carrier visibility correction

| owner / member | current S07-D visibility | permitted caller | still forbidden |
|---|---|---|---|
| `ObservationJobExecutionRef` / `ObservationJobExecutionPlanRef` rehydrate and opaque selectors | `pub` | infra codec, repository adapter, application | cross-wrapper conversion, public Job identity alias |
| `ObservationFencingToken::try_rehydrate/get/canonical_bytes` | `pub` | claim adapter and fake | treating the number as authority without the complete claim row |
| `ObservationJobWorkKey` rehydrate, discriminator, canonical bytes and comparison | `pub` | plan/claim repository and application | Debug/string/hash key, current-material lookup |
| `ObservationJobPlanItemState` finite decode and read predicates | `pub` | plan/item codec and application | transition without item CAS and claim guard |
| `ObservationJobPlanItemOutcome` validated rehydrate and read-only association/ref/digest selectors | `pub` | item/report codec and application fold | public struct literal, generic failure slot, outcome inference |
| `ObservationJobPlanItemPlannedMaterial` | `pub` application carrier with exact nine tagged variants | plan/item codec and application | protocol export, nullable union, raw locator/body, material replacement |
| `ObservationJobPlanItem::try_rehydrate` and immutable/read-only selectors | `pub` | plan/item codec and application | exposing a mutable field, classifying without the owning application method |
| `JobExecutionConfigSnapshot::try_rehydrate` and canonical binding iteration | `pub` | plan codec and application | current-config fallback, raw config/secret access |
| `ObservationJobExecutionPlan::try_rehydrate` and identity/material selectors | `pub` | plan codec and application | appending/removing/reordering items, rebuilding from current candidates |

`ObservationJobPlanItemPlannedMaterial` is public only as an application-crate persistence carrier. Its nested types retain their existing owners and validation. This is not a new object owner, public DTO, serde contract or permission for infra to synthesize planned material. Infra must call the validated variant rehydrate path, and application still validates key/material/digest compatibility.

### 48.3 Claim subject and claim-row correction

The canonical in-memory `ObservationExecutionClaimSubject` remains non-protocol and application-owned. S07-D avoids requiring external callers to construct the enum by splitting repository acquire/lookup operations into execution and item methods. For durable decoding, `ObservationExecutionClaim` provides two public validated rehydrate factories instead of exposing an unchecked subject field:

```rust
impl ObservationExecutionClaim {
    /// Rehydrate an execution-level claim row for persistence adapters.
    pub fn try_rehydrate_execution(
        claim_ref: ObservationExecutionClaimRef,
        plan_ref: ObservationJobExecutionPlanRef,
        execution_ref: ObservationJobExecutionRef,
        owner_ref: ObservationClaimOwnerRef,
        fencing_token: ObservationFencingToken,
        state: ObservationExecutionClaimState,
        acquired_at: ObservedAt,
        last_heartbeat_at: ObservedAt,
        lease_expires_at: ObservedAt,
        last_state_transition_at: ObservedAt,
    ) -> Result<Self, ApplicationError>;

    /// Rehydrate an item-level claim row with the globally competing work key.
    pub fn try_rehydrate_item(
        claim_ref: ObservationExecutionClaimRef,
        plan_ref: ObservationJobExecutionPlanRef,
        execution_ref: ObservationJobExecutionRef,
        work_key: ObservationJobWorkKey,
        owner_ref: ObservationClaimOwnerRef,
        fencing_token: ObservationFencingToken,
        state: ObservationExecutionClaimState,
        acquired_at: ObservedAt,
        last_heartbeat_at: ObservedAt,
        lease_expires_at: ObservedAt,
        last_state_transition_at: ObservedAt,
    ) -> Result<Self, ApplicationError>;

    /// Return the execution lineage carried by either exact subject variant.
    pub fn execution_ref(&self) -> &ObservationJobExecutionRef;

    /// Return the global work key only for an item claim.
    pub fn work_key(&self) -> Option<&ObservationJobWorkKey>;

    /// Return the opaque owner epoch without granting commit authority.
    pub fn owner_ref(&self) -> &ObservationClaimOwnerRef;
}
```

The earlier generic `pub(crate) fn try_rehydrate(... subject: ObservationExecutionClaimSubject ...)` remains an application-internal helper only; it is not the infra integration surface. The earlier public `subject()` wording is corrected to `pub(crate) fn subject(...)`: returning a crate-private enum from a public method is not a valid cross-crate contract. `claim_ref`、`plan_ref`、`execution_ref`、`work_key`、`owner_ref`、fence、state and four timestamp selectors are public read-only methods because the infra codec and commit guard must encode and compare them. `ObservationExecutionClaimRef` and `ObservationClaimOwnerRef` rehydrate/opaque-ref selectors are likewise public; neither ref alone grants authority.

Fresh acquire construction remains repository-controlled. The public port accepts application-generated claim/owner refs, but the adapter atomically allocates the strictly newer same-subject fencing token, validates active uniqueness and creates the row through the same object invariant. A caller cannot obtain write authority by invoking a rehydrate factory: every protected commit still requires the row to be current, `Active`, unexpired under durable authority, version-equal and registered in the same UoW.

### 48.4 Report-proof authority correction consumed by S07-D

D-6 §41.1 used the phrase “execution-level report draft” too broadly. The later F2 owner and the report fold owner require an item classification and its Draft report fold to commit atomically under the same item claim. Current authority is therefore:

| report mutation | exact claim subject | UoW relation |
|---|---|---|
| create initial Draft with complete Planned fold | none; accepted start reservation/plan relation | same start UoW as immutable plan |
| replace one fold entry and matching scope rows after item CAS | exact item claim for that work key | same item UoW; one registered guard; item stage precedes report stage |
| record a report-level failure while an item owner still owns the affected item | same exact item claim | separate accounting UoW only after known rollback; never under stale authority |
| seal terminal report and finalize stored result/reservation | exact execution claim | same final UoW as terminal report/result/idempotency completion |

This correction does not allow an item claim to seal a terminal report or an execution claim to rewrite an item fold without the item CAS proof. `ObservationReportClaimProof` must preserve whichever exact claim subject protects the specific mutation. It is not fixed permanently to `Execution(execution_ref)`; its validated constructors are split into `try_from_item_claim(...)` and `try_from_execution_claim(...)`, and its durable selectors remain private to application/infra. The report row records the accepted proof for audit/recovery, while commit still revalidates the current claim row through the Step 07 guard.

### 48.5 Addendum closure

| check | result |
|---|---|
| application remains the sole object/port owner | pass_design_only |
| infra can name, rehydrate and encode every S07-D Job repository carrier | pass_design_only after this addendum |
| entry/public protocol gains claim or planned-material authority | no |
| claim subject remains a tagged execution/item model | yes; split cross-crate methods avoid nullable side fields |
| item/report atomic follower uses one item claim | yes |
| terminal finalize uses execution claim | yes |
| tests / implementation / evidence | `planned/not_run`; none claimed |

Affected correction IDs `R07-JOB-CROSS-CRATE-VIS-01` and `R07-REPORT-CLAIM-SUBJECT-01` are closed at design-only depth by this owner addendum plus the exact S07-D port signatures. Downstream Step 09/11/13/16 and formal assembly remain open/frozen; no implementation readiness or commit is claimed.

## 49. S07-D durable claim-authority time addendum

> Current affected correction: Step 07 commit guards must evaluate a lease window without treating process time as durable claim authority. This section clarifies the source contract; it does not change claim fields, lease arithmetic, state transitions or fencing semantics.

The claim repository exposes a read-only durable-authority time observation. Every `authority_now` used by acquire, renew, release, expiry classification or synchronous guard registration must come from that repository capability immediately before the operation. `ClockPort.now()` remains the owner for ordinary observation/report/result timestamps and cannot substitute for claim authority time.

Guard registration may compare the supplied durable observation with the decoded claim deadline to reject an already expired row before staging proceeds. That comparison is only an early rejection. At commit, the durable adapter must obtain a fresh authority time inside the same transaction that locks/revalidates the claim row and must reject when the exact row is no longer current, Active, version-equal or inside its lease. The registration-time observation never extends the lease and never authorizes commit by itself.

The repository must not accept request time、source time、worker heartbeat memory、database client time or a caller-constructed future timestamp as `authority_now`. A fake supplies the same explicit authority capability and advances it only through its controlled clock seam; a durable implementation binds it to the claim store's authoritative time source. This closes `R07-CLAIM-GUARD-AUTHORITY-TIME-01` at Step 06 owner depth; exact port signatures are fixed in S07-D and tests remain `planned/not_run`.

## 50. S07-D non-publication phase retry and item-fold addendum

> Current affected correction: the C-batch stable tokens and D-batch item state require append-only history when a handoff/export item retries. Section 30 of the external-effect owner now supplies that history. This section defines how the existing item/report owners consume it without adding another item state.

### 50.1 Exact item failure association

The current `ObservationJobPlanItemOutcomeAssociation` includes the following private owner-qualified variant:

```rust
ExternalEffectAttemptFailure {
    intent_ref: ExternalEffectIntentRef,
    ordinal: ExternalEffectAttemptOrdinal,
    phase: ExternalEffectPhase,
    failure: ExternalEffectAttemptFailure,
}
```

It replaces the ambiguous use of `ExportFailure(ExportFailureReason)` for a complete external phase attempt. The historical variant may remain only for export-local failures that occur before an external attempt authorization exists. Once an authorization is committed, every `FailedRetryable` / `FailedPermanent` item classification caused by that invocation must use `ExternalEffectAttemptFailure` and match a committed completion byte-for-byte.

Compatibility is total:

| work key | legal phase | association relation | item classification |
|---|---|---|---|
| `ReportHandoff(handoff_ref)` | `HandoffPreparation` | intent token handoff ref equals key; completion failure is `HandoffPreparation` or probe-resolved indeterminate | retryable iff finite reason says retryable; otherwise permanent/manual |
| `ReportHandoff(handoff_ref)` | `HandoffDelivery` | intent token handoff ref equals key; completion failure is non-Delivered `HandoffDeliveryResult` or probe-resolved indeterminate | `RetryableFailure` may be retryable; `PermanentFailure` / `Rejected` permanent; resolved indeterminate follows Step 12 policy |
| `ExternalExport(preparation_ref)` | `ExportPreparation` | token preparation ref equals key; completion failure is `ExportPreparation` or probe-resolved indeterminate | exact `ExportFailureReason` retryability plus Step 12 policy |
| `ExternalExport(preparation_ref)` | `ExportDelivery` | token preparation ref equals key; completion failure is compatible result/reason pair or probe-resolved indeterminate | exact pair controls retryable/permanent mapping |

The association's `intent_ref` / ordinal / phase / failure must equal the current last completion returned by `ExternalEffectAttemptAccounting`. `failed_refs` includes the local handoff/export owner ref; `progress_refs` includes only existing body-free preparation/package/receipt/delivery refs that actually exist. Neither set invents an attempt ref, external run id, evidence alias or provider receipt.

### 50.2 Preparation success is an in-item phase boundary

`PrepareReportHandoffDelivery` and `PrepareExternalAuditExportDelivery` each execute two independently tokenized phases inside one immutable Job plan item. A successful preparation completion therefore does not classify the item as `Succeeded` or `SkippedTerminal`.

Before the first external preparation authorization, the Job must first commit the owning local policy transition under the exact item claim:

| work item | fresh complete policy input | required accepted local mutation | same-UoW Job relation |
|---|---|---|---|
| `ReportHandoff(handoff_ref)` | P7 `HandoffReadinessDecision` plus all complete handoff/input/hint/gap/retention/protection/P10 inputs | `ReportHandoffRecord::prepare(...) -> Prepared` plus H4 record/followers | `Planned -> Running` and matching Draft fold |
| `ExternalExport(preparation_ref)` preparation phase | P14 `ExportPreparationDecision` plus complete preparation/view/gap/retention/protection/P10 input | `ExternalAuditExportPreparation::apply_decision(...) -> Prepared` plus H9 record/followers | `Planned -> Running` and matching Draft fold |

Before loading/evaluating those policy inputs, application checks the global work-key/preparation-phase unresolved locator. Same-plan unresolved history routes directly to probe recovery; another lineage causes zero business/sidecar writes, explicit release of any newly acquired competing claim and stop. Only an absent unresolved row permits the local prerequisite UoW.

This local prerequisite UoW contains no external intent, phase link or attempt authorization. Expected Pending/Blocked/non-Prepared policy outcomes may commit only their owning local transition and compatible Job classification; stale decisions and construction/persistence errors roll back with zero visible writes. None opens an external cut. After a known successful prerequisite commit, application reloads the `Running` item、Draft report and Prepared owner versions; only a later pre-call UoW may append intent/link/authorization. An already committed token-compatible Prepared owner may skip a duplicate transition, but it still requires a committed `Running` item and Draft fold before authorization.

The preparation post-call UoW:

1. appends the matching positive preparation/package carrier;
2. appends a `Succeeded` attempt completion for the preparation intent;
3. revalidates the unchanged policy-evaluated local `Prepared` owner revision; the external carrier does not create another handoff/export preparation transition;
4. keeps `ObservationJobPlanItem.state == Running` and current outcome `None`;
5. leaves the existing report fold entry as `Pending { state: Running }`, replacing its snapshot proof only if the item row itself is CAS-staged in that UoW;
6. does not seal or terminally classify the report.

The delivery phase uses a distinct linked intent and distinct accounting. Handoff delivery may proceed from the same still-Prepared handoff revision retained by preparation completion. Export delivery has one additional local prerequisite: after the package carrier commits, application evaluates a fresh complete P14 `PeripheralDeliveryDecision` and commits the matching `PeripheralDeliveryState::prepare(...) -> Prepared` transition/H9 followers while the export preparation remains Prepared and the item/report remain `Running` / `Draft`. The export delivery link/intent/authorization is appended only in a later UoW that reloads and guards both Prepared owners and the committed package. A blocked/stale/error P14 outcome creates no delivery intent and cannot treat the package as delivery authority.

Only a successful delivery or a finite delivery failure can produce the terminal/current item classification. If preparation itself completes with a known failure, that phase completion may classify the item `FailedRetryable` / `FailedPermanent` because no delivery call is permitted.

A later plan may encounter an already successful semantic-equal delivery intent while the local handoff or export owners are already `Delivered`. This is the only non-Prepared bypass of the local prerequisite. Application must load the exact successful completion and HandoffDeliveryReceipt or ExportDelivery local-owner proof, prove complete semantic equality with the new plan material, acquire the new plan's item claim, and atomically append only the new phase link plus terminal item/Draft-fold classification under exact Delivered owner guards. It emits no new P7/P14 transition, intent, authorization, adapter call, receipt/package or Delivered transition. Missing/mismatched success proof is a consistency stop, not permission to reprepare a terminal owner.

### 50.3 Retry reentry proof

For a non-publication external item, `retry_from_failed_retryable(...)` additionally requires:

- a current `ExternalEffectPhaseLink` for the exact plan/work/failed phase;
- the same committed intent and immutable planned/prior-phase material;
- complete `ExternalEffectAttemptAccounting` with no unresolved authorization;
- a last `NotCompleted` completion equal to the current item outcome association;
- `completed_additional_attempts()` accepted by the phase's frozen `HandoffRetry` or `ExportRetry` binding;
- the later backoff gate accepted from the same completion timestamp;
- a fresh Active item claim/fence and a still-Draft report.

Retry reentry is phase-sensitive:

1. If the failed attempt left every phase-local owner in the exact token-compatible Prepared state, one pre-call UoW may stage `FailedRetryable -> Running` with the matching Draft fold and append the next authorization under the same registered claim guard and owner read guards.
2. If handoff delivery left `ReportHandoffRecord` in retryable `Failed`, application must evaluate fresh complete P7 inputs and commit `prepare(...) -> Prepared` plus H4 followers and the item/report Running reentry before any next authorization.
3. If export preparation left `ExternalAuditExportPreparation` in retryable `Failed`, application must evaluate a fresh complete P14 export-preparation decision and commit its Prepared transition/H9 followers and Running reentry first.
4. If export delivery left either export preparation or peripheral delivery owner in retryable `Failed`, application must evaluate fresh complete P14 preparation/delivery decisions for every non-Prepared owner and commit a mutually compatible Prepared pair plus H9 followers and Running reentry first.

Cases 2~4 always use a separate subsequent authorization UoW. That UoW reloads the committed Prepared owner versions, item/report and immutable plan material, then verifies the old intent token is still semantically compatible before appending the next ordinal. If fresh policy inputs change the binding、consumer、view、package relation or any digest-covered material, or produce Pending/Blocked/non-Prepared output, the current plan stops: it cannot reuse the old token, rotate to a new token under the existing plan/work/phase link, or call a provider. Downstream Step 12 owns the exact blocked/permanent/manual mapping.

Clearing the current item outcome during reentry is not deletion: the previous completion and all lower ordinals remain append-only. A claim count、Job invocation count、report count、current domain failure or scheduler attempt can never substitute for accounting.

An unresolved authorization or indeterminate observation is not `FailedRetryable`; the item remains `Running` and the report remains `Draft`. `Unknown` / `Unsupported` probe outcomes append nothing. A formal negative completes the old ordinal first; any subsequent authorization uses the next ordinal in a separate UoW.

### 50.4 Closure

| check | conclusion |
|---|---|
| two-phase preparation success prematurely terminalizes item | prohibited; item remains Running |
| retry history survives current outcome replacement | yes; external attempt sidecar is append-only |
| phase budgets remain independent | yes; accounting is per intent/phase |
| local Failed delivery blindly authorizes another call | prohibited; fresh P7/P14 Prepared transition commits first |
| changed material rotates the current plan token | prohibited; current plan stops before authorization |
| report reconstructs attempts from counters/current state | prohibited |
| source/business truth or external acceptance owner changes | no |

This closes the Job-owner portion of `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` at design-only depth. Step 07 port/UoW propagation is now closed in S07-D design-only; Step 09/11/12/13/14/16 and formal `03` remain frozen. Tests are planned/not-run and no implementation artifact or commit is claimed.
