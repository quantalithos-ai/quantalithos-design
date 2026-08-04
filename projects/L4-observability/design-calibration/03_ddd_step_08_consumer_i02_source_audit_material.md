# L4-observability 03-详细设计 Step 08 - S08-E Consumer I02 `ConsumeSourceAuditMaterial`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 当前模式: full-restart / affected-only rebuild
> 当前批次: S08-E Consumer I02
> 回填目标: `03-详细设计.md` §7；正式文档只允许在 Step 19 重新装配

## 1. Step 开工确认与当前状态

| 项目 | 记录 |
|---|---|
| Step | Step 08 `定义 API / Command / Query / Event / Job 协议契约` |
| 协议族 / 编号 | Inbound Event Consumer / I02 of 9 |
| 逻辑协议 | `ConsumeSourceAuditMaterial` |
| 输出文件 | `design-calibration/03_ddd_step_08_consumer_i02_source_audit_material.md` |
| 已读取通用规范 | yes；通则、中间产物规范、真相源闭环标准、依赖裁剪规则 |
| 已读取文档类型规范 | yes；详细设计 SOP、详细设计书写规范 §5.6/§5.7 |
| 已读取前序输入 | yes；当前 `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、I01、Step 06/07 I02 owner、S08 shared carrier |
| 当前模式 | full-restart / affected-only rebuild |
| 模块骨架 | done；本文件只覆盖 I02，不覆盖 I03~I09、Event、Job 或 Step 09 |
| 思考记录 | done for this batch; unresolved owner gaps are recorded as affected |
| 写入记录 | complete for this bounded I02 batch |
| 自检状态 | pass_with_affected_open；16个I02专属affected已登记 |
| gate status | `Step08_S08-E_I02_defined_with_affected_open_waiting_user_before_I03` |
| 正式 `03` | frozen；本批不回填 |
| 当前提交 | 不需要；用户未要求提交 |

本协议把受认证的 source-audit material 转换为 Observability 自有的
body-free audit projection 输入、H3 append record 及其 stored Consumer
receipt。它只承载观测与审计投影，不拥有 source audit truth、source audit
body、Governance decision、Artifact evidence、Identity、Runtime、Sandbox、
Archive 或外部验收 truth。

### 1.1 本批禁止事项

- 不读取或写入 I03~I09、S08-F/G、Step 09~19、正式 `03`、任何 `04` 文件或实现代码。
- 不把 source audit body、action text、event body、provider response、credential、locator 或 raw labels 放入 input、digest、receipt、error、outbox 或持久化。
- 不把 `SourceOwner` producer、`SourceFamilyKind`、`source_audit_ref`、`source_event_ref`、`dedup_key`、`trace_ref`、`actor_ref` 或 `source_version_ref` 合并为一个字段或一个 identity。
- 不从 source audit material 猜 schema、推导 actor、生成 Governance / Artifact / Runtime / Sandbox truth，或反写任何 source owner。
- 不在 Step 08 新建第二个 `AuditProjection`、第二个 H3 record owner、`QuarantineRef`、generic Consumer disposition 或新的 transport action。
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
| 4 | 当前 `02-概要设计.md` 与 HLD Consumer 骨架 | 统一入口、source-audit 投影边界、source body 禁止、Step 09 handoff 方向 | 概要只给边界和骨架，不替代 exact payload/port |
| 5 | Step 06 input assembly / digest canonicalizer | I02 payload use-site、六个 Consumer control fields、公共 digest 前缀与 payload 顺序 | 历史 `SafeSummaryRef` use-site不能覆盖 current canonical type |
| 6 | Step 06 domain audit / policy / record owner | `AuditProjection`、`AuditProjectionTransition`、`AuditAppendRecord`、`SafeExternalSummaryRef` | source audit body永远不进入 domain object或H3 |
| 7 | Step 07 assembler/service/repository/worker carrier | exact callable、atomic reservation、audit repository、stored result、C-05 completion | shared carrier缺口保持 affected，不在此处补造 action |
| 8 | current Step 08 shared carrier与I01独立产物 | outcome、receipt、replay、redaction、indeterminate和handoff格式 | I01是粒度参考，不复制 Bus truth或字段 |
| 9 | `projects/L0-bus` source-audit/tap边界材料 | Bus只输出只读 audit material，Observability长期投影归属 | L0-bus不成为本仓 source audit truth owner |

### 2.2 权威优先级

```text
I02 current artifact and its affected register
  > Step 07 exact I02 assembler/service/repository/worker callable
  > Step 06 canonical audit/input/digest/record owner
  > Step 08 shared envelope/receipt/result carrier
  > current 02/HLD and L0-bus producer boundary
  > frozen formal 03, README and old protocol text
