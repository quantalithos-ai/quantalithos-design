# L4-observability 03-详细设计 Step 08 - S08-E Consumer I01 `ConsumeBusObservationMaterial`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 当前模式: full-restart / affected-only rebuild
> 当前批次: S08-E Consumer I01
> 回填目标: `03-详细设计.md` §7；正式文档只允许在 Step 19 重新装配

## 1. 当前状态与边界

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 08 `定义 API / Command / Query / Event / Job 协议契约` |
| 协议族 / 编号 | Inbound Event Consumer / I01 of 9 |
| 逻辑协议 | `ConsumeBusObservationMaterial` |
| operation discriminator | `0x0301`；由当前 Step 08 finite inbound operation table 固定，不由 route 或 payload 猜测 |
| required producer | `ObservationProducerFamily::Bus` |
| 本文件状态 | `defined_with_affected_open_waiting_user_before_I02` |
| 协议计数 | `31/60 defined_with_affected_open`；Consumer `1/9`；Query `14/14`；`0/60` 无条件 complete |
| 正式文档状态 | frozen；本文件不回填正式 `03` |
| gate status | `Step08_S08-E_I01_defined_with_affected_open_waiting_user_before_I02` |
| 下一允许动作 | 停审；用户明确确认后，只读取 I02 所需的 Step 06/07 owner 与 exact callable |
| 是否需要提交 | 不需要；用户未要求提交 |

本协议只接收来自已认证 L0-bus 协作边界的 body-free observation material，建立 Observability 本地的 receipt、intake、安全处置、必要的 correlation/projection marker、stored result 和已提交的 outbox snapshot reference。它不拥有 L0-bus 的 transport、delivery、topic、partition、offset、ack 语义，也不拥有 source/business truth。

### 1.1 本批禁止事项

- 不读取或写入 I02~I09、Outbound Event、Operations Job、Step 09~19、任何 `04` 文件或实现代码。
- 不把 bus producer、`SourceFamilyKind::Bus`、source event、dedup key、trace ref 或 actor ref 互相转换或从 payload 推导。
- 不保存 raw payload、provider body、log/metric/trace/audit body、credential、transport locator、topic、partition、offset、delivery attempt 或 external run identity。
- 不直接 ack、retry、dead-letter 或改变 L0-bus truth；transport action 只能由 worker exact completion mapper 选择并由 registrar 执行。
- 不把 `Duplicate` 增加为 durable/public outcome；duplicate 通过 `ObservationProtocolResultAccess::Replayed` overlay 表达。
- 不以 `SafeSummaryRef` 创建兼容 alias；当前 canonical safe-summary type 是 `SafeSignalSummaryRef`。
- 不在 Step 08 临时创建 `QuarantineRef`、第二个 receipt/result owner、第五个 application façade 或新的 generic Consumer disposition。
- 不在 commit probe 仍 indeterminate 时默认选择 `Acknowledge`、`Retry` 或 `DeadLetter`。
- 不伪造实现 commit、run_id、evidence alias、真实 evidence、测试结果或验收签署。

## 2. 输入与权威顺序

### 2.1 本批实际读取

| 顺序 | 输入 | 本批消费内容 | 权威限制 |
|---:|---|---|---|
| 1 | `详细设计讨论流程_SOP.md` Step 08 | 23 问、Consumer envelope/receipt/action、逐协议小节、协议族停审 | 不用旧 Step 09 的 `pass` 流程替代 current record |
| 2 | `详细设计书写规范.md` §5.6/§5.7 | DTO、字段来源、错误、幂等、审计、Step 06/07/09 回指结构 | 不以协议表代替对象/port owner |
| 3 | `设计真相源闭环与可落码性标准.md` | actor authority、stored receipt、same-UoW、outbox、redaction、no-write 与 fake/durable parity 要求 | 不用字符串、error text 或 current lookup 补材料 |
| 4 | current `00/01/02` 与 HLD Consumer 骨架 | Observability-only 边界、L0-bus 协作输入、无 source truth ownership | HLD 仅是边界输入，不覆盖 Step 06/07 exact callable |
| 5 | Step 06 input assembly / digest / context / object / record / stored-result owner | 48 input seam、Consumer control fields、`ObservationInboundEventIdentity`、H1 target、stored receipt/outbox expectation | Step 06 的旧 `SafeSummaryRef` use-site登记 affected，不继承 |
| 6 | Step 07 trait / port / adapter 契约 | exact assembler 与 `ObservationInboundEventService` callable、C-05 completion carrier、worker authority | C-05 indeterminate shape缺口保持 open |
| 7 | current Step 08 shared carrier / protocol contract | envelope、outcome、receipt、replay access、error surface 与 family binding | shared carrier不能代替 I01 的 payload/UoW/action矩阵 |
| 8 | L1-governance / L1-artifact Step 08 | 逐协议字段级粒度、receipt/source/action 分层和停审格式 | 不复制相邻域 truth 或 route |
| 9 | 冻结旧 Step 08/09 | 识别旧 `Duplicate`、直接 context factory、raw body 和 resident worker loop 冲突 | 旧 `done/pass`、旧 schema 和旧 owner均为 historical |

### 2.2 权威关系

```text
I01 current record / I01 affected register
  > Step 07 exact assembler, façade and worker completion seam
  > Step 06 canonical payload-use, input/context, object/record/result owner
  > S08-B shared Consumer envelope/receipt/outcome carrier
  > current formal 00/01/02 and HLD protocol skeleton
  > frozen formal 03 / old Step 09 / README
```

当 Step 06/07 只提供 use-site 而没有唯一字段、accessor 或 completion shape 时，本文件记录 affected 并 fail closed；不在 Step 08 偷创 owner。

## 3. SOP 23 问回答

