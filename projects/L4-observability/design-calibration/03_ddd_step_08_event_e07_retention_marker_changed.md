# L4-observability 03-详细设计 Step 08 - S08-F Event E07 `RetentionMarkerChanged`

> 状态: `defined_with_affected_open`；retention projection only

## 1. Purpose and two-owner boundary

E07 发布本仓 retention marker 或其 active-reference protection relation 的已提交变化。Retention
marker、active protection、archive eligibility 和 cleanup authorization 是不同语义；E07 不把其中
任何一个提升为 Archive truth，也不执行删除、释放或外部写入。

| item | exact contract |
|---|---|
| name / code | `RetentionMarkerChanged` / `0x0507` |
| payload | `RetentionMarkerChangedPayload` |
| source | accepted `RetentionMarkerTransition` 或 `ActiveReferenceProtectionTransition` + exact post-state |
| subject | marker/protection owner 的 canonical observation identity；具体变体由 typed subject tag固定 |
| follower | `ObservationOutboxFollowerSeed::RetentionMarkerChanged` |
| flow | `ProduceRetentionMarkerChangedFlow` |

## 2. Public payload schema

```rust
/// 已提交 retention/protection revision 的 body-free event payload。
pub struct RetentionMarkerChangedPayload {
    /// retention marker identity；marker transition时必有。
    pub marker_ref: Option<RetentionMarkerRef>,
    /// active protection identity；protection transition时必有。
    pub protection_ref: Option<ActiveReferenceProtectionRef>,
    /// 被保护的 observation-side object。
    pub protected_ref: ProtectedObservationRef,
    /// 当前 marker state；marker transition时必有。
    pub marker_state: Option<RetentionMarkerState>,
    /// 当前 active protection state；protection transition时必有。
    pub protection_state: Option<ActiveReferenceProtectionState>,
    /// 当前 active consumer set；只复制有限 structured refs。
    pub active_consumer_refs: ObservationConsumerRefSet,
    /// 当前 archive eligibility hint；不是 archive acceptance。
    pub archive_eligibility_ref: Option<ArchiveEligibilityRef>,
    /// 当前 marker release/conflict reason 的有限安全投影。
    pub marker_release_reason: Option<RetentionReleaseReason>,
    pub marker_conflict_reason: Option<RetentionConflictReason>,
    /// 当前 protection release/conflict reason 的有限安全投影。
    pub protection_release_reason: Option<RetentionReleaseReason>,
    pub protection_conflict_reason: Option<ProtectionConflictReason>,
}

impl ObservationOutboundPayload for RetentionMarkerChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::RetentionMarkerChanged;
}
```

`marker_ref` 与 `protection_ref` 不能同时为 `None`，也不能同时为 `Some`；对应 current owner
决定另一组字段的 presence。`protected_ref` 两种 transition 都必须 exact 相等。Canonical order
按声明；所有 set/reason 使用既有 finite/canonical owner。

## 3. Source mapping and presence matrix

| source transition | required payload branch | proof |
|---|---|---|
| `RetentionMarkerTransition::DecisionApplied` | marker Some、protection relation按 post-state、evaluated consumer set对应 P8 snapshot | state/relation/reason与 post marker exact |
| `RetentionMarkerTransition::ArchiveEligibilityAttached` | marker Some、archive ref changed、evaluated protection fields None/empty | state-preserving hint-only change，不能伪造 protection decision |
| `ActiveReferenceProtectionTransition::ConsumerAttached` | protection Some、affected consumer in current set | `change_kind`与 set delta exact |
| `ConflictMarked` | protection Some、current conflict reason Some | no marker decision basis inferred |
| `ReleaseDecisionApplied` | protection Some、current set/reason/state exact | P8 decision relation exact |

post-state 由 owning aggregate 提供完整 current fields；transition previous/current pair不能由 publisher
从 current row反推。exact duplicate/no-change不产生 E07。Marker `Released`、protection `Released` 或
`Expired` 是 local lifecycle values，不表示已清理 source/archive；当前 marker `release()` 仍 reserved，
不得由事件反向激活。

## 4. UoW, idempotency and consumers

E07 与 H5 retention/protection record（具体 H5 cardinality由 accepted transition决定）、primary mutation、
stale/membership followers、stored result和outbox pair共享同一 cursor/UoW。Publisher只消费 immutable
snapshot，不能读取 current marker/protection或按 ref set补字段。Operation duplicate replay 原 result，
不会重复 H5/E07；publication retry使用原 event/digest/binding/token。

Subscriber 类限定为 retention/read-model、reference protection、handoff/export readiness 和 operations
diagnostic projector。Archive/cleanup owner收到的是 observation marker，不能据此执行 cleanup；actual
route/binding由 Step 14 / `04`持有。

## 5. Error, redaction and no-write

| condition | handling |
|---|---|
| both owner refs absent/present or mixed fields invalid | typed invariant；rollback |
| post-state/transition set/reason mismatch | rollback; no partial marker/protection commit |
| schema/encoder/outbox failure | whole accepted UoW rollback |
| publication failure | local marker/protection remains committed; J01 sidecar only |
| publication unknown | exact probe; no blind resend/current rebuild |

Telemetry 仅允许 E07 name/schema、marker/protection state、finite reason code、set count/presence。完整 refs、
consumer IDs、protected object detail、digest、actor/trace、archive locator、retention policy text、credential
和provider response均禁止 raw/label 输出。对敏感值做 hash/truncate 也不改变禁止性。

E07 不修改 source truth、Archive package、retention policy、active consumer truth或外部 cleanup，不创建
archive acceptance、evidence、handoff verdict或signoff。

## 6. Closure and affected

| check | conclusion |
|---|---|
| two owner branches | explicit and mutually exclusive |
| nested schema / reason owners | current Step 06 owned |
| publication snapshot / no rebuild | complete at protocol level |
| affected | `S08-F-E07-FLOW-CARDINALITY-01=open_internal_affected`；Step 09固定H5 transition cardinality |
| status | `defined_with_affected_open`；not runtime-ready |
| implementation/evidence | not run/not claimed |
