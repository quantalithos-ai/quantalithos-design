# L4-observability 03-详细设计 Step 06 - R06.6-C application external effect intent / binding / token 对象契约

> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 上游输入: `design-calibration/03_ddd_step_06_application_input_boundary.md`
> 前置对象卡: `design-calibration/03_ddd_step_06_application_operation_context_idempotency.md`、`design-calibration/03_ddd_step_06_application_stored_result_outbox.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 当前模式: full-restart 定向粒度修复
> 当前子批次: `R06.6-C`
> 专项完成状态: `R06.6-C_done_confirmed_historical_checkpoint`
> 当前整体恢复点: `R06.6-F1-W3_done_waiting_user_before_F2`

## 1. 子批次状态与写入门禁

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application::runtime`、`application::external_effects`、`contracts::refs` affected owner closure |
| 上游停审点 | `R06.6-B_done_waiting_user`；用户已明确确认继续，允许进入 C 批 |
| 本批覆盖 | opaque external binding identity、finite effect phase、publication token、handoff/export prepare/deliver token、durable tagged intent、stable probe/result carrier |
| 本批不覆盖 | job plan/item/claim/fence/config snapshot、application service facade、repository/port trait、逐 flow retry、配置 key/default、Step 07 及正式 `03` |
| 正式回填 | blocked；D~E与F1已完成design-only，仍必须等待F2、R06.7、R06.8与Step 19重装配 |
| 本专项历史 gate_status | `R06.6-C_done_waiting_user`；已由用户确认并被D-1消费 |
| 当前整体 gate_status | `R06.6-F1-W3_done_waiting_user_before_F2` |
| 当前允许动作 | 等待用户确认进入F2；未经明确确认不得读取或写入F2对象契约 |
| 外部上游 blocker | `none` |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`；`R06.6-DISPOSITION-LAYER=resolved_in_E_design_only`；`R06.6-APP-EXT-OWNER=resolved_in_C`；`R06.6-JOB-CONFIG-OWNER=resolved_in_D4`；`R06.6-APP-ERROR-OWNER=resolved_in_E_design_only`；`R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`；`R06-F-AFFECT-UOW-01=open_controlled` |
| 是否修改正式 `03` | 否 |
| 是否需要提交 | 不需要；本批只修改设计仓中间产物和台账 |

### 1.1 写入前检查

| 检查项 | 结论 |
|---|---|
| 项目级门禁 | 用户已确认从 B 批进入 C 批；不得进入 D 批或其他正式文档 |
| 文档级门禁 | `03_ddd_calibration_flow.md` 继续冻结 Step 07~19 与 formal assembly |
| Step / 模块门禁 | 只闭口 application stable external-effect carrier；不写 port、DTO、flow、logical store 或配置项 |
| 逐对象要求 | 每个有独立字段、variant、validation、wire/public responsibility 或 durable responsibility 的类型必须有独立卡 |
| 历史材料处理 | 主控旧 token family、冻结 Step 07/11/13/14 只作 repair input / use-site，不是 current definition source |
| external truth 边界 | token、intent、probe/result 只表达本地调用协调事实；不得表达外部业务 truth、验收、signoff 或 final verdict |
| 正式正文污染 | `no`；本批不修改 `03-详细设计.md` |

## 2. 本批输入与权威顺序

| 输入 | 读取范围 | 本批用途 | 权威限制 |
|---|---|---|---|
| `project_execution_ledger.md` / `03_ddd_calibration_flow.md` | current pointer、blocker、停止规则 | 恢复与门禁真相源 | 不从历史 checkpoint 推断当前进度 |
| `03_ddd_step_06_application_input_boundary.md` | §§2~11 | C 批 capability、inventory、owner conflict | inventory 不替代对象卡 |
| A 批对象卡 | §§1~12 | `IdGeneratorPort` consumer、operation/job input owner | 不重定义 operation/context/idempotency |
| B 批对象卡 | §§1~29 | immutable outbox snapshot、publication receipt/failure、four public refs | publication token 必须逐字段复制 B 批 snapshot/record |
| `03_ddd_step_06_contracts_carriers.md` | typed ref / digest / schema owner | 复用 `BodyFreeRef`、`DigestSummary`、`SchemaVersion` 与 public refs | 不把 contracts 变成 lifecycle owner |
| R06.3 / R06.4 current对象卡 | evidence input、handoff、peripheral/export refs/objects | handoff/export token 字段来源 | 不把 application token 变成 domain state |
| 正式 `02-概要设计.md` | outbox、handoff、export、no-write、body-free 边界 | 直接上游语义 | 不提供 Rust-facing完整 schema |
| 冻结 Step 07 | publisher/handoff/export port use-site | 反查 missing carrier 与函数入参/返回 | port 文件不得拥有 Step 06 stable object |
| 冻结 Step 11 | intent-before-call、logical store、same-binding invariant | 反查 durable shape | 不在本批写 repository/table/CAS API |
| 冻结 Step 13 | stable token、probe、phase reentry | 反查 immutable equality 与 retry redline | 不在本批定义 retry policy/claim/fence |
| 冻结 Step 14 | application runtime binding vocabulary与infra raw config | owner conflict 诊断 | raw locator/config shape仍归 infra/Step 14/`04` |
| L1-governance / L1-artifact Step 06 / 07 | non-core object card 与 port handoff 粒度 | 只参考组织深度 | 不复制相邻域 truth |

### 2.1 权威冲突与当前裁定

| 冲突 / 缺口 | 当前裁定 |
|---|---|
| Step 14 同时定义 `ExternalEffectBindingRef` | canonical object owner 回到 Step 06 `application::runtime`；Step 14 只定义 raw config 到 validated application value 的派生与 catalog assembly |
| Step 13 同时定义 `ExternalEffectIntentRef` 和五类 token | current canonical definition 回到本文件；Step 13 只消费并定义 reentry/probe policy |
| Step 07 同时定义三类 probe outcome | probe outcome 是 stable application carrier，回到本文件；Step 07 只在 port signature 中引用 |
| Step 11 要求 durable intent，但 Step 06 只有 ref/token | 新增 `ExternalEffectIntent` tagged immutable wrapper；repository不得从 nullable columns或effect kind string猜 token variant |
| Step 11 logical store 写有 intent `state` / CAS | 不建立第二套 lifecycle；intent 本体 append-once immutable，local Prepared/Delivered/Failed 状态仍归 `ReportHandoffRecord` / `ExternalAuditExportPreparation` / `PeripheralDeliveryState` / job item/report。该旧 `state/CAS` 口径登记 affected correction |
| `HandoffDeliveryPreparationRef` 被 public Job output 与 token 使用但无 Step 06 owner | canonical declaration补入 `contracts::refs`；application id generation / adapter result validation拥有新值来源，contracts不拥有外部准备事实 |
| `HandoffDeliveryPreparation`、`HandoffDeliveryReceipt`、`PeripheralExportPackage` 只在 Step 07 port出现 | 它们是跨 adapter/application 的 stable body-free result carrier，本批闭口；不得由 port 文件临时定义 |
| `ObservationOutboxSnapshotInput<T>` 引用 application-only binding | 该 helper 后续 affected review 移回 application outbox builder；它不是 contracts public DTO，不能迫使 binding ref 上提到 contracts |
| publication 是否也创建 `ExternalEffectIntentRef` | 不创建；publication stable identity落在 committed outbox record/snapshot，伪造 intent ref 会产生双重 durable owner |

## 3. SOP 问题回答

### 3.1 本批需要完成哪些 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续承接 |
|---|---|---|---|---|
| freeze product-neutral binding | validated application catalog entry | `ExternalEffectBindingRef` + exact phase/family metadata | no external call；new work only | Step 14 catalog；Step 07 resolver/adapter preflight |
| construct publication identity | committed outbox record + exact payload snapshot | immutable `ObservationPublicationToken` | zero write；token derived, not separately persisted | Step 07 publisher；Step 13 retry/probe |
| persist handoff/export effect intent | prepared local owner + exact binding + material digest + generated intent ref | one of four immutable tokens wrapped by `ExternalEffectIntent` | append before external call | Step 07 intent repository；Step 11 UoW |
| validate preparation result | matching preparation token + adapter result ref/digest | `HandoffDeliveryPreparation` or `PeripheralExportPackage` | external call remains outside DB UoW | Step 07 ports；Step 09/11 local finalize |
| construct delivery identity | committed preparation/package identity + original binding | immutable delivery token | append before delivery call | Step 13 reentry/probe |
| classify probe result | exact stable token + adapter probe mapping | typed four-way outcome | read-only；Unknown/Unsupported are non-negative | Step 07 adapter；Step 12/13 recovery |

本批不拥有 destination locator、topic、endpoint、credential、provider response body、external acceptance、consumer truth、audit verdict、real run id、真实 evidence alias 或 signoff。`Prepared` / `Delivered` probe result只表示 adapter 对同一 stable token 返回了可验证的 body-free result carrier；本仓业务状态仍需短 UoW 内重新加载并提交。

### 3.2 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 不承接的功能 / 禁止事项 |
|---|---|---|---|
| `ExternalEffectBindingRef` | immutable destination + external idempotency namespace revision identity | application runtime value object | 不包含 locator/credential，不执行 catalog lookup |
| `ExternalEffectPhase` | finite external effect phase | application runtime enum | 不表示 domain/job/publication state |
| `ExternalEffectIntentRef` | one planned handoff/export phase identity | application external-effect typed ref | 不等于 job execution、attempt、external run id |
| `HandoffDeliveryPreparationRef` | public identity of one body-free handoff preparation | contracts typed ref | 不等于 handoff、intent、receipt 或 signoff |
| five token structs | exact stable call identity | immutable application value object | 不持有 attempt/claim/clock/current route |
| `ExternalEffectIntent` | durable tagged token landing | append-once application object | 不建立第二状态机、不调用 adapter |
| preparation/receipt/package carriers | exact body-free adapter result | immutable application value object | 不保存 provider body或外部业务结论 |
| three probe enums | four-way read-only probe classification | application result enum | Unknown/Unsupported 不得降级为 Not* |

### 3.3 当前 Step 6 闭口 / defer 决策

| 对象组 | 当前 Step 6 是否闭口 | 若 defer 的理由 | 后续承接 Step |
|---|---|---|---|
| binding ref / phase / token / intent / result / probe | 是 | 已是 application/runtime 唯一稳定 carrier，后推会迫使 Step 07/11/13 临时补对象 | 本文件 current owner；后续只消费 |
| `ExternalEffectBindingSubject` / entry / catalog | 否，具名 defer | 需要与完整 runtime config、capability、timeout 和 config snapshot共同闭口 | R06.6-D config snapshot affected input；R06.7 / Step 14 |
| repository / publisher / handoff / export port | 否 | trait/transaction/adapter capability属于 Step 07/11 | Step 07 / Step 11 |
| retry interval、attempt count、backoff、probe capability config | 否 | runtime policy/config，不是 object invariant | Step 14 / `04` |
| local handoff/export lifecycle | 已在 R06.4 闭口 | owner为 domain objects，C 批只构造外部效果协调 carrier | R06.4；Step 10 state matrix |

## 4. 当前文档问题诊断与改动前后对比

| 诊断项 | 修复前 | C 批目标 |
|---|---|---|
| binding owner | Step 06 / Step 14 双重声明 | `application::runtime` 唯一 object owner；Step 14只派生/装配 |
| token owner | 主控/Step 13/Step 07重复代码块 | 本文件唯一 current declaration；后置文件降为 use-site |
| durable intent | 只有 ref + prose logical row | exact tagged immutable object；无 nullable union猜测 |
| intent lifecycle | logical store含模糊 `state/CAS` | append-once token landing；lifecycle仍归 owning domain/job object |
| preparation public ref | public DTO使用但无声明 | `contracts::refs` 独立卡与唯一 mint/use boundary |
| adapter results | port signature引用悬空类型 | preparation/receipt/package逐对象字段与匹配函数闭口 |
| probe semantics | 三处重复四态 enum | 三个独立 enum current owner；Unknown/Unsupported fail closed |
| file layout | application仅有`idempotency.rs` | R06.8补 `runtime.rs` / `outbox.rs` / `external_effects.rs`，本批先固定逻辑 owner |

## 5. C 批对象总账与写入批次

### 5.1 对象资格总账

| ID | 对象 | 资格 | canonical owner | 本批责任 |
|---|---|---|---|---|
| C01 | `ExternalEffectBindingRef` | FC | `application::runtime` | validated opaque ref、rehydrate、no-locator invariant |
| C02 | `ExternalEffectPhase` | FC | `application::runtime` | five finite phases、token compatibility |
| C03 | `ExternalEffectIntentRef` | FC | `application::external_effects` | generated local intent identity |
| C04 | `HandoffDeliveryPreparationRef` | TC | `contracts::refs` | public preparation identity与application mint/use |
| C05 | `ObservationPublicationToken` | FC | `application::external_effects` | exact outbox/snapshot derivation |
| C06 | `HandoffPreparationToken` | FC | `application::external_effects` | handoff/input/consumer/binding/material equality |
| C07 | `HandoffDeliveryToken` | FC | `application::external_effects` | preparation-bound delivery identity |
| C08 | `ExportPreparationToken` | FC | `application::external_effects` | export preparation/view/consumer binding |
| C09 | `ExportDeliveryToken` | FC | `application::external_effects` | delivery/preparation same-binding identity |
| C10 | `ExternalEffectIntent` | FC | `application::external_effects` | four-token tagged append-once durable object |
| C11 | `HandoffDeliveryPreparation` | FC | `application::external_effects` | exact body-free preparation result |
| C12 | `HandoffDeliveryReceipt` | FC | `application::external_effects` | exact body-free delivery receipt |
| C13 | `PeripheralExportPackage` | FC | `application::external_effects` | exact body-free package identity/digest |
| C14 | `PublicationProbeOutcome` | FC | `application::external_effects` | publication four-way probe result |
| C15 | `ExternalPreparationProbe<T>` | FC | `application::external_effects` | preparation four-way generic result |
| C16 | `ExternalDeliveryProbe<T>` | FC | `application::external_effects` | delivery four-way generic result |

### 5.2 分批写入状态

| 写入批次 | 覆盖范围 | 状态 | 停审点 |
|---|---|---|---|
| C-1 | §§1~5 状态、输入、冲突、capability、对象总账 | done | owner / inventory gate |
| C-2 | C01~C04 binding / phase / identity | done | identity and dependency gate |
| C-3 | C05~C09 five token cards | done | token equality gate |
| C-4 | C10 durable intent | done | append-before-call gate |
| C-5 | C11~C16 result/probe cards | done | result/probe gate |
| C-6 | cross-object closure、affected-use、回填草稿、blocker、静态检查、门禁 | done | `R06.6-C_done_waiting_user` |

## 6. `ExternalEffectBindingRef` 对象卡

### 6.1 Rust-facing definition

```rust
/// Opaque immutable revision of one external destination and its idempotency namespace.
#[repr(transparent)]
pub struct ExternalEffectBindingRef(BodyFreeRef);
```

| field / property | source | validation and boundary |
|---|---|---|
| private inner ref | validated runtime configuration derivation | exact `BodyFreeRef`; identifies one immutable adapter-family + destination + external idempotency namespace revision |
| canonical owner | `application::runtime`; planned file `crates/application/src/runtime.rs` | application services, outbox snapshots, plans, intents and tokens may depend on it; contracts/domain do not |
| creation authority | infra config validator derives a new revision identity only after validating a complete raw binding; application receives the validated value | application cannot mint from endpoint/topic/consumer string; config reload cannot reuse the ref for a changed destination/namespace |
| rehydrate authority | persisted application snapshot/plan/intent decoder | validates opaque ref only; resolver existence/capability remains a Step 07/14 port concern |

| factory / member | exact signature | contract / failure |
|---|---|---|
| wrap validated revision | `pub fn try_from_validated_revision(value: BodyFreeRef) -> Result<Self, ApplicationError>` | exposed for the infra config validator that implements the composition boundary; validates the opaque value but cannot verify raw binding completeness by itself |
| rehydrate | `pub fn try_rehydrate(value: BodyFreeRef) -> Result<Self, ApplicationError>` | public for the infra persistence mapper; rejects invalid/missing persisted token through the future canonical consistency category |
| borrow / consume | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`; `pub fn into_body_free_ref(self) -> BodyFreeRef` | typed opaque access only; no locator resolution |
| equality | ordinary exact value equality within the same wrapper | equality proves same revision identity, not current health, external acceptance or adapter existence |