```

Step 06 的 I02 input row 仍使用历史 `SafeSummaryRef` spelling；当前 audit
domain owner使用 `SafeExternalSummaryRef`，而公共 Consumer payload设计需要
body-free source-audit summary。该差异在本文件中按 affected 处理，不创建 alias，
也不把它误报成已闭合字段。

## 3. SOP 23 问回答

| # | 问题 | I02 当前回答 |
|---:|---|---|
| 1 | 本轮定义什么协议 | 只定义 `ConsumeSourceAuditMaterial`；不展开其他 Consumer |
| 2 | 协议族与模块 | S08-E Inbound Event Consumer；worker entry -> inbound assembler -> `ObservationInboundEventService` |
| 3 | 调用方、处理方 | 受认证的 finite source-audit producer 是协作输入方；worker 调 matching assembler；application service消费 concrete input |
| 4 | 传输方式 | typed asynchronous delivery/completion；topic、endpoint、credential和transport locator留给配置/entry binding，不写入本协议 |
| 5 | envelope | shared `ObservationInboundEventEnvelope<SourceAuditMaterialPayload>`；header先校验，再解码 typed payload |
| 6 | application input | `ConsumeSourceAuditMaterialInput`，含 Consumer control fields与五个 I02 payload fields |
| 7 | application result | `ObservationConsumerResult`；fresh/replayed stored receipt或允许的 ephemeral receipt，exact outbox/result source仍受 shared affected约束 |
| 8 | 目标对象 / 本地事实 | `AuditProjection`、`AuditProjectionTransition`、H3 `AuditAppendRecord`、stored Consumer result/receipt及同一 accepted UoW 的 outbox snapshot refs |
| 9 | 必填字段来源 | envelope header来自认证 producer binding；actor来自可信 worker delivery；payload字段来自已验证的 body-free typed material |
| 10 | 缺失行为 | header/schema/producer/version mismatch在payload解析或reservation前拒绝；correlation缺失按显式 delayed/gap policy处理；summary缺失不能用空值代替 |
| 11 | response / receipt | shared outcome、result ref、changed/outbox/gap/dead-letter/error presence；不增加 `Duplicate` |
| 12 | duplicate / idempotency | logical `(operation, actor, dedup_key)` 加 secondary `(consumer, producer, source_event_ref)`；exact replay返回原stored surface，不重跑append |
| 13 | actor authority | effective actor只来自可信 C-03 worker delivery；source audit中的 actor-like字段不授权本地 projection |
| 14 | redaction | 只允许 typed source audit ref、subject/context refs、canonical safe summary、finite source family与visibility/result markers；不保存source body |
| 15 | correlation | `trace_ref`、`source_event_ref`、`source_version_ref`、`source_audit_ref`和`correlation_context_ref`保持不同语义 |
| 16 | audit | I02只追加 Observability-owned H3 audit projection record；H3不表示source audit action成功或外部审计完成 |
| 17 | UoW | projection、transition、H3、stored result、receipt和accepted outbox snapshot必须有同一UoW证据；当前 save/commit carrier部分affected |
| 18 | quarantine / dead-letter | local safety/terminal marker可表达有限结果；不创建 `QuarantineRef` alias，不把 worker dead-letter action当本地 source truth |
| 19 | C-05 action | application只返回 `ObservationConsumerResult`；worker mapper按 I02 flow/recovery分类选择 action |
| 20 | indeterminate | commit probe后仍 unknown/unsupported时，当前 C-05没有合法 no-completion carrier；fail closed并登记 affected |
| 21 | Step 06/07/09 | Step 06拥有 audit object/record/input owner；Step 07拥有 exact assembler/service/repository seam；Step 09唯一 handoff为 `ConsumeSourceAuditMaterialFlow` |
| 22 | error | typed protocol, source/version mismatch, safe-summary dependency, relation, idempotency, domain and commit errors；不传播 provider/error body |
| 23 | cross-protocol closure | I02只形成独立协议记录；Consumer其余8项、Outbound/Event/Job、Step 09和全协议审计仍未完成 |

## 4. Truth boundary and exact logical binding

### 4.1 Owned and non-owned truth

| boundary | I02 rule |
|---|---|
| source producer | `ObservationProducerFamily::SourceOwner` is an authenticated producer namespace, not proof of source audit success |
| source family | payload `SourceFamilyKind` identifies the named source/audit family; it is not an implicit cast from producer family |
| local owned facts | body-free `AuditProjection`, its append transition, H3 `AuditAppendRecord`, local receipt/result, optional gap/visibility marker and committed outbox snapshot refs |
| non-owned facts | source audit event/body/action, Governance decision, Artifact evidence, identity/runtime/sandbox state, archive package, external audit acceptance, report verdict or signoff |
| write direction | source owner -> Observability collaboration input; no callback or write path back to source truth |
| completion direction | local result -> worker C-05 mapper -> transport registrar; transport failure never rewrites a committed local projection |

### 4.2 Finite binding

| item | exact value |
|---|---|
| consumer name | `ObservationInboundConsumerName::ConsumeSourceAuditMaterial` |
| operation | `ObservationInboundConsumerOperation::ConsumeSourceAuditMaterial` |
| discriminator | `0x0302`；按 current inbound operation table递增绑定 |
| required producer | `ObservationProducerFamily::SourceOwner` |
| payload type | `SourceAuditMaterialPayload` |
| application assembler | `ObservationInboundInputAssembler::consume_source_audit_material` |
| application façade | `ObservationInboundEventService::consume_source_audit_material` |
| audit repository | `AuditEvidenceRepository::stage_projection` + `append_audit_record` |
| flow reservation | `ConsumeSourceAuditMaterialFlow` |
| transport locator | not defined here；由 entry/config binding提供 |

The producer binding is finite and static. A wrong consumer, unsupported
schema, unknown source family or mismatched source-version relation cannot fall
through to another Consumer. `SourceOwner` and `SourceFamilyKind` remain
different Rust types even when their wire tokens look similar.

## 5. Exact call chain and callable signatures

### 5.1 Worker-to-application chain

```text
authenticated source-owner delivery
  -> select static I02 slot
  -> validate envelope header and source/version relation
  -> decode SourceAuditMaterialPayload
  -> ObservationInboundInputAssembler::consume_source_audit_material
  -> ObservationInboundEventService::consume_source_audit_material
  -> reserve logical + source-event identities
  -> create/append local AuditProjection and H3 record
  -> store result/receipt in the accepted UoW
  -> worker exact C-05 action mapper
  -> private transport registrar
```

The worker does not call repositories, create a domain projection, resolve a
source body, or select a transport action directly. The assembler is
synchronous and I/O-free; the service consumes the complete concrete input by
value.

### 5.2 Exact signatures

```rust
pub trait ObservationInboundInputAssembler: Send + Sync {
    /// Assemble one validated source-audit delivery without exposing its body.
    fn consume_source_audit_material(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<SourceAuditMaterialPayload>,
    ) -> Result<ConsumeSourceAuditMaterialInput, ApplicationError>;
}

pub trait ObservationInboundEventService: Send + Sync {
    /// Consume one validated source-audit input and return a local receipt/result.
    fn consume_source_audit_material<'a>(
        &'a self,
        input: ConsumeSourceAuditMaterialInput,
    ) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
}
```

The matching assembler privately invokes the digest canonicalizer and
`ObservationOperationContextFactory::for_inbound_event`. Neither helper is an
entry capability. No public method accepts raw bytes, a generic Consumer enum,
a public envelope wrapper, or a caller-selected transport action.

## 6. Shared envelope and I02 typed payload

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

1. Select the authenticated static I02 slot.
2. Validate `source_event_ref`, `source_ref`, optional `source_version_ref`, `producer_family`, `schema_version`, `dedup_key`, `occurred_at` and optional `trace_ref`.
3. Require the exact consumer name and `producer_family == SourceOwner`.
4. Check the finite source-owner/schema registration.
5. If `source_version_ref` is present, require its producer and source to equal the envelope exactly.
6. Decode only `SourceAuditMaterialPayload`; never try a different payload decoder.
7. Pass the trusted `actor_ref` separately from the envelope.

Malformed or missing source-event identity cannot establish a secondary event
identity. It may produce only the shared ephemeral `Rejected` surface with
`source_event_ref=None`. Unsupported schema after a valid source event produces
`UnsupportedSchema`, with no typed payload interpretation and no reservation.

### 6.2 Payload DTO

```rust
/// Body-free material used to build an observability-owned audit projection.
pub struct SourceAuditMaterialPayload {
    /// Upstream source-audit identity; never contains the audit body.
    pub source_audit_ref: SourceAuditRef,

    /// Local observation subject for the audit timeline.
    pub subject_ref: AuditSubjectRef,

    /// Optional already-bound observation correlation context.
    pub correlation_context_ref: Option<CorrelationContextRef>,

    /// Trusted body-free summary of the source-audit material.
    pub source_audit_summary_ref: SafeExternalSummaryRef,

    /// Truth-owner family named by the source-audit material.
    pub source_family: SourceFamilyKind,
}
```

The Step 06 input row names the fourth field
`audit_action_summary_ref: SafeSummaryRef`. The current audit object and H3
record owner instead use `source_audit_summary_ref: SafeExternalSummaryRef`.
This artifact adopts the canonical current name and records the Step 06
use-site mismatch as `S08-E-I02-SAFE-SUMMARY-OWNER-01`; it does not create a
second wrapper or silently accept either spelling.

| payload field | authoritative owner/source | validation | absent/forbidden substitution |
|---|---|---|---|
| `source_audit_ref` | `contracts::refs::SourceAuditRef`; trusted source-audit producer | typed body-free ref, correct source relation and non-empty identity | no URL, row id, body parse, or ref-prefix inference |
| `subject_ref` | `contracts::refs::AuditSubjectRef`; source-owner mapping or trusted input contract | typed body-free timeline subject; relation to source-audit material must be explicit | no source body, actor profile, tenant string, or current-row guess |
| `correlation_context_ref` | optional canonical `CorrelationContextRef` | if present, relation must be validated by the source/context resolver; `Bound` is required before projection create | missing is not an empty context; do not mint a context from trace text |
| `source_audit_summary_ref` | canonical `SafeExternalSummaryRef` from trusted safe-summary projection | body-free, source-bound and compatible with source ref/family | no raw action text, provider summary, `SafeSummaryRef` alias, empty string or synthetic ref |
| `source_family` | finite `SourceFamilyKind` payload member | exact compatibility row with `SourceOwner` producer and registered schema | never default from producer, route or source ref prefix |

The payload deliberately has no actor, tenant, credential, route, topic,
partition, offset, action body, event body, provider metadata or external
acceptance field. Any such material is rejected or isolated before it can enter
the application input.

### 6.3 Source-owner / source-family compatibility

The required producer and payload family are independent axes. The current
target relation is finite:

| producer family | payload `source_family` | result |
|---|---|---|
| `SourceOwner` | registered source-audit family | eligible for typed payload and policy validation |
| `SourceOwner` | unknown family | typed invalid payload; no reservation |
| `SourceOwner` | family not registered for source-audit material | producer/source mismatch; no reservation |
| any non-`SourceOwner` producer | any value | static I02 slot rejection before payload dispatch |

The exact list of registered source-audit families and their producer-owned
compatibility relation is not a string comparison. Its canonical catalog owner
is still open under `S08-E-I02-PRODUCER-SOURCE-CATALOG-01`; until propagated,
the service must fail closed on an unregistered row.

## 7. Concrete input and field provenance

### 7.1 Input shape

`ConsumeSourceAuditMaterialInput` is process-local, constructed atomically by
the matching assembler and consumed by value by the matching service. It is
not a wire DTO, durable row, replay payload or transport completion.

```rust
/// Fully validated, body-free application input for I02.
pub struct ConsumeSourceAuditMaterialInput {
    // The six Consumer control fields are repeated in every concrete input.
    context: ObservationOperationContext,
    request_digest_candidates: RequestDigestCandidates,
    source_ref: ObservationSourceRef,
    source_version_ref: Option<ObservationSourceVersionRef>,
    schema_version: SchemaVersion,
    occurred_at: ObservedAt,