| # | 问题 | I01 current answer |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `ConsumeBusObservationMaterial`；不展开其他 Consumer |
| 2 | 协议族与模块 | S08-E Inbound Event Consumer；`worker` entry -> inbound assembler -> `ObservationInboundEventService` |
| 3 | 调用方、处理方 | L0-bus authenticated delivery callback 是 producer-side caller；worker exact callback 调 assembler；application façade消费 concrete input |
| 4 | 传输方式 | typed asynchronous delivery/completion；transport locator由 Step 14 / `04` 绑定，本协议不写 topic/path/credential |
| 5 | envelope schema | shared header + typed `BusObservationMaterialPayload`；header authority先校验，再解析 payload |
| 6 | application input | `ConsumeBusObservationMaterialInput`，含 Consumer context、request digest candidates、source/schema/time control fields和四个 payload fields |
| 7 | application result | `ObservationConsumerResult`；public invocation surface映射为 fresh stored receipt、replayed stored receipt 或 ephemeral receipt，具体 lossless outbox source仍 affected |
| 8 | 目标对象 / 本地事实 | `ObservationReceipt`、`SafetyDisposition`、H1 `IntakeDecisionRecord`、stored Consumer receipt/result，以及由 accepted local change 产生的 outbox snapshot/marker |
| 9 | 必填字段来源 | envelope header 来自 authenticated producer binding；actor 来自 C-03 delivery；payload typed fields来自已解码且无正文的 bus material |
| 10 | 缺失行为 | header/schema/producer mismatch 在 payload decode 前 reject/unsupported；safe summary resolver 缺失不能当空值，按依赖状态 delayed 或显式安全分支；raw body 只能 reject/quarantine 且不持久化 |
| 11 | response / receipt | outcome、result ref、changed/outbox/gap/dead-letter/error presence遵循 shared Consumer receipt矩阵；不增加 `Duplicate` outcome |
| 12 | duplicate / idempotency | `dedup_key` + `(consumer, producer, source_event_ref)` secondary identity；exact replay 返回原 stored surface，不重跑 handler、不新增 refs |
| 13 | actor authority | effective `ActorSafeRef`只来自可信 C-03 worker delivery；payload actor-like字段无效 |
| 14 | redaction | 只允许 `SafeSignalSummaryRef`、`RedactionMarker` 和 bounded finite enums/ref；不保存 raw source/body或 provider detail |
| 15 | correlation | envelope `trace_ref` 与 local `ObservationInboundEventIdentity`分别保留；不使用 trace 代替 source event/dedup/actor |
| 16 | audit | 本地 intake/safety/consumer processing事实可形成 audit/trace projection；审计内容只保留 body-free refs、typed kind、safe error和commit marker |
| 17 | UoW | receipt/intake/safety/H1/stored result及 operation-specific outbox refs必须由同一 accepted local UoW 或明确 no-record 分支证明；current outbox lookup补值不允许 |
| 18 | quarantine / dead-letter | quarantine 是本地 safety disposition；dead-letter 是本地 terminal marker/ref；两者都不把 raw payload 写入 receipt或 source truth |
| 19 | C-05 action | `Acknowledge`、`Retry`、`DeadLetter` 是 transport action，不是 application outcome；由 exact worker mapper依据 I01 flow/recovery classification选择 |
| 20 | indeterminate | commit probe 后仍无法证明 committed / not committed 时，当前 C-05 没有合法 no-completion carrier；登记 affected，不默认 retry/ack/dead-letter |
| 21 | Step 06/07/09 | Step 06 payload/input/context/result owner；Step 07 exact assembler/service；Step 09 唯一 handoff `ConsumeBusObservationMaterialFlow`，目前只预留不展开 |
| 22 | error | `InvalidRequest`、`UnsupportedSchemaVersion`、typed dependency/in-flight、conflict/invariant、safe policy rejection 和 dead-letter classification按有限错误面映射；不泄漏 provider/error text |
| 23 | cross-protocol closure | I01 与 shared envelope/receipt/action、C-05、H1/outbox、redaction/correlation、Step 09 handoff 的 affected 已登记；不代表 Consumer 族或 60 协议总闭合 |

## 4. Truth boundary and logical binding

### 4.1 Owned and non-owned truth

| boundary | I01 rule |
|---|---|
| producer | `ObservationProducerFamily::Bus` is an authenticated producer namespace, not a source/business success claim |
| source family | payload `SourceFamilyKind` describes the material's truth owner family; it is not an implicit cast from producer family |
| local owned facts | receipt/intake decision, safety disposition, body-free correlation/projection marker, Consumer receipt, stored result and local outbox snapshot reference |
| non-owned facts | L0-bus delivery/ack state, source material body, business admission, runtime execution, identity/governance/artifact truth, evidence body/alias, report verdict/signoff and external acceptance |
| write direction | producer -> Observability collaboration input; no write path from Observability back to L0-bus or source owner |
| completion direction | local application result -> worker action mapper -> transport registrar; action failure remains worker error and does not roll back committed local truth |

### 4.2 Finite binding

| item | exact value |
|---|---|
| consumer name | `ObservationInboundConsumerName::ConsumeBusObservationMaterial` |
| operation | `ObservationInboundConsumerOperation::ConsumeBusObservationMaterial` |
| discriminator | `0x0301` |
| producer | `ObservationProducerFamily::Bus` |
| payload type | `BusObservationMaterialPayload` |
| application assembler | `ObservationInboundInputAssembler::consume_bus_observation_material` |
| application façade | `ObservationInboundEventService::consume_bus_observation_material` |
| flow reservation | `ConsumeBusObservationMaterialFlow` |
| transport locator | not defined here; Step 14 / `04` |

The finite relation is exact: wrong consumer, wrong producer, unsupported schema, or an unregistered payload variant cannot fall through to another Consumer. `Bus` and `SourceFamilyKind::Bus` have equal wire spelling but remain different Rust types; I01 uses a static compatibility allowlist, not `From` or implicit conversion.

## 5. Exact call chain and signatures

### 5.1 Worker-to-application chain

```text
authenticated worker delivery
  -> select static I01 slot
  -> validate safe envelope header
  -> decode BusObservationMaterialPayload
  -> ObservationInboundInputAssembler::consume_bus_observation_material
  -> ObservationInboundEventService::consume_bus_observation_material
  -> application result / stored receipt assembly
  -> worker exact C-05 action mapper
  -> private transport registrar
```

The entry does not call a repository, resolver, UoW, context factory, canonicalizer or external adapter directly. The assembler is synchronous and pure with respect to I/O; the service consumes the complete concrete input by value.

### 5.2 Exact signatures

```rust
pub trait ObservationInboundInputAssembler: Send + Sync {
    fn consume_bus_observation_material(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<BusObservationMaterialPayload>,
    ) -> Result<ConsumeBusObservationMaterialInput, ApplicationError>;
}

pub trait ObservationInboundEventService: Send + Sync {
    fn consume_bus_observation_material<'a>(
        &'a self,
        input: ConsumeBusObservationMaterialInput,
    ) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
}
```

`ObservationOperationContextFactory::for_inbound_event` and the digest canonicalizer remain application-private helpers called by the matching assembler. They are not entry capabilities. The context event identity is constructed from the fixed I01 operation, authenticated producer family and validated `SourceEventRef`.

## 6. Shared envelope and I01 payload schema

### 6.1 Header authority

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

