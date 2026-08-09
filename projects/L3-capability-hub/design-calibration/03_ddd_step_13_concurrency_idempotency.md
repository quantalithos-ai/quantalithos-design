# L3-capability-hub 03 详细设计 Step 13: 并发、幂等与重入保护

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §12 并发、幂等与重入保护
> 创建日期: 2026-07-18
> 当前模式: full-restart
> 状态: `03_step_13_completed_with_step_14_commit_resolution_sync`
> 正式文档状态: 本 Step 不修改正式 `03-详细设计.md`;正式装配留 Step 19
> Fixed access-review reason controlled repair: 2026-08-09; the system-generated reason is excluded from the request digest, copied exactly on fresh execution and never regenerated during stored replay; no key, digest field or state change

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 13 `定义并发、幂等与重入保护` |
| 用户确认 | 用户已明确回复“同意”,允许在 Step 12 停审后进入 Step 13 |
| 标准输入 | 详细设计 SOP Step 13、详细设计书写规范 §5.12、设计真相源闭环标准 |
| 直接上游 | Step 8 protocol、Step 9 function flow、Step 11 transaction / consistency、Step 12 error / recovery |
| 粒度参考 | `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md`;只参考展开粒度,不复制治理主语 |
| 实现边界 | 不实现代码,不创建 implementation ledger / planned boundary skeleton,不伪造 commit、run、测试结果、evidence 或签署 |

## 1. 分批写入状态

| 批次 | 覆盖范围 | 状态 |
|---|---|---|
| `13.0` | 标准 / 上游读取、SOP问题、40入口盘点、缺口与受控回开裁决 | completed |
| `13.1` | closed operation identity、normalized key、canonical frame、四类digest和八类reference candidate | completed |
| `13.2` | 26 Command + 6 Inbound + 8 Job exact幂等键 / request digest矩阵 | completed |
| `13.3` | 并发资源、unique/CAS/fence、duplicate / in-progress / conflict矩阵 | completed |
| `13.4` | commit unknown、Outbound capture/intent、Job journal重入和恢复表 | completed |
| `13.5` | 测试切口、Step 6~12同步审计、historical audit、正式§12 assembly source、完成门禁 | completed；原上游设计阻塞已由用户显式授权的依赖假设解除 |

## 2. 本 Step 目标与非目标

### 2.1 必须闭合

1. 26 个 Command、6 个 Inbound Event Consumer、8 个 Operations Job 共 40 个 reservation / replay 入口的可计算幂等键和稳定请求摘要。
2. 33 个 Query 的严格 no-write / no-idempotency边界。
3. 10 个 Outbound Event flow 的 immutable snapshot + capture + stable intent重入,不得伪装成request幂等入口。
4. mutable truth、canonical reference、derived material、event capture、Job journal和唯一索引上的并发控制。
5. same request duplicate、same key different request、atomic reserve race、commit outcome unknown、stored sidecar missing、Job target race的明确结果。
6. `ReferenceCandidateDigest`、`CapabilityStoredResultDigest`、`CapabilityEventCandidateDigest`的exact codec / domain separation /字段边界。
7. 每个并发、重复和重入场景到 Step 16 可执行测试切口的映射。

### 2.2 本 Step 不定义

- 不定义具体hash crate、serialization library、database DDL / index syntax、isolation product、HTTP status、broker topic、scheduler、timeout、backoff、jitter或retention配置;具体依赖绑定留 Step 14 / `04-配置设计.md`。
- 不新增lease、heartbeat、attempt counter、private checkpoint、request accumulator、第二result store、第二event queue或report-by-run index。
- 不把runtime execution、tools execution、marketplace listing、governance approval、method body lifecycle或SDK client/package状态合并进Capability Hub。
- 不把外部event collaboration状态复制为本地delivery lifecycle；本地只持有capture与stable intent binding。
- 不修改正式`03-详细设计.md`,不创建implementation artifacts。

## 3. 输入材料与读取结论

| 输入 | 读取结论 | 本 Step 使用 |
|---|---|---|
| Step 6 object contracts | 43个HLD objects + 7个application helpers；已有operation context、idempotency record、stored result、event snapshot/capture、Job journal；operation/key/digest缺合法constructor | 受控回开existing types/callables,不新增helper object |
| Step 7 repository / Port contracts | 36 Ports；idempotency atomic reserve、stored typed replay、capture CAS、Job journal CAS已存在 | 不新增Port / repository / method |
| Step 8 protocol contracts | 26 Command、33 Query、6 Inbound、10 Outbound、8 Job = 83；40 write入口字段集已逐卡固定 | 建立40行exact key/digest矩阵；Query / Outbound单列 |
| Step 9 function flows | 83 / 83 flow；shared reservation、capture三阶段、Job initial-target-final重入已固定 | 补exact constructor、race分类与恢复算法 |
| Step 10 state matrix | 原`CapabilityIdempotencyState::Conflict`与`mark_conflict`无current flow | 裁决为历史残留并删除不可达state surface |
| Step 11 persistence | 22 repository traits / 110 methods；Command / Consumer同UoW完成；Job长期`Reserved + Planned` | 区分transient race与durable Job resume |
| Step 12 error / recovery | 17个`ApplicationError`、51 closed issue codes、commit unknown / consistency recovery已固定 | 保持`IdempotencyConflict / IdempotencyInProgress` public/error语义不变 |
| 正式`00 / 01 / 02` | capability identity / registry / descriptor / approval seam / method relation / SDK exposure owner已固定 | 不扩大owner或新增execution truth |
| README与旧正式`03` | provider inventory、cost、KMS/Vault、runtime gateway、marketplace/outbox等为旧材料 | 只记historical material,不继承 |

## 4. SOP 问题回答

| SOP问题 | 当前裁决 |
|---|---|
| 哪些处理流可能并发修改同一资源? | 26 Command可能并发更新同一identity / registry / descriptor / relation / exposure / trace-impact / reference truth及依赖material；6 Inbound可能并发更新同一reference/current-state或downstream summary；8 Job可能并发更新同一material、report、reference state、event capture或Job journal。10 Outbound continuation可能并发绑定同一capture。 |
| 哪些接口、事件或Job可能重复调用? | 全部26 Command可因client timeout重试；全部6 Inbound可因redelivery / ack丢失重放；全部8 Job可因runner crash、scheduler重复触发或operator重试；10 Outbound可在source commit后、intent bind前后重入。33 Query只重复读取。 |
| 幂等键来自哪里? | Command来自closed operation + `CommandMetadata.idempotency_key`;Inbound来自closed consumer + source family + public source event ref,source-provided key只进digest；Job来自closed operation + `CapabilityJobMetadata.idempotency_key`。business unique / CAS只做并发winner保护,不能替代stored replay。 |
| 重复请求如何处理? | Completed exact match读取原immutable typed surface；same normalized key mismatch返回`IdempotencyConflict`且winner零写；same exact Job Reserved加载journal续跑；Command / Consumer visible Reserved无合法durable partial body,返回in-progress仅限并发事务可见语义,持久化孤儿为consistency defect。 |
| 并发冲突如何测试? | 使用atomic reserve barrier、两个stale expected version、unique winner、commit-unknown fault injection、capture bind race、Job target/final CAS race和sidecar corruption fixtures；每项在§22命名测试切口。 |

## 5. 当前缺口与受控回开裁决

### 5.1 缺口登记

| blocker id | owner / evidence | 缺口 | 裁决 |
|---|---|---|---|
| `CH-DDD-S13-OPERATION-KEY-CODEC-001` | Step 6 `CapabilityOperationName(CapabilitySafeText)`、`CapabilityOperationIdempotencyKey(IdempotencyKey)`、`CapabilityRequestDigest(CapabilitySafeText)` | 三个private-inner type均无合法factory；repository只按key查找,raw key跨operation会碰撞；Step 8只用文字要求closed name | 受控回开Step 6 / 8 / 9：existing type补closed mapper、operation-namespaced key和canonical digest callable；不新增public type / Port |
| `CH-DDD-S13-IDEMPOTENCY-CONFLICT-STATE-001` | Step 6/10 `Conflict + conflict_reason + mark_conflict`;Step 9/11明确zero-call / preserve winner | 持久化Conflict不可达；对Reserved winner执行会破坏首个合法执行,对Completed winner会破坏原result；没有owner授权、协议trigger或stored result | 删除existing `Conflict` variant、reason type/field、`mark_conflict`;冲突继续由existing `ApplicationError::IdempotencyConflict`和public surface表达,winning record不变 |
| `CH-DDD-S13-DIGEST-SURFACE-001` | Step 6/8/9 placeholders | reference candidate、request、stored result、outbound envelope缺exact frame / domain / algorithm contract | 本Step闭合versioned length-delimited canonical frame、contracts-owned field writer和四个domain separator；具体hash / wire codec crate binding留Step 14 |
| `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` | `projects/L0-core/03-详细设计.md`、L0-core Step 6；sibling `/home/aris/Projects/quantalithos-core/crates/contracts/src/metadata.rs` | 历史诊断保持不变：capability-hub Command / Job normalized key持久化与Inbound digest都需要稳定读取`IdempotencyKey`值，但L0-core正式设计只命名该type，未声明inner-byte accessor或canonical field encoding。Sibling实现当前可检索到`IdempotencyKey::as_str(&self) -> &str`，实现事实本身不能替代上游正式设计真相源 | `resolved_by_explicit_user_authorized_dependency_assumption`。2026-07-18用户明确授权解除限制并进入下一Step；Capability Hub正式采用现有导出签名`IdempotencyKey::as_str(&self) -> &str`，canonical bytes固定为`as_str().as_bytes()`返回字符串的原始UTF-8字节，不trim、不case-fold、不做Unicode normalization，也不使用`Display / Debug / serde`。L0-core正式设计同步转为非阻塞债务`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`；若实际签名或字节语义变化，必须回开本Step |

### 5.2 回开边界

本次回开只允许修改既有声明和文字契约:

- `CapabilityOperationName`、`CapabilityOperationIdempotencyKey`、`CapabilityRequestDigest`、`ReferenceCandidateDigest`、`CapabilityStoredResultDigest`、`CapabilityEventCandidateDigest`补合法构造 / 读取callable。
- 40个exact request DTO与8类reference candidate的canonical field frame由`capability-hub-contracts`内部private writer和Rustdoc-complete crate-visible callable形成；application只拼domain/frame header、执行SHA-256并调用digest carrier factory，不越权读取contracts private fields。
- `CapabilityIdempotencyState`收紧为`Reserved | Completed`;`CapabilityIdempotencyRecord`删除`conflict_reason`与`mark_conflict`。
- Step 7 repository `save`只接受`Reserved -> Completed`;Step 8 / 9绑定exact mapper与digest callable；Step 10调整pair arithmetic；Step 11 / 12删除“persisted conflict”暗示。
- 不新增public protocol type、trait、Port、repository method、protocol、flow或store；existing operation name改为带channel的named-field struct,existing normalized key改为three-variant enum,四类digest private representation收紧为`[u8;32]`。Step 8 protocol文件的250个public struct / enum不变；Step 6 application-support inventory单独删除1个`CapabilityIdempotencyConflictReason`。
- 所有改动的struct、tuple field、enum、variant、variant payload和callable必须保留或补齐英文`///` Rustdoc。

## 6. Closed Operation Identity Contract

### 6.1 Exact mapper surface

`CapabilityOperationName`归`capability-hub-contracts`；closed mapping implementation也在同一crate。它不开放`new(String)`；只允许从Step 8四类可调用closed protocol name做显式one-way mapping。Query需要operation identity做routing / result-ref symmetry,但没有合法idempotency key。

```rust
/// Stable application operation name selected from one closed public protocol inventory.
pub struct CapabilityOperationName {
    /// Entry channel that owns this operation name.
    channel: CapabilityOperationChannel,
    /// Validated route-neutral operation name copied by a closed protocol mapper.
    value: CapabilitySafeText,
}

impl CapabilityOperationName {
    /// Maps one closed command name to its stable application operation name.
    pub fn from_command_name(name: &CapabilityCommandName) -> Option<Self>;

    /// Maps one closed query name to its stable application operation name.
    pub fn from_query_name(name: &CapabilityQueryName) -> Option<Self>;

    /// Maps one closed inbound-consumer name to its stable application operation name.
    pub fn from_inbound_consumer_name(
        name: &CapabilityInboundConsumerName,
    ) -> Option<Self>;

    /// Maps one closed operations-job name to its stable application operation name.
    pub fn from_job_name(name: &CapabilityJobName) -> Option<Self>;

    /// Returns the closed entry channel that owns this operation.
    pub fn channel(&self) -> &CapabilityOperationChannel;

    /// Returns the validated route-neutral operation name.
    pub fn as_str(&self) -> &str;
}
```

每个mapper必须穷尽对应Step 8 inventory并复制同一个exact closed protocol name；unknown / alias / trimmed / case-folded value返回`None`,调用方立即映射existing `ApplicationError::InvalidInput`。`CapabilitySafeText`增加唯一crate-visible `copy_validated()`供同crate closed carrier mapper做值复制；不得`unwrap / expect`普通fallible constructor。不得从route、handler method、logical topic、config key、Rust type name、`Debug / Display`或payload variant推导。四个mapper只做closed validation与validated value copy,不读repository、Clock、IdGenerator或adapter。

```rust
impl CapabilitySafeText {
    /// Copies this validated body-free value without changing its bytes or meaning.
    pub(crate) fn copy_validated(&self) -> Self;
}
```

### 6.2 Fixed operation literal inventory

| channel | protocol count | literal rule | example |
|---|---:|---|---|
| Command | 26 | exact Step 8 closed name,无route / handler别名 | `EstablishCapabilityAccessContext` |
| Query | 33 | exact Step 8 closed name；仅routing / response identity使用 | `GetCapabilityIdentity` |
| Inbound | 6 | exact closed consumer name,无topic / `.v1` | `ConsumeGovernanceResultReferenceChanged` |
| Operations Job | 8 | exact closed Job name,无trigger / `.v1` | `RunCapabilityRegistryReconciliation` |

Outbound event name不进入`CapabilityOperationName`，因为它不是request / reservation入口；其closed schema identity由`CapabilityEventSchemaRef`独立拥有。合计`26 + 33 + 6 + 8 = 73`个operation mapper literal,其中只有`26 + 6 + 8 = 40`个允许形成幂等键。

## 7. Normalized Idempotency Key Contract

### 7.1 Existing type closed variants

