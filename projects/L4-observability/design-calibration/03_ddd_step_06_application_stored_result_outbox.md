# L4-observability 03-详细设计 Step 06 - R06.6-B application stored result / outbox 对象契约

> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 上游输入: `design-calibration/03_ddd_step_06_application_input_boundary.md`
> 前置对象卡: `design-calibration/03_ddd_step_06_application_operation_context_idempotency.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 当前模式: full-restart 定向粒度修复
> 当前子批次: `R06.6-B`
> 专项完成状态: `R06.6-B_done_confirmed_historical_checkpoint`
> 当前整体恢复点: `R06.6-D2_done_waiting_user`
> 当前下一动作: `wait_user_confirmation_before_R06.6-D3_job_item_state_outcome_item_cards`

## 1. 子批次状态与写入门禁

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application::stored_result`、`application::outbox`；`contracts::refs` affected owner closure |
| 上游停审点 | `R06.6-A_done_waiting_user`；用户已明确确认继续，允许进入 B 批 |
| 本批覆盖 | exact stored replay、result classification、immutable outbox payload snapshot、publication marker 与 publication outcome carrier |
| 本批不覆盖 | external effect intent / binding / publication token、job plan / claim / report、service facade、repository trait、逐接口 flow、retry 配置、Step 07 及正式 `03` |
| 正式回填 | blocked；必须等待 R06.6-D~F、R06.7、R06.8 与 Step 19 重装配 |
| 本专项历史 gate_status | `R06.6-B_done_waiting_user`；已由用户确认并被 C 批消费 |
| 当前整体 gate_status | `R06.6-D2_done_waiting_user` |
| 当前唯一动作 | 等待用户确认；不得进入`R06.6-D3` |
| 外部上游 blocker | `none` |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`；`R06.6-DISPOSITION-LAYER=open_controlled`；`R06.6-APP-EXT-OWNER=resolved_in_C`；`R06.6-APP-ERROR-OWNER=open` |
| 是否修改正式 `03` | 否 |
| 是否需要提交 | 不需要；本批只修改设计仓中间产物和台账 |

### 1.1 写入前检查

| 检查项 | 结论 |
|---|---|
| 项目级门禁 | 用户已确认从 A 批进入 B 批；不得进入 C 批或其他正式文档 |
| 文档级门禁 | `03_ddd_calibration_flow.md` 继续冻结 Step 07~19 与 formal assembly |
| Step / 模块门禁 | 只允许闭口 stored result / outbox 对象，不写 port、DTO、flow 或 persistence schema |
| 逐对象要求 | 每个有独立字段、validation、state 或 wire 责任的类型必须有独立卡；secondary carrier 不得只留名字 |
| 历史材料处理 | 主控历史 application 草稿、冻结 Step 07~13 只作 repair input / use-site，不是 current definition source |
| disposition 冲突处理 | 本批只定义 stored result 的事实分类 `OperationResultDisposition`；不定义 consumer/job/entry disposition |
| external binding 冲突处理 | outbox snapshot 预留 opaque binding 字段，但其唯一 owner 留 R06.6-C；本批不复制或 mint binding |
| 正式正文污染 | `no`；本批不修改 `03-详细设计.md` |

## 2. 本批输入与权威顺序

| 输入 | 读取范围 | 本批用途 | 权威限制 |
|---|---|---|---|
| `03_ddd_step_06_application_input_boundary.md` | §§2~11 | B 批 capability、inventory、blocker 与停止规则 | inventory 不能替代对象卡 |
| `03_ddd_step_06_application_operation_context_idempotency.md` | §§6~12 | operation、actor、digest、reservation/result pointer 前置契约 | A 批对象不在本文件重定义 |
| `03_ddd_step_06_object_contracts.md` | §§6.6、6.15 与历史 application 草稿 | candidate / secondary carrier 发现和冲突诊断 | 历史 schema 仅作 repair input |
| `03_ddd_step_06_contracts_carriers.md` | typed ref、schema、digest owner registry | 复用 `BodyFreeRef`、`SchemaVersion`、`DigestSummary` 等 current carrier | 不把 contracts carrier变成 application truth |
| 正式 `02-概要设计.md` | outbox publication state 与不反写 truth 边界 | 确认四态语义和 publication failure 边界 | 不提供 Rust-facing完整 schema |
| 冻结 Step 08 | result/public surface 与 outbound payload use-site | 反查 exact protocol decoder 和 protocol snapshot 字段 | protocol DTO 不夺取 application durable owner |
| 冻结 Step 10 | outbox state subject / transition use-site | 反查四态、终态和 forbidden transition | Step 10 的“已补 Step 06”是 historical claim |
| 冻结 Step 11 | stored-result/outbox logical store 与 same-UoW invariant | 反查字段来源、一对一关系和 result-before-complete | 不在本批写 table / index / repository schema |
| 冻结 Step 12 / 13 | missing/corrupt replay、retry eligibility、same-token boundary | 反查 fail-closed 与 retry exclusion | 不在本批定义 error family、claim、port 或 retry policy |
| L1-governance / L1-artifact Step 06 / 07 | application helper 和 outbox 对象卡粒度 | 只参考组织深度 | 不复制相邻域 truth 或类型名 |

### 2.1 权威冲突处理

| 冲突 | 当前裁定 |
|---|---|
| `OperationResultDisposition` 与 public outcome / consumer / job / entry disposition 近义 | 本类型只描述已经保存的 exact replay surface 所代表的 application-local事实分类；禁止作为 handler action、ack、retry、job lifecycle 或 public outcome |
| Step 08 `ObservationOutboundEventPayloadSnapshot` 与 application stored snapshot | protocol snapshot 保持纯协议 surface；application durable owner 为 `ObservationOutboxPayloadSnapshot`，额外冻结 opaque `effect_binding_ref`，不得把 binding 暴露进 event bytes |
| Step 08 snapshot 使用裸 `Vec<u8>` | current application durable carrier 使用 `BodyFreeSerializedEvent`；冻结 Step 08 后续 affected review 必须映射到该类型 |
| 概要曾列 `Failed -> Pending` | current detailed design 禁止该 durable transition；retry eligibility / claim 是 Step 07/13 consumer，不改回 `Pending` |
| 主控旧 `ObservationOutboxRecord` 未包含 immutable snapshot 对象卡 | historical repair input；B 批补齐 record、snapshot、ref、failure/receipt/dead-letter 全链 |
| `ExternalEffectBindingRef` owner 在 B 批尚未收稳 | B 批只消费 opaque ref并验证presence/equality；该历史缺口已由C批关闭：唯一owner=`application::runtime`，resolver/catalog仍留后续Step07/14 affected review |
| `ApplicationError` 在 Step 06/07/12 交叉 | 本批函数只引用 future canonical error family；具体 variants 由 R06.6-E 闭口，不创建临时 error enum |
| 四个 outbox ref 被 public contracts 直接使用 | `OutboxRecordRef`、`OutboxPayloadSnapshotRef`、`OutboundEventRef`、`DeadLetterRef` 的 value type owner 上提为 `contracts::refs`；application `IdGeneratorPort` 保留唯一 mint authority，application outbox 只组合这些 ref |
| `262144` 与冻结 `04` request-body candidate 数字相同 | 权威方向固定为 Step 06 compile-time object invariant；`MAX_BODY_FREE_SERIALIZED_EVENT_BYTES=262_144` 不读取、不继承 `boundary.max_request_body_bytes`，后者也不能提高本对象上限 |

## 3. SOP 问题回答

### 3.1 本批需要完成哪些 capability

| capability | 输入 | 输出 | 状态 / 副作用 | 后续承接 |
|---|---|---|---|---|
| exact result capture | 已完成 operation 的 protocol surface、reservation identity 与 request context | immutable `StoredObservationResult` | staged save；本对象自身不访问 repository | Step 07 save/get；Step 09/11 same-UoW；Step 13 replay |
| exact replay validation | completed reservation + stored result + supported decoder | validated replay surface | zero write；任一 mismatch fail closed | Step 08 decoder；Step 12 error mapping |
| committed payload capture | accepted local change + outbound protocol snapshot + exact binding | immutable `ObservationOutboxPayloadSnapshot` | 与 owner change / record 同 UoW append | Step 08 mapper；Step 09/11 append |
| publication lifecycle | outbox record + typed publisher outcome | `Pending/Published/Failed/DeadLettered` marker | 只更新本地 publication row；不反写 owner truth | Step 07 repository；Step 10/13 state/retry |
| publication forensic surface | body-free receipt/failure/dead-letter carrier | 可审计的本地 pointer / classification | 不保存 provider response、credential 或 raw body | Step 12 recovery；Step 15 telemetry |

本批不拥有业务 truth、source truth、external target truth、bus ack truth、真实 evidence alias、final verdict、signoff 或真实 run identity。`Published` 只表示 exact stored snapshot 对应的外部调用已返回并保存可核对 receipt；它不证明下游业务消费、验收或最终结论。

### 3.2 哪些对象承接这些 capability

| 对象 | 承接功能 | 对象类别 | 不承接的功能 / 禁止事项 |
|---|---|---|---|
| `StoredObservationResultKind` | 选择 exact replay decoder family | finite enum | 不表示 public outcome、operation state或error code |
| `BodyFreeSerializedResult` | 保存受限 exact replay bytes | bounded value object | 不接受 source/evidence/provider body；不提供 `Debug` / `Display` 全量输出 |
| `StoredObservationReplaySurface` | 绑定 kind/schema/bytes/digest | immutable helper | 不读取 current truth、不做 protocol upgrade |
| `OperationResultDisposition` | 保存结果事实分类 | finite enum | 不驱动 ack/retry/dead-letter或job state |
| `StoredObservationResult` | 绑定 reservation/context/public ref与surface | immutable durable object | 不完成 reservation、不执行 replay handler |
| outbox ref / outcome secondary carriers | 提供 typed identity 与 body-free publication result | value / enum / snapshot helper | 不编码 endpoint/topic/credential/provider response |
| `ObservationOutboxPayloadSnapshot` | 保存 exact event bytes与historical binding | immutable durable object | 不保存 current route/default，不从 truth 重建 |
| `OutboxPublicationState` | publication lifecycle | finite state enum | 不表达 worker loop、claim、attempt或owner truth |
| `ObservationOutboxRecord` | 绑定 snapshot、cursor与publication outcome | durable state object | 不保存 payload bytes，不执行外部 publish |

### 3.3 本批为何需要独立 application stored snapshot

public outbound event snapshot 是下游协议可见的 pure surface，不应包含 deployment binding。application durable snapshot 必须同时冻结 exact protocol snapshot 和当时选择的 opaque binding ref，保证以后 publish / retry 不会使用 current default destination。两者关系固定为：

```text
accepted committed change
  -> pure protocol event snapshot
  -> application stored snapshot + historical binding ref
  -> outbox record Pending
  -> later publisher consumes stored snapshot only
