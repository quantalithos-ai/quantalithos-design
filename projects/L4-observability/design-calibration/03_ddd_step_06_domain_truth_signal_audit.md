# L4-observability 03-详细设计 Step 06 · R06.3 domain truth / signal / audit 专项

> 主控文件: `03_ddd_step_06_object_contracts.md`
> 上游 contracts 专项: `03_ddd_step_06_contracts_carriers.md`
> 修复批次: `R06.3 domain truth / safety / correlation / signal / audit / evidence`
> 当前模式: full-restart 定向粒度修复
> 专项完成状态: R06.3_pass_historical_checkpoint;R06.5-G_affected_definition_sync_done
> 当前整体恢复点: R06.6-B_done_waiting_user
> 当前下一动作: wait_user_confirmation_before_R06.6-C_external_effect_intent_binding_tokens
> 正式回填状态: blocked_until_R06.8_and_step_19

## 1. 本批边界与停止规则

| 项 | 当前裁定 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 06 `逐模块定义对象实现契约` |
| 本批唯一目标 | 将 intake、safety、correlation、safe signal、rollup、audit projection、body-free evidence linkage 及五个直接 public view 压到逐对象可落码粒度 |
| 当前 definition owner | public ref / metadata / state value / view 在 planned `observability-contracts`;truth object / transition 在 planned `observability-domain` |
| 上游 current truth | 正式 `02` §6 / §12、概要 Step 06 truth/signal/audit 与 projection 附录、current Step 05、R06.2 contracts 专项 |
| 后置反查输入 | current Step 08 / 09 / 10 中与本批对象直接相关的 definition/use；只用于发现缺 definition，不成为 Step 06 owner |
| R06.3 执行时禁止范围（historical） | 当时尚未获准的R06.4对象、R06.5 policy/record、R06.6/R06.7 application/runtime/entry |
| 当前禁止写入 | Step 07~19、正式 `03-详细设计.md`、任何 `04` 文件、任何实现代码 |
| 外部上游 blocker | `none` |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`;R06.5-G已完成并停审，Step 06仍需R06.6~R06.8及后续受影响审计 |
| R06.3 历史停止规则 | 本文件、主控、flow、ledger 同步并通过自检后停审；该门禁随后经用户确认解除并已完成R06.4与R06.5-A |
| 当前停止规则 | 本文件的 G 批 affected-definition 已完成并作为历史输入；R06.6输入与A/B批已被消费，当前以主控/flow/ledger的`R06.6-B_done_waiting_user`为准 |

Observability 在本批只拥有 observation-side intake fact、safe signal、derived rollup、audit projection 和 body-free linkage。它不拥有 source material、Identity、Governance、Artifact、Runtime、Sandbox、Archive、Report、验收、执行结果或证据正文 truth。任何 `Accepted`、`Recorded`、`Appended`、`Linked`、`Fresh` 只说明本仓对象成立，不得解释为外部业务成功、执行成功、证据真实性或最终签署。

## 2. 必读输入与使用结论

| 输入 | 本批使用结论 |
|---|---|
| `详细设计讨论流程_SOP.md` Step 06 | 每个模块先写 capability / 功能映射，再为每个对象写字段、factory、member、state、来源与停审卡 |
| `详细设计书写规范.md` §5.5 / §5.6 | contracts/domain 依赖必须可编译；public view 不得引用 domain-only type；Rust code block 使用 Step 03 已裁定的英文 rustdoc |
| `设计真相源闭环与可落码性标准.md` | 所有字段和 member parameter 的 secondary carrier 必须有唯一 owner / exact schema / external exact type / legal defer |
| 正式 `02-概要设计.md` §6 / §12 | 保留七个关键 domain 主语和五个 projection 主语；详细设计只补足字段、初始态、状态触发、typed support 与依赖闭环 |
| `02_hld_step_06_key_objects_truth_signal_audit.md` | 提供 receipt、safety、correlation、signal、rollup、audit、evidence 的对象责任、字段骨架和禁止事项 |
| `02_hld_step_06_key_objects_projections.md` | 提供 intake/signal/rollup/audit/evidence 五个 read-side 主语；概要 `*Id` 需按 current typed-ref 规则逐项裁定 |
| current Step 05 | `contracts` 只依赖 core；`domain -> contracts`;public carrier/view 归 contracts，truth/transition 归 domain |
| R06.2 contracts 专项 | 复用已闭口 typed refs、structured refs、sets、visibility/degraded surface、reason enum；不得重复定义或改 shape |
| current Step 08 / 09 / 10 | 发现后置 public view、freshness surface、state trigger 与 field use；本批回灌 definition，冻结文件暂不修改 |
| L1-governance / L1-artifact Step 06 | 粒度基线是逐对象字段 / factory / member / state / source / redline，不以 family 表代替对象卡 |

## 3. 依赖、状态 owner 与 projection owner 裁定

### 3.1 单向依赖闭环

```text
core-contracts
      |
      v
observability-contracts  <-  observability-domain
      ^                          |
      |                          v
public views                truth transitions
```

`contracts` 不能引用 `domain`。因此本批七个状态 enum 的有限值定义归 `contracts::metadata`，domain object 直接持有该类型并唯一控制迁移。状态 enum 位于 contracts 不意味着 contracts 能推进状态，也不把 domain truth owner 移入 contracts；它只让 protocol、event、view 和 domain 使用同一套有限值，避免 public/domain 双 enum 和循环依赖。

| concern | definition owner | mutation / assembly owner | 禁止事项 |
|---|---|---|---|
| state enum value | `contracts::metadata` | domain object member function | contracts factory 不推进 domain state |
| truth object | `domain::{intake,safety,correlation,signal,audit,evidence}` | object factory/member | public DTO / infra mapper 不直接改字段 |
| public view schema | `contracts::views` | application assembler；infra store mapper | view 不依赖 domain object，不成为第二 truth |
| typed refs / sets / public reasons | R06.2 `contracts::{refs,metadata,surfaces}` | owning object / mapper uses | R06.3 不复制同名 type |
| policy result | R06.5 `domain::policies` | policy evaluate | 本批只定义 `SignalDecision` 等稳定 result carrier，不定义 policy object |
| append-only record | R06.5 `domain::records` | transition delta + application record factory | 本批 member 不直接构造未闭口 record object |

### 3.2 transition delta 取代后置 record 返回

修复前 Step 06 的多个 member 直接返回 `IntakeDecisionRecord`、`CorrelationLinkRecord` 或 `AuditAppendRecord`，但这些 persisted record 的 exact schema 唯一归 R06.5。为了避免 domain object 反向依赖未来 record factory，本批 member 返回具名 transition delta；R06.5 record factory 消费 delta、actor、time、trace 和 record ref，生成 append-only record。

| truth object | current transition output | R06.5 consumer | 不允许 |
|---|---|---|---|
| `ObservationReceipt` | `ObservationReceiptTransition` | `IntakeDecisionRecord::from_transition(...)` | object 内生成 record ref/time/trace |
| `CorrelationContext` | `CorrelationContextTransition` | `CorrelationLinkRecord::from_transition(...)` | context 直接 append repository |
| `SafeSignal` | `SafeSignalTransition` | correlation/audit record factory按 use case 消费 | suppress 返回 unrelated correlation record |
| `AuditProjection` | `AuditProjectionTransition` | `AuditAppendRecord::from_transition(...)` | aggregate 生成 persisted append identity |
| `EvidenceLinkage` | `EvidenceLinkageTransition` | `AuditAppendRecord` / evidence change record factory | linkage 直接创建 outbox / handoff |
| `SignalRollupWindow` | `SignalRollupTransition` | maintenance / projection record factory | window 声称 source metric/trace 已修复 |

## 4. canonical 命名与 historical material

| historical / 后置名称 | current canonical | 裁定 |
|---|---|---|
| `ObservationReceiptId` | `ObservationReceiptRef` | R06.2 已闭口 typed ref；不生成 ID/Ref 双类型 |
| `MaterialAdmissionState` | `ObservationReceiptState` | 保留概要 accepted/rejected/quarantined/degraded 语义，补 initial `Received` 与 reserved terminal `Superseded` |
| `SubmissionPurposeRef` | `SubmissionPurpose` | purpose 是 finite value，不是可解析对象 identity |
| `SafetyDispositionId` | `SafetyDispositionRef` | R06.2 typed ref |
| `SafetyDispositionKind` | `SafetyDispositionState` | 本轮生命周期值同时表达 pending/safe/redacted/rejected/quarantined；不建重复 kind |
| `SanitizedSummaryRef` / registry `SafeSummaryRef` | `SafeSignalSummaryRef` | R06.2 已闭口 exact safe-summary ref；不生成 alias |
| `CorrelationContextId` | `CorrelationContextRef` | R06.2 typed ref |
| `ActorSubjectObservationRef` | `SubjectObservationReference` | R06.2 structured body-free reference；本批 context 使用 optional `subject_ref` |
| HLD `Established/PendingSource/Degraded/Invalidated` | `Bound/Unbound/Partial/Invalid` | exact current code names；语义一一对应，不保留 alias token |
| `SafeSignalId` | `SafeSignalRef` | R06.2 typed ref |
| HLD `Admitted/Projected/Degraded/Suppressed` | `Candidate/Recorded/Stale/Suppressed` | projection 是 read-side副作用而非 signal lifecycle；degraded current 由 `Stale` + degraded surface表达 |
| `SignalRollupWindowId` | `SignalRollupWindowRef` | R06.2 typed ref |
| `RollupWindowState` | `SignalRollupState` | current freshness lifecycle；rebuild execution state另归 R06.4 |
| `WindowStartAt` / `WindowEndAt` | `ObservedAt` | 使用同一 canonical instant value，不建同义 time wrapper |
| `AuditProjectionId` | `AuditProjectionRef` | R06.2 typed ref |
| `AuditProjectionVisibilityState` | `AuditProjectionState` | current enum含 pending/appended/restricted/suppressed；gap 是 state-preserving ref，不建第二 lifecycle |
| `AuditConsumerPurpose` / `AuditProjectionKind` | 不保留为本批字段 | current projection identity由 subject + correlation + source audit决定；消费者目的属于 view/evidence policy，不污染 aggregate identity |
| `EvidenceLinkageId` | `EvidenceLinkageRef` | R06.2 typed ref |
| HLD `Missing/InvalidDigest` | current `Candidate/Stale/BodyBlocked` | missing 在 gap/reference boundary表达；invalid digest 不能建立 candidate；不伪造 duplicate state |
| `SafeSummaryRef` | `SafeSignalSummaryRef` | registry 摘要行旧名；R06.2 exact type 优先 |
| `IntakeStatusViewId` 等四个可重建 view id | 复用 truth / scope identity | receipt/signal/window/projection + page scope 是 canonical key；不制造无下游 owner 的同义 ref |
| `EvidenceIndexInputViewId` | `EvidenceIndexInputViewRef` | 唯一需要 immutable snapshot identity，R06.2 registry 已点名，本批闭口 exact newtype |
| Step 08 `IntakeStatusItemView` | `IntakeStatusView` | `Item` 只是 page position，不生成第二 type |

以上旧名称全部是 `historical_material` 或概要概念名。除 wire compatibility 在后续 Step 08 明确做一次性 mapper 外，不生成 Rust type alias、不接受双 token，也不允许实现者任选名称。

## 5. 本批 capability 与对象推导

### 5.1 capability 清单

| capability | 输入 | 输出 | 状态 / 副作用 | 承接对象 | 后续 Step |
|---|---|---|---|---|---|
| observation intake | structured source、purpose、clock | receipt + transition delta | observation-owned receipt state | `ObservationReceipt` | R06.5 record；Step 07 repo；Step 09 flow |
| redaction-first safety | body-free material summary、evaluation context | disposition + transition delta | safety state；不保留正文 | `SafetyDisposition` | R06.5 policy/record；Step 07 resolver |
| body-free correlation | accepted receipt、trace/causation seed、safe subject | context + transition delta | local correlation state | `CorrelationContext` | R06.5 record；Step 07 repo/resolver |
| safe signal formation | correlation、safe summary、signal kind、runtime safe ref | signal + transition delta | candidate/recorded/stale/suppressed | `SafeSignal` | R06.5 policy；Step 09 flow |
| derived rollup | saved recorded signal refs、canonical scope/window/cursor | window + transition delta | pending/fresh/stale/rebuilding/failed | `SignalRollupWindow` | R06.4 rebuild state；Step 07 repo |
| audit projection append | body-free subject/source audit/context/linkage/gap | projection + transition delta | pending/appended/restricted/suppressed | `AuditProjection` | R06.5 append record；Step 07 repo |
| evidence linkage | structured external boundary ref、purpose/scope/digest | linkage + transition delta | candidate/linked/not-visible/stale/body-blocked | `EvidenceLinkage` | R06.5 policy/record；Step 07 resolver |
| public intake view | saved receipt/safety + visibility/freshness | body-free status | immutable read shape | `IntakeStatusView` | Step 08 Query |
| public signal/rollup views | saved signal/window + freshness | body-free signal/rollup output | immutable read shape | `SafeSignalProjectionView`;`SignalRollupView` | Step 08 Query |
| public audit timeline | ordered saved projections + visibility | immutable timeline page body | no truth mutation | `AuditTimelineView` | Step 08 page / Step 09 assembler |
| immutable evidence handoff input | validated linkage/projection/gap refs + consumer scope | committed snapshot | append-once,never replace | `EvidenceIndexInputView` | R06.4 handoff；Step 07 repository |

### 5.2 功能到对象映射

| 对象 | 类别 | 对象能力 | 不承接 / 禁止 |
|---|---|---|---|
| `ObservationReceipt` | domain aggregate | 建立 intake fact、校验 disposition compatibility、推进 admission | source truth、raw body、record persistence |
| `SafetyDisposition` | domain entity | 保存 redaction/forbidden-body 的 body-free结果并推进状态 | redaction engine、正文、handoff |
| `CorrelationContext` | domain context | 绑定本仓 receipt/source 与 opaque trace/causation/subject/runtime ref | runtime/identity/business relationship truth |
| `SafeSignal` | domain entity | 从安全摘要形成 observation signal、record/stale/suppress | raw log/metric/trace、execution verdict |
| `SignalRollupWindow` | domain derived state | 对已保存 Recorded signal 做去重计数与 cursor freshness | metric schema、raw backend scan、source repair |
| `AuditProjection` | domain aggregate | 建立 observation audit projection、append linkage、restrict、attach gap | source audit/Governance truth、正文、直接发布 |
| `EvidenceLinkage` | domain entity | 记录 external body-free reference、digest、purpose/scope、visibility状态 | evidence body、真实 alias、authenticity verdict |
| 五个 view | contracts immutable view | 携带已组装 public refs/state/freshness/visibility | domain transition、repository access、Query write |

## 6. inventory、资格与唯一 owner

### 6.1 shared contracts carrier

| 类型 | 资格 | owner | 本批闭口重点 |
|---|---|---|---|
| `ActorSafeRef` | `FC` | `contracts::metadata` | core actor id/kind安全投影；丢弃 display name；不授权 |
| `ObservedAt` | `FC` | `contracts::metadata` | canonical UTC instant、wire/order/boundary mapping |
| 七个 `*State` | `FC` | `contracts::metadata` | exact variants/wire/transition owner；domain-only mutation |
| `ObservationProjectionFreshnessSurface` | `FC` | `contracts::surfaces` | Step 08后置 definition回灌；marker/progress mutual rules |
| `EvidenceIndexInputViewRef` | `TC` | `contracts::refs` | immutable snapshot identity；不得由 scope digest派生 |

### 6.2 domain support carrier

下表的“功能组”说明使用语境，不代表crate owner。凡同时出现在 protocol/view 与 domain 的稳定值统一归 `contracts`;只有 transition delta、policy decision和仅供domain factory使用的校验值归 `domain`。

| 功能组 | 类型 | 资格 | unique owner / shape |
|---|---|---|---|
| intake | `SubmissionPurpose`;`IntakeRejectReason`;`QuarantineReason` | `FC` | `contracts::metadata`;public finite enum |
| intake | `ObservationReceiptTransition` | `FC` | `domain::intake`;typed immutable transition delta |
| safety | `RedactionMarker`;`ForbiddenBodyFlag`;`ForbiddenBodyKind` | `FC` | `contracts::metadata`;public finite enum |
| safety | `ForbiddenBodyEvidence`;`ReceivedMaterialSummary`;`SafetyEvaluationContext` | `FC` | `domain::safety`;body-free factory/policy input |
| safety | `SafetyDispositionTransition` | `FC` | `domain::safety`;typed immutable transition delta |
| correlation | `TraceCorrelationRef`;`CausationRef` | `TC` | `contracts::refs`;validated `BodyFreeRef` newtype |
| correlation | `CorrelationSeed`;`CorrelationGapReason`;`CorrelationInvalidReason` | `FC` | `contracts::metadata`;public request/value/reason carrier |
| correlation | `CorrelationContextTransition` | `FC` | `domain::correlation`;transition delta |
| signal | `SafeSignalKind`;`SignalSuppressionReason` | `FC` | `contracts::metadata`;public finite enum |
| signal | `SignalDecisionKind`;`SignalDecision`;`SafeSignalTransition` | `FC` | `domain::signal`;target-bound policy result / transition delta |
| rollup | `SignalRollupScope`;`RollupWindowKind`;`SignalCount`;`MaintenanceFailureReason` | `FC` | `contracts::{scopes,metadata}`;public query/job/view carrier |
| rollup | `SignalRollupCoverage`;`SignalRollupTransition` | `FC` | `domain::signal`;target-bound committed snapshot / delta |
| audit | `SourceAuditRef`;`AuditAppendRecordRef` | `TC` | `contracts::refs`;body-free newtype |
| audit | `AuditAppendKind` | `FC` | `contracts::metadata`;public timeline + persisted record classifier |
| audit | `AuditProjectionTransition` | `FC` | `domain::audit`;transition delta |
| evidence | `EvidenceConsumerPurpose`;`EvidenceConsumerScope`;`BodyBlockedReason` | `FC` | `contracts::{metadata,scopes}`;public request/view carrier |
| evidence | `EvidenceVisibilityOutcome`;`EvidenceVisibilityDecision`;`AuditProjectionVisibilityDecision`;`EvidenceLinkageTransition` | `FC` | `domain::evidence/audit`;target-bound policy result / transition delta |

### 6.3 R06.2 exact reuse

| 已闭口类型 | authoritative location | 本批用法 |
|---|---|---|
| seven truth refs、`ProjectionFreshnessMarkerRef` | R06.2 §6 | object identity / freshness identity |
| `SafeSignalSummaryRef` | R06.2 §7.12 | safety/signal/view safe summary；registry旧 `SafeSummaryRef` 不生成 |
| `AuditSubjectRef` | R06.2 §8.5 | audit projection/timeline subject |
| `ObservationSourceRef`;`RuntimeSandboxSignalRef`;`GovernanceArtifactEvidenceReference` | R06.2 §10 | structured body-free external boundary |
| `DigestSummary`;`ObservationCursor` | R06.2 §11.7 / §12.1 | evidence integrity / rollup committed cursor |
| `VisibilitySurface`;`DegradedSurface`;`EvidenceVisibilityReason`;`ReferenceStaleReason`;`DegradedReason` | R06.2 §14 / §20 | public/view/domain input；不重复定义 |
| `GapStateRefSet`;`EvidenceLinkageRefSet`;`ObservationReceiptRefSet` | R06.2 §16 | view canonical sets；audit projection set在本批单独闭口 |

## 7. shared metadata 与 public support carrier

### 7.1 `ActorSafeRef`

```rust
/// Body-free actor projection safe for observability metadata and durable records.
pub struct ActorSafeRef {
    /// Stable actor identifier imported from core contracts.
    pub actor_id: ActorId,

    /// Actor category imported from core contracts; it is not an authorization level.
    pub actor_kind: ActorKind,
}
```

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `actor_id` | `core_contracts::actor::ActorId` | trusted `ActorRef.actor_id` / system principal mapper | 必填；不从 display name/session/credential派生 |
| `actor_kind` | `core_contracts::actor::ActorKind` | trusted `ActorRef.actor_kind` | 只分类，不表示 role/scope/authorization |

| 函数签名 | 作用 | 副作用 / 不变量 |
|---|---|---|
| `pub fn from_actor_ref(actor: ActorRef) -> Self` | move actor id/kind，丢弃 optional display name | lossful-by-design安全投影；不要求core field Clone |
| `pub fn actor_id(&self) -> &ActorId` | 读取 stable id | 无 |
| `pub fn actor_kind(&self) -> &ActorKind` | 读取 finite kind | 无 |
| `pub fn same_actor(&self, other: &ActorSafeRef) -> bool` | 按 id + kind 比较 | 不查 Identity、不比较 display name |

- wire 只含 `{actor_id, actor_kind}`；禁止 `display_name`、email、role、credential、session、provider principal body。
- `Debug` 只显示 kind 与 redacted actor id；不实现可泄露完整 id 的 `Display`。
- `ActorSafeRef` 证明 trusted boundary 已给出稳定 actor，不证明身份认证、scope membership 或操作授权。
- 必测四种 core `ActorKind`、display name 丢弃、same-id/different-kind冲突、serde round-trip 与 debug redaction。
- 对象停审: `pass_R06.3`。

### 7.2 `ObservedAt`

```rust
/// Canonical UTC instant recorded by the observability boundary clock.
pub struct ObservedAt(String);
```

| 契约项 | current 规则 |
|---|---|
| canonical wire | RFC 3339 UTC，固定 `YYYY-MM-DDTHH:MM:SS.ffffffZ`，恰好 27 ASCII bytes，微秒六位 |
| factory | `pub fn parse_canonical(value: String) -> Result<Self, ProtocolError>`；拒绝 offset、leap second、少/多精度、空格、非 canonical calendar value |
| clock factory | `pub fn from_utc_micros(epoch_micros: i64) -> Result<Self, ProtocolError>`；允许1970前但年份必须在0001..=9999；超范围拒绝 |
| member | `as_str() -> &str`;`cmp` 按 canonical UTC instant；`checked_window_before(&self, later: &ObservedAt) -> bool` |
| core mapping | core `Timestamp` 当前设计未公开 exact inner/accessor；R06.3 不伪造 `From<Timestamp>`。Step 07/08 boundary mapper在 core accessor 收稳后解析为 canonical form |
| source | 本仓 boundary/application clock；external occurred time如需保留必须另有具名 source timestamp，不得替代本仓 `ObservedAt` |
| persistence | exact string round-trip；DB default/adapter completion time不得代替 factory输入 |

- 不接受 local timezone、floating date、UNIX number wire、`now()` 隐式调用或 decode 时 normalization。
- `ObservedAt` 是记录时点，不是 source version、event identity、cursor、idempotency key 或因果顺序证明。
- 必测 leap year、UTC offset拒绝、微秒边界、负 epoch支持策略、lexical/chronological ordering一致、round-trip。
- 对象停审: `pass_R06.3`;core mapping保持 `DX Step07/08 exact accessor`，不是实现侧任意转换许可。

### 7.3 `EvidenceIndexInputViewRef`

```rust
/// Stable identity of one immutable evidence-index input snapshot.
pub struct EvidenceIndexInputViewRef(BodyFreeRef);
```

| 卡片项 | 独立契约 |
|---|---|
| owner / mint | `contracts::refs`;Query preview或PrepareReportHandoff组装前由 application id generator生成 |
| factory/member | R06.2 TC模板：`new/as_body_free_ref/into_body_free_ref` |
| wire | `evidence_index_input_view_ref` opaque string；typed discriminator参与 digest |
| identity | committed snapshot创建后不可 replace；preview未提交时 identity不产生 truth |
| invariant | 不从 scope、consumer、linkage set或digest拼接；不是 evidence alias、handoff ref或report id |
| test redlines | scope digest转换、EvidenceLinkageRef owner误用、URI/path、committed replacement identity变化均拒绝 |
| stop | `pass_R06.3` |

### 7.4 `ObservationProjectionFreshnessSurface`

```rust
/// Public freshness of a projection or immutable observation-side snapshot.
pub enum ObservationProjectionFreshnessSurface {
    /// The projection covers the requested committed source position.
    Fresh,