```rust
/// Operation-namespaced key for one idempotent capability-hub write entry.
pub enum CapabilityOperationIdempotencyKey {
    /// Client-supplied key under one closed command operation.
    Command {
        /// Closed command operation namespace.
        operation_name: CapabilityOperationName,
        /// Core command idempotency key copied without parsing its value.
        raw_key: IdempotencyKey,
    },
    /// Source-owned event identity under one closed inbound consumer.
    InboundEvent {
        /// Closed inbound-consumer operation namespace.
        operation_name: CapabilityOperationName,
        /// Declared source family validated by the worker header gate.
        source_family: CapabilityInboundSourceFamily,
        /// Public source-owned event identity copied from the validated envelope.
        source_event_ref: CapabilitySourceEventRef,
    },
    /// Runner-supplied key under one closed operations-job operation.
    OperationsJob {
        /// Closed operations-job namespace.
        operation_name: CapabilityOperationName,
        /// Core job idempotency key copied without parsing its value.
        raw_key: IdempotencyKey,
    },
}

impl CapabilityOperationIdempotencyKey {
    /// Builds a command key after validating the closed command operation mapping.
    pub fn for_command(
        operation_name: CapabilityOperationName,
        raw_key: IdempotencyKey,
    ) -> Option<Self>;

    /// Builds an inbound key from one validated consumer, source family, and public event identity.
    pub fn for_inbound_event(
        operation_name: CapabilityOperationName,
        source_family: CapabilityInboundSourceFamily,
        source_event_ref: CapabilitySourceEventRef,
    ) -> Option<Self>;

    /// Builds an operations-job key after validating the closed job operation mapping.
    pub fn for_job(
        operation_name: CapabilityOperationName,
        raw_key: IdempotencyKey,
    ) -> Option<Self>;

    /// Returns the operation namespace embedded in this normalized key.
    pub fn operation_name(&self) -> &CapabilityOperationName;
}
```

### 7.2 Key equality and repository identity

| variant | equality components | intentionally excluded | consequence |
|---|---|---|---|
| Command | variant tag + exact operation + raw core key | actor、request id、trace、time、body | same raw key may be reused bydifferent Command operations without collision;within one operation it identifiesone stable request |
| InboundEvent | variant tag + exact consumer operation + source family + public source event ref | source-provided key、trace、occurred time、payload、topic | same source event withchanged source key/payload reachesone winner andthen digest conflict |
| OperationsJob | variant tag + exact operation + raw core key | run id、trace、actor、input、cursor | same job operation/key identifiesone frozen journal;run-id difference fails the separate replay-identity fence |

Repository unique identity is the serialized enum value,not the raw key alone。Adapter must preservevariant tags andfield boundaries；it maymaterialize columns / bytes asStep 14 binding,但不得case-fold、trim、parse或hash only the raw value。Query cannotconstruct any variant andmust fail`CapabilityOperationContext::idempotency_key()`。

The three factories return `None` when `operation_name.channel()` does not match the selected factory；Inbound also returns`None` whenthe exact consumer-to-source-family mapping doesnotmatch。The application entry maps `None` to existing `ApplicationError::InvalidInput` before repository access。Every enum variant、named field andpayload hasEnglish Rustdoc；theexisting public type count isunchanged bythisshape correction。

## 8. Canonical Frame Codec

### 8.1 Versioned frame

All four digest families use one application-owned logical frame codec named `capability-hub-canonical-frame/v1`。This is a normative byte grammar,not a new public Rust type or Port:

```text
frame       = magic || frame_version || domain || field_count || field*
magic       = ASCII "capability-hub-canonical-frame"
frame_version = u16_be(1)
domain      = bytes_field(domain_literal)
field_count = u32_be(number_of_top_level_fields)
field       = field_tag || field_name || value
field_tag   = one closed u8 tag for scalar / enum / option / sequence / struct
field_name  = bytes_field(ASCII schema field name)
bytes_field = u64_be(byte_length) || exact bytes
```

Every nested struct repeats `field_count + named fields`;every sequence writes `u64_be(item_count)` then each item as a typed value。Integer encoding is fixed-width unsigned big-endian at the declared Rust width；booleans areone byte `0x00 / 0x01`；UTF-8 strings use exact validated bytes withoutadditional trim / normalization；typed IDs / refs encode their validated inner bytes plus the declared field/type tag。

### 8.2 Canonical value rules

| value shape | exact rule |
|---|---|
| enum | fixed per-type numeric variant tag declared beside the mapper；tuple/struct payload follows that tag；never variant name text |
| `Option<T>` | absent=`0x00`;present=`0x01 || T`;empty string/list cannot stand for absent |
| request-order vector | validate required non-empty/duplicate rule,then preserve validated request order |
| typed set | use the type's already canonical stable order；do not hash-map iterate or resort by`Debug / Display` |
| repository scan scope | encode the closed scope variant and explicit fields,not resulting page/cursor/items |
| bytes | exact byte length + bytes；no base64/text round-trip |
| nested safe carrier | encode each declared semantic field；opaque carrier withpublic`as_str` encodes exact validated inner bytes |
| timestamp / trace / generated id | only encoded when the family-specific matrix explicitly includes it；request digest excludes them by default |

Codec failures map toexisting`ApplicationError::CodecFailure`before reserve / save where possible。No `serde_json::Value` map iteration、JSON object key order、`Debug`、`Display`、locale、platform integer width、memory layout、database row encoding ortransport serialization maydefine digest bytes。

### 8.3 Digest domains and algorithm

| digest type | domain literal | frame input | algorithm/output |
|---|---|---|---|
| `CapabilityRequestDigest` | `capability-hub/request/v1/<channel>/<operation>` | schema version when declared + exact stable fields in§11~§13 | SHA-256 overframe；private`[u8;32]`;canonical persistence/diagnostic serialization islowercase64-char hex |
| `ReferenceCandidateDigest` | `capability-hub/reference-candidate/v1/<reference-kind>` | exact body-free candidate fields in§9 | same |
| `CapabilityStoredResultDigest` | `capability-hub/stored-result-surface/v1/<result-kind>/<operation>` | exact immutable serialized public surface bytes | same |
| `CapabilityEventCandidateDigest` | `capability-hub/outbound-event-envelope/v1/<event-name>/<schema-version>` | exact complete serialized Step 8 envelope bytes | same |

SHA-256 and lowercase hex aresemantic compatibility requirements；Step 14 chooses the concrete cryptographic crate andcodec implementation。Changingalgorithm、domain、field order、tag assignment ornormalization requiresa newversion/domain andmigration design；silent replacement isforbidden。

### 8.4 Carrier and application callable closure

```rust
/// Canonical digest of stable business input fields.
pub struct CapabilityRequestDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

impl CapabilityRequestDigest {
    /// Builds a canonical request digest value from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}

/// Digest of a serialized public result surface used for integrity checks.
pub struct CapabilityStoredResultDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

impl CapabilityStoredResultDigest {
    /// Builds a stored-result integrity digest from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}

/// Integrity digest of one complete serialized outbound event envelope.
pub struct CapabilityEventCandidateDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

impl CapabilityEventCandidateDigest {
    /// Builds an outbound-event integrity digest from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}
```

`ReferenceCandidateDigest` uses the same representation and carrier API:

```rust
/// Stable digest of a body-free reference candidate.
pub struct ReferenceCandidateDigest(
    /// Complete SHA-256 output retained without text parsing.
    [u8; 32],
);

impl ReferenceCandidateDigest {
    /// Builds a canonical digest value from one complete SHA-256 output.
    pub fn from_sha256_bytes(bytes: [u8; 32]) -> Self;

    /// Returns the complete SHA-256 output bytes.
    pub fn as_bytes(&self) -> &[u8; 32];
}
```

All four digest carrier types remain in `capability-hub-contracts`。The contracts crate owns canonical field-value encoding because it owns the exact DTO/newtype fields and can legally read their private inners；application owns only the outer domain-separated frame assembly and hashing。Contracts does not depend on application and does not select a hash crate。The legal application calculation surface is:

```rust
/// Calculates one command request digest from the exact closed request implementation.
pub(crate) fn digest_command_request(
    operation_name: &CapabilityOperationName,
    canonical_field_bytes: &[u8],
) -> Result<CapabilityRequestDigest, ApplicationError>;

/// Calculates one inbound-event request digest from envelope authority and payload fields.
pub(crate) fn digest_inbound_event_request(
    context: &CapabilityOperationContext,
    canonical_field_bytes: &[u8],
) -> Result<CapabilityRequestDigest, ApplicationError>;

/// Calculates one operations-job request digest from schema and exact job input fields.
pub(crate) fn digest_job_request(
    context: &CapabilityOperationContext,
    schema_version: &CapabilityProtocolSchemaVersion,
    canonical_field_bytes: &[u8],
) -> Result<CapabilityRequestDigest, ApplicationError>;

/// Calculates the integrity digest of one immutable serialized public result surface.
pub(crate) fn digest_stored_result_surface(
    result_kind: &StoredCapabilityResultKind,
    operation_name: &CapabilityOperationName,
    serialized_surface: &[u8],
) -> Result<CapabilityStoredResultDigest, ApplicationError>;

/// Calculates the integrity digest of one complete serialized outbound event envelope.
pub(crate) fn digest_outbound_event_envelope(
    schema_ref: &CapabilityEventSchemaRef,
    serialized_envelope: &[u8],
) -> Result<CapabilityEventCandidateDigest, ApplicationError>;
```

`capability-hub-contracts::canonical` owns a private `CanonicalFieldWriter`;that private type never crosses a crate boundary and is not a public protocol type、Port、repository schema or business object。The cross-crate surface is one Rustdoc-complete public method per exact DTO and one public function per candidate family,all returning standard`Vec<u8>`field-frame bytes,for example:

```rust
impl RecordTraceabilityHandoffSummaryCommand {
    /// Encodes this exact command body's stable fields for request-digest framing.
    pub fn canonical_request_field_bytes(
        &self,
    ) -> Result<Vec<u8>, ContractValueError>;
}

impl ConsumeGovernanceResultReferenceChangedPayload {
    /// Encodes this exact inbound request's source authority and payload fields.
    pub fn canonical_request_field_bytes(
        &self,
        schema_version: &CapabilityProtocolSchemaVersion,
        source_family: &CapabilityInboundSourceFamily,
        source_event_ref: &CapabilitySourceEventRef,
        source_idempotency_key: &IdempotencyKey,
    ) -> Result<Vec<u8>, ContractValueError>;
}

impl RunCapabilityRegistryReconciliationInput {
    /// Encodes this exact operations-job input's stable fields for request-digest framing.
    pub fn canonical_request_field_bytes(
        &self,
    ) -> Result<Vec<u8>, ContractValueError>;
}
```

The exact26 Command、6 Inbound payload and8 Job input implementations write onlythefields listed in§11~§13,inthat order。The eight candidate encoders write only§9 fields andfollowthe same pattern as public functions under`contracts::canonical`,returning`Result<Vec<u8>, ContractValueError>`。These methods/functions expose canonical bytes,notthe private writer ormutable buffer。No blanket`Serialize`implementation、generic`digest<T>`、application-local trait impl、`Debug / Display`orJSON-map ordering islegal。Nested private newtypes andclosed enums areencoded bythecontracts-owned writer atdefinition ownership；application neveradds accessors merelyforhashing。

The only cross-project exception is core`IdempotencyKey`:the normalized-key adapter andsix Inbound encoders encode `idempotency_key.as_str().as_bytes()` as one typed length-delimited scalar under the explicit user-authorized dependency assumption recorded in §24.3。The bytes are the accessor string's original UTF-8 bytes with no trim、case folding or Unicode normalization。Transport JSON、serde output、`Display / Debug` and local replacement key types remain forbidden substitutes。

Every `from_sha256_bytes` accepts onlyafixed32-byte output；lowercasehex isboundary serialization,notconstructor input。Application functions prependthecanonicalframe header/domain,appendthecontracts-produced field bytes,invoke theStep14-bound SHA-256 implementation,andcallthecontracts carrier factory。This split obeys`contracts <- domain <- application`andaddsno cross-crate inherent impl。

## 9. Eight Reference Candidate Digest Contracts

Reference candidate hashing mustrun againsttheoriginal typed fields beforethose fields arenarrowed intoa generic`ReferenceLocatorSummary`。The contracts-owned field encoders are:

```rust
/// Encodes one external capability-source candidate's stable fields.
pub fn canonical_external_capability_source_candidate_field_bytes(
    source_kind: &ExternalCapabilitySourceKind,
    locator: &ExternalLocatorSummary,
) -> Result<Vec<u8>, ContractValueError>;

/// Encodes one external secret candidate's stable body-free fields.
pub fn canonical_secret_candidate_field_bytes(
    provider_ref: &ExternalSecretProviderRef,
    usage_scope: &SecretUsageScopeSummary,
) -> Result<Vec<u8>, ContractValueError>;

/// Encodes one governance-result candidate's stable body-free fields.
pub fn canonical_governance_result_candidate_field_bytes(
    kind: &GovernanceRefKind,
    source: &GovernanceSourceRef,
    scope: &GovernanceResultScopeSummary,
) -> Result<Vec<u8>, ContractValueError>;

/// Encodes one method-library asset candidate's stable body-free fields.
pub fn canonical_method_asset_candidate_field_bytes(
    kind: &MethodAssetKindSummary,
    locator: &MethodLibraryLocator,
) -> Result<Vec<u8>, ContractValueError>;

/// Encodes one external-document candidate's stable body-free fields.
pub fn canonical_external_document_candidate_field_bytes(
    kind: &ExternalDocumentKind,
    locator: &ExternalDocumentLocatorSummary,
) -> Result<Vec<u8>, ContractValueError>;

/// Encodes one runtime or tools consumer candidate's stable boundary fields.
pub fn canonical_runtime_tools_consumer_candidate_field_bytes(
    kind: &RuntimeToolsConsumerKind,
    locator: &RuntimeToolsConsumerLocator,
    scope: &CapabilityConsumerScope,
) -> Result<Vec<u8>, ContractValueError>;

/// Encodes one SDK server-consumer candidate's stable boundary fields.
pub fn canonical_sdk_consumer_candidate_field_bytes(
    locator: &SdkConsumerLocator,
    surface: &SdkSurfaceSummary,
    scope: &SdkExposureScope,
) -> Result<Vec<u8>, ContractValueError>;

/// Encodes one observability or audit candidate's stable body-free fields.
pub fn canonical_observability_audit_candidate_field_bytes(
    kind: &AuditMaterialKind,
    locator: &AuditMaterialLocatorSummary,
) -> Result<Vec<u8>, ContractValueError>;
```

