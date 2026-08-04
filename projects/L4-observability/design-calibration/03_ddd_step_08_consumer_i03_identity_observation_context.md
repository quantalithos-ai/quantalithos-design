# L4-observability 03-详细设计 Step 08 - S08-E Consumer I03 `ConsumeIdentityObservationContext`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 当前模式: full-restart / affected-only rebuild
> 当前批次: S08-E Consumer I03 §17（defined_with_affected_open；等待确认进入 I04）
> 回填目标: `03-详细设计.md` §7；正式文档只允许在 Step 19 重新装配

## 1. Step 开工确认与当前状态

| 项目 | 记录 |
|---|---|
| Step | Step 08 `定义 API / Command / Query / Event / Job 协议契约` |
| 协议族 / 编号 | Inbound Event Consumer / I03 of 9 |
| 逻辑协议 | `ConsumeIdentityObservationContext` |
| 输出文件 | `design-calibration/03_ddd_step_08_consumer_i03_identity_observation_context.md` |
| 已读取通用规范 | yes；通则、中间产物规范、真相源闭环标准、依赖裁剪规则 |
| 已读取文档类型规范 | yes；详细设计 SOP、详细设计书写规范 §5.6/§5.7 |
| 已读取前序输入 | yes；current `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、I02、Step 06/07 I03 owner、S08 shared carrier |
| 上游专项读取 | yes；L1-identity `00~08` current material及其 README/正式文档中的相关 owner 搜索 |
| 当前模式 | full-restart / affected-only rebuild |
| 模块骨架 | done；本文件只覆盖 I03，不覆盖 I04~I09、Event、Job 或 Step 09 |
| 思考记录 | done for this batch; unresolved owner gaps are recorded as affected/blocker |
| 写入记录 | 已写入 §1~§17；I03独立协议记录完成，affected保持开放 |
| 自检状态 | `defined_with_affected_open`；不是unconditional complete |
| gate status | `Step08_S08-E_I03_defined_with_affected_open_waiting_user_before_I04` |
| 正式 `03` | frozen；本批不回填 |
| 当前提交 | 不需要；用户未要求提交 |


本协议把 L1-identity 提供的 body-free subject observation context 转换为
Observability 自有的 reference snapshot observation input。它只承载 subject
安全引用、可选安全摘要引用和显式 freshness observation，不拥有 Identity
subject/profile、credential、membership、role、lifecycle、authentication 或
任何 Identity truth。

### 1.1 本批禁止事项

- 不读取或写入 I04~I09、S08-F/G、Step 09~19、正式 `03`、任何 `04` 文件或实现代码。
- 不把 Identity profile、姓名、联系信息、credential、token、role、membership、lifecycle body、provider response 或 raw event body 放入 input、digest、receipt、error、outbox 或持久化。
- 不把 `SubjectObservationReference`、Identity subject id、`source_ref`、`source_event_ref`、`source_version_ref`、`snapshot_ref`、`dedup_key`、`trace_ref` 或 `actor_ref` 合并为一个 identity。
- 不从 `subject_ref` 的字段、safe ref 前缀、tenant、actor、时间戳或字符串名称推导 Identity truth、source/version relation 或 freshness。
- 不把 Identity producer 当作 Identity truth 的授权证明；producer 只证明受信任的协作输入边界。
- 不在 Step 08 新建 `IdentityObservationContextPayload` 的第二个 canonical owner、Identity profile wrapper、`QuarantineRef`、generic Consumer disposition 或新的 transport action。
- 不把 `Duplicate` 变成 durable/public outcome；duplicate 只通过 `ObservationProtocolResultAccess::Replayed` overlay 表达。
- 不把 application result 变成 `Acknowledge` / `Retry` / `DeadLetter` carrier；C-05 action 由 worker exact mapper 选择。
- commit probe 仍为 indeterminate 时不默认选择 terminal action，不伪造实现 commit、run id、evidence alias、测试结果或验收签署。

## 2. 本批输入与权威关系

### 2.1 实际读取的输入

| 顺序 | 输入 | 本批消费内容 | 权威限制 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08 | 按协议族逐协议、envelope/payload、字段来源、DTO 构造、错误、幂等、receipt、停审 | 不使用旧的批量 `pass` 结论替代逐协议记录 |
| 2 | `详细设计书写规范.md` §5.6/§5.7 | public type、Rust-facing schema、字段映射、错误与幂等要求 | 不在本文件创建 Step 06/07 未拥有的 public type |
| 3 | `设计真相源闭环与可落码性标准.md` | body-free、actor authority、stored result、same-UoW、ref provenance、no-write | 缺 canonical owner 必须 affected/block，不由实现者猜测 |
| 4 | 当前 `02-概要设计.md` 与 HLD Consumer 骨架 | identity reference snapshot 边界、观察面 ownership、no-write 方向 | 概要只给边界和骨架，不替代 exact payload/port |
| 5 | Step 06 input assembly / contracts / boundary-read owner | I03 payload use-site、`SubjectObservationReference`、`SafeExternalSummaryRef`、reference state/freshness语义 | use-site 缺 canonical producer owner 时记录 affected，不创建 alias |
| 6 | Step 06 operation/context/idempotency、record/UoW、stored-result/outbox | 六个 Consumer control fields、digest profile、H10/reference snapshot 与 stored surface 关系 | 不把 source version、freshness 或 row version互相替代 |
| 7 | Step 07 assembler/service/resolver/UoW/worker carrier | exact callable、Identity resolver boundary、stored result、C-05 completion | shared carrier缺口保持 affected，不在此处补造 action |
| 8 | current Step 08 shared carrier与 I02 独立产物 | envelope、receipt、replay、redaction、indeterminate 和 handoff 粒度 | I02 只作结构参考，不复制 source-audit truth 或 relation名称 |
| 9 | L1-identity current docs and calibration material | Identity truth ownership、body-free subject reference、safe summary/freshness use-site诊断 | 未找到完整 I03 payload canonical declaration，登记上游内部 blocker |

### 2.2 权威优先级

```text
I03 current artifact and its affected register
  > Step 07 exact I03 assembler/service/resolver callable
  > Step 06 canonical reference/subject/result/UoW owner
  > Step 08 shared envelope/receipt/result carrier
  > current 02/HLD and L1-identity truth boundary
  > frozen formal 03, README and old protocol text
```

当前 Step 06 input row 提供了三个 I03 payload use-site，但 L1-identity 材料
没有给出可独立定位的 `IdentityObservationContextPayload` canonical declaration、
wire schema、schema/version registration 和 producer factory。此缺口不能由
Observability 通过复制 use-site 或创建同名 public DTO 解决，具体登记见 §15。

## 3. SOP 23 问回答

| # | 问题 | I03 当前回答 |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `ConsumeIdentityObservationContext`；不展开其他 Consumer |
| 2 | 协议族与模块 | S08-E Inbound Event Consumer；worker entry -> inbound assembler -> `ObservationInboundEventService` |
| 3 | 调用方、处理方 | 受认证的 L1-identity producer 是协作输入方；worker 调 matching assembler；application service 消费 concrete input |
| 4 | 传输方式 | typed asynchronous delivery/completion；topic、endpoint、credential和transport locator留给配置/entry binding，不写入本协议 |
| 5 | envelope | shared `ObservationInboundEventEnvelope<IdentityObservationContextPayload>`；header先校验，再解码 typed payload |
| 6 | application input | `ConsumeIdentityObservationContextInput`，含六个 Consumer control fields与三个 I03 payload fields |
| 7 | application result | `ObservationConsumerResult`；fresh/replayed stored reference snapshot receipt或允许的 ephemeral receipt，exact outbox/result source仍受 shared affected约束 |
| 8 | 目标对象 / 本地事实 | `ReferenceSnapshotState`、accepted H10 `ReferenceRefreshRecord`（如该 branch由唯一 owner授权）、stored Consumer result/receipt及同一 accepted UoW 的 outbox snapshot refs |
| 9 | 必填字段来源 | envelope header来自认证 producer binding；actor来自可信 worker delivery；三个 payload字段来自已验证的 body-free Identity context |
| 10 | 缺失行为 | header/schema/producer/version mismatch在payload解析或reservation前拒绝；subject/context owner缺失或freshness不可判定时拒绝或delayed，不用默认值 |
| 11 | response / receipt | shared outcome、result ref、changed/outbox/gap/dead-letter/error presence；不增加 `Duplicate` |
| 12 | duplicate / idempotency | logical `(operation, actor, dedup_key)` 加 secondary `(consumer, producer, source_event_ref)`；exact replay返回原stored surface，不重跑 snapshot transition |
| 13 | actor authority | effective actor只来自可信 C-03 worker delivery；Identity payload中的 subject/actor-like内容不授权本地 truth |
| 14 | redaction | 只允许 typed subject reference、可选 canonical safe summary、finite freshness state、source/version/event refs与result markers；不保存 Identity body |
| 15 | correlation | `trace_ref`、`source_event_ref`、`source_ref`、`source_version_ref`、subject snapshot ref、`dedup_key`和actor保持不同语义 |
| 16 | audit | I03只产生 Observability-owned H10 reference refresh history（仅 accepted snapshot mutation branch）；H10不表示 Identity truth改变或 resolver/provider成功 |
| 17 | UoW | accepted reference snapshot state、H10、stored result、receipt和required outbox snapshot必须有同一UoW证据；当前 save/order carrier部分affected |
| 18 | quarantine / dead-letter | local safety/terminal marker可表达有限结果；不创建 `QuarantineRef` alias，不把 worker dead-letter action当 Identity truth |
| 19 | C-05 action | application只返回 `ObservationConsumerResult`；worker mapper按 I03 flow/recovery classification选择 action |
| 20 | indeterminate | commit probe后仍 unknown/unsupported时，当前 C-05没有合法 no-completion carrier；fail closed并登记 affected |
| 21 | Step 06/07/09 | Step 06拥有 reference snapshot/H10/object carrier；Step 07拥有 exact assembler/service/resolver seam；Step 09唯一 handoff为 `ConsumeIdentityObservationContextFlow` |
| 22 | error | typed protocol、Identity producer/schema/version mismatch、subject/freshness relation、idempotency、domain、CAS、UoW和commit errors；不传播 Identity/provider error body |
| 23 | cross-protocol closure | I03只形成独立协议记录；其他 Consumer、Outbound Event、Job、Step 09和全协议审计仍未完成 |

## 4. Truth boundary and exact logical binding

### 4.1 Owned and non-owned truth

| boundary | I03 rule |
|---|---|
| producer | `ObservationProducerFamily::Identity` is an authenticated collaboration namespace, not proof of Identity truth correctness |
| incoming subject | `SubjectObservationReference` is a body-free observation reference with an Identity boundary marker; it is not an Identity subject aggregate or lifecycle owner |
| incoming summary | `Option<SafeExternalSummaryRef>` is an optional pointer to an already redacted safe projection; it is not summary body or permission to fetch one |
| incoming freshness | `ReferenceFreshnessState` is the producer's typed observation of reference freshness; it is not a source-version comparator, timestamp, local row version or business lifecycle state |
| local owned facts | Observability `ReferenceSnapshotState`, accepted H10 reference history where explicitly authorized, local stored result/receipt, optional gap/visibility marker and committed outbox snapshot refs |
| non-owned facts | Identity profile/body, subject lifecycle, credential, membership, role/capability truth, authentication decision, source-provider response, external acceptance and transport state |
| write direction | Identity producer -> Observability reference observation; no callback or write path back to Identity truth |
| completion direction | local result -> worker C-05 mapper -> transport registrar; transport failure never rewrites a committed local snapshot |

I03 may record that an observation-side reference snapshot was accepted, stale,
unresolved, invalid or unavailable according to a canonical finite mapping. It
must never describe that mapping as a change to Identity itself. A local
`Accepted` outcome means only that the Observability-side reference observation
UoW committed.

### 4.2 Finite binding

| item | exact value |
|---|---|
| consumer name | `ObservationInboundConsumerName::ConsumeIdentityObservationContext` |
| operation | `ObservationInboundConsumerOperation::ConsumeIdentityObservationContext` |
| discriminator | `0x0303`；按 current inbound operation table递增绑定 |
| required producer | `ObservationProducerFamily::Identity` |
| payload type | `IdentityObservationContextPayload`；canonical upstream declaration currently missing |
| application assembler | `ObservationInboundInputAssembler::consume_identity_observation_context` |
| application façade | `ObservationInboundEventService::consume_identity_observation_context` |
| reference owner | `ReferenceSnapshotState` / H10 reference-refresh owner；具体 I03 branch resolver与write port须保持唯一 |
| flow reservation | `ConsumeIdentityObservationContextFlow` |
| transport locator | not defined here；由 entry/config binding 提供 |

The producer binding is finite and static. A wrong consumer, unsupported schema,
unknown Identity source family or mismatched source-version relation cannot fall
through to another Consumer. `ObservationProducerFamily::Identity` and any
payload `source_family`/subject kind remain distinct typed values; I03 does not
introduce a producer-to-payload string cast.

## 5. Exact call chain and callable signatures

### 5.1 Worker-to-application chain

```text
authenticated Identity delivery
  -> select static I03 slot
  -> validate envelope header and producer/source/version relation
  -> decode IdentityObservationContextPayload
  -> ObservationInboundInputAssembler::consume_identity_observation_context
  -> ObservationInboundEventService::consume_identity_observation_context
  -> reserve logical + source-event identities
  -> validate subject/snapshot/freshness relation and reference write eligibility
  -> apply/register local ReferenceSnapshotState transition through canonical owner
  -> stage H10, stored result/receipt and immutable outbox snapshot when required
  -> commit one accepted local UoW
  -> worker exact C-05 action mapper
  -> private transport registrar
```

The worker does not call Identity repositories, create an Identity object,
resolve profile body, mutate source truth, or select a transport action directly.
The assembler is synchronous and I/O-free; the service consumes the complete
concrete input by value.

### 5.2 Exact signatures

```rust
pub trait ObservationInboundInputAssembler: Send + Sync {
    /// Assemble one validated, body-free Identity observation delivery.
    fn consume_identity_observation_context(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<IdentityObservationContextPayload>,
    ) -> Result<ConsumeIdentityObservationContextInput, ApplicationError>;
}

pub trait ObservationInboundEventService: Send + Sync {
    /// Consume one validated Identity observation input and return a local receipt/result.
    fn consume_identity_observation_context<'a>(
        &'a self,
        input: ConsumeIdentityObservationContextInput,
    ) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
}
```

The matching assembler privately invokes the digest canonicalizer and
`ObservationOperationContextFactory::for_inbound_event`. Neither helper is an
entry capability. No public method accepts raw bytes, a generic Consumer enum,
a public envelope wrapper without a matching payload, a caller-selected
transport action or an Identity repository handle.

## 6. Shared envelope and I03 typed payload

### 6.1 Header authority and validation order

The shared envelope fields are:

```text
consumer_name
source_event_ref
source_ref
source_version_ref
producer_family
schema_version
dedup_key
occurred_at
trace_ref
payload
```

Header validation is ordered and side-effect free:

1. Select the authenticated static I03 slot.
2. Validate `source_event_ref`, `source_ref`, optional `source_version_ref`, `producer_family`, `schema_version`, `dedup_key`, `occurred_at` and optional `trace_ref`.
3. Require the exact consumer name and `producer_family == Identity`.
4. Check the finite Identity producer/schema registration.
5. If `source_version_ref` is present, require its producer and source to equal the envelope exactly; do not order it locally.
6. Decode only `IdentityObservationContextPayload`; never try a different payload decoder.
7. Pass the trusted `actor_ref` separately from the envelope.

Malformed or missing source-event identity cannot establish a secondary event
identity. It may produce only the shared ephemeral `Rejected` surface with
`source_event_ref=None`. Unsupported schema after a valid source event produces
`UnsupportedSchema`, with no typed payload interpretation and no reservation.

### 6.2 Payload DTO boundary

The following is the I03 protocol use-site, not a new canonical upstream type:

```rust
/// Body-free Identity context consumed by the Observability boundary.
pub struct IdentityObservationContextPayload {
    /// Identity-safe subject observation reference; no profile or lifecycle body.
    pub subject_ref: SubjectObservationReference,

    /// Optional already-redacted safe summary reference.
    pub safe_summary_ref: Option<SafeExternalSummaryRef>,

    /// Producer-owned typed observation of reference freshness.
    pub freshness: ReferenceFreshnessState,
}
```

The canonical declaration, wire schema, factory, schema-version registration and
producer-side encoder for this payload are not present in current L1-identity
materials. Until an owner publishes them, this shape is a design use-site only;
I03 must not create a second public declaration or claim that the wire contract
is closed.

| payload field | authoritative source/use-site | validation target | absent/forbidden substitution |
|---|---|---|---|
| `subject_ref` | Step 06 `SubjectObservationReference`; authenticated Identity context producer | typed body-free reference, stable observation id, Identity boundary marker, safe-ref and snapshot/state consistency | no Identity profile, subject string, tenant, actor, ref-prefix inference or new local subject truth |
| `safe_summary_ref` | canonical `SafeExternalSummaryRef` use-site from trusted redacted summary projection | optionality and relation to the exact subject/snapshot/source must be explicitly validated | no raw summary, empty synthetic ref, `SafeSignalSummaryRef`, Identity body or current lookup fallback |
| `freshness` | Step 06 I03 use-site `ReferenceFreshnessState`; producer-owned observation state | finite state and allowed subject/summary combinations must be defined by its owner | no `occurred_at`, source version, row version, cursor, bool or default `Fresh` substitution |

The payload deliberately has no actor, credential, route, topic, partition,
offset, profile, role, membership, lifecycle event, provider response,
authentication decision, raw label or external acceptance field. Any such
material is rejected or isolated before it can enter the application input.

### 6.3 I03 upstream declaration diagnosis

| expected owner surface | current observation | status |
|---|---|---|
| L1-identity canonical `IdentityObservationContextPayload` declaration | no complete declaration found in current L1-identity `00~08`, README or calibration material | `open_upstream_internal` |
| producer/schema/discriminator registration | Observability Step 06/08 use-site fixes `Identity` and `0x0303`, but no upstream encoder/catalog row is available | `open_upstream_internal` |
| subject reference source and source/version relation | `SubjectObservationReference` contract exists as a body-free local carrier, but its Identity producer membership and same-stream relation are not propagated to I03 | `open_internal_affected` plus upstream dependency |
| safe summary source | canonical type exists, but I03-specific producer-to-summary relation and missing/unavailable semantics are not propagated | `open_internal_affected` |
| freshness state source | I03 use-site exists, but finite variants, source, lifecycle and mapping are not independently declared | `open_upstream_internal` |

Until the upstream declaration is available, a structurally valid-looking
payload cannot be accepted merely because its three field names match the Step
06 row. The assembler must fail closed at the missing schema/owner boundary.

## 7. Concrete input and field provenance

### 7.1 Input shape

`ConsumeIdentityObservationContextInput` 是 application 内部的 process-local
move carrier。它由唯一匹配的 inbound assembler 一次性构造，再由唯一的
`ObservationInboundEventService::consume_identity_observation_context` 按值消费。
它不是 wire DTO、持久化 row、replay payload、transport completion 或 Identity
对象。

```rust
/// Fully validated, body-free application input for I03.
pub struct ConsumeIdentityObservationContextInput {
    // The six shared Consumer control fields.
    context: ObservationOperationContext,
    request_digest_candidates: RequestDigestCandidates,
    source_ref: ObservationSourceRef,
    source_version_ref: Option<ObservationSourceVersionRef>,
    schema_version: SchemaVersion,
    occurred_at: ObservedAt,

    // I03-specific typed payload fields.
    subject_ref: SubjectObservationReference,
    safe_summary_ref: Option<SafeExternalSummaryRef>,
    freshness: ReferenceFreshnessState,
}
```

The design-level private constructor is:

```rust
pub(crate) fn try_new(
    context: ObservationOperationContext,
    request_digest_candidates: RequestDigestCandidates,
    source_ref: ObservationSourceRef,
    source_version_ref: Option<ObservationSourceVersionRef>,
    schema_version: SchemaVersion,
    occurred_at: ObservedAt,
    subject_ref: SubjectObservationReference,
    safe_summary_ref: Option<SafeExternalSummaryRef>,
    freshness: ReferenceFreshnessState,
) -> Result<Self, ApplicationError>;
```

The constructor rechecks the cross-field relations that can be checked without
I/O:

1. `context.operation_name()` is exactly the I03 Consumer operation.
2. `context.inbound_event_identity()` is `Some` and its consumer and producer
   are exactly I03 / `Identity`.
3. `context.request_digest()` equals
   `request_digest_candidates.write_digest()`; the constructor never selects a
   different profile or recalculates a digest.
4. `source_version_ref`, when present, is bound to the exact `Identity` producer
   and the exact `source_ref` in the envelope.
5. The payload fields are already validated typed values. The constructor does
   not accept raw bytes, a generic payload enum, a source string, a caller
   supplied local snapshot state, or an actor-like payload field.

`source_event_ref`, `producer_family`, `dedup_key`, `actor_ref` and envelope
`trace_ref` are deliberately not repeated as independent input fields. They are
losslessly retained in the validated envelope/context path: the event reference
and producer are in `ObservationInboundEventIdentity`, the dedup key is in the
Consumer operation scope, and actor/trace are in `ObservationOperationContext`.
Repeating them here would create a second source of truth rather than increase
the information available to the service.

The input exposes only read-only accessors required by the I03 flow. It has no
setter, `Default`, raw serializer, public struct-literal construction, generic
payload accessor or conversion into an Identity repository request. A missing
field cannot be filled after construction from current local state.

### 7.2 Field-source register

| input field | authoritative source | construction and validation | forbidden substitution | status |
|---|---|---|---|---|
| `context` | `ObservationOperationContextFactory::for_inbound_event` through the matching assembler | operation, trusted actor, dedup key, write digest, event identity and optional trace are formed together | route string, payload actor, transport peer, post-construction setter | target closed at Step 06 owner |
| `request_digest_candidates` | `ObservationDigestCanonicalizer::request_candidates` over the validated I03 material | generated exactly once after header/schema/payload/owner checks; all readable profiles are retained only for atomic admission | raw envelope hash, broker bytes, endpoint hash, current-profile-only shortcut | propagation affected |
| `source_ref` | validated common envelope header | typed source reference is checked before payload interpretation | `subject_ref`, snapshot ref, topic, partition, payload token or body | target closed at envelope level |
| `source_version_ref` | optional common envelope header | present value must repeat `producer_family == Identity` and `source_ref` exactly; token stays opaque | `freshness`, `occurred_at`, schema version, cursor, row version or timestamp | comparator/owner affected |
| `schema_version` | static I03 envelope slot and supported schema registration | supported version is checked before typed payload admission and copied losslessly | payload default, current config fallback, producer display text | upstream registration open |
| `occurred_at` | validated producer event metadata | retained as source observation time; it is not a local state transition time or version order | local clock, delivery time, commit time, cursor or retry time | target closed at header level |
| `subject_ref` | canonical `SubjectObservationReference` use-site supplied by the authenticated Identity context producer | validate every structured member, body-free boundary marker, subject kind/safe-ref relation, snapshot ref shape and state/visibility combination | Identity subject id cast, tenant, actor, profile lookup, safe-ref prefix inference or new local subject truth | producer owner open; local relation affected |
| `safe_summary_ref` | optional canonical `SafeExternalSummaryRef` from an already redacted safe projection | `None` remains explicit absence; `Some` must be related to the exact subject/snapshot/source by its owner before mutation | empty synthetic ref, `SafeSignalSummaryRef`, raw summary, current lookup fallback or `None` on relation error | relation affected |
| `freshness` | producer-owned `ReferenceFreshnessState` use-site | finite state and subject/summary compatibility must be validated by its canonical owner; no local inference | `source_version_ref`, `occurred_at`, cursor, row version, boolean or default `Fresh` | upstream owner open |
| `producer_family` | total static operation-to-producer table | I03 requires `ObservationProducerFamily::Identity`; it is not copied from a payload `source_family` field | string comparison, payload override, config remap or derived source family | target closed at static map; registration affected |
| `source_event_ref` | validated envelope header | constructed into the Consumer secondary identity only after exact I03 binding is proven | dedup key, message id, offset, payload id or digest | shared source-event owner affected |
| `dedup_key` | validated envelope delivery metadata | enters logical reservation scope and remains outside digest material | source event, trace, source version, attempt number or timestamp | target closed at operation owner |
| `actor_ref` | trusted C-03 worker delivery projection | supplied separately from the envelope and payload; it is the effective local actor | Identity subject, producer family, process/pod, credential or transport peer | target closed at entry boundary |
| `trace_ref` | optional validated envelope metadata | copied only as correlation metadata; absence is explicit | source event, causation, dedup key, digest or business relation | target closed at context boundary |

`ObservationProducerFamily::Identity` is a producer authority namespace for this
delivery slot. It is not an assertion that the incoming Identity observation is
correct, current, authorized, authenticated in the Identity domain, or accepted
by any downstream system. A valid producer binding is necessary for admission,
but it is never sufficient to create Identity truth.

### 7.3 Exact assembly order

The assembler is synchronous and free of repository, resolver, clock, ID
generator, UoW, publisher, configuration reload and external-effect calls. The
following order is mandatory; a failure at any stage returns no partial input,
no digest candidate and no reservation.

| stage | exact operation | failure / side-effect rule |
|---:|---|---|
| 1 | select the static I03 entry slot and assert the expected Consumer operation and payload type | wrong route, wrong generic payload or consumer/body mismatch returns protocol rejection; no fallback decoder |
| 2 | receive the trusted C-03 `ActorSafeRef` from the worker boundary | missing or untrusted actor stops before input construction; payload actor-like fields are ignored or rejected |
| 3 | validate `consumer_name`, `source_event_ref`, `source_ref`, optional `source_version_ref`, `producer_family`, `schema_version`, `dedup_key`, `occurred_at` and optional `trace_ref` | malformed header is rejected before payload materialization; no secondary event identity is minted |
| 4 | require `producer_family == Identity` and check the finite producer/schema/discriminator registration | unregistered producer/schema is rejected or marked unsupported before payload interpretation; configuration cannot redirect to another Consumer |
| 5 | check source-version producer/source equality with the common header | mismatch is a typed consistency rejection; no local ordering and no reservation |
| 6 | verify that the upstream canonical `IdentityObservationContextPayload` declaration, decoder and encoder registration exist | a field-name-compatible but ownerless payload is not admitted; current missing owner remains fail-closed |
| 7 | decode only the exact I03 payload and reject unknown fields, duplicate fields, raw body members and forbidden actor/credential/lifecycle material | no partial DTO, raw-body hash, debug serialization or generic payload conversion is allowed |
| 8 | validate `SubjectObservationReference` internal invariants and its relation to the I03 Identity boundary | malformed marker, state/visibility mismatch or unsupported subject kind stops before digest; no subject id or snapshot ref is synthesized |
| 9 | validate the optional safe-summary relation and the finite freshness value using their canonical owners | absent, unavailable, mismatched and malformed values remain distinct; no empty/default summary or inferred freshness |
| 10 | construct the canonical `inbound_consumer_request` material with the exact I03 field order | material is process-local; it is never logged, persisted, sent to a provider or built from raw envelope bytes |
| 11 | generate `RequestDigestCandidates` once | canonicalization failure means no reservation or UoW; a supplied/transport digest, if introduced by a future binding, is only compared and then discarded |
| 12 | construct `ObservationInboundEventIdentity` and `ObservationOperationContext` together | operation, producer and source event must agree; no alias reservation or later event-identity attachment |
| 13 | call `ConsumeIdentityObservationContextInput::try_new` atomically | constructor rechecks operation, event, producer, source/version and digest relations; only a complete move carrier reaches the service |

The current upstream declaration gap is a stage-6 failure, not a stage-9
validation result. This distinction matters: a decoder cannot claim that it
understood an unregistered payload and then classify its fields as stale or
unresolved. Until the upstream owner publishes the canonical declaration, I03
has no eligible accepted input even if a local test fixture happens to contain
three values with the expected names.

### 7.4 Service-side reference and relation gates

The assembler only validates typed, non-I/O relations. The following gates
belong to the I03 application service/flow and must occur after admission but
before any `ReferenceSnapshotState` mutation. They are listed here because they
close the DTO-to-local-fact path; they do not authorize the assembler to call a
repository or resolver.

| gate | required read / proof | accepted input to the next gate | missing, ambiguous or mismatched behavior |
|---|---|---|---|
| local snapshot identity | load the exact `ReferenceSnapshotStateRef` carried by `subject_ref.snapshot_state_ref` with its repository version | one committed snapshot row with a valid version | missing row is a typed dependency/relation result; duplicate or malformed rows are consistency failure; do not mint a replacement merely to continue |
| subject binding | obtain the canonical body-free `ReferenceSubjectRef` binding for the loaded snapshot and compare the complete subject kind/safe-ref/identity-boundary tuple | the loaded snapshot and incoming `SubjectObservationReference` name the same observation subject | no `SubjectObservationReference -> ReferenceSubjectRef` cast, ref-prefix inference or current-truth lookup fallback; the missing exact binding remains `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` |
| snapshot relation | prove that `snapshot_state_ref`, `subject_observation_reference_id`, local subject binding and incoming state/visibility relation are compatible | one exact local snapshot relation, not merely equal inner strings | cross-snapshot, cross-subject, terminal-invalid reopen or visibility-constraint mismatch is a typed relation rejection; no direct field overwrite |
| optional safe summary | validate `safe_summary_ref` against the same subject, snapshot and Identity source relation; preserve explicit absence | a canonical safe projection reference or an owner-approved absent branch | malformed/mismatched summary is rejected; unavailable backing projection is delayed or explicitly degraded; neither becomes empty success |
| producer freshness | map the typed producer observation through the canonical freshness/policy owner without treating it as an authorization decision | an owner-approved local refresh decision or explicit no-mutation classification | missing finite mapping, incompatible state, or unavailable comparator fails closed; the service cannot select `Resolved`, `Fresh` or `Accepted` by name |
| source-version relation | if `source_version_ref` is present, use a typed same-stream comparator for `(Identity, source_ref)` | proven same-stream relation and an allowed older/equal/newer branch | absent comparator, different stream, or incomparable token is a typed dependency/consistency branch; never order by time, cursor or row version |
| accepted transition | consume the canonical H10 accepted-input branch and its P15/P17/target proof, when this inbound branch is authorized to mutate a snapshot | a `ReferenceSnapshotTransition` or typed new-snapshot creation proof | no direct `refresh`, `mark_stale` or state assignment from the payload; missing inbound H10 mapper remains open |

The `snapshot_state_ref` inside `SubjectObservationReference` is a local
Observability reference. It is not an Identity subject id, not a producer
version, and not proof that the row is current. Conversely, a loaded local
snapshot row does not prove that Identity truth exists, is visible, is fresh, or
was changed. Both directions require the complete typed relation above.

### 7.5 DTO-to-domain and durable-surface closure

| source input / proof | target local object or record | fields that must be losslessly available | owner and mapping rule | current closure |
|---|---|---|---|---|
| validated I03 payload + exact subject/snapshot binding | `ReferenceSnapshotState` load / candidate post-state | local snapshot ref, canonical `ReferenceSubjectRef`, current state, safe summary, source version, reasons, observed time and repository version | `ReferenceMaintenanceRepository` plus `ReferenceSnapshotState` owner; load before mutation, expected version comes only from the load | read/stage seam exists; I03 subject binding affected |
| `subject_ref` + `safe_summary_ref` + `freshness` + source-version relation | canonical inbound refresh decision/result input | complete subject, exact source stream/version relation, safe summary presence, freshness classification, target/policy basis and no-write classification | Step 06 freshness/policy owner must publish an I03-compatible mapper; no `From<IdentityObservationContextPayload>` shortcut | `S08-E-I03-H10-INBOUND-MAPPER-01` open |
| accepted in-place snapshot transition | `ReferenceSnapshotTransition` and H10 `ReferenceRefreshRecord` | same snapshot ref, subject, before/after states, before/after safe summary/version/reasons, observed times, P15 and P17 bases, one committed cursor | domain H10 owner consumes the accepted transition and same-UoW post-state; I03 does not define a second record | target defined; inbound propagation affected |
| accepted required-new-snapshot branch | new `ReferenceSnapshotState` plus typed creation proof and H10 creation record | old Invalid snapshot ref, new snapshot ref, same subject, complete new state, both policy bases and cursor | only the canonical `RequireNewSnapshot` branch may mint a new local snapshot identity; old row remains immutable | target defined; branch owner affected |
| accepted snapshot mutation or explicit local no-change branch | `StoredObservationResult` and `ObservationConsumerResult` | exact inner disposition/outcome, result ref, changed snapshot/H10 refs, gap refs, outbox refs, safe error presence and replay surface | stored-result owner retains the accepted UoW surface; mapper cannot read current rows to fill omissions | shared result surface affected |
| accepted local snapshot change with a registered outbound contract | immutable `ReferenceSnapshotChanged` payload/outbox snapshot, if and only if the outbound owner authorizes it | event ref/name, subject/snapshot ref, state/freshness markers, schema, exact serialized payload, digest, committed cursor and trace metadata | outbox owner builds from the accepted staged transition; publisher never rebuilds from current state | `S08-CONSUMER-OUTBOX-SURFACE-01` plus I03 propagation affected |

An I03 local `Accepted` result means that the Observability-side reference
observation UoW was accepted. It does not mean that an Identity profile was
updated, an authentication decision succeeded, a membership changed, a source
provider accepted a request, or an outbound consumer received anything.

The initial `Pending` registration semantics from `RegisterReferenceSnapshot`
must not be silently reused here. I03 receives an observation context and may
only create or mutate a snapshot through the exact inbound branch authorized by
the H10 owner. If that branch is not published, the correct result is affected
or fail-closed, not a locally invented `Pending -> Resolved` transition.

### 7.6 Input-to-boundary decision matrix

| observed condition before service mutation | I03 classification target | reservation / UoW | forbidden shortcut |
|---|---|---|---|
| malformed source event/header or untrusted actor | ephemeral `Rejected` | none | create secondary identity from message id or payload hash |
| valid source event but unsupported schema/ownerless upstream payload | `UnsupportedSchema` or typed protocol rejection | none | decode compatible-looking fields and continue |
| producer is not `Identity` or source-version producer/source mismatches | typed binding/consistency rejection | none | route to another Consumer or accept payload source family |
| subject reference malformed or boundary marker invalid | typed input rejection | none | retain subject string, profile, or synthetic marker |
| local snapshot missing/ambiguous or subject relation unproven | typed dependency/consistency result | no accepted snapshot mutation | create a new snapshot ref to hide lookup ambiguity |
| safe summary absent | explicit absent branch only if canonical policy allows it | no default mutation; later branch owner decides | use empty summary or fetch body synchronously |
| safe summary present but unavailable or mismatched | delayed/degraded/rejected according to canonical owner | no accepted resolved transition | map unavailable to fresh/resolved |
| freshness finite mapping absent or incompatible | typed dependency/consistency rejection | no mutation | use timestamp, source version, cursor or `Fresh` default |
| exact completed reservation and matching digest/event identity | original stored surface with `Replayed` access | no new UoW mutation | rerun resolver, snapshot transition or outbox creation |
| reservation in flight with matching identity | ephemeral `Delayed` | no second writer | recursive handler loop or alias reservation |

This matrix is a design boundary, not a runtime result report. No branch below
the service-side relation gate is claimed to have executed.

## 8. Canonical digest, event identity and correlation

### 8.1 I03 canonical inbound material

I03 uses the shared `inbound_consumer_request` material kind and a dedicated
operation-specific payload profile. The canonical material is formed only from
the validated typed envelope, the exact upstream payload declaration and the
body-free relation checks in §7. It never hashes the broker frame, raw event
body, provider response, debug output or transport metadata.

The following is the exact member order at the design boundary. It is a display
of the registered canonical frame, not permission to use a generic JSON or Rust
serializer:

```text
{"operation":"consume_identity_observation_context",
 "actor_ref":<ActorSafeRef>,
 "producer_family":"identity",
 "source_event_ref":<SourceEventRef>,
 "source_ref":<ObservationSourceRef>,
 "source_version_ref":<Option<ObservationSourceVersionRef>>,
 "schema_version":<SchemaVersion>,
 "payload":{
   "subject_ref":{
     "subject_observation_reference_id":<SubjectObservationReferenceId>,
     "subject_kind":<ObservationSubjectKind>,
     "subject_safe_ref":<SubjectSafeRef>,
     "identity_boundary_marker":<IdentityBoundaryMarker>,
     "snapshot_state_ref":<ReferenceSnapshotStateRef>,
     "state":<SubjectReferenceState>,
     "visibility_constraint_ref":<Option<VisibilityConstraintRef>>
   },
   "safe_summary_ref":<Option<SafeExternalSummaryRef>>,
   "freshness":<ReferenceFreshnessState>
 }
}
```

`subject_ref` is encoded as the complete named `SubjectObservationReference`
owner shape and in that owner's fixed field order. It is not reduced to
`subject_observation_reference_id`, `subject_safe_ref` or `snapshot_state_ref`.
The nested `Option` values use the common explicit absent/present grammar. The
`freshness` value must use the canonical finite encoder published by its owner;
its display name, `Debug` text, timestamp or boolean representation is not a
valid substitute.

The upstream payload declaration, freshness encoder and producer schema catalog
are currently missing. Therefore the frame above is a target material contract
for review, not a claim that a current digest candidate can be generated. The
affected boundary is `S08-E-I03-PAYLOAD-SCHEMA-01` and
`S08-E-I03-FRESHNESS-OWNER-01`; until they close, the assembler must fail closed
before `request_candidates`.

### 8.2 Included members and canonical encoding rules

| ordinal | material member | inclusion | exact reason / encoding rule |
|---:|---|:---:|---|
| 1 | operation token | yes | stable `consume_identity_observation_context` token from the finite operation map; never a route, handler name, Rust ordinal or display string |
| 2 | effective `actor_ref` | yes | binds the operation to the trusted local principal; use the typed `ActorSafeRef` wrapper and its owner encoder |
| 3 | `producer_family` | yes | preserves the authenticated `Identity` producer namespace; no payload/config override |
| 4 | `source_event_ref` | yes | binds the exact delivered event; encode the typed wrapper, not a message id, offset or inner bare string |
| 5 | `source_ref` | yes | binds the producer source stream/object boundary; retain the complete typed reference |
| 6 | `source_version_ref` | yes, explicit absent/present | preserves producer/version identity without ordering it locally; nested producer and source must remain lossless |
| 7 | `schema_version` | yes | prevents equivalent-looking payloads across incompatible schema registrations |
| 8 | complete `subject_ref` | yes | binds subject observation id, kind, safe ref, boundary marker, local snapshot ref, state and visibility constraint together; use the Step 06 named-object grammar |
| 9 | `safe_summary_ref` | yes, explicit absent/present | absence is different from a present safe projection; do not collapse `None` to an empty ref or omit the option tag |
| 10 | `freshness` | yes | binds the producer's typed freshness observation; encode the complete owner-defined variant and payload, never a derived local state or time |

I03 does not add an implicit `source_family` member. The operation-to-producer
map already proves `Identity`; a derived `SourceFamilyKind::Identity` is a
separate vocabulary value and cannot be silently cast into the producer field or
duplicated as an unowned payload field. If the upstream payload later declares a
source-family field, it requires a new compatibility row and an explicit digest
profile review.

The canonicalizer must apply the Step 06 framing, type discriminators, fixed
member order, explicit `Option` tags, bounded writer and lowercase digest rules.
It must calculate all readable `RequestDigestCandidates` once and pass the
owned collection to the reservation repository. The operation context and a new
reservation retain only the current write-profile candidate; an existing row is
compared with the candidate for its retained profile.

### 8.3 Excluded material and digest redlines

| excluded value | why it is excluded | independent authority |
|---|---|---|
| envelope `dedup_key` | logical idempotency scope, not semantic request material | `ObservationIdempotencyScope` |
| envelope `occurred_at` | producer event time is not version order or local mutation time | source metadata / record metadata |
| envelope `trace_ref` | delivery correlation metadata is not admission identity | `ObservationOperationContext` |
| delivery id, topic, partition, offset, attempt and acknowledgement state | transport facts are not observation truth | entry/transport layer |
| any supplied or transport-provided digest | self-inclusion would make verification circular | local canonicalizer verifies then discards it |
| generated snapshot, H10, result, outbox, gap and dead-letter refs | local effects must not change input replay identity | owning UoW/result/outbox owners |
| repository row versions, committed cursors and UoW identity | coordination/CAS metadata is not producer semantic input | repository/UoW owner |
| Identity profile, PII, credential, role, membership, lifecycle, auth result and raw event body | forbidden truth/body crossing | Identity owner / redaction boundary |
| safe-summary body, provider response, resolver diagnostics and raw labels | a safe ref is not permission to retain its body | safe-summary/resolver owner |
| local current snapshot state or current lookup result | digest must be reproducible from the admitted input, not current truth | snapshot repository / replay owner |

An error or quarantine path cannot hash forbidden material in order to obtain a
digest. If header/schema/payload validation fails before canonical material is
formed, the result is an ephemeral protocol surface and no reservation is
created. A valid source-event reference may be retained in the shared ephemeral
surface only where that carrier explicitly permits it.

### 8.4 Logical, delivery, subject and snapshot identities

I03 keeps the following identities as separate typed relations:

```text
logical reservation scope:
  (ConsumeIdentityObservationContext,
   effective ActorSafeRef,
   dedup_key)

secondary delivery identity:
  (ConsumeIdentityObservationContext,
   ObservationProducerFamily::Identity,
   source_event_ref)

source stream identity:
  (ObservationProducerFamily::Identity, source_ref)

subject observation identity:
  subject_ref.subject_observation_reference_id

local snapshot identity:
  subject_ref.snapshot_state_ref

safe projection identity:
  safe_summary_ref, when present
```

The first two relations are established in one atomic reservation operation and
must point to the same reservation row. The source stream, subject observation,
local snapshot and optional safe projection are semantic/reference relations
used by the I03 service; none is an alias for the event identity.

| incoming relation | required behavior |
|---|---|
| same logical scope, same digest, same I03 producer/event identity, completed result | return the exact stored result/receipt with `ObservationProtocolResultAccess::Replayed`; do not rerun snapshot transition or resolver work |
| same logical scope, same digest, same event identity, reservation still `Reserved` | return an ephemeral in-flight `Delayed`; do not start a second writer |
| same logical scope with a different digest | typed idempotency conflict; return no winner material and perform no mutation |
| same source event with a changed producer, consumer or source binding | secondary identity conflict; do not create an alias reservation |
| same dedup key with a different source event | logical/secondary mismatch; fail closed rather than choosing one identity |
| same subject observation id with a different kind, safe ref or boundary marker | subject-reference consistency failure; do not rehydrate from the id alone |
| same local snapshot ref with a different canonical subject binding | snapshot relation failure; do not overwrite the loaded row or mint a replacement to hide the mismatch |
| same source stream/version with a different payload digest | typed source/version conflict; no winner is selected by timestamp or arrival order |
| same semantic snapshot with a different event identity | require the canonical source/version/equivalence proof; semantic similarity alone is not replay |
| no local snapshot row for the supplied snapshot ref | dependency/relation result; first registration is allowed only through the canonical owner and an explicitly authorized branch |

`Duplicate` is not introduced as a new durable or public outcome by I03.
Duplicate access is only the existing `Replayed` overlay over the original
stored surface. It does not create a fresh result ref, H10 record, outbox
snapshot, gap, cursor or local state transition.

### 8.5 Source-version and freshness separation

The three values below have different authorities and cannot be substituted:

| value | source | meaning | cannot establish |
|---|---|---|---|
| `source_version_ref` | common Identity envelope header | opaque producer assertion for one `(Identity, source_ref)` stream | freshness, local row version, arrival order or Identity lifecycle |
| `freshness` | I03 typed payload | producer-owned finite observation of reference freshness/resolution | source-version ordering, local authorization, resolver success or business truth |
| `ReferenceSnapshotStateKind` | committed Observability snapshot row | local observation-side state after an owner-approved transition | Identity profile state, external lifecycle or producer correctness |
| `occurred_at` | common envelope metadata | source event observation time | version ordering, freshness state or CAS expected version |
| repository version / commit cursor | local persistence/UoW | local concurrency and commit ordering | source version or semantic freshness |

#### Source-version compatibility matrix

| condition | I03 behavior | local mutation |
|---|---|---|
| version present and producer/source differ from the envelope | typed header consistency rejection | none |
| version absent | preserve explicit `None`; continue only if the canonical I03 flow has an allowed no-version policy | no synthesized version or ordering marker |
| same Identity source stream, exact same version, same digest and same event identity | replay the original stored surface | none |
| same stream, exact same version, different digest or subject/summary/freshness relation | typed conflict/consistency result | none |
| canonical comparator proves older | do not regress the local snapshot; use only an owner-approved no-op/degraded/delayed branch | no overwrite of newer local state |
| canonical comparator proves equal but local fact is not represented | require an explicit owner result; never infer equivalence from equal tokens | no mutation until proof exists |
| canonical comparator proves newer | continue to the normal subject/policy/UoW gates | eligible only after all other gates pass |
| different source stream, incomparable token, missing comparator or unavailable comparator | fail closed with typed dependency/consistency classification | no version-ordered mutation |

I03 must never compare `source_version_ref` lexically or numerically, derive an
order from `occurred_at`, use a cursor or row version as a source version, or
assume that a newer delivery is accepted merely because it arrived later. The
current typed same-stream comparator and its finite mapping are not fully
propagated to the I03 owner and remain `S08-E-I03-SOURCE-VERSION-COMPARATOR-01`.

#### Freshness compatibility matrix

The following rows describe semantic classes, not new enum variants. Exact wire
tokens and payloads must be supplied by the `ReferenceFreshnessState` owner.

| producer freshness class | allowed local interpretation | required additional proof | forbidden interpretation |
|---|---|---|---|
| fresh/usable observation | may enter an owner-approved resolved branch | exact subject/snapshot relation, usable safe-summary/version rules and P15/P17 or equivalent inbound policy proof | set local `Resolved`/`Fresh` directly from the label |
| stale observation | preserve an explicit stale/degraded classification where the owner authorizes it | same subject/snapshot relation and typed stale reason/retained summary rules | promote to fresh because a summary ref is present or because event time is recent |
| unresolved observation | preserve unresolved semantics or a bounded delayed branch | typed reason and exact subject relation | convert to missing, invalid or empty resolved summary |
| unavailable observation | preserve dependency/adapter unavailability | typed availability/recovery relation | fabricate a safe summary, retry forever or mark resolved |
| invalid observation | reject or apply only the canonical invalid-snapshot branch | typed invalid reason and terminal/new-identity policy | reopen an Invalid row in place or write Identity truth |
| missing/unknown freshness token | protocol/owner rejection | canonical finite decoder and compatibility registration | default to fresh, use source version, use timestamp or use local row state |

`safe_summary_ref == Some` does not prove freshness, and
`safe_summary_ref == None` does not by itself prove unresolved or unavailable.
The owner must define the allowed combinations. I03 preserves the distinctions
until that mapping is available; it does not collapse them for convenience.

### 8.6 Correlation separation

| value | authority | retained use in I03 | cannot replace |
|---|---|---|---|
| `ActorSafeRef` | trusted C-03 worker delivery | effective local actor/principal and logical scope | Identity subject, producer family, dedup key or source event |
| envelope `trace_ref` | validated delivery metadata | optional cross-system correlation in operation context and accepted local markers | actor authority, source event, source version, digest or subject relation |
| `source_event_ref` | Identity producer envelope | secondary delivery identity | `dedup_key`, source stream, subject observation or snapshot ref |
| `source_ref` | common envelope source boundary | source stream/object relation | source event, subject, safe summary or local snapshot |
| `source_version_ref` | Identity producer envelope | opaque same-stream version input | freshness, occurred time, cursor or row version |
| `dedup_key` | producer delivery metadata | logical idempotency scope | source event, digest, trace or semantic subject relation |
| `subject_observation_reference_id` | Identity-safe subject reference owner | identity of the observed subject reference | Identity subject id, snapshot ref, actor or source event |
| `snapshot_state_ref` | Observability local snapshot owner | identity of one local reference snapshot row | subject observation id, source version or freshness |
| `safe_summary_ref` | safe-summary projection owner | optional pointer to a redacted projection | summary body, subject identity, source version or freshness verdict |
| `freshness` | Identity context/freshness owner | typed observation state used by the refresh mapper | source-version comparator, local state, timestamp or business lifecycle |
| `ReferenceRefreshRecordRef` / H10 ref | Observability record owner | identity of one accepted local refresh history row | source event, Identity lifecycle event or transport receipt |
| repository version / committed cursor | local persistence owner | CAS and accepted-UoW ordering | producer version, freshness or correlation identity |

No implicit `From`, alias, string concatenation or fallback conversion may exist
between these values. In particular:

- a trace token cannot become a `CorrelationContextRef` or subject binding
  without the canonical context owner and proof;
- a subject observation id cannot be used as an idempotency key or local snapshot
  identity;
- a local snapshot ref cannot be sent back as an Identity subject id;
- a safe summary ref cannot be dereferenced to recover forbidden body material;
- an H10 ref cannot be used as evidence of producer acceptance or Identity truth
  mutation.

### 8.7 Digest and identity closure for this batch

| review item | current conclusion | affected boundary |
|---|---|---|
| operation/producer/source-event static binding | target defined; I03 is one finite Consumer with `Identity` producer | none at target level |
| six shared Consumer control fields | target shape is explicit and follows Step 06 owner | propagation remains affected |
| I03 payload member order | `subject_ref`;`safe_summary_ref`;`freshness` fixed at use-site | upstream payload schema owner open |
| complete subject-ref encoding | full named `SubjectObservationReference` shape required; no flattening | owner encoder propagation affected |
| freshness encoding | exact finite owner encoder required | `S08-E-I03-FRESHNESS-OWNER-01` |
| digest inclusions/exclusions | complete target frame and redline recorded | `S08-E-I03-DIGEST-ORDER-01` until all owners propagate it |
| logical and secondary identities | same atomic reservation boundary; no alias row | shared source-event/Consumer carrier affected |
| source-version semantics | explicit absent/present and fail-closed comparator rule | `S08-E-I03-SOURCE-VERSION-COMPARATOR-01` |
| subject-to-snapshot relation | exact local snapshot lookup and canonical binding required | `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` |
| freshness-to-H10 mapping | no direct state assignment; canonical inbound mapper required | `S08-E-I03-H10-INBOUND-MAPPER-01` |
| correlation separation | actor, trace, event, source, version, dedup, subject, snapshot and freshness remain distinct | target pass with propagation affected |
| implementation/test/evidence claims | design-only; no implementation, run, evidence or acceptance claim | not run |

### 8.8 Historical S01-S08 bounded-batch stop review

| 检查项 | 结论 |
|---|---|
| §1~§8是否形成独立的I03边界、authority、envelope/payload、concrete input、字段来源、relation、digest和identity记录 | `pass_with_affected_open`；本批仅完成输入与身份分析，不声称完成完整Consumer协议 |
| Identity truth与Observability reference projection是否保持所有权分离 | pass；I03不拥有Identity profile、PII、credential、role、membership、lifecycle、authentication或raw body |
| header-before-payload、trusted actor、source/event/version/dedup/trace/subject/snapshot/freshness是否保持语义隔离 | pass at design-record level；exact owner propagation仍受affected约束 |
| source-version与freshness是否禁止互相替代，且缺 comparator/owner时是否fail closed | pass；不得使用时间、cursor、row version或默认`Fresh`补值 |
| I03专属affected是否全部登记 | pass；6项已登记，包含L1-identity canonical payload/freshness/producer传播缺口及本地relation/mapper传播项 |
| 是否发现新的上游 blocker | yes；L1-identity current材料缺完整`IdentityObservationContextPayload` wire/producer/schema注册、独立`ReferenceFreshnessState` owner及其传播关系；不得由Observability复制canonical |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03尚未计入完成数 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | historical checkpoint；当前由 §9 stop review 承接，不得把本段门禁当作current恢复点 |
| 当前提交 | 不需要；用户未要求提交 |

本批关闭的是 I03 §1~§8 的历史检查点，不是 I03 协议本身。§9 仅在本批追加
redaction / body-free admission 设计记录；它不更新共享协议索引，不允许正式
`03` 回填，也不允许跨到 §10。所有未闭合 owner 保持 affected/blocker 状态。

## 9. Redaction and body-free admission

本节把 I03 的 body-free 边界收敛到字段级 admission contract。它定义的是
协议设计规则和失败分类，不是运行结果、测试结果或 evidence。`body-free` 的
含义不是“暂时不展示 body”，而是该 material 从进入 I03 边界开始就没有任何
可恢复的 Identity body、provider response 或原始序列化内容；typed ref 也不授予
本协议回读其指向对象正文的权限。

### 9.1 Accepted material surface

I03 允许进入 application input、digest material 或 accepted local surface 的
内容仅限于下表。每个值必须由其 canonical owner 构造或验证；本节不创建第二
个 DTO、wrapper、redaction marker 或 ref owner。

| material 类别 | 允许内容 | 允许用途 | 明确不代表 |
|---|---|---|---|
| trusted delivery metadata | `ActorSafeRef`、I03 固定 consumer、`ObservationProducerFamily::Identity`、typed source/event/version/schema/dedup/trace refs、`occurred_at` | admission、operation context、logical/secondary identity、safe correlation | Identity truth 已正确、业务动作已接受、transport 已确认 |
| subject reference | 完整 `SubjectObservationReference` 及其 owner-defined nested fields | 绑定被观察的 subject reference 与本地 snapshot relation | Identity subject aggregate、profile、tenant、role、membership 或 lifecycle |
| safe summary reference | `Option<SafeExternalSummaryRef>`；仅保留 typed ref 和明确的 absent/present 状态 | 在 canonical owner 验证关系后作为 observation-side safe projection pointer | summary body、provider response、freshness verdict 或读取正文的授权 |
| freshness observation | canonical owner 定义的 `ReferenceFreshnessState` typed variant | 交给 inbound mapper 选择有限的 observation-side branch | source-version order、local state、resolver success 或 Identity lifecycle |
| local accepted markers | `ReferenceSnapshotStateRef`、H10 ref、stored result/receipt ref、gap/visibility marker、immutable outbox snapshot ref | 仅在对应 local UoW 成功且由 owner 产生后返回或持久化 | source acceptance、Identity truth mutation、external acceptance 或验收签署 |
| process-local admission material | validated typed fields 与一次生成的 `RequestDigestCandidates` | 完成 reservation/replay admission；按值传入 service | raw envelope bytes、provider hash、current lookup snapshot 或可回放的 body |

以下字段绝不作为 I03 payload 或 application input 的隐式扩展：Identity
profile/body、PII、credential/token、role/capability、membership、lifecycle
event、authentication decision、source/provider response、summary text、raw
labels、tenant text、transport locator、partition/offset、worker ack state、
stack trace 和外部验收材料。未知字段不能因为名字看似安全而进入后续 mapper。

### 9.2 Field-level admission and redaction matrix

下表区分“可以用于 admission”与“可以写入 durable/public surface”。某个值
通过 typed decoder 并不自动获得持久化资格；只有 `durable use` 栏明确允许的
owner surface 才能承载它。

| 字段 | canonical 来源 | admission / redaction 校验 | 缺失或异常行为 | durable use |
|---|---|---|---|---|
| `actor_ref` | trusted C-03 worker delivery | 必须是有效 `ActorSafeRef`，不得从 payload、transport peer 或 credential 推导 | 缺失或不可信时在 payload 解码前拒绝；不回退到 payload actor-like 字段 | 仅进入 operation context、logical scope 及 owner-approved safe receipt marker |
| `consumer_name` / operation | static I03 slot and operation map | exact `ConsumeIdentityObservationContext`；不接受 route、display name 或 generic Consumer enum | mismatch 立即 protocol rejection；不选择其他 decoder | operation token、safe diagnostic kind、stored result binding |
| `producer_family` | authenticated envelope binding | 必须精确为 `ObservationProducerFamily::Identity`；不从 payload source kind cast | mismatch/unknown 为 unsupported or rejected；不改投其他 consumer | typed reservation/event identity and safe result metadata |
| `source_event_ref` | common envelope header | typed, non-empty, source-event identity must be independently valid | malformed时可返回不含该 ref 的 ephemeral rejection；不得 mint secondary identity | secondary identity and only those receipts/logs explicitly allowing a safe event ref |
| `source_ref` | common envelope header | complete typed source boundary；不得由 subject/safe-summary ref 或 topic 推导 | malformed/missing时拒绝；不由 payload 覆盖 | source relation, digest material and owner-approved local reference |
| `source_version_ref` | optional Identity envelope header | present value must bind exact producer/source; remain opaque until canonical comparator exists | absent保持显式`None`；mismatch拒绝；不可比较时 fail closed | exact typed source-version relation only; never local row version |
| `schema_version` | registered I03 schema catalog | exact finite version/discriminator and owner decoder must be registered before payload decode | unknown/ownerless version为`UnsupportedSchema`；无 reservation/digest | stored protocol metadata only if shared result owner requires it |
| `dedup_key` | envelope delivery metadata | valid logical idempotency key；不参与 semantic digest material | malformed时拒绝；不由 source event/trace/time补值 | logical reservation key and stored replay lookup; not public business truth |
| `occurred_at` | validated producer metadata | typed event time and bounded format; never used as freshness/version substitute | malformed时拒绝；不改用 local clock/delivery time | source metadata only where local receipt owner explicitly retains it |
| `trace_ref` | optional envelope metadata | typed correlation value, explicit absent/present; no actor or causation cast | absent保持 absent；malformed只影响 protocol admission,不由其他 ref替代 | safe correlation marker only; never digest identity or subject binding |
| `subject_ref` | canonical `SubjectObservationReference` use-site | validate complete named shape and all nested relations; body-free boundary marker required | malformed/ownerless/mismatched state rejects before digest; no subject-id rehydration | local snapshot relation and observation-owned H10/input reference |
| `subject_ref.subject_observation_reference_id` | subject-reference owner | stable observation-reference identity; cannot be treated as Identity subject id | missing or inconsistent nested identity rejects whole payload | only as the named subject-reference member |
| `subject_ref.subject_kind` | subject-reference owner | finite kind and compatibility with safe ref/boundary marker | unknown or incompatible kind rejects; no default kind | typed local relation and safe result classification |
| `subject_ref.subject_safe_ref` | subject-reference owner | typed body-free safe ref; exact relation required, no prefix inference | missing/malformed/mismatch rejects; no tenant/name fallback | body-free subject relation only |
| `subject_ref.identity_boundary_marker` | Identity boundary owner | marker must explicitly identify the Identity-to-observation boundary | missing/unknown marker fails closed; no Boolean or producer-name substitute | local boundary/audit marker if owner permits |
| `subject_ref.snapshot_state_ref` | Observability reference snapshot owner | typed stable local identity; must be related to the complete subject tuple | missing/mismatch/duplicate row is typed relation failure; no local ref mint | exact snapshot relation and accepted H10 branch |
| `subject_ref.state` | subject-reference / reference-state owner | preserve finite state and its source; do not map directly to local `Resolved`/`Fresh` | unknown or incompatible state rejects or delays by owner rule | only through canonical inbound state mapper |
| `subject_ref.visibility_constraint_ref` | visibility/reference owner, optional | validate explicit absent/present and subject/snapshot relation | absent is not unrestricted visibility; mismatch rejects or enters typed no-mutation branch | body-free visibility relation only |
| `safe_summary_ref` | canonical `SafeExternalSummaryRef` use-site | `Some` must be body-free, source-bound, subject/snapshot-compatible and owner-valid; never dereference body | explicit `None` remains absence; malformed/mismatched ref rejects; unavailable backing projection is delayed/degraded, not empty | optional safe projection ref in accepted local state/receipt only after relation proof |
| `freshness` | upstream `ReferenceFreshnessState` owner | canonical finite decoder and allowed combination with subject/summary/version | missing, unknown or ownerless value fails closed; no default `Fresh` | only as input to canonical H10/reference-state mapper |
| `request_digest_candidates` | `ObservationDigestCanonicalizer` | generated once after every header/payload/redaction gate; excludes all forbidden body and transport material | canonicalization failure yields no input, reservation or UoW | process-local reservation/replay admission; no raw material or provider hash |
| generated local refs | typed local ID/ref owner | generated only after the branch is authorized to create the corresponding fact | never generated to fill a missing incoming ref or make an invalid payload look valid | accepted local UoW only; no digest input |

`SafeExternalSummaryRef` 是一个已经经过独立 safe-summary projection 边界的
typed pointer。I03 只验证它的 type、source、subject、snapshot 和 schema relation，
不读取其正文，也不把“存在 `Some`”解释为 fresh、resolved、authorized 或 provider
成功。当前 canonical type 在 Step 06 已存在，但 I03 专属 producer-to-summary
relation propagation 仍属于现有 `S08-E-I03-PAYLOAD-SCHEMA-01`、
`S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` 和相关 Step 06/07 affected；本节不创建
`SafeSummaryRef`、`SafeSignalSummaryRef` 或其他兼容别名。

### 9.3 Ordered admission gates

I03 的 admission 必须按下列顺序执行。顺序是安全边界的一部分：header 未被
认证和注册前不得解释 payload；payload 未通过 body-free 校验前不得生成 digest；
所有 admission gate 通过前不得构造 application input 或建立 reservation。每个
失败分支都返回完整的 safe typed surface，不保留 partial input。

| 顺序 | gate | 必须确认的内容 | 失败时的唯一允许结果 |
|---:|---|---|---|
| 1 | static slot and trusted actor | selected entry 是 I03，worker 提供可信 `ActorSafeRef`，operation/payload family exact | protocol rejection；不读取 payload、不调用其他 assembler |
| 2 | header shape and bounds | consumer、event/source/version、producer、schema、dedup、occurred_at、trace 的 typed shape 与边界 | malformed rejection；不得用 raw bytes 或 transport metadata补值 |
| 3 | producer/schema registration | producer 精确为 `Identity`，schema/discriminator 在 canonical catalog 中注册 | `UnsupportedSchema` 或 typed protocol rejection；不 decode、不 reserve |
| 4 | source-version header relation | present version 与 producer/source exact match；不执行本地排序 | consistency rejection；不得用时间、cursor、row version替代 |
| 5 | canonical payload owner | `IdentityObservationContextPayload` declaration、wire grammar、decoder、producer encoder 与 registration 都存在 | ownerless/dependency failure，fail closed；不得由三个 use-site 字段拼造 DTO |
| 6 | exact body-free decode | 只解码 I03 payload；拒绝 unknown/duplicate fields、raw body、provider/credential/lifecycle/actor-like fields | boundary rejection；不产生 partial payload、body hash 或 debug serialization |
| 7 | subject reference admission | complete `SubjectObservationReference` shape、boundary marker、safe ref、snapshot ref、state/visibility combinations valid | typed subject/relation rejection；不从 id/ref prefix/current row 反推 |
| 8 | safe-summary admission | `Some` 的 canonical ref 与 exact source/subject/snapshot relation valid；`None` 保持显式 absent | relation rejection or delayed dependency branch；不合成 summary、不读取正文 |
| 9 | freshness admission | finite `ReferenceFreshnessState` decoder、owner and allowed combinations available | ownerless/unknown/missing freshness fail closed；不默认 `Fresh` 或从时间推导 |
| 10 | typed material assembly | only validated header/context/payload fields enter `inbound_consumer_request` in fixed order | no input, no digest, no reservation；不保存 serialized request |
| 11 | digest candidate generation | canonicalizer consumes body-free semantic material once; excluded set remains excluded | canonicalization error；不 hash broker bytes, raw body or provider response |
| 12 | operation context and private input | event identity, trusted actor, operation, source/version and digest candidates agree; `try_new` rechecks relations | constructor rejection；不接受 caller mutation or a second source of truth |
| 13 | service relation and mutation boundary | only after admission, service may reserve logical/secondary identities, load snapshot relation and invoke canonical mapper | typed relation/idempotency/dependency result; no local mutation until owner/UoW gates pass |

The stage-5 ownerless condition is distinct from a stage-6 malformed payload. A
payload whose three field names happen to match the current use-site cannot be
classified as stale, unresolved or unavailable when the canonical decoder and
producer registration are absent. Likewise, a valid `Some(safe_summary_ref)` cannot
be used to bypass the stage-7 subject/snapshot relation or stage-9 freshness mapping.

### 9.4 Forbidden body and unsafe material matrix

下列内容即使只出现在错误分支、重试 carrier、debug formatter、dead-letter
metadata 或 metrics label 中，也属于边界违规。发现它们时不得先 hash、truncate、
serialize 或写入临时表再决定是否 redaction。

| forbidden material | detection point | classification | durable/public consequence | explicitly forbidden shortcut |
|---|---|---|---|---|
| Identity profile、PII、contact、credential、token、role、membership、lifecycle body | payload decode or producer adapter boundary | boundary rejection；若已有 canonical safety branch可用，则只允许 body-free terminal marker | no input/digest/receipt/error/outbox/H10/body；不得把 worker raw delivery交给 dead-letter | 从 profile 生成 safe summary 或用 subject id恢复 profile |
| raw serialized payload、event body、provider response、resolver response body | decoder、resolver或logging boundary | forbidden-body rejection or explicitly owned body-free quarantine classification | only allowed body-free result/marker may commit; raw bytes never persist or publish | body hash、截断文本、base64、debug dump、retry payload |
| safe-summary正文、action text、raw labels、unbounded reason | summary adapter or diagnostic boundary | safe-summary relation/diagnostic rejection | retain only `SafeExternalSummaryRef`、finite reason and safe typed refs | 把 ref dereference后复制正文到 receipt/H10/log |
| caller-supplied actor/tenant/authorization/visibility assertion | input assembly | protocol/authority rejection | ignore no field silently if it changes semantics; no local truth mutation | payload actor覆盖trusted actor、caller flag授权 |
| topic、endpoint、partition、offset、delivery attempt、ack state、transport credential | entry/worker boundary | transport-material rejection from application surface | may remain in private transport diagnostics only if its owner redacts it; never in I03 input/digest/receipt | 将 transport id 当 source event/dedup/trace |
| stack trace、exception text、SQL/provider raw error、secret/config value | error/log/metric projection | safe-diagnostic redaction failure | expose only finite error category and typed safe refs; no raw diagnostic persistence | `Debug`/`Display` string直接进 public error |
| current local snapshot row、current lookup result、repository cursor/version used as fallback input | service/replay boundary | consistency/dependency failure | no payload repair, no digest rebuild, no local overwrite | 从当前 truth重建缺失 payload或把 row version当 source version |

I03 不定义一个新的 `QuarantineRef` 来承载 forbidden body。若现有 shared
`ObservationConsumerResult` 和 per-flow C-05 mapper 已提供合法的 body-free
quarantine/terminal marker，结果只能引用该 marker 及 safe error；若没有合法
carrier，则保持 no-completion/affected 状态，不能以 raw dead-letter body 补足。
Worker 的 `DeadLetter`、`Retry` 或其他 action 也只能消费 typed application
result，不能要求 I03 回传原始 body。

### 9.5 Safe diagnostics, receipt, audit and outbox boundary

#### 9.5.1 Safe diagnostic surface

允许的日志、metric label、trace annotation 和 error public surface 只能使用
有限 operation/consumer/producer/schema/result/state/error-category、经 owner
验证的 typed refs、bounded counts、attempt class、visibility/degraded marker、
commit marker 及可安全暴露的 correlation ref。digest 只能在已有 safe fingerprint
owner 明确允许时以 safe token 出现；不得把 canonical material 序列化到日志。

下列内容一律不出现在诊断面：payload bytes、subject/profile正文、safe-summary
正文、provider/adapter raw response、raw labels、tenant/credential、topic/offset、
stack trace、SQL、配置 secret、完整 exception text 和任何未注册的 ref string。
`Debug`、`Display`、telemetry exporter 和 fake/controlled adapter 不构成 redaction
豁免。

#### 9.5.2 Receipt and stored result

| result surface | allowed material | forbidden material | admission status |
|---|---|---|---|
| pre-admission rejection / unsupported | finite outcome/error category、已验证的 safe header refs（如 shared carrier允许） | payload、raw body、未验证 payload ref、provider text | ephemeral；不 reserve、不写 accepted audit |
| delayed / dependency result | finite delayed/dependency kind、safe source/event/trace refs及恢复分类 | resolver body、retry payload、默认 summary/freshness | 只有 shared owner允许的 ephemeral/stored surface；不虚构 accepted mutation |
| fresh accepted result | stored result ref、receipt、changed/outbox/H10/snapshot refs和finite outcome | Identity truth、raw body、summary正文、transport ack | 仅在同一 accepted UoW commit后产生 |
| replayed result | 原 stored result/receipt 的 lossless surface + `Replayed` access overlay | 重新解码/重算 body、当前 truth重建、fresh local refs | 不重跑 snapshot/H10/outbox/diagnostic mutation |
| local terminal/quarantine result | canonical body-free marker、safe error、owner-provided result ref | `QuarantineRef` alias、dead-letter body、provider response | 仅在 per-flow owner有合法 carrier时允许 |

`Accepted` 在 I03 中只表示 Observability reference observation 的本地 accepted
UoW 已提交。它不表示 Identity profile 改变、provider 成功、事件已被 transport
ack、报告已交接或外部验收通过。`Replayed` 只是在原 stored surface 上的访问层，
不创建新的 durable/public outcome。

#### 9.5.3 Local audit, H10 and outbox

I03 只有在 owner-approved snapshot/reference transition 成功并与 stored result
处于同一 UoW 时，才可以写入 Observability-owned H10 reference refresh history、
local audit marker 或 immutable outbox snapshot。其字段限于 typed subject/source/
version/freshness/safe-summary refs、finite transition/result/state markers、local
generated refs 和必要的 correlation marker。H10 是本地观察历史，不是 Identity
事件、resolver/provider success 或 source audit proof。

预 admission rejection、unsupported schema、ownerless payload、malformed subject、
safe-summary relation failure 和 unknown freshness 不得伪装成 accepted business
audit/trace。若 safety owner明确允许记录一个 rejected/blocked marker，该 marker
也必须 body-free，并且不能与 accepted transition、H10 或 outbox success 混用。
Outbox 只能保存 accepted UoW 生成的 immutable typed snapshot；publisher/worker
不得重新读取 current truth 或要求 I03附带原始 payload。

### 9.6 Missing, malformed and ownerless behavior matrix

| condition | application result classification | input / digest / reservation | local durable write | forbidden fallback |
|---|---|---|---|---|
| missing/invalid trusted actor | protocol/authority rejection | payload不解码；无 input/digest/reservation | none | 使用 payload actor、process identity或transport peer |
| missing/malformed required header | protocol rejection | header-before-payload；无 payload interpretation | none | 用 payload、route、topic或当前配置补 header |
| unknown producer/schema/discriminator | `UnsupportedSchema` or typed rejection | 不解码、不生成 digest、不 reserve | none | 尝试相邻 Consumer decoder或按字段名猜协议 |
| ownerless canonical payload declaration/encoder | dependency/owner rejection；fail closed | 不创建 local DTO、input、digest或reservation | none | 在 Observability复制 `IdentityObservationContextPayload` |
| unknown/duplicate/forbidden payload field | body-free boundary rejection | 不产生 partial payload；禁止 body hash | none，除非已有合法 body-free terminal marker | 丢弃未知字段后继续、truncate后继续、`serde`宽松接收 |
| malformed or ownerless `SubjectObservationReference` | typed subject/relation rejection | no digest/reservation | none | 只使用 observation id、safe-ref prefix或current row |
| explicit `safe_summary_ref = None` | structurally absent; later policy may allow delayed/no-mutation branch | 可继续到 owner-approved freshness/policy gate；不得填值 | no summary claim; accepted mutation only if full flow permits | empty ref、current summary、raw resolver lookup |
| `Some(safe_summary_ref)` malformed or relation-mismatched | typed relation rejection | no accepted mutation; reservation result follows shared idempotency rule | none | 把任意 ref 当作本 subject summary |
| safe-summary backing projection unavailable | delayed/dependency or owner-approved degraded branch | no synthetic digest material; no accepted summary branch | no fabricated snapshot/H10 | 把 unavailable变成 `None`、empty或`Accepted` |
| freshness missing/unknown/unregistered | protocol/owner rejection | no input/digest/reservation | none | default `Fresh`、用 source version/time/row version替代 |
| source version absent | explicit absent; continue only under canonical no-version policy | preserve `None`; no inferred order | no synthesized version marker | use `occurred_at`、cursor或repository version |
| source-version comparator missing/incomparable | typed dependency/consistency fail closed | no version-ordered mutation; replay only when exact stored identity proves it | none unless owner provides explicit no-mutation result | lexical/numeric/arrival-order compare |
| subject/snapshot relation missing, ambiguous or duplicate | typed relation/dependency result | reservation may return shared conflict/delayed surface, but no transition | none | first-row-wins、mint replacement、overwrite mismatch |
| canonical digest generation fails | protocol/application error | no input completion, no reservation | none | hash raw envelope/provider response or retry with new key |
| commit probe remains unknown | indeterminate/no-completion affected branch | do not assume accepted/retry/terminal | do not add speculative result | choose `Acknowledge`/`Retry`/`DeadLetter` by default |

`None`、missing、malformed、ownerless、unavailable 和 forbidden body 是不同的
分类。尤其不能把 optional safe-summary 的显式 `None` 与字段缺失、safe-summary
resolver unavailable 或 freshness unknown 合并为同一个空值；每种分类必须沿用
shared result/error carrier 的有限语义。

### 9.7 §9 affected and closure review

| review item | current conclusion | affected / blocker |
|---|---|---|
| allowed material surface | target body-free surface is explicit; no Identity/business body crosses I03 | propagation of shared receipt/result carrier remains affected |
| field-level subject and summary admission | complete named `SubjectObservationReference` and optional `SafeExternalSummaryRef` relation required; no aliases or dereference | `S08-E-I03-PAYLOAD-SCHEMA-01`; `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` |
| safe-summary canonical owner | Step 06 canonical type exists; I03 producer/source/subject/snapshot relation is not fully propagated | existing payload/relation affected; no new owner created |
| freshness admission | finite owner/decoder/combination matrix required; current owner gap remains fail closed | `S08-E-I03-FRESHNESS-OWNER-01` |
| header-before-payload order | fixed; unknown schema/ownerless payload never reaches digest or service input | target rule pass; catalog propagation affected |
| raw body exclusion | raw body cannot enter input, digest, log, metric, trace, error, receipt, audit, outbox, persistence or dead-letter | design rule pass; runtime proof not claimed |
| diagnostics and receipt | only finite safe kinds, typed refs and committed local markers; `Accepted`/`Replayed` meanings remain local | shared result/action/indeterminate carriers remain affected |
| missing/malformed/ownerless behavior | explicit fail-closed matrix recorded; no default/fallback inference | source-version, H10 mapper and C-05 per-flow mapping remain affected |
| new canonical-owner blocker discovered in §9 | no new independent owner gap; existing two L1-identity upstream gaps cover payload/freshness | no new blocker added |
| implementation/test/evidence status | design-only; no implementation, run, test, evidence alias or acceptance signature claimed | not run |

### 9.8 S01-S09 bounded-batch stop review

| 检查项 | 结论 |
|---|---|
| §1~§9是否形成独立的I03边界、payload/input、字段来源、redaction、body-free admission和失败矩阵记录 | `pass_with_affected_open`；本批只完成I03 §9，不声称完成I03整体 |
| raw Identity/provider/business body是否被排除在input、digest、log、metric、trace、error、receipt、audit、outbox、持久化和dead-letter之外 | pass at design-record level；不声称已有运行时验证 |
| header-before-payload、unknown/ownerless schema fail-closed和safe-summary不回读正文是否固定 | pass；canonical payload/freshness owner与relation propagation仍open |
| `None`、missing、malformed、ownerless、unavailable和forbidden body是否保持不同语义 | pass；不得用空值、默认`Fresh`或当前row合并 |
| I03六项既有affected是否覆盖本批缺口 | pass；未发现需要新增canonical owner的独立gap |
| 是否发现新的上游 blocker | no new blocker；既有L1-identity `IdentityObservationContextPayload` owner gap与`ReferenceFreshnessState` owner gap继续open |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03整体尚未计入完成数 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | 停审并等待用户明确确认；确认后只读取并写入I03 §10，不进入I04~I09、S08-F/G或Step09 |
| 当前提交 | 不需要；用户未要求提交 |

本历史批次恢复点为
`Step08_S08-E_I03_S01-S09_recorded_with_affected_open_waiting_user_before_I03_S10`。
§9 的 redaction 规则已写入 I03 中间产物；该 ID 仅作历史审计记录，不改变当前
I03 §10 已完成、I03 尚未整体完成、正式 `03` 冻结、既有 blocker/affected 开放
和无提交要求的状态。

## 10. I03 local UoW and durable fact mapping

本节只闭合 I03 的本地事实写入关系和顺序，不定义新的 snapshot、H10、stored
result、receipt 或 outbox owner。I03 的 accepted branch 只能提交
Observability-owned reference facts；它不能把 Identity producer 的输入变成
Identity truth，也不能因为需要一个通用 Consumer 结果而创建第二套持久化模型。

### 10.1 Accepted local write set

I03 的写入集合按下表建立。表中的顺序是逻辑 staging 顺序，不代表每个
repository 方法都已经完成 durable 实现；Step 07/11 仍须提供同一语义的
adapter 与事务证明。

| order | local fact / operation | exact source and relation | same-UoW rule | current closure |
|---:|---|---|---|---|
| 1 | incoming UoW | `ObservationUnitOfWorkManager::begin()`；新 transaction ref 不得与上一次调用复用 | 所有本次 I03 staged write 都挂在这一个 handle 上 | Step 07 surface exists; runtime proof not claimed |
| 2 | logical + Consumer secondary idempotency reservation | `ObservationIdempotencyScope`、完整 `RequestDigestCandidates` 与 `ObservationInboundEventIdentity`；由 I03 input/context提供 | reservation 必须在 snapshot mutation 前获得；`Replay`、`Conflict`、`InFlight` 不进入 accepted writer lane | exact port exists; per-flow propagation affected |
| 3 | exact snapshot read | `ReferenceMaintenanceRepository::get_snapshot_with_version(&subject_snapshot_ref)`；返回 `Versioned<ReferenceSnapshotState>` | read 必须是 committed row 与 exact repository version；不得用当前查询结果或 subject 字符串替代 | relation owner exists; `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` open |
| 4 | subject/snapshot relation proof | incoming `SubjectObservationReference` 与 loaded `ReferenceSnapshotState` 的完整 typed tuple、state/visibility relation和 source binding | relation proof必须在 domain transition前完成；missing、duplicate、wrong owner和mismatch均为 zero-write | affected; no first-row-wins |
| 5 | canonical inbound refresh decision | `ReferenceFreshnessInputSnapshot`、typed source-version relation、safe-summary provenance和唯一 H10 inbound mapper | service只能消费 owner-produced `ReferenceFreshnessAction`/transition proof，不能按 variant 名称直接赋值 | `S08-E-I03-H10-INBOUND-MAPPER-01` open |
| 6 | accepted reference post-state | `ReferenceSnapshotState` domain transition或 canonical `RequireNewSnapshot` creation proof | in-place update使用 loaded expected version；new snapshot只允许 owner-approved create-if-absent；旧 Invalid row不得原地恢复 | target defined; creation branch affected |
| 7 | staged snapshot | `ReferenceMaintenanceRepository::stage_snapshot(&snapshot, expected_version, uow)` | snapshot post-state、expected version和subject relation必须来自同一 accepted branch；staged row在 commit前不可见 | Step 07 callable exists; Step 11 ordering open |
| 8 | one reference cursor, when a reference mutation is accepted | `ObservationUnitOfWork::assign_reference_cursor()`，仅调用一次 | reference-only I03 UoW不再分配 Observation cursor；mixed class只能由更上层 accepted-effect mapper明确产生，不能由本节猜测 | cursor owner defined; mixed-flow propagation affected |
| 9 | H10 `ReferenceRefreshRecord` | `ReferenceRefreshRecordAssemblyRequest<'_>` + same transition/post-state + `ObservationRecordMetadataSeed<ReferenceRefreshRecordRef>` + assigned tagged cursor | 只有真实 snapshot transition/create branch才构造一条 H10；`PreserveCurrent`、pre-handler reject和resolver unavailable无 H10 | record schema / inbound mapper affected |
| 10 | H10 append | `ReferenceMaintenanceRepository::append_refresh_record(&record, uow)` | append必须与 snapshot、cursor、stored result和reservation completion处于同一 accepted commit；不得由 record 反向驱动 snapshot mutation | Step 07 callable exists; same-UoW proof affected |
| 11 | optional immutable outbound snapshot | only a separately registered, I03-compatible outbound payload owner may produce `ObservationOutboxRecord` + `ObservationOutboxPayloadSnapshot` | payload必须从本次 accepted transition、assigned cursor和typed encoder生成；没有 canonical payload时明确 `outbox_refs=[]` | `S08-CONSUMER-OUTBOX-SURFACE-01` open |
| 12 | immutable stored result surface | `StoredObservationResult`，包含 exact operation/actor/digest/reservation relation、body-free replay surface和本次已确定的 refs | result必须在 reservation completion前 staged；不能从 current snapshot/outbox重建缺失 ref | Step 06 owner exists; public Consumer mapper affected |
| 13 | idempotency completion | `ObservationIdempotencyRepository::mark_completed(&reservation, &result_ref, uow)` | 只能在 stored result已成功 staging后调用；`Reserved + result_ref`不可作为已提交中间态 | exact port exists; Step 09/11 propagation open |

这张表是 I03 的 accepted write footprint，不是允许实现者随意增加 follower 的
清单。下列事实不属于本协议的 durable write set：Identity profile/body、外部
resolver response、raw payload、transport acknowledgement、provider receipt、
当前 outbox 查询结果和任何业务 truth mutation。`ReferenceSnapshotStateRef`、
`ReferenceRefreshRecordRef`、`StoredObservationResultRef`、`OutboxRecordRef` 和
`OutboxPayloadSnapshotRef` 也不能互相替代。

### 10.2 Snapshot relation and transition closure

I03 在 reservation 获得后，必须先取得本地 snapshot 的 exact version，再把
incoming subject 与 loaded state 交给 canonical H10 mapper。目标算法如下：

```text
validated I03 input
  -> begin one ObservationUnitOfWork
  -> reserve logical scope + Consumer event identity
  -> if Replay/Conflict/InFlight: stop writer path and roll back incoming UoW
  -> load ReferenceSnapshotState with exact repository version
  -> prove subject/snapshot/source/visibility relation
  -> resolve typed freshness + source-version + safe-summary decision
  -> apply the canonical in-place transition or RequireNewSnapshot proof
  -> stage snapshot post-state with expected version
  -> assign one ReferenceCursor for the accepted reference mutation
  -> assemble and append one H10 ReferenceRefreshRecord
  -> stage an authorized immutable outbox pair, or retain outbox_refs=[]
  -> construct and stage StoredObservationResult
  -> attach result_ref and mark reservation Completed
  -> commit the one UoW
```

#### 10.2.1 In-place transition

对于已有可更新 snapshot，service 必须把 `Versioned<ReferenceSnapshotState>` 的
row version与完整 subject relation保留到 staging。domain transition 的输入必须
来自 H10 inbound mapper 的 finite decision，而不是把 `freshness`、`safe_summary_ref`
或 `source_version_ref` 直接写入 state。transition 成功后，same-UoW post-state
同时供以下三个 owner 使用：

1. `ReferenceMaintenanceRepository::stage_snapshot` 的 borrowed snapshot；
2. `ReferenceRefreshRecordAssemblyRequest` 的 accepted input/post-state；
3. stored result / optional outbox assembler 的 exact changed-ref material。

三者必须指向同一个 transition 结果。不得 reload snapshot、从 after-state 猜
change kind、重新运行 resolver，或让 H10 record 成为第二个 post-state 来源。

#### 10.2.2 New snapshot transition

只有 canonical H10 mapper 返回 `ReferenceFreshnessAction::RequireNewSnapshot`
并携带完整 creation proof 时，才允许生成新的 `ReferenceSnapshotStateRef`。
该分支必须同时保留旧 Invalid snapshot 的关系、同一 subject、source/version
relation、safe-summary provenance、policy basis和新 snapshot 的 expected version
语义；旧 row 不能被覆盖或删除。若 creation proof 缺失、subject relation
ambiguous或新 ref 不能由唯一 `IdGeneratorPort` 生成，整个 accepted branch
回滚，不得用旧 ref 伪造恢复。

#### 10.2.3 No mutation decision

`PreserveCurrent`、明确的 same-version no-op 或 owner-produced unavailable/deferred
结果不自动产生 H10。它们必须由 I03 flow 的有限 result policy 明确区分：

| branch | snapshot stage | H10 | result handling |
|---|---:|---:|---|
| `PreserveCurrent` with valid relation | none | none | only an explicitly allowed body-free `NoOp`/deferred surface may be stored |
| malformed or ownerless relation | none | none | reject/dependency result; no accepted reservation completion unless a formal durable rejection surface exists |
| resolver unavailable without accepted local transition | none | none | delayed/dependency surface; no fabricated summary or freshness |
| accepted in-place/new-snapshot transition | required | exactly one | stored result copies the exact changed snapshot/H10 refs |

“无 mutation” 不等于 “missing”，也不等于 “Accepted”。如果 current shared result
owner没有为某个 no-op/deferred branch提供可保存的 typed surface，I03必须保持
affected并 fail closed，而不是让实现端补一个空 result。

### 10.3 H10 construction and same-UoW record relation

H10 record 只在 snapshot transition 已被 domain owner 接受后构造。record factory
消费 accepted input、same-UoW post-state、record metadata和一个已分配的 tagged
cursor；它不读取 repository、不拥有 snapshot、不保存 source body，也不授权
Identity truth。

设计级调用形状如下，具体字段仍由 Step 06 H10 record owner和后续 affected review
提供：

```rust
let reservation = match idempotency.reserve(
    new_idempotency_ref,
    input.operation_context().idempotency_scope(),
    Some(input.inbound_event_identity()),
    input.request_digest_candidates(),
    uow.as_ref(),
).await? {
    ObservationIdempotencyReserveOutcome::Acquired(value) => value,
    ObservationIdempotencyReserveOutcome::Replay { result_ref, .. } => {
        return replay_stored_result(result_ref).await;
    }
    ObservationIdempotencyReserveOutcome::Conflict { .. }
    | ObservationIdempotencyReserveOutcome::InFlight { .. } => {
        return map_no_writer_result();
    }
};

let loaded = reference_repository
    .get_snapshot_with_version(input.subject_ref().snapshot_state_ref())
    .await?
    .ok_or(ApplicationError::Domain(DomainError::ReferenceConflict))?;

let accepted = h10_mapper.accept_identity_context(
    input.body_free_material(),
    &loaded,
    relation_proof,
)?;
let post_state = accepted.apply_to_snapshot()?;
reference_repository
    .stage_snapshot(&post_state.snapshot, loaded.version(), uow.as_ref())
    .await?;

let reference_cursor = uow.assign_reference_cursor()?;
let record = accepted.assemble_h10_record(
    post_state,
    ObservationCommittedCursor::Reference(reference_cursor),
)?;
reference_repository
    .append_refresh_record(&record, uow.as_ref())
    .await?;
```

该片段只表达 owner 调用顺序，不声称上述方法已经在目标实现仓存在。当前材料
尚未闭合 `accept_identity_context` 这一 canonical mapper，因此该名称是
Step 06/07 affected seam 的定位符，不是 I03 新增的第二个 mapper。若 mapper
返回 `PreserveCurrent`，不得继续执行 `stage_snapshot`、cursor 分配或 H10
append。

### 10.4 Accepted side-effect inventory

I03 每个 accepted 分支都必须在 service 内形成如下明确的 side-effect inventory，
再进入 stored result assembly：

| side effect | accepted transition branch | no-mutation / pre-handler branch | source / prohibition |
|---|---|---|---|
| reference snapshot state | one in-place CAS or one owner-approved create | none | loaded post-state + canonical H10 decision；不得 current reload |
| H10 refresh record | exactly one per accepted snapshot transition | none | same transition/post-state + one tagged cursor；不得 record-first |
| reference cursor | exactly one when snapshot mutation is staged | none | `ObservationUnitOfWork::assign_reference_cursor`；不得用 source version/time/cursor替代 |
| trace / audit marker | only if a named owner requires it and the marker is body-free | none for a plain reject/no-op | no generic trace because a Consumer ran；no business audit claim |
| outbox record/payload | only with a separately registered compatible payload | explicit empty set | no invented `ReferenceSnapshotChanged` event; publisher never rebuilds bytes |
| stored result | exact accepted/no-op/deferred surface when current result owner permits it | ephemeral unless a formal durable rejection/no-op surface exists | `StoredObservationResult` is immutable and result-before-complete |
| reservation completion | same commit as stored result | no completed row without result pointer | `mark_completed` only after result staging |

The current I03 protocol has no independent permission to append a trace, audit event
or outbound event merely because an Identity context was received. H10 is the local
reference-refresh history; it must not be described as an Identity lifecycle event,
provider success, authentication audit or source acceptance.

### 10.5 Commit, rollback and probe boundary

10.1 的顺序是 application 语义上的 staging 顺序，不表示任一 staged row 在
commit 前可被 committed read、replay probe、publisher 或下一次调用看到。I03
把本地处理分成三个边界：admission boundary、one-UoW staging boundary 和
transport completion boundary。只有第二个边界成功提交后，application 才能返回
一个声称本地事实已经 committed 的结果。

| boundary | allowed application surface | visible durable facts | forbidden conclusion |
|---|---|---|---|
| admission before UoW | typed protocol/relation error or complete input | none | 用 raw body、transport id或当前 row补字段 |
| reservation/staging before commit | private accepted candidate or typed pre-commit error | none；staged snapshot/H10/result/outbox不可被committed read看到 | 把 reservation 当 completed、把cursor gap当commit或提前返回receipt |
| known rollback before commit | typed failure or owner-approved known no-write recovery surface | none from this UoW；incoming reservation不能留下`Completed` | 返回`Accepted`、保留partial H10/outbox或盲目重试并重新mint refs |
| known successful commit | stored result relation validated and local result may return | exact snapshot/H10/result/reservation/outbox set from this UoW | 把local commit说成Identity truth、provider success或transport ack |
| transport action after local commit | worker-owned `Acknowledge`/`Retry`/`DeadLetter` only after exact mapper | local committed facts remain immutable | 用transport失败回滚或改写snapshot、H10、result、outbox |
| commit outcome unknown | no completion surface under current shared carrier | unknown；不得假设有或没有任何row | 选择任一terminal action、伪造receipt或按current truth猜测 |

I03 的 accepted path 采用以下设计级顺序。`commit` 的返回分类属于既有 UoW
owner；本节不新增一个 Step 08 专属 commit enum。

```text
validated I03 input
  -> begin one fresh ObservationUnitOfWork
  -> atomically reserve logical scope + Consumer event identity
  -> stop writer lane for Replay / Conflict / InFlight
  -> load exact snapshot and prove subject/source/visibility relation
  -> obtain canonical freshness/source-version decision
  -> apply in-place transition or RequireNewSnapshot creation proof
  -> stage snapshot with expected version
  -> allocate exactly one ReferenceCursor for a real reference mutation
  -> assemble and append exactly one H10 record
  -> stage an authorized immutable outbox pair, or retain explicit outbox_refs=[]
  -> stage StoredObservationResult
  -> mark reservation Completed with that result_ref
  -> commit the one UoW
  -> return the validated local result to the worker action mapper
```

Known failures are classified by where they occur:

| failure point | required local handling | result / action consequence |
|---|---|---|
| header, payload owner, redaction or input constructor | no UoW writer lane; reject before reservation | ephemeral typed protocol/dependency result; worker action remains flow-owned |
| reservation returns `Replay` | do not mutate the new UoW; load the exact stored result only | original stored surface plus `Replayed` access; no new cursor/H10/outbox |
| reservation returns `Conflict` or `InFlight` | no accepted writer; rollback the incoming UoW handle if one was opened | conflict or delayed surface; no completion pointer is added |
| snapshot relation, freshness comparator, domain transition or stage call fails | rollback all staged local facts | no accepted snapshot/H10/result/outbox; no `Completed` reservation |
| H10 assembly/append or authorized outbox staging fails | rollback all earlier staged facts, including snapshot candidate and cursor visibility | no partial history or follower; an allocated cursor may remain an invisible gap only under the shared UoW rule |
| `save_result` fails | do not call `mark_completed`; rollback the whole UoW | no result is visible and no fresh success may be returned |
| `mark_completed` fails | do not commit a `Reserved + result_ref` intermediate state | rollback the whole UoW; no fresh success or speculative replay surface |
| commit returns a known not-committed/rolled-back outcome | use only the canonical known-no-write recovery classification | no stored result; action is selected only if the flow explicitly permits recovery |
| commit returns a known successful outcome | validate the exact staged result/reservation relation before return | local `Accepted`/authorized no-op can be returned; no external acceptance claim |
| rollback itself fails, or commit probe cannot classify the result | preserve an indeterminate/no-completion classification | current C-05 carrier cannot choose an action; affected remains open |

The commit probe, when the UoW owner permits one, must use the exact stable relation
`(operation, trusted_actor, dedup_key, source_event_ref, request_digest)` and then
validate the stored-result pointer. It may read the idempotency/result owner and its
committed relation; it may not reconstruct the answer from the current snapshot,
current outbox, current H10 row, arrival order or a second resolver call.

| probe result | permitted I03 continuation |
|---|---|
| completed reservation and exact stored result validates | return the original immutable surface through the shared replay/access mapper; do not rerun transition, H10 or outbox assembly |
| no committed reservation/UoW is proven | classify the known no-write branch; only an explicit flow policy may make it retryable or terminal |
| matching reservation is still in flight | return the shared delayed/in-flight surface; never start a second writer |
| result pointer is missing, mismatched or points to an invalid body-free surface | typed consistency defect; no current-truth reconstruction and no success |
| probe is `Unknown` or `Unsupported` | no `InboundConsumerCompletion` can be safely constructed with the current C-05 variants; do not select `Acknowledge`, `Retry` or `DeadLetter` |

### 10.6 Fake/durable semantic parity

The in-memory fake, controlled adapter and durable adapter must expose the same
semantic boundary. “Fake succeeds” is not evidence that the durable transaction
will succeed, and the fake cannot make an affected dependency appear available.

| semantic surface | fake / controlled implementation obligation | durable adapter obligation | parity redline |
|---|---|---|---|
| UoW isolation | keep staged maps/rows private until fake commit; expose phase-level failure injection | keep all writes in one transaction or equivalent atomic boundary | no direct global-map mutation; no staged row visible to committed reads |
| snapshot relation and CAS | enforce exact subject tuple, create-if-absent and expected-version checks | enforce the same uniqueness, relation and CAS predicate inside the transaction | first-row-wins, current-row overwrite or version fabrication |
| cursor allocation | allocate one tagged `ReferenceCursor`; a failed UoW may leave only the defined invisible gap | allocate the same namespace once and keep gap/commit visibility semantics | allocate both reference and observation cursors or reuse a rolled-back cursor |
| H10 append | require accepted transition/post-state and append-only identity before staging | enforce append-only identity and same-UoW relation | record-first, after-state reconstruction or dropped failed record |
| outbox surface | retain the exact immutable pair or explicit empty set in the staged result | persist the same pair atomically with the accepted UoW | publisher scan/rebuild or inferred refs |
| stored result/completion | reject `mark_completed` unless the exact result is staged in the same private transaction | enforce result-before-complete through transaction/constraint validation | committed `Reserved + result_ref`, result reconstruction or process-cache replay authority |
| rollback | discard every staged local fact and expose no partial read/index/replay result | roll back every participating store and preserve the same no-visible-subset rule | leave snapshot, H10, outbox or completion behind |
| commit failure/probe | inject known failure and `Unknown`; never auto-resolve unknown to success/absence | map driver ambiguity to the existing unknown/indeterminate carrier | blind retry with new refs, default negative probe or fabricated receipt |
| replay | return the exact stored body-free result and access overlay | load the same immutable result by stable identity | rerun resolver/transition or read current truth to fill fields |
| redaction | reject raw Identity/provider/business body in fixture and diagnostic capture | reject or redact before persistence and error projection | `Debug`/`Display`, provider text or fixture body enters digest/log/result |

These are design and future verification obligations only. No fake, durable adapter,
test run or evidence is claimed by this record.

### 10.7 I03 branch matrix

The matrix below is exhaustive for the I03 local write boundary. A row saying
“ephemeral” does not authorize the worker to invent a transport action; action
selection remains the exact C-05 flow mapper.

| branch | reservation / UoW | snapshot / H10 / cursor / outbox | stored result | application surface and action eligibility |
|---|---|---|---|---|
| malformed header or untrusted actor | none | none | none | ephemeral protocol rejection; no default action |
| unsupported schema, ownerless payload or unknown discriminator | none | none | none | `UnsupportedSchema`/typed dependency surface; no payload decode or retry-by-default |
| malformed subject, summary relation or freshness owner | none if rejected by assembler; otherwise rollback incoming UoW | none | none | typed relation/owner rejection; no fallback to current row, empty ref or `Fresh` |
| safe-summary backing unavailable or source-version comparator unavailable | rollback if reservation was already acquired | none | none unless a canonical delayed/no-op result owner explicitly permits it | delayed/dependency surface; no fabricated snapshot/H10 and no default action |
| logical idempotency conflict or secondary event-identity conflict | reservation not acquired; incoming UoW is rolled back | none | none | ephemeral conflict; no writer winner is selected |
| completed reservation with exact matching digest/event identity | no new writer | none | original immutable result | original surface with `Replayed` access; action mapper sees the original outcome only |
| reservation `InFlight` | no second writer | none | none | delayed/in-flight surface; no recursive handler execution |
| snapshot row missing, duplicate or subject/snapshot mismatch | reservation is rolled back unless a formal local rejection surface is owned | none | none by default | typed dependency/consistency result; no replacement ref or first-row choice |
| source version proven older/equal-no-change by canonical owner | no mutation | no snapshot/H10/cursor/outbox | stored `NoOp` only if explicitly owned; otherwise ephemeral/deferred | no-op or delayed policy surface; no automatic `Accepted` |
| `PreserveCurrent` with valid relation | no mutation; completion only if a durable no-op surface is authorized | none | exact stored no-op if authorized | no-op/replay access; otherwise fail closed rather than invent an empty result |
| accepted in-place transition | reservation acquired in same UoW | one snapshot CAS, one `ReferenceCursor`, one H10, authorized outbox or explicit empty set | exact stored result before completion | local `Accepted` after known commit; worker may map only through C-05 policy |
| accepted `RequireNewSnapshot` transition | reservation acquired in same UoW | old row retained, one new snapshot creation proof, one cursor, one H10, authorized outbox or empty set | exact stored result before completion | local `Accepted` after known commit; old Invalid row is not overwritten |
| domain transition or relation policy rejects after reservation | rollback | none visible | none | typed application/domain failure; no terminal action inferred from error kind |
| snapshot/H10/outbox stage failure | rollback | none visible; cursor may become invisible gap per shared rule | none | known no-write failure; retry only under explicit policy |
| stored-result save or reservation completion failure | rollback | none visible | none | no fresh success and no `Completed` row |
| known commit failure with rollback/absence proven | no committed reservation | none | none | known no-write failure; exact flow may choose retry/terminal action |
| commit probe `Unknown`/`Unsupported` or rollback outcome unknown | completion cannot be represented by current carrier | unknown; no speculative read/write | no fabricated result | no C-05 action; shared indeterminate affected remains open |
| local commit known successful, transport action fails afterward | committed reservation/result remain | exact committed snapshot/H10/outbox remain immutable | exact stored result remains replayable | worker reports transport failure and probes/retries by stable identity; never rolls back local facts |

### 10.8 Transport action boundary

The application service returns an `ObservationConsumerResult` or the existing
typed application error surface. It never returns `Acknowledge`, `Retry` or
`DeadLetter`, and it never calls a broker acknowledgement API. The worker may choose
an action only after validating the result's invocation access, inner outcome,
stored-result pointer, error presence and exact ref collections.

| local fact status | worker action rule | local truth rule |
|---|---|---|
| known committed accepted or exact replay | `Acknowledge` only if the shared per-flow mapper says so | preserve the exact stored surface; replay does not create a new one |
| known committed authorized no-op | `Acknowledge` only under the explicit no-op policy | no snapshot/H10/outbox may be invented |
| known no-write delayed/dependency branch | `Retry` only when the exact recovery policy marks it retryable and bounds loops | no result pointer or accepted local fact is fabricated |
| canonical local dead-letter marker committed | `DeadLetter` only when its owner and per-flow policy authorize it | marker/result remain body-free and immutable |
| pre-handler malformed/unsupported input | no wildcard action; use the producer/schema correction policy | no reservation, result or local business fact |
| commit or rollback status unknown | no legal action with the current carrier | do not acknowledge, retry, dead-letter or claim absence |

Transport action failure is outside the local UoW. A failed acknowledgement or
publication of the action cannot roll back the snapshot, H10, outbox snapshot,
stored result or completed reservation. Any later retry/probe must use the original
operation, actor, dedup key, source event and digest relation; it must not rerun the
resolver or reconstruct payload bytes from current truth.

### 10.9 Pseudocode seam ownership

The call names in §10.3 are design-level seam labels. They are not additional
canonical owners or permission to define local aliases. Their ownership is fixed as
follows:

| seam label in design call shape | actual owner boundary | implementation restriction |
|---|---|---|
| `accept_identity_context` | canonical H10 inbound mapper / policy owner from Step 06/07 | must return a finite decision and transition/creation proof; I03 cannot implement it by matching enum names |
| `apply_to_snapshot` | `ReferenceSnapshotState` domain transition owner | must consume the accepted proof and loaded expected version; no direct service field assignment |
| `assemble_h10_record` | H10 `ReferenceRefreshRecord` factory owner | consumes the same transition/post-state and tagged cursor; no repository read or source-body access |
| `replay_stored_result` | stored-result repository plus shared Consumer access mapper | loads the exact immutable result; never reloads current snapshot/outbox or reruns I03 |
| `map_no_writer_result` | existing shared result/error and per-flow policy mapper | must use existing finite carriers; no new `Duplicate`, `QuarantineRef` or generic action type |
| `stage_snapshot`, `append_refresh_record`, `save_result`, `mark_completed` | Step 07 repository/UoW ports | expected version, borrowed staged value and same UoW are mandatory; no split commit |
| `commit` / commit probe | Step 07 UoW and shared completion owner | unknown remains unknown; I03 cannot add a default probe result or action |

### 10.10 §10 closure and affected review

| review item | current conclusion | affected / blocker |
|---|---|---|
| accepted write set | reference snapshot, optional H10, stored result and reservation completion are named; no source/business truth write is allowed | shared result/action surface remains affected |
| snapshot read/version/relation | exact snapshot ref and `Versioned` row are required before mutation; duplicate/missing/mismatch are zero-write | `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` |
| freshness/source-version to transition | only canonical finite mapper may authorize transition; no local inference | `S08-E-I03-FRESHNESS-OWNER-01`; `S08-E-I03-SOURCE-VERSION-COMPARATOR-01`; `S08-E-I03-H10-INBOUND-MAPPER-01` |
| H10 same-UoW relation | record is built from accepted transition and same post-state after one tagged cursor; no reload or record-first path | H10 schema propagation and `R06-F-AFFECT-UOW-01` remain open |
| outbox relation | no outbox is assumed without a canonical payload; empty set is explicit | `S08-CONSUMER-OUTBOX-SURFACE-01` |
| result-before-complete | stored result must be staged before reservation completion in the same UoW | `S08-CONSUMER-QUARANTINE-REF-01`; shared result mapper affected |
| commit/rollback boundary | known pre-commit failures roll back the full staged set; known commit success requires exact result validation; unknown probe has no completion | `R06-F-AFFECT-UOW-01`; `S08-CONSUMER-INDETERMINATE-COMPLETION-01` |
| fake/durable parity | staged visibility, CAS/uniqueness, one cursor, append-only H10, result-before-complete, rollback and unknown probe semantics are identical by design | `R06-F-AFFECT-UOW-01`; implementation and Step 16 verification remain open |
| branch totality | replay, conflict, in-flight, malformed, ownerless, unavailable, no-op, accepted, known failure, unknown commit and post-commit transport failure are explicitly classified | shared C-05 action/no-completion surface remains affected |
| transport boundary | worker action is after local commit and cannot rewrite local facts; application does not own broker acknowledgement | `S08-CONSUMER-INDETERMINATE-COMPLETION-01`; per-flow action propagation remains open |
| design seam ownership | pseudocode names resolve to existing Step 06/07 owners; no new canonical mapper, result, action, quarantine or outbox owner was created | existing H10/result/outbox affected only |
| new blocker discovered | no independent canonical owner gap discovered; existing L1-identity payload/freshness gaps remain | no new blocker |

### 10.11 Historical S01-S10 bounded-batch stop review

| 检查项 | 结论 |
|---|---|
| §10是否闭合accepted local write set、snapshot/H10同一UoW、result-before-complete、commit/rollback/probe、fake/durable parity和transport action boundary | `pass_with_affected_open`；本批完成I03 §10设计记录，不声称I03整体完成 |
| known pre-commit failure是否全量rollback，且没有partial snapshot/H10/outbox/result/completion可见 | pass at design-record level；runtime adapter与Step 11/16验证未执行 |
| commit probe仍unknown时是否禁止假设accepted/not-committed或选择C-05 action | pass；`S08-CONSUMER-INDETERMINATE-COMPLETION-01`继续open |
| fake与durable是否要求相同的CAS、唯一性、staged visibility、one cursor、append-only、result-before-complete和probe语义 | pass at contract level；不声称fake/durable实现存在 |
| replay、conflict、in-flight、malformed、ownerless、unavailable、no-op、accepted、known failure和post-commit transport failure是否均有有限分支 | pass；per-flow action/result carrier仍affected |
| application是否保持不拥有transport action且commit后action失败不反写local truth | pass；不声称transport运行时验证 |
| 是否创建新的canonical owner、public DTO、result、action或quarantine ref | no；伪代码名称均标为既有Step06/07 seam |
| 既有I03六项affected与shared UoW/outbox/quarantine/indeterminate affected是否覆盖本批缺口 | pass；未新增独立canonical owner gap |
| 是否发现新的上游 blocker | no new blocker；L1-identity payload/freshness两个既有`open_upstream_internal`继续保持 |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03整体尚未计入完成数 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | historical checkpoint；当前批次已由 I03 §11 stop review 承接，不得把本表门禁当作current恢复点 |
| 当前提交 | 不需要；用户未要求提交 |

本段仅保留 I03 §1~§10 的历史检查点；当前恢复点由下方 I03 §11 stop review 承接。

## 11. I03 stored result exact lookup and Consumer receipt rehydration

本节只闭合“reservation 已指向一个 stored result 后，如何按 exact pointer
取回、校验并公开原始 Consumer receipt”的协议边界。它不重新定义
`StoredObservationResult`、`ObservationResultAccess`、`ObservationConsumerResult`、
`ObservationStoredConsumerReceipt` 或 C-05 action；这些对象分别由 Step 06、Step 07
和 S08-B 的既有 owner 承载。本节的目标是把这些 owner 在 I03 use-site 上的顺序、
字段来源、失败分类和 lossless 关系写成可落码的协议约束。

### 11.1 Authority and scope

| concern | current authority | I03 use-site rule | forbidden substitute |
|---|---|---|---|
| replay pointer | `ObservationIdempotencyReserveOutcome::Replay.result_ref` plus the returned `idempotency_ref` | treat both as an untrusted persisted relation that must be cross-checked; pointer alone never proves a valid receipt | current snapshot ref, outbox ref, source-event ref or a newly minted result ref |
| reservation lookup | `ObservationIdempotencyRepository::load_by_scope` and `load_by_inbound_event` | require the exact I03 logical scope and exact `ObservationInboundEventIdentity`; both lookup paths must resolve to the same reservation row when both are used | global scan, first-row-wins, lookup by string prefix or lookup by result ref through an undeclared port |
| immutable result lookup | `ObservationStoredResultRepository::get_result(&StoredObservationResultRef)` | load exactly the pointed result, then rehydrate and validate it before any public mapping | rebuild from current state, current H10, current outbox or a second resolver call |
| result integrity | `StoredObservationResult::try_rehydrate`, `StoredObservationReplaySurface::verify_integrity` and `validate_replay_for` | check reservation, scope, actor, operation, digest, kind, schema, bytes and digest in the owner-defined order | accepting a valid-looking `public_result_ref` without bytes/digest validation |
| Consumer decode | S08-B `ObservationStoredConsumerReceipt` exact decoder and `try_new`/`try_rehydrate` boundary | require `StoredObservationResultKind::ConsumerReceipt`; decode the retained schema only; reject unknown fields, noncanonical collections and incompatible presence | generic JSON/value map, command/job decoder, or protocol upgrade during replay |
| invocation access | application `ObservationResultAccess` mapped one-to-one to public `ObservationProtocolResultAccess` | `FreshlyCommitted` and `Replayed` are outer access overlays; access is never persisted in the inner bytes or digest | `Duplicate` durable state, access-dependent re-encoding or a generic success flag |
| action | worker exact I03 mapper and Step 12 recovery classification | application returns a validated result/receipt only; worker chooses C-05 action after commit certainty and receipt validation | application-returned `Acknowledge`, `Retry`, `DeadLetter`, wildcard action or action from error text |

The internal `StoredObservationResultRef` is an application-local pointer to an
immutable stored result. The public `ObservationStoredConsumerReceipt.result_ref`
is the stored result's `public_result_ref: BodyFreeRef`. They are deliberately
different values and roles. I03 must never expose the internal pointer as a public
receipt field, and it must never use the public result ref as a repository lookup key.
Likewise, `source_event_ref`, `outbox_refs`, `dead_letter_ref`, `trace_ref` and
`dedup_key` retain their separate semantics even when they occur in the same stored
surface.

### 11.2 Exact replay lookup and rehydration sequence

For a completed compatible duplicate, the sequence is fixed. Each step is either a
validated owner call or a pure mapping step; no step is allowed to infer missing
material from mutable truth.

```text
validated I03 input
  -> begin incoming UoW only if the admission path opened one
  -> atomic reserve(scope, inbound_event_identity, digest_candidates)
  -> Replay(idempotency_ref, stored_result_ref)
  -> rollback/discard the incoming writer UoW with no durable effect
  -> load the exact reservation relation by I03 scope and event identity
  -> load StoredObservationResult by the exact stored_result_ref
  -> rehydrate result and replay surface; verify bytes and digest
  -> validate result against the completed reservation and incoming context
  -> exact-decode ConsumerReceipt surface from retained schema
  -> map inner disposition/outcome and all refs without loss
  -> add outer access = Replayed
  -> return the original stored receipt; do not rerun I03
```

The same sequence applies after a post-commit probe proves a completed reservation
and exact result pointer. A probe is not allowed to return a current snapshot and let
the caller assemble a new receipt. If the implementation does not have a callable
for one of the required cross-checks, that missing seam remains affected; the flow
does not silently weaken the check.

| sequence point | required check | failure classification | allowed continuation |
|---:|---|---|---|
| 1 | `Replay` carries non-empty typed `idempotency_ref` and `StoredObservationResultRef` | reservation/result pointer invariant failure | no public receipt; do not retry the handler |
| 2 | incoming logical scope and exact I03 event identity resolve to the same reservation identified by the outcome | conflict, missing relation or duplicate-row consistency defect | no replay; no alias reservation; return the canonical consistency/dependency error |
| 3 | reservation state is `Completed`, and its stored-result pointer equals the replay pointer | completed-result relation defect | no current-truth reconstruction; no action selection |
| 4 | `get_result(pointer)` returns exactly one immutable result | missing or duplicate stored result | consistency failure; do not turn it into `Rejected`, `Delayed` or `NoOp` |
| 5 | result identity, operation, actor and request digest match reservation and incoming context | cross-scope/cross-actor/digest mismatch | consistency failure; do not expose the old surface |
| 6 | result kind is `ConsumerReceipt`, retained schema has an exact decoder, and kind accepts I03 | wrong family, unsupported schema or ownerless decoder | typed consistency/dependency failure; no protocol upgrade or alternate decoder |
| 7 | serialized bytes pass body-free bound/framing and stored digest matches exact bytes | corrupt, truncated, noncanonical or digest-mismatched surface | consistency failure; never log or return the bytes |
| 8 | decoded receipt passes outcome, source, ref-set, dead-letter and error presence matrix | malformed stored receipt surface | consistency failure; do not fill fields from current tables |
| 9 | outer access is set to `Replayed` only after all inner checks pass | mapper ordering defect | no response; never expose a speculative `Replayed` surface |

`load_by_scope` and `load_by_inbound_event` are relation checks, not alternative
sources of truth. If both are used, the rows must have the same `idempotency_ref`,
scope, producer/event identity, state and stored-result pointer. A missing row on one
path, an extra row, or a mismatch is a consistency defect. I03 must not choose the
row returned by whichever lookup happens to finish first.

### 11.3 Fresh commit and replay access overlay

The inner `ObservationStoredConsumerReceipt` is identical for a fresh committed
call and a compatible replay. Only the invocation-level access changes.

| invocation branch | inner surface source | `result_access` | newly created local facts | receipt rule |
|---|---|---|---|---|
| accepted writer commits with known success | staged `StoredObservationResult` and its validated replay surface from the same UoW | `FreshlyCommitted` | exactly the accepted snapshot/H10/result/reservation/outbox facts already staged by §10 | decode the staged Consumer surface; do not query committed current rows to fill it |
| compatible completed duplicate | exact stored result loaded by the reservation pointer | `Replayed` | none | return the original inner outcome, refs and safe error byte-for-byte; do not rerun resolver, transition, H10 or outbox assembly |
| known no-write durable `NoOp` | an explicitly stored ConsumerReceipt surface committed by the owner | `FreshlyCommitted` or `Replayed` | only facts in that stored no-op UoW | preserve empty changed/outbox/gap sets exactly; no implicit `Accepted` conversion |
| pre-handler rejection/delay/unsupported schema | no stored result | no access overlay; `Ephemeral` only | none | result/ref collections are structurally absent; error is required |
| commit status unknown | no validated access branch | no legal current completion | unknown and unclassified | do not claim either fresh or replay; retain the shared indeterminate affected state |

`FreshlyCommitted` cannot be assigned merely because `save_result` returned without
an error: the reservation completion and the whole accepted UoW must also have a
known successful commit. Conversely, `Replayed` cannot be assigned merely because a
reservation row exists: the exact immutable result and its receipt surface must pass
all checks above. Neither access value is part of `BodyFreeSerializedResult`,
`StoredObservationReplaySurface.digest_summary`, or the durable reservation row.

### 11.4 Receipt field provenance and presence matrix

The public receipt assembler performs a lossless field-by-field mapping. It receives
the validated stored result and decoded inner surface; it does not perform repository
lookups to derive missing fields. Presence is part of the contract, not a rendering
choice.

| public receipt field | exact source | presence rule | forbidden fallback |
|---|---|---|---|
| `consumer_name` | static I03 operation binding and stored receipt surface | must equal `ConsumeIdentityObservationContext` in both fresh and replay paths | incoming route string, display name or current worker registration |
| `source_event_ref` | validated I03 envelope on fresh staging, retained stored receipt on replay | stored surface must contain the original safe source event; incoming replay value is used only for identity equality, never to overwrite it | dedup key, message id, offset, payload id or newly minted event ref |
| `outcome` | decoded `ObservationStoredConsumerReceipt.outcome` mapped from the original stored disposition | preserve original value on replay; no action-to-outcome conversion | ack/retry/dead-letter action, error text, current snapshot state or duplicate marker |
| `result_ref` | `StoredObservationResult.public_result_ref` | required for every `Stored` receipt and must equal the decoded surface's result ref | internal `StoredObservationResultRef`, repository row id, outbox ref or new public ref |
| `changed_refs` | exact stored Consumer surface generated by the accepted UoW | canonical order and duplicate-free; explicit empty set is meaningful | current snapshot diff, H10 reread, result disposition or inferred state change |
| `outbox_refs` | exact validated stored surface field/accessor owned by the result boundary | preserve exact set, including explicit empty; replay adds none | current outbox scan, event-name inference or publisher state |
| `gap_refs` | exact stored gap relation captured by the accepted UoW | preserve empty/present distinction and canonical ordering | current gap table, error category, count or degraded flag |
| `dead_letter_ref` | committed local dead-letter marker, if and only if its owner and outcome matrix require it | co-presence with the stored terminal surface; absent for ordinary accepted/no-op/replay-added facts | broker message id, queue locator, transport action or Step 08 wrapper |
| `error` | stored `ObservationProtocolErrorSurface` or the validated ephemeral error | required for stored rejected/quarantined/dead-lettered surfaces and all ephemeral surfaces; absent only where matrix allows | provider text, raw Identity error, stack trace, current retry state or empty-string placeholder |
| `result_access` | current invocation branch | `FreshlyCommitted` or `Replayed` only for validated stored surface | durable outcome field, `Duplicate` variant or serialized inner value |

For I03, `Accepted` means only that an Observability-owned reference observation
UoW committed. It does not authorize a claim that Identity truth changed, that a
resolver succeeded, or that the transport acknowledged the delivery. A public
`result_ref` is a safe projection identity; it is not an evidence alias, a database
locator or a promise that a body can be recovered.

### 11.5 Stored versus ephemeral surface closure

The branch is selected by the existence and validity of a durable stored result,
not by the severity of an error or by the desired worker action.

| condition | application-level return | public receipt shape | result/ref rule | action eligibility |
|---|---|---|---|---|
| fresh accepted local transition known committed | `ObservationConsumerResult` with `FreshlyCommitted` | `Stored` with original outcome and refs | all refs come from the accepted UoW; no current lookup | worker applies the exact I03 mapper after commit proof |
| compatible completed duplicate | `ObservationConsumerResult` with `Replayed` | `Stored` with original outcome and refs | exact pointer and bytes only; no new refs | current duplicate delivery is eligible for the replay policy, normally acknowledgement; no handler rerun |
| formal durable rejection committed | stored result with original `Rejected` disposition | `Stored/FreshlyCommitted` | result ref required; safe error/ref presence must match surface | only the exact per-flow mapper may choose a terminal action |
| formal durable quarantine committed | stored result with original `Quarantined` disposition | `Stored/FreshlyCommitted` | only owner-provided body-free refs; no unowned `QuarantineRef` | action remains worker/policy-owned; no default dead-letter |
| formal local dead-letter marker committed | stored result with terminal local marker | `Stored/FreshlyCommitted` and `dead_letter_ref=Some` | marker, reason and result surface must be committed together | `DeadLetter` is eligible only after the exact marker/action policy validates |
| committed durable no-op | stored result with `NoOp` disposition | `Stored/FreshlyCommitted` | exact empty/non-empty matrix; no synthetic changed ref | action is policy-owned; no generic success shortcut |
| dependency/in-flight known before commit | typed application error or existing ephemeral result path | `Ephemeral { Delayed, ... }` | no result ref, changed/outbox/gap/dead-letter refs | `Retry` only if the exact recovery class permits it |
| malformed pre-handler input | protocol/application error or existing ephemeral path | `Ephemeral { Rejected, ... }` when a receipt is exposed | source ref only when shared header rules allow; no result ref | no wildcard action; producer/schema policy governs |
| unsupported schema before payload parse | existing typed protocol path | `Ephemeral { UnsupportedSchema, ... }` | validated source event may be retained; no payload/result refs | no default retry or dead-letter |
| stored result missing/corrupt after a completed reservation | consistency error | no public stored or ephemeral success surface | never replace with empty/ephemeral result | no C-05 action until exact recovery/probe contract resolves it |
| commit or rollback status unknown | indeterminate application/entry boundary | no legal current receipt | no speculative result/ref | no `Acknowledge`, `Retry` or `DeadLetter` under current C-05 carrier |

An invalid or missing stored result after a `Completed` reservation is not equivalent
to a new malformed delivery. Returning `Ephemeral/Rejected` would erase the fact that
the reservation claims a completed operation and could cause an unsafe second write.
The only allowed output is the canonical consistency/indeterminate path owned by
Step 06/07, with no current-truth reconstruction.

### 11.6 Replay, duplicate, conflict and in-flight matrix

| admission state | exact evidence | I03 behavior | durable mutation | public/action boundary |
|---|---|---|---|---|
| `Acquired` | no compatible logical or secondary reservation | enter the §10 writer lane | allowed only under §10 accepted UoW rules | no receipt before known commit |
| `Replay` | `Completed`, same scope/event, retained-profile digest match and valid result pointer | exact lookup/rehydrate path in §11.2 | none; incoming UoW discarded | `Stored/Replayed`; do not rerun handler; mapper may acknowledge current duplicate only after validation |
| `InFlight` | `Reserved`, same scope/event and retained-profile candidate match | stop without a second writer | none | delayed/in-flight surface; action only through exact recovery policy |
| `Conflict` | same-profile digest differs or identity/scope relation conflicts | stop and preserve the existing row | none | no old result exposed as this request; no alias row or default action |
| completed pointer absent | `Completed` with `stored_result_ref=None` | consistency defect | none | no receipt, no action, no operation rerun |
| pointer target absent | repository returns `None` for exact pointer | consistency defect | none | do not map to delayed/rejected or query current truth |
| pointer target belongs to another operation/actor/event | result/reservation cross-check fails | consistency defect | none | no public surface and no action selection |
| pointer target has wrong kind/schema | exact decoder contract fails | consistency/dependency failure | none | do not try Command/Job decoder or upgrade schema |
| pointer target bytes/digest invalid | rehydrate integrity fails | consistency defect | none | do not log bytes or synthesize a receipt |
| current snapshot/outbox differs from stored refs | mutable current state changed after commit | ignore current state for replay | none | original stored surface remains authoritative for this replay |

`Replay` is not `NoOp`: it reports access to an earlier committed result, regardless
of the original inner outcome. `InFlight` is not `Replay`: no stored result is safe to
return until the owning writer completes and the exact pointer is available. `Conflict`
is not a permission to expose the winning result. These distinctions remain visible
to the application/worker mapper without creating a new durable `Duplicate` outcome.

### 11.7 Corrupt, missing and redaction handling

The exact stored surface is treated as an immutable safety boundary. Any failure in
rehydration is fail-closed and body-free.

| defect | safe diagnostic category | forbidden response |
|---|---|---|
| reservation points to no result | completed-result-missing / consistency category owned by application | return an empty receipt, current state or `Ephemeral/Rejected` success |
| result row missing or duplicated | stored-result persistence consistency category | choose first row, scan another result family or mint an alias |
| result identity/scope/digest mismatch | replay relation consistency category | expose the old surface, overwrite the reservation or rerun I03 |
| unsupported retained schema or wrong result kind | stored-surface compatibility category | decode with a neighboring protocol or silently upgrade bytes |
| serialized bytes malformed, oversized or noncanonical | stored-surface integrity category | print, hash for diagnostics, truncate, repair or reserialize bytes |
| digest mismatch | stored-surface integrity category | trust stored digest, recompute from current DTO or continue with warning |
| receipt field/presence mismatch | Consumer surface consistency category | fill from current snapshot/outbox/H10/gap rows |
| unowned quarantine/dead-letter field | owner-gap/affected category | expose a new wrapper or put raw material into dead-letter metadata |

Only finite error kind, safe operation/consumer token and already-authorized typed
correlation may cross the diagnostic boundary. The serialized result bytes, Identity
context body, safe-summary body, provider response and persistence exception text
never enter log, metric, trace, error detail, receipt or dead-letter output. No
implementation, test run or evidence is implied by this design matrix.

### 11.8 Completion eligibility and transport boundary

The application-to-worker seam has three separate decisions:

1. whether a valid local stored surface exists;
2. which public outcome and access overlay that surface represents; and
3. whether the exact I03 recovery/action policy permits one C-05 action.

The receipt assembler performs only the first two decisions. The worker mapper owns
the third. Its input must include commit certainty, access, original outcome, error
presence, all typed refs and the I03 recovery classification. It must not infer an
action from a boolean success field, an error string, current state, queue metadata or
the presence of a `Replayed` value without validating the inner surface.

| validated local condition | action eligibility rule | local truth rule |
|---|---|---|
| exact `Stored/Replayed` surface | use the fixed replay policy for the current delivery; do not execute I03 again | original result, refs and reservation remain unchanged |
| fresh stored `Accepted` or authorized `NoOp` with known commit | only the exact I03 mapper may authorize acknowledgement | no transport action can roll back or rewrite local facts |
| fresh stored `Rejected`/`Quarantined`/local terminal surface | only a finite per-flow policy may authorize acknowledgement or dead-lettering | required marker/result must already be committed; no action creates the marker retroactively |
| known no-write `Delayed`/dependency/in-flight | `Retry` only when Step 12 recovery classification says it is retryable and loop bounds are satisfied | no result pointer or accepted fact is fabricated |
| malformed/unsupported pre-handler input | no wildcard action; use the registered producer/schema policy | no reservation or local truth is created |
| commit or rollback status unknown | no action is legal with current C-05 carrier | do not claim write/no-write and do not run a second writer |
| action fails after known local commit | probe/replay by the same stable identity under later recovery rules | never roll back, duplicate or rewrite committed snapshot/H10/result/outbox |

The current C-05 carrier has only `Acknowledge`, `Retry` and `DeadLetter`. Therefore
the last two rows remain constrained by `S08-CONSUMER-INDETERMINATE-COMPLETION-01`.
I03 does not add a pending/no-completion type in this section. Until the shared seam
is repaired, an unknown commit probe must remain a fail-closed affected outcome rather
than being represented by a convenient terminal action.

### 11.9 Lossless relation and no-current-truth reconstruction redline

The following relation must hold for every public stored I03 receipt:

```text
reservation.completed
  -> reservation.stored_result_ref == stored_result.result_ref
  -> stored_result.operation == I03
  -> stored_result.replay_surface.kind == ConsumerReceipt
  -> replay_surface.bytes/digest validate
  -> decoded_receipt.result_ref == stored_result.public_result_ref
  -> decoded refs/error/outcome are returned unchanged
  -> only outer result_access may differ between fresh and replay
```

The following are explicit invariant failures, not repair opportunities:

- a result pointer is replaced by an outbox record, H10 record, snapshot ref or public result ref;
- a missing `outbox_refs`, `gap_refs` or `dead_letter_ref` is reconstructed from current rows;
- a replay decodes the current schema instead of the retained stored schema;
- a replay reruns the Identity resolver, freshness mapper, snapshot transition or H10 factory;
- a duplicate response receives new refs, a new cursor, a new trace, a new error or a new outbox item;
- `Replayed` is serialized into stored bytes or used as the original `outcome`;
- a corrupt completed result is downgraded to an ephemeral rejection so the worker can choose an action;
- an application service returns a transport action or the receipt mapper calls a broker API.

### 11.10 §11 closure and affected review

| review item | current conclusion | affected / blocker |
|---|---|---|
| exact reservation-to-result pointer relation | sequence, cross-check and missing-pointer behavior are fixed; no result reconstruction | `R06-F-AFFECT-UOW-01` downstream propagation remains open |
| stored result rehydrate and retained schema decode | exact pointer, kind, schema, bytes, digest and Consumer decoder checks are required | Step 06/07 implementation surface remains design-only; no runtime validation claimed |
| fresh/replay access overlay | `FreshlyCommitted`/`Replayed` are outer invocation values only; inner surface is immutable | `S08-RESULT-ACCESS-LAYER-01` remains downstream affected-use |
| receipt field provenance | consumer/source/outcome/result/changed/outbox/gap/dead-letter/error fields have explicit sources and presence rules | `S08-CONSUMER-OUTBOX-SURFACE-01`; I03 result mapper propagation |
| internal versus public result references | `StoredObservationResultRef` stays private lookup pointer; public `BodyFreeRef` is lossless projection identity | no new owner; no alias allowed |
| replay/duplicate/in-flight/conflict separation | all are distinct; no `Duplicate` durable outcome and no second writer | shared idempotency/recovery propagation remains open |
| corrupt/missing stored result handling | fail closed as consistency/indeterminate; never downgrade or rebuild from current truth | `S08-CONSUMER-INDETERMINATE-COMPLETION-01` where commit certainty is also unknown |
| quarantine and dead-letter surface | only existing owner-provided body-free marker may be exposed; no Step 08 `QuarantineRef` | `S08-CONSUMER-QUARANTINE-REF-01` |
| outbox/gap/ref losslessness | exact stored surface is authoritative; current outbox/gap scans are forbidden | `S08-CONSUMER-OUTBOX-SURFACE-01` |
| completion/action eligibility | application does not choose C-05 action; worker requires validated receipt and recovery class | `S08-CONSUMER-INDETERMINATE-COMPLETION-01` and per-flow action closure |
| new canonical owner blocker discovered | none; §11 only propagates existing Step 06/07/S08-B owners | no new blocker |

### 11.11 Historical S01-S11 bounded-batch stop review

| 检查项 | 结论 |
|---|---|
| exact stored-result lookup是否按reservation pointer、scope/event relation、rehydrate、kind/schema、bytes/digest和Consumer decode顺序闭合 | `pass_with_affected_open`；本批完成I03 §11设计记录，不声称I03整体完成 |
| `FreshlyCommitted`与`Replayed`是否只作为外层access overlay，且不进入stored bytes/digest | pass；inner receipt、outcome、refs和safe error保持lossless |
| internal `StoredObservationResultRef`与public `result_ref: BodyFreeRef`是否保持不可互换 | pass；lookup只用internal pointer，public surface只暴露public projection ref |
| fresh/replay、NoOp、Rejected、Quarantined、DeadLettered、UnsupportedSchema、Delayed、Conflict和InFlight是否有有限surface | pass at design-record level；shared action/no-completion carrier仍affected |
| missing/corrupt/wrong-kind/wrong-digest result是否禁止从current snapshot/outbox/H10/resolver重建 | pass；只允许canonical consistency/affected path |
| receipt字段来源、presence、canonical集合和dead-letter/error共现关系是否记录 | pass；outbox/quarantine source仍由既有affected owner补闭 |
| application是否不返回C-05 action，且unknown commit时不选择terminal action | pass；`S08-CONSUMER-INDETERMINATE-COMPLETION-01`继续open |
| 是否创建新的canonical result、receipt、Duplicate、QuarantineRef、outbox或action owner | no；本节只传播既有owner |
| 是否发现新的上游 blocker | no new blocker；`S08-E-I03-PAYLOAD-SCHEMA-01`与`S08-E-I03-FRESHNESS-OWNER-01`继续`open_upstream_internal` |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03整体尚未计入完成数 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | historical checkpoint；当前由 I03 §12 stop review 承接，不进入I03 §13~§17、I04~I09、S08-F/G或Step09 |
| 当前提交 | 不需要；用户未要求提交 |

上一批恢复点为
`Step08_S08-E_I03_S01-S11_recorded_with_affected_open_waiting_user_before_I03_S12`。
I03 §11 已完成设计记录层面的 exact stored-result / receipt rehydration 边界，
本段仅作历史审计记录；当前恢复点由 I03 §12 承接，正式 `03` 继续冻结。

## 12. I03 protocol error mapping, exception branches and recovery handoff

本节只处理 I03 `ConsumeIdentityObservationContext` 的错误、异常分支和恢复
交接。这里的“§12”是本协议中间产物章节，不等同于全局详细设计
`Step 12` 的正式装配章节。全局错误 owner、`ApplicationError`、
`ObservationRecoveryClass` 和 public `ObservationProtocolErrorSurface` 已在
Step 06 / S08-B 的既有产物中定义；本节只把它们按 I03 的检测点、已发生的
本地写入、receipt 形状和 C-05 handoff 逐项映射。不得在本节复制第二个错误
enum、第二个 recovery enum、generic Consumer disposition 或新的 transport
action。

### 12.1 Authority, scope and mapping order

I03 的错误判定顺序必须先于任何可能改变本地 truth 的下一步。错误只能由
拥有该事实的层产生，外层 mapper 只能做有限映射，不能根据 error text、
`Debug`、provider code、当前 row 或 worker action 反推另一种错误。

```text
trusted worker binding / static I03 slot
  -> contracts envelope and payload admission
  -> application input / digest / idempotency admission
  -> domain relation and transition decision
  -> repository / resolver / UoW operation
  -> stored-result and reservation completion
  -> commit certainty / exact probe
  -> public receipt mapper
  -> worker C-05 action mapper
```

| layer | current owner | I03 responsibility | prohibited behavior |
|---|---|---|---|
| contracts | shared `ProtocolError` and typed envelope/payload factories | validate header shape, typed refs, static operation and registered schema before application orchestration | call repository, infer Identity body, or choose transport action |
| domain | canonical `domain::errors::DomainError` and H10/reference policy owners | reject invalid subject/snapshot relation, state transition, policy basis or body-free invariant | return provider/SQL error, choose retry count or mutate another aggregate |
| application | canonical `application::errors::ApplicationError` | classify idempotency, dependency, CAS, UoW, stored-result and persistence failures | expose raw adapter detail, rebuild stored surface or return C-05 action |
| public protocol | shared `ObservationProtocolErrorCode` / `ObservationProtocolErrorSurface` | project a finite code, safe reason/gap ref and recovery-derived `retryable` bit | serialize enum internals, raw message or unowned ref |
| worker | exact I03 receipt/action mapper and `WorkerError` | decide whether a validated receipt is eligible for one C-05 action | reclassify application errors from text or assume commit state |
| infra adapter | private provider error mapping | immediately map raw failure to an existing `ApplicationError` variant | leak provider body, silently switch store, or write partial truth |

The mapping sequence is fixed:

1. Validate the static I03 slot and trusted actor binding.
2. Validate envelope headers and the registered producer/schema pair.
3. Decode only the canonical upstream payload when its owner and decoder exist.
4. Build the typed I03 input and one canonical digest candidate set.
5. Reserve the exact idempotency relation before entering the writer lane.
6. Apply relation/domain/UoW operations and stage the complete local write set.
7. Validate stored result, reservation completion and commit certainty.
8. Construct the public receipt or typed application error.
9. Let the worker map the validated result plus recovery class to C-05, if and only if
   the current carrier has a legal completion shape.

Failure at a prior stage must not be reinterpreted by a later stage. In particular,
an error after a reservation exists cannot be downgraded to an ordinary malformed
delivery, and a transport action failure cannot roll back a known committed local
UoW.

### 12.2 I03 internal error inventory

The following table is an I03 use-site inventory. The names in the `owner variant`
column are references to current owners, not new declarations.

| detection point | owner variant | I03 trigger | local side-effect rule | default recovery |
|---|---|---|---|---|
| static operation/body binding | `ProtocolError::RouteBodyMismatch` or `ApplicationError::InvalidRequest` | selected slot is not I03, or typed body does not match the exact assembler | no payload interpretation, digest, reservation or UoW | `RetryAfterInputChange` |
| required header/ref validation | `ProtocolError::InvalidEnvelope` plus exact typed-ref variant (`EmptyReference`, `MalformedReference`, `WrongReferenceOwner` or `IncompatibleReferenceKind`) | required source event, producer, source, dedup or typed ref is absent/malformed | no writer lane; preserve only safe header fields allowed by shared ephemeral shape | `RetryAfterInputChange` |
| actor authority | `ApplicationError::Domain(DomainError::ReadNotAllowed)` or exact actor policy result | effective actor is absent, untrusted or not allowed for the I03 collaboration boundary | no payload decode or local mutation | `DoNotRetrySameInput` or `RetryAfterStateChange` according to policy owner |
| producer/schema registration | `ApplicationError::UnsupportedSchemaVersion` | producer is not registered as `Identity`, discriminator is unknown, or schema has no canonical decoder | no payload decode, digest, reservation or marker | `DoNotRetrySameInput` |
| upstream payload owner | `ApplicationError::ReferenceUnavailable` or owner-gap affected result | canonical `IdentityObservationContextPayload` declaration/encoder/registration is absent | do not construct a local substitute DTO or partial input | `RetryAfterDependencyRecovery` only for a proven temporary dependency; otherwise `ManualIntervention`/affected |
| freshness owner | `ApplicationError::ReferenceUnavailable` / `DomainError::ReferenceConflict` mapping | freshness is missing, unknown, incompatible or cannot be related to the subject/source stream | no snapshot transition, H10 or accepted result | `RetryAfterStateChange` or `ManualIntervention` by cause |
| source-version relation | `ApplicationError::Domain(DomainError::ReferenceConflict)` or `PersistenceInvariantViolation` | source version belongs to another stream, comparator is unavailable, or persisted relation disagrees | no version-ordered mutation; do not use time/cursor/row version fallback | `RetryAfterInputChange`, `RetryAfterReload` or `ManualIntervention` by evidence |
| subject/snapshot lookup | `ApplicationError::Domain(DomainError::ReferenceConflict)` / `OwnedStateNotFound` | missing, duplicate or cross-boundary `ReferenceSnapshotState` relation | rollback/discard staged writer; never mint a replacement to hide ambiguity | `RetryAfterStateChange` for genuine absence; `ManualIntervention` for corruption |
| H10 inbound mapper | canonical domain/application mapper result; no local fallback variant | freshness, source version, policy basis and transition proof cannot form one finite decision | no H10 append and no accepted snapshot change | `RetryAfterStateChange` or `ManualIntervention` |
| idempotency conflict | `ApplicationError::IdempotencyConflict` | same logical key/event relation has a different digest or incompatible identity | preserve existing reservation/result; discard incoming writer | `DoNotRetrySameInput` |
| idempotency in flight | `ApplicationError::IdempotencyInFlight` | matching reservation is still `Reserved` and no completed result is available | no second writer and no alias reservation | `RetryAfterStateChange` |
| completed-result lookup | `CompletedReservationResultMissing` / `StoredResultKindMismatch` | completed reservation has no result, wrong kind, wrong operation or invalid pointer | no receipt, no current-truth reconstruction and no handler rerun | `ManualIntervention` |
| domain transition/policy | `ApplicationError::Domain(DomainError::...)` | loaded subject/snapshot does not satisfy the canonical inbound decision | rollback all staged local facts | `DoNotRetrySameInput` or `RetryAfterStateChange` by exact domain variant |
| optimistic relation | `ApplicationError::OptimisticConflict` | expected repository version no longer matches the loaded snapshot | rollback; old expected version is unusable | `RetryAfterReload` |
| temporary read/resolver dependency | `ReferenceUnavailable`, `ResolverUnavailable` or `RepositoryUnavailable` | adapter is unavailable before an accepted local transition | no synthetic snapshot, freshness or result | `RetryAfterDependencyRecovery` |
| deterministic serialization/digest | `SerializationFailed`, `DigestMaterialEncodingFailed` or persisted digest error | canonical body-free bytes cannot be formed or retained bytes fail integrity | rollback before commit; persisted corruption is not rewritten from current truth | `ManualIntervention` for deterministic/integrity defects |
| staged outbox/H10/result invariant | `OutboxInvariantViolation`, `OutboxPayloadMissing/Corrupt`, `PersistenceInvariantViolation` | required same-UoW relation or immutable surface is incomplete/inconsistent | rollback the whole accepted write set; no partial follower | `ManualIntervention` |
| known commit abort | `ApplicationError::CommitFailed` | backend proves the UoW did not commit | no committed result/reservation may be exposed | `RetryAfterDependencyRecovery` only after no-write proof |
| ambiguous commit/rollback | `CommitOutcomeUnknown` / `RollbackFailed` | commit or rollback cannot be classified | no completion action and no speculative result; exact probe only | `ProbeBeforeRetry` or `ManualIntervention` |
| post-commit acknowledgement | `WorkerError::AckFailed` | local commit is known, but broker acknowledgement fails | preserve snapshot/H10/result/outbox; future delivery replays by stable identity | probe/replay under later transport policy |
| post-commit dead-letter handoff | `WorkerError::DeadLetterFailed` | local terminal marker is known, transport dead-letter call fails | preserve committed local marker; do not recreate marker or mutate source truth | probe/replay under transport policy |

`RetryFinalizeOnly` has no current I03 application branch: I03 does not own an
external business effect or an external delivery preparation. It must not be used
as a convenient label for a resolver retry, a broker acknowledgement, or a local
commit retry. `ExternalDeliveryFailed` and `ExternalFinalizeUnknown` remain
outside this Consumer's application-owned truth boundary; if a later shared worker
surface reports them, the worker uses its own exact owner and does not rewrite I03's
stored receipt.

### 12.3 Public error projection for I03

`ObservationProtocolErrorSurface` is assembled only after the error's owner variant
and recovery class are known. `surface_ref` uses the expected static I03 operation
and schema slot even when the payload was rejected before decoding. `reason_ref` and
`gap_ref` are optional only where the existing owner has already provided them;
I03 never mints a reason/evidence/gap ref merely to make an error look complete.

| I03 condition | internal source | public code | public branch | ref/error presence | recovery / `retryable` |
|---|---|---|---|---|---|
| missing/malformed header or typed ref | `ProtocolError::InvalidEnvelope` or exact typed-ref variant (`EmptyReference`, `MalformedReference`, `WrongReferenceOwner` or `IncompatibleReferenceKind`) | `MissingRequiredField` or `InvalidReference` | `Ephemeral { Rejected }` | source event only if safely decoded; error required | `RetryAfterInputChange` / false |
| wrong actor or authority | exact actor/domain policy result | `ActorNotAllowed` | `Ephemeral { Rejected }` | no result ref; error required | `DoNotRetrySameInput` or state change / false |
| producer/schema unknown or ownerless | `UnsupportedSchemaVersion` or affected owner failure | `UnsupportedSchemaVersion` | `Ephemeral { UnsupportedSchema }` | validated source event may remain; no payload/result refs | `DoNotRetrySameInput` / false |
| subject/snapshot reference malformed | exact typed-ref variant or `DomainError::ReferenceConflict` | `InvalidReference` | `Ephemeral { Rejected }` when pre-handler | no result ref; error required | `RetryAfterInputChange` / false |
| required owned snapshot genuinely absent | `OwnedStateNotFound` | `TargetNotFound` | typed ephemeral rejection/delay according to exact source semantics | no fabricated snapshot/result ref | `RetryAfterStateChange` / false |
| same key/event with different digest | `IdempotencyConflict` | `IdempotencyConflict` | `Ephemeral { Rejected }` or formal safe quarantine only if owner policy permits | old result is never exposed as this request; error required | `DoNotRetrySameInput` / false |
| matching reservation still in flight | `IdempotencyInFlight` | `DependencyUnavailable` | `Ephemeral { Delayed }` | source event required; result/ref sets absent; error required | `RetryAfterStateChange` / false |
| temporary resolver/repository unavailable | `ReferenceUnavailable`, `ResolverUnavailable`, `RepositoryUnavailable` | `DependencyUnavailable` | `Ephemeral { Delayed }` when no local accepted fact exists | no synthetic changed/outbox/gap/result refs | `RetryAfterDependencyRecovery` / true |
| domain state or policy rejects mutation | `DomainError::InvalidStateTransition`, `ReservedTransition` or exact policy decision | `InvalidStateTransition` or `PolicyRejected` | `Ephemeral { Rejected }`, or stored negative surface only when explicitly committed | error required; stored result/ref only for an intentional durable negative branch | exact owner class; normally false |
| body-free boundary violation | domain safety/body-free result | `BodyFreeBoundaryViolation` | `Ephemeral { Rejected }` or stored `Quarantined` only with a canonical marker | raw body absent; safe reason required if owned | `RetryAfterInputChange` / false; persisted forbidden material is manual |
| source-version/freshness/snapshot relation conflict | `DomainError::ReferenceConflict`, `OptimisticConflict` or persistence invariant | `VersionConflict` for CAS; otherwise `ConsistencyFailure` | no accepted receipt unless a valid durable negative surface was intentionally committed | no current-row fallback; error required | reload for CAS / manual for corruption |
| completed reservation has missing/corrupt result | `CompletedReservationResultMissing`, `StoredResultKindMismatch`, persistence error | `ConsistencyFailure` | no public `Stored` or synthetic `Ephemeral` success surface | no result ref may be invented; error is safe/operations-visible only | `ManualIntervention` / false |
| known commit abort with no-write proof | `CommitFailed` | `DependencyUnavailable` | no stored receipt; no accepted fact | no result/ref sets | dependency recovery / true only after proof |
| commit or rollback remains unknown | `CommitOutcomeUnknown` / `RollbackFailed` | `CommitOutcomeUnknown` | no legal current `ObservationConsumerReceipt` | no speculative result; error mapping may remain entry-local | `ProbeBeforeRetry` / false; current C-05 has no action |
| known accepted local UoW | no error | none | `Stored/FreshlyCommitted` with original outcome | exact stored refs and error presence matrix | action eligibility only after commit proof |
| exact completed duplicate | no error | none | `Stored/Replayed` with original inner outcome | exact stored refs/error; no new refs | replay policy; no handler rerun |

The public code is a semantic projection, not a one-to-one mirror of every internal
variant. For example, `ReferenceUnavailable` and `ResolverUnavailable` share
`DependencyUnavailable` only when the failure is genuinely temporary and no local
accepted truth exists. A missing or corrupt persisted relation maps to
`ConsistencyFailure`, not to a dependency retry. `retryable` is derived from the
canonical `ObservationRecoveryClass` table; an entry or worker must not set it from
the presence of `Error`, `Delayed` or a transport retry request.

### 12.4 Exception branch and write-visibility matrix

The following matrix is specific to the I03 call chain. “No write” means no durable
I03 snapshot, H10 record, stored result, reservation completion or accepted outbox
snapshot becomes visible. A staged in-memory candidate is not a committed fact and
must be discarded on the listed branch.

| branch | detection point | staged local facts | required handling | audit/event/marker rule | worker handoff |
|---|---|---|---|---|---|
| static route/body mismatch | worker entry / assembler | none | return typed protocol rejection before payload decode | no accepted audit, H10 or outbox | no default action |
| malformed required header | envelope validator | none | return ephemeral `Rejected`; preserve only safe header ref when present | no marker unless an existing safety owner explicitly requires one | exact producer policy |
| unsupported schema/ownerless payload | schema gate | none | return ephemeral `UnsupportedSchema`; do not decode compatible-looking fields | no stale/fresh marker and no normal event | no default retry/dead-letter |
| forbidden or raw body detected | redaction/body-free gate | none; raw body is never staged | reject, or enter an owner-approved body-free quarantine lane | only body-free quarantine/gap marker may be committed; never raw body | action remains worker/policy-owned |
| digest construction failure | canonicalizer before reserve | none | return typed application error; do not mint a new key and retry the handler | no event or accepted audit | no action |
| completed replay | idempotency reserve + exact result lookup | incoming UoW discarded | validate pointer, bytes, digest and receipt, then return original surface | no new H10, outbox, gap or audit fact | replay policy may acknowledge current delivery |
| conflict | idempotency reserve | possibly empty incoming UoW | preserve winning reservation and return conflict surface | no new accepted marker/event | no old receipt exposure |
| in-flight | idempotency reserve | incoming writer not admitted | return ephemeral `Delayed`; never create second reservation | no completion marker | `Retry` only if exact recovery policy permits |
| missing/ambiguous snapshot relation | versioned repository read | no accepted transition | rollback/discard; do not mint replacement or choose first row | no H10 or accepted event | state-change/manual classification |
| freshness/source-version mapper unavailable | relation/decision stage | no accepted transition | fail closed; preserve explicit absent only if canonical policy permits | no false `Fresh`/`Resolved` marker | dependency/state-change classification |
| domain transition rejected | domain/H10 mapper | staged candidates, if any | rollback entire writer UoW | ordinary rejection has no accepted event; formal negative marker only if explicitly owned | exact public rejection mapping |
| snapshot CAS conflict | snapshot save | staged transition and possibly cursor | rollback; reload before a new attempt | no partial H10/outbox/result | `RetryAfterReload` eligibility |
| H10 append or outbox snapshot failure | record/follower staging | snapshot candidate/cursor may be staged | rollback all staged facts; no record-first commit | no partial history or follower | dependency/consistency classification |
| stored result save or reservation completion failure | result/reservation stage | earlier local facts staged | rollback; do not expose `FreshlyCommitted` | no dangling `Completed` reservation | no action |
| known commit abort | UoW commit | all staged facts | return known no-write error only after backend proof | no compensating success event | retry only after dependency recovery and policy |
| commit/rollback unknown | UoW manager/probe | unknown visibility | do not return a terminal receipt or action; probe exact relation | no speculative marker/event | current C-05 no legal completion |
| commit known, ack fails | worker registrar | all local facts committed | retain immutable local facts; map `WorkerError::AckFailed` | do not append duplicate success event | future delivery replays exact result |
| committed dead-letter marker, handoff fails | worker dead-letter registrar | local marker/result committed | retain marker; do not re-run I03 mutation | no raw body or second marker | transport recovery/probe |

No branch may use current snapshot, current H10, current outbox, current resolver
output or current gap table to fill a missing result/error field. The only allowed
post-commit read is an exact identity/result/probe lookup owned by the corresponding
repository or result surface.

### 12.5 Recovery-class handoff for I03

The recovery class describes the next safe posture. It is not a scheduler, retry
counter, broker disposition or operator runbook. The C-05 action remains a separate
worker decision and is legal only when the local commit state and receipt shape are
known.

| recovery class | I03 examples | next owner/action | public `retryable` | hard prohibition |
|---|---|---|---:|---|
| `DoNotRetrySameInput` | unsupported schema, digest conflict, deterministic actor/policy rejection, invalid reserved transition | producer/caller must submit a corrected logical input or formal state change | false | repeat the same payload/key or expose the winning result for a conflict |
| `RetryAfterInputChange` | malformed subject/ref, wrong producer binding, forbidden body, missing required typed field | producer/entry correction creates a new valid attempt; old reservation is not reused unless exact idempotency rules allow it | false | silently default freshness, scope, actor or source version |
| `RetryAfterStateChange` | matching in-flight reservation, adapter disabled, valid reference state not yet available, pending formal policy relation | wait for the owning state/dependency transition, then start a new exact attempt | false | timer-only loop, second writer or fabricated `Accepted` |
| `RetryAfterReload` | snapshot CAS conflict, concurrent reference binding conflict with a valid winner | rollback, reload the canonical `Versioned<ReferenceSnapshotState>` and re-evaluate the whole decision | true | reuse old expected version or apply a stale post-state |
| `RetryAfterDependencyRecovery` | temporary repository/resolver/UoW availability failure, known commit abort after no-write proof | retry after dependency recovery using the same logical operation rules; reserve/digest policy still applies | true | turn unavailable into `Unresolved`, `Fresh`, `Accepted` or a provider result |
| `RetryFinalizeOnly` | no current I03 case | no I03 owner may select this class; later external delivery flows keep their own finalize owner | true only where another owner proves it | repeat I03 resolver/snapshot mutation or external call |
| `ProbeBeforeRetry` | commit outcome unknown, rollback visibility unknown, post-commit transport uncertainty | exact idempotency/result/marker probe first; branch to replay, proven no-write recovery or manual | false | choose `Acknowledge`, `Retry` or `DeadLetter` before probe |
| `ManualIntervention` | completed result missing/corrupt, persisted digest/schema mismatch, broken relation/index, rollback failure without classification | operations/design owner repairs or classifies the persisted defect; no automatic mutation replay | false | rebuild immutable bytes/history from current truth or hide the defect as rejection |

For `RetryAfterReload` and `RetryAfterDependencyRecovery`, `retryable=true` only
means that a later attempt can be valid after its precondition is satisfied. It does
not mean the current worker should immediately return `Retry`. For
`ProbeBeforeRetry`, the public bit remains false because no safe retry decision has
yet been established. `ManualIntervention` likewise remains false even if an
operator may later define a formal recovery operation.

### 12.6 C-05 completion eligibility boundary

The application service returns either a validated `ObservationConsumerResult` /
stored receipt surface or a typed error. It never returns
`InboundConsumerCompletion::{Acknowledge, Retry, DeadLetter}`. The worker mapper
must evaluate all of the following together:

```text
commit_certainty
  + receipt branch (Stored/Ephemeral)
  + inner outcome
  + result_access
  + typed refs and error presence
  + ObservationRecoveryClass
  + exact I03 transport policy
```

| validated condition | C-05 eligibility | required local proof | current affected boundary |
|---|---|---|---|
| `Stored/FreshlyCommitted`, inner `Accepted` or authorized `NoOp` | acknowledgement may be eligible | whole accepted UoW committed and stored surface revalidated | exact per-flow action mapper remains downstream affected |
| `Stored/Replayed`, any original inner outcome | current duplicate delivery may be acknowledged under replay policy | exact reservation/result/bytes/digest/receipt validation; no handler rerun | no durable `Duplicate` outcome |
| stored durable `Rejected` or `Quarantined` | acknowledgement or dead-letter may be eligible only under explicit I03 policy | required result/error/marker and co-presence matrix already committed | no default dead-letter; quarantine ref owner remains affected |
| stored `DeadLettered` | dead-letter may be eligible | local dead-letter marker and stored receipt committed together | transport handoff remains worker-owned |
| ephemeral `Delayed` with retryable dependency class | retry may be eligible after policy/bounds | proven no local accepted write | no immediate loop; action matrix affected |
| ephemeral `Rejected` / `UnsupportedSchema` | no generic action can be inferred | exact producer/schema policy | no action from error text |
| commit or rollback unknown | no C-05 action is legal with current carrier | none; absence of proof is the reason | `S08-CONSUMER-INDETERMINATE-COMPLETION-01` remains open |
| action fails after known commit | do not rerun handler; probe/replay later | stable operation/event/digest/result relation | `WorkerError`/transport recovery is outside application UoW |

The words “may be eligible” are intentional. I03 §12 fixes the safety gate and
recovery classification, but it does not invent the missing no-completion carrier or
close the shared per-flow action policy. Until
`S08-CONSUMER-INDETERMINATE-COMPLETION-01` is repaired, an unknown commit must
remain a fail-closed affected result rather than being coerced into any terminal
action.

### 12.7 Consistency-defect catalog

The following defects are not ordinary caller errors and are not repaired by
re-running I03. Each defect preserves the distinction between an absent pre-handler
input and a broken already-committed relation.

| defect | detection | required result | forbidden repair |
|---|---|---|---|
| completed reservation without `StoredObservationResultRef` | reservation/result relation check | `CompletedReservationResultMissing` -> `ConsistencyFailure` / manual | return ephemeral rejection or rerun mutation |
| result pointer resolves to zero or multiple rows | exact result repository | persistence consistency failure | first-row-wins, global scan or alias mint |
| result kind/schema/operation mismatch | retained result validator | `StoredResultKindMismatch` / `ConsistencyFailure` | use Command/Job decoder or current schema upgrade |
| stored bytes exceed bound, are noncanonical or digest-mismatched | replay surface verifier | integrity consistency failure; bytes remain undisclosed | print, truncate, reserialize or hash raw bytes for diagnostics |
| reservation/result actor, scope, event or digest mismatch | cross-relation validator | consistency failure; no old surface exposure | overwrite reservation or treat as duplicate |
| stored receipt has illegal outcome/ref/error co-presence | exact Consumer decoder/factory | consistency failure; no public receipt | fill missing refs from current tables |
| subject/snapshot relation has duplicate or foreign row | versioned relation lookup | relation consistency failure | choose newest/first, cast IDs or mint replacement |
| source-version comparator is absent where ordering is required | inbound mapper gate | fail closed; no version-ordered mutation | compare lexical token, timestamp, cursor or row version |
| H10 record does not match accepted transition/cursor | record/UoW validation | persistence/record invariant failure | append a corrected record after commit or reload current state |
| outbox snapshot missing/corrupt after accepted source change | outbox/result relation | rollback before commit, or manual if already committed | rebuild payload from current snapshot |
| rollback failure leaves visibility unknown | UoW manager | `RollbackFailed` / `ProbeBeforeRetry` or manual | claim no-write and retry mutation |
| commit probe returns unsupported/unknown | post-commit probe | no completion shape under current C-05 | default acknowledge/retry/dead-letter |

An I03 consistency defect may be reported through a body-free safe diagnostic
surface, but the diagnostic must contain only finite operation/error kind and already
authorized typed refs. It must never contain Identity payload bytes, provider
response, SQL/driver text, stack trace, credentials, endpoint, or a reconstructed
current-state explanation.

### 12.8 Audit, marker and telemetry boundary

Error handling does not create a second audit truth. The following rules apply:

| situation | allowed durable write | not allowed |
|---|---|---|
| pre-admission protocol/authority/schema rejection | none | accepted H10, success outbox, fresh marker or fake result |
| temporary dependency/in-flight delay | none, except an already-owned explicit gap/availability marker if the exact flow says so | synthetic snapshot, resolver success or retry counter in Consumer receipt |
| accepted snapshot transition | the existing H10/reference history, stored result, reservation completion and authorized outbox snapshot in one UoW | Identity truth update or provider acceptance claim |
| formal durable rejection/quarantine/dead-letter | only existing body-free result/marker owners | new `QuarantineRef`, raw dead-letter body or normal accepted event |
| commit unknown or persistence corruption | no speculative compensating event | marker that claims committed or rolled back |
| worker ack/dead-letter failure after local commit | no rollback; preserve committed local facts | duplicate H10/outbox/result or source-truth rewrite |

Runtime logs, metrics and traces may later record the finite error kind and safe
correlation according to the dedicated observability/audit step. This §12 does not
define field names, cardinality policy, alert thresholds or evidence aliases. A log
or metric must not become the only source used to decide whether an I03 mutation was
committed.

### 12.9 I03 §12 closure and affected review

| review item | current conclusion | affected / blocker |
|---|---|---|
| internal error owner | all I03 branches point to existing `ProtocolError`, `DomainError`, `ApplicationError`, `WorkerError` or shared public code owners; no new enum | Step06/07 affected use propagation remains open |
| public error mapping | header, schema, reference, actor, idempotency, dependency, state, version, consistency and commit-unknown conditions have explicit finite mapping | exact per-flow C-05 action mapping remains open |
| recovery classification | each I03 error family maps to one of the existing eight `ObservationRecoveryClass` variants; `retryable` is derived, not guessed | implementation and later Step 13/16 validation not run |
| write visibility | pre-handler branches have no UoW; accepted failures rollback the whole staged set; post-commit transport failures never rewrite local facts | `R06-F-AFFECT-UOW-01` remains open downstream |
| replay and consistency | missing/corrupt completed result is a consistency defect, never a new rejection or current-truth rebuild | `S08-CONSUMER-OUTBOX-SURFACE-01`; `S08-CONSUMER-QUARANTINE-REF-01` |
| upstream payload/freshness | ownerless payload and freshness remain fail closed and are not locally reconstructed | `S08-E-I03-PAYLOAD-SCHEMA-01`; `S08-E-I03-FRESHNESS-OWNER-01` |
| source/snapshot/H10 relation | relation and mapper failure paths are explicit, but canonical comparator/binding/mapper seams remain affected | `S08-E-I03-SOURCE-VERSION-COMPARATOR-01`; `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01`; `S08-E-I03-H10-INBOUND-MAPPER-01` |
| indeterminate completion | no default C-05 action is selected after unknown commit/probe | `S08-CONSUMER-INDETERMINATE-COMPLETION-01` |
| new canonical owner/blocker | no new independent canonical owner found in §12; one existing pseudo-call was corrected to the canonical `ApplicationError::Domain(DomainError::ReferenceConflict)` form | no new blocker |
| implementation/test/evidence | design-only; no code, test run, evidence alias, run id or acceptance signature claimed | not run |

### 12.10 Historical S01-S12 bounded-batch stop review

| 检查项 | 结论 |
|---|---|
| I03 §12是否按检测层、错误owner、public code、写入可见性、恢复分类和C-05 handoff独立记录 | `pass_with_affected_open`；本批只完成I03 §12，不声称I03整体完成 |
| 是否复用了Step06唯一`ApplicationError`和既有八类`ObservationRecoveryClass`，没有复制错误/动作owner | pass；本节只做use-site mapping |
| header/schema/ownerless payload、subject/freshness/source-version、idempotency、domain、CAS、dependency、UoW、stored-result、commit/rollback和transport异常是否有有限分支 | pass at design-record level；canonical upstream/Step07 seams仍affected |
| known pre-commit失败是否禁止partial snapshot/H10/outbox/result/completion，commit unknown是否保持无completion | pass；不声称运行时验证 |
| public `retryable`是否只由recovery class派生，且没有把`RetryFinalizeOnly`误用于I03 | pass；I03当前无external finalize branch |
| application是否不返回C-05 action，unknown commit是否禁止默认`Acknowledge`/`Retry`/`DeadLetter` | pass；`S08-CONSUMER-INDETERMINATE-COMPLETION-01`继续open |
| consistency defect是否禁止从current snapshot/H10/outbox/resolver重建receipt或payload | pass；stored bytes与local committed relation保持权威 |
| audit/log/metric/trace是否保持body-free且不成为business truth | pass；字段级埋点留后续观测审计Step |
| I03既有六项affected是否仍全部开放 | pass；未关闭任何既有affected |
| 是否发现新的上游 blocker | no new blocker；`S08-E-I03-PAYLOAD-SCHEMA-01`与`S08-E-I03-FRESHNESS-OWNER-01`保持`open_upstream_internal` |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03整体尚未计入完成数 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | 停审并等待用户明确确认；确认后只读取并写入I03 §13，不进入I03 §14~§17、I04~I09、S08-F/G或Step09 |
| 当前提交 | 不需要；用户未要求提交 |

本历史批次恢复点为
`Step08_S08-E_I03_S01-S12_recorded_with_affected_open_waiting_user_before_I03_S13`。
I03 §12 已完成设计记录层面的错误映射、异常分支、恢复姿态、consistency
defect和C-05 handoff边界；I03整体、后续I03章节、其他Consumer、Step 09、
Step 11/13/16、repository/adapter实现和测试仍未完成或未运行，正式 `03`
继续冻结。

## 13. I03 concurrency, idempotency and reentry protection

本节只处理 `ConsumeIdentityObservationContext` 的并发资源、幂等身份、重复投递、
重入和 commit-unknown 保护。它把 Step 06 的对象语义、Step 07 的 port/UoW 契约和
本文件 §8~§12 的 I03 use-site 组合成协议级实现约束，不新增第二个 reservation、
digest、result、duplicate outcome、quarantine ref 或 transport action owner。

I03 的并发控制目标不是让 Identity producer 获得写权限，而是保证同一份 body-free
观察输入在 Observability 侧最多形成一个 accepted local writer，并能在重复投递时
返回同一个已存本地结果。以下规则不把 event arrival order、producer timestamp、
source-version token、repository row version 或 trace token 互相替代。

### 13.1 §13 输入、范围和设计红线

| 输入 | 本节消费内容 | 不得越界的权威关系 |
|---|---|---|
| Step 06 `ObservationOperationContext` / `ObservationIdempotencyScope` | logical scope、actor authority、Consumer event identity 与 reservation state | 不由 I03 重定义字段、状态或工厂；Query 不进入 reservation lane |
| Step 06 digest owner | I03 §8 已固定的字段顺序、include/exclude 集合和 `RequestDigestCandidates` | 不从 raw envelope、debug/serde 输出或当前 snapshot 重新 hash |
| Step 07 `ObservationIdempotencyRepository` | `reserve`、`load_by_scope`、`load_by_inbound_event`、`mark_completed` | logical key 与 Consumer secondary key 必须原子建立；不能先插入再补 event alias |
| Step 07 `ObservationStoredResultRepository` | `save_result`、`get_result` 与 immutable replay surface | result 必须先 staging，再完成 reservation；不得从 current truth 重建 |
| Step 07 `ObservationUnitOfWork*` | staged invisibility、CAS guard、one reference cursor、atomic commit/rollback | process-local transaction ref 不是 durable truth；commit unknown 不得被猜成成功或失败 |
| I03 §10~§12 | accepted writer 顺序、错误/恢复分类、C-05 action boundary | application 不返回 `Acknowledge` / `Retry` / `DeadLetter`；unknown commit 无默认 completion |

本节不定义以下内容：数据库 DDL、锁级别产品参数、队列重试次数、scheduler
策略、外部 Identity provider 调用、传输层 broker 语义、Step 14 配置值、Step 16
测试结果或真实 evidence。实现者必须实现下述语义，但不得从未定义的基础设施细节
反推新的 public contract。

### 13.2 I03 并发资源清单

| 资源 | 资源身份 | 真正 owner | 可变性 / 并发控制 | I03 规则 |
|---|---|---|---|---|
| logical reservation | `(ConsumeIdentityObservationContext, effective ActorSafeRef, dedup_key)` | `ObservationIdempotencyRepository` | durable unique key；`Reserved -> Completed`，完成前不可再取得 writer | 这是重复请求的主 admission gate；相同 key 不同 digest 不得覆盖 winner |
| Consumer secondary identity | `(ConsumeIdentityObservationContext, Identity producer family, source_event_ref)` | `ObservationIdempotencyRepository` | 与 logical key 在同一 reserve 决策中唯一约束 | 防止同一 event 更换 dedup key 再次写入；不能作为 logical key 别名 |
| retained request digest | I03 §8 canonical material 的 profile-specific digest | Step 06 digest owner + idempotency store | immutable comparison material；支持既有 row 的 retained profile 读取 | same digest 才可能 Replay；候选不可由 adapter 重算或降级为当前 profile |
| reference snapshot row | `ReferenceSnapshotStateRef` plus returned `ObservationRepositoryVersion` | `ReferenceMaintenanceRepository` / `ReferenceSnapshotState` | in-place expected-version CAS；new snapshot create-if-absent | 必须在 reserve 后读 exact version；CAS 失败不得重跑或覆盖 |
| H10 refresh record | `ReferenceRefreshRecordRef` plus one `ReferenceCursor` | H10 record owner / `ReferenceMaintenanceRepository` | append-only identity and same-UoW visibility | 只随真实 accepted snapshot transition 产生一条；不能由 duplicate 重建 |
| optional outbox pair | `OutboxRecordRef` + `OutboxPayloadSnapshotRef` + event identity | registered outbox owner | immutable pair, same accepted UoW；没有 canonical payload 时为空集合 | publisher 不回查 snapshot 补 payload；duplicate 不再 append |
| stored result | `StoredObservationResultRef` bound to `IdempotencyRef` | `ObservationStoredResultRepository` | immutable append; exact kind/schema/bytes/digest validation | 先 `save_result` 后 `mark_completed`；缺失或错配是 consistency defect |
| UoW handle | `ObservationTransactionRef` | `ObservationUnitOfWorkManager` | one consumed handle；staged rows invisible until commit | 一个 I03 accepted writer 只使用一个 UoW；rollback 不留下可见 partial set |
| reference cursor allocator | one tagged `ReferenceCursor` in a reference mutation UoW | `ObservationUnitOfWork` | one successful allocation per applicable namespace | I03 reference-only branch 只分配 reference cursor；不可借用 source version/row version |
| resolver/read dependency | typed body-free resolver and comparator relation | Step 06/07 canonical resolver/mapper owner | read-only dependency; no durable mutation authority | Replay/Conflict/InFlight 不得调用 resolver；unavailable 不制造 fresh result |
| worker delivery completion | current `InboundConsumerCompletion` carrier | worker C-05 mapper | transport action is after local commit proof | application 只返回 result/error；action 不能反写 local facts |

以下不是 I03 的可写并发资源：Identity profile、credential、membership、role、
lifecycle、authentication result、producer source truth、raw payload、provider body、
transport offset、broker ack state 和 trace metadata。I03 不得通过加锁、CAS 或重试把
这些非拥有事实变成 Observability truth。

#### 13.2.1 Resource ordering invariant

所有 accepted writer 必须保持如下资源顺序；顺序中的每一项只有在前一项通过后才
能被创建或改变：

```text
trusted delivery admission
  -> canonical digest candidates
  -> atomic logical + secondary reservation
  -> exact snapshot/version read
  -> subject/source/version relation proof
  -> canonical freshness/H10 transition decision
  -> snapshot CAS or owner-approved new-snapshot stage
  -> one ReferenceCursor
  -> one H10 append
  -> authorized immutable outbox pair
  -> immutable StoredObservationResult save
  -> reservation mark_completed
  -> one UoW commit
  -> worker completion/action mapper
```

在 `reserve` 返回 `Replay`、`Conflict` 或 `InFlight` 后，流程立即离开 accepted
writer lane。任何实现如果已经打开了 incoming UoW，必须在返回对应 surface 前回滚
该 UoW；这些 outcome 不能通过继续执行 service body 变成 snapshot、H10、outbox 或
result 写入。

### 13.3 I03 并发场景矩阵

| 场景 | 竞争双方 / 资源 | 原子判定与 winner | I03 结果 | 禁止行为 |
|---|---|---|---|---|
| 同一 delivery 的并行处理 | 两个 worker 竞争同一 logical key 和 secondary event identity | 只有一个 `reserve` 返回 `Acquired`；另一方只能得到 `InFlight` 或随后 `Replay` | winner 继续完整 UoW；loser 返回 delayed 或精确 replay | 两个 resolver、两个 snapshot CAS、两个 H10 或两个 outbox |
| 同 logical key、同 digest、不同 source event | producer 重用 dedup key 但投递了另一 event | logical identity 已占用，secondary relation 不一致 | `Conflict` 或既有一致性分类，不暴露 winner surface | 以 dedup key 优先、忽略 source event 或创建 event alias |
| 同 source event、同 producer、不同 logical key | delivery 尝试更换 dedup key | secondary unique identity 先阻止第二 writer | `Conflict`；不得创建第二 reservation | 以新 dedup key 绕过 event 去重 |
| 同 logical key、不同 digest | payload、subject、summary 或 freshness 改变 | retained digest comparison 失败 | `Conflict`，不暴露旧结果、不写任何 local fact | 用当前 digest 覆盖旧 digest 或按字段择优 |
| 同 logical key、同 digest、已 Completed | redelivery 或 client timeout retry | `Replay` 并返回原 `StoredObservationResult` | outer access=`Replayed`；inner outcome/refs/error 不改 | 重跑 resolver、snapshot transition、H10 或 outbox |
| 同 logical key、同 digest、仍 Reserved | first writer 尚未 commit | `InFlight`；第二 writer 没有权限 | delayed/in-flight surface；不创建 completion | 递归等待并在同一 handler 内重入、绕过 reservation |
| reservation 已 Completed 但 result 缺失 | reservation store 与 result store 关系损坏 | exact pointer probe 发现 consistency defect | fail closed / manual recovery 分类 | 从 current snapshot、H10 或 outbox 拼出 receipt |
| 两个 writer 更新同一 snapshot | 不同 source event 或不同 logical scope 指向同一 local snapshot | 各自先 reserve；后读出的同一 version 只有一个 CAS 能成功 | winner 提交；loser 得到 version/conflict failure，不重跑 | reload 后无 expected version 保存、last-write-wins |
| older source version 与 newer transition 竞争 | producer 顺序与本地 CAS 顺序不同 | canonical comparator 先判定 source relation，CAS 再判本地 version | older 只走 owner-approved no-op/degraded/delayed；newer 仍须 CAS | 用 arrival time、cursor 或 row version 替代 source comparator |
| 两个 accepted branch 竞争同一 ReferenceCursor | 同一 UoW 内并发或错误复用 | UoW 只允许一次适用的 reference cursor allocation | 第二次返回既有 ApplicationError；整体 rollback | 分配第二 cursor、复用已 rollback cursor 或静默丢弃 |
| H10 append 竞争同一 record identity | duplicate handler 或 adapter 重放 append | append-only uniqueness + same-UoW relation | 一个 accepted record；另一方 rollback/consistency | append duplicate 后再删除或更新旧 record |
| outbox pair 竞争 | duplicate/并行 accepted branch | outbox identity and payload snapshot uniqueness | 只保留 winner 的 immutable pair | publisher 回查 current state 重建第二 payload |
| worker action 并行 | local commit 完成后多个 completion attempts | action 由 stable stored relation 和 exact mapper 判定 | 可重复 probe/replay；local truth 不变 | action 失败触发第二次 snapshot mutation |
| commit status unknown 后重试 | client/worker 新进程重入同一 operation/key | same key/digest 重新 reserve 并读取已提交关系 | `Replay`、`InFlight`、known-no-write 或 indeterminate | 使用新 key 盲重试、补偿写入或猜测 commit 结果 |
| Query 与 I03 writer 并发 | read service 与 consumer writer 同时访问 | Query 只读 committed boundary；writer 按 CAS 提交 | Query 看到旧或新完整 committed surface | Query 进入 idempotency lane、读取 staged row 或触发 refresh |
| source-version comparator unavailable | resolver/owner 缺失或暂时不可用 | admission/mapper fail closed | delayed/dependency/affected surface | 把 unavailable 当 older/equal/fresh |

#### 13.3.1 Snapshot CAS and reservation are independent guards

`reserve` 只保护一次逻辑操作和一次 Consumer event identity，不保护当前
`ReferenceSnapshotState` 的所有后续变化；snapshot expected-version CAS 也不能
代替 reservation。实现必须同时满足：

1. reservation 成功不等于 snapshot 关系正确；关系、source-version 和 policy gate 仍须
   在 service 中完成。
2. snapshot CAS 成功不等于可以创建第二个 result；result 必须仍绑定本次 reservation
   和同一 UoW。
3. H10 append 成功不等于 snapshot 已提交；record、snapshot、result 和 completion 须由
   同一 commit 证据覆盖。
4. 一个旧 writer 即使在内存中持有有效 post-state，也不能在 commit guard 失败后重新
   读取当前 state 并再次 stage；该调用必须结束为并发冲突或明确的 recovery surface。

### 13.4 幂等键与 digest 矩阵

#### 13.4.1 I03 key layers

| 层级 | canonical key / material | 来源 | 唯一性或比较语义 | 不包含 |
|---|---|---|---|---|
| logical scope | `(ObservationInboundConsumerOperation::ConsumeIdentityObservationContext, effective ActorSafeRef, dedup_key)` | trusted envelope + worker actor + static operation | 主幂等唯一键；同 key 不同 digest 为 Conflict | source event、trace、occurred_at、delivery attempt |
| secondary event identity | `(ConsumeIdentityObservationContext, ObservationProducerFamily::Identity, source_event_ref)` | validated envelope after static binding | Consumer 二级唯一键；同 event 不可换 dedup key | logical actor、local snapshot ref、transport offset |
| request material | operation token, actor, producer, event/source/version, schema, complete subject, optional summary tag/ref, freshness | I03 §8 canonicalizer | semantic digest input；固定顺序和 Option tag | logical dedup key、transport metadata、local effects |
| retained profile candidate | `RequestDigestCandidates` 中与 existing row schema/profile 匹配的 candidate | canonicalizer 一次生成 | reserve 按 row retained profile 比较；不能只比较 write profile | raw bytes 或 adapter 自造 candidate |
| stored replay binding | reservation ref + result ref + operation/actor/digest/event relation | idempotency/result repositories | exact replay relation；缺任何一项都不是安全 Replay | current snapshot/H10/outbox lookup |

`ObservationIdempotencyScope` 的 logical key 仍由 Step 06 owner 定义；I03 不把
`source_event_ref` 塞进 scope，也不把 `dedup_key` 塞进 digest。两者分别解决 delivery
identity 与 semantic request identity，必须同时存在但不能合并。

#### 13.4.2 Digest field order and candidate calculation

I03 digest material 的固定顺序沿用 §8.2：

```text
operation token
-> effective actor_ref
-> producer_family
-> source_event_ref
-> source_ref
-> explicit source_version_ref option
-> schema_version
-> complete subject_ref
-> explicit safe_summary_ref option
-> freshness
```

`ObservationDigestCanonicalizer::request_candidates` 只能在 header、schema、typed
payload、body-free field admission 和 static owner check 后调用一次，并且发生在
本地 snapshot read、UoW mutation 和 reservation 之前。它返回完整的
`RequestDigestCandidates`，供 `ObservationIdempotencyRepository::reserve` 选择适合
retained profile 的候选；service 不得取一个候选后再本地重 hash。

以下值明确排除：`dedup_key`、delivery id、topic/partition/offset、attempt、ack
状态、`occurred_at`、trace、UoW/ref/cursor、repository version、generated snapshot
或 record refs、stored result ref、outbox refs、provider response、raw body 和任何
当前 snapshot 读取结果。排除项一旦进入 digest，会把重试控制事实错误地升级为业务
输入，并使同一 event 无法稳定重放。

#### 13.4.3 Key/digest result matrix

| logical scope | secondary event | retained digest | reserve outcome | writer permission |
|---|---|---|---|---|
| absent | absent | valid candidate set | `Acquired` | one writer may proceed |
| present Reserved, exact relation | present, same relation | equal | `InFlight` | none |
| present Completed, exact relation | present, same relation | equal and result pointer validates | `Replay` | none; exact stored read only |
| present any state | absent or conflicting event relation | equal or unequal | `Conflict` or consistency defect according to repository relation | none |
| present | present | different | `Conflict` | none; do not expose winning result |
| present | present | existing profile unreadable | existing port error classification `PersistedDigestProfileUnreadable` (not a new reserve-outcome variant) | none; no fallback profile |
| absent logical row but event row exists | present | any | secondary conflict/consistency result | none; never attach alias |

如果两个索引读取到的 reservation 不是同一 `idempotency_ref`，这不是普通 duplicate，
而是持久化关系缺陷。I03 必须按 consistency path fail closed，不能用 scope 查询或
event 查询任意一方作为 winner。

### 13.5 Duplicate、Conflict、InFlight 与重入矩阵

#### 13.5.1 Reserve outcome priority

reserve 的原子实现必须先验证完整 logical/secondary relation，再返回一个既有的
`ObservationIdempotencyReserveOutcome`。以下优先顺序只用于解释检测和防止模糊
映射，不创建新 variant：

```text
relation corruption / foreign identity
  -> Conflict or canonical consistency failure
retained digest unreadable
  -> existing port error `PersistedDigestProfileUnreadable` / canonical shared error
same identity + digest + Completed + valid result pointer
  -> Replay
same identity + digest + Reserved
  -> InFlight
no identity collision
  -> Acquired
```

`Replay` 只有在完整结果关系可验证时成立。若 reservation 显示 Completed 但 result
pointer 缺失、wrong kind、wrong schema、wrong digest、wrong actor 或 wrong event，
必须走 consistency defect，不能降级为 `InFlight`、重新 `Acquired` 或普通
`Rejected`。

#### 13.5.2 Duplicate and redelivery behavior

| 重入来源 | admission | service body | returned surface | local write |
|---|---|---|---|---|
| at-least-once event redelivery, exact same delivery material | `Replay` | 不进入 snapshot/H10/resolver 分支 | original stored Consumer receipt + `Replayed` access | none |
| worker timeout after known commit | same logical key/digest re-reserve | 不重跑 handler | exact stored result or existing in-flight result | none |
| parallel retry before first commit | `InFlight` | 不等待并递归执行，不创建 second writer | delayed/in-flight | none |
| same dedup key with changed subject/summary/freshness | digest `Conflict` | 不读取或暴露 winner receipt | conflict | none |
| same event identity with changed actor | secondary relation plus logical mismatch | no alias and no source truth access | conflict/consistency | none |
| completed result relation damaged | exact result probe | no reconstruction | consistency/affected surface | none |
| replay after local transport ack failure | same stable relation | exact replay/probe only | original stored receipt | none |

Replay access is an invocation-level overlay. It cannot alter
`StoredObservationResult` disposition、replay surface、digest、stored timestamp、
outbox refs、H10 refs、gap refs 或 error presence。它也不能因为 delivery attempt
变化而 mint 新的 public result ref。

#### 13.5.3 Reentry protection table

| reentry point | protected relation | required guard | recovery posture |
|---|---|---|---|
| before reserve | static I03 operation, actor and typed event identity | assembler validation and canonical digest construction | reject before UoW/reservation |
| after `Acquired`, before snapshot read | reservation ref, logical scope, secondary event identity | keep one UoW and one private reservation object | any failure rolls back; no retry inside current handler |
| after snapshot read, before stage | snapshot ref + exact repository version + subject relation | domain transition consumes loaded version; no reload | CAS/relation conflict ends writer |
| after stage, before H10 | same post-state + one reference cursor | record factory consumes transition proof | append failure rolls back whole UoW |
| after H10, before result save | H10 transition/cursor and optional outbox pair | result assembler copies staged refs, never lookup | result/stored-surface failure rolls back |
| after result save, before completion | `StoredObservationResultRef` + reservation ref | only `mark_completed` may close reservation | completion failure rolls back; no visible result/completed pair |
| after commit, before action | committed reservation/result relation | worker validates exact stored surface | action retry/probe only; no local rewrite |
| commit probe unknown | operation/actor/key/event/digest relation | no current C-05 no-completion carrier | fail closed and escalate to affected/manual recovery |

There is no I03 recursive "retry current function" path. A retrying caller
re-enters at the public worker boundary with the original operation、actor、dedup key、
event identity 和 canonical digest material。它不得直接调用 domain transition、
复用已消费 UoW、复用 cursor，或把先前 reservation 作为新的 `Acquired` value。

### 13.6 Commit-unknown and post-commit reentry

`CommitOutcomeUnknown` 表示 UoW adapter 无法证明完整 staged set 是否已 durable
commit。它不等于 rollback、`InFlight` 或 success。I03 唯一安全的 retry identity
是原始稳定关系：

```text
(operation = ConsumeIdentityObservationContext,
 effective actor,
 dedup_key,
 producer family,
 source_event_ref,
 request digest)
```

The reentry sequence is fixed:

```text
commit / rollback outcome is unknown
  -> do not mint a new idempotency key, result ref, snapshot ref, H10 ref or outbox ref
  -> do not call resolver, transition owner or H10 mapper again
  -> begin a fresh probe-only UoW or committed read boundary if the owner permits it
  -> load exact reservation by logical scope
  -> load exact reservation by inbound event identity
  -> require both paths to identify the same reservation
  -> compare retained digest/profile and reservation state
  -> if Completed: load and validate exact StoredObservationResult
  -> if Reserved/InFlight: return delayed/in-flight or manual reconciliation surface
  -> if absent and known no-write is proven: use only the existing recovery policy
  -> if relation/result is corrupt, unknown or unsupported: no completion/action
```

Probe rules:

| probe finding | permitted behavior | prohibited behavior |
|---|---|---|
| Completed + exact result validates | return original stored surface as replay; no handler rerun | create a second result or modify access into durable outcome |
| Reserved and another writer is demonstrably active | delayed/in-flight; no second writer | wait inside service until it completes, then mutate |
| absent and adapter proves no durable commit | known no-write recovery according to existing class | assume absence merely because one read missed a row |
| both scope/event paths disagree | consistency defect/manual recovery | choose first path or repair alias in I03 |
| result missing/wrong kind/wrong digest | consistency defect/manual recovery | rebuild from current snapshot/H10/outbox |
| probe unsupported/unknown | no `InboundConsumerCompletion` | default `Acknowledge`, `Retry` or `DeadLetter` |

`PersistedDigestProfileUnreadable` is an error classification from the existing
idempotency port/error surface; it is not added to
`ObservationIdempotencyReserveOutcome`.

The current shared C-05 surface has no typed no-completion representation for the
last case. This remains `S08-CONSUMER-INDETERMINATE-COMPLETION-01`; §13 records the
required fail-closed behavior but does not invent a carrier. A commit-unknown branch
therefore cannot be counted as completed protocol behavior or as a test result.

### 13.7 Accepted writer and no-write reentry rules

The following rules are mandatory for the one accepted writer sequence:

1. `reserve` is the first durable-admission operation. No snapshot read may be used to
   decide whether the logical operation is new.
2. Exact snapshot/version read and relation proof happen before any domain transition
   or cursor allocation.
3. The canonical freshness/source-version mapper is called at most once for an accepted
   attempt. Its decision and creation proof are carried forward; enum-name matching is
   not a substitute for the mapper.
4. A real snapshot transition stages one post-state, allocates one `ReferenceCursor`
   and appends one H10 record. A no-mutation branch allocates none of these.
5. Outbox data, when authorized, comes from the same staged transition and immutable
   encoder snapshot. No current-state read is permitted after staging to fill refs or
   bytes.
6. `StoredObservationResult` is staged before `mark_completed`; a reservation with a
   visible result pointer but no committed result is invalid.
7. The UoW is committed once. A known failure rolls back the complete staged set; a
   transport action failure after commit never reopens the writer lane.
8. A duplicate、conflict、in-flight、consistency defect 或 commit-unknown branch never
   invokes the accepted writer sequence a second time in the same delivery.

The no-write Query rule is equally strict. Concurrent Query reads may observe either
the previous or next committed snapshot boundary according to the Query owner, but
they may not create an idempotency reservation、acquire a UoW、call the reference
refresh mapper、append H10、mark stale、rebuild a projection 或 change a Consumer
receipt。

### 13.8 Fake, controlled and durable adapter parity

The design is not closed merely because a fake can return `Acquired`. Each adapter
class must preserve the same observable semantics:

| contract surface | fake obligation | controlled/failure-injection obligation | durable obligation | parity failure |
|---|---|---|---|---|
| logical/secondary uniqueness | atomically classify both keys in private staged state | inject collision, duplicate-row and relation mismatch outcomes | enforce both unique relations in one transactional reserve | logical row first, event alias later |
| digest profile comparison | retain all candidates and compare the row's profile | inject unreadable retained profile and mismatched candidate | decode the same persisted profile and reject missing candidate | compare only current write digest |
| reservation lifecycle | expose only `Reserved -> Completed`; outcomes are ephemeral | inject `InFlight`, `Replay`, `Conflict` without durable state mutation | CAS completion with result relation | persist `Replay`/`Duplicate` as a state |
| result-before-complete | reject completion unless result staged in same private UoW | fail `save_result` and `mark_completed` independently | use transaction/constraint relation | visible `Reserved + result_ref` |
| snapshot CAS | exact expected version and subject relation | inject stale version and duplicate relation | enforce predicate in same transaction | last-write-wins or reload-and-save |
| cursor semantics | one reference cursor, no reuse after rollback | inject second allocation and rollback gap | allocate one namespace under same UoW | dual cursor or reused gap |
| H10 append | require accepted transition/post-state | inject append mismatch/duplicate | append-only durable relation | record-first or current-state reconstruction |
| staged visibility | committed reads cannot see staged rows | expose failure at every stage without leaking partial row | isolate transaction and indexes | global map mutation before commit |
| commit/rollback ambiguity | distinguish known failure from unknown | inject unknown and unsupported probe | map driver ambiguity to existing carrier | resolve unknown to success/absence |
| replay | load exact immutable stored bytes and access overlay | inject missing/wrong-kind/corrupt result | exact pointer lookup with body-free validation | rerun resolver or current lookup |
| redaction | reject forbidden body in fixture/Debug/diagnostic path | inject forbidden-body input and verify zero write | enforce same body-free persistence boundary | provider/body text leaks into digest or receipt |

No row in this table claims that a fake、controlled adapter 或 durable adapter exists or
has passed. It is an implementation parity contract to be consumed by later
persistence、test and implementation-handoff steps.

### 13.9 Step 09 handoff contract

I03 only hands one named flow to Step 09:
`ConsumeIdentityObservationContextFlow`。
The flow must consume the exact `ConsumeIdentityObservationContextInput` and preserve
the following order without introducing a generic Consumer flow:

```text
validated input
  -> construct operation context already embedded by assembler
  -> begin UoW
  -> reserve logical + secondary identities
  -> branch Replay / Conflict / InFlight
  -> exact snapshot/version read and relation proof
  -> canonical freshness/source-version/H10 decision
  -> stage accepted snapshot, cursor, H10 and authorized outbox
  -> save stored result
  -> mark reservation completed
  -> commit once
  -> return application result to worker C-05 mapper
```

Step 09 must be able to point every callable in that flow back to Step 07:

| flow callable seam | Step 07 source | §13 requirement |
|---|---|---|
| `ObservationUnitOfWorkManager::begin/commit/rollback` | UoW port | one handle, staged invisibility, known/unknown commit distinction |
| `ObservationIdempotencyRepository::reserve` | idempotency port | logical and secondary uniqueness are one decision |
| `ObservationIdempotencyRepository::load_by_scope` / `load_by_inbound_event` | replay/probe port | exact cross-index relation; no first-row choice |
| `ReferenceMaintenanceRepository::get_snapshot_with_version` | reference read port | expected version comes from exact committed read |
| `ReferenceMaintenanceRepository::stage_snapshot` | reference write port | one CAS or owner-approved create branch |
| `ObservationUnitOfWork::assign_reference_cursor` | UoW technical port | at most one applicable reference cursor |
| `ReferenceMaintenanceRepository::append_refresh_record` | H10 append port | same transition/post-state and same UoW |
| authorized outbox staging callable | outbox port, only when payload owner exists | immutable pair or explicit empty refs |
| `ObservationStoredResultRepository::save_result/get_result` | stored-result port | exact immutable surface, no current-truth reconstruction |
| `ObservationIdempotencyRepository::mark_completed` | completion port | only after result staging |

The Step 09 flow cannot add a resolver call on Replay, select a transport action in the
application service, or use a second UoW for H10/result completion. Any missing callable
or insufficient return surface must remain an affected item rather than being invented
in the flow document.

### 13.10 §13 closure and affected review

| review item | current conclusion | affected / blocker |
|---|---|---|
| mutable resources | reservation, snapshot CAS, H10 append, outbox pair, stored result and UoW are separately listed with owners | `R06-F-AFFECT-UOW-01` downstream propagation remains open |
| logical and secondary identity | exact logical scope and Consumer event identity are established atomically; no alias row | `S08-SOURCE-EVENT-REF-OWNER-01` use propagation remains open |
| digest | I03 field order, candidate calculation, retained-profile comparison and exclusion redlines are fixed | `S08-E-I03-DIGEST-ORDER-01` remains open until shared propagation |
| duplicate/conflict/in-flight | Replay, Conflict and InFlight remain incoming outcomes; exact result validation precedes Replay | shared Consumer result/action propagation remains open |
| snapshot concurrency | reservation and expected-version CAS are independent gates; stale writer cannot reload/replay | `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` remains open |
| source-version/freshness | no local ordering or default freshness; canonical comparator and mapper are required | `S08-E-I03-SOURCE-VERSION-COMPARATOR-01`; `S08-E-I03-FRESHNESS-OWNER-01`; `S08-E-I03-H10-INBOUND-MAPPER-01` |
| result-before-complete | exact `save_result -> mark_completed` relation is mandatory in one UoW | `S08-CONSUMER-OUTBOX-SURFACE-01`; `S08-CONSUMER-QUARANTINE-REF-01` |
| commit unknown | same-key exact probe only; unsupported/unknown has no C-05 action under current carrier | `S08-CONSUMER-INDETERMINATE-COMPLETION-01` |
| reentry | no recursive writer retry, no new key, no ref reuse, no resolver rerun on replay | implementation and Step 16 verification not run |
| adapter parity | fake/controlled/durable obligations are identical by contract; no implementation result claimed | `R06-F-AFFECT-UOW-01`; later adapter/test work |
| Step 09 handoff | one named I03 flow and callable-to-port table recorded | `03-RPR-S09-PER-FLOW` remains open |
| new canonical owner/blocker | §13 found no independent owner gap; all seam names point to Step 06/07/shared owners | no new blocker |

### 13.11 Historical I03 §13 bounded-batch stop review

| 检查项 | 结论 |
|---|---|
| §13 是否逐项覆盖并发资源、logical/secondary key、digest、duplicate/conflict/in-flight、reentry 和 commit-unknown | `pass_with_affected_open`；本批只完成 I03 §13，不声称 I03 整体完成 |
| reservation、snapshot CAS、H10 append、outbox、stored result 和 UoW 是否保持独立 owner 与明确顺序 | pass at design-record level；`R06-F-AFFECT-UOW-01` 继续 open |
| same digest duplicate 是否只读取 exact stored result 并使用 `Replayed` overlay | pass；不重跑 resolver、snapshot、H10 或 outbox |
| same key/different digest、same event/different key 和 cross-index disagreement 是否禁止覆盖或 first-row-wins | pass；冲突/一致性路径保持 fail closed |
| digest 是否可由 typed I03 material 计算，且排除 dedup、trace、occurred_at、transport 和 local effects | pass；`S08-E-I03-DIGEST-ORDER-01` 继续 open for propagation |
| snapshot expected-version CAS 是否不能被 reservation 或 reload 替代 | pass；subject/snapshot relation affected 继续 open |
| commit unknown 是否只允许原 key exact probe，且当前不选择任何 C-05 terminal action | pass；`S08-CONSUMER-INDETERMINATE-COMPLETION-01` 继续 open |
| fake、controlled、durable 是否有相同的唯一性、CAS、staged visibility、one-cursor、result-before-complete 和 unknown 语义 | pass at contract level；未声称实现或测试通过 |
| Query repeated read 是否明确 zero-write 且不进入 I03 reservation lane | pass；I03 不拥有 Query 写权限 |
| Step 09 是否有唯一 `ConsumeIdentityObservationContextFlow` handoff 且每个 callable 可回指 Step 07 | pass at handoff-record level；`03-RPR-S09-PER-FLOW` 仍 open |
| 是否创建新的 enum、result、Duplicate、QuarantineRef、action 或 canonical owner | no |
| 是否发现新的上游 blocker | no new blocker；`S08-E-I03-PAYLOAD-SCHEMA-01` 与 `S08-E-I03-FRESHNESS-OWNER-01` 保持 `open_upstream_internal` |
| 当前协议计数 | 保持 `32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60` 无条件 complete；I03 整体尚未计入完成数 |
| 正式文档、实现、测试、evidence、run_id 和验收签署 | 均未生成或声称；正式 `03` 继续 frozen |
| 下一动作 | historical checkpoint；当前由 I03 §14.1~§14.6 stop review 承接，不得把本节门禁当作 current 恢复点 |
| 当前提交 | 不需要；用户未要求提交 |

本历史批次恢复点为
`Step08_S08-E_I03_S01-S13_recorded_with_affected_open_waiting_user_before_I03_S14`。
I03 §13 已完成设计记录层面的并发资源、幂等键/digest、重复与冲突、重入、
commit-unknown、适配器语义对齐和 Step 09 handoff；I03 整体、后续 I03 章节、
其他 Consumer、Step09、Step11/13/16、repository/adapter 实现和测试仍未完成或未
运行，正式 `03` 继续冻结。

## 14. I03 协议级可观测结果、审计投影与安全边界

本节把 `ConsumeIdentityObservationContext` 已经确定的输入、redaction、UoW、
stored result、replay、错误和 no-write 语义，收窄为本协议可落码的观测契约。
本批已写入 §14.7~§14.12：I03 专属 metrics、durable audit / H10 触发矩阵、
evidence linkage、retention marker、report handoff 的非拥有边界，以及所有结果
分支的 closure matrix。§14.1~§14.6 已在上一批完成；I03 §15~§17 仍未写入，
不得把本批状态解释为 I03 或 Step 08 整体完成。

### 14.1 范围、truth owner 与非 owner

| 关注面 | I03 可记录或改变的内容 | 唯一 owner / 落点 | I03 明确不拥有 |
|---|---|---|---|
| runtime log | 本次 I03 调用的有限阶段、结果、错误分类、恢复分类和安全关联 | worker / application / infra telemetry facade；out-of-band | 业务事实、Identity body、transport truth |
| runtime metric | I03 调用、幂等结果、关系冲突、UoW 和提交结果的计数或耗时 | telemetry facade；低基数标签 | retry authority、freshness truth、retention、evidence |
| runtime trace / span | trusted `trace_ref` 的传播、调用父子关系和阶段结果 | runtime tracing backend；不落 durable span row | `CorrelationContext`、`CausationRef`、actor authorization、commit proof |
| accepted local observation | Observability reference snapshot 的本地状态变化及其同批引用 | `ReferenceSnapshotState` owner、`ReferenceMaintenanceRepository` | Identity subject/profile/lifecycle/membership/role truth |
| accepted local history | 与同一 snapshot transition 配对的一个 H10/reference history record | `ReferenceRefreshRecord` / H10 owner | Identity event history、provider success、source audit |
| stored Consumer result | 对本次 accepted 或显式 durable no-op 的不可变 receipt/result surface | `ObservationStoredResultRepository`、result owner | 通过 current snapshot 重建 receipt；新的 duplicate outcome |
| idempotency completion | logical scope、secondary event identity、stored result pointer 的完成关系 | `ObservationIdempotencyRepository` | telemetry-only replay、第二份 reservation、业务 truth alias |
| outbox snapshot | 只有 flow 明确授权时，和 accepted transition 同批生成的 immutable propagation snapshot |既有 outbox owner / UoW | 从日志、span 或 current truth 重建 payload |
| evidence linkage | I03 不因收到 Identity context 而创建或更新 linkage | `EvidenceLinkage` / evidence owner | evidence body、evidence alias、审计证明或 authenticity verdict |
| retention marker | I03 不因接收、replay、stale 或 rejected 分支创建 retention state | `RetentionMarker` / `ActiveReferenceProtectionRef` owner | retention state machine、删除、保留天数、cleanup authorization |
| report handoff | I03 不创建、交付或 finalize report handoff | `ReportHandoffRecord` / report owner | report verdict、external delivery truth、真实 run id、signoff |
| no-write fact | I03 只执行既有 no-write gate；不因一条 telemetry 自动追加 violation | `NoWriteViolationRef` / `GapStateRef` 既有 owner | 用日志证明 source 已修复或伪造 violation record |

I03 的 `Accepted` 观测结果只能表示 Observability-owned reference observation UoW
已经以已知成功提交。它不表示 Identity truth 发生改变，也不表示 producer 的
source version 已被接受、resolver/provider 已成功、消息已被 ack、evidence 已
建立或 report 已交接。`Replayed` 只改变调用级 access overlay；它不产生新的
logically accepted audit、snapshot、H10、outbox 或 evidence fact。

### 14.2 三层观测与审计投影边界

I03 使用以下三层分离，层与层之间不允许用观测数据互相补事实：

| 层 | I03 内容 | 写入时点 | 失败语义 | 禁止替代 |
|---|---|---|---|---|
| Layer A: runtime telemetry | structured log、counter、histogram、runtime span | 在对应语义结果确定后；pre-write 分支可记录 reject/error | sink 失败只影响 telemetry；不改变业务结果；禁止递归重试 | 不替代 H10、stored result 或 commit proof |
| Layer B: local observation truth | snapshot transition、expected-version CAS、H10/reference history、stored result、reservation completion、授权 outbox snapshot | accepted writer 的同一 UoW | mandatory owner write 失败则整体 rollback；commit unknown 保持 indeterminate | 不由 log/metric/span 重建 |
| Layer C: downstream projection / handoff | evidence index input、retention protection、report handoff、query/maintenance projection | 由各自后续 owner 的正式 flow 触发 | 缺输入或 relation 时 fail closed；不由 I03 旁路创建 | 不把 I03 receipt 当 evidence、retention 或 report |

Layer A 的 `accepted` 日志或 span 必须在 Layer B 已知提交后才允许发出；但
Layer A 的发出成功不能反向证明 Layer B 已提交。Layer B 的 H10 record 是本地
reference refresh history，不是 Identity source audit。Layer C 只能消费已提交的
body-free refs 和既有 relation，不得读取 I03 原始 payload 或从 runtime telemetry
拼装 material。

I03 的 accepted writer 观测顺序固定为：

```text
validated header / payload owner
  -> operation context and digest candidates
  -> reservation outcome
  -> subject / snapshot / freshness relation decision
  -> staged snapshot and H10 / authorized outbox
  -> stored result
  -> reservation completion
  -> known UoW commit
  -> accepted log / metric / span end
```

`Replay`、`Conflict`、`InFlight`、ownerless payload、unsupported schema、relation
failure、commit-unknown 和 Query/no-write 不得走 accepted audit wording。它们可有
Layer A 的有限 telemetry，但不能因记录 telemetry 而改变 Layer B 或 Layer C。

### 14.3 Correlation / trace 传播和字段来源

#### 14.3.1 来源与语义分离

| 字段 | canonical 来源 | I03 允许用途 | 不得承担的语义 |
|---|---|---|---|
| `trace_ref` | 已验证 inbound envelope metadata | 进入 `ObservationOperationContext`；作为 I03 runtime span 的 trusted parent/correlation metadata；只有既有 owner schema 明确允许时才复制到 committed marker | actor、source event、dedup、digest、subject/snapshot relation、commit proof |
| `CausationRef` | 已验证的 correlation input / existing correlation object | 仅在 canonical correlation owner 已提供时传播 | 从 span parent、route、时间或 trace 字符串推导 |
| `CorrelationContextRef` | 已提交 `CorrelationContext` owner | 仅在已有 relation 被 I03 输入或 owner accessor明确提供时引用 | 因为有 trace 就 mint context；证明 Identity truth 或 freshness |
| `source_event_ref` | Identity envelope header | secondary inbound event identity 和 stored receipt relation | trace id、dedup key、broker offset、subject id |
| `source_ref` | common envelope header | source boundary relation | source event、subject、snapshot 或 provider body |
| `source_version_ref` | optional Identity envelope header | opaque same-source version input，供 canonical comparator 使用 | `occurred_at`、local cursor、repository version、freshness |
| `dedup_key` | trusted delivery metadata | logical idempotency scope | digest、trace、event identity或 attempt number |
| `actor_ref` | trusted C-05 worker delivery | effective local actor and authorization scope | payload subject、producer、process identity或 transport peer |

`trace_ref` 缺失时，runtime facade 可以建立 process-local root span；该 local span
不得回写 `ObservationOperationContext.trace_ref`，不得进入 request digest、
reservation identity、stored result、snapshot relation 或 H10 creation proof。
`trace_ref` 存在时也只沿已验证的 operation context 传播；不得从它创建
`CorrelationContext`、`CausationRef`、`EvidenceLinkage` 或 `RetentionMarker`。

#### 14.3.2 I03 parent-child span boundary

```text
trusted worker / inbound span (optional parent)
  -> observability.consumer
       -> observability.idempotency.reserve
       -> observability.reference_relation
       -> observability.reference_transition (accepted writer only)
       -> observability.uow
            -> observability.reference_repository
            -> observability.stored_result
            -> observability.idempotency.complete
       -> observability.consumer.rehydrate (Replay only)
  -> worker completion/action boundary (outside I03 application truth)
```

父子 span 只描述 runtime 调用关系。`observability.uow` 的结束状态由真实 UoW
adapter outcome 映射；`observability.consumer` 的最终结果由 I03 typed result/error
映射，不能由 span exporter 的 flush、parent status 或 sink ack 改写。Replay 不建立
transition/H10/outbox child span；它只建立 exact stored-result rehydrate 的只读
span。

### 14.4 Redaction 与安全字段白名单

#### 14.4.1 Channel 白名单

| material | log | metric label | span attribute | I03 durable surface |
|---|---|---|---|---|
| finite `operation_name`, `operation_family`, `phase` | allow | allow | allow | 仅在 owner schema需要时 |
| finite `result_kind`, `error_kind`, `recovery_class` | allow | allow | allow | 仅复制到既有 result/history字段 |
| `producer_family=Identity`, supported `schema_version` | allow | allow | allow | envelope/result已有字段才保留 |
| `trace_ref` | restricted safe field | deny | allow as propagated context | 仅已有 snapshot/record字段允许时 |
| `CausationRef`, `CorrelationContextRef` | restricted by owner relation | deny | restricted | 仅已有 correlation/history relation |
| `subject_ref`, `source_ref`, `source_event_ref` | deny by default; issue-specific safe ref only | deny | restricted only at approved relation cut | accepted owner record/receipt按既有schema |
| `safe_summary_ref`, `snapshot_ref`, `H10 ref`, `result_ref`, `outbox_ref`, `gap_ref` | restricted per row | deny | restricted per row | 只在对应 owner已保存时 |
| `source_version_ref`, `dedup_key`, request digest candidates | deny | deny | deny | 只在 reservation/envelope/result owner内部 |
| `actor_ref` | deny | deny | deny | 仅既有 mandatory audit/history字段 |
| duration、bounded count、changed/outbox count | allow | metric value / allow bounded label only | allow | 仅已有 result/report count字段 |
| raw Identity payload、safe-summary body、provider response、raw event body | deny | deny | deny | deny |
| endpoint、topic、partition、offset、credential、token、route、SQL、stack | deny | deny | deny | deny |
| real `run_id`、evidence alias、verdict、signoff | deny | deny | deny | deny |

`source_event_ref` 在 Consumer receipt 和 durable reservation 中可以保留，但不
能因为它可安全持久化就自动进入日志、metric label 或 span attribute。日志和 span
只在本表明确列出 safe field 的切口输出；metric 永远不输出任何 ref、key、digest
或 token。

#### 14.4.2 先 allowlist、后序列化

每个 I03 埋点必须执行以下顺序：

1. 从 typed operation/result/error/context 中选择固定字段集合。
2. 对每个候选字段执行 owner、visibility 和 body-free safe-ref 检查。
3. 只将通过检查的有限值交给 telemetry facade；禁止先序列化完整 input 或 error。
4. 若字段不在白名单、字段 owner 不可证明或 redaction 失败，则抑制该字段或整条
   signal，并只增加非递归 suppression counter（若该 counter owner 已存在）。
5. 不以 hash、digest、base64、截断文本或 debug representation 绕过 forbidden-body
   规则；不输出 fallback error dump。

Telemetry sink unavailable、field rejected 和 self-recursion 都是 Layer A 的
运行时问题。它们不能调用 `ObservationInboundEventService`、任何 Command、
`RecordNoWriteViolation` 或 H10 flow 来“记录观测失败”；原 I03 业务分支按 §12/§13
既有语义继续结束。

### 14.5 I03 日志埋点表

下表中的字段名沿用 Step 15 的有限词表，不创建 I03 专属 telemetry object 或
generic enum。`trace_ref?`、`issue_ref?` 和 owner ref 只有在 §14.4 白名单检查
通过时才可出现。

| 位置 | 级别 | 允许字段 | 观测目的与硬约束 |
|---|---|---|---|
| I03 worker slot selected | `debug` | `operation_name`, `operation_family=consumer`, `phase=entry`, `producer_family`, `trace_ref?` | 证明进入静态 I03 slot；不记录 envelope、event ref 或 payload |
| header validation rejected | `warn` | `operation_name?`, `phase=validate`, `error_layer=contracts`, `error_kind`, `issue_ref?` | 证明 header-before-payload 失败；不得出现 accepted/result/outbox ref |
| payload owner/schema unavailable | `error` | `operation_name`, `phase=validate`, `error_layer=contracts`, `error_kind`, `issue_ref?` | 记录既有 owner gap 的 fail-closed 分类；不把三个字段拼成 payload 或保存 body |
| forbidden body or unknown field detected | `error` | `operation_name`, `producer_family`, `phase=validate`, `error_kind`, `issue_ref?` | 只记录检测类别；绝不记录 body、body hash 或 decoder dump |
| I03 input assembled | `debug` | `operation_name`, `phase=validate`, `result_kind=validated`, `trace_ref?` | 证明 typed input 完成；不记录 digest candidates、subject fields 或 source version |
| digest candidates constructed | `debug` | `operation_name`, `phase=validate`, `result_kind=prepared` | 证明 canonicalizer 调用一次；不得输出 digest、dedup、payload bytes 或 profile material |
| reservation acquired | `debug` | `operation_name`, `phase=reserve`, `result_kind=acquired` | 标识 accepted writer 候选；不说明 snapshot 已改变，也不记录 key |
| reservation replay | `info` | `operation_name`, `phase=reserve`, `result_kind=replay`, `result_ref?` | 证明进入 exact stored-result lookup；不得重跑 resolver、transition、H10 或 outbox |
| reservation conflict / in-flight | `warn` | `operation_name`, `phase=reserve`, `result_kind`, `recovery_class`, `issue_ref?` | 区分冲突和并发占用；不泄漏 winner、key 或 retained digest |
| subject/snapshot/freshness relation read | `debug` / `warn` | `operation_name`, `phase=load`, `result_kind`, `error_kind?`, `recovery_class?`, `issue_ref?` | 记录 typed relation outcome；不用 log 推导 current truth 或创建 marker |
| canonical freshness/H10 decision | `debug` / `warn` | `operation_name`, `phase=transition`, `result_kind`, `error_kind?`, `reason_ref?` | 记录 mapper 的有限决定；不把 freshness label当 Identity state或 H10 proof |
| snapshot CAS or transition staged | `debug` | `operation_name`, `phase=persist`, `result_kind=staged`, `cursor_kind?` | 证明 owner transition 已进入同一 UoW；不提前写 accepted |
| H10/reference history staged | `debug` | `operation_name`, `phase=persist`, `result_kind=staged`, `record_kind=reference_refresh` | 只说明既有 H10 record 与 transition 配对；不称为 Identity audit |
| stored result staged before completion | `debug` | `operation_name`, `phase=persist`, `result_kind=stored`, `result_ref?` | 证明 result-before-complete 顺序；不从 current state补 receipt |
| reservation completed | `debug` | `operation_name`, `phase=complete`, `result_kind=completed` | 仅记录 staged completion call；在 commit 前不得写 accepted |
| known UoW commit | `info` | `operation_name`, `phase=commit`, `result_kind=accepted`, `result_ref?`, `changed_count`, `outbox_count`, `duration_ms` | 只在整个 accepted UoW已知提交后记录；accepted仅指本地 observation |
| known rollback / domain rejection | `warn` | `operation_name`, `phase=rollback`, `result_kind=rejected`, `error_kind`, `recovery_class?` | 证明没有 partial snapshot/H10/outbox/result；不得追加 generic audit |
| commit or rollback unknown | `error` | `operation_name`, `phase=commit` or `rollback`, `result_kind=indeterminate`, `recovery_class`, `issue_ref?` | 保持无 completion 语义；不得记录 accepted/failed certainty或默认 action |
| exact replay rehydrated | `info` | `operation_name`, `phase=rehydrate`, `result_kind=replayed`, `result_ref?`, `duration_ms` | 证明原 stored surface 校验通过；不创建新 refs 或 durable outcome |
| stored result missing/corrupt | `error` | `operation_name`, `phase=rehydrate`, `error_kind`, `recovery_class=ManualIntervention`, `issue_ref?` | 记录 consistency defect；不得打印 bytes 或重建 receipt |
| worker ack after local result | `debug` / `warn` | `operation_name`, `phase=ack`, `result_kind`, `error_kind?`, `result_ref?` | transport action在 I03 truth之外；ack failure不得重开 UoW或重复 H10 |
| telemetry field/sink/self-recursion guard | no same-sink log | `phase=telemetry`, fixed suppression reason counter only | 禁止回调自身 Consumer、Command、H10 或 violation flow |

### 14.6 I03 trace / span 切口表

| Span 名称 | 开始边界 | 必要属性 | 结束语义 |
|---|---|---|---|
| `observability.consumer` | 静态 I03 slot 选定并开始 header validation | `operation=ConsumeIdentityObservationContext`, `operation_family=consumer`, `producer_family`, optional trusted parent | validated receipt、ephemeral error 或 pre-write rejection；结果按 typed surface 映射 |
| `observability.consumer.validate` | header validation 开始 | `phase=validate`, finite `schema_version` / `error_kind` when safe | `validated`、`unsupported_schema`、`rejected` 或 `indeterminate`; 不含 payload |
| `observability.consumer.reserve` | `ObservationIdempotencyRepository::reserve` 调用前 | `phase=reserve`, `operation_family=consumer` | `acquired`、`replay`、`conflict`、`in_flight` 或 typed error；不输出 key/digest |
| `observability.consumer.relation` | subject/snapshot/source-version/freshness relation read 开始 | `phase=load`, safe `result_kind` / `error_kind` | relation accepted、no-write、delayed、conflict 或 error；不把 span success当 source truth |
| `observability.consumer.transition` | canonical freshness/H10 mapper开始，且仅 accepted writer可能建立 | `phase=transition`, finite decision/result | staged transition、no-mutation、rejected 或 conflict；Replay不得建立此 span |
| `observability.uow` | UoW begin boundary | `operation_family=consumer`, `phase`, optional `trace_ref` propagation | known `committed`、known `rolled_back` 或 `indeterminate`; exporter结果不改写 UoW事实 |
| `observability.reference_repository` | snapshot/H10 repository callable边界 | logical `repository_family`, `operation_class`, `phase` | typed repository result、CAS conflict 或 error；不记录 row/version/SQL |
| `observability.stored_result` | save/get/rehydrate exact stored result边界 | `phase=persist` or `rehydrate`, safe `result_kind` | stored、rehydrated、missing/corrupt；Replay只允许只读 rehydrate |
| `observability.consumer.complete` | `mark_completed` 调用前 | `phase=complete` | staged completed 或 error；不得在此单独结束为 accepted |
| `observability.consumer.rehydrate` | Replay exact pointer lookup通过后 | `phase=rehydrate`, `result_kind=replayed`, safe `result_ref?` | exact stored surface validated；不重跑 handler、resolver、snapshot、H10 或 outbox |
| `observability.consumer.commit` | commit callable前 | `phase=commit`, finite recovery/result | `accepted` only known full commit；known rollback为`rejected`；unknown为`indeterminate` |
| `observability.consumer.delivery` | application result交给worker completion mapper | `phase=ack`, finite result/action boundary | transport action outcome；不得回写 I03 snapshot、H10、result或source truth |

Span 结果必须由 I03 §10~§13 的 typed branch、stored-result integrity 和 UoW
outcome 映射。不得由 parent span status、telemetry sink availability、duration、
trace sampling 或 exporter flush 选择 `Acknowledge`、`Retry`、`DeadLetter`。

### 14.6.1 §14.1~§14.6 bounded-batch stop review

| 检查项 | 结论 |
|---|---|
| truth owner 是否区分 runtime telemetry、local snapshot/H10/result、evidence/retention/handoff | `pass_with_affected_open`；I03 不拥有 Identity truth，也不创建 Layer C 对象 |
| correlation / trace 是否保持与 source event、dedup、actor、digest、freshness 和 subject relation 分离 | pass；`trace_ref` 只作为 trusted metadata，缺失时 local span 不回写业务 carrier |
| redaction 是否先 allowlist 再序列化，且禁止 raw body、hash escape、endpoint、token、real run id | pass at design-record level；未声称运行时验证 |
| I03 日志是否覆盖 entry、validation、reserve、relation、transition、UoW、result、replay、commit-unknown 和 ack boundary | pass；所有 accepted wording均受 known commit gate约束 |
| I03 span 是否覆盖 consumer、reserve、relation、transition、UoW、stored result、completion、commit 和 delivery | pass；span不成为business truth或action authority |
| H10 / `ReferenceRefreshRecord` 是否只在 accepted local transition同一UoW内作为本地历史 | pass；不称作Identity audit或provider acceptance |
| 是否新增 generic telemetry enum/object、第二个 trace/correlation owner、evidence body、retention/report state | no |
| 是否发现新的 canonical owner blocker | no new blocker；`S08-E-I03-PAYLOAD-SCHEMA-01`与`S08-E-I03-FRESHNESS-OWNER-01`继续 `open_upstream_internal` |
| 当前协议计数 | 保持 `32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03整体未完成 |
| 本批写入状态 | `I03 §14.1~§14.6 recorded_with_affected_open`；§14.7~§14.12、I03 §15~§17仍未写入 |
| 正式文档、实现、测试、evidence、run_id、验收签署 | 均未生成或声称；正式 `03` 继续 frozen |
| 下一动作 | 停审并等待用户确认；确认后只继续写 I03 §14.7~§14.12，不进入 I03 §15、I04~I09、S08-F/G 或 Step09 |
| 当前提交 | 不需要；用户未要求提交 |

### 14.7 I03 指标契约与有限标签绑定

#### 14.7.1 范围、owner 和非目标

I03 只消费 Step 15 已定义的 runtime metric facade。指标是 Layer A
out-of-band signal，不是 `MetricPoint`、`MetricRollup` 或任何新的持久化对象；
I03 不为指标建立 repository、UoW follower、history record、evidence ref 或
retention relation。指标 sink 的可用性、flush 结果和丢弃策略不参与 I03 的
`Acknowledge`、`Retry`、`DeadLetter`、snapshot transition 或 commit 判断。

I03 的 metric label 只能来自既有有限 operation、producer、phase、result、error、
recovery、repository 和 source family 词表。`source_event_ref`、`source_ref`、
`source_version_ref`、`dedup_key`、request digest、actor、subject、snapshot ref、
trace、cursor 数值、row version、endpoint、topic 和 payload bytes 均禁止进入
label。`result_kind=duplicate_replayed` 只表示本次调用读取了已完成的 stored
surface，不是新增的 `ObservationConsumerOutcome::Duplicate` variant。

#### 14.7.2 I03 指标使用表

| 既有指标 | I03 触发位置 | I03 允许标签 | 计数边界 | 禁止解释 |
|---|---|---|---|---|
| `observability_inbound_event_total` | I03 application surface 已形成后，每次调用只计一次 | `operation=consume_identity_observation_context`、`producer_family=identity`、有限 `result_kind` | fresh stored、replayed、ephemeral delayed/rejected/unsupported 和允许的 durable negative 均按最终 surface 分类 | 不证明 Identity truth、transport ack 或外部消费 |
| `observability_inbound_event_duration_ms` | worker entry 到 I03 application surface 返回 | `operation`、有限 `result_kind` | 包含 header validation、reserve、relation 和 accepted UoW；replay 也只计本次读取耗时 | 不用耗时推断成功、freshness 或重试资格 |
| `observability_inbound_schema_rejected_total` | header/schema/decoder gate 已确定拒绝后 | `operation`、`producer_family`、有限 `rejection_kind` | unsupported、malformed、ownerless payload 各按已知分类计数；payload 未成功解码时不计 accepted | 不记录 schema body、source token 或 decoder dump |
| `observability_idempotency_total` | `reserve`、exact replay lookup、conflict、in-flight 或 completion 结果确定后 | `operation_family=consumer`、有限 `result_kind` | `acquired`、`replay`、`conflict`、`in_flight`、`completed` 各只计一次；replay 不再计 acquired | 不暴露 key、digest、winner 或 reservation row |
| `observability_stored_replay_defect_total` | stored result pointer、kind、schema、bytes 或 receipt integrity 检查失败后 | `operation_family=consumer`、有限 `defect_kind` | missing、wrong_kind、unsupported_schema、bytes_mismatch 等缺陷各计一次 | 不把缺陷降级为 rejected、delayed 或空 receipt |
| `observability_uow_total` | UoW begin、known commit、known rollback 或 indeterminate 返回后 | `operation_family=consumer`、有限 `phase`、有限 `result_kind` | staged completion 不提前计 accepted；unknown 计 indeterminate | 不保存 transaction ref、数据库错误正文或 cursor 数值 |
| `observability_uow_duration_ms` | I03 UoW begin 到已知结束/unknown 返回 | `operation_family=consumer`、有限 `result_kind` | accepted、rejected/rollback、indeterminate 分开计时 | 不用高延迟改变 recovery class |
| `observability_repository_operation_total` | 每个 I03 repository callable 返回 typed outcome 后 | `repository_family`、`operation_class`、有限 `result_kind` | snapshot、H10、stored-result、reservation 的逻辑 family 分别计数 | 不将表名、SQL、row key 或 driver message 作为标签 |
| `observability_repository_duration_ms` | 每个 repository callable 前后 | `repository_family`、`operation_class`、有限 `result_kind` | 批量读写仍由 bounded operation class 表示 | 不等于 UoW commit 耗时或 source freshness |
| `observability_concurrency_conflict_total` | reservation unique、snapshot CAS 或 relation fence 冲突已分类后 | `resource_family`、`conflict_kind` | 每个已返回的 conflict 只计一次；replay/in-flight 不计 CAS conflict | 不暴露 expected/current version |
| `observability_reference_refresh_total` | H10/reference refresh transition 所属 UoW 已知提交后 | `source_family=identity`、有限 `result_kind` | 只计已提交的 changed/no-op reference branch；staged、rollback、unknown 不计 accepted refresh | 不证明 producer fresh、resolver 成功或 Identity 改变 |
| `observability_worker_delivery_total` | worker ack/dead-letter transport callable 返回后 | 有限 `delivery_phase`、有限 `result_kind` | delivery failure 与 local accepted 事实分开计数 | 不把 ack 成功改写成 local commit proof |
| `observability_runtime_telemetry_suppressed_total` | allowlist、redaction 或 recursion guard 抑制 signal 后 | `signal_kind`、`reason_kind` | 每次被抑制的 signal 只在 non-recursive counter 中计一次 | 不回调 I03 或创建 no-write violation |
| `observability_runtime_telemetry_sink_failure_total` | metric/log/span sink 明确返回失败后 | `signal_kind`、`sink_result` | 只在 telemetry facade 边界计数；同一 sink 不再发失败日志 | 不触发业务 retry、补偿 UoW 或审计写入 |

上述指标名和 label 名均复用 Step 15。若某个 deployment profile 没有对应 sink，
I03 仍按原 application 分支继续；不得为了补齐指标引入新的 mandatory UoW
participant。`observability_reference_refresh_total` 的成功条件是 H10 与
snapshot transition 同一 accepted UoW 已知提交，而不是 resolver 返回某个
success 字符串。

#### 14.7.3 分支到指标的时序矩阵

| I03 分支 | inbound metric | idempotency metric | reference refresh metric | UoW metric | worker delivery metric |
|---|---|---|---|---|---|
| header malformed / unsupported schema | final ephemeral classification；schema rejection 另计 | 不计 reserve | 不计 | 若尚未打开 UoW 则不计 UoW | 由 worker policy 决定，不能从指标推导 |
| payload owner/freshness unavailable | final rejected/delayed classification | 仅在已完成 reserve 后计对应 reserve outcome | 不计 | 按真实 UoW outcome | 由 exact action mapper 决定 |
| reservation conflict | final conflict classification | 计 conflict | 不计 | 只计真实已开始 UoW 的 rollback/close | 不由 conflict metric 选择 action |
| reservation in-flight | final delayed classification | 计 in-flight | 不计 | 不创建第二 writer UoW | 由 recovery policy 决定 |
| exact completed replay | final `duplicate_replayed` classification | 计 replay，不计 complete | 不计 | 只计 replay read path 实际调用的边界 | ack 资格仍由 worker policy 决定 |
| accepted no-op | final `no_op` classification | reserve + completed 按真实结果计 | 只有正式 no-op surface 与 H10 规则允许时才计 | known commit 后计 committed/no-op | 不把 no-op 当通用 success |
| accepted reference transition | final accepted classification | reserve + completed | known full commit 后计 accepted refresh | known commit 后计 accepted | ack 在 I03 之外 |
| known rollback / rejection | final rejected 或既有 durable negative classification | 只按真实 reservation state 计 | 不计 accepted refresh | known rollback 计 rollback | action 不由 rollback metric 决定 |
| commit outcome unknown | final indeterminate classification | completion 是否已 staged 按真实结果记录，但不计 accepted completion | 不计 accepted refresh | 计 indeterminate | 不选择默认 terminal action |
| ack/dead-letter call failure after local commit | inbound final surface 不变 | 不重开或重复 complete | 不变 | 不重开已提交 UoW | 仅计 delivery failure |

#### 14.7.4 标签与结果词表审计

`validated`、`prepared`、`acquired`、`staged`、`stored`、`completed` 等词只可
作为 §14.5/§14.6 已记录的 phase-local telemetry value；它们不进入
`ObservationConsumerOutcome`、`OperationResultDisposition`、`StoredObservationResultKind`
或 stored receipt bytes。对外 protocol surface 仍只使用 Step 08 的
`Accepted`、`Delayed`、`Rejected`、`Quarantined`、`DeadLettered`、
`UnsupportedSchema`、`NoOp`，以及 `FreshlyCommitted` / `Replayed` access overlay。
任何想把 phase-local value 提升为 public enum、持久化字段或 metric schema 新变体的
实现，必须回到 Step 06/08 重新开 owner review；I03 不在本批完成该升级。

#### 14.7.5 §14.7 stop review

| 检查项 | 结论 |
|---|---|
| I03 是否只复用既有 runtime metric facade，没有创建 metric object、repository 或 UoW follower | pass |
| metric 是否覆盖 schema、reservation、replay、UoW、H10、delivery 和 telemetry suppression 分支 | pass_with_affected_open；shared action/UoW surface 仍开放 |
| label 是否保持低基数并排除 ref、key、digest、body、endpoint、token 和 trace | pass at design-record level；未声称运行时验证 |
| accepted refresh metric 是否要求 H10、snapshot transition 和完整 UoW 已知提交 | pass |
| phase-local `result_kind` 是否未升级为 public/stored enum | pass；复用既有有限词表 |
| 是否发现新的 canonical owner blocker | no new blocker |
| §14.7 是否只增加 telemetry contract，而没有改变 I03 的 result、action、UoW 或 truth ownership | pass；§14.8~§14.12 仍待写入 |
| 本批当前写入状态 | `I03 §14.7 recorded_with_affected_open`；本批仍为 `in_progress` |
| 下一动作 | §14.7 stop review 已完成；当前批次继续停审，确认后只写 I03 §14.9，不进入 §14.10~§17、I04~I09、S08-F/G 或 Step09 |
| 当前提交 | 不需要；用户未要求提交 |

### 14.8 I03 H10/reference refresh 唯一 owner 与 UoW 闭合

本节只把 I03 已确定的 snapshot transition 与 H10 `ReferenceRefreshRecord`
绑定起来。H10 是 Observability-owned reference history record，不是 generic audit
event、Identity source audit、provider receipt、evidence linkage、retention marker
或 report handoff。I03 application/service 只负责按既有 owner 顺序编排调用；它不
声明第二个 H10 schema、第二个 record factory、第二个 cursor namespace 或新的
审计 owner。

#### 14.8.1 权威来源、冲突处理与唯一 owner

| 关注面 | 当前权威 | I03 使用方式 | 禁止做法 |
|---|---|---|---|
| H10 字段、变体与校验 | Step 06 current `03_ddd_step_06_policy_guard_records.md` §69 | 只消费 `ReferenceRefreshRecord`、`ReferenceRefreshAcceptedInput`、`ReferenceRefreshPostState` 和既有 `from_accepted` factory | 在 Step 08 复制 struct、enum、rehydrate 或自由字符串 reason |
| in-place accepted input | `ReferenceSnapshotTransition` + 对应 `ReferenceRefreshAcceptedInput::{Resolved, Stale, Unresolved, Invalid, Unavailable}` | transition 的 before/from、after/to、subject、basis 和 post-state 必须逐字段相等 | 从 loaded row 二次读取 before，或根据 after-state 猜 change kind |
| required-new-snapshot accepted input | `ReferenceSnapshotState::create_from_required_new_snapshot(...)` 返回 `(ReferenceSnapshotState, ReferenceSnapshotCreated)` 的 current affected 契约 | `ReferenceRefreshAcceptedInput::NewSnapshot` 只能借用 creation proof；旧 `Invalid` row 保留 | 复用旧 `Result<Self>` 草稿、用 absence 制造 proof、原地恢复 Invalid |
| record factory | `ReferenceRefreshRecord::from_accepted(accepted, post_state, metadata)` | 只在 accepted post-state 已形成且 cursor 已分配后调用 | 增加 `I03ReferenceRefreshRecord` 或 record-first append |
| durable append | `ReferenceMaintenanceRepository::append_refresh_record(&record, uow)` | 作为同一 accepted UoW 的唯一 H10 append port | generic audit repository、telemetry sink 或 outbox publisher 追加 H10 |
| record identity | `ReferenceRefreshRecordRef` 由既有 IdGenerator/metadata owner 产生 | identity 只用于该条 immutable history record | 使用 source event、dedup、trace、snapshot ref 或 result ref 代替 |
| cursor | `ObservationUnitOfWork::assign_reference_cursor()` | 一个真实 reference mutation 最多一次，tag 为 `ReferenceCursor` | 用 source version、row version、occurred_at 或 observation cursor 排序 |

`S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01` 继续保持
`open_internal_affected`：Step 06 的较早 object 草稿曾以 `Result<Self>` 表达新
snapshot 创建，而 current H10 专项要求同时返回 post-state 和
`ReferenceSnapshotCreated`。本节按 current H10 专项契约记录实现承接，不把该冲突
伪装成已解决，也不在 I03 创建兼容双签名。

#### 14.8.2 H10 accepted input 与字段来源

| accepted branch | H10 input variant | post-state carrier | record change boundary | I03 可返回的本地引用 |
|---|---|---|---|---|
| accepted `Resolved` in place | `ReferenceRefreshAcceptedInput::Resolved { transition }` | `ReferenceRefreshPostState::InPlace(&current)` | same snapshot, `Resolved`, safe summary/source-version conditional fields | snapshot ref、H10 ref、stored result ref、经授权的 outbox refs |
| accepted `Stale` in place | `...::Stale { transition }` | `InPlace(&current)` | same snapshot, typed stale reason and exact P15/P17 basis | snapshot ref、H10 ref、stored result ref |
| accepted `Unresolved` in place | `...::Unresolved { transition }` | `InPlace(&current)` | same snapshot, typed resolution reason | snapshot ref、H10 ref、stored result ref |
| accepted `Invalid` in place | `...::Invalid { transition }` | `InPlace(&current)` | same snapshot becomes Invalid; usable summary/version rules follow owner matrix | snapshot ref、H10 ref、stored result ref |
| accepted `Unavailable` in place | `...::Unavailable { transition }` | `InPlace(&current)` | same snapshot, typed unavailable/resolution reason | snapshot ref、H10 ref、stored result ref |
| accepted `RequireNewSnapshot` | `ReferenceRefreshAcceptedInput::NewSnapshot { creation }` | `NewSnapshot { previous, current }` | `NewSnapshotFromInvalid`; old Invalid revision and new identity are both retained | old/new snapshot refs、H10 ref、stored result ref |

H10 的 `before` revision 必须来自 transition 的 previous fields，或来自
`ReferenceSnapshotCreated` 与已加载的旧 Invalid object；`after` 必须来自同一个
accepted post-state。record factory 不得读取 repository、resolver、clock 或 raw
payload。`ReferenceRefreshRecordReason` 只能承载既有 typed reason；Resolver error
正文、provider code、endpoint、token、source body 和任意 free-form message 均不得
进入 H10。

#### 14.8.3 accepted writer 的严格顺序

以下是 I03 唯一允许的 accepted writer 顺序。每个箭头表示前一项已通过其 owner
校验；任何失败都不得跳到后续项，也不得以 telemetry 结果补齐缺失项。

```text
validated envelope / body-free I03 input
  -> begin one fresh ObservationUnitOfWork
  -> reserve logical scope + Consumer secondary event identity
  -> stop on Replay / Conflict / InFlight
  -> load exact ReferenceSnapshotState + repository version
  -> prove subject/snapshot/source/visibility relation
  -> validate typed adapter output, source-version relation and P15/P17 inputs
  -> obtain canonical ReferenceFreshnessDecision
  -> apply_freshness_decision or create_from_required_new_snapshot proof
  -> stage snapshot with matching expected version or create-if-absent proof
  -> assign exactly one ReferenceCursor for the real mutation
  -> mint H10 metadata and call ReferenceRefreshRecord::from_accepted
  -> append H10 through ReferenceMaintenanceRepository in the same UoW
  -> stage an authorized immutable outbox pair, or preserve explicit empty refs
  -> assemble and stage StoredObservationResult from exact staged refs
  -> mark_completed(reservation, result_ref, uow)
  -> commit the one UoW
  -> emit post-commit accepted telemetry and return the validated local surface
```

设计级 callable seam 只引用已有 owner，形状如下；名称不表示 I03 新增函数：

```rust
let transition = snapshot.apply_freshness_decision(
    &target,
    &maintenance,
    &freshness_decision,
)?;

let (current, creation) = ReferenceSnapshotState::create_from_required_new_snapshot(
    new_snapshot_ref,
    &previous_invalid,
    &target,
    &maintenance,
    &freshness_decision,
)?;

let record = ReferenceRefreshRecord::from_accepted(
    accepted_input,
    post_state,
    record_metadata,
)?;

reference_repository
    .append_refresh_record(&record, uow.as_ref())
    .await?;
```

两条 snapshot 分支不能在同一调用中同时成功。`PreserveCurrent` 返回
`Ok(None)`，因此不进入 snapshot stage、cursor 分配或 H10 factory；
`RequireNewSnapshot` 不能被转换成 in-place transition。`append_refresh_record`
成功只表示 H10 已加入当前 UoW 的 staged set，不表示已经 commit，也不表示
Identity producer、resolver 或外部 provider 已接受该事实。

#### 14.8.4 H10 与本地事实的分支矩阵

| I03 分支 | snapshot / H10 行为 | stored result / completion | commit 与 worker 边界 |
|---|---|---|---|
| header、schema、payload owner 或 freshness owner 在 admission 失败 | 不开 writer UoW；无 snapshot、cursor、H10 | 无 result；只返回既有 ephemeral typed surface | 不从 metric 选择 action |
| subject/snapshot relation 缺失、重复或 mismatch | 已开 UoW 则整体 rollback；无 H10 | 不调用 `save_result`/`mark_completed`，除非既有 flow 明确拥有 durable negative surface | 不用当前 snapshot 或 first row 补关系 |
| reservation `Replay` 且 stored pointer 完整 | 立即退出 writer lane；不读写 snapshot/H10/outbox | exact stored result 只读 rehydrate，使用 `Replayed` overlay；不新建 completion | action 仍由 worker per-flow mapper决定 |
| reservation `Conflict` | incoming UoW rollback；无 H10 | 无 winner receipt 暴露，无 completion | 不覆盖 winner、不创建 alias |
| reservation `InFlight` | 不建立第二 writer；无 H10 | 既有 delayed/in-flight surface；无 completion | retry 资格只由 recovery policy决定 |
| canonical decision 为 `PreserveCurrent` / valid same-version no-op | 无 snapshot stage、cursor 或 H10 | 只有既有 durable `NoOp` owner允许时才 save/complete；否则保持 ephemeral/deferred | 不把 no-op 记为 accepted refresh |
| accepted in-place `Resolved/Stale/Unresolved/Invalid/Unavailable` | one expected-version snapshot stage、one reference cursor、one H10 append | exact result先stage，再 `mark_completed` | 只有 known full commit 后才可返回 accepted local surface |
| accepted `RequireNewSnapshot` | old Invalid row保留；one create-if-absent new snapshot、one cursor、one H10 | exact new-snapshot refs先stage，再 completion | 不原地恢复旧 Invalid，不声明 external acceptance |
| snapshot CAS/create proof失败 | rollback全UoW；无H10 | no result / no completed reservation | 只能走既有 known-no-write recovery |
| cursor分配或 H10 factory 校验失败 | rollback全UoW；不得 record-first | no result / no completion | 不重用已分配 cursor 或新 mint partial refs |
| H10 append失败 | rollback snapshot、cursor可见性、后续所有 staged facts | no result / no completion | H10 sink失败不是 telemetry sink failure，不能静默丢失 |
| authorized outbox pair staging失败 | rollback H10、snapshot及其他 staged facts | no result / no completion | 不由 publisher回查并重建payload |
| `save_result`失败 | 不提交任何 staged local fact | 不调用 `mark_completed` | known no-write或既有 persistence recovery |
| `mark_completed`失败 | 不允许 `Reserved + result_ref`中间态提交 | rollback result、H10、snapshot；无 fresh success | 不把 staged result当 replay authority |
| known rollback / known no-write commit outcome | H10及所有本地事实不可见 | 无 stored completion | action仅按既有 recovery class和per-flow policy |
| known full commit | snapshot、H10、result、completion及授权outbox成组可见 | 验证 exact stored relation 后返回 `FreshlyCommitted` | worker另行选择 ack/retry/dead-letter |
| commit outcome unknown / probe unsupported | 不判断 H10 是否已提交；不补写、不重建 | 当前 carrier不能构造安全 completion surface | 不选择 terminal action，保留 indeterminate affected |
| local commit已知成功但 worker action失败 | 不回滚、不改写 H10 或 snapshot | exact stored result保持可 replay | 后续只按稳定 key/digest probe/replay，不重跑 transition |

#### 14.8.5 H10、receipt 与 commit proof 的不可替代关系

| 事实 | 能证明什么 | 不能证明什么 |
|---|---|---|
| `ReferenceSnapshotTransition` | 一个 domain owner 已接受的 in-place post-state delta | H10 已 append、result 已保存或 UoW 已 commit |
| `ReferenceSnapshotCreated` | 旧 Invalid revision 到新 snapshot identity 的 accepted creation proof | 新 row 已 durable、producer 已接受或外部 resolver 成功 |
| staged `ReferenceRefreshRecord` | 当前 UoW 私有 staged history candidate | 已提交、可被 replay 读取或可作为 source audit |
| committed H10 record | Observability 本地 reference refresh history 已提交 | Identity truth、source audit、evidence、retention 或 report handoff |
| `StoredObservationResult` | exact protocol receipt/result bytes及其 refs可被重放 | 从 current snapshot 重建缺失 H10、证明 source truth 或 transport ack |
| completed reservation | reservation 与 exact result pointer 的 durable关系 | snapshot/H10/outbox 的每个参与者单独成功，除非同一 commit contract已验证 |
| known full UoW commit | 本次 staged local fact set 以本地事务成功提交 | provider acceptance、Identity mutation、worker ack或外部 delivery |

因此 I03 的 replay/probe 只能从 reservation -> stored result 的稳定关系开始；
不能通过查询当前 H10、当前 snapshot、log/metric/span 或 outbox 是否存在来反推
整组事务的 commit 结果。H10 也不能被用作下一次 P15 输入、source-version comparator
或 evidence authenticity proof。

#### 14.8.6 §14.8 stop review

| 检查项 | 结论 |
|---|---|
| H10 是否只有一个 current schema、一个 factory 和一个 append owner | pass；Step 06 §69 与 Step 07 `ReferenceMaintenanceRepository` 为唯一来源 |
| in-place 与 new-snapshot 是否分别要求 transition / creation proof | pass；`S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01`仍为 affected |
| `PreserveCurrent`、Replay、Conflict、InFlight、rollback、commit-unknown 是否均禁止 H10 | pass |
| H10 before/after 是否来自同一 accepted proof，且禁止 reload、record-first、after-state猜测 | pass at design-record level |
| snapshot、H10、stored result、completion 是否保持严格 same-UoW / result-before-complete 顺序 | pass；`R06-F-AFFECT-UOW-01`与shared result surface继续开放 |
| H10 是否被明确限制为 Observability reference history，而非 Identity audit / provider acceptance / Layer C projection | pass |
| 是否新增 generic audit、EvidenceLinkage、RetentionMarker、ReportHandoffRecord、Duplicate 或 action owner | no |
| 是否发现新的 canonical owner blocker | no new blocker；既有 `S08-E-I03-PAYLOAD-SCHEMA-01` 与 `S08-E-I03-FRESHNESS-OWNER-01` 保持 `open_upstream_internal` |
| 当前协议计数 | 保持 `32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete |
| 本批当前写入状态 | `I03 §14.7~§14.8 recorded_with_affected_open`；本批仍为 `in_progress` |
| 下一动作 | 停审并等待确认；确认后只写 I03 §14.9，不进入 §14.10~§17、I04~I09、S08-F/G 或 Step09 |
| 当前提交 | 不需要；用户未要求提交 |

### 14.9 I03 durable audit 落点、触发与非 owner 边界

本节只审查 I03 的 durable audit landing。对一次真实、被接受且最终提交的
reference snapshot mutation，唯一 mandatory durable audit landing 是 H10
`ReferenceRefreshRecord`。snapshot 是当前 Observability-owned reference state，H10
是该 state change 的 append-only native history；二者都不等于 Identity truth、
generic audit ledger、evidence、retention、handoff、read authorization 或外部验收。

#### 14.9.1 Native landing authority 与受影响顺序

| 关注面 | current authority | I03 必须执行 | 禁止替代 |
|---|---|---|---|
| H10 schema / accepted proof / factory | Step 06 §69 `ReferenceRefreshRecord` | 只用同一 in-place transition 或 new-snapshot creation proof、matching post-state和typed metadata调用`from_accepted` | generic audit event、payload-to-record conversion、after-state反推 |
| H10 durable append | Step 07 `ReferenceMaintenanceRepository::append_refresh_record` | 在 owning I03 UoW 内追加一次，并把append失败当mandatory participant失败 | telemetry sink、outbox publisher、audit projection repository或第二事务 |
| H10 cursor | `ObservationUnitOfWork::assign_reference_cursor` + metadata seed binding | snapshot stage后先分配一个tagged cursor，再构造并append H10 | source version、row version、event time、trace或dedup identity |
| result / completion | current stored-result与idempotency owners | H10 append后stage exact result，随后`mark_completed`，最后提交同一UoW | 先complete再补H10、从current snapshot重建result、以receipt替代commit proof |
| exposure | `RecordAuditVisibility` + 独立read visibility decision | 只接受record metadata assembler提供且不超过H10 factory ceiling的值 | I03自行指定`AuditTimelineEligible`、把eligibility当可见/公开/已授权 |

Step 15 §13.4 的冻结 generic 顺序仍写作“append record -> assign cursor”，与
current Step 06 metadata factory必须携带present tagged cursor以及Step 07 UoW surface
冲突。I03 不沿用该旧顺序，也不跨步修改 Step 15；current顺序固定为：

```text
stage snapshot
  -> assign one tagged cursor
  -> construct H10 with bound metadata
  -> append H10
  -> stage authorized outbox snapshot or explicit empty refs
  -> stage stored result
  -> mark idempotency completed
  -> commit one UoW
```

该冲突继续由既有 `R06-F-AFFECT-UOW-01` 承担下游传播，不新增第二个 blocker ID。
在 Step 15 affected review完成前，其旧顺序只作 historical affected material，不能
覆盖本节、Step 06 §69或Step 07 port contract。

#### 14.9.2 Durable audit / native history landing 表

| durable family / object | canonical trigger | I03 当前 landing | I03 明确禁止 |
|---|---|---|---|
| H10 `ReferenceRefreshRecord` | accepted in-place `ReferenceSnapshotTransition`或accepted `ReferenceSnapshotCreated`，且matching post-state最终同UoW提交 | 每个真实reference mutation恰好一条；这是I03唯一mandatory durable audit landing | `PreserveCurrent`、replay、reject、failure或unknown时补写；创建第二个H10 owner |
| H3 `AuditAppendRecord` / `AuditProjection` / `EvidenceLinkage` | canonical `AuditProjectionTransition`或`EvidenceLinkageTransition`及其owning flow | none | 因payload来自Identity、含safe summary或H10 ref而创建audit projection/evidence linkage |
| H4 `HandoffLifecycleRecord` / `ReportHandoffRecord` | canonical handoff/hint transition及正式handoff owner | none | 把I03 receipt、worker ack、H10或outbox ref解释为Prepared/Delivered/report acceptance |
| H5 `RetentionChangeRecord` / retention marker | canonical marker/protection transition及retention owner | none | 根据source age、freshness、telemetry backend policy或H10 existence创建retention marker |
| H6 `NoWriteViolationRecord` | existing `NoWriteViolationTransition`及matching post-state | none in I03 | 把forbidden body rejection、dependency failure、telemetry suppression或普通policy rejection升级为violation record |
| H8 `GapTransitionRecord` / `GapState` | canonical `GapState` transition及正式gap writer | none by default | 从missing relation、unavailable dependency、freshness unknown、metric/log/span或commit unknown推导gap |
| H1/H2/H9/H11/H12/H13 native records | 各自exact accepted transition/item result与owning operation | none | 以“需要审计”为由选择相近family、复制同一I03 transition或写generic correction row |
| H7 `ReadAccessRecord` | future explicit asynchronous read-audit envelope；current同步路径无writer | none | 为I03 replay/probe、repository read或diagnostic lookup追加read audit |
| generic audit ledger / `AuditEventProjection` / durable `Duplicate` outcome | no current canonical owner | none | 新建catch-all audit row、第二套timeline、duplicate history或error event |

H10 可以在后续正式 read/handoff/evidence flow 中作为一个已提交的 body-free native
record ref 被引用，但“可引用”不等于 I03 拥有这些下游对象。任何 evidence linkage、
retention marker、report handoff 或 gap 写入都必须重新满足其自身 canonical input、
policy、transition、post-state和UoW；不能把 I03 已提交视为隐式授权。

#### 14.9.3 I03 分支触发与禁止矩阵

| I03 分支 | H10 行为 | 其他 durable audit 行为 | 可声明的确定性 |
|---|---|---|---|
| accepted in-place `Resolved/Stale/Unresolved/Invalid/Unavailable` | one staged H10；仅known full commit后视为committed | 无第二native record；只有协议已授权的outbox/result follower | committed local reference change，不是Identity/provider acceptance |
| accepted `RequireNewSnapshot` | one H10 `NewSnapshotFromInvalid`；旧Invalid row保留 | 无gap、retention、handoff或evidence记录 | committed local identity replacement history，不是source lifecycle change |
| `PreserveCurrent` / valid no-mutation | none | none；不得用generic no-op audit补齐 | 只说明本次未形成reference mutation；durable `NoOp`须由既有独立owner授权 |
| exact completed replay | none in current attempt | none；不复制H10/outbox/history，也不创建durable `Duplicate` | exact stored result + invocation-level `Replayed` overlay |
| reservation `Conflict` / `InFlight` | none | none | typed conflict/delayed surface；不泄漏winner或猜commit |
| malformed/unsupported/ownerless payload、actor失败或pre-UoW reject | none | none | ephemeral typed rejection/unsupported result only |
| missing/duplicate relation、uncomparable source version、freshness owner unavailable或dependency failure | none；已开UoW则rollback | none；尤其不得自动创建gap/no-write/audit failure | exact typed error/recovery class；不从异常推导local truth |
| domain/policy reject、snapshot CAS/create failure、cursor/factory failure | none可见；整体rollback | none | known no-write/known rollback only |
| H10 append、outbox、`save_result`或`mark_completed`失败 | H10及同组staged facts全部rollback | 不允许fallback audit transaction | known rollback；不得返回fresh accepted |
| commit outcome unknown / probe unsupported | 不判断H10是否已提交，不补写、不删除 | no compensation event、gap或generic failure audit | indeterminate；不得选择terminal worker action |
| known full commit后worker ack/retry/dead-letter调用失败 | 保留原committed H10，不重跑transition | 不新增H10或generic delivery audit；只用worker native recovery/telemetry | local commit仍成立，transport completion另行处理 |

`Replay`、`Conflict`、`InFlight`、`PreserveCurrent`、known rollback和commit unknown都
不是 H10 change kind。实现不得增加 `Duplicate`、`Rejected`、`Failed`、`Unknown`
等H10 variant，也不得用一条“attempt audit”绕过accepted-proof门禁。

#### 14.9.4 H10 metadata 来源与 redaction

| metadata field | I03 唯一允许来源 | 必须校验 | 禁止来源 / 泄漏 |
|---|---|---|---|
| `record_ref` | accepted UoW内application id generator产生的`ReferenceRefreshRecordRef` | exact typed discriminator；只绑定当前H10 | snapshot/source event/dedup/result/trace/time派生或充当evidence alias |
| `origin` | trusted application operation context | 固定为`ObservationRecordOrigin::InboundConsumer` | Identity producer family、broker、route、actor或worker action冒充origin |
| `actor_ref` | 已认证并经application context保留的`ActorSafeRef` | body-free且authority已在admission完成 | Identity subject、profile、credential、session、token或payload字段 |
| `recorded_at` | application clock在本次accepted operation内取得的local `ObservedAt` | 与当前UoW/transition时序一致 | producer occurred-at、source version、DB default或adapter返回时间 |
| `trace_ref` | trusted envelope/context中已验证的optional `TraceCorrelationRef` | 缺失保持`None`；不影响mutation或visibility | payload text、span id字符串、URL、dedup key或新生成的business identity |
| `causation_ref` | trusted envelope/context中已验证的optional `CausationRef` | 与当前source-event/correlation relation相容；缺失保持`None` | 从trace、time、cursor、subject或source-version猜测 |
| `audit_visibility` | current record metadata assembler按H10 factory ceiling提供的finite值 | 只能相等或更窄；仍需独立read visibility decision | I03/public caller自行升级、默认`AuditTimelineEligible`或将其解释为signoff |
| `committed_cursor` | snapshot stage后由当前UoW分配并bind的tagged cursor | present且tag与本次reference-only/mixed footprint一致 | source version、row version、broker offset、occurred-at或outbox ordinal |

H10 canonical `before/change/after/reason/policy_basis` 可保存 Step 06 §69 已拥有的
typed body-free reference字段；这不允许把同一值复制到metadata或runtime telemetry。
特别是source-version只能位于H10 canonical revision/change字段，不能作为cursor、
metadata extension、metric label或日志字段。

以下材料在metadata、H10扩展字段、log、metric、span和错误safe detail中全部禁止：
raw event/envelope/payload body、Identity profile/role/membership/lifecycle/PII、digest、
dedup key、source-version token原文、broker topic/offset、endpoint、credential、provider
response、真实`run_id`、evidence alias、verdict、signoff和自由文本错误链。禁止材料不能
通过hash、base64、`Debug`或“safe summary string”绕过。

#### 14.9.5 Correlation、evidence、retention、handoff、gap 与 no-write 边界

1. `trace_ref`、`causation_ref`、`source_event_ref`、subject、snapshot、dedup和cursor
   各自保持typed identity；任何两者都不得合并或互相推导。correlation只关联本地
   观察链，不证明Identity truth或提交结果。
2. I03不创建`EvidenceLinkage`、evidence index input、evidence alias或authenticity
   verdict。后续evidence owner若引用H10，只能引用known-committed typed ref并重新通过
   body-free linkage与visibility policy。
3. telemetry backend retention、source age、freshness state和H10 existence均不创建
   `RetentionMarker`或`ActiveReferenceProtection`。物理保留策略也不能反向修改H10或
   snapshot truth。
4. I03不创建或推进`ReportHandoffRecord`、`HandoffLifecycleRecord`、delivery intent、
   receipt或report。worker ack、outbox publication和H10 commit都不等于Prepared、
   Delivered、consumed、accepted、verdict或signoff。
5. gap只能由canonical `GapState` owner消费正式gap classification并形成transition。
   missing/ambiguous relation、dependency outage、freshness unknown、telemetry sink failure
   和commit unknown只走其typed error/recovery路径。
6. forbidden body、wrong owner或普通policy rejection在I03内是admission/no-write结果，
   不是`NoWriteViolationTransition`。除非独立正式operation已形成canonical violation
   transition，I03不得在隐藏第二事务中追加H6。
7. H10、log、metric、span、receipt和outbox都不得反写L1-identity subject/profile、
   credential、role、membership、lifecycle、source version或任何业务truth。

#### 14.9.6 UoW、失败、replay 与 commit-unknown 规则

- H10 factory或`append_refresh_record`失败是mandatory durable participant失败，必须
  rollback snapshot stage、cursor可见性、授权outbox、stored result和completion；
  不允许“业务提交成功但audit稍后补写”。
- telemetry log/metric/span sink失败是out-of-band failure，不得rollback owning UoW、
  创建H10/gap/no-write记录、重试I03 mutation或改变worker action。
- H10 append返回成功只表示row已在当前UoW staged；只有known full commit才能发出
  accepted telemetry、返回`FreshlyCommitted`或允许下游引用该H10 ref。
- exact replay只从reservation关联的stored result/receipt重放；不得查询current H10、
  snapshot、outbox或telemetry来重建结果，也不得再次append H10。
- commit unknown只能使用原logical key、event identity、digest candidates和stable result
  pointer执行既有exact probe。probe仍unknown/unsupported时保持indeterminate，不补写
  H10、不发compensation audit、不创建gap，也不默认`Acknowledge`/`Retry`/`DeadLetter`。
- known commit后的delivery failure不回滚或修订H10。后续同一delivery只能通过稳定
  idempotency关系读取原stored surface；不得重跑resolver、policy、transition或factory。
- fake、controlled和durable adapter必须保持同一append atomicity、cursor binding、
  rollback、replay和unknown语义；本节只定义planned conformance，不声称测试已运行。

#### 14.9.7 §14.9 stop review

| 检查项 | 结论 |
|---|---|
| I03真实reference mutation是否只有H10一个mandatory durable audit landing | pass；Step06 §69与Step07 `ReferenceMaintenanceRepository`为唯一owner |
| H10是否与snapshot、授权outbox、stored result和completion保持同一UoW | pass at design-record level；`R06-F-AFFECT-UOW-01`继续承担后续Step传播 |
| current顺序是否为stage snapshot -> assign cursor -> construct/append H10 -> result -> completion -> commit | pass；Step15 §13.4冻结旧顺序已登记为同一affected的下游修订项 |
| Replay、Conflict、InFlight、PreserveCurrent、reject、rollback和commit-unknown是否均禁止新增H10 | pass |
| H3/H4/H5/H6/H8及其他native family是否只由自身canonical transition触发 | pass；I03未创建generic audit、evidence、retention、handoff、gap或no-write owner |
| metadata是否只使用既有八字段及可信来源，且visibility不等于读取授权 | pass；I03不得自行指定`AuditTimelineEligible` |
| raw body、digest、dedup、source token、locator、credential、real run id、evidence alias、verdict和signoff是否禁止 | pass at design-record level；未声称运行时扫描 |
| H10 append失败与telemetry sink失败是否保持不同事务语义 | pass；前者整体rollback，后者不得影响业务UoW |
| 是否发现新的canonical owner blocker | no new blocker；两个L1-identity upstream gaps与I03其余四项affected保持开放 |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03整体未完成 |
| 本批当前写入状态 | historical checkpoint；`I03 §14.7~§14.9 recorded_with_affected_open`，current状态由下方§14.10承接 |
| 正式文档、实现、测试、evidence、run_id与验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | historical checkpoint；当前由下方I03 §14.10 stop review承接 |
| 当前提交 | 不需要；用户未要求提交 |

### 14.10 I03 协议级 observability / audit coverage 与 closure

本节不新增日志、指标、span、durable record、协议 DTO、应用结果或 worker action，
只把 §1~§14.9 已经形成的 I03 契约逐项回指到 Step 08 的协议门禁，并明确哪些
关系已经在设计记录层闭合、哪些只能 `covered_with_affected_open`、哪些必须由后续
Step 承接。这里的 `coverage` 表示存在可定位的 owner、字段来源、分支和禁止项，
不表示代码、adapter、schema registry、测试或运行时 evidence 已经存在。

#### 14.10.1 Closure 状态词与判定边界

| 状态 | 本节中的严格含义 | 是否允许把 I03 标为完成 |
|---|---|---|
| `covered_current` | I03 use-site 已能回指 current Step 06/07 owner，字段、分支、错误和非 owner 边界无未登记冲突 | no；还必须完成本协议剩余小节和最终逐协议停审 |
| `covered_with_affected_open` | 当前行为已固定为 fail-closed 或唯一合法路径，但 canonical owner、签名、mapper、stored surface 或下游传播仍有登记项 | no |
| `deferred_to_named_step` | 当前只登记唯一承接位置；不得在 Step 08 提前写完整 flow、adapter 或测试结果 | no |
| `not_applicable_non_owner` | I03 被明确禁止创建该事实或动作，且已给出真正 owner 的触发前提 | no；这是边界闭合，不是能力实现 |
| `uncovered` | 缺 owner、字段来源、错误、分支或后续承接且没有 affected ID | no；必须新增登记后才能继续 |

本次静态审查未发现 `uncovered` 项，但存在 6 项 I03 专属 affected、7 项直接共享/
跨协议 affected 与一个 Step 09 handoff blocker。因此本节结论只能是
`pass_with_affected_open`，不能把 I03 从 `pending_per_protocol_review` 改成
`defined_with_affected_open`，也不能增加 Consumer 或全协议计数。

#### 14.10.2 Step 08 public protocol surface 覆盖表

| Step 08 门禁面 | I03 current 定义 / 回指 | 当前结论 | 未完成条件 |
|---|---|---|---|
| 协议身份 | §4.2 固定 `InboundEvent / ConsumeIdentityObservationContext`、`0x0303`、Identity producer 与唯一 I03 slot | `covered_current` | actual locator 只由 Step 14 / `04` binding 提供，不进入 payload 或 digest |
| 调用方 / 处理方 | §4~§5 固定 authenticated L1-identity collaboration -> worker exact slot -> inbound assembler -> `ObservationInboundEventService` | `covered_current` | producer 不是 Identity truth 正确性或授权证明 |
| 函数签名 | §5.2 固定具名 assembler 与 service callable，input 按值消费 | `covered_current` | 不允许 generic Consumer dispatch、raw-byte service 或 entry 直调 helper |
| envelope | §6.1 使用 shared typed envelope，固定十个 header/payload member 和 header-first 顺序 | `covered_with_affected_open` | `SourceEventRef` Step 06 回指仍由 `S08-SOURCE-EVENT-REF-OWNER-01`传播 |
| payload schema | §6.2 只记录 `IdentityObservationContextPayload` 三字段 use-site | `covered_with_affected_open` | `S08-E-I03-PAYLOAD-SCHEMA-01` 未关闭前无 canonical wire declaration/encoder/registration |
| application input | §7 固定六个 Consumer control field、三个 I03 payload field、private constructor 与 exact assembly order | `covered_with_affected_open` | payload/freshness owner、digest profile、source comparator 和 relation proof 仍开放 |
| result / receipt | §11 固定 exact stored inner surface、`FreshlyCommitted/Replayed` access overlay、public receipt presence 与 no-rebuild 规则 | `covered_with_affected_open` | outbox source、悬空 quarantine use 与 indeterminate no-completion carrier仍开放 |
| error surface | §12 固定 internal error source -> recovery class -> public `ProtocolError` / Consumer error projection 的顺序 | `covered_with_affected_open` | ownerless payload/freshness与commit-unknown保持显式 fail-closed，不得用 generic error/action吞并 |
| idempotency | §8、§11、§13 固定 logical scope、secondary event identity、digest candidates、Replay/Conflict/InFlight 和 exact probe | `covered_with_affected_open` | digest order/profile消费、source-event回指及no-completion surface待传播 |
| local durable change | §10、§14.8~§14.9 固定 `ReferenceSnapshotState` transition、one reference cursor、one H10、result-before-complete与one-UoW | `covered_with_affected_open` | inbound mapper、new-snapshot proof签名和跨Step UoW顺序仍开放 |
| runtime telemetry | §14.1~§14.7 固定 Layer A log/metric/span、低基数标签、correlation和serialization前redaction | `covered_current` at design-record level | sink/registration/测试由后续配置、Step 16和实现承接；本节不声称运行验证 |
| durable audit | §14.8~§14.9 固定 H10 为真实reference mutation唯一mandatory durable landing | `covered_with_affected_open` | Step 15冻结旧cursor顺序由`R06-F-AFFECT-UOW-01`继续传播 |
| 后续 flow | §13.9 只登记 `ConsumeIdentityObservationContextFlow` 及 callable-to-port handoff | `deferred_to_named_step` | `03-RPR-S09-PER-FLOW` 未关闭前不得声称函数级flow完成 |

在 §14.10 stop review 当时，公开协议总表中的 I03 行保持
`pending_per_protocol_review`，因为 §14.12~§17 和最终逐协议停审尚未写入。
§14.12 已由后续 current 小节承接，但 I03 §15~§17 和最终逐协议停审仍未完成，
因此 current 状态仍不能改成 `defined_with_affected_open`。未来达到该状态时仍必须
携带本节及后续新增的全部 affected，不得把状态登记本身解释为 owner gap 已关闭。

#### 14.10.3 输入字段到对象、记录和观测面的 lineage closure

| incoming / trusted field | 首个 owner / gate | 可进入的 application / domain 用途 | 可进入的 durable / telemetry surface | 禁止替代与当前缺口 |
|---|---|---|---|---|
| `consumer_name` | shared operation enum + static I03 slot | 选择唯一 assembler/service 和 operation context | 仅有限 `consumer=I03` telemetry label；不写 H10 change | 禁止裸字符串路由或 fallback decoder |
| `source_event_ref` | shared envelope typed ref | Consumer secondary identity、causation relation校验 | stored relation；只有可信映射存在时可形成 H10 optional causation metadata | 不作dedup、trace、snapshot、record或locator；Step06回指仍affected |
| `source_ref` | shared envelope typed source | input source binding、same-stream/version relation | H10 canonical revision/change字段按factory规则使用；telemetry不暴露值 | 不由subject、topic或payload推导 |
| `source_version_ref` | optional envelope version ref | canonical comparator input；不可比较即fail closed | 仅H10 canonical before/change/after允许的typed位置 | 不作schema、row version、cursor、time或metric label；comparator affected |
| `producer_family` | static operation-to-producer table | 必须为`Identity`；只证明协作入口身份 | finite telemetry label；不进入business truth | 不由payload字符串/config remap；payload registration仍open |
| `schema_version` | I03 schema registry | admission和retained result schema一致性 | finite telemetry label和stored decode relation | 不从payload/default/current config补值；upstream schema owner open |
| `dedup_key` | validated delivery metadata | logical reservation scope | idempotency row relation；不进入H10或telemetry字段 | 不作event/ref/digest；禁止日志与metric label |
| `occurred_at` | producer event metadata | source observation time only | owner允许的canonical source-time字段；不作H10 `recorded_at` | 不排序source version、不作local commit/cursor/retry time |
| `trace_ref` | optional validated envelope metadata | operation correlation only | optional span parent/H10 metadata；缺失保持`None` | 不作causation、dedup、business relation或metric label |
| trusted `actor_ref` | C-03 worker delivery projection，payload外传入 | effective local actor与scope gate | H10 typed actor metadata、允许的safe telemetry class | 不由subject、producer、transport peer、credential或payload字段替代 |
| `subject_ref` | upstream typed use-site + local relation gate | exact subject/snapshot lookup与target validation | H10 canonical subject/reference字段；telemetry只允许有限kind | 不写Identity subject truth；payload owner和binding proof仍open |
| `safe_summary_ref` | upstream already-redacted projection ref | optional exact relation input；`None`保持absence | 只在H10 factory已拥有的typed safe字段出现；不解引用body | 不使用raw summary/empty ref/current lookup；relation随binding affected |
| `freshness` | upstream finite owner + canonical mapper | freshness/source-version/policy decision输入 | 只能经accepted transition进入snapshot/H10 canonical change | 不直接写local state，不由time/version/bool默认；owner与mapper均open |

这张表的闭合方向始终是 incoming typed material -> local observation decision ->
Observability-owned state/history。不存在 H10、receipt、log、metric、span 或 outbox 反向
更新 Identity subject/profile/credential/membership/role/lifecycle truth 的路径。

#### 14.10.4 Object / port / flow 回指矩阵

| I03 责任 | Step 06 object / contract owner | Step 07 callable / port | Step 09 唯一承接 | 覆盖结论 |
|---|---|---|---|---|
| typed admission与input组装 | shared envelope、operation context、digest candidates、`ConsumeIdentityObservationContextInput` | `ObservationInboundInputAssembler::consume_identity_observation_context` | flow admission段 | `covered_with_affected_open`；payload/freshness/digest owner未全闭合 |
| logical与secondary reservation | operation scope、`ObservationInboundEventIdentity`、stored idempotency relation | `ObservationIdempotencyRepository::reserve/load_by_scope/load_by_inbound_event` | reserve/replay/probe段 | `covered_with_affected_open`；source-event Step06回指待传播 |
| subject/snapshot exact read | `SubjectObservationReference`、`ReferenceSnapshotStateRef`、repository version | `ReferenceMaintenanceRepository::get_snapshot_with_version`及canonical relation/resolver seam | relation proof段 | `covered_with_affected_open`；sole-row binding/comparator未关闭 |
| local state decision | canonical freshness policy、`ReferenceSnapshotTransition`或`ReferenceSnapshotCreated` | exact resolver/policy collaborator与`stage_snapshot` | transition/stage段 | `covered_with_affected_open`；I03 mapper与new-snapshot proof签名开放 |
| native history | H10 `ReferenceRefreshRecord`、metadata seed、tagged reference cursor | `ObservationUnitOfWork::assign_reference_cursor` + `append_refresh_record` | H10段 | `covered_with_affected_open`；跨Step UoW/cursor顺序传播开放 |
| immutable outbox follower | only an owner-authorized transition snapshot and exact ref pair | current outbox staging port | accepted follower段 | `covered_with_affected_open`；result中的lossless outbox source未关闭 |
| stored result与public receipt | `StoredObservationResult`、`ObservationConsumerResult`、public Consumer receipt/access overlay | `save_result/get_result` + response assembler | result/replay段 | `covered_with_affected_open`；quarantine悬空use及no-completion carrier开放 |
| completion与transport handoff | completed reservation relation；application result不含action | `mark_completed`；worker exact C-05 mapper/registrar | commit后handoff段 | `covered_with_affected_open`；indeterminate分支不得返回terminal completion |
| runtime telemetry | Step 15 finite log/metric/span vocabulary与redaction ceiling | runtime telemetry facade；无repository/UoW participant | 各phase旁路切口 | `covered_current` at design-record level；sink failure不改flow |

Step 09 只能展开最后一列已经登记的同一个 flow，不能新增
`GenericInboundConsumerFlow`、第二个 Identity resolver、第二个 H10 writer 或隐藏的
audit transaction。若任一 callable 的返回面不足，必须回到对应 affected owner，不能
在 flow 文档用伪代码字段补齐。

#### 14.10.5 分支、结果、telemetry 与 durable audit totality

| I03 terminal / suspension branch | public / stored surface | runtime telemetry | durable audit / local truth | worker handoff与当前状态 |
|---|---|---|---|---|
| malformed header、wrong consumer/producer、forbidden body | ephemeral typed rejection；无stored success | body-free admission log/counter，可无trace child | none；不开writer UoW | exact rejection mapper；`covered_current` |
| unsupported或ownerless schema/payload/freshness | `UnsupportedSchema`或canonical typed fail-closed surface | finite phase/result label，不记录field/body | none | upstream owners开放；`covered_with_affected_open` |
| reservation `Replay` | exact stored receipt + `Replayed` overlay | replay counter/span event，不记录key/digest | no new snapshot/H10/outbox/result/completion | exact stored action eligibility；`covered_with_affected_open` |
| reservation `Conflict` | typed conflict，不泄漏winner | finite conflict class | none | no terminal action guessed；`covered_with_affected_open` |
| reservation `InFlight` | delayed/in-flight surface | finite in-flight class | none | recovery/action owner仍affected；`covered_with_affected_open` |
| relation/comparator/freshness mapper fail closed | typed rejection/dependency/consistency surface | finite safe error class | none；已开UoW则rollback | no default freshness/first-row winner；`covered_with_affected_open` |
| `PreserveCurrent` / valid no-mutation | 仅既有owner允许的ephemeral或durable NoOp surface | no-mutation finite label | no snapshot stage、cursor或H10 | no implicit accepted refresh；`covered_with_affected_open` |
| accepted in-place mutation | fresh exact result after known full commit | post-commit accepted counter/log/span | one snapshot transition + one H10 + authorized followers in one UoW | C-05 mapper only after commit；`covered_with_affected_open` |
| accepted required-new-snapshot | exact old/new snapshot and H10 refs after known full commit | same accepted telemetry ceiling | old Invalid preserved + one new snapshot + one H10 | creation-proof signature affected；`covered_with_affected_open` |
| CAS/factory/H10/outbox/result/completion failure | no fresh success / no completed reservation | finite failure telemetry only | complete staged set rollback；no fallback audit | known-no-write recovery only；`covered_with_affected_open` |
| commit outcome unknown / probe unsupported | no safe completion surface | finite indeterminate telemetry without refs/keys/body | do not infer, append, compensate or delete H10 | no terminal action；shared carrier remains open |
| known commit后worker action失败 | original stored result remains replayable | transport completion failure telemetry | no rollback/rewrite/new H10 | retry/probe same stable relation；`covered_with_affected_open` |
| telemetry sink失败 | business/result branch unchanged | suppress/health path only，禁止self-recursion | no H10/gap/no-write/audit fallback | worker action unchanged；`covered_current` |

所有可达分支都已有设计记录或 affected 承接，没有“记录一条 generic audit 后继续”
的兜底分支。特别是 rejection、dependency outage、telemetry failure 和 commit unknown
都不能被转译成 gap、retention、handoff、evidence 或 no-write violation truth。

#### 14.10.6 Step 08 actor、error、幂等与审计门禁复核

| SOP 门禁 | I03 证明 | 结论 |
|---|---|---|
| public二级类型是否有owner/schema | shared envelope/receipt/access/error由S08-B拥有；I03只定义use-site | `pass_with_affected_open`；payload/freshness上游owner缺口仍显式 |
| trusted source actor例外是否有限 | 只允许matching I03 slot的Identity producer；trusted `actor_ref`仍单独通过C-03和scope gate | pass；producer不能绕过visibility、digest、source isolation、forbidden-body、idempotency或state gate |
| 引用是否保持不同语义 | source/event/version、subject/snapshot、record/result/outbox、trace/causation、dedup/cursor逐类分离 | pass；无cast、alias、prefix inference或locator复用 |
| duplicate/delayed/no-op/quarantine surface是否闭合 | Replay overlay、InFlight、NoOp边界已定义；public receipt不暴露悬空`QuarantineRef` | `pass_with_affected_open`；quarantine删除/回指与indeterminate carrier待shared修订 |
| 错误是否有限且不泄漏 | §12逐阶段映射到既有error/recovery surface，safe detail受§14 redaction ceiling约束 | pass at design-record level；不解析异常文本、不返回provider/body材料 |
| 幂等是否覆盖写入与重放 | logical + secondary identity、retained digest profile、result-before-complete、exact replay和unknown probe均已记录 | `pass_with_affected_open`；digest与shared completion传播开放 |
| mandatory durable audit是否唯一 | 只有known-committed真实reference mutation追加H10 | `pass_with_affected_open`；mapper/new-snapshot proof/UoW跨Step传播开放 |
| telemetry是否覆盖且不拥有truth | admission、reservation、replay、decision、UoW、H10、delivery与sink suppression均有有限切口 | pass at design-record level；不声称sink、dashboard、alert或测试已实现 |
| 后续flow是否唯一可定位 | 仅`ConsumeIdentityObservationContextFlow`，所有主要callable回指Step07 | `deferred_to_named_step`；`03-RPR-S09-PER-FLOW`继续open |

#### 14.10.7 Affected closure register for I03 coverage

| affected / blocker | 对本节 coverage 的影响 | 关闭责任与进入条件 | 当前状态 |
|---|---|---|---|
| `S08-E-I03-PAYLOAD-SCHEMA-01` | wire payload、decoder/encoder与schema registration不能宣称闭合 | L1-identity提供唯一canonical declaration和兼容注册；I03重新静态审查 | `open_upstream_internal` |
| `S08-E-I03-FRESHNESS-OWNER-01` | freshness finite vocabulary、编码及producer propagation不能由I03猜测 | 上游owner发布schema/encoder/relation；assembler缺失时继续fail closed | `open_upstream_internal` |
| `S08-E-I03-DIGEST-ORDER-01` | exact material已定义，但assembler/reservation/probe的共同消费尚未传播 | Step06/07修订并保持一次candidate生成与retained-profile比较 | `open_internal_affected` |
| `S08-E-I03-SOURCE-VERSION-COMPARATOR-01` | same-stream older/equal/newer决策缺唯一typed callable | owner提供comparator/accessor及不可比较分支 | `open_internal_affected` |
| `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` | subject/snapshot/source/visibility的sole-row proof未闭合 | Step06/07提供typed relation lookup、duplicate/missing与rehydration parity | `open_internal_affected` |
| `S08-E-I03-H10-INBOUND-MAPPER-01` | payload/freshness/relation到decision/transition/creation proof不能直连 | canonical mapper产生finite proof；缺失时不得stage snapshot/H10 | `open_internal_affected` |
| `S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01` | required-new-snapshot branch缺统一`(State, CreatedProof)`签名 | Step06 object owner统一签名后I03复核factory调用 | `open_internal_affected` |
| `S08-SOURCE-EVENT-REF-OWNER-01` | shared owner已建，但Step06旧use-site尚未全部回指 | affected修订只引用`contracts::refs`唯一声明 | `resolved_in_S08-B_step06_affected_open` |
| `S08-RESULT-ACCESS-LAYER-01` | current overlay语义已闭合，Step06旧duplicate表述仍待传播 | 删除generic durable duplicate表述并保持stored inner bytes不变 | `resolved_in_S08-B_step06_affected_open` |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | public receipt无法无损取得exact outbox refs | stored/application owner增加validated field/accessor；禁止current lookup | `open_internal_affected` |
| `S08-CONSUMER-QUARANTINE-REF-01` | shared application material仍有无owner use；I03不能暴露它 | 删除字段或回指既有owner，不在Step08建wrapper | `open_internal_affected` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | commit unknown时无合法C-05 no-completion carrier | Step06/07建立typed no-completion或收紧handler return | `open_internal_affected` |
| `R06-F-AFFECT-UOW-01` | I03顺序已固定，但Step09/11/13/15/16仍可能保留旧顺序/partial语义 | 按既有register传播snapshot -> cursor -> H10 -> result -> completion -> commit | `step07_surface_closed_downstream_open` |
| `03-RPR-S09-PER-FLOW` | 当前只有handoff contract，尚无current函数级flow | Step08稳定后在Step09逐接口重建，不得提前写入 | `open` |

`R06.6-F2-H13-UPSTREAM=open_controlled` 继续作为项目级既有 blocker，但不在 I03
的对象、port、branch或H10链路上；本节既不关闭它，也不把它错误列为 I03 direct
dependency。除表中既有项外，本次 coverage review 没有发现新的 canonical owner gap。

#### 14.10.8 Closure graph 与不可逆边界

```text
L1-identity canonical payload/freshness owners [open upstream]
  -> static I03 envelope/schema/producer admission
  -> exact typed assembler + one digest candidate set
  -> operation context + logical/secondary reservation
  -> exact subject/snapshot/source-version relation [affected]
  -> canonical freshness/H10 decision mapper [affected]
  -> snapshot transition or creation proof [signature affected]
  -> stage snapshot -> assign cursor -> construct/append H10
  -> stage authorized outbox -> stored result -> completion
  -> one known commit -> exact receipt -> worker C-05 mapper [shared affected]

runtime log / metric / span facade
  <- observes finite phase/result classes at bounded cut points
  -X-> reservation, snapshot, H10, result, worker action or Identity truth

H10 / receipt / outbox refs
  -X-> Identity truth, evidence linkage, retention marker, report handoff,
       gap state, no-write violation, verdict, signoff or external acceptance
```

上图中的每条正向边必须由其 current owner 提供 typed value/proof；任一开放边缺失时
只能停止、rollback或保持indeterminate。任何 telemetry 或下游引用都不能逆向补造
前序 proof，也不能把 Observability 投影升级为业务 truth。

#### 14.10.9 §14.10 stop review

| 检查项 | 结论 |
|---|---|
| public identity、caller/handler、signature、envelope、payload、input、result与error是否逐项回指 | `pass_with_affected_open`；canonical payload/freshness、shared result/completion等缺口均有既有ID |
| 每个incoming field是否有source、用途、durable/telemetry落点和禁止替代 | pass at design-record level；没有raw body、generic ref或identity合并逃逸 |
| target object、Step06 owner、Step07 port与唯一Step09 flow是否可追溯 | `pass_with_affected_open`；`ConsumeIdentityObservationContextFlow`仍只是handoff，不是已完成flow |
| admission、Replay、Conflict、InFlight、no-mutation、accepted、rollback、commit-unknown、post-commit action failure和telemetry failure是否全覆盖 | pass；不存在generic audit兜底或由telemetry选择业务action的分支 |
| H10是否仍是唯一mandatory durable audit landing且只在known-committed真实mutation成立 | pass；required-new-snapshot proof和跨Step UoW顺序继续affected |
| Identity truth、evidence、retention、handoff、gap、no-write、verdict、signoff与external acceptance是否保持非owner | pass；无反写或隐式授权路径 |
| I03六项专属affected与七项shared/cross-protocol affected是否全部保留 | pass；另保留`03-RPR-S09-PER-FLOW`，未新增blocker ID |
| 是否发现新的上游 blocker | no new blocker；两个L1-identity upstream gaps继续`open_upstream_internal` |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03不计入完成数 |
| 本批当前写入状态 | historical checkpoint；`I03 §14.7~§14.10 recorded_with_affected_open`，current状态由下方§14.11承接 |
| 正式文档、实现、测试、evidence、run_id与验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | historical checkpoint；当前由下方I03 §14.11 stop review承接 |
| 当前提交 | 不需要；用户未要求提交 |

### 14.11 I03 evidence linkage、retention marker 与 report handoff 非拥有边界

本节只闭合 I03 已提交 reference observation 如何成为后续 owner flow 的候选输入，
以及 I03 在任何分支都不能创建、更新或反推哪些下游事实。这里的“可供后续消费”
不等于自动触发，不等于同一 UoW follower，也不等于 I03 receipt、H10、outbox 或
telemetry 已经是 evidence、retention 或 handoff truth。

#### 14.11.1 Canonical owner、写口与 I03 权限矩阵

| 下游事实族 | Canonical object / native record | 唯一 application / repository 写口 | I03 可提供的已提交候选材料 | I03 禁止能力 |
|---|---|---|---|---|
| body-free evidence linkage | `EvidenceLinkage` + H3 `AuditAppendRecord` | `ObservationTruthWriteService::link_body_free_evidence`；`AuditEvidenceRepository::stage_linkage` / `append_audit_record` | 后续 owner 可按正式 relation 从 committed `ReferenceSnapshotStateRef`、H10/reference relation或授权 immutable event 中定位 body-free reference；必须重新完成 projection、boundary、purpose/scope、digest 与 visibility 校验 | 不 mint `EvidenceLinkageRef` / `AuditProjectionRef`，不调用 H3 写口，不把 I03 digest、safe summary、log/span、metric sample或H10当 evidence |
| retention / active protection | `RetentionMarker`、`ActiveReferenceProtection` + H5 `RetentionChangeRecord` | `ObservationTruthWriteService::set_retention_marker` / `protect_active_reference`；`RetentionGuardRepository::stage_retention` / `stage_active_protection` / `append_retention_record` | 后续 owner 可把 committed observation-side snapshot、record、result或outbox object，经 typed `ProtectedObservationRef` 与完整 policy/current-consumer snapshot重新评估 | 不 mint marker/protection ref，不因 freshness、stale、replay、gap、commit unknown或telemetry backend retention创建hold，不决定days、archive、cleanup或delete |
| report handoff | immutable `EvidenceIndexInputView`、`ReportHandoffRecord` + H4 `HandoffLifecycleRecord` | `ObservationTruthWriteService::prepare_report_handoff`；`ReportHandoffRepository::append_evidence_index_input` / `stage_handoff` / `append_lifecycle_record` | 后续 owner 只可消费已提交、body-free、visibility/retention/no-write guard通过的 immutable input relation；I03 material至多是该input的一个可追溯来源 | 不 mint handoff/input/hint ref，不调用 H4 写口或delivery port，不把 `Prepared`/`Delivered`说成external acceptance，不生成verdict、signoff、真实run id或evidence alias |

三类写入都是独立 logical operation，拥有自己的 operation context、幂等关系、
versioned read、domain decision、native history、stored result 和 commit 证明。它们不得
被附加到 `ConsumeIdentityObservationContext` 的 accepted UoW 中作为“顺手投影”。
I03 的 UoW 只允许 §10、§14.8~§14.9 已固定的 snapshot/H10、明确授权的 projection /
outbox follower、stored result 与 reservation completion。

#### 14.11.2 I03 字段与下游身份禁止转换矩阵

| I03 material | 后续 owner 允许的使用方式 | 明确禁止的转换或推论 |
|---|---|---|
| `subject_ref` / `ReferenceSnapshotStateRef` | 作为 committed reference relation 的 typed locator，由后续 owner执行exact lookup和visibility/policy校验 | cast为`AuditSubjectRef`、`GovernanceArtifactEvidenceReference`、`ProtectedObservationRef`、`EvidenceIndexInputViewRef`或handoff scope |
| H10 `ReferenceRefreshRecordRef` | 证明本仓一次已提交reference transition的历史身份；后续 flow可在其owner允许时引用 | 当作Identity source audit、`AuditProjectionRef`、`EvidenceLinkageRef`、retention decision、handoff readiness或external acceptance |
| `safe_summary_ref` | 只在 I03/H10 既有typed optional位置使用；后续 owner如需summary必须经自己的resolver/relation重新校验 | 解引用body、转换为`DigestSummary`、evidence index input、authenticity hint、report body或verdict |
| `source_event_ref` / `source_ref` / `source_version_ref` / `freshness` | 保留原source/version/freshness语义；后续 owner只能通过正式typed relation引用 | 推导evidence purpose/scope、retention purpose/state、handoff consumer/readiness、archive eligibility或cleanup authority |
| I03 retained request digest | 仅用于 I03 reservation/replay integrity | 复用为evidence linkage digest、handoff package digest、outbox payload digest、authenticity proof或external token |
| `StoredObservationResultRef` / public `result_ref` | 原I03结果的private lookup pointer与body-free public identity | 当作evidence alias、handoff record、Job execution/run identity、acceptance evidence或signoff |
| `outbox_refs` | 只引用本次accepted UoW已冻结的exact immutable outbox pair | 推断subscriber已消费、handoff已交付、evidence已链接、retention已建立或外部系统已接受 |
| `trace_ref` / runtime log、metric、span | out-of-band correlation与运行诊断 | 创建durable correlation/evidence、证明commit、触发retention/handoff或补造缺失owner fact |

任何跨类型关系必须由下游 owner 的明确 typed factory / resolver / repository lookup
产生。相同底层 `BodyFreeRef` bytes、字符串前缀、时间接近、同一 trace 或同一 outbox
都不能充当关系证明。

#### 14.11.3 分支级 no-downstream-write totality

| I03 分支 | Evidence linkage | Retention / protection | Report handoff | 必须保留的结果语义 |
|---|---|---|---|---|
| admission/schema/actor/body reject | none | none | none | body-free typed reject；不开 downstream UoW |
| reservation `Replay` | no new H3/linkage | no new H5/marker | no new H4/handoff | exact stored I03 surface + `Replayed` overlay；旧refs不升级语义 |
| `Conflict` / `InFlight` | none | none | none | conflict/delayed surface；不把等待或冲突变成hold/evidence gap |
| relation/comparator/mapper fail closed | none | none | none | typed dependency/consistency failure；不得以generic audit补偿 |
| `PreserveCurrent` / valid no-mutation | none | none | none | owner允许的ephemeral或durable NoOp；不能因“已观察”自动链接或保留 |
| accepted in-place / required-new-snapshot | none in I03 UoW | none in I03 UoW | none in I03 UoW | 只提交snapshot + one H10 + authorized followers/result/completion；known commit后材料才可能被后续owner读取 |
| known rollback | none | none | none | 所有staged I03事实回滚；没有可供下游消费的新committed ref |
| commit outcome unknown | none and no trigger | none and no trigger | none and no trigger | 保持indeterminate；禁止为“保守审计/保留/交接”追加任何事实 |
| post-commit worker action failure | no compensation linkage | no compensation hold | no compensation handoff | 原I03 commit保持；按stable identity恢复transport action |
| telemetry sink failure | none | none | none | 只走suppression/health；不得创建durable fallback |

#### 14.11.4 合法的后续 owner handoff

```text
ConsumeIdentityObservationContext [I03 logical operation]
  -> tx: snapshot + H10 + authorized followers + stored result + completion
  -> commit: known success
  -> output: exact committed typed refs only

later named owner operation
  -> read: committed refs and exact versions/relations
  -> validate: body-free + visibility + purpose/scope + retention/no-write guards
  -> decide: owner-specific domain policy
  -> tx: H3 evidence OR H5 retention OR H4 handoff
  -> commit: independent owner result
```

关键说明：

- 三个 `OR` 分支彼此也不构成默认级联；建立 evidence linkage 不自动放置 retention marker，也不自动准备 report handoff。
- 后续 owner 必须从 committed repository / immutable snapshot读取，不能读取 I03 staged state、当前 worker内存、telemetry sink或异常文本。
- I03 outbox若有正式事件，只是一个已提交协作输入；subscriber success、delivery、owner transition与external acceptance仍各有自己的证明。
- 下游 owner缺输入、relation重复、visibility受限、retention/no-write guard阻断或版本冲突时必须按自身协议fail closed；不得回写I03结果或Identity truth。

#### 14.11.5 I03 最小依赖切片与 capability isolation affected

Step 06 current `ObservationInboundEventDependencies` 是九个 Consumer 共用的宽依赖束，
物理上同时暴露 `AuditEvidenceRepository`、`ReportHandoffRepository` 与
`RetentionGuardRepository`。其“concrete implementation只使用operation-specific
subset”目前是文字约束，不能证明 I03 method 在编译期不可调用 H3/H4/H5 写口。

I03 concrete delegate 的最小依赖切片必须收敛为下表；实现命名可由 Step 06/07
统一，但 capability 集合不能扩大：

| I03 dependency group | I03需要的能力 | 明确不得注入 |
|---|---|---|
| transaction / identity | UoW manager、clock、ID generator，仅用于I03 reservation、snapshot/H10/result/outbox identities | external-effect token、handoff/evidence/retention identity mint |
| I03 integrity | idempotency、stored result、exact result mapper/probe | other-operation result reconstruction、generic duplicate outcome |
| reference owner | `ReferenceMaintenanceRepository`、canonical subject/snapshot resolver、comparator/mapper在其affected关闭后的typed seam | `AuditEvidenceRepository`、`ReportHandoffRepository`、`RetentionGuardRepository` |
| authorized followers | exact I03-compatible projection/outbox capability；没有registered payload时保持empty | generic event builder、current-truth publisher、H3/H4/H5 follower |
| runtime telemetry | redacted out-of-band telemetry facade | repository/UoW回调、generic durable audit fallback |

登记 `S08-E-I03-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected`。关闭条件是
Step 06/07 将 I03 concrete delegate / private dependency view 写成可验证的最小能力结构，
Step 09 的 `ConsumeIdentityObservationContextFlow` 逐调用证明没有 H3/H4/H5 或 external
delivery path，并规划 compile-time dependency test / forbidden-call scan。不得通过“代码
评审时注意”关闭，也不得复制三个 repository trait 制造 read-only alias。

#### 14.11.6 §14.11 stop review

| 检查项 | 结论 |
|---|---|
| evidence、retention/protection、handoff是否各自回指唯一object/service/repository/native history owner | pass；H3/H5/H4写口与I03 H10 owner保持分离 |
| I03 committed material是否只作为后续owner的候选输入，而不自动成为下游truth | pass；后续必须重新读取、校验、决策并独立提交 |
| subject/snapshot/H10/summary/digest/result/outbox/trace是否禁止跨语义转换 | pass；无ref cast、prefix inference、current lookup或telemetry proof |
| reject/replay/conflict/in-flight/no-op/accepted/rollback/unknown/post-commit action failure/telemetry failure是否均有no-downstream-write结论 | pass |
| I03 accepted UoW是否仍只包含snapshot、one H10、授权followers、stored result与completion | pass；没有H3/H4/H5或external delivery side effect |
| dependency capability是否已经结构化闭合 | `affected_open`；新增`S08-E-I03-DOWNSTREAM-WRITE-CAPABILITY-01`，宽依赖束尚不能证明compile-time isolation |
| 是否发现新的上游 blocker | no；两个L1-identity upstream gaps继续`open_upstream_internal`，本节只新增一个本仓internal affected |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件 complete；I03不计入完成数 |
| 本批当前写入状态 | historical checkpoint；`I03 §14.7~§14.11 recorded_with_affected_open`；current状态由§14.12承接 |
| 正式文档、实现、测试、evidence、run_id与验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | historical checkpoint；当前由§14.12 stop review承接 |
| 当前提交 | 不需要；用户未要求提交 |

本节恢复点为
`Step08_S08-E_I03_S01-S13_plus_S14.1-S14.11_recorded_with_affected_open_waiting_user_before_I03_S14.12`；
该值只作历史回溯，current恢复点由§14.12 stop review承接。

### 14.12 I03 全结果分支 closure matrix

本节是 §14.7~§14.12 批次的最终收口，只把 I03 已定义的 admission、reservation、
reference decision、UoW、stored result、telemetry、H10 和 downstream non-owner 结论
压成一个可实现的全结果判定契约。它不新增 public outcome、stored disposition、
recovery class、durable record 或 transport action。共享
`ObservationConsumerOutcome` 支持某个 variant，不等于 I03 fresh invocation 已经拥有
产生该 variant 所需的 marker、policy 或 mapper。

#### 14.12.1 Reachability class 与判定优先级

I03 对结果 surface 使用五种 reachability class：

| class | 严格含义 | I03 当前代表分支 |
|---|---|---|
| `fresh_direct` | current I03 owner 在所有 affected 关闭后可由本次调用直接形成 | known-committed reference mutation -> stored `Accepted` |
| `fresh_owner_conditional` | shared carrier允许，但必须先存在具名 local owner、marker和policy；I03不得仅凭payload或错误自行形成 | durable `NoOp`、`Rejected`、`Quarantined`、`DeadLettered` |
| `ephemeral_direct` | 未形成stored result；只允许shared ephemeral shape及typed error | `Delayed`、`Rejected`、`UnsupportedSchema` |
| `replay_overlay` | 本次调用只验证并返回旧stored inner surface；outer access为`Replayed` | completed compatible duplicate，inner outcome保持原值 |
| `no_completion_fail_closed` | 当前事实不足以安全构造receipt或C-05 completion | corrupt completed relation、commit/rollback unknown、unsupported probe |

结果判定顺序固定如下。后一步不得回写或重分类前一步已经确定的事实：

```text
static I03 slot and authenticated actor
  -> envelope/header/schema/body-free admission
  -> typed payload/input and one digest candidate set
  -> atomic logical + secondary reservation
  -> exact replay validation OR one writer lane
  -> subject/snapshot/source-version/freshness relation decision
  -> no-mutation OR accepted transition/creation proof
  -> stage complete local write set and reservation completion
  -> establish commit certainty
  -> construct and validate Stored/Ephemeral receipt surface
  -> invoke the exact I03 C-05 mapper once, if a legal completion exists
```

以下优先级规则是强制的：

1. `Replay`、`Conflict` 和 `InFlight` 由 reservation relation 决定，不能由当前
   snapshot、H10 或 worker policy 覆盖。
2. `Accepted` 只能在完整 writer UoW 已知提交后形成；`save_result`、
   `mark_completed`、H10 append 或 span success 均不能单独产生它。
3. `NoOp` 需要 canonical no-change decision 和显式 durable owner；
   `PreserveCurrent` 本身不足以制造 stored receipt。
4. `Quarantined` / `DeadLettered` 需要各自已提交的 body-free marker relation；
   forbidden-body检测、error severity或预期 transport action均不能替代marker。
5. commit/probe仍unknown时不选择结果 winner，不构造 speculative receipt，
   也不调用 C-05 terminal action。

#### 14.12.2 Phase-to-result total matrix

| phase / exact condition | application / public surface | reservation、UoW 与 durable facts | runtime telemetry | completion与closure |
|---|---|---|---|---|
| static slot、required header或source-event ref缺失/畸形 | typed error；允许`Ephemeral { Rejected }`，仅missing/malformed source-event时`source_event_ref=None` | no digest、reservation、writer UoW、result或H10 | body-free admission rejection；不得记录raw header/body | exact producer/input policy尚需I03 action mapper；不得wildcard action |
| actor不可信、operation/body mismatch或body-free guard拒绝 | `Ephemeral { Rejected }`或typed error | no writer admission；不得创建safety/downstream marker | finite rejection/error class | outcome不自动授权ack/dead-letter |
| producer/schema/discriminator unsupported，或canonical payload decoder不存在 | `Ephemeral { UnsupportedSchema }`；有安全header时保留source event | no payload interpretation、digest、reservation或marker | schema-rejected counter和有限phase | unchanged frame无默认Retry；payload owner blocker保持fail closed |
| freshness owner结构性缺失或值不可兼容 | typed fail-closed `Rejected`/`UnsupportedSchema` only when exact mapper owns it；否则typed error | no snapshot decision、H10或accepted result | owner/dependency finite class | 不把unknown/default变成Fresh；action mapper affected |
| freshness、summary backing、resolver或repository暂时不可用，且已证明无accepted write | `Ephemeral { Delayed }` | 未reserve则zero write；已Acquired则完整rollback，不留Completed | dependency/delayed class | 只有recovery class允许且loop bound满足时Retry才可能合法 |
| canonical digest encoding/profile construction失败 | typed deterministic application error；不得伪造receipt | no reservation或writer fact | safe encoding failure class；无material bytes | no generic completion；不得改用raw hash |
| reservation relation为`Conflict` | `Ephemeral { Rejected }`或typed conflict error；不暴露winner surface | incoming writer未获得权限；existing row不变 | finite idempotency conflict | no default action；same input不可通过新key盲重试 |
| reservation relation为`InFlight` | `Ephemeral { Delayed }` | no second writer、result、cursor或H10 | in-flight class | bounded state-change policy才可Retry；不得递归handler |
| `Replay`且scope/event/digest/result/bytes/receipt全部验证通过 | `Stored { Replayed, original inner surface }` | incoming UoW无写；不新增snapshot/H10/outbox/result/completion | replay access；不重复accepted refresh | shared目标为ack当前duplicate；exact I03 mapper传播仍affected |
| completed reservation的pointer、kind、schema、digest、bytes或receipt任一失配 | consistency error；无Stored/Ephemeral success receipt | no repair、alias、rerun或current-truth reconstruction | stored replay defect + consistency class | `no_completion_fail_closed`；manual/probe owner处理 |
| subject/snapshot relation missing、duplicate、foreign，或source-version不可比较 | typed relation/consistency error；可由exact mapper形成ephemeral rejection/delay | no accepted transition；已Acquired则rollback | finite relation/comparator class | 不first-row-wins、不按time/cursor排序；action待exact mapper |
| canonical decision为`PreserveCurrent`，但没有durable no-op owner | typed deferred/error surface；不得声称Stored NoOp | no snapshot stage、cursor、H10、stored result或completion | finite no-mutation/deferred class | no generic ack；owner缺失时fail closed |
| canonical owner授权durable no-change | `Stored { FreshlyCommitted, NoOp }` | reservation + exact empty receipt/result + completion同UoW；无snapshot/H10/cursor/outbox | known commit后no-op；不计accepted refresh | acknowledgement target only after exact mapper and policy |
| accepted in-place reference transition | `Stored { FreshlyCommitted, Accepted }` | one snapshot CAS + oneReferenceCursor + oneH10 + authorized followers/empty outbox + result + completion，同一UoW | known commit后accepted/reference-refresh；stage时不报accepted | acknowledgement target after full commit and receipt validation |
| accepted `RequireNewSnapshot` | `Stored { FreshlyCommitted, Accepted }` | old Invalid保留；one new snapshot proof + one cursor + one H10 + followers/result/completion，同一UoW | 与in-place相同的post-commit ceiling | new-snapshot proof与mapper affected；不得原地覆盖旧row |
| durable `Rejected` 被提议 | shared stored shape支持，但I03 fresh path只有在具名negative owner和same-UoW result policy存在时可达 | current I03不得只写result作为durable rejection | 只在known commit后记录durable-negative class | 当前为`fresh_owner_conditional`；outcome本身不选action |
| durable `Quarantined` 被提议 | shared stored shape支持；当前I03不得mint无owner `QuarantineRef`或raw-material marker | 只有既有body-free quarantine/safety owner的完整marker/result UoW才可达 | 不记录raw body；只记录有限terminal class | 当前为`fresh_owner_conditional`；无默认ack/dead-letter |
| durable `DeadLettered` 被提议 | shared stored shape支持；必须先有canonical local dead-letter fact | marker、result、error和completion须已知同批提交；transport调用不创建marker | local terminal与transport result分开 | marker存在后才可能选择DeadLetter；当前I03无自动路径 |
| CAS、factory、H10、outbox、result save或completion stage失败 | typed application/domain/persistence error；无fresh success | rollback complete staged set；无visible snapshot/H10/result/Completed | finite failure/rollback；不报accepted refresh | known-no-write recovery only；不得fallback audit transaction |
| commit已证明abort/not committed | typed known-no-write error；可由owner映射为Delayed | no committed reservation/result/H10 | UoW known rollback/failure | Retry仅在dependency recovery class与same identity规则允许时 |
| commit/rollback或exact probe为`Unknown/Unsupported` | no legal current receipt | 不推断snapshot/H10/result/completion存在或不存在；不补写/删除 | indeterminate，且字段保持body-free | no C-05 action；shared indeterminate affected保持open |
| local commit已知成功，但ack/dead-letter transport调用失败 | original Stored result仍为权威；worker返回typed transport failure | committed facts不回滚、不改写；后续相同identity走probe/replay | worker delivery failure；不重复accepted | 不重跑handler；后续只用原relation恢复delivery |
| log/metric/span sink失败或signal被allowlist抑制 | 原application/public result完全不变 | no repository、UoW、gap、no-write或downstream fallback | suppression/sink-failure non-recursive signal | action和retry资格不变 |

#### 14.12.3 Receipt field presence closure

`Stored` 与 `Ephemeral` 是互斥形状；实现不得先构造一个空Stored receipt再用
`result_ref=None`模拟ephemeral，也不得给ephemeral附加空集合占位。I03 exact response
assembler只消费当前 invocation 已验证的stored surface或typed error，不读取current
snapshot、H10、outbox、gap或dead-letter store补字段。

| result surface | access / result_ref | changed / outbox / gap refs | dead-letter / error | I03 reachability rule |
|---|---|---|---|---|
| fresh stored `Accepted` | `FreshlyCommitted`；public result ref required，internal result pointer不公开 | changed refs仅来自同一accepted transition；outbox为exact authorized set或empty；gap必须empty | dead-letter None；error None | `fresh_direct` only after known full commit |
| fresh stored `NoOp` | `FreshlyCommitted`；result ref required | all three collections empty | dead-letter None；error None | `fresh_owner_conditional`；canonical no-op owner required |
| stored replay | `Replayed`；保留original public result ref | original canonical collections byte-for-byte；本次不得增删/重排 | original dead-letter/error co-presence | `replay_overlay`；inner outcome可以是任一合法stored outcome |
| fresh stored `Rejected` | `FreshlyCommitted`；result ref required | changed empty；outbox/gap只能来自该negative owner的committed surface | dead-letter None；safe error Some | `fresh_owner_conditional`；current I03不得只为审计而创建 |
| fresh stored `Quarantined` | `FreshlyCommitted`；result ref required | 仅canonical body-free marker relation允许的refs；public surface不暴露无owner `QuarantineRef` | dead-letter None；safe error Some | `fresh_owner_conditional`；raw material始终absent |
| fresh stored `DeadLettered` | `FreshlyCommitted`；result ref required | normal changed/outbox empty；gap只可来自owner surface | dead-letter Some；safe error Some | `fresh_owner_conditional`；marker须先于transport handoff成立 |
| ephemeral `Rejected` | no access、result ref或ref collections | structurally absent | error required；source event仅shared header rule允许时出现 | `ephemeral_direct`或typed error mapper |
| ephemeral `Delayed` | no access、result ref或ref collections | structurally absent | error required；validated source event required | `ephemeral_direct`，且只表达本次无stored result |
| ephemeral `UnsupportedSchema` | no access、result ref或ref collections | structurally absent | exact schema error required；validated source event required | payload未解码、未reserve |
| consistency / indeterminate | no legal receipt | no speculative empty collections | entry-local safe error only；不得伪造成public success | `no_completion_fail_closed` |

`gap_refs` 在 fresh I03 accepted/no-op UoW 中为空，因为 I03 不拥有 gap transition；
`outbox_refs` 必须来自 accepted UoW 的 immutable stored surface，不能由response assembler
查询补值。两项规则分别承接 §14.11 no-downstream-write 边界和
`S08-CONSUMER-OUTBOX-SURFACE-01`，不创建新的结果 owner。

#### 14.12.4 Local truth、telemetry 与 downstream permission closure

| result class | snapshot / H10 | stored result / completion | telemetry emission ceiling | H3 evidence / H5 retention / H4 handoff |
|---|---|---|---|---|
| fresh `Accepted` mutation | exactly one accepted snapshot change and one H10 | same UoW，result before completion | accepted only after known commit | zero；committed refs仅可作为后续owner候选输入 |
| owner-authorized `NoOp` | none | exact no-op result/completion only | no-op after known commit；no accepted-refresh metric | zero |
| stored replay | none in current invocation | exact read only；no new completion | replay access only | zero |
| ephemeral result / typed pre-writer error | none | none | finite rejected/delayed/unsupported/error class | zero |
| owner-conditional durable negative | no H10 unless an independent real reference mutation also satisfies I03 accepted proof；当前不得捆绑 | only the named negative owner may authorize stored result | post-commit durable-negative class only | zero by I03；不得把negative result自动升级为H3/H4/H5 |
| known rollback | none visible | none visible | rollback/failure only | zero |
| commit unknown | unknown and not inferred | unknown and not inferred | indeterminate only | zero；不得以“保守留存”补写 |
| post-commit worker action failure | preserve original committed set | preserve original result/completion | delivery failure separate from local outcome | zero |
| telemetry sink failure | unchanged | unchanged | non-recursive suppression/failure only | zero |

任何一行都不允许反写 Identity subject/profile/credential/membership/role/lifecycle
truth，也不允许用 log、metric、span、receipt或worker action证明evidence真实性、retention
授权、report delivery、verdict、signoff或external acceptance。

#### 14.12.5 C-05 completion target 与 action-owner缺口

`InboundConsumerCompletion` 仍是唯一transport-action carrier。I03 application result
不携带action；worker必须在receipt完整验证和commit certainty确定后调用一个exact、
total、无wildcard的I03 mapper。当前Step06/07只声明“operation-specific subset / exact
mapper”，没有给出可定位的I03 mapper signature或以下全分支映射owner。

| validated I03 surface | target / prohibition | precondition | current closure |
|---|---|---|---|
| `Stored/FreshlyCommitted/Accepted` | target `Acknowledge` | whole UoW known committed；receipt/result relation validates | target fixed；exact mapper owner/propagation open |
| `Stored/Replayed`，任一original inner outcome | target `Acknowledge` for current duplicate delivery | exact reservation/result/bytes/receipt validation；handler未重跑 | shared target fixed；I03 exact mapper propagation open |
| owner-authorized `Stored/FreshlyCommitted/NoOp` | target `Acknowledge` | canonical no-change owner、stored result和commit均验证 | conditional target；owner/action mapper open |
| owner-authorized stored `DeadLettered` | target `DeadLetter` only | local dead-letter marker/result已知提交；transport handoff尚未执行 | conditional target；不得用action反向创建marker |
| owner-authorized stored `Quarantined` | no default terminal action | body-free isolation marker/result与exact policy均存在 | open；不能从outcome选择ack或dead-letter |
| stored或ephemeral `Rejected` | no generic action | exact producer/policy/recovery classification | open；error severity与`retryable` bit不足以选action |
| ephemeral `UnsupportedSchema` | no default action | exact schema/producer correction policy | open；禁止盲重试unchanged frame |
| ephemeral `Delayed` + retryable dependency class | `Retry` may be selected | proven no accepted write、bounded loop、same stable identity | open；不得立即递归或mint新key |
| ephemeral `Delayed`但recovery不允许retry | no `Retry` | state/manual/input-change class | exact policy必须给出合法非wildcard结果 |
| consistency defect、missing/corrupt completed result | no C-05 action | no valid receipt exists | fail closed；manual/probe owner处理 |
| commit/probe unknown | no C-05 action | absence of certainty is decisive | blocked by shared indeterminate-completion affected |
| action execution failure after commit | return typed worker failure；do not reclassify result | original stored relation remains valid | later delivery uses exact replay path |

登记
`S08-E-I03-ACTION-MATRIX-01=open_internal_affected`。关闭条件必须同时满足：

1. Step 06/07 为 I03 worker delegate提供唯一可定位的pure mapper seam，输入至少覆盖
   commit certainty、Stored/Ephemeral branch、inner outcome、result access、ref/error
   presence、`ObservationRecoveryClass`和I03 transport policy。
2. mapper 对上表每一行返回一个明确的 C-05 variant，或在shared carrier修复后返回
   typed no-completion；不得使用default arm、error string或generic Consumer policy。
3. Step 09 `ConsumeIdentityObservationContextFlow` 只调用该mapper一次，且调用发生在
   receipt验证/commit probe之后、transport registrar之前。
4. Step 16 必须以表驱动切口覆盖fresh/replay/no-op/negative/ephemeral/conflict/
   in-flight/consistency/unknown/action-failure分支；此处只登记未来验证义务，不声称测试存在。

该affected与`S08-CONSUMER-INDETERMINATE-COMPLETION-01`不同：前者覆盖所有commit
已知分支的I03 exact mapping owner，后者专门覆盖probe仍unknown时C-05没有合法返回
shape。两者都必须保留，不能用其中一个代替另一个。

#### 14.12.6 Deterministic implementation assertions

Step 09/实现只能按以下断言展开，不得引入第二套结果决策：

1. `Stored` 与 `Ephemeral` 互斥；任何stored branch都必须有validated public result ref，
   任何ephemeral branch都不得携带result/change/outbox/gap/dead-letter refs。
2. `FreshlyCommitted` 需要known full commit；`Replayed`需要exact completed relation和
   immutable bytes验证；两者都不能由caller、transport attempt或telemetry指定。
3. fresh `Accepted` 必须能回指一个accepted transition/creation proof、same post-state、
   one H10、stored result和completion；缺一项即不是Accepted。
4. fresh `NoOp` 的changed/outbox/gap集合为空且无H10；没有owner时不得退化为empty
   Accepted。
5. fresh `Quarantined` / `DeadLettered` / durable `Rejected` 必须携带各自owner proof；
   current I03 dependency slice不得为获得该proof而调用H3/H4/H5。
6. consistency defect与commit unknown都不允许构造receipt；它们也不能通过
   `Ephemeral { Rejected }`隐藏已存在或可能存在的durable relation。
7. telemetry只消费已经确定的phase/result；sink failure不得重新进入mapper、UoW或
   downstream owner。
8. exact C-05 mapper是最后一个pure decision seam；registrar只执行选定action，不能
   重分类、补receipt或读取repository。

#### 14.12.7 Affected closure register

| affected / blocker | §14.12受影响的结果面 | required closure | current state |
|---|---|---|---|
| `S08-E-I03-PAYLOAD-SCHEMA-01` | canonical decode之前只能Unsupported/fail closed | upstream declaration、wire/encoder/registration | `open_upstream_internal` |
| `S08-E-I03-FRESHNESS-OWNER-01` | freshness结构/传播不明时无accepted/no-op decision | upstream finite owner与producer propagation | `open_upstream_internal` |
| `S08-E-I03-DIGEST-ORDER-01` | reserve/replay/probe必须比较同一candidate material | Step06/07一次生成和retained-profile消费 | `open_internal_affected` |
| `S08-E-I03-SOURCE-VERSION-COMPARATOR-01` | older/equal/newer与incomparable branch无法落到唯一owner | typed same-stream comparator | `open_internal_affected` |
| `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` | accepted/rejected/consistency precedence缺sole-row proof | typed relation lookup与parity | `open_internal_affected` |
| `S08-E-I03-H10-INBOUND-MAPPER-01` | accepted/no-mutation分界与transition proof缺唯一mapper | finite decision + transition/creation proof | `open_internal_affected` |
| `S08-E-I03-DOWNSTREAM-WRITE-CAPABILITY-01` | 结果矩阵虽规定H3/H4/H5 zero-write，但宽依赖束不能编译期证明 | minimal private dependency view + forbidden-call validation | `open_internal_affected` |
| `S08-E-I03-ACTION-MATRIX-01` | commit已知后的各result branch缺exact C-05 mapper owner | pure total I03 mapper + Step09/16 propagation | `open_internal_affected` |
| `S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01` | required-new-snapshot Accepted proof签名未统一 | canonical `(State, CreatedProof)` surface | `open_internal_affected` |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | stored Accepted/replay的outbox refs缺lossless application source | owner field/accessor；no current lookup | `open_internal_affected` |
| `S08-CONSUMER-QUARANTINE-REF-01` | shared application carrier仍有无ownerref；I03 fresh quarantine不可据此成立 | 删除use或回指已有owner | `open_internal_affected` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | commit/probe unknown无legal receipt/completion | typed no-completion或收紧handler signature | `open_internal_affected` |
| `S08-SOURCE-EVENT-REF-OWNER-01` / `S08-RESULT-ACCESS-LAYER-01` | source identity与Fresh/Replayed层已在S08-B闭合，但Step06旧use仍待传播 | 只回指shared current owner | `resolved_in_S08-B_step06_affected_open` |
| `R06-F-AFFECT-UOW-01` | result-before-complete、one cursor/H10与commit certainty需跨Step一致 | Step09/11/13/15/16传播 | `downstream_open` |
| `03-RPR-S09-PER-FLOW` | 本矩阵还未成为函数级调用链 | 唯一`ConsumeIdentityObservationContextFlow`逐调用展开 | `open` |

新增 action-matrix affected 后，本节不再存在没有ID承接的结果分支缺口。这里的
`closure` 仍是设计记录层面的 complete branch classification，不表示任何affected
已关闭、代码已存在、测试已运行或runtime行为已验证。

#### 14.12.8 §14.12 stop review

| 检查项 | 结论 |
|---|---|
| 是否覆盖static admission、schema/owner、dependency、Conflict、InFlight、Replay、relation、no-mutation、Accepted、durable negative、rollback、unknown、post-commit action与telemetry failure | pass；每一行均有surface、local truth、telemetry、completion和downstream边界 |
| shared outcome可表达与I03 fresh reachability是否分离 | pass；`Accepted`为direct，NoOp/Rejected/Quarantined/DeadLettered为owner-conditional，三类ephemeral、replay和no-completion分别处理 |
| Stored/Ephemeral字段presence是否闭合 | `pass_with_affected_open`；outbox source、quarantine use与indeterminate carrier保持shared affected |
| H10是否仍只属于known-committed真实reference mutation | pass；NoOp、negative、replay、reject、failure和unknown均不创建H10 |
| evidence/retention/handoff是否在全部结果行保持zero-write | pass；`S08-E-I03-DOWNSTREAM-WRITE-CAPABILITY-01`继续要求结构化能力隔离 |
| C-05 action是否可无歧义回指owner | `affected_open`；新增`S08-E-I03-ACTION-MATRIX-01`，因为commit已知分支仍缺唯一pure/total I03 mapper seam |
| 是否发现新的上游blocker | no；两个L1-identity upstream gaps继续开放；新增项只属于本仓internal affected |
| I03专属affected是否完整 | pass；当前8项：2项`open_upstream_internal`、6项`open_internal_affected` |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件complete；I03仍为`pending_per_protocol_review` |
| 本批写入状态 | `S08-E-I03_S01-S13_plus_S14.1-S14.12_recorded_with_affected_open`；§14.7~§14.12批次完成，I03 §15~§17与其他协议仍未完成 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | 停审并等待用户明确确认；确认后只定位并进入I03 §15，不进入§16~§17、I04~I09、S08-F/G或Step09 |
| 当前提交 | 不需要；用户未要求提交 |

本节历史恢复点为
`Step08_S08-E_I03_S01-S13_plus_S14.1-S14.12_recorded_with_affected_open_waiting_user_before_I03_S15`；
用户已经确认进入 §15，current 恢复点由下方 §15 stop review 承接。

## 15. I03 affected register

本节把 §1~§14.12 已识别的 I03 缺口收敛为 owner-oriented closure register。
§14.10 与 §14.12 中的 affected closure table 用于说明 coverage 和结果分支受何
影响；本节才是 I03 专属 affected 的完整登记面。登记不创建新 owner，不把目标
shape 当成现有实现，也不以“后续 Step 会处理”代替具名关闭条件。

### 15.1 登记与关闭规则

1. `open_upstream_internal` 表示唯一 canonical owner 应位于上游项目；
   L4-observability 只能保留 use-site、fail-closed 行为与兼容性要求，不能复制类型。
2. `open_internal_affected` 表示 owner 位于本项目现有 Step 06/07/08/09/16 边界，
   但 exact signature、carrier、mapper 或能力切片尚未完整传播。
3. 一项 affected 只有在 canonical owner、全部 I03 use-site、错误/absence 行为和
   对应后续验证切口均可回指时才可关闭；只补类型名、trait method 或说明文字不算关闭。
4. shared/cross-protocol affected 由其共享 owner 关闭。I03 可以提供消费约束和
   回归检查，但不得把 I03 局部矩阵标记成 shared closure。
5. 本节不把任何 open 项改成 resolved，不增加协议完成计数，也不声称代码、测试、
   runtime evidence 或验收结果存在。

### 15.2 I03 protocol-specific affected

| ID | status | affected question | closure required | forbidden shortcut |
|---|---|---|---|---|
| `S08-E-I03-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | L1-identity current材料没有可独立定位的`IdentityObservationContextPayload` canonical declaration、wire schema、producer encoder及schema/discriminator registration；Observability当前只有三字段use-site | L1-identity发布唯一payload owner，固定字段类型/顺序、unknown-field与version兼容规则、producer factory/encoder和注册项；I03 assembler只消费该声明并对未注册版本fail closed | 从I03 use-site反推wire DTO、在Observability声明同名类型、结构相似即接受或用generic map解码 |
| `S08-E-I03-FRESHNESS-OWNER-01` | `open_upstream_internal` | `ReferenceFreshnessState`缺可回指的finite variants、wire encoder及producer到subject/snapshot/source-version relation；I03不能判断一个token是否为合法freshness observation | 上游唯一owner发布finite schema、constructor/encoder、unknown variant行为和I03 producer propagation；Step06/07按原类型无损承接，缺失/unknown/incomparable保持fail closed | 用`occurred_at`、source version、cursor、repository version或默认`Fresh`替代freshness |
| `S08-E-I03-DIGEST-ORDER-01` | `open_internal_affected` | §8已固定I03 digest frame、字段顺序、presence tag和排除集，但assembler、reservation、stored-result replay/probe尚未证明消费同一组一次生成的candidates | Step06 context/factory生成唯一`inbound_consumer_request` candidate set；Step07 assembler、idempotency port和probe只传递/比较该opaque set；retained profile与当前profile有显式兼容判断 | hash raw envelope/broker bytes、在各层重算、把dedup/trace/time/transport/local effects加入digest或只保留单一winner digest |
| `S08-E-I03-SOURCE-VERSION-COMPARATOR-01` | `open_internal_affected` | I03已禁止按时间/cursor/row version排序，但同一producer/source stream的older/equal/newer/incomparable relation尚无唯一typed comparator传播到flow | producer/source relation owner提供same-stream proof与total typed comparator；Step06/07固定missing、different-stream、incomparable和unavailable precedence，并由I03 decision mapper消费 | lexical/numeric compare、arrival order、`occurred_at`、schema version或local CAS version冒充source order |
| `S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` | `open_internal_affected` | incoming `SubjectObservationReference`与local `ReferenceSnapshotStateRef`之间缺完整subject kind/safe-ref/identity-boundary/state/visibility sole-row proof及rehydration parity | Step06定义canonical relation carrier和完整tuple；Step07提供bounded exact lookup，明确missing/duplicate/mismatch/terminal-invalid行为；durable/fake/controlled adapter返回相同typed relation | subject-id cast、ref-prefix推导、first-row-wins、查Identity current truth、临时mint snapshot或覆盖不匹配row |
| `S08-E-I03-H10-INBOUND-MAPPER-01` | `open_internal_affected` | payload、freshness、source-version relation、subject/snapshot proof及policy basis到local no-mutation/transition/new-snapshot creation proof没有唯一finite mapper | canonical mapper返回具名decision和与同一pre-state绑定的transition或`(State, CreatedProof)`；H10 factory只消费accepted proof、same post-state与one cursor；absence/invalid relation不得进入write lane | `From<Payload>`直连domain、按freshness名称赋`Resolved/Fresh`、record-first、reload后重建transition、伪造creation proof或复用C15语义 |
| `S08-E-I03-DOWNSTREAM-WRITE-CAPABILITY-01` | `open_internal_affected` | shared `ObservationInboundEventDependencies`物理暴露H3/H4/H5 repository；§14.11虽规定zero-write，当前依赖形状仍不能在编译边界证明I03无evidence、retention、handoff写能力 | Step06/07提供I03 concrete delegate/private minimal dependency view，只含reservation、reference decision/repository、H10、stored result/UoW及必要outbox能力；Step09逐调用审计，Step16规划compile-time dependency test和forbidden-call scan | 保留宽依赖后只靠评审约束、复制repository trait、注入generic durable audit/downstream writer或把H3/H4/H5放进I03 UoW |
| `S08-E-I03-ACTION-MATRIX-01` | `open_internal_affected` | §14.12已固定全部I03 result branch的C-05 target/prohibition，但Step06/07没有唯一pure、total、no-wildcard mapper seam | mapper输入覆盖commit certainty、Stored/Ephemeral、inner outcome、result access、ref/error presence、`ObservationRecoveryClass`与I03 policy；每行返回exact C-05 variant或合法typed no-completion；Step09在receipt/probe后只调用一次，Step16表驱动覆盖 | generic Consumer policy、default arm、error string、outcome-only action、在receipt/probe前选action或由registrar再次分类 |

这八项是 I03 的完整专属集合：两项为 `open_upstream_internal`，六项为
`open_internal_affected`。后续审查如果发现新的 owner/schema/signature 缺口，必须
新增独立 ID 并说明与现有项的非重叠关系，不能扩写某一行来隐藏新的责任边界。

### 15.3 Closure dependency order

| order | prerequisite set | unlocks | still does not close |
|---:|---|---|---|
| 1 | payload schema owner + freshness owner | canonical decode、typed digest material和freshness admission可成立 | local source comparator、subject binding、H10 decision与result mapping |
| 2 | digest propagation + source-version comparator | stable reservation/replay/probe和typed source ordering可成立 | snapshot relation或任何local mutation authorization |
| 3 | subject/snapshot binding + H10 inbound mapper + shared new-snapshot proof signature | no-mutation、in-place transition和required-new-snapshot branch可回指唯一proof | UoW/result/outbox、downstream capability isolation或transport completion |
| 4 | downstream minimal capability view | I03 no-H3/H4/H5 boundary可由dependency shape和flow审计承接 | shared result surface或C-05 action mapping |
| 5 | shared stored-result/indeterminate carriers + I03 exact action mapper | known-result与unknown-result completion boundary可逐行实现 | Step09 flow、Step16 cut或其他Consumer协议完成 |

顺序表示依赖方向，不表示可以批量关闭。每一项仍须在其 canonical owner 产物中完成
修改，再回到 I03 做 use-site 静态复审；本节本身不能成为 owner patch 的替代品。

### 15.4 Shared and cross-protocol affected consumed by I03

| ID | current status | I03 dependency | closure owner / required handoff | I03 forbidden claim |
|---|---|---|---|---|
| `S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01` | `open_internal_affected` | `RequireNewSnapshot` accepted branch需要统一`(State, CreatedProof)`，H10和stored result必须消费同一creation relation | Step06 object/factory owner统一signature；C16与I03分别复核自己的call site | I03自建creation proof或因本节写出target tuple而称shared项已关闭 |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `open_internal_affected` | stored Accepted/replay receipt必须无损取得accepted UoW的exact `outbox_refs` | shared application/stored-result owner增加validated field/accessor并传播全部Consumer | 查询current outbox、按event kind重建或用空集合掩盖缺失 |
| `S08-CONSUMER-QUARANTINE-REF-01` | `open_internal_affected` | shared application material仍有无canonical owner的`QuarantineRef` use；I03不能据此产生fresh quarantine | shared owner删除该字段或绑定到既有body-free marker owner，并完成全Consumer影响审计 | I03新建wrapper、暴露raw quarantine material或只凭error选择Quarantined |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `open_internal_affected` | commit/probe unknown时没有合法receipt/C-05 completion shape | Step06/07 shared handler/completion owner增加typed no-completion或收紧return contract | 假定committed/not committed、伪造ephemeral rejection或选择任一terminal action |
| `S08-SOURCE-EVENT-REF-OWNER-01` | `resolved_in_S08-B_step06_affected_open` | I03 logical/secondary identity和receipt都消费shared `SourceEventRef` owner | Step06旧use-site只回指S08-B contracts owner，并删除重复/历史声明 | 把I03字段use-site称为新owner，或把source event与trace/dedup/source ref合并 |
| `S08-RESULT-ACCESS-LAYER-01` | `resolved_in_S08-B_step06_affected_open` | I03 replay只增加`Replayed` access overlay，inner stored outcome/bytes保持不变 | Step06旧duplicate/disposition表述传播到S08-B唯一access owner | 新建`Duplicate` outcome、改写stored inner surface或把replay当fresh commit |
| `R06-F-AFFECT-UOW-01` | `step07_surface_closed_downstream_open` | snapshot -> one cursor -> H10 -> stored result -> completion -> commit certainty顺序必须跨Step一致 | Step09/11/13/15/16逐处传播并做cross-step audit | 仅因I03 §10/§14记录了顺序就称UoW全局关闭，或允许record-first/partial commit |
| `03-RPR-S09-PER-FLOW` | `open` | 当前只有`ConsumeIdentityObservationContextFlow` handoff和调用约束，尚无函数级逐调用产物 | Step09在用户确认后建立唯一I03 flow并闭合call/order/error/transaction/action路径 | 在Step08提前写完整flow、复用generic Consumer模板或把handoff记录算作Step09完成 |

`R06.6-F2-H13-UPSTREAM=open_controlled` 继续是项目级 blocker，但它约束 scope-only
replay record，不是 I03 的 direct dependency。本节不复制该 blocker，不把它计入
I03 八项专属 affected，也不宣称它已因 I03 审查而缓解。

### 15.5 §15 stop review

| 检查项 | 结论 |
|---|---|
| I03专属affected是否逐项给出status、question、closure和forbidden shortcut | `pass_with_affected_open`；8/8已登记，2项upstream、6项internal |
| §14.10/§14.12中的affected是否都可回指本节或shared register | pass；没有未命名的I03 owner/schema/signature缺口 |
| shared/cross-protocol affected是否与I03专属项分离 | pass；8项shared/cross-protocol记录均保留原owner与状态，I03未越权关闭 |
| upstream blocker范围是否准确 | pass；两个L1-identity direct gaps继续开放；H13项目级blocker不是I03 direct dependency；本节没有新增上游blocker |
| affected关闭顺序是否可落码且不构成批量关闭 | pass；五级dependency order已记录，每项仍要求owner patch、use-site propagation与后续cut |
| 是否新增canonical type、repository、mapper、action、record或flow | no；本节只登记已有缺口和关闭条件 |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件complete；I03仍为`pending_per_protocol_review` |
| 本批写入状态 | `S08-E-I03_S01-S15_recorded_with_affected_open`；§15完成，I03 §16~§17与其他协议仍未完成 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | 停审并等待用户明确确认；确认后只读取I03 §16 static closure checklist所需SOP/规范、I03 §1~§15和current inventory，不进入§17或其他协议 |
| 当前提交 | 不需要；用户未要求提交 |

本节历史恢复点为
`Step08_S08-E_I03_S01-S15_recorded_with_affected_open_waiting_user_before_I03_S16`；
用户已经确认进入 §16，current 恢复点由下方 §16 stop review 承接。

## 16. I03 static closure checklist

本节只复核 §1~§15 已形成的协议契约是否自洽、可追溯且没有未登记缺口，不新增
schema、object、port、record、mapper、action 或 flow。检查通过表示 I03 的目标契约
在设计记录层可定位；它不等于上游 owner 已补齐、affected 已关闭、Step 09 flow 已
完成或实现与测试已经存在。

### 16.1 结论词与判定规则

| result | 严格含义 | 不得解释为 |
|---|---|---|
| `pass` | 当前 owner、字段关系和禁止边界在已读取设计真相源中可直接回指 | 代码或运行时行为已验证 |
| `pass_at_design_record_level` | I03 的有限目标形态、分支和引用已闭合，但后续 Step 尚未展开 | 后续 flow、repository、配置或测试已完成 |
| `pass_with_affected_open` | I03 已给出唯一目标和 fail-closed 行为，但具名 owner/signature/carrier 仍由 §15 affected 承接 | affected 已缓解、可以由实现者自行补齐 |
| `deferred_to_named_step` | 当前 Step 已给出唯一 handoff，具体函数级展开归既定后续 Step | 可以跳过当前 handoff或复用generic模板 |
| `not_run_not_claimed` | 只登记未来验证义务，没有代码、测试、scan、runtime evidence或验收事实 | pass、failed 或已有 evidence |

任何带 `affected_open` 的检查都不能在 §17 被改写为无条件 complete。§16 也不能
用检查项数量、表格覆盖或静态一致性替代 §15 中逐项规定的 canonical owner closure。

### 16.2 Protocol surface、authority 与 schema checklist

| check | result | evidence boundary |
|---|---|---|
| 只定义一个逻辑 Consumer、一个 exact operation/discriminator 和一个 required Identity producer | `pass_at_design_record_level` | §§3, 4.2 |
| caller、worker assembler、application façade和处理方向唯一，application不直接执行transport action | `pass_at_design_record_level` | §§4.1, 5.1~5.2, 10.8 |
| typed async transport类别与static I03 slot明确，实际topic/credential/locator仍由entry/config binding拥有 | `pass_at_design_record_level` | §§3~5；不在I03猜locator |
| shared envelope与I03 typed payload分层，payload没有复制event/source/dedup/time/trace header字段 | `pass_with_affected_open` | §§6.1~6.3；`S08-E-I03-PAYLOAD-SCHEMA-01` |
| header、consumer、producer和schema先于payload decode、digest、reservation与domain lookup验证 | `pass_at_design_record_level` | §§6.1, 7.3, 9.3, 12.1 |
| canonical payload declaration、wire encoder和registration缺口没有被Observability use-site冒充关闭 | `pass_with_affected_open` | §§6.2~6.3, 15.2 |
| assembler和service signature只接收typed envelope、trusted actor与concrete input，不暴露raw bytes/repository/action | `pass_at_design_record_level` | §5.2 |
| application input的六个Consumer control fields与三个I03 payload fields均有类型、来源和private construction gate | `pass_with_affected_open` | §§7.1~7.3；payload/freshness/digest affected保持开放 |
| application result、stored/ephemeral receipt与Fresh/Replayed access各自回指shared owner，不创建I03 result enum | `pass_with_affected_open` | §§11.1~11.5, 14.12.3, 15.4 |
| public secondary ref/enum/helper不直接依赖domain-only类型；缺owner类型没有通过alias或string暴露 | `pass_with_affected_open` | §§6~7, 11, 15；shared propagation仍开放 |
| actor只来自可信C-03 worker delivery，producer/payload/subject/tenant均不能成为effective actor | `pass` | §§4.1, 7.2, 8.6, 12.1 |
| trusted Identity producer例外不绕过body-free、schema、digest、source isolation、idempotency、relation或state gate | `pass_at_design_record_level` | §§4, 6.1, 7.3~7.4, 9.3, 13 |
| supported、unsupported、unknown和mismatched schema/version具有有限且互斥的decode/reservation行为 | `pass_with_affected_open` | §§6.1, 8.5, 9.3, 12；upstream registration仍开放 |
| Query专属view/page/marker问题被明确判为不适用于I03，没有用Consumer receipt替代Query surface | `pass` | §3问题11~16；本协议族为Inbound Event Consumer |

### 16.3 Field construction、identity、admission 与 redaction checklist

| check | result | evidence boundary |
|---|---|---|
| `subject_ref`、optional `safe_summary_ref`与`freshness`的use-site字段顺序、类型和absence语义明确 | `pass_with_affected_open` | §§6.2, 7.1~7.2, 8.1~8.2；两个upstream owner gap |
| target snapshot/decision/H10/result所需字段均来自typed input、exact lookup、trusted system value或canonical mapper | `pass_with_affected_open` | §§7.4~7.6, 10.1~10.3；relation/mapper affected |
| missing、malformed、explicit `None`、unknown owner、unavailable dependency、mismatch与forbidden body不合并 | `pass_at_design_record_level` | §§7.6, 9.2~9.6, 12.2~12.4 |
| subject、snapshot、source和visibility必须形成完整sole-row typed relation，禁止cast、prefix inference或first-row-wins | `pass_with_affected_open` | §§7.4, 8.4, 10.2, 15.2；`S08-E-I03-SUBJECT-SNAPSHOT-BINDING-01` |
| safe summary保持optional body-free pointer；absence、unavailable、mismatch与存在但未授权分别处理 | `pass_at_design_record_level` | §§6.2, 7.2, 9.2, 9.6 |
| freshness只作为producer typed observation，不能直接授权local state、H10或Accepted | `pass_with_affected_open` | §§4.1, 8.5, 10.2~10.3；freshness/mapper affected |
| source version只经typed same-stream comparator排序，不回退到time、cursor、schema或row version | `pass_with_affected_open` | §§8.5, 12, 13.10, 15.2 |
| canonical digest frame、字段顺序、presence tag、candidate relation与retained-profile比较已记录 | `pass_with_affected_open` | §§8.1~8.2, 13.4, 15.2；`S08-E-I03-DIGEST-ORDER-01` |
| dedup、trace、occurred time、transport locator、raw bytes与local effects明确排除在request digest外 | `pass_at_design_record_level` | §§8.3, 13.4.2 |
| logical reservation identity与secondary source-event identity同时校验但不互相替代 | `pass_at_design_record_level` | §§8.4, 13.2~13.5 |
| actor、trace、source event、source、source version、dedup、subject和snapshot保持不同typed语义 | `pass` | §§8.4, 8.6 |
| allowlist在serialization前执行，Identity/raw provider/business body不能进入input、digest、log、metric、trace、error、receipt、outbox、dead-letter或persistence | `pass_at_design_record_level` | §§9.1~9.5, 14.4 |
| safe diagnostics只暴露finite kind、phase和typed safe refs，不传播provider text、credential、locator、stack或digest | `pass_at_design_record_level` | §§9.5, 12.3, 14.4~14.6 |
| forbidden body detection不通过hash、quarantine、dead-letter或telemetry旁路保留正文 | `pass_at_design_record_level` | §§9.4~9.5, 12.4, 14.4 |

### 16.4 Local truth、UoW、result、recovery 与 concurrency checklist

| check | result | evidence boundary |
|---|---|---|
| I03只拥有Observability reference snapshot、授权H10、stored result/receipt和必要immutable outbox facts | `pass_at_design_record_level` | §§4.1, 7.5, 10.1, 14.1~14.2 |
| Identity profile、credential、role、membership、lifecycle、authentication和source truth始终不可写 | `pass` | §§1.1, 4.1, 10.4, 14.11 |
| snapshot exact read/version与idempotency reservation是独立guard，accepted writer必须通过二者 | `pass_with_affected_open` | §§10.1~10.2, 13.2~13.3；subject binding/UoW传播开放 |
| in-place transition、required-new-snapshot与no-mutation三类decision互斥且各自需要typed proof | `pass_with_affected_open` | §§10.2.1~10.2.3, 14.12；H10 mapper/new-snapshot proof affected |
| H10只由真实accepted reference mutation产生，并消费同一transition/creation proof与post-state | `pass_with_affected_open` | §§10.3, 14.8~14.9；mapper/UoW affected |
| accepted顺序固定为snapshot -> one cursor -> H10 -> result/outbox -> completion -> commit certainty | `pass_with_affected_open` | §§10.3~10.5, 14.8.3, 15.4；`R06-F-AFFECT-UOW-01` |
| stored result必须先于reservation completion staging，返回前必须证明完整UoW已知提交 | `pass_with_affected_open` | §§10.5, 11.2~11.3, 13.6~13.7 |
| `changed_refs`、`outbox_refs`、gap/dead-letter/error presence只来自exact stored surface，不查current truth补值 | `pass_with_affected_open` | §§11.4, 11.9, 14.12.3；shared outbox/quarantine affected |
| known pre-commit/commit failure全量rollback且不返回stored receipt、H10或terminal success | `pass_at_design_record_level` | §§10.5, 12.4, 14.12.2 |
| commit/probe unknown不假定winner、不构造receipt、不重跑writer且不选择C-05 terminal action | `pass_with_affected_open` | §§10.5, 11.7~11.8, 12.6, 13.6, 15.4 |
| completed compatible duplicate只rehydrate exact stored bytes并增加`Replayed` overlay，不重跑resolver/snapshot/H10/outbox | `pass_with_affected_open` | §§11.2~11.3, 11.6, 13.5, 14.12 |
| Stored与Ephemeral receipt互斥；result/ref集合presence规则覆盖所有I03可达分支 | `pass_with_affected_open` | §§11.4~11.5, 14.12.2~14.12.3 |
| `FreshlyCommitted`与`Replayed`由commit/stored relation决定，caller、telemetry与transport不能指定 | `pass_at_design_record_level` | §§11.3, 13.5~13.6, 14.12.3 |
| 未引入durable/public `Duplicate` outcome，duplicate语义只存在于access overlay | `pass` | §§8.4, 11.3, 14.12 |
| fresh Accepted为direct；NoOp/Rejected/Quarantined/DeadLettered保持owner-conditional；ephemeral/replay/no-completion独立 | `pass_with_affected_open` | §14.12.1~14.12.5；result/action owner仍开放 |
| Quarantined/DeadLettered不能由error severity或transport action反向创建marker，`QuarantineRef`没有被发明 | `pass_with_affected_open` | §§10.7~10.8, 11.4, 12.6, 15.4 |
| protocol/domain/application/worker error ownership与public finite projection有单向映射，不解析错误文本选结果 | `pass_at_design_record_level` | §§12.1~12.5 |
| `retryable`只由typed recovery class派生；application result不携带Ack/Retry/DeadLetter | `pass_with_affected_open` | §§12.5~12.6, 14.12.5；I03 action mapper affected |
| corrupt/missing/mismatched completed relation保持consistency defect，禁止从snapshot/H10/outbox/current resolver重建 | `pass_at_design_record_level` | §§11.7, 12.7, 13.6 |
| Conflict、InFlight、Replay、snapshot CAS与writer reentry具有固定优先级，不覆盖winner、不mint新key、不递归重试 | `pass_at_design_record_level` | §§13.2~13.7, 14.12.1 |
| fake、controlled与durable adapter承担相同CAS、唯一性、staged visibility、one-cursor、probe与rollback语义 | `pass_at_design_record_level` | §§10.6, 13.8；runtime test尚未运行 |

### 16.5 Telemetry、durable audit 与 downstream non-owner checklist

| check | result | evidence boundary |
|---|---|---|
| runtime telemetry、local durable truth与downstream projection三层分离，telemetry不拥有result或truth | `pass_at_design_record_level` | §§14.1~14.2 |
| trace parent/child、source-event correlation与actor authority有独立来源，trace不替代causation/idempotency | `pass_at_design_record_level` | §§14.3, 8.6 |
| log/span切口覆盖admission、reservation、relation、UoW、result、action与sink failure且均消费已确定phase | `pass_at_design_record_level` | §§14.5~14.6, 14.12.4 |
| metrics使用有限name/result/phase标签，禁止subject/ref/dedup/trace/error text等高基数或敏感label | `pass_at_design_record_level` | §14.7 |
| H10是I03真实reference mutation唯一mandatory durable audit landing，NoOp/replay/reject/failure/unknown不追加 | `pass_with_affected_open` | §§14.8~14.10；mapper/UoW传播开放 |
| telemetry sink failure不回滚UoW、不重分类result、不重新调用mapper或transport registrar | `pass_at_design_record_level` | §§14.5~14.7, 14.12.4 |
| evidence linkage H3、retention H5和report handoff H4均由自身owner独立读取、验证、决策和提交 | `pass_at_design_record_level` | §14.11.1~14.11.4 |
| I03全部结果分支对H3/H4/H5、business truth、external acceptance、verdict和signoff保持zero-write | `pass_at_design_record_level` | §§14.11.2~14.11.3, 14.12.4 |
| dependency shape尚不能编译期证明I03无H3/H4/H5能力，缺口没有被文字检查误报关闭 | `pass_with_affected_open` | §§14.11.5, 15.2；`S08-E-I03-DOWNSTREAM-WRITE-CAPABILITY-01` |
| 没有用generic audit、retention fallback、handoff fallback或telemetry marker补造缺失local proof | `pass` | §§14.9~14.12 |

### 16.6 Affected、flow handoff 与 evidence-claim checklist

| check | result | evidence boundary |
|---|---|---|
| 8项I03专属affected均有唯一ID、状态、question、closure required和forbidden shortcut | `pass_with_affected_open` | §15.2 |
| 2项upstream与6项internal状态未被本检查表关闭、降级或合并 | `pass_with_affected_open` | §§15.1~15.3 |
| 8项shared/cross-protocol affected保持原owner；I03不把局部检查声明成shared closure | `pass_with_affected_open` | §15.4 |
| payload/freshness -> digest/version -> relation/H10 -> capability -> result/action依赖顺序无反向补造 | `pass_with_affected_open` | §15.3 |
| §1~§15发现的schema、owner、signature、carrier、capability与flow缺口均可回指§15，没有未登记gap | `pass_with_affected_open` | §§14.10.7, 14.12.7, 15 |
| Step 09 handoff只有`ConsumeIdentityObservationContextFlow`，callable/port/order输入已定位 | `deferred_to_named_step` | §§13.9, 15.4；`03-RPR-S09-PER-FLOW` |
| I03 §16不进入函数级flow、repository实现、配置locator或Step16项目级测试切口设计 | `pass` | 本节scope；后续Step保持冻结 |
| `R06.6-F2-H13-UPSTREAM`仍是项目级scope-only replay blocker，不是I03 direct dependency | `pass` | §15.4 |
| I04~I09、Outbound Event、Job与Step08跨协议总审计均未被I03 checklist代替 | `pass` | §3问题23；current inventory |
| 代码、测试、compile-time scan、forbidden-call scan、runtime evidence、commit、run_id、evidence alias和验收签署 | `not_run_not_claimed` | design-only artifact |

### 16.7 §16 stop review

| 检查项 | 结论 |
|---|---|
| 是否按protocol/schema、field/admission、truth/UoW/result、telemetry/audit及affected/handoff分域完成静态检查 | `pass_with_affected_open`；所有结论均有§1~§15回指，没有新增设计owner |
| Step08 SOP中适用于Inbound Consumer的signature、schema、field source、target construction、error、idempotency、actor、receipt、audit和flow handoff是否覆盖 | pass at design-record level；Query专属问题明确not applicable而非遗漏 |
| 是否存在未登记的I03 canonical owner/schema/signature/carrier/capability缺口 | no new gap found；8项I03专属affected与8项shared/cross-protocol affected继续承接全部已知缺口 |
| 是否发现新的上游blocker | no；两个L1-identity direct gaps继续`open_upstream_internal`；项目级H13 blocker仍非I03 direct dependency |
| 是否误关affected或声称runtime/测试事实 | no；所有开放项保持原状态，验证均为planned/not run |
| 当前协议计数 | 保持`32/60 defined_with_affected_open`；Query `14/14`；Consumer `2/9`；`0/60`无条件complete；I03仍为`pending_per_protocol_review` |
| 本批写入状态 | `S08-E-I03_S01-S16_recorded_with_affected_open`；§16完成，I03 §17与其他协议仍未完成 |
| 正式文档、实现、测试、evidence、run_id和验收签署 | 均未生成或声称；正式`03`继续frozen |
| 下一动作 | 停审并等待用户明确确认；确认后只读取I03 §17 final stop review所需SOP/规范、I03 §1~§16、current inventory与I01/I02 §17结构，不进入I04或其他协议 |
| 当前提交 | 不需要；用户未要求提交 |

本节历史恢复点为
`Step08_S08-E_I03_S01-S16_recorded_with_affected_open_waiting_user_before_I03_S17`；
用户已经确认进入 §17，current 恢复点由下方 final stop review 承接。

## 17. I03 final stop review

| item | conclusion |
|---|---|
| current document / Step | `03-详细设计.md` calibration, Step 08, S08-E Consumer I03 |
| logical protocol | `ConsumeIdentityObservationContext`; Inbound Event Consumer I03 of 9 |
| protocol status | `defined_with_affected_open`; not unconditional complete |
| independent I03 artifact | complete for this review batch: authority, envelope/payload use-site, concrete input, field provenance, admission/redaction, digest/identity, local snapshot/H10 UoW, stored result/receipt, error/recovery, concurrency/reentry, telemetry/audit, downstream non-owner, result closure, affected register and static checklist are recorded |
| public binding | exact operation/discriminator, required Identity producer, matching assembler/service and typed async completion boundary are fixed |
| upstream payload / freshness | fail-closed target is fixed; canonical payload declaration/registration and finite freshness owner remain two `open_upstream_internal` records |
| subject / snapshot / source-version relation | exact typed relation and no-inference rules are fixed; comparator, sole-row binding and H10 inbound mapper remain internal affected |
| body-free and redaction boundary | pass at design-record level; Identity/business/provider body cannot enter input, digest, diagnostics, receipt, outbox, dead-letter or persistence |
| local truth boundary | pass; I03 may mutate only Observability-owned reference snapshot truth and append one authorized H10 in a known-committed mutation UoW; it never writes Identity truth |
| UoW and stored result | target order and result-before-complete relation are fixed; new-snapshot proof, shared UoW, outbox/result and indeterminate carriers remain affected |
| duplicate / replay | pass at design-record level; exact stored inner surface is rehydrated with `Replayed` overlay, with no durable/public `Duplicate` outcome or writer rerun |
| result / receipt reachability | direct, owner-conditional, ephemeral, replay-overlay and no-completion classes are fixed; shared result surface and I03 action mapper remain affected |
| error / recovery / C-05 | finite error and recovery mapping is recorded; application does not own transport action, and unknown commit remains no-completion/fail-closed |
| concurrency / reentry | logical and secondary identities, reservation/CAS independence, conflict/in-flight priority and same-key probe rules are recorded |
| durable audit | H10 is the only mandatory I03 durable audit landing and only for a known-committed real reference mutation |
| telemetry | body-free low-cardinality log/metric/span cuts are recorded; telemetry sink state cannot alter truth, result, UoW or transport action |
| evidence / retention / handoff boundary | pass at design-record level; H3/H5/H4 remain separate downstream owners and every I03 branch is zero-write to them |
| protocol-specific affected | 8 remain open: 2 `open_upstream_internal` and 6 `open_internal_affected`; all 8 are listed in §15.2 |
| shared / cross-protocol affected | 8 remain open or pending propagation as listed in §15.4; I03 does not close any shared owner by assertion |
| unregistered gap audit | pass; §16 found no additional unregistered canonical owner/schema/signature/carrier/capability gap |
| exactly one Step 09 handoff | pass at handoff-record level; `ConsumeIdentityObservationContextFlow` only, while `03-RPR-S09-PER-FLOW` remains open |
| external/project blocker | no new blocker; `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated to I03 direct dependency |
| protocol count after this stop | `33/60 defined_with_affected_open`; Query `14/14`; Consumer `3/9`; `0/60` unconditional complete |
| formal document | unchanged and frozen; no reassembly before Step 19 |
| implementation / test / evidence | not run; no implementation commit, compile-time scan, runtime evidence, run id, evidence alias, test result or acceptance signature created |
| next allowed action | stop and wait for explicit user confirmation; after confirmation read only I04-required current Step 06/07 owner, shared Consumer carrier and I04 upstream material |
| current recovery point | `Step08_S08-E_I03_defined_with_affected_open_waiting_user_before_I04` |
| submission | not needed; user did not request a commit |

This stop is a gate. I03 is now countable as an independently defined protocol
with affected open, but it is not implementation-ready in isolation and none of
its affected records is closed. Do not enter I04~I09, S08-F/G, Step 09~19,
formal `03`, any `04` file or implementation code until the user explicitly
confirms the next batch.
