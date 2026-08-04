# L4-observability 03-详细设计 Step 06 · R06.2 contracts carrier 专项

> 主控文件: `03_ddd_step_06_object_contracts.md`
> 修复批次: `R06.2 contracts typed ref / value / enum / set carrier`
> 当前模式: full-restart 定向粒度修复
> 专项完成状态: R06.2_pass_historical_checkpoint;R06.6-C_preparation_ref_owner_synchronized;R06.6-F2_cursor_contract_synchronized
> 当前整体恢复点: R06.6-F2_done_waiting_user_before_R06.7
> 当前下一动作: wait_user_confirmation_before_R06.7
> 回填状态: blocked_until_R06.8_and_step_19

## 1. 本批边界与停审门禁

| 项 | 当前裁定 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 06 `逐模块定义对象实现契约` |
| 本批唯一目标 | 将 `contracts` 当前 inventory 中的 typed identity、结构化 reference、value、enum、surface、cursor、set 和其构造所需 support carrier 压到逐类型可落码粒度 |
| 唯一 definition owner | planned `observability-contracts`;文件 owner 见 §3 |
| 主控关系 | 本文件是主控 Step 06 的 `R06.2` 专项附录;主控文件保留全模块 inventory、批次和 blocker，本文件保留逐对象 schema |
| R06.2 执行时允许输入（historical） | Step 06 标准、正式 `02` §6 / §12、概要 reference 附录、current Step 05 / Step 06，以及 Step 08 / 10 / 14 的 definition/use 反查 |
| R06.2 执行时禁止输入（historical） | 当时尚未获准读取的 `R06.3` 专项材料、实现代码猜测、README 旧 schema、provider / product schema |
| 当前禁止写入 | R06.7~R06.8专项、Step 07~19、正式 `03-详细设计.md`、任何 `04` 文件、实现代码；F2 cursor affected owner/pointer同步已完成，当前停审 |
| 直接上游 blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`；不改变contracts schema以掩盖formal `02`与H13 factory冲突 |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`;本批通过也不能单独关闭 |
| R06.2 历史停止规则 | 本文件完成、主控 / flow / ledger 同步后停审;该门禁随后经用户确认解除并已完成 R06.3 / R06.4 |
| 当前停止规则 | 本专项为已消费的历史输入并承载B/C/F2 affected definition；当前以§31及主控/flow/ledger的`R06.6-F2_done_waiting_user_before_R06.7`为准，不得恢复旧门禁 |

本节保留R06.2当时的输入边界和完成证据；它不再是当前恢复门禁。R06.6输入、A/B/C、D-1~D-6、E、F1与F2已经完成，当前恢复点只以§31、主控、flow与项目台账的`R06.6-F2_done_waiting_user_before_R06.7`为准。

本批不定义 domain truth、policy、append-only record、application service、runtime assembly 或 entry loop。结构化 reference 中的本地 boundary state 是安全引用的可用性 / 使用边界，不是 Identity、Governance、Artifact、Runtime、Sandbox、Archive、Report 或其他业务域 lifecycle truth。

## 2. 输入裁定与历史冲突

| 输入 / 冲突 | 裁定 | 影响 |
|---|---|---|
| 正式 `02` 将 12 个 reference / boundary 主语定义为多字段对象 | 保留多字段语义;名称以 `Ref` 结尾不构成透明 newtype 资格 | `ObservationSourceRef` 等按 full card 定义 |
| 修复前 Step 06 将 `ReportConsumerRef`、`PeripheralConsumerRef` 写成 `BodyFreeRef` wrapper | historical material;不得沿用 | config catalog / Step 08 DTO 后续必须改为结构化 carrier 或其具名 id |
| 修复前 Step 06 将 `MaintenanceTargetRef` 写成透明 ref | historical material;不得沿用 | maintenance / replay / no-write 调用必须保留 kind、target、allowed effect 和 guard scope |
| 概要 `MaintenanceTargetRef` 同时携带 `Eligible/Running/Completed` 与 `maintenance_ref` | execution lifecycle与R06.4 `ProjectionMaintenanceState` / `ReplayCoordinationState` / `RollupRebuildState`重复 | current target收敛为不可变descriptor；eligibility由R06.5 policy authorization表达，execution state只归owning state object |
| 概要使用 `ReferenceSnapshotStateRef`,修复前 Step 06 / 08 使用 `ReferenceSnapshotRef` | `ReferenceSnapshotStateRef` 为 canonical；旧名记为待传播 historical alias，不生成 type alias | Step 06 domain 批次、Step 08 / 09 / 11 后续受影响复审 |
| 概要使用 `ObservationSourceFamily` | 详细设计收敛到 public finite `SourceFamilyKind` | 禁止两套同义 family enum |
| Step 06 capability 表点名 `HandoffSurface` / `JobReportSurface`,但无 schema | 两者是旧占位名,排除为 historical placeholder | public job 唯一类型为 Step 08 `ObservationJobReportSurface`;handoff 使用具名 command/query/event surface,不建 generic 第二套类型 |
| `core-contracts` 当前类型 | 只复用其 `ActorRef` / `ActorContext`、`TraceId`、`Timestamp`、`JobRunId`、`IdempotencyKey` 等正式通用类型 | 本仓不得假定 core 已提供 L4 ref、digest、cursor、visibility 或 ref-set |

### 2.1 本批命名替换表

| historical / 概要骨架名 | current canonical name | 理由 |
|---|---|---|
| `ObservationSourceRefId` | 保留 | 结构化 source reference 的本地 identity |
| `ObservationSourceFamily` | `SourceFamilyKind` | 已有 public finite family,避免同义 enum |
| `ReferenceSnapshotRef` | `ReferenceSnapshotStateRef` | 与概要 reference / history 契约一致,明确指向 snapshot state |
| `ReferenceSnapshotStateRefSet` | 保留 | 元素必须是 canonical `ReferenceSnapshotStateRef` |
| `DegradationReason` | `DegradedReason` | public degraded reason 已正式化 |
| `HandoffSurface` | 不生成 | 旧 capability placeholder |
| `JobReportSurface` | `ObservationJobReportSurface` | Step 08 已有唯一 public job report schema |

## 3. planned 文件 owner 与依赖方向

| planned file | 唯一负责类型 | 允许依赖 | 禁止事项 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | `BodyFreeRef`、typed identity、结构化 reference、digest、cursor、ref-set | `contracts::errors`;`contracts::metadata`;core contracts shared types | 不依赖 domain/application/infra,不保存 locator / credential / raw body |
| `crates/contracts/src/metadata.rs` | public finite kind/state/scope/marker/version | `contracts::refs` 中仅为 enum payload 所需的稳定 ref | 不让 config / serde fallback 动态加 variant |
| `crates/contracts/src/surfaces.rs` | `VisibilitySurface`、`DegradedSurface` | refs + metadata | 不作授权 truth、不触发读取或修复 |
| `crates/contracts/src/errors.rs` | `ProtocolError` | 无业务模块依赖 | 不包装 SQL/network/provider error，不携带外部正文 |
| `crates/contracts/src/lib.rs` | 明确 re-export public contract | 上述模块 | 不重复定义类型 |

依赖方向固定为 `protocol/entry -> observability-contracts <- domain/application`。contracts 不反向依赖 domain；domain state 只能映射为 public metadata / surface，不能把 domain object 嵌入 public DTO。

## 4. 通用构造、wire 与集合规则

### 4.1 `TC` 透明 typed identity 模板

每个 §6 / §7 标为 `TC` 的类型都必须实际生成独立 Rust newtype，不是 type alias：

```rust
/// Body-free identity owned by one exact observability contract type.
#[repr(transparent)]
pub struct ExampleRef(BodyFreeRef);
```

| 模板项 | 统一契约 |
|---|---|
| 构造 | `pub fn new(value: BodyFreeRef) -> Self`;raw string 只能先通过 `BodyFreeRef::parse` |
| 读取 | `pub fn as_body_free_ref(&self) -> &BodyFreeRef` |
| 所有权转移 | `pub fn into_body_free_ref(self) -> BodyFreeRef` |
| wire | 在具名 DTO 字段中编码为一个已校验 opaque string；字段 schema 决定 wrapper owner |
| canonical digest | 必须折叠 wrapper discriminator + inner value；相同 inner value 的不同 wrapper digest 不同 |
| equality / order | wrapper 内按 `BodyFreeRef` byte order；不同 wrapper 没有比较 / 转换 |
| serde | decode 先走 `BodyFreeRef::parse`；不得 trim、case-fold、alias 或 fallback |
| debug / display | `Debug` 只输出类型名 + redacted token；`Display` 不实现，避免日志无意泄露完整值 |
| 禁止 | `From<String>`、`AsRef<str>` 跨 boundary 逃逸、type alias、不同 owner 间 `From`、从 scope/hash/path 猜 identity |

单个对象卡只可复用上述行为，不可省略 owner、mint source、wire discriminator、用途和测试红线。

### 4.2 enum wire 模板

所有 public enum 使用本文件给出的 exact lowercase `snake_case` token。Unknown token 立即返回 `ProtocolError::UnknownEnumToken`;禁止 `Other(String)`、数字别名、大小写折叠、首变体默认或 unknown passthrough。增加 variant 必须重开 contracts / protocol / compatibility 设计。

### 4.3 set wire 模板

所有 ref-set 内部使用 canonical sorted unique `Vec<T>`，wire 是 canonical array。构造时先验证 member owner / kind，再按该类型 canonical key 排序并去重；重复成员折叠为一个，不保留输入顺序。超出 hard maximum 返回 `ProtocolError::SetTooLarge`。是否允许空集由每张 set 卡单独裁定；不得用 `HashSet` 的非确定顺序参与 wire 或 digest。

## 5. `BodyFreeRef`

### 5.1 capability / object source

`BodyFreeRef` 是本仓所有本地 opaque ref 的最小值对象。来源为 trusted protocol input、trusted resolver snapshot 或 application id generator 的输出；它不证明被引用对象存在、可见、真实或属于某业务域。

### 5.2 Rust type definition

```rust
/// Validated opaque pointer that cannot carry a body or a destination locator.
pub struct BodyFreeRef(String);
```

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| private `value` | `String` | trusted input / resolver / id generator | UTF-8 byte length `1..=256`;exact ASCII token `[A-Za-z0-9][A-Za-z0-9._:-]*`;不得含 `/`、`\\`、whitespace、control、query、fragment或 `://` |

### 5.3 factory / static functions

| 签名 | 结果 | 失败 |
|---|---|---|
| `pub fn parse(value: String) -> Result<Self, ProtocolError>` | 不改写输入地校验并构造 | empty -> `EmptyReference`;非法字符/长度/locator-like -> `MalformedReference` |
| `pub fn from_generated(value: String) -> Result<Self, ProtocolError>` | 校验 id generator 输出；不在 contracts 内自行生成 | 同上；生成器错误由 application owner |

### 5.4 member functions

| 签名 | 作用 | 副作用 |
|---|---|---|
| `pub fn as_str(&self) -> &str` | 供 canonical encoder / repository key mapper 读取 | 无 |
| `pub fn canonical_bytes(&self) -> &[u8]` | 供 typed digest / ordering 使用 | 无 |
| `impl Debug for BodyFreeRef` | 只显示类型名、前后固定短片段及长度 | 不返回完整 value；不提供 `Display` |

### 5.5 invariants / owner / test redlines

- `BodyFreeRef` 不接受 raw log、metric、trace、audit body、evidence body、file path、URI、topic、bucket、endpoint、credential 或 provider payload。
- body-free 是输入形态保证，不是 existence / authorization / authenticity 保证；这些由 resolver / policy / state owner 判断。
- 必测 empty、257 bytes、whitespace、newline、slash、URI-like、Unicode、合法边界长度、debug redaction 和 parse round-trip。
- 对象停审结论: `pass_R06.2`;后续只能按本契约实现，不能扩大字符集或把 locator 纳入 ref。

## 6. 本仓 owned transparent identity 独立对象卡

以下对象全部复用 §4.1，但每个对象拥有独立 Rust 类型、mint source、wire field 和禁止互换规则。

### 6.1 `ObservationReceiptRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ObservationReceiptRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;application id generator 在首次创建 `ObservationReceipt` 前生成 |
| factory / member | §4.1 `new/as_body_free_ref/into_body_free_ref`;无状态成员 |
| wire / use | `observation_receipt_ref`;receipt command result、query、history、outbox |
| invariants | 只指向本仓 receipt identity；不得包装 source event ref |
| test redlines / stop | 与 `SafetyDispositionRef` 相同 inner 仍不可互换；`pass_R06.2` |

### 6.2 `SafetyDispositionRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SafetyDispositionRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;同一 UoW 中由 application id generator 在 disposition factory 前生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `safety_disposition_ref`;receipt、audit、safety result |
| invariants | 不等于 policy decision / reason，不指向 raw redaction material |
| test redlines / stop | receipt ref owner mismatch 必须拒绝；`pass_R06.2` |

### 6.3 `CorrelationContextRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct CorrelationContextRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;canonical correlation context 首次绑定时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `correlation_context_ref`;safe signal、projection scope、query |
| invariants | 不是 `TraceId`、causation id 或业务 correlation truth |
| test redlines / stop | 禁止从 trace id 直接转换；`pass_R06.2` |

### 6.4 `SafeSignalRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SafeSignalRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;safe signal 被接受并构造时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `safe_signal_ref`;signal view、rollup、outbound event |
| invariants | 不指向 raw log / metric / trace record |
| test redlines / stop | raw provider record id 不得未经边界映射直接包装；`pass_R06.2` |

### 6.5 `SignalRollupWindowRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SignalRollupWindowRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;首次创建 canonical rollup scope/window 时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `signal_rollup_window_ref`;rollup query / rebuild |
| invariants | 不由时间窗口字符串、scope hash 或 cursor 拼接生成 |
| test redlines / stop | 同 scope replacement 保留 identity；`pass_R06.2` |

### 6.6 `AuditProjectionRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct AuditProjectionRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;本仓 audit projection append identity 生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `audit_projection_ref`;timeline、event、evidence linkage |
| invariants | 不冒充 source audit event identity 或 Governance audit truth |
| test redlines / stop | source audit ref owner mismatch；`pass_R06.2` |

### 6.7 `EvidenceLinkageRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct EvidenceLinkageRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;body-free linkage 首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `evidence_linkage_ref`;evidence index、handoff、audit export |
| invariants | 不等于真实 evidence alias，不可解析为 evidence body |
| test redlines / stop | evidence URI/path 必须在 `BodyFreeRef` 层拒绝；`pass_R06.2` |

### 6.8 `ReportHandoffRecordRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ReportHandoffRecordRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;handoff record draft 首次建立时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `report_handoff_record_ref`;query、event、archive boundary |
| invariants | 不等于 report id、final verdict、signoff 或 external run id |
| test redlines / stop | 禁止以 consumer destination ref 代替；`pass_R06.2` |

### 6.9 `AuthenticityHintRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct AuthenticityHintRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;本仓 authenticity hint 首次评估时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `authenticity_hint_ref`;handoff view / history |
| invariants | identity 本身不证明 authenticity，不得编码 evidence verdict |
| test redlines / stop | 不得从 digest 自动派生；`pass_R06.2` |

### 6.10 `RetentionMarkerRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct RetentionMarkerRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;本仓 retention marker 创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `retention_marker_ref`;protected reference / retention query |
| invariants | 不表示 cleanup job、external retention policy 或删除许可 |
| test redlines / stop | 禁止用 timestamp / policy key 直接包装；`pass_R06.2` |

### 6.11 `ActiveReferenceProtectionRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ActiveReferenceProtectionRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;active protection 首次建立时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `active_reference_protection_ref`;retention guard / history |
| invariants | 不等于 protected object ref 或 retention marker ref |
| test redlines / stop | 三者互换必须编译期/decoder拒绝；`pass_R06.2` |

### 6.12 `ReplayScopeRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ReplayScopeRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;replay scope 被定义时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `replay_scope_ref`;replay command/job/history |
| invariants | 不等于 target ref、job execution ref 或 source replay id |
| test redlines / stop | 禁止从 target set digest 直接转换；`pass_R06.2` |

### 6.13 `NoWriteViolationRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct NoWriteViolationRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;violation 被记录时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `no_write_violation_ref`;diagnostic、audit、event |
| invariants | 不表示补偿操作、修复结果或 Governance verdict |
| test redlines / stop | attempted target ref 不可充当 violation ref；`pass_R06.2` |

### 6.14 `ReadVisibilityRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ReadVisibilityRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;持久化 visibility decision 建立时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `read_visibility_ref`;read access / diagnostic history |
| invariants | identity 不授予访问权，不等于 actor / scope |
| test redlines / stop | 不得以 request context ref 代替；`pass_R06.2` |

### 6.15 `DiagnosticSummaryRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct DiagnosticSummaryRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;diagnostic summary 首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `diagnostic_summary_ref`;diagnostic view / freshness |
| invariants | 不包含 diagnostic body，不作为 query request identity |
| test redlines / stop | 与 `DiagnosticRequestContextRef` 不可互换；`pass_R06.2` |

### 6.16 `DiagnosticScopeRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct DiagnosticScopeRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;canonical diagnostic projection scope 首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `diagnostic_scope_ref`;diagnostic summary / request context |
| invariants | 不从 scope JSON/hash/path 拼接，replacement 保留 identity |
| test redlines / stop | 相同 scope 不允许生成并存 identity；repository uniqueness 后续承接；`pass_R06.2` |

### 6.17 `DiagnosticRequestContextRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct DiagnosticRequestContextRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;API/query entry 为单次请求生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `diagnostic_request_context_ref`;correlation/audit only |
| invariants | one-shot，不持久化为 projection identity，不进入 projection lookup |
| test redlines / stop | 禁止复用 `DiagnosticScopeRef` 或 view ref；`pass_R06.2` |

### 6.18 `GapStateRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct GapStateRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;gap 首次打开时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `gap_state_ref`;visibility、degraded、job report、diagnostic |
| invariants | 不等于 gap source ref，不代表 source 已修复 |
| test redlines / stop | close 后 identity 保留；`pass_R06.2` |

### 6.19 `PeripheralDeliveryRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct PeripheralDeliveryRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;本仓外围交付状态首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `peripheral_delivery_ref`;delivery view/event/history |
| invariants | 不等于 external adapter receipt、endpoint 或 consumer identity |
| test redlines / stop | provider receipt id 不得直接包装；`pass_R06.2` |

### 6.20 `ProjectionMaintenanceRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ProjectionMaintenanceRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;maintenance state 首次建立时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `projection_maintenance_ref`;worker loop / rebuild progress |
| invariants | 不等于 target ref、job ref 或 replay scope ref |
| test redlines / stop | 三类 owner mismatch；`pass_R06.2` |

### 6.21 `ObservationReadModelRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ObservationReadModelRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;canonical projection 首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `observation_read_model_ref`;query / rebuild / freshness |
| invariants | scope 使用 lookup index 关联；不得由 scope serialization/hash 直接转成 identity |
| test redlines / stop | replacement 保留 ref；`pass_R06.2` |

### 6.22 `DiagnosticViewRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct DiagnosticViewRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;explain-only projection 首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `diagnostic_view_ref`;query / rebuild report |
| invariants | 不等于 diagnostic scope / request context / summary identity |
| test redlines / stop | 三者 owner discriminator 必须保留；`pass_R06.2` |

### 6.23 `DashboardAlertExportViewRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct DashboardAlertExportViewRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;consumer + scope 的 canonical peripheral projection 首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `dashboard_alert_export_view_ref`;query / export / rebuild |
| invariants | 不等于 dashboard/alert/GRC product object identity |
| test redlines / stop | product locator/id 不得未经本仓生成器映射直接包装；`pass_R06.2` |

### 6.24 `RebuildProgressViewRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct RebuildProgressViewRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;maintenance target 的 progress projection 首次创建时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `rebuild_progress_view_ref`;progress query / job report |
| invariants | 不等于 job run / execution / maintenance identity |
| test redlines / stop | 禁止伪造外部 run id；`pass_R06.2` |

### 6.25 `ProjectionFreshnessMarkerRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ProjectionFreshnessMarkerRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;projection 首次创建时为一对一 freshness sidecar 生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `projection_freshness_marker_ref`;query surface / rebuild |
| invariants | marker 与 projection ref 一对一；不能独立换 owner或当 cursor |
| test redlines / stop | duplicate marker binding 后续 repository uniqueness 必测；`pass_R06.2` |

### 6.26 `ReferenceSnapshotStateRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ReferenceSnapshotStateRef(BodyFreeRef);` |
| owner / mint source | `contracts::refs`;reference snapshot state 首次注册时生成 |
| factory / member | §4.1；无状态成员 |
| wire / use | `reference_snapshot_state_ref`;structured refs、snapshot view/event/history |
| invariants | canonical name；不生成 `ReferenceSnapshotRef` alias；不是 external object ref |
| test redlines / stop | historical wire field `snapshot_ref` 可映射到此类型,但 decoder owner 不能降成 generic ref；`pass_R06.2` |

## 7. 结构化 reference 的基础 identity 与安全引用

### 7.1 `ObservationSourceRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ObservationSourceRefId(BodyFreeRef);` |
| source | 本仓 id generator 在创建 source reference snapshot 前生成 |
| factory / member | §4.1；wire field `source_ref_id` |
| invariant | 只标识本地 reference snapshot，不等于 external source object |
| test / stop | 与 `ExternalObjectRef` 相同 inner 仍不可互换；`pass_R06.2` |

### 7.2 `RuntimeSandboxSignalRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct RuntimeSandboxSignalRefId(BodyFreeRef);` |
| source | 本仓 id generator 在接受 runtime / sandbox safe summary 时生成 |
| factory / member | §4.1；wire field `runtime_signal_ref_id` |
| invariant | 不等于 runtime execution、tool call、sandbox session 或 provider result id |
| test / stop | locator / external run id 负例；`pass_R06.2` |