    // I02 operation-specific typed payload fields.
    source_audit_ref: SourceAuditRef,
    subject_ref: AuditSubjectRef,
    correlation_context_ref: Option<CorrelationContextRef>,
    source_audit_summary_ref: SafeExternalSummaryRef,
    source_family: SourceFamilyKind,
}
```

`source_ref` identifies the source stream/object in the common envelope;
`source_audit_ref` identifies one source-audit material identity in the typed
payload. They must remain distinct even if an upstream producer happens to use
the same underlying token. Neither is a substitute for `source_event_ref`.

### 7.2 Field-source register

| input field | authoritative source | construction / validation | forbidden substitution | status |
|---|---|---|---|---|
| `context` | private `ObservationOperationContextFactory::for_inbound_event` | fixed I02 operation, trusted actor, dedup key, digest and event identity constructed together | route string, payload actor, setter after construction | target closed |
| `request_digest_candidates` | `ObservationDigestCanonicalizer::request_candidates` over validated typed material | generated once after header/payload validation; write candidate is used for reservation | raw envelope hash, transport digest, endpoint-local hash | propagation affected |
| `source_ref` | validated common envelope header | typed ref validated before payload decode | payload audit ref, topic, partition, body | target closed |
| `source_version_ref` | optional common envelope header | present value must repeat producer/source exactly; token remains opaque | occurred time, schema version, cursor, row version | owner affected |
| `schema_version` | exact I02 envelope slot | supported set checked before payload parse | payload default or current config fallback | target closed at v1 |
| `occurred_at` | validated producer event metadata | retained as source time; never used for version order | local clock, delivery time, cursor | target closed |
| `source_audit_ref` | typed payload / trusted source-audit owner | body-free ref and source relation checked | body parse, URL, row id, source ref cast | owner relation affected |
| `subject_ref` | typed payload / source-owner subject mapper | exact body-free subject and source relation required | actor, tenant, source ref prefix or current subject lookup | mapper affected |
| `correlation_context_ref` | optional typed payload member | bound context relation must be validated before projection creation | trace id cast, synthetic context, empty default | relation affected |
| `source_audit_summary_ref` | canonical `SafeExternalSummaryRef` | source-bound safe projection required; no body access | historical `SafeSummaryRef`, raw summary, empty value | type owner affected |
| `source_family` | typed payload member | finite source-owner catalog row required | producer enum cast, route or default | catalog affected |

The assembler returns either one complete input or a typed
`ApplicationError`. It never returns a partial input, a payload whose summary
type can be interpreted by another Consumer, or a context detached from its
digest/event identity.

### 7.3 Exact assembly order

| stage | operation | no-side-effect rule |
|---:|---|---|
| 1 | select static I02 slot and assert consumer/body binding | wrong slot/body -> `InvalidRequest`; no payload fallback |
| 2 | obtain trusted C-03 `ActorSafeRef` | missing/untrusted actor stops before input construction; payload actor-like values ignored |
| 3 | validate common header and source-version relation | malformed refs/schema/producer stop before payload materialization |
| 4 | decode and validate exact I02 payload fields | unknown family, wrong summary owner or forbidden body stops before digest |
| 5 | validate source-owner catalog and subject/context relation | missing/ambiguous relation is typed reject/delayed; never infer from names |
| 6 | construct canonical `inbound_consumer_request` material | process-local; never log, serialize as body or persist |
| 7 | generate `RequestDigestCandidates` once | digest error means no reservation/UoW |
| 8 | construct `ObservationInboundEventIdentity` and private context | exact operation/producer/source event match; no string conversion |
| 9 | construct `ConsumeSourceAuditMaterialInput` atomically | constructor rechecks operation, source and digest relations |

### 7.4 DTO-to-domain construction closure

| input contract | target object / record | required fields | derivation / lookup | missing behavior |
|---|---|---|---|---|
| `SourceAuditMaterialPayload` + validated context | `AuditProjection` | projection ref, subject, bound correlation context, source audit ref, safe summary | projection ref is generated by canonical id generator; correlation context is loaded/validated; summary is copied by typed ref | reject or delayed before create; no synthetic projection |
| `AuditProjection` + accepted source-fact transition | `AuditAppendRecord` H3 projection branch | H3 ref, metadata, subject, source audit ref, safe summary, transition kind, post-state | H3 ref generated before mutation; transition ref and metadata must match; record factory consumes transition/post-state | rollback; no record for failed transition |
| accepted projection/result UoW | stored Consumer result/receipt | exact outcome, result ref, changed refs, outbox refs, gap refs, safe error | stored-result owner retains accepted UoW snapshot; response mapper is lossless | affected if any source field is absent; no current-truth reconstruction |

The `AuditProjection` row is not source-audit truth. A local `Appended`
projection only means the Observability append committed. It does not mean the
source audit action, Governance decision, external audit or report handoff
succeeded.

## 8. Canonical digest, event identity and correlation

### 8.1 Canonical inbound material

I02 uses the shared `inbound_consumer_request` material kind with an operation
specific payload profile. The digest is generated only after the authenticated
header, the typed payload, the source-family catalog and all body-free relation
checks have passed. The canonical member order is fixed:

```text
{"operation":"consume_source_audit_material",
 "actor_ref":<ActorSafeRef>,
 "producer_family":"source_owner",
 "source_event_ref":<SourceEventRef>,
 "source_ref":<ObservationSourceRef>,
 "source_version_ref":<Option<ObservationSourceVersionRef>>,
 "schema_version":"v1",
 "payload":{
   "source_audit_ref":<SourceAuditRef>,
   "subject_ref":<AuditSubjectRef>,
   "correlation_context_ref":<Option<CorrelationContextRef>>,
   "source_audit_summary_ref":<SafeExternalSummaryRef>,
   "source_family":<SourceFamilyKind>
 }
}
```

The display form is explanatory. The canonical writer emits the registered
compact frame, typed discriminators, explicit `Option` tags and the escaping
rules owned by the Step 06 digest registry. It does not serialize a Rust
`Debug` representation, a transport envelope, or a provider document.

| ordinal | material member | included | reason |
|---:|---|:---:|---|
| 1 | operation token | yes | separates I02 from every other Consumer |
| 2 | effective `actor_ref` | yes | binds the local logical operation scope |
| 3 | `producer_family` | yes | preserves authenticated producer authority |
| 4 | `source_event_ref` | yes | binds the exact delivered event |
| 5 | `source_ref` | yes | binds the source stream/object relation |
| 6 | `source_version_ref` | yes, explicit absent/present | preserves producer version semantics without guessing order |
| 7 | `schema_version` | yes | prevents cross-schema equivalence |
| 8 | `source_audit_ref` | yes | identifies the source-audit material, independently of event identity |
| 9 | `subject_ref` | yes | binds the local audit timeline subject |
| 10 | `correlation_context_ref` | yes, explicit absent/present | preserves the context relation used by projection creation |
| 11 | `source_audit_summary_ref` | yes | binds the accepted body-free summary projection |
| 12 | `source_family` | yes | preserves the payload's independent truth-owner family |

The following values are excluded from the request digest:

| excluded value | reason |
|---|---|
| `dedup_key` | logical idempotency input, compared and stored separately |
| `occurred_at` | source time is not a local ordering or material version |
| envelope `trace_ref` | correlation metadata is not admission material |
| delivery id, offset, partition, attempt and acknowledgement state | transport facts are not source or local truth |
| supplied digest | it is verified against the locally generated candidate, never hashed into itself |
| generated projection/H3/result refs, row versions, cursor and UoW identity | coordination metadata must not change replay identity |
| source-audit body, provider response, action text and raw labels | forbidden body-free boundary |

`RequestDigestCandidates` has one I02 write candidate and the corresponding
registered replay comparison profile. The assembler creates the candidates
once and passes the owned value to the reservation/context factory. The service,
repository and replay probe must compare the same candidate bytes and digest;
none of them may recanonicalize the envelope or read current projection state
to reconstruct a digest.

### 8.2 Logical, event and semantic identity

I02 keeps three relations separate:

```text
logical reservation scope:
  (ConsumeSourceAuditMaterial, effective ActorSafeRef, dedup_key)

