# Step 6 回归 6R-03: Policy / Run / Capture / Handoff 对象契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 创建日期: 2026-07-18
> 状态: `review_confirmed_consumed_by_6r_04`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游控制: `03_ddd_step_06_object_contracts_regression_control.md`
> shared truth: `03_ddd_step_06_object_contracts_shared_types.md`
> boundary truth: `03_ddd_step_06_object_contracts_context_boundary.md`
> 当前边界: 本分件只闭合给定 policy / authorization 的 body-free snapshot、high-risk / fail-closed decision、Sandbox-owned run、capture / candidate material / observability material / handoff、相关 guard 与只读 view。它不定义 policy source truth、tools semantic execution、runtime agent loop、member host lifecycle、artifact truth、observability store、failure / cleanup / reaper 正文、repository、port、DTO、flow 或状态矩阵。

---

## 1. 批次状态与开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否确认进入 `6R-03` | 是。用户已确认 `6R-02` 审查点。 |
| `6R-02` 是否完成并可消费 | 是。24/24 canonical inventory、17/17 registry、十维 boundary、checked-age capability、mandatory lease linkage 与 read-view source contract 已闭合。 |
| 当前是否允许修改正式 `03-详细设计.md` | 否。正式文档只能在回归 Step 19 重新装配。 |
| 当前是否允许进入 `6R-04` | 否。必须完成本分件并停在用户审查点。 |
| 是否实现代码、运行测试或创建目标仓 | 否。本文件中的 Rust 只表达 exact design contract。 |
| 是否发现新的 L1 / L2 blocker | 否。现有冲突属于 L4-sandbox 旧对象材料与 current canonical registry 的内部差异。 |
| implementation 状态 | `CB-SBX-01A blocked / wait_design`，保持冻结。 |

### 1.1 分批写入计划

| 批次 | 内容 | 当前状态 | 完成门禁 |
|---:|---|---|---|
| 1 | 标准 / 上游读取、效力、诊断、capability map、24 项 inventory、历史失效账 | completed | owner、范围、对象顺序与下游承接无歧义 |
| 2 | policy source support、high-risk marker / decision、applicability / fail-closed guards、policy decision / view | completed | snapshot / decision immutable；每个 marker 一一裁定；non-allowed 不可 launch |
| 3 | `ControlledExecutionRun` 与 launch relation support | completed_review_confirmed | accepted context、established links、active handle、active lease、accepted policy 同一 lineage |
| 4 | capture support、`CaptureFact`、`CapturedMaterialRef` / set、completeness guard | completed_review_confirmed | material body-free；required kinds 可机械判断；capture fact 单次定格 |
| 5 | `ObservabilityMaterial`、`HandoffFact`、per-target progress、ownership guard | completed_review_confirmed | capture / observability / handoff 分层；多目标部分失败不丢失 |
| 6 | policy / capture / handoff read views、source snapshots、historical-invalid 差集 | completed_review_confirmed | no-write / no-second-truth；字段来源和 degraded 规则闭合 |
| 7 | inventory、registry、Rustdoc、状态、forward dependency 与 control / ledger closure audit | completed_wait_user_review | unresolved 0；停在 `completed_wait_user_review` |

本文件预计远超 500 行，严格按 100~300 行单批写入。任何骨架必须在对应批次完成前补成 exact schema；不得把名称级 support carrier 长期留空。

---

## 2. 本批输入、读取结果与效力

| 输入 | 读取重点 | 当前效力 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 6 | capability -> object -> field / callable / status；逐对象小循环；字段 / 状态 / Step 7 审计 | current standard |
| `详细设计书写规范.md` §5.5 | 每对象独立、exact Rust contract、非 core 闭口 / defer、模块收口摘要 | current standard |
| `设计真相源闭环与可落码性标准.md` | support carrier、ref set member、method parameter、状态 factory、view source 闭合 | current standard |
| 正式 `00-需求文档.md` | C-SBX-3 / C-SBX-4、FR / BR / AC / VETO、相邻仓红线 | current upstream truth |
| 正式 `01-架构设计.md` | policy source separation、capture / handoff layering、runtime dependency boundary | current upstream truth |
| 正式 `02-概要设计.md` 与 HLD policy / capture 附录 | object outline、flow、parallel state subjects、exceptions / downstream handoff | current outline；名称与 schema 需按 `6R-01` 校准 |
| `03_ddd_step_05_module_contracts.md` | domain / contracts owner、application / infra / entry defer boundary | current module owner |
| `03_ddd_step_06_object_contracts_shared_types.md` | `S6T-03-*` registry、named refs、kind / status / error owner | current canonical shared truth |
| `03_ddd_step_06_object_contracts_context_boundary.md` | accepted context、active identity、`EstablishedBoundaryLinks<'a>`、handle / lease linkage、read source rules | current direct upstream |
| 原 `03_ddd_step_06_object_contracts.md` §11.10~11.11 / §24~25 | 旧字段、旧函数和下游 consumer 线索 | historical material only |
| 原 Step 7~10 | repository / lease reads、protocol consumer、flow / transition conflict | historical downstream consumer；revalidation pending |
| L1-governance / L1-artifact；L2-tools / runtime / member-service；L1-identity / work | policy / artifact owner和 runtime seam | boundary reference only；不得复制正文或状态机 |

### 2.1 上游稳定结论

1. Sandbox 只消费给定 policy、authorization 和 capability 的 body-free refs / safe summaries；不生成 policy definition、approval、allowlist、DSL 或 capability truth。
2. `PolicyExecutionDecisionStatus::Accepted` 只允许继续 launch guard；不证明 boundary、handle、lease 或 backend launch 已成立。
3. run 只记录 Sandbox isolation-layer lifecycle；不解释 tool invocation、不推进 runtime `ExecutionInstance` / agent loop，也不管理 member host / runner product state。
4. capture 只记录 Sandbox 已捕获的 output / candidate / diagnostic / observability material；不形成 artifact、baseline、formal evidence 或 observability store truth。
5. capture、candidate material、observability material 和 downstream handoff 是四个独立 owner；handoff ack 不反写 capture fact，也不迁移下游 formal truth ownership。
6. failure / control / cleanup / lease / reaper / redline 的 object body 属于 `6R-04`；本批只能固定当前对象真正消费的 exact forward methods。

---

## 3. Step 6 SOP 问题回答

| SOP 问题 | `6R-03` 回答 |
|---|---|
| 是否已有骨架 / 批次计划 / 模块顺序 | 是。本文 §1.1 固定 7 批；shared types 已先闭合，当前按 domain policy -> run -> capture / handoff -> contracts view 顺序。 |
| 本批 capability 是什么 | C-SBX-3 给定策略下 fail-closed launch；C-SBX-4 run capture 与分层 handoff。 |
| capability 的输入 / 输出 / 状态 / 副作用 | 输入为 committed context / boundary / handle / lease、body-free policy summaries、typed adapter outcomes；输出为 immutable policy attempts、Sandbox run / capture / material / handoff truth；持久化和 adapter 调用留 Step 7 / 9。 |
| 哪些对象承接 | policy snapshot / marker / decision / guards；controlled run；capture / material / observability / handoff；guards / views。完整 inventory 见 §8。 |
| 是否存在无人承接或越界对象 | HLD 中 generic authorization、output、usage、audit、target、receipt summary 必须在本批闭口为 typed support；policy source / artifact body / runtime loop 明确外部拥有。 |
| 非 core 模块如何处理 | public view / body-free transfer carrier 在 `contracts` 闭口；domain truth / guard 在 `domain` 闭口；application / infra / api / worker / jobs service / adapter / entry carrier仍由 `6R-05` 按 registry 闭口。 |
| 字段来源如何闭合 | 仅允许 trusted entry / generated ref、body-free adapter mapping、committed owner relation、clock / audit 四类来源。 |
| factory 是否覆盖必填字段 | 每个状态分支必须有完整 factory；immutable snapshot / decision 不原地 transition，refresh / reevaluate 创建新 ref。 |
| 状态如何闭合 | 使用 `6R-01` canonical status owner；旧 `CaptureStatus` / `HandoffStatus` 等不得保留。 |
| 后续 Step 承接什么 | Step 7 port / repository / UoW / adapter outcome；Step 8 DTO；Step 9 exact flow；Step 10 current transition matrix；Step 11 persistence。 |

---

## 4. 当前材料问题诊断

| 诊断 ID | 当前缺口 / 冲突 | 风险 | 本批处置 |
|---|---|---|---|
| `6R03-DIAG-001` | 原 Step 6 将 policy / run / capture 多对象压在两个大节，字段 public、error generic、guard 只有名称 | 实现者无法逐对象落码或穷尽错误 | 全部重建为 canonical independent sections |
| `6R03-DIAG-002` | HLD 使用 `PolicySourceRefSet`、`AuthorizationSummary` 等名称级 carrier | adapter/service 可能从 ref、reason 或 raw body 猜授权 | 本批定义 explicit source / authorization disposition 与 complete sets |
| `6R03-DIAG-003` | high-risk marker 使用 `SandboxOpaqueRef` 且一条 decision 可吞多个 marker | marker identity / per-action disposition 不可追踪 | marker 作为 immutable body-free value；每个 marker 对应唯一 decision ref |
| `6R03-DIAG-004` | 旧 policy decision reason 必填，accepted 也被迫构造 reason；audit ref optional | success reason 假造、审计断链 | accepted reason `None`；其他状态 `Some`；audit ref 必填 |
| `6R03-DIAG-005` | 旧 Step 9 / 10 允许 accepted policy 原地转 blocked / fail-closed | immutable裁定被重写，历史不可审计 | snapshot / decision immutable；refresh / reevaluate 建立新 ref，run只引用一个 accepted attempt |
| `6R03-DIAG-006` | run prepare 只看 boundary / policy status，旧签名没有 exact handle / lease proof | 已释放、过期或错配环境仍可能 launch | run prepare 消费 established links、active handle、matching active lease与 accepted policy |
| `6R03-DIAG-007` | run `capture_ref` 必填与 `Preparing` factory 冲突 | factory 无法填满对象 | run 创建时预生成唯一 `CaptureFactRef`，capture 后续必须使用该 ref |
| `6R03-DIAG-008` | capture support carrier 未闭口，output / usage / audit summary 只有名称 | raw output、secret 或 adapter body可能进入 truth | 定义 body-free descriptor / summary refs / safe counters / digest，不保存正文 |
| `6R03-DIAG-009` | HLD `CapturedMaterialRef` 缺 exact location / digest / lifecycle；旧 material ref 不是 named object wrapper | repository / DTO / handoff 无法稳定读写 | 本批定义 value object fields、set uniqueness、状态和 relation methods |
| `6R03-DIAG-010` | single handoff status + target set 无 per-target progress | 多目标 partial success 被总状态吞掉 | 定义 ordered-unique target plan + per-target progress set，aggregate status机械推导 |
| `6R03-DIAG-011` | `CapturedMaterialRef` 多 handoff 时仅有一个 lifecycle status | 一个目标 ack 可能伪装全部 target accepted | 一个 material 只绑定一个覆盖 required target set 的 handoff batch；per-target truth留在 handoff |
| `6R03-DIAG-012` | capture / observability / handoff view 旧字段引用 `VisibleCaptureStatus` 等未登记 owner | read side形成第二状态真相 | view 显示 canonical status + degraded reasons，不新增同义 enum |
| `6R03-DIAG-013` | 原 Step 7~10 使用 `CaptureStatus`、`HandoffStatus`、generic `DomainError` 和旧 transition | downstream consumer 与 current registry 冲突 | 登记为 revalidation pending；不得做 alias |

---

## 5. 改动前后对比

| 维度 | historical material | `6R-03` 目标 |
|---|---|---|
| policy source | generic refs + summary name | typed external refs、safe summaries、explicit finite disposition、freshness / generation |
| high-risk | marker vector + aggregate guess | ordered unique marker set + one immutable decision per marker |
| policy decision | mutable-looking status / generic reason | immutable outcome factories、exact guards / errors、accepted-only launch predicate |
| run launch | boundary + policy booleans | exact context / identity / requirement / boundary / capability / handle / lease / policy lineage |
| capture | output summary prose | body-free exact descriptor、required material contract、single immutable capture fact |
| material | generic ref / path intuition | typed value object、material digest、safe source / location summaries、closed lifecycle |
| handoff | target set + one status | exact target identity / kind + per-target progress + derived aggregate status |
| read view | guessed visible enum | checked committed source snapshot、canonical statuses、no-write degraded factory |

---

## 6. 设计取舍

### 6.1 Immutable policy attempts

`PolicyApplicabilitySnapshot`、`HighRiskActionDecision` 和 `PolicyExecutionDecision` 都是 immutable attempt。policy source变化、authorization刷新或 launch 前重评必须创建新 snapshot / action decision / policy decision refs；不得把已有 `Accepted` 原地改成 `Blocked` 或 `FailClosed`。若已有 run 已进入 `Running`，后续 policy变化只能形成 failure / control / redline 输入，由 `6R-04` owner 收束，不能回写原 policy attempt。

### 6.2 Exact launch relation

`ControlledExecutionRun::prepare` 不接受 `bool policy_ok`、四个散装 boundary refs或 caller计算的 lease bool。它必须消费：accepted context、active identity、`CoherentBoundary::require_established_links()`、matching active handle、matching active lease、accepted policy decision及预生成 run / capture refs。`LeaseRecord` 的 exact `require_active_for_handle` 正文属于 `6R-04`，本批登记不可弱化的 forward contract。

### 6.3 One capture fact per run

run 创建时预生成唯一 `CaptureFactRef`，因此 `Preparing` factory 能填满必填字段，且 `RecordCaptureResult` 无法为同一 run静默创建第二个 capture fact。capture in-flight 不进入 `CaptureFactStatus`；adapter 完成后以 complete / partial / failed / unavailable 之一单次定格。

### 6.4 One handoff batch with per-target progress

一个 `HandoffFact` 表达一次 capture 的一个完整 handoff batch。batch 包含 ordered-unique target plan 和相同 target keys 的 progress set；`HandoffFactStatus` 从 progress机械推导。`Delivered` 要求全部 target delivered；混合 delivered + retryable 必须为 `Retryable`，混合 delivered + terminal failed 必须为 `Failed`，cleanup guard 阻断优先显示 `BlockedByCleanupGuard`。不得用最后一个回执覆盖总状态。

### 6.5 Body-free material boundary

`CapturedMaterialRef` 和 `ObservabilityMaterial` 只保存 typed refs、material / source digest、safe summary refs、finite kind / status、trace / time / audit relation。不得保存 stdout / stderr body、path、URL、SDK response、secret、artifact body、telemetry body或外部 error text。material storage descriptor 的 exact path / provider details属于 infra adapter与配置，不进入 domain。

---

## 7. Capability、module 与 object owner

| capability | input | output / state | canonical owner | downstream |
|---|---|---|---|---|
| body-free policy intake | accepted context、requirement、policy / authorization refs + summaries | applicability snapshot | `PolicyApplicabilitySnapshot` | policy guards / decision |
| high-risk action closure | exact marker set + authorization disposition + boundary support | one decision per marker | `HighRiskActionDecision` | aggregate policy decision / redline seed |
| fail-closed policy execution | snapshot + high-risk decisions + two guards | immutable accepted / rejected / blocked / pending / fail-closed decision | `PolicyExecutionDecision` | run prepare / failure seed |
| launch relation | context + established links + active handle / lease + accepted policy | preparing / running / completed / failed / terminated run | `ControlledExecutionRun` | capture / failure / control |
| capture result | run + adapter-mapped body-free output / material inputs | immutable capture fact + material refs + observability material | `CaptureFact` and material owners | handoff / cleanup |
| capture completeness | required material kinds + capture candidate | complete / partial / failure decision | `CaptureCompletenessGuard` | capture factory / failure seed |
| downstream handoff | capture + material / observability refs + target plan | handoff fact + per-target progress | `HandoffFact` | feedback / retry / cleanup |
| ownership protection | target / material roles + handoff plan | checked ownership decision | `HandoffOwnershipGuard` | handoff open / retry |
| caller-safe reads | committed source groups | policy / capture / handoff views | `contracts` views | Step 8 Query response |

### 7.1 非 core 模块闭口 / defer

| 模块 | 本批正式闭口 | defer |
|---|---|---|
| `contracts` | named refs引用、policy / capture / handoff view与其 source / degraded support schema | Step 8 Command / Query / Event / Job DTO |
| `domain` | 本文 24 项 canonical object / family、support、guard、error、transition | 无本批 domain object 可留给 application / infra 私补 |
| `application` | 不在本分件定义 | `6R-05` service I/O / error / idempotency；Step 7 port；Step 9 flow |
| `infra` | 不在本分件定义 | `6R-05` adapter outcome / availability；Step 7 adapter；Step 14 config |
| `api/worker/jobs` | 不在本分件定义 | `6R-05` entry carrier；Step 8 / 9 exact protocol / flow |

---

## 8. Canonical inventory 与正文顺序

| # | canonical type / family | category | identity | target section | state |
|---:|---|---|---|---|---|
| 1 | `PolicySourceRequirementSet` | policy support value | embedded | §10.1 | completed |
| 2 | `PolicyAuthorizationSummary` | body-free summary value | embedded | §10.2 | completed |
| 3 | `HighRiskActionMarker`;`HighRiskActionMarkerSet` | marker value / set | marker key embedded | §10.3 | completed |
| 4 | `PolicyApplicabilitySnapshot` | immutable external snapshot | named ref | §11.1 | completed |
| 5 | `PolicyApplicabilityDecision` | guard decision value | embedded | §11.3 | completed |
| 6 | `PolicyApplicabilityGuard` | immutable guard | named ref | §11.4 | completed |
| 7 | `FailClosedPolicyDecision` | guard decision value | embedded | §12.3 | completed |
| 8 | `FailClosedPolicyGuard` | immutable guard | named ref | §12.4 | completed |
| 9 | `HighRiskActionDecision`;`HighRiskActionDecisionSet` | immutable decision / set | named refs | §12.1 | completed |
| 10 | `PolicyExecutionDecision` | immutable aggregate decision | named ref | §12.5 | completed |
| 11 | `PolicyDecisionSummaryView` | public read view | named view ref | §13 | completed |
| 12 | `ControlledExecutionRun` | lifecycle truth entity | named ref | §14 | completed_review_confirmed |
| 13 | `ExecutionOutputSummary` | body-free capture summary | embedded | §15.1 | completed_batch_4 |
| 14 | `CaptureMaterialRequirementSet` | capture requirement value | embedded | §15.2 | completed_batch_4 |
| 15 | `CapturedMaterialRef`;`CapturedMaterialRefSet` | material lifecycle value / set | material key embedded | §16 | completed_batch_4 |
| 16 | `ObservabilityMaterial` | body-free material truth | named ref | §17 | closed_batch_5_review_confirmed |
| 17 | `CaptureCompletenessDecision` | guard decision value | embedded | §18.1 | completed_batch_4 |
| 18 | `CaptureCompletenessGuard` | immutable guard | named ref | §18.2 | completed_batch_4 |
| 19 | `CaptureFact` | immutable capture fact | named ref | §19 | completed_batch_4 |
| 20 | `HandoffTarget`;`HandoffTargetSet` | downstream target plan value / set | external target key | §20.1 | closed_batch_5_review_confirmed |
| 21 | `HandoffTargetProgress`;`HandoffTargetProgressSet` | per-target progress value / set | target key | §20.2 | closed_batch_5_review_confirmed |
| 22 | `HandoffOwnershipDecision`;`HandoffOwnershipGuard` | decision / immutable guard | guard named ref | §21 | closed_batch_5_review_confirmed |
| 23 | `HandoffFact` | handoff lifecycle truth | named ref | §22 | closed_batch_5_review_confirmed |
| 24 | `CaptureSummaryView`;`MaterialHandoffStatusView` | public read views | named view refs | §23~§24 | closed_batch_6_review_confirmed |

Registry mapping固定如下：`S6T-03-001 -> #1~4`，`002 -> #10`，`003 -> #3/#9`，`004 -> #5~8`，`005 -> #11`，`006 -> #12`，`007 -> #13/#14/#17~19`，`008 -> #15`，`009 -> #16`，`010 -> #20/#21/#23`，`011 -> #17/#18/#22`，`012 -> #24`。support family 不新增独立 repository truth；若后续发现可独立持久化 / 迁移的 owner，必须先回到本表登记，不得匿名藏入集合。

---

## 9. Historical material 与 rename / invalidation ledger

| historical name / pattern | current replacement | 处置 |
|---|---|---|
| `SandboxOpaqueRef` marker / trace / target | explicit marker key、named `SandboxAuditTraceRef`、typed `ExternalSourceRef` | historical_invalid；无 alias |
| `PolicySourceRefSet` | `PolicySourceRequirementSet` 内含 `ExternalSourceRefSet` + required source kinds | old name lacks requirement semantics |
| `AuthorizationSummary` | `PolicyAuthorizationSummary` | exact finite disposition + safe summary refs |
| `PolicyAuthorizationDisposition` 旧未登记 enum | `PolicyAuthorizationDisposition` 在本批 canonical section闭口 | name retained，schema current here |
| `HighRiskActionSourceDisposition` | `PolicyAuthorizationDisposition` + marker relation | 避免第二个同义 authorization enum |
| `CapturedMaterialKind` / `CaptureStatus` / `HandoffStatus` | `MaterialKind` / `CaptureFactStatus` / `HandoffFactStatus` | canonical rename；无 alias |
| `VisibleCaptureStatus` / `VisibleHandoffStatus` | owning canonical statuses + degraded reason set | historical_invalid second status owner |
| `MaterialSourceContext` / `CapturedMaterialSafetySummary` | typed external source / safe summary refs + digest + finite status | name-only carrier removed |
| `DownstreamHandoffRef` / `HandoffTargetRefSet` | `HandoffTarget` / set + `HandoffFactRef` | target 与 handoff truth分离 |
| accepted policy原地重判 | new immutable snapshot / action decisions / policy decision | historical_invalid transition |
| caller bool `policy_ok` / `lease_active` / `capture_complete` | exact owner methods / guard decisions | forbidden bypass |
| one aggregate handoff status without target progress | target progress set + derived aggregate status | historical_invalid data loss |
| generic `DomainError::InvalidStateTransition` | object-owned exact error enums | Step 10 consumer revalidation pending |

---

## 10. Policy source 与 high-risk marker support contract

### 10.1 `PolicySourceRequirementSet` 与 source binding

`PolicySourceRequirementSet` 表达本次 Sandbox policy evaluation 必须具备哪些外部摘要角色，不保存 policy 内容。`LaunchPolicy`、`IsolationPolicy` 与 `Authorization` 是固定最低集合；`Approval` 和 `Capability` 只能作为额外必需角色加入，不能移除最低集合。

```rust
use core_contracts::metadata::{ResourceRef, Timestamp};
use std::num::NonZeroU64;

/// 区分 Sandbox policy evaluation 需要的 body-free 外部摘要角色。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum PolicySourceRole {
    /// 决定是否允许启动本次受控执行的 launch policy 摘要。
    LaunchPolicy,
    /// 约束隔离边界、后端使用和环境行为的 isolation policy 摘要。
    IsolationPolicy,
    /// 对 actor / caller / action 给出有限授权结论的摘要。
    Authorization,
    /// 当前调用方明确要求时使用的 approval 结果摘要。
    Approval,
    /// 当前调用方明确要求时使用的 capability 适用摘要。
    Capability,
}

/// 保存 canonical 顺序且不重复的必需 policy source roles。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicySourceRequirementSet(Vec<PolicySourceRole>);

impl PolicySourceRequirementSet {
    /// 构造至少包含 launch、isolation 和 authorization 的严格要求集合。
    pub fn try_strict(
        required_roles: Vec<PolicySourceRole>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回 canonical role 顺序的只读切片。
    pub fn as_slice(&self) -> &[PolicySourceRole];

    /// 判断指定 role 是否为本次 evaluation 的必需输入。
    pub fn contains(&self, role: PolicySourceRole) -> bool;
}

/// 把一个必需 policy role 绑定到外部 source 与同源 safe summary。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicySourceBinding {
    /// 本 binding 承接的 policy source role。
    role: PolicySourceRole,
    /// 外部 policy owner 提供的 versioned body-free source ref。
    source_ref: ExternalSourceRef,
    /// resolver / adapter 提供的 body-free safe summary ref。
    summary_ref: SafeSummaryRef,
    /// adapter 观察到本 policy summary 的 canonical time。
    observed_at: Timestamp,
    /// 外部 owner / validated profile 给出的正 freshness window。
    freshness_window_millis: NonZeroU64,
}

impl PolicySourceBinding {
    /// 从 `Policy` source 与 summary 构造一个 versioned role binding。
    pub fn try_new(
        role: PolicySourceRole,
        source_ref: ExternalSourceRef,
        summary_ref: SafeSummaryRef,
        observed_at: Timestamp,
        freshness_window_millis: u64,
    ) -> Result<Self, PolicySupportError>;

    /// 返回本 binding 的 policy role。
    pub fn role(&self) -> PolicySourceRole;

    /// 返回外部 policy source ref，不读取其正文。
    pub fn source_ref(&self) -> &ExternalSourceRef;

    /// 返回同 role 的 safe summary ref。
    pub fn summary_ref(&self) -> &SafeSummaryRef;

    /// 返回 adapter 观察 policy summary 的 canonical time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 返回该 source summary 的正 freshness window。
    pub fn freshness_window_millis(&self) -> NonZeroU64;
}

/// 保存 `(role, source identity)` 唯一且 canonical 排序的 policy source bindings。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicySourceBindingSet(Vec<PolicySourceBinding>);

impl PolicySourceBindingSet {
    /// 构造允许为空或部分覆盖的 observed binding set；重复 role/source pair 必须拒绝。
    pub fn try_new(
        bindings: Vec<PolicySourceBinding>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回 canonical role 顺序的只读 binding 切片。
    pub fn as_slice(&self) -> &[PolicySourceBinding];

    /// 返回相对 strict requirement 缺失的 roles，顺序与 requirement 相同。
    pub fn missing_roles_against(
        &self,
        requirements: &PolicySourceRequirementSet,
    ) -> Vec<PolicySourceRole>;

    /// 判断 observed bindings 是否与 requirement 双向完整相等。
    pub fn exactly_covers(
        &self,
        requirements: &PolicySourceRequirementSet,
    ) -> bool;

    /// 返回指定 required role 是否至少存在一个 source binding。
    pub fn contains_role(&self, role: PolicySourceRole) -> bool;
}

/// application clock 对一个 policy source binding 生成的 checked-age 结果。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicySourceFreshnessCheck {
    /// 被检查的 policy source role。
    role: PolicySourceRole,
    /// 被检查的 exact external policy source ref。
    source_ref: ExternalSourceRef,
    /// checked_at - binding.observed_at 的安全 elapsed milliseconds。
    checked_age_millis: u64,
}

impl PolicySourceFreshnessCheck {
    /// 从 clock port 的 checked elapsed output 构造 freshness check。
    pub fn new(
        role: PolicySourceRole,
        source_ref: ExternalSourceRef,
        checked_age_millis: u64,
    ) -> Self;

    /// 返回被检查的 policy source role。
    pub fn role(&self) -> PolicySourceRole;

    /// 返回被检查的 exact external source ref。
    pub fn source_ref(&self) -> &ExternalSourceRef;

    /// 返回 checked elapsed milliseconds。
    pub fn checked_age_millis(&self) -> u64;
}

/// 保存与 binding set 一一对应的 policy source freshness checks。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicySourceFreshnessCheckSet(Vec<PolicySourceFreshnessCheck>);

impl PolicySourceFreshnessCheckSet {
    /// 构造 `(role, source identity)` 唯一的 checked-age set。
    pub fn try_new(
        checks: Vec<PolicySourceFreshnessCheck>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回 canonical `(role, source)` 顺序的只读切片。
    pub fn as_slice(&self) -> &[PolicySourceFreshnessCheck];

    /// 校验与 binding set 一一对应，并返回最短剩余 freshness window。
    pub fn effective_remaining_window_millis(
        &self,
        bindings: &PolicySourceBindingSet,
    ) -> Result<NonZeroU64, PolicySupportError>;
}

/// 区分缺失 policy source 是否仍在可信等待窗口内。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum PolicySourceGapDisposition {
    /// resolver / adapter 明确表示可信摘要仍在生成或刷新中。
    AwaitingTrustedSummary,
    /// 本次正式 evaluation 时无法取得必需摘要，必须 fail-closed。
    UnavailableAtEvaluation,
}

/// 记录一个 required policy role 的 body-free 缺失事实。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicySourceGap {
    /// 当前缺失的 required policy role。
    role: PolicySourceRole,
    /// typed resolver outcome 映射的等待或不可用类别。
    disposition: PolicySourceGapDisposition,
    /// 不回显外部正文或 adapter error 的安全原因。
    reason: SandboxReason,
}

impl PolicySourceGap {
    /// 从 typed source outcome 构造一个 required-role gap。
    pub fn new(
        role: PolicySourceRole,
        disposition: PolicySourceGapDisposition,
        reason: SandboxReason,
    ) -> Self;

    /// 返回缺失的 policy source role。
    pub fn role(&self) -> PolicySourceRole;

    /// 返回 gap 的有限等待 / 不可用类别。
    pub fn disposition(&self) -> PolicySourceGapDisposition;

    /// 返回 caller-safe gap 原因。
    pub fn reason(&self) -> &SandboxReason;
}

/// 保存非空、role 唯一且 canonical 排序的 policy source gaps。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicySourceGapSet(Vec<PolicySourceGap>);

impl PolicySourceGapSet {
    /// 构造非空 gap set；重复 role 必须拒绝。
    pub fn try_non_empty(
        gaps: Vec<PolicySourceGap>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回 canonical role 顺序的只读 gap 切片。
    pub fn as_slice(&self) -> &[PolicySourceGap];

    /// 只在全部 gap 明确为可信等待时返回 true。
    pub fn all_awaiting_trusted_summary(&self) -> bool;
}
```

binding 必须满足：`source_ref.source_kind() == Policy`、`summary_ref.source_kind() == Policy`，且 `source_ref.source_version_ref()` 必须存在。summary ref 与 source ref 不互相转换；adapter 对 role / source / summary 的映射错误必须返回 typed outcome，不得让 domain 从 opaque ref、digest 或文本猜 role。

### 10.2 `PolicyAuthorizationSummary`

```rust
/// 外部 policy / authorization adapter 对 body-free summaries 给出的有限结论。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum PolicyAuthorizationDisposition {
    /// 外部摘要明确允许继续进行 Sandbox policy decision。
    Allowed,
    /// 外部摘要明确拒绝本次 actor / action / scope。
    Denied,
    /// 必需 authorization / approval 摘要尚未齐备。
    Pending,
    /// 当前 policy source 明确不支持所请求的授权判断。
    Unsupported,
    /// 多个已验证摘要给出不可调和的授权结论。
    Conflicted,
}

/// 保存给定 policy owner 的 body-free authorization 结论与摘要引用。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyAuthorizationSummary {
    /// 本 authorization summary 唯一评估的 accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// 与 context 匹配的 active environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// 本 summary 唯一评估的 immutable boundary requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 summary 唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 使用的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// established boundary 原子关联的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// requirement、boundary 与 capability 共用的 generation。
    generation_ref: ResourceRef,
    /// 支撑有限 disposition 的 policy safe summary refs。
    summary_refs: SafeSummaryRefSet,
    /// adapter 显式映射的有限 authorization disposition。
    disposition: PolicyAuthorizationDisposition,
    /// 非 `Allowed` disposition 必有的 caller-safe 原因。
    reason: Option<SandboxReason>,
}

impl PolicyAuthorizationSummary {
    /// 从 policy safe summaries 与显式 disposition 构造 authorization summary。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        requirement_ref: BoundaryRequirementSetRef,
        boundary_ref: CoherentBoundaryRef,
        capability_ref: BackendCapabilitySummaryRef,
        handle_ref: IsolationEnvironmentHandleRef,
        generation_ref: ResourceRef,
        summary_refs: SafeSummaryRefSet,
        disposition: PolicyAuthorizationDisposition,
        reason: Option<SandboxReason>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回 authorization summary 唯一评估的 context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;

    /// 返回 summary 绑定的 active environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;

    /// 返回 summary 唯一评估的 boundary requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;

    /// 返回 summary 唯一评估的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;

    /// 返回 summary 绑定的 capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;

    /// 返回 summary 绑定的 isolation handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;

    /// 返回 policy evaluation 使用的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;

    /// 返回支撑 authorization disposition 的 safe summary refs。
    pub fn summary_refs(&self) -> &SafeSummaryRefSet;

    /// 返回 adapter 显式给出的 finite disposition。
    pub fn disposition(&self) -> PolicyAuthorizationDisposition;

    /// 返回 non-allowed disposition 的 caller-safe 原因。
    pub fn reason(&self) -> Option<&SandboxReason>;

    /// 只在 disposition 明确为 `Allowed` 时返回 true。
    pub fn is_allowed(&self) -> bool;
}
```

`Allowed` 要求 summary set 非空且 reason 为 `None`；`Denied | Unsupported | Conflicted` 要求 summary set 非空且 reason 为 `Some`；`Pending` 允许 summary set 为空或部分存在，但 reason 必须为 `Some`。所有 summary source kind 必须为 `Policy`。`SandboxReason` 不能被解析回 disposition。

### 10.3 `HighRiskActionMarker` 与 marker set

```rust
/// 标识一个 policy adapter 已稳定识别的 body-free high-risk marker。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct HighRiskActionMarkerKey(ResourceRef);

impl HighRiskActionMarkerKey {
    /// 从 policy adapter 提供的非空稳定 marker identity 构造 key。
    pub fn try_from_adapter(
        marker_ref: ResourceRef,
    ) -> Result<Self, PolicySupportError>;

    /// 返回 opaque marker resource ref；不得解析其字符串结构。
    pub fn as_resource_ref(&self) -> &ResourceRef;
}

/// 一个不携带 tool、runtime、policy 或 command 正文的 high-risk action marker。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HighRiskActionMarker {
    /// adapter 提供的稳定 marker key。
    marker_key: HighRiskActionMarkerKey,
    /// Sandbox canonical high-risk action category。
    action_kind: HighRiskActionKind,
    /// 本 marker 唯一评估的 immutable boundary requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 marker 唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 使用的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// established boundary 原子关联的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// requirement、boundary 与 capability 共用的 generation。
    generation_ref: ResourceRef,
    /// 该动作可能影响的非空 canonical boundary kind set。
    affected_boundary_kinds: HighRiskBoundaryKindSet,
    /// 动作与 established boundary 的有限关系。
    boundary_relation: HighRiskBoundaryRelation,
    /// marker 表达请求意图还是已观察到的越界尝试。
    observation_kind: HighRiskActionObservationKind,
    /// 只在 `ObservedAttempt` 时存在的 exact controlled run ref。
    observed_run_ref: Option<ControlledExecutionRunRef>,
    /// 产生 marker 的 policy body-free source ref。
    source_ref: ExternalSourceRef,
    /// 描述 marker 的 policy safe summary ref。
    summary_ref: SafeSummaryRef,
    /// 外部 owner 对该动作给出的 explicit authorization disposition。
    authorization_disposition: PolicyAuthorizationDisposition,
    /// non-allowed disposition 必有的 caller-safe 原因。
    reason: Option<SandboxReason>,
}

impl HighRiskActionMarker {
    /// 从 policy adapter 的 typed output 构造 immutable high-risk marker。
    pub fn try_from_policy_summary(
        marker_key: HighRiskActionMarkerKey,
        action_kind: HighRiskActionKind,
        requirement_ref: BoundaryRequirementSetRef,
        boundary_ref: CoherentBoundaryRef,
        capability_ref: BackendCapabilitySummaryRef,
        handle_ref: IsolationEnvironmentHandleRef,
        generation_ref: ResourceRef,
        affected_boundary_kinds: HighRiskBoundaryKindSet,
        boundary_relation: HighRiskBoundaryRelation,
        observation_kind: HighRiskActionObservationKind,
        observed_run_ref: Option<ControlledExecutionRunRef>,
        source_ref: ExternalSourceRef,
        summary_ref: SafeSummaryRef,
        authorization_disposition: PolicyAuthorizationDisposition,
        reason: Option<SandboxReason>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回稳定 marker key。
    pub fn marker_key(&self) -> &HighRiskActionMarkerKey;

    /// 返回 canonical high-risk action kind。
    pub fn action_kind(&self) -> HighRiskActionKind;

    /// 返回本 marker 唯一评估的 boundary requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;

    /// 返回本 marker 唯一评估的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;

    /// 返回 marker 绑定的 capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;

    /// 返回 marker 绑定的 isolation handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;

    /// 返回 marker 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;

    /// 返回 action 可能影响的 canonical boundary kinds。
    pub fn affected_boundary_kinds(&self) -> &HighRiskBoundaryKindSet;

    /// 返回 action 与 established boundary 的有限关系。
    pub fn boundary_relation(&self) -> HighRiskBoundaryRelation;

    /// 返回 marker 是请求意图还是已观察的尝试。
    pub fn observation_kind(&self) -> HighRiskActionObservationKind;

    /// 返回运行期已观察尝试唯一绑定的 exact run ref。
    pub fn observed_run_ref(&self) -> Option<&ControlledExecutionRunRef>;

    /// 返回产生 marker 的 policy source ref。
    pub fn source_ref(&self) -> &ExternalSourceRef;

    /// 返回 marker 的 body-free safe summary ref。
    pub fn summary_ref(&self) -> &SafeSummaryRef;

    /// 返回外部 owner 的 explicit disposition。
    pub fn authorization_disposition(&self) -> PolicyAuthorizationDisposition;

    /// 返回 non-allowed disposition 的 caller-safe 原因。
    pub fn reason(&self) -> Option<&SandboxReason>;
}

/// 保存 marker key 唯一且 canonical 排序的 high-risk action markers。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HighRiskActionMarkerSet(Vec<HighRiskActionMarker>);

impl HighRiskActionMarkerSet {
    /// 构造可为空的 marker set；重复 key 或重复 source / kind relation 必须拒绝。
    pub fn try_new(
        markers: Vec<HighRiskActionMarker>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回按 marker key 稳定排序的只读切片。
    pub fn as_slice(&self) -> &[HighRiskActionMarker];

    /// 返回指定 marker key 对应的 immutable marker。
    pub fn get(
        &self,
        marker_key: &HighRiskActionMarkerKey,
    ) -> Option<&HighRiskActionMarker>;

    /// 返回 marker 数量，用于一一裁定 completeness audit。
    pub fn len(&self) -> usize;

    /// 判断本次 policy snapshot 是否没有 high-risk marker。
    pub fn is_empty(&self) -> bool;
}

/// 区分 high-risk action 与当前 established boundary 的关系。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum HighRiskBoundaryRelation {
    /// 动作完全处于当前 established requirement / capability 内。
    WithinEstablishedBoundary,
    /// 动作要求扩大当前 resource / filesystem / network / process 等边界。
    RequiresBoundaryExpansion,
    /// 当前 established capability 明确无法安全承载该动作。
    UnsupportedByCapability,
}

/// 区分 policy evaluation 的动作请求与运行期已观察动作。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum HighRiskActionObservationKind {
    /// launch 前请求方声明或 policy adapter识别的动作意图。
    Requested,
    /// backend / control adapter 已观察到的动作尝试；可能触发 redline 承接。
    ObservedAttempt,
}

/// 保存非空、无重复且按 `BoundaryLimitKind` canonical 顺序排列的受影响维度。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HighRiskBoundaryKindSet(Vec<BoundaryLimitKind>);

impl HighRiskBoundaryKindSet {
    /// 构造 non-empty ordered-unique boundary kind set，并校验 action-kind coverage。
    pub fn try_for_action(
        action_kind: HighRiskActionKind,
        kinds: Vec<BoundaryLimitKind>,
    ) -> Result<Self, PolicySupportError>;

    /// 返回 canonical boundary kind 顺序的只读切片。
    pub fn as_slice(&self) -> &[BoundaryLimitKind];

    /// 判断指定 boundary kind 是否受该 high-risk action 影响。
    pub fn contains(&self, kind: BoundaryLimitKind) -> bool;
}
```

marker source / summary kind 都必须为 `Policy`，source 必须 versioned。`Requested` 要求 `observed_run_ref == None`；`ObservedAttempt` 要求 `observed_run_ref == Some(explicit typed run ref)`。该ref必须来自运行期 trusted mapper 的 typed observation，不得从boundary、handle、marker key或source ref文本推导，也不得通过“当前boundary最新run”扫描补齐。marker factory只闭合cardinality和typed identity；run status、requirement / boundary / capability / handle / generation完整关系由`6R-04 RedlineSignal::from_high_risk_decision`加载exact run后再次校验。缺失或cardinality错误返回`HighRiskObservedRunRelationInvalid`。`HighRiskActionKind::Unknown` 与 `Allowed` disposition 是非法组合；unknown 只能是 `Pending | Unsupported | Conflicted | Denied`，后续不得形成 `Allowed` decision。marker key 不等于 repository identity，不进入 `SandboxObjectRefKind`，也不能转换成 `HighRiskActionDecisionRef`。

`HighRiskActionMarkerSet::try_new` 还必须保持单一 observation scope：一个set要么全部是`Requested + None`，要么全部是`ObservedAttempt + 同一个 observed_run_ref`；混合launch请求与运行期观察、或把多个run的观察塞入同一snapshot均返回`HighRiskObservationScopeMismatch`。duplicate source/action key对requested marker使用`(source_ref, action_kind, None)`，对observed marker使用`(source_ref, action_kind, Some(run_ref))`，因此不同run的事件必须进入不同snapshot，而不是互相覆盖。

boundary kind coverage 规则固定：`FilesystemExpansion` 只能使用 `Filesystem | Workspace | Mount` 且至少一项；`NetworkEgress` 必须且只能含 `Network`；`ProcessEscape` 必须含 `Process`，可同时含 `Filesystem | Workspace | Mount | Network`；`ResourceExpansion` 只能使用 `Cpu | Memory | WallClock | Io | Process` 且至少一项；`SecretExposure` 只能使用 `Filesystem | Workspace | Mount | Network | Process` 且至少一项；`Unknown` 可包含任意 canonical kind，但永远不能形成 allowed relation。`WithinEstablishedBoundary + UnsupportedByCapability` 之类矛盾不通过 factory。

### 10.4 `PolicySupportError`

```rust
/// policy source、authorization summary 或 high-risk marker support contract 失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicySupportError {
    /// strict source requirement 缺少固定最低 role。
    MissingMandatoryPolicyRole {
        /// 缺失的 mandatory policy role。
        role: PolicySourceRole,
    },
    /// source requirement set 出现重复 role。
    DuplicatePolicyRoleRequirement {
        /// 重复要求的 policy role。
        role: PolicySourceRole,
    },
    /// binding set 出现重复 `(role, source identity)`。
    DuplicatePolicyRoleSource,
    /// source gap set 为空，不能表达 `Missing` snapshot。
    EmptyPolicySourceGapSet,
    /// source gap set 出现重复 required role。
    DuplicatePolicySourceGapRole {
        /// 重复出现的 missing policy role。
        role: PolicySourceRole,
    },
    /// policy source / summary 实际 source kind 不是 `Policy`。
    PolicySourceKindInvalid {
        /// 被拒绝的 external source kind。
        actual: ExternalSourceKind,
    },
    /// policy source 没有 version ref，无法做 freshness / conflict 归因。
    PolicySourceVersionMissing {
        /// 缺少 version 的 policy role。
        role: PolicySourceRole,
    },
    /// policy source 的 freshness window 为零。
    ZeroPolicySourceFreshnessWindow {
        /// window 不合法的 policy role。
        role: PolicySourceRole,
    },
    /// policy source observation time 不满足 canonical timestamp contract。
    PolicySourceObservationTimestampInvalid {
        /// observation time 不合法的 policy role。
        role: PolicySourceRole,
    },
    /// freshness check set 出现重复 `(role, source identity)`。
    DuplicatePolicyFreshnessCheck,
    /// freshness checks 与 policy source bindings 没有一一对应。
    PolicyFreshnessCheckCoverageMismatch,
    /// 至少一个 policy source 在 snapshot assembly 时已经到期。
    PolicySourceAlreadyExpired {
        /// 已到期的 policy role。
        role: PolicySourceRole,
    },
    /// authorization disposition 与 summary set / reason 关系不一致。
    AuthorizationSummaryRelationInvalid {
        /// 关系不合法的 finite disposition。
        disposition: PolicyAuthorizationDisposition,
    },
    /// high-risk marker key 的 opaque resource ref 为空。
    EmptyHighRiskMarkerKey,
    /// marker set 出现重复 marker key。
    DuplicateHighRiskMarkerKey,
    /// marker set 对同一 source / action kind 给出多个 marker。
    DuplicateHighRiskSourceAction,
    /// marker 或 authorization summary 评估的 requirement 与 snapshot 输入不一致。
    PolicyRequirementRelationMismatch,
    /// authorization summary 的 context / identity 与 requirement lineage 不一致。
    PolicyContextIdentityRelationMismatch,
    /// high-risk action 的 affected boundary kind set 为空。
    EmptyHighRiskBoundaryKindSet,
    /// affected boundary kind set 出现重复 kind。
    DuplicateHighRiskBoundaryKind {
        /// 重复出现的 canonical boundary kind。
        kind: BoundaryLimitKind,
    },
    /// affected boundary kinds 不符合 action kind 的 closed coverage 规则。
    HighRiskBoundaryKindCoverageInvalid {
        /// coverage 与之冲突的 high-risk action kind。
        action_kind: HighRiskActionKind,
    },
    /// marker 的 authorization、boundary relation 或 action kind 组合矛盾。
    HighRiskMarkerRelationInvalid,
    /// observation kind 与 optional exact observed run ref不满足 `Requested=None / ObservedAttempt=Some`。
    HighRiskObservedRunRelationInvalid,
    /// marker set混合 requested / observed scope或包含多个observed run。
    HighRiskObservationScopeMismatch,
    /// `Unknown` action 被错误标记为允许。
    UnknownHighRiskActionWasAllowed,
    /// marker disposition 与 reason 有无关系不一致。
    HighRiskMarkerReasonRelationInvalid {
        /// 关系不合法的 finite disposition。
        disposition: PolicyAuthorizationDisposition,
    },
}
```

support error 只描述 domain relation，不携带 raw policy body、原始 authorization response、marker正文、external error text 或 secret。Step 12 的 public mapping 必须穷尽本 enum；当前不得用 generic validation message 替代。

---

## 11. Policy applicability snapshot 与 guard contract

### 11.1 `PolicyApplicabilitySnapshot`

```rust
use std::num::NonZeroU64;

/// 给定 context / requirement 下 policy 与 authorization body-free 输入的 immutable snapshot。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyApplicabilitySnapshot {
    /// 本 immutable policy snapshot 的 typed identity。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// snapshot 唯一评估的 accepted controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// 与 context 同 lineage 的 active environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// snapshot 唯一评估的 immutable boundary requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// snapshot 唯一评估的 established coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 使用的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// established boundary 原子关联的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// requirement、boundary、capability 与 policy snapshot 共用的 generation。
    generation_ref: ResourceRef,
    /// 本次 evaluation 固定要求的 policy source roles。
    required_sources: PolicySourceRequirementSet,
    /// 已取得且 role 唯一的 body-free policy source bindings。
    source_bindings: PolicySourceBindingSet,
    /// `Missing` 状态必有的 required source gaps。
    source_gaps: Option<PolicySourceGapSet>,
    /// 对同一 context / identity / requirement 的 authorization summary。
    authorization_summary: PolicyAuthorizationSummary,
    /// policy adapter 对本次 requirement 检出的完整 high-risk markers。
    high_risk_markers: HighRiskActionMarkerSet,
    /// snapshot 的 canonical applicability status。
    applicability_status: PolicyApplicabilityStatus,
    /// 非 `Applicable` 状态必有的 caller-safe 原因。
    status_reason: Option<SandboxReason>,
    /// application clock 完成全部 source freshness checks 的组装时间。
    assembled_at: Timestamp,
    /// `Applicable` snapshot 在组装时计算的正 effective remaining window。
    freshness_window_millis: Option<NonZeroU64>,
}

impl PolicyApplicabilitySnapshot {
    /// 构造 source 完整、可明确裁定且具有正 freshness window 的 snapshot。
    pub fn applicable(
        snapshot_ref: PolicyApplicabilitySnapshotRef,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        boundary: &CoherentBoundary,
        capability: &BackendCapabilitySummary,
        required_sources: PolicySourceRequirementSet,
        source_bindings: PolicySourceBindingSet,
        freshness_checks: PolicySourceFreshnessCheckSet,
        authorization_summary: PolicyAuthorizationSummary,
        high_risk_markers: HighRiskActionMarkerSet,
        assembled_at: Timestamp,
    ) -> Result<Self, PolicyApplicabilitySnapshotError>;

    /// 构造必需 source 尚未齐备的 snapshot；gap 决定后续 Pending 或 FailClosed。
    pub fn missing(
        snapshot_ref: PolicyApplicabilitySnapshotRef,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        boundary: &CoherentBoundary,
        capability: &BackendCapabilitySummary,
        required_sources: PolicySourceRequirementSet,
        source_bindings: PolicySourceBindingSet,
        source_gaps: PolicySourceGapSet,
        authorization_summary: PolicyAuthorizationSummary,
        high_risk_markers: HighRiskActionMarkerSet,
        reason: SandboxReason,
        assembled_at: Timestamp,
    ) -> Result<Self, PolicyApplicabilitySnapshotError>;

    /// 构造 policy / authorization summaries 存在不可调和冲突的 snapshot。
    pub fn conflicted(
        snapshot_ref: PolicyApplicabilitySnapshotRef,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        boundary: &CoherentBoundary,
        capability: &BackendCapabilitySummary,
        required_sources: PolicySourceRequirementSet,
        source_bindings: PolicySourceBindingSet,
        authorization_summary: PolicyAuthorizationSummary,
        high_risk_markers: HighRiskActionMarkerSet,
        reason: SandboxReason,
        assembled_at: Timestamp,
    ) -> Result<Self, PolicyApplicabilitySnapshotError>;

    /// 构造 policy source 或当前 action / boundary 明确不受支持的 snapshot。
    pub fn unsupported(
        snapshot_ref: PolicyApplicabilitySnapshotRef,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        boundary: &CoherentBoundary,
        capability: &BackendCapabilitySummary,
        required_sources: PolicySourceRequirementSet,
        source_bindings: PolicySourceBindingSet,
        authorization_summary: PolicyAuthorizationSummary,
        high_risk_markers: HighRiskActionMarkerSet,
        reason: SandboxReason,
        assembled_at: Timestamp,
    ) -> Result<Self, PolicyApplicabilitySnapshotError>;

    /// 构造 adapter 已明确标记过期的 immutable snapshot。
    pub fn stale(
        snapshot_ref: PolicyApplicabilitySnapshotRef,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        boundary: &CoherentBoundary,
        capability: &BackendCapabilitySummary,
        required_sources: PolicySourceRequirementSet,
        source_bindings: PolicySourceBindingSet,
        authorization_summary: PolicyAuthorizationSummary,
        high_risk_markers: HighRiskActionMarkerSet,
        reason: SandboxReason,
        assembled_at: Timestamp,
    ) -> Result<Self, PolicyApplicabilitySnapshotError>;

    /// 返回 immutable policy snapshot identity。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;

    /// 返回 snapshot 唯一评估的 controlled execution context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;

    /// 返回 snapshot 绑定的 active environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;

    /// 返回 snapshot 唯一评估的 boundary requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;

    /// 返回 snapshot 唯一评估的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;

    /// 返回 established boundary 使用的 capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;

    /// 返回 established boundary 原子关联的 isolation handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;

    /// 返回 policy snapshot 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;

    /// 返回本次 evaluation 的 strict source requirements。
    pub fn required_sources(&self) -> &PolicySourceRequirementSet;

    /// 返回已取得的 body-free policy source bindings。
    pub fn source_bindings(&self) -> &PolicySourceBindingSet;

    /// 返回 `Missing` snapshot 的 source gaps。
    pub fn source_gaps(&self) -> Option<&PolicySourceGapSet>;

    /// 返回同 lineage 的 body-free authorization summary。
    pub fn authorization_summary(&self) -> &PolicyAuthorizationSummary;

    /// 返回本 snapshot 的 complete high-risk marker set。
    pub fn high_risk_markers(&self) -> &HighRiskActionMarkerSet;

    /// 返回 canonical policy applicability status。
    pub fn applicability_status(&self) -> PolicyApplicabilityStatus;

    /// 返回 non-applicable snapshot 的 caller-safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;

    /// 返回全部 source freshness checks 完成的 snapshot 组装时间。
    pub fn assembled_at(&self) -> &Timestamp;

    /// 返回 `Applicable` snapshot 的正 freshness window。
    pub fn freshness_window_millis(&self) -> Option<NonZeroU64>;

    /// 只在 `Applicable` 且 checked age 未到 freshness window 时返回 true。
    pub fn is_applicable_at_age(&self, checked_age_millis: u64) -> bool;

    /// 判断 snapshot 是否必须创建新 snapshot 后才能重新评估。
    pub fn requires_refresh_at_age(&self, checked_age_millis: u64) -> bool;
}
```

| factory | source coverage | authorization / marker relation | gaps | freshness |
|---|---|---|---|---|
| `applicable` | exact required coverage + one freshness check per binding | authorization `Allowed | Denied`；marker disposition 仅 `Allowed | Denied` | `None` | minimum positive remaining window |
| `missing` | bindings + gaps 对 required roles 恰好分区 | authorization或 marker允许 `Pending`；不得出现 unexplained missing | non-empty | `None` |
| `conflicted` | 可完整或部分，但所有出现 binding 仍合法 | authorization或至少一个 marker `Conflicted` | `None` | `None` |
| `unsupported` | 可完整或部分，但所有出现 binding 仍合法 | authorization或至少一个 marker `Unsupported` | `None` | `None` |
| `stale` | exact required coverage | 原 summary relation 可明确，但 adapter 已声明 stale | `None` | `None` |

所有 factory 先要求 context `Accepted`、identity `Active` 且 `identity.require_active_for(context)` 成立；requirements 的 context / identity refs 必须相等。boundary 必须 `Established`，`boundary.require_established_links()` 返回的 requirement / capability / handle / generation 必须与显式 requirements / capability及 committed handle relation相等。authorization summary 和全部 marker 必须引用相同 context / identity / requirement / boundary / capability / handle / generation；每个 marker 的 source / summary pair 必须存在于 bindings。source / summary / marker 不得包含 `PolicyDefinitionBody`、`ToolSemanticBody`、`RuntimeLoopBody` 或 `SecretMaterial` 正文。

`Applicable` factory 要求 freshness check set 与 binding set 一一对应，每个 `checked_age_millis < binding.freshness_window_millis`；然后保存所有 source 剩余窗口的最小值。后续 snapshot 有效性由 `evaluated_at - assembled_at < effective_remaining_window` 判断，equality 已过期。`Applicable` 到期不原地改成 `Stale`，而是 guard 在该次 evaluation 中 fail-closed，并要求刷新创建新 snapshot。`Stale` 表达 adapter在 snapshot 创建时已明确知道输入过期。

### 11.2 `PolicyApplicabilitySnapshotError`

```rust
/// policy snapshot 的 lineage、source coverage、status 或 freshness 不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyApplicabilitySnapshotError {
    /// snapshot 输入 context 未处于 `Accepted`。
    ContextWasNotAccepted {
        /// context 实际 canonical intake status。
        actual: ControlledExecutionIntakeStatus,
    },
    /// environment identity 未处于 `Active`。
    IdentityWasNotActive {
        /// identity 实际 canonical status。
        actual: ExecutionEnvironmentIdentityStatus,
    },
    /// context、identity 与 requirements 不属于同一 lineage。
    ContextIdentityRequirementMismatch,
    /// boundary 未处于 `Established` 或 established links 不完整。
    BoundaryWasNotEstablished,
    /// boundary established links 与 requirement / capability / generation 不一致。
    BoundaryPolicyLineageMismatch,
    /// authorization summary 与目标 context / identity / requirement 不一致。
    AuthorizationSummaryRelationMismatch,
    /// marker 评估的 requirement 与 snapshot requirement 不一致。
    HighRiskMarkerRequirementMismatch {
        /// relation 不匹配的 marker key。
        marker_key: HighRiskActionMarkerKey,
    },
    /// marker 的 source / summary pair 不存在于 snapshot bindings。
    HighRiskMarkerSourceBindingMissing {
        /// 无 source binding 的 marker key。
        marker_key: HighRiskActionMarkerKey,
    },
    /// observed bindings 未满足 factory 要求的 exact coverage。
    PolicySourceCoverageMismatch,
    /// missing gaps 与 observed bindings 未对 required roles 形成恰好分区。
    PolicySourceGapPartitionMismatch,
    /// snapshot status 与 authorization / marker disposition 不一致。
    ApplicabilityStatusRelationInvalid {
        /// 无法由输入关系证明的 status。
        status: PolicyApplicabilityStatus,
    },
    /// `Applicable` snapshot 的 freshness window 为零。
    ZeroPolicyFreshnessWindow,
    /// snapshot status 与 reason 有无关系不一致。
    ApplicabilityReasonRelationInvalid {
        /// reason 关系不合法的 status。
        status: PolicyApplicabilityStatus,
    },
    /// snapshot assembly time 不满足 canonical timestamp contract。
    PolicyAssemblyTimestampInvalid,
}
```

snapshot error 不包装 `PolicySupportError` 为字符串。application mapper 在调用 factory 前保留 exact support error；若 factory relation失败，则保留本 enum。Step 12 必须穷尽二者，不得 `_ => Internal`。

### 11.3 `PolicyApplicabilityDecision`

```rust
/// policy applicability guard 对一个 immutable snapshot 的有限判断。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum PolicyApplicabilityDecisionKind {
    /// snapshot 当前可进入 high-risk / aggregate policy decision。
    Applicable,
    /// 所有缺失 source 都由可信 resolver 明确标记为等待中。
    Pending,
    /// 缺失不可用、冲突、不支持、stale 或 checked age 到期，必须保守拒绝。
    FailClosed,
}

/// 保存 applicability guard 本次 checked-age evaluation 的 immutable decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyApplicabilityDecision {
    /// 产生本 decision 的 exact guard ref。
    guard_ref: PolicyApplicabilityGuardRef,
    /// 本 decision 唯一评估的 snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// 本 decision 唯一评估的 requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// applicability guard 的有限判断类别。
    decision_kind: PolicyApplicabilityDecisionKind,
    /// pending / fail-closed 时的 caller-safe 原因。
    reason: Option<SandboxReason>,
    /// `Applicable` decision 在 evaluated_at 时剩余的正有效窗口。
    remaining_validity_millis: Option<NonZeroU64>,
    /// clock port 对 evaluated_at - snapshot.assembled_at 给出的 checked age。
    checked_age_millis: u64,
    /// application clock 提供的 evaluation time。
    evaluated_at: Timestamp,
}

impl PolicyApplicabilityDecision {
    /// 返回产生 decision 的 policy applicability guard ref。
    pub fn guard_ref(&self) -> &PolicyApplicabilityGuardRef;

    /// 返回本次 evaluation 使用的 policy snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;

    /// 返回本次 evaluation 的 immutable requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;

    /// 返回 finite applicability decision kind。
    pub fn decision_kind(&self) -> PolicyApplicabilityDecisionKind;

    /// 返回 pending / fail-closed 的 caller-safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;

    /// 返回 applicable decision 在 evaluation 时剩余的正有效窗口。
    pub fn remaining_validity_millis(&self) -> Option<NonZeroU64>;

    /// 返回与 evaluation time 同次生成的 checked snapshot age。
    pub fn checked_age_millis(&self) -> u64;

    /// 返回本次 pure evaluation time。
    pub fn evaluated_at(&self) -> &Timestamp;

    /// 只在 decision kind 为 `Applicable` 时返回 true。
    pub fn is_applicable(&self) -> bool;
}
```

### 11.4 `PolicyApplicabilityGuard`

```rust
/// 绑定一个 immutable policy snapshot 并执行 source coverage / freshness applicability 判断。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyApplicabilityGuard {
    /// immutable applicability guard identity。
    guard_ref: PolicyApplicabilityGuardRef,
    /// 本 guard 唯一评估的 policy snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// snapshot 唯一评估的 boundary requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// snapshot 唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// snapshot 与 boundary 共用的 canonical generation。
    generation_ref: ResourceRef,
    /// 本 guard 绑定的 strict source requirements。
    required_sources: PolicySourceRequirementSet,
    /// application clock 提供的 guard activation time。
    activated_at: Timestamp,
}

impl PolicyApplicabilityGuard {
    /// 绑定一个 immutable snapshot；不读取外部 policy、不刷新 summary。
    pub fn bind(
        guard_ref: PolicyApplicabilityGuardRef,
        snapshot: &PolicyApplicabilitySnapshot,
        activated_at: Timestamp,
    ) -> Result<Self, PolicyApplicabilityGuardError>;

    /// 对 exact snapshot 作纯判断；checked age 必须来自 clock port。
    pub fn evaluate(
        &self,
        snapshot: &PolicyApplicabilitySnapshot,
        checked_age_millis: u64,
        evaluated_at: Timestamp,
    ) -> Result<PolicyApplicabilityDecision, PolicyApplicabilityGuardError>;

    /// 返回 immutable applicability guard identity。
    pub fn guard_ref(&self) -> &PolicyApplicabilityGuardRef;

    /// 返回本 guard 唯一评估的 snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;

    /// 返回本 guard 绑定的 immutable requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;

    /// 返回本 guard 绑定的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;

    /// 返回本 guard 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;

    /// 返回本 guard 固定的 strict source requirements。
    pub fn required_sources(&self) -> &PolicySourceRequirementSet;

    /// 返回 guard activation time。
    pub fn activated_at(&self) -> &Timestamp;
}

/// policy applicability guard 的 binding、freshness 或 relation 失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyApplicabilityGuardError {
    /// evaluate 输入 snapshot ref 与 guard binding 不一致。
    SnapshotRefMismatch {
        /// guard 固定绑定的 snapshot ref。
        expected: PolicyApplicabilitySnapshotRef,
        /// evaluate 实际收到的 snapshot ref。
        actual: PolicyApplicabilitySnapshotRef,
    },
    /// snapshot requirement / boundary / generation 与 guard binding 不一致。
    SnapshotLineageMismatch,
    /// snapshot strict source requirements 与 guard binding 不一致。
    SourceRequirementMismatch,
    /// snapshot status 与 source gaps / authorization / marker relation 不一致。
    SnapshotStatusRelationInvalid {
        /// relation 无法证明的 applicability status。
        status: PolicyApplicabilityStatus,
    },
    /// applicable snapshot 缺少正 effective remaining freshness window。
    ApplicableSnapshotWindowMissing,
    /// evaluation time 不满足 canonical timestamp contract或早于 activation / assembly。
    ApplicabilityEvaluationTimestampInvalid,
    /// guard decision kind 与 reason / remaining window 关系不一致。
    ApplicabilityDecisionRelationInvalid {
        /// 关系不合法的 finite decision kind。
        decision_kind: PolicyApplicabilityDecisionKind,
    },
}
```

exact decision matrix：

| snapshot status / relation | checked age | decision | reason / remaining window |
|---|---:|---|---|
| `Applicable` 且 source / authorization / marker relation合法 | `< freshness_window` | `Applicable` | reason `None`；remaining `window - age`，正值 |
| `Applicable` | `>= freshness_window` | `FailClosed` | guard fixed expiry reason；remaining `None` |
| `Missing` 且全部 gap `AwaitingTrustedSummary` | any | `Pending` | snapshot reason；remaining `None` |
| `Missing` 且任一 gap `UnavailableAtEvaluation` | any | `FailClosed` | snapshot reason；remaining `None` |
| `Conflicted | Unsupported | Stale` | any | `FailClosed` | snapshot reason；remaining `None` |

guard 不读取 repository、policy source或 clock timestamp arithmetic；它只比较 application 提供的 checked elapsed milliseconds。`Pending` 不允许 backend launch，也不允许调用方复用旧 accepted decision。future status / gap disposition新增时必须回到本表并以穷尽 match 编译失败。

---

## 12. High-risk 与 aggregate policy decision contract

### 12.1 `HighRiskActionDecision` 与 complete set

```rust
/// 对一个 immutable high-risk marker 形成的 Sandbox action decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HighRiskActionDecision {
    /// 本 high-risk action decision 的 typed identity。
    action_decision_ref: HighRiskActionDecisionRef,
    /// 预生成且最终拥有本 action decision 的 aggregate policy decision ref。
    policy_decision_ref: PolicyExecutionDecisionRef,
    /// 本 action decision 唯一消费的 policy snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// 被一一裁定的 exact marker key。
    marker_key: HighRiskActionMarkerKey,
    /// marker 的 canonical high-risk action kind。
    action_kind: HighRiskActionKind,
    /// marker 影响的 canonical boundary kind set。
    affected_boundary_kinds: HighRiskBoundaryKindSet,
    /// action 与 established boundary 的 finite relation。
    boundary_relation: HighRiskBoundaryRelation,
    /// action 是 launch 前请求还是运行期 observed attempt。
    observation_kind: HighRiskActionObservationKind,
    /// 只在 `ObservedAttempt` 时从 marker原样复制的 exact controlled run ref。
    observed_run_ref: Option<ControlledExecutionRunRef>,
    /// 本 action decision 唯一评估的 boundary requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 action decision 唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 使用的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// established boundary 原子关联的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// marker、boundary 与 capability 共用的 generation。
    generation_ref: ResourceRef,
    /// high-risk action 的 canonical decision status。
    action_status: HighRiskActionDecisionStatus,
    /// non-allowed status 必有的 caller-safe 原因。
    decision_reason: Option<SandboxReason>,
    /// application clock 提供的 immutable decision time。
    decided_at: Timestamp,
    /// 本 action decision 对应的 audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
}

impl HighRiskActionDecision {
    /// 按 marker authorization / boundary relation机械形成 immutable action decision。
    pub fn decide(
        action_decision_ref: HighRiskActionDecisionRef,
        policy_decision_ref: PolicyExecutionDecisionRef,
        snapshot: &PolicyApplicabilitySnapshot,
        marker: &HighRiskActionMarker,
        audit_trace_ref: SandboxAuditTraceRef,
        decided_at: Timestamp,
    ) -> Result<Self, HighRiskActionDecisionError>;

    /// 返回 high-risk action decision identity。
    pub fn action_decision_ref(&self) -> &HighRiskActionDecisionRef;

    /// 返回预绑定的 aggregate policy decision ref。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;

    /// 返回本 action decision 消费的 policy snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;

    /// 返回被一一裁定的 marker key。
    pub fn marker_key(&self) -> &HighRiskActionMarkerKey;

    /// 返回 canonical high-risk action kind。
    pub fn action_kind(&self) -> HighRiskActionKind;

    /// 返回 action 影响的 boundary kinds。
    pub fn affected_boundary_kinds(&self) -> &HighRiskBoundaryKindSet;

    /// 返回 action 与 established boundary 的 finite relation。
    pub fn boundary_relation(&self) -> HighRiskBoundaryRelation;

    /// 返回 action observation kind。
    pub fn observation_kind(&self) -> HighRiskActionObservationKind;

    /// 返回运行期 observed attempt 唯一绑定的 exact run ref。
    pub fn observed_run_ref(&self) -> Option<&ControlledExecutionRunRef>;

    /// 返回本 action decision 评估的 requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;

    /// 返回本 action decision 评估的 boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;

    /// 返回本 action decision 绑定的 capability ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;

    /// 返回本 action decision 绑定的 handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;

    /// 返回本 action decision 绑定的 generation。
    pub fn generation_ref(&self) -> &ResourceRef;

    /// 返回 canonical high-risk action decision status。
    pub fn action_status(&self) -> HighRiskActionDecisionStatus;

    /// 返回 non-allowed action decision 的 caller-safe reason。
    pub fn decision_reason(&self) -> Option<&SandboxReason>;

    /// 返回 immutable action decision time。
    pub fn decided_at(&self) -> &Timestamp;

    /// 返回 action decision audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只在 action status 为 `Allowed` 时返回 true。
    pub fn is_allowed(&self) -> bool;

    /// observed non-allowed attempt 必须进入 `6R-04` redline containment 判断。
    pub fn requires_redline_containment(&self) -> bool;
}

/// 保存 named action decision refs 的 non-duplicated canonical set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HighRiskActionDecisionRefSet(Vec<HighRiskActionDecisionRef>);

impl HighRiskActionDecisionRefSet {
    /// 构造允许为空且 ref 唯一的 canonical set。
    pub fn try_new(
        refs: Vec<HighRiskActionDecisionRef>,
    ) -> Result<Self, HighRiskActionDecisionError>;

    /// 返回 canonical ref 顺序的只读切片。
    pub fn as_slice(&self) -> &[HighRiskActionDecisionRef];
}

/// 保存与 snapshot marker set 一一对应的 immutable action decisions。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HighRiskActionDecisionSet(Vec<HighRiskActionDecision>);

impl HighRiskActionDecisionSet {
    /// 校验 marker key 1:1 coverage、decision ref唯一和 aggregate owner一致。
    pub fn try_complete(
        policy_decision_ref: &PolicyExecutionDecisionRef,
        markers: &HighRiskActionMarkerSet,
        decisions: Vec<HighRiskActionDecision>,
    ) -> Result<Self, HighRiskActionDecisionError>;

    /// 返回按 marker key canonical 排序的只读 decision 切片。
    pub fn as_slice(&self) -> &[HighRiskActionDecision];

    /// 返回对应的 named action decision ref set。
    pub fn decision_refs(&self) -> HighRiskActionDecisionRefSet;

    /// 判断所有 marker 是否都已明确 `Allowed`；空集合返回 true。
    pub fn all_allowed(&self) -> bool;

    /// 判断是否存在 `Blocked` action decision。
    pub fn has_blocked(&self) -> bool;

    /// 判断是否存在 `PendingAuthorization` action decision。
    pub fn has_pending_authorization(&self) -> bool;

    /// 判断是否存在 `Unsupported` action decision。
    pub fn has_unsupported(&self) -> bool;
}
```

exact action decision matrix：

| marker relation | action decision | reason |
|---|---|---|
| disposition `Allowed` + `WithinEstablishedBoundary` + known action kind | `Allowed` | `None` |
| disposition `Pending` | `PendingAuthorization` | marker reason |
| disposition `Unsupported` 或 boundary relation `UnsupportedByCapability` | `Unsupported` | marker reason或guard fixed safe reason |
| disposition `Denied | Conflicted` | `Blocked` | marker reason |
| boundary relation `RequiresBoundaryExpansion` | `Blocked` | marker reason或guard fixed boundary-expansion reason |
| action kind `Unknown` | `PendingAuthorization` 仅当 disposition `Pending`；否则 `Blocked | Unsupported` | 必有 reason |

`decide` 必须把 marker 的 `observation_kind` 与 `observed_run_ref` 原样复制并重验 cardinality；decision不得自行选择、删除或替换 run ref。`ObservedAttempt` 本身不改变 status matrix；但只要 resulting status 非 `Allowed`，`requires_redline_containment()` 必须返回 true。`Requested` non-allowed action只阻断 launch，不凭该方法直接声称 redline truth 已成立。`ObservedAttempt` 的 non-allowed decision只有在 `observed_run_ref`存在时才能供`6R-04` redline factory消费；同一boundary多run时不得以latest scan或caller当前run补齐。redline kind mapping和containment正文属于 `6R-04`。

### 12.2 `HighRiskActionDecisionError`

```rust
/// high-risk action decision 的 marker、lineage、status 或 completeness 关系失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HighRiskActionDecisionError {
    /// marker 不属于目标 policy snapshot。
    MarkerWasNotInSnapshot {
        /// 未被 snapshot 收录的 marker key。
        marker_key: HighRiskActionMarkerKey,
    },
    /// marker 与 snapshot 的 requirement / boundary / capability / handle / generation 不一致。
    MarkerSnapshotLineageMismatch {
        /// relation 不一致的 marker key。
        marker_key: HighRiskActionMarkerKey,
    },
    /// marker / decision 的 observation kind 与 exact observed run ref cardinality不一致。
    HighRiskDecisionObservedRunRelationInvalid,
    /// action decision status 无法由 marker finite relation机械证明。
    ActionDecisionStatusInvalid {
        /// 无法证明的 high-risk action status。
        status: HighRiskActionDecisionStatus,
    },
    /// allowed action decision错误携带 reason，或 non-allowed 缺 reason。
    ActionDecisionReasonRelationInvalid {
        /// reason 关系不合法的 action status。
        status: HighRiskActionDecisionStatus,
    },
    /// decision time 不满足 canonical timestamp contract或早于 snapshot assembly。
    HighRiskDecisionTimestampInvalid,
    /// action decision ref set 出现重复 ref。
    DuplicateHighRiskActionDecisionRef,
    /// decision set 出现重复 marker key。
    DuplicateHighRiskActionDecisionMarker,
    /// decision set 中某项预绑定了另一 aggregate policy decision ref。
    HighRiskActionAggregateOwnerMismatch,
    /// action decision set 未与 marker set 形成一一对应。
    HighRiskActionDecisionCoverageMismatch,
}
```

### 12.3 `FailClosedPolicyDecision`

```rust
/// fail-closed guard 对 snapshot、authorization 与 complete action decisions 的 aggregate 判断。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FailClosedPolicyDecision {
    /// 本次 aggregate evaluation 预绑定的 formal policy decision identity。
    policy_decision_ref: PolicyExecutionDecisionRef,
    /// 产生 aggregate decision 的 exact fail-closed guard ref。
    guard_ref: FailClosedPolicyGuardRef,
    /// 本 decision 唯一消费的 policy snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// 本 decision 唯一评估的 requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 decision 唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 原子关联的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// policy relation 使用的 canonical generation。
    generation_ref: ResourceRef,
    /// 本 aggregate decision 消费的 applicability guard ref。
    applicability_guard_ref: PolicyApplicabilityGuardRef,
    /// 本次 checked-age applicability decision kind。
    applicability_kind: PolicyApplicabilityDecisionKind,
    /// snapshot 中 body-free authorization 的 finite disposition。
    authorization_disposition: PolicyAuthorizationDisposition,
    /// 与 marker set 一一对应的 high-risk action decision refs。
    action_decision_refs: HighRiskActionDecisionRefSet,
    /// aggregate guard 得出的 canonical policy execution status。
    decision_status: PolicyExecutionDecisionStatus,
    /// 非 `Accepted` status 必有的 caller-safe 原因。
    decision_reason: Option<SandboxReason>,
    /// `Accepted` status 在 evaluated_at 时剩余的正 launch validity window。
    remaining_validity_millis: Option<NonZeroU64>,
    /// application clock 提供的 aggregate evaluation time。
    evaluated_at: Timestamp,
}

impl FailClosedPolicyDecision {
    /// 返回本次 aggregate evaluation 预绑定的 formal policy decision ref。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回产生 aggregate decision 的 fail-closed guard ref。
    pub fn guard_ref(&self) -> &FailClosedPolicyGuardRef;
    /// 返回本 aggregate decision 消费的 snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回本 aggregate decision 评估的 requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回本 aggregate decision 评估的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 aggregate policy relation 绑定的 handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 aggregate policy relation 的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回本 aggregate decision 消费的 applicability guard ref。
    pub fn applicability_guard_ref(&self) -> &PolicyApplicabilityGuardRef;
    /// 返回 checked-age applicability decision kind。
    pub fn applicability_kind(&self) -> PolicyApplicabilityDecisionKind;
    /// 返回 snapshot authorization disposition。
    pub fn authorization_disposition(&self) -> PolicyAuthorizationDisposition;
    /// 返回 complete high-risk action decision refs。
    pub fn action_decision_refs(&self) -> &HighRiskActionDecisionRefSet;
    /// 返回 aggregate canonical policy execution status。
    pub fn decision_status(&self) -> PolicyExecutionDecisionStatus;
    /// 返回 non-accepted aggregate decision 的 caller-safe reason。
    pub fn decision_reason(&self) -> Option<&SandboxReason>;
    /// 返回 accepted aggregate decision 的正剩余 launch validity window。
    pub fn remaining_validity_millis(&self) -> Option<NonZeroU64>;
    /// 返回 aggregate pure evaluation time。
    pub fn evaluated_at(&self) -> &Timestamp;
    /// 只在 aggregate status 为 `Accepted` 时返回 true。
    pub fn is_accepted(&self) -> bool;
}
```

### 12.4 `FailClosedPolicyGuard`

```rust
/// 对 policy applicability、authorization 与 high-risk decisions 执行不可关闭的 fail-closed 聚合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FailClosedPolicyGuard {
    /// immutable fail-closed guard identity。
    guard_ref: FailClosedPolicyGuardRef,
    /// 本 guard 唯一评估的 policy snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// 本 guard 唯一评估的 requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 guard 唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// 本 guard 唯一评估的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// snapshot、boundary 与 handle 共用的 canonical generation。
    generation_ref: ResourceRef,
    /// application clock 提供的 guard activation time。
    activated_at: Timestamp,
}

impl FailClosedPolicyGuard {
    /// 绑定 snapshot lineage；strict semantics 不接受配置开关或 fallback mode。
    pub fn bind_strict(
        guard_ref: FailClosedPolicyGuardRef,
        snapshot: &PolicyApplicabilitySnapshot,
        activated_at: Timestamp,
    ) -> Result<Self, FailClosedPolicyGuardError>;

    /// 以固定优先级聚合 applicability、authorization 和 complete action decisions。
    pub fn evaluate(
        &self,
        policy_decision_ref: &PolicyExecutionDecisionRef,
        snapshot: &PolicyApplicabilitySnapshot,
        applicability_decision: &PolicyApplicabilityDecision,
        action_decisions: &HighRiskActionDecisionSet,
        evaluated_at: Timestamp,
    ) -> Result<FailClosedPolicyDecision, FailClosedPolicyGuardError>;

    /// 返回 immutable fail-closed guard identity。
    pub fn guard_ref(&self) -> &FailClosedPolicyGuardRef;
    /// 返回本 guard 唯一评估的 policy snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回本 guard 唯一评估的 requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回本 guard 唯一评估的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回本 guard 唯一评估的 isolation handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回本 guard 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 guard activation time。
    pub fn activated_at(&self) -> &Timestamp;
}

/// fail-closed aggregate guard 的 binding、coverage 或 decision relation 失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum FailClosedPolicyGuardError {
    /// snapshot ref 与 strict guard binding 不一致。
    SnapshotRefMismatch {
        /// guard 固定绑定的 snapshot ref。
        expected: PolicyApplicabilitySnapshotRef,
        /// evaluate 实际收到的 snapshot ref。
        actual: PolicyApplicabilitySnapshotRef,
    },
    /// snapshot requirement / boundary / handle / generation 与 guard binding 不一致。
    SnapshotLineageMismatch,
    /// applicability decision 评估了另一 snapshot / requirement。
    ApplicabilityDecisionMismatch,
    /// applicability decision time 与 aggregate evaluation time 不属于同一次 clock result。
    ApplicabilityEvaluationTimeMismatch,
    /// action decision set 没有一一覆盖 snapshot marker set。
    HighRiskDecisionCoverageMismatch,
    /// action decision 预绑定了另一 aggregate policy decision ref。
    HighRiskDecisionAggregateOwnerMismatch,
    /// action decision 与 snapshot lineage 不一致。
    HighRiskDecisionLineageMismatch {
        /// lineage 不一致的 action decision ref。
        action_decision_ref: HighRiskActionDecisionRef,
    },
    /// action decision time 与 aggregate evaluation time 不属于同一次 clock result。
    HighRiskDecisionTimeMismatch {
        /// decision time 不匹配的 action decision ref。
        action_decision_ref: HighRiskActionDecisionRef,
    },
    /// aggregate status 无法由固定优先级机械推导。
    AggregatePolicyStatusInvalid {
        /// 无法证明的 policy execution status。
        status: PolicyExecutionDecisionStatus,
    },
    /// aggregate status 与 reason / remaining validity 关系不一致。
    AggregatePolicyDecisionRelationInvalid {
        /// relation 不合法的 policy execution status。
        status: PolicyExecutionDecisionStatus,
    },
    /// aggregate evaluation time 不满足 canonical timestamp contract或早于 activation。
    FailClosedEvaluationTimestampInvalid,
}
```

aggregate priority 分两级固定。第一级只看 applicability：`FailClosed -> FailClosed`，`Pending -> Pending`，只有 `Applicable` 才进入第二级。第二级依次为 authorization `Denied -> Rejected`，任一 action `Blocked | Unsupported -> Blocked`，authorization `Pending` 或任一 action `PendingAuthorization -> Pending`，最后只有 authorization `Allowed` 且 all actions `Allowed` 才为 `Accepted`，并复制 positive remaining validity。`Conflicted | Unsupported` authorization若藏在 `Applicable` snapshot中必须返回 guard error。`evaluate` 必须接收预生成的 `policy_decision_ref`，并逐项证明 action decision 的 aggregate owner 与该 ref 相等；不得只证明 action decisions 彼此 owner 相同。

guard 不提供 permissive constructor，也不接受 `allow_on_missing`、profile bool、caller status或 fallback closure。priority 只组合已合法的 typed inputs，不从 reason、source role顺序、marker数量或配置推断。

### 12.5 `PolicyExecutionDecision`

```rust
/// Sandbox 对一个 immutable policy snapshot 和 complete high-risk marker set 的正式执行裁定。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyExecutionDecision {
    /// 本 immutable policy execution decision 的 typed identity。
    decision_ref: PolicyExecutionDecisionRef,
    /// 本 decision 唯一评估的 accepted controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// 本 decision 绑定的 active execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// 本 decision 唯一评估的 boundary requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 decision 唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 使用的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// established boundary 原子关联的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// context、boundary、capability与policy共用的 generation。
    generation_ref: ResourceRef,
    /// 本 decision 消费的 immutable policy snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// 本 decision 消费的 applicability guard ref。
    applicability_guard_ref: PolicyApplicabilityGuardRef,
    /// 本 decision 消费的 strict fail-closed guard ref。
    fail_closed_guard_ref: FailClosedPolicyGuardRef,
    /// 与 snapshot marker set 一一对应的 action decision refs。
    action_decision_refs: HighRiskActionDecisionRefSet,
    /// 正式 canonical policy execution decision status。
    decision_status: PolicyExecutionDecisionStatus,
    /// 非 `Accepted` status 必有的 caller-safe reason。
    decision_reason: Option<SandboxReason>,
    /// `Accepted` decision 从 decided_at 起可供新 run launch 使用的正窗口。
    launch_validity_window_millis: Option<NonZeroU64>,
    /// application clock 提供的 immutable decision time。
    decided_at: Timestamp,
    /// 本 policy decision 对应的 audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
}

impl PolicyExecutionDecision {
    /// 从两个 exact guard decisions 与 complete action decisions形成 immutable正式裁定。
    pub fn from_guard_decisions(
        decision_ref: PolicyExecutionDecisionRef,
        snapshot: &PolicyApplicabilitySnapshot,
        applicability_decision: &PolicyApplicabilityDecision,
        action_decisions: &HighRiskActionDecisionSet,
        fail_closed_decision: &FailClosedPolicyDecision,
        audit_trace_ref: SandboxAuditTraceRef,
        decided_at: Timestamp,
    ) -> Result<Self, PolicyExecutionDecisionError>;

    /// 返回 immutable policy execution decision identity。
    pub fn decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回 owning accepted context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 owning active environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 decision 唯一评估的 requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回 decision 唯一评估的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 established boundary 使用的 capability ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回 established boundary 原子关联的 handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 policy decision 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 decision 消费的 policy snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回 decision 消费的 applicability guard ref。
    pub fn applicability_guard_ref(&self) -> &PolicyApplicabilityGuardRef;
    /// 返回 decision 消费的 fail-closed guard ref。
    pub fn fail_closed_guard_ref(&self) -> &FailClosedPolicyGuardRef;
    /// 返回 complete high-risk action decision refs。
    pub fn action_decision_refs(&self) -> &HighRiskActionDecisionRefSet;
    /// 返回 canonical policy execution decision status。
    pub fn decision_status(&self) -> PolicyExecutionDecisionStatus;
    /// 返回 non-accepted policy decision 的 caller-safe reason。
    pub fn decision_reason(&self) -> Option<&SandboxReason>;
    /// 返回 accepted decision 的正 launch validity window。
    pub fn launch_validity_window_millis(&self) -> Option<NonZeroU64>;
    /// 返回 immutable policy decision time。
    pub fn decided_at(&self) -> &Timestamp;
    /// 返回 policy decision audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只在 `Accepted` 且 checked age 未到 launch window 时返回 true。
    pub fn permits_execution_at_age(&self, checked_age_millis: u64) -> bool;

    /// 判断当前 decision status / checked age 是否必须阻断新的 run launch。
    pub fn must_block_launch_at_age(&self, checked_age_millis: u64) -> bool;

    /// 判断 non-accepted decision 是否需要形成 `6R-04` failure classification seed。
    pub fn requires_failure_classification(&self) -> bool;
}

/// formal policy execution decision 的 guard、lineage、coverage 或 status 关系失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyExecutionDecisionError {
    /// snapshot、applicability、action或fail-closed decision refs / lineage 不一致。
    PolicyDecisionInputLineageMismatch,
    /// action decision set 预绑定的 aggregate policy decision ref 与新 decision ref 不一致。
    ActionDecisionOwnerMismatch {
        /// 预绑定错误 owner 的 action decision ref。
        action_decision_ref: HighRiskActionDecisionRef,
    },
    /// action decisions 未与 snapshot marker set 一一对应。
    ActionDecisionCoverageMismatch,
    /// fail-closed decision status 与正式 decision status 无法一一复制。
    FailClosedDecisionStatusMismatch,
    /// accepted decision 缺少正 launch validity，或 non-accepted错误携带 window。
    PolicyLaunchValidityRelationInvalid {
        /// validity 关系不合法的 policy decision status。
        status: PolicyExecutionDecisionStatus,
    },
    /// accepted decision错误携带 reason，或 non-accepted缺 reason。
    PolicyDecisionReasonRelationInvalid {
        /// reason 关系不合法的 policy decision status。
        status: PolicyExecutionDecisionStatus,
    },
    /// formal decision time 与 guard / action evaluation time不相等或不满足 canonical contract。
    PolicyDecisionTimestampMismatch,
}
```

`from_guard_decisions` 要求预生成的 `decision_ref` 同时等于 fail-closed decision 与 action decision set 中每项 `policy_decision_ref`，并要求 applicability / action / fail-closed decisions 的 evaluation time 与 `decided_at` 完全相等。`Accepted` 复制 fail-closed decision 的 positive remaining validity，作为从 `decided_at` 起算的 launch window；equality 已到期。其他 status 的 window 必须为 `None`。decision immutable；新 summary或authorization只能创建新 snapshot、action decisions和policy decision。

`requires_failure_classification()` 对 `Rejected | Blocked | FailClosed` 返回 true，对可信 `Pending` 返回 false；它只形成 forward obligation，不自行创建 failure truth。`6R-04` 必须定义从 policy decision 到 `SandboxFailureKind::PolicyDenied | PolicyFailClosed | Redline` 的 exact mapper，并禁止从 reason字符串判断 failure kind。

### 12.6 Policy decision field-source / status closure

| object group | generated / trusted input | committed relation | clock / audit | forbidden source |
|---|---|---|---|---|
| policy source support | required roles、typed adapter source / summary / gap outcomes | context / identity / requirement / boundary / capability / handle / generation | source observed time + checked age | policy body、approval body、error text、route / caller kind |
| snapshot | generated snapshot ref | exact source bindings、authorization、markers、established boundary links | assembled time + effective remaining window | latest-source scan、default allow、string timestamp |
| action decisions | pre-generated action / aggregate refs | exact marker 1:1、snapshot lineage | same decision time + audit ref | marker reason解析、caller bool、backend raw outcome |
| aggregate decision | generated decision ref | both guard decisions + complete action decisions | same evaluation time + audit ref | old accepted decision、configuration fallback、query repair |

| owner | lifecycle model | terminal / immutable rule | exact error owner |
|---|---|---|---|
| `PolicyApplicabilitySnapshot` | 5 status-specific factories | immutable；refresh创建新 ref | `PolicyApplicabilitySnapshotError` |
| `PolicyApplicabilityDecision` | pure guard evaluation value | immutable；不持久化为独立 truth | `PolicyApplicabilityGuardError` |
| `HighRiskActionDecision` | one immutable outcome per marker | immutable；new summary创建新 decision ref | `HighRiskActionDecisionError` |
| `FailClosedPolicyDecision` | pure aggregate guard value | immutable；不替代 formal decision | `FailClosedPolicyGuardError` |
| `PolicyExecutionDecision` | immutable formal attempt | non-accepted不可原地转Accepted；accepted也不原地撤销 | `PolicyExecutionDecisionError` |

旧 Step 9 / 10 中 `Missing -> Applicable`、`Pending -> Accepted`、`Accepted -> Blocked` 等箭头必须重写为“旧 snapshot / decision immutable + 新 evaluation 创建新 refs”；它们不是同一对象的 transition。

---

## 13. `PolicyDecisionSummaryView` contract

### 13.1 Action status item 与 committed source snapshot

```rust
/// policy read view 中一个 high-risk action decision 的 body-free status item。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyActionDecisionStatusItem {
    /// committed high-risk action decision ref。
    action_decision_ref: HighRiskActionDecisionRef,
    /// action decision 唯一裁定的 marker key。
    marker_key: HighRiskActionMarkerKey,
    /// canonical high-risk action kind。
    action_kind: HighRiskActionKind,
    /// committed canonical high-risk action decision status。
    action_status: HighRiskActionDecisionStatus,
}

impl PolicyActionDecisionStatusItem {
    /// 从 committed action decision复制 caller-safe identity / kind / status。
    pub fn from_committed_decision(decision: &HighRiskActionDecision) -> Self;
    /// 返回 high-risk action decision ref。
    pub fn action_decision_ref(&self) -> &HighRiskActionDecisionRef;
    /// 返回被裁定的 marker key。
    pub fn marker_key(&self) -> &HighRiskActionMarkerKey;
    /// 返回 canonical action kind。
    pub fn action_kind(&self) -> HighRiskActionKind;
    /// 返回 committed canonical action status。
    pub fn action_status(&self) -> HighRiskActionDecisionStatus;
}

/// 保存 marker key 与 action decision ref 双重唯一的 caller-safe status items。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyActionDecisionStatusSet(Vec<PolicyActionDecisionStatusItem>);

impl PolicyActionDecisionStatusSet {
    /// 从 complete committed action decision group构造 canonical status set。
    pub fn try_from_committed_decisions(
        decisions: &HighRiskActionDecisionSet,
    ) -> Result<Self, PolicyDecisionViewError>;
    /// 返回按 marker key canonical 排序的只读切片。
    pub fn as_slice(&self) -> &[PolicyActionDecisionStatusItem];
    /// 返回 status item数量，用于与 policy decision ref set对账。
    pub fn len(&self) -> usize;
}

/// 同一 committed policy group 的 caller-safe read source snapshot。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummarySourceSnapshot {
    /// committed formal policy decision ref。
    decision_ref: PolicyExecutionDecisionRef,
    /// committed policy applicability snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// owning accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// owning active environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// policy group唯一评估的 requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// policy group唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// policy group绑定的 isolation handle ref。
    handle_ref: IsolationEnvironmentHandleRef,
    /// policy group绑定的 canonical generation。
    generation_ref: ResourceRef,
    /// formal policy decision canonical status。
    decision_status: PolicyExecutionDecisionStatus,
    /// complete high-risk action status set。
    action_statuses: PolicyActionDecisionStatusSet,
    /// formal policy decision audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// projection mapper读取 committed group 的 observation time。
    observed_at: Timestamp,
}

impl PolicyDecisionSummarySourceSnapshot {
    /// 校验 formal decision与complete action decisions来自同一 committed group。
    pub fn try_new(
        decision: &PolicyExecutionDecision,
        action_decisions: &HighRiskActionDecisionSet,
        observed_at: Timestamp,
    ) -> Result<Self, PolicyDecisionViewError>;

    /// 返回 committed formal policy decision ref。
    pub fn decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回 committed policy snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回 owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 owning environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 policy group的 requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回 policy group的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 policy group绑定的 handle ref。
    pub fn handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 policy group绑定的 generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 formal policy decision canonical status。
    pub fn decision_status(&self) -> PolicyExecutionDecisionStatus;
    /// 返回 complete high-risk action statuses。
    pub fn action_statuses(&self) -> &PolicyActionDecisionStatusSet;
    /// 返回 committed audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回 read mapper observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

### 13.2 `PolicyDecisionSummaryView`

```rust
/// 面向 caller 的 policy decision与high-risk action只读摘要。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PolicyDecisionSummaryView {
    /// 本 policy summary read model snapshot 的 typed identity。
    view_ref: PolicyDecisionSummaryViewRef,
    /// committed formal policy decision ref。
    decision_ref: PolicyExecutionDecisionRef,
    /// committed applicability snapshot ref。
    snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// owning controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// policy group唯一评估的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// formal policy decision canonical status。
    decision_status: PolicyExecutionDecisionStatus,
    /// complete high-risk action statuses。
    action_statuses: PolicyActionDecisionStatusSet,
    /// projection / source缺口的caller-safe degraded reasons。
    degraded_reasons: StatusViewDegradedReasonSet,
    /// source policy decision audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// view assembly observation time。
    observed_at: Timestamp,
}

impl PolicyDecisionSummaryView {
    /// 从完整 committed source构造non-degraded policy view。
    pub fn from_committed_snapshot(
        view_ref: PolicyDecisionSummaryViewRef,
        source: PolicyDecisionSummarySourceSnapshot,
    ) -> Result<Self, PolicyDecisionViewError>;

    /// 从合法 source与非空 degraded reasons构造degraded policy view。
    pub fn from_degraded_snapshot(
        view_ref: PolicyDecisionSummaryViewRef,
        source: PolicyDecisionSummarySourceSnapshot,
        degraded_reasons: StatusViewDegradedReasonSet,
    ) -> Result<Self, PolicyDecisionViewError>;

    /// 返回 policy summary view identity。
    pub fn view_ref(&self) -> &PolicyDecisionSummaryViewRef;
    /// 返回 formal policy decision ref。
    pub fn decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回 policy applicability snapshot ref。
    pub fn snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回 owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 policy group的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 canonical formal policy decision status。
    pub fn decision_status(&self) -> PolicyExecutionDecisionStatus;
    /// 一一映射返回 `VisiblePolicyDecisionStatus`，不读取其他truth。
    pub fn visible_status(&self) -> VisiblePolicyDecisionStatus;
    /// 返回 complete high-risk action status set。
    pub fn action_statuses(&self) -> &PolicyActionDecisionStatusSet;
    /// 返回 caller-safe degraded reasons。
    pub fn degraded_reasons(&self) -> &[SandboxReason];
    /// 返回 source audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回 view assembly observation time。
    pub fn observed_at(&self) -> &Timestamp;
    /// 判断 view是否因projection / source缺口降级。
    pub fn is_degraded(&self) -> bool;
    /// 只在non-degraded且decision / action均允许时返回 true。
    pub fn can_show_policy_accepted(&self) -> bool;
}

/// policy decision read source、action coverage或degraded relation失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PolicyDecisionViewError {
    /// action status set出现重复decision ref或marker key。
    DuplicatePolicyActionStatusItem,
    /// action decisions与formal policy decision refs未形成一一对应。
    PolicyActionStatusCoverageMismatch,
    /// source group中action decision owner或lineage与formal decision不一致。
    PolicyActionStatusLineageMismatch,
    /// source observation time不满足canonical timestamp contract或早于decision time。
    PolicyViewObservationTimestampInvalid,
    /// non-degraded factory收到非空degraded reasons。
    UnexpectedPolicyViewDegradedReason,
    /// degraded factory收到空reason set。
    MissingPolicyViewDegradedReason,
}
```

`visible_status()` 对五个 canonical decision status一一穷尽映射，不接受 wildcard；view不保存第二个可变 visible field。`can_show_policy_accepted()` 要求 decision `Accepted`、action set全部 `Allowed`且degraded reasons为空；它仍不证明 policy decision freshness、handle / lease active或run可launch。Query不得以该bool替代run preflight。

policy batch result：support、snapshot、applicability / fail-closed guards、per-marker decisions、formal aggregate decision与public read view均已给出exact schema。后续 run只消费formal decision和checked age，不重新解释policy source。

---

## 14. `ControlledExecutionRun` contract

### 14.1 Launch checked-age 与 lifecycle observation support

`Preparing` 必须建立在同一次 application clock preflight 上。policy age 与 lease age 不能由 service 分别读取后随意拼接，也不能使用 `now` 字符串、repository latest scan 或两个不同的 clock result。`RunLaunchFreshnessCheck` 只保存 checked elapsed 值和对应 ref，不自行判断 policy / lease 是否可用。

```rust
/// 把同一 application attempt 预生成的 run / capture identities绑定为不可拆分输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledRunIdentityBundle {
    /// 本 attempt 唯一生成的 controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// 本 attempt 为该 run 唯一预生成的 capture fact ref。
    capture_ref: CaptureFactRef,
}

impl ControlledRunIdentityBundle {
    /// 从同一次 id-generation step 构造identity bundle；底层resource identity不得碰撞。
    pub fn try_from_generated(
        run_ref: ControlledExecutionRunRef,
        capture_ref: CaptureFactRef,
    ) -> Result<Self, ControlledExecutionRunError>;

    /// 返回本 attempt 的 controlled run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回本 attempt 为该 run 预生成的 capture fact ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
}

/// 绑定同一次 run launch preflight 的 policy 与 lease checked-age 输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RunLaunchFreshnessCheck {
    /// 被检查的 accepted policy decision ref。
    policy_decision_ref: PolicyExecutionDecisionRef,
    /// `checked_at - policy.decided_at` 的安全 elapsed milliseconds。
    policy_checked_age_millis: u64,
    /// 被检查的 active lease record ref。
    lease_ref: LeaseRecordRef,
    /// `checked_at - lease.activated_at` 的安全 elapsed milliseconds。
    lease_checked_age_millis: u64,
    /// application clock 对两项 age 使用的同一个 canonical check time。
    checked_at: Timestamp,
}

impl RunLaunchFreshnessCheck {
    /// 从 clock port 的同一次 checked-elapsed 结果构造 launch freshness check。
    pub fn from_clock(
        policy_decision_ref: PolicyExecutionDecisionRef,
        policy_checked_age_millis: u64,
        lease_ref: LeaseRecordRef,
        lease_checked_age_millis: u64,
        checked_at: Timestamp,
    ) -> Result<Self, ControlledExecutionRunError>;

    /// 返回被检查的 policy decision ref。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回 policy decision checked age。
    pub fn policy_checked_age_millis(&self) -> u64;
    /// 返回被检查的 lease ref。
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    /// 返回 lease checked age。
    pub fn lease_checked_age_millis(&self) -> u64;
    /// 返回两项 checked age 共用的 canonical check time。
    pub fn checked_at(&self) -> &Timestamp;
}

/// `Preparing` run 在 backend call 前由 exact committed group 重验得到的短时 launch permit。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledRunLaunchPermit {
    /// permit 唯一授权的 preparing run ref。
    run_ref: ControlledExecutionRunRef,
    /// permit 唯一授权的 accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// permit 唯一授权的 active environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// permit 唯一授权的 established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// permit 唯一授权的 active isolation handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// permit 唯一授权的 active lease ref。
    lease_ref: LeaseRecordRef,
    /// permit 唯一授权的 accepted policy decision ref。
    policy_decision_ref: PolicyExecutionDecisionRef,
    /// boundary、handle、lease 与 policy 共用的 canonical generation。
    generation_ref: ResourceRef,
    /// policy 与 lease 剩余窗口的正最小值。
    effective_remaining_validity_millis: NonZeroU64,
    /// application clock 完成 exact committed-group revalidation 的时间。
    authorized_at: Timestamp,
}

impl ControlledRunLaunchPermit {
    /// 返回 permit 唯一授权的 run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回 permit 唯一授权的 context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 permit 唯一授权的 environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 permit 唯一授权的 boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 permit 唯一授权的 isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 permit 唯一授权的 lease ref。
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    /// 返回 permit 唯一授权的 policy decision ref。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回 permit 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 policy / lease 合并后的正剩余 launch window。
    pub fn effective_remaining_validity_millis(&self) -> NonZeroU64;
    /// 返回 exact group revalidation time。
    pub fn authorized_at(&self) -> &Timestamp;

    /// 只在 backend call 前新增 checked age 仍小于 permit window 时返回 true。
    pub fn permits_backend_call_at_age(&self, checked_age_millis: u64) -> bool;
}

/// 区分 isolation backend 对 run lifecycle 给出的可消费观察类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum ControlledRunLifecycleObservationKind {
    /// backend 明确确认 run 已进入匹配 isolation handle 内的执行状态。
    Launched,
    /// backend 明确确认 run 已结束正常执行；不表示 capture 已完成。
    Completed,
}

/// isolation backend adapter 映射出的 body-free run lifecycle observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledRunLifecycleObservation {
    /// 本 observation 唯一描述的 Sandbox run ref。
    run_ref: ControlledExecutionRunRef,
    /// 与 owning handle 相同的 stable opaque backend handle source ref。
    backend_handle_ref: ExternalSourceRef,
    /// 不含命令、输出、SDK response 或 runtime loop 正文的 safe summary ref。
    lifecycle_summary_ref: SafeSummaryRef,
    /// observation 与 handle / boundary 共用的 canonical generation。
    generation_ref: ResourceRef,
    /// adapter 显式映射的 finite lifecycle observation kind。
    observation_kind: ControlledRunLifecycleObservationKind,
    /// adapter 观察到对应 backend lifecycle 事实的 canonical time。
    observed_at: Timestamp,
}

impl ControlledRunLifecycleObservation {
    /// 从 isolation backend typed output 构造 body-free run lifecycle observation。
    pub fn try_from_adapter(
        run_ref: ControlledExecutionRunRef,
        backend_handle_ref: ExternalSourceRef,
        lifecycle_summary_ref: SafeSummaryRef,
        generation_ref: ResourceRef,
        observation_kind: ControlledRunLifecycleObservationKind,
        observed_at: Timestamp,
    ) -> Result<Self, ControlledExecutionRunError>;

    /// 返回 observation 唯一描述的 run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回 stable opaque backend handle source ref。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回 body-free lifecycle summary ref。
    pub fn lifecycle_summary_ref(&self) -> &SafeSummaryRef;
    /// 返回 observation 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 finite lifecycle observation kind。
    pub fn observation_kind(&self) -> ControlledRunLifecycleObservationKind;
    /// 返回 adapter observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

`backend_handle_ref.source_kind()` 与 `lifecycle_summary_ref.source_kind()` 必须都是 `IsolationBackend`；backend handle 必须带 version，且 version 等于 `generation_ref`。observation 不保存 command、tool invocation、stdout / stderr、runtime `ExecutionInstance`、agent loop、member host、container / pod / process body或 SDK error。`Launched` 只证明 isolation backend 已在该 handle 内承接受控 run，不证明工具语义成功；`Completed` 只证明 Sandbox run 正常结束，不证明 capture、artifact、observability handoff或 runtime loop 完成。

### 14.2 `ControlledRunTerminalBasis`

```rust
/// 区分 run terminal status 所消费的唯一正式外部收束事实。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ControlledRunTerminalBasis {
    /// `Failed` run 唯一绑定的 formal failure classification ref。
    Failure(
        /// matching formal failure classification identity。
        FailureClassificationRef,
    ),
    /// `Terminated` run 绑定的 formal control fact ref；cleanup / timeout / deny 也必须先形成 control fact。
    Control(
        /// matching formal control fact identity。
        ControlFactRef,
    ),
    /// `Terminated` run 绑定的 formal redline containment ref。
    Redline(
        /// matching formal redline containment identity。
        RedlineContainmentRef,
    ),
}
```

run 不保存三个可同时出现的 optional terminal refs。`Failed` 必须且只能使用 `Failure`；`Terminated` 必须且只能使用 `Control | Redline`；`Preparing | Running | Completed` 必须为 `None`。lease expiry、cleanup、deny、timeout 或 cancel 若要终止 run，必须先由 `6R-04` owner 形成 matching `FailureClassification`、`ControlFact` 或 `RedlineContainment`，不能直接向 run 传 enum、reason、bool 或 operator flag。

### 14.3 `ControlledExecutionRun` 字段与 preparing factory

```rust
/// Sandbox-owned isolation-layer controlled execution run lifecycle truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledExecutionRun {
    /// Sandbox run 的 typed identity。
    run_ref: ControlledExecutionRunRef,
    /// 本 run 预生成且唯一允许使用的 capture fact ref。
    capture_ref: CaptureFactRef,
    /// owning accepted controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// owning active execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// established boundary 唯一承接的 immutable requirement ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 run 使用的 established coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// established boundary 使用的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// 本 run 使用的 active isolation environment handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// 与 handle 原子关联且 preflight 时 active 的 lease ref。
    lease_ref: LeaseRecordRef,
    /// requirement、boundary、handle、lease 与 policy 共用的 generation。
    generation_ref: ResourceRef,
    /// launch preflight 消费的 accepted policy decision ref。
    policy_decision_ref: PolicyExecutionDecisionRef,
    /// accepted policy decision 消费的 immutable snapshot ref。
    policy_snapshot_ref: PolicyApplicabilitySnapshotRef,
    /// 创建 `Preparing` 时保存的同次 policy / lease checked-age 输入。
    launch_freshness_check: RunLaunchFreshnessCheck,
    /// run 的 canonical isolation-layer lifecycle status。
    run_status: ControlledExecutionRunStatus,
    /// `Running` 以后保留的 body-free launch confirmation summary ref。
    launch_summary_ref: Option<SafeSummaryRef>,
    /// `Completed` 唯一保存的 body-free completion summary ref。
    completion_summary_ref: Option<SafeSummaryRef>,
    /// `Failed | Terminated` 唯一保存的 formal terminal basis。
    terminal_basis: Option<ControlledRunTerminalBasis>,
    /// `Failed | Terminated` 必有的 caller-safe owner reason。
    status_reason: Option<SandboxReason>,
    /// `Preparing` truth 建立的 canonical time。
    prepared_at: Timestamp,
    /// backend `Launched` observation time；未 launch 时为 `None`。
    started_at: Option<Timestamp>,
    /// terminal lifecycle observation / owner transition time。
    finished_at: Option<Timestamp>,
    /// 当前 status 生效的 application clock time。
    status_changed_at: Timestamp,
    /// 最近一次 run transition 对应的 audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl ControlledExecutionRun {
    /// 在全部 persisted launch preconditions 同时成立时创建 `Preparing` run。
    pub fn prepare(
        identity_bundle: ControlledRunIdentityBundle,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        lease: &LeaseRecord,
        policy_decision: &PolicyExecutionDecision,
        launch_freshness_check: RunLaunchFreshnessCheck,
        audit_trace_ref: SandboxAuditTraceRef,
        prepared_at: Timestamp,
    ) -> Result<Self, ControlledExecutionRunError>;

    /// 对已提交的 `Preparing` run 重验完整 launch group，形成不可持久化的短时 permit。
    pub fn authorize_launch(
        &self,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        boundary: &CoherentBoundary,
        handle: &IsolationEnvironmentHandle,
        lease: &LeaseRecord,
        policy_decision: &PolicyExecutionDecision,
        launch_freshness_check: RunLaunchFreshnessCheck,
    ) -> Result<ControlledRunLaunchPermit, ControlledExecutionRunError>;

    /// 消费 matching launch permit 和 typed backend confirmation进入 `Running`。
    pub fn mark_running(
        &mut self,
        permit: &ControlledRunLaunchPermit,
        permit_checked_age_millis: u64,
        observation: ControlledRunLifecycleObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionRunError>;

    /// 消费 matching backend completion observation进入 `Completed`；不创建 capture truth。
    pub fn mark_completed(
        &mut self,
        observation: ControlledRunLifecycleObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionRunError>;

    /// 消费已提交或同 UoW staged 的 matching failure classification进入 `Failed`。
    pub fn mark_failed(
        &mut self,
        failure: &FailureClassification,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionRunError>;

    /// 消费已提交或同 UoW staged 的 matching control fact进入 `Terminated`。
    pub fn terminate_by_control(
        &mut self,
        control: &ControlFact,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionRunError>;

    /// 消费 redline owner 为本 run生成的 exact checked basis进入 `Terminated`。
    pub fn terminate_by_redline(
        &mut self,
        basis: RedlineRunBasis,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionRunError>;

    /// 返回 Sandbox run identity。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回 run 预绑定的唯一 capture fact ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回 owning accepted context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 owning active environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 run 绑定的 immutable requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回 run 使用的 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 run 绑定的 capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回 run 使用的 isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 run preflight 使用的 lease ref。
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    /// 返回 run 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 run launch 消费的 formal policy decision ref。
    pub fn policy_decision_ref(&self) -> &PolicyExecutionDecisionRef;
    /// 返回 formal policy decision 消费的 snapshot ref。
    pub fn policy_snapshot_ref(&self) -> &PolicyApplicabilitySnapshotRef;
    /// 返回创建 preparing truth 时的 checked-age 输入。
    pub fn launch_freshness_check(&self) -> &RunLaunchFreshnessCheck;
    /// 返回 canonical run lifecycle status。
    pub fn run_status(&self) -> ControlledExecutionRunStatus;
    /// 返回 launch confirmation safe summary ref。
    pub fn launch_summary_ref(&self) -> Option<&SafeSummaryRef>;
    /// 返回 completion safe summary ref。
    pub fn completion_summary_ref(&self) -> Option<&SafeSummaryRef>;
    /// 返回 failed / terminated run 的 formal terminal basis。
    pub fn terminal_basis(&self) -> Option<&ControlledRunTerminalBasis>;
    /// 返回 failed / terminated run 的 caller-safe owner reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回 preparing truth 创建时间。
    pub fn prepared_at(&self) -> &Timestamp;
    /// 返回 backend launch observation time。
    pub fn started_at(&self) -> Option<&Timestamp>;
    /// 返回 terminal lifecycle time。
    pub fn finished_at(&self) -> Option<&Timestamp>;
    /// 返回当前 run status 生效时间。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近一次 run transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 判断 run 是否已进入 backend-confirmed `Running`。
    pub fn is_running(&self) -> bool;
    /// 判断 run 是否处于 `Completed | Failed | Terminated` 终态。
    pub fn is_terminal(&self) -> bool;
    /// 只在 `Completed` 且 capture 尚应使用预绑定 ref 建立时返回 capture target ref。
    pub fn require_capture_target(
        &self,
    ) -> Result<&CaptureFactRef, ControlledExecutionRunError>;
}
```

`prepare` 必须按固定顺序验证：

1. context 为 `Accepted`，`identity.require_active_for(context)` 成功，requirements 的 context / identity refs 完全相等。
2. `boundary.require_established_links()` 成功，links 的 requirement / capability / handle / generation 与显式 requirements / handle 完全相等。
3. handle 为 `Active`，且 `handle.can_support_launch(boundary)` 为 true；`Created`、`ReleasePending`、`Released`、`OrphanSuspected` 全部拒绝。
4. launch check 的 lease ref 等于 `handle.lease_ref()`，并调用 `lease.require_active_for_handle(handle, lease_checked_age_millis)`；不得从 `LeaseWindow`、current config或 status enum在 caller 侧重算。
5. policy decision 为 `Accepted`，其 context / identity / requirement / boundary / capability / handle / generation 与上述 committed group完全相等；launch check 的 policy ref相等，且 `policy_decision.permits_execution_at_age(policy_checked_age_millis)` 为 true。
6. `launch_freshness_check.checked_at == prepared_at`，prepared time 不早于 policy decision、boundary established或handle active time；run / capture refs 只能从同一个 `ControlledRunIdentityBundle` 复制。

任一步失败都不创建 run，也不调用 backend。成功只创建 `Preparing`；application 必须先原子提交 run、audit、relay / projection stale marker和stored result，再由明确的 launch flow调用backend。repository / UoW必须以`run_ref`和`capture_ref`分别建立唯一约束，并拒绝任何已被另一run占用的capture ref；bundle只能证明本次输入不可拆分，不能替代持久化唯一性。不得在factory内调用adapter，也不得把backend call成功与truth commit合成一个不可恢复的隐式步骤。

`authorize_launch` 必须重新加载 exact refs 指向的 committed context / identity / requirements / boundary / handle / lease / policy decision，重复执行 `prepare` 的第 1~5 组关系检查。它对第 6 组使用后序时间规则：freshness check 的 `checked_at` 必须不早于 `prepared_at` 和当前 `status_changed_at`，并作为 permit 的 `authorized_at`；不要求等于初次 `prepared_at`。它保存 policy / lease positive remaining window 的最小值。permit 是 transient domain value，不是 named truth、不进 repository / DTO / event / stored result。backend port必须接收 permit；调用前由 clock port给出 `permit_checked_age_millis`，equality 到期。backend adapter不得只接收 run ref后自行加载 latest handle或latest policy。

backend launch 的幂等关联键固定为 `(run_ref, isolation_handle_ref, generation_ref)`。同一键的重复调用必须返回同一已知 launch correlation / lifecycle observation，不得启动第二个 backend execution；同一 `run_ref` 搭配不同 handle或generation必须typed reject。adapter无法保证该语义时必须在launch前返回`Unsupported | FailClosed`类typed outcome，不得尝试best-effort launch。进程在backend side effect后、`mark_running`提交前中断时，恢复flow必须先按exact key inspect/reconcile：已launch则重建matching observation并继续`mark_running`，明确未launch且permit仍有效才允许重试，unknown/conflicted则形成failure / orphan / containment输入；禁止盲目再次launch。

### 14.4 Lifecycle transition 与 terminal owner contract

`ControlledExecutionRun` 的 closed lifecycle如下：

```text
factory -> Preparing
Preparing -> Running | Failed | Terminated
Running -> Completed | Failed | Terminated
Completed | Failed | Terminated -> terminal
```

| method | from | to | exact input / proof | field effects |
|---|---|---|---|---|
| `mark_running` | `Preparing` | `Running` | matching non-expired launch permit；`Launched` observation 的 run / backend handle / generation与owning group相等 | 保存 launch summary；`started_at = observation.observed_at`；completion / terminal fields为空 |
| `mark_completed` | `Running` | `Completed` | `Completed` observation 的 run / backend handle / generation相等；时间不早于 started | 保存 completion summary和finished time；terminal basis / reason为空 |
| `mark_failed` | `Preparing | Running` | `Failed` | `FailureClassification::require_run_failure_basis(run_ref, context_ref, boundary_ref, handle_ref)` 返回 owner safe reason | `terminal_basis = Failure(ref)`；复制 checked owner reason；finished time必有 |
| `terminate_by_control` | `Preparing | Running` | `Terminated` | `ControlFact::require_run_termination_basis(run_ref, context_ref, handle_ref)` 返回 owner safe reason | `terminal_basis = Control(ref)`；复制 checked owner reason；finished time必有 |
| `terminate_by_redline` | `Preparing | Running` | `Terminated` | caller先从 exact `RedlineContainment::require_run_termination_basis(run_ref, context_ref, boundary_ref, handle_ref)`取得`RedlineRunBasis`；run只消费该proof并校验run/context/boundary/handle/generation完全相等、impact为`ActiveRunAndBoundary`、source status为`Detected` | `terminal_basis = Redline(basis.redline_ref)`；复制 basis owner reason；finished time必有 |

`Preparing -> Failed` 表达 backend launch call失败、permit到期后的 formal classification或其他 launch-stage failure；`Preparing -> Terminated` 表达 launch 前收到已成立 control / containment。二者都必须先有 matching `6R-04` owner truth，不能以 adapter error直接推进。`Running -> Completed` 不能由 capture result触发；capture只在 run `Completed` 后使用预绑定 `CaptureFactRef`。`Completed` 后出现 capture failure由 `CaptureFact` 与 `FailureClassification` 记录，不回写 run为`Failed`。

### 14.5 `ControlledExecutionRunError`

```rust
/// controlled run 的 preflight、lineage、observation或lifecycle不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ControlledExecutionRunError {
    /// run ref 与capture ref底层resource identity发生碰撞。
    RunCaptureIdentityCollision,
    /// run preflight 输入 context 未处于 `Accepted`。
    ContextWasNotAccepted {
        /// context 实际 canonical intake status。
        actual: ControlledExecutionIntakeStatus,
    },
    /// environment identity 未处于 `Active`或不属于目标context。
    IdentityWasNotActiveForContext,
    /// requirement set 的 context / identity relation与run输入不一致。
    RequirementLineageMismatch,
    /// boundary 未处于`Established`或无法返回complete established links。
    BoundaryWasNotEstablished,
    /// established links 与 requirement / capability / handle / generation不一致。
    BoundaryLaunchLineageMismatch,
    /// isolation handle未处于`Active`。
    HandleWasNotActive {
        /// handle实际canonical lifecycle status。
        actual: IsolationEnvironmentHandleStatus,
    },
    /// active handle不能证明与target boundary属于同一launch relation。
    HandleBoundaryRelationMismatch,
    /// launch freshness check携带的policy ref与target decision不一致。
    LaunchCheckPolicyRefMismatch,
    /// launch freshness check携带的lease ref与handle lease不一致。
    LaunchCheckLeaseRefMismatch,
    /// policy decision不是`Accepted`。
    PolicyDecisionWasNotAccepted {
        /// policy decision实际canonical status。
        actual: PolicyExecutionDecisionStatus,
    },
    /// policy decision与context / identity / requirement / boundary / capability / handle / generation不一致。
    PolicyRunLineageMismatch,
    /// accepted policy decision在checked age时已到期。
    PolicyDecisionExpiredAtLaunch,
    /// matching lease未处于active window或lease owner relation不一致。
    LeaseWasNotActiveForHandle,
    /// launch check time不满足canonical contract或不等于本次preflight time。
    LaunchCheckTimestampInvalid,
    /// transient permit与target run / context / boundary / handle / lease / policy / generation不一致。
    LaunchPermitLineageMismatch,
    /// backend call时permit checked age已到effective window。
    LaunchPermitExpired,
    /// backend lifecycle carrier的source kind不是`IsolationBackend`。
    RunObservationSourceKindInvalid,
    /// backend handle source未携带与generation相等的version ref。
    RunObservationGenerationMismatch,
    /// lifecycle observation描述了另一run。
    RunObservationRefMismatch,
    /// lifecycle observation backend handle与owning handle不一致。
    RunObservationHandleMismatch,
    /// lifecycle observation kind不满足目标transition。
    RunObservationKindMismatch {
        /// transition实际收到的finite observation kind。
        actual: ControlledRunLifecycleObservationKind,
    },
    /// failure classification未返回本run relation的checked failure basis。
    FailureBasisWasNotAvailableForRun,
    /// control fact未返回本run relation的checked termination basis。
    ControlBasisWasNotAvailableForRun,
    /// redline termination basis 的run / context / boundary / handle / generation或status / impact不属于本run。
    RedlineBasisLineageMismatch,
    /// status与launch / completion summary、terminal basis、reason或timestamps关系不一致。
    RunStatusFieldRelationInvalid {
        /// field relation无法成立的canonical run status。
        status: ControlledExecutionRunStatus,
    },
    /// lifecycle transition不在closed graph中。
    RunTransitionNotAllowed {
        /// 被拒绝transition的run ref。
        run_ref: ControlledExecutionRunRef,
        /// transition前实际status。
        from: ControlledExecutionRunStatus,
        /// caller请求的目标status。
        to: ControlledExecutionRunStatus,
    },
    /// observation / change time早于既有run时间或不满足canonical timestamp contract。
    RunTimestampMovedBackwards,
    /// 非`Completed` run被请求提供capture target。
    CaptureTargetWasNotReady {
        /// 请求capture target时run的实际status。
        actual: ControlledExecutionRunStatus,
    },
}
```

error mapper必须穷尽本 enum以及 upstream `ExecutionEnvironmentIdentityError`、`CoherentBoundaryError` 和 `LeaseRecordError`；不得统一转成 generic `DomainError` 或解析 reason / adapter error string。`LeaseRecordError`正文和精确变体由`6R-04`闭合；本批只要求application保留typed source error，并将domain preflight的false relation映射为`LeaseWasNotActiveForHandle`。

### 14.6 Field-source、status relation与forward obligation

| field group | exact source | invariant | forbidden substitute |
|---|---|---|---|
| run / capture refs | `ControlledRunIdentityBundle::try_from_generated` | 两者来自同一generation step、底层identity不碰撞且一个run永久对应一个capture target | 两个散装参数、repository latest、从run ref字符串拼capture ref |
| context / identity | committed accepted context + active identity | exact ref equality | actor / member / runtime ref推导 |
| requirement / boundary / capability / handle / generation | `require_established_links` + exact loaded owners | whole relation equality | 四个caller裸ref、status bool、backend name |
| lease | `handle.lease_ref` + exact loaded `LeaseRecord` + checked age | Active、matching handle/context/generation、未到期 | `LeaseWindow`自行计算、current config、latest lease scan |
| policy | exact committed `PolicyExecutionDecision` + checked age | Accepted、same lineage、未到launch window equality | view visible status、旧accepted attempt、caller bool |
| lifecycle summaries | typed isolation backend observations | source kind / backend handle / generation / run均匹配 | raw SDK body、stdout/stderr、runtime completion |
| terminal basis / reason | matching `6R-04` formal owner 的 `require_*_basis` output | status / variant exact relation；run只复制owner safe reason | caller传reason、adapter error、operator note、reason解析kind |
| time / audit | application clock + staged audit ref | monotonic；transition更新audit | system time string、backend timestamp冒充change time |

`mark_running` / `mark_completed` 要求 `changed_at >= observation.observed_at`，并分别要求 observation time 不早于 `permit.authorized_at` / `started_at`；`status_changed_at` 保存 application clock 的 `changed_at`，`started_at` / `finished_at` 保存 adapter observation time。两类时间不能互换。failure / control / redline terminal path没有backend observation，`finished_at = changed_at`。

status field matrix：

| status | launch summary | completion summary | terminal basis / reason | started / finished |
|---|---|---|---|---|
| `Preparing` | `None` | `None` | `None / None` | `None / None` |
| `Running` | `Some` | `None` | `None / None` | `Some / None` |
| `Completed` | `Some` | `Some` | `None / None` | `Some / Some` |
| `Failed` from Preparing | `None` | `None` | `Failure / Some` | `None / Some` |
| `Failed` from Running | `Some` | `None` | `Failure / Some` | `Some / Some` |
| `Terminated` from Preparing | `None` | `None` | `Control | Redline / Some` | `None / Some` |
| `Terminated` from Running | `Some` | `None` | `Control | Redline / Some` | `Some / Some` |

`6R-04` 必须以本表为不可弱化 forward obligation闭合以下 methods；名字、参数和关系不得换成 caller bool或generic ref：

```rust
impl LeaseRecord {
    /// 校验record为exact handle的active lease，且checked age严格小于expiry window。
    pub fn require_active_for_handle(
        &self,
        handle: &IsolationEnvironmentHandle,
        checked_age_millis: u64,
    ) -> Result<NonZeroU64, LeaseRecordError>;
}

impl FailureClassification {
    /// 校验formal failure明确适用于exact run relation并返回owning safe reason。
    pub fn require_run_failure_basis(
        &self,
        run_ref: &ControlledExecutionRunRef,
        context_ref: &ControlledExecutionContextRef,
        boundary_ref: &CoherentBoundaryRef,
        handle_ref: &IsolationEnvironmentHandleRef,
    ) -> Result<&SandboxReason, FailureClassificationError>;
}

impl ControlFact {
    /// 校验formal control要求终止exact run relation并返回owning safe reason。
    pub fn require_run_termination_basis(
        &self,
        run_ref: &ControlledExecutionRunRef,
        context_ref: &ControlledExecutionContextRef,
        handle_ref: &IsolationEnvironmentHandleRef,
    ) -> Result<&SandboxReason, ControlFactError>;
}

impl RedlineContainment {
    /// 校验formal containment要求终止exact run relation并返回完整typed proof。
    pub fn require_run_termination_basis(
        &self,
        run_ref: &ControlledExecutionRunRef,
        context_ref: &ControlledExecutionContextRef,
        boundary_ref: &CoherentBoundaryRef,
        handle_ref: &IsolationEnvironmentHandleRef,
    ) -> Result<RedlineRunBasis, RedlineContainmentError>;
}
```

`require_active_for_handle` 返回本次checked age后剩余的正lease window，用于`authorize_launch`与policy remaining window取最小值；equality必须返回typed expiry error。它不得续租、refresh或推进lease状态。run batch result：`Preparing`创建、pre-call revalidation、backend-confirmed running/completed、formal failure/control/redline terminal路径、唯一capture target和forward methods均已有exact schema；tools semantic execution、runtime agent loop、member lifecycle仍未进入Sandbox owner。

Step 7 / 9 必须继续闭合以下 persistence / adapter obligations：

| forward owner | exact obligation | prohibited fallback |
|---|---|---|
| run repository / UoW | `run_ref`唯一；`capture_ref`跨run唯一；Preparing + audit + stale marker + stored result原子提交 | 先launch后补Preparing、repository latest、重复capture target |
| isolation backend port | launch输入显式携带`ControlledRunLaunchPermit`和exact idempotent key；inspect/reconcile按同一key返回typed outcome | 只传run ref、随机生成backend correlation、同run二次launch |
| Start run flow | commit Preparing -> authorize/revalidate -> backend idempotent launch -> commit Running；每个外部side effect前后都有恢复点 | 把adapter call藏进domain factory或一个不可重放transaction |
| recovery flow | side effect状态unknown时先inspect；observed launched复用observation，observed absent才可在新permit下retry，conflicted进入failure/orphan/containment | timeout后直接retry、把unknown当absent |

---

## 15. Capture support 与 collection candidate contract

### 15.1 `ExecutionOutputSummary`

`ExecutionOutputSummary` 只描述 capture adapter 已观察到的安全输出索引，不保存 stdout / stderr、文件、diagnostic或工具结果正文。material key不是artifact、evidence、baseline或repository object ref；它只在一个capture group内稳定标识candidate material。

本节中的`CapturedMaterialKey` / set是`crates/contracts/src/refs.rs`唯一声明，不是domain-local type；本校准分件只是按capture业务主线展开其schema。domain capture对象只消费该carrier；key / set的基础shape错误由`crates/contracts/src/errors.rs::ContractError`承接。

```rust
/// 标识一个capture group内稳定且非空的candidate material key。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct CapturedMaterialKey(ResourceRef);

impl CapturedMaterialKey {
    /// 从capture adapter生成的opaque resource ref构造material key。
    pub fn try_from_generated(
        material_ref: ResourceRef,
    ) -> Result<Self, ContractError>;

    /// 返回opaque resource ref；不得解析其字符串结构。
    pub fn as_resource_ref(&self) -> &ResourceRef;
}

/// 保存material key唯一且canonical排序的集合；允许为空。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CapturedMaterialKeySet(Vec<CapturedMaterialKey>);

impl CapturedMaterialKeySet {
    /// 构造material key唯一的canonical set；重复key必须拒绝。
    pub fn try_new(
        material_keys: Vec<CapturedMaterialKey>,
    ) -> Result<Self, ContractError>;

    /// 返回canonical material key顺序的只读切片。
    pub fn as_slice(&self) -> &[CapturedMaterialKey];

    /// 判断是否包含exact material key。
    pub fn contains(&self, material_key: &CapturedMaterialKey) -> bool;

    /// 返回material key数量。
    pub fn len(&self) -> usize;

    /// 判断集合是否为空。
    pub fn is_empty(&self) -> bool;
}

/// capture adapter对run output形成的body-free安全索引。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExecutionOutputSummary {
    /// 本summary唯一归属的预生成capture fact ref。
    capture_ref: CaptureFactRef,
    /// 本summary唯一归属的completed controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// 与run / handle一致的canonical generation。
    generation_ref: ResourceRef,
    /// 描述output collection的ordered-unique safe summary refs。
    summary_refs: SafeSummaryRefSet,
    /// 属于stdout / stderr / exit-status / diagnostic类别的material keys。
    output_material_keys: CapturedMaterialKeySet,
    /// adapter观察output索引的canonical time。
    observed_at: Timestamp,
}

impl ExecutionOutputSummary {
    /// 从isolation backend capture adapter的body-free output索引构造summary。
    pub fn try_from_adapter(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        summary_refs: SafeSummaryRefSet,
        output_material_keys: CapturedMaterialKeySet,
        observed_at: Timestamp,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回summary归属的capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回summary归属的completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回summary绑定的canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回body-free safe summary refs。
    pub fn summary_refs(&self) -> &SafeSummaryRefSet;
    /// 返回output material key set。
    pub fn output_material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回adapter observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 校验每个output key都存在于candidate set且kind属于output-safe闭集。
    pub fn require_keys_in_candidates(
        &self,
        candidates: &CapturedMaterialCandidateSet,
    ) -> Result<(), CaptureSupportError>;
}
```

所有 `summary_refs` 的source kind必须为`IsolationBackend`，且至少有一项；summary只引用safe descriptor，不引用正文。`output_material_keys`只允许指向`Stdout | Stderr | ExitStatus | Diagnostic` candidate；`OutputFile | CandidateOutput | Other`仍保留在完整candidate set中，不能混入output channel索引。没有stdout / stderr是合法情况，但completed run的summary仍必须至少有一个safe summary ref，并由requirement set决定`ExitStatus`是否缺失。

### 15.2 `CaptureMaterialRequirementSet`

```rust
/// 区分required material缺口必须定格为partial还是failed capture。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum CaptureRequirementGapDisposition {
    /// 缺口允许保留已捕获材料，但capture必须显式定格为`Partial`。
    RecordPartial,
    /// 缺口破坏最低capture contract，capture必须定格为`Failed`。
    RecordFailed,
}

/// 一个material kind在本次capture中的最低数量要求。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialRequirement {
    /// 被要求的canonical material kind。
    material_kind: MaterialKind,
    /// 该kind至少必须出现的正数量。
    minimum_count: NonZeroU32,
    /// 数量不足时的严格定格处置。
    gap_disposition: CaptureRequirementGapDisposition,
}

impl CaptureMaterialRequirement {
    /// 构造一个正最小数量的capture material requirement。
    pub fn try_new(
        material_kind: MaterialKind,
        minimum_count: u32,
        gap_disposition: CaptureRequirementGapDisposition,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回required material kind。
    pub fn material_kind(&self) -> MaterialKind;
    /// 返回正minimum count。
    pub fn minimum_count(&self) -> NonZeroU32;
    /// 返回缺口定格处置。
    pub fn gap_disposition(&self) -> CaptureRequirementGapDisposition;
}

/// 保存本次capture的非空、kind唯一、canonical排序最低material contract。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialRequirementSet {
    /// requirement唯一归属的capture fact ref。
    capture_ref: CaptureFactRef,
    /// requirement唯一归属的completed run ref。
    run_ref: ControlledExecutionRunRef,
    /// requirement与run / handle共用的canonical generation。
    generation_ref: ResourceRef,
    /// 按`MaterialKind` canonical顺序保存的kind唯一要求。
    requirements: Vec<CaptureMaterialRequirement>,
}

impl CaptureMaterialRequirementSet {
    /// 从validated capture profile映射非空、kind唯一的最低capture contract。
    pub fn try_from_validated_profile(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        requirements: Vec<CaptureMaterialRequirement>,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回requirements唯一归属的capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回requirements唯一归属的run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回requirements绑定的canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回canonical kind顺序的只读requirements。
    pub fn as_slice(&self) -> &[CaptureMaterialRequirement];
    /// 返回指定kind的requirement。
    pub fn get(
        &self,
        material_kind: MaterialKind,
    ) -> Option<&CaptureMaterialRequirement>;
}

/// capture completeness guard使用的固定caller-safe原因目录。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureCompletenessReasonCatalog {
    /// required material只有`RecordPartial`缺口时使用的安全原因。
    partial_reason: SandboxReason,
    /// required material存在`RecordFailed`缺口时使用的安全原因。
    failed_requirement_reason: SandboxReason,
    /// capture adapter明确失败时使用的安全原因。
    adapter_failed_reason: SandboxReason,
    /// capture source不可用时使用的安全原因。
    source_unavailable_reason: SandboxReason,
    /// 任一forbidden external body marker出现时使用的安全原因。
    forbidden_body_reason: SandboxReason,
}

impl CaptureCompletenessReasonCatalog {
    /// 从validated capture profile的五个非空、互不解析的安全原因构造目录。
    pub fn try_from_validated_profile(
        partial_reason: SandboxReason,
        failed_requirement_reason: SandboxReason,
        adapter_failed_reason: SandboxReason,
        source_unavailable_reason: SandboxReason,
        forbidden_body_reason: SandboxReason,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回partial gap固定原因。
    pub fn partial_reason(&self) -> &SandboxReason;
    /// 返回failed requirement固定原因。
    pub fn failed_requirement_reason(&self) -> &SandboxReason;
    /// 返回adapter failed固定原因。
    pub fn adapter_failed_reason(&self) -> &SandboxReason;
    /// 返回source unavailable固定原因。
    pub fn source_unavailable_reason(&self) -> &SandboxReason;
    /// 返回forbidden body固定原因。
    pub fn forbidden_body_reason(&self) -> &SandboxReason;
}
```

requirement set必须至少包含`ExitStatus`，且该项必须是`minimum_count = 1`、`RecordFailed`；不能由profile关闭。其他kind和数量由validated capture profile显式映射，默认值、caller bool、output body内容或material数量猜测都不是来源。`Other`可以被要求，但其candidate仍必须有安全source、locator、digest和summary，不能成为未分类正文逃生口。

---

## 16. Captured material 与 completeness guard contract

### 16.1 Collection candidate support

```rust
/// 区分body-free material locator指向的受控存储类别，不暴露provider、path或URL。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum CapturedMaterialLocatorKind {
    /// capture adapter管理的inline-safe摘要槽；不包含原始正文。
    SafeSummarySlot,
    /// isolation backend管理的opaque output object。
    BackendOutputObject,
    ///受控temporary material store中的opaque object。
    ControlledTemporaryObject,
}

/// 指向candidate material body的opaque locator；不是artifact或evidence ref。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CapturedMaterialLocator {
    /// locator所属的closed storage class。
    locator_kind: CapturedMaterialLocatorKind,
    /// storage adapter返回的stable opaque object ref。
    source_ref: ExternalSourceRef,
}

impl CapturedMaterialLocator {
    /// 从capture/storage adapter的typed output构造body-free locator。
    pub fn try_from_adapter(
        locator_kind: CapturedMaterialLocatorKind,
        source_ref: ExternalSourceRef,
        generation_ref: &ResourceRef,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回locator storage class。
    pub fn locator_kind(&self) -> CapturedMaterialLocatorKind;
    /// 返回stable opaque source ref。
    pub fn source_ref(&self) -> &ExternalSourceRef;
}

/// capture adapter在domain定格前返回的一个body-free material candidate。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CapturedMaterialCandidate {
    /// candidate在capture group内的stable key。
    material_key: CapturedMaterialKey,
    /// candidate唯一归属的预生成capture ref。
    capture_ref: CaptureFactRef,
    /// candidate唯一归属的completed run ref。
    run_ref: ControlledExecutionRunRef,
    /// candidate与run / handle一致的canonical generation。
    generation_ref: ResourceRef,
    /// candidate的canonical material role。
    material_kind: MaterialKind,
    /// 不暴露path / URL / provider body的opaque locator。
    locator: CapturedMaterialLocator,
    /// material adapter已计算的candidate digest。
    material_digest: SandboxMaterialDigest,
    /// candidate material的body-free安全描述。
    safety_summary_ref: SafeSummaryRef,
    /// adapter声明的非零material字节数；不读取正文重算。
    size_bytes: NonZeroU64,
    /// adapter观察candidate的canonical time。
    observed_at: Timestamp,
}

impl CapturedMaterialCandidate {
    /// 从capture adapter的typed body-free output构造candidate。
    pub fn try_from_adapter(
        material_key: CapturedMaterialKey,
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        material_kind: MaterialKind,
        locator: CapturedMaterialLocator,
        material_digest: SandboxMaterialDigest,
        safety_summary_ref: SafeSummaryRef,
        size_bytes: u64,
        observed_at: Timestamp,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回candidate material key。
    pub fn material_key(&self) -> &CapturedMaterialKey;
    /// 返回owning capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回owning run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回canonical material kind。
    pub fn material_kind(&self) -> MaterialKind;
    /// 返回body-free opaque locator。
    pub fn locator(&self) -> &CapturedMaterialLocator;
    /// 返回candidate material digest。
    pub fn material_digest(&self) -> &SandboxMaterialDigest;
    /// 返回candidate safety summary ref。
    pub fn safety_summary_ref(&self) -> &SafeSummaryRef;
    /// 返回adapter声明的正size bytes。
    pub fn size_bytes(&self) -> NonZeroU64;
    /// 返回adapter observation time。
    pub fn observed_at(&self) -> &Timestamp;
}

/// 保存key / locator source双重唯一且canonical排序的material candidates。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CapturedMaterialCandidateSet(Vec<CapturedMaterialCandidate>);

impl CapturedMaterialCandidateSet {
    /// 构造允许为空、同一capture/run/generation且双重唯一的candidate set。
    pub fn try_new(
        capture_ref: &CaptureFactRef,
        run_ref: &ControlledExecutionRunRef,
        generation_ref: &ResourceRef,
        candidates: Vec<CapturedMaterialCandidate>,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回按`(material_kind, material_key)`canonical排序的只读切片。
    pub fn as_slice(&self) -> &[CapturedMaterialCandidate];
    /// 返回exact material key对应的candidate。
    pub fn get(
        &self,
        material_key: &CapturedMaterialKey,
    ) -> Option<&CapturedMaterialCandidate>;
    /// 返回指定kind的candidate数量。
    pub fn count_kind(&self, material_kind: MaterialKind) -> usize;
    /// 返回全部candidate material keys。
    pub fn material_keys(&self) -> CapturedMaterialKeySet;
    /// 判断candidate set是否为空。
    pub fn is_empty(&self) -> bool;
}

/// 区分capture adapter本次collection的有限业务结果。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum CaptureCollectionDisposition {
    /// adapter完成collection并返回全部当前可得body-free candidates。
    Collected,
    /// adapter执行capture动作失败；不能从错误字符串推断。
    AdapterFailed,
    /// run / backend material source当前不可读取或不可定位。
    SourceUnavailable,
    /// adapter输入/输出检测到forbidden external body，整批拒绝持久化。
    ForbiddenBodyRejected,
}

/// domain completeness guard唯一消费的transient body-free capture candidate。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureCollectionCandidate {
    /// candidate唯一归属的capture ref。
    capture_ref: CaptureFactRef,
    /// candidate唯一归属的completed run ref。
    run_ref: ControlledExecutionRunRef,
    /// candidate与run / handle一致的canonical generation。
    generation_ref: ResourceRef,
    /// typed adapter collection disposition。
    disposition: CaptureCollectionDisposition,
    /// `Collected`时必有的execution output summary。
    output_summary: Option<ExecutionOutputSummary>,
    /// `Collected`时允许为空的完整material candidate set。
    material_candidates: CapturedMaterialCandidateSet,
    /// adapter输入/输出的forbidden-body marker set。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// adapter对non-collected disposition给出的caller-safe原因。
    adapter_reason: Option<SandboxReason>,
    /// application clock形成candidate的canonical time。
    collected_at: Timestamp,
}

impl CaptureCollectionCandidate {
    /// 构造无forbidden marker且带output summary的`Collected` candidate。
    pub fn collected(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        output_summary: ExecutionOutputSummary,
        material_candidates: CapturedMaterialCandidateSet,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        collected_at: Timestamp,
    ) -> Result<Self, CaptureSupportError>;

    /// 构造adapter明确失败且不携带material candidate的结果。
    pub fn adapter_failed(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        reason: SandboxReason,
        collected_at: Timestamp,
    ) -> Result<Self, CaptureSupportError>;

    /// 构造source当前不可用且不携带material candidate的结果。
    pub fn source_unavailable(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        reason: SandboxReason,
        collected_at: Timestamp,
    ) -> Result<Self, CaptureSupportError>;

    /// 构造检测到非空forbidden-body markers的整批拒绝结果。
    pub fn forbidden_body_rejected(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        collected_at: Timestamp,
    ) -> Result<Self, CaptureSupportError>;

    /// 返回owning capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回owning completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回typed collection disposition。
    pub fn disposition(&self) -> CaptureCollectionDisposition;
    /// 返回`Collected` output summary。
    pub fn output_summary(&self) -> Option<&ExecutionOutputSummary>;
    /// 返回完整material candidate set。
    pub fn material_candidates(&self) -> &CapturedMaterialCandidateSet;
    /// 返回forbidden-body markers。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
    /// 返回non-collected adapter safe reason。
    pub fn adapter_reason(&self) -> Option<&SandboxReason>;
    /// 返回candidate collection time。
    pub fn collected_at(&self) -> &Timestamp;
}
```

exact disposition relation：

| disposition | output summary | candidates | forbidden markers | adapter reason |
|---|---|---|---|---|
| `Collected` | `Some` | 允许为空 | empty | `None` |
| `AdapterFailed` | `None` | empty | empty | `Some` |
| `SourceUnavailable` | `None` | empty | empty | `Some` |
| `ForbiddenBodyRejected` | `None` | empty | non-empty | `None` |

locator source kind只允许`IsolationBackend`。`SafeSummarySlot`的source仍指向安全摘要槽，不代表正文inline进入domain；`BackendOutputObject | ControlledTemporaryObject`必须携带与generation相等的source version。所有candidate safety summary source kind也必须为`IsolationBackend`。path、URL、bucket、provider、container、pod、host、stdout/stderr body、file bytes、SDK response、secret、artifact/evidence identity均禁止进入这些对象。

### 16.2 `CapturedMaterialRef` 与 set

```rust
/// Sandbox对一个candidate material的body-free lifecycle value object。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CapturedMaterialRef {
    /// capture group内的stable material key。
    material_key: CapturedMaterialKey,
    /// owning immutable capture fact ref。
    capture_ref: CaptureFactRef,
    /// owning completed run ref。
    run_ref: ControlledExecutionRunRef,
    /// run / capture / locator共用的canonical generation。
    generation_ref: ResourceRef,
    /// canonical material role。
    material_kind: MaterialKind,
    /// body-free opaque locator。
    locator: CapturedMaterialLocator,
    /// candidate material digest，不是artifact / evidence digest。
    material_digest: SandboxMaterialDigest,
    /// body-free safety summary ref。
    safety_summary_ref: SafeSummaryRef,
    /// adapter声明的正material size。
    size_bytes: NonZeroU64,
    /// material lifecycle的canonical status。
    material_status: CapturedMaterialStatus,
    /// 当前唯一hand-off batch ref；`Captured`时为空。
    handoff_ref: Option<HandoffFactRef>,
    /// lifecycle non-success status的caller-safe原因。
    status_reason: Option<SandboxReason>,
    /// candidate首次定格为captured material的canonical time。
    captured_at: Timestamp,
    /// 当前material status生效时间。
    status_changed_at: Timestamp,
    /// 最近一次material transition audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl CapturedMaterialRef {
    /// 从relation-checked candidate创建`Captured` material value。
    pub fn from_candidate(
        candidate: &CapturedMaterialCandidate,
        audit_trace_ref: SandboxAuditTraceRef,
        captured_at: Timestamp,
    ) -> Result<Self, CapturedMaterialError>;

    /// 返回stable material key。
    pub fn material_key(&self) -> &CapturedMaterialKey;
    /// 返回owning capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回owning run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回canonical material kind。
    pub fn material_kind(&self) -> MaterialKind;
    /// 返回body-free locator。
    pub fn locator(&self) -> &CapturedMaterialLocator;
    /// 返回candidate material digest。
    pub fn material_digest(&self) -> &SandboxMaterialDigest;
    /// 返回body-free safety summary ref。
    pub fn safety_summary_ref(&self) -> &SafeSummaryRef;
    /// 返回正material size bytes。
    pub fn size_bytes(&self) -> NonZeroU64;
    /// 返回canonical material lifecycle status。
    pub fn material_status(&self) -> CapturedMaterialStatus;
    /// 返回当前唯一handoff batch ref。
    pub fn handoff_ref(&self) -> Option<&HandoffFactRef>;
    /// 返回non-success material status的caller-safe原因。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回material captured time。
    pub fn captured_at(&self) -> &Timestamp;
    /// 返回当前status生效时间。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只在`Captured`且locator / digest / safety relation完整时返回true。
    pub fn can_open_handoff(&self) -> bool;
}

/// 保存material key / locator source双重唯一且同一capture group的material values。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CapturedMaterialRefSet(Vec<CapturedMaterialRef>);

impl CapturedMaterialRefSet {
    /// 构造允许为空、同一capture/run/generation且双重唯一的canonical set。
    pub fn try_for_capture(
        capture_ref: &CaptureFactRef,
        run_ref: &ControlledExecutionRunRef,
        generation_ref: &ResourceRef,
        materials: Vec<CapturedMaterialRef>,
    ) -> Result<Self, CapturedMaterialError>;

    /// 返回按`(material_kind, material_key)`canonical排序的只读切片。
    pub fn as_slice(&self) -> &[CapturedMaterialRef];
    /// 返回exact material key对应的material。
    pub fn get(
        &self,
        material_key: &CapturedMaterialKey,
    ) -> Option<&CapturedMaterialRef>;
    /// 返回全部material keys。
    pub fn material_keys(&self) -> CapturedMaterialKeySet;
    /// 返回指定kind的material数量。
    pub fn count_kind(&self, material_kind: MaterialKind) -> usize;
    /// 判断set是否为空。
    pub fn is_empty(&self) -> bool;
}
```

batch 4只定义`Captured` factory和read surface。`mark_handoff_pending / mark_handoff_failed / mark_handoff_accepted / mark_retention_blocked`的exact methods属于batch 5/`6R-04` owning input到齐后闭合；本批先固定同一material只能绑定一个覆盖required targets的handoff batch，不能为每个target分别改material status。`CapturedMaterialRef`不是named repository object ref，不进入`SandboxObjectRefKind`；repository以`(capture_ref, material_key)`作为typed composite key，禁止把`material_key`单独当全局identity。

### 16.3 Required material gap 与 canonical set

`CaptureMaterialGap`只记录最低capture contract与本次body-free candidate计数的差，不保存candidate locator、material body或adapter错误。gap由`CaptureCompletenessGuard`在纯评估中创建；application、adapter和DTO mapper都不能直接构造或删改gap来改变capture status。

```rust
/// 记录一个required material kind在本次capture中的可机械验证缺口。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialGap {
    /// 出现缺口的canonical material kind。
    material_kind: MaterialKind,
    /// validated requirement要求的正minimum count。
    required_count: NonZeroU32,
    /// body-free candidate set中实际观察到的数量；严格小于required count。
    observed_count: u32,
    /// 该缺口必须形成partial还是failed capture。
    gap_disposition: CaptureRequirementGapDisposition,
}

impl CaptureMaterialGap {
    /// 由completeness guard从exact requirement和已检查计数创建缺口；无缺口返回`None`。
    fn from_requirement(
        requirement: &CaptureMaterialRequirement,
        observed_count: usize,
    ) -> Result<Option<Self>, CaptureCompletenessGuardError>;

    /// 返回缺口对应的material kind。
    pub fn material_kind(&self) -> MaterialKind;
    /// 返回required minimum count。
    pub fn required_count(&self) -> NonZeroU32;
    /// 返回实际observed count。
    pub fn observed_count(&self) -> u32;
    /// 返回该缺口的严格定格处置。
    pub fn gap_disposition(&self) -> CaptureRequirementGapDisposition;

    /// 判断该缺口是否要求capture定格为`Failed`。
    pub fn requires_failed_capture(&self) -> bool;
}

/// 保存material kind唯一且canonical排序的required material gaps；完整capture时允许为空。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialGapSet(Vec<CaptureMaterialGap>);

impl CaptureMaterialGapSet {
    /// 仅供completeness guard构造kind唯一的canonical gap set。
    fn try_from_guard(
        gaps: Vec<CaptureMaterialGap>,
    ) -> Result<Self, CaptureCompletenessGuardError>;

    /// 返回按`MaterialKind` canonical排序的只读切片。
    pub fn as_slice(&self) -> &[CaptureMaterialGap];
    /// 返回指定material kind的gap。
    pub fn get(&self, material_kind: MaterialKind) -> Option<&CaptureMaterialGap>;
    /// 判断是否存在至少一个`RecordFailed` gap。
    pub fn contains_failed_gap(&self) -> bool;
    /// 判断gap set是否为空。
    pub fn is_empty(&self) -> bool;
    /// 返回gap数量。
    pub fn len(&self) -> usize;
}
```

gap set的机械生成规则固定为：按requirement set逐项调用`candidate_set.count_kind(kind)`；只有`observed_count < minimum_count`时创建一项gap；每个requirement kind至多一项；最终按`MaterialKind`排序。额外candidate合法保留，不形成gap，也不能抵消其他kind缺口。`ExitStatus`缺口必然是`RecordFailed`，不能被`Stdout`、`Stderr`、`Diagnostic`或`Other`数量替代。

### 16.4 Capture support 与 captured material exact errors

```rust
/// capture requirement、candidate、locator或collection domain relation的不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureSupportError {
    /// material key set或candidate set出现重复key。
    DuplicateCapturedMaterialKey,
    /// candidate set出现重复opaque locator source。
    DuplicateCapturedMaterialLocatorSource,
    /// output summary没有任何body-free safe summary ref。
    EmptyExecutionOutputSummary,
    /// output summary、candidate set或requirement set的capture/run/generation lineage不一致。
    CaptureSupportLineageMismatch,
    /// output summary引用的material key不在完整candidate set中。
    OutputSummaryMaterialKeyMissing {
        /// candidate set中缺失的material key。
        material_key: CapturedMaterialKey,
    },
    /// output summary引用了不属于output channel闭集的material kind。
    OutputSummaryMaterialKindInvalid {
        /// 被拒绝的canonical material kind。
        material_kind: MaterialKind,
    },
    /// capture requirement的minimum count为零。
    ZeroCaptureRequirementMinimum {
        /// minimum count为零的material kind。
        material_kind: MaterialKind,
    },
    /// capture requirement set为空。
    EmptyCaptureRequirementSet,
    /// capture requirement set出现重复material kind。
    DuplicateCaptureRequirementKind {
        /// 重复出现的canonical material kind。
        material_kind: MaterialKind,
    },
    /// requirement set缺少mandatory `ExitStatus`要求。
    MissingMandatoryExitStatusRequirement,
    /// `ExitStatus` requirement不是`minimum_count = 1 + RecordFailed`。
    InvalidMandatoryExitStatusRequirement,
    /// capture reason catalog未形成五个可独立读取的caller-safe原因。
    CaptureReasonCatalogInvalid,
    /// locator source kind不是`IsolationBackend`。
    CapturedMaterialLocatorSourceKindInvalid,
    /// versioned locator source与target generation不一致。
    CapturedMaterialLocatorGenerationMismatch,
    /// candidate safety summary source kind不是`IsolationBackend`。
    CapturedMaterialSafetySummarySourceKindInvalid,
    /// candidate material size为零。
    ZeroCapturedMaterialSize,
    /// candidate locator、digest、summary或observation time不满足body-free contract。
    CapturedMaterialCandidateRelationInvalid,
    /// candidate set成员不属于声明的capture/run/generation group。
    CapturedMaterialCandidateSetLineageMismatch,
    /// collection disposition与output summary、candidate、forbidden marker或adapter reason关系不一致。
    CaptureCollectionDispositionRelationInvalid {
        /// relation无法成立的typed collection disposition。
        disposition: CaptureCollectionDisposition,
    },
    /// `Collected` output summary未覆盖candidate set中的exact output keys。
    CaptureCollectionOutputSummaryMismatch,
    /// collection timestamp早于任一summary/candidate observation或不满足canonical timestamp contract。
    CaptureCollectionTimestampInvalid,
}

/// captured material factory、set relation或当前lifecycle字段的不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CapturedMaterialError {
    /// candidate未形成完整body-free locator/digest/summary/size relation。
    CandidateWasNotMaterializable {
        /// 无法物化的candidate material key。
        material_key: CapturedMaterialKey,
    },
    /// material capture time早于candidate observation或不满足canonical timestamp contract。
    MaterialCaptureTimestampInvalid {
        /// timestamp不合法的material key。
        material_key: CapturedMaterialKey,
    },
    /// material set成员不属于声明的capture/run/generation group。
    CapturedMaterialSetLineageMismatch,
    /// material set出现重复material key。
    DuplicateCapturedMaterialKey,
    /// material set出现重复opaque locator source。
    DuplicateCapturedMaterialLocatorSource,
    /// `Captured` factory写入了handoff ref、status reason或非初始status。
    CapturedFactoryStatusRelationInvalid,
    /// material lifecycle status与handoff ref、reason和timestamps关系不一致。
    CapturedMaterialStatusRelationInvalid {
        /// relation无法成立的canonical material status。
        status: CapturedMaterialStatus,
    },
    /// material已绑定另一个handoff batch。
    HandoffAlreadyBound {
        /// 已绑定的handoff batch ref。
        existing_handoff_ref: HandoffFactRef,
    },
    /// handoff target plan没有选择本material key。
    HandoffDoesNotCoverMaterial {
        /// 未被handoff覆盖的material key。
        material_key: CapturedMaterialKey,
    },
    /// handoff capture / run / generation lineage与material不一致。
    CapturedMaterialHandoffLineageMismatch,
    /// handoff对本material的derived delivery kind不允许目标transition。
    CapturedMaterialHandoffDeliveryKindMismatch {
        /// transition观察到的material-specific derived delivery kind。
        actual: HandoffMaterialDeliveryKind,
    },
    /// retention block reason为空或不满足caller-safe reason contract。
    CapturedMaterialRetentionReasonInvalid,
    /// material transition time早于capture / previous status time。
    CapturedMaterialTransitionTimestampInvalid,
}
```

error mapper必须穷尽两个enum，不得把path、URL、provider、raw adapter error、stdout/stderr正文、file bytes、secret或candidate body放入error payload。`CaptureSupportError`描述adapter到domain carrier的shape / relation；`CapturedMaterialError`描述Sandbox-owned material value及其set。completeness判定错误由§18独立owner，capture fact assembly错误由§19独立owner，不得合并为generic `DomainError`。

---

## 17. `ObservabilityMaterial` contract

### 17.1 Signal kind、summary 与 source basis

`ObservabilityMaterial` 是 Sandbox 对“可显式交接的 body-free observability material”的唯一 truth owner，不是日志、metric、trace、audit ledger、alert、retention 或 observability store。它必须覆盖两条互斥来源路径：completed run 的 capture 路径，以及 failed / terminated run 的 formal terminal 路径。后一条路径不得为了复用正常流程而创建不存在的 `CaptureFact`。

`ObservabilitySignalKind` / set由Step 4既有`crates/contracts/src/refs.rs`唯一声明，供domain material与contracts view共同复用；本校准分件只是按observability业务主线展开schema。set的empty / duplicate shape错误由`crates/contracts/src/errors.rs::ContractError`承接；mandatory `Audit`、source kind、lineage和signal matrix仍由`ObservabilityMaterialError`承接。

```rust
/// 穷尽一份 Sandbox observability material 可声明的安全信号类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum ObservabilitySignalKind {
    /// isolation backend 提供的 body-free resource usage 摘要。
    ResourceUsage,
    /// Sandbox 已形成的审计关联，不代表外部 audit ledger 已写入。
    Audit,
    /// 可供下游继续关联的 trace 摘要，不保存 span 或 baggage 正文。
    Trace,
    /// 低基数 metric material 摘要，不保存外部时序样本正文。
    Metric,
    /// capture partial、failed、unavailable 或 forbidden-body 诊断标记。
    CaptureDiagnostic,
    /// formal failure classification 对应的安全排障信号。
    Failure,
    /// formal control fact 对应的安全控制信号。
    Control,
    /// formal redline containment 对应的安全安全事件信号。
    Redline,
}

/// 保存非空、kind 唯一且 canonical 排序的 observability signal kinds。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ObservabilitySignalKindSet(Vec<ObservabilitySignalKind>);

impl ObservabilitySignalKindSet {
    /// 构造非空、kind 唯一的 canonical signal kind set。
    pub fn try_new(
        signal_kinds: Vec<ObservabilitySignalKind>,
    ) -> Result<Self, ContractError>;

    /// 返回按 enum canonical 顺序排列的只读切片。
    pub fn as_slice(&self) -> &[ObservabilitySignalKind];
    /// 判断集合是否包含 exact signal kind。
    pub fn contains(&self, signal_kind: ObservabilitySignalKind) -> bool;
}

/// capture hook 或 terminal owner 组装出的 transient body-free signal summary。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ObservabilitySignalSummary {
    /// summary 唯一描述的 Sandbox run ref。
    run_ref: ControlledExecutionRunRef,
    /// summary 与 run / handle 共用的 canonical generation。
    generation_ref: ResourceRef,
    /// 本 material 明示承载的 finite signal kind set。
    signal_kinds: ObservabilitySignalKindSet,
    /// 可为空的 body-free backend safe summary refs。
    summary_refs: SafeSummaryRefSet,
    /// forbidden-body capture 路径必须原样保留的安全 marker set。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// hook 或 formal owner 观察输入的 canonical time。
    observed_at: Timestamp,
}

impl ObservabilitySignalSummary {
    /// 从 exact run lineage、有限信号和 body-free refs 构造 transient summary。
    pub fn try_from_hooks(
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        signal_kinds: ObservabilitySignalKindSet,
        summary_refs: SafeSummaryRefSet,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        observed_at: Timestamp,
    ) -> Result<Self, ObservabilityMaterialError>;

    /// 返回 summary 唯一描述的 run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回 summary 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 finite signal kinds。
    pub fn signal_kinds(&self) -> &ObservabilitySignalKindSet;
    /// 返回 body-free safe summary refs。
    pub fn summary_refs(&self) -> &SafeSummaryRefSet;
    /// 返回 forbidden external body markers。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
    /// 返回 hook / owner observation time。
    pub fn observed_at(&self) -> &Timestamp;
}

/// 区分 observability material 唯一合法的 capture 与 terminal-run 来源依据。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ObservabilityMaterialSourceBasis {
    /// completed run 已形成 immutable capture fact，包括 failed / unavailable capture 结果。
    Capture {
        /// exact immutable capture fact ref。
        capture_ref: CaptureFactRef,
        /// 创建 material 时复制的 canonical capture status。
        capture_status: CaptureFactStatus,
        /// 创建 material 时复制的 typed collection disposition。
        collection_disposition: CaptureCollectionDisposition,
    },
    /// failed / terminated run 已绑定 formal failure、control 或 redline owner。
    TerminalRun {
        /// 创建 material 时 run 的 canonical terminal status。
        run_status: ControlledExecutionRunStatus,
        /// run 已验证并持久化的 formal terminal basis。
        terminal_basis: ControlledRunTerminalBasis,
    },
}
```

`ObservabilitySignalSummary` 的 `summary_refs` 可以为空，因为 formal source ref、finite signal kind、audit trace 和 caller-safe reason 本身可以形成最小非正文材料；但 `signal_kinds` 永远非空且必须包含 `Audit`。所有出现的 safe summary ref 必须以 `ExternalSourceKind::IsolationBackend` 为 source kind；`Observability` source kind只允许作为下游 target / receipt，不能在 handoff 前反向证明 material 已被外部 store 接收。

source-specific signal relation固定如下：

| source basis | required signal kinds | allowed additional kinds | forbidden markers | 禁止关系 |
|---|---|---|---|---|
| capture `Complete` | `Audit` | `ResourceUsage | Trace | Metric` | 必须为空 | 不得用 downstream log 补造 capture output |
| capture `Partial` | `Audit + CaptureDiagnostic` | `ResourceUsage | Trace | Metric` | 必须为空 | 不得隐藏 material gap |
| capture `Failed` | `Audit + CaptureDiagnostic` | `ResourceUsage | Trace | Metric` | 与 capture exact 相等 | 不得改判 run failed 或 capture success |
| capture `Unavailable` | `Audit + CaptureDiagnostic` | `ResourceUsage | Trace | Metric` | 必须为空 | 不得复用旧 capture / observability material |
| terminal `Failed + Failure` | `Audit + Failure` | `ResourceUsage | Trace | Metric` | 必须为空 | 不得创建伪 `CaptureFact` |
| terminal `Terminated + Control` | `Audit + Control` | `ResourceUsage | Trace | Metric` | 必须为空 | 不得把 control 当 tool/runtime result |
| terminal `Terminated + Redline` | `Audit + Redline` | `ResourceUsage | Trace | Metric` | 必须为空 | 不得退化为 advisory-only log |

`TerminalRun` 不允许 `Completed`，也不允许 `Failed + Control`、`Failed + Redline` 或 `Terminated + Failure`。capture path只能引用 `Completed` run；其中 `CaptureFactStatus::Failed | Unavailable` 描述 capture attempt，不改变 source run status。

### 17.2 Fields、factories 与 lifecycle

```rust
/// Sandbox 记录的一份 body-free observability handoff material lifecycle truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ObservabilityMaterial {
    /// 本 material 的 Sandbox-local typed identity。
    observability_material_ref: ObservabilityMaterialRef,
    /// source Sandbox run ref。
    run_ref: ControlledExecutionRunRef,
    /// run owning accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// run owning active environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// run 使用的 established coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// run 使用的 isolation environment handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// source、summary 与 handle 共用的 canonical generation。
    generation_ref: ResourceRef,
    /// capture 或 formal terminal-run 的唯一 source basis。
    source_basis: ObservabilityMaterialSourceBasis,
    /// 本 material 的 finite signal kind set。
    signal_kinds: ObservabilitySignalKindSet,
    /// body-free safe summary refs；允许为空但不能由外部正文替代。
    summary_refs: SafeSummaryRefSet,
    /// forbidden-body capture 路径原样保留的安全 marker set。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// capture / terminal owner 给出的 caller-safe source reason。
    source_reason: Option<SandboxReason>,
    /// observability material 独立 lifecycle status。
    material_status: ObservabilityMaterialStatus,
    /// 当前唯一 handoff batch ref；`Prepared` 时为空。
    handoff_ref: Option<HandoffFactRef>,
    /// failed handoff 的 caller-safe原因；其他状态为空。
    status_reason: Option<SandboxReason>,
    /// material 首次准备完成的 canonical time。
    prepared_at: Timestamp,
    /// 当前 lifecycle status 生效时间。
    status_changed_at: Timestamp,
    /// 最近一次 material transition 的 audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl ObservabilityMaterial {
    /// 从同批 capture identity、exact completed run、capture fact与signal summary创建`Prepared` material。
    pub fn prepare_from_capture(
        identity_bundle: &CaptureRecordingIdentityBundle,
        run: &ControlledExecutionRun,
        capture: &CaptureFact,
        signal_summary: ObservabilitySignalSummary,
        audit_trace_ref: SandboxAuditTraceRef,
        prepared_at: Timestamp,
    ) -> Result<Self, ObservabilityMaterialError>;

    /// 从 failed / terminated run与其exact formal terminal owner创建`Prepared` investigation material。
    pub fn prepare_from_terminal_run(
        observability_material_ref: ObservabilityMaterialRef,
        run: &ControlledExecutionRun,
        terminal_basis: &ControlledRunTerminalBasis,
        signal_summary: ObservabilitySignalSummary,
        audit_trace_ref: SandboxAuditTraceRef,
        prepared_at: Timestamp,
    ) -> Result<Self, ObservabilityMaterialError>;

    /// 绑定覆盖 observability target 的唯一 pending handoff batch。
    pub fn mark_handoff_pending(
        &mut self,
        handoff: &HandoffFact,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ObservabilityMaterialError>;

    /// 从同一batch对本observability material推导的`Failed` delivery记录handoff failure。
    pub fn mark_handoff_failed(
        &mut self,
        handoff: &HandoffFact,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ObservabilityMaterialError>;

    /// 从同一batch对本observability material推导的`Delivered` delivery记录已交接事实。
    pub fn mark_handoff_recorded(
        &mut self,
        handoff: &HandoffFact,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ObservabilityMaterialError>;

    /// 返回 observability material identity。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回 source run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回 owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 owning environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 capture 或 terminal-run source basis。
    pub fn source_basis(&self) -> &ObservabilityMaterialSourceBasis;
    /// 返回 finite signal kinds。
    pub fn signal_kinds(&self) -> &ObservabilitySignalKindSet;
    /// 返回 body-free safe summary refs。
    pub fn summary_refs(&self) -> &SafeSummaryRefSet;
    /// 返回 forbidden external body markers。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
    /// 返回 source owner 的 caller-safe reason。
    pub fn source_reason(&self) -> Option<&SandboxReason>;
    /// 返回 canonical observability material status。
    pub fn material_status(&self) -> ObservabilityMaterialStatus;
    /// 返回当前唯一 handoff batch ref。
    pub fn handoff_ref(&self) -> Option<&HandoffFactRef>;
    /// 返回 failed handoff 的 caller-safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回 material prepared time。
    pub fn prepared_at(&self) -> &Timestamp;
    /// 返回 current status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近一次 transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 判断 material 是否仍可打开其唯一 handoff batch。
    pub fn can_open_handoff(&self) -> bool;
}
```

`prepare_from_capture`必须验证 bundle、run与capture三方 identity / lineage：run为`Completed`；bundle capture ref等于run预绑定ref；capture的run/context/identity/boundary/handle/generation等于run；bundle observability ref等于待建material ref；signal summary的run/generation一致，signal / marker relation满足§17.1。它复制capture status / disposition和safe reason，不读取capture material locator或body。

`prepare_from_terminal_run`必须先调用run的formal relation：`Failed`只能接受与`run.terminal_basis()`相等的`Failure`；`Terminated`只能接受相等的`Control | Redline`。它复制run lineage和owner safe reason；不读取run预绑定的capture ref，不创建capture fact，也不声明output material。terminal material identity必须与run identity及预绑定capture identity都不碰撞。

lifecycle固定为：

```text
factory -> Prepared
Prepared -> HandoffPending
HandoffPending -> HandoffFailed | HandoffRecorded
HandoffRecorded -> terminal
HandoffFailed -> terminal for automatic retry
```

material lifecycle只消费`handoff.observability_material_delivery_kind()`，不能直接复制batch aggregate。derived delivery为`Pending | Retryable`时保持或恢复`HandoffPending`，为`Failed`时写入`HandoffFailed`，为`Delivered`时写入`HandoffRecorded`；cleanup aggregate block不改变已成立的delivery结果。重试必须继续使用同一`handoff_ref`，不得为 material 创建第二个batch。observability ack只推进本material lifecycle，不反写capture、run、failure、control、redline或外部observability store truth。

### 17.3 Status relation 与 exact errors

| material status | handoff ref | status reason | required handoff relation | cleanup implication |
|---|---|---|---|---|
| `Prepared` | `None` | `None` | 尚未打开 handoff | 必须阻断需要该material交接的cleanup |
| `HandoffPending` | `Some` | `None` | observability-selected delivery为`Pending | Retryable` | 阻断cleanup |
| `HandoffFailed` | `Some` | `Some` | observability-selected delivery为`Failed` | 阻断cleanup / 等待明确处置 |
| `HandoffRecorded` | `Some` | `None` | observability-selected delivery为`Delivered`；aggregate可因cleanup block暂时显示blocked | 不单独阻断；仍服从cleanup / redline guard |

```rust
/// observability material source、body-free signal或lifecycle不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ObservabilityMaterialError {
    /// signal kind set缺少mandatory `Audit`。
    MissingMandatoryAuditSignal,
    /// safe summary ref来源不是`IsolationBackend`。
    ObservabilitySummarySourceKindInvalid,
    /// signal summary的run / generation lineage与source不一致。
    ObservabilitySignalLineageMismatch,
    /// source basis、signal kinds、markers或reason不满足§17.1 closed matrix。
    ObservabilitySourceSignalRelationInvalid,
    /// capture identity bundle、run和capture ref关系不一致。
    CaptureObservabilityIdentityMismatch,
    /// capture fact与completed run lineage不一致。
    CaptureObservabilityLineageMismatch,
    /// capture source factory收到非`Completed` run。
    CaptureSourceRunWasNotCompleted {
        /// factory观察到的canonical run status。
        actual: ControlledExecutionRunStatus,
    },
    /// terminal factory收到非`Failed | Terminated` run。
    TerminalSourceRunWasNotTerminal {
        /// factory观察到的canonical run status。
        actual: ControlledExecutionRunStatus,
    },
    /// terminal basis与run status、run已保存basis或formal owner关系不一致。
    TerminalObservabilityBasisMismatch,
    /// observability material identity与run或capture identity碰撞。
    ObservabilityIdentityCollision,
    /// prepared time早于source / signal observation或不满足canonical timestamp contract。
    ObservabilityTimestampInvalid,
    /// material已经绑定另一个handoff batch。
    ObservabilityHandoffAlreadyBound {
        /// 已绑定的handoff batch ref。
        existing_handoff_ref: HandoffFactRef,
    },
    /// handoff没有任何target selection覆盖本observability material。
    ObservabilityHandoffCoverageMismatch,
    /// handoff对本observability material的derived delivery kind不允许目标transition。
    ObservabilityHandoffDeliveryKindMismatch {
        /// transition观察到的material-specific derived delivery kind。
        actual: HandoffMaterialDeliveryKind,
    },
    /// material lifecycle status与handoff ref、reason或timestamps关系不一致。
    ObservabilityMaterialStatusRelationInvalid {
        /// relation无法成立的canonical status。
        status: ObservabilityMaterialStatus,
    },
    /// lifecycle transition不在closed graph中。
    ObservabilityMaterialTransitionNotAllowed {
        /// transition前实际status。
        from: ObservabilityMaterialStatus,
        /// caller请求的目标status。
        to: ObservabilityMaterialStatus,
    },
}
```

Step 7 / 9 / `6R-04`必须继续保持：capture path下`CaptureFact + CapturedMaterialRef rows + ObservabilityMaterial + audit + relay/projection marker + stored result`同UoW；terminal path下`run terminal transition + formal owner + ObservabilityMaterial + audit + relay/projection marker + stored result`同UoW或通过明确staged relation原子提交。禁止先提交terminal run再best-effort补observability material；若formal owner本身在前一事务已存在，后续material UoW仍必须以exact owner version / relation重验，不能读取latest。

---

## 18. Capture completeness decision 与 guard contract

### 18.1 `CaptureCompletenessDecision`

`CaptureCompletenessDecision`是一次纯评估结果，不是repository truth，也没有named ref。它保存足够输入摘要，使`CaptureFact` factory能够重验guard、candidate与material set的一一关系；它不复制locator、digest、safe summary或material body。

```rust
/// capture completeness guard对一个exact collection candidate形成的immutable decision value。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureCompletenessDecision {
    /// 形成decision的immutable guard ref。
    guard_ref: CaptureCompletenessGuardRef,
    /// decision唯一适用的预生成capture fact ref。
    capture_ref: CaptureFactRef,
    /// decision唯一适用的completed run ref。
    run_ref: ControlledExecutionRunRef,
    /// run、requirements与candidate共用的canonical generation。
    generation_ref: ResourceRef,
    /// 本次capture adapter collection的typed disposition。
    collection_disposition: CaptureCollectionDisposition,
    /// candidate set中的完整material key set；non-collected时为空。
    material_keys: CapturedMaterialKeySet,
    /// 只在`Collected`时按requirements机械生成的gap set。
    material_gaps: CaptureMaterialGapSet,
    /// forbidden body整批拒绝时保留的ordered-unique安全marker set。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// completeness判定形成的canonical capture fact status。
    capture_status: CaptureFactStatus,
    /// non-complete decision的固定caller-safe catalog reason。
    status_reason: Option<SandboxReason>,
    /// adapter failed / source unavailable时保留的额外caller-safe source reason。
    source_reason: Option<SandboxReason>,
    /// application clock提供的纯评估时间。
    evaluated_at: Timestamp,
}

impl CaptureCompletenessDecision {
    /// 仅供matching completeness guard按closed matrix构造decision。
    fn from_guard_evaluation(
        guard_ref: CaptureCompletenessGuardRef,
        candidate: &CaptureCollectionCandidate,
        material_gaps: CaptureMaterialGapSet,
        capture_status: CaptureFactStatus,
        status_reason: Option<SandboxReason>,
        source_reason: Option<SandboxReason>,
        evaluated_at: Timestamp,
    ) -> Result<Self, CaptureCompletenessGuardError>;

    /// 返回形成decision的guard ref。
    pub fn guard_ref(&self) -> &CaptureCompletenessGuardRef;
    /// 返回decision唯一适用的capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回decision唯一适用的completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回decision绑定的canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回typed collection disposition。
    pub fn collection_disposition(&self) -> CaptureCollectionDisposition;
    /// 返回完整candidate material key set。
    pub fn material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回required material gap set。
    pub fn material_gaps(&self) -> &CaptureMaterialGapSet;
    /// 返回forbidden external body marker set。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
    /// 返回canonical capture fact status。
    pub fn capture_status(&self) -> CaptureFactStatus;
    /// 返回non-complete canonical status reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回adapter提供的额外caller-safe source reason。
    pub fn source_reason(&self) -> Option<&SandboxReason>;
    /// 返回decision evaluation time。
    pub fn evaluated_at(&self) -> &Timestamp;

    /// 只在status为`Complete`时返回true。
    pub fn is_complete(&self) -> bool;
    /// 只在`Failed | Unavailable`时要求后序failure classification。
    pub fn requires_failure_classification(&self) -> bool;
    /// 只在`Collected`时允许candidate material定格，即使required gap使capture为`Failed`。
    pub fn allows_materialization(&self) -> bool;
}
```

decision field relation固定如下：

| collection disposition | gaps | forbidden markers | status | status reason | source reason | materialization |
|---|---|---|---|---|---|---|
| `Collected`，无gap | empty | empty | `Complete` | `None` | `None` | allow all exact candidates |
| `Collected`，全部`RecordPartial` gap | non-empty、无failed gap | empty | `Partial` | catalog partial | `None` | allow all exact candidates |
| `Collected`，任一`RecordFailed` gap | non-empty、含failed gap | empty | `Failed` | catalog failed requirement | `None` | allow all exact candidates |
| `AdapterFailed` | empty | empty | `Failed` | catalog adapter failed | candidate adapter reason | deny；candidate set本就为空 |
| `SourceUnavailable` | empty | empty | `Unavailable` | catalog source unavailable | candidate adapter reason | deny；candidate set本就为空 |
| `ForbiddenBodyRejected` | empty | non-empty | `Failed` | catalog forbidden body | `None` | deny entire batch |

`AdapterFailed | SourceUnavailable | ForbiddenBodyRejected`不生成“全部required material缺失”的gap。此时没有完成可比较的collection，根因由typed disposition表达；伪造gap会把adapter/source/security根因错误降格为普通material count不足。`Collected + RecordFailed`仍保留安全candidate并允许物化，便于failure、cleanup和investigation链读取；它不允许调用方把capture改判为partial或complete。

### 18.2 `CaptureCompletenessGuard`

```rust
/// 绑定一个completed run及其最低capture contract并执行body-free completeness纯判断。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureCompletenessGuard {
    /// immutable completeness guard identity。
    guard_ref: CaptureCompletenessGuardRef,
    /// completed run预绑定且本guard唯一允许评估的capture ref。
    capture_ref: CaptureFactRef,
    /// 本guard唯一绑定的completed controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// run owning accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// run使用的established coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// run使用的active isolation handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// run与requirements/candidate共用的canonical generation。
    generation_ref: ResourceRef,
    /// 本guard固定绑定的最低capture material contract。
    requirements: CaptureMaterialRequirementSet,
    /// 本guard固定绑定的caller-safe status reason catalog。
    reason_catalog: CaptureCompletenessReasonCatalog,
    /// application clock提供的guard activation time。
    activated_at: Timestamp,
}

impl CaptureCompletenessGuard {
    /// 绑定exact completed run的预生成capture target与validated requirement set。
    pub fn bind(
        guard_ref: CaptureCompletenessGuardRef,
        run: &ControlledExecutionRun,
        requirements: CaptureMaterialRequirementSet,
        reason_catalog: CaptureCompletenessReasonCatalog,
        activated_at: Timestamp,
    ) -> Result<Self, CaptureCompletenessGuardError>;

    /// 对matching body-free collection candidate作纯判断；不读取repository或material body。
    pub fn evaluate(
        &self,
        candidate: &CaptureCollectionCandidate,
        evaluated_at: Timestamp,
    ) -> Result<CaptureCompletenessDecision, CaptureCompletenessGuardError>;

    /// 返回immutable completeness guard identity。
    pub fn guard_ref(&self) -> &CaptureCompletenessGuardRef;
    /// 返回guard唯一允许评估的capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回guard绑定的completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回run owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回run使用的established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回run使用的isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回guard绑定的canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回immutable最低capture material contract。
    pub fn requirements(&self) -> &CaptureMaterialRequirementSet;
    /// 返回immutable caller-safe reason catalog。
    pub fn reason_catalog(&self) -> &CaptureCompletenessReasonCatalog;
    /// 返回guard activation time。
    pub fn activated_at(&self) -> &Timestamp;
}
```

`bind`必须先调用`run.require_capture_target()`，并拒绝任何非`Completed` run；不能接受`bool run_completed`、caller传入capture ref或repository latest。随后验证requirements的capture/run/generation与run完全相等，且`activated_at`不早于run `finished_at`和`status_changed_at`。成功后复制run的context/boundary/handle lineage；这些ref只用于后续fact assembly重验，不允许guard加载外部对象。

`evaluate`按固定顺序执行：

1. 校验candidate的capture/run/generation与guard binding完全相等，且`evaluated_at >= activated_at`和`evaluated_at >= candidate.collected_at`。
2. 重新验证candidate disposition relation；`Collected`还必须执行`output_summary.require_keys_in_candidates(material_candidates)`。
3. `Collected`按requirements逐kind计数并构造gap set；其他disposition必须使用空gap set。
4. 使用§18.1 closed matrix穷尽匹配disposition和gap，复制reason catalog对应项；不得读取reason文本推断status。
5. `from_guard_evaluation`重验material keys、forbidden markers、status/reason/source reason关系后返回immutable decision。

guard不物化`CapturedMaterialRef`、不创建`CaptureFact`、不生成observability material、不写audit、不调用adapter。application只能在guard decision成功后用相同candidate逐项调用`CapturedMaterialRef::from_candidate`，再把candidate、material set和decision一起交给§19 factory。

### 18.3 `CaptureCompletenessGuardError`

```rust
/// capture completeness guard binding、lineage、计数或decision relation失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureCompletenessGuardError {
    /// bind输入run不是`Completed`。
    RunWasNotCompleted {
        /// bind时run实际canonical status。
        actual: ControlledExecutionRunStatus,
    },
    /// completed run不能返回其预生成capture target。
    RunCaptureTargetWasNotAvailable,
    /// requirement set与run capture/run/generation lineage不一致。
    RequirementSetLineageMismatch,
    /// guard activation time早于run completion/status time或不满足canonical timestamp contract。
    GuardActivationTimestampInvalid,
    /// evaluate candidate的capture ref与guard binding不一致。
    CandidateCaptureRefMismatch {
        /// guard固定绑定的capture ref。
        expected: CaptureFactRef,
        /// candidate实际携带的capture ref。
        actual: CaptureFactRef,
    },
    /// evaluate candidate的run ref与guard binding不一致。
    CandidateRunRefMismatch {
        /// guard固定绑定的run ref。
        expected: ControlledExecutionRunRef,
        /// candidate实际携带的run ref。
        actual: ControlledExecutionRunRef,
    },
    /// evaluate candidate的generation与guard binding不一致。
    CandidateGenerationMismatch,
    /// candidate disposition与summary/material/marker/reason关系不一致。
    CandidateDispositionRelationInvalid {
        /// relation无法成立的typed disposition。
        disposition: CaptureCollectionDisposition,
    },
    /// `Collected` output summary与完整candidate material set不一致。
    CollectedOutputSummaryRelationInvalid,
    /// candidate count无法无损表示为gap中的`u32` observed count。
    ObservedMaterialCountOverflow {
        /// 计数溢出的canonical material kind。
        material_kind: MaterialKind,
    },
    /// guard内部生成了重复material kind gap。
    DuplicateCaptureMaterialGapKind {
        /// 重复出现的canonical material kind。
        material_kind: MaterialKind,
    },
    /// gap的required/observed/disposition关系与requirement set不一致。
    CaptureMaterialGapRelationInvalid {
        /// relation无法成立的canonical material kind。
        material_kind: MaterialKind,
    },
    /// evaluation time早于activation/collection或不满足canonical timestamp contract。
    EvaluationTimestampInvalid,
    /// decision的disposition、gap、marker与capture status关系不一致。
    CompletenessDecisionStatusRelationInvalid {
        /// relation无法成立的canonical capture status。
        status: CaptureFactStatus,
    },
    /// decision的status reason或source reason与closed matrix不一致。
    CompletenessDecisionReasonRelationInvalid {
        /// reason relation无法成立的canonical capture status。
        status: CaptureFactStatus,
    },
    /// decision material key set与candidate set不一致。
    CompletenessDecisionMaterialKeysMismatch,
}
```

exact error不携带candidate body、locator、digest、raw adapter reason文本或marker之外的外部正文。`RunCaptureTargetWasNotAvailable`保留upstream typed失败边界；application mapper必须保留source error chain，不能把它解析成status字符串。新增collection disposition、capture status或gap disposition时，§18.1矩阵与`evaluate`的穷尽match必须同时编译失败并回到本节更新。

---

## 19. Immutable `CaptureFact` contract

### 19.1 Capture / observability identity bundle

run已预生成唯一`CaptureFactRef`，capture application step只允许再预生成一个唯一`ObservabilityMaterialRef`。二者需要在对象互相引用前先固定，因此使用transient identity bundle打破assembly循环；bundle不是truth、DTO、repository object或handoff receipt。

```rust
/// 把completed run的预绑定capture ref与本次预生成observability material ref绑定为不可拆分输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureRecordingIdentityBundle {
    /// completed run唯一允许使用的capture fact ref。
    capture_ref: CaptureFactRef,
    /// 本次capture必须创建的唯一observability material ref。
    observability_material_ref: ObservabilityMaterialRef,
}

impl CaptureRecordingIdentityBundle {
    /// 从exact completed run和同次id-generation step的observability ref构造bundle。
    pub fn try_for_run(
        run: &ControlledExecutionRun,
        observability_material_ref: ObservabilityMaterialRef,
    ) -> Result<Self, CaptureFactError>;

    /// 返回run预绑定的capture fact ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回本次必须创建的observability material ref。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
}
```

`try_for_run`必须调用`run.require_capture_target()`，拒绝非`Completed` run，并拒绝observability material与run / capture底层resource identity碰撞。bundle只证明本次in-memory输入不可拆分；Step 7 repository仍必须以`capture_ref`、`run_ref`和`observability_material_ref`建立持久化唯一约束。不得从capture ref字符串拼observability ref，也不得在observability adapter内部后生成identity。

### 19.2 `CaptureFact` fields 与 immutable factory

```rust
/// Sandbox对一次completed controlled run形成的immutable body-free capture truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureFact {
    /// run预绑定且本fact唯一使用的capture identity。
    capture_ref: CaptureFactRef,
    /// source completed controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// run owning accepted controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// run owning active execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// run使用的established coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// run使用的isolation environment handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// run、candidate和material共用的canonical generation。
    generation_ref: ResourceRef,
    /// 形成capture判定的immutable completeness guard ref。
    completeness_guard_ref: CaptureCompletenessGuardRef,
    /// capture adapter本次collection的typed disposition。
    collection_disposition: CaptureCollectionDisposition,
    /// `Collected`时保存的body-free execution output summary。
    output_summary: Option<ExecutionOutputSummary>,
    /// 独立material values在本capture group中的完整key set。
    material_keys: CapturedMaterialKeySet,
    /// required material contract的canonical gap set。
    material_gaps: CaptureMaterialGapSet,
    /// forbidden body整批拒绝时保留的安全marker set。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// 本capture必须原子创建的唯一observability material ref。
    observability_material_ref: ObservabilityMaterialRef,
    /// immutable canonical capture fact status。
    capture_status: CaptureFactStatus,
    /// non-complete capture的固定caller-safe status reason。
    status_reason: Option<SandboxReason>,
    /// adapter failed / source unavailable时的额外caller-safe source reason。
    source_reason: Option<SandboxReason>,
    /// completeness decision的pure evaluation time。
    completeness_evaluated_at: Timestamp,
    /// capture truth及其同批material / observability truth的canonical record time。
    captured_at: Timestamp,
    /// 本immutable capture truth对应的audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
}

impl CaptureFact {
    /// 从exact run、guard、candidate、decision和material set单次定格capture truth。
    pub fn record(
        identity_bundle: &CaptureRecordingIdentityBundle,
        run: &ControlledExecutionRun,
        guard: &CaptureCompletenessGuard,
        candidate: &CaptureCollectionCandidate,
        decision: &CaptureCompletenessDecision,
        materials: &CapturedMaterialRefSet,
        audit_trace_ref: SandboxAuditTraceRef,
        captured_at: Timestamp,
    ) -> Result<Self, CaptureFactError>;

    /// 返回immutable capture fact identity。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回source completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回run owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回run owning environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回run使用的established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回run使用的isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回capture绑定的canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回形成capture判定的completeness guard ref。
    pub fn completeness_guard_ref(&self) -> &CaptureCompletenessGuardRef;
    /// 返回typed collection disposition。
    pub fn collection_disposition(&self) -> CaptureCollectionDisposition;
    /// 返回`Collected` execution output summary。
    pub fn output_summary(&self) -> Option<&ExecutionOutputSummary>;
    /// 返回独立captured material values的完整key set。
    pub fn material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回required material gap set。
    pub fn material_gaps(&self) -> &CaptureMaterialGapSet;
    /// 返回forbidden external body marker set。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
    /// 返回本capture唯一observability material ref。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回canonical capture fact status。
    pub fn capture_status(&self) -> CaptureFactStatus;
    /// 返回non-complete capture的canonical status reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回adapter/source额外caller-safe reason。
    pub fn source_reason(&self) -> Option<&SandboxReason>;
    /// 返回completeness decision evaluation time。
    pub fn completeness_evaluated_at(&self) -> &Timestamp;
    /// 返回capture truth record time。
    pub fn captured_at(&self) -> &Timestamp;
    /// 返回capture truth audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只在canonical status为`Complete`时返回true。
    pub fn is_complete(&self) -> bool;
    /// 只在`Failed | Unavailable`时要求后序failure classification。
    pub fn requires_failure_classification(&self) -> bool;
    /// 判断capture是否含至少一个可供后序material handoff评估的key。
    pub fn has_captured_materials(&self) -> bool;
    /// 所有capture status都必须为独立observability material进入显式handoff保留ref。
    pub fn requires_observability_handoff(&self) -> bool;
}
```

`record`按以下固定顺序验证并组装，不允许application选择性跳过：

1. `identity_bundle.capture_ref == run.require_capture_target()`，run必须仍为`Completed`；复制run的context、environment identity、boundary、handle和generation lineage。
2. guard的capture/run/context/boundary/handle/generation与run完全相等；candidate和decision的capture/run/generation与guard完全相等。
3. decision的guard ref等于guard ref，且decision的disposition、material keys、forbidden markers、status、reasons和evaluation time与candidate / closed matrix完全一致。
4. `decision.allows_materialization()`时，materials必须与candidate一一对应：key set相等，每项kind、locator、digest、summary、size、capture/run/generation都相等，status只能是`Captured`；不允许material set漏项、增项或重写candidate。
5. decision禁止materialization时materials必须为空；forbidden-body candidate绝不写material locator。`Collected`即使status为`Failed`也按第4项保存全部安全candidate。
6. 每个material的`captured_at`、`status_changed_at`和`last_audit_trace_ref`必须分别等于fact的`captured_at`和`audit_trace_ref`，证明同批assembly；`captured_at >= decision.evaluated_at >= candidate.collected_at`。
7. 从candidate复制optional output summary，从decision复制keys/gaps/markers/status/reasons，并写入bundle的唯一observability ref。factory不创建observability body、不调用adapter、不保存repository。

fact不保存`CapturedMaterialRefSet`本体，只保存exact key set。material lifecycle在独立value rows中推进，handoff ack / failed / retention变化不得更新`CaptureFact`。fact也不保存artifact ref、evidence alias、observability receipt、handoff status、cleanup status或failure classification ref；这些由独立owner通过capture ref关联。

### 19.3 Capture status / field relation

| status | collection disposition | output summary | material keys / rows | gaps | forbidden markers | status/source reason |
|---|---|---|---|---|---|---|
| `Complete` | `Collected` | `Some` | exact candidate keys / rows；允许为空仅在requirements仍满足时，但mandatory ExitStatus使当前实际非空 | empty | empty | `None / None` |
| `Partial` | `Collected` | `Some` | exact candidate keys / rows | non-empty、全部`RecordPartial` | empty | `Some / None` |
| `Failed` requirement gap | `Collected` | `Some` | exact candidate keys / rows | non-empty、至少一项`RecordFailed` | empty | `Some / None` |
| `Failed` adapter | `AdapterFailed` | `None` | empty / no rows | empty | empty | `Some / Some` |
| `Failed` forbidden body | `ForbiddenBodyRejected` | `None` | empty / no rows | empty | non-empty | `Some / None` |
| `Unavailable` | `SourceUnavailable` | `None` | empty / no rows | empty | empty | `Some / Some` |

`CaptureFactStatus`没有`Pending`且没有transition method。capture in-flight属于application / adapter调用状态；一旦`record`成功，该fact immutable。重试必须沿同一idempotency key读取已提交fact或在确认无提交后重新使用同一预绑定capture ref，不能生成第二个fact、把`Unavailable`原地改`Complete`或用后续handoff成功覆盖`Partial | Failed`。

### 19.4 `CaptureFactError`

```rust
/// capture identity、lineage、guard decision、material assembly或immutable field relation失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureFactError {
    /// observability material ref与run/capture底层resource identity碰撞。
    CaptureObservabilityIdentityCollision,
    /// identity bundle输入run不是`Completed`。
    RunWasNotCompleted {
        /// factory观察到的run canonical status。
        actual: ControlledExecutionRunStatus,
    },
    /// run不能返回预绑定capture target或bundle capture ref与之不一致。
    RunCaptureTargetMismatch,
    /// guard的capture/run/context/boundary/handle/generation与run不一致。
    CompletenessGuardRunLineageMismatch,
    /// candidate或decision的capture/run/generation与guard不一致。
    CaptureDecisionInputLineageMismatch,
    /// decision的guard ref不是本次exact completeness guard。
    CompletenessDecisionGuardMismatch,
    /// decision与candidate的disposition、keys、markers、reasons或evaluation time不一致。
    CompletenessDecisionCandidateMismatch,
    /// decision的status / gap / reason relation不满足§19.3 closed matrix。
    CaptureStatusFieldRelationInvalid {
        /// relation无法成立的canonical capture status。
        status: CaptureFactStatus,
    },
    /// output summary与candidate/disposition关系不一致。
    CaptureOutputSummaryRelationInvalid,
    /// decision允许物化但material key set与candidate不一一对应。
    CapturedMaterialCoverageMismatch,
    /// material row的kind、locator、digest、summary、size或lineage与candidate不一致。
    CapturedMaterialCandidateMismatch {
        /// relation不一致的material key。
        material_key: CapturedMaterialKey,
    },
    /// material row在capture assembly时不是初始`Captured`状态。
    CapturedMaterialWasNotInitial {
        /// 非初始状态的material key。
        material_key: CapturedMaterialKey,
        /// factory观察到的canonical material status。
        actual: CapturedMaterialStatus,
    },
    /// decision禁止物化但收到非空material set。
    MaterializationWasForbidden,
    /// material row与fact没有使用同一个capture time或audit trace ref。
    CapturedMaterialBatchRelationMismatch {
        /// batch relation不一致的material key。
        material_key: CapturedMaterialKey,
    },
    /// capture time早于collection/decision或不满足canonical timestamp contract。
    CaptureTimestampInvalid,
}
```

`CaptureFactError`只描述domain assembly不变量。duplicate run/capture、optimistic version conflict、UoW commit unknown和repository corruption属于Step 7 / 11 typed persistence error；capture adapter unavailable已经是`CaptureCollectionDisposition`，不能再包装为本enum中的raw error字符串。factory source error必须保留typed chain，不得统一转成generic validation message。

### 19.5 Field source、immutability 与 Step 7 forward obligations

| field group | exact source | invariant | forbidden substitute |
|---|---|---|---|
| capture / observability refs | run预绑定capture ref + same attempt generated observability ref | 三类object identity不碰撞；一个run恰好一个capture / observability pair | ref字符串拼接、adapter生成、repository latest |
| run lineage | exact committed `ControlledExecutionRun::Completed` | context / identity / boundary / handle / generation原样复制 | caller refs、runtime execution id、member / runner identity |
| guard / decision | exact bound guard + same candidate decision | ref、lineage、status matrix、evaluation time完全相等 | `capture_complete` bool、reason解析、重评旧decision |
| output / materials | typed body-free candidate + relation-checked material rows | summary optional relation；keys/rows 1:1；fact只存keys | stdout/stderr/file body、path/URL、artifact/evidence ref |
| observability | mandatory pre-generated named ref | batch 5必须形成独立material truth，所有status都存在 | optional ref、日志存在性、observability ack |
| status / gaps / reasons | completeness decision closed matrix | immutable；handoff / cleanup不反写 | query visible status、handoff status、generic error text |
| time / audit | one application clock record time + staged audit ref | material/fact same batch；monotonic | backend timestamp冒充record time、post-commit补audit |

Step 7 / 9 / 11回归必须继续闭合以下不可弱化义务；本批只登记owner与语义，不提前写trait / repository签名：

| forward owner | exact obligation | prohibited fallback |
|---|---|---|
| capture id generation | 读取run预绑定capture ref，只新生成唯一observability material ref；同一idempotent attempt重复返回同一identity pair | 每次retry生成新capture/observability ref |
| capture adapter outcome | adapter只返回`CaptureCollectionCandidate`四类typed disposition；success必须含body-free summary/candidates，failure不返回raw body | adapter直接返回`CaptureFact`、material rows或generic error string |
| capture repository / UoW | `(run_ref)`唯一capture、`capture_ref`主键唯一、`observability_material_ref`跨capture唯一；capture fact + material rows + observability material + audit + relay/projection marker + stored result原子提交 | 先存fact后补material/observability、只靠application查重 |
| observability material assembly | batch 5对象使用bundle ref和exact capture/run lineage；失败/unavailable capture仍形成独立prepared material并保留status/marker摘要 | 只有complete才创建、用log替代truth、反写capture status |
| capture command flow | load exact completed run -> collect typed candidate -> bind/evaluate guard -> materialize safe candidates -> assemble fact/observability -> one UoW commit | adapter内写库、guard后更换candidate、forbidden body仍保存locator |
| duplicate / recovery | committed则读取同一fact和stored result；commit unknown先按capture ref / idempotency record inspect，证明absent才重试同一identity | timeout后生成新fact、把unknown当absent、改写既有immutable fact |

`CaptureFact`、material rows和`ObservabilityMaterial`的原子保存是Step 7 UoW唯一性要求，不代表三者是同一对象。后续material / observability handoff各自更新独立lifecycle truth；任何ack、retry或failure都不能回滚或重写capture fact。failed/unavailable capture必须形成observability material，但它只记录该capture的body-free status、marker、usage/audit输入，不能把capture改判成功。

---

## 20. Handoff target plan 与 per-target progress contract

### 20.1 `HandoffTarget` 与 set

`HandoffMaterialSelection`是Step 4既有`crates/contracts/src/refs.rs`唯一声明，domain target / guard和contracts view共同复用；本校准分件只是按handoff业务主线展开schema。它只表达body-free selection union；target kind、source kind、non-empty captured selection和source coverage由各自domain / view constructor校验。

```rust
/// 穷尽一个downstream target在本batch中接收的Sandbox-owned material refs范围。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffMaterialSelection {
    /// 接收非空captured material key子集，不接收observability material。
    CapturedMaterials {
        /// 本target接收的canonical非空material key set。
        material_keys: CapturedMaterialKeySet,
    },
    /// 只接收exact observability material ref。
    ObservabilityMaterial {
        /// 本target接收的observability material ref。
        observability_material_ref: ObservabilityMaterialRef,
    },
    /// 同时接收非空captured material key子集与exact observability material ref。
    CapturedAndObservability {
        /// 本target接收的canonical非空material key set。
        material_keys: CapturedMaterialKeySet,
        /// 本target接收的observability material ref。
        observability_material_ref: ObservabilityMaterialRef,
    },
}

impl HandoffMaterialSelection {
    /// 返回selection中的captured material keys；observability-only时返回`None`。
    pub fn captured_material_keys(&self) -> Option<&CapturedMaterialKeySet>;
    /// 返回selection中的observability material ref；captured-only时返回`None`。
    pub fn observability_material_ref(&self) -> Option<&ObservabilityMaterialRef>;
    /// 判断selection是否包含至少一个captured material key。
    pub fn includes_captured_materials(&self) -> bool;
    /// 判断selection是否包含observability material。
    pub fn includes_observability_material(&self) -> bool;
}

/// 一个已解析且可由 material handoff port选择的下游target plan item。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTarget {
    /// target 的 closed owner kind；不能由ref字符串反推。
    target_kind: HandoffTargetKind,
    /// resolver提供的stable body-free downstream target ref。
    target_ref: ExternalSourceRef,
    /// 本target接收的exact Sandbox-owned material refs范围。
    material_selection: HandoffMaterialSelection,
}

impl HandoffTarget {
    /// 从validated handoff plan映射target kind、matching external ref与material selection。
    pub fn try_from_validated_plan(
        target_kind: HandoffTargetKind,
        target_ref: ExternalSourceRef,
        material_selection: HandoffMaterialSelection,
    ) -> Result<Self, HandoffTargetError>;

    /// 返回 closed downstream target kind。
    pub fn target_kind(&self) -> HandoffTargetKind;
    /// 返回 stable body-free downstream target ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回本target的exact material selection。
    pub fn material_selection(&self) -> &HandoffMaterialSelection;

    /// 返回kind与external source kind是否满足closed映射。
    pub fn has_matching_source_kind(&self) -> bool;
}

/// 保存非空、target identity唯一且保持validated plan顺序的完整required target plan。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetSet(Vec<HandoffTarget>);

impl HandoffTargetSet {
    /// 构造非空完整material handoff plan；集合内每个target均为本batch required target。
    pub fn try_new(
        targets: Vec<HandoffTarget>,
    ) -> Result<Self, HandoffTargetError>;

    /// 返回保持validated plan顺序的只读切片。
    pub fn as_slice(&self) -> &[HandoffTarget];
    /// 返回exact external target对应的plan item。
    pub fn get(&self, target_ref: &ExternalSourceRef) -> Option<&HandoffTarget>;
    /// 判断target plan是否包含指定closed kind。
    pub fn contains_kind(&self, target_kind: HandoffTargetKind) -> bool;
    /// 返回完整target数量。
    pub fn len(&self) -> usize;
}
```

closed kind / external source mapping：

| target kind | required `ExternalSourceKind` | 当前 material 角色 | 禁止解释 |
|---|---|---|---|
| `Artifact` | `Artifact` | `CapturedMaterials` | Sandbox已形成Artifact或evidence truth |
| `Runtime` | `Runtime` | `CapturedMaterials | CapturedAndObservability` | runtime agent loop已推进 |
| `Runner` | `Runner` | `CapturedMaterials | CapturedAndObservability` | runner product execution已完成 |
| `Observability` | `Observability` | `ObservabilityMaterial` | telemetry/audit store已持久化 |
| `Investigation` | `Investigation` | `ObservabilityMaterial` | investigation lifecycle已完成 |
| `EventRelay` | 不适用 | 由`SandboxEventRelayRecord`独立owner处理 | 普通material delivery target |
| `Other` | 不适用，当前fail-closed | 需先回到shared kind与guard扩展 | 任意source kind fallback |

因此 `HandoffTarget::try_from_validated_plan` 必须直接拒绝 `EventRelay | Other`，并按表拒绝kind / selection不匹配。`CapturedMaterials | CapturedAndObservability`中的key set必须非空。`EventRelay`仍是shared closed enum variant，用于暴露历史歧义和独立relay selector，但不能进入`HandoffTargetSet`。一个target set至少一个item，集合内全部target都是本batch required target；同一`(source_kind, resource_ref)`只能出现一次，不能以不同version/digest重复加入再由caller选择latest。

### 20.2 Progress status、delivery observation 与 set

`HandoffDeliveryAttemptRef`与`HandoffReceiptRef`是`crates/contracts/src/refs.rs`唯一声明。前者只校验non-empty Sandbox-local identity；后者保存并校验closed target kind、exact target ref和matching receipt ref，使domain observation与contracts view无需解析opaque ref或依赖domain target类型。

```rust
/// 标识一个target delivery attempt的Sandbox-local opaque identity。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct HandoffDeliveryAttemptRef(ResourceRef);

impl HandoffDeliveryAttemptRef {
    /// 从service id generator生成的非空opaque ref构造attempt identity。
    pub fn try_from_generated(
        attempt_ref: ResourceRef,
    ) -> Result<Self, ContractError>;

    /// 返回opaque resource ref；不得解析其字符串结构。
    pub fn as_resource_ref(&self) -> &ResourceRef;
}

/// 包装downstream返回的body-free handoff receipt relation，防止跨target或与target ref角色互换。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffReceiptRef {
    /// receipt服务的closed downstream target kind。
    target_kind: HandoffTargetKind,
    /// receipt唯一确认的exact downstream target ref。
    target_ref: ExternalSourceRef,
    /// adapter映射的matching-kind body-free receipt identity。
    receipt_ref: ExternalSourceRef,
}

impl HandoffReceiptRef {
    /// 从matching target字段与adapter映射的external receipt ref构造typed receipt relation。
    pub fn try_from_adapter(
        target_kind: HandoffTargetKind,
        target_ref: ExternalSourceRef,
        receipt_ref: ExternalSourceRef,
    ) -> Result<Self, ContractError>;

    /// 返回receipt服务的closed target kind。
    pub fn target_kind(&self) -> HandoffTargetKind;
    /// 返回receipt唯一确认的exact target ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;

    /// 返回downstream body-free external receipt ref。
    pub fn as_external_source_ref(&self) -> &ExternalSourceRef;
}

/// handoff adapter或trusted feedback consumer映射出的finite target outcome。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffTargetDeliveryOutcome {
    /// downstream返回matching body-free receipt ref。
    Delivered {
        /// downstream stable receipt ref；kind必须与target一致。
        receipt_ref: HandoffReceiptRef,
    },
    /// 本attempt失败但允许在明确not-before age后重试。
    Retryable {
        /// caller-safe typed outcome reason。
        reason: SandboxReason,
        /// 从attempt started time计算的非零最小等待毫秒数。
        retry_not_before_age_millis: NonZeroU64,
    },
    /// 本attempt明确terminal failed，不允许job自动重试。
    Failed {
        /// caller-safe typed outcome reason。
        reason: SandboxReason,
    },
}

/// 一个exact target attempt对应的body-free delivery observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetDeliveryObservation {
    /// observation唯一适用的handoff batch ref。
    handoff_ref: HandoffFactRef,
    /// observation唯一适用的target ref。
    target_ref: ExternalSourceRef,
    /// observation唯一适用的in-flight attempt ref。
    attempt_ref: HandoffDeliveryAttemptRef,
    /// adapter或trusted feedback显式映射的finite outcome。
    outcome: HandoffTargetDeliveryOutcome,
    /// adapter / feedback观察outcome的canonical time。
    observed_at: Timestamp,
}

impl HandoffTargetDeliveryObservation {
    /// 从typed adapter outcome或trusted feedback构造body-free observation。
    pub fn try_from_adapter(
        handoff_ref: HandoffFactRef,
        target: &HandoffTarget,
        attempt_ref: HandoffDeliveryAttemptRef,
        outcome: HandoffTargetDeliveryOutcome,
        observed_at: Timestamp,
    ) -> Result<Self, HandoffTargetProgressError>;

    /// 返回owning handoff batch ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回target external ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回exact attempt ref。
    pub fn attempt_ref(&self) -> &HandoffDeliveryAttemptRef;
    /// 返回finite delivery outcome。
    pub fn outcome(&self) -> &HandoffTargetDeliveryOutcome;
    /// 返回adapter / feedback observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

`receipt_ref`只能证明该target确认接收了本batch body-free refs / summaries。其source kind必须等于target source kind，且resource identity不得等于target ref本身；receipt不得是ArtifactRef、runtime execution result、runner completion、observability store record或acceptance evidence的Sandbox-side替身。Step 7 port必须先将raw HTTP / bus / SDK response映射为上述finite outcome，domain和application不得解析错误字符串或状态码猜retryability。

```rust
/// 一个target在同一handoff batch内的持久化delivery progress。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetProgress {
    /// owning handoff batch ref。
    handoff_ref: HandoffFactRef,
    /// plan中的closed target kind。
    target_kind: HandoffTargetKind,
    /// plan中的stable downstream target ref。
    target_ref: ExternalSourceRef,
    /// per-target canonical progress status。
    progress_status: HandoffTargetProgressStatus,
    /// 当前唯一in-flight或最近完成的attempt ref；`Pending`时为空。
    attempt_ref: Option<HandoffDeliveryAttemptRef>,
    /// 最近delivered attempt的downstream body-free receipt ref。
    receipt_ref: Option<HandoffReceiptRef>,
    /// retryable / failed target的caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// retryable target从attempt start起算的最小等待毫秒数。
    retry_not_before_age_millis: Option<NonZeroU64>,
    /// 已持久化的delivery attempt次数。
    attempt_count: u32,
    /// 当前attempt开始时间；`Pending`时为空。
    attempt_started_at: Option<Timestamp>,
    /// 当前progress status生效时间。
    status_changed_at: Timestamp,
    /// 最近一次progress transition audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl HandoffTargetProgress {
    /// 从handoff plan item创建尚未发起attempt的`Pending` progress。
    pub fn pending_for_target(
        handoff_ref: HandoffFactRef,
        target: &HandoffTarget,
        audit_trace_ref: SandboxAuditTraceRef,
        created_at: Timestamp,
    ) -> Result<Self, HandoffTargetProgressError>;

    /// 从`Pending | Retryable`开始新的持久化attempt并进入`Attempting`。
    pub fn begin_attempt(
        &mut self,
        attempt_ref: HandoffDeliveryAttemptRef,
        retry_checked_age_millis: Option<u64>,
        audit_trace_ref: SandboxAuditTraceRef,
        started_at: Timestamp,
    ) -> Result<(), HandoffTargetProgressError>;

    /// 消费matching typed observation进入`Delivered | Retryable | Failed`。
    pub fn apply_observation(
        &mut self,
        observation: HandoffTargetDeliveryObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), HandoffTargetProgressError>;

    /// 返回owning handoff batch ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回closed target kind。
    pub fn target_kind(&self) -> HandoffTargetKind;
    /// 返回stable downstream target ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回canonical progress status。
    pub fn progress_status(&self) -> HandoffTargetProgressStatus;
    /// 返回current / latest attempt ref。
    pub fn attempt_ref(&self) -> Option<&HandoffDeliveryAttemptRef>;
    /// 返回delivered receipt ref。
    pub fn receipt_ref(&self) -> Option<&HandoffReceiptRef>;
    /// 返回retryable / failed safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回retryable not-before age。
    pub fn retry_not_before_age_millis(&self) -> Option<NonZeroU64>;
    /// 返回已持久化attempt count。
    pub fn attempt_count(&self) -> u32;
    /// 返回current attempt start time。
    pub fn attempt_started_at(&self) -> Option<&Timestamp>;
    /// 返回current status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 判断该target是否处于terminal progress。
    pub fn is_terminal(&self) -> bool;
    /// 判断该target是否可在checked age后重试。
    pub fn can_retry_at_age(&self, checked_age_millis: u64) -> bool;
}

/// 保存与target plan一一对应、target identity唯一且保持plan顺序的progress set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetProgressSet(Vec<HandoffTargetProgress>);

impl HandoffTargetProgressSet {
    /// 从完整target plan创建相同keys的全`Pending` progress set。
    pub fn pending_for_plan(
        handoff_ref: &HandoffFactRef,
        targets: &HandoffTargetSet,
        audit_trace_ref: SandboxAuditTraceRef,
        created_at: Timestamp,
    ) -> Result<Self, HandoffTargetProgressError>;

    /// 构造并校验与target plan exact 1:1 coverage且顺序一致的progress set。
    pub fn try_for_plan(
        handoff_ref: &HandoffFactRef,
        targets: &HandoffTargetSet,
        progress: Vec<HandoffTargetProgress>,
    ) -> Result<Self, HandoffTargetProgressError>;

    /// 返回保持target plan顺序的只读切片。
    pub fn as_slice(&self) -> &[HandoffTargetProgress];
    /// 返回exact target对应的progress。
    pub fn get(&self, target_ref: &ExternalSourceRef) -> Option<&HandoffTargetProgress>;
    /// 返回exact target对应的可变progress；只供`HandoffFact` transition使用。
    fn get_mut(
        &mut self,
        target_ref: &ExternalSourceRef,
    ) -> Option<&mut HandoffTargetProgress>;
    /// 判断完整required target plan是否全部`Delivered`。
    pub fn all_delivered(&self) -> bool;
    /// 判断任一target是否处于terminal `Failed`。
    pub fn any_failed(&self) -> bool;
    /// 判断任一target是否处于`Retryable`。
    pub fn any_retryable(&self) -> bool;
    /// 判断任一target是否仍`Pending | Attempting`。
    pub fn any_incomplete(&self) -> bool;
}
```

per-target graph固定为：

```text
factory -> Pending
Pending -> Attempting
Attempting -> Delivered | Retryable | Failed
Retryable -> Attempting
Delivered | Failed -> terminal
```

`begin_attempt`必须在同一UoW先持久化new attempt ref和`Attempting`，再调用adapter；side effect后进程中断时，恢复flow按`(handoff_ref, target_ref, attempt_ref)`inspect，不得盲目生成新attempt。`retry_checked_age_millis`在`Pending`必须为`None`，在`Retryable`必须为`Some`且严格达到not-before age；equality允许重试。attempt count使用checked increment，溢出返回typed error，不能wrap。

### 20.3 Target / progress exact errors

```rust
/// handoff target plan的kind、source或uniqueness不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffTargetError {
    /// target kind与external source kind不匹配。
    TargetSourceKindMismatch {
        /// plan声明的closed target kind。
        target_kind: HandoffTargetKind,
        /// resolver提供的actual external source kind。
        source_kind: ExternalSourceKind,
    },
    /// event relay被错误送入普通material handoff plan。
    EventRelayRequiresIndependentOwner,
    /// `Other`在未扩展closed ownership matrix前被请求使用。
    OtherTargetKindWasNotResolved,
    /// target kind与captured / observability material selection不匹配。
    HandoffTargetMaterialSelectionMismatch {
        /// plan声明的closed target kind。
        target_kind: HandoffTargetKind,
    },
    /// captured material selection没有任何material key。
    EmptyCapturedMaterialSelection,
    /// target plan为空。
    EmptyHandoffTargetSet,
    /// target plan出现重复external target identity。
    DuplicateHandoffTarget {
        /// 重复target的closed kind。
        target_kind: HandoffTargetKind,
    },
}

/// per-target attempt、observation、status或set coverage不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffTargetProgressError {
    /// progress set与target plan keys / kind不一一对应。
    HandoffProgressPlanCoverageMismatch,
    /// progress set出现重复target identity。
    DuplicateHandoffTargetProgress,
    /// observation的handoff、target或attempt与current progress不一致。
    HandoffDeliveryObservationMismatch,
    /// observation outcome与reason、receipt或retry age关系不一致。
    HandoffDeliveryOutcomeRelationInvalid,
    /// retry尚未到not-before age或缺少checked age。
    HandoffRetryNotReady,
    /// attempt count已达到`u32::MAX`，不能安全递增。
    HandoffAttemptCountOverflow,
    /// progress status与attempt、receipt、reason、retry age和timestamps关系不一致。
    HandoffTargetProgressStatusRelationInvalid {
        /// relation无法成立的canonical progress status。
        status: HandoffTargetProgressStatus,
    },
    /// per-target transition不在closed graph中。
    HandoffTargetProgressTransitionNotAllowed {
        /// transition前实际status。
        from: HandoffTargetProgressStatus,
        /// caller请求的目标status。
        to: HandoffTargetProgressStatus,
    },
    /// observation / transition time早于attempt或既有status time。
    HandoffTargetProgressTimestampInvalid,
}
```

状态字段矩阵：

| progress | attempt ref/count/start | receipt | reason | retry age |
|---|---|---|---|---|
| `Pending` | `None / 0 / None` | `None` | `None` | `None` |
| `Attempting` | `Some / >0 / Some` | `None` | `None` | `None` |
| `Delivered` | `Some / >0 / Some` | `Some` | `None` | `None` |
| `Retryable` | `Some / >0 / Some` | `None` | `Some` | `Some` |
| `Failed` | `Some / >0 / Some` | `None` | `Some` | `None` |

---

## 21. Handoff ownership decision 与 guard contract

### 21.1 Decision kind 与 immutable output

```rust
/// handoff ownership guard的finite decision kind；不是持久化状态机。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum HandoffOwnershipDecisionKind {
    /// target plan完整覆盖source materials且保持下游truth ownership。
    Allowed,
    /// target kind、selection或source basis违反strict ownership matrix。
    Rejected,
}

/// 穷尽strict ownership guard可记录的rejection类别。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum HandoffOwnershipRejectionKind {
    /// target selection引用了非source material key或错误observability ref。
    SourceMaterialMismatch,
    /// target kind与source-specific material selection matrix不兼容。
    TargetSelectionRejected,
    /// target plan未完整覆盖required source materials。
    IncompleteCoverage,
    /// terminal source被交给不允许的downstream target。
    TerminalTargetRejected,
}

/// rejected ownership decision的finite offending subject，不携带正文或下游truth identity。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffOwnershipRejectionSubject {
    /// 被拒绝的target kind。
    TargetKind(HandoffTargetKind),
    /// target selection引用的未知material key。
    UnknownMaterialKey(CapturedMaterialKey),
    /// target plan未覆盖的source material key。
    UncoveredMaterialKey(CapturedMaterialKey),
    /// exact observability material未被合法target覆盖。
    ObservabilityMaterial(ObservabilityMaterialRef),
    /// batch-level matrix拒绝，没有更小subject。
    Batch,
}

/// strict ownership guard对一个exact handoff source / plan形成的immutable decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffOwnershipDecision {
    /// 形成decision的immutable guard ref。
    guard_ref: HandoffOwnershipGuardRef,
    /// decision唯一适用的预生成handoff fact ref。
    handoff_ref: HandoffFactRef,
    /// source observability material ref。
    observability_material_ref: ObservabilityMaterialRef,
    /// capture-source batch的immutable capture ref；terminal-source为`None`。
    capture_ref: Option<CaptureFactRef>,
    /// source run ref。
    run_ref: ControlledExecutionRunRef,
    /// source与target plan共用的canonical generation。
    generation_ref: ResourceRef,
    /// target plan完整identity与selection摘要。
    target_plan: HandoffTargetSet,
    /// guard机械计算的canonical decision kind。
    decision_kind: HandoffOwnershipDecisionKind,
    /// rejected decision必有的finite rejection kind。
    rejection_kind: Option<HandoffOwnershipRejectionKind>,
    /// rejected decision必有的finite offending subject。
    rejection_subject: Option<HandoffOwnershipRejectionSubject>,
    /// rejected decision必有的caller-safe guard reason。
    decision_reason: Option<SandboxReason>,
    /// pure guard evaluation time。
    evaluated_at: Timestamp,
}

impl HandoffOwnershipDecision {
    /// 仅供`HandoffOwnershipGuard::evaluate`构造checked decision。
    fn from_guard(
        guard_ref: HandoffOwnershipGuardRef,
        handoff_ref: HandoffFactRef,
        observability_material_ref: ObservabilityMaterialRef,
        capture_ref: Option<CaptureFactRef>,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        target_plan: HandoffTargetSet,
        decision_kind: HandoffOwnershipDecisionKind,
        rejection_kind: Option<HandoffOwnershipRejectionKind>,
        rejection_subject: Option<HandoffOwnershipRejectionSubject>,
        decision_reason: Option<SandboxReason>,
        evaluated_at: Timestamp,
    ) -> Result<Self, HandoffOwnershipGuardError>;

    /// 返回owning guard ref。
    pub fn guard_ref(&self) -> &HandoffOwnershipGuardRef;
    /// 返回decision唯一适用的handoff ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回source observability material ref。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回capture-source ref。
    pub fn capture_ref(&self) -> Option<&CaptureFactRef>;
    /// 返回source run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回checked complete target plan。
    pub fn target_plan(&self) -> &HandoffTargetSet;
    /// 返回canonical ownership decision kind。
    pub fn decision_kind(&self) -> HandoffOwnershipDecisionKind;
    /// 返回rejected decision的finite rejection kind。
    pub fn rejection_kind(&self) -> Option<HandoffOwnershipRejectionKind>;
    /// 返回rejected decision的finite offending subject。
    pub fn rejection_subject(&self) -> Option<&HandoffOwnershipRejectionSubject>;
    /// 返回rejected guard reason。
    pub fn decision_reason(&self) -> Option<&SandboxReason>;
    /// 返回pure evaluation time。
    pub fn evaluated_at(&self) -> &Timestamp;

    /// 只在canonical kind为`Allowed`时返回true。
    pub fn allows_handoff(&self) -> bool;
}
```

decision matrix只有两行：`Allowed -> rejection kind / subject / reason均None`；`Rejected -> rejection kind / subject / reason均Some`。decision不保存material locator、receipt、attempt、progress、aggregate status、artifact/evidence ref或下游正文；它也不能被query重新计算后替代原opening decision。

### 21.2 Strict guard fields、bind 与 evaluate

```rust
/// strict handoff ownership guard使用的固定caller-safe rejection reason目录。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffOwnershipReasonCatalog {
    /// target selection引用非source material时使用的安全原因。
    source_material_mismatch_reason: SandboxReason,
    /// target kind与material selection不匹配时使用的安全原因。
    target_selection_reason: SandboxReason,
    /// source material未被target plan完整覆盖时使用的安全原因。
    incomplete_coverage_reason: SandboxReason,
    /// terminal source被交给不允许target时使用的安全原因。
    terminal_target_reason: SandboxReason,
}

impl HandoffOwnershipReasonCatalog {
    /// 从validated profile的四个非空安全原因构造固定目录。
    pub fn try_from_validated_profile(
        source_material_mismatch_reason: SandboxReason,
        target_selection_reason: SandboxReason,
        incomplete_coverage_reason: SandboxReason,
        terminal_target_reason: SandboxReason,
    ) -> Result<Self, HandoffOwnershipGuardError>;

    /// 返回finite rejection kind对应的固定caller-safe reason。
    pub fn reason_for(
        &self,
        rejection_kind: HandoffOwnershipRejectionKind,
    ) -> &SandboxReason;
}

/// 绑定exact source material并执行strict ownership matrix的immutable guard。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffOwnershipGuard {
    /// guard的Sandbox-local typed identity。
    guard_ref: HandoffOwnershipGuardRef,
    /// guard唯一评估的预生成handoff fact ref。
    handoff_ref: HandoffFactRef,
    /// exact source observability material ref。
    observability_material_ref: ObservabilityMaterialRef,
    /// capture-source的immutable capture ref；terminal-source为`None`。
    capture_ref: Option<CaptureFactRef>,
    /// source run ref。
    run_ref: ControlledExecutionRunRef,
    /// source canonical generation。
    generation_ref: ResourceRef,
    /// capture-source可交接的完整captured material key set；terminal-source为空。
    available_material_keys: CapturedMaterialKeySet,
    /// guard固定使用的rejection reason目录。
    reason_catalog: HandoffOwnershipReasonCatalog,
    /// guard activation time。
    activated_at: Timestamp,
}

impl HandoffOwnershipGuard {
    /// 为completed-run capture及其exact observability material绑定strict guard。
    pub fn bind_capture_source(
        guard_ref: HandoffOwnershipGuardRef,
        handoff_ref: HandoffFactRef,
        capture: &CaptureFact,
        materials: &CapturedMaterialRefSet,
        observability_material: &ObservabilityMaterial,
        reason_catalog: HandoffOwnershipReasonCatalog,
        activated_at: Timestamp,
    ) -> Result<Self, HandoffOwnershipGuardError>;

    /// 为failed / terminated run的terminal observability material绑定strict guard。
    pub fn bind_terminal_source(
        guard_ref: HandoffOwnershipGuardRef,
        handoff_ref: HandoffFactRef,
        run: &ControlledExecutionRun,
        observability_material: &ObservabilityMaterial,
        reason_catalog: HandoffOwnershipReasonCatalog,
        activated_at: Timestamp,
    ) -> Result<Self, HandoffOwnershipGuardError>;

    /// 纯评估complete target plan并形成allowed或rejected decision。
    pub fn evaluate(
        &self,
        targets: HandoffTargetSet,
        evaluated_at: Timestamp,
    ) -> Result<HandoffOwnershipDecision, HandoffOwnershipGuardError>;

    /// 返回guard identity。
    pub fn guard_ref(&self) -> &HandoffOwnershipGuardRef;
    /// 返回guard预绑定handoff ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回source observability material ref。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回capture-source ref。
    pub fn capture_ref(&self) -> Option<&CaptureFactRef>;
    /// 返回source run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回source canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回capture-source完整available material keys。
    pub fn available_material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回guard activation time。
    pub fn activated_at(&self) -> &Timestamp;
}
```

guard bind必须拒绝source material已经绑定任意handoff ref。capture bind要求observability source basis精确引用capture，且capture / materials / observability的run/context/identity/boundary/handle/generation一致；material set keys必须与immutable capture keys相等且每项`can_open_handoff()`，available keys直接复制该exact set。terminal bind要求observability source basis为matching `TerminalRun`，run为`Failed | Terminated`，available keys为空。

### 21.3 Strict ownership matrix

guard按target逐项应用§20.1 kind / selection矩阵后，再执行以下batch规则：

| source | target plan allowed kinds | coverage requirement | rejection cut |
|---|---|---|---|
| capture with non-empty keys | `Artifact | Runtime | Runner | Observability` | 所有capture keys在全部target selections的union中恰好至少出现一次；observability ref至少由一个`Observability` target选择 | key未覆盖、selection含未知key、缺Observability target、Investigation无formal need |
| capture with empty keys | `Observability` | exact observability ref由至少一个Observability target选择 | Artifact/Runtime/Runner target、任何captured selection |
| terminal `Failure` | `Observability | Investigation` | exact observability ref至少由一项选择；Investigation可显式选择 | Artifact/Runtime/Runner、captured selection |
| terminal `Control` | `Observability | Investigation` | exact observability ref至少由一项选择；Investigation可显式选择 | Artifact/Runtime/Runner、captured selection |
| terminal `Redline` | `Observability | Investigation` | exact observability ref至少由两类target各选择一次 | 缺任一target、captured selection |

重复key跨多个合法target允许，因为同一candidate可以显式交接给Artifact与Runtime；但一个target selection内部key唯一，且任何selection都不能含available set之外的key。ownership guard只验证Sandbox允许交接哪些refs，不判定下游是否创建formal truth，也不保存下游returned object refs。

若plan同时违反多项规则，rejection kind按固定优先级选择：`TerminalTargetRejected > TargetSelectionRejected > SourceMaterialMismatch > IncompleteCoverage`。同一kind内按target plan顺序选择首个target subject；unknown / uncovered key按`CapturedMaterialKey` canonical顺序选择首个；缺少observability或required investigation时使用对应ref或`Batch`。reason只能由`reason_catalog.reason_for(rejection_kind)`取得；不得取迭代顺序中的最后一条reason，也不得拼接多条自由文本。carrier schema本身已经禁止formal downstream truth / evidence identity，任何尝试把这些字段塞入target或receipt必须在entry / adapter mapping阶段typed reject，不能降格为普通allowed handoff。

所有`Allowed` decision都保证：

1. target plan非空且每项kind / source / selection合法；
2. `EventRelay | Other`为零；
3. observability material exact ref已覆盖；
4. capture-source全部available keys已覆盖且没有未知key；
5. terminal-source没有captured key；
6. plan不包含artifact truth、runtime completion、runner completion、observability store、investigation case、evidence alias或acceptance identity；
7. target ack只能更新per-target progress，不能迁移ownership或反写source truth。

### 21.4 `HandoffOwnershipGuardError`

```rust
/// handoff source bind、strict ownership matrix或decision relation失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffOwnershipGuardError {
    /// handoff、guard、capture、observability或run identity发生底层碰撞。
    HandoffIdentityCollision,
    /// fixed reason catalog缺少任一非空caller-safe reason。
    HandoffOwnershipReasonCatalogInvalid,
    /// capture与observability source basis或lineage不一致。
    CaptureHandoffSourceLineageMismatch,
    /// terminal run与observability source basis或lineage不一致。
    TerminalHandoffSourceLineageMismatch,
    /// source captured或observability material已经绑定handoff batch。
    HandoffSourceAlreadyBound,
    /// decision kind与rejection kind / subject / reason不满足closed relation。
    HandoffOwnershipDecisionRelationInvalid {
        /// relation无法成立的decision kind。
        kind: HandoffOwnershipDecisionKind,
    },
    /// evaluation time早于guard activation或不满足canonical timestamp contract。
    HandoffOwnershipEvaluationTimestampInvalid,
}
```

`evaluate`对可预期ownership violation返回`Ok(Rejected decision)`，使拒绝可被同UoW audit / stored result记录；只有guard自身损坏、identity / lineage不一致、target carrier shape无效或timestamp不合法才返回`Err(HandoffOwnershipGuardError)`。application只有在`decision.allows_handoff()`后才能调用`HandoffFact::open`；rejected decision禁止创建progress、调用adapter或更新material lifecycle。

---

## 22. `HandoffFact` aggregate lifecycle contract

### 22.1 Cleanup block observation consumer reference

cleanup guard由`6R-04`拥有，handoff aggregate只能消费其exact checked output，不能从cleanup status enum、reason或query view自行推断。

`HandoffMaterialDeliveryKind`是Step 4既有`crates/contracts/src/refs.rs`唯一声明的finite derived kind，供domain lifecycle helper与contracts material-specific view共同复用；本校准分件只是按handoff业务主线展开schema。它没有独立持久化字段和transition，不能计入状态机清单。

```rust
/// 从选择一份source material的target progress机械推导的material-specific delivery kind。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum HandoffMaterialDeliveryKind {
    /// 至少一个selected target仍pending / attempting，且没有failed / retryable。
    Pending,
    /// 全部selected targets均已delivered。
    Delivered,
    /// 至少一个selected target terminal failed。
    Failed,
    /// 没有failed且至少一个selected target retryable。
    Retryable,
}
```

`HandoffCleanupBlockObservation` 的 canonical schema、getter和constructor owner唯一位于`03_ddd_step_06_object_contracts_failure_cleanup_read.md` §14.2.2。本节只把该类型作为`HandoffFact::mark_blocked_by_cleanup_guard`与material retention methods的consumer input，不重复声明字段或`impl`。它只能由`CleanupGuard::require_handoff_block(...)`返回，不进入public DTO，不是第二个cleanup truth，也不能用于修改target progress。block解除后handoff通过重新读取exact progress推导正常aggregate status，不重放任何delivered receipt。

### 22.2 Fields、open factory 与 aggregate derive

```rust
/// Sandbox记录的一次完整required target plan与逐target progress的handoff lifecycle truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffFact {
    /// handoff batch的Sandbox-local typed identity。
    handoff_ref: HandoffFactRef,
    /// 打开batch所消费的immutable ownership guard ref。
    ownership_guard_ref: HandoffOwnershipGuardRef,
    /// source observability material ref。
    observability_material_ref: ObservabilityMaterialRef,
    /// capture-source batch的immutable capture ref；terminal-source为`None`。
    capture_ref: Option<CaptureFactRef>,
    /// source run ref。
    run_ref: ControlledExecutionRunRef,
    /// source owning context ref。
    context_ref: ControlledExecutionContextRef,
    /// source owning environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// source established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// source isolation handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// source与target plan共用的canonical generation。
    generation_ref: ResourceRef,
    /// immutable complete required target plan。
    target_plan: HandoffTargetSet,
    /// 与target plan exact 1:1的per-target progress set。
    target_progress: HandoffTargetProgressSet,
    /// 仅由progress与cleanup block机械推导的aggregate status。
    handoff_status: HandoffFactStatus,
    /// aggregate `Failed | BlockedByCleanupGuard`时的canonical safe reason；其他状态为空。
    status_reason: Option<SandboxReason>,
    /// active cleanup block ref；非blocked aggregate为空。
    cleanup_guard_ref: Option<CleanupGuardRef>,
    /// handoff batch首次打开时间。
    opened_at: Timestamp,
    /// 当前aggregate status生效时间。
    status_changed_at: Timestamp,
    /// 最近一次aggregate / progress transition audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl HandoffFact {
    /// 从exact allowed ownership decision创建全`Pending` progress的handoff batch。
    pub fn open(
        guard: &HandoffOwnershipGuard,
        decision: HandoffOwnershipDecision,
        source_observability_material: &ObservabilityMaterial,
        source_materials: &CapturedMaterialRefSet,
        audit_trace_ref: SandboxAuditTraceRef,
        opened_at: Timestamp,
    ) -> Result<Self, HandoffFactError>;

    /// 为exact pending / retryable target开始新的持久化delivery attempt。
    pub fn begin_target_attempt(
        &mut self,
        target_ref: &ExternalSourceRef,
        attempt_ref: HandoffDeliveryAttemptRef,
        retry_checked_age_millis: Option<u64>,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), HandoffFactError>;

    /// 消费matching typed target observation并重新机械推导aggregate status。
    pub fn apply_target_observation(
        &mut self,
        observation: HandoffTargetDeliveryObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), HandoffFactError>;

    /// 消费matching cleanup guard block observation并优先显示blocked aggregate。
    pub fn mark_blocked_by_cleanup_guard(
        &mut self,
        observation: HandoffCleanupBlockObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), HandoffFactError>;

    /// 在exact cleanup guard不再阻断后清除override并从progress重新推导aggregate。
    pub fn clear_cleanup_guard_block(
        &mut self,
        cleanup_guard: &CleanupGuard,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), HandoffFactError>;

    /// 返回handoff batch identity。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回opening ownership guard ref。
    pub fn ownership_guard_ref(&self) -> &HandoffOwnershipGuardRef;
    /// 返回source observability material ref。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回capture-source ref。
    pub fn capture_ref(&self) -> Option<&CaptureFactRef>;
    /// 返回source run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回source context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回source environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回source boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回source isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回immutable complete target plan。
    pub fn target_plan(&self) -> &HandoffTargetSet;
    /// 返回per-target progress set。
    pub fn target_progress(&self) -> &HandoffTargetProgressSet;
    /// 返回derived aggregate status。
    pub fn handoff_status(&self) -> HandoffFactStatus;
    /// 返回aggregate failed或cleanup-blocked safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回active cleanup guard ref。
    pub fn cleanup_guard_ref(&self) -> Option<&CleanupGuardRef>;
    /// 返回batch open time。
    pub fn opened_at(&self) -> &Timestamp;
    /// 返回aggregate status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 判断aggregate是否已全部delivered。
    pub fn is_delivered(&self) -> bool;
    /// 判断aggregate是否仍可通过target retry推进。
    pub fn can_retry(&self) -> bool;
    /// 判断当前aggregate是否阻断cleanup / release。
    pub fn blocks_cleanup(&self) -> bool;

    /// 只从选择exact captured material key的target progress推导material-specific delivery。
    pub fn captured_material_delivery_kind(
        &self,
        material_key: &CapturedMaterialKey,
    ) -> Result<HandoffMaterialDeliveryKind, HandoffFactError>;

    /// 只从选择source observability material的target progress推导material-specific delivery。
    pub fn observability_material_delivery_kind(
        &self,
    ) -> Result<HandoffMaterialDeliveryKind, HandoffFactError>;

    /// 从progress与optional cleanup override机械推导aggregate status。
    fn derive_status(
        progress: &HandoffTargetProgressSet,
        cleanup_guard_ref: Option<&CleanupGuardRef>,
    ) -> HandoffFactStatus;
}
```

`open`要求decision为`Allowed`，且guard / decision / source observability / source materials在handoff ref、capture ref、run/context/identity/boundary/handle/generation、available keys和target plan上完全一致。terminal-source时`source_materials`必须为空；capture-source时keys必须等于guard available keys。factory创建exact全`Pending` progress，aggregate为`Pending`，不调用adapter；application随后必须在同一UoW更新所有selected source materials为handoff pending并保存fact / audit / relay/projection marker / stored result。

### 22.3 Aggregate precedence 与 status field relation

`derive_status`固定优先级，不得读取“最后一个receipt”或accumulator最终值：

```text
cleanup_guard_ref is Some                 -> BlockedByCleanupGuard
else any target Failed                    -> Failed
else any target Retryable                 -> Retryable
else all targets Delivered                -> Delivered
else                                      -> Pending
```

`Attempting`与`Pending`都归入aggregate `Pending`。混合`Delivered + Retryable`必须为`Retryable`；混合`Delivered + Failed`必须为`Failed`；混合`Retryable + Failed`必须为`Failed`；cleanup block优先覆盖上述显示但不改写progress。`clear_cleanup_guard_block`必须调用`CleanupGuard::require_handoff_unblocked(...)`，清除ref后按现有progress重算。

两个material-specific helper先按immutable target selections过滤progress，再使用相同的`Failed > Retryable > all Delivered > Pending`优先级，但不读取cleanup override。没有target选择目标material是relation error；因此一个与该material无关的target失败不会把该material误标为failed，cleanup block也不会抹掉已成立的material delivery结果。

| aggregate status | progress relation | cleanup ref | status reason | terminal / retry |
|---|---|---|---|---|
| `Pending` | 至少一项`Pending | Attempting`，且无`Failed | Retryable`；或其他未完成组合 | `None` | non-terminal / no aggregate retry claim |
| `Delivered` | 全部`Delivered` | `None` | `None` | terminal success |
| `Failed` | 至少一项`Failed` | `None` | 从target plan顺序首个failed progress复制safe reason | terminal for auto retry |
| `Retryable` | 无`Failed`且至少一项`Retryable` | `None` | `None`；原因留per-target | retry selected targets |
| `BlockedByCleanupGuard` | 任意progress组合 | `Some` | exact cleanup block safe reason | blocks cleanup；progress不变 |

`Failed`的aggregate safe reason只用于caller-safe summary，不作为target选择、retryability或failure kind来源；完整失败明细仍在per-target progress。`Delivered`只表示所有required target已确认接收本batch refs / summaries，不表示下游formal truth、业务处理、observability retention或runtime loop完成。

### 22.4 Source material lifecycle synchronization

`CapturedMaterialRef` 的batch 5 transition必须补为exact contract：

```rust
impl CapturedMaterialRef {
    /// 绑定覆盖本material key的唯一pending handoff batch。
    pub fn mark_handoff_pending(
        &mut self,
        handoff: &HandoffFact,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CapturedMaterialError>;

    /// 从同一batch对本material推导的`Failed` delivery记录handoff failure。
    pub fn mark_handoff_failed(
        &mut self,
        handoff: &HandoffFact,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CapturedMaterialError>;

    /// 从同一batch对本material推导的`Delivered` delivery记录selected targets已接收。
    pub fn mark_handoff_accepted(
        &mut self,
        handoff: &HandoffFact,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CapturedMaterialError>;

    /// 消费matching cleanup / investigation owner block进入`RetentionBlocked`。
    pub fn mark_retention_blocked(
        &mut self,
        handoff: &HandoffFact,
        observation: &HandoffCleanupBlockObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CapturedMaterialError>;
}
```

每个method必须确认handoff target selections的union包含本material key，handoff capture/run/generation与material相等，且已有`handoff_ref`只能等于该batch。状态图：

```text
Captured -> HandoffPending
HandoffPending -> HandoffFailed | HandoffAccepted | RetentionBlocked
HandoffFailed -> RetentionBlocked
RetentionBlocked -> HandoffPending | HandoffFailed | HandoffAccepted
HandoffAccepted -> RetentionBlocked
```

material同步必须调用`captured_material_delivery_kind(material_key)`：`Pending | Retryable`同步为`HandoffPending`或保留`RetentionBlocked`，`Failed`同步为`HandoffFailed`，`Delivered`同步为`HandoffAccepted`。batch aggregate的cleanup override不改变该结果。`HandoffAccepted`后出现后续retention / investigation block可以进入`RetentionBlocked`，但不得回退为pending或failed。`RetentionBlocked`解除时必须根据同一handoff当前material-specific delivery kind选择目标，不能由caller传kind。

`mark_retention_blocked`必须验证observation的handoff ref等于handoff、cleanup guard确实形成active block，不能接受caller传入的裸reason。所有handoff lifecycle错误已回填到§16.4唯一`CapturedMaterialError`定义；本节不建立第二份error owner。

Observability material同步沿§17.2 methods执行。opening UoW中，`HandoffFact::open`尚为`Pending`，所有被selection覆盖的captured materials进入`HandoffPending`，source observability material也进入`HandoffPending`。后续每次progress commit都在同一UoW保存fact、受aggregate变化影响的source material rows、audit、relay/projection marker和stored result / receipt；任一写失败整体回滚，不允许fact显示delivered而material仍pending。

### 22.5 `HandoffFactError`

```rust
/// handoff opening、source relation、target progress、aggregate derive或cleanup block不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffFactError {
    /// ownership decision kind不是`Allowed`。
    HandoffOwnershipWasNotAllowed {
        /// factory观察到的decision kind。
        actual: HandoffOwnershipDecisionKind,
    },
    /// guard、decision和factory handoff refs不一致。
    HandoffGuardDecisionRefMismatch,
    /// guard、decision、source materials或fact lineage不一致。
    HandoffSourceLineageMismatch,
    /// decision target plan与fact opening plan不一致。
    HandoffTargetPlanMismatch,
    /// source material已绑定另一个handoff batch。
    HandoffSourceAlreadyBound,
    /// target ref不在immutable target plan中。
    HandoffTargetWasNotPlanned,
    /// target plan没有任何selection覆盖请求的source material。
    HandoffMaterialWasNotSelected,
    /// per-target progress transition失败。
    HandoffTargetProgressInvalid {
        /// transition失败的target kind。
        target_kind: HandoffTargetKind,
    },
    /// progress set与target plan不再一一对应。
    HandoffProgressCoverageMismatch,
    /// cleanup block observation不属于本handoff batch。
    HandoffCleanupBlockRefMismatch,
    /// cleanup guard不能证明本handoff仍blocked或已unblocked。
    HandoffCleanupGuardRelationInvalid,
    /// aggregate status与progress / cleanup override不满足fixed precedence。
    HandoffAggregateStatusRelationInvalid {
        /// relation无法成立的aggregate status。
        status: HandoffFactStatus,
    },
    /// aggregate failed progress缺少可复制的caller-safe reason。
    HandoffAggregateFailureReasonMissing,
    /// handoff transition time早于open、attempt、observation或previous status time。
    HandoffTimestampInvalid,
}
```

`HandoffFactError`不得包装raw downstream response、HTTP status、topic payload、SDK error、artifact id、runtime result或observability store id。`HandoffTargetProgressError`是typed source error；application error mapper必须保留chain，并将public surface映射留给`6R-05` / Step 8。

### 22.6 `6R-04` cleanup forward methods

`6R-04`必须以以下签名闭合cleanup owner，禁止以`cleanup_blocked: bool`、status enum比较或query view替代：

```rust
impl CleanupGuard {
    /// 校验本guard明确阻断exact handoff并返回只读blocking observation。
    pub fn require_handoff_block(
        &self,
        handoff_ref: &HandoffFactRef,
        context_ref: &ControlledExecutionContextRef,
        run_ref: &ControlledExecutionRunRef,
    ) -> Result<HandoffCleanupBlockObservation, CleanupGuardError>;

    /// 校验本guard对exact handoff已不再阻断，供handoff清除aggregate override。
    pub fn require_handoff_unblocked(
        &self,
        handoff_ref: &HandoffFactRef,
        context_ref: &ControlledExecutionContextRef,
        run_ref: &ControlledExecutionRunRef,
    ) -> Result<(), CleanupGuardError>;
}
```

`require_handoff_block`只允许`PendingEvidence | PendingInvestigation | Blocked`返回observation，并必须保留guard ref、safe reason和guard time；`Allowed | Completed`返回typed not-blocking error。`require_handoff_unblocked`只允许`Allowed | Completed`，且必须确认guard评估输入中的handoff/context/run refs一致。两个method都不得推进cleanup状态、修改handoff progress或读取adapter。

### 22.7 Step 7 / 9 / 11 forward obligations

| forward owner | exact obligation | prohibited fallback |
|---|---|---|
| handoff identity generation | guard / fact refs在同一attempt预生成；每个source material永久只绑定一个handoff ref | 每target一个fact、retry生成新fact、ref字符串拼接 |
| opening UoW | allowed decision + fact + full pending progress + selected material lifecycle + audit + relay/projection marker + stored result原子保存 | 先存fact后补progress/material、rejected仍调用adapter |
| target attempt UoW | 先持久化`Attempting`与attempt ref，再调用adapter；outcome UoW保存progress + derived aggregate + material sync + audit/relay/result | adapter side effect前不留attempt、最后receipt覆盖aggregate |
| adapter / feedback | 只返回§20.2 finite outcome / observation；receipt kind与target相等 | raw response、错误文本解析retry、外部object id冒充receipt |
| recovery | exact `(handoff,target,attempt)` inspect；delivered复用receipt，absent才按同一attempt策略继续，unknown进入retryable/failed typed handling | timeout后直接新attempt、把unknown当absent |
| repository constraints | `handoff_ref`唯一；source observability ref跨handoff唯一；`(capture_ref, material_key)`最多一个handoff；`(handoff,target)`唯一progress；attempt ref全局唯一 | 只靠application查重、latest target plan、partial save |
| cleanup | cleanup guard消费complete target progress和source material lifecycle；`Delivered`才满足普通handoff交接，terminal path仍需investigation/redline规则 | 只看aggregate字符串、handoff pending时删除material |
| event relay | source fact commit后由`SandboxEventRelayRecord`独立创建与发布 | 把`EventRelay`塞入target plan、publisher ack改handoff progress |

handoff failure、retryable或cleanup block永远不回滚`CaptureFact`、`ControlledExecutionRun`或formal terminal owner。一个target delivered、另一个failed时，已delivered receipt保留，失败target不允许覆盖或删除成功progress；重试只选择`Retryable` target，不重发`Delivered` target。

---

## 22A. Retained batch 4 capture contract closure audit

本节保留已获用户确认的batch 4静态审计，只调整到当前正文顺序；不把batch 5新增结论倒写成batch 4事实。

### 22A.1 Canonical object / support closure

| inventory | canonical owner | identity / persistence | factory / callable closure | status / error closure | batch result |
|---:|---|---|---|---|---|
| #13 `ExecutionOutputSummary` | §15.1 | embedded；不独立持久化 | adapter factory、getters、candidate coverage check | `CaptureSupportError` | closed |
| #14 `CaptureMaterialRequirementSet` | §15.2 | embedded immutable profile mapping | requirement/set/catalog factories与getters | mandatory ExitStatus + `CaptureSupportError` | closed |
| #15 `CapturedMaterialRef` / set | §16.2 | `(capture_ref, material_key)` composite row；非named ref | borrowed candidate factory、set constructor、read surface；handoff transitions明确后移 | `CapturedMaterialStatus` initial relation + `CapturedMaterialError` | closed_for_batch_4 |
| #17 `CaptureCompletenessDecision` | §18.1 | embedded immutable guard output | guard-only factory、getters、three predicates | four-status closed matrix + `CaptureCompletenessGuardError` | closed |
| #18 `CaptureCompletenessGuard` | §18.2 | named immutable guard | exact run bind、pure evaluate、getters | candidate/disposition/gap/reason exact errors | closed |
| #19 `CaptureFact` | §19 | named immutable truth | identity bundle、single `record` factory、getters/predicates | four terminal statuses + `CaptureFactError`；no transition | closed |

#16 `ObservabilityMaterial`不计入batch 4 closure：本批只固定mandatory pre-generated ref和与capture同UoW形成的义务，正文、status、factory和handoff methods仍由batch 5 §17唯一拥有。#20~#24同样保持pending。当前没有把未定义对象伪记为closed。

### 22A.2 Factory required-field coverage

| factory / constructor | required input来源 | 可填满字段 | 不允许caller补造 | result |
|---|---|---|---|---|
| `CapturedMaterialCandidate::try_from_adapter` | typed capture adapter mapping | key、capture/run/generation、kind、locator、digest、summary、size、observed time | path、body、artifact/evidence ref | closed |
| `CaptureCollectionCandidate::*` | one typed disposition + application clock | disposition对应summary/candidates/markers/reason全集 | generic error、mixed branch fields | closed |
| `CapturedMaterialRef::from_candidate` | borrowed exact candidate + audit/time | all initial `Captured` fields | handoff ref/status、caller material rewrite | closed |
| `CaptureCompletenessGuard::bind` | exact completed run + validated requirements/catalog | guard lineage、requirements、activation | bool completed、latest ref | closed |
| `CaptureCompletenessGuard::evaluate` | matching candidate + evaluation time | disposition、keys、gaps、markers、status/reasons | caller status/gaps、reason parsing | closed |
| `CaptureRecordingIdentityBundle::try_for_run` | completed run pre-bound capture + generated observability ref | pair identity | ref concatenation、adapter id | closed |
| `CaptureFact::record` | borrowed bundle + exact run/guard/candidate/decision/materials + audit/time | all 20 immutable fields | optional observability ref、handoff/failure/cleanup truth | closed |

`CaptureFact::record`借用identity bundle，batch 5 `ObservabilityMaterial` factory才能消费同一pair做双向relation检查；若按值先消费bundle，application将被迫复制refs或重造一个bundle，破坏same-attempt proof。material factory同样借用candidate，使guard evaluation、materialization和fact assembly可以对同一candidate实例做一致性重验。

### 22A.3 Status and negative-path closure

| input path | capture status | material rows | observability ref | failure forward | forbidden behavior |
|---|---|---|---|---|---|
| collected / all requirements met | `Complete` | exact all candidates | mandatory | no | 不能省略ExitStatus或用observability替代 |
| collected / only partial gaps | `Partial` | exact all candidates | mandatory | no | 不能默认success、不能丢gap |
| collected / any failed gap | `Failed` | exact all safe candidates | mandatory | yes | 不能因已有部分材料降格为Partial |
| adapter failed | `Failed` | none | mandatory | yes | 不能构造全required gap或保存raw error |
| source unavailable | `Unavailable` | none | mandatory | yes | 不能转Partial或复用旧capture |
| forbidden body rejected | `Failed` | none | mandatory | yes | non-empty marker时整批locator不得持久化 |

`requires_failure_classification()`对`Failed | Unavailable`为true，对`Complete | Partial`为false。`Partial`仍必须在read/handoff/cleanup surface显式可见，但不自动伪造`SandboxFailureKind::CaptureFailure`；后序若业务要求partial也分类，必须回到本节增加typed rule，不能由Step 9 reason文本推断。

`CaptureFact`只从backend-confirmed `ControlledExecutionRunStatus::Completed`建立，因为它记录的是该run可进入统一output collection后的capture结果；这里的`Failed | Unavailable`是capture attempt的结果，不是source run状态。run在launch/lifecycle阶段已进入`Failed | Terminated`时，`FR-SBX-017`与`BR-SBX-024`要求的non-happy-path material由matching `FailureClassification` / `ControlFact` / `RedlineContainment`和独立`ObservabilityMaterial`承接，不得为满足cleanup或审计而伪造正常output `CaptureFact`。`6R-04` cleanup guard必须区分“completed run已有capture”与“failed/terminated run有formal terminal owner + observability/investigation material”两种证据路径，不能把缺少不适用的capture ref直接判为可清理。

### 22A.4 Data boundary and ownership audit

| audit dimension | allowed current truth | prohibited leakage | result |
|---|---|---|---|
| execution identity | run/context/environment identity/boundary/handle/generation exact refs | runtime loop、tool invocation、member/runner lifecycle | pass |
| material body | opaque isolation source ref、digest、safe summary、size、kind | stdout/stderr/file bytes、path、URL、provider/SDK body、secret | pass |
| artifact / evidence | no formal artifact/evidence identity in capture objects | artifact truth、baseline、evidence alias/acceptance | pass |
| observability | mandatory `ObservabilityMaterialRef` relation only | store truth、telemetry body、ack、retention/alert state | pass / batch 5 body pending |
| handoff | optional future material `handoff_ref` remains empty at factory | target progress、receipt、aggregate handoff status in capture fact | pass / batch 5 pending |
| state truth | `CaptureFactStatus` immutable；`CapturedMaterialStatus` independent lifecycle | visible second status、handoff ack rewriting capture | pass |
| errors | typed finite relation errors + safe refs/kinds | raw adapter response/error text、body-bearing payload | pass |

### 22A.5 Downstream invalidation and exact handoff

| historical downstream consumer | invalid current assumption | required regression consumer action |
|---|---|---|
| original Step 7 `ExecutionCapturePort` | adapter returns `CaptureFact`/material/observability refs directly | Step 7 must return typed `CaptureCollectionCandidate`; application owns guard/material/fact/observability assembly |
| original Step 7 repository | aggregate `save_capture_handoff_group` lacks capture-only atomic boundary and uniqueness | define capture group UoW with fact/material/observability/audit/relay/stored result exact save order |
| original Step 8 `RecordCaptureResult` | old DTO may carry status/material refs selected by caller | map only trusted capture trigger/ref and adapter-owned body-free input; caller cannot submit canonical status/gaps |
| original Step 9 capture flow | compressed adapter -> fact save | expand exact load/collect/bind/evaluate/materialize/assemble/UoW/recovery sequence |
| original Step 10 capture state | includes non-existent `Pending` and mutable transitions | replace with immutable factory matrix; in-flight is not `CaptureFact` state |
| original Step 11 persistence | one aggregate material ref and mutable capture row | unique run/capture/observability pair + composite material rows + immutable fact semantics |
| original Step 12 errors | generic `DomainError` / adapter failure | map all support/material/guard/fact errors and typed collection dispositions separately |
| original Step 15 audit | observability refs plural / optional wording | one mandatory observability material ref per capture; same UoW audit, no fabricated evidence |

这些是downstream revalidation obligations，不是当前允许修改Step 7~15的授权。正式`03~07`仍因DesignReopen失效，必须等Step 6整体确认后串行回归。

### 22A.6 Mechanical audit result

| check | expected | observed design result |
|---|---:|---:|
| batch 4 canonical inventory items | 6 (#13~#15, #17~#19) | 6 closed |
| capture statuses covered by factory matrix | 4 | 4 |
| collection dispositions covered | 4 | 4 |
| required gap dispositions covered | 2 | 2 |
| mandatory ExitStatus rule | 1 | 1, exact `1 + RecordFailed` |
| public batch 4 error owners | 4 | `CaptureSupportError`;`CapturedMaterialError`;`CaptureCompletenessGuardError`;`CaptureFactError` |
| unnamed persisted truth added | 0 | 0 |
| raw material/body fields added | 0 | 0 |
| unresolved batch 4 object schema | 0 | 0 |

本表是静态设计审计，不是编译、单元测试、集成测试或runtime验收结果。未创建实现仓、run_id、commit、evidence alias或签署。

---

## 22B. Batch 5 observability / handoff closure audit

### 22B.1 Canonical inventory closure

| inventory | canonical owner | identity / persistence | factory / transition closure | status / error closure | result |
|---:|---|---|---|---|---|
| #16 `ObservabilityMaterial` | §17 | named lifecycle truth | capture / terminal factory；material-specific handoff transitions | 4 canonical statuses；`ObservabilityMaterialError` | closed_batch_5 |
| #20 `HandoffTarget` / set | §20.1 | embedded complete plan；typed external target | validated plan factory；kind / selection / relay redline | `HandoffTargetError` | closed_batch_5 |
| #21 `HandoffTargetProgress` / set | §20.2 | `(handoff_ref,target_ref)` persisted row | pending factory；attempt / observation lifecycle | 5-status unique owner；`HandoffTargetProgressError` | closed_batch_5 |
| #22 ownership decision / guard | §21 | embedded immutable decision + named guard | capture / terminal bind；pure evaluate | finite decision / rejection kinds；`HandoffOwnershipGuardError` | closed_batch_5 |
| #23 `HandoffFact` | §22 | named aggregate truth | open；target attempt / observation；cleanup override | 5 canonical aggregate statuses；`HandoffFactError` | closed_batch_5 |

#24 read views仍只由batch 6 §23~§24拥有，本批不计入closure。`HandoffReceiptRef`、delivery attempt、material selection、signal summary、decision和cleanup observation是support values，不新增匿名独立truth owner。

### 22B.2 Source / factory required-field coverage

| factory / constructor | required input source | closed result | prohibited substitute |
|---|---|---|---|
| `ObservabilityMaterial::prepare_from_capture` | same-attempt identity bundle + exact completed run + immutable capture + typed signal summary | prepared material；capture status / markers / lineage exact | optional observability ref、log presence、latest capture |
| `ObservabilityMaterial::prepare_from_terminal_run` | failed / terminated run + exact formal terminal basis + typed signal summary | prepared terminal material；no capture fact | fabricated capture、adapter error、operator bool |
| `HandoffTarget::try_from_validated_plan` | target kind + matching external ref + exact material selection | one required target item | route / ref string inference、EventRelay、Other fallback |
| `HandoffTargetProgress::pending_for_target` | handoff ref + exact plan item + audit/time | pending progress row | target outside plan、optional row omission |
| `HandoffOwnershipGuard::bind_*` | exact source materials / lineage + pre-generated guard / fact refs | immutable strict guard | caller key list、latest material、already-bound source |
| `HandoffOwnershipGuard::evaluate` | immutable complete target plan | allowed/rejected decision with deterministic rejection kind / subject / reason | first/last error accident、free-form reason |
| `HandoffFact::open` | exact guard + allowed decision + exact source material rows | full pending progress + pending aggregate | rejected adapter call、partial progress save |

### 22B.3 Status and aggregation closure

| subject | canonical graph / derivation | terminal / retry rule | cross-owner prohibition |
|---|---|---|---|
| observability material | `Prepared -> HandoffPending -> HandoffRecorded | HandoffFailed` | failed terminal for automatic retry；new attempt requires explicit future recovery design | ack不反写capture/run/store truth |
| target progress | `Pending -> Attempting -> Delivered | Retryable | Failed`;`Retryable -> Attempting` | only Retryable reenters attempt；Delivered/Failed terminal | receipt不迁移ownership |
| handoff aggregate | cleanup block > any Failed > any Retryable > all Delivered > Pending | progress unchanged under cleanup override | last receipt不得覆盖aggregate |
| captured material | one handoff ref；material-specific selected progress决定pending/failed/accepted；retention独立override | failed不自动重开；retention解除按same batch material result | unrelated target failure不得误伤material |

aggregate five statuses、progress five statuses、observability four statuses和captured material five statuses都有exact field relation。batch 5新增唯一正式状态owner `HandoffTargetProgressStatus`，shared registry由38增至39；ownership decision与material-specific delivery是finite kind，不计入状态机。

### 22B.4 Ownership / security boundary audit

| audit cut | allowed | prohibited | result |
|---|---|---|---|
| source basis | exact capture；或failed/terminated run + failure/control/redline basis | terminal run伪造`CaptureFact` | pass |
| target plan | Artifact/Runtime/Runner/Observability/Investigation按closed matrix | EventRelay混入material、Other fallback | pass |
| receipt | role-specific `HandoffReceiptRef` + matching source kind | target ref复用、formal downstream object/evidence identity | pass |
| material body | typed refs、safe summaries、finite markers/kinds、digest/time/audit | path、URL、stdout/stderr body、SDK response、secret、telemetry body | pass |
| truth ownership | Sandbox capture/material/handoff lifecycle | Artifact、runtime、runner、observability、investigation formal truth | pass |
| event relay | independent `SandboxEventRelayRecord` owner | publisher ack写target progress | pass |
| cleanup | exact `CleanupGuard` forward observation | status bool、query view、reason文本推断 | pass |

### 22B.5 UoW / retry / recovery audit

1. capture path原子保存capture fact、captured rows、observability material、audit、relay/projection marker和stored result。
2. terminal path原子保存run terminal relation、formal owner、observability material和同批副作用；不补造capture。
3. opening handoff原子保存fact、complete pending progress、selected source lifecycle和同批副作用。
4. target side effect前先持久化`Attempting + attempt_ref`；side effect后按exact triple inspect，unknown不能当absent。
5. target outcome提交progress、aggregate、material-specific lifecycle与同批副作用；一个target失败不删除其他target receipt。
6. retry只选择`Retryable` target并继续同一handoff；`Failed`不自动回迁，需未来formal recovery design。

### 22B.6 Downstream invalidation ledger

| historical consumer | invalid assumption | required revalidation |
|---|---|---|
| Step 7 handoff port / adapter | one aggregate adapter result；generic receipt；no persisted attempt | exact target input、typed outcome / observation、attempt inspect、receipt wrapper、fake/durable parity |
| Step 8 `OpenMaterialHandoff` / feedback | caller supplies aggregate status / arbitrary refs；observability optional | caller supplies only trusted source selector / plan input；status and progress domain-owned；terminal-source schema distinct |
| Step 9 handoff flows | one adapter call -> one status；last receipt wins | open UoW、per-target side effect/recovery、aggregate derivation、material-specific sync独立flow |
| Step 10 state matrix | 30 status enum；无per-target progress owner | 新增`HandoffTargetProgressStatus`状态机；旧30-count变31且必须逐owner重验 |
| Step 11 persistence | one handoff row stores aggregate receipt | fact + target plan snapshot + per-target progress + unique attempt / source constraints |
| Step 12 errors | generic domain / adapter failure | 本批6个public error owners及typed source error chain全部映射 |
| Step 13 idempotency / concurrency | retry handoff只按fact ref | `(handoff,target,attempt)`、same-source single batch、commit unknown inspect与single winner |
| Step 15 observability/audit | observability ack可替代capture；one status log | capture / terminal source分层、target progress / aggregate / cleanup marker与redaction |
| Step 16 test cuts、`05/06/07`、`CB-SBX-12A` | 29状态机 /30 enum frozen inventory | DesignReopen后定向重验为30状态机 /31 enum，并重算相关TC / gate / boundary count；当前不得提前改写 |

这只是受影响集合登记，不授权修改Step 7~16、正式`03~07`或boundary skeleton。旧30-count仍是historical reviewed材料，不能在本批继续充当current implementation inventory。

### 22B.7 Mechanical audit result

| check | expected | observed static design result |
|---|---:|---:|
| batch 5 canonical inventory items | 5 (#16/#20~#23) | 5 closed |
| batch 5 public declaration set | 28 | 28 unique；missing 0；duplicate 0 |
| shared canonical status owners | 39 | 39 enum declarations；new owner 1 |
| handoff target kinds handled | 7 | 5 mapped + EventRelay independent + Other fail-closed |
| target progress statuses | 5 | 5 covered by graph / field matrix |
| handoff aggregate statuses | 5 | 5 covered by fixed precedence |
| observability source paths | 2 | capture + formal terminal run |
| public batch 5 error owners | 6 | observability、target、progress、ownership guard、handoff fact、extended captured material |
| exact new `6R-04` forward methods | 2 | `require_handoff_block`;`require_handoff_unblocked` registered |
| Rust code block brace imbalance | 0 | 0 across 47 + 28 blocks |
| Markdown fence imbalance | 0 | 0 |
| public type/callable/variant/named field/payload-field Rustdoc missing | 0 | 0 / 0 / 0 / 0 / 0 |
| raw body / path / provider / formal evidence fields added | 0 | 0 |
| unresolved batch 5 object schema | 0 | 0 |

审计脚本位于`/tmp/audit_l4_sandbox_batch5.pl`，只是本地静态文档扫描工具，不是项目测试、evidence producer或实现交付物。上述结果不声明Rust编译、单元测试、集成测试、runtime run、真实evidence、实现commit或验收签署。

---

## 23. `CaptureSummaryView` exact contract

### 23.1 Capability、字段边界与历史占位失效

`CaptureSummaryView`承接`GetCaptureSummary`的caller-safe读取能力。它只能从一个committed capture group复制immutable capture fact、完整或显式不完整的material row coverage、唯一observability material和safe summaries；不能读取adapter、material body或下游formal truth。

batch 6 开工时登记内部诊断 `SBX-DDD-VIEW-OWNER-6R03-001`：本节与§24最初草稿引用了仅在 domain 分件展开的`CapturedMaterialKey`、`CaptureRequirementGapDisposition`、`CaptureCollectionDisposition`、`ObservabilitySignalKindSet`、`HandoffMaterialSelection`、`HandoffDeliveryAttemptRef`、`HandoffReceiptRef`和`HandoffMaterialDeliveryKind`，与 Step 5 的`contracts`依赖方向冲突。按 shared registry §8.4.1，八组 body-free finite carrier / typed ref 的唯一 owner 已固定为`contracts`；domain aggregate复用它们并继续拥有关系与transition。不得改为两套同义 projection carrier，也不得让`contracts`反向依赖`domain`。

| capability | exact input | output | no-write / ownership boundary |
|---|---|---|---|
| 展示capture结果 | immutable capture fact字段 | canonical `CaptureFactStatus`、collection disposition、safe reasons | 不定义`VisibleCaptureStatus`，不改变capture truth |
| 展示captured material | 与fact key set同snapshot读取的material rows | key/kind/digest/safe-summary/size/lifecycle item | 不公开locator、path、URL、bytes、artifact/evidence identity |
| 展示capture gap | immutable fact gap fields | kind/count/disposition summary | query不得重算completeness或删改gap |
| 展示observability承接 | fact预绑定ref对应的committed observability row | signal kinds、safe-summary refs、canonical lifecycle | 不证明observability store已接收 |
| 显式降级 | incomplete row coverage、missing observability row或stale projection | non-empty caller-safe degraded reasons | 不以缺失字段推断success，不触发repair / refresh |

HLD与原Step 6中的以下名称只保留为`historical_material`：

| historical placeholder | 当前处置 | 原因 |
|---|---|---|
| `VisibleCaptureStatus` | historical invalid；直接显示`CaptureFactStatus` | 第二状态owner会与immutable fact漂移 |
| `CapturedMaterialSummary` | 由`CaptureMaterialStatusItem` / set替代 | 原名称没有字段、coverage、lineage或泄露边界 |
| `CaptureViewDegradedMarkerSet` | 复用`StatusViewDegradedReasonSet` | degraded必须是非空safe reason，不新建同义marker family |
| `from_capture(CaptureFact)` | historical invalid | contracts view不能接收domain aggregate；application mapper必须先复制committed source |
| public `Vec<CapturedMaterialRef>` | historical invalid | 会把内部locator与完整material row直接扩散到protocol DTO |

### 23.2 Caller-safe captured material status item

```rust
/// capture summary中一个committed material row的caller-safe状态项。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialStatusItem {
    /// material row唯一归属的capture fact ref。
    capture_ref: CaptureFactRef,
    /// material row唯一归属的completed run ref。
    run_ref: ControlledExecutionRunRef,
    /// material row与capture共用的canonical generation。
    generation_ref: ResourceRef,
    /// capture group内的stable material key。
    material_key: CapturedMaterialKey,
    /// canonical material role。
    material_kind: MaterialKind,
    /// candidate material digest；不等于artifact / evidence digest。
    material_digest: SandboxMaterialDigest,
    /// body-free safety summary ref。
    safety_summary_ref: SafeSummaryRef,
    /// committed positive material size。
    size_bytes: NonZeroU64,
    /// material row当前canonical lifecycle status。
    material_status: CapturedMaterialStatus,
    /// material已绑定的唯一handoff batch；`Captured`时为空。
    handoff_ref: Option<HandoffFactRef>,
    /// handoff failure或retention block的caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// material首次定格时间。
    captured_at: Timestamp,
    /// 当前material status生效时间。
    status_changed_at: Timestamp,
    /// 最近material transition的audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl CaptureMaterialStatusItem {
    /// 从application mapper复制的committed material字段构造并校验caller-safe item。
    pub fn try_from_committed_fields(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        material_key: CapturedMaterialKey,
        material_kind: MaterialKind,
        material_digest: SandboxMaterialDigest,
        safety_summary_ref: SafeSummaryRef,
        size_bytes: NonZeroU64,
        material_status: CapturedMaterialStatus,
        handoff_ref: Option<HandoffFactRef>,
        status_reason: Option<SandboxReason>,
        captured_at: Timestamp,
        status_changed_at: Timestamp,
        last_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回owning capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回owning completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回stable material key。
    pub fn material_key(&self) -> &CapturedMaterialKey;
    /// 返回canonical material kind。
    pub fn material_kind(&self) -> MaterialKind;
    /// 返回candidate material digest。
    pub fn material_digest(&self) -> &SandboxMaterialDigest;
    /// 返回body-free safety summary ref。
    pub fn safety_summary_ref(&self) -> &SafeSummaryRef;
    /// 返回positive material size。
    pub fn size_bytes(&self) -> NonZeroU64;
    /// 返回canonical material lifecycle status。
    pub fn material_status(&self) -> CapturedMaterialStatus;
    /// 返回optional unique handoff ref。
    pub fn handoff_ref(&self) -> Option<&HandoffFactRef>;
    /// 返回caller-safe lifecycle reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回material captured time。
    pub fn captured_at(&self) -> &Timestamp;
    /// 返回current status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}

/// 保存同一capture/run/generation且material key唯一的caller-safe status items。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialStatusItemSet(Vec<CaptureMaterialStatusItem>);

impl CaptureMaterialStatusItemSet {
    /// 构造允许为空、lineage一致且按`(material_kind, material_key)`排序的item set。
    pub fn try_for_capture(
        capture_ref: &CaptureFactRef,
        run_ref: &ControlledExecutionRunRef,
        generation_ref: &ResourceRef,
        items: Vec<CaptureMaterialStatusItem>,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回canonical顺序的只读status items。
    pub fn as_slice(&self) -> &[CaptureMaterialStatusItem];
    /// 返回exact material key对应的status item。
    pub fn get(
        &self,
        material_key: &CapturedMaterialKey,
    ) -> Option<&CaptureMaterialStatusItem>;
    /// 返回item数量。
    pub fn len(&self) -> usize;
    /// 判断set是否为空。
    pub fn is_empty(&self) -> bool;
    /// 返回指定canonical material kind的item数量。
    pub fn count_kind(&self, material_kind: MaterialKind) -> usize;
    /// 返回全部available material keys。
    pub fn material_keys(&self) -> CapturedMaterialKeySet;
}
```

item status relation固定如下，constructor必须穷尽匹配，不能使用wildcard：

| material status | handoff ref | status reason | public interpretation |
|---|---|---|---|
| `Captured` | `None` | `None` | 已形成body-free candidate material，尚未打开handoff |
| `HandoffPending` | `Some` | `None` | 同一batch仍pending / retryable，不表示delivery success |
| `HandoffFailed` | `Some` | `Some` | material-specific delivery terminal failed |
| `HandoffAccepted` | `Some` | `None` | selected targets已ack，不表示下游formal truth成立 |
| `RetentionBlocked` | `Some` | `Some` | cleanup / investigation owner仍阻断删除或释放 |

`status_changed_at`不得早于`captured_at`。item不保存locator、provider、storage path、URL、raw output、artifact ref、evidence alias或downstream receipt；digest只能以`SandboxMaterialDigest`角色展示，protocol mapper必须保留“不等于formal artifact / evidence digest”的语义。

### 23.3 Capture gap summary

```rust
/// capture view中一个required material缺口的finite count摘要。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialGapSummaryItem {
    /// 出现缺口的canonical material kind。
    material_kind: MaterialKind,
    /// capture contract要求的positive minimum count。
    required_count: NonZeroU32,
    /// committed capture实际观察到且严格更小的count。
    observed_count: u32,
    /// 缺口对capture结果的canonical处置。
    gap_disposition: CaptureRequirementGapDisposition,
}

impl CaptureMaterialGapSummaryItem {
    /// 从committed gap字段复制并校验`observed < required`关系。
    pub fn try_from_committed_fields(
        material_kind: MaterialKind,
        required_count: NonZeroU32,
        observed_count: u32,
        gap_disposition: CaptureRequirementGapDisposition,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回缺口material kind。
    pub fn material_kind(&self) -> MaterialKind;
    /// 返回required minimum count。
    pub fn required_count(&self) -> NonZeroU32;
    /// 返回committed observed count。
    pub fn observed_count(&self) -> u32;
    /// 返回gap disposition。
    pub fn gap_disposition(&self) -> CaptureRequirementGapDisposition;
}

/// 保存material kind唯一且canonical排序的capture gap summaries。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureMaterialGapSummarySet(Vec<CaptureMaterialGapSummaryItem>);

impl CaptureMaterialGapSummarySet {
    /// 构造允许为空且material kind唯一的gap summary set。
    pub fn try_new(
        items: Vec<CaptureMaterialGapSummaryItem>,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回按material kind排序的只读gap summaries。
    pub fn as_slice(&self) -> &[CaptureMaterialGapSummaryItem];
    /// 判断是否存在`RecordFailed` gap。
    pub fn contains_failed_gap(&self) -> bool;
    /// 判断set是否为空。
    pub fn is_empty(&self) -> bool;
}
```

gap summary只复制committed `CaptureFact.material_gaps`，不从available material item数量重新计算。item数量与gap的`observed_count`不一致属于source corruption / stale mixed snapshot，必须返回typed view error或显式degraded，不能由query修正任一方。

### 23.4 Capture view lineage 与 observability status item

```rust
/// capture view source中可机械对账的一组committed capture lineage refs。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureViewLineage {
    /// immutable capture fact ref。
    capture_ref: CaptureFactRef,
    /// source completed controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// run owning controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// run owning execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// run使用的established coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// run使用的isolation environment handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// capture group共用的canonical generation。
    generation_ref: ResourceRef,
}

impl CaptureViewLineage {
    /// 从同一committed capture group复制全部named refs并拒绝identity碰撞。
    pub fn try_from_committed_fields(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        boundary_ref: CoherentBoundaryRef,
        isolation_handle_ref: IsolationEnvironmentHandleRef,
        generation_ref: ResourceRef,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回immutable capture fact ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回source completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回owning execution environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回established boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回isolation environment handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
}

/// capture summary中与exact capture fact绑定的caller-safe observability material状态项。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureObservabilityStatusItem {
    /// observability material的Sandbox-local identity。
    observability_material_ref: ObservabilityMaterialRef,
    /// 与source capture fact相同的committed lineage。
    lineage: CaptureViewLineage,
    /// material创建时复制的canonical capture status。
    source_capture_status: CaptureFactStatus,
    /// material创建时复制的typed collection disposition。
    source_collection_disposition: CaptureCollectionDisposition,
    /// finite observability signal kinds。
    signal_kinds: ObservabilitySignalKindSet,
    /// body-free safe summary refs；允许为空。
    summary_refs: SafeSummaryRefSet,
    /// capture owner提供的caller-safe source reason。
    source_reason: Option<SandboxReason>,
    /// observability material当前canonical lifecycle status。
    material_status: ObservabilityMaterialStatus,
    /// material已绑定的唯一handoff batch；`Prepared`时为空。
    handoff_ref: Option<HandoffFactRef>,
    /// failed handoff的caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// material首次prepared time。
    prepared_at: Timestamp,
    /// current material status生效时间。
    status_changed_at: Timestamp,
    /// 最近material transition的audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl CaptureObservabilityStatusItem {
    /// 从capture-source observability row的committed caller-safe字段构造status item。
    pub fn try_from_committed_fields(
        observability_material_ref: ObservabilityMaterialRef,
        lineage: CaptureViewLineage,
        source_capture_status: CaptureFactStatus,
        source_collection_disposition: CaptureCollectionDisposition,
        signal_kinds: ObservabilitySignalKindSet,
        summary_refs: SafeSummaryRefSet,
        source_reason: Option<SandboxReason>,
        material_status: ObservabilityMaterialStatus,
        handoff_ref: Option<HandoffFactRef>,
        status_reason: Option<SandboxReason>,
        prepared_at: Timestamp,
        status_changed_at: Timestamp,
        last_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回observability material ref。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回source capture lineage。
    pub fn lineage(&self) -> &CaptureViewLineage;
    /// 返回material创建时复制的capture status。
    pub fn source_capture_status(&self) -> CaptureFactStatus;
    /// 返回material创建时复制的collection disposition。
    pub fn source_collection_disposition(&self) -> CaptureCollectionDisposition;
    /// 返回finite observability signal kinds。
    pub fn signal_kinds(&self) -> &ObservabilitySignalKindSet;
    /// 返回body-free safe summary refs。
    pub fn summary_refs(&self) -> &SafeSummaryRefSet;
    /// 返回capture owner的caller-safe source reason。
    pub fn source_reason(&self) -> Option<&SandboxReason>;
    /// 返回canonical observability material status。
    pub fn material_status(&self) -> ObservabilityMaterialStatus;
    /// 返回optional unique handoff ref。
    pub fn handoff_ref(&self) -> Option<&HandoffFactRef>;
    /// 返回failed handoff的caller-safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回material prepared time。
    pub fn prepared_at(&self) -> &Timestamp;
    /// 返回current status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}
```

`CaptureObservabilityStatusItem`只接受`ObservabilityMaterialSourceBasis::Capture`映射结果，且source capture ref/status/disposition必须与`lineage`和source snapshot完全一致；terminal-run observability material不能进入capture summary。signal kinds必须非空且含`Audit`，summary refs只能来自`IsolationBackend`。lifecycle relation与§17.3一致：`Prepared`无handoff/ref reason，`HandoffPending`有handoff无reason，`HandoffFailed`两者均有，`HandoffRecorded`有handoff无reason；`status_changed_at >= prepared_at`。

application mapper必须从同一个repository snapshot复制domain getters到`CaptureViewLineage`、material items和observability item。它不得把caller selector、projection中旧ref、latest-row scan或字符串拆解结果混入lineage；contracts constructor只验证复制后的关系，不替代repository snapshot isolation。

### 23.5 Output summary 与 committed source snapshot

```rust
/// capture view中一个committed body-free execution output summary。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureOutputSummaryItem {
    /// output summary唯一归属的capture fact ref。
    capture_ref: CaptureFactRef,
    /// output summary唯一归属的completed run ref。
    run_ref: ControlledExecutionRunRef,
    /// output summary与capture共用的canonical generation。
    generation_ref: ResourceRef,
    /// ordered-unique body-free safe summary refs。
    summary_refs: SafeSummaryRefSet,
    /// stdout / stderr / exit-status / diagnostic material key集合。
    output_material_keys: CapturedMaterialKeySet,
    /// capture adapter观察body-free output index的canonical time。
    observed_at: Timestamp,
}

impl CaptureOutputSummaryItem {
    /// 从committed `ExecutionOutputSummary`的caller-safe字段复制并校验lineage。
    pub fn try_from_committed_fields(
        capture_ref: CaptureFactRef,
        run_ref: ControlledExecutionRunRef,
        generation_ref: ResourceRef,
        summary_refs: SafeSummaryRefSet,
        output_material_keys: CapturedMaterialKeySet,
        observed_at: Timestamp,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回owning capture ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回owning completed run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回body-free safe summary refs。
    pub fn summary_refs(&self) -> &SafeSummaryRefSet;
    /// 返回output-safe material keys。
    pub fn output_material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回adapter observation time。
    pub fn observed_at(&self) -> &Timestamp;
}

/// 从同一committed capture group复制出的caller-safe view source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummarySourceSnapshot {
    /// source capture group的exact lineage。
    lineage: CaptureViewLineage,
    /// 形成capture判定的immutable completeness guard ref。
    completeness_guard_ref: CaptureCompletenessGuardRef,
    /// capture adapter本次typed collection disposition。
    collection_disposition: CaptureCollectionDisposition,
    /// `Collected`时必有的body-free output summary。
    output_summary: Option<CaptureOutputSummaryItem>,
    /// immutable capture fact声明的完整material key set。
    expected_material_keys: CapturedMaterialKeySet,
    /// 当前committed snapshot可安全读取的material status rows；允许显式不完整。
    material_statuses: CaptureMaterialStatusItemSet,
    /// immutable capture fact保存的required material gap summaries。
    material_gaps: CaptureMaterialGapSummarySet,
    /// source fact保存的forbidden-body marker set；只用于relation校验，不复制到public view。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// capture fact预绑定且必须存在的observability material identity。
    expected_observability_material_ref: ObservabilityMaterialRef,
    /// 当前snapshot可安全读取的matching observability row；允许缺失以形成degraded view。
    observability_status: Option<CaptureObservabilityStatusItem>,
    /// immutable capture fact canonical status。
    capture_status: CaptureFactStatus,
    /// non-complete capture的caller-safe status reason。
    status_reason: Option<SandboxReason>,
    /// adapter failure / source unavailable的caller-safe source reason。
    source_reason: Option<SandboxReason>,
    /// completeness decision pure evaluation time。
    completeness_evaluated_at: Timestamp,
    /// capture fact canonical record time。
    captured_at: Timestamp,
    /// source capture fact audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// application mapper读取committed group的observation time。
    observed_at: Timestamp,
}

impl CaptureSummarySourceSnapshot {
    /// 构造relation-checked committed source；允许missing rows但拒绝未知row和truth矩阵损坏。
    pub fn try_new(
        lineage: CaptureViewLineage,
        completeness_guard_ref: CaptureCompletenessGuardRef,
        collection_disposition: CaptureCollectionDisposition,
        output_summary: Option<CaptureOutputSummaryItem>,
        expected_material_keys: CapturedMaterialKeySet,
        material_statuses: CaptureMaterialStatusItemSet,
        material_gaps: CaptureMaterialGapSummarySet,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        expected_observability_material_ref: ObservabilityMaterialRef,
        observability_status: Option<CaptureObservabilityStatusItem>,
        capture_status: CaptureFactStatus,
        status_reason: Option<SandboxReason>,
        source_reason: Option<SandboxReason>,
        completeness_evaluated_at: Timestamp,
        captured_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回source capture lineage。
    pub fn lineage(&self) -> &CaptureViewLineage;
    /// 返回completeness guard ref。
    pub fn completeness_guard_ref(&self) -> &CaptureCompletenessGuardRef;
    /// 返回typed collection disposition。
    pub fn collection_disposition(&self) -> CaptureCollectionDisposition;
    /// 返回optional body-free output summary。
    pub fn output_summary(&self) -> Option<&CaptureOutputSummaryItem>;
    /// 返回capture fact声明的完整material keys。
    pub fn expected_material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回snapshot中available material status rows。
    pub fn material_statuses(&self) -> &CaptureMaterialStatusItemSet;
    /// 返回committed material gap summaries。
    pub fn material_gaps(&self) -> &CaptureMaterialGapSummarySet;
    /// 返回capture fact预绑定的observability material ref。
    pub fn expected_observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回optional matching observability status row。
    pub fn observability_status(&self) -> Option<&CaptureObservabilityStatusItem>;
    /// 返回immutable canonical capture status。
    pub fn capture_status(&self) -> CaptureFactStatus;
    /// 返回non-complete caller-safe status reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回adapter/source caller-safe reason。
    pub fn source_reason(&self) -> Option<&SandboxReason>;
    /// 返回completeness evaluation time。
    pub fn completeness_evaluated_at(&self) -> &Timestamp;
    /// 返回capture record time。
    pub fn captured_at(&self) -> &Timestamp;
    /// 返回source audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回committed group observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 判断available material rows是否与fact expected keys形成exact 1:1 coverage。
    pub fn has_complete_material_coverage(&self) -> bool;
    /// 判断matching observability row是否已安全读出。
    pub fn has_observability_status(&self) -> bool;
    /// 判断material coverage、gap counts和observability row是否足以构造non-degraded view。
    pub fn is_complete_read_source(&self) -> bool;
}
```

`try_new`先验证capture fact自身的closed status matrix，再验证available source relation。capture fact矩阵与§19.3完全一致：

| capture status path | disposition / output | expected keys / gaps / markers | reasons |
|---|---|---|---|
| `Complete` | `Collected / Some` | keys任意；gaps empty；markers empty | `None / None` |
| `Partial` | `Collected / Some` | gaps non-empty且全`RecordPartial`；markers empty | `Some / None` |
| requirement `Failed` | `Collected / Some` | gaps non-empty且至少一项`RecordFailed`；markers empty | `Some / None` |
| adapter `Failed` | `AdapterFailed / None` | keys/gaps/markers empty | `Some / Some` |
| forbidden-body `Failed` | `ForbiddenBodyRejected / None` | keys/gaps empty；markers non-empty | `Some / None` |
| `Unavailable` | `SourceUnavailable / None` | keys/gaps/markers empty | `Some / Some` |

available material statuses必须是expected key set的子集，且每项lineage等于source lineage；任何unknown key直接报错，不得被degraded reason掩盖。output summary存在时lineage必须相等，output keys必须属于expected keys；当matching material row available时，其kind必须为`Stdout | Stderr | ExitStatus | Diagnostic`。observability item存在时ref与lineage必须匹配，source capture status / disposition必须等于snapshot。`observed_at`不得早于capture、material、observability或其status change time。

`is_complete_read_source()`要求：material keys exact coverage、每个gap的observed count等于完整status item set中对应kind count、matching observability row存在、output keys均能映射到output-safe item。它不要求capture status为`Complete`；一个真实`Partial | Failed | Unavailable` fact也可以形成完整、non-degraded读取面。domain failure与read-source degradation是两个独立维度。

### 23.6 `CaptureSummaryViewError`

```rust
/// capture summary view的source lineage、coverage、status或degraded关系失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaptureSummaryViewError {
    /// view lineage中的named refs或generation发生identity碰撞。
    CaptureViewLineageIdentityCollision,
    /// material status item与source capture lineage不一致。
    CaptureMaterialStatusLineageMismatch,
    /// material status item的key或material kind重复。
    DuplicateCaptureMaterialStatusItem,
    /// material status item引用了capture fact未声明的material key。
    UnexpectedCaptureMaterialKey,
    /// material status与handoff ref、reason或时间字段不满足canonical matrix。
    CaptureMaterialStatusRelationInvalid {
        /// relation无法成立的canonical material status。
        status: CapturedMaterialStatus,
    },
    /// material gap summary的count、kind或disposition关系不合法。
    CaptureMaterialGapSummaryRelationInvalid,
    /// material gap summary出现重复material kind。
    DuplicateCaptureMaterialGapSummary,
    /// gap observed count与完整material item count不一致。
    CaptureMaterialGapCountMismatch,
    /// output summary与capture/run/generation或output material key关系不一致。
    CaptureOutputSummaryRelationInvalid,
    /// observability status item与capture source、ref或lineage不一致。
    CaptureObservabilityStatusRelationInvalid,
    /// observability signal set、source basis或lifecycle字段不满足capture view relation。
    CaptureObservabilitySignalRelationInvalid,
    /// capture status、collection disposition、output、gap、marker或reason组合不满足§23.5 matrix。
    CaptureViewStatusRelationInvalid {
        /// relation无法成立的canonical capture status。
        status: CaptureFactStatus,
    },
    /// capture source中的forbidden marker与status / reason关系不合法。
    CaptureForbiddenBodyMarkerRelationInvalid,
    /// capture、material、observability或view observation time不满足monotonic relation。
    CaptureViewTimestampInvalid,
    /// committed capture source无法形成完整read view，但caller未走degraded factory。
    CaptureViewSourceIncomplete,
    /// degraded factory收到空reason set。
    CaptureViewDegradedReasonsEmpty,
    /// complete factory不允许携带degraded reasons或degraded source marker。
    CaptureViewDegradedReasonsUnexpected,
    /// view ref不是capture summary view的named kind。
    CaptureSummaryViewRefKindMismatch,
}
```

错误不携带locator、path、provider、raw adapter cause、material body、artifact/evidence identity或observability store identity。`CaptureSummaryViewError`只描述contracts view source的结构和关系；repository missing、projection stale、authorization/visibility和transport mapping由Step 7/8的typed error mapper决定，不能在本enum中塞入外部错误文本。

### 23.7 `CaptureSummaryView`

```rust
/// 面向caller的capture、body-free material与observability只读摘要。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CaptureSummaryView {
    /// 本read model snapshot的Sandbox-local typed identity。
    view_ref: CaptureSummaryViewRef,
    /// committed capture group的relation-checked lineage。
    lineage: CaptureViewLineage,
    /// 形成capture判定的immutable completeness guard ref。
    completeness_guard_ref: CaptureCompletenessGuardRef,
    /// capture adapter本次typed collection disposition。
    collection_disposition: CaptureCollectionDisposition,
    /// canonical capture fact status；不另建visible status。
    capture_status: CaptureFactStatus,
    /// `Collected`时的body-free output summary。
    output_summary: Option<CaptureOutputSummaryItem>,
    /// immutable capture fact声明的完整material key set；degraded view也保留。
    expected_material_keys: CapturedMaterialKeySet,
    /// caller-safe captured material lifecycle rows。
    material_statuses: CaptureMaterialStatusItemSet,
    /// required material gap count summaries。
    material_gaps: CaptureMaterialGapSummarySet,
    /// capture fact预绑定且必须由source snapshot解释的observability ref。
    expected_observability_material_ref: ObservabilityMaterialRef,
    /// matching observability material status；source缺失时仅由degraded view保留None。
    observability_status: Option<CaptureObservabilityStatusItem>,
    /// non-complete capture的caller-safe status reason。
    status_reason: Option<SandboxReason>,
    /// adapter/source failure的caller-safe reason。
    source_reason: Option<SandboxReason>,
    /// completeness decision pure evaluation time。
    completeness_evaluated_at: Timestamp,
    /// immutable capture fact canonical record time。
    captured_at: Timestamp,
    /// read source不完整、stale或projection缺口的caller-safe reasons。
    degraded_reasons: Vec<SandboxReason>,
    /// source capture fact对应的audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// view mapper observation time。
    observed_at: Timestamp,
}

impl CaptureSummaryView {
    /// 从完整committed capture source构造non-degraded view；不查询或修改任何truth。
    pub fn from_committed_snapshot(
        view_ref: CaptureSummaryViewRef,
        source: CaptureSummarySourceSnapshot,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 从安全但不完整的committed source构造degraded view；不改变canonical capture status。
    pub fn from_degraded_snapshot(
        view_ref: CaptureSummaryViewRef,
        source: CaptureSummarySourceSnapshot,
        degraded_reasons: StatusViewDegradedReasonSet,
    ) -> Result<Self, CaptureSummaryViewError>;

    /// 返回capture summary view identity。
    pub fn view_ref(&self) -> &CaptureSummaryViewRef;
    /// 返回committed capture group lineage。
    pub fn lineage(&self) -> &CaptureViewLineage;
    /// 返回completeness guard ref。
    pub fn completeness_guard_ref(&self) -> &CaptureCompletenessGuardRef;
    /// 返回typed collection disposition。
    pub fn collection_disposition(&self) -> CaptureCollectionDisposition;
    /// 返回canonical capture fact status。
    pub fn capture_status(&self) -> CaptureFactStatus;
    /// 返回optional body-free output summary。
    pub fn output_summary(&self) -> Option<&CaptureOutputSummaryItem>;
    /// 返回capture fact声明的完整material key set。
    pub fn expected_material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回caller-safe captured material status rows。
    pub fn material_statuses(&self) -> &CaptureMaterialStatusItemSet;
    /// 返回required material gap summaries。
    pub fn material_gaps(&self) -> &CaptureMaterialGapSummarySet;
    /// 返回capture fact预绑定的observability material ref。
    pub fn expected_observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回optional matching observability status item。
    pub fn observability_status(&self) -> Option<&CaptureObservabilityStatusItem>;
    /// 返回capture status reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回adapter/source reason。
    pub fn source_reason(&self) -> Option<&SandboxReason>;
    /// 返回completeness decision evaluation time。
    pub fn completeness_evaluated_at(&self) -> &Timestamp;
    /// 返回capture fact canonical record time。
    pub fn captured_at(&self) -> &Timestamp;
    /// 返回caller-safe degraded reasons；完整view为空。
    pub fn degraded_reasons(&self) -> &[SandboxReason];
    /// 返回source audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回view observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 判断view是否携带至少一个degraded reason。
    pub fn is_degraded(&self) -> bool;
    /// 仅在canonical capture status为`Complete`且source完整、view非degraded时返回true。
    pub fn can_show_capture_complete(&self) -> bool;
    /// 判断view是否至少包含一个caller-safe material status item。
    pub fn has_materials(&self) -> bool;
    /// 判断available material status rows是否exact覆盖capture fact声明的keys。
    pub fn has_complete_material_coverage(&self) -> bool;
}
```

`from_committed_snapshot`只能接受`source.is_complete_read_source() == true`，并把`degraded_reasons`固定为空；它仍可以显示`Partial | Failed | Unavailable`，因为这些是capture truth的canonical结果而不是读取降级。`from_degraded_snapshot`必须收到非空、ordered-unique、caller-safe reason set；它保留source中所有已知字段，但不得把缺失的material row、observability row或gap补成空集合。

`can_show_capture_complete()`的唯一条件是：`capture_status == Complete`、`collection_disposition == Collected`、`material_gaps.is_empty()`、`observability_status`存在、`has_complete_material_coverage() == true`、`is_degraded() == false`，且source在factory时已通过其余完整coverage检查。它不表示artifact、runtime、runner或observability store已完成，也不触发任何下游handoff。

---

## 24. `MaterialHandoffStatusView` exact contract

### 24.1 Capability、字段边界与历史占位失效

`MaterialHandoffStatusView`承接`GetMaterialHandoffStatus`的caller-safe读取能力。它展示Sandbox已提交的handoff batch、完整target plan、逐target progress、source-material-specific delivery和独立relay observation；它不调用adapter、不执行retry、不读取cleanup guard本体，也不把任何ack解释为下游formal truth。

| capability | exact input | output | no-write / ownership boundary |
|---|---|---|---|
| 展示handoff aggregate | committed `HandoffFactStatus`与cleanup override relation | canonical aggregate status、safe reason、cleanup guard ref | 不定义`VisibleHandoffStatus`，不重算last receipt |
| 展示target plan | immutable complete target selection | target kind、external target ref、material selection | 不从ref字符串推断owner，不加入`EventRelay` / `Other` |
| 展示target progress | committed `(handoff,target)` rows | progress status、attempt/receipt refs、safe reason、retry age | 不开始attempt、不改变retryability、不迁移ownership |
| 展示material delivery | exact selected target subset的derived kind | captured key或observability ref、delivery kind、selected target refs | 不把无关target失败传播给material |
| 展示relay observation | independent relay ref/status pair | `SandboxEventRelayStatus` observation | relay失败不改handoff aggregate，ack不写progress |
| 展示cleanup阻断 | stored cleanup override relation | `blocks_cleanup()`只读结果 | 不调用`CleanupGuard`，不release、不reap |

HLD与旧消费者中的以下名称只保留为`historical_material`：

| historical placeholder | 当前处置 | 原因 |
|---|---|---|
| `VisibleHandoffStatus` | historical invalid；直接显示`HandoffFactStatus` | 会形成第二aggregate status owner |
| `HandoffTargetSummary` | 由完整plan item + progress item set替代 | 原名称丢失selection、attempt、receipt和逐target失败 |
| `CleanupBlockingMarker` | 由`cleanup_guard_ref`与`HandoffFactStatus::BlockedByCleanupGuard`关系替代 | marker不能成为cleanup truth |
| `from_handoff(HandoffFact)` | historical invalid | contracts view只接收committed source snapshot，不接收domain aggregate |
| `EventRelay`作为普通target | historical invalid | relay由`SandboxEventRelayRecord`独立owner处理 |

### 24.2 Caller-safe target plan item

```rust
/// material handoff view中一个immutable complete target plan item。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetPlanStatusItem {
    /// plan item唯一归属的handoff batch ref。
    handoff_ref: HandoffFactRef,
    /// closed downstream owner kind。
    target_kind: HandoffTargetKind,
    /// resolver提供的stable body-free external target ref。
    target_ref: ExternalSourceRef,
    /// 本target接收的exact Sandbox-owned material selection。
    material_selection: HandoffMaterialSelection,
}

impl HandoffTargetPlanStatusItem {
    /// 从committed plan字段构造并校验kind/source/selection relation。
    pub fn try_from_committed_fields(
        handoff_ref: HandoffFactRef,
        target_kind: HandoffTargetKind,
        target_ref: ExternalSourceRef,
        material_selection: HandoffMaterialSelection,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回owning handoff ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回closed target kind。
    pub fn target_kind(&self) -> HandoffTargetKind;
    /// 返回stable external target ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回exact material selection。
    pub fn material_selection(&self) -> &HandoffMaterialSelection;
    /// 判断target kind与external source kind是否matching。
    pub fn has_matching_source_kind(&self) -> bool;
}

/// 保存非空、target identity唯一且保持committed plan顺序的target plan items。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetPlanStatusItemSet(Vec<HandoffTargetPlanStatusItem>);

impl HandoffTargetPlanStatusItemSet {
    /// 构造完整required target plan；禁止EventRelay、Other和重复target identity。
    pub fn try_new(
        items: Vec<HandoffTargetPlanStatusItem>,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回committed plan顺序的只读items。
    pub fn as_slice(&self) -> &[HandoffTargetPlanStatusItem];
    /// 返回exact target ref对应的plan item。
    pub fn get(&self, target_ref: &ExternalSourceRef) -> Option<&HandoffTargetPlanStatusItem>;
    /// 返回target数量。
    pub fn len(&self) -> usize;
    /// 判断plan是否包含指定target kind。
    pub fn contains_kind(&self, target_kind: HandoffTargetKind) -> bool;
    /// 返回所有target selection中captured material keys的canonical union；跨target重复是合法覆盖。
    pub fn captured_material_key_union(&self) -> CapturedMaterialKeySet;
    /// 判断至少一个target selection覆盖exact observability material ref。
    pub fn selects_observability_material(
        &self,
        observability_material_ref: &ObservabilityMaterialRef,
    ) -> bool;
}
```

plan item只复制`HandoffTarget`的typed selection；selection中的material key和observability ref仍是body-free typed refs，不代表下游已接收。`HandoffTargetPlanStatusItemSet`必须非空，且`EventRelay | Other`在view source中也必须拒绝；relay observation只能位于§24.5独立集合。

### 24.3 Caller-safe target progress item

```rust
/// material handoff view中一个committed target progress row的caller-safe复制。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetProgressStatusItem {
    /// progress row唯一归属的handoff batch ref。
    handoff_ref: HandoffFactRef,
    /// immutable plan中的closed target kind。
    target_kind: HandoffTargetKind,
    /// immutable plan中的stable external target ref。
    target_ref: ExternalSourceRef,
    /// immutable plan中的exact material selection。
    material_selection: HandoffMaterialSelection,
    /// per-target canonical progress status。
    progress_status: HandoffTargetProgressStatus,
    /// current或latest delivery attempt ref；`Pending`时为空。
    attempt_ref: Option<HandoffDeliveryAttemptRef>,
    /// delivered target的body-free receipt ref。
    receipt_ref: Option<HandoffReceiptRef>,
    /// retryable / failed target的caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// retryable target的minimum retry age。
    retry_not_before_age_millis: Option<NonZeroU64>,
    /// 已持久化的delivery attempt count。
    attempt_count: u32,
    /// current attempt start time。
    attempt_started_at: Option<Timestamp>,
    /// current progress status生效时间。
    status_changed_at: Timestamp,
    /// 最近progress transition audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl HandoffTargetProgressStatusItem {
    /// 从同一committed plan/progress row复制并校验status field matrix。
    pub fn try_from_committed_fields(
        plan_item: &HandoffTargetPlanStatusItem,
        progress_status: HandoffTargetProgressStatus,
        attempt_ref: Option<HandoffDeliveryAttemptRef>,
        receipt_ref: Option<HandoffReceiptRef>,
        status_reason: Option<SandboxReason>,
        retry_not_before_age_millis: Option<NonZeroU64>,
        attempt_count: u32,
        attempt_started_at: Option<Timestamp>,
        status_changed_at: Timestamp,
        last_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回owning handoff ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回closed target kind。
    pub fn target_kind(&self) -> HandoffTargetKind;
    /// 返回stable external target ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回exact material selection。
    pub fn material_selection(&self) -> &HandoffMaterialSelection;
    /// 返回canonical progress status。
    pub fn progress_status(&self) -> HandoffTargetProgressStatus;
    /// 返回current/latest attempt ref。
    pub fn attempt_ref(&self) -> Option<&HandoffDeliveryAttemptRef>;
    /// 返回delivered receipt ref。
    pub fn receipt_ref(&self) -> Option<&HandoffReceiptRef>;
    /// 返回retryable/failed safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回retry not-before age。
    pub fn retry_not_before_age_millis(&self) -> Option<NonZeroU64>;
    /// 返回persisted attempt count。
    pub fn attempt_count(&self) -> u32;
    /// 返回current attempt start time。
    pub fn attempt_started_at(&self) -> Option<&Timestamp>;
    /// 返回progress status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回last progress audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}

/// 保存target identity唯一且按plan顺序排列的available progress rows；允许显式不完整。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffTargetProgressStatusItemSet(Vec<HandoffTargetProgressStatusItem>);

impl HandoffTargetProgressStatusItemSet {
    /// 构造属于plan且target identity唯一的available progress set。
    pub fn try_for_plan(
        plan: &HandoffTargetPlanStatusItemSet,
        items: Vec<HandoffTargetProgressStatusItem>,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回按plan顺序排列的available progress rows。
    pub fn as_slice(&self) -> &[HandoffTargetProgressStatusItem];
    /// 返回exact target ref对应的progress row。
    pub fn get(&self, target_ref: &ExternalSourceRef) -> Option<&HandoffTargetProgressStatusItem>;
    /// 判断是否覆盖全部required target plan。
    pub fn has_complete_coverage(&self, plan: &HandoffTargetPlanStatusItemSet) -> bool;
    /// 判断available rows是否全部delivered。
    pub fn all_delivered(&self) -> bool;
    /// 判断是否存在failed target。
    pub fn any_failed(&self) -> bool;
    /// 判断是否存在retryable target。
    pub fn any_retryable(&self) -> bool;
    /// 返回available row数量。
    pub fn len(&self) -> usize;
}
```

progress item的字段矩阵必须逐一等同§20.3：`Pending`没有attempt/receipt/reason/retry age；`Attempting`有attempt但无receipt/reason；`Delivered`有attempt+receipt且无reason；`Retryable`有attempt+reason+retry age且无receipt；`Failed`有attempt+reason且无receipt/retry age。`Failed`和`Delivered`不允许通过view转换，query也不得将缺失row补成`Pending`。

### 24.4 Material-specific delivery status items

```rust
/// 标识handoff view中material-specific delivery item的exact source material。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HandoffMaterialStatusSubject {
    /// capture-source batch中的一个stable captured material key。
    CapturedMaterial {
        /// subject唯一标识的material key。
        material_key: CapturedMaterialKey,
    },
    /// batch唯一source observability material。
    ObservabilityMaterial {
        /// subject唯一标识的observability material ref。
        observability_material_ref: ObservabilityMaterialRef,
    },
}

impl HandoffMaterialStatusSubject {
    /// 返回captured material key；observability subject返回`None`。
    pub fn captured_material_key(&self) -> Option<&CapturedMaterialKey>;
    /// 返回observability material ref；captured subject返回`None`。
    pub fn observability_material_ref(&self) -> Option<&ObservabilityMaterialRef>;
}

/// material-specific delivery item所依赖的非空、target identity唯一ref set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SelectedHandoffTargetRefSet(Vec<ExternalSourceRef>);

impl SelectedHandoffTargetRefSet {
    /// 从完整target plan对subject的selection构造非空、plan-order ref set。
    pub fn try_for_subject(
        plan: &HandoffTargetPlanStatusItemSet,
        subject: &HandoffMaterialStatusSubject,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回保持target plan顺序的selected target refs。
    pub fn as_slice(&self) -> &[ExternalSourceRef];
    /// 判断是否包含exact target ref。
    pub fn contains(&self, target_ref: &ExternalSourceRef) -> bool;
    /// 返回selected target数量。
    pub fn len(&self) -> usize;
}

/// 一个source material在其selected target subset上的derived delivery状态项。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffMaterialDeliveryStatusItem {
    /// item唯一归属的handoff batch ref。
    handoff_ref: HandoffFactRef,
    /// captured key或observability ref subject。
    subject: HandoffMaterialStatusSubject,
    /// immutable plan中选择该subject的non-empty target refs。
    selected_target_refs: SelectedHandoffTargetRefSet,
    /// 从selected progress机械推导的finite delivery kind。
    delivery_kind: HandoffMaterialDeliveryKind,
}

impl HandoffMaterialDeliveryStatusItem {
    /// 从完整plan和progress coverage机械构造captured material delivery item。
    pub fn for_captured_material(
        handoff_ref: &HandoffFactRef,
        material_key: CapturedMaterialKey,
        plan: &HandoffTargetPlanStatusItemSet,
        progress: &HandoffTargetProgressStatusItemSet,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 从完整plan和progress coverage机械构造observability material delivery item。
    pub fn for_observability_material(
        handoff_ref: &HandoffFactRef,
        observability_material_ref: ObservabilityMaterialRef,
        plan: &HandoffTargetPlanStatusItemSet,
        progress: &HandoffTargetProgressStatusItemSet,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回owning handoff ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回material-specific subject。
    pub fn subject(&self) -> &HandoffMaterialStatusSubject;
    /// 返回选择本subject的target refs。
    pub fn selected_target_refs(&self) -> &SelectedHandoffTargetRefSet;
    /// 返回derived material delivery kind。
    pub fn delivery_kind(&self) -> HandoffMaterialDeliveryKind;
}

/// 保存subject唯一、captured key canonical排序且observability item恰好一项的delivery items。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffMaterialDeliveryStatusItemSet(Vec<HandoffMaterialDeliveryStatusItem>);

impl HandoffMaterialDeliveryStatusItemSet {
    /// 从available captured keys与exact observability ref构造complete subject delivery set。
    pub fn try_complete(
        handoff_ref: &HandoffFactRef,
        available_material_keys: &CapturedMaterialKeySet,
        observability_material_ref: &ObservabilityMaterialRef,
        plan: &HandoffTargetPlanStatusItemSet,
        progress: &HandoffTargetProgressStatusItemSet,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回captured key canonical顺序后接observability item的只读items。
    pub fn as_slice(&self) -> &[HandoffMaterialDeliveryStatusItem];
    /// 返回exact captured material key的delivery item。
    pub fn captured_material(
        &self,
        material_key: &CapturedMaterialKey,
    ) -> Option<&HandoffMaterialDeliveryStatusItem>;
    /// 返回唯一observability material delivery item。
    pub fn observability_material(&self) -> &HandoffMaterialDeliveryStatusItem;
    /// 判断全部source material是否都已由各自selected targets delivered。
    pub fn all_delivered(&self) -> bool;
}
```

两个factory必须先要求`progress.has_complete_coverage(plan) == true`，再按subject过滤selected progress。固定优先级与`HandoffFact`完全一致，但不读取cleanup aggregate override：

```text
any selected target Failed     -> Failed
else any selected Retryable    -> Retryable
else all selected Delivered    -> Delivered
else                           -> Pending
```

selected set为空是source/plan relation error，不生成`Pending`。captured key必须存在于ownership guard在opening时固定的available set，observability ref必须等于handoff source ref。一个未选择subject的target即使`Failed`也不能影响该item；一个target选择多个material时，其progress会分别进入这些material item的推导，但仍只有一个target progress truth。

`HandoffMaterialDeliveryStatusItemSet`不读取`CapturedMaterialStatus`或`ObservabilityMaterialStatus`反推delivery，避免material lifecycle与progress循环证明。Step 9 UoW必须保证两者同步，query只展示committed结果；若未来对账发现不同步，应形成degraded / reconciliation input，不由view修复。

### 24.5 Independent relay status observations

```rust
/// material handoff view中一条独立event relay record的caller-safe状态观察。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffRelayStatusObservationItem {
    /// Sandbox-owned relay record identity。
    relay_ref: SandboxEventRelayRecordRef,
    /// relay row保存的closed source fact；必须是本view owning handoff fact。
    source_fact_ref: SandboxSourceFactRef,
    /// 固定为`SandboxMaterialHandoffChanged`的outbound event kind。
    event_kind: SandboxEventKind,
    /// 触发本relay record的committed handoff truth cursor。
    source_truth_cursor: SandboxTruthCursor,
    /// relay record当前canonical publication status。
    relay_status: SandboxEventRelayStatus,
    /// 已持久化的publisher attempt数量；pending时为零。
    publish_attempt_count: u32,
    /// failed、retryable或dead-letter的caller-safe原因。
    status_reason: Option<SandboxReason>,
    /// relay record与source truth同批建立的canonical time。
    recorded_at: Timestamp,
    /// current relay status生效时间。
    status_changed_at: Timestamp,
    /// 最近relay transition的audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl HandoffRelayStatusObservationItem {
    /// 从一条committed relay row的caller-safe字段构造并校验source/status relation。
    pub fn try_from_committed_fields(
        relay_ref: SandboxEventRelayRecordRef,
        source_fact_ref: SandboxSourceFactRef,
        event_kind: SandboxEventKind,
        source_truth_cursor: SandboxTruthCursor,
        relay_status: SandboxEventRelayStatus,
        publish_attempt_count: u32,
        status_reason: Option<SandboxReason>,
        recorded_at: Timestamp,
        status_changed_at: Timestamp,
        last_audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回relay record identity。
    pub fn relay_ref(&self) -> &SandboxEventRelayRecordRef;
    /// 返回relay row保存的closed source fact ref。
    pub fn source_fact_ref(&self) -> &SandboxSourceFactRef;
    /// 返回已校验的source handoff fact ref。
    pub fn source_handoff_ref(&self) -> &HandoffFactRef;
    /// 返回fixed material handoff event kind。
    pub fn event_kind(&self) -> SandboxEventKind;
    /// 返回source handoff truth cursor。
    pub fn source_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回canonical relay publication status。
    pub fn relay_status(&self) -> SandboxEventRelayStatus;
    /// 返回persisted publisher attempt count。
    pub fn publish_attempt_count(&self) -> u32;
    /// 返回caller-safe relay failure reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回relay record time。
    pub fn recorded_at(&self) -> &Timestamp;
    /// 返回relay status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近relay audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
}

/// 保存同一handoff、relay identity唯一且按source cursor / relay ref排序的relay observations。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HandoffRelayStatusObservationItemSet(Vec<HandoffRelayStatusObservationItem>);

impl HandoffRelayStatusObservationItemSet {
    /// 构造允许为空的available relay observation set；不把missing row补成`Pending`。
    pub fn try_for_handoff(
        handoff_ref: &HandoffFactRef,
        items: Vec<HandoffRelayStatusObservationItem>,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回按`(source truth cursor, relay ref)`排列的只读observations。
    pub fn as_slice(&self) -> &[HandoffRelayStatusObservationItem];
    /// 返回exact source truth cursor对应的全部relay observations；允许dead-letter后的新record。
    pub fn for_source_cursor(
        &self,
        source_truth_cursor: SandboxTruthCursor,
    ) -> Vec<&HandoffRelayStatusObservationItem>;
    /// 判断至少一条relay observation对应exact source truth cursor。
    pub fn contains_source_cursor(
        &self,
        source_truth_cursor: SandboxTruthCursor,
    ) -> bool;
    /// 判断set是否为空。
    pub fn is_empty(&self) -> bool;
    /// 判断是否存在尚未published的relay record。
    pub fn has_unpublished(&self) -> bool;
}
```

relay status field matrix固定为：

| relay status | publish attempt count | status reason | handoff implication |
|---|---:|---|---|
| `Pending` | `0` | `None` | source truth已提交并等待publisher，不改变handoff aggregate |
| `Published` | `> 0` | `None` | event relay已确认发布，不表示任何material target delivered |
| `Failed` | `> 0` | `Some` | publisher失败尚未完成retry/dead-letter分类，source truth保留 |
| `Retryable` | `> 0` | `Some` | relay job可按独立策略重试，handoff target progress不变 |
| `DeadLetter` | `> 0` | `Some` | 本relay record不再自动重试，handoff truth仍不回滚 |

每个item的`event_kind`必须恰好为`SandboxMaterialHandoffChanged`，source必须是`SandboxSourceFactRef::MaterialHandoff(source_handoff_ref)`的exact typed relation；不得接受其他source fact、generic object ref或从topic名称推断。`status_changed_at >= recorded_at`。set拒绝重复`relay_ref`，但允许同一source cursor在原record dead-letter后出现新的relay record；不得因cursor相同自动去重。set允许为空以表达安全但不完整的读取源；完整view要求至少存在一条`source_truth_cursor == current handoff truth cursor`的row，而不是只要求任意历史relay存在。

### 24.6 Handoff view lineage

```rust
/// handoff view source中可机械对账的committed handoff lineage refs。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffViewLineage {
    /// owning handoff fact identity。
    handoff_ref: HandoffFactRef,
    /// opening时消费的immutable ownership guard ref。
    ownership_guard_ref: HandoffOwnershipGuardRef,
    /// source observability material ref。
    observability_material_ref: ObservabilityMaterialRef,
    /// capture-source ref；terminal-source为`None`。
    capture_ref: Option<CaptureFactRef>,
    /// source controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// source owning context ref。
    context_ref: ControlledExecutionContextRef,
    /// source owning environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// source established boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// source isolation handle ref。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// source、plan与progress共用的canonical generation。
    generation_ref: ResourceRef,
}

impl MaterialHandoffViewLineage {
    /// 从同一committed handoff group复制named refs并拒绝local object identity碰撞。
    pub fn try_from_committed_fields(
        handoff_ref: HandoffFactRef,
        ownership_guard_ref: HandoffOwnershipGuardRef,
        observability_material_ref: ObservabilityMaterialRef,
        capture_ref: Option<CaptureFactRef>,
        run_ref: ControlledExecutionRunRef,
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        boundary_ref: CoherentBoundaryRef,
        isolation_handle_ref: IsolationEnvironmentHandleRef,
        generation_ref: ResourceRef,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回owning handoff fact ref。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回opening ownership guard ref。
    pub fn ownership_guard_ref(&self) -> &HandoffOwnershipGuardRef;
    /// 返回source observability material ref。
    pub fn observability_material_ref(&self) -> &ObservabilityMaterialRef;
    /// 返回capture-source ref。
    pub fn capture_ref(&self) -> Option<&CaptureFactRef>;
    /// 返回source run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回source context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回source environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回source boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回source isolation handle ref。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 判断source是否来自capture path。
    pub fn is_capture_source(&self) -> bool;
}
```

lineage中的local object refs底层resource identity必须两两不同；`generation_ref`是版本角色，不参加object identity碰撞判断。`capture_ref = None`只表示failed / terminated run的terminal observability source，不允许application通过缺失capture row把真实capture-source降格为terminal-source。source path必须从committed ownership guard / handoff fact relation复制，不能由query selector决定。

### 24.7 Committed handoff source snapshot

```rust
/// 从同一committed handoff group复制出的caller-safe view source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusSourceSnapshot {
    /// source handoff group的exact lineage。
    lineage: MaterialHandoffViewLineage,
    /// UoW为当前handed-off truth version分配的committed cursor。
    handoff_truth_cursor: SandboxTruthCursor,
    /// immutable complete required target plan。
    target_plan: HandoffTargetPlanStatusItemSet,
    /// opening ownership guard绑定的完整source captured material key set；terminal-source为空。
    source_material_keys: CapturedMaterialKeySet,
    /// 当前snapshot可安全读取的per-target progress rows；允许显式不完整。
    target_progress: HandoffTargetProgressStatusItemSet,
    /// progress完整时机械形成的complete source-material delivery set；不完整时为`None`。
    material_deliveries: Option<HandoffMaterialDeliveryStatusItemSet>,
    /// handoff fact当前canonical aggregate status。
    handoff_status: HandoffFactStatus,
    /// aggregate failed或cleanup-blocked时的caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// active cleanup override guard ref；非blocked aggregate为空。
    cleanup_guard_ref: Option<CleanupGuardRef>,
    /// 与本handoff source关联的available independent relay observations。
    relay_observations: HandoffRelayStatusObservationItemSet,
    /// handoff batch首次打开时间。
    opened_at: Timestamp,
    /// current aggregate status生效时间。
    status_changed_at: Timestamp,
    /// 最近handoff aggregate / progress transition audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
    /// application mapper读取committed group的observation time。
    observed_at: Timestamp,
}

impl MaterialHandoffStatusSourceSnapshot {
    /// 构造relation-checked committed source；允许missing progress / relay但拒绝未知row与truth矩阵损坏。
    pub fn try_new(
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
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回source handoff lineage。
    pub fn lineage(&self) -> &MaterialHandoffViewLineage;
    /// 返回current committed handoff truth cursor。
    pub fn handoff_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回immutable complete target plan。
    pub fn target_plan(&self) -> &HandoffTargetPlanStatusItemSet;
    /// 返回opening guard绑定的完整source captured material keys。
    pub fn source_material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回available target progress rows。
    pub fn target_progress(&self) -> &HandoffTargetProgressStatusItemSet;
    /// 返回progress完整时形成的material-specific delivery set。
    pub fn material_deliveries(&self) -> Option<&HandoffMaterialDeliveryStatusItemSet>;
    /// 返回canonical handoff aggregate status。
    pub fn handoff_status(&self) -> HandoffFactStatus;
    /// 返回aggregate caller-safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回active cleanup guard ref。
    pub fn cleanup_guard_ref(&self) -> Option<&CleanupGuardRef>;
    /// 返回independent relay status observations。
    pub fn relay_observations(&self) -> &HandoffRelayStatusObservationItemSet;
    /// 返回handoff open time。
    pub fn opened_at(&self) -> &Timestamp;
    /// 返回aggregate status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近handoff transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回committed group observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 返回已校验等于source key set的target plan captured material key union。
    pub fn available_material_keys(&self) -> CapturedMaterialKeySet;
    /// 判断available progress是否exact覆盖完整target plan。
    pub fn has_complete_progress_coverage(&self) -> bool;
    /// 判断material delivery set是否与plan subject及progress形成完整机械对账。
    pub fn has_complete_material_delivery_coverage(&self) -> bool;
    /// 判断至少一条relay row对应current handoff truth cursor。
    pub fn has_current_relay_observation(&self) -> bool;
    /// 判断progress、material delivery、aggregate与relay coverage是否足以形成non-degraded view。
    pub fn is_complete_read_source(&self) -> bool;
}
```

`try_new`的验证顺序固定如下，不能由application选择性跳过：

1. `source_material_keys`必须来自opening ownership guard / matching source capture的committed key set；`capture_ref = None`时必须为空，`capture_ref = Some`时允许为空但不得由plan反推。plan必须非空，全部item的`handoff_ref`等于lineage；每个selection中的observability ref若存在必须等于lineage source ref。
2. plan captured key union必须与`source_material_keys`双向exact相等，且至少一个target必须选择lineage的exact observability material ref。任何unknown key、uncovered source key、missing observability selection均为integrity error，不得走degraded factory。`available_material_keys()`只返回已通过该对账的plan union。
3. progress只能包含plan内target，且每项handoff/kind/ref/selection与对应plan item相等；unknown、duplicate或selection漂移直接报错。缺失plan row允许进入安全degraded source，但不得补成`Pending`。
4. progress完整时constructor必须调用`HandoffMaterialDeliveryStatusItemSet::try_complete(...)`，从`source_material_keys`、唯一observability ref和exact progress机械生成`Some(material_deliveries)`；progress不完整时固定为`None`，不得以available rows推导看似成功的partial delivery。application不能传入delivery kind或预组装delivery set。
5. aggregate的cleanup / reason字段先按下表校验；progress完整时再按`BlockedByCleanupGuard > Failed > Retryable > Delivered > Pending`精确对账。progress不完整时aggregate derivation不可证明，source必须degraded，但已提交canonical aggregate字段仍原样保留。
6. relay set中每项source handoff均等于lineage，event kind固定，status matrix成立。至少一条row匹配`handoff_truth_cursor`才形成完整relay coverage；只有旧cursor row或空set均不得伪造成current `Pending`。
7. handoff `status_changed_at >= opened_at`；每个available progress的`attempt_started_at`（若有）和`status_changed_at`不得早于`opened_at`；每条relay的`recorded_at`和`status_changed_at`不得早于`opened_at`。`observed_at`不得早于handoff、任一available progress / relay status change或record time。cursor由同次committed-group metadata复制，不从timestamp、repository version或relay ref生成。

aggregate field relation：

| handoff status | complete progress relation | cleanup guard ref | status reason |
|---|---|---|---|
| `Pending` | derive `Pending` | `None` | `None` |
| `Delivered` | all target progress `Delivered` | `None` | `None` |
| `Failed` | at least one target `Failed` | `None` | `Some`且等于plan顺序首个failed target reason |
| `Retryable` | no failed且至少一个`Retryable` | `None` | `None` |
| `BlockedByCleanupGuard` | 任意完整或不完整progress；不重写progress | `Some` | `Some` |

`BlockedByCleanupGuard`只证明已提交handoff aggregate保存了cleanup override ref和safe reason；view不得加载或调用`CleanupGuard`来重评。source snapshot也不读取`CapturedMaterialStatus` / `ObservabilityMaterialStatus`反证delivery；该跨owner一致性属于Step 11 reconciliation输入，不是query repair。

`handoff_truth_cursor`的唯一来源是UoW对当前accepted handoff truth change分配并随committed snapshot linkage保存的`SandboxTruthCursor`。回归后的Step 7 / 11必须让status snapshot或exact handoff query reader原子返回该cursor、fact、plan、progress和relay linkage；禁止application对handed-off row做latest cursor scan后拼装。

### 24.8 `MaterialHandoffStatusViewError`

```rust
/// material handoff view的lineage、plan、progress、delivery、relay或degraded关系失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MaterialHandoffStatusViewError {
    /// handoff view lineage中的Sandbox-local object refs发生identity碰撞。
    MaterialHandoffViewLineageIdentityCollision,
    /// target plan为空、包含EventRelay / Other或item kind / source / selection关系不合法。
    HandoffTargetPlanRelationInvalid {
        /// relation无法成立的closed target kind。
        target_kind: HandoffTargetKind,
    },
    /// target plan item不属于source handoff lineage。
    HandoffTargetPlanLineageMismatch,
    /// target plan出现重复external target identity。
    DuplicateHandoffTargetPlanItem {
        /// 重复target的closed kind。
        target_kind: HandoffTargetKind,
    },
    /// target progress row不属于plan或其kind / ref / selection与plan不一致。
    HandoffTargetProgressPlanMismatch,
    /// available progress set出现重复target identity。
    DuplicateHandoffTargetProgressItem {
        /// 重复progress row的closed target kind。
        target_kind: HandoffTargetKind,
    },
    /// target progress status与attempt、receipt、reason、retry age或time不满足closed matrix。
    HandoffTargetProgressStatusRelationInvalid {
        /// relation无法成立的canonical progress status。
        status: HandoffTargetProgressStatus,
    },
    /// delivered receipt保存的target kind / ref与对应plan item不一致。
    HandoffTargetProgressReceiptMismatch {
        /// receipt无法匹配的closed target kind。
        target_kind: HandoffTargetKind,
    },
    /// material-specific subject没有被target plan选择或引用了非source material。
    HandoffMaterialSubjectSelectionMismatch,
    /// plan captured key union与opening guard绑定的完整source material keys不一致。
    HandoffSourceMaterialCoverageMismatch,
    /// target plan没有选择exact source observability material ref。
    HandoffSourceObservabilitySelectionMissing,
    /// material delivery factory收到不完整progress coverage。
    HandoffMaterialDeliveryProgressIncomplete,
    /// material delivery set的subject缺失、重复、增项或顺序不满足完整source coverage。
    HandoffMaterialDeliveryCoverageMismatch,
    /// material delivery item的selected target refs或derived kind与plan / progress不一致。
    HandoffMaterialDeliveryRelationInvalid {
        /// 无法由selected progress证明的finite delivery kind。
        delivery_kind: HandoffMaterialDeliveryKind,
    },
    /// relay row的source fact不是本view owning handoff或event kind不匹配。
    HandoffRelaySourceRelationInvalid,
    /// relay observation set出现重复relay record identity。
    DuplicateHandoffRelayObservation,
    /// relay status与attempt count、reason或timestamp不满足closed matrix。
    HandoffRelayStatusRelationInvalid {
        /// relation无法成立的canonical relay status。
        status: SandboxEventRelayStatus,
    },
    /// handoff aggregate status与progress、cleanup ref或reason不满足fixed precedence。
    MaterialHandoffAggregateStatusRelationInvalid {
        /// relation无法成立的canonical handoff aggregate status。
        status: HandoffFactStatus,
    },
    /// source snapshot的current truth cursor没有matching relay observation。
    MaterialHandoffCurrentRelayObservationMissing,
    /// handoff、progress、relay或view observation timestamp不满足monotonic relation。
    MaterialHandoffViewTimestampInvalid,
    /// committed source无法形成完整read view，但caller未走degraded factory。
    MaterialHandoffViewSourceIncomplete,
    /// degraded factory收到空reason set。
    MaterialHandoffViewDegradedReasonsEmpty,
    /// complete factory不允许携带degraded reasons或degraded source marker。
    MaterialHandoffViewDegradedReasonsUnexpected,
    /// view ref不是material handoff status view的named kind。
    MaterialHandoffStatusViewRefKindMismatch,
}
```

允许安全降级的只有“已验证source中的row coverage不完整或projection / relay linkage stale”：缺失progress row、缺失current relay row、或上层projection明确stale。unknown target、wrong source、duplicate identity、status field relation损坏、聚合状态与完整progress矛盾、timestamp倒退都属于typed integrity error，不能靠degraded reason掩盖。错误payload不得携带target URL、material locator、raw receipt、publisher response、topic、path、artifact/evidence identity、SQL或外部错误文本。

### 24.9 `MaterialHandoffStatusView`

```rust
/// 面向caller的handoff aggregate、target progress、material delivery与relay只读状态视图。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffStatusView {
    /// 本read model snapshot的Sandbox-local typed identity。
    view_ref: MaterialHandoffStatusViewRef,
    /// committed handoff group的relation-checked lineage。
    lineage: MaterialHandoffViewLineage,
    /// current accepted handoff truth version的committed cursor。
    handoff_truth_cursor: SandboxTruthCursor,
    /// immutable complete required target plan。
    target_plan: HandoffTargetPlanStatusItemSet,
    /// opening ownership guard绑定的完整source captured material key set。
    source_material_keys: CapturedMaterialKeySet,
    /// caller-safe available per-target progress rows。
    target_progress: HandoffTargetProgressStatusItemSet,
    /// complete progress时的material-specific delivery set；degraded缺row时为`None`。
    material_deliveries: Option<HandoffMaterialDeliveryStatusItemSet>,
    /// canonical handoff fact aggregate status；不另建visible status。
    handoff_status: HandoffFactStatus,
    /// aggregate failed或cleanup-blocked的caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// active cleanup override guard ref；不加载guard本体。
    cleanup_guard_ref: Option<CleanupGuardRef>,
    /// independent event relay status observations。
    relay_observations: HandoffRelayStatusObservationItemSet,
    /// read source不完整、stale或projection缺口的caller-safe reasons。
    degraded_reasons: Vec<SandboxReason>,
    /// handoff batch首次打开时间。
    opened_at: Timestamp,
    /// current aggregate status生效时间。
    status_changed_at: Timestamp,
    /// 最近handoff transition audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
    /// view mapper observation time。
    observed_at: Timestamp,
}

impl MaterialHandoffStatusView {
    /// 从完整committed handoff source构造non-degraded view；不查询或修改任何truth。
    pub fn from_committed_snapshot(
        view_ref: MaterialHandoffStatusViewRef,
        source: MaterialHandoffStatusSourceSnapshot,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 从安全但不完整或stale的committed source构造degraded view；不改变canonical aggregate。
    pub fn from_degraded_snapshot(
        view_ref: MaterialHandoffStatusViewRef,
        source: MaterialHandoffStatusSourceSnapshot,
        degraded_reasons: StatusViewDegradedReasonSet,
    ) -> Result<Self, MaterialHandoffStatusViewError>;

    /// 返回material handoff status view identity。
    pub fn view_ref(&self) -> &MaterialHandoffStatusViewRef;
    /// 返回committed handoff group lineage。
    pub fn lineage(&self) -> &MaterialHandoffViewLineage;
    /// 返回current committed handoff truth cursor。
    pub fn handoff_truth_cursor(&self) -> SandboxTruthCursor;
    /// 返回immutable complete target plan。
    pub fn target_plan(&self) -> &HandoffTargetPlanStatusItemSet;
    /// 返回opening guard绑定的完整source captured material keys。
    pub fn source_material_keys(&self) -> &CapturedMaterialKeySet;
    /// 返回available per-target progress rows。
    pub fn target_progress(&self) -> &HandoffTargetProgressStatusItemSet;
    /// 返回complete progress时的material-specific delivery set。
    pub fn material_deliveries(&self) -> Option<&HandoffMaterialDeliveryStatusItemSet>;
    /// 返回canonical handoff aggregate status。
    pub fn handoff_status(&self) -> HandoffFactStatus;
    /// 返回aggregate caller-safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回active cleanup override guard ref。
    pub fn cleanup_guard_ref(&self) -> Option<&CleanupGuardRef>;
    /// 返回independent relay status observations。
    pub fn relay_observations(&self) -> &HandoffRelayStatusObservationItemSet;
    /// 返回caller-safe degraded reasons；完整view为空。
    pub fn degraded_reasons(&self) -> &[SandboxReason];
    /// 返回handoff open time。
    pub fn opened_at(&self) -> &Timestamp;
    /// 返回aggregate status change time。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近handoff transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回view observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 判断view是否携带至少一个degraded reason。
    pub fn is_degraded(&self) -> bool;
    /// 只按已提交cleanup override关系判断当前aggregate是否阻断cleanup。
    pub fn blocks_cleanup(&self) -> bool;
    /// 仅在canonical aggregate为Delivered、progress/delivery完整且view非degraded时返回true。
    pub fn can_show_all_targets_delivered(&self) -> bool;
    /// 判断至少一个current-cursor relay record仍未published。
    pub fn has_current_unpublished_relay(&self) -> bool;
}
```

`from_committed_snapshot`只接受`source.is_complete_read_source() == true`，把`degraded_reasons`固定为空并逐字段移动checked source。它可以展示`Pending | Failed | Retryable | BlockedByCleanupGuard`，因为这些是canonical handoff truth，不是query degradation。`from_degraded_snapshot`必须收到non-empty ordered-unique reasons；source可以因progress / current relay缺失而不完整，也可以完整但上层projection明确stale。两种factory都不得调用source repository、relay repository、adapter、`begin_target_attempt`、`apply_target_observation`、`CleanupGuard`、publisher、refresh、rebuild或reconciliation。

`blocks_cleanup()`只在`handoff_status == BlockedByCleanupGuard`、`cleanup_guard_ref.is_some()`且`status_reason.is_some()`时返回true；checked factory已经保证三者关系。它不能把`Pending | Failed | Retryable`重新解释为cleanup guard状态。`can_show_all_targets_delivered()`要求aggregate为`Delivered`、全部plan progress与material delivery为`Delivered`、current relay coverage存在且`is_degraded() == false`；它仍不证明artifact、runtime、runner、observability或investigation formal truth成立。`has_current_unpublished_relay()`只过滤`source_truth_cursor == handoff_truth_cursor`的relay items，并把`Pending | Failed | Retryable | DeadLetter`视为未published；该helper不触发publish或retry。

### 24.10 View field source closure

| view / field group | exact source | missing / invalid handling | forbidden substitute |
|---|---|---|---|
| capture `view_ref` | query/projection id generator产生的`CaptureSummaryViewRef` | wrong kind -> `CaptureSummaryViewRefKindMismatch` | capture ref复用、字符串拼接、repository row id |
| capture lineage / guard | 同一committed capture group的fact getters与guard ref | wrong lineage / collision -> typed error | caller selector、latest run、projection旧ref |
| capture status / disposition / reasons / times | immutable `CaptureFact` exact fields | closed matrix损坏 -> typed error | visible enum、adapter error text、query重评 |
| capture output / material / gaps | 同一snapshot的body-free output summary、expected keys、available material rows与committed gaps | missing known row -> degraded；unknown row / count corruption -> error | locator、path、URL、artifact/evidence ref、重算gap |
| capture observability | fact预绑定ref对应的capture-source `ObservabilityMaterial` row | row missing -> degraded；terminal-source / wrong ref -> error | log存在性、observability store receipt、optional fake success |
| handoff `view_ref` | query/projection id generator产生的`MaterialHandoffStatusViewRef` | wrong kind -> `MaterialHandoffStatusViewRefKindMismatch` | handoff ref复用、字符串拼接 |
| handoff lineage / truth cursor | 同一committed handoff group的fact / guard refs与UoW committed cursor linkage | collision / mixed snapshot -> typed error | timestamp、repository version、relay ref、latest cursor scan |
| target plan / progress | immutable `HandoffTargetSet`与同一snapshot available progress rows | missing planned row -> degraded；unknown / duplicate / field mismatch -> error | missing补`Pending`、last receipt、aggregate-only row |
| material deliveries | source snapshot constructor从完整plan/progress纯推导 | progress不完整 -> `None` + degraded；selection/coverage mismatch -> error | caller传delivery kind、material lifecycle反推、无关target失败传播 |
| aggregate / cleanup override | committed `HandoffFactStatus`、safe reason与stored cleanup guard ref | 完整progress不匹配 -> error；不完整progress -> degraded | 调用`CleanupGuard`、比较cleanup status文本、reason解析 |
| relay observations | exact handoff source的`SandboxEventRelayRecord` rows与source cursor | current cursor row missing -> degraded；wrong source/event/status -> error | 把`EventRelay`当target、publisher ack改progress、topic推断 |
| degraded reasons | visibility-safe application/projection mapper构造的`StatusViewDegradedReasonSet` | complete factory必须为空；degraded factory必须非空 | SQL / SDK / backend raw error、existence-sensitive ref |
| observed time / audit | application clock + committed owner audit refs | non-monotonic -> typed error | backend timestamp冒充view time、post-query补audit |

### 24.11 Query surface、degraded 与 no-write closure

| source / access condition | factory / surface | preserved fields | prohibited behavior |
|---|---|---|---|
| complete capture read source，canonical status任意 | `CaptureSummaryView::from_committed_snapshot` | complete / partial / failed / unavailable原样展示 | 只允许`Complete`建view、把domain failure改成degraded |
| capture known rows不完整或projection stale | `CaptureSummaryView::from_degraded_snapshot` | 全部已验证known rows、canonical fact status与reasons | missing row补empty/success、refresh / capture retry |
| complete handoff read source，aggregate status任意 | `MaterialHandoffStatusView::from_committed_snapshot` | plan、全progress、deliveries、aggregate、cleanup override、current relay rows | 只有Delivered建view、relay失败覆盖aggregate |
| handoff progress / current relay缺口或projection stale | `MaterialHandoffStatusView::from_degraded_snapshot` | complete plan、available progress、canonical aggregate、known relay rows | missing progress补Pending、partial delivery推导、publish / retry |
| unknown row、wrong source、duplicate、status matrix或timestamp损坏 | typed `*ViewError` | 不构造view | degraded reason掩盖integrity error、query内repair |
| access合法但对应capture / handoff truth不存在 | Step 8 `Empty | Unavailable` query surface，不构造伪view | no body；visibility-safe reason由application owner映射 | fake ref、all-empty object、从run status伪造capture/handoff |
| caller不可见或存在性敏感 | Step 8 `NotVisible` query surface，不构造view | no existence-sensitive body | 返回typed ref、degraded reason泄露对象存在性 |

两个view及其source helper的public callable只包含fallible pure constructor、getter和pure predicate。以下副作用调用在batch 6 view contract中必须为零：repository save、write UoW begin、adapter call、target attempt、capture retry、handoff retry、relay publish、cleanup / release / reaper、refresh、projection rebuild、reconciliation repair、domain transition。application query flow即使检测到stale / missing，也只能返回typed surface或degraded view，不能借“补全读取”触发写入。

### 24.12 Downstream revalidation obligations

| downstream owner | required exact revalidation | prohibited fallback |
|---|---|---|
| Step 7 contracts / application read input | 定义能承载两种source snapshot全部字段的contracts-only mapper input；status snapshot读取必须保留同一committed group与truth cursor | view直接接收domain aggregate、service从多个latest reads拼装 |
| Step 7 / 11 repository | exact capture group读取返回fact、expected keys、available material/observability rows；exact handoff读取返回fact、plan、progress、truth cursor与relay linkage | query扫描locator、只返回aggregate、cursor二次查询、missing row补默认 |
| Step 8 Query DTO | `CaptureSummaryViewDto` / `MaterialHandoffStatusViewDto`逐字段映射canonical status、optional/degraded语义、nested item schema；contracts-owned carrier不得复制为domain-only DTO helper | `VisibleCaptureStatus` / `VisibleHandoffStatus`复活、raw `Vec<CapturedMaterialRef>` |
| Step 9 Query flow | visibility check -> one committed snapshot read -> checked source -> complete/degraded factory -> DTO；write set与adapter call set均为0 | query触发refresh、retry、cleanup、publisher或reconciliation |
| Step 10 state matrix | 两个view/source/item均排除为persisted状态机；`HandoffMaterialDeliveryKind`继续作为pure derived kind | 为view/degraded/relay observation新增状态机 |
| Step 11 persistence / consistency | handoff truth change、cursor、relay row和snapshot linkage同一accepted UoW；projection stale可显式降级且不能伪造current relay coverage | relay eventual row缺失仍返回non-degraded、repository version充当truth cursor |
| Step 12 error mapping | integrity error -> internal/corruption-safe path；missing/stale -> dedicated degraded mapping；not-visible不泄露ref | `_ => Internal`吞新增variant、raw cause进入`SandboxReason` |
| Step 13 concurrency | query snapshot isolation防止plan/progress/cursor/relay跨版本混读；retry不改变既有view snapshot | 分别latest-load后比较timestamp、query内锁后写repair |
| Step 15 observability / audit | 记录view degraded kind、source coverage counts与no-write violation，不记录material locator、receipt body或existence-sensitive ref | telemetry body冒充observability material、日志证明query正确 |
| Step 16 /正式`05` | complete / partial / failed / unavailable capture view；五aggregate、五progress、material-specific隔离、relay独立、degraded与no-write切口 | 只测happy path或把静态扫描写成真实测试结果 |
| Step 17 /正式`07` | 受影响boundary scope必须包含contracts carrier、view/source mapper、repository snapshot与query no-write修复 | implementation agent跨boundary私补carrier或要求设计者再补view字段 |

### 24.13 Batch 6 static design audit

| check | expected | observed static design result |
|---|---:|---:|
| canonical inventory item | #24 | 1 family closed；两个named public views |
| batch 6 public declaration set | 24 | 24 unique；missing 0；duplicate 0 |
| contracts-owned support overlay declarations | 10 types / 8 families | 10 unique；missing 0；duplicate 0 |
| checked source snapshots | 2 | capture + handoff，各有complete-source predicate |
| complete / degraded factories | 4 | 两个view各2；source incomplete与reason empty均fail closed |
| canonical status owner新增 | 0 | 继续复用39个shared status enums；无visible capture/handoff enum |
| relay source / current cursor relation | 2 exact cuts | closed source fact + `SandboxMaterialHandoffChanged`；current cursor coverage |
| `contracts -> domain` public field dependency | 0 | overlay carrier / refs / status均contracts-owned；view不接收domain aggregate |
| Rust code block brace imbalance | 0 | 0 |
| Markdown fence imbalance | 0 | 0 |
| public type/callable/variant/named field/payload-field Rustdoc missing | 0 | 0 / 0 / 0 / 0 / 0 |
| raw body / path / provider / formal evidence fields added | 0 | 0 |
| unresolved batch 6 schema / owner diagnostic | 0 | `SBX-DDD-VIEW-OWNER-6R03-001` resolved in this batch |
| cross-step contracts file path difference | 1 internal blocker | `SBX-DDD-CONTRACTS-FILE-6R03-001`；不影响本批8组carrier按Step 4既有`refs.rs`落位，但阻塞batch 7 / `6R-03`最终closure |

审计脚本位于`/tmp/audit_l4_sandbox_batch6.pl`，仅扫描当前设计文档的声明、token、brace、fence、Rustdoc和forbidden field pattern。它不是实现源码、编译器、测试套件、runtime run或evidence producer；本表不声明Rust编译、单元 / 集成测试、真实run、commit、evidence alias或验收签署。

---

## 25. Batch 6 门禁快照（已由 batch 7 复核）

本节保留 batch 6 停审时的原始门禁快照，其中“batch 7 pending”和文件路径 blocker open 是当时事实。当前结论以 §26 为准；不得把本节旧恢复块重新写回项目台账。

| gate | 当前结果 |
|---|---|
| 标准 / 上游 / boundary references 已读取 | pass |
| 12/12 `S6T-03-*` registry 映射 | mapped to 24-item inventory；#1~#23已按既有确认消费；#24 views static contract closed_wait_user_review |
| current / historical effect 分层 | pass |
| policy / tools / runtime / member / artifact / observability boundary | pass |
| policy object contracts | batch 2 completed；owner-ref / priority / freshness audit pass |
| run / handoff forward contracts | run batch 3 completed；identity bundle、checked-age permit、exact lifecycle/error与10项累计`6R-04` forward methods已登记，其中handoff新增2项 |
| capture / handoff object contracts | capture batch 4 completed_review_confirmed；observability / handoff batch 5 completed_review_confirmed；views batch 6 completed_wait_user_review |
| view owner internal diagnostic | `SBX-DDD-VIEW-OWNER-6R03-001 resolved_in_6r03_batch_6`；10/10 overlay declarations unique；contracts反向依赖为0 |
| contracts file path internal blocker | `SBX-DDD-CONTRACTS-FILE-6R03-001 open_for_6r03_batch_7_closure_audit`；无新增L1/L2 blocker；`6R-03`不得在差集关闭前标记完成 |
| batch 6 static design audit | 24/24 view declarations；10/10 overlay declarations；brace/fence/Rustdoc/forbidden-field findings均0 |
| closure audit | pending batch 7 |
| 正式 `03~07` | unchanged / invalidated by DesignReopen |
| implementation | `CB-SBX-01A blocked / wait_design` |

```text
historical_document_at_batch_6 = 03-详细设计.md
historical_step_at_batch_6 = Step 6 regression / 6R-03
historical_gate_status_at_batch_6 = batch_6_views_completed_wait_user_review
historical_next_allowed_action_at_batch_6 = wait_user_review_before_6R-03_batch_7_closure_audit
historical_formal_03_to_07_at_batch_6 = unchanged / invalidated_by_design_reopen
historical_implementation_at_batch_6 = CB-SBX-01A blocked / wait_design
```

No new L1/L2 semantic blocker was found. One internal Step 4 / Step 6 file-layout blocker, `SBX-DDD-CONTRACTS-FILE-6R03-001`, is open for batch 7 closure audit. `BLK-SBX-CANONICAL-001` and `BLK-SBX-VERSION-001` remain implementation gates and do not permit string comparison, raw material persistence, generic refs, or weak launch fallback.

---

## 26. Batch 7 closure audit 与审查门禁

### 26.1 审计范围与路径 owner 收敛

batch 7没有新增对象、字段、view、状态、selector或forward method。它只对batch 2~6已形成的current contract执行全量关闭审计，并修复Step 4 planned file responsibility与Step 6 shared registry之间的文件路径冲突。

| 审计对象 | current owner / source | batch 7结论 | 禁止回归 |
|---|---|---|---|
| shared refs / kinds / selectors / statuses / markers | `crates/contracts/src/refs.rs` | 与Step 4 planned tree及`L1-governance` / `L1-artifact`参考粒度一致 | 不创建独立kind、status、state或marker module；不做同名re-export alias |
| protocol metadata | `crates/contracts/src/metadata.rs` | 只组合core metadata | 不复制actor、timestamp、trace、idempotency类型 |
| public views | `crates/contracts/src/views.rs` | 只拥有view / checked source DTO，复用`refs.rs` carrier | 不依赖domain object或复制domain-only carrier |
| public errors | `crates/contracts/src/errors.rs` | `ContractError`与caller-safe public kind owner保持唯一 | 不承载domain transition或raw adapter cause |
| protocol family files | `commands.rs`;`queries.rs`;`events.rs`;`jobs.rs`;`receipts.rs` | 继续只拥有对应DTO / payload / receipt | 不复制canonical shared enum形成wire-only第二真相源 |

`SBX-DDD-CONTRACTS-FILE-6R03-001`的关闭选择是“收敛到既有`refs.rs`”，不是扩张planned tree。Step 4的`refs.rs`职责已定向回写为typed refs、ids、reason、shared finite enum与marker；七crate、十个contracts planned source file、Cargo依赖和业务owner均未变化。

### 26.2 Inventory、registry、状态与forward dependency结果

| check | expected | observed static design result | unresolved |
|---|---:|---:|---:|
| `6R-03` canonical inventory | 24 | 24；#1~#24均非pending | 0 |
| `S6T-03-*` registry | 12 | 12；每个ID唯一 | 0 |
| batch 6 view declarations | 24 | 24 unique | 0 |
| contracts-owned support overlay declarations | 10 | 10 unique | 0 |
| shared semantic kinds | 8 | 8 unique | 0 |
| protocol selector variants | 55 | Command 10；Query 13；Consumer 9；Event 13；Job 10 | 0 |
| canonical shared status enum | 39 | 39 unique；`HandoffTargetProgressStatus` owner唯一 | 0 |
| exact `6R-04` forward dependencies | 10 | `6R-02` 4；run 4；handoff 2 | 0 |
| current unplanned contracts path / module owner | 0 | 0 | 0 |
| Step 4 planned contracts source files | 10 | 10；`refs.rs`明确承接shared enum | 0 |
| public type / callable / variant / named field / payload-field Rustdoc missing | 0 | 0 / 0 / 0 / 0 / 0 | 0 |
| Rust brace / Markdown fence findings | 0 | 0 | 0 |
| batch 7 control token missing | 0 | 0 | 0 |

exact ten-item forward dependency set保持为：

1. `LeaseRecord::supports_orphan_suspicion_for`。
2. `FailureClassification::blocks_boundary_for`。
3. `CleanupGuard::permits_release_for`。
4. `CleanupGuard::permits_context_closure_for`。
5. `LeaseRecord::require_active_for_handle`。
6. `FailureClassification::require_run_failure_basis`。
7. `ControlFact::require_run_termination_basis`。
8. `RedlineContainment::require_run_termination_basis`。
9. `CleanupGuard::require_handoff_block`。
10. `CleanupGuard::require_handoff_unblocked`。

这些method在`6R-03` batch 7只固定`6R-04`不可弱化的owner、名称、参数关系和consumer；当时没有把forward declaration误记为对象已实现。当前动态关闭状态以本表为准：

| forward item | `6R-03` placeholder output | current canonical output | current state |
|---:|---|---|---|
| #5 `LeaseRecord::require_active_for_handle` | checked remaining window | `Result<NonZeroU64, LeaseRecordError>`；exact body在failure-cleanup-read §13.2，closure audit在§13A.5 | closed_in_6r_04_batch_3_review_confirmed |
| #6 `FailureClassification::require_run_failure_basis` | `Result<&SandboxReason, ...>` | `Result<FailureRunBasis, FailureClassificationError>`，包含checked lineage / kind / impact / reason / audit | closed_in_6r_04_batch_2_review_confirmed |
| #7 `ControlFact::require_run_termination_basis` | `Result<&SandboxReason, ...>` | `Result<ControlTerminationBasis, ControlFactError>`，包含checked target / kind / effect / reason / source / audit | closed_in_6r_04_batch_2_review_confirmed |
| #8 `RedlineContainment::require_run_termination_basis` | `Result<&SandboxReason, ...>` | `Result<RedlineRunBasis, RedlineContainmentError>`，包含exact containment / context / run / boundary / handle / generation / kind / impact / reason / audit | closed_in_6r_04_batch_4_wait_user_review |
| #9/#10 cleanup handoff methods | checked block / unblock observation | `require_handoff_block -> HandoffCleanupBlockObservation`；`require_handoff_unblocked -> Result<(), CleanupGuardError>`，均绑定exact handoff / context / run / guard status | closed_in_6r_04_batch_4_wait_user_review |

原§14.4的borrowed-reason placeholder继续作为已确认historical forward input保留，不是current callable truth；#6/#7/#8均已由typed basis取代。run consumer必须复制typed basis，不得恢复为只借用reason或在caller侧拼lineage。handoff consumer只能使用#9/#10 exact checked output，不得比较cleanup status或传`cleanup_blocked: bool`。该动态更新不改写`6R-03`已确认对象正文。

### 26.3 Blocker disposition

| blocker | batch 7状态 | 影响 |
|---|---|---|
| `SBX-DDD-CONTRACTS-FILE-6R03-001` | `resolved_in_6r03_batch_7` | Step 4 / Step 6 current contracts path差集为0；实现者没有新增module裁量 |
| `SBX-DDD-VIEW-OWNER-6R03-001` | `resolved_in_6r03_batch_6_revalidated_batch_7` | 10/10 support declarations唯一，`contracts -> domain` public dependency为0 |
| `SBX-DDD-STATE-INVENTORY-6R03-001` | `downstream_revalidation_pending` | batch 7只证明39个shared enum owner唯一；historical 29状态机 /30 enum到30状态机 /31 enum的重验仍由Step 10承担 |
| `SBX-DDD-GRANULARITY-STEP6-001` | `open_progress_6r_04_batch_4_cleanup_redline_completed_wait_user_review` | `6R-04`累计闭合10个named type、5个support family与10项forward method；batch 4待审，batch 5~7与`6R-05~07`尚未完成，Step 7继续blocked |
| `BLK-SBX-CANONICAL-001`;`BLK-SBX-VERSION-001` | open implementation gates | 不阻塞本批设计审查；继续阻塞受影响implementation Activation |
| 新L1 / L2 semantic blocker | none_found | 无上游升级动作 |

### 26.4 静态审计边界

审计脚本位于`/tmp/audit_l4_sandbox_batch7.pl`。它只扫描指定设计中间产物中的declaration、inventory、registry、selector、status、forward method、planned path、Rustdoc、brace、fence与control token；它不是Rust编译器、测试套件、runtime runner或evidence producer。batch 7没有声明实现代码、编译、单元 / 集成测试、真实run、commit、evidence alias、验收签署或测试结果。

### 26.5 当前停审点

| gate | 当前结果 |
|---|---|
| `6R-03`内容完整 | 是；batch 2~6对象正文与batch 7 closure audit均完成 |
| `6R-03`用户审查 | 已确认并由`6R-04`消费 |
| `6R-04`当前状态 | batch 4 cleanup / redline正文、reserved release / failure extension与closure audit已完成待审；确认后只允许进入batch 5 reference / projection / derived |
| 正式`03~07` | unchanged / invalidated by DesignReopen |
| implementation | `CB-SBX-01A blocked / wait_design` |
| 是否需要提交 | 否；用户未要求 |

```text
document = 03-详细设计.md
step = Step 6 regression / 6R-04
status = batch_4_cleanup_redline_completed_wait_user_review
next_allowed_action = wait_user_review_before_batch_5_reference_projection_derived
formal_03_to_07 = unchanged / invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
```

当前恢复入口是`03_ddd_step_06_object_contracts_failure_cleanup_read.md` §14A。用户确认batch 4后只允许写batch 5 reference / projection / derived正文；不得直接进入batch 6~7、Step 7或修改正式`03~07`。

---

## EOF Current Object Overlay: `S7-03B` launch failure identity recovery

> 本节是 Step 7 lifecycle port 回归对 `ControlledExecutionRun` 的窄幅 current overlay。它只补齐 `MUT-G04` 已声明但未
> 展开的 launch recovery relation，不新增 domain root、repository、status、public protocol或 callable。§14 中与本节冲突的
> 两身份 bundle、无 prebound failure identity 的 run shape 及其 field matrix 均按 historical material 处理。

### 27.1 缺口与 owner 裁决

`MUT-G04` 要求 launch correlation 在 external call 前可持久化恢复，`MUT-G05` 又允许 typed terminal launch observation
原子创建 `FailureClassification` 并把 `Preparing` run 推进为 `Failed`。原 §14 只预生成 run / capture identity：进程若在
backend 返回 terminal failure 后、failure UoW 提交前中断，恢复器只能重新分配 `FailureClassificationRef`，从而可能为同一
launch terminal fact创建第二身份。以下位置均不能承担该关系：

| rejected carrier | rejection reason |
|---|---|
| `SandboxIdempotencyRecord` | current schema只拥有 reservation lifecycle和final stored linkage；不得加入 operation-specific launch字段。 |
| `SandboxAuditTrace` | append-only source linkage，不是 mutable attempt owner，也不能作为 crash recovery identity allocator。 |
| transient `LaunchControlledRunRequest` | 进程内 value；不能作为跨进程恢复真相源。 |
| eager `FailureClassification::pending` | 正常成功 launch 会留下错误的 `PendingInput` failure truth，并扩张 failure lifecycle。 |

current owner固定为已有 `ControlledExecutionRun` recovery root：在 `Preparing` 期间内嵌一个预生成 failure candidate ref，
由既有 `ControlledExecutionRunRepository` 随完整 run row创建和CAS保存。它不是独立 object、不是 pending classification，
没有独立 repository ref或status。terminal launch failure把同一 ref移动到 formal classification / run terminal basis；成功或
control/redline终结则关闭候选关系而不创建 failure truth。

### 27.2 Identity bundle、permit 与 run field overlay

```rust
/// 把同一次 run preparation 预生成的 run、capture与launch-failure identities绑定为不可拆分输入。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledRunIdentityBundle {
    /// 本 attempt 唯一生成的 controlled run ref。
    run_ref: ControlledExecutionRunRef,
    /// 本 attempt 为该 run 唯一预生成的 capture fact ref。
    capture_ref: CaptureFactRef,
    /// 本 attempt 为 typed launch terminal failure 唯一预生成的 classification ref。
    launch_failure_ref: FailureClassificationRef,
}

impl ControlledRunIdentityBundle {
    /// 从同一次 identity-allocation step构造bundle；三个底层resource identities必须两两不同。
    pub fn try_from_generated(
        run_ref: ControlledExecutionRunRef,
        capture_ref: CaptureFactRef,
        launch_failure_ref: FailureClassificationRef,
    ) -> Result<Self, ControlledExecutionRunError>;

    /// 返回本 attempt 的 controlled run ref。
    pub fn run_ref(&self) -> &ControlledExecutionRunRef;
    /// 返回本 attempt 的唯一 capture fact ref。
    pub fn capture_ref(&self) -> &CaptureFactRef;
    /// 返回本 attempt 的唯一 launch terminal failure candidate ref。
    pub fn launch_failure_ref(&self) -> &FailureClassificationRef;
}

impl ControlledRunLaunchPermit {
    /// 返回 committed `Preparing` run预绑定的launch terminal failure candidate ref。
    pub fn launch_failure_ref(&self) -> &FailureClassificationRef;
}

impl ControlledExecutionRun {
    /// 返回仅在`Preparing`期间存在的launch terminal failure candidate ref。
    pub fn prebound_launch_failure_ref(&self) -> Option<&FailureClassificationRef>;

    /// 只允许`Preparing` launch owner取得预绑定ref；其它status返回closed domain error。
    pub fn require_prebound_launch_failure_ref(
        &self,
    ) -> Result<&FailureClassificationRef, ControlledExecutionRunError>;
}
```

`ControlledRunLaunchPermit` 的 private field集合增加
`launch_failure_ref: FailureClassificationRef`；`ControlledExecutionRun` 的 private field集合增加
`prebound_launch_failure_ref: Option<FailureClassificationRef>`。`prepare` 从 bundle复制 `Some(launch_failure_ref)`；
`authorize_launch` 只在 run仍为 `Preparing` 且该 ref存在时把它复制进 permit。任何 caller、adapter、provider result、clock、
idempotency key或trace均不能生成或替换该 ref。

### 27.3 Transition 与 field relation overlay

| transition / status | prebound field before | required identity relation | field after | formal failure truth |
|---|---|---|---|---|
| `prepare -> Preparing` | n/a | bundle三个identity两两不碰撞 | `Some(bundle.launch_failure_ref)` | 不创建；failure repository write为0 |
| `Preparing -> Running` | `Some` | permit ref等于run prebound ref | `None` | 不创建 `PendingInput`或其它failure |
| `Running -> Completed` | `None` | 不适用 | `None` | 无run failure truth |
| `Preparing -> Failed` | `Some` | `failure.failure_ref()`必须等于prebound ref，且`require_run_failure_basis`通过 | `None`；terminal basis保存同一ref | 同一UoW `create_failure_classification` |
| `Running -> Failed` | `None` | 使用对应runtime terminal source形成的matching classification；不得复活launch candidate | `None` | 由runtime failure owner提供identity |
| `Preparing -> Terminated` | `Some` | matching control/redline basis获胜 | `None` | candidate retired；不得创建空pending failure |
| `Running -> Terminated` | `None` | matching control/redline basis | `None` | 不适用 |

`mark_running` 必须在修改 status前校验 permit中的 ref与run内嵌 ref exact equal，并在同一次对象transition中将字段置为
`None`。`mark_failed` 从 `Preparing` 执行时先比较 classification identity，再调用既有
`require_run_failure_basis`；任一步失败均不修改run。control/redline从 `Preparing` 获胜时同样清空候选字段，但不得以该
候选创建或伪造 failure。对象反序列化必须按下表 fail closed：

| persisted status | `prebound_launch_failure_ref` | terminal relation |
|---|---|---|
| `Preparing` | exactly `Some` | `terminal_basis == None` |
| `Running | Completed` | exactly `None` | 既有nonterminal/completed relation不变 |
| `Failed | Terminated` | exactly `None` | 继续由既有 `terminal_basis` 唯一拥有正式terminal identity |

`ControlledExecutionRunError` 增加以下 closed variants；既有 `RunCaptureIdentityCollision` 继续只表示run/capture碰撞：

```rust
/// launch failure ref与run或capture底层resource identity碰撞。
RunLaunchFailureIdentityCollision,
/// current status不允许读取prebound launch failure identity，或`Preparing`反序列化时该字段缺失。
PreboundLaunchFailureIdentityUnavailable {
    /// 观察到的canonical run status。
    actual: ControlledExecutionRunStatus,
},
/// permit、typed classification或run terminal basis使用了另一failure identity。
LaunchFailureIdentityMismatch,
/// non-Preparing persisted run错误保留了prebound launch failure identity。
UnexpectedPreboundLaunchFailureIdentity {
    /// 观察到的canonical run status。
    actual: ControlledExecutionRunStatus,
},
```

domain error mapper必须逐variant穷尽，不得把缺失候选ref降级成“重新分配”、generic internal string或新
`PendingInput` classification。

### 27.4 Reservation prefix、`MUT-G04 -> MUT-G05` persistence 与 recovery

`S7-02D` 的 committed reservation是本流程不可合并的operation prefix。只有reservation-only UoW返回
`FreshReserved`且commit为`Confirmed`后，pre-call allocation才可调用existing allocator的三个具名方法：

```text
validate fixed operation / channel / authority context / digest / idempotency key
  -> reservation-only UoW: claim_idempotency_reservation
  -> FreshReserved commit confirmed
  -> drop reservation UoW; retain committed reservation ownership
  -> next_controlled_execution_run_ref
  -> next_capture_fact_ref
  -> next_failure_classification_ref
  -> ControlledRunIdentityBundle::try_from_generated
  -> ControlledExecutionRun::prepare
  -> create_run + capture/audit/recovery relation in MUT-G04 preparation UoW
  -> preparation commit confirmed
  -> fresh read exact Preparing run group + committed reservation
  -> authorize_launch
  -> external launch
```

reservation commit confirmed前，business owner read、三次allocator调用、run factory、run repository write和external call均为
0。三次allocator调用只发生在 committed reservation ownership下的 `MUT-G04` candidate formation中；任一失败都不得create
run或调用backend。`create_run`仍是唯一 repository primitive，repository数量和method数量不变，但 adapter必须
序列化/反序列化完整 optional field，并验证三个identity的typed relation。历史 `C(run Preparing)+I-C(Reserved)`同一UoW
表述在本current overlay下失效：`I-C(Reserved)`只属于前置reservation-only UoW，`MUT-G04`不再次claim或create idempotency
root。run preparation commit unknown时，whole-group inspection以committed reservation和完整candidate run比较该字段，不能只比较
`run_ref/capture_ref/status`。

post-call recovery矩阵固定为：

| observed committed group | interpretation | allowed next action | forbidden |
|---|---|---|---|
| run `Preparing` + same prebound ref；无classification | launch finalization未证明提交 | inspect same backend key；terminal结果继续使用same ref | 分配第二ref、仅因stored output缺失重新launch |
| run `Running` + prebound `None` +完整stored group | success finalization committed | replay exact persisted outcome | 创建pending/classified failure |
| run `Failed` + terminal basis `Failure(ref)` + matching classification +完整stored group | terminal finalization committed | replay exact failed outcome | 第二classification、改成idempotency terminal-without-surface |
| run `Terminated` + prebound `None` +matching control/redline group | safety owner won | replay matching terminal outcome | 用retired candidate覆盖control/redline |
| mixed/proper subset/ref mismatch | indeterminate integrity state | consistency hold / reconciliation | 补写、last-write-wins、选择任一ref |

typed launch failure已经具备完整 failed command surface时，`MUT-G05` 使用 replayable completion finalizer：idempotency record
进入 `Completed`，stored surface原始status为 `Failed`。只有无法形成完整typed surface的技术终止才使用 terminal-failure
finalizer；后者不能替代 formal `FailureClassification` 或 run terminal basis。

### 27.5 Overlay closure

| check | current result |
|---|---|
| new domain root / repository / status | `0 / 0 / 0` |
| changed existing root | `ControlledExecutionRun` only |
| pre-call generated identities | run / capture / launch failure `3/3` |
| success-created failure truth | `0` |
| terminal launch second failure identity | `0` |
| crash recovery source | committed run root + existing idempotency whole-group plan |
| tools/runtime/member semantic fields | `0` |

本 overlay关闭 `S7-03B` 内部诊断 `LCP-D09`。它不是新的L1/L2上游项目blocker，不改变 Step 6 已完成的对象数量；
Step 8~10、正式`03`和implementation继续按当前恢复门禁冻结。
