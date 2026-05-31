# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 8 中间产物。
> 本步只收稳 API / Command / Query / Inbound Event / Outbound Event / Operations Job 的协议形态、DTO schema、字段映射、错误映射、幂等和审计要求。
> 本步不写逐接口函数级处理流，不写事务伪代码，不写持久化结构，不实现 HTTP server、bus runtime 或 public registry 发布。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-sdk/03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `projects/L0-sdk/02-概要设计.md` §7 | 已确认 Command、Query、Inbound Event、Outbound Event、Operations Job 骨架 | 作为协议清单和边界输入 |
| `03_ddd_step_04_units_file_layout.md` | 已确认 `crates/contracts/src/{commands,queries,events,jobs}.rs`、`crates/client`、`crates/cli`、`crates/jobs` | 作为 DTO、Rust client method、CLI command 和 job binary 落点 |
| `03_ddd_step_05_module_contracts_axis.md` | 已确认 `contracts`、`application_services`、`rust_client_facade`、`cli_entry`、`jobs` 的分工 | 作为调用方 / 处理方归属依据 |
| `03_ddd_step_06_object_contracts.md` | 已确认 domain 对象、状态 enum、Rust client facade 对象和 application service 主语 | 作为 DTO 字段映射和构造闭环来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已确认 repository、source、boundary、runner、artifact、projection、outbox port | 作为协议处理方和后续 Step 9 处理流输入 |
| `projects/L0-sdk/01-架构设计.md` | 已确认 SDK 不提供 P0 常驻 HTTP server，不做 auth / governance，不拥有 core / bus / service truth | 决定 P0 同步入口采用 Rust DTO / Rust client method / CLI command，而非 HTTP route |
| `standards/document/详细设计书写规范.md` §5.7 | 要求协议总表、单协议小节、schema、错误映射、幂等审计、字段闭环 | 作为本步输出格式依据 |

已确认结论：

```text
L0-sdk P0 不实现常驻 HTTP / RPC server。
同步入口采用 Rust DTO + Rust client facade / CLI command。
Outbound Event 采用 event topic + outbox payload。
Operations Job 采用 job binary + JSON input / output。
所有协议字段必须能映射到 Step 6 对象字段、Step 7 port 输入、系统生成字段或上游 snapshot/ref。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮 P0 实现范围和非范围。
Step 3 已确认编码、runtime、仓库、提交和安全边界约束。
Step 4 已确认 workspace 多 crate、三语言 package 目录和文件布局。
Step 5 已确认模块实现契约主轴和依赖方向。
Step 6 已确认对象实现契约、状态 enum 和 Rust client facade 对象。
Step 7 已确认 Trait / Port / Adapter 契约。
```

---

## 3. SOP 问题回答

### 3.1 本轮需要定义哪些 API / Command / Query / Event / Job？

| 类别 | 协议 |
|---|---|
| Command API | `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi` |
| Query API | `GetSdkCapabilitySummary`、`GetUpstreamVersionRefs`、`GetSnapshotFreshness`、`GetServiceClientView`、`GetEventClientView`、`ReadServiceCapability`、`OpenEventSubscription`、`GetPackageCandidateStatus`、`GetVerificationEvidence`、`GetCompatibilityDecision`、`ListDeprecatedApis`、`GetMigrationGuideRef` |
| Inbound Event Consumer | `ConsumeCoreContractChanged`、`ConsumeBusSemanticChanged`、`ConsumeFormalApiChanged`、`ConsumeValidationRunFinished` |
| Outbound Event | `SdkSemanticBaselineChangedEvent`、`SdkSnapshotFreshnessChangedEvent`、`PackageCandidateGeneratedEvent`、`VerificationEvidenceRecordedEvent`、`CompatibilityDecisionRecordedEvent`、`DeprecatedApiRecordedEvent` |
| Operations Job | `CheckUpstreamFreshness`、`GeneratePackageCandidate`、`BuildLanguagePackages`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`CheckCompatibility`、`VerifyBoundaryPolicies`、`RebuildSdkProjections` |

### 3.2 每个协议的调用方、处理方、传输方式是什么？

本步在 §7.1 协议总表中统一列出。P0 传输方式按以下规则收敛：

| 协议类别 | P0 传输方式 | 说明 |
|---|---|---|
| Command API | Rust DTO + Rust client method / CLI command | SDK 不是 P0 online service；HTTP route 不在本仓 P0 |
| Query API | Rust DTO + Rust client method / CLI command | 只读查询，不改写真相，不触发 refresh |
| Inbound Event Consumer | event bus topic 或 source envelope | 只消费上游变化或验证结果，不复制上游正文 |
| Outbound Event | event topic + outbox payload | 只发布 SDK 已提交维护事实或验证事实 |
| Operations Job | job binary + JSON input / output | 本地维护、生成、验证、兼容和 projection rebuild |

### 3.3 外部接口使用 HTTP、RPC、event bus 还是其他方式？

| 交互 | 本轮选择 | 未采用项 | 原因 |
|---|---|---|---|
| Rust developer-facing 调用 | Rust client method + Rust DTO | HTTP server / gRPC server | P0 SDK 是 client facade，不是 server gateway |
| 本地维护操作 | CLI command + JSON input | 常驻 worker / online ops API | P0 使用受控本地维护入口 |
| 上游变化消费 | event bus topic 或 source envelope | 直接依赖上游实现仓源码 | 保持 source / event 边界 |
| 事实发布 | SDK outbox + event topic | SDK 自己实现 bus runtime | bus runtime truth 归 `L0-bus` |
| 后台任务 | job binary + JSON input / output | public registry publisher | P0 只做本地 candidate 和 evidence 闭环 |

### 3.4 请求、响应、事件或 job 输入输出 schema 是什么？

本步在 §7.3~§7.7 中按协议给出 JSON 示例。Rust DTO 应落在：

| 类别 | Rust 文件 |
|---|---|
| Command DTO / Result DTO | `crates/contracts/src/commands.rs` |
| Query DTO / View DTO | `crates/contracts/src/queries.rs` |
| Inbound / Outbound Event DTO | `crates/contracts/src/events.rs` |
| Job input / output DTO | `crates/contracts/src/jobs.rs` |
| Public client method wrapper | `crates/client/src/*.rs` |

### 3.5 每个输入契约会构造或影响哪些 Domain 对象？

回答：见每个协议小节中的“字段来源与构造闭环表”。本步重点检查目标对象必填字段是否能从输入、系统生成、repository lookup、source snapshot 或 runner result 中获得。

### 3.6 目标对象的必填字段是否全部能从输入、派生、查表或系统生成中获得？

回答：当前推荐协议均能构造目标对象。对需要派生的字段，本步统一写明来源：

| 字段类别 | 来源 |
|---|---|
| `*_id` | `IdGeneratorPort` 或 repository 中已有对象 |
| `actor` / `trace` | `ActorContext` / `ClientCallContext` |
| `version` / `snapshot` / `digest` | source port、artifact store 或 repository |
| `freshness_state` / `support_state` / `candidate_status` | domain method 派生 |
| `evidence_result` / `redaction_status` | runner result + policy verifier result |
| `outbox_event_id` | `IdGeneratorPort` |

### 3.7 哪些字段名相近但语义不同，不得混同？

| 字段 A | 字段 B | 不得混同原因 |
|---|---|---|
| `core_contract_ref` | `core_snapshot_ref` | 前者指契约定义引用，后者指某次 snapshot 引用 |
| `bus_semantic_ref` | `bus_event_ref` | 前者指 bus 语义版本，后者指具体事件发布引用 |
| `formal_api_ref` | `service_capability_ref` | 前者指 formal API 契约，后者指 SDK 暴露的服务能力引用 |
| `payload_ref` | `payload_digest` | 前者是外部 payload 引用，后者是摘要 |
| `artifact_ref` | `document_ref` | 前者指构建产物，后者指文档或迁移说明 |
| `fake_boundary_ref` | `formal_api_ref` | fake 目标不能伪装成正式 API |
| `evidence_id` | `diagnostic_ref` | evidence 是 SDK 本地验证事实，diagnostic ref 是外部诊断引用 |

### 3.8 字段缺失时是 reject、derive、lookup、retry、dead-letter 还是暂停处理？

| 场景 | 行为 |
|---|---|
| command 必填字段缺失 | reject，返回 `ValidationError` |
| query 必填 ID 缺失 | reject，返回 `ValidationError` |
| repository lookup 不存在 | 返回 `NotFoundError` 或空 page |
| source snapshot 暂不可用 | retryable `DependencyError`，job 可重试 |
| runner 暂不可用 | retryable `RunnerError`，job 可重试 |
| fake marker 缺失 | reject，返回 `BoundaryViolationError` |
| raw secret / body 试图进入协议 | reject，返回 `BoundaryViolationError` |
| event consumer 缺失上游 ref | reject 或 dead-letter 到上游消费错误记录，不能派生 |

### 3.9 每个协议失败时映射成什么错误？

见 §7.2 公共错误映射。每个协议小节只列出特殊错误，不重复公共错误表。