### 7.3 `ReportConsumerRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ReportConsumerRefId(BodyFreeRef);` |
| source | validated config/catalog 的稳定 logical consumer id；不得由 endpoint/path/topic 派生 |
| factory / member | §4.1；wire field `report_consumer_ref_id` |
| invariant | config revision 可变时 logical id 保持；destination binding 另由 infra owner |
| test / stop | endpoint change 不改变 id；`pass_R06.2` |

### 7.4 `ProtectedObservationRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ProtectedObservationRefId(BodyFreeRef);` |
| source | 本仓 id generator 在保护关系首次建立时生成 |
| factory / member | §4.1；wire field `protected_observation_ref_id` |
| invariant | 不等于被保护 object ref 或 retention marker ref |
| test / stop | owner mismatch；`pass_R06.2` |

### 7.5 `GapSourceRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct GapSourceRefId(BodyFreeRef);` |
| source | 本仓 id generator 在 tracked gap source 首次登记时生成 |
| factory / member | §4.1；wire field `gap_source_ref_id` |
| invariant | gap source identity 不等于 gap state identity |
| test / stop | 与 `GapStateRef` 禁止互换；`pass_R06.2` |

### 7.6 `PeripheralConsumerRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct PeripheralConsumerRefId(BodyFreeRef);` |
| source | validated config/catalog 的稳定 logical consumer id；不含 product identity |
| factory / member | §4.1；wire field `peripheral_consumer_ref_id` |
| invariant | dashboard/alert/GRC provider、route、credential 不能进入 id |
| test / stop | product locator 负例；`pass_R06.2` |

### 7.7 `SubjectObservationReferenceId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SubjectObservationReferenceId(BodyFreeRef);` |
| source | 本仓 id generator 在安全 subject snapshot 首次注册时生成 |
| factory / member | §4.1；wire field `subject_observation_reference_id` |
| invariant | 不等于 Identity subject id，不拥有 identity lifecycle |
| test / stop | `SubjectSafeRef` 不能代替；`pass_R06.2` |

### 7.8 `GovernanceArtifactEvidenceReferenceId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct GovernanceArtifactEvidenceReferenceId(BodyFreeRef);` |
| source | 本仓 id generator 在跨域 body-free reference 首次注册时生成 |
| factory / member | §4.1；wire field `boundary_ref_id` |
| invariant | 不等于 Governance decision、Artifact、Evidence 或 baseline identity |
| test / stop | external alias/path 负例；`pass_R06.2` |

### 7.9 `RuntimeSandboxSummaryRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct RuntimeSandboxSummaryRefId(BodyFreeRef);` |
| source | 本仓 id generator 在 resolver snapshot 首次登记时生成 |
| factory / member | §4.1；wire field `runtime_sandbox_summary_ref_id` |
| invariant | 不等于 safe summary、execution、sandbox session 或 provider response id |
| test / stop | owner mismatch；`pass_R06.2` |

### 7.10 `ArchiveReportHandoffRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ArchiveReportHandoffRefId(BodyFreeRef);` |
| source | 本仓 id generator 在 archive/report boundary 首次建立时生成 |
| factory / member | §4.1；wire field `archive_report_handoff_ref_id` |
| invariant | 不等于 archive package、report、acceptance、external delivery 或 signoff id |
| test / stop | 禁止外部 run/signoff alias；`pass_R06.2` |

### 7.11 `MaintenanceTargetRefId`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct MaintenanceTargetRefId(BodyFreeRef);` |
| source | 本仓 id generator 在 canonical maintenance target 首次登记时生成 |
| factory / member | §4.1；wire field `maintenance_target_ref_id` |
| invariant | 不等于 target object、job execution、replay scope 或 maintenance state identity |
| test / stop | scope/hash/job id 不可直接转换；`pass_R06.2` |

### 7.12 外部安全 typed ref 独立卡

#### `ExternalObjectRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct ExternalObjectRef(BodyFreeRef);` |
| source | authenticated upstream envelope / resolver snapshot |
| factory / member | §4.1；不提供 locator parser |
| invariant | 只是不透明安全引用；owner family 必须由 enclosing structured ref 给出 |
| test / stop | URI/path/raw body 拒绝；`pass_R06.2` |

#### `SafeExternalSummaryRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SafeExternalSummaryRef(BodyFreeRef);` |
| source | trusted resolver 返回的已 redacted summary identity |
| factory / member | §4.1 |
| invariant | 指向安全摘要，不承载摘要正文或证明真实性 |
| test / stop | evidence body/hash alias 不可充当；`pass_R06.2` |

#### `RuntimeScopeRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct RuntimeScopeRef(BodyFreeRef);` |
| source | authenticated runtime boundary / resolver |
| factory / member | §4.1 |
| invariant | 只表示 runtime scope，不是 process endpoint、run id 或 execution verdict |
| test / stop | endpoint /真实 run id 负例；`pass_R06.2` |

#### `SandboxScopeRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SandboxScopeRef(BodyFreeRef);` |
| source | authenticated sandbox boundary / resolver |
| factory / member | §4.1 |
| invariant | 只表示 sandbox scope，不是 credential、workspace path 或 tool result |
| test / stop | path/credential 负例；`pass_R06.2` |

#### `SafeSignalSummaryRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SafeSignalSummaryRef(BodyFreeRef);` |
| source | runtime/sandbox safe-summary envelope |
| factory / member | §4.1 |
| invariant | 不指向 raw log/metric/trace/tool output |
| test / stop | provider payload ref 未经 safe resolver 不得包装；`pass_R06.2` |

#### `VisibilityConstraintRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct VisibilityConstraintRef(BodyFreeRef);` |
| source | validated visibility policy snapshot / resolver |
| factory / member | §4.1 |
| invariant | 只引用约束，不授予权限，不含 policy body |
| test / stop | actor/role string 不得直接包装；`pass_R06.2` |

#### `SubjectSafeRef`

| 卡片项 | 独立契约 |
|---|---|
| Rust type | `pub struct SubjectSafeRef(BodyFreeRef);` |
| source | Identity / source owner 提供的 safe subject reference |
| factory / member | §4.1 |
| invariant | 不拥有 subject profile、credential 或 identity lifecycle |
| test / stop | PII/body/path 拒绝；`pass_R06.2` |

## 8. tagged observation-side reference carrier

### 8.1 `ObservationObjectRef`

#### Rust type / variants

```rust
/// Typed reference to an object whose truth or derived state is owned by observability.
pub enum ObservationObjectRef {
    ObservationReceipt(ObservationReceiptRef),
    SafetyDisposition(SafetyDispositionRef),
    CorrelationContext(CorrelationContextRef),
    SafeSignal(SafeSignalRef),
    SignalRollupWindow(SignalRollupWindowRef),
    AuditProjection(AuditProjectionRef),
    EvidenceLinkage(EvidenceLinkageRef),
    ReportHandoffRecord(ReportHandoffRecordRef),
    AuthenticityHint(AuthenticityHintRef),
    RetentionMarker(RetentionMarkerRef),
    ActiveReferenceProtection(ActiveReferenceProtectionRef),
    ReplayScope(ReplayScopeRef),
    NoWriteViolation(NoWriteViolationRef),
    ReadVisibility(ReadVisibilityRef),
    DiagnosticSummary(DiagnosticSummaryRef),
    GapState(GapStateRef),
    PeripheralDelivery(PeripheralDeliveryRef),
    ReferenceSnapshotState(ReferenceSnapshotStateRef),
    ProjectionMaintenance(ProjectionMaintenanceRef),
    ObservationReadModel(ObservationReadModelRef),
    DiagnosticView(DiagnosticViewRef),
    DashboardAlertExportView(DashboardAlertExportViewRef),
    RebuildProgressView(RebuildProgressViewRef),
}
```

| 契约项 | 裁定 |
|---|---|
| factory | 仅各 variant 显式 constructor；无 `from_body_free_ref` |
| member | `kind() -> ObservationObjectKind`;`body_free_ref() -> &BodyFreeRef`;`is_derived() -> bool` |
| wire | tagged object `{ "kind": <exact token>, "ref": <opaque string> }`;禁止 untagged string |
| source | 本仓 object / projection typed ref |
| invariant | variant 必须保留 owner；不包含 source truth、external object、provider product 或 body |
| test redlines | 23 variants round-trip；unknown kind、kind/ref owner mismatch、untagged input 拒绝 |
| stop | `pass_R06.2` |

`ObservationObjectKind` 与上述 variant 一一对应，wire token 使用 variant 的 lowercase `snake_case`。它只用于 kind inspection，不单独携带 ref；total mapping 必须编译期穷尽。

### 8.2 `AffectedObservationObjectRef`

```rust
/// Observation-side object whose state or derived surface was affected.
pub struct AffectedObservationObjectRef(ObservationObjectRef);
```

| 契约项 | 裁定 |
|---|---|
| factory | `pub fn from_object(object_ref: ObservationObjectRef) -> Self` |
| member | `object_ref() -> &ObservationObjectRef`;`into_object_ref()` |
| wire | 保留 inner tagged object；外层字段名表达 affected 语义 |
| invariant | 不接受 external/source truth ref；不声称影响成功或修复完成 |
| test / stop | external ref / untagged string 拒绝；`pass_R06.2` |

### 8.3 `ReplayTargetRef`

```rust
/// Observation-side target eligible for replay coordination.
pub struct ReplayTargetRef(ObservationObjectRef);
```

| 契约项 | 裁定 |
|---|---|
| factory | `pub fn try_from_object(object_ref: ObservationObjectRef) -> Result<Self, ProtocolError>` |
| allowed variants | `GapState`;`SignalRollupWindow`;`ReferenceSnapshotState`;`ObservationReadModel`;`DiagnosticView`;`DashboardAlertExportView` |
| member | `object_ref() -> &ObservationObjectRef`;`kind() -> ObservationObjectKind` |
| effect binding | `ReplayTargetRef`只证明对象具备潜在 replay 资格；`ReplayScope::define`必须再按`ReplayAllowedEffect`逐member校验：gap/reference/rollup分别只接受对应对象，projection只接受三个可重建view |
| invariant | receipt/safety/correlation等 canonical truth 不作为 replay 写目标；append-only `AuditProjection`也不得被rebuild/replay覆盖；source truth 永远不合法 |
| test / stop | 每个 allowed / denied variant；`pass_R06.2` |

### 8.4 `ObservationConsumerRef`

```rust
/// Typed consumer that can keep an observation-side reference active.
pub enum ObservationConsumerRef {
    Report(ReportConsumerRef),
    Peripheral(PeripheralConsumerRef),
    ReadModel(ObservationReadModelRef),
    Diagnostic(DiagnosticViewRef),
    ArchiveHandoff(ArchiveReportHandoffRef),
}
```

| 契约项 | 裁定 |
|---|---|
| factory | variant constructors only |
| member | `kind() -> ObservationConsumerKind`;`canonical_bytes() -> Vec<u8>`，编码 variant + stable identity |
| wire | tagged `{kind, value}`；structured consumer variants 保留完整 validated object |
| invariant | 只表示当前引用消费者，不表示访问授权或 delivery success |
| test / stop | variant mismatch、consumer state blocked/retired 仍可被记录但不能新增 protection，后者由 policy 测试；`pass_R06.2` |

### 8.5 `AuditSubjectRef`

```rust
/// Body-free subject key for an observability audit projection.
pub enum AuditSubjectRef {
    Observation(ObservationObjectRef),
    Subject(SubjectObservationReferenceId),
    GovernanceArtifactEvidence(GovernanceArtifactEvidenceReferenceId),
    RuntimeSandbox(RuntimeSandboxSummaryRefId),
    ReportConsumer(ReportConsumerRefId),
    PeripheralConsumer(PeripheralConsumerRefId),
}
```

| 契约项 | 裁定 |
|---|---|
| factory | variant constructors only |
| member | `kind() -> AuditSubjectKind`;canonical tagged serialization |
| invariant | 不嵌入 actor profile、external body、provider payload或自由 subject string |
| test / stop | all variants、unknown tag、untagged string；`pass_R06.2` |

## 9. reference / boundary public metadata

本节 §9.1/§9.3~§9.6 先给跨对象索引；它们不替代逐类型对象卡。每个索引项的独立 factory/member/invariant/test 停审卡见 §20。

### 9.1 source, consumer and scope enums

| 类型 | exact variants / wire tokens | 构造与用途 | 禁止事项 / stop |
|---|---|---|---|
| `SourceFamilyKind` | `Bus/bus`;`SourceOwner/source_owner`;`Identity/identity`;`Governance/governance`;`Artifact/artifact`;`Runtime/runtime`;`Sandbox/sandbox`;`Archive/archive`;`ReportConsumer/report_consumer` | 说明 external material truth owner family | 不证明 producer；`pass_R06.2` |
| `ReportConsumerKind` | `Report/report`;`Acceptance/acceptance`;`Archive/archive`;`ExternalAudit/external_audit` | report handoff consumer classification | 不加产品名；`pass_R06.2` |
| `HandoffPurpose` | `ReportDelivery/report_delivery`;`AcceptanceInput/acceptance_input`;`ArchiveTransfer/archive_transfer`;`ExternalAuditInput/external_audit_input` | handoff intent | 不等于 final verdict；`pass_R06.2` |
| `ConsumerBoundaryState` | `Pending/pending`;`Active/active`;`Blocked/blocked`;`Retired/retired` | report consumer local boundary state | 不映射外部 lifecycle；`pass_R06.2` |
| `PeripheralConsumerKind` | `Dashboard/dashboard`;`Alert/alert`;`ManagementReport/management_report`;`GrcExport/grc_export`;`AnomalyAnalysis/anomaly_analysis` | product-neutral peripheral family | 不携带 provider；`pass_R06.2` |
| `PeripheralConsumerState` | `Active/active`;`Limited/limited`;`Blocked/blocked`;`Retired/retired` | local consumption boundary | 不改变 observation truth；`pass_R06.2` |
| `ExportAllowedFlag` | `Allowed/allowed`;`Denied/denied` | typed export permission result | 不用 nullable bool；`pass_R06.2` |
| `ConsumerScopeKind` | `AllSafeObservations/all_safe_observations`;`Observation/observation`;`Correlation/correlation`;`AuditSubject/audit_subject`;`ReportHandoff/report_handoff`;`Diagnostic/diagnostic`;`Maintenance/maintenance`;`Explicit/explicit` | `ConsumerScope::kind()` inspection | 不单独替代完整 scope；`pass_R06.2` |

### 9.2 `ConsumerScope`

```rust
/// Product-neutral visibility scope of one logical consumer.
pub enum ConsumerScope {
    AllSafeObservations,
    Observation(ObservationReceiptRef),
    Correlation(CorrelationContextRef),
    AuditSubject(AuditSubjectRef),
    ReportHandoff(ReportHandoffRecordRef),
    Diagnostic(DiagnosticScopeRef),
    Maintenance(MaintenanceTargetRefId),
    Explicit(BodyFreeRefSet),
}
```

| 契约项 | 裁定 |
|---|---|
| factory | variant constructors；`Explicit` 复用 non-empty `BodyFreeRefSet` |
| member | `kind()`;`canonical_bytes() -> Vec<u8>`;`contains_body_free_ref()`只对 Explicit 可调用 |
| wire | tagged enum exact token + typed value |
| invariant | scope 只选择可见 surface，不授予访问、不包含 locator、不得表示 source body scan |
| test / stop | empty Explicit、wrong tag、scope canonical ordering；`pass_R06.2` |

### 9.3 reference state enums

| 类型 | exact variants / wire tokens | 语义边界 | stop |
|---|---|---|---|
| `ReferenceResolutionKind` | `Resolved/resolved`;`Unresolved/unresolved`;`Stale/stale`;`Invalid/invalid` | local safe reference resolution | `pass_R06.2` |
| `RuntimeSignalAvailabilityKind` | `Available/available`;`Degraded/degraded`;`Missing/missing`;`NotVisible/not_visible` | runtime/sandbox safe summary availability | `pass_R06.2` |
| `ProtectedObservationState` | `Protected/protected`;`ReleaseCandidate/release_candidate`;`Released/released`;`Invalid/invalid` | protection relation state | `pass_R06.2` |
| `GapSourceState` | `Known/known`;`Unknown/unknown`;`NotVisible/not_visible`;`Unresolved/unresolved` | gap source explainability,不是 gap lifecycle | `pass_R06.2` |
| `SubjectReferenceState` | `Resolved/resolved`;`Stale/stale`;`NotVisible/not_visible`;`Invalid/invalid` | identity-safe snapshot boundary | `pass_R06.2` |
| `GovernanceArtifactEvidenceReferenceState` | `Linked/linked`;`Missing/missing`;`NotVisible/not_visible`;`Invalid/invalid` | body-free cross-domain linkage boundary | `pass_R06.2` |
| `RuntimeSandboxSummaryState` | `Available/available`;`Stale/stale`;`Missing/missing`;`Blocked/blocked` | safe summary boundary | `pass_R06.2` |
| `ArchiveReportHandoffState` | `Pending/pending`;`Ready/ready`;`Blocked/blocked`;`Delivered/delivered`;`Failed/failed` | local handoff boundary;Delivered不是accepted | `pass_R06.2` |
| `MaintenanceTargetState` | historical only；旧`Eligible/Blocked/Running/Completed/Invalid`不生成current token | eligibility由policy authorization表达，execution由三个owning state object表达 | `HX_R06.4` |

除明确标为historical的`MaintenanceTargetState`外，本表 state enum 才是结构化 carrier 的 current boundary snapshot。它们不替代 Step 10 domain state machine，不允许从一个外部状态名直接推导业务成功。

### 9.4 target, family and boundary enums

| 类型 | exact variants / wire tokens | 约束 / stop |
|---|---|---|
| `ProtectionScope` | `ObjectOnly/object_only`;`LinkedEvidence/linked_evidence`;`HandoffInputs/handoff_inputs`;`DerivedViews/derived_views` | 仅 observation-side；`pass_R06.2` |
| `GapSourceKind` | `ObservationSource/observation_source`;`ReferenceSnapshot/reference_snapshot`;`EvidenceLinkage/evidence_linkage`;`Projection/projection`;`RuntimeSandbox/runtime_sandbox`;`Handoff/handoff` | 不用 free string；`pass_R06.2` |
| `ObservationSubjectKind` | `Actor/actor`;`Subject/subject`;`GovernedEntity/governed_entity`;`DomainOwner/domain_owner` | 不复制 Identity profile；`pass_R06.2` |
| `GovernanceArtifactEvidenceFamily` | `Governance/governance`;`Artifact/artifact`;`Evidence/evidence`;`Baseline/baseline` | 不声明 lineage truth；`pass_R06.2` |
| `ArchiveReportHandoffFamily` | `Archive/archive`;`Report/report`;`ExternalAudit/external_audit`;`Acceptance/acceptance` | 不声明验收结果；`pass_R06.2` |
| `MaintenanceTargetKind` | `Projection/projection`;`ReferenceSnapshot/reference_snapshot`;`Gap/gap`;`SignalRollup/signal_rollup` | 只允许四类实际 observation/derived effect target；`pass_R06.4_reconciled` |
| `MaintenanceAllowedEffect` | `RebuildDerivedProjection/rebuild_derived_projection`;`RefreshBodyFreeReference/refresh_body_free_reference`;`ScanGap/scan_gap`;`RebuildSignalRollup/rebuild_signal_rollup` | 必须与 target kind 1:1 兼容；replay coordination是application operation，不是可递归授权的domain effect；`pass_R06.4_reconciled` |
| `NoWriteGuardScope` | `SourceTruth/source_truth`;`ExternalTruth/external_truth`;`ObservationMaintenance/observation_maintenance` | 前两者表示禁止写目标，后者限制仅可改 observation/derived side；`pass_R06.2` |

### 9.5 boundary marker 独立卡

| 类型 | Rust shape / exact token | factory / member | invariant / stop |
|---|---|---|---|
| `ExecutionTruthBoundaryMarker` | single-variant enum `ExternalExecutionTruth/external_execution_truth` | `external()`;`is_external()` | contracts 不拥有 execution truth；`pass_R06.2` |
| `IdentityBoundaryMarker` | `ExternalIdentityTruth/external_identity_truth` | `external()`;`is_external()` | contracts 不拥有 identity lifecycle；`pass_R06.2` |
| `ArchiveBoundaryMarker` | `ExternalArchiveTruth/external_archive_truth` | `external()`;`is_external()` | contracts 不拥有 archive package / acceptance；`pass_R06.2` |

### 9.6 reference transition reason enums

| 类型 | exact variants | 使用边界 |
|---|---|---|
| `ReferenceResolutionReason` | `ResolverUnavailable`;`ExternalReferenceMissing`;`NotVisible`;`UnsupportedReference`;`InvalidReference` | 只解释 local resolution，不改外部 truth |
| `ReferenceStaleReason` | `SourceAdvanced`;`SnapshotExpired`;`ComparatorUnavailable`;`DependencyChanged` | 不用 wall clock 猜 source version |
| `HandoffBlockReason` | `ConsumerUnavailable`;`VisibilityBlocked`;`EvidenceGap`;`InputNotFresh`;`RetentionBoundary`;`NoWriteGuardBlocked` | 不等于 final rejection/verdict；freshness/retention/no-write block均不冒充evidence gap |
| `ConsumerRetireReason` | `ConfigurationRemoved`;`BoundarySuperseded`;`ExplicitRetirement` | 不删除历史 handoff |
| `RetentionReleaseReason` | `ProtectionExpired`;`ConsumerReleased`;`ScopeSuperseded`;`OperatorReviewed` | 只是候选/记录原因，不自行批准 cleanup |
| `ConsumerLimitReason` | `ScopeRestricted`;`VisibilityLimited`;`ExportDisabled` | 不改核心 truth |
| `PeripheralBlockReason` | `ExportForbidden`;`ConsumerUnavailable`;`VisibilityBlocked`;`NoWriteGuardBlocked` | 不生成 external audit conclusion |
| `EvidenceVisibilityReason` | `NotVisible`;`PolicyRestricted`;`ReferenceUnresolved`;`BodyFreeBoundaryBlocked` | missing 与 not-visible 分离 |
| `MaintenanceBlockReason` | `SourceTruthTarget`;`EffectNotAllowed`;`NoWriteGuardBlocked`;`InvalidTarget`;`DependencyUnavailable` | 不把 block 写成 completed |

