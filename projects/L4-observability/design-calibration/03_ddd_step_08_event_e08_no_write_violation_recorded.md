# L4-observability 03-详细设计 Step 08 - S08-F Event E08 `NoWriteViolationRecorded`

> 状态: `defined_with_affected_open`；只记录已存在的 forbidden-write violation handling

## 1. Purpose and fail-closed boundary

E08 发布一个已提交 H6 no-write violation handling fact。它用于 operations review、diagnostic 和
governance audit projection；它不执行补偿写入、不携带被阻止的 body、不证明 adapter 已被调用，也不
把 P10 的普通 local deny 伪造成 violation。只有 `NoWriteViolation` 已由合法 forbidden target 创建，
并发生 accepted transition 时，才可生成 E08。

| item | exact contract |
|---|---|
| name / code | `NoWriteViolationRecorded` / `0x0508` |
| payload | `NoWriteViolationRecordedPayload` |
| source | `NoWriteViolationTransition` + same-UoW post-state + H6 record relation |
| subject | `violation_ref` |
| follower | `ObservationOutboxFollowerSeed::NoWriteViolationRecorded` |
| flow | `ProduceNoWriteViolationRecordedFlow` |

## 2. Public V1 payload schema

```rust
/// 已提交 no-write violation handling 的 body-free payload。
pub struct NoWriteViolationRecordedPayload {
    /// 本地 violation identity。
    pub violation_ref: NoWriteViolationRef,
    /// 触发该 violation 的 immutable boundary context。
    pub trigger_context_ref: NoWriteTriggerContextRef,
    /// 被尝试写入的 source/external truth target；不包含 locator/body。
    pub attempted_write_target: ForbiddenWriteTargetRef,
    /// transition 前后的 finite lifecycle。
    pub from_state: NoWriteViolationState,
    pub to_state: NoWriteViolationState,
    /// accepted H6 record 分类。
    pub record_kind: NoWriteViolationRecordKind,
    /// 当前 escalation/close reason 的 mutually exclusive projection。
    pub reason: Option<NoWriteViolationRecordReason>,
}

impl ObservationOutboundPayload for NoWriteViolationRecordedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::NoWriteViolationRecorded;
}
```

V1 canonical order按声明。`reason` 与 `to_state` 矩阵必须 total：`Blocked` 为 `None`；`Escalated`
为 `Some(Escalation(...))`；`Closed` 为 `Some(Closure(...))`。`record_kind` 必须与 accepted transition
对应，不能从 state/name 推断。

## 3. Creation/transition admission matrix

| source situation | E08 result |
|---|---|
| `detect` only, state `Detected` | no event/no H6 record；尚无 accepted transition |
| `Detected -> Blocked` | one H6 record + one E08; reason None |
| `Detected/Blocked -> Escalated` | one H6 record + one E08; exact escalation reason |
| `Blocked/Escalated -> Closed` | one H6 record + one E08; exact close reason；prior escalation remains in record history, not payload reason |
| P10 local `Blocked` with no legal `ForbiddenWriteTargetRef` | no E08；typed process-local guard result only |

`trigger_context_ref`、`attempted_write_target` 和 `violation_ref` 必须在 transition、post-state、H6
record中逐字段一致。`from_state == to_state`、duplicate reason或重放不产生第二 event；reserved/unknown
transition不进入 mapper。E08 不含 `NoWriteViolationRecordRef`，因为它是 history identity，不是对外业务
payload identity；需要 history 回指时由 stored receipt/outbox relation承接，而不是增加第二 ref。

## 4. Atomicity and publication

E08 与 `NoWriteViolation` post-state、H6 record、assigned cursor、stored result和outbox pair同一 UoW
提交。`NoWriteViolationRecord` append失败则整个 violation handling rollback；预留 ref不可复用。J01只消费
stored bytes；publication failure不回滚已提交的 fail-closed handling；unknown先 probe。Operation replay
复用原结果，不再记录 violation或 event。

Subscriber 类：governance audit consumer、operations review、diagnostic/read model。它们只可观察
“本地发现并阻止了某类 forbidden target”，不得尝试 source/external write、补偿、删除或重放原操作。

## 5. Error, redaction and no-backwrite

| condition | posture |
|---|---|
| missing/foreign violation or target | typed invariant/manual；zero write |
| transition/reason/record mismatch | rollback all local facts |
| encoder/schema/outbox failure | rollback violation and H6 record |
| publication failure | local H6/E08 remains committed；J01 handles separately |
| publication unknown/corrupt snapshot | probe/manual；no current-state rebuild |

Telemetry 只允许 event/schema、from/to finite state、record kind、reason kind、presence/count。完整 violation、
trigger、target、actor/source/trace/digest/ref values、attempted body、locator、credential、provider message
不得进入 raw log/metric label/trace/dead-letter/report。禁止用 hash 代替 redaction。

E08 不反写 source truth、external truth、business truth，不发起补偿，不创建 evidence/retention/handoff/
verdict/signoff。事件本身不证明 write call 已到达 provider；它只证明本地 violation handling 已提交。

## 6. Closure and affected

| check | conclusion |
|---|---|
| H6 owner / no-H7 boundary | explicit；read-audit H7 remains absent/reserved |
| state/reason totality | complete for current three accepted transition classes |
| local deny exclusion | explicit; no fabricated forbidden target |
| affected | `S08-F-E08-FLOW-CARDINALITY-01=open_internal_affected`；Step 09确认 H6 record/event 1:1 |
| status | `defined_with_affected_open`；not runtime-ready |
| implementation/evidence | not run/not claimed |