secondary delivery identity:
  (ConsumeSourceAuditMaterial, SourceOwner, source_event_ref)

source-audit semantic relation:
  (source_ref, source_family, source_audit_ref, subject_ref)
```

The first two relations are reservation identities and must be acquired or
checked in the same reservation boundary. The third is a domain relation used
to select the sole local projection. It is not a replacement for the event
identity and is not allowed to be implemented as a string-concatenated key.
The canonical owner and exact repository lookup for this relation remain an
affected item. Until that owner is propagated, an ambiguous or unresolvable
relation fails closed; the service must not mint a new projection ref merely to
avoid the lookup.

| incoming relation | required behavior |
|---|---|
| same logical scope, same digest, same event identity, completed result | return the exact stored surface with `Replayed`; do not append again |
| same logical scope, same digest, same event identity, reservation in flight | return ephemeral `Delayed`; do not start a second writer |
| same logical scope with a different digest | typed `IdempotencyConflict`; no winner material is returned |
| same event identity with a changed dedup key | secondary conflict; no second reservation or handler call |
| same dedup key with a changed event/producer identity | logical/secondary mismatch; fail closed |
| one unique semantic source-audit relation with no completed source fact | load the sole projection or create one through the canonical owner, then continue |
| zero semantic relation rows but the source material is otherwise valid | create is eligible only after the canonical relation owner proves absence |
| multiple semantic relation rows or relation drift | consistency error; no projection ref is generated |
| same semantic relation with a different event identity and no owner proof of equivalence | conflict or delayed relation classification; never silently treat it as replay |

`ObservationProtocolResultAccess::Replayed` is the only duplicate indication at
the public invocation surface. It wraps the original stored result/receipt and
does not become an outcome, durable state, digest member, new H3 record or new
outbox snapshot.

### 8.3 Correlation separation

| value | authority | retained use | cannot replace |
|---|---|---|---|
| `ActorSafeRef` | authenticated C-03 worker delivery | effective local actor/principal | payload actor-like field, producer family or dedup key |
| envelope `trace_ref` | validated delivery metadata | optional cross-system correlation | source event, source audit ref, dedup or local context binding |
| `SourceEventRef` | authenticated source-owner header | secondary delivery identity | source audit identity, trace, offset or body |
| `ObservationSourceRef` | common envelope source header | source stream/object boundary | source audit ref or subject |
| `SourceAuditRef` | typed source-audit payload | source-owned audit-material identity | source event, source version or projection ref |
| `SourceVersionRef` | source-owner header | opaque same-stream revision input | schema version, occurred time, cursor or row version |
| `CorrelationContextRef` | canonical correlation owner | bound local context relation required by projection | trace token, source event or subject inference |
| `AuditSubjectRef` | source/subject relation owner | local timeline subject | tenant string, actor profile or source-ref prefix |
| `dedup_key` | producer delivery metadata | logical reservation scope | source event, digest or semantic source relation |

No conversion between these types is implicit. In particular, a source audit
reference cannot be copied into `AuditProjectionRef`, and a trace token cannot
be turned into a `CorrelationContextRef` without the canonical resolver and
binding proof.

## 9. Redaction and body-free admission

### 9.1 Accepted material surface

Only the following values may cross the I02 application boundary:

- typed source, source-event, source-version and source-audit references;
- typed `AuditSubjectRef` and an explicitly validated optional
  `CorrelationContextRef`;
- canonical body-free `SafeExternalSummaryRef`;
- finite `SourceFamilyKind`, schema and result/visibility markers;
- trusted actor, trace and idempotency metadata;
- bounded local result, projection/H3, gap and outbox references after commit.

`SafeExternalSummaryRef` identifies a separately accepted safe projection. It is
not permission to fetch, log, serialize or persist the source audit body. The
payload contains no actor, tenant, credential, route, topic, partition, offset,
provider response, action text, evidence body or external acceptance field.

### 9.2 Body and relation matrix

| observed condition | classification | durable local write | forbidden behavior |
|---|---|---|---|
| typed body-free payload, registered family and complete relations | continue | eligible for source-fact append | do not fetch source body |
| `source_audit_summary_ref` absent or malformed | structural `Rejected` | none | do not use empty/default summary |
| summary ref present but its safe projection is unavailable | `Delayed` if dependency may recover | no accepted projection append | do not mark the source audit safe or append a synthetic ref |
| summary ref belongs to another source/family | relation `Rejected` | none | do not accept by ref token shape |
| correlation context absent and no bound context can be proven | `Delayed` or typed relation rejection | no projection create/append | do not mint context from `trace_ref` |
| correlation context present but not `Bound` or subject-mismatched | typed relation rejection | none | do not downgrade to an empty context |
| source audit body/action/provider fields detected at the boundary | boundary rejection or explicitly owned body-free quarantine classification | only a permitted body-free marker, if a canonical owner exists | never hash, log, store or dead-letter the body |
| source family unknown or not registered for I02 | `Rejected` | none | do not default from `SourceOwner` or route |
| source relation is ambiguous | consistency `Rejected`/`Delayed` according to owner | none | do not choose first row or create a second projection |

The current payload makes the safe summary reference non-optional. Therefore a
missing summary is a pre-handler structural failure, while a valid reference
whose backing safe projection cannot be read is a dependency classification.
The distinction must remain visible in the typed error and must not collapse to
`None` or `Accepted`.

### 9.3 Safe diagnostics

Protocol/application errors and logs may expose only a finite error kind, safe
typed references, operation token, bounded counts and redaction markers. They
must not include source bytes, summary text, labels, provider text, credentials,
transport locator, stack trace or raw serialization. Any diagnostic projection
is a projection of the local decision, not a copy of source audit content.

## 10. I02 local UoW and durable fact mapping

### 10.1 Accepted local write set

An accepted I02 branch stages only facts owned by Observability. The exact
repository implementation remains a Step 09/11 concern, but the relation and
ordering are fixed here:

| order | local fact | source / relation | same-UoW requirement |
|---:|---|---|---|
| 1 | idempotency reservation | operation, trusted actor, dedup key, digest and source-event identity | acquired before domain mutation; replay/conflict/in-flight are no-write branches |
| 2 | semantic source-audit relation read | source/ref/family/audit/subject tuple | bounded read and uniqueness proof precede projection creation or append |
| 3 | `AuditProjection` pre-state or new projection | canonical projection owner, bound context, subject and safe summary | create/load and relation proof use the same accepted UoW boundary |
| 4 | `AuditProjectionTransition` | `append_source_fact` over validated body-free source material | transition is the only source-fact mutation; no direct field assignment |
| 5 | staged projection post-state | `AuditEvidenceRepository::stage_projection` with expected version | create/CAS and reservation are committed atomically |
| 6 | H3 `AuditAppendRecord` | accepted transition plus the same projection post-state | exactly one projection-branch H3 record per accepted transition |
| 7 | immutable `AuditProjectionAppended` outbox snapshot, if required by the transition | accepted pre/post facts and typed event encoder | snapshot is created from this UoW; publisher never rebuilds it |
| 8 | stored Consumer result/receipt surface | exact outcome, changed refs, outbox refs, gap/error presence | explicit empty collections are stored; no current lookup fallback |
| 9 | idempotency completion pointer | stored result ref for this reservation | reservation and result pointer complete in the same accepted commit |

The list is a relation contract, not permission to create a new audit object or
result type in Step 08. A source-fact transition that does not change the local
projection has no H3 record and no append event. `outbox_refs=[]` is an explicit
stored fact when no follower is produced.

### 10.2 Projection create, relation lookup and transition

The service must not generate a projection reference before it has proved that
the semantic source-audit relation has no existing row. The target algorithm is:

```text
validate complete I02 input
  -> reserve logical and secondary identities
  -> resolve the sole projection by the typed source-audit relation
  -> if absent, construct AuditProjection with bound context and safe summary
  -> if present, validate subject/source/family/context relation and row version
  -> call AuditProjection::append_source_fact with body-free source material
  -> receive accepted AuditProjectionTransition and post-state
  -> build one H3 projection record from transition + same post-state
  -> stage projection CAS/create and H3 append in one ObservationUnitOfWork
