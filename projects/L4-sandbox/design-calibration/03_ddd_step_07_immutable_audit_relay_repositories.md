# Step 7 S7-02C Immutable / Audit / Relay Repository 中间产物

> 本文件是 03-详细设计.md 的 Step 7 中间产物，不是正式详细设计正文。
> 当前批次只校准 immutable snapshot/fact、append-only audit、event relay payload/attempt/pending/retry
> 的 application-owned persistence contract。它不生成实现代码、migration、compile/test/run/evidence、验收或 commit 事实。

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| target | L4-sandbox |
| current document | 03-详细设计.md |
| current step | Step 7 regression / 7R-02C |
| current task | S7-02C immutable / audit / relay repository |
| batch status | in_progress |
| required stop | 完成本批静态设计与恢复源同步后，停在 completed_wait_user_review |
| next batch | S7-02D idempotency / stored result / necessary index |
| formal document write | 0；本批不修改正式 03~07 |
| implementation | CB-SBX-01A blocked / wait_design |
| commit | 不需要；未经用户明确要求不得提交 |

本批启动依据是用户已确认消费 S7-02B 的审查门。S7-02B 的 current overlay 位于各恢复源物理末尾；
本文件不重新解释旧段落中的 7R-02B in_progress。本批开始前已读取项目台账、calibration flow、Step 7
control、repository、facade、implementation ledger、Step 6 五份 canonical source、详细设计 SOP 与书写规范。

## 2. 输入效力与边界

### 2.1 Current 输入

| 输入 | 效力 | 本批消费方式 |
|---|---|---|
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts_context_boundary.md | current canonical | 消费 ContextReferenceResolution、ExecutionContextResolution、BackendCapabilitySummary、BoundaryEstablishmentDecision 的 immutable identity、source relation、factory/status不变量。 |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts_policy_run_capture.md | current canonical | 消费 PolicyApplicabilitySnapshot、PolicyExecutionDecision、HighRiskActionDecision、CaptureFact 的 immutable replacement 与 audit linkage。 |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts_failure_cleanup_read.md | current canonical | 消费 SandboxAuditTrace、SandboxReconciliationReport 与 capture / reconciliation 的 body-free、cursor、finding-relay约束。 |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts_application_infra_entry.md | current canonical | 消费 SandboxStoredOperationResult、AdapterAvailabilityState、SandboxRuntimeConfigSummary、relay attempt carrier和publisher outcome的归属。 |
| projects/L4-sandbox/design-calibration/03_ddd_step_06_object_contracts_shared_types.md | current canonical | 消费 named ref、Version、Timestamp、SandboxSourceFactRef、SandboxTraceSubjectRef、SandboxRelayAttemptRef等 shared type。 |
| projects/L4-sandbox/design-calibration/03_ddd_step_07_repositories_uow_indexes.md §26 | current mutable overlay | 复用 SandboxUnitOfWork、Versioned<T>、SandboxTruthCursor / SandboxReferenceCursor、已有 relay root与 19 个 mutable repository 的 method形态。 |
| projects/L4-sandbox/design-calibration/03_ddd_step_07_service_facades_inputs_outputs.md §52 | current mutable activation | 复用 42 个 current callable 的 owner reachability；本批只在 relay/capture callable确有新增 repository method时补最小 overlay。 |
| projects/L4-sandbox/design-calibration/03_ddd_step_07_trait_port_adapter_contracts_regression_control.md §20 | current control overlay | 复用 L1/L2/L3 分级、Step 7 blocker和停审纪律。 |

### 2.2 Historical material 处理

旧正式 03-详细设计.md、旧 Step 7 trait/repository段落、以及 Step 6 中被标记为 historical 的 broad
outbox / generic result / generic audit草案均只用于差异审计。若旧材料与 current canonical source冲突，
本批记录为 historical_material 或 conflict，不沿用旧签名，不用兼容 alias掩盖差异。

### 2.3 本批 L1/L2/L3 分级

| surface | 等级 | 粒度决定 |
|---|---|---|
| immutable context/boundary/policy/capture facts | L1 | exact get、create、replacement identity、source relation、Version/UoW、failure和commit-unknown必须可落码。 |
| SandboxAuditTrace append | L1 | audit append不能改变主体truth；source/cursor/correlation/body-free约束必须精确。 |
| relay frozen payload、attempt-before-call、pending/retry/dead-letter | L1 | relay丢失或publisher unknown会影响传播与安全记录，需 exact transition、attempt identity和no-rollback。 |
| 普通审计诊断失败、非安全观察 hook | L2 | 只定义 owner、最小输入/输出、失败隔离和升级条件，不展开物理存储或逐错误矩阵。 |
| fake/durable parity、静态检查、回填与停审 | L2/L3 | 给出可验证维度和 Gate，不伪造运行结果。 |

## 3. SOP 问题回答

| SOP问题 | 本批回答 |
|---|---|
| 本步输出是什么 | 13 个 immutable owner的持久化适用性矩阵、exact repository trait、audit append contract、relay payload/attempt/pending/retry contract、UoW/Version/cursor/visibility规则、application owner reachability、failure/recovery与fake/durable parity。 |
| 哪些对象是 immutable replacement | 13 个 owner中，除两个 infra-local summary外，每次新 observation/decision/fact都创建新的 named ref；旧row不可更新、删除或被 latest 覆盖。SandboxStoredOperationResult只在本批登记读取/append关联，完整 reservation/complete/fail在 S7-02D。 |
| audit 是否是主体功能 | SandboxAuditTrace是Sandbox安全真相的 append-only linkage，服务审计与关联，不替代 context、boundary、policy、run、capture、cleanup或redline truth。普通 diagnostic audit按L2处理，失败不得回滚已提交主体truth。 |
| relay 是否是第二 truth root | 否。SandboxEventRelayRecord是已存在的唯一 relay mutable root；本批只补冻结 payload、attempt和selection/observation surface，不新增第二个 relay repository或event truth root。 |
| replacement如何避免误更新 | repository只接受 exact named ref；application在 fresh UoW中读取 source Version，生成新 immutable ref并 create_*。替换关系通过 explicit replaces_ref / source relation或current binding表达，不提供 save_*给 immutable owner。 |
| Query能否触发上述写入 | 不能。13 Query的 identity allocation、UoW写入、audit append、relay create/attempt均固定为0；缺行只能返回 typed absence/degraded/integrity。 |
| 两个 infra-local对象是否要建库 | 当前不能。AdapterAvailabilityState与SandboxRuntimeConfigSummary是 runtime builder replacement/local summary，不在 named object registry，Step 6没有其 durable ref；本批登记为 negative inventory和待确认项，不擅自增库。 |

## 4. Historical 诊断与改动前后

### 4.1 诊断登记

| ID | historical问题 | 当前裁决 |
|---|---|---|
| S7-02C-H01 | 旧 trait把所有 immutable snapshot与mutable truth混在同一 get/create/save 模板。 | immutable owner只保留 exact get + create/append；不存在 generic save。mutable save仍由 S7-02B管理。 |
| S7-02C-H02 | 旧 audit表述允许 post-commit补写或携带 raw diagnostic/body。 | audit必须在 source truth允许的同一UoW中 append，或在明确的 post-commit diagnostic scope中独立 append；不影响主体truth，不保存正文。安全关键 audit缺失进入 typed integrity/recovery。 |
| S7-02C-H03 | 旧 relay worker可按 status scan并从 current truth重建 payload。 | pending selection由 typed selector与 bounded cursor返回；payload在 finalized draft时冻结，publisher只消费 persisted payload。 |
| S7-02C-H04 | 旧 attempt可用 relay ref + ordinal临时拼出，或外呼后才保存。 | SandboxRelayAttemptRef由 UoW allocator预生成；attempt-before-call先提交，外呼后只对 matching attempt做 CAS observation。 |
| S7-02C-H05 | AdapterAvailabilityState / SandboxRuntimeConfigSummary被误读成13 owner中的 durable object。 | 保持 infra-local；没有 typed durable ref、repository或长期Version。需要持久化时必须重开 Step 6/登记 blocker。 |
| S7-02C-H06 | SandboxStoredOperationResult的 replay/index与 immutable carrier边界不清。 | 本批只闭合 immutable carrier读取、source/correlation和与 relay/audit的关系；reserve/complete/fail、typed surface store与必要index留 S7-02D。 |

### 4.2 改动前后对比

| 维度 | 改动前 | S7-02C current |
|---|---|---|
| immutable persistence | broad repository可推断为 mutable save | exact named ref + get_with_version读取；new observation用 create_*，旧row immutable |
| audit | append语义、source和失败隔离不完整 | body-free、source fact、subject、correlation、cursor、same-UoW和独立失败路由闭合 |
| relay payload | publisher可从truth重建 | finalized draft一次冻结 payload identity/schema/target/generation/retry policy，后续只读 frozen snapshot |
| relay attempt | 外呼后才有attempt或临时分配 | begin_attempt先在同一 relay root上CAS并提交，外呼只携带 persisted attempt |
| pending/retry | status字符串或全表扫描 | typed selection、closed scope、cursor、not-before、active-attempt排他和bounded page |
| infra summary | 可能被列成 durable repository | 明确 local replacement，无 durable owner；启动快照由 runtime builder持有 |
| fake parity | map可直接暴露结果 | fake必须模拟commit visibility、CAS、attempt-before-call、payload immutability和unknown三分，不伪造成功 |

## 5. 设计取舍与不变式

1. Immutable replacement优先于 update。新的 resolver observation、capability verdict、policy decision、capture fact或 reconciliation report必须有新的 named identity；旧记录用于审计、replay和关系追踪。
2. Audit不是万能日志。SandboxAuditTrace只保存已成立的 Sandbox source fact linkage；raw body、secret、provider response、stack和诊断正文不进入 domain/application repository。
3. Relay payload冻结在 source accepted之后。publisher失败、retry或feedback不能改变 source truth，也不能重建或替换已冻结 payload。
4. Attempt是持久化恢复点。任何可能产生外部发布副作用的调用都必须先持久化 attempt；commit unknown只能 inspect exact relay/attempt relation，不能盲目重试。
5. 安全关键 append失败 fail closed。required audit、required relay或finding relay缺失时，调用方不得把主体group报告为完整成功；普通非安全诊断hook失败只隔离并升级为L2 issue。
6. 不以数量代替关系。13/13、1/1等计数只用于静态审计，不能在运行时证明 source、payload、attempt或stored relation完整。