```

关键说明：

- 图表达对象构造和 owner 边界，不表达具体 UoW 调用顺序。
- binding ref 不进入 serialized event bytes，也不暴露给下游 consumer。
- publisher 不得回查 current truth、current config 或 current route重建任何字段。
- publication marker 变化不修改 immutable snapshot 或 owner truth。

### 3.4 哪些事项必须 defer

| defer item | exact owner | 本批已提供的输入 | 实现暂停条件 |
|---|---|---|---|
| repository trait / CAS version | Step 07 / Step 11 | object factory、rehydrate、transition contract | port 需要本批未定义字段时回开 Step 06 |
| public result / event DTO decoder | Step 08 | result kind、schema、exact bytes与digest | decoder 无 total kind/schema map时不得 replay |
| save / append / complete 调用顺序 | Step 09 / Step 11 | result-before-complete、record/snapshot pair invariant | 任一写入可独立提交时暂停 |
| retry eligibility / claim / external token / probe | Step 13，token object由 R06.6-C | `Failed` 不回 `Pending`、snapshot immutable | retry需改 payload/binding或无stable token时暂停 |
| error variants / public mapping | R06.6-E / Step 12 | typed failure语义和 fail-closed类别 | 使用自由字符串或 generic internal error时暂停 |
| config retry bounds / binding resolver | Step 14 / `04` | opaque binding ref、failure classification | 需要 endpoint/topic/credential进入application object时暂停 |

## 4. 当前文档问题诊断与改动前后对比

| 位置 | repair input 问题 | B 批修复 |
|---|---|---|
| 主控历史 stored-result 草稿 | `BodyFreeSerializedResult` 无大小、canonical decode、redaction与 debug 规则 | 独立 value object 卡固定 bounds、construction、inspection和禁止输出 |
| 主控历史 result factory | 无 rehydrate 与 reservation/surface compatibility validator | 独立定义 create/rehydrate/replay compatibility |
| 主控 / Step 07 disposition use-site | 多层 disposition 名称接近 | 只保留 stored-result fact classification，consumer/job/entry仍为 `UR/DX` |
| Step 08 / Step 07 outbox snapshot | pure protocol snapshot 与 durable binding snapshot名字/owner漂移 | 明确两个 owner和 lossless mapper；application stored snapshot唯一包含 binding ref |
| 主控历史 outbox record | secondary carrier只点名，无法落码 | 每个 ref、receipt、failure、dead-letter、serialized-event carrier独立闭口 |
| 概要 / Step 10 retry | 存在 `Failed -> Pending` 旧口径 | current state matrix固定 Failed可被structural planning scan返回，再由application评估policy；不产生回Pending transition |
| publication failure | 容易被误读为 owner truth失败 | 所有 transition 明确只改变publication marker，不回滚/改写owner truth |

## 5. B 批对象总账与写入批次

### 5.1 对象资格总账

| ID | current object | owner | 资格 | 本批处理 |
|---|---|---|---|---|
| B-SR01 | `StoredObservationResultKind` | `application::stored_result` | FC | 独立 enum 卡 |
| B-SR02 | `BodyFreeSerializedResult` | `application::stored_result` | FC | 独立 bounded bytes 卡 |
| B-SR03 | `StoredObservationReplaySurface` | `application::stored_result` | FC | 独立 immutable surface 卡 |
| B-SR04 | `OperationResultDisposition` | `application::stored_result` | FC | 独立 finite classification 卡 |
| B-SR05 | `StoredObservationResult` | `application::stored_result` | FC | 独立 durable object 卡 |
| B-OB01 | `OutboxRecordRef` | `contracts::refs`；application mints | TC | 独立 transparent typed ref 卡 |
| B-OB02 | `OutboxPayloadSnapshotRef` | `contracts::refs`；application mints | TC | 独立 transparent typed ref 卡 |
| B-OB03 | `OutboundEventRef` | `contracts::refs`；application mints | TC | 独立 transparent typed ref 卡 |
| B-OB04 | `BodyFreeSerializedEvent` | `application::outbox` | FC | 独立 bounded bytes 卡 |
| B-OB05 | `PublicationReceipt` | `application::outbox` | FC | 独立 body-free result卡 |
| B-OB06 | `PublicationFailureKind` | `application::outbox` | FC | 独立 finite enum卡 |
| B-OB07 | `PublicationFailure` | `application::outbox` | FC | 独立 typed failure卡 |
| B-OB08 | `DeadLetterReason` | `application::outbox` | FC | 独立 finite enum卡 |
| B-OB09 | `DeadLetterRef` | `contracts::refs`；application mints | TC | 独立 transparent typed ref卡 |
| B-OB10 | `ObservationOutboxPayloadSnapshot` | `application::outbox` | FC | 独立 immutable durable snapshot卡 |
| B-OB11 | `OutboxPublicationState` | `application::outbox` | FC | 独立 state enum卡 |
| B-OB12 | `ObservationOutboxRecord` | `application::outbox` | FC | 独立 durable state object卡 |

`StoredObservationResultRef`、`IdempotencyRef`、`BodyFreeRef`、`ActorSafeRef`、`SchemaVersion`、`DigestSummary`、`RequestDigest`、`ObservedAt`、`ObservationCommittedCursor`、`TraceCorrelationRef` 与 `ExternalEffectBindingRef` 是引用输入，不在本文件复制定义。`ExternalEffectBindingRef` 仍受 `R06.6-APP-EXT-OWNER` 控制；B 批只要求它是已校验、opaque、body-free的历史 binding identity。

### 5.2 分批写入状态

| 写入批次 | 范围 | 状态 | 内容完整 | 停审点 |
|---|---|---|---|---|
| `B-1` | §§1~5 门禁、输入、SOP回答、诊断、总账 | written | yes | local_check |
| `B-2` | §§6~10 stored-result五张对象卡 | written | yes | `application::stored_result` 模块停审 |
| `B-3` | §§11~22 outbox十二张对象卡 | written | yes | `application::outbox` 模块停审 |
| `B-4` | §§23~29 跨模块审计、传播、回填草稿、台账与静态检查 | written | yes | `R06.6-B_done_waiting_user` |

## 6. `StoredObservationResultKind` 对象卡

### 6.1 Rust-facing definition

```rust
/// Finite decoder family for an immutable stored observation result.
pub enum StoredObservationResultKind {
    /// Exact committed command success surface.
    CommandResult,
    /// Exact durable command rejection surface.
    CommandRejection,
    /// Exact inbound consumer receipt surface.
    ConsumerReceipt,
    /// Exact terminal operations job report surface.
    JobReport,
}
```

| variant | stable token | allowed operation family | required public surface | forbidden interpretation |
|---|---|---|---|---|
| `CommandResult` | `command_result` | Command | committed command result | 不等于任意 domain `Accepted` state |
| `CommandRejection` | `command_rejection` | Command | durable rejection result | pre-UoW invalid input不得伪造 stored rejection |
| `ConsumerReceipt` | `consumer_receipt` | Inbound Consumer | durable consumer receipt | 不等于 worker ack/dead-letter action |
| `JobReport` | `job_report` | Job | terminal report surface | 不等于外部 run、验收或signoff |

| member | exact signature | contract |
|---|---|---|
| parse token | `pub(crate) fn from_token(token: &str) -> Result<Self, ApplicationError>` | 只接受四个 exact token；unknown、case alias、numeric alias全部失败 |
| wire token | `pub const fn as_token(&self) -> &'static str` | 返回固定 token，不使用 Rust ordinal / debug text |
| family check | `pub(crate) fn accepts_operation(&self, operation: &ObservationOperationName) -> bool` | CommandResult/Rejection只接受Command，Receipt只接受Consumer，JobReport只接受Job；Query始终false |

增加或改变 variant 必须重开 Step 06/08/11/13 compatibility review。该 enum 不允许 `Other(String)`、默认首变体或从 public outcome 文本推导。

## 7. `BodyFreeSerializedResult` 对象卡

### 7.1 Rust-facing definition

```rust
/// Bounded canonical bytes of one body-free public result surface.
pub struct BodyFreeSerializedResult(Vec<u8>);
```

| item | current contract |
|---|---|
| owner | `application::stored_result`，planned file `crates/application/src/stored_result.rs` |
| size | encoded byte length `1..=65536`；empty或超限拒绝，不截断、不压缩后绕过上限 |
| source | Step 08 exact result/receipt/report encoder对已校验 typed surface的canonical输出 |
| body-free gate | encoder必须证明schema只含 typed refs、finite marker、safe metadata和bounded safe text；不得靠扫描/替换任意bytes宣称body-free |
| immutability | construction后不暴露`&mut [u8]`，不允许in-place schema upgrade |
| debug / display | 不实现`Display`；custom `Debug`只显示类型、长度、digest profile hint，不显示bytes或UTF-8内容 |
| persistence | exact bytes原样保存/读取；adapter不得trim、reformat、重新序列化或改字段顺序 |

| factory / member | exact signature | contract / failure |
|---|---|---|
| canonical factory | `pub(crate) fn try_from_canonical(bytes: Vec<u8>) -> Result<Self, ApplicationError>` | 校验非空、上限和canonical encoder provenance；不解析raw external body |
| validated rehydrate | `pub(crate) fn try_rehydrate(bytes: Vec<u8>) -> Result<Self, ApplicationError>` | 同样执行大小和canonical framing校验；malformed为consistency error |
| bytes view | `pub(crate) fn as_bytes(&self) -> &[u8]` | 只供digest、exact decoder与repository mapper；不得进入日志/metric label |
| length | `pub const fn len(&self) -> usize` | 用于bound/test；不表示业务记录数 |
| empty check | `pub const fn is_empty(&self) -> bool` | validated实例永远false；只作defensive invariant |

必测 empty、65536/65537 bytes、malformed canonical framing、round-trip byte equality、custom Debug不泄露内容、UTF-8/raw body样例不会因“可序列化”而自动通过。

## 8. `StoredObservationReplaySurface` 对象卡

### 8.1 Rust-facing definition

```rust
/// Exact immutable protocol surface returned for a compatible duplicate request.
pub struct StoredObservationReplaySurface {
    result_kind: StoredObservationResultKind,
    schema_version: SchemaVersion,
    serialized_surface: BodyFreeSerializedResult,
    digest_summary: DigestSummary,
}
```

| field | type | source | validation / missing behavior |
|---|---|---|---|
| `result_kind` | `StoredObservationResultKind` | operation-specific result assembler | 必须与 operation family及解码目标一致 |
| `schema_version` | `SchemaVersion` | Step 08 exact encoder | unsupported retained version fail closed；不得隐式升级 |
| `serialized_surface` | `BodyFreeSerializedResult` | canonical result encoder | required；immutable exact bytes |
| `digest_summary` | `DigestSummary` | digest over exact serialized bytes | required；rehydrate/replay时重新核对，不覆盖stored值 |

| factory / member | exact signature | contract |
|---|---|---|
| create | `pub(crate) fn try_new(result_kind: StoredObservationResultKind, schema_version: SchemaVersion, serialized_surface: BodyFreeSerializedResult, digest_summary: DigestSummary) -> Result<Self, ApplicationError>` | 校验schema support、digest profile与exact bytes一致 |
| rehydrate | `pub(crate) fn try_rehydrate(result_kind: StoredObservationResultKind, schema_version: SchemaVersion, serialized_surface: BodyFreeSerializedResult, digest_summary: DigestSummary) -> Result<Self, ApplicationError>` | 执行与create相同不变量；不从current protocol重新编码 |
| kind | `pub const fn result_kind(&self) -> &StoredObservationResultKind` | 返回typed classifier |
| schema | `pub const fn schema_version(&self) -> &SchemaVersion` | 返回original stored schema |
| bytes | `pub(crate) fn serialized_surface(&self) -> &BodyFreeSerializedResult` | 只供validated decoder |
| digest | `pub const fn digest_summary(&self) -> &DigestSummary` | 不返回raw bytes hash字符串 |
| integrity | `pub(crate) fn verify_integrity(&self) -> Result<(), ApplicationError>` | exact bytes/profile mismatch为consistency failure；不得自动修复 |

