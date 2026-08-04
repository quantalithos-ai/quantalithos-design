# L4-observability 03-详细设计 Step 08 - S08-F Event E06 `ReportHandoffChanged`

> 状态: `defined_with_affected_open`；report handoff projection，不是 report truth

## 1. Purpose, source and boundary

E06 暴露一个已提交的 local report-handoff post-state，用于 Archive、external audit、management report
和 diagnostic projector观察 readiness/lifecycle。它不包含 report/evidence body、destination、archive
package、provider response、verdict、signoff或真实 run id。`Delivered` 只表示本地有限 delivery result 已记录。

| item | exact contract |
|---|---|
| name / code | `ReportHandoffChanged` / `0x0506` |
| payload | `ReportHandoffChangedPayload` |
| source | handoff draft creation or accepted `ReportHandoffTransition` + same-UoW post-state |
| subject | `handoff_ref` |
| follower | `ObservationOutboxFollowerSeed::ReportHandoffChanged` |
| flow | `ProduceReportHandoffChangedFlow` |

## 2. Public V1 schema

```rust
/// 已提交 Observability report-handoff state 的 body-free snapshot。
pub struct ReportHandoffChangedPayload {
    /// 本地 handoff identity。
    pub handoff_ref: ReportHandoffRecordRef,
    /// immutable observation-side handoff scope。
    pub handoff_scope_ref: ReportHandoffScopeRef,
    /// structured report consumer boundary。
    pub consumer_ref: ReportConsumerRef,
    /// 本地 lifecycle state。
    pub state: ReportHandoffState,
    /// 当前 policy readiness co-state。
    pub readiness: HandoffReadinessState,
    /// immutable body-free evidence input identity。
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,
    /// 可选 authenticity hint identity；不是真实性证明。
    pub authenticity_hint_ref: Option<AuthenticityHintRef>,
    /// 当前 effective Open/Acknowledged gaps。
    pub gap_refs: GapStateRefSet,
    /// 当前 visibility surface；初始 pending 时可缺失。
    pub visibility: Option<VisibilitySurface>,
    /// 当前 retention marker relation。
    pub retention_marker_ref: Option<RetentionMarkerRef>,
    /// 当前 no-write scope；不是写授权。
    pub no_write_guard_scope: Option<NoWriteGuardScope>,
    /// adapter-independent local delivery result。
    pub delivery_result: Option<HandoffDeliveryResult>,
    /// policy-blocked 时的有限原因。
    pub block_reason: Option<HandoffBlockReason>,
}

impl ObservationOutboundPayload for ReportHandoffChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::ReportHandoffChanged;
}
```

Canonical encoding order follows declaration。所有 nested types必须使用现有 owner；不得以 bool ready、
string consumer、generic ref、free-text reason 或 untyped map替代。

## 3. Presence and mapping matrix

| lifecycle/readiness | required relation |
|---|---|
| `Draft/PendingEvidence` | visibility/retention/no-write可按owner为None；delivery/block None；gap exact |
| `Prepared/Ready|Degraded` | visibility和no-write required；retention按accepted decision；delivery/block None |
| policy-blocked `Failed/Blocked` | `block_reason=Some`；delivery None；complete policy snapshot retained |
| delivery-originated `Failed` | `delivery_result=Some(non-delivered)`；block None |
| `Delivered` | `delivery_result=Some(Delivered)`；block None |
| `Cancelled` | current no callable；不得由配置/事件制造 |

Draft factory可产生一个E06 creation snapshot；accepted `apply_readiness/prepare/attach_hint/deliver/block`
transition使用 exact post-state mapper。transition before/after state/readiness/time及所有 overwritten fields
必须与post-state相容。exact no-change/duplicate hint不产生E06；reserved cancel不产生事件。

`authenticity_hint_ref` presence 不证明 RealEvidenceLinked；`gap_refs` empty只表示该 handoff effective subset
empty，不证明全局无gap；retention marker presence也不证明 archive eligibility或cleanup authorization。

## 4. Atomicity, publication and subscribers

E06 与 H4 lifecycle record、handoff version、相关 outbox/stale followers、stored result和reservation completion
在同一 assigned cursor/UoW提交。J07 external preparation/delivery只能在其独立 phase token提交后调用 port；
external call绝不发生在 E06 source UoW 内。Positive external carrier/receipt也不能替代 local post-state。

J01 只发布 immutable E06 bytes。Known failure不回滚 handoff；unknown使用 exact token probe；corrupt snapshot
进入 consistency/manual，不读取 latest handoff重建。Operation replay不产生第二E06。

逻辑 subscriber 类：Archive handoff adapter、external-audit/report projector、management/diagnostic read model。
Exact route/binding由 Step 14 / `04`持有；事件不公开 endpoint、credential、archive locator或delivery policy。

## 5. Error, redaction and no-truth-backwrite

| condition | posture |
|---|---|
| invalid state/readiness/presence | rollback accepted source UoW |
| transition/post-state mismatch | invariant defect, zero visible write |
| schema/encoder/outbox failure | whole UoW rollback |
| publication failure/unknown | independent J01 lifecycle; no handoff rollback/blind retry |
| downstream rejection | does not mutate handoff automatically; only authenticated I08/I09 exact protocol may later propose local feedback |

Telemetry 只允许 event/schema、finite state/readiness/result/block code、presence和set count。禁止 full refs、
consumer internals、report/evidence body、destination、archive package、credential、provider response、digest、
actor/source/trace values作为labels或raw fields。

E06 不反写 report、Archive、consumer、evidence、retention或source/business truth；不能生成 verdict、signoff、
evidence alias或real run identity。Subscriber acceptance也不能反向覆写E06 snapshot。

## 6. Final review

| check | conclusion |
|---|---|
| concrete payload / owner | complete |
| state/readiness/result matrix | complete at protocol level |
| external phase separation | complete；J07 port cut remains separate |
| Step 09 | `ProduceReportHandoffChangedFlow` only |
| affected | `S08-F-E06-FLOW-CARDINALITY-01=open_internal_affected`；Step 09逐factory/member固定事件基数 |
| status | `defined_with_affected_open`；not runtime-ready |
| implementation/evidence | not implemented/tested/run |