## 6. 13 个 immutable owner 适用性矩阵

| # | canonical owner | named ref | persistence形态 | exact operation | source / replacement relation | audit / relay relation | owner / level |
|---:|---|---|---|---|---|---|---|
| 1 | ExecutionContextResolution | ExecutionContextResolutionRef | immutable snapshot | get_with_version + create；无 save | reference_resolution_ref、required kinds、evaluation time；新解析新 ref | accepted/rejected intake可带 audit；不直接生成 relay | open_controlled_execution_context / L1 |
| 2 | ContextReferenceResolution | ContextReferenceResolutionRef | immutable external-reference snapshot | get_with_version + create；无 save | owning context_ref、source refs、safe summaries、body markers；refresh新 ref | source observation可审计；不得保存外部正文 | resolver/intake kernel / L1 |
| 3 | BoundaryEstablishmentDecision | BoundaryEstablishmentDecisionRef | immutable decision | get_with_version + create；无 save | exact context、requirement、capability、generation和decision outcome；retry新 decision ref | establishment audit；required safety event由source draft决定 | establish_execution_boundary / L1 |
| 4 | BackendCapabilitySummary | BackendCapabilitySummaryRef | immutable capability snapshot | get_with_version + create；无 save | backend source、requirement ref、generation、10项 verdict和freshness；refresh replacement | capability observation可审计；不自行relay | capability resolver / L1 |
| 5 | PolicyApplicabilitySnapshot | PolicyApplicabilitySnapshotRef | immutable policy snapshot | get_with_version + create；无 save | source/authorization/marker set、boundary lineage、evaluated time；新评估新 ref | policy audit required；event由finalized source group决定 | policy evaluation / L1 |
| 6 | PolicyExecutionDecision | PolicyExecutionDecisionRef | immutable aggregate decision | get_with_version + create；无 save | snapshot、guards、action decision set、launch window；replacement不覆盖旧accepted | non-accepted safety audit；required relay按 event kind | evaluate_policy_execution / L1 |
| 7 | HighRiskActionDecision | HighRiskActionDecisionRef | immutable per-marker decision | get_with_version + create；无 save | aggregate policy ref + marker key 1:1；重评估新 action ref | blocked/observed action必须关联 audit；redline路径另有truth owner | policy kernel / L1 |
| 8 | CaptureFact | CaptureFactRef | immutable capture fact | get_with_version + create；无 save | terminal run/capture snapshot、composite material rows、observability relation；replacement新 fact | capture accepted/partial/failed audit；required material relay由 draft gate | record_capture_result / L1 |
| 9 | SandboxReconciliationReport | SandboxReconciliationReportRef | immutable report + finding set | get_with_version + create；无 save | exact scope、same-snapshot source、five-channel coverage、finding refs；重跑新 report ref | finding必须有 required relay pair；report body-free | reconciliation Job / L1 |
| 10 | SandboxAuditTrace | SandboxAuditTraceRef | append-only immutable record | get_with_version + append；无 save/delete | source fact、subject、correlation、committed cursor；correction追加新 record | audit本身不改source；required audit failure按安全等级路由 | source group / L1 |
| 11 | SandboxStoredOperationResult | SandboxStoredOperationResultRef | immutable replay carrier | get_with_version + create；completion linkage由 S7-02D | operation、result kind、surface ref、recorded time；replacement新 surface | audit/relay只保存 relation；完整 replay/index留 S7-02D | idempotency kernel / L1 |
| 12 | AdapterAvailabilityState | 无 named ref | infra-local runtime replacement | durable repository 0；builder内读取/replace | adapter binding + availability coverage；不形成长期 domain source | startup diagnostics可记录；不得作为业务 audit source | runtime builder / L2 |
| 13 | SandboxRuntimeConfigSummary | 无 named ref | infra-local sanitized summary | durable repository 0；builder内读取/replace | validated config/profile identity + redacted binding marker；full config由 infra snapshot拥有 | startup diagnostics可记录；不生成业务 relay | runtime builder / L2 |

### 6.1 13-owner计数裁决

本矩阵的 13/13 是 owner coverage，不等于 13/13 durable repository。其中 11 个 named immutable/audit/replay
owner进入本批 exact persistence surface；两个 infra-local owner明确不适用 durable repository。若后续输入要求
所有 13 项均具 durable identity，必须登记新的 S7-02C-BLK-01 并回到 Step 6，而不能在本批临时添加 ref或表。

## 7. Immutable repository exact contract

### 7.1 共同方法语义

immutable repository 不拥有 domain factory、replacement decision 或 current binding。每个 trait 只接受本 owner 的
named ref，不接受 `SandboxObjectRef`、`ResourceRef`、字符串或由 cursor 拼出的 key。`get_with_version` 返回同一
committed snapshot 上读取的对象和 core `Version`；该 `Version` 用于 source relation / snapshot proof，不代表该对象
可以被更新。`create` 只执行 insert-if-absent stage，目标 key 已存在时返回 `AlreadyExists`，不得转为替换或覆盖。

```rust
/// immutable repository 对一条已提交快照的读取结果；Version 只表示读取代次。
pub type ImmutableSnapshot<T> = Versioned<T>;

/// immutable repository 的 application-owned 共享失败类别；具体 trait 必须使用自己的错误名。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ImmutableRepositoryFailure {
    /// exact named ref 对应的 committed row 不存在。
    NotFound,
    /// insert-if-absent 发现同一 named ref 已有 row。
    AlreadyExists,
    /// durable / fake store 或其事务句柄暂时不可用。
    Unavailable,
    /// row、typed key、source relation、Version 或 schema 校验失败。
    IntegrityViolation,
}
```

上面的类别只用于说明共同语义，不是可被调用方直接依赖的泛型 repository error。每个具体 trait 必须拥有自己的
`*RepositoryError`，并穷尽映射这四类；不得以 `Box<dyn Error>`、raw codec error、SQL state、path、provider response
或 `to_string()` 作为公开字段。stage 方法本身不吞掉 `SandboxUnitOfWork::commit` 的三分结果：`NotCommitted` 和
`StatusUnknown` 仍由既有 UoW contract 返回。`StatusUnknown` 绝不映射为 `NotFound` 或 `AlreadyExists`。

所有 immutable `get` 与 `create` 都接收当前事务的 `&mut dyn SandboxUnitOfWork`，以保证 source binding、audit、relay
和同组 stored relation使用同一个 snapshot。查询调用方即使复用该 trait，也必须使用只读 access path；不得在读取时
调用 identity allocator、truth cursor allocator、`create` 或任何 external port。

### 7.2 Named trait 与 exact method matrix

以下九个 trait 是九个 immutable domain owner 的唯一 application port owner。每个 trait 的 durable 与 deterministic
fake 实现都必须保留相同的 typed key、缺失、重复和完整性语义。

```rust
/// 持久化一次 execution context resolution 的不可变结果。
pub trait ExecutionContextResolutionRepository: Send + Sync {
    /// 按 exact resolution ref 读取同一 committed snapshot 与 Version。
    async fn get_execution_context_resolution_with_version(
        &self,
        resolution_ref: &ExecutionContextResolutionRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<ExecutionContextResolution>, ExecutionContextResolutionRepositoryError>;

    /// 在当前 source UoW 中 insert-if-absent 一条已完成校验的 resolution。
    async fn create_execution_context_resolution(
        &self,
        resolution: &ExecutionContextResolution,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ExecutionContextResolutionRepositoryError>;
}

/// 持久化一次 external reference resolution 的不可变 body-free 快照。
pub trait ContextReferenceResolutionRepository: Send + Sync {
    /// 按 exact reference-resolution ref 读取快照与 Version。
    async fn get_context_reference_resolution_with_version(
        &self,
        resolution_ref: &ContextReferenceResolutionRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<ContextReferenceResolution>, ContextReferenceResolutionRepositoryError>;

    /// 在当前 intake / refresh UoW 中追加新的 resolution snapshot。
    async fn create_context_reference_resolution(
        &self,
        resolution: &ContextReferenceResolution,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), ContextReferenceResolutionRepositoryError>;
}

/// 持久化一次 boundary establishment decision 的不可变结果。
pub trait BoundaryEstablishmentDecisionRepository: Send + Sync {
    /// 按 exact decision ref 读取 decision 与同代 Version。
    async fn get_boundary_establishment_decision_with_version(
        &self,
        decision_ref: &BoundaryEstablishmentDecisionRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<BoundaryEstablishmentDecision>, BoundaryEstablishmentDecisionRepositoryError>;

    /// 追加新的 boundary decision；不得覆盖旧 accepted / rejected decision。
    async fn create_boundary_establishment_decision(
        &self,
        decision: &BoundaryEstablishmentDecision,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), BoundaryEstablishmentDecisionRepositoryError>;
}

/// 持久化一次 backend capability evaluation 的不可变摘要。
pub trait BackendCapabilitySummaryRepository: Send + Sync {
    /// 按 exact capability summary ref 读取 body-free snapshot 与 Version。
    async fn get_backend_capability_summary_with_version(
        &self,
        summary_ref: &BackendCapabilitySummaryRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<BackendCapabilitySummary>, BackendCapabilitySummaryRepositoryError>;

    /// 追加新的 capability observation；refresh 不更新既有 summary row。
    async fn create_backend_capability_summary(
        &self,
        summary: &BackendCapabilitySummary,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), BackendCapabilitySummaryRepositoryError>;
}

/// 持久化一次 policy applicability evaluation 的不可变快照。
pub trait PolicyApplicabilitySnapshotRepository: Send + Sync {
    /// 按 exact applicability ref 读取 snapshot 与 Version。
    async fn get_policy_applicability_snapshot_with_version(
        &self,
        snapshot_ref: &PolicyApplicabilitySnapshotRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<PolicyApplicabilitySnapshot>, PolicyApplicabilitySnapshotRepositoryError>;

    /// 追加新的 policy applicability snapshot；不得修改旧评估。
    async fn create_policy_applicability_snapshot(
        &self,
        snapshot: &PolicyApplicabilitySnapshot,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), PolicyApplicabilitySnapshotRepositoryError>;
}

/// 持久化一次 aggregate policy execution decision 的不可变结果。
pub trait PolicyExecutionDecisionRepository: Send + Sync {
    /// 按 exact policy decision ref 读取 decision 与 Version。
    async fn get_policy_execution_decision_with_version(
        &self,
        decision_ref: &PolicyExecutionDecisionRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<PolicyExecutionDecision>, PolicyExecutionDecisionRepositoryError>;

    /// 追加新的 policy decision；旧 accepted decision 保持可读且不被 replacement 覆盖。
    async fn create_policy_execution_decision(
        &self,
        decision: &PolicyExecutionDecision,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), PolicyExecutionDecisionRepositoryError>;
}

/// 持久化一个 high-risk marker 的不可变决策。
pub trait HighRiskActionDecisionRepository: Send + Sync {
    /// 按 exact action decision ref 读取 per-marker decision 与 Version。
    async fn get_high_risk_action_decision_with_version(
        &self,
        action_ref: &HighRiskActionDecisionRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<HighRiskActionDecision>, HighRiskActionDecisionRepositoryError>;

    /// 追加新的 marker decision；不得原地改写旧 marker verdict。
    async fn create_high_risk_action_decision(
        &self,
        decision: &HighRiskActionDecision,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), HighRiskActionDecisionRepositoryError>;
}

/// 持久化一次 terminal capture fact 及其 body-free material relations。
pub trait CaptureFactRepository: Send + Sync {
    /// 按 run 预绑定的 exact capture ref 读取 capture fact 与 Version。
    async fn get_capture_fact_with_version(
        &self,
        capture_ref: &CaptureFactRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<CaptureFact>, CaptureFactRepositoryError>;

    /// insert-if-absent 追加 terminal capture fact；同一 run 不得创建第二个 capture ref。
    async fn create_capture_fact(
        &self,
        fact: &CaptureFact,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), CaptureFactRepositoryError>;
}

/// 持久化一次同一 source snapshot 生成的 reconciliation report。
pub trait SandboxReconciliationReportRepository: Send + Sync {
    /// 按 exact report ref 读取完整 report / finding set 与 Version。
    async fn get_reconciliation_report_with_version(
        &self,
        report_ref: &SandboxReconciliationReportRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<SandboxReconciliationReport>, SandboxReconciliationReportRepositoryError>;

    /// 追加一次完整 report；report 不得通过 save 或 partial finding update 修复。
    async fn create_reconciliation_report(
        &self,
        report: &SandboxReconciliationReport,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxReconciliationReportRepositoryError>;
}
```