```

`AuditProjection::create` is valid only with a bound `CorrelationContext`, a
typed `AuditSubjectRef`, the source-audit relation and a body-free
`SafeExternalSummaryRef`. `AuditProjection::append_source_fact` is the sole
domain transition for this protocol; the application service cannot set a
source fact, append head, visibility or summary field directly.

If the relation lookup returns multiple rows, a row with a mismatched source or
subject, or a row whose version cannot be validated, the service returns a
typed consistency/dependency error and stages no projection, H3 or outbox. It
must not create a new projection ref and leave the duplicate relation for a
later repair.

### 10.3 H3 construction closure

The H3 record is built only after the domain transition is accepted. The record
factory consumes the transition and the same-UoW post-state; it does not reload
the projection or infer the change kind from the final state.

```rust
let transition = projection.append_source_fact(
    SourceFactAppendInput {
        source_audit_ref: input.source_audit_ref(),
        subject_ref: input.subject_ref(),
        source_ref: input.source_ref(),
        source_family: input.source_family(),
        source_audit_summary_ref: input.source_audit_summary_ref(),
        correlation_context: bound_context,
    },
)?;

let post_state = AuditProjectionPostState::from(&projection);
let record = AuditAppendRecord::from_accepted(
    AuditAppendAcceptedInput::Projection {
        projection_ref: projection.projection_ref().clone(),
        transition: &transition,
    },
    post_state,
    audit_record_metadata,
)?;

audit_repository.stage_projection(&projection, expected_version, uow).await?;
audit_repository.append_audit_record(&record, uow).await?;
```

The snippet is a design-level call shape. It does not claim that an
implementation exists or that any call has run. The H3 projection branch must
retain the exact source-audit ref, subject, safe summary, transition kind,
before/after revision and post-state relation. H3 means that the local audit
projection changed; it does not certify source-audit success or external
acceptance.

### 10.4 Commit sequence and failure boundaries

```text
validate typed I02 input and body-free relations
  -> acquire logical reservation + secondary event identity
  -> resolve the sole semantic source-audit projection relation
  -> load/create projection and validate expected version
  -> apply append_source_fact
  -> stage projection post-state
  -> allocate the registered observation cursor once, where H3 requires it
  -> construct and stage H3 from accepted transition + post-state
  -> stage typed AuditProjectionAppended snapshot, if a transition occurred
  -> stage stored result and attach its reservation completion pointer
  -> commit one accepted local UoW
  -> return ObservationConsumerResult
```

Known pre-commit failures roll back all staged facts and return a typed error.
A known commit failure does not return a stored receipt. A commit probe that
remains unknown does not get mapped to either committed or not committed; see
§13.3. Transport acknowledgement, retry or dead-letter is after this boundary
and cannot roll back or rewrite the projection, H3 record, outbox snapshot or
stored result.

### 10.5 No-record and no-append branches

| branch | reservation | projection/H3/outbox | stored result | application return |
|---|---|---|---|---|
| malformed header or missing trusted source event | none | none | none | ephemeral `Rejected`, event ref absent when untrusted |
| unsupported schema after valid header | none | none | none | ephemeral `UnsupportedSchema` |
| producer/family/payload relation mismatch | none | none | none | ephemeral `Rejected` |
| missing/invalid summary or context relation | none | none | none | ephemeral `Rejected` or `Delayed` by typed dependency classification |
| idempotency conflict | no new reservation | none | none | ephemeral `Rejected` with conflict error |
| exact completed delivery replay | no mutation | none | original surface only | original stored surface with `Replayed` access |
| reservation in flight | no second writer | none | none | ephemeral `Delayed`/in-flight |
| ambiguous semantic source-audit relation | reservation is rolled back or held per owner contract | none | none | typed consistency/dependency error or `Delayed` |
| valid relation but source fact already represented, proven by canonical owner | reservation may commit a stored no-change result only if flow policy requires it | no H3/event | stored `NoOp` surface | fresh `NoOp` or replay |
| accepted new source-fact transition | committed | projection + one H3 + configured snapshot | stored `Accepted` surface | fresh `Accepted` |

An exact event replay is not a new `NoOp` transition. A semantic no-change
branch is allowed only when the canonical relation/version owner proves it and
the flow explicitly owns a durable no-change result; otherwise it remains a
typed conflict or delayed branch.

## 11. Stored result and public receipt mapping

### 11.1 Application-to-public boundary

The Step 06/07 application carrier remains the source of local disposition,
stored result identity and accepted ref sets. Step 08 maps that carrier to the
shared public Consumer receipt; it does not create a second result owner.

```text
ObservationConsumerResult
  -> validate stored result / replay access
  -> map the inner disposition to the shared Consumer outcome
  -> map exact projection/H3/outbox/gap/dead-letter/error presence
  -> construct the public stored or ephemeral receipt
  -> wrap invocation access as FreshlyCommitted or Replayed