    /// The projection exists but trails a committed source position.
    Stale { marker_ref: ProjectionFreshnessMarkerRef },

    /// A rebuild is active or scheduled for this projection.
    Rebuilding { progress_ref: Option<RebuildProgressViewRef> },

    /// Freshness cannot be established from persisted markers.
    Unknown,
}
```

| 变体 | Rustdoc 语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| `Fresh` | 覆盖请求所需 committed position | projection assembler基于 dual-watermark / exact marker | 不适用；public value无迁移 |
| `Stale { marker_ref }` | 已知 stale marker identity | persisted projection sidecar | 不适用 |
| `Rebuilding { progress_ref }` | rebuild已计划或运行；progress尚未创建可为None | maintenance state / progress projection | 不适用 |
| `Unknown` | 缺少足以断言 freshness 的 marker | missing marker / unsupported consistency | 不适用；不得映射成Fresh |

| 函数签名 | 作用 | 不变量 |
|---|---|---|
| `pub fn is_fresh(&self) -> bool` | 仅 `Fresh` 返回true | Unknown/Rebuilding不得当fresh |
| `pub fn marker_ref(&self) -> Option<&ProjectionFreshnessMarkerRef>` | 仅 Stale返回 marker | 不从 progress猜 marker |
| `pub fn progress_ref(&self) -> Option<&RebuildProgressViewRef>` | 仅 Rebuilding Some payload返回 | None仍明确rebuilding |

- owner为 `contracts::surfaces`；它从 Step 08 后置 definition 回灌，本批之后 Step 08 只定义协议 wrapper / mapping。
- freshness是public projection surface，不推进 `SignalRollupState`、reference state或maintenance state；Query不能通过构造 `Fresh` 修复 projection。
- exact wire：`fresh`、`stale`、`rebuilding`、`unknown` tagged enum；payload组合必须与variant匹配。
- 必测四variant、stale missing marker、fresh with payload、rebuilding None/Some、unknown不得fallback。
- 对象停审: `pass_R06.3`;关闭 `R06-D05` 的 shared freshness carrier部分。

## 8. contracts state enum 共同规则

本节七个 state enum 均归 `contracts::metadata`。wire 使用 exact lowercase `snake_case`；unknown、大小写 alias、数字 alias、`Other(String)`、首变体 default 全部返回 `ProtocolError::UnknownEnumToken`。enum 本身不提供 mutation；合法迁移只能由 §10~§16 owning domain object member 执行。

### 8.1 `ObservationReceiptState`

```rust
/// Admission lifecycle value exposed by an observation receipt.
pub enum ObservationReceiptState {
    /// Material is recorded but has not completed safety admission.
    Received,
    /// Material may enter the observation-owned processing line.
    Accepted,
    /// Material was rejected and cannot enter the processing line.
    Rejected,
    /// Material is isolated because safety is not closed.
    Quarantined,
    /// Material may be interpreted only through degraded surfaces.
    Degraded,
    /// A newer receipt replaced this receipt through a reserved flow.
    Superseded,
}
```

| variant / wire | 作用 | 允许来源 | 允许去向 | terminal / callable |
|---|---|---|---|---|
| `Received/received` | factory初始态 | `ObservationReceipt::receive` | Accepted/Rejected/Quarantined/Degraded | 非终态；current |
| `Accepted/accepted` | 本仓 intake 已接受 | Received/Degraded | Superseded | 稳定态；supersede reserved |
| `Rejected/rejected` | 准入拒绝 | Received/Degraded/Quarantined | 无 | terminal；current |
| `Quarantined/quarantined` | 隔离且不可进入主线 | Received/Degraded | Rejected/Superseded | 非终态；supersede reserved |
| `Degraded/degraded` | 只允许受限解释 | Received | Accepted/Rejected/Quarantined/Superseded | 非终态；supersede reserved |
| `Superseded/superseded` | 被新 receipt 显式替代 | Accepted/Degraded/Quarantined | 无 | terminal；当前无 callable |

- 只有 owning `ObservationReceipt` 可改变值；contracts view/event只能复制 committed state。
- `Accepted` 不等于 source truth accepted；`Superseded` 不删除历史 receipt。
- 必测全部 current transition、Rejected/Superseded terminal、reserved supersede返回 `DomainError::ReservedTransition`、wire unknown拒绝。
- 停审: `pass_R06.3`。

### 8.2 `SafetyDispositionState`

```rust
/// Safety evaluation lifecycle for one observation intake.
pub enum SafetyDispositionState {
    /// Safety evaluation has not produced a stable decision.
    Pending,
    /// Material is safe for observation-side use without redaction.
    Safe,
    /// Material is safe only through the recorded redacted summary.
    Redacted,
    /// Safety policy rejected the material.
    Rejected,
    /// Material remains isolated and cannot feed downstream truth.
    Quarantined,
}
```

| variant / wire | 作用 | 允许来源 | 允许去向 | terminal / callable |
|---|---|---|---|---|
| `Pending/pending` | factory初始态 | `SafetyDisposition::evaluate` | Safe/Redacted/Rejected/Quarantined | 非终态 |
| `Safe/safe` | clean safe summary可用 | Pending | 无 | terminal |
| `Redacted/redacted` | redacted safe summary可用 | Pending | 无 | terminal |
| `Rejected/rejected` | unsafe或policy rejection | Pending/Quarantined | 无 | terminal |
| `Quarantined/quarantined` | 隔离待受控拒绝 | Pending | Rejected | 非终态 |

- `Safe` 必须对应 `RedactionMarker::Clean`；`Redacted` 必须对应 redacted marker；两者均要求 safe summary。
- `Rejected/Quarantined` 不得携带 forbidden body正文；Quarantined不能直接转Safe/Redacted。
- 必测 marker/state组合、forbidden flag组合、terminal rewrite与wire token。
- 停审: `pass_R06.3`。

### 8.3 `CorrelationContextState`

```rust
/// Availability of an observation-side body-free correlation context.
pub enum CorrelationContextState {
    /// The context has not established enough stable correlation hints.
    Unbound,
    /// The context has enough validated references for normal processing.
    Bound,
    /// The context is usable only with explicit partial semantics.
    Partial,
    /// Conflicting or invalid references make the context unusable.
    Invalid,
}
```

| variant / wire | 作用 | 允许来源 | 允许去向 | terminal |
|---|---|---|---|---|
| `Unbound/unbound` | factory初始态 | `CorrelationContext::from_receipt` | Bound/Partial/Invalid | 否 |
| `Bound/bound` | required safe refs已闭口 | Unbound/Partial | Partial/Invalid；同态追加runtime ref | 否 |
| `Partial/partial` | 缺 trace/causation/subject/runtime线索 | Unbound/Bound | Bound/Invalid | 否 |
| `Invalid/invalid` | ref冲突或boundary violation | Unbound/Bound/Partial | 无 | 是 |

- `Bound` 只表示 observation-side correlation usable，不声明业务关系、Identity关系或execution causality为真。
- Partial恢复必须由新的 validated seed/ref触发，不能由 timeout/default自动恢复。
- 必测 partial recovery、source mismatch、trace conflict、Invalid terminal和state-preserving runtime link。
- 停审: `pass_R06.3`。

### 8.4 `SafeSignalState`

```rust
/// Lifecycle of an observation-owned safe signal.
pub enum SafeSignalState {
    /// The signal is a candidate awaiting a safe-signal decision.
    Candidate,
    /// The signal is committed as body-free observation material.
    Recorded,
    /// The signal is excluded from normal rollup and export.
    Suppressed,
    /// The signal exists but depends on stale reference material.
    Stale,
}
```

| variant / wire | 作用 | 允许来源 | 允许去向 | terminal |
|---|---|---|---|---|
| `Candidate/candidate` | factory初始态 | `SafeSignal::from_summary` | Recorded/Suppressed | 否 |
| `Recorded/recorded` | safe signal正式成立 | Candidate/Stale | Stale/Suppressed | 否 |
| `Suppressed/suppressed` | normal output/rollup禁止 | Candidate/Recorded/Stale | 无 | 是 |
| `Stale/stale` | safe summary/reference过期 | Recorded | Recorded/Suppressed | 否 |

- 概要 `Projected` 不属于 signal lifecycle；projection success不会修改 signal state。
- Recorded仍不裁决 runtime/sandbox执行成功；Suppressed不删除 diagnostic/audit visibility。
- 必测 candidate decision、stale revalidation、suppression terminal、suppressed不得rollup/export。
- 停审: `pass_R06.3`。

### 8.5 `SignalRollupState`

```rust
/// Freshness lifecycle of one derived safe-signal rollup window.
pub enum SignalRollupState {
    /// The window accepts committed safe signals but is not sealed.
    Pending,
    /// The rollup covers its declared committed source cursor.
    Fresh,
    /// A newer committed safe signal exists beyond the rollup cursor.
    Stale,
    /// The rollup is being rebuilt from committed safe signals.
    Rebuilding,
    /// The latest rebuild attempt failed without changing source truth.
    Failed,
}
```

| variant / wire | 作用 | 允许来源 | 允许去向 | terminal |
|---|---|---|---|---|
| `Pending/pending` | open window初始态 | `SignalRollupWindow::open` | Pending/Fresh | 否 |
| `Fresh/fresh` | count/cursor覆盖target | Pending/Stale/Rebuilding | Stale/Rebuilding | 否 |
| `Stale/stale` | 新Recorded signal使cursor落后 | Fresh | Fresh/Rebuilding | 否 |
| `Rebuilding/rebuilding` | derived rebuild运行中 | Fresh/Stale/Failed | Fresh/Failed | 否 |
| `Failed/failed` | rebuild失败 | Rebuilding | Rebuilding | 否；显式重试 |

- 该状态只聚合已保存 `SafeSignal::Recorded`；不得读取 raw metric/trace/log backend或声称source repaired。
- Rebuilding freshness与 R06.4 `RollupRebuildState` execution progress是两个owner；只能由application协调，不合并enum。
- 必测 cursor单调、duplicate/out-of-order、incomplete seal、failed retry、wire unknown。
- 停审: `pass_R06.3`。

### 8.6 `AuditProjectionState`

```rust
/// Lifecycle of an observability-owned append-only audit projection.
pub enum AuditProjectionState {
    /// The projection exists but has no accepted append fact yet.
    PendingAppend,
    /// At least one body-free append fact is committed.
    Appended,
    /// The projection exists but public visibility is restricted.
    VisibilityRestricted,
    /// The projection is suppressed through a reserved explicit flow.
    Suppressed,
}
```

| variant / wire | 作用 | 允许来源 | 允许去向 | terminal / callable |
|---|---|---|---|---|
| `PendingAppend/pending_append` | factory初始态 | `AuditProjection::create` | Appended/VisibilityRestricted/Suppressed | suppress reserved |
| `Appended/appended` | body-free append成立 | PendingAppend/VisibilityRestricted | VisibilityRestricted/Suppressed；同态append/gap | suppress reserved |
| `VisibilityRestricted/visibility_restricted` | projection存在但受限 | PendingAppend/Appended | Appended/Suppressed；同态gap | suppress reserved |
| `Suppressed/suppressed` | internal audit read only | any nonterminal | 无 | terminal；当前无 callable |

- `attach_gap` 是 state-preserving operation；gap存在不自动把 Appended 改为另一 lifecycle。
- Appended不等于 source audit/Governance事实被接受；latest append ref只指向本仓record。
- 必测 append/restrict/restore、gap同态、reserved suppress拒绝和source-body负例。
- 停审: `pass_R06.3`。

### 8.7 `EvidenceLinkageState`

```rust
/// Lifecycle of one body-free external evidence linkage.
pub enum EvidenceLinkageState {
    /// The linkage awaits body-free and visibility evaluation.
    Candidate,
    /// The body-free reference and digest are usable for its purpose.
    Linked,
    /// Resolver input contained forbidden body material.
    BodyBlocked,
    /// The external object may exist but is not visible in this scope.
    NotVisible,
    /// The linkage depends on stale reference or digest material.
    Stale,
}
```

| variant / wire | 作用 | 允许来源 | 允许去向 | terminal |
|---|---|---|---|---|
| `Candidate/candidate` | factory初始态 | `EvidenceLinkage::candidate` | Linked/BodyBlocked/NotVisible | 否 |
| `Linked/linked` | body-free linkage可用 | Candidate/Stale/NotVisible | Stale/NotVisible | 否 |
| `BodyBlocked/body_blocked` | 检测到正文且不保留 | Candidate | 无 | 是 |
| `NotVisible/not_visible` | 存在性与可见性分离 | Candidate/Linked/Stale | Linked/Stale | 否 |
| `Stale/stale` | reference/digest snapshot过期 | Linked/NotVisible | Linked | 否 |

- Missing不作为本对象状态：resolver明确missing时由 R06.4 `GapState`/reference snapshot表达，不创建假 linkage。
- Invalid digest在factory/policy阶段拒绝或保持 Candidate，不用 `InvalidDigest` 状态掩盖无效构造。
- 必测 body-block terminal、not-visible != missing、stale relink、purpose/scope mismatch与wire unknown。
- 停审: `pass_R06.3`。

## 9. domain support carrier 独立对象卡

除明确写成 newtype/value object 外，本节 enum 均使用 exact lowercase `snake_case` wire token，无 `Other(String)`、alias或default。transition delta只承载完成 record factory 所需的 accepted state change，不带 actor/time/trace/record identity；这些字段由 R06.5 record factory从 application context和clock补齐。

### 9.1 `SubmissionPurpose`

```rust
/// Finite purpose for admitting material into the observation boundary.
pub enum SubmissionPurpose {
    /// Establish an intake fact and its safety disposition.
    ObservationIntake,
    /// Establish or enrich a body-free correlation context.
    CorrelationBinding,
    /// Form a safe log, metric, trace, or summary signal.
    SafeSignalFormation,
    /// Form an observability-owned audit projection.
    AuditProjection,
    /// Form a body-free external evidence linkage.
    EvidenceLinkage,
    /// Support an explain-only diagnostic surface.
    DiagnosticSupport,
}
```

| variant / wire | 正式来源 | 允许目标 | 禁止解释 |
|---|---|---|---|
| `ObservationIntake/observation_intake` | submit / bus material | receipt + safety | source write |
| `CorrelationBinding/correlation_binding` | bind correlation / trusted context event | correlation context | business relationship truth |
| `SafeSignalFormation/safe_signal_formation` | record signal / runtime/sandbox summary | safe signal | execution verdict |
| `AuditProjection/audit_projection` | append audit / source audit summary | audit projection | source audit/Governance truth |
| `EvidenceLinkage/evidence_linkage` | link evidence / artifact-governance context | evidence linkage | evidence body/alias creation |
| `DiagnosticSupport/diagnostic_support` | accepted diagnostic-safe material | explain-only view input | control command |

owner为 `contracts::metadata`，因为 Command/Consumer DTO 与 domain 同时使用。增加 purpose 必须重开 intake protocol、idempotency namespace、policy compatibility和测试，不允许配置动态增加。必测6 token、purpose/source compatibility、unknown拒绝。停审: `pass_R06.3`。

### 9.2 `IntakeRejectReason`

```rust
/// Finite reason for rejecting an observation intake fact.
pub enum IntakeRejectReason {
    /// The source family or source boundary is not admissible.
    SourceNotAllowed,
    /// The submission purpose is incompatible with the source.
    PurposeNotAllowed,
    /// A required body-free reference or safe summary is missing.
    MissingRequiredSafeInput,
    /// Safety evaluation rejected the candidate material.
    SafetyRejected,
    /// Forbidden body material crossed the intake boundary.
    ForbiddenBodyDetected,
    /// A different current receipt already owns the source-purpose key.
    ConflictingCurrentReceipt,
}
```

每个 variant 的 wire 分别为 `source_not_allowed`、`purpose_not_allowed`、`missing_required_safe_input`、`safety_rejected`、`forbidden_body_detected`、`conflicting_current_receipt`。来源只能是 `IntakeAdmissionPolicy`、safety result或 application unique-conflict mapping；不得携带 raw message。去向为 receipt transition与R06.5 intake record。必测 reason到state/record映射 total。停审: `pass_R06.3`。

### 9.3 `QuarantineReason`

```rust
/// Finite reason for isolating unsafe or unclosed material.
pub enum QuarantineReason {
    /// Forbidden body material was detected.
    ForbiddenBodyDetected,
    /// Redaction did not produce a safe summary.
    RedactionIncomplete,
    /// A supplied summary failed the safe-summary boundary.
    UnsafeSummary,
    /// The source could not be trusted for the declared family.
    UntrustedSource,
    /// The material violated a schema or ownership boundary after parsing.
    BoundaryViolation,
}
```

wire为 exact lowercase variant。Quarantine是 committed observation-side安全事实，不是 dead-letter、retry或最终拒绝；`Quarantined -> Rejected` 需要另一个 `IntakeRejectReason`。禁止把 provider error/body片段放进reason。必测5 token、receipt/safety两处映射与unknown拒绝。停审: `pass_R06.3`。

### 9.4 `ObservationReceiptTransition`

```rust
/// Complete body-free receipt revision captured before one accepted mutation.
pub struct ObservationReceiptTransitionSnapshot {
    pub(crate) receipt_ref: ObservationReceiptRef,
    pub(crate) source_ref: ObservationSourceRef,
    pub(crate) admission_state: ObservationReceiptState,
    pub(crate) safety_disposition_ref: Option<SafetyDispositionRef>,
    pub(crate) submission_purpose: SubmissionPurpose,
    pub(crate) received_at: ObservedAt,
}