### 7.3 具体 error owner 与 method 对称性

上述 trait 各自拥有对应的 `ExecutionContextResolutionRepositoryError`、
`ContextReferenceResolutionRepositoryError`、`BoundaryEstablishmentDecisionRepositoryError`、
`BackendCapabilitySummaryRepositoryError`、`PolicyApplicabilitySnapshotRepositoryError`、
`PolicyExecutionDecisionRepositoryError`、`HighRiskActionDecisionRepositoryError`、
`CaptureFactRepositoryError` 和 `SandboxReconciliationReportRepositoryError`。每个 error enum 必须是本 owner
的独立 public type，至少包含下列四个无载荷 variant，并用该 owner 的 Rustdoc 说明适用边界：

| variant | 产生条件 | application 处置 | 禁止映射 |
|---|---|---|---|
| `NotFound` | exact named ref 在当前 committed snapshot 不存在 | mutation按owner的 unresolved/integrity规则处理；Query返回typed absence/degraded | 自动调用`create`、默认对象、latest scan |
| `AlreadyExists` | exact ref或唯一 source binding已有 row | 交给whole-group conflict/identity检查 | 转成 replacement、覆盖旧row、当作duplicate success |
| `Unavailable` | store、codec或事务适配器暂不可用 | 返回 `PortUnavailable` 或安全 `Delayed` | 当作`NotFound`或继续使用未验证snapshot |
| `IntegrityViolation` | row、typed key、source relation、cursor、Version或schema不一致 | fail closed，进入typed integrity/reconciliation | 修字段、丢字段、从latest row重建 |

`create` 成功只表示 write 已 stage；提交结果必须由同一 `SandboxUnitOfWork` 明确返回 `Committed`、`NotCommitted` 或
`StatusUnknown`。`StatusUnknown` 的恢复输入必须保留 exact named ref、source cursor、operation reservation 和 UoW
correlation；不能由 repository error mapper 抹成四类普通错误。上述九个 trait 均没有 `save`、`update`、`upsert`、
`delete`、`latest` 或 `scan_all` 方法，immutable replacement 一律是新的 ref + 新的 `create`。

### 7.4 Immutable write set 与 visibility

| 场景 | 允许的 staged write set | commit 前 visibility | commit unknown 处理 |
|---|---|---|---|
| context / policy / capability observation | source truth（如有）+ immutable row + required audit + optional relay + stored relation | 全组不可被 Query / publisher 读取 | 按 operation reservation 和 exact refs inspect；不创建 replacement |
| capture finalization | terminal run relation + capture fact + material rows + observability relation + audit / relay | capture ref 与 material composite rows同时可见 | 只接受完整 group inspection；不补第二 capture fact |
| reconciliation report | same-snapshot source proof + report/finding set + audit + job stored result | report与finding set原子可见 | report ref已存在则按 exact ref rehydrate；否则保持未知，不重跑同一调用栈 |
| ordinary refresh replacement | old immutable row保持可读，新 row在新UoW stage | 旧row不受影响；新row全组提交后才可见 | 不以时间或“最新”选择 winner；回到 reservation / inspect |

任何 `NotFound` 只表示当前 exact read 未找到 row，不表示该 owner 可以首次物化。reference initial、projection first
materialization 和 derived first materialization 的合法 create branch继续由 `7R-02B` 的 owner proof 控制；Query
仍固定 `0/13` identity allocation、create、audit、relay 和 UoW write。

## 8. SandboxAuditTrace repository

### 8.1 Append-only trait

`SandboxAuditTrace` 的 repository 只负责已经由 Step 6 factory 完成 relation proof 的 draft / record 的持久化与读取。
它不拥有 `SandboxAuditTraceKind` 的 predicate、material validation、source cursor 分配或 status transition。写入
入口必须区分 staged source、committed maintenance source 和 committed relay source；不能用一个接受 optional cursor 的
`append_trace` 把三种路径重新合并。

```rust
/// 负责 Sandbox body-free audit linkage 的 append、exact read 和 bounded subject read。
pub trait SandboxAuditTraceRepository: Send + Sync {
    /// 在 source UoW 中追加已由 draft finalize 为 Linked 的 audit record。
    ///
    /// `trace` 必须与当前 UoW 的 source/audit relation、cursor 和 required relay
    /// group相等；repository 不会替 caller 生成 cursor、补 source 或修正 status。
    async fn append_staged_audit_trace(
        &self,
        trace: &SandboxAuditTrace,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxAuditTraceRepositoryError>;

    /// 在已提交 ordinary maintenance source 的独立 UoW 中追加一条 Linked audit。
    async fn append_committed_audit_trace(
        &self,
        trace: &SandboxAuditTrace,
        expected_source_cursor: SandboxTruthCursor,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxAuditTraceRepositoryError>;

    /// 在已提交 relay row 存在后追加 Relay-kind audit；不分配新 truth cursor。
    async fn append_committed_relay_audit_trace(
        &self,
        trace: &SandboxAuditTrace,
        relay_ref: &SandboxEventRelayRecordRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxAuditTraceRepositoryError>;

    /// 按 exact audit ref 读取 row、source proof 和 material snapshot 的完整 bundle。
    async fn get_audit_trace_with_version(
        &self,
        trace_ref: &SandboxAuditTraceRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<ImmutableSnapshot<SandboxAuditTrace>, SandboxAuditTraceRepositoryError>;

    /// 在一个已授权 subject 下按稳定 append order读取bounded audit页。
    /// page cursor是application-local read cursor，不是truth cursor或Version。
    async fn list_audit_traces_by_subject(
        &self,
        subject_ref: &SandboxTraceSubjectRef,
        trace_kind_filter: Option<SandboxAuditTraceKind>,
        page: &SandboxRepositoryPage,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Page<SandboxAuditTrace>, SandboxAuditTraceRepositoryError>;
}
```

`get_audit_trace_with_version` 的 `Version` 只用于同一 committed row 的 rehydration / cross-link 检查，不允许被
application 转成 `save_audit_trace`。audit row 没有 `save`、`update`、`delete`、`upsert` 或 `append_latest`。纠正、
补充或更正只能创建新的 `SandboxAuditTraceRef`，并在 reason / source relation 中明确其 correction 关系；旧 row
保持可读。

### 8.2 Audit repository error owner

```rust
/// SandboxAuditTrace repository 的持久化与 source-group 错误；不携带 audit body 或 raw cause。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxAuditTraceRepositoryError {
    /// exact audit ref 在 committed snapshot 中不存在。
    NotFound,
    /// 同一 audit ref 或同一 required append claim 已存在。
    AlreadyExists,
    /// append / read 使用的 store 或 transaction 暂不可用。
    Unavailable,
    /// row、source proof、material snapshot、cursor、status或Version不一致。
    IntegrityViolation,
    /// required audit append 无法与主体 source truth 形成同一原子提交组。
    RequiredAppendUnavailable,
    /// source 已提交但 audit append 的独立诊断 scope失败；主体 truth 不回滚。
    PostCommitDiagnosticFailure,
}
```

`RequiredAppendUnavailable` 只能用于 source group 明确要求 audit 的路径。application 必须把整个 L1 write group
标记为 `NotCommitted` 或 `StatusUnknown`，或者在 source 尚未提交时阻止 commit；不能提交一个声称安全闭合的 source
truth 后再把 required audit failure 降成普通 warning。`PostCommitDiagnosticFailure` 只适用于已被明确标记为普通
L2 diagnostic hook 的追加，不得用于替代 required audit。它不改变 source truth、不生成第二个 source fact，也不自动
重试或回滚业务写入；由 observability / operations surface记录有限 safe reason。

### 8.3 Source binding、rehydration 与 visibility