```

The public mapper must reject a result whose source refs, outcome, error
presence or stored-result pointer do not match the accepted UoW. It cannot query
the current audit projection, H3 table or outbox to fill a missing field.

### 11.2 Outcome and receipt matrix

| local branch | public outcome | receipt branch | result/ref presence | error/ref rule |
|---|---|---|---|---|
| source-fact append, projection/H3/result committed | `Accepted` | stored/fresh | result ref required; changed refs contain the exact committed projection/H3 relation; outbox/gap sets are exact | error absent; dead-letter absent |
| exact completed delivery replay | original inner outcome | stored/replayed | original result and every ref preserved byte-for-byte | no new refs or error; only outer access changes |
| canonical proven no-change with stored result | `NoOp` | stored/fresh | result ref required; changed/H3/outbox refs empty unless an explicitly owned marker exists | error absent |
| local rejection/quarantine/dead-letter marker explicitly owned and committed | corresponding shared outcome | stored/fresh | result ref required; only canonical body-free refs exposed | typed safe error required; no invented quarantine ref |
| dependency or in-flight before local commit | `Delayed` | ephemeral | no result, changed, H3, outbox or gap refs | typed dependency/in-flight error |
| malformed or invalid pre-handler input | `Rejected` | ephemeral | no durable refs | typed protocol/application error |
| unsupported schema before payload parse | `UnsupportedSchema` | ephemeral | no durable refs; validated source event retained only when safe | `UnsupportedSchemaVersion` only |

I02 does not automatically turn a source relation conflict into a durable
`Rejected`, `Quarantined` or `DeadLettered` row. Such a row is legal only if a
canonical local disposition owner and the I02 flow explicitly authorize it.
The application result never exposes a historical `QuarantineRef` without an
owner repair.

### 11.3 Ref provenance and losslessness

| public field | lossless source | fallback forbidden |
|---|---|---|
| `result_ref` | stored result's canonical public result projection | repository row id, new ref or current lookup |
| `changed_refs` | accepted UoW's exact projection/H3 change set | recompute from current projection state |
| `outbox_refs` | accepted UoW's retained immutable snapshot refs | scan current outbox or infer from event kind |
| `gap_refs` | exact stored gap relation, when a canonical gap owner participated | derive from error text, count or current gap table |
| `dead_letter_ref` | committed local dead-letter marker, when owned | transport message id, queue locator or Step 08 wrapper |
| `error` | finite stored safe error projection | provider text, source body or current retry state |

`source_audit_ref`, `source_ref`, `source_event_ref` and `source_version_ref`
remain independently available wherever the shared stored surface permits them.
They must not be collapsed into `result_ref` or an opaque concatenated string.
An explicit empty collection is a stored fact and is not permission to query
current state later.

## 12. Source version, schema compatibility and replay policy

### 12.1 Header compatibility matrix

Header compatibility is decided before the typed payload is interpreted. The
I02 slot has one supported schema version in this design batch; a future schema
must register a new typed payload decoder and a new compatibility row.

| condition | classification | payload decode | reservation |
|---|---|:---:|:---:|
| supported schema, exact `SourceOwner`, valid header relation | continue | yes | eligible after payload/relation validation |
| supported schema, source-version producer/source mismatch | typed consistency rejection | no | no |
| unsupported schema with a validated source event | `UnsupportedSchema` | no | no |
| malformed or unknown schema token | `Rejected` / protocol error | no | no |
| producer is not `SourceOwner` | static I02 slot rejection | no | no |
| source event or source ref is malformed | ephemeral `Rejected` | no | no |
| source-version header absent | explicit absent option | yes | eligible only if the source-version policy permits append |
| payload family is unknown or not registered | typed producer/source mismatch | no handler | no |
| payload summary/context relation is invalid | typed input/relation rejection | typed payload may be decoded only to classify the finite error | no |

An unsupported schema is never passed to the v1 decoder and unknown fields are
not silently ignored. A valid source-event identity may be retained in an
ephemeral unsupported-schema receipt; it does not establish a reservation or a
durable audit projection.

### 12.2 Source-version relation rules

`source_version_ref` is an opaque producer-owned token. I02 must not compare it
lexically, numerically, by timestamp, by cursor, or by local row version. The
source owner must provide a typed same-stream comparator and its relation
proof before an older/equal/newer branch can affect an append decision.

| canonical relation available | I02 behavior |
|---|---|
| same source stream, exact same version, same digest and same event identity | replay the stored surface; never reapply `append_source_fact` |
| same source stream, exact same version, different digest or semantic relation | typed conflict/consistency error; no winner is selected |
| same source stream, proven older version | do not regress the local projection; return an owner-approved `NoOp` or `Delayed` classification only |
| same source stream, proven equal version but source fact is not represented | do not infer equivalence; require the owner’s explicit relation result or fail closed |
| same source stream, proven newer version | continue through normal relation, domain transition and UoW checks |
| different source stream or mismatched producer/source binding | typed consistency rejection; no projection mutation |
| incomparable token, missing comparator or comparator unavailable | typed dependency/consistency classification; do not order by time or current row |

The current Step 06/07 materials do not expose a complete I02 comparator and
finite mapping. Until `S08-E-I02-SOURCE-VERSION-01` is closed, an append branch
that needs ordering must fail closed rather than silently accepting an older
source fact. `occurred_at`, `schema_version`, H3 cursor and repository version
remain independent values.

### 12.3 Replay and schema-evolution invariants

Replay is an invocation-level access mode over a stable stored result. It does
not change the inner outcome, projection ref, H3 ref, outbox set, source refs,
error or digest. A replay probe must use the exact I02 operation, trusted actor,
dedup key, source-event identity and digest relation; it may additionally verify
the semantic source-audit relation when the canonical owner requires it.

| replay observation | allowed result |
|---|---|
| completed reservation and matching stored surface | return exact surface with `Replayed` access |
| completed reservation but missing/mismatched stored surface | typed consistency failure; do not rerun or read current truth |
| reserved row with matching digest | ephemeral in-flight `Delayed` |
| reserved row with conflicting digest | `IdempotencyConflict`; no second writer |
| no reservation and proven no committed UoW | known recovery branch only; action remains worker-owned |
| probe result unknown/unsupported | no completion under current C-05 carrier |

Schema evolution may add a new operation-specific payload type only through a
new registered schema/discriminator and matching assembler/service binding. It
may not reinterpret an old source-audit body, use a fallback decoder, or make a
new field optional in the v1 digest without a profile revision.

## 13. Error, recovery and C-05 action mapping

### 13.1 Finite error surface

The application returns the existing typed application/protocol error carrier.
The labels below describe the finite semantic class to be mapped by the
canonical owner; they are not permission to add a Step 08-only error enum.

| detection point | finite classification | local mutation | recovery rule |
|---|---|---|---|
| static Consumer/body binding mismatch | `InvalidRequest` / protocol rejection | none | correct producer binding; do not retry the unchanged frame |
| malformed required header or untrusted source event | ephemeral `Rejected` | none | producer correction; source event may be absent |
| unsupported schema | `UnsupportedSchemaVersion` / `UnsupportedSchema` | none | registration or producer correction; do not retry unchanged schema by default |
| non-`SourceOwner` producer or unregistered source family | producer/source mismatch | none | correct finite catalog/producer binding; no handler call |
| malformed or absent required summary ref | invalid body-free input | none | producer/safe-summary correction; no empty/default substitution |
| summary projection unavailable | typed dependency unavailable | none | delayed/recovery policy; do not claim source audit acceptance |
| context missing, unbound or subject-mismatched | typed relation/dependency error | none | resolve through the canonical context owner; no trace inference |
| source-audit semantic relation missing, ambiguous or contradictory | typed consistency/relation error | none | owner repair or delayed classification; never choose first row |
| idempotency or secondary event conflict | `IdempotencyConflict` / consistency error | original rows unchanged | input correction/manual resolution; no winner selection |
| reservation in flight | in-flight `Delayed` | no second write | wait/probe according to bounded policy; no recursive handler loop |
| domain `append_source_fact` rejection | typed domain/application error | staged UoW rolled back | classify by owned recovery policy; no partial H3/outbox |
| repository/CAS/cursor failure before commit | typed dependency/application failure | staged UoW rolled back | retry only under exact flow policy; no fabricated receipt |
| known commit failure | commit failure | no stored result returned | transport action is not selected from a false success |
| commit probe remains unknown | no legal current completion shape | must not claim either state | fail closed; retain affected C-05 seam |
| stored replay surface missing or mismatched | consistency failure | no current-truth reconstruction | manual repair/probe; never rerun blindly |

Raw source body, provider response text, credentials, route, topic, partition,
stack trace and arbitrary error strings never select an outcome or a transport
action. `retryable` is not inferred from `Accepted`, `Rejected` or any other
public outcome token.

### 13.2 I02 C-05 action matrix

`InboundConsumerCompletion` remains the sole transport-action carrier. The I02
application result never contains `Acknowledge`, `Retry` or `DeadLetter`; the
matching worker mapper consumes a validated result and a flow-specific recovery
classification.

| I02 result surface | action target | action precondition | closure |
|---|---|---|---|
| fresh stored `Accepted` | `Acknowledge` | projection/H3/result UoW commit is known successful and stored surface validates | target defined; propagation affected |
| stored `Replayed` with any inner outcome | `Acknowledge` | original stored surface validates; handler is not rerun | target defined; propagation affected |
| fresh stored `NoOp` | `Acknowledge` | canonical owner proved no-change and no mutation is pending | target defined; propagation affected |
| fresh stored `DeadLettered` | `DeadLetter` | local dead-letter marker and result commit are known successful | only if a canonical local owner authorizes it |
| fresh stored `Quarantined` | explicit isolation action | body-free quarantine marker/result is committed and the worker has an exact policy mapping | open; no default terminal action |
| fresh stored `Rejected` | exact terminal or retry policy action | the result is committed or the pre-handler rejection has an explicit flow classification | open; outcome alone is insufficient |
| ephemeral `UnsupportedSchema` | no default action | producer/schema correction is required | open; unchanged frame must not be blindly retried |
| ephemeral `Delayed` with proven no-write | `Retry` only when the exact recovery policy marks it retryable | no accepted commit and no loop condition | open pending C-05 propagation |
| delayed result after an indeterminate commit probe | no legal action under current carrier | probe is `Unknown` or `Unsupported` | blocked by shared indeterminate-completion affected |

The matrix records design targets, not executed actions. In particular, I02
cannot turn a relation ambiguity or a missing source-version comparator into
`Acknowledge` merely because no local row was written.

### 13.3 Commit probe and indeterminate completion

When commit status is uncertain, the probe must use the exact stable relation:

```text
(operation, trusted_actor, dedup_key, source_event_ref, request_digest)
```

The semantic source-audit relation and stored-result pointer are validated as
part of the committed surface, not guessed from the current projection.

| probe result | allowed next shape |
|---|---|
| committed and stored result validates | return the original stored receipt and apply the exact replay/action mapper |
| not committed and reservation/UoW absence is proven | classify a known no-write recovery branch, then use its policy action |
| reservation is still in flight | ephemeral `Delayed`; no second handler execution |
| probe is unknown or unsupported | no `InboundConsumerCompletion` can be constructed with the current C-05 variants |

The current carrier has only `Acknowledge`, `Retry` and `DeadLetter`. I02 must
not choose any of them for the final row when commit status remains unknown.
This remains both `S08-E-I02-INDETERMINATE-01` and the shared
`S08-CONSUMER-INDETERMINATE-COMPLETION-01` until the carrier or handler
signature is repaired by its canonical owner.

### 13.4 Transport failure after local commit

If a local projection/H3/result commit is known successful and the selected
transport action fails, the worker reports its existing transport error. It
does not roll back or rewrite the audit projection, H3 record, outbox snapshot
or stored result. A later probe/retry uses the stable I02 identity and original
stored surface; it does not rerun `append_source_fact` or reconstruct a payload
from current truth.

## 14. `ConsumeSourceAuditMaterialFlow` Step 09 handoff reservation

Step 08 reserves exactly one downstream flow name:
`ConsumeSourceAuditMaterialFlow`. Step 09 owns the executable flow order,
repository/UoW signatures and recovery implementation; this section fixes the
boundary that Step 09 must consume.

```text
authenticated SourceOwner delivery
  -> static I02 slot and header gate
  -> typed SourceAuditMaterialPayload validation
  -> ConsumeSourceAuditMaterialInput
  -> logical + secondary identity reservation
  -> semantic source-audit projection relation lookup
  -> AuditProjection create/load
  -> append_source_fact transition
  -> same-UoW H3 and immutable outbox snapshot staging
  -> stored Consumer result/receipt
  -> exact worker C-05 action mapper