Header validation order is fixed:

1. Select the authenticated static I01 consumer slot.
2. Parse and validate `source_event_ref`, `source_ref`, optional `source_version_ref`, `producer_family`, `schema_version`, `dedup_key`, `occurred_at` and optional `trace_ref`.
3. Require `consumer_name == ConsumeBusObservationMaterial` and `producer_family == Bus`.
4. Check producer registration and supported schema version.
5. If `source_version_ref` exists, require its producer/source relation to equal the envelope header.
6. Decode the exact `BusObservationMaterialPayload`; never try another payload variant.
7. Pass the authenticated `actor_ref` separately to the assembler.

Malformed/missing source-event header has no trusted `SourceEventRef` and can only produce the shared ephemeral `Rejected` shape with `source_event_ref=None`. Unsupported schema after a valid source-event header yields `UnsupportedSchema` with no payload parse and no reservation.

### 6.2 Payload DTO

```rust
pub struct BusObservationMaterialPayload {
    /// Material truth-owner family; distinct from envelope producer authority.
    pub source_family: SourceFamilyKind,
    /// Why this material enters the observation boundary.
    pub submission_purpose: SubmissionPurpose,
    /// Body-free safe summary, if a safe summary has been accepted.
    pub safe_summary_ref: Option<SafeSignalSummaryRef>,
    /// Independent redaction/safety marker.
    pub redaction_marker: Option<RedactionMarker>,
}
```

This is the current protocol shape. The Step 06 input table still spells the summary type as `Option<SafeSummaryRef>`; that use-site is historical/affected and must be corrected to the canonical `SafeSignalSummaryRef` without an alias.

| payload field | owner / source | validation | absence / forbidden substitution |
|---|---|---|---|
| `source_family` | `contracts::metadata::SourceFamilyKind`; decoded payload | finite token and I01 static compatibility table | unknown/mismatch -> typed rejection; never default to `Bus` |
| `submission_purpose` | `contracts::metadata::SubmissionPurpose`; decoded payload | finite purpose and source/purpose policy compatibility | absent/unsupported -> reject; never infer from producer or route |
| `safe_summary_ref` | canonical `contracts::refs::SafeSignalSummaryRef`; trusted safe-summary producer | body-free typed ref; must satisfy safety marker matrix when present | `None` is explicit absence; resolver unavailable is not empty; raw summary/body forbidden |
| `redaction_marker` | `contracts::metadata::RedactionMarker`; safety producer | `Unchecked/Clean/Redacted` compatibility with summary and later disposition | `None` is distinct from `Unchecked`; marker cannot stand in for summary |

`source_family` and `producer_family` are independently encoded in the digest material. A valid I01 envelope must satisfy a finite compatibility relation; equal token spelling does not establish authority. `submission_purpose` is semantic input, not a free-form label.

### 6.3 Payload combination matrix

The payload has two independent `Option` fields. The following matrix is the protocol-level admission rule; deeper safety policy may classify a valid combination as delayed, rejected or quarantined.

| `safe_summary_ref` | `redaction_marker` | I01 structural result | rule |
|---|---|---|---|
| `None` | `None` | structurally valid | no accepted safe summary is claimed; service must not synthesize one |
| `Some` | `Some(Unchecked)` | structurally invalid | unchecked cannot certify an accepted summary |
| `Some` | `Some(Clean)` | valid candidate | later safety state may be `Safe` only if all owner checks pass |
| `Some` | `Some(Redacted)` | valid candidate | later safety state may be `Redacted` only if redaction owner confirms |
| `None` | `Some(Unchecked)` | valid pending candidate | no safe summary; cannot be exposed as safe |
| `None` | `Some(Clean)` | structurally invalid | clean requires a safe summary |
| `None` | `Some(Redacted)` | structurally invalid | redacted requires a safe summary |

The table does not authorize a new `SafetyDisposition` variant. `Pending`, `Safe`, `Redacted`, `Rejected` and `Quarantined` remain owned by Step 06 domain contracts; I01 only supplies typed material and maps the resulting local fact to the shared Consumer outcome.

## 7. Concrete input contract and field provenance

### 7.1 Input shape

`ConsumeBusObservationMaterialInput` is the only application input for I01. It is
constructed atomically by `ObservationInboundInputAssembler` and consumed by
value by `ObservationInboundEventService`. It is not a wire DTO, durable row,
replay payload or transport completion.

```rust
pub struct ConsumeBusObservationMaterialInput {
    // Six Consumer control fields are repeated in every Consumer input.
    context: ObservationOperationContext,
    request_digest_candidates: RequestDigestCandidates,
    source_ref: ObservationSourceRef,
    source_version_ref: Option<ObservationSourceVersionRef>,
    schema_version: SchemaVersion,
    occurred_at: ObservedAt,

    // I01 operation-specific typed payload fields.
    source_family: SourceFamilyKind,
    submission_purpose: SubmissionPurpose,
    safe_summary_ref: Option<SafeSignalSummaryRef>,
    redaction_marker: Option<RedactionMarker>,
}
```

The current Step 06 table uses `Option<SafeSummaryRef>` in this row. That is a
historical use-site defect, not a second type. The canonical field above is
`Option<SafeSignalSummaryRef>`; the affected correction must happen at the
Step 06 owner/use site before implementation. No compatibility alias is
permitted.

### 7.2 Field-source register

| input field | authoritative source | construction and validation | excluded substitution |
|---|---|---|---|
| `context` | application-private `ObservationOperationContextFactory::for_inbound_event` | assembler supplies the fixed I01 operation, authenticated actor, dedup key, request digest, trace and `ObservationInboundEventIdentity` together | entry-created context, route string, payload actor, or a later setter |
| `request_digest_candidates` | `ObservationDigestCanonicalizer::request_candidates` over validated typed material | every readable profile has one candidate; the write profile is the only candidate used for a new reservation/write | transport digest, raw envelope bytes, current lookup, or a second endpoint hash |
| `source_ref` | validated envelope header | owner and non-empty body-free reference are checked before payload decode | payload source field, ref prefix, topic, partition, or source body |
| `source_version_ref` | optional validated envelope header | when present, producer and source must equal the envelope; the version token is opaque and not ordered locally | `occurred_at`, schema version, cursor, row version, or latest lookup |
| `schema_version` | validated envelope header and exact I01 slot | must be in the static supported schema set before typed payload decode | payload default, producer default, digest profile or current config |
| `occurred_at` | producer-supplied typed event time after boundary validation | retained as source metadata and passed to the flow; it does not order versions or become the local clock | local `now`, delivery time, offset, cursor or row version |
| `source_family` | typed I01 payload | checked against the static producer/source compatibility table | `ObservationProducerFamily::Bus`, route, source ref prefix or default |
| `submission_purpose` | typed I01 payload | finite token and source/purpose policy compatibility are checked before digest | producer family, route, product name or inferred intent |
| `safe_summary_ref` | typed safe-summary producer projection | optional body-free ref is validated independently; resolver unavailability is an error state, not `None` | raw log/metric/trace body, provider summary, empty string or synthetic ref |
| `redaction_marker` | typed safety/redaction projection | marker is validated independently and then cross-checked with summary presence | summary presence, error text, body hash or a default clean marker |

