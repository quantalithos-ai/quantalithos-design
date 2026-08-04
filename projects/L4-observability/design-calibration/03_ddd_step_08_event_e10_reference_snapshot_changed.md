# L4-observability 03-详细设计 Step 08 - S08-F Event E10 `ReferenceSnapshotChanged`

> 状态: `defined_with_affected_open`；reference snapshot 是本地安全投影

## 1. Purpose and non-owner boundary

E10 发布一个已提交的 local reference-snapshot state，使 Query、maintenance、gap scan 和 handoff projector
观察 safe-summary freshness/resolution。它不携带 external body/provider response，也不修改 Identity、
Governance、Artifact、Runtime、Sandbox 或 Archive 的生命周期 truth。

| item | exact contract |
|---|---|
| name / code | `ReferenceSnapshotChanged` / `0x050a` |
| payload | `ReferenceSnapshotChangedPayload` |
| source | `ReferenceSnapshotState::pending` creation、accepted in-place `ReferenceSnapshotTransition` 或 required-new snapshot creation |
| subject | canonical `ReferenceSnapshotStateRef` |
| follower | `ObservationOutboxFollowerSeed::ReferenceSnapshotChanged` |
| flow | `ProduceReferenceSnapshotChangedFlow` |

Historical `ReferenceSnapshotRef` 没有 current owner/encoder，任何 use-site 都必须替换为
`ReferenceSnapshotStateRef`，不得增加 alias。

## 2. Public V1 payload

```rust
/// 已提交 local reference-snapshot revision 的 body-free payload。
pub struct ReferenceSnapshotChangedPayload {
    /// canonical local snapshot-state identity。
    pub snapshot_ref: ReferenceSnapshotStateRef,
    /// 被跟踪的 structured safe subject。
    pub subject_ref: ReferenceSubjectRef,
    /// 当前 resolution/freshness lifecycle。
    pub state: ReferenceSnapshotStateKind,
    /// Resolved 时的 safe external summary identity。
    pub safe_summary_ref: Option<SafeExternalSummaryRef>,
    /// Resolved 时与summary成对的 source version。
    pub source_version: Option<ObservationSourceVersionRef>,
    /// Stale 状态的有限原因。
    pub stale_reason: Option<ReferenceStaleReason>,
    /// Unresolved/Unavailable 状态的有限原因。
    pub resolution_reason: Option<ReferenceResolutionReason>,
    /// Invalid 状态的有限原因。
    pub invalid_reason: Option<ReferenceInvalidReason>,
    /// owning snapshot记录的本地 observation time。
    pub observed_at: ObservedAt,
}

impl ObservationOutboundPayload for ReferenceSnapshotChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::ReferenceSnapshotChanged;
}
```

Canonical order按声明。`subject_ref`是 structured carrier，不降级为 external URI/id；summary/version只保存
safe body-free identity，不保存 provider content、response code、credential或 raw digest。

## 3. State/presence matrix and source mapping

| state | required fields |
|---|---|
| `Pending` | summary/version/reasons all None |
| `Resolved` | summary + source_version Some；all reasons None |
| `Stale` | stale_reason Some；resolution/invalid None；usable pair按current owner exact保留/清除 |
| `Unresolved` | resolution_reason Some；summary/version unusable；other reasons None |
| `Invalid` | invalid_reason Some；summary/version None；other reasons None |
| `Unavailable` | resolution_reason Some；summary/version unusable；other reasons None |

In-place mapper必须同时验证 P17 maintenance basis、P15 freshness basis、transition before/after fields和
post-state complete shape。`PreserveCurrent`/exact replay无event。`RequireNewSnapshot` 不伪造 old-row
transition：新 identity 的完整 state作为独立 creation E10，旧 Invalid revision不变。Pending registration
可以生成 creation E10，但不能声称resolver已经执行。

## 4. UoW, cursor and publication

E10 与 reference snapshot primary、H10 refresh record（适用时）、projection stale/membership、stored result
和outbox pair同一UoW提交。Reference-only UoW使用一个 tagged Reference cursor；mixed UoW使用唯一
Observation cursor，不能同时分配两个。Envelope保留 exact tagged committed cursor。

Operation duplicate不生成第二 E10。J01 使用 stored snapshot/binding/token；publish failure不回退 snapshot，
unknown先probe，snapshot缺失/损坏不调用 current resolver或读取 current source重建。

Subscriber 类：reference/read/maintenance/gap/handoff projector。Subscriber不得将 Resolved 解释为 external
object active/authentic/accepted，不能调用 source owner写接口。Exact binding/locator留 Step 14 / `04`。

## 5. Error, redaction and no-backwrite

| condition | posture |
|---|---|
| invalid state/presence pair | typed invariant and rollback |
| subject/snapshot/decision mismatch | rollback；no H10/outbox partial |
| cursor namespace mismatch | rollback as assembly invariant |
| schema/encoder/outbox failure | whole source UoW rollback |
| publication failure/unknown | independent marker/probe; snapshot remains committed |

Telemetry 只允许 event/schema、finite state/reason kind、summary/version presence、cursor namespace和counts。
完整 refs、source version、actor/trace/digest、provider detail、body、locator、credential不得作为 labels/raw
fields。不可用 hash/truncation规避边界。

E10 不反写 external/source/business truth，不触发 lifecycle mutation、evidence mint、retention cleanup、
handoff verdict、delivery acceptance或signoff。

## 6. Closure and affected

| check | conclusion |
|---|---|
| canonical ref / no historical alias | complete |
| six-state presence matrix | complete |
| in-place vs new identity | explicit and non-fabricating |
| affected | `S08-F-E10-FLOW-CARDINALITY-01=open_internal_affected`；Step 09固定register/in-place/new-snapshot事件基数 |
| status | `defined_with_affected_open`；not runtime-ready |
| implementation/evidence | not run/not claimed |