| path | caller sequence | required source proof | cursor / UoW | failure rule |
|---|---|---|---|---|
| staged source | build source + `SandboxAuditTraceDraft::record` -> stage all source / audit / relay / stored relations -> assign truth cursor -> finalize -> append | source fact、subject、kind、material snapshot同一UoW | source cursor由`assign_truth_change_cursor()`提供；append与source同UoW | 任一stage / append / commit失败，整组不可见；cursor不得泄漏到Query |
| committed maintenance | read exact committed source group -> build fresh relation proof -> draft -> `finalize_committed_source` -> append | source row、source cursor、material snapshot同一committed read | 独立UoW；传入cursor必须与source binding相等 | source已提交时audit append失败不回滚source；按required/L2分类，不伪造Linked |
| committed relay audit | read complete relay persistence bundle -> build Relay binding -> `record_committed_relay_source` -> finalize -> append | original source fact、relay row、source cursor、event kind、recorded time三方等值 | 复制原始source cursor；不分配audit cursor或新relay | publisher feedback body不进入audit；失败只更新relay recovery / diagnostic route |
| bounded query | access decision -> exact subject index/read -> rehydrate each complete bundle -> stable page | subject scope、kind filter、source proof和body-free row | read-only UoW；page cursor不参与truth allocation | empty是合法结果；missing sidecar是typed integrity/degraded，不补链 |

`append_*` 成功仅表示 row 已 stage；最终业务可见性由 UoW commit 结果决定。durable 与 fake 必须都能表达三种 commit
结果，并在 `StatusUnknown` 时保留原始 `trace_ref`、source cursor、relay ref（若有）和 operation correlation。fake
不得把内存 map 写入成功直接作为 `Linked` 可见，必须在 commit boundary 前隐藏 staged row，并支持重启式 exact inspection
语义的测试替身。

### 8.4 Bounded read 与 no-write 规则

`list_audit_traces_by_subject` 只接受已经通过 `GetSandboxAuditTraceInput::try_new` 的 closed subject、可选
`SandboxAuditTraceKind` 和 bounded `SandboxRepositoryPage`。实现必须按 `(source_truth_cursor, trace_ref)` 的稳定
append order读取，page token由 application-local cursor codec 解释；不得使用 timestamp、Version、event id、
`latest` 或全表 scan代替 page anchor。具体 read 约束如下：

| 检查 | 正向契约 | 负向契约 |
|---|---|---|
| subject visibility | 先做 context / subject access decision，再读该 subject范围 | 通过“是否有记录”反推可见性 |
| row completeness | 每个 item都经完整 audit bundle rehydrate | row-only `Into<SandboxAuditTrace>` |
| page bound | 返回数不超过请求limit；next cursor只来自本页稳定末项 | 无limit、跨页重新排序、按count生成token |
| absence | 空页返回 `Page<T>` 的 empty surface | empty时create、append或返回默认audit |
| integrity gap | sidecar缺失 / proof冲突返回 typed integrity或允许的 degraded | 丢掉坏row继续报告完整success |
| writes | repository read、identity allocation、truth cursor allocation、audit append均为0 | read audit、projection repair、relay publish |

Query 的 13/13 zero-write 约束在本 trait 上是硬门禁：`get_audit_trace_with_version` 与
`list_audit_traces_by_subject` 不得调用任何 `create_*`、`append_*`、identity allocator、cursor allocator、
external port 或 `SandboxUnitOfWork::commit`。

## 9. Relay repository exact contract

### 9.1 Paired persistence 与 application port

`SandboxEventRelayRecord` 的持久化根仍然只有一个。lifecycle row、immutable payload row、committed source binding
和唯一 dedup key 是同一个 relay persistence group 的四个必要部分；payload row 不是第二个 domain root，不能由另一个
repository 单独拥有。`SandboxRelayPersistenceBundle` 只有在四部分完成 paired validation 后才可交给
`SandboxEventRelayRecord::rehydrate`。

```rust
/// Relay selection reader 传给 repository 的已知、有限、ordered-unique candidate set。
/// 该 carrier 不表达 status，也不允许空集合被解释为 all / latest / scan。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxRelayPendingSelection {
    /// 已由正式 relay index 或 job selection 证明属于当前 invocation 的 relay refs。
    relay_refs: Vec<SandboxEventRelayRecordRef>,
}

impl SandboxRelayPendingSelection {
    /// 只接受 non-empty 或显式 empty 的 ordered-unique exact refs；不读取 repository。
    pub fn try_new(
        relay_refs: Vec<SandboxEventRelayRecordRef>,
    ) -> Result<Self, SandboxRelaySelectionError>;

    /// 返回固定顺序的 exact relay refs；调用方不能追加或重排。
    pub fn relay_refs(&self) -> &[SandboxEventRelayRecordRef];

    /// 判断本次 invocation 是否明确选择了零项。
    pub fn is_explicit_empty(&self) -> bool;
}

/// 由唯一 dedup key 读取的有限结果；Absent 不表示可以在当前调用栈中重跑。
#[derive(Debug, Eq, PartialEq)]
pub enum SandboxRelayDedupLookup {
    /// 当前 committed snapshot 中没有该 key 的 relay row。
    Absent,
    /// 找到与 key 逐字段相等的完整 persistence bundle。
    Exact(Versioned<SandboxRelayPersistenceBundle>),
    /// 唯一索引关系存在冲突，无法证明哪一条 row 是该 key 的 winner。
    Conflict,
}

/// 负责 relay append、paired read、bounded candidate load、attempt CAS 和 exact inspection。
pub trait SandboxEventRelayRecordRepository: Send + Sync {
    /// 按 exact relay ref 读取完整 paired bundle 与同一 committed snapshot 的 Version。
    async fn get_event_relay_with_version(
        &self,
        relay_ref: &SandboxEventRelayRecordRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<SandboxRelayPersistenceBundle>, SandboxEventRelayRecordRepositoryError>;

    /// 按固定四元组读取 dedup winner；不从 current truth 重建 payload。
    async fn find_event_relay_by_dedup_key(
        &self,
        dedup_key: &SandboxRelayDedupKey,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<SandboxRelayDedupLookup, SandboxEventRelayRecordRepositoryError>;

    /// 在 source operation UoW 中原子追加 finalized record、payload snapshot 和 dedup key。
    async fn append_finalized_relay(
        &self,
        pair: &SandboxRelayAppendPair,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxEventRelayRecordRepositoryError>;

    /// 对已提交 payload pair 的 lifecycle / attempt relation执行 expected-Version CAS。
    /// payload bytes、payload identity、source binding和dedup key不得被该方法修改。
    async fn save_event_relay_transition(
        &self,
        record: &SandboxEventRelayRecord,
        expected_version: Version,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<(), SandboxEventRelayRecordRepositoryError>;

    /// 按正式 selection 加载一页完整 relay bundle；不以 status 字符串或全表扫描筛选。
    async fn load_relay_candidates(
        &self,
        selection: &SandboxRelayPendingSelection,
        page: &SandboxRepositoryPage,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Page<Versioned<SandboxRelayPersistenceBundle>>, SandboxEventRelayRecordRepositoryError>;

    /// 读取一个 exact active / latest attempt 的完整 bundle，用于 side-effect 或 commit-unknown inspection。
    async fn inspect_publish_attempt(
        &self,
        relay_ref: &SandboxEventRelayRecordRef,
        attempt_ref: &SandboxRelayAttemptRef,
        uow: &mut dyn SandboxUnitOfWork,
    ) -> Result<Versioned<SandboxRelayPersistenceBundle>, SandboxEventRelayRecordRepositoryError>;
}
```

`load_relay_candidates` 的 selection 来源必须是已经提交的 explicit selection / relay index；repository 只按 exact refs
和 bounded page 读取，不负责从 `Pending | Retryable` 字符串推导 eligibility。每个返回 bundle 仍必须由 application
rehydrate 后调用 `evaluate_attempt_eligibility`。没有 active attempt 的 `Pending` 和已达到 not-before 的 `Retryable`
由 domain decision区分；repository 不能把两者合并为一个 `ready=true` 字段。

### 9.2 Relay repository error 与 paired visibility

```rust
/// Relay repository 的 source pair、dedup、attempt 和 CAS 错误；不暴露 transport body。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxEventRelayRecordRepositoryError {
    /// exact relay ref 或 exact attempt relation不存在。
    NotFound,
    /// insert-if-absent 的 relay ref 已存在。
    AlreadyExists,
    /// dedup key已有无法证明等价的现存 relation。
    DedupConflict,
    /// source operation尚未形成完整 finalized append pair。
    FinalizedPairRequired,
    /// relay row、payload row、source binding或dedup key无法通过paired校验。
    IntegrityViolation,
    /// expected core Version与当前 lifecycle generation不一致。
    VersionConflict,
    /// active attempt、payload identity或target binding与requested observation不一致。
    AttemptRelationConflict,
    /// payload row或dedup key被要求修改；immutable boundary被违反。
    ImmutablePayloadMutation,
    /// store、codec或transaction adapter暂不可用。
    Unavailable,
    /// source UoW / transition UoW的提交状态无法确认。
    CommitStatusUnknown,
}
```

方法的失败与可见性关系固定为：

| method | 成功含义 | stage 可见性 | 关键失败处置 |
|---|---|---|---|
| `get_event_relay_with_version` | 返回完整 bundle + 同代 Version | 只读，不产生写入 | row-only、payload缺失或source proof缺失一律 `IntegrityViolation`，不返回 partial record |
| `find_event_relay_by_dedup_key` | 返回 `Absent` 或完整 `Exact` | 只读，不选择 winner | `Conflict`不转duplicate，不创建第二row |
| `append_finalized_relay` | record、payload、dedup三者已在当前UoW stage | commit前三者均不可见 | 任一插入失败整组rollback；`AlreadyExists`交给dedup等价性检查 |
| `save_event_relay_transition` | lifecycle / attempt relation已按 expected Version stage | payload row和dedup保持旧committed值 | CAS conflict丢弃旧decision；不得reload latest套用旧observation |
| `load_relay_candidates` | 返回 selection内bounded complete bundles | 只读 | selection gap / pair gap是typed integrity，不缩减成空页 |
| `inspect_publish_attempt` | 返回 exact attempt所属完整bundle + Version | 只读 | wrong attempt、active mismatch或未知提交状态保持保守，不开始新attempt |

同一个 `SandboxUnitOfWork` 中追加 source truth、audit、relay pair 和 stored relation时，repository 的 stage 顺序由
application owner固定；repository 不自动补 append 或延迟到 post-commit。publisher transition 使用新的 UoW 和新读取的
Version，不能持有 source UoW 跨 external await。`Version` 只保护 relay lifecycle row；payload row、source binding、
dedup key的immutable equality必须在每次 transition 前后重验。

### 9.3 Paired read / write invariant

relay repository 每次从 durable 或 fake store返回 domain record前，必须执行以下 paired closure；顺序不能由 adapter
省略：