The assembler must either return a complete input or an `ApplicationError`. It
does not return a partial input, a partially built context, a candidate without
its matching context, or a payload that can be interpreted by another Consumer.

### 7.3 Exact assembly order

The order below is part of the I01 contract. A later stage may not repair a
failure from an earlier stage by consulting current state.

| stage | operation | no-side-effect rule |
|---:|---|---|
| 1 | Select the static I01 worker slot and assert the expected consumer/body binding | wrong slot or body type returns `InvalidRequest`; no payload fallback |
| 2 | Obtain the trusted C-03 `ActorSafeRef` from the worker delivery projection | a missing or untrusted actor fails before input construction; payload actor-like fields are ignored |
| 3 | Validate all shared header fields and source/version relation | malformed refs, unknown schema and producer mismatch stop before typed payload materialization |
| 4 | Validate the I01 payload structure and the `source_family`/producer compatibility row | unknown or incompatible family is rejected; it is never defaulted to `Bus` |
| 5 | Validate the safe-summary/redaction combination matrix | invalid combinations fail before digest; `None` is never filled from a resolver or current row |
| 6 | Construct the fixed I01 material projection in canonical field order | material is process-local and cannot be logged, serialized as a body, or persisted |
| 7 | Generate `RequestDigestCandidates` once | canonicalizer failure returns the typed digest error; no reservation or UoW exists yet |
| 8 | Construct `ObservationInboundEventIdentity` and the private inbound context | operation, producer and source event must match exactly; no conversion from a string or dedup key |
| 9 | Construct `ConsumeBusObservationMaterialInput` atomically | constructor rechecks operation/digest/event identity relations and returns no partial value |

### 7.4 Producer/source compatibility

`ObservationProducerFamily::Bus` identifies the authenticated collaboration
producer. `SourceFamilyKind::Bus` identifies the truth-owner family named by the
material. They are different types and different axes. I01 uses a finite
compatibility table owned by the Consumer registration. The initial rule is an
exact family match for the Bus material row:

| producer family | payload `source_family` | result |
|---|---|---|
| `Bus` | `Bus` | eligible for further policy validation |
| `Bus` | any other known family | typed producer/source mismatch; no reservation |
| `Bus` | unknown token | typed invalid payload; no reservation |
| any non-`Bus` producer | any value | not an I01 invocation; static slot rejects before payload dispatch |

The table is an admission relation, not a conversion implementation. There is
no `From<ObservationProducerFamily> for SourceFamilyKind`, no shared string
parser, and no fallback that treats equal wire spelling as proof of authority.

## 8. Canonical digest, event identity and correlation

### 8.1 Canonical inbound material

I01 uses the `inbound_consumer_request` material kind and the current digest
profile. After all typed validation, the canonical value has this exact member
order:

```text
{"operation":"consume_bus_observation_material",
 "actor_ref":<ActorSafeRef>,
 "producer_family":"bus",
 "source_event_ref":<SourceEventRef>,
 "source_ref":<ObservationSourceRef>,
 "source_version_ref":<Option<ObservationSourceVersionRef>>,
 "schema_version":"v1",
 "payload":{
   "source_family":<SourceFamilyKind>,
   "submission_purpose":<SubmissionPurpose>,
   "safe_summary_ref":<Option<SafeSignalSummaryRef>>,
   "redaction_marker":<Option<RedactionMarker>>
 }
}
```

Whitespace in the display above is explanatory only. The canonical writer emits
the profile-owned compact frame with fixed member order, typed discriminators,
explicit `Option` tags and the v1 escaping rules from the Step 06 digest
registry.

The material fields are ordered as follows:

| ordinal | field | included? | reason |
|---:|---|---|---|
| 1 | operation token | yes | separates I01 from every other Consumer and family |
| 2 | effective `actor_ref` | yes | binds the local logical operation scope |
| 3 | `producer_family` | yes | preserves authenticated producer authority in the material |
| 4 | `source_event_ref` | yes | binds the exact upstream event identity |
| 5 | `source_ref` | yes | binds the source stream/object reference |
| 6 | `source_version_ref` | yes, explicit absent/present | preserves a producer/version relation without inventing ordering |
| 7 | `schema_version` | yes | prevents cross-schema payload equivalence |
| 8 | `source_family` | yes | preserves the payload's independent truth-owner family |
| 9 | `submission_purpose` | yes | changes local admission semantics |
| 10 | `safe_summary_ref` | yes, explicit absent/present | changes safe material availability |
| 11 | `redaction_marker` | yes, explicit absent/present | changes safety/redaction interpretation |

The following are deliberately excluded from the request digest:

| excluded value | reason it must not change logical material |
|---|---|
| `dedup_key` | it is the logical idempotency key and is stored/compared separately |
| `occurred_at` | source event time is not a local ordering or material version |
| envelope `trace_ref` | correlation metadata is not admission material |
| delivery/message id, offset, partition, attempt and ack state | transport facts are not source or local truth |
| supplied digest | it is verified against the locally generated candidate, never hashed into itself |
| local clock, generated refs, row versions and UoW identity | generated coordination metadata must not alter replay identity |
| raw payload/provider body | forbidden body-free boundary; no raw writer exists |

### 8.2 Logical and secondary identity

I01 has two independent identity relations:

```text
logical reservation scope:
  (Inbound Consumer operation, effective ActorSafeRef, dedup_key)

secondary event identity:
  (ConsumeBusObservationMaterial, Bus, source_event_ref)
```

The context's `inbound_event_identity` uses the second tuple. Both relations
must be acquired and checked in the same reservation boundary. A source event
cannot evade the secondary uniqueness constraint by changing its dedup key,
and a dedup key cannot be reused with a different operation or actor scope.