上述 reason enum 按 §4.2 exact lowercase `snake_case` 编码。它们是 contracts reference 构造所需的有限 carrier；后续 domain record 可以引用，但不能重定义同名 enum或添加自由字符串 variant。

## 10. structured reference 独立对象卡

本节对象均是 immutable, body-free boundary snapshot。`self` consuming member 返回新的已校验对象；调用方必须在后续 owning domain batch 定义的 UoW / append-only record 中持久化 transition reason。contracts helper 本身不开事务、不访问 resolver、不追加 history，也不声称外部 truth 已改变。

### 10.1 `ObservationSourceRef`

#### capability / object source

表达 observation material 的外部来源、safe summary 与本地 resolution snapshot。来源只允许 authenticated envelope、resolver snapshot 和本仓 id generator。

#### Rust type definition and fields

```rust
/// Body-free source reference plus its local resolution snapshot.
pub struct ObservationSourceRef {
    pub source_ref_id: ObservationSourceRefId,
    pub source_family: SourceFamilyKind,
    pub source_object_ref: ExternalObjectRef,
    pub source_summary_ref: Option<SafeExternalSummaryRef>,
    pub resolution_state_ref: ReferenceSnapshotStateRef,
    pub resolution_kind: ReferenceResolutionKind,
}
```

| 字段 | 来源 | 不变量 |
|---|---|---|
| `source_ref_id` | id generator | 本仓 reference identity,不可由 external ref 派生 |
| `source_family` | authenticated envelope / resolver | 必须与 Step 08 static producer/source compatibility map 相容 |
| `source_object_ref` | trusted external boundary | body-free；不含 locator / body |
| `source_summary_ref` | resolver snapshot | `Resolved` 时可选；`Invalid` 时必须为 `None` |
| `resolution_state_ref` | local snapshot registration | 必须指向同一 source family/object 的 snapshot state |
| `resolution_kind` | resolver result mapping | 不等于 external source lifecycle |

#### factory / member functions

| 签名 | 前置 / 后置 |
|---|---|
| `from_external_ref(id, family, object_ref, snapshot_ref) -> Self` | 初始 `Unresolved`,summary `None` |
| `resolve(self, snapshot_ref, summary_ref) -> Result<Self, ProtocolError>` | 仅 `Unresolved/Stale -> Resolved`;更新 snapshot + summary |
| `mark_stale(self, snapshot_ref, reason) -> Result<Self, ProtocolError>` | `Resolved -> Stale`;reason 由调用方写 history |
| `mark_unresolved(self, snapshot_ref, reason) -> Result<Self, ProtocolError>` | 非 `Invalid -> Unresolved`;不得合成 summary |
| `mark_invalid(self, snapshot_ref, reason) -> Result<Self, ProtocolError>` | 任意非 `Invalid -> Invalid`;清空 summary;terminal snapshot |
| `is_resolved(&self) -> bool` | 纯读，无 resolver call |

#### invariants / downstream / test redlines

