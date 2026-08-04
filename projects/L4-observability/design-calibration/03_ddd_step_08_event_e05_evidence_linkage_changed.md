# L4-observability 03-详细设计 Step 08 - S08-F Event E05 `EvidenceLinkageChanged`

> 状态: `defined_with_affected_open`；body-free linkage only

## 1. Purpose and ownership boundary

E05 暴露一个已提交的 Observability evidence linkage revision，供 report-handoff、evidence-index、
external-audit preparation 等下游建立只读依赖。Artifact/Governance 继续拥有 evidence object/body、
lineage与真实性；Observability只拥有本地 structured boundary、purpose/scope、digest与visibility lifecycle。

| item | exact contract |
|---|---|
| name / code | `EvidenceLinkageChanged` / `0x0505` |
| payload | `EvidenceLinkageChangedPayload` |
| source | accepted `EvidenceLinkageTransition` + exact same-UoW post-state |
| subject | `linkage_ref` |
| follower | `ObservationOutboxFollowerSeed::EvidenceLinkageChanged` |
| flow | `ProduceEvidenceLinkageChangedFlow` |

## 2. V1 public schema

```rust
/// 已提交 body-free evidence linkage 的 immutable event payload。
pub struct EvidenceLinkageChangedPayload {
    /// 本地 linkage identity。
    pub linkage_ref: EvidenceLinkageRef,
    /// 拥有此 linkage 的本地 audit projection。
    pub projection_ref: AuditProjectionRef,
    /// 完整 structured external boundary snapshot；不含 evidence body。
    pub boundary_ref: GovernanceArtifactEvidenceReference,
    /// 本地消费目的。
    pub evidence_purpose: EvidenceConsumerPurpose,
    /// exact consumer/selection scope。
    pub consumer_scope: EvidenceConsumerScope,
    /// 已提交 linkage lifecycle。
    pub state: EvidenceLinkageState,
    /// canonical body-free boundary material 的完整性摘要。
    pub digest_summary: DigestSummary,
    /// NotVisible 状态的有限原因。
    pub visibility_reason: Option<EvidenceVisibilityReason>,
    /// BodyBlocked 状态的有限原因。
    pub body_blocked_reason: Option<BodyBlockedReason>,
}

impl ObservationOutboundPayload for EvidenceLinkageChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::EvidenceLinkageChanged;
}
```

Canonical order按声明。`boundary_ref`使用 current structured carrier 的 canonical encoder，不降格为
opaque/string external ref。digest不是body hash逃逸通道、evidence alias、authenticity proof或签名。

## 3. State/presence and transition mapping

| state | required conditional fields |
|---|---|
| `Candidate` | both reasons None；只允许 owner明确发布 creation snapshot，否则无事件 |
| `Linked` | both reasons None；boundary/digest exact usable snapshot |
| `BodyBlocked` | `body_blocked_reason=Some`、visibility None；terminal |
| `NotVisible` | `visibility_reason=Some`、body-block None |
| `Stale` | both reasons None；boundary/digest仍保留最后 accepted body-free snapshot |

| transition | required mapping |
|---|---|
| `Linked` | post-state Linked；可能原子替换 refreshed boundary/digest |
| `BodyBlocked` | post-state BodyBlocked；exact finite reason |
| `NotVisible` | post-state NotVisible；exact finite visibility reason |
| `MarkedStale` | post-state Stale；reason只进入H3/telemetry safe classification，不新增payload free text |

Immutable linkage/projection/purpose/scope identity必须与 previous snapshot和post-state相等。NotVisible 不得
映射成 Missing；Missing 不创建假 linkage/E05。exact replay/no-change不产生事件；不同 scope/purpose
必须是独立 linkage identity，不修改已有payload。

## 4. Same-UoW snapshot and consumption

Accepted linkage mutation、对应H3 append、projection membership/stale followers、stored result和 E05 pair
在一个 committed cursor/UoW中保存。E05 snapshot missing/corrupt时publisher fail closed；绝不查询 current
linkage、resolver或evidence owner重建。Operation duplicate只回放原result；J01 retry使用原stable token。

逻辑 subscriber 类为 report handoff/evidence-index projector、external-audit preparation projector，以及
明确配置的 Governance/Artifact body-free correlation adapter。Subscriber 不获得 external locator或
evidence body，并必须自行重新做visibility/readiness policy；E05 delivery不授权 handoff/export。

## 5. Error, redaction and no-backwrite

| condition | behavior |
|---|---|
| state/reason/digest/boundary mismatch | source UoW rollback |
| structured boundary encoder failure | rollback；不得降为opaque string |
| schema/size/outbox failure | rollback all local accepted material |
| publication failure | linkage保持 committed；J01单独分类 |
| unknown publication | exact-token probe；no blind resend |
| old binding unavailable | manual/controlled；no current binding fallback |

Telemetry 只允许 event/schema、finite state/purpose/boundary-family/visibility/body-block code、presence/count。
完整 linkage/projection/external refs、scope、digest、actor/trace不得作为labels；禁止 evidence body、locator、
credential、provider message、raw digest inputs或任何hash后的正文。

E05 不创建/修改 Artifact/Governance evidence，不生成真实 evidence alias，不断言 authenticity、lineage、
acceptance、verdict或signoff，不反写 report/retention/source truth。

## 6. Closure

| check | conclusion |
|---|---|
| payload and secondary owners | complete |
| four transitions / five states | total with explicit creation caveat |
| no-current-truth rebuild | fixed by stored snapshot pair |
| affected | `S08-F-E05-FLOW-CARDINALITY-01=open_internal_affected`；Step 09固定creation与四transition的0/1 mapping |
| status | `defined_with_affected_open`；not runtime-ready |
| implementation/evidence | not run/not claimed |