surface 自身不判断 actor、reservation、request digest 或 current authorization；这些由 `StoredObservationResult::validate_replay_for` 与 entry gate共同完成。

## 9. `OperationResultDisposition` 对象卡

### 9.1 Layer decision

该 enum 只回答“已保存的 exact surface 代表哪类 application-local结果事实”，不回答调用方下一步动作。它是 `R06.6-DISPOSITION-LAYER` 的局部闭口，不关闭 consumer/job/entry 分层 blocker。

```rust
/// Durable fact classification of one stored observation operation result.
pub enum OperationResultDisposition {
    /// The requested local operation committed its owned result.
    Accepted,
    /// A formal durable local rejection result was committed.
    Rejected,
    /// Unsafe input was represented by a durable quarantine receipt.
    Quarantined,
    /// A valid request produced a durable no-change receipt.
    NoOp,
    /// A formal guard blocked the operation and a durable result surface records it.
    Blocked,
}
```

| variant | stable token | compatible result kinds | exact meaning | must not mean |
|---|---|---|---|---|
| `Accepted` | `accepted` | CommandResult / ConsumerReceipt / JobReport | owned local effect or terminal report committed | external/business success、signoff |
| `Rejected` | `rejected` | CommandRejection / ConsumerReceipt / JobReport | formal durable rejection surface exists | arbitrary pre-validation failure |
| `Quarantined` | `quarantined` | CommandResult / ConsumerReceipt | local quarantine fact/receipt committed | raw payload stored、worker dead-letter complete |
| `NoOp` | `no_op` | CommandResult / ConsumerReceipt / JobReport | exact durable no-change result exists | duplicate replay本身 |
| `Blocked` | `blocked` | CommandRejection / ConsumerReceipt / JobReport | guard/visibility/retention/no-write block有durable surface | retry permission或job state |

| member | exact signature | contract |
|---|---|---|
| parse | `pub(crate) fn from_token(token: &str) -> Result<Self, ApplicationError>` | exact token only，unknown/alias失败 |
| token | `pub const fn as_token(&self) -> &'static str` | stable wire/store token |
| compatibility | `pub(crate) fn is_compatible_with(&self, kind: &StoredObservationResultKind) -> bool` | 按上表total matrix检查 |

`DuplicateReplayed`、`Conflict`、`InFlight`、`Delayed`、`Published`、`DeadLettered` 和任何 entry ack/retry action 都不属于该 enum。duplicate返回原stored disposition，不新建`Duplicate` row。

## 10. `StoredObservationResult` 对象卡

### 10.1 Rust-facing definition

```rust
/// Immutable application result bound to one completed idempotency reservation.
pub struct StoredObservationResult {
    result_ref: StoredObservationResultRef,
    idempotency_ref: IdempotencyRef,
    operation_name: ObservationOperationName,
    actor_ref: ActorSafeRef,
    request_digest: RequestDigest,
    public_result_ref: BodyFreeRef,
    disposition: OperationResultDisposition,
    replay_surface: StoredObservationReplaySurface,
    stored_at: ObservedAt,
}
```

| field | source | invariant / missing handling |
|---|---|---|
| `result_ref` | application id generator after `Acquired` | required independent identity；不得由idempotency ref/digest/time派生 |
| `idempotency_ref` | current acquired reservation | required；one result belongs to exactly one reservation |
| `operation_name` | immutable `ObservationOperationContext` / reservation scope | must equal reservation scope operation |
| `actor_ref` | immutable context / reservation scope | must equal reservation scope actor；cross-actor replay forbidden |
| `request_digest` | current context / reservation | must equal reservation digest |
| `public_result_ref` | exact committed result/receipt/report assembler | required body-free ref；不是DB locator或external evidence alias |
| `disposition` | application result assembler | must match result kind matrix |
| `replay_surface` | §8 validated surface | kind must accept operation；bytes/digest/schema intact |
| `stored_at` | one application clock value in accepted UoW | metadata only；不参与logical key或retry decision |

### 10.2 Factory and inspection contract

| factory / member | exact signature | contract / side effect |
|---|---|---|
| create | `pub(crate) fn try_new(result_ref: StoredObservationResultRef, reservation: &ObservationIdempotencyReservation, operation_context: &ObservationOperationContext, public_result_ref: BodyFreeRef, disposition: OperationResultDisposition, replay_surface: StoredObservationReplaySurface, stored_at: ObservedAt) -> Result<Self, ApplicationError>` | reservation必须Reserved且未attach result；scope/context/digest完全相等；只构造，不保存/complete |
| rehydrate | `pub(crate) fn try_rehydrate(result_ref: StoredObservationResultRef, idempotency_ref: IdempotencyRef, operation_name: ObservationOperationName, actor_ref: ActorSafeRef, request_digest: RequestDigest, public_result_ref: BodyFreeRef, disposition: OperationResultDisposition, replay_surface: StoredObservationReplaySurface, stored_at: ObservedAt) -> Result<Self, ApplicationError>` | 校验字段内部关系和surface integrity；reservation cross-check在load/replay边界执行 |
| identity | `pub const fn result_ref(&self) -> &StoredObservationResultRef` | pointer only |
| reservation | `pub const fn idempotency_ref(&self) -> &IdempotencyRef` | owning reservation identity |
| operation | `pub const fn operation_name(&self) -> &ObservationOperationName` | exact finite operation |
| public ref | `pub const fn public_result_ref(&self) -> &BodyFreeRef` | body-free surface identity |
| disposition | `pub const fn disposition(&self) -> &OperationResultDisposition` | original fact classification；duplicate不改写 |
| replay surface | `pub const fn replay_surface(&self) -> &StoredObservationReplaySurface` | exact immutable bytes/schema/digest |

### 10.3 Replay compatibility contract

```rust
pub(crate) fn validate_replay_for(
    &self,
    reservation: &ObservationIdempotencyReservation,
    incoming_context: &ObservationOperationContext,
) -> Result<(), ApplicationError>;
```

校验顺序固定为：

1. reservation 是 `Completed`，且 pointer等于本对象 `result_ref`；
2. `idempotency_ref` 与 reservation identity 相等；
3. operation、actor、request digest 与 reservation/incoming context逐项相等；
4. result kind 接受该 operation family，disposition与kind兼容；
5. retained schema有exact decoder，surface digest与bytes相等；
6. entry仍单独执行current authorization / visibility envelope gate，但不得重跑domain mutation、resolver scan或job work-set。

任一失败返回 canonical application consistency category。completed reservation缺result、wrong pointer、wrong kind、wrong schema或digest mismatch都不得回查 current truth重建surface，也不得创建alias result。

### 10.4 Persistence and transaction boundary

```text
Acquired reservation
  -> construct exact public surface
  -> construct and save StoredObservationResult
  -> attach exact result_ref to reservation
  -> transition reservation Reserved -> Completed
  -> commit one UoW
```

- result save、pointer attach与reservation complete必须在同一accepted UoW中原子提交。
- repository schema、unique index与CAS签名留Step 07/11，但不能改变本对象immutable字段。
- pre-UoW invalid input、plain dependency failure和in-flight/conflict默认不生成stored result。
- durable rejection只有在当前正式 flow 明确拥有 rejection fact/surface时才可保存，不能为了幂等把所有error持久化。

### 10.5 `application::stored_result` 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| capability是否全部有对象承接 | pass | capture、classification、integrity与replay分别有owner |
| 五个对象是否都有功能来源 | pass | 全部回指exact duplicate replay能力 |
| 字段来源/factory是否闭合 | pass_for_B | repository/decoder接口留Step07/08，不缺对象字段 |
| disposition是否越层 | pass_local | consumer/job/entry disposition仍由`R06.6-DISPOSITION-LAYER`控制 |
| result-before-complete是否闭合 | pass | §10.4固定顺序和同UoW原子性 |
| raw body / external truth是否进入 | no | only canonical body-free surface |
| external upstream blocker | none | 正式00/01/02足以支撑本组 |

## 11. `OutboxRecordRef` 对象卡

本节记录 application outbox 对该 public ref 的 mint/use 契约；canonical low-dependency value declaration 归 `contracts::refs`，并同步登记在 `03_ddd_step_06_contracts_carriers.md` §29。下述 Rust shape 不构成 application 内第二份声明。

### 11.1 Canonical import and application use

```rust
use observability_contracts::refs::OutboxRecordRef;
```

| field / property | source | validation and boundary |
|---|---|---|
| inner value | application `IdGeneratorPort.new_outbox_record_ref()` | non-empty `BodyFreeRef`; generation is independent from event, snapshot, cursor and digest |
| value type owner | `contracts::refs`; planned file `crates/contracts/src/refs.rs` | public command/job/protocol carriers and application repository keys import the same low-dependency type; contracts never depend on application |
| mint authority | application `IdGeneratorPort.new_outbox_record_ref()` | identifies the local publication marker only; it is not an event id, external receipt, job run id or business truth id |
| persistence use | outbox repository primary identity | one record ref maps to one immutable payload snapshot pair; reuse or rebind is a consistency failure |

### 11.2 Factory and member contract

| member | exact signature | contract |
|---|---|---|
| wrap validated ref | `pub fn new(value: BodyFreeRef) -> Self` | contracts performs no generation; application may call this only with its typed id-generator output, while protocol decode first validates `BodyFreeRef` |
| rehydrate / decode | persistence or protocol mapper parses `BodyFreeRef`, then calls `OutboxRecordRef::new(value)` | no database locator inspection, prefix inference or application callback in contracts |
| borrow | `pub fn as_body_free_ref(&self) -> &BodyFreeRef` | exposes the opaque identity for repository keys, canonical wire and equality only |
| consume | `pub fn into_body_free_ref(self) -> BodyFreeRef` | transfers the typed value without changing it |

The type has no arithmetic, prefix parsing, string concatenation, `Display`, or conversion to `OutboundEventRef` / `OutboxPayloadSnapshotRef`. A missing record is a repository absence; it is not inferred from a cursor gap or an event ref.

## 12. `OutboxPayloadSnapshotRef` 对象卡

本节记录 application snapshot 对该 public ref 的 mint/use 契约；canonical declaration 归 `contracts::refs`。application 不重定义 newtype。

### 12.1 Canonical import and application use

```rust
use observability_contracts::refs::OutboxPayloadSnapshotRef;
```

| field / property | source | validation and boundary |
|---|---|---|
| inner value | application `IdGeneratorPort.new_outbox_payload_snapshot_ref()` | non-empty typed ref; independent from `OutboxRecordRef` and `OutboundEventRef` |
| value type owner | `contracts::refs`; application owns minting and snapshot construction | identifies exact stored bytes plus historical binding metadata; it is not a mutable payload pointer |
| pair rule | accepted append flow | one record points to exactly one snapshot; replacing bytes under the same ref is forbidden |