| incoming relation | required result |
|---|---|
| same logical scope, same retained-profile digest, same event identity, completed row | replay the exact stored surface; do not rerun policy or append refs |
| same logical scope, same digest, reserved row | `Delayed`/in-flight classification; do not start a second writer |
| same logical scope, different digest | typed `IdempotencyConflict`; no winner material is returned |
| same source event identity with a changed dedup key | secondary conflict; no second reservation or handler execution |
| same dedup key with changed producer/source event identity | logical/secondary mismatch; fail closed, never merge events |
| no existing relation | acquire one reservation and proceed to I01 service |

`ObservationProtocolResultAccess::Replayed` is the only duplicate indication
at the public invocation surface. It wraps the original stored receipt and
does not become an outcome, durable state, digest field or new H1 record.

### 8.3 Correlation separation

| value | authority | retained use | cannot replace |
|---|---|---|---|
| `ActorSafeRef` | authenticated C-03 worker delivery | effective local actor/system principal | payload actor, producer family or dedup key |
| envelope `trace_ref` | trusted envelope metadata | optional operation correlation context | source event identity, idempotency or business causation |
| `SourceEventRef` | authenticated producer header | secondary event identity and receipt relation | trace, dedup key, offset or source body |
| `dedup_key` | producer delivery metadata | logical reservation scope | source event identity or digest |
| `source_version_ref` | producer header | comparable source revision input if provided | schema version, occurred time or repository version |

The I01 payload has no actor, tenant, credential, route, topic or business
causation field. Any such field received from an untrusted body is a boundary
violation and is not copied into the input or audit projection.

## 9. Redaction and body-free admission

### 9.1 Accepted material surface

Only the following values may cross the I01 application boundary:

- typed source, source-event and source-version references;
- finite `SourceFamilyKind` and `SubmissionPurpose` values;
- optional canonical `SafeSignalSummaryRef`;
- optional `RedactionMarker`;
- typed actor, trace, schema and idempotency metadata;
- bounded local result, receipt, gap and outbox references after commit.

No raw log, metric, trace, audit, provider, bus or evidence body is an I01
field. A safe summary reference is a reference to an independently accepted
safe projection; it is not permission to fetch or persist the underlying body.

### 9.2 Body and redaction matrix

| observed condition | application classification | durable local write | forbidden behavior |
|---|---|---|---|
| typed body-free payload and valid marker combination | continue to policy/service | normal I01 branch | do not fetch raw source |
| summary absent and marker absent | valid candidate with no safe summary | service may classify delayed/rejected/no-op according to owned policy | do not synthesize summary or call a raw resolver |
| summary absent and `Unchecked` marker | pending safe-material candidate | no safe signal claim; delayed or explicit safe rejection | do not expose as clean/safe |
| summary present and `Clean` marker | valid safety candidate | only after owner policy confirms | do not equate marker alone with acceptance |
| summary present and `Redacted` marker | valid redacted candidate | only body-free redacted state may be committed | do not persist pre-redaction body |
| clean/redacted marker without summary | structural rejection | no normal accepted mutation | do not infer summary from marker |
| raw/unsafe body detected before handler | boundary rejection or quarantine classification | only an explicitly allowed body-free marker/receipt may commit | never hash, log, store or dead-letter the body |
| provider/resolver temporarily unavailable | `Delayed` if no accepted local write | no fabricated receipt/result | do not turn unavailable into `None` or `Accepted` |

The exact choice between rejection and quarantine for a detected forbidden body
is owned by the safety policy and C-05 flow mapping. I01 reserves the body-free
shape and refuses to claim that the raw material was retained.

### 9.3 Safe diagnostic rule

Protocol and application errors may expose only a finite error kind and safe
typed references. They must not include source bytes, summary text, labels,
provider response text, credentials, topic/partition, stack traces or raw
serialization. `Debug`/telemetry projections use redacted type tokens and
counts only. This is a design rule; no runtime evidence or test result is
claimed in this document.

## 10. I01 local UoW and durable fact mapping

### 10.1 Accepted local write set

An accepted I01 branch may stage only observation-owned facts. The exact
repository methods and cursor details remain Step 09/11 owners, but the row
set and same-UoW relation are fixed here:

| order | local fact | source / relation | required same-UoW rule |
|---:|---|---|---|
| 1 | idempotency reservation | operation, actor, dedup key, request digest and event identity | acquire before domain mutation; replay/conflict/in-flight are no-write branches |
| 2 | `ObservationReceipt` | `source_ref`, `submission_purpose`, trusted receive time | receipt source and event relation must match I01 input |
| 3 | `SafetyDisposition` | body-free summary/marker evaluation | disposition must point to the exact receipt; no raw body field |
| 4 | H1 `IntakeDecisionRecord` | explicit receipt/safety transition | one record per actual transition; no record for pre-handler reject or no-op |
| 5 | optional correlation/projection marker | only if an I01 flow-owned transition exists | marker is not synthesized solely because a trace exists |
| 6 | stale/gap or safety marker | typed policy result | gap/marker references must be created by their canonical owner |
| 7 | immutable outbound snapshot(s) | typed event encoder over committed before/after local facts | snapshot is created from the accepted UoW, never reconstructed by publisher |
| 8 | stored Consumer result/receipt surface | exact outcome, refs, errors and schema | surface records the same committed ref set, including an explicit empty set |
| 9 | idempotency completion | pointer to `StoredObservationResultRef` | reservation and result pointer complete atomically with the local write set |

The list is a relation contract, not permission to create new object types. A
branch that has no actual transition has no H1 record and no outbound event.
`outbox_refs=[]` is an explicit stored fact when the accepted branch creates no
event; the publisher may not query current receipt state to decide otherwise.

### 10.2 Commit sequence and failure boundaries

```text
validate typed I01 input
  -> acquire reservation + secondary event identity
  -> load or construct exact observation-owned pre-state
  -> evaluate safety/admission policy
  -> stage receipt/disposition/transition records
  -> allocate the registered local cursor once where required
  -> stage typed outbox snapshots and stored result surface
  -> attach stored-result pointer to reservation
  -> commit one accepted local UoW
  -> return ObservationConsumerResult
```

Known pre-commit failure rolls back the staged local set and returns a typed
error. A known commit failure does not return a stored receipt. A commit result
that remains unknown after the exact identity probe is not mapped to either
“committed” or “not committed”; see §13.4.

The worker transport action is after this application boundary. Ack, retry and
dead-letter execution cannot roll back a committed local UoW and cannot mutate
the stored receipt surface.

### 10.3 No-record branches