1. lifecycle row与payload row的 `relay_record_ref`、source fact ref、source truth cursor、event kind和payload identity
   逐字段相等。
2. `event_kind == original_source_fact_ref.event_kind()`，且 source audit ref与source binding相等；source cursor必须
   是非零已提交 truth cursor。
3. payload bytes重新通过 current canonical verifier，得到的 fingerprint与 payload identity相等；canonical verifier
   不可用时返回 `Unavailable` / `CommitStatusUnknown` 以外的专用 integrity gate，不得跳过检查。
4. target binding 的 event kind / runtime generation与 retry policy snapshot相等；每个 persisted attempt复制的 payload
   identity和target binding必须与 record相等。
5. 根据 record status、attempt count、active attempt、latest observation和summary执行 Step 6 §16.4.8 closed matrix；
   不通过时拒绝整组 rehydrate。
6. 以四元组 `(original_source_fact_ref, original_source_truth_cursor, event_kind, stable_payload_identity)` 重算
   `SandboxRelayDedupKey`，并与唯一索引返回的 key逐字段相等。

创建路径使用相反的完整性边界：

```text
finalized SandboxRelayAppendPair
  -> verify record / payload / dedup equality
  -> insert unique dedup claim + lifecycle row + payload row in one UoW
  -> commit all or expose none

transition:
  load complete bundle + Version
  -> rehydrate canonical record
  -> domain begin/apply/dead-letter method
  -> save lifecycle + attempt relation with Version CAS
  -> leave payload row / source binding / dedup key unchanged
```

不得有 `record-row-only` fallback、payload lazy rebuild、dedup key由 row id 反推、按 timestamp 选择 latest 或删除终态
payload 的实现路径。retention / archive / vacuum不属于本批；即使 `Published`、`Failed` 或 `DeadLetter`，原始 pair仍需
可读以支持 audit、feedback dedup 和 reconciliation。

### 9.4 Attempt-before-call、retry 与 recovery contract

`PublishSandboxEventRelay` 是本批唯一会把 relay record交给外部 publisher 的 application owner。其持久化顺序固定为：

```text
load_relay_candidates(selection, page)
  -> read complete relay bundle + Version
  -> SandboxEventRelayRecord::rehydrate(bundle)
  -> evaluate_attempt_eligibility(checked_at)
  -> if InitialAttemptAllowed | RetryAllowed:
       allocate SandboxRelayAttemptRef exactly once
       begin_publish_attempt(decision, attempt_ref, started_at)
       save_event_relay_transition(expected_version)
       commit confirmed
  -> read the same committed attempt + frozen payload snapshot
  -> call publisher exactly once with that attempt
  -> new UoW: inspect exact attempt + fresh Version
  -> map finite observation
  -> apply_delivery_observation(observation)
  -> save_event_relay_transition(expected_version)
  -> commit confirmed
```

以下规则不可由 application、worker 或 infra 简化：

| branch | repository / domain action | external action | result / recovery |
|---|---|---|---|
| `Pending`, no active attempt | `InitialAttemptAllowed` -> create attempt -> CAS save | 允许一次 publisher call | 同一 attempt 绑定 payload / target；结果必须匹配该 attempt |
| `Retryable`, not-before未到 | 返回 `RetryNotReady` | 不调用 publisher | bounded `Skipped`；不改变 record |
| `Retryable`, eligible | `RetryAllowed` -> ordinal checked increment -> CAS save | 允许一次 retry call | retry使用同一 frozen payload和新 attempt ref；source不变 |
| active attempt存在 | `PublishAttemptAlreadyActive` 或 exact inspect | 禁止新 call | 先等待/inspect同一 attempt；不从status重新推导新 attempt |
| `RetryExhausted` | `dead_letter_retry_exhausted` + CAS save | 不调用 publisher | 保存 exhaustion summary，进入 `DeadLetter`；不创建 publisher terminal observation |
| `Published`, `Failed`, `DeadLetter` | exact read only | 不调用 publisher | terminal / existing surface；不原地复活 |
| pre-call CAS conflict | 丢弃旧 decision、attempt candidate和Version | 不调用 publisher | 完整重读；当前栈帧不重试旧决策 |
| post-call observation CAS conflict | 保留已提交 attempt，inspect exact attempt | 不开始新 attempt | matching observation按同一 attempt恢复；冲突进入 integrity / quarantine |
| publisher result unknown | 保留 active attempt | 不盲目重发 | exact `(relay_ref, attempt_ref, payload_identity, target_binding)` inspection；三分结果 |

commit-unknown 的 inspection 只允许以下三种结果：

| inspection result | 可证明条件 | 后续动作 |
|---|---|---|
| `Applied` | exact attempt、observation和target/payload relation已提交且通过 rehydrate | 返回原 record / stored surface；不新建attempt |
| `Active` | exact attempt已提交、无可信 observation、active ref仍匹配 | 保持同一attempt等待/再次inspect；不能报告成功或创建新attempt |
| `AbsentOrIndeterminate` | 全部相关 row 明确不存在，或关系只部分存在 / 状态未知 | `Absent`才交给上层新的显式 recovery decision；部分/未知一律 integrity hold，不重跑 |

`AbsentOrIndeterminate` 不是一个可对外合并的成功结果。application 必须保留底层区分：`FullyAbsent` 可以在完整
whole-group evidence下进入新的 invocation；`Indeterminate` 必须进入 `Failed` / quarantine / operator handoff，且
不得用 retry policy 推出新 attempt。publisher side effect 可能已经发生时，`FullyAbsent` 也不能凭空证明未发送，必须
由外部 provider 的 exact inspect port提供同一 attempt 的安全结论；本批不新增 provider 产品协议。

### 9.5 Status / attempt / observation closure

relay 的持久化状态与技术 attempt 事实必须满足以下闭集；这里仅重复实现边界，不能新增 status：

| record status | attempt count | active attempt | latest observation | legal next action |
|---|---:|---|---|---|
| `Pending` | `0` | none | none | first `begin_publish_attempt` |
| `Pending` | `1` | matching latest | none | inspect or apply first observation |
| `Retryable` | `>=1` | none | matching latest retryable | evaluate not-before / exhaustion |
| `Retryable` | `>=2` | matching latest | previous retryable observation | inspect current retry attempt |
| `Published` | `>=1` | none | matching published receipt | read / report only |
| `DeadLetter` | `>=1` | none | publisher-terminal or exhaustion relation | read / operator recovery only |
| `Failed` | `>=1` | none | optional last verified observation + integrity summary | read / quarantine only |

非法组合必须在 persistence mapper 和 domain rehydrate 两处都拒绝：

- `Pending` 带 completed observation、retry summary或 attempt count不连续；
- `Retryable` 没有 latest retryable observation，或 active attempt与latest不相等；
- terminal status带 active attempt、可重试 summary或缺少匹配 receipt / dead-letter basis；
- `Failed`由普通 publisher outcome构造，或 integrity summary没有 affected attempt；
- 任一 attempt 的 payload identity、target binding、event kind、relay ref与 record不相等；
- attempt ordinal不从 1 开始、不是连续 `count`、或重复使用 `SandboxRelayAttemptRef`；
- observation 的 occurred time 早于 attempt start，或 observation不是 matching active attempt。

这些非法组合不能被 mapper 修成默认 `Pending`、`Retryable`、`Unknown` 或 `Empty`。它们是
`IntegrityViolation` / `AttemptRelationConflict`，应保留原 row 的有限诊断关系并进入安全恢复路径。

### 9.6 Application owner reachability 与 negative inventory

本批新增 repository method 必须有唯一 application owner；不能因为 method 已出现在 trait 中就视为可落码闭合。

| capability / method | 唯一 application owner | allowed callers | prohibited caller / path |
|---|---|---|---|
| immutable `create_*`（9 owner） | 各自 source/decision/capture/reconciliation write kernel | 对应 10 Command、9 Consumer、10 Job 的 named source group | Query、entry adapter、publisher feedback、generic repository helper |
| `SandboxAuditTraceRepository::append_staged_audit_trace` | source truth write kernel | source owner在同一 accepted UoW | Query、普通 log hook、publisher直接追加 |
| `append_committed_audit_trace` | explicit maintenance / recovery kernel | 仅有正式 committed source fact的维护路径 | post-commit补写 required audit、audit query |
| `append_committed_relay_audit_trace` | relay feedback / relay recovery kernel | existing relay row且Relay relation已验证 | publisher adapter、audit query、second relay creator |
| `append_finalized_relay` | `append_finalized_relay` private application helper | current fresh callable且 `requires_event_relay()==true` | selection worker、feedback consumer、retry job从缺行create |
| `find_event_relay_by_dedup_key` | fresh relay append preflight | source write kernel | publisher按status scan、Query repair |
| `begin_publish_attempt` + `save_event_relay_transition` | `publish_sandbox_event_relay` | selected existing relay item | direct entry、external adapter、Query |
| `apply_delivery_observation` + transition save | relay feedback / publisher post-call kernel | matching persisted attempt | source truth command、未匹配attempt的consumer |
| `inspect_publish_attempt` | publisher unknown / relay feedback recovery | exact attempt identity | blind retry、latest row winner |
| `SandboxStoredOperationResult` relation read | S7-02D idempotency kernel | duplicate / recovery owner | 本批 generic audit/relay helper、Query write path |

负向 inventory固定为零：

| forbidden surface | required count |
|---|---:|
| `save_immutable_*` / `update_immutable_*` / `upsert_immutable_*` | 0 |
| second audit truth root或`AuditAndRelayRepository`合并根 | 0 |
| second relay/outbox root、payload repository独立domain owner | 0 |
| publisher从current truth重编码或重建payload | 0 |
| status-string / full-table pending scan | 0 |
| post-call才分配 attempt ref | 0 |
| active attempt unknown时直接新attempt | 0 |
| Query identity allocation、cursor allocation、audit/relay write | 0/13 |
| raw body、secret、topic、endpoint、provider response进入 repository carrier | 0 |

### 9.7 Durable / fake parity

fake 不是 `HashMap<Ref, T>` 的成功替身。它必须在以下维度与 durable adapter保持可观察行为等价：