/// Accepted state change emitted by an observation receipt.
pub enum ObservationReceiptTransition {
    /// Safety allowed the receipt to enter the observation-owned line.
    Accepted {
        previous: ObservationReceiptTransitionSnapshot,
        receipt_ref: ObservationReceiptRef,
        from: ObservationReceiptState,
        disposition_ref: SafetyDispositionRef,
    },
    /// Intake rejected the receipt for a finite reason.
    Rejected {
        previous: ObservationReceiptTransitionSnapshot,
        receipt_ref: ObservationReceiptRef,
        from: ObservationReceiptState,
        reason: IntakeRejectReason,
    },
    /// Intake isolated the receipt for a finite safety reason.
    Quarantined {
        previous: ObservationReceiptTransitionSnapshot,
        receipt_ref: ObservationReceiptRef,
        from: ObservationReceiptState,
        reason: QuarantineReason,
    },
    /// Intake retained only degraded observation semantics.
    Degraded {
        previous: ObservationReceiptTransitionSnapshot,
        receipt_ref: ObservationReceiptRef,
        from: ObservationReceiptState,
        reason: DegradedReason,
    },
    /// A future explicit replacement flow superseded this receipt.
    Superseded {
        previous: ObservationReceiptTransitionSnapshot,
        receipt_ref: ObservationReceiptRef,
        from: ObservationReceiptState,
        replacement_ref: ObservationReceiptRef,
    },
}
```

| 契约项 | 规则 |
|---|---|
| owner | `domain::intake`;不进入 public request |
| target state | variant分别固定 Accepted/Rejected/Quarantined/Degraded/Superseded，不再携带可变 `to` |
| source | 仅 owning object成功 mutation后返回；失败不创建 delta |
| record handoff | R06.5 record factory补 `record_ref/actor_ref/recorded_at/trace_ref` |
| invariant | 每个variant的`previous.receipt_ref/receipt_ref`必须等于owning object，previous state必须等于`from`，immutable fields必须等于post-state；replacement不得等于self |
| tests | 每条合法迁移delta、非法迁移zero delta、reserved supersede zero delta |

停审: `pass_R06.3`。

### 9.5 `RedactionMarker`

```rust
/// Finite redaction result attached to body-free safety material.
pub enum RedactionMarker {
    /// No safe redaction result has been accepted yet.
    Unchecked,
    /// The accepted safe summary required no redaction.
    Clean,
    /// The accepted safe summary was produced through redaction.
    Redacted,
}
```

wire为 `unchecked/clean/redacted`。`Unchecked` 只能用于 Pending；Clean只可产生Safe；Redacted只可产生Redacted。marker不证明source body不存在、不保存redaction规则或正文。必测 state/summary/flag compatibility。停审: `pass_R06.3`。

### 9.6 `ForbiddenBodyFlag`

```rust
/// Whether forbidden body material was detected at the safety boundary.
pub enum ForbiddenBodyFlag {
    /// No forbidden body was detected by the accepted evaluation.
    NotDetected,
    /// Forbidden body was detected and was not retained.
    Detected,
}
```

wire为 `not_detected/detected`，不使用 `bool` 或 nullable。Detected强制 safe summary为None，且只允许Rejected/Quarantined；NotDetected本身不证明safe，仍需redaction marker。必测互斥组合与serde。停审: `pass_R06.3`。

### 9.7 `ForbiddenBodyKind`

```rust
/// Finite class of forbidden material detected without retaining that material.
pub enum ForbiddenBodyKind {
    /// A raw request, event, log, metric, trace, or audit payload was present.
    RawPayload,
    /// Secret material or a token was present.
    SecretMaterial,
    /// Credential or authentication material was present.
    CredentialMaterial,
    /// A provider response body or exception body was present.
    ProviderResponseBody,
    /// An external evidence, artifact, archive, or report body was present.
    ExternalObjectBody,
    /// A full sensitive reference or locator crossed a body-free boundary.
    SensitiveReferenceOrLocator,
}
```

wire为 exact lowercase variant；该分类只用于安全decision/record，不输出detected bytes、hash、digest、path或provider message。新增kind需重开forbidden-body negative matrix。停审: `pass_R06.3`。

### 9.8 `ForbiddenBodyEvidence`

```rust
/// Body-free evidence that a safety boundary detected forbidden material.
pub struct ForbiddenBodyEvidence {
    /// Structured source whose candidate material was evaluated.
    pub source_ref: ObservationSourceRef,
    /// Finite class of material that was detected and discarded.
    pub body_kind: ForbiddenBodyKind,
}
```

| 字段 | 来源 | 约束 |
|---|---|---|
| `source_ref` | accepted request/event source metadata | structured ref，不含body/locator |
| `body_kind` | safety scanner finite mapping | 只分类，不包含detected value |

factory `pub fn detected(source_ref: ObservationSourceRef, body_kind: ForbiddenBodyKind) -> Self`。无 raw bytes/string/digest/debug dump；`Debug`只显示source typed id与kind。该value不能进入 public success body，仅供 rejected/quarantine transition与R06.5 record factory。必测全部kind和serialization无body字段。停审: `pass_R06.3`。

### 9.9 `ReceivedMaterialSummary`

```rust
/// Body-free summary of candidate material passed into safety evaluation.
pub struct ReceivedMaterialSummary {
    /// Structured source boundary for the candidate material.
    pub source_ref: ObservationSourceRef,
    /// Safe summary identity when redaction or clean extraction succeeded.
    pub safe_summary_ref: Option<SafeSignalSummaryRef>,
    /// Redaction result for the safe summary.
    pub redaction_marker: RedactionMarker,
    /// Forbidden-body result for the discarded candidate input.
    pub forbidden_body: ForbiddenBodyFlag,
}
```

| factory | 后置条件 | 失败 |
|---|---|---|
| `pub fn unchecked(source_ref: ObservationSourceRef) -> Self` | summary None、Unchecked、NotDetected | 不失败 |
| `pub fn clean(source_ref: ObservationSourceRef, summary_ref: SafeSignalSummaryRef) -> Result<Self, ProtocolError>` | summary Some、Clean、NotDetected | invalid ref owner |
| `pub fn redacted(source_ref: ObservationSourceRef, summary_ref: SafeSignalSummaryRef) -> Result<Self, ProtocolError>` | summary Some、Redacted、NotDetected | invalid ref owner |
| `pub fn body_blocked(source_ref: ObservationSourceRef) -> Self` | summary None、Unchecked、Detected | 不失败；evidence kind另传transition |

members: `pub fn has_safe_summary(&self) -> bool`、`pub fn requires_quarantine(&self) -> bool`、`pub fn safe_summary_ref(&self) -> Option<&SafeSignalSummaryRef>`。禁止保存raw body、label map、attribute map、hash/base64/provider payload或redaction rule body。组合构造只能走factory；rehydrate同样验证组合。必测四factory、所有非法组合、debug无body。停审: `pass_R06.3`。

### 9.10 `SafetyEvaluationContext`

```rust
/// Body-free context used to evaluate one candidate material summary.
pub struct SafetyEvaluationContext {
    /// Trusted actor or system principal responsible for the evaluation.
    pub actor_ref: ActorSafeRef,
    /// Declared observation-side purpose.
    pub submission_purpose: SubmissionPurpose,
    /// Optional prevalidated visibility constraint snapshot.
    pub visibility_constraint_ref: Option<VisibilityConstraintRef>,
}
```

factory `pub fn for_intake(actor_ref: ActorSafeRef, submission_purpose: SubmissionPurpose, visibility_constraint_ref: Option<VisibilityConstraintRef>) -> Self`。source family从 `ReceivedMaterialSummary.source_ref`读取，不在context重复保存；policy/config snapshot body不进入对象。context不授权actor、不绕过source/purpose compatibility，也不保存redaction implementation。必测optional constraint与actor display-name exclusion。停审: `pass_R06.3`。

### 9.11 `SafetyDispositionTransition`

```rust
/// Complete body-free safety-disposition revision captured before one mutation.
pub struct SafetyDispositionTransitionSnapshot {
    pub(crate) disposition_ref: SafetyDispositionRef,
    pub(crate) receipt_ref: ObservationReceiptRef,
    pub(crate) state: SafetyDispositionState,
    pub(crate) redaction_marker: RedactionMarker,
    pub(crate) forbidden_body: ForbiddenBodyFlag,
    pub(crate) sanitized_summary_ref: Option<SafeSignalSummaryRef>,
}

/// Accepted state change emitted by a safety disposition.
pub enum SafetyDispositionTransition {
    /// A clean safe summary made the disposition safe.
    MarkedSafe {
        previous: SafetyDispositionTransitionSnapshot,
        disposition_ref: SafetyDispositionRef,
        receipt_ref: ObservationReceiptRef,
        from: SafetyDispositionState,
        summary_ref: SafeSignalSummaryRef,
    },
    /// A redacted safe summary made the disposition usable.
    MarkedRedacted {
        previous: SafetyDispositionTransitionSnapshot,
        disposition_ref: SafetyDispositionRef,
        receipt_ref: ObservationReceiptRef,
        from: SafetyDispositionState,
        marker: RedactionMarker,
        summary_ref: SafeSignalSummaryRef,
    },
    /// Forbidden material caused a safety rejection.
    RejectedUnsafe {
        previous: SafetyDispositionTransitionSnapshot,
        disposition_ref: SafetyDispositionRef,
        receipt_ref: ObservationReceiptRef,
        from: SafetyDispositionState,
        evidence: ForbiddenBodyEvidence,
    },
    /// Safety evaluation isolated the material.
    Quarantined {
        previous: SafetyDispositionTransitionSnapshot,
        disposition_ref: SafetyDispositionRef,
        receipt_ref: ObservationReceiptRef,
        from: SafetyDispositionState,
        reason: QuarantineReason,
        evidence: Option<ForbiddenBodyEvidence>,
    },
}
```

owner为 `domain::safety`；每个variant的`previous.disposition_ref/receipt_ref`和显式subject必须等于owning object及其immutable relation，previous state必须等于`from`，target state由variant固定。MarkedSafe只允许Clean语义，MarkedRedacted的marker必须Redacted；RejectedUnsafe不保留body。`Quarantined`在reason为`ForbiddenBodyDetected`时必须携带`Some(ForbiddenBodyEvidence)`，其他reason必须为`None`；typed evidence只保留finite body class，不保留正文、hash或provider payload。delta不带actor/time/record。R06.5 intake record factory消费。必测每variant、typed subject、complete previous/post、marker/evidence矩阵和illegal source zero delta。停审: `pass_R06.5-F_affected_sync`。

### 9.12 `TraceCorrelationRef`

```rust
/// Body-free trace correlation token validated for observation-side use.
pub struct TraceCorrelationRef(BodyFreeRef);
```

owner为 `contracts::refs`；复用R06.2 TC constructor/member/wire/debug规则。它不是 core `TraceId` 的type alias，core exact accessor未收稳前不定义伪造 `From<TraceId>`；Step 08 mapper只能从可信metadata提取并经过BodyFreeRef校验。不得由span body、trace URL或provider trace object构造。必测与`CorrelationContextRef`/`CausationRef`不可互换。停审: `pass_R06.3`。

### 9.13 `CausationRef`

```rust
/// Body-free causation token used only within an observation correlation context.
pub struct CausationRef(BodyFreeRef);
```

owner、factory/member/wire复用TC模板。它不证明业务因果关系，只记录上游提供的opaque causation线索；不得从timestamp、cursor、trace id或event body猜出。必测owner mismatch、locator拒绝、debug redaction。停审: `pass_R06.3`。

### 9.14 `CorrelationSeed`

```rust
/// Validated body-free hints awaiting binding into a correlation context.
pub struct CorrelationSeed {
    /// Optional trace correlation hint.
    pub trace_ref: Option<TraceCorrelationRef>,
    /// Optional causation hint.
    pub causation_ref: Option<CausationRef>,
    /// Optional identity-safe subject reference.
    pub subject_ref: Option<SubjectObservationReference>,
    /// Optional runtime or sandbox safe-signal boundary reference.
    pub runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}
```

factory `pub fn new(trace_ref: Option<TraceCorrelationRef>, causation_ref: Option<CausationRef>, subject_ref: Option<SubjectObservationReference>, runtime_signal_ref: Option<RuntimeSandboxSignalRef>) -> Result<Self, ProtocolError>` 要求四字段至少一个 `Some`；empty或structured ref state组合不合法返回 `ProtocolError::InvalidCarrierState`，不得依赖domain error。不接受raw trace/span/event/actor body。members: `pub fn is_empty(&self) -> bool`恒false、`pub fn has_subject(&self) -> bool`、`pub fn has_runtime_signal(&self) -> bool`。seed是待验证hint，不是Bound context；`CorrelationContext::from_receipt`保存为pending seed，`bind_seed`成功后清空pending并复制active fields。必测16种presence组合中的empty拒绝、structured ref state不合法拒绝与canonical serialization。停审: `pass_R06.3`。

### 9.15 `CorrelationGapReason`

```rust
/// Finite reason for a usable but partial correlation context.
pub enum CorrelationGapReason {
    /// No validated trace hint is available.
    MissingTrace,
    /// No validated causation hint is available.
    MissingCausation,
    /// No identity-safe subject reference is available.
    MissingSubject,
    /// The runtime or sandbox safe-signal reference is unavailable.
    RuntimeSignalUnavailable,
    /// The structured source reference is stale.
    SourceReferenceStale,
}
```

wire分别为 `missing_trace/missing_causation/missing_subject/runtime_signal_unavailable/source_reference_stale`。reason只解释local Partial，不生成 R06.4 GapState，也不声明外部缺失事实；若需durable gap，由application另行创建。必测5 token与Partial mapping。停审: `pass_R06.3`。

### 9.16 `CorrelationInvalidReason`

```rust
/// Finite reason for invalidating a correlation context.
pub enum CorrelationInvalidReason {
    /// The supplied source does not match the receipt source.
    SourceMismatch,
    /// A trace hint conflicts with the active trace binding.
    ConflictingTrace,
    /// A causation hint conflicts with the active causation binding.
    ConflictingCausation,
    /// A subject reference crossed its identity-safe boundary.
    SubjectBoundaryViolation,
    /// A runtime reference crossed its execution-truth boundary.
    RuntimeBoundaryViolation,
}
```

wire为 exact lowercase variant。Invalid reason只描述本仓binding冲突，不裁决业务关系、runtime execution或Identity truth。必测5 reason到Invalid、Invalid terminal和无raw conflict value。停审: `pass_R06.3`。

### 9.17 `CorrelationContextTransition`

```rust
/// Complete body-free correlation revision captured immediately before a mutation.
pub struct CorrelationContextTransitionSnapshot {
    pub(crate) context_ref: CorrelationContextRef,
    pub(crate) receipt_ref: ObservationReceiptRef,
    pub(crate) source_ref: ObservationSourceRef,
    pub(crate) state: CorrelationContextState,
    pub(crate) pending_seed: Option<CorrelationSeed>,
    pub(crate) trace_ref: Option<TraceCorrelationRef>,
    pub(crate) causation_ref: Option<CausationRef>,
    pub(crate) subject_ref: Option<SubjectObservationReference>,
    pub(crate) runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}

/// Accepted state or binding change emitted by a correlation context.
pub enum CorrelationContextTransition {
    /// The pending seed established the active body-free bindings.
    SeedBound {
        previous: CorrelationContextTransitionSnapshot,
        from: CorrelationContextState,
        trace_ref: Option<TraceCorrelationRef>,
        causation_ref: Option<CausationRef>,
        subject_ref: Option<SubjectObservationReference>,
        runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
    },
    /// A runtime or sandbox reference was appended without changing state.
    RuntimeSignalLinked {
        previous: CorrelationContextTransitionSnapshot,
        state: CorrelationContextState,
        runtime_signal_ref: RuntimeSandboxSignalRef,
    },
    /// The context became explicitly partial.
    Degraded {
        previous: CorrelationContextTransitionSnapshot,
        from: CorrelationContextState,
        reason: CorrelationGapReason,
    },
    /// The context became permanently invalid.
    Invalidated {
        previous: CorrelationContextTransitionSnapshot,
        from: CorrelationContextState,
        reason: CorrelationInvalidReason,
    },
}
```

owner为 `domain::correlation`。每个variant在mutation前逐字段复制`previous`，其state必须等于`from/state`；post-state提供完整current revision。SeedBound target为Bound；Partial seed由factory/bind前的policy失败转成Degraded而不是带隐藏默认。RuntimeSignalLinked只允许Bound且不得替换conflicting ref。snapshot字段private、无serde/default/public field constructor，不是第二truth。R06.5 correlation record factory补record metadata。必测previous/post完整性、payload/state组合、same-ref idempotent no-op由application处理而非重复delta。停审: `pass_R06.5-F_affected_sync`。

### 9.18 `SafeSignalKind`

```rust
/// Body-free public family of an accepted safe signal.
pub enum SafeSignalKind {
    /// Redacted log-like observation summary.
    Log,
    /// Bounded metric-like observation summary without raw series material.
    Metric,
    /// Redacted trace-like observation summary without span bodies.
    Trace,
    /// Cross-family safe summary that does not claim a raw backend kind.
    Summary,
}
```

wire为 `log/metric/trace/summary`。kind来自typed command/event payload与producer compatibility table；不允许provider-specific kind、dynamic metric name、log category或span operation作为variant。kind不证明原始backend record存在。必测4 token、producer compatibility、unknown/product token拒绝。停审: `pass_R06.3`。

### 9.19 `SignalSuppressionReason`

```rust
/// Finite reason for excluding a safe signal from normal output.
pub enum SignalSuppressionReason {
    /// Safety or redaction has not produced an eligible summary.
    SafetyBoundaryNotClosed,
    /// The associated correlation context is invalid.
    CorrelationInvalid,
    /// Visibility policy excludes the signal from normal output.
    VisibilityRestricted,
    /// The signal kind is incompatible with the accepted source.
    UnsupportedSignalKind,
    /// A label-safety rule rejected unbounded or sensitive cardinality.
    UnsafeLabelCardinality,
    /// A required body-free reference is unavailable.
    ReferenceUnavailable,
}
```

wire为 exact lowercase variant。`UnsafeLabelCardinality`只保存分类，不保存label/key/value；`ReferenceUnavailable`不等于source missing。reason用于terminal Suppressed transition、diagnostic和R06.5 record，不携带free-text。停审: `pass_R06.3`。

### 9.20 `SignalDecisionKind`

```rust
/// Stable result produced by the safe-signal policy.
pub enum SignalDecisionKind {
    /// The candidate may become a recorded safe signal.
    Record,
    /// The candidate must become terminally suppressed.
    Suppress(SignalSuppressionReason),
}
```

wire是tagged `record`或`suppress` + typed reason。缺少summary或暂时 unavailable 应返回typed error/delayed outcome，不增加 `Defer` variant并把Candidate持久化为成功。

### 9.21 `SignalDecision`

```rust
/// Target-bound safe-signal policy result.
pub struct SignalDecision {
    /// Exact immutable policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,
    /// Candidate signal governed by this decision.
    signal_ref: SafeSignalRef,
    /// Exact signal state observed before mutation.
    observed_signal_state: SafeSignalState,
    /// Complete correlation revision evaluated with the candidate.
    correlation_snapshot: SignalCorrelationSnapshot,
    /// Exact safe summary assessed by the policy.
    summary_ref: SafeSignalSummaryRef,
    /// Exact finite signal kind assessed by the policy.
    signal_kind: SafeSignalKind,
    /// Body-free label-safety assessment returned by the trusted resolver.
    label_assessment: SafeLabelAssessment,
    /// Complete optional runtime boundary revision observed by the policy.
    runtime_signal_snapshot: Option<RuntimeSandboxSignalRef>,
    /// Finite record-or-suppress result.
    kind: SignalDecisionKind,
}
```

R06.5 `SafeSignalPolicy`是唯一producer；`pub(crate) fn new(...) -> Self`只允许P3调用，entry/application/config/infra不得直接构造或反序列化。`applies_to(&self, signal: &SafeSignal, context: &CorrelationContext, assessment: &SafeSignalEvaluationSnapshot) -> bool`必须逐字段比较target/state、完整correlation snapshot、summary/kind/label assessment与完整optional runtime snapshot；另提供只读`kind()`与`policy_basis()`。H2 sibling records module使用`pub(crate) fn proves_accepted_transition(&self, transition: &SafeSignalTransition, post_signal: &SafeSignal, context: &CorrelationContext) -> bool`比较stored pre-snapshot、Record outcome、transition previous/change与post-state，不重新执行P3或label resolver；只接受Recorded branch。decision不保存policy body、rule set、label map或execution id。必测target/context/basis/stale snapshot mismatch、两kind与payload mismatch。停审: `pass_R06.5-F_affected_sync`。完整support type与producer契约见R06.5专项§23。

### 9.22 `SafeSignalTransition`

```rust
/// Complete body-free safe-signal revision captured before one accepted mutation.
pub struct SafeSignalTransitionSnapshot {
    pub(crate) signal_ref: SafeSignalRef,
    pub(crate) signal_kind: SafeSignalKind,
    pub(crate) correlation_context_ref: CorrelationContextRef,
    pub(crate) state: SafeSignalState,
    pub(crate) summary_ref: SafeSignalSummaryRef,
    pub(crate) runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}

/// Accepted state change emitted by a safe signal.
pub enum SafeSignalTransition {
    /// The policy accepted the candidate as a committed safe signal.
    Recorded {
        previous: SafeSignalTransitionSnapshot,
        signal_ref: SafeSignalRef,
        correlation_context_ref: CorrelationContextRef,
        from: SafeSignalState,
        summary_ref: SafeSignalSummaryRef,
    },
    /// A committed dependency made the recorded signal stale.
    MarkedStale {
        previous: SafeSignalTransitionSnapshot,
        signal_ref: SafeSignalRef,
        correlation_context_ref: CorrelationContextRef,
        from: SafeSignalState,
        reason: ReferenceStaleReason,
    },
    /// A newly validated safe summary restored a stale signal.
    Revalidated {
        previous: SafeSignalTransitionSnapshot,
        signal_ref: SafeSignalRef,
        correlation_context_ref: CorrelationContextRef,
        from: SafeSignalState,
        summary_ref: SafeSignalSummaryRef,
    },
    /// A finite safety or visibility reason terminally suppressed the signal.
    Suppressed {
        previous: SafeSignalTransitionSnapshot,
        signal_ref: SafeSignalRef,
        correlation_context_ref: CorrelationContextRef,
        from: SafeSignalState,
        reason: SignalSuppressionReason,
    },
}
```

每个variant在mutation前逐字段复制`previous`；其`signal_ref/correlation_context_ref/state`必须等于variant subject/from，并与same-UoW post signal保持immutable relation。target分别固定Recorded/Stale/Recorded/Suppressed。delta不创建outbox、rollup或record；application在同一UoW消费 committed delta。Revalidated必须有新resolver-accepted summary ref，且previous snapshot保留被替换的summary，不能只切state。必测四variant、typed subject、完整previous/post、Candidate不可mark stale、Suppressed terminal、failed decision zero delta。停审: `pass_R06.5-F_affected_sync`。

### 9.23 `SignalRollupScope`

```rust
/// Canonical scope for one homogeneous safe-signal rollup family.
pub struct SignalRollupScope {
    /// Existing public projection selection scope.
    pub projection_scope: ObservationProjectionScope,
    /// Exact signal kind included in this rollup.
    pub signal_kind: SafeSignalKind,
}
```

factory `pub fn new(projection_scope: ObservationProjectionScope, signal_kind: SafeSignalKind) -> Result<Self, ProtocolError>` 只接受 `ByObservation` / `ByCorrelation`；其他 projection scope 返回 `ProtocolError::InvalidScope`。member `pub fn canonical_lookup_bytes(&self) -> Vec<u8>`编码scope tag/payload + kind token。一个window不能混合kind；需要跨kind summary时由application组装多个window/view，不引入`All`。scope可作repository unique key，但不得hash为window identity。必测2 allowed scope x 4 kind、3 denied scope、canonical bytes与wrong payload。停审: `pass_R06.3`。

### 9.24 `RollupWindowKind`

```rust
/// Declared time-window family for a safe-signal rollup.
pub enum RollupWindowKind {
    /// A fixed one-minute UTC window.
    OneMinute,
    /// A fixed one-hour UTC window.
    OneHour,
    /// A fixed one-day UTC window.
    OneDay,
    /// A validated custom closed-open UTC window.
    Custom,
}
```

wire为 `one_minute/one_hour/one_day/custom`。固定kind要求 `window_end_at - window_start_at` 精确匹配；Custom只要求start < end，具体允许区间由Step14 validated config限制，但配置不能改变body-free/source边界。timezone始终UTC。停审: `pass_R06.3`。

### 9.25 `SignalCount`

```rust
/// Bounded count of committed safe signals included in one rollup.
pub struct SignalCount(u64);
```

factories / members 为 `pub const fn zero() -> Self`、`pub const fn from_u64(value: u64) -> Self`、`pub fn checked_increment(self) -> Option<Self>`、`pub fn checked_add(self, other: Self) -> Option<Self>`、`pub const fn get(self) -> u64`。contracts value overflow返回 `None`，不得依赖 `DomainError`、saturate或wrap；`SignalRollupWindow` 在mutation前把 `None` 映射为 `DomainError::RollupInvariantViolation` 并保持对象不变。count只含Recorded且scope/window匹配的distinct committed signal；不从metric value、sample count或event-reported count复制。必测0/1/u64::MAX/overflow以及domain zero-mutation mapping。停审: `pass_R06.3`。

### 9.26 `MaintenanceFailureReason`

```rust
/// Product-neutral reason for a derived maintenance failure.
pub enum MaintenanceFailureReason {
    /// A required committed source snapshot is unavailable.
    SourceSnapshotUnavailable,
    /// The supplied cursor conflicts with the committed snapshot.
    CursorMismatch,
    /// The rebuilt range does not cover the committed target.
    IncompleteCommittedRange,
    /// The rebuilt result violates count, scope, or state invariants.
    InvalidRebuildResult,
    /// A required product-neutral dependency is unavailable.
    DependencyUnavailable,
}
```

wire为 exact lowercase variant。infra/network/provider error先由application映射到finite reason和safe issue ref，reason本身不带message。它可用于rollup、projection和R06.4 maintenance state，但不声称source operation失败。停审: `pass_R06.3`。

### 9.27 `SignalRollupTransition`

```rust
/// Complete pre-mutation body-free snapshot carried by one rollup delta.
pub struct SignalRollupRevisionSnapshot {
    window_ref: SignalRollupWindowRef,
    scope: SignalRollupScope,
    window_kind: RollupWindowKind,
    window_start_at: ObservedAt,
    window_end_at: ObservedAt,
    state: SignalRollupState,
    signal_count: SignalCount,
    source_cursor: Option<ObservationCursor>,
    signal_refs: SafeSignalRefSet,
}

