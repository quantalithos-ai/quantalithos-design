# L4-observability 03-详细设计 Step 08 - S08-F Event E09 `GapStateChanged`

> 状态: `defined_with_affected_open`；gap 不是 source repair truth

## 1. Purpose and source authority

E09 发布一个已提交的 local `GapState` revision，使 read、handoff、retention、peripheral 和 diagnostic
projector 能显式观察 missing/unresolved/not-visible/unsafe 缺口。Gap 只解释本仓可观察缺口；`Resolved`
只表示存在本地 body-free close basis，不声明 source material 已修复或外部对象已恢复。

| item | exact contract |
|---|---|
| name / code | `GapStateChanged` / `0x0509` |
| payload | `GapStateChangedPayload` |
| source | accepted P12 creation or `GapTransition` + same-UoW `GapState` post-state |
| subject | `gap_ref` |
| follower | `ObservationOutboxFollowerSeed::GapStateChanged` |
| flow | `ProduceGapStateChangedFlow` |

## 2. Public V1 schema

```rust
/// 已提交 observation gap revision 的 body-free event payload。
pub struct GapStateChangedPayload {
    /// 本地 gap identity。
    pub gap_ref: GapStateRef,
    /// 解释 gap 的 structured body-free source。
    pub source_ref: GapSourceRef,
    /// finite gap classification。
    pub gap_kind: GapKind,
    /// 当前 lifecycle。
    pub state: GapLifecycleState,
    /// 被 gap 影响的 exact observation-side object。
    pub affected_object_ref: AffectedObservationObjectRef,
    /// 当前 linked degraded-output revision；absence保持显式。
    pub degraded_ref: Option<DegradedOutputRef>,
    /// 本地 opening time；不是 source occurrence time。
    pub opened_at: ObservedAt,
    /// Resolved 时的本地 close time。
    pub closed_at: Option<ObservedAt>,
    /// Resolved 时的 body-free close basis。
    pub close_reason: Option<GapCloseReason>,
}

impl ObservationOutboundPayload for GapStateChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::GapStateChanged;
}
```

V1 canonical order按声明。`source_ref` 与 `affected_object_ref` 保持完整 tagged carrier，不允许 generic
`BodyFreeRef`、string kind、provider key 或 hash shortcut。

## 3. State and transition totality

| branch | required post-state |
|---|---|
| P12 `Classified` creation | `Open`；close pair None；degraded None；source/kind/affected从complete decision复制 |
| `acknowledge` | `Acknowledged`；close pair不变None；degraded relation保持 |
| `mitigate` | `Acknowledged`；degraded ref变为 exact loaded Active/Blocked revision；close pair None |
| `close` | `Resolved`；`closed_at`和`close_reason`均Some；degraded relation保留作审计 |
| `Suppressed` | current no callable；不得由配置、decoder或event mapper产生 |

Transition 的 previous/current degraded、close、state、actor relation与完整post-state必须相容。E09不携带
acknowledging actor：actor已归H8 metadata/history，公开event只暴露current truth，避免将 actor ref扩散为
订阅者授权依据。exact mitigation replay返回None，不产生event；P12 `NoGap`也不创建 identity/event。

`degraded_ref` 只回指独立 `DegradedOutputState` revision。E09不能内联 degraded reason/visibility或把
`degraded_ref=None`解释为 normal/full output；consumer需要时必须读取其获授权的同一 committed projection。

## 4. Atomicity, idempotency and subscribers

E09 与 gap primary mutation、H8 record、可能独立 accepted degraded revision、projection stale followers、
stored result和outbox pair共享一个 cursor/UoW。若同一 flow 同时改变 gap 与 degraded revision，两者有
独立 decision/identity/history proof；E09不能从另一对象的 transition推导 gap变化。

Operation duplicate replay不生成第二H8/E09。J01 publisher只读取 immutable bytes；known failure不回滚
gap，unknown先probe，corrupt snapshot不从 current gap重建。

Subscriber 类：read/handoff/peripheral/retention/diagnostic/gap-status projector。Subscriber只能更新自己的
derived projection，不得关闭 gap、修补 source、扩大 visibility 或自动允许 handoff/delivery。Exact route/
binding留 Step 14 / `04`。

## 5. Error, redaction and no-backwrite

| condition | behavior |
|---|---|
| illegal state/presence/source-target relation | typed invariant and whole-UoW rollback |
| transition/post-state mismatch | rollback；no partial H8/outbox |
| set/ref encoder or schema failure | rollback；no opaque fallback |
| publication failure/unknown | separate J01 state/probe；gap remains committed |
| missing degraded dependency at subscriber | explicit unavailable/stale surface；不得猜 normal |

Telemetry 只允许 event/schema、finite gap/state、degraded/close presence、bounded counts。完整 source/gap/
affected/degraded refs、actor/trace/digest、provider response、body、locator、credential不得作为labels或raw
fields。禁止把 gap source bytes hash 后输出。

E09 不反写 source/business/external truth，不触发 repair、cleanup、delivery、verdict或signoff。

## 6. Closure

| check | conclusion |
|---|---|
| creation + three current transitions | total, no Suppressed callable |
| gap/degraded separation | explicit |
| field owners / canonical refs | complete |
| affected | `S08-F-E09-FLOW-CARDINALITY-01=open_internal_affected`；Step 09固定multi-gap item cardinality和E09数量 |
| status | `defined_with_affected_open`；not runtime-ready |
| implementation/evidence | not run/not claimed |