```

| handoff item | reserved contract | owner / constraint |
|---|---|---|
| flow name | `ConsumeSourceAuditMaterialFlow` | Step 09 is the sole flow owner |
| entry input | complete `ConsumeSourceAuditMaterialInput` plus trusted delivery actor | worker has no direct repository/domain capability |
| first gate | consumer, schema, producer, source/version header and body-free payload validation | unsupported schema does not parse payload or reserve |
| reservation | logical `(operation, actor, dedup_key)` plus secondary `(operation, producer, source_event_ref)` | both identities are checked before mutation |
| relation gate | typed `(source_ref, source_family, source_audit_ref, subject_ref)` lookup | uniqueness and source/subject parity are required; no first-row/default fallback |
| projection mutation | canonical `AuditProjection::create` or `append_source_fact` | no direct field assignment and no source-owner write-back |
| H3 fact | one projection-branch `AuditAppendRecord` per accepted transition | built from transition and same-UoW post-state |
| outbox | typed immutable snapshot from the accepted local transition | publisher does not query current projection or H3 |
| stored result | exact outcome, result/ref set and safe error presence | public receipt cannot fill missing fields with current lookup |
| completion | worker-owned C-05 action | application result does not carry an action; indeterminate remains fail-closed |
| no-write boundary | source audit body, source/business truth, external acceptance and transport state | no callback or compensating write to any truth owner |

Step 09 may refine cursor allocation, save order, CAS/rollback and probe
details only after the affected owner questions are resolved or explicitly
carried forward. A proposal that requires current outbox lookup, raw-body
storage, a second projection/result owner, scope-wide H3, or a second I02 flow
must be recorded as a conflict rather than silently changing this handoff.

## 15. I02 affected register

The following are protocol-specific design gaps. They are not implementation
failures and none is claimed as runtime evidence.

| ID | status | affected question | closure required | forbidden shortcut |
|---|---|---|---|---|
| `S08-E-I02-CONTROL-FIELD-SOURCE-01` | `open_internal_affected` | six shared Consumer control fields are not yet represented by one propagated Step 06/07 source/accessor contract | propagate exact private input fields and constructor validation | let entry/service reconstruct fields |
| `S08-E-I02-SAFE-SUMMARY-OWNER-01` | `open_internal_affected` | Step 06 I02 use-site still spells historical `SafeSummaryRef`, while current audit owner uses `SafeExternalSummaryRef` | repair the use-site and constructor/accessor relation to the canonical owner | alias, dual spelling or empty summary |
| `S08-E-I02-PRODUCER-SOURCE-CATALOG-01` | `open_internal_affected` | exact finite source-family catalog and `SourceOwner` compatibility row is not propagated to the assembler/service | publish one static typed catalog with total rejection | wire-string comparison or producer enum cast |
| `S08-E-I02-SOURCE-AUDIT-RELATION-01` | `open_internal_affected` | source/ref/family/audit/subject semantic relation has no single propagated lookup contract | define typed relation key, sole-row lookup and mismatch precedence | concatenate strings or create a new projection first |
| `S08-E-I02-SUBJECT-RELATION-SOURCE-01` | `open_internal_affected` | `AuditSubjectRef` source mapping and parity with source-audit material is not a single owner | propagate subject resolver/source and missing/ambiguous rules | infer subject from tenant, actor or ref prefix |
| `S08-E-I02-CORRELATION-CONTEXT-RELATION-01` | `open_internal_affected` | optional context ref lacks a complete I02 source/Bound/subject relation carrier | expose the canonical bound-context relation before projection creation | cast trace text or use empty context |
| `S08-E-I02-DIGEST-ORDER-01` | `open_internal_affected` | I02 digest order and exclusion set must be consumed identically by assembler, reservation and replay probe | propagate the exact profile-owned canonical material | raw envelope, provider or endpoint-local hash |
| `S08-E-I02-SOURCE-VERSION-01` | `open_upstream_internal` | producer/source owner has not exposed a typed same-stream comparator and finite older/equal/newer mapping | provide comparator/relation proof or retain explicit fail-closed behavior | order by time, cursor, schema or row version |
| `S08-E-I02-PROJECTION-LOOKUP-UNIQUENESS-01` | `open_internal_affected` | current `AuditEvidenceRepository` has projection-ref reads and stage, but no proven unique source-audit semantic lookup | add/propagate a bounded typed relation lookup and duplicate handling | mint a new ref or use first row |
| `S08-E-I02-H3-SAME-UOW-01` | `open_internal_affected` | transition, projection post-state, H3 factory and cursor must be proven from one accepted UoW | propagate exact transition/post-state/cursor/save order | reload projection or infer H3 from after-state |
| `S08-E-I02-RECEIPT-OUTBOX-LOSSLESS-01` | `open_internal_affected` | public receipt outbox refs lack a canonical stored-surface source | add validated lossless accessor at its owner | current outbox scan or event-kind inference |
| `S08-E-I02-RESULT-SURFACE-01` | `open_internal_affected` | application result to public receipt needs exact outcome/ref/error presence mapping | close the operation-specific stored result surface | generic disposition or empty fallback |
| `S08-E-I02-QUARANTINE-SURFACE-01` | `open_internal_affected` | historical `QuarantineRef` remains unowned in shared application material | remove it or bind it to an existing canonical owner | create a Step 08 wrapper |
| `S08-E-I02-ACTION-MATRIX-01` | `open_internal_affected` | relation rejection, NoOp, UnsupportedSchema, Delayed and local terminal branches need exact worker mapping | propagate per-flow C-05 policy and recovery class | wildcard ack/retry/dead-letter |
| `S08-E-I02-INDETERMINATE-01` | `open_internal_affected` | current C-05 has no legal completion after an unknown commit probe | add typed no-completion or tighten handler return contract | assume committed/not-committed or choose terminal action |
| `S08-E-I02-STEP09-HANDOFF-01` | `open_internal_affected` | Step 09 must carry I02's exact relation lookup, projection/H3 UoW, receipt and no-write boundary | create one named flow carrier and save-order contract | duplicate flow or generic Consumer template |

Shared records still apply and are not closed by this protocol:
`S08-CONSUMER-OUTBOX-SURFACE-01`, `S08-CONSUMER-QUARANTINE-REF-01`,
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`, `S08-SOURCE-EVENT-REF-OWNER-01`,
`R06-F-AFFECT-UOW-01` and `03-RPR-S09-PER-FLOW`.