The eight exact application digest functions are:

```rust
/// Calculates the body-free candidate digest for one external capability source.
pub(crate) fn digest_external_capability_source_candidate(
    source_kind: &ExternalCapabilitySourceKind,
    locator: &ExternalLocatorSummary,
) -> Result<ReferenceCandidateDigest, ApplicationError>;

/// Calculates the body-free candidate digest for one external secret reference.
pub(crate) fn digest_secret_candidate(
    provider_ref: &ExternalSecretProviderRef,
    usage_scope: &SecretUsageScopeSummary,
) -> Result<ReferenceCandidateDigest, ApplicationError>;

/// Calculates the body-free candidate digest for one governance result reference.
pub(crate) fn digest_governance_result_candidate(
    kind: &GovernanceRefKind,
    source: &GovernanceSourceRef,
    scope: &GovernanceResultScopeSummary,
) -> Result<ReferenceCandidateDigest, ApplicationError>;

/// Calculates the body-free candidate digest for one method-library asset reference.
pub(crate) fn digest_method_asset_candidate(
    kind: &MethodAssetKindSummary,
    locator: &MethodLibraryLocator,
) -> Result<ReferenceCandidateDigest, ApplicationError>;

/// Calculates the body-free candidate digest for one external document reference.
pub(crate) fn digest_external_document_candidate(
    kind: &ExternalDocumentKind,
    locator: &ExternalDocumentLocatorSummary,
) -> Result<ReferenceCandidateDigest, ApplicationError>;

/// Calculates the body-free candidate digest for one runtime or tools consumer reference.
pub(crate) fn digest_runtime_tools_consumer_candidate(
    kind: &RuntimeToolsConsumerKind,
    locator: &RuntimeToolsConsumerLocator,
    scope: &CapabilityConsumerScope,
) -> Result<ReferenceCandidateDigest, ApplicationError>;

/// Calculates the body-free candidate digest for one SDK server-consumer reference.
pub(crate) fn digest_sdk_consumer_candidate(
    locator: &SdkConsumerLocator,
    surface: &SdkSurfaceSummary,
    scope: &SdkExposureScope,
) -> Result<ReferenceCandidateDigest, ApplicationError>;

/// Calculates the body-free candidate digest for one observability or audit reference.
pub(crate) fn digest_observability_audit_candidate(
    kind: &AuditMaterialKind,
    locator: &AuditMaterialLocatorSummary,
) -> Result<ReferenceCandidateDigest, ApplicationError>;
```

Each application function first calls its matching contracts encoder,then writes thecorresponding domain-separated outer frame andcalls`ReferenceCandidateDigest::from_sha256_bytes`。It never reads private newtype fields itself。The exact semantic fields are:

| `ReferenceKind` | canonical fields in order | excluded material |
|---|---|---|
| `ExternalCapabilitySource` | `source_kind`, `external_locator` | source body、request/response、health |
| `Secret` | `secret_provider_ref`, `secret_usage_scope` | secret value、token、ciphertext、credential |
| `GovernanceResult` | `governance_ref_kind`, `governance_source`, `result_scope_summary` | approval、Policy、workflow/shared-rules body |
| `MethodAsset` | `method_asset_kind`, `method_library_locator` | method body、version body、source code |
| `ExternalDocument` | `document_kind`, `document_locator` | document/schema/guide body；`supported_descriptor_id`islocal relation,notcandidate identity |
| `RuntimeToolsConsumer` | `consumer_kind`, `consumer_locator`, `consumer_scope` | invocation payload/result、runtime auth/cache |
| `SdkConsumer` | `sdk_consumer_locator`, `sdk_surface_summary`, `exposure_scope` | SDK client/package/binding/cache body |
| `ObservabilityAudit` | `audit_material_kind`, `audit_locator` | log/span/metric/audit material、evidence body |

`ReferenceLocatorSummary` remains aone-way body-free policy carrier andisneverparsed tocalculatea digest。Theapplication firsthashesthe original typed fields,thenforms theexisting generic locator summary,andfinallycalls`ReferenceCandidate::body_free(kind,locator,digest)`。`find_by_candidate_digest(kind,digest)` keepskindasaseparate repository key component,whilethe digestdomain repeatskindforcross-family collision isolation。

## 10. Idempotency State Simplification

### 10.1 Active state contract

```rust
/// Technical lifecycle of one application idempotency reservation.
pub enum CapabilityIdempotencyState {
    /// Key and stable request digest are reserved but no replayable result is complete.
    Reserved,
    /// The operation completed and points to one immutable stored result surface.
    Completed,
}
```

`CapabilityIdempotencyRecord` no longer contains `conflict_reason` and no longer exposes `mark_conflict`。Its onlycurrent different-state edge is`Reserved -> Completed` through`complete(...)`。Mismatch is anobservation againstthewinner andmaps to`ApplicationError::IdempotencyConflict`;it isnotastate mutation。

### 10.2 Reachability and channel rule

| channel | durable `Reserved` reachability | exact interpretation |
|---|---|---|
| Command | none after a known successful commit；reservation,truth/result,completion areoneUoW | anothertransaction mayseein-flight onlyifchosenDB isolation exposesit；otherwise acommitted orphanReserved isconsistency defect,neverbusiness resume |
| InboundEvent | same asCommand | redelivery exact match eitherseesCompleted orabsence；committed orphanReserved withoutreceipt isconsistency defect |
| OperationsJob | current andrequired | musthaveoneexact `CapabilityJobExecutionRecord::Planned` bysamekey,operation,job,schema,run,digest；resumejournal |
| Query | forbidden | no reservation orstate |

`IdempotencyInProgress` remainsanexistingerror/public classification forthetransient race whereanatomic reserve/read provesanothermatching owner isstillinprogress andnoresult isyetvisible。It isnotanexcuse toretainunbounded orphanCommand/Consumer reservations。Concrete timeout/transaction-visibility binding remainsStep 14,withoutchangingtheconsistency rule。

### 10.3 Pair arithmetic correction

```text
CapabilityIdempotencyState variants = 2
possible different-state pairs = 2
current = 1 (Reserved -> Completed)
reserved = 0
illegal = 1 (Completed -> Reserved)
unclassified = 0
```

TheStep 10 application-technical subtotal changesfrom`20 = 5 current + 1 reserved + 14 illegal`to`16 = 5 current + 0 reserved + 11 illegal`。TheglobalStep 10 total changesfrom`642 = 239 current + 99 reserved + 304 illegal`to`638 = 239 current + 98 reserved + 301 illegal`。No domain or external-owner state matrix changes。

## 11. Command Idempotency Matrix

### 11.1 Shared Command rule

Every Command key is:

```text
CapabilityOperationIdempotencyKey::for_command(
    CapabilityOperationName::from_command_name(command_name),
    CommandMetadata.idempotency_key,
)
```

Every Command request digest domain embeds the exact operation and writes every field of the concrete Step 8 Command body in declaration order。The digest excludes `actor_context`、all other `CommandMetadata` fields includingthe raw idempotency key、request / trace / requested time、all repository reads、current state、resolver result、Clock、generated ids andaccepted result。Changingany body field、nested variant tag、optional presence orordered vector member underthesame key is`IdempotencyConflict`。

| # | Command / operation literal | Exact digest fields in canonical order | Completed exact duplicate result |
|---:|---|---|---|
| 1 | `EstablishCapabilityAccessContext` | `source` variant + all variant fields；`intake.identity_key`,`review_context`,`risk_summary`,`change_reason` | exact stored accepted result or stored stable rejection；no resolver、identity/review creation、capture ormaterial scan |
| 2 | `CorrectCapabilityIdentity` | `identity_ref`,`correction_kind`,`new_identity_key`,`related_identity_refs` in validated order,`correction_reason` | exact stored result/rejection；no correction reopen、new id ormaterial scan |
| 3 | `RetireCapabilityIdentity` | `identity_ref`,`retirement_reason` | exact stored result/rejection；no second retirement/cascade |
| 4 | `RecordCapabilityAccessReviewFact` | `identity_ref`,`review_context`,`risk_summary`;the fixed Step 6 §7.6.1 system reason is not a request field and is excluded | exact stored result/rejection；no second fact orattachment；no `ChangeReason::access_review_fact_recorded()` call orreason reconstruction |
| 5 | `RegisterCapabilityInRegistry` | `identity_ref`,`visibility_basis`,`visibility_context`,`registration_reason` | exact stored entry result/rejection；no second registry id |
| 6 | `UpdateRegistryLifecycleState` | `registry_entry_ref`,`target_state`,`lifecycle_reason` | exact stored result/rejection；no current-prerequisite reevaluation |
| 7 | `UpdateRegistryVisibilityBasis` | `registry_entry_ref`,`visibility_basis`,`visibility_context`,`change_reason` | exact stored result/rejection；no second visibility revision |
| 8 | `RetireCapabilityRegistryEntry` | `registry_entry_ref`,`retirement_reason` | exact stored result/rejection；no implicit identity/descriptor/exposure retirement |
| 9 | `EstablishAdapterDescriptor` | `identity_ref`,`registry_entry_ref`,`source_ref_id`,`descriptor_kind`,`connection_boundary_summary`,`supporting_document_ref_id` presence/value,`change_reason` | exact stored result/rejection；no document rebind orsecond descriptor id |
| 10 | `ReplaceAdapterDescriptor` | `current_descriptor_ref`,`registry_entry_ref`,`source_ref_id`,`descriptor_kind`,`connection_boundary_summary`,`supporting_document_ref_id` presence/value,`replacement_reason` | exact stored result/rejection；no second replacement id |
| 11 | `RecordDescriptorRiskConstraintSummary` | `descriptor_ref`,`review_fact_ref`,`risk_level`,`constraint_summary`,`change_reason` | exact stored result/rejection；no second summary id |
| 12 | `AttachDescriptorSecretReference` | `descriptor_ref`,`secret_provider_ref`,`secret_usage_scope`,`handling_boundary`,`change_reason` | exact stored result/rejection；no resolver,secret ref,summary orhistory replay |
| 13 | `AttachGovernanceSeamRelation` | `identity_ref`,`registry_entry_ref`,`review_fact_ref`,`governance_result` variant + all variant fields,`change_reason` | exact stored result/rejection；no governance resolver orsecond seam id |
| 14 | `ReplaceGovernanceSeamRelation` | `current_seam_ref`,`replacement_governance_result` variant + all fields,`replacement_reason` | exact stored result/rejection；no second replacement relation/ref |
| 15 | `ExpireGovernanceSeamRelation` | `seam_relation_ref`,`expiry_reason` | exact stored result/rejection；no repeated expiry/stale propagation |
| 16 | `AttachCapabilityMethodRelation` | `identity_ref`,`method_asset` variant + all variant fields,`relation_scope`,`change_reason` | exact stored result/rejection；no method resolver orsecond relation id |
| 17 | `RemoveCapabilityMethodRelation` | `method_relation_ref`,`removal_reason` | exact stored result/rejection；no second removal ormethod-body action |
| 18 | `EstablishFormalExposureBoundary` | `registry_entry_ref`,`descriptor_ref`,`governance_seam_ref`,`method_relation_ref` presence/value,`applicability_scope` typed order,`basis_summary`,`change_reason` | exact stored result/rejection；no second exposure/visibility id orruntime grant |
| 19 | `UpdateFormalVisibilityApplicability` | `exposure_ref`,`registry_entry_ref`,`intent` variant + all fields,`change_reason` | exact stored result/rejection；no policy reevaluation againstcurrent truth |
| 20 | `SuspendFormalExposureBoundary` | `exposure_ref`,`registry_entry_ref`,`suspension_reason` | exact stored result/rejection；no repeated suspension |
| 21 | `RetireFormalExposureBoundary` | `exposure_ref`,`registry_entry_ref`,`retirement_reason` | exact stored result/rejection；no repeated retirement ormarketplace action |
| 22 | `RecordCapabilityChangeImpactFact` | `traceability_ref`,`impact_scope`,`affected_consumers` validated stable order | exact stored impact result/rejection；no second impact id |
| 23 | `RecordTraceabilityHandoffSummary` | `traceability_ref`,`handoff_scope`,`audit_ref_id` presence/value,`trace_reason` | exact stored local result/rejection；no trace append orpost-commit handoff rerun |
| 24 | `RecordReferenceResolutionState` | `reference_subject`,`reference_kind`,`intent` variant + all fields | exact stored result/rejection；no state/material scan |
| 25 | `RegisterExternalDocumentReference` | `document_kind`,`document_locator`,`supported_descriptor_ref` presence/value | exact stored result/rejection；no resolver orsecond local ref |
| 26 | `RegisterCapabilityConsumerReference` | `registration` variant + every RuntimeTools / Sdk variant field | exact stored result/rejection；no resolver,consumer ref orexposure mutation |

The raw idempotency key is repository identity material andisnotalsoincludedin`CapabilityRequestDigest`。Operation isalreadydomain-separated andstored inbothkey andreservation；it isnotrepeatedasa top-level request field。Thecanonical domain stillincludesoperation toprevent cross-operation digest equivalence。

For operation 4, fresh accepted execution calls `ChangeReason::access_review_fact_recorded()` exactly once after the review becomes `Recorded` and before attachment. The resulting exact ASCII/UTF-8 bytes `capability-hub.change-reason/access-review-fact-recorded.v1` (`59` bytes) are copied unchanged into the terminal change record, traceability and affected-material bridges. The value is a deterministic system effect and therefore is not appended to the request digest. Same-key/same-digest replay reads the immutable stored result and persisted record surface and invokes the factory zero times. A stored missing, corrupt or different reason cannot be repaired from the current constant; it follows Step 12 `ConsistencyDefect` recovery. Any literal, namespace, version or byte change is a persisted compatibility change rather than an idempotency implementation refactor.

### 11.2 Command idempotency window

Step 7 exposes no delete、expire、archive orretention method foridempotency rows orstored results。Thereforev1 window is thelifetime ofthe complete reservation + immutable result set：the same normalized key cannotbereused whilethatsetexists。Infra maynotTTL thekey、shell、surface ortyped envelope independently。A future bounded retention feature mustdesignanatomic retention protocol andcompatibility window acrossall sidecars；Step14 cannotinventone throughconfiguration alone。

## 12. Inbound Event Idempotency Matrix

### 12.1 Shared Inbound rule