| member | exact signature | contract |
|---|---|---|
| wrap validated ref | `pub fn new(value: BodyFreeRef) -> Self` | application wraps only `IdGeneratorPort.new_outbox_payload_snapshot_ref()` output; contracts does not mint |
| rehydrate / decode | parse `BodyFreeRef`, then call `OutboxPayloadSnapshotRef::new(value)` | validates persisted/wire identity without loading payload bytes |
| borrow / consume | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`; `pub fn into_body_free_ref(self) -> BodyFreeRef` | typed access only; no cross-wrapper conversion |

`OutboxPayloadSnapshotRef` cannot be used as `OutboxRecordRef`, `StoredObservationResultRef`, an external destination locator, or a dead-letter identity. Snapshot absence is a consistency defect and never authorizes payload reconstruction.

## 13. `OutboundEventRef` 对象卡

本节记录 application outbox 对该 public event identity 的 mint/use 契约；canonical declaration 归 `contracts::refs`，供 protocol、application 和 later token 共用。

### 13.1 Canonical import and application use

```rust
use observability_contracts::refs::OutboundEventRef;
```

| field / property | source | validation and boundary |
|---|---|---|
| inner value | application `IdGeneratorPort.new_outbound_event_ref()` | non-empty; generated once for the accepted event and copied into protocol snapshot, application snapshot and record |
| value type owner / semantic scope | `contracts::refs`; application owns minting | identifies one local outbound event used by protocol envelope, application snapshot, receipt and token; not a topic, route, provider response, consumer acknowledgement or business fact |
| uniqueness | accepted append / publication token consumer | one event ref is paired with one outbox record and one payload snapshot; different event refs cannot share the same immutable snapshot |

| member | exact signature | contract |
|---|---|---|
| wrap validated ref | `pub fn new(value: BodyFreeRef) -> Self` | application wraps only `IdGeneratorPort.new_outbound_event_ref()` output; contracts does not mint |
| rehydrate / decode | parse `BodyFreeRef`, then call `OutboundEventRef::new(value)` | same validation on persistence or public protocol read |
| borrow / consume | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`; `pub fn into_body_free_ref(self) -> BodyFreeRef` | no route or provider interpretation |

The event ref is stable across local publication retries. Attempt ids, claim tokens, current time, transport message ids and job execution refs must never replace it.

## 14. `BodyFreeSerializedEvent` 对象卡

### 14.1 Rust-facing definition and byte boundary

```rust
/// Bounded canonical bytes of one body-free outbound protocol envelope.
pub struct BodyFreeSerializedEvent(Vec<u8>);

/// Compile-time safety ceiling for one canonical body-free outbound event.
pub const MAX_BODY_FREE_SERIALIZED_EVENT_BYTES: usize = 262_144;
```

| item | current contract |
|---|---|
| owner | `application::outbox`; planned file `crates/application/src/outbox.rs` |
| hard safety bound owner | Step 06 `application::outbox`; encoded length `1..=MAX_BODY_FREE_SERIALIZED_EVENT_BYTES` (`262_144`) bytes; this is a compile-time abuse/corruption ceiling, not an SLO, throughput target or capacity evidence |
| authority separation | the literal is not inherited from `04` `boundary.max_request_body_bytes`; inbound request-body configuration and durable outbound-event bytes are different boundaries, and neither may redefine the other |
| runtime bound | no current runtime config owns this invariant; a future admission bound may be lower for newly constructed events, but rehydrate always checks the compile-time ceiling and no config may raise it or truncate payload |
| source | accepted flow's typed `ObservationOutboundEventPayloadSnapshot` canonical encoder |
| body-free proof | only a typed encoder with an allowlisted schema may construct the value; scanning arbitrary bytes or replacing suspected body text is not a valid proof |
| immutability | no mutable slice, in-place schema upgrade, compression escape, or post-append rewrite |
| persistence | exact byte sequence is stored and rehydrated byte-for-byte; adapters must not trim, reformat, reorder or reserialize it |
| debug / display | no `Display`; custom `Debug` may show type, length and digest profile hint only, never bytes or decoded text |

| factory / member | exact signature | contract / failure |
|---|---|---|
| canonical factory | `pub(crate) fn try_from_canonical(bytes: Vec<u8>) -> Result<Self, ApplicationError>` | called only by the typed protocol encoder; rejects empty, over-limit and non-canonical framing |
| rehydrate | `pub(crate) fn try_rehydrate(bytes: Vec<u8>) -> Result<Self, ApplicationError>` | validates bounds and retained framing/version; malformed data is a consistency failure |
| bytes view | `pub(crate) fn as_bytes(&self) -> &[u8]` | available only to digest, exact decoder and publisher mapper; never a log or metric label |
| length | `pub const fn len(&self) -> usize` | bound inspection only; not a record count or payload semantic field |
| empty check | `pub const fn is_empty(&self) -> bool` | validated instances are always false; defensive inspection only |

The carrier does not itself parse external material. A valid UTF-8 body, provider response, audit body or evidence body is still forbidden if the typed protocol schema disallows it. A missing or corrupt event value stops publication and must be classified; it must not trigger a read of current truth.

The independent basis for `262_144` is the finite current outbound family: all twelve schemas are body-free, use bounded refs/finite markers, and contain no arbitrary body or unbounded collection. The ceiling is deliberately much larger than any current canonical surface and exists to reject malformed storage or accidental schema expansion. Step 08 per-protocol review must prove each canonical encoder remains below it. Adding a schema that cannot fit reopens Step 06/08 and requires an explicit versioned design change; changing request-body config is never such authorization.

## 15. `PublicationReceipt` 对象卡

### 15.1 Rust-facing definition

```rust
/// Body-free transport fact returned for the exact outbound event effect.
pub struct PublicationReceipt {
    event_ref: OutboundEventRef,
    effect_binding_ref: ExternalEffectBindingRef,
    schema_version: SchemaVersion,
    payload_digest: DigestSummary,
    external_receipt_ref: BodyFreeRef,
    observed_at: ObservedAt,
}
```

| field | source | validation / meaning |
|---|---|---|
| `event_ref` | publisher input snapshot | must equal the published snapshot event ref; prevents attaching a receipt to another event |
| `effect_binding_ref` | publisher's immutable snapshot binding | must equal the historical binding used for the call; it is opaque and does not expose route, topic, endpoint or credential |
| `schema_version` | stored snapshot | exact equality required; receipt cannot authorize an in-place schema upgrade |
| `payload_digest` | exact stored event bytes | must equal the snapshot digest; it is an integrity summary, not event body or business evidence |
| `external_receipt_ref` | validated publisher adapter result | non-empty opaque body-free reference; does not claim downstream consumption, business acceptance, signoff or final verdict |
| `observed_at` | `ClockPort` at receipt classification | metadata only; not a publication ordering or retry authority |