### 3.10 哪些协议需要幂等键或审计记录？

| 协议类别 | 幂等要求 | 审计要求 |
|---|---|---|
| Command API | 必须携带 `IdempotencyKey` | 写路径必须写审计或 outbox fact |
| Query API | 不需要幂等键 | 不写审计，只保留 trace context |
| Inbound Event Consumer | 必须携带 `event_id + source_ref + idempotency_key` | 消费成功、拒绝或失败必须有处理记录 |
| Outbound Event | 使用 `event_id`、source fact ref 和 outbox id | 发布记录必须可追踪 |
| Operations Job | 必须携带 `job_run_id`，写路径 job 还需幂等键 | job summary 和 evidence 必须可追踪 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧版 `03-详细设计.md` | 仍围绕 binding / wrapper / subscription / release 等旧协议 | 无法支撑新版 official client access、candidate evidence 和 compatibility 主线 | 不沿用旧协议名 |
| `02-概要设计.md` §7 | 只有输入输出骨架，没有 DTO 字段、method、topic、job input | 实现者无法直接写 contracts crate | 本步补齐协议字段和 schema 示例 |
| Step 6 对象契约 | 对象字段已经固定，但协议字段尚未映射 | 可能出现 DTO 无法构造目标对象 | 本步加入字段来源与构造闭环 |
| Step 7 port 契约 | port 已固定，但协议如何触发 port 还未说明 | Step 9 缺少入口输入 | 本步给出处理方和后续处理流需求 |
| Rust client facade | 容易被误解成 HTTP server API | 可能多建 `crates/api` 或 online server | 本步明确 P0 是 Rust DTO / Rust client method / CLI command |
| event / outbox | outbound event 可能携带正文或 secret | 破坏边界与安全策略 | 本步所有 event 只传 ref、status、digest 和 summary |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 同步接口 | 概要称 Command / Query API，未固定传输形态 | P0 固定为 Rust DTO + Rust client method / CLI command | SDK 不是 online server |
| 协议字段 | 只有输入输出名称 | 每个协议有 JSON 示例、字段映射和构造闭环 | 支撑 contracts crate 实现 |
| event | 只有事件名 | 每个 event 有 topic、payload、版本策略和幂等来源 | 支撑 outbox 和 bus 边界 |
| job | 只有 job 名 | 每个 job 有 binary、input、output、幂等和审计要求 | 支撑 `crates/jobs` 实现 |
| 错误 | 只在边界描述中出现 | 统一 `SdkProtocolError` / `SdkErrorEnvelope` 映射 | 支撑入口层一致处理 |
| ref 字段 | 多种 ref 容易混用 | 显式区分 contract / snapshot / event / payload / artifact / document ref | 防止实现时错误映射 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把 Command / Query 设计成 HTTP JSON route | 对外服务常见 | 与 P0 无常驻 server 冲突，容易把 SDK 写成 gateway | 不采用 |
| 方案 B：Command / Query 使用 Rust DTO + Rust client method / CLI command | 符合 SDK 定位，易被后续 gateway 包装 | 外部非 Rust 调用需要通过 CLI 或后续 wrapper | 采用 |
| 方案 C：事件只定义内部 DTO，不定义 topic | 文件短 | bus / outbox 无法稳定对接 | 不采用 |
| 方案 D：event topic + payload schema + outbox idempotency | 对接清晰，责任边界明确 | 需要后续 Step 9 定义发布流 | 采用 |
| 方案 E：job 只写名称，不写输入输出 | 快 | 实施者仍需猜 job args 和证据输出 | 不采用 |

推荐方案：方案 B + D，并补齐 job input / output。

原因：

- `L0-sdk` 是 official client access layer，不是 server gateway。
- 协议必须强到能生成 `crates/contracts`、`crates/client`、`crates/cli`、`crates/jobs` 的类型和入口。
- event / job 是 candidate、evidence、compatibility 闭环的关键，不写 schema 会导致后续实现分叉。

---

## 7. 结构化中间产物

> 本节按协议类别分批展开。所有 DTO 类型默认定义在 `crates/contracts`，所有 Rust client method 默认定义在 `crates/client`，CLI command 默认定义在 `crates/cli`，job binary 默认定义在 `crates/jobs`。

### 7.1 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要处理流 |
|---|---|---|---|---|---|
| `UpdateSdkSemanticBaseline` | Command API | maintainer / CLI / Rust caller | `SdkSemanticBaselineService` | Rust DTO + `sdk semantic update` | 是 |
| `RefreshDerivedBindingView` | Command API | maintainer / job / CLI | `ContractConsumptionService` | Rust DTO + `sdk views refresh` | 是 |
| `InvokeServiceCapability` | Command API | Rust SDK consumer | `ServiceClientAssemblyService` | Rust client method `ServiceClient::call` | 是 |
| `PublishBusEvent` | Command API | Rust SDK consumer | `EventClientAssemblyService` | Rust client method `EventClient::publish` | 是 |
| `RecordCompatibilityDecision` | Command API | maintainer / compatibility job | `CompatibilityGovernanceService` | Rust DTO + `sdk compatibility record` | 是 |
| `DeprecateSdkApi` | Command API | maintainer / CLI | `CompatibilityGovernanceService` | Rust DTO + `sdk api deprecate` | 是 |
| `GetSdkCapabilitySummary` | Query API | Rust caller / CLI | `QueryService` | Rust DTO + `sdk capabilities summary` | 通用只读流 |
| `GetUpstreamVersionRefs` | Query API | Rust caller / CLI | `QueryService` | Rust DTO + `sdk upstream refs` | 通用只读流 |
| `GetSnapshotFreshness` | Query API | Rust caller / CLI | `QueryService` | Rust DTO + `sdk freshness get` | 通用只读流 |
| `GetServiceClientView` | Query API | Rust caller / CLI | `QueryService` | Rust DTO + `sdk service view` | 通用只读流 |
| `GetEventClientView` | Query API | Rust caller / CLI | `QueryService` | Rust DTO + `sdk event view` | 通用只读流 |
| `ReadServiceCapability` | Query API | Rust SDK consumer | `ServiceClientAssemblyService` | Rust client method `ServiceClient::read` | 是 |
| `OpenEventSubscription` | Query API | Rust SDK consumer | `EventClientAssemblyService` | Rust client method `EventClient::open_subscription` | 是 |
| `GetPackageCandidateStatus` | Query API | maintainer / CLI | `QueryService` | Rust DTO + `sdk candidate status` | 通用只读流 |
| `GetVerificationEvidence` | Query API | maintainer / CLI | `QueryService` | Rust DTO + `sdk evidence get` | 通用只读流 |
| `GetCompatibilityDecision` | Query API | maintainer / CLI | `QueryService` | Rust DTO + `sdk compatibility get` | 通用只读流 |
| `ListDeprecatedApis` | Query API | maintainer / CLI | `QueryService` | Rust DTO + `sdk api deprecated list` | 通用只读流 |
| `GetMigrationGuideRef` | Query API | maintainer / CLI | `QueryService` | Rust DTO + `sdk migration ref` | 通用只读流 |
| `ConsumeCoreContractChanged` | Inbound Event Consumer | `L0-core` event source | `ContractConsumptionService` | topic `core.contract.changed.v1` | 是 |
| `ConsumeBusSemanticChanged` | Inbound Event Consumer | `L0-bus` event source | `ContractConsumptionService` | topic `bus.semantic.changed.v1` | 是 |
| `ConsumeFormalApiChanged` | Inbound Event Consumer | formal API source | `ContractConsumptionService` | topic `formal_api.changed.v1` | 是 |
| `ConsumeValidationRunFinished` | Inbound Event Consumer | runner / job | `CandidateValidationService` | topic `sdk.validation.finished.v1` | 是 |
| `SdkSemanticBaselineChangedEvent` | Outbound Event | `SdkSemanticBaselineService` / outbox | automation / docs / compatibility | topic `sdk.semantic_baseline.changed.v1` | 通用发布流 |
| `SdkSnapshotFreshnessChangedEvent` | Outbound Event | `ContractConsumptionService` / outbox | candidate generator / reports | topic `sdk.snapshot_freshness.changed.v1` | 通用发布流 |
| `PackageCandidateGeneratedEvent` | Outbound Event | `PackageCandidateService` / outbox | smoke / docs / review automation | topic `sdk.package_candidate.generated.v1` | 通用发布流 |
| `VerificationEvidenceRecordedEvent` | Outbound Event | `CandidateValidationService` / outbox | compatibility / reports | topic `sdk.verification_evidence.recorded.v1` | 通用发布流 |
| `CompatibilityDecisionRecordedEvent` | Outbound Event | `CompatibilityGovernanceService` / outbox | release review / docs | topic `sdk.compatibility_decision.recorded.v1` | 通用发布流 |
| `DeprecatedApiRecordedEvent` | Outbound Event | `CompatibilityGovernanceService` / outbox | docs / migration maintainer | topic `sdk.deprecated_api.recorded.v1` | 通用发布流 |
| `CheckUpstreamFreshness` | Operations Job | scheduler / CLI | `ContractConsumptionService` | binary `check_upstream_freshness` + JSON input | 是 |
| `GeneratePackageCandidate` | Operations Job | scheduler / CLI | `PackageCandidateService` | binary `generate_package_candidate` + JSON input | 是 |
| `BuildLanguagePackages` | Operations Job | scheduler / CLI | `PackageCandidateService` | binary `build_language_packages` + JSON input | 是 |
| `RunCrossLanguageSmoke` | Operations Job | scheduler / CLI | `CandidateValidationService` | binary `run_cross_language_smoke` + JSON input | 是 |
| `ValidateDocsExamples` | Operations Job | scheduler / CLI | `DocsExampleValidationService` | binary `validate_docs_examples` + JSON input | 是 |
| `CheckCompatibility` | Operations Job | scheduler / CLI | `CompatibilityGovernanceService` | binary `check_compatibility` + JSON input | 是 |
| `VerifyBoundaryPolicies` | Operations Job | scheduler / CLI | `CandidateValidationService` | binary `verify_boundary_policies` + JSON input | 是 |
| `RebuildSdkProjections` | Operations Job | scheduler / CLI | `QueryService` / projection rebuild service | binary `rebuild_sdk_projections` + JSON input | 是 |