Every Inbound key is:

```text
CapabilityOperationIdempotencyKey::for_inbound_event(
    CapabilityOperationName::from_inbound_consumer_name(consumer_name),
    source_family,
    source_event_ref,
)
```

Every Inbound request digest writes `schema_version`,`source_family`,`source_event_ref`,`source-provided idempotency_key`,then every concrete payload field in declaration order。The operation remainsinthe digestdomain andnormalized key。It excludes source actor、local `CapabilityInboundEventRef`、trace、`occurred_at`、transport topic/offset/attempt、Clock、generated local ids、current local state andresolver observation。Schema/version/header validation happensbeforetyped payload digesting；unsupported schema isneverreserved。

| # | Consumer / required family | Exact payload digest fields after shared authority fields | Exact duplicate / changed replay behavior |
|---:|---|---|---|
| 1 | `ConsumeGovernanceResultReferenceChanged` / `Governance` | `target` variant + all fields,`governance_ref_kind`,`governance_source`,`result_scope_summary`,`declared_safe_summary` | exact same digest reads stored typed receipt；changed source key/payload under same source event -> `Quarantined` + idempotency conflict,zero resolver/write |
| 2 | `ConsumeMethodAssetReferenceChanged` / `MethodLibrary` | `target` variant + all fields,`method_asset_kind`,`method_library_locator`,`change_summary` | same receipt replay；changed data -> conflict/quarantine,zero resolver/ref update |
| 3 | `ConsumeDownstreamConsumptionImpactReported` / `DownstreamConsumer` | `impact_fact_ref`,`consumer_ref` variant/id,`feedback` variant + every present field | same receipt replay；changed feedback under same event -> conflict/quarantine,zero summary append |
| 4 | `ConsumeExternalCapabilitySourceReferenceChanged` / `ExternalCapabilitySource` | `target` variant + all fields,`source_kind`,`external_locator` | same receipt replay；changed target/kind/locator -> conflict/quarantine,zero resolver/ref update |
| 5 | `ConsumeAuditMaterialReferenceChanged` / `ObservabilityAudit` | `target` variant + all fields,`audit_material_kind`,`audit_locator`,`change_summary` | same receipt replay；changed material locator/summary -> conflict/quarantine,zero audit ref update |
| 6 | `ConsumeExternalDocumentReferenceChanged` / `ExternalDocument` | `target` variant + all fields,`document_kind`,`document_locator`,`change_summary` | same receipt replay；changed document data -> conflict/quarantine,zero document ref update |

Inbound v1 idempotency window isalso thelifetime ofreservation + shell/surface/typed receipt envelope。Source-owned event refs arepublic body-free identities,notbroker offsets。A source mustusea newsource event ref for anewsemantic event；changingonlyits source-provided key orpayload intentionallycollides withtheexistingapplication key andisreported,notmerged/overwritten。

## 13. Operations Job Idempotency Matrix

### 13.1 Shared Job rule

Every Job key is:

```text
CapabilityOperationIdempotencyKey::for_job(
    CapabilityOperationName::from_job_name(metadata.job_name),
    metadata.idempotency_key,
)
```

Every Job request digest writes `schema_version` and every concrete input field in declaration order。It excludes raw key、run id、actor、trace、scheduler/worker attempt、planning cursor/pages、generatedtarget/report/material ids、Clock andloaded current truth。`run_id` remainsa separate exact replay fence in`CapabilityJobExecutionRecord` andtyped stored report envelope：same operation/key/digest butdifferent run id is`IdempotencyConflict`,notjournal resume orstored report replay。

| # | Job / operation | Exact digest fields after schema | Reserved exact reentry / Completed duplicate |
|---:|---|---|---|
| 1 | `RunCapabilityRegistryReconciliation` | `reconciliation_scope`,`truth_scope`,`material_scope` | same run loads complete frozen journal；Completed readsstored registry-reconciliation response；no rescan/report recreation |
| 2 | `RefreshControlledConsumerView` | `exposure_ref`,`target_scope` variant + all fields | same run resumesfirstPlanned target/final assembly；Completed typed replay；no consumer rescan/rebuild |
| 3 | `RebuildDirectorySearchBrowseProjection` | `rebuild_scope` variant + all fields | same run resumesjournal；Completed typed replay；no source-chain rescan/projection rebuild |
| 4 | `PrepareAuditFriendlyExportSummary` | `traceability_refs` stable order,`export_scope`,`observability_ref_ids` stable order includingvalid empty | same run resumesfrozen targets；Completed typed replay；no trace/audit ref rescan |
| 5 | `RebuildReadOnlyEcosystemDiscoverySummary` | `targets` stable order,each exposure/context pair | same run resumesjournal；Completed typed replay；no marketplace/listing lookup |
| 6 | `RunDerivedMaterialReconciliation` | `reconciliation_scope`,`truth_scope`,`material_scope` | same run resumesjournal；Completed typed replay；no current-drift recomputation |
| 7 | `RefreshExternalReferenceResolution` | `refresh_scope` variant + all fields,`allowed_reference_kinds` validated order | same run resumesfrozen refs；Completed typed replay；no scope rescan/resolver call |
| 8 | `RepairCapabilityAccessEventCollaboration` | `repair_scope` variant + all exact capture/intent/source refs | same run resumesfrozen capture/intent targets；Completed typed replay；no second snapshot/candidate formation |

### 13.2 Job window and new-run rule

No Job execution repository method deletes,expires,scans-by-run orresetsajournal。The v1 key window isthelifetime oftheidempotency row、journal andstored report sidecars。A genuinelynewrun mustuseanewraw idempotency key evenwheninput isunchanged；it receivesanew`JobRunId` fromtherunner andformsanewfrozen plan。A differentrun id underanexisting key isneverinterpreted asa retry。This preventscheduler duplicates fromsilently takingoveranold journal whilepreserving run id outsidebusiness digest。

## 14. Query and Outbound Non-reservation Boundary

### 14.1 All 33 Query protocols

Theexact Query set isStep 8 §§8.13.1~8.16.10。For everyone:

| property | exact rule |
|---|---|
| operation identity | closed`CapabilityOperationName::from_query_name` onlyforroute/service/response symmetry |
| idempotency key / digest | none；no `CapabilityOperationIdempotencyKey`variant andno`CapabilityRequestDigest`calculation |
| repository calls | onlydeclared resolver-first reads；noUoW、reserve、stored result、save、append、capture orjournal |
| repeated Query | reevaluatecurrentauthorized visibility/freshness andreturncurrent surface；doesnotreplayanold snapshot |
| consistency failure | existing`ApplicationError::ConsistencyDefect`;neverwritearepair oridempotency record |

Mechanical gate: `33 / 33` Query service tests mustassert zero calls to`CapabilityUnitOfWorkManager`、`CapabilityIdempotencyRepository`、`StoredCapabilityResultRepository`、allrepository writes、external owner resolvers、handoff andevent collaboration。

### 14.2 All 10 Outbound protocols

The ten Outbound Event flows do notconsumea request idempotency key anddo notcreate`CapabilityIdempotencyRecord`。Their stable identity is:

```text
exact immutable CapabilityEventCaptureSourceRef
+ exact CapabilityEventSchemaRef
-> unique CapabilityEventCaptureRecord
+ immutable CapabilityEventPayloadSnapshot
-> stable external CapabilityEventCollaborationIntentRef
```

`CapabilityEventCaptureRepository::find_by_source_and_schema` andtheunique `(source_ref,schema_ref)` constraint preventasecondcapture。`candidate_digest` verifiescomplete envelopebytes butisnottherepository key。A duplicate continuation loads theofficial capture/snapshot：`Captured` collaborateswiththeexact stored candidate andrequiresstable-intent semantics；`IntentBound` onlycalls`get(existing_intent)`。It neverre-runs thesource Command/Consumer/Job、mapper、serializer orcreatesasecond reservation。

## 15. Concurrency Control Principles

### 15.1 Control hierarchy

| control | exact authority | protects | does not replace |
|---|---|---|---|
| atomic idempotency reserve | `CapabilityIdempotencyRepository::reserve_if_absent` unique normalized key | duplicate request/event/job winner | business/current-owner uniqueness、object CAS |
| owner optimistic CAS | exact `Loaded<T>.expected_version` passed to matching `save` | concurrent update ofoneversioned owner | idempotency、dependency range fence |
| conditional current uniqueness | owner-specific current index inStep 7/11 | two current identities/registry entries/descriptors/relations/exposures/views/materials foroneowner key | stored replay |
| append/insert-only uniqueness | exact record/report/result/snapshot id anddeclared compound key | duplicate append/immutable overwrite | current-owner CAS |
| canonical reference uniqueness | `(ReferenceKind,ReferenceCandidateDigest)` + current state bysubject | duplicate local refs andtwo canonical states | request/event idempotency |
| per-source dependency fence | existing source/material save implementations underStep 11 §12.3 | source successor vsold-source non-stale material phantom | individual material CAS |
| event source/schema uniqueness | `(CapabilityEventCaptureSourceRef,CapabilityEventSchemaRef)` | second snapshot/capture forsame semantic source/schema | external stable-intent idempotency |
| Job journal CAS | exact normalized key + latest journal expected version | duplicate target terminalization/finalization | external Port stable candidate/intent contract |

No control isimplemented throughlast-write-wins、generic upsert、timestamp ordering、random delay、process-local mutex orraw-key-only hash。A process-local mutex mayreduce contention butcannotbea correctness authority becauseworkers/processes maybemultiple。

### 15.2 Canonical multi-resource order

When oneUoW touchesmultiple owners/fences,theapplication forms typed keys first,deduplicates them,andacquires/validates persistence controls inthis order:

```text
1. normalized idempotency key
2. core truth / relation source refs by CapabilityTraceSubjectRef variant tag, then typed id bytes
3. canonical reference subjects by ReferenceSubjectRef variant tag, then typed id bytes
4. current-owner compound keys (registry/descriptor/relation/exposure/visibility/consumer/material)
5. dependency source fences by source variant tag, typed id, exact version
6. mutable material refs by DerivedMaterialRef variant tag, then typed id bytes
7. append-only record / trace successor / report ids
8. event source + schema capture key
9. immutable result ref / surface ref
10. idempotency completion CAS
```

This is alogical product-neutral order。Anadapter mayusepredicate locks、serializable validation orordered row locks,butits deadlock retry mustpreserveexisting`ApplicationError` classification andmustnotchange winner selection。Job targetUoWs applyonlythe subset theytouch；they alwayslocktheexact journal afterthetarget source/material controls soeffect + terminal outcome commitatomically。The finalJob UoW locksjournal,stored result identities andreservation inthat order。

### 15.3 Optimistic retry ownership

Application services do nothideanunbounded CAS retry loop。On`OptimisticConflict` theyrollback,exact-reload thedeclared owner/journal andreturn accordingtotheflow:

- Command: returntheexisting typed technical conflict;thecaller mayresubmitwithanewrequest/idempotency key afterreadingcurrent truth。The same key mustnotrecomputeagainstnew truth becauseits original request alreadyowns one digest.
- Inbound: exact duplicate first;otherwise returntheexisting delayed/retry mapping withno local effect。Redelivery uses thesame source event/key andwillre-evaluateonlyafterthepriorUoW isknownnotcommitted。
- Job: exact-reload journal。If thetarget isnowterminal,skipit；ifit remainsPlanned afterconfirmed rollback,return/retry throughrunner policy withoutchangingtheplan。No loop mayreplan orregenerate ids。
- Outbound bind: exact-reload capture。Ifnow`IntentBound`withthesame intent,continueby`get`;ifdifferent/asymmetric,consistency error；ifstill`Captured`,later retry maybindthesame stable intent。

Retry count、delay、backoff andjitter areStep 14 binding,not semantic state。Only`TemporarilyUnavailable / Timeout` anddeclared optimistic conflict paths areeligible；unknown/raw failures are notclassified bytext。

## 16. Exact Command Concurrency Matrix