| factory / member | exact signature | contract |
|---|---|---|
| create | `pub(crate) fn try_new(snapshot: &ObservationOutboxPayloadSnapshot, external_receipt_ref: BodyFreeRef, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | copies event, binding, schema and digest from the immutable snapshot; validates receipt ref and snapshot integrity |
| rehydrate | `pub(crate) fn try_rehydrate(event_ref: OutboundEventRef, effect_binding_ref: ExternalEffectBindingRef, schema_version: SchemaVersion, payload_digest: DigestSummary, external_receipt_ref: BodyFreeRef, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | validates all fields but does not call an external adapter |
| accessors | `event_ref()`, `effect_binding_ref()`, `schema_version()`, `payload_digest()`, `external_receipt_ref()`, `observed_at()` | typed borrowed access; no raw provider response |
| compatibility | `pub(crate) fn matches_snapshot(&self, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<(), ApplicationError>` | exact event/binding/schema/digest equality; mismatch is fail closed |

`PublicationReceipt` is a local publication result carrier. It is not `ObservationConsumerReceipt`, `EntryDisposition`, `ObservationJobOutcome`, an external business receipt or acceptance evidence.

## 16. `PublicationFailureKind` 对象卡

### 16.1 Finite variants

```rust
/// Finite body-free classification of one outbound publication failure.
pub enum PublicationFailureKind {
    TransportUnavailable,
    TransportTimeout,
    RemoteRejected,
    UnsupportedCapability,
    InvalidPayload,
    BindingUnavailable,
    OutcomeUnknown,
}
```

| variant | stable token | local meaning | forbidden shortcut |
|---|---|---|---|
| `TransportUnavailable` | `transport_unavailable` | publisher dependency could not be reached or was unavailable | not a source-truth failure; do not rebuild payload |
| `TransportTimeout` | `transport_timeout` | call exceeded the adapter's classified timeout | timeout is not proof of not-delivered |
| `RemoteRejected` | `remote_rejected` | target returned a formal rejection for this effect | do not expose provider body or turn it into business verdict |
| `UnsupportedCapability` | `unsupported_capability` | required publication capability is not supported | do not downgrade to `NotPublished` or silently reroute |
| `InvalidPayload` | `invalid_payload` | stored schema, framing or payload integrity is invalid before publish | never serialize current truth as a replacement |
| `BindingUnavailable` | `binding_unavailable` | retained historical binding cannot be resolved safely | never use current default binding |
| `OutcomeUnknown` | `outcome_unknown` | call outcome cannot be established | probe before any resend; never treat as negative |

| member | exact signature | contract |
|---|---|---|
| parse | `pub(crate) fn from_token(token: &str) -> Result<Self, ApplicationError>` | exact tokens only; unknown, alias and free text fail |
| wire | `pub const fn as_token(&self) -> &'static str` | stable storage/telemetry classification, not provider text |
| recovery hint | `pub(crate) fn requires_probe(&self) -> bool` | true only for `TransportTimeout` and `OutcomeUnknown`; this does not authorize retry |
| permanence hint | `pub(crate) fn is_payload_or_binding_defect(&self) -> bool` | true for `InvalidPayload` and `BindingUnavailable`; final dead-letter decision remains a later policy/flow concern |

The enum deliberately has no attempt count, backoff, retry limit, provider code, HTTP number, topic, endpoint, credential or external response body. Retry eligibility and claim/fence remain outside this batch.

## 17. `PublicationFailure` 对象卡

### 17.1 Rust-facing definition

```rust
/// Immutable body-free failure fact attached to an outbox publication marker.
pub struct PublicationFailure {
    failure_kind: PublicationFailureKind,
    event_ref: OutboundEventRef,
    effect_binding_ref: ExternalEffectBindingRef,
    schema_version: SchemaVersion,
    payload_digest: DigestSummary,
    observed_at: ObservedAt,
}
```

| field | source | invariant |
|---|---|---|
| `failure_kind` | publisher/application classification | finite variant only; no message parsing |
| `event_ref` | exact stored snapshot | must identify the same record event |
| `effect_binding_ref` | exact stored snapshot | retained historical binding; no current-config fallback |
| `schema_version` | exact stored snapshot | unchanged across failure and later same-token retry |
| `payload_digest` | exact stored bytes | rechecked before saving; mismatch is `OutboxInvariantViolation` / consistency failure |
| `observed_at` | clock at failure classification | metadata only; cannot order attempts or reset state |

| factory / member | exact signature | contract |
|---|---|---|
| create | `pub(crate) fn try_new(kind: PublicationFailureKind, snapshot: &ObservationOutboxPayloadSnapshot, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | copies immutable identity material and validates snapshot integrity |
| rehydrate | `pub(crate) fn try_rehydrate(kind: PublicationFailureKind, event_ref: OutboundEventRef, effect_binding_ref: ExternalEffectBindingRef, schema_version: SchemaVersion, payload_digest: DigestSummary, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | validates persisted shape; no external call |
| kind / identity accessors | `failure_kind()`, `event_ref()`, `effect_binding_ref()`, `schema_version()`, `payload_digest()`, `observed_at()` | typed borrowed access only |
| compatibility | `pub(crate) fn matches_snapshot(&self, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<(), ApplicationError>` | exact equality of all immutable publication material |

The failure is a local publication fact, not a domain transition, source failure, consumer receipt, job terminal state or authorization decision. Saving it never rolls back the accepted observation mutation.

## 18. `DeadLetterReason` 对象卡

### 18.1 Finite variants

```rust
/// Finite reason for terminally isolating an outbox item from normal publication.
pub enum DeadLetterReason {
    PayloadMissing,
    PayloadCorrupt,
    PermanentPublicationFailure,
    RetryExhausted,
    BindingUnavailable,
    UnsupportedCapability,
    ManualReviewRequired,
}
```

| variant | stable token | required precondition | forbidden interpretation |
|---|---|---|---|
| `PayloadMissing` | `payload_missing` | record points to no readable immutable snapshot | never reconstruct from current truth |
| `PayloadCorrupt` | `payload_corrupt` | snapshot framing, schema, digest or pair invariant fails | do not publish bytes or repair in place |
| `PermanentPublicationFailure` | `permanent_publication_failure` | failure classification is formally non-recoverable | not a business rejection or signoff |
| `RetryExhausted` | `retry_exhausted` | later policy/plan has classified retry exhaustion | this batch does not define counts or backoff |
| `BindingUnavailable` | `binding_unavailable` | historical effect binding cannot be safely resolved | never reroute to current default |
| `UnsupportedCapability` | `unsupported_capability` | required publisher capability is unavailable | unsupported is not negative delivery proof |
| `ManualReviewRequired` | `manual_review_required` | outcome or integrity requires explicit operations handling | no hidden auto-repair or automatic reopen |

| member | exact signature | contract |
|---|---|---|
| parse | `pub(crate) fn from_token(token: &str) -> Result<Self, ApplicationError>` | exact stable token set; no provider/free-text reason |
| wire | `pub const fn as_token(&self) -> &'static str` | storage/report classification only |
| transition compatibility | `pub(crate) fn accepts_transition(&self, source: OutboxPublicationState, failure: Option<&PublicationFailure>) -> bool` | validates the exact source-state/failure matrix below; it does not prove retry exhaustion, probe outcome or operator authorization |

Dead-letter is an observation-side publication marker. It is not a raw payload archive, a queue acknowledgement, an external target state, a business failure, or an acceptance result.

The compatibility matrix is exact:

| dead-letter reason | allowed source state | required retained failure |
|---|---|---|
| `PayloadMissing` | `Pending` or `Failed` | optional; if present it must be snapshot-compatible, but the missing snapshot itself is the terminal authority |
| `PayloadCorrupt` | `Pending` or `Failed` | optional; if present it must be snapshot-compatible |
| `PermanentPublicationFailure` | `Failed` only | required; kind must be `RemoteRejected` |
| `RetryExhausted` | `Failed` only | required; kind must be `TransportUnavailable`; a timeout cannot use this reason without a later typed `NotPublished` proof extension |
| `BindingUnavailable` | `Pending` or `Failed` | optional from `Pending`; from `Failed`, retained kind must be `BindingUnavailable` |
| `UnsupportedCapability` | `Pending` or `Failed` | optional from `Pending`; from `Failed`, retained kind must be `UnsupportedCapability` |
| `ManualReviewRequired` | `Failed` only | required; retained kind must be `TransportTimeout` or `OutcomeUnknown` |

Any other reason/state/failure combination is rejected. The matrix classifies durable shape only; it does not define retry counts, probe algorithm or operations authorization.

## 19. `DeadLetterRef` 对象卡

本节记录 application dead-letter transition 对该 public ref 的 mint/use 契约；canonical declaration 归 `contracts::refs`，application 不创建第二 wrapper。

### 19.1 Canonical import and application use

```rust
use observability_contracts::refs::DeadLetterRef;
```

| property | source / rule |
|---|---|
| generation | `IdGeneratorPort.new_dead_letter_ref()`; independent from outbox, event, snapshot and external receipt refs |
| value type owner | `contracts::refs`; public consumer receipt and application outbox reuse one low-dependency identity type |
| mint / semantic ownership | application id generator mints it at the accepted dead-letter classification boundary; the owning application state decides what was dead-lettered |
| uniqueness | one `DeadLettered` record has exactly one ref; the ref is immutable after terminal transition |

| member | exact signature | contract |
|---|---|---|
| wrap validated ref | `pub fn new(value: BodyFreeRef) -> Self` | application wraps only `IdGeneratorPort.new_dead_letter_ref()` output; contracts does not mint |
| rehydrate / decode | parse `BodyFreeRef`, then call `DeadLetterRef::new(value)` | same validation; no queue lookup |
| borrow / consume | `as_body_free_ref()` / `into_body_free_ref()` | typed identity access only |

No conversion exists between `DeadLetterRef` and `OutboxRecordRef`, `PublicationReceipt`'s external receipt ref or `BodyFreeRef`-encoded raw material. The ref does not imply a separate payload archive or provider/queue row; the owning durable application object must persist the finite reason and lifecycle state explicitly.

## 20. `ObservationOutboxPayloadSnapshot` 对象卡

### 20.1 Rust-facing definition

```rust
/// Immutable application snapshot consumed by the publication adapter.
pub struct ObservationOutboxPayloadSnapshot {
    payload_snapshot_ref: OutboxPayloadSnapshotRef,
    effect_binding_ref: ExternalEffectBindingRef,
    event_ref: OutboundEventRef,
    event_name: ObservationOutboundEventName,
    subject_ref: BodyFreeRef,
    schema_version: SchemaVersion,
    serialized_payload: BodyFreeSerializedEvent,
    payload_digest: DigestSummary,
    committed_cursor: ObservationCommittedCursor,
    trace_ref: Option<TraceCorrelationRef>,
    stored_at: ObservedAt,
}
```

The pure protocol snapshot `ObservationOutboundEventPayloadSnapshot` is a separate contracts surface. This application object is the only B-batch owner that may add `effect_binding_ref`; the binding is historical opaque metadata and is never included in `serialized_payload`.

| field | source | validation / invariant |
|---|---|---|
| `payload_snapshot_ref` | application id generator | independent immutable snapshot identity |
| `effect_binding_ref` | accepted-flow binding catalog result | required opaque body-free binding revision; owner/mint/resolver remain `R06.6-C` scope |
| `event_ref` | accepted-flow id generator / protocol snapshot | copied exactly; paired with record and stable across retry |
| `event_name` | finite committed-change mapping | captured at acceptance; publisher never infers route from bytes or current truth |
| `subject_ref` | committed observation object/state/record | body-free and equal to protocol snapshot subject |
| `schema_version` | protocol snapshot | retained exact schema; no in-place upgrade |
| `serialized_payload` | typed protocol encoder | bounded exact bytes; no raw body, credential, route or provider response |
| `payload_digest` | digest of exact serialized bytes | must recompute equal; not an evidence or source-body digest |
| `committed_cursor` | current UoW tagged cursor | same namespace/value as accepted change and affected stale marker; not a row version |
| `trace_ref` | operation context or accepted envelope | optional body-free correlation only |
| `stored_at` | one accepted-UoW clock value | metadata; paired with record `committed_at` |

| factory / member | exact signature | contract / side effect |
|---|---|---|
| protocol mapping | `pub(crate) fn from_protocol_snapshot(effect_binding_ref: ExternalEffectBindingRef, snapshot: ObservationOutboundEventPayloadSnapshot) -> Result<Self, ApplicationError>` | wraps canonical bytes, validates every field, copies binding without serializing it; no repository or external call |
| rehydrate | `pub(crate) fn try_rehydrate(payload_snapshot_ref: OutboxPayloadSnapshotRef, effect_binding_ref: ExternalEffectBindingRef, event_ref: OutboundEventRef, event_name: ObservationOutboundEventName, subject_ref: BodyFreeRef, schema_version: SchemaVersion, serialized_payload: BodyFreeSerializedEvent, payload_digest: DigestSummary, committed_cursor: ObservationCommittedCursor, trace_ref: Option<TraceCorrelationRef>, stored_at: ObservedAt) -> Result<Self, ApplicationError>` | validates byte digest, supported schema, typed identities and cursor/tag relation |
| integrity | `pub(crate) fn verify_integrity(&self) -> Result<(), ApplicationError>` | exact bytes/digest/schema/event/subject relation; no repair |
| accessors | `payload_snapshot_ref()`, `effect_binding_ref()`, `event_ref()`, `event_name()`, `subject_ref()`, `schema_version()`, `serialized_payload()`, `payload_digest()`, `committed_cursor()`, `trace_ref()`, `stored_at()` | borrowed typed access; no mutable bytes |

The publisher may receive this object and construct a later external token in its own allowed phase, but it may not modify the snapshot, resolve a new binding, query current truth, or create a replacement payload. Pair append and source mutation belong to one accepted UoW; publication marker updates use separate short UoWs.

## 21. `OutboxPublicationState` 对象卡

### 21.1 Rust-facing definition

```rust
/// Durable lifecycle of one immutable outbox snapshot.
pub enum OutboxPublicationState {
    Pending,
    Published,
    Failed,
    DeadLettered,
}
```

| state | stable token | terminal | allowed semantic operations |
|---|---|---:|---|
| `Pending` | `pending` | no | structural planning consideration, classified failure, terminal isolation |
| `Published` | `published` | yes | read, report, reconciliation; no second publication |
| `Failed` | `failed` | no | later structural scan plus application policy may authorize unchanged snapshot/binding/token retry; may be reclassified or dead-lettered |
| `DeadLettered` | `dead_lettered` | yes | operations read and explicit future recovery protocol only |

| member | exact signature | contract |
|---|---|---|
| parse | `pub(crate) fn from_token(token: &str) -> Result<Self, ApplicationError>` | exact four tokens only |
| wire | `pub const fn as_token(&self) -> &'static str` | stable durable token; no enum ordinal |
| terminal | `pub const fn is_terminal(&self) -> bool` | true only for `Published` and `DeadLettered` |
| structural planning visibility | `pub(crate) fn may_be_scanned_for_planning(&self) -> bool` | true for `Pending` and `Failed`; application still requires complete accounting, frozen policy/backoff and later claim checks |
| transition guard | `pub(crate) fn allows_transition_to(&self, next: Self) -> bool` | permits factory `Pending`, `Pending -> Published/Failed/DeadLettered`, `Failed -> Published/Failed/DeadLettered`; rejects terminal rewrites and every `Failed -> Pending` |

The state does not encode attempts, lease, claim, fence, retry interval, external probe result, acknowledgement or job outcome. `Failed` is a durable publication fact, not a signal to mutate the state back to `Pending`.

## 22. `ObservationOutboxRecord` 对象卡

### 22.1 Rust-facing definition

```rust
/// Durable marker paired with one immutable application outbox snapshot.
pub struct ObservationOutboxRecord {
    outbox_ref: OutboxRecordRef,
    event_ref: OutboundEventRef,
    subject_ref: BodyFreeRef,
    payload_snapshot_ref: OutboxPayloadSnapshotRef,
    committed_cursor: ObservationCommittedCursor,
    state: OutboxPublicationState,
    publication_receipt: Option<PublicationReceipt>,
    last_failure: Option<PublicationFailure>,
    dead_letter_reason: Option<DeadLetterReason>,
    dead_letter_ref: Option<DeadLetterRef>,
    committed_at: ObservedAt,
}
```

| field | source | invariant |
|---|---|---|
| `outbox_ref` | id generator | stable local marker identity |
| `event_ref` | paired immutable snapshot | exact equality with snapshot event ref |
| `subject_ref` | accepted mutation | exact equality with snapshot subject ref; not a current query result |
| `payload_snapshot_ref` | paired immutable snapshot | one-to-one immutable pointer |
| `committed_cursor` | accepted UoW allocator | exact tagged equality with snapshot cursor; not a version or claim |
| `state` | record factory / transition | only the four states in §21 |
| `publication_receipt` | successful publisher classification | required for `Published`; exact snapshot compatibility |
| `last_failure` | failed publication classification | required for `Failed`; latest failure replaces the previous one; `Failed -> Published/DeadLettered` preserves it for auditability |
| `dead_letter_reason` | application terminal classification | required only for `DeadLettered`; stored in the record and never inferred from repository layout, ref text or prior failure |
| `dead_letter_ref` | terminal isolation id generator | required only for `DeadLettered`; never contains payload |
| `committed_at` | same accepted-UoW clock value as snapshot `stored_at` | metadata equality pair; not ordering authority |

### 22.2 Factory, transition and inspection contract

| factory / member | exact signature | contract / side effect |
|---|---|---|
| initial marker | `pub(crate) fn pending(outbox_ref: OutboxRecordRef, snapshot: &ObservationOutboxPayloadSnapshot, committed_at: ObservedAt) -> Result<Self, ApplicationError>` | validates snapshot integrity, non-empty identity and `committed_at == snapshot.stored_at`; constructs `Pending` with all outcome fields `None` |
| rehydrate | `pub(crate) fn try_rehydrate(outbox_ref: OutboxRecordRef, event_ref: OutboundEventRef, subject_ref: BodyFreeRef, payload_snapshot_ref: OutboxPayloadSnapshotRef, committed_cursor: ObservationCommittedCursor, state: OutboxPublicationState, publication_receipt: Option<PublicationReceipt>, last_failure: Option<PublicationFailure>, dead_letter_reason: Option<DeadLetterReason>, dead_letter_ref: Option<DeadLetterRef>, committed_at: ObservedAt) -> Result<Self, ApplicationError>` | checks the exact state/outcome matrix, including reason/ref co-presence; pair validation occurs when the snapshot is loaded |
| pair validation | `pub(crate) fn validate_against_snapshot(&self, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<(), ApplicationError>` | checks ref, event, subject, cursor, timestamp and snapshot integrity; mismatch is fail closed |
| publish success | `pub(crate) fn mark_published(&mut self, receipt: PublicationReceipt, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<(), ApplicationError>` | object-level guard requires `Pending` or `Failed` and matching receipt/snapshot; from `Pending` leaves `last_failure=None`, from `Failed` preserves the latest compatible failure; sets receipt and clears dead-letter fields |
| publication failure | `pub(crate) fn mark_failed(&mut self, failure: PublicationFailure, snapshot: &ObservationOutboxPayloadSnapshot) -> Result<(), ApplicationError>` | object-level guard requires `Pending` or `Failed` and matching failure/snapshot; sets/replaces the latest failure, clears receipt/dead-letter fields, remains `Failed`, and never rewrites to `Pending` |
| terminal isolation | `pub(crate) fn mark_dead_letter(&mut self, reason: DeadLetterReason, dead_letter_ref: DeadLetterRef) -> Result<(), ApplicationError>` | requires `Pending` or `Failed`, validates reason against any retained failure, persists both reason and ref, preserves a prior failure, clears receipt, and sets `DeadLettered` without payload mutation |
| identity accessors | `outbox_ref()`, `event_ref()`, `subject_ref()`, `payload_snapshot_ref()`, `committed_cursor()`, `state()` | typed borrowed access only |
| outcome accessors | `publication_receipt()`, `last_failure()`, `dead_letter_reason()`, `dead_letter_ref()`, `committed_at()` | returns body-free optional carriers; no provider body or current truth |

### 22.3 State/outcome consistency matrix

| state | receipt | failure | dead-letter reason | dead-letter ref | allowed construction / transition |
|---|---|---|---|---|---|
| `Pending` | `None` | `None` | `None` | `None` | initial accepted append only |
| `Published` | `Some` and snapshot-compatible | `None` when from `Pending`; preserved `Some` latest compatible failure when from `Failed` | `None` | `None` | `Pending` or `Failed` -> `Published`; Failed caller must separately satisfy later claim/token/probe guards |
| `Failed` | `None` | `Some` latest snapshot-compatible failure | `None` | `None` | `Pending` or application-authorized `Failed` -> `Failed`; a repeated failure replaces the previous one |
| `DeadLettered` | `None` | `None` when directly isolated from `Pending`, or preserved `Some` when isolated from `Failed` | `Some` finite compatible reason | `Some` | `Pending` or `Failed` -> `DeadLettered` |

For rehydration, `Published + failure=None` means the successful transition originated from `Pending`; `Published + failure=Some` means it originated from `Failed` and retained the latest failure. A successful transition never invents or clears historical failure. `DeadLettered` requires reason/ref co-presence; a reason without a ref, a ref without a reason, or either field on another state is invalid. Any terminal rewrite, receipt/failure mismatch, missing required outcome, snapshot pair mismatch or state token outside §21 returns the canonical future application consistency category. The record itself never calls a publisher, repository, resolver, clock, config catalog or external target.

The record enforces durable state shape only. Before a caller invokes a transition from `Failed`, Step 07/09/13 must separately prove current claim/fence, stable publication token, probe requirement and retry/dead-letter eligibility. Absence of those later proofs is a flow error and must stop before mutating this object; the object method does not fabricate an `eligible` boolean.

### 22.4 Application/outbox transaction boundary

```text
accepted local mutation UoW:
  construct protocol snapshot
  resolve and freeze opaque historical binding ref
  construct immutable ObservationOutboxPayloadSnapshot
  construct Pending ObservationOutboxRecord
  append owner truth + record + snapshot + required local marker/history
  commit together

publication UoW:
  load record + exact immutable snapshot + expected repository version
  validate pair and historical binding
  perform later publisher call outside the short marker UoW
  mark Published / Failed / DeadLettered with CAS
  commit publication marker only
```

The accepted UoW rolls back if snapshot construction or outbox append fails. A later publication failure never rolls back the already committed observation truth, does not alter the immutable snapshot, and does not create a replacement event. A missing snapshot, corrupt digest/schema, unavailable historical binding or unknown external result is fail-closed and cannot be repaired by reading current truth.

### 22.5 `application::outbox` module停审

| 审查项 | 结论 | 证据 / 后续 |
|---|---|---|
| 12 个 outbox-related type 是否逐一有独立卡 | pass_for_R06.6-B | §§11~22；4 个 public identity owner 为 `contracts::refs`，其余 8 个为 application outbox；无 secondary carrier 只点名 |
| ref / bytes / receipt / failure / dead-letter 是否有字段与 factory | pass_for_R06.6-B | 每个对象均有 source、validation、member 或 transition contract；dead-letter reason/ref 均持久化 |
| protocol snapshot 与 application snapshot 是否分离 | pass | §20；binding 不进入 serialized event bytes |
| payload 是否 immutable、bounded、body-free | pass_for_R06.6-B | §14、§20；hard ceiling 不是性能承诺 |
| state transition 是否闭合 | pass_for_R06.6-B | §21、§22.3；`Failed -> Pending` 明确禁止 |
| publication failure 是否与 truth 解耦 | pass | §22.4；只更新 publication marker |
| token / claim / retry policy 是否越界进入 | no | 留 R06.6-C、R06.6-F、Step 13 / 14 |
| external upstream blocker | none | `00/01/02` 约束足够 |

## 23. B 批跨模块字段闭环

### 23.1 Protocol snapshot 到 application snapshot 映射

| protocol field | application field | source / check | loss / forbidden conversion |
|---|---|---|---|
| `payload_snapshot_ref` | `payload_snapshot_ref` | same generated typed ref | no new alias or regeneration |
| `event_ref` | `event_ref` | exact equality | no attempt/job id replacement |
| `event_name` | `event_name` | static accepted-flow mapping | no route/topic inference from bytes |
| `subject_ref` | `subject_ref` | committed subject | no current truth reread |
| `schema_version` | `schema_version` | exact retained schema | no in-place upgrade |
| `serialized_payload` | `BodyFreeSerializedEvent` | bounded canonical wrapper | no trim/reencode/body scan |
| `payload_digest` | `payload_digest` | digest over exact bytes | no digest over binding/route/provider body |
| `committed_cursor` | `committed_cursor` | tagged same-UoW cursor | no row version or claim token substitution |
| `trace_ref` | `trace_ref` | optional safe correlation | no span/transport id promotion |
| `stored_at` | `stored_at` and record `committed_at` | one accepted UoW clock value | no timestamp ordering inference |
| application-only binding | `effect_binding_ref` | accepted catalog opaque ref | never serialized into public event bytes |

### 23.2 Result / reservation / outbox relation

| relation | invariant |
|---|---|
| stored result -> reservation | result is saved before reservation pointer attach and `Reserved -> Completed`; outbox is not a substitute for result |
| accepted mutation -> outbox | truth change, immutable snapshot and `Pending` record append in the same accepted UoW |
| publication -> stored result | publication receipt/failure may be included in a later job report, but never mutates an original stored command/consumer result |
| duplicate job -> outbox | terminal job duplicate replays its stored report; it does not relist or republish the frozen work-set |
| Query -> outbox | Query has no reservation, stored result, outbox append, refresh or repair write |

## 24. B 批 state closure

| state owner | exact states | entry / flow trigger | forbidden merge |
|---|---|---|---|
| `ObservationIdempotencyReservation` | `Reserved`, `Completed` | A-batch reserve/attach/complete | `Replay`, `Conflict`, `InFlight` are incoming outcomes, not states |
| `StoredObservationResult` | immutable existence plus `OperationResultDisposition` | accepted result save/replay | not public outcome, ack, retry or job lifecycle |
| `ObservationOutboxRecord` | `Pending`, `Published`, `Failed`, `DeadLettered` | accepted append / publisher marker CAS | not domain truth, external target state or `ObservationJobOutcome` |
| `PublicationFailureKind` | finite failure classification | publisher result mapping | not `ApplicationError` owner, retry policy or transport numeric code |
| `DeadLetterReason` | terminal isolation reason | explicit marker transition | not raw payload archive or consumer ack |

The state matrix in frozen Step 10 is treated only as affected use until R06.8. Its current semantic constraints are consumed here: `Failed` remains selectable only through a later eligibility/claim path and never transitions back to `Pending`.

## 25. B 批 affected-use 传播表

| downstream step / module | consumed object / rule | required later action | current status |
|---|---|---|---|
| Step 07 repository / publisher | all outbox objects; append, structural planning scan, application eligibility, CAS marker update, attempt sidecar and exact snapshot input | reconcile trait signatures with these object factories and the eventual token owner; no duplicate object definition | affected, frozen |
| Step 08 outbound protocol | pure `ObservationOutboundEventPayloadSnapshot` maps losslessly to application snapshot; binding excluded from bytes | per-protocol review must prove event name/schema/subject/payload totality | affected, `03-RPR-S08-PER-PROTOCOL` open_controlled |
| Step 09 accepted mutation | construct snapshot and Pending record after committed post-state; same accepted UoW | update flow signature to use `pending(record_ref, snapshot, committed_at)` or an equivalent validated pair factory | affected, `03-RPR-S09-PER-FLOW` open |
| Step 09 publication job | load exact snapshot, call publisher, CAS marker only | later add token/claim/probe after R06.6-C/F; no current-truth rebuild | affected, frozen |
| Step 10 state matrix | `OutboxPublicationState` and transitions | replace historical reverse-definition claim with Step 06 owner back-reference | affected, frozen |
| Step 11 persistence | record/snapshot pair, digest/schema/cursor/state/outcome constraints | define logical store/index/UoW using exact fields; resolve `R06-F-AFFECT-UOW-01` in R06.8 | affected, frozen |
| Step 12 recovery | failure kinds, corrupt/missing snapshot, unknown outcome, dead-letter | map to canonical application/public recovery layers after R06.6-E; no raw provider detail | affected, frozen |
| Step 13 concurrency | stable outbox work key, claim/fence and publication token | R06.6-C/F must supply owners; retry remains same snapshot/binding/token | affected, frozen |
| Step 14 / `04` | binding resolution, payload/loop limits, retry configuration | preserve historical binding; config may tighten bounds but cannot change object invariant | affected, existing repair input |
| Step 15 telemetry | redacted publication state/failure signals | define low-cardinality fields after error owner closes | deferred |
| Step 16 tests | object invariant, pair equality, byte bound, state transition and no-truth-write tests | create test cuts only in Step 16; no tests claimed executed here | deferred |

## 26. B 批回填草稿

正式 `03-详细设计.md` Step 19 装配时，§5 的 `application::outbox` 至少回填以下事实：

1. `OutboxRecordRef`、`OutboxPayloadSnapshotRef`、`OutboundEventRef` 和 `DeadLetterRef` 是 `contracts::refs` 中不可互换的 opaque typed identity；application 保留唯一 mint authority，contracts 不依赖 application。
2. `ObservationOutboxPayloadSnapshot` 是 application durable owner；协议快照是纯 public surface，`effect_binding_ref` 只能存在于 application snapshot metadata。
3. `BodyFreeSerializedEvent` 保存 accepted transaction 中形成的 exact bounded bytes；publisher 不得从 current truth、current config 或 current route 重建 payload。
4. `ObservationOutboxRecord` 只保存 snapshot pointer、pair identity、cursor、publication state 和 body-free outcome carrier；dead-letter 必须同时保存 finite reason 与 ref，不拥有业务 truth。
5. publication state 只允许 `Pending -> Published/Failed/DeadLettered` 与 `Failed -> Published/Failed/DeadLettered`；不存在 `Failed -> Pending`。
6. publication failure、dead-letter、external receipt 都是 observation-side propagation facts，不是业务 truth、消费者确认、验收签署或最终 verdict。

正式 §11 / §12 / §13 / §15 / §16 / §17 装配时必须回指本批字段和禁止事项，不得恢复历史 `Vec<u8>` 无边界、`Failed -> Pending`、current-truth payload rebuild 或 provider body persistence。

## 27. B 批模块停审与 blocker

| 项目 | 当前结论 | 处理 |
|---|---|---|
| `application::stored_result` | done in B-2 | A 批 reservation/result-before-complete 与本批 exact result surface 已闭合 |
| outbox-related owner group | done in B-3/B-4 | 4 个 `contracts::refs` identity + 8 个 `application::outbox` object 的字段来源、factory、状态和 same-UoW boundary 已闭合 |
| external upstream blocker | none | 正式 `00/01/02` 没有阻断 B 批的 truth conflict |
| `03-RPR-S06-GRANULARITY` | open | C 批已完成；仍需 R06.6-D~F、R06.7、R06.8 及全量 affected review |
| `R06.6-DISPOSITION-LAYER` | open_controlled | 本批只定义 `OperationResultDisposition` 和 publication facts，不裁定 consumer/job/entry layers |
| `R06.6-APP-EXT-OWNER` | resolved_in_C | B 批只消费 opaque ref；C 批已裁定唯一 owner=`application::runtime`，infra只派生/装配 |
| `R06.6-APP-ERROR-OWNER` | open | B 批引用 future canonical application consistency category，不新建平行 error enum |
| `R06-F-AFFECT-UOW-01` | open_controlled | B 批固定 pair/same-UoW invariant，record cursor/save ordering留 R06.8 affected repair |
| `R06.6-B-REF-OWNER` | resolved | 四个 public identity value type 上提 `contracts::refs`；application mint / application state ownership不变 |
| `R06.6-B-DEAD-LETTER-SHAPE` | resolved | `dead_letter_reason` 与 `dead_letter_ref` durable co-presence，repository不得隐式保存 reason |
| `R06.6-B-PUBLICATION-HISTORY` | resolved | latest failure replacement、Failed-success保留、Failed-dead-letter保留规则唯一化 |
| `R06.6-B-EVENT-BYTE-BOUND` | resolved | `262_144` 由 Step 06 compile-time invariant独立拥有，不引用 `04` request-body candidate |
| B -> C 历史用户门禁 | consumed | 用户已确认并完成 C 批；当前不得据此自动进入 D |
| 是否修改正式 `03` | no | 仍 blocked until Step 19 |
| 是否需要提交 | no | 只修改 design-calibration 中间产物和台账 |

## 28. B 批静态闭环检查

| 检查项 | 结论 | 说明 |
|---|---|---|
| 12 个对象是否各有独立 definition / use / factory 或 transition | pass_for_B | §§11~22逐对象列出 |
| protocol snapshot 与 application snapshot 是否一一映射 | pass_for_B | §23.1字段表；binding明确排除在bytes外 |
| record 与 snapshot 是否有 pair consistency | pass_for_B | §22.2、§22.3、§22.4 |
| bytes 是否有边界、不可变和 redaction gate | pass_for_B | §14；`262_144` 是 Step 06 compile-time safety ceiling，不是 `04` 输入或性能证据 |
| receipt / failure / dead-letter 是否 body-free | pass_for_B | 只含 typed ref、finite kind/reason、schema、digest、时间；reason/ref co-presence已闭口 |
| state 是否与 outcome carrier闭合 | pass_for_B | §21、§22.3、§24 |
| publication failure 是否不反写业务 truth | pass_for_B | §3.1、§22.4、§26 |
| retry / claim / token / repository / DTO 是否越界 | pass_no_future_definition | 只登记 affected-use，未在本批定义 |
| raw body、credential、endpoint、topic、provider response、真实 run/evidence 是否进入 | pass_no_forbidden_material | 全批无此字段或伪造事实 |
| formal `03` 是否被修改 | no | 本批仅中间产物 |
| 外部上游 blocker | none | 内部 blocker 仍按 §27 记录 |

## 29. B 批历史门禁与当前恢复指针

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `R06.6-B_done_waiting_user` | stored-result 与 outbox 12 个对象卡、protocol/application snapshot 分离、state/pair/UoW/body-free边界、affected-use、回填草稿和静态检查已完成；该历史门禁已由用户确认并被 C 批消费 | historical action consumed；current pointer=`R06.6-D2_done_waiting_user`，next=`wait_user_confirmation_before_R06.6-D3_job_item_state_outcome_item_cards` |

## 30. S07-D cross-crate outbox codec visibility addendum

> Current affected correction: this section supersedes only earlier `pub(crate)` visibility on validated persistence and publisher functions. Object fields, state transitions, byte bounds and publication truth boundaries remain unchanged.

`observability-infra` implements `ObservationOutboxRepository` and the publication adapter from a separate crate. It must be able to decode exact stored bytes, rehydrate the record/result objects and read the immutable payload. Making a repository trait public while leaving every codec and byte selector crate-private is not implementable. The following surfaces therefore use `pub` Rust visibility with the same validation and private-field rules:

| object | public-to-infra validated surface | authority still withheld |
|---|---|---|
| `BodyFreeSerializedEvent` | `try_rehydrate(Vec<u8>)`; `as_bytes()`; `len()` | canonical construction remains typed-encoder-only; bytes are never log/public material |
| `PublicationReceipt` | `try_rehydrate(...)`; all typed selectors; `matches_snapshot(...)` | adapter cannot attach it to a different snapshot or claim acceptance |
| `PublicationFailureKind` | finite decode, `as_token`, `requires_probe`, defect classification | no provider string/code parsing or retry policy decision |
| `PublicationFailure` | `try_rehydrate(...)`; selectors; `matches_snapshot(...)` | no failure fabrication from raw errors outside the finite adapter mapper |
| `DeadLetterReason` and `DeadLetterRef` use | finite decode/typed ref access through the existing owner | no raw payload or hidden reopen |
| `ObservationOutboxPayloadSnapshot` | `try_rehydrate(...)`; `verify_integrity()`; every read-only selector including exact bytes | no replacement serialization, current binding lookup or mutable byte access |
| `OutboxPublicationState` | exact token decode and read predicates | no state transition without owning object and repository CAS |
| `ObservationOutboxRecord` | `try_rehydrate(...)`; pair validation; identity/outcome selectors | transition methods remain application-controlled; no adapter direct marker mutation |

The `pending` factory and `mark_published/mark_failed/mark_dead_letter` methods remain application-owned mutation methods. Infra persists a fully validated post-state by the typed Step 07 stage method; it does not call a state setter, infer a transition from columns, or construct a record literal. A fake must pass through the same rehydrate/integrity functions as a durable codec.

This closes `R07-OUTBOX-CROSS-CRATE-VIS-01` at design-only depth. It does not restore a worker candidate loop, expose payload bytes to protocol/telemetry, change `Failed` back to `Pending`, or claim tests/implementation/evidence.

## 31. S07-D publication attempt accounting addendum

> Current affected correction: the outbox marker intentionally retains only the latest publication failure, while `RetryPolicyConfig` requires a durable `completed_additional_attempts` input. This section supplies that missing owner without adding attempt fields to `ObservationOutboxRecord`, changing its four-state lifecycle, or creating a second external-effect identity.

### 31.1 Owner and durable carriers

`application::outbox` owns an append-only publication-attempt sidecar keyed by the existing `OutboxRecordRef`. It records local authorization and completion facts for calls made with the exact immutable outbox token. It is coordination/accounting material, not source truth, external acceptance, a mutable intent state, a scheduler attempt, or a replacement for the outbox marker.

```rust
/// Positive, contiguous call-attempt ordinal scoped to one outbox record.
pub struct PublicationAttemptOrdinal(NonZeroU32);

/// Immutable local authorization committed before one publication call can begin.
pub struct PublicationAttemptAuthorization {
    /// Marker whose immutable snapshot reconstructs the stable publication token.
    outbox_ref: OutboxRecordRef,
    /// Positive contiguous ordinal within this marker's attempt history.
    ordinal: PublicationAttemptOrdinal,
    /// Marker-row version reloaded and guarded by the pre-call UoW.
    authorized_record_version: ObservationRepositoryVersion,
    /// Immutable plan containing the exact Outbox work item.
    plan_ref: ObservationJobExecutionPlanRef,
    /// Local execution lineage owning that immutable plan.
    execution_ref: ObservationJobExecutionRef,
    /// Exact item-claim row used by the pre-call commit guard.
    claim_ref: ObservationExecutionClaimRef,
    /// Exact owner epoch retained by that claim row.
    owner_ref: ObservationClaimOwnerRef,
    /// Same-work-key fencing token retained by that claim row.
    fencing_token: ObservationFencingToken,
    /// Claim-row version registered and revalidated by the pre-call UoW.
    claim_row_version: ObservationRepositoryVersion,
    /// Application observation time for the committed authorization fact.
    authorized_at: ObservedAt,
}

/// Finite basis proving how an authorized ordinal was resolved.
pub enum PublicationAttemptCompletionBasis {
    /// The adapter invocation itself returned the finite completion result.
    InvocationResult,
    /// A probe resolved an already persisted timeout/unknown observation.
    ProbeAfterIndeterminateObservation,
    /// A probe resolved an authorization with no durable invocation result.
    ProbeWithoutDurableInvocationOutcome,
}

/// Durable ordinal-bound observation that requires an exact-token probe.
pub struct PublicationAttemptIndeterminateObservation {
    /// Marker owning the unresolved authorization.
    outbox_ref: OutboxRecordRef,
    /// Exact authorized ordinal whose invocation remained indeterminate.
    ordinal: PublicationAttemptOrdinal,
    /// Exact timeout/unknown classification returned by that invocation.
    failure_kind: PublicationFailureKind,
    /// Application observation time for this local result.
    observed_at: ObservedAt,
}

/// Finite resolved outcome used only for retry-budget accounting.
pub enum PublicationAttemptCompletionKind {
    /// The matching outbox marker is staged as Published with a compatible receipt.
    Published {
        /// Exact invocation/probe basis for the positive observation.
        basis: PublicationAttemptCompletionBasis,
    },
    /// The exact stable token is known not to be published.
    NotPublished {
        /// Exact durable local failure classification retained by the marker.
        failure_kind: PublicationFailureKind,
        /// Typed basis that permits this failure to complete the authorization.
        basis: PublicationAttemptCompletionBasis,
    },
}

/// Immutable completion fact paired with one prior authorization.
pub struct PublicationAttemptCompletion {
    /// Marker owning the matching authorization ordinal.
    outbox_ref: OutboxRecordRef,
    /// Exact previously authorized ordinal resolved by this completion.
    ordinal: PublicationAttemptOrdinal,
    /// Finite publication or non-publication result.
    kind: PublicationAttemptCompletionKind,
    /// Application observation time for the durable completion fact.
    completed_at: ObservedAt,
}

/// Validated fold of the complete append-only attempt history for one marker.
pub struct PublicationAttemptAccounting {
    /// Number of resolved authorizations, including the initial attempt.
    completed_attempt_count: u32,
    /// Resolved attempts after the initial one; this is the retry-budget input.
    completed_additional_attempts: u32,
    /// Sole authorization whose external cut has not yet been resolved, if any.
    unresolved_authorization: Option<PublicationAttemptAuthorization>,
    /// Ordinal-bound timeout/unknown result for that authorization, if persisted.
    unresolved_observation: Option<PublicationAttemptIndeterminateObservation>,
    /// Last resolved completion in contiguous ordinal order, if any.
    last_completion: Option<PublicationAttemptCompletion>,
}
```

All fields remain private. `PublicationAttemptOrdinal::try_new` rejects zero and overflow; `next()` is checked and never wraps. `PublicationAttemptAuthorization::try_new(record, record_version, ordinal, plan, claim, claim_row_version, authorized_at)` copies only Step 06-owned object fields plus the two explicit repository versions after validating `Item { execution_ref, work_key: Outbox(outbox_ref) }`; it does not depend on a Step 07 point-read carrier. Its public rehydrate factory validates the same relation fieldwise. `PublicationAttemptIndeterminateObservation::try_new(authorization, kind, observed_at)` accepts only `TransportTimeout` or `OutcomeUnknown` and copies the exact outbox/ordinal relation. Completion has separate `try_published(..., basis, ...)` and `try_not_published(..., failure_kind, basis, ...)` factories plus a public validated rehydrate factory. Every carrier exposes typed read-only selectors for the application/infra persistence boundary. `PublicationAttemptAccounting::try_from_history(record, authorizations, indeterminate_observations, completions)` validates the complete history and exposes `completed_attempt_count()`、`completed_additional_attempts()`、`unresolved_authorization()`、`unresolved_observation()` and `last_completion()`.

### 31.2 Contiguity, completion and budget semantics

The durable relation is exact:

1. Authorization ordinals for one `outbox_ref` start at one and are contiguous; one ordinal has exactly one immutable authorization.
2. At most one indeterminate observation and one completion exist for an authorization. Either without its authorization, a duplicate with different content, or any ordinal gap is a persistence invariant violation. An observation may precede a later completion and remains immutable history after resolution.
3. A new authorization is legal only when every lower ordinal has a completion and no unresolved authorization exists. Its ordinal is exactly `completed_attempt_count + 1`.
4. The first completed authorization is the initial attempt. Therefore `completed_additional_attempts = completed_attempt_count.saturating_sub(1)`; the derived value is never supplied by a worker or stored as an independently mutable counter.
5. `RetryPolicyConfig::allows_additional_attempt(accounting.completed_additional_attempts())` is the sole budget check for a new authorization after a `Failed` marker. Scheduler invocation count、Job execution count、claim count、wall-clock guesses and the number of replaced `last_failure` values are not budget inputs.
6. A resolved completion is appended in the same short UoW as the matching marker post-state, item classification and Draft report fold. `Published` requires a compatible Published marker. `NotPublished` requires a Failed marker with the exact completion `failure_kind`, or a DeadLettered marker that terminally isolates that same completed failure.
7. `InvocationResult` requires no indeterminate observation for that ordinal. It accepts `Published` with a compatible invocation receipt, or `NotPublished` only with a failure kind whose owner says no probe is required. Known provider non-acceptance and finite adapter preflight failure after authorization both consume that authorized invocation ordinal.
8. `ProbeAfterIndeterminateObservation` requires exactly one prior indeterminate observation for the same authorization and an exact-token probe. `Published` resolves the ordinal without changing the historical observation. `NotPublished` additionally requires a completion failure kind equal to the observation and retained Failed marker; only `TransportTimeout` or `OutcomeUnknown` are valid, and no layer may substitute another cause.
9. `ProbeWithoutDurableInvocationOutcome` requires an authorization with neither completion nor indeterminate observation plus an exact-token probe. `Published` uses the probe receipt. `NotPublished` requires `failure_kind == OutcomeUnknown`; the pre-state marker may be initial Pending or the Failed result of the last completed ordinal, and the post-probe UoW stages a new canonical OutcomeUnknown failure for the current ordinal. This basis records that no exact current-ordinal invocation result survived and does not claim whether a provider call began or invent a transport cause.
10. A `TransportTimeout` or `OutcomeUnknown` call result may append its exact indeterminate observation and stage the same-kind Failed marker in one guarded UoW while leaving the authorization unresolved. That UoW appends no completion and must retain the item as `Running` with the matching Draft-fold snapshot. While unresolved, no terminal item/report classification, new ordinal, terminal report finalize or new Job planning candidate is allowed. A later `Published` probe completes the same ordinal and finalizes the marker/item/fold; `Unknown` / `Unsupported` appends nothing and remains Running plus indeterminate/manual.
11. A formal negative after an ambiguous or unobserved call cut resolves the existing authorization; it does not erase that attempt or mint a free retry. The next call, if budget and backoff permit, requires the next ordinal, a fresh current item claim, another committed pre-call authorization and the same stable publication token.

`authorized_at` and `completed_at` come from explicit `ClockPort` captures and are durable scheduling inputs only after the later retry/backoff flow validates them. They do not order business truth, prove external non-effect, replace a claim lease, or allow the repository to invent eligibility from current time. Exact backoff calculation remains a Step 13/14 downstream concern; S07-D closes durable count and unresolved-attempt authority only.

### 31.2.1 Marker and accounting compatibility matrix

`try_from_history` validates the complete authorization / indeterminate-observation / completion collections before deriving the compact accounting view. Historical observations remain append-only after their ordinal completes; `unresolved_observation()` returns only the observation attached to the current unresolved authorization.

| marker shape | completed prefix | unresolved authorization | unresolved observation | required last-completion relation | valid interpretation |
|---|---:|---|---|---|---|
| initial `Pending` | `0` | none | none | none | structurally visible for initial planning |
| authorized initial `Pending` | `0` | ordinal `1` | none | none | pre-call commit succeeded; excluded from planning and recovery must probe before any later call |
| resolved `Failed` | `>= 1` | none | none | `NotPublished.failure_kind == marker.last_failure.kind`; basis obeys rules 7~9 | structurally visible; application alone evaluates frozen retry/backoff/dead-letter policy |
| authorized retry `Failed` | `>= 1` | ordinal `completed + 1` | none | prior completion remains the last completed result and matches the pre-authorization marker failure | retry pre-call commit succeeded; excluded from planning and recovery probes the same token |
| indeterminate current ordinal `Failed` | `>= 0` | ordinal `completed + 1` | same outbox/ordinal and timeout-or-unknown kind | prior completion, if any, remains historical; marker failure equals the unresolved observation kind | call result is locally known ambiguous; item/report remain Running/Draft until exact-token probe resolves it |
| resolved `Published` | `>= 1` | none | none | last completion is `Published` with a valid basis and marker receipt is snapshot-compatible | terminal local publication marker; no later ordinal |
| no-call `DeadLettered` | any completed prefix, including `0` | none | none | none when no attempt completed; otherwise prior completion/history and retained failure remain compatible | application policy terminally isolated existing material without fabricating an attempt |
| resolved-failure `DeadLettered` | `>= 1` | none | none | last completion is `NotPublished` and its kind equals the retained terminal failure | terminal isolation committed with resolution of that ordinal |

Every other combination is an invariant violation. In particular: Pending with a completed prefix, Failed with neither a completed failure nor current unresolved observation, terminal marker with unresolved authorization, observation without matching authorization, completion without authorization, or marker failure incompatible with the owning current ordinal must fail closed. Repository reads cannot repair these shapes from current config, Job count, timestamps, claim history or provider state.

For `InvocationResult`, completion `completed_at` equals the local `ClockPort` value used by the new receipt or failure. For `ProbeAfterIndeterminateObservation`, the observation time remains the call-result time while completion and a positive receipt use the later probe-observation time; a retained failure keeps its original observation time. For `ProbeWithoutDurableInvocationOutcome + NotPublished`, the newly staged OutcomeUnknown failure and completion use the same probe-observation time. These timestamps classify local observations only and never prove provider ordering or business acceptance.

### 31.3 No second lifecycle or intent

The attempt sidecar has no update, delete, reopen, latest-only overwrite or mutable state column. Publication still has no `ExternalEffectIntentRef`: the committed outbox pair remains the only stable external call landing and reconstructs the one `ObservationPublicationToken` used for every ordinal. Attempt facts neither alter the token nor claim target acceptance, downstream consumption, business success, signoff, real run identity or evidence alias.

This addendum closes the Step 06 owner portion of `R07-OUTBOX-RETRY-ACCOUNTING-01` at design-only depth. Step 07 must expose append/read ports and exact same-UoW relations; Step 09/11/13/14/16 propagation remains pending. No implementation, test result, run id, evidence or commit is claimed.