### 7.2 公共协议约定

#### 7.2.1 公共 Rust DTO 类型

```rust
/// SDK 命令元数据。
pub struct CommandMetadata {
    /// 请求 ID。
    pub request_id: RequestId,

    /// 幂等键。
    pub idempotency_key: IdempotencyKey,

    /// 发起时间。
    pub requested_at: Timestamp,

    /// 追踪上下文。
    pub trace_context: TraceContext,
}

/// SDK 查询元数据。
pub struct QueryMetadata {
    /// 请求 ID。
    pub request_id: RequestId,

    /// 追踪上下文。
    pub trace_context: TraceContext,

    /// 分页请求。
    pub page: Option<PageRequest>,
}

/// SDK job 元数据。
pub struct JobMetadata {
    /// Job 运行 ID。
    pub job_run_id: JobRunId,

    /// 幂等键。
    pub idempotency_key: IdempotencyKey,

    /// 触发来源。
    pub trigger_source: JobTriggerSource,

    /// 追踪上下文。
    pub trace_context: TraceContext,
}

/// SDK 协议错误 envelope。
pub struct SdkErrorEnvelope {
    /// 错误码。
    pub code: SdkProtocolErrorCode,

    /// 可读错误信息。
    pub message: String,

    /// 错误是否可重试。
    pub retryable: bool,

    /// 诊断引用。
    pub diagnostic_ref: Option<DiagnosticRef>,
}
```

#### 7.2.2 公共 JSON response envelope

```json
{
  "request_id": "req_01",
  "trace_id": "trace_01",
  "status": "ok",
  "data": {},
  "error": null,
  "consistency": {
    "marker": "committed",
    "version": "v1"
  }
}
```

#### 7.2.3 公共 JSON error envelope

```json
{
  "request_id": "req_01",
  "trace_id": "trace_01",
  "status": "error",
  "data": null,
  "error": {
    "code": "boundary_violation",
    "message": "fake result cannot be treated as production success",
    "retryable": false,
    "diagnostic_ref": "diag_01"
  },
  "consistency": null
}
```

#### 7.2.4 统一错误映射

| 错误类别 | Rust 错误 | CLI exit code | Error envelope code | 调用方处理 |
|---|---|---:|---|---|
| 字段缺失或格式错误 | `SdkProtocolError::Validation` | 2 | `invalid_argument` | 修正输入后重试 |
| 对象不存在 | `SdkProtocolError::NotFound` | 3 | `not_found` | 检查 ID 或 ref |
| 幂等 / 版本 / 状态冲突 | `SdkProtocolError::Conflict` | 4 | `conflict` | 重新读取当前状态 |
| forbidden body / secret / fake success | `SdkProtocolError::BoundaryViolation` | 5 | `boundary_violation` | 修正调用边界 |
| source / runner / boundary 暂不可用 | `SdkProtocolError::Dependency` | 6 | `dependency_unavailable` | 可重试 |
| 内部未分类错误 | `SdkProtocolError::Internal` | 1 | `internal` | 上报诊断 |

#### 7.2.5 CloudEvent / topic 约定

| 项 | 规则 |
|---|---|
| `type` | 使用 §7.1 中 topic 名称 |
| `source` | `quantalithos.sdk` |
| `id` | `SdkOutboxEventId` |
| `subject` | 目标对象 ID，例如 baseline、candidate、evidence、decision 或 deprecated API |
| `data_schema` | `sdk-contracts/events/<EventName>/v1` |
| `trace` | 使用 `TraceContext` 引用，不复制 span 正文 |
| `data` | 只包含 ref、status、summary、digest、version，不包含 raw body、secret 或 payload body |

#### 7.2.6 字段来源与缺失处理规则

| 字段类别 | 来源 | 缺失处理 |
|---|---|---|
| `actor` | gateway / CLI / job trigger 传入 `ActorContext` | reject |
| `trace_context` | caller / CLI / scheduler 传入或系统生成 | 系统生成最小 trace |
| `idempotency_key` | caller / job trigger 传入 | 写路径 reject |
| `*_id` | caller 输入或 `IdGeneratorPort` 生成 | 需要已有对象时 not_found，否则生成 |
| `*_ref` | caller 输入、repository lookup、source port 或 artifact store | 缺失时 reject / dependency error |
| `*_digest` | source / artifact store / runner result | 不能由 caller 伪造 |
| `status` / `state` | domain method 派生 | caller 不得直接指定终态 |

### 7.3 Command API 协议

#### 7.3.1 `UpdateSdkSemanticBaseline`

##### 用途

更新 SDK 共同语义基线、能力模型和跨语言概念映射。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `update_sdk_semantic_baseline(command: UpdateSdkSemanticBaselineCommand, actor: ActorContext, meta: CommandMetadata) -> Result<SdkSemanticBaselineResult, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::update_semantic_baseline` / `sdk semantic update` |
| 调用方 | maintainer、automation |
| 处理方 | `SdkSemanticBaselineService` |

##### 请求 schema

```json
{
  "baseline_change": {
    "target_version": "baseline_v2",
    "supported_languages": ["rust", "python", "typescript"],
    "capability_changes": [
      {
        "capability_id": "service.call",
        "operation": "enable",
        "source_ref": "formal_api_ref_01"
      }
    ],
    "concept_map_ref": "concept_map_ref_01"
  },
  "upstream_refs": [
    {
      "source_kind": "core",
      "version_ref": "core_snapshot_v1",
      "digest": "sha256:..."
    }
  ],
  "reason": "align official SDK semantic baseline"
}
```

##### 响应 schema

```json
{
  "baseline_id": "sdk_baseline_01",
  "baseline_version": "baseline_v2",
  "outbox_event_ref": "sdk_outbox_01",
  "consistency": {
    "marker": "committed",
    "version": "2"
  }
}
```

##### 字段来源与构造闭环

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `baseline_change.target_version` | `SdkBaselineVersion` | `SdkSemanticBaseline.baseline_version` | caller 输入 | reject |
| `supported_languages` | `Vec<LanguageId>` | `SdkSemanticBaseline.supported_languages` | caller 输入 | reject |
| `capability_changes` | `Vec<CapabilityChangeSpec>` | `ClientCapabilityModel` | caller 输入 + source lookup | reject / dependency error |
| `concept_map_ref` | `ConceptMapRef` | `CrossLanguageConceptMap` | caller 输入 + repository lookup | reject / not_found |
| `upstream_refs` | `Vec<UpstreamVersionRef>` | `SdkSemanticBaseline.upstream_refs` | caller 输入或 source lookup | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `UpdateSdkSemanticBaselineCommand` | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` | 是 | ID 由 `IdGeneratorPort`；时间由 `ClockPort` | `core_contract_ref` 不等于 `core_snapshot_ref` | reject / dependency error |

##### 错误映射

| 场景 | 错误 |
|---|---|
| 语言集合不含 Rust / Python / TypeScript | `Validation` |
| capability source 不存在 | `NotFound` |
| 幂等 key 冲突 | `Conflict` |

##### 幂等与审计要求

- 必须携带 `CommandMetadata.idempotency_key`。
- 成功后必须写 `SdkSemanticBaselineChangedEvent` 到 `SdkOutboxPort`。
- 需要记录 actor、reason、old version 和 new version。

#### 7.3.2 `RefreshDerivedBindingView`

##### 用途

从 core / bus / formal API snapshot 派生 SDK binding view、language view 和 freshness。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `refresh_derived_binding_view(command: RefreshDerivedBindingViewCommand, actor: ActorContext, meta: CommandMetadata) -> Result<DerivedBindingRefreshResult, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::refresh_derived_views` / `sdk views refresh` |
| 调用方 | maintainer、`CheckUpstreamFreshness` job |
| 处理方 | `ContractConsumptionService` |

##### 请求 schema

```json
{
  "refresh_scope": {
    "languages": ["rust", "python", "typescript"],
    "sources": ["core", "bus", "formal_api"]
  },
  "source_refs": [
    {
      "source_kind": "core",
      "version_ref": "core_snapshot_v1"
    }
  ],
  "force": false
}
```

##### 响应 schema

```json
{
  "binding_view_id": "derived_view_01",
  "freshness_state": "Fresh",
  "updated_language_views": ["rust", "python", "typescript"],
  "outbox_event_ref": "sdk_outbox_02"
}
```

##### 字段来源与构造闭环

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `refresh_scope.languages` | `Vec<LanguageId>` | `LanguageBindingView.language_id` | caller 输入 | reject |
| `refresh_scope.sources` | `Vec<UpstreamSourceKind>` | `DerivedBindingView.upstream_refs` | caller 输入 | reject |
| `source_refs` | `Vec<UpstreamVersionRef>` | `UpstreamVersionRef` | caller 输入或 source latest lookup | lookup / dependency error |
| `force` | `bool` | processing option | caller 输入 | default false |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RefreshDerivedBindingViewCommand` | `DerivedBindingView`、`LanguageBindingView`、`SnapshotFreshnessState` | 是 | snapshot 由 source port 获取；freshness 由 domain method 派生 | `formal_api_ref` 不等于 `service_capability_ref` | dependency error / reject |