/// Accepted state or coverage change emitted by a signal rollup window.
pub enum SignalRollupTransition {
    /// One distinct committed safe signal changed the rollup coverage.
    SignalAccepted {
        previous: SignalRollupRevisionSnapshot,
        signal_ref: SafeSignalRef,
        committed_cursor: ObservationCursor,
        resulting_state: SignalRollupState,
        resulting_count: SignalCount,
    },
    /// A target-bound committed snapshot proved the rollup fresh.
    SealedFresh {
        previous: SignalRollupRevisionSnapshot,
        included_through: Option<ObservationCursor>,
    },
    /// A compatible maintenance target moved the window into rebuilding.
    RebuildStarted {
        previous: SignalRollupRevisionSnapshot,
        target_ref: MaintenanceTargetRef,
    },
    /// A finite maintenance reason ended the active rebuild as failed.
    RebuildFailed {
        previous: SignalRollupRevisionSnapshot,
        reason: MaintenanceFailureReason,
    },
}
```

`SignalRollupRevisionSnapshot` is constructed by the owning `SignalRollupWindow` immediately before a successful mutation and is private to the domain transition/record assembly boundary. It is not a second rollup truth object, a public view, or a persisted row. The same-UoW post-state supplies the complete after revision. `SignalAccepted` retains the accepted signal and committed cursor as its change payload; its `resulting_state` and `resulting_count` must equal the post-state. The other variants retain the exact pre-state even when only lifecycle state changes. A failed or duplicate mutation produces no transition and therefore no H11 record. R06.4 execution state and R06.5 record factories consume this delta; the window does not create a job report. 停审: `pass_R06.3` plus `R06.5-G_H11_affected_definition`。

### 9.28 `SignalRollupCoverage`

```rust
/// Target-bound committed snapshot used to prove a rollup is complete.
pub struct SignalRollupCoverage {
    /// Rollup window proved by this snapshot.
    pub window_ref: SignalRollupWindowRef,
    /// Exact scope proved by this snapshot.
    pub scope: SignalRollupScope,
    /// Committed upper cursor, absent only for a proven empty scope.
    pub target_cursor: Option<ObservationCursor>,
    /// Number of distinct committed signals in the scope and window.
    pub expected_signal_count: SignalCount,
}
```

application基于同一 repository read snapshot、scope membership和committed upper cursor构造；该carrier不包含raw signal body或任意signal list。factory `pub fn from_committed_snapshot(window_ref: SignalRollupWindowRef, scope: SignalRollupScope, target_cursor: Option<ObservationCursor>, expected_signal_count: SignalCount) -> Result<Self, DomainError>` 验证empty scope要求cursor None/count zero、non-empty要求cursor Some/count > 0。member `pub fn applies_to(&self, window_ref: &SignalRollupWindowRef, scope: &SignalRollupScope) -> bool`必须精确匹配。window seal只有在自身count/cursor与coverage相等时成功，否则`DomainError::RollupIncomplete`。它不是public DTO，不由entry/config构造。停审: `pass_R06.3`。

### 9.29 `SourceAuditRef`

```rust
/// Body-free source-audit identity imported through a trusted boundary.
pub struct SourceAuditRef(BodyFreeRef);
```

owner为 `contracts::refs`，复用TC validation/wire/debug；source为trusted audit event envelope或resolver snapshot。它不是`AuditProjectionRef`、Governance audit truth、event body、topic/partition/offset或provider audit object。必测owner mismatch、locator/body拒绝。停审: `pass_R06.3`。

### 9.30 `AuditAppendRecordRef`

```rust
/// Stable identity reserved for one append-only local audit record.
pub struct AuditAppendRecordRef(BodyFreeRef);
```

owner为 `contracts::refs`；application id generator在调用aggregate mutation和R06.5 record factory前生成同一个ref。不得由projection ref + cursor/digest拼接，不等于outbox/event/evidence ref。TC factory/member/wire同R06.2。停审: `pass_R06.3`。

### 9.31 `AuditAppendKind`

```rust
/// Finite append classifier shared by audit records and timeline entries.
pub enum AuditAppendKind {
    /// The source-audit safe summary became a local projection fact.
    SourceFactAppended,
    /// A body-free evidence linkage was appended.
    EvidenceLinkageAppended,
    /// Public projection visibility became restricted.
    VisibilityRestricted,
    /// Public projection visibility was restored.
    VisibilityRestored,
    /// A typed gap reference was appended without changing lifecycle state.
    GapAttached,
}
```

wire为 `source_fact_appended/evidence_linkage_appended/visibility_restricted/visibility_restored/gap_attached`。owner为 `contracts::metadata`，因为public timeline和R06.5 persisted record同时使用。增加kind必须同步projection member、record factory、timeline组合和Step10/16，禁止record使用free-text change kind。停审: `pass_R06.3`。

### 9.32 `AuditProjectionTransition`

```rust
/// Complete body-free audit-projection revision captured before one accepted append.
pub struct AuditProjectionTransitionSnapshot {
    pub(crate) projection_ref: AuditProjectionRef,
    pub(crate) subject_ref: AuditSubjectRef,
    pub(crate) correlation_context_ref: CorrelationContextRef,
    pub(crate) source_audit_ref: SourceAuditRef,
    pub(crate) source_audit_summary_ref: SafeExternalSummaryRef,
    pub(crate) state: AuditProjectionState,
    pub(crate) source_fact_appended: bool,
    pub(crate) latest_append_record_ref: Option<AuditAppendRecordRef>,
    pub(crate) linkage_refs: EvidenceLinkageRefSet,
    pub(crate) gap_refs: GapStateRefSet,
    pub(crate) visibility_reason: Option<EvidenceVisibilityReason>,
}

/// Accepted append-only change emitted by an audit projection.
pub enum AuditProjectionTransition {
    /// The source-audit safe summary became the projection's first local fact.
    SourceFactAppended {
        previous: AuditProjectionTransitionSnapshot,
        from: AuditProjectionState,
        append_record_ref: AuditAppendRecordRef,
    },
    /// A validated body-free evidence linkage was appended to the projection.
    EvidenceLinkageAppended {
        previous: AuditProjectionTransitionSnapshot,
        from: AuditProjectionState,
        append_record_ref: AuditAppendRecordRef,
        linkage_ref: EvidenceLinkageRef,
    },
    /// A target-bound decision restricted public projection visibility.
    VisibilityRestricted {
        previous: AuditProjectionTransitionSnapshot,
        from: AuditProjectionState,
        append_record_ref: AuditAppendRecordRef,
        reason: EvidenceVisibilityReason,
    },
    /// A target-bound decision restored an already founded projection.
    VisibilityRestored {
        previous: AuditProjectionTransitionSnapshot,
        from: AuditProjectionState,
        append_record_ref: AuditAppendRecordRef,
    },
    /// A typed gap was appended without changing lifecycle state.
    GapAttached {
        previous: AuditProjectionTransitionSnapshot,
        state: AuditProjectionState,
        append_record_ref: AuditAppendRecordRef,
        gap_ref: GapStateRef,
    },
}
```

`SourceFactAppended` 在 `from=PendingAppend` 时target为Appended，在 `from=VisibilityRestricted` 时仍为VisibilityRestricted；`EvidenceLinkageAppended` 保持其 `from`（Appended或VisibilityRestricted）；`VisibilityRestored` target为Appended；`VisibilityRestricted` target为VisibilityRestricted；`GapAttached`保持其 `state`。所有variant在mutation前逐字段复制`previous`；它保存exact old append head、linkage/gap set和visibility reason，使R06.5 H3无需从post-state做集合减法或猜被清除字段。snapshot state必须等于`from/state`，immutable relation必须与post-state exact。append record ref在mutation前由application预留，成功后必须在同一UoW生成/保存R06.5 `AuditAppendRecord`；mutation失败则不得保存预留ref。delta不含source audit body。停审: `pass_R06.5-F_affected_sync`。

### 9.33 `EvidenceConsumerPurpose`

```rust
/// Finite observation-side purpose for consuming a body-free evidence linkage.
pub enum EvidenceConsumerPurpose {
    /// Support local audit traceability.
    AuditTraceability,
    /// Support explain-only diagnostic output.
    DiagnosticExplanation,
    /// Supply an immutable report-handoff input.
    ReportHandoffInput,
    /// Supply a product-neutral external-audit preparation.
    ExternalAuditPreparation,
}
```

wire为 `audit_traceability/diagnostic_explanation/report_handoff_input/external_audit_preparation`。purpose进入linkage canonical unique key和immutable evidence input；不等于verdict、acceptance、archive eligibility或real evidence claim。新增purpose需重开visibility/handoff/export policy。停审: `pass_R06.3`。

### 9.34 `EvidenceConsumerScope`

```rust
/// Consumer and selection scope used to evaluate evidence visibility.
pub struct EvidenceConsumerScope {
    /// Typed logical consumer retaining its full owner discriminator.
    pub consumer_ref: ObservationConsumerRef,
    /// Product-neutral scope selected for that consumer.
    pub consumer_scope: ConsumerScope,
    /// Exact evidence-use purpose.
    pub purpose: EvidenceConsumerPurpose,
}
```

factory `pub fn new(consumer_ref: ObservationConsumerRef, consumer_scope: ConsumerScope, purpose: EvidenceConsumerPurpose) -> Result<Self, ProtocolError>` validates `consumer_ref`与`consumer_scope` compatibility：Report/Archive只允许handoff/audit purpose；Peripheral external export只允许ExternalAuditPreparation；ReadModel/Diagnostic不允许handoff purpose。member `pub fn canonical_bytes(&self) -> Vec<u8>`编码full structured consumer + scope + purpose。该scope不授予访问，policy仍需loaded visibility inputs。停审: `pass_R06.3`。

### 9.35 `EvidenceVisibilityOutcome`

```rust
/// Finite body-free visibility outcome produced by an evidence policy.
pub enum EvidenceVisibilityOutcome {
    /// The linkage is visible within the evaluated scope.
    Visible,
    /// The linkage is not visible for the finite typed reason.
    NotVisible(EvidenceVisibilityReason),
}
```

outcome wire为tagged `visible/not_visible`；NotVisible必须带R06.2 finite reason。它不等于missing或authorization truth。

### 9.36 `EvidenceVisibilityDecision`

```rust
/// Target- and scope-bound visibility result for one evidence linkage.
pub struct EvidenceVisibilityDecision {
    /// Exact immutable policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,
    /// Complete linkage revision governed by this decision.
    linkage_snapshot: EvidenceLinkageVisibilitySnapshot,
    /// Complete projection revision observed by the policy.
    projection_snapshot: AuditProjectionVisibilitySnapshot,
    /// Exact refreshed or current boundary assessed by the policy.
    evaluated_boundary: GovernanceArtifactEvidenceReference,
    /// Exact digest assessed with the boundary.
    evaluated_digest: DigestSummary,
    /// Finite visibility outcome.
    outcome: EvidenceVisibilityOutcome,
}
```

R06.5 `EvidenceVisibilityPolicy`是唯一producer；`pub(crate) fn new(...) -> Self`只允许P5调用。`applies_to(&self, linkage: &EvidenceLinkage, projection: &AuditProjection, evaluated_boundary: &GovernanceArtifactEvidenceReference, evaluated_digest: &DigestSummary) -> bool`比较两个complete snapshots及boundary/digest；consumer scope已完整包含在linkage snapshot内，不能另传不同scope。只读方法为`outcome()`与`policy_basis()`。H3 sibling records module使用`pub(crate) fn proves_accepted_transition(&self, transition: &EvidenceLinkageTransition, post_linkage: &EvidenceLinkage, projection: &AuditProjection) -> bool`比较decision pre-snapshots、evaluated boundary/digest、transition previous/change与post linkage；只接受Linked/NotVisible decision-driven branch，不重新evaluate P5。entry/application不得从public reason直接构造。它不携带actor profile、policy body或external reason string。停审: `pass_R06.5-F_affected_sync`。

### 9.37 `AuditProjectionVisibilityDecision`

```rust
/// Target-bound global safety visibility result for one audit projection.
pub struct AuditProjectionVisibilityDecision {
    /// Exact immutable policy snapshot used for this decision.
    policy_basis: PolicyEvaluationBasis,
    /// Complete projection revision governed by this decision.
    projection_snapshot: AuditProjectionVisibilitySnapshot,
    /// Global body-free safety visibility outcome.
    outcome: EvidenceVisibilityOutcome,
}
```

该decision只用于projection全局body-free/safety visibility，不表达单一consumer授权；consumer-specific visibility留在view assembler。`pub(crate) fn new(...) -> Self`只允许P5调用；`applies_to(&self, projection: &AuditProjection, snapshot: &AuditProjectionVisibilitySnapshot) -> bool`逐字段比较complete observed revision，只读方法为`outcome()`与`policy_basis()`。H3 sibling records module使用`pub(crate) fn proves_accepted_transition(&self, transition: &AuditProjectionTransition, post_projection: &AuditProjection) -> bool`比较stored pre-snapshot、Visible/NotVisible outcome、append transition和post projection；只接受VisibilityRestricted/VisibilityRestored，不重新evaluate P5。entry/application不得从public reason直接构造。R06.5 policy producer必须基于projection/source/linkage安全状态。停审: `pass_R06.5-F_affected_sync`。

### 9.38 `BodyBlockedReason`

```rust
/// Finite reason for terminally blocking an evidence linkage body boundary.
pub enum BodyBlockedReason {
    /// A forbidden body crossed the evidence boundary.
    ForbiddenBodyDetected,
    /// A path, URI, endpoint, or other locator was supplied.
    LocatorMaterialDetected,
    /// Credential or authentication material was supplied.
    CredentialMaterialDetected,
    /// A provider payload or response body was supplied.
    ProviderPayloadDetected,
    /// The external reference cannot be represented body-free.
    UnsupportedExternalReference,
}
```

wire为 exact lowercase variant。reason不保存body、locator、credential、provider message或其hash；映射到BodyBlocked terminal与gap/quarantine surface。停审: `pass_R06.3`。

### 9.39 `EvidenceLinkageTransition`

```rust
/// Complete body-free evidence-linkage revision captured before one mutation.
pub struct EvidenceLinkageTransitionSnapshot {
    pub(crate) linkage_ref: EvidenceLinkageRef,
    pub(crate) projection_ref: AuditProjectionRef,
    pub(crate) boundary_ref: GovernanceArtifactEvidenceReference,
    pub(crate) evidence_purpose: EvidenceConsumerPurpose,
    pub(crate) consumer_scope: EvidenceConsumerScope,
    pub(crate) state: EvidenceLinkageState,
    pub(crate) digest_summary: DigestSummary,
    pub(crate) visibility_reason: Option<EvidenceVisibilityReason>,
    pub(crate) body_blocked_reason: Option<BodyBlockedReason>,
}