| # | Command | Conflict resources / indexes | Required control and loser result | Step 16 cut |
|---:|---|---|---|---|
| 1 | `EstablishCapabilityAccessContext` | source candidate owner；identity-key current unique；current review-by-identity；new reference state | idempotency first；candidate `(kind,digest)` andidentity-key unique atcommit；allnew rows + records/captures/result atomic；loser exact-reads winner onlyforprotocol classification,nevermerges | `TC-CH-CONC-CMD-001` |
| 2 | `CorrectCapabilityIdentity` | target identity CAS；replacement identity-key unique；related identity exact-version prerequisites；affected dependency ranges | target `Loaded.expected_version` + key unique + per-source fences；any stale/unique loser rollsbackallcorrection records/materials | `TC-CH-CONC-CMD-002` |
| 3 | `RetireCapabilityIdentity` | identity CAS；dependent material ranges | identity token + per-source fence；concurrent successor/retirement yields`OptimisticConflict`;no second terminal record | `TC-CH-CONC-CMD-003` |
| 4 | `RecordCapabilityAccessReviewFact` | identity CAS/link；onecurrent recorded review peridentity；optional old review CAS | current-review conditional unique + old/identity tokens；winner'sfact remainscurrent；loser createsnoorphan fact/change/capture | `TC-CH-CONC-CMD-004` |
| 5 | `RegisterCapabilityInRegistry` | onecurrent registry entry peridentity；identity exact prerequisite | conditional current unique `(identity_id)` + create `None`;loser doesnotreturnwinner asits ownaccepted result | `TC-CH-CONC-CMD-005` |
| 6 | `UpdateRegistryLifecycleState` | registry CAS；dependent view/material ranges | registry loaded token + per-source fence；stale target input neverlast-write-wins | `TC-CH-CONC-CMD-006` |
| 7 | `UpdateRegistryVisibilityBasis` | registry CAS；dependent view/material ranges | same controls；basis/context/reason digest prevents changedrequest replay | `TC-CH-CONC-CMD-007` |
| 8 | `RetireCapabilityRegistryEntry` | registry CAS；current index removal；dependent ranges | terminal CAS + fence；no identity/descriptor/exposure cascade beyonddeclared effects | `TC-CH-CONC-CMD-008` |
| 9 | `EstablishAdapterDescriptor` | onecurrent descriptor perregistry；registry CAS bind；optional document CAS/link；dependent ranges | current descriptor unique + registry/document exact tokens + source fences；allowner links/records/captures atomic | `TC-CH-CONC-CMD-009` |
| 10 | `ReplaceAdapterDescriptor` | current descriptor CAS；new descriptor current-index winner；registry CAS；optional document rebind CAS | old/new/current unique andregistry/document tokens inoneUoW；loser leavesold/current winner graphunchanged | `TC-CH-CONC-CMD-010` |
| 11 | `RecordDescriptorRiskConstraintSummary` | onecurrent nonsuperseded summary perdescriptor；old summary CAS；descriptor relation/version | conditional unique + exact old/descriptor reads；no duplicate summary orpartial supersession | `TC-CH-CONC-CMD-011` |
| 12 | `AttachDescriptorSecretReference` | secret candidate unique；canonical state current；descriptor CAS；safe-summary current unique | reference `(Secret,digest)` unique + descriptor/state/summary controls；resolver mayrepeatread butno duplicate ref/history | `TC-CH-CONC-CMD-012` |
| 13 | `AttachGovernanceSeamRelation` | governance candidate unique；onecurrent seam peridentity；ref/state；identity/registry/review prerequisites | candidate/current unique + exact owner chain + relation create；loser nevercreatesgovernance truth/approval | `TC-CH-CONC-CMD-013` |
| 14 | `ReplaceGovernanceSeamRelation` | old seam CAS；new current relation unique；replacement governance candidate/ref/state | old token + current unique + candidate unique；old/new records andtraces atomically winner-owned | `TC-CH-CONC-CMD-014` |
| 15 | `ExpireGovernanceSeamRelation` | seam CAS；dependent material ranges | seam token + fence；terminal winner preserved,second expiry zero committed effect | `TC-CH-CONC-CMD-015` |
| 16 | `AttachCapabilityMethodRelation` | method candidate unique；onecurrent method relation peridentity；ref/state | candidate/current unique + exact identity/ref-state checks；no method-body orsecond relation creation | `TC-CH-CONC-CMD-016` |
| 17 | `RemoveCapabilityMethodRelation` | relation CAS；method-asset dependency index；material ranges | relation token + source fences；terminal relation not reopened/overwritten | `TC-CH-CONC-CMD-017` |
| 18 | `EstablishFormalExposureBoundary` | onecurrent exposure perregistry；onecurrent visibility perexposure；registry CAS；allprerequisite versions；material ranges | exact prerequisite fence + exposure/visibility current unique + registry token + source fences；final exposure-version/visibility symmetry checked atcommit | `TC-CH-CONC-CMD-018` |
| 19 | `UpdateFormalVisibilityApplicability` | exposure CAS/source version；visibility CAS/current；registry CAS；dependent ranges | canonical owner order andallthree exact tokens；policy result cannotcommit overnewer exposure | `TC-CH-CONC-CMD-019` |
| 20 | `SuspendFormalExposureBoundary` | exposure/visibility/registry CAS；dependent ranges | atomic three-owner transition + fences；no partial suspended exposure witholdvisible fact | `TC-CH-CONC-CMD-020` |
| 21 | `RetireFormalExposureBoundary` | exposure/visibility/registry CAS；current index removal；dependent ranges | atomic terminal transition + fences；no implicit marketplace/SDK/runtime mutation | `TC-CH-CONC-CMD-021` |
| 22 | `RecordCapabilityChangeImpactFact` | impact identity/current/source indexes；trace exact revision；affected-consumer set | insert/current unique asdeclared + exact trace ref/version；duplicate key handledbeforenew impact id；winner notmerged | `TC-CH-CONC-CMD-022` |
| 23 | `RecordTraceabilityHandoffSummary` | trace contiguous successor/current-highest CAS；optional audit ref/state | `expected_previous_version` + exact audit pair；one nextrevision wins；post-commit handoff neverchangeslocal winner/result | `TC-CH-CONC-CMD-023` |
| 24 | `RecordReferenceResolutionState` | onecurrent state perreference subject；reference/state-id parity；affected dependency ranges | state exact token + current-subject unique + per-source fences；same value/reason isdeclared no-op rejection,changedreason remainsrealrevision | `TC-CH-CONC-CMD-024` |
| 25 | `RegisterExternalDocumentReference` | `(ExternalDocument,digest)` unique；ref/state ids；optional descriptor relation | candidate unique + ref/state create atomic；winner preserved；supported descriptor isnotcandidate identity | `TC-CH-CONC-CMD-025` |
| 26 | `RegisterCapabilityConsumerReference` | RuntimeTools/SDK candidate unique；typed ref/state；consumer compound indexes | variant-specific candidate unique + ref/state create；no cross-variant id parsing orformal exposure mutation | `TC-CH-CONC-CMD-026` |

Every row additionallyusesatomic normalized-key reserve andsame-UoW immutable result +`Reserved -> Completed`。A business/current unique conflict isnotautomaticallyidempotent success：onlyanexact Completed reservation mayreplaytheoriginal surface。Whenanother business winner existsundera differentidempotency key,theflow followsitsStep 12 protocol-specific uniqueness/policy mapping anddoesnotborrowthewinner's result ref。

## 17. Inbound, Job, and Outbound Concurrency Matrix

### 17.1 Six Inbound consumers

| Consumer | Conflict resources | Control / result | Test cut |
|---|---|---|---|
| `ConsumeGovernanceResultReferenceChanged` | normalized event key；governance candidate owner；existing ref/state CAS；capture source/schema | atomic reserve；candidate unique；ref/state token；capture unique；winner receipt atomic；loser conflict/delayed withzero seam/approval write | `TC-CH-CONC-IN-001` |
| `ConsumeMethodAssetReferenceChanged` | event key；method candidate；ref/state CAS；capture | same controls；no method truth/body mutation；terminal exact replay remainsIgnored receipt | `TC-CH-CONC-IN-002` |
| `ConsumeDownstreamConsumptionImpactReported` | event key；`source_feedback_ref` unique；summary id/CAS；impact/consumer relation | normalized public event key pluslocal source-feedback unique fence；summary + typed receipt atomic；candidate loser nevermerges feedback variants | `TC-CH-CONC-IN-003` |
| `ConsumeExternalCapabilitySourceReferenceChanged` | event key；source candidate；ref/state CAS；capture | candidate/current-state controls；source kind immutable onexisting ref；zero identity/descriptor mutation | `TC-CH-CONC-IN-004` |
| `ConsumeAuditMaterialReferenceChanged` | event key；audit candidate；ref/state CAS；capture | typed audit candidate unique andstate token；raw audit material neverenterslock/digest/result | `TC-CH-CONC-IN-005` |
| `ConsumeExternalDocumentReferenceChanged` | event key；document candidate；ref/state CAS；capture | typed document candidate unique andstate token；existing supported-descriptor relation preserved | `TC-CH-CONC-IN-006` |

For thefive reference consumers,simultaneousdifferent source events thattargetthesame local subject maybothpassread validation；onlyone state/ref CAS orcandidate-current winner commits。Theloser rollsbackits receipt/completion andreturns theexisting delayed/retry/error mapping；it maynotwriteareceipt claiminganeffect thatlost。Per-source material fences applyonlywhere theexact Step 9 flow declaresaffected-material propagation。

### 17.2 Eight Operations Jobs

| Job | Conflict resources | Control / exact reentry | Test cut |
|---|---|---|---|
| `RunCapabilityRegistryReconciliation` | normalized key/journal；frozen truth/material refs；immutable report id；capture；journal target | initial reservation+journal unique；report append/capture + one target terminal journal CAS；concurrent runner exact-reloads winner | `TC-CH-CONC-JOB-001` |
| `RefreshControlledConsumerView` | journal target；view compound current key/CAS；source-version fences | frozen plan + view current unique/token + every source fence + journal CAS；old-source rebuild cannotcommitfresh overnewer source | `TC-CH-CONC-JOB-002` |
| `RebuildDirectorySearchBrowseProjection` | journal target；projection current owner/CAS；registry/descriptor/exposure fences | same pattern；onlyfinalReady revision saved；concurrent source successor orrebuild yieldsconflict,notpartial projection | `TC-CH-CONC-JOB-003` |
| `PrepareAuditFriendlyExportSummary` | journal target；export `(trace,scope)` current key/CAS；trace/audit source fences | frozen ref pairs + export current/token + source fences + journal CAS；attachments followplan order | `TC-CH-CONC-JOB-004` |
| `RebuildReadOnlyEcosystemDiscoverySummary` | journal target；discovery `(exposure,context)` current key/CAS；source fences | frozen applicability/descriptor/exposure input + material token/fences；neverqueriesmarketplace | `TC-CH-CONC-JOB-005` |
| `RunDerivedMaterialReconciliation` | journal target；frozen snapshot/material refs；immutable report append/capture | append-only report id + capture unique + journal CAS；new key maycompute anewreport,duplicate key neverdoes | `TC-CH-CONC-JOB-006` |
| `RefreshExternalReferenceResolution` | journal target；reference/current-state CAS；capture source/schema | frozen subject/state/digest + exact state token；state revision/capture/journal success oneUoW；terminal current state skip immutable | `TC-CH-CONC-JOB-007` |
| `RepairCapabilityAccessEventCollaboration` | journal target；capture bind CAS；external intent/source | stable stored candidate/intent + exact outcome symmetry；capture bind andjournal success sameUoW；concurrent terminal journal/capture winner exact-reloaded | `TC-CH-CONC-JOB-008` |

Two runners mayloadthe same Planned target。They mayrepeatbody-free read/resolver work,butonlyone target UoW cancommitbecausebothbusiness/material owner tokens andjournal token mustmatch。For anexternal-effect target,repeatability additionallyrequires theexisting stable candidate/intent contract；CAS alone cannotdeduplicateanexternal side effect。No generic Job parallelism isallowed toprocesslaterordinals whileanearlierordinal remainsPlanned；thecanonical algorithm alwaysselects`next_planned_target()`。

### 17.3 Ten Outbound capture / collaboration flows

| Race | Exact protection | Loser / recovery |
|---|---|---|
| two source flows formthe same source/schema candidate | unique `(source_ref,schema_ref)` andstored digest/bytes symmetry | onecapture wins；same bytes loadswinner；different digest/bytes isuniqueness/consistency conflict,neversecondcapture |
| two continuations loadone`Captured`capture | bothconstructcandidate onlyfromsame snapshot；external `collaborate` mustreturnsame stable intent forsame source/schema/digest/bytes | eachattempt validatesexact source/intent；onebind CAS wins；loser reloads`IntentBound`andcalls`get` |
| continuation racesrepair Job bind | same capture expected version；repair bindsintent + journal success inone targetUoW | facade shortUoW orrepair target wins；loser reloads,doesnotformsecondintent/journal success |
| two continuations load`IntentBound` | no local mutation；bothcall`get(exact intent)` | typed status maydiffer overtime becauseexternal owner;local capture remainsunchanged |
| snapshot/capture pair corrupt ormissing | five-tuple + bytes/digest verification on everyload | `ConsistencyDefect`/`CodecFailure`;no current-source remap,second snapshot orgeneric decoder |

## 18. Duplicate and Reserve-race Decision Matrix

| Durable read / atomic reserve result | Incoming identity | Exact action | Public / recovery result |
|---|---|---|---|
| no row at preflight；atomic reserve wins | valid key + digest | continueonlythedeclared fresh channel flow | Command accepted/stored rejection；Inbound stored receipt；Job initial journal |
| no row at preflight；atomic reserve returns`Existing` | classify exact winner beforeanybusiness id/resolver/factory | rollbackrequest-local UoW anddiscarduncommitted plan/objects | followoneofthe rowsbelow；neverretryreserve recursively withoutanexact reread bound |
| `Completed` + exact key/channel/operation/digest | Command | `completed_result_ref` -> generic stored shell/surface validation -> exact command result/rejection mapper | originalresult ref/effect；response-onlyduplicate marker；zero business/Port/write |
| `Completed` + exact identity | Inbound | typed`get_consumer_receipt` andvalidate source/event/effect/surface symmetry | stored receipt withresponse-only`DuplicateReplayed / StoredReplay`;zero resolver/write |
| `Completed` + exact identity + same run id | Job | typed`get_job_report` andvalidate operation/job/schema/run/result/surface/variant | stored typed response/report；zero planning/target/Port/write |
| `Completed` butdifferent channel/operation/digest；orJob different run id | any write channel | preservewinner record/result；do notload/exposewinner business body toconflicting caller | `ApplicationError::IdempotencyConflict`;channel-specific closed conflict/rejection/quarantine mapping |
| `Completed` + missing/wrong/corrupt shell/surface/typed envelope | any | no current-truth/journal reconstruction andnooperation rerun | `ConsistencyDefect(TechnicalObject(StoredOperationResult),RequiredSidecar / StoredResultShape)` or`CodecFailure` |
| `Reserved` + exact Job identity andsame run | matching journal required | exact-load journal bynormalized key；validatekey/operation/job/schema/run/digest/plan | resume firstPlanned target orpure final assembly |
| `Reserved` + Job butjournal missing/asymmetric | any | norescan/replan/new journal | `ConsistencyDefect(TechnicalObject(JobExecutionRecord),RequiredSidecar / JobExecutionShape)` |
| committed-visible `Reserved` + Command/Inbound | exact ordifferent digest | no legitimate durable partial owner existsunderStep 11 atomic UoW | `ConsistencyDefect(TechnicalObject(IdempotencyRecord),IdempotencyStateShape)`；operator repair,notbusiness retry |
| transient same-key owner proveninprogress bytheconcrete transaction/unique mechanism | exact same request | no second body;winner remainsunmodified | existing`IdempotencyInProgress` / Inbound`Delayed`；laterexact reread |
| same key owner inprogress | different request | no second body andno winner mutation | `IdempotencyConflict`,not`mark_conflict` |
| idempotency repository unavailable / timeout | unknown | no business UoW writes | existing`PortFailure`;automatic retry onlyunderStep 14 bounded policy |

The service neverwritesanidempotency row merelyto rememberthat anotherrequest conflicted。Conflict telemetry belongsStep 15 andmustnotchange winner state/version/time。The originalreservation trace remainsfirst-owner attribution；duplicate traces do notoverwriteit。

## 19. Reentry Protection Matrix

