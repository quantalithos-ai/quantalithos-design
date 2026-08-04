# L4-observability 03-详细设计 Step 08 - S08-F Event E04 `AuditProjectionAppended`

> 状态: `defined_with_affected_open`；source audit truth 仍由上游 owner 持有

## 1. Purpose and accepted source

E04 公开一个已提交的 Observability audit projection append/change snapshot，使 Governance、Artifact、
Archive/report-handoff projector 可建立 body-free relation。它不复制 source audit body、治理决策、
证据正文、action payload 或外部审计 verdict。

| item | exact contract |
|---|---|
| name / code | `AuditProjectionAppended` / `0x0504` |
| payload | `AuditProjectionAppendedPayload` |
| source | accepted `AuditProjectionTransition` + same-UoW post-state + exact accepted append ref |
| subject | `projection_ref` |
| follower | `ObservationOutboxFollowerSeed::AuditProjectionAppended` |
| flow | `ProduceAuditProjectionAppendedFlow` |

## 2. Public payload schema

```rust
/// 一次已提交 observation audit projection append 的 body-free snapshot。
pub struct AuditProjectionAppendedPayload {
    /// 本地 audit projection identity。
    pub projection_ref: AuditProjectionRef,
    /// projection 表达的 body-free subject。
    pub subject_ref: AuditSubjectRef,
    /// 关联到 projection 的 observation-side context。
    pub correlation_context_ref: CorrelationContextRef,
    /// imported source-audit fact identity；不是正文。
    pub source_audit_ref: SourceAuditRef,
    /// 本次 accepted append record identity。
    pub append_record_ref: AuditAppendRecordRef,
    /// 本次 append/change 的有限分类。
    pub append_kind: AuditAppendKind,
    /// append 后的 projection lifecycle。
    pub state: AuditProjectionState,
    /// append 后的完整 canonical linkage refs。
    pub linkage_refs: EvidenceLinkageRefSet,
    /// append 后的完整 canonical gap refs。
    pub gap_refs: GapStateRefSet,
    /// visibility-restricted 时的有限 reason；其他状态保持 `None`。
    pub visibility_reason: Option<EvidenceVisibilityReason>,
}

impl ObservationOutboundPayload for AuditProjectionAppendedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::AuditProjectionAppended;
}
```

V1 canonical order按声明固定。两个 ref set各自沿用 current bounded/canonical owner；事件没有
source-audit summary body、evidence body、actor profile、provider response、record detail text或 locator。

## 3. Transition-to-payload total mapping

| transition | `append_kind` | required post-state proof |
|---|---|---|
| `SourceFactAppended` | `SourceFactAppended` | exact append head；source fact flag true；target state按from matrix |
| `EvidenceLinkageAppended` | `EvidenceLinkageAppended` | exact linkage inserted and append head changed |
| `VisibilityRestricted` | `VisibilityRestricted` | state Restricted；visibility reason Some(exact reason) |
| `VisibilityRestored` | `VisibilityRestored` | state Appended；visibility reason None |
| `GapAttached` | `GapAttached` | exact gap inserted；state preserved；append head exact |

所有 immutable identity必须与 transition.previous/post-state逐字段相等；`append_record_ref`来自
accepted transition，不从 post-state latest row之外猜测。duplicate linkage/gap返回 `Ok(None)`，不消费
append ref、不产生 E04。reserved suppress、pre-UoW reject、rollback或 Query 均不生成 event。

## 4. UoW, idempotency and subscriber boundary

E04、H3 `AuditAppendRecord`、projection version、membership/stale followers、stored result和reservation
completion在同一 accepted UoW提交。typed encoder在 assigned cursor 后形成 immutable snapshot；outbox
append失败必须回滚全部。Publisher只消费 snapshot；不能查询 latest projection重建 set或reason。

同 logical operation duplicate重放原 result，不追加第二H3/E04。J01 publication retry使用原 event/
digest/binding/token；外部 outcome unknown必须probe。成功 publish不证明 Governance/Artifact/Archive
接收，更不证明 source audit fact真实或业务合规。

允许 subscriber 类：Governance/Artifact 的 body-free audit context adapter、Archive/report handoff
projector、evidence-index/diagnostic projector。actual binding由 Step 14 / `04` 持有；payload不得编码 topic、
consumer name、endpoint、credential 或 delivery policy。

## 5. Error, redaction and no-backwrite

| error | exact posture |
|---|---|
| transition/post-state/ref-set mismatch | rollback as invariant defect |
| set bound/duplicate/canonical error | rollback；不截断 |
| unsupported schema/encoder/size | rollback mutation and all followers |
| missing/corrupt snapshot | consistency/manual；no projection reread |
| publication known failure | marker/report only；projection/history不回滚 |
| publication unknown | exact token probe before resend |

Telemetry 只记录 E04/schema、finite append kind/state、set counts、reason presence、publication outcome。
projection/subject/source/append/linkage/gap/actor/trace refs及digest不得成为 labels；任何 source audit body、
Governance decision text、evidence material、credential、route/provider detail均禁止。

E04 不能修改 source audit、Governance、Artifact、Archive 或 report truth；不能创建 evidence alias、
verdict、signoff或真实 run id。下游仅可建立其自身授权的 projection/reference。

## 6. Closure and affected

| check | conclusion |
|---|---|
| payload fields and nested owners | complete |
| transition totality | five variants mapped, no wildcard/default |
| source/history/outbox atomicity | exact Step 06/07 handoff fixed |
| Step 09 | only `ProduceAuditProjectionAppendedFlow` |
| affected | `S08-F-E04-FLOW-CARDINALITY-01=open_internal_affected`；Step 09按五variant固定0/1 E04 |
| status | `defined_with_affected_open`；not runtime-ready |
| implementation/evidence | not run/not claimed |