| branch | reservation | domain/UoW | stored result | application return |
|---|---|---|---|---|
| malformed source-event/header | none | none | none | ephemeral `Rejected`, source event absent when untrusted |
| unsupported schema after valid header | none | none | none | ephemeral `UnsupportedSchema` |
| producer/source mismatch | none | none | none | ephemeral `Rejected` |
| digest conflict | no new reservation | none | none | ephemeral `Rejected` with conflict error |
| completed replay | current reservation is not rewritten | none | no new surface | exact original stored surface with `Replayed` access |
| in-flight reservation | no second writer | none | none | ephemeral `Delayed`/in-flight |
| dependency unavailable before accepted mutation | acquired reservation is rolled back according to owner contract | none | none | ephemeral `Delayed` |
| valid local no-op | reservation and stored no-op surface are committed only if the flow requires a receipt | no hidden transition | stored `NoOp` surface | fresh `NoOp` or replay |

## 11. Stored result and public receipt mapping

### 11.1 Application-to-public boundary

The Step 06 application carrier remains the source of local disposition and
stored result identity. Step 08 maps it to the shared public Consumer receipt;
it does not create a second application result owner.

```text
ObservationConsumerResult
  -> validate StoredObservationResult / replay surface
  -> map OperationResultDisposition to ObservationConsumerOutcome
  -> map exact stored refs/error to ObservationStoredConsumerReceipt
  -> wrap FreshlyCommitted or Replayed access
```

The current Step 06 carrier contains `result_ref`, `result_access`,
`disposition`, changed refs, quarantine/dead-letter refs and gap refs, while the
shared public receipt also requires exact `outbox_refs`. The source of those
outbox refs must be an explicit validated stored surface or an upstream carrier
revision; a current outbox lookup is forbidden. This is an affected closure,
not a license to add a Step 08-only field.

### 11.2 Outcome and receipt matrix

| local branch | public outcome | receipt branch | result/ref presence | error and ref rule |
|---|---|---|---|---|
| accepted receipt/safety transition committed | `Accepted` | stored/fresh | result ref required; changed/outbox/gap refs are exact | error absent; dead-letter absent |
| exact completed replay | original inner outcome | stored/replayed | original result and all refs byte-for-byte preserved | no new refs or error; outer access only changes to `Replayed` |
| known local rejection committed as a receipt | `Rejected` | stored/fresh | result ref required; changed refs empty; gap may be present | typed safe error required; no dead-letter unless outcome is `DeadLettered` |
| safety quarantine committed | `Quarantined` | stored/fresh | result ref required; only body-free refs | safe error required; no raw quarantine ref/body exposed |
| local dead-letter marker committed | `DeadLettered` | stored/fresh | result ref and dead-letter ref required; normal changed/outbox refs empty | typed safe error required |
| valid committed no-change | `NoOp` | stored/fresh | result ref required; changed/outbox/dead-letter refs empty | error absent |
| dependency/in-flight before local commit | `Delayed` | ephemeral | no result/ref collections | typed dependency or in-flight error |
| malformed/invalid pre-handler input | `Rejected` | ephemeral | no result/ref collections | typed protocol/application error |
| unsupported schema before payload parse | `UnsupportedSchema` | ephemeral | no result/ref collections; validated source event retained if available | `UnsupportedSchemaVersion` only |

`ObservationConsumerReceipt::Ephemeral` cannot carry a fabricated result ref,
changed ref, outbox ref, gap ref, quarantine ref or dead-letter ref. A source
event is present in an ephemeral branch only after the safe header identity was
validated. A missing or malformed source-event header therefore uses
`source_event_ref=None` and cannot be treated as a known event for idempotency.

### 11.3 Ref provenance and losslessness

| public field | lossless source | fallback forbidden |
|---|---|---|
| `result_ref` | stored result's `public_result_ref` projection | application-local repository id, new ref, current lookup |
| `changed_refs` | exact stored result surface / accepted UoW ref set | recompute from current receipt/disposition |
| `outbox_refs` | exact accepted UoW snapshot refs retained by stored surface | scan current outbox or rebuild from event kind |
| `gap_refs` | exact stored gap relation | derive from error text, count or current gap table |
| `dead_letter_ref` | committed local dead-letter marker relation | transport message id, queue locator or newly minted public wrapper |
| `error` | finite persisted safe error projection | provider text, raw reason/body or current retry state |

`QuarantineRef` has no canonical current owner in the consumed Step 06
materials. I01 therefore does not expose it. If the application carrier still
contains the historical field, the owner repair must remove it or bind it to an
existing canonical object before implementation; Step 08 cannot mint an alias.

## 12. Source version, schema compatibility and replay policy

### 12.1 Header compatibility matrix

| condition | classification | payload decode | reservation |
|---|---|---:|---:|
| supported schema, exact producer, valid source/version relation | continue | yes | eligible |
| unsupported schema with valid source event | `UnsupportedSchema` | no | no |
| unknown/malformed schema token | `Rejected`/protocol error | no | no |
| producer is not Bus | static slot rejection | no | no |
| source version producer/source differs from header | `Rejected`/consistency error | no | no |
| source version absent | continue with explicit absent option | yes | eligible |
| payload source family mismatches producer table | `Rejected` | typed payload may be decoded only to classify safe finite mismatch; no handler | no |

Schema compatibility is checked before payload interpretation. A future schema
must register a new typed payload decoder and compatibility row; it may not fall
through to the v1 decoder or silently ignore unknown fields.

### 12.2 Version relation rules

`source_version_ref` is an opaque producer-owned version token. I01 does not
compare it lexically, numerically or by timestamp. If the owner later supplies
a typed same-stream comparator, the flow may classify an older/equal/newer
event; until then, an incomparable or missing comparison is not evidence that a
source event is stale or safe to ignore.

| relation available from canonical owner | I01 target behavior |
|---|---|
| same stream and exact same version plus same digest | replay/no-op according to reservation result; never reapply |
| same stream and a proven older version | no local regression; exact `NoOp` or safe delayed classification only when owner supplies the proof |
| same stream and a proven newer version | continue through normal admission and transition checks |
| different stream, incomparable token or missing comparator | fail closed as typed dependency/consistency classification; do not order by time/cursor |

The older/newer mapping is registered as affected until the exact source-version
owner is propagated through the I01 flow. I01 does not use `occurred_at`,
`schema_version`, database version, or current-row order as a substitute.

## 13. Error, recovery and C-05 action mapping

### 13.1 Finite error surface