| Scenario | Reentry source | Protection | Exact recovery |
|---|---|---|---|
| Command response lost afterknown commit | client same-key retry | `Completed` + immutable result | exact stored replay；no truth/change/trace/material/capture/handoff rerun |
| Command confirmed rollback beforecommit | client same-key retry | no durable reservation/effect | fresh reserve mayrunagain；rolled-back`Loaded.expected_version`andgenerated ids discarded |
| Command commit outcome unknown | connection/driver ambiguity | same key/digest exact durable read first | §20 decision tree；neverblind rerun ornewkey compensation |
| stable Command rejection afterreserve | client retry | rejection shell/surface +Completed atomic | replay same rejection；do notreevaluatecurrent state/resolver |
| Command same key changedbody | caller defect | request digest mismatch | conflict；winner/result hidden andunchanged |
| Inbound redelivery afterreceipt commit | bus/worker redelivery | event-derived normalized key + stored typed receipt | replay receipt；no resolver/reference/summary/capture write |
| Inbound redelivery afterconfirmed rollback | local failure/ack retry | no durable row/effect | same event mayre-run;resolver observation itselfwasneverclaimedrolledback |
| unsupported schema redelivery | header-first worker | schema gate beforepayload/digest/reserve | same unsupported surface；no payload decode orwrite |
| Outbound source commit,pre-collaboration crash | process stop | `Captured` + immutable snapshot,AwaitingIntent scan | repairJob/exact facade usesstored candidate；no current-source mapper |
| external intent formed,localbind absent/unknown | process/DB failure | same stored candidate mustmaptosame stable intent | retry`collaborate(candidate)` thenexact source/intent validation；bind bycapture CAS |
| capture already`IntentBound` | duplicate continuation | bound intent isonlyauthority | `get(exact intent)`；zero collaborate/secondbind |
| post-commit trace handoff explicit retry | caller submits a new Command key with the exact current `HandoffPending` trace ref | existing protocol always calls `request_handoff(...)` once because persisted trace does not retain `handoff_scope` and cannot prove exact prior external request identity | append one new `HandoffPending` revision,store/complete the new local result,then call `handoff_traceability` post-commit for that new exact trace ref |
| post-commit trace handoff request changes scope/audit/reason | explicit new Command key | changed request digest and one-revision protocol semantics | same one-new-revision path；no in-place overwrite of the prior revision or external receipt claim |
| same-key trace handoff duplicate | client retry | original stored Command result | replay only；Port call zero regardlessofprior external outcome |
| Job crash beforeinitial commit | process/runner retry | neitherreservation norjournal visible | same key/run mayplan again；no target started |
| Job initial commit,pre-target crash | runner retry | `Reserved + Planned journal` | exact journal resume；no scope scan/id generation |
| Job target external read succeeds,beforetargetUoW | crash | target remainsPlanned；frozen candidate/ref retained | repeat onlydeclared stable resolver/candidate/intent call；neverchangeplan |
| Job target commit succeeds,response loop crashes | runner retry | terminal target outcome + effect atomic | next`next_planned_target`;terminal ordinal/Port/effect skipped |
| two runners raceone target | scheduler duplicate | business/material token + journal CAS | one commit；loser exact-reloads andpreservesterminal outcome |
| Job alltargets terminal,final write failsknown rollback | runner retry | journal remainsPlanned/allterminal;reservationReserved | pure assembler withnewuncommitted result/surface ids；no target/source reads |
| Job final commit unknown | driver ambiguity | idempotency + stored report + journal exact reads | §20 final branch；no duplicate report/finalization |
| completed Job duplicate | scheduler/client same key/run | typed stored report envelope | exact typed replay；no journal/source/Port reread |

### 19.1 Trace handoff exact retry boundary

`RecordTraceabilityHandoffSummary` has only two legal retry identities:

| Retry identity | Local action | External action |
|---|---|---|
| same normalized idempotency key + exact request digest | replay the original immutable stored result；zero trace read/mutation/append | zero Port calls,regardless of the prior post-commit outcome |
| new normalized idempotency key + caller-supplied exact current trace ref | execute the existing Command flow；validate scope/audit/reason；call`request_handoff(...)`exactly once；append exactly one next revision | after the new local result/completion commits,`Some(audit_ref)`calls the Port once for the new exact revision；`None`calls zero |

There is no legal new-key zero-revision continuation。The persisted trace records`handoff_refs`and`trace_reason`but does not retain`handoff_scope`or an external receipt / intent；therefore the application cannot prove that a new request is byte-for-byte identical to the prior external call。Comparing only current state、audit ref and reason would merge distinct scopes and violate stored-request identity。

The external adapter must deduplicate repeated invocation of the exact same `(traceability_ref,audit_ref,handoff_scope)` when transport retry occurs inside one Port call boundary。A caller-level new-key retry uses a new exact trace revision and is a distinct explicit handoff request。The application still does not persist the Port receipt or claim delivery、evidence alias or acceptance。No new local intent store or repair Job is introduced；reliable external-delivery tracking remains outside the current capability-hub boundary。

## 20. Commit Outcome Unknown Decision Algorithms

### 20.1 Command / Inbound

```text
Input: exact normalized key + original CapabilityRequestDigest

1. Do not call Clock, IdGenerator, domain, resolver, handoff, collaboration, or begin a write UoW.
2. idempotency.get_with_version(key)
3. None:
     outcome is still not provable from this read alone;
     retry only after the UoW adapter/transaction authority confirms prior commit was not durable.
     Until then return CommitOutcomeUnknown / temporarily unavailable.
4. Completed + exact match:
     load exact channel-specific immutable result/receipt/report;
     if symmetric, return replay.
5. Completed + mismatch:
     return IdempotencyConflict;preserve winner.
6. Reserved:
     Command/Inbound -> consistency defect unless concrete transaction authority proves an active owner;
     Job -> use §20.2.
7. Any missing/asymmetric sidecar:
     consistency/codec failure;never rerun from current truth.
```

A single `None` read afterunknown commit isnotproof ofrollback underanunspecified store/replica。Step14 mustbindtheauthoritative read/session semantics andmaximum observation procedure；untilthatbinding exists,theconservative result remains`CommitOutcomeUnknown`。No time-window guess、sleep-then-create、replica fallback ornewkey retry isallowed。

### 20.1.1 Step 14 controlled commit-resolution procedure

The existing UoW manager now exposes `resolve_commit(&CapabilityTransactionRef)` with the closed result `Durable`, `NotDurable`, or `Unknown`. This is a controlled reopen of the recovery seam only; it does not add a repository finder, a second transaction handle, a persisted state, or a new idempotency variant.

```text
Before commit:
  transaction_ref = uow.transaction_ref().clone()

When commit returns an unknown outcome:
  1. Do not begin another UoW and do not call any mutation, resolver, handoff,
     collaboration, Clock, or IdGenerator operation.
  2. Resolve the original transaction_ref through the same persistence authority,
     using the configured commit-observation attempt/deadline budget.
  3. Durable:
       perform the declared linearizable authority read set;
       require the read barrier to observe the complete atomic write set;
       classify exact replay / completed effect / sidecar defect.
  4. NotDurable:
       perform the declared linearizable winner and owner reads;
       only an unchanged, absent, and non-winning owner set permits a new attempt;
       retain the original operation key and recompute no request body.
  5. Unknown or resolution error:
       repeat only within the observation budget;
       after budget exhaustion return CommitOutcomeUnknown.
```

`NotDurable` is an authority proof about the original transaction identity, not an observation that a row is currently absent. A different concurrent transaction may already own the normalized key or current owner, so the winner read is mandatory before a new attempt. `Durable` permits replay only after exact stored result / receipt / report / journal / capture symmetry is verified. `Unknown` never authorizes a new key, a blind replay, a rollback claim, or a zero-effect claim.

### 20.2 Job initial / target / final

| Unknown point | Required exact reads | Continue only when | Forbidden |
|---|---|---|---|
| initial UoW | idempotency bykey + journal bysamekey | bothabsent onlyafterauthoritative confirmed-not-durable；or`Reserved + matching Planned journal`resume | target start fromreservation-only；scope replan overexisting journal |
| target effect UoW | journal bykey；exact planned business/material owner andcapture whenplan declaresit | terminal journal outcome symmetric -> skip；all owners unchanged andauthoritative rollback confirmed -> retry Planned；otherwiseoperator/consistency path | infer success fromexternal return/request-local object；recordFailed beforeeffect status proven |
| target no-effect terminal UoW | journal bykey | target terminal -> skip；stillPlanned + rollbackconfirmed -> retryterminal journal write | overwriteanother terminal payload |
| final report UoW | idempotency、stored typed report/surface、journal | Completed + symmetric stored report + Finalized same ref -> replay；Reserved + allterminal unfinalized journal + no visible result afterconfirmed rollback -> purefinal retry | reprocess targets、report-by-run、generic bytes decode |

### 20.3 Outbound bind and trace handoff

| External/local unknown | Exact authority | Recovery |
|---|---|---|
| event collaborate outcome returned,bind commit unknown | capture+snapshot exact load andexternal stable intent semantics | `IntentBound`same intent ->`get`;`Captured`->repeat same candidate andbind same stable intent；asymmetry->consistency |
| trace handoff external result lost | original stored result or caller-submitted new Command against current exact trace | same-key original request onlyreplays anddoesnotcallthePort；new-key follows§19.1 andcreatesone newrevision beforeonepost-commit attempt；no evidence/delivery claim |

### 20.4 Step 14 authoritative-read contract

All recovery reads named in §§20.1~20.3 use the same configured local persistence authority that implements `resolve_commit`. The concrete adapter may use a primary status record, a driver recovery token, a consensus read index, or an equivalent product-neutral mechanism, but the design contract is the observable guarantee rather than a product choice:

| guarantee | required behavior | forbidden substitute |
|---|---|---|
| stable transaction identity | the copied `CapabilityTransactionRef` addresses the original attempt for the entire observation window | business id, normalized key, process memory pointer, newly generated transaction ref |
| linearizable authority read | winner / owner / sidecar reads cannot observe a pre-barrier state after `Durable` | read replica, cache, eventual projection, log search, sleep, elapsed-time guess |
| confirmed not-durable | `NotDurable` means the original attempt can never later become durable | one empty result, connection close, timeout, rollback request without confirmation |
| fake parity | deterministic fake exposes the same three outcomes and read barrier semantics | mapping every injected unknown to `NotDurable`, or skipping sidecar asymmetry checks |
| budget exhaustion | unresolved observation remains `CommitOutcomeUnknown` and is surfaced to the existing error mapper | retrying mutation, synthesizing a result, or changing the idempotency key |

The exact observation attempt count and phase deadline are technical policy inputs owned by Step 14; they are not part of the key, digest, journal, stored result, event candidate, or public issue literal.

## 21. Stored Surface and Outbound Envelope Integrity

### 21.1 Stored result surface

`CapabilityStoredResultDigest` hashes the exact immutable bytes stored in`CapabilityStoredResultSurface.serialized_surface`。Thedomain includesstored result kind andoperation。Before`StoredCapabilityOperationResult::from_surface` / repository save,theapplication must:

1. buildtheexact Step 8 public accepted/rejection/receipt/report DTO;
2. serializeonce throughStep14-bound deterministic protocol codec;
3. rejectempty bytes;
4. calculate`digest_stored_result_surface(kind,operation,bytes)`;
5. storebytes + digest + shell + typed envelope inthesame declaredUoW;
6. completeidempotency withthe same application result ref。

Onread,recompute fromthe stored bytes andexpected kind/operation beforetyped envelope mapping。A mismatch is`CodecFailure` orloaded`ConsistencyDefect(StoredResultShape)`；noalternative decoder、current DTO reserialization orcurrent-truth rebuild isallowed。Response-only duplicate disposition ismapped aftervalidation andisneverstored asa second surface。

### 21.2 Outbound complete envelope

`CapabilityEventCandidateDigest` hashes exactlythecomplete serialized`CapabilityOutboundEventEnvelope<T>`bytes,includingevent name、schema version、source ref、occurred time、trace、routing key andpayload。Thedomain repeatsclosed event name/schema。Snapshot andcapture storethesame digest；capture/snapshot read validates source、snapshot id、schema、digest、captured time andnon-empty bytes,whiletrace/bytes remain snapshot-owned。

Re-serializing thesame semantic DTO mustproducebyte-identicaloutput underthat schema version。Changingcodec representation requiresanewschema/domain andmustnotrewriteold snapshot bytes/digest。External collaboration receivesstored bytes/digest unchanged；it cannotre-encodebeforeformingstable intent identity。

---

## 22. Batch `13.5` 测试切口与最小验证清单

本节只定义 Step 16、`05-测试方案.md`和`06-验收标准.md`可直接承接的测试切口。下列测试均是设计义务，不表示已经执行、通过、产生覆盖率、evidence、run id或验收签署。每个切口必须使用本文件的exact type / variant / operation literal；不得用`active`、`ready`、`failed`、`conflict`等无owner shorthand替代。

### 22.1 Canonical operation、key与digest切口

| Test cut | exact scope | required assertion | prerequisite / status |
|---|---|---|---|
| `TC-CH-CANONICAL-OP-001` | 26 Command operation mappers | every closed `CapabilityCommandName` maps to exactly one `CapabilityOperationName` with `Command` channel；unknown、alias、case-folded、trimmed input returns `None` | planned; no execution claimed |
| `TC-CH-CANONICAL-OP-002` | 33 Query operation mappers | every closed `CapabilityQueryName` maps to routing identity only；no mapper path can construct an idempotency-key variant | planned |
| `TC-CH-CANONICAL-OP-003` | 6 Inbound consumer mappers | each consumer maps only to its declared source family；wrong family cannot form `InboundEvent` key | planned |
| `TC-CH-CANONICAL-OP-004` | 8 Job operation mappers | every closed `CapabilityJobName` maps to one `OperationsJob` namespace；trigger or handler alias is rejected | planned |
| `TC-CH-CANONICAL-KEY-001` | Command / Job `IdempotencyKey` adapter | operation namespace and variant tag remain part of repository identity；same raw core key under different operations cannot collide | design cut unblocked by the exact `as_str().as_bytes()` dependency assumption;no test result claimed |
| `TC-CH-CANONICAL-KEY-002` | Inbound key formation | source family + consumer operation + public source event ref are preserved; source-provided raw key alone cannot become repository identity | same dependency assumption;no test result claimed |
| `TC-CH-CANONICAL-KEY-003` | Query boundary | every 33 Query entry paths reject key formation and perform zero reserve/read of idempotency store | planned |
| `TC-CH-DIGEST-FRAME-001` | four digest families | frame magic, version, domain, field count, field tags, names, lengths and nested order are byte-stable; truncated or extra bytes fail closed | planned |
| `TC-CH-DIGEST-FRAME-002` | optional / sequence / enum values | `None` and present values, variant tags, empty sequences and ordered members produce distinct exact frames where semantics differ | planned |
| `TC-CH-DIGEST-FRAME-003` | numeric / string / id encoding | fixed-width big-endian integers, boolean bytes, validated UTF-8 and typed inner bytes are independent of platform width, locale and memory layout | planned |
| `TC-CH-DIGEST-DOMAIN-001` | domain separation | identical field bytes under request, candidate, stored-result and outbound domains produce different digests; changing domain version is incompatible | planned |
| `TC-CH-DIGEST-SURFACE-001` | 26 Command DTOs | each exact `canonical_request_field_bytes()` method writes only the Step 13 §11 fields in declaration order and returns `ContractValueError` for invalid field shape | 26 callable coverage; planned |
| `TC-CH-DIGEST-SURFACE-002` | 6 Inbound payloads | each exact method writes shared source authority plus payload fields in §12 order; source actor, transport offset and local event ref remain excluded | 6 callable coverage;core key bytes use the exact authorized accessor contract;no test result claimed |
| `TC-CH-DIGEST-SURFACE-003` | 8 Job input DTOs | each exact method writes schema plus stable input fields in §13 order; run id, cursor, generated ids and loaded truth remain excluded | 8 callable coverage; planned |
| `TC-CH-DIGEST-CANDIDATE-001` | 8 reference candidate families | candidate digest includes only the exact body-free field table in §9; secret, method, governance, runtime, SDK, audit and document bodies are rejected or excluded | planned |
| `TC-CH-DIGEST-REPLAY-001` | stored result and outbound envelope | reserializing the same schema version is byte-identical; stored bytes / snapshot bytes are verified before typed mapping or external collaboration | planned |