/// Accepted state change emitted by a body-free evidence linkage.
pub enum EvidenceLinkageTransition {
    /// The target-bound policy made the body-free linkage usable.
    Linked {
        previous: EvidenceLinkageTransitionSnapshot,
        from: EvidenceLinkageState,
    },
    /// Forbidden body material terminally blocked the candidate.
    BodyBlocked {
        previous: EvidenceLinkageTransitionSnapshot,
        from: EvidenceLinkageState,
        reason: BodyBlockedReason,
    },
    /// The external object remained distinct from visibility in this scope.
    NotVisible {
        previous: EvidenceLinkageTransitionSnapshot,
        from: EvidenceLinkageState,
        reason: EvidenceVisibilityReason,
    },
    /// A committed reference or digest snapshot made the linkage stale.
    MarkedStale {
        previous: EvidenceLinkageTransitionSnapshot,
        from: EvidenceLinkageState,
        reason: ReferenceStaleReason,
    },
}
```

target分别为Linked/BodyBlocked/NotVisible/Stale。每个variant在mutation前逐字段复制`previous`；Stale/NotVisible恢复因此保留被替换的boundary/digest/reason，factory不从current linkage猜旧revision。Linked transition清空visibility/body-block reason；BodyBlocked只从Candidate且terminal；NotVisible不生成Missing；MarkedStale不改变digest/boundary ref。snapshot state必须等于`from`，immutable linkage/projection/purpose/scope relation必须与post-state exact。R06.5 record factory补actor/time/trace。停审: `pass_R06.5-F_affected_sync`。

### 9.40 `AuditProjectionRefSet`

```rust
/// Canonical bounded set of observability audit-projection identities.
pub struct AuditProjectionRefSet(Vec<AuditProjectionRef>);
```

| 契约项 | 规则 |
|---|---|
| member/order | `AuditProjectionRef`;按typed discriminator + BodyFreeRef bytes升序 |
| dedup | exact duplicate折叠；wrong owner拒绝 |
| empty | 允许；空timeline/evidence input必须由visibility/gap/freshness解释，不代表full success |
| hard max | 256 |
| factory/member | `pub fn empty() -> Self`;`pub fn try_from_members(members: Vec<AuditProjectionRef>) -> Result<Self, ProtocolError>`;`pub fn try_non_empty(members: Vec<AuditProjectionRef>) -> Result<Self, ProtocolError>`;`pub fn as_slice(&self) -> &[AuditProjectionRef]`;`pub fn contains(&self, projection_ref: &AuditProjectionRef) -> bool`;校验型`try_insert/try_remove`复用R06.2 set outcome |
| tests | 0/256/257、order、dedup、EvidenceLinkageRef误用、stable wire/digest |

owner为 `contracts::refs`;停审: `pass_R06.3`。

### 9.41 `AuditTimelineWindow`

```rust
/// Closed-open UTC time range used to assemble an audit timeline.
pub struct AuditTimelineWindow {
    /// Inclusive UTC start of the timeline window.
    pub start_at: ObservedAt,
    /// Exclusive UTC end of the timeline window.
    pub end_at: ObservedAt,
}
```

factory `pub fn new(start_at: ObservedAt, end_at: ObservedAt) -> Result<Self, ProtocolError>` 要求 `start_at < end_at`；语义为 `[start,end)`。不得使用query execution time补缺、不得用source event time替代recorded append time。members `pub fn contains(&self, observed_at: &ObservedAt) -> bool`、`pub fn canonical_bytes(&self) -> Vec<u8>`。停审: `pass_R06.3`。

### 9.42 `AuditTimelineEntryView`

```rust
/// One body-free append projection entry in a public audit timeline.
pub struct AuditTimelineEntryView {
    /// Append-only local record represented by this entry.
    pub append_record_ref: AuditAppendRecordRef,
    /// Audit projection changed by the append record.
    pub projection_ref: AuditProjectionRef,
    /// Finite classifier of the append operation.
    pub append_kind: AuditAppendKind,
    /// Body-free source-audit identity.
    pub source_audit_ref: SourceAuditRef,
    /// Safe external summary associated with the source audit input.
    pub source_audit_summary_ref: SafeExternalSummaryRef,
    /// Evidence linkage appended by this entry, when required by its kind.
    pub linkage_ref: Option<EvidenceLinkageRef>,
    /// Gap appended by this entry, when required by its kind.
    pub gap_ref: Option<GapStateRef>,
    /// Projection state resulting from the append operation.
    pub projection_state: AuditProjectionState,
    /// Consumer-safe visibility of this entry.
    pub visibility: VisibilitySurface,
    /// Local boundary-clock time of the committed append.
    pub appended_at: ObservedAt,
}
```

factory `pub fn from_fields(append_record_ref: AuditAppendRecordRef, projection_ref: AuditProjectionRef, append_kind: AuditAppendKind, source_audit_ref: SourceAuditRef, source_audit_summary_ref: SafeExternalSummaryRef, linkage_ref: Option<EvidenceLinkageRef>, gap_ref: Option<GapStateRef>, projection_state: AuditProjectionState, visibility: VisibilitySurface, appended_at: ObservedAt) -> Result<Self, ProtocolError>` 只接收repository已加载/record assembler已验证的字段。

| append kind | linkage ref | gap ref |
|---|---|---|
| SourceFactAppended | None | None |
| EvidenceLinkageAppended | Some | None |
| VisibilityRestricted / VisibilityRestored | None | None |
| GapAttached | None | Some |

| append kind | 允许的 `projection_state` |
|---|---|
| SourceFactAppended | Appended或VisibilityRestricted；取决于append前是否已受限 |
| EvidenceLinkageAppended | Appended或VisibilityRestricted；append不得自动恢复visibility |
| VisibilityRestricted | VisibilityRestricted |
| VisibilityRestored | Appended |
| GapAttached | Appended或VisibilityRestricted；必须等于mutation后的同态state；PendingAppend gap record只供internal audit，不组装public entry |

组合不匹配返回`ProtocolError::InvalidCarrierState`。Restricted或limited Degraded时外层assembler可保留经裁剪的body-free entry；NotVisible、Blocked、blocked Degraded必须省略entry且不得转成missing；PendingAppend/Suppressed只允许internal audit record读取，不组装本public view。entry不带source audit body、actor profile或append record body。停审: `pass_R06.3`。

### 9.43 `AuditTimelineEntryList`

```rust
/// Stable ordered page body of public audit timeline entries.
pub struct AuditTimelineEntryList(Vec<AuditTimelineEntryView>);
```

factory `pub fn try_from_entries(entries: Vec<AuditTimelineEntryView>) -> Result<Self, ProtocolError>` 按 `(appended_at ASC, append_record_ref canonical bytes ASC)`排序；同一append record ref在一个page最多一项，但同一projection可出现多次append，保留完整history。完全相同的重复entry折叠，重复append ref且其他字段不同返回 `ProtocolError::ConflictingSetMember`。empty允许，hard max 256。members为 `pub fn as_slice(&self) -> &[AuditTimelineEntryView]`、`pub fn len(&self) -> usize`、`pub fn is_empty(&self) -> bool`。列表排序用于稳定page/digest，不替代repository page cursor；跨page顺序由Step07 repository contract承接。停审: `pass_R06.3`。

## 10. `domain::intake` 对象契约

### 10.1 对象能力映射

| 对象 | 对象能力 | 必需字段 | factory | member | 状态 / 输出 |
|---|---|---|---|---|---|
| `ObservationReceipt` | 建立source-purpose intake fact | receipt/source/purpose/time/state/optional disposition | `receive` | `apply_admission`；裸迁移helper仅module-private | `ObservationReceiptState`;`ObservationReceiptTransition` |

### 10.2 `ObservationReceipt`

```rust
/// Observation-owned admission fact that never owns source material truth.
pub struct ObservationReceipt {
    /// Stable identity generated by observability.
    pub receipt_ref: ObservationReceiptRef,
    /// Structured body-free source boundary.
    pub source_ref: ObservationSourceRef,
    /// Current admission lifecycle value.
    pub admission_state: ObservationReceiptState,
    /// Safety disposition bound by an accepted safety transition.
    pub safety_disposition_ref: Option<SafetyDispositionRef>,
    /// Finite purpose for admitting the material.
    pub submission_purpose: SubmissionPurpose,
    /// Time recorded by the observability boundary clock.
    pub received_at: ObservedAt,
}
```

| 字段 | 唯一来源 | 构造 / mutation约束 |
|---|---|---|
| `receipt_ref` | application id generator | factory前生成；不得由source/event/digest派生 |
| `source_ref` | validated command/event structured ref | immutable；source family/object/snapshot完整保留 |
| `admission_state` | factory / owning member | factory固定Received；外部DTO不能直接写state |
| `safety_disposition_ref` | loaded same-source receipt safety object | factory None；accept时Some；reject/quarantine/degrade不伪造 |
| `submission_purpose` | typed command/event field | immutable；与source family compatibility由R06.5 policy检查 |
| `received_at` | application `ClockPort` | immutable；不使用external occurred_at/DB default |

| factory签名 | 前置 / 后置 | 失败 |
|---|---|---|
| `pub fn receive(receipt_ref: ObservationReceiptRef, source_ref: ObservationSourceRef, purpose: SubmissionPurpose, received_at: ObservedAt) -> Result<Self, DomainError>` | source structured ref不是Invalid；state=Received；disposition=None | missing/invalid ref -> `MissingRequiredReference` / `ReferenceBoundaryViolation` |

| member签名 | 前置 / mutation | 返回 |
|---|---|---|
| `pub fn apply_admission(&mut self, disposition: &SafetyDisposition, decision: &AdmissionDecision) -> Result<ObservationReceiptTransition, DomainError>` | decision的complete receipt snapshot与self逐字段相等；complete post-safety snapshot与disposition逐字段相等且证明同receipt；按Accept/Reject/Quarantine/Degrade total dispatch；任何binding失败zero mutation | exact accepted delta |
| `pub fn is_signal_eligible(&self) -> bool` | 只读 | 仅Accepted为true；Degraded需policy另行评估，不在此函数放行 |
| `pub fn supersede(&mut self, replacement_ref: ObservationReceiptRef) -> Result<ObservationReceiptTransition, DomainError>` | current phase reserved | 总是`ReservedTransition`，不得mutation/delta |

原`accept/reject/quarantine/degrade`保留为`domain::intake` module-private transition helper，只能由`apply_admission`在decision完成basis、target和snapshot绑定后调用；application、entry、config与infra不能直接调用。decision按借用消费，使same-UoW record factory仍可读取policy basis。

#### 10.2.1 invariants / redlines

- 当前唯一键由 Step 11 定为 `(source_ref canonical identity, submission_purpose)`；aggregate不自行查询唯一性。
- accept接收loaded `SafetyDisposition`而非仅ref，避免application传任意ref绕过state/receipt compatibility。
- member不接收actor/time，不创建record/outbox；application用operation context + Clock + delta调用R06.5 record factory。
- Rejected/Quarantined不产生safe signal/audit projection；Degraded不能被 `is_signal_eligible` 当Accepted。
- 不保存raw material、safe summary、request body、event body、source event id或source truth状态。
- 必测factory、四current mutation、disposition mismatch、unsafe disposition、terminal rewrite、reserved supersede、source structured ref invalid。
- 对象停审: `pass_R06.3`。

### 10.3 模块内停审

| 审查项 | 结论 | 证据 / 后置 |
|---|---|---|
| capability有对象承接 | pass | receipt承接intake fact；policy/record分别归R06.5 |
| 字段来源闭合 | pass | 6字段均有typed source/factory/mutation |
| 状态闭合 | pass | §8.1 + exact members；reserved单独标识 |
| source truth / body边界 | pass | source只为structured ref；无body字段 |
| Step 07+ handoff | controlled | repo/version/UoW/record/outbox由Step07/R06.5/Step09闭口 |

## 11. `domain::safety` 对象契约

### 11.1 对象能力映射

| 对象 | 对象能力 | 必需字段 | factory | member | 状态 / 输出 |
|---|---|---|---|---|---|
| `SafetyDisposition` | 记录body-free safety evaluation并控制下游eligibility | disposition/receipt/state/marker/flag/summary | `evaluate` | `apply_decision`；裸迁移helper仅module-private | `SafetyDispositionState`;`SafetyDispositionTransition` |

### 11.2 `SafetyDisposition`

```rust
/// Redaction-first safety disposition for one observation receipt.
pub struct SafetyDisposition {
    /// Stable disposition identity generated by observability.
    pub disposition_ref: SafetyDispositionRef,
    /// Receipt evaluated by this disposition.
    pub receipt_ref: ObservationReceiptRef,
    /// Current finite safety state.
    pub state: SafetyDispositionState,
    /// Redaction result compatible with state and summary presence.
    pub redaction_marker: RedactionMarker,
    /// Forbidden-body detection result.
    pub forbidden_body: ForbiddenBodyFlag,
    /// Optional accepted body-free safe-summary identity.
    pub sanitized_summary_ref: Option<SafeSignalSummaryRef>,
}
```

| 字段 | 唯一来源 | 构造 / mutation约束 |
|---|---|---|
| `disposition_ref` | application id generator | 不从receipt/source/digest派生 |
| `receipt_ref` | loaded receipt | immutable；factory需receipt Received/Degraded |
| `state` | factory/member | initial Pending |
| `redaction_marker` | `ReceivedMaterialSummary` + member | initial使用summary marker；Pending可Unchecked/Clean/Redacted；terminal按§8.2组合 |
| `forbidden_body` | `ReceivedMaterialSummary` | initial copy；Detected只可reject/quarantine |
| `sanitized_summary_ref` | accepted safe resolver output | initial可copy summary；Safe/Redacted必须Some，Rejected/Quarantined必须None |

| factory签名 | 前置 / 后置 |
|---|---|
| `pub fn evaluate(disposition_ref: SafetyDispositionRef, receipt: &ObservationReceipt, summary: ReceivedMaterialSummary, context: &SafetyEvaluationContext) -> Result<Self, DomainError>` | receipt state可评估；summary.source_ref与receipt source exact match；context purpose=receipt purpose；initial Pending；禁止Detected+summary |

| member签名 | 前置 / mutation | 返回 |
|---|---|---|
| `pub fn apply_decision(&mut self, receipt: &ObservationReceipt, decision: &SafetyDispositionDecision) -> Result<SafetyDispositionTransition, DomainError>` | decision的complete receipt与Pending disposition snapshots逐字段匹配；summary/context仍与source/purpose相容；按四种decision kind原子写入terminal state并返回typed delta | exact accepted delta |
| `pub fn is_downstream_eligible(&self) -> bool` | 只读 | Safe/Redacted且summary Some且flag NotDetected |
| `pub fn summary_ref(&self) -> Option<&SafeSignalSummaryRef>` | 只读 | 不读取resolver/body |

原`mark_safe/mark_redacted/reject_unsafe/quarantine`降为`domain::safety` module-private helper。`SafetyDispositionDecisionKind::Quarantine`中`ForbiddenBodyDetected`必须携带`Some(ForbiddenBodyEvidence)`，其他reason必须为`None`；`apply_decision`拒绝不完整矩阵且zero mutation。decision按借用消费，P1随后用其`proves_post_state`验证same-UoW disposition。

#### 11.2.1 invariants / redlines

- `Pending`: marker/summary可反映候选safe extraction，但不具eligibility；Detected时summary必须None。
- `Safe`: Clean + NotDetected + Some；`Redacted`: Redacted + NotDetected + Some。
- `Rejected/Quarantined`: summary None；不得保留ForbiddenBodyEvidence正文，因为evidence本身只有typed source/kind。
- object不执行redaction/scanning，不访问policy/config/resolver；只校验传入body-free summary/context和推进状态。
- 不直接产出handoff、visibility授权、report、audit projection或outbox。
- 必测factory source/purpose mismatch、all valid/invalid state-marker-flag-summary combinations、terminal rewrite、body/debug scan。
- 对象停审: `pass_R06.3`。

### 11.3 模块内停审

| 审查项 | 结论 | 证据 / 后置 |
|---|---|---|
| redaction-first | pass | eligibility要求Safe/Redacted + summary + NotDetected |
| forbidden-body exclusion | pass | evidence只含source/kind；terminal清summary |
| 字段/factory/member | pass | 6字段、1factory、6members exact |
| policy separation | pass | classify规则归R06.5；object只执行accepted transition |
| external truth | pass | 不拥有source/runtime/evidence truth |

## 12. `domain::correlation` 对象契约

### 12.1 对象能力映射

| 对象 | 对象能力 | 必需字段 | factory | member | 状态 / 输出 |
|---|---|---|---|---|---|
| `CorrelationContext` | 将receipt/source与opaque trace/causation/subject/runtime hints绑定为本仓context | context/receipt/source/state/pending+active refs | `from_receipt` | bind_seed/link_runtime/degrade/invalidate | `CorrelationContextState`;`CorrelationContextTransition` |

### 12.2 `CorrelationContext`

```rust
/// Observation-side correlation context that never upgrades opaque hints into business truth.
pub struct CorrelationContext {
    /// Stable context identity generated by observability.
    pub context_ref: CorrelationContextRef,
    /// Receipt whose observation-side facts anchor this context.
    pub receipt_ref: ObservationReceiptRef,
    /// Immutable structured source copied from the anchoring receipt.
    pub source_ref: ObservationSourceRef,
    /// Current local correlation availability.
    pub state: CorrelationContextState,
    /// Validated hints waiting to become active bindings.
    pub pending_seed: Option<CorrelationSeed>,
    /// Active body-free trace correlation hint.
    pub trace_ref: Option<TraceCorrelationRef>,
    /// Active opaque causation hint.
    pub causation_ref: Option<CausationRef>,
    /// Active identity-safe subject snapshot.
    pub subject_ref: Option<SubjectObservationReference>,
    /// Active runtime or sandbox safe-signal boundary reference.
    pub runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}
```

| 字段 | 唯一来源 | 约束 |
|---|---|---|
| `context_ref` | application id generator | immutable；不从trace/receipt派生 |
| `receipt_ref` | loaded receipt | immutable；只允许Accepted；Degraded必须先通过receipt正式迁移为Accepted |
| `source_ref` | exact copy from receipt | immutable；bind不能替换source object/family |
| `state` | factory/member | initial Unbound |
| `pending_seed` | factory typed seed | Unbound/Partial可Some；Bound/Invalid必须None |
| active optional refs | validated seed/member | Bound至少一个active hint；不得与pending重复冲突 |

| factory签名 | 前置 / 后置 |
|---|---|
| `pub fn from_receipt(context_ref: CorrelationContextRef, receipt: &ObservationReceipt, seed: CorrelationSeed) -> Result<Self, DomainError>` | receipt必须Accepted；copy receipt/source；state Unbound；pending_seed Some；active refs None；Degraded/Rejected/Quarantined/Received全部拒绝且不创建context |

| member签名 | 前置 / mutation | 返回 |
|---|---|---|
| `pub fn bind_seed(&mut self) -> Result<CorrelationContextTransition, DomainError>` | Unbound/Partial且pending Some；验证structured ref非Invalid、source compatibility；复制active refs、清pending、写Bound | SeedBound |
| `pub fn replace_partial_seed(&mut self, seed: CorrelationSeed) -> Result<(), DomainError>` | 仅Partial；seed不能与active ref冲突；更新pending，不改state/不产生record delta | `()` |
| `pub fn link_runtime_signal(&mut self, runtime_ref: RuntimeSandboxSignalRef) -> Result<CorrelationContextTransition, DomainError>` | Bound；available/degraded body-free ref；existing None或same identity；写Some | RuntimeSignalLinked |
| `pub fn degrade(&mut self, reason: CorrelationGapReason) -> Result<CorrelationContextTransition, DomainError>` | Unbound/Bound；写Partial；保留active refs | Degraded |
| `pub fn invalidate(&mut self, reason: CorrelationInvalidReason) -> Result<CorrelationContextTransition, DomainError>` | any non-Invalid；写Invalid、清pending；active refs保留作历史解释 | Invalidated |
| `pub fn is_usable(&self) -> bool` | 只读 | Bound true；Partial由policy决定，不在此函数放行 |
| `pub fn has_conflict_with(&self, seed: &CorrelationSeed) -> bool` | 只读typed comparison | 不访问Identity/runtime/source body |

#### 12.2.1 invariants / redlines

- factory保留概要 `from_receipt(..., seed)` 输入，同时保持正式状态初始Unbound；seed不是丢弃参数，而是pending typed field。
- Bound至少一个active trace/causation/subject/runtime ref，且pending None；Invalid不可重开。
- `TraceCorrelationRef`与core `TraceId`、`CorrelationContextRef`和business correlation id完全不同。
- Subject structured ref只保存Identity-safe snapshot，不复制actor profile/PII；runtime ref不证明execution success。
- source_ref不能由bind替换；不同source必须新建context或invalidate。
- member不返回/创建business relation、source update、runtime mutation、record/outbox。
- 必测Unbound seed bind、Partial replacement/recovery、same runtime idempotency由application处理、conflicting runtime、source mismatch、Invalid terminal、body-free serialization。
- 对象停审: `pass_R06.3`。

### 12.3 模块内停审

| 审查项 | 结论 | 证据 / 后置 |
|---|---|---|
| seed字段来源 | pass | factory保存pending，不丢参数、不隐式Bound |
| state/trigger | pass | §8.3 + bind/degrade/invalidate/current recovery |
| opaque boundary | pass | trace/causation TC；subject/runtime structured safe refs |
| truth ownership | pass | 不拥有Identity/runtime/business relation truth |
| record handoff | controlled | typed delta -> R06.5 correlation record factory |

## 13. `domain::signal` 对象契约

### 13.1 对象能力映射

| 对象 | 对象能力 | 必需字段 | factory | member | 状态 / 输出 |
|---|---|---|---|---|---|
| `SafeSignal` | 将safe summary与correlation/runtime boundary收敛为本仓signal | signal/kind/context/summary/runtime/state | `from_summary` | apply_decision/mark_stale/revalidate/is_exportable | `SafeSignalState`;`SafeSignalTransition` |
| `SignalRollupWindow` | 对committed Recorded signal做scope/kind去重计数和cursor freshness | window/scope/kind/time/state/count/cursor/member set | `open` | accept_signal/seal/reopen/fail | `SignalRollupState`;`SignalRollupTransition` |

### 13.2 `SafeSignal`

```rust
/// Body-free log, metric, trace, or summary signal owned by observability.
pub struct SafeSignal {
    /// Stable signal identity generated by observability.
    pub signal_ref: SafeSignalRef,
    /// Product-neutral safe-signal family.
    pub signal_kind: SafeSignalKind,
    /// Observation-side correlation context used to form this signal.
    pub correlation_context_ref: CorrelationContextRef,
    /// Current local safe-signal lifecycle value.
    pub state: SafeSignalState,
    /// Body-free summary accepted for this signal.
    pub summary_ref: SafeSignalSummaryRef,
    /// Optional runtime or sandbox boundary reference carried without execution truth.
    pub runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}
```

| 字段 | 唯一来源 | 约束 |
|---|---|---|
| `signal_ref` | application id generator | 不从summary/runtime/digest派生 |
| `signal_kind` | typed command/event + R06.5 policy | immutable；producer/kind compatibility必须通过 |
| `correlation_context_ref` | loaded Bound context | immutable；Partial只有显式policy允许时可创建Candidate，不能直接Recorded |
| `state` | factory/member | initial Candidate |
| `summary_ref` | safe resolver / redaction output | immutable replacement只通过revalidate；不指向raw backend record |
| `runtime_signal_ref` | optional loaded structured runtime/sandbox ref | Available/Degraded可引用；Missing/NotVisible需policy决定stale/suppress |

| factory签名 | 前置 / 后置 |
|---|---|
| `pub fn from_summary(signal_ref: SafeSignalRef, context: &CorrelationContext, summary_ref: SafeSignalSummaryRef, signal_kind: SafeSignalKind, runtime_signal_ref: Option<RuntimeSandboxSignalRef>) -> Result<Self, DomainError>` | context非Invalid；context ref copy；summary body-free；runtime ref若存在不得与context冲突；state Candidate |

| member签名 | 前置 / mutation | 返回 |
|---|---|---|
| `pub fn apply_decision(&mut self, context: &CorrelationContext, decision: &SignalDecision) -> Result<SafeSignalTransition, DomainError>` | Candidate；decision的basis、target/state、complete context、assessment、summary/kind/runtime snapshot exact match；Record/Suppress total dispatch | Recorded或Suppressed delta |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<SafeSignalTransition, DomainError>` | 仅Recorded；写Stale；summary不变 | MarkedStale |
| `pub fn revalidate(&mut self, summary_ref: SafeSignalSummaryRef) -> Result<SafeSignalTransition, DomainError>` | 仅Stale；新summary由resolver/policy接受；写Recorded+替换summary | Revalidated |
| `fn suppress(&mut self, reason: SignalSuppressionReason) -> Result<SafeSignalTransition, DomainError>` | module-private；只能由`apply_decision`在P3 decision绑定成功后调用 | Suppressed delta |
| `pub fn is_exportable(&self) -> bool` | 只读 | 仅Recorded且runtime ref非Missing/NotVisible语义时true；最终visibility仍由policy判断 |
| `pub fn is_rollup_eligible(&self) -> bool` | 只读 | 仅Recorded |

#### 13.2.1 invariants / redlines

- SafeSignal不持有label map、metric value、span event、log line、attributes、provider payload、raw prompt/tool output。
- `Log/Metric/Trace`只是safe summary family，不意味着本仓拥有原始backend schema。
- projection/view刷新不修改signal state；Stale只由reference/summary dependency变化触发。
- Suppressed是terminal但仍可用于internal diagnostic/audit；不得物理删除以隐藏原因。
- member不接收policy object本身，只消费稳定 `SignalDecision`；policy exact fields留R06.5。
- 必测context Invalid/Partial、runtime conflict、Record/Suppress、Stale/Revalidate、Suppressed terminal、body scan和kind compatibility。
- 对象停审: `pass_R06.3`。

### 13.3 `SignalRollupWindow`

```rust
/// Derived rollup window over committed body-free safe signals only.
pub struct SignalRollupWindow {
    /// Stable identity of this derived rollup window.
    pub window_ref: SignalRollupWindowRef,
    /// Canonical observation or correlation scope and signal kind.
    pub scope: SignalRollupScope,
    /// Declared fixed or custom UTC window family.
    pub window_kind: RollupWindowKind,
    /// Inclusive UTC start of the closed-open rollup window.
    pub window_start_at: ObservedAt,
    /// Exclusive UTC end of the closed-open rollup window.
    pub window_end_at: ObservedAt,
    /// Current freshness lifecycle of the derived rollup.
    pub state: SignalRollupState,
    /// Number of distinct committed signals currently included.
    pub signal_count: SignalCount,
    /// Greatest committed observation cursor covered by the current members.
    pub source_cursor: Option<ObservationCursor>,
    /// Canonical bounded identities of the included recorded signals.
    pub signal_refs: SafeSignalRefSet,
}
```