`ExternalEffectBindingRef` never exposes or parses endpoint、topic、route、path、credential、provider account、product name or adapter config body. Credential rotation may retain a ref only when destination and external idempotency namespace remain identical and every retained token remains resolvable. Any destination, route/target or idempotency-namespace change requires a new ref; old retained refs cannot be rebound to the new target.

The value is application-owned rather than contracts-owned because it never appears in public transport DTO or domain truth. The frozen `ObservationOutboxSnapshotInput<T>` is an application builder helper and must move out of the contracts protocol owner during affected review; it cannot reverse this dependency direction.

## 7. `ExternalEffectPhase` 对象卡

### 7.1 Rust-facing definition

```rust
/// Finite phase whose stable token, probe, and retry semantics are independent.
pub enum ExternalEffectPhase {
    /// Publishes one committed immutable outbox snapshot.
    Publication,
    /// Prepares one body-free report handoff input.
    HandoffPreparation,
    /// Delivers one committed handoff preparation.
    HandoffDelivery,
    /// Prepares one product-neutral external-audit export package.
    ExportPreparation,
    /// Delivers one committed export package identity.
    ExportDelivery,
}
```

| variant | stable token | allowed token / owner | forbidden substitution |
|---|---|---|---|
| `Publication` | `publication` | `ObservationPublicationToken`; outbox record/snapshot | not handoff/export retry or outbox state |
| `HandoffPreparation` | `handoff_preparation` | `HandoffPreparationToken`; handoff intent | not delivery or domain `Prepared` state |
| `HandoffDelivery` | `handoff_delivery` | `HandoffDeliveryToken`; delivery intent | not preparation probe or acceptance |
| `ExportPreparation` | `export_preparation` | `ExportPreparationToken`; export intent | not `ExportPreparationState` |
| `ExportDelivery` | `export_delivery` | `ExportDeliveryToken`; export delivery intent | not `PeripheralDeliveryKind` |

| member | exact signature | contract |
|---|---|---|
| parse retained token | `pub fn from_token(token: &str) -> Result<Self, ApplicationError>` | public for validated config/persistence mapping; exact five tokens only; no alias, case folding or `Other(String)` |
| stable token | `pub const fn as_token(&self) -> &'static str` | storage/config compatibility marker; not a public protocol state |
| family check | `pub const fn is_preparation(&self) -> bool`; `pub const fn is_delivery(&self) -> bool` | pure branch classification; does not authorize a call |

The enum belongs to `application::runtime` because validated capability catalogs and durable application tokens share it. Infra raw configuration may select declared phase support but cannot add variants, map one phase to another, or turn `Unsupported` into a negative probe result.

## 8. `ExternalEffectIntentRef` 对象卡

### 8.1 Rust-facing definition

```rust
/// Stable local identity of one planned handoff or export external-effect phase.
#[repr(transparent)]
pub struct ExternalEffectIntentRef(BodyFreeRef);
```

| field / property | source | validation and boundary |
|---|---|---|
| private inner ref | `IdGeneratorPort.new_external_effect_intent_ref()` | valid generated `BodyFreeRef`; one new value per prepare/deliver intent |
| owner | `application::external_effects`; planned file `crates/application/src/external_effects.rs` | lifecycle relation is local and append-once |
| semantic scope | identifies one exact handoff/export phase token | not publication, job execution, claim, attempt, external run, provider request or receipt |

| factory / member | exact signature | contract |
|---|---|---|
| wrap generated value | `pub fn try_from_generated(value: BodyFreeRef) -> Result<Self, ApplicationError>` | exposed for the infra `IdGeneratorPort` implementation; only generated values are allowed and malformed output is rejected |
| rehydrate | `pub fn try_rehydrate(value: BodyFreeRef) -> Result<Self, ApplicationError>` | public for the infra id/persistence adapter; validates stored identity without calling adapter/catalog |
| typed access | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`; `pub fn into_body_free_ref(self) -> BodyFreeRef` | no cross-wrapper conversion |

Publication does not mint this type: its stable durable identity is already the outbox record/event/snapshot tuple. Handoff/export preparation and delivery use distinct intent refs even when they belong to the same job item; phase relation is proven by token fields and committed local preparation, not by deriving one ref from another.

## 9. `HandoffDeliveryPreparationRef` 对象卡

This section closes the public typed identity used by the frozen `PrepareReportHandoffDeliveryJobOutput` and by the application delivery token. The canonical declaration belongs to `contracts::refs`; application does not redeclare it.

### 9.1 Canonical contracts declaration and application mint/use

```rust
/// Body-free identity of one exact report-handoff preparation returned by the delivery boundary.
#[repr(transparent)]
pub struct HandoffDeliveryPreparationRef(BodyFreeRef);
```

| field / property | source | validation and boundary |
|---|---|---|
| private inner ref | validated `ReportHandoffDeliveryPort.prepare_handoff` result or its exact probe result | non-empty body-free ref; adapter may return a provider-neutral generated identity, but no locator/body may enter |
| canonical value owner | `contracts::refs` | required by public Job output and application token without contracts -> application dependency |
| lifecycle / acceptance owner | application handoff flow validates and commits the result against the matching intent; contracts only wraps/serializes | a decoded public ref does not prove preparation exists or was accepted locally |

| member | exact signature | contract |
|---|---|---|
| wrap validated result | `pub fn new(value: BodyFreeRef) -> Self` | applies the contracts transparent-ref template; no generation in contracts |
| rehydrate / decode | parse `BodyFreeRef`, then call `HandoffDeliveryPreparationRef::new(value)` | validates shape only |
| borrow / consume | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`; `pub fn into_body_free_ref(self) -> BodyFreeRef` | typed access; no conversion to handoff/intent/receipt refs |

The ref cannot be a report id, evidence alias, archive package, external acceptance id, signoff, real run id or provider locator. A preparation ref is reusable only with the same handoff、consumer、binding and material digest captured by its token; another intent cannot adopt it by value alone.

### 9.2 C-2 identity and dependency stop review

| review item | conclusion |
|---|---|
| binding object owner | `application::runtime`; closes Step 06/14 duplicate owner |
| effect phase owner | `application::runtime`; finite five variants, no config extension |
| local intent identity | `application::external_effects`; application id generator only |
| public preparation identity | `contracts::refs`; adapter result validated/committed by application |
| contracts -> application dependency | none |
| locator / credential / provider body | absent |
| current batch status | `pass_C2`; token cards may proceed within C only |

## 10. `ObservationPublicationToken` 对象卡

### 10.1 Rust-facing definition

```rust
/// Stable identity of one call that publishes an exact committed outbox snapshot.
pub struct ObservationPublicationToken {
    /// Immutable destination and external idempotency namespace revision.
    effect_binding_ref: ExternalEffectBindingRef,
    /// Outbound event identity copied from the stored snapshot.
    event_ref: OutboundEventRef,
    /// Durable local publication marker identity.
    outbox_ref: OutboxRecordRef,
    /// Digest of the exact stored serialized event bytes.
    payload_digest: DigestSummary,
    /// Exact outbound protocol schema version.
    schema_version: SchemaVersion,
}
```

| field | exact source | invariant |
|---|---|---|
| `effect_binding_ref` | `ObservationOutboxPayloadSnapshot.effect_binding_ref` | same exact retained revision on every attempt/probe; no current catalog default substitution |
| `event_ref` | snapshot + record pair | equal in snapshot, record, receipt/failure and token |
| `outbox_ref` | `ObservationOutboxRecord.outbox_ref` | identifies the local marker; not a claim/work/attempt key |
| `payload_digest` | exact stored `BodyFreeSerializedEvent` canonical digest | equal to snapshot/receipt/failure; no reserialization or current-truth rebuild |
| `schema_version` | stored protocol snapshot | equal to payload header/snapshot; not digest profile or repository schema |

| factory / member | exact signature | contract / failure |
|---|---|---|
| derive from stored pair | `pub(crate) fn from_stored(record: &ObservationOutboxRecord, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<Self, ApplicationError>` | calls pair/integrity validation and accepts only a nonterminal `Pending` or `Failed` marker; construction itself does not prove claim/fence/probe eligibility |
| rehydrate | `pub fn try_rehydrate(effect_binding_ref: ExternalEffectBindingRef, event_ref: OutboundEventRef, outbox_ref: OutboxRecordRef, payload_digest: DigestSummary, schema_version: SchemaVersion) -> Result<Self, ApplicationError>` | public for persistence/fake parity; shape validation only, and caller must load record/snapshot before use |
| pair validation | `pub(crate) fn matches_stored(&self, record: &ObservationOutboxRecord, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<(), ApplicationError>` | exact five-field/pair equality; mismatch stops before adapter call |
| accessors | `effect_binding_ref()`, `event_ref()`, `outbox_ref()`, `payload_digest()`, `schema_version()` | borrowed typed access only |
| phase | `pub const fn phase(&self) -> ExternalEffectPhase` | always `Publication` |

There is no public field constructor and no `ExternalEffectIntentRef`. The frozen Step 09 struct literal is historical affected material and must call `from_stored`. A token may be reused only under later current claim/fence and probe rules; token equality alone never authorizes blind retry or proves external acceptance.

## 11. `HandoffPreparationToken` 对象卡

### 11.1 Rust-facing definition

```rust
/// Stable token for preparing one exact body-free report handoff input.
pub struct HandoffPreparationToken {
    /// Local identity committed before the external call.
    intent_ref: ExternalEffectIntentRef,
    /// Exact retained destination revision.
    effect_binding_ref: ExternalEffectBindingRef,
    /// Observation-owned handoff record being prepared.
    handoff_ref: ReportHandoffRecordRef,
    /// Immutable evidence-index input consumed by the preparation.
    evidence_index_input_ref: EvidenceIndexInputViewRef,
    /// Structured report consumer boundary.
    consumer_ref: ReportConsumerRef,
    /// Canonical digest of this exact body-free preparation material.
    material_digest: DigestSummary,
}
```

| field | exact source | invariant |
|---|---|---|
| `intent_ref` | application id generator in the local pre-call UoW | unique for this preparation effect; not derived from handoff/consumer/time |
| `effect_binding_ref` | job config snapshot / validated catalog entry frozen before intent commit | must match retained job plan and later preparation result |
| `handoff_ref` | loaded `ReportHandoffRecord` | exact local owner; not handoff scope or report id |
| `evidence_index_input_ref` | handoff's committed immutable input | must equal loaded handoff field and loaded `EvidenceIndexInputView.identity()` |
| `consumer_ref` | handoff record + validated catalog subject | equality required; no current consumer fallback |
| `material_digest` | R06.6-F canonicalizer over phase discriminator + all prior fields except `intent_ref`, plus immutable input identity profile | body-free only; no evidence body/report body/clock/attempt/credential |