The 40 request-field callables are closed coverage, not a generic `digest<T>` allowance:

| family | exact callable count | exact owners |
|---|---:|---|
| Command | 26 | the 26 Command DTOs listed in Step 8 §6.10 and Step 13 §11 |
| Inbound | 6 | the 6 payloads listed in Step 8 §9.9 and Step 13 §12 |
| Operations Job | 8 | the 8 Job inputs listed in Step 8 §11.8 and Step 13 §13 |
| total | 40 | coverage must be `40 / 40`; no blanket serializer or application-local field reader |

### 22.2 Duplicate、reserve race与winner保护切口

| Test cut | scenario | exact assertion |
|---|---|---|
| `TC-CH-IDEM-RESERVE-001` | two fresh Command requests pass preflight absent and race atomic reserve | one `Reserved(Loaded<_>)` wins; loser rolls back and performs one bounded authoritative winner read; no second business id, resolver or domain call |
| `TC-CH-IDEM-RESERVE-002` | two fresh Inbound consumers race | one receipt/effect set commits; loser cannot write a receipt claiming the lost effect |
| `TC-CH-IDEM-RESERVE-003` | two fresh Job plans race | one reservation and complete Planned journal commit; losing request-local plan, ids and summaries are discarded |
| `TC-CH-IDEM-DUP-001` | Completed Command exact digest | immutable command surface is replayed; Clock, IdGenerator, domain, resolver, material scan and Port calls are zero |
| `TC-CH-IDEM-DUP-002` | Completed Inbound exact digest | typed receipt and effect refs are replayed; resolver, state mutation, capture and receipt write are zero |
| `TC-CH-IDEM-DUP-003` | Completed Job same operation/key/digest/run | typed variant-bound report is replayed; planning, target loop, journal mutation and Port calls are zero |
| `TC-CH-IDEM-CONFLICT-001` | same normalized key with different channel / operation / digest | `IdempotencyConflict` or closed channel mapping; winner record, version, trace and stored body remain unchanged and winner body is not exposed |
| `TC-CH-IDEM-CONFLICT-002` | same Job key and digest but different run id | conflict, not journal resume; no report read is used to leak the winner |
| `TC-CH-IDEM-INPROGRESS-001` | same request while transaction visibility proves active matching owner | `IdempotencyInProgress` or declared delayed surface; no second body execution and no state revision |
| `TC-CH-IDEM-ORPHAN-001` | committed Command / Inbound Reserved without terminal result | `ConsistencyDefect(IdempotencyStateShape)`; no ordinary in-progress loop, rerun or late completion |
| `TC-CH-IDEM-JOURNAL-001` | Job Reserved without symmetric Planned journal | `ConsistencyDefect(JobExecutionShape)`; no scope rescan, new journal or target start |
| `TC-CH-IDEM-STATE-001` | attempt to persist an unknown or removed Conflict state | adapter rejects the shape; no normalization to Reserved / Completed and no private conflict row |

### 22.3 CAS、unique、dependency fence与Job race切口

| Test cut | conflict resource | exact assertion |
|---|---|---|
| `TC-CH-CONC-CAS-001` | one mutable truth owner with two stale `Loaded.expected_version` values | exactly one save commits; loser receives `OptimisticConflict` after rollback; no last-write-wins |
| `TC-CH-CONC-UNIQUE-001` | two different idempotency keys create one formal current owner | unique winner is preserved; loser follows protocol-specific `UniquenessConflict`, not duplicate replay |
| `TC-CH-CONC-FENCE-001` | source successor races old-source material stale/update | old-source material cannot commit as fresh over a newer source; collect-before-mutate and per-source fence remain effective |
| `TC-CH-CONC-TRACE-001` | two trace successor requests use same previous revision | one contiguous revision wins; loser does not append a second revision under a stale predecessor |
| `TC-CH-CONC-CAPTURE-001` | two source flows use same `(source_ref,schema_ref)` | one immutable snapshot/capture wins; different bytes/digest is not silently merged |
| `TC-CH-CONC-BIND-001` | two binders race one Captured record | one `Captured -> IntentBound` CAS commits; loser exact-reloads and calls only `get(existing_intent)` |
| `TC-CH-CONC-TARGET-001` | two Job runners select same Planned ordinal | one effect + terminal journal outcome commits; loser preserves terminal winner and never repeats terminal side effect |
| `TC-CH-CONC-FINAL-001` | two runners assemble all-terminal Job final report | one final result ref links stored report, Finalized journal and Completed reservation; loser exact-replays or returns conflict |
| `TC-CH-CONC-RESULT-001` | same result ref with different serialized bytes/digest | insert-only store rejects mismatch; no overwrite and no current-truth reconstruction |
| `TC-CH-CONC-QUERY-001` | concurrent Query during source mutation / rebuild | Query remains no-write and returns only its declared read surface; it cannot repair, reserve or refresh |

### 22.4 Commit unknown、rollback与sidecar切口

| Test cut | injected point | exact assertion |
|---|---|---|
| `TC-CH-UNKNOWN-CMD-001` | Command commit response lost | same-key exact read decides Completed replay, active in-progress, absent only after authoritative not-durable proof, or consistency/unknown; no blind rerun |
| `TC-CH-UNKNOWN-IN-001` | Inbound receipt commit response lost | same event key and digest are inspected before resolver/effect; no duplicate receipt or quarantine overwrite |
| `TC-CH-UNKNOWN-JOB-001` | Job initial commit unknown | reservation and journal are read together; reservation-only state never starts targets |
| `TC-CH-UNKNOWN-TARGET-001` | target effect commit unknown | exact journal and declared owner/capture are read; success is never inferred from external return or request-local object |
| `TC-CH-UNKNOWN-FINAL-001` | final report commit unknown | symmetric Completed + Finalized report replays; Reserved + all-terminal Planned journal may retry pure assembly only after confirmed rollback |
| `TC-CH-ROLLBACK-001` | each required local sidecar fails before commit | entire declared local atomic set rolls back; no partial source, result, capture or completion remains |
| `TC-CH-ROLLBACK-002` | rollback itself fails | `TransactionRollbackFailed` / consistency visibility; design does not claim rollback success or write a business failure item |
| `TC-CH-SIDECAR-001` | Completed result shell missing surface / typed envelope | `ConsistencyDefect` or `CodecFailure`; no alternate decoder or current DTO reconstruction |
| `TC-CH-SIDECAR-002` | Captured capture missing immutable snapshot | consistency defect; no current source remapping and no second capture |
| `TC-CH-SIDECAR-003` | Finalized journal has Planned target or mismatched result ref | consistency defect; adapter does not normalize or auto-finalize |

### 22.5 Boundary-negative and parity切口

| Test cut | boundary | exact assertion |
|---|---|---|
| `TC-CH-BOUNDARY-001` | runtime / tools execution | no Command, Query, Consumer or Job calls runtime invocation, tool execution or result owner |
| `TC-CH-BOUNDARY-002` | marketplace / ecosystem | discovery material is read-only derived output; no listing, ranking, pricing or fulfillment write |
| `TC-CH-BOUNDARY-003` | governance / method-library | only body-free relation/ref/safe summary enters local digest/state; approval or method body is rejected |
| `TC-CH-BOUNDARY-004` | SDK | server exposure / consumer ref is local boundary; package, client, cache and publication state remain external |
| `TC-CH-BOUNDARY-005` | external collaboration | local capture owns only snapshot and stable intent binding; no local Delivered / retry / dead-letter state |
| `TC-CH-PARITY-001` | durable adapter vs fake | unique, CAS, cursor, digest, terminal, asymmetry, rollback and forbidden-body classifications are equivalent |
| `TC-CH-PARITY-002` | fake fixture construction | fake cannot create Completed without result, Job Reserved without Planned journal, IntentBound without intent or a terminal journal with Planned target |

No test cut in this section is an executed test result. Step 16 must convert each cut into fixtures, fault injection and exact assertions, then report execution separately.

---

## 23. 问题诊断、改动前后与设计取舍

### 23.1 关键问题与修正前后

| 设计面 | 修正前 / historical material | 当前 active contract | 直接影响 |
|---|---|---|---|
| operation identity | raw key、route、handler或`Debug`可被实现者自行拼接 | 73 closed operation literals；channel-aware `CapabilityOperationName`；40个write入口可形成key | 不同operation复用raw key不会碰撞；未知别名在entry拒绝 |
| normalized key | `IdempotencyKey`裸值可跨operation碰撞 | `Command` / `InboundEvent` / `OperationsJob`三variant，含闭合operation和Inbound source family/event ref | repository unique key具有稳定命名空间 |
| request digest | placeholder text / generic serialization | versioned length-delimited frame、domain separation、contracts-owned exact field writer、SHA-256 carrier | digest可复算且不依赖JSON map、Debug、Display或内存布局 |
| idempotency state | `Reserved / Completed / Conflict`与reason field并存但Conflict无current owner | `Reserved / Completed`；mismatch是zero-write application observation | 不会破坏首个Reserved winner或覆盖Completed result |
| reserve loser | Job递归调用自身入口 | rollback、discard local plan、一次authoritative winner classification | 没有无界递归、重复扫描或重复生成id |
| Command / Inbound Reserved | error surface容易暗示持久化partial owner | 只有事务可见的active owner可返回`IdempotencyInProgress`；committed orphan是consistency defect | recovery不会把孤儿当业务重入点 |
| Job reentry | scope / run scan可能被实现者当恢复依据 | normalized-key journal + exact run/digest symmetry + first Planned target | target、report和source不会从current truth重构 |
| trace handoff retry | new key可能零revision继续调用外部handoff | new key必须追加一个`HandoffPending` revision，再post-commit调用一次 | local trace保留每次明确请求的范围边界 |
| Query duplicate | generic replay或inline refresh风险 | 33 Query严格resolver-first/no-write；重复读取重新评估当前授权surface | 不产生幂等记录、stored result或隐藏修复 |
| Outbound duplicate | source re-mapping或local delivery status复制 | immutable snapshot + capture + stable intent；IntentBound只get | 不形成第二snapshot、第二intent或本地delivery lifecycle |
| stored surface | Completed pointer可能被当作可重算提示 | shell/surface/typed envelope/digest/result ref同UoW并逐读校验 | missing/asymmetric sidecar显式失败 |

### 23.2 设计取舍

1. **选择 operation-namespaced key，而不是 raw-key hash。** 这样可直接表达跨operation隔离，代价是依赖 core `IdempotencyKey` 的稳定inner bytes；该依赖现按§24.3的显式用户授权假设闭合，L0-core正式设计同步保留为非阻塞债务。
2. **选择 contracts-owned field encoding，而不是 application 反射或通用序列化。** DTO 私有字段的语义 owner能够固定字段顺序和变体标签，代价是40个exact callable需要逐一维护并在schema变化时显式更新。
3. **选择两态幂等记录，而不是冲突状态。** 冲突是请求观察结果，不是首个执行的生命周期；代价是冲突可观测性必须交给 Step 15，不能在winner row中写一条方便但无owner的状态。
4. **选择 Job journal 作为唯一重入事实，而不是 lease / checkpoint / run index。** 这保证实现面小且可审计，代价是每个target和final phase必须严格保存typed计划、CAS和sidecar对称性。
5. **选择 bounded exact-read recovery，而不是隐藏 retry loop。** 应用服务不会吞掉无界CAS重试；retry count/backoff/config由Step 14绑定，语义错误和consistency defect保持可见。
6. **选择 snapshot + capture 作为Outbound pre-intent durability，而不是local outbox。** 这闭合崩溃窗口但不解决外部delivery所有权，避免Capability Hub越界成为publisher产品。

### 23.3 当前复杂度与实现风险

| 复杂度面 | active contract | 后续绑定位置 |
|---|---|---|
| 40 canonical request encoders | exact field ownership、frame、domain、hash、typed carrier均已定义 | Step 14选择codec/hash crate并验证L0-core accessor |
| 638 state pairs | Step 10已分类为239 current + 98 reserved + 301 illegal | Step 16按owner和phase形成测试，不重新发明state |
| cross-store atomicity | Command/Inbound local set、Job initial/target/final、capture bind membership已固定 | Step 11 physical transaction binding；不能降级为best-effort |
| external effect uncertainty | resolver/handoff/collaboration结果不可rollback，local capture/journal authority已固定 | Step 14 timeout/effect binding、Step 15 visibility |
| implementation evidence | 本Step只有未来切口，无真实运行事实 | Step 16/05/06单独产生结果，禁止在本文伪造 |

---

## 24. Historical Material、专项边界与上游阻塞审计

### 24.1 Historical material隔离