| 字段 | 唯一来源 | 约束 |
|---|---|---|
| `window_ref` | application id generator + canonical scope/window lookup | replacement保留identity；不从time/scope hash派生 |
| `scope` | R06.5 rollup policy / typed query-job input | only ByObservation/ByCorrelation + exact kind |
| `window_kind/start/end` | validated policy/config snapshot + clock-aligned boundaries | immutable；start < end；fixed kind duration exact |
| `state` | factory/member | initial Pending |
| `signal_count` | accepted distinct signal refs | initial zero；等于set len |
| `source_cursor` | committed repository/UoW cursor | initial None；单调增加；不从timestamp/source version猜 |
| `signal_refs` | accepted Recorded signals | canonical set；hard max 1024；与count一致 |

| factory签名 | 前置 / 后置 |
|---|---|
| `pub fn open(window_ref: SignalRollupWindowRef, scope: SignalRollupScope, window_kind: RollupWindowKind, start_at: ObservedAt, end_at: ObservedAt) -> Result<Self, DomainError>` | scope合法；window duration匹配；Pending/zero/None/empty |

| member签名 | 前置 / mutation | 返回 |
|---|---|---|
| `pub fn accept_signal(&mut self, signal: &SafeSignal, context: &CorrelationContext, committed_cursor: ObservationCursor) -> Result<Option<SignalRollupTransition>, DomainError>` | state Pending/Fresh；signal Recorded、signal context=context、kind匹配、context/receipt满足scope、cursor不倒退；`try_insert` AlreadyPresent仅当cursor等于existing source_cursor时Ok(None)，更大/更小cursor均冲突 | Inserted时SignalAccepted；Fresh转Stale，Pending保持Pending |
| `pub fn seal(&mut self, coverage: SignalRollupCoverage) -> Result<SignalRollupTransition, DomainError>` | Pending/Stale/Rebuilding；coverage window/scope exact match；target cursor/count与self相等；empty组合合法；写Fresh | SealedFresh |
| `pub fn reopen_for_rebuild(&mut self, target_ref: &MaintenanceTargetRef) -> Result<SignalRollupTransition, DomainError>` | Fresh/Stale/Failed；target kind SignalRollup、object指向self、effect RebuildSignalRollup、guard合法；写Rebuilding | RebuildStarted |
| `pub fn fail(&mut self, reason: MaintenanceFailureReason) -> Result<SignalRollupTransition, DomainError>` | 仅Rebuilding；写Failed；保留last count/cursor/set | RebuildFailed |
| `pub fn contains_signal(&self, signal_ref: &SafeSignalRef) -> bool` | 只读 | canonical set lookup |
| `pub fn covers_cursor(&self, cursor: ObservationCursor) -> bool` | 只读 | source_cursor >= cursor且Fresh；None false |

#### 13.3.1 scope membership

| scope | signal membership proof | failure |
|---|---|---|
| `ByObservation(receipt_ref)` | loaded `CorrelationContext.receipt_ref`等于scope payload | `ScopeMismatch` |
| `ByCorrelation(context_ref)` | `SafeSignal.correlation_context_ref`等于scope payload | `ScopeMismatch` |

`accept_signal` 必须接收 loaded context并完成上表比较；实现时不得只比较signal ref/string，也不得在application里返回未经domain复核的bool。

#### 13.3.2 invariants / redlines

- `signal_count == signal_refs.len()`；duplicate不得推进cursor或state。duplicate使用不同cursor说明repository snapshot/input不一致，返回`RollupInvariantViolation`。
- Pending可接受signal；Fresh接收新signal必须变Stale；Stale不得继续直接接受新signal，先进入rebuild路径以避免count/cursor不完整。
- seal不能只凭clock；必须覆盖repository声明的committed target cursor。
- rebuild只读saved Recorded signal；不读取raw log/metric/trace或外部backend。
- Failed不清空last known data；public view通过freshness显示failed/unavailable，不伪装empty fresh。
- 必测scope/kind/state、duplicate、cursor regression、count overflow、set bound、fixed/custom window、incomplete seal、target compatibility、failure retention。
- 对象停审: `pass_R06.3`。

### 13.4 模块内停审

| 审查项 | 结论 | 证据 / 后置 |
|---|---|---|
| signal body-free | pass | only SafeSignalSummaryRef + structured runtime ref |
| state/transition | pass | §8.4/§8.5 + exact members/delta |
| rollup source boundary | pass | saved Recorded signal only；cursor from UoW |
| scope/count/cursor | pass | exact scope membership、set/count invariant、monotonic cursor |
| maintenance separation | pass | window freshness vs R06.4 rebuild execution distinct |

## 14. `domain::audit` 对象契约

### 14.1 对象能力映射

| 对象 | 对象能力 | 必需字段 | factory | member | 状态 / 输出 |
|---|---|---|---|---|---|
| `AuditProjection` | 建立body-free audit subject projection并追加source fact/linkage/gap/visibility变化 | projection/subject/context/source/state/latest ref/link/gap sets | `create` | append_source_fact/append_evidence_linkage/restrict/restore/attach_gap | `AuditProjectionState`;`AuditProjectionTransition` |

### 14.2 `AuditProjection`

```rust
/// Append-only observation audit projection that never owns source-audit truth.
pub struct AuditProjection {
    /// Stable identity of the local audit projection.
    pub projection_ref: AuditProjectionRef,
    /// Body-free subject represented by this projection.
    pub subject_ref: AuditSubjectRef,
    /// Observation-side correlation context associated with the source fact.
    pub correlation_context_ref: CorrelationContextRef,
    /// Body-free identity of the imported source-audit fact.
    pub source_audit_ref: SourceAuditRef,
    /// Safe external summary associated with the source-audit fact.
    pub source_audit_summary_ref: SafeExternalSummaryRef,
    /// Current local projection lifecycle value.
    pub state: AuditProjectionState,
    /// Whether the required source-audit fact has been appended locally.
    pub source_fact_appended: bool,
    /// Latest accepted local append record, if any.
    pub latest_append_record_ref: Option<AuditAppendRecordRef>,
    /// Canonical body-free evidence linkages appended to this projection.
    pub linkage_refs: EvidenceLinkageRefSet,
    /// Canonical gaps appended without replacing projection truth.
    pub gap_refs: GapStateRefSet,
    /// Finite public-visibility reason present only while restricted.
    pub visibility_reason: Option<EvidenceVisibilityReason>,
}
```

| 字段 | 唯一来源 | 约束 |
|---|---|---|
| identity/subject/context/source | id generator + typed command/event + loaded context | immutable；subject/source body-free |
| `source_audit_summary_ref` | trusted source-audit safe-summary envelope | immutable；不是source audit body或action payload |
| `state` | factory/member | initial PendingAppend |
| `source_fact_appended` | `append_source_fact` | initial false；一旦true不回退 |
| latest record | application预留ref + successful mutation | initial None；每次append/restrict/gap成功写new ref |
| linkage/gap sets | successful typed mutations | canonical bounded；linkage max256、gap max256 |
| visibility reason | restrict/restore member | only VisibilityRestricted为Some；其他state None |

| factory签名 | 前置 / 后置 |
|---|---|
| `pub fn create(projection_ref: AuditProjectionRef, subject_ref: AuditSubjectRef, context: &CorrelationContext, source_audit_ref: SourceAuditRef, source_audit_summary_ref: SafeExternalSummaryRef) -> Result<Self, DomainError>` | context必须Bound；PendingAppend；source_fact_appended=false；sets empty；只有body-free source summary；Partial/Unbound/Invalid全部拒绝 |

| member签名 | 前置 / mutation | 返回 |
|---|---|---|
| `pub fn append_source_fact(&mut self, append_ref: AuditAppendRecordRef) -> Result<AuditProjectionTransition, DomainError>` | PendingAppend/VisibilityRestricted且source_fact_appended=false；append ref新；flag=true；Pending->Appended，Restricted保持Restricted；写latest | SourceFactAppended |
| `pub fn append_evidence_linkage(&mut self, append_ref: AuditAppendRecordRef, linkage: &EvidenceLinkage) -> Result<Option<AuditProjectionTransition>, DomainError>` | source_fact_appended=true；state Appended/VisibilityRestricted；linkage projection=self且Linked；append ref新；`try_insert` AlreadyPresent返回Ok(None)且不消费append ref；Inserted时写latest、state保持 | Some(EvidenceLinkageAppended) |
| `pub fn restrict_visibility(&mut self, append_ref: AuditAppendRecordRef, decision: &AuditProjectionVisibilityDecision) -> Result<AuditProjectionTransition, DomainError>` | PendingAppend/Appended；decision basis + complete projection snapshot匹配且outcome NotVisible(reason)；写VisibilityRestricted+Some+latest | VisibilityRestricted |
| `pub fn restore_visibility(&mut self, append_ref: AuditAppendRecordRef, decision: &AuditProjectionVisibilityDecision) -> Result<AuditProjectionTransition, DomainError>` | VisibilityRestricted且source_fact_appended=true；decision basis + complete projection snapshot匹配且outcome Visible；写Appended+None | VisibilityRestored |
| `pub fn attach_gap(&mut self, append_ref: AuditAppendRecordRef, gap_ref: GapStateRef) -> Result<Option<AuditProjectionTransition>, DomainError>` | non-Suppressed；duplicate gap Ok(None)；insert + latest，state不变 | GapAttached |
| `pub fn can_publish_timeline_entry(&self) -> bool` | 只读 | Appended true；Restricted由visibility mapper决定；Pending/Suppressed false |
| `pub fn suppress(&mut self) -> Result<AuditProjectionTransition, DomainError>` | current phase reserved | 总是ReservedTransition |

`VisibilityRestored` target固定Appended且不伪造linkage payload；R06.5 `AuditAppendKind`必须有对应finite kind。

#### 14.2.1 invariants / redlines

- projection append-only指 record history；aggregate current fields可versioned更新，但旧append record不可rewrite/delete。
- 首个事实append必须是source safe-summary fact；visibility restriction可先记录，但evidence linkage与restore都要求source_fact_appended=true，避免循环依赖和空projection冒充Appended。
- append_evidence_linkage只接受loaded `EvidenceLinkage::Linked`且projection ref一致；不能只传linkage ref绕过state/purpose。
- source audit ref/subject/context immutable；外部source audit变化形成新local append输入，不修改外部truth。
- visibility restriction不删除linkage/gap；restore需要新append record ref，不能静默切state。
- Suppressed reserved；当前调用必须失败，不可由config启用。
- 不保存source audit action body、Governance decision、actor profile、provider audit response或evidence body。
- 必测create、append/restrict/restore/gap duplicate、wrong projection linkage、set bound、append ref reuse、reserved suppress和body scan。
- 对象停审: `pass_R06.3`。

### 14.3 模块内停审

| 审查项 | 结论 | 证据 / 后置 |
|---|---|---|
| append-only语义 | pass | each accepted change requires preallocated append ref + R06.5 record |
| visibility/gap | pass | restriction state、gap state-preserving、restore explicit |
| source ownership | pass | source/subject body-free；no source audit/Governance mutation |
| record/outbox | controlled | aggregate只返回delta；same UoW由Step09/11承接 |

## 15. `domain::evidence` 对象契约

### 15.1 对象能力映射

| 对象 | 对象能力 | 必需字段 | factory | member | 状态 / 输出 |
|---|---|---|---|---|---|
| `EvidenceLinkage` | 记录structured external evidence boundary、purpose/scope/digest和body-free visibility lifecycle | linkage/projection/boundary/purpose/scope/state/digest/reasons | `candidate` | `apply_visibility`、body_block、mark_stale；visibility helper仅module-private | `EvidenceLinkageState`;`EvidenceLinkageTransition` |

### 15.2 `EvidenceLinkage`

```rust
/// Body-free linkage from an audit projection to an external evidence boundary.
pub struct EvidenceLinkage {
    /// Stable identity of this local linkage.
    pub linkage_ref: EvidenceLinkageRef,
    /// Audit projection that owns this linkage.
    pub projection_ref: AuditProjectionRef,
    /// Structured body-free external evidence boundary snapshot.
    pub boundary_ref: GovernanceArtifactEvidenceReference,
    /// Product-neutral purpose for consuming the linkage.
    pub evidence_purpose: EvidenceConsumerPurpose,
    /// Exact consumer and selection scope evaluated for the linkage.
    pub consumer_scope: EvidenceConsumerScope,
    /// Current local linkage lifecycle value.
    pub state: EvidenceLinkageState,
    /// Digest of canonical body-free boundary material.
    pub digest_summary: DigestSummary,
    /// Finite visibility reason present only in the not-visible state.
    pub visibility_reason: Option<EvidenceVisibilityReason>,
    /// Finite body-boundary reason present only in the body-blocked state.
    pub body_blocked_reason: Option<BodyBlockedReason>,
}
```

| 字段 | 唯一来源 | 约束 |
|---|---|---|
| `linkage_ref` | application id generator | 不从external ref/digest派生 |
| `projection_ref` | loaded audit projection | immutable；linkage属于exact projection |
| `boundary_ref` | structured resolver/command/event input | boundary identity/family/external ref immutable；snapshot fields只可由`relink`以同identity刷新；不得Missing/Invalid |
| purpose/scope | typed request/consumer + R06.5 policies | immutable；purpose = scope.purpose；进入unique key |
| `state` | factory/member | initial Candidate |
| `digest_summary` | trusted resolver snapshot | Candidate时必须等于boundary内的Some digest；只可由`relink`随同identity新snapshot替换；不能用body hash逃逸正文边界 |
| reason fields | member | NotVisible only visibility Some；BodyBlocked only body reason Some；其他None |

| factory签名 | 前置 / 后置 |
|---|---|
| `pub fn candidate(linkage_ref: EvidenceLinkageRef, projection: &AuditProjection, boundary_ref: GovernanceArtifactEvidenceReference, purpose: EvidenceConsumerPurpose, scope: EvidenceConsumerScope, digest_summary: DigestSummary) -> Result<Self, DomainError>` | `projection.source_fact_appended == true`且state Appended/VisibilityRestricted；scope purpose一致；boundary state Linked/NotVisible且其Some digest与参数相等；Candidate/reasons None |

| member签名 | 前置 / mutation | 返回 |
|---|---|---|
| `pub fn apply_visibility(&mut self, projection: &AuditProjection, evaluated_boundary: GovernanceArtifactEvidenceReference, evaluated_digest: DigestSummary, decision: &EvidenceVisibilityDecision) -> Result<Option<EvidenceLinkageTransition>, DomainError>` | decision的basis、complete linkage/projection snapshots、scope、evaluated boundary/digest exact match；对Candidate/Linked/NotVisible/Stale与Visible/NotVisible做total dispatch；exact replay返回None | optional exact delta |
| `pub fn body_block(&mut self, reason: BodyBlockedReason) -> Result<EvidenceLinkageTransition, DomainError>` | 仅Candidate；写BodyBlocked/body reason Some/visibility None | BodyBlocked |
| `pub fn mark_stale(&mut self, reason: ReferenceStaleReason) -> Result<EvidenceLinkageTransition, DomainError>` | Linked/NotVisible；写Stale，clear visibility/body reasons | MarkedStale |
| `pub fn is_handoff_eligible(&self) -> bool` | 只读 | state Linked且purpose ReportHandoffInput，最终readiness仍由R06.5 policy |
| `pub fn canonical_unique_key(&self) -> Vec<u8>` | 只读 | projection ref + boundary stable id/family + purpose + scope canonical bytes；不含mutable state |

`link/relink/mark_not_visible/refresh_not_visible`均为`domain::evidence` module-private helper，只能由`apply_visibility`调用。total dispatch闭合Candidate/Linked/NotVisible/Stale：exact同态返回`Ok(None)`；NotVisible reason改变返回`Some(NotVisible { from: NotVisible, ... })`；Stale经refreshed Linked boundary可进入Linked或NotVisible并原子替换boundary/digest。P4 `Ok(())`不能跳过P5或此member。

#### 15.2.1 invariants / redlines

- unique key防止同projection/boundary/purpose/scope并存current linkage；repository唯一性留Step11。
- Stale恢复必须经`apply_visibility`携带新的resolver snapshot与digest；仅重放旧visibility decision不得恢复Linked，也不得先用旧snapshot转NotVisible来清除stale前置。NotVisible的恢复或reason替换同样只能由total dispatch处理。
- NotVisible与Missing严格分离：目标missing时不创建linkage，由R06.4 gap/reference object表达。
- BodyBlocked terminal且不保留input body、body digest、locator、credential或provider message。
- digest summary只做body-free完整性标记，不证明authenticity、lineage或real evidence；Invalid digest factory失败。
- purpose/scope不可被member修改；不同consumer/purpose需要新linkage。
- object不创建real evidence alias、handoff、authenticity hint、archive package或final verdict。
- 必测factory purpose/scope、boundary states、link/relink/not-visible/stale/body-block、terminal rewrite、unique key、body scan。
- 对象停审: `pass_R06.3`。

### 15.3 模块内停审

| 审查项 | 结论 | 证据 / 后置 |
|---|---|---|
| body-free linkage | pass | structured boundary + digest + finite reasons，无body/locator |
| purpose/scope | pass | immutable typed scope，unique key完整 |
| visibility/missing | pass | NotVisible state；Missing由R06.4 gap/reference owner |
| authenticity boundary | pass | digest/link不等于真实性/real evidence |
| policy/record | controlled | exact policy objects与append records在R06.5消费delta |

## 16. `contracts::views` public projection 对象契约

### 16.1 view identity 与 assembly 共同规则

| view | public identity | canonical lookup | replacement |
|---|---|---|---|
| `IntakeStatusView` | `ObservationReceiptRef` | receipt primary key | 可重建body；不产生第二view ref |
| `SafeSignalProjectionView` | `SafeSignalRef` | signal primary key / context index | 可重建body；不产生第二view ref |
| `SignalRollupView` | `SignalRollupWindowRef` | window ref / `SignalRollupScope` | replacement保留window ref |
| `AuditTimelineView` | 无独立identity；subject + window + repository page cursor是query scope | `AuditSubjectRef` + `AuditTimelineWindow` | 瞬时page body，不持久化为第二truth |
| `EvidenceIndexInputView` | `EvidenceIndexInputViewRef` | immutable snapshot primary key；可另建consumer/scope lookup | Query preview不写；PrepareReportHandoff accepted UoW append-once保存，之后不replace |

所有 factory 归 `contracts::views` 且只接收 contracts/core types。application assembler负责从loaded domain objects复制字段；infra只映射持久化。view factory不接收domain object，不调用repository，不推进state，不生成identity，不读取配置。普通 Query response的body规则逐字复用R06.2：Visible/Restricted允许body；Degraded仅在`degraded.limited_consumption_allowed == true`时允许受限body；NotVisible/Blocked以及blocked Degraded必须令wrapper `body=None`。`EvidenceIndexInputView` 是同时服务Query preview与write-side immutable handoff input的特殊snapshot carrier：它可结构化记录NotVisible/Blocked/blocked Degraded，但对应public Query是否返回body仍由wrapper policy决定。

### 16.2 `IntakeStatusView`

```rust
/// Public body-free status of one observation intake fact.
pub struct IntakeStatusView {
    /// Receipt represented by this public status body.
    pub receipt_ref: ObservationReceiptRef,
    /// Structured body-free source copied from the receipt.
    pub source_ref: ObservationSourceRef,
    /// Committed receipt admission state.
    pub admission_state: ObservationReceiptState,
    /// Safety disposition associated with the receipt, when one exists.
    pub safety_disposition_ref: Option<SafetyDispositionRef>,
    /// Committed safety state paired with the disposition identity.
    pub safety_state: Option<SafetyDispositionState>,
    /// Consumer-safe visibility of this view body.
    pub visibility: VisibilitySurface,
    /// Persisted freshness surface for this projection replacement.
    pub freshness: ObservationProjectionFreshnessSurface,
    /// Boundary-clock time of the latest projection replacement.
    pub last_updated_at: ObservedAt,
}
```

| 字段 | assembly来源 | 约束 |
|---|---|---|
| receipt/source/admission | saved `ObservationReceipt` | exact copy；source按visibility可在protocol整体隐藏，不能局部伪造 |
| disposition ref/state | optional saved `SafetyDisposition` | 二者同时Some或同时None；ref必须属于receipt |
| visibility | R06.4 read policy映射的 `VisibilitySurface` | body存在时允许Visible/Restricted或limited Degraded；其余由wrapper body=None |
| freshness | persisted projection marker | Query不得构造Fresh覆盖stored marker |
| updated time | projection replacement clock | 不等于receipt received time；不得用query time |

factory `pub fn from_fields(receipt_ref: ObservationReceiptRef, source_ref: ObservationSourceRef, admission_state: ObservationReceiptState, safety_disposition_ref: Option<SafetyDispositionRef>, safety_state: Option<SafetyDispositionState>, visibility: VisibilitySurface, freshness: ObservationProjectionFreshnessSurface, last_updated_at: ObservedAt) -> Result<Self, ProtocolError>` 验证全部字段组合。Accepted要求safety Some且state Safe/Redacted；Rejected/Quarantined如有disposition须状态相容；Received可None；Superseded保持历史ref；visibility必须允许body。组合错误返回`ProtocolError::InvalidCarrierState`。members: `pub fn identity(&self) -> &ObservationReceiptRef`、`pub fn is_downstream_eligible(&self) -> bool`、`pub fn is_stale(&self) -> bool`。

- 不保存material/safe summary body、actor、decision record body或source truth状态。
- 不提供`refresh_from_receipt(&mut self, domain object)`；replacement由application组装新值并versioned save。
- 必测所有admission/safety组合、visibility/body rule、freshness和wire round-trip。
- 对象停审: `pass_R06.3`。

### 16.3 `SafeSignalProjectionView`

```rust
/// Public body-free projection of one safe signal.
pub struct SafeSignalProjectionView {
    /// Safe signal represented by this projection body.
    pub signal_ref: SafeSignalRef,
    /// Product-neutral family copied from the safe signal.
    pub signal_kind: SafeSignalKind,
    /// Correlation context associated with the safe signal.
    pub correlation_context_ref: CorrelationContextRef,
    /// Body-free summary exposed by the projection.
    pub summary_ref: SafeSignalSummaryRef,
    /// Optional runtime or sandbox boundary reference without execution truth.
    pub runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
    /// Committed safe-signal lifecycle value.
    pub signal_state: SafeSignalState,
    /// Consumer-safe visibility of this view body.
    pub visibility: VisibilitySurface,
    /// Persisted freshness surface for this projection.
    pub freshness: ObservationProjectionFreshnessSurface,
}
```