| dimension | durable requirement | fake requirement | fake 禁止捷径 |
|---|---|---|---|
| staged visibility | UoW commit前不可读取 | 维护transaction-local staged map，commit前读不到 | 直接写共享map后返回success |
| paired append | record/payload/dedup同组原子可见 | 三者一起提交或一起丢弃 | 只保存record、运行时补payload |
| unique dedup | 四元组唯一；冲突不选winner | 同样返回Exact / Conflict / Absent三分 | 以relay ref或Vec顺序代替key |
| Version CAS | stale Version拒绝transition | 同样拒绝并保留winner | last-write-wins / 自动reload |
| attempt-before-call | active attempt先提交 | fake publisher只能接收已提交attempt | fake call前内存造attempt |
| payload immutability | transition不更新payload row | 对已提交payload做mutation返回error | clone后替换bytes或重编码 |
| unknown recovery | exact attempt inspection三分 | 可注入Applied / Active / Indeterminate | timeout直接视为retryable success |
| status closure | 非法row拒绝rehydrate | 使用相同matrix拒绝构造 | 默认Pending / empty field补全 |
| body redaction | carrier无raw body/secret | 同样拒绝forbidden marker和敏感字段 | 保存raw error方便断言 |
| page / selection | bounded exact selection、稳定顺序 | 相同limit、cursor和empty语义 | 全量扫描后slice、empty=all |

fake capability不足时必须使对应测试或启动 gate 返回 `Unavailable` / `NotImplementedForParity`，不能为了让测试通过
伪造 `Published`、`Committed`、`Applied` 或 `FullyAbsent`。

---

## 10. 13-owner / 42-callable reachability closure

### 10.1 统计口径与 owner 分类

本节是本批的 current closure，不把“在 registry 中出现”误认为“已有唯一 application owner”。每一个写入或
外部副作用都必须能沿着一个 named callable 或一个已登记的 application-owned kernel追溯到唯一 owner；Query
只能沿 read path 读取，不能因为缺行、索引缺失或审计需要而补写。

| owner class | owner 数量 | 本批 exact closure | 备注 |
|---|---:|---|---|
| immutable source / decision / fact owner | 9 | `get_with_version` + `create_*`，9/9 named trait | 不存在 `save`、`update`、`upsert`；replacement使用新 ref。 |
| append-only audit owner | 1 | 5 个区分路径的 exact method | staged source、committed maintenance、committed relay、exact read、bounded subject read不合并。 |
| stored-result carrier owner | 1 | 仅 relation / carrier boundary；完整操作延后 | `reserve/complete/fail`、stored surface、replay和index由`S7-02D`拥有。 |
| relay mutable root owner | 1（不计入13个表内） | 6 个 exact paired/attempt method | `SandboxEventRelayRecord`是唯一 relay truth root；payload不是第二 domain owner。 |
| infra-local summary owner | 2 | runtime builder local replacement，durable repository `0` | `AdapterAvailabilityState`、`SandboxRuntimeConfigSummary`没有 named durable ref。 |

因此，“13-owner coverage”表示 Step 6 交来的 13 个 owner均已得到适用性裁决；它不表示 13 个 durable
repository。可落码的 current exact surface 是 9 个 immutable trait、1 个 audit trait、1 个 relay trait，以及
由 `S7-02D`承接的 stored/idempotency boundary。

### 10.2 13-owner 到 callable / kernel 的唯一 reachability

| owner | 唯一首次写入或append owner | 允许的 current callable / kernel | 禁止路径 |
|---|---|---|---|
| `ExecutionContextResolution` | `open_controlled_execution_context` 的 intake write kernel | `open_controlled_execution_context`；exact read由 context/status reader消费 | Query、entry adapter、consumer从缺行补建、publisher feedback |
| `ContextReferenceResolution` | `open_controlled_execution_context` 的 initial resolver kernel；refresh kernel只创建新 replacement | `open_controlled_execution_context`、`consume_caller_context_reference_changed` 的 source read、`refresh_sandbox_reference_states` 的 replacement | Query repair、从 source body反推、generic refresh helper |
| `BoundaryEstablishmentDecision` | `establish_execution_boundary` 的 decision kernel | `establish_execution_boundary`；boundary Query和lifecycle consumer只读 exact ref | `start_controlled_execution_run` 重算或覆盖 decision、Query create |
| `BackendCapabilitySummary` | `refresh_backend_capability_summaries` 的 capability snapshot kernel | `establish_execution_boundary` 只读、`consume_backend_capability_summary_changed` 只读、refresh Job replacement | backend adapter直接落库、Query扫描配置、按时间选 latest |
| `PolicyApplicabilitySnapshot` | `evaluate_policy_execution` 的 policy evaluation kernel | `evaluate_policy_execution`；policy Query / policy consumer只读 | runtime agent loop、Query重评估、从 policy string 构造snapshot |
| `PolicyExecutionDecision` | `evaluate_policy_execution` 的 aggregate decision kernel | `evaluate_policy_execution`；policy Query、boundary/run precondition只读 | `start_controlled_execution_run` 私自放行、consumer覆盖accepted decision |
| `HighRiskActionDecision` | `evaluate_policy_execution` 的 per-marker decision kernel | policy evaluation与已授权 control kernel只读/关联 | entry传入 status、consumer直接改decision、generic marker mapper |
| `CaptureFact` | `record_capture_result` 的 capture materialization kernel | `record_capture_result` 首次创建；capture Query、handoff/reconciliation只读 | handoff retry补造capture、Query repair、publisher反馈 |
| `SandboxReconciliationReport` | `run_sandbox_reconciliation` 的 whole-group report kernel | reconciliation Job首次创建；report Query exact read | Query生成report、普通维护覆盖旧report、按latest选report |
| `SandboxAuditTrace` | 各 source owner 的 staged append kernel；maintenance / relay recovery分别使用专用append kernel | 10 Command、9 Consumer、10 Job中的已登记 L1 source group；`get_sandbox_audit_trace`只读；relay feedback可追加 committed relay audit | log hook直接追加business audit、Query read audit、publisher绕过application append |
| `SandboxStoredOperationResult` | `S7-02D` 的 idempotency/stored kernel | 当前仅允许作为 operation/result relation carrier被 source、relay、job report引用 | 本批新增generic `save/get`、Query补stored、从 current truth重建 replay |
| `AdapterAvailabilityState` | runtime assembly builder | `try_build_runtime` / startup assembly local scope（非42个业务 callable） | durable repository、业务Query、作为安全truth或relay source |
| `SandboxRuntimeConfigSummary` | runtime config builder | startup assembly local scope（非42个业务 callable） | durable repository、业务决策输入、publisher payload source |

`AdapterAvailabilityState`和`SandboxRuntimeConfigSummary`的 local replacement不计入 application durable
create owner；如果未来要求跨进程恢复，必须先重开 Step 6并登记新的 owner/ref/blocker，本批不隐式扩表。

### 10.3 42 个 application callable 的逐项 reachability

以下矩阵列出当前 10 Command、13 Query、9 Consumer、10 Job。`R`表示 exact committed read，`C`表示本批
允许的 immutable create/append，`S`表示既有 mutable root transition，`D`表示条件性 relay/audit draft，`Z`
表示强制 zero-write。`I`（idempotency reservation/stored result）只标记为 `S7-02D` deferred，不在本批假定
repository method已存在。

#### Command（10/10）

| # | callable | current owner / relation | operation set | forbidden / deferred |
|---:|---|---|---|---|
| 1 | `open_controlled_execution_context` | intake resolution、context reference、accepted context group | `C(ExecutionContextResolution)`、`C(ContextReferenceResolution)`、staged audit、conditional `D`、`I` | 不由consumer/query补initial state；stored reserve由`S7-02D`闭合。 |
| 2 | `establish_execution_boundary` | boundary requirement/capability/decision与boundary recovery group | `R(BackendCapabilitySummary)`、`C(BoundaryEstablishmentDecision)`、staged audit、conditional `D`、`I` | 不调用backend adapter直接写truth；unknown不重建decision。 |
| 3 | `evaluate_policy_execution` | policy snapshot、per-marker decision、aggregate decision | `C(PolicyApplicabilitySnapshot)`、`C(HighRiskActionDecision)`、`C(PolicyExecutionDecision)`、staged audit、conditional `D`、`I` | 不从entry status构造decision；stored完整操作延后。 |
| 4 | `start_controlled_execution_run` | run launch / permit recovery group | `R` context/boundary/policy sources、staged audit、conditional `D`、`I-C(Reserved)` | 不创建第二policy snapshot；external launch必须在提交 recovery point后。 |
| 5 | `record_capture_result` | terminal run、capture fact、material/observability group | `R` terminal source、`C(CaptureFact)`、staged audit、conditional `D`、`I` | material candidate不由Query或handoff retry生成；stored完整面延后。 |
| 6 | `open_material_handoff` | capture ownership / handoff opening group | `R(CaptureFact)`、staged audit、conditional `D`、`I` | 不首次创建capture fact；不调用delivery port。 |
| 7 | `submit_sandbox_control` | control intent/fact and safety source group | exact source `R`、staged audit、conditional `D`、`I` | 不由consumer直接执行external effect；decision relation缺失则fail closed。 |
| 8 | `classify_sandbox_failure` | failure classification / impact group | exact source `R`、staged audit、conditional `D`、`I` | adapter error不能直接成为classification；不修改无owner proof的run/boundary。 |
| 9 | `evaluate_cleanup_readiness` | cleanup guard/evidence/coverage group | exact owner `R`、staged audit、conditional `D`、`I` | 只生成permission/block truth；不调用release、不把unknown当Allowed。 |
| 10 | `record_redline_containment` | redline signal/containment/preservation group | exact owner `R`、staged audit、conditional `D`、`I` | strict hold不得被config、caller bool或Query解除。 |

#### Query（13/13，全部 `Z`）