| detection point | error/outcome | local mutation | recovery classification |
|---|---|---|---|
| static consumer/body mismatch | `Rejected` / `InvalidRequest` | none | input correction; no same-frame retry |
| malformed required header | ephemeral `Rejected` | none | producer correction; source event may be absent |
| unsupported schema | ephemeral `UnsupportedSchema` | none | do not retry unchanged schema; producer/runtime registration change required |
| producer/source mismatch | ephemeral `Rejected` | none | configuration/producer correction; no handler call |
| invalid payload combination | ephemeral `Rejected` / `InvalidRequest` | none | producer correction; no same-key mutation |
| safe summary unavailable before accepted mutation | `Delayed` | no accepted local write | dependency recovery; no synthetic summary |
| reservation in flight | `Delayed` | no second write | wait/probe according to exact identity; no immediate recursive loop |
| idempotency conflict | `Rejected` | original row unchanged | manual/input correction; do not choose a winner |
| domain safety rejection | stored `Rejected` or `Quarantined` only if formal local disposition is committed | exact allowed local facts | flow/policy classification; no raw body persistence |
| known repository/commit failure before commit | application failure or ephemeral `Delayed` | staged UoW rolled back | typed dependency/retry policy; no fake receipt |
| commit outcome unknown after probe | no completion shape currently available | do not claim committed or absent | affected C-05 seam; manual/probe continuation |
| stored result missing/mismatched on replay | consistency failure | no current-truth reconstruction | manual repair; never rerun blindly |

Raw provider/error text is never used to choose an outcome or a transport
action. `retryable` is not inferred from the public outcome token.

### 13.2 Known C-05 action requirements

`InboundConsumerCompletion` remains the sole transport-action carrier. The I01
application result does not choose an action; the exact worker mapper does.
The following matrix records the current I01 target and what is still blocked
by the shared C-05 gap:

| I01 receipt surface | required action target | action precondition | current closure |
|---|---|---|---|
| fresh stored `Accepted` | `Acknowledge` | local UoW commit is known successful and stored receipt is validated | defined |
| stored `Replayed` with any inner outcome | `Acknowledge` | original stored surface is validated; handler is not rerun | defined |
| fresh stored `NoOp` | `Acknowledge` | no-change receipt is durably committed | defined at flow target; mapper propagation remains affected |
| fresh stored `DeadLettered` | `DeadLetter` | local body-free dead-letter marker and receipt commit are known successful | target defined; exact mapper remains affected |
| fresh stored `Quarantined` | explicit isolation action chosen by I01 flow policy | quarantine marker/receipt commit is known successful; raw body absent | open; no default ack/dead-letter may be assumed |
| fresh stored `Rejected` | explicit terminal/retry policy action | rejection receipt is committed, or pre-handler rejection is classified | open; outcome alone does not authorize an action |
| ephemeral `UnsupportedSchema` | no default action | producer/schema correction is required | open; do not blindly retry unchanged frame |
| ephemeral `Delayed` with known no-write | `Retry` only if exact recovery policy marks it retryable | no commit was made and retry does not create a loop | open pending exact I01 mapper |
| `Delayed` after commit probe remains indeterminate | no legal completion under current C-05 | probe returned Unknown/Unsupported | blocked by `S08-CONSUMER-INDETERMINATE-COMPLETION-01` |

The terms “defined” and “open” above describe design closure, not runtime
evidence. No action has been executed or tested.

### 13.3 Probe and indeterminate completion

When the application or worker cannot classify commit success, it must probe
the exact `(operation, actor, dedup key, source-event identity, request
digest)` relation. The probe may return:

| probe result | allowed next shape |
|---|---|
| committed and stored surface validates | return/reconstruct the original stored receipt; apply the exact replay/terminal mapper without rerun |
| not committed and reservation/UoW absence is proven | classify the known recovery branch; only then select a policy-approved action |
| reserved/in-flight | `Delayed`/in-flight; no second handler execution |
| unknown or unsupported probe | no `InboundConsumerCompletion` can be safely constructed with current C-05 carrier |

The current C-05 carrier has only `Acknowledge`, `Retry` and `DeadLetter`
variants and no typed no-completion/indeterminate return. I01 therefore must
not map the final row to any of those variants merely to satisfy totality. The
missing carrier or an equivalent signature repair is a blocking affected item.

### 13.4 Transport failure after local commit

If the local receipt is known committed and the selected transport action fails,
the worker reports the existing worker error. It does not roll back or rewrite
the receipt, outbox snapshot, H1 record or stored result. A later retry/probe
must use the stable I01 identity and original stored surface; it must not rerun
the application handler or reconstruct the payload from current truth.

## 14. `ConsumeBusObservationMaterialFlow` Step 09 handoff reservation

Step 08 reserves one and only one downstream flow name:
`ConsumeBusObservationMaterialFlow`. This section records the handoff shape;
the Step 09 document remains outside this batch.

```text
authenticated Bus delivery
  -> I01 header/payload gate
  -> ConsumeBusObservationMaterialInput
  -> reservation + secondary event identity
  -> intake/safety/admission local UoW
  -> stored Consumer receipt/result
  -> exact worker C-05 mapper
```

| handoff item | reserved contract | owner/constraint |
|---|---|---|
| flow name | `ConsumeBusObservationMaterialFlow` | Step 09 is the sole flow owner |
| entry input | complete I01 input plus authenticated delivery context | no raw frame/body and no direct repository access from worker |
| first gate | header/schema/producer/source-version validation | unsupported schema does not parse payload or reserve |
| reservation key | I01 logical scope plus secondary event identity | exact source event and dedup relations are both checked |
| primary local facts | `ObservationReceipt`, `SafetyDisposition`, H1 `IntakeDecisionRecord` | only observation-owned truth; same accepted UoW where transition exists |
| optional facts | body-free gap/marker/correlation projection and typed outbox snapshots | only when a canonical owner proves an actual transition |
| result | `ObservationConsumerResult` mapped to stored/ephemeral public receipt | no application-owned ack/retry/dead-letter field |
| completion | C-05 exact worker action | action selection is outside application result and cannot be defaulted on indeterminate |
| no-write boundary | source/business truth, raw body, transport state and external acceptance remain absent | no callback from Observability back into source truth |

Step 09 must refine save order, cursor allocation, repository signatures,
rollback/commit probe and per-flow action mapping without changing this
truth boundary. If its proposed flow requires current outbox lookup, raw-body
storage, a second receipt owner or an additional transport action, it must be
recorded as a conflict rather than silently changing I01.

## 15. I01 affected register

The following items are protocol-specific affected records. They are design
gaps, not implementation failures and not external blockers.