| material | conflict | current treatment |
|---|---|---|
| 旧正式`03-详细设计.md` | `ProviderContract`、`CapabilityDecision`、`CostRecord`、runtime gateway、KMS/Vault、policy refresh、local outbox与provider route被当作current owner | 只作historical input；不进入key、digest、state、Port、store或recovery authority |
| `README.md` | “provider contract / whitelist / cost / runtime must-pass hub / marketplace”与当前identity/registry/exposure边界冲突 | 保留为historical_material；不作为Step 13字段或retry语义来源 |
| 旧`05 / 06` | 旧测试/验收可能包含真实evidence、sign-off或runtime performance claims | 不继承测试结果、evidence alias、签署或验收事实；Step 16/05/06重新定义 |
| restart predecessor calibration | 旧计数、旧批次状态和旧流程不满足当前full-restart停审纪律 | 当前Step 6~13 calibration与ledger是恢复权威；旧版本只作差异审计 |
| sibling implementation `/home/aris/Projects/quantalithos-core/.../metadata.rs` | 实现中存在`IdempotencyKey::as_str`,但未被L0-core正式设计声明 | 保留为historical evidence pointer；2026-07-18用户显式授权Capability Hub采用该现有导出签名，不得反向声称L0-core正式设计已经同步 |

### 24.2 Capability Hub owner boundary audit

| boundary | allowed current material | forbidden merge | result |
|---|---|---|---|
| capability identity / registry | identity, review, registry lifecycle, body-free source and current indexes | runtime principal, invocation authorization, marketplace listing | pass |
| external MCP / A2A / API | source family, locator, descriptor, safe summary, canonical reference state | request/response body, session, execution result, provider health | pass |
| governance approval | body-free result ref, seam relation, typed safe summary | approval decision, vote/workflow, Policy truth | pass |
| method-library asset | body-free method ref/relation and digest candidate | method body, source code, publication lifecycle | pass |
| SDK exposure | formal server boundary, visibility, SDK consumer ref | package/client/cache/publication state | pass |
| runtime/tools | consumer reference, controlled view, impact handoff | invocation, tool result, route/quota/cost/enforcement | pass |
| marketplace/ecosystem | read-only discovery summary | listing, ranking, pricing, transaction, fulfillment | pass |
| external collaboration | immutable snapshot, local capture, stable intent binding | local Delivered/Failed retry lifecycle, outbox, dead-letter | pass |

### 24.3 Historical blocker resolution and dependency assumption

`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` was correctly diagnosed as an upstream design blocker because the L0-core formal design does not declare a canonical accessor. The diagnosis remains in this artifact and is not rewritten as though L0-core had changed.

On 2026-07-18, the user explicitly authorized removing the progression restriction and entering the next Step. Capability Hub therefore resolves this project-local blocker as `resolved_by_explicit_user_authorized_dependency_assumption` under the following exact contract:

1. The consumed signature is the existing exported `IdempotencyKey::as_str(&self) -> &str`.
2. Canonical bytes are exactly `idempotency_key.as_str().as_bytes()`, using the returned string's original UTF-8 bytes.
3. No trim, case folding, Unicode normalization, `Display`, `Debug`, blanket `Serialize`, transport JSON or raw memory representation is permitted.
4. Capability Hub does not define a replacement key type and does not claim that L0-core formal design has already adopted this contract.
5. `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001` remains a non-blocking cross-repository design debt: L0-core formal contracts should record the exported accessor and byte-preserving semantics.
6. If the actual exported signature, value preservation or UTF-8 byte semantics changes, Step 13 must reopen before implementation or later design assembly may proceed on the changed dependency.

This explicit dependency assumption is sufficient to complete Step 13 and enter Step 14. It does not constitute an implementation test, upstream acceptance, evidence alias or cross-repository sign-off.

---

## 25. Step 6~12 Cross-step Closure Audit

### 25.1 Cardinality and declaration baseline

| baseline | active result after Step 13.5 sync | audit rule |
|---|---|---|
| HLD business objects | 43 | unchanged; no runtime, marketplace, approval or method-body object added |
| application technical helpers | 7 | idempotency, stored result, visibility, snapshot/capture and Job journal owners remain unique |
| application-owned Ports | 36 | no new Port for digest, retry, conflict telemetry or checkpoint |
| repository traits / methods | 22 / 110 | save/reserve/replay/capture/journal surface reused; no private finder |
| protocol public types | 250 | Step 13 adds callable contracts only; no DTO, envelope or protocol type |
| independent protocols / flows | 83 / 83 | 26 Command + 33 Query + 6 Inbound + 10 Outbound + 8 Job |
| state-like enum types / active variants | 24 / 111 | one removed idempotency Conflict variant; type count unchanged |
| ordered state pairs | 638 | `239 current + 98 reserved + 301 illegal`, `unclassified = 0` |
| ApplicationError / issue codes | 17 / 51 | public conflict and in-progress semantics retained; no new error taxonomy |

### 25.2 Per-step closure matrix

| source Step | exact Step 13 consumption | closure result |
|---|---|---|
| Step 6 object contracts | operation context, idempotency record, stored result, snapshot/capture, Job journal, state and field Rustdoc | two-state idempotency and canonical carriers synchronized;no missing owner;core accessor consumed under the explicit dependency assumption in §24.3 |
| Step 7 Port / repository contracts | atomic reserve, `Loaded.expected_version`, typed result reads/writes, capture bind, Job journal CAS | every Step 13 call points to an existing Port/repository method; no hidden retry store or finder |
| Step 8 protocol contracts | exact 40 write DTO field lists, 33 Query no-write cards, 10 outbound envelopes, typed replay surfaces | canonical field coverage `40 / 40`; Query and Outbound excluded from request idempotency; 83 protocol coverage unchanged |
| Step 9 function flows | shared Command/Inbound/Job guards, 83 transaction phases, Outbound capture continuation, Job target/final flow | no recursive Job reserve-race entry; all winner/reentry paths have bounded exact-read behavior |
| Step 10 state matrix | Reserved/Completed, Planned/Finalized, target outcomes, capture and external status boundaries | `638` arithmetic synchronized; no persisted Conflict state; current/reserved/illegal classifications unchanged outside idempotency removal |
| Step 11 persistence | atomic local sets, CAS tokens, unique indexes, crash visibility, durable recovery authority | Command/Inbound orphan and Job journal asymmetry rules synchronized; save remains `Reserved -> Completed` only |
| Step 12 error/recovery | `IdempotencyConflict`, conditional `IdempotencyInProgress`, `ConsistencyDefect`, `CommitOutcomeUnknown`, rollback and typed surface mapping | public error identity preserved; no persisted conflict implication; exact durable authority precedes retry |

### 25.3 Truth-source and phase closure

```text
fresh Command / Inbound:
  canonical DTO bytes -> digest -> atomic reserve -> declared local effect
  -> stored typed surface -> Reserved -> Completed -> commit

fresh Job:
  canonical input bytes -> digest -> Reserved + complete Planned journal
  -> one target UoW per ordinal -> pure final assembly
  -> stored typed report + Finalized + Completed same result ref

Outbound:
  committed source + immutable envelope snapshot + Captured
  -> post-commit external intent/outcome
  -> short CAS bind to IntentBound,or exact repair continuation

Query:
  resolver-first typed read -> response surface
  -> zero UoW / reserve / stored-result / capture / external collaboration writes
```

Any implementation that cannot preserve one of these phase sets must reopen the owning Step; it may not silently use last-write-wins, best-effort sidecars, current-truth replay, local outbox or private checkpoint.

---

## 26. 正式 `03-详细设计.md` §12 Assembly Source

本节是 Step 19 正式装配源，不是正式文档正文。正式`03-详细设计.md`在Step 19之前保持未修改。装配时不得把batch状态、用户确认、blocker历史、测试结果或实现commit写入正式章节。

### 26.1 Normative chapter structure

```markdown
## 12. 并发、幂等与重入保护

### 12.1 并发控制层级与资源顺序
### 12.2 Command / Inbound / Job 幂等键
### 12.3 Canonical request / candidate / result / event digest
### 12.4 Duplicate、reserve race与winner preservation
### 12.5 Query no-write与Outbound capture identity
### 12.6 Commit unknown、rollback与sidecar recovery
### 12.7 Job target / final reentry and trace handoff boundary
### 12.8 Concurrency、idempotency、reentry test-cut handoff
### 12.9 Owner boundary、consistency defect与implementation red lines
```

### 26.2 Formal opening source

Step 19可调整中文排版，但必须保留以下语义:

```text
Capability Hub uses operation-namespaced idempotency identity for 26 Command, 6 Inbound Event Consumer and 8 Operations Job entries. The 33 Query protocols never create an idempotency record, and the 10 Outbound protocols use immutable source/schema capture identity rather than request idempotency.

All request, reference-candidate, stored-result and outbound-envelope digests use one versioned length-delimited canonical frame with domain separation. Exact DTO and candidate field encoding belongs to capability-hub-contracts; application adds the outer frame and hash but may not inspect private contract fields or substitute Debug, Display, JSON map order or blanket serialization.

Completed duplicates replay only the matching immutable stored result, typed receipt or variant-bound Job report. A mismatch is a zero-write IdempotencyConflict observation. A transaction-visible active Reserved owner may map to IdempotencyInProgress; a committed Command / Inbound orphan Reserved or an asymmetric Job journal is a ConsistencyDefect. A Job resumes only from its normalized-key Planned journal.

Mutable owners use exact Loaded.expected_version, conditional uniqueness and dependency fences. Outbound recovery uses immutable snapshot + local capture + stable external intent; external delivery status is not a Capability Hub state. Commit outcome unknown, rollback failure, missing sidecar and consistency defect never authorize blind retry or reconstruction from current truth.
```

### 26.3 Required exact coverage index

| formal subsection | calibration source | mandatory coverage |
|---|---|---|
| 12.1 | §§15~17 | control hierarchy, canonical multi-resource order, 26 Command / 6 Inbound / 8 Job / 10 Outbound resource matrices |
| 12.2 | §§7, 11~13 | all 40 key-bearing write entries, operation namespaces, Job run fence and key window |
| 12.3 | §§8~9, 21 | frame grammar, four domains, 40 request encoders, 8 candidate encoders, stored/snapshot integrity |
| 12.4 | §18 | Completed exact replay, mismatch, reserve race, active in-progress and winner immutability |
| 12.5 | §14 | all 33 Query no-write rules and 10 Outbound capture identity / stable intent rules |
| 12.6 | §19~20 | Command/Inbound/Job/Outbound commit-unknown algorithms, rollback and sidecar classification |
| 12.7 | §19, 20 | Job first Planned target, all-terminal final assembly, trace handoff one-revision rule |
| 12.8 | §22 | future tests for canonical bytes, CAS, unique, fence, duplicate, race, rollback, unknown and boundaries |
| 12.9 | §§23~25 | owner boundaries, historical exclusion, 43/7/36/22/110/250/83/111/638 baseline and red lines |

The formal chapter must retain named coverage and exact callable references. It may point to this calibration artifact for full matrices, but it may not replace them with “other protocols are similar”.

### 26.4 Formal assembly checks

| check | required result |
|---|---|
| exact key coverage | 26 Command + 6 Inbound + 8 Job = 40; Query and Outbound are explicitly excluded from request-key table |
| exact digest coverage | four digest carriers, four domains, frame grammar, 40 request encoders and 8 candidate encoders searchable |
| state coverage | only `Reserved / Completed` for idempotency; `Planned / Finalized` Job journal; no persisted Conflict state |
| replay authority | stored result / receipt / report, capture + snapshot + intent, normalized-key journal are the only recovery sources |
| concurrency coverage | every current mutation row names unique/CAS/fence/journal control and loser result |
| no-write coverage | all 33 Query protocols and all duplicate paths have zero forbidden write/call assertions |
| owner boundary | runtime/tools, marketplace, governance approval, method body, secret body, SDK package and external delivery status remain outside local truth |
| source annotation | formal §12 points to this calibration file and exact sections |
| truthfulness | no implementation commit, run id, test result, evidence alias or acceptance signature |

---

## 27. Step 13.5 Completion Gate、授权解阻与恢复点

### 27.1 Batch `13.5` gate

| gate | result | evidence |
|---|---|---|
| SOP three required outputs | pass | §§16~18 provide concurrency, idempotency-key/digest and reentry matrices |
| 40 write-entry key/digest coverage | pass as design coverage | §§11~13 and §22; no execution result claimed |
| 33 Query no-write boundary | pass | §14.1 and §22.5 |
| 10 Outbound capture identity | pass | §14.2, §§19~21 and §22.4 |
| duplicate / mismatch / in-progress / orphan distinction | pass | §§10, 18, 20 and §24.3 |
| Job reserve-race recursion removal | pass | Step 9 synchronized eight Job branches; §7.3 and §22.2 |
| canonical frame / field ownership | pass as design contract | §§8~9, §22.1;core accessor uses the exact user-authorized assumption in §24.3 |
| Step 6~12 cross closure | pass | §25; active baseline `43 + 7`, `36`, `22 / 110`, `250`, `83`, `111`, `638` |
| historical / owner boundary audit | pass | §24 |
| formal §12 assembly source | pass | §26; formal `03` unchanged |
| structure / field / variant / callable Rustdoc | pass | this batch adds no Rust declaration; existing modified surfaces retain English `///` |
| implementation artifacts | pass | no implementation ledger, planned boundary skeleton, source, migration, run, evidence or test result |
| core canonical accessor dependency | pass by explicit user-authorized dependency assumption | original diagnosis retained;`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` resolved project-locally and formal L0-core sync retained as non-blocking debt |
| Step 14 commit-resolution sync | pass | existing UoW manager three-state resolution、linearizable authority read、barrier and budget-exhaustion rules are consumed without changing 40 key/digest rows or 83 flows |

### 27.2 Current completion state

```text
current_document = 03-详细设计.md
current_step = 13
current_batch = 13.5
gate_status = 03_step_13_completed_with_step_14_commit_resolution_sync
step_13_status = completed
formal_03_modified = false
step_13_artifact_created = true
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001
next_allowed_action = follow_current_Step_14_batch_gate
```

Step 13.5 的本仓设计产物已写完。随后在Step 14 batch `14.2`完成最小commit-resolution受控同步：该同步不修改L0-core正式设计、不新增repository trait或protocol，只固定既有UoW manager三态resolution和同一authority的recovery read语义。正式`03-详细设计.md`仍留Step 19装配，`04`和implementation artifacts均未创建。

### 27.3 Commit and evidence gate

```text
commit_required = false
commit_created = false
run_id_claimed = false
test_executed = false
evidence_alias_claimed = false
acceptance_signed = false
```

上述字段是设计台账状态，不是实现或验收证据。
