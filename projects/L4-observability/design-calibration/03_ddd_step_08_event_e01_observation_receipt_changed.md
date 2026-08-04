# L4-observability 03-详细设计 Step 08 - S08-F Event E01 `ObservationReceiptChanged`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. 输入、目的与 truth boundary

本项已读取 current Step 06 的 `ObservationReceipt`、`ObservationReceiptTransition`、
cursor-bound follower、stored outbox snapshot，以及 Step 07 的 UoW/outbox/publisher 契约。
旧 Step 09 producer 表只作 historical flow hint，不具有 current `pass` 效力。

E01 发布一个已提交的 Observability intake receipt 快照，供下游建立只读投影、诊断关联或
gap 检查。它只声明“本仓记录了什么 admission state”，不声明 source material 被业务系统
接受、安全结论为业务真相、原始材料存在或外部消费成功。

| 项 | exact contract |
|---|---|
| public name / code | `ObservationReceiptChanged` / `0x0501` |
| payload | `ObservationReceiptChangedPayload` |
| source | accepted `ObservationReceipt::receive` 或 `ObservationReceiptTransition` 加同一 UoW post-state |
| envelope subject | `receipt_ref` 的 canonical body-free identity |
| materializer | `ObservationOutboxFollowerSeed::ObservationReceiptChanged` |
| publication | 只由 J01 `PublishObservationOutbox` 消费 immutable stored pair |
| Step 09 reservation | `ProduceObservationReceiptChangedFlow` |

## 2. Public payload schema

```rust
/// 已提交 observation receipt 的 body-free 出站快照。
pub struct ObservationReceiptChangedPayload {
    /// 本仓生成的 receipt identity。
    pub receipt_ref: ObservationReceiptRef,
    /// receipt 所引用的结构化 source 边界，不包含 source body。
    pub source_ref: ObservationSourceRef,
    /// 已提交的本地 admission lifecycle。
    pub admission_state: ObservationReceiptState,
    /// 已绑定 safety disposition；尚未绑定时保持 `None`。
    pub safety_disposition_ref: Option<SafetyDispositionRef>,
    /// 建立该 receipt 的有限 observation-side purpose。
    pub submission_purpose: SubmissionPurpose,
}

impl ObservationOutboundPayload for ObservationReceiptChangedPayload {
    const EVENT: ObservationOutboundEventName =
        ObservationOutboundEventName::ObservationReceiptChanged;
}
```

E01 使用 `SchemaVersion::V1`。payload 编码顺序固定为
`receipt_ref -> source_ref -> admission_state -> safety_disposition_ref -> submission_purpose`；
不得添加 map、free text、raw material、source status、provider result 或 transport locator。

## 3. 字段 authority 与构造矩阵

| field | 唯一 accepted source | validation | 禁止替代 |
|---|---|---|---|
| `receipt_ref` | committed post-state | 等于 envelope `subject_ref` 的 typed identity | source ref、event ref、result ref |
| `source_ref` | immutable `ObservationReceipt.source_ref` | structured kind/object/version relation仍有效 | payload body、topic、tenant string |
| `admission_state` | post-state owning member | 必须是 current six-state finite value | bool accepted、safety state、HTTP status |
| `safety_disposition_ref` | post-state exact Option | `Accepted` 时 required；其他状态按 owning invariant保留 exact absence/presence | latest disposition lookup、任意 ref |
| `submission_purpose` | immutable receipt field | 与 committed receipt/source relation相容 | subscriber purpose、route name |

构造分支只有两个：新 receipt 的完整 committed post-state，或 accepted transition 与其同一 UoW
post-state。transition snapshot、post-state identity/state 不一致时整个 UoW 失败；不得用 transition
的目标状态加 repository current row 拼装。duplicate、reserved supersede、pre-UoW rejection、rollback
和 exact no-change 均不产生 E01。

## 4. Snapshot、幂等与 publication boundary

```text
accepted receipt mutation
  -> validate exact E01 post-state mapping
  -> allocate one committed cursor
  -> encode typed V1 envelope
  -> persist snapshot + Pending outbox record in the same UoW
  -> commit receipt/history/result/outbox atomically
  -> J01 later publishes the stored bytes through the retained binding
```

E01 没有调用方提供的 idempotency key。唯一性来自 source operation reservation、独立
`OutboundEventRef`、`OutboxPayloadSnapshotRef`、`OutboxRecordRef` 及同 UoW follower cardinality。
原 operation replay 返回原 stored result，不生成第二事件。J01 重试复用原 bytes、digest、schema、
binding 和 stable token；publisher 不重读 receipt。

允许的逻辑订阅类为 source-owner observation adapter、diagnostic/read-model projector 和 gap scanner。
这不是动态 fan-out 列表；exact subscriber/binding revision 由 Step 14 / `04` 的 retained
`ExternalEffectBindingRef` 持有，payload 不携带 topic、endpoint、credential 或 product name。

## 5. Error、redaction 与 no-backwrite

| condition | required behavior |
|---|---|
| payload/state/subject mismatch | accepted UoW rollback；`FollowerPlanMismatch` 或 typed invariant error |
| encoder/schema/size failure | rollback；不得降级为无事件成功 |
| snapshot/record append failure | rollback receipt mutation、record、result和completion |
| publication known failure | receipt truth保持 committed；J01记录 publication failure/retry posture |
| publication unknown | exact-token probe；不得盲发或重建 payload |
| corrupt/missing snapshot | consistency/manual；不得从 current receipt 修复 |

Log/metric/trace 只允许 event name、schema、finite admission state、purpose、presence 和 bounded count。
完整 source/receipt/disposition ref、actor、trace、digest不得作为 metric label；raw material、safe summary
body、credential、locator和provider detail不得进入 event、telemetry、dead-letter 或 report。

E01 不反写 source truth，不触发 safety evaluation，不创建 evidence、retention、handoff 或 signoff。
下游收到事件也只能建立其被授权的投影，不能把 event delivery 当作 intake acceptance proof。

## 6. Affected 与最终审查

| check | conclusion |
|---|---|
| DTO / nested owners | complete；全部引用 current Step 06 contracts/domain owner |
| source / subject / encoder | complete at Step 08 design level |
| subscriber boundary | product-neutral class fixed；locator/binding留 Step 14 |
| Step 06/07/09 | exact follower和ports可回指；唯一 flow reservation已建立 |
| local affected | `S08-F-E01-FLOW-CARDINALITY-01=open_internal_affected`：Step 09逐 producer branch固定0/1 cardinality |
| status | `defined_with_affected_open`；不是 unconditional/runtime complete |
| implementation/evidence | 未实现、未测试、未运行；无 commit/run_id/evidence/signoff |