| # | callable | exact read owner set | allowed result path | forbidden write |
|---:|---|---|---|---|
| 1 | `get_sandbox_execution_status` | context/resolution + run + current projection bindings | exact visible/empty/degraded/unavailable matrix | create identity、补projection、追加audit/relay、external call |
| 2 | `get_boundary_status` | boundary decision/capability + boundary/handle/lease exact group | checked boundary view或exact absence | 建立backend、创建decision、release/reaper write |
| 3 | `get_policy_decision_summary` | policy snapshot/action/aggregate decision exact group | canonical policy surface | 重评policy、补decision、读取DSL/body |
| 4 | `get_capture_summary` | run/capture fact + complete material/observability group | visible/empty/degraded/unavailable | 调capture adapter、补material/capture、重算gap |
| 5 | `get_material_handoff_status` | capture/handoff/progress + relay linkage | canonical handoff surface | retry delivery、更新progress、创建relay |
| 6 | `get_failure_control_status` | failure/control/redline bounded read group | bounded page + typed gap | 按timestamp选winner、执行control effect、补failure |
| 7 | `get_cleanup_readiness` | cleanup guard/evidence/coverage + release relation | canonical readiness surface | 重评guard、release、补guard、清除blocker |
| 8 | `get_redline_containment_status` | redline + preservation/investigation/cleanup bindings | canonical containment surface | 解除containment、关闭investigation、补redline |
| 9 | `get_sandbox_read_projection` | projection binding + immutable source/marker relation | `Visible/Stale/Rebuilding/Degraded/MissingProjection` | rebuild、create projection、写marker或audit |
| 10 | `get_derived_inspect_preview_trend` | derived binding + exact source/materialization relation | exact kind and source outcome | 运行builder、创建derived、把derived failure升级core failure |
| 11 | `get_backend_capability_comparison` | ordered capability summary refs + requirement relation | bounded comparison surface | 扫描配置、调用capability port、选择backend |
| 12 | `get_sandbox_reconciliation_report` | exact report + finding/audit/relay/stored relations | report visible/degraded/empty | 运行reconciliation、生成finding、repair truth |
| 13 | `get_sandbox_audit_trace` | subject index + exact immutable audit bundle | bounded stable append page | read audit、补链、跨subject scan、写cursor |

所有 Query 的 repository access 必须发生在 access decision之后；`Z=13/13`包括 identity allocator、truth/read
cursor allocator、UoW write/commit、audit append、relay write和external port均为0。S7-02C只固定上述 owner
reachability，不替 `7R-04A`提前发明尚未存在的物理 index。

#### Consumer（9/9）

| # | callable | exact source / relation owner | operation set | failure boundary |
|---:|---|---|---|---|
| 1 | `consume_caller_context_reference_changed` | `ContextReferenceResolution` + existing reference state | `R` replacement source、`S` state、committed/staged audit按source scope、`I` | missing state是selection/index integrity；不补建。 |
| 2 | `consume_policy_summary_changed` | `PolicyApplicabilitySnapshot` / `PolicyExecutionDecision` + affected state | `R` immutable source、`S` stale fence、audit、`I` | 不覆盖已接受decision；source不可用保持保守 stale/degraded。 |
| 3 | `consume_backend_capability_summary_changed` | `BackendCapabilitySummary` + reference/boundary state | `R` summary、`S` stale fence、audit、`I` | 不自行刷新summary、不选择backend。 |
| 4 | `consume_isolation_backend_lifecycle_signal` | boundary/handle/lease/run lifecycle relation | exact `R` + `S` owner transition、audit/relay按required gate、`I` | typed observation不等于最终status；unknown进入保守恢复。 |
| 5 | `consume_material_handoff_status_changed` | handoff + capture/material relation | exact `R` + `S` progress/material、audit/relay、`I` | 不回滚capture、不从receipt重建payload。 |
| 6 | `consume_observability_handoff_status_changed` | handoff + observability material relation | exact `R` + `S` observation relation、audit、`I` | 不把observability body写入domain truth。 |
| 7 | `consume_sandbox_control_requested` | control request + policy/high-risk source relation | exact `R` + `S` control fact/decision relation、audit/relay、`I` | consumer只收束Sandbox-owned fact，不执行tools/member/runtime loop。 |
| 8 | `consume_investigation_handoff_status_changed` | redline preservation + investigation relation | exact `R` + `S` containment/recovery relation、audit、`I` | 不将外部调查结果直接变成Released/Terminal。 |
| 9 | `consume_sandbox_truth_relay_feedback` | relay record + frozen payload + exact active attempt | `R` bundle/attempt、`S` relay observation、`append_committed_relay_audit_trace`、`I` | 不create relay、不盲重试、不从latest status选attempt。 |

#### Job（10/10）

| # | callable | exact owner / repository surface | operation set | forbidden / deferred |
|---:|---|---|---|---|
| 1 | `publish_sandbox_event_relay` | existing relay root and selection | `load_relay_candidates`、`begin_publish_attempt` domain + CAS save、external call、exact inspect、observation CAS、relay audit | 不从缺行create、不重建payload；attempt先提交。 |
| 2 | `refresh_sandbox_reference_states` | existing state + new `ContextReferenceResolution` replacement | exact resolver `R`、new immutable `C`、state `S`、audit、conditional `D`、`I` | state缺行不补建；replacement不是save旧row。 |
| 3 | `refresh_backend_capability_summaries` | new `BackendCapabilitySummary` replacement + affected bindings | resolver `R`、immutable `C`、stale binding `S`、audit、conditional `D`、`I` | 不按latest覆盖旧summary、不从配置猜verdict。 |
| 4 | `retry_pending_material_handoffs` | selected existing handoff/material rows | bounded `R` + attempt CAS `S`、external call、observation `S`、audit/relay、`I` | 不创建capture、handoff或relay；unknown同attempt inspect。 |
| 5 | `run_lease_orphan_reaper` | selected lease/handle/orphan incident rows | bounded `R` + lifecycle `S`；eligible incident `C`、audit、`I` | 不执行release；Unavailable不确认orphan。 |
| 6 | `evaluate_pending_cleanup_guards` | selected existing cleanup guards | bounded `R` + guard `S`、audit/relay、`I` | 不首次create guard，不调用release。 |
| 7 | `maintain_redline_containment_handoffs` | selected redline/containment/handoff rows | bounded `R` + strict `S`、audit/relay、`I` | 不解除strict hold，不创建第二redline。 |
| 8 | `rebuild_sandbox_read_projections` | exact projection target/index + projection root | formal first `C`或existing `S`、audit/marker、`I` | Query不能触发；NotFound不是first proof。 |
| 9 | `maintain_derived_inspect_preview_trend` | exact derived target/source proof + derived root | formal first `C`或existing `S`、audit/marker、`I` | empty/cache不能造first；不写core truth。 |
| 10 | `run_sandbox_reconciliation` | same-snapshot source set + report/finding group | `C(SandboxReconciliationReport)`、finding group、staged audit、conditional `D`、`I` | 不按latest拼报告；whole-group failure不报告Clean。 |

`finalize_job_report`是 Job 内部 shared finalizer，不是第 11 个 public callable；其 stored result、job report replay
和completion/fail operation由`S7-02D`定义。本节不把该helper计入42/42，也不允许实现者借此新增公共 dispatch。

### 10.4 Reachability audit result

| audit | required | current design result |
|---|---:|---|
| 13-owner applicability | 13/13 | 11 named relation owners + 2 infra-local summary owners均有适用性裁决。 |
| immutable create owner | 9/9 | 每个`create_*`均有唯一 named source / decision / capture / reconciliation kernel。 |
| audit append owner | 3/3 | staged source、committed maintenance、committed relay三类写入 owner分离。 |
| relay method owner | 6/6 | append、dedup read、exact read、bounded load、transition、attempt inspect均有唯一owner。 |
| public callable join | 42/42 | 10 Command、13 Query、9 Consumer、10 Job，无新增第43个入口。 |
| Query write deny-set | 0/13 | identity、cursor、UoW write、audit/relay append和external call均为零。 |
| forbidden generic surface | 0 | generic immutable save、second audit/relay root、latest/full scan、payload rebuild均为零。 |

## 11. Capture / audit / relay / source relation matrix

### 11.1 Relation vocabulary

| relation | producer | required carrier | commit boundary | consumer |
|---|---|---|---|---|
| source fact -> audit | source owner | exact source fact ref、subject、kind、correlation、body-free material snapshot、committed truth cursor | staged source与required audit同组；普通maintenance使用已提交source | audit Query、reconciliation、diagnostic linkage |
| source fact -> relay draft | source owner | finalized source ref/cursor、event kind、canonical payload identity、target/generation、retry policy | relay append与source allowed group同UoW；publisher不补写 | relay publisher、feedback、recovery |
| capture fact -> material rows | `record_capture_result` | terminal run/capture ref、complete ordered candidate set、composite material key、observability relation | capture fact、all material rows、observability rows和required audit/relay整组可见 | handoff、capture Query、reconciliation |
| audit -> relay audit | relay feedback/recovery kernel | existing relay ref、original source cursor、active attempt relation、body-free observation | 独立 committed append；不分配新source cursor | audit Query、reconciliation、operator read |
| source group -> stored result | idempotency kernel | operation ref、result kind、surface refs、relation digest | 由`S7-02D`定义whole operation group | duplicate/recovery/job finalizer |
| reconciliation source set -> report | `run_sandbox_reconciliation` | same-snapshot five-channel source proof、ordered findings、coverage basis | report/finding/audit/relay/stored group原子可见 | report Query、handoff/closure review |

### 11.2 Capture relation closure

`record_capture_result`只接受已经提交且处于terminal-eligible的 run/capture source snapshot。它在写UoW中按以下顺序
形成关系：

```text
exact terminal run + capture binding
  -> complete, ordered, duplicate-free material candidate set
  -> CaptureFact::from_terminal_snapshot(...)
  -> create_capture_fact
  -> create_captured_material for every known composite key
  -> create observability material relation when required
  -> append required audit / finalized relay draft
  -> commit confirmed
```

candidate set为空只有在 domain factory给出 terminal zero-material proof时合法；“当前页为空”“Query没有选到row”
和“adapter没有返回body”都不能证明零材料。任一 material、observability、audit或required relay relation失败时，
本次 capture materialization group不得对外报告完整成功；已提交的 terminal run不回滚，恢复由 capture owner按
typed outcome处理。

### 11.3 Audit relation closure

`SandboxAuditTrace`的最小可验证关系是：

```text
source_fact_ref + source_truth_cursor + subject_ref + correlation_ref
  + audit_kind + body_free_material_snapshot
  -> SandboxAuditTraceDraft::record
  -> one of staged / committed-maintenance / committed-relay append
```

`source_truth_cursor`必须来自已提交 source truth或同一 source UoW的 cursor allocation；audit repository不生成、修正或
推测它。普通诊断append失败只返回受限诊断结果；required audit无法形成同组时，source operation只能返回
`NotCommitted`或`StatusUnknown`，不能把缺审计的主体group标成安全闭合。audit Query只读 immutable append order，
不把此次读取再写成audit，也不把audit当 acceptance/evidence truth。