| 字段 | assembly来源 | 约束 |
|---|---|---|
| signal/kind/context/summary/runtime/state | saved `SafeSignal` | exact body-free copy；不得展开summary/runtime body |
| visibility | loaded read policy output | public body只允许Visible/Restricted/limited Degraded |
| freshness | persisted marker + signal state | Stale signal不能映射Fresh；Rebuilding不改变signal state |

factory `pub fn from_fields(signal_ref: SafeSignalRef, signal_kind: SafeSignalKind, correlation_context_ref: CorrelationContextRef, summary_ref: SafeSignalSummaryRef, runtime_signal_ref: Option<RuntimeSandboxSignalRef>, signal_state: SafeSignalState, visibility: VisibilitySurface, freshness: ObservationProjectionFreshnessSurface) -> Result<Self, ProtocolError>` 验证：Candidate不进入public normal query；Recorded可Fresh/Stale/Rebuilding/Unknown；Stale不得Fresh；Suppressed不进入normal response body；visibility必须允许body。组合错误返回`ProtocolError::InvalidCarrierState`。members为 `pub fn identity(&self) -> &SafeSignalRef`、`pub fn is_export_candidate(&self) -> bool`（仅Recorded + Visible + Fresh）、`pub fn is_stale(&self) -> bool`。Suppressed internal diagnostic使用R06.4 `DiagnosticView`而不是绕过本factory。

- view不拥有signal state，不把Projected写回signal；外围delivery结果不反写view truth。
- safe summary ref不是raw log/metric/trace地址；runtime ref不表示execution success。
- 必测四signal state、visibility/freshness matrix、suppressed normal exclusion和body scan。
- 对象停审: `pass_R06.3`。

### 16.4 `SignalRollupView`

```rust
/// Public body-free aggregate over one safe-signal rollup window.
pub struct SignalRollupView {
    /// Rollup window represented by this public view.
    pub window_ref: SignalRollupWindowRef,
    /// Canonical rollup scope and safe-signal family.
    pub scope: SignalRollupScope,
    /// Declared fixed or custom window family.
    pub window_kind: RollupWindowKind,
    /// Inclusive UTC start of the closed-open rollup window.
    pub window_start_at: ObservedAt,
    /// Exclusive UTC end of the closed-open rollup window.
    pub window_end_at: ObservedAt,
    /// Committed rollup freshness lifecycle value.
    pub state: SignalRollupState,
    /// Number of distinct committed safe signals in the rollup.
    pub signal_count: SignalCount,
    /// Greatest committed observation cursor covered by the rollup.
    pub source_cursor: Option<ObservationCursor>,
    /// Consumer-safe visibility of this view body.
    pub visibility: VisibilitySurface,
    /// Persisted public freshness of this projection.
    pub freshness: ObservationProjectionFreshnessSurface,
}
```

factory `pub fn from_fields(window_ref: SignalRollupWindowRef, scope: SignalRollupScope, window_kind: RollupWindowKind, window_start_at: ObservedAt, window_end_at: ObservedAt, state: SignalRollupState, signal_count: SignalCount, source_cursor: Option<ObservationCursor>, visibility: VisibilitySurface, freshness: ObservationProjectionFreshnessSurface) -> Result<Self, ProtocolError>` 验证window duration、scope、count/cursor/state/freshness组合；组合错误返回`ProtocolError::InvalidCarrierState`：

| rollup state | cursor/count规则 | public freshness |
|---|---|---|
| Pending | empty可None/zero；non-empty必须Some cursor | Unknown或Rebuilding，不得Fresh |
| Fresh | empty允许None/zero；non-emptySome cursor；count已sealed | Fresh |
| Stale | source cursor保留；count为last known | Stale(marker)或Rebuilding |
| Rebuilding | last known cursor/count保留 | Rebuilding |
| Failed | last known cursor/count保留 | Stale(marker)或Unknown；不得Fresh |

factory还要求visibility允许body。members为 `pub fn identity(&self) -> &SignalRollupWindowRef`、`pub fn covers(&self, cursor: &ObservationCursor) -> bool`（仅Fresh且source cursor足够）、`pub fn is_empty(&self) -> bool`。view不暴露signal ref set、safe labels、metric value/series、raw dimensions；概要 `SafeLabelSet` 因无正式安全label来源且非实现必需，登记为historical placeholder，不生成type。必测全matrix、custom/fixed window、count/cursor、limited/blocked Degraded和query no-write。对象停审: `pass_R06.3`。

### 16.5 `AuditTimelineView`

```rust
/// Scoped, ordered, body-free page body for observability audit projections.
pub struct AuditTimelineView {
    /// Body-free audit subject selected by the query.
    pub subject_ref: AuditSubjectRef,
    /// Closed-open UTC window selected for this timeline body.
    pub time_window: AuditTimelineWindow,
    /// Stable ordered append entries visible in this page body.
    pub entries: AuditTimelineEntryList,
    /// Canonical gaps explaining partial timeline material.
    pub gap_refs: GapStateRefSet,
    /// Consumer-safe visibility of the timeline body.
    pub visibility: VisibilitySurface,
    /// Persisted freshness surface of the assembled timeline.
    pub freshness: ObservationProjectionFreshnessSurface,
    /// Repository snapshot cursor used for this assembly, when established.
    pub as_of_cursor: Option<ObservationCursor>,
}
```

| 字段 | assembly来源 | 约束 |
|---|---|---|
| subject/window | typed Query input | body-free subject；closed-open UTC window |
| entries | ordered repository page mapped to list | 每项projection subject/window必须匹配；hard max256 |
| gaps | gap repository / projection markers | empty允许；不得用empty隐藏known gap |
| visibility | policy output | body存在只允许Visible/Restricted/limited Degraded；entry visibility不得比outer更宽 |
| freshness/cursor | repository snapshot + projection marker | entries非空必须Some cursor；cursor只说明local snapshot position |

factory `pub fn build(subject_ref: AuditSubjectRef, time_window: AuditTimelineWindow, entries: AuditTimelineEntryList, gap_refs: GapStateRefSet, visibility: VisibilitySurface, freshness: ObservationProjectionFreshnessSurface, as_of_cursor: Option<ObservationCursor>) -> Result<Self, ProtocolError>` 验证上述组合和body visibility。members为 `pub fn entry_count(&self) -> usize`、`pub fn is_partial(&self) -> bool`（gap nonempty、Restricted/Degraded或非Fresh）、`pub fn projection_refs(&self) -> Result<AuditProjectionRefSet, ProtocolError>`（从entries确定性派生并复用set bound）。

- 不拥有独立view id；page cursor在Step08 wrapper，不能塞进view并变成持久化truth。
- 不替代source audit/Governance truth；Appended entry只说明本仓projection append。
- empty entries + empty gaps允许，代表当前scope无可见本地projection，不证明source无audit事实；outer missing/visibility仍显式。
- 必测stable ordering、window filtering、outer/entry visibility、cursor presence、empty语义和body scan。
- 对象停审: `pass_R06.3`。

### 16.6 `EvidenceIndexInputView`

```rust
/// Immutable body-free snapshot consumed by report handoff and audit export preparation.
pub struct EvidenceIndexInputView {
    /// Stable identity of this immutable input snapshot.
    pub input_ref: EvidenceIndexInputViewRef,
    /// Exact consumer, selection scope, and evidence-use purpose.
    pub consumer_scope: EvidenceConsumerScope,
    /// Canonical visible linkage identities included in the snapshot.
    pub linkage_refs: EvidenceLinkageRefSet,
    /// Canonical audit projection identities included in the snapshot.
    pub audit_projection_refs: AuditProjectionRefSet,
    /// Canonical gaps explaining blocked, restricted, or partial material.
    pub gap_refs: GapStateRefSet,
    /// Consumer-safe visibility represented by this snapshot.
    pub visibility: VisibilitySurface,
    /// Persisted freshness surface at snapshot assembly time.
    pub freshness: ObservationProjectionFreshnessSurface,
    /// Consistent repository cursor used to assemble the snapshot.
    pub as_of_cursor: Option<ObservationCursor>,
    /// Local boundary-clock time when this snapshot was assembled.
    pub assembled_at: ObservedAt,
}
```

| 字段 | assembly来源 | 约束 |
|---|---|---|
| input ref | application id generator | preview可生成但不持久化；committed后immutable |
| consumer scope | validated report/peripheral/read consumer + purpose | purpose必须ReportHandoffInput或ExternalAuditPreparation用于handoff/export；其他purpose只供audit/diagnostic preview |
| linkage/projection/gap sets | versioned repositories at one consistent snapshot | canonical bounded；每linkage属于某projection且scope/purpose兼容 |
| visibility/freshness | policy + persisted markers | Blocked/NotVisible snapshot可用于明确blocked handoff，但不得携带超出visibility的refs；规则见下表 |
| cursor/time | repository snapshot + ClockPort | 任一内容set非空时cursor Some；time是本仓assembly time，不是evidence time |

| visibility | 允许内容 |
|---|---|
| Visible | linkage/projection refs按scope可见；gap可空 |
| Restricted | 只含policy允许的body-free refs；gap应解释缺口或限制，如无gap则由VisibilitySurface自身constraint解释 |
| NotVisible | linkage/projection sets必须empty；gap或visibility reason必须显式 |
| Blocked | linkage/projection sets必须empty；gap/degraded reason必须显式 |
| Degraded | limited=true时只含policy允许的body-free refs；limited=false时linkage/projection sets必须empty；typed degraded surface与gap规则必须满足R06.2 |

factory `pub fn from_snapshot(input_ref: EvidenceIndexInputViewRef, consumer_scope: EvidenceConsumerScope, linkage_refs: EvidenceLinkageRefSet, audit_projection_refs: AuditProjectionRefSet, gap_refs: GapStateRefSet, visibility: VisibilitySurface, freshness: ObservationProjectionFreshnessSurface, as_of_cursor: Option<ObservationCursor>, assembled_at: ObservedAt) -> Result<Self, ProtocolError>`。至少一个 linkage/projection/gap非空，否则只允许NotVisible/Blocked/blocked Degraded；Visible empty input拒绝，避免empty冒充ready；组合错误返回`ProtocolError::InvalidCarrierState`。members为 `pub fn identity(&self) -> &EvidenceIndexInputViewRef`、`pub fn is_handoff_candidate(&self) -> bool`（purpose为ReportHandoffInput、body可用且linkage/projection非空，只做结构判断）、`pub fn contains_linkage(&self, linkage_ref: &EvidenceLinkageRef) -> bool`、`pub fn is_committable(&self) -> bool`（purpose为ReportHandoffInput或ExternalAuditPreparation且cursor/content规则成立；不等于readiness或delivery许可）。

- Query preview和committed snapshot使用同一shape；只有`ReportHandoffRepository.save_evidence_index_input`在accepted write UoW保存。
- committed snapshot append-once；underlying linkage/projection变化只使handoff/view stale，不replace历史input。
- 不生成真实evidence alias、authenticity verdict、final signoff、run id、archive package或report body。
- 不保存evidence/artifact/audit body、locator、provider payload、actor profile；digest只留在linkage object，不复制成escape hatch。
- 必测all visibility/content combinations、scope/purpose、cross-projection linkage、cursor/time、preview no-write、committed immutability和body scan。
- 对象停审: `pass_R06.3`。

### 16.7 contracts views 模块内停审

| 审查项 | 结论 | 证据 / 后置 |
|---|---|---|
| contracts无domain依赖 | pass | view fields全部为contracts/core types；assembler在application |
| identity规则 | pass | 三个复用truth ref；timeline transient；evidence input独立immutable ref |
| visibility/freshness | pass | view/body matrix明确；Query不能修复或伪装Fresh |
| body-free | pass | refs/state/count/cursor only；无raw body/labels/provider material |
| handoff non-signoff | pass | evidence input只是immutable candidate snapshot |
| Step08后置definition | repair_pending | current schema以本节为owner；Step08在解冻后只保留protocol wrapper/mapping |

## 17. R06.3 字段来源与构造闭环审计

### 17.1 definition owner 终检

| 对象组 | 唯一 definition owner | mutation / assembly owner | 禁止的第二 owner |
|---|---|---|---|
| typed refs、finite metadata、state values、scope、count、view | `observability-contracts` | contracts factory只校验shape；domain member推进truth；application组装view | Step08 DTO、infra mapper或domain内同名enum |
| receipt / safety / correlation / signal / rollup | `observability-domain::{intake,safety,correlation,signal}` | owning object factory/member | application直接写state或repository mapper补默认 |
| audit projection / evidence linkage | `observability-domain::{audit,evidence}` | owning object factory/member | source audit、Governance、Artifact或resolver成为本仓truth owner |
| target-bound decision | `observability-domain::{signal,audit,evidence}` | R06.5 policy是唯一producer；本批对象只消费 | entry/config/public request直接构造 |
| transition delta | owning domain module | owning object成功mutation后返回 | contracts、repository或record factory反向推进对象 |
| append-only record | R06.5 `domain::records` | application在accepted UoW内从delta组装 | R06.3对象直接生成record/time/actor/trace |

### 17.2 truth object 必填字段来源

| 对象 | identity来源 | relation / immutable input | mutable state来源 | optional / derived字段闭环 | 失败时行为 |
|---|---|---|---|---|---|
| `ObservationReceipt` | application id generator | typed source、purpose、ClockPort time | `receive`固定Received；owning members推进 | disposition仅从loaded compatible safety object写入 | zero mutation；无record/outbox |
| `SafetyDisposition` | same-UoW id generator | loaded receipt、body-free material summary、evaluation context | `evaluate`固定Pending；owning members推进 | marker/flag/summary必须满足state matrix | source/purpose/body组合错误不创建对象 |
| `CorrelationContext` | application id generator | loaded receipt/source、validated non-empty seed | `from_receipt`固定Unbound；bind/degrade/invalidate推进 | pending seed与active refs按state互斥；不得丢seed | conflict不覆盖active refs、不创建delta |
| `SafeSignal` | application id generator | loaded context、safe summary、typed kind、optional runtime ref | `from_summary`固定Candidate；decision/stale/revalidate/suppress推进 | summary只由resolver/policy accepted input替换 | failed decision不得record/rollup/outbox |
| `SignalRollupWindow` | application id generator + canonical lookup | validated scope/window；saved Recorded signal + loaded context | `open`固定Pending；accept/seal/rebuild/fail推进 | count=set len；cursor来自committed UoW；coverage target-bound | overflow/set/scope/cursor失败保持原window |
| `AuditProjection` | application id generator | typed subject/context/source-audit safe summary | `create`固定PendingAppend；append/restrict/restore推进 | source fact flag单调；sets canonical；latest ref来自accepted mutation | 预留append ref在失败时不保存record |
| `EvidenceLinkage` | application id generator | founded projection、structured external boundary、purpose/scope/digest | `candidate`固定Candidate；link/relink/block/not-visible/stale推进 | boundary identity immutable；snapshot/digest只由relink更新；reason随state互斥 | Missing/Invalid不创建linkage；失败不改旧snapshot |

### 17.3 public view 构造闭环

| view | 构造所需正式来源 | identity / cursor规则 | visibility / freshness规则 | 实现侧暂停条件 |
|---|---|---|---|---|
| `IntakeStatusView` | saved receipt + optional same-receipt disposition + persisted marker + read decision | identity复用receipt；updated time来自projection replacement clock | body只允许Visible/Restricted/limited Degraded；Query不伪造Fresh | disposition ref/state不成对或state不相容 |
| `SafeSignalProjectionView` | saved signal + persisted marker + read decision | identity复用signal | Candidate/Suppressed不进入normal body；Stale不得Fresh | summary/runtime body被展开或visibility不允许body |
| `SignalRollupView` | saved window + persisted marker + read decision | identity复用window；cursor只来自saved window | state/count/cursor/freshness全矩阵；不暴露member refs | window duration、scope或cursor/count不闭合 |
| `AuditTimelineView` | typed subject/window + repository ordered append entries + gaps + marker/read decision | transient query body；as-of cursor不是view identity | entry visibility不得比outer宽；entries非空要求cursor | append kind/payload/resulting state不相容 |
| `EvidenceIndexInputView` | one consistent repository snapshot + policy + ClockPort | input ref独立；preview不持久化，committed append-once | NotVisible/Blocked/blocked Degraded不得带linkage/projection refs | cross-projection linkage、scope/purpose或cursor/content冲突 |

### 17.4 rehydration 与字段写入规则

1. repository mapper必须调用与factory等价的 `try_rehydrate` validation；不得以struct literal绕过 state/optional-field matrix。
2. domain object公开字段描述可转写schema，不授予 application/infra 任意mutation权；除factory、rehydration和owning member外直接写state或互斥字段是实现违例。
3. contracts view decode同样重跑factory validation；public wire无法构造Candidate normal view、Fresh stale signal或带可见refs的NotVisible evidence input。
4. failed domain mutation先完成全部validation与checked arithmetic/set operation，再提交字段变化；不得出现部分更新。
5. `ProtocolError`只表达carrier/schema validation；`DomainError`表达对象factory、policy target、state和关系不变量；两者不包装repository/provider error。

## 18. R06.3 状态与跨对象闭环审计

### 18.1 七个状态机

| 状态主语 | 初始态 | current callable迁移 | terminal / reserved | exact trigger owner | 审查 |
|---|---|---|---|---|---|
| `ObservationReceipt` | Received | accept/reject/quarantine/degrade | Rejected terminal；Superseded reserved | receipt member | pass |
| `SafetyDisposition` | Pending | mark_safe/mark_redacted/reject_unsafe/quarantine | Safe/Redacted/Rejected terminal；Quarantined只可reject | disposition member | pass |
| `CorrelationContext` | Unbound | bind_seed/degrade/invalidate；Bound同态runtime link | Invalid terminal | context member | pass |
| `SafeSignal` | Candidate | apply_decision/mark_stale/revalidate/suppress | Suppressed terminal | signal member | pass |
| `SignalRollupWindow` | Pending | accept_signal/seal/reopen_for_rebuild/fail | 无terminal；Failed显式重试 | window member | pass |
| `AuditProjection` | PendingAppend | append_source_fact/append_linkage/restrict/restore/attach_gap | Suppressed reserved；gap/linkage可同态 | projection member | pass |
| `EvidenceLinkage` | Candidate | link/relink/body_block/mark_not_visible/mark_stale | BodyBlocked terminal | linkage member | pass |

### 18.2 target-bound decision 与 transition delta

| decision / delta | 必须绑定 | 消费前校验 | 禁止复用 / 伪造 |
|---|---|---|---|
| `SignalDecision` | signal + correlation context | refs与loaded objects逐一匹配；Candidate only | 另一signal/context、entry reason、config default |
| `EvidenceVisibilityDecision` | linkage + projection + consumer scope | 三者与object immutable fields匹配 | 另一purpose/scope/linkage或projection |
| `AuditProjectionVisibilityDecision` | projection | projection ref匹配；outcome与调用函数匹配 | consumer-specific授权或另一projection |
| `SignalRollupCoverage` | window + exact scope | count/cursor等于window committed snapshot | 另一window/scope或clock-only seal |
| transition delta | mutation前state + typed payload | 只由成功owning member创建 | 调用方自行构造并据此写record |

### 18.3 关键跨对象顺序

```text
ObservationReceipt::receive
  -> SafetyDisposition::evaluate + accepted safety transition
  -> ObservationReceipt::accept
  -> CorrelationContext::from_receipt + bind_seed
  -> SafeSignal::from_summary + apply_decision(Record)
  -> SignalRollupWindow::accept_signal(saved Recorded signal)

CorrelationContext usable
  -> AuditProjection::create
  -> AuditProjection::append_source_fact
  -> EvidenceLinkage::candidate(founded projection)
  -> EvidenceLinkage::link / relink
  -> AuditProjection::append_evidence_linkage
  -> EvidenceIndexInputView::from_snapshot
```

| 顺序红线 | 当前裁定 |
|---|---|
| receipt未Accepted就创建correlation | 禁止；Degraded receipt必须先通过正式receipt迁移为Accepted，不接受application布尔放行 |
| Partial context形成safe signal | 只可先形成Candidate，再由`SafeSignalPolicy`生成target-bound `SignalDecision`；不得直接Recorded |
| Partial/Unbound context创建audit projection | 禁止；当前`AuditProjection::create`只接受Bound context |
| signal未Recorded就进入rollup | 禁止；rollup只接收saved Recorded signal |
| audit source fact未append就建立evidence linkage | 禁止；candidate要求`source_fact_appended == true` |
| visibility restriction使source/linkage append恢复Appended | 禁止；append保持VisibilityRestricted，只有显式restore可恢复 |
| stale linkage只重放旧decision恢复 | 禁止；必须携带new resolver snapshot/digest走relink |
| Query/view反写truth或自动rebuild | 禁止；只读组装并暴露stored freshness/visibility |

### 18.4 no-business-truth 审计

| 本仓状态 / ref | 只表达 | 不表达 |
|---|---|---|
| Accepted / Recorded / Appended / Linked | observation-owned local fact成立 | source业务成功、runtime执行成功、Governance/Artifact真实性 |
| Fresh | derived rollup/view覆盖声明的committed cursor | external source已修复或无更多事实 |
| SourceAuditRef / safe summary ref | body-free imported identity | source audit body、decision/action正文 |
| DigestSummary | canonical body-free material under a profile | authenticity、lineage、real evidence |
| EvidenceIndexInputView | immutable handoff/export candidate input | evidence alias、report verdict、验收签署、真实run_id |

## 19. R06.3 差异裁定与下游传播

### 19.1 主控差异项状态

