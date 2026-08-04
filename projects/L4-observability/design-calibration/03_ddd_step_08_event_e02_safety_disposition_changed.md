# L4-observability 03-详细设计 Step 08 - S08-F Event E02 `SafetyDispositionChanged`

> 状态: `defined_with_affected_open`；只完成协议设计记录
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Purpose、source 与非所有权边界

E02 暴露一个已提交的本地 safety disposition 快照，使 safe-signal formation、diagnostic projector
和受控 gap 处理可以观察有限状态。它不输出被检查的材料，不证明 Runtime/Sandbox/Artifact 内容
安全，也不把本仓 `Safe/Redacted` 提升为业务安全 verdict。

| 项 | exact contract |
|---|---|
| public name / code | `SafetyDispositionChanged` / `0x0502` |
| payload | `SafetyDispositionChangedPayload` |
| source | committed `SafetyDisposition::evaluate` 或 accepted `SafetyDispositionTransition` + post-state |
| subject | exact `disposition_ref` |
| follower | `ObservationOutboxFollowerSeed::SafetyDispositionChanged` |
| flow | `ProduceSafetyDispositionChangedFlow` |

## 2. Public payload schema

```rust
/// 已提交 safety disposition 的 redaction-first body-free 快照。
pub struct SafetyDispositionChangedPayload {
    /// 本地 disposition identity。
    pub disposition_ref: SafetyDispositionRef,
    /// 被评估的 exact receipt identity。
    pub receipt_ref: ObservationReceiptRef,
    /// 已提交的有限 safety lifecycle。
    pub state: SafetyDispositionState,
    /// 与 state 相容的 redaction classification。
    pub redaction_marker: RedactionMarker,
    /// 只表达是否发现禁止正文，不携带正文或摘要。
    pub forbidden_body: ForbiddenBodyFlag,
    /// 通过 safety/redaction 后的 safe-summary identity；absence保持显式。
    pub sanitized_summary_ref: Option<SafeSignalSummaryRef>,
}

impl ObservationOutboundPayload for SafetyDispositionChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::SafetyDispositionChanged;
}
```

V1 canonical order 为 `disposition_ref -> receipt_ref -> state -> redaction_marker ->
forbidden_body -> sanitized_summary_ref`。任何 arbitrary label、body fragment、body digest、provider reason、
policy text 或 credential 均不属于 schema。

## 3. Presence、状态与字段来源

| state | marker / body flag / summary matrix | event meaning |
|---|---|---|
| `Pending` | 只允许 owning object 的 validated candidate shape；不具 downstream eligibility | 本地评估存在，结论未稳定 |
| `Safe` | `Clean + NotDetected + Some` | body-free summary可供本仓受控路径使用 |
| `Redacted` | `Redacted + NotDetected + Some` | 只允许使用已脱敏summary identity |
| `Rejected` | summary `None`；finite marker/flag与post-state一致 | 本地 safety path拒绝，不是业务拒绝 |
| `Quarantined` | summary `None`；finite marker/flag与post-state一致 | 本地隔离，不是transport dead-letter |

| field | exact source | forbidden reconstruction |
|---|---|---|
| identities | committed `SafetyDisposition` | latest-by-receipt、event identity、hash |
| state/marker/flag | same post-state owning fields | transition target alone、error text、config default |
| summary Option | same post-state | resolver reread、raw material hash、receipt summary |

Creation 和 transition 分支都必须把 complete post-state 交给 pure E02 mapper。若 transition previous/
target 与 post-state 不相容、receipt relation漂移或 presence matrix非法，cursor分配后的整个 UoW回滚。
exact duplicate/no-change不生成 E02；Quarantined 不自动生成 `DeadLettered` Consumer outcome。

## 4. Same-UoW snapshot 与 publication

E02 遵循 `accepted mutation -> typed follower seed -> assigned cursor -> V1 envelope -> immutable
snapshot/Pending marker -> same-UoW commit`。事件 snapshot 与 disposition/history/result/outbox 要么全部
可见，要么全部不可见。J01 只读取 stored pair；发布失败不回滚 disposition，missing/corrupt snapshot
也不得从 current safety object重建。

逻辑订阅类限定为本仓 safe-signal/correlation projector、diagnostic/gap projector，以及经配置批准的
body-free observation consumer。下游 source owner、业务安全系统或 sandbox 不得把 E02 当作写入命令。
实际 binding、schema registration 与 route owner 仍在 Step 14 / `04`。

Publication retry 复用 `event_ref + snapshot digest + retained binding` 的 stable token。一个 accepted
source operation replay不再mint event；publisher retry不改变 schema、summary Option、state 或 marker。

## 5. Failure、redaction 和 truth guard

| failure | handling |
|---|---|
| invalid state/presence | local invariant error；source UoW rollback |
| unsupported encoder/schema | fail closed；不得省略E02后提交 mutation |
| outbox persistence failure | whole UoW rollback |
| known publish failure | separate publication marker/result；safety state不回退 |
| unknown publish outcome | probe before retry；不从consumer response猜测 |
| retained binding unavailable | manual/controlled recovery；不切换current binding |

Telemetry 只允许 E02 token、schema、finite state/marker/flag、summary presence 和 outcome。summary ref、
receipt/disposition ref、actor/source/trace/digest不作 metric label；禁止记录材料、redacted前后正文、
resolver/provider message、credential或locator。对禁止正文做hash/truncate也不能进入 event。

E02 不创建 SafeSignal，不修改 Receipt，不改变 source/sandbox/runtime truth，不触发 retention、evidence、
report handoff 或外部 delivery。后续对象必须重新执行其自己的 target-bound policy，不能只凭 E02 放行。

## 6. Closure

| check | conclusion |
|---|---|
| operation/payload sealed binding | complete |
| field owner/presence matrix | complete；引用 current safety object |
| immutable source and no-rebuild | complete at protocol level |
| Step 09 handoff | `ProduceSafetyDispositionChangedFlow` only |
| affected | `S08-F-E02-FLOW-CARDINALITY-01=open_internal_affected`：Step 09固定creation/transition事件基数 |
| status | `defined_with_affected_open`；not runtime-ready |
| evidence | design-only；未实现、未测试、未运行、未签署 |