### 11.4 Relay relation closure

relay必须保留以下不可变等式：

```text
relay.source_fact_ref           == finalized_source.fact_ref
relay.source_truth_cursor       == finalized_source.committed_cursor
relay.event_kind                == source_fact.event_kind
relay.payload_identity          == verify(canonical_payload.bytes)
relay.dedup_key                 == (source_fact_ref, source_truth_cursor,
                                    event_kind, stable_payload_identity)
attempt.payload_identity        == relay.payload_identity
attempt.target_binding          == relay.target_binding
attempt.attempt_ref             == persisted_before_external_call
```

source commit、relay append、publisher call和feedback observation是四个不同恢复边界：source提交后 publisher failure、
retry、dead-letter、feedback failure都不得回滚 source truth；publisher call前没有已提交 attempt则禁止外呼；
commit unknown只能 exact inspect 同一个 attempt，不能从 `Pending` / `Retryable` 重新推导发送。

### 11.5 Relation cardinality and negative checks

| relation check | required cardinality / rule | forbidden shortcut |
|---|---|---|
| source -> audit | required source group至少一条 required trace；L2 diagnostic可独立且不反写source | post-commit补required audit后仍报告success |
| source -> relay | `requires_event_relay()==true`时恰有一个 finalized append pair；false时不分配relay ref | publisher缺行create、一个source多个winner |
| relay -> payload | exactly one immutable payload snapshot | payload repository独立root、transition重编码 |
| relay -> attempt | 每次实际外呼恰一个已提交 attempt；ordinal连续从1开始 | 外呼后分配ref、active unknown新建attempt |
| attempt -> observation | observation必须匹配同一 attempt/payload/target | latest observation winner、跨attempt套receipt |
| capture -> materials | candidate set complete时逐row一一创建；zero须有typed proof | bulk upsert、按page count补齐 |
| report -> findings | finding set与same-snapshot coverage basis同组 | Query补finding、按latest source重建 |
| source -> stored | 一个 operation/result surface relation；完整 reservation/replay由S7-02D定义 | 当前批generic stored helper或从truth重放 |

## 12. SandboxStoredOperationResult 本批 deferred boundary

本批只闭合 stored result 的**关系载体边界**，不宣称已完成 idempotency/stored repository。以下内容可以被当前
source、audit、relay和job设计引用：

| current allowed carrier | exact rule |
|---|---|
| `SandboxStoredOperationResultRef` | 只能由已登记的 operation allocator生成；不能由page token、relay ref、truth cursor或字符串拼出。 |
| operation relation | 必须绑定固定 operation kind、channel、idempotency claim和调用 correlation；duplicate/recovery不得生成第二 ref。 |
| result relation | 必须指向已提交的 typed surface ref / immutable source group / relay observation；不得保存raw body或provider response。 |
| audit / relay relation | audit和relay只能保存 stored relation marker / ref，不拥有 stored result真相。 |
| commit-unknown | 保留 operation claim与所有 candidate refs；whole-group inspection完成前不得报告 replay success。 |

明确留给 `S7-02D / S7H-09` 的内容：

1. `SandboxIdempotencyRecordRepository` 与 `SandboxStoredOperationResultRepository` 的 exact trait、error enum、
   `reserve/complete/fail/get` 方法和同组 UoW 规则。
2. channel + operation + key + request digest 的 unique claim、duplicate / conflict / in-flight / terminal matrix。
3. stored surface 的 exact carrier schema、replay validation、result-kind与每个 Command/Consumer/Job的映射。
4. 必要 unique/index/page/read contract，以及 fake/durable parity的 stored-specific实现边界。

本批禁止提前写出 `save_stored_result`、generic `get_result`、`complete_operation` 或 `find_latest_result` 作为
可调用正向接口；这些名称只有在 S7-02D 逐项审查后才能决定，当前仅保留 typed relation slot。

## 13. L1 / L2 / L3 closure audit

### 13.1 L1 主流程与安全 truth

| L1 surface | closure result | residual boundary |
|---|---|---|
| 9 immutable source/decision/fact repositories | 9/9 exact get/create、owner error、Version/UoW、replacement relation | stored relation和必要index仍由S7-02D join。 |
| audit source linkage | 3 write path + exact read + bounded read；body-free、cursor、same-UoW和failure isolation闭合 | 普通诊断平台不在本批。 |
| relay append / payload / attempt | 6/6 method、paired validation、dedup、attempt-before-call、retry/dead-letter/unknown闭合 | provider exact inspect port由S7-03B；物理index由S7-02D/7R-04A。 |
| source/capture/reconciliation relation | 7 relation families、cardinality、whole-group visibility和no-rollback闭合 | 非安全维护报告保持L2。 |
| application reachability | 42/42 callable均有唯一 owner/path；Query 0/13 write | entry adapter双向映射继续由S7-06。 |
| security redlines | payload/body redaction、unknown保守、source不回滚、second root为0 | 不扩写 provider 产品或运行时实现。 |

### 13.2 L2 保障契约

以下内容只保留 owner、最小输入/输出、safe default和升级条件，不展开物理存储或逐错误实现：

| L2 surface | minimum contract | safe default / escalation |
|---|---|---|
| ordinary diagnostic audit | body-free source/correlation、append failure isolated、有限分类 | 保留主体truth；required关系缺失时升级到L1 integrity/recovery。 |
| non-security observability hook | fixed operation/kind/count class、无secret、失败不重跑 | `Unavailable`或受限诊断；不得追加business audit。 |
| infra-local availability/config summary | startup builder local replacement、redacted marker、owner明确 | unavailable则启动gate拒绝或降级；不得进入domain decision。 |
| fake parity | 同类别 visibility/CAS/unknown/redaction结果 | capability不足返回`Unavailable/NotImplementedForParity`；不得伪造success。 |

### 13.3 L3 过程与交付边界

本批 L3 只记录静态 closure、回填 source map、用户停审和 implementation freeze。没有运行、编译、测试、evidence、
验收或 commit事实；不把上述静态数字写成实际验证结果。正式 `03` 的装配、`04~07` 的定向回查和 32 个 boundary
skeleton继续冻结。

## 14. Formal writeback draft and current questions

### 14.1 正式 `03` 回填草稿（不在本批写入）

未来 Step 19 装配正式 `03-详细设计.md` 时，只回填以下可落码主体：

1. application repository port：9个 immutable trait、`SandboxAuditTraceRepository`、
   `SandboxEventRelayRecordRepository`及其 owner/error/visibility contract。
2. source group：capture、reconciliation、audit、relay的关系和 UoW/no-rollback规则。
3. publisher：frozen payload、attempt-before-call、exact inspect和retry/dead-letter边界。
4. stored result：从 S7-02D 的确认产物回填，不复制当前 deferred草稿。

任务状态、审计计数、历史冲突、用户确认、静态检查输出和 implementation blocker不得进入正式主体章节。

### 14.2 待确认与开放边界

| item | status | owner / next source | current impact |
|---|---|---|---|
| `REF-001` immutable/stored/index join | open | `S7-02D`、`S7H-09`、必要时`7R-04A` | 阻塞 `S7-G02`、Step 8和正式装配；不是新的L1/L2上游blocker。 |
| publisher provider exact inspect contract | deferred | `S7-03B` | 本批只规定 application exact inspect输入和保守结果，不规定provider协议。 |
| physical index/schema/retention | deferred | `S7-02D` / `7R-04A` | 本批只规定 bounded selector与唯一性，不规定数据库实现。 |
| infra-local summary是否跨进程持久化 | unresolved design question | 若要求持久化则重开 Step 6 | 当前保持 durable repository 0，不影响本批静态闭合。 |
| target implementation repository | absent | `07` precheck / implementation ledger | implementation保持`CB-SBX-01A blocked / wait_design`。 |

未发现新的 L1/L2 上游 blocker。`CB-SBX-01A`、目标实现仓缺失、未固定 design baseline、无真实 test/evidence/commit
事实均继续保持原状态，不在本批关闭。

## 15. S7-02C completion gate and stop point

### 15.1 本批完成门禁

| gate | required | current result |
|---|---|---|
| immutable owner applicability | 13/13 | passed；9 durable + audit/stored relation + 2 local summary均已裁决。 |
| exact immutable repository | 9/9 | passed；named ref、get/create、error、replacement、UoW/Version完整。 |
| audit repository | 5/5 method + 3/3 append owner | passed；staged/committed/relay/query边界分离。 |
| relay repository | 6/6 method | passed；paired group、dedup、selection、attempt CAS/inspect完整。 |
| capture/source relation | 7 relation families | passed；candidate completeness、cursor、whole-group和no-rollback完整。 |
| 42 callable reachability | 42/42 | passed；10/13/9/10逐项列出，唯一owner与禁止路径明确。 |
| Query deny-set | 0/13 writes | passed；无identity/cursor/UoW/audit/relay/external side effect。 |
| stored deferred boundary | no premature generic API | passed；S7-02D scope、输入和阻塞关系明确。 |
| L1/L2/L3 discipline | 主流程完整，保障粗略，过程不伪造 | passed；无测试/运行/evidence/验收/commit声明。 |

### 15.2 Current status

`S7-02C`当前设计内容和静态审计已完成，状态应更新为 `completed_wait_user_review`。这不是 Step 7 整体完成，
也不是 `S7-G02` 用户确认。用户确认前：

- 不进入 `S7-02D`、`S7-G02`、Step 8或正式 `03~07` 装配；
- 不修改正式文档、实现仓、代码、测试或 boundary skeleton；
- 不生成 implementation commit、run_id、evidence alias、验收签署或测试结果；
- 保持 `REF-001` open、`CB-SBX-01A blocked / wait_design`和 `commit_required = no`。

用户确认后，下一批只允许先读取 `S7H-09`、`S7-02D` 输入和本文件 current overlay，再启动
`S7-02D idempotency / stored result / necessary index`；不得跳到 Step 8。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02C completed_wait_user_review
current_batch = S7-02C immutable / audit / relay repository
batch_status = completed_wait_user_review
gate_status = user_review_pending
immutable_owner_applicability = 13/13
immutable_repository = 9/9
audit_method = 5/5
audit_append_owner = 3/3
relay_method = 6/6
relation_family = 7/7
application_callable = 42/42
query_write = 0/13
stored_result = deferred_to_S7_02D
ref_blocker = open_wait_7r_02d
new_l1_l2_blocker = 0
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```