##### 错误映射

| 场景 | 错误 |
|---|---|
| 指定 source 不受支持 | `Validation` |
| snapshot 暂不可用 | `Dependency` |
| derived view 乐观锁冲突 | `Conflict` |

##### 幂等与审计要求

- 写路径必须携带幂等键。
- 成功后可写 `SdkSnapshotFreshnessChangedEvent`。
- 不复制上游 snapshot 正文到 event。

#### 7.3.3 `InvokeServiceCapability`

##### 用途

通过 SDK service client 调用 formal API 或 fake boundary，不保存服务端业务 truth。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `invoke_service_capability(command: ServiceCapabilityCall, context: ClientCallContext, meta: CommandMetadata) -> Result<ServiceCapabilityCallResult, SdkProtocolError>` |
| Rust client / CLI | `ServiceClient::call` / 无默认 CLI |
| 调用方 | Rust SDK consumer |
| 处理方 | `ServiceClientAssemblyService` |

##### 请求 schema

```json
{
  "capability_ref": "service_capability_ref_01",
  "target_profile": "formal",
  "input_ref": "payload_ref_01",
  "input_digest": "sha256:...",
  "timeout_ms": 3000
}
```

##### 响应 schema

```json
{
  "result_ref": "service_result_ref_01",
  "result_digest": "sha256:...",
  "boundary_kind": "formal_api",
  "diagnostic_ref": null
}
```

##### 字段来源与构造闭环

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `capability_ref` | `ServiceCapabilityRef` | `ServiceClientView.capability_refs` | caller 输入 + repository lookup | not_found |
| `target_profile` | `ClientTargetProfile` | `ClientContext.target_profile` | caller 输入 | reject |
| `input_ref` | `PayloadRef` | boundary request | caller 输入 | reject |
| `input_digest` | `PayloadDigest` | boundary request | caller 输入 / computed | reject |
| `timeout_ms` | `u64` | boundary option | caller 输入 | default from config |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `ServiceCapabilityCall` | `ServiceClientView`、`ServiceCapabilityRef`、`BoundaryGuard` | 是 | target boundary 从 view + profile 决定 | `fake_boundary_ref` 不等于 `formal_api_ref` | reject / boundary violation |

##### 错误映射

| 场景 | 错误 |
|---|---|
| capability 不支持 | `Validation` |
| fake marker 缺失 | `BoundaryViolation` |
| formal API 暂不可用 | `Dependency` |

##### 幂等与审计要求

- 需要幂等键，但不写 SDK truth。
- 只记录 trace 和 diagnostic ref，不保存生产 request / response body。

#### 7.3.4 `PublishBusEvent`

##### 用途

通过 SDK event client 按 `L0-bus` 语义发布事件请求，不生成 bus publication / delivery truth。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `publish_bus_event(command: PublishBusEventCommand, context: ClientCallContext, meta: CommandMetadata) -> Result<BusEventPublishResult, SdkProtocolError>` |
| Rust client / CLI | `EventClient::publish` / 无默认 CLI |
| 调用方 | Rust SDK consumer |
| 处理方 | `EventClientAssemblyService` |

##### 请求 schema

```json
{
  "event_mapping_ref": "event_mapping_01",
  "payload_ref": "payload_ref_01",
  "payload_digest": "sha256:...",
  "target_scope": "project",
  "trace_context": {
    "trace_id": "trace_01"
  }
}
```

##### 响应 schema

```json
{
  "bus_publish_ref": "bus_publish_ref_01",
  "boundary_kind": "l0_bus",
  "diagnostic_ref": null
}
```

##### 字段来源与构造闭环

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `event_mapping_ref` | `EventSemanticMappingRef` | `EventSemanticMapping` | caller 输入 + repository lookup | not_found |
| `payload_ref` | `PayloadRef` | bus boundary request | caller 输入 | reject |
| `payload_digest` | `PayloadDigest` | bus boundary request | caller 输入 / computed | reject |
| `target_scope` | `BusTargetScope` | bus boundary request | caller 输入 | reject |
| `trace_context` | `TraceContext` | `TracePropagationPolicy` | caller 输入 | generate minimal trace |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `PublishBusEventCommand` | `BusEventClientView`、`EventSemanticMapping`、`BoundaryGuard` | 是 | bus boundary 从 event client view 派生 | `bus_semantic_ref` 不等于 `bus_event_ref` | reject / dependency error |

##### 错误映射

| 场景 | 错误 |
|---|---|
| payload body 被直接传入 | `BoundaryViolation` |
| event mapping 不存在 | `NotFound` |
| bus boundary 不可用 | `Dependency` |

##### 幂等与审计要求

- 需要幂等键。
- 不保存 event payload body。
- 不生成 `L0-bus` publication / delivery truth。

#### 7.3.5 `RecordCompatibilityDecision`

##### 用途

记录 SDK candidate 与当前 semantic baseline 的兼容判断。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `record_compatibility_decision(command: RecordCompatibilityDecisionCommand, actor: ActorContext, meta: CommandMetadata) -> Result<CompatibilityDecisionResult, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::record_compatibility_decision` / `sdk compatibility record` |
| 调用方 | maintainer、`CheckCompatibility` job |
| 处理方 | `CompatibilityGovernanceService` |

##### 请求 schema

```json
{
  "candidate_id": "candidate_01",
  "baseline_version": "baseline_v2",
  "decision_state": "Compatible",
  "evidence_refs": ["evidence_01", "evidence_02"],
  "migration_ref": null,
  "reason": "all required smoke and docs checks passed"
}
```

##### 响应 schema

```json
{
  "decision_id": "compat_decision_01",
  "decision_state": "Compatible",
  "outbox_event_ref": "sdk_outbox_05"
}
```

##### 字段来源与构造闭环

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `candidate_id` | `PackageCandidateId` | `CompatibilityDecision.candidate_id` | caller 输入 | not_found |
| `baseline_version` | `SdkBaselineVersion` | `CompatibilityDecision.baseline_version` | caller 输入 / repository lookup | reject |
| `decision_state` | `CompatibilityDecisionState` | `CompatibilityDecision.state` | caller 输入或 runner result | reject |
| `evidence_refs` | `Vec<EvidenceId>` | `CompatibilityDecision.evidence_refs` | caller 输入 + evidence lookup | not_found |
| `migration_ref` | `Option<MigrationGuideRef>` | `CompatibilityDecision.migration_ref` | caller 输入 | required when migration |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `RecordCompatibilityDecisionCommand` | `CompatibilityDecision` | 是 | decision ID / time 由系统生成 | `evidence_id` 不等于 `diagnostic_ref` | reject / not_found |

##### 错误映射

| 场景 | 错误 |
|---|---|
| evidence 缺失或不合格 | `Validation` |
| migration required 但无 migration ref | `Validation` |
| candidate 不存在 | `NotFound` |

##### 幂等与审计要求

- 需要幂等键。
- 成功后写 `CompatibilityDecisionRecordedEvent`。
- 不替代 ADR，只保存 SDK compatibility decision。

#### 7.3.6 `DeprecateSdkApi`

##### 用途

记录 SDK API deprecated / pending removal / removed 生命周期变化，并绑定迁移说明引用。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `deprecate_sdk_api(command: DeprecateSdkApiCommand, actor: ActorContext, meta: CommandMetadata) -> Result<DeprecatedApiResult, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::deprecate_api` / `sdk api deprecate` |
| 调用方 | maintainer |
| 处理方 | `CompatibilityGovernanceService` |

##### 请求 schema