## 16. I02 static closure checklist

| check | result | evidence boundary |
|---|---|---|
| one logical Consumer, one exact operation and one required producer | pass at design-record level | §§4.2, 5, 12.1 |
| header validated before payload decode | pass | §§6.1, 7.3, 12.1 |
| trusted actor is separate from payload and source truth | pass | §§3, 7.2, 8.3 |
| source event, source ref, source audit ref, source version and dedup remain distinct | pass | §§6, 8.2-8.3 |
| `SourceOwner` and `SourceFamilyKind` are not implicitly converted | pass at target level; catalog affected | §6.3, `S08-E-I02-PRODUCER-SOURCE-CATALOG-01` |
| canonical digest fields/order/exclusions recorded | pass at target level; propagation affected | §8.1, `S08-E-I02-DIGEST-ORDER-01` |
| raw body cannot enter input, digest, receipt, error or H3 | pass | §§1.1, 9, 10.3, 13.1 |
| summary absence, unavailable summary and wrong relation are distinct | pass at target level; summary owner affected | §§6.2, 9.2, `S08-E-I02-SAFE-SUMMARY-OWNER-01` |
| correlation context must be bound and subject-related | pass at target level; relation propagation affected | §9.2, `S08-E-I02-CORRELATION-CONTEXT-RELATION-01` |
| source-version never falls back to time/cursor/row version | pass | §12.2, `S08-E-I02-SOURCE-VERSION-01` |
| semantic source-audit relation requires unique typed lookup | pass at target level; lookup owner affected | §§8.2, 10.2, `S08-E-I02-PROJECTION-LOOKUP-UNIQUENESS-01` |
| projection mutation uses domain transition rather than direct assignment | pass at design-record level | §§10.2-10.3 |
| H3 consumes accepted transition and same-UoW post-state | pass at target level; UoW propagation affected | §10.3, `S08-E-I02-H3-SAME-UOW-01` |
| duplicate replays exact stored surface without append re-run | pass | §§8.2, 11.2, 12.3 |
| no `Duplicate` durable/public outcome is introduced | pass | §§8.2, 11 |
| outbox/result refs have lossless source or explicit affected | pass_with_affected_open | §11.3 and related affected IDs |
| quarantine has no invented owner | pass_with_affected_open | §11.2, `S08-E-I02-QUARANTINE-SURFACE-01` |
| all shared Consumer outcomes have I02 branch rules | pass at target level; action mapping affected | §§11.2, 13.2 |
| unknown commit status is fail-closed | pass_with_affected_open | §13.3, `S08-E-I02-INDETERMINATE-01` |
| exactly one Step 09 handoff is reserved | pass | §14, `S08-E-I02-STEP09-HANDOFF-01` |
| source/business/external truth is never written back | pass | §§1, 4, 10, 14 |
| implementation, test, evidence and acceptance claims | not run / not claimed | this design artifact only |

## 17. I02 stop review

| item | conclusion |
|---|---|
| current document / Step | `03-详细设计.md` calibration, Step 08, S08-E Consumer I02 |
| protocol status | `defined_with_affected_open`; not unconditional complete |
| independent I02 artifact | complete for this review batch: binding, payload, input, field provenance, digest, redaction, relation, UoW, H3, receipt, outcome, action and Step 09 handoff are recorded |
| affected status | 16 I02-specific affected remain open, plus shared Consumer/UoW/Step 09 records |
| source-audit truth boundary | pass; only body-free observation/audit projection is local truth; no source/business/external write-back |
| semantic relation / projection uniqueness | target rule fixed; canonical lookup owner and duplicate-row proof remain affected |
| source-version ordering | fail-closed rule fixed; typed comparator remains an upstream affected item |
| H3 and stored receipt relation | target same-UoW relation fixed; downstream save/cursor/outbox/result propagation remains affected |
| duplicate replay and no `Duplicate` outcome | pass at design-record level |
| C-05 action and indeterminate behavior | fail-closed target fixed; per-flow mapper and no-completion carrier remain affected |
| exactly one Step 09 handoff | pass; `ConsumeSourceAuditMaterialFlow` only |
| all I02-specific affected registered | pass; 16/16 listed in §15 |
| new external upstream blocker | none found; known `R06.6-F2-H13-UPSTREAM=open_controlled` remains unrelated to I02 |
| current protocol count | `32/60 defined_with_affected_open`; Query `14/14`; Consumer `2/9`; `0/60` unconditional complete |
| formal document | unchanged and frozen; no reassembly before Step 19 |
| implementation/test/evidence | not run; no implementation commit, run id, evidence alias or acceptance signature created |
| next allowed action | stop and wait for explicit user confirmation; after confirmation read only I03-required Step 06/07 owner and current shared carrier |
| current recovery point | `Step08_S08-E_I02_defined_with_affected_open_waiting_user_before_I03` |
| submission | not needed; user did not request a commit |

This stop is a gate. Do not enter I03-I09, S08-F/G, Step 09~19, formal `03`,
any `04` file or implementation code until the user explicitly confirms the
next batch.