| ID | status | affected question | closure required | forbidden shortcut |
|---|---|---|---|---|
| `S08-E-I01-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | six Consumer control fields are not all represented by one current Step 06/07 field/accessor contract | propagate exact private input fields and source validation | let entry/service reconstruct missing fields |
| `S08-E-I01-SAFE-SUMMARY-TYPE-01` | `open_internal_affected` | Step 06 still uses historical `SafeSummaryRef` at the I01 use-site | replace use-site with canonical `SafeSignalSummaryRef` | alias or second wrapper |
| `S08-E-I01-PAYLOAD-COMBINATION-01` | `open_internal_affected` | marker/summary cross-field matrix needs one owner across contract, assembler and safety policy | propagate the seven-row matrix and typed error mapping | default marker, infer summary or accept illegal pair |
| `S08-E-I01-PRODUCER-SOURCE-MAP-01` | `open_internal_affected` | exact Bus producer/source-family compatibility table is not yet a single propagated catalog entry | publish one finite static registration relation | compare wire strings or use `From` |
| `S08-E-I01-DIGEST-ORDER-01` | `open_internal_affected` | I01 digest order and exclusion set must be consumed identically by assembler, reservation and stored-result replay | propagate the exact `inbound_consumer_request` material profile | endpoint-local hash or raw envelope hash |
| `S08-E-I01-SOURCE-VERSION-01` | `open_internal_affected` | source-version comparator and older/equal/newer mapping are not fully exposed to this flow | provide typed same-stream relation or retain explicit fail-closed branch | order by time, cursor, schema or row version |
| `S08-E-I01-UOW-RECEIPT-SAFETY-01` | `open_internal_affected` | receipt, disposition, H1 and stored result same-UoW proof is downstream of Step 09/11 | propagate exact staging and commit relation | split commits or claim success after partial write |
| `S08-E-I01-OUTBOX-REF-LOSSLESS-01` | `open_internal_affected` | public receipt requires exact outbox refs while current application result does not expose a unique source | add validated stored-surface field/accessor at its canonical owner | query current outbox or rebuild refs |
| `S08-E-I01-RESULT-SURFACE-01` | `open_internal_affected` | application `ObservationConsumerResult` and public Consumer receipt need a lossless field/presence mapper | close result-kind, outcome, refs and error mapping | generic disposition or empty result fallback |
| `S08-E-I01-QUARANTINE-SURFACE-01` | `open_internal_affected` | historical `QuarantineRef` has no canonical owner | remove the field or bind it to an existing owner | create a Step 08 alias or expose raw quarantine material |
| `S08-E-I01-ACTION-MATRIX-01` | `open_internal_affected` | Rejected, Quarantined, UnsupportedSchema, Delayed and NoOp action branches need exact worker mapper ownership | propagate per-flow C-05 mapping and recovery classification | wildcard ack/retry/dead-letter |
| `S08-E-I01-INDETERMINATE-01` | `open_internal_affected` | current C-05 has no legal completion after an unknown probe | add typed no-completion shape or tighten handler return contract | assume commit state or choose a terminal action |
| `S08-E-I01-STEP09-HANDOFF-01` | `open_internal_affected` | Step 09 must carry I01's exact input, receipt, outbox and no-write boundary | create one flow carrier and save-order contract | duplicate flow or reuse a generic Consumer template |

Shared affected records also remain applicable:
`S08-CONSUMER-OUTBOX-SURFACE-01`,
`S08-CONSUMER-QUARANTINE-REF-01`,
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`,
`S08-SOURCE-EVENT-REF-OWNER-01`, `R06-F-AFFECT-UOW-01` and
`03-RPR-S09-PER-FLOW`. I01 does not close any of them by assertion.

## 16. I01 static closure checklist

| check | result | evidence boundary |
|---|---|---|
| one logical Consumer and one required producer | pass at design-record level | §4.2, §7.4 |
| header validated before payload decode | pass at design-record level | §6.1, §7.3, §12.1 |
| actor comes only from trusted worker delivery | pass | §3, §7.2, §8.3 |
| source event, dedup key and trace remain distinct | pass | §8.2-§8.3 |
| canonical digest fields/order/exclusions recorded | pass at target level; propagation affected | §8.1, `S08-E-I01-DIGEST-ORDER-01` |
| raw body cannot enter input, digest, receipt or error | pass | §9 |
| summary/marker absence and combinations are explicit | pass at target level; owner propagation affected | §6.3, §9.2 |
| source version does not fall back to time/cursor | pass | §7.2, §12.2 |
| receipt, safety, H1 and stored result relation recorded | pass at target level; UoW propagation affected | §10 |
| duplicate replays exact stored surface without reapply | pass | §8.2, §11.2 |
| no `Duplicate` durable/public outcome introduced | pass | §8.2, §11 |
| outbox refs have lossless source or explicit affected | pass_with_affected_open | §10.1, §11.3 |
| quarantine has no invented ref owner | pass_with_affected_open | §11.3, §15 |
| all seven shared Consumer outcomes mapped | pass at target level; action branches affected | §11.2, §13.2 |
| indeterminate commit is fail-closed | pass_with_affected_open | §13.3 |
| exactly one Step 09 handoff reserved | pass | §14 |
| source/business/external truth is not written back | pass | §§1, 4, 10, 14 |
| implementation/test/evidence claims | not run / not claimed | this document only |

## 17. I01 stop review

| item | conclusion |
|---|---|
| current document / step | `03-详细设计.md` calibration, Step 08, S08-E Consumer I01 |
| protocol status | `defined_with_affected_open`; not unconditional complete |
| independent I01 artifact | complete for this review batch, including input, digest, redaction, UoW, receipt, outcome, action and Step 09 handoff reservation |
| affected status | 13 I01-specific affected records remain open, plus shared Consumer/UoW/Step 09 affected records |
| protocol count | `31/60 defined_with_affected_open`; Query `14/14`; Consumer `1/9`; `0/60` unconditional complete |
| external upstream blocker | no new external blocker found |
| known controlled blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`, unrelated to I01; `03-RPR-S09-PER-FLOW` and `R06-F-AFFECT-UOW-01` remain downstream/open |
| formal document | unchanged and frozen; no reassembly before Step 19 |
| implementation/test/evidence | not run; no commit, run id, evidence alias or acceptance signature created |
| next allowed action | stop review; after explicit user confirmation, read only I02's required Step 06/07 owner and callable materials |
| current recovery point | `Step08_S08-E_I01_defined_with_affected_open_waiting_user_before_I02` |
| submission | not needed; user did not request a commit |

This stop is a gate. Do not enter I02, read I03-I09, inspect Outbound Event or
Job protocol material, enter Step 09, modify formal `03`, or modify any `04`
file until the user explicitly confirms the next batch.