```json
{
  "api_ref": "sdk_api_ref_01",
  "target_lifecycle_state": "Deprecated",
  "migration_ref": {
    "document_ref": "doc_migration_01",
    "from_version": "pkg_1.0.0",
    "to_version": "pkg_1.1.0",
    "language_set": ["rust", "python", "typescript"]
  },
  "removal_plan": null,
  "reason": "replaced by stable typed capability"
}
```

##### 响应 schema

```json
{
  "api_ref": "sdk_api_ref_01",
  "lifecycle_state": "Deprecated",
  "outbox_event_ref": "sdk_outbox_06"
}
```

##### 字段来源与构造闭环

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `api_ref` | `SdkApiRef` | `DeprecatedApiRecord.api_ref` | caller 输入 | reject / not_found |
| `target_lifecycle_state` | `DeprecatedApiLifecycleState` | `DeprecatedApiRecord.lifecycle_state` | caller 输入 | reject |
| `migration_ref` | `Option<MigrationGuideRef>` | `DeprecatedApiRecord.migration_ref` | caller 输入 | required for deprecated / pending removal |
| `removal_plan` | `Option<RemovalPlan>` | `DeprecatedApiRecord.removal_plan` | caller 输入 | required for pending removal |
| `reason` | `String` | audit reason | caller 输入 | reject |

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 |
|---|---|---|---|---|---|
| `DeprecateSdkApiCommand` | `DeprecatedApiRecord`、`MigrationGuideRef` | 是 | time / actor 由 context 提供 | `document_ref` 不等于 `artifact_ref` | reject |

##### 错误映射

| 场景 | 错误 |
|---|---|
| migration ref 缺失 | `Validation` |
| lifecycle 非法迁移 | `Conflict` |
| API ref 不存在 | `NotFound` |

##### 幂等与审计要求

- 需要幂等键。
- 成功后写 `DeprecatedApiRecordedEvent`。
- 不允许静默移除跨语言能力。

### 7.4 Query API 协议

Query API 只读，不携带幂等键，不开启写事务，不触发 refresh、candidate、compatibility、projection rebuild 或 boundary write。

#### 7.4.1 `GetSdkCapabilitySummary`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_sdk_capability_summary(query: GetSdkCapabilitySummaryQuery, actor: ActorContext, meta: QueryMetadata) -> Result<SdkCapabilitySummaryView, SdkProtocolError>` |
| Rust client / CLI | `SdkClient::capabilities().summary` / `sdk capabilities summary` |
| 调用方 | Rust caller、maintainer |
| 处理方 | `QueryService` |

```json
{
  "language_filter": ["rust", "python", "typescript"],
  "include_unsupported": true
}
```

```json
{
  "baseline_version": "baseline_v2",
  "supported_languages": ["rust", "python", "typescript"],
  "supported_capabilities": ["service.call", "event.publish"],
  "unsupported_capabilities": [
    {
      "capability_id": "registry.publish",
      "reason": "not in P0"
    }
  ]
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `language_filter` | `Vec<LanguageId>` | `SdkCapabilityProjectionPort` | default all |
| `include_unsupported` | `bool` | projection option | default false |

#### 7.4.2 `GetUpstreamVersionRefs`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_upstream_version_refs(query: GetUpstreamVersionRefsQuery, actor: ActorContext, meta: QueryMetadata) -> Result<UpstreamVersionRefsView, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::upstream_refs` / `sdk upstream refs` |
| 调用方 | maintainer、job |
| 处理方 | `QueryService` |

```json
{
  "source_filter": ["core", "bus", "formal_api"]
}
```

```json
{
  "refs": [
    {
      "source_kind": "core",
      "version_ref": "core_snapshot_v1",
      "digest": "sha256:..."
    }
  ]
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `source_filter` | `Vec<UpstreamSourceKind>` | `VersionRefRepository` | default all |

#### 7.4.3 `GetSnapshotFreshness`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_snapshot_freshness(query: GetSnapshotFreshnessQuery, actor: ActorContext, meta: QueryMetadata) -> Result<SnapshotFreshnessView, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::snapshot_freshness` / `sdk freshness get` |
| 调用方 | maintainer、automation |
| 处理方 | `QueryService` |

```json
{
  "source_filter": ["core", "bus", "formal_api"],
  "language_filter": ["rust"]
}
```

```json
{
  "freshness_state": "Fresh",
  "affected_views": ["derived_view_01"],
  "checked_at": "2026-05-30T00:00:00Z"
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `source_filter` | `Vec<UpstreamSourceKind>` | `DerivedViewRepository` / projection | default all |
| `language_filter` | `Vec<LanguageId>` | `DerivedViewRepository` / projection | default all |

#### 7.4.4 `GetServiceClientView`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_service_client_view(query: GetServiceClientViewQuery, actor: ActorContext, meta: QueryMetadata) -> Result<ServiceClientView, SdkProtocolError>` |
| Rust client / CLI | `SdkClient::capabilities().service_view` / `sdk service view` |
| 调用方 | Rust caller、maintainer |
| 处理方 | `QueryService` |

```json
{
  "capability_filter": ["service.call"],
  "include_fake_only": true
}
```

```json
{
  "service_view_id": "service_view_01",
  "capability_refs": ["service_capability_ref_01"],
  "freshness_state": "Fresh"
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `capability_filter` | `Vec<ClientCapabilityId>` | `ServiceClientViewRepository` | default all |
| `include_fake_only` | `bool` | query filter | default false |

#### 7.4.5 `GetEventClientView`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_event_client_view(query: GetEventClientViewQuery, actor: ActorContext, meta: QueryMetadata) -> Result<BusEventClientView, SdkProtocolError>` |
| Rust client / CLI | `SdkClient::capabilities().event_view` / `sdk event view` |
| 调用方 | Rust caller、maintainer |
| 处理方 | `QueryService` |

```json
{
  "event_type_filter": ["sdk.package_candidate.generated.v1"]
}
```