| delta | R06.3裁定 | 后续状态 |
|---|---|---|
| `R06-D01-INDIVIDUAL-CARD` | 本批43个support/state/transition/view类型均有具名卡；7个truth object和5个view逐对象闭口 | partial_resolved；R06.4~R06.7对象仍需独立卡 |
| `R06-D05-PROJECTION-OWNER` | 五个本批view schema回灌`contracts::views`；Step08后置schema降为待传播use | partial_resolved；R06.4其余view仍open |
| `R06-D09-STATE-BACKFILL` | 本批七state enum、trigger、target、reserved/terminal和cross-object顺序闭口 | partial_resolved；R06.4/R06.6 state仍open |
| `R06-D11-SUPPORT-TYPE` | 本批已知secondary carrier均有exact schema、ET reuse或后置policy constructor owner | controlled_for_R06.3；R06.8仍需全文zero-unowned扫描 |
| `R06-D12-ERROR-OWNER` | contracts-owned factory只返回ProtocolError/Option；domain member返回DomainError | partial_resolved；DomainError完整卡在R06.5，application/entry error在R06.6/R06.7 |

### 19.2 historical material / naming

| historical name / shape | current处理 |
|---|---|
| `MaterialAdmissionState`;`SafeSummaryRef`;`SanitizedSummaryRef` | 不生成alias；分别使用`ObservationReceiptState`、`SafeSignalSummaryRef` |
| HLD `Projected` signal state | 不进入signal lifecycle；projection是独立read-side输出 |
| HLD evidence `Missing/InvalidDigest` state | Missing由R06.4 gap/reference表达；invalid digest拒绝构造 |
| `IntakeStatusItemView`与四个可重建`*ViewId` | current只定义canonical view名并复用truth identity |
| generic `String change_kind` / object直接返回record | historical repair input；使用finite transition delta，R06.5生成record |

### 19.3 affected-only传播登记

| affected location | 当前use / 冲突 | 解冻后的动作 | 最早允许时点 |
|---|---|---|---|
| R06.5 policy/record | 需要target-bound decisions、transition delta、finite AuditAppendKind和DomainError | 逐policy/record消费本批schema，不复制enum/ref/view | 用户确认完成R06.4后进入R06.5 |
| Step07 ports | repository/timeline/handoff读取面引用旧view/item或record shape | 受影响复审时统一import本批type，补versioned/append接缝，不重定义对象 | R06.8完成且用户确认后 |
| Step08 protocols | 后置定义view、旧`IntakeStatusItemView`、Vec/set和visibility matrix | 逐协议卡改为引用本批view/set/freshness；wrapper负责body=None | Step06/07稳定后 |
| Step09 flows | 旧对象函数直接返回record、audit append target、stale relink输入不足 | 逐flow调用transition + record factory；append保持restricted；relink带new snapshot | Step08稳定后 |
| Step09/10 correlation | 旧文本允许`degraded-allowed` receipt直接建context，且使用未定义`AdmissionDecision` | 改为只接受Accepted receipt；`AdmissionDecision`归R06.5 policy结果卡，不作为correlation bypass | Step08稳定后 |
| Step10 states | 旧trigger参数含actor/record、允许Partial policy创建audit，或写`PendingAppend/Restricted -> Appended`统一target | affected-only复审enum和trigger，采用本批exact member/delta | Step09稳定后 |
| Step11 persistence | 需要source_fact flag、sets、latest append、snapshot/digest atomicity | mapper执行rehydration validation；append record/current aggregate同UoW | Step10复审后 |
| Step16 tests | 需要每type、每state、body-free与target-bound negative cut | 追加本批测试红线，不声明已执行 | 下游影响审计时 |
| formal03 / 04 | formal仍是冻结的修复前装配 | Step19重装配后才回填formal03并审计04受影响引用 | 修复链完成后 |

本表只登记后置动作，本批未修改任何冻结文件。

## 20. R06.3 Step 7+ 承接清单

| 后续 owner | 必须承接的本批对象 / 规则 | 输出要求 | 未承接时 blocker |
|---|---|---|---|
| R06.5 policies | three target-bound decisions、rollup coverage、purpose/scope/body-free rules | exact constructor/rule snapshot/input/output/error；不能让entry构造decision | object transition可被跨目标复用 |
| R06.5 records | five transition delta families、AuditAppendKind/RecordRef | record ref/actor/time/trace/cursor由factory补齐；delta到record total mapping | append history字段需实现者猜 |
| Step07 repository | 7 truth object versioned read/save、append record、timeline/read snapshot | expected version、append-only、consistent snapshot、set/cursor读取面 | state/record/view无法原子承接 |
| Step07 resolver | source/runtime/subject/evidence body-free snapshot | typed resolved/missing/not-visible/stale/body-block outcomes | relink与forbidden-body输入无正式来源 |
| Step08 protocol | five view wrappers、typed request/event inputs | DTO只引用contracts type；body presence与visibility一致 | protocol复制第二套view/schema |
| Step09 flow | exact factory/member/delta调用顺序 | mutation/record/outbox/UoW和失败zero-write逐flow闭口 | object签名存在但没有可执行编排 |
| Step10 state | seven enum与exact trigger | from/to、state-preserving、reserved和illegal error逐字一致 | 状态矩阵与对象函数分叉 |
| Step11 persistence | aggregate/current projection + append-only history + immutable input | rehydration、CAS、unique key、cursor/set ordering、same-UoW | 结构可写但不保证不变量 |

## 21. R06.3 自检、blocker 与停止点

| 自检项 | 结论 | 证据 / 限制 |
|---|---|---|
| 是否只写设计文档 | pass | 未实现代码、未创建实现仓文件 |
| 是否先读标准、上游和本批definition/use | pass | §2以及本批恢复记录 |
| 独立卡 / 字段 / factory / member / state | pass_for_R06.3 | §7~§16；7 truth + 5 view + support/state/delta cards |
| contracts是否依赖domain | pass_no | contracts factory只返回ProtocolError/Option；view只含contracts/core type |
| body-free / redaction / external truth边界 | pass | §11、§14~§18；无raw body/locator/credential/provider payload |
| correlation / evidence / audit target binding | pass | decisions、coverage、append state与relink均target-bound |
| 字段来源 / 状态 / Step7承接 | pass_for_R06.3 | §17、§18、§20 |
| 是否修改Step07~19/formal03/04 | pass_no_write | 只登记affected location |
| 是否伪造commit/run/test/evidence/signoff | pass_none_created | 测试均为planned redline，不声明执行结果 |
| 外部上游blocker | none | current 00/01/02足以支撑本批 |
| 内部blocker | `03-RPR-S06-GRANULARITY=open` | F批H1~H7已闭口；仍需R06.5-G及R06.6~R06.8 |
| R06.3 gate | `historical_pass_consumed` | 本批完成证据已由R06.4和R06.5-A消费，不再是current停审点 |
| historical overall gate | `R06.5-G_done_waiting_user` | G批不改变R06.3 truth owner；该 checkpoint 已被 R06.6 输入审查消费 |
| historical next_allowed_action | `wait_user_confirmation_before_R06.6_input_reading` | 读取动作已完成；当前不得绕过用户确认写入 R06.6-A |

### 21.1 R06.3 后续阅读清单（historical，已消费）

以下清单记录R06.3完成后曾等待用户确认的R06.4输入；该确认已经发生，且清单已由R06.4消费：

1. Step 06 SOP / 书写规范中 truth/state/view/字段来源与模块停审条款。
2. 正式`02-概要设计.md` §6/§12中handoff、retention、replay、no-write、read、diagnostic、gap、peripheral、reference、maintenance对象。
3. `02_hld_step_06_key_objects_truth_guard_consumption.md`、`*_references.md`、`*_projections.md`及直接相关附录。
4. current Step05 domain/contracts owner、主控Step06 §6.5.2/§6.5.3、contracts专项§19.4 registry。
5. Step08/09/10对R06.4对象的definition/use，只作反向缺口检查。

上述清单和原R06.5-C/D/E/F入口已经由用户确认并消费。current下一阅读入口是R06.5专项§65.8；只有用户再次明确确认进入R06.5-G后才可读取对应输入。确认前不得读取或写入H8~H13、R06.6，不修改Step07~19、formal `03`、任何`04`文件或实现代码。当前不需要提交。

## 22. R06.5-C authoritative affected-definition reconciliation

本节记录P1~P5对R06.3对象的current affected definition。它不重开R06.3原业务主语，也不生成第二套类型；当本文件较早小节中的ref-only decision、按值decision参数或裸public mutation与本节冲突时，以已经同步到原对象卡的current签名和下表为准。P6的`AuthenticityHint`同步见R06.4专项。

### 22.1 decision 与 transition 唯一 shape

| affected type | current authoritative shape | constructor / producer | stale-decision gate |
|---|---|---|---|
| `SafetyDispositionTransition::Quarantined` | `from + reason + Option<ForbiddenBodyEvidence>`；Detected必须Some，其他reason必须None | 仅`SafetyDisposition::apply_decision`成功后返回 | reason/evidence矩阵不完整时不产生delta |
| `SignalDecision` | 完整`PolicyEvaluationBasis` + signal target/state + complete correlation snapshot + summary/kind/label assessment + complete optional runtime snapshot + kind | `pub(crate)` constructor；仅P3 | 任一target/state/context/summary/runtime/assessment变化即失效 |
| `EvidenceVisibilityDecision` | 完整basis + linkage/projection snapshots + evaluated boundary/digest + outcome | `pub(crate)` constructor；仅P5 linkage evaluation | linkage scope/reason/boundary/digest或projection head/gap变化即失效 |
| `AuditProjectionVisibilityDecision` | 完整basis + projection snapshot + outcome | `pub(crate)` constructor；仅P5 projection evaluation | projection state/head/linkage/gap/reason变化即失效 |
| `EvidenceLinkageTransition::NotVisible` | `from`允许Candidate/Linked/NotVisible/Stale，target固定NotVisible并携带finite reason | 仅`apply_visibility` successful changed result | exact replay返回None；changed reason或refreshed boundary返回Some |

decision均是same-UoW短生命周期、body-free、不可serde/default的domain value。它们不是持久化授权token，不能替代repository CAS，也不能由application、entry、config、infra或public DTO构造。decision按借用消费，以便后续H1~H3 record factory读取同一policy basis；这不允许跨UoW缓存或克隆后重放。

### 22.2 owning member 唯一 public policy 入口

| owning object | current public policy member | private helper / 禁止绕过 | success / replay |
|---|---|---|---|
| `ObservationReceipt` | `apply_admission(&SafetyDisposition, &AdmissionDecision)` | accept/reject/quarantine/degrade仅module-private | 四种decision outcome均返回一个exact transition；expected negative不是error |
| `SafetyDisposition` | `apply_decision(&ObservationReceipt, &SafetyDispositionDecision)` | mark_safe/mark_redacted/reject_unsafe/quarantine仅module-private | Pending到四个terminal state；非法矩阵zero mutation |
| `SafeSignal` | `apply_decision(&CorrelationContext, &SignalDecision)` | suppress仅module-private；mark_stale/revalidate仍是独立reference-change入口 | Candidate到Recorded/Suppressed；不接受按值decision |
| `AuditProjection` | `restrict_visibility(..., &AuditProjectionVisibilityDecision)` / `restore_visibility(..., &AuditProjectionVisibilityDecision)` | application不得match outcome后裸改state | changed返回existing transition；append ref只在binding成功后消费 |
| `EvidenceLinkage` | `apply_visibility(&AuditProjection, boundary, digest, &EvidenceVisibilityDecision)` | link/relink/mark_not_visible/refresh_not_visible仅module-private | total dispatch返回`Result<Option<_>>`；exact replay None |

所有入口先比较policy basis与complete observed snapshots，再读取outcome并原子mutation。任何binding/error路径保持aggregate、append ref、record/outbox identity和外部port均未改变。P4 structural guard的`Ok(())`只允许构造Candidate输入，不等于Linked或Visible，不能跳过P5及`apply_visibility`。

### 22.3 visibility total dispatch 与 truth boundary

| current linkage state | P5 outcome / boundary | current result |
|---|---|---|
| Candidate | Visible + Linked boundary | `Some(Linked)` |
| Candidate / Linked | NotVisible | `Some(NotVisible)` |
| Linked | exact Visible replay | `None` |
| NotVisible | Visible + current Linked boundary | `Some(Linked)` |
| NotVisible | exact same NotVisible snapshot/reason | `None` |
| NotVisible | changed NotVisible reason | `Some(NotVisible { from: NotVisible, ... })` |
| Stale | refreshed Linked boundary + Visible | atomically replace boundary/digest；`Some(Linked)` |
| Stale | refreshed Linked/NotVisible boundary + NotVisible | atomically replace boundary/digest；`Some(NotVisible)` |

Missing不构造NotVisible decision，Invalid不构造可消费decision；二者分别走actual missing/error边界。global projection visibility不含consumer authorization，consumer-specific linkage visibility也不拥有actor authorization。Linked/Visible/Appended均只表达observability本地body-free projection状态，不是真实证据、业务接受、验收、signoff或外部audit结论。

### 22.4 affected owner 与 checkpoint

| 检查 | 结论 |
|---|---|
| R06.3原对象主语是否改变 | no；只扩展既有decision/transition并收窄public mutation入口 |
| 是否产生duplicate type/owner | no；support snapshot唯一owner在R06.5专项§§20/23/25，现有decision仍归owning R06.3 module |
| 是否修改冻结Step07~19/formal03/04 | no；旧调用点只登记affected-only |
| 是否生成实现、测试结果或验收evidence | no；所有tests仍是planned redline |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；F/G已闭口并被R06.6输入审查消费，仍需R06.6-A~F、R06.7~R06.8 |
| historical checkpoint | `R06.5-C_done_waiting_user`；已由D批消费 |
| historical pointer | `R06.5-G_done_waiting_user`；该 checkpoint 已被 R06.6 输入审查消费，当前入口见主控、flow、项目台账与 R06.6 输入专项 |

## 23. R06.5-F H1~H3 affected-definition reconciliation（historical，已由G批消费）

本节只登记F批H1~H3对R06.3 canonical transition、decision inspection与same-UoW承接的最终消费关系，不复制`domain::records`中的record schema。当§§9~15较早的“aggregate直接返回record”、无previous snapshot或record先于cursor构造的historical语句与本节冲突时，以已经原位同步的current transition卡、本节和R06.5专项§§58~60/65为准。

### 23.1 canonical transition / proof surface

| canonical owner | F批所需current shape | H1~H3 consumption | duplicate-prevention gate |
|---|---|---|---|
| `domain::intake::ObservationReceiptTransition` | five variants均携带complete `ObservationReceiptTransitionSnapshot`；Superseded保留reserved | H1 receipt branch从previous/change + post receipt构造before/change/after | H1不声明第二transition或从after猜reason |
| `domain::safety::SafetyDispositionTransition` | four variants携带complete previous snapshot；Quarantined保存reason + conditional evidence | H1 safety branch消费P2 proof与post disposition | finite evidence只表示body class，不进入record body |
| `domain::correlation::CorrelationContextTransition` | four variants携带complete `CorrelationContextTransitionSnapshot` | H2 context branch无policy basis，lossless保存binding/reason变化 | H2 revision是record internal snapshot，不是第二context truth |
| `domain::signal::SafeSignalTransition` | four variants携带complete `SafeSignalTransitionSnapshot` | Recorded + explicit effect进入H2并借P3 decision；Revalidated + explicit effect进入H2且basis None | Suppressed/MarkedStale explicit no-record；无effect不得猜H2 |
| `domain::audit::AuditProjectionTransition` | five variants携带complete previous snapshot和预留`AuditAppendRecordRef` | each -> H3 projection branch；metadata ref必须等于transition ref | linkage lifecycle不能冒充`AuditAppendKind` |
| `domain::evidence::EvidenceLinkageTransition` | four variants携带complete boundary/digest/reason previous snapshot | each -> H3 linkage branch；Linked/NotVisible借P5 proof，BodyBlocked/Stale direct | H3 metadata独立mint；不伪造projection append head |
| P1/P2 decisions | `AdmissionDecision::proves_accepted_transition`与`SafetyDispositionDecision::proves_accepted_transition`为records sibling `pub(crate)` inspection | H1逐decision/transition/post-state complete binding，分别复制P1/P2 basis | record不重新evaluate policy或公开decision constructor |
| P3/P5 decisions | `SignalDecision`、`AuditProjectionVisibilityDecision`、`EvidenceVisibilityDecision`各有branch-specific proof API | H2 Recorded与H3 visibility/linkage decision branch读取exact basis | proof只读且branch-limited，不形成authorization token |

所有proof API比较stored policy pre-snapshot、accepted transition和same-UoW post-state，不替代repository version/CAS。direct transition不借用aggregate中最近一次policy basis；H2 Revalidated固定`policy_basis=None`，除非未来先扩展accepted-input schema并重新设计producer。

### 23.2 H1~H3 total mapping与cross-record boundary

| family | exact current record mapping | explicit no-record / reserved | multi-record rule |
|---|---|---|---|
| receipt + safety | receipt current四variant与safety四variant分别映射H1 | receipt Superseded reserved | same intake UoW可产生两条H1；PK不同、cursor可相同 |
| correlation + signal | context四variant映射H2；signal Recorded/Revalidated仅在explicit linkage effect时映射H2 | signal Suppressed/MarkedStale及无effect branch no-record | signal不是第二subject；record仍锚定exact context |
| audit projection + evidence linkage | projection五variant与linkage四variant分别映射H3 tagged subject | none | 一个transition至多一条H3；不得同时映射generic history row |

同一cursor只证明atomic commit，不提供intra-UoW total order。H1 safety-before-receipt由P1/P2 complete snapshots、transition和post-state关系证明；reader不得按record ref、recorded time或row order猜测。H3 projection transition预留record ref只在accepted mutation后消费；factory/append失败使projection/linkage mutation与record全部rollback。

### 23.3 field source、UoW与truth boundary

1. before只来自canonical previous snapshot，change只来自finite transition payload，after只来自same-UoW post-state；R06.3 aggregate current row不能反推历史字段。
2. actor/time/trace/causation/visibility/cursor只来自typed record metadata；transition继续不拥有这些application fields。
3. F批要求metadata先取得`ObservationCommittedCursor::Observation`。冻结Step07/09/11的“stage record -> assign cursor”登记为`R06-F-AFFECT-UOW-01`，R06.8后必须改为`borrow-stage truth/state -> assign one cursor -> construct/stage record`并同步Step16失败切口；相关save port必须借用post-state或返回typed staged snapshot，不能提前consume唯一aggregate或要求`Clone`。
4. record append不修改receipt/safety/context/signal/projection/linkage，也不拥有source audit、external evidence、业务接受、真实性、verdict或signoff truth。
5. F批67个new type和logical owner只见R06.5专项§65；本文件不复制record/revision/change type。

### 23.4 checkpoint

| checkpoint item | conclusion |
|---|---|
| six core transition families | pass affected sync；complete previous snapshot与finite payload可支撑H1~H3 |
| decision proof / provenance | pass；P1/P2/P3/P5 branch-specific，direct branch不借旧basis |
| total mapping | pass_for_F；H1/H2/H3均exact record、explicit_no_record或phase_reserved |
| business/external truth write | none；record只追溯observation-owned body-free local change |
| downstream affected item | `R06-F-AFFECT-UOW-01=open_controlled`；未修改冻结Step07/09/11/16 |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；仍需G及R06.6~R06.8 |
| historical checkpoint | `R06.5-G_done_waiting_user`；本节的F affected-definition已被G批消费，current gate见§24 |
| next allowed | 等待用户明确确认；确认后只读取R06.6输入标准，不自动写入R06.6；当前不需要提交 |

## 24. R06.5-G H11 affected-definition addendum

本节只登记 H11 对 R06.3 canonical domain truth 的消费闭环，不复制 `ProjectionMaintenanceRecord`、revision 或 change 类型；这些类型的唯一 definition owner 仍是 R06.5 专项 §70 与总账 §73。

### 24.1 `SignalRollupTransition` lossless before contract

`SignalRollupTransition` 当前四个 variant 均携带 `SignalRollupRevisionSnapshot`。该 snapshot 是由 `SignalRollupWindow` 在 accepted mutation 前生成的 process-local previous snapshot，字段完整覆盖 `window_ref`、scope、window kind、window bounds、state、signal count、source cursor 和 canonical signal ref set。H11 只能从该 snapshot 构造 rollup `before`，不能从 post-state、current row、count delta 或 cursor 变化反推。

`SignalAccepted` 的 `signal_ref`、`committed_cursor`、`resulting_state` 和 `resulting_count` 组成 finite change payload；H11 factory 必须验证 resulting state/count 与 same-UoW post-state 相等，并将 accepted signal 插入后的完整 set、window identity 与 source cursor写入 after。`SealedFresh`、`RebuildStarted`、`RebuildFailed`分别保留 exact previous snapshot，不能因为缺少 signal payload而退化成 generic maintenance row。

### 24.2 H11 branch and owner matrix

| canonical R06.3 input | H11 consumption | definition owner / boundary |
|---|---|---|
| `SignalRollupTransition::SignalAccepted` | `SignalRollupRevision` before/change/after；保留 signal ref、count、set 和 source cursor | transition 与 snapshot归`domain::signal`；record归R06.5，不新增第二 rollup transition |
| `SignalRollupTransition::SealedFresh` | rollup lifecycle change；after由same-UoW rollup state提供 | 不把 Fresh 解释为 source completeness或业务成功 |
| `SignalRollupTransition::RebuildStarted` | rebuild-start branch；policy basis只由R06.4/P17 accepted transition提供 | 不把 start transition 变成 job/run identity |
| `SignalRollupTransition::RebuildFailed` | typed local failure branch | failure reason不改写source operation result |
| `DiagnosticSummaryTransition` | 不在R06.3定义或复制；H11消费R06.4 canonical typed change | summary change owner归R06.4，set差异不得推断 change kind |

### 24.3 current gate

| check | conclusion |
|---|---|
| H11 before snapshot completeness | pass affected-definition；四个 rollup variant均有完整 previous snapshot |
| dual cursor / set / count preservation | pass；namespace与signal set不折叠，empty set与zero count仍是显式值 |
| duplicate canonical owner | none；R06.3拥有truth/transition，R06.5拥有record/revision/change |
| business/source truth mutation | none；H11只审计derived observation-side maintenance |
| planned verification | only；未执行测试、未生成commit/run/evidence/signoff |
| historical checkpoint | `R06.5-G_done_waiting_user` |
| historical next allowed | 读取 R06.6 对应输入；该动作与A/B批均已完成，当前指针为 `R06.6-B_done_waiting_user` |
