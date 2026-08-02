# Step 7 Exact Read 与必要 Maintenance Surface 回归中间产物

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
> 创建日期: 2026-07-30
> 当前状态: `7R-04A-A2-F5_completed_wait_user_review`
> 所属流程: `03_ddd_calibration_flow.md`
> 当前 blocker: `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001 | SBX-DDD-GRANULARITY-STEP7-READ-001`
> 当前边界: A1 与 A2-F1~F5 已完成静态设计闭合；当前停在 F5 用户复核门，A3/A4 未开始，正式 `03` 仍冻结。

---

## 1. Step 开工确认

| 项目 | 当前记录 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 7 regression / `7R-04A` |
| 用户门禁 | 已消费 `7R-06 completed_wait_user_review`；只授权进入下一 owner `7R-04A` |
| 当前模块 | `application query read ports + necessary maintenance boundary` |
| 输出文件 | `03_ddd_step_07_read_maintenance_surfaces.md` |
| 执行模式 | full-restart 后的 targeted Step 7 regression；旧正式文档和旧 Step 7 只作 historical material |
| 项目级门禁 | pass；`project_execution_ledger.md` current EOF 指向 `7R-04A` |
| 文档级门禁 | pass；`03_ddd_calibration_flow.md` current EOF 指向 `7R-04A` |
| Step 级门禁 | pass；先完成 A1 inventory，不提前写 A2/A3/A4 |
| 正式正文污染 | no；正式 `03-详细设计.md` 本批冻结 |
| implementation | `CB-SBX-01A blocked / wait_design` |
| 新 L1/L2 blocker | `0` |

## 2. `7R-04A` 内部计划

| internal batch | status | 可审查产物 | 完成门禁 |
|---|---|---|---|
| `7R-04A-A1` | `[x]` | 13 Query / maintenance current inventory、carrier 复用分类与缺口基线 | logical Query `13/13`、既有 maintenance reader `9/9` 分离；无 generic reader |
| `7R-04A-A2` | `[x]` | 五个 Query family 的 exact reader/index/bundle contracts | `5/5` families、Query `13/13 provisional`、selector variants `19/19`；停在 F5 用户复核门 |
| `7R-04A-A3` | `[ ]` | absence/gap/degraded/missing-projection/empty mapping 与必要 whole-group writer 边界 | Query zero-write；maintenance writer caller、原子组、Version 和 safe stale 规则闭合 |
| `7R-04A-A4` | `[ ]` | 正反向 closure audit、`READ-001` 裁决和恢复源同步 | 13/13 reader、bounded page、error/read-write surface 无遗漏或 alias；只关闭 owner 条件满足者 |

A2 必须再按五个 Query family 小循环推进：`execution/boundary/policy`、`capture/handoff`、
`failure/cleanup/redline`、`projection/derived/comparison`、`reconciliation/audit`。一个 family 未完成自检前，
不得写下一个 family 的最终签名。

## 3. 本批输入与 current authority

| source | A1 消费的 current 结论 |
|---|---|
| 详细设计 SOP Step 7 / 书写规范 | reader 必须提供完整 DTO/flow/state 所需读取面；trait method 必须具名参数、返回和错误 |
| 中间产物规范 / 可落码性标准 | 先问题回答、诊断、取舍再写 inventory；Query 的 empty、stale、degraded、missing projection 必须可测试 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` §§21~27 | 13/13 facade、input、selector、typed output、access-first/no-write 和逐 Query read requirement 已固定 |
| Step 6 五份 canonical object source | 12 个 Query 已有 source snapshot 或 closed lookup owner；audit trace 只有 record/page 语义，尚无 formal read carrier |
| `03_ddd_step_07_idempotency_stored_index_repositories.md` §§64~70 | 9/9 paged maintenance selection readers 已闭合；Query 使用量 `0/13` |
| `03_ddd_step_07_repositories_uow_indexes.md` current EOF | committed read snapshot 与 write UoW 分离；mutable root repository 不得被 Query 当作 view reader |
| `03_ddd_step_07_cross_audit_b1_closure.md` current delta | `READ-001` 唯一剩余 read owner；关闭要求含 exact index/bundle key/body-free input/bounded selection/whole-group writer/read error |

## 4. A1 SOP 问题回答

| SOP 问题 | A1 current answer |
|---|---|
| 哪个模块需要 port | `application` 需要 public Query formal read port；必要 materialization writer 也由 application 声明、infra 实现 |
| 谁调用 / 谁实现 | 只有 `SandboxQueryService` 或明确 maintenance service 调用；durable 与 deterministic fake 由 `infra` 实现 |
| reader 承接什么对象能力 | 承接 Step 6 checked source snapshot / lookup outcome，不直接承接 domain transition 或 external capability |
| Query 输入 | 13 个已固定 application input / closed selector，不新增 opaque scope、latest flag 或 optional precedence |
| consistency | 每次 permitted Query 只使用一个公平 `SandboxCommittedReadSnapshot`；不能由多个 latest read 拼 body |
| absence | 只能由 exact index/binding/owner relation 的完整零基数 proof 形成；repository `NotFound/None` 不是 proof |
| degraded | 只能来自 Step 6 typed read gap 与 checked source；known half-commit/cardinality corruption 必须为 integrity error |
| write boundary | Query `13/13` write UoW、identity/cursor allocation、repair/rebuild/refresh、external call、business audit append均为 `0` |
| maintenance | 只承接 Query 所需 immutable view/binding materialization 与既有 9 个 bounded selection reader；不设计 scheduler、TTL、DDL、repair 算法 |
| page helper | failure/control 与 audit 使用 `SandboxQueryPageInfo`；repository cursor 只在 application 内部，Step 8 后续机械编码 token |
| 跨层禁止 | API/Worker/Jobs 不持有 reader/repository；domain 不依赖 infra；Query 不调用 maintenance selection repository |
| 图示判断 | A1 不画图；本批是 13 项一一 inventory，矩阵比调用图更能检查数量、owner 和缺口 |

## 5. Current 材料诊断

| 诊断项 | current finding | 风险 | A1 处置 |
|---|---|---|---|
| facade 与 reader 不对称 | facade 已 `13/13`，formal Query reader method 尚未落盘 | 实现者可能直注入 mutable repository 或 generic projection getter | A2 明确 13 个 exact callable，不允许 facade 自行拼 repository |
| source carrier 完整度不同 | 五项已有完整 lookup outcome，七项只有 source/partial carrier，audit 无 formal carrier | 容易重复定义 Step 6 schema，或用 `Option<T>` 抹平差异 | A1 分类 reuse/extend/new；A2 只补缺口 |
| maintenance 名称重叠 | 9 个 paged maintenance reader 已存在，但不服务 13 Query | 实现者可能复用 candidate index 作为 public truth reader | inventory 中永久分组，Query use=`0/13` |
| absence 口径分裂 | 普通 exact absence、projection missing、empty bounded scope 并非同一 surface | generic `None -> Empty` 会隐藏 missing projection 或 integrity | A2/A3 逐 Query 保留 closed outcome |
| old read repository | historical `load_status_snapshot` / latest scan / opaque scope 仍可被搜索到 | 错把 historical material 当 current API | 全部登记 forbidden，不提供 alias |
| writer 范围不清 | `READ-001` 要求 whole-group writer，但 Query 必须 zero-write | reader 内 repair 或 query-triggered materialization | A3 只定义独立 maintenance caller 与 atomic writer boundary |

## 6. 改动前后对比与设计取舍

| concern | before A1 | after A1 |
|---|---|---|
| Query count | 13 facade 与分散 Step 6 source 可分别查到 | 13/13 facade-input-selector-output-source status 单表闭合 |
| carrier ownership | 不清楚哪些可复用、哪些需补 formal lookup | full reuse `5`、partial extension `7`、new formal carrier `1` |
| maintenance relation | 9-reader 与 Query read 容易混称 bounded read | paged candidate reader、public Query reader、materialization writer 三面分离 |
| blocker | `READ-001` 只有粗粒度关闭描述 | A2/A3/A4 可按 inventory 逐项验收；A1 不提前关闭 |

采用方案：保留 13 个 Query 的独立 logical read capability，并优先复用 Step 6 canonical carrier。A2 可以按装配便利把
exact methods 放入一个或多个 application read trait，但 method 必须逐 Query 具名且 output 不得退化为共同 opaque payload。

未采用方案：

1. 不采用 `read(kind, selector) -> Option<View>`；它丢失编译期 selector/output 关系和 absence/gap/integrity 分类。
2. 不复用 9 个 maintenance candidate reader；candidate index 不拥有 public view truth，且 action 前仍需 owner reload。
3. 不让 Query 直接调用 materialization writer；stale/missing 只返回诚实 surface，维护由显式 job/consumer/service 触发。
4. 不在 A1 定义全部 Rust trait；先冻结 inventory，避免重复 Step 6 carrier或遗漏 bundle/index relation。

## 7. 13 Query Current Inventory

| # | Query / exact facade | fixed input / selector | typed application output | canonical read source | A1 carrier class |
|---:|---|---|---|---|---|
| 1 | `GetSandboxExecutionStatus` / `get_sandbox_execution_status` | `GetSandboxExecutionStatusInput` / required context | `SandboxQueryResult<SandboxExecutionStatusView>` | `SandboxExecutionStatusSourceSnapshot` | partial: 补 exact absence/gap/lookup outcome |
| 2 | `GetBoundaryStatus` / `get_boundary_status` | `GetBoundaryStatusInput` / exact 或 current-for-context | `SandboxQueryResult<BoundaryStatusView>` | `BoundaryStatusSourceSnapshot` | partial: 补 0/1 binding proof 与 lookup outcome |
| 3 | `GetPolicyDecisionSummary` / `get_policy_decision_summary` | `GetPolicyDecisionSummaryInput` / exact 或 current-for-context | `SandboxQueryResult<PolicyDecisionSummaryView>` | `PolicyDecisionSummarySourceSnapshot` | partial: 补 decision binding/absence/gap outcome |
| 4 | `GetCaptureSummary` / `get_capture_summary` | `GetCaptureSummaryInput` / exact 或 for-run | `SandboxQueryResult<CaptureSummaryView>` | `CaptureSummarySourceSnapshot` | partial: 补 whole capture group lookup outcome |
| 5 | `GetMaterialHandoffStatus` / `get_material_handoff_status` | `GetMaterialHandoffStatusInput` / exact 或 current-for-context | `SandboxQueryResult<MaterialHandoffStatusView>` | `MaterialHandoffStatusSourceSnapshot` | partial: 补 plan/progress/relay bundle lookup outcome |
| 6 | `GetFailureControlStatus` / `get_failure_control_status` | required context + validated `PageRequest` | `FailureControlStatusQueryResult` | `FailureControlStatusSourceSnapshot` + binding/gap carriers | partial: 补 empty-scope proof、page lookup outcome/error |
| 7 | `GetCleanupReadiness` / `get_cleanup_readiness` | `CleanupReadinessSelector` current/exact | `SandboxQueryResult<CleanupReadinessView>` | `CleanupReadinessSourceLookupOutcome` | full reuse |
| 8 | `GetRedlineContainmentStatus` / `get_redline_containment_status` | required context + exact redline | `SandboxQueryResult<RedlineContainmentView>` | `RedlineContainmentSourceLookupOutcome` | full reuse |
| 9 | `GetSandboxReadProjection` / `get_sandbox_read_projection` | exact projection 或 current-for-context | `SandboxQueryResult<SandboxReadProjection>` | `SandboxReadProjectionSourceSnapshot` | partial: 补 binding/missing/gap/lookup outcome |
| 10 | `GetDerivedInspectPreviewTrend` / `get_derived_inspect_preview_trend` | required context/state + `Inspect/Preview/Trend` | `SandboxQueryResult<DerivedInspectPreviewTrendView>` | `DerivedInspectPreviewTrendSourceLookupOutcome` | full reuse |
| 11 | `GetBackendCapabilityComparison` / `get_backend_capability_comparison` | context + requirement + ordered `1..=16` summary refs | `SandboxQueryResult<BackendCapabilityComparisonView>` | `BackendCapabilityComparisonSourceLookupOutcome` | full reuse |
| 12 | `GetSandboxReconciliationReport` / `get_sandbox_reconciliation_report` | required exact report selector | `SandboxQueryResult<SandboxReconciliationReport>` | `SandboxReconciliationReportLookupOutcome` | full reuse |
| 13 | `GetSandboxAuditTrace` / `get_sandbox_audit_trace` | context + subject + optional closed kind + page | `SandboxAuditTraceQueryResult` | committed `SandboxAuditTrace` records；无 formal lookup carrier | new: 补 page source/empty proof/gap/outcome/error |

Inventory closure：logical Query `13/13`、facade `13/13`、input/selector `13/13`、typed output `13/13`；
carrier 分类为 full reuse `5/13`、partial extension `7/13`、new formal carrier `1/13`，无遗漏或重复。

## 8. Read Semantics 与 A2 Contract Baseline

| family | exact key / bundle requirement | valid non-body branch | forbidden fallback |
|---|---|---|---|
| execution/boundary/policy | context exact key；current variant要求同 snapshot `0/1` binding；source/view relation完整 | exact absence=`Empty`；typed dependency=`Unavailable` | latest timestamp、policy re-evaluation、run-only status derivation |
| capture/handoff | context/run/capture 或 context/handoff whole committed group | complete zero proof=`Empty`；allowed source gap按 matrix | child latest scan、adapter retry、aggregate recompute |
| failure/cleanup/redline | bounded window或 canonical exact/current selector；proof、owners、relation同 snapshot | empty-scope/exact absence；typed no-view | direct failure latest、query cleanup/release、redline disclosure |
| projection/derived/comparison | exact key/current binding、materialized row、source/cursor relation | projection missing=`MissingProjection`；derived/comparison exact absence=`Empty` | generic `None`、query rebuild、backend call |
| reconciliation/audit | exact report bundle；subject-stable append page | exact report absence或complete empty page | scope latest report、cross-subject scan、read audit append |

A2 的每个 exact reader 必须接受 access-approved decision、matching selector 与
`&mut dyn SandboxCommittedReadSnapshot`，或在签名中以等价 checked read context 明确承接；不得接受 write UoW、
raw DTO、route/topic、generic object ref、SQL cursor 或 public token。

## 9. Necessary Maintenance Boundary Inventory

| surface | current owner / count | 与 public Query 的关系 | A1 disposition |
|---|---|---|---|
| paged maintenance selection | `SandboxMaintenanceSelectionRepository`，9 exact methods | Query use=`0/13`；只产生 candidate，action 前 owner reload | 已由 `7R-02D` 闭合，A2 不重复 |
| query view materialization | application maintenance service + typed writer，具体 family 待 A3 | 只能在显式 maintenance flow 写 immutable row/binding/index | A3 定义 caller、whole group、Version、safe stale；不写 scheduler |
| reconciliation report materialization | dedicated job/writer/stored replay owner | report Query只读 exact committed bundle | A2只复用 lookup；writer 细节不并入 Query |
| audit append | mutation owner 的 immutable business audit append | audit Query只读；本次 read append=`0` | A2定义 bounded reader，A3不新增 read audit |
| runtime assembly | `7R-04B` 18-slot wiring owner | 只装配已定义 port，不改变 selector/outcome | 本批 deferred |
| observability / review / test / delivery | downstream low-cardinality gate | 不拥有 read truth、repair或 acceptance | 仅保留必要 gate，不展开第二主流程 |

## 10. A1 回填草稿

正式 `03` Step 19 重装配时，本批只提供以下待后续 A2~A4 收稳后采用的摘要，不在当前正式文档回填：

> Sandbox application 为 13 个 public Query 保留一一对应的 exact read capability。每次 permitted Query 仅在一个
> committed read snapshot中消费 matching closed selector 和 checked source/lookup carrier；Query 不写 truth、
> 不触发 refresh/rebuild/repair，也不调用 external adapter。9 个 paged maintenance selection reader 是独立 candidate
> surface，不参与 public Query。必要 view materialization 由显式 maintenance service 通过 typed whole-group writer完成。

该草稿目前只证明 inventory，不包含可直接回填的 trait 签名；A2/A3/A4 未完成前不得进入正式正文。

## 11. A1 自检与进入下一批条件

| check | result |
|---|---|
| Query logical/facade/input/output inventory | `13/13 | 13/13 | 13/13 | 13/13` |
| current carrier classification | full `5` + partial `7` + new `1` = `13/13` |
| existing paged maintenance reader | `9/9` preserved；Query use=`0/13` |
| generic/opaque/latest reader positive path | `0/0/0` |
| Query write/external/repair/business-audit | `0/0/0/0` |
| A1 new trait/method/public type | `0/0/0` |
| `READ-001` | open；A1 inventory 不构成关闭证据 |
| new L1/L2 blocker | `0` |
| implementation/test/evidence/acceptance/commit fact | none |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v5.9-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_module = exact_read_and_necessary_maintenance_surface
current_task = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A1 current inventory completed_wait_user_review
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_in_progress_wait_user_review
batch_status = completed_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = pending
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_inventory = 13/13
carrier_reuse_partial_new = 5/7/1
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/13
next_internal_batch = 7R-04A-A2 execution/boundary/policy exact reader contracts
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
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## Historical-Position Working Draft: A3-2-S3-P4 Safety Writer Methods、Owner Inspection 与 Parity Closure

### 100.1 P4 范围、问题回答与设计裁决

P4 只收口 S3 已完成的三个 safety family 的 shared execution surface。它回答四个实现前问题：

1. 三个 family 由哪些具名 application-private method 承接，method 能否证明自己只 stage 而不接管事务。
2. commit 返回 unknown 后，owner 依靠哪些完整 typed key 判断整组已经提交、整组未提交或无法判定。
3. durable adapter 和 deterministic fake 是否经过同一个 staged-overlay、CAS、rollback 和 inspection 语义。
4. S3 的静态闭合是否增加 public callable、Query 写入、第二 truth owner 或异常/交付主流程。

P4 不重新定义三个 source image、binding、first proof 或 pointer plan；它只把 §97~§99 已冻结的 family payload 接到共享
writer 和 owner recovery discipline。任何与前部 working marker 不同的结论，以本节以及后续物理 EOF recovery override 为准。

| 已识别缺口 | 本批裁决 | 禁止替代 |
|---|---|---|
| 三个 safety family 只有 payload，没有 production callable surface | 增加三个 exact named stage method，参数分别绑定 family marker、typed context、candidate 与 generic target/index expectation | `stage(kind, payload)`、runtime enum dispatch、public service method |
| whole-group key 只在 prose 中列出 | 为每个 family 冻结 application-private typed key，包含 source、materialization、pointer、relation 与 owner completion 全部成员 | `HashMap<String, Value>`、view ref 单项 lookup、candidate/expected Version 推断 |
| commit unknown 只有三分支名称 | 冻结 fresh committed snapshot、完整成员读取、rehydration、before-state 对账和判定顺序 | 用 stage result、局部 row、binding 存在性或 rollback 返回值猜测 |
| fake 可能只模拟最终成功 | fake 必须保存 committed base、同 UoW overlay 和 scripted commit disposition，并复用 owner exact inspection path | auto-proof、auto-commit、last-write-wins、把 unknown 暴露给业务层 |
| cleanup 有 exact target 与 context current 两个 pointer | generic target expectation 唯一承载 exact-target Version，family index expectation 只承载 context-current 独立 plan/version | 复制 exact Version、共享 pointer Version、pointer-only success |

P4 仍遵守用户已确认的优先级：异常、审查、测试、交付只留下主体安全所必需的 fail-closed 类型、inspection key、parity
断言和静态门禁，不新增 incident runbook、人工审批流、测试执行事实、evidence alias 或验收签署。

### 100.2 三个具名 safety writer method

三个 method 属于 application crate 内部的 capability-segregated port。它们不计入 `42` 个 public application callable，不能由
Query、protocol、worker dispatcher 或外部 maintenance API 直接调用；source mutation owner 在完成 canonical source transition、
audit linkage、truth cursor 和 operation reservation 后，才可以在同一 borrowed UoW 中构造对应的 typed context。

```rust
/// 三类 safety status-view 的 application-private staged writer。
/// 不提供 generic family dispatch，也不拥有 UoW manager。
pub(crate) trait SandboxSafetyStatusMaterializationWriter: Send + Sync {
    async fn stage_failure_control_status_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, FailureControlStatusMaterializationFamily>,
        candidate: FailureControlStatusMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<FailureControlStatusMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<FailureControlStatusMaterializationFamily>,
        SandboxStatusViewStageError,
    >;

    async fn stage_cleanup_readiness_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, CleanupReadinessMaterializationFamily>,
        candidate: CleanupReadinessMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<CleanupReadinessMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<CleanupReadinessMaterializationFamily>,
        SandboxStatusViewStageError,
    >;

    async fn stage_redline_containment_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, RedlineContainmentMaterializationFamily>,
        candidate: RedlineContainmentMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<RedlineContainmentMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<RedlineContainmentMaterializationFamily>,
        SandboxStatusViewStageError,
    >;
}
```

method contract 的共同约束如下：

| contract dimension | frozen rule |
|---|---|
| context ownership | `AcceptedSandboxWriteContext<F>` 按值消费；它借用 caller 的同一个 UoW，不能 `Clone`、序列化、存入 writer field 或跨 `await` 生命周期逃逸。 |
| family match | method 名、context marker、candidate、expectation、accepted source proof 必须是同一 family；不通过字符串或 runtime kind 解释。 |
| candidate | candidate 只能由对应 checked source proof 和 owner 预分配 typed ref 构造；不接收 Query selector、page、absence、gap、public DTO 或 raw row。 |
| expectation | generic `SandboxStatusViewTargetExpectation` 负责 exact target；`F::IndexExpectation` 只负责该 family 的其它 physical pointer/index。 |
| lifecycle | method 可以 pure-validate、same-UoW exact-read、stage immutable members、stage pointer/index 和 read-your-staged-write；不得 begin、reserve、allocate cursor、append business audit、commit、rollback 或调用 external port。 |
| result | 只返回 `StagedSandboxStatusViewWrite<F>`；`Staged` 不是 `Committed`，result 不含 commit token、retry hint、raw store error 或 evidence/test 字段。 |
| error | 所有 failure 映射到既有 `SandboxStatusViewStageError` 闭集；任何 stage 后错误都要求 source owner 对整个 UoW rollback。 |

### 100.3 Shared stage algorithm 与三个 family 差异

三个 method 的共同算法固定为以下十二步。步骤 1~7 在首次 repository write 前完成；步骤 8~11 一旦失败，不能捕获后继续
stage 其它成员或其它 family。

```text
1. consume typed context and compare family/transaction/UoW identities
2. compare accepted source proof, candidate image/binding/view ref and materialized_at
3. checked-rehydrate candidate image through the matching Step 6 factory/kernel
4. exact-read formal owner, canonical source group, audit relation and current pointers in the same UoW
5. validate FirstForFormalTarget or ReplaceExactTarget and every family index plan
6. prove new image/binding/member/history/relation namespaces are empty and old generation is complete when replacing
7. verify source cursor, counts, lineage, audit and pointer expectations from the staged overlay
8. stage immutable image/header and all family member rows under the new view_ref
9. stage immutable binding/history/source relation and each independently-owned mutable pointer
10. exact-read the complete staged group through the same UoW overlay and compare all typed keys/cardinalities
11. construct the family-typed StagedSandboxStatusViewWrite from context/candidate/expectation identities
12. return the staged result; caller retains commit/rollback/unknown responsibility
```

| method | additional stage members | pointer/version rule | family-specific fail-closed check |
|---|---|---|---|
| `stage_failure_control_status_materialization` | header、failure items、control items、cross-link rows、binding、history、source relation | context current is the single physical mutable pointer；exact context target的 Version 不能另存第二份 | full merged index、scope aggregate、first/last key、item/cross-link closure必须在同一 cursor 完成；empty scope仍写完整 header/binding。 |
| `stage_cleanup_readiness_materialization` | image nested evidence/owner/redline/release relation members、binding、history、source relation | generic target expectation持有 exact `(context, guard)` latest Version；`CleanupReadinessIndexExpectation` 只执行 context-current `Install/Replace/Preserve` 独立 plan | exact guard 与 context current 可分别 first/replace/preserve；两个 pointer 的 old/new generation、Version、position 和 relation 必须同组可见。 |
| `stage_redline_containment_materialization` | complete body-free redline image、coverage membership relation、binding、history、source relation | 只有 exact `(context, redline)` current pointer；不写 context-latest/kind-latest/single-active pointer | detection、containment proof、preservation、investigation、disposition、timeline 和 exact coverage membership 缺一即拒绝；不能用另一个 redline 证明本 operation。 |

method 返回后，source owner 才能重新取得 UoW，stage 自己的 stored/idempotency/relay/stale completion，并调用既有
`SandboxUnitOfWorkManager::commit`。只有 commit 返回 matching confirmed receipt，且 receipt cursor、source proof cursor、全部
owner completion refs 相等，caller 才能形成既有 fresh stored surface。writer 不拥有该 success promotion。

### 100.4 Safety whole-group inspection key 的完整 typed 成员

下面三个 key 是 application-private conceptual shape，由 operation owner 在 commit 前从 accepted proof、preallocated refs 和既有
`SandboxStatusViewOwnerCompletionKeys` 冻结。它们不是新的 public port、repository trait 或 Query input。key 中的 before binding
只保存 typed identity/lineage，不保存可用于重建 candidate 的 expected Version；exact-target Version 仍只存在于当次 write
expectation，unknown inspection 通过 frozen before-state 与 durable current row 逐字段对账。

```rust
struct FailureControlStatusWholeGroupInspectionKey {
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
    context_ref: ControlledExecutionContextRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    view_ref: FailureControlStatusViewRef,
    old_current_binding_identity: Option<FailureControlStatusViewBinding>,
    expected_failure_count: u64,
    expected_control_count: u64,
    expected_cross_link_count: u64,
    expected_first_order_key: Option<FailureControlStatusOrderKey>,
    expected_last_order_key: Option<FailureControlStatusOrderKey>,
    failure_item_refs: Vec<FailureClassificationRef>,
    control_item_refs: Vec<ControlFactRef>,
    cross_link_keys: Vec<(FailureControlCrossLinkKind, FailureControlStatusItemRef, FailureControlStatusItemRef)>,
    source_relation_key: FailureControlStatusMaterializationRelationKey,
}

struct CleanupReadinessWholeGroupInspectionKey {
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
    context_ref: ControlledExecutionContextRef,
    cleanup_guard_ref: CleanupGuardRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    view_ref: CleanupReadinessViewRef,
    old_exact_binding_identity: Option<CleanupReadinessViewBinding>,
    old_context_current_identity: Option<CleanupReadinessContextCurrentRow>,
    evidence_member_keys: Vec<CleanupReadinessEvidenceMemberKey>,
    owner_subjects: Vec<CleanupOwnerStatusSubject>,
    redline_refs: RedlineContainmentRefSet,
    release_relation_keys: Vec<(CleanupReleaseRelationSubject, CleanupReleaseRelationKind, CleanupReleaseAttemptKey)>,
    materialization_source_keys: CleanupReadinessMaterializationSourceSet,
    expected_evidence_count: u64,
    expected_owner_count: u64,
    expected_redline_count: u64,
    expected_release_relation_count: u64,
}

struct RedlineContainmentWholeGroupInspectionKey {
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
    context_ref: ControlledExecutionContextRef,
    redline_ref: RedlineContainmentRef,
    guard_ref: RedlineContainmentGuardRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    view_ref: RedlineContainmentViewRef,
    old_exact_binding_identity: Option<RedlineContainmentViewBinding>,
    failure_ref: FailureClassificationRef,
    run_ref: Option<ControlledExecutionRunRef>,
    boundary_ref: CoherentBoundaryRef,
    preservation_material_ref: Option<ObservabilityMaterialRef>,
    preservation_handoff_ref: Option<HandoffFactRef>,
    investigation_target_ref: Option<ExternalSourceRef>,
    investigation_summary_ref: Option<SafeSummaryRef>,
    exact_current_key: (ControlledExecutionContextRef, RedlineContainmentRef),
    coverage_membership: RedlineContainmentCoverageMembershipProof,
}
```

上述 `Vec` / `RefSet` 不是任意 map：owner plan 构造器必须按既有 contracts canonical order 形成、拒绝 duplicate、并冻结
cardinality；adapter 只能按这些 typed keys 读取。下列三个 wrapper 是 application-private、body-free 的 closed key carrier，不能
退化为字符串或由 audit ref 解析：

```rust
struct FailureControlStatusMaterializationRelationKey {
    context_ref: ControlledExecutionContextRef,
    view_ref: FailureControlStatusViewRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
}

struct CleanupReadinessEvidenceMemberKey {
    context_ref: ControlledExecutionContextRef,
    cleanup_guard_ref: CleanupGuardRef,
    source_kind: CleanupReadinessEvidenceSourceKind,
    capture_ref: Option<CaptureFactRef>,
    run_ref: Option<ControlledExecutionRunRef>,
    handoff_ref: Option<HandoffFactRef>,
}
```

`FailureControlStatusMaterializationRelationKey` 只定位已存在的 source-to-view relation；它不替代 relation row 的 checked
cardinality/readback。`CleanupReadinessEvidenceMemberKey` 的 optional refs必须符合对应 evidence union variant；不能用 source kind
补全缺失 identity。cleanup 的 `materialization_source_keys` 必须是 non-empty checked set，redline 的 optional preservation/investigation ref 只能
来自 accepted source 的 exact variant，不能由 inspection 读取“latest”。

owner key 的最低 atomic group 是：canonical source after-state、matching source audit、new immutable image 及所有 nested member、
binding、history、各 physical current/latest pointer、source-to-view relation，以及 operation frozen plan 的 idempotency/stored/
relay/stale 成员。failure/control 的 merged index 和 cross-link closure、cleanup 的 complete coverage/release relation、redline 的
exact coverage membership 都是必需成员，不是可选 diagnostic。

本段曾因分批写入命中前部同形锚点，只保留为 historical-position draft。P4 的 current 内容、后续 parity 和 recovery 状态
必须以本文物理 EOF 的 `## 100` current section 为准；本段不得覆盖 P3/P4 current authority。

## Historical-Position Working Draft: A3-2-S3-P2 Cleanup Readiness Writer

### 98.1 Cleanup durable image 与双索引边界

cleanup readiness 的 logical target 不是 `context_ref` singleton，而是
`(context_ref, cleanup_guard_ref)` exact guard target。一个 context 可以先后产生多个 cleanup guard；因此 durable owner 必须
同时保留 exact-guard history 和 context current selection。两者都是 mutable pointer，但不是同一物理 row，也不能共享一个
`Version`。

```text
CleanupReadinessMaterializationImage(view_ref)
  + immutable CleanupReadinessViewBinding(context_ref, cleanup_guard_ref, view_ref)
  + mutable exact-guard latest row((context_ref, cleanup_guard_ref) -> binding, Version)
  + mutable context-current row(context_ref -> current cleanup_guard/binding, Version)
```

每次 accepted guard truth、accepted redline source或其 release/relation source改变时，都创建新的 immutable image 和 binding。
旧 guard、旧 image、旧 binding及旧 exact-latest row的历史指向不原地修改。新 guard首次物化时，context-current 可以是
`Absent`，也可以指向另一个已经完整提交的旧 guard；该旧 guard 必须保留并且不能被新 guard 的 exact target proof 覆盖。

reader 的 `Current | Historical` 是同一 snapshot 中 current pointer 与 exact selector index比较后得到的 selection proof；它不进入
image。以下字段同样明确排除：`CleanupReadinessSelector`、`CleanupReadinessBindingSelectionProof`、current/exact absence proof、
`CleanupReadGapSet`、`CleanupReadinessPhase`、query `observed_at`、public `Visible/Degraded/Unavailable` outcome 和 caller 的
release permission。`readiness_phase`由 guard status/basis cardinality在 rehydration 时重算；`observed_at`由本次 reader mapping
重新取得；任何 gap 或较早 carrier都不能被写回当前 binding。

### 98.2 Cleanup family-specific materialization image

以下 image 是 cleanup writer 的持久化 codec shape，不是 `CleanupReadinessSourceSnapshot` 的 serde，也不是 public view body。
每个 nested image 都必须由对应的 checked rehydrator 转为 Step 6 contracts carrier；infra 不得用散装字段直接构造
`CleanupReadinessGuardSnapshot`、`CleanupOwnerStatusSnapshot`或`CleanupReadinessRelationProof`。

```rust
/// 一个cleanup evidence source的durable、body-free codec union。
pub enum CleanupReadinessEvidenceImage {
    CompletedRunCapture {
        capture_ref: CaptureFactRef,
        capture_status: CaptureFactStatus,
        observability_material_ref: ObservabilityMaterialRef,
        observability_status: ObservabilityMaterialStatus,
        handoff_ref: Option<HandoffFactRef>,
        handoff_status: Option<HandoffFactStatus>,
        handoff_position: CleanupReadinessHandoffPosition,
        blocking_cleanup_guard_ref: Option<CleanupGuardRef>,
    },
    TerminalRun {
        run_status: ControlledExecutionRunStatus,
        observability_material_ref: ObservabilityMaterialRef,
        observability_status: ObservabilityMaterialStatus,
        handoff_ref: Option<HandoffFactRef>,
        handoff_status: Option<HandoffFactStatus>,
        handoff_position: CleanupReadinessHandoffPosition,
        blocking_cleanup_guard_ref: Option<CleanupGuardRef>,
    },
    BoundaryOnly {
        boundary_status_at_evaluation: CoherentBoundaryStatus,
        handle_status_at_evaluation: IsolationEnvironmentHandleStatus,
        boundary_audit_trace_ref: SandboxAuditTraceRef,
        handle_audit_trace_ref: SandboxAuditTraceRef,
    },
    BoundaryOnlyReleaseFailureRecovery {
        prior_cleanup_guard_ref: CleanupGuardRef,
        prior_failure_summary_ref: SafeSummaryRef,
        prior_failed_at: Timestamp,
        fresh_lifecycle_summary_ref: SafeSummaryRef,
        inspection_position: CleanupRecoveryInspectionPosition,
        inspection_reason: SandboxReason,
        inspection_observed_at: Timestamp,
        boundary_audit_trace_ref: SandboxAuditTraceRef,
        handle_audit_trace_ref: SandboxAuditTraceRef,
    },
}

pub struct CleanupReadinessInvestigationImage {
    target_ref: Option<ExternalSourceRef>,
    summary_ref: Option<SafeSummaryRef>,
    position: CleanupReadinessInvestigationPosition,
    reason: Option<SandboxReason>,
    observed_at: Timestamp,
}

/// guard evidence与investigation的immutable body-free image。
pub struct CleanupReadinessEvidenceMaterializationImage {
    lineage: CleanupReadinessLineage,
    source: CleanupReadinessEvidenceImage,
    investigation: CleanupReadinessInvestigationImage,
    assembled_at: Timestamp,
}

/// exact owner status image；domain basis不进入本row。
pub struct CleanupOwnerStatusMaterializationImage {
    subject: CleanupOwnerStatusSubject,
    status: CleanupOwnerCanonicalStatus,
    truth_cursor: SandboxTruthCursor,
    audit_trace_ref: SandboxAuditTraceRef,
    status_changed_at: Timestamp,
}

/// current redline coverage的一个body-free immutable row。
pub struct CleanupRedlineStatusMaterializationImage {
    redline_ref: RedlineContainmentRef,
    containment_status: RedlineContainmentStatus,
    detected_at: Timestamp,
    status_reason: SandboxReason,
    truth_cursor: SandboxTruthCursor,
    audit_trace_ref: SandboxAuditTraceRef,
    status_changed_at: Timestamp,
}

/// release relation的family-specific immutable row；同一subject的不同kind不可覆盖。
pub struct CleanupReleaseOwnerRelationMaterializationImage {
    subject: CleanupReleaseRelationSubject,
    resulting_status: CleanupReleaseRelationStatus,
    relation_kind: CleanupReleaseRelationKind,
    attempt_key: CleanupReleaseAttemptKey,
    release_progress: CleanupReleaseProgress,
    owner_truth_cursor: SandboxTruthCursor,
    transition_audit_trace_ref: SandboxAuditTraceRef,
    transitioned_at: Timestamp,
}

pub struct CleanupReadinessMaterializationImage {
    view_ref: CleanupReadinessViewRef,
    context_ref: ControlledExecutionContextRef,
    cleanup_guard_ref: CleanupGuardRef,
    safety_guard_ref: CleanupSafetyGuardRef,
    lineage: CleanupReadinessLineage,
    evidence: CleanupReadinessEvidenceMaterializationImage,
    accepted_redline_coverage: RedlineContainmentCoverageSnapshot,
    guard_status: CleanupGuardStatus,
    guard_owned_blockers: CleanupReadinessBlockerSet,
    status_reason: SandboxReason,
    release_progress: CleanupReleaseProgress,
    opened_at: Timestamp,
    evaluated_at: Timestamp,
    allowed_at: Option<Timestamp>,
    completed_at: Option<Timestamp>,
    status_changed_at: Timestamp,
    guard_truth_cursor: SandboxTruthCursor,
    last_audit_trace_ref: SandboxAuditTraceRef,
    owner_statuses: Vec<CleanupOwnerStatusMaterializationImage>,
    redline_statuses: Vec<CleanupRedlineStatusMaterializationImage>,
    release_relations: Vec<CleanupReleaseOwnerRelationMaterializationImage>,
    scope_truth_cursor: SandboxTruthCursor,
    materialization_sources: CleanupReadinessMaterializationSourceSet,
    source_audit_trace_ref: SandboxAuditTraceRef,
    source_observed_at: Timestamp,
}
```

上述三个 `Vec` 是logical codec shape，durable schema必须分别落为以`view_ref + canonical member key`索引的immutable child
rows，不能把无界redline/relation集合塞进单一数据库cell。writer和reader在同一UoW/snapshot按稳定key分批扫描，最终用coverage
count、ordered refs和relation cardinality闭合；batch之间不得重开snapshot或接受新generation。

`accepted_redline_coverage`的 codec 必须保存完整 ordered coverage index的 context、identity、boundary、handle、generation、
count、refs与coverage cursor；它不是“当前页的redline列表”。`redline_statuses`必须按该 coverage 的 exact ref order保存，
允许合法零行但不允许缺行。`owner_statuses`固定包含 boundary、handle，并按 lineage cardinality包含 lease/orphan；不能用
`Vec`长度或缺row解释 optional owner absent。

`guard_owned_blockers`只表示已由 guard owner 在 accepted transition 中形成、并经 contracts closed mapping 的 guard-owned blocker
source；最终 public effective blockers 仍由 rehydrator 将它与 current redline status observations 机械合并。它不能包含 read gap
reason、query wording或由 reader临时发现的 blocker。`release_progress`保存同一 persisted attempt 的 body-free progress，但
`readiness_phase`和 owner closure结论必须由 checked constructor重新派生。

为避免把 Step 6 source helper 直接serde，codec 至少提供下列 crate-private checked入口；所有入口共享一个 relation validation
kernel，不能由 durable adapter自己实现宽松版本：

```rust
impl CleanupReadinessMaterializationImage {
    pub(crate) fn try_from_checked_materialization_source(
        view_ref: CleanupReadinessViewRef,
        source: &CleanupReadinessCheckedMaterializationSource,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;

    pub(crate) fn try_rehydrate_source(
        &self,
        selection: CleanupReadinessBindingSelectionProof,
        observed_at: Timestamp,
    ) -> Result<CleanupReadinessSourceSnapshot, SandboxStatusViewStageError>;
}
```

`try_from_checked_materialization_source`只接受完整 relation proof、完整 owner/redline coverage和current或historical canonical
target position；它不接收reader selection或read gap。若reader只能形成`ReleaseRelation` degraded source，那只是读取时的
availability surface，不能转换为writer input；writer必须由canonical relation/source owner重新形成完整binding-free source。

rehydrator必须按以下顺序执行；`selection`只能由同一reader snapshot中的exact/current pointer lookup形成，`observed_at`必须
不早于selection、binding和全部image source time，二者都不得从image反推：

1. 校验 image/view/binding target、context、guard、lineage、cursor、audit和materialized/source time关系。
2. 将 evidence image重建为 `CleanupReadinessEvidenceSourceSnapshot` 与 `CleanupReadinessEvidenceSnapshot`，重跑 source-kind、
   handoff、investigation、recovery inspection及禁止body校验。
3. 将 owner rows、complete redline coverage/status rows重建为 `CleanupOwnerStatusSnapshot`，重跑 optional cardinality与
   ordered-isomorphism校验。
4. 将 relation images重建为 `CleanupReleaseOwnerRelationSet`，重跑 attempt、kind、subject/status、phase coverage和
   completion/failure exclusivity校验。
5. 用 guard canonical status、basis/progress、owner relation和coverage重新构造 `CleanupReadinessGuardSnapshot`；phase与
   effective blockers由 checked constructor机械生成，不读取 image 中任何 cached phase/boolean。
6. 以 binding、guard、owner与relation组成 `CleanupReadinessSourceSnapshot::complete`；factory成功后才交给 public view mapper。

任一步骤失败都是 `CandidateRejected | IntegrityViolation`，不能返回 partial image、degraded image、旧binding或“可见但不完整”
的 cleanup view。raw backend target、investigation body、capture/artifact正文、lease secret、host/path/process/network detail和
query selection不进入 image。

### 98.3 Accepted cleanup source proof 与 candidate

cleanup mutation owner必须在同一 UoW 先完成 canonical guard / owner / redline / relation transition，再构造 accepted proof。proof
携带的是当前完整 source generation，不是 Query 的 current/exact selection proof：

```rust
/// staged cleanup source group通过完整关系校验后的binding-free application carrier。
pub struct CleanupReadinessCheckedMaterializationSource {
    source_position: SandboxStatusTargetPosition,
    guard: CleanupReadinessGuardSnapshot,
    owners: CleanupOwnerStatusSnapshot,
    relation_proof: CleanupReadinessRelationProof,
    scope_truth_cursor: SandboxTruthCursor,
    materialization_sources: CleanupReadinessMaterializationSourceSet,
    source_audit_trace_ref: SandboxAuditTraceRef,
    source_observed_at: Timestamp,
}

impl CleanupReadinessCheckedMaterializationSource {
    pub(crate) fn try_from_staged_source_group(
        source_position: SandboxStatusTargetPosition,
        guard: CleanupReadinessGuardSnapshot,
        owners: CleanupOwnerStatusSnapshot,
        relation_proof: CleanupReadinessRelationProof,
        scope_truth_cursor: SandboxTruthCursor,
        materialization_sources: CleanupReadinessMaterializationSourceSet,
        source_audit_trace_ref: SandboxAuditTraceRef,
        source_observed_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}

pub struct AcceptedCleanupReadinessSourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    cleanup_guard_ref: CleanupGuardRef,
    source_position: SandboxStatusTargetPosition,
    scope_truth_cursor: SandboxTruthCursor,
    materialization_sources: CleanupReadinessMaterializationSourceSet,
    source_audit_trace_ref: SandboxAuditTraceRef,
    checked_source: CleanupReadinessCheckedMaterializationSource,
}

pub struct CleanupReadinessMaterializationCandidate {
    image: CleanupReadinessMaterializationImage,
    binding: CleanupReadinessViewBinding,
}

impl CleanupReadinessMaterializationCandidate {
    pub(crate) fn try_from_accepted_source(
        view_ref: CleanupReadinessViewRef,
        accepted: &AcceptedCleanupReadinessSourceProof,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}
```

accepted proof的 construction gate固定为：

1. `transaction_ref`、family、context、guard、assigned truth cursor、source audit和source position全部与当前 UoW / caller
   exact match；`materialization_sources`非空且每个 source cursor等于 `scope_truth_cursor`。
2. `checked_source`必须由binding-free factory重跑Step 6 guard/owner/relation/phase/redline progression同一个private validation
   kernel；`source_position`来自canonical context-current guard relation，不能从Query absence或reader binding proof构造。
3. guard evidence、accepted coverage、owner status、current redline status、release relation均来自同一 staged generation；
   binding watermark上的任何缺行、duplicate、late cursor或 half-commit都拒绝。
4. pre-authorization phase要求 relation set为空且 `release_progress=NotAuthorized`；authorization、failure、completion和
   post-release hold必须保留同一 attempt 的历史 relation rows，不能只保存当前 owner status。
5. new guard source必须包含 `CleanupGuard` materialization source；只改变已授权 guard下的 strictly-late redline或同guard
   preservation/investigation source时，才允许 redline-only source set，并且 source position必须是 `Historical` 或 current
   owner明确的 current exact target，不能把 old guard变成新 guard。
6. source image中的 `readiness_phase`、effective blockers、`is_current`、`is_degraded`、`has_unsafe_or_incomplete_cleanup`均不
   作为 proof字段；它们只能由 checked source factory得到。

candidate factory只机械复制 checked source 的 canonical fields，预分配新的 `CleanupReadinessViewRef`，并验证：
`materialized_at >= source_observed_at`；binding context/guard/view/cursor/source set/audit/time与 proof 完全相等；新 view ref 在
image、binding、exact-latest和context-current索引 namespace 中均为零。candidate不接收 reader selector、page request、read gap、
public DTO或 caller release bool。

binding-free factory与Step 6 `CleanupReadinessSourceSnapshot::complete`必须共享同一个private relation-validation kernel；前者校验
guard/owners/relation/source metadata，后者在此基础上额外校验selection/binding与reader observation。两条路径对相同canonical
source fields必须产生相等phase、effective blockers和closure结论，禁止复制两套逐渐漂移的规则。

### 98.4 First proof、generic exact-target与context-current expectation

```rust
pub struct CleanupReadinessFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    cleanup_guard_ref: CleanupGuardRef,
    formal_guard_owner_count: u64,
    exact_image_history_count: u64,
    exact_binding_count: u64,
    exact_latest_pointer_count: u64,
    context_current_pointer_count: u64,
    source_relation_count: u64,
}

pub struct CleanupReadinessContextCurrentRow {
    context_ref: ControlledExecutionContextRef,
    cleanup_guard_ref: CleanupGuardRef,
    binding: CleanupReadinessViewBinding,
}

pub enum CleanupReadinessContextCurrentPlan {
    InstallFromAbsent,
    ReplaceCurrent {
        expected: Versioned<CleanupReadinessContextCurrentRow>,
    },
    PreserveAbsent,
    PreserveOther {
        observed: Versioned<CleanupReadinessContextCurrentRow>,
    },
}

pub struct CleanupReadinessIndexExpectation {
    context_current: CleanupReadinessContextCurrentPlan,
}

impl SandboxStatusViewMaterializationFamily for CleanupReadinessMaterializationFamily {
    type Candidate = CleanupReadinessMaterializationCandidate;
    type Binding = CleanupReadinessViewBinding;
    type ViewRef = CleanupReadinessViewRef;
    type FirstTargetProof = CleanupReadinessFirstMaterializationProof;
    type IndexExpectation = CleanupReadinessIndexExpectation;
    type AcceptedSourceProof = AcceptedCleanupReadinessSourceProof;
}
```

first proof只允许 canonical cleanup guard owner形成，不能从 `CurrentAbsent`、`ExactAbsent`、`NotFound`、空 blocker或 Query
historical read转换。合法 first 的 exact dimensions固定为：formal guard owner=`1`，exact image/binding/latest/source relation/
new member namespace=`0`。generic `FirstForFormalTarget`据此原子执行exact-target insert；replacement则只由generic
`ReplaceExactTarget { expected: Versioned<CleanupReadinessViewBinding> }`承载exact-target CAS。
`context_current_pointer_count`不属于 first zero proof的固定项：它可以是 `0`，也可以是 `1` 指向另一个完整旧 guard。若已有
current pointer，必须由 `PreserveOther` 或 `ReplaceCurrent` 携带该context-current row在同一 UoW 读取的独立 Version；旧 guard
不得等于 candidate guard。

expectation矩阵如下：

| source target | generic target expectation | context-current plan | allowed effect |
|---|---|---|---|
| new guard becomes current | `FirstForFormalTarget(first_proof)` | `InstallFromAbsent` 或 `ReplaceCurrent` | insert new exact binding，安装/替换 context current。 |
| new guard is historical | `FirstForFormalTarget(first_proof)` | `PreserveAbsent` 或 `PreserveOther` | 只安装 exact guard latest，不移动 context current。 |
| existing guard remains current | `ReplaceExactTarget(expected_exact_binding)` | `ReplaceCurrent(expected_context_row)` | generic target与context-current分别CAS到新binding。 |
| existing guard is historical | `ReplaceExactTarget(expected_exact_binding)` | `PreserveAbsent` 或 `PreserveOther` | 只CAS exact guard latest；不得提升为current。 |

`PreserveOther`要求 observed target 明确不同于 candidate guard且 context 相同；`PreserveAbsent`只有同一 snapshot 完整证明
current index为零时合法。source position、candidate guard、target/index plan必须三方一致：current source 不得 preserve，historical
source不得 replace另一个 current guard，writer不得按 timestamp/ref选择 winner。exact-latest 的 `Versioned<Binding>`只来自generic
target expectation；context-current 的 `Versioned<Row>`只来自family index expectation。两者必须来自同一 write UoW 的各自exact
pointer read；不能把 binding Version、guard Version、truth cursor或一个 pointer Version套给另一行。

replacement必须确认 old binding 指向完整 old image/relation group，new source cursor严格推进，new view ref不同；CAS conflict 后
旧 candidate、guard decision、relation assumptions和 staged member全部作废，owner必须从 fresh exact read重新运行完整 guard/source
flow。writer不能只重载 context current、复用旧 candidate或把 loser image保留为历史成功。

### 98.5 Cleanup atomic stage 与 inspection key

cleanup named writer的共同 stage算法固定如下，method名称和错误映射在 S3-P4 统一注册：

```text
validate accepted cleanup proof/candidate/expectation/UoW identity
  -> exact-read guard target, exact-latest pointer and context-current pointer
  -> checked-decode evidence, guard, owner, complete redline coverage/status and relation rows
  -> verify phase/progress/owner closure/redline progression/half-commit matrix
  -> stage immutable evidence/owner/redline/relation member images under new view_ref
  -> stage cleanup image header and immutable binding/materialization source set
  -> insert exact-latest or CAS exact-latest pointer
  -> install/replace/preserve context-current with its own expectation
  -> stage source-cursor/audit-to-view relation and exact/current history rows
  -> exact staged-overlay re-read of both pointers and complete source group
  -> return StagedSandboxStatusViewWrite; never commit
```

最低 atomic group 包含：changed cleanup guard/evidence/owner/redline/relation truth、source audit、new immutable image及所有 nested
member rows、immutable binding、exact-guard history/latest pointer、context-current pointer或其明确 preserve proof、materialization
source relation，以及原 operation 要求的 stored/idempotency/relay/stale members。任何 binding-first、context-current-only、relation-late、
owner-row-only或 guard/image 半组可见性均为 integrity violation。

cleanup whole-group inspection 必须冻结以下 key：operation/reservation ref、context ref、guard ref、source truth cursor、source audit
ref、new view ref、old exact binding及其 Version（replacement）、old context-current binding及其独立 Version（需要替换时）、image/evidence/
owner/redline/relation namespaces及 expected counts、materialization source-set key、exact-latest key、context-current key、history relation
key和 stored/idempotency owner key。只看到 guard row、view binding、exact pointer或context pointer任一子集都不能判定
`Committed`；old current 保留而 new exact group缺失、new exact group完整但 context pointer CAS未知、relation half-commit或两 pointer
指向不同 generation均为 `Indeterminate`。

### 98.6 Cleanup P2 static check

| check | result |
|---|---:|
| exact logical target / current selector | `(context, guard)` exact + `context` current=`2/2` |
| independent mutable pointer Versions | generic target/context-current=`2/2`；index重复exact Version=`0`；shared Version=`0` |
| durable image source coverage | evidence/guard/owner/redline/relation/binding=`6/6` |
| reader-only fields persisted | selector/position/absence/page/gap/phase/query outcome=`0/7` |
| optional owner cardinality | lease/orphan lineage-to-row relation=`2/2` |
| redline coverage | complete `0..n` coverage + ordered status isomorphism=`2/2` |
| release relation | authorization/completion/failure history retained and mutually checked=`1/1` |
| half-commit redline | `Allowed + completion` and terminal owner mismatch rejected=`2/2` |
| first/replacement | formal first + dual pointer plans=`2/2` |
| stage lifecycle / external calls | begin/cursor/commit/rollback/reaper/release/investigation=`0/0/0/0/0/0/0` |
| new upstream blocker | `0` |

## Historical-Position Working Marker: `7R-04A-A3-2-S3-P2` cleanup content completed

本段因同形锚点写入到文档前部，只保留为historical execution marker，不是current recovery authority。S3-P2是否激活必须以
本文物理EOF override为准；以下当时状态不覆盖后续P3/P4恢复点。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_internal_task = A3-2-S3-P3 redline writer contract
a3_2_s3_status = in_progress_p1_p2_completed
a3_2_s3_p1_failure_control = completed
a3_2_s3_p2_cleanup = completed
a3_2_s3_p3_redline = pending
a3_2_s3_p4_methods_inspection_parity_audit_sync = pending
status_view_family_payload_total = 7/8
safety_named_writer_methods = 0/3
safety_whole_group_inspection_keys = 2/3_payload_defined
formal_03_writeback = forbidden
new_l1_l2_blocker = 0
next_allowed_action = write_A3_2_S3_P3_redline_only
commit_required = no
```

## Historical-Position Working Draft: A3-2-S3-P3 Redline Containment Writer

### 99.1 Exact target、complete-source hard gate 与禁止的 latest 语义

redline status-view 的 logical target 和唯一 mutable pointer key 都固定为 exact
`(ControlledExecutionContextRef, RedlineContainmentRef)`。同一 context 可以有 `0..n` 条独立 containment；不同
`redline_ref` 的 pointer、binding、image、truth和retention lifecycle互不替换。本family不存在 context-current、context-latest、
kind-latest或single-active redline pointer，也没有 historical preserve plan。

```text
RedlineContainmentMaterializationImage(view_ref)
  + immutable RedlineContainmentViewBinding(context_ref, redline_ref, view_ref)
  + immutable exact history relation(context_ref, redline_ref, view_ref)
  + one mutable exact-current row((context_ref, redline_ref) -> binding, Version)
```

每次 accepted detection、containment、preservation、matching investigation observation、Released或Terminal transition实际改变
current read source时，创建新的immutable image/binding并移动该 exact pointer。old image/binding/history保留给retention内的audit /
reconciliation，不由 public Query回退选择。duplicate-equal source mutation由canonical operation/idempotency owner零业务写返回，
不得创建“相同内容的新view”；不同source cursor的accepted transition即使public status相同，也必须形成新generation。

writer只接受完整security source。reader允许的`Disposition`或`ProjectionSource` gap、degraded reason、no-view outcome、selector、
binding selection、absence proof和query observation都不能转换为writer input。`HandoffPending`本身是完整canonical truth；完整source
中的disposition可以合法为`NotCommitted`，但不能是因读取失败而缺失的`None`。`RedlineContainmentPhase`、
`RedlineDispositionAssessment`和helper boolean全部由checked source重新派生，不持久化为第二状态。

### 99.2 Binding-free checked materialization source

Step 6 `RedlineContainmentSourceSnapshot`包含已经命中current binding的reader selection，因此first materialization不能直接消费它。
application增加一个crate-private binding-free carrier；它复用Step 6 source factory的private relation-validation kernel，只删除
reader selection/read-gap，不放宽任何security field：

```rust
/// canonical redline source group已staged且完整校验后的binding-free carrier。
pub struct RedlineContainmentCheckedMaterializationSource {
    context_ref: ControlledExecutionContextRef,
    redline_ref: RedlineContainmentRef,
    guard_ref: RedlineContainmentGuardRef,
    redline_kind: RedlineKind,
    lineage: RedlineContainmentLineage,
    detection_source: RedlineDetectionSourceSnapshot,
    containment_proof: RedlineContainmentProofState,
    containment_status: RedlineContainmentStatus,
    status_reason: SandboxReason,
    preservation: RedlinePreservationSourceSnapshot,
    investigation: RedlineInvestigationObservationSnapshot,
    disposition: RedlineDispositionProofSnapshot,
    timeline: RedlineContainmentTimelineSnapshot,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    source_observed_at: Timestamp,
}

impl RedlineContainmentCheckedMaterializationSource {
    #[allow(clippy::too_many_arguments)]
    pub(crate) fn try_from_staged_source_group(
        context_ref: ControlledExecutionContextRef,
        redline_ref: RedlineContainmentRef,
        guard_ref: RedlineContainmentGuardRef,
        redline_kind: RedlineKind,
        lineage: RedlineContainmentLineage,
        detection_source: RedlineDetectionSourceSnapshot,
        containment_proof: RedlineContainmentProofState,
        containment_status: RedlineContainmentStatus,
        status_reason: SandboxReason,
        preservation: RedlinePreservationSourceSnapshot,
        investigation: RedlineInvestigationObservationSnapshot,
        disposition: RedlineDispositionProofSnapshot,
        timeline: RedlineContainmentTimelineSnapshot,
        source_truth_cursor: SandboxTruthCursor,
        source_audit_trace_ref: SandboxAuditTraceRef,
        source_observed_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}
```

factory按Step 6 §16.7.3~§16.7.11执行完整closed validation：

1. context/redline、strict guard、lineage、detection source、containment proof、preservation、investigation和disposition中的所有
   exact refs逐项相等；impact/run/boundary/handle/generation shape完整。
2. detection source三分支与八类redline kind的映射完整；forbidden body只保存typed source与safe summary，不保存marker/body。
3. `Detected`只允许`NotContained + NotRecorded + NotObserved + NotCommitted`；`Contained`要求stop-new-use proof且尚无
   preservation；`HandoffPending`要求proof与preservation；`Released | Terminal`要求matching terminal disposition proof。
4. containment proof中的Redline failure、run termination/terminal preservation、boundary Failed或authorized-teardown race关系
   完整；late redline不能覆盖prior boundary failure或撤销已授权teardown。
5. preservation material的formal owner、status/handoff ref、truth cursor、audit与time满足单调矩阵；不scan latest material。
6. investigation严格要求`NotObserved | Pending | Accepted | Blocked | Failed`；不存在`NotRequired`成功分支，observation必须绑定
   exact current preservation。
7. disposition `NotCommitted | Released | Terminal`与canonical status、guard、preservation、investigation、cursor/audit/time完全
   一致；ReleaseCandidate/TerminalCandidate不被当作committed transition。
8. timeline与全部child cursor/time不晚于source watermark/observation；known contradiction返回integrity，不能构造gap。

该factory与Step 6 `RedlineContainmentSourceSnapshot::complete`共享同一个private kernel。reader factory在上述结果上额外校验
selection/binding与reader observed time；相同canonical fields必须派生相同phase、assessment和cleanup-blocking结论。infra不能复制一套
“durable宽松规则”。

### 99.3 Durable redline image 与 checked rehydration

durable image保存完整、body-free canonical source字段，不保存 public view body或 transient source helper：

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RedlineContainmentMaterializationImage {
    view_ref: RedlineContainmentViewRef,
    context_ref: ControlledExecutionContextRef,
    redline_ref: RedlineContainmentRef,
    guard_ref: RedlineContainmentGuardRef,
    redline_kind: RedlineKind,
    lineage: RedlineContainmentLineage,
    detection_source: RedlineDetectionSourceSnapshot,
    containment_proof: RedlineContainmentProofState,
    containment_status: RedlineContainmentStatus,
    status_reason: SandboxReason,
    preservation: RedlinePreservationSourceSnapshot,
    investigation: RedlineInvestigationObservationSnapshot,
    disposition: RedlineDispositionProofSnapshot,
    timeline: RedlineContainmentTimelineSnapshot,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    source_observed_at: Timestamp,
}

impl RedlineContainmentMaterializationImage {
    pub(crate) fn try_from_checked_materialization_source(
        view_ref: RedlineContainmentViewRef,
        source: &RedlineContainmentCheckedMaterializationSource,
    ) -> Result<Self, SandboxStatusViewStageError>;

    pub(crate) fn try_rehydrate_source(
        &self,
        selection: RedlineContainmentBindingSelectionProof,
        observed_at: Timestamp,
    ) -> Result<RedlineContainmentSourceSnapshot, SandboxStatusViewStageError>;
}
```

lineage、detection、proof、preservation、investigation、disposition和timeline在logical image中使用contracts-owned body-free carrier；
durable adapter仍须为每个closed union提供tagged field codec，并在decode后重新调用其checked constructor。它不能把Rust private
field memory layout或整个source snapshot直接serde。嵌套的preservation/disposition重复引用必须在decode时逐字段相等；不能用一份
child覆盖另一份不一致字段。

rehydration顺序固定为：decode typed refs/enums/time -> detection factory -> lineage factory -> failure/containment proof factory ->
preservation material/source factory -> investigation factory -> disposition factory -> timeline factory -> binding relation ->
`RedlineContainmentSourceSnapshot::complete`。`selection`必须由同一reader snapshot的exact pointer lookup形成；`observed_at`不得早于
binding/image所有time。任一步失败均为integrity/application error，不得回退old image、默认`NotObserved/NotCommitted`或构造
degraded source。

image禁止保存raw boundary/backend event、high-risk policy body、forbidden marker/body、material locator/digest/body、stdout/stderr、
investigation case/ticket/receipt body、host/path/PID/network endpoint、credential、operator note、evidence alias、test/run/signoff字段。

### 99.4 Accepted source proof、candidate 与 coverage membership

```rust
pub struct AcceptedRedlineContainmentSourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    redline_ref: RedlineContainmentRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    checked_source: RedlineContainmentCheckedMaterializationSource,
}

pub struct RedlineContainmentMaterializationCandidate {
    image: RedlineContainmentMaterializationImage,
    binding: RedlineContainmentViewBinding,
}

impl RedlineContainmentMaterializationCandidate {
    pub(crate) fn try_from_accepted_source(
        view_ref: RedlineContainmentViewRef,
        accepted: &AcceptedRedlineContainmentSourceProof,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}

/// exact redline是context完整coverage中的独立成员；不是context-latest选择器。
pub struct RedlineContainmentCoverageMembershipProof {
    context_ref: ControlledExecutionContextRef,
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    boundary_ref: CoherentBoundaryRef,
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    generation_ref: ResourceRef,
    redline_ref: RedlineContainmentRef,
    formal_redline_owner_count: u64,
    exact_membership_count: u64,
    coverage_truth_cursor: SandboxTruthCursor,
}

pub struct RedlineContainmentIndexExpectation {
    coverage_membership: RedlineContainmentCoverageMembershipProof,
}
```

accepted proof只能由redline detection/containment/preservation/investigation/disposition canonical mutation winner形成。constructor必须
证明同一UoW中 matching source truth、required Redline failure、run/boundary relation、material/preservation、investigation summary、
terminal proof与business audit已stage或以same-generation exact owner存在；UoW assigned cursor与proof/source cursor完全相等。
external boundary observation、material handoff或investigation调用必须在进入本post-call UoW前完成，不能在持有accepted context时await。

candidate factory机械生成image与Step 6 binding，要求view/context/redline/cursor/audit/time逐项一致，
`materialized_at >= source_observed_at`，new view ref在image/binding/history/source relation namespace计数全零。candidate不接收
selector、absence、gap、public status、cleanup bool或external result。

coverage membership proof由canonical context-redline coverage index的read-your-staged-write inspection形成。formal owner和exact
membership count必须均为1；lineage五项与accepted source完全相等；`coverage_truth_cursor <= source_truth_cursor`。首次detection可在
同一UoW insert membership，后续transition只观察既有membership。该proof不提供winner语义，不包含其它redline body，也不允许writer
删除、替换或重排同context的其它member。

late redline若使已存在current cleanup guard的完整redline coverage/read source发生变化，source owner必须在同一whole UoW另行形成
`AcceptedCleanupReadinessSourceProof`并调用cleanup具名writer；redline writer本身不调用cleanup writer、不改写authorization或
release proof。没有current cleanup guard时不伪造cleanup materialization；已有guard但无法形成完整cleanup source时，whole mutation
必须fail closed，不得只提交redline binding后让cleanup projection长期遗漏该containment。

### 99.5 First/replacement expectation 与 exact-pointer stage

```rust
pub struct RedlineContainmentFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    redline_ref: RedlineContainmentRef,
    formal_redline_owner_count: u64,
    exact_image_history_count: u64,
    exact_binding_count: u64,
    exact_current_pointer_count: u64,
    source_relation_count: u64,
}

impl SandboxStatusViewMaterializationFamily for RedlineContainmentMaterializationFamily {
    type Candidate = RedlineContainmentMaterializationCandidate;
    type Binding = RedlineContainmentViewBinding;
    type ViewRef = RedlineContainmentViewRef;
    type FirstTargetProof = RedlineContainmentFirstMaterializationProof;
    type IndexExpectation = RedlineContainmentIndexExpectation;
    type AcceptedSourceProof = AcceptedRedlineContainmentSourceProof;
}
```

first proof只能由formal exact containment owner形成，不能从`ExactAbsent`、`NotFound`、context redline count、cleanup blocker或
operator flag转换。合法first要求formal owner=1且该exact target的image history/binding/current pointer/source relation=
`0/0/0/0`；new view member namespace也为0。它不要求同context其它redline count为0，且writer不得读取“single current”索引。

replacement使用`ReplaceExactTarget { expected: Versioned<RedlineContainmentViewBinding> }`。expected value/version只能来自当前
write UoW exact `(context, redline)` pointer read；old binding必须指向完整old image/history/source relation，new cursor严格大于old
cursor，new view ref不同。redline只有这一条mutable row，因此不存在第二个context Version或双CAS。first race和replacement CAS loser
都使candidate、guard decision、external observation mapping与staged assumptions全部作废，必须从fresh owner flow重跑。

stage算法固定如下：

```text
validate accepted proof/candidate/target expectation/UoW identity
  -> exact-read formal redline owner and exact coverage membership
  -> exact-read only (context_ref, redline_ref) current pointer
  -> checked-decode containment/failure/boundary/run/preservation/investigation/disposition source
  -> verify complete source, cursor/audit/time and new view namespace absence
  -> stage immutable redline image + immutable binding + exact history relation
  -> insert-if-absent or CAS the one exact-current pointer
  -> stage source-cursor/audit-to-view relation
  -> exact staged-overlay re-read of source/image/binding/history/pointer/relation
  -> return StagedSandboxStatusViewWrite; never commit
```

minimum atomic group包含：changed redline truth、strict guard relation、matching failure、run/boundary stop-new-use relation、preservation
material、investigation observation、optional terminal disposition、coverage membership、source audit、new image/binding/history、exact pointer、
source relation，以及operation required stored/idempotency/relay/stale members。writer只stagematerialization members；canonical source owner
stage其余成员并commit。任何truth-only、binding-first、pointer-only、missing proof/material/investigation或late coverage可见性都是
integrity violation。

whole-group inspection key至少冻结：operation/reservation ref、context/redline/guard refs、source truth cursor/audit ref、new view ref、
expected old binding identity（replacement）、image/binding/history/exact-current/source relation keys、coverage membership key、matching
failure/run/boundary/preservation/investigation/disposition exact keys及stored/idempotency owner key。命中另一个redline pointer不能证明或
否定本exact operation；任一half-member、duplicate exact current、wrong generation或repository unavailable均为Indeterminate。

### 99.6 Redline P3 static check

| check | result |
|---|---:|
| logical target / mutable pointer | exact `(context, redline)`=`1/1` |
| context-latest/kind-latest/single-active pointer | `0/0/0` |
| durable complete source fields | lineage/detection/proof/status/preservation/investigation/disposition/timeline=`8/8` |
| reader-only fields persisted | selector/selection/absence/gap/degraded reason/phase/assessment=`0/7` |
| binding-free first construction | checked materialization source + shared private kernel=`2/2` |
| first exact zero dimensions | image/binding/pointer/source relation/new namespace=`5/5` |
| replacement Version | one exact same-UoW Version；other redline pointer writes=`0` |
| late cleanup linkage | conditional second typed proof/method required；authorization overwrite=`0` |
| security body redline | raw body/locator/host/path/process/network/investigation body=`0` |
| writer lifecycle/external | begin/cursor/commit/rollback/backend/material/investigation/cleanup=`0/0/0/0/0/0/0/0` |
| new upstream blocker | `0` |

## Historical-Position Working Marker: `7R-04A-A3-2-S3-P3` redline content completed

本段因同形锚点写入到文档前部，只保留为historical execution marker，不是current recovery authority。P3的current激活和下一合法
动作必须以本文物理EOF override为准；以下当时状态不覆盖后续P4恢复点。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_internal_task = A3-2-S3-P4 methods inspection parity audit sync
a3_2_s3_status = in_progress_p1_p2_p3_completed
a3_2_s3_p1_failure_control = completed
a3_2_s3_p2_cleanup = completed
a3_2_s3_p3_redline = completed
a3_2_s3_p4_methods_inspection_parity_audit_sync = pending
status_view_family_payload_total = 8/8
safety_named_writer_methods = 0/3
safety_whole_group_inspection_keys = 3/3_payload_defined
formal_03_writeback = forbidden
new_l1_l2_blocker = 0
next_allowed_action = write_A3_2_S3_P4_only
commit_required = no
```

## Historical-Position Working Draft: A3-2-S2 Capture/Handoff Family Payload

### HP-S2.5 Capture source ownership 与 durable image

`CaptureFact`是immutable truth，同一run只能由canonical run-to-capture relation绑定一个committed capture；但
`CapturedMaterialStatus`与capture-source `ObservabilityMaterialStatus`在handoff/retention lifecycle中独立推进，因此同一
`CaptureFactRef`的caller-safe read source可以真实变化。capture status writer允许替换exact capture的latest materialization，
但绝不创建/替换run-to-capture canonical relation，也不修改immutable capture fact。

capture durable image保存Step 6完整read source所需caller-safe rows；`material_deliveries`不适用于capture。image中material
statuses与observability status必须完整覆盖fact声明的expected keys/ref，不能保存partial source后让Query补齐：

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummaryMaterializationImage {
    lineage: CaptureViewLineage,
    completeness_guard_ref: CaptureCompletenessGuardRef,
    collection_disposition: CaptureCollectionDisposition,
    output_summary: Option<CaptureOutputSummaryItem>,
    expected_material_keys: CapturedMaterialKeySet,
    material_statuses: CaptureMaterialStatusItemSet,
    material_gaps: CaptureMaterialGapSummarySet,
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    expected_observability_material_ref: ObservabilityMaterialRef,
    observability_status: CaptureObservabilityStatusItem,
    capture_status: CaptureFactStatus,
    status_reason: Option<SandboxReason>,
    source_reason: Option<SandboxReason>,
    completeness_evaluated_at: Timestamp,
    captured_at: Timestamp,
    audit_trace_ref: SandboxAuditTraceRef,
    observed_at: Timestamp,
}

impl CaptureSummaryMaterializationImage {
    /// source必须通过Step 6 factory且`is_complete_read_source()==true`。
    pub(crate) fn try_from_complete_source(
        source: &CaptureSummarySourceSnapshot,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 重建时重新验证lineage、expected/material/gap/observability/status/time全矩阵。
    pub(crate) fn try_rehydrate_source(
        &self,
    ) -> Result<CaptureSummarySourceSnapshot, CaptureSummaryViewError>;
}

pub struct AcceptedCaptureSummarySourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    run_ref: ControlledExecutionRunRef,
    capture_ref: CaptureFactRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    checked_source: CaptureSummarySourceSnapshot,
}
```

image把Step 6 source中的optional observability row收紧为required row，因为writer只接受完整source；rehydrator再以
`Some(observability_status)`调用Step 6 factory。image不单独保存`is_complete_read_source` boolean，也不保存由factory可机械
判断的material coverage counts。codec decode后必须重跑factory和complete predicate，不能相信旧schema中的cached bool。

accepted proof只由两类canonical owner形成：capture finalization winner，或同一capture的material/observability lifecycle
accepted transition确实改变完整read source的winner。proof factory必须在同一UoW证明：

1. global run与immutable capture owner各1，run-to-capture relation恰为1且指向exact capture；context/run/capture/generation与
   `CaptureViewLineage`全等。
2. immutable fact、completeness guard、output summary、expected key/gap/forbidden marker set、全部expected material status rows、
   exact observability row与matching audits均可由read-your-staged-write组成一个完整Step 6 source。
3. `checked_source.is_complete_read_source()==true`，source audit等于proof audit，UoW assigned cursor等于proof cursor；
   `observed_at`覆盖本次所有changed child rows。
4. capture finalization first branch的run-to-capture relation由source owner stage；lifecycle branch必须读取既有relation且不写它。
5. artifact body、locator、provider response、formal artifact/evidence ref、handoff receipt body均未进入source/image/proof。

仅capture fact存在、material index unavailable、observability row missing、unknown material key、mixed cursor或adapter collection
success bool都不能形成proof。capture/handoff external call必须在proof形成前已经由其它UoW提交observation；writer context内不外呼。

### HP-S2.6 Capture candidate、first proof 与 index expectation

```rust
pub struct CaptureSummaryMaterializationCandidate {
    view_ref: CaptureSummaryViewRef,
    image: CaptureSummaryMaterializationImage,
    binding: CaptureSummaryViewBinding,
}

impl CaptureSummaryMaterializationCandidate {
    pub(crate) fn try_from_accepted_source(
        view_ref: CaptureSummaryViewRef,
        proof: &AcceptedCaptureSummarySourceProof,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}

pub struct CaptureSummaryFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    run_ref: ControlledExecutionRunRef,
    capture_ref: CaptureFactRef,
    exact_image_history_count: u64,
    exact_binding_count: u64,
    exact_latest_pointer_count: u64,
    source_relation_count: u64,
}

/// immutable canonical run-to-capture relation只观察，不由status writer CAS。
pub struct CaptureRunTargetRelationProof {
    context_ref: ControlledExecutionContextRef,
    run_ref: ControlledExecutionRunRef,
    capture_ref: CaptureFactRef,
    run_count: u64,
    capture_count: u64,
    relation_count: u64,
}

pub struct CaptureSummaryIndexExpectation {
    run_target_relation: CaptureRunTargetRelationProof,
}
```

candidate factory要求binding的context/run/capture/view/cursor/audit/time与proof/image完全相等，`materialized_at >= observed_at`，
new view ref在image/binding/history中均为0。first proof只描述exact view materialization：formal capture owner=1，exact
image-history/binding/latest/source-relation固定`0/0/0/0`。run-to-capture relation不属于first status proof，因为capture
finalization owner可能已在本UoW stage它；`CaptureRunTargetRelationProof`统一要求read-your-staged-write看到
`run/capture/relation=1/1/1`且全部typed refs全等。

capture没有可替换的context-current status pointer。A2 `ForRun`先通过immutable run-to-capture relation选exact capture，再读取该
capture exact-latest binding；因此`CaptureSummaryIndexExpectation`只带relation proof。target mode矩阵：

| owner branch | target mode | exact-latest action | run-to-capture action |
|---|---|---|---|
| capture finalization首次完整materialization | `FirstForFormalTarget` | insert-if-absent new exact latest | source owner insert-if-absent；writer只验证1/1/1。 |
| material/observability lifecycle改变source | `ReplaceExactTarget` | 以same-UoW `Versioned<CaptureSummaryViewBinding>` CAS new binding | preserve existing immutable relation。 |

同一capture不允许第二次`FirstForFormalTarget`；first conflict不能降级为replace。replacement expected binding必须属于同一
context/run/capture，old/new view ref不同，new source cursor严格大于old binding cursor，且changed material/observability audit
与proof audit一致。run-to-capture指向另一capture、relation count 0/>1、capture owner缺失或view pointer存在但binding/image缺失
都是integrity failure，不形成absence/degraded。

capture atomic group至少包含：first时immutable capture/guard/output/expected sets与run-to-capture relation，或lifecycle时changed
material/observability owners；matching audits和truth cursor；完整new image、immutable binding、exact capture-view history、
exact-latest pointer、source cursor/audit relation；以及source operation required stored/idempotency/relay/stale members。writer不
stage canonical run-to-capture、material或observability owners，只重验后stagematerialization成员。

### HP-S2.7 Handoff durable image 与 derived delivery单一性

handoff canonical source随opening、attempt reservation、target observation、material lifecycle synchronization、cleanup block和
relay observation推进。同一`HandoffFactRef`允许多次exact-latest materialization；context current handoff可以指向该target、
从旧target切换到新target，或在historical target refresh时保持不变。

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusMaterializationImage {
    lineage: MaterialHandoffViewLineage,
    handoff_truth_cursor: SandboxTruthCursor,
    target_plan: HandoffTargetPlanStatusItemSet,
    source_material_keys: CapturedMaterialKeySet,
    target_progress: HandoffTargetProgressStatusItemSet,
    handoff_status: HandoffFactStatus,
    status_reason: Option<SandboxReason>,
    cleanup_guard_ref: Option<CleanupGuardRef>,
    relay_observations: HandoffRelayStatusObservationItemSet,
    opened_at: Timestamp,
    status_changed_at: Timestamp,
    last_audit_trace_ref: SandboxAuditTraceRef,
    observed_at: Timestamp,
}

impl MaterialHandoffStatusMaterializationImage {
    /// source必须完整；delivery set由Step 6 source constructor机械生成，不另存第二份。
    pub(crate) fn try_from_complete_source(
        source: &MaterialHandoffStatusSourceSnapshot,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    pub(crate) fn try_rehydrate_source(
        &self,
    ) -> Result<MaterialHandoffStatusSourceSnapshot, MaterialHandoffStatusViewError>;
}

pub struct AcceptedMaterialHandoffStatusSourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    handoff_ref: HandoffFactRef,
    position: SandboxStatusTargetPosition,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    checked_source: MaterialHandoffStatusSourceSnapshot,
}
```

image不持久化`material_deliveries`，因为Step 6明确它由complete plan/progress/source key set在constructor中机械形成。保存一份
delivery set会与progress产生第二truth；rehydrator必须调用`MaterialHandoffStatusSourceSnapshot::try_new`重新生成并验证
deliveries。image也不保存`has_complete_*`、`has_current_relay_observation`或aggregate derivation bool；decode后全部重算。

accepted proof只能由handoff opening、attempt reservation、target observation、cleanup-block change或matching current relay
observation的canonical mutation owner形成。proof factory要求同一UoW中：handoff fact、immutable complete target plan、完整
progress、source material/observability ownership relation、optional cleanup override、current cursor relay row、matching source audit
均完整；Step 6 source factory通过且`is_complete_read_source()==true`；source `handoff_truth_cursor`、proof cursor和UoW assigned
cursor三者相等；`last_audit_trace_ref`等于proof audit。position只从canonical context-current handoff relation得出，不按opened/
status_changed time或最后attempt选择。

publisher ack、delivery adapter observation、cleanup guard ref单项、aggregate status或relay row单项均不能构造proof。外部
observation必须先由source owner在post-call UoW经domain transition接受；writer只消费accepted source，不能调用publisher、
handoff adapter、capture reader、cleanup/release或retry。

### HP-S2.8 Handoff candidate、first proof 与 exact/current expectation

```rust
pub struct MaterialHandoffStatusMaterializationCandidate {
    view_ref: MaterialHandoffStatusViewRef,
    image: MaterialHandoffStatusMaterializationImage,
    binding: MaterialHandoffStatusViewBinding,
}

impl MaterialHandoffStatusMaterializationCandidate {
    pub(crate) fn try_from_accepted_source(
        view_ref: MaterialHandoffStatusViewRef,
        proof: &AcceptedMaterialHandoffStatusSourceProof,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}

pub struct MaterialHandoffStatusFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    handoff_ref: HandoffFactRef,
    exact_image_history_count: u64,
    exact_binding_count: u64,
    exact_latest_pointer_count: u64,
    source_relation_count: u64,
}

pub struct MaterialHandoffStatusContextCurrentRow {
    context_ref: ControlledExecutionContextRef,
    handoff_ref: HandoffFactRef,
    binding: MaterialHandoffStatusViewBinding,
}

pub enum MaterialHandoffStatusContextPointerPlan {
    Write(SandboxCurrentPointerWritePlan<MaterialHandoffStatusContextCurrentRow>),
    Preserve(SandboxCurrentPointerPreservePlan<MaterialHandoffStatusContextCurrentRow>),
}

pub struct MaterialHandoffStatusIndexExpectation {
    context_current: MaterialHandoffStatusContextPointerPlan,
}
```

candidate factory机械形成image与A2 binding，并要求binding cursor等于source `handoff_truth_cursor`；materialized time不得早于
source observation time。first proof要求formal handoff owner与complete plan存在，exact image-history/binding/latest/source
relation=`0/0/0/0`。context current是否已有旧handoff由index expectation独立表达。

handoff plan矩阵与boundary相同，但source position必须由handoff owner给出：

| accepted position | exact mode | context plan | behavior |
|---|---|---|---|
| Current | first | `Write(InstallFromAbsent|Replace old handoff)` | insert exact latest并安装/切换current。 |
| Current | replace | `Write(Replace same handoff current)` | exact latest和context current各自CAS到new binding。 |
| Historical | first | `Preserve(Absent|Other)` | insert historical exact latest；不移动current。 |
| Historical | replace | `Preserve(Absent|Other)` | refresh historical exact latest；不移动current。 |

opening新current handoff时允许context current替换另一个old handoff，但old handoff truth/image/binding/history保留；同一source
opening拒绝重复target identity。historical refresh必须有明确canonical reason：例如旧handoff late accepted observation仍属于其
exact aggregate，但context已经切换；writer不能把它重新提升为current。Current replacement的exact-latest与context-current
`Versioned`分别读取；即使两个row携带同一个binding，也不能共享Version。

replacement要求new truth cursor严格推进；first source cursor可以是该handoff opening UoW首次assigned cursor。relay set至少有
一项exact current cursor row；如果event relay canonical row按既有whole-group owner在同UoW staged，read-your-staged-write必须
看见它。publisher暂未投递可以是canonical Pending/Retryable row并形成完整source；“没有current relay row”不能成功materialize。

handoff atomic group至少包含changed handoff/progress/source-material lifecycle/cleanup override owners及relations、matching current
relay record/payload linkage、source audit/cursor、new image、immutable binding、exact history、exact-latest pointer、按plan optional
context-current pointer、source cursor/audit relation，以及operation stored/idempotency/relay/stale members。writer不创建relay
identity/payload、不推进material lifecycle，也不调用publisher；这些成员由source owner在调用writer前stage。

### HP-S2.9 P3 family registration 与局部静态审计

```rust
impl SandboxStatusViewMaterializationFamily for CaptureSummaryMaterializationFamily {
    type Candidate = CaptureSummaryMaterializationCandidate;
    type Binding = CaptureSummaryViewBinding;
    type ViewRef = CaptureSummaryViewRef;
    type FirstTargetProof = CaptureSummaryFirstMaterializationProof;
    type IndexExpectation = CaptureSummaryIndexExpectation;
    type AcceptedSourceProof = AcceptedCaptureSummarySourceProof;
}

impl SandboxStatusViewMaterializationFamily for MaterialHandoffStatusMaterializationFamily {
    type Candidate = MaterialHandoffStatusMaterializationCandidate;
    type Binding = MaterialHandoffStatusViewBinding;
    type ViewRef = MaterialHandoffStatusViewRef;
    type FirstTargetProof = MaterialHandoffStatusFirstMaterializationProof;
    type IndexExpectation = MaterialHandoffStatusIndexExpectation;
    type AcceptedSourceProof = AcceptedMaterialHandoffStatusSourceProof;
}
```

| P3 check | result |
|---|---:|
| family payload registration | `2/2`；S2累计`5/5` |
| durable image checked rehydration | `2/2` |
| complete source hard gate | capture/handoff `2/2` |
| duplicate derived body | capture none；handoff material delivery duplicate=`0` |
| canonical target relation | capture run-to-capture observed immutable；handoff context-current separate mutable |
| exact replacement | capture lifecycle yes；handoff lifecycle yes |
| historical exact update cannot move current | handoff enforced；capture不适用 |
| external/artifact body/receipt body access | `0/0/0` |
| new public callable / Query writer use | `0 / 0 of 13` |
| new L1/L2 blocker | `0` |

## Historical-Position Working State: `7R-04A-A3-2-S2-P3` capture/handoff completed

本节位于historical position，须由后续物理EOF current section显式激活。S2五类payload已达`5/5`；仍须P4定义五个
具名async stage method、逐family whole-group inspection key、durable/fake parity和static total audit，并同步
flow/ledger/`/tmp`后才能把S2标记完成。

```text
current_internal_task = A3-2-S2-P4 writer_inspection_parity_audit_sync
a3_2_s2_status = in_progress_p1_p2_p3_completed
a3_2_s2_p1_persistence_model = completed
a3_2_s2_p2_execution_boundary_policy = completed
a3_2_s2_p3_capture_handoff = completed
a3_2_s2_p4_writer_inspection_audit_sync = pending
primary_family_payload_coverage = 5/5
status_view_family_payload_total = 5/8
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
next_required_reads = S1_stage_error_unknown_parity|S2_P1_P2_P3|step7_uow_commit_unknown|A2_F1_F2_index_matrix
next_allowed_action = write_A3_2_S2_P4_only
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## Historical-Position Working Draft: A3-2-S2 Persistence Model

### HP-S2.1 开工门、输入与本批边界

用户确认已消费`A3-2-S1 completed_wait_user_review`门禁。本批只闭合execution、boundary、policy、capture、handoff五类
primary/lifecycle status-view materialization的candidate、formal-first proof、mutable index expectation、具名stage method、
atomic write set和commit-unknown inspection key。failure/control、cleanup、redline仍留给S3；projection、derived、comparison、
reconciliation/audit owner、Step 8与正式`03-详细设计.md`均不在本批。

本批已重新读取并服从以下current authority：

| input | consumed contract | S2 constraint |
|---|---|---|
| Step 6 execution/boundary source与view | `SandboxExecutionStatusSourceSnapshot`、`BoundaryStatusSourceSnapshot`是checked transient helper；两个view factory是visible status唯一推导者 | writer不能持久化helper、不能在infra重算visible/readiness status。 |
| Step 6 policy source与view | formal decision/action coverage构成唯一policy source；decision immutable | exact decision只first，不原地更新；后续evaluation创建新decision。 |
| Step 6 capture source与view | expected material key、available material status、gap、observability coverage均有closed relation | writer不得读取artifact body或用缺row补默认status；只接受完整checked source。 |
| Step 6 handoff source与view | plan、progress、material delivery、relay和truth cursor形成closed group | writer不得调用delivery/publisher/cleanup或用receipt重算aggregate。 |
| A2 F1/F2 binding与reader | immutable binding保存view ref、exact owner、source cursor/audit、materialized time；reader按exact/current index定位 | S2沿用这些binding，不重建第二套Query schema。 |
| S1 authorization/UoW | typed linear borrowed-UoW context；target与selector pointer expectation分离；writer只stage | 五类method都不能begin、commit、rollback、allocate cursor或调用external port。 |

### HP-S2.2 Historical conflict 与唯一持久化正文裁决

Step 6的五个`*SourceSnapshot`均明确是“从同一committed snapshot复制并经factory校验”的不可持久化helper；其目的在于把
repository rows重组成contracts factory输入。若infra直接serde这些helper，domain/private constructor与schema演进会被反向
绑死。另一方面，若同时保存public `*View`正文和一份source helper/body，两个副本会在status派生、coverage或reason上发生
漂移。因此以下旧理解登记为`historical_material`，不得进入实现：

| historical material | conflict | current ruling |
|---|---|---|
| “immutable view row就是序列化后的Step 6 source snapshot” | helper没有durable schema职责，也不能被adapter任意重建 | 保存family-specific `*MaterializationImage`，reader用checked rehydrator重建helper。 |
| “同时保存public view和source，reader任选其一” | 两份正文可独立漂移，visible status可能成为第二truth | public view永不作为durable source；service只调用Step 6唯一view factory。 |
| “binding本身被CAS替换” | A2 binding是immutable materialization fact，历史exact读取依赖其保留 | CAS对象是exact-latest/context-current index row；old binding与image永久保留。 |
| “缺行时保存degraded materialization” | row缺失或半组不是可接受source，degraded会掩盖integrity failure | writer只接受完整checked source；stale/degraded由reader相对新truth/依赖可用性形成。 |
| “infra补齐visible status或coverage字段” | infra会取得domain/view factory职责 | infra只校验refs、closed set coverage、cursor/audit/time与expectation，不派生业务状态。 |

这里没有新增上游blocker。需要的新类型都是L4 application/infra内部persistence contract，可由现有Step 6 carrier和Step 7
repository/UoW边界闭合；`BLK-SBX-CANONICAL-001`仍只是既有implementation gate。

### HP-S2.3 Durable materialization image、binding与mutable index分层

五类统一采用三层持久化，但不采用generic payload：

```text
family-specific immutable MaterializationImage
  key = typed view_ref
  body = reconstructable caller-safe source fields + exact source lineage

family-specific immutable ViewBinding
  key = exact logical target + view_ref
  body = A2 binding fields (view/owner/source cursor/source audit/materialized_at)

family-specific mutable latest/current index row
  key = exact target or context/run selector key
  body = immutable binding payload (or exact binding key) + row Version
```

`MaterializationImage`不是public view DTO，也不是domain truth。它只保存从一个accepted source group机械复制、且重建Step 6
checked source所必需的caller-safe typed refs、canonical statuses、closed sets、coverage relation和times。image不保存
`visible_status`、`can_show_*`、read gap、stale/degraded reason、Query selector、authorization、repository `Version`、raw external
body/error、audit event body、evidence alias或test字段。image constructor为crate-private，只接受对应Step 6 checked source和
matching accepted proof；infra只持久化已构造image，不能接收散装字段。

binding继续精确采用A2已定义的五种`*ViewBinding`。每次source truth实际变化都生成新的view ref、image和immutable binding；
同一exact target的“latest materialization”由mutable exact-latest row指向新binding。A2文中把found row简称为immutable binding
不表示该row自身承担CAS：repository读取mutable index row后，返回`Versioned<Binding>`，其中`value()`是该row携带的
immutable binding payload，`version()`只属于mutable index row。历史binding/image永不就地更新。

```rust
/// mutable pointer不存在，或必须以同一UoW读取的exact Version作CAS替换。
pub enum SandboxStatusViewPointerExpectation<T> {
    Absent,
    Replace { expected: Versioned<T> },
}

/// exact-target latest pointer中保存的family binding payload；row自身由repository赋Version。
pub struct SandboxStatusViewLatestIndexRow<B> {
    binding: B,
}

/// context/run selector current pointer只保存exact target与matching immutable binding payload。
pub struct SandboxStatusViewCurrentIndexRow<TargetRef, B> {
    target_ref: TargetRef,
    binding: B,
}
```

这两个generic shape仅表达repository内部机械row形状，不是public dispatch API。五类`IndexExpectation`仍须使用具名type alias或
newtype，确保错误的target/binding family不能通过编译。`Versioned<T>`只能由同一borrowed write UoW的exact pointer read返回；
candidate、A2 read proof、clock、cursor、row count或`Version(0)`均不能构造它。

### HP-S2.4 Image rehydration 与唯一 view factory

durable reader命中binding后按固定顺序处理：读取matching image；逐字段校验image key、binding owner/target、source cursor、
source audit与materialized time relation；调用family-specific checked rehydrator构造Step 6 `*SourceSnapshot`；最后由service调用
Step 6唯一`from_committed_snapshot`或`from_degraded_snapshot` factory。repository adapter不得直接构造public view。

| family | durable image必须保存的source fields | rehydration hard gate |
|---|---|---|
| execution | context、optional identity/boundary/policy/run/capture/failure/cleanup/redline ref-status pairs、required handoff knowledge、audit、observed time | 所有optional pair、run/capture/handoff dependency与success guard重新通过Step 6 source factory。 |
| boundary | boundary/context/identity/requirement、optional decision/capability/handle/lease、canonical boundary status、audit、observed time | exact boundary status matrix与handle/lease relation重新通过。 |
| policy | decision/snapshot/context/identity/requirement/boundary/handle/generation、decision status、完整action status set、audit、observed time | decision/action exact coverage与lineage重新通过。 |
| capture | complete `CaptureViewLineage`、guard/disposition/output、expected keys、完整material statuses/gaps/markers、observability、canonical status/reasons/times/audit | expected key、material、gap、observability与status matrix全部重新通过；image必须是完整read source。 |
| handoff | complete lineage、truth cursor、target plan/source keys、完整progress/mechanical deliveries输入、aggregate/reason/cleanup、current relay observations/times/audit | plan/progress/material delivery/aggregate/current relay exact coverage重新通过；image必须是完整read source。 |

candidate可以临时持有或按值消费已经由Step 6 factory校验的完整source，以便application构造image；durable image本身不得暴露
public转换为source的unchecked constructor。capture要求`is_complete_read_source()==true`；handoff要求
`is_complete_read_source()==true`；execution/boundary/policy要求所有当前source dependency完整。任何允许A2在读取时形成
`ReferenceState`、`RequiredHandoffKnowledge`、`MaterialCoverage`、`ObservabilityCoverage`、`ProgressCoverage`或
`CurrentRelayCoverage` gap的缺口，在写入时都不能冒充成功candidate。

stale/degraded是读取相对关系，不是writer可持久化的业务状态：binding cursor落后于reader required cursor时形成stale；
完整旧image仍可安全显示但body-free reference暂不可用时，reader按A2 closed gap形成degraded；binding/image/owner半组、unknown
child row或closed coverage损坏必须返回integrity error。writer不保存`StatusViewDegradedReasonSet`，也不为了构造“最新view”
读取尚未进入accepted source group的新truth。

## Historical-Position Working State: `7R-04A-A3-2-S2-P1` persistence model completed

本节位于historical position，须由后续物理EOF current section显式激活。S2已完成durable image/binding/index分层与
historical conflict裁决，五类candidate、expectation、method和inspection set尚未写完；不得把S2标记completed或同步正式
`03`。

```text
current_internal_task = A3-2-S2-P2 execution_boundary_policy contracts
a3_2_s2_status = in_progress_p1_completed
a3_2_s2_p1_persistence_model = completed
a3_2_s2_p2_execution_boundary_policy = pending
a3_2_s2_p3_capture_handoff = pending
a3_2_s2_p4_writer_inspection_audit_sync = pending
durable_source_snapshot_serde = forbidden_5_of_5
durable_public_view_body = forbidden_5_of_5
immutable_binding_vs_mutable_pointer = separated
formal_03_writeback = forbidden
new_l1_l2_blocker = 0
commit_required = no
```

## Historical-Position Foundation: A3-1 Reader Source 与 Necessary Writer Ownership Inventory

### 92.1 开工门禁、输入与本批边界

用户已经确认 A2-F5 复核门，允许进入 `7R-04A-A3`。本节先消费 Step 7 SOP、Step 6 current object contracts、
`03_ddd_step_07_repositories_uow_indexes.md` 的 UoW / `Versioned<T>` / `MUT-G20~G21` 契约、
`03_ddd_step_07_immutable_audit_relay_repositories.md` 的 reconciliation / audit owner，以及 Step 11 的原子可见性规则。
旧正式 `03`、旧 generic projection repository 和早先“只有 G20/G21 需要 writer”的判断均不作为 current authority。

本批只闭合 public Query 所依赖的 immutable read source 如何由显式 write owner 形成。它不新增第 43 个 public
application callable，不设计 scheduler、TTL、DDL、retention 数值、repair 算法、审查流程、测试流程或交付流程，
也不进入实现仓。八类 status-view writer 是 source mutation UoW 内的 staged capability；projection、derived、
comparison writer 是显式 maintenance capability；reconciliation 与 audit 只引用既有 owner。13 个 Query 的
write UoW、identity allocation、repair、business audit append和external call仍全部为零。

### 92.2 SOP 问题回答

| question | current answer |
|---|---|
| 哪个模块拥有 writer port | `application::ports::query_materialization` 拥有 status-view、projection、derived、comparison 的具名 writer；infra durable/fake 实现，不拥有业务判断。 |
| 谁可以调用 | 八类 status-view method 仅由已授权 source mutation group finalizer调用；projection/derived分别只由 Job 8/9 内部 kernel调用；comparison只由 accepted capability/reference source maintenance owner调用。 |
| Query 是否调用 | 否，`SandboxQueryService`、API、Worker、Jobs entry均不得持有 writer；Query writer method use=`0/13`。 |
| 输入真相从哪里来 | 复用 Step 6 canonical source snapshot、view factory、binding、materialization candidate和 accepted source relation；writer不重定义status、reason、selector或source set。 |
| identity 从哪里来 | 由匹配的 application identity allocator在写路径预生成 typed view/ref；reader、repository、fake和Query不得分配或从其它ref拼接。 |
| update version 从哪里来 | 只能来自同一 write UoW 中 exact current binding/root read返回的`Versioned<T>.version()`；selection version、timestamp、cursor和candidate字段均不能替代。 |
| first absence如何证明 | formal target/registry/source owner先给first eligibility，writer再在同一 write UoW原子重验target row、current binding和required relation全部absent；Query absence proof或`NotFound`不构成授权。 |
| 谁提交事务 | status-view writer只stage并把commit权留给source mutation owner；G20/G21/comparison的application maintenance kernel拥有item UoW；repository method自身不commit。 |
| commit unknown如何处理 | 冻结original operation及全部candidate identity，执行whole-group只读inspection；不能用内存candidate、expected version、局部row或binding推断成功。 |
| 异常/审查边界 | 只保留typed fail-closed、quarantine/reconciliation handoff和低基数diagnostic；不展开异常处置、审查、测试或交付第二主流程。 |

### 92.3 Historical 诊断与设计取舍

| diagnosis | risk | current disposition |
|---|---|---|
| 只把`SandboxReadProjection`和derived state视为materialized source | execution等八个Query binding无合法创建/替换owner，reader会被迫用`None`或query repair | 按Step 6 forward obligation恢复八个具名 status-view materialization method。 |
| 为13个Query各建一个writer | reconciliation/audit重复owner，Query与writer形成错误一一对应 | 按持久化truth分类；13个reader对应11个必要materialization surface + 2个既有owner引用。 |
| status writer自己begin/commit | source truth与view可能半提交，audit/stored/cursor owner重复 | writer只借用caller同一`&mut dyn SandboxUnitOfWork`并stage；source group拥有commit。 |
| generic `materialize(kind, payload)` | selector/source/output关系退化为运行时分派，fake可私自补字段 | 一个trait可聚合装配，但八个method、candidate、binding保持逐family具名。 |
| `NotFound -> first materialization` | selection/index损坏、并发winner或retention orphan会被覆盖 | first必须有formal target proof并在同UoW重验whole key absence。 |
| 把comparison塞进generic derived writer | comparison immutable row/current binding与Inspect/Preview/Trend state机混淆 | comparison保留Step 6 dedicated candidate/expectation/outcome和source maintenance caller。 |
| writer追加view-specific business audit | view成为第二业务subject并与source audit重复 | status/comparison row只链接accepted source mutation已有audit；required audit仍由source mutation owner创建。 |

采用的组织方式是“具名 capability + 共享事务纪律”。共享纪律只统一UoW、Version、first absence、CAS、rollback、
commit-unknown和parity；不会产生generic candidate、generic binding、generic status或generic repository payload。

### 92.4 13 Query Writer Necessity 与唯一 owner

| # | Query read source | 是否需要本A3 writer契约 | unique write owner / caller | A3 disposition |
|---:|---|---:|---|---|
| 1 | execution status view/binding | yes | 任何实际改变execution source chain的accepted source mutation group，在其同一UoW调用具名 execution status staged writer | A3-2闭合；Query use=0。 |
| 2 | boundary status view/binding | yes | boundary/handle/lease canonical mutation owner，在matching boundary group UoW调用具名 boundary status staged writer | A3-2闭合；不得从latest handle重建。 |
| 3 | policy decision summary view/binding | yes | `evaluate_policy_execution` immutable decision whole-group owner，在decision UoW调用具名 policy summary staged writer | A3-2闭合；不重评policy。 |
| 4 | capture summary view/binding | yes | capture/material canonical mutation owner，在capture或material relation实际变化的同一UoW调用具名 capture summary staged writer | A3-2闭合；不读取artifact body。 |
| 5 | material handoff status view/binding | yes | handoff opening/attempt/observation/cleanup-block mutation owner，在handoff group UoW调用具名 handoff staged writer | A3-2闭合；不调用delivery/publisher。 |
| 6 | failure/control immutable status snapshot | yes | failure/control canonical mutation owner，在merged index/summary/cross-link均可原子更新的同一UoW调用具名 failure-control staged writer | A3-2闭合；bounded reader不写。 |
| 7 | cleanup readiness view/binding | yes | cleanup/owner/redline change实际影响read source的canonical mutation owner，在safety group UoW调用具名 cleanup staged writer | A3-2闭合；不授权release。 |
| 8 | redline containment view/binding | yes | redline detection/containment/preservation/investigation/disposition mutation owner，在security group UoW调用具名 redline staged writer | A3-2闭合；unknown保持strict hold。 |
| 9 | `SandboxReadProjection` root/binding | yes | Job 8 `rebuild_sandbox_read_projections` 内部 `write_projection_materialization`，`MUT-G20`唯一owner | A3-3补port/request/result/error；Query不触发rebuild。 |
| 10 | derived state + materialization/status row/current binding | yes | Job 9 `maintain_derived_inspect_preview_trend` 内部 `write_derived_materialization`，`MUT-G21`唯一owner | A3-3补whole-group边界；只允许Inspect/Preview/Trend。 |
| 11 | capability comparison immutable row/current binding | yes | accepted capability/reference source maintenance owner调用`materialize_backend_capability_comparison` | A3-3消费canonical candidate/expectation/outcome；不并入G21。 |
| 12 | reconciliation report/finding/current binding bundle | no new writer | Job 10 `run_sandbox_reconciliation` canonical whole-group writer | A3-4只做可达性和零重复定义审计。 |
| 13 | subject-stable audit trace page | no new writer | 每个source mutation owner通过既有append-only audit repository在其required group追加 | A3-4只固定Query append=0和writer owner不迁移。 |

机械结论：13个Query source全部有明确write provenance；需要由A3继续补齐的reader-facing materialization能力为
`8 status-view methods + projection + derived + comparison = 11`，复用既有whole-group owner为
`reconciliation + audit = 2`。这里的11不是11个public facade，也不是11个独立scheduler；public callable仍为
`42/42`，新增public callable=`0`。

### 92.5 Status-view Caller Group 与原子归属

| status family | authorized source group examples | same-UoW required members | forbidden caller |
|---|---|---|---|
| execution | intake/identity、boundary、policy、run、capture/handoff、failure、cleanup、redline中实际改变execution source chain的winner | changed source owners + new immutable view row + exact/current binding + source audit linkage + index/cursor relation + existing operation stored/idempotency relation | Query、entry、diagnostic、reconciliation repair。 |
| boundary | boundary establishment/failure/release及matching handle/lease owner group | boundary/handle/lease/decision/capability relation + view/binding/index + source audit + operation relation | backend adapter、Query、latest scanner。 |
| policy | accepted policy evaluation group | applicability/action/final decision + summary view/binding/index + source audit + operation relation | Query、boundary writer、runtime launch path。 |
| capture | capture finalization与后续material lifecycle relation实际变化的owner group | capture/material/observability relation + view/binding/index + source audit + operation relation | artifact reader、Query、handoff adapter。 |
| handoff | opening、attempt reservation、observation、cleanup block change | handoff/plan/progress/relay linkage + view/binding/index + source audit + operation relation | publisher、delivery adapter、Query。 |
| failure/control | failure/control accepted transition和redline产生formal failure的owner group | merged immutable snapshot/window index/scope summary/cross-link relation + binding + source audit + operation relation | Query、effect adapter、generic latest reader。 |
| cleanup | cleanup evaluation/authorization/confirmation/failure、orphan/lease或redline变化影响read source的safety owner group | exact owner coverage + immutable view/binding/current/exact/relation indexes + source audit + operation relation | release adapter、Query、reconciliation repair。 |
| redline | detection、containment、preservation、investigation observation/disposition winner | redline truth/proofs/preservation/investigation relation + immutable row/binding/current index + source audit + operation relation | investigation adapter、Query、cleanup permissive mapper。 |

调用方只有在本次canonical source mutation确实改变对应read source时才materialize；无变化的业务NoOp不得创建第二row或
推进binding。一个UoW改变多个family时可以调用多个具名method，但共用该UoW已经分配的matching truth/reference cursor，
不得由每个writer再次分配cursor或单独commit。八类writer均不能保存raw adapter/body/path/host/process/network/tool/
runtime/member内容。

### 92.6 A3-1 自检与下一内部任务

| check | result |
|---|---:|
| Query -> write provenance | `13/13` |
| A3 concrete materialization surfaces | `11/11` identified |
| existing owner reuse | reconciliation/audit `2/2` |
| status-view named method families | `8/8` |
| new public facade / scheduler / repair flow | `0/0/0` |
| Query writer call / write UoW / identity allocation | `0/0/0` |
| new L1/L2 upstream blocker | `0` |

`A3-1`到此完成。下一内部任务只定义八类status-view staged writer的typed candidate、expectation、method、error、
原子write set和caller/commit ownership；projection、derived、comparison、reconciliation/audit与A4仍不得提前标记完成。

## Historical-Position Activation Draft (superseded by physical EOF): `7R-04A-A3-1` completed

```text
current_internal_task = A3-2 eight status-view staged writer contracts
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = in_progress
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
query_write_provenance = 13/13
necessary_materialization_surfaces = 11/11_identified
status_view_writer_families = 8/8_identified
existing_writer_reuse = reconciliation|audit
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```


## 12. A2 第一 Family 开工门禁与任务拆分

用户已确认 A1，当前只消费一次门禁进入 A2 的 `execution/boundary/policy` family。A2 的五个 family 必须逐项标记，
本批不得借共享 trait 一次定义后四组签名。

| A2 family task | status | 本批可交付内容 |
|---|---|---|
| `A2-F1 execution/boundary/policy` | `[x]` | 3 个 request、binding/selection/absence/gap/outcome、3 个具名 reader method 与 exact/current 矩阵 |
| `A2-F2 capture/handoff` | `[x]` | capture whole group 与 handoff plan/progress/relay bundle reader |
| `A2-F3 failure/cleanup/redline` | `[ ]` | bounded failure page 与既有 cleanup/redline lookup owner 接入 |
| `A2-F4 projection/derived/comparison` | `[ ]` | missing projection、derived exact 与 ordered comparison reader |
| `A2-F5 reconciliation/audit` | `[ ]` | exact report 与 subject-stable bounded audit page reader |

本批已读取并采用以下 current authority：

| authority | 本批消费的约束 |
|---|---|
| Step 6 context/boundary §§20.2~21.3 | execution source 是完整 chain；boundary source 是完整 committed boundary group；view 只能由 checked factory 构造 |
| Step 6 policy/run/capture §13 | policy source 必须包含 formal decision 与完整 high-risk action status set，不能读取 DSL 或现场重评 |
| Step 6 application §9.7 | 只有 `Permitted` 可调用 full reader；`Restricted/NotVisible/Unavailable` 均在 target read 前短路 |
| Step 7 service §§21~26 | 三个 public input/selector/output 已固定；current selector 只允许 `0/1`；Query write/external call 均为零 |
| Step 7 repository §§11.1~11.2 | reader 只接受一个 `&mut dyn SandboxCommittedReadSnapshot`；不得开启或伪装 write UoW |
| Step 6 cleanup/redline lookup contracts | 沿用 `binding -> selection/absence proof -> source lookup outcome` 的 closed carrier 形态 |

## 13. A2-F1 SOP 问题回答

| SOP 问题 | current answer |
|---|---|
| 哪个模块拥有 trait | `application::ports::query_read` 声明；durable 与 deterministic fake 由 `infra` 实现 |
| 谁可以调用 | 仅 `SandboxQueryService` 在 access-first 短路完成后调用；API/Worker/Jobs 不持有 reader |
| reader 的最小输入 | family-specific checked request + 一个公平 committed read snapshot；request 内含 permitted decision 与 closed selector |
| reader 的输出 | family-specific closed lookup outcome；只带 Step 6 source snapshot、typed proof 或 typed gap，不返回 public DTO |
| exact/current 如何区分 | selector variant 与 proof variant一一对应；不使用 optional ref precedence、`latest` flag 或 timestamp winner |
| absence 如何证明 | 完整 target/index read 的计数为零且 matching binding 也为零；repository `None` 或 raw `NotFound` 不是 proof |
| 命中后如何组 body | reader 返回 binding 中既有 view ref 与 Step 6 source；service 调用对应 checked view factory |
| stale 如何表达 | binding source cursor 严格落后于 required scope cursor时返回 source + typed `ProjectionBehind` gap |
| source 不可用如何表达 | 已知 target/binding但 dependency 暂不可完整读取时返回 typed no-body gap；repository技术失败走 reader error |
| 哪些情况是 integrity error | `>1` current、owner mismatch、`0 target + 1 binding`、binding命中后 row 丢失、source/binding关系不一致 |
| 写和外部副作用 | UoW、identity allocation、repair/rebuild/refresh、backend/runner call、business audit append全部为 `0` |
| 是否画图 | 不画；三个方法的一一映射与基数矩阵比调用图更适合机械审计，调用顺序已由 service §23 固定 |

## 14. Current 诊断与设计取舍

| concern | A1 后仍存在的缺口 | A2-F1 决策 |
|---|---|---|
| access 与 selector 可能脱钩 | reader若只收 selector，adapter 无法拒绝被绕过的 access-first | 每个 request 私有持有 matching decision 与 selector，并由 factory消费 checked input/context |
| source 与 view ref 无装配关系 | Step 6 source没有 materialized view ref | family-specific immutable binding保存 view ref、owner、source cursor与materialization linkage |
| current 可能退化成 latest scan | boundary/policy都有 current variant但无formal selection proof | current index只能返回 `0/1`；`>1`立即 typed integrity error，不按时间选 winner |
| absence 与 projection gap混淆 | execution 的 context 不存在和 view 未物化可被同一个 `None`覆盖 | 分为 `ContextAbsent` 与 `MissingProjection`；后者不得映 `Empty` |
| repository错误可能伪装业务空 | 当前没有 exact reader error | technical unavailable/failed进入closed reader error，禁止构造absence proof |
| 三个 source可能由多次read拼装 | facade只有结果约束，没有repository call shape | 一个 method只接收一个 snapshot handle，必须在其中完成index、binding、source和audit linkage读取 |

采用 family-specific carrier，而不抽象 `QueryReadRequest<S, O>` 或 `ReadGap<K>`。三个 Query 的 selector、absence语义和
source invariant不同，generic carrier只会把关键关系推迟到 runtime discriminator。共用点只保留在一个装配 trait 与一个
closed transport/integrity error enum 中。

## 15. Permitted Read Request Contract

Step 6 `SandboxQueryAccessDecision` 需要补一个只读 accessor；它不新增状态、identity或持久化字段：

```rust
impl SandboxQueryAccessDecision {
    /// 返回本decision固定绑定的closed Query kind。
    pub fn query_kind(&self) -> SandboxQueryKind;
}
```

三个 request 都是 application-local carrier，不进入 Step 6 object registry、Step 8 DTO或 durable schema。

```rust
/// 已通过full-read access gate的execution status读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusReadRequest {
    /// 与当前service context和Query kind完全匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// 唯一允许的required-context selector。
    selector: SandboxExecutionStatusSelector,
}

impl SandboxExecutionStatusReadRequest {
    /// 从同一checked input、service context和permitted decision构造request。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetSandboxExecutionStatusInput,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回permitted access decision；adapter仍须fail closed校验。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回required-context selector。
    pub fn selector(&self) -> &SandboxExecutionStatusSelector;
}

/// 已通过full-read access gate的boundary status读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusReadRequest {
    /// 与`GetBoundaryStatus`和当前service context匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// caller选择的exact或current-for-context boundary selector。
    selector: BoundaryStatusSelector,
}

impl BoundaryStatusReadRequest {
    /// 只接受`GetBoundaryStatus`、matching context/digest和full-read permission。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetBoundaryStatusInput,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回closed boundary selector。
    pub fn selector(&self) -> &BoundaryStatusSelector;
}

/// 已通过full-read access gate的policy decision summary读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryReadRequest {
    /// 与`GetPolicyDecisionSummary`和当前service context匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// caller选择的exact或current-for-context policy decision selector。
    selector: PolicyDecisionSummarySelector,
}

impl PolicyDecisionSummaryReadRequest {
    /// 只接受`GetPolicyDecisionSummary`、matching context/digest和full-read permission。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetPolicyDecisionSummaryInput,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回closed policy decision selector。
    pub fn selector(&self) -> &PolicyDecisionSummarySelector;
}
```

三个 factory 都必须依次检查：`query_kind` exact match、`matches_context(context)`、
`permits_full_read()==true`、input selector与method family一致。`Restricted`不能构造这些request；未来若需要restricted body，
必须新增独立redacted carrier和reader，不能复用本trait后删字段。

`context.request_digest()` 与 input 的关系沿用 entry current authority：Step 8/validated entry 已证明 canonical digest覆盖
selector与input全部业务字段。request factory重验decision digest等于context digest，但不得在application重新序列化input或
计算第二个fingerprint；entry未提供该证明时应在target read前返回`QueryAccessShapeInvalid`。

## 16. Execution Status Binding、Proof 与 Gap

```rust
/// current execution status materialization的immutable binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusViewBinding {
    /// status materialization writer已提交的typed view identity。
    view_ref: SandboxExecutionStatusViewRef,
    /// view唯一归属的controlled execution context。
    context_ref: ControlledExecutionContextRef,
    /// view完整覆盖的execution chain truth watermark。
    source_truth_cursor: SandboxTruthCursor,
    /// materialization source已有的business audit linkage；不是query audit。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// immutable binding提交时间。
    materialized_at: Timestamp,
}

impl SandboxExecutionStatusViewBinding {
    /// 从current execution-status index的完整committed row构造binding。
    pub fn try_from_committed_index(
        view_ref: SandboxExecutionStatusViewRef,
        context_ref: ControlledExecutionContextRef,
        source_truth_cursor: SandboxTruthCursor,
        source_audit_trace_ref: SandboxAuditTraceRef,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回materialized view identity。
    pub fn view_ref(&self) -> &SandboxExecutionStatusViewRef;
    /// 返回owning context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回binding覆盖的source truth watermark。
    pub fn source_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回materialization source audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回binding materialization time。
    pub fn materialized_at(&self) -> &Timestamp;
}

/// required-context selector命中唯一current binding的same-snapshot proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusSelectionProof {
    /// 本proof消费的required-context selector。
    selector: SandboxExecutionStatusSelector,
    /// selector命中的唯一current immutable binding。
    binding: SandboxExecutionStatusViewBinding,
    /// exact context owner count；合法found值固定为1。
    context_count: u64,
    /// current binding count；合法found值固定为1。
    current_binding_count: u64,
    /// current execution chain要求view覆盖到的truth watermark。
    required_truth_cursor: SandboxTruthCursor,
    /// lookup index已有的audit linkage。
    lookup_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot lookup observation time。
    observed_at: Timestamp,
}

impl SandboxExecutionStatusSelectionProof {
    /// 只接受matching owner、`context_count=1`和`current_binding_count=1`。
    pub fn try_from_committed_indexes(
        selector: SandboxExecutionStatusSelector,
        binding: SandboxExecutionStatusViewBinding,
        context_count: u64,
        current_binding_count: u64,
        required_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回checked selector。
    pub fn selector(&self) -> &SandboxExecutionStatusSelector;
    /// 返回selected current binding。
    pub fn binding(&self) -> &SandboxExecutionStatusViewBinding;
    /// 返回required execution-chain watermark。
    pub fn required_truth_cursor(&self) -> SandboxTruthCursor;
    /// 判断binding source是否严格落后于required watermark。
    pub fn is_stale(&self) -> bool;
}

/// exact context index与view-binding index同时完整为零的target absence proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusAbsenceProof {
    /// 已通过access decision的exact context。
    context_ref: ControlledExecutionContextRef,
    /// exact context owner count；absence固定为0。
    context_count: u64,
    /// current view binding count；absence固定为0。
    current_binding_count: u64,
    /// owner与binding index完整读取到的truth watermark。
    lookup_truth_cursor: SandboxTruthCursor,
    /// lookup index已有的audit linkage。
    lookup_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot lookup observation time。
    observed_at: Timestamp,
}

impl SandboxExecutionStatusAbsenceProof {
    /// 只接受matching selector与context/binding count `(0, 0)`。
    pub fn try_from_committed_indexes(
        selector: &SandboxExecutionStatusSelector,
        context_count: u64,
        current_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回proof owning context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回固定为0的context count。
    pub fn context_count(&self) -> u64;
    /// 返回固定为0的binding count。
    pub fn current_binding_count(&self) -> u64;
    /// 返回absence lookup watermark。
    pub fn lookup_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回lookup audit linkage。
    pub fn lookup_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回lookup observation time。
    pub fn observed_at(&self) -> &Timestamp;
}

/// context存在但current view binding尚未形成的missing-projection proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusProjectionAbsenceProof {
    /// 已通过access decision且确认存在的exact context。
    context_ref: ControlledExecutionContextRef,
    /// exact context owner count；missing projection固定为1。
    context_count: u64,
    /// current view binding count；missing projection固定为0。
    current_binding_count: u64,
    /// current execution chain要求materialization覆盖到的truth watermark。
    required_truth_cursor: SandboxTruthCursor,
    /// lookup index已有的audit linkage。
    lookup_audit_trace_ref: SandboxAuditTraceRef,
    /// application-owned固定模板形成的caller-safe missing-projection reason。
    reason: SandboxReason,
    /// same-snapshot lookup observation time。
    observed_at: Timestamp,
}

impl SandboxExecutionStatusProjectionAbsenceProof {
    /// 只接受matching selector与context/binding count `(1, 0)`。
    pub fn try_from_committed_indexes(
        selector: &SandboxExecutionStatusSelector,
        context_count: u64,
        current_binding_count: u64,
        required_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回proof owning context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回固定为1的context count。
    pub fn context_count(&self) -> u64;
    /// 返回固定为0的binding count。
    pub fn current_binding_count(&self) -> u64;
    /// 返回required materialization watermark。
    pub fn required_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回lookup audit linkage。
    pub fn lookup_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回caller-safe missing-projection reason。
    pub fn reason(&self) -> &SandboxReason;
    /// 返回lookup observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

两个 proof 分别只接受计数 `(0,0)` 与 `(1,0)`。`(0,1)` 是 dangling binding，任一计数 `>1` 是 cardinality
integrity error；factory不得根据 repository `None`、错误文本或 timestamp构造它们。两者都提供 matching
`context_ref()`、计数、cursor、audit ref和`observed_at()` getter，供 outcome factory逐字段复核。

```rust
/// execution status formal read的finite gap family。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxExecutionStatusReadGapKind {
    /// context存在，但current view-binding index暂不可完整读取。
    ViewBinding,
    /// immutable source安全可读，但落后于required truth watermark。
    ProjectionBehind,
    /// relation-checked core source可读，但committed body-free reference state暂不可完整确认。
    ReferenceState,
    /// completed capture仍可显示，但required handoff knowledge暂不可完整读取。
    RequiredHandoffKnowledge,
    /// binding已命中，但本次无法形成任何caller-safe source。
    SourceUnavailable,
}

/// execution status formal read允许保留的typed gap。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxExecutionStatusReadGap {
    /// context存在，但binding index没有提供完整0/1 proof。
    ViewBindingUnavailable {
        /// gap唯一归属的exact context。
        context_ref: ControlledExecutionContextRef,
        /// current execution chain要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe binding dependency reason。
        reason: SandboxReason,
    },
    /// immutable source安全可读，但落后于当前required truth watermark。
    ProjectionBehind {
        /// gap唯一归属的exact context。
        context_ref: ControlledExecutionContextRef,
        /// current execution chain要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// safe immutable source实际覆盖的truth watermark。
        available_truth_cursor: SandboxTruthCursor,
        /// caller-safe stale reason。
        reason: SandboxReason,
    },
    /// core source可安全构造，但body-free reference state暂不可完整确认。
    ReferenceStateGap {
        /// gap唯一归属的exact context。
        context_ref: ControlledExecutionContextRef,
        /// selected materialized execution view identity。
        view_ref: SandboxExecutionStatusViewRef,
        /// current execution chain要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe reference-unavailable reason。
        reason: SandboxReason,
    },
    /// core source可安全构造，但completed capture的required handoff knowledge缺失。
    RequiredHandoffKnowledgeGap {
        /// gap唯一归属的exact context。
        context_ref: ControlledExecutionContextRef,
        /// selected materialized execution view identity。
        view_ref: SandboxExecutionStatusViewRef,
        /// current execution chain要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe handoff-source-missing reason。
        reason: SandboxReason,
    },
    /// binding已命中，但source dependency本次无法形成任何安全source。
    SourceUnavailable {
        /// gap唯一归属的exact context。
        context_ref: ControlledExecutionContextRef,
        /// selected materialized execution view identity。
        view_ref: SandboxExecutionStatusViewRef,
        /// current execution chain要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe source dependency reason。
        reason: SandboxReason,
    },
}

impl SandboxExecutionStatusReadGap {
    /// 返回finite gap family。
    pub fn kind(&self) -> SandboxExecutionStatusReadGapKind;
    /// 返回gap唯一归属的context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
}

/// 保存execution read中同一context的non-empty、typed gap集合。
///
/// 集合按canonical gap kind排序，同一kind最多出现一次；构造时拒绝空集合、
/// 跨context成员以及与source/selector不相容的组合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusReadGapSet(
    /// 按finite gap kind canonical排序且同kind至多一项的non-empty gaps。
    Vec<SandboxExecutionStatusReadGap>,
);

impl SandboxExecutionStatusReadGapSet {
    /// 构造non-empty、同context、同kind至多一项且按canonical kind顺序排列的gap set。
    pub fn try_new(
        gaps: Vec<SandboxExecutionStatusReadGap>,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回canonical ordered gap切片。
    pub fn as_slice(&self) -> &[SandboxExecutionStatusReadGap];
}
```

`ProjectionBehind`要求`available_truth_cursor < required_truth_cursor`且available等于binding source cursor；它可与
安全旧source一起返回。`ReferenceStateGap`要求全部已显示ref/status pair仍满足Step 6 source factory，只表达body-free
reference availability不足；`RequiredHandoffKnowledgeGap`只允许capture pair存在且capture为`Complete`、
`required_handoffs=None`。两者可与source一起返回。`ViewBindingUnavailable | SourceUnavailable`只能形成no-body
unavailable outcome；binding指向的
immutable source row确认丢失属于half-commit，必须返回 integrity error，不能构造gap。

## 17. Boundary Status Binding、Proof 与 Gap

`Exact` 可以读取 caller 明确选择的非 current boundary；`CurrentForContext` 只能读取 context 唯一 current binding。
二者共用 immutable binding row，但 selection proof 必须保留位置，不允许 exact selector静默改读current。

```rust
/// selected boundary binding相对context current index的位置；不是boundary lifecycle状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum BoundaryStatusBindingPosition {
    /// selected exact binding就是context当前唯一boundary binding。
    Current,
    /// selected exact binding不是context当前binding，或该context当前没有binding。
    Historical,
}

/// 一个materialized boundary status view与exact boundary source watermark的immutable binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusViewBinding {
    /// status materialization writer已提交的typed view identity。
    view_ref: BoundaryStatusViewRef,
    /// view唯一归属的controlled execution context。
    context_ref: ControlledExecutionContextRef,
    /// view唯一投影的coherent boundary identity。
    boundary_ref: CoherentBoundaryRef,
    /// view完整覆盖的exact boundary group truth watermark。
    source_truth_cursor: SandboxTruthCursor,
    /// materialization source已有的business audit linkage；不是query audit。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// immutable binding提交时间。
    materialized_at: Timestamp,
}

impl BoundaryStatusViewBinding {
    /// 从exact immutable binding index的committed row构造binding。
    pub fn try_from_committed_index(
        view_ref: BoundaryStatusViewRef,
        context_ref: ControlledExecutionContextRef,
        boundary_ref: CoherentBoundaryRef,
        source_truth_cursor: SandboxTruthCursor,
        source_audit_trace_ref: SandboxAuditTraceRef,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回materialized boundary view identity。
    pub fn view_ref(&self) -> &BoundaryStatusViewRef;
    /// 返回binding owning context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回binding唯一投影的boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回binding source truth watermark。
    pub fn source_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回source audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回binding materialization time。
    pub fn materialized_at(&self) -> &Timestamp;
}

/// closed selector命中一个exact binding时形成的same-snapshot selection proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusSelectionProof {
    /// 本proof消费的exact/current selector。
    selector: BoundaryStatusSelector,
    /// selector命中的immutable binding。
    binding: BoundaryStatusViewBinding,
    /// selected binding相对current index的位置。
    binding_position: BoundaryStatusBindingPosition,
    /// same-snapshot current index指向的boundary；current count为0时为None。
    current_boundary_ref: Option<CoherentBoundaryRef>,
    /// selector目标在owner/index中的匹配数；合法found值固定为1。
    selected_target_count: u64,
    /// selector目标在immutable binding index中的匹配数；合法found值固定为1。
    selected_binding_count: u64,
    /// context current-binding index的匹配数；只允许0或1。
    current_binding_count: u64,
    /// exact boundary group当前要求view覆盖到的truth watermark。
    required_truth_cursor: SandboxTruthCursor,
    /// lookup index已有的audit linkage。
    lookup_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot lookup observation time。
    observed_at: Timestamp,
}

impl BoundaryStatusSelectionProof {
    /// 从owner、exact immutable index和current index的同一snapshot读构造proof。
    #[allow(clippy::too_many_arguments)]
    pub fn try_from_committed_indexes(
        selector: BoundaryStatusSelector,
        binding: BoundaryStatusViewBinding,
        binding_position: BoundaryStatusBindingPosition,
        current_boundary_ref: Option<CoherentBoundaryRef>,
        selected_target_count: u64,
        selected_binding_count: u64,
        current_binding_count: u64,
        required_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回checked selector。
    pub fn selector(&self) -> &BoundaryStatusSelector;
    /// 返回selected immutable binding。
    pub fn binding(&self) -> &BoundaryStatusViewBinding;
    /// 返回selected binding相对current index的位置。
    pub fn binding_position(&self) -> BoundaryStatusBindingPosition;
    /// 返回same-snapshot current boundary ref。
    pub fn current_boundary_ref(&self) -> Option<&CoherentBoundaryRef>;
    /// 返回required boundary-group watermark。
    pub fn required_truth_cursor(&self) -> SandboxTruthCursor;
    /// 判断selected binding是否严格落后于required watermark。
    pub fn is_stale(&self) -> bool;
}
```

selection factory 的 closed rules：

1. `selected_target_count=1`、`selected_binding_count=1`；任一大于1立即返回cardinality error。
2. selector、binding与loaded source的context / boundary必须逐项全等；owner mismatch不是absence。
3. `current_binding_count`只能为0或1，且与`current_boundary_ref.is_some()`等价；count 0只允许exact historical branch。
4. `CurrentForContext`要求current count为1、selected boundary等于current ref且position为`Current`。
5. `Exact`要求selected boundary等于caller ref；等于current时position必须为`Current`，否则必须为`Historical`。
6. `required_truth_cursor >= binding.source_truth_cursor`且`observed_at >= materialized_at`；不允许跨snapshot补cursor。

```rust
/// boundary selector在完整owner与binding index读取后形成的zero-cardinality proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BoundaryStatusAbsenceProof {
    /// context不存在current boundary target，且current binding count固定为0。
    Current {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// exact context owner count；允许0或1。
        context_count: u64,
        /// current boundary target count；absence固定为0。
        current_target_count: u64,
        /// current boundary binding count；absence固定为0。
        current_binding_count: u64,
        /// owner与binding index完整读取到的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot lookup observation time。
        observed_at: Timestamp,
    },
    /// selected exact boundary ref在全局typed truth lookup中不存在，且matching immutable binding count固定为0。
    Exact {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// caller明确选择的exact coherent boundary。
        boundary_ref: CoherentBoundaryRef,
        /// exact context owner count；允许0或1。
        context_count: u64,
    /// selected boundary ref的全局typed truth count；absence固定为0。
        exact_target_count: u64,
        /// selected immutable binding count；absence固定为0。
        exact_binding_count: u64,
        /// owner与binding index完整读取到的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot lookup observation time。
        observed_at: Timestamp,
    },
}

impl BoundaryStatusAbsenceProof {
    /// 只接受matching current selector、context count 0/1和target/binding count 0/0。
    pub fn try_current_absent(
        selector: &BoundaryStatusSelector,
        context_count: u64,
        current_target_count: u64,
        current_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 只接受matching exact selector、context count 0/1和global-target/binding count 0/0。
    pub fn try_exact_absent(
        selector: &BoundaryStatusSelector,
        context_count: u64,
        exact_target_count: u64,
        exact_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 判断proof variant及其typed key是否与selector逐字段匹配。
    pub fn selector_matches(&self, selector: &BoundaryStatusSelector) -> bool;
}

/// boundary formal read允许保留的gap family。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum BoundaryStatusReadGapKind {
    /// owner target存在但immutable view binding未完整形成。
    ViewBinding,
    /// safe materialized source落后于exact boundary truth watermark。
    ProjectionBehind,
    /// relation-checked whole group可读，但body-free reference state暂不可完整确认。
    ReferenceState,
    /// binding存在但本次无法形成任何caller-safe source。
    SourceUnavailable,
}

/// boundary status read允许向上游传递的有限、已绑定selector的gap。
///
/// 每个成员都必须指向同一个closed selector；只有带有兼容whole-group
/// source的gap才能形成degraded body，其余gap只能进入typed outcome。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BoundaryStatusReadGap {
    /// owner target存在，但binding index无法提供完整0/1 proof。
    ViewBindingUnavailable {
        /// 与reader request全等的closed selector。
        selector: BoundaryStatusSelector,
        /// target要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe binding dependency reason。
        reason: SandboxReason,
    },
    /// safe immutable source严格落后于required watermark。
    ProjectionBehind {
        /// 与reader request全等的closed selector。
        selector: BoundaryStatusSelector,
        /// target要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// safe source实际覆盖的truth watermark。
        available_truth_cursor: SandboxTruthCursor,
        /// caller-safe stale reason。
        reason: SandboxReason,
    },
    /// core boundary source可构造，但body-free reference state暂不可完整确认。
    ReferenceStateGap {
        /// 与reader request全等的closed selector。
        selector: BoundaryStatusSelector,
        /// selected materialized view identity。
        view_ref: BoundaryStatusViewRef,
        /// target要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe reference-unavailable reason。
        reason: SandboxReason,
    },
    /// binding存在，但本次无法形成任何caller-safe boundary source。
    SourceUnavailable {
        /// 与reader request全等的closed selector。
        selector: BoundaryStatusSelector,
        /// selected materialized view identity。
        view_ref: BoundaryStatusViewRef,
        /// target要求materialization覆盖到的truth watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe source dependency reason。
        reason: SandboxReason,
    },
}

impl BoundaryStatusReadGap {
    /// 返回finite gap kind。
    pub fn kind(&self) -> BoundaryStatusReadGapKind;
    /// 返回gap绑定的closed selector。
    pub fn selector(&self) -> &BoundaryStatusSelector;
}

/// 保存non-empty、same-selector、kind-unique boundary read gaps。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusReadGapSet(
    /// selector全等、按finite gap kind canonical排序且同kind至多一项的non-empty gaps。
    Vec<BoundaryStatusReadGap>,
);

impl BoundaryStatusReadGapSet {
    /// 构造non-empty、selector全等、同kind至多一项且canonical ordered的gap set。
    pub fn try_new(
        gaps: Vec<BoundaryStatusReadGap>,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回canonical ordered gap切片。
    pub fn as_slice(&self) -> &[BoundaryStatusReadGap];
}
```

`ViewBindingUnavailable`只接受target count为1、binding count为0；`ProjectionBehind`只接受available严格早于required，
且可与safe source一起返回；`ReferenceStateGap`要求boundary/identity/requirement/decision/capability/handle/lease的
canonical ref/status relation仍满足Step 6 factory，只表达body-free reference availability不足；`SourceUnavailable`不能
携带猜测或partial source。target与binding同为0必须走absence proof，
target为0但binding为1、两个current binding、exact owner mismatch或binding row丢失均为integrity error。

## 18. Policy Decision Summary Binding、Proof 与 Gap

formal policy decision 是 immutable truth；同一 context 后续重评会创建新 snapshot、action decisions 与 decision。
因此 exact selector可以读取historical decision，current selector只能跟随唯一current-decision binding。

```rust
/// selected policy decision binding相对context current index的位置；不是policy decision状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum PolicyDecisionSummaryBindingPosition {
    /// selected exact decision就是context当前唯一policy decision。
    Current,
    /// selected exact decision不是current，或该context当前没有decision binding。
    Historical,
}

/// 一个policy summary view与完整formal decision group的immutable binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryViewBinding {
    /// materialized policy summary view identity。
    view_ref: PolicyDecisionSummaryViewRef,
    /// formal decision owning context。
    context_ref: ControlledExecutionContextRef,
    /// view唯一投影的formal policy decision。
    policy_decision_ref: PolicyExecutionDecisionRef,
    /// formal decision唯一消费的applicability snapshot。
    policy_snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// view完整覆盖的decision/action group truth watermark。
    source_truth_cursor: SandboxTruthCursor,
    /// source formal decision已有的audit linkage；不是query audit。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// immutable binding提交时间。
    materialized_at: Timestamp,
}

impl PolicyDecisionSummaryViewBinding {
    /// 从exact immutable policy-summary binding row构造checked binding。
    #[allow(clippy::too_many_arguments)]
    pub fn try_from_committed_index(
        view_ref: PolicyDecisionSummaryViewRef,
        context_ref: ControlledExecutionContextRef,
        policy_decision_ref: PolicyExecutionDecisionRef,
        policy_snapshot_ref: PolicyApplicabilitySnapshotRef,
        source_truth_cursor: SandboxTruthCursor,
        source_audit_trace_ref: SandboxAuditTraceRef,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回materialized policy summary view identity。
    pub fn view_ref(&self) -> &PolicyDecisionSummaryViewRef;
    /// 返回formal decision owning context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回binding唯一投影的formal decision ref。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回formal decision唯一消费的applicability snapshot ref。
    pub fn policy_snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回binding source truth watermark。
    pub fn source_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回formal decision source audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回binding materialization time。
    pub fn materialized_at(&self) -> &Timestamp;
}

/// closed policy selector命中immutable binding时的same-snapshot selection proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummarySelectionProof {
    /// 本proof消费的exact/current selector。
    selector: PolicyDecisionSummarySelector,
    /// selector命中的immutable binding。
    binding: PolicyDecisionSummaryViewBinding,
    /// selected binding相对current index的位置。
    binding_position: PolicyDecisionSummaryBindingPosition,
    /// same-snapshot current index指向的formal decision；exact historical允许None。
    current_policy_decision_ref: Option<PolicyExecutionDecisionRef>,
    /// selected formal decision owner count；合法found值固定为1。
    selected_decision_count: u64,
    /// selected immutable binding count；合法found值固定为1。
    selected_binding_count: u64,
    /// context current-decision binding count；只允许0或1。
    current_binding_count: u64,
    /// formal decision group要求view覆盖到的truth watermark。
    required_truth_cursor: SandboxTruthCursor,
    /// lookup index已有的audit linkage。
    lookup_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot lookup observation time。
    observed_at: Timestamp,
}

impl PolicyDecisionSummarySelectionProof {
    /// 从formal decision owner、immutable binding与current index的同一snapshot读构造proof。
    #[allow(clippy::too_many_arguments)]
    pub fn try_from_committed_indexes(
        selector: PolicyDecisionSummarySelector,
        binding: PolicyDecisionSummaryViewBinding,
        binding_position: PolicyDecisionSummaryBindingPosition,
        current_policy_decision_ref: Option<PolicyExecutionDecisionRef>,
        selected_decision_count: u64,
        selected_binding_count: u64,
        current_binding_count: u64,
        required_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回checked selector。
    pub fn selector(&self) -> &PolicyDecisionSummarySelector;
    /// 返回selected immutable binding。
    pub fn binding(&self) -> &PolicyDecisionSummaryViewBinding;
    /// 返回selected binding相对current index的位置。
    pub fn binding_position(&self) -> PolicyDecisionSummaryBindingPosition;
    /// 返回same-snapshot current policy decision ref。
    pub fn current_policy_decision_ref(&self) -> Option<&PolicyExecutionDecisionRef>;
    /// 返回required formal-decision-group watermark。
    pub fn required_truth_cursor(&self) -> SandboxTruthCursor;
    /// 判断selected binding是否严格落后于required watermark。
    pub fn is_stale(&self) -> bool;
}
```

factory 必须保证 selected decision/binding count均为1，current count只为0或1且与optional current ref一致；count 0只允许
exact historical branch。`CurrentForContext`只接受
`Current`且selected ref等于current ref；`Exact`逐项匹配caller decision ref，是否current由same-snapshot index唯一判定。
binding snapshot ref还必须等于loaded `PolicyExecutionDecision`与最终
`PolicyDecisionSummarySourceSnapshot::snapshot_ref()`；任何不等都属于lineage integrity error。

```rust
/// policy selector在完整decision与binding index读取后形成的zero-cardinality proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyDecisionSummaryAbsenceProof {
    /// context没有current policy decision与current summary binding的proof。
    Current {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// exact context owner count；允许0或1。
        context_count: u64,
        /// current decision count；absence固定为0。
        current_decision_count: u64,
        /// current summary binding count；absence固定为0。
        current_binding_count: u64,
        /// owner与binding index完整读取到的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot lookup observation time。
        observed_at: Timestamp,
    },
    /// caller选择的exact decision ref在全局typed truth lookup中不存在，且matching binding不存在的proof。
    Exact {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// caller明确选择的formal decision ref。
        policy_decision_ref: PolicyExecutionDecisionRef,
        /// exact context owner count；允许0或1。
        context_count: u64,
        /// selected decision ref的全局typed truth count；absence固定为0。
        exact_decision_count: u64,
        /// selected immutable binding count；absence固定为0。
        exact_binding_count: u64,
        /// owner与binding index完整读取到的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot lookup observation time。
        observed_at: Timestamp,
    },
}

impl PolicyDecisionSummaryAbsenceProof {
    /// 只接受matching current selector与decision/binding count 0/0。
    #[allow(clippy::too_many_arguments)]
    pub fn try_current_absent(
        selector: &PolicyDecisionSummarySelector,
        context_count: u64,
        current_decision_count: u64,
        current_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 只接受matching exact selector与global-decision/binding count 0/0。
    #[allow(clippy::too_many_arguments)]
    pub fn try_exact_absent(
        selector: &PolicyDecisionSummarySelector,
        context_count: u64,
        exact_decision_count: u64,
        exact_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 判断proof variant及其typed key是否与selector逐字段匹配。
    pub fn selector_matches(&self, selector: &PolicyDecisionSummarySelector) -> bool;
}

/// policy summary formal read的finite gap family。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum PolicyDecisionSummaryReadGapKind {
    /// decision truth存在但summary binding尚未形成或暂不可读。
    ViewBinding,
    /// safe immutable policy source落后于required truth watermark。
    ProjectionBehind,
    /// complete formal decision/action source可读，但body-free reference state暂不可完整确认。
    ReferenceState,
    /// formal decision或其applicability lineage本次无法完整读取。
    FormalDecisionSource,
    /// formal decision声明的high-risk action decision set无法完整覆盖。
    ActionDecisionCoverage,
}

/// policy summary read允许向上游传递的有限、已绑定selector和watermark的gap。
///
/// 该类型不放宽formal decision或action coverage的完整性要求；无法形成
/// caller-safe source的情况必须保持为typed unavailable/error。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryReadGap {
    /// finite gap discriminator。
    kind: PolicyDecisionSummaryReadGapKind,
    /// 与本次reader request逐字段全等的closed selector。
    selector: PolicyDecisionSummarySelector,
    /// exact/current target需要覆盖到的truth watermark。
    required_truth_cursor: SandboxTruthCursor,
    /// stale source仍安全可读时的available watermark；其余gap固定None。
    available_truth_cursor: Option<SandboxTruthCursor>,
    /// body-free caller-safe reason；不得携带policy正文、marker value或raw repository error。
    reason: SandboxReason,
}

impl PolicyDecisionSummaryReadGap {
    /// 构造并校验kind、cursor shape与selector relation。
    pub fn try_new(
        kind: PolicyDecisionSummaryReadGapKind,
        selector: PolicyDecisionSummarySelector,
        required_truth_cursor: SandboxTruthCursor,
        available_truth_cursor: Option<SandboxTruthCursor>,
        reason: SandboxReason,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回finite gap kind。
    pub fn kind(&self) -> PolicyDecisionSummaryReadGapKind;
    /// 返回gap绑定的closed selector。
    pub fn selector(&self) -> &PolicyDecisionSummarySelector;
    /// 返回target要求materialization覆盖到的truth watermark。
    pub fn required_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回stale safe source实际覆盖的watermark；非stale gap固定None。
    pub fn available_truth_cursor(&self) -> Option<SandboxTruthCursor>;
    /// 返回caller-safe body-free reason。
    pub fn reason(&self) -> &SandboxReason;
}

/// 保存non-empty、same-selector/cursor、kind-unique policy read gaps。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryReadGapSet(
    /// selector/cursor全等、按finite gap kind canonical排序且同kind至多一项的non-empty gaps。
    Vec<PolicyDecisionSummaryReadGap>,
);

impl PolicyDecisionSummaryReadGapSet {
    /// 构造non-empty、selector/required cursor全等、同kind至多一项且canonical ordered的set。
    pub fn try_new(
        gaps: Vec<PolicyDecisionSummaryReadGap>,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回canonical ordered gap切片。
    pub fn as_slice(&self) -> &[PolicyDecisionSummaryReadGap];
}
```

只有 `ProjectionBehind` 允许 `available_truth_cursor=Some`，且必须严格小于required并等于binding source cursor；其它kind
固定为None。`ReferenceState`允许与仍具完整formal decision/action coverage的source一起返回；`ViewBinding |
FormalDecisionSource | ActionDecisionCoverage`只能形成no-body outcome。`ActionDecisionCoverage`表示index/dependency无法完成完整覆盖读取，不表示允许缺行：若完整index已证明formal
decision声明的action ref无对应row、owner不等或marker key重复，必须返回integrity error，不能形成degraded source。

## 19. Family Source Wrapper 与 Closed Lookup Outcome

source wrapper 固化“selected binding + Step 6 checked source + optional typed gap”的关系。它们不重新定义view字段，不持有
domain aggregate，也不执行view factory；service是唯一把wrapper映射成public typed body的owner。

```rust
/// execution status reader已完成same-snapshot selection后的checked source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusReadSource {
    /// required-context selector命中的same-snapshot selection proof。
    selection: SandboxExecutionStatusSelectionProof,
    /// Step 6 relation-checked complete execution chain source。
    source: SandboxExecutionStatusSourceSnapshot,
    /// fresh source为None；stale/degraded source为non-empty typed set。
    read_gaps: Option<SandboxExecutionStatusReadGapSet>,
}

impl SandboxExecutionStatusReadSource {
    /// 构造fresh complete source；binding/source context和audit relation必须全等。
    pub fn complete(
        selection: SandboxExecutionStatusSelectionProof,
        source: SandboxExecutionStatusSourceSnapshot,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 构造可形成stale/degraded body的safe source；gap set必须含body-compatible kind。
    pub fn degraded(
        selection: SandboxExecutionStatusSelectionProof,
        source: SandboxExecutionStatusSourceSnapshot,
        read_gaps: SandboxExecutionStatusReadGapSet,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回same-snapshot selection proof。
    pub fn selection(&self) -> &SandboxExecutionStatusSelectionProof;
    /// 返回Step 6 checked execution source。
    pub fn source(&self) -> &SandboxExecutionStatusSourceSnapshot;
    /// 返回optional typed read gaps。
    pub fn read_gaps(&self) -> Option<&SandboxExecutionStatusReadGapSet>;
    /// 判断source是否包含`ProjectionBehind` gap。
    pub fn is_stale(&self) -> bool;
    /// 判断source是否包含reference或required-handoff body-compatible gap。
    pub fn is_degraded(&self) -> bool;
}

/// boundary status reader已完成same-snapshot selection后的checked source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusReadSource {
    /// exact/current selector命中的same-snapshot selection proof。
    selection: BoundaryStatusSelectionProof,
    /// Step 6 relation-checked whole boundary group source。
    source: BoundaryStatusSourceSnapshot,
    /// fresh source为None；stale/degraded source为non-empty typed set。
    read_gaps: Option<BoundaryStatusReadGapSet>,
}

impl BoundaryStatusReadSource {
    /// 构造fresh complete whole-group source。
    pub fn complete(
        selection: BoundaryStatusSelectionProof,
        source: BoundaryStatusSourceSnapshot,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 构造可形成stale/degraded body的safe whole-group source。
    pub fn degraded(
        selection: BoundaryStatusSelectionProof,
        source: BoundaryStatusSourceSnapshot,
        read_gaps: BoundaryStatusReadGapSet,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回same-snapshot selection proof。
    pub fn selection(&self) -> &BoundaryStatusSelectionProof;
    /// 返回Step 6 checked boundary source。
    pub fn source(&self) -> &BoundaryStatusSourceSnapshot;
    /// 返回optional typed read gaps。
    pub fn read_gaps(&self) -> Option<&BoundaryStatusReadGapSet>;
    /// 判断source是否包含`ProjectionBehind` gap。
    pub fn is_stale(&self) -> bool;
    /// 判断source是否包含reference-state body-compatible gap。
    pub fn is_degraded(&self) -> bool;
}

/// policy summary reader已完成same-snapshot selection后的checked source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryReadSource {
    /// exact/current selector命中的same-snapshot selection proof。
    selection: PolicyDecisionSummarySelectionProof,
    /// Step 6 relation-checked complete formal decision/action source。
    source: PolicyDecisionSummarySourceSnapshot,
    /// fresh source为None；stale/degraded source为non-empty typed set。
    read_gaps: Option<PolicyDecisionSummaryReadGapSet>,
}

impl PolicyDecisionSummaryReadSource {
    /// 构造fresh complete policy decision group source。
    pub fn complete(
        selection: PolicyDecisionSummarySelectionProof,
        source: PolicyDecisionSummarySourceSnapshot,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 只允许`ProjectionBehind`与可安全映射的source gap；完整action coverage仍是factory前置条件。
    pub fn degraded(
        selection: PolicyDecisionSummarySelectionProof,
        source: PolicyDecisionSummarySourceSnapshot,
        read_gaps: PolicyDecisionSummaryReadGapSet,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 返回same-snapshot selection proof。
    pub fn selection(&self) -> &PolicyDecisionSummarySelectionProof;
    /// 返回Step 6 checked policy source。
    pub fn source(&self) -> &PolicyDecisionSummarySourceSnapshot;
    /// 返回optional typed read gaps。
    pub fn read_gaps(&self) -> Option<&PolicyDecisionSummaryReadGapSet>;
    /// 判断source是否包含`ProjectionBehind` gap。
    pub fn is_stale(&self) -> bool;
    /// 判断source是否包含reference-state body-compatible gap。
    pub fn is_degraded(&self) -> bool;
}
```

wrapper factory 的共同规则：

1. source owner identity与selection/binding逐字段全等，source audit ref必须等于binding source audit ref。
2. source observation time不得早于binding materialized time或lookup observation time。
3. complete要求`binding.source_truth_cursor == required_truth_cursor`且gap为空。
4. degraded只允许body-compatible gap；`ViewBinding | SourceUnavailable`不得与source同时出现。
5. execution完整source须保留failure/cleanup/redline chain；boundary须保留whole committed group；policy须保留完整action set。

```rust
/// execution status exact reader的closed business outcome。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxExecutionStatusLookupOutcome {
    /// 形成fresh、stale或degraded caller-safe source。
    ViewSource(SandboxExecutionStatusReadSource),
    /// exact context与current binding均由完整index证明不存在。
    ContextAbsent(SandboxExecutionStatusAbsenceProof),
    /// exact context存在，但current execution view binding明确不存在。
    MissingProjection(SandboxExecutionStatusProjectionAbsenceProof),
    /// index/dependency暂不可完整读取，且不能形成caller-safe body。
    Unavailable {
        /// 与reader request逐字段全等的required-context selector。
        selector: SandboxExecutionStatusSelector,
        /// non-empty、no-body-compatible typed gap set。
        read_gaps: SandboxExecutionStatusReadGapSet,
    },
}

impl SandboxExecutionStatusLookupOutcome {
    /// 构造可进入Step 6 view factory的source branch。
    pub fn view_source(source: SandboxExecutionStatusReadSource) -> Self;
    /// 构造matching context absence branch。
    pub fn context_absent(
        selector: &SandboxExecutionStatusSelector,
        proof: SandboxExecutionStatusAbsenceProof,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 构造matching missing-projection branch。
    pub fn missing_projection(
        selector: &SandboxExecutionStatusSelector,
        proof: SandboxExecutionStatusProjectionAbsenceProof,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 构造没有caller-safe body的typed unavailable branch。
    pub fn unavailable(
        selector: SandboxExecutionStatusSelector,
        read_gaps: SandboxExecutionStatusReadGapSet,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
}

/// boundary status exact/current reader的closed business outcome。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BoundaryStatusLookupOutcome {
    /// 形成fresh、stale或degraded whole-boundary-group source。
    ViewSource(BoundaryStatusReadSource),
    /// exact/current selector由完整owner与binding index证明不存在。
    Absent(BoundaryStatusAbsenceProof),
    /// binding/source dependency暂不可完整读取，且不能形成caller-safe body。
    Unavailable {
        /// 与reader request逐字段全等的closed selector。
        selector: BoundaryStatusSelector,
        /// non-empty、no-body-compatible typed gap set。
        read_gaps: BoundaryStatusReadGapSet,
    },
}

impl BoundaryStatusLookupOutcome {
    /// 构造可进入Step 6 view factory的source branch。
    pub fn view_source(source: BoundaryStatusReadSource) -> Self;
    /// 构造matching exact/current absence branch。
    pub fn absent(
        selector: &BoundaryStatusSelector,
        proof: BoundaryStatusAbsenceProof,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 构造没有caller-safe body的typed unavailable branch。
    pub fn unavailable(
        selector: BoundaryStatusSelector,
        read_gaps: BoundaryStatusReadGapSet,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
}

/// policy decision summary exact/current reader的closed business outcome。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyDecisionSummaryLookupOutcome {
    /// 形成fresh、stale或degraded complete policy source。
    ViewSource(PolicyDecisionSummaryReadSource),
    /// exact/current selector由完整decision与binding index证明不存在。
    Absent(PolicyDecisionSummaryAbsenceProof),
    /// binding/source/action dependency暂不可完整读取，且不能形成caller-safe body。
    Unavailable {
        /// 与reader request逐字段全等的closed selector。
        selector: PolicyDecisionSummarySelector,
        /// non-empty、no-body-compatible typed gap set。
        read_gaps: PolicyDecisionSummaryReadGapSet,
    },
}

impl PolicyDecisionSummaryLookupOutcome {
    /// 构造可进入Step 6 view factory的source branch。
    pub fn view_source(source: PolicyDecisionSummaryReadSource) -> Self;
    /// 构造matching exact/current absence branch。
    pub fn absent(
        selector: &PolicyDecisionSummarySelector,
        proof: PolicyDecisionSummaryAbsenceProof,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
    /// 构造没有caller-safe body的typed unavailable branch。
    pub fn unavailable(
        selector: PolicyDecisionSummarySelector,
        read_gaps: PolicyDecisionSummaryReadGapSet,
    ) -> Result<Self, SandboxPrimaryStatusReadError>;
}
```

outcome 不含 `NotVisible | Restricted`：这些分支在request factory和reader调用之前已完成。`Unavailable`只接收与selector
完全匹配的non-empty gap set；repository call失败、snapshot失效、relation损坏均不能进入该成功分支。

## 20. Exact Reader Trait 与 Closed Reader Error

```rust
/// execution/boundary/policy三个主状态Query的application-owned exact read port。
pub trait SandboxPrimaryStatusReader: Send + Sync {
    /// 在一个fair committed snapshot中读取required-context execution chain source。
    async fn read_sandbox_execution_status_source(
        &self,
        request: &SandboxExecutionStatusReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<SandboxExecutionStatusLookupOutcome, SandboxPrimaryStatusReadError>;

    /// 在同一个snapshot中完成boundary exact/current selection和whole-group source读取。
    async fn read_boundary_status_source(
        &self,
        request: &BoundaryStatusReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<BoundaryStatusLookupOutcome, SandboxPrimaryStatusReadError>;

    /// 在同一个snapshot中完成policy exact/current selection和complete action coverage读取。
    async fn read_policy_decision_summary_source(
        &self,
        request: &PolicyDecisionSummaryReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<PolicyDecisionSummaryLookupOutcome, SandboxPrimaryStatusReadError>;
}

/// 主状态exact reader的有限调用、repository与integrity失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxPrimaryStatusReadError {
    /// request中的Query kind与被调用method不一致。
    QueryKindMismatch,
    /// access decision与service context的actor/digest/operation不一致。
    AccessDecisionContextMismatch,
    /// 非Permitted decision试图进入full reader。
    FullReadNotPermitted,
    /// request selector与input或method family不一致。
    SelectorMismatch,
    /// snapshot handle不属于当前read-manager/adapter binding或已失效。
    ReadSnapshotUsageInvalid,
    /// snapshot已失效或无法保证同一committed generation。
    ReadSnapshotUnavailable {
        /// caller-safe snapshot dependency reason；不得包含storage/runtime raw cause。
        reason: SandboxReason,
    },
    /// exact owner/index/body repository本次无法完成读取；不是absence proof。
    RepositoryUnavailable {
        /// caller-safe temporary dependency reason；不得包含SQL、driver或path。
        reason: SandboxReason,
    },
    /// repository返回有限失败；不得把raw driver cause带出infra。
    RepositoryFailed {
        /// caller-safe internal failure reason；不得保存raw cause或backtrace。
        reason: SandboxReason,
    },
    /// exact/current target或binding cardinality不满足0/1闭集。
    CardinalityIntegrityInvalid,
    /// selector、target、binding、source的typed owner relation不一致。
    OwnerRelationIntegrityInvalid,
    /// current index与immutable exact binding的位置或ref不一致。
    CurrentBindingIntegrityInvalid,
    /// binding存在但source/view row丢失、重复或未原子替换。
    MaterializationIntegrityInvalid,
    /// truth cursor、materialization time、observation time或audit linkage关系非法。
    SnapshotRelationIntegrityInvalid,
    /// typed gap的kind、selector、cursor或reason shape非法。
    ReadGapShapeInvalid,
    /// absence/missing-projection proof与selector或计数不一致。
    AbsenceProofInvalid,
    /// lookup outcome把source/proof/gap放入错误branch。
    LookupOutcomeInvalid,
    /// Step 6 checked source或view relation factory拒绝已加载group。
    SourceContractInvalid,
    /// reader尝试write、identity allocation、repair、external call或business audit append。
    NoWriteViolation,
}
```

`RepositoryUnavailable | RepositoryFailed | ReadSnapshotUnavailable` 必须按下表映射为application error，不能直接构造
no-body unavailable surface，更不能变成`Empty`。integrity、contract、wrong-kind和no-write variant必须作为`Err`离开
reader；不能用caller-safe reason降级掩盖数据损坏。

reader error 到 existing application error detail 的映射固定如下，不允许 adapter 或 facade 自选：

| reader / snapshot failure | application detail | query success surface | retryable basis |
|---|---|---|---|
| `ReadSnapshotUnavailable | RepositoryUnavailable` | `ApplicationErrorDetail::PortUnavailable` | none | existing `PortUnavailable=true` |
| `RepositoryFailed` | `ApplicationErrorDetail::InternalInvariantViolation` | none | false；只有明确temporary dependency才可在infra边界归类为`RepositoryUnavailable` |
| `QueryKindMismatch` | `ApplicationErrorDetail::InvalidOperationMapping` | none | false |
| `AccessDecisionContextMismatch | FullReadNotPermitted | SelectorMismatch` | `ApplicationErrorDetail::QueryAccessShapeInvalid` | none | false |
| `ReadSnapshotUsageInvalid` | `ApplicationErrorDetail::InternalInvariantViolation` | none | false |
| nine integrity/shape/contract variants | `ApplicationErrorDetail::InternalInvariantViolation` | none | false |
| `NoWriteViolation` | `ApplicationErrorDetail::NoWriteViolation` | none | false |

其中 nine integrity/shape/contract variants 指
`CardinalityIntegrityInvalid | OwnerRelationIntegrityInvalid | CurrentBindingIntegrityInvalid |
MaterializationIntegrityInvalid | SnapshotRelationIntegrityInvalid | ReadGapShapeInvalid | AbsenceProofInvalid |
LookupOutcomeInvalid | SourceContractInvalid`；机械基数为`9/9`。

只有 `LookupOutcome::Unavailable { read_gaps }` 能成功映射
`SandboxQueryResult::no_body(SandboxQuerySurfaceStatus::Unavailable, ...)`。snapshot manager `open`失败或reader technical
error均返回`Err`；`close`失败也返回`PortUnavailable`并丢弃尚未返回的assembled body，不重读、不打开第二snapshot，已提交
business truth不变。

native `async fn in trait` 沿用本仓 Step 7 现行语法。若 `7R-04B` 的trait-object toolchain要求boxed future，只允许逐method
做语义等价展开，例如：

```rust
fn read_boundary_status_source<'a>(
    &'a self,
    request: &'a BoundaryStatusReadRequest,
    snapshot: &'a mut dyn SandboxCommittedReadSnapshot,
) -> Pin<Box<dyn Future<Output = Result<BoundaryStatusLookupOutcome, SandboxPrimaryStatusReadError>> + Send + 'a>>;
```

两种形态二选一，不形成第二callable；future不得`'static`、spawn/detach或跨调用缓存request/snapshot引用。

## 21. Exact Index、Bundle 与 Cardinality Matrix

下表固定 durable adapter 必须在传入 snapshot 内读取的逻辑 index/bundle。它定义 key 与关系，不规定表名、SQL或存储引擎。

| Query / selector | exact index key | owner target key | immutable binding key | required bundle | legal cardinality |
|---|---|---|---|---|---|
| execution `{context_ref}` | current execution view by context | exact context ref | exact `(context_ref, view_ref)`，current index指向一项 | context、identity、boundary、policy、run、capture/handoff、failure、cleanup、redline、audit linkage | context/binding=`(0,0)` absent；`(1,0)` missing projection；`(1,1)` read source |
| boundary `Exact` | exact boundary binding by `(context_ref,boundary_ref)` + current boundary by context | global typed `boundary_ref` truth lookup，再校验loaded owner context | exact `(context_ref,boundary_ref,view_ref)` | boundary、identity、requirement、decision、capability、handle、lease、audit linkage | global target/binding=`(0,0)` absent或`(1,1)` found；current count=`0/1` |
| boundary `CurrentForContext` | current boundary by context | current index selected exact boundary owner | selected exact immutable binding | 与 exact 相同 whole boundary group | current target/binding=`(0,0)` absent或`(1,1)` found |
| policy `Exact` | exact policy binding by `(context_ref,decision_ref)` + current decision by context | global typed `decision_ref` truth lookup，再校验loaded owner context | exact `(context_ref,decision_ref,view_ref)` | applicability snapshot、formal decision、完整 action decision set、boundary/handle/generation lineage、audit linkage | global decision/binding=`(0,0)` absent或`(1,1)` found；current count=`0/1` |
| policy `CurrentForContext` | current policy decision by context | current index selected formal decision | selected exact immutable binding | 与 exact 相同 complete policy group | current decision/binding=`(0,0)` absent或`(1,1)` found |

合法状态之外的机械裁决：

| observed relation | reader disposition | forbidden fallback |
|---|---|---|
| target `0`、binding `1` | `MaterializationIntegrityInvalid` | 把dangling binding当historical row或Empty |
| target `1`、binding `0`且完整index可读 | execution=`MissingProjection`；boundary/policy=`Unavailable(ViewBinding)` | 伪造view ref、现场materialize或Empty |
| 任一 selected/current count `>1` | `CardinalityIntegrityInvalid` | timestamp/ref/insertion-order winner |
| exact typed ref全局命中，但loaded owner context不等selector context | `OwnerRelationIntegrityInvalid` | composite-key miss后解释成Empty或Unavailable |
| current ref与selected binding ref不等 | `CurrentBindingIntegrityInvalid` | 改读另一个binding或latest scan |
| binding存在但immutable source row确认不存在 | `MaterializationIntegrityInvalid` | `SourceUnavailable`或旧row fallback |
| safe source cursor `< required` | `ViewSource + ProjectionBehind` | 标记fresh、query rebuild或只返回Empty |
| dependency暂不可完整读取且无safe source | `Unavailable(typed gap)` | generic None、partial DTO或raw error reason |
| repository/snapshot technical failure | `Err(SandboxPrimaryStatusReadError)` | absence proof、degraded body或新snapshot重试 |

所有 index lookup、owner load、source bundle read和audit linkage read必须观察同一个
`snapshot.snapshot_ref()`。adapter不得在method内部打开第二snapshot，也不得接受`SandboxUnitOfWork`、public page token、
SQL cursor、route/topic、generic object ref或opaque scope。

## 22. Facade-to-Reader 与 Outcome Mapping

```text
checked ctx + checked input
  -> SandboxQueryAccessDecision
  -> NotVisible / Unavailable / Restricted: return, target reads = 0
  -> Permitted
     -> family ReadRequest::try_from_permitted
     -> SandboxCommittedReadManager::open exactly once
     -> one named SandboxPrimaryStatusReader method exactly once
     -> exhaustive outcome mapping + Step 6 checked view factory
     -> SandboxCommittedReadManager::close exactly once
     -> optional redacted diagnostic hook
```

| facade | fixed Query kind | request | reader method | reader success output | application body factory |
|---|---|---|---|---|---|
| `get_sandbox_execution_status` | `GetSandboxExecutionStatus` | `SandboxExecutionStatusReadRequest` | `read_sandbox_execution_status_source` | `SandboxExecutionStatusLookupOutcome` | binding `view_ref` + source -> `SandboxExecutionStatusView::from_*_snapshot` |
| `get_boundary_status` | `GetBoundaryStatus` | `BoundaryStatusReadRequest` | `read_boundary_status_source` | `BoundaryStatusLookupOutcome` | binding `view_ref` + source -> `BoundaryStatusView::from_*_snapshot` |
| `get_policy_decision_summary` | `GetPolicyDecisionSummary` | `PolicyDecisionSummaryReadRequest` | `read_policy_decision_summary_source` | `PolicyDecisionSummaryLookupOutcome` | binding `view_ref` + source -> `PolicyDecisionSummaryView::from_*_snapshot` |

三项 `3/3` 一一对应；无 method alias、generic `read(kind, selector)` 或 facade 内 repository join。

### 22.1 Execution outcome mapping

| reader branch | required checks | final result |
|---|---|---|
| fresh `ViewSource` | gap=None；source/binding cursor exact | `SandboxQueryResult::visible(from_committed_snapshot(...))` |
| stale `ViewSource` | 唯一 `ProjectionBehind`；source仍满足complete view factory | `SandboxQueryResult::stale(body, mapped reasons)` |
| incomplete `ViewSource` | non-empty `ReferenceState | RequiredHandoffKnowledge`；source满足degraded factory | `SandboxQueryResult::degraded(from_degraded_snapshot(...), reasons)` |
| `ContextAbsent` | matching `(context,binding)=(0,0)` proof | `SandboxQueryResult::empty()` |
| `MissingProjection` | matching `(context,binding)=(1,0)` proof + non-empty safe reason | `SandboxQueryResult::no_body(MissingProjection, reasons)` |
| `Unavailable` | only `ViewBinding | SourceUnavailable` gap；no source | `SandboxQueryResult::no_body(Unavailable, reasons)` |

stale与incomplete gap若同时存在，source必须使用degraded view factory，final surface固定 `Degraded`；不得仅因有
`ProjectionBehind`返回`Stale`而隐藏source completeness gap。

### 22.2 Boundary outcome mapping

| reader branch | required checks | final result |
|---|---|---|
| fresh `ViewSource` | complete whole group，gap=None | `Visible(BoundaryStatusView::from_committed_snapshot(...))` |
| stale-only `ViewSource` | only `ProjectionBehind` | checked complete body + `Stale` |
| incomplete `ViewSource` | `ReferenceState`，可选同时stale | checked degraded body + `Degraded` |
| `Absent` | proof variant exact match selector，target/binding=`0/0` | `Empty` |
| `Unavailable` | `ViewBinding | SourceUnavailable`，没有partial source | no-body `Unavailable` |

canonical boundary `Rejected | Failed | Released` 是完整可见body，不映 application `Failed`；application `Failed`只用于本次
read assembly的明确operation failure，不能从business status复制。

### 22.3 Policy outcome mapping

| reader branch | required checks | final result |
|---|---|---|
| fresh `ViewSource` | complete formal decision/action coverage，gap=None | `Visible(PolicyDecisionSummaryView::from_committed_snapshot(...))` |
| stale-only `ViewSource` | only `ProjectionBehind` | checked complete body + `Stale` |
| incomplete `ViewSource` | source仍有完整action coverage且gap只含`ReferenceState`，可选同时stale | checked degraded body + `Degraded` |
| `Absent` | exact/current proof与selector逐字段匹配 | `Empty` |
| `Unavailable` | `ViewBinding | FormalDecisionSource | ActionDecisionCoverage`且无safe source | no-body `Unavailable` |

formal decision `Rejected | Blocked | Pending | FailClosed` 均是完整canonical body，不映application `Failed`；reader/service不得
重评policy、读取DSL/approval正文或用action子集推断aggregate status。

### 22.4 Gap-to-reason conversion

每个 family 的 gap set 必须提供一个 pure conversion，集中生成两个既有 checked reason carrier：

```rust
impl SandboxExecutionStatusReadGapSet {
    /// 将body-compatible gap按canonical顺序转成Step 6 view degraded reasons；no-body kind返回shape error。
    pub fn to_status_view_reasons(&self) -> Result<StatusViewDegradedReasonSet, SandboxPrimaryStatusReadError>;
    /// 将全部typed gap按canonical顺序转成application query safe reasons。
    pub fn to_query_reasons(&self) -> Result<SandboxReasonSet, SandboxPrimaryStatusReadError>;
}
impl BoundaryStatusReadGapSet {
    /// 将body-compatible gap按canonical顺序转成Step 6 view degraded reasons；no-body kind返回shape error。
    pub fn to_status_view_reasons(&self) -> Result<StatusViewDegradedReasonSet, SandboxPrimaryStatusReadError>;
    /// 将全部typed gap按canonical顺序转成application query safe reasons。
    pub fn to_query_reasons(&self) -> Result<SandboxReasonSet, SandboxPrimaryStatusReadError>;
}
impl PolicyDecisionSummaryReadGapSet {
    /// 将body-compatible gap按canonical顺序转成Step 6 view degraded reasons；no-body kind返回shape error。
    pub fn to_status_view_reasons(&self) -> Result<StatusViewDegradedReasonSet, SandboxPrimaryStatusReadError>;
    /// 将全部typed gap按canonical顺序转成application query safe reasons。
    pub fn to_query_reasons(&self) -> Result<SandboxReasonSet, SandboxPrimaryStatusReadError>;
}
```

conversion保持gap canonical order且一gap一reason，不排序、不去重、不解析reason正文。view conversion只允许
body-compatible kind；no-body kind调用时返回`ReadGapShapeInvalid`。query conversion允许全部kind，但仍不得输出SQL、
driver、policy/body、path、host、process、network或exact existence-sensitive ref。

## 23. No-write、Ownership 与 Adapter Contract

| contract dimension | required | explicitly forbidden |
|---|---|---|
| trait owner | `application::ports::query_read::SandboxPrimaryStatusReader` | contracts/domain/entry持有repository trait |
| durable adapter owner | `infra::query_read`，实现一个logical adapter或按存储拆private helpers | API/Worker/Jobs直接调用infra helper |
| deterministic fake | 以checked outcome/error脚本化，记录method与snapshot ref | 接受generic payload或绕过request validation |
| consistency | method生命周期内只使用caller传入的fair committed snapshot | adapter自行open/close、跨snapshot join、write transaction rollback充当read |
| read set | exact owner、current/exact binding、immutable view/source、typed relation、existing audit linkage | latest/all-context scan、external observability/log store |
| write set | `0` | UoW、CAS、view/index/source write、stale marker、repair/rebuild/refresh |
| identity allocation | `0` | view/audit/trace/cursor/business ref allocation |
| external calls | `0` | resolver、policy engine、isolation backend、runner、capture/handoff/cleanup ports |
| audit | 只读existing linkage；close后可发redacted diagnostic | append business audit、relay publish、记录selector/ref/reason正文 |

adapter可以用private repository helper执行查询，但不得把helper提升为第二public application port。没有
`load_status_snapshot`、`get_latest_*`、`read(kind, selector)`、`Option<View>`或`read_or_materialize`兼容alias；旧正式文档若出现
这些名称，一律保留为historical material并在A4差异审计处理。

虽然`SandboxUnitOfWork`在type hierarchy中继承`SandboxCommittedReadSnapshot`，Query service wiring只能把
`SandboxCommittedReadManager::open()`返回的handle传入本reader；该约束由`7R-04B` assembly type/source audit与测试fake记录
`snapshot_ref`机械检查。reader contract不声称能靠trait-object runtime downcast识别UoW，也不得因此新增rollback-based read。

## 24. A2-F1 回填草稿

正式 `03` Step 7 重装配时，可在A2五组与A3/A4全部收稳后采用以下摘要；当前不回填正式文档：

> `SandboxPrimaryStatusReader` 以三个具名 async method承接 execution、boundary和policy summary Query。每次调用必须消费
> matching permitted access request和一个公平 committed read snapshot，返回family-specific source、absence、
> missing-projection或unavailable闭集。execution按context读取完整chain；boundary exact/current读取whole boundary group；
> policy exact/current读取formal decision与完整action coverage。owner错配、重复current、dangling binding、half-commit和
> cursor relation损坏均为typed integrity error，不得映Empty或Degraded。Query不得写入、分配identity、修复projection、
> 调用external port或追加business audit。

该草稿仍不包含 capture/handoff 等后四个 A2 family、necessary whole-group writer 或 `READ-001` 裁决，不能单独成为正式
Step 7 的完整 read contract。

## 25. A2-F1 Static Self-check

| check | result |
|---|---|
| family logical Query / request / method / outcome | `3/3 | 3/3 | 3/3 | 3/3` |
| closed selector variants | execution `1/1`；boundary `2/2`；policy `2/2` |
| exact/current index key | `5/5` selector variants有机械key与0/1规则 |
| Step 6 source wrapper | execution/boundary/policy=`3/3`，均复用canonical source snapshot |
| exact/current absence proof | execution `1` + missing projection `1`；boundary `2`；policy `2` |
| binding position | boundary/policy exact均保留`Current | Historical`，current selector只接受`Current` |
| method-to-facade map | `3/3` exact once；generic/alias/wildcard=`0/0/0` |
| repository `None -> Empty` | `0`；Empty只来自matching typed absence proof |
| current `>1` / owner mismatch / half-commit downgrade | `0/0/0`；全部typed integrity error |
| write/UoW/identity/repair/external/business-audit | `0/0/0/0/0/0` |
| existing maintenance selection reader usage | `0/3`；9个reader不参与public Query |
| implementation/test/evidence/signoff fact | none；仅静态设计契约 |
| new L1/L2 blocker | `0` |

A2-F1 只构成 `READ-001` 的部分证据。A2-F2~F5、A3 writer/outcome和A4反向审计未完成，因此该blocker与Step 7总
gate继续开放。

## EOF Current Recovery Override: `7R-04A-A2-F1` completed, user review pending

本节取代 A1 recovery block及本文件此前进行中状态，成为本中间产物物理 EOF 的唯一 current authority。A2 已完成
`execution/boundary/policy` 第一 family，后四个 family仍逐批门禁；正式`03-详细设计.md`保持冻结。

| recovery item | current fact |
|---|---|
| consumed gate | `7R-04A-A1 completed_wait_user_review` |
| completed family | `A2-F1 execution/boundary/policy exact reader contracts` |
| reader coverage | logical Query/request/method/outcome/source wrapper=`3/3`；selector variants=`5/5` |
| consistency | one permitted request + one fair committed snapshot；exact/current binding、absence、gap、error均closed |
| forbidden positive path | generic/alias/wildcard/latest/`Option<View>`=`0/0/0/0/0` |
| blocker | `READ-001` remains open；`OUTCOME-001` unchanged；new L1/L2 blocker=`0` |
| next after review | `A2-F2 capture/handoff exact reader contracts` |
| truthfulness | 无implementation commit、run_id、真实evidence alias、测试结果或验收签署 |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_module = exact_read_and_necessary_maintenance_surface
current_task = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A2-F1 execution/boundary/policy completed_wait_user_review
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_in_progress_wait_user_review
batch_status = completed_wait_user_review
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
next_internal_batch = 7R-04A-A2-F2 capture/handoff exact reader contracts
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
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

A2-F1 已完成并停审。用户确认前不得启动 A2-F2、A3/A4、Step 8、正式`03`回填或implementation。

## 26. A2-F2 开工门禁、输入与范围

用户本轮“同意”已消费 `7R-04A-A2-F1 completed_wait_user_review` 停审门。本批只闭合
`GetCaptureSummary` 与 `GetMaterialHandoffStatus` 两个 Query 的 exact reader contract；failure/cleanup/redline、
projection/derived/comparison、reconciliation/audit、necessary writer、A4 closure、Step 8 和正式 `03` 均不在本批。

### 26.1 已读 current authority

| input | consumed contract | A2-F2 constraint |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | 每个模块闭合 trait、typed I/O、调用方/实现方、读取面、错误和事务能力 | 两个 Query 各有具名 request/method/outcome，不用 generic reader。 |
| `standards/document/详细设计书写规范.md` §§4、5.5~5.6 | public type/function需要完整签名、Rustdoc、错误和副作用 | 本批声明均给出 owner、constructor、getter、error与no-write规则。 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` §§22.2、23、24.2、26.2 | capture exact/for-run、handoff exact/current selector及surface mapping | selector和facade不改名、不加latest/optional branch。 |
| `03_ddd_step_06_object_contracts_policy_run_capture.md` §§23~24 | 两个canonical source snapshot、complete/degraded view factory及gap invariant | reader只组装checked source，不复制第二套view schema。 |
| `03_ddd_step_07_idempotency_stored_index_repositories.md` §11 | one fair committed snapshot、read/write capability分离 | method只接受`&mut dyn SandboxCommittedReadSnapshot`。 |
| `03_ddd_step_07_capture_handoff_publisher_observability.md` current EOF | capture/handoff whole-group、same-attempt、no-rollback与relay独立性 | Query不重试、不修复、不回滚capture，不把relay ack当delivery。 |
| `03_ddd_step_07_repositories_uow_indexes.md` identity/repository contract | capture/handoff view ref只能由显式writer分配；Query allocation=0 | reader必须从committed binding读取view ref，不能现场生成。 |

旧正式 `03`、README 或 historical Step 7 中若出现 `get_latest_capture`、`get_current_handoff() -> Option<View>`、
Query内分配view ref或从child row扫描反推owner，均登记为 `historical_material`，不继承为兼容路径。本轮未发现新的L1/L2
上游 blocker；`READ-001 | OUTCOME-001`继续由Step 7内部owner持有。

### 26.2 SOP 问题回答与设计裁决

| question | current answer |
|---|---|
| capture的唯一读取目标是什么 | `Exact`由global typed `CaptureFactRef`定位后校验context/run owner；`ForRun`由`(context_ref, run_ref)`唯一0/1 capture target index定位。 |
| handoff的唯一读取目标是什么 | `Exact`由global typed `HandoffFactRef`定位后校验context owner；`CurrentForContext`只接受context current index唯一0/1 target。 |
| view identity从哪里来 | 由显式materialization writer预分配并与source cursor一起提交的immutable binding；Query分配量固定为0。 |
| capture source如何闭合 | 同snapshot读取run、immutable fact、expected key set、全部available material rows、exact observability row、output/guard/audit linkage。 |
| handoff source如何闭合 | 同snapshot读取fact、complete plan、embedded progress、source material relation、truth cursor和matching relay rows。 |
| 哪些缺口允许带body | capture仅projection-behind、material coverage、observability coverage；handoff仅projection-behind、progress coverage、current relay coverage。source factory仍须接受全部known fields。 |
| 哪些情况不能降级 | unknown child、duplicate row、owner mismatch、wrong plan/progress、gap count mismatch、aggregate/cursor/relay relation损坏和half-commit。 |
| technical failure如何处理 | snapshot/repository unavailable或failed返回reader error；不能直接构造成功`Unavailable`或absence proof。 |
| 是否允许Query维护 | 不允许。capture/handoff adapter、retry、publisher、cleanup/release、projection writer、audit append和identity allocation均为0。 |

### 26.3 A2-F2 内部任务

| ID | status | task | completion gate |
|---|---|---|---|
| `A2-F2-C` | completed | capture request/binding/proof/gap/source/outcome | exact/for-run两variant、whole capture group与view factory输入闭合。 |
| `A2-F2-H` | completed | handoff request/binding/proof/gap/source/outcome | exact/current两variant、plan/progress/material/relay group闭合。 |
| `A2-F2-J` | completed | reader/error/index/facade mapping与静态审计 | Query/request/method/outcome/source=`2/2`，selector variants=`4/4`。 |
| `A2-F2-R` | completed | 四层恢复源与`/tmp`计划同步 | physical EOF统一并停在用户复核门。 |

## 27. Capture Permitted Read Request

`CaptureSummaryReadRequest`是application-local transient carrier，不进入Step 6 registry、Step 8 DTO或durable schema。

```rust
/// 已通过full-read access gate的capture summary读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummaryReadRequest {
    /// 与`GetCaptureSummary`和当前service context完全匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// caller选择的exact或for-run capture selector。
    selector: CaptureSummarySelector,
}

impl CaptureSummaryReadRequest {
    /// 只接受matching Query kind、context/digest和full-read permission。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetCaptureSummaryInput,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;

    /// 返回closed exact/for-run capture selector。
    pub fn selector(&self) -> &CaptureSummarySelector;
}
```

factory依次校验：`query_kind == GetCaptureSummary`、`matches_context(context)`、decision digest等于context digest、
`permits_full_read()==true`，以及selector context等于access scope。`Exact`还要求context/run/capture三个typed ref均按原variant
保留；`ForRun`不得预填capture ref。factory不读run/capture/index，不重算digest，也不把typed ref可构造解释为目标存在。

## 28. Capture Binding 与 Same-snapshot Selection Proof

### 28.1 Immutable view binding

capture fact不直接保存view identity或truth cursor。显式materialization writer必须把二者与exact capture lineage一起提交；
reader只消费该binding。`source_truth_cursor`来自capture whole-group accepted UoW metadata，不能从`captured_at`、audit ref、
repository `Version`或material数量生成。

```rust
/// 一个materialized capture summary view与exact capture source watermark的immutable binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummaryViewBinding {
    /// materialization writer已提交的typed view identity。
    view_ref: CaptureSummaryViewRef,
    /// view唯一归属的controlled execution context。
    context_ref: ControlledExecutionContextRef,
    /// view唯一归属的completed controlled run。
    run_ref: ControlledExecutionRunRef,
    /// view唯一投影的immutable capture fact。
    capture_ref: CaptureFactRef,
    /// view source完整覆盖的capture whole-group truth watermark。
    source_truth_cursor: SandboxTruthCursor,
    /// source capture fact已有的business audit linkage；不是query audit。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// immutable binding提交时间。
    materialized_at: Timestamp,
}

impl CaptureSummaryViewBinding {
    /// 从exact immutable capture-view binding row构造checked binding。
    #[allow(clippy::too_many_arguments)]
    pub fn try_from_committed_index(
        view_ref: CaptureSummaryViewRef,
        context_ref: ControlledExecutionContextRef,
        run_ref: ControlledExecutionRunRef,
        capture_ref: CaptureFactRef,
        source_truth_cursor: SandboxTruthCursor,
        source_audit_trace_ref: SandboxAuditTraceRef,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回materialized capture view identity。
    pub fn view_ref(&self) -> &CaptureSummaryViewRef;
    /// 返回owning context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回owning completed run。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回exact immutable capture fact。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回binding覆盖的whole-group truth watermark。
    pub fn source_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回source capture audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回binding materialization time。
    pub fn materialized_at(&self) -> &Timestamp;
}
```

### 28.2 Found selection proof

```rust
/// closed capture selector命中唯一run/capture/view binding的same-snapshot proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummarySelectionProof {
    /// 本proof消费的exact/for-run selector。
    selector: CaptureSummarySelector,
    /// selector命中的immutable materialized-view binding。
    binding: CaptureSummaryViewBinding,
    /// global typed run truth的matching count；found固定为1。
    selected_run_count: u64,
    /// selected immutable capture fact count；found固定为1。
    selected_capture_count: u64,
    /// run-to-committed-capture relation count；found固定为1。
    run_capture_binding_count: u64,
    /// selected exact view binding count；found固定为1。
    selected_view_binding_count: u64,
    /// current capture whole group要求view覆盖到的truth watermark。
    required_truth_cursor: SandboxTruthCursor,
    /// lookup index已有的business audit linkage。
    lookup_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot lookup observation time。
    observed_at: Timestamp,
}

impl CaptureSummarySelectionProof {
    /// 从run owner、run-to-capture index、capture truth和view binding的同一snapshot读构造proof。
    #[allow(clippy::too_many_arguments)]
    pub fn try_from_committed_indexes(
        selector: CaptureSummarySelector,
        binding: CaptureSummaryViewBinding,
        selected_run_count: u64,
        selected_capture_count: u64,
        run_capture_binding_count: u64,
        selected_view_binding_count: u64,
        required_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回checked selector。
    pub fn selector(&self) -> &CaptureSummarySelector;
    /// 返回selected immutable view binding。
    pub fn binding(&self) -> &CaptureSummaryViewBinding;
    /// 返回required capture whole-group watermark。
    pub fn required_truth_cursor(&self) -> SandboxTruthCursor;
    /// 判断materialized source是否严格落后于required watermark。
    pub fn is_stale(&self) -> bool;
}
```

selection factory必须逐项满足：

1. 四个count均为1；任一`>1`为`CardinalityIntegrityInvalid`，不得选timestamp winner。
2. global typed run/capture load、binding和selector的context/run/capture逐项全等；owner mismatch不是absence。
3. `ForRun`的capture ref只能来自`(context_ref,run_ref)`唯一target index，并等于binding/capture fact。
4. `Exact`先按global typed capture ref读取，再校验其run/context；run-to-capture target若存在必须指向同一capture。
5. capture fact的expected material keys、observability ref、audit ref与binding source lineage一致；child row不参与选择winner。
6. `required_truth_cursor >= binding.source_truth_cursor`且`observed_at >= materialized_at`；所有count/cursor/ref来自同一snapshot。

### 28.3 Typed absence proof

repository `None/NotFound`不是proof。absence只有在owner和全部相关index可完整读取、计数落入下列closed shape时形成。

```rust
/// capture selector在完整run/capture/view index读取后形成的zero-cardinality proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureSummaryAbsenceProof {
    /// run存在但尚无committed capture target或view binding。
    CaptureAbsentForRun {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// owning completed run ref。
        run_ref: ControlledExecutionRunRef,
        /// exact context owner count；固定为1。
        context_count: u64,
        /// global typed run count；固定为1。
        run_count: u64,
        /// run-to-committed-capture relation count；absence固定为0。
        run_capture_binding_count: u64,
        /// matching view binding count；absence固定为0。
        view_binding_count: u64,
        /// 完整lookup覆盖的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot observation time。
        observed_at: Timestamp,
    },
    /// Exact selector的global typed capture ref与matching view binding均不存在。
    ExactCaptureAbsent {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// caller声明的owning run ref。
        run_ref: ControlledExecutionRunRef,
        /// caller明确选择的immutable capture ref。
        capture_ref: CaptureFactRef,
        /// context owner count；允许0或1。
        context_count: u64,
        /// global typed run count；允许0或1。
        run_count: u64,
        /// selected exact capture truth count；absence固定为0。
        exact_capture_count: u64,
        /// run-to-committed-capture relation count；absence固定为0。
        run_capture_binding_count: u64,
        /// selected exact view binding count；absence固定为0。
        exact_view_binding_count: u64,
        /// 完整lookup覆盖的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot observation time。
        observed_at: Timestamp,
    },
}

impl CaptureSummaryAbsenceProof {
    /// 只接受matching ForRun selector与`run/capture-relation/view=(1,0,0)`。
    #[allow(clippy::too_many_arguments)]
    pub fn try_capture_absent_for_run(
        selector: &CaptureSummarySelector,
        context_count: u64,
        run_count: u64,
        run_capture_binding_count: u64,
        view_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 只接受matching Exact selector与`capture/relation/view=(0,0,0)`。
    #[allow(clippy::too_many_arguments)]
    pub fn try_exact_capture_absent(
        selector: &CaptureSummarySelector,
        context_count: u64,
        run_count: u64,
        exact_capture_count: u64,
        run_capture_binding_count: u64,
        exact_view_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 判断proof variant及其typed keys是否与selector逐字段匹配。
    pub fn selector_matches(&self, selector: &CaptureSummarySelector) -> bool;
}
```

`ForRun`只有`run=1,capture-relation=0,view=0`才能形成Empty；run不存在不是该selector的合法absence proof。
`run=0,relation=1`、`capture=0,relation=1`、`capture=0,view=1`、任何count `>1`、global typed capture存在但owner
run/context不匹配，或relation指向不存在capture均为integrity error。`run=1,capture=1,view=0`不是Empty，而是
`ViewBindingUnavailable`；Query不得现场分配
`CaptureSummaryViewRef`或从fact字段构造伪binding。

## 29. Capture Typed Read Gap

```rust
/// capture summary formal read的finite gap family。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum CaptureSummaryReadGapKind {
    /// capture truth存在，但immutable view binding暂不可完整读取。
    ViewBinding,
    /// safe materialized capture source落后于required whole-group watermark。
    ProjectionBehind,
    /// expected captured-material keys只形成安全子集coverage。
    MaterialCoverage,
    /// fact预绑定的matching observability material row暂不可安全读取。
    ObservabilityCoverage,
    /// binding已命中，但本次无法形成任何caller-safe source。
    SourceUnavailable,
}

/// capture summary read允许向上游传递的finite、selector-bound gap。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureSummaryReadGap {
    /// capture target存在，但binding index没有提供完整1/1 proof。
    ViewBindingUnavailable {
        /// 与reader request全等的closed selector。
        selector: CaptureSummarySelector,
        /// current capture group要求materialization覆盖到的watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe binding dependency reason。
        reason: SandboxReason,
    },
    /// relation-checked capture source可读，但binding严格落后于required watermark。
    ProjectionBehind {
        /// 与reader request全等的closed selector。
        selector: CaptureSummarySelector,
        /// selected materialized capture view identity。
        view_ref: CaptureSummaryViewRef,
        /// current capture group要求覆盖到的watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// safe source实际覆盖的watermark。
        available_truth_cursor: SandboxTruthCursor,
        /// caller-safe stale reason。
        reason: SandboxReason,
    },
    /// source fact与known rows关系安全，但expected material key coverage不完整。
    MaterialCoverageGap {
        /// 与reader request全等的closed selector。
        selector: CaptureSummarySelector,
        /// selected materialized capture view identity。
        view_ref: CaptureSummaryViewRef,
        /// fact声明的expected material key数量。
        expected_material_count: u64,
        /// 本snapshot可安全读取的matching material row数量。
        available_material_count: u64,
        /// current capture group要求覆盖到的watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe coverage reason。
        reason: SandboxReason,
    },
    /// source fact安全可读，但预绑定observability row暂不可安全读取。
    ObservabilityCoverageGap {
        /// 与reader request全等的closed selector。
        selector: CaptureSummarySelector,
        /// selected materialized capture view identity。
        view_ref: CaptureSummaryViewRef,
        /// immutable fact预绑定的exact observability material ref。
        expected_observability_material_ref: ObservabilityMaterialRef,
        /// current capture group要求覆盖到的watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe coverage reason。
        reason: SandboxReason,
    },
    /// target与binding存在，但source dependency不能形成任何安全source。
    SourceUnavailable {
        /// 与reader request全等的closed selector。
        selector: CaptureSummarySelector,
        /// selected materialized capture view identity。
        view_ref: CaptureSummaryViewRef,
        /// current capture group要求覆盖到的watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe source dependency reason。
        reason: SandboxReason,
    },
}

impl CaptureSummaryReadGap {
    /// 返回finite gap kind。
    pub fn kind(&self) -> CaptureSummaryReadGapKind;
    /// 返回gap绑定的closed selector。
    pub fn selector(&self) -> &CaptureSummarySelector;
}

/// 保存non-empty、same-selector、kind-unique capture read gaps。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummaryReadGapSet(
    /// selector全等、按finite kind canonical排序且同kind至多一项的gaps。
    Vec<CaptureSummaryReadGap>,
);

impl CaptureSummaryReadGapSet {
    /// 构造non-empty、same-selector、kind-unique且canonical ordered的gap set。
    pub fn try_new(
        gaps: Vec<CaptureSummaryReadGap>,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回canonical ordered gap切片。
    pub fn as_slice(&self) -> &[CaptureSummaryReadGap];

    /// 将body-compatible gap转为Step 6 checked degraded reasons。
    pub fn to_status_view_reasons(
        &self,
    ) -> Result<StatusViewDegradedReasonSet, SandboxCaptureHandoffReadError>;

    /// 将全部typed gap转为application query safe reasons。
    pub fn to_query_reasons(
        &self,
    ) -> Result<SandboxReasonSet, SandboxCaptureHandoffReadError>;
}
```

`MaterialCoverageGap`要求`available < expected`，且source中的available rows是expected keys的严格子集；unknown/duplicate key、
kind不一致或gap count与完整row count冲突为`SourceContractInvalid`。`ObservabilityCoverageGap`只接受fact预绑定row缺失；wrong
source basis、wrong ref或relation损坏是integrity error。两种coverage gap都可与`ProjectionBehind`共存并形成degraded body。
`ViewBindingUnavailable | SourceUnavailable`只能形成no-body outcome，不能与body-compatible gap或source混用。

## 30. Capture Checked Source 与 Closed Outcome

```rust
/// capture reader完成same-snapshot selection后的checked source wrapper。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummaryReadSource {
    /// exact/for-run selection与binding proof。
    selection: CaptureSummarySelectionProof,
    /// Step 6 relation-checked whole capture group source。
    source: CaptureSummarySourceSnapshot,
    /// stale或safe incomplete source的typed gaps；fresh source为None。
    read_gaps: Option<CaptureSummaryReadGapSet>,
}

impl CaptureSummaryReadSource {
    /// 构造fresh complete source；binding/source lineage与coverage必须完整。
    pub fn complete(
        selection: CaptureSummarySelectionProof,
        source: CaptureSummarySourceSnapshot,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 构造可安全形成stale/degraded body的source；gap必须与source缺口精确对应。
    pub fn degraded(
        selection: CaptureSummarySelectionProof,
        source: CaptureSummarySourceSnapshot,
        read_gaps: CaptureSummaryReadGapSet,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回same-snapshot selection proof。
    pub fn selection(&self) -> &CaptureSummarySelectionProof;
    /// 返回Step 6 checked capture source。
    pub fn source(&self) -> &CaptureSummarySourceSnapshot;
    /// 返回optional typed read gaps。
    pub fn read_gaps(&self) -> Option<&CaptureSummaryReadGapSet>;
    /// 判断source是否包含projection-behind gap。
    pub fn is_stale(&self) -> bool;
    /// 判断source是否包含material/observability coverage gap。
    pub fn is_degraded(&self) -> bool;
}

/// capture summary exact/for-run reader的closed business outcome。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureSummaryLookupOutcome {
    /// selected binding与caller-safe source可进入Step 6 checked view factory。
    ViewSource {
        /// fresh/stale/degraded source wrapper。
        source: CaptureSummaryReadSource,
    },
    /// selector对应的run/capture target由完整zero-cardinality proof确认不存在。
    Absent {
        /// matching exact/for-run absence proof。
        proof: CaptureSummaryAbsenceProof,
    },
    /// target存在，但没有任何caller-safe body可形成。
    Unavailable {
        /// 与request完全一致的closed selector。
        selector: CaptureSummarySelector,
        /// 只含no-body-compatible kind的non-empty gap set。
        read_gaps: CaptureSummaryReadGapSet,
    },
}

impl CaptureSummaryLookupOutcome {
    /// 构造可进入Step 6 complete/degraded view factory的source branch。
    pub fn view_source(source: CaptureSummaryReadSource) -> Self;

    /// 构造matching exact/for-run absence branch。
    pub fn absent(
        selector: &CaptureSummarySelector,
        proof: CaptureSummaryAbsenceProof,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 构造没有caller-safe body的typed unavailable branch。
    pub fn unavailable(
        selector: CaptureSummarySelector,
        read_gaps: CaptureSummaryReadGapSet,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;
}
```

`complete`要求selector/binding/source lineage逐项全等、binding audit ref等于source audit ref、source
`is_complete_read_source()==true`、binding cursor等于required cursor且gap为空。`degraded`要求source仍由
`CaptureSummarySourceSnapshot::try_new`接受；material/observability gap必须与source predicate逐项对应。stale-only source仍完整；
coverage gap存在时最终surface固定`Degraded`。technical repository/snapshot failure、unknown child、half-commit和source factory
error均返回`Err`，不得进入`Absent | Unavailable`。

## EOF Current Working Batch: `7R-04A-A2-F2-C` capture contract completed

本节取代A2-F1停审状态，成为本文件物理EOF的current working authority。capture contract内容已写入，handoff与family join尚未
完成，因此A2-F2仍为`in_progress`，不得将本状态解释为用户复核门或启动A2-F3。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F2 capture/handoff exact reader contracts in_progress
completed_internal_part = A2-F2-C capture request/binding/proof/gap/source/outcome
pending_internal_parts = A2-F2-H handoff|A2-F2-J join|A2-F2-R recovery sync
query_reader_coverage = 4/13
selector_variant_coverage = 7/7_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 31. Material Handoff Permitted Read Request

`MaterialHandoffStatusReadRequest`与capture request同属application-local transient carrier。它不接收cleanup guard、retry
selection、provider receipt或public DTO；这些对象不能改变closed selector。

```rust
/// 已通过full-read access gate的material handoff status读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusReadRequest {
    /// 与`GetMaterialHandoffStatus`和当前service context完全匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// caller选择的exact或current-for-context handoff selector。
    selector: MaterialHandoffStatusSelector,
}

impl MaterialHandoffStatusReadRequest {
    /// 只接受matching Query kind、context/digest和full-read permission。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetMaterialHandoffStatusInput,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;

    /// 返回closed exact/current handoff selector。
    pub fn selector(&self) -> &MaterialHandoffStatusSelector;
}
```

factory依次校验：`query_kind == GetMaterialHandoffStatus`、`matches_context(context)`、decision/context digest全等、
`permits_full_read()==true`和selector context等于access scope。`Exact`按值保留caller handoff ref；`CurrentForContext`不能
携带hint、timestamp、capture ref或target kind。factory不读取target、plan、progress、relay、cleanup guard或provider。

## 32. Handoff Binding 与 Same-snapshot Selection Proof

### 32.1 Binding position 与 immutable view binding

`Exact`可读取caller明确选择的非current handoff batch；`CurrentForContext`只能读取context唯一current batch。position只描述
selected view binding相对current index的位置，不是`HandoffFactStatus`，也不影响target progress。

```rust
/// selected handoff binding相对context current index的位置；不是handoff lifecycle状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum MaterialHandoffStatusBindingPosition {
    /// selected exact binding就是context当前唯一handoff binding。
    Current,
    /// selected exact binding不是context current binding，或context当前没有handoff binding。
    Historical,
}

/// 一个materialized handoff status view与exact handoff source watermark的immutable binding。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusViewBinding {
    /// materialization writer已提交的typed view identity。
    view_ref: MaterialHandoffStatusViewRef,
    /// view唯一归属的controlled execution context。
    context_ref: ControlledExecutionContextRef,
    /// view唯一投影的handoff aggregate identity。
    handoff_ref: HandoffFactRef,
    /// materialized source自身对应的committed handoff truth watermark。
    source_truth_cursor: SandboxTruthCursor,
    /// source handoff group已有的business audit linkage；不是query audit。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// immutable binding提交时间。
    materialized_at: Timestamp,
}

impl MaterialHandoffStatusViewBinding {
    /// 从exact immutable handoff-view binding row构造checked binding。
    pub fn try_from_committed_index(
        view_ref: MaterialHandoffStatusViewRef,
        context_ref: ControlledExecutionContextRef,
        handoff_ref: HandoffFactRef,
        source_truth_cursor: SandboxTruthCursor,
        source_audit_trace_ref: SandboxAuditTraceRef,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回materialized handoff view identity。
    pub fn view_ref(&self) -> &MaterialHandoffStatusViewRef;
    /// 返回owning context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回exact owning handoff fact。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回binding source truth watermark。
    pub fn source_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回source handoff audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回binding materialization time。
    pub fn materialized_at(&self) -> &Timestamp;
}
```

`MaterialHandoffStatusViewRef`只能由显式materialization writer分配并写入binding；reader/service/factory分配量固定为0。
`source_truth_cursor`必须等于materialized `MaterialHandoffStatusSourceSnapshot.handoff_truth_cursor()`，不能由aggregate
`Version`、最后attempt time、receipt或relay cursor猜测。

### 32.2 Found selection proof

```rust
/// closed handoff selector命中唯一target/view binding的same-snapshot proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusSelectionProof {
    /// 本proof消费的exact/current selector。
    selector: MaterialHandoffStatusSelector,
    /// selector命中的immutable materialized-view binding。
    binding: MaterialHandoffStatusViewBinding,
    /// selected binding相对context current index的位置。
    binding_position: MaterialHandoffStatusBindingPosition,
    /// same-snapshot current index指向的handoff；current count为0时为None。
    current_handoff_ref: Option<HandoffFactRef>,
    /// selected exact handoff truth count；found固定为1。
    selected_target_count: u64,
    /// selected exact view binding count；found固定为1。
    selected_view_binding_count: u64,
    /// context current-handoff relation count；只允许0或1。
    current_handoff_binding_count: u64,
    /// selected handoff current truth要求view覆盖到的watermark。
    required_truth_cursor: SandboxTruthCursor,
    /// lookup index已有的business audit linkage。
    lookup_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot lookup observation time。
    observed_at: Timestamp,
}

impl MaterialHandoffStatusSelectionProof {
    /// 从global handoff owner、exact view binding和context current index的同一snapshot读构造proof。
    #[allow(clippy::too_many_arguments)]
    pub fn try_from_committed_indexes(
        selector: MaterialHandoffStatusSelector,
        binding: MaterialHandoffStatusViewBinding,
        binding_position: MaterialHandoffStatusBindingPosition,
        current_handoff_ref: Option<HandoffFactRef>,
        selected_target_count: u64,
        selected_view_binding_count: u64,
        current_handoff_binding_count: u64,
        required_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回checked selector。
    pub fn selector(&self) -> &MaterialHandoffStatusSelector;
    /// 返回selected immutable view binding。
    pub fn binding(&self) -> &MaterialHandoffStatusViewBinding;
    /// 返回selected binding相对current index的位置。
    pub fn binding_position(&self) -> MaterialHandoffStatusBindingPosition;
    /// 返回same-snapshot current handoff ref。
    pub fn current_handoff_ref(&self) -> Option<&HandoffFactRef>;
    /// 返回selected handoff current required watermark。
    pub fn required_truth_cursor(&self) -> SandboxTruthCursor;
    /// 判断materialized source是否严格落后于required watermark。
    pub fn is_stale(&self) -> bool;
}
```

selection factory的closed rules：

1. selected target/view count均为1；current count只能为0或1并与`current_handoff_ref.is_some()`等价。
2. selector、global typed target、binding和loaded source的context/handoff逐项全等；owner mismatch不是absence。
3. `CurrentForContext`要求current count=1、selected ref等于current ref且position=`Current`。
4. `Exact`要求selected ref等于caller ref；等于current时position=`Current`，否则position=`Historical`。
5. source lineage、complete plan和embedded progress均来自selected handoff；capture-source/terminal-source路径由ownership relation决定，
   不能由selector、capture row缺失或target kind猜测。
6. `required_truth_cursor >= binding.source_truth_cursor`、`observed_at >= materialized_at`；source cursor必须等于binding cursor。

### 32.3 Typed absence proof

```rust
/// handoff selector在完整context/target/view/current index读取后形成的zero-cardinality proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MaterialHandoffStatusAbsenceProof {
    /// context存在但没有committed current handoff relation或matching view binding。
    Current {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// exact context owner count；固定为1。
        context_count: u64,
        /// current handoff target relation count；absence固定为0。
        current_target_count: u64,
        /// current target的matching view binding count；absence固定为0。
        current_view_binding_count: u64,
        /// 完整lookup覆盖的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot observation time。
        observed_at: Timestamp,
    },
    /// caller明确选择的global typed handoff与exact view binding均不存在。
    Exact {
        /// 已通过access decision的exact context。
        context_ref: ControlledExecutionContextRef,
        /// caller明确选择的handoff fact identity。
        handoff_ref: HandoffFactRef,
        /// exact context owner count；允许0或1。
        context_count: u64,
        /// selected global handoff truth count；absence固定为0。
        exact_target_count: u64,
        /// selected exact view binding count；absence固定为0。
        exact_view_binding_count: u64,
        /// same-snapshot current index指向的另一handoff；current count为0时为None。
        current_handoff_ref: Option<HandoffFactRef>,
        /// context current-handoff relation count；只允许0或1。
        current_handoff_binding_count: u64,
        /// 完整lookup覆盖的truth watermark。
        lookup_truth_cursor: SandboxTruthCursor,
        /// lookup index已有的audit linkage。
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        /// same-snapshot observation time。
        observed_at: Timestamp,
    },
}

impl MaterialHandoffStatusAbsenceProof {
    /// 只接受matching CurrentForContext selector与`context/target/view=(1,0,0)`。
    pub fn try_current_absent(
        selector: &MaterialHandoffStatusSelector,
        context_count: u64,
        current_target_count: u64,
        current_view_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 只接受matching Exact selector、global target/view `(0,0)`和合法0/1 current relation。
    #[allow(clippy::too_many_arguments)]
    pub fn try_exact_absent(
        selector: &MaterialHandoffStatusSelector,
        context_count: u64,
        exact_target_count: u64,
        exact_view_binding_count: u64,
        current_handoff_ref: Option<HandoffFactRef>,
        current_handoff_binding_count: u64,
        lookup_truth_cursor: SandboxTruthCursor,
        lookup_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 判断proof variant及其typed keys是否与selector逐字段匹配。
    pub fn selector_matches(&self, selector: &MaterialHandoffStatusSelector) -> bool;
}
```

`CurrentForContext`只有context已存在且current target/view均为0时形成Empty；context不存在不借此证明handoff absent。
`Exact`允许context count 0/1，但global handoff存在且owner context不等selector时必须报integrity error。exact absence时current
index可以合法指向另一个handoff；若指向本应不存在的exact ref，则为dangling current integrity error。target=1、view=0形成
`ViewBindingUnavailable`，target=0、view=1、任一count>1或current ref/count不一致均不能映Empty。

## 33. Handoff Typed Read Gap

```rust
/// material handoff status formal read的finite gap family。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum MaterialHandoffStatusReadGapKind {
    /// handoff target存在，但immutable view binding暂不可完整读取。
    ViewBinding,
    /// safe materialized handoff source落后于selected target current watermark。
    ProjectionBehind,
    /// complete target plan只有安全的progress子集可读。
    ProgressCoverage,
    /// current source truth cursor缺少matching relay observation row。
    CurrentRelayCoverage,
    /// binding已命中，但本次无法形成任何caller-safe source。
    SourceUnavailable,
}

/// handoff status read允许向上游传递的finite、selector-bound gap。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MaterialHandoffStatusReadGap {
    /// handoff target存在，但view binding index没有提供完整1/1 proof。
    ViewBindingUnavailable {
        /// 与reader request全等的closed selector。
        selector: MaterialHandoffStatusSelector,
        /// selected handoff current truth要求materialization覆盖到的watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe binding dependency reason。
        reason: SandboxReason,
    },
    /// relation-checked handoff source可读，但binding严格落后于required watermark。
    ProjectionBehind {
        /// 与reader request全等的closed selector。
        selector: MaterialHandoffStatusSelector,
        /// selected materialized handoff view identity。
        view_ref: MaterialHandoffStatusViewRef,
        /// selected handoff current required watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// safe materialized source实际覆盖的watermark。
        available_truth_cursor: SandboxTruthCursor,
        /// caller-safe stale reason。
        reason: SandboxReason,
    },
    /// immutable plan完整，但available embedded progress只覆盖plan的安全子集。
    ProgressCoverageGap {
        /// 与reader request全等的closed selector。
        selector: MaterialHandoffStatusSelector,
        /// selected materialized handoff view identity。
        view_ref: MaterialHandoffStatusViewRef,
        /// complete plan中的target数量。
        planned_target_count: u64,
        /// 本snapshot可安全读取的matching progress数量。
        available_progress_count: u64,
        /// materialized source自身的truth watermark。
        source_truth_cursor: SandboxTruthCursor,
        /// caller-safe progress coverage reason。
        reason: SandboxReason,
    },
    /// source group安全可读，但没有matching current-cursor relay observation。
    CurrentRelayCoverageGap {
        /// 与reader request全等的closed selector。
        selector: MaterialHandoffStatusSelector,
        /// selected materialized handoff view identity。
        view_ref: MaterialHandoffStatusViewRef,
        /// 必须由relay row exact匹配的source truth cursor。
        source_truth_cursor: SandboxTruthCursor,
        /// available historical或其它cursor relay row数量；仅用于coverage诊断。
        available_relay_count: u64,
        /// caller-safe relay coverage reason。
        reason: SandboxReason,
    },
    /// target与binding存在，但source dependency不能形成任何安全source。
    SourceUnavailable {
        /// 与reader request全等的closed selector。
        selector: MaterialHandoffStatusSelector,
        /// selected materialized handoff view identity。
        view_ref: MaterialHandoffStatusViewRef,
        /// selected handoff current required watermark。
        required_truth_cursor: SandboxTruthCursor,
        /// caller-safe source dependency reason。
        reason: SandboxReason,
    },
}

impl MaterialHandoffStatusReadGap {
    /// 返回finite gap kind。
    pub fn kind(&self) -> MaterialHandoffStatusReadGapKind;
    /// 返回gap绑定的closed selector。
    pub fn selector(&self) -> &MaterialHandoffStatusSelector;
}

/// 保存non-empty、same-selector、kind-unique handoff read gaps。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusReadGapSet(
    /// selector全等、按finite kind canonical排序且同kind至多一项的gaps。
    Vec<MaterialHandoffStatusReadGap>,
);

impl MaterialHandoffStatusReadGapSet {
    /// 构造non-empty、same-selector、kind-unique且canonical ordered的gap set。
    pub fn try_new(
        gaps: Vec<MaterialHandoffStatusReadGap>,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回canonical ordered gap切片。
    pub fn as_slice(&self) -> &[MaterialHandoffStatusReadGap];

    /// 将body-compatible gap转为Step 6 checked degraded reasons。
    pub fn to_status_view_reasons(
        &self,
    ) -> Result<StatusViewDegradedReasonSet, SandboxCaptureHandoffReadError>;

    /// 将全部typed gap转为application query safe reasons。
    pub fn to_query_reasons(
        &self,
    ) -> Result<SandboxReasonSet, SandboxCaptureHandoffReadError>;
}
```

`ProgressCoverageGap`要求`available < planned`且available progress是plan的严格子集；unknown target、duplicate target、selection
漂移或aggregate与完整progress不一致是`HandoffGroupIntegrityInvalid`。progress不完整时Step 6 source固定
`material_deliveries=None`，不得再新增第二个delivery gap或从available rows推导成功。`CurrentRelayCoverageGap`只允许current
cursor matching row数量为0；wrong source/event/status/cursor relation为integrity error。两种coverage gap可与
`ProjectionBehind`共存并形成degraded body；`ViewBindingUnavailable | SourceUnavailable`只能形成no-body outcome。

## 34. Handoff Checked Source 与 Closed Outcome

```rust
/// handoff reader完成same-snapshot selection后的checked source wrapper。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusReadSource {
    /// exact/current selection与binding proof。
    selection: MaterialHandoffStatusSelectionProof,
    /// Step 6 relation-checked whole handoff group source。
    source: MaterialHandoffStatusSourceSnapshot,
    /// stale或safe incomplete source的typed gaps；fresh source为None。
    read_gaps: Option<MaterialHandoffStatusReadGapSet>,
}

impl MaterialHandoffStatusReadSource {
    /// 构造fresh complete source；binding/source cursor、plan/progress/relay必须完整。
    pub fn complete(
        selection: MaterialHandoffStatusSelectionProof,
        source: MaterialHandoffStatusSourceSnapshot,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 构造可安全形成stale/degraded body的source；gap必须与source predicates精确对应。
    pub fn degraded(
        selection: MaterialHandoffStatusSelectionProof,
        source: MaterialHandoffStatusSourceSnapshot,
        read_gaps: MaterialHandoffStatusReadGapSet,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 返回same-snapshot selection proof。
    pub fn selection(&self) -> &MaterialHandoffStatusSelectionProof;
    /// 返回Step 6 checked handoff source。
    pub fn source(&self) -> &MaterialHandoffStatusSourceSnapshot;
    /// 返回optional typed read gaps。
    pub fn read_gaps(&self) -> Option<&MaterialHandoffStatusReadGapSet>;
    /// 判断source是否包含projection-behind gap。
    pub fn is_stale(&self) -> bool;
    /// 判断source是否包含progress/current-relay coverage gap。
    pub fn is_degraded(&self) -> bool;
}

/// material handoff status exact/current reader的closed business outcome。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MaterialHandoffStatusLookupOutcome {
    /// selected binding与caller-safe source可进入Step 6 checked view factory。
    ViewSource {
        /// fresh/stale/degraded source wrapper。
        source: MaterialHandoffStatusReadSource,
    },
    /// selector对应target由完整zero-cardinality proof确认不存在。
    Absent {
        /// matching exact/current absence proof。
        proof: MaterialHandoffStatusAbsenceProof,
    },
    /// target存在，但没有任何caller-safe body可形成。
    Unavailable {
        /// 与request完全一致的closed selector。
        selector: MaterialHandoffStatusSelector,
        /// 只含no-body-compatible kind的non-empty gap set。
        read_gaps: MaterialHandoffStatusReadGapSet,
    },
}

impl MaterialHandoffStatusLookupOutcome {
    /// 构造可进入Step 6 complete/degraded view factory的source branch。
    pub fn view_source(source: MaterialHandoffStatusReadSource) -> Self;

    /// 构造matching exact/current absence branch。
    pub fn absent(
        selector: &MaterialHandoffStatusSelector,
        proof: MaterialHandoffStatusAbsenceProof,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;

    /// 构造没有caller-safe body的typed unavailable branch。
    pub fn unavailable(
        selector: MaterialHandoffStatusSelector,
        read_gaps: MaterialHandoffStatusReadGapSet,
    ) -> Result<Self, SandboxCaptureHandoffReadError>;
}
```

`complete`要求binding/source context、handoff、audit和cursor全等，selection required cursor等于binding cursor，source
`is_complete_read_source()==true`且gap为空。`degraded`仍要求Step 6 source factory接受complete plan、available progress、persisted
aggregate和known relay rows；source cursor必须等于binding cursor。stale-only source可返回`Stale`；progress/relay gap存在时
最终surface固定`Degraded`。Query不得从current `HandoffFact`重算旧materialized source、把missing progress补`Pending`、把relay
Published解释为target Delivered、加载cleanup guard重评，或因handoff failure回滚capture/material truth。

## EOF Current Working Batch: `7R-04A-A2-F2-H` handoff contract completed

本节取代capture-only working state，成为本文件物理EOF的current working authority。capture/handoff两组内容已写入；shared
reader/error/index/facade join、静态审计和恢复源同步尚未完成，因此A2-F2仍为`in_progress`。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F2 capture/handoff exact reader contracts in_progress
completed_internal_parts = A2-F2-C capture|A2-F2-H handoff
pending_internal_parts = A2-F2-J join|A2-F2-R recovery sync
query_reader_coverage = 5/13
selector_variant_coverage = 9/9_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 35. Capture/Handoff Reader Port 与 Closed Error

capture 与 handoff 的 source bundle、absence proof 和 gap family不同，不能压成
`read(kind, selector) -> Option<View>`。application port只承接已通过access gate的family request和caller提供的一个
fair committed snapshot；它不拥有Step 6 view schema、domain transition或repository写能力。

```rust
/// capture summary与material handoff status两个exact Query的application-owned read port。
pub trait SandboxCaptureHandoffReader: Send + Sync {
    /// 在一个fair committed snapshot中读取exact/for-run capture whole-group source。
    async fn read_capture_summary_source(
        &self,
        request: &CaptureSummaryReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<CaptureSummaryLookupOutcome, SandboxCaptureHandoffReadError>;

    /// 在同一snapshot中读取exact/current handoff plan、progress、material与relay source。
    async fn read_material_handoff_status_source(
        &self,
        request: &MaterialHandoffStatusReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<MaterialHandoffStatusLookupOutcome, SandboxCaptureHandoffReadError>;
}
```

若 `7R-04B` 的trait-object toolchain不能使用native `async fn in trait`，只能逐method改为语义等价的borrowed boxed future；
不得新增第二个callable、`'static` future、detached task或把snapshot放入reader字段：

```rust
fn read_capture_summary_source<'a>(
    &'a self,
    request: &'a CaptureSummaryReadRequest,
    snapshot: &'a mut dyn SandboxCommittedReadSnapshot,
) -> Pin<Box<dyn Future<Output = Result<CaptureSummaryLookupOutcome, SandboxCaptureHandoffReadError>> + Send + 'a>>;
```

### 35.1 Reader error

```rust
/// capture/handoff exact reader的有限调用、repository、source与integrity失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxCaptureHandoffReadError {
    /// request中的Query kind与被调用的family method不一致。
    QueryKindMismatch,
    /// access decision与service context的actor、scope或digest不一致。
    AccessDecisionContextMismatch,
    /// 非Permitted decision试图进入full reader。
    FullReadNotPermitted,
    /// request selector与input或family method不一致。
    SelectorMismatch,
    /// snapshot handle不属于当前read manager或已经被消费/关闭。
    ReadSnapshotUsageInvalid,
    /// snapshot暂不可用或无法保证同一committed generation。
    ReadSnapshotUnavailable {
        /// 不携带driver、path、SQL或raw provider cause的safe reason。
        reason: SandboxReason,
    },
    /// exact owner/index/source repository暂不可用；不是absence proof。
    RepositoryUnavailable {
        /// caller-safe dependency reason。
        reason: SandboxReason,
    },
    /// repository返回不可分类的内部失败；不得包装成业务Unavailable。
    RepositoryFailed {
        /// caller-safe internal reason。
        reason: SandboxReason,
    },
    /// 任一exact/current lookup count不满足规定的0/1闭集。
    CardinalityIntegrityInvalid,
    /// typed owner、selector、lineage或source context不一致。
    OwnerRelationIntegrityInvalid,
    /// current index、exact binding和selected target的关系不一致。
    CurrentBindingIntegrityInvalid,
    /// capture fact、material、observability、run relation或gap count损坏。
    CaptureGroupIntegrityInvalid,
    /// handoff plan、embedded progress、material selection或aggregate损坏。
    HandoffGroupIntegrityInvalid,
    /// binding存在但对应view/source row缺失、重复或未原子提交。
    MaterializationIntegrityInvalid,
    /// cursor、audit linkage、timestamp或snapshot generation关系非法。
    SnapshotRelationIntegrityInvalid,
    /// typed gap的selector、kind、cursor、count或reason shape非法。
    ReadGapShapeInvalid,
    /// absence proof与selector或计数不一致。
    AbsenceProofInvalid,
    /// lookup outcome把source、proof或gap放入错误branch。
    LookupOutcomeInvalid,
    /// Step 6 checked source或view factory拒绝已加载whole group。
    SourceContractInvalid,
    /// reader尝试write、identity allocation、repair、external call或business audit append。
    NoWriteViolation,
}
```

`ReadSnapshotUnavailable | RepositoryUnavailable | RepositoryFailed`必须作为application error离开reader；不能直接构造
成功的no-body `Unavailable`、`Empty`或degraded body。只有成功读取target/binding且dependency形成了
`ViewBindingUnavailable | SourceUnavailable` gap，才允许构造lookup outcome的`Unavailable` branch。

reader error到application detail固定如下，不由infra或facade自行选择：

| reader error family | application detail | successful surface | recovery owner |
|---|---|---|---|
| `ReadSnapshotUnavailable | RepositoryUnavailable` | `PortUnavailable` | none | dependency/repository owner |
| `RepositoryFailed` | `InternalInvariantViolation` | none | implementation/data-integrity owner |
| `QueryKindMismatch | AccessDecisionContextMismatch | FullReadNotPermitted | SelectorMismatch` | `QueryAccessShapeInvalid` | none | application entry/facade owner |
| `ReadSnapshotUsageInvalid` | `InternalInvariantViolation` | none | implementation owner |
| `NoWriteViolation` | `NoWriteViolation` | none | implementation owner |
| all integrity/shape/contract variants | `InternalInvariantViolation` | none | migration/quarantine/reconciliation owner |
| successful typed lookup `Unavailable` | no application error | no-body `Unavailable` | explicit source/maintenance owner |

## 36. Capture/Handoff Exact Index、Bundle 与 Cardinality Matrix

下表定义logical key、required bundle和合法基数；不规定SQL、物理表、driver、lock或存储引擎。所有读取必须发生在
同一 `snapshot.snapshot_ref()` 中，不能用第二snapshot补child row、cursor或relay。

| Query / selector | primary target/index key | owner/relation index | immutable view binding key | required whole-group bundle | legal cardinality |
|---|---|---|---|---|---|
| capture `Exact` | global typed `capture_ref` | context/run owner + `(context_ref,run_ref,capture_ref)` committed relation | `(context_ref,run_ref,capture_ref,view_ref)` | run lineage、fact、guard、expected keys、known material rows、output、exact observability row、audit、source cursor | found `run/capture/relation/view=(1,1,1,1)`；absence `capture/relation/view=(0,0,0)`；context/run各0/1 |
| capture `ForRun` | `(context_ref,run_ref)` run-to-capture binding | completed run owner + unique capture relation | selected `(context,run,capture,view)` | 与Exact相同；不得从run status补capture | found `(1,1,1,1)`；empty仅`run/capture/relation/view=(1,0,0,0)` |
| handoff `Exact` | global typed `handoff_ref` | context owner + exact handoff relation | `(context_ref,handoff_ref,view_ref)` | fact、complete plan、embedded progress、source material relation、truth cursor、cleanup override ref、current relay、audit | found `target/view=(1,1)`；absence `(0,0)`；context/current relation各0/1 |
| handoff `CurrentForContext` | context current-handoff index | current target relation + exact selected binding | selected `(context,handoff,view)` | 与Exact相同；只接受`Current` position | found `current target/view=(1,1)`；empty仅`context=1,target/view=(0,0)` |

| observed relation | disposition | forbidden fallback |
|---|---|---|
| target=0、binding=1 | `MaterializationIntegrityInvalid` | dangling binding当Empty或historical fallback |
| target=1、binding=0且其余index完整 | typed `ViewBindingUnavailable` gap | Query分配view ref、现场materialize或Empty |
| current count `>1` | `CardinalityIntegrityInvalid` | timestamp、last attempt或insertion-order winner |
| exact target global命中但owner不等selector | `OwnerRelationIntegrityInvalid` | composite miss解释成Empty/Unavailable |
| current ref与selected binding ref不等 | `CurrentBindingIntegrityInvalid` | 改读另一个binding或latest scan |
| capture unknown/duplicate material或observability wrong basis | `CaptureGroupIntegrityInvalid` | coverage gap掩盖unknown或补row |
| handoff unknown progress、plan drift或aggregate mismatch | `HandoffGroupIntegrityInvalid` | 补Pending、按count重算或选多数 |
| cursor/audit/time/generation跨snapshot不等 | `SnapshotRelationIntegrityInvalid` | Version/timestamp冒充truth cursor |
| absence proof incomplete或technical read failed | `Err(...)` | `None -> Empty`、degraded或新snapshot重试 |

Exact historical target可以正常返回source；current selector不允许退化成latest。capture `ForRun`不按历史capture时间选winner，
handoff `CurrentForContext`不按opened time或last receipt选winner。

### 36.1 Whole-group read order

```text
validate request + permitted decision
  -> read owner/context and exact/current index
  -> read selected immutable target and view binding
  -> construct selection or absence proof
  -> read complete owner group and existing audit linkage
  -> construct Step 6 source snapshot
  -> classify complete / stale / safe coverage gap / typed unavailable
  -> return family-specific closed outcome
```

capture material按fact `expected_material_keys` canonical order读取；handoff progress按immutable plan canonical order读取，relay按
`(source_truth_cursor, relay_ref)`稳定顺序读取。private adapter helper不得提升为第二public application port。

## EOF Current Working Batch: `7R-04A-A2-F2-J1` port/error/index completed

本节取代H-only working state，成为本文件物理EOF的current working authority。shared port、closed error与四variant
index/cardinality已写入；facade mapping、static self-check和恢复源同步仍pending，A2-F2尚未完成。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F2 capture/handoff exact reader contracts in_progress
completed_internal_parts = A2-F2-C capture|A2-F2-H handoff|A2-F2-J1 port-error-index
pending_internal_parts = A2-F2-J2 facade-static-audit|A2-F2-R recovery sync
query_reader_coverage = 5/13
selector_variant_coverage = 9/9_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 37. Capture/Handoff Facade-to-Reader 与 Outcome Mapping

```text
checked service context + checked input
  -> SandboxQueryAccessDecision
  -> NotVisible / Restricted / dependency Unavailable: target reads = 0
  -> Permitted
     -> family ReadRequest::try_from_permitted
     -> SandboxCommittedReadManager::open exactly once
     -> one named reader method exactly once
     -> exhaustive outcome mapping + Step 6 checked view factory
     -> SandboxCommittedReadManager::close exactly once
     -> optional redacted diagnostic hook; business audit append = 0
```

| facade | fixed kind | request | exact reader method | success output | body factory |
|---|---|---|---|---|---|
| `get_capture_summary` | `GetCaptureSummary` | `CaptureSummaryReadRequest` | `read_capture_summary_source` | `CaptureSummaryLookupOutcome` | `CaptureSummaryView::from_committed_snapshot` / `from_degraded_snapshot` |
| `get_material_handoff_status` | `GetMaterialHandoffStatus` | `MaterialHandoffStatusReadRequest` | `read_material_handoff_status_source` | `MaterialHandoffStatusLookupOutcome` | `MaterialHandoffStatusView::from_committed_snapshot` / `from_degraded_snapshot` |

### 37.1 Capture mapping

| reader branch | mandatory checks | final application surface |
|---|---|---|
| `ViewSource` with no gap | source complete；binding/source lineage、audit和cursor全等 | `Visible(CaptureSummaryView::from_committed_snapshot(...))` |
| `ViewSource` with only `ProjectionBehind` | source仍完整；available cursor严格落后required | checked body + `Stale`；domain `Partial/Failed/Unavailable`不改名 |
| `ViewSource` with `MaterialCoverage` / `ObservabilityCoverage`，可同时stale | source known fields安全；gap与source predicate逐项匹配 | checked body + `Degraded` |
| `Absent` | matching `CaptureSummaryAbsenceProof`与selector逐字段相等 | `SandboxQueryResult::empty()` |
| `Unavailable` | gap set非空且只含`ViewBinding | SourceUnavailable` | `no_body(Unavailable, safe reasons)` |

capture canonical `Complete | Partial | Failed | Unavailable`始终由`CaptureFactStatus`展示；Query不以material缺行重写它，也
不把capture summary当Artifact/evidence formal truth。degraded factory不补missing material、observability或output summary。

### 37.2 Handoff mapping

| reader branch | mandatory checks | final application surface |
|---|---|---|
| `ViewSource` with no gap | plan/progress/material delivery/current relay完整；cursor/audit全等 | `Visible(MaterialHandoffStatusView::from_committed_snapshot(...))` |
| `ViewSource` with only `ProjectionBehind` | source完整；available cursor严格落后required | checked body + `Stale` |
| `ViewSource` with `ProgressCoverage` / `CurrentRelayCoverage`，可同时stale | complete plan、known progress、persisted aggregate和known relay安全 | checked body + `Degraded` |
| `Absent` | matching Exact/Current proof与selector逐字段相等 | `SandboxQueryResult::empty()` |
| `Unavailable` | gap set非空且只含`ViewBinding | SourceUnavailable` | `no_body(Unavailable, safe reasons)` |

handoff `Pending | Delivered | Retryable | Failed | BlockedByCleanupGuard`保持canonical body；relay `Published`不改写target
progress，cleanup guard不由Query重评，capture/material truth不因handoff failure回滚。coverage gap存在时不能以aggregate或最后
receipt伪造complete delivery。

### 37.3 Close and technical failure

reader完成后必须关闭同一个snapshot。close failure返回既有`PortUnavailable` application error，丢弃尚未返回的assembled
surface，不重读、不打开第二snapshot；已提交capture/handoff truth不变。diagnostic hook只接收redacted category/count，失败
不改变已确定surface，也不追加business audit。

## 38. Capture/Handoff No-write、Ownership 与 Adapter Boundary

| dimension | required | forbidden | expected count |
|---|---|---|---:|
| application reader methods | `SandboxCaptureHandoffReader` 2个具名method | generic `read(kind, selector)` / alias | `2/2` |
| committed read snapshot | caller open的一个公平snapshot | reader自行open/close或跨snapshot拼装 | `1/1` per call |
| write UoW / CAS / commit / rollback | none | Query内repair、materialization、reconciliation write | `0` |
| identity allocation | none；view ref由binding读取 | capture/handoff/view/audit/cursor ref分配 | `0` |
| external calls | none | capture adapter、handoff delivery、publisher、cleanup/release/retry | `0` |
| business audit / relay append | only read existing linkage | read audit、relay publish、diagnostic升级business audit | `0` |
| existing maintenance selection readers | preserved as candidate surface | public Query调用9个paged selection reader | Query use `0/2` |
| durable adapter | `infra::query_read`一个logical adapter，可有private typed helpers | API/Worker/Jobs直访repository或infra helper | `1` owner |
| deterministic fake | 脚本化checked outcome/error并记录method与snapshot ref | generic payload、绕过request validation、自动补row | parity required |

`SandboxUnitOfWork`虽然在type hierarchy中继承`SandboxCommittedReadSnapshot`，Query wiring只能传
`SandboxCommittedReadManager::open()`返回的handle。此条由后续`7R-04B` assembly type/source audit检查；本批不新增
runtime downcast或rollback-based read。

## 39. A2-F2 Shared Static Self-check

| check | result |
|---|---|
| capture request / selection / absence / gap / source / outcome | `1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1` |
| handoff request / selection / absence / gap / source / outcome | `1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1` |
| logical reader methods | `2/2`；capture与handoff各一个具名method |
| selector variants | capture `Exact + ForRun = 2/2`；handoff `Exact + CurrentForContext = 2/2`；总计 `4/4` |
| source wrapper reuse | Step 6 canonical source snapshot `2/2`；view schema duplication `0` |
| exact/current cardinality | four variants均有key、0/1 proof、`>1` integrity rule |
| valid absence | capture ForRun `run=1,relation/view=0/0`；capture Exact `capture/relation/view=0/0/0`；handoff Current `context=1,target/view=0/0`；handoff Exact `target/view=0/0` |
| technical failure to absence/degraded | `0`；snapshot/repository failure均为reader `Err` |
| body-compatible gaps | capture `ProjectionBehind/MaterialCoverage/ObservabilityCoverage`；handoff `ProjectionBehind/ProgressCoverage/CurrentRelayCoverage` |
| no-body gaps | both families only `ViewBinding/SourceUnavailable` |
| source/selector/factory mapping | `2/2` exact facade methods；generic/alias/wildcard/latest/`Option<View>` positive path=`0` |
| Query side effects | write UoW/CAS/identity/repair/external/business-audit=`0/0/0/0/0/0` |
| maintenance reader use | existing `9/9` preserved；capture/handoff Query use=`0/2` |
| implementation/test/evidence/signoff fact | none；仅静态设计契约 |
| new L1/L2 blocker | `0`；`READ-001 | OUTCOME-001`仍开放 |

## 40. A2-F2 回填草稿

正式 `03` Step 7 重装配时，待A2其余family、A3和A4收稳后可采用以下摘要；当前不回填正式正文：

> `SandboxCaptureHandoffReader` 以两个具名async method承接capture summary与material handoff Query。capture按exact
> capture或run唯一binding读取immutable fact、expected material coverage、observability relation与audit linkage；handoff按
> exact或current binding读取完整target plan、embedded progress、material delivery relation、truth cursor与current relay。
> 两者均只消费matching permitted request和一个fair committed snapshot，返回checked source、typed absence或typed unavailable
> outcome。projection stale和安全coverage gap可形成诚实`Stale/Degraded` body；unknown row、owner/cardinality/half-commit/cursor
> 损坏为typed integrity error。Query不分配identity、不调用capture/handoff/publisher/cleanup、不修复或回滚任何truth。

该摘要不覆盖其余三个A2 family、A3 writer boundary或A4 `READ-001`裁决，不能单独成为正式Step 7闭环。

## EOF Current Working Batch: `7R-04A-A2-F2-J2` facade/static audit completed

本节取代J1 working state，成为本文件物理EOF的current authority。A2-F2内容与局部静态自检已完成；四层恢复源和
`/tmp`计划尚未同步，因此family仍标记`in_progress`，不得提前进入A2-F3。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F2 capture/handoff exact reader contracts in_progress
completed_internal_parts = A2-F2-C capture|A2-F2-H handoff|A2-F2-J1 port-error-index|A2-F2-J2 facade-static-audit
pending_internal_part = A2-F2-R recovery sync
query_reader_coverage = 5/13
selector_variant_coverage = 9/9_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## EOF Current Recovery Override: `7R-04A-A2-F2` completed, user review pending

本节取代 J2 working state，成为本文件物理 EOF 的唯一 current authority。capture/handoff family 的内容、静态审计和
恢复源同步均已完成；正式`03-详细设计.md`保持冻结，A2-F3须等待用户复核确认后才能启动。

| recovery item | current fact |
|---|---|
| consumed gate | `7R-04A-A2-F1 completed_wait_user_review` |
| completed family | `A2-F2 capture/handoff exact reader contracts` |
| completed internal tasks | `A2-F2-C | A2-F2-H | A2-F2-J | A2-F2-R` |
| reader coverage | 本family Query/request/method/outcome/source=`2/2`；累计 Query=`5/13` |
| selector coverage | 本family capture/handoff=`4/4`；累计 completed families=`9/9` |
| read boundary | one matching permitted request + one fair committed snapshot；write/UoW/identity/repair/external/business-audit均为`0` |
| blocker | `READ-001 | OUTCOME-001`仍开放；new L1/L2 blocker=`0` |
| next after review | `A2-F3 failure/cleanup/redline exact reader contracts` |
| truthfulness | 无implementation commit、run_id、真实evidence alias、测试结果或验收签署 |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_module = exact_read_and_necessary_maintenance_surface
current_task = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A2-F2 capture/handoff completed_wait_user_review
current_artifact = projects/L4-sandbox/design-calibration/03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_in_progress_wait_user_review
batch_status = completed_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = in_progress_2_of_5_families_completed
a2_f1_execution_boundary_policy = completed
a2_f2_capture_handoff = completed
a2_f3_failure_cleanup_redline = pending
a2_f4_projection_derived_comparison = pending
a2_f5_reconciliation_audit = pending
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_inventory = 13/13
query_reader_coverage = 5/13
selector_variant_coverage = 9/9_for_completed_families
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/5_completed_queries
next_internal_batch = 7R-04A-A2-F3 failure/cleanup/redline exact reader contracts
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
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

A2-F2 已完成并停审。未经用户确认不得开始 A2-F3、A3/A4、Step 8、正式`03`回填或implementation。

## 41. A2-F3 开工门禁、输入与范围

用户本轮“同意”已消费 `7R-04A-A2-F2 completed_wait_user_review` 停审门。本批只闭合
`GetFailureControlStatus`、`GetCleanupReadiness` 与 `GetRedlineContainmentStatus` 三个 Query 的 failure/control、
cleanup、redline exact reader contract。projection/derived/comparison、reconciliation/audit、necessary writer、A4
closure、Step 8 和正式 `03` 均不在本批。

### 41.1 已读 current authority

| input | consumed contract | A2-F3 constraint |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 7 | 按模块定义具名 trait / port / adapter；每个接口有typed input/output/error、读写能力和调用方；完成后再做跨模块审计 | 三个 Query 保持三个具名 method；cleanup/reaper/redline 执行动作不进入reader。 |
| `standards/document/详细设计书写规范.md` public contract clauses | public type/function需要签名、Rustdoc、字段来源、错误、事务能力和禁止路径 | 新增只限application-local request/outcome/reader/error；Step 6 canonical view schema不复制。 |
| `03_ddd_step_07_service_facades_inputs_outputs.md` §§22.3、23、24.3 | failure bounded page、cleanup current/exact selector、redline exact selector与surface mapping | 继续使用access-first、一个fair snapshot、Query zero-write和canonical body status。 |
| `03_ddd_step_06_object_contracts_failure_cleanup_read.md` §§16.5~16.7 | failure/control page/window/summary/source/gap；cleanup selector/source/lookup；redline selector/source/lookup | Step 6 类型是唯一source/view/error owner；本批只补reader承接与application mapping。 |
| `03_ddd_step_07_idempotency_stored_index_repositories.md` §11 | `SandboxCommittedReadSnapshot`只读能力、manager open/close和same-generation约束 | reader不自行open/close、不持有write UoW、不跨snapshot拼接。 |
| Step 6 failure/cleanup/redline downstream revalidation rows | reader必须保留ExactAbsent/Unavailable/integrity分层、cursor与redline fail-closed | technical failure不能变成Empty/Degraded；cleanup/reaper/release/investigation call均为0。 |

### 41.2 SOP 问题回答

| SOP 问题 | A2-F3 当前回答 |
|---|---|
| 三个 Query 是否可以共用 `read(kind, selector)`？ | 不可以。failure 有 bounded page + empty-scope/page metadata；cleanup 是 current/exact closed lookup；redline 是 required context + exact security source，输出和安全错误集合不同。 |
| failure/control 的空结果如何证明？ | 只有同一snapshot返回完整 `FailureControlCommittedScopeSummary`、完整 page coverage、空 window且无read gap时，才形成 `EmptyScope`；repository `None`或summary缺失不算空。 |
| cleanup/redline 缺口哪些允许带body？ | 直接服从 Step 6：cleanup 只允许其 canonical safe gaps；redline 只有 `Disposition` 或受限 `ProjectionSource` 在满足状态条件时可 `Degraded`，核心security gap一律 no-body `Unavailable`。 |
| lease / orphan / reaper 是否是本批主体？ | 不是。reader只读取已提交 cleanup/redline/failure relation或safe summary；不选择lease、不评估orphan、不运行reaper、不释放资源。 |
| invalid/expired page cursor如何处理？ | 在target read前由application page decoder和request factory返回typed input/read error；不回退第一页、latest或timestamp winner。 |
| 是否需要新的ASCII图？ | 不画。本批关键关系已由三个独立method签名、outcome矩阵和same-snapshot顺序表达；新增图不会提供实现所需字段或调用约束。 |

### 41.3 当前文档问题诊断

| 诊断项 | F2 结束时状态 | F3 要补的可落码缺口 |
|---|---|---|
| Query coverage | `5/13`；三个failure/cleanup/redline Query尚无reader | 三个具名request与三个具名reader method，累计升至`8/13`。 |
| failure/control | Step 6 source完整，但application没有empty-scope、page-info和reader error闭合 | 建立`FailureControlStatusReadRequest`、closed lookup outcome和page/cardinality规则。 |
| cleanup | facade声明复用Step 6 selector，但没有access-approved request、reader owner和技术失败映射 | 只加request/reader承接；复用`CleanupReadinessSourceLookupOutcome`。 |
| redline | facade声明exact read，但没有visibility precedence、core-gap no-body与reader owner | 只加request/reader承接；复用`RedlineContainmentSourceLookupOutcome`。 |
| maintenance boundary | 已知9个candidate reader不属于public Query | 保持Query use=`0/8`；reaper/release/investigation等外部调用固定为0。 |

### 41.4 改动前后对比与设计取舍

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| failure read surface | 只有Step 6 view/source草案和facade表 | typed bounded request -> same-snapshot source -> `ViewSource/EmptyScope`；technical availability由facade映射`PortUnavailable` application error | 空scope和分页不能由普通`Option<View>`表达；failure也没有可把technical error包装为成功surface的no-body gap。 |
| cleanup read surface | selector已存在，但reader callable未定义 | request携带matching permitted decision + canonical selector；reader返回Step 6 closed outcome | 防止service自行拼guard/evidence或误调用cleanup。 |
| redline read surface | exact selector和安全字段已存在，但缺port边界 | request与reader固定exact current binding；core gap fail-closed，允许gap条件由Step 6 factory裁决 | redline不能由Query放宽为advisory read。 |
| error ownership | repository/adapter failure可能被泛化 | shared reader error区分snapshot/repository/shape/integrity/no-write；Step 6 view error保留source关系错误 | application不应把损坏数据伪装成业务降级。 |
| lease/reaper关系 | 可能被误当成cleanup query输入 | 只作为已提交 relation / safe summary；reader对lease/reaper/release/investigation执行调用固定为0 | 保持Sandbox主体与维护/异常读取边界。 |

### 41.5 A2-F3 内部任务

| ID | status | task | completion gate |
|---|---|---|---|
| `A2-F3-F` | completed | failure/control bounded page request、empty proof、source/outcome与reader contract | first/continued anchor、window limit、scope summary、cross-link、gap和empty-scope全部闭合。 |
| `A2-F3-C` | completed | cleanup exact/current request与canonical lookup reader | selector/access/snapshot/no-write、absence/gap/error mapping闭合；不复制Step 6 view。 |
| `A2-F3-R` | in_progress | redline exact request与fail-closed security lookup reader | visibility precedence、core-gap/degraded条件、absence/integrity/error闭合。 |
| `A2-F3-J` | pending | 三family shared port/error、facade mapping、静态审计与恢复源同步 | request/method/outcome/source=`3/3`；selector variants=`4/4`；五层EOF一致并停审。 |

当前 `A2-F3-R` 为唯一进行中任务。后续任务不得因为共享error或trait形状提前标记完成。

## EOF Current Working Batch: `7R-04A-A2-F3` started

本节取代 A2-F2 recovery override，成为本文件物理EOF的 current working authority。F3尚未完成，正式
`03-详细设计.md`保持冻结；本批只允许先完成 failure/control family。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F3 failure/cleanup/redline exact reader contracts in_progress
completed_internal_parts = A2-F2-C|A2-F2-H|A2-F2-J|A2-F2-R
current_internal_part = A2-F3-F failure/control bounded reader
pending_internal_parts = A2-F3-C cleanup|A2-F3-R redline|A2-F3-J shared join/static/recovery sync
query_reader_coverage = 5/13
selector_variant_coverage = 9/9_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 42. Failure/Control Permitted Read Request 与 Page Contract

`FailureControlStatusReadRequest`是application-local transient carrier，不进入Step 6 registry、Step 8 DTO或durable schema。
它把已通过access gate的decision、required context和已由application page codec验证的typed anchor/limit绑定在
一起；failure ref、lease ref、control effect、latest hint、`PageRequest`和raw cursor均不允许保存在request中。

```rust
/// 已通过full-read access gate的failure/control bounded status读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FailureControlStatusReadRequest {
    /// 与`GetFailureControlStatus`和当前service context完全匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// access scope中唯一允许的failure/control context。
    context_ref: ControlledExecutionContextRef,
    /// public page token经matching codec验证后形成的snapshot-bound page anchor。
    page_anchor: FailureControlPageAnchor,
    /// 已同startup-validated query ceiling对账的bounded window limit。
    window_limit: FailureControlWindowLimit,
}

impl FailureControlStatusReadRequest {
    /// 只接受matching Query kind/context、full-read permission和已校验的typed page输入。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetFailureControlStatusInput,
        page_anchor: FailureControlPageAnchor,
        window_limit: FailureControlWindowLimit,
    ) -> Result<Self, SandboxFailureCleanupRedlineReadError>;

    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回required failure/control context。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回已经matching page codec校验的snapshot-bound anchor。
    pub fn page_anchor(&self) -> &FailureControlPageAnchor;
    /// 返回已校验的bounded window limit。
    pub fn window_limit(&self) -> FailureControlWindowLimit;
}
```

facade必须先得到matching `Permitted` decision，再调用matching page codec把`input.page_request()`转为
`FailureControlPageAnchor + FailureControlWindowLimit`，最后调用factory。factory按固定顺序检查：
`query_kind == GetFailureControlStatus`、decision与service context匹配、`permits_full_read()==true`、input context等于
access scope、typed anchor的first/continued形状与public cursor presence一致，以及`window_limit.get()`等于经
ceiling校验的requested limit。`PageRequest`只作为factory的transient relation input，不保存、不传给reader。factory
不读取failure/control index，不解码target existence，不把invalid/expired cursor改写成第一页。

### 42.1 Page request 到 immutable page anchor

page decoder由application facade持有，reader只接受已转换的application-local anchor和limit。第一页映射为
`FailureControlPageAnchor::first()`；续页必须同时验证opaque cursor中的view ref、snapshot watermark、after order key与
consumed count，并映射为`FailureControlPageAnchor::try_continued(...)`。public token不等于truth cursor或repository cursor。

| page branch | reader input | required proof | forbidden fallback |
|---|---|---|---|
| first | `FailureControlPageAnchor::first()` + `FailureControlWindowLimit` | `consumed_count=0`；snapshot binding由同次lookup选出 | latest snapshot、timestamp winner、先查一条row再决定scope |
| continued | checked continued anchor + same limit | anchor view ref/cursor与selected binding全等；`after < first returned order key`；consumed arithmetic checked | 跨snapshot续页、重置第一页、按truth cursor拼token、改变limit |
| exhausted continued | continued anchor + valid limit | `consumed_count == scope total`时允许空window且`has_more=false` | 空window自动Empty、伪造new snapshot、丢弃page info |

reader不得自行解码public token；invalid/expired/tampered cursor在进入reader前映射为
`InvalidPageRequest | PageCursorExpired` error，target/index read count为0。正常无下一页不是gap或error。

## 43. Failure/Control Checked Source、Closed Outcome 与 Reader

### 43.1 Failure/control lookup outcome

Step 6 的`FailureControlStatusSourceSnapshot`仍是唯一view factory输入。本批新增的application-local outcome只区分
完整/允许降级source和已证明的empty scope两种成功分支；它不复制window、summary或item schema。failure
gap闭集只有`WindowCoverage | ScopeSummary | CrossLinkDependency | ProjectionSource`，没有可构造no-body success的
`ViewBinding`或`SourceUnavailable` gap。

```rust
/// failure/control bounded reader在同一committed snapshot中的成功闭集。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum FailureControlStatusLookupOutcome {
    /// 已形成完整或带允许typed gap的checked source。
    ViewSource(FailureControlStatusSourceSnapshot),
    /// 同一context的完整scope、page coverage和空window共同证明无failure/control事实。
    EmptyScope {
        /// 与空scope同snapshot形成的checked empty view source；保留view identity与page metadata。
        source: FailureControlStatusSourceSnapshot,
    },
}

impl FailureControlStatusLookupOutcome {
    /// 构造non-empty、non-scope-empty或typed-degraded checked source分支。
    pub fn view_source(
        source: FailureControlStatusSourceSnapshot,
    ) -> Result<Self, SandboxFailureCleanupRedlineReadError>;

    /// 仅从Step 6已明确证明整个scope为空的complete source构造empty分支。
    pub fn empty_scope(
        source: FailureControlStatusSourceSnapshot,
    ) -> Result<Self, SandboxFailureCleanupRedlineReadError>;
}
```

`EmptyScope`只允许`source.is_degraded()==false`、`source.proves_empty_scope()==true`、
`source.scope_summary().is_some()`、summary的failure/control totals均为0、window为空、`has_more=false`且
page coverage完整。source若缺summary、带任何gap、totals非零、anchor/consumed arithmetic不合法或view binding
缺失，均不得构造`EmptyScope`。`ViewSource`允许Step 6定义的body-compatible typed gap，但最终
body surface由facade按`Visible`或`Degraded`映射；canonical `FailureClassificationStatus`和`ControlFactStatus`仍原样展示。

repository/snapshot临时不可用、required binding dependency无法读取都必须作为availability-class reader
`Err`离开reader，再由facade穷尽映射为`ApplicationErrorDetail::PortUnavailable`。不得构造成功的
`FailureControlStatusQueryResult::no_view(Unavailable, ...)`；已完整
读取index却发现expected committed binding relation缺失、dangling binding或half-commit属integrity error，不得映射为
`Unavailable`。`RepositoryFailed`、malformed row和relation/cardinality损坏同样映射application error。

### 43.2 Reader trait

```rust
/// failure/control、cleanup与redline三个安全相关Query的application-owned exact source reader。
pub trait SandboxFailureCleanupRedlineReader: Send + Sync {
    /// 在caller提供的一个fair committed snapshot中读取bounded failure/control source。
    async fn read_failure_control_status_source(
        &self,
        request: &FailureControlStatusReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<FailureControlStatusLookupOutcome, SandboxFailureCleanupRedlineReadError>;

    /// 在同一类fair committed snapshot中读取current/exact cleanup readiness whole group。
    async fn read_cleanup_readiness_source(
        &self,
        request: &CleanupReadinessReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<CleanupReadinessSourceLookupOutcome, SandboxFailureCleanupRedlineReadError>;

    /// 在同一类fair committed snapshot中读取required exact redline current source。
    async fn read_redline_containment_source(
        &self,
        request: &RedlineContainmentReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<RedlineContainmentSourceLookupOutcome, SandboxFailureCleanupRedlineReadError>;
}
```

reader固定执行顺序：

```text
validated permitted request + checked page anchor/limit
  -> read exact context/status-view binding and source watermark
  -> read one merged Failure/Control window in canonical order
  -> read full scope summary and only required cross-link proofs
  -> construct FailureControlStatusSourceSnapshot::complete/degraded
  -> classify ViewSource / EmptyScope; dependency availability remains Err
```

reader不得调用failure classifier、control transition、cleanup guard、lease/reaper、redline investigation、projection writer、
audit append或external backend。window必须一次按`(truth_cursor, item_kind, canonical_ref)`读取；不得分别取failure/control
limit后拼接。cross-link只读matching relation index；不为跨页对账扩大window。

### 43.3 Failure/control source branch matrix

| source condition | lookup result | application surface | body rule |
|---|---|---|---|
| complete source + non-empty window | `ViewSource` | `Visible` | checked `FailureControlStatusView`，canonical failure/control status原样保留。 |
| complete source + summary totals均为0 + empty window + full page coverage | `EmptyScope` | `Empty` + checked empty view + `SandboxQueryPageInfo` | `proves_empty_scope()==true`；page metadata保留。 |
| complete source + summary total非零 + valid exhausted continued empty window | `ViewSource` | `Visible` | 返回带checked view/page info的正常空窗口，不声明scope不存在。 |
| source with `WindowCoverage`/`ScopeSummary`/`CrossLinkDependency`/`ProjectionSource` allowed gap | `ViewSource` | `Degraded` | 仅由Step 6 `from_degraded_snapshot`构造；不补missing item/summary。 |
| snapshot/repository/required binding dependency临时不可用 | availability-class `Err(...)` | application `PortUnavailable` error | 不构造failure read gap、成功no-view surface或body。 |
| expected committed binding missing/dangling/half-committed | integrity-class `Err(...)` | application error | 不伪造`ViewBinding` gap，不现场分配view ref或materialize。 |
| known malformed row/cardinality/lineage/counter corruption | `Err(...)` | `InternalInvariantViolation` | 不降级、不选winner、不回退latest。 |

只有完整source的`proves_empty_scope()`为true时才向facade映射`FailureControlStatusQueryResult::empty(...)`。
continued exhausted page若scope total非零，返回带`view`和page info的正常空页surface，不能误报不存在；
degraded empty window也不能误报empty scope。

## 44. A2-F3-F Static Self-check 与阶段状态

| check | result |
|---|---|
| permitted request / page anchor bridge | `1/1` request；first/continued/exhausted=`3/3` branch rules |
| failure source reuse | Step 6 `FailureControlStatusSourceSnapshot` / window / summary / gap / proof=`5/5` reused；view schema duplication=`0` |
| success outcome | `ViewSource | EmptyScope`=`2/2`；failure-specific no-body gap/outcome=`0` |
| logical reader method | `read_failure_control_status_source`=`1/1`；generic reader=`0` |
| empty proof | summary totals=0 + no gap + full page arithmetic + empty window=`1/1`；nonzero exhausted page仍为`ViewSource` |
| unavailable / integrity split | temporary snapshot/repository/binding dependency=`Err -> PortUnavailable`；missing committed relation/half-commit=`Err -> InternalInvariantViolation`；technical `Err`到成功`Unavailable`=`0` |
| bounded ordering | merged union and limit enforced；separate failure/control limit concat=`0` |
| side effects | write UoW/CAS/identity/repair/external/cleanup/reaper/audit append=`0/0/0/0/0/0/0/0` |
| new L1/L2 blocker | `0`；existing `READ-001 | OUTCOME-001` unchanged |

`A2-F3-F` 内容完成，但由于cleanup/redline和shared join尚未完成，本family不构成F3用户复核门；下一内部任务为
`A2-F3-C cleanup exact/current reader`。

## EOF Current Working Batch: `7R-04A-A2-F3-F` failure/control completed

本节取代F3 started working state，成为本文件物理EOF的current working authority。failure/control family已完成；cleanup、
redline、shared error/facade join和恢复源同步尚未完成，F3仍为`in_progress`。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F3 failure/cleanup/redline exact reader contracts in_progress
completed_internal_parts = A2-F2-C|A2-F2-H|A2-F2-J|A2-F2-R|A2-F3-F
current_internal_part = A2-F3-C cleanup exact/current reader
pending_internal_parts = A2-F3-C|A2-F3-R|A2-F3-J
query_reader_coverage = 6/13
selector_variant_coverage = 9/9_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 45. Cleanup Readiness Permitted Request 与 Selector Closure

`CleanupReadinessReadRequest`只是application-local access carrier。它直接复用Step 6
`CleanupReadinessSelector`，不保存release bool、lease/orphan status、guard status、backend target、latest hint或
maintenance selection。

```rust
/// 已通过full-read access gate的cleanup readiness exact/current读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CleanupReadinessReadRequest {
    /// 与`GetCleanupReadiness`和当前service context完全匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// Step 6 canonical current-context或exact-guard selector。
    selector: CleanupReadinessSelector,
}

impl CleanupReadinessReadRequest {
    /// 只接受matching Query kind/context、full-read permission和同一checked input selector。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetCleanupReadinessInput,
    ) -> Result<Self, SandboxFailureCleanupRedlineReadError>;

    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回canonical current/exact cleanup selector。
    pub fn selector(&self) -> &CleanupReadinessSelector;
}
```

factory按固定顺序校验`query_kind == GetCleanupReadiness`、decision与service context的actor/scope/digest
匹配、`permits_full_read()==true`、`input.selector()`与保存selector全等，以及selector context与access scope全等。
`CurrentForContext` 与 `ExactGuard` 是唯二variant；factory不读index、不将exact guard改写为current、不从ref文本推导
context。

### 45.1 Selector / binding / absence cardinality

| selector | exact lookup keys | found proof | valid absence | integrity failure |
|---|---|---|---|---|
| `CurrentForContext { context_ref }` | context current-binding index + selected immutable exact binding | current count=`1`；selected binding guard等于current ref；position=`Current` | 完整current index count=`0` -> `CurrentAbsent` | count `>1`、selected binding缺row、context/ref/cursor错配。 |
| `ExactGuard { context_ref, cleanup_guard_ref }` | `(context_ref, cleanup_guard_ref)` immutable binding index + same-snapshot current index | exact count=`1`；current ref相同则`Current`，不同则`Historical` | 完整exact index count=`0` -> `ExactAbsent`；同snapshot current ref可为None | exact count `>1`、exact binding存在但current index为0、wrong owner或fresh replacement half-commit。 |

`CurrentAbsent`只证明该context当前没有committed cleanup-view binding；不证明没有partial environment、lease、
orphan、redline或cleanup obligation。`ExactAbsent`只证明指定guard的immutable binding不存在；即使证明中携带
current guard，也不得转为current view或泄漏其body。

## 46. Cleanup Same-snapshot Reader 与 Closed Outcome Mapping

`SandboxFailureCleanupRedlineReader::read_cleanup_readiness_source` 直接返回Step 6
`CleanupReadinessSourceLookupOutcome`，不新建application-local source、absence、gap或view schema。读取顺序固定为：

```text
validated permitted request
  -> read current + immutable exact binding indexes in one snapshot
  -> construct Found / CurrentAbsent / ExactAbsent / ViewBinding NoView
  -> for Found, read exact guard + embedded evidence/investigation
  -> read boundary + handle + optional lease/orphan + complete redline coverage/status
  -> read same-attempt authorization/completion/failure relation proof
  -> construct CleanupReadinessSourceSnapshot::complete/degraded or Step 6 NoView
```

### 46.1 Required whole group

| group | required cardinality / relation | forbidden substitute |
|---|---|---|
| selected binding | exactly one immutable binding + checked current position | timestamp/ref winner、historical fallback、Query生成view ref。 |
| cleanup truth | exactly one selected guard row + embedded evidence/investigation/release basis | 重跑safety guard、从owner status推guard status、空blocker占位。 |
| singleton owners | boundary=`1`、handle=`1`；lease/orphan与lineage optional cardinality同构 | pre-bound lease ref当row存在、backend summary当owner truth。 |
| redline owners | complete ordered coverage `0..n` + status rows与refs逐项同构 | single/latest redline、missing index当zero-row、partial page。 |
| release relations | selected attempt下`(relation_kind, subject)`唯一，与current owner/status/cursor对账 | 凭`Released` status推导confirmation、用completion row覆盖authorization history。 |

reader只读取已提交的cleanup/redline/owner relation。它不调用`CleanupSafetyGuard`、不运行orphan reaper、不授权或
执行release、不推进lease/orphan/boundary/handle、不解除redline、不修复projection、不追加business audit。

### 46.2 Outcome-to-surface matrix

| Step 6 outcome / source | mandatory checks | facade surface | body rule |
|---|---|---|---|
| `ViewSource` complete current | selection current；guard/owners/relation/coverage完整 | `Visible` | `CleanupReadinessView::from_committed_snapshot`；canonical pending/blocked/allowed/completed原样保留。 |
| `ViewSource` complete historical | exact selector + position historical；relation完整 | `Visible` | historical read-only body；不进入projection、mutation guard或closure proof。 |
| current source + exactly one `ReleaseRelation` gap | complete public field group；selection current | `Degraded` | 只调用`from_degraded_snapshot`；fail-closed helper返回unsafe。 |
| `CurrentAbsent` | matching current selector + count=`0` complete proof | `Empty`, no view | 不证明资源已释放或cleanup obligation不存在。 |
| `ExactAbsent` | matching exact selector + exact count=`0` complete proof | `Empty`, no view | 不转而current selector，不暴露optional current guard body。 |
| `NoView { selection: None }` | gap set恰一个`ViewBinding` | no-body `Unavailable` | 不构造absence、空view或latest fallback。 |
| `NoView { selection: Some }` | `CleanupTruth/OwnerTruth/ProjectionSource`至少一个；或historical-only `ReleaseRelation` | no-body `Unavailable` | 不以较早carrier、default status或partial owner group补body。 |

raw repository/snapshot failure作为shared reader `Err`；只有formal reader已形成Step 6 typed gap时才进入`NoView`或
current degraded branch。duplicate current binding、wrong context/generation、malformed row、known relation conflict、missing mandatory row和
half-committed confirmation都是integrity error，不得用safe reason降级掩盖。

## 47. A2-F3-C Static Self-check 与阶段状态

| check | result |
|---|---|
| request / method / canonical outcome | `1/1/1`；Step 6 source/outcome/view复制=`0` |
| selector variants | `CurrentForContext | ExactGuard`=`2/2` |
| absence proof | current/exact=`2/2`；repository `None` shortcut=`0` |
| whole group | binding/guard/singleton owners/redline coverage/release relation=`5/5` |
| body-compatible gap | current-only single `ReleaseRelation`=`1/1` |
| no-body gap | `ViewBinding/CleanupTruth/OwnerTruth/ProjectionSource`及historical `ReleaseRelation`闭合 |
| side effects | guard evaluation/reaper/release/owner transition/redline release/projection repair/audit append/external=`0/0/0/0/0/0/0/0` |
| new L1/L2 blocker | `0`；existing `READ-001 | OUTCOME-001` unchanged |

`A2-F3-C` 完成。F3尚有redline与shared join，不形成用户复核门；下一内部任务为
`A2-F3-R redline exact fail-closed reader`。

## EOF Current Working Batch: `7R-04A-A2-F3-C` cleanup completed

本节取代F3-F working state，成为本文件物理EOF的current working authority。failure/control与cleanup已完成；
redline、shared error/facade join和恢复源同步尚pending。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F3 failure/cleanup/redline exact reader contracts in_progress
completed_internal_parts = A2-F2-C|A2-F2-H|A2-F2-J|A2-F2-R|A2-F3-F|A2-F3-C
current_internal_part = A2-F3-R redline exact fail-closed reader
pending_internal_parts = A2-F3-R|A2-F3-J
query_reader_coverage = 7/13
selector_variant_coverage = 11/11_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 48. Redline Permitted Exact Request 与 Visibility Boundary

`RedlineContainmentReadRequest`是application-local access carrier，只包装Step 6 required
`RedlineContainmentSelector`。它不接受context-only/latest selector、historical view ref、investigation body/ref、
release flag、status hint、security marker set或maintenance selection。

```rust
/// 已通过full-read access gate的required exact redline containment读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RedlineContainmentReadRequest {
    /// 与`GetRedlineContainmentStatus`和当前service context完全匹配的permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// Step 6 required context + exact redline selector。
    selector: RedlineContainmentSelector,
}

impl RedlineContainmentReadRequest {
    /// 只接受matching Query kind/context、full-read permission和同一checked exact selector。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetRedlineContainmentStatusInput,
    ) -> Result<Self, SandboxFailureCleanupRedlineReadError>;

    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回required exact redline selector。
    pub fn selector(&self) -> &RedlineContainmentSelector;
}
```

factory按固定顺序校验`query_kind == GetRedlineContainmentStatus`、decision与service context的
actor/scope/digest匹配、`permits_full_read()==true`、`input.selector()`与保存selector全等，以及selector
context与access scope全等。`NotVisible | Restricted | access dependency Unavailable`在factory和exact index读取前结束；
target/index read count固定为0，防止exact redline ref成为存在性探针。

### 48.1 Exact current binding cardinality

| observed exact index | Step 6 branch | required proof | forbidden fallback |
|---|---|---|---|
| count=`0` and complete index coverage | `ExactAbsent` | proof context/redline与selector全等；`exact_binding_count=0`；watermark/audit/time合法 | generic `NotFound`、timeout、partial index或wrong-owner miss当Empty。 |
| count=`1` | `Found` then source read | selector/binding context+redline全等；lookup cursor不早于binding cursor | 先读status再追latest proof/material，使用old immutable row。 |
| binding index formally unavailable | typed `Unavailable(ViewBinding)` | 恰好一条matching `ViewBinding` gap | 改写为`ExactAbsent`、构造空view或降级body。 |
| count `>1`、dangling binding、wrong context/ref、half-commit | integrity `Err` | 保留已知cardinality/relation冲突 | timestamp/ref/insertion-order winner、旧row fallback或warning-only。 |

`ExactAbsent`只证明当前exact binding index中没有selected redline；不证明context没有其它redline，也不授权
cleanup、release或material disposal。old immutable view不是本Query的historical fallback，只能由后续专用audit /
reconciliation协议承接。

## 49. Redline Same-snapshot Source Reader 与 Security Gap Matrix

`SandboxFailureCleanupRedlineReader::read_redline_containment_source` 直接返回Step 6
`RedlineContainmentSourceLookupOutcome`，不复制selector、binding、absence、gap、source或view。读取顺序固定为：

```text
validated permitted exact request
  -> read exact-redline current binding index
  -> construct Found / ExactAbsent / ViewBinding Unavailable
  -> for Found, read canonical containment truth + exact lineage + detection source
  -> read containment/failure/boundary/run proof group
  -> read exact preservation material owner + matching investigation observation
  -> read committed disposition proof + lifecycle timeline
  -> construct RedlineContainmentSourceSnapshot::complete/degraded or typed Unavailable
```

### 49.1 Required current source group

| group | required relation | forbidden substitute |
|---|---|---|
| current binding | exactly one immutable binding for `(context_ref, redline_ref)` | context scan、latest-by-time、query-generated view ref/cursor。 |
| canonical truth | exact guard ref、redline kind/status/reason、source cursor/audit | `VisibleRedlineStatus`第二状态、phase反推status、reason文字解析。 |
| lineage / detection | context/identity/optional run/boundary/handle/generation + typed body-free source | host/path/process/network detail、raw signal/body、从handle反推lineage。 |
| containment proof | stop-new-use + matching failure + boundary/optional run termination relation | status文字、caller bool、query重跑guard。 |
| preservation | exact recovery point + matching material owner/status/handoff relation | latest material scan、material body、downstream receipt。 |
| investigation | latest observation bound to exact preservation and typed target | `NotRequired`、ticket/case body、missing默认Accepted。 |
| disposition / timeline | matching `NotCommitted/Released/Terminal` proof + committed monotonic times | query生成decision、backend success bool、query clock覆盖transition time。 |

### 49.2 Closed gap-to-surface matrix

| gap / source condition | required status/source shape | facade surface | body rule |
|---|---|---|---|
| complete source, no gap | any valid `Detected/Contained/HandoffPending/Released/Terminal` | `Visible` | `RedlineContainmentView::from_committed_snapshot`；`HandoffPending`是canonical active truth，不是degradation。 |
| `ExactAbsent` | complete matching exact index count=`0` proof | `Empty`, no view | 不推导context下其它redline或cleanup状态。 |
| `ViewBinding` | unique exact matching gap, no selection | no-body `Unavailable` | 不回退old row、latest或Empty。 |
| `ContainmentTruth/LineageTruth/DetectionSource/ContainmentProof` | 缺少任一core security source | no-body `Unavailable` | 不用status文字、default proof或partial view补造。 |
| `Preservation/Investigation` | exact preservation或responsibility handoff不可完整证明 | no-body `Unavailable` | `HandoffPending/Released/Terminal`均不例外。 |
| exactly one `Disposition` | full core source + status=`HandoffPending` + disposition=None | `Degraded` with body | 保持hard block；不创建decision；其它status遇此gap为no-body `Unavailable`。 |
| exactly one `ProjectionSource` | full current security fields + disposition=Some + status=`Detected/Contained/HandoffPending/Terminal` | `Degraded` with body | 仅表达projection linkage不完整；不使用过期body。 |
| `ProjectionSource` + status=`Released` | Released proof的current projection relation无法证明 | no-body `Unavailable` | 不降级展示Released，不推导backend/cleanup complete。 |
| malformed/duplicate/wrong-lineage/cursor regression/proof contradiction | known integrity conflict | integrity `Err` | 不重试选winner、不转gap、Empty或warning。 |

degraded source只允许一条`Disposition`或一条`ProjectionSource` gap，不允许两者并存。gap的context/ref必须
与selector全等，required cursor等于binding source cursor，available存在时严格早于required。known missing
committed row、duplicate current binding、wrong generation、release/terminal proof冲突属integrity error，不是typed gap。

### 49.3 Read-only security redlines

reader和facade对以下能力的调用次数固定为0：`RedlineContainmentGuard`重评、stop-new-use/terminate-run
执行、preservation刷新、external investigation调用或重试、release/terminal transition、cleanup authorization、projection
repair/materialization、business audit append、stored result/idempotency write。查询只能读取已提交的safe body-free
carrier，并发出context/ref/body-free的低基数diagnostic category。

## 50. A2-F3-R Static Self-check 与阶段状态

| check | result |
|---|---|
| request / reader method / canonical outcome | `1/1/1`；Step 6 source/outcome/view复制=`0` |
| selector variants | required exact `{context_ref, redline_ref}`=`1/1`；context-only/latest/historical=`0/0/0` |
| binding branches | Found/ExactAbsent/Unavailable=`3/3`；count `>1` integrity闭合 |
| required source group | binding/truth/lineage+detection/containment proof/preservation/investigation/disposition+timeline=`7/7` |
| gap kinds | Step 6 closed gap=`9/9`；body-compatible=`Disposition | ProjectionSource` with exact predicates |
| Released fail-closed | any core gap or `ProjectionSource` gap -> no-body `Unavailable`；degraded Released=`0` |
| side effects | guard/terminate/preservation/investigation/release/cleanup/projection/audit/idempotency=`0/0/0/0/0/0/0/0/0` |
| new L1/L2 blocker | `0`；existing `READ-001 | OUTCOME-001` unchanged |

`A2-F3-R` 完成。F3尚需shared error/facade mapping、adapter/fake boundary、总静态审计和恢复源同步，不得
提前形成用户复核门。下一内部任务为`A2-F3-J shared join/static/recovery sync`。

## EOF Current Working Batch: `7R-04A-A2-F3-R` redline completed

本节取代F3-C working state，成为本文件物理EOF的current working authority。三个Query reader family内容已完成；
shared join与五层恢复源同步尚pending。

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F3 failure/cleanup/redline exact reader contracts in_progress
completed_internal_parts = A2-F2-C|A2-F2-H|A2-F2-J|A2-F2-R|A2-F3-F|A2-F3-C|A2-F3-R
current_internal_part = A2-F3-J shared join/static/recovery sync
pending_internal_parts = A2-F3-J
query_reader_coverage = 8/13
selector_variant_coverage = 13/13_for_completed_families
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## 51. A2-F3-J Shared Reader Error、Port 与 Outcome Join

F3的三个reader family共享调用边界，但不共享业务source、selector或view schema。以下error enum只描述
application reader在进入Step 6 view factory前可能遇到的有限调用、依赖、形状和完整性错误；它不携带raw row、SQL、
provider cause、hidden ref、page token body、security body或external response。Step 6的三个canonical
`*SourceLookupOutcome`仍是各自source和view factory的唯一owner。

```rust
/// failure/control、cleanup readiness与redline containment reader的共享错误闭集。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxFailureCleanupRedlineReadError {
    /// 被调用的reader method与Query kind不一致。
    QueryKindMismatch,
    /// access decision与service context的actor、scope或digest不一致。
    AccessDecisionContextMismatch,
    /// 非Permitted decision试图进入full reader。
    FullReadNotPermitted,
    /// request中的selector、context、page anchor或method family不一致。
    SelectorMismatch,
    /// public page request不能形成合法的typed page anchor。
    InvalidPageRequest,
    /// page cursor已过期、篡改或不再绑定当前允许的snapshot generation。
    PageCursorExpired,
    /// window limit为零、超过startup ceiling或与typed anchor不一致。
    WindowLimitInvalid,
    /// snapshot handle不属于当前manager、已关闭或被重复消费。
    ReadSnapshotUsageInvalid,
    /// fair committed snapshot暂不可用或无法保证同一generation。
    ReadSnapshotUnavailable {
        /// 不含driver、path、SQL或raw provider cause的caller-safe reason。
        reason: SandboxReason,
    },
    /// exact index、binding或source repository暂不可用；不是absence proof。
    RepositoryUnavailable {
        /// 不含存储细节的caller-safe dependency reason。
        reason: SandboxReason,
    },
    /// repository返回无法归入temporary dependency的内部失败。
    RepositoryFailed {
        /// 不含raw cause的稳定内部reason。
        reason: SandboxReason,
    },
    /// exact/current lookup cardinality不满足规定的0/1闭集。
    CardinalityIntegrityInvalid,
    /// selector、owner、lineage或source relation不一致。
    OwnerRelationIntegrityInvalid,
    /// current index与immutable exact binding的位置或ref不一致。
    CurrentBindingIntegrityInvalid,
    /// failure/control whole group、window、summary或cross-link损坏。
    FailureGroupIntegrityInvalid,
    /// cleanup guard、owner、redline coverage或release relation损坏。
    CleanupGroupIntegrityInvalid,
    /// redline truth、containment proof、preservation、investigation或timeline损坏。
    RedlineGroupIntegrityInvalid,
    /// binding存在但source/view row丢失、重复或未原子提交。
    MaterializationIntegrityInvalid,
    /// cursor、audit、timestamp或snapshot generation关系非法。
    SnapshotRelationIntegrityInvalid,
    /// typed read gap的kind、selector、cursor、count或reason shape非法。
    ReadGapShapeInvalid,
    /// absence proof与selector、cardinality、watermark或audit关系不一致。
    AbsenceProofInvalid,
    /// lookup outcome把source、absence、gap或view放入错误branch。
    LookupOutcomeInvalid,
    /// Step 6 checked source或view factory拒绝已加载whole group。
    SourceContractInvalid,
    /// reader尝试write、identity allocation、repair、external call或business audit append。
    NoWriteViolation,
}
```

三类request、具名reader method和Step 6 canonical outcome/source必须一一对应；F3不新增第四个generic
`read(kind, selector)`入口：

| Query | application-local request | 唯一reader method | canonical Step 6 outcome | source/view owner |
|---|---|---|---|---|
| `GetFailureControlStatus` | `FailureControlStatusReadRequest` | `read_failure_control_status_source` | `FailureControlStatusLookupOutcome`；内部承接`FailureControlStatusSourceSnapshot` | Step 6 failure/control source与`FailureControlStatusView` factory |
| `GetCleanupReadiness` | `CleanupReadinessReadRequest` | `read_cleanup_readiness_source` | `CleanupReadinessSourceLookupOutcome`；内部承接`CleanupReadinessSourceSnapshot` | Step 6 cleanup source与`CleanupReadinessView` factory |
| `GetRedlineContainmentStatus` | `RedlineContainmentReadRequest` | `read_redline_containment_source` | `RedlineContainmentSourceLookupOutcome`；内部承接`RedlineContainmentSourceSnapshot` | Step 6 redline source与`RedlineContainmentView` factory |

`FailureControlStatusReadRequest`的page decoder、`CleanupReadinessReadRequest`的current/exact selector和
`RedlineContainmentReadRequest`的required exact selector均在target read前完成pure校验。reader只能消费已经
通过matching access gate的request和一个caller提供的`SandboxCommittedReadSnapshot`；reader不得重新解释
caller input、解码public token、选择latest row或创建view identity。

### 51.1 Shared error 到 application surface 的固定映射

| reader error family | application detail / successful surface | body rule | owner |
|---|---|---|---|
| `ReadSnapshotUnavailable`、`RepositoryUnavailable` | `ApplicationErrorDetail::PortUnavailable` | 不构造`Empty`、`Degraded`或successful no-body `Unavailable` | snapshot/repository dependency owner |
| `RepositoryFailed`、`ReadSnapshotUsageInvalid` | `ApplicationErrorDetail::InternalInvariantViolation` | 当前调用失败；不重读、不换snapshot | adapter/data-integrity owner |
| `QueryKindMismatch` | `ApplicationErrorDetail::InvalidOperationMapping` | 不进入target/index read | application wiring owner |
| `AccessDecisionContextMismatch`、`FullReadNotPermitted`、`SelectorMismatch`、`InvalidPageRequest`、`PageCursorExpired`、`WindowLimitInvalid` | `ApplicationErrorDetail::QueryAccessShapeInvalid` | 不通过宽松selector、第一页回退或latest fallback | application facade/request owner |
| `CardinalityIntegrityInvalid`、`OwnerRelationIntegrityInvalid`、`CurrentBindingIntegrityInvalid`、`FailureGroupIntegrityInvalid`、`CleanupGroupIntegrityInvalid`、`RedlineGroupIntegrityInvalid`、`MaterializationIntegrityInvalid`、`SnapshotRelationIntegrityInvalid`、`ReadGapShapeInvalid`、`AbsenceProofInvalid`、`LookupOutcomeInvalid`、`SourceContractInvalid` | `ApplicationErrorDetail::InternalInvariantViolation` | 不转`Empty`、`Degraded`、warning或历史row | migration/quarantine/reconciliation owner |
| `NoWriteViolation` | `ApplicationErrorDetail::NoWriteViolation` | 丢弃当前结果；不做补偿写或继续返回body | implementation/wiring owner |
| cleanup成功返回`NoView { ... }` | `SandboxQueryResult::no_body(Unavailable, reasons)` | 这是已加载typed gap的成功surface；不回退older carrier | cleanup source owner |
| redline成功返回`Unavailable { ... }` | `SandboxQueryResult::no_body(Unavailable, reasons)` | 这是已加载typed gap的成功surface；core security gap绝不带body | redline source owner |
| failure reader任何上述technical/integrity `Err` | application error | **不得**构造成成功的`FailureControlStatusQueryResult::no_view(Unavailable, ...)` | failure reader/facade error mapper |

访问决策本身返回`Unavailable`时，facade可以按既有access contract构造successful no-body `Unavailable`，因为此时
尚未打开snapshot且没有target existence observation；reader打开snapshot后发生的`ReadSnapshotUnavailable`或
`RepositoryUnavailable`必须走`PortUnavailable` application error。这两个表面不能合并。

## 52. A2-F3-J Access-first Facade Flow 与三类 Outcome Mapping

三个facade method共享控制流模板，但各自只调用对应的具名reader method。所有输入验证、access decision、snapshot
生命周期和最终surface构造均由application service拥有；reader只负责同snapshot source lookup。

```text
checked service context + checked Query input
  -> pure input / channel / operation validation
  -> SandboxQueryAccessDecision
     -> NotVisible / Restricted / access Unavailable: return before target/index read
     -> Permitted
        -> family page/selector decoder and typed request factory
        -> SandboxCommittedReadManager::open exactly once
        -> call exactly one family-named reader method
        -> exhaustive Step 6 outcome -> view/result factory mapping
        -> SandboxCommittedReadManager::close the same snapshot exactly once
        -> redacted low-cardinality diagnostic hook
        -> return application surface
```

`open`成功后，无论reader返回成功outcome还是`Err`，都必须在同一控制流中对同一snapshot执行一次`close`；
close失败以`PortUnavailable`覆盖尚未返回的surface，不重读、不打开第二snapshot、不追加business audit。`open`本身
失败时没有有效handle，不调用`close`。access early-return不解码page token、不读取binding/index、不构造existence-sensitive
reason。

### 52.1 Facade 与 reader 的固定映射

| facade method | request factory | reader method | successful outcome branches | final mapping |
|---|---|---|---|---|
| `get_failure_control_status` | `FailureControlStatusReadRequest::try_from_permitted`，page decoder先产出typed anchor/limit | `read_failure_control_status_source` | `ViewSource`、`EmptyScope` | `ViewSource`按complete/degraded factory映射`Visible/Degraded`并保留page info；`EmptyScope`只映射`FailureControlStatusQueryResult::empty`；reader technical `Err`走application error。 |
| `get_cleanup_readiness` | `CleanupReadinessReadRequest::try_from_permitted` | `read_cleanup_readiness_source` | `ViewSource`、`CurrentAbsent`、`ExactAbsent`、`NoView` | `ViewSource`按complete/degraded factory映射`Visible/Degraded`；两种typed absence映射`Empty`且不带view；`NoView`映射no-body `Unavailable`；reader technical `Err`走application error。 |
| `get_redline_containment_status` | `RedlineContainmentReadRequest::try_from_permitted` | `read_redline_containment_source` | `ViewSource`、`ExactAbsent`、`Unavailable` | `ViewSource`按complete/degraded factory映射`Visible/Degraded`；`ExactAbsent`映射`Empty`；`Unavailable`映射no-body `Unavailable`；reader technical `Err`走application error。 |

### 52.2 三个family的facade invariant

| invariant | failure/control | cleanup | redline |
|---|---|---|---|
| access precedence | `NotVisible/Restricted/Unavailable`在page decoder和reader前返回 | 同左；不因exact guard ref改写access结果 | 同左；不因redline ref验证存在性 |
| snapshot | 一个fair committed snapshot承接binding、source、proof和page | 一个snapshot承接current/exact binding、owners和relations | 一个snapshot承接exact binding、security proof和timeline |
| success absence | 仅`EmptyScope`且需完整scope/page proof | 仅`CurrentAbsent`或`ExactAbsent`且需完整index count=`0` proof | 仅`ExactAbsent`且需完整exact count=`0` proof |
| typed gap | `WindowCoverage/ScopeSummary/CrossLinkDependency/ProjectionSource`只按Step 6允许规则带body | `NoView`不带body；仅current单一`ReleaseRelation`可degraded | core gap不带body；仅满足状态谓词的单一`Disposition/ProjectionSource`可degraded |
| side effects | classifier/control/cleanup/reaper/audit append=`0` | guard/release/reaper/owner transition/audit append=`0` | containment/terminate/investigation/release/repair/audit append=`0` |

facade不得自己读取source字段再拼view；必须将checked source交给Step 6 named factory。canonical body中的
`Unknown`、`Pending`、`Conflicted`、`Allowed`、`Released`和`Terminal`等业务状态保持原值，不能因为本次Query
surface是`Degraded`、`Unavailable`或`Empty`而重命名为业务状态。

### 52.3 Diagnostic 与审计边界

Query完成后最多调用一次redacted diagnostic hook，输入只允许固定operation/query kind、最终surface、selector
variant kind、returned count和低基数reason category。不得记录page token、exact hidden ref、failure/redline reason
正文、host/path/process/network detail、SQL、raw provider error或source body。三个facade的business audit append、
stored-result/idempotency write、relay append均固定为`0`；diagnostic hook失败不改变已经确定的surface。

## 53. A2-F3-J Durable Adapter、Deterministic Fake 与 Snapshot Ownership

### 53.1 Durable owner

durable implementation只有一个logical owner：`infra::query_read`。它可以在内部按family拆分private typed helper，
但对application只暴露`SandboxFailureCleanupRedlineReader`的三个具名method；API、Worker、Jobs和maintenance
consumer不得直接访问repository、index或helper。

| boundary | durable contract | forbidden implementation | required count |
|---|---|---|---:|
| public application port | 一个`SandboxFailureCleanupRedlineReader`，三个具名method | `read(kind, selector)`、`read<T>`、`Option<View>` generic fallback | `1` port / `3` methods |
| snapshot ownership | facade/`SandboxCommittedReadManager`负责open/close；reader只借用`&mut dyn SandboxCommittedReadSnapshot` | reader自行open/close、保存snapshot到字段、跨snapshot补child row | open=`1`、close=`1` per permitted call |
| request ownership | factory生成的permitted request是唯一输入carrier | adapter接受raw input、opaque selector、caller status/reason或latest hint | `3/3` typed request |
| source ownership | Step 6 `*SourceLookupOutcome`和view factory是canonical owner | adapter复制source/view/gap schema或修改canonical status | duplicate schema=`0` |
| write capability | read snapshot不得暴露UoW、CAS、commit、rollback、identity allocator或external port | query内repair/materialization/release/reaper/audit append | write/external=`0/0` |

private helper只能按已固定的logical key和whole-group顺序读取；helper的失败必须映射到shared error enum，不得把
repository `None`直接转成absence，也不得以第二次latest查询补全同一source。

### 53.2 Deterministic fake parity

`SandboxDeterministicFailureCleanupRedlineReader`只接受预先构造且已通过Step 6 checked factory的scripted outcome，
或预先指定的shared reader error。fake记录每次调用的具名method、request family、snapshot ref和调用次数，用于
assembly/source audit；它不从私有map自动补binding、owner、summary、proof、view ref或page info。

| parity dimension | durable | deterministic fake | audit assertion |
|---|---|---|---|
| method set | failure/cleanup/redline各一个具名method | 同名、同参数语义、同返回outcome/error | `3/3` exact parity |
| request validation | 只接受三个permitted request | 拒绝raw input、wrong family、mismatched decision/selector | validation bypass=`0` |
| snapshot | 使用caller提供的同一snapshot | 记录并校验期望snapshot ref，不自行创建 | snapshot substitution=`0` |
| outcome | 返回Step 6 canonical outcome | 返回预脚本的同一canonical outcome | outcome schema duplication=`0` |
| technical/integrity error | 返回shared error enum | 返回预脚本的同一shared error enum | error mapping parity=`1/1` |
| side effects | 不写、不分配identity、不调用external | 同样不写、不补数据、不调用external | write/identity/external=`0/0/0` |

fake只用于deterministic contract tests和assembly wiring检查，不是实现完成证据；没有真实存储、真实测试运行或
evidence alias时，台账必须继续标记`real_test_execution = not_started`和`real_evidence_created = no`。

## 54. A2-F3-J Shared Static Audit

| static check | result | closure rule |
|---|---:|---|
| request / named reader method / canonical outcome / source mapping | `3/3` | failure、cleanup、redline分别是`1/1/1/1`；没有generic reader或复制source/view。 |
| query reader coverage | `8/13` | F1=`3`、F2=`2`、F3=`3`；其余F4/F5/A3未提前计入。 |
| selector contribution in F3 | `4/4` | failure bounded page family=`1`（`first/continued`两分支）、cleanup=`CurrentForContext + ExactGuard`两variant、redline=`Exact`一variant。 |
| cumulative selector variants | `13/13` | F1=`5` + F2=`4` + F3=`4`；不把latest、historical fallback或opaque selector计入。 |
| existing maintenance reader preservation | `9/9` | 既有maintenance reader保留；已完成Query调用=`0/8`，不将其升级为public Query owner。 |
| Query write UoW/CAS/commit/rollback | `0` | 三个facade、reader、durable adapter、fake均只读。 |
| identity/view/audit/cursor allocation | `0` | 读取已提交binding/ref；不现场分配identity、view ref、audit ref或public token。 |
| external/domain mutation calls | `0` | failure classifier、control transition、cleanup/reaper/release、containment/terminate、investigation、repair均不调用。 |
| business audit / stored result / idempotency / relay append | `0` | 只允许一次低基数redacted diagnostic hook，且hook失败不改surface。 |
| absence proof | `4/4` | failure `EmptyScope`、cleanup current/exact、redline exact均有完整 count/cursor/selector proof；technical failure不算absence。 |
| body-compatible gap closure | `3/3` | failure按Step 6 gap predicates；cleanup仅current单一`ReleaseRelation`；redline仅单一合法`Disposition/ProjectionSource`。 |
| fail-closed security | `1/1` | redline core gap、Released + projection gap、integrity conflict均无body或`Err`；不展示不完整Released。 |
| new L1/L2 blocker | `0` | 仅保留既有`SBX-DDD-GRANULARITY-STEP7-OUTCOME-001`与`SBX-DDD-GRANULARITY-STEP7-READ-001`。 |

静态审计结论：F3三family的application request、reader port、error mapping、same-snapshot boundary、fake/durable
parity和zero-write规则已经闭合；这不是实现、编译、测试或验收结果。`A2-F4 projection/derived/comparison`
仍未读取、未设计、未标记完成。

## 55. A2-F3 完成状态与用户复核门

本节位于本文件物理EOF，是F3当前唯一工作权威。此前F3-F、F3-C、F3-R和中间working state均保留为历史轨迹；
本节只更新恢复点，不回填正式`03-详细设计.md`。

| item | current state |
|---|---|
| `A2-F3-F` | `completed` |
| `A2-F3-C` | `completed` |
| `A2-F3-R` | `completed` |
| `A2-F3-J` | `completed_wait_user_review` |
| F3 batch | `completed_wait_user_review`；三family内容与shared join已完成，等待用户复核 |
| query reader coverage | `8/13` |
| selector variant coverage | `13/13` for completed families |
| existing maintenance reader | `9/9` preserved；Query use=`0/8` |
| open blockers | `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001`、`SBX-DDD-GRANULARITY-STEP7-READ-001` |
| new L1/L2 blocker | `0` |
| formal `03-详细设计.md` writeback | `forbidden` |
| Step 8 | `blocked_by_step_7_regression` |
| implementation / real test / evidence / signoff | `wait_design` / `not_started` / `no` / `no` |
| commit | `not_required`；本次不提交 |

```text
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F3 failure/cleanup/redline exact reader contracts completed_wait_user_review
completed_internal_parts = A2-F2-C|A2-F2-H|A2-F2-J|A2-F2-R|A2-F3-F|A2-F3-C|A2-F3-R|A2-F3-J
current_internal_part = A2-F3 review gate
pending_internal_parts = A2-F4 projection/derived/comparison|A2-F5 reconciliation/audit|A3 writer boundary|A4 blocker closure
query_reader_coverage = 8/13
selector_variant_coverage = 13/13_for_completed_families
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/8_completed_queries
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
next_internal_batch = A2-F4 projection/derived/comparison exact reader contracts
next_allowed_action = wait_user_review_before_A2-F4
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

F3完成后停止。未经用户复核确认，不读取或启动A2-F4，不进入A3/A4、Step 8、正式文档回填、implementation、
真实测试、验收或交付。

## 56. A2-F4 开工：Projection、Derived、Comparison Exact Reader

本节起为 `A2-F4` 的新一轮中间产物。F3 已经在用户复核门完成，本批只消费该门禁和下列上游契约：

| 上游输入 | 本批采用的约束 | 本批不重新定义的内容 |
|---|---|---|
| Step 6 §15.8 `SandboxReadProjection` | projection 是 body-free、可重建的 read identity；`Fresh/Stale/Rebuilding/Degraded/Unavailable` 是唯一 canonical status | projection 字段、marker、rebuild attempt、双 cursor、transition 不在 Step 7 复制 |
| Step 6 §§16.8.2、16.8.9~16.8.14 | derived selector、absence proof、`ViewSource/ExactAbsent/Unavailable` 和 view factory 已闭合 | derived state、materialization union、payload schema不在本批重写 |
| Step 6 §§16.9.2~16.9.14 | comparison selector、cardinality proof、`ViewSource/ExactAbsent/Unavailable` 和 view factory 已闭合 | requirement、summary、十维 item、aggregate 不在本批重写 |
| Step 7 §§22.4、23、24.4 | access-first、一个公平 snapshot、named facade method、Query zero-write | API DTO、完整 flow、测试方案和验收证据留给下游Step |
| `SandboxCommittedReadSnapshot` contract | reader只借用caller提供的snapshot，不open/close、不持有write UoW | snapshot manager生命周期由facade负责 |

### 56.1 SOP 问题回答

| SOP 问题 | A2-F4 current answer |
|---|---|
| 哪个模块拥有 reader port | `application::ports::query_read`；Projection、Derived、Comparison各保留一个具名方法，不能退化为`read(kind, selector)` |
| reader最小输入是什么 | 对应family的`Permitted`、已校验selector和一个`&mut dyn SandboxCommittedReadSnapshot`；不接受raw DTO、latest hint或optional ref precedence |
| reader输出是什么 | Projection返回application-local checked source / typed missing / canonical unavailable；Derived与Comparison直接返回Step 6 closed `*SourceLookupOutcome` |
| absence如何证明 | Projection必须由完整 exact/current index count 和 target relation证明；Derived/Comparison只使用Step 6 formal proof；repository `None`不构成成功absence |
| 哪些缺口可带body | Projection按canonical status保留safe projection body；Derived只允许`CurrentSourceCoverage`；Comparison只允许`CurrentCapabilityCoverage` |
| 技术失败如何映射 | snapshot/repository failure、malformed row、cardinality和relation错误均为reader `Err`，由facade映为application error；不构造successful no-body `Unavailable` |
| Query是否触发维护 | 永远不触发。不得创建projection ref、marker、attempt、derived builder、comparison refresh、backend probe或audit append |
| 是否增加图 | 不画图。本批关键风险是selector/outcome/cardinality矩阵，表格可机械审计三类reader数量和分支；调用顺序已由Step 7 §23固定 |

### 56.2 当前诊断与取舍

| 诊断项 | 发现 | F4 处理 |
|---|---|---|
| Projection carrier不完整 | Step 6已有rebuild source与domain schema，但没有Query exact/current binding、absence和closed lookup carrier | 仅新增application/persistence read carrier；复用`SandboxReadProjection`字段与status |
| Derived/Comparison重复定义风险 | Step 6已经给出完整source lookup outcome和factory | reader只装配并返回canonical outcome，不复制source/view/gap schema |
| `None -> Empty`风险 | projection缺失、derived/comparison exact absence的public语义不同 | Projection缺失固定`MissingProjection`；Derived/Comparison exact absence固定`Empty` |
| read failure与业务Unavailable混淆 | canonical projection/derived/comparison row可以合法表达Unavailable，底层依赖失败不是业务状态 | 只有已读取的canonical typed unavailable进入successful no-body；底层technical failure走`Err` |
| 维护面膨胀 | projection rebuild、derived maintain、capability refresh都已有明确job owner | 本批只写read boundary；不写scheduler、rebuild algorithm、repair或writer |

### 56.3 F4 内部任务与本批写入界限

| 内部任务 | 本批状态 | 交付物 |
|---|---|---|
| `A2-F4-P` Projection reader contract | `in_progress` | request、binding selection、absence、canonical unavailable、status mapping、具名reader |
| `A2-F4-D` Derived reader contract | `pending` | 复用Step 6 source lookup outcome的同snapshot读取顺序和facade映射 |
| `A2-F4-C` Comparison reader contract | `pending` | ordered source set、三计数cardinality、source outcome和surface mapping |
| `A2-F4-J` Shared join/static audit | `pending` | shared error、facade、adapter/fake parity、静态计数与恢复源同步 |

本节及其后续F4段落仍属于中间产物。正式 `projects/L4-sandbox/03-详细设计.md` 保持冻结；本批不声明实现、编译、
测试、evidence或验收完成。

## 57. A2-F4-P Projection Permitted Read Request

`SandboxReadProjectionReadRequest` 是application-local transient carrier。它把access decision与closed selector绑定，
让durable adapter无法绕过access-first或把`Exact`、`CurrentForContext`解释成同一个latest查询。该类型不进入Step 6 domain
registry、Step 8 DTO或持久化schema。

```rust
/// 已通过full-read access gate的Sandbox read projection读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReadProjectionReadRequest {
    /// 与service context和固定Query kind匹配的Permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// caller明确选择的exact/current closed selector。
    selector: SandboxReadProjectionSelector,
}

impl SandboxReadProjectionReadRequest {
    /// 只接受matching query kind、context、digest和Permitted full-read decision。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetSandboxReadProjectionInput,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;

    /// 返回matching access decision；reader不得自行重新计算权限。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回已经闭合的projection selector。
    pub fn selector(&self) -> &SandboxReadProjectionSelector;
}
```

factory的校验顺序固定为：

1. `context.channel() == ApiQuery`、operation与`GetSandboxReadProjection`一致、request digest和actor context有效；
2. `input.selector()`已经是Step 6 closed enum，并逐字段匹配`access_decision.context_ref()`；
3. `access_decision.query_kind() == GetSandboxReadProjection`且`permits_full_read() == true`；
4. `Exact`必须携带同一context的typed `projection_ref`；`CurrentForContext`不得携带projection ref或latest hint；
5. factory不读取index、projection row、status或marker，也不把校验失败改写为`MissingProjection`。

`access_decision`与selector均以不可变值保存在request中。reader若收到手工构造的context、query kind或decision不一致的
request，必须返回`AccessDecisionContextMismatch | SelectorMismatch | FullReadNotPermitted`，不能继续调用snapshot。

## 58. A2-F4-P Projection Binding Selection、Absence 与 Source Carrier

Step 6 `SandboxReadProjection`是最终domain/read object；以下carrier只记录同一snapshot中“哪个index binding被选中、
是否存在、它指向哪个已提交projection row”。它不复制projection内部字段，也不产生新的identity。

```rust
/// projection exact/current index命中的同snapshot selection proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReadProjectionBindingSelectionProof {
    /// 本proof消费的access-approved selector。
    selector: SandboxReadProjectionSelector,
    /// exact/current index选中的已提交projection identity；命中时必填。
    projection_ref: SandboxReadProjectionRef,
    /// matching current binding的计数；合法命中值固定为1。
    current_binding_count: u64,
    /// binding target projection row的计数；合法命中值固定为1。
    target_row_count: u64,
    /// index/binding owner已有的audit linkage；不是本次query audit。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot index observation time。
    observed_at: Timestamp,
}

impl SandboxReadProjectionBindingSelectionProof {
    /// 从完整同snapshot index与target row关系构造命中proof。
    pub fn try_from_committed_index(
        selector: SandboxReadProjectionSelector,
        projection_ref: SandboxReadProjectionRef,
        current_binding_count: u64,
        target_row_count: u64,
        source_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;

    /// 返回selector。
    pub fn selector(&self) -> &SandboxReadProjectionSelector;
    /// 返回selected projection ref。
    pub fn projection_ref(&self) -> &SandboxReadProjectionRef;
    /// 返回固定为1的current binding count。
    pub fn current_binding_count(&self) -> u64;
    /// 返回固定为1的target row count。
    pub fn target_row_count(&self) -> u64;
    /// 返回已有source audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回index observation time。
    pub fn observed_at(&self) -> &Timestamp;
}

/// projection exact/current lookup完整证明不存在目标的proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReadProjectionAbsenceProof {
    /// access-approved exact/current selector。
    selector: SandboxReadProjectionSelector,
    /// matching current binding count；合法值固定为0。
    current_binding_count: u64,
    /// exact target row count；合法值固定为0，防止orphan row被误判为缺失。
    target_row_count: u64,
    /// absence index已有的audit linkage。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// same-snapshot absence observation time。
    observed_at: Timestamp,
}

impl SandboxReadProjectionAbsenceProof {
    /// 只有完整index、双零计数和既有audit linkage才能构造projection absence。
    pub fn try_from_committed_index_absence(
        selector: SandboxReadProjectionSelector,
        current_binding_count: u64,
        target_row_count: u64,
        source_audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;

    /// 返回selector。
    pub fn selector(&self) -> &SandboxReadProjectionSelector;
    /// 返回固定为0的current binding count。
    pub fn current_binding_count(&self) -> u64;
    /// 返回固定为0的target row count。
    pub fn target_row_count(&self) -> u64;
    /// 返回absence index audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回absence observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

selection与absence proof的构造器必须拒绝以下输入：计数大于1、selector context不一致、projection ref kind错误、空
audit linkage、非单调时间、partial index标记或由repository `None`直接转换的伪proof。`CurrentForContext`的零结果证明
“当前binding不存在”；若同一完整snapshot能观察到orphan projection row，必须返回`CurrentBindingIntegrityInvalid`，而不是
把`target_row_count > 0`压成absence。`Exact`同样要求binding与target row双零，确保exact orphan不会泄漏为正常缺失。

```rust
/// projection query在同一snapshot中形成的checked source carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReadProjectionQuerySource {
    /// exact/current binding selection proof。
    selection: SandboxReadProjectionBindingSelectionProof,
    /// 已提交的projection domain/read object；字段由canonical owner提供。
    projection: SandboxReadProjection,
    /// formal reader完成source assembly的观察时间。
    observed_at: Timestamp,
}

impl SandboxReadProjectionQuerySource {
    /// 校验selector、binding、projection identity、context和时间关系后构造source。
    pub fn try_new(
        selection: SandboxReadProjectionBindingSelectionProof,
        projection: SandboxReadProjection,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;

    /// 返回selection proof。
    pub fn selection(&self) -> &SandboxReadProjectionBindingSelectionProof;
    /// 返回canonical projection object。
    pub fn projection(&self) -> &SandboxReadProjection;
    /// 返回formal observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

source carrier只允许复制已提交projection，不读取或保存status-view body、artifact、log、metric、builder response、host、
path、PID或network endpoint。`projection.context_ref()`必须等于selector context；`projection.projection_ref()`必须等于
selection projection ref；selection和projection的source audit linkage必须属于同一已提交owner relation。任何关系不一致都
是integrity/contract error，不是degraded gap。

## 59. A2-F4-P Projection Closed Outcome 与状态映射

Projection的Query outcome必须区分三种成功事实：有已提交projection、完整证明projection缺失、已读取canonical
projection但其状态明确不可用。底层snapshot/repository失败不属于以下成功分支。

```rust
/// GetSandboxReadProjection在一个fair committed snapshot中的closed成功结果。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxReadProjectionSourceLookupOutcome {
    /// 已命中并完成relation check的projection source。
    ViewSource(SandboxReadProjectionQuerySource),
    /// exact/current index完整证明projection不存在；映射为MissingProjection而非Empty。
    MissingProjection(SandboxReadProjectionAbsenceProof),
    /// 已读取并校验canonical projection status=Unavailable；最终成功surface不携带body。
    Unavailable(SandboxReadProjectionQuerySource),
}

impl SandboxReadProjectionSourceLookupOutcome {
    /// 构造ViewSource；projection必须不是canonical Unavailable。
    pub fn view_source(
        source: SandboxReadProjectionQuerySource,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;
    /// 构造双零absence分支。
    pub fn missing_projection(
        selector: &SandboxReadProjectionSelector,
        proof: SandboxReadProjectionAbsenceProof,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;
    /// 构造canonical unavailable no-body分支；source中的projection必须为Unavailable。
    pub fn unavailable(
        source: SandboxReadProjectionQuerySource,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;
}
```

成功分支和最终surface固定如下：

| source条件 | body | `SandboxQuerySurfaceStatus` | 规则 |
|---|---:|---|---|
| projection `Fresh` | 必须有 | `Visible` | 不得因为query observation重新判断freshness |
| projection `Stale` | 必须有canonical projection body；旧coverage可无 | `Stale` | reasons来自已提交marker；不触发rebuild；无旧coverage也不伪造status-view body |
| projection `Rebuilding`且有旧coverage | 可有 | `Rebuilding` | body只能是last-known-safe/status-only；不得宣称Fresh |
| projection初始`Rebuilding`且无coverage | 必须有canonical projection status-only body | `Rebuilding` | 返回已读取的exact `SandboxReadProjection`；不伪造status-view coverage |
| projection `Degraded` | 必须有 | `Degraded` | reasons来自typed degraded set；不改写projection status |
| canonical projection `Unavailable` | 无 | `Unavailable` | 只有已读取的canonical status才能进入successful no-body |
| 完整 exact/current zero proof | 无 | `MissingProjection` | 不使用普通`Empty`，也不把index技术失败当缺失 |

`ViewSource`若携带`Unavailable` projection，必须转成携带同一checked source的`Unavailable`成功分支；facade只从该
source的canonical projection提取caller-safe availability reason并丢弃body。若source携带不合法字段组合，返回
`SourceContractInvalid`。`MissingProjection`要求selector与proof全等、两个计数均为0且audit/time relation完整；任何
count不确定、index partial、timeout或repository `None`均不得构造该分支。

Projection query不创建`SandboxReadProjectionRef`、`SandboxProjectionStaleMarker`、`SandboxProjectionRebuildAttempt`、
`SandboxAuditTraceRef`或cursor；这些值只能从已提交row/index读取。它不调用`rebuild_sandbox_projections`、truth owner、
reference owner、cleanup/reaper、redline、tool/runtime、artifact capture或external adapter。

## 60. A2-F4-P Projection Named Reader、读取顺序与自检

F4三个Query共享一个application port只是装配选择；它们仍是三个具名、typed、不能互换的方法。先固定完整method set，
后续§61~§64分别闭合Derived与Comparison request和读取规则；实现不得用generic discriminator替代任一方法。

```rust
/// projection、derived与comparison三个只读Query的application-owned exact source port。
pub trait SandboxProjectionDerivedComparisonReader: Send + Sync {
    /// 在caller提供的一个fair committed snapshot中读取exact/current projection。
    async fn read_sandbox_read_projection_source(
        &self,
        request: &SandboxReadProjectionReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<
        SandboxReadProjectionSourceLookupOutcome,
        SandboxProjectionDerivedComparisonReadError,
    >;

    /// 在同一个snapshot边界内读取required exact derived state/current view source。
    async fn read_derived_inspect_preview_trend_source(
        &self,
        request: &DerivedInspectPreviewTrendReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<
        DerivedInspectPreviewTrendSourceLookupOutcome,
        SandboxProjectionDerivedComparisonReadError,
    >;

    /// 在同一个snapshot边界内读取exact ordered backend capability comparison source。
    async fn read_backend_capability_comparison_source(
        &self,
        request: &BackendCapabilityComparisonReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<
        BackendCapabilityComparisonSourceLookupOutcome,
        SandboxProjectionDerivedComparisonReadError,
    >;
}
```

Projection method在传入snapshot中的逻辑顺序固定为：

```text
SandboxReadProjectionReadRequest
  -> validate method/query kind/selector family without target lookup
  -> read exact/current binding count and target-row count in one snapshot
     -> 0/0: construct SandboxReadProjectionAbsenceProof -> MissingProjection
     -> 1/1: read the binding-selected immutable projection row
     -> any other cardinality: Err integrity/reconciliation
  -> rehydrate canonical SandboxReadProjection and validate exact context/ref relation
     -> Fresh | Stale | Rebuilding | Degraded: ViewSource
     -> Unavailable: checked Unavailable source
  -> return without write, allocation, rebuild, external call or business audit append
```

| selector | exact index key | legal result | integrity result |
|---|---|---|---|
| `Exact { context_ref, projection_ref }` | exact binding/row by typed pair | binding/row=`0/0` missing；`1/1` found | `0/1` orphan、`1/0` dangling、任一count `>1`、row context/ref错配 |
| `CurrentForContext { context_ref }` | current projection binding by context + selected exact row | current/row=`0/0` missing；`1/1` found | zero current但same-key current-owned row存在、dangling/duplicate binding、latest scan winner |

`read_sandbox_read_projection_source`只接受caller snapshot引用，不得自行调用manager `open/close`，不得将snapshot保存在
reader字段或跨await转交detached task。即使`SandboxUnitOfWork`实现了read snapshot supertrait，facade wiring也只能传
`SandboxCommittedReadManager::open()`创建的只读handle；write-capable substitute由assembly audit判定为违规。

### 60.1 A2-F4-P 静态自检

| check | result |
|---|---|
| permitted request / closed selector | `1/1` request；`Exact + CurrentForContext = 2/2` variants |
| selection / absence / checked source / outcome | `1/1/1/1` |
| named reader method | `read_sandbox_read_projection_source = 1/1`；generic/latest reader=`0/0` |
| legal index cardinality | exact/current各`0/0 missing`或`1/1 found`；其它组合全部typed error |
| success surface | `Fresh/Visible`、`Stale/Stale`、`Rebuilding/Rebuilding`、`Degraded/Degraded`、canonical `Unavailable/no-body`、absence `MissingProjection` |
| Query write / identity / rebuild / external / business audit | `0/0/0/0/0` |
| canonical schema duplication | projection domain字段、marker、attempt、source view body复制=`0` |
| new L1/L2 blocker | `0`；现有`OUTCOME-001 | READ-001`仍开放，P只提供partial evidence |

```text
current_sub_batch = 7R-04A-A2-F4 projection/derived/comparison exact reader contracts in_progress
completed_internal_parts = A2-F4-P
current_internal_part = A2-F4-D derived exact reader contract
pending_internal_parts = A2-F4-D|A2-F4-C|A2-F4-J
query_reader_coverage = 9/13_provisional_within_F4
selector_variant_coverage = 15/15_for_completed_internal_parts
formal_03_writeback = forbidden
next_allowed_action = continue_A2-F4-D_only
```

`A2-F4-P`已完成并在本文件逐项标记；`9/13`只是在F4内部用于恢复的provisional coverage，F4 shared join与用户复审
完成前，不得把全局family计数写成`4/5 completed`。下一批只允许处理Derived，不进入Comparison或F5。

## 61. A2-F4-D Derived Permitted Exact Request

Derived Query直接复用Step 6 `DerivedInspectPreviewTrendSelector`，但仍需要application-local request把selector与已经通过
access gate的decision绑定。reader不得只接收selector，否则assembly可以绕过access-first并把exact state ref变成存在性
探针。

```rust
/// 已通过full-read access gate的derived inspect/preview/trend exact读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DerivedInspectPreviewTrendReadRequest {
    /// 与service context和GetDerivedInspectPreviewTrend匹配的Permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// Step 6 required context/state/kind exact selector。
    selector: DerivedInspectPreviewTrendSelector,
}

impl DerivedInspectPreviewTrendReadRequest {
    /// 只接受matching decision、service context和canonical derived selector。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetDerivedInspectPreviewTrendInput,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;

    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回required exact derived selector。
    pub fn selector(&self) -> &DerivedInspectPreviewTrendSelector;
}
```

factory按固定顺序校验：

1. service channel是`ApiQuery`，operation与`GetDerivedInspectPreviewTrend`一一匹配；
2. decision的actor、request digest、query kind与service context完全相等，且`permits_full_read()==true`；
3. selector context等于access scope，state ref是`DerivedInspectPreviewTrendStateRef`，kind只允许`Inspect | Preview | Trend`；
4. selector中的context/state/kind均为required，不接受opaque scope、optional state、kind-only scan或caller source refs；
5. validation不读取state、binding、materialization或source index，也不把wrong kind转换为`Empty`。

`BackendComparison | Reconciliation` kind必须在request factory阶段返回`SelectorMismatch`或由canonical selector factory返回
`UnsupportedDerivedKind`后映为application validation error；不得进入reader后扫描同kind的任意state。

## 62. A2-F4-D Same-snapshot Reader Sequence 与 Canonical Outcome Reuse

`read_derived_inspect_preview_trend_source`直接返回Step 6
`DerivedInspectPreviewTrendSourceLookupOutcome`。application、infra和fake不得复制
`DerivedInspectPreviewTrendAbsenceProof`、`DerivedNeverMaterializedProof`、read gap、source snapshot或final view schema。

```text
DerivedInspectPreviewTrendReadRequest
  -> verify method/query kind/request family without target observation
  -> read exact state count + exact current binding count in one snapshot
     -> state=0,binding=0: construct canonical absence proof -> ExactAbsent
     -> state=1,binding=1: construct canonical binding selection proof
     -> all other cardinalities: Err integrity/reconciliation
  -> load canonical state row and contracts-only state snapshot
  -> resolve last-success materialization position in the same snapshot
     -> exact successful row present and relation-complete: Present
     -> complete successful-materialization index count=0: NeverMaterialized proof
     -> canonical dependency coverage gap: typed Unavailable
     -> dangling/duplicate/contradictory row: Err integrity/reconciliation
  -> load and validate current source coverage and dual-cursor relation
     -> complete: DerivedInspectPreviewTrendSourceSnapshot::complete
     -> only CurrentSourceCoverage gap and body group complete: ::degraded_current_source
     -> other canonical typed gap: lookup Unavailable without view
  -> return canonical outcome; write/builder/external/audit count stays zero
```

### 62.1 Exact state、binding 与 materialization基数

| exact state count | current binding count | successful materialization relation | legal outcome | forbidden fallback |
|---:|---:|---|---|---|
| `0` | `0` | 不读取payload | `ExactAbsent`，且canonical proof两count为0 | repository `None`、partial index、`MissingProjection` |
| `1` | `1` | state合法声明从未成功且complete success index count=`0` | `ViewSource` + `NeverMaterialized` status-only source | `Empty`、生成status-only新ref、运行builder |
| `1` | `1` | state声明last-success且exact row/source relation完整 | `ViewSource` + `Present` | latest successful row、旧kind row、从state字段拼payload |
| `1` | `1` | canonical typed dependency coverage gap，未证明损坏 | `Unavailable`，或仅current-source gap时带view `Degraded` | technical error字符串、回退更旧row、丢payload拼status-only |
| `1` | `0` | 任意 | `CurrentBindingIntegrityInvalid` | `ExactAbsent`、`NeverMaterialized`、现场写binding |
| `0` | `1` | 任意 | `CurrentBindingIntegrityInvalid` | 从binding反推state、`Empty` |
| `>1` | 任意 | 任意 | `CardinalityIntegrityInvalid` | timestamp/ref winner |
| 任意 | `>1` | 任意 | `CardinalityIntegrityInvalid` | 取第一条current binding |

`NeverMaterialized`只证明successful materialization row数为零，不证明state或current immutable status row不存在。它只允许
canonical初始`Rebuilding | Failed | Unavailable`且last-success refs/cursors全部为空；Fresh必须有`Present`，Stale必须保留
`Present`，其它组合由Step 6 factory拒绝。reader不得从`Option::None`、empty source set或status名称自行猜该proof。

### 62.2 Typed gap 与 technical error 分层

| observed condition | reader result | public treatment |
|---|---|---|
| canonical committed lookup position明确返回`ViewBinding` coverage gap | Step 6 `Unavailable` outcome，gap必须是唯一项 | successful no-body `Unavailable` |
| state已选中但canonical `StateTruth` coverage gap | Step 6 `Unavailable` | successful no-body `Unavailable` |
| 完整state/body group只有`CurrentSourceCoverage` gap | checked degraded `ViewSource` | body + `Degraded` |
| last-success存在性已知但`MaterializationRow \| MaterializationSource` coverage gap | Step 6 `Unavailable` | successful no-body `Unavailable`；不丢payload拼status-only |
| snapshot失效、repository调用失败或无法保证公平generation | shared reader `Err` | application `PortUnavailable`；不是successful Query surface |
| duplicate、half-commit、wrong kind、cursor回退、malformed row | shared reader integrity/contract `Err` | application internal/invariant error；不降级 |

这里的canonical coverage gap必须来自typed lookup/index disposition，并带Step 6要求的selector、双cursor和safe reason；
SQL timeout、driver error、snapshot close failure或raw repository `NotFound`不是coverage gap。infra adapter必须先区分“已提交
dependency的typed read position”与“读取调用本身失败”，再分别进入canonical outcome或shared error。

## 63. A2-F4-D Derived Factory、Facade Surface 与副作用边界

facade消费outcome时不得重新读取source字段拼view。`ViewSource`必须根据source的checked gap形态调用唯一factory：

| canonical outcome / state | factory | final surface | body rule |
|---|---|---|---|
| `ViewSource` + no gap + `Fresh` | `DerivedInspectPreviewTrendView::from_committed_snapshot` | `Visible` | current body必填 |
| `ViewSource` + no gap + `Stale` | 同上 | `Stale` | last-known body必填；reason来自canonical marker/detail |
| `ViewSource` + no gap + `Rebuilding` | 同上 | `Rebuilding` | status-only或last-known body必填，保留canonical status |
| `ViewSource` + no gap + `Failed` | 同上 | `Visible` | status-only或last-known body；不是query/core failure |
| `ViewSource` + no gap + domain `Unavailable` | 同上 | `Visible` | status-only或last-known body；诚实展示maintenance truth |
| `ViewSource` +唯一`CurrentSourceCoverage` gap | `from_degraded_snapshot` | `Degraded` | body必填；canonical state status不改写 |
| `ExactAbsent` | 不调用view factory | `Empty` | 无body、无reason；只来自双零proof |
| canonical lookup `Unavailable` | 不调用view factory | `Unavailable` | 无body；reasons由typed gap set机械映射 |
| reader technical/integrity `Err` | 不调用view factory | 无successful surface | 映射application error并关闭同一snapshot |

domain `Failed`只表示derived builder/maintenance失败，domain `Unavailable`只表示derived source maintenance状态；二者都不是
`FailureClassification`、Sandbox core failure或本次Query依赖失败。facade若把这两个status映为Query `Failed/Unavailable`，
会丢失已经完整读取的业务状态，必须由static audit拒绝。

Derived Query硬性副作用边界：

| operation | allowed count | forbidden behavior |
|---|---:|---|
| state/binding/materialization/source read | 只在同一caller snapshot中按需读取 | 跨snapshot补latest materialization、读取builder output正文 |
| builder / maintenance transition | `0` | run inspect/preview/trend builder、start/finish/fail rebuild、刷新source marker |
| identity / cursor / audit ref allocation | `0` | 为status-only row或missing materialization生成ref/cursor |
| repository write / UoW / cache-aside materialize | `0` | save/upsert/repair/rebind/last-access write |
| external/tool/runtime/artifact body call | `0` | probe backend、launch agent/tool、采集或解析artifact/log/metric正文 |
| business audit / stored result / relay append | `0` | 为read追加`SandboxAuditTrace`、stored result或relay；只允许低基数diagnostic hook |

### 63.1 A2-F4-D 静态自检与阶段标记

| check | result |
|---|---|
| permitted request / exact selector | `1/1`；required context+state+kind family=`1/1`，允许kind值`Inspect/Preview/Trend=3/3` |
| canonical selector / binding / absence / never-materialized / gap / source / outcome / view reuse | `8/8` reused；application-local duplicate=`0` |
| named reader method | `read_derived_inspect_preview_trend_source = 1/1`；kind scan/latest/generic reader=`0/0/0` |
| absence mapping | exact state/binding双零=`Empty`；NeverMaterialized映body，不映Empty/MissingProjection |
| body-compatible gap | 仅`CurrentSourceCoverage = 1/1`；其它canonical gap全部no-body或integrity error |
| status mapping | `Fresh/Visible`、`Stale/Stale`、`Rebuilding/Rebuilding`、`Failed/Visible`、domain `Unavailable/Visible` |
| Query write / builder / identity / external / business audit | `0/0/0/0/0` |
| new L1/L2 blocker | `0`；现有`OUTCOME-001 | READ-001`保持开放 |

```text
current_sub_batch = 7R-04A-A2-F4 projection/derived/comparison exact reader contracts in_progress
completed_internal_parts = A2-F4-P|A2-F4-D
current_internal_part = A2-F4-C comparison exact reader contract
pending_internal_parts = A2-F4-C|A2-F4-J
query_reader_coverage = 10/13_provisional_within_F4
selector_variant_coverage = 16/16_for_completed_internal_parts
formal_03_writeback = forbidden
next_allowed_action = continue_A2-F4-C_only
```

`A2-F4-D`已完成并逐项标记。下一批只处理Comparison；在Comparison和shared join完成前，F4仍是
`authorized_in_progress`，不得启动F5、A3/A4或正式文档回填。

## 64. A2-F4-C Comparison Permitted Exact Request 与 Source-set Closure

Comparison Query必须消费Step 6的`BackendCapabilityComparisonSelector`。本批只补application-local access carrier，不复制
selector、source ref set或view schema。selector中的summary顺序是caller选择的稳定展示顺序，不是fallback、优先级或
winner selection。

```rust
/// 已通过full-read access gate的backend capability comparison exact读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendCapabilityComparisonReadRequest {
    /// 与service context和GetBackendCapabilityComparison匹配的Permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// required context、requirement和ordered summary refs selector。
    selector: BackendCapabilityComparisonSelector,
}

impl BackendCapabilityComparisonReadRequest {
    /// 只接受matching decision、context、query kind和1..=16 ordered source selector。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetBackendCapabilityComparisonInput,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;

    /// 返回matching permitted access decision。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    /// 返回已经通过canonical selector factory的exact selector。
    pub fn selector(&self) -> &BackendCapabilityComparisonSelector;
}
```

request factory的检查顺序固定为：

1. service channel为`ApiQuery`，operation与`GetBackendCapabilityComparison`一致，actor、digest和query kind匹配；
2. access decision为`Permitted`且允许full read；任何access denial在source index读取前返回；
3. `context_ref`、`requirement_ref`和`capability_summary_refs`均非空且typed kind正确；
4. source set长度必须为`1..=16`，保持caller顺序并拒绝重复summary ref、重复backend generation和跨context/requirement候选；
5. 不允许`scope_ref`、profile-only、empty-means-all、unsupported-only filter、配置扩展或query自行排序/截断。

selector construction不读取repository；source成员是否属于同一requirement、generation和context必须在同一snapshot中由
source assembly证明。`SandboxSourceDigest`只能消费已经校验的有序typed refs作为已提交binding identity，不能在request或
query中重新计算、替代三类typed identity或决定access。

## 65. A2-F4-C Comparison Index Carrier、三计数矩阵与读取顺序

Comparison exact-key index同时维护current binding、binding target row和该exact key的历史immutable row总数。为了避免
实现者把三个数字压成一个`Option<View>`，Step 7定义一个application-local、只读、同snapshot的transient carrier；它不进入
contracts registry、durable schema或protocol DTO。

```rust
/// comparison exact-key index在同一committed snapshot中的cardinality观察。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendCapabilityComparisonIndexCardinality {
    /// exact selector对应的current binding数量。
    current_binding_count: u32,
    /// current binding指向的exact immutable target row数量。
    binding_target_row_count: u32,
    /// exact key下current与historical immutable row总数。
    total_rows_for_exact_key: u32,
    /// 完整index已有的owner audit linkage；不是query audit。
    source_audit_trace_ref: SandboxAuditTraceRef,
    /// index观察使用的truth cursor。
    truth_cursor: SandboxTruthCursor,
    /// index观察使用的reference cursor。
    reference_cursor: SandboxReferenceCursor,
    /// same-snapshot index observation time。
    observed_at: Timestamp,
}

impl BackendCapabilityComparisonIndexCardinality {
    /// 构造已完成完整index read的cardinality carrier；不自行查询或补默认值。
    pub fn try_new(
        current_binding_count: u32,
        binding_target_row_count: u32,
        total_rows_for_exact_key: u32,
        source_audit_trace_ref: SandboxAuditTraceRef,
        truth_cursor: SandboxTruthCursor,
        reference_cursor: SandboxReferenceCursor,
        observed_at: Timestamp,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;

    /// 返回current binding count。
    pub fn current_binding_count(&self) -> u32;
    /// 返回binding target row count。
    pub fn binding_target_row_count(&self) -> u32;
    /// 返回exact key下全部row count。
    pub fn total_rows_for_exact_key(&self) -> u32;
    /// 返回existing index audit linkage。
    pub fn source_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回truth cursor。
    pub fn truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回reference cursor。
    pub fn reference_cursor(&self) -> SandboxReferenceCursor;
    /// 返回index observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

carrier构造器拒绝negative/overflow decode、缺audit linkage、缺双cursor、partial index标记以及无法证明三个计数属于同一
snapshot的输入。它不把repository `None`、timeout或decode failure转换为零。

`read_backend_capability_comparison_source`在caller snapshot中的不可省略顺序固定为：

```text
BackendCapabilityComparisonReadRequest
  -> validate query kind, access-approved selector and 1..=16 ordered refs
  -> read exact-key current binding index + target-row index + historical-row count
     -> current=0,total=0: build BackendCapabilityComparisonAbsenceProof -> ExactAbsent
     -> current=1,target=1,total>=1: continue current source assembly
     -> every other cardinality: Err integrity/reconciliation
  -> load selected current binding and verify selector/digest/cursor relation
  -> load exact requirement source and each selected reference state/summary snapshot
  -> load binding-selected current immutable comparison row; ignore same-key historical rows
  -> build checked row set and BackendCapabilityComparisonSourceSnapshot
     -> no gap: ViewSource via from_committed_snapshot
     -> only CurrentCapabilityCoverage: ViewSource via from_degraded_snapshot
     -> other typed source gap: Unavailable no-body outcome
  -> return without resolver, capability adapter, refresh, write or business audit append
```

### 65.1 Exact-key cardinality matrix

| current binding count | binding target row count | total rows for exact key | legal outcome | forbidden fallback |
|---:|---:|---:|---|---|
| `0` | `0` or n/a | `0` | complete `ExactAbsent` proof -> `Empty` | repository `None`、timeout、partial index、`MissingProjection` |
| `1` | `1` | `>=1` | current source assembly | 用historical row替代target、latest winner、重新绑定 |
| `0` | n/a | `>0` | integrity/reconciliation error | 回退`Empty`、挑历史row、现场创建binding |
| `1` | `0` | `>=0` | binding target integrity error | `ExactAbsent`、status-only伪造、现场materialize |
| `1` | `>1` | `>=2` | duplicate target integrity error | 按timestamp/ref取一条 |
| `>1` | 任意 | 任意 | single-current integrity error | 最大时间、最大ref或first-row winner |
| `1` | `1`但selector/digest/cursor/context relation不等 | `>=1` | source relation integrity error | 回退任何历史row或改写selector |

`total_rows_for_exact_key > 1`在唯一current binding精确命中唯一target row且全部relation完整时是合法的历史replacement；
历史row不参与current view选择，也不改变surface status。相反，`current=0,total>0`是orphan/history-without-current
关系，不能被当作普通absence。`binding_target_row_count`只统计current binding的exact `view_ref`，不能用total count替代。

### 65.2 Source assembly relation

present branch必须在同一snapshot内验证：

| source group | required relation | prohibited substitute |
|---|---|---|
| selector / binding | context、requirement、ordered summary refs和digest逐字段一致 | 从digest或第一条row反推selector |
| requirement source | requirement ref、context、generation和truth cursor与selector/binding相容 | 读取当前配置或重新计算requirement |
| reference source | 每个summary ref有唯一tracked reference state；backend ref、resolution status、safe summary和reference cursor闭合 | 调用resolver、读取live backend profile、summary status文字解析 |
| comparison row | row顺序与selector source set一一对应；十维item、status、generation、双cursor和audit linkage完整 | 先聚合bool或只保存unsupported list |
| source snapshot | cursor relation、aggregate和audit linkage由Step 6 factory机械校验 | caller覆盖status、query重算digest或补缺字段 |

`ReferenceResolutionStateStatus::Resolved`可进入complete source；`Stale`在summary与source relation完整时保留last-known
row；`Unresolved | Invalid | Unavailable`只能形成`CapabilitySource` typed gap/no-body。`Unknown`必须来自完整summary
snapshot中的canonical finite verdict，不能由缺失source、空集合或adapter error伪造。

## 66. A2-F4-C Canonical Outcome、Facade Surface 与 No-call Boundary

reader直接返回Step 6 `BackendCapabilityComparisonSourceLookupOutcome`。facade不得从多个`Option`重新解释binding、row、
absence或gap，也不得复制comparison source/view。每个outcome只允许按下表调用canonical factory：

| canonical outcome | checked source condition | factory / mapper | final surface | body |
|---|---|---|---|---:|
| `ViewSource` | no gap；aggregate=`FullySupported` | `BackendCapabilityComparisonView::from_committed_snapshot` | `Visible` | required |
| `ViewSource` | no gap；aggregate=`Unsupported` | 同上 | `Visible` | required |
| `ViewSource` | no gap；aggregate=`Unknown` | 同上 | `Visible` | required |
| `ViewSource` | no gap；aggregate=`Stale` | 同上 | `Stale` | required |
| `ViewSource` | gap set恰好一个`CurrentCapabilityCoverage` | `from_degraded_snapshot` + canonical surface mapper | `Degraded` | required |
| `ExactAbsent` | current binding=`0`且exact-key total rows=`0`，proof完整 | 不调用view factory | `Empty` | none |
| `Unavailable` | non-empty no-view gap set：`RequirementSource \| ComparisonBinding \| ComparisonRow \| CapabilitySource \| SourceRelation` | canonical no-view mapper | `Unavailable` | none |
| reader technical/integrity `Err` | snapshot/repository call失败、duplicate、half-commit、malformed row或relation损坏 | application error mapper | 无successful surface | none |

`BackendCapabilityComparisonReadSurfaceMapping`仍是唯一source-local mapper；application只组合access结果与该mapping，不自行
解析aggregate或reason。access `NotVisible | Restricted | Unavailable`在reader前返回；即使source本可`Visible`也不能覆盖
access denial。access允许读取时，source `Unavailable`也不能被包装成`Empty`或`Unknown`。

### 66.1 Business conclusion 与 technical gap不可互换

| observed canonical fact | meaning | query treatment | forbidden interpretation |
|---|---|---|---|
| `FullySupported` | 所有selected committed summary对十维requirement给出完整Supported结论 | `Visible` body | 自动选择backend、建立boundary或允许launch |
| `Unsupported` | 至少一个完整committed item明确Unsupported | `Visible` body并保持safe proof/reason | Query `Failed`、adapter unavailable或自动fallback |
| `Unknown` | 完整committed summary无法形成Supported/Unsupported结论 | `Visible` body并继续fail closed | 缺summary、repository error或空source set |
| `Stale` | 完整last-known source的canonical freshness truth | `Stale` body | `CurrentCapabilityCoverage` gap、Query failure或Fresh |
| `CurrentCapabilityCoverage` | row可安全展示，但current dual-cursor coverage不足 | `Degraded` body | 改写aggregate、丢弃row或调用refresh |
| `CapabilitySource` | selected summary/reference source无法安全形成row | no-body `Unavailable` | 伪造`Unknown`、回退old row或扫描其它backend |

Comparison只展示已提交能力事实，不成为boundary decision或launch guard。即使body为`FullySupported`，真正的boundary
establishment仍必须由其owner重新加载exact requirement、capability summary、checked age与backend decision；Query view
不能被当作launch authorization、winner recommendation或fallback order。

### 66.2 Query zero-write / zero-external-call contract

| operation class | allowed count | forbidden behavior |
|---|---:|---|
| exact index/binding/row/requirement/reference/summary read | 仅在caller提供的一个snapshot内按需读取 | second latest snapshot、跨snapshot补row、读取配置扩展source set |
| repository write / UoW / CAS | `0` | create/rebind/replace/delete/repair comparison row或binding |
| identity / digest / cursor / audit ref allocation | `0` | query生成view ref、重算source digest、推进truth/reference cursor |
| resolver / capability adapter / backend probe | `0` | refresh summary、health check、SDK call、live capability scan |
| boundary / environment / tool / runtime | `0` | select winner、establish boundary、launch/attach/kill process |
| artifact / log / metric body | `0` | capture、upload、parse或展示raw正文 |
| lease / cleanup / reaper / redline / member lifecycle | `0` | 任一domain mutation或编排调用 |
| business audit / stored result / relay append | `0` | 为read追加truth audit、stored result或relay；仅允许一次低基数diagnostic hook |

read-only不允许隐式副作用：ORM last-access更新、cache-aside materialization、lazy repair、sequence allocation、outbox append
或query-triggered refresh均视为`NoWriteViolation`。底层存储若无法保证零写入，必须在assembly前登记blocker，而不是由adapter
静默接受。

### 66.3 A2-F4-C 静态自检与阶段标记

| check | result |
|---|---|
| permitted request / canonical exact selector | `1/1`；required context+requirement+ordered source set family=`1/1` |
| source set cardinality/order | `1..=16`、ordered、unique；empty/duplicate/truncate/config expansion=`0/0/0/0` |
| three-count cardinality | `current/target/total`三者独立；legal absence与present=`1/1`；其它组合全部integrity |
| canonical binding/absence/gap/source/outcome/view reuse | `7/7` reused；application-local duplicate schema=`0` |
| named reader method | `read_backend_capability_comparison_source = 1/1`；generic/latest/config-scan reader=`0/0/0` |
| body-compatible gap | only `CurrentCapabilityCoverage = 1/1`；五类no-view gap=`5/5` |
| complete status mapping | `FullySupported/Unsupported/Unknown -> Visible`；`Stale -> Stale` |
| absence / no-view mapping | exact double-zero -> `Empty`；typed source gaps -> `Unavailable`；`MissingProjection` use=`0` |
| Query write / identity / resolver-capability / launch / business audit | `0/0/0/0/0` |
| new L1/L2 blocker | `0`；现有`OUTCOME-001 | READ-001`仍开放 |

```text
current_sub_batch = 7R-04A-A2-F4 projection/derived/comparison exact reader contracts in_progress
completed_internal_parts = A2-F4-P|A2-F4-D|A2-F4-C
current_internal_part = A2-F4-J shared error/facade/adapter/fake/static join
pending_internal_parts = A2-F4-J
query_reader_coverage = 11/13_provisional_within_F4
selector_variant_coverage = 17/17_for_completed_internal_parts
formal_03_writeback = forbidden
next_allowed_action = continue_A2-F4-J_only
```

`A2-F4-C`已完成并逐项标记。F4的三个Query业务reader均已闭合，但在shared error、facade snapshot lifecycle、durable/fake
parity和静态总审计完成前，F4仍不得标记完成，也不得进入F5。

## 67. A2-F4-J Shared Error Closed Set 与 Application Mapping

`A2-F4-J`不再增加Projection、Derived或Comparison的业务source。它只把三类reader共有的技术失败、访问形状错误、
同snapshot关系错误和no-write违规收敛为一个application-local error。该error不是Step 8 public error DTO，也不是新的
domain error owner；它只允许在`application::ports::query_read`与`infra::query_read`之间传递。

```rust
/// Projection、Derived、Comparison exact reader共享的application-local错误闭集。
///
/// 该类型不得携带raw row、SQL、driver error、provider response、hidden ref、page token body或external body。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxProjectionDerivedComparisonReadError {
    /// 被调用的具名reader与固定Query kind不一致。
    QueryKindMismatch,
    /// access decision与service context的actor、scope、operation或digest不一致。
    AccessDecisionContextMismatch,
    /// 非Permitted decision试图进入full reader。
    FullReadNotPermitted,
    /// request selector与input、method family或canonical selector不一致。
    SelectorMismatch,
    /// snapshot handle不属于当前manager、已关闭或被重复使用。
    ReadSnapshotUsageInvalid,
    /// snapshot已失效，不能保证一次公平committed generation。
    ReadSnapshotUnavailable {
        /// 已脱敏的dependency reason；不得来自raw provider Display。
        reason: SandboxReason,
    },
    /// exact index或source repository暂不可用；不是absence proof。
    RepositoryUnavailable {
        /// 已脱敏的temporary dependency reason。
        reason: SandboxReason,
    },
    /// repository failure无法归入temporary dependency；不是业务Unavailable。
    RepositoryFailed {
        /// 已脱敏的内部reason；不得包含SQL、路径或堆栈。
        reason: SandboxReason,
    },
    /// exact/current/state/binding/source-set cardinality不满足canonical闭集。
    CardinalityIntegrityInvalid,
    /// selector、owner、context、requirement、state或source relation不一致。
    OwnerRelationIntegrityInvalid,
    /// current binding与immutable target row的ref或位置不一致。
    CurrentBindingIntegrityInvalid,
    /// binding存在但materialization row缺失、重复或未原子提交。
    MaterializationIntegrityInvalid,
    /// cursor、generation、audit linkage或observation time关系非法。
    SnapshotRelationIntegrityInvalid,
    /// typed read gap的kind、selector、cursor或reason shape非法。
    ReadGapShapeInvalid,
    /// absence proof与selector、双零计数或same-snapshot evidence不一致。
    AbsenceProofInvalid,
    /// source、absence、gap或view被放入错误的closed outcome branch。
    LookupOutcomeInvalid,
    /// Step 6 checked source或view factory拒绝已加载的完整source group。
    SourceContractInvalid,
    /// reader尝试write、identity/cursor allocation、repair、external call或business audit append。
    NoWriteViolation,
}
```

共享error的variant数量固定为`18/18`。`UnsupportedDerivedKind`等Step 6 selector factory错误不穿透为第二套reader
error；request factory在target read前将其归一为`SelectorMismatch`，并保留canonical factory作为唯一校验 owner。
同理，repository `NotFound`只有在完整index proof已形成时才能成为`ExactAbsent`；裸`NotFound`进入
`RepositoryFailed`或`RepositoryUnavailable`，不得被reader转换为成功absence。

### 67.1 Error 到 ApplicationErrorDetail 的穷尽映射

```rust
fn map_projection_derived_comparison_read_error(
    error: SandboxProjectionDerivedComparisonReadError,
    reason_catalog: &SandboxQueryReadReasonCatalog,
    trace_context: Option<SandboxTraceContext>,
) -> ApplicationError;
```

该mapper逐variant穷尽匹配，不解析`Display`，不使用wildcard arm，不创建新的`ApplicationErrorDetail`。映射固定如下：

| reader error | `ApplicationErrorDetail` | successful Query surface | reason source |
|---|---|---|---|
| `ReadSnapshotUnavailable` | `PortUnavailable` | none | error携带的已脱敏reason |
| `RepositoryUnavailable` | `PortUnavailable` | none | error携带的已脱敏reason |
| `RepositoryFailed` | `InternalInvariantViolation` | none | error携带的已脱敏reason；不得标为temporary |
| `ReadSnapshotUsageInvalid` | `InternalInvariantViolation` | none | fixed `read_snapshot_usage_invalid` template |
| `QueryKindMismatch` | `InvalidOperationMapping` | none | fixed `query_kind_mismatch` template |
| `AccessDecisionContextMismatch`, `FullReadNotPermitted`, `SelectorMismatch` | `QueryAccessShapeInvalid` | none | fixed `query_access_shape_invalid` template |
| nine integrity/shape/contract variants | `InternalInvariantViolation` | none | fixed `read_integrity_invalid` template |
| `NoWriteViolation` | `NoWriteViolation` | none | fixed `query_no_write_violation` template |

其中nine integrity/shape/contract variants是
`CardinalityIntegrityInvalid`、`OwnerRelationIntegrityInvalid`、`CurrentBindingIntegrityInvalid`、
`MaterializationIntegrityInvalid`、`SnapshotRelationIntegrityInvalid`、`ReadGapShapeInvalid`、`AbsenceProofInvalid`、
`LookupOutcomeInvalid`和`SourceContractInvalid`，机械覆盖`9/9`。

fixed template的owner是application；模板只包含稳定ASCII文本，不插值context ref、projection ref、state ref、
requirement ref、digest、cursor、backend、path、host、SQL或raw error。`SandboxApplicationError::from_detail`接收该
reason和已有trace context，但不生成新trace。`PortUnavailable`的public retry语义沿用既有application mapper，不能在本
reader family另造retry enum。

## 68. A2-F4-J Access-first Facade 生命周期与 Outcome Join

三类public facade仍保持各自的exact callable；允许存在一个private lifecycle helper，但helper只能负责snapshot所有权和
close覆盖，不能根据route、字符串kind、selector顺序或fake map选择Query。每个public method必须在编译期固定一组
request factory、reader method和outcome mapper：

| facade | request factory | 唯一reader | canonical success outcome | final body factory |
|---|---|---|---|---|
| `get_sandbox_read_projection` | `SandboxReadProjectionReadRequest::try_from_permitted` | `read_sandbox_read_projection_source` | `ViewSource \| MissingProjection \| Unavailable` | `SandboxReadProjection` source/status mapping |
| `get_derived_inspect_preview_trend` | `DerivedInspectPreviewTrendReadRequest::try_from_permitted` | `read_derived_inspect_preview_trend_source` | `ViewSource \| ExactAbsent \| Unavailable` | `DerivedInspectPreviewTrendView::from_committed_snapshot/from_degraded_snapshot` |
| `get_backend_capability_comparison` | `BackendCapabilityComparisonReadRequest::try_from_permitted` | `read_backend_capability_comparison_source` | `ViewSource \| ExactAbsent \| Unavailable` | `BackendCapabilityComparisonView::from_committed_snapshot/from_degraded_snapshot` |

### 68.1 每次permitted调用的固定生命周期

```text
checked service context + exact input
  -> validate channel / operation / digest / pure selector
  -> calculate SandboxQueryAccessDecision
     -> NotVisible | Restricted | access Unavailable:
          return access surface; open=0, reader=0, close=0
     -> Permitted:
          build one family-specific permitted request
          open one SandboxCommittedReadSnapshot exactly once
          call the mapped named reader exactly once
          own the returned outcome/body before closing
          exhaustively map canonical outcome to SandboxQueryResult
          close the same snapshot exactly once
          emit at most one redacted low-cardinality diagnostic hook
          return the owned application surface
```

生命周期规则固定为：

1. access denial在任何page/target/binding/index read前返回；F4三个Query都不在denial分支打开snapshot。
2. request factory失败时不打开snapshot；错误按§67映射为`QueryAccessShapeInvalid`，不把错误改成`Empty`。
3. `SandboxCommittedReadManager::open`成功后，无论reader返回成功outcome还是reader `Err`，都必须对同一个
   `Box<dyn SandboxCommittedReadSnapshot>`调用一次`close`。reader不得自行open/close或保存handle到字段。
4. reader返回的source/view必须在close前转成owned body/result；任何借用snapshot的reference不得越过close返回。
5. close成功时返回reader的成功surface或mapped application error；close失败时覆盖尚未返回的结果为
   `ApplicationErrorDetail::PortUnavailable`，丢弃assembled body，不重读、不打开第二snapshot。
6. open失败没有有效handle，因此不调用close；`SandboxReadSnapshotError::Unavailable`映为`PortUnavailable`，
   `InvalidBinding`映为`InternalInvariantViolation`。
7. close失败不表示write commit unknown，也不改变任何已提交truth；最多发一次不含body的diagnostic category。
8. lifecycle helper不得执行retry、latest fallback、second snapshot、cache-aside materialization、lazy repair或
   business audit append。

### 68.2 三类outcome到public surface

| Query / outcome | final surface | body / reason rule |
|---|---|---|
| Projection `ViewSource`, status=`Fresh` | `Visible` | body必填；reasons为空 |
| Projection `ViewSource`, status=`Stale` | `Stale` | exact projection body必填；reasons来自canonical stale markers |
| Projection `ViewSource`, status=`Rebuilding` | `Rebuilding` | exact row已读时返回`Some(SandboxReadProjection)` status-only或last-known body；reasons来自markers；initial无marker使用固定模板 |
| Projection `ViewSource`, status=`Degraded` | `Degraded` | body必填；reasons只来自projection `degraded_reasons()` |
| Projection canonical `Unavailable` | `Unavailable` | no-body；使用projection singleton availability reason |
| Projection `MissingProjection` | `MissingProjection` | no-body；完整proof通过后使用application固定`projection_missing` reason，不映普通`Empty` |
| Derived `ViewSource`, status=`Fresh` | `Visible` | body必填；surface reasons为空 |
| Derived `ViewSource`, status=`Stale \| Rebuilding` | `Stale \| Rebuilding` | body按canonical state保留；reasons来自`DerivedMaintenanceDetail::reason()`，不得由状态名猜测 |
| Derived `ViewSource`, domain status=`Failed \| Unavailable` | `Visible` | body按canonical maintenance state展示；domain detail reason留在body，不能把业务状态改写成Query error |
| Derived `ViewSource` + only `CurrentSourceCoverage` | `Degraded` | body必填；reasons由typed gap set `to_degraded_reasons()`产生 |
| Derived `ExactAbsent` | `Empty` | body/reasons均为空；只来自完整双零proof |
| Derived canonical `Unavailable` | `Unavailable` | no-body；reasons由typed gap set机械映射 |
| Comparison `ViewSource`, aggregate=`FullySupported \| Unsupported \| Unknown` | `Visible` | body必填；row-level canonical reason保留在body，surface reasons为空 |
| Comparison `ViewSource`, aggregate=`Stale` | `Stale` | body必填；surface使用固定`comparison_stale`安全模板，避免重复row reason被静默去重 |
| Comparison `ViewSource` + only `CurrentCapabilityCoverage` | `Degraded` | body必填；reasons只由gap set机械映射，aggregate不改写 |
| Comparison `ExactAbsent` | `Empty` | body/reasons均为空；只来自`current=0,total=0` proof |
| Comparison canonical no-view gaps | `Unavailable` | no-body；五类gap按canonical order映射reasons |

`SandboxQueryResult::visible`要求surface reason为空，因此Derived的domain `Failed/Unavailable` detail、Comparison每个
row的`capability_status_reason`和Projection body内部status reason不能被重复塞进顶层reason set。反向地，`Stale`、
`Degraded`、`Rebuilding`和no-body `Unavailable`必须满足现有`SandboxReasonSet`非空约束；任何reason来源缺失属于
`SourceContractInvalid`，不能用空集合成功返回。

## 69. A2-F4-J Public Reason 来源闭环

reason来源按“canonical owner优先、application固定模板兜底”的顺序闭合。reader不创建reason、facade不解析reason文本、
surface mapper不根据status label猜reason。

| surface branch | authoritative source | fallback / rejection |
|---|---|---|
| Projection `Stale` | `SandboxProjectionStaleMarkerSet`按`Truth -> Reference`顺序读取每个marker的`reason()` | marker set为空、marker lineage不完整或reason重复 -> `SourceContractInvalid` |
| Projection `Rebuilding` with marker | matching `SandboxProjectionRebuildAttempt.stale_markers()`的marker reasons | attempt/marker不匹配 -> integrity error |
| Projection initial `Rebuilding` | application fixed `projection_initial_rebuilding` template | 禁止从`Rebuilding`字符串、clock或empty marker set自由拼接 |
| Projection `Degraded` | checked `SandboxReadProjection.degraded_reasons()` | empty/missing set -> `SourceContractInvalid` |
| Projection `Unavailable` | canonical projection availability singleton from `create_unavailable/mark_unavailable` | 禁止复制为普通degraded或使用repository error text |
| Projection `MissingProjection` | 完整`SandboxReadProjectionAbsenceProof`通过后，由application fixed `projection_missing` template形成reason | proof relation不完整 -> `AbsenceProofInvalid`；禁止让proof或repository补自由文本 |
| Derived `Stale \| Rebuilding` | `DerivedMaintenanceDetail::reason()` | `None`或detail/status不一致 -> `SourceContractInvalid` |
| Derived `CurrentSourceCoverage` | `DerivedInspectPreviewTrendReadGapSet::to_degraded_reasons()` | 不读取maintenance detail替代gap reason |
| Derived no-view gap | canonical typed gap set同序映射 | 技术repository error不能伪造gap |
| Comparison `Stale` | application fixed `comparison_stale` template；row内canonical reasons继续保留 | 禁止把多row reason按字符串去重后作为surface reason |
| Comparison `CurrentCapabilityCoverage` | `BackendCapabilityComparisonReadGapSet::to_degraded_reasons()` | 不用aggregate `Unknown/Unsupported`或row reason代替 |
| Comparison no-view gap | canonical gap set同序映射 | 缺gap reason -> `ReadGapShapeInvalid` |

固定reason由application单一owner提供最小catalog；它是application-local immutable support carrier，不进入Step 8 DTO、
config或persistence：

```rust
/// Query read facade使用的八项固定caller-safe reason。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxQueryReadReasonCatalog {
    projection_initial_rebuilding: SandboxReason,
    projection_missing: SandboxReason,
    comparison_stale: SandboxReason,
    query_kind_mismatch: SandboxReason,
    query_access_shape_invalid: SandboxReason,
    read_snapshot_usage_invalid: SandboxReason,
    read_integrity_invalid: SandboxReason,
    query_no_write_violation: SandboxReason,
}

impl SandboxQueryReadReasonCatalog {
    /// 返回仅由本节固定ASCII template构造的标准catalog。
    pub fn standard() -> Self;
    /// 返回 projection 初次处于 `Rebuilding` 时使用的固定 caller-safe reason。
    pub fn projection_initial_rebuilding(&self) -> &SandboxReason;
    /// 返回已完成 absence proof 后使用的 projection missing reason。
    pub fn projection_missing(&self) -> &SandboxReason;
    /// 返回 comparison stale surface 使用的固定 caller-safe reason。
    pub fn comparison_stale(&self) -> &SandboxReason;
    /// 返回 reader method 与 operation 映射不一致时使用的固定 reason。
    pub fn query_kind_mismatch(&self) -> &SandboxReason;
    /// 返回 access decision、context 或 selector shape 不一致时使用的固定 reason。
    pub fn query_access_shape_invalid(&self) -> &SandboxReason;
    /// 返回 committed snapshot handle 使用非法时使用的固定 reason。
    pub fn read_snapshot_usage_invalid(&self) -> &SandboxReason;
    /// 返回已知 read relation 或 closed contract 损坏时使用的固定 reason。
    pub fn read_integrity_invalid(&self) -> &SandboxReason;
    /// 返回 reader 触发禁止副作用时使用的固定 reason。
    pub fn query_no_write_violation(&self) -> &SandboxReason;
}
```

| field | fixed ASCII template |
|---|---|
| `projection_initial_rebuilding` | `projection rebuild is in progress` |
| `projection_missing` | `projection has not been materialized` |
| `comparison_stale` | `capability comparison includes stale committed sources` |
| `query_kind_mismatch` | `query reader operation mapping is invalid` |
| `query_access_shape_invalid` | `query access and selector shape are inconsistent` |
| `read_snapshot_usage_invalid` | `committed read snapshot usage is invalid` |
| `read_integrity_invalid` | `committed query source relation is invalid` |
| `query_no_write_violation` | `query reader attempted a forbidden side effect` |

`standard()`不读取config、clock或repository；八项固定文本均通过`SandboxReason`既有校验。实现不得增加可配置文案、
插入typed identity、cursor、generation、backend、path、host、process、artifact或raw provider信息。

### 69.1 Status-view reason 到 query reason 的 exact pure conversion

`StatusViewDegradedReasonSet` 与 application `SandboxReasonSet` 是两个不同 owner 的 carrier。前者服务 Step 6
view factory，后者服务 Query surface；不能通过 `From<Vec<_>>`、`Display` 或裸 `clone` 形成隐式转换。为避免
F1~F4 的每个 gap family各自发明 mapper，application 只提供下列一个 extension trait。该转换是 pure、同序、逐项
复制的 callable，不读取 repository、clock、config 或 access state：

```rust
/// 将已由 canonical view factory验证的 degraded reason set复制为Query safe reason set。
pub trait SandboxStatusViewReasonSetQueryConversion {
    /// 按原顺序逐项复制reason；空集合或重复reason返回`ReadGapShapeInvalid`。
    fn to_query_reason_set(
        &self,
    ) -> Result<SandboxReasonSet, SandboxPrimaryStatusReadError>;
}

impl SandboxStatusViewReasonSetQueryConversion for StatusViewDegradedReasonSet {
    /// 不排序、不去重、不解析reason正文，只复用`SandboxReasonSet`的checked factory。
    fn to_query_reason_set(
        &self,
    ) -> Result<SandboxReasonSet, SandboxPrimaryStatusReadError> {
        SandboxReasonSet::try_non_empty(self.as_slice().to_vec())
            .map_err(|_| SandboxPrimaryStatusReadError::ReadGapShapeInvalid)
    }
}
```

该 trait 的唯一实现拒绝空集合和 exact duplicate；`SandboxReasonSet::try_non_empty` 保留输入顺序并执行既有
safe-reason校验。实现不得增加 status、surface、reason 文本或 raw error 参数，也不得把 query `Unavailable` 的
技术错误送入此 conversion。`StatusViewDegradedReasonSet -> SandboxReasonSet` 的 owner、调用名和错误归属至此
闭合为 `application::query_service`；所有 family gap mapper 必须直接调用此 callable或各自 canonical gap-set
的同构实现，不得在 facade中重复转换。

## 70. A2-F4-J Durable Adapter、Deterministic Fake 与 Parity

### 70.1 Durable logical owner

durable实现的唯一logical owner是`infra::query_read`。它可以有private typed helper，但application只看到
`SandboxProjectionDerivedComparisonReader`的三个具名method：

| boundary | required contract | forbidden |
|---|---|---|
| application port | 一个trait、三个exact methods、三个typed request、三个canonical outcome | `read(kind, selector)`、generic `read<T>`、`Option<View>` fallback |
| snapshot | 只使用facade传入的一个`&mut dyn SandboxCommittedReadSnapshot` | reader/adapter自行open、close、跨snapshot补row或换latest |
| projection read | exact/current binding count、target row和canonical projection在同snapshot闭合 | `None -> MissingProjection`、query rebuild、现场分配ref |
| derived read | exact state/binding/materialization/source outcome复用Step 6 owner | builder、refresh、old row fallback、从state字段拼payload |
| comparison read | ordered source set、三计数cardinality、requirement/reference/row relation复用Step 6 owner | config scan、winner selection、capability probe、重算digest |
| storage errors | temporary dependency -> `RepositoryUnavailable`；non-temporary/decode/relation -> `RepositoryFailed`或typed integrity | raw driver/SQL/HTTP/SDK错误穿透application |
| write capability | repository write/UoW/CAS/identity/cursor/external/business audit均为`0` | ORM last-access、cache-aside materialization、outbox或lazy repair |

private helper的调用顺序必须由相应§60、§62、§65固定，helper不成为第二application port。任何底层存储如果无法保证
read-only semantics，必须在实现前回流为blocker；不能用rollback或catch error伪装zero-write。

### 70.2 Deterministic fake parity

fake只返回预先构造、已通过canonical factory的checked outcome，或预先指定的shared error。fake不能从map、selector、
status或error自动补造binding、proof、row、source、view ref、cursor、audit linkage或reason。

```rust
/// fake记录的checked request闭集；只存在于application/infra test support。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxProjectionDerivedComparisonReaderCallRequest {
    Projection(SandboxReadProjectionReadRequest),
    Derived(DerivedInspectPreviewTrendReadRequest),
    Comparison(BackendCapabilityComparisonReadRequest),
}

impl SandboxProjectionDerivedComparisonReaderCallRequest {
    /// 从request union机械返回唯一对应的具名reader method。
    pub fn method(&self) -> SandboxProjectionDerivedComparisonReaderMethod;
    /// 从request union机械返回唯一对应的closed Query kind。
    pub fn query_kind(&self) -> SandboxQueryKind;
}

/// deterministic fake的调用记录；不进入diagnostic、persistence或public protocol。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxProjectionDerivedComparisonReaderCall {
    /// 三个具名method之一。
    method: SandboxProjectionDerivedComparisonReaderMethod,
    /// reader实际收到的checked permitted request。
    request: SandboxProjectionDerivedComparisonReaderCallRequest,
    /// caller-owned snapshot correlation；不得持久化。
    snapshot_ref: SandboxReadSnapshotRef,
    /// 本次fake/durable invocation在该reader实例中的ordinal。
    invocation_ordinal: u32,
}

impl SandboxProjectionDerivedComparisonReaderCall {
    /// 只接受method/request一致、non-empty snapshot ref和从1开始的ordinal。
    pub fn try_new(
        method: SandboxProjectionDerivedComparisonReaderMethod,
        request: SandboxProjectionDerivedComparisonReaderCallRequest,
        snapshot_ref: SandboxReadSnapshotRef,
        invocation_ordinal: u32,
    ) -> Result<Self, SandboxProjectionDerivedComparisonReadError>;
    /// 返回本次调用的具名reader method。
    pub fn method(&self) -> SandboxProjectionDerivedComparisonReaderMethod;
    /// 返回完整、已checked的reader request。
    pub fn request(&self) -> &SandboxProjectionDerivedComparisonReaderCallRequest;
    /// 返回caller-owned snapshot correlation。
    pub fn snapshot_ref(&self) -> &SandboxReadSnapshotRef;
    /// 返回该reader实例内从1开始的调用ordinal。
    pub fn invocation_ordinal(&self) -> u32;
}

/// Projection、Derived、Comparison三类具名reader的closed method family。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxProjectionDerivedComparisonReaderMethod {
    /// 读取canonical Sandbox read projection。
    Projection,
    /// 读取canonical derived inspect/preview/trend view。
    Derived,
    /// 读取canonical backend capability comparison view。
    Comparison,
}
```

fake必须记录`method`、完整checked `request`、`snapshot_ref`和调用次数；`query_kind`由request union机械返回。fake拒绝
以下情况：method与request family不匹配、snapshot
ref不是预期caller handle、同一permitted调用出现第二次method call、收到raw input或未通过factory的request、
outcome/error脚本被消费两次。完整request只保存在deterministic test内存中，不写diagnostic、log或持久化；fake不记录
raw error或external body。

| parity check | durable | fake | design assertion |
|---|---|---|---|
| method set | Projection/Derived/Comparison各一个 | 同名同语义各一个 | `3/3` exact parity |
| request shape | 仅checked permitted request | 同样拒绝raw request | bypass=`0` |
| snapshot ownership | caller open/close，reader只借用 | 记录并校验caller snapshot ref | substitution=`0` |
| success/error schema | canonical Step 6 outcome或shared error | 只回放预脚本同一值 | duplicate schema=`0` |
| side effects | write/identity/cursor/external/audit=`0` | 同样为`0` | parity=`1/1` |

该fake parity是设计和assembly检查条件，不是编译、真实测试、run、evidence或验收结果。台账继续保持
`real_test_execution = not_started`、`real_evidence_created = no`。

## 71. A2-F4-J Static Total Audit

以下是对当前中间产物、Step 6 canonical source和Step 7 facade inventory的文本闭环审计；`result`是设计文本计数，不是
实现运行结果。

| audit item | result | closure rule |
|---|---:|---|
| physical Query inventory | `13/13` unique | `GetCleanupReadiness`精确行仅出现一次；duplicate exact row=`0` |
| completed F4 internal parts | `P/D/C/J = 4/4` | 每个子任务均有问题回答、结构化contract、mapping、自检和阶段标记 |
| named F4 reader methods | `3/3` | Projection/Derived/Comparison各一个；generic/latest/config-scan reader=`0` |
| cumulative Query reader coverage | `11/13 provisional within F4` | F1=`3` + F2=`2` + F3=`3` + F4=`3`；F5未计入 |
| cumulative selector variants | `17/17` | exact/current/source-set/kind variants均来自closed selector；latest/opaque=`0` |
| canonical source/outcome/view reuse | `P/D/C = 1/1/1` | 不复制Step 6 source、absence proof、gap set或view schema |
| shared error variant mapping | `18/18` | 每个reader error恰有一个ApplicationErrorDetail映射，无wildcard |
| permitted lifecycle | `3/3` | 每个Query在Permitted分支`open=1 / named reader=1 / close=1` |
| denied lifecycle | `3/3` | NotVisible/Restricted/access Unavailable均`open=0 / reader=0 / close=0` |
| close failure rule | `1/1` | 同一snapshot close失败覆盖assembled result为PortUnavailable；second snapshot=`0` |
| reason source closure | `12/12` | P stale/rebuilding/degraded/unavailable/missing、D stale/rebuilding/degraded/no-view、C stale/degraded/no-view均有唯一来源 |
| existing maintenance reader | `9/9` preserved | public Query use=`0/11`；maintenance writer/job不被reader调用 |
| Query write / identity / cursor / external / business audit | `0/0/0/0/0` | 11个已闭合Query均只读；只允许一次redacted diagnostic hook |
| fake/durable method parity | `3/3` | method、request、snapshot、outcome/error shape一一对应 |
| new L1/L2 blocker | `0` | 既有`SBX-DDD-GRANULARITY-STEP7-OUTCOME-001`与`SBX-DDD-GRANULARITY-STEP7-READ-001`继续开放 |

反向审计结论：13项facade没有遗漏；F4三项没有generic reader alias；任何technical failure都不会进入成功
`Empty/Degraded/Unavailable` branch；任何canonical business `Failed/Unavailable/Unsupported/Unknown`也不会被误判为
本次Query technical failure。A1 inventory的历史材料只保留为审计输入，不恢复旧latest reader、mutable repository或
opaque selector。

## 72. A2-F4 完成状态与用户复核门

`A2-F4-J`已完成；F4只停在用户复核门，不自动进入F5。正式`projects/L4-sandbox/03-详细设计.md`仍冻结，本批没有
implementation、真实测试、run_id、evidence alias、验收签署或commit。

| item | state |
|---|---|
| `A2-F4-P` | `completed` |
| `A2-F4-D` | `completed` |
| `A2-F4-C` | `completed` |
| `A2-F4-J` | `completed_wait_user_review` |
| F4 batch | `completed_wait_user_review` |
| query reader coverage | `11/13` cumulative provisional；F4自身`3/3` |
| selector variant coverage | `17/17` for completed internal parts |
| existing maintenance reader | `9/9` preserved；Query use=`0/11` |
| open blockers | `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001`、`SBX-DDD-GRANULARITY-STEP7-READ-001` |
| new L1/L2 blocker | `0` |
| formal `03-详细设计.md` writeback | `forbidden` |
| next internal batch | `A2-F5 reconciliation/audit exact reader contracts` |
| next allowed action | `wait_user_review_before_A2-F5` |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_module = exact_read_and_necessary_maintenance_surface
current_task = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A2-F4 projection/derived/comparison completed_wait_user_review
current_internal_task = A2-F4 review gate
current_artifact = projects/L4-sandbox/design-calibration/03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_in_progress_wait_user_review
batch_status = completed_wait_user_review
a1_inventory = completed
a2_exact_reader_contracts = in_progress_4_of_5_families_completed
a2_f1_execution_boundary_policy = completed
a2_f2_capture_handoff = completed
a2_f3_failure_cleanup_redline = completed_wait_user_review
a2_f4_projection_derived_comparison = completed_wait_user_review
a2_f4_p_projection = completed
a2_f4_d_derived = completed
a2_f4_c_comparison = completed
a2_f4_j_shared_join = completed_wait_user_review
a2_f5_reconciliation_audit = pending
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_inventory = 13/13_unique
query_reader_coverage = 11/13_provisional_within_F4
selector_variant_coverage = 17/17_for_completed_internal_parts
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/11_completed_queries
tracked_tasks = 108_unique
task_status = 43_completed,1_in_progress,61_pending,1_blocked
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001|SBX-DDD-GRANULARITY-STEP7-READ-001
new_l1_l2_blocker = 0
next_internal_batch = A2-F5 reconciliation/audit exact reader contracts
next_allowed_action = wait_user_review_before_A2-F5
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

F4的内部子任务完成不改变全局`108`项task register的历史计数；`task_status`继续按项目台账原有口径记录。用户复核
确认后，下一次只允许读取并启动A2-F5；不得自动进入A3/A4、Step 8或正式文档回填。

## 73. A2-F5 开工：Reconciliation Exact Reader（F5-R）

F4 用户复核门已消费。本节只处理 `GetSandboxReconciliationReport` 的 exact report reader；audit trace bounded
page、F5 shared error/fake parity、A3 writer boundary、A4 blocker closure、Step 8 和正式
`projects/L4-sandbox/03-详细设计.md` 均不在本批写入范围。

### 73.1 F5-R 输入、SOP 回答与边界判断

| SOP 问题 | current answer | 本批边界 |
|---|---|---|
| reader 的唯一 owner 是谁 | application port `SandboxReconciliationReportReader`；durable implementation owner 是 `infra::query_read` | 不新建 domain report、repository root 或第二 report schema。 |
| reader 接收什么 | 已通过 `Permitted` access gate 的 `SandboxReconciliationReportReadRequest` 与 caller-owned `SandboxCommittedReadSnapshot` | 不接收 scope、context-current、latest hint、target kind、page token、raw DTO 或 write UoW。 |
| report 的 absence 如何证明 | 同一 snapshot 读取六项 exact reverse-index cardinality，且六项全部为零时才构造 `SandboxReconciliationReportAbsenceProof` | `repository None`、单个 root row 缺失、timeout 或 partial index 都不能形成 `Empty`。 |
| report 命中如何重建 | exact row、nested finding/basis、matching audit linkage 在同一 snapshot 组成 `SandboxReconciliationReportPersistenceBundle`，再调用 Step 6 canonical rehydration | 不信任 persisted status/count，不丢弃 finding，不从 relay/stored relation 重组 report。 |
| `Failed` report 是什么 | 被读取的 immutable report 内容；只要 rehydration 成功就带 body 以 `Visible` 返回 | 不能把 report status `Failed`误判为本次 query technical failure。 |
| 读缺口如何展示 | 只有已映射为 Step 6 typed `SandboxReconciliationReportReadGapSet` 的缺口才返回 no-body `Unavailable` | known orphan、half-commit、duplicate、wrong-owner relation 一律 `Err`。 |
| audit 关系属于什么 | report persistence bundle 的必要 matching linkage；只读验证原 materialization audit | 本批不定义 audit page、audit 查询 selector 或新的 business audit。 |
| 是否触发主体功能 | 不触发 reconciliation job、repair、refresh、projection rebuild、relay、cleanup、runtime/tool/backend call | Query write、identity、cursor、business audit append 全部为零。 |

F5-R 的功能属于“读取已物化对账结果”的维护/审查观察面，不是 Sandbox 主体隔离执行流程。报告中的 finding 只陈述
已提交关系异常；它不施加 execution environment、resource limit、filesystem/network/process boundary，不决定
tool/runtime launch policy，不执行 artifact capture、observability store、failure classification、cleanup/lease/reaper
或 security redline transition，也不承接 tools semantic execution、runtime agent loop 或 member lifecycle orchestration。

### 73.2 Historical diagnosis 与 F5 子任务表

| historical / current finding | risk | current disposition |
|---|---|---|
| 旧文档使用 scope 或 context 查询“当前报告” | 会绕过 immutable report identity并产生 latest winner 语义 | 登记为 `historical_material`；只接受 `SandboxReconciliationReportSelector`。 |
| Step 6 已有 lookup outcome，但 Step 7 没有 named application method | 实现者可能直接注入 mutable repository或返回 `Option<Report>` | 本批补一个具名 reader method和typed request。 |
| row、finding、audit 可被分开读取 | 不同 generation 会拼出不可验证的 report | 强制同一 snapshot、完整 persistence bundle和canonical rehydration。 |
| report `Failed` 与 reader `Err` 名称相近 | 可能丢掉有价值的业务失败报告，或将损坏数据伪装成业务失败 | 通过四分支 surface matrix 固定语义。 |
| audit trace 仍无 formal page carrier | 可能过早发明通用 audit reader | F5-R 只消费 exact report 的 matching audit linkage；F5-A 单独补 bounded page。 |
| scope digest verifier 仍受 `BLK-SBX-CANONICAL-001` 约束 | 实现者可能使用 fixture hash 放行 rehydration | verifier 未绑定时只返回 typed unavailable/error；不伪造 digest 或 evidence。 |

| F5 internal task | status | 本批交付物 | 完成门 |
|---|---|---|---|
| `A2-F5-R` | `[>]` | exact request、六项 cardinality、same-snapshot report/audit bundle、named reader、surface mapping、zero-write self-check | `request=1/1`、`index=6/6`、rehydration order=`1/1`、outcome mapping=`4/4`。 |
| `A2-F5-A` | `[ ]` | audit trace bounded page source、empty proof、typed gap/outcome、continuation contract | 只在 F5-R 完成后启动。 |
| `A2-F5-J` | `[ ]` | shared error、facade join、durable/fake parity、static total audit和恢复同步 | 只在 F5-R/F5-A均完成后启动。 |

F5-R 复用以下 current authority，不复制其字段或状态：Step 6 §16.10 的
`SandboxReconciliationReportSelector`、`SandboxReconciliationReportIndexCardinality`、
`SandboxReconciliationReportAbsenceProof`、`SandboxReconciliationReportLookupOutcome`、
`SandboxReconciliationReportPersistenceBundle`、`SandboxReconciliationReport::rehydrate` 和四状态派生矩阵；
Step 7 facade §23 的 access-first、single fair snapshot、close 覆盖和 Query zero-write；Step 7 repository 的
committed read snapshot 与 write UoW 分离规则。

## 74. F5-R Permitted Exact Request Contract

`SandboxReconciliationReportReadRequest` 是 application-local transient carrier。它只把已通过 access gate 的 decision
与 Step 6 exact selector 绑定，防止 infra adapter 接受 scope-only或latest输入。它不进入 Step 6 domain registry、Step 8
public DTO或durable schema。

```rust
/// 已通过full-read access gate的exact reconciliation report读取请求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReconciliationReportReadRequest {
    /// 与service context、operation和query kind匹配的Permitted decision。
    access_decision: SandboxQueryAccessDecision,
    /// 唯一允许的exact immutable report selector。
    selector: SandboxReconciliationReportSelector,
}

impl SandboxReconciliationReportReadRequest {
    /// 只接受matching context、request digest、selector fingerprint和Permitted decision。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetSandboxReconciliationReportInput,
    ) -> Result<Self, SandboxReconciliationReportReadError>;

    /// 返回已通过access校验的decision；reader不得重新计算权限。
    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;

    /// 返回唯一exact report selector；调用方不得替换为scope或latest selector。
    pub fn selector(&self) -> &SandboxReconciliationReportSelector;
}
```

factory 的检查顺序固定为：

1. 校验 `context.channel() == ApiQuery`、operation mapping为 `GetSandboxReconciliationReport`，并确认 entry 已冻结
   actor、request digest和trace context。
2. 校验 `access_decision.query_kind()`、access decision中现有 actor/scope/digest关联与 `context` 一致，并要求
   `Permitted` / `permits_read() == true`。
3. 调用 `input.selector()` 的 canonical validation；selector 必须严格是
   `SandboxReconciliationReportSelector { report_ref }`，并使用既有 canonical request/selector fingerprint 校验，
   不在本 factory 创建新的 fingerprint或重算 raw body digest。
4. 拒绝 scope-only、context-current、latest、target-kind、stored-result-ref、空 selector和 report/scope optional
   precedence；不读取 report index或任何 target row。
5. 只有全部 pure checks 通过后才生成 request；factory 失败时 snapshot read count必须为 `0`。

| request field | source | valid shape | forbidden substitute |
|---|---|---|---|
| `access_decision` | existing application access resolver | matching `Permitted` decision；query kind固定 | caller bool、route string、raw visibility flag、job permit |
| `selector` | Step 6 canonical `SandboxReconciliationReportSelector` | one non-empty typed `report_ref` | scope、context、latest、opaque ref、string key |
| actor / operation / digest | existing `SandboxServiceCallContext` and access decision | equal to entry-validated values | request内复制字段、timestamp、trace id或report ref推导 |

request 只承接 access metadata 和 exact selector，不承接 `SandboxReconciliationScopeRef` 的成员集合；Query 不读取
scope member 来“确认报告属于谁”。report 的 scope、digest、source cursor和audit linkage只能在命中 exact row 后由
canonical rehydration验证。

## 75. F5-R Six-index Cardinality 与 Same-snapshot Read Order

### 75.1 Named reader port

F5-R 不与尚未闭合的 audit page reader 共用 generic `read(kind, selector)`。application port 只暴露一个具名方法；
Step 6 lookup outcome 是唯一业务返回 carrier，F5-R error 只描述 reader 技术/契约失败。

```rust
/// exact reconciliation report的application-owned只读source port。
pub trait SandboxReconciliationReportReader: Send + Sync {
    /// 在caller提供的一个fair committed snapshot中读取exact report及其必要relation。
    async fn read_sandbox_reconciliation_report_source(
        &self,
        request: &SandboxReconciliationReportReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<
        SandboxReconciliationReportLookupOutcome,
        SandboxReconciliationReportReadError,
    >;
}
```

reader 不 open/close snapshot，不持有 snapshot 到下一次调用，不创建 write UoW，不接受 public page token，也不把
`SandboxReconciliationReportLookupOutcome`缓存到 reader 字段。durable adapter 和 deterministic fake 必须实现同一个
具名 method；F5-J 才补二者的共享调用记录与 parity 检查。

### 75.2 六项 exact index 读取顺序

在 request factory 和 access gate通过后，reader 对同一个 `report_ref` 按以下顺序读取六项 complete logical index。
六项都必须从同一 `SandboxCommittedReadSnapshot` 获得；不能因 root=0提前跳过后五项，因为 exact absence 要求完整反向
覆盖。

```text
checked SandboxReconciliationReportReadRequest
  -> read report aggregate root index
  -> read report-local finding aggregate index
  -> read current-binding target index
  -> read reconciliation audit relation index
  -> read finding-available relay source index
  -> read stored-job-result relation index
  -> SandboxReconciliationReportIndexCardinality::try_from_complete_indexes(...)
  -> classify exact absence, present aggregate, typed read gap, or integrity error
```

| ordinal | exact index | required key | role | incomplete / corrupt result |
|---:|---|---|---|---|
| 1 | report aggregate root | `report_ref` | 证明 immutable report root为 `0` 或 `1` | dependency gap可形成 typed gap；`>1`为 integrity error。 |
| 2 | finding aggregate | `report_ref` + report-local finding relation | 校验 finding stream覆盖 | index不可读为 `FindingAggregate` gap；孤立 finding为 integrity error。 |
| 3 | current binding target | `report_ref` as binding target | 区分 historical `0` 与 current `1` | `>1`、dangling或wrong owner为 integrity error。 |
| 4 | reconciliation audit relation | report source/subject relation | 必须找到 materialization audit linkage | 暂时不可读可形成 `AuditLinkage` gap；非唯一或错绑为 integrity error。 |
| 5 | relay source relation | report source fact | 检查可见 relation cardinality，不重组 report | duplicate、wrong source或悬挂 relation为 integrity error。 |
| 6 | stored result relation | stored job result引用 | 检查 job replay relation，不替代 report row | duplicate、wrong owner或半提交为 integrity error。 |

reader 必须把六项原始计数一次性送入 Step 6 canonical
`SandboxReconciliationReportIndexCardinality::try_from_complete_indexes`；不得在 Step 7 重新定义计数 struct、
在 application 里“先看到 root 再猜其它 count”，也不得按 timestamp、Version、job run id或字符串选择 winner。

### 75.3 Cardinality 分类矩阵

| root count | dependent counts | next action | public implication |
|---:|---|---|---|
| `0` | 六项全部为 `0` | 调用 `SandboxReconciliationReportAbsenceProof::try_from_complete_zero_indexes` | canonical `ExactAbsent`，facade映 `Empty`。 |
| `0` | 任一 dependent 非 `0` | 返回 reader `Err`，标记 persistence relation corruption | 不得映 `Empty`、`Unavailable`或伪造 Failed report。 |
| `1` | index cardinality合法，matching row/audit可完整读取 | 按 §76 组装 persistence bundle并rehydrate | 返回 canonical `Report`。 |
| `1` | 任一必要 channel 暂时不可读且无已知 corruption | 构造非空 `SandboxReconciliationReportReadGapSet` | canonical `Unavailable`，无 partial body。 |
| `1` | duplicate、half-commit、wrong owner、count mismatch或rehydration失败 | 返回 reader `Err` | application `Failed`/integrity error，无 report body。 |
| `>1` | 任意 | 立即返回 canonical cardinality/integrity error | 不按时间或版本选 winner。 |

historical report 允许 `current_binding_target_count == 0`；current report允许该值为 `1`。这项 count 不改变 exact
report 的可读性，只有 relation/canonical rehydration失败才是 integrity error。`finding_row_count`、`audit_relation_count`
和其余 dependent count必须与同一 snapshot实际取得的 relation一致；计数不确定时不能构造 absence proof。

## 76. F5-R Persistence Bundle Rehydration Contract

当 root=1 且六项 index完整时，reader 必须沿 exact report ref执行以下不可重排的读取/校验顺序。每一步返回的 carrier
只在当前调用栈中存在；不得把 row 或 audit linkage写回 repository。

```text
read exact report row and nested scope/basis/finding rows by report_ref
  -> rebuild nested refs, sets, basis and findings through canonical factories
  -> SandboxReconciliationReportPersistenceRow::try_new(...)
  -> read exact audit row by row.report_audit_trace_ref in the same snapshot
  -> rehydrate committed SandboxAuditTrace with its report source proof
  -> SandboxReconciliationReportAuditLinkageSnapshot::try_from_committed_reconciliation_audit(...)
  -> SandboxReconciliationReportPersistenceBundle::try_new(row, audit_linkage)
  -> bundle.into_rehydration_input()
  -> SandboxReconciliationReport::rehydrate(input)
  -> return SandboxReconciliationReportLookupOutcome::Report(report)
```

| rehydration check | source of truth | failure disposition |
|---|---|---|
| report ref、scope/digest binding、basis scope | canonical row + Step 6 verifier | digest verifier unavailable为 typed gap；scope/digest mismatch为 integrity error；不使用 fixture hash。 |
| finding order、ordinal、count | exact nested finding rows + canonical finding set | missing/duplicate/reordered row为 integrity error；不排序、不去重、不丢弃。 |
| report status | Step 6 exhaustive `derive_report_status` | persisted enum只作 equality check；不按 status/count猜结果。 |
| audit source/subject/kind/status | matching committed `SandboxAuditTrace` | missing、非 `Linked`、wrong source/subject或wrong kind为 gap或integrity error，不能 row-only fallback。 |
| source/report/audit cursors and time | canonical cursor/time relations | relation不合法为 integrity error；不以 repository Version或wall-clock latest替代。 |
| body-free contract | scope、basis、finding、reason、audit linkage | path、URL、host、process、network、artifact/evidence body、raw provider body或secret出现即 integrity error。 |

`SandboxReconciliationReportPersistenceBundle` 是 report 命中成功的最小完整 bundle。reader 不得返回
`SandboxReconciliationReportPersistenceRow`、`SandboxReconciliationReportAuditLinkageSnapshot` 或未rehydrate的
partial aggregate；这些是 infra-to-contract 的内部 carrier，不是 application output。

`SandboxReconciliationReport::rehydrate` 未通过时，若失败原因是已知 relation/cardinality/body-free corruption，返回
reader `Err`；若仅是 scope digest verifier 或某个 required read channel 暂时不可用，则只能构造 Step 6 定义的 typed
gap并返回 canonical `Unavailable`。任何 mapper 不得把 raw error 文本放入 `SandboxReason`。

## 77. F5-R Canonical Outcome 与 Facade Surface Mapping

### 77.1 Reader outcome 的四分支边界

| reader result | meaning | facade result | body rule |
|---|---|---|---|
| `Ok(Report(report))`, report status `Clean` | 已完整读取且无 finding | `Visible` | 必须携带完整 report body。 |
| `Ok(Report(report))`, report status `IssuesFound` | 已完整读取且有已证明 finding | `Visible` | 必须携带完整 report body和finding stream。 |
| `Ok(Report(report))`, report status `Degraded` | report本身记录了可信但不完整 coverage | `Degraded` | 必须携带 report body；reasons来自canonical coverage/gap，不能丢body。 |
| `Ok(Report(report))`, report status `Failed` | immutable report记录了一次对账/装配失败 | `Visible` | 必须携带 report body；这是业务内容，不是本次Query `Err`。 |
| `Ok(ExactAbsent(proof))` | 六项 index完整全零 | `Empty` | no-body；reason为空或沿既有 Empty contract处理。 |
| `Ok(Unavailable { selector, gaps })` | 只有 typed read gap，尚未证明不存在或损坏 | `Unavailable` | no-body；reasons由 gap set canonical mapping产生。 |
| `Err(...)` | request、snapshot、repository或integrity技术失败 | application error | no report body；不转成 `Empty/Degraded/Unavailable`成功分支。 |

`SandboxReconciliationReportStatus::Failed` 与 reader error 的判别条件是“是否已经成功 rehydrate 一个 immutable
report”。成功 rehydrate 的 Failed report必须可见；root=1但 row/audit损坏或无法完成 rehydration时没有可安全展示的
report，必须走 `Err`。同样，Step 6 report 的 `Unavailable`或`Unsupported`等业务状态若属于 report body，不能被误当作
本次 reader technical failure。

### 77.2 Access-first facade flow

```text
GetSandboxReconciliationReportInput + SandboxServiceCallContext
  -> pure input / operation / selector validation
  -> SandboxQueryAccessDecision
     -> NotVisible | Restricted | access Unavailable:
          return access surface; open=0, reader=0, close=0
     -> Permitted:
          SandboxReconciliationReportReadRequest::try_from_permitted(...)
          -> open one SandboxCommittedReadSnapshot
          -> read_sandbox_reconciliation_report_source(...)
          -> own outcome and map Report/ExactAbsent/Unavailable
          -> close the same snapshot exactly once
          -> close failure overrides unreturned result with PortUnavailable
          -> one redacted diagnostic hook at most
```

| lifecycle item | required count | forbidden behavior |
|---|---:|---|
| access decision before target/index read | `1/1` | 先读 report existence再判断 visibility。 |
| permitted snapshot open | `1` | reader自行open、第二 snapshot、latest fallback。 |
| named reader invocation | `1` | generic reader、重复调用、按 error retry。 |
| snapshot close | `1` on successful open | 跨snapshot close、close后读取借用 body、close失败后重读。 |
| business audit append | `0` | 把本次 Query 写成 `SandboxAuditTrace`。 |

close 前必须把 report、proof、gap和surface转换为不借用 snapshot 的 owned result；close失败覆盖尚未返回的 assembled
result，不构造第二次读取。diagnostic hook只记录 operation、query kind、surface category、gap/error class和phase等
低基数字段，不记录 exact report ref、scope、finding、audit body或底层 provider error。

## 78. F5-R No-write、Security Redline 与 Necessary Maintenance Separation

| capability / action | query count | F5-R rule |
|---|---:|---|
| write UoW begin/save/commit/CAS | `0` | reader只借用 committed read snapshot。 |
| report/finding/audit/relay/stored identity allocation | `0` | 所有 identity均来自已提交 row；不现场分配。 |
| idempotency reservation / result write | `0` | query不是 job replay或materialization入口。 |
| report generation / re-run / repair | `0` | `RunSandboxReconciliation`仍由专用 Job owner承接。 |
| source truth/projection/handoff/relay refresh | `0` | finding只观察关系，不修复 owner。 |
| cleanup/reaper/redline/tool/runtime/backend call | `0` | 不把审查结果升级为控制动作。 |
| business audit append | `0` | 只读取 report 已有 matching audit linkage。 |
| low-cardinality diagnostic hook | at most `1` | hook failure不改变 query result、不触发 retry。 |

F5-R 读取的 report body必须继续满足 Step 6 body-free negative list。report finding可以引用 typed refs、有限 kind、severity、
cursor、safe reason和已存在的 audit linkage，但不得携带 artifact正文、evidence alias、host/path/process/network detail、
SDK response、secret或观测原文。security redline只在 body-free检查中作为禁止数据边界出现，不由 report reader 执行
redline transition。

既有 `SandboxMaintenanceSelectionRepository` 的 `9/9` paged candidate methods不属于 F5-R；Query 对这些 reader 的调用数
保持 `0`。reconciliation materialization writer、stored job replay、relay和audit append必须由各自显式 owner 调用，
不能因为本次 exact read 命中缺口而从 reader 内触发。

## 79. A2-F5-R Static Self-check 与阶段完成门

以下结果是设计文本的静态计数，不是编译、真实测试、run、evidence或验收结果。

| check | result | closure rule |
|---|---:|---|
| exact report request | `1/1` | 只接受 matching Permitted + exact report selector；scope/latest/raw input=`0`。 |
| named reader method | `1/1` | `read_sandbox_reconciliation_report_source`唯一；generic reconciliation reader=`0`。 |
| cardinality fields and read order | `6/6` | root、finding、current binding、audit、relay、stored relation均同snapshot读取。 |
| exact absence proof | `1/1` | 六项完整且全零才 `ExactAbsent`；dependent orphan不能降级。 |
| persistence bundle rehydration | `1/1` | row + matching audit linkage + canonical rehydrate；row-only/partial body=`0`。 |
| outcome-to-surface branches | `4/4` | Clean/IssuesFound/Failed=`Visible`；Degraded=`Degraded`；ExactAbsent=`Empty`；typed gap=`Unavailable`；technical/integrity=`Err`。 |
| Failed report distinction | `1/1` | rehydrated business Failed带body；reader technical failure无body。 |
| access lifecycle | `1/1` permitted、`3/3` denied | permitted `open=1/reader=1/close=1`；denied全为 `0`。 |
| Query side effects | `0/0/0/0/0` | write/identity/cursor/business-audit/external call全为零。 |
| maintenance separation | `9/9` preserved | existing selection reader仍独立；F5-R use=`0`。 |
| new L1/L2 blocker | `0` | 既有 `SBX-DDD-GRANULARITY-STEP7-READ-001`、`OUTCOME-001`继续开放。 |

F5-R 结论：reconciliation exact report 的 application read seam 已达到可由实现者直接还原的粒度，同时没有把
reconciliation job、audit page、repair或主体隔离流程并入 Query。F5-R 完成不代表 F5 family 完成，也不关闭既有
`READ-001` / `OUTCOME-001`；F5-A 和 F5-J 必须继续分别补 audit page 与 shared/static closure。

## EOF Current Recovery Override: `7R-04A-A2-F5-R` completed, F5-A in progress

本节取代前一节 F5-R working state，成为本 read artifact 的物理 EOF current authority。F5-R 已完成并已通过本节静态
self-check；当前只允许进入 `A2-F5-A` audit bounded page。正式 `projects/L4-sandbox/03-详细设计.md` 仍冻结，不能
因为 F5-R 完成而回填正式文档或启动 A3/A4。

| recovery item | current fact |
|---|---|
| consumed gate | `7R-04A-A2-F4 completed_wait_user_review` |
| completed internal task | `A2-F5-R` reconciliation exact report reader |
| F5-R closure | request `1/1`；six-index cardinality/read order `6/6`；bundle rehydration `1/1`；surface mapping `4/4`；Query zero-write闭合 |
| current internal task | `A2-F5-A` audit trace bounded page reader `in_progress` |
| pending internal task | `A2-F5-J` shared join/static audit/recovery sync |
| query reader coverage | `12/13 provisional`；audit Query尚未计入完成 |
| selector variant coverage | `18/18` for completed internal parts |
| existing maintenance reader | `9/9` preserved；public Query use=`0/12` |
| open blockers | `SBX-DDD-GRANULARITY-STEP7-READ-001`、`SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` |
| new L1/L2 blocker | `0` |
| formal `03-详细设计.md` | unchanged and frozen |
| implementation/test/evidence/acceptance | not started；no commit required |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_module = exact_read_and_necessary_maintenance_surface
current_task = 7R-04A exact read and maintenance surface
current_sub_batch = 7R-04A-A2-F5 reconciliation/audit exact reader contracts in_progress
current_internal_task = A2-F5-A audit bounded page reader
current_artifact = projects/L4-sandbox/design-calibration/03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_in_progress
batch_status = authorized_in_progress
a1_inventory = completed
a2_exact_reader_contracts = in_progress_4_of_5_families_completed
a2_f1_execution_boundary_policy = completed
a2_f2_capture_handoff = completed
a2_f3_failure_cleanup_redline = completed_wait_user_review
a2_f4_projection_derived_comparison = completed_wait_user_review
a2_f5_reconciliation_audit = in_progress_a
a2_f5_r_reconciliation = completed
a2_f5_a_audit = in_progress
a2_f5_j_shared_join = pending
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_inventory = 13/13_unique
query_reader_coverage = 12/13_provisional
selector_variant_coverage = 18/18_for_completed_internal_parts
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/12_completed_queries
tracked_tasks = 108_unique
task_status = 43_completed,1_in_progress,61_pending,1_blocked
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_07 = historical_reviewed_revalidation_pending
formal_03_writeback = forbidden
step_7_total_gate = blocked_by_existing_owner_blockers
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

F5-R 只表示中间产物完成；下一步应先读取 audit page 的 Step 6 source、Step 7 facade bounded page contract 和现有
immutable audit repository，再继续 `A2-F5-A`。不得把 F5-R 的完成写成实现、测试或验收事实。

## 80. A2-F5-A 开工：Audit Trace Bounded Page Reader

F5-A 只关闭 `GetSandboxAuditTrace` 的 immutable business audit page。它属于审计/记录观察面，不是 Sandbox 主体隔离
流程：不建立 execution environment，不施加 resource limit、filesystem/network/process boundary，不决定 tool/runtime
launch policy，不执行 artifact capture、observability store 查询、failure classification、cleanup/lease/reaper 或 security
redline transition，也不承接 tools semantic execution、runtime agent loop 或 member lifecycle orchestration。

### 80.1 Current authority 与历史冲突处置

| input | current fact consumed by F5-A | forbidden reinterpretation |
|---|---|---|
| Step 6 `SandboxAuditTrace` | immutable、body-free、durable status只能为`Linked`；每项必须经完整 persistence bundle rehydrate | row-only decode、读取时把历史status迁成Linked、把observability/log正文当audit body |
| Step 6 audit relation | `SandboxAuditRelationProof -> AuditMaterialSourceSnapshot -> SandboxAuditSourceBinding -> SandboxAuditRehydrationInput -> SandboxAuditTrace::rehydrate` | 由subject字符串、kind文本、row自身或latest owner反推proof |
| Step 7 facade | required context + closed subject + optional closed kind + bounded `PageRequest`；access-first；一个fair committed snapshot | page token先于visibility解码、subject existence probe、Query追加“read audit” |
| Step 7 committed read | reader只借用`&mut dyn SandboxCommittedReadSnapshot`；write UoW能力不可注入Query assembly | 为复用旧trait开启write UoW后rollback、跨snapshot拼页 |
| Step 7 page output | 复用`SandboxRepositoryCursor`和`SandboxQueryPageInfo`作为application-local opaque carrier | 新建第二个public cursor、把truth cursor/Version/timestamp直接作为token |
| Step 7 immutable audit draft | 稳定顺序固定为`(source_truth_cursor, trace_ref)` | timestamp、Version、offset、occurred_at或trace ref单独排序 |

以下历史材料只保留为冲突证据，不能实现 compatibility wrapper：

1. `SandboxAuditTraceRepository::list_audit_traces_by_subject(..., &mut dyn SandboxUnitOfWork)`要求write-capable参数，与
   current Query committed-read-only边界冲突，登记为 `historical_repository_seam`。
2. 旧 `get_audit_trace_with_version(..., &mut dyn SandboxUnitOfWork)`不能被 page reader逐项调用；current reader必须在同一
   caller-owned read snapshot内装配完整 bundle，且`Version`不参与排序或续页。
3. `SandboxRepositoryCursor`曾被描述为maintenance-only，但更晚的current facade已经把它定义为
   `SandboxQueryPageInfo`的通用application-local continuation carrier。F5-A复用该opaque外壳，只增加audit-specific
   logical payload、codec和typed anchor；application不得解析`encoded()`正文。
4. `SandboxRepositoryPage`与旧generic `Page<T>`不作为current public Query input/output。`PageRequest`只在access允许后由
   matching audit codec转换为本节typed anchor/limit；输出继续使用`SandboxQueryPageInfo`。

### 80.2 F5-A SOP 问题回答

| SOP 问题 | exact answer | negative cut |
|---|---|---|
| selector是什么 | required `context_ref`、required closed `subject_ref`、optional closed `SandboxAuditTraceKind` | opaque scope、operation/error文本、跨subject search、latest |
| access何时发生 | input pure validation后、cursor decode和subject/index read前 | 通过cursor有效性或trace存在性反推visibility |
| 页如何稳定 | 首页冻结immutable subject-index generation；续页绑定family、selector fingerprint、generation、last `(truth_cursor, trace_ref)`和原limit | 新generation近似续页、offset、timestamp winner、改变limit |
| item如何可信 | 每个index item在同一generation/snapshot内完成canonical audit persistence bundle rehydration | row-only item、缺sidecar后跳过、按status猜Linked |
| empty如何证明 | complete subject/context resolution + complete selected-index aggregate为零 + first anchor + terminal page | repository `None`、timeout、continued空页、filter/channel未知 |
| partial何时允许 | 仅已完整rehydrate且严格位于首个typed temporary gap之前的稳定前缀 | 越过gap继续收集、丢坏row、partial aggregate item |
| 哪些失败可成为gap | valid generation内某个required read channel暂时不可访问，且没有已知missing/corruption/wrong-owner事实 | known missing sidecar、duplicate、wrong owner、malformed row、historical status |
| side effect是多少 | write/UoW/CAS/identity/truth cursor/business audit/external call均为0 | query-side append、repair、migration、relay、rebuild、cleanup |

## 81. F5-A Permitted Selector、Subject Scope 与 Request Contract

### 81.1 Closed page selector

`SandboxAuditTracePageSelector` 是application-local checked selector，不进入Step 6 registry、Step 8 DTO或durable schema。
它不复制 audit object字段，只冻结当前Query允许读取的subject范围。

```rust
/// GetSandboxAuditTrace唯一允许的closed subject-page selector。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTracePageSelector {
    /// subject visibility和lineage必须归属的required execution context。
    context_ref: ControlledExecutionContextRef,
    /// Step 6 closed Sandbox-local business audit subject。
    subject_ref: SandboxTraceSubjectRef,
    /// None表示该subject允许的全部kind；Some必须接受该subject kind。
    trace_kind_filter: Option<SandboxAuditTraceKind>,
}

impl SandboxAuditTracePageSelector {
    /// 从已pure-validated application input构造selector；不读取subject或audit index。
    pub fn try_from_input(
        input: &GetSandboxAuditTraceInput,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn subject_ref(&self) -> &SandboxTraceSubjectRef;
    pub fn trace_kind_filter(&self) -> Option<SandboxAuditTraceKind>;
}
```

factory按以下顺序纯校验：

1. `context_ref`与`subject_ref`均为已经通过各自typed factory的non-empty identity；不从字符串重建ref。
2. subject不得为`SandboxAuditTrace`自身、guard、view、application helper、external source或未列入
   `SandboxTraceSubjectRef`的对象。
3. `Some(kind)`必须满足`kind.accepts_subject(subject_ref)`；不接受的kind返回`SelectorMismatch`，不能作为合法空filter。
4. `None`表示该subject所有允许kind的union；不得展开成14次独立query后拼接，也不得把未来unknown kind静默包含。
5. selector fingerprint只覆盖canonical context、subject和optional kind tag，不覆盖page cursor、limit、request digest、
   actor、trace id或Debug文本。

### 81.2 Subject/context resolution proof

typed subject本身不证明它属于request context。reader必须在同一committed snapshot读取exact subject-scope relation，并形成
以下closed resolution；non-empty page只接受`Bound`。`ExactAbsent`仅供第一页完整空证明使用，不能与任何audit index
entry共存。

```rust
/// 一个subject在required context中的exact committed resolution。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxAuditSubjectScopeResolution {
    /// exact relation count=1且owner snapshot逐字段匹配。
    Bound(SandboxAuditSubjectContextProof),
    /// exact relation count=0且反向audit relation也完整为0。
    ExactAbsent(SandboxAuditSubjectContextAbsenceProof),
}

/// 证明subject由required context拥有的same-snapshot transient carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditSubjectContextProof {
    context_ref: ControlledExecutionContextRef,
    subject_ref: SandboxTraceSubjectRef,
    subject_relation_count: u32,
    subject_audit_relation_count: u64,
    index_generation: SandboxAuditSubjectIndexGeneration,
}

impl SandboxAuditSubjectContextProof {
    /// 只接受relation count=1、matching owner lineage和已选定immutable index generation。
    pub fn try_from_committed_index(
        selector: &SandboxAuditTracePageSelector,
        subject_relation_count: u32,
        subject_audit_relation_count: u64,
        index_generation: SandboxAuditSubjectIndexGeneration,
        owner_relation: SandboxAuditSubjectOwnerRelation,
    ) -> Result<Self, SandboxAuditTracePageReadError>;
}

/// 证明required context下既无subject binding也无悬挂audit relation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditSubjectContextAbsenceProof {
    context_ref: ControlledExecutionContextRef,
    subject_ref: SandboxTraceSubjectRef,
    subject_relation_count: u32,
    subject_audit_relation_count: u64,
    index_generation: SandboxAuditSubjectIndexGeneration,
}

impl SandboxAuditSubjectContextAbsenceProof {
    /// 只接受matching selector、完整subject index generation和两个exact relation count均为0。
    pub fn try_from_complete_zero_indexes(
        selector: &SandboxAuditTracePageSelector,
        subject_relation_count: u32,
        subject_audit_relation_count: u64,
        index_generation: SandboxAuditSubjectIndexGeneration,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    pub fn subject_ref(&self) -> &SandboxTraceSubjectRef;
    pub fn subject_relation_count(&self) -> u32;
    pub fn subject_audit_relation_count(&self) -> u64;
    pub fn index_generation(&self) -> &SandboxAuditSubjectIndexGeneration;
}
```

`SandboxAuditSubjectOwnerRelation` 是infra source reader从canonical owner snapshot提取的closed transient relation，不进入
persistence。它必须按`SandboxTraceSubjectRef` variant穷尽取得context：execution/boundary/policy/run/capture/handoff/
failure/control/cleanup/redline/projection直接使用owner lineage；derived/reconciliation只接受其committed optional context
明确为当前context的路径；relay必须沿relay row的original source proof取得context。不得从第一条audit row反推context。

| exact relation state | result | disposition |
|---|---|---|
| subject count=`1`，owner context/ref全等 | `Bound` | 允许继续selected audit index读取。 |
| subject count=`0`，subject audit relation count=`0` | `ExactAbsent` | 只可能与first-page complete empty proof组合。 |
| subject count=`0`，任一audit relation非零 | error | orphan/half-commit；不得Empty或Unavailable。 |
| subject count=`1`但owner context、kind或identity不等 | error | wrong-owner integrity；不返回另一个context。 |
| subject count`>1` | error | duplicate owner relation；不选latest/winner。 |
| subject/index channel暂不可访问且无已知corruption | typed gap | 无item时最终`Unavailable`；不得构造absence。 |

### 81.3 Validated page limit

```rust
/// GetSandboxAuditTrace一次返回的validated non-zero item limit。
#[derive(Clone, Copy, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub struct SandboxAuditTracePageLimit(u32);

impl SandboxAuditTracePageLimit {
    /// 要求requested/max均非零且requested <= startup-validated SBX-CFG-I003 ceiling。
    pub fn try_new(
        requested_limit: u32,
        max_query_page_limit: u32,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn get(self) -> u32;
}
```

limit只控制本页最多完整rehydrate多少个audit item，不限制subject历史总量，也不允许截断单个audit persistence bundle。
hot reload后的更大ceiling不能放宽已签发cursor；续页必须保持cursor内原limit。adapter最多读取`limit + 1`个ordered index
key用于证明`has_more`，其中最多`limit`个进入bundle rehydration；checked `u32 -> usize`或`limit + 1`溢出为typed error。

### 81.4 Permitted request

```rust
/// 已通过subject-level full-read access gate的audit bounded page request。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTracePageReadRequest {
    access_decision: SandboxQueryAccessDecision,
    selector: SandboxAuditTracePageSelector,
    page_anchor: SandboxAuditTracePageAnchor,
    page_limit: SandboxAuditTracePageLimit,
}

impl SandboxAuditTracePageReadRequest {
    /// 只接受matching GetSandboxAuditTrace context/selector、Permitted decision和已解码typed page输入。
    pub fn try_from_permitted(
        access_decision: SandboxQueryAccessDecision,
        context: &SandboxServiceCallContext,
        input: &GetSandboxAuditTraceInput,
        selector: SandboxAuditTracePageSelector,
        page_anchor: SandboxAuditTracePageAnchor,
        page_limit: SandboxAuditTracePageLimit,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn access_decision(&self) -> &SandboxQueryAccessDecision;
    pub fn selector(&self) -> &SandboxAuditTracePageSelector;
    pub fn page_anchor(&self) -> &SandboxAuditTracePageAnchor;
    pub fn page_limit(&self) -> SandboxAuditTracePageLimit;
}
```

factory固定检查`ApiQuery` channel、operation=`GetSandboxAuditTrace`、decision query kind、actor/scope/digest关联、
`Permitted`、input与selector逐字段相等、public cursor presence与typed anchor position一致、requested limit与validated limit
相等。`NotVisible/Restricted/access Unavailable`必须在cursor codec前返回，因而这些分支`decode/open/reader/close=0`。
invalid/tampered/expired cursor不能回退`First`，factory失败时subject/index read count为0。

## 82. F5-A Audit-specific Cursor、Anchor 与 Snapshot Generation

### 82.1 Stable order key 与 immutable generation

```rust
/// audit subject index的唯一canonical stable key。
#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub struct SandboxAuditTraceOrderKey {
    source_truth_cursor: SandboxTruthCursor,
    trace_ref: SandboxAuditTraceRef,
}

impl SandboxAuditTraceOrderKey {
    pub fn try_new(
        source_truth_cursor: SandboxTruthCursor,
        trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn source_truth_cursor(&self) -> SandboxTruthCursor;
    pub fn trace_ref(&self) -> &SandboxAuditTraceRef;
}

/// adapter可重读的immutable audit subject-index generation identity。
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub struct SandboxAuditSubjectIndexGeneration(String);

impl SandboxAuditSubjectIndexGeneration {
    /// 只允许matching audit index adapter从non-empty committed generation token构造。
    pub(crate) fn try_from_committed(value: String) -> Result<Self, SandboxAuditTracePageReadError>;
    pub(crate) fn as_str(&self) -> &str;
}

/// canonical selector fields形成的body-free opaque fingerprint。
#[derive(Clone, Debug, Eq, Hash, PartialEq)]
pub struct SandboxAuditTraceSelectorFingerprint(String);

impl SandboxAuditTraceSelectorFingerprint {
    /// 只允许matching audit cursor codec从canonical selector编码结果构造。
    pub(crate) fn try_from_canonical_selector_encoding(
        value: String,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    /// 仅供matching codec做constant-time equality和签发cursor；不得进入log或public DTO。
    pub(crate) fn as_str(&self) -> &str;
}
```

fingerprint factory只校验non-empty、canonical编码版本和body-free上限；canonical selector编码由matching audit cursor codec
按`context_ref + subject_ref + optional kind tag`的固定字段顺序产生。factory不得接收`Debug`文本、request digest、actor、
trace id、page limit或page token；具体签名/key配置继续由正式`04` owner提供，本节不伪造hash、key id或scope digest。

`SandboxAuditSubjectIndexGeneration`不是`SandboxReadSnapshotRef`。前者标识cursor保留期内可重读的immutable audit index
generation；后者只做一次facade调用内的snapshot correlation，不能持久化或进入cursor。generation也不等于truth cursor、
reference cursor、Version、wall clock或配置版本。首页由reader在caller snapshot内选择一个committed generation；续页只能
exact读取cursor绑定的同一generation。generation不可恢复时返回`CursorSnapshotUnavailable`，不得打开current generation
后从last key近似继续。

### 82.2 First/continued page anchor

```rust
/// audit page anchor的closed位置。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxAuditTracePagePosition {
    First,
    Continued,
}

/// matching audit cursor codec输出的typed snapshot-bound anchor。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTracePageAnchor {
    position: SandboxAuditTracePagePosition,
    repository_cursor: Option<SandboxRepositoryCursor>,
    selector_fingerprint: SandboxAuditTraceSelectorFingerprint,
    index_generation: Option<SandboxAuditSubjectIndexGeneration>,
    after: Option<SandboxAuditTraceOrderKey>,
    bound_limit: SandboxAuditTracePageLimit,
}

impl SandboxAuditTracePageAnchor {
    /// 首页不携带cursor/generation/after，但已经绑定当前selector fingerprint和validated limit。
    pub fn first(
        selector_fingerprint: SandboxAuditTraceSelectorFingerprint,
        bound_limit: SandboxAuditTracePageLimit,
    ) -> Self;

    /// 只由matching codec从完整校验后的opaque cursor构造续页anchor。
    pub(crate) fn try_continued(
        repository_cursor: SandboxRepositoryCursor,
        selector_fingerprint: SandboxAuditTraceSelectorFingerprint,
        index_generation: SandboxAuditSubjectIndexGeneration,
        after: SandboxAuditTraceOrderKey,
        bound_limit: SandboxAuditTracePageLimit,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn position(&self) -> SandboxAuditTracePagePosition;
    pub fn selector_fingerprint(&self) -> &SandboxAuditTraceSelectorFingerprint;
    pub fn index_generation(&self) -> Option<&SandboxAuditSubjectIndexGeneration>;
    pub fn after(&self) -> Option<&SandboxAuditTraceOrderKey>;
    pub fn bound_limit(&self) -> SandboxAuditTracePageLimit;
}
```

`SandboxRepositoryCursor`的logical payload必须完整绑定下列五项；application只持有opaque carrier，不能通过
`encoded()`解析这些字段：

| cursor field | exact source | mismatch disposition | forbidden substitute |
|---|---|---|---|
| family | fixed `GetSandboxAuditTrace/read_sandbox_audit_trace_page` discriminator | `CursorSelectorMismatch` | route、trait/debug name、topic |
| selector fingerprint | context + subject + optional kind canonical fields | `CursorSelectorMismatch` | request digest、actor、trace id、raw ref拼接 |
| index generation | 首页选择的immutable audit subject-index generation | `CursorSnapshotUnavailable` | current generation、Version、clock、truth cursor |
| last key | 最后一个已成功返回item的`(source_truth_cursor, trace_ref)` | `CursorCorrupt` | offset、occurred_at、timestamp-only、row body |
| page limit | 首页validated `SandboxAuditTracePageLimit` | `CursorLimitMismatch` | continuation request override、hot-reloaded ceiling |

### 82.3 Matching cursor codec

```rust
/// audit Query专用cursor codec；没有repository write、clock、identity或business digest能力。
pub trait SandboxAuditTracePageCursorCodec: Send + Sync {
    /// access Permitted后，把PageRequest解码为first/continued typed anchor和validated limit。
    fn decode_after_permitted(
        &self,
        selector: &SandboxAuditTracePageSelector,
        page_request: &PageRequest,
        max_query_page_limit: u32,
    ) -> Result<(SandboxAuditTracePageAnchor, SandboxAuditTracePageLimit), SandboxAuditTracePageReadError>;

    /// 为同一selector/generation和最后完整item签发application-local continuation。
    fn issue_continuation(
        &self,
        selector: &SandboxAuditTracePageSelector,
        generation: &SandboxAuditSubjectIndexGeneration,
        after: &SandboxAuditTraceOrderKey,
        limit: SandboxAuditTracePageLimit,
    ) -> Result<SandboxRepositoryCursor, SandboxAuditTracePageReadError>;

    /// Step 8 mapper使用matching family把application cursor编码为public PageToken；不改变payload binding。
    fn encode_public(
        &self,
        cursor: &SandboxRepositoryCursor,
    ) -> Result<PageToken, SandboxAuditTracePageReadError>;
}
```

codec不得读取subject存在性或audit row，不得签发cursor越过未rehydrate item，不得把input cursor原样当next cursor。
signature/key rotation与retention数值由正式`04`/Step 14 owner提供；本节只要求cursor可接受期不长于对应immutable generation
的可重读期。没有真实config value时不得伪造TTL、key id或digest。

### 82.4 Page branch matrix

| branch | generation rule | anchor/order rule | legal result |
|---|---|---|---|
| first | 在caller snapshot中选择exact selector的一个committed immutable generation | `after=None`；从generation第一项开始 | non-empty complete/degraded page，或complete empty proof |
| continued | exact恢复cursor generation；不得选择current | 第一候选必须严格`> after`；selector与limit全等 | non-empty complete/degraded page；generation unavailable为typed error |
| terminal complete | index证明returned last key后无selected item | `next_cursor=None`、`has_more=false` | non-empty terminal page，或first complete empty |
| safe-prefix gap | generation有效，但首个未完成item的required channel暂不可读 | 只返回gap之前完整items；next cursor停在最后完整item | prefix非空=`Degraded`；prefix空=`Unavailable` |
| invalid empty continuation | prior cursor声称仍有后续，但same generation在`after`后无item | immutable chain不成立 | integrity error；不得映`Empty`或重置first |

## 83. F5-A Bounded Page Index Source 与 Complete Empty Proof

### 83.1 Index entry 与 bounded source

```rust
/// audit subject index中不含body的ordered immutable entry。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTracePageIndexEntry {
    selector_subject_ref: SandboxTraceSubjectRef,
    trace_kind: SandboxAuditTraceKind,
    order_key: SandboxAuditTraceOrderKey,
}

impl SandboxAuditTracePageIndexEntry {
    /// 校验entry subject/filter/order key；不把entry视为rehydrated audit item。
    pub fn try_from_committed_index(
        selector: &SandboxAuditTracePageSelector,
        selector_subject_ref: SandboxTraceSubjectRef,
        trace_kind: SandboxAuditTraceKind,
        order_key: SandboxAuditTraceOrderKey,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn order_key(&self) -> &SandboxAuditTraceOrderKey;
    pub fn trace_ref(&self) -> &SandboxAuditTraceRef;
}

/// 一个selector/generation下的bounded index读取结果；items仍只是rehydration keys。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTraceBoundedIndexSource {
    selector: SandboxAuditTracePageSelector,
    subject_scope: SandboxAuditSubjectScopeResolution,
    generation: SandboxAuditSubjectIndexGeneration,
    subject_audit_relation_count: u64,
    selected_entry_count: u64,
    entries: Vec<SandboxAuditTracePageIndexEntry>,
    has_more_after_entries: bool,
}

impl SandboxAuditTraceBoundedIndexSource {
    /// 从一个complete subject index aggregate和同generation bounded entries构造checked source。
    pub fn try_from_complete_index(
        request: &SandboxAuditTracePageReadRequest,
        subject_scope: SandboxAuditSubjectScopeResolution,
        generation: SandboxAuditSubjectIndexGeneration,
        subject_audit_relation_count: u64,
        selected_entry_count: u64,
        entries: Vec<SandboxAuditTracePageIndexEntry>,
        has_more_after_entries: bool,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn selector(&self) -> &SandboxAuditTracePageSelector;
    pub fn subject_scope(&self) -> &SandboxAuditSubjectScopeResolution;
    pub fn generation(&self) -> &SandboxAuditSubjectIndexGeneration;
    pub fn subject_audit_relation_count(&self) -> u64;
    pub fn selected_entry_count(&self) -> u64;
    pub fn entries(&self) -> &[SandboxAuditTracePageIndexEntry];
    pub fn has_more_after_entries(&self) -> bool;
}
```

constructor要求：entry数不超过`limit + 1`；严格按order key递增且trace ref唯一；每项subject和optional kind filter匹配；
`selected_entry_count`来自同一generation的complete aggregate，不由当前页长度推算；`Bound` relation是任一non-empty
entry的前置条件。`subject_audit_relation_count`必须与subject scope proof中的complete reverse count相等；filter为`None`时
`selected_entry_count == subject_audit_relation_count`，filter为`Some(kind)`时
`selected_entry_count <= subject_audit_relation_count`。任何count小于本页matching entry数、`has_more=false`却消费不完
selected aggregate、continued anchor不属于同generation或`ExactAbsent`携non-zero count/entry均返回`IndexIntegrityInvalid`。
adapter不得对返回entries排序/去重来掩盖index corruption。

### 83.2 Complete empty-page proof

```rust
/// GetSandboxAuditTrace可映射Empty的唯一same-generation proof。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTraceEmptyPageProof {
    selector: SandboxAuditTracePageSelector,
    subject_scope: SandboxAuditSubjectScopeResolution,
    generation: SandboxAuditSubjectIndexGeneration,
    selected_entry_count: u64,
    anchor_position: SandboxAuditTracePagePosition,
    page_limit: SandboxAuditTracePageLimit,
}

impl SandboxAuditTraceEmptyPageProof {
    /// 只接受first anchor、complete subject resolution和selected aggregate count=0。
    pub fn try_from_complete_indexes(
        request: &SandboxAuditTracePageReadRequest,
        subject_scope: SandboxAuditSubjectScopeResolution,
        generation: SandboxAuditSubjectIndexGeneration,
        selected_entry_count: u64,
        returned_entry_count: u32,
        has_more: bool,
    ) -> Result<Self, SandboxAuditTracePageReadError>;
}
```

proof的机械条件为：request position=`First`；selector/fingerprint/generation关系完整；subject resolution为合法`Bound`或
全零`ExactAbsent`；selected aggregate=`0`；returned count=`0`；`has_more=false`；typed gap=`0`。kind filter存在时，
selected aggregate只统计matching kind，但subject-scope proof仍覆盖原subject。以下均不能构造proof：continued空页、
aggregate不可读、repository `NotFound`、subject count未知、index timeout、存在orphan entry、prefix在gap前恰好为空。

| observed condition | outcome implication | reason |
|---|---|---|
| known subject + selected count 0 | `Empty` | 对该optional filter完整证明无matching trace。 |
| exact subject absent + all subject/audit reverse relation 0 | `Empty` | permitted scope内没有subject，也没有悬挂audit。 |
| subject absent但audit relation非0 | `Err` | orphan/half-commit，不能伪装empty。 |
| selected count非0但page entries为空 | `Err` | page/index chain损坏，不能伪装empty或terminal continuation。 |
| selected aggregate暂不可读 | typed gap / `Unavailable` | 尚未证明不存在。 |

### 83.3 First-batch static check

以下只是设计文本静态闭合，不是编译、测试、run、evidence或验收结果：

| check | result |
|---|---:|
| closed selector fields | `3/3`：context、subject、optional kind |
| subject resolution branches | `2/2`：Bound、ExactAbsent |
| page anchor branches | `2/2`：First、Continued |
| cursor logical bindings | `5/5`：family、fingerprint、generation、last key、limit |
| stable order tuple | `2/2`：source truth cursor、trace ref |
| complete empty proof conditions | `7/7`：first、selector、scope、generation、aggregate zero、returned zero、terminal/no-gap |
| public/application cursor duplication | `0`；复用`PageRequest`、`SandboxRepositoryCursor`、`SandboxQueryPageInfo` |
| Query write/business audit/external call | `0/0/0` |
| new L1/L2 blocker | `0`；既有`READ-001`、`OUTCOME-001`继续开放 |

F5-A尚未完成：下一批必须补typed gap、safe-prefix page source、逐item canonical rehydration、closed outcome、named reader、
facade mapping和zero-write self-check。正式`03-详细设计.md`继续冻结。

## 84. F5-A Typed Gap 与 Safe-prefix Page Source

### 84.1 Gap kind、position 与有限集合

F5-A只允许把“required read channel暂时不可访问，且尚未观测到确定损坏”表达为successful typed gap。每次page读取遇到
第一个gap立即停止，因此current gap set恰好包含一项；使用set carrier是为了与既有Query reason mapping一致，不授权
reader越过首个gap继续收集。

```rust
/// audit page读取中可安全表达为temporary no-proof的有限channel。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxAuditTracePageReadGapKind {
    /// required context/subject owner relation channel暂不可访问。
    SubjectScope,
    /// immutable subject-index generation或selected aggregate暂不可访问。
    SubjectIndex,
    /// 一个已选index entry的exact audit wire row channel暂不可访问。
    AuditRow,
    /// source fact、subject anchors或committed cursor group暂不可访问。
    SourceBinding,
    /// body-free material owner snapshot channel暂不可访问。
    MaterialSnapshot,
}

/// gap发生于page起点或一个exact blocked order key。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxAuditTracePageGapPosition {
    BeforeFirstItem,
    At(SandboxAuditTraceOrderKey),
}

/// 一个caller-safe、generation-bound audit page read gap。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTracePageReadGap {
    kind: SandboxAuditTracePageReadGapKind,
    selector_fingerprint: SandboxAuditTraceSelectorFingerprint,
    index_generation: Option<SandboxAuditSubjectIndexGeneration>,
    position: SandboxAuditTracePageGapPosition,
    reason: SandboxReason,
}

impl SandboxAuditTracePageReadGap {
    /// 仅从已脱敏temporary channel failure构造；不接受NotFound或integrity cause。
    pub fn try_from_temporary_channel(
        kind: SandboxAuditTracePageReadGapKind,
        selector_fingerprint: SandboxAuditTraceSelectorFingerprint,
        index_generation: Option<SandboxAuditSubjectIndexGeneration>,
        position: SandboxAuditTracePageGapPosition,
        reason: SandboxReason,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn kind(&self) -> SandboxAuditTracePageReadGapKind;
    pub fn position(&self) -> &SandboxAuditTracePageGapPosition;
    pub fn reason(&self) -> &SandboxReason;
}

/// current reader遇到首个temporary channel failure后形成的exact-one gap set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTracePageReadGapSet(SandboxAuditTracePageReadGap);

impl SandboxAuditTracePageReadGapSet {
    pub fn try_single(
        gap: SandboxAuditTracePageReadGap,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn first(&self) -> &SandboxAuditTracePageReadGap;
    pub fn to_query_reason_set(&self) -> Result<SandboxReasonSet, SandboxAuditTracePageReadError>;
}
```

gap shape固定如下：`SubjectScope/SubjectIndex`可使用`BeforeFirstItem`；`AuditRow/SourceBinding/MaterialSnapshot`必须使用
`At(exact index order key)`并携matching generation。reason必须来自application fixed safe catalog或repository已脱敏
availability reason，不能包含context/subject/trace ref、cursor、source fact、path、host、SQL、raw provider error、audit
reason/body或secret。`to_query_reason_set`只做同序safe conversion，不解析reason文本。

### 84.2 Gap 与 integrity 的不可混淆矩阵

| observation | typed gap allowed | required disposition |
|---|---:|---|
| channel timeout/unavailable，未返回row/not-found/corruption事实 | yes | stop at first gap；按prefix有无返回Degraded或Unavailable。 |
| exact index entry存在，但audit row明确`NotFound` | no | `PersistenceBundleIntegrityInvalid`；half-commit。 |
| row存在，但source proof/material sidecar明确缺失 | no | `PersistenceBundleIntegrityInvalid`；不得row-only fallback。 |
| duplicate row/index/source relation，wrong subject/context/kind/owner | no | `SubjectRelationIntegrityInvalid`或`IndexIntegrityInvalid`。 |
| malformed row、cursor/time mismatch、status非Linked、forbidden body | no | `SourceContractInvalid`或`PersistenceBundleIntegrityInvalid`。 |
| cursor generation已过retention/无法恢复 | no successful gap | `CursorSnapshotUnavailable` error；不得重开current generation。 |
| issue/encode continuation失败 | no | reader/application error；不得把完整items包装为terminal page。 |

`RepositoryUnavailable`只有在adapter尚未取得确定row/index事实时才能转为gap；一旦同一次snapshot已证明entry存在并得到
明确`NotFound`、duplicate或wrong-owner结果，就必须fail closed。fake必须能分别注入temporary unavailable与known missing，
不得把二者都实现成`Option::None`。

### 84.3 Checked page source

```rust
/// 已完整rehydrate的一页immutable audit records及其same-generation continuation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAuditTracePageSource {
    selector: SandboxAuditTracePageSelector,
    generation: SandboxAuditSubjectIndexGeneration,
    items: Vec<SandboxAuditTrace>,
    item_order_keys: Vec<SandboxAuditTraceOrderKey>,
    page_info: SandboxQueryPageInfo,
    gaps: Option<SandboxAuditTracePageReadGapSet>,
}

impl SandboxAuditTracePageSource {
    /// 构造无gap的non-empty complete page。
    pub fn try_complete(
        request: &SandboxAuditTracePageReadRequest,
        generation: SandboxAuditSubjectIndexGeneration,
        items: Vec<SandboxAuditTrace>,
        item_order_keys: Vec<SandboxAuditTraceOrderKey>,
        page_info: SandboxQueryPageInfo,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    /// 构造首个temporary gap之前的non-empty stable prefix；必须可从最后完整item重试blocked item。
    pub fn try_degraded_prefix(
        request: &SandboxAuditTracePageReadRequest,
        generation: SandboxAuditSubjectIndexGeneration,
        items: Vec<SandboxAuditTrace>,
        item_order_keys: Vec<SandboxAuditTraceOrderKey>,
        page_info: SandboxQueryPageInfo,
        gaps: SandboxAuditTracePageReadGapSet,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn items(&self) -> &[SandboxAuditTrace];
    pub fn page_info(&self) -> &SandboxQueryPageInfo;
    pub fn gaps(&self) -> Option<&SandboxAuditTracePageReadGapSet>;
    pub fn is_degraded(&self) -> bool;

    /// 消费checked page source并返回owned items/page info/gap，供facade在close snapshot前完成装配。
    pub fn into_parts(
        self,
    ) -> (
        Vec<SandboxAuditTrace>,
        SandboxQueryPageInfo,
        Option<SandboxAuditTracePageReadGapSet>,
    );
}
```

两个factory共同执行以下机械检查：

1. `items.len() == item_order_keys.len() == page_info.returned_count()`，且`1..=request.page_limit`；空items不进入source。
2. 每个item已经`is_linked()==true`，其subject与selector全等，optional kind filter匹配，且
   `SandboxAuditTraceOrderKey(item.source_truth_cursor(), item.trace_ref())`与对应key逐字段相等。
3. order key严格递增，trace ref全页唯一；continued页第一个key严格大于anchor `after`。
4. complete nonterminal page要求`has_more=true/next_cursor=Some`且cursor绑定最后item；complete terminal要求
   `has_more=false/next_cursor=None`。
5. degraded prefix要求exact-one gap位于最后完整key之后的首个blocked index key，`has_more=true`且next cursor严格停在
   最后完整key；不得签发越过blocked key的cursor。
6. gaps为空时reasons必须在facade保持空；gaps存在时只能映`Degraded`并使用gap-set reason，不能借canonical audit reason
   解释read degradation。

safe-prefix示例的机械效果为：index keys=`K1,K2,K3,K4`，`K1/K2`完整，`K3` source channel临时不可访问，则本页只返回
`K1/K2`，next cursor的after=`K2`，gap position=`At(K3)`；`K4`不读取、不返回。下一次续页仍从`>K2`开始，因此不会
跳过`K3`。若`K1`即gap，items为空且不能构造page source，只能返回`Unavailable`。

## 85. F5-A Canonical Per-item Rehydration

### 85.1 不可重排的读取与factory顺序

对bounded index source中最多`limit`个candidate，reader必须逐项完成下列顺序；任一item未通过最后一步均不能进入page
items，也不能成为next cursor anchor：

```text
SandboxAuditTracePageIndexEntry(trace_ref, kind, truth_cursor)
  -> read exact SandboxAuditPersistenceRow by trace_ref in the same generation/snapshot
  -> verify row trace_ref/subject/kind/source_truth_cursor == index entry/selector
  -> read exact source fact + subject + committed cursor owner group
  -> normalize owner group to one closed SandboxAuditRelationBasis
  -> SandboxAuditRelationProof::try_new(...)
  -> AuditMaterialSourceSnapshot::try_from_committed_source(...)
  -> SandboxAuditSourceBinding::from_committed_source(...)
  -> SandboxAuditPersistenceBundle::try_new(row, source_binding, material_snapshot)
  -> bundle.into_rehydration_input()
  -> SandboxAuditTrace::rehydrate(input)
  -> verify Linked/body-free/order key/selector relation
  -> append the complete immutable item to the stable prefix
```

| check | canonical source | temporary channel handling | known-invalid handling |
|---|---|---|---|
| wire row | exact trace ref in selected generation | `AuditRow` gap | missing/duplicate/malformed=`Err` |
| subject/kind/order | index entry + selector + wire row | no gap after values are present | any mismatch=`Err` |
| source lineage | exact owning source group and Step 6 closed relation basis | `SourceBinding` gap | missing/wrong owner/partial tuple=`Err` |
| material | same source group body-free material snapshot | `MaterialSnapshot` gap | missing expected sidecar/forbidden body/mismatch=`Err` |
| cursor/time/status | Step 6 rehydration | no gap after complete data is present | noncommitted cursor、time inversion、non-Linked=`Err` |
| final item key | rehydrated item getters | none | key mismatch/nonmonotonic/duplicate=`Err` |

`SandboxAuditPersistenceRow`、`SandboxAuditRelationProof`、`AuditMaterialSourceSnapshot`、`SandboxAuditSourceBinding`、
`SandboxAuditPersistenceBundle`和`SandboxAuditRehydrationInput`全部复用Step 6唯一owner；F5-A不复制字段，不增加
`From<Row>`/`Into<Trace>`捷径。Relay item也走同一pipeline，但relation basis必须额外验证original source cursor、event kind、
relay row recorded time和subject；publisher feedback或relay status不能替代original source proof。

### 85.2 Body-free 与安全红线

成功item只允许Step 6 audit object已有的typed refs、closed kind、body-free actor/reason/material summary、trace context、truth
cursor和canonical time。以下任一内容在wire/source/material中出现均是integrity error，不是可展示的degraded body：raw
request/event/SDK/log/metric/trace payload、artifact/evidence正文或真实alias、filesystem path、URL、host/process/network detail、
tool/runtime response、investigation正文、secret、SQL/driver error或stack trace。

audit query不读取observability store。`AuditMaterialRefSet`中的observability/material ref只是已提交body-free linkage；本reader
不得解引用material body、确认artifact真实性、生成evidence alias或把日志当audit正文。它也不执行审查、异常处置、测试或
交付，只把既有immutable business linkage按权限有界展示。

## 86. F5-A Closed Outcome、Named Reader 与 Surface Mapping

### 86.1 Closed successful outcome

```rust
/// GetSandboxAuditTrace在一个fair committed read中的成功闭集。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxAuditTracePageLookupOutcome {
    /// non-empty complete或safe-prefix degraded page。
    Page(SandboxAuditTracePageSource),
    /// first page的完整selected-index零证明。
    Empty(SandboxAuditTraceEmptyPageProof),
    /// 首个required channel在任何item完成前暂不可访问。
    Unavailable {
        selector: SandboxAuditTracePageSelector,
        gaps: SandboxAuditTracePageReadGapSet,
    },
}

impl SandboxAuditTracePageLookupOutcome {
    pub fn page(
        source: SandboxAuditTracePageSource,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn empty(
        request: &SandboxAuditTracePageReadRequest,
        proof: SandboxAuditTraceEmptyPageProof,
    ) -> Result<Self, SandboxAuditTracePageReadError>;

    pub fn unavailable(
        request: &SandboxAuditTracePageReadRequest,
        gaps: SandboxAuditTracePageReadGapSet,
    ) -> Result<Self, SandboxAuditTracePageReadError>;
}
```

`Page`拒绝空items；`Empty`要求proof selector/anchor/limit与request全等；`Unavailable`要求gap发生在
`BeforeFirstItem`或request本页首个blocked key且没有任何已返回item。technical error、known missing/corruption或invalid
cursor不能放入任何success branch。

### 86.2 Named reader port

```rust
/// immutable audit trace bounded page的application-owned只读source port。
pub trait SandboxAuditTracePageReader: Send + Sync {
    /// 在caller提供的一个fair committed snapshot中读取exact subject/generation page。
    async fn read_sandbox_audit_trace_page(
        &self,
        request: &SandboxAuditTracePageReadRequest,
        snapshot: &mut dyn SandboxCommittedReadSnapshot,
    ) -> Result<SandboxAuditTracePageLookupOutcome, SandboxAuditTracePageReadError>;
}
```

reader逻辑顺序固定为：

```text
validated permitted request
  -> select first or exact continued immutable index generation
  -> read subject/context resolution and complete selected-entry aggregate
  -> first aggregate zero: build SandboxAuditTraceEmptyPageProof
  -> otherwise read ordered bounded index keys (limit + one lookahead maximum)
  -> sequentially rehydrate at most limit complete bundles
     -> complete page: issue next cursor iff lookahead proves more
     -> first temporary gap after prefix: stop, never read later keys
     -> known missing/corrupt/wrong owner: Err
  -> build Page / Empty / Unavailable
  -> return without opening/closing snapshot or any write
```

`read_sandbox_audit_trace_page`是唯一current audit Query reader。旧
`list_audit_traces_by_subject(..., SandboxRepositoryPage, SandboxUnitOfWork)`不得保留为内部delegate，因为其参数能力、page
shape和row completeness都不满足current contract。durable与fake在F5-J实现同一具名method及调用记录，不允许generic
`read(kind, selector)`或按route选择repository。

### 86.3 Outcome 到 facade surface

| reader outcome | application result | items | page info / reasons |
|---|---|---:|---|
| complete `Page(source)` | `Visible` | non-empty完整items | source page info；reasons empty |
| safe-prefix `Page(source)` | `Degraded` | non-empty完整prefix | `has_more=true`且cursor停在最后完整item；reasons来自gap set |
| `Empty(proof)` | `Empty` | empty | `returned=0,has_more=false,next=None`；reasons empty |
| `Unavailable { gaps }` | `Unavailable` | empty | zero terminal page info；non-empty safe reasons |
| request/cursor/snapshot/integrity `Err` | application error | none | 不构造`SandboxAuditTraceQueryResult` success |

本节收紧现有 `SandboxAuditTraceQueryResult` constructor语义：`with_items`只允许`Visible | Degraded`，且items必须non-empty；
`Restricted/Stale/Rebuilding`不得携audit items。`empty`只消费本节proof映射后的zero page info；`no_items`只服务
`NotVisible | Restricted | Unavailable`。access `NotVisible`仍body/reason为空，Restricted/Unavailable使用既有safe reason
规则。immutable audit page没有`Stale`业务分支；generation过期是cursor error，不是stale items许可。

### 86.4 Access-first snapshot lifecycle

```text
GetSandboxAuditTraceInput + SandboxServiceCallContext
  -> pure context/subject/filter/page shape validation
  -> subject-level SandboxQueryAccessDecision
     -> NotVisible | Restricted | access Unavailable:
          return no-item access surface; cursor decode=0, open=0, reader=0, close=0
     -> Permitted:
          SandboxAuditTracePageSelector::try_from_input(...)
          -> audit cursor codec decode_after_permitted(...)
          -> SandboxAuditTracePageReadRequest::try_from_permitted(...)
          -> open one SandboxCommittedReadSnapshot
          -> read_sandbox_audit_trace_page(...)
          -> own items/page info/gaps before close
          -> close the same snapshot exactly once
          -> close failure overrides unreturned result with PortUnavailable
          -> emit at most one low-cardinality redacted diagnostic hook
          -> return Visible/Degraded/Empty/Unavailable
```

snapshot close后不得读取借用row或重新issue cursor；reader outcome必须先转换为owned source/result。close失败不重读、不切换
generation、不追加business audit。diagnostic hook只可记录operation、query kind、surface category、gap/error class、page
position和returned-count bucket，不记录exact context/subject/trace ref、kind filter、cursor、audit reason/material或raw error。

## 87. F5-A Finite Error、No-write 与阶段完成门

### 87.1 F5-A finite reader error

```rust
/// audit bounded page request/codec/read/rehydration的有限错误；不携raw body或provider cause。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxAuditTracePageReadError {
    QueryKindMismatch,
    AccessDecisionContextMismatch,
    FullReadNotPermitted,
    SelectorMismatch,
    InvalidPageRequest,
    CursorCorrupt,
    CursorSelectorMismatch,
    CursorLimitMismatch,
    CursorSnapshotUnavailable,
    PageLimitInvalid,
    ReadSnapshotUsageInvalid,
    ReadSnapshotUnavailable { reason: SandboxReason },
    RepositoryUnavailable { reason: SandboxReason },
    RepositoryFailed { reason: SandboxReason },
    SubjectRelationIntegrityInvalid,
    IndexIntegrityInvalid,
    PageOrderIntegrityInvalid,
    PersistenceBundleIntegrityInvalid,
    SourceContractInvalid,
    ReadGapShapeInvalid,
    EmptyProofInvalid,
    LookupOutcomeInvalid,
    NoWriteViolation,
}
```

该enum固定`23/23` variants。F5-J负责与F5-R error、application detail和fake call error做穷尽join；F5-A先固定分类边界：

| error family | application disposition | prohibited conversion |
|---|---|---|
| query/access/selector/page/limit mismatch | query access/input error | first fallback、Empty、Unavailable success |
| cursor corrupt/family/limit mismatch | invalid page request | 忽略cursor、按last truth cursor继续 |
| cursor generation unavailable | page cursor expired/unavailable error | current generation近似续页、Stale items |
| read snapshot/repository unavailable error | `PortUnavailable` | absence、business failure、read gap伪造 |
| repository failed与八项integrity/shape/outcome error | internal invariant/integrity error | 丢坏row、Degraded、Unavailable、Empty |
| no-write violation | `NoWriteViolation` | rollback后继续返回success |

`RepositoryUnavailable`与successful typed gap的区别由adapter事实边界决定：无法开始/维持fair snapshot或无法读取generation
本身时返回error；已在有效generation中读取ordered page、某个item required subchannel暂不可访问时构造gap。mapper不解析
`Display`，不使用wildcard，不把raw cause写入reason。

### 87.2 Query zero-write 与非主体边界

| action/capability | expected count | F5-A rule |
|---|---:|---|
| begin/write/commit/rollback UoW、save/CAS | `0` | 只借用caller committed read snapshot。 |
| audit/relay/view/stored/idempotency identity allocation | `0` | 所有identity来自已提交index/row；cursor codec不是business id allocator。 |
| truth/reference cursor allocation | `0` | 只读取existing source truth cursor作为order key组成部分。 |
| business audit append或read-audit | `0` | 本Query读取audit，不为读取本身制造新trace。 |
| row migration、sidecar repair、projection/reconciliation rebuild | `0` | known corruption直接Err，交独立owner。 |
| tool/runtime/backend/resolver/capture/handoff/investigation port | `0` | 不触发Sandbox主体、外部调用或语义执行。 |
| failure/control/cleanup/lease/reaper/redline transition | `0` | audit observation不能升级为安全控制动作。 |
| observability/log/metric/evidence store read | `0` | 只读取body-free audit material refs。 |
| low-cardinality diagnostic hook | at most `1` | hook失败不改变结果、不重试reader。 |

既有九个`SandboxMaintenanceSelectionRepository` reader保持`9/9`独立，F5-A调用数=`0`。audit source producer、required
append、correction/migration、retention/reconciliation/quarantine各自由其显式Command/Consumer/Job/operations owner承担；
F5-A不把这些非主流程扩写成新的主体功能。

### 87.3 A2-F5-A static self-check

以下结论只来自当前设计文本静态审查，不是编译、真实测试、run、evidence或验收结果。

| check | result | closure rule |
|---|---:|---|
| Query selector | `1/1` | context + subject + optional closed kind；generic/opaque/latest=`0`。 |
| permitted request | `1/1` | access-first、typed anchor/limit；denied cursor decode=`0`。 |
| cursor binding | `5/5` | family、selector fingerprint、generation、last stable key、limit。 |
| page branches | `5/5` | first、continued、terminal、safe-prefix gap、invalid empty continuation。 |
| subject scope | `2/2` | Bound或complete ExactAbsent；wrong owner/orphan=`Err`。 |
| complete empty proof | `1/1` | first + same generation + complete zero aggregate + zero item + terminal + no gap。 |
| typed gap kinds | `5/5` | SubjectScope、SubjectIndex、AuditRow、SourceBinding、MaterialSnapshot。 |
| canonical item rehydration | `11/11` stages | index、row、row/index relation、source owner group、relation basis/proof、material、binding、bundle、input、rehydrate、final item。 |
| named reader method | `1/1` | `read_sandbox_audit_trace_page`；old UoW list/generic reader=`0` current。 |
| outcome/surface | `4/4` | complete=Visible、prefix=Degraded、proof=Empty、no-prefix gap=Unavailable；technical/integrity=Err。 |
| safe-prefix cursor | `1/1` | never crosses first gap；empty prefix carries no continuation。 |
| Query side effects | `0/0/0/0/0` | write/identity/business audit/external/observability-body read均为零。 |
| maintenance separation | `9/9` preserved | completed public Query use=`0/13`。 |
| new L1/L2 blocker | `0` | existing `READ-001`、`OUTCOME-001` continue open。 |

F5-A结论：第13个Query的application read seam已达到可直接落码粒度，provisional Query coverage推进到`13/13`，selector
variant coverage推进到`19/19`。这不表示整个F5完成，也不关闭`READ-001/OUTCOME-001`；下一内部任务仅允许
`A2-F5-J`补F5-R/A shared error映射、facade/fake/durable parity、static total audit和四层恢复同步。

## EOF Current Recovery Override: `7R-04A-A2-F5-A` completed, F5-J in progress

本节成为read artifact的物理EOF current authority。F5-A已完成静态设计闭合；当前只允许进入F5-J，不得启动A3/A4、
Step 8或正式`03-详细设计.md`回填。

| recovery item | current fact |
|---|---|
| completed internal tasks | `A2-F5-R` reconciliation exact reader；`A2-F5-A` audit bounded page reader |
| F5-A closure | selector/request `1/1`；cursor bindings `5/5`；gap kinds `5/5`；named reader `1/1`；outcome mapping `4/4` |
| current internal task | `A2-F5-J` shared join/static audit/recovery sync `in_progress` |
| query reader coverage | `13/13 provisional` |
| selector variant coverage | `19/19` for completed internal parts |
| maintenance separation | existing selection reader `9/9` preserved；public Query use=`0/13` |
| open blockers | `SBX-DDD-GRANULARITY-STEP7-READ-001`、`SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` |
| new L1/L2 blocker | `0` |
| formal/implementation truth | formal `03` unchanged；implementation/test/evidence/acceptance not started；no commit required |

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v6.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A2-F5 reconciliation/audit exact reader contracts in_progress
current_internal_task = A2-F5-J shared join/static audit/recovery sync
current_artifact = projects/L4-sandbox/design-calibration/03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_in_progress
batch_status = authorized_in_progress
a2_exact_reader_contracts = in_progress_4_of_5_families_completed
a2_f5_reconciliation_audit = in_progress_j
a2_f5_r_reconciliation = completed
a2_f5_a_audit = completed
a2_f5_j_shared_join = in_progress
query_inventory = 13/13_unique
query_reader_coverage = 13/13_provisional
selector_variant_coverage = 19/19_for_completed_internal_parts
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/13_completed_queries
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_allowed_action = write_A2-F5-J_shared_join_only
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 89. A2-F5-J2 Access-first Facade Lifecycle 与 Outcome Join

J2把F5两个reader接回`SandboxQueryService`已有exact callable。它只补facade装配边界，不增加reader source、授权策略、
public DTO或写路径。reconciliation和audit不能共用`read(kind, selector)`；允许共用的private helper仅限“消费已打开snapshot、
执行close并处理close precedence”，helper不得选择query kind、request factory、reader method或outcome mapper。

### 89.1 F5可见的具名access-decision seam

Step 6已经固定`SandboxQueryAccessDecision`，Step 7 §23已经要求13个Query先形成decision，但旧材料未给出可调用port名。
J2关闭F5需要的两个method；它们是共享`SandboxQueryAccessResolver`的具名slice，不是F5私有授权系统。A4仍须对13个Query
做完整method inventory，不能用一个接受opaque selector的generic resolver替代。

```rust
/// 在任何Sandbox target/index/body读取前形成no-write access decision的application port。
pub trait SandboxQueryAccessResolver: Send + Sync {
    /// 按exact report selector解析reconciliation report读取权限；不得读取report aggregate。
    async fn resolve_reconciliation_report_read_access(
        &self,
        context: &SandboxServiceCallContext,
        selector: &SandboxReconciliationReportSelector,
    ) -> ApplicationResult<SandboxQueryAccessDecision>;

    /// 按required context和closed subject/filter解析audit page读取权限；不得解码page token或probe audit index。
    async fn resolve_audit_trace_page_read_access(
        &self,
        context: &SandboxServiceCallContext,
        selector: &SandboxAuditTracePageSelector,
    ) -> ApplicationResult<SandboxQueryAccessDecision>;
}
```

两个method只能消费entry冻结的actor/request digest、fixed query kind和body-free typed selector。实现可读取prepared access
authority或独立authorization binding，但report row、report reverse index、subject existence、audit subject index、audit row、
page token/cursor和business body读取数固定为0。authorization dependency已知不可用时返回checked `Unavailable` decision；
权限不足或不得暴露存在性时返回`NotVisible`；当前没有restricted reader，`Restricted`只产生no-body surface。resolver内部
technical/integrity failure返回既有application error，不得fail-open、按ref文本猜scope或先读目标再决定权限。

facade需要机械读取decision状态与reason，因此Step 6 owner补齐以下只读getter；不增加字段或第二decision type：

```rust
impl SandboxQueryAccessDecision {
    /// 返回本decision固定的closed query kind。
    pub fn query_kind(&self) -> SandboxQueryKind;
    /// 返回access-only status；不得当作最终query surface写回。
    pub fn access_status(&self) -> SandboxQueryAccessStatus;
    /// 返回Restricted/Unavailable的ordered safe reasons；其它状态固定为空。
    pub fn reasons(&self) -> &SandboxReasonSet;
}
```

resolver返回后，facade必须检查`decision.query_kind()`和`decision.matches_context(context)`；不匹配走J1 error mapper。
`Permitted`还要求`permits_full_read()==true`、reasons为空和`requires_no_write()==true`。这些检查失败不能转NotVisible或
Unavailable，因为它们是wiring/shape错误，不是授权裁决。

### 89.2 Reconciliation reason的两个pure conversion

`Degraded` report的顶层reason只来自report中五通道coverage；reader `Unavailable`的reason只来自typed report read gaps。
finding reason、assembly failure reason、report status文本和repository error都不能替代这两个来源。

```rust
/// 将canonical report coverage按固定五通道顺序转换为Degraded query reasons。
pub trait SandboxReconciliationCoverageQueryReasonConversion {
    fn to_query_degraded_reason_set(
        &self,
    ) -> Result<SandboxReasonSet, SandboxReconciliationReportReadError>;
}

/// 将canonical exact-read gap set按声明顺序转换为Unavailable query reasons。
pub trait SandboxReconciliationReadGapSetQueryReasonConversion {
    fn to_query_unavailable_reason_set(
        &self,
    ) -> Result<SandboxReasonSet, SandboxReconciliationReportReadError>;
}
```

coverage conversion固定调用`as_ordered_refs()`，顺序为`Truth -> Projection -> Handoff -> Relay -> Derived`。它要求
`has_gap()==true`且`has_failed_channel()==false`，只复制`Partial | Unavailable` entry的`Some(reason)`；
`Complete | CompleteEmpty`必须无reason，`Failed`或gap entry缺reason返回`SourceContractInvalid`。结果必须non-empty且
ordered-unique；`SandboxReasonSet::try_non_empty`失败也归`SourceContractInvalid`，不得排序、去重或填默认文本。

read-gap conversion逐项复制`SandboxReconciliationReportReadGapSet::as_slice()`中的reason，保持
`ReportAggregate -> FindingAggregate -> AuditLinkage -> ScopeDigestVerification -> ReverseIndexCoverage ->
RepositorySnapshot`声明顺序。空、重复、乱序或unsafe reason返回`ReadGapShapeInvalid`。两个conversion都是pure；repository、
clock、config、access resolver、writer、diagnostic和business audit调用数均为0。

### 89.3 Shared snapshot close precedence

两个facade在open成功后都先形成owned `pending: ApplicationResult<T>`，再消费同一个snapshot。该private helper可以泛型化
返回值，但不能接收query kind、selector、reader或route：

```rust
async fn finish_committed_query_read<T>(
    manager: &dyn SandboxCommittedReadManager,
    snapshot: Box<dyn SandboxCommittedReadSnapshot>,
    pending: ApplicationResult<T>,
) -> ApplicationResult<T>;
```

helper固定先调用`manager.close(snapshot).await`一次。close成功才返回`pending`；close失败无论pending是success还是reader/
mapping error，都以`ApplicationErrorDetail::PortUnavailable`覆盖尚未返回结果，只消费close error中的safe reason，不暴露
`snapshot_ref`。不得重读、打开第二snapshot、把close failure解释为commit-unknown或把已提交truth回滚。open失败没有handle，
close count为0：`SandboxReadSnapshotError::Unavailable`映`PortUnavailable`；`InvalidBinding`映
`InternalInvariantViolation`并使用fixed integrity reason。

### 89.4 `get_sandbox_reconciliation_report` exact flow

```text
validate ctx = ApiQuery + GetSandboxReconciliationReport operation + no idempotency
  -> pure validate input.selector = exact SandboxReconciliationReportSelector
  -> resolve_reconciliation_report_read_access(ctx, selector) exactly once
     -> NotVisible: SandboxQueryResult::not_visible(); request/open/read/close=0
     -> Restricted: SandboxQueryResult::restricted(decision.reasons); request/open/read/close=0
     -> Unavailable: SandboxQueryResult::no_body(Unavailable, decision.reasons); request/open/read/close=0
     -> Permitted:
          SandboxReconciliationReportReadRequest::try_from_permitted(...) exactly once
          -> SandboxCommittedReadManager::open exactly once
          -> read_sandbox_reconciliation_report_source(request, snapshot) exactly once
          -> exhaustive owned outcome mapping
          -> finish_committed_query_read(manager, same snapshot, pending) exactly once
          -> at most one redacted diagnostic hook
```

| reader outcome | mandatory facade check | exact final factory |
|---|---|---|
| `Report(report)` + `Clean` | `can_claim_clean=true`、coverage complete、finding empty | `SandboxQueryResult::visible(report)` |
| `Report(report)` + `IssuesFound` | coverage complete、finding non-empty | `SandboxQueryResult::visible(report)` |
| `Report(report)` + `Degraded` | checked coverage存在、has gap、无Failed channel；pure conversion non-empty | `SandboxQueryResult::degraded(report, coverage reasons)` |
| `Report(report)` + `Failed` | canonical failed coverage或assembly failure；report已完整rehydrate | `SandboxQueryResult::visible(report)`；顶层reason为空 |
| `ExactAbsent(proof)` | proof selector与request selector全等，六项cardinality完整全零 | `SandboxQueryResult::empty()` |
| `Unavailable { selector, gaps }` | selector与request全等，gap set non-empty/canonical | `SandboxQueryResult::no_body(Unavailable, gap reasons)` |
| reader/mapping `Err` | J1 `20/20` mapper | application error；body=None |

facade不调用scope verifier、report factory、reconciliation job或finding assembler；它只消费已rehydrate report。特别是
business `Failed` report不能映`SandboxQueryResult::no_body(Failed, ...)`，因为这会丢失immutable failure body；本次reader
technical failure也不能伪装成business Failed report。

### 89.5 `get_sandbox_audit_trace` exact flow

audit access阻断也必须返回结构合法但不宣称业务empty的page metadata。facade统一用
`SandboxQueryPageInfo::try_new(0, false, None)`形成owned zero-terminal page info；最终surface status区分NotVisible、
Restricted、Unavailable与经过proof的Empty。

```text
validate ctx = ApiQuery + GetSandboxAuditTrace operation + no idempotency
  -> SandboxAuditTracePageSelector::try_from_input(input) pure; page token仍未解码
  -> resolve_audit_trace_page_read_access(ctx, selector) exactly once
     -> NotVisible: no_items(NotVisible, zero page, empty reasons); decode/open/read/close=0
     -> Restricted: no_items(Restricted, zero page, decision.reasons); decode/open/read/close=0
     -> Unavailable: no_items(Unavailable, zero page, decision.reasons); decode/open/read/close=0
     -> Permitted:
          cursor_codec.decode_after_permitted(selector, input.page_request, validated ceiling) exactly once
          -> SandboxAuditTracePageReadRequest::try_from_permitted(...) exactly once
          -> SandboxCommittedReadManager::open exactly once
          -> read_sandbox_audit_trace_page(request, snapshot) exactly once
          -> consume outcome/page source into owned parts
          -> finish_committed_query_read(manager, same snapshot, pending) exactly once
          -> at most one redacted diagnostic hook
```

| reader outcome | mandatory facade check | exact final factory |
|---|---|---|
| complete `Page(source)` | `is_degraded=false`、gaps=None、items non-empty、page info exact | `SandboxAuditTraceQueryResult::with_items(Visible, items, page, empty reasons)` |
| safe-prefix `Page(source)` | `is_degraded=true`、exact-one gap、items non-empty、cursor停在last complete item | `with_items(Degraded, items, page, gap reasons)` |
| `Empty(proof)` | request First、matching selector/generation/limit、complete zero proof | `SandboxAuditTraceQueryResult::empty(zero terminal page)` |
| `Unavailable { selector, gaps }` | matching selector、items=0、gap before first completed item | `no_items(Unavailable, zero terminal page, gap reasons)` |
| reader/mapping `Err` | J1 `23/23` mapper | application error；items/page body不返回 |

`SandboxAuditTracePageSource::into_parts()`必须在close前消费source；facade不重新排序/去重items，不重新签发cursor，也不调用
`encode_public`。application-local cursor到public `PageToken`的编码仍属于Step 8 entry mapper。`Empty` proof和access early-return
虽然都使用zero-terminal page info，但前者surface=`Empty`且发生完整business index read，后者不得读index；两者不能合并。

### 89.6 Diagnostic、side-effect与failure precedence

两个facade每次调用最多发一个低基数diagnostic hook。允许字段只有fixed operation、query kind、access/final surface category、
first/continued page class、returned-count bucket、gap/error class和open/read/close phase；禁止exact ref、context/subject、kind
filter、report/finding/audit body、reason正文、cursor/token、generation、snapshot ref、scope digest、path/host/process/network、
SQL/driver/raw cause或secret。hook失败不改变success/error，不重试resolver/reader，也不追加business audit。

failure precedence固定为：pure validation或access resolver error > access early surface；Permitted后request/codec error发生在open前；
open error无close；open成功后reader/mapping形成pending；close error覆盖pending。任何分支的write UoW、CAS、identity/truth cursor
allocation、report/audit append、reconciliation run/repair、observability body read、external/tool/runtime/backend/capture/handoff、
cleanup/reaper/redline transition调用数均为0。

### 89.7 J2 static self-check

以下是设计文本计数，不是实现、编译、测试、run、evidence或验收结果。

| J2 check | result | closure rule |
|---|---:|---|
| exact facade methods | `2/2` | existing reconciliation/audit `SandboxQueryService` methods不新增alias。 |
| named access methods | `2/2` | report exact access与audit subject-page access；generic/opaque=`0`。 |
| denied access branches | `6/6` | 两facade各NotVisible/Restricted/Unavailable；target/index read=`0`。 |
| audit denied cursor decode | `0/3` | 三个denied branch均不解码token。 |
| permitted lifecycle | `2/2` | 每facade access=1、request=1、open=1、named reader=1、close=1。 |
| reconciliation success mapping | `6/6` | Clean、IssuesFound、Degraded、Failed、ExactAbsent、Unavailable全覆盖。 |
| audit success mapping | `4/4` | complete、safe-prefix、Empty proof、no-prefix gap全覆盖。 |
| pure reason conversion | `3/3` | coverage、report gaps、audit gaps均有唯一同序owner。 |
| close precedence | `2/2` | close failure覆盖pending；second snapshot/read=`0`。 |
| Query write / identity / business audit / external / body-store read | `0/0/0/0/0` | 两facade保持观察面。 |
| new L1/L2 blocker | `0` | local access callable gap已在J2闭合；既有READ-001/OUTCOME-001继续开放。 |

J2完成；下一内部任务只允许`A2-F5-J3`补durable/fake的method、checked request、snapshot ref、outcome/error parity。
J3/J4尚未完成，A3/A4、Step 8和正式`03-详细设计.md`回填仍禁止。

## J2 Content Completion Marker: superseded by physical EOF recovery override

本节成为read artifact物理EOF current authority。F5-R、F5-A、J1、J2已完成；当前只推进J3 durable/fake parity。

```text
current_internal_task = A2-F5-J3 durable/fake parity
a2_f5_j1_error_mapping = completed
a2_f5_j2_facade_lifecycle = completed
a2_f5_j3_durable_fake_parity = in_progress
a2_f5_j4_static_audit_sync = pending
query_reader_coverage = 13/13_provisional
selector_variant_coverage = 19/19_for_completed_internal_parts
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_allowed_action = write_A2-F5-J3_durable_fake_parity_only
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Recovery Override: `7R-04A-A2-F5-J2` completed, J3 in progress

本节是read artifact的物理EOF current authority。§89已经完成J2正文；其content completion marker位于§88之前是历史追加
位置，不覆盖本节恢复状态。F5-R、F5-A、J1、J2均已完成，当前只允许推进J3 durable/fake parity；J4、A3/A4、Step 8和
正式`03-详细设计.md`回填均未开始。

| recovery item | current fact |
|---|---|
| `A2-F5-R` | `[x]` reconciliation exact reader completed |
| `A2-F5-A` | `[x]` audit bounded page reader completed |
| `A2-F5-J1` | `[x]` finite errors and exhaustive mapping completed |
| `A2-F5-J2` | `[x]` access resolver、reason conversion、facade lifecycle and outcome join completed |
| `A2-F5-J3` | `[>]` durable/fake parity in progress |
| `A2-F5-J4` | `[ ]` static total audit and recovery sync pending |
| formal/implementation truth | formal `03` unchanged；implementation/test/evidence/acceptance not started；no commit required |

```text
current_internal_task = A2-F5-J3 durable/fake parity
a2_f5_j1_error_mapping = completed
a2_f5_j2_facade_lifecycle = completed
a2_f5_j3_durable_fake_parity = in_progress
a2_f5_j4_static_audit_sync = pending
query_reader_coverage = 13/13_provisional
selector_variant_coverage = 19/19_for_completed_internal_parts
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_allowed_action = write_A2-F5-J3_durable_fake_parity_only
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 88. A2-F5-J1 Finite Error 与 Application Mapping Join

F5-J1只闭合 reconciliation exact reader与audit bounded reader的技术错误边界。它不增加新的业务outcome、public DTO、
repository capability或diagnostic内容；`SandboxReconciliationReportLookupOutcome`与
`SandboxAuditTracePageLookupOutcome`仍分别拥有成功分支。两个reader error均为application-local carrier，不进入Step 6
domain registry、Step 8协议或persistence，也不得携带raw row、SQL/driver cause、path/host、cursor body、finding/audit body、
artifact/evidence正文、secret或external response。

### 88.1 Reconciliation reader finite error

```rust
/// exact reconciliation report request/read/rehydration的application-local有限错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxReconciliationReportReadError {
    QueryKindMismatch,
    AccessDecisionContextMismatch,
    FullReadNotPermitted,
    SelectorMismatch,
    ReadSnapshotUsageInvalid,
    ReadSnapshotUnavailable { reason: SandboxReason },
    RepositoryUnavailable { reason: SandboxReason },
    RepositoryFailed { reason: SandboxReason },
    IndexCardinalityIntegrityInvalid,
    OwnerRelationIntegrityInvalid,
    FindingSetIntegrityInvalid,
    AuditLinkageIntegrityInvalid,
    RelayRelationIntegrityInvalid,
    StoredResultRelationIntegrityInvalid,
    PersistenceBundleIntegrityInvalid,
    SourceContractInvalid,
    ReadGapShapeInvalid,
    AbsenceProofInvalid,
    LookupOutcomeInvalid,
    NoWriteViolation,
}
```

该enum固定`20/20` variants。六项index的count不另造六个错误：完整index aggregate不满足Step 6 cardinality进入
`IndexCardinalityIntegrityInvalid`；命中后的finding、audit、relay、stored-result relation分别进入其具名integrity variant；
row、scope/digest、cursor/time和bundle组装不完整进入`OwnerRelationIntegrityInvalid`、
`PersistenceBundleIntegrityInvalid`或`SourceContractInvalid`。scope digest verifier或required channel暂不可用且尚无已知
损坏时形成canonical typed gap成功分支；只有adapter无法开始/维持fair read时才使用availability error。

### 88.2 Reconciliation `20/20` exhaustive mapping

```rust
fn map_reconciliation_report_read_error(
    error: SandboxReconciliationReportReadError,
    reason_catalog: &SandboxQueryReadReasonCatalog,
    trace_context: Option<SandboxTraceContext>,
) -> ApplicationError;
```

| reader error | count | `ApplicationErrorDetail` | reason source / forbidden success |
|---|---:|---|---|
| `QueryKindMismatch` | 1 | `InvalidOperationMapping` | catalog `query_kind_mismatch`；不得读index。 |
| `AccessDecisionContextMismatch`, `FullReadNotPermitted`, `SelectorMismatch` | 3 | `QueryAccessShapeInvalid` | catalog `query_access_shape_invalid`；不得fallback scope/latest。 |
| `ReadSnapshotUnavailable`, `RepositoryUnavailable` | 2 | `PortUnavailable` | variant携带的已脱敏reason；不得映typed gap、Empty或Unavailable success。 |
| `ReadSnapshotUsageInvalid` | 1 | `InternalInvariantViolation` | catalog `read_snapshot_usage_invalid`；不得打开第二snapshot。 |
| `RepositoryFailed` | 1 | `InternalInvariantViolation` | variant携带的已脱敏reason；不得把non-temporary failure改成PortUnavailable。 |
| 11项integrity/shape/outcome variants | 11 | `InternalInvariantViolation` | catalog `read_integrity_invalid`；不得丢finding/row或返回business Failed report。 |
| `NoWriteViolation` | 1 | `NoWriteViolation` | catalog `query_no_write_violation`；不得rollback后继续success。 |

11项机械闭集为`IndexCardinalityIntegrityInvalid`、`OwnerRelationIntegrityInvalid`、`FindingSetIntegrityInvalid`、
`AuditLinkageIntegrityInvalid`、`RelayRelationIntegrityInvalid`、`StoredResultRelationIntegrityInvalid`、
`PersistenceBundleIntegrityInvalid`、`SourceContractInvalid`、`ReadGapShapeInvalid`、`AbsenceProofInvalid`和
`LookupOutcomeInvalid`，覆盖`11/11`。mapper必须直接对20个variant穷尽`match`，不得使用`_` arm、`Display`分类、raw cause
解析或`From<anyhow::Error>`。

### 88.3 Audit page `23/23` exhaustive mapping

```rust
fn map_audit_trace_page_read_error(
    error: SandboxAuditTracePageReadError,
    reason_catalog: &SandboxQueryReadReasonCatalog,
    trace_context: Option<SandboxTraceContext>,
) -> ApplicationError;
```

| reader error | count | `ApplicationErrorDetail` | reason source / forbidden success |
|---|---:|---|---|
| `QueryKindMismatch` | 1 | `InvalidOperationMapping` | catalog `query_kind_mismatch`；decode/open/read均为0。 |
| `AccessDecisionContextMismatch`, `FullReadNotPermitted`, `SelectorMismatch` | 3 | `QueryAccessShapeInvalid` | catalog `query_access_shape_invalid`；不得probe subject。 |
| `InvalidPageRequest`, `CursorCorrupt`, `CursorSelectorMismatch`, `CursorLimitMismatch`, `CursorSnapshotUnavailable`, `PageLimitInvalid` | 6 | `QueryAccessShapeInvalid` | catalog `query_access_shape_invalid`；不得回退First、current generation或改变limit。 |
| `ReadSnapshotUnavailable`, `RepositoryUnavailable` | 2 | `PortUnavailable` | variant携带的已脱敏reason；不得伪造page gap。 |
| `ReadSnapshotUsageInvalid` | 1 | `InternalInvariantViolation` | catalog `read_snapshot_usage_invalid`；不得换snapshot。 |
| `RepositoryFailed` | 1 | `InternalInvariantViolation` | variant携带的已脱敏reason；不得丢坏row后继续。 |
| 8项integrity/shape/outcome variants | 8 | `InternalInvariantViolation` | catalog `read_integrity_invalid`；不得转Empty、Degraded或Unavailable success。 |
| `NoWriteViolation` | 1 | `NoWriteViolation` | catalog `query_no_write_violation`；不得补偿写或返回items。 |

8项机械闭集为`SubjectRelationIntegrityInvalid`、`IndexIntegrityInvalid`、`PageOrderIntegrityInvalid`、
`PersistenceBundleIntegrityInvalid`、`SourceContractInvalid`、`ReadGapShapeInvalid`、`EmptyProofInvalid`和
`LookupOutcomeInvalid`，覆盖`8/8`。`CursorSnapshotUnavailable`沿用既有invalid/expired page token边界：当前continuation
失败，caller只能发起新的first-page invocation；同一调用不得把它改成current generation近似续页。它不是reader已取得的
typed item gap，也不携带safe page body。

### 88.4 Mapper共同约束与J1自检

两个mapper只调用既有`ApplicationErrorDetail`和`SandboxQueryReadReasonCatalog`，不扩充public error kind。携reason的四类
availability/repository variants只能接收adapter在typed边界产生、已经过`SandboxReason`校验的安全reason；mapper不追加
identity、cursor、selector、finding、trace或raw cause。已有trace context只透传，不新建trace，也不追加business audit。

| J1 check | result | closure rule |
|---|---:|---|
| reconciliation finite variants | `20/20` | 4 request + 4 snapshot/repository + 11 integrity/shape/outcome + 1 no-write。 |
| reconciliation application mapping | `20/20` | 每variant唯一detail/reason来源；wildcard=`0`。 |
| audit finite variants | `23/23` | 1 operation + 3 access + 6 page/cursor + 4 snapshot/repository + 8 integrity + 1 no-write。 |
| audit application mapping | `23/23` | 每variant唯一detail/reason来源；wildcard=`0`。 |
| technical/integrity error -> successful surface | `0/43` | 不生成Report/Page/Empty/Degraded/Unavailable success。 |
| new public/application error variant | `0` | 只复用既有五个detail和八项fixed reason catalog。 |
| raw/body-bearing error material | `0` | safe reason与existing trace context之外不穿透。 |
| new L1/L2 blocker | `0` | 既有`READ-001`、`OUTCOME-001`继续开放。 |

J1完成；下一内部任务只允许`A2-F5-J2`补两个facade的固定access/open/read/close生命周期与success outcome join。J2尚未
完成，A3/A4、Step 8和正式`03-详细设计.md`回填仍禁止。

## EOF Current Recovery Override: `7R-04A-A2-F5-J1` completed, J2 in progress

本节取代前一F5-J working state，成为read artifact物理EOF current authority。F5-R、F5-A、F5-J1已完成；当前只推进
J2 facade lifecycle，不得启动J3/J4、A3/A4或正式文档回填。

```text
current_internal_task = A2-F5-J2 reconciliation/audit facade lifecycle
a2_f5_j1_error_mapping = completed
a2_f5_j2_facade_lifecycle = in_progress
a2_f5_j3_durable_fake_parity = pending
a2_f5_j4_static_audit_sync = pending
query_reader_coverage = 13/13_provisional
selector_variant_coverage = 19/19_for_completed_internal_parts
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_allowed_action = write_A2-F5-J2_facade_lifecycle_only
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Recovery Override: `7R-04A-A2-F5-J2` completed, J3 in progress

本节是read artifact的物理EOF current authority。§89已经完成J2正文；较早位置的J2 content marker只记录内容完成，
不覆盖本节恢复状态。F5-R、F5-A、J1、J2均已完成，当前只允许推进J3 durable/fake parity；J4、A3/A4、Step 8和
正式`03-详细设计.md`回填均未开始。

| recovery item | current fact |
|---|---|
| `A2-F5-R` | `[x]` reconciliation exact reader completed |
| `A2-F5-A` | `[x]` audit bounded page reader completed |
| `A2-F5-J1` | `[x]` finite errors and exhaustive mapping completed |
| `A2-F5-J2` | `[x]` access resolver、reason conversion、facade lifecycle and outcome join completed |
| `A2-F5-J3` | `[>]` durable/fake parity in progress |
| `A2-F5-J4` | `[ ]` static total audit and recovery sync pending |
| formal/implementation truth | formal `03` unchanged；implementation/test/evidence/acceptance not started；no commit required |

```text
current_internal_task = A2-F5-J3 durable/fake parity
a2_f5_j1_error_mapping = completed
a2_f5_j2_facade_lifecycle = completed
a2_f5_j3_durable_fake_parity = in_progress
a2_f5_j4_static_audit_sync = pending
query_reader_coverage = 13/13_provisional
selector_variant_coverage = 19/19_for_completed_internal_parts
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_allowed_action = write_A2-F5-J3_durable_fake_parity_only
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 90. A2-F5-J3 Durable Adapter 与 Deterministic Fake Parity

J3只闭合F5两个既有reader port的实现归属与deterministic test-support对等关系，不合并生产port，不增加repository能力，
也不把audit/reconciliation观察面扩张成Sandbox主体流程。生产application仍分别依赖
`SandboxReconciliationReportReader`与`SandboxAuditTracePageReader`；二者的方法、request、outcome和finite error保持各自
强类型边界，禁止增加generic `read(kind, selector)`、`read<T>`、route switch或`Option<Row>` fallback。

### 90.1 Durable logical owner 与双port装配

durable implementation的唯一logical owner固定为`infra::query_read`。同一个logical adapter可以同时实现两个现有trait，
也可以把六项report index、audit generation/index和bundle rehydration拆为private typed helper；这些helper不进入application
port、entry、worker或jobs。application assembly必须把同一个logical adapter实例分别绑定到两个trait slot，不能为同一
reader method并列注入第二个latest、legacy或maintenance repository adapter。

| boundary | reconciliation durable contract | audit durable contract | shared prohibition |
|---|---|---|---|
| production port | 实现`read_sandbox_reconciliation_report_source`，参数与返回严格沿用§75 | 实现`read_sandbox_audit_trace_page`，参数与返回严格沿用§86 | 不新增shared/generic production trait。 |
| request | 只接受`SandboxReconciliationReportReadRequest` | 只接受`SandboxAuditTracePageReadRequest` | raw input、scope/latest hint、opaque selector、route string均为`0`。 |
| snapshot | 只借用facade传入的同一个`&mut dyn SandboxCommittedReadSnapshot` | 同左，并只读取request指定generation | adapter open/close、snapshot替换、跨snapshot补row均为`0`。 |
| logical reads | 严格执行六项complete index与report/audit bundle顺序 | 严格执行subject/generation、bounded keys与逐item bundle顺序 | 不按timestamp选winner，不把repository `None`解释为absence。 |
| success/error | 返回canonical report outcome或`SandboxReconciliationReportReadError` | 返回canonical page outcome或`SandboxAuditTracePageReadError` | 不复制outcome/error schema，不把technical error转success。 |
| capability | committed read-only helpers | committed read-only helpers | write UoW、CAS、identity/cursor allocation、external和business audit均为`0`。 |

底层temporary availability、non-temporary repository failure与integrity failure必须分别按J1既有finite error承接。private helper
不得携raw driver/SQL/SDK cause越过adapter边界。若存储实现无法在一个caller-owned committed snapshot内满足完整index或
generation读取，应在实现前登记blocker，不得用第二次current/latest读取、cache materialization或rollback模拟本契约。

### 90.2 Test-support method 与 checked request闭集

以下类型只属于`application`/`infra` deterministic test support和assembly conformance harness，不进入production protocol、
domain registry、durable schema、diagnostic或business audit。两个生产trait仍保持独立；该union只用于证明method、request、
query kind和snapshot调用形状一一对应。

```rust
/// F5两个具名reader method的test-support闭集；不是generic production dispatch key。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxReconciliationAuditReaderMethod {
    /// `SandboxReconciliationReportReader::read_sandbox_reconciliation_report_source`。
    ReconciliationReport,
    /// `SandboxAuditTracePageReader::read_sandbox_audit_trace_page`。
    AuditTracePage,
}

impl SandboxReconciliationAuditReaderMethod {
    /// 机械返回该具名method唯一对应的closed Query kind。
    pub fn query_kind(self) -> SandboxQueryKind;
}

/// fake实际收到的完整checked permitted request；只保存在deterministic test内存中。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxReconciliationAuditReaderCallRequest {
    ReconciliationReport(SandboxReconciliationReportReadRequest),
    AuditTracePage(SandboxAuditTracePageReadRequest),
}

impl SandboxReconciliationAuditReaderCallRequest {
    /// 从request variant机械返回唯一具名method，不接受caller覆盖。
    pub fn method(&self) -> SandboxReconciliationAuditReaderMethod;
    /// 从request内已校验的access decision机械返回closed Query kind。
    pub fn query_kind(&self) -> SandboxQueryKind;
}

/// 一次reader invocation的test-only完整记录；不得写log、diagnostic或persistence。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReconciliationAuditReaderCall {
    method: SandboxReconciliationAuditReaderMethod,
    request: SandboxReconciliationAuditReaderCallRequest,
    snapshot_ref: SandboxReadSnapshotRef,
    invocation_ordinal: u32,
}

impl SandboxReconciliationAuditReaderCall {
    /// 只接受method/request/query-kind一致、non-empty snapshot ref和从1开始的ordinal。
    pub fn try_new(
        method: SandboxReconciliationAuditReaderMethod,
        request: SandboxReconciliationAuditReaderCallRequest,
        snapshot_ref: SandboxReadSnapshotRef,
        invocation_ordinal: u32,
    ) -> Result<Self, SandboxReconciliationAuditReaderContractViolation>;

    pub fn method(&self) -> SandboxReconciliationAuditReaderMethod;
    pub fn request(&self) -> &SandboxReconciliationAuditReaderCallRequest;
    pub fn snapshot_ref(&self) -> &SandboxReadSnapshotRef;
    pub fn invocation_ordinal(&self) -> u32;
}
```

`query_kind()`映射固定为`ReconciliationReport -> GetSandboxReconciliationReport`、
`AuditTracePage -> GetSandboxAuditTrace`，覆盖`2/2`且没有wildcard/default。call record中的`snapshot_ref`必须在method入口
从实际`snapshot.snapshot_ref()`复制；它只是一次调用内的correlation，不得作为audit generation、cursor、durable key或
public token。完整checked request可能含access correlation与typed selector，因此只能在test进程内用于断言，禁止格式化输出。

### 90.3 One-shot scripted result闭集

fake不运行durable读取算法，也不从map、selector、status或item count派生返回值。每个script step在构造时就必须携带一个
与expected method同family的完整checked request、预期snapshot ref，以及以下四种结果之一：

```rust
/// F5 fake可一次性回放的result闭集；每个variant保持原reader的outcome/error类型。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxReconciliationAuditReaderScriptedResult {
    ReconciliationReport(
        Result<
            SandboxReconciliationReportLookupOutcome,
            SandboxReconciliationReportReadError,
        >,
    ),
    AuditTracePage(
        Result<SandboxAuditTracePageLookupOutcome, SandboxAuditTracePageReadError>,
    ),
}

impl SandboxReconciliationAuditReaderScriptedResult {
    /// 机械返回result family唯一对应的具名method。
    pub fn method(&self) -> SandboxReconciliationAuditReaderMethod;
}

/// 一个预先checked、只能消费一次的fake script step。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReconciliationAuditReaderScriptStep {
    method: SandboxReconciliationAuditReaderMethod,
    request: SandboxReconciliationAuditReaderCallRequest,
    snapshot_ref: SandboxReadSnapshotRef,
    result: SandboxReconciliationAuditReaderScriptedResult,
}

impl SandboxReconciliationAuditReaderScriptStep {
    /// 只接受method/request/result/query-kind一致的完整预期调用。
    pub fn try_new(
        method: SandboxReconciliationAuditReaderMethod,
        request: SandboxReconciliationAuditReaderCallRequest,
        snapshot_ref: SandboxReadSnapshotRef,
        result: SandboxReconciliationAuditReaderScriptedResult,
    ) -> Result<Self, SandboxReconciliationAuditReaderContractViolation>;

    pub fn method(&self) -> SandboxReconciliationAuditReaderMethod;
    pub fn request(&self) -> &SandboxReconciliationAuditReaderCallRequest;
    pub fn snapshot_ref(&self) -> &SandboxReadSnapshotRef;
    pub fn result(&self) -> &SandboxReconciliationAuditReaderScriptedResult;
}

/// 仅用于test-support misuse断言，不进入application/public error mapping。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxReconciliationAuditReaderContractViolation {
    MethodRequestMismatch,
    MethodResultMismatch,
    QueryKindMismatch,
    SnapshotRefMismatch,
    InvocationOrdinalInvalid,
    DuplicatePermittedInvocation,
    ScriptAlreadyConsumed,
    ScriptNotFullyConsumed,
    StateUnavailable,
}

impl SandboxReconciliationAuditReaderContractViolation {
    /// 适配到reconciliation production trait已有finite error；不新增fake-only trait error。
    pub fn to_reconciliation_read_error(self) -> SandboxReconciliationReportReadError;
    /// 适配到audit production trait已有finite error；不新增fake-only trait error。
    pub fn to_audit_read_error(self) -> SandboxAuditTracePageReadError;
}

/// 同时实现两个既有reader trait的deterministic test-support adapter。
pub struct SandboxDeterministicReconciliationAuditReader {
    // No lock guard may be held across an await point.
    state: std::sync::Mutex<SandboxReconciliationAuditReaderFakeState>,
}

struct SandboxReconciliationAuditReaderFakeState {
    pending_steps: std::collections::VecDeque<SandboxReconciliationAuditReaderScriptStep>,
    calls: Vec<SandboxReconciliationAuditReaderCall>,
    violations: Vec<SandboxReconciliationAuditReaderContractViolation>,
    next_invocation_ordinal: u32,
}

impl SandboxDeterministicReconciliationAuditReader {
    /// 校验全部step后构造fake；空script允许用于断言unexpected invocation。
    pub fn try_new(
        script: Vec<SandboxReconciliationAuditReaderScriptStep>,
    ) -> Result<Self, SandboxReconciliationAuditReaderContractViolation>;

    /// 返回按invocation ordinal排序的test-only调用记录副本。
    pub fn calls(
        &self,
    ) -> Result<
        Vec<SandboxReconciliationAuditReaderCall>,
        SandboxReconciliationAuditReaderContractViolation,
    >;
    /// 返回按发生顺序记录的test-only contract violation副本。
    pub fn violations(
        &self,
    ) -> Result<
        Vec<SandboxReconciliationAuditReaderContractViolation>,
        SandboxReconciliationAuditReaderContractViolation,
    >;
    /// 返回尚未消费的script step数量，不暴露step正文。
    pub fn remaining_script_step_count(
        &self,
    ) -> Result<usize, SandboxReconciliationAuditReaderContractViolation>;
    /// 只有全部step恰好消费一次且无violation时成功。
    pub fn assert_all_consumed(
        &self,
    ) -> Result<(), SandboxReconciliationAuditReaderContractViolation>;
}
```

`SandboxReconciliationAuditReaderFakeState`是fake实现私有的同步状态，不是新的application port或共享对象；它只保存
pending step、call record、violation和下一个ordinal。构造时`next_invocation_ordinal=1`。trait method只在匹配/pop/记录期间
持锁，释放锁后才返回ready result，全程不在锁内`await`。锁不可用不得panic或返回scripted success：记录能力仍可用时追加
`StateUnavailable`，随后按当前trait family返回`ReadSnapshotUsageInvalid`；inspection API直接返回`Err(StateUnavailable)`。
inspection API只返回副本，不能在production assembly、diagnostic或business code中调用。

`assert_all_consumed()`的检查顺序固定为：先尝试取得state；失败返回`StateUnavailable`；随后若`violations`非空，返回其中
第一项且不清空记录；否则若`pending_steps`非空，返回`ScriptNotFullyConsumed`；只有二者都为空才返回`Ok(())`。
`remaining_script_step_count()`只报告队列长度，不把“0”解释为无violation，因此不能替代最终断言。

contract violation到既有trait error的映射必须分别对九个variant穷尽`match`，不得使用wildcard：

| contract violation | reconciliation trait return | audit trait return | test-only observation |
|---|---|---|---|
| `MethodRequestMismatch` | `SelectorMismatch` | `SelectorMismatch` | exact violation追加到`violations()`。 |
| `QueryKindMismatch` | `QueryKindMismatch` | `QueryKindMismatch` | 不读取target/index。 |
| `MethodResultMismatch` | `LookupOutcomeInvalid` | `LookupOutcomeInvalid` | 不消费wrong-family result。 |
| `SnapshotRefMismatch`, `InvocationOrdinalInvalid`, `DuplicatePermittedInvocation`, `ScriptAlreadyConsumed`, `ScriptNotFullyConsumed`, `StateUnavailable` | `ReadSnapshotUsageInvalid` | `ReadSnapshotUsageInvalid` | 不伪造repository或availability reason。 |

`ScriptNotFullyConsumed`只由`assert_all_consumed()`返回；它不会自行触发production trait调用。其适配函数仍有定义，保证两个
mapping都是`9/9` total。service/facade只看到原reader finite error；exact violation只留在test harness inspection side channel，
不进入`ApplicationErrorDetail`、log或diagnostic。

`SandboxDeterministicReconciliationAuditReader`可同时实现两个现有reader trait，但每个trait method必须只消费自己family的
script step。它在返回scripted result前按固定顺序执行：

1. 从实际trait method确定`SandboxReconciliationAuditReaderMethod`，clone完整checked request并读取caller snapshot ref。
2. 构造candidate call record，验证method、request variant和request query kind三者一致，ordinal必须是该fake实例从`1`递增的
   下一值；检查既有calls中不存在相同`method + full request + snapshot_ref`。
3. 与队首唯一未消费script step逐字段比较method、完整request、snapshot ref和result family；任一不等即追加exact test
   violation，并按上表返回当前trait finite error，不消费step、不记录成功call，也不查map或调用durable adapter。
4. 全部匹配后才原子地pop该step、记录call并递增ordinal。队列已空的调用返回`ScriptAlreadyConsumed`适配错误；相同调用键
   二次进入返回`DuplicatePermittedInvocation`适配错误。
5. 按variant原样返回已pop step中的预先checked outcome或对应finite error；不修改outcome，不重新构造reason，不触发mapper
   或diagnostic。测试结束必须调用`assert_all_consumed()`，剩余step或任何violation均失败。

scripted success必须在注入fake前已由§77或§86的canonical factory构造完成；fake不能自动补造absence proof、index source、
report/finding row、page item、cursor/generation、audit linkage、gap或reason。scripted error必须是J1固定的`20/20`或`23/23`
finite error之一；test-support contract violation只表示装配/测试脚本误用，不得映射为Query success、`ApplicationErrorDetail`
或生产诊断事件。

### 90.4 Durable/fake parity 与 assembly断言

| parity dimension | durable adapter | deterministic fake | required assertion |
|---|---|---|---|
| production trait set | 实现两个既有独立trait | 实现相同两个trait | trait parity=`2/2`；merged/generic trait=`0`。 |
| named method | reconciliation与audit各一个exact method | 同名、同参数、同返回类型 | method parity=`2/2`。 |
| checked request | 只消费各trait的checked permitted request | 比较完整checked request | validation bypass=`0`。 |
| query kind | 由request/access contract固定 | method/request/result三者机械校验 | family substitution=`0`。 |
| snapshot | 只借用caller提供的same snapshot | 记录并比较实际`snapshot_ref` | open/close/substitution=`0/0/0` in reader。 |
| success | 返回各自canonical lookup outcome | 原样回放同family预脚本outcome | proof/row/page/reason synthesis=`0`。 |
| finite error | 返回各自J1 finite error | 原样回放同family预脚本error | error schema duplication=`0`。 |
| call budget | 每个Permitted facade调用exact reader一次 | 一个script step只消费一次 | per-call reader invocation=`1/1`。 |
| side effects | write/identity/external/audit append=`0` | 同样为`0` | parity=`1/1`。 |

durable conformance测试如需生成同形call record，只能通过test-only wrapper观察trait入口；production durable adapter不得记录
完整request或snapshot ref。assembly必须证明两个service依赖指向同一个logical owner，且maintenance reconciliation runner、
audit append writer、旧`list_audit_traces_by_subject`和任何mutable repository都未被绑定到Query reader slot。

### 90.5 J3 static self-check 与完成标记

以下只是在设计文本上检查契约闭集，不是实现、编译、测试、run、evidence或验收结果。

| J3 check | result | closure rule |
|---|---:|---|
| durable logical owner | `1/1` | `infra::query_read`；可有private helper但无第二application owner。 |
| production reader traits | `2/2` | reconciliation与audit保持独立；generic alias=`0`。 |
| exact method / request family | `2/2` | method、checked request、query kind固定对应。 |
| scripted outcome/error family | `2/2` | 两类均原样承接canonical outcome或各自finite error。 |
| call record fields | `4/4` | method、完整checked request、snapshot ref、invocation ordinal。 |
| method/request/result/snapshot validation | `4/4` | mismatch均为test-only contract violation，不fallback。 |
| one-shot consumption | `2/2` | duplicate permitted invocation与script reuse均拒绝。 |
| test-support inspection | `4/4` | calls、violations、remaining count、assert-all-consumed均具名。 |
| violation -> existing finite error | `2/2` | 两个trait均`9/9` total mapping；fake-only trait error=`0`。 |
| fake synthesized proof/row/cursor/audit linkage/reason | `0` | fake只回放预checked result。 |
| Query write / identity / business audit / external | `0/0/0/0` | durable、fake与test wrapper均不取得这些能力。 |
| new L1/L2 blocker | `0` | 既有READ-001/OUTCOME-001继续开放。 |

J3完成。下一内部任务只允许`A2-F5-J4`执行F5 static total audit并同步恢复源；不得启动A3/A4、Step 8或正式
`03-详细设计.md`回填。

## EOF Current Recovery Override: `7R-04A-A2-F5-J3` completed, J4 in progress

本节是read artifact的物理EOF current authority。F5-R、F5-A、J1、J2、J3均已完成静态设计闭合；当前只允许推进J4
static total audit和四层完成同步。

| recovery item | current fact |
|---|---|
| `A2-F5-R` | `[x]` reconciliation exact report reader completed |
| `A2-F5-A` | `[x]` audit bounded page reader completed |
| `A2-F5-J1` | `[x]` finite errors and exhaustive application mapping completed |
| `A2-F5-J2` | `[x]` access resolver、reason conversion、facade lifecycle and outcome join completed |
| `A2-F5-J3` | `[x]` durable/fake method、request、snapshot、outcome/error parity completed |
| `A2-F5-J4` | `[>]` static total audit and recovery sync in progress |
| formal/implementation truth | formal `03` unchanged；implementation/test/evidence/acceptance not started；no commit required |

```text
current_internal_task = A2-F5-J4 static total audit and recovery sync
a2_f5_j1_error_mapping = completed
a2_f5_j2_facade_lifecycle = completed
a2_f5_j3_durable_fake_parity = completed
a2_f5_j4_static_audit_sync = in_progress
query_reader_coverage = 13/13_provisional
selector_variant_coverage = 19/19_for_completed_internal_parts
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_allowed_action = perform_A2-F5-J4_static_total_audit_only
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 91. A2-F5-J4 Static Total Audit 与 F5 完成门

J4只对F5-R/A/J1/J2/J3已经形成的设计文本做正向计数、反向禁用面和可落码闭环审计，不增加新的主体流程、异常处理流程、
测试方案或交付流程。以下`result`都是设计契约计数，不是实现、编译、测试、run、evidence或验收结果。

### 91.1 正向 total audit

| audit item | result | traceable closure |
|---|---:|---|
| F5 internal tasks | `R/A/J1/J2/J3/J4 = 6/6` | exact report、bounded audit、error mapping、facade、parity和本审计逐项完成。 |
| named production reader traits / methods | `2/2` | reconciliation与audit各一个独立trait、一个exact method；generic production trait=`0`。 |
| checked permitted requests | `2/2` | exact report request与subject/generation page request均由access decision构造。 |
| selector contribution | `2/2` | exact reconciliation selector `1` + audit subject-page selector `1`；累计variants=`19/19`。 |
| reconciliation complete index | `6/6` | root、finding、current binding、audit、relay、stored result均在同snapshot读取。 |
| reconciliation absence / rehydration | `1/1 + 1/1` | six-zero proof；row + matching audit bundle canonical rehydrate。 |
| audit cursor binding / page branches | `5/5 + 5/5` | family/selector/generation/key/limit；first/continued/terminal/prefix/invalid-empty。 |
| audit subject / empty / gaps / rehydration | `2/2 + 1/1 + 5/5 + 11/11` | scope resolution、complete zero proof、five gap kinds和逐item canonical stages。 |
| finite errors and application mapping | `20/20 + 23/23 = 43/43` | 两个mapper均穷尽match；wildcard=`0`；technical-to-success=`0/43`。 |
| named access methods / denied branches | `2/2 + 6/6` | 每facade三种access early surface；target/index read与audit denied decode均为0。 |
| permitted snapshot lifecycle | `2/2` | request/open/named reader/close各一次；close failure precedence `2/2`。 |
| reconciliation outcome mapping | `6/6` | Clean、IssuesFound、Degraded、Failed、ExactAbsent、Unavailable。 |
| audit outcome mapping | `4/4` | complete、safe-prefix、Empty proof、no-prefix gap。 |
| reason conversions | `3/3` | report coverage、report gaps、audit gaps均有唯一pure owner并保持顺序。 |
| durable/fake parity | `2/2` | method、checked request、query kind、snapshot、outcome/error一一对应。 |
| fake misuse mapping / inspection | `9/9 x 2` / `4/4` | violation适配到两个既有finite error；无fake-only trait error。 |
| cumulative Query reader coverage | `13/13 provisional` | F1=`3` + F2=`2` + F3=`3` + F4=`3` + F5=`2`。 |
| maintenance selection separation | `9/9` | public Query use=`0/13`；candidate reader不成为truth reader。 |

### 91.2 反向 capability 与语义审计

| forbidden surface | audited result | fail-closed rule |
|---|---:|---|
| generic/latest/scope report reader | `0` | exact report ref唯一；不按time/version选winner。 |
| generic audit reader / old UoW list delegate | `0` | subject/generation bounded page唯一；旧mutable list不装配。 |
| repository `None` -> Empty | `0` | report需six-zero proof；audit需first-page complete zero proof。 |
| cross-snapshot row/index/bundle join | `0` | 两reader只借用caller同一个snapshot；reader open/close=`0/0`。 |
| cursor fallback | `0` | invalid/expired continuation不回退First或current generation。 |
| technical/integrity error -> successful surface | `0/43` | 不转Visible/Degraded/Empty/Unavailable。 |
| business Failed report -> technical error | `0` | 完整rehydrate的Failed report带body映Visible。 |
| fake proof/row/page/cursor/audit-link/reason synthesis | `0` | 只回放预checked one-shot script result。 |
| Query write UoW/CAS/identity/truth cursor | `0/0/0/0` | committed read snapshot不暴露写能力。 |
| report/audit append、repair/reconciliation、cleanup/reaper/redline transition | `0/0/0/0` | observation不升级为mutation或security control。 |
| external/tool/runtime/backend/capture/handoff call | `0` | F5不承接Sandbox主体隔离或语义执行。 |
| observability/artifact/evidence body read | `0` | audit仅展示已提交body-free linkage。 |
| business audit append | `0` | 最多一次低基数redacted diagnostic hook，失败不改结果。 |

反向审计没有发现F5正文遗漏的production port、第二truth owner、implicit fallback或副作用能力。J4期间发现并闭合的局部
可落码缺口只有test-support violation无法穿过production trait签名：现已补`ScriptStep`、同步fake state、四个inspection
method及`9/9 x 2`适配，未新增production/public error。该修补属于F5 parity contract，不新增L1/L2 blocker。

### 91.3 Blocker 裁决与真实性边界

| blocker / fact | J4 disposition | reason |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | keep open | A2 exact reader已完成，但关闭条件还要求A3必要whole-group writer和A4正反向总审计。 |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | keep open | F5 Query outcome已闭合，但该blocker的全Step adapter outcome owner不由本批单独关闭。 |
| `BLK-SBX-CANONICAL-001` | existing implementation gate unchanged | scope digest verifier/canonical binding未由真实实现证明；不得使用fixture hash或伪造digest。 |
| new L1/L2 upstream blocker | `0` | F5所需owner和carrier均可在现有L4边界闭合。 |
| formal `03-详细设计.md` | unchanged / frozen | 当前仍是Step 7中间产物，未到正式装配Step。 |
| implementation / real test / evidence / acceptance | not started / not started / no / no | 本批没有代码、run_id、commit、真实evidence alias或签署。 |

### 91.4 F5 完成状态与用户复核门

`A2-F5-R/A/J1/J2/J3/J4`均完成，A2的五个reader family达到`5/5 completed`。该结论仅表示13个public Query的exact
read契约已形成可落码中间产物，不表示`7R-04A`整体完成：A3 whole-group writer和A4 blocker closure仍为pending。按阶段门禁，
本轮停在F5用户复核门，不自动进入A3。

## EOF Current Recovery Override: `7R-04A-A2-F5` completed, user review pending

本节是read artifact物理EOF current authority。A2五个family均已完成；下一动作必须等待用户确认后读取A3所需
whole-group writer上游契约，不得自动写A3/A4、Step 8或正式`03-详细设计.md`。

| recovery item | current fact |
|---|---|
| `A2-F5-R/A/J1/J2/J3/J4` | `[x] 6/6` |
| A2 exact reader families | `[x] 5/5 completed` |
| Query / selector coverage | `13/13 provisional` / `19/19` |
| maintenance separation | existing selection reader `9/9` preserved；public Query use=`0/13` |
| F5 blockers | no new blocker；READ-001/OUTCOME-001 remain open for later owners |
| next internal task | `A3 absence/gap/surface + necessary whole-group writer boundary`，user confirmation required |
| formal/implementation truth | formal `03` unchanged；implementation/test/evidence/acceptance not started；no commit required |

```text
current_internal_task = A2-F5 review gate
a2_exact_reader_contracts = completed_5_of_5_families
a2_f5_reconciliation_audit = completed_wait_user_review
a2_f5_r_reconciliation = completed
a2_f5_a_audit = completed
a2_f5_j1_error_mapping = completed
a2_f5_j2_facade_lifecycle = completed
a2_f5_j3_durable_fake_parity = completed
a2_f5_j4_static_audit_sync = completed
a3_outcome_writer_boundary = pending
a4_read_blocker_closure = pending
query_inventory = 13/13_unique
query_reader_coverage = 13/13_provisional
selector_variant_coverage = 19/19
existing_maintenance_reader = 9/9_preserved
query_maintenance_reader_use = 0/13_completed_queries
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
next_required_reads = current_artifact_A1_A2_closure|step6_materialization_owners|step7_repositories_uow_indexes|step7_immutable_audit_relay_repositories|step11_persistence_whole_group_rules
next_allowed_action = wait_user_review_before_A3
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## EOF Current Recovery Override: `7R-04A-A3-1` completed, A3-2 in progress

本节是read artifact物理EOF current authority，并显式激活前部
`Historical-Position Foundation: A3-1 Reader Source 与 Necessary Writer Ownership Inventory` 的§§92.1~92.6。
A3-1已完成；当前只允许补八类status-view staged writer，不得进入A3-3/A3-4/A4、Step 8或正式`03`。

```text
current_internal_task = A3-2 eight status-view staged writer contracts
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = in_progress
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
query_write_provenance = 13/13
necessary_materialization_surfaces = 11/11_identified
status_view_writer_families = 8/8_identified
existing_writer_reuse = reconciliation|audit
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_allowed_action = write_A3_2_status_view_writer_contracts_only
formal_03_writeback = forbidden
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 93. A3-2-S1 Shared Staged Write Authorization 与事务纪律

### 93.1 本批范围与冲突裁决

本批只补八类 status-view writer 共用的 application-local 授权、first/replace expectation、staged result、有限错误和
事务终结纪律。execution、boundary、policy、capture、handoff 的逐类 candidate/write set 留给 A3-2-S2；
failure/control、cleanup、redline 留给 A3-2-S3。本批不写 projection、derived、comparison，不改 reconciliation/audit
owner，也不回填正式 `03-详细设计.md`。

Step 6 comparison 草案曾在 callable 中引用未定义的 `AcceptedSandboxWriteContext`。该名称不能继续充当无结构的
"caller 已授权"断言：boolean、public DTO、query access decision、transaction ref 或 audit ref 单项都不能证明 source
mutation group 已经在同一 UoW 被接受。本节将它定义为 application crate 内不可复制、不可序列化并显式借用
`&mut dyn SandboxUnitOfWork` 的线性 staged-source capability。comparison 在 A3-3 消费同一纪律时必须使用对应
comparison family marker，不得继续使用无类型参数的 historical 伪代码。

另一个必须裁决的冲突是“first materialization = current binding absent”。该等式只对 execution 等 singleton key
偶然成立，对 boundary、policy、capture、handoff、cleanup 不成立：新 exact target 可以是首次物化，同时 context 级
current selector 已指向旧 target。因此 current contract 将 exact target expectation 与每个 mutable selector pointer
expectation 分离；不得用一个 `Option<Version>`、`is_first` boolean 或 repository `NotFound` 同时替代两者。

### 93.2 Sealed family 与 shared type shape

以下代码块固定 application-facing shape。它是 Step 7 设计契约，不代表 Rust 已实现或编译。

```rust
/// 只允许 application 模块登记的 materialization family；infra 不能新增 variant。
pub trait SandboxStatusViewMaterializationFamily: private::Sealed + Send + Sync {
    /// family-specific binding-free checked candidate。
    type Candidate;
    /// family-specific immutable binding row。
    type Binding;
    /// family-specific immutable view identity。
    type ViewRef;
    /// formal target/source owner 形成的首次物化 proof。
    type FirstTargetProof;
    /// generic exact-target 之外的 family-specific selector/index expectation carrier。
    type IndexExpectation;
    /// accepted source group finalizer 形成的 typed staged-source proof。
    type AcceptedSourceProof;
}

/// 八类 status-view family marker；marker 没有 runtime payload，也不进入 DTO/store。
pub enum ExecutionStatusMaterializationFamily {}
pub enum BoundaryStatusMaterializationFamily {}
pub enum PolicyDecisionSummaryMaterializationFamily {}
pub enum CaptureSummaryMaterializationFamily {}
pub enum MaterialHandoffStatusMaterializationFamily {}
pub enum FailureControlStatusMaterializationFamily {}
pub enum CleanupReadinessMaterializationFamily {}
pub enum RedlineContainmentMaterializationFamily {}

/// exact target row/binding 是首次创建还是替换该 target 的 latest immutable binding。
pub enum SandboxStatusViewTargetExpectation<F>
where
    F: SandboxStatusViewMaterializationFamily,
{
    /// target 来自 formal owner/registry proof；不是 caller absence assertion。
    FirstForFormalTarget {
        proof: F::FirstTargetProof,
    },
    /// 同一 UoW exact read 返回的 binding 与 core Version 必须一起移动到 expectation。
    ReplaceExactTarget {
        expected: Versioned<F::Binding>,
    },
}

/// 一个 family 的完整 write expectation；index expectation 逐 family 定义，不能 generic map/patch。
pub struct SandboxStatusViewWriteExpectation<F>
where
    F: SandboxStatusViewMaterializationFamily,
{
    target: SandboxStatusViewTargetExpectation<F>,
    indexes: F::IndexExpectation,
}
```

八个 marker 的 associated types 必须在 S2/S3 逐项登记。sealed trait 只用于 compile-time family matching；它不授权
generic `materialize(kind, payload)`。最终 writer trait 仍须有八个具名 method，且每个 method 的 candidate、binding、
first proof、index expectation 和 result 都由 marker 唯一绑定。application entry、Query service 与 protocol crate 均
不得接触这些 marker 或 expectation。

`Versioned<F::Binding>` 的 value/version 必须来自当前 write UoW 内一次 exact committed read。它不能由 caller 拆成
`binding + Version` 后重组，不能由 read snapshot、selection page、timestamp、cursor 或 candidate 提供。若一个 family
需要同时替换 exact-target latest pointer 与额外 selector pointer，exact target 的 value/version 只由
`SandboxStatusViewTargetExpectation::ReplaceExactTarget` 承载；`F::IndexExpectation` 只携带各额外 pointer 的 same-UoW
`Versioned<...>`。不得在 index expectation 重复 exact-target version，也不得把任一 version 套给另一行。

### 93.3 `AcceptedSandboxWriteContext` 线性授权

```rust
/// source owner 完成必要 staged-source 前置条件后形成的 application-local capability。
///
/// 没有 Clone/Copy/Serialize/Deserialize/Eq；Debug 只能输出 family 与脱敏 transaction identity。
pub struct AcceptedSandboxWriteContext<'uow, F>
where
    F: SandboxStatusViewMaterializationFamily,
{
    uow: &'uow mut dyn SandboxUnitOfWork,
    source_proof: F::AcceptedSourceProof,
    _family: PhantomData<F>,
}

impl<'uow, F> AcceptedSandboxWriteContext<'uow, F>
where
    F: SandboxStatusViewMaterializationFamily,
{
    /// 仅供对应 source mutation group finalizer 在 application crate 内构造。
    pub(crate) fn try_from_staged_source_group(
        uow: &'uow mut dyn SandboxUnitOfWork,
        source_proof: F::AcceptedSourceProof,
    ) -> Result<Self, SandboxStatusViewStageError>;

    /// 仅供 named writer adapter 借用同一 transaction；不暴露 manager/commit/rollback。
    pub(crate) fn uow_mut(&mut self) -> &mut dyn SandboxUnitOfWork;

    /// 返回 family-specific accepted source proof，供 candidate/relation 逐字段匹配。
    pub(crate) fn source_proof(&self) -> &F::AcceptedSourceProof;
}
```

`F::AcceptedSourceProof` 是 source mutation owner 成功 stage canonical source group 后，由对应 application finalizer
通过 crate-private constructor 形成的线性 proof。S2/S3 的每个 proof 至少必须封闭以下事实：

| proof fact | required invariant | forbidden substitute |
|---|---|---|
| family / source owner | source mutation owner 与将调用的 named writer family exact match | caller enum string、generic owner ref、method name解析 |
| transaction identity | proof 中的 transaction ref 等于 borrowed UoW 当前 transaction ref | public correlation、idempotency key、trace ref |
| exact subject/target | context 与 family-specific source target 全部为 typed refs，且与 staged source group一致 | ref文本拼接、latest target、Query selector |
| accepted source transition | domain factory/transition 已接受，且 canonical source cursor-independent members 已 staged | adapter success bool、read view status、diagnostic finding |
| source cursor | UoW 已分配的 matching truth cursor；八类 status view 均不得自行再分配 | `Version`、reference cursor、page cursor、clock、candidate cursor |
| required source audit | matching business audit 已由 source owner staged，candidate只链接该 exact ref | writer新建 view audit、query audit、optional arbitrary trace |
| operation ownership | fresh write operation 的 reservation/owner relation已登记；最终 stored/idempotency completion仍由caller负责 | writer reserve/complete、自建 operation key、没有 owner 的后台写 |
| no external await | capability形成后到 named writer stage 结束只允许 same-UoW repository调用与pure validation | backend、tool/runtime、capture/handoff delivery、investigation port |

constructor 必须重验 `uow.assigned_truth_cursor()` 与 typed source proof 的 cursor 完全相等。cursor 尚未分配、重复分配、
proof/UoW transaction 不等、audit/source relation未 staged或family不匹配均返回 typed stage error，不能构造 context。
context 不拥有 `SandboxUnitOfWorkManager`、identity allocator、clock、audit appender、stored-result port 或任何 external port；
因此它既不能 begin/commit/rollback，也不能生成第二 identity/cursor/audit。

context 按值交给一个 named stage method并在返回时消费，其 `&mut UoW` reborrow 随调用结束释放。一个 source UoW 需要
更新多个 family 时，source owner必须持有多个对应 typed source proof并按具名 method 顺序创建多个短生命周期 context；
不能 clone 一个 generic capability或把同一 context 并发交给多个 writer。

### 93.4 First target 与 mutable selector pointer expectation

`FirstForFormalTarget`只表示 exact family target 从未物化，不表示 context 没有其它 current target。family-specific
`FirstTargetProof`必须来自 canonical source owner/registry，在同一 write UoW 中绑定 exact target key、source owner、
candidate identity domain与 accepted cursor/audit；它不能从 A2 Query absence proof、`NotFound`、empty page、缓存、
reconciliation finding或 operator flag构造。

named writer必须在同一 write UoW 完成以下机械检查，全部通过后才可stage：

| check dimension | `FirstForFormalTarget` | `ReplaceExactTarget` | failure disposition |
|---|---|---|---|
| canonical source owner | exact source row/group存在且与accepted proof、cursor、audit相等 | 同左，并且source确有accepted change | missing/unavailable不是first；relation contradiction为integrity |
| target immutable rows | exact logical target历史总数固定为0 | 旧target至少有expected binding指向的row；new candidate ref计数为0 | `0/current>0`、orphan或duplicate ref为integrity |
| target latest/exact binding | exact target binding计数固定为0 | current exact binding逐字段等于`Versioned.value()` | mismatch/missing为conflict或integrity，不回退historical |
| target mutable version | 不伪造`Version(0)`；使用insert-if-absent constraint | repository current version等于`Versioned.version()` | CAS loser返回VersionConflict，旧candidate作废 |
| selector pointers | 按family expectation逐个验证：可为Absent，或指向另一个合法旧target并带其exact Version | 每个将改变的pointer都必须带same-UoW exact Version；不变pointer也需relation proof | 不能用一个version覆盖多个pointer，mixed generation为integrity |
| required relation/index rows | 新target对应relation均为0；旧target历史relation可合法存在 | old relation完整；new candidate relation计数为0 | row/binding/relation任一半组为integrity |
| candidate relation | family、subject、target、new view ref、source cursor/audit/time逐项匹配proof | 同左；logical target identity不得偷偷变化 | typed candidate/authorization mismatch |

selector pointer expectation由每个 family 明确列出，而不是共享 boolean：

| family shape | target first可能看到的既有pointer | mandatory expectation rule |
|---|---|---|
| execution singleton | context current pointer必须absent | first必须原子证明target row/binding/current pointer/relation全零 |
| boundary / policy | context current pointer可absent，也可指向旧 exact target | 若替换旧pointer，必须携带该pointer同UoW Version；旧exact/history binding保留 |
| capture / handoff | family-specific current/exact pointer可指向前一 lifecycle target | S2逐项固定，不得按时间选latest |
| failure/control | context-scoped merged snapshot current pointer | first与replacement都必须覆盖window index、summary和cross-link完整性 |
| cleanup | new guard target可first，同时context current pointer指向旧guard | generic target expectation承载exact-guard latest；family index expectation只承载context-current plan及其独立version |
| redline | current pointer key为exact `(context_ref, redline_ref)`；不同redline互不替换 | first只要求该exact key全零；不能覆盖同lineage其它redline pointer |

`ReplaceExactTarget`发生 CAS conflict 后，source owner必须丢弃 candidate、view factory结果、guard/transition决定和所有
基于旧snapshot的 staged assumptions。允许的重试是从 idempotency preflight/owner-group exact read 开始，取得 fresh
`Versioned<T>`、重做domain guard/transition、重新判断是否仍需 materialize，再形成新candidate并stage完整write set；
禁止只reload pointer、复用旧candidate或把loser row保存为historical success。

### 93.5 Named writer stage result 与有限错误

status writer只stage，不commit，所以成功 carrier不得命名为`Committed`：

```rust
/// 只证明完整 status-view group 已在指定 UoW staged；commit前不得对外可见。
pub struct StagedSandboxStatusViewWrite<F>
where
    F: SandboxStatusViewMaterializationFamily,
{
    mode: SandboxStatusViewStageMode,
    view_ref: F::ViewRef,
    binding: F::Binding,
    transaction_ref: SandboxTransactionRef,
}

pub enum SandboxStatusViewStageMode {
    FirstForFormalTarget,
    ReplaceExactTarget,
}

/// 八个named status writer共享的application-local有限失败闭集。
pub enum SandboxStatusViewStageError {
    AuthorizationMismatch { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
    CandidateRejected { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
    FirstTargetProofRejected { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
    ExpectationConflict { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
    VersionConflict { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
    IntegrityViolation { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
    TransactionUsageViolation { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
    RepositoryUnavailable { family: SandboxStatusViewFamilyKind, reason: SandboxReason },
}
```

`SandboxStatusViewFamilyKind`是只含八个variant的低基数diagnostic enum，不是writer dispatch key。stage result的
constructor为crate-private；`transaction_ref`必须等于context UoW；binding/view ref/source linkage必须等于candidate，
不得返回repository生成的替代identity。result没有 public status、commit token、retry hint、raw store error或test/evidence
字段，也不允许`DuplicateEquivalent`成功分支：fresh duplicate replay应在source idempotency owner处零业务写返回原stored
surface；同事务重复调用writer是`TransactionUsageViolation`；commit-unknown恢复由whole-group inspection处理。

error到既有 application error detail 的穷尽映射固定如下：

| stage error | application mapping | retry/repair rule |
|---|---|---|
| `AuthorizationMismatch` | `InternalInvariantViolation` | 不重试；caller装配错误 |
| `CandidateRejected` | `InternalInvariantViolation` | 不让repository/default修补；回到source factory |
| `FirstTargetProofRejected` | `InternalInvariantViolation` | 不能改用NotFound或Query absence |
| `ExpectationConflict` | `VersionConflict`仅限完整、合法并发winner；mixed/half relation转`InternalInvariantViolation` | 重新执行整个owner flow |
| `VersionConflict` | `VersionConflict` | 旧candidate和旧决定全部作废 |
| `IntegrityViolation` | `InternalInvariantViolation` | fail-closed，交既有reconciliation/quarantine入口；writer不repair |
| `TransactionUsageViolation` | `InternalInvariantViolation` | 不补cursor、不换UoW继续stage |
| `RepositoryUnavailable` | `PortUnavailable` | 不冒充absence；由上层新调用决定 |

wildcard mapping、raw error `Display` 转reason、technical error转`NoOp/Visible/Empty`均为0。异常面到此为止，只提供实现
所需的fail-closed分类，不扩写incident workflow或人工审查流程。

### 93.6 Atomic stage set 与 caller-owned commit

每个 named method 必须按如下共同顺序执行；S2/S3只补各family成员和key，不得改变生命周期：

```text
source mutation owner: begin/reserve/exact read/domain transition
  -> stage canonical source group + required source audit
  -> assign matching truth cursor exactly once
  -> build family-specific candidate + target/index expectation
  -> create AcceptedSandboxWriteContext borrowing the same UoW
  -> named writer revalidates exact source/target/pointer/relation set
  -> stage new immutable view row
  -> stage immutable binding + exact/history/current pointer changes
  -> stage source-cursor/audit relation and family-required indexes
  -> return StagedSandboxStatusViewWrite (not committed)
source owner: stage relay/stale/stored/idempotency completion as required
  -> commit the whole source mutation group
```

| capability | writer | source mutation owner |
|---|---:|---:|
| begin UoW / reserve operation | no | yes |
| load exact source and form domain transition | validate relation only | yes |
| allocate view/audit/stored/cursor identity | no | yes |
| assign truth/reference cursor | no | yes，八类status view只复用matching truth cursor |
| stage immutable view/binding/index/relation | yes | invokes named writer |
| append required business audit | no | yes，writer只链接existing staged audit |
| stage stored/idempotency/relay/stale owner members | no | yes |
| commit / rollback / exact unknown inspection | no | yes |
| call external/tool/runtime/capture/handoff/investigation port | no | 按既有two/three-UoW owner flow，绝不持有本context时调用 |

write group的最小原子可见性为：changed canonical source owners、source audit、new immutable view row、matching immutable
binding、所有被影响的 exact/history/current pointers、source cursor/audit relation、family-required completeness indexes，以及
原operation所需stored/idempotency/relay/stale成员。query只能看到commit前整组或commit后整组；任何 row-only、binding-first、
pointer-only、index-late 或 source-audit-late 可见性都是 integrity violation。writer不能以“后续 Job 会补齐”为理由缩小组。

stage前任一失败时，source owner仍持有UoW并负责rollback；rollback failed/unknown进入既有consistency route，不得宣称
view absent。stage result只有在UoW manager返回matching confirmed receipt后，才能由source owner纳入fresh stored surface；
writer自己没有把`Staged`升级为`Committed`的方法。

### 93.7 Commit unknown、inspection 与 durable/fake parity

commit unknown发生在source owner终结whole group时，不发生在status writer内部。此时必须丢弃内存中的stage result、
candidate和expected versions，冻结原operation identity及所有预生成source/view/audit/relay/stored refs，并在新的只读
committed snapshot执行 family-specific whole-group exact inspection：

| inspection branch | minimum proof | allowed disposition |
|---|---|---|
| `Committed` | source truth、required audit、immutable view、binding、全部pointer/index/relation、stored/idempotency owner成员逐项存在且同generation/cursor | 只重放original stored surface；不能用stage result重建success |
| `FullyAbsent` | reservation和全部冻结identity/key成员都被完整证明为0，且没有orphan pointer/relation | 返回unknown/internal后的上层显式新调用资格；本栈帧不静默重跑 |
| `Indeterminate` | partial、mixed generation、unavailable、duplicate current、relation contradiction或无法完整证明 | fail-closed hold + 既有reconciliation/quarantine；不repair、不猜winner |

只读inspection不能用candidate字段、expected version、assigned cursor或局部view row推断commit。S2/S3必须为每个family列出
whole-group member key，才能宣称该family可inspection；本批不新建generic inspector port，也不扩写异常处置流程。

durable与fake实现必须在同一具名method上保持：same-UoW read-your-staged-write规则、first insert-if-absent、每个mutable
pointer独立CAS、immutable old row保留、stage不可见直到whole-group commit、rollback全不可见、CAS winner/loser、commit
unknown实际已提交/未提交两种底层状态，以及whole-group inspection三分支。fake不得自动创建first proof、自动补index、
last-write-wins、把stage当commit、或因测试方便返回duplicate success。

### 93.8 S1 Static Review 与恢复门

| check | result |
|---|---:|
| undefined `AcceptedSandboxWriteContext` | closed as typed linear borrowed-UoW capability |
| family markers | `8/8` registered；family payload仍待S2/S3 |
| target-vs-current expectation separation | completed |
| first formal proof + same-UoW absence dimensions | completed shared rule |
| update Version provenance / CAS loser full restart | completed |
| staged result vs committed result separation | completed |
| error variants / exhaustive mapping | `8/8` |
| writer begin/cursor/commit/rollback/external capability | `0/0/0/0/0` |
| commit-unknown local success inference | `0` |
| new public callable / Query writer use | `0 / 0 of 13` |
| new L1/L2 blocker | `0` |

S1只完成 shared shell，不等于八类 writer 已闭合。下一批必须读取本节及 execution/boundary/policy/capture/handoff 的
Step 6/A2 current contracts，逐类定义 candidate、first proof、index expectation、具名method、atomic member key与
inspection set。未经用户确认不得进入S2，A3-2整体继续为in progress。

## EOF Current Recovery Override: `7R-04A-A3-2-S1` completed, user review pending

本节是read artifact物理EOF current authority。A3-2 shared staged authorization与事务纪律已完成；八类family payload
尚未完成，因此不得把A3-2标记为completed，也不得进入A3-3/A3-4/A4、Step 8或正式`03`回填。

```text
current_internal_task = A3-2-S1 shared staged writer contract review gate
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = in_progress_s1_completed_wait_user_review
a3_2_s1_shared_authorization_transaction = completed
a3_2_s2_execution_boundary_policy_capture_handoff = pending
a3_2_s3_failure_cleanup_redline = pending
a3_2_s4_eight_family_total_audit = pending
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
accepted_write_context = defined_typed_linear_borrowed_uow
target_pointer_expectation_separation = completed
status_view_family_markers = 8/8_registered_payload_pending
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
next_required_reads = step6_execution_boundary_policy_capture_handoff_current_contracts|A2_F1_F2_reader_bindings|A3_2_S1_shared_contract
next_allowed_action = wait_user_review_before_A3_2_S2
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 94. A3-2-S2 Primary/Lifecycle Status-View Writer Contract

### 94.1 Current authority 与 persistence foundation 激活

用户确认已消费S1停审门。本节显式激活文件前部`Historical-Position Working Draft: A3-2-S2 Persistence Model`的
`HP-S2.1~HP-S2.4`，并裁决其为本批persistence foundation：Step 6五个`*SourceSnapshot`继续是transient checked helper；
durable层只保存family-specific immutable materialization image、A2 immutable binding和separate mutable pointer row；public
view正文不持久化。前部working state不是独立EOF authority，本节及其后续S2段落才是current contract。

五类image放在contracts crate的internal persistence module，由对应view-source owner提供`pub(crate)` checked conversion；
application只拿到已校验image，infra只拿到可编码image。这样无需向infra开放Step 6 private source字段，也不允许infra从散装row
重建candidate。image codec必须穷尽编码closed enums/sets；unknown discriminant、duplicate set member、missing required field、
wrong ref kind或schema generation不匹配均返回integrity error，不采用default/skip-unknown。

以下三个current-position family contract先处理execution、boundary、policy。capture/handoff在P3处理。代码块是可落码type
shape；字段为private，除明确列出的checked constructor/getter外没有struct literal、serde-derived unchecked constructor或
`Default`。

### 94.2 Shared current-pointer disposition

boundary与handoff可能更新current exact target，也可能只更新historical exact target；policy的新decision必须成为context
current。为避免`Option<Versioned<_>>`同时表达“absent、replace、preserve”三种不同语义，使用closed plan：

```rust
/// source owner声明本次exact target相对context current selector的正式位置。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SandboxStatusTargetPosition {
    Current,
    Historical,
}

/// 会写入context current row的两种optimistic plan。
pub enum SandboxCurrentPointerWritePlan<R> {
    /// 同一UoW已完整证明current row不存在；writer使用insert-if-absent。
    InstallFromAbsent,
    /// 同一UoW读取的current row将由独立CAS替换。
    Replace { expected: Versioned<R> },
}

/// historical exact target不写current row，但仍保留same-UoW relation observation。
pub enum SandboxCurrentPointerPreservePlan<R> {
    Absent,
    Other { observed: Versioned<R> },
}
```

`WritePlan::Replace`的row target可以等于candidate exact target（同target lifecycle refresh），也可以是旧target（新target
成为current）；两者都写入candidate的新binding。`PreservePlan::Other`要求observed target明确不等于candidate target且owner
context相等；writer不CAS该row，也不把它列入本次unknown-inspection committed成员。若same-UoW读到pointer指向candidate却要求
preserve，或source proof声明`Current`却提供preserve plan，返回`ExpectationConflict`。任何pointer技术读取失败都不是Absent。

### 94.3 Execution durable image 与 accepted source proof

execution exact logical target就是`ControlledExecutionContextRef`，因此exact-latest与context-current是同一个物理mutable row，
不能实现成两个独立CAS。immutable image逐字段保存Step 6 checked source：

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusMaterializationImage {
    context_ref: ControlledExecutionContextRef,
    environment_identity_ref: Option<ExecutionEnvironmentIdentityRef>,
    intake_status: ControlledExecutionIntakeStatus,
    identity_status: Option<ExecutionEnvironmentIdentityStatus>,
    boundary_ref: Option<CoherentBoundaryRef>,
    boundary_status: Option<CoherentBoundaryStatus>,
    policy_decision_ref: Option<PolicyExecutionDecisionRef>,
    policy_status: Option<PolicyExecutionDecisionStatus>,
    run_ref: Option<ControlledExecutionRunRef>,
    run_status: Option<ControlledExecutionRunStatus>,
    capture_ref: Option<CaptureFactRef>,
    capture_status: Option<CaptureFactStatus>,
    required_handoffs: Option<RequiredHandoffStatusSet>,
    failure_ref: Option<FailureClassificationRef>,
    failure_status: Option<FailureClassificationStatus>,
    cleanup_guard_ref: Option<CleanupGuardRef>,
    cleanup_status: Option<CleanupGuardStatus>,
    redline_ref: Option<RedlineContainmentRef>,
    redline_status: Option<RedlineContainmentStatus>,
    audit_trace_ref: SandboxAuditTraceRef,
    observed_at: Timestamp,
}

impl SandboxExecutionStatusMaterializationImage {
    /// 只从Step 6 relation-checked source机械复制；不推导visible status。
    pub(crate) fn try_from_checked_source(
        source: &SandboxExecutionStatusSourceSnapshot,
    ) -> Result<Self, StatusViewError>;

    /// 重新调用Step 6 source factory；codec row不能绕过optional-pair和completion guards。
    pub(crate) fn try_rehydrate_source(
        &self,
    ) -> Result<SandboxExecutionStatusSourceSnapshot, StatusViewError>;
}

/// execution source owner已在同一UoW stage完整chain与audit后形成的线性proof。
pub struct AcceptedExecutionStatusSourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    checked_source: SandboxExecutionStatusSourceSnapshot,
}
```

`AcceptedExecutionStatusSourceProof`不实现Clone/Copy/Serialize/Deserialize。其crate-private factory只允许实际改变execution
source chain的winner调用，且必须从UoW read-your-staged-write逐项证明：context owner、所有image中出现的optional owner/ref-status
pair、required handoff set、matching audit与cursor relation均已stage；`checked_source.context_ref/audit_trace_ref`分别等于proof
字段，`uow.assigned_truth_cursor()==Some(source_truth_cursor)`。仅有context intake change、boundary/policy/run/capture等owner change、
failure/cleanup/redline change中至少一项被accepted且实际改变source image时才可形成proof；重复等价operation在幂等preflight
返回，不调用writer。

### 94.4 Execution candidate、first proof 与 singleton expectation

```rust
pub struct SandboxExecutionStatusMaterializationCandidate {
    view_ref: SandboxExecutionStatusViewRef,
    image: SandboxExecutionStatusMaterializationImage,
    binding: SandboxExecutionStatusViewBinding,
}

impl SandboxExecutionStatusMaterializationCandidate {
    /// view ref由source owner预分配；cursor/audit只能从accepted proof复制。
    pub(crate) fn try_from_accepted_source(
        view_ref: SandboxExecutionStatusViewRef,
        proof: &AcceptedExecutionStatusSourceProof,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}

pub struct ExecutionStatusFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    image_history_count: u64,
    immutable_binding_count: u64,
    singleton_pointer_count: u64,
    source_relation_count: u64,
}

/// execution只有一个物理singleton pointer；mode必须与target expectation相等。
pub enum ExecutionStatusSingletonIndexExpectation {
    FirstInsert,
    ReplaceSamePointer,
}
```

candidate factory必须确认`materialized_at >= checked_source.observed_at`，image rehydration与proof source完全相等，binding
context/view/cursor/audit/time逐项等于candidate；view ref在UoW中计数为0。它不得预先调用public view factory并保存view body，
但可在application debug assertion中调用factory验证完整source；该临时结果必须立即丢弃且不得交infra。

`ExecutionStatusFirstMaterializationProof`只由writer-side repository helper在同一UoW构造，合法count固定为
`image_history/binding/pointer/source-relation = 0/0/0/0`，同时formal context owner与accepted staged source count均为1。这里的
`source_relation_count=0`指materialization cursor/audit relation尚未写，不指canonical context不存在。A2
`SandboxExecutionStatusAbsenceProof`明确不能转换成该proof。

execution write expectation只允许两组：

| target expectation | singleton index expectation | exact behavior |
|---|---|---|
| `FirstForFormalTarget(proof)` | `FirstInsert` | insert image、binding、history relation和唯一context pointer；全部insert-if-absent。 |
| `ReplaceExactTarget(Versioned<old binding>)` | `ReplaceSamePointer` | old binding必须就是同一context singleton row value；以该row Version一次CAS指向new binding。 |

`First + ReplaceSamePointer`、`Replace + FirstInsert`、旧binding context不等、old/new view ref相等、source cursor未严格推进或
source audit不等accepted proof均为candidate/expectation error。execution没有第二个context-current version，也没有
historical position；adapter若执行两次CAS即违反contract。

execution atomic group至少包含：本次实际改变的canonical context/identity/boundary/policy/run/capture/handoff/failure/cleanup/
redline source members及其既有owner relation、matching source audit、assigned truth cursor relation、new image、new immutable
binding、context-view history row、singleton latest/current row，以及原operation要求的stored/idempotency/relay/stale members。
writer只stage image/binding/history/singleton/cursor-audit linkage；source owner stage其余成员并commit。

### 94.5 Boundary durable image 与 accepted source proof

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusMaterializationImage {
    boundary_ref: CoherentBoundaryRef,
    context_ref: ControlledExecutionContextRef,
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    requirement_ref: BoundaryRequirementSetRef,
    decision_ref: Option<BoundaryEstablishmentDecisionRef>,
    decision_status: Option<BoundaryEstablishmentDecisionStatus>,
    capability_ref: Option<BackendCapabilitySummaryRef>,
    capability_status: Option<BackendCapabilitySummaryStatus>,
    isolation_handle_ref: Option<IsolationEnvironmentHandleRef>,
    handle_status: Option<IsolationEnvironmentHandleStatus>,
    lease_ref: Option<LeaseRecordRef>,
    boundary_status: CoherentBoundaryStatus,
    audit_trace_ref: SandboxAuditTraceRef,
    observed_at: Timestamp,
}

impl BoundaryStatusMaterializationImage {
    pub(crate) fn try_from_checked_source(
        source: &BoundaryStatusSourceSnapshot,
    ) -> Result<Self, StatusViewError>;
    pub(crate) fn try_rehydrate_source(
        &self,
    ) -> Result<BoundaryStatusSourceSnapshot, StatusViewError>;
}

pub struct AcceptedBoundaryStatusSourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    boundary_ref: CoherentBoundaryRef,
    position: SandboxStatusTargetPosition,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    checked_source: BoundaryStatusSourceSnapshot,
}
```

proof factory只接受boundary establishment/failure/release或matching handle/lease canonical transition的winner。它必须证明
boundary、identity、requirement、decision、capability、handle、lease relation及audit在同一UoW staged/loaded group内完整，
并由canonical context-boundary relation给出`Current | Historical`；不得按created/observed time、handle latest或Query selector
判断position。backend adapter output本身、capability refresh结果或release receipt都不能直接构造proof。

### 94.6 Boundary candidate、first proof 与双pointer expectation

```rust
pub struct BoundaryStatusMaterializationCandidate {
    view_ref: BoundaryStatusViewRef,
    image: BoundaryStatusMaterializationImage,
    binding: BoundaryStatusViewBinding,
}

pub struct BoundaryStatusFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    boundary_ref: CoherentBoundaryRef,
    exact_image_history_count: u64,
    exact_binding_count: u64,
    exact_latest_pointer_count: u64,
    source_relation_count: u64,
}

pub struct BoundaryStatusContextCurrentRow {
    context_ref: ControlledExecutionContextRef,
    boundary_ref: CoherentBoundaryRef,
    binding: BoundaryStatusViewBinding,
}

pub enum BoundaryStatusContextPointerPlan {
    Write(SandboxCurrentPointerWritePlan<BoundaryStatusContextCurrentRow>),
    Preserve(SandboxCurrentPointerPreservePlan<BoundaryStatusContextCurrentRow>),
}

pub struct BoundaryStatusIndexExpectation {
    context_current: BoundaryStatusContextPointerPlan,
}
```

candidate factory signature与execution相同形状：接收preallocated `BoundaryStatusViewRef`、
`&AcceptedBoundaryStatusSourceProof`和trusted `materialized_at`，机械形成image与A2 binding。first proof要求formal boundary owner
count=1，且exact image history/binding/latest pointer/source relation均为0；context current row可为0或指向另一个完整old boundary，
其expectation不放在first proof而放在`BoundaryStatusIndexExpectation`，避免“first exact target”等于“context current absent”。

closed plan矩阵：

| accepted position | exact target mode | allowed context plan | staged pointer behavior |
|---|---|---|---|
| Current | first | `Write(InstallFromAbsent)`或`Write(Replace old-current)` | insert exact latest；安装/替换context current为new binding。 |
| Current | replace | `Write(Replace same-boundary current)` | exact latest与context current分别以各自Version CAS。 |
| Historical | first | `Preserve(Absent|Other)` | insert exact latest；context current零写。 |
| Historical | replace | `Preserve(Absent|Other)` | CAS exact latest；context current零写。 |

Current replacement时，target expectation中的`Versioned<BoundaryStatusViewBinding>`属于exact-latest row；context plan中的
`Versioned<BoundaryStatusContextCurrentRow>`属于另一个mutable row，两个Version必须分别来自同一UoW读取且old binding逐字段
一致。first current若替换old current，old target必须不等new boundary；old image/binding/history全部保留。Historical preserve
other时other target也必须不等candidate；writer不得为了“顺便修current”写它。

boundary atomic group至少包含changed boundary/decision/capability/handle/lease owners与relations、source audit/cursor、new image、
new immutable binding、exact boundary-view history、exact-latest pointer、按plan optional context-current pointer、source cursor/audit
relation，以及owner operation的stored/idempotency/relay/stale members。backend establish/release call必须发生在本context形成前或
commit confirmed后的其它阶段；writer持有UoW时external call count固定为0。

### 94.7 Policy durable image 与 accepted source proof

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryMaterializationImage {
    decision_ref: PolicyExecutionDecisionRef,
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    context_ref: ControlledExecutionContextRef,
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    requirement_ref: BoundaryRequirementSetRef,
    boundary_ref: CoherentBoundaryRef,
    handle_ref: IsolationEnvironmentHandleRef,
    generation_ref: ResourceRef,
    decision_status: PolicyExecutionDecisionStatus,
    action_statuses: PolicyActionDecisionStatusSet,
    audit_trace_ref: SandboxAuditTraceRef,
    observed_at: Timestamp,
}

impl PolicyDecisionSummaryMaterializationImage {
    pub(crate) fn try_from_checked_source(
        source: &PolicyDecisionSummarySourceSnapshot,
    ) -> Result<Self, PolicyDecisionViewError>;
    pub(crate) fn try_rehydrate_source(
        &self,
    ) -> Result<PolicyDecisionSummarySourceSnapshot, PolicyDecisionViewError>;
}

pub struct AcceptedPolicyDecisionSummarySourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    policy_decision_ref: PolicyExecutionDecisionRef,
    policy_snapshot_ref: PolicyApplicabilitySnapshotRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    checked_source: PolicyDecisionSummarySourceSnapshot,
}
```

proof只由`evaluate_policy_execution` accepted immutable decision whole-group owner形成，要求applicability snapshot、complete
high-risk action decisions、formal decision、boundary/handle/generation linkage与audit同组，且decision/action coverage经Step 6
source factory完整通过。它不能由Query、boundary writer、runtime launch path、policy adapter raw allow/deny或重新读取policy正文
形成。一个accepted evaluation总是创建新的formal decision identity；重评不能覆盖旧decision。

### 94.8 Policy candidate、first-only target 与 context current plan

```rust
pub struct PolicyDecisionSummaryMaterializationCandidate {
    view_ref: PolicyDecisionSummaryViewRef,
    image: PolicyDecisionSummaryMaterializationImage,
    binding: PolicyDecisionSummaryViewBinding,
}

pub struct PolicyDecisionSummaryFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    policy_decision_ref: PolicyExecutionDecisionRef,
    exact_image_count: u64,
    exact_binding_count: u64,
    exact_latest_pointer_count: u64,
    source_relation_count: u64,
}

pub struct PolicyDecisionSummaryContextCurrentRow {
    context_ref: ControlledExecutionContextRef,
    policy_decision_ref: PolicyExecutionDecisionRef,
    binding: PolicyDecisionSummaryViewBinding,
}

pub struct PolicyDecisionSummaryIndexExpectation {
    context_current:
        SandboxCurrentPointerWritePlan<PolicyDecisionSummaryContextCurrentRow>,
}
```

candidate由accepted proof和preallocated view ref机械形成；binding的decision/snapshot/context/cursor/audit/time必须与image/proof
完全相等。first proof要求formal decision owner=1，exact image/binding/latest/source relation=`0/0/0/0`。context current可Absent，
也可指向另一个old decision；后者必须携带同一UoW的`Versioned<PolicyDecisionSummaryContextCurrentRow>`并原子替换。

policy marker的`TargetExpectation`在本family只允许`FirstForFormalTarget`。传入`ReplaceExactTarget`必须在application adapter
exhaustive match中返回`CandidateRejected`，repository调用数为0；不能以action row“后来补齐”、reference refresh或view stale为
理由替换同一formal decision summary。新的policy evaluation必须形成new decision/new view/new exact binding，并替换context-current；
旧decision image/binding/latest row继续支持Exact historical read。policy没有Historical preserve plan，因为此writer的唯一caller
就是accepted new evaluation owner；历史缺失或损坏由既有reconciliation/explicit migration边界处理，Query不补写。

policy atomic group至少包含new applicability/action/formal decision owners与complete coverage indexes、source audit/cursor、new image、
new immutable binding、exact decision binding/latest row、context-current insert/CAS、source cursor/audit relation，以及evaluation
operation的stored/idempotency/relay/stale members。policy adapter调用必须在pre-write UoW之外完成并映射为checked source inputs；
writer不读取policy body、不评估marker、不批准tool/runtime launch。

### 94.9 P2 family registration 与局部静态审计

```rust
impl SandboxStatusViewMaterializationFamily for ExecutionStatusMaterializationFamily {
    type Candidate = SandboxExecutionStatusMaterializationCandidate;
    type Binding = SandboxExecutionStatusViewBinding;
    type ViewRef = SandboxExecutionStatusViewRef;
    type FirstTargetProof = ExecutionStatusFirstMaterializationProof;
    type IndexExpectation = ExecutionStatusSingletonIndexExpectation;
    type AcceptedSourceProof = AcceptedExecutionStatusSourceProof;
}

impl SandboxStatusViewMaterializationFamily for BoundaryStatusMaterializationFamily {
    type Candidate = BoundaryStatusMaterializationCandidate;
    type Binding = BoundaryStatusViewBinding;
    type ViewRef = BoundaryStatusViewRef;
    type FirstTargetProof = BoundaryStatusFirstMaterializationProof;
    type IndexExpectation = BoundaryStatusIndexExpectation;
    type AcceptedSourceProof = AcceptedBoundaryStatusSourceProof;
}

impl SandboxStatusViewMaterializationFamily for PolicyDecisionSummaryMaterializationFamily {
    type Candidate = PolicyDecisionSummaryMaterializationCandidate;
    type Binding = PolicyDecisionSummaryViewBinding;
    type ViewRef = PolicyDecisionSummaryViewRef;
    type FirstTargetProof = PolicyDecisionSummaryFirstMaterializationProof;
    type IndexExpectation = PolicyDecisionSummaryIndexExpectation;
    type AcceptedSourceProof = AcceptedPolicyDecisionSummarySourceProof;
}
```

| P2 check | result |
|---|---:|
| family payload registration | `3/3` |
| durable image explicit fields / checked rehydrator | `3/3` |
| accepted proof binds transaction/cursor/audit/checked source | `3/3` |
| formal first proof exact zero dimensions | execution `4`；boundary `4`；policy `4` |
| mutable pointer versions | execution `1` physical；boundary exact/current separated；policy first exact + context current |
| exact replacement | execution yes；boundary yes；policy no by closed contract |
| public view body/source helper serde | `0/0` |
| writer external/begin/cursor/commit capability | `0/0/0/0` |
| Query writer use / public callable change | `0/13` / `0` |
| new L1/L2 blocker | `0` |

## EOF Current Working Batch: `7R-04A-A3-2-S2-P2` execution/boundary/policy completed

本节是read artifact物理EOF current authority，并激活前部HP-S2 persistence foundation。S2的P1、P2已完成；capture/handoff
payload、五方法与inspection/parity/audit尚未完成，因此S2和A3-2整体仍为in progress，正式`03`继续冻结。

```text
current_internal_task = A3-2-S2-P3 capture_handoff contracts
a3_2_s2_status = in_progress_p1_p2_completed
a3_2_s2_p1_persistence_model = completed
a3_2_s2_p2_execution_boundary_policy = completed
a3_2_s2_p3_capture_handoff = pending
a3_2_s2_p4_writer_inspection_audit_sync = pending
primary_family_payload_coverage = 3/5
status_view_family_payload_total = 3/8
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
next_required_reads = step6_capture_handoff_source_view|A2_F2_binding_selection|S1_shared_contract|S2_P1_P2
next_allowed_action = write_A3_2_S2_P3_capture_handoff_only
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 96. A3-2-S2 Named Writer、Exact Inspection 与 Parity

### 96.1 Historical-position payload激活与S1精化

本节显式激活文件前部两个working draft：`HP-S2.1~HP-S2.4` persistence model和`HP-S2.5~HP-S2.9`
capture/handoff payload。它们与current-position §§94.1~94.9共同构成S2五类family的完整输入；其前部位置只反映分批写入
轨迹，不降低契约效力。若前部working-state恢复文本与本节EOF恢复块冲突，以本节及后续物理EOF为准。

S1 §93.7把`FullyAbsent`简写为“reservation和全部冻结identity/key成员为0”。现有idempotency B4已经明确多数业务采用
reservation-only UoW，source finalization开始时idempotency reservation可能合法地已提交并保持`Reserved`。因此本节作如下
可落码精化：

| owner shape | finalization `FullyAbsent` minimum proof |
|---|---|
| reservation与source finalization确实在同一UoW | reservation candidate、source after-image、audit/view/binding/pointer after-image、stored completion等全部冻结new members为0；所有existing mutable rows保持before-state。 |
| reservation已在更早UoW confirmed | exact reservation仍是同一identity/ref的合法`Reserved` before-state；本次source/audit/view/binding/stored completion after-image全无，全部mutable source/pointer仍等于frozen before-state。 |

这不是允许局部absence。`FullyAbsent`必须由operation owner既有private `FrozenGroupPlan`逐项证明；只证明new view row不存在、
只看到idempotency `Reserved`、rollback返回成功、或external side effect未知都不够。若source after-state已出现但view group缺失、
pointer已移动但image缺失、stored completion已出现但audit/view缺失，结果只能是`Indeterminate`。status writer不拥有operation-wide
inspector；本节只固定它必须向owner frozen plan贡献哪些exact keys和判定成员。

### 96.2 Five-method production stage port

五类primary/lifecycle writer由一个capability-segregated application port承接；S3再定义三个safety method，最终总数为
`5 + 3 = 8`。本trait不是42个public application callable的一部分，不对api/worker/jobs/protocol暴露，也不接受runtime
family enum或generic payload。

```rust
/// primary/lifecycle source owner在同一borrowed UoW内调用的五个具名stage方法。
pub trait SandboxPrimaryStatusMaterializationWriter: Send + Sync {
    async fn stage_execution_status_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, ExecutionStatusMaterializationFamily>,
        candidate: SandboxExecutionStatusMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<ExecutionStatusMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<ExecutionStatusMaterializationFamily>,
        SandboxStatusViewStageError,
    >;

    async fn stage_boundary_status_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, BoundaryStatusMaterializationFamily>,
        candidate: BoundaryStatusMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<BoundaryStatusMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<BoundaryStatusMaterializationFamily>,
        SandboxStatusViewStageError,
    >;

    async fn stage_policy_decision_summary_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, PolicyDecisionSummaryMaterializationFamily>,
        candidate: PolicyDecisionSummaryMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<PolicyDecisionSummaryMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<PolicyDecisionSummaryMaterializationFamily>,
        SandboxStatusViewStageError,
    >;

    async fn stage_capture_summary_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, CaptureSummaryMaterializationFamily>,
        candidate: CaptureSummaryMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<CaptureSummaryMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<CaptureSummaryMaterializationFamily>,
        SandboxStatusViewStageError,
    >;

    async fn stage_material_handoff_status_materialization(
        &self,
        context: AcceptedSandboxWriteContext<'_, MaterialHandoffStatusMaterializationFamily>,
        candidate: MaterialHandoffStatusMaterializationCandidate,
        expectation: SandboxStatusViewWriteExpectation<MaterialHandoffStatusMaterializationFamily>,
    ) -> Result<
        StagedSandboxStatusViewWrite<MaterialHandoffStatusMaterializationFamily>,
        SandboxStatusViewStageError,
    >;
}
```

使用仓内current native `async fn in trait`风格。若7R-04B的object-safe runtime assembly需要boxed future，只允许逐method作
borrowed lifetime等价转换；不能添加`async-trait`依赖、`'static` future、detached task、generic sixth method或把UoW存进writer
字段。`AcceptedSandboxWriteContext`按值消费，method返回后其borrow结束，source owner重新取得原UoW并负责后续stage/commit或
rollback；writer不能吞掉UoW handle。

### 96.3 Per-method fixed stage algorithm

每个method必须按以下顺序实现。pure check可以在首次repository write前完成；一旦任何stage已发生后返回Err，caller只能对
整个UoW rollback，不能修candidate后再次调用writer：

```text
1. consume typed context; compare family and transaction identities
2. compare accepted proof <-> candidate image/binding/view/cursor/audit/time
3. rehydrate image through the Step 6 checked source factory
4. read exact formal owner/source group through the same UoW
5. validate FirstForFormalTarget or ReplaceExactTarget, including all zero/count/Version rules
6. validate every family index plan and current/historical position
7. prove new view/image/binding/history/source-relation keys are all absent
8. stage immutable image, immutable binding and immutable history relation
9. stage exact-latest insert/CAS and optional context-current insert/CAS
10. stage source-cursor/audit materialization relation and completeness indexes
11. re-read staged group through the same UoW and compare all keys/relations
12. return family-typed StagedSandboxStatusViewWrite; do not commit
```

stage 4~7 repository unavailable映`RepositoryUnavailable`且零stage；stage 8以后任一错误即使是deferred constraint/adapter error也
返回有限stage error并要求whole-UoW rollback。不得catch后继续stage其它family。stage 11不是commit证明，只检查fake/durable
都必须支持的read-your-staged-write relation；returned `transaction_ref`、view ref、binding与mode必须逐项来自context/
candidate/expectation，不由adapter替换。

各method的差异只在下表，不允许infra共享一个runtime `match family`来补语义：

| method | exact mode | mutable pointer writes | additional hard validation |
|---|---|---|---|
| execution | first/replace | one physical context singleton insert/CAS | no historical branch；complete execution pair/source guards。 |
| boundary | first/replace | exact-latest + optional context-current | accepted Current/Historical与Write/Preserve plan一致；handle/lease matrix。 |
| policy | first only | exact-latest insert + context-current insert/CAS | complete action coverage；`ReplaceExactTarget` repository writes=`0`。 |
| capture | first/replace | exact-latest only | immutable run-to-capture 1/1/1；complete material/observability coverage。 |
| handoff | first/replace | exact-latest + optional context-current | complete plan/progress/current relay；derived delivery不持久化。 |

writer返回成功后，source owner仍必须stage其operation frozen plan中尚未完成的stored/idempotency/relay/stale members。只有
`SandboxUnitOfWorkManager::commit`返回matching confirmed receipt且truth cursor等于accepted proof cursor，source owner才可形成
fresh success/stored surface。receipt mismatch是`InternalInvariantViolation`，不能把stage result升级为success。

### 96.4 Frozen owner member plan 与 family inspection key

commit前，source owner从accepted proof、preallocated refs和existing B4 frozen operation plan构造private inspection key。它不
保存candidate、expected `Version`、public view、raw body/error或transaction ref作为lookup key；transaction ref只保留诊断。
所有`*SourceMemberKeys`只含typed refs/closed keys，不含可被拿来重算业务status的正文。

```rust
/// 复用既有idempotency B4 exact owner plan；optional成员必须显式Some/None冻结。
struct SandboxStatusViewOwnerCompletionKeys {
    idempotency_identity: SandboxIdempotencyIdentity,
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    stored_result_ref: Option<SandboxStoredOperationResultRef>,
    relay_record_refs: Vec<SandboxEventRelayRecordRef>,
    // operation-specific typed stale/side-effect refs由owner plan保存，不降级为string/object map。
}

struct ExecutionStatusWholeGroupInspectionKey {
    source_keys: ExecutionStatusSourceMemberKeys,
    context_ref: ControlledExecutionContextRef,
    view_ref: SandboxExecutionStatusViewRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
}

struct BoundaryStatusWholeGroupInspectionKey {
    source_keys: BoundaryStatusSourceMemberKeys,
    context_ref: ControlledExecutionContextRef,
    boundary_ref: CoherentBoundaryRef,
    view_ref: BoundaryStatusViewRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
}

struct PolicyDecisionSummaryWholeGroupInspectionKey {
    source_keys: PolicyDecisionSummarySourceMemberKeys,
    context_ref: ControlledExecutionContextRef,
    policy_decision_ref: PolicyExecutionDecisionRef,
    policy_snapshot_ref: PolicyApplicabilitySnapshotRef,
    view_ref: PolicyDecisionSummaryViewRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
}

struct CaptureSummaryWholeGroupInspectionKey {
    source_keys: CaptureSummarySourceMemberKeys,
    context_ref: ControlledExecutionContextRef,
    run_ref: ControlledExecutionRunRef,
    capture_ref: CaptureFactRef,
    view_ref: CaptureSummaryViewRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
}

struct MaterialHandoffStatusWholeGroupInspectionKey {
    source_keys: MaterialHandoffStatusSourceMemberKeys,
    context_ref: ControlledExecutionContextRef,
    handoff_ref: HandoffFactRef,
    view_ref: MaterialHandoffStatusViewRef,
    source_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    owner_completion: SandboxStatusViewOwnerCompletionKeys,
}
```

这些是application-private conceptual shapes，不新增generic inspector port。每个operation owner继续调用现有exact repositories，
在一个新的fair committed read snapshot中按key逐项读取。`relay_record_refs`允许空，但必须在commit前冻结；inspection不能通过
扫描source cursor、topic或time发现“也许属于本operation”的relay。stored result是否required由operation finalizer的existing
contract决定，不能为了得到FullyAbsent把required member标成None。

family source key的closed成员如下：

| source key set | exact frozen members |
|---|---|
| execution | context；image中出现的optional identity/boundary/policy/run/capture/failure/cleanup/redline refs；required handoff refs；matching canonical relation keys。 |
| boundary | boundary、context、identity、requirement、optional decision/capability/handle/lease refs及boundary-owner relation keys。 |
| policy | formal decision、applicability snapshot、complete `HighRiskActionDecisionRefSet`、context/identity/requirement/boundary/handle/generation relations。 |
| capture | complete lineage、guard、optional output summary key、expected material keys、exact material row keys、observability ref、run-to-capture relation。 |
| handoff | complete lineage、handoff fact、target plan target keys、progress keys、source material/observability ownership keys、optional cleanup guard、current-cursor relay refs。 |

### 96.5 Family whole-group committed members

inspection对每类都必须读取下列materialization成员；任何一项不可读、重复、owner不等、cursor/audit不等或half relation都会使
结果成为`Indeterminate`，不能缩成status-view-only `FullyAbsent`：

| family | immutable members | mutable/index members | mandatory cross-relations |
|---|---|---|---|
| execution | exact image by view ref；immutable binding；context-view history | one singleton latest/current row | image rehydrates；binding/view/context/cursor/audit相等；source keys after-state与owner completion同代。 |
| boundary | image；binding；exact boundary-view history | exact-latest；按plan changed context-current | current target/position合法；boundary/handle/lease source relation与cursor/audit同代。 |
| policy | image；binding；exact decision history | first exact-latest；changed context-current | decision/snapshot/action coverage complete；old current history保留；stored evaluation completion匹配。 |
| capture | image；binding；exact capture-view history | exact-latest | run-to-capture仍1/1/1；material/observability keys complete；source cursor/audit relation匹配。 |
| handoff | image；binding；exact handoff-view history | exact-latest；按plan changed context-current | plan/progress/source keys/current relay complete；rehydrated delivery与aggregate合法。 |

`Committed`还要求owner frozen plan的canonical source after-state、required audit、idempotency/stored completion和显式optional relay/
stale members全部成立；然后从durable image重建Step 6 source并与committed canonical source逐字段对账。只在whole group完整时
才能加载original stored surface replay；inspection本身不调用public view factory生成替代success。

`FullyAbsent`要求new image/binding/history/source-materialization relation全部为0，所有planned insert pointer为0，所有planned
CAS pointer和canonical mutable source仍逐字段等于frozen before-state，new source audit/stored completion/optional after-members为0，
且idempotency处于owner plan允许的exact baseline。immutable pre-existing canonical source/history不要求删除或为0。

`Indeterminate`覆盖：任一partial new member、after-source与before-pointer混合、pointer指向new binding但image丢失、image存在但
stored completion缺失、wrong generation/cursor/audit、duplicate current、repository unavailable、closed set coverage不完整、
external result状态仍未知，或无法同时证明Committed/FullyAbsent。它只进入既有strict hold/reconciliation/quarantine owner，
本批不设计repair、人工审批或incident workflow。

## EOF Current Working Batch: `7R-04A-A3-2-S2-P4A` methods/inspection completed

本节是read artifact物理EOF current authority，并已激活P1/P3 historical-position payload。五方法、stage算法和五类inspection
key已完成；P4B仍需完成durable/fake parity、static total audit及四层恢复同步，S2暂不标记completed。

```text
current_internal_task = A3-2-S2-P4B parity_static_audit_recovery_sync
a3_2_s2_status = in_progress_p4a_completed
a3_2_s2_p1_persistence_model = completed
a3_2_s2_p2_execution_boundary_policy = completed
a3_2_s2_p3_capture_handoff = completed
a3_2_s2_p4a_methods_inspection = completed
a3_2_s2_p4b_parity_audit_sync = pending
primary_family_payload_coverage = 5/5
primary_named_writer_methods = 5/5
primary_whole_group_inspection_keys = 5/5
formal_03_writeback = forbidden
new_l1_l2_blocker = 0
next_allowed_action = write_A3_2_S2_P4B_only
commit_required = no
```

### 96.6 Policy image rehydration compile closure

P4B反向审计发现§94.7初稿只保存`PolicyActionDecisionStatusSet`，不足以在process restart后重新证明formal decision声明的
action ref set、每个action的aggregate owner/snapshot/requirement/boundary/capability/handle/generation与decision time。仅在写入时
校验一次、decode时信任status set，会让durable adapter成为隐含truth owner。当前contract因此用下列shape替换§94.7的policy
image字段集；其它四类image不变：

```rust
/// durable policy image中一个action decision的最小caller-safe lineage proof item。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyActionDecisionMaterializationItem {
    action_decision_ref: HighRiskActionDecisionRef,
    policy_decision_ref: PolicyExecutionDecisionRef,
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    marker_key: HighRiskActionMarkerKey,
    action_kind: HighRiskActionKind,
    requirement_ref: BoundaryRequirementSetRef,
    boundary_ref: CoherentBoundaryRef,
    capability_ref: BackendCapabilitySummaryRef,
    handle_ref: IsolationEnvironmentHandleRef,
    generation_ref: ResourceRef,
    action_status: HighRiskActionDecisionStatus,
    decided_at: Timestamp,
}

/// marker key与action ref双重唯一、按marker key canonical排序的完整lineage item set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyActionDecisionMaterializationItemSet(
    Vec<PolicyActionDecisionMaterializationItem>,
);

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryMaterializationImage {
    decision_ref: PolicyExecutionDecisionRef,
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    context_ref: ControlledExecutionContextRef,
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    requirement_ref: BoundaryRequirementSetRef,
    boundary_ref: CoherentBoundaryRef,
    capability_ref: BackendCapabilitySummaryRef,
    handle_ref: IsolationEnvironmentHandleRef,
    generation_ref: ResourceRef,
    decision_status: PolicyExecutionDecisionStatus,
    decision_action_refs: HighRiskActionDecisionRefSet,
    action_items: PolicyActionDecisionMaterializationItemSet,
    decision_decided_at: Timestamp,
    audit_trace_ref: SandboxAuditTraceRef,
    observed_at: Timestamp,
}
```

`PolicyActionDecisionMaterializationItem`不保存policy source body、authorization summary body、marker value、affected-boundary
正文、decision reason、raw adapter response或launch permission bool。所列字段都是Step 6 domain getter已经暴露的body-free lineage/
status/time。`PolicyActionDecisionMaterializationItemSet::try_from_committed_group`必须证明：

1. set refs与formal `decision_action_refs`双向exact相等，允许二者同时为空；不自动排序输入或去重。
2. 每项`policy_decision_ref/snapshot/requirement/boundary/capability/handle/generation`分别等于formal decision；marker key和action ref
   各自唯一。
3. 每项`decided_at == decision_decided_at`，且`observed_at >= decision_decided_at`；不同time不是stale，而是mixed group error。
4. `PolicyActionDecisionStatusItem`只能从同一item机械投影ref/marker/kind/status，投影后的set与Step 6 source action status set相等。

为让durable codec在不伪造domain object的前提下重建Step 6 transient source，`contracts::views`中补一个crate-private checked
入口。它是现有type的最小实现闭合，不新增字段、public method、status或第二factory语义：

```rust
impl PolicyDecisionSummarySourceSnapshot {
    pub(crate) fn try_from_materialized_fields(
        decision_ref: PolicyExecutionDecisionRef,
        snapshot_ref: PolicyApplicabilitySnapshotRef,
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        requirement_ref: BoundaryRequirementSetRef,
        boundary_ref: CoherentBoundaryRef,
        capability_ref: BackendCapabilitySummaryRef,
        handle_ref: IsolationEnvironmentHandleRef,
        generation_ref: ResourceRef,
        decision_status: PolicyExecutionDecisionStatus,
        decision_action_refs: HighRiskActionDecisionRefSet,
        action_items: PolicyActionDecisionMaterializationItemSet,
        decision_decided_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, PolicyDecisionViewError>;
}
```

该constructor先执行上述四项lineage/coverage/time检查，再机械投影`PolicyActionDecisionStatusSet`，最后构造与现有
`try_new(&PolicyExecutionDecision, &HighRiskActionDecisionSet, observed_at)`逐字段相同的source。两条入口必须共享一个private
validation kernel；测试应证明同一committed group产生相等source。codec不能直接写private source fields。这个local compile
closure可在L4 contracts内完成，新增L1/L2 blocker仍为0；正式`03`回填时须纳入Step 6/7 type ownership，当前不修改正式文档。

### 96.7 Durable/fake parity contract

durable adapter与deterministic fake都实现§96.2同一个production trait和五个exact method；fake不增加production error variant、
generic `stage(kind,payload)`、auto-proof或auto-commit。fake store需要区分committed base、当前transaction staged overlay和
commit disposition，才能真实表达same-UoW与rollback/unknown：

```text
FakeStatusStore
  committed: family-specific images/bindings/history/pointers/source-relations
  transactions[transaction_ref].staged: same family-specific members
  commit_script: Confirmed | NotCommitted(kind) | UnknownApplied | UnknownAbsent | UnknownPartial
```

`UnknownApplied/Absent/Partial`只控制fake UoW manager的底层durable state和返回`StatusUnknown`；它们不是production status，也
不能由writer返回。unknown之后必须通过与durable相同的owner exact-read path得到`Committed/FullyAbsent/Indeterminate`，fake
不得直接把commit script暴露给inspection caller。

| parity dimension | durable required behavior | fake required behavior | forbidden fake shortcut |
|---|---|---|---|
| five methods | exact typed candidate/context/expectation | same signatures and method-specific call record | generic family enum dispatch。 |
| transaction identity | compare context/proof/UoW refs | reject mismatched scripted UoW | silently rebind context。 |
| read-your-staged-write | canonical source/audit/cursor visible only inside same UoW overlay | overlay lookup before committed base | copy proof fields as if rows existed。 |
| first proof | exact owner=1 plus family zero dimensions | explicit scripted counts/relations | `NotFound -> first`、auto-zero。 |
| first race | insert-if-absent constraint yields one winner | deterministic competing transaction winner | both candidates succeed。 |
| exact replacement | same-UoW `Versioned<Binding>` CAS | independent row versions checked | compare binding only or last-write-wins。 |
| context current | separate Version/plan where applicable | separate mutable row and conflict script | reuse exact-latest Version。 |
| policy first-only | reject replacement before repository write | same zero-write rejection | permit same-decision refresh。 |
| immutable retention | old image/binding/history remain | committed vectors retain old rows | overwrite old row in map by target。 |
| stage visibility | invisible to other snapshots before commit | staged overlay private | query sees stage result。 |
| rollback | all staged members invisible | drop complete overlay | keep image/history for debugging。 |
| confirmed commit | whole group atomically visible | move complete overlay once | row-by-row visibility。 |
| not committed | no staged member visible | drop overlay and return exact kind | partial apply with definite failure。 |
| unknown applied | exact whole group durable | commit complete overlay, return unknown | return success from writer/stage result。 |
| unknown absent | exact after-image absent/before-state preserved | drop overlay, return unknown | infer absent from view row only。 |
| unknown partial | at least one half member/contradiction | apply scripted subset, return unknown | normalize to absent or committed。 |
| inspection | one fair snapshot, all family+owner keys | same exact reader path | inspect in-memory candidate/script enum。 |
| repository unavailable | finite `RepositoryUnavailable`/Indeterminate by phase | one-shot scripted failure | map to absence/degraded。 |

fake test support可以提供五个family-specific setup builder，分别装载checked source owners、pointer rows和Versions；builder只能调用
与durable mapper相同的checked image/binding/source constructors。它不得接收raw map、unchecked row、view body或“expected
success”boolean。call record最多保存method kind、transaction ref、typed target/view ref和stage result/error category，不保存
external body、policy/capture payload或evidence。

### 96.8 Minimum parity scenario matrix

以下是实现时的设计验收场景，不是当前已执行测试或真实evidence。每个family都要覆盖共同场景，另加family-specific场景：

| common scenario per family | expected contract result |
|---|---|
| valid first + confirmed commit | full source/image/binding/index/owner group visible；stage result在commit前不可对外。 |
| first while exact target already materialized | `FirstTargetProofRejected`或合法race conflict；零new committed member。 |
| valid replace + confirmed commit | new immutable generation可见，old generation保留，required pointer精确移动。 |
| replace with stale exact Version | `VersionConflict`；candidate与old guard/transition决定作废。 |
| context pointer Version conflict where applicable | whole stage/commit失败；exact latest也不能单独移动。 |
| candidate/proof cursor or audit mismatch | `AuthorizationMismatch | CandidateRejected`；repository stage count 0。 |
| image rehydration relation invalid | `CandidateRejected | IntegrityViolation`；不能持久化degraded image。 |
| rollback confirmed after post-stage failure | image/binding/history/pointers/source relation全部不可见。 |
| commit unknown applied/absent/partial | inspection分别`Committed/FullyAbsent/Indeterminate`，不使用stage result推断。 |

family-specific minimum：execution验证single physical pointer且无double CAS；boundary验证first-current替换old boundary和historical
preserve；policy验证replacement zero-write reject、empty/non-empty action set与durable lineage rehydration；capture验证first
run-to-capture staged relation和later material/observability replacement；handoff验证current/historical plan、完整relay coverage和
derived delivery不落第二份row。共计`5 x 9` common scenario obligations + `5` family-specific groups；这里只固定行为和断言，
不伪造test count、run id或pass result。

### 96.9 S2 static total audit

以下result是设计文本静态计数，不是实现、编译、测试或验收事实：

| forward audit item | result | closure |
|---|---:|---|
| primary/lifecycle families | `5/5` | execution、boundary、policy、capture、handoff。 |
| family marker associated payloads | `5 x 6 = 30/30` | candidate/binding/view ref/first proof/index expectation/accepted proof。 |
| durable image + checked rehydrator | `5/5` | policy使用§96.6 current correction。 |
| public view body persisted | `0/5` | Step 6 view factory保持唯一visible derivation owner。 |
| transient source helper direct serde | `0/5` | only family-specific image codec。 |
| candidate factory | `5/5` | preallocated view ref + accepted proof + trusted materialized time。 |
| formal first proof | `5/5` | Query absence/NotFound conversion=`0`。 |
| exact/latest expectation | `5/5` | execution one physical；boundary/capture/handoff replace；policy first-only。 |
| context/current plan | execution singleton；boundary/policy/handoff explicit；capture immutable run relation | `5/5` family semantics closed。 |
| named production stage methods | `5/5` | generic production method=`0`。 |
| fixed stage algorithm phases | `12/12` | validate/read/stage/re-read；commit excluded。 |
| family whole-group inspection key | `5/5` | source + image/binding/index + owner completion exact keys。 |
| unknown observation branches | `3/3` | Committed/FullyAbsent/Indeterminate with B4 baseline refinement。 |
| durable/fake parity dimensions | `18/18` | same methods/UoW/CAS/visibility/unknown/inspection/error behavior。 |
| new public application callable | `0` | `42/42` unchanged。 |
| Query writer use | `0/13` | Query remains exact read only。 |
| new L1/L2 blocker | `0` | local policy compile closure identified and closed here。 |

反向能力审计：

| forbidden surface | result | fail-closed rule |
|---|---:|---|
| writer begin/commit/rollback | `0/0/0` | source owner retains manager and UoW lifecycle。 |
| writer truth/reference cursor allocation | `0/0` | only matching assigned truth cursor is reused。 |
| writer identity/audit/stored/relay allocation | `0/0/0/0` | all refs preallocated/staged by owner。 |
| backend/tool/runtime/capture/handoff/publisher/cleanup external call | `0` | no external await while accepted context borrows UoW。 |
| infra visible status/policy/capture/handoff semantic derivation | `0` | checked contracts factories only。 |
| partial source saved as degraded success | `0/5` | incomplete row/coverage is candidate reject or integrity。 |
| mutable old binding overwritten/deleted | `0` | immutable history retained。 |
| one Version reused for multiple pointers | `0` | each physical mutable row has own Version。 |
| CAS loser candidate reused | `0` | full owner flow restart required。 |
| local commit-unknown success inference | `0` | owner exact inspection only。 |
| fake-only proof/default/last-write-wins | `0` | same checked constructors and constraints。 |
| implementation/test/run/evidence/signoff claim | `0` | design contract only。 |

### 96.10 Blocker ruling 与 S2 completion gate

| blocker/fact | S2 disposition | rationale |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | keep open | primary writer已闭合5类，但S3三个safety family、S4 eight-family audit、A3-3/A3-4和A4仍未完成。 |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | keep open | S2只闭合stage error与owner completion relation，不独立关闭全Step outcome owner。 |
| `BLK-SBX-CANONICAL-001` | unchanged implementation gate | 未伪造canonical digest verifier、scope digest或evidence。 |
| policy durable rehydration gap | closed locally, no upstream blocker | §96.6补crate-private checked lineage constructor；无public/schema status扩张。 |
| formal `03-详细设计.md` | unchanged/frozen | 当前仍是Step 7 regression中间产物。 |
| implementation/test/evidence/acceptance | not started/not started/no/no | 无commit、run id、test result、evidence alias或签署。 |

S2的P1/P2/P3/P4A/P4B全部完成，五类family payload/method/inspection达到`5/5`。这只完成A3-2的第一组主体/
lifecycle writer，不表示A3-2整体完成。按停审规则，本轮停在S2用户复核门；未经用户确认不得进入S3 failure/control、cleanup、
redline writer，也不得进入S4、A3-3/A3-4/A4、Step 8或正式`03`回填。

## EOF Current Recovery Override: `7R-04A-A3-2-S2` completed, user review pending

本节是read artifact物理EOF current authority，并激活HP-S2.1~HP-S2.9。P1~P4B均已完成；A3-2仍因三个safety family和
eight-family total audit未完成而保持in progress。没有implementation、真实test/run/evidence/acceptance或commit事实。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_internal_task = A3-2-S2 primary/lifecycle writer review gate
gate_status = content_in_progress_wait_user_review
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = in_progress_s1_s2_completed_wait_user_review
a3_2_s1_shared_authorization_transaction = completed
a3_2_s2_execution_boundary_policy_capture_handoff = completed
a3_2_s2_p1_persistence_model = completed
a3_2_s2_p2_execution_boundary_policy = completed
a3_2_s2_p3_capture_handoff = completed
a3_2_s2_p4_methods_inspection_parity_audit = completed
a3_2_s3_failure_cleanup_redline = pending
a3_2_s4_eight_family_total_audit = pending
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
primary_family_payload_coverage = 5/5
status_view_family_payload_total = 5/8
primary_named_writer_methods = 5/5
primary_whole_group_inspection_keys = 5/5
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
next_required_reads = step6_failure_control_cleanup_redline_current_contracts|A2_F3_bindings|S1_shared_contract|S2_completion
next_allowed_action = wait_user_review_before_A3_2_S3
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

## 97. A3-2-S3 Safety Status-View Writer Contract

### 97.1 S3 开工门、输入与非主体边界

用户本轮确认已消费 `A3-2-S2 completed_wait_user_review` 停审门。本批只闭合 failure/control、cleanup、redline
三类 safety status-view 的 durable image、accepted source proof、candidate、formal-first proof、pointer expectation、具名
stage method、whole-group inspection key 与 durable/fake parity。S4 eight-family total audit、A3-3、A3-4、A4、Step 8 和正式
`03-详细设计.md` 均不在本批。

本批重新读取并服从以下 current authority：

| input | consumed contract | S3 constraint |
|---|---|---|
| Step 6 §16.5 failure/control | context-scoped immutable snapshot、bounded merged window、完整 scope summary、cross-page proof 与 snapshot-bound continuation | durable owner保存可分页的完整 snapshot member set，不保存某次 Query 的 page anchor / limit / gap。 |
| Step 6 §16.6 cleanup | exact guard 与 context-current 是两个选择维度；owner coverage、release relation 与完整 redline coverage 必须同 snapshot | new guard first 时context-current可指向旧guard；generic target只承载exact-latest `Versioned`，family index只承载context-current `Versioned`。 |
| Step 6 §16.7 redline | required exact `(context_ref, redline_ref)` selector；每条 redline 独立 current binding；strict security source fail closed | 不建立 context-latest redline，也不以 cleanup 或同 kind redline 覆盖 exact pointer。 |
| A2-F3 reader/binding | failure 分页、cleanup current/exact、redline exact 的 same-snapshot lookup 和 no-write surface已闭合 | writer不消费 Query request、selection proof、absence proof、read gap或 public surface outcome。 |
| S1 shared writer contract | typed linear borrowed-UoW context、formal first、per-pointer Version、stage-only 与 unknown inspection | 三类 method 不 begin/commit/rollback/allocate cursor，也不调用 cleanup/reaper/investigation external port。 |
| S2 persistence ruling | family-specific image + immutable binding + separate mutable pointer；public view body与transient source helper均不直接持久化 | safety family沿用相同分层；不以 security / cleanup 特殊性恢复第二 truth owner。 |

reader-oriented carrier 与 durable source 的边界先固定如下，后续 family 不得局部改写：

| carrier | durable image | reason |
|---|---:|---|
| `FailureControlPageAnchor`、`FailureControlWindowLimit`、`has_more`、returned window | no | 它们属于一次 snapshot-bound page read；同一 immutable snapshot 必须支持多个合法 page。 |
| 三类 selector / selection / absence proof | no | 它们证明本次读取选择或未选择，不是被选择 source 的事实。 |
| 三类 typed read gap / degraded reason / lookup outcome | no | gap 是 reader 对依赖可用性和 watermark 的判断；known half-group 不能保存成 degraded success。 |
| complete canonical source fields、lineage、status、proof、coverage、cursor/audit/time | yes, family-specific image rows | process restart 后必须能经 Step 6 checked constructor 重建同值 source。 |
| public `*View` body、public surface status、DTO | no | Step 6 view factory与Step 8 mapper保持唯一推导链。 |

failure/control、cleanup、redline 的 exception、review、test 与 delivery 只在本批保留必要的 typed fail-closed gate、inspection
key 和 parity obligation，不扩写 repair runbook、incident、人工审批、测试执行或交付签署流程。

### 97.2 Failure/control durable snapshot model

failure/control 的 logical target 是 exact `ControlledExecutionContextRef`，但 durable body 不是一条含无界 `Vec` 的 row。
每次 accepted failure/control source change 创建一个新的 immutable snapshot generation，物理上分为 header、item rows、
cross-link rows与 immutable binding；current pointer只选择该 context 最新完整 generation：

```text
FailureControlStatusSnapshotHeaderImage(view_ref)
  + FailureControlStatusItemImage(view_ref, order_key) [0..n]
  + FailureControlCrossLinkImage(view_ref, link_key) [0..m]
  + immutable FailureControlStatusViewBinding(context_ref, view_ref)
  + mutable context-current row(context_ref -> binding, Version)
```

该模型不把一个 bounded response page 持久化。reader按 binding 的 `view_ref + scope_truth_cursor` 从 immutable member index
读取任意合法 window，再用 request 的 checked anchor/limit构造 Step 6 source。cursor有效期内 old generation 的 header、item、
cross-link和binding必须一起保留；retention回收后走 explicit expired/unavailable surface，不能把old anchor套到new generation。

```rust
/// 一个immutable failure/control snapshot的bounded-header durable image。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FailureControlStatusSnapshotHeaderImage {
    view_ref: FailureControlStatusViewRef,
    context_ref: ControlledExecutionContextRef,
    environment_identity_ref: Option<ExecutionEnvironmentIdentityRef>,
    total_failure_count: u64,
    total_control_count: u64,
    active_failure_count: u64,
    pending_control_count: u64,
    unsafe_control_count: u64,
    total_cross_link_count: u64,
    first_order_key: Option<FailureControlStatusOrderKey>,
    last_order_key: Option<FailureControlStatusOrderKey>,
    scope_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    source_observed_at: Timestamp,
}

/// snapshot中一条failure current status的family-specific durable row。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FailureControlFailureItemImage {
    snapshot_view_ref: FailureControlStatusViewRef,
    failure_ref: FailureClassificationRef,
    lineage: FailureControlViewLineage,
    failure_kind: SandboxFailureKind,
    failure_status: FailureClassificationStatus,
    status_reason: SandboxReason,
    superseded_by_control_ref: Option<ControlFactRef>,
    superseded_by_redline_ref: Option<RedlineContainmentRef>,
    truth_cursor: SandboxTruthCursor,
    last_audit_trace_ref: SandboxAuditTraceRef,
    created_at: Timestamp,
    status_changed_at: Timestamp,
}

/// snapshot中一条control current status的family-specific durable row。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FailureControlControlItemImage {
    snapshot_view_ref: FailureControlStatusViewRef,
    control_ref: ControlFactRef,
    lineage: FailureControlViewLineage,
    control_kind: SandboxControlKind,
    control_status: ControlFactStatus,
    failure_ref: Option<FailureClassificationRef>,
    status_reason: Option<SandboxReason>,
    completion_summary_ref: Option<SafeSummaryRef>,
    truth_cursor: SandboxTruthCursor,
    last_audit_trace_ref: SandboxAuditTraceRef,
    recorded_at: Timestamp,
    status_changed_at: Timestamp,
}
```

两个 item image 都以 `(snapshot_view_ref, truth_cursor, item_kind, canonical_ref)` 为 immutable primary order key，并额外
约束 `(snapshot_view_ref, item_kind, canonical_ref)` 唯一。codec decode 后必须分别调用
`FailureControlFailureItem::try_from_committed_truth` 或
`FailureControlControlItem::try_from_committed_truth`；infra不得跳过 status/kind/lineage/time matrix直接构造 item。
`FailureControlStatusOrderKey`由成功重建的item机械生成，不能相信单独存储的kind/ref排序列。header的first/last key必须等于
member index实际首尾；总数为零时二者都为None，否则二者都为Some。

cross-link durable row使用closed union，而不序列化 Step 6 transient proof object：

```rust
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum FailureControlCrossLinkImage {
    FailureSupersededByControl {
        snapshot_view_ref: FailureControlStatusViewRef,
        failure_ref: FailureClassificationRef,
        failure_lineage: FailureControlViewLineage,
        failure_truth_cursor: SandboxTruthCursor,
        control_ref: ControlFactRef,
        control_lineage: FailureControlViewLineage,
        control_kind: SandboxControlKind,
        control_status_at_relation: ControlFactStatus,
        control_truth_cursor_at_relation: SandboxTruthCursor,
        relation_truth_cursor: SandboxTruthCursor,
        relation_audit_trace_ref: SandboxAuditTraceRef,
    },
    ControlAttachedFailure {
        snapshot_view_ref: FailureControlStatusViewRef,
        control_ref: ControlFactRef,
        control_lineage: FailureControlViewLineage,
        control_status_at_relation: ControlFactStatus,
        relation_truth_cursor: SandboxTruthCursor,
        relation_audit_trace_ref: SandboxAuditTraceRef,
        failure_ref: FailureClassificationRef,
        failure_lineage: FailureControlViewLineage,
        failure_status_at_relation: FailureClassificationStatus,
        failure_truth_cursor_at_relation: SandboxTruthCursor,
    },
}
```

decode后必须调用matching Step 6 proof factory。cross-link key固定为
`(snapshot_view_ref, link_kind, source_ref, target_ref)`；同source item需要的proof恰好一条。redline supersession不在该union中，
因为 Step 6只校验failure item中的exact redline ref/status cardinality，redline source由独立family承接。cross-link row不保存
reason正文、effect、control disposition、page cursor或matching target当前body。

header只保存重建 `FailureControlCommittedScopeSummary` 和选择 immutable member set 所需的字段。它不保存window limit、
page anchor、consumed count、returned count、has_more、read gap或degraded reasons。`source_observed_at`是accepted source mapper
观察时间；binding的`materialized_at`由candidate separately提供且必须不早于它。reader自己的`observed_at`可更晚，不能写回header。

### 97.3 Failure/control complete-source proof 与 candidate

source mutation owner必须先在同一write UoW stage canonical failure/control truth、context merged current-source index、scope
aggregate、matching cross-link relation和required business audit，随后以 repository 的 staged-overlay inspection形成下列proof。
proof不是“所有count看起来相等”的caller assertion；其constructor逐行通过Step 6 checked factories验证 source generation：

```rust
/// 对一个context staged current-source generation完成全量验证后的线性proof。
pub struct AcceptedFailureControlStatusSourceProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    environment_identity_ref: Option<ExecutionEnvironmentIdentityRef>,
    scope_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    total_failure_count: u64,
    total_control_count: u64,
    active_failure_count: u64,
    pending_control_count: u64,
    unsafe_control_count: u64,
    required_cross_link_count: u64,
    first_order_key: Option<FailureControlStatusOrderKey>,
    last_order_key: Option<FailureControlStatusOrderKey>,
    source_observed_at: Timestamp,
}

/// binding-free、preallocated-identity failure/control snapshot candidate。
pub struct FailureControlStatusMaterializationCandidate {
    image: FailureControlStatusSnapshotHeaderImage,
    binding: FailureControlStatusViewBinding,
}

impl FailureControlStatusMaterializationCandidate {
    pub(crate) fn try_from_accepted_source(
        view_ref: FailureControlStatusViewRef,
        accepted: &AcceptedFailureControlStatusSourceProof,
        materialized_at: Timestamp,
    ) -> Result<Self, SandboxStatusViewStageError>;
}
```

accepted proof constructor的机械验证闭集：

1. `transaction_ref`等于当前UoW；assigned truth cursor等于scope/current-source generation cursor；matching source audit已staged。
2. exact context owner为1；environment identity在total非零时为Some，并与每条failure/control lineage相等。
3. merged source index按`(truth_cursor, item_kind, canonical_ref)`严格递增；failure/control unique ref、各自count及首尾key与proof相等。
4. 每个source row经Step 6 item factory成功，truth cursor不晚于scope cursor；active/pending/unsafe重计数与scope aggregate逐项相等。
5. 每个需要cross-link的current item有恰好一个matching relation；无source item的relation、duplicate relation或错lineage均拒绝。
6. source aggregate、merged index、cross-link set和audit relation均来自同一staged generation；旧generation成员不能补当前缺口。
7. `source_observed_at`不早于所有item/status/relation time；count加法checked，任何溢出为integrity violation。

验证可由adapter在同一UoW按稳定key分批扫描，以避免把长期scope读成一个无界application `Vec`。batch size只影响内部
repository读取，不改变一个事务、一个generation和全量计数；每批都绑定同一context/cursor，batch之间不得释放UoW、重开
snapshot或接受新source write。proof只有在最终全量scan、首尾/count和cross-link closure均通过后才能构造。

candidate factory只机械复制proof到header和binding。它要求preallocated view ref此前未作为任何image/binding/member key出现，
`materialized_at >= source_observed_at`，binding与header的context/cursor/audit完全相等。candidate不持有item `Vec`：named writer
从proof绑定的同UoW current-source generation逐批重建并stage immutable item/cross-link images。这样不会把read page、raw row或
infra-private unchecked map变成candidate truth。

### 97.4 Failure/control first/replacement expectation 与 atomic members

```rust
pub struct FailureControlStatusFirstMaterializationProof {
    transaction_ref: SandboxTransactionRef,
    context_ref: ControlledExecutionContextRef,
    scope_truth_cursor: SandboxTruthCursor,
    source_audit_trace_ref: SandboxAuditTraceRef,
    formal_context_owner_count: u64,
    immutable_snapshot_count: u64,
    immutable_binding_count: u64,
    context_current_count: u64,
    source_relation_count: u64,
}

pub struct FailureControlStatusIndexExpectation {
    expected_source_truth_cursor: SandboxTruthCursor,
    expected_failure_count: u64,
    expected_control_count: u64,
    expected_cross_link_count: u64,
    expected_first_order_key: Option<FailureControlStatusOrderKey>,
    expected_last_order_key: Option<FailureControlStatusOrderKey>,
}

impl SandboxStatusViewMaterializationFamily for FailureControlStatusMaterializationFamily {
    type Candidate = FailureControlStatusMaterializationCandidate;
    type Binding = FailureControlStatusViewBinding;
    type ViewRef = FailureControlStatusViewRef;
    type FirstTargetProof = FailureControlStatusFirstMaterializationProof;
    type IndexExpectation = FailureControlStatusIndexExpectation;
    type AcceptedSourceProof = AcceptedFailureControlStatusSourceProof;
}
```

`FailureControlStatusFirstMaterializationProof`只允许formal context owner形成。first要求
`formal_context_owner_count=1`，且该context的immutable snapshot/header history、immutable binding、context-current pointer和
source-to-snapshot relation均为0；new view ref下item/cross-link row也必须为0。repository `NotFound`、Query Empty、第一页空window
或scope counts为0都不能构造first proof：合法empty scope仍然是一个有header/binding的materialized snapshot。

replacement使用 `ReplaceExactTarget { expected: Versioned<FailureControlStatusViewBinding> }`。这里仅有一个物理mutable pointer：
exact context target latest就是context-current。不得再为同一row制造第二个Version。replacement必须确认old binding指向完整old
generation、new source cursor严格大于old cursor、new view ref不同、new generation全部member key为0。old snapshot/header/item/
cross-link/binding全部保留；并发CAS loser不能留下“historical new snapshot”。

两种mode都必须用`FailureControlStatusIndexExpectation`重验accepted source generation，而不能只比header count。writer按以下
顺序stage：

```text
validate accepted proof/candidate/expectation/UoW identity
  -> exact-read formal context current-source generation and target pointer
  -> scan source items in stable bounded batches; checked-decode each item
  -> stage immutable failure/control item images under new view_ref
  -> scan and checked-decode matching cross-links; stage immutable proof images
  -> verify total/sub-count/first/last/cross-link closure against source aggregate
  -> stage immutable header image + immutable binding + context-view history relation
  -> insert-if-absent or CAS the one context-current pointer
  -> stage source-cursor/audit-to-snapshot relation
  -> exact staged-overlay re-read of the complete new generation
  -> return StagedSandboxStatusViewWrite; never commit
```

header不能先于member closure对其它snapshot可见；实际数据库可以采用任意statement order，但whole UoW提交前必须满足最终外键/
deferred constraint，且外部reader只能看到commit前old整组或commit后new整组。最低atomic group为：changed failure/control truth、
merged current-source index、scope aggregate、cross-link source relations、source audit、new immutable member rows、header、binding、history、
current pointer、source relation，以及原operation的stored/idempotency/relay/stale成员。

failure/control的whole-group inspection key至少冻结：operation/reservation ref、context ref、source truth cursor/audit ref、new view ref、
expected old binding identity（replacement时）、header key、item key namespace及expected counts/first/last、cross-link namespace/count、immutable
binding/history key、context-current key、source relation key、stored/idempotency owner key。只命中header、binding或pointer任一子集都不能
判定Committed；source rows完整但snapshot member count不等也只能Indeterminate。

### 97.5 Failure/control P1 static check

| check | result |
|---|---:|
| logical target / physical mutable pointer | context target `1/1`；duplicate exact/context Version=`0` |
| durable snapshot members | header/item/cross-link/binding=`4/4` explicit |
| public page fields persisted | anchor/limit/consumed/returned/has_more=`0/5` |
| read gap/degraded/lookup persisted | `0/3` |
| complete source dimensions | merged index/summary/cross-link/audit/generation=`5/5` |
| item checked rehydration | failure/control=`2/2`；unchecked infra constructor=`0` |
| first formal zero dimensions | snapshot/binding/current/source relation/new member namespace=`5/5` |
| replacement | one same-UoW Version；old immutable generation retained |
| stage lifecycle | begin/cursor/commit/rollback/external=`0/0/0/0/0` |
| new upstream blocker | `0` |

## EOF Current Working Batch: `7R-04A-A3-2-S3-P1` failure/control completed

本节是read artifact物理EOF current authority。S3-P1完成failure/control durable snapshot与writer payload；cleanup、redline、三方法/
inspection/parity仍未完成，因此S3不得标记completed，正式`03`继续冻结。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_internal_task = A3-2-S3-P2 cleanup writer contract
a3_2_s3_status = in_progress_p1_completed
a3_2_s3_p1_failure_control = completed
a3_2_s3_p2_cleanup = pending
a3_2_s3_p3_redline = pending
a3_2_s3_p4_methods_inspection_parity_audit_sync = pending
status_view_family_payload_total = 6/8
safety_named_writer_methods = 0/3
safety_whole_group_inspection_keys = 1/3_payload_defined
formal_03_writeback = forbidden
new_l1_l2_blocker = 0
next_allowed_action = write_A3_2_S3_P2_cleanup_only
commit_required = no
```

## EOF Current Working Batch: `7R-04A-A3-2-S3-P2` cleanup completed

本节是read artifact物理EOF current authority，并激活前部 historical-position §98.1~§98.6。S3-P1 failure/control与
S3-P2 cleanup已完成；redline、三具名方法、whole-group inspection、durable/fake parity和四层恢复同步仍未完成，S3及
A3-2不得标记completed，正式`03`继续冻结。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_internal_task = A3-2-S3-P3 redline writer contract
a3_2_s3_status = in_progress_p1_p2_completed
a3_2_s3_p1_failure_control = completed
a3_2_s3_p2_cleanup = completed
a3_2_s3_p3_redline = pending
a3_2_s3_p4_methods_inspection_parity_audit_sync = pending
status_view_family_payload_total = 7/8
safety_named_writer_methods = 0/3
safety_whole_group_inspection_keys = 2/3_payload_defined
formal_03_writeback = forbidden
new_l1_l2_blocker = 0
next_allowed_action = write_A3_2_S3_P3_redline_only
commit_required = no
```

## EOF Current Working Batch: `7R-04A-A3-2-S3-P3` redline completed

本节位于read artifact物理EOF，是唯一current recovery authority，并激活前部historical-position §99.1~§99.6。S3三个
safety family payload及各自inspection key已定义；P2 cleanup的exact-target Version只由generic target expectation承载，family
index expectation只承载context-current plan，重复Version owner已消除。三具名method、shared stage surface、durable/fake parity、
S3 static total audit和四层恢复同步仍待P4，因此S3及A3-2不得提前标记completed，正式`03`继续冻结。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_internal_task = A3-2-S3-P4 methods inspection parity audit sync
a3_2_s3_status = in_progress_p1_p2_p3_completed
a3_2_s3_p1_failure_control = completed
a3_2_s3_p2_cleanup = completed
a3_2_s3_p3_redline = completed
a3_2_s3_p4_methods_inspection_parity_audit_sync = pending
status_view_family_payload_total = 8/8
safety_named_writer_methods = 0/3
safety_whole_group_inspection_keys = 3/3_payload_defined
cleanup_exact_version_owner = generic_target_expectation_only
cleanup_index_exact_version_duplicate = 0
misplaced_p2_p3_current_anchor = 0
formal_03_writeback = forbidden
new_l1_l2_blocker = 0
next_allowed_action = wait_user_review_before_A3_2_S3_P4
commit_required = no
```

## 100. A3-2-S3-P4 Current Activation、Owner Inspection 与 Parity Closure

### 100.5 Current activation 与 owner inspection 三分支

本节位于物理 EOF，并激活前部 `Historical-Position Working Draft: A3-2-S3-P4` 的 §100.1~§100.4。前部内容是本批按
“分批写入”形成的方法、stage 算法和 key 中间产物；只有本节及后续 EOF recovery block 有 current authority。

commit unknown 发生在 source owner 终结包含 canonical source、status view 和 operation completion 的 whole group 时，不发生在
三个 stage method 内。owner 必须丢弃内存 candidate、stage result、expected Version、transition decision 和 staged assumptions，
再以冻结的 family-specific key 打开一个新的 fair committed read snapshot。private result 固定为：

```rust
/// operation owner 对 commit-unknown whole group 的有限只读判定。
/// 不是业务 status，不进入 protocol、stored surface 或 writer error。
pub(crate) enum SandboxStatusViewCommitInspection {
    Committed,
    FullyAbsent,
    Indeterminate {
        reason: SandboxReason,
    },
}
```

这不是 generic inspector port。三个既有 operation owner 分别消费
`FailureControlStatusWholeGroupInspectionKey`、`CleanupReadinessWholeGroupInspectionKey` 和
`RedlineContainmentWholeGroupInspectionKey`，通过既有 exact repositories 读取；不得增加
`inspect_status_view(kind, key)`、runtime family enum dispatch 或 public recovery callable。

固定判定顺序如下：

```text
1. open one fresh fair committed snapshot; open/read unavailable => Indeterminate
2. load the frozen idempotency/reservation owner and establish its allowed before/after baseline
3. exact-read every canonical source-after member, required source audit and assigned truth cursor
4. exact-read every immutable image/member, binding, history, source relation and family completeness index
5. exact-read each independently-owned current/latest pointer and compare target identity with the frozen plan
6. verify cardinality, uniqueness, generation, cursor, audit and source-to-view relation equality
7. checked-rehydrate every durable image/member through the Step 6 factory and compare with canonical source-after
8. exact-read stored result, frozen relay refs and operation-specific stale/side-effect members
9. if the complete after-group and owner completion are exact, return Committed
10. otherwise prove every new member/planned insert absent and every source/CAS row equal to frozen before-state
11. if the complete allowed before-state is exact, return FullyAbsent; otherwise return Indeterminate
```

三分支的最小证明闭集：

| branch | required proof | explicitly insufficient |
|---|---|---|
| `Committed` | canonical source after-state、required audit、完整 family image/member set、binding/history、全部 pointer/index/relation、stored/idempotency/relay/stale owner members同 generation/cursor，且 durable rehydration逐字段等于 source | header、image、binding、pointer、source row、stored result或commit script任一局部命中 |
| `FullyAbsent` | 全部 frozen new identities/member keys和planned inserts为0；所有 planned CAS source/pointer保持 frozen before-state；reservation处于 owner plan允许的 exact baseline | new view不存在、rollback返回成功、idempotency仍`Reserved`或old current仍存在任一单项 |
| `Indeterminate` | partial/mixed group、duplicate、wrong generation/cursor/audit、pointer contradiction、source/image不等、owner completion缺失、snapshot/repository unavailable，或无法完整证明前两者 | 映射为 Empty/Degraded/NoOp、猜 winner、自动 repair或盲重放 |

`FullyAbsent` 继续采用 §96.1 的 reservation baseline 精化：reservation 与 finalization 同 UoW 时，reservation candidate 也必须为0；
reservation 已在更早 UoW confirmed 时，exact record 可以保持同一合法 `Reserved` before-state，但本次 source/audit/view/stored
after-members必须全无，全部 mutable rows必须保持 before-state。`Reserved` 本身既不证明 absent，也不证明 committed。

family-specific inspection 必须另外满足：

| family | `Committed` extra proof | forced `Indeterminate` examples |
|---|---|---|
| failure/control | header counts、ordered failure/control member refs、first/last key、cross-link set与 merged source index/scope aggregate全等；single context pointer指向该 binding | source完整但item/cross-link count不等；header或pointer单独出现；old/new generation混合 |
| cleanup | image nested evidence/owner/redline/release relation完整；exact-latest与context-current各自符合 write/preserve plan及独立 before-state | new exact完整但planned context-current未知；old current保留关系不符；两个pointer指向矛盾 generation |
| redline | exact guard/failure/run/boundary/preservation/investigation/disposition/timeline、coverage membership与唯一 exact pointer闭合 | 借用另一个redline pointer；coverage late/missing；security source任一成员不可读或只出现一半 |

`Committed` 只允许 owner 加载并重放 original stored surface；inspection 不调用 public view factory重组替代 success。
`FullyAbsent` 只恢复上层显式新 invocation 的资格，本栈帧不静默重跑。`Indeterminate` 只进入既有 strict
hold/reconciliation/quarantine owner；P4 不新增 repair、incident、人工审批或验收流程。

### 100.6 Durable / deterministic fake parity

durable adapter 与 deterministic fake 实现 §100.2 同三个具名 method、同一 typed 参数、同一 staged result 和既有 shared error
mapping。fake 不是 expected-result map，至少分离以下状态：

```text
SafetyFakeStatusStore
  committed_base: family-specific checked source/images/bindings/history/pointers/relations
  transactions[transaction_ref].staged_overlay: same typed members, private to that UoW
  commit_script: Confirmed | NotCommitted | UnknownApplied | UnknownAbsent | UnknownPartial
```

`UnknownApplied/UnknownAbsent/UnknownPartial` 只控制 fake UoW manager 的底层持久化和 `StatusUnknown` 返回，不属于
`SandboxStatusViewStageError`，也不能被 writer 或 business service观察。unknown 后，fake 与 durable 都必须通过 §100.5 的同一
owner exact-read path得到三分支。

| # | parity dimension | durable required behavior | fake required behavior | forbidden fake shortcut |
|---:|---|---|---|---|
| 1 | named methods | 三个 exact family method | 同名、同参数、同 result/error shape | generic family dispatch |
| 2 | transaction identity | context/proof/UoW ref逐项匹配 | scripted mismatch同样拒绝 | silent rebind |
| 3 | same-UoW overlay | stage只在同一 UoW read-your-staged-write可见 | overlay先于committed base查找 | proof字段冒充row |
| 4 | formal first | owner=1和全部zero dimensions | explicit checked counts/relations | auto-proof、`NotFound -> first` |
| 5 | first race | insert-if-absent单winner | deterministic competing winner | both succeed |
| 6 | exact replacement | same-UoW `Versioned<Binding>` CAS | exact row独立version | binding-only compare、last-write-wins |
| 7 | cleanup context-current | 与exact-latest独立Version和plan | 第二独立row/version/conflict | 复用exact Version |
| 8 | failure/control pointer | exact/latest/current同一物理row只CAS一次 | 同一single row | double CAS/double Version |
| 9 | redline isolation | exact `(context, redline)` pointer only | exact namespace隔离 | context/kind latest fallback |
| 10 | immutable retention | old image/binding/history保留 | committed generations不覆盖 | map overwrite old row |
| 11 | stage visibility | commit前其它snapshot不可见 | overlay对其它snapshot隐藏 | stage result当commit |
| 12 | rollback | 全部staged member不可见 | drop complete overlay | 保留debug image/history |
| 13 | confirmed commit | whole group原子可见 | complete overlay一次转入base | row-by-row visibility |
| 14 | unknown applied | whole after-group可能durable，caller仍收到unknown | apply complete overlay后返回unknown | writer返回success |
| 15 | unknown absent | after-group全无且before-state保留 | drop overlay后返回unknown | view缺失即判 absent |
| 16 | unknown partial | partial/mixed关系保持可观察并fail closed | apply scripted subset后返回unknown | normalize为absent/committed |
| 17 | owner inspection | fresh fair snapshot读全 family + owner keys | 同一exact reader path | 读取candidate或commit script |
| 18 | error/rehydration | checked factory与finite stage error | 同constructor和mapping | unchecked literal、fake-only error/degraded success |

fake setup builder 只能装载三类 checked source owner、typed pointer rows、typed `Versioned` binding 和 frozen owner completion；不得
接收 raw map、unchecked image、public view、expected-success boolean。call record最多保存method、transaction、typed target/view ref
和 finite outcome/error category；不能保存 security body、cleanup evidence body、investigation case、artifact、run/evidence或签署信息。

最低 parity scenario 是设计验收 obligation，不是当前 test result：每个 family 都要覆盖 valid first、first race、valid replace、
stale exact Version、additional pointer conflict（适用时）、candidate/proof mismatch、post-stage rollback、unknown applied、unknown absent、
unknown partial。cleanup另验 dual-pointer preserve/write矩阵；failure/control另验empty scope与bounded full scan；redline另验exact isolation
与complete security source。P4 不记录 case pass 数、run id、evidence alias 或签署。

### 100.7 S3 static total audit

以下 result 是设计文本静态计数，不是实现、编译、测试或验收事实：

| audit item | result | closure |
|---|---:|---|
| safety family payload | `3/3` | failure/control、cleanup、redline checked source/candidate/first/index payload闭合。 |
| named safety writer method | `3/3` | exact methods；generic production method=`0`。 |
| typed whole-group inspection key | `3/3` | source、image/member、binding/history、pointer/relation、owner completion完整。 |
| owner inspection branches | `3/3` | `Committed/FullyAbsent/Indeterminate`及固定判定顺序。 |
| cleanup pointer Version ownership | exact/current=`2/2`；duplicate=`0` | generic target唯一承载exact Version；index只承载context-current。 |
| failure/control pointer Version ownership | `1/1`；duplicate=`0` | context exact/latest/current为同一physical row。 |
| redline pointer ownership | exact=`1/1`；context/kind/single-active=`0/0/0` | each redline isolated。 |
| durable/fake parity | `18/18` obligations | same UoW/CAS/visibility/rollback/unknown/inspection/error。 |
| checked durable rehydration | `3/3` | unchecked infra constructor=`0`；public body persisted=`0`。 |
| stage lifecycle capability | begin/cursor/commit/rollback/external=`0/0/0/0/0` | source owner retains lifecycle。 |
| Query write use | `0/13` | no on-read materialization。 |
| public callable delta | `0` | remains `42/42`。 |
| generic inspector port / runtime dispatch | `0/0` | owner-private exact repositories only。 |
| exception/review/test/delivery expansion | `0` | necessary fail-closed gate only。 |
| new L1/L2 blocker | `0` | no upstream contract conflict introduced。 |

反向能力审计未发现第二 truth owner、第二 redline selector、cleanup Version duplicate、auto-repair、generic payload、external call、
auto-proof、auto-commit、last-write-wins或fake-only business success。S3 主体安全 materialization boundary至此闭合；但 S4
eight-family total audit、A3-3/A3-4/A4和Step 7 blocker ruling仍未完成，因此两个Step 7 blocker继续开放。

## EOF Current Working Batch: `7R-04A-A3-2-S3-P4` completed, user review pending

本节位于 read artifact 物理 EOF，是当前唯一 recovery authority，并激活前部 historical-position §100.1~§100.4。P4 已完成
三具名 method、三组 whole-group key、owner 三分支、durable/fake parity 和 S3 static audit。按停审规则，本轮停在 S3 用户复核门；
不得自动进入 S4、A3-3、Step 8 或正式 `03` 回填。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_internal_task = A3-2-S3 completed review gate
gate_status = content_completed_wait_user_review
a3_2_s3_status = completed_wait_user_review
a3_2_s3_p1_failure_control = completed
a3_2_s3_p2_cleanup = completed
a3_2_s3_p3_redline = completed
a3_2_s3_p4_methods_inspection_parity_audit_sync = completed
a3_2_s3_failure_cleanup_redline = completed_wait_user_review
a3_2_s4_eight_family_total_audit = pending
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
status_view_family_payload_total = 8/8
safety_named_writer_methods = 3/3
safety_whole_group_inspection_keys = 3/3
safety_owner_inspection_branches = 3/3
safety_durable_fake_parity_obligations = 18/18
cleanup_exact_version_owner = generic_target_expectation_only
cleanup_index_exact_version_duplicate = 0
misplaced_p2_p3_current_anchor = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = wait_user_review_before_A3_2_S4
```

## 101. A3-2-S4 Eight-Family Total Audit 与恢复同步

本节是 `A3-2-S4` 的 current working artifact。它只审计前面 S1、S2、S3 已形成的八类 status-view staged writer 是否总量闭合，
不新增第九类 status-view、不创建 projection/derived/comparison writer，也不回填正式 `03-详细设计.md`。所有 `result` 均为设计
文本静态审计结果，不是实现、编译、真实测试、run、evidence、验收或签署事实。

### 101.1 开工门、输入与 SOP 问题回答

| 检查项 | current 结论 |
|---|---|
| predecessor | `7R-04A-A3-2-S3-P4` 已完成，用户已确认消费 S3 复核门。 |
| 本批范围 | execution、boundary、policy、capture、handoff、failure/control、cleanup、redline 八类 status-view staged writer 的总量审计。 |
| 直接输入 | 本文件 §§93~100、`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts_regression_control.md`、`03_ddd_step_07_repositories_uow_indexes.md` 的 current recovery source。 |
| 上游对象输入 | Step 6 的 canonical source、checked factory、typed ref、audit/cursor、`Versioned<T>` 和 UoW 纪律。 |
| 不属于本批 | projection、derived、comparison 三个 maintenance writer；reconciliation、audit 两个已有 owner 的重用审计；Step 8 及正式正文装配。 |
| Query 行为 | 13 个 public Query 仍只读；本批不允许 Query、entry、diagnostic 或 reconciliation repair 持有 writer。 |
| 异常/审查/测试/交付粒度 | 只保留阻止误判的 finite error、whole-group unknown、parity obligation 和 gate；不扩写第二主流程。 |

本批按 SOP 逐项回答以下问题：

| SOP 问题 | 回答 |
|---|---|
| 八类 family 是否各自有独立可落码 method | 是。每类一个具名 application-private method；生产 trait 没有 generic `kind/payload` method。 |
| 每类是否有完整 candidate、first proof、binding/view ref、index expectation、accepted source proof | 是。S2 为 `5/5`，S3 为 `3/3`；associated payload 总量 `8/8`。 |
| 每类是否能在 commit-unknown 后闭合 whole group | 是。八个 typed inspection key 均冻结 source、image/member、binding/history、pointer/index/relation 和 owner completion；判定统一为 `Committed/FullyAbsent/Indeterminate`。 |
| 是否存在第二 truth owner或 Query on-read materialization | 未发现。Query writer use=`0/13`；source owner 保留 cursor、audit、identity、commit 和 unknown inspection。 |
| durable 与 deterministic fake 是否具有相同语义 | 设计 obligation 已闭合 `18/18`；未执行测试，不能写成测试通过。 |
| 是否新增 public callable、repository root 或 runtime dispatch | 均为 `0`；public callable 维持 `42/42`。 |
| 是否发现新的 L1/L2 upstream blocker | 未发现，`0`。既有 `READ-001`、`OUTCOME-001` 和 `BLK-SBX-CANONICAL-001` 按原 owner 继续开放。 |

### 101.2 八类 family 总量矩阵

以下矩阵是 S4 的主审计表。`method`、`key` 和 `owner` 必须同时存在才计为闭合；只有 payload 或只有 reader 不能计入完成。

| # | family marker | named stage method | whole-group inspection key | unique source owner | current/index 语义 | S4 结果 |
|---:|---|---|---|---|---|---:|
| 1 | `ExecutionStatusMaterializationFamily` | `stage_execution_status_materialization` | `ExecutionStatusWholeGroupInspectionKey` | execution source-chain accepted mutation owner | one physical context singleton pointer；first/replace | `1/1` |
| 2 | `BoundaryStatusMaterializationFamily` | `stage_boundary_status_materialization` | `BoundaryStatusWholeGroupInspectionKey` | boundary/handle/lease mutation owner | exact-latest plus plan-declared context-current | `1/1` |
| 3 | `PolicyDecisionSummaryMaterializationFamily` | `stage_policy_decision_summary_materialization` | `PolicyDecisionSummaryWholeGroupInspectionKey` | accepted policy evaluation owner | first exact-latest plus plan-declared context-current | `1/1` |
| 4 | `CaptureSummaryMaterializationFamily` | `stage_capture_summary_materialization` | `CaptureSummaryWholeGroupInspectionKey` | capture/material lifecycle owner | exact-latest only；run-to-capture relation retained | `1/1` |
| 5 | `MaterialHandoffStatusMaterializationFamily` | `stage_material_handoff_status_materialization` | `MaterialHandoffStatusWholeGroupInspectionKey` | handoff/attempt/observation owner | exact-latest plus plan-declared context-current | `1/1` |
| 6 | `FailureControlStatusMaterializationFamily` | `stage_failure_control_status_materialization` | `FailureControlStatusWholeGroupInspectionKey` | failure/control accepted transition owner | one physical context pointer；merged snapshot/index relation | `1/1` |
| 7 | `CleanupReadinessMaterializationFamily` | `stage_cleanup_readiness_materialization` | `CleanupReadinessWholeGroupInspectionKey` | cleanup/owner/redline safety mutation owner | exact target latest plus independent context-current plan/version | `1/1` |
| 8 | `RedlineContainmentMaterializationFamily` | `stage_redline_containment_materialization` | `RedlineContainmentWholeGroupInspectionKey` | redline security mutation owner | exact `(context_ref, redline_ref)` pointer only | `1/1` |
| **total** | **8 sealed markers** | **8/8 named methods** | **8/8 typed keys** | **8/8 owner assignments** | **family-specific, no generic fallback** | **`8/8`** |

每一行的 `candidate`、`Binding`、`ViewRef`、`FirstTargetProof`、`IndexExpectation` 和 `AcceptedSourceProof` 均由对应 marker
绑定。它们不进入 public protocol、stored result、Query selector 或 infra 的 runtime family enum。S2/S3 已分别证明 method 内的
fixed stage algorithm、atomic staged set 和 same-UoW read-your-staged-write；S4 只做总量和差集确认，不重新定义算法。

### 101.3 跨 family 结构闭环

| invariant | eight-family requirement | static result | violation disposition |
|---|---|---:|---|
| source truth | source owner 先接受 canonical transition、audit 和 matching truth cursor；writer 只链接并重验 | `8/8` | candidate/proof mismatch；不得由 writer重建 truth |
| identity budget | view、binding、history、pointer/index identity 由 owner 预分配；writer不分配 operation/audit/cursor | `8/8` | `IntegrityViolation` 或 `AuthorizationMismatch` |
| formal first | first 由 formal owner/registry proof给出，并在同一 UoW 重验完整 zero set | `8/8` | 不得由 `NotFound`、empty page 或 Query absence 推导 |
| replacement | immutable old image/binding/history 保留；每个受影响 physical pointer 使用自己的 exact `Versioned<T>` | `8/8` | stale candidate 作废，whole owner flow 重启 |
| staged visibility | before commit 只有同 UoW overlay 可见；其它 committed snapshot 看不到 partial row | `8/8` | whole UoW rollback；不宣称成功 |
| commit ownership | named writer 只 stage；source/maintenance owner 负责 commit、rollback 和 unknown inspection | `8/8` | writer不得返回 `Committed` 或持有 manager |
| unknown | owner exact-read whole group 后只返回 `Committed/FullyAbsent/Indeterminate` | `8/8` | `Indeterminate` 进入既有 hold/reconciliation/quarantine |
| public boundary | public callable、DTO、stored kind、state machine 不因 writer 增长 | `0` delta | 新增 public surface 视为 scope violation |

跨 family 的重复 owner 审计结果：canonical source owner=`8/8`，truth cursor owner=`8/8`，business audit owner=`8/8`，commit/
rollback/unknown owner=`8/8`；status writer 第二次分配上述资源均为 `0`。八类 writer 可以由同一 source UoW 顺序调用，但每次
必须消费 matching typed context，不能共享一个可复制的 generic capability。

### 101.4 13 Query provenance 差集与边界裁决

`A3-1` 已证明 13 个 Query read source 均有唯一 write provenance；S4 只把这份 provenance 与 A3-2 的八类 status-view
闭合结果做差集，不把“已识别 owner”误写成“所有 writer 已完成”。

| # | Query read source | unique write owner / caller | A3-2 结果 | 后续责任 |
|---:|---|---|---:|---|
| 1 | execution status view / binding | accepted execution source-chain mutation owner + `stage_execution_status_materialization` | closed | A3-2 已闭合；Query use=`0` |
| 2 | boundary status view / binding | boundary/handle/lease mutation owner + `stage_boundary_status_materialization` | closed | A3-2 已闭合；Query use=`0` |
| 3 | policy decision summary / binding | accepted policy evaluation owner + `stage_policy_decision_summary_materialization` | closed | A3-2 已闭合；Query 不重评 policy |
| 4 | capture summary / binding | capture/material lifecycle owner + `stage_capture_summary_materialization` | closed | A3-2 已闭合；不读取 artifact body |
| 5 | material handoff status / binding | handoff/attempt/observation owner + `stage_material_handoff_status_materialization` | closed | A3-2 已闭合；不调用 publisher |
| 6 | failure/control immutable status snapshot | failure/control accepted transition owner + `stage_failure_control_status_materialization` | closed | A3-2 已闭合；bounded reader 不写 |
| 7 | cleanup readiness view / binding | cleanup/owner/redline safety owner + `stage_cleanup_readiness_materialization` | closed | A3-2 已闭合；不授权 release |
| 8 | redline containment view / binding | redline security mutation owner + `stage_redline_containment_materialization` | closed | A3-2 已闭合；unknown strict hold |
| 9 | `SandboxReadProjection` root / binding | Job 8 `write_projection_materialization` / `MUT-G20` | outside A3-2 | A3-3；Query 不触发 rebuild |
| 10 | derived state + materialization/status/current binding | Job 9 `write_derived_materialization` / `MUT-G21` | outside A3-2 | A3-3；只服务 Inspect/Preview/Trend |
| 11 | capability comparison immutable row / binding | accepted capability/reference maintenance owner + `materialize_backend_capability_comparison` | outside A3-2 | A3-3；不得并入 generic derived writer |
| 12 | reconciliation report/finding/current bundle | existing reconciliation whole-group owner | reused owner | A3-4 只审计可达性和重复定义 |
| 13 | subject-stable audit trace page | source mutation owner + existing append-only audit repository | reused owner | A3-4 固定 Query append=`0` |

S4 差集结论固定为：

```text
query_write_provenance = 13/13 unique
a3_2_status_view_writer_closure = 8/8
a3_remaining_materialization_surfaces_identified = 3 (projection|derived|comparison)
existing_owner_reuse = 2/2 (reconciliation|audit)
query_writer_use = 0/13
public_callable_delta = 0
```

`11/11 necessary materialization surfaces identified` 仍是 A3-1 的 inventory 事实，不等于 A3-2 已完成全部 11 个 writer。S4
明确冻结该语义，避免实现 agent 把 `A3-3` 的三个 maintenance writer提前塞入八类 status-view trait，或为 13 个 Query 各自
增加一个 public writer。

### 101.5 Durable / deterministic fake parity 总审计

以下 18 项是八类 writer 共同的设计 obligation。`18/18` 表示设计契约维度已经逐项登记，不表示 8 x 18 个实现测试已经通过，
也不产生 case 数、run id、evidence alias 或验收签署。

| # | parity dimension | 八类共同要求 | static result |
|---:|---|---|---:|
| 1 | named method shape | durable 与 fake 同时提供八个具名 method；无 generic family dispatch | `1/1` |
| 2 | transaction identity | typed context、accepted proof 与 UoW transaction ref 逐项相等 | `1/1` |
| 3 | same-UoW overlay | staged rows 只在本 UoW read-your-staged-write 可见 | `1/1` |
| 4 | formal first proof | explicit owner proof + 完整 zero/count/cardinality 检查 | `1/1` |
| 5 | first race | insert-if-absent 只有一个合法 winner，loser 不保留 candidate | `1/1` |
| 6 | exact replacement CAS | exact `Versioned<Binding>` 与 physical pointer Version 独立检查 | `1/1` |
| 7 | additional pointer plan | context-current 与 exact-latest 使用各自 plan/version；不复用 Version | `1/1` |
| 8 | physical pointer ownership | failure/control single row、cleanup dual row、redline exact row各自固定 | `1/1` |
| 9 | redline namespace isolation | 只允许 exact `(context_ref, redline_ref)`；无 kind/latest fallback | `1/1` |
| 10 | immutable retention | old image、binding、history 保留；replacement 不覆盖旧代 | `1/1` |
| 11 | pre-commit visibility | 其它 committed snapshot 不可见 staged partial group | `1/1` |
| 12 | rollback | 任一 stage error 丢弃全部 staged member；不留 debug success row | `1/1` |
| 13 | confirmed atomic commit | whole group 一次转为 committed 可见；禁止 row-by-row 观察 | `1/1` |
| 14 | unknown applied | 可能已完整落盘但 caller 仍得到 unknown；只能由 owner inspection判定 | `1/1` |
| 15 | unknown absent | overlay 丢弃且 before-state 保持；不能由 view 缺失单独推导 | `1/1` |
| 16 | unknown partial | partial/mixed group 保持可观察并 fail closed；不归一化 | `1/1` |
| 17 | owner inspection | fresh fair committed snapshot + family exact key + owner completion 全路径一致 | `1/1` |
| 18 | error / rehydration | checked factory、有限 stage error、shared mapping 与 durable/fake 一致 | `1/1` |
| **total** | **18 shared obligations** | **同一 UoW、CAS、visibility、rollback、unknown 和 error 语义** | **`18/18`** |

每个 family 的最小 scenario group 也必须有设计入口，但本批不记录执行结果：

| family | minimum scenario group | 额外闭合点 | static result |
|---|---|---|---:|
| execution | valid first / first race / replace / stale Version / rollback / three unknown branches | singleton context pointer 与 complete execution pair | `1/1` |
| boundary | first / replace / stale exact + context-current conflict / rollback / unknown | Current/Historical 与 Write/Preserve plan | `1/1` |
| policy | valid first / first race / candidate mismatch / rollback / unknown | first-only exact target 与 complete action lineage | `1/1` |
| capture | first / replace / run-to-capture mismatch / rollback / unknown | material 与 observability coverage | `1/1` |
| handoff | first / replace / progress-current conflict / rollback / unknown | plan/progress/relay relation与 no publisher call | `1/1` |
| failure/control | empty scope / bounded full scan / first race / replacement CAS / rollback / unknown | ordered items、counts、cross-links、merged index | `1/1` |
| cleanup | exact target first/replace + context-current preserve/write matrix / rollback / unknown | exact Version与context-current Version独立 | `1/1` |
| redline | exact isolation / complete security source / first race / stale CAS / rollback / unknown | exact pointer唯一，coverage late/missing必为 indeterminate | `1/1` |
| **total** | **8 family-specific scenario groups** | **设计入口存在；未执行测试** | **`8/8`** |

fake setup 只能装载 checked source owner、typed pointer row、typed `Versioned` binding 和 frozen owner completion；它不得接收
raw map、public view、unchecked image、expected-success boolean 或 commit script 作为业务判定输入。fake 的 script 只控制底层
transaction outcome，不能被 writer、facade 或 business service读取并转成 success。

### 101.6 反向 capability、边界与依赖审计

S4 对“设计中没有出现什么能力”做反向检查。下表的 `0` 是禁止能力的静态差集结果，不是运行时安全测试结果。

| forbidden capability | audited surface | result | current rule |
|---|---|---:|---|
| generic production writer | `materialize_status(kind, payload)`、runtime family `match`、generic map | `0` | 八个具名 method；marker 只做类型绑定，不做 dispatch |
| Query on-read write | Query service、entry、diagnostic、reconciliation reader 持有 UoW/write port | `0/13` | Query 只读 exact committed snapshot；不补 view、不分配 identity |
| second truth owner | writer重算 source status、reason、cursor、audit 或 external outcome | `0/8` | source owner 是唯一 truth/transition/audit/cursor owner |
| writer lifecycle | begin / reserve / commit / rollback / external await | `0/0/0/0/0` | writer只消费 borrowed context 并 stage |
| identity allocation in writer | operation、view、binding、audit、cursor、stored、relay identity | `0/7` | owner 在 accepted source group 内预分配 |
| auto-proof | `NotFound`、empty page、missing current、cache 或 operator flag 推导 first | `0` | formal owner proof + same-UoW whole zero set |
| auto-commit | stage result、commit script 或 fake callback直接形成 success | `0` | source/maintenance owner commit；unknown 必须 inspection |
| last-write-wins | stale Version 被忽略、pointer reload 后套旧 candidate | `0` | exact CAS conflict 让整个 owner flow 重启 |
| partial visibility | binding-first、pointer-only、index-late、source-audit-late | `0` | whole group atomic commit；partial 只能 integrity/indeterminate |
| cleanup Version reuse | exact target Version 被 context-current index 重用 | `0` | generic target expectation 与 family index expectation 分离 |
| redline selector widening | context/kind latest、single-active 或跨 redline fallback | `0/0/0` | exact `(context_ref, redline_ref)` namespace |
| repair in reader/inspector | query repair、auto-rebuild、rebind、incident/approval flow | `0` | 既有 hold/reconciliation/quarantine owner；本批不新增流程 |
| semantic boundary crossing | tools semantic execution、runtime agent loop、member lifecycle orchestration | `0` | sandbox 只提供 isolation substrate、lifecycle observation 和 material capture seam |
| body leakage | raw filesystem/network/process/tool/runtime/member body进入 status image、fake call record或public result | `0` | 只保存 typed ref、summary、finite outcome和必要 audit linkage |
| public surface growth | public status、stored kind、DTO、state、repository root、scheduler | `0` | `42/42` callable保持不变；S4 为 application-private audit |

依赖方向复核：`contracts <- domain <- application <- infra`，`api/worker/jobs` 只调用 application facade；八类 writer 不向
backend、tool、runtime、member、publisher、capture、investigation 或 handoff adapter 发起 external call。`projection/derived/
comparison` 仍由 `MUT-G20/MUT-G21` 与 dedicated comparison owner 承接，不能为了完成“八类 total”而跨层吸收。

### 101.7 Blocker、历史材料与真实性裁决

| blocker / material | S4 disposition | reason |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | keep open | A3-2 八类 writer 已形成，但 A3-3、A3-4、A4 及最终 Step 7 read closure 尚未完成。 |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | keep open | S4 只复核 status-view owner 的 unknown 形状；全 Step adapter outcome parity 仍由原 owner 处理。 |
| `BLK-SBX-CANONICAL-001` | unchanged existing implementation gate | canonical writer/verifier/tooling 未由真实实现和 fixtures 证明；本批不伪造 digest/evidence。 |
| 旧正式 `03`、README、旧 Step 7 trait/reader 段 | historical material | 与 current typed family、whole-group、UoW 或边界纪律冲突时不继承；正式回填前继续定向回查。 |
| 下游 Step 8~17 已有 `pass` / `completed` 叙述 | downstream revalidation pending | 不能覆盖当前 Step 7 EOF；必须在正式装配前回查协议、flow、状态、持久化、测试和实施承接。 |
| new L1/L2 blocker | `0` | S4 发现的是当前 Step 7 内部未闭合 owner，不是上游依赖冲突。 |
| implementation / tests / evidence / acceptance / commit | not started / no / no / no / no | 本批只写设计中间产物；不制造事实。 |

### 101.8 回填草稿与进入下一步条件

> 校准来源：
> - `design-calibration/03_ddd_step_07_read_maintenance_surfaces.md` §§93~101
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts_regression_control.md`
> - `design-calibration/03_ddd_step_07_repositories_uow_indexes.md`
>
> 正式装配时只摘取收口后的八 family method、typed context、candidate/expectation、atomic stage、whole-group inspection、
> durable/fake parity 和边界禁止项；不把本节的批次过程、静态计数冒充实现测试或验收证据。

#### 5.x.y Status-view materialization boundary

八类 status-view materialization 由 application 内八个具名 staged writer 承接：execution、boundary、policy、capture、handoff、
failure/control、cleanup、redline 各有独立 typed family marker、candidate、formal-first proof、binding/view identity、index
expectation、accepted source proof、有限 stage error 和 whole-group inspection key。writer 只在 source mutation owner 已接受的同一
UoW 内 stage 完整 immutable image/binding/history/pointer/index/relation group，不分配 truth cursor、business audit、operation
completion 或外部资源，也不提交事务。

source owner 负责把 staged status-view group 与 canonical source、required audit、stored/idempotency、relay/stale members一并提交。
commit unknown 时，owner 丢弃内存 candidate 和 expected Version，在新的 fair committed snapshot中按 family exact key证明完整
`Committed`、完整 `FullyAbsent` 或无法证明的 `Indeterminate`；不能用局部 row、`NotFound`、rollback 返回值或 fake script猜测结果。
Query、entry、diagnostic 和 reconciliation reader 均为 zero-write；projection、derived、comparison writer保留给后续 dedicated
maintenance owner。旧 image/binding/history保留，任何 physical pointer 使用自己的 exact `Versioned<T>` CAS，redline只允许 exact
`(context_ref, redline_ref)` selector，cleanup exact-target 与 context-current Version不复用。

进入下一批的必要条件：

```text
S4 content = complete_wait_user_review
A3-2 = complete_wait_user_review
A3-3 = pending (projection|derived|comparison)
A3-4 = pending (existing owner reuse and consistency audit)
A4 = pending (read blocker closure)
formal_03_writeback = forbidden
next_allowed_action = wait_user_review_before_A3_3
```

## 102. A3-3-P0 Projection Prerequisite Read 与边界提取

本节是 `A3-3-P0` 的中间产物。它先把 projection writer 所需的上游对象、repository/UoW seam、Query boundary 和负向边界
固定下来，再允许写 `A3-3-P1`。本节不修改正式 `03-详细设计.md`，不新增 projection domain object，不将 projection
写入八类 status-view writer，也不代表 projection writer 已由真实实现或测试验证。

### 102.1 P0 输入、问题回答与来源裁决

| 检查项 | current 结论 | canonical source |
|---|---|---|
| 直接前置 | `A3-2-S4` 已完成并由用户确认消费；A3-3 只允许处理三个 dedicated maintenance writer。 | read artifact §101 EOF current |
| projection domain object | `SandboxReadProjection` 是可重建、body-free read identity；不保存 status-view body，不成为 core truth owner。 | Step 6 `03_ddd_step_06_object_contracts_failure_cleanup_read.md` §15.8 |
| source input | `SandboxReadProjectionSourceSnapshot` 是同一 committed snapshot 复制出的 typed carrier；必须包含 context、status-view binding set、truth cursor、可选 reference cursor、audit linkage 和 observation time。 | Step 6 §15.8.2 |
| first/existing | 同一 Job 8 内部必须先用 formal target/index proof 区分 `FirstMaterialization` 与 `Existing`；`NotFound` 不能单独证明 first。 | repositories `MUT-G20`；service facade current selection matrix |
| existing write | existing projection 必须加载 `Versioned<SandboxReadProjection>`，按 exact stale marker / attempt / completion transition 走 CAS；不能 last-write-wins。 | Step 6 §15.8.3~§15.8.5；`MUT-G20` |
| source channels | truth cursor 与 reference/projection cursor 是不同类型、不同 fencing channel；不得合成 generic `source_cursor` 或比较数值大小。 | Step 6 §15.8.1~§15.8.2 |
| target identity | `SandboxReadProjectionRef` 必须来自 formal projection target/index；不能由 context ref 文本、view ref 文本、route、config 或 map 拼出。 | Step 6 §15.8.3；read blocker `READ-001` |
| query behavior | `GetSandboxReadProjection` 及其它 Query 只读 committed projection / exact binding；缺失映射为既定 `MissingProjection`/unavailable surface，不触发 rebuild、写 marker 或分配 identity。 | service facade current query matrix；S4 Query writer=`0/13` |
| commit owner | named writer 只 stage；Job/source maintenance owner 负责 begin、commit、rollback、commit-unknown inspection 和最终 report。 | Step 7 SOP；S4 shared writer discipline |
| outside scope | tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store truth、policy definition/approval 不进入 projection writer。 | Step 7 cross-audit negative boundary |

P0 的唯一结论是：projection writer 可以被定义为 Job 8 内的 dedicated application-private method，但其输入和输出必须由
现有 typed object / repository / UoW contract 承接；若需要补充 public DTO、projection status、generic repository 或新的
identity allocator，应回退到对应 Step 6 owner，而不是在 P1 临时增加。

### 102.2 Projection writer 的可落码边界草案

| 维度 | P0 固定结论 | 禁止替代 |
|---|---|---|
| method owner | `RebuildSandboxReadProjections` application/job owner 内的具名 private method `write_projection_materialization` | `materialize_status(kind, payload)`、generic derived writer、Query service writer |
| target selector | `RebuildSandboxReadProjectionsSelection { context_ref, explicit_projection_refs }`；selection port 返回 formal target proof 和 typed target refs | implicit all/latest/stale scan、context string 拼 key、按 view ref 反解 projection ref |
| source reader | exact committed source assembly port，返回 `SandboxReadProjectionSourceSnapshot` 或 typed unavailable/source-integrity outcome | 逐 view latest 拼接、从旧 projection body反推 source、private fake map、raw adapter body |
| first branch | formal zero/existence proof、context match、source proof通过后调用 `SandboxReadProjection::create(...)` 或 `create_unavailable(...)` | repository `NotFound` 即 create、empty page 即 first、operator flag 直接证明 first |
| existing branch | load `Versioned<SandboxReadProjection>`，由 `SandboxProjectionRebuildAttempt::initial/from_stale` 和 domain transition 形成新 image，再以 exact expected version save | pointer reload 后套旧 candidate、忽略 stale version、last-write-wins |
| staged group | projection image、attempt/marker relation、source cursor coverage、audit/stored relation（如上游 owner要求）一次 stage；同 UoW read-your-staged-write 可见 | binding-first、pointer-only、row-by-row commit、部分成功返回 |
| completion | `SandboxProjectionRebuildCompletion` 只承载 typed refs/cursors/attempt/source audit linkage，不承载 view body、external body或 public query result | writer 自造 `Succeeded` public status、直接返回 `Committed`、复制 builder output |
| unknown | fresh fair committed snapshot 按 exact projection target + context + attempt/marker/source relation 进行 whole-group inspection，结果仅 `Committed/FullyAbsent/Indeterminate` | 用单行存在、rollback 返回、fake script、Query 缺行猜测 |
| version | projection object Version、truth cursor、reference cursor、attempt marker 各自保持语义；不互换 | 用 timestamp/page cursor/repository sequence/event id代替 typed Version/cursor |

### 102.3 P0 source / owner / downstream map

| source or capability | 唯一 owner | P1 消费方式 | 后续承接 |
|---|---|---|---|
| projection target identity/index | formal projection target/index owner | 读取 explicit typed target proof；不分配 ref | Step 7 repository/index current |
| status-view lineage | 八类 status-view source owners + committed read port | 组装 `SandboxStatusViewBindingSet`；必须同 context、完整 redline coverage | Step 6 §15.7；Step 7 source reader |
| truth coverage cursor | UoW/truth store committed cursor owner | 复制到 source snapshot / completion；不由 writer生成 | Step 7 repositories/UoW |
| reference coverage cursor | reference/projection marker owner | 作为独立 optional cursor；不与 truth cursor合并 | Step 7 repositories/UoW |
| projection state transition | `SandboxReadProjection` domain object | 调用 checked factory/transition；不直接改字段 | Step 6 §15.8 |
| projection persistence | `SandboxReadProjectionRepository` logical port | `get_with_version` + exact `save`/first create 配对 | Step 7 repositories/UoW; Step 11 |
| commit / unknown inspection | Job 8 maintenance owner | stage/commit then inspect exact whole group | Step 9/12/16 downstream revalidation |
| public query surface | Query service / API mapping owner | read only; map committed object to existing query result | Step 8 protocol revalidation |

### 102.4 P0 parity and failure scope

P0 只登记 P1 必须落盘的 parity / failure obligations，不扩写异常流程。durable adapter 与 deterministic fake 必须共享以下
语义：formal target proof、first race、same-UoW overlay、source snapshot completeness、truth/reference cursor separation、
exact Version CAS、atomic visibility、rollback、commit-unknown 三分支、checked rehydration、missing projection 与 source
integrity error mapping。fake 只能控制底层 transaction outcome，不能通过 private map、预置成功布尔值或 script 被 writer 读取并
转换成业务成功。

| 设计 obligation | P1 需要形成的证据形状 | 真实性边界 |
|---|---|---|
| named method | 一个 projection-specific method signature | 设计文本，不是实现存在 |
| typed whole-group inspection | `ProjectionMaterializationWholeGroupInspectionKey` 与 owner result | 设计文本，不是 unknown 测试结果 |
| source owner uniqueness | target、source snapshot、cursor、audit、commit owner 各唯一 | 静态 owner map，不是运行时证明 |
| durable/fake parity | projection-specific obligation matrix | 未执行编译、测试或 provider 验证 |
| query zero-write | Query writer use remains `0/13` | 静态禁止，不是运行时测试 |

### 102.5 P0 进入 P1 门

```text
A3_3_P0 = completed
projection_domain_source = SandboxReadProjection + SandboxReadProjectionSourceSnapshot
projection_target_selection = explicit_typed_formal_proof
projection_cursor_channels = truth|reference_separate
projection_query_writer = 0
projection_generic_writer = 0
projection_public_surface_delta = 0
projection_p1 = authorized
derived_p2 = pending
comparison_p3 = pending
next_allowed_action = write_A3_3_P1_projection_writer_only
```

## 103. A3-3-P1 Projection Whole-Group Writer Contract

本节只闭合 `SandboxReadProjection` 的 dedicated maintenance writer。它不定义新的 domain object、public protocol、Query
writer、generic derived repository 或 projection body；也不把 source status、truth cursor、audit、stored completion 或
external outcome 的 owner转移到 projection writer。

### 103.1 Named method 与输入输出契约

```rust
/// 在同一 maintenance UoW 中 stage 一个 SandboxReadProjection whole group。
/// 该方法不 begin/commit/rollback，不分配 identity，不执行外部调用。
async fn write_projection_materialization(
    &self,
    input: WriteProjectionMaterializationInput,
    uow: &mut dyn SandboxUnitOfWork,
) -> Result<ProjectionMaterializationStage, ProjectionMaterializationError>;
```

`WriteProjectionMaterializationInput` 必须是 application-local typed carrier，字段和来源固定如下：

| 字段 | 类型 | 来源 | 约束 / 禁止替代 |
|---|---|---|---|
| `selection` | `RebuildSandboxReadProjectionsSelection` | Job 8 entry 的显式 selection DTO | 只含 context 与 ordered explicit projection refs；不得隐式 all/latest |
| `target_proof` | `ProjectionTargetProof` | projection target/index formal owner | 必须区分 `FirstMaterialization` / `Existing`；不能用 NotFound代替 |
| `source_snapshot` | `SandboxReadProjectionSourceSnapshot` | same committed source reader | 必须与 target/context相等；不接 raw body或旧 projection |
| `loaded_projection` | `Option<Versioned<SandboxReadProjection>>` | exact repository get，与 target proof branch一致 | first时必须为 `None`且有完整 zero proof；existing时必须为 `Some` |
| `staged_context` | `SandboxMaintenanceCallContext` | Job/application caller | operation/actor/digest/UoW ref必须与UoW匹配；不由writer生成 |
| `source_audit_link` | `SandboxAuditTraceRef` | source reader / accepted maintenance owner | 只能复制 matching committed linkage；不能临时分配 |
| `expected_projection_version` | `Option<SandboxRepositoryVersion>` | `loaded_projection.version` | existing branch only；不得用 cursor/timestamp |

P1 不新增 `ProjectionTargetProof` 的 public contracts schema；若现有 application port 尚未有该 typed proof，应在本批的
Step 7 port 中以 application-local closed enum / struct 明确声明，并由 formal target/index owner实现，不能由 fake 或 writer
自证。`loaded_projection` 与 `target_proof` 必须具有以下互斥关系：

| branch | target proof | loaded value | domain call | missing behavior |
|---|---|---|---|---|
| `FirstMaterialization` | exact target absent + complete zero/existence proof + context bound | `None` | `SandboxReadProjection::create(...)` 或 checked `create_unavailable(...)` | proof缺失 / context mismatch 为 integrity error，不自动降级 |
| `Existing` | exact target present + matching context/index proof | `Some(Versioned<...>)` | `SandboxProjectionRebuildAttempt::initial/from_stale` + transition | selected target missing、Version mismatch、marker mismatch为 typed conflict/indeterminate |

`ProjectionMaterializationStage` 是 application-private stage result，最少必须携带：

| 字段 | 类型 | 语义 |
|---|---|---|
| `projection_ref` | `SandboxReadProjectionRef` | exact target identity，来自 proof，不由 writer生成 |
| `context_ref` | `ControlledExecutionContextRef` | source/target共同 lineage |
| `completion` | `SandboxProjectionRebuildCompletion` | attempt、binding set、source audit linkage、completed time |
| `expected_version` | `Option<SandboxRepositoryVersion>` | existing CAS版本；first为 `None` |
| `whole_group_key` | `ProjectionMaterializationWholeGroupInspectionKey` | owner后续unknown inspection的exact key |

stage result 不能携带 `Committed`、public `Accepted`、stored result ref、new truth cursor、new audit record、external
provider outcome 或 Query response body；commit disposition由调用方 owner形成。

### 103.2 Projection whole-group staged members 与 owner

| member | source | write callable / owner | expected version | same-UoW requirement |
|---|---|---|---|---|
| projection image | checked domain factory/transition result | `SandboxReadProjectionRepository::create` 或 `save` | first proof / exact loaded object Version | image 与 status/marker relation同组可见 |
| rebuild attempt / stale marker relation | `SandboxProjectionRebuildAttempt` 与 domain transition | projection maintenance owner | projection object Version | attempt不得脱离对应 projection image |
| status-view binding coverage | `SandboxStatusViewBindingSet` | status-view read owner提供；projection writer只复制 | 不复用 projection Version | 八类 refs、context、redline coverage与source cursor exact一致 |
| truth/reference cursor coverage | `SandboxReadProjectionSourceSnapshot` | UoW/truth/reference cursor owner | 各自 typed cursor | 两通道不能合并或互换 |
| source audit linkage | accepted source/maintenance owner | existing audit relation writer | audit owner Version/identity | 只能写 matching linkage，不由projection分配 |
| projection target/index relation | formal target/index owner | target owner / repository index | index-specific expected Version | first proof与image必须同一UoW可复核 |

writer 的 stage 顺序固定为：

```text
validate staged_context and UoW identity
  -> validate explicit target_proof and branch/loaded_projection exclusivity
  -> validate source_snapshot target/context/cursor/audit lineage
  -> load/copy checked source inputs (never raw body)
  -> FirstMaterialization: create/create_unavailable checked projection
  -> Existing: validate loaded Version; initial/from_stale; apply exact domain transition
  -> build ProjectionMaterializationWholeGroupInspectionKey
  -> stage projection image + attempt/marker/relation members atomically in caller UoW
  -> read staged group through same-UoW overlay
  -> return ProjectionMaterializationStage
```

writer 遇到任一 stage error 必须停止并让 caller owner 丢弃该 whole group；不得自行回滚其它 source truth、调用外部 adapter、
写 Query cache、补建 target 或返回部分成功。

### 103.3 Whole-group inspection key 与判定

```rust
/// projection materialization commit-unknown 后的 exact whole-group inspection key。
pub struct ProjectionMaterializationWholeGroupInspectionKey {
    pub projection_ref: SandboxReadProjectionRef,
    pub context_ref: ControlledExecutionContextRef,
    pub attempt: SandboxProjectionRebuildAttempt,
    pub expected_projection_version: Option<SandboxRepositoryVersion>,
    pub source_truth_cursor: SandboxTruthCursor,
    pub source_reference_cursor: Option<SandboxReferenceCursor>,
    pub source_audit_trace_ref: SandboxAuditTraceRef,
}
```

owner 使用 fresh fair committed snapshot 按该 key 读取以下完整成员，成员集合不可缩减：

| inspection member | exact check | absent/unknown含义 |
|---|---|---|
| projection image | exact target/context、image cursor、status、binding coverage与attempt relation | 单独存在不代表 committed whole group |
| projection Version / CAS relation | first absent或existing expected Version successor relation | Version不满足时为 `Indeterminate` |
| stale marker / rebuild attempt | exact marker set、attempt target、source cursor和start/completion fencing | partial marker不归 absent |
| status-view binding set | 八类 typed refs、同context、完整 redline coverage、source cursor | 缺一项为 partial/indeterminate |
| target/index relation | formal target/index membership、context binding、exact ref | index-only或image-only均不充分 |
| source audit linkage | exact accepted source audit ref；不重新生成 | missing linkage为 indeterminate |
| owner completion | caller-owned commit/stored completion relation（若本 flow要求） | writer不能自判成功 |

inspection 只返回 application-private finite result：

```text
Committed     = whole expected member set present, mutually consistent, and owner completion confirmed
FullyAbsent   = formal first/rollback proof permits every expected member absent and before-state preserved
Indeterminate = partial/mixed/stale/conflicting/unknown relation; fail closed to existing hold/reconciliation/quarantine owner
```

`FullyAbsent` 不能由 `get_projection == None`、empty list、Query `MissingProjection` 或 fake map absence单独推导；
`Indeterminate` 不能被 writer、Query 或 entry 映射成 projection Fresh/Accepted。

### 103.4 Projection errors、parity 与负向审计

P1 只定义有限错误族，供 Step 7 application mapper 继续闭合；不扩写 Step 12 的恢复流程：

| error | trigger | disposition |
|---|---|---|
| `ProjectionTargetProofMissing` | first/existing proof不完整或selected target非显式 | integrity failure；不补建 |
| `ProjectionTargetContextMismatch` | target、selection、source context不一致 | whole group reject |
| `ProjectionSourceSnapshotInvalid` | binding、redline coverage、cursor或audit lineage不满足 Step 6 contract | source integrity failure |
| `ProjectionVersionConflict` | existing exact CAS冲突 | stale candidate discard；owner fresh reload/retry policy |
| `ProjectionStageConflict` | same-UoW duplicate target、first race或relation duplicate | whole group reject；不last-write-wins |
| `ProjectionStageUnavailable` | repository/UoW无法 stage | technical failure；不改业务 truth |
| `ProjectionCommitUnknown` | caller commit outcome unknown | owner inspection required；不得直接成功/失败归类 |

durable/fake parity 必须逐项覆盖：

| parity item | projection obligation |
|---|---|
| target proof | durable/fake都拒绝 NotFound-as-first与implicit all/latest |
| source assembly | 两者都要求同一 snapshot 的完整 typed binding set；不允许 private map scan |
| first race | 仅一个 formal first winner；loser不保存 candidate或伪成功 row |
| existing CAS | exact `Versioned<SandboxReadProjection>` conflict一致；不重载后套旧 candidate |
| dual cursor | truth/reference cursor类型与fencing规则一致，不比较数值 |
| visibility | staged whole group仅同UoW可见；其它 committed snapshot不可见 partial |
| rollback | 任一 stage error丢弃projection group，保留before-state |
| unknown | fresh fair inspection 的 `Committed/FullyAbsent/Indeterminate` 三分支一致 |
| rehydration | checked factory、error variant、body-free boundary一致 |

反向静态审计结果：

```text
projection_named_writer_methods = 1/1
projection_whole_group_inspection_keys = 1/1
projection_unique_source_owners = 1/1
projection_query_writer_use = 0
projection_generic_writer_or_dispatch = 0
projection_identity_allocation_in_writer = 0
projection_external_call_in_writer = 0
projection_body_leakage = 0
projection_public_callable_delta = 0
projection_durable_fake_parity_obligations = 9/9_design_only
```

本批没有执行代码、编译、测试、数据库/provider 验证、run、evidence、验收或 commit；上述 `1/1`、`9/9` 只表示设计
契约静态闭合。projection 仍不承接 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact
truth、observability store truth 或 policy definition/approval。

### 103.5 P1 停审与后续门

```text
A3_3_P0 = completed
A3_3_P1_projection_writer = completed_wait_user_review
A3_3_P2_derived_writer = pending
A3_3_P3_comparison_writer = pending
A3_3_P4_static_audit_sync = pending
a3_materialization_writer_closure = 9/11_design_only
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
next_allowed_action = wait_user_review_before_A3_3_P2
```

本批必须停在用户复核门；未经确认不得进入 derived writer、comparison writer、A3-4、A4、Step 8、正式 `03` 或 implementation。

用户复核后，下一步只允许读取并处理：

```text
projects/L4-sandbox/design-calibration/03_ddd_step_07_read_maintenance_surfaces.md §§101~102 current
projects/L4-sandbox/design-calibration/03_ddd_step_07_trait_port_adapter_contracts_regression_control.md current blocker control
projects/L4-sandbox/design-calibration/03_ddd_step_07_repositories_uow_indexes.md MUT-G20/MUT-G21/current recovery
projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts_failure_cleanup_read.md projection/derived/comparison current contracts
projects/L4-sandbox/design-calibration/03_ddd_step_07_cross_audit_b1_closure.md downstream revalidation differences
```

不得因 S4 完成而自动进入 A3-3、A3-4、A4、Step 8 或正式 `03` 回填。

## EOF Current Recovery Override: `7R-04A-A3-2-S4` completed, user review pending

本节位于 read artifact 物理 EOF，是当前唯一 recovery authority。S4 已完成八类 status-view writer 的正向总量、反向能力、
Query provenance、Version/UoW、unknown 与 durable/fake parity 静态审计；因此 A3-2 内容完成并停在用户复核门。该结论不关闭
A3-3/A3-4/A4，不授权 Step 8、正式 `03` 回填或 implementation，也不代表任何测试已执行。

| recovery item | current fact |
|---|---|
| `A3-2-S1` | `[x]` typed shared staged authorization、formal first、CAS 与 commit-unknown 纪律 |
| `A3-2-S2` | `[x]` execution/boundary/policy/capture/handoff `5/5` |
| `A3-2-S3` | `[x]` failure/control、cleanup、redline `3/3` |
| `A3-2-S4` | `[x]` eight-family total audit、Query provenance 差集、parity、forbidden capability 与恢复同步 |
| A3-2 total | `[x] 8/8` named methods、`8/8` typed inspection keys、`8/8` unique owner assignments |
| A3 remaining | projection/derived/comparison `3` 个 writer由A3-3处理；reconciliation/audit `2/2` existing owner由A3-4审计 |
| truth boundary | Query writer=`0/13`；public callable delta=`0`；generic writer/inspector/runtime dispatch=`0/0/0` |
| blockers | READ-001、OUTCOME-001继续开放；`BLK-SBX-CANONICAL-001`不变；新增L1/L2 blocker=`0` |
| truthfulness | implementation/test/run/evidence/acceptance/commit均未开始或未创建 |

```text
current_plan_version = v6.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-2 status-view staged writers completed_wait_user_review
current_internal_task = A3-2-S4 eight-family total audit review gate
gate_status = content_completed_wait_user_review
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = completed_wait_user_review
a3_2_s1_shared_authorization_transaction = completed
a3_2_s2_execution_boundary_policy_capture_handoff = completed
a3_2_s3_failure_cleanup_redline = completed
a3_2_s4_eight_family_total_audit = completed
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
query_write_provenance = 13/13_unique
status_view_writer_families = 8/8
status_view_named_writer_methods = 8/8
status_view_whole_group_inspection_keys = 8/8
status_view_unique_source_owners = 8/8
status_view_durable_fake_parity_obligations = 18/18_design_only
status_view_family_scenario_groups = 8/8_design_only
a3_materialization_writer_closure = 8/11
a3_remaining_materialization_writers = projection|derived|comparison
existing_writer_reuse = reconciliation|audit
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
generic_status_writer = 0
generic_inspector_port = 0
runtime_family_dispatch = 0
cleanup_index_exact_version_duplicate = 0
redline_non_exact_selector = 0
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_101|step7_control_current|step7_repositories_MUT_G20_G21|step6_projection_derived_comparison_current|step7_cross_audit
next_allowed_action = wait_user_review_before_A3_3
```

## EOF Current Recovery Override: `7R-04A-A3-3-P1` projection writer completed, review consumed

本节位于 read artifact 物理 EOF，是当前唯一恢复权威。`A3-3-P0/P1` 已完成，用户已确认继续；下一允许任务为读取 derived
current contracts 后编写 `A3-3-P2`。本覆盖不宣称 P2 已形成内容，也不授权 P3/P4、A3-4、A4、Step 8、正式 `03` 或实现。

```text
current_plan_version = v6.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P1 completed; P2 authorized_not_started
current_internal_task = A3-3-P2 derived prerequisite read
gate_status = in_progress
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = authorized_not_started
a3_3_p3_comparison_writer = pending
a3_3_p4_static_audit_sync = pending
a3_3_projection_derived_comparison_writers = in_progress
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 9/11_design_only
projection_named_writer_methods = 1/1
projection_whole_group_inspection_keys = 1/1
projection_durable_fake_parity_obligations = 9/9_design_only
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_102_103|step7_control_current|step7_repositories_MUT_G21|step6_derived_current|step7_cross_audit
next_allowed_action = read_A3_3_P2_prerequisites_then_write_derived_only
```

## 104. A3-3-P2 Derived Inspect/Preview/Trend Whole-Group Writer Contract

本节只闭合 `maintain_derived_inspect_preview_trend` 内部的具名 `write_derived_materialization`。它消费 Step 6 已闭合的
`DerivedSourceRefSet`、`DerivedReadOnlyGuard`、`DerivedInspectPreviewTrendState`、body-free materialization 与 current
binding 契约，不新增 public facade、wire DTO、canonical status、mutable root、generic derived repository 或第二套 identity。
正式 `03-详细设计.md` 继续冻结。

### 104.1 Prerequisite read、historical material 与唯一裁决

| current source | P2 消费结论 | P2 不重定义 |
|---|---|---|
| Step 6 §§15.3~15.6 | source set 必须 non-empty、ordered-unique、typed、body-free；状态只允许 `Inspect | Preview | Trend`；五个 existing transition 由 domain state 唯一拥有。 | source variant、status、marker、failure/completion carrier。 |
| Step 6 §16.8 | successful path 必须同 UoW 提交 state、immutable successful row、current status row 与 exact current binding；非 Fresh transition 生成新的 current row 并保留 optional last-success row。 | public view、payload、read gap、query surface。 |
| repositories `MUT-G21` | first 为 `C(state)`，existing 为 exact `S(state@Version)`；builder failure 不创建 core failure。 | 19 个 mutable root 与 57 个 root method registry。 |
| service facade Job 9 / §52 | formal target/source proof 区分 first/existing；first 只经 `from_sources` 或 `unavailable_from_sources`；Query、empty source、cache/body 均无 first authority。 | 第 43 个 callable、generic Job dispatcher、report finalizer。 |
| A2-F4-D | Query 只读 exact state/binding/materialization/source；`0/0` absence、`NeverMaterialized` 与 missing row 已严格分离。 | Query repair、builder、write UoW、identity allocation。 |
| A3-2 / P1 | writer stage-only、caller-owned UoW/commit、exact Version、whole-group unknown inspection 与 fake/durable parity。 | generic family dispatch、writer-owned commit、public success。 |

P2 对两处旧文字作 current 裁决，但不登记新上游 blocker：

| historical material | conflict | current disposition |
|---|---|---|
| Job 9 selection source 写作 “committed derived-state index” | first target 尚无 state root，却必须能被 formal target selector 选中。 | 降级为 `historical_material`；current owner 是 formal derived target/index。现有 selection 仍只携带 stable typed state refs，无 schema 变化。 |
| §41.10 existing-only writer snapshot | 与更晚 §52 的 formal first/existing split 冲突。 | 仅保留 existing phase 顺序；first/existing 裁决以 §52、`MUT-G21` 和本节为准。 |
| 只保存 state 后宣称 Fresh | Step 6 §16.8 明确判定为 state/materialization/binding half-commit。 | 禁止；successful row、current image、binding 与 state 必须为一个 whole group。 |

这些冲突均已有 current 上游 object/facade contract 承接，不需要 L1/L2 决策，因此 `new_l1_l2_blocker=0`。

### 104.2 Capability、kind、source 与 no-core-truth 边界

| dimension | required P2 contract | forbidden substitute |
|---|---|---|
| exact target | formal target/index 给出 context、stable state ref、fixed kind 和 source-owner relation | context/ref 文本拼 identity、Query absence、repository `NotFound`、fake map key |
| supported kind | `Inspect | Preview | Trend` 穷尽匹配 | `BackendComparison`、`Reconciliation`、runtime string kind |
| source coverage | `DerivedSourceRefSet` non-empty、ordered-unique、kind-minimum satisfied；formal assembler 证明 same-context | empty source、opaque refs、latest scan、旧 view/body、metric/log/artifact body |
| cursor | `SandboxTruthCursor` 与 `SandboxReferenceCursor` 分别按 source family 存在并独立 fencing | generic cursor、数值跨类型比较、Version/time/page token 替代 |
| authorization | builder/read 前执行 `DerivedReadOnlyGuard::evaluate`；成功 proof 绑定 exact target/source/kind/write set | caller bool、config permissive mode、Query access decision替代 maintenance guard |
| write set | matching derived state、current status image/binding、optional successful materialization、maintenance owner relation | context/boundary/policy/run/capture/handoff/failure/cleanup/redline truth |
| failure | finite builder/validation failure只能形成 `DerivedFailureSummary`，且只在 existing `Rebuilding` state 上调用 `mark_failed` | `FailureClassification`、run failure、cleanup blocker、raw adapter/SDK error reason |
| unavailable | 只接受 owner-classified caller-safe reason；保留 optional last-success relation | technical error文本、空 source、missing index伪装 unavailable |

`DerivedReadOnlyGuard` 拒绝、target/index integrity、repository unavailable、Version conflict 和 malformed builder output 均是
application error；它们不能被 writer 转成 domain `Failed` 或 `Unavailable`。P2 不执行 tools semantic execution、runtime
agent loop、member lifecycle orchestration、backend lifecycle、artifact/observability store truth 或 security investigation。

### 104.3 Application-private exact carriers 与 named method

以下 shape 均为 application-private conceptual contract；它们不进入 contracts registry、protocol DTO 或 runtime dispatch。
具体 Rust 路径由后续正式重装配固定，但 associated domain/contracts type 必须直接复用 Step 6 canonical type。

```rust
/// 已有 Job permit、call context 与当前活动 UoW 的 application-local 绑定。
/// 它不是新的 operation identity，不持久化，也不能跨 transaction 复用。
pub(crate) struct SandboxMaintenanceCallContext {
    service_call_context: SandboxServiceCallContext,
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    job_run_id: JobRunId,
    transaction_ref: SandboxTransactionRef,
}

/// formal target/index 对一个 derived maintenance target 的 body-free proof。
pub(crate) struct DerivedFormalTargetProof {
    context_ref: ControlledExecutionContextRef,
    derived_state_ref: DerivedInspectPreviewTrendStateRef,
    derived_kind: DerivedMaterialKind,
    source_refs: DerivedSourceRefSet,
    source_truth_cursor: Option<SandboxTruthCursor>,
    source_reference_cursor: Option<SandboxReferenceCursor>,
    target_index_audit_trace_ref: SandboxAuditTraceRef,
    source_observed_at: Timestamp,
}

/// formal target/index owner 在当前 write UoW 中形成的 exact 0/0/0 proof。
pub(crate) struct DerivedFirstMaterializationProof {
    context_ref: ControlledExecutionContextRef,
    derived_state_ref: DerivedInspectPreviewTrendStateRef,
    derived_kind: DerivedMaterialKind,
    state_count: u64,
    current_binding_count: u64,
    successful_materialization_count: u64,
    read_transaction_ref: SandboxTransactionRef,
}

/// existing writer 对 last-success position 的 closed、write-side expectation。
pub(crate) enum ExistingDerivedMaterializationPosition {
    Present(DerivedInspectPreviewTrendCommittedMaterialization),
    NeverMaterialized(DerivedNeverMaterializedProof),
}

/// first 与 existing 不可混淆的 target/state/current-binding expectation。
pub(crate) enum DerivedMaterializationTargetExpectation {
    FirstMaterialization {
        formal_target: DerivedFormalTargetProof,
        first_proof: DerivedFirstMaterializationProof,
    },
    Existing {
        formal_target: DerivedFormalTargetProof,
        state: Versioned<DerivedInspectPreviewTrendState>,
        current_binding: Versioned<DerivedInspectPreviewTrendViewBinding>,
        materialization_position: ExistingDerivedMaterializationPosition,
        read_transaction_ref: SandboxTransactionRef,
    },
}

/// guard evaluate 成功后由 application crate 构造的不可序列化 proof。
pub(crate) struct DerivedMaintenanceAuthorizationProof {
    guard_ref: DerivedReadOnlyGuardRef,
    context_ref: ControlledExecutionContextRef,
    derived_state_ref: DerivedInspectPreviewTrendStateRef,
    derived_kind: DerivedMaterialKind,
    source_refs: DerivedSourceRefSet,
    source_truth_cursor: Option<SandboxTruthCursor>,
    source_reference_cursor: Option<SandboxReferenceCursor>,
    evaluated_at: Timestamp,
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    job_run_id: JobRunId,
}

/// trusted builder 成功后形成的 checked、body-free result；三个成员必须同源同 cursor。
pub(crate) struct CheckedDerivedSuccessfulBuild {
    source: DerivedMaterializationSourceSnapshot,
    materialization: DerivedInspectPreviewTrendMaterialization,
    completion: DerivedRebuildCompletion,
}

/// 一个 named writer 可接受的七个 closed phase；不是 public status 或 runtime dispatch key。
pub(crate) enum DerivedMaterializationWritePhase {
    FirstFresh { build: CheckedDerivedSuccessfulBuild },
    FirstUnavailable { reason: SandboxReason, changed_at: Timestamp },
    MarkStale { marker: DerivedRebuildMarker, changed_at: Timestamp },
    StartRebuild { marker: DerivedRebuildMarker, started_at: Timestamp },
    FinishRebuild { build: CheckedDerivedSuccessfulBuild },
    MarkFailed { failure: DerivedFailureSummary },
    MarkUnavailable { reason: SandboxReason, changed_at: Timestamp },
}

/// write phase 的 application-private inspection tag；不进入 public status 或 runtime dispatch。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum DerivedMaterializationPhaseKind {
    FirstFresh,
    FirstUnavailable,
    MarkStale,
    StartRebuild,
    FinishRebuild,
    MarkFailed,
    MarkUnavailable,
}

/// Job 9 为一个 exact item 构造的 writer input。
pub(crate) struct WriteDerivedMaterializationInput {
    expectation: DerivedMaterializationTargetExpectation,
    authorization: DerivedMaintenanceAuthorizationProof,
    phase: DerivedMaterializationWritePhase,
    new_current_view_ref: DerivedInspectPreviewTrendViewRef,
    transition_audit_trace_ref: SandboxAuditTraceRef,
    staged_context: SandboxMaintenanceCallContext,
}

/// writer 已完整 stage、但尚未由 caller commit 的 exact whole-group result。
pub(crate) struct DerivedMaterializationStage {
    state_ref: DerivedInspectPreviewTrendStateRef,
    phase: DerivedMaterializationPhaseKind,
    new_current_view_ref: DerivedInspectPreviewTrendViewRef,
    successful_view_ref: Option<DerivedInspectPreviewTrendViewRef>,
    expected_state_version: Option<Version>,
    expected_binding_version: Option<Version>,
    whole_group_inspection_key: DerivedMaterializationWholeGroupInspectionKey,
}

/// stage-only writer 的有限错误；commit unknown 由 caller UoW owner 单独处理。
pub(crate) enum DerivedMaterializationWriteError {
    DerivedTargetProofMissing,
    DerivedTargetContextKindMismatch,
    DerivedSourceCoverageInvalid,
    DerivedReadOnlyAuthorizationRejected,
    DerivedFirstMaterializationConflict,
    DerivedStateVersionConflict,
    DerivedCurrentBindingConflict,
    DerivedMarkerFenceConflict,
    DerivedMaterializationInvalid,
    DerivedStageUnavailable,
    DerivedStageIntegrityViolation,
}

/// 在 caller 的 MUT-G21 UoW 中 stage 一个 exact derived whole group。
/// 不 begin/commit/rollback，不运行 builder，不分配 identity/cursor/audit。
async fn write_derived_materialization(
    &self,
    input: WriteDerivedMaterializationInput,
    uow: &mut dyn SandboxUnitOfWork,
) -> Result<DerivedMaterializationStage, DerivedMaterializationWriteError>;
```

`SandboxMaintenanceCallContext` 只能由对应 fixed Job 的活动 `SandboxJobInvocationPermit<S>` 与当前 UoW 构造：本节的 `S` 为
`MaintainDerivedInspectPreviewTrendSelection`，P1 的 `S` 为 `RebuildSandboxReadProjectionsSelection`。constructor 必须重验
fixed Job kind、`service_call_context` 的 Job channel / operation / actor / digest / key、permit 的
`idempotency_record_ref` / `job_run_id`，以及 `transaction_ref == uow.transaction_ref()`。该 carrier 不实现 serialization，
不生成或拥有 identity；P1 中同名 conceptual carrier 也以本 shape 为 current 解释。

`DerivedFirstMaterializationProof` 只能由 formal target/index owner 构造，并至少冻结 exact state count、exact current-binding
count、successful-materialization count 均为零，且 `read_transaction_ref` 必须等于当前 write UoW；writer 仍须在 stage 前
原子重验。任一 count 非零时 constructor 不得返回 proof。它不是 Step 6
Query `DerivedInspectPreviewTrendAbsenceProof` 或 `DerivedNeverMaterializedProof` 的别名，也不能从它们转换。

`DerivedMaintenanceAuthorizationProof` 只能在 `DerivedReadOnlyGuard::evaluate` 成功后由 application 构造。它绑定原
`idempotency_record_ref`、`job_run_id`、formal target、source set和两类 source cursor，可以跨 builder await，但不能跨 Job
invocation、target或source snapshot复用；它不再引入 transaction/build scope identity。writer 必须把该 proof 与
`SandboxMaintenanceCallContext`、formal target和当前 phase逐字段重验。

`CheckedDerivedSuccessfulBuild` 必须逐项满足：source/state/kind 与 formal target 相等；source refs 与 completion refs 相等；
truth/reference cursor 分别相等；payload kind 与 source kind 相等；completion time 不早于 source observation；completion audit
与 transition audit 为本次 accepted maintenance lineage。任一不等在任何 stage 前返回 typed error。

`DerivedMaterializationStage` 只携带 `state_ref`、phase、new current view ref、optional successful view ref、expected state/current
binding Version 和 whole-group inspection key。它不携带 `Committed`、public item status、stored report、new truth cursor、raw
builder output 或 retry hint。

### 104.4 First/existing reachability 与 builder transaction choreography

| branch | formal proof / precondition | exact domain and persistence action | result boundary |
|---|---|---|---|
| first + successful build | formal target、complete source snapshot、guard proof、validated payload/completion；write UoW重验 state/binding/success count均0 | `from_sources`；create state；stage same-ref successful row/current image；insert current binding与successful index | commit confirmed后才可 `Succeeded(Derived(ref))` |
| first + source unavailable | formal target/source refs与owner-classified safe reason；三类count仍为0 | `unavailable_from_sources`；create state；stage status-only current image/binding；successful index保持0 | commit confirmed后 `Degraded(Derived(ref), reason)` |
| first + builder rejected/invalid/technical error | 尚无 state root；没有合法 initial-failed factory | whole write set为0；丢弃 builder output；只形成 Job item/application error的safe分类 | 不创建 state、view、binding、core failure或第二identity |
| existing + source change | matching committed marker，或 source owner尚未保存该marker | fresh `Versioned<State>` 调 `mark_stale`，CAS save；new current status image/binding；保留last-success row | confirmed后 state为Stale；同marker no-op在identity分配前 `Skipped` |
| existing + rebuild start | current `Stale | Failed | Unavailable`、matching marker、exact state/current binding Version | `start_rebuild`，CAS save；new Rebuilding current image/binding；last-success relation不变 | start group commit confirmed后才运行builder |
| existing + successful completion | builder在UoW外完成；fresh load仍为same-marker Rebuilding | `finish_rebuild`，CAS save；new successful row/current image使用同一new view ref；replace binding与successful index | whole group confirmed后 Fresh/Succeeded |
| existing + finite builder failure | fresh load仍为same-marker Rebuilding；failure cursor与marker exact | `mark_failed`，CAS save；new Failed current image/binding；不新增successful row | committed derived-only `Degraded`；不创建core failure |
| existing + classified unavailable | fresh load仍为same-marker Rebuilding；safe reason已分类 | `mark_unavailable`，CAS save；new Unavailable current image/binding；保留last-success | committed `Degraded`；technical error不能冒充该分支 |

existing owner 的唯一允许顺序为：

```text
read formal target and committed source outside write UoW
  -> evaluate strict DerivedReadOnlyGuard
  -> if a new marker must be consumed:
       begin short UoW -> fresh state/binding read -> MarkStale stage -> commit/inspect
  -> begin short UoW -> fresh state/binding read -> StartRebuild stage -> commit/inspect
  -> only after confirmed Rebuilding: release all UoW handles and run trusted body-free builder
  -> begin completion UoW -> fresh state/binding/marker read
  -> FinishRebuild | MarkFailed | MarkUnavailable stage -> commit/inspect
```

若 source owner已原子提交 matching Stale state/current row，Job 9 从该 committed point 开始，不重复 `MarkStale`。任何 start
commit unknown 未裁决前禁止运行builder；builder后 CAS conflict/new marker使旧 output 失效，不能 reload latest 后套用旧
completion/failure。没有 UoW 可跨 builder await；writer 本身外部调用数固定为0。

### 104.5 Current image、successful row、binding 与 exact stage set

P2 补充一个 application/infra-private logical image，不新增 public view 或 canonical state：

```rust
pub(crate) struct DerivedInspectPreviewTrendCurrentViewImage {
    current_view_ref: DerivedInspectPreviewTrendViewRef,
    context_ref: ControlledExecutionContextRef,
    derived_state_ref: DerivedInspectPreviewTrendStateRef,
    derived_kind: DerivedMaterialKind,
    derived_status: DerivedInspectPreviewTrendStatus,
    maintenance_detail: DerivedMaintenanceDetail,
    current_source_refs: DerivedSourceRefSet,
    current_truth_cursor: Option<SandboxTruthCursor>,
    current_reference_cursor: Option<SandboxReferenceCursor>,
    last_materialized_source_refs: Option<DerivedSourceRefSet>,
    materialized_truth_cursor: Option<SandboxTruthCursor>,
    materialized_reference_cursor: Option<SandboxReferenceCursor>,
    materialized_view_ref: Option<DerivedInspectPreviewTrendViewRef>,
    state_created_at: Timestamp,
    state_status_changed_at: Timestamp,
    state_audit_trace_ref: SandboxAuditTraceRef,
    bound_at: Timestamp,
}
```

该 image 只能从 transitioned domain state、formal context proof、optional exact last-success row和预生成current view ref构造。
Fresh 强制 `materialized_view_ref == current_view_ref`，并要求同 key successful row；其它 status 有 last-success 时两ref必须不同，
无 last-success 时 `materialized_view_ref=None` 且 successful index count为0。image decode必须重建 Step 6 state read snapshot/detail，
不得信任 persisted status text、nullable field默认值或 old payload。

每个 phase 的 staged set固定如下：

| staged member | first Fresh | first Unavailable | existing status phase | existing Finish |
|---|---:|---:|---:|---:|
| canonical state root via `create_derived_state` / exact `save_derived_state` | create | create | CAS save | CAS save |
| new immutable current image by `new_current_view_ref` | required | required | required | required |
| `DerivedInspectPreviewTrendCommittedMaterialization` | required，同ref | absent | absent；old row只引用不修改 | required，同ref |
| exact current binding `(context,state,kind)` | insert | insert | exact Version CAS replace | exact Version CAS replace |
| successful-materialization index | insert exactly one | zero proof保持 | unchanged；last-success relation保持 | append new successful row relation |
| current-to-last-success relation | self | none | exact old successful ref或Never proof | self |
| transition/source audit linkage | required existing/staged owner audit | required | required | required |
| Job 9 frozen item/operation relation | required | required | required | required |

derived immutable image/binding stage capability属于本具名 writer 的 logical persistence slice；它不增加第20个 mutable domain root，
也不允许 `Repository<T>`、upsert或 generic `save_materialization(kind,payload)`。后续 Step 11 必须把 current image、successful row、
binding、successful index和last-success relation映射为 exact typed schema/unique/CAS；在此之前实现者不得自行缩成 state-only save。

writer 的固定 stage algorithm：

```text
1. validate staged_context/UoW identity and DerivedReadOnlyGuard proof
2. validate formal target, kind, non-empty source set and dual-cursor family relation
3. validate phase <-> First/Existing expectation legality
4. First: atomically re-read state/binding/success indexes and require 0/0/0
5. Existing: re-read exact state + current binding; require both values/Versions equal expectation
6. revalidate Present/NeverMaterialized relation and marker fence before transition
7. apply exactly one canonical factory/transition to an owned candidate state
8. construct and checked-rehydrate current image; construct successful row only for Fresh phases
9. stage state create/CAS, current image, optional successful row, binding insert/CAS and exact indexes
10. stage matching audit/source/owner relations without allocating new identities or cursors
11. exact-read the full staged group through the same-UoW overlay and compare all fields/cardinalities
12. return DerivedMaterializationStage; caller still owns commit/rollback/unknown inspection
```

stage 1~6失败时 write count必须为0；stage 7以后任一失败要求 caller rollback whole item UoW。不得修补后继续stage、返回
partial item、先移动binding再补row，或让 deterministic fake自动补齐缺失成员。

### 104.6 Whole-group commit-unknown inspection

```rust
/// Job 9 item commit-unknown 后唯一允许使用的 exact、body-free key。
pub(crate) struct DerivedMaterializationWholeGroupInspectionKey {
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    job_run_id: JobRunId,
    context_ref: ControlledExecutionContextRef,
    derived_state_ref: DerivedInspectPreviewTrendStateRef,
    derived_kind: DerivedMaterialKind,
    phase: DerivedMaterializationPhaseKind,
    new_current_view_ref: DerivedInspectPreviewTrendViewRef,
    expected_state_version: Option<Version>,
    expected_binding_version: Option<Version>,
    source_refs: DerivedSourceRefSet,
    source_truth_cursor: Option<SandboxTruthCursor>,
    source_reference_cursor: Option<SandboxReferenceCursor>,
    marker: Option<DerivedRebuildMarker>,
    previous_materialized_view_ref: Option<DerivedInspectPreviewTrendViewRef>,
    successful_row_expected: bool,
    source_audit_trace_ref: SandboxAuditTraceRef,
    transition_audit_trace_ref: SandboxAuditTraceRef,
}
```

`DerivedMaterializationPhaseKind`只用于 private inspection/diagnostic 的七值闭集，不进入 public status或 dispatch。inspection
以 `idempotency_record_ref` 作为唯一 persisted operation owner ref，并重验该 record 的 fixed operation/digest/key relation；
`JobRunId` 只关联原 invocation，不替代 duplicate identity。不得另造 `SandboxIdempotencyIdentity`、scope ref 或 recovery id。
inspection 在新的 fair committed snapshot逐项检查：

| member | committed exact check | absent/partial rule |
|---|---|---|
| state root | first为exact new state；existing为expected Version之后的exact transitioned image，marker/status/last-success关系全等 | state-only可见为`Indeterminate` |
| current image | exact new view ref、context/state/kind/status/source/cursors/detail/audit/time | image缺失但state已变为`Indeterminate` |
| current binding | unique exact key只指new view ref，status/time/audit与state/image全等 | old/new混合或duplicate current为`Indeterminate` |
| successful row/index | Fresh phase恰一row且source/payload/completion同构；其它phase new row count固定0 | required row缺失、forbidden row出现均`Indeterminate` |
| last-success relation | Fresh self-ref；其它phase保持exact old ref或完整Never proof | latest scan、row `None`、empty summary不能证明relation |
| cursor/marker fencing | truth/reference独立；marker、completion/failure均属于exact source snapshot | generic cursor或old marker completion为conflict/indeterminate |
| audit/owner relation | source/transition audit已提交且角色正确；operation/job target relation匹配 | writer不补audit或stored report，不从log猜relation |

finite inspection result保持 application-private：

```text
Committed     = all expected state/image/binding/index/audit/owner relations exist and are mutually exact
FullyAbsent   = all frozen new members absent; first remains 0/0/0, or existing state/binding remain exact before-state
Indeterminate = partial, mixed, duplicate, stale marker, unavailable dependency, contradictory Version/cursor or unknown relation
```

`FullyAbsent`不能由 `get_state == NotFound`、current image缺失、Query `Empty`、rollback返回值或 fake map absence单独推导。
`Indeterminate`进入既有 hold/reconciliation/quarantine owner；inspection 不运行builder、不分配identity、不写repair、不改变
core truth，也不把 unknown 映射成 Job `Succeeded/Degraded/Failed`。

### 104.7 Finite error、builder failure mapping 与 parity

| error | exact trigger | disposition |
|---|---|---|
| `DerivedTargetProofMissing` | formal target/first proof不完整或selection不是explicit | integrity；不由NotFound补建 |
| `DerivedTargetContextKindMismatch` | context/state/kind在target、source、state、binding间不等 | whole item reject |
| `DerivedSourceCoverageInvalid` | empty/duplicate/wrong-kind/body-bearing source或cursor family不闭合 | stage 0；不运行builder或写Unavailable |
| `DerivedReadOnlyAuthorizationRejected` | guard/proof/write target不匹配 | application invariant/security reject；不写Failed |
| `DerivedFirstMaterializationConflict` | same-UoW 0/0/0重验失败或first race | candidate/output丢弃；不转existing复用旧build |
| `DerivedStateVersionConflict` | existing state exact CAS冲突 | stale state/build丢弃；owner从完整flow重新进入 |
| `DerivedCurrentBindingConflict` | current binding value/Version或single-current约束冲突 | whole UoW rollback；不last-write-wins |
| `DerivedMarkerFenceConflict` | marker/source-set/cursor被新提交覆盖 | old completion/failure不得应用 |
| `DerivedMaterializationInvalid` | payload/completion/current image/last-success relation不满足Step 6 | derived output reject；无半组提交 |
| `DerivedStageUnavailable` | repository/UoW不能完成exact stage/read-your-write | technical `PortUnavailable`；不写safe reason |
| `DerivedStageIntegrityViolation` | half row、duplicate index、wrong lineage或decode relation损坏 | fail closed到既有consistency owner |
| `DerivedCommitUnknown` | caller无法确认item UoW commit | 只按§104.6 inspection；禁止blind retry |

前十一项是 `DerivedMaterializationWriteError` 的穷尽 variants；`DerivedCommitUnknown` 是 writer 返回后由 caller
`SandboxUnitOfWorkManager::commit` 形成的 terminal disposition，不进入 writer error enum，也不能由 writer构造。

builder/source outcome的唯一映射：

| checked outcome | first | existing Rebuilding | forbidden escalation |
|---|---|---|---|
| successful body-free build | `FirstFresh` | `FinishRebuild` | payload body写state、query现场计算 |
| owner-classified source unavailable | `FirstUnavailable` | `MarkUnavailable` | raw transport/SDK/host error作reason |
| finite `DerivedFailureSummary` | no state write；Job item safe failure | `MarkFailed` | `FailureClassification`、run/capture/cleanup/redline transition |
| technical error / malformed output | application error，write set 0 | application error；保留Rebuilding直到显式owner recovery policy | 伪造finite failure、自动重跑、覆盖new marker |

durable adapter与deterministic fake必须共享以下12项设计义务；这些是后续测试切口，不是已执行结果：

| parity item | exact obligation |
|---|---|
| formal target | 都拒绝 committed-state-index-only、NotFound-as-first和implicit all/latest |
| source set | 都保持non-empty ordered-unique typed set和kind minimum，不从map/body补source |
| guard | 都执行strict no-core-truth authorization，无fake bypass |
| first race | 0/0/0 only one winner；loser不转existing、不保存builder output |
| state CAS | exact `Versioned<State>`；CAS loser旧transition作废 |
| binding CAS | 独立 exact binding Version；不得复用state Version |
| dual cursor | truth/reference presence、comparison和marker fencing完全一致 |
| phase ordering | Rebuilding commit confirmed后才builder；completion使用fresh state/binding |
| visibility | state/current image/binding/optional successful row只整组可见 |
| rollback | 任一stage error保留first absence或existing before-state，无partial index |
| unknown | exact `Committed/FullyAbsent/Indeterminate`，不读取fake script作为业务事实 |
| rehydration/body | checked image/payload/detail/last-success关系一致，raw body/error均不持久化 |

### 104.8 P2 static audit 与停审门

```text
derived_named_writer_methods = 1/1
derived_closed_write_phases = 7/7
derived_supported_kinds = 3/3 (Inspect|Preview|Trend)
derived_whole_group_inspection_keys = 1/1
derived_unique_source_owners = 1/1 (Job9/MUT-G21)
derived_durable_fake_parity_obligations = 12/12_design_only
derived_query_writer_use = 0
derived_generic_writer_or_runtime_dispatch = 0
derived_core_truth_writes = 0
derived_failure_classification_create = 0
derived_identity_or_cursor_allocation_in_writer = 0
derived_external_call_in_writer = 0
derived_state_only_success_path = 0
derived_unowned_scope_or_identity_types = 0
derived_public_callable_delta = 0
a3_materialization_writer_closure = 10/11_design_only
```

本节没有执行代码、编译、测试、数据库/provider、真实 parity、run、evidence、验收或 commit。`1/1`、`7/7`、`12/12`
仅表示设计文本静态闭合。`READ-001`仍需 P3、P4、A3-4 与 A4 总审计；`OUTCOME-001`仍由既有 owner关闭。

```text
A3_3_P0 = completed
A3_3_P1_projection_writer = completed
A3_3_P2_derived_writer = completed_wait_user_review
A3_3_P3_comparison_writer = pending
A3_3_P4_static_audit_sync = pending
a3_materialization_writer_closure = 10/11_design_only
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
next_allowed_action = wait_user_review_before_A3_3_P3
```

## Historical-Position 105. A3-3-P3 Backend Capability Comparison Whole-Group Writer Contract

本节只闭合 `BackendCapabilityComparisonView` 的 dedicated whole-group writer。它消费 Step 6 已完成的
`BackendCapabilityComparisonMaterializationCandidate`、
`BackendCapabilityComparisonBindingWriteExpectation`、exact selector/current-binding contract 与四个 logical store，
并把 Step 7 当前统一的 stage-only、caller-owned commit、commit-unknown inspection 纪律落到 comparison。它不修改
comparison Query reader，不增加 public facade、scheduler、mutable root、comparison 状态机或新的业务 identity。
本节正文位于旧 P2 EOF override 之前；只有本文物理 EOF 的 P3 current override 能激活本节，旧 P2 recovery 记录继续作为
historical execution trace，不再代表当前状态。

### 105.1 Prerequisite、historical conflict 与当前裁决

P3 写入前重新读取了详细设计 SOP、详细设计书写规范、中间产物规范、真相源闭环标准、设计文档通则，以及下列 current
source：

| current source | P3 消费的权威事实 | P3 不继承的历史解释 |
|---|---|---|
| Step 6 §16.9.1~§16.9.14 | required selector=`context + exact requirement + ordered-unique 1..=16 capability summary refs`；Query 只读 exact binding/source；body-free、十维完整、双 cursor | opaque scope、profile/config scan、all/latest、Query probe/materialize、unsupported-kind 摘要 |
| Step 6 §16.9.15 | binding-free candidate、`FirstMaterialization | ReplaceCurrent`、new immutable view ref、whole-group row/binding/link/index | 原地更新 old row、last-write-wins、`NotFound` 作为 first proof、partial/degraded candidate |
| Step 6 §16.9.17.5 | comparison row、current binding、ordered source links、exact-key row index 四个 logical store | generic derived row、latest row winner、同 key historical row 被当作 first |
| Step 7 §§92~104 | named writer 只 stage；UoW manager、commit/rollback、stored/idempotency completion 与 unknown inspection 归 caller owner | writer 自行 begin/commit/rollback，stage result 直接命名 `Committed` |
| Step 7 repository/UoW current | logical mutable roots 固定 `19`；same-UoW group 固定 `MUT-G01~MUT-G21`，其中 G20/G21 分别属于 projection/derived | 为 comparison 临时增加第 20 个 root、`MUT-G22` 或 generic `Repository<T>` |
| A2 comparison reader current | named reader、三计数 cardinality、same-snapshot source assembly、Query write=`0` | 由 writer 反向接管 Query、reader 缺行时补建 binding |

当前需要显式覆盖的 historical conflict 如下：

1. Step 6 §16.9.15.3 把 `materialize_backend_capability_comparison(...)` 描述成直接返回
   `Committed | DuplicateEquivalent`。这两个值继续保留为 **caller/source-maintenance owner 的终局 outcome**；Step 7
   persistence writer 只返回 `BackendCapabilityComparisonMaterializationStage`。stage result 不得证明 commit。
2. Step 6 使用的未展开 `AcceptedSandboxWriteContext` 是当时的 application authorization placeholder。P3 不把它错误套入
   八类 status-view family marker，也不新增无 owner scope；comparison 改用 application-private accepted source proof、既有
   `SandboxMaintenanceCallContext` 与当前 UoW 的逐字段绑定。
3. Step 6 已列出 comparison logical stores，但 Step 7 mutable repository registry 没有独立 comparison root。P3 将其实现面
   固定为 `application::ports::query_materialization` 下的 dedicated persistence slice；current binding 是该 slice 的唯一
   mutable relation，不构成新的 domain mutable root，`MUT-G01~MUT-G21` 编号不变。
4. Step 6 早期记录的 `SBX-DDD-GRANULARITY-REOPEN-001`、`SBX-DDD-GRANULARITY-STEP6-001` 与
   `BLK-SBX-VERSION-001` 只作为 historical material 定位来源，不覆盖当前项目台账。P3 当前 blocker 仍以物理 EOF 台账中的
   `READ-001`、`OUTCOME-001` 与 implementation gate `BLK-SBX-CANONICAL-001` 为准。

`BLK-SBX-CANONICAL-001` 继续阻断真实 `SandboxSourceDigest` writer/verifier 实现。P3 只要求 candidate 已携带由 canonical
writer 形成的 opaque digest，并逐字段验证其 key relation；本节不选择 hash/serialization 算法，不伪造 digest fixture。
这不是新的 L1/L2 blocker，也不妨碍 writer seam 的设计静态闭合。

### 105.2 Unique owner、authorized caller 与 no-new-root boundary

comparison materialization 的唯一写能力 owner 固定为 application 的 dedicated
`BackendCapabilityComparisonMaterializationWriter`。它只允许被两个既有 source-maintenance item kernel 调用：

| authorized caller | 进入 comparison writer 前必须成立 | 禁止扩展 |
|---|---|---|
| `RefreshBackendCapabilitySummaries` item owner | capability resolver 已在 UoW 外完成；新的 `BackendCapabilitySummary` 与 current binding 已确认提交；matching requirement、reference state、summary、audit 与 cursor 可由 fresh committed snapshot 完整读取 | writer 调 capability port、把 adapter success 当 source proof、直接建立 boundary |
| `RefreshSandboxReferenceStates` item owner | typed reference observation/state 已确认提交；matching capability summary 仍是 exact selected source；reference audit/cursor 与 candidate row 关系完整 | writer 调 resolver、将 `Unresolved/Invalid/Unavailable` 改成 `Unknown`、沿用不完整 last-known row |

两个 caller channel 不产生两个 writer，也不形成 runtime dispatch。application-private source-owner tag 只用于 permit/proof
验证和低基数诊断；不能由字符串、job name 或 protocol 字段选择 method。两条路径都调用同一个具名 stage method，并服从同一
candidate、expectation、logical store、error 与 unknown inspection contract。

comparison writer 的责任边界固定如下：

| responsibility | writer owns | writer does not own |
|---|---|---|
| source | 验证已提交 requirement/capability/reference snapshots、generation、双 cursor 与已有 audit linkage | refresh/probe source、修改 summary/reference status、推进 truth/reference cursor |
| identity | 验证 caller 预生成的 `BackendCapabilityComparisonViewRef` 与原 operation relation | 分配 view/audit/idempotency/job/cursor identity；从 ref 文本拼 identity |
| persistence | stage immutable row、ordered source links、exact-key row membership、current binding insert/CAS | 新增 mutable root、保存 generic object/body、删除或改写 historical row |
| transaction | 在 caller 的同一个 UoW 内 exact read、stage、read-your-write 校验 | begin/commit/rollback、commit receipt、blind retry |
| audit | 只链接并验证 accepted source-maintenance audit | 追加 view-specific business audit、把 Query/diagnostic 当 audit truth |
| outcome | 返回 stage metadata 与 whole-group inspection key | 返回 `Committed`、public Query status、boundary decision、Job item success 或验收结果 |

comparison 是 boundary/capability **记录面与异常可见性支撑**，不是 Sandbox 主体执行能力。writer 不建立 execution
environment，不施加 resource/filesystem/network/process boundary，不 launch tool/runtime，不捕获 artifact，不编排 member
lifecycle，不执行 cleanup/reaper，也不改变 security redline truth。

### 105.3 Application-private exact carriers

以下 shape 均为 application-private conceptual contract。它们不进入 contracts named-type registry、Step 8 wire DTO、public
Query selector 或 runtime family dispatch；关联的 domain/contracts 类型全部直接复用 Step 6 current canonical type。

```rust
/// 允许进入 comparison stage writer 的两个既有 source-maintenance owner。
/// 仅用于 typed permit validation，不是 scheduler/runtime dispatch key。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum BackendCapabilityComparisonMaintenanceSourceOwner {
    CapabilitySummaryRefresh,
    ReferenceStateRefresh,
}

/// startup-validated maintenance target registry 对一个 exact comparison target 的 proof。
/// 不携带 config scope identity，不进入 selector/binding/digest，也不是 persisted business identity。
pub(crate) struct BackendCapabilityComparisonFormalTargetProof {
    selector: BackendCapabilityComparisonSelector,
    source_set_digest: SandboxSourceDigest,
    ordered_backend_refs: Vec<ExternalSourceRef>,
    target_registered_at: Timestamp,
}

/// 已提交 source maintenance 与本次 comparison candidate 的 application-local proof。
/// constructor 只能由两个 authorized item owner 在 fresh committed source read 后调用。
pub(crate) struct BackendCapabilityComparisonAcceptedSourceProof {
    source_owner: BackendCapabilityComparisonMaintenanceSourceOwner,
    selector: BackendCapabilityComparisonSelector,
    source_set_digest: SandboxSourceDigest,
    requirement_source: BackendCapabilityComparisonRequirementSourceSnapshot,
    reference_sources: Vec<BackendCapabilityComparisonReferenceSourceSnapshot>,
    rows: BackendCapabilityComparisonBackendRowSet,
    cursor_relation: BackendCapabilityComparisonCursorRelation,
    comparison_status: BackendCapabilityComparisonStatus,
    comparison_audit_trace_ref: SandboxAuditTraceRef,
    source_accepted_at: Timestamp,
    candidate_prepared_at: Timestamp,
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    job_run_id: JobRunId,
}

/// formal write-side first proof；只能由 complete exact-key indexes 在当前 UoW 中形成。
pub(crate) struct BackendCapabilityComparisonFirstWriteProof {
    selector: BackendCapabilityComparisonSelector,
    source_set_digest: SandboxSourceDigest,
    candidate_view_ref: BackendCapabilityComparisonViewRef,
    current_binding_count: u64,
    total_rows_for_exact_key: u64,
    candidate_view_ref_row_count: u64,
    read_transaction_ref: SandboxTransactionRef,
}

/// exact key 在当前 write UoW 中读取的完整 position；不是 Query absence proof。
pub(crate) struct BackendCapabilityComparisonWritePosition {
    current_binding_count: u64,
    binding_target_row_count: u64,
    total_rows_for_exact_key: u64,
    candidate_view_ref_row_count: u64,
    current_binding: Option<Versioned<BackendCapabilityComparisonViewBinding>>,
    read_transaction_ref: SandboxTransactionRef,
}

/// Step 6 expectation 的 write-side evidence；两分支严格互斥。
pub(crate) enum BackendCapabilityComparisonWriteEvidence {
    First {
        proof: BackendCapabilityComparisonFirstWriteProof,
    },
    Replace {
        loaded_current_binding: Versioned<BackendCapabilityComparisonViewBinding>,
        read_transaction_ref: SandboxTransactionRef,
    },
}

/// comparison stage writer 的完整输入。
pub(crate) struct StageBackendCapabilityComparisonMaterializationInput {
    candidate: BackendCapabilityComparisonMaterializationCandidate,
    expectation: BackendCapabilityComparisonBindingWriteExpectation,
    evidence: BackendCapabilityComparisonWriteEvidence,
    formal_target: BackendCapabilityComparisonFormalTargetProof,
    accepted_source: BackendCapabilityComparisonAcceptedSourceProof,
    bound_at: Timestamp,
    staged_context: SandboxMaintenanceCallContext,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub(crate) enum BackendCapabilityComparisonStageMode {
    FirstMaterialization,
    ReplaceCurrent,
}

/// commit unknown 后只用于定位已提交 source owners 的 body-free key set。
pub(crate) struct BackendCapabilityComparisonSourceInspectionKeys {
    requirement_ref: BoundaryRequirementSetRef,
    capability_summary_refs: BackendCapabilityComparisonSourceRefSet,
    reference_state_refs: Vec<ReferenceResolutionStateRef>,
    generation_ref: ResourceRef,
    truth_cursor: SandboxTruthCursor,
    reference_cursor: SandboxReferenceCursor,
    source_audit_trace_refs: Vec<SandboxAuditTraceRef>,
    comparison_audit_trace_ref: SandboxAuditTraceRef,
}

/// comparison materialization whole-group commit-unknown 的 exact inspection key。
pub(crate) struct BackendCapabilityComparisonWholeGroupInspectionKey {
    mode: BackendCapabilityComparisonStageMode,
    context_ref: ControlledExecutionContextRef,
    requirement_ref: BoundaryRequirementSetRef,
    capability_summary_refs: BackendCapabilityComparisonSourceRefSet,
    source_set_digest: SandboxSourceDigest,
    new_view_ref: BackendCapabilityComparisonViewRef,
    expected_previous_binding: Option<BackendCapabilityComparisonViewBinding>,
    expected_previous_binding_version: Option<Version>,
    source_keys: BackendCapabilityComparisonSourceInspectionKeys,
    idempotency_record_ref: SandboxIdempotencyRecordRef,
    job_run_id: JobRunId,
    transaction_ref: SandboxTransactionRef,
}

/// whole group 已在 caller UoW staged；不表示 durable commit。
pub(crate) struct BackendCapabilityComparisonMaterializationStage {
    mode: BackendCapabilityComparisonStageMode,
    view_ref: BackendCapabilityComparisonViewRef,
    binding: BackendCapabilityComparisonViewBinding,
    expected_binding_version: Option<Version>,
    whole_group_inspection_key: BackendCapabilityComparisonWholeGroupInspectionKey,
}
```

`BackendCapabilityComparisonAcceptedSourceProof` constructor 必须重验：

1. permit 来自 `RefreshBackendCapabilitySummariesSelection` 或 `RefreshSandboxReferenceStatesSelection` 的 exact changed source
   item；context、operation、actor、digest、idempotency record 与 `JobRunId` 必须和既有 `SandboxServiceCallContext` 相等。
   该 selection 只证明 source-change caller，不证明完整 comparison source set。
2. selector、requirement source、ordered reference sources、row set 和 cursor relation 可由同一 fresh committed snapshot 读取；
   selector cardinality 固定 `1..=16`，不得从 selection 剩余项、配置 profile 或 reverse index 扩大集合。
3. reference source 仅允许 `Resolved` 或关系完整的 last-known `Stale`；candidate aggregate 只允许
   `FullySupported | Unsupported | Unknown | Stale`。任何 read gap、partial row、`Degraded | Unavailable` 均不能构造 proof。
4. `comparison_audit_trace_ref` 与各 source audit ref 已由 source owner 提交，且不晚于 `source_accepted_at`；comparison view
   不是 audit subject，constructor 不创建新 audit。
5. candidate 的 selector、digest、requirement source、reference sources、rows、cursor relation、aggregate、audit ref 和
   `prepared_at` 与 proof 逐字段相等；`candidate_prepared_at >= source_accepted_at`，每个 backend row 十维完整并与 selector
   同序。proof 不能从 candidate 单方面自证。

`BackendCapabilityComparisonFormalTargetProof` 只能由 startup-validated maintenance target registry 的 crate-private constructor
形成。registry 先以已注册 requirement/backend group 限定候选，再在 source maintenance 后加载每个 backend 当前 exact
`BackendCapabilitySummaryRef` 和 matching `ReferenceResolutionStateRef`，按已注册稳定顺序构造 selector，并调用 canonical
writer 得到 digest。source refresh selection、dependency reverse index、Query selector/absence、configured profile全量列表、
opaque `comparison_scope_ref` 或字符串均不能自行构造 proof。I083 即使作为 registry lookup 输入存在，也必须在 proof 构造时
终止：proof、candidate、binding、inspection key和durable row均不得保存该 config ref。一个 source change 可命中零到多个
已注册 target；零命中表示本 source item 无 comparison stage，多个命中按 registry 返回的显式 bounded target list逐一处理，
不得解释为 all/latest 扫描。

`SandboxMaintenanceCallContext` 复用 §104.3 已定义 shape，不增加 `SandboxOperationScopeRef`、
`SandboxIdempotencyIdentity`、comparison operation ref 或 recovery ref。P3 允许其由上述两个 fixed Job permit 与当前 item UoW
构造；constructor 仍须验证 `transaction_ref == uow.transaction_ref()`，并禁止 serialization、clone 到另一 transaction 或
跨 Job invocation 复用。

`BackendCapabilityComparisonFirstWriteProof` 只在 formal target proof 已与 candidate逐字段相等，且当前 write UoW 的
complete current-binding index、exact-key row index 与 global view-ref identity index 共同证明 `0/0/0` 时可构造。writer
仍必须在 stage 前重新 exact read并比较；它不是
`BackendCapabilityComparisonAbsenceProof` 的别名，不能由 Query `Empty`、repository `NotFound`、empty page 或 fake map absence
转换。

`BackendCapabilityComparisonWriteEvidence` 与 Step 6 expectation 的合法组合只有两种：

| Step 6 expectation | required evidence | exact same-UoW position | forbidden combination |
|---|---|---|---|
| `FirstMaterialization` | `First { proof }` | `current=0,target=0,total=0,candidate_ref=0`，全部 index complete | replacement evidence、`current=0,total>0`、query absence proof |
| `ReplaceCurrent { expected_binding, expected_version }` | `Replace { loaded_current_binding, read_transaction_ref }` | `current=1,target=1,total>=1,candidate_ref=0`；loaded value/version 与 expectation 逐字段相等 | first proof、拆分后重组 Version、candidate 与 old binding key 不同 |

同 key historical rows 存在而 current binding 缺失时是 integrity/reconciliation，不是 first。replacement candidate 必须使用新
`view_ref`；old row immutable，candidate truth/reference cursor 分别不得回退，selector 成员或顺序改变则形成另一个 exact key，
不能走 replacement。

### 105.4 Named stage method 与 dedicated logical persistence slice

writer capability 只有一个具名 method：

```rust
pub(crate) trait BackendCapabilityComparisonMaterializationWriter {
    /// 在 caller 的 item UoW 中 stage 一个 exact comparison whole group。
    /// 不 begin/commit/rollback，不调用 resolver/capability port，不分配 identity/cursor/audit。
    async fn stage_backend_capability_comparison_materialization(
        &self,
        input: StageBackendCapabilityComparisonMaterializationInput,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<
        BackendCapabilityComparisonMaterializationStage,
        BackendCapabilityComparisonMaterializationStageError,
    >;
}
```

该 method 位于 `application::ports::query_materialization` 的 comparison slice；durable 与 deterministic fake 实现相同 trait。
它不是第 43 个 public application callable，不进入 `SandboxJobService`、`SandboxQueryService`、API/Worker entry 或 protocol。
Step 6 的 `materialize_backend_capability_comparison(...)` 继续表示 caller owner 的 orchestration/finalization 语义，而不是本
stage trait 的第二个可调用实现。

四个 logical store 由该 slice 以 exact typed operation 承接：

| logical member | required staged payload/key | mutation discipline | mutable-root ruling |
|---|---|---|---|
| immutable comparison row | candidate 全部 canonical 字段：exact key、new view ref、ordered rows、ten-dimension items、aggregate、generation、双 cursor、audit/time | insert-only；同 view ref 仅允许一份逐字段相等 payload；writer 不以 row 存在返回 duplicate | immutable record，不是 mutable root |
| ordered row/source links | `(view_ref, source_position)`、capability summary ref、reference state ref、backend relation、source audit linkage | 与 selector 同序 `1..=16`；position/ref 双重唯一；不得自动排序/去重 | immutable relation，不是 mutable root |
| exact-key row index | `(context_ref, requirement_ref, source_set_digest, view_ref)` 及 source reverse membership | 与 row 同 UoW insert；active/archive logical count 完整；不能供 Query 扩展 selector | immutable completeness index，不是 mutable root |
| current binding | exact key -> Step 6 完整 binding + core `Version` | first insert-if-absent；replacement exact value+Version CAS；single-current | comparison slice 唯一 mutable pointer relation；不登记新 domain root 或 `MUT-G22` |

existing requirement、capability summary、reference state 与 audit stores 在本 UoW 中只读。writer 不得 stage source truth update、
reference/capability current binding、truth/reference cursor、view-specific audit、relay、stored result 或 idempotency completion；这些仍
由 source-maintenance owner/finalizer 控制。

named writer 的固定 stage 算法如下：

```text
validate SandboxMaintenanceCallContext and current UoW transaction identity
  -> validate formal maintenance target and authorized source-owner permit
  -> validate accepted committed source proof
  -> validate candidate complete/immutable/body-free relation against proof
  -> read complete exact write position in the same UoW
  -> validate First or Replace expectation/evidence/cardinality/version branch
  -> build binding with caller-provided bound time; never recalculate digest/cursor/ref
  -> stage immutable comparison row
  -> stage ordered source-link rows and reverse memberships
  -> stage exact-key row-index membership
  -> first: insert current binding if absent
     replace: CAS exact current binding with its own core Version
  -> verify existing source/audit linkage without modifying source owners
  -> rehydrate staged row/link/index/binding through same-UoW overlay
  -> compare rehydrated group field-for-field with candidate/binding
  -> return BackendCapabilityComparisonMaterializationStage
```

`bound_at` 由 caller clock 在构造 input 前提供并满足 `bound_at >= candidate.prepared_at`；writer 不读取第二次 wall clock。它只用于
binding/materialization time，不是 truth/reference cursor。`SandboxSourceDigest` 只从 candidate/proof 复制，不在 repository、
fake 或 writer 中重新 hash。read-your-write 校验必须调用与 durable rehydration 相同的 checked constructor/relation validator；
不能因为值刚由 application 创建就跳过十维、顺序、aggregate、cursor、audit 或 body-free 检查。

## EOF Current Recovery Override: `7R-04A-A3-3-P2` derived writer completed, user review pending

本节位于 read artifact 物理 EOF，是当前唯一恢复权威。P2 已闭合 derived seven-phase whole-group writer、first/existing、
state/materialization/binding 原子组、unknown inspection 与 parity 设计；当前停在用户复核门。该结论不授权 P3/P4、A3-4、
A4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v6.8-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P2 derived whole-group writer completed_wait_user_review
current_internal_task = A3-3-P2 user review gate after derived writer
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = completed_wait_user_review
a3_3_p3_comparison_writer = pending
a3_3_p4_static_audit_sync = pending
a3_3_projection_derived_comparison_writers = in_progress_wait_user_review
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 10/11_design_only
derived_named_writer_methods = 1/1
derived_closed_write_phases = 7/7
derived_supported_kinds = 3/3
derived_whole_group_inspection_keys = 1/1
derived_unique_source_owners = 1/1
derived_durable_fake_parity_obligations = 12/12_design_only
derived_query_writer_use = 0
derived_core_truth_writes = 0
derived_failure_classification_create = 0
derived_unowned_scope_or_identity_types = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_102_103_104|step6_comparison_current|step7_comparison_reader_current|step7_control_current|step7_cross_audit
next_allowed_action = wait_user_review_before_A3_3_P3
```

### 105.5 Current activation 与 first/replacement transaction choreography

本节位于旧 P2 recovery override 之后，并显式激活前部 Historical-Position §105.1~§105.4。旧 P2 override 仅保留执行轨迹；
P3 的当前结论最终由本文物理 EOF 的 `v6.9-active` recovery override 覆盖。

source maintenance 与 comparison persistence 属于同一 Job item owner 的两个有序阶段，但不共享 external call 或未提交 source
truth。一个 changed source 可影响零到多个已注册 comparison target；owner 先通过 formal target registry 与 source dependency
index 的交集得到显式、bounded target list，再对每个 exact target 使用独立 comparison UoW。reverse index 只能定位已注册
target，不能扩大 selector、改变 source 顺序或生成 all/latest target。

```text
resolver/capability external call outside write UoW
  -> source owner validates typed observation
  -> source owner commits capability/reference source whole group
  -> fresh fair committed read resolves affected registered comparison targets
  -> for each exact target:
       load immutable requirement/capability/reference/audit source at frozen cursors
       build formal target proof + accepted source proof + complete candidate
       reuse the invocation-frozen view ref; obtain canonical digest from canonical writer
       begin one comparison UoW and read exact write position
       construct First or Replace evidence + SandboxMaintenanceCallContext
       call stage_backend_capability_comparison_materialization
       commit through SandboxUnitOfWorkManager
       confirmed receipt -> owner-level Committed outcome for this target
  -> existing Job item finalizer aggregates target outcomes and writes its stored/idempotency surface
```

source truth commit 是不可回滚边界。comparison stage/commit 失败不得删除、降级或改写已提交 summary/reference state；owner 只按
既有 Job item finite result 报告 supporting materialization failure/degradation，并保留旧 comparison current binding。comparison
也不得把 source refresh 成功解释为 boundary supported、environment established 或 launch allowed。

first path 的 exact 顺序固定为：

1. formal target registry 已明确一个 selector，且 current committed source 可完整解析为同 selector、同 order、同 digest 的
   candidate；config scope ref、profile ref、source-change selection 与 reverse index 均不能单独授权 first。
2. 当前 comparison UoW 同时读取 current-binding count、exact-key total row count、candidate view-ref row count；只有 complete
   `0/0/0` 可构造 `BackendCapabilityComparisonFirstWriteProof`。`current=0,total>0` 是 orphan/historical-without-current，必须
   进入 integrity/reconciliation。
3. writer 重验 formal target、accepted source、candidate 与 proof，stage immutable row、ordered source links、reverse
   memberships 与 exact-key row membership。
4. current binding 采用 insert-if-absent。并发 winner 后 loser 不得转 replacement、不得重分配 view ref、不得把 loser row
   保存成 historical success。
5. same-UoW overlay 必须得到 `current=1,target=1,total=1,candidate_ref=1`，且 binding/row/link/source relation 逐字段同构，
   才能返回 stage result。
6. commit 前其它 fair reader 仍只见 complete `0/0`；confirmed commit 后必须在一个 fair snapshot 看到完整 `1/1/1`。
   任一 stage 失败由 caller rollback，writer 不返回 Empty、Visible 或 partial success。

replacement path 的 exact 顺序固定为：

1. owner 在当前 comparison UoW exact load `Versioned<BackendCapabilityComparisonViewBinding>`；value/version 整体进入
   `BackendCapabilityComparisonWriteEvidence::Replace`，不能从早先 read snapshot、candidate、cursor、clock 或 page token重组。
2. writer 要求 `current=1,target=1,total>=1,candidate_ref=0`；expected binding 与 current value 完全相等；candidate
   key/source order/digest 与 old binding 相等，new view ref 不存在，truth/reference cursor 分别不得回退。
3. writer insert new immutable row、ordered links 与 exact-key membership，保留 old row、old links、old audit linkage 与
   historical membership 不变。
4. current binding 只用其自身 expected core `Version` CAS 替换。CAS loser 使整个 candidate stage 作废，禁止 reload latest
   后复用旧 candidate、旧 proof 或旧 comparison decision。
5. same-UoW overlay 必须看到 new binding 唯一 current、new target 恰一、total 增加一；old row 仍可按 exact historical ref
   读取，但不能参与 current 选择。
6. commit 前 fair reader 仍只见 old complete group；confirmed commit 后只沿 new binding 组装 current。不得出现
   binding-first、row-first、link/index-late 或 source-audit-late 可见性。

source refs 的成员或顺序、requirement ref、context 或 digest 任一变化都属于另一个 logical key。caller 必须依据 formal target
重新判断 first，不得借 replacement 改变 selector identity。旧 key 与新 key 可以各自保留一个合法 current binding；Query 只读
请求中的 exact selector，不执行跨 key merge 或 latest winner。

### 105.6 Caller-owned commit、duplicate 与 commit-unknown inspection

Step 6 的 `BackendCapabilityComparisonMaterializationWriteOutcome` 只能由 caller owner 在 writer 返回后形成：

| owner observation | owner-level outcome / action | forbidden shortcut |
|---|---|---|
| fresh operation，stage 成功且 UoW manager 返回 matching confirmed commit receipt | `Committed { view_ref, binding }` | stage result 直接转 Committed、repository method自行commit |
| duplicate invocation 的原 `SandboxIdempotencyRecordRef` 已有 stored outcome，且 original frozen view ref、exact key 与 canonical payload 可由完整 committed group逐字段证明 | `DuplicateEquivalent { existing view_ref, binding }`，comparison write set=`0` | 只比较 digest、aggregate、timestamp 或“内容看起来相同” |
| original commit-unknown inspection 后证明同一 frozen candidate 已完整提交 | original call 形成 `Committed`；后续 duplicate invocation 才重放 `DuplicateEquivalent` | unknown 当 duplicate、重新生成 view ref |
| same transaction 重复调用 stage method | `ComparisonTransactionUsageViolation` | 返回 DuplicateEquivalent |
| unique/CAS conflict，但无法证明 original duplicate operation完整提交 | typed conflict；旧 candidate 丢弃 | 把任意并发 winner 映为 DuplicateEquivalent |
| commit failed 且 rollback confirmed | application technical/conflict result；comparison before-state保持 | writer 返回 FullyAbsent、自动重试 |
| commit outcome unknown | 丢弃内存 stage result，按 frozen inspection key 在新 fair committed snapshot检查 | blind replay、Query探测、从 fake script读取“结果” |

两个独立 invocation 即使 selector、rows 与 aggregate相等，只要 idempotency owner 或 frozen view ref不同，也不是
`DuplicateEquivalent`。first/replacement race loser只能返回 conflict并从完整 owner flow 重入；不能把 winner row当成本次
operation 的 stored result。

`BackendCapabilityComparisonWholeGroupInspectionKey` 必须在 commit 前冻结。`transaction_ref`只关联原 UoW，不能替代
idempotency owner或 durable commit receipt；inspection 在新的 fair committed snapshot逐项读取：

| inspection member | `Committed` exact proof | absent/partial rule |
|---|---|---|
| source lineage | immutable requirement、ordered capability summaries、reference-state historical linkage、generation、双cursor与all audit refs可按frozen key证明 | source当前已前进不否定旧row；但旧cursor/audit relation无法证明时为`Indeterminate`，不能用candidate memory补齐 |
| immutable row | new view ref恰一row；exact key、selector、完整ten-dimension rows、aggregate、cursor、audit/time与candidate同构 | row-only存在不是Committed；wrong payload/duplicate row为Indeterminate |
| source links | `1..=16` ordered links与selector/reference states逐position相等，reverse membership完整 | missing、duplicate、reordered或wrong source为Indeterminate |
| exact-key index | new `(exact key, view ref)` membership恰一，logical total与mode预期相容 | row存在但index缺失、archive count不完整或wrong key为Indeterminate |
| current binding | exact key唯一指向new view ref，binding字段与row全等 | old/new mixed、missing/duplicate current为Indeterminate |
| previous comparison state | first要求原始`0/0/0`被完整new group取代；replacement要求old row/link/index保持immutable且new binding完成CAS | old row删除/改写、new row与old current混合为Indeterminate |
| operation ownership | idempotency record仍与original operation/digest/key匹配；Job run与frozen target plan关联可证明 | record不是comparison同UoW成员；missing/mismatch不能靠row猜operation outcome |

finite inspection result只有：

```text
Committed     = all new row/link/index/binding/source relations exist and are mutually exact
FullyAbsent   = every frozen new comparison member is absent and exact comparison before-state is preserved
Indeterminate = partial, mixed, duplicate, unavailable, cursor/audit mismatch or otherwise unprovable
```

first 的 `FullyAbsent` 要求 new row/link/index/binding全部为零，exact key仍为complete `current=0,total=0`；replacement 的
`FullyAbsent` 要求new view group全部为零且old binding value、old row/link/index完整保留。source truth 已在前一事务提交，因此不属于
comparison FullyAbsent 条件，也不得因comparison rollback而撤销。`get_row == None`、Query `Empty`、rollback返回、fake map
absence、expected Version 或 idempotency状态均不能单独证明FullyAbsent。

`Committed` 后 owner 可继续完成当前 Job item的既有 stored/idempotency finalization；若 finalization自身 unknown，按其既有 owner
inspection处理，不回到comparison writer。`FullyAbsent` 不授权本栈帧静默重跑，只允许上层按既有policy发起新的完整调用；
`Indeterminate`进入既有hold/reconciliation/quarantine owner，不新增comparison `PendingCommit`状态，不由Query repair。

### 105.7 Finite stage error 与 durable/fake parity

```rust
/// stage-only comparison writer 的穷尽 application-local error。
pub(crate) enum BackendCapabilityComparisonMaterializationStageError {
    ComparisonMaintenanceAuthorizationMismatch,
    ComparisonSourceOwnerMismatch,
    ComparisonFormalTargetProofRejected,
    ComparisonCandidateRejected,
    ComparisonFirstProofRejected,
    ComparisonFirstMaterializationConflict,
    ComparisonCurrentBindingConflict,
    ComparisonBindingVersionConflict,
    ComparisonImmutableRowConflict,
    ComparisonSourceLinkageConflict,
    ComparisonTransactionUsageViolation,
    ComparisonStageUnavailable,
    ComparisonStageIntegrityViolation,
}
```

| stage error | exact trigger | disposition |
|---|---|---|
| authorization mismatch | permit、call context、idempotency/job owner或UoW transaction不等；caller不在两个authorized channel | invariant/security reject；write set=`0` |
| source owner mismatch | capability/reference source proof与owner channel不匹配，或source refresh未形成 accepted committed snapshot | application invariant；不调用source adapter补证据 |
| formal target proof rejected | target registry proof过期、selector/order/digest不等、scope/profile直接进入proof、或target不是显式bounded target | integrity reject；不把config scan转成first |
| candidate rejected | selector/source/row/order/ten-dimension/aggregate/cursor/audit/time不满足Step 6 | contracts/application reject；不得补默认值或持久化Degraded/Unavailable |
| first proof rejected/conflict | proof非same-UoW complete `0/0/0`，或stage前重验已变化 | candidate丢弃；不把NotFound当first，不转replacement |
| current binding conflict | current count/target relation/expected binding不等或old group损坏 | fail closed到existing consistency owner；不选latest |
| binding Version conflict | exact current binding CAS loser | entire staged group rollback；从完整owner flow重入 |
| immutable row conflict | candidate view ref已存在不同payload、同key duplicate membership或old row被要求修改 | integrity/conflict；不得当duplicate success |
| source linkage conflict | ordered links、reference states、audit、generation或双cursor任一不等 | rollback whole group；不重排、不丢项 |
| transaction usage violation | wrong transaction、同事务重复stage、stage后试图换UoW继续 | invariant reject；不自动begin/commit |
| stage unavailable | exact persistence slice/UoW/read-your-write不可用 | `PortUnavailable`；不冒充absence |
| stage integrity violation | half row、duplicate current/index、decode/rehydration relation损坏 | strict hold/reconciliation；writer不repair |

commit failure、rollback failure与commit unknown由 `SandboxUnitOfWorkManager` owner映射，不进入上述 stage error enum。
`BLK-SBX-CANONICAL-001` 是 implementation activation gate，也不是 runtime stage error；canonical digest writer尚未落地时不得
调用comparison stage path。

durable adapter与deterministic fake必须共享以下12项设计义务；它们是后续Step 11/13/16测试切口，不是已执行结果：

| parity item | exact obligation |
|---|---|
| selector/digest | required context/requirement/ordered `1..=16` refs与opaque digest relation一致；fake不扫描map/config或自行hash |
| formal target | 两者只接受startup-validated explicit target proof；scope ref、NotFound、Query absence不能授权first |
| candidate completeness | requirement/reference snapshots、完整rows、十维items、aggregate、双cursor、audit/time使用同一validator |
| authorized owner | 只接受capability/reference maintenance permit与既有call context；fake无bypass owner |
| formal first race | complete same-UoW `current=0,total=0,candidate_ref=0`；唯一winner；loser整组不可见且不转replacement |
| replacement CAS | exact binding value + its own core `Version`；CAS loser旧candidate全部作废 |
| immutable/history | new row insert-only，old row/link/index不改；current只沿binding选择，历史total可为`>=1` |
| ordered links/index | source position、ref uniqueness、reverse membership与active/archive logical count一致 |
| cursor/audit/body | truth/reference cursor不互换、不推进；只链接existing audit；raw backend/requirement/body/error均不入仓 |
| visibility/rollback | row/link/index/binding只整组可见；任一stage/commit failure保留complete before-state |
| duplicate/owner completion | 只有original idempotency owner whole group完整且payload全等才为DuplicateEquivalent；fake script不构成证明 |
| unknown/rehydration | fresh fair exact inspection统一得到`Committed/FullyAbsent/Indeterminate`；durable/fake都执行checked decode |

### 105.8 P3 static audit 与停审门

```text
comparison_named_writer_methods = 1/1
comparison_authorized_source_channels = 2/2
comparison_formal_target_proof = 1/1
comparison_unique_writer_owner = 1/1
comparison_logical_store_members = 4/4
comparison_whole_group_inspection_keys = 1/1
comparison_inspection_branches = 3/3
comparison_durable_fake_parity_obligations = 12/12_design_only
comparison_new_mutable_roots = 0
comparison_new_same_uow_groups = 0
comparison_query_writer_use = 0
comparison_generic_writer_or_runtime_dispatch = 0
comparison_identity_or_cursor_allocation_in_writer = 0
comparison_external_call_in_writer = 0
comparison_source_truth_writes = 0
comparison_business_audit_append = 0
comparison_partial_or_status_only_success_path = 0
comparison_public_callable_delta = 0
comparison_unowned_scope_or_identity_types = 0
a3_materialization_writer_closure = 11/11_design_only
```

本节没有执行代码、编译、测试、database/provider/fake conformance、run、evidence、验收或commit。上述`1/1`、`4/4`、
`12/12`与`11/11`只表示设计文本静态闭合。`READ-001`仍需 P4、A3-4 与A4总审计；`OUTCOME-001`仍由既有owner关闭；
`BLK-SBX-CANONICAL-001`继续阻断implementation activation。没有发现新的L1/L2上游blocker。

## EOF Current Recovery Override: `7R-04A-A3-3-P3` comparison writer completed, user review pending

本节位于 read artifact 物理 EOF，是当前唯一恢复权威。P3 已闭合 comparison stage-only named writer、formal target proof、
four-store logical persistence slice、first/replacement、caller-owned commit/duplicate、whole-group unknown inspection 与
durable/fake parity 设计；当前停在用户复核门。前文 Historical-Position §105.1~§105.8 是本批正文，旧 P2 EOF 记录是历史轨迹。
本节不授权 P4、A3-4、A4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v6.9-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P3 comparison whole-group writer completed_wait_user_review
current_internal_task = A3-3-P3 user review gate after comparison writer
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = completed
a3_3_p3_comparison_writer = completed_wait_user_review
a3_3_p4_static_audit_sync = pending
a3_3_projection_derived_comparison_writers = in_progress_wait_user_review
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 11/11_design_only
comparison_named_writer_methods = 1/1
comparison_authorized_source_channels = 2/2
comparison_formal_target_proof = 1/1
comparison_unique_writer_owner = 1/1
comparison_logical_store_members = 4/4
comparison_whole_group_inspection_keys = 1/1
comparison_durable_fake_parity_obligations = 12/12_design_only
comparison_new_mutable_roots = 0
comparison_new_same_uow_groups = 0
comparison_unowned_scope_or_identity_types = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_105|step7_repositories_current|step7_control_current|step7_cross_audit|current_recovery_ledgers
next_allowed_action = wait_user_review_before_A3_3_P4
```

## 106. A3-3-P4 Projection/Derived/Comparison 三类 Writer 静态总审计

本批只做三类 maintenance writer 的横向一致性审计与恢复同步，不新增业务能力，不改变 Step 6 canonical object、Step 7
repository registry、public Query、Job facade 或正式 `03-详细设计.md`。异常、审查、测试和交付只保留主体安全所需的
fail-closed 规则；本批不扩写 recovery workflow、scheduler、report schema 或验收证据。

### 106.1 开工门、SOP 问题回答与审计范围

本批在用户确认 P3 后启动，先读取 `详细设计讨论流程_SOP.md`、`详细设计书写规范.md`、中间产物规范、真相源闭环标准、
Step 6 current object contract、Step 7 repository/UoW、Step 7 control、A2 reader current 和 P1/P2/P3 当前正文。按 Step 7
要求，审计以模块接缝和实现契约为主轴，逐项回答：

| SOP 问题 | P4 current answer |
|---|---|
| 哪些模块需要 writer port | `application::ports::query_materialization` 保留三个具名 application-local stage seam；`infra` 只提供 durable/fake 实现。 |
| 谁调用、谁实现 | projection 由 Job 8 maintenance kernel 调用；derived 由 Job 9 maintenance kernel 调用；comparison 由两个既有 source-maintenance item owner 调用同一个 writer；实现方不拥有业务判定。 |
| 接缝承接哪个对象能力 | projection 承接 `SandboxReadProjection` rebuild image/marker/binding；derived 承接 `DerivedInspectPreviewTrendState` 与 materialization/current image；comparison 承接 Step 6 body-free candidate、current binding、row/link/index。 |
| 读取面是否足够 | 每个 writer 都有 explicit target proof、source snapshot、exact existing read、Version/position、same-UoW rehydration 和 owner inspection key；Query 仍完全 zero-write。 |
| 写入面是否闭合 | 三类 writer 都只 stage caller-owned UoW；first/existing 或 first/replace、expected Version、CAS、whole-group member set 和 rollback/unknown owner 已明确。 |
| 是否存在重复 port、反向依赖或跨边界语义 | 静态差集为 0；不新增 generic writer、MUT-G22、public type、identity owner、external call 或 tools/runtime/member semantic。 |

P4 的审计边界固定为：`owner`、`formal target`、`candidate/source field closure`、`named stage method`、`same-UoW write set`、
`first/existing/replacement`、`Version/CAS`、`commit/duplicate/unknown`、`durable/fake parity`、`negative boundary` 十项。
P4 不把静态设计计数解释为编译、运行、数据库、provider、测试、run、evidence 或验收事实。

### 106.2 真相源与历史材料裁决

| 设计事实 | current truth source | historical material / conflict | P4 裁决 |
|---|---|---|---|
| projection write seam | 本文件 §103、`MUT-G20`、Job 8 current | 旧文档的 generic projection getter、`NotFound -> first` | 只接受具名 `write_projection_materialization` 与 formal target proof。 |
| derived write seam | 本文件 §104、`MUT-G21`、Job 9 current | existing-only writer、committed-state-index-only first selection | first/existing 以 formal target/index、`0/0/0` 与本节 current 为准；旧文字降为 `historical_material`。 |
| comparison write seam | 本文件 §105、Step 6 §16.9、A2 comparison reader | Step 6 直接返回 `Committed|DuplicateEquivalent`、generic row、latest winner | writer 只返回 stage；终局 outcome 归 source-maintenance owner；四 logical members 归 dedicated application slice。 |
| commit-unknown boundary | Step 7 shared stage/UoW rule、P2/P3 current text | P1 §103.4 的 `ProjectionCommitUnknown` stage-error 命名 | 该名称是历史表述；current 统一由 `SandboxUnitOfWorkManager` caller owner 产生并执行 fresh inspection，不进入 stage error enum。 |
| private inspection visibility | Step 7 application-local rule | P1 示例中的 `pub struct` 可能被误读为 public surface | 仅允许 module-private / `pub(crate)` application type；不进入 contracts registry、protocol、public Query 或 runtime dispatch。 |
| comparison mutable registry | repository current `19` roots / `MUT-G01~MUT-G21` | 为 comparison 增加 `MUT-G22` 或独立 domain root | comparison 四成员是 dedicated persistence slice；不新增 domain mutable root、registry group 或 public repository。 |
| canonical digest | `BLK-SBX-CANONICAL-001` current gate | 旧 hash/fixture/placeholder 解释 | 只验证 opaque digest relation；不选择算法、不生成 fixture、不关闭 blocker。 |

旧正式 `03`、README、早期 Step 6/7 snapshot 和下游历史 `pass` 记录仅作差异定位。与上述 current source 冲突时，不继承旧
内容，不把 historical wording 写成实现授权。

### 106.3 三类 Writer 共同契约矩阵

| 审计维度 | projection | derived | comparison | 横向结论 |
|---|---|---|---|---|
| named method | `write_projection_materialization` | `write_derived_materialization` | `stage_backend_capability_comparison_materialization` | `3/3` 具名；不存在 `write(kind, payload)`。 |
| unique owner | Job 8 maintenance kernel | Job 9 maintenance kernel | 一个 application writer；两个 authorized source-owner channel | writer owner 与 caller owner 分离；无 runtime string dispatch。 |
| formal target | `ProjectionTargetProof` | `DerivedFormalTargetProof` | `BackendCapabilityComparisonFormalTargetProof` | target/index/registry owner 形成 proof；writer 只验证，不自证。 |
| source input | checked projection source snapshot + audit linkage | typed source set、dual cursor、guard proof、checked build | committed requirement/reference/summary snapshots、ordered rows、dual cursor、audit linkage | raw body、Query selector、empty page、config scan 均不能成为 source。 |
| candidate / expectation | selection + target proof + loaded `Versioned<Projection>` | phase + first/existing expectation + transitioned checked state/image | binding-free candidate + first/replace evidence + exact source proof | first 与 existing/replace 不能由 `Option`、`NotFound` 或 latest scan隐式推导。 |
| identity/cursor source | target/source owner预生成 | Job/guard/source owner预生成 | source-maintenance owner预生成 view ref；canonical writer提供 opaque digest | writer identity/cursor allocation=`0`。 |
| UoW ownership | borrowed caller UoW | borrowed `MUT-G21` UoW，builder在UoW外 | borrowed comparison UoW；source truth已在前置提交 | writer 不 begin/commit/rollback；external await=`0`。 |
| write set | image、attempt/marker、binding coverage、cursor/audit/index relations | state、current image、optional successful row、binding/index/last-success/audit/job relation | immutable row、ordered source links、exact-key index、current binding | 每类 whole group 成员显式列出；禁止 state-only、row-only 或 pointer-only success。 |
| Version/CAS | existing projection Version；target/index expectation独立 | state Version 与 current-binding Version 分离 | current binding 自身 core Version；old row immutable | 不复用 cursor/time/page token；不 reload latest 后套旧 candidate。 |
| same-UoW check | full projection group overlay | full state/image/binding/index overlay | full row/link/index/binding overlay | stage 后 checked rehydrate；外部 fair reader只见before-state。 |
| inspection key | projection ref/context/attempt/cursors/audit | operation/job/target/phase/new ref/versions/source/marker/audit | exact key/source set/view ref/operation ownership/previous state | application-private；fresh fair committed snapshot；不得用 Query 或 fake absence猜测。 |
| finite inspection | `Committed|FullyAbsent|Indeterminate` | 同左 | 同左；`DuplicateEquivalent`不是 inspection result | 三分支统一；partial/mixed/decode/unavailable 均 `Indeterminate`。 |
| duplicate | caller既有 stored/idempotency owner whole-group proof | caller既有 Job owner whole-group proof | only original idempotency owner + frozen ref + exact payload | stage writer不返回 duplicate；相似 payload不够。 |
| commit failure/unknown | UoW owner | UoW owner | UoW/source-maintenance owner | writer stage error不承载 commit status；unknown 后禁止 blind retry/external call。 |
| durable/fake | `9/9` design-only obligations | `12/12` design-only obligations | `12/12` design-only obligations | total `33/33` 仅为设计义务，不是测试结果。 |
| Query boundary | `0` | `0` | `0` | Query 不创建、替换、repair、refresh、probe、分配 identity/cursor 或调用 external port。 |

共同契约成立的必要条件是：writer 返回的 `Stage` 只代表本 UoW 内的完整 staged group；只有 caller 在 confirmed commit receipt
或完整 unknown inspection 后，才能形成上层 outcome。任何 family 的局部 row/image/binding 都不能提前成为成功 surface。

### 106.4 Family-specific write set 与合法差异

三类 writer 不是同一 generic storage algorithm。P4 将差异固定为实现者可直接分支的 typed contract：

| family | first path | existing / replacement path | 必须保留的历史成员 | 禁止的错误合并 |
|---|---|---|---|---|
| projection | formal target + complete zero proof；`create`/`create_unavailable` projection image | exact loaded projection + rebuild attempt/marker transition + exact Version save | status-view binding coverage、dual cursor、attempt/marker、target/index、source audit | 不能把 projection missing 当 `Empty`、把 source unavailable 当 repository error、或把 binding coverage当独立 truth root。 |
| derived | formal target + state/current-binding/successful-materialization `0/0/0`；`from_sources`/`unavailable_from_sources` | seven closed phases；state CAS、current image/binding CAS、successful row/index按 phase变化；builder只在 confirmed `Rebuilding` 后运行 | last-success relation、NeverMaterialized proof、marker fence、transition/source audit、Job item relation | 不能 state-only Fresh、不能 first 创建 core failure、不能把 technical error写成 `Unavailable`。 |
| comparison | formal registered target + exact-key `current=0,total=0,candidate=0`；insert immutable row/link/index/binding | `ReplaceCurrent` 只 CAS exact current binding；old row/link/index immutable | ordered source links、reverse membership、exact-key total、source lineage、operation ownership | 不能把 replacement 当原地 update、不能把并发 winner当 duplicate、不能用 digest单字段证明 duplicate。 |

上述差异不构成额外 public status、domain root、same-UoW registry group或 callable。comparison 的“four logical members”是
其 application-private persistence slice 的成员计数；`comparison_new_mutable_roots=0` 与 `comparison_new_same_uow_groups=0`
表示没有新增 Step 7 domain registry，不表示可以拆散四成员的原子可见性。

### 106.5 字段、构造与下游闭环审计

| 闭环面 | current source -> writer | writer -> downstream consumer | 结论 |
|---|---|---|---|
| target/context/ref | formal target proof 提供稳定 typed ref；selection 只承接显式 target | stage result、inspection key 和 Query exact selector使用同一 ref/key | `3/3` 无文本拼接、无 opaque scope。 |
| source/cursor | committed source snapshot 提供 body-free rows、truth/reference cursor和audit linkage | image/row/binding/index逐字段重验；Query只读 committed snapshot | 双 cursor 不互换、不由 writer推进。 |
| Version | existing `Versioned<T>` 或 comparison current binding core Version | save/CAS、inspection successor/old-state proof | Version source唯一；不假定数值递增。 |
| status/phase | domain factory/transition 或 Step 6 canonical candidate | current image/status view、Job item result、Step 10 revalidation | writer不发明第二状态集合；derived七 phase是 private write phase。 |
| audit | accepted existing audit linkage | whole-group relation / later owner completion | writer只链接，不追加 business audit。 |
| idempotency/job | caller context/permit携带既有 operation owner | duplicate/unknown owner inspection和stored finalization | 不新建 per-target public carrier；comparison复用既有 owner。 |
| public Query | Query reader消费 exact committed row/binding/index | `Visible|Empty|MissingProjection|Unavailable|Err`由既有 reader mapping形成 | Query 不反向调用 writer，不以 stage/absence补建。 |
| Step 8~17 | 当前只提供 source/method/error/transaction/phase 入口 | 协议、flow、state、test、acceptance、implementation仍需定向回查 | 下游未被本批伪造为已完成。 |

关键字段缺失处理已经固定：formal proof/typed source/expected Version/required relation缺失时 fail closed；不能默认值填充、
转成 `Empty`、转成业务 `Unavailable`、或者让 fake 生成缺失成员。

### 106.6 事务、错误与 unknown 的统一裁决

P4 将三类 writer 的执行边界压缩为以下可落码规则：

```text
caller validates authorization + formal target + complete source proof
  -> caller opens the family-specific UoW
  -> writer exact-reads expected position in that UoW
  -> writer checks branch legality and source/field relations
  -> writer applies canonical factory/transition or immutable insert/CAS
  -> writer stages every required group member
  -> writer rehydrates the whole staged group through the same-UoW overlay
  -> writer returns application-private Stage
  -> caller commits or rolls back through SandboxUnitOfWorkManager
  -> commit unknown: caller drops in-memory Stage and inspects a fresh fair snapshot
```

统一禁令：

| forbidden action | current result |
|---|---:|
| writer begin/commit/rollback | `0` |
| writer allocate identity/cursor/audit | `0` |
| writer call resolver/capability/backend/tool/runtime/member/external port | `0` |
| writer append business audit | `0` |
| Query-triggered materialization/repair | `0/13` |
| stage result mapped directly to `Committed`, `Accepted`, `Succeeded` or `DuplicateEquivalent` | `0` |
| unknown mapped to absent/degraded/success without whole-group inspection | `0` |
| blind retry after unknown or CAS loser | `0` |

P1 §103.4 的 `ProjectionCommitUnknown` 不再作为 current stage error；P2 §104.7 已明确的 `DerivedCommitUnknown` 以及 P3
§105.7 的 commit boundary 规则是 current shared interpretation。若实现阶段保留该历史名称，只能作为 caller/UoW mapping 的
内部 terminal disposition，不能出现在 `write_projection_materialization` 的 stage error enum 或 public error mapping。

### 106.7 Durable / deterministic fake parity 总审计

| parity family | obligation count | mandatory parity shape | current design status |
|---|---:|---|---|
| projection | `9` | target proof、source assembly、first race、CAS、dual cursor、visibility、rollback、unknown、rehydration | `9/9 design-only` |
| derived | `12` | target/source/guard、first race、state/binding CAS、phase order、dual cursor、visibility、rollback、unknown、rehydration | `12/12 design-only` |
| comparison | `12` | selector/digest、target proof、candidate completeness、owner authorization、first race、replacement CAS、history、links/index、cursor/audit/body、visibility/rollback、duplicate ownership、unknown/rehydration | `12/12 design-only` |
| total | `33` | durable/fake share checked carriers, relation validators and three-way inspection; fake script cannot prove business outcome | `33/33 design-only` |

fake 只允许控制底层 transaction failure/unknown/failpoint；不得从 private map、script、bool、missing row或预置 status 推导业务
success、first proof、duplicate、absence或 degraded。没有执行 conformance、编译或测试，不能生成真实 evidence alias。

### 106.8 反向 capability、跨模块与 blocker 审计

| negative inventory | result | owner / disposition |
|---|---:|---|
| generic production writer / runtime family dispatch | `0` | 三个具名 writer；application owner固定。 |
| new public callable / DTO / status / stored kind | `0` | `42/42` callable不变；private stage/key不出 public surface。 |
| new mutable root / `MUT-G22` / comparison domain group | `0` | projection=`MUT-G20`、derived=`MUT-G21`；comparison dedicated slice不注册新 root。 |
| Query write / repair / external call / identity allocation | `0/13`、`0`、`0`、`0` | Query reader与maintenance writer分离。 |
| source truth/status/cursor/audit ownership stolen by writer | `0` | source/domain/audit owners保持唯一。 |
| partial visibility / last-write-wins / latest winner | `0` | whole-group atomicity + exact CAS + immutable history。 |
| tools semantic execution / runtime agent loop / member lifecycle | `0` | Sandbox boundary保持 isolation substrate；comparison仅记录面。 |
| new L1/L2 upstream blocker | `0` | 未发现新的上游依赖冲突。 |

既有 blocker 不因本批静态审计关闭：

| blocker | current state | reason |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | `open_wait_A3_4_A4` | 三类 writer 已完成静态总审计，但 reconciliation/audit existing-owner reuse、A4 total audit和正式 read closure尚未完成。 |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | `open_existing_owner` | durable/fake parity contract已登记，完整 adapter outcome owner仍未由本批关闭。 |
| `BLK-SBX-CANONICAL-001` | `open_implementation_gate` | canonical digest writer/verifier与fixtures未真实验证。 |

### 106.9 回填草稿与交接边界

正式 `03-详细设计.md` 仍冻结。未来重装配只能从本批已确认内容摘取，不得把审计表、静态计数或用户复核状态写成实现/测试事实：

| 正式章节 | 允许回填 | 当前禁止回填 |
|---|---|---|
| §5 / §6 | 三个具名 writer、application owner、private carrier与禁止 generic surface | private inspection key/public type误写、第二套 identity/status |
| §8 | caller -> proof -> UoW -> stage -> commit/inspection顺序 | writer自行commit、unknown后blind retry、Query调用writer |
| §10 | `MUT-G20/MUT-G21` exact repository与comparison dedicated slice、Version/CAS、whole-group关系 | `MUT-G22`、generic repository、假定Version递增 |
| §11 / §12 | family stage error、caller commit/unknown、duplicate owner、CAS与fail-closed mapping | `ProjectionCommitUnknown`作为stage/public error、unknown当Empty/Success |
| §15 | `33/33` durable/fake parity test cuts | 已执行测试、覆盖率、run/evidence/acceptance结果 |
| §16 | source map、pre-read、implementation gate与open blockers | implementation activation、commit或boundary completion |

### 106.10 P4 静态结论与停审门

```text
three_family_named_writer_methods = 3/3
three_family_whole_group_inspection_keys = 3/3
three_family_unique_writer_owners = 3/3
three_family_formal_target_proofs = 3/3
three_family_stage_only_commit_boundary = 3/3
three_family_family_specific_write_sets = 3/3
three_family_version_cas_rules = 3/3
three_family_unknown_branches = 3/3
three_family_durable_fake_parity_obligations = 33/33_design_only
projection_derived_comparison_common_negative_audit = 15/15_design_only
projection_commit_unknown_historical_conflict = corrected_by_current_shared_rule
projection_private_inspection_visibility = application_private_only
comparison_new_mutable_roots = 0
comparison_new_same_uow_groups = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
new_l1_l2_blocker = 0
a3_materialization_writer_closure = 11/11_design_only
read_blocker_closure = pending_A3_4_A4
outcome_blocker_closure = pending_existing_owner
```

上述 `3/3`、`15/15`、`33/33`、`11/11` 仅表示设计文本静态审计；本批没有执行代码、编译、测试、database/provider/fake
conformance、run、evidence、验收或 commit。P4 已完成内容，当前停在用户复核门。未经用户确认，不得进入 A3-4、A4、Step 8、
正式 `03` 回填或 implementation。

## EOF Current Recovery Override: `7R-04A-A3-3-P4` static audit completed, user review pending

本节位于 read artifact 物理 EOF，是当前唯一恢复权威。P4 已完成 projection/derived/comparison 三类 writer 的横向静态审计，
并将 P1 历史错误命名、private visibility、commit/unknown owner和comparison no-new-root语义作出 current correction。
该状态不关闭 `READ-001`、`OUTCOME-001` 或 `BLK-SBX-CANONICAL-001`，不授权 A3-4/A4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v7.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P4 three-family static audit completed_wait_user_review
current_internal_task = A3-3-P4 user review gate after projection/derived/comparison audit
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = completed
a3_3_p3_comparison_writer = completed
a3_3_p4_static_audit_sync = completed_wait_user_review
a3_3_projection_derived_comparison_writers = completed_wait_user_review
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 11/11_design_only
three_family_named_writer_methods = 3/3
three_family_whole_group_inspection_keys = 3/3
three_family_unique_writer_owners = 3/3
three_family_formal_target_proofs = 3/3
three_family_stage_only_commit_boundary = 3/3
three_family_family_specific_write_sets = 3/3
three_family_version_cas_rules = 3/3
three_family_unknown_branches = 3/3
three_family_durable_fake_parity_obligations = 33/33_design_only
projection_derived_comparison_common_negative_audit = 15/15_design_only
projection_commit_unknown_historical_conflict = corrected_by_current_shared_rule
projection_private_inspection_visibility = application_private_only
comparison_new_mutable_roots = 0
comparison_new_same_uow_groups = 0
comparison_query_writer_use = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_106|step7_repositories_current|step7_control_current|step7_cross_audit|current_recovery_ledgers
next_allowed_action = wait_user_review_before_A3_4
```

## 107. `7R-04A-A3-4` Existing Owner Reuse 与一致性审计（第一批）

本节只审计 A3-1 已识别的两类既有 owner（reconciliation、audit）以及它们与 A3-2/A3-3 materialization writer 的接缝。
本批不新增主体能力、不新增 repository root、不新增 public callable、不修改正式 `03-详细设计.md`。异常处理、审查、测试和
交付只保留阻止误判的 fail-closed、unknown 和 parity 门禁，不展开第二条主流程。

### 107.1 开工门、输入与 SOP 问题回答

| 检查项 | current 结论 |
|---|---|
| predecessor | `7R-04A-A3-3-P4` 已完成并停在用户复核门；本批只在该门消费后执行 A3-4。 |
| 本批范围 | existing reconciliation whole-group owner、append-only audit owner、11 个 materialization surface 的 owner/repository/UoW/Query 接缝。 |
| 直接输入 | 本文件 §§101~106、`03_ddd_step_07_repositories_uow_indexes.md` 物理 EOF、`03_ddd_step_07_trait_port_adapter_contracts_regression_control.md` current authority、`03_ddd_step_07_cross_audit_b1_closure.md` current EOF。 |
| 上游对象输入 | Step 6 canonical report/audit object、typed ref、source proof、truth cursor、`Versioned<T>`、UoW 与 exact reader contract。 |
| 主流程 owner | `run_sandbox_reconciliation` 复用 Step 6 canonical `RunSandboxReconciliationJobInput` 与既有 dedicated whole-group writer；不进入九个 paged maintenance Job。 |
| 读面 owner | `SandboxReconciliationReportReader::read_sandbox_reconciliation_report_source` 是具名 exact reader；audit trace 只作为 report bundle 的 matching relation读取。 |
| audit owner | audit append 由 source mutation / existing business owner 在其原子 group 内完成；Query、reconciliation reader 和 materialization writer 均不追加 business audit。 |
| Query 行为 | 13 个 public Query 继续只读；Query writer、repair、identity/cursor allocation、external call、business audit append 均为 `0/13`。 |
| 非目标 | tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact 正文采集、observability store、cleanup/reaper、security redline 均不在 A3-4。 |
| 实现真实性 | 未执行代码、编译、测试、provider/fake conformance；未创建 run、evidence、验收签署或 commit。 |

本批按详细设计 SOP 逐项回答以下问题：

| SOP 问题 | 回答 |
|---|---|
| 既有 reconciliation 是否需要第二个 writer | 不需要。Job 10 `run_sandbox_reconciliation` 已拥有完整 explicit scope、source assembly、report/finding/current/audit/relay/stored/idempotency whole group；A3-4 只证明其可达性和与 reader 的字段闭环。 |
| 既有 audit 是否需要独立 materialization writer | 不需要。`SandboxAuditTrace` 是 append-only business audit relation，由各自 source mutation owner 在同一业务 group 中追加；status-view、projection、derived、comparison 和 Query 只能链接或读取。 |
| reconciliation 是否可以并入 derived writer | 不可以。reconciliation 是 immutable report/finding/audit bundle；derived 是 `Inspect|Preview|Trend` materialization state。两者 source、identity、status、UoW group 和 duplicate owner 不同。 |
| audit 是否可以由 Query 或 inspector 补写 | 不可以。Query/inspection 是 fresh fair committed snapshot read；技术读失败不得留下审计副作用，business audit 只能由原 source mutation owner产生。 |
| comparison 是否需要 `MUT-G22` | 不需要。comparison 四 logical members 继续属于 application-private dedicated persistence slice；不注册新的 domain mutable root、registry group、public repository 或 callable。 |
| owner reuse 的完成标准是什么 | 每个 reused owner 都有唯一 method、source proof、whole-group成员、Version/CAS（若适用）、commit/unknown owner、Query zero-write 边界，并能回指下游 consumer；不得以“已有对象”替代可落码契约。 |

### 107.2 权威顺序与历史材料裁决

| 审计面 | current source | historical / conflicting wording | A3-4 裁决 |
|---|---|---|---|
| reconciliation entry | Step 7 facade current `run_sandbox_reconciliation` 与 Step 6 canonical input/outcome | 旧九个 paged Job 表、generic `finalize_job_report`、report-only item | 保留第十个 reconciliation-specific Job；不创建 paged permit、generic accumulator 或空 item。 |
| reconciliation write group | Step 6 report object contract、Step 7 facade §41.11 和 existing dedicated writer | 旧“只存 report row”、只返回 current binding、duplicate 重新计算 source | whole report/finding/current/history/audit/optional relay/stored/idempotency relation必须按既有 group 同 commit；duplicate 只 replay 原 stored bundle。 |
| reconciliation read | F5-R current `SandboxReconciliationReportReader`、six-index cardinality、same-snapshot rehydration | `Option<Report>`、scope/latest/current-only selector、root=0即Empty | 只接受 exact `report_ref` selector；六项 index 全零才是 absence；partial/decode/unavailable 不得伪装 Empty。 |
| audit relation | Step 6 `SandboxAuditTrace` object/relation与immutable audit repository | post-commit audit、Query audit、generic audit writer、count-only relation | audit 由 source owner 在业务 UoW 中 append；reader只验证 matching linkage；不增加 audit materialization method。 |
| projection writer | A3-3 P1/P4 current、`MUT-G20` | generic projection getter、NotFound -> first | 只接受 `write_projection_materialization`；first/existing由 formal target/index proof裁决。 |
| derived writer | A3-3 P2/P4 current、`MUT-G21` | existing-only writer、state-only first、generic derived row | 只接受 `write_derived_materialization`；source set、phase、state/binding/current image关系不得省略。 |
| comparison writer | A3-3 P3/P4 current、Step 6 comparison canonical source | generic row、latest winner、独立 `MUT-G22` | 只接受 `stage_backend_capability_comparison_materialization`；四成员保持 dedicated application slice，无新 domain root。 |
| implementation gate | `CB-SBX-01A` 与 `BLK-SBX-CANONICAL-001` | historical “pass”、placeholder digest/fixture | 继续 `blocked / wait_design`；本批不选择算法、不生成 fixture、不激活 implementation。 |

旧正式 `03`、README、早期 Step 6/7 snapshot 与下游历史 `pass` 记录仅作差异定位。它们与上述 current source 冲突时一律记为
`historical_material`，不得作为实现签名、owner 或授权依据。

### 107.3 Existing owner registry 与复用边界

| reused surface | 唯一 current owner | 已有 callable / method | source truth / candidate | persistence / UoW边界 | A3-4结论 |
|---|---|---|---|---|---|
| reconciliation fresh/duplicate | Job 10 application owner | `run_sandbox_reconciliation`；Step 6 `RunSandboxReconciliationJobInput` | complete explicit scope、verified digest binding、per-target observations、source dual cursor、finding set | dedicated report group；fresh reservation与stored/idempotency relation同原 owner；commit/unknown由 caller/UoW owner | 复用，不新增 writer |
| reconciliation exact read | application query reader | `read_sandbox_reconciliation_report_source` | exact `SandboxReconciliationReportSelector { report_ref }`、six complete index counts、same-snapshot bundle | borrowed committed read snapshot；write UoW、identity、cursor、repair、audit append均为0 | 复用，不改 selector |
| reconciliation report object | Step 6 contracts/domain owner | `SandboxReconciliationReport::rehydrate` 与 canonical factories | row/basis/findings/status equality/audit linkage/truth cursor | immutable report；reader不返回 partial row，不写 current/history | 复用，不复制 object |
| audit append relation | each source mutation owner | existing append-only audit repository / named source mutation write path | accepted source transition、subject、truth cursor、typed audit kind | same business UoW；append-only；不由 Query、reader或status writer拥有 | 复用，不新增 audit writer |
| audit read relation | report reader / existing audit reader | exact audit relation lookup与`SandboxAuditTrace` rehydration | matching report/source/subject/kind/status/cursor/time | same fair committed snapshot；read-only；不反写 audit | 复用，不新增 audit Query |
| projection materialization | Job 8 maintenance kernel | `write_projection_materialization` | `ProjectionTargetProof`、checked source snapshot/unavailable proof、loaded `Versioned<Projection>` | `MUT-G20` whole group；writer stage-only；caller commit/unknown | 复用，不扩 owner |
| derived materialization | Job 9 maintenance kernel | `write_derived_materialization` | `DerivedFormalTargetProof`、typed source set、phase/guard、state/current-binding expectations | `MUT-G21` whole group；builder在 confirmed phase后运行；caller commit/unknown | 复用，不扩 owner |
| comparison materialization | application maintenance/source owner | `stage_backend_capability_comparison_materialization` | formal target proof、ordered committed requirement/reference/summary snapshots、first/replace evidence | dedicated four-member application slice；stage-only；exact binding CAS；不注册`MUT-G22` | 复用，不扩 domain registry |
| eight status views | existing source mutation owners | eight named `stage_*_status_materialization` methods | family-specific accepted source/candidate/binding/index proof | `MUT-G01~MUT-G19` existing groups；writer只stage；Query不调用 | A3-4只做差集审计 |
| 13 Query surfaces | existing query facade/reader owners | 13 exact Query methods与9 maintenance readers | permitted request first、exact selector、one fair committed snapshot | read-only；no writer/UoW/identity/cursor/audit/external | 复用，不新增写入口 |

### 107.4 Owner 复用的正向闭合与禁止重复声明

| closure dimension | current static result | required implementation interpretation |
|---|---:|---|
| mutable logical roots | `19/19` existing | 只能消费 `MUT-G01~MUT-G21`；comparison dedicated slice不改 domain root计数。 |
| same-UoW groups | `21/21` existing | 新 writer必须挂到已有 group；不得因 read/maintenance审计新增 group。 |
| application callable | `42/42` unchanged | A3-4不新增 facade、DTO、stored kind、scheduler或dispatch variant。 |
| maintenance readers | `9/9` exact | 继续使用 bounded selector/cursor/snapshot contract；不新增 generic reader。 |
| source owner | `11/11` materialization surfaces已有 owner | writer不夺取 source transition、truth cursor、business audit、identity或external outcome。 |
| Query write authority | `0/13` | 任一 Query 触发 stage、repair、refresh、rebuild、rebind或audit append均为 scope violation。 |
| generic writer / repository | `0` | 禁止 `write(kind, payload)`、`Repository<T>`、bulk upsert、latest winner和row-only success。 |
| new mutable root / `MUT-G22` | `0` | comparison 只用 dedicated application persistence slice；不改变 registry。 |
| new public inspection result | `0` | `Committed/FullyAbsent/Indeterminate` 仅 application-private inspection；不进入 public DTO/status/stored kind。 |

本批第一批只完成 owner registry 与历史裁决；字段级读写、Version/CAS、unknown 与下游闭环在下一批继续。正式 `03` 与 implementation
仍冻结。

### 107.5 字段来源与下游消费者闭环

本小节把“复用既有 owner”展开到字段级。表中的 `source` 是唯一 canonical source；`consumer` 是允许读取或机械映射该字段的
下游 owner。任何实现若从相邻 DTO、当前时间、repository `Version`、日志文本或 latest scan 补造字段，均视为 source drift，
不能以 mapper 便利为理由保留。

#### 107.5.1 Reconciliation 输入、draft、final 与 stored envelope

| carrier / field | 唯一 source owner | 形成时机 | 允许的下游 consumer | 禁止替代 |
|---|---|---|---|---|
| `RunSandboxReconciliationJobInput.job_run_id` | Job entry 的 checked `JobRunId` | 进入 application Job 前 | `run_sandbox_reconciliation`、stored envelope、duplicate replay | report ref、idempotency key、当前时间 |
| `call_context` | shared `SandboxServiceCallContext` factory | entry validation 后冻结 | Job owner、idempotency reservation、redacted hook | route/topic 字符串、raw envelope |
| `scope` | Step 6 explicit `SandboxReconciliationScopeRef` | job input construction | source reader、report draft、binding logical key | config 扫描、latest scope、empty-as-all |
| `selection_proof` | canonical selection verifier | input construction | source assembly；只读审计不重新枚举 scope | page token、数组长度、caller bool |
| `scope_digest_binding` | canonical writer/verifier receipt | input construction与rehydration | report、current binding、stored envelope、relay payload | fixture hash、字符串拼接、repository key alone |
| `report_ref` | typed identity allocator owned by reconciliation Job | fresh path在首次 stage 前冻结 | report draft/final、finding refs、current binding、stored envelope、Query selector | `SandboxOpaqueRef`、job run id |
| `basis` | same committed source snapshot或typed assembly failure | pure report assembly | `SandboxReconciliationReport` factory、reader rehydration、status derivation | job status、error text、partial row |
| `findings` / ordinal stream | canonical finding factory由 checked source proof产生 | report draft assembly | report、relay payload、stored envelope、Query surface | count-only、severity sort、latest query |
| `report_status` | private exhaustive `derive_report_status` | draft factory与rehydration各自重算 | report、stored original status mapper、Query surface mapper | caller status、repository error、finding severity |
| `report_audit_trace_ref` | reconciliation write group 的 typed audit identity | matching report draft创建时 | report linkage、current binding、stored envelope、exact reader | query trace、post-commit diagnostic trace |
| `report_truth_cursor` | owning write UoW 的 `assign_truth_change_cursor()` | finalized commit group 内 | report、audit、binding、relay、stored envelope | source cursor、reference cursor、`Version`、timestamp |
| `generated_at` | report pure assembly 的 trusted clock | draft assembly | report persistence row、Query response | repository insert time、query clock、job finish time |
| `original_report_status` | report status 的机械 Job 映射 | committed stored envelope construction | duplicate replay与Job report mapper | `DuplicateReplayed` overlay、caller-selected status |
| `started_at` / `finished_at` | original Job invocation lifecycle clock | invocation start / same-UoW completion | stored envelope、duplicate replay | replay时间、repository update time |
| `finding_relay_record_ref` | finding relay draft finalization；仅 finding 非空时存在 | same report UoW | stored envelope、relay reader、publisher/recovery owner | report status推导、伪造 ref、publisher response |
| `stored_result_ref` | typed stored-result identity owner | candidate construction前冻结 | idempotency completion、typed save/get、duplicate replay | report ref代替、generic JSON blob |

`SandboxReconciliationReport::rehydrate` 是 report、basis、finding、status、audit linkage、cursor 和时间关系的最终
canonical check。`SandboxReconciliationStoredJobReport::rehydrate` 只在 exact report bundle 与 optional relay bundle 已经
通过各自 canonical rehydration 后运行；它不得成为第二个 status owner。`DuplicateReplayed` 只描述本次调用的 disposition，
不得写入 `original_report_status`、`original_job_run_id`、`started_at`、`finished_at` 或任何 immutable relation。

#### 107.5.2 Current binding、Version 与结果消费者

| 字段 / 关系 | owner 与来源 | 一致性要求 | 下游使用 |
|---|---|---|---|
| full logical key | `SandboxReconciliationScopeDigestBinding` 的完整 scope + digest | digest 可作索引组件，但命中后必须逐字段重验 scope；collision 是 integrity error | first/replacement expectation、current lookup、retention pin |
| current `report_ref` | `SandboxReconciliationCurrentBinding::try_from_committed_report` | 必须指向同组已 finalized report；replacement ref 必须不同 | Job `Committed` outcome、current query relation；duplicate 不返回它 |
| current `report_truth_cursor` | finalized report 的 report cursor | 严格覆盖 checked source cursor；不能被 source cursor替换 | ordering/fence、rehydration、late-source rejection |
| current `report_status` | report status 的机械副本 | 只用于 index integrity equality；不参与 winner 选择 | current binding rehydration、surface consistency |
| current `report_audit_trace_ref` | matching committed report audit | source/subject/kind/cursor/time 必须 exactly-one | report bundle、audit linkage、stored envelope |
| current binding `Version` | repository exact read返回的 core `Version` | 仅用于 `ReplaceCurrent` CAS；不得假定数值连续或由 cursor推导 | caller fresh read、replacement writer、commit-unknown inspection |
| `SandboxReconciliationMaterializationWriteOutcome::Committed` | whole-group commit confirmation | 只有完整 report/finding/current/audit/relay/stored/idempotency group可见时返回 | Job result mapper、stored original status |
| `DuplicateReplayed.stored_job_report` | typed stored-result loader | exact operation/fingerprint/kind与完整 envelope均匹配；不读 current | duplicate Job surface、historical report replay |
| private commit inspection | `SandboxUnitOfWorkManager` / caller owner | exact candidate identities与relation cardinality必须在 fresh fair snapshot重验 | 只决定 caller recovery；不进入 public DTO/status/stored kind |

下游字段闭环按下表登记。此表只登记消费责任，不提前定义 Step 8~17 的新协议或测试结果。

| 下游 Step / surface | 必须消费的 current source | 允许的转译 | 不得重新推导 |
|---|---|---|---|
| Step 7 facade / Job | checked Job input、candidate、writer outcome | `Committed` / `DuplicateReplayed` 的 entry-safe mapping | generic paged item、current binding for duplicate、caller status |
| Step 7 exact Query | exact report selector、six-index cardinality、rehydrated bundle | `Report` / `ExactAbsent` / `Unavailable` / typed integrity error | scope latest、`Option<Report>`、repair、audit append |
| Step 8 protocol | typed report ref、canonical status、ordered finding refs、safe basis/coverage | 机械 DTO mapping，待 Step 8 单独重审 | opaque ref、count-only finding、query clock补字段 |
| Step 9 flow | reservation、source snapshot、candidate、expectation、commit/unknown branch | 按既有 Job 10 顺序编排 | unknown 后重读 source、重算 candidate、盲重外呼 |
| Step 10 state | canonical report status与既有 Job status | 只做 persisted original status mapping | 把 private inspection三分支当 public lifecycle |
| Step 11 persistence | exact group members、core Version、truth cursor、append-only history | durable/fake按同一 relation contract实现 | latest winner、row-only success、假定 Version 递增 |
| Step 12 recovery | `CommitUnknown`、exact relation inspection、retention pin | conservative `Committed`/`FullyAbsent`/`Indeterminate` internal handling | unknown 当 absent、删除 partial rows、自动新 identity |
| Step 15 audit/observability | matching business audit linkage与low-cardinality hook | hook failure隔离 | raw body、secret、query audit、诊断记录冒充 business audit |
| Step 16 test cuts | failpoint、CAS、cardinality、duplicate、unknown、durable/fake parity | 未来测试 fixture/断言定义 | 把 design-only matrix 写成已执行结果 |
| Step 17 implementation handoff | exact owner、source path、forbidden set、open blockers | implementation pre-read checklist | 自行补 generic repository、public unknown或第二 writer |

#### 107.5.3 十一个 materialization surface 的 owner 接缝差集

| surface family | source / audit authority | materialization owner | Query 关系 | A3-4 判定 |
|---|---|---|---|---|
| execution / boundary / policy | source mutation owner产生 accepted fact与 audit | existing named status writer，挂 `MUT-G01~MUT-G06` | exact reader只读 source/binding/index | 无重复 source 或 audit owner |
| capture / handoff | terminal capture与handoff source owner | existing named status writer，挂既有 capture/handoff group | Query不得补 material/capture/audit | 无重复 capture writer |
| failure / control / cleanup / redline | safety source owner与strict hold owner | existing named status writer，挂 `MUT-G07~MUT-G19` | Query只做 bounded read；integrity fail-closed | 无重复 safety transition |
| projection | accepted projection source与existing source audit linkage | `write_projection_materialization` / `MUT-G20` | Query只读 projection bundle | writer不追加 business audit |
| derived | typed source set、phase、state/binding owner | `write_derived_materialization` / `MUT-G21` | Query只读 derived bundle | writer不改变 core truth |
| comparison | ordered requirement/reference/summary source与既有 audit linkage | `stage_backend_capability_comparison_materialization` / dedicated slice | Query只读 four-member bundle | 不注册 `MUT-G22` |
| reconciliation | explicit scope source assembly与report source fact | `run_sandbox_reconciliation` dedicated whole-group owner | exact report reader only | 唯一 report writer |
| audit trace | 原 source mutation或报告/relay owner | `SandboxAuditTraceRepository` append path | `get_sandbox_audit_trace` bounded read | 不创建通用 audit materializer |

差集结论：A3-4 没有发现“已登记 consumer 但没有 owner”的新 L1/L2 缺口；也没有发现“同一 source 由两个 writer
拥有”的正向重复。`SandboxAuditTrace` 在 report materialization中是 report source fact 的 matching relation，不能
被误读为所有 status/projection/derived/comparison writer 都必须追加一条 audit。

### 107.6 事务顺序、Version/CAS 与 commit-unknown owner

本节只复用 Step 6/Step 7 已收稳的事务契约，目的在于确认 existing owner 可以被实现者按一个确定的调用顺序落码。它不创建
新的 UoW、repository 或 public outcome。`SandboxReconciliationMaterializationWriteOutcome` 的成功分支仍由既有 Job owner
在 whole-group commit confirmed 后形成；stage writer、reader 和 audit repository 都不得自行宣称成功。

#### 107.6.1 Query、reconciliation writer 与 audit append 的边界

| path | 固定顺序 | write / identity / cursor / external budget | owner |
|---|---|---|---|
| `get_sandbox_reconciliation_report` | access decision -> exact request -> 一个 fair committed snapshot -> 六项 index -> cardinality -> exact bundle -> canonical rehydrate -> surface map -> close | `0 / 0 / 0 / 0`；business audit append、relay append、repair均为0 | Query facade + `SandboxReconciliationReportReader` |
| reconciliation duplicate | preflight -> completed idempotency exact hit -> typed stored envelope -> exact report/audit/relay revalidation -> duplicate overlay | write UoW、source read、new identity、new cursor、audit/relay append均为0 | `run_sandbox_reconciliation` / existing stored owner |
| reconciliation fresh first | validate/digest -> fresh reservation -> one source snapshot -> report/finding/audit/conditional relay draft -> first expectation -> stage complete group -> assign report cursor -> finalize -> commit | 仅既有 reconciliation group；external call=0；Query不能进入 | Job 10 whole-group owner + `SandboxUnitOfWorkManager` |
| reconciliation replacement | exact current binding + core `Version` fresh read -> candidate assembly -> `ReplaceCurrent` CAS -> stage new immutable report group -> commit | old report/finding/audit/stored保持immutable；CAS loser全量回滚 | Job 10 owner；Version/CAS由UoW/repository owner执行 |
| staged source audit | source transition/candidate -> audit draft -> same UoW stage -> one truth cursor -> finalize -> commit | audit 与 required source 同组；audit repository不分配cursor | source mutation owner + `append_staged_audit_trace` |
| committed maintenance audit | exact committed source read -> fresh relation proof -> `append_committed_audit_trace` 独立UoW -> commit | 不回滚已提交source；required/L2分类由调用方决定 | named maintenance/recovery owner |
| relay feedback audit | exact relay/attempt bundle -> relay source proof -> `append_committed_relay_audit_trace` -> commit | 复用原source cursor；不创建新relay或发布调用 | relay feedback/recovery owner |

这里的“一个 source snapshot”是 reconciliation source assembly 的一致性要求，不表示 reader 可以把多个分页结果拼接为
一个 snapshot。九个 paged maintenance reader 仍由其各自 immutable selection generation 管理；reconciliation Job 不消费
那些 page token 或 maintenance permit。

#### 107.6.2 Reconciliation whole-group members

| ordinal | required member | stage owner | commit visibility | absence / failure rule |
|---:|---|---|---|---|
| 1 | idempotency reservation / completion | existing idempotency owner | 与本次 operation group 同 commit | duplicate 从已完成 typed result 读取；未完成不得伪造 replay |
| 2 | immutable `SandboxReconciliationReport` root | `SandboxReconciliationReportRepository` | report row 与 dependent rows同时可见 | row-only visible 或 partial row均为 integrity violation |
| 3 | ordered finding stream | reconciliation report writer | 与 report root同一UoW | finding gap、duplicate、ordinal乱序禁止提交 |
| 4 | current binding 或 historical relation | current-binding owner | first insert或replacement CAS与report同组 | `current=0`不等于整个group absent；history/tombstone必须检查 |
| 5 | matching `SandboxAuditTrace` | audit append owner | staged source时与report同组 | required audit缺失阻止安全完整提交；不由Query补写 |
| 6 | optional finding relay pair | relay append owner | 仅 finding 非空时存在且同组Pending | findings非空但relay prerequisite缺失，整组回滚 |
| 7 | typed `SandboxReconciliationStoredJobReport` | typed stored owner | 与report/audit/relay同组 | duplicate只读取原envelope，不从current重组 |
| 8 | generic `SandboxStoredOperationResult` linkage | generic stored/idempotency owner | 与typed envelope同组 | 不增加第四种 stored kind，不保存counts-only结果 |
| 9 | report truth cursor | owning UoW cursor allocator | 由同一 commit sequence可见 | 不能以 source cursor、Version或时间代替 |

`Committed` 只能在上述九类必要关系按当前分支全部通过并由 commit confirmed 证明后返回。`finding_relay_record_ref` 在
finding 为空时不是“缺失依赖”，而是必须为 `None`；`current binding` 在 historical report 读取时可以为零，但不能因此
拒绝 exact historical report。任何实现只检查 report root 和 current binding 就返回成功，均违反 whole-group owner contract。

#### 107.6.3 First / replacement / Version 规则

| branch | precondition source | UoW 检查 | success condition | loser / conflict handling |
|---|---|---|---|---|
| `FirstMaterialization` | candidate 的完整 scope/digest 与 canonical proof | current binding、report history、tombstone，以及除当前已确认 fresh reservation 外的冲突 in-flight relation均为合法 absence | 新 report ref、finding/audit/relay/stored/idempotency九类关系一次提交 | 任一冲突 relation、digest collision或unique conflict返回 typed conflict；不把candidate私存为history |
| `ReplaceCurrent` | fresh exact current binding + core `Version` | 完整 scope/digest、expected binding 和 expected `Version` 与当前快照逐字段相等 | 新 report ref 与新 report cursor提交；旧 group保持immutable historical | `VersionConflict` / binding conflict整组回滚；不得 reload latest后重写 |
| duplicate replay | completed idempotency relation | operation、fingerprint、stored kind、typed envelope与exact report bundle全等 | 返回原 `SandboxReconciliationStoredJobReport`，本调用 write set为0 | mismatch、missing或corrupt relation为 typed integrity/error，不重算source |

`Version` 的唯一来源是 current-binding exact repository read 返回的 core `Version`，或同一 owner 的 create/read contract
明确返回的 committed `Version`。truth cursor、report cursor、timestamp、job run id 和 digest 都不能充当 CAS 版本。不能
假设 `Version` 连续递增、从零开始或与数据库自增值同构；这些物理语义留给实施阶段的 adapter contract，当前只固定 equality/CAS。

#### 107.6.4 Commit-unknown 三分支与责任转移

| inspection branch | 必须观察的关系 | caller 处置 | 禁止动作 |
|---|---|---|---|
| `Committed` | 原 candidate 的 report/finding/current-or-history/audit/relay(if required)/typed stored/generic stored/idempotency completion全部存在且逐字段重验通过 | 恢复原始 `Committed` 结果或原始 stored envelope；不生成新身份 | 重新读source、重新编码finding relay、再次append audit |
| `FullyAbsent` | 原 candidate 的全部 mandatory relation与reservation均在同一 fresh fair snapshot中证明不存在 | 只把控制权交给上层显式新调用；是否复用业务key由上层策略决定 | 在同一调用栈静默重跑、报告原调用成功、复用旧external observation |
| `Indeterminate` | partial、mixed generation、corrupt、unavailable、unknown relation或snapshot无法证明 | quarantine/fail-closed，保留 safety hold，交 reconciliation/人工恢复 owner | 删除partial row、猜winner、补index、生成新identity或自动重试 |

inspection 本身是 application-private read operation：不打开 write UoW、不分配 identity、不分配 truth/reference cursor、不
追加 audit、不调用 relay/provider/backend/tool/runtime。`Committed/FullyAbsent/Indeterminate` 不是 public DTO、状态机、stored
kind 或验收结论；它们只为 caller 解决提交结果未知时的保守分流。

#### 107.6.5 一致性失败矩阵

| failure | canonical owner | required result | 是否允许降级为普通 L2 |
|---|---|---|---|
| report root / finding / audit / stored cardinality不一致 | report reader / UoW inspection owner | typed integrity error；不得返回 Empty/Unavailable | 否 |
| scope digest verifier未装配 | canonical verifier owner | typed unavailable；保持 `BLK-SBX-CANONICAL-001` | 否，不能用fixture放行 |
| finding非空且relay append prerequisite缺失 | reconciliation writer owner | `FindingRelayUnavailable`，整组不可见 | 否 |
| publisher在合法 Pending append 后不可用 | relay delivery owner | report group保持已提交，relay后续进入delivery recovery | 是，不能回滚report |
| required staged audit append失败 | source group owner | pre-commit整组失败或unknown；不报告安全完整成功 | 否 |
| ordinary post-commit diagnostic hook失败 | hook/observability owner | 保留主体truth，返回受限诊断处置 | 是 |
| current CAS失败 | current-binding owner | `VersionConflict`；不选择latest winner | 否 |
| fake缺少某个 durable failure能力 | parity gate owner | fake capability unavailable / parity gate未通过 | 否，不能伪造success |

### 107.7 Durable/Fake parity 与负向边界审计

本节中的 parity 数量是设计义务清单，不是测试执行结果。durable adapter 与 deterministic fake 必须接受相同 typed request、
返回相同有限 outcome/error 分类，并在 staged visibility、snapshot、Version/CAS 和 commit-unknown 上保持相同语义。fake
不得以“内存 map 写入即提交”或“找不到即空结果”缩短 contract。

#### 107.7.1 Parity obligation inventory

| # | parity dimension | durable 与 fake 必须相同的行为 | design result |
|---:|---|---|---|
| 1 | exact selector | 只接受 typed `report_ref` / authorized audit subject；scope/latest均拒绝 | recorded |
| 2 | access-first | denial 在任何 index/relation read 前结束，且不泄漏 existence | recorded |
| 3 | snapshot ownership | caller-owned fair committed snapshot；reader不跨调用缓存或换代 | recorded |
| 4 | six-index completeness | 六项计数都读取；root=0但dependent非零为 integrity | recorded |
| 5 | report rehydration | row、finding、audit linkage按固定顺序canonical rehydrate | recorded |
| 6 | audit rehydration | source/subject/kind/status/cursor/time exactly-one校验 | recorded |
| 7 | query zero-write | write UoW、identity、cursor、audit/relay append、repair、external call均为0 | recorded |
| 8 | staged invisibility | 未commit的report/finding/audit/relay/stored关系对read path不可见 | recorded |
| 9 | rollback | 每个failpoint使whole group不可见；不留下可读half-group | recorded |
| 10 | first conflict | current/history/tombstone/in-flight任一存在都拒绝first | recorded |
| 11 | replacement CAS | expected binding与core `Version`必须同时匹配；不支持last-writer-wins | recorded |
| 12 | immutable history | replacement不更新旧report/finding/audit/stored row | recorded |
| 13 | duplicate replay | exact stored envelope原样返回；不读current、不重算source | recorded |
| 14 | relay gate | finding非空要求完整append wiring；publisher unavailable与append unavailable分离 | recorded |
| 15 | audit path split | staged、committed maintenance、committed relay三种append path不互换 | recorded |
| 16 | cursor/version | truth cursor、reference cursor、core `Version`各自来源和用途不混用 | recorded |
| 17 | commit unknown committed | 完整group可恢复原outcome，不生成新身份 | recorded |
| 18 | commit unknown absent | 只有whole-group fully absent才允许上层显式新调用 | recorded |
| 19 | commit unknown indeterminate | partial/unavailable/corrupt进入fail-closed/quarantine，不猜测 | recorded |
| 20 | body-free/redaction | path、host、PID、network、payload、secret、raw provider cause均不进入carrier或hook | recorded |

`A3-4 parity obligations = 20/20 design-only`。该数字只代表中间产物已经逐项登记 implementation/test 所需的观察维度；没有
执行 durable adapter、fake、provider、数据库或测试，因此不得写成 `pass`、真实 coverage 或 evidence。

#### 107.7.2 Negative audit

| forbidden surface | current static count | owner裁决 |
|---|---:|---|
| new reconciliation report writer | `0` | 继续由 `run_sandbox_reconciliation` 唯一拥有 |
| generic reconciliation repository / `write(kind, payload)` | `0` | 使用已有 named report/audit/stored methods |
| second audit writer for materialization/query | `0` | business audit只由 source owner append |
| new `MUT-G22` / domain mutable root | `0` | comparison dedicated application slice不扩 registry |
| Query触发 stage/create/repair/rebind/refresh/rebuild | `0/13` | all Query remain read-only |
| Query / reader append business audit | `0/13` | diagnostic hook不等于 business audit |
| reconciliation进入九个 paged maintenance Job | `0` | no page permit/accumulator/finalizer |
| report-only success when finding relay is required | `0` | relay prerequisite fail-closed |
| latest/current substitution for exact historical report | `0` | exact report ref and six-index proof only |
| `Option<Report>` or root-only absence | `0` | complete cardinality required |
| unknown -> success/absent/degraded without inspection | `0` | three-way private inspection required |
| unknown后新identity、source重算或external call | `0` | frozen candidate and zero external calls |
| CAS loser private historical row | `0` | loser whole rollback |
| post-commit required audit repair | `0` | required append belongs to original UoW |
| raw body/provider/secret in report/audit/diagnostic carrier | `0` | body-free contract |
| tools semantic execution、runtime agent loop、member orchestration混入 | `0` | outside Sandbox boundary |

`negative audit = 16/16 design-only`。这些是禁止路径的静态设计结论，不是代码扫描或运行时测试结果。

### 107.8 A3-4 静态结论、回填草稿与停审门

#### 107.8.1 静态 closure summary

| closure item | current design result | interpretation |
|---|---:|---|
| reconciliation fresh/duplicate owner | `1/1` | `run_sandbox_reconciliation` 继续是唯一 Job 10 owner |
| reconciliation exact reader | `1/1` | `SandboxReconciliationReportReader::read_sandbox_reconciliation_report_source` 唯一具名 read method |
| audit append paths | `3/3` | staged source、committed maintenance、committed relay各有明确 owner |
| audit read paths | `2/2` | exact ref read与bounded subject page复用既有 trait；Query zero-write |
| typed stored report save/get | `2/2` | typed save/get与generic stored linkage成对；不从current重组 |
| materialization writer surfaces | `11/11` | 八 status-view + projection + derived + comparison均已有 owner |
| source/consumer field closure | `11/11` | 每个 materialization surface可回指 source、writer、reader与下游 consumer |
| mutable roots / same-UoW groups | `19/19` / `21/21` | A3-4未新增 root、group或 registry entry |
| application callable | `42/42 unchanged` | 不新增 facade、DTO、scheduler或dispatch variant |
| Query write deny-set | `0/13` | Query、reader、inspection均不写业务truth或audit |
| durable/fake parity obligations | `20/20 design-only` | 只登记设计义务，尚未执行 |
| negative audit | `16/16 design-only` | 禁止路径均有明确 owner/redline |

#### 107.8.2 正式 `03` 回填草稿（冻结，不在本批写入）

| 正式章节 | 允许回填的 A3-4 结论 | 禁止回填 |
|---|---|---|
| §5 模块实现契约 | Job 10、exact report reader、audit repository与materialization writer的唯一 owner/实现方向 | generic writer、第二 reconciliation domain、Query write |
| §6 全局索引 | existing owner、19 root、21 UoW group、42 callable与typed stored/audit/reconciliation ref关系 | private inspection作为公共类型、`MUT-G22` |
| §7 协议契约 | Step 8 后续机械消费的 typed report ref/status/finding stream来源 | 未重审的 wire alias、opaque scope、counts-only payload |
| §8 函数级 flow | Job 10 fresh/duplicate、first/replacement、relay gate、commit-unknown顺序 | 把 audit/query/inspection写成主体执行流 |
| §10 持久化一致性 | whole-group成员、core `Version` CAS、append-only audit、durable/fake parity义务 | row-only success、latest winner、假定Version递增 |
| §11 错误恢复 | `FindingRelayUnavailable`、`VersionConflict`、`CommitUnknown`三分支与保守处置 | unknown当absent、自动重试或补偿删除 |
| §14 可观测与审计 | matching business audit、body-free low-cardinality hook与失败隔离 | 把诊断hook当truth或真实sink结果 |
| §15 测试切口 | 20项 parity、16项 negative、failpoint/CAS/cardinality/duplicate/unknown切口 | 测试已执行、coverage、run或evidence |
| §16 实施承接 | exact source paths、method owner、forbidden set、open blockers与implementation pre-read | 实现授权、boundary完成、伪造commit |

#### 107.8.3 待确认事项与 blocker disposition

| item | current disposition | owner / next handling |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | 继续 open；A3-4 已完成 owner/consumer consistency，但 A4 total audit 尚未完成 | A4 进行正反向总审计后裁决 |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | 继续 open；本批只登记 parity obligation，未执行 durable/fake/provider conformance | `S7-05` / outcome owner后续关闭 |
| `BLK-SBX-CANONICAL-001` | 继续 open；canonical digest writer/verifier/fixtures未真实绑定 | canonical owner后续提供真实设计/验证输入 |
| Step 8~17 consumer mapping | deferred，不能由 A3-4代替 | 各自 SOP 与中间产物按顺序重审 |
| retention/tombstone physical policy | 只保留 pin/redline，不选择DDL/TTL/算法 | Step 11/14 owner后续定义 |
| ordinary diagnostic audit/hook detail | L2 最小门禁，未展开第二主流程 | Step 15/07 implementation handoff按需承接 |

#### 107.8.4 A3-4 完成门与真实性声明

A3-4 的静态设计工作达到以下门禁：

1. 两个 existing owner（reconciliation、audit）均有唯一 current method/path、字段来源、UoW边界、下游 consumer 和禁止重复声明。
2. reconciliation 的 first/replacement、typed duplicate、relay gate、Version/CAS 与 commit-unknown owner均能回指既有 Step 6/7契约。
3. `20/20` parity 与 `16/16` negative 仅表示设计义务和静态审计已登记；没有代码、编译、数据库、provider、fake 或测试事实。
4. 未新增 mutable root、same-UoW group、public callable、public status、stored kind、identity、repository generic surface 或 L1/L2 blocker。
5. A3-4 只处理审计、对账、记录、异常恢复和 materialization owner 接缝；不承接 Sandbox 主体隔离执行、tool/runtime/member semantic。

本批完成后必须停在用户复核门。未经用户确认，不得启动 A4、Step 8、正式 `03` 回填或 implementation；正式文档继续冻结。

## EOF Current Recovery Override: `7R-04A-A3-4` completed, user review pending

本节位于 read artifact 物理 EOF，是当前唯一恢复权威。A3-4 已完成 reconciliation/audit existing owner 的字段来源、
consumer、UoW/CAS/unknown、parity 和负向一致性审计；A3 necessary writer boundary 到此完成并停在用户复核门。A4、Step 8、
正式 `03` 与 implementation 继续冻结。

```text
current_plan_version = v7.1-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-4 existing owner reuse and consistency audit completed_wait_user_review
current_internal_task = A3-4 user review gate after existing owner consistency audit
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_projection_derived_comparison_writers = completed
a3_4_existing_owner_and_consistency_audit = completed_wait_user_review
a3_outcome_writer_boundary = completed_wait_user_review
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 11/11_design_only
reconciliation_fresh_duplicate_owner = 1/1
reconciliation_exact_reader = 1/1
audit_append_paths = 3/3
audit_read_paths = 2/2
typed_reconciliation_stored_save_get = 2/2
materialization_source_consumer_closure = 11/11
a3_4_durable_fake_parity_obligations = 20/20_design_only
a3_4_negative_audit = 16/16_design_only
mutable_logical_roots = 19/19_unchanged
same_uow_groups = 21/21_unchanged
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
new_public_status_or_stored_kind = 0
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_107|step7_service_facade_job10|step7_repositories_current|step7_control_current|step7_cross_audit|current_recovery_ledgers
next_allowed_action = wait_user_review_before_A4
```

## 108. `7R-04A-A4-P1` 13 Query 正向 Owner / Source / Reader / Consumer Total Audit

本批消费 A3-4 用户复核门，只做 `7R-04A` 的第一项正向总审计。审计对象是 13 个 public Query 的完整实现契约链：

```text
public facade
  -> checked input / closed selector
  -> permitted read request
  -> one exact named reader
  -> canonical source / lookup outcome
  -> application mapper / Step 6 factory
  -> typed Query surface
  -> downstream mechanical consumer
```

本批不改正式 `03-详细设计.md`，不新增 Query、reader、repository、writer、status、stored kind 或 public DTO；不把
下游尚未执行的编译、fake/durable conformance、provider 验证和测试写成事实。下表中的 `closed` 是设计文本静态闭合，
不是运行时 pass。

### 108.1 开工门、输入与审计问题回答

| 检查项 | A4-P1 current 结论 |
|---|---|
| predecessor | A3-4 existing owner reuse 与 consistency audit 已完成；其 `2/2` reused owner、`11/11` materialization source/consumer closure 和 Query zero-write 结论已消费。 |
| direct source | 本文件 A1、A2-F1~F5/J1~J4、A3-2/A3-3/A3-4 current EOF；service facade current callable map；repository current root/UoW registry；B1 cross-audit current EOF。 |
| audit direction | 先从 13 个 public Query 向下追 owner/source/reader/consumer，再把缺口、重复和未闭合字段单独计数；不以累计 `13/13` 数字替代逐项证据。 |
| access boundary | 每个 Query 的 access decision、request factory、snapshot owner、reader invocation 和 close precedence 已有具名契约；reader 不 open/close snapshot。 |
| source boundary | source/lookup outcome 只能来自 Step 6 canonical source、binding、index、gap 或 complete absence proof；不从 DTO、latest scan、clock、日志或 fake map补字段。 |
| consumer boundary | application facade 是当前直接 consumer；Step 8 protocol DTO、Step 9 flow、Step 10 state、Step 16 test cut 和 Step 17 handoff 只作为后续机械 consumer，不能反向修改本批 source。 |
| Query side effect | 13/13 的 write UoW、CAS、identity、truth/reference cursor、business audit append、repair/rebuild/refresh 和 external call均为 `0`。 |
| formal writeback | forbidden；本批只追加 calibration artifact 与恢复台账。 |

### 108.2 13 Query 正向总表

| # | public owner / method | checked input / selector | exact reader method | canonical source / outcome | immediate consumer | downstream mechanical consumer | closure |
|---:|---|---|---|---|---|---|---|
| 1 | `SandboxQueryService::get_sandbox_execution_status` | `GetSandboxExecutionStatusInput` -> required-context `SandboxExecutionStatusSelector` | `SandboxPrimaryStatusReader::read_sandbox_execution_status_source` | `SandboxExecutionStatusSourceSnapshot` -> `SandboxExecutionStatusLookupOutcome` | `SandboxExecutionStatusView::from_*_snapshot` 与 `SandboxQueryResult` mapper | Step 8 execution-status DTO source；Step 10 canonical execution status；Step 16 primary-status read cut | closed |
| 2 | `SandboxQueryService::get_boundary_status` | `GetBoundaryStatusInput` -> exact/current `BoundaryStatusSelector` | `SandboxPrimaryStatusReader::read_boundary_status_source` | `BoundaryStatusSourceSnapshot` -> `BoundaryStatusLookupOutcome` | `BoundaryStatusView::from_*_snapshot` 与 `SandboxQueryResult` mapper | Step 8 boundary DTO source；Step 10 boundary state read；Step 16 boundary cardinality/CAS read cut | closed |
| 3 | `SandboxQueryService::get_policy_decision_summary` | `GetPolicyDecisionSummaryInput` -> exact/current `PolicyDecisionSummarySelector` | `SandboxPrimaryStatusReader::read_policy_decision_summary_source` | `PolicyDecisionSummarySourceSnapshot` -> `PolicyDecisionSummaryLookupOutcome` | `PolicyDecisionSummaryView::from_*_snapshot` 与 `SandboxQueryResult` mapper | Step 8 policy summary DTO source；Step 10 policy decision state read；Step 16 action-coverage cut | closed |
| 4 | `SandboxQueryService::get_capture_summary` | `GetCaptureSummaryInput` -> exact/for-run `CaptureSummarySelector` | `SandboxCaptureHandoffReader::read_capture_summary_source` | `CaptureSummarySourceSnapshot` -> `CaptureSummaryLookupOutcome` | `CaptureSummaryView` factory 与 `SandboxQueryResult` mapper | Step 8 capture summary DTO；Step 9 capture materialization read boundary；Step 16 whole-group capture cut | closed |
| 5 | `SandboxQueryService::get_material_handoff_status` | `GetMaterialHandoffStatusInput` -> exact/current `MaterialHandoffStatusSelector` | `SandboxCaptureHandoffReader::read_material_handoff_status_source` | `MaterialHandoffStatusSourceSnapshot` -> `MaterialHandoffStatusLookupOutcome` | `MaterialHandoffStatusView` factory 与 `SandboxQueryResult` mapper | Step 8 handoff DTO；Step 9 delivery/handoff status read；Step 16 plan/progress/relay relation cut | closed |
| 6 | `SandboxQueryService::get_failure_control_status` | `GetFailureControlStatusInput` -> required context + validated `SandboxQueryPageRequest` | `SandboxFailureCleanupRedlineReader::read_failure_control_status_source` | `FailureControlStatusSourceSnapshot` / `EmptyScope` -> `FailureControlStatusLookupOutcome` | `FailureControlStatusView` factory、page info和 `FailureControlStatusQueryResult` mapper | Step 8 bounded failure/control page DTO；Step 10 failure/control state read；Step 16 page/gap/empty-proof cut | closed |
| 7 | `SandboxQueryService::get_cleanup_readiness` | `GetCleanupReadinessInput` -> closed current/exact `CleanupReadinessSelector` | `SandboxFailureCleanupRedlineReader::read_cleanup_readiness_source` | `CleanupReadinessSourceSnapshot` / typed absence/no-view -> `CleanupReadinessSourceLookupOutcome` | `CleanupReadinessView` factory 与 `SandboxQueryResult` mapper | Step 8 cleanup view DTO；Step 10 guard state read；Step 16 dual-pointer/absence/redline coverage cut | closed |
| 8 | `SandboxQueryService::get_redline_containment_status` | `GetRedlineContainmentStatusInput` -> required context + exact `RedlineContainmentSelector` | `SandboxFailureCleanupRedlineReader::read_redline_containment_source` | `RedlineContainmentSourceSnapshot` / exact absence -> `RedlineContainmentSourceLookupOutcome` | `RedlineContainmentView` factory 与 `SandboxQueryResult` mapper | Step 8 redline DTO；Step 10 strict-hold/containment state read；Step 16 security redline cut | closed |
| 9 | `SandboxQueryService::get_sandbox_read_projection` | `GetSandboxReadProjectionInput` -> exact/current `SandboxReadProjectionSelector` | `SandboxProjectionDerivedComparisonReader::read_sandbox_read_projection_source` | `SandboxReadProjectionSourceSnapshot` / `MissingProjection` / unavailable -> `SandboxReadProjectionSourceLookupOutcome` | `SandboxReadProjection` factory 与 `SandboxQueryResult` mapper | Step 8 projection DTO；Step 9 rebuild read boundary；Step 16 missing/stale/rebuilding cut | closed |
| 10 | `SandboxQueryService::get_derived_inspect_preview_trend` | `GetDerivedInspectPreviewTrendInput` -> exact context/state/`Inspect|Preview|Trend` selector | `SandboxProjectionDerivedComparisonReader::read_derived_inspect_preview_trend_source` | `DerivedInspectPreviewTrendSourceSnapshot` / exact absence / gap -> `DerivedInspectPreviewTrendSourceLookupOutcome` | `DerivedInspectPreviewTrendView` factory 与 `SandboxQueryResult` mapper | Step 8 derived view DTO；Step 9 derived maintenance read；Step 10 derived state read；Step 16 kind/source-set cut | closed |
| 11 | `SandboxQueryService::get_backend_capability_comparison` | `GetBackendCapabilityComparisonInput` -> context/requirement/ordered `1..=16` summary selector | `SandboxProjectionDerivedComparisonReader::read_backend_capability_comparison_source` | `BackendCapabilityComparisonSourceSnapshot` / exact absence / gap -> `BackendCapabilityComparisonSourceLookupOutcome` | `BackendCapabilityComparisonView` factory 与 `SandboxQueryResult` mapper | Step 8 comparison DTO；Step 9 comparison materialization read；Step 16 three-cardinality/source-order cut | closed |
| 12 | `SandboxQueryService::get_sandbox_reconciliation_report` | `GetSandboxReconciliationReportInput` -> exact `SandboxReconciliationReportSelector { report_ref }` | `SandboxReconciliationReportReader::read_sandbox_reconciliation_report_source` | six-index exact report bundle -> `SandboxReconciliationReportLookupOutcome` | canonical report rehydration与 `SandboxQueryResult` mapper | Step 8 report DTO；Step 9 Job 10 report read; Step 12 unknown/reconciliation read cut；Step 16 whole-group cardinality cut | closed |
| 13 | `SandboxQueryService::get_sandbox_audit_trace` | `GetSandboxAuditTraceInput` -> context/subject/closed kind/bounded page selector | `SandboxAuditTracePageReader::read_sandbox_audit_trace_page` | subject-stable bounded page / complete empty proof / safe prefix -> `SandboxAuditTracePageLookupOutcome` | page item rehydration、page info与 `SandboxAuditTraceQueryResult` mapper | Step 8 audit page DTO；Step 15 body-free audit/diagnostic linkage；Step 16 cursor/gap/redaction cut | closed |

`downstream mechanical consumer` 表示“后续文档必须机械消费的已登记 source”，不表示 Step 8~17 已完成或已执行。任何下游
若需要新增字段、状态或读取面，必须回到本 Query 的 canonical owner重新登记，不能在协议、flow、测试或实施计划中就地补造。

### 108.3 正向字段闭环矩阵

每个 Query 必须同时闭合以下八个字段层级。`13/13` 代表 13 个 Query 均有唯一来源和唯一 consumer；同一行中不得用
`Option<T>`、字符串 kind 或默认值替代 typed branch。

| field layer | 唯一来源 | 允许 consumer | static result | forbidden substitute |
|---|---|---|---:|---|
| access decision | `SandboxQueryAccessDecision` 与对应 access resolver | facade early-return、permitted request factory | `13/13` | 先读 existence 再决定 visibility、caller bool、route flag |
| input / selector | 13 个 checked application input 与 closed selector factory | 对应 Query facade、对应 read request | `13/13` | raw DTO、opaque scope、多个 optional precedence、public token直传 reader |
| snapshot owner | `SandboxCommittedReadManager` caller-owned fair committed snapshot | exact reader借用 `&mut dyn SandboxCommittedReadSnapshot` | `13/13` | reader自行 open、跨 snapshot 拼接、latest scan、缓存旧 generation |
| exact reader | 5 个 typed reader trait中的 13 个具名 method | 一个对应 Query facade | `13/13` | `read(kind, selector)`、generic repository、old list reader、private map scan |
| source / index proof | Step 6 canonical source、binding、index、relation和complete absence proof | reader outcome、canonical view/report/page factory | `13/13` | counts-only、row-only、NotFound 即 Empty、clock或日志推导 |
| outcome / error | 对应 family closed lookup outcome与finite reader error | facade exhaustive mapper | `13/13` | technical error -> Empty/Degraded、business Failed -> technical error、wildcard default |
| typed surface | 对应 Step 6 view/report/page factory | public Query result、后续 DTO source | `13/13` | facade自行拼 body、复制第二 status、public private-inspection branch |
| downstream consumer | Step 8/9/10/12/15/16/17 已登记回指点 | 后续步骤的机械 mapper / test cut / handoff | `13/13` design-only | 下游自行增加 field、status、reader或 owner |

### 108.4 正向缺口、重复与未闭合字段计数

| audit dimension | count | interpretation |
|---|---:|---|
| public Query owner missing | `0/13` | 13 个 facade method均有唯一application owner。 |
| checked input / selector missing | `0/13` | 每个Query都有closed input/selector；不存在多optional precedence。 |
| exact named reader missing | `0/13` | A2-F1~F5/J4累计 `3+2+3+3+2=13`。 |
| source/lookup outcome missing | `0/13` | A1的7个partial与1个new carrier已由A2正式补齐；F5 audit page也有独立 carrier。 |
| application mapper missing | `0/13` | 每个reader success/error branch都有现有facade mapping；无generic fallback。 |
| immediate consumer missing | `0/13` | view/report/page factory和typed Query surface均可回指。 |
| downstream source pointer missing | `0/13` design-only | 已登记Step 8~17机械消费点；后续仍需各Step重新验证，不等同完成。 |
| duplicate public owner | `0` | 未发现同一Query由两个facade、两个status owner或两个reader拥有。 |
| duplicate reader alias | `0` | generic/legacy/latest/old list reader均未成为current Query path。 |
| unclosed Query field in current design | `0` | access、selector、snapshot、source、outcome、surface和consumer均有来源；真实adapter/fake conformance仍是独立 blocker。 |
| orphan source surface | `0/13` | 每个 source均有对应Query consumer或明确的既有 Job/materialization consumer。 |
| Query write authority | `0/13` | writer、UoW、identity、cursor、audit append、repair和external调用均被禁止。 |

### 108.5 A4-P1 静态结论与边界

1. 13 个 Query 的正向 owner/source/reader/consumer 链达到 `13/13` design-only closure；A1 中的 partial/new 分类不再形成
   当前 Query read contract 缺口。
2. `SandboxMaintenanceSelectionRepository` 的 9 个 reader没有被正向 Query 链引用；其反向孤儿、重复绑定和 Job owner覆盖
   必须在 A4-P2 单独审计，不能由本节的 `Query use=0/13` 单项数字替代。
3. `SandboxAuditTrace` 的 Query read consumer与 business audit append owner保持分离；本 Query 不追加 business audit。
4. `Committed/FullyAbsent/Indeterminate`、reader technical error和commit-unknown inspection均不进入 Query public surface。
5. 本批未关闭 `SBX-DDD-GRANULARITY-STEP7-READ-001`：反向 maintenance/materialization/global registry audit尚未完成。
6. 本批不影响 `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` 或 `BLK-SBX-CANONICAL-001`，也不产生实现、测试、run、evidence、
   验收或 commit事实。

### 108.6 A4-P1 完成门与下一批

| check | result |
|---|---:|
| Query positive owner/source/reader/consumer | `13/13` |
| Query field-layer closure | `8/8 layers x 13 = 104/104 design-only` |
| positive missing owner/source/reader/consumer | `0/13` |
| duplicate Query owner / reader alias | `0/0` |
| Query writer / audit append / repair / external | `0/13` each |
| new L1/L2 blocker | `0` |
| `READ-001` | `open_wait_A4-P2-P3` |
| formal `03` writeback | forbidden |

本批完成后只允许进入 A4-P2：9 个 maintenance reader、11 个 materialization surface，以及 19/19 root、21/21 same-UoW、
42/42 callable 和 forbidden set 的反向覆盖审计。

## EOF Current Recovery Override: `7R-04A-A4-P1` completed, P2 in progress

本节位于 read artifact 物理 EOF，是 A4 当前恢复权威。A4-P1 已完成 13 个 Query 的正向 total audit；A4-P2 只允许执行
反向 maintenance/materialization/global registry audit，不能回填正式 `03` 或启动 Step 8。

```text
current_plan_version = v7.2-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A4-P1 positive Query total audit completed
current_internal_task = A4-P2 reverse maintenance/materialization/global registry audit
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = in_progress
a3_2_status_view_writers = completed
a3_3_projection_derived_comparison_writers = completed
a3_4_existing_owner_and_consistency_audit = completed
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = in_progress
a4_p3_read_blocker_ruling_and_sync = pending
query_positive_owner_source_reader_consumer = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
query_writer_use = 0/13
existing_maintenance_reader = 9/9_preserved
materialization_source_consumer_closure = 11/11
mutable_logical_roots = 19/19_unchanged
same_uow_groups = 21/21_unchanged
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_108|maintenance_selector_registry|materialization_owner_registry|repository_root_uow_registry|callable_registry
next_allowed_action = complete_A4_P2_reverse_audit_only
```

## 109. `7R-04A-A4-P2` 反向 Maintenance / Materialization / Global Registry Audit

本批从已登记的 surface 反向追 owner、source、reader、consumer 和同 UoW 归属。它消费本文件 §108、
`03_ddd_step_07_idempotency_stored_index_repositories.md` 的 9 个 bounded selection reader、
`03_ddd_step_07_repositories_uow_indexes.md` 的 19 个 logical root / 21 个 same-UoW group，以及
`03_ddd_step_07_service_facades_inputs_outputs.md` 的 42 个 application callable current map。

本批只做设计静态差集审计，不把 `closed` 写成编译、fake/durable conformance、provider、运行、测试、evidence、验收或
commit 事实。正式 `03-详细设计.md` 继续冻结；不新增 reader、writer、repository、root、group、callable、status、stored
kind、DTO 或 scheduler。

### 109.1 9 个 maintenance reader 的反向 Job 覆盖矩阵

9 个 reader 仍由同一个 read-only `SandboxMaintenanceSelectionRepository` trait 以 9 个具名方法提供。反向审计从
reader 出发确认唯一 paged Job consumer；reader 只读取 frozen selection index 并产生 candidate，不拥有 truth reload、
Version、action、external call 或 repair。

| # | exact reader | candidate / source proof | 唯一 paged Job consumer | action 前 exact reload | Query / reconciliation 使用 | 反向结果 |
|---:|---|---|---|---|---:|---:|
| 1 | `read_event_relay_page` | relay ref、payload relation、attempt eligibility 与 frozen cutoff | `publish_sandbox_event_relay` (`PublishSandboxEventRelay`) | exact relay + payload + attempt relation + `Version`；再评估 `evaluate_attempt_eligibility` | `0/13` / `0/1` | closed |
| 2 | `read_reference_refresh_page` | reference state ref、完整 `ExternalSourceRef` 与 stale/unresolved basis | `refresh_sandbox_reference_states` (`RefreshSandboxReferenceStates`) | exact state + `Version`；source ref 必须逐字段相等 | `0/13` / `0/1` | closed |
| 3 | `read_backend_capability_refresh_page` | backend source identity、requirement ref、summary/current-binding target | `refresh_backend_capability_summaries` (`RefreshBackendCapabilitySummaries`) | exact requirement/backend/current binding 与 optional summary；在 frozen cutoff 重算 age | `0/13` / `0/1` | closed |
| 4 | `read_material_handoff_retry_page` | handoff ref、完整 target plan/progress、selected pending/retryable set | `retry_pending_material_handoffs` (`RetryPendingMaterialHandoffs`) | exact handoff + complete progress/material/active-attempt relation + `Version` | `0/13` / `0/1` | closed |
| 5 | `read_lease_reaper_page` | lease ref、committed marker/window basis、lineage与incident relation | `run_lease_orphan_reaper` (`RunLeaseOrphanReaper`) | exact lease/handle/context/generation + `Version`；只可形成 reaper marker，不执行 release | `0/13` / `0/1` | closed |
| 6 | `read_cleanup_guard_maintenance_page` | cleanup guard ref、evidence/investigation/redline coverage与 selector allow-set | `evaluate_pending_cleanup_guards` (`EvaluatePendingCleanupGuards`) | exact guard + full ordered coverage + `Version`；不创建 guard、不授权 release | `0/13` / `0/1` | closed |
| 7 | `read_redline_handoff_maintenance_page` | redline ref、containment/preservation/investigation lineage与 strict-hold proof | `maintain_redline_containment_handoffs` (`MaintainRedlineContainmentHandoffs`) | exact redline + strict guard/preservation relation + `Version`；不绕过 containment | `0/13` / `0/1` | closed |
| 8 | `read_projection_maintenance_page` | registered projection target、formal first proof或 existing marker | `rebuild_sandbox_read_projections` (`RebuildSandboxReadProjections`) | exact projection target + `Version`，或同 UoW formal first absence；`NotFound`不转 first | `0/13` / `0/1` | closed |
| 9 | `read_derived_maintenance_page` | registered derived kind、source-set/proof与 existing marker | `maintain_derived_inspect_preview_trend` (`MaintainDerivedInspectPreviewTrend`) | exact state + source set + `Version`，或同 UoW formal first absence；不创建 core failure | `0/13` / `0/1` | closed |
| **total** | **9 exact methods** | **9 typed candidate families** | **9/9 one-to-one Job consumers** | **9/9 reload/recheck** | **0/13 / 0/1** | **`9/9`** |

反向计数如下：reader 无 owner=`0/9`，Job consumer 缺失=`0/9`，重复 Job consumer=`0`，generic/alias reader=`0`，reader
直接写 UoW/CAS/identity/truth cursor/audit/external=`0/9`，reader 直接调用 materialization writer=`0/9`。9 个 reader 不
服务 public Query，也不服务 reconciliation Job；candidate 命中不等于 action permission，任何 action 都必须回到 Job owner
的 exact reload 与既有 same-UoW group。

### 109.2 11 个 materialization surface 的反向 owner / consumer 矩阵

本表把 A3 已识别的 8 个 status-view、projection、derived、comparison 逐一反向追到 source owner、具名 writer、reader 和
consumer。`existing group` 表示复用 `MUT-G01~MUT-G21` 中已登记的 source mutation 或 maintenance group；不表示 writer
拥有该 group 的 commit 权。comparison 的 source owner 是两个已授权的 capability/reference maintenance channel 的闭集，
不是新增 generic owner。

| # | materialization surface | canonical source owner | 唯一具名 writer | same-UoW / pointer owner | exact reader | direct / downstream consumer | 反向结果 |
|---:|---|---|---|---|---|---|---:|
| 1 | execution status view + binding | accepted execution source-chain mutation owner | `stage_execution_status_materialization` | existing source group；singleton context pointer与 exact latest plan | `read_sandbox_execution_status_source` | `get_sandbox_execution_status`；Step 8/10/16 mechanical source | closed |
| 2 | boundary status view + binding | boundary/handle/lease canonical mutation owner | `stage_boundary_status_materialization` | existing boundary groups；exact latest与 context-current plan分离 | `read_boundary_status_source` | `get_boundary_status`；Step 8/10/16 mechanical source | closed |
| 3 | policy decision summary + binding | accepted policy evaluation owner | `stage_policy_decision_summary_materialization` | existing policy/source UoW；first exact target与 action lineage | `read_policy_decision_summary_source` | `get_policy_decision_summary`；Step 8/10/16 mechanical source | closed |
| 4 | capture summary + binding | capture/material lifecycle owner | `stage_capture_summary_materialization` | `MUT-G06` source group；run-to-capture relation保留 | `read_capture_summary_source` | `get_capture_summary`；Step 8/9/16 mechanical source | closed |
| 5 | material handoff status + binding | handoff/attempt/observation owner | `stage_material_handoff_status_materialization` | `MUT-G07~G09` existing groups；exact latest与 context-current plan | `read_material_handoff_status_source` | `get_material_handoff_status`；Step 8/9/10/16 mechanical source | closed |
| 6 | failure/control status snapshot + binding | accepted failure/control transition owner | `stage_failure_control_status_materialization` | existing safety groups；merged index与 single context pointer | `read_failure_control_status_source` | `get_failure_control_status`；Step 8/10/16 mechanical source | closed |
| 7 | cleanup readiness view + binding | cleanup/owner/redline safety mutation owner | `stage_cleanup_readiness_materialization` | `MUT-G13~G16` existing groups；exact target与 context-current Version独立 | `read_cleanup_readiness_source` | `get_cleanup_readiness`；Step 8/9/10/16 mechanical source | closed |
| 8 | redline containment view + binding | redline security mutation owner | `stage_redline_containment_materialization` | `MUT-G16` exact `(context_ref, redline_ref)` pointer | `read_redline_containment_source` | `get_redline_containment_status`；Step 8/10/16 mechanical source | closed |
| 9 | `SandboxReadProjection` root + binding | Job 8 projection maintenance kernel | `write_projection_materialization` | `MUT-G20`；Job 8 owns item UoW/commit-unknown handoff | `read_sandbox_read_projection_source` | `get_sandbox_read_projection` + `read_projection_maintenance_page` | closed |
| 10 | derived Inspect/Preview/Trend state + binding | Job 9 derived maintenance kernel | `write_derived_materialization` | `MUT-G21`；Job 9 owns builder boundary与 item UoW | `read_derived_inspect_preview_trend_source` | `get_derived_inspect_preview_trend` + `read_derived_maintenance_page` | closed |
| 11 | backend capability comparison row + binding | closed capability/reference source-maintenance owner set | `stage_backend_capability_comparison_materialization` | application-private dedicated four-member slice；不注册 `MUT-G22` | `read_backend_capability_comparison_source` | `get_backend_capability_comparison` + capability refresh/materialization consumer | closed |
| **total** | **11** | **11/11 source-owner assignments** | **11/11 named writers** | **11/11 existing/dedicated boundaries** | **11/11 exact readers** | **11/11 consumers** | **`11/11`** |

反向差集结果：materialization owner 缺失=`0/11`，writer 缺失=`0/11`，reader 缺失=`0/11`，consumer 缺失=`0/11`，重复
writer owner=`0`，generic `write(kind, payload)`/bulk upsert=`0`，writer 分配 truth/reference cursor、audit identity、
operation identity、stored/relay identity或持有 commit manager=`0/11`。8 个 status writer 的 stage 权限仍由 source mutation
owner持有；projection/derived writer 不向 core truth 反写；comparison 不吸收 reconciliation/audit，也不创建第 22 个
mutable group。

### 109.3 19 个 logical mutable root 的反向 reachability audit

本批从 root 反向核对 exact `get/create/save` method 是否都有 application owner、实际 consumer 和 UoW 归属。`readers`
列包含 Query、Job、Consumer、安全 kernel 和 commit-unknown inspector 的已登记使用面；inspector 只读，不构成新的业务
consumer。每一行的 `0` 表示没有 unreachable method，不表示实现已存在。

| # | logical root | unique create owner | exact save owner set | registered read / consumer set | group(s) | result |
|---:|---|---|---|---|---|---:|
| 1 | `ControlledExecutionContext` | `write_intake_context` | cleanup closure / safety kernels | intake、boundary/run/safety、Query source、inspector | `MUT-G01`, `G15` | closed |
| 2 | `ExecutionEnvironmentIdentity` | `write_intake_environment_identity` | cleanup invalidation kernel | intake、boundary/run/cleanup、Query source、inspector | `MUT-G01`, `G15` | closed |
| 3 | `ReferenceResolutionState` | `write_initial_reference_state` | refresh/stale reference kernel | intake、3 reference consumers、refresh Job、Query source、inspector | `MUT-G01`, `G17` | closed |
| 4 | `CoherentBoundary` | `write_boundary_establishment_outcome` | failure/control/cleanup/redline kernels | boundary outcome、run/safety、Query source、inspector | `MUT-G03`, `G05`, `G11`, `G15`, `G16` | closed |
| 5 | `IsolationEnvironmentHandle` | `write_boundary_established_resources` | lifecycle/reaper/cleanup kernels | boundary/run/lifecycle/reaper/cleanup、Query source、inspector | `MUT-G03`, `G15`, `G18` | closed |
| 6 | `ControlledExecutionRun` | `write_run_prepare_recovery` | launch observation/failure/control/redline kernels | launch/capture/safety、Query source、inspector | `MUT-G04`, `G05`, `G11`, `G16` | closed |
| 7 | `CapturedMaterialRef` | `write_capture_material_group` | handoff lifecycle synchronization | capture/handoff/retry、Query source、inspector | `MUT-G06`, `G07`, `G09` | closed |
| 8 | `ObservabilityMaterial` | `write_capture_material_group` | handoff/redline preservation kernel | capture/handoff/redline、Query source、inspector | `MUT-G06`, `G09`, `G16` | closed |
| 9 | `HandoffFact` | `write_handoff_opening` | target attempt/observation/cleanup/redline kernels | opening/consumer/retry/cleanup/redline、Query source、inspector | `MUT-G07`, `G08`, `G09`, `G13`, `G16` | closed |
| 10 | `FailureClassification` | `write_failure_classification` | classify pending/terminal/supersede kernels | failure/control/redline/lifecycle、Query source、inspector | `MUT-G05`, `G09`, `G10`, `G11`, `G12`, `G16` | closed |
| 11 | `ControlFact` | `write_control_fact` | control effect/attach-failure kernel | command/consumer/control Query、inspector | `MUT-G10`, `G11` | closed |
| 12 | `LeaseRecord` | `write_boundary_established_resources` | reaper/lifecycle/guarded release kernels | boundary/run/reaper/lifecycle/cleanup、Query source、inspector | `MUT-G03`, `G14`, `G15`, `G18` | closed |
| 13 | `OrphanRecoveryRecord` | `write_orphan_incident` | reaper/guarded release recovery | reaper/lifecycle/cleanup、inspector | `MUT-G15`, `G18` | closed |
| 14 | `CleanupGuard` | `write_cleanup_guard` | evaluation/release/confirmation/redline kernels | cleanup command/job/lifecycle/redline、Query source、inspector | `MUT-G13`, `G14`, `G15`, `G16` | closed |
| 15 | `RedlineContainment` | `write_redline_detection` | containment/preservation/investigation terminal kernels | redline command/consumer/job、cleanup coverage、Query source、inspector | `MUT-G16` | closed |
| 16 | `SandboxReadProjection` | `write_projection_materialization` | projection stale/rebuild/degraded/unavailable kernel | target reader、Job 8、Query 9、maintenance reader、inspector | `MUT-G20` | closed |
| 17 | `DerivedInspectPreviewTrendState` | `write_derived_materialization` | derived stale/rebuild/failed/unavailable kernel | target reader、Job 9、Query 10、maintenance reader、inspector | `MUT-G21` | closed |
| 18 | `SandboxEventRelayRecord` | `append_finalized_relay` | attempt/delivery/retry/dead-letter/integrity kernels | finalized append、publisher/feedback/recovery、Query audit relation、inspector | owning source group, `MUT-G19` | closed |
| 19 | `SandboxIdempotencyRecord` | `reserve_fresh_operation` | matching complete/fail finalizer | all 29 fresh non-Query callables、duplicate/recovery、inspector | every fresh write group | closed |
| **total** | **19** | **19/19** | **19/19** | **19/19** | **21 groups cover all roots** | **`19/19`** |

反向 root 差集为：root 无 create owner=`0/19`，root 无 save owner=`0/19`，exact get/create/save method unreachable=`0/57`，
独立 `HandoffTargetProgress` root=`0`，generic repository/root key=`0`。`SandboxReadProjection`、derived state 和 relay/
idempotency 的特殊 owner 均能回到已登记 Job/finalizer；没有用 Query 的 `NotFound` 或 maintenance candidate 代替 first proof。

### 109.4 21 个 same-UoW group 的反向覆盖

反向审计逐项检查 `MUT-G01~MUT-G21` 是否仍有 application owner、是否被 42 个 callable 或明确的 recovery kernel 消费，
以及是否有本批 surface 偷新增 group。comparison 的四成员 slice、reconciliation immutable group 和 audit append relation
均按已有 dedicated owner 处理，不新增 `MUT-G22`。

| group | primary owner / recovery point | reverse-covered callable or surface | new group |
|---|---|---|---:|
| `MUT-G01` | intake resolution / accepted context | `open_controlled_execution_context`、execution/reference status writers | 0 |
| `MUT-G02` | boundary pre-call recovery | `establish_execution_boundary` pre-call reservation path | 0 |
| `MUT-G03` | boundary finite outcome | `establish_execution_boundary`、boundary status writer | 0 |
| `MUT-G04` | run launch pre-call recovery | `start_controlled_execution_run` pre-call path | 0 |
| `MUT-G05` | run completion / terminal observation | run start/failure/control/redline paths、execution/failure writers | 0 |
| `MUT-G06` | capture materialization | `record_capture_result`、capture status writer | 0 |
| `MUT-G07` | handoff opening | `open_material_handoff`、handoff status writer | 0 |
| `MUT-G08` | handoff target attempt | `retry_pending_material_handoffs` pre-call path | 0 |
| `MUT-G09` | handoff target observation | handoff retry/consumer、handoff/material writers | 0 |
| `MUT-G10` | control intent/fact | `submit_sandbox_control`、control consumer、failure/control writer | 0 |
| `MUT-G11` | control effect completion | control completion kernel、boundary/run/failure readers | 0 |
| `MUT-G12` | formal failure classification | `classify_sandbox_failure`、failure writer | 0 |
| `MUT-G13` | cleanup readiness evaluation | `evaluate_cleanup_readiness` / `evaluate_pending_cleanup_guards`、cleanup writer | 0 |
| `MUT-G14` | cleanup release pre-call recovery | release pre-call safety kernel、cleanup pointer plan | 0 |
| `MUT-G15` | cleanup release confirmation/failure | lifecycle consumer、release confirmation kernel、cleanup writer | 0 |
| `MUT-G16` | redline detection/containment recovery | `record_redline_containment`、redline consumer/job、cleanup/redline writers | 0 |
| `MUT-G17` | reference initial/refresh/stale | intake/reference consumer/refresh Job、reference status source | 0 |
| `MUT-G18` | lease/orphan reaper evaluation | `run_lease_orphan_reaper`、lifecycle consumer、lease/reaper reader | 0 |
| `MUT-G19` | relay attempt/observation | `publish_sandbox_event_relay`、relay feedback consumer、event relay reader | 0 |
| `MUT-G20` | projection create/rebuild | `rebuild_sandbox_read_projections`、projection writer/reader | 0 |
| `MUT-G21` | derived state create/rebuild | `maintain_derived_inspect_preview_trend`、derived writer/reader | 0 |
| **total** | **21 existing groups** | **21/21 reachable** | **0 new** |

Group 反向结果为：未消费 group=`0/21`，同一 owner 误分叉成重复 group=`0`，writer 新增 group=`0`，Query 进入 write group=`0/13`。
`MUT-G02/G04/G08/G14` 与 external call 的分界仍是两个已提交事务，不把跨 await 的 recovery path误写成一个长事务。

### 109.5 42 个 application callable 的反向 registry join

下表按 callable family 反向确认每个入口都能落到既有 group 或明确的 immutable/dedicated slice；对于 9 个 paged Job，必须再
逐项回指 §109.1 的 exact reader。方法名来自 service facade current registry，不新增同义 alias。

| family | current callable set | maintenance reader use | writer / mutable relation | reverse result |
|---|---|---:|---|---:|
| Command (10) | `open_controlled_execution_context`, `establish_execution_boundary`, `evaluate_policy_execution`, `start_controlled_execution_run`, `record_capture_result`, `open_material_handoff`, `submit_sandbox_control`, `classify_sandbox_failure`, `evaluate_cleanup_readiness`, `record_redline_containment` | `0/10` | existing `MUT-G01~G16` or immutable policy slice；fresh reservation `10/10` | `10/10` |
| Query (13) | `get_sandbox_execution_status`, `get_boundary_status`, `get_policy_decision_summary`, `get_capture_summary`, `get_material_handoff_status`, `get_failure_control_status`, `get_cleanup_readiness`, `get_redline_containment_status`, `get_sandbox_read_projection`, `get_derived_inspect_preview_trend`, `get_backend_capability_comparison`, `get_sandbox_reconciliation_report`, `get_sandbox_audit_trace` | `0/13` | read-only exact snapshot；writer/UoW/identity/cursor/audit/external `0/13` | `13/13` |
| Consumer (9) | `consume_caller_context_reference_changed`, `consume_policy_summary_changed`, `consume_backend_capability_summary_changed`, `consume_isolation_backend_lifecycle_signal`, `consume_material_handoff_status_changed`, `consume_observability_handoff_status_changed`, `consume_sandbox_control_requested`, `consume_investigation_handoff_status_changed`, `consume_sandbox_truth_relay_feedback` | `0/9` | existing `MUT-G09~G19` branch set；fresh reservation `9/9` | `9/9` |
| paged Job (9) | `publish_sandbox_event_relay`, `refresh_sandbox_reference_states`, `refresh_backend_capability_summaries`, `retry_pending_material_handoffs`, `run_lease_orphan_reaper`, `evaluate_pending_cleanup_guards`, `maintain_redline_containment_handoffs`, `rebuild_sandbox_read_projections`, `maintain_derived_inspect_preview_trend` | `9/9` one-to-one | existing `MUT-G13/G16/G17/G18/G19/G20/G21` or immutable capability slice；fresh reservation `9/9` | `9/9` |
| reconciliation Job (1) | `run_sandbox_reconciliation` | `0/1` | dedicated immutable report/finding/current group；fresh reservation `1/1` | `1/1` |
| **total** | **42/42** | **exactly 9 reader bindings** | **29/29 fresh non-Query reservation** | **`42/42`** |

Callable 反向差集为：无 owner/callable=`0/42`，duplicate method alias=`0`，generic `run_job` positive dispatch=`0`，Query
writer=`0/13`，reconciliation 误接 paged reader=`0/1`，paged Job 缺 exact reader=`0/9`，新增 public callable=`0`。这只是设计
registry join；不代表任何 callable 已编译或执行。

### 109.6 Forbidden set 与跨边界差集

| audited forbidden surface | static result | ruling |
|---|---:|---|
| reader 无 owner / writer 无 source / surface 无 consumer | `0/9`, `0/11`, `0/11` | 不允许 orphan surface；缺口必须回到对应 owner，不以 generic fallback 补齐 |
| duplicate reader alias / duplicate writer owner | `0 / 0` | legacy/latest/list reader不成为 current path；同一 surface不保留第二 writer |
| Query 调用 maintenance reader / writer / repair | `0/13` | Query 只使用 exact public Query reader；maintenance index 只服务 paged Job |
| maintenance reader 写 truth、Version、audit、identity、external | `0/9` | reader 只产 candidate；action/reload归 Job owner |
| generic writer / generic repository / bulk upsert / latest winner | `0` | 具名 writer、具名 root、exact CAS 和 closed selector保持不变 |
| new mutable root / new same-UoW group / `MUT-G22` | `0 / 0 / 0` | comparison 使用 dedicated application-private slice；不扩 domain registry |
| new public callable / DTO / status / stored kind | `0 / 0 / 0 / 0` | 42/42 与既有 protocol boundary保持不变 |
| tools semantic execution / runtime agent loop / member lifecycle orchestration | `0` | 继续留在 sandbox 边界之外 |
| fake-only reverse map / permissive default / reader repair | `0` | durable/fake 只共享设计 obligation；实际 conformance仍待执行 |

本批没有发现新的设计静态 L1/L2 blocker，但这不等于关闭既有 blocker：`SBX-DDD-GRANULARITY-STEP7-READ-001` 仍需 A4-P3
正式裁决并同步恢复源；`SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` 和 `BLK-SBX-CANONICAL-001` 保持原状态。所有计数均为
design-only，未产生实现 commit、run_id、evidence alias、测试结果或验收签署。

### 109.7 A4-P2 完成门与下一停点

| check | result |
|---|---:|
| 9 maintenance reader -> unique paged Job | `9/9` |
| reader orphan / duplicate / Query use / reconciliation use | `0/9` / `0` / `0/13` / `0/1` |
| 11 materialization source-owner-writer-reader-consumer | `11/11` |
| materialization writer same-UoW/source identity/commit ownership | `11/11` design-only |
| mutable logical root reverse reachability | `19/19`；exact repository method orphan `0/57` |
| same-UoW group reverse reachability | `21/21`；new group `0` |
| application callable reverse registry | `42/42`；new callable `0` |
| forbidden/generic/Query-write difference | `0` positive forbidden surface |
| new L1/L2 blocker | `0` |
| `SBX-DDD-GRANULARITY-STEP7-READ-001` | `open_wait_A4-P3_ruling` |
| formal `03-详细设计.md` writeback | forbidden |

A4-P2 至此完成。下一项是 A4-P3：在用户复核后裁决 `READ-001`，把 P1/P2 的正向与反向结果同步到 flow、项目台账、
implementation ledger 和 control artifact；在复核前不进入 P3 内容、不回填正式 `03`、不进入 Step 8。

## EOF Current Recovery Override: `7R-04A-A4-P2` completed, user review pending

本节位于 read artifact 物理 EOF，是 A4-P2 完成后的 current authority。它只记录反向设计审计结果，不代表实现、编译、测试、
provider、run、evidence、验收或 commit 已存在。

```text
current_plan_version = v7.3-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A4-P2 reverse maintenance/materialization/global registry audit completed_wait_user_review
current_internal_task = A4-P3 READ-001 ruling and recovery-source synchronization
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_completed_wait_user_review
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = completed
a4_p3_read_blocker_ruling_and_sync = pending_user_review
query_positive_owner_source_reader_consumer = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
query_writer_use = 0/13
existing_maintenance_reader = 9/9_preserved
maintenance_reader_job_consumer = 9/9
maintenance_reader_orphan = 0
maintenance_reader_duplicate = 0
maintenance_reader_reconciliation_use = 0/1
materialization_source_consumer_closure = 11/11
materialization_writer_duplicate_owner = 0
mutable_logical_roots = 19/19
repository_method_reachability = 57/57
same_uow_groups = 21/21
new_same_uow_group = 0
public_callable_count = 42/42_unchanged
new_public_callable = 0
new_public_status_or_stored_kind = 0
new_l1_l2_blocker = 0
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_109|step7_control_current|step7_flow_current|project_ledger_current|implementation_ledger_current|reopen_plan_current
next_allowed_action = wait_user_review_before_A4_P3
```

## 110. `7R-04A-A4-P3` `READ-001` blocker ruling and recovery synchronization

本批消费 A4-P1 的 Query 正向审计和 A4-P2 的 maintenance/materialization/global registry 反向审计，回答
`SBX-DDD-GRANULARITY-STEP7-READ-001` 的关闭条件。A4-P3 只裁决设计文本是否已经达到 exact read / maintenance
的可落码闭环，不执行实现、编译、provider、fake/durable conformance、测试、run、evidence 或验收。正式
`03-详细设计.md` 继续冻结，后续只能由正式重装配步骤消费本批回填草稿。

### 110.1 A4-P3 状态、输入与范围

| item | current conclusion |
|---|---|
| current document / step | `03-详细设计.md` / Step 7 regression / `7R-04A` |
| consumed upstream artifacts | 本文件 §108、§109；`03_ddd_step_07_trait_port_adapter_contracts_regression_control.md` A4-P1/P2 current；`03_ddd_step_07_repositories_uow_indexes.md` current root/UoW registry；`03_ddd_step_07_idempotency_stored_index_repositories.md` maintenance reader registry；service facade current callable map |
| blocker under ruling | `SBX-DDD-GRANULARITY-STEP7-READ-001` |
| in-scope closure | exact Query selector/source/reader/consumer；9 个 maintenance reader 的唯一 Job owner；11 个 materialization surface 的 source/writer/reader/consumer；reverse root/UoW/callable reachability；Query zero-write 和 forbidden set |
| out-of-scope | runtime adapter behavior、durable/fake parity execution、provider availability、database/index migration、性能、测试结果、evidence、验收和实现 commit |
| formal document | `03-详细设计.md` 未修改 |

### 110.2 SOP 问题回答

| SOP question | answer | source |
|---|---|---|
| 每个 public Query 是否有唯一 selector、source、reader 和 consumer？ | 是。13/13 Query 均有 named owner/source/exact reader/consumer；字段层 104/104 已逐字段回指来源。 | §108.1~§108.4 |
| Query 是否会借用 maintenance reader、writer、repair 或 external adapter？ | 否。Query writer use=`0/13`；Query 到 maintenance reader、writer、repair、external 的正向差集均为 `0`。 | §108.5、§109.6 |
| 每个 paged maintenance reader 是否有唯一 action owner？ | 是。9/9 reader 由 9/9 paged Job 一对一消费；reader 只返回 bounded candidate，不持有 action、CAS、truth cursor 或 external call。 | §109.1 |
| materialization 是否有 source、writer、reader 和 consumer 闭环？ | 是。11/11 surface 均有既有 source owner、具名 writer、exact reader 和 direct/downstream consumer；没有 generic writer 或 bulk upsert。 | §109.2 |
| reverse 方向是否能从 root、UoW group 和 callable 回到 owner？ | 是。19/19 mutable root、57/57 exact repository method、21/21 same-UoW group 和 42/42 application callable 均可回到既有 owner。 | §109.3~§109.5 |
| 是否新增了 public surface 或跨边界语义？ | 否。new callable/status/stored kind/DTO/root/group 均为 `0`；tools semantic execution、runtime agent loop、member lifecycle orchestration 不进入 Sandbox。 | §109.6 |

### 110.3 当前问题诊断与改动前后对比

| dimension | before A4-P3 | A4-P1/P2 evidence | current diagnosis |
|---|---|---|---|
| Query exact read | blocker 只登记 selector/index/bundle/body-free 要求，缺少全量反向证明 | `13/13` Query chain；`104/104` field closure；`0/13` writer use | 设计侧 exact read 条件已闭合 |
| maintenance ownership | reader 与 Job 的一对一关系未在总审计中裁决 | `9/9` unique reader-to-Job；orphan=`0`；duplicate=`0`；Query use=`0/13` | 设计侧 maintenance owner 闭合 |
| materialization write boundary | 11 个 surface 已有局部 writer，但缺 global reverse reachability | source/writer/reader/consumer=`11/11`；new group=`0`；generic writer=`0` | 设计侧 whole-group writer 边界闭合 |
| reverse registry | root、UoW、callable 可能存在未消费或重复分支 | roots=`19/19`；methods=`57/57`；groups=`21/21`；callables=`42/42` | 未发现 orphan 或 duplicate surface |
| blocker status | `open_wait_A4-P3_ruling` | 正向与反向差集均为设计闭合 | 可裁决为 `resolved_in_7r_04a`，但只限 design-static closure |

### 110.4 `READ-001` 证据矩阵

| closure criterion | observed design result | closure interpretation | runtime remainder |
|---|---:|---|---|
| Query owner/source/exact reader/consumer | `13/13` | 每个 Query 有唯一 current chain | 需由实现和 contract tests 证明真实调用路径 |
| Query response field source | `104/104` | response 字段不能由 ref 文本、latest winner 或 adapter diagnostic 推导 | 需执行 durable/fake field equality checks |
| Query writer/external/repair | `0/13` positive use | Query 维持 read-only；没有隐藏 repair | 需在代码审查和运行 failpoint 中确认 |
| maintenance reader owner mapping | `9/9` one-to-one Job | reader 不成为第二业务入口 | 需执行 bounded page / cursor / empty proof tests |
| maintenance reader orphan/duplicate | orphan=`0`；duplicate=`0` | 没有无消费者 reader 或多个 action owner | 需验证真实 registry 装配 |
| materialization source-owner-writer-reader-consumer | `11/11` | writer 只接收既有 source candidate，并由 whole-group owner 提交 | 需验证 UoW/CAS/commit-unknown 行为 |
| mutable root reachability | `19/19`；exact method=`57/57` | 没有 generic repository/root key 替代 named root | 需验证 durable/fake repository parity |
| same-UoW group reachability | `21/21`；new group=`0` | 没有隐式长事务或 `MUT-G22` | 需执行 rollback/unknown inspection checks |
| application callable reverse registry | `42/42` | 没有未注册 callable 或 alias dispatch | 需验证 API/Worker/Jobs entry mapping |
| forbidden cross-boundary set | positive forbidden=`0` | 不把 tools/runtime/member 语义并入 Sandbox | 需在 implementation boundary review 中复核 |

上述结果全部是 design-only count。`13/13`、`104/104`、`9/9`、`11/11`、`19/19`、`57/57`、`21/21` 和
`42/42` 不表示任何 Rust 编译、测试、运行或 provider 事实。

### 110.5 设计取舍与 blocker 裁决

1. `READ-001` 的原始定义要求 exact selector、exact reader、index/bundle key、body-free input、whole-group
   writer、Query zero-write 和反向 owner/consumer 闭合。A4-P1/P2 已分别提供正向和反向证据，因此不再为了
   “证明已关闭”新增 Query、reader、repository、root、UoW group、status 或 stored kind。
2. maintenance reader 保持 L2 bounded candidate surface；action、reload、CAS、Version 和 external call 仍由
   唯一 paged Job owner 承接。这样不会把异常重试、审计或运维选择面升级为新的主体业务入口。
3. materialization writer 继续是 application-private named writer，source mutation owner 保有 truth、identity、
   cursor、audit 和 commit authority。Query 不调用 writer，也不负责 projection repair。
4. reverse audit 只证明设计注册表的可达性，不把 fake-only map、permissive default、latest winner 或 reader repair
   引入 current path；实现阶段若发现任一差异，应重新打开本 blocker，而不是以 fallback 补齐。

**裁决：** `SBX-DDD-GRANULARITY-STEP7-READ-001 = resolved_in_7r_04a`。该状态的完整含义是“Step 7 read/
maintenance 设计静态缺口已由 A4-P1/P2 覆盖，并完成 A4-P3 current ruling”；它不是 `resolved_for_runtime`、
`provider_conformant`、`tests_passed`、`accepted` 或 `implementation_ready`。

### 110.6 残余验证边界与未关闭 blocker

| item | current status | reason / next owner |
|---|---|---|
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | `open_wait_s7_03c_s7_05` | capture/handoff/publisher 与 infra/durable/fake outcome parity 尚未完成；由既有 `7R-03C` / `7R-05` owner 继续处理。 |
| `BLK-SBX-CANONICAL-001` | open implementation gate | canonical writer/verifier、algorithm、edition 和 exact revision 尚未由实现阶段固定；静态 read closure 不改变该 gate。 |
| durable/fake/provider conformance | not_started | 本批只审计 obligation 和 registry；没有执行 adapter 或 fake。 |
| compile/test/run/evidence/acceptance | not_started / not_entered | 没有真实命令结果、run_id、evidence alias 或验收签署。 |
| formal `03` writeback | forbidden | 必须等待 Step 7 总体 closure 和后续正式重装配门。 |

### 110.7 正式回填草稿（不写入正式 `03`）

后续正式 `03` 重装配时，read/maintenance 相关章节应只从本节及 §108~§109 消费以下结论：

| formal assembly topic | writeback rule | source anchor |
|---|---|---|
| 13 个 Query exact read | 逐 Query 写出 selector、committed snapshot、exact source/read method、consumer 和 zero-write boundary；不得改成 generic `get(kind, key)`。 | §108.1~§108.5、§110.4 |
| 9 个 maintenance reader | 写出 bounded candidate、唯一 paged Job、action 前 exact reload、empty/gap 处理；不得让 Query 或 reconciliation 复用。 | §109.1、§110.2 |
| 11 个 materialization surface | 写出 source owner、具名 whole-group writer、exact reader、consumer 和同 UoW 关系；不得增加 `MUT-G22`。 | §109.2、§109.3 |
| negative boundary | 写出 Query no-write、no-repair、no-external、no-latest-winner、no-generic repository 和 Sandbox scope redlines。 | §109.6、§110.5 |
| status / blocker language | 使用 `resolved_in_7r_04a` 的 design-static 限定；不得写成测试、provider、验收或实现通过。 | §110.5~§110.6 |

### 110.8 待确认事项与 A4-P3 完成门

待用户复核的事项只有两项：

1. 是否接受 `READ-001` 的 design-static resolution，而不把它误写为 runtime conformance；
2. 是否保持 `OUTCOME-001`、`BLK-SBX-CANONICAL-001`、正式 `03` 冻结和 implementation `blocked / wait_design`。

| gate check | result |
|---|---:|
| SOP 问题回答、诊断、取舍和结构化证据 | complete |
| Query positive and reverse closure | `13/13`、`104/104`、`0/13` writer use |
| maintenance reader closure | `9/9` unique Job；orphan/duplicate=`0/0` |
| materialization/root/UoW/callable reverse closure | `11/11`、`19/19`、`57/57`、`21/21`、`42/42` |
| new design L1/L2 blocker | `0` |
| `READ-001` ruling | `resolved_in_7r_04a` design-only |
| residual Step 7 blocker | `OUTCOME-001` remains open |
| formal `03` writeback | forbidden |
| next formal document / Step 8 | blocked |

本批内容完成后停在用户复核门；未获下一次明确确认前，不启动 `7R-05`、`7R-07`、Step 8、正式 `03` 重装配或实现仓。

## EOF Current Recovery Override: `7R-04A-A4-P3` completed, user review pending

本节位于 read artifact 物理 EOF，是 A4-P3 的 current authority。前文 `READ-001=open` 的段落均为历史执行快照；恢复时以
本节为准。它只表示设计静态裁决完成，不表示运行、测试、provider、evidence、验收或 commit 已发生。

```text
current_plan_version = v7.4-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A4-P3 READ-001 ruling and recovery-source synchronization completed_wait_user_review
current_internal_task = none; wait user review before next Step 7 owner
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_completed_wait_user_review
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = completed
a4_p3_read_blocker_ruling_and_sync = completed_wait_user_review
query_positive_owner_source_reader_consumer = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
query_writer_use = 0/13
existing_maintenance_reader = 9/9_preserved
maintenance_reader_job_consumer = 9/9
maintenance_reader_orphan = 0
maintenance_reader_duplicate = 0
maintenance_reader_reconciliation_use = 0/1
materialization_source_consumer_closure = 11/11
materialization_writer_duplicate_owner = 0
mutable_logical_roots = 19/19
repository_method_reachability = 57/57
same_uow_groups = 21/21
new_same_uow_group = 0
public_callable_count = 42/42_unchanged
new_public_callable = 0
new_public_status_or_stored_kind = 0
new_l1_l2_blocker = 0
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001|SBX-DDD-GRANULARITY-STEP7-READ-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
read_blocker_status = resolved_in_7r_04a_design_static_only
existing_implementation_gate = BLK-SBX-CANONICAL-001
step_7_total_gate = blocked_by_existing_owner_blockers
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = step7_outcome_current|step7_control_current|step7_cross_audit_current|project_execution_ledger_current|implementation_ledger_current|reopen_plan_current
next_allowed_action = wait_user_review_before_next_step7_owner
```

## EOF Current Review Consumption Override: `7R-04A-A4-P3` review consumed by `7R-05-B1`

用户本次确认已消费 A4-P3 复核门并选择唯一后续 owner `7R-05`。A4-P3 的 design-static ruling 不变；本节只修正“user review pending”的恢复状态，不扩大 read closure 的证明范围。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
completed_owner = 7R-04A exact read and maintenance surface review_consumed
read_blocker_status = resolved_in_7r_04a_design_static_only
current_owner = 7R-05 infra adapter / fake parity
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