```json
{
  "event_view_id": "event_view_01",
  "mappings": ["event_mapping_01"],
  "freshness_state": "Fresh"
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `event_type_filter` | `Vec<EventType>` | `EventClientViewRepository` | default all |

#### 7.4.6 `ReadServiceCapability`

| 项 | 内容 |
|---|---|
| 函数签名 | `read_service_capability(query: ServiceCapabilityReadQuery, context: ClientCallContext, meta: QueryMetadata) -> Result<ServiceCapabilityReadResult, SdkProtocolError>` |
| Rust client / CLI | `ServiceClient::read` / 无默认 CLI |
| 调用方 | Rust SDK consumer |
| 处理方 | `ServiceClientAssemblyService` |

```json
{
  "capability_ref": "service_capability_ref_01",
  "target_profile": "formal",
  "query_ref": "query_payload_ref_01",
  "query_digest": "sha256:..."
}
```

```json
{
  "result_ref": "service_read_result_ref_01",
  "result_digest": "sha256:...",
  "boundary_kind": "formal_api"
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `capability_ref` | `ServiceCapabilityRef` | `ServiceClientViewRepository` | not_found |
| `target_profile` | `ClientTargetProfile` | `ClientContext` | reject |
| `query_ref` | `PayloadRef` | external payload reference | reject |
| `query_digest` | `PayloadDigest` | caller / computed | reject |

#### 7.4.7 `OpenEventSubscription`

| 项 | 内容 |
|---|---|
| 函数签名 | `open_event_subscription(query: OpenEventSubscriptionQuery, context: ClientCallContext, meta: QueryMetadata) -> Result<EventSubscriptionView, SdkProtocolError>` |
| Rust client / CLI | `EventClient::open_subscription` / 无默认 CLI |
| 调用方 | Rust SDK consumer |
| 处理方 | `EventClientAssemblyService` |

```json
{
  "event_mapping_ref": "event_mapping_01",
  "cursor": "cursor_01",
  "limit": 100
}
```

```json
{
  "subscription_view_ref": "subscription_view_01",
  "cursor": "cursor_02",
  "items": []
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `event_mapping_ref` | `EventSemanticMappingRef` | `EventClientViewRepository` | not_found |
| `cursor` | `Option<SubscriptionCursor>` | bus boundary | default start |
| `limit` | `PageLimit` | query option | default / cap |

#### 7.4.8 `GetPackageCandidateStatus`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_package_candidate_status(query: GetPackageCandidateStatusQuery, actor: ActorContext, meta: QueryMetadata) -> Result<PackageCandidateStatusView, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::candidate_status` / `sdk candidate status` |
| 调用方 | maintainer、automation |
| 处理方 | `QueryService` |

```json
{
  "candidate_id": "candidate_01"
}
```

```json
{
  "candidate_id": "candidate_01",
  "status": "Verified",
  "language_artifacts": ["artifact_ref_01"]
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `candidate_id` | `PackageCandidateId` | `CandidateRepository` | not_found |

#### 7.4.9 `GetVerificationEvidence`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_verification_evidence(query: GetVerificationEvidenceQuery, actor: ActorContext, meta: QueryMetadata) -> Result<VerificationEvidenceView, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::evidence` / `sdk evidence get` |
| 调用方 | maintainer、reports |
| 处理方 | `QueryService` |

```json
{
  "candidate_id": "candidate_01",
  "evidence_id": null,
  "include_redacted": true
}
```

```json
{
  "items": [
    {
      "evidence_id": "evidence_01",
      "result": "Passed",
      "redaction_status": "Redacted",
      "artifact_ref": "artifact_ref_01"
    }
  ]
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `candidate_id` | `PackageCandidateId` | `EvidenceProjectionPort` | required if evidence_id absent |
| `evidence_id` | `Option<EvidenceId>` | `EvidenceRepository` | required if candidate_id absent |
| `include_redacted` | `bool` | projection option | default true |

#### 7.4.10 `GetCompatibilityDecision`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_compatibility_decision(query: GetCompatibilityDecisionQuery, actor: ActorContext, meta: QueryMetadata) -> Result<CompatibilityDecisionView, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::compatibility` / `sdk compatibility get` |
| 调用方 | maintainer、release review |
| 处理方 | `QueryService` |

```json
{
  "decision_id": "compat_decision_01",
  "candidate_id": null
}
```

```json
{
  "decision_id": "compat_decision_01",
  "candidate_id": "candidate_01",
  "decision_state": "Compatible",
  "evidence_refs": ["evidence_01"]
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `decision_id` | `Option<CompatibilityDecisionId>` | `CompatibilityRepository` | required if candidate_id absent |
| `candidate_id` | `Option<PackageCandidateId>` | `CompatibilityProjectionPort` | required if decision_id absent |

#### 7.4.11 `ListDeprecatedApis`

| 项 | 内容 |
|---|---|
| 函数签名 | `list_deprecated_apis(query: ListDeprecatedApisQuery, actor: ActorContext, meta: QueryMetadata) -> Result<DeprecatedApiPage, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::deprecated_apis` / `sdk api deprecated list` |
| 调用方 | maintainer、docs |
| 处理方 | `QueryService` |

```json
{
  "language_filter": ["rust", "python"],
  "state_filter": ["Deprecated", "PendingRemoval"],
  "page": {
    "cursor": null,
    "limit": 50
  }
}
```

```json
{
  "items": [
    {
      "api_ref": "sdk_api_ref_01",
      "lifecycle_state": "Deprecated",
      "migration_ref": "migration_ref_01"
    }
  ],
  "next_cursor": null
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `language_filter` | `Vec<LanguageId>` | `CompatibilityProjectionPort` | default all |
| `state_filter` | `Vec<DeprecatedApiLifecycleState>` | `CompatibilityProjectionPort` | default active deprecated states |
| `page` | `PageRequest` | query option | default page |

#### 7.4.12 `GetMigrationGuideRef`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_migration_guide_ref(query: GetMigrationGuideRefQuery, actor: ActorContext, meta: QueryMetadata) -> Result<MigrationGuideRefView, SdkProtocolError>` |
| Rust client / CLI | `SdkAdminClient::migration_ref` / `sdk migration ref` |
| 调用方 | maintainer、docs |
| 处理方 | `QueryService` |

```json
{
  "api_ref": "sdk_api_ref_01",
  "from_version": "pkg_1.0.0",
  "to_version": "pkg_1.1.0"
}
```

```json
{
  "migration_ref": "migration_ref_01",
  "document_ref": "doc_migration_01",
  "language_set": ["rust", "python", "typescript"]
}
```

| 输入字段 | 类型 | 读取来源 | 缺失处理 |
|---|---|---|---|
| `api_ref` | `SdkApiRef` | `CompatibilityRepository` | not_found |
| `from_version` | `PackageCandidateVersion` | `MigrationGuideRef` | reject if version range invalid |
| `to_version` | `PackageCandidateVersion` | `MigrationGuideRef` | reject if version range invalid |

### 7.5 Inbound Event Consumer 协议

#### 7.5.1 `ConsumeCoreContractChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_core_contract_changed(event: CoreContractChangedEvent, meta: EventConsumeMetadata) -> Result<EventConsumeResult, SdkProtocolError>` |
| Topic | `core.contract.changed.v1` |
| 发布方 | `L0-core` |
| 处理方 | `ContractConsumptionService` |

```json
{
  "event_id": "evt_core_01",
  "source_ref": "core",
  "core_contract_ref": "core_contract_ref_01",
  "core_snapshot_ref": "core_snapshot_v2",
  "digest": "sha256:...",
  "changed_at": "2026-05-30T00:00:00Z"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `core_contract_ref` | `CoreContractRef` | `DerivedBindingView.upstream_refs` | event payload | reject |
| `core_snapshot_ref` | `CoreSnapshotRef` | `UpstreamVersionRef` | event payload | reject |
| `digest` | `SnapshotDigest` | `UpstreamVersionRef.digest` | event payload | reject |

幂等与审计：使用 `event_id + source_ref` 作为消费幂等键；成功后可标记 affected views stale。

#### 7.5.2 `ConsumeBusSemanticChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_bus_semantic_changed(event: BusSemanticChangedEvent, meta: EventConsumeMetadata) -> Result<EventConsumeResult, SdkProtocolError>` |
| Topic | `bus.semantic.changed.v1` |
| 发布方 | `L0-bus` |
| 处理方 | `ContractConsumptionService` |

```json
{
  "event_id": "evt_bus_01",
  "source_ref": "bus",
  "bus_semantic_ref": "bus_semantic_ref_01",
  "version_ref": "bus_semantic_v2",
  "digest": "sha256:...",
  "changed_at": "2026-05-30T00:00:00Z"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `bus_semantic_ref` | `BusSemanticRef` | `BusEventClientView.semantic_refs` | event payload | reject |
| `version_ref` | `UpstreamVersionRef` | `UpstreamVersionRef` | event payload | reject |
| `digest` | `SnapshotDigest` | `UpstreamVersionRef.digest` | event payload | reject |

幂等与审计：使用 `event_id + source_ref`；不得重新定义 bus publication / delivery truth。

#### 7.5.3 `ConsumeFormalApiChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_formal_api_changed(event: FormalApiChangedEvent, meta: EventConsumeMetadata) -> Result<EventConsumeResult, SdkProtocolError>` |
| Topic | `formal_api.changed.v1` |
| 发布方 | formal API registry / source |
| 处理方 | `ContractConsumptionService` |

```json
{
  "event_id": "evt_formal_01",
  "source_ref": "formal_api",
  "formal_api_ref": "formal_api_ref_01",
  "version_ref": "formal_api_v2",
  "digest": "sha256:...",
  "changed_at": "2026-05-30T00:00:00Z"
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `formal_api_ref` | `FormalApiRef` | `ServiceCapabilityRef.formal_api_ref` | event payload | reject |
| `version_ref` | `UpstreamVersionRef` | `UpstreamVersionRef` | event payload | reject |
| `digest` | `SnapshotDigest` | `UpstreamVersionRef.digest` | event payload | reject |

幂等与审计：使用 `event_id + source_ref`；不得依赖服务仓源码。

#### 7.5.4 `ConsumeValidationRunFinished`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_validation_run_finished(event: ValidationRunFinishedEvent, meta: EventConsumeMetadata) -> Result<EventConsumeResult, SdkProtocolError>` |
| Topic | `sdk.validation.finished.v1` |
| 发布方 | runner / job |
| 处理方 | `CandidateValidationService` |

```json
{
  "event_id": "evt_validation_01",
  "run_ref": "validation_run_01",
  "candidate_id": "candidate_01",
  "suite_kind": "cross_language_smoke",
  "result": "Passed",
  "redaction_status": "Redacted",
  "artifact_ref": "artifact_ref_01",
  "diagnostic_ref": null
}
```

| 输入字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `run_ref` | `ValidationRunRef` | `VerificationEvidence.run_ref` | runner event | reject |
| `candidate_id` | `PackageCandidateId` | `VerificationEvidence.candidate_id` | runner event | not_found |
| `result` | `EvidenceResult` | `VerificationEvidence.result` | runner event | reject |
| `redaction_status` | `EvidenceRedactionStatus` | `VerificationEvidence.redaction_status` | runner event | reject |
| `artifact_ref` | `ArtifactRef` | `VerificationEvidence.artifact_ref` | runner event | reject |

幂等与审计：使用 `event_id + run_ref`；failed / unredacted / fake evidence 不得支撑 stable。

### 7.6 Outbound Event 协议

Outbound Event 使用 outbox 写入后发布。payload 只包含 SDK 已提交事实引用、状态和摘要，不包含 raw body、secret、生产 request / response body 或 payload body。

#### 7.6.1 `SdkSemanticBaselineChangedEvent`

| 项 | 内容 |
|---|---|
| Event type / topic | `sdk.semantic_baseline.changed.v1` |
| 发布方 | `SdkSemanticBaselineService` |
| 订阅方 | automation、docs validation、compatibility checker |
| 版本策略 | payload v1，新增字段必须兼容 |

```json
{
  "baseline_id": "sdk_baseline_01",
  "baseline_version": "baseline_v2",
  "supported_languages": ["rust", "python", "typescript"],
  "upstream_refs": ["core_snapshot_v1"],
  "changed_by": "actor_01"
}
```

#### 7.6.2 `SdkSnapshotFreshnessChangedEvent`

| 项 | 内容 |
|---|---|
| Event type / topic | `sdk.snapshot_freshness.changed.v1` |
| 发布方 | `ContractConsumptionService` |
| 订阅方 | candidate generator、reports |
| 版本策略 | payload v1，状态名必须与 `SnapshotFreshnessState` 一致 |

```json
{
  "view_id": "derived_view_01",
  "freshness_state": "Fresh",
  "affected_languages": ["rust", "python", "typescript"],
  "upstream_refs": ["core_snapshot_v2"]
}
```

#### 7.6.3 `PackageCandidateGeneratedEvent`

| 项 | 内容 |
|---|---|
| Event type / topic | `sdk.package_candidate.generated.v1` |
| 发布方 | `PackageCandidateService` |
| 订阅方 | smoke runner、docs runner、review automation |
| 版本策略 | payload v1，candidate status 必须与 `PackageCandidateStatus` 一致 |

```json
{
  "candidate_id": "candidate_01",
  "candidate_version": "pkg_1.1.0",
  "status": "Draft",
  "language_artifact_refs": ["artifact_ref_01"]
}
```

#### 7.6.4 `VerificationEvidenceRecordedEvent`

| 项 | 内容 |
|---|---|
| Event type / topic | `sdk.verification_evidence.recorded.v1` |
| 发布方 | `CandidateValidationService` |
| 订阅方 | compatibility checker、reports |
| 版本策略 | payload v1，result 与 redaction status 分开 |

```json
{
  "evidence_id": "evidence_01",
  "candidate_id": "candidate_01",
  "suite_kind": "cross_language_smoke",
  "result": "Passed",
  "redaction_status": "Redacted",
  "artifact_ref": "artifact_ref_01"
}
```

#### 7.6.5 `CompatibilityDecisionRecordedEvent`

| 项 | 内容 |
|---|---|
| Event type / topic | `sdk.compatibility_decision.recorded.v1` |
| 发布方 | `CompatibilityGovernanceService` |
| 订阅方 | release review、docs |
| 版本策略 | payload v1，decision state 必须与 `CompatibilityDecisionState` 一致 |

```json
{
  "decision_id": "compat_decision_01",
  "candidate_id": "candidate_01",
  "decision_state": "Compatible",
  "evidence_refs": ["evidence_01"],
  "migration_ref": null
}
```

#### 7.6.6 `DeprecatedApiRecordedEvent`

| 项 | 内容 |
|---|---|
| Event type / topic | `sdk.deprecated_api.recorded.v1` |
| 发布方 | `CompatibilityGovernanceService` |
| 订阅方 | docs、migration maintainer、downstream consumers |
| 版本策略 | payload v1，lifecycle state 必须与 `DeprecatedApiLifecycleState` 一致 |

```json
{
  "api_ref": "sdk_api_ref_01",
  "lifecycle_state": "Deprecated",
  "migration_ref": "migration_ref_01",
  "removal_plan_ref": null
}
```

#### 7.6.7 Outbound Event 统一字段闭环

| Event | 来源对象 | 必填字段来源 | 不得携带 |
|---|---|---|---|
| `SdkSemanticBaselineChangedEvent` | `SdkSemanticBaseline` | repository committed object + actor | concept map body |
| `SdkSnapshotFreshnessChangedEvent` | `DerivedBindingView` / `SnapshotFreshnessState` | repository committed view | upstream snapshot body |
| `PackageCandidateGeneratedEvent` | `PackageCandidate` | candidate repository + artifact refs | package file body |
| `VerificationEvidenceRecordedEvent` | `VerificationEvidence` | evidence repository | raw test logs / secrets |
| `CompatibilityDecisionRecordedEvent` | `CompatibilityDecision` | compatibility repository | full ADR / migration doc body |
| `DeprecatedApiRecordedEvent` | `DeprecatedApiRecord` | compatibility repository | migration document body |

### 7.7 Operations Job 协议

#### 7.7.1 `CheckUpstreamFreshness`

| 项 | 内容 |
|---|---|
| Job binary | `check_upstream_freshness` |
| 函数签名 | `run_check_upstream_freshness(input: CheckUpstreamFreshnessJobInput, meta: JobMetadata) -> Result<FreshnessCheckResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | `ContractConsumptionService` |

```json
{
  "sources": ["core", "bus", "formal_api"],
  "refresh_if_stale": false
}
```

```json
{
  "freshness_state": "Stale",
  "stale_sources": ["formal_api"],
  "recommended_action": "run RefreshDerivedBindingView"
}
```

幂等与审计：使用 `job_run_id`；不改写真相，除非 `refresh_if_stale=true` 且进入正式 refresh flow。

#### 7.7.2 `GeneratePackageCandidate`

| 项 | 内容 |
|---|---|
| Job binary | `generate_package_candidate` |
| 函数签名 | `run_generate_package_candidate(input: GeneratePackageCandidateJobInput, meta: JobMetadata) -> Result<PackageCandidateJobResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | `PackageCandidateService` |

```json
{
  "baseline_version": "baseline_v2",
  "language_set": ["rust", "python", "typescript"],
  "candidate_version": "pkg_1.1.0"
}
```

```json
{
  "candidate_id": "candidate_01",
  "status": "Draft",
  "language_artifact_refs": []
}
```

幂等与审计：使用 `job_run_id + baseline_version + candidate_version`；生成本地 candidate，不等于 public registry publish。

#### 7.7.3 `BuildLanguagePackages`

| 项 | 内容 |
|---|---|
| Job binary | `build_language_packages` |
| 函数签名 | `run_build_language_packages(input: BuildLanguagePackagesJobInput, meta: JobMetadata) -> Result<BuildLanguagePackagesResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | `PackageCandidateService` |

```json
{
  "candidate_id": "candidate_01",
  "language_set": ["rust", "python", "typescript"],
  "output_root_ref": "artifact_root_01"
}
```

```json
{
  "candidate_id": "candidate_01",
  "artifact_refs": ["artifact_ref_rust", "artifact_ref_python", "artifact_ref_ts"],
  "status": "Built"
}
```

幂等与审计：使用 `job_run_id + candidate_id`；artifact digest 必须由 `PackageArtifactStorePort` 校验。

#### 7.7.4 `RunCrossLanguageSmoke`

| 项 | 内容 |
|---|---|
| Job binary | `run_cross_language_smoke` |
| 函数签名 | `run_cross_language_smoke(input: RunCrossLanguageSmokeJobInput, meta: JobMetadata) -> Result<CrossLanguageSmokeJobResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | `CandidateValidationService` |

```json
{
  "candidate_id": "candidate_01",
  "target_profile": "fake",
  "suite_ref": "smoke_suite_01"
}
```

```json
{
  "evidence_id": "evidence_smoke_01",
  "result": "Passed",
  "redaction_status": "Redacted",
  "fake_marker_present": true
}
```

幂等与审计：使用 `job_run_id + candidate_id + suite_ref`；fake marker 必须进入 evidence，不得宣称 production ready。

#### 7.7.5 `ValidateDocsExamples`

| 项 | 内容 |
|---|---|
| Job binary | `validate_docs_examples` |
| 函数签名 | `run_validate_docs_examples(input: ValidateDocsExamplesJobInput, meta: JobMetadata) -> Result<DocsExampleValidationResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | `DocsExampleValidationService` |

```json
{
  "candidate_id": "candidate_01",
  "docs_example_set_ref": "docs_examples_01",
  "language_set": ["rust", "python", "typescript"]
}
```

```json
{
  "evidence_id": "evidence_docs_01",
  "result": "Passed",
  "validated_examples": 12,
  "failed_examples": 0
}
```

幂等与审计：使用 `job_run_id + candidate_id + docs_example_set_ref`；docs pass 不等于 compatibility pass。

#### 7.7.6 `CheckCompatibility`

| 项 | 内容 |
|---|---|
| Job binary | `check_compatibility` |
| 函数签名 | `run_check_compatibility(input: CheckCompatibilityJobInput, meta: JobMetadata) -> Result<CompatibilityCheckJobResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | `CompatibilityGovernanceService` |

```json
{
  "candidate_id": "candidate_01",
  "baseline_version": "baseline_v2",
  "required_evidence_refs": ["evidence_smoke_01", "evidence_docs_01"]
}
```

```json
{
  "decision_id": "compat_decision_01",
  "decision_state": "Compatible",
  "migration_required": false
}
```

幂等与审计：使用 `job_run_id + candidate_id + baseline_version`；breaking / missing evidence must block stable。

#### 7.7.7 `VerifyBoundaryPolicies`

| 项 | 内容 |
|---|---|
| Job binary | `verify_boundary_policies` |
| 函数签名 | `run_verify_boundary_policies(input: VerifyBoundaryPoliciesJobInput, meta: JobMetadata) -> Result<BoundaryPolicyVerificationJobResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | `CandidateValidationService` |

```json
{
  "candidate_id": "candidate_01",
  "policy_set_ref": "boundary_policy_set_01",
  "fixture_ref": "boundary_fixture_01"
}
```

```json
{
  "evidence_id": "evidence_boundary_01",
  "result": "Passed",
  "redaction_status": "Redacted",
  "violations": []
}
```

幂等与审计：使用 `job_run_id + candidate_id + policy_set_ref`；plain secret、raw body、fake success 必须 fail。

#### 7.7.8 `RebuildSdkProjections`

| 项 | 内容 |
|---|---|
| Job binary | `rebuild_sdk_projections` |
| 函数签名 | `run_rebuild_sdk_projections(input: RebuildSdkProjectionsJobInput, meta: JobMetadata) -> Result<ProjectionRebuildJobResult, SdkProtocolError>` |
| 触发方式 | scheduler / CLI |
| 处理方 | projection rebuild service / `QueryService` support |

```json
{
  "projection_set": ["capability", "evidence", "compatibility", "docs_example"],
  "rebuild_scope": "all",
  "dry_run": false
}
```

```json
{
  "rebuilt": ["capability", "evidence", "compatibility", "docs_example"],
  "skipped": [],
  "consistency": {
    "marker": "projection_rebuilt",
    "version": "projection_v3"
  }
}
```

幂等与审计：使用 `job_run_id + projection_set + rebuild_scope`；只重建 read model，不改写真相。

#### 7.7.9 Job 字段闭环表

| Job | 主要输入 | 目标对象 / 输出 | 必填字段是否齐全 | 缺失处理 |
|---|---|---|---|---|
| `CheckUpstreamFreshness` | source list | `SnapshotFreshnessView` / optional refresh command | 是 | dependency error |
| `GeneratePackageCandidate` | baseline version、language set、candidate version | `PackageCandidate` | 是 | reject / not_found |
| `BuildLanguagePackages` | candidate ID、language set、output ref | `LanguageArtifact`、artifact refs | 是 | not_found / runner error |
| `RunCrossLanguageSmoke` | candidate ID、target profile、suite ref | `VerificationEvidence` | 是 | not_found / runner error |
| `ValidateDocsExamples` | candidate ID、docs example set ref | `VerificationEvidence`、docs projection | 是 | not_found / runner error |
| `CheckCompatibility` | candidate ID、baseline version、evidence refs | `CompatibilityDecision` | 是 | validation / not_found |
| `VerifyBoundaryPolicies` | candidate ID、policy set ref、fixture ref | `VerificationEvidence` | 是 | validation / runner error |
| `RebuildSdkProjections` | projection set、scope | projection views | 是 | validation / projection error |

### 7.8 Step 8 统一复核

#### 7.8.1 协议覆盖复核

| 覆盖项 | 是否覆盖 | 说明 |
|---|---|---|
| Command API | 是 | 6 个 command 已定义签名、入口、schema、字段闭环、错误、幂等 |
| Query API | 是 | 12 个 query 已定义签名、入口、schema、读取来源 |
| Inbound Event Consumer | 是 | 4 个 consumer 已定义 topic、schema、字段闭环、幂等 |
| Outbound Event | 是 | 6 个 event 已定义 topic、payload、版本策略、禁止携带正文 |
| Operations Job | 是 | 8 个 job 已定义 binary、input、output、幂等、审计 |
| 公共错误 envelope | 是 | §7.2.3 / §7.2.4 |
| DTO 落点 | 是 | `crates/contracts/src/{commands,queries,events,jobs}.rs` |
| Rust client / CLI / job 入口 | 是 | §7.1 和各协议小节 |

#### 7.8.2 DTO 到 Domain 对象构造闭环复核

| 协议族 | 目标对象 | 必填字段来源是否齐全 | 备注 |
|---|---|---|---|
| semantic command | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` | 是 | ID / time 由 system port 生成 |
| refresh command / inbound source event | `DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` | 是 | snapshot 由 source port 读取 |
| service command / read query | `ServiceClientView`、`ServiceCapabilityRef`、`BoundaryGuard` | 是 | 不写服务端 truth |
| event command / subscription query | `BusEventClientView`、`EventSemanticMapping`、`BoundaryGuard` | 是 | 不写 bus runtime truth |
| candidate jobs | `PackageCandidate`、`LanguageArtifact` | 是 | artifact ref 由 artifact store 生成 |
| validation jobs / event | `VerificationEvidence` | 是 | result 与 redaction status 分离 |
| compatibility command / job | `CompatibilityDecision` | 是 | evidence lookup 必须成功 |
| deprecated command / query | `DeprecatedApiRecord`、`MigrationGuideRef` | 是 | migration document 只保存 ref |

#### 7.8.3 禁止漂移复核

| 禁止漂移项 | 本 Step 固定口径 |
|---|---|
| SDK 被实现成 HTTP server | 禁止；P0 为 Rust DTO / Rust client method / CLI command / job binary |
| DTO 无法构造目标对象 | 禁止；每个写协议必须有字段闭环 |
| caller 直接指定终态 | 禁止；状态由 domain method / service 根据输入和 runner result 派生 |
| event 携带正文 | 禁止；event payload 只携带 ref、status、summary、digest、version |
| fake success 变成 production success | 禁止；fake marker 必须保留并进入 evidence / boundary result |
| query 隐式写入 | 禁止；query 不触发 refresh、candidate、compatibility 或 projection rebuild |
| job 绕过 application service | 禁止；job binary 通过 runtime handle 调 application service |

---

## 8. 回填草稿

正式 `projects/L0-sdk/03-详细设计.md` 回填时，§7 / §6 应按以下方式引用本文件：

| 正式章节 | 回填来源 | 回填方式 |
|---|---|---|
| §7 API / Command / Query / Event / Job 协议契约 | 本文件 §7.1~§7.7 | 按协议类别摘录总表、公共约定和每个协议小节 |
| §6 全局对象 / Trait / API 索引 | 本文件 §7.1、§7.8.1 | 摘录协议名称、类别、所属模块和处理方 |
| §8 逐接口函数级处理流 | 本文件所有协议小节 | 每个需要处理流的协议进入 Step 9 独立处理流 |
| §11 错误模型、异常分支与恢复口径 | 本文件 §7.2.4 | 作为错误族输入，具体错误码由 Step 12 收口 |
| §12 并发、幂等与重入保护 | 本文件各协议的幂等要求 | 作为 Step 13 输入 |
| §14 可观测性与审计埋点契约 | 本文件 event / job / command 审计要求 | 作为 Step 15 输入 |

回填规则：

- 正式文档不再发明第二套协议名、topic、job binary 或 DTO 字段。
- 如果 Step 9 发现处理流无法从 DTO 构造对象，必须回到本 Step 修正 DTO，而不是在 Step 9 静默补字段。
- 如果后续决定提供 HTTP / RPC server，必须回到架构设计和 Step 4 / Step 5 / Step 8 重新校准，不能直接添加 `crates/api`。

---

## 9. 待确认事项

| 待确认项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| Command / Query 是否设计 HTTP route | A. P0 设计 HTTP；B. P0 使用 Rust DTO + Rust client method / CLI command；C. 同时都做 | 推荐 B | P0 SDK 不是 online server；B 保持边界清晰，未来可由 gateway 包装 |
| 是否把 `OpenEventSubscription` 单独作为 stream API 类别 | A. 单独 stream；B. 作为 Query API；C. 后移不定义 | 推荐 B | P0 只返回 subscription view，不实现 bus runtime 或 callback stream |
| fake / fixture target 是否可以缺省 | A. 可以；B. 必须显式传 target profile 或由 config 明确绑定 | 推荐 B | 防止 fake success 伪装成 production success |
| outbound event 是否携带 package artifact body | A. 携带；B. 只携带 artifact ref / digest | 推荐 B | event 不应传播 artifact body 或 secret |
| job 是否允许直接写 repository | A. 允许；B. 禁止，必须通过 application service | 推荐 B | 保持 evidence、状态、事务和 outbox 统一 |

当前推荐方案已写入本 Step。若后续正式实现需要改变其中任一结论，必须先回到本文件和相关上游文档修正。

---

## 10. 进入下一步条件

进入 Step 9 的条件：

- 所有 P0 Command / Query / Inbound Event / Outbound Event / Operations Job 均已有协议小节。
- 每个写协议都能构造或影响明确的 Step 6 Domain 对象。
- 每个协议都能找到 Step 7 处理方、port 或 adapter 边界。
- 公共错误 envelope、幂等、审计和禁止携带正文规则已经固定。
- P0 不提供 HTTP server / gRPC server 的边界已经写清。

下一步：

```text
Step 9. 逐接口定义函数级处理流

重点问题:
1. 每个 Command / Event Consumer / Job 的入口函数如何调用 application service?
2. DTO 在哪一步校验、派生、lookup 或转换为 Domain 对象?
3. 事务在哪里开始、提交和回滚?
4. 哪些 protocol error 映射到 Step 12 错误模型?
5. 每条流至少需要哪些测试切口?
```