| factory / member | exact signature | contract / failure |
|---|---|---|
| construct from committed inputs | `pub(crate) fn from_canonical_material(intent_ref: ExternalEffectIntentRef, effect_binding_ref: ExternalEffectBindingRef, handoff: &ReportHandoffRecord, input: &EvidenceIndexInputView, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | validates handoff/input/consumer relation; only canonicalizer-owned call path may supply digest |
| rehydrate | `pub fn try_rehydrate(intent_ref: ExternalEffectIntentRef, effect_binding_ref: ExternalEffectBindingRef, handoff_ref: ReportHandoffRecordRef, evidence_index_input_ref: EvidenceIndexInputViewRef, consumer_ref: ReportConsumerRef, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | public for persistence/fake parity; validates field shape, then persisted intent must be checked against loaded owner/input/plan |
| compatibility | `pub(crate) fn matches_material(&self, handoff: &ReportHandoffRecord, input: &EvidenceIndexInputView, expected_binding: &ExternalEffectBindingRef, canonical_digest: &DigestSummary) -> Result<(), ApplicationError>` | exact relation/binding/digest match before prepare or probe |
| accessors / phase | typed accessors for all fields; `phase() -> ExternalEffectPhase` | phase is always `HandoffPreparation` |

The token does not assert the handoff is externally accepted or the evidence is authentic. Readiness、visibility、retention and no-write eligibility are established by the owning domain object/decisions and rechecked by Step 09; this token only prevents identity/material/binding drift.

## 12. `HandoffDeliveryToken` 对象卡

### 12.1 Rust-facing definition

```rust
/// Stable token for delivering one exact committed handoff preparation.
pub struct HandoffDeliveryToken {
    /// New local identity for the delivery phase.
    intent_ref: ExternalEffectIntentRef,
    /// Destination revision copied from the preparation result.
    effect_binding_ref: ExternalEffectBindingRef,
    /// Handoff record owning the preparation.
    handoff_ref: ReportHandoffRecordRef,
    /// Exact preparation returned for the prior preparation token.
    preparation_ref: HandoffDeliveryPreparationRef,
    /// Consumer copied from the preparation result.
    consumer_ref: ReportConsumerRef,
    /// Canonical digest of the exact body-free delivery material.
    material_digest: DigestSummary,
}
```

| field | exact source | invariant |
|---|---|---|
| `intent_ref` | new application id generator value in the delivery-intent UoW | distinct from preparation intent and every attempt/claim |
| `effect_binding_ref` | committed `HandoffDeliveryPreparation.source_token.effect_binding_ref` | exact copy; delivery cannot rotate target |
| `handoff_ref` / `consumer_ref` | committed preparation result | exact copy; must still match loaded handoff owner |
| `preparation_ref` | committed `HandoffDeliveryPreparation` | one exact preparation only; cannot be replaced by current evidence input |
| `material_digest` | canonicalizer over phase + binding + handoff + preparation + consumer + exact preparation result identity | no report/evidence body, endpoint, attempt or clock |

| factory / member | exact signature | contract / failure |
|---|---|---|
| derive from committed preparation | `pub(crate) fn from_preparation(intent_ref: ExternalEffectIntentRef, preparation: &HandoffDeliveryPreparation, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | copies immutable relation and validates canonical digest; preparation must already be locally committed |
| rehydrate | `pub fn try_rehydrate(intent_ref: ExternalEffectIntentRef, effect_binding_ref: ExternalEffectBindingRef, handoff_ref: ReportHandoffRecordRef, preparation_ref: HandoffDeliveryPreparationRef, consumer_ref: ReportConsumerRef, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | public for persistence/fake parity; validates shape, and loaded preparation comparison is required before use |
| compatibility | `pub(crate) fn matches_preparation(&self, preparation: &HandoffDeliveryPreparation, canonical_digest: &DigestSummary) -> Result<(), ApplicationError>` | exact binding/handoff/preparation/consumer/digest equality |
| accessors / phase | typed accessors for all fields; `phase() -> ExternalEffectPhase` | phase is always `HandoffDelivery` |

Delivery token construction is a local committed phase change, not an external delivery result. A later `Delivered` probe/receipt may only finalize the same handoff under the same token; it cannot create a new token, switch binding or imply signoff.

## 13. `ExportPreparationToken` 对象卡

### 13.1 Rust-facing definition

```rust
/// Stable token for preparing one product-neutral external-audit export package.
pub struct ExportPreparationToken {
    /// Local preparation-effect intent identity.
    intent_ref: ExternalEffectIntentRef,
    /// Exact external destination revision.
    effect_binding_ref: ExternalEffectBindingRef,
    /// Observation-owned export preparation identity.
    preparation_ref: ExternalAuditExportPreparationRef,
    /// Exact body-free public view used as preparation input.
    view_ref: DashboardAlertExportViewRef,
    /// Structured peripheral consumer boundary.
    consumer_ref: PeripheralConsumerRef,
    /// Canonical digest of the exact preparation input identity.
    material_digest: DigestSummary,
}
```

| field | exact source | invariant |
|---|---|---|
| `intent_ref` | application id generator before external prepare | unique local phase identity |
| `effect_binding_ref` | frozen job config/catalog subject `PeripheralConsumer(consumer_ref)` | exact retained revision; no product/default fallback |
| `preparation_ref` / `view_ref` / `consumer_ref` | loaded `ExternalAuditExportPreparation` + `DashboardAlertExportView` | all three relations must match the owning object and policy-evaluated view |
| `material_digest` | canonicalizer over phase + binding + preparation + view + consumer + immutable body-free view identity | no dashboard/GRC payload body, product locator or credential |

| factory / member | exact signature | contract / failure |
|---|---|---|
| construct | `pub(crate) fn from_canonical_material(intent_ref: ExternalEffectIntentRef, effect_binding_ref: ExternalEffectBindingRef, preparation: &ExternalAuditExportPreparation, view: &DashboardAlertExportView, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | validates preparation/view/consumer relation; eligibility remains owning flow responsibility |
| rehydrate | `pub fn try_rehydrate(intent_ref: ExternalEffectIntentRef, effect_binding_ref: ExternalEffectBindingRef, preparation_ref: ExternalAuditExportPreparationRef, view_ref: DashboardAlertExportViewRef, consumer_ref: PeripheralConsumerRef, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | public for persistence/fake parity; shape validation followed by loaded relation comparison |
| compatibility | `pub(crate) fn matches_material(&self, preparation: &ExternalAuditExportPreparation, view: &DashboardAlertExportView, expected_binding: &ExternalEffectBindingRef, canonical_digest: &DigestSummary) -> Result<(), ApplicationError>` | exact field equality |
| accessors / phase | typed accessors for all fields; `phase() -> ExternalEffectPhase` | phase is always `ExportPreparation` |

This token is product neutral. It does not contain dashboard/alert/GRC destination fields, export body, evidence body, provider package, external audit id, acceptance or verdict.

## 14. `ExportDeliveryToken` 对象卡

### 14.1 Rust-facing definition

```rust
/// Stable token for delivering one exact committed peripheral export package.
pub struct ExportDeliveryToken {
    /// New local identity for the export delivery phase.
    intent_ref: ExternalEffectIntentRef,
    /// Destination revision copied from the committed package source token.
    effect_binding_ref: ExternalEffectBindingRef,
    /// Observation-owned export preparation identity.
    preparation_ref: ExternalAuditExportPreparationRef,
    /// Local peripheral delivery attempt identity.
    delivery_ref: PeripheralDeliveryRef,
    /// Structured consumer copied from preparation and package.
    consumer_ref: PeripheralConsumerRef,
    /// Canonical digest of this exact export-delivery phase material.
    material_digest: DigestSummary,
}
```

| field | exact source | invariant |
|---|---|---|
| `intent_ref` | application id generator in delivery-intent UoW | distinct from export preparation intent |
| `effect_binding_ref` | `PeripheralExportPackage.source_token.effect_binding_ref` | exact copy; no current target lookup |
| `preparation_ref` / `consumer_ref` | committed package + loaded `PeripheralDeliveryState` | package, preparation and delivery owner must agree |
| `delivery_ref` | loaded local `PeripheralDeliveryState` | one local delivery attempt; not provider delivery id |
| `material_digest` | R06.6-F canonicalizer over `export_delivery` phase + binding + preparation + delivery + consumer + nested committed package identity | phase-specific摘要；`package_digest`只作为nested package identity进入，二者不得相等替代；无body/provider response |

| factory / member | exact signature | contract / failure |
|---|---|---|
| derive from package | `pub(crate) fn from_package(intent_ref: ExternalEffectIntentRef, delivery: &PeripheralDeliveryState, package: &PeripheralExportPackage, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | validates preparation/consumer/view relation and the separately computed `export_delivery` digest; package must already be locally committed；only canonicalizer-owned call path may supply the phase digest |
| rehydrate | `pub fn try_rehydrate(intent_ref: ExternalEffectIntentRef, effect_binding_ref: ExternalEffectBindingRef, preparation_ref: ExternalAuditExportPreparationRef, delivery_ref: PeripheralDeliveryRef, consumer_ref: PeripheralConsumerRef, material_digest: DigestSummary) -> Result<Self, ApplicationError>` | public for persistence/fake parity; shape validation followed by loaded package/delivery comparison |
| compatibility | `pub(crate) fn matches_package(&self, delivery: &PeripheralDeliveryState, package: &PeripheralExportPackage, canonical_digest: &DigestSummary) -> Result<(), ApplicationError>` | exact binding/preparation/delivery/consumer/package identity equality plus phase-specific digest equality |
| accessors / phase | typed accessors for all fields; `phase() -> ExternalEffectPhase` | phase is always `ExportDelivery` |

The token's `material_digest` identifies the exact `export_delivery` commitment, not the package digest and not the original export-view input digest. The committed package's `package_ref` and `package_digest` are nested inputs to that phase material. Preparation、package和delivery因此各有不同摘要主语，即使共享preparation/binding/consumer refs也不能复制摘要。Changing the package requires a new preparation flow and cannot reuse this delivery intent.

### 14.2 Five-token cross-family invariants

| invariant | exact rule |
|---|---|
| immutability | no token member mutates; retry/probe receives the same value |
| phase | token type and `ExternalEffectPhase` are one-to-one; no generic phase field that can disagree |
| intent | publication has no intent ref; each handoff/export prepare/deliver phase has one generated ref |
| binding | selected before durable material commit and copied thereafter; delivery copies preparation/package binding |
| digest | exact phase-specific canonical body-free material only; profile mismatch is consistency/manual failure |
| forbidden material | no attempt, claim, fence, job execution, clock, endpoint, topic, credential, raw body, provider response, run id, evidence alias, verdict or signoff |
| authorization | token equality proves identity stability only; Step 09/13 still prove state, claim/fence, probe and retry eligibility |

### 14.3 C-3 token stop review

| review item | conclusion |
|---|---|
| five token structs independent | pass; §§10~14 each has fields/factory/compatibility |
| struct literal bypass | forbidden; frozen Step 09/13 definitions become affected use-sites |
| same-binding preparation -> delivery | pass; delivery factories copy committed result source binding |
| publication intent duplication | absent |
| body-free / non-truth boundary | pass |
| current batch status | `pass_C3`; durable intent may proceed within C only |

## 15. `ExternalEffectIntent` 对象卡

### 15.1 Rust-facing definition

```rust
/// Append-once durable landing of one exact handoff or export phase token.
pub enum ExternalEffectIntent {
    /// Intent committed before preparing a report handoff.
    HandoffPreparation(HandoffPreparationToken),
    /// Intent committed before delivering a handoff preparation.
    HandoffDelivery(HandoffDeliveryToken),
    /// Intent committed before preparing a peripheral export package.
    ExportPreparation(ExportPreparationToken),
    /// Intent committed before delivering a peripheral export package.
    ExportDelivery(ExportDeliveryToken),
}
```

`ExternalEffectIntent` is a tagged immutable object, not a mutable phase state machine. Its variant carries the complete stable token and removes the need for nullable subject/preparation/view/consumer columns whose legal combinations would otherwise be inferred by a repository adapter.

| variant | durable identity | exact unique semantic tuple | owning local lifecycle |
|---|---|---|---|
| `HandoffPreparation` | token `intent_ref` | phase + binding + handoff + evidence input + consumer + material digest | `ReportHandoffRecord` preparation path |
| `HandoffDelivery` | token `intent_ref` | phase + binding + handoff + preparation + consumer + material digest | `ReportHandoffRecord` delivery path |
| `ExportPreparation` | token `intent_ref` | phase + binding + export preparation + view + consumer + material digest | `ExternalAuditExportPreparation` |
| `ExportDelivery` | token `intent_ref` | phase + binding + export preparation + delivery + consumer + phase-specific material digest（其material嵌入package ref/digest） | `PeripheralDeliveryState` |

| factory / member | exact signature | contract / side effect |
|---|---|---|
| variant factories | `pub(crate) fn handoff_preparation(token: HandoffPreparationToken) -> Self`; corresponding three factories | wraps one already validated token; no adapter call, clock read, config lookup or state transition |
| rehydrate | `pub fn try_rehydrate(value: Self) -> Result<Self, ApplicationError>` | public for the infra repository mapper; revalidates embedded token shape and variant/phase match, and the row decoder must select an exact tagged variant |
| identity | `pub fn intent_ref(&self) -> &ExternalEffectIntentRef` | exhaustive match; no generic row id |
| binding | `pub fn effect_binding_ref(&self) -> &ExternalEffectBindingRef` | exact retained binding |
| phase | `pub const fn phase(&self) -> ExternalEffectPhase` | exact variant mapping |
| digest | `pub fn material_digest(&self) -> &DigestSummary` | exact token digest; not an external result digest |
| semantic comparison | `pub fn has_same_semantic_effect(&self, other: &Self) -> bool` | public for the separate infra repository implementation; true only when variant and every token field except `intent_ref` are equal; it grants no call/retry authority |
| token access | four typed `as_*_token() -> Option<&...>` functions | exact variant inspection; no untagged field bag |

### 15.2 Persistence and transaction contract

```text
pre-call local UoW:
  load exact owning object / immutable material / job plan
  validate current state, policy decision, claim/fence and retained binding
  mint one ExternalEffectIntentRef
  construct one exact token and tagged ExternalEffectIntent
  append intent + separate immutable ExternalEffectPhaseLink + attempt authorization
  commit

external cut:
  reload committed intent and exact immutable material
  validate token/material/binding again
  probe first when required
  call adapter outside DB UoW only when allowed

post-call local UoW:
  append exact immutable result carrier and attempt completion when returned
  versioned reload owning object / plan / report
  validate current fence and result/token compatibility
  preserve the already Prepared owner for external preparation, or finalize Delivered / Failed
  commit
```

The intent repository is append-only: one `intent_ref` maps to one variant and token forever. It may enforce a variant-specific semantic unique constraint, but it has no `update_state`, `mark_sent`, `mark_prepared`, `mark_delivered`, reset or delete operation. The vague frozen Step 11 `state / local phase marker CAS` column is replaced by the owning domain/job state plus immutable result carriers; R06.8 must correct that use-site before implementation.

An intent cannot be generated inside an adapter and cannot be inserted after the external call. Missing intent, token mismatch, semantic duplicate under a different ref, missing old binding or corrupt variant is a consistency/manual stop. It never authorizes source truth repair, current target fallback, external acceptance, evidence authenticity, verdict or signoff.

### 15.3 C-4 durable intent stop review

| review item | conclusion |
|---|---|
| durable shape | one tagged token; no nullable union |
| lifecycle owner | remains handoff/export domain object and job item/report; no second intent state machine |
| transaction cut | intent commit is mandatory before probe/call |
| duplicate protection | PK identity + variant-specific semantic equality |
| raw material / locator | absent |
| current batch status | `pass_C4`; result/probe cards may proceed within C only |

## 16. `HandoffDeliveryPreparation` 对象卡

### 16.1 Rust-facing definition

```rust
/// Immutable body-free preparation returned for one exact handoff-preparation token.
pub struct HandoffDeliveryPreparation {
    /// Stable token whose effect produced or probed this preparation.
    source_token: HandoffPreparationToken,
    /// Body-free public identity of the exact preparation.
    preparation_ref: HandoffDeliveryPreparationRef,
}
```

| field | source | invariant |
|---|---|---|
| `source_token` | committed `ExternalEffectIntent::HandoffPreparation` supplied to prepare/probe | full token retained; result cannot be attached to another intent/binding/handoff/input/consumer |
| `preparation_ref` | adapter result mapper or `Prepared` probe result | valid body-free typed ref; no provider body/path/receipt/signoff |

| factory / member | exact signature | contract / failure |
|---|---|---|
| adapter/probe result | `pub fn try_from_adapter_result(source_token: HandoffPreparationToken, preparation_ref: HandoffDeliveryPreparationRef) -> Result<Self, ApplicationError>` | validates token/ref shape and constructs the immutable carrier; callable by infra adapter implementation without accessing repository/config |
| rehydrate | `pub fn try_rehydrate(source_token: HandoffPreparationToken, preparation_ref: HandoffDeliveryPreparationRef) -> Result<Self, ApplicationError>` | public for persistence/fake parity; same validation and no external call |
| compatibility | `pub(crate) fn matches_intent(&self, intent: &ExternalEffectIntent) -> Result<(), ApplicationError>` | intent must be matching HandoffPreparation variant with exact token |
| accessors | `source_token() -> &HandoffPreparationToken`; `preparation_ref() -> &HandoffDeliveryPreparationRef` | body-free typed access only |

This object is saved append-once, unique by `source_token.intent_ref`, after the local handoff has already reached policy-evaluated `ReportHandoffState::Prepared` and before delivery-intent construction. A `Prepared` probe may produce the same carrier and drive carrier finalize-only; another preparation ref for the same intent is a consistency defect. The carrier does not itself mutate `ReportHandoffRecord`, stand in for P7 or create an H4 record.

## 17. `HandoffDeliveryReceipt` 对象卡

### 17.1 Rust-facing definition

```rust
/// Immutable body-free delivery receipt returned for one exact handoff-delivery token.
pub struct HandoffDeliveryReceipt {
    /// Stable delivery token whose effect produced or probed this receipt.
    source_token: HandoffDeliveryToken,
    /// Opaque body-free receipt identity returned by the adapter boundary.
    external_receipt_ref: BodyFreeRef,
}
```

| field | source | invariant |
|---|---|---|
| `source_token` | committed `ExternalEffectIntent::HandoffDelivery` | exact intent/binding/handoff/preparation/consumer/material relation |
| `external_receipt_ref` | adapter result mapper or `Delivered` probe result | valid `BodyFreeRef`; not response body, endpoint, provider status text, acceptance, signoff or evidence alias |

| factory / member | exact signature | contract / failure |
|---|---|---|
| adapter/probe result | `pub fn try_from_adapter_result(source_token: HandoffDeliveryToken, external_receipt_ref: BodyFreeRef) -> Result<Self, ApplicationError>` | validates body-free ref and token shape; does not interpret provider text |
| rehydrate | `pub fn try_rehydrate(source_token: HandoffDeliveryToken, external_receipt_ref: BodyFreeRef) -> Result<Self, ApplicationError>` | public for persistence/fake parity; same shape validation |
| compatibility | `pub(crate) fn matches_intent(&self, intent: &ExternalEffectIntent) -> Result<(), ApplicationError>` | exact HandoffDelivery token equality |
| accessors | `source_token() -> &HandoffDeliveryToken`; `external_receipt_ref() -> &BodyFreeRef` | no raw provider response |

The receipt is append-once and unique by delivery intent ref. It is retained for local audit/reconciliation, while `ReportHandoffRecord.delivery_result` remains the finite local lifecycle classification. A receipt does not by itself mutate the handoff, prove the consumer processed the handoff, or establish acceptance/signoff.

## 18. `PeripheralExportPackage` 对象卡

### 18.1 Rust-facing definition

```rust
/// Immutable body-free package handle returned for one exact export-preparation token.
pub struct PeripheralExportPackage {
    /// Stable export-preparation token whose effect produced or probed this package.
    source_token: ExportPreparationToken,
    /// Opaque body-free handle for the prepared package inside the retained adapter binding.
    package_ref: BodyFreeRef,
    /// Canonical digest of the exact prepared package identity and safe body-free material.
    package_digest: DigestSummary,
}
```

| field | source | invariant |
|---|---|---|
| `source_token` | committed `ExternalEffectIntent::ExportPreparation` | exact binding/preparation/view/consumer/input digest retained |
| `package_ref` | adapter result mapper or `Prepared` probe | opaque body-free handle resolvable only through the same binding; no URL/path/bucket/provider package body |
| `package_digest` | stable canonicalizer over source token + package ref + adapter-declared finite body-free package metadata | no external package body, evidence/report body, credential, endpoint, clock or attempt |

| factory / member | exact signature | contract / failure |
|---|---|---|
| adapter/probe result | `pub fn try_from_adapter_result(source_token: ExportPreparationToken, package_ref: BodyFreeRef, package_digest: DigestSummary) -> Result<Self, ApplicationError>` | validates body-free handle/digest profile; R06.6-F closes canonical byte construction and fake parity |
| rehydrate | `pub fn try_rehydrate(source_token: ExportPreparationToken, package_ref: BodyFreeRef, package_digest: DigestSummary) -> Result<Self, ApplicationError>` | public for persistence/fake parity; same validation and no adapter lookup |
| compatibility | `pub(crate) fn matches_intent(&self, intent: &ExternalEffectIntent) -> Result<(), ApplicationError>` | exact ExportPreparation token equality |
| accessors | `source_token()`, `package_ref()`, `package_digest()` | borrowed body-free access only |

The package is append-once and unique by export preparation intent ref. `package_ref` is an opaque handle, not material that may be logged, returned publicly or resolved through a new/current adapter binding. Delivery uses the exact stored carrier; missing/corrupt package stops and never triggers rebuilding from current view/evidence truth.

## 19. `PublicationProbeOutcome` 对象卡

### 19.1 Rust-facing definition

```rust
/// Read-only probe result for one exact observation-publication token.
pub enum PublicationProbeOutcome {
    /// The target reports a matching published effect and returns its body-free receipt.
    Published(PublicationReceipt),
    /// The target formally proves the exact token was not published.
    NotPublished,
    /// The target cannot establish either published or not-published.
    Unknown,
    /// The adapter or target does not support a stable-token publication probe.
    Unsupported,
}
```

| variant | payload / source | allowed local interpretation | forbidden interpretation |
|---|---|---|---|
| `Published(receipt)` | adapter probe; receipt must match exact stored snapshot/token | finalize local outbox marker only after reload/CAS/claim/fence checks | downstream consumed, business accepted, or safe to rewrite truth |
| `NotPublished` | formal token-specific negative proof | later policy may permit same-token call; this enum alone does not authorize it | timeout/absence/404/default negative guess |
| `Unknown` | ambiguous provider/adapter outcome | stop automatic call and expose manual/indeterminate handling | map to NotPublished or Failed |
| `Unsupported` | declared or observed missing probe capability | stop ambiguous retry path; capability/config affected handling | map to NotPublished, success or disabled no-op |

| member | exact signature | contract |
|---|---|---|
| positive validation | `pub(crate) fn validate_for(&self, token: &ObservationPublicationToken, record: &ObservationOutboxRecord, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<(), ApplicationError>` | `Published` validates token/stored pair and receipt/snapshot; other variants validate no payload |
| classification | `is_positive()`, `is_formal_negative()`, `is_indeterminate()` | pure inspection; `is_formal_negative` true only NotPublished |

Probe execution is read-only and never runs on Query paths. The enum is process-local application surface, not a public transport DTO or durable outbox state. If a `Published` result is observed after local finalize uncertainty, only the matching local marker may be finalized; no new event/token/payload is generated.

## 20. `ExternalPreparationProbe<T>` 对象卡

### 20.1 Rust-facing definition

```rust
/// Read-only probe result for one exact external preparation token.
pub enum ExternalPreparationProbe<T> {
    /// The target reports an exact body-free preparation result.
    Prepared(T),
    /// The target formally proves the token has no prepared effect.
    NotPrepared,
    /// The target cannot establish preparation or non-preparation.
    Unknown,
    /// The adapter or target does not support preparation probing.
    Unsupported,
}
```

| payload specialization | `Prepared(T)` compatibility requirement |
|---|---|
| `HandoffDeliveryPreparation` | `value.source_token == probed HandoffPreparationToken`; value must match committed intent |
| `PeripheralExportPackage` | `value.source_token == probed ExportPreparationToken`; package ref/digest must be valid and match committed intent |

| member | exact signature | contract |
|---|---|---|
| map positive | `pub fn map_prepared<U>(self, map: impl FnOnce(T) -> U) -> ExternalPreparationProbe<U>` | preserves exact outer classification; cannot convert Unknown/Unsupported to NotPrepared |
| borrowed view | `pub fn as_ref(&self) -> ExternalPreparationProbe<&T>` | no cloning of package/preparation required |
| classification | `is_prepared()`, `is_formal_negative()`, `is_indeterminate()` | NotPrepared is the only formal negative |

The generic enum does not itself know the token type, so every Step 07 adapter facade must immediately run the specialization's `matches_intent` / source-token equality before returning it to application flow. A mismatching `Prepared` payload is an adapter consistency defect, not a reason to call prepare again.

`NotPrepared` is necessary but not sufficient for another prepare call: Step 09/13 must also prove the prior local call did not commit an effect or that a formal abort cut applies, plus current claim/fence and retry policy. `Unknown` / `Unsupported` always stop automatic repetition.

## 21. `ExternalDeliveryProbe<T>` 对象卡

### 21.1 Rust-facing definition

```rust
/// Read-only probe result for one exact external delivery token.
pub enum ExternalDeliveryProbe<T> {
    /// The target reports a matching successful delivery result.
    Delivered(T),
    /// The target formally proves the token has no delivered effect.
    NotDelivered,
    /// The target cannot establish delivery or non-delivery.
    Unknown,
    /// The adapter or target does not support delivery probing.
    Unsupported,
}
```

| payload specialization | `Delivered(T)` compatibility requirement |
|---|---|
| `HandoffDeliveryReceipt` | receipt source token must equal the probed `HandoffDeliveryToken` and committed intent |
| `PeripheralDeliveryResult` | value must be exactly `PeripheralDeliveryResult::Delivered`; failure/rejected variants are not positive proof and must not be nested under outer Delivered |

| member | exact signature | contract |
|---|---|---|
| map positive | `pub fn map_delivered<U>(self, map: impl FnOnce(T) -> U) -> ExternalDeliveryProbe<U>` | preserves outer classification |
| borrowed view | `pub fn as_ref(&self) -> ExternalDeliveryProbe<&T>` | no payload mutation |
| classification | `is_delivered()`, `is_formal_negative()`, `is_indeterminate()` | NotDelivered only formal negative; Unknown/Unsupported indeterminate |

For direct export delivery calls, `PeripheralDeliveryResult::{RetryableFailure,PermanentFailure,Rejected}` remain typed adapter outcomes that the application maps with `ExportFailureReason` into the local domain state. For a later probe, only a matching positive `Delivered` result qualifies as finalize-only; a probe cannot invent or replay a prior failure classification. This avoids the contradictory shape `Delivered(RetryableFailure)`.

As with preparation, `NotDelivered` alone does not authorize a repeated external call. Local abort proof、same committed token/package、claim/fence and policy must all pass. Any positive payload mismatch, missing committed intent, old-binding resolution failure or unsupported probe remains consistency/manual and never falls back to current target.

### 21.2 C-5 result / probe stop review

| review item | conclusion |
|---|---|
| handoff preparation result | exact source token + public typed preparation ref |
| handoff delivery receipt | exact delivery token + body-free receipt ref; no acceptance/signoff meaning |
| export package | exact preparation token + body-free package handle/digest; no package body |
| publication probe | four states; positive receipt compatibility mandatory |
| generic preparation/delivery probe | four states retained; type-specific positive compatibility mandatory |
| Unknown / Unsupported | never formal negative and never blind-retry authority |
| current batch status | `pass_C5`; C-wide closure may proceed |

## 22. C 批跨对象字段闭环

### 22.1 五条稳定身份链

下列链只表达本地 observation application 如何冻结一次外部调用的身份、保存 body-free 结果，以及哪个既有本地状态 owner 可以在重新加载后消费该结果。箭头不表示业务 truth 转移，也不表示 token 或 result carrier 自己拥有状态迁移。

```text
publication:
  committed outbox record + immutable payload snapshot
    -> ObservationPublicationToken
    -> publish/probe exact stored bytes through retained binding
    -> PublicationReceipt
    -> ObservationOutboxRecord Published CAS

handoff preparation:
  policy-evaluated local ReportHandoffRecord::Prepared + immutable EvidenceIndexInputView + retained binding
    -> HandoffPreparationToken
    -> ExternalEffectIntent::HandoffPreparation committed
    -> HandoffDeliveryPreparation
    -> append exact preparation carrier while handoff remains locally Prepared

handoff delivery:
  committed HandoffDeliveryPreparation + new phase intent identity
    -> HandoffDeliveryToken
    -> ExternalEffectIntent::HandoffDelivery committed
    -> HandoffDeliveryReceipt
    -> fresh local reload and ReportHandoffRecord::deliver(HandoffDeliveryResult::Delivered)

export preparation:
  local ExternalAuditExportPreparation::Prepared + exact export view + retained binding
    -> ExportPreparationToken
    -> ExternalEffectIntent::ExportPreparation committed
    -> PeripheralExportPackage
    -> append exact package carrier; local preparation remains the policy-evaluated input owner

export delivery:
  committed PeripheralExportPackage + loaded PeripheralDeliveryState
    -> ExportDeliveryToken
    -> ExternalEffectIntent::ExportDelivery committed
    -> ExternalDeliveryProbe<PeripheralDeliveryResult> or direct typed result
    -> fresh local reload and PeripheralDeliveryState::record_delivery(...)
```

Every external cut starts from a committed durable identity. Publication reuses the outbox pair as its durable landing; the other four phases append a tagged `ExternalEffectIntent`. Every positive result is validated against the exact token before any local state mutation. A token, intent, receipt, package or probe outcome never authorizes a state transition by itself; the application flow must reload the owning object, current plan item/claim/fence and relevant policy input.

### 22.2 Publication field equality closure

| field | durable source | token copy | positive result / local landing | mismatch handling |
|---|---|---|---|---|
| binding | payload snapshot `effect_binding_ref` | exact same `ExternalEffectBindingRef` | `PublicationReceipt.effect_binding_ref`; outbox pair remains unchanged | consistency/manual stop; no current catalog substitution |
| event identity | snapshot + record `event_ref` | exact same `OutboundEventRef` | receipt/failure and record relation | stop before call/finalize |
| marker identity | record `outbox_ref` | exact same `OutboxRecordRef` | local CAS subject | wrong marker cannot adopt receipt |
| payload identity | exact stored bytes + `payload_digest` | digest copied without serialization | receipt/failure digest compatibility | no payload rebuild or rehash through adapter encoding |
| schema | stored protocol snapshot | exact `SchemaVersion` | receipt/failure schema compatibility | profile/schema mismatch is not retryable drift |

`ObservationPublicationToken` is derived and need not be stored as another row. Its five fields are reconstructible only from the exact committed record/snapshot pair. A publisher must receive the exact stored bytes separately; token equality does not permit reconstructing bytes from current truth or embedding bytes in the token.

### 22.3 Handoff source-token-result closure

| stage | exact input relation | durable identity / carrier | required equality before next stage | local state owner |
|---|---|---|---|---|
| prepare intent | handoff + immutable evidence input + consumer + retained binding + canonical material digest | `ExternalEffectIntent::HandoffPreparation(HandoffPreparationToken)` | intent variant, handoff/input/consumer/binding/digest all equal loaded material | no state mutation by intent |
| preparation result | exact committed preparation token | `HandoffDeliveryPreparation` with full `source_token` + `preparation_ref` | source token equals intent token; one preparation ref per intent; loaded handoff remains the same local Prepared revision | `ReportHandoffRecord` remains canonical lifecycle/readiness owner and is not advanced by this carrier |
| delivery intent | committed preparation carrier + new intent ref + phase-specific digest | `ExternalEffectIntent::HandoffDelivery(HandoffDeliveryToken)` | binding/handoff/consumer copied from preparation; preparation ref exact | no state mutation by intent |
| delivery result | exact committed delivery token | `HandoffDeliveryReceipt` with full `source_token` + body-free receipt ref | receipt token equals intent token; one receipt per delivery intent | `ReportHandoffRecord::deliver` consumes finite `HandoffDeliveryResult`, not provider text |

The local handoff must first reach `Prepared` through a complete P7 readiness decision and its own H4-producing UoW. Only then may the external handoff-preparation intent be authorized. The returned `HandoffDeliveryPreparation` is appended against that unchanged Prepared owner and is not a policy decision or a second Prepared transition. Delivery finalization maps a matching receipt to local `HandoffDeliveryResult::Delivered`; the receipt does not prove consumer processing, acceptance, verdict or signoff.

### 22.4 Export source-token-result closure

| stage | exact input relation | durable identity / carrier | required equality before next stage | local state owner |
|---|---|---|---|---|
| local input preparation | policy-evaluated preparation/view/consumer/evidence boundary | existing `ExternalAuditExportPreparation::Prepared` | current P14-derived local state and exact view relation | `ExternalAuditExportPreparation` |
| external package intent | prepared local owner + view + consumer + retained binding + input digest | `ExternalEffectIntent::ExportPreparation(ExportPreparationToken)` | token matches loaded preparation/view/consumer/binding | no state mutation by intent |
| package result | exact committed export-preparation token | `PeripheralExportPackage` with full source token, opaque package ref and package digest | one compatible package per intent; package binding remains source-token binding | immutable package repository carrier |
| delivery intent | committed package + loaded delivery state + new intent ref + phase-specific digest | `ExternalEffectIntent::ExportDelivery(ExportDeliveryToken)` | preparation/delivery/consumer/binding相等；nested package ref/digest相等；token `material_digest`按完整`export_delivery` material独立重算相等 | no state mutation by intent |
| delivery result | exact delivery token | direct `PeripheralDeliveryResult` or typed probe classification | outer `Delivered` permits only inner `PeripheralDeliveryResult::Delivered`; failures remain finite local classifications | `PeripheralDeliveryState`; affected flow may also update export preparation's local delivery classification under its existing invariant |

Export has a different preparation order from handoff. R06.4 `ExternalAuditExportPreparation::Prepared` means the product-neutral local input is policy-evaluated and ready before the external package preparation call. `PeripheralExportPackage` is the external prepare result and does not cause another `ExportPreparationState::Prepared` transition. Frozen Step 09/11 wording that saves local `Prepared` only after external export preparation is an affected correction; no new export state is introduced.

### 22.5 Cardinality and persistence invariants

| relation | required cardinality / durability | forbidden alternative |
|---|---|---|
| outbox record <-> payload snapshot | exactly one immutable pair; publication token is derived | separate mutable token row or current payload rebuild |
| external effect intent ref -> tagged token | exactly one append-once variant forever | nullable field union, effect-kind string plus guessed columns, variant rewrite |
| preparation intent -> preparation/package carrier | zero before result, then at most one exact compatible carrier; semantic duplicate may no-op only when byte/value equal | second result ref/package for same intent or adoption by another intent |
| delivery intent -> handoff receipt | zero before result, then at most one exact compatible receipt | multiple provider receipts selected by latest timestamp |
| export delivery intent -> local finite result | exact intent remains durable; current plan/item/fence links finalization to one local delivery owner | result enum alone used as global idempotency identity |
| binding ref retention | every snapshot/intent/result chain keeps the original revision resolvable through manual closure window | rotate to current/default binding when old adapter is unavailable |

Logical storage may normalize token fields, but its decoder must reconstruct one exact tagged variant and reject illegal combinations. Persistence cannot omit the source token from the three immutable result carriers, infer it from a foreign key alone, or store raw endpoint/topic/credential/provider response as recovery material.

## 23. State and owner audit

### 23.1 Canonical owner registry

| object / family | canonical declaration owner | lifecycle / mint responsibility | non-owner consumers |
|---|---|---|---|
| `HandoffDeliveryPreparationRef` | `contracts::refs` | application id generator or validated adapter result path supplies new value; contracts only validates/wraps | public Job output, application token/result, persistence codec |
| `ExternalEffectBindingRef`;`ExternalEffectPhase` | `application::runtime` | validated config derivation / finite compile-time phase | outbox, external effects, infra config/runtime builder, Step 07 resolver |
| `ExternalEffectIntentRef`; five token structs; `ExternalEffectIntent`; three result carriers; three probe enums | `application::external_effects` | application constructs/validates; intent and result carriers append once | jobs/service flow, ports/adapters, persistence, tests |
| `PublicationReceipt` and outbox record/snapshot | `application::outbox` | outbox lifecycle owner | publication token/probe validates against them |
| `ReportHandoffRecord` / `ReportHandoffState` | R06.4 `domain::handoff` / contracts metadata | handoff lifecycle/readiness transition | application flow consumes matching preparation/receipt |
| `ExternalAuditExportPreparation`;`PeripheralDeliveryState`;`PeripheralDeliveryResult` | R06.4 domain peripheral + contracts metadata | local policy/delivery lifecycle | export tokens/result probes coordinate exact external cuts |

`contracts` never imports application. `application::external_effects` may depend on contracts and domain objects; domain objects do not import application tokens. Infra may construct public application boundary values and implement persistence/adapter mapping, but cannot redeclare them.

### 23.2 No-second-state-machine audit

| C-batch object | durable state? | exact rule |
|---|---|---|
| binding ref / phase | no lifecycle | immutable value and finite discriminator only |
| five tokens | no lifecycle | exact call identity; no Pending/Sent/Done/Failed fields |
| `ExternalEffectIntent` | durable, but no mutable lifecycle | append-once tagged token landing; absence/presence is not a phase state enum |
| preparation/receipt/package carriers | durable immutable facts | append-once compatible result; cannot be marked active/failed/retried |
| probe enums | process-local read result | not stored as domain/outbox/job state; Unknown/Unsupported remain indeterminate |

Mutable lifecycle remains exclusively in `ObservationOutboxRecord`, `ReportHandoffRecord`, `ExternalAuditExportPreparation`, `PeripheralDeliveryState`, immutable job plan item classification and job report. The frozen Step 11 `intent state / local phase marker CAS` must be removed. If an implementation needs claim/lease/retry state, it belongs to R06.6-D job claim/item or Step 13 policy, not the intent object.

### 23.3 Truth ownership audit

| observation-side fact | what it proves | what it never proves |
|---|---|---|
| retained binding ref | same validated destination/idempotency namespace revision | endpoint health, current config, external acceptance |
| committed intent | exact local call identity existed before call | call happened, provider accepted, business truth changed |
| preparation/package carrier | adapter reported/probed one matching body-free prepared result | report correctness, evidence authenticity, package contents accepted |
| receipt / Delivered probe | adapter reported/probed a matching local boundary result | consumer processed it, audit verdict, signoff, final acceptance |
| NotPublished/NotPrepared/NotDelivered | formal negative for the exact token only | standalone retry authorization |
| Unknown/Unsupported | no safe positive or negative conclusion | failure, absence, disabled success or permission to call again |

## 24. Affected-use registry

| affected ID | frozen consumer | current conflict / required correction | later owner and status |
|---|---|---|---|
| `R06-C-AFFECT-04-01` | Step 04 file layout | application currently lacks explicit `runtime.rs` / `external_effects.rs` ownership and the old helper placement is ambiguous | R06.8 affected file-layout review; frozen pending |
| `R06-C-AFFECT-05-01` | Step 05 module contracts | application runtime/external-effect owner summary must distinguish config projection, external call coordination and domain lifecycle | R06.8 / affected Step 05 review; frozen pending |
| `R06-C-AFFECT-06-01` | B batch helper `ObservationOutboxSnapshotInput<T>` | helper currently points toward protocol/contracts ownership while carrying application-only binding | move owner to application outbox builder during R06.8; no schema change now |
| `R06-C-AFFECT-07-01` | Step 07 publisher and delivery ports | duplicate token/probe/result declarations must be removed; signatures must import C owners and validate positive payload/token equality | affected-only Step 07 review after R06.8 |
| `R06-C-AFFECT-07-02` | Step 07 persistence ports | no current append/get seam exists for tagged intents and exact result carriers | Step 07 must define append/get capabilities, semantic uniqueness and fake parity; no update/delete intent API |
| `R06-C-AFFECT-08-01` | Step 08 Job output | `HandoffDeliveryPreparationRef` lacked a canonical low-dependency declaration | contracts §30 now supplies it; per-protocol review remains frozen |
| `R06-C-AFFECT-09-01` | Step 09 publication/handoff/export flows | struct literals and implicit token creation bypass private factories; intent/result commit order is underspecified | per-flow rewrite after Step 08; use exact C factories and pre-call/post-call cuts |
| `R06-C-AFFECT-09-02` | Step 09 export flow | historical wording can read as external package prepare before local `ExternalAuditExportPreparation::Prepared` | preserve R06.4 local Prepared-before-external-package order |
| `R06-C-AFFECT-10-01` | Step 10 state matrix | intent/probe/result must not be added as another lifecycle family | only existing outbox/handoff/export/delivery/job states receive affected rows |
| `R06-C-AFFECT-11-01` | Step 11 intent logical store | row currently contains mutable `state` / phase-marker CAS | replace with immutable tagged intent plus append-once result carrier relations |
| `R06-C-AFFECT-11-02` | Step 11 transaction cuts | handoff/export preparation order is written too generically | split handoff preparation and export package preparation; enforce intent-before-call/result-before-finalize |
| `R06-C-AFFECT-12-01` | Step 12 error/recovery | token/binding/result mismatch needs canonical consistency classification, but C cannot define parallel error enum | R06.6-E closes `ApplicationError`; Step 12 maps it later |
| `R06-C-AFFECT-13-01` | Step 13 token/probe definitions | current file redeclares intent ref, five tokens and probe enums with public fields | consume C definitions; preserve private factories and four-way probe semantics |
| `R06-C-AFFECT-13-02` | Step 13 retry matrix | Not* may be read as sufficient retry proof | require formal abort proof + current claim/fence/policy; Unknown/Unsupported manual stop |
| `R06-C-AFFECT-14-01` | Step 14 binding definition | duplicate `ExternalEffectBindingRef` code block conflicts with Step 06 owner | Step 14 keeps validated derivation/catalog assembly only and imports `application::runtime` type |
| `R06-C-AFFECT-14-02` | Step 14 catalog | subject/entry/catalog and resolver capability remain incomplete object owners | defer to R06.6-D/R06.7/affected Step 14; C only fixes binding ref/phase |
| `R06-C-AFFECT-15-01` | Step 15 telemetry/audit | external-effect observations must use safe refs/phase/family only | affected review; never log token material digest with raw material or provider response |
| `R06-C-AFFECT-16-01` | Step 16 tests | current cuts need per-token constructor/mismatch/cardinality/probe tests | planned tests only; no result claimed in C |
| `R06-C-AFFECT-17-01` | Step 17 implementation handoff | implementation reading order must include C owner registry and affected corrections | frozen until Step 06~16 repair chain is current |

These are controlled downstream corrections, not evidence that the frozen files have already been repaired. C completion authorizes no edit to Step 07~19, formal `03`, `04` or implementation code.

## 25. Step 07 handoff checklist

Step 07 must consume this object contract and close the following trait/adapter seams without redefining any C object:

| capability | Step 07 must specify | hard redline |
|---|---|---|
| binding resolution | resolve the exact retained `ExternalEffectBindingRef` to one adapter/capability without exposing raw locator to application | no current/default fallback; old binding unavailable is explicit stop |
| intent persistence | append/get one exact tagged `ExternalEffectIntent`; enforce ref uniqueness and semantic duplicate detection | no mutable state, mark-sent/done, delete or variant rewrite |
| result persistence | append/get `HandoffDeliveryPreparation`, `HandoffDeliveryReceipt`, `PeripheralExportPackage` by exact source intent/token | no latest-result selection, provider body or source-token omission |
| publication | publish and probe one `ObservationPublicationToken` with exact stored payload snapshot | no payload reconstruction or publication intent ref |
| handoff prepare/deliver | accept exact token + immutable loaded material and return matching result/probe carrier | no token mint inside adapter; no domain mutation inside port |
| export prepare/deliver | accept exact token + immutable loaded preparation/package and return matching finite result/probe | no product-specific DTO or target rotation |
| identity generation | generate `ExternalEffectIntentRef` and, where application owns the new value path, `HandoffDeliveryPreparationRef` through typed methods | no generic string/ref conversion or provider run id |
| fake parity | fake repositories/adapters enforce the same token equality, uniqueness, four-way probe and body-free rules | fake cannot make Unknown a negative or skip intent-before-call |
| UoW boundary | external call always outside DB UoW; pre-call intent and post-call result/local finalize use separate short UoWs | no transaction held across network call |

Exact trait names, borrowing style, async signatures, repository split and adapter error mapping remain Step 07 responsibilities. The checklist is a consumption contract, not a premature port definition.

## 26. Future formal-document backfill draft

Formal `03-详细设计.md` remains frozen. At Step 19 reassembly, §5 application object contract must include at least these C facts:

1. `ExternalEffectBindingRef` and `ExternalEffectPhase` have one owner in `application::runtime`; infra derives/assembles values from validated configuration but does not redeclare them.
2. Publication derives one immutable token from the exact outbox record/snapshot pair and never creates an `ExternalEffectIntentRef`.
3. Handoff/export prepare and deliver each use a distinct immutable token and append a tagged intent before the external call.
4. `HandoffDeliveryPreparationRef` is a `contracts::refs` typed identity because public Job output consumes it; application retains lifecycle validation and new-value authority.
5. `HandoffDeliveryPreparation`, `HandoffDeliveryReceipt` and `PeripheralExportPackage` retain their complete source token and contain no raw provider material.
6. Intent and result carriers are append-only. Existing outbox/handoff/export/delivery/job objects remain the only mutable state owners.
7. Probe results preserve positive, formal negative, unknown and unsupported as distinct classifications; a formal negative alone does not authorize retry.
8. Every result is revalidated against exact token/material/binding after a fresh local reload; external success never directly writes business truth.
9. Export local `Prepared` precedes external package preparation, while handoff preparation finalization follows its exact preparation result and fresh readiness validation.
10. All external-effect recovery is body-free, product-neutral and non-signoff; no endpoint, credential, provider response, real run id or evidence alias is stored or fabricated.

Formal §11~§17 must back-reference the same owner/cardinality/transaction/probe rules. The draft cannot be copied until R06.6-D~F, R06.7, R06.8 and affected Step reviews are complete.

## 27. C batch blocker and closure audit

| item | status | C-batch conclusion |
|---|---|---|
| external upstream blocker | none | current formal `00/01/02` support observation-only external-effect projection and no-write boundaries |
| `R06.6-APP-EXT-OWNER` | resolved_in_C | canonical owner is `application::runtime`; infra only derives/assembles validated binding revisions |
| `R06.6-C-PREPARATION-REF-OWNER` | resolved_in_C | `HandoffDeliveryPreparationRef` canonical declaration is `contracts::refs`; application validates/mints/commits relation |
| `R06.6-C-INTENT-LIFECYCLE` | resolved_in_C | tagged append-once object; no mutable intent state machine |
| `R06.6-C-EXPORT-PHASE-ORDER` | resolved_as_affected_correction | local export Prepared is input-ready before external package prepare; no new state |
| `03-RPR-S06-GRANULARITY` | open | C closes 16 objects; D~F, R06.7/R06.8 and affected reviews remain |
| `R06.6-DISPOSITION-LAYER` | historical_open_in_C; current=resolved_in_E_design_only | C不定义consumer/job/entry disposition；E已固定五层边界 |
| `R06.6-JOB-CONFIG-OWNER` | historical_open_in_C; current=resolved_in_D4 | D-4已闭合plan/config snapshot owner；C token不取得该owner |
| `R06.6-APP-ERROR-OWNER` | historical_open_in_C; current=resolved_in_E_design_only | E已闭合canonical application error与后续mapping边界 |
| `R06.6-DIGEST-CANONICALIZER` | historical_open_in_C; current=resolved_in_F1_design_only | C按责任固定digest字段/profile；F1已闭合canonical encoding、candidate admission和mismatch category |
| `R06-F-AFFECT-UOW-01` | open_controlled | no frozen UoW file changed; R06.8 affected review still required |
| `03-RPR-S08-PER-PROTOCOL` | open_controlled | Step 08 remains frozen |
| `03-RPR-S09-PER-FLOW` | open | Step 09 remains frozen |

### 27.1 C-wide static closure checklist

| check | conclusion | evidence boundary |
|---|---|---|
| 16 qualified objects each have an independent card | pass_for_C | §§6~21; inventory §5.1 |
| binding / intent / public preparation ref each have one canonical owner | pass_for_C | §§6~9 and §23.1 |
| five token types have private fields, named factories and exact phase | pass_for_C | §§10~14 |
| intent is tagged, immutable and append-before-call | pass_for_C | §15 and §22.5 |
| three result carriers retain exact source token | pass_for_C | §§16~18 |
| probe four-way semantics and positive compatibility are total | pass_for_C | §§19~21 |
| source-token-result chains land in existing local state owners | pass_for_C | §22 and §23.2 |
| no second lifecycle or business truth owner introduced | pass_for_C | §23.2~§23.3 |
| affected downstream definitions are named, not silently treated as current | pass_for_C | §24 |
| raw body / locator / credential / provider response fields are absent | pass_for_C | all Rust-facing schemas; prohibited material appears only in redline prose |
| real implementation commit/run/evidence/signoff/test result fabricated | no | design-only; tests remain planned/not-run |
| formal `03` or implementation code changed by C | no | only design-calibration current pointers and affected owner declaration are synchronized |

## 28. C batch stop gate

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `R06.6-C_done_waiting_user` | binding/phase/identity、five stable tokens、tagged intent、three result carriers、three probe enums、cross-object chains、owner/state/affected-use/Step 07 handoff and static closure are complete design-only；该历史门禁已由用户确认并被D-1消费 | historical action consumed；current pointer=`R06.6-F1-W3_done_waiting_user_before_F2`，next=`wait_user_confirmation_before_R06.6-F2` |

当前正式文档仍为`03-详细设计.md`，当前Step仍为Step06。C批定义继续有效，当前恢复点已推进到`R06.6-F1-W3_done_waiting_user_before_F2`；未经用户明确确认，不得读取或写入F2、R06.7、Step07、正式`03`、任何`04`文件或实现代码。当前不需要提交。

## 29. S07-D cross-crate external-effect validation addendum

> Current affected correction: application retains the object owner; this section only makes validated codec and positive-result compatibility callable by the separate infra adapter crate.

All four intent variants, five token families, three immutable positive result carriers and three probe carriers cross the `observability-application` -> `observability-infra` port boundary. Their fields remain private, but the following methods use `pub` Rust visibility:

- every token `try_rehydrate(...)` and read-only field selector;
- `ExternalEffectIntent::try_rehydrate_*` for its four exact variants, tagged inspection and semantic-equality selector;
- `HandoffDeliveryPreparation::matches_intent`;
- `HandoffDeliveryReceipt::matches_intent`;
- `PeripheralExportPackage::matches_intent`;
- `PublicationProbeOutcome::validate_for`;
- specialization validation for `ExternalPreparationProbe<HandoffDeliveryPreparation>` and `ExternalPreparationProbe<PeripheralExportPackage>`;
- specialization validation for `ExternalDeliveryProbe<HandoffDeliveryReceipt>` and `ExternalDeliveryProbe<PeripheralDeliveryResult>`.

The public visibility is crate-integration visibility, not public protocol exposure. It does not expose token fields as mutable values, permit infra to mint an intent, make a stable token retry authority, or let an adapter select a current binding. Positive payload mismatch remains an adapter consistency error. `Unknown` and `Unsupported` remain indeterminate and cannot be mapped to `Not*`.

The external-effect persistence port in S07-D is append/read-only for intents, phase links, immutable positive result carriers and attempt sidecars. It has no intent state, mutable attempt counter, update, delete, latest-result, provider-body or generic JSON method. This closes `R07-EXTERNAL-EFFECT-CROSS-CRATE-VIS-01` at design-only depth; Step 09/11/13/14 propagation and all implementation tests remain pending.

### 29.1 Publication probe observation-time correction

`PublicationProbeOutcome::Published(PublicationReceipt)` remains the validated application carrier, but an external adapter does not own `PublicationReceipt.observed_at`. The Step 07 publisher port returns a thin finite probe observation whose positive branch contains only the body-free external receipt ref. Application then captures `ClockPort.now()` after the probe returns and constructs the compatible `PublicationReceipt` plus `PublicationProbeOutcome::Published` from the exact stored snapshot/token.

Infra may validate a rehydrated `PublicationReceipt`, but it cannot choose its observation timestamp, copy provider time, use request time, or return a prebuilt receipt from the live probe call. `NotPublished` still requires a formal token-specific negative; `Unknown` and `Unsupported` remain distinct. This closes `R07-PUBLICATION-PROBE-OBSERVED-AT-01` at owner depth without changing the four-way semantic result or granting retry authority.

## 30. S07-D external phase reachability and attempt-accounting addendum

> Current affected correction: the four non-publication tokens are stable across retries, but the earlier C-batch shape did not provide a durable `(plan, work, phase) -> intent` recovery relation or an exact completed-attempt count for `HandoffRetry` / `ExportRetry`. This section supplies those owners. It supersedes only the earlier statement that external-effect persistence contains intents and positive carriers alone; it does not add a mutable intent lifecycle.

### 30.1 `HandoffPreparationFailureReason`

Handoff preparation previously returned a positive carrier or `ApplicationError`. That shape cannot distinguish a known, token-specific non-preparation result from an ambiguous invocation result, and therefore cannot safely drive retry accounting. `application::external_effects` owns the following finite result reason:

```rust
/// Finite known-negative result of one handoff-preparation invocation.
pub enum HandoffPreparationFailureReason {
    /// The adapter formally reported a temporary non-preparation result.
    TemporaryBoundaryFailure,
    /// The target formally rejected the immutable body-free material.
    BoundaryRejected,
    /// A response was received but could not represent a valid preparation.
    InvalidBoundaryResponse,
}
```

`can_retry()` is true only for `TemporaryBoundaryFailure`. Every variant is a known negative for the exact authorized invocation; a transport timeout or result whose external effect is uncertain is not a member and must become `ExternalEffectAttemptIndeterminateKind`. `InvalidBoundaryResponse` is known negative only when the adapter contract can prove that no preparation effect was accepted; otherwise it is `OutcomeUnknown`. Deterministic failures before a provider invocation use the shared `ExternalEffectAttemptPreflightFailure` below. The enum carries no message, status, provider body, endpoint, credential, acceptance verdict or signoff.

Persisted tokens are exactly `temporary_boundary_failure`、`boundary_rejected` and `invalid_boundary_response`. `from_token` rejects empty, alias, case-folded, numeric and unknown values; `as_token` is total. There is no `Other(String)` or boolean retry field.

### 30.2 `ExternalEffectPhaseLink` and owner guard

```rust
/// Append-only relation that makes one committed phase intent reachable from a Job plan item.
pub struct ExternalEffectPhaseLink {
    /// Immutable plan whose item executes or resumes this phase.
    plan_ref: ObservationJobExecutionPlanRef,
    /// Execution lineage owning that plan.
    execution_ref: ObservationJobExecutionRef,
    /// Exact global item identity in the plan.
    work_key: ObservationJobWorkKey,
    /// One of the four non-publication external phases.
    phase: ExternalEffectPhase,
    /// Stable intent reused by every invocation of this phase.
    intent_ref: ExternalEffectIntentRef,
}

/// Exact local owner versions observed by a phase authorization UoW.
pub enum ExternalEffectPhaseOwnerGuard {
    /// Both handoff phases are bound to one handoff row revision.
    ReportHandoff {
        handoff_ref: ReportHandoffRecordRef,
        handoff_row_version: ObservationRepositoryVersion,
    },
    /// Export package preparation is bound to one prepared export row revision.
    ExportPreparation {
        preparation_ref: ExternalAuditExportPreparationRef,
        preparation_row_version: ObservationRepositoryVersion,
    },
    /// Export delivery binds both the prepared export and its local delivery row.
    ExportDelivery {
        preparation_ref: ExternalAuditExportPreparationRef,
        preparation_row_version: ObservationRepositoryVersion,
        delivery_ref: PeripheralDeliveryRef,
        delivery_row_version: ObservationRepositoryVersion,
    },
}
```

`ExternalEffectPhaseLink::try_new(plan, item, phase, intent)` and its public persistence rehydrate factory validate all of the following:

1. `plan_ref` / `execution_ref` equal the immutable plan and the item occurs exactly once under `work_key`;
2. `Publication` is rejected because publication uses the committed outbox pair and its own attempt sidecar;
3. `ReportHandoff` work accepts only `HandoffPreparation` or `HandoffDelivery`, while `ExternalExport` accepts only `ExportPreparation` or `ExportDelivery`;
4. the intent variant, intent phase and token-local owner ref equal the work key and phase;
5. the token binding and material digest equal the matching immutable planned material or committed prior-phase carrier;
6. no link, token or factory reads current routing, current source truth or adapter state.

The durable key is `(plan_ref, work_key canonical bytes, phase)`. It maps to exactly one `intent_ref`; a different ref under the same key is a consistency conflict. A later plan lineage may reuse an existing intent only when `ExternalEffectIntent::has_same_semantic_effect` proves phase, binding, local refs and material digest are all equal and the complete history is either successfully proved or fully resolved with no unresolved authorization. Only then does the new plan append its own link to that same intent. An unresolved intent remains exclusively recoverable by the plan/work lineage copied into its authorization; another plan neither appends a link nor probes/calls on its behalf. Changed immutable material may use a new intent under a new plan, but it cannot rotate the token inside an existing plan or adopt an old intent with different material. This keeps retries of one planned effect stable without incorrectly making `work_key + phase` a lifetime-global material lock.

`ExternalEffectPhaseOwnerGuard` does not depend on a Step 07 point-read envelope. Its application factories consume the loaded owner object plus the explicit positive row version returned with that read:

| factory | exact input and validation |
|---|---|
| `try_for_handoff(handoff, handoff_row_version, phase, work_key, intent)` | phase is HandoffPreparation/Delivery; handoff is the exact ReportHandoff key and locally Prepared; token/material compatible |
| `try_for_export_preparation(preparation, preparation_row_version, work_key, intent)` | phase is ExportPreparation; export owner is exact key and locally Prepared |
| `try_for_export_delivery(preparation, preparation_row_version, delivery, delivery_row_version, work_key, intent)` | phase is ExportDelivery; both rows are locally Prepared and share preparation/consumer/view identity |

Public `try_rehydrate_report_handoff`、`try_rehydrate_export_preparation` and `try_rehydrate_export_delivery` accept exactly the fields of their tagged variants and reject zero/invalid versions, wrong phase or owner mismatch. Read-only selectors expose the tag, typed owner refs and row versions; there is no nullable generic owner accessor or mutable field. The guard is persisted inside the authorization to retain its pre-call basis, but it is not write authority: the pre-call UoW must stage read guards for these exact versions, and every local finalize still uses the owning repository CAS.

### 30.3 Phase attempt carriers

```rust
/// Positive contiguous invocation ordinal scoped to one stable non-publication intent.
pub struct ExternalEffectAttemptOrdinal(NonZeroU32);

/// Immutable local authorization committed before one phase invocation may begin.
pub struct ExternalEffectAttemptAuthorization {
    intent_ref: ExternalEffectIntentRef,
    ordinal: ExternalEffectAttemptOrdinal,
    plan_ref: ObservationJobExecutionPlanRef,
    execution_ref: ObservationJobExecutionRef,
    work_key: ObservationJobWorkKey,
    phase: ExternalEffectPhase,
    owner_guard: ExternalEffectPhaseOwnerGuard,
    authorized_item_row_version: ObservationRepositoryVersion,
    claim_ref: ObservationExecutionClaimRef,
    claim_owner_ref: ObservationClaimOwnerRef,
    fencing_token: ObservationFencingToken,
    claim_row_version: ObservationRepositoryVersion,
    authorized_at: ObservedAt,
}

/// Finite ambiguous invocation observation that requires an exact-token probe.
pub enum ExternalEffectAttemptIndeterminateKind {
    TransportTimeout,
    OutcomeUnknown,
}

/// Durable observation attached to one unresolved authorization ordinal.
pub struct ExternalEffectAttemptIndeterminateObservation {
    intent_ref: ExternalEffectIntentRef,
    ordinal: ExternalEffectAttemptOrdinal,
    kind: ExternalEffectAttemptIndeterminateKind,
    observed_at: ObservedAt,
}

/// Finite deterministic reason why an authorized provider invocation did not begin.
pub enum ExternalEffectAttemptPreflightFailure {
    /// The retained adapter implementation is temporarily unavailable.
    AdapterUnavailable,
    /// The exact retained binding revision cannot be resolved.
    BindingUnavailable,
    /// The retained adapter does not support this exact phase call.
    UnsupportedCapability,
    /// Required immutable local token material is missing or corrupt.
    ImmutableMaterialUnavailable,
    /// Loaded material differs from the committed token or phase link.
    MaterialMismatch,
}

/// Exact known-negative classification retained by a completed invocation.
pub enum ExternalEffectAttemptFailure {
    Preflight(ExternalEffectAttemptPreflightFailure),
    HandoffPreparation(HandoffPreparationFailureReason),
    HandoffDelivery(HandoffDeliveryResult),
    ExportPreparation(ExportFailureReason),
    ExportDelivery {
        result: PeripheralDeliveryResult,
        reason: ExportFailureReason,
    },
    IndeterminateResolvedNotCompleted(ExternalEffectAttemptIndeterminateKind),
}

/// Finite basis proving how one authorization ordinal was resolved.
pub enum ExternalEffectAttemptCompletionBasis {
    InvocationResult,
    ProbeAfterIndeterminateObservation,
    ProbeWithoutDurableInvocationOutcome,
}

/// Resolved local result of one authorized phase invocation.
pub enum ExternalEffectAttemptCompletionKind {
    Succeeded {
        basis: ExternalEffectAttemptCompletionBasis,
    },
    NotCompleted {
        failure: ExternalEffectAttemptFailure,
        basis: ExternalEffectAttemptCompletionBasis,
    },
}

/// Append-only completion paired with one prior authorization.
pub struct ExternalEffectAttemptCompletion {
    intent_ref: ExternalEffectIntentRef,
    ordinal: ExternalEffectAttemptOrdinal,
    kind: ExternalEffectAttemptCompletionKind,
    completed_at: ObservedAt,
}

/// Process-local proof that the two local export-delivery owners reached one
/// token-compatible Delivered relation.
pub struct ExternalEffectExportDeliverySuccessProof {
    intent_ref: ExternalEffectIntentRef,
    preparation_ref: ExternalAuditExportPreparationRef,
    preparation_row_version: ObservationRepositoryVersion,
    delivery_ref: PeripheralDeliveryRef,
    delivery_row_version: ObservationRepositoryVersion,
    consumer_ref: PeripheralConsumerRef,
    view_ref: DashboardAlertExportViewRef,
    package_ref: BodyFreeRef,
    package_digest: DigestSummary,
}

/// Exact positive proof supplied while folding one phase-attempt history.
pub enum ExternalEffectSucceededPhaseProof<'a> {
    HandoffPreparation(&'a HandoffDeliveryPreparation),
    HandoffDelivery(&'a HandoffDeliveryReceipt),
    ExportPreparation(&'a PeripheralExportPackage),
    ExportDelivery(&'a ExternalEffectExportDeliverySuccessProof),
}

/// Validated fold of the complete append-only invocation history for one intent.
pub struct ExternalEffectAttemptAccounting {
    completed_attempt_count: u32,
    completed_additional_attempts: u32,
    unresolved_authorization: Option<ExternalEffectAttemptAuthorization>,
    unresolved_observation: Option<ExternalEffectAttemptIndeterminateObservation>,
    last_completion: Option<ExternalEffectAttemptCompletion>,
}
```

All fields are private. Ordinal `try_new` rejects zero and overflow; `next()` is checked and never wraps. Authorization construction consumes the exact link, committed intent, owner guard, current item row version and complete versioned item claim. It copies the full claim ref / owner / fence / claim-row-version tuple after proving an Active item claim for the same plan, execution and global work key. It cannot be constructed from a scheduler invocation, `JobRunId`, process identity or naked fencing token.

The copied claim tuple is immutable pre-call audit basis, not permanent finalize authority. An observation or completion repository call may use a later fresh Active claim only when its plan、execution and global work key equal the authorization lineage and its same-subject fence is strictly newer than the copied fence; an equal fence requires the exact copied claim ref/owner/version tuple. An older fence、different plan/execution/work key or cross-plan claimant is rejected. The fresh claim protects the recovery UoW; it never rewrites the authorization or claims that the original owner remained alive.

#### 30.3.1 Factory, rehydrate and selector contract

No Step 06 object constructor accepts `Versioned<T>` or another Step 07 technical envelope. Factories receive Step 06-owned objects plus explicit `ObservationRepositoryVersion` values:

| carrier | application factory | public persistence rehydrate | required selectors |
|---|---|---|---|
| `ExternalEffectPhaseLink` | `try_new(plan, item, phase, intent)` | `try_rehydrate(plan_ref, execution_ref, work_key, phase, intent_ref)` | plan/execution/work/phase/intent refs |
| `ExternalEffectAttemptOrdinal` | `try_new(NonZeroU32)`; checked `next()` | same validated value path | `get() -> u32` |
| `ExternalEffectAttemptAuthorization` | `try_new(link, intent, owner_guard, item, item_row_version, claim, claim_row_version, ordinal, authorized_at)` | every stored field in declaration order, all typed | intent/ordinal/plan/execution/work/phase/owner guard/item version/full claim tuple/time |
| `ExternalEffectAttemptIndeterminateObservation` | `try_new(authorization, kind, observed_at)` | exact intent/ordinal/kind/time | all four fields |
| `ExternalEffectAttemptCompletion` | `try_succeeded(authorization, basis, completed_at)` or `try_not_completed(authorization, failure, basis, completed_at)` | exact intent/ordinal/tagged kind/time | all fields plus `is_succeeded()` and typed failure/basis views |
| `ExternalEffectExportDeliverySuccessProof` | `pub fn try_new(intent, package, preparation, preparation_row_version, delivery, delivery_row_version)` | none; process-local only | intent/owner/package refs and exact owner row versions |
| `ExternalEffectSucceededPhaseProof<'a>` | exact tagged variant borrowing one already validated carrier/proof | none; borrowed fold input only | phase plus typed borrowed proof |
| `ExternalEffectAttemptAccounting` | `try_from_history(intent, links, authorizations, observations, completions, succeeded_phase_proof: Option<ExternalEffectSucceededPhaseProof<'_>>)` | not row-rehydrated directly; always rebuilt from complete rows and zero-or-one exact proof | counts, unresolved authorization/observation, last completion |

`ExternalEffectSucceededPhaseProof` is a process-local fold input, not another durable row. Its enum and tagged variants are public only for application/infra crate integration, have no serde/rehydrate path and expose no mutable member; entry/protocol callers never receive or construct it. For HandoffPreparation、HandoffDelivery and ExportPreparation, the repository point-loads the zero-or-one canonical positive carrier and supplies its borrowed phase-exact variant. Repository cardinality checks reject duplicate carrier rows before accounting construction. For ExportDelivery, no receipt row is created: application loads the exact export preparation、package and peripheral delivery rows and constructs `ExternalEffectExportDeliverySuccessProof` only when both local owners are `Delivered` with `PeripheralDeliveryResult::Delivered`, all failure/block fields are absent, preparation/delivery/consumer/view/package relations match the committed delivery token, and both row versions are positive.

The export-delivery proof copies only body-free refs, package digest and row versions. It has no public rehydrate/serde path, cannot be cached across reloads, and is rebuilt from current committed rows every time accounting is requested. It proves a local terminal relation, not provider acceptance or consumer processing. `try_from_history` requires `Some(exact matching proof)` if and only if the history contains one `Succeeded` completion, rejects a proof for failed/unresolved/no-attempt history, and rejects wrong-phase, wrong-token, duplicate or incomplete proof. A successful completion is therefore never accepted from sidecar rows alone.

All `ExternalEffectAttemptAuthorization` fields listed in the table have public read-only selectors for application/infra integration. In particular, the global unresolved locator can inspect intent、ordinal、plan、execution、work key and phase without exposing mutable state or claim authority. Claim ref/owner/fence/version selectors remain audit inputs; only a current registered claim row authorizes a recovery commit.

`ExternalEffectAttemptIndeterminateKind` tokens are exactly `transport_timeout` and `outcome_unknown`. `ExternalEffectAttemptPreflightFailure` tokens are exactly `adapter_unavailable`、`binding_unavailable`、`unsupported_capability`、`immutable_material_unavailable` and `material_mismatch`. `ExternalEffectAttemptCompletionBasis` tokens are exactly `invocation_result`、`probe_after_indeterminate_observation` and `probe_without_durable_invocation_outcome`. Every parser is exact and rejects alias/unknown/free string.

Preflight retryability is total: only `AdapterUnavailable` may be considered retryable by the later operation policy. `BindingUnavailable` and `UnsupportedCapability` require state/config/manual change; immutable material loss and material mismatch are consistency/manual failures. This enum does not itself authorize another attempt; accounting, frozen policy, backoff, owner state and current claim remain mandatory.

`ExternalEffectAttemptFailure` validation is phase-total:

| phase | legal direct known failure | illegal completion shape |
|---|---|---|
| any non-publication phase before provider invocation | `Preflight(exact finite reason)` after the adapter proves zero provider call | provider text, a timeout after send or a claim/config guess |
| `HandoffPreparation` | `HandoffPreparation(reason)` | delivery/export reason or timeout guessed as known-negative |
| `HandoffDelivery` | `HandoffDelivery(RetryableFailure\|PermanentFailure\|Rejected)` | `Delivered` nested under failure or any preparation reason |
| `ExportPreparation` | `ExportPreparation(reason)` | delivery result pair or a timeout without formal non-effect proof |
| `ExportDelivery` | `ExportDelivery { result != Delivered, reason }` with exact retryability compatibility | `Delivered`, missing reason or retryability mismatch |
| any non-publication phase after formal probe negative | `IndeterminateResolvedNotCompleted(exact durable kind)` | a different cause, provider text or new generic failure |

For `ExportFailureReason::DeliveryTimeout`, direct `InvocationResult` completion is legal only when the adapter contract formally proves no effect; an ordinary timeout remains `TransportTimeout`. A `Preflight` completion uses `InvocationResult` as the durable authorization-resolution basis even though the provider call did not begin; it consumes the authorized ordinal and cannot claim target behavior. `IndeterminateResolvedNotCompleted` is legal only with a probe completion basis. These rules prevent a timeout or local preflight defect from being relabeled as a free retry.

### 30.4 Contiguity, result linkage and retry budget

`ExternalEffectAttemptAccounting::try_from_history(intent, links, authorizations, observations, completions, succeeded_phase_proof: Option<ExternalEffectSucceededPhaseProof<'_>>)` validates the complete canonical link set, attempt history and zero-or-one phase-exact positive proof for one intent. Every authorization's plan/work/phase must resolve through exactly one supplied link, all links must target this intent, and duplicate links or an authorization without its exact link fail closed. A link not referenced by an authorization is legal only when the history has one proved successful completion: it represents guarded no-call adoption by a later semantic-equal plan. With no proved success, every supplied link must own at least one authorization. It exposes read-only `completed_attempt_count()`、`completed_additional_attempts()`、`unresolved_authorization()`、`unresolved_observation()` and `last_completion()` selectors. Its invariants are:

1. ordinals begin at one and are contiguous per `intent_ref`; every observation/completion has exactly one byte-compatible prior authorization;
2. at most one observation and one completion exist per ordinal; an observation remains immutable after a later completion;
3. a new authorization requires all lower ordinals completed, no unresolved authorization and no prior successful completion;
4. `completed_additional_attempts = completed_attempt_count.saturating_sub(1)`; no independently writable counter exists;
5. `HandoffRetry` is applied independently to handoff preparation and handoff delivery accounting; `ExportRetry` is likewise applied independently to export preparation and export delivery. One phase cannot borrow or erase another phase's budget;
6. a direct positive completion requires the matching positive carrier, when that phase has one, to be appended in the same guarded UoW; a direct known failure requires the compatible local owner/item/report classification in that UoW;
7. successful preparation completion is nonterminal for the two-phase Job item: the positive carrier commits under an exact unchanged local Prepared-owner guard, while the item stays `Running` and the report stays `Draft` for delivery;
8. successful delivery completion is terminal-compatible and must commit with the local delivery owner, item classification and Draft report fold;
9. an indeterminate observation appends without a completion and leaves item/report `Running`/`Draft`; it cannot create a new ordinal, terminal report or retry classification;
10. a `Prepared` / `Delivered` probe completes the unresolved ordinal and is finalize-only; `NotPrepared` / `NotDelivered` completes that ordinal with `IndeterminateResolvedNotCompleted`, after which any new call needs the next ordinal and a separate pre-call commit;
11. `Unknown` / `Unsupported` appends no completion and never consumes, resets or authorizes retry budget;
12. across all intents, at most one authorization without a completion may exist for the same global `work_key + phase`; changed material/new plan does not bypass an unresolved old token;
13. `authorized_at` / `completed_at` are local `ClockPort` observations used by the later frozen backoff rule, not provider time, claim authority time or business ordering.

A prior successful completion makes later authorization structurally invalid for that intent. A known non-retryable direct failure remains auditable and is rejected by application policy before another authorization. A formal probe negative only establishes that the exact old ordinal did not complete externally; the application must still use the frozen policy, complete count, backoff, current owner state and a current claim before authorizing the next ordinal.

### 30.5 Persistence and transaction contract

The append-only persistence set now consists of intent, phase link, positive carriers and phase-attempt sidecars. It has no mutable status row, latest-only failure, counter update, delete, reset or token rotation operation.

```text
external-preparation local prerequisite UoW:
  acquire/validate the exact item claim
  -> locate unresolved authorization for the global work-key + preparation phase
  -> same-lineage unresolved routes to recovery; foreign-lineage unresolved causes
     zero-write claim release and stop
  -> only when absent, load plan/item/Draft report and P7/P14 inputs
  -> evaluate one fresh complete P7 handoff or P14 export-preparation decision
  -> stage the owning local transition to Prepared plus H4/H9 record/followers
  -> stage Planned|FailedRetryable -> Running and the matching Draft fold
  -> commit with no intent, phase link or authorization

phase pre-call UoW after the committed prerequisite:
  reload the Running item, Draft report, exact Prepared owner(s) and current item claim
  -> register the exact claim, item, report and owner guards
  -> prove no unresolved authorization exists for this global work-key + phase
  -> construct or recover the semantic-stable intent
  -> inspect its complete accounting before choosing a branch
  -> when new, append intent + plan link + ordinal-one authorization
  -> when reused after an eligible resolved failure, append the current plan link
     when absent + the next authorization
  -> commit before any adapter call

existing phase retry UoW:
  load link + intent + complete accounting + local owner/item/claim
  -> prove the previous completion is policy-eligible and backoff is satisfied
  -> if a prior retryable owner failure left the owner non-Prepared, first commit a
     separate fresh P7/P14 reprepare UoW and Running/Draft reentry
  -> reload the unchanged semantic material and append only the next authorization
  -> commit before any adapter call
```

If the prerequisite policy produces an expected Pending/Blocked/non-Prepared result, application may commit only the owning local transition and compatible Job classification; it creates no intent/link/authorization and opens no adapter call gate. A stale decision、binding error、factory error or persistence error rolls back with zero visible prerequisite writes. An already committed exact Prepared owner may be guarded rather than transitioned, but the item/Draft fold must still reach committed Running before the preparation authorization UoW. A retryable delivery failure never jumps directly from local Failed to another authorization: handoff consumes a fresh complete P7 decision; export consumes fresh complete P14 decisions for every failed preparation/delivery owner that must return to Prepared. If those decisions change binding/material or do not restore a token-compatible Prepared relation, the current plan stops and cannot rotate its intent.

Cross-plan semantic reuse has one no-new-call success branch and one fail-closed exclusion. If the selected intent already has a successful completion and its exact positive proof, the current plan may append only its missing phase link in the same guarded UoW as the compatible local/item/report finalize or in-item phase advance; it appends no authorization. If the selected intent has an unresolved authorization, the current plan stops without a link, authorization, probe or call. Only the authorization's original plan/work lineage may acquire its own current item claim and run exact-token probe recovery. After that history resolves, a later plan may re-evaluate semantic reuse. Thus cross-plan reuse never changes the plan/work/item-claim tuple retained by an existing authorization.

If a later plan already acquired the globally competing work-key claim before discovering that unresolved intent, it stages no business/sidecar write, explicitly releases that claim after the read-only decision, and schedules/exposes recovery for the original plan lineage. It cannot retain or renew the claim while waiting, because doing so would prevent the only lineage allowed to resolve the authorization from reacquiring the same global subject.

An ambiguous pre-call commit is reconciled by point-loading the phase link, intent and exact ordinal. A known rollback permits rebuilding the same not-yet-committed ordinal; an unknown commit never permits a call until durable authorization presence is known. Once an authorization exists, recovery probes its exact stable token before any later invocation, even when no invocation-result observation survived.

The repository enforces the functional dependencies `(plan, work, phase) -> intent`, `(intent, ordinal) -> authorization`, and `(intent, ordinal) -> at-most-one observation/completion`, plus semantic uniqueness of intent material and an atomic unresolved gate over `(work_key canonical bytes, phase)`. The gate is released semantically only by an appended completion; rows are never deleted or status-mutated. Multiple resolved intents for the same work/phase remain legal when different material/new plans require them, so this is not lifetime-global intent uniqueness. Exact duplicate bytes are accepted only as reconciliation of an ambiguous local commit; different bytes under the same key are a persistence invariant violation.

### 30.6 Owner closure and downstream propagation

| affected ID | current owner conclusion | remaining propagation |
|---|---|---|
| `R07-EXTERNAL-PHASE-LINK-01` | resolved at Step 06 owner depth by plan/work/phase link uniqueness plus semantic-equal cross-plan intent reuse | Step 07 S07-D repository/signatures closed design-only; Step 09/11/13/16 frozen affected use |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | resolved at Step 06 owner depth by per-intent contiguous authorization/observation/completion accounting | Step 07 S07-D call cuts closed design-only; Step 09/11/12/13/14/16 frozen affected use |
| handoff preparation known-negative owner | resolved by finite `HandoffPreparationFailureReason`; timeout/unknown remains separate | Step 07 port outcome and Step 12 mapping |
| business truth / external acceptance | unchanged; none of these objects owns either | all downstream writers remain prohibited |

No external upstream blocker is introduced. These are current S07-D affected corrections to an internal owner gap. Formal `03`, Step 08+, `04`, implementation code and test evidence remain frozen/not-run; no commit, run id, evidence alias, signoff or acceptance result is claimed.
