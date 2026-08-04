# L4-observability 03-详细设计 Step 08 - S08-F Event E03 `SafeSignalRecorded`

> 状态: `defined_with_affected_open`；不是 raw telemetry event
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol purpose and truth boundary

E03 通知下游一个 Observability-owned safe signal 已发生可发布的 committed change。事件只携带
safe summary identity、correlation relation、有限 signal kind/state 和可选 runtime/sandbox boundary
reference；不携带 log line、metric sample、trace/span body、attributes、provider result或执行 verdict。

| item | exact contract |
|---|---|
| public name / code | `SafeSignalRecorded` / `0x0503` |
| payload | `SafeSignalRecordedPayload` |
| source | accepted `SafeSignalTransition` + same-UoW `SafeSignal` post-state；initial creation only when owner-approved publishable change exists |
| subject | exact `signal_ref` |
| follower | `ObservationOutboxFollowerSeed::SafeSignalRecorded` |
| flow | `ProduceSafeSignalRecordedFlow` |

名称沿用 HLD 骨架，但事件可表达 Recorded、Stale、Revalidated 或 Suppressed 后的完整有限 post-state；
`Recorded` 不是固定 payload state，更不是“所有输入已成功执行”。

## 2. Public V1 payload

```rust
/// 已提交 safe-signal revision 的 body-free snapshot。
pub struct SafeSignalRecordedPayload {
    /// 本仓 safe signal identity。
    pub signal_ref: SafeSignalRef,
    /// 有限 log/metric/trace/summary family；不包含具体值。
    pub signal_kind: SafeSignalKind,
    /// 构成该 signal 的本地 correlation context。
    pub correlation_context_ref: CorrelationContextRef,
    /// 已提交的本地 signal lifecycle。
    pub state: SafeSignalState,
    /// 已接受的 body-free safe summary identity。
    pub summary_ref: SafeSignalSummaryRef,
    /// 可选 runtime/sandbox boundary reference；不表示执行成功。
    pub runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}

impl ObservationOutboundPayload for SafeSignalRecordedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::SafeSignalRecorded;
}
```

Canonical field order exactly follows the declaration. V1 没有 rollup window ref：一个 signal 可属于
零个或多个后续 materialized windows，当前 `SafeSignal` post-state也不拥有唯一 window。概要中“rollup
window ref”视为 historical overreach；E03 不得选择 first/latest window 或制造 nullable owner。

## 3. Field and state mapping

| field | authority | invariant / absence | prohibited fallback |
|---|---|---|---|
| `signal_ref` | same-UoW post-state | equals envelope subject | summary/runtime/event ref |
| `signal_kind` | immutable `SafeSignal.signal_kind` | exact finite token | telemetry backend kind string |
| `correlation_context_ref` | immutable post-state | must match accepted transition/context proof | trace metadata、receipt ref |
| `state` | owning member post-state | Candidate is not publishable; current publish states are Recorded/Stale/Suppressed | bool active、projection freshness |
| `summary_ref` | current accepted post-state | revalidation may replace it; exact committed value | resolver reread、body hash |
| `runtime_signal_ref` | exact post-state Option | None remains None | trace ref、latest runtime run、provider id |

`SafeSignalTransition::Recorded/MarkedStale/Revalidated/Suppressed` 与完整 post-state 必须通过 total mapper；
transition kind、from/to state、summary replacement 和 runtime relation不一致时 rollback。initial Candidate
creation本身不构成 E03；只有 owner明确设计的可发布 creation branch 才能加入 future total matrix。

## 4. Snapshot, ordering and downstream use

Accepted change 与 H11/other mandatory record、projection stale followers、stored result、idempotency completion
和 E03 outbox pair共享一个 cursor/UoW。E03 encoder只处理 typed values；snapshot canonical bytes/digest
形成后不可更换。J01 使用 retained publication binding，绝不读取 current signal、rollup 或 correlation state。

逻辑 subscriber 类：signal rollup/read-model projector、diagnostic surface、body-free dashboard/peripheral
projection，以及被授权的 runtime diagnostic consumer。订阅者只能把 E03 当作 observation projection
input；需要 rollup membership 时必须执行自己的 scope/window policy，不能从 event 猜唯一 window。

Operation replay不生成第二E03。Publication retry使用原 stable token；known publish failure只更新
outbox publication sidecar，unknown先probe。发布成功也不意味着 subscriber consumed、runtime succeeded、
signal valid forever 或 raw telemetry archived。

## 5. Error, redaction and no-write rules

| condition | result |
|---|---|
| Candidate / invalid transition mapping | no event；若 accepted mapper宣称mandatory则 whole UoW rollback |
| summary/context/runtime relation mismatch | typed invariant error and rollback |
| schema/size/encoder failure | rollback；不可通过省略字段继续 |
| missing/corrupt stored snapshot | consistency/manual；no current-state rebuild |
| publish failure/unknown | separate J01 failure/probe lifecycle；signal不回退 |

Telemetry 可记录 event/schema、finite signal kind/state、runtime-ref presence、publication outcome 和 bounded
counts。禁止完整 refs、summary digest、actor/source/trace values作为labels；禁止 raw telemetry、tag/attribute
map、span/log/metric value、prompt/tool/provider material、credential或locator。hash/truncation不改变禁止性。

E03 不创建/修改 Runtime、Sandbox、source、business truth，不触发 evidence、retention、handoff 或
external acceptance。下游必须继续遵守 redaction/visibility/no-write policy。

## 6. Final review

| check | conclusion |
|---|---|
| concrete schema / owner | complete；all nested types current-owned |
| HLD window-ref conflict | resolved as historical overreach；no unique current authority exists |
| source / snapshot / no-rebuild | complete at Step 08 design level |
| affected | `S08-F-E03-FLOW-CARDINALITY-01=open_internal_affected`；Step 09 total mapper固定transition/event cardinality |
| status | `defined_with_affected_open` |
| implementation/evidence | not implemented/tested/run；无伪造证据 |