- 不保存 source event body、bus payload、provider response 或 source owner truth；family 只描述归属。
- 同一个 `source_ref_id` 的 family/object 不可在 transition 中替换；变更外部 subject 必须建立新 reference。
- 必测四状态、非法 `Invalid` reopen、family/object identity mutation、invalid-with-summary、wrong snapshot owner、wire round-trip。
- 下游 owner/use: intake DTO、source version marker、resolver、receipt；Step 07/08 只能引用本定义。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-01`。

### 10.2 `RuntimeSandboxSignalRef`

#### Rust type definition and fields

```rust
/// Safe runtime or sandbox signal reference without execution truth.
pub struct RuntimeSandboxSignalRef {
    pub runtime_signal_ref_id: RuntimeSandboxSignalRefId,
    pub runtime_scope_ref: RuntimeScopeRef,
    pub sandbox_scope_ref: Option<SandboxScopeRef>,
    pub safe_signal_summary_ref: SafeSignalSummaryRef,
    pub execution_truth_boundary: ExecutionTruthBoundaryMarker,
    pub availability: RuntimeSignalAvailabilityKind,
    pub degraded_reason: Option<DegradedReason>,
    pub gap_ref: Option<GapStateRef>,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | `runtime_signal_ref_id` 不从 run/tool/sandbox id 派生 |
| trusted runtime/sandbox envelope | runtime scope 必填；sandbox scope 只在 producer family 为 sandbox 或 resolver 明确提供时存在 |
| safe resolver | summary ref 已经过 redaction/body-free gate |
| constant factory | boundary marker 固定 `ExternalExecutionTruth` |
| domain derivation | availability、degraded reason、gap ref 必须满足状态组合 |

#### factory / member functions

| 签名 | 前置 / 后置 |
|---|---|
| `from_safe_summary(id, runtime_scope, sandbox_scope, summary_ref) -> Self` | 初始 `Available`;reason/gap None |
| `mark_degraded(self, reason, gap_ref) -> Result<Self, ProtocolError>` | -> `Degraded`;reason Some;gap optional |
| `mark_missing(self, gap_ref) -> Result<Self, ProtocolError>` | -> `Missing`;gap 必填 |
| `mark_not_visible(self, gap_ref) -> Result<Self, ProtocolError>` | -> `NotVisible`;gap 必填 |
| `restore_available(self, summary_ref) -> Result<Self, ProtocolError>` | `Degraded/Missing/NotVisible -> Available`;必须由新 safe summary 输入触发 |

#### invariants / tests / stop

- `Available` 必须 reason/gap None；`Missing/NotVisible` 必须 gap Some；`Degraded` 必须 reason Some。
- 不保存 tool result body、不裁决 execution success、不将 runtime/sandbox signal 变成业务 truth。
- 必测 sandbox absent/present、四状态组合、无新 summary 恢复、raw provider ref、marker tampering。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-02`。

### 10.3 `ReportConsumerRef`

#### Rust type definition and fields

```rust
/// Structured logical consumer boundary for report handoff.
pub struct ReportConsumerRef {
    pub report_consumer_ref_id: ReportConsumerRefId,
    pub consumer_kind: ReportConsumerKind,
    pub consumer_scope: ConsumerScope,
    pub handoff_purpose: HandoffPurpose,
    pub boundary_state: ConsumerBoundaryState,
}
```

| 字段来源 | 规则 |
|---|---|
| validated config/catalog | id、kind、scope、purpose 必须来自同一 immutable logical consumer revision |
| factory | 新 consumer 初始 `Pending`；startup validation 可显式 `activate` |
| local transition | state 只表达本仓 handoff boundary，不复制 consumer product lifecycle |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `for_consumer(id, kind, scope, purpose) -> Result<Self, ProtocolError>` | -> `Pending`;Explicit scope 不得为空 |
| `activate(self) -> Result<Self, ProtocolError>` | `Pending/Blocked -> Active`;Blocked 恢复需 catalog 已重新验证，调用方负责记录 |
| `block(self, reason) -> Result<Self, ProtocolError>` | `Pending/Active -> Blocked` |
| `retire(self, reason) -> Result<Self, ProtocolError>` | `Pending/Active/Blocked -> Retired`;terminal |
| `can_accept_handoff(&self) -> bool` | 仅 `Active` true |
| `canonical_subject_bytes(&self) -> Vec<u8>` | id + kind 的有界 tagged bytes；不含 endpoint/config secret |

#### invariants / downstream / test redlines

- 这是结构化 consumer boundary，不是 transparent wrapper；id、kind、scope、purpose、state 都必须出现在 canonical wire / digest。
- endpoint、topic、bucket、path、credential、adapter product、report body、verdict、signoff、真实 run id 不得进入对象。
- config catalog subject key 使用 structured ref 的 id/kind；catalog state/scope mismatch 必须 fail closed。
- 必测 Pending/Active/Blocked/Retired、Retired terminal、scope/purpose canonical digest、相同 id 不同 kind 冲突、旧 wrapper-only payload 拒绝。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-03` 与 `R06-D03` 的本对象部分。

### 10.4 `ProtectedObservationRef`

#### Rust type definition and fields

```rust
/// Structured protection relation for one observability-owned object.
pub struct ProtectedObservationRef {
    pub protected_observation_ref_id: ProtectedObservationRefId,
    pub observation_object_ref: ObservationObjectRef,
    pub protection_scope: ProtectionScope,
    pub retention_marker_ref: Option<RetentionMarkerRef>,
    pub state: ProtectedObservationState,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | relation identity |
| command / repository lookup | target 必须是 observation-side object；external ref 永不接受 |
| validated command/policy | protection scope |
| same UoW | optional marker 必须已存在或与 relation 同事务创建 |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `protect(id, object_ref, scope) -> Result<Self, ProtocolError>` | 初始 `Protected`;marker None |
| `attach_marker(self, marker_ref) -> Result<Self, ProtocolError>` | 仅 `Protected/ReleaseCandidate`;同一 relation 不可换 marker |
| `mark_release_candidate(self, reason) -> Result<Self, ProtocolError>` | `Protected -> ReleaseCandidate` |
| `release(self, reason) -> Result<Self, ProtocolError>` | `ReleaseCandidate -> Released`;active protection policy 由 R06.4 检查 |
| `invalidate(self) -> Result<Self, ProtocolError>` | 非 Released -> Invalid |

#### invariants / tests / stop

- 不指向 source truth body；`Released/Invalid` 不得重新保护，需新 relation id。
- `HandoffInputs` / `LinkedEvidence` scope 不扩大 target kind，只影响本仓关联保护。
- 必测 wrong target family、marker replacement、direct Protected->Released、terminal reopen、wire tag preservation。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-04`。

### 10.5 `GapSourceRef`

#### Rust type definition and fields

```rust
/// Body-free source that explains one observable gap.
pub struct GapSourceRef {
    pub gap_source_ref_id: GapSourceRefId,
    pub source_kind: GapSourceKind,
    pub source_ref: ExternalObjectRef,
    pub visibility_constraint_ref: Option<VisibilityConstraintRef>,
    pub state: GapSourceState,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | local tracked source identity |
| gap command / resolver | kind + body-free source ref |
| visibility policy | constraint 只在 `NotVisible` 必填 |
| resolver mapping | state；Unknown 不得伪造 external ref meaning |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `from_source(id, kind, source_ref) -> Self` | 初始 `Known`;constraint None |
| `mark_unknown(self) -> Result<Self, ProtocolError>` | -> `Unknown`;constraint None |
| `mark_not_visible(self, constraint_ref) -> Result<Self, ProtocolError>` | -> `NotVisible`;constraint Some |
| `mark_unresolved(self, reason) -> Result<Self, ProtocolError>` | -> `Unresolved`;constraint None |
| `mark_known(self) -> Result<Self, ProtocolError>` | `Unknown/Unresolved -> Known`;必须由 resolver result 触发 |

#### invariants / tests / stop

- source kind/ref identity 不可在 transition 中替换；gap source 不执行 repair。
- NotVisible 与 Unknown/Unresolved 分离；constraint 不得暗含 actor PII / policy body。
- 必测 state/constraint combinations、kind mismatch、wrong ref owner、mark-known without resolver flow integration redline。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-05`。

### 10.6 `PeripheralConsumerRef`

#### Rust type definition and fields

```rust
/// Structured product-neutral boundary for peripheral read-only consumption.
pub struct PeripheralConsumerRef {
    pub peripheral_consumer_ref_id: PeripheralConsumerRefId,
    pub consumer_kind: PeripheralConsumerKind,
    pub consumer_scope: ConsumerScope,
    pub export_allowed: ExportAllowedFlag,
    pub consumer_state: PeripheralConsumerState,
}
```

| 字段来源 | 规则 |
|---|---|
| validated config/catalog | id、kind、scope |
| export policy/config validation | `export_allowed`;不是 consumer 自报 |
| local transition | consumer state；不等于 provider lifecycle |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `for_kind(id, kind, scope, export_allowed) -> Result<Self, ProtocolError>` | 初始 `Active`;Explicit scope 非空 |
| `limit(self, reason) -> Result<Self, ProtocolError>` | `Active -> Limited` |
| `restore_active(self) -> Result<Self, ProtocolError>` | `Limited/Blocked -> Active`;调用前必须重新验证 catalog/policy |
| `block(self, reason) -> Result<Self, ProtocolError>` | `Active/Limited -> Blocked` |
| `retire(self, reason) -> Result<Self, ProtocolError>` | non-retired -> Retired;terminal |
| `can_export(&self) -> bool` | state Active/Limited 且 flag Allowed；不执行授权 |

#### invariants / downstream / test redlines

- 这是结构化 consumer boundary，不是 transparent wrapper；kind/scope/export/state 必须纳入 wire / digest。
- dashboard、alert、management report、GRC、analysis 只读消费，不反写 observation 或业务 truth。
- destination locator / credential / product config 仍由 infra binding owner；本对象只作为 typed catalog subject。
- 必测 flag/state matrix、Retired terminal、scope canonicalization、wrapper-only payload rejection、same id/different kind conflict。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-06` 与 `R06-D03` 的本对象部分。

### 10.7 `SubjectObservationReference`

#### Rust type definition and fields

```rust
/// Identity-safe subject reference observed without owning identity truth.
pub struct SubjectObservationReference {
    pub subject_observation_reference_id: SubjectObservationReferenceId,
    pub subject_kind: ObservationSubjectKind,
    pub subject_safe_ref: SubjectSafeRef,
    pub identity_boundary_marker: IdentityBoundaryMarker,
    pub snapshot_state_ref: ReferenceSnapshotStateRef,
    pub state: SubjectReferenceState,
    pub visibility_constraint_ref: Option<VisibilityConstraintRef>,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | local reference id |
| authenticated Identity/source envelope | kind + safe ref |
| constant factory | external identity marker |
| resolver snapshot | state ref + state |
| visibility policy | constraint 仅 NotVisible 必填 |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `from_safe_ref(id, kind, safe_ref, snapshot_ref) -> Self` | 初始 `Resolved`;constraint None |
| `refresh(self, snapshot_ref, state) -> Result<Self, ProtocolError>` | 仅 `Resolved/Stale -> Resolved/Stale`;subject identity 不变 |
| `mark_not_visible(self, snapshot_ref, constraint_ref) -> Result<Self, ProtocolError>` | -> `NotVisible` |
| `mark_invalid(self, snapshot_ref, reason) -> Result<Self, ProtocolError>` | -> `Invalid`;terminal |

#### invariants / tests / stop

- 不保存 subject profile、role body、credential、PII 或 identity lifecycle；marker 不可由 input 覆盖。
- NotVisible 不是 missing；Invalid 不可 refresh/reopen。
- 必测 subject kind/ref stable、constraint combinations、marker tampering、Invalid terminal、wire redaction。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-07`。

### 10.8 `GovernanceArtifactEvidenceReference`

#### Rust type definition and fields

```rust
/// Body-free cross-domain reference for governance, artifact, evidence, or baseline material.
pub struct GovernanceArtifactEvidenceReference {
    pub boundary_ref_id: GovernanceArtifactEvidenceReferenceId,
    pub reference_family: GovernanceArtifactEvidenceFamily,
    pub external_safe_ref: ExternalObjectRef,
    pub digest_summary: Option<DigestSummary>,
    pub reference_snapshot_state_ref: ReferenceSnapshotStateRef,
    pub state: GovernanceArtifactEvidenceReferenceState,
    pub gap_ref: Option<GapStateRef>,
    pub visibility_reason: Option<EvidenceVisibilityReason>,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | local boundary identity |
| authenticated Governance/Artifact/evidence envelope | family + safe ref |
| canonical body-free digest input | optional digest；不得对 raw body 在本仓重算 |
| resolver snapshot | snapshot ref + local state |
| domain derivation | Missing 需要 gap；NotVisible 需要 visibility reason |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `from_external_ref(id, family, safe_ref, snapshot_ref) -> Self` | 初始 `Linked`;optional fields None |
| `attach_digest(self, digest) -> Result<Self, ProtocolError>` | 仅 Linked；已有不同 digest 不可覆盖 |
| `mark_missing(self, snapshot_ref, gap_ref) -> Result<Self, ProtocolError>` | -> Missing;gap Some;visibility None |
| `mark_not_visible(self, snapshot_ref, reason) -> Result<Self, ProtocolError>` | -> NotVisible;gap None;reason Some |
| `mark_invalid(self, snapshot_ref, reason) -> Result<Self, ProtocolError>` | -> Invalid;清空 digest/gap/visibility;terminal |
| `relink(self, snapshot_ref, digest) -> Result<Self, ProtocolError>` | Missing/NotVisible -> Linked；必须由新 resolver snapshot 触发 |

#### invariants / tests / stop

- 不保存 Governance decision body、Artifact content、evidence body、baseline payload；digest 只证明 canonical body-free material under profile，不证明真实性。
- Missing / NotVisible 明确分开；external family/ref 不可在原 identity 下替换。
- 必测 digest overwrite、state-specific optional fields、Invalid terminal、raw hash/body input、family mismatch、relink new snapshot。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-08`。

### 10.9 `RuntimeSandboxSummaryRef`

#### Rust type definition and fields

```rust
/// Runtime or sandbox safe-summary boundary without provider body.
pub struct RuntimeSandboxSummaryRef {
    pub runtime_sandbox_summary_ref_id: RuntimeSandboxSummaryRefId,
    pub runtime_scope_ref: RuntimeScopeRef,
    pub sandbox_scope_ref: Option<SandboxScopeRef>,
    pub safe_summary_ref: SafeExternalSummaryRef,
    pub execution_boundary_marker: ExecutionTruthBoundaryMarker,
    pub state: RuntimeSandboxSummaryState,
    pub stale_reason: Option<ReferenceStaleReason>,
    pub gap_ref: Option<GapStateRef>,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | local summary boundary id |
| trusted resolver | runtime/sandbox scope + safe summary |
| constant factory | execution boundary marker |
| resolver/domain derivation | state；Stale reason / Missing gap 状态匹配 |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `from_safe_summary(id, runtime_scope, sandbox_scope, summary_ref) -> Self` | -> Available |
| `mark_stale(self, reason) -> Result<Self, ProtocolError>` | Available -> Stale;reason Some |
| `mark_missing(self, gap_ref) -> Result<Self, ProtocolError>` | Available/Stale -> Missing;gap Some |
| `block(self, gap_ref) -> Result<Self, ProtocolError>` | non-blocked -> Blocked;gap Some |
| `refresh(self, summary_ref) -> Result<Self, ProtocolError>` | Stale/Missing/Blocked -> Available;新 summary 必填 |

#### invariants / tests / stop

- Available optional fields None；Stale reason Some；Missing/Blocked gap Some。
- 不保存 provider response / tool body，不裁决 execution success。
- 必测 state matrix、新 summary 恢复、scope mutation、marker tampering、raw provider input。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-09`。

### 10.10 `ArchiveReportHandoffRef`

#### Rust type definition and fields

```rust
/// Local boundary reference for archive, report, external-audit, or acceptance handoff.
pub struct ArchiveReportHandoffRef {
    pub archive_report_handoff_ref_id: ArchiveReportHandoffRefId,
    pub handoff_family: ArchiveReportHandoffFamily,
    pub consumer_ref: ReportConsumerRef,
    pub handoff_record_ref: Option<ReportHandoffRecordRef>,
    pub archive_boundary_marker: ArchiveBoundaryMarker,
    pub state: ArchiveReportHandoffState,
    pub block_reason: Option<HandoffBlockReason>,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | local handoff boundary identity |
| validated catalog | family + structured consumer ref |
| same UoW / repository | optional handoff record ref |
| constant factory | external archive marker |
| domain derivation / delivery result | state；Blocked 需要 typed reason |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `for_consumer(id, family, consumer_ref) -> Result<Self, ProtocolError>` | consumer non-retired；初始 Pending |
| `attach_handoff(self, record_ref) -> Result<Self, ProtocolError>` | Pending/Blocked；不同 record 不可覆盖 |
| `mark_ready(self) -> Result<Self, ProtocolError>` | Pending/Blocked -> Ready；record Some且consumer Active |
| `block(self, reason) -> Result<Self, ProtocolError>` | Pending/Ready -> Blocked |
| `mark_delivered(self, record_ref) -> Result<Self, ProtocolError>` | Ready -> Delivered；record 必须等于已绑定 ref |
| `mark_failed(self, reason) -> Result<Self, ProtocolError>` | Ready/Blocked -> Failed；terminal snapshot；retry 建新 delivery attempt record |

#### invariants / tests / stop

- Delivered 只表示本仓记录到 handoff delivery fact，不等于 archive accepted、验收通过、final verdict 或 signoff。
- 不拥有 archive package/report body；consumer scope/purpose 必须与 family compatibility table 相容。
- 必测 no record ready/deliver、consumer non-active、record replacement、Delivered/Failed terminal、真实 run/evidence/signoff 字段不存在。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-10`。

### 10.11 `MaintenanceTargetRef`

#### Rust type definition and fields

```rust
/// Structured observation-side maintenance target and its no-write boundary.
pub struct MaintenanceTargetRef {
    pub maintenance_target_ref_id: MaintenanceTargetRefId,
    pub target_kind: MaintenanceTargetKind,
    pub target_object_ref: ObservationObjectRef,
    pub allowed_effect: MaintenanceAllowedEffect,
    pub no_write_guard_scope: NoWriteGuardScope,
}
```

| 字段来源 | 规则 |
|---|---|
| id generator | canonical local target identity |
| command/job input + repository lookup | tagged observation object；不得是 source/external truth |
| compile-time compatibility table | target kind + allowed effect |
| no-write policy | guard scope；必须为 `ObservationMaintenance` 执行边界，同时禁止 SourceTruth/ExternalTruth 写入 |

#### compatibility table

| target kind | allowed object variants | only allowed effect |
|---|---|---|
| `Projection` | `ObservationReadModel`;`DiagnosticView`;`DashboardAlertExportView` | `RebuildDerivedProjection` |
| `ReferenceSnapshot` | `ReferenceSnapshotState` | `RefreshBodyFreeReference` |
| `Gap` | `GapState` | `ScanGap` |
| `SignalRollup` | `SignalRollupWindow` | `RebuildSignalRollup` |

#### factory / member functions

| 签名 | 允许转换 |
|---|---|
| `for_object(id, kind, object_ref, effect, guard_scope) -> Result<Self, ProtocolError>` | compatibility + no-write structural validation；不产生eligibility或execution truth |
| `allows(&self, effect) -> bool` | exact equality only，不扩张 effect |
| `matches_object(&self, object_ref) -> bool` | tagged owner + exact typed identity equality；不得只比较inner bytes |

#### invariants / downstream / test redlines

- 这是结构化对象，不是 transparent ref；kind、object、effect、guard 必须进入 wire / canonical digest。
- 这是不可变target descriptor，不是 eligibility、policy decision、job plan、execution state或progress；任何kind/object/effect/guard变化都生成新的`MaintenanceTargetRefId`。
- 不允许 target 指向 source truth 或 external object；maintenance 只改本仓 observation/derived state。
- caller携带的完整descriptor不是授权。application必须按id加载canonical target/scope binding并逐字段比较，再由R06.5 policy产生`MaintenanceExecutionAuthorization`；禁止信任请求中的effect/guard或从id字符串反推shape。
- execution lifecycle只归`ProjectionMaintenanceState`、`ReplayCoordinationState`、`RollupRebuildState`；blocked原因归policy decision / owning execution state / progress surface，不回写target descriptor。
- 必测 compatibility table 全组合、wrong effect、source/external ref 不可构造、same-id/different-shape拒绝、descriptor replacement使用新id、旧 wrapper-only payload拒绝。
- 对象停审结论: `pass_R06.2`;关闭 `UR-REF-11` 和 `R06-D04`。

## 11. protocol metadata 与 digest 独立对象卡

### 11.1 `SchemaVersion`

```rust
/// Version of the L4-observability public protocol schema.
pub enum SchemaVersion {
    V1,
}
```

| 卡片项 | 独立契约 |
|---|---|
| source / owner | compile-time supported protocol set；`contracts::metadata` |
| wire | `V1 -> "v1"`;unknown 在 body decode / route dispatch 前返回 `UnsupportedSchemaVersion` |
| factory / member | `parse(&str) -> Result<Self, ProtocolError>`;`as_token() -> &'static str`;`is_supported() -> bool` |
| invariant | 不等于 digest profile、store schema、source version 或 repository version |
| tests / stop | exact round-trip、`V1`/`1`/`v01`/unknown 拒绝；`pass_R06.2` |

### 11.2 `SourceFamilyKind`

```rust
/// Family that owns or emits the body-free material being referenced.
pub enum SourceFamilyKind {
    Bus,
    SourceOwner,
    Identity,
    Governance,
    Artifact,
    Runtime,
    Sandbox,
    Archive,
    ReportConsumer,
}
```

| 卡片项 | 独立契约 |
|---|---|
| source / owner | authenticated envelope / resolver mapping；`contracts::metadata` |
| wire | `bus`;`source_owner`;`identity`;`governance`;`artifact`;`runtime`;`sandbox`;`archive`;`report_consumer` |
| factory / member | §4.2 parse/token；无 dynamic registration |
| invariant | 描述 material/source truth owner family，不证明 producer identity、transport 或业务成功 |
| tests / stop | 9 variants、unknown/case/numeric 拒绝；`pass_R06.2` |

### 11.3 `ObservationProducerFamily`

```rust
/// Authenticated producer boundary that emitted an inbound envelope.
pub enum ObservationProducerFamily {
    Bus,
    SourceOwner,
    Identity,
    Governance,
    Artifact,
    Runtime,
    Sandbox,
    Archive,
    ReportConsumer,
}
```

| 卡片项 | 独立契约 |
|---|---|
| source / owner | entry binding authentication result；payload 不可自报覆盖 |
| wire | 与 `SourceFamilyKind` 同名的 9 个 exact token,但 Rust 类型和 digest discriminator 不同 |
| factory / member | §4.2；`compatible_source_family(&self, source: SourceFamilyKind) -> bool` 使用 compile-time total table |
| invariant | 没有 `From<SourceFamilyKind>` 或 implicit cast；compatibility 不等于真实性证明 |
| tests / stop | all producer/source pairs、same token type separation、unknown 拒绝；`pass_R06.2` |

P0 compatibility table 是 exact family match。若未来一个 authenticated producer 可合法代理另一 source family，必须重开 Step 08 consumer route 与安全边界，不能由 config 添加映射。

### 11.4 `DigestProfileVersion`

```rust
/// Supported canonical serialization and digest profile.
pub struct DigestProfileVersion(u16);
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `v1() -> Self`;`try_from_u16(value) -> Result<Self, ProtocolError>`；P0 只接受 `1` |
| member / wire | `get() -> u16`;wire unsigned integer `1` |
| source | canonical serializer compile-time profile；不得由 caller/config 任意选择 |
| invariant | `0`、unknown profile 拒绝；retained old profile 不可被 current profile 重算覆盖 |
| tests / stop | 0/1/2、schema-version confusion；`pass_R06.2` |

### 11.5 `DigestValue`

```rust
/// Lowercase hexadecimal SHA-256 digest under the declared profile.
pub struct DigestValue(String);
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `parse(value: String) -> Result<Self, ProtocolError>`；exactly 64 ASCII lowercase hex |
| member / wire | `as_str()`;wire 64-char string；Debug 只显示 redacted prefix/suffix |
| source | v1 canonical SHA-256 output；contracts 只校验，不读取 raw material |
| invariant | uppercase、prefix `0x`、short/long、non-hex、whitespace 拒绝 |
| tests / stop | all boundaries、debug redaction、round-trip；`pass_R06.2` |

### 11.6 `RequestDigest`

```rust
/// Digest of one normalized command, event, or job request.
pub struct RequestDigest {
    pub profile_version: DigestProfileVersion,
    pub digest_value: DigestValue,
}
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `new(profile_version, digest_value) -> Result<Self, ProtocolError>`；P0 profile/value format必须兼容 |
| member | `profile_version()`;`digest_value()`;constant-time `matches(&Self)` where implementation support permits |
| source | application canonical serializer over operation-specific finite include/exclude contract |
| invariant | 与 operation/actor/idempotency scope 组合使用；不能由 request body hash、timestamp 或 random token代替 |
| tests / stop | same bytes/profile equality、profile mismatch、different operation discriminator；`pass_R06.2` |

### 11.7 `DigestSummary`

```rust
/// Digest of canonical body-free material or a structured outcome.
pub struct DigestSummary {
    pub profile_version: DigestProfileVersion,
    pub digest_value: DigestValue,
}
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `new(profile_version, digest_value) -> Result<Self, ProtocolError>` |
| member | accessors only；无 `into_request_digest` |
| source | body-free ref set、stored public payload snapshot、structured outcome 或 external intent canonical material |
| invariant | 不 hash evidence/report/provider/source body；不证明 external authenticity |
| tests / stop | 与 `RequestDigest` same value 仍不同 type/discriminator；raw body source redline；`pass_R06.2` |

## 12. cursor 与 source version 独立对象卡

### 12.1 `ObservationCursor`

```rust
/// Monotonic committed order in the observation-truth namespace.
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct ObservationCursor(u64);
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `try_from_allocated(value) -> Result<Self, ProtocolError>`；只接受 `1..=u64::MAX`, `0` 保留为未分配 |
| member / wire | `get()`;canonical wire decimal ASCII string，避免跨语言整数精度损失 |
| source | `ObservationUnitOfWork.assign_observation_cursor`;每个 observation-write UoW 最多一次 |
| invariant | 不等于 row version、reference cursor、page cursor、timestamp 或 source version |
| tests / stop | zero/max/decimal leading zero/namespace confusion；`pass_R06.2` |

### 12.2 `ReferenceCursor`

```rust
/// Monotonic committed order in the reference-only namespace.
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct ReferenceCursor(u64);
```

| 卡片项 | 独立契约 |
|---|---|
| factory | 与 `ObservationCursor` 相同 non-zero validation |
| member / wire | `get()`;canonical decimal string |
| source | `ObservationUnitOfWork.assign_reference_cursor`;reference-only UoW 每次最多一次 |
| invariant | 与 observation namespace 数值相同也无 ordering / conversion 关系 |
| tests / stop | namespace separation、zero/max/round-trip；`pass_R06.2` |

### 12.3 `ObservationCommittedCursor`

```rust
/// Tagged committed position from exactly one local cursor namespace.
#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
pub enum ObservationCommittedCursor {
    Observation(ObservationCursor),
    Reference(ReferenceCursor),
}
```

| 卡片项 | 独立契约 |
|---|---|
| factory | explicit variant constructors only |
| member / wire | `namespace() -> CursorNamespace`;tagged `{namespace,value}` |
| source | current UoW assigned cursor；一个 UoW 不得同时产生两个 variant |
| invariant | adapter / projection 不得丢 tag 后比较 numeric value；跨 namespace 只能分别保存 watermark |
| tests / stop | variant round-trip、untagged input、cross-namespace comparison absent；`pass_R06.2` |

`CursorNamespace` 是 finite enum `Observation/observation`、`Reference/reference`，仅供 tagged serialization 和 inspection；没有 total-order function。

F2 ownership amendment: `ObservationCursor` and `ReferenceCursor` may be copied only as small immutable committed values. `ObservationCommittedCursor` deliberately does not implement `Ord` or `PartialOrd`; equal numeric values in different variants remain incomparable. Copying one assigned tagged cursor into typed record metadata, projection followers and outbox snapshots is exact value propagation, not another allocation. No aggregate, transition, record, assembly request or plan inherits `Clone`/`Copy` from this value rule.

### 12.4 `OutboxCursor`

```rust
/// Opaque resume token for one stable outbox pending scan.
pub struct OutboxCursor(String);
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `parse(value) -> Result<Self, ProtocolError>`；canonical unpadded base64url,byte length `1..=512` |
| member / wire | `as_str()`;opaque string；Debug redacted |
| source | outbox repository page mapper over stable pending ordering;caller 不得构造 |
| invariant | token 不授权读取、不含 secret/body；query/filter mismatch 在 repository decode 时返回 `InvalidOutboxCursor` |
| tests / stop | empty/padding/invalid chars/513 bytes/filter replay/round-trip；`pass_R06.2` |

### 12.5 `OpaqueSourceVersionToken`

```rust
/// Canonical body-free producer version token for one source stream.
pub struct OpaqueSourceVersionToken(String);
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `parse(value) -> Result<Self, ProtocolError>`；ASCII `[A-Za-z0-9._:~-]`,byte length `1..=256`,不 trim/case-fold |
| member / wire | `as_str()`;exact string；Debug redacted |
| source | trusted producer adapter maps external version into canonical token；不得从 local clock 合成 |
| invariant | 不是 timestamp、schema、cursor、digest、row version 或 global order |
| tests / stop | empty/Unicode/whitespace/path/257 bytes/case preservation；`pass_R06.2` |

### 12.6 `SourceVersionComparison`

```rust
/// Typed comparison result for two versions of the same producer/source stream.
pub enum SourceVersionComparison {
    Older,
    Equal,
    Newer,
    Uncomparable,
}
```

| 卡片项 | 独立契约 |
|---|---|
| source | adapter-declared comparator after same-stream validation |
| wire | `older`;`equal`;`newer`;`uncomparable` |
| invariant | lexical/numeric/timestamp fallback 禁止；different stream 必须 `Uncomparable` |
| use | out-of-order guard；Uncomparable 驱动 stale/degraded/manual,不覆盖 current snapshot |
| tests / stop | all results、different producer/source；`pass_R06.2` |

### 12.7 `ObservationSourceVersionRef`

```rust
/// Producer-asserted version bound to one exact structured source reference.
pub struct ObservationSourceVersionRef {
    pub producer_family: ObservationProducerFamily,
    pub source_ref: ObservationSourceRef,
    pub version_token: OpaqueSourceVersionToken,
}
```

| 卡片项 | 独立契约 |
|---|---|
| factory | `new(producer, source_ref, token) -> Result<Self, ProtocolError>`；producer/source family须通过compile-time table |
| member | `same_stream_as(&self, other) -> bool`;`same_version_as(&self, other) -> bool`；不内建 ordering |
| source | inbound envelope / resolver result；missing 保持 `Option::None`,不得合成 |
| invariant | stream identity = producer family + `source_ref.source_ref_id`；source object/family不匹配即 invalid |
| tests / stop | compatibility、same/different stream、missing not synthesized、timestamp/cursor substitution；`pass_R06.2` |

## 13. public scope 独立对象卡

### 13.1 `ObservationProjectionScope`

```rust
/// Public selection scope for query and projection rebuild.
pub enum ObservationProjectionScope {
    ByObservation(ObservationReceiptRef),
    ByCorrelation(CorrelationContextRef),
    ByAuditSubject(AuditSubjectRef),
    ByReportHandoff(ReportHandoffRecordRef),
    ByMaintenanceTarget(MaintenanceTargetRef),
}
```

| 卡片项 | 独立契约 |
|---|---|
| factory | explicit variants；typed payload不得 absent |
| member | `kind() -> ObservationProjectionScopeKind`;`canonical_lookup_bytes() -> Vec<u8>` uses tag + stable typed identity |
| canonicalization | maintenance target lookup只使用其 id作为identity，但 request digest保留完整validated snapshot |
| invariant | scope 可作 lookup unique key，不可直接转换成 view ref；query scope 不触发 rebuild |
| tests / stop | 5 variants、wrong typed payload、maintenance state变化不改变lookup identity；`pass_R06.2` |

`ObservationProjectionScopeKind` 有 `ByObservation/by_observation`、`ByCorrelation/by_correlation`、`ByAuditSubject/by_audit_subject`、`ByReportHandoff/by_report_handoff`、`ByMaintenanceTarget/by_maintenance_target` 五个 exact variants。

### 13.2 `ObservationReferenceRefreshScope`

```rust
/// Public selection scope for body-free reference refresh jobs.
pub enum ObservationReferenceRefreshScope {
    ExplicitRefs(BodyFreeRefSet),
    BySourceFamily(SourceFamilyKind),
    UnhealthyOnly,
    ByMaintenanceTarget(MaintenanceTargetRef),
}
```

| 卡片项 | 独立契约 |
|---|---|
| factory | ExplicitRefs 必须 non-empty且不超过256；其他 variant typed input完整 |
| member | `kind() -> ObservationReferenceRefreshScopeKind`;canonical tagged serialization |
| source | job input / stored immutable plan |
| invariant | 只选 tracked body-free snapshot；不扫描 raw body、不猜全仓 reference、不触发 source truth mutation |
| tests / stop | empty/oversize explicit set、4 variants、target compatibility、canonical order；`pass_R06.2` |

`ObservationReferenceRefreshScopeKind` 有 `ExplicitRefs/explicit_refs`、`BySourceFamily/by_source_family`、`UnhealthyOnly/unhealthy_only`、`ByMaintenanceTarget/by_maintenance_target` 四个 exact variants。

## 14. visibility 与 degraded surface 独立对象卡

### 14.1 `PublicVisibilityKind`

```rust
/// Public visibility classification for safe output.
pub enum PublicVisibilityKind {
    Visible,
    Restricted,
    NotVisible,
    Blocked,
    Degraded,
}
```

| 卡片项 | 独立契约 |
|---|---|
| source | lossless mapping from domain visibility / safety / guard result |
| wire | `visible`;`restricted`;`not_visible`;`blocked`;`degraded` |
| invariant | NotVisible != missing；Blocked != failed；Degraded != success/default |
| member | `allows_body()` true only Visible/Restricted；Degraded 由 enclosing surface判断 limited body |
| tests / stop | all variants、unknown、body policy matrix；`pass_R06.2` |

### 14.2 `DegradedReason`

```rust
/// Public finite reason for reduced or blocked output.
pub enum DegradedReason {
    MissingMaterial,
    NotVisible,
    UnresolvedReference,
    Stale,
    VisibilityLimited,
    AuthenticityLimited,
    SafetyLimited,
    GuardBlocked,
}
```

| 卡片项 | 独立契约 |
|---|---|
| source | gap/visibility/reference/freshness/authenticity/safety/no-write policy mapping |
| wire | `missing_material`;`not_visible`;`unresolved_reference`;`stale`;`visibility_limited`;`authenticity_limited`;`safety_limited`;`guard_blocked` |
| invariant | Missing != Unresolved != NotVisible；VisibilityLimited只表达restricted surface；AuthenticityLimited只表达placeholder/insufficient hint，不是真实性verdict；无free-text/Other/body/message |
| tests / stop | eight exact variants、unknown、reason-source mapping、three non-interchangeability matrices；`pass_R06.5-D_affected` |

### 14.3 `DegradedSurface`

```rust
/// Safe degraded output that never fabricates full success.
pub struct DegradedSurface {
    pub reason: DegradedReason,
    pub gap_ref: Option<GapStateRef>,
    pub limited_consumption_allowed: bool,
}
```

| 卡片项 | 独立契约 |
|---|---|
| factories | `limited(reason, gap_ref) -> Result<Self, ProtocolError>`;`blocked(reason, gap_ref) -> Result<Self, ProtocolError>` |
| matrix | MissingMaterial/NotVisible/UnresolvedReference/Stale要求gap Some；VisibilityLimited/AuthenticityLimited/SafetyLimited允许gap None或Some；GuardBlocked允许gap None但必须limited=false |
| member | `blocks_handoff()` true when limited false；`allows_limited_consumption()` |
| invariant | `GuardBlocked` 必须 limited=false；其他reason只有policy可决定limited flag；gap Some必须是真实persisted `GapStateRef`，不得为guard/authenticity/visibility limitation伪造；consumer不能改flag |
| tests / stop | eight reason x gap/flag matrix、missing类无gap拒绝、guard limited=true拒绝、optional类Some/None；`pass_R06.5-D_affected` |

### 14.4 `VisibilitySurface`

```rust
/// Public visibility result for read, diagnostic, handoff, and export surfaces.
pub struct VisibilitySurface {
    pub kind: PublicVisibilityKind,
    pub gap_ref: Option<GapStateRef>,
    pub degraded: Option<DegradedSurface>,
}
```

| factory | exact output invariant |
|---|---|
| `visible()` | Visible;gap/degraded None |
| `restricted()` | Restricted;gap/degraded None；字段级 redaction由view assembler负责 |
| `not_visible(gap_ref)` | NotVisible;gap Some;degraded None;body absent |
| `blocked(gap_ref: Option<GapStateRef>)` | Blocked;gap optional;degraded None;body absent；guard-only block可None，真实gap存在时保留Some |
| `degraded(surface)` | Degraded;gap等于surface.gap_ref;degraded Some;body是否存在由limited flag决定 |

| 卡片项 | 独立契约 |
|---|---|
| member | `is_visible()` true Visible/Restricted；`requires_redaction()` true Restricted/NotVisible/Blocked/Degraded |
| source | domain/application assembler lossless mapping；query caller不可传入 response surface |
| invariant | kind 与 optional fields 必须满足上表；NotVisible仍强制gap Some；Blocked不以缺gap表示success，也不因guard-only block伪造gap；internal typed block reason归domain decision/source snapshot，不进入public surface |
| tests / stop | five factories、Blocked Some/None、NotVisible None拒绝、manually malformed combinations、body presence mapping；`pass_R06.5-D_affected` |

### 14.5 `ObservationConsistencyHint`

```rust
/// Read-only preference over already committed projection material.
pub enum ObservationConsistencyHint {
    AllowStale,
    RequireFresh,
    BestEffort,
}
```

| 卡片项 | 独立契约 |
|---|---|
| wire | `allow_stale`;`require_fresh`;`best_effort` |
| source | query input；不持久化 |
| semantics | AllowStale可返回visible stale committed body；RequireFresh仅Fresh body；BestEffort返回policy允许的最安全committed body |
| invariant | 不等待、不刷新、不重建、不replay、不改freshness marker；Unknown时不填默认body |
| tests / stop | hint x Fresh/Stale/Rebuilding/Unknown x visibility matrix；`pass_R06.2` |

### 14.6 `AdapterFamily`

```rust
/// Product-neutral adapter family used by runtime boundaries.
pub enum AdapterFamily {
    ObservationStore,
    ProjectionStore,
    IdempotencyStore,
    JobExecutionStore,
    ObservationSourceResolver,
    RuntimeSandboxResolver,
    GovernanceArtifactEvidenceResolver,
    SubjectObservationResolver,
    EventPublisher,
    ReportHandoffDelivery,
    PeripheralExportDelivery,
    Clock,
    IdGenerator,
}
```

| 卡片项 | 独立契约 |
|---|---|
| wire | variant exact lowercase `snake_case`;13 values |
| source | compile-time port/binding family；config只选择实例/模式,不能增加 family |
| invariant | 不含 provider/product name；增加 variant需重开module/port/config边界 |
| member | `is_store()`;`is_resolver()`;`is_external_effect()` total match,不靠字符串前缀 |
| tests / stop | 13 variants、classification totality、unknown config token；`pass_R06.2` |

## 15. `ProtocolError`

### 15.1 Rust type and variants

```rust
/// Finite validation failure produced before application orchestration.
pub enum ProtocolError {
    EmptyReference,
    MalformedReference,
    WrongReferenceOwner,
    IncompatibleReferenceKind,
    UnknownEnumToken,
    UnsupportedSchemaVersion,
    InvalidEnvelope,
    RouteBodyMismatch,
    InvalidPageCursor,
    InvalidOutboxCursor,
    InvalidDigestProfile,
    InvalidDigestValue,
    InvalidCommittedCursor,
    InvalidSourceVersion,
    InvalidScope,
    EmptySetNotAllowed,
    SetTooLarge,
    ConflictingSetMember,
    InvalidCarrierState,
    InvalidCarrierTransition,
}
```

### 15.2 ownership, mapping and redlines

| 卡片项 | 独立契约 |
|---|---|
| owner | `contracts::errors`;constructors/serde/public input validation only |
| mapping | Step 08 public error surface maps variant to stable error code；field/subject detail用safe typed ref/path enum,不拼external message |
| forbidden | repository/UoW/SQL/network/provider failure、domain policy rejection、retry参数、raw value/body |
| no dynamic extension | 不含 `Other(String)`、`message: String`、boxed source；unknown adapter error由application/infra error owner |
| tests | 每个 contracts factory 至少命中其失败 variant；public code mapping total；Debug不回显 rejected raw value |
| stop | `pass_R06.2`;`R06-D12` 的 contracts error owner部分关闭，application/entry error仍留 `R06.6/R06.7` |

## 16. ref-set 独立对象卡

### 16.1 set 构造的共同算法

所有 set 的 `try_from_members` 必须按以下固定顺序执行：

1. 在分配扩容前检查输入 member count 不超过该 set hard maximum；超限返回 `SetTooLarge`。
2. 逐 member 验证 typed owner / tagged kind；错误返回 `WrongReferenceOwner` 或 `IncompatibleReferenceKind`。
3. 计算本 set 专属 canonical key；不得用 debug string、serde JSON 或 hash map iteration order。
4. 按 canonical key 升序排序。exact duplicate 折叠为一项；同一 identity key 对应两个不同 structured snapshot 返回 `ConflictingSetMember`。
5. 检查本 set 的 empty 规则；禁止空集时返回 `EmptySetNotAllowed`。
6. wire / digest 使用已排序的 canonical array；decode 后必须再次执行同一算法。

所有集合提供 `len/is_empty/iter/into_vec/contains`，不提供未经校验的可变 `push`。批量或immutable-style增删使用消费原集合的 `with_member/without_member`；owning domain aggregate 的 `&mut self` transition 可使用 `try_insert/try_remove`，两者必须复用同一 owner/key/bound/empty/canonical算法并在失败时保持原集合不变。`try_insert` 返回 `SetInsertOutcome::Inserted` 或 `AlreadyPresent`；`try_remove` 返回 `SetRemoveOutcome::Removed` 或 `NotPresent`，禁止用重复输入制造transition delta。这样 persisted / wire 值始终 canonical，且不要求aggregate复制或临时清空整个set。

`SetInsertOutcome` / `SetRemoveOutcome` 归 `contracts::refs`，仅是process-local mutation result，不序列化、不持久化、不进入public DTO。需要禁止empty的set执行`try_remove`后若将变空，必须返回`EmptySetNotAllowed`且保持原集合。

### 16.2 `BodyFreeRefSet`

```rust
/// Canonical bounded set of generic body-free references.
pub struct BodyFreeRefSet(Vec<BodyFreeRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | `BodyFreeRef`;key = exact canonical bytes |
| empty | 允许；用于 job outcome 的 changed/failed/progress 均可能为空；要求 non-empty 的 owning scope 另行拒绝 |
| hard maximum | 1024 raw/final members；`ObservationReferenceRefreshScope::ExplicitRefs` 再收紧为256 |
| factory | `empty()`;`try_from_members(Vec<BodyFreeRef>)`;`try_non_empty(Vec<BodyFreeRef>)` |
| wrong kind | typed decoder不得把 structured object、locator或任意 JSON object降成 generic string |
| tests / stop | empty、1024、1025、unsorted、exact duplicate、invalid member、stable wire/digest；`pass_R06.2` |

### 16.3 `GapStateRefSet`

```rust
/// Canonical bounded set of gap-state identities.
pub struct GapStateRefSet(Vec<GapStateRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | `GapStateRef`;key = wrapper discriminator + inner bytes |
| empty | 允许；无 gap 是合法结果，但不得用 empty 隐藏 owning object 要求的 gap |
| hard maximum | 256 |
| factory | `empty()`;`try_from_members`;`try_non_empty` |
| wrong kind | `GapSourceRefId`、`GapSourceRef`、`BodyFreeRef`、其他 typed ref 均拒绝 |
| tests / stop | owner mismatch、duplicate collapse、bound、canonical order；`pass_R06.2` |

### 16.4 `SafeSignalRefSet`

```rust
/// Canonical bounded set of safe-signal identities.
pub struct SafeSignalRefSet(Vec<SafeSignalRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | `SafeSignalRef`;typed discriminator + inner bytes |
| empty | 允许；diagnostic summary 可在 gap-only / unavailable 情况无 signal |
| hard maximum | 1024 |
| factory | `empty()`;`try_from_members`;`try_non_empty` |
| wrong kind | runtime summary、raw provider signal id、rollup ref 和 generic ref 拒绝 |
| tests / stop | empty/bound/owner/ordering/dedup；`pass_R06.2` |

### 16.5 `NoWriteViolationRefSet`

```rust
/// Canonical bounded set of no-write violation identities.
pub struct NoWriteViolationRefSet(Vec<NoWriteViolationRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | `NoWriteViolationRef`;typed discriminator + inner bytes |
| empty | 允许；empty 只表示当前 surface 未关联 violation，不证明未发生违规 |
| hard maximum | 256 |
| factory | `empty()`;`try_from_members`;`try_non_empty` |
| wrong kind | attempted target、gap、policy、history record ref 均拒绝 |
| tests / stop | empty semantics、owner mismatch、bound、dedup；`pass_R06.2` |

### 16.6 `ObservationConsumerRefSet`

```rust
/// Canonical bounded set of structured observation consumers.
pub struct ObservationConsumerRefSet(Vec<ObservationConsumerRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | variant + stable identity：Report/Peripheral用其具名 id，其余用typed ref；state/scope不进入identity key但进入full snapshot equality |
| empty | 允许；仅 `ActiveReferenceProtectionState::Unprotected/Released` 可持久化空集，完整 state invariant 留 `R06.4` |
| hard maximum | 256 |
| factory | `empty()`;`try_from_members`;`with_member`;`without_member` |
| duplicate | exact structured duplicate折叠；同 variant/id 但kind/scope/state不同返回 `ConflictingSetMember`，不得first/last wins |
| wrong kind | arbitrary external consumer、endpoint、config binding或untagged ref拒绝 |
| tests / stop | 5 variants、structured conflict、empty/state handoff、bound/canonical order；`pass_R06.2` |

### 16.7 `ReplayTargetRefSet`

```rust
/// Canonical non-empty bounded set of observation-side replay targets.
pub struct ReplayTargetRefSet(Vec<ReplayTargetRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | target object variant + typed inner identity |
| empty | 禁止；一个 replay scope 必须有至少一个明确 target |
| hard maximum | 256 |
| factory | `try_from_members`;无 `empty()`；`without_member` 若变空则 `EmptySetNotAllowed` |
| duplicate | exact target折叠；同 object identity 不存在不同 snapshot shape |
| wrong kind | source/external truth、receipt/safety/correlation canonical truth、generic ref、maintenance target wrapper均拒绝 |
| tests / stop | zero/1/256/257、allowed/denied object variants、dedup/order；`pass_R06.2` |

### 16.8 `ObservationReceiptRefSet`

```rust
/// Canonical bounded set of observation receipt identities.
pub struct ObservationReceiptRefSet(Vec<ObservationReceiptRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | `ObservationReceiptRef`;typed discriminator + inner bytes |
| empty | 允许；empty projection/report result 不等于 missing source |
| hard maximum | 1024 |
| factory | `empty()`;`try_from_members`;`try_non_empty` |
| wrong kind | source ref、safety ref、generic ref拒绝 |
| tests / stop | owner/bound/order/dedup/empty；`pass_R06.2` |

### 16.9 `EvidenceLinkageRefSet`

```rust
/// Canonical bounded set of body-free evidence linkage identities.
pub struct EvidenceLinkageRefSet(Vec<EvidenceLinkageRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | `EvidenceLinkageRef`;typed discriminator + inner bytes |
| empty | 允许；真实性/交接 owning object 必须用 gap/readiness明确解释缺失 |
| hard maximum | 1024 |
| factory | `empty()`;`try_from_members`;`try_non_empty` |
| wrong kind |真实 evidence alias、external evidence ref、digest summary或generic ref拒绝 |
| tests / stop | empty does-not-prove-authenticity、owner/bound/order/dedup；`pass_R06.2` |

### 16.10 `ReferenceSnapshotStateRefSet`

```rust
/// Canonical bounded set of reference snapshot-state identities.
pub struct ReferenceSnapshotStateRefSet(Vec<ReferenceSnapshotStateRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | canonical `ReferenceSnapshotStateRef`;typed discriminator + inner bytes |
| empty | 允许；refresh job可合法 no-op，但report必须保留 outcome |
| hard maximum | 1024 |
| factory | `empty()`;`try_from_members`;`try_non_empty` |
| wrong kind | historical `ReferenceSnapshotRef` untyped payload、external source ref、generic ref拒绝 |
| tests / stop | canonical name/wire、legacy owner rejection、bound/order/dedup；`pass_R06.2` |

### 16.11 `AffectedObservationObjectRefSet`

```rust
/// Canonical bounded set of typed observation-side affected objects.
pub struct AffectedObservationObjectRefSet(Vec<AffectedObservationObjectRef>);
```

| 契约项 | 裁定 |
|---|---|
| member / key | inner `ObservationObjectRef` variant + typed identity |
| empty | 允许；accepted no-op/duplicate可无 affected object，不得伪造 changed ref |
| hard maximum | 1024 |
| factory | `empty()`;`try_from_members`;`try_non_empty` |
| duplicate | same typed object折叠；不同 variant即使inner token相同仍是不同 member |
| wrong kind | external/source truth、untagged/generic ref、raw product id拒绝 |
| tests / stop | 23 object variants、same-inner/different-owner、bound/order/dedup；`pass_R06.2` |

### 16.12 set 到 owning use 的附加约束

| owning use | set | contextual rule |
|---|---|---|
| `DiagnosticScope.target_refs` | `BodyFreeRefSet` | non-empty,max 256,member必须属于 projection scope |
| `ObservationReferenceRefreshScope::ExplicitRefs` | `BodyFreeRefSet` | non-empty,max 256 |
| job report changed/failed/progress | `BodyFreeRefSet` | each max 1024；跨set同一ref可同时出现仅当item outcome显式Partial/Failed，R06.6闭口 |
| job report gaps / authenticity gaps | `GapStateRefSet` | max 256；empty不表示 full success |
| diagnostic summary | three typed sets | each可空；fresh/available state组合由R06.4闭口 |
| active protection | `ObservationConsumerRefSet` | Protected必须non-empty；Released必须empty或历史消费者快照另由record承接 |
| replay scope | `ReplayTargetRefSet` | non-empty,max 256,只含四类实际effect可处理的allowlisted target；不含progress或execution-state对象 |
| replay coordination completion | `AffectedObservationObjectRefSet` | empty表示显式no-change；非空时必须恰好一个member，且其inner `ObservationObjectRef`逐字段等于该execution保存的`MaintenanceTargetRef.target_object_ref`；不得申报同scope其他target |

## 17. report / handoff helper 名称裁定

### 17.1 `HandoffSurface`

| 项 | 裁定 |
|---|---|
| inventory status | `HX historical placeholder` |
| 发现 | 仅修复前 Step 06 capability 表点名，无字段、factory、member、protocol use或上游关键对象 |
| current replacement | handoff command/query/event各使用自身具名 result/view/payload；共享 visibility/degraded 使用本文件 `VisibilitySurface` / `DegradedSurface` |
| 禁止 | 不生成 generic `HandoffSurface`，不让实现者自行猜 schema |
| stop | `pass_excluded_R06.2` |

### 17.2 `JobReportSurface`

| 项 | 裁定 |
|---|---|
| inventory status | `HX historical placeholder` |
| 发现 | Step 08 已定义并全局使用 `ObservationJobReportSurface`;旧名没有独立 schema |
| current unique type | `ObservationJobReportSurface`；schema owner当前物理位于 Step 08，`R06.6`需将其对象 definition 回灌到 Step 06 application/public carrier专项并让 Step 08只引用 |
| 当前 `R06.2` 行为 | 不复制或抢先定义 job report schema；只固定“不得生成第二套同义类型” |
| 禁止 | 不使用 type alias维持双名，不伪造真实 run id/evidence alias/final verdict/signoff |
| stop | `pass_excluded_R06.2`;definition-owner传播项保持 open 到 `R06.6` |

## 18. 本批 inspection enum 独立卡

这些 enum 只为 tagged carrier 提供 total inspection / wire discriminator。它们不独立携带 identity，也不允许从 free string 动态扩展。

### 18.1 `ObservationObjectKind`

| 卡片项 | 独立契约 |
|---|---|
| variants | 与 §8.1 `ObservationObjectRef` 23 variants 一一对应 |
| wire | `observation_receipt`;`safety_disposition`;`correlation_context`;`safe_signal`;`signal_rollup_window`;`audit_projection`;`evidence_linkage`;`report_handoff_record`;`authenticity_hint`;`retention_marker`;`active_reference_protection`;`replay_scope`;`no_write_violation`;`read_visibility`;`diagnostic_summary`;`gap_state`;`peripheral_delivery`;`reference_snapshot_state`;`projection_maintenance`;`observation_read_model`;`diagnostic_view`;`dashboard_alert_export_view`;`rebuild_progress_view` |
| factory / member | 只由 `ObservationObjectRef::kind()` 返回；parse仅用于 tagged decode并必须与payload wrapper匹配 |
| tests / stop | 23 total mappings、kind/payload mismatch、unknown；`pass_R06.2` |

### 18.2 `ObservationConsumerKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Report/report`;`Peripheral/peripheral`;`ReadModel/read_model`;`Diagnostic/diagnostic`;`ArchiveHandoff/archive_handoff` |
| factory / member | 只由 `ObservationConsumerRef::kind()` 或 tagged decode产生 |
| invariant | 不等于 `ReportConsumerKind` / `PeripheralConsumerKind`;本 enum描述 wrapper family |
| tests / stop | 5 total mappings、cross-family confusion；`pass_R06.2` |

### 18.3 `AuditSubjectKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Observation/observation`;`Subject/subject`;`GovernanceArtifactEvidence/governance_artifact_evidence`;`RuntimeSandbox/runtime_sandbox`;`ReportConsumer/report_consumer`;`PeripheralConsumer/peripheral_consumer` |
| factory / member | `AuditSubjectRef::kind()` / tagged decode only |
| invariant | 不替代具体 typed subject payload |
| tests / stop | 6 total mappings、untagged/unknown；`pass_R06.2` |

### 18.4 `CursorNamespace`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Observation/observation`;`Reference/reference` |
| factory / member | `ObservationCommittedCursor::namespace()` / tagged decode only |
| invariant | 不提供跨 namespace order / arithmetic |
| tests / stop | two mappings、numeric-only decode拒绝；`pass_R06.2` |

### 18.5 scope kind enums

| 类型 | exact variants / wire | invariant / stop |
|---|---|---|
| `ObservationProjectionScopeKind` | `ByObservation/by_observation`;`ByCorrelation/by_correlation`;`ByAuditSubject/by_audit_subject`;`ByReportHandoff/by_report_handoff`;`ByMaintenanceTarget/by_maintenance_target` | 必须与scope payload variant一致；`pass_R06.2` |
| `ObservationReferenceRefreshScopeKind` | `ExplicitRefs/explicit_refs`;`BySourceFamily/by_source_family`;`UnhealthyOnly/unhealthy_only`;`ByMaintenanceTarget/by_maintenance_target` | 不单独充当job input；`pass_R06.2` |
| `ConsumerScopeKind` | `AllSafeObservations/all_safe_observations`;`Observation/observation`;`Correlation/correlation`;`AuditSubject/audit_subject`;`ReportHandoff/report_handoff`;`Diagnostic/diagnostic`;`Maintenance/maintenance`;`Explicit/explicit` | 必须与ConsumerScope payload一致；`pass_R06.2` |

## 19. secondary carrier 唯一 owner registry

### 19.1 registry 使用规则

| 规则 | 当前约束 |
|---|---|
| registry 作用 | 固定已被对象字段/member签名使用、但不属于本批完整 schema 的 secondary carrier 的唯一 owner和完成批次 |
| `ET` | 直接 import core 的 exact type；不得创建 L4 同义 wrapper，除非后续对象卡证明需要收紧安全语义并显式改为 `FC` |
| `FC@R06.x` | owning batch 必须建立独立对象卡；当前名称不是已完成 schema |
| `TC@R06.x` | owning batch 必须验证 transparent template资格并建立独立卡；不得直接按名称生成 wrapper |
| `DX` | exact later Step owner已明确，当前对象构造不依赖其 schema |
| 实现暂停 | 任一字段 / parameter 类型不在本文件已闭口类型、ET表或本registry，或到 owning batch 后仍未有独立卡，必须停下回开Step06 |

### 19.2 external shared carrier

| carrier | 资格 / unique import | 当前用法 | 禁止事项 |
|---|---|---|---|
| `ActorRef` | `ET core_contracts::actor::ActorRef` | actor-safe identity input的上游类型 | core当前含optional display name；不得直接写durable audit/public body，`R06.3`需裁定safe projection |
| `ActorContext` | `ET core_contracts::actor::ActorContext` | command/query/job trusted actor context | 不复制为L4同义struct；role/display安全映射由entry/domain card闭口 |
| `Timestamp` | `ET core_contracts::metadata::Timestamp` | protocol metadata / persisted clock input | core当前只包String；`ObservedAt`若保留必须在R06.3作validated FC，不能alias猜语义 |
| `TraceId` | `ET core_contracts::metadata::TraceId` | distributed trace correlation | 不是`CorrelationContextRef`或business truth |
| `JobRunId` | `ET core_contracts::metadata::JobRunId` | public/local job metadata | 不声称真实external run id；R06.6决定`JobRunRef`是否必要 |
| `IdempotencyKey` | `ET core_contracts::metadata::IdempotencyKey` | command/job idempotency input | validation收紧若需要由R06.6明确，不重复定义同名类型 |

### 19.3 `R06.3` truth / safety / signal / audit carrier registry

| carrier group | unique owner / qualification | exact owning object / use | 完成门禁 |
|---|---|---|---|
| `ActorSafeRef`;`ObservedAt` | `contracts::metadata FC@R06.3` | 所有domain field/record；Actor投影有意丢弃display name，time做canonical UTC校验 | 字段、validation、wire、redaction、与core mapping独立卡；`R06.3 pass` |
| `SubmissionPurpose`;`IntakeRejectReason`;`QuarantineReason`;`ObservationReceiptState` | `contracts::metadata FC@R06.3` | receipt protocol、transition与public view共享 | finite variants、source、record mapping、state trigger；`R06.3 pass` |
| `ObservationReceiptTransition` | `domain::intake FC@R06.3` | `ObservationReceipt` accepted mutation delta | target state与R06.5 record handoff；`R06.3 pass` |
| `RedactionMarker`;`ForbiddenBodyFlag`;`ForbiddenBodyKind`;`SafetyDispositionState` | `contracts::metadata FC@R06.3` | safety protocol、domain与public view共享 | finite wire与state/summary/flag matrix；`R06.3 pass` |
| `ForbiddenBodyEvidence`;`ReceivedMaterialSummary`;`SafetyEvaluationContext`;`SafetyDispositionTransition` | `domain::safety FC@R06.3` | `SafetyDisposition` factory/policy input与mutation delta | body-free schema、mutual invariants、禁止正文；`R06.3 pass` |
| `TraceCorrelationRef`;`CausationRef` | `contracts::refs TC@R06.3` | correlation protocol/domain fields | BodyFreeRef validation、typed discriminator、不得升级为business truth；`R06.3 pass` |
| `CorrelationSeed`;`CorrelationGapReason`;`CorrelationInvalidReason`;`CorrelationContextState` | `contracts::metadata FC@R06.3` | public request/value/reason与domain lifecycle共享 | exact fields/variants、ProtocolError、trigger；`R06.3 pass` |
| `CorrelationContextTransition` | `domain::correlation FC@R06.3` | `CorrelationContext` mutation delta | target/state-preserving payload与record handoff；`R06.3 pass` |
| `SafeSignalKind`;`SignalSuppressionReason`;`SafeSignalState` | `contracts::metadata FC@R06.3` | signal protocol/domain/view共享 | finite variants与safe-summary/state compatibility；`R06.3 pass` |
| `SignalDecisionKind`;`SignalDecision`;`SafeSignalTransition` | `domain::signal FC@R06.3` | target-bound `SafeSignalPolicy` result与signal delta | nonpublic constructor、target/context match；`R06.3 pass` |
| `SignalRollupScope`;`RollupWindowKind`;`SignalCount`;`MaintenanceFailureReason`;`SignalRollupState` | `contracts::{scopes,metadata} FC@R06.3` | rollup query/job/domain/view共享 | scope/count/window/state bounds；`R06.3 pass` |
| `SignalRollupCoverage`;`SignalRollupTransition` | `domain::signal FC@R06.3` | target-bound committed snapshot与window delta | cursor/count/scope proof；`R06.3 pass` |
| `SourceAuditRef`;`AuditAppendRecordRef` | `contracts::refs TC@R06.3` | audit protocol/timeline/record/domain共享 | body-free source identity与independent append identity；`R06.3 pass` |
| `AuditAppendKind`;`AuditProjectionState` | `contracts::metadata FC@R06.3` | timeline、persisted record、domain与public view共享 | finite kind/state与resulting-state matrix；`R06.3 pass` |
| `AuditProjectionTransition` | `domain::audit FC@R06.3` | `AuditProjection` append/visibility/gap delta | restricted state-preserving append与record handoff；`R06.3 pass` |
| `EvidenceConsumerPurpose`;`EvidenceConsumerScope`;`BodyBlockedReason`;`EvidenceLinkageState` | `contracts::{metadata,scopes} FC@R06.3` | evidence protocol/domain/view共享 | purpose/scope、visibility/body-block state matrix；`R06.3 pass` |
| `EvidenceVisibilityOutcome`;`EvidenceVisibilityDecision`;`AuditProjectionVisibilityDecision`;`EvidenceLinkageTransition` | `domain::{evidence,audit} FC@R06.3` | target-bound policy results与linkage delta | nonpublic constructor、scope/target match、relink input；`R06.3 pass` |
| `ObservationProjectionFreshnessSurface`;`EvidenceIndexInputViewRef`;`AuditProjectionRefSet`;`AuditTimelineWindow`;`AuditTimelineEntryView`;`AuditTimelineEntryList` | `contracts::{surfaces,refs,views} FC/TC逐项@R06.3` | public projection与timeline support | freshness、identity、set/order/append-state matrix；`R06.3 pass` |
| `SafeSignalSummaryRef` | `contracts::refs TC@R06.2` | safety/signal/view复用既有canonical safe-summary ref | 旧`SafeSummaryRef`不生成alias；`R06.3 reuse pass` |
| `IntakeStatusView`;`SafeSignalProjectionView`;`SignalRollupView`;`AuditTimelineView`;`EvidenceIndexInputView` | `contracts::views FC@R06.3` | public projections/body-free immutable input | Step08后置schema回灌、visibility/freshness/body规则；`R06.3 pass` |

### 19.4 `R06.4` handoff / retention / read / gap / reference / maintenance registry

| carrier group | unique owner / qualification | exact owning object / use | 完成门禁 |
|---|---|---|---|
| `ReportHandoffScopeRef`;`ArchiveEligibilityRef`;`NoWriteTriggerContextRef`;`ExternalAuditExportPreparationRef`;`ReplayCoordinationRef`;`RollupRebuildRef` | `contracts::refs TC@R06.4` | handoff/retention/no-write/peripheral/maintenance stable identity | transparent wrapper、mint owner与禁止互换独立卡；`R06.4 pass` |
| `ForbiddenWriteTargetRef`;`VisibilityScopeRef`;`ReferenceSubjectRef` | `contracts::refs structured FC@R06.4` | no-write/read/reference boundary | tagged fields、kind/ref/guard compatibility、body-free；`R06.4 pass` |
| `EvidenceOriginKind`;`PlaceholderReason`;`AuthenticityGapReason`;`HandoffDeliveryResult`;handoff/retention/replay/no-write/read/gap/peripheral/reference/maintenance state/reason/result enums | `contracts::metadata FC@R06.4` | protocol/domain/view共享finite values | exact variants/wire/source/state matrix，no free text/default；`R06.4 pass` |
| `DiagnosticTimeWindow`;`MaintenanceProgressSummary` | `contracts::metadata FC@R06.4` | diagnostic scope / rebuild progress | time-window bounds；bounded count、observation/reference dual watermark、namespace requirement matrix与failed refs；`R06.4 pass` |
| `ReportHandoffRecord`;`AuthenticityHint`;`RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation`;`ReadVisibilityState`;`DiagnosticScope`;`DiagnosticRequestContext`;`DiagnosticSummary`;`GapState`;`DegradedOutputState`;`PeripheralDeliveryState`;`ExternalAuditExportPreparation`;`ReferenceSnapshotState`;`ProjectionMaintenanceState`;`ReplayCoordinationState`;`RollupRebuildState` | owning `domain::* FC@R06.4` | 18个current truth/state/value object | fields/factory/member/rehydration/conditional matrix；`R06.4 pass` |
| `HandoffReadinessDecision`;`RetentionMarkerDecision`;`ActiveProtectionReleaseDecision/Outcome`;`ReplayApprovalSnapshot`;`ReadVisibilityDecision`;`PeripheralDeliveryDecision`;`ExportPreparationDecision`;`MaintenanceExecutionAuthorization/Mode` | owning `domain::* FC@R06.4` | target-bound policy result / authorization | private constructor、exact target/version、no public reuse；`R06.4 pass` |
| 17个R06.4 transition delta family | owning `domain::* FC@R06.4` | successful object mutation proof -> R06.5 record factory input | failure emits no delta；factory另需same-UoW post-mutation aggregate snapshot + typed record metadata；不得重放policy或仅凭current truth重建history；`R06.4 pass` |
| `ObservationReadModel`;`DiagnosticView`;`GapStatusView`;`DashboardAlertExportView`;`ReferenceSnapshotView`;`RebuildProgressView` | `contracts::views FC@R06.4` | public read/progress projections | stable identity、scope/freshness/visibility、Step08后置schema回灌；`R06.4 pass` |
| `ReadModelScope`;`GapViewScope`;`SafeSignalProjectionViewRefSet`;`AuditTimelineViewRefSet`;`DegradedOutputStateRefSet`;`ReferenceFreshnessSummary` | `HX@R06.4` | historical aggregate/duplicate shape | 不生成current type；复用canonical scope/set或single-object view；`R06.4 excluded` |

### 19.5 `R06.5` policy / guard / record carrier registry

| carrier group | unique owner / qualification | exact use | 完成门禁 |
|---|---|---|---|
| 18 policy objects listed in主控§6.5.4 | `domain::policies FC@R06.5`,每个独立owner file/card | exact typed input/output/rule snapshot | generic `DomainPolicy<P,R>`不得替代；constructor/rule/input/output/error/test逐项闭口 |
| `AdmissionDecision` | `domain::intake FC@R06.5-C`;唯一producer为`IntakeAdmissionPolicy` | source/purpose/disposition准入的target-bound result | exact fields、complete snapshots与`pub(crate)` constructor见R06.5专项§20；不得作为`CorrelationContext::from_receipt`绕过`ObservationReceiptState::Accepted`前置 |
| `EvidenceOriginResolution` | `contracts::metadata FC@R06.5-C` | `GovernanceArtifactEvidenceResolver`的body-free origin result；application据此组装P6 target-bound assessment | exact variants/source/redline见§24；不得成为Command字段、config default或public caller assertion |
| `MaintenanceExecutionAuthorization` | `domain::maintenance FC@R06.4`;唯一producer由R06.5 `DerivedMaintenancePolicy`闭口 | derived maintenance authorization | exact target/effect/guard + Scheduled/ApprovedReplay已定义；R06.5不得复制shape |
| 13 append-only record objects in主控§6.5.5 | `domain::records FC@R06.5`,每个独立card | transition output / persisted append | record ref、subject、kind、reason、actor、time、cursor、trace逐字段闭口 |
| `IntakeDecisionKind`;`IntakeDecisionReason`;`CorrelationLinkChangeKind`;`CorrelationChangeReason`;`HandoffLifecycleChangeKind`;`RetentionChangeKind`;`RetentionChangeReason`;`NoWriteViolationRecordKind`;`ReadAccessKind`;`GapTransitionKind`;`ReferenceRefreshKind`;`ProjectionMaintenanceKind`;`GapScanKind`;`ReplayExecutionKind` | `domain::records FC@R06.5` | exact record change classifiers | finite variants，不用 `String change_kind`；`AuditAppendKind`复用R06.3 contracts definition |
| `PolicyBasisRef` | `contracts::refs TC@R06.5-B` | resolved immutable policy snapshot identity | 与infra `PolicyBindingRef`隔离；不生成18个`*PolicyId` |
| all 13 record refs including `AuditAppendRecordRef`;`NoWriteViolationRecordRef`;`ReferenceRefreshRecordRef` | `contracts::refs TC@R06.5-B` | append-only typed PK | 12 new + 1 R06.3 reuse；independent application mint；不使用generic BodyFreeRef persisted PK |
| `PolicyFamily`;`PolicyRevision`;`PolicyEvaluationBasis` | `domain::policies FC@R06.5-B` | 18-family resolved immutable evaluation basis | family/ref/revision/digest exact；C~E concrete policy逐卡消费 |
| `ObservationRecordOrigin`;`RecordAuditVisibility`;`ObservationRecordMetadata<R>` | `domain::records FC@R06.5-B` | typed record factory metadata | 不复制R06.6 operation namespace；commit cursor不替代post-state dual watermarks |
| `DomainRelationMismatchKind`;`PolicyBasisMismatchKind`;`RecordConstructionMismatchKind`;`DomainError` | `domain::errors FC@R06.5-B` | object/policy/transition/record join failure | 20 top-level variants；Step12只补mapping/recovery,不得首次发明 |

### 19.6 `R06.6` application / idempotency / job / external effect registry

| carrier group | unique owner / qualification | exact use | 完成门禁 |
|---|---|---|---|
| four operation enums + `ObservationOperationName` | `application::operations FC@R06.6` | 16 Command/14 Query/9 Consumer/9 Job namespace | exact variants、route/digest map |
| `ObservationInboundEventIdentity`;`SourceEventRef`;`InboundEventRef` | `application::context FC/TC逐项@R06.6` | producer+source-event uniqueness | source/event owner、body-free/wire |
| `ObservationOperationContext`;`ObservationRepositoryVersion` | `application::context FC@R06.6` | all service inputs/CAS | four factories、source mapping、version positive semantics |
| idempotency object family in主控§6.6.1 | `application::idempotency FC/TC逐项@R06.6` | reserve/replay/conflict/in-flight | atomic owner、state/outcome/stored bytes/schema/digest invariants |
| `BodyFreeSerializedResult` | `application::idempotency FC@R06.6` | immutable stored public surface bytes | size bound、no Debug、exact schema decode |
| `OutboxRecordRef`;`OutboxPayloadSnapshotRef`;`OutboundEventRef`;`DeadLetterRef` | `contracts::refs TC@R06.6-B`;application owns typed mint calls | public command/receipt/event/job carrier + application repository/snapshot identity | one canonical low-dependency declaration;contracts不依赖application；四ref不可互换 |
| `ObservationOutboxRecord`;`OutboxPublicationState`;`ObservationOutboxPayloadSnapshot`;`BodyFreeSerializedEvent`;`PublicationReceipt`;`PublicationFailureKind`;`PublicationFailure`;`DeadLetterReason` | `application::outbox FC@R06.6-B` | durable outbox/snapshot publication | state/failure/receipt/dead-letter exact invariants；reason/ref co-presence |
| job plan/claim/report family in主控§6.6.2~6.6.3 | `application::jobs FC/TC逐项@R06.6` | immutable plan、global work key、claim/fence、report fold | 每个对象独立卡；`ReferenceSnapshotStateRef` canonical propagation |
| `JobExecutionConfigSnapshot` | `application::jobs FC@R06.6` | plan-bound executable config | exact fields/bounds/digest, resume不热读config |
| five external effect token objects + intent/binding refs | `application::effects FC/TC逐项@R06.6` | stable prepare/deliver/publish idempotency | exact historical binding/material digest/no current fallback |
| `ObservationVisibilityDecision` | `HX`;canonical owner=`domain::read::ReadVisibilityDecision` | historical duplicate visibility name | application不得声明同名类型或alias |
| `ProjectionScopeItemReport/Outcome` | `application::jobs FC@R06.6-E` | durable per-scope report accounting | E批逐对象卡；当前不得提前标完成 |
| `ObservationConsumerDisposition`;`ObservationJobDisposition` | `UR@R06.6-E` | public outcome / durable result-report / entry disposition 分层待裁定 | 不得复用历史同名enum或提前标`FC`完成 |
| `ObservationJobReportSurface` | `contracts::jobs FC@R06.6` | unique public draft job report | 从Step08回灌object definition；不伪造run/evidence/signoff |
| four service objects | `application::services FC@R06.6` | command/query/consumer/job façade | constructor dependencies、full capability list、forbidden deps |
| `ApplicationError`;`JobError` | `application::errors/jobs FC@R06.6` | service/report mutation error | Step12映射后置，error definition不得后置 |

### 19.7 `R06.7` runtime / infra / entry registry

| carrier group | unique owner / qualification | exact use | 完成门禁 |
|---|---|---|---|
| `AdapterAvailabilityScope/State/Kind` | `application::ports::runtime FC@R06.7` | product-neutral probe snapshot | family vs exact binding、degraded/unavailable |
| API/worker/jobs stable carrier in主控§6.7.2 | respective entry module `FC@R06.7` | mapping/loop/runner one-shot/process state | field source/factory/member/persistence/test逐对象卡 |
| `EntryDisposition`;`ConsumerDispositionState`;`OutboxLoopKind`;`ProjectionLoopKind`;`QueryVisibilityDefaults`;`WorkerFailureReason`;`WorkerErrorRef`;`ApiError`;`WorkerError` | respective entry module `FC/TC逐项@R06.7` | entry process carrier support | finite variants、安全error refs、不得新增business truth |
| 15 R2 technical carrier in主控§6.7.3 | `infra::runtime_builder` or listed entry owner `FC/TC逐项@R06.7` | safe registration/delivery/invocation/catalog/runtime assembly | unique definition owner、no locator/material leakage、group atomicity |
| four technical handler/registrar/opaque handle alias groups | `DX Step07` | exact trait/object-safe seam | R06.7只闭口data carrier，不复制trait |
| raw binding/config/locator/credential/endpoint/cron | `DX Step14/04` | infra-only config parsing/assembly | 不进入worker/jobs/application public carrier |

### 19.8 owner registry 审查结论

| 检查 | 结论 |
|---|---|
| 是否给当前已知 domain-facing secondary carrier分配唯一批次/owner | `pass_for_known_inventory`；§19.3~§19.5 |
| 是否给 application/runtime/entry 后置类型分配唯一批次/owner | `pass_for_known_inventory`；§19.6~§19.7 |
| 是否误把 registry 当已完成 schema | 否；所有 `FC/TC@R06.x` 明确要求独立卡 |
| R06.3 / R06.4 owner schema是否已闭口 | `pass_for_R06.3_R06.4`；§19.3~§19.4 carrier已有exact schema、明确复用或HX排除；R06.5及以后仍只是待闭口owner分配 |
| 是否允许实现侧新增 local enum/string/default | 否；不在 registry 或 owning card 中的类型触发暂停 |
| 是否完成 zero-unowned-support-type | 尚未；必须在 `R06.8` 对修复后全文重新扫描 |
| 当前 stop | `pass_R06.2_registry`;`R06-D11` 从“无owner”降为“owner已分配、schema按批次待闭口” |

## 20. structured metadata 逐类型停审卡

以下每个类型独立复用 §4.2 的 exact enum parser；除明确列出的 inspection member 外均无业务副作用。所有类型 unknown token、case alias、numeric alias、`Other(String)` 和 first-variant default 都必须拒绝。

### 20.1 `ReportConsumerKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Report/report`;`Acceptance/acceptance`;`Archive/archive`;`ExternalAudit/external_audit` |
| source / member | validated consumer catalog；`as_token()`;`compatible_purpose(HandoffPurpose)` total table |
| invariant | 不含 product/provider name，不声明 consumer lifecycle |
| tests / stop | 4 variants、purpose matrix、unknown；`pass_R06.2` |

### 20.2 `HandoffPurpose`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `ReportDelivery/report_delivery`;`AcceptanceInput/acceptance_input`;`ArchiveTransfer/archive_transfer`;`ExternalAuditInput/external_audit_input` |
| source / member | validated command/config；`as_token()` |
| invariant | purpose 不是 verdict、signoff、run id 或 evidence alias |
| tests / stop | 4 variants、consumer compatibility、unknown；`pass_R06.2` |

### 20.3 `ConsumerBoundaryState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Pending/pending`;`Active/active`;`Blocked/blocked`;`Retired/retired` |
| member | `can_accept_handoff()`仅Active；`is_terminal()`仅Retired |
| invariant | local boundary state，不复制 external consumer lifecycle |
| tests / stop | transition matrix、Retired terminal、unknown；`pass_R06.2` |

### 20.4 `PeripheralConsumerKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Dashboard/dashboard`;`Alert/alert`;`ManagementReport/management_report`;`GrcExport/grc_export`;`AnomalyAnalysis/anomaly_analysis` |
| source / member | validated catalog；`as_token()` |
| invariant | product-neutral；不含 vendor/dashboard id |
| tests / stop | 5 variants、unknown/product token拒绝；`pass_R06.2` |

### 20.5 `PeripheralConsumerState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Active/active`;`Limited/limited`;`Blocked/blocked`;`Retired/retired` |
| member | `can_consume()` Active/Limited；`is_terminal()` Retired |
| invariant | state 不修改 observation truth，Delivered不属于此enum |
| tests / stop | transition/member matrix、unknown；`pass_R06.2` |

### 20.6 `ExportAllowedFlag`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Allowed/allowed`;`Denied/denied` |
| source / member | validated export policy；`is_allowed()` |
| invariant | 不接受 bool/null/default；Allowed仍需state/scope/visibility检查 |
| tests / stop | both variants、bool/null/unknown拒绝；`pass_R06.2` |

### 20.7 `ConsumerScopeKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | 8 variants与§9.1 exact对应 |
| source / member | `ConsumerScope::kind()` / tagged decode only |
| invariant | kind 必须与payload variant一致，不单独授权 |
| tests / stop | 8 total mappings、kind/payload mismatch；`pass_R06.2` |

### 20.8 `ReferenceResolutionKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Resolved/resolved`;`Unresolved/unresolved`;`Stale/stale`;`Invalid/invalid` |
| member | `is_usable()`仅Resolved；`is_terminal()`仅Invalid |
| invariant | local snapshot resolution，不声明 external object lifecycle |
| tests / stop | four states、Invalid terminal、unknown；`pass_R06.2` |

### 20.9 `RuntimeSignalAvailabilityKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Available/available`;`Degraded/degraded`;`Missing/missing`;`NotVisible/not_visible` |
| member | `allows_summary()` Available/Degraded；`requires_gap()` Missing/NotVisible |
| invariant | availability 不裁决 execution success |
| tests / stop | availability/gap matrix、unknown；`pass_R06.2` |

### 20.10 `ProtectedObservationState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Protected/protected`;`ReleaseCandidate/release_candidate`;`Released/released`;`Invalid/invalid` |
| member | `blocks_release()` Protected；`is_terminal()` Released/Invalid |
| invariant | ReleaseCandidate不是cleanup授权 |
| tests / stop | transition/terminal matrix、unknown；`pass_R06.2` |

### 20.11 `GapSourceState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Known/known`;`Unknown/unknown`;`NotVisible/not_visible`;`Unresolved/unresolved` |
| member | `requires_visibility_constraint()`仅NotVisible；`is_resolvable()`非Unknown |
| invariant | source explainability，不等于 `GapLifecycleState` |
| tests / stop | state/constraint matrix、unknown；`pass_R06.2` |

### 20.12 `SubjectReferenceState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Resolved/resolved`;`Stale/stale`;`NotVisible/not_visible`;`Invalid/invalid` |
| member | `is_usable()` Resolved/Stale under policy；`is_terminal()` Invalid |
| invariant | 不拥有 Identity lifecycle；NotVisible!=missing |
| tests / stop | state/visibility/terminal matrix；`pass_R06.2` |

### 20.13 `GovernanceArtifactEvidenceReferenceState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Linked/linked`;`Missing/missing`;`NotVisible/not_visible`;`Invalid/invalid` |
| member | `requires_gap()` Missing；`requires_visibility_reason()` NotVisible；`is_terminal()` Invalid |
| invariant | Linked只表示body-free relation，不证明 authenticity/lineage |
| tests / stop | optional-field/state matrix、unknown；`pass_R06.2` |

### 20.14 `RuntimeSandboxSummaryState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Available/available`;`Stale/stale`;`Missing/missing`;`Blocked/blocked` |
| member | `requires_stale_reason()` Stale；`requires_gap()` Missing/Blocked |
| invariant | 不裁决 execution truth，不存 provider body |
| tests / stop | reason/gap matrix、unknown；`pass_R06.2` |

### 20.15 `ArchiveReportHandoffState`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Pending/pending`;`Ready/ready`;`Blocked/blocked`;`Delivered/delivered`;`Failed/failed` |
| member | `can_deliver()` Ready；`is_terminal()` Delivered/Failed |
| invariant | Delivered!=accepted/signoff；Failed不删除历史 |
| tests / stop | transition/terminal/record matrix；`pass_R06.2` |

### 20.16 historical `MaintenanceTargetState`

| 卡片项 | 独立契约 |
|---|---|
| current status | `HX`;不生成active Rust type或wire token |
| replacement | structural target=`MaintenanceTargetRef`;eligibility=`MaintenanceExecutionAuthorization`或typed policy rejection；execution=`ProjectionMaintenanceState` / `ReplayCoordinationState` / `RollupRebuildState` |
| reason | `Eligible/Running/Completed`会与policy authorization及三个execution lifecycle形成第二状态真相，且target作为protocol input无法证明current state |
| downstream | Step08/09/10/11若仍读取target state或maintenance ref，按affected review改为load canonical binding + owning execution state |

### 20.17 `ProtectionScope`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `ObjectOnly/object_only`;`LinkedEvidence/linked_evidence`;`HandoffInputs/handoff_inputs`;`DerivedViews/derived_views` |
| source / member | validated retention command；`as_token()` |
| invariant | scope只能扩展本仓关联保护，不指向source body |
| tests / stop | 4 variants、target compatibility、unknown；`pass_R06.2` |

### 20.18 `GapSourceKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | 6 variants与§9.4 exact对应 |
| source / member | gap command/resolver；`as_token()` |
| invariant | 不用free string/product name，不执行repair |
| tests / stop | 6 variants、source compatibility、unknown；`pass_R06.2` |

### 20.19 `ObservationSubjectKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Actor/actor`;`Subject/subject`;`GovernedEntity/governed_entity`;`DomainOwner/domain_owner` |
| source / member | authenticated Identity/source mapping；`as_token()` |
| invariant | kind不携带profile/PII/lifecycle |
| tests / stop | 4 variants、unknown/profile input拒绝；`pass_R06.2` |

### 20.20 `GovernanceArtifactEvidenceFamily`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Governance/governance`;`Artifact/artifact`;`Evidence/evidence`;`Baseline/baseline` |
| source / member | authenticated envelope/resolver；`as_token()` |
| invariant | family不声明lineage/authenticity/visibility |
| tests / stop | 4 variants、unknown；`pass_R06.2` |

### 20.21 `ArchiveReportHandoffFamily`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Archive/archive`;`Report/report`;`ExternalAudit/external_audit`;`Acceptance/acceptance` |
| source / member | validated consumer/handoff mapping；`as_token()` |
| invariant | family不声明delivery/acceptance outcome |
| tests / stop | 4 variants、consumer/purpose compatibility；`pass_R06.2` |

### 20.22 `MaintenanceTargetKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `Projection/projection`;`ReferenceSnapshot/reference_snapshot`;`Gap/gap`;`SignalRollup/signal_rollup` |
| source / member | target factory；`compatible_effect()` total table |
| invariant | 不含source/external truth kind；不含`ReplayCoordination`，因为coordination是对一个已选target的execution owner，不是另一个target kind |
| tests / stop | 4x4 kind/effect matrix、unknown/legacy replay_coordination拒绝；`pass_R06.4_reconciled` |

### 20.23 `MaintenanceAllowedEffect`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | 4 variants与§9.4 exact对应 |
| source / member | command/job input validated by target factory；`target_kind()` total map |
| invariant | 一个effect只对应一个target kind，不可组合/扩张；不含`CoordinateObservationReplay`，application job通过`ReplayScope + MaintenanceTargetRef`协调既有四类effect |
| tests / stop | total one-to-one map、unknown/legacy coordinate effect拒绝；`pass_R06.4_reconciled` |

### 20.24 `NoWriteGuardScope`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | `SourceTruth/source_truth`;`ExternalTruth/external_truth`;`ObservationMaintenance/observation_maintenance` |
| source / member | no-write policy；`allows_local_maintenance()`仅ObservationMaintenance |
| invariant | 前两者是明确禁止写目标，不是允许范围 |
| tests / stop | three variants、maintenance factory matrix；`pass_R06.2` |

### 20.25 `ExecutionTruthBoundaryMarker`

| 卡片项 | 独立契约 |
|---|---|
| shape / wire | single variant `ExternalExecutionTruth/external_execution_truth` |
| factory / member | `external()`唯一factory；`is_external()`恒true |
| invariant | input不能选择/覆盖marker |
| tests / stop | only token、missing/other token拒绝；`pass_R06.2` |

### 20.26 `IdentityBoundaryMarker`

| 卡片项 | 独立契约 |
|---|---|
| shape / wire | single variant `ExternalIdentityTruth/external_identity_truth` |
| factory / member | `external()`唯一factory；`is_external()`恒true |
| invariant | 不拥有identity lifecycle |
| tests / stop | only token、tampering拒绝；`pass_R06.2` |

### 20.27 `ArchiveBoundaryMarker`

| 卡片项 | 独立契约 |
|---|---|
| shape / wire | single variant `ExternalArchiveTruth/external_archive_truth` |
| factory / member | `external()`唯一factory；`is_external()`恒true |
| invariant | 不拥有archive package/acceptance/signoff |
| tests / stop | only token、tampering拒绝；`pass_R06.2` |

### 20.28 `ReferenceResolutionReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `ResolverUnavailable`;`ExternalReferenceMissing`;`NotVisible`;`UnsupportedReference`;`InvalidReference` |
| source / member | resolver mapping；§4.2 token/accessor |
| invariant | 不包含provider message/body，不将missing/not-visible合并 |
| tests / stop | 5 variants、state mapping、unknown；`pass_R06.2` |

### 20.29 `ReferenceStaleReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `SourceAdvanced`;`SnapshotExpired`;`ComparatorUnavailable`;`DependencyChanged` |
| source / member | resolver/freshness policy；§4.2 |
| invariant | 不从local clock猜source version |
| tests / stop | 4 variants、comparator fallback负例；`pass_R06.2` |

### 20.30 `HandoffBlockReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `ConsumerUnavailable`;`VisibilityBlocked`;`EvidenceGap`;`InputNotFresh`;`RetentionBoundary`;`NoWriteGuardBlocked` |
| source / member | handoff policy；§4.2 |
| invariant | block reason不是final rejection/verdict；`EvidenceGap`只在真实open gap存在时使用；`InputNotFresh`不伪造gap；`RetentionBoundary`只表达本地marker/protection冲突，不声明cleanup、archive或external report truth |
| tests / stop | 6 variants、state mapping、freshness/retention/evidence reason不互换；`pass_R06.5-D_affected` |

### 20.31 `ConsumerRetireReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `ConfigurationRemoved`;`BoundarySuperseded`;`ExplicitRetirement` |
| source / member | validated catalog/operator command；§4.2 |
| invariant | retirement不删除历史handoff/delivery |
| tests / stop | 3 variants、Retired terminal；`pass_R06.2` |

### 20.32 `RetentionReleaseReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `ProtectionExpired`;`ConsumerReleased`;`ScopeSuperseded`;`OperatorReviewed` |
| source / member | retention policy/operator command；§4.2 |
| invariant | reason只支持候选/record，不自行批准cleanup |
| tests / stop | 4 variants、direct release负例；`pass_R06.2` |

### 20.33 `ConsumerLimitReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `ScopeRestricted`;`VisibilityLimited`;`ExportDisabled` |
| source / member | consumer/export policy；§4.2 |
| invariant | limited不改变observation truth |
| tests / stop | 3 variants、state mapping；`pass_R06.2` |

### 20.34 `PeripheralBlockReason`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire tokens | `ExportForbidden/export_forbidden`;`ConsumerUnavailable/consumer_unavailable`;`VisibilityBlocked/visibility_blocked`;`EvidenceGap/evidence_gap`;`RetentionHoldActive/retention_hold_active`;`NoWriteGuardBlocked/no_write_guard_blocked` |
| source / member | P14 `PeripheralExportPolicy` only；adapter boundary/result不能产生policy block reason；§4.2 exact finite parser |
| invariant | `EvidenceGap`要求complete loaded open gap；`RetentionHoldActive`只表示local marker/protection gate，不证明cleanup/archive；任何variant均不生成external audit acceptance、verdict或signoff |
| tests / stop | 6 variants、exact token/unknown拒绝、gap/retention/visibility/no-write不互换、Blocked mapping；`pass_R06.5-E_affected` |

### 20.35 `EvidenceVisibilityReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `NotVisible`;`PolicyRestricted`;`ReferenceUnresolved`;`BodyFreeBoundaryBlocked` |
| source / member | evidence visibility/body-free policy；§4.2 |
| invariant | missing由gap/state表达，不塞入此reason |
| tests / stop | 4 variants、missing confusion负例；`pass_R06.2` |

### 20.36 `MaintenanceBlockReason`

| 卡片项 | 独立契约 |
|---|---|
| variants | `SourceTruthTarget`;`EffectNotAllowed`;`NoWriteGuardBlocked`;`InvalidTarget`;`DependencyUnavailable` |
| source / member | maintenance/no-write policy；§4.2 |
| invariant | block不能映射Completed或source repaired |
| tests / stop | 5 variants、target/effect mapping；`pass_R06.2` |

### 20.37 `ObservationProjectionScopeKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | 5 variants与§13.1 exact对应 |
| source / member | `ObservationProjectionScope::kind()` / tagged decode |
| invariant | 必须与typed payload一致，不单独作lookup key |
| tests / stop | 5 mappings、payload mismatch；`pass_R06.2` |

### 20.38 `ObservationReferenceRefreshScopeKind`

| 卡片项 | 独立契约 |
|---|---|
| variants / wire | 4 variants与§13.2 exact对应 |
| source / member | `ObservationReferenceRefreshScope::kind()` / tagged decode |
| invariant | 不单独充当job input或扩大scope |
| tests / stop | 4 mappings、payload mismatch；`pass_R06.2` |

## 21. R06.2 inventory 闭口矩阵

| inventory group | 本批结果 | authoritative evidence | 遗留 |
|---|---|---|---|
| `BodyFreeRef` primitive | pass | §5完整value/factory/member/validation/test卡 | 无 |
| 26个owned transparent identity | pass | §6逐类型独立卡 | repository uniqueness后续Step07/11承接，不改变shape |
| structured reference id / external safe ref | pass | §7共11个本地id + 7个安全ref独立卡 | 无 |
| tagged observation-side carrier | pass | §8五个tagged/narrow carrier | future domain ref若需加入variant必须在owning batch显式回灌 |
| reference metadata / support | pass | §9索引 + §18/§20逐类型停审卡 | 无未定义current helper |
| 11个structured reference | pass | §10逐对象字段/factory/member/state/invariant/test | `DiagnosticRequestContext`不是本组，仍由R06.4独立卡承接 |
| schema/family/digest | pass | §11七个独立卡 | canonical serializer material profile由R06.6/Step13受影响复审 |
| cursor/source version | pass | §12七个独立卡 | allocator/comparator trait仍属Step07/11，不在本批定义 |
| public scope | pass | §13两个独立卡 + kind卡 | downstream旧shape待传播 |
| visibility/degraded/adapter | pass | §14六个独立卡 | domain mapping由R06.3/R06.4闭口 |
| `ProtocolError` | pass | §15二十个finite variants、owner/mapping/redline | application/entry error仍由R06.6/R06.7 |
| 10个ref-set | pass | §16逐set member/order/dedup/empty/bound/wrong-kind卡 | owning object contextual invariant按registry批次闭口 |
| `HandoffSurface` / `JobReportSurface` | pass_excluded | §17；均为historical placeholder | canonical `ObservationJobReportSurface`回灌R06.6 |
| secondary carrier owner | pass_for_known_inventory | §19逐批unique owner registry | R06.8必须做修复后全文zero-unowned扫描 |

### 21.1 差异项裁定

| delta | R06.2 裁定 | 后续状态 |
|---|---|---|
| `R06-D02-STRUCTURED-REF` | 11个真正structured reference已恢复概要字段/状态/行为；`ObservationSourceVersionRef`另有独立卡 | `resolved_definition_R06.2`;Diagnostic context按原计划R06.4 |
| `R06-D03-CONSUMER-REF-SHAPE` | 两个consumer ref均为id/kind/scope/purpose-or-flag/state结构，不是wrapper | `resolved_definition_propagation_pending` |
| `R06-D04-MAINTENANCE-TARGET` | target已收敛为immutable id/kind/object/effect/no-write descriptor与四组一一对应compatibility matrix；旧state、maintenance ref和block reason均降为historical，execution lifecycle只归三个owning state object | `resolved_definition_reconciled_R06.4_propagation_pending` |
| `R06-D11-SUPPORT-TYPE` | contracts current support已逐类型闭口；其余known support已分配R06.3~R06.7唯一owner | `controlled_owner_registered`;R06.8前仍open |
| `R06-D12-ERROR-OWNER` | `ProtocolError`唯一owner/variants已闭口 | `contracts_resolved`;Application/Api/Worker/Job error待R06.6/R06.7 |

### 21.2 object qualification 终检

| 检查 | 结论 |
|---|---|
| 是否把名称以Ref结尾自动视为transparent | 否；§10多字段对象全部FC |
| 每个TC是否有独立heading、owner、mint/source、wire、禁止互换、test | pass；§6/§7 |
| 每个FC value/enum/set是否有独立heading | pass；§8/§10~§16/§18/§20 |
| 是否仍用family总表替代对象卡 | 否；§9 family表仅索引，明确由§20逐类型卡承接 |
| 是否存在raw String/Vec作为未校验public reference/set | 否；仅private validated inner或canonical bytes |
| 是否保存external/body/provider/locator/credential | 否；所有对象有body-free redline |
| 是否把Delivered/Completed解释成accepted/verdict/source repaired | 否；结构化state和report边界明确否定 |

## 22. 下游受影响传播清单

本节只登记 affected definition/use，不修改冻结文件。传播顺序必须等 Step 06 全批完成后执行，且每个后续 Step 仍需用户确认。

| affected location | 当前冲突 / use | 后续动作 | 最早允许时点 |
|---|---|---|---|
| 主控Step06修复前§7.4/§7.4-a | transparent consumer/maintenance、旧ProtocolError/sets/schema family | 整段降级historical repair input，current definition只指向本文件 | 本批立即回写主控标记 |
| Step06 `R06.3/R06.4` | 旧`ReferenceSnapshotRef`、generic object ref、support reason引用 | 使用canonical `ReferenceSnapshotStateRef`与§19 owner；不得重定义contracts类型 | 用户确认对应batch后 |
| Step06 `R06.5` | record subject仍写旧snapshot名，policy可能复制reason enum | 改canonical name并import本文件已定义reason；record/policy独立卡 | 用户确认R06.5后 |
| Step06 `R06.6` | job work key使用旧snapshot名；job/public report definition后置 | 改canonical ref；回灌`ObservationJobReportSurface`，不生成`JobReportSurface` | 用户确认R06.6后 |
| Step06 `R06.7` | entry carrier把structured target/consumer当opaque token的风险 | 保留完整typed carrier或明确只取具名id，不允许wrapper decode | 用户确认R06.7后 |
| Step08 protocol | 多处`ReferenceSnapshotRef`;consumer/maintenance DTO假定旧shape | 受影响协议逐卡改canonical type/field mapping；拒绝wrapper-only payload | Step06/07稳定且用户确认Step08后 |
| Step09 flow | handoff/export/maintenance函数按旧consumer/target参数理解 | load/validate canonical structured object，传播kind/object/effect/no-write guard；execution state另读owning object | Step08稳定后 |
| Step10 state | reference/handoff/maintenance state回指 | 只复审affected backref；不把contracts boundary state升级为external truth | Step09稳定后 |
| Step11 persistence | snapshot key/consumer key/maintenance key | canonical id + structured snapshot列/serialization；CAS/unique key不得hash猜测 | Step10稳定后 |
| Step13 idempotency | consumer/target参与token/digest；旧snapshot work key | digest纳入wrapper discriminator与structured immutable input；canonical ref rename | 下游影响审计时 |
| Step14 config/runtime | 当前validator只验证consumer inner BodyFreeRef，catalog key按transparent wrapper | config必须构造完整consumer object或引用完整validated catalog entry；key用id+kind，locator仍infra-only | 下游影响审计时 |
| formal `03` / `04` | formal03仍含R1 wrapper心智，04原Step01~10依赖旧formal | Step19重新装配后才同步formal03；随后对04做affected audit | Step06~18修复完成后 |

## 23. 本批自检、blocker 与停止点

| 自检项 | 结论 | 证据 / 限制 |
|---|---|---|
| 是否只写设计文档 | pass | 未实现代码、未创建实现仓文件 |
| 是否读取本批标准/上游/use site后再写 | pass | §1~§3输入与裁定 |
| 是否修改Step07~19/formal03/04 | pass_no_write | 这些文件只用于已允许反查，未修改 |
| 是否伪造commit/run/test/evidence/signoff | pass_none_created | 本文只列design test redlines，不声称测试已执行 |
| 外部上游blocker | none | current 00/01/02允许本批结构化设计 |
| 内部blocker | `03-RPR-S06-GRANULARITY=open` | historical D checkpoint：当时仍需R06.5-E~G及R06.6~R06.8；current见§26.4 |
| R06.2 gate | historical_pass_consumed | inventory/独立卡/support owner/downstream propagation已闭口，并已由后续R06.3/R06.4消费 |
| historical D gate | R06.5-D_done_waiting_user | 已由用户确认解除并被E批消费；current恢复点见§26.4 |
| historical next action | `wait_user_confirmation_before_R06.5-E` | 已消费，不再是current action |

### 23.1 R06.2 后续阅读清单（historical，已消费）

以下清单记录 R06.2 完成后曾经等待用户确认的 R06.3 输入；该确认已经发生，清单已经由 R06.3 消费，不再构成当前下一动作：

1. Step 06 SOP / 书写规范中 domain object、state、factory/member、字段来源条款。
2. 正式 `02` §6/§12 中 intake/safety/correlation/signal/audit/evidence 对象。
3. `02_hld_step_06_key_objects_truth_signal_audit.md` 及与这些对象直接相关的概要附录。
4. current Step05 domain owner、主控Step06 §6.5.1/§6.5.3、本文§19.3 registry。
5. Step08/09/10 对上述对象的definition/use，仅作反向缺口检查。

原R06.5-C/D/E/F阅读入口均已由用户确认并消费。current下一阅读入口只见R06.5专项§65.8、主控§6.13、flow与ledger；用户确认前不得读取或写入R06.5-G H8~H13，不得进入R06.6、Step07或任何`04`文件。

## 24. R06.5-C contracts affected-definition addendum

### 24.1 `EvidenceOriginResolution`

```rust
/// Finite body-free origin result returned by a trusted evidence resolver.
pub enum EvidenceOriginResolution {
    /// An authenticated mapper established a trusted body-free boundary origin.
    TrustedBoundary,
    /// The mapper explicitly classified the referenced material as a placeholder.
    Placeholder(PlaceholderReason),
    /// Current safe inputs cannot establish a trusted origin.
    Insufficient(AuthenticityGapReason),
}
```

| contract item | exact rule |
|---|---|
| owner / qualification | `contracts::metadata FC@R06.5-C`；resolver-facing finite result，不是domain state、decision、authorization或public command input |
| producer | authenticated `GovernanceArtifactEvidenceResolver` mapper或其contract fake；`TrustedBoundary`只能在mapper已验证typed boundary identity/family/state/snapshot/digest后返回 |
| variants / token | `trusted_boundary`；tagged `placeholder` + exact `PlaceholderReason`；tagged `insufficient` + exact `AuthenticityGapReason`；无Unknown/Other/string fallback |
| consumer | `EvidenceSafeSummary.origin_resolution` -> application `EvidenceOriginAssessment::from_resolver_mapping` -> P6；不能直接写`AuthenticityHint.evidence_origin` |
| placeholder source | explicit fixture/synthetic/reference classifier；不能从provider message、URI/path、name pattern或missing default猜测 |
| insufficient source | safe unresolved/not-visible/stale/gap basis；不得把Unavailable或missing field默认升级为TrustedBoundary |
| body-free | 不携带body、hash of discarded body、locator、credential、provider/product、actor、run id、evidence alias、verdict或signoff |
| construction boundary | contracts类型可供resolver adapter/fake表达结果，但entry/Command/config不得暴露同名可写字段；P6还必须复核complete linkage/boundary/digest snapshot，不能只信任variant |

`EvidenceOriginResolution`与`EvidenceOriginKind`不是同义类型。前者是一次resolver调用的input-side finite result，包含Placeholder/Insufficient分类；后者只保存`AuthenticityHint`已接受的origin state，目前只有`TrustedBoundary`可进入`RealEvidenceLinked`。两者不得建立generic `From`：application必须先把resolver result绑定到一个complete linkage snapshot，P6再在visibility/freshness/gap gate之后产生target-bound decision。

### 24.2 resolver result shape 与 frozen affected use

冻结Step07中的`EvidenceSafeSummary`必须在后续affected review增加：

```rust
pub struct EvidenceSafeSummary {
    // Existing body-free boundary reference and digest fields remain unchanged.
    pub origin_resolution: EvidenceOriginResolution,
}
```

本节只固定字段type/source，不修改冻结Step07。若`SafeResolution<EvidenceSafeSummary>`本身为NotVisible/Stale/Unresolved/Unavailable，则application不得伪造inner summary或`origin_resolution`；只有Resolved safe summary携带该字段。Resolved + `Insufficient(...)`是合法组合，表示boundary summary可读取但origin basis仍不足。Resolved + `Placeholder(...)`也不意味着Visible或handoff-ready，P6仍先执行visibility/freshness/gap gate。

冻结Step08 `EvaluateAuthenticityHintRequest.evidence_origin: EvidenceOriginKind`是affected historical material，后续逐协议重组必须删除。Command只能携带用于定位handoff/input的typed refs和既有request context；origin来自resolver result，不能由caller、config default、stored command replay payload或policy material提供。冻结Step09/13中把`evidence_origin`纳入command flow/idempotency digest的形态同样待后续传播，不在C批修改。

### 24.3 factory、decode 与 planned test redlines

contracts decode只接受三个exact tagged形态；unknown token、wrong payload、placeholder无reason、insufficient无reason、trusted携带payload均返回`ProtocolError`，不得default。P6 domain mapping的relation/snapshot错误返回`DomainError`，两层错误不得互换。

planned tests覆盖：三个variant round-trip、payload totality、unknown/case/alias拒绝、Resolved+Insufficient、outer NotVisible时无inner result、command/config schema absence、`EvidenceOriginKind`无generic conversion、TrustedBoundary仍被visibility/stale/open-gap阻断，以及Debug/serialization无body/locator/credential/provider/run id/alias/verdict/signoff。上述均为测试设计，不表示已实现或运行。

### 24.4 owner 与 checkpoint审计

| check | conclusion |
|---|---|
| `EvidenceOriginResolution`唯一definition owner | `contracts::metadata`；R06.5专项§26只引用，不复制type |
| `AdmissionDecision`唯一owner | `domain::intake`；P1位于`domain::policies`但不是decision owner |
| contracts -> domain dependency | none；enum只依赖既有contracts reason type |
| caller-supplied authenticity origin | forbidden；冻结Step08字段已登记affected，尚未修改 |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；仍需R06.5-D~G及R06.6~R06.8 |
| historical checkpoint | `R06.5-C_done_waiting_user`；已由D批消费 |
| historical pointer | 当时停审点见§27；现行指针见§28、主控§6.14、flow与ledger |

## 25. R06.5-D contracts affected owner registry

D批不把policy material、complete domain snapshot或target-bound decision提升为public contracts。contracts层有三个existing schema group发生增量：`HandoffBlockReason`增加`InputNotFresh`与`RetentionBoundary`；`VisibilitySurface::Blocked`允许guard-only场景不携带伪造gap；`DegradedReason/DegradedSurface`增加lossless reason并闭合reason/gap矩阵。其余变更均为既有contracts carrier的exact reuse或domain owner登记。

### 25.1 affected contracts type

| type | current exact shape / source | consumer | invariant / stop |
|---|---|---|---|
| `HandoffBlockReason` | `ConsumerUnavailable`;`VisibilityBlocked`;`EvidenceGap`;`InputNotFresh`;`RetentionBoundary`;`NoWriteGuardBlocked`；owner仍为`contracts::metadata` | P7 `HandoffReadinessDecision`、`ReportHandoffRecord`与后续H4 record | `EvidenceGap`要求真实open gap；`InputNotFresh`不造gap；`RetentionBoundary`不声明cleanup/archive/report verdict；six exact tokens，无Other/string/default |
| `VisibilitySurface` | `blocked(gap_ref: Option<GapStateRef>)`；Blocked body始终absent、degraded=None | P7/P11/P14 public surface mapping | no-write/retention等guard-only block允许None；真实gap存在时保留Some；NotVisible仍必须Some；public surface不携带internal `ReadBlockReason` |
| `DegradedReason` / `DegradedSurface` | 增加`MissingMaterial`、`VisibilityLimited`、`AuthenticityLimited`；gap matrix按reason total | P7/P11及后续P13/P14 public limited surface | Missing/Unresolved/NotVisible不互换；restricted与authenticity limitation不伪装safety；optional-gap reason不得制造gap |

`ReadBlockReason`已在R06.4以五个variant闭口并包含`RetentionBoundary`，D批只复用，不新增或改名。`ReplayBlockReason`、`RetentionReleaseReason`、`ProtectionConflictReason`、`GapKind`、`VisibilitySurface`、`ObservationProjectionFreshnessSurface`、各typed ref/set/scope同样保持原canonical declaration。

### 25.2 D批 domain owner registry

| carrier group | unique owner / physical owner | contracts relation | duplicate-prevention gate |
|---|---|---|---|
| six concrete policies and finite material | `domain::policies` / planned `domain/src/policies.rs` | import contracts enum/ref/surface only | contracts不得定义policy、rule body、policy id或decision |
| P7 handoff snapshots/input | `domain::handoff` / planned `report_handoff.rs` | reuse handoff/input/hint/gap/consumer refs and states | no public DTO/serde constructor；committed proof不能变bool |
| P8 retention/protection snapshots | `domain::retention` / planned `retention_replay.rs` | reuse structured consumer refs、marker/protection refs/states/reasons | no ref/state-only release carrier in contracts |
| P9 scope/per-target boundary snapshots | `domain::replay` / planned `retention_replay.rs` | reuse replay target/effect/set and boundary states | no scope-wide global retention/protection summary carrier |
| P10 no-write target/effect/decision | `domain::no_write` / planned `no_write.rs` | reuse trigger/forbidden target refs and guard scope | local target不得编码成`ForbiddenWriteTargetRef`；no public pass bool |
| P11 read input/decision support | `domain::read` / planned `read_diagnostic.rs` | reuse request/scope/target/view/freshness/gap contracts | Query one-shot input不进入request DTO或persistence |
| P12 gap basis/decision support | `domain::gap` / planned `gap_degraded.rs` | reuse gap source/state/kind and affected object ref | no caller bare gap kind、error message classifier或default kind |

### 25.3 reused decision owner registry

| decision | canonical declaration owner | producer | contracts exposure |
|---|---|---|---|
| `HandoffReadinessDecision` | R06.4 `domain::handoff` | P7 | none；public output只映射已有surface/reason/ref |
| `ActiveProtectionReleaseDecision`;`RetentionMarkerDecision` | R06.4 `domain::retention` | P8 two-stage | none；不作为cleanup/archive token |
| `ReplayApprovalSnapshot` | R06.4 `domain::replay` | P9 | none；不作为job/public approval DTO |
| `ReadVisibilityDecision` | R06.4 `domain::read` | P11 | none；response assembler映射existing public surface |
| `NoWriteGuardDecision` | R06.5-D `domain::no_write` | P10 | none；Blocked不暴露policy material |
| `GapClassificationDecision` | R06.5-D `domain::gap` | P12 | none；public gap view只读取persisted `GapState` |

上述decision全部依赖完整domain snapshot与`PolicyEvaluationBasis`，因此不能放入contracts，否则会形成contracts -> domain反向依赖或让entry构造内部policy truth。protocol只传定位/选择所需的既有typed ref、scope和request metadata；application负责trusted load并构造complete snapshot。

### 25.4 D批 owner / dependency / checkpoint审计

| check | conclusion |
|---|---|
| D批new explicit types | 77，全部有唯一domain owner；contracts没有复制声明 |
| existing decision extensions | 5，canonical declaration仍只见R06.4 owning module |
| contracts schema extension | 3 existing groups：`HandoffBlockReason`增加`InputNotFresh`与`RetentionBoundary`；`VisibilitySurface::Blocked`允许optional gap；`DegradedReason/Surface`增加三种lossless reason及total gap matrix |
| domain enum extension | 1 existing enum：`ActiveProtectionReleaseOutcome::Protected`；normal active consumer不再伪装Conflict |
| contracts -> domain dependency | none；contracts只保留自身finite carrier |
| public caller policy assertion | forbidden；P7~P12 complete input均由application trusted load组装 |
| Query durable carrier | none current；P11 decision/process context不进入public stored DTO |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；historical D checkpoint，current见§26.4 |
| historical checkpoint | `R06.5-D_done_waiting_user`；已由E批消费 |
| historical next allowed | 等待用户确认后只进入R06.5-E；已消费，不再是current action |

## 26. R06.5-E contracts affected owner registry

E批只改变一个existing public finite carrier：`PeripheralBlockReason`由四variant扩展为六variant。其余P13~P18 policy material、complete input snapshot、target-bound decision、authorization和transition均属于domain owning module，不进入contracts，也不获得public DTO/serde constructor。

### 26.1 affected contracts type / token gate

| type | current exact shape | exact producer / consumer | redline |
|---|---|---|---|
| `PeripheralBlockReason` | `ExportForbidden`;`ConsumerUnavailable`;`VisibilityBlocked`;`EvidenceGap`;`RetentionHoldActive`;`NoWriteGuardBlocked`；exact lowercase snake_case tokens见§20.34 | producer仅P14；consumer为`PeripheralDeliveryDecision/State`、H9后续record与public safe mapping | adapter result/provider error不能造reason；EvidenceGap必须有真实gap；RetentionHoldActive不表示cleanup/archive；无Other/string/default |

`ExportBlockReason`与`PeripheralBlockReason`保持两个不同finite enum：前者用于preparation readiness，后者用于delivery attempt，不能建立generic conversion。P14必须按各入口显式映射，不能把相同variant名当成同一个owner type。

### 26.2 E批 domain owner / contracts exposure registry

| E-batch carrier group | canonical owner | contracts relation | duplicate-prevention gate |
|---|---|---|---|
| P13 target/safety/visibility/gap snapshots、decision | `domain::gap` | 复用affected-object/scope/gap/safety/visibility carrier | decision与complete snapshot不进入public query DTO；Query无durable sidecar |
| P14 preparation/delivery snapshots、existing decisions | `domain::peripheral` | 复用consumer/view/input/gap/retention/no-write carrier及本节reason | 两个decision不互转；adapter result不是policy result |
| P15 snapshot/result/version input、decision | `domain::reference` | 复用reference subject/state/result/version/target refs | record/result不等于decision；无wall-clock freshness token |
| P16 safe-output snapshot | `domain::reference`；policy归`domain::policies` | 复用`AdapterFamily`及body-free safe refs | structural success不暴露marker/status/proof/authorization |
| P17 target/scope/dependency/input/decision/authorization | `domain::maintenance`；policy归`domain::policies` | 复用`MaintenanceTargetRef/Kind/AllowedEffect`、scope与guard | `MaintenanceExecutionAuthorization`唯一owner为maintenance；contracts不提供bare authorization DTO |
| P18 coordination/scope/current-boundary input、decision | `domain::replay`；policy归`domain::policies` | 复用replay target/effect/reason/ref和maintenance authorization字段 | one target per decision；contracts不提供scope-wide execution result |

contracts不得定义`DegradedOutputDecision`、`ReferenceFreshnessDecision`、`DerivedMaintenanceDecision`、`ReplayCoordinationDecision`、`*PolicyRuleSet`或complete domain snapshot。否则会形成contracts -> domain反向依赖并允许entry/config构造内部policy truth。

### 26.3 effect enum namespace audit

| canonical enum | exact token relevant to scan | owner / use | no-alias ruling |
|---|---|---|---|
| `MaintenanceAllowedEffect` | `ScanGap/scan_gap` | immutable maintenance target与P17 derived-maintenance pair | 不改名为`ScanObservationGap`，不由replay enum转换 |
| `ReplayAllowedEffect` | `ScanObservationGap/scan_observation_gap` | replay scope/target与P9/P18 replay pair | 不改名为`ScanGap`，不由maintenance enum转换 |

二者语义相关但owner、wire token与target descriptor不同。P17/P18 application assembly必须按exact target kind逐分支检查并显式映射，不生成type alias、generic `From`、string token fallback或同名第三enum。

### 26.4 owner / dependency / checkpoint audit

| check | conclusion |
|---|---|
| E批new explicit domain types | 66；全部由R06.5专项§53登记唯一owner，contracts不复制 |
| existing contracts extension | 1：`PeripheralBlockReason`增加`EvidenceGap`、`RetentionHoldActive`，现为六variant |
| contracts -> domain dependency | none |
| public caller policy assertion | forbidden；only existing selector/ref/scope/request metadata可进入protocol |
| authorization public carrier | none；`MaintenanceExecutionAuthorization`仅是domain decision内嵌值 |
| external upstream blocker | none |
| internal blocker at E checkpoint | `03-RPR-S06-GRANULARITY=open`；当时P1~P18已闭口，仍需H1~H13及R06.6~R06.8 |
| historical checkpoint | `R06.5-E_done_waiting_user`；已由F批消费 |
| historical next allowed | 只进入`R06.5-F H1~H7`；已消费，不再是current action |

## 27. R06.5-F contracts affected audit 与 historical pointer（已由G批消费）

F批H1~H7没有新增或扩展public contracts schema。七个record identity继续复用B批已经闭口的`IntakeDecisionRecordRef`、`CorrelationLinkRecordRef`、`AuditAppendRecordRef`、`HandoffLifecycleRecordRef`、`RetentionChangeRecordRef`、`NoWriteViolationRecordRef`与`ReadAccessRecordRef`；subject、state、reason、set、cursor及body-free ref同样复用R06.2/R06.3/R06.4 canonical type。F批67个record-internal type、accepted input、revision、change和validated rehydrate均归domain owning module，不得复制进contracts。

| check | conclusion |
|---|---|
| record identity | seven exact typed refs already closed；无`*RecordId` alias、generic record ref或digest/cursor-derived identity |
| metadata cursor | 复用`ObservationCommittedCursor::Observation`；F批没有新增record cursor或intra-UoW ordinal type |
| H7 phase boundary | `ReadAccessRecordRef`存在不授权writer；current synchronous Query仍不能mint、persist或append H7 |
| public protocol exposure | accepted input、before/change/after revision、policy basis与rehydrate不进入DTO/event/job/query contracts |
| contracts -> domain dependency | none；F批record只从domain依赖contracts canonical carrier |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；H1~H7已闭口，仍需H8~H13及R06.6~R06.8 |
| historical checkpoint | `R06.5-F_done_waiting_user`；已由G批消费 |
| historical next allowed | 当时只进入R06.5-G；不再是current action |

## 28. R06.5-G contracts affected audit 与 current pointer

G批没有新增或扩展public contracts schema。H8~H13继续复用本专项已经闭口的13个typed record ref、`ObservationRecordMetadata<R>`、origin/visibility/cursor与canonical body-free carrier；62个G record-internal type、accepted input、revision、change和validated rehydrate均归Step06 `domain::records` logical owner，不进入contracts，也不产生`*RecordId` alias。

| check | conclusion |
|---|---|
| record identity | 13 exact typed refs remain canonical；H8~H13只消费已有 refs，无generic record ref或Id/Ref双类型 |
| metadata / cursor | 继续使用 `ObservationCommittedCursor::Observation`；H11 coverage cursors与H12/H13 scope/target refs不升级为contracts cursor或job identity |
| public protocol exposure | G accepted input、before/change/after revision、policy basis、creation proof和rehydrate不进入DTO/event/job/query contracts |
| H12 boundary | `GapScanAcceptedItemResult`是G批 reservation-only carrier；R06.6可兼容消费或通过affected review替换，G不预写job/item schema |
| duplicate owner | none；contracts保留ref/metadata/value owner，domain records保留concrete record owner |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；G已被R06.6输入审查消费，Step06仍需R06.6-A~F、R06.7~R06.8与后续受影响审计 |
| historical checkpoint | `R06.5-G_done_waiting_user` |
| historical next allowed | 读取R06.6输入；该动作与A/B/C、D-1/D-2均已完成；当前指针为`R06.6-D2_done_waiting_user` |
| commit | 当前不需要提交 |

## 29. R06.6-B outbox public identity affected definition 与 current pointer

B 批审计发现 Step 08 public Command result、Consumer receipt、Outbound Event 与 Operations Job surface 直接使用 outbox/dead-letter identities。若这些类型定义在 `application::outbox`，则 `contracts` 必须反向依赖 application，违反固定依赖方向 `contracts <- domain <- application`。因此四个透明 identity 的 canonical value declaration 上提至 `contracts::refs`；application 只拥有 typed id generation 和 owning object relation。

### 29.1 Four canonical transparent identities

```rust
/// Body-free identity of one durable outbound publication marker.
#[repr(transparent)]
pub struct OutboxRecordRef(BodyFreeRef);

/// Body-free identity of one immutable stored outbound payload snapshot.
#[repr(transparent)]
pub struct OutboxPayloadSnapshotRef(BodyFreeRef);

/// Body-free identity of one outbound event captured by an accepted change.
#[repr(transparent)]
pub struct OutboundEventRef(BodyFreeRef);

/// Body-free identity of one local dead-letter classification.
#[repr(transparent)]
pub struct DeadLetterRef(BodyFreeRef);
```

四个类型全部复用 §4.1 的 contracts `TC` 模板：`new/as_body_free_ref/into_body_free_ref`、wrapper discriminator 参与 canonical digest、exact opaque wire、redacted `Debug`、无 `Display`、无跨 wrapper `From`。它们不在 application 文件中重复声明。

### 29.2 Owner, mint and use matrix

| type | canonical value owner | sole mint source | public use | application use | forbidden merge |
|---|---|---|---|---|---|
| `OutboxRecordRef` | `contracts::refs` | `IdGeneratorPort.new_outbox_record_ref()` | Command result、publication Job input/report | record PK、work key、publication token | event/snapshot/job execution ref |
| `OutboxPayloadSnapshotRef` | `contracts::refs` | `IdGeneratorPort.new_outbox_payload_snapshot_ref()` | protocol stored snapshot surface | immutable application snapshot identity | record/event/dead-letter ref |
| `OutboundEventRef` | `contracts::refs` | `IdGeneratorPort.new_outbound_event_ref()` | outbound envelope/snapshot | receipt/failure/snapshot/record/token | transport message id、topic、attempt id |
| `DeadLetterRef` | `contracts::refs` | `IdGeneratorPort.new_dead_letter_ref()` at accepted classification | Consumer receipt and later operations surface | outbox terminal marker and worker result mapping | queue/provider row、payload archive、receipt ref |

contracts constructor validates only the already parsed `BodyFreeRef`; it neither generates identities nor verifies repository existence. Application id generation is the only creation authority for new local values. Protocol/persistence decode may rehydrate existing values through the same contracts wrapper without calling application. A ref's public availability does not transfer lifecycle or truth ownership out of the owning application object.

### 29.3 Historical checkpoint audit consumed by C

| check | conclusion |
|---|---|
| contracts -> application dependency | none；四个 ref canonical declaration 位于低依赖 contracts |
| duplicate Rust declaration | forbidden；B 文件的 code blocks只记录 application mint/use shape，不产生第二 owner |
| public protocol construction | decoder validates opaque body-free token only；caller不能 mint authoritative local object existence |
| application mint authority | retained；四个 exact `IdGeneratorPort` methods remain the only new-value source |
| dead-letter truth | ref only identifies classification；finite `DeadLetterReason` and lifecycle remain durable application state |
| external upstream blocker | none |
| historical checkpoint | `R06.6-B_done_waiting_user`; 已由用户确认并被 C 批消费 |
| historical next allowed | 当时仅允许进入 `R06.6-C`; 不再是 current action |
| commit | not required |

## 30. R06.6-C handoff preparation public identity affected definition 与 current pointer

C 批发现 frozen Step 08 的 public `PrepareReportHandoffDeliveryJobOutput` 和 application `HandoffDeliveryToken` 都引用 `HandoffDeliveryPreparationRef`。若该 ref 定义在 `application::external_effects`，public contracts 将产生 `contracts -> application` 反向依赖；若只使用裸 `BodyFreeRef`，则 preparation、handoff、intent、receipt identity 可被误换。因此 canonical value declaration 位于 `contracts::refs`，application 只拥有 result validation、new-value path 和 lifecycle relation。

### 30.1 Canonical transparent identity

```rust
/// Body-free identity of one exact report-handoff preparation returned by the delivery boundary.
#[repr(transparent)]
pub struct HandoffDeliveryPreparationRef(BodyFreeRef);
```

该类型复用 §4.1 contracts `TC` 模板：`new/as_body_free_ref/into_body_free_ref`、wrapper discriminator 参与 canonical digest、exact opaque wire、redacted `Debug`、无 `Display`、无跨 wrapper `From`。contracts constructor 只校验已解析的 `BodyFreeRef`，不访问 adapter/repository，不证明 preparation 存在，也不裁决 handoff lifecycle。

### 30.2 Owner, mint and use matrix

| type | canonical value owner | accepted new-value source | public use | application use | forbidden merge |
|---|---|---|---|---|---|
| `HandoffDeliveryPreparationRef` | `contracts::refs` | validated `ReportHandoffDeliveryPort.prepare_handoff` / exact positive probe mapper；若 adapter family requires local generation, only typed application id-generator path may supply it | `PrepareReportHandoffDeliveryJobOutput` body-free preparation identity | `HandoffDeliveryPreparation.preparation_ref`;`HandoffDeliveryToken.preparation_ref`; persistence/probe compatibility | handoff ref、intent ref、receipt ref、provider run/locator、signoff/evidence alias |

Public decode validates wrapper shape only. Application must load the matching committed preparation intent and verify source-token equality before accepting or exposing the ref. Another intent cannot adopt an existing preparation ref by value alone.

### 30.3 Current checkpoint audit

| check | conclusion |
|---|---|
| contracts -> application dependency | none; canonical transparent value remains in low-dependency contracts |
| duplicate owner | none; C specialty records the same canonical declaration and application mint/use card, not a second Rust owner |
| public truth boundary | ref exposes identity only; no preparation body, provider response, acceptance, verdict or signoff |
| application lifecycle owner | retained; exact source token/result compatibility and local handoff finalize remain application/domain responsibilities |
| external upstream blocker | none |
| current checkpoint | `R06.6-D2_done_waiting_user` |
| next allowed | wait for explicit user confirmation before reading/writing `R06.6-D3` |
| commit | not required |

## 31. R06.6-F2 contracts affected-definition and current pointer

F2 does not add a public record envelope, generic history ref, UoW classifier or application assembly type to `contracts`. The only canonical contracts change is the value-semantics amendment in §§12.1~12.3. All H-family refs remain the exact transparent identities registered by R06.5-B, and application retains typed mint authority.

| contracts surface | current F2 conclusion | forbidden substitute |
|---|---|---|
| concrete cursor values | `ObservationCursor` and `ReferenceCursor` are `Clone + Copy + Ord` within their own namespace | shared untagged cursor alias |
| tagged committed cursor | `ObservationCommittedCursor` is `Clone + Copy + Eq + Hash`, with no `Ord`/`PartialOrd` | numeric cross-namespace sort or retagging |
| H1~H6/H8~H13 identities | exact typed refs only; equal inner bytes across wrappers remain different typed identities | `BodyFreeRef`-only record key or `new_history_record_ref()` |
| H7 identity | declaration remains phase-reserved; current writer/mint/append is absent | configuration-activated H7 writer |
| application helper exposure | none; obligation, footprint, batch, follower and prepared commit stay crate-private application types | contracts -> application dependency or public serde form |
| protocol cursor use | tagged cursor must be copied losslessly into the deterministic outbound snapshot | adapter/database default or source-version substitute |
| truth boundary | cursor and typed refs identify local observation/audit projection facts only | business/source truth, external acceptance, verdict, signoff, real run identity or evidence alias |

| checkpoint item | status |
|---|---|
| F2 contracts definition | `pass_design_only` |
| duplicate owner introduced | no |
| direct upstream blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`; no contracts schema is changed to conceal it |
| downstream affected use | Step 07 exact typed mint methods and Step 08 tagged encoder remain `open_controlled_downstream` |
| current pointer | `R06.6-F2_done_waiting_user_before_R06.7` |
| next allowed | wait for explicit user confirmation before R06.7 |
| commit | not required |
