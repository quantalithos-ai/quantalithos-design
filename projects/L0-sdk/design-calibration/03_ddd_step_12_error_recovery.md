# Step 12. 定义错误模型、异常分支与恢复口径

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 12 中间产物。
> 本步只收稳 SDK 代码层错误类型、协议错误映射、异常分支、可重试性、诊断 / 审计 / 事件口径和恢复策略。
> 本步不新增协议字段、port、正式状态 enum variant 或新的对外错误码。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L0-sdk/03-详细设计.md` §11 错误模型、异常分支与恢复口径

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已定义 `SdkDomainError`、`SdkClientError` 返回位置，以及 evidence / candidate / compatibility / boundary policy 的不变量 | 作为领域错误来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已定义 repository、source、boundary、runner、artifact、outbox、projection 等 port 的错误返回边界 | 作为依赖错误来源 |
| `03_ddd_step_08_protocol_contracts.md` | 已定义 `SdkProtocolError`、`SdkErrorEnvelope`、CLI exit code 和公共错误映射 | 作为对外错误真相源 |
| `03_ddd_step_09_function_flows.md` | 已定义每个 command / query / event / job 的异常分支、事务回滚和状态副作用 | 作为异常分支来源 |
| `03_ddd_step_10_state_matrix.md` | 已定义状态转换矩阵和非法转换口径 | 作为状态错误来源 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已定义 truth、idempotency、outbox、projection、artifact 的事务和恢复规则 | 作为恢复策略来源 |

已确认结论：

```text
L0-sdk P0 不是 HTTP / gRPC server。
同步入口是 Rust DTO + Rust client method / CLI command / job binary。
对外错误主线沿用 Step 8 的 SdkProtocolError 与 SdkErrorEnvelope。
协议错误码只允许 invalid_argument / not_found / conflict / boundary_violation / dependency_unavailable / internal。
runner 返回“验证失败”是业务结果，应形成 Failed evidence；runner 自身不可用才是 Dependency 错误。
query 不自动修复 projection；outbox publish 失败不回滚已提交 truth。
```

---

## 3. SOP 问题回答

### 3.1 每个模块有哪些错误类型？

| 模块 | 错误类型 / 错误来源 | 说明 |
|---|---|---|
| `contracts` | `SdkProtocolError`、`SdkErrorEnvelope` | 对外协议错误和错误 envelope |
| `domain_semantic` | `SdkDomainError` | 语言集合、能力模型、概念映射和语义基线不变量错误 |
| `domain_upstream_view` | `SdkDomainError` | snapshot freshness、上游 ref、derived view 派生错误 |
| `domain_service_client` | `SdkDomainError` / `SdkClientError` | service capability 不可调用、fake / formal 边界不一致 |
| `domain_event_client` | `SdkDomainError` / `SdkClientError` | bus semantic 不对齐、event mapping 缺失或不可发布 |
| `domain_boundary_policy` | `SdkDomainError` | raw body、secret、fake success、trace 和 redaction 边界违规 |
| `domain_package_candidate` | `SdkDomainError` | candidate 状态门禁、artifact digest、stable gate 错误 |
| `domain_evidence` | `SdkDomainError` | evidence result、redaction status、fake marker 和安全引用错误 |
| `domain_compatibility_evolution` | `SdkDomainError` | compatibility decision、migration ref、deprecated lifecycle 错误 |
| `application_services` | `SdkProtocolError` | 汇总 domain / port / idempotency 错误并映射到协议边界 |
| `application_ports` / `infra_adapters` | `RepositoryError`、`SourceError`、`BoundaryError`、`RunnerError`、`ArtifactError`、`OutboxError`、`ProjectionError` | 外部依赖、存储、runner、artifact 和 outbox 的 I/O 错误 |
| `rust_client_facade` | `SdkClientError` | Rust consumer 看到的 client facade 错误，必须可映射到 `SdkProtocolError` |
| `cli_entry` / `jobs` | `SdkProtocolError` -> CLI exit code / JSON envelope | 入口层不发明新错误族 |

### 3.2 哪些错误映射到 HTTP / RPC / Event 失败？

P0 不提供 HTTP / RPC server，因此正式实现只要求 Rust `Result`、CLI exit code 和 JSON error envelope。未来若 gateway 包装 HTTP / RPC，必须沿用本表，不得新增 SDK 错误码。

| `SdkProtocolError` | Error envelope code | CLI exit code | 未来 HTTP 映射 | 未来 RPC 映射 | 调用方处理 |
|---|---|---:|---:|---|---|
| `Validation` | `invalid_argument` | 2 | 400 | `INVALID_ARGUMENT` | 修正输入后重试 |
| `NotFound` | `not_found` | 3 | 404 | `NOT_FOUND` | 检查 ID / ref 或先创建资源 |
| `Conflict` | `conflict` | 4 | 409 | `ABORTED` | 重新读取当前状态后重试 |
| `BoundaryViolation` | `boundary_violation` | 5 | 422 | `FAILED_PRECONDITION` | 修正正文、secret、fake marker 或边界用法 |
| `Dependency` | `dependency_unavailable` | 6 | 503 | `UNAVAILABLE` | 等依赖恢复后重试 |
| `Internal` | `internal` | 1 | 500 | `INTERNAL` | 保留 diagnostic ref 并人工排查 |

Event 失败不等同于同步 HTTP / RPC 失败：

| Event 场景 | 表达方式 |
|---|---|
| inbound event 字段缺失或 ref 缺失 | consumer 返回 rejected / `Validation`，不得派生缺失字段 |
| inbound event 依赖暂不可用 | consumer 返回 failed / `Dependency`，由事件来源或 job 重试 |
| outbound outbox publish 失败 | truth 不回滚；outbox 保留 pending / retryable |
| event payload 包含 raw body / secret | `BoundaryViolation`，不得写成功 outbox publish 记录 |

### 3.3 哪些错误可重试，哪些不可重试，哪些需要人工介入？

| 错误类别 | 可重试性 | 重试前提 |
|---|---|---|
| `Validation` | 不可原样重试 | 调用方修正字段、ID 类型、version range 或 schema 后重试 |
| `NotFound` | 通常不可原样重试 | 资源确实存在后再重试；projection 延迟场景可稍后查询 |
| `Conflict` | 可重试 | 重新读取 latest version、刷新幂等记录或更换 candidate version |
| `BoundaryViolation` | 不可原样重试 | 移除 raw body / secret，补 fake marker，修正 evidence redaction 后重试 |
| `Dependency` | 可重试 | source、runner、boundary、artifact store、outbox publisher 或 projection store 恢复 |
| `Internal` | 不建议自动重试 | 保留 trace / diagnostic ref，由维护者判断 |
| runner 校验失败 | 不是协议错误 | 记录 `EvidenceResult::Failed`，后续修正候选或测试再跑 |
| breaking compatibility | 不是协议错误 | 记录 `CompatibilityDecisionState::Breaking` 或 `RequiresMigration` |

### 3.4 事务失败、并发冲突、重复请求、外部依赖失败如何处理？

| 场景 | 处理方式 |
|---|---|
| truth / idempotency / required projection / outbox append 同事务失败 | 回滚整个 UoW，返回对应 `Conflict`、`BoundaryViolation`、`Dependency` 或 `Internal` |
| expected version 冲突 | 返回 `Conflict`；调用方重新读取最新对象后重试 |
| 幂等 key 重复且 digest 一致 | 返回已有 receipt 或已提交结果；细节由 Step 13 固定 |
| 幂等 key 重复但 digest 不一致 | 返回 `Conflict`，不得覆盖既有记录 |
| source snapshot 暂不可用 | 不写 SDK truth，返回 retryable `Dependency` |
| runner / builder / generator 不可用 | 不写成功状态，返回 retryable `Dependency` |
| runner 返回失败结果 | 不是依赖错误；按 flow 记录 failed evidence 或阻断 stable |
| artifact body 已写入但 truth 事务失败 | artifact 成为 orphan，不进入 candidate truth；后续清理 job 处理 |
| outbox publish 失败 | 不回滚 truth；outbox 保留 pending / retryable |
| projection rebuild batch 失败 | 回滚该 batch，truth 不变，旧 projection 保留 |

### 3.5 哪些异常需要写审计、日志或事件？

| 异常 | 审计 / 诊断 | 事件 | 日志 |
|---|---|---|---|
| DTO validation 失败 | 不写成功审计；可写入口诊断 | 否 | debug / warn |
| boundary violation | 必须保留 diagnostic ref；不得记录 raw body / secret | 否 | warn |
| domain illegal transition | 写路径可记录失败审计意图 | 不写成功事件 | warn |
| failed evidence / breaking compatibility | 记录 evidence / decision 事实 | 写对应成功事实事件，表示“已记录失败结果” | info / warn |
| repository / projection / outbox append 事务失败 | 同事务审计不可靠；依赖日志和 diagnostic ref | 否 | error |
| outbox publish 失败 | 记录 publish attempt 或保留 retry marker | 不新造业务事件 | warn / error |
| query not found / stale | 通常不审计 | 否 | debug / info |
| job runner unavailable | job summary 记录失败和 diagnostic ref | 否 | error |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| Step 6 只标出 `SdkDomainError` / `SdkClientError` 返回位置，没有集中说明映射 | 实现者可能为每个模块各造一套错误码 | 本步集中规定所有内部错误都映射到 Step 8 的 `SdkProtocolError` |
| Step 8 已有公共错误映射，但特殊错误分散在各接口 | 难以判断可重试性和恢复动作 | 本步按错误类别统一可重试 / 不可重试 / 人工介入口径 |
| Step 9 中 runner failure 和 runner result failed 容易混淆 | 可能把业务验证失败误当依赖错误 | 本步明确 runner 不可用是 `Dependency`，验证失败是 evidence / decision 事实 |
| Step 11 已定义 outbox / projection 恢复，但没有映射到错误处理代码 | 实现时可能错误回滚 truth 或自动修 projection | 本步把恢复动作转成错误分支和恢复表 |
| P0 没有 HTTP / RPC server，但协议表要求映射 | 可能误建 `crates/api` 或 HTTP route | 本步只给未来 gateway 映射，P0 实现仍是 Rust DTO / CLI / job |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 错误来源 | domain、client、port、protocol 分散出现 | 明确错误来源和统一映射边界 |
| 对外错误 | Step 8 有公共表，缺少恢复解释 | 补齐 CLI / envelope / 未来 HTTP RPC / 调用方处理 |
| runner 失败 | 依赖失败和验证失败容易混用 | runner unavailable 是 `Dependency`；验证不通过是 failed evidence |
| transaction failure | Step 11 有事务表 | 本步映射到回滚、重试和诊断动作 |
| boundary violation | 分散在 service call、event publish、evidence | 统一为不可原样重试，必须修正边界输入 |
| projection stale | 可能被 query 自动修复 | query 只返回 stale marker 或错误，不写 projection |

---

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否新增 SDK 专用错误码 | 为每类业务错误新增 code | 只用 Step 8 六类 `SdkProtocolError` code | B | P0 需要稳定协议面，细节放 message / diagnostic ref |
| runner 返回 failed 是否算错误 | 返回 `Dependency` 或 `Validation` | 记录 failed evidence / breaking decision | B | 校验失败是业务事实，不是运行失败 |
| projection stale 是否触发自动 rebuild | query 自动修复 | query 返回 stale marker；rebuild job 显式修复 | B | query 不能隐式写 truth / projection |
| outbox publish failure 是否回滚 truth | 回滚业务提交 | 保留 outbox pending / retryable | B | publish 在 commit 后执行，不能破坏已提交事实 |
| boundary violation 是否可自动脱敏后继续 | 入口层自动修正 | 直接拒绝，要求调用方或 runner 提供合规 ref | B | 防止 raw body / secret 被悄悄持久化或传播 |

---

## 7. 结构化中间产物

### 7.1 错误模型总览

```text
[domain_*] SdkDomainError
        |
        v
[application_services] map domain / port / client errors
        |
        v
[contracts] SdkProtocolError -> SdkErrorEnvelope -> CLI exit / JSON output

[application_ports / infra_adapters]
  RepositoryError / SourceError / BoundaryError / RunnerError
  ArtifactError / OutboxError / ProjectionError
        |
        v
[application_services] map to Dependency / Conflict / Internal

[rust_client_facade]
  SdkClientError -> SdkProtocolError-compatible client error
```

关键说明：

- `domain_*` 不知道 CLI、HTTP、RPC、job summary 或 JSON envelope。
- `application_services` 是错误收口层，负责把 domain / port / client 错误映射为 `SdkProtocolError`。
- `cli_entry`、`jobs` 和 Rust client facade 只做入口 / 输出转换，不发明新的错误码。
- `ErrorMappingPolicy` 只负责错误语义、语言形态和脱敏约束，不保存 raw error body。

### 7.2 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `SdkProtocolError::Validation` | `contracts` / `application_services` | DTO 字段缺失、格式错误、version range 不合法 | 修正后可重试 | `invalid_argument` |
| `SdkProtocolError::NotFound` | `application_services` | baseline、view、candidate、evidence、decision、deprecated API、ref 不存在 | 资源存在后可重试 | `not_found` |
| `SdkProtocolError::Conflict` | `application_services` | expected version、idempotency digest、candidate version、lifecycle 冲突 | 重新读取后可重试 | `conflict` |
| `SdkProtocolError::BoundaryViolation` | `domain_boundary_policy` / `rust_client_facade` | raw body、secret、fake success、unredacted evidence、fake marker 缺失 | 修正边界后可重试 | `boundary_violation` |
| `SdkProtocolError::Dependency` | `application_services` | source、formal API、bus boundary、runner、builder、artifact store、outbox publisher、projection store 暂不可用 | 依赖恢复后可重试 | `dependency_unavailable` |
| `SdkProtocolError::Internal` | `application_services` / `infra_adapters` | 未分类错误、bug、不应发生的不变量破坏 | 需人工判断 | `internal` |
| `SdkDomainError` | `domain_*` | 领域对象不变量、状态迁移、门禁、digest、redaction、compatibility 不满足 | 视映射结果而定 | 映射为六类 `SdkProtocolError` |
| `SdkClientError` | `rust_client_facade` | Rust client 构造、service call、read、publish、subscription 边界失败 | 视映射结果而定 | 映射为 `SdkProtocolError` 兼容输出 |
| `RepositoryError` | `application_ports` / `infra_adapters` | 读写 store、version conflict、idempotency conflict、UoW failure | conflict / dependency 可重试 | `conflict` / `dependency_unavailable` |
| `SourceError` | `application_ports` / `infra_adapters` | core / bus / formal API snapshot source 不可用 | 可重试 | `dependency_unavailable` |
| `BoundaryError` | `application_ports` / `infra_adapters` | formal API、fake boundary 或 bus boundary 调用失败 | 可重试或边界修正后重试 | `dependency_unavailable` / `boundary_violation` |
| `RunnerError` | `application_ports` / `infra_adapters` | smoke、docs、compatibility、boundary verifier runner 无法运行 | 可重试 | `dependency_unavailable` |
| `ArtifactError` | `application_ports` / `infra_adapters` | artifact store 写入、读取、digest verify 失败 | 依赖恢复后可重试；digest mismatch 不可原样重试 | `dependency_unavailable` / `invalid_argument` |
| `OutboxError` | `application_ports` / `infra_adapters` | outbox append、load pending、mark published 失败 | 依赖恢复后可重试 | `dependency_unavailable` |
| `ProjectionError` | `application_ports` / `infra_adapters` | required projection update 或 rebuild batch 失败 | 可重试 | `dependency_unavailable` |

### 7.3 内部错误到对外错误映射表

| 内部错误 / 场景 | `SdkProtocolError` | Error envelope code | CLI exit code | 调用方应如何处理 |
|---|---|---|---:|---|
| DTO 缺少必填字段 | `Validation` | `invalid_argument` | 2 | 补齐字段后重试 |
| ID / ref 格式错误 | `Validation` | `invalid_argument` | 2 | 修正格式后重试 |
| language set 不包含 Rust / Python / TypeScript | `Validation` | `invalid_argument` | 2 | 修改 baseline change |
| capability source / candidate / evidence 不存在 | `NotFound` | `not_found` | 3 | 检查 ref 或先创建对象 |
| repository version conflict | `Conflict` | `conflict` | 4 | 重新读取最新版本后重试 |
| idempotency digest mismatch | `Conflict` | `conflict` | 4 | 更换 idempotency key 或使用原 payload |
| illegal state transition | `Conflict` | `conflict` | 4 | 重新读取当前状态，按允许转换重试 |
| stale view 阻断 candidate | `Conflict` | `conflict` | 4 | 先刷新 derived view |
| raw body / secret 进入协议 | `BoundaryViolation` | `boundary_violation` | 5 | 改为传 ref / digest，不传正文 |
| fake marker 缺失或 fake success 被当成 production success | `BoundaryViolation` | `boundary_violation` | 5 | 补 fake marker 或改走 formal boundary |
| evidence unredacted | `BoundaryViolation` | `boundary_violation` | 5 | 重新生成 redacted evidence |
| source snapshot 暂不可用 | `Dependency` | `dependency_unavailable` | 6 | 等 source 恢复后重试 |
| formal API / bus boundary 暂不可用 | `Dependency` | `dependency_unavailable` | 6 | 等 boundary 恢复后重试 |
| runner / builder / generator 无法运行 | `Dependency` | `dependency_unavailable` | 6 | 修复工具链或 runner 后重试 |
| outbox publisher unavailable | `Dependency` | `dependency_unavailable` | 6 | 保留 pending，后续 retry |
| 未分类 bug / invariant broken | `Internal` | `internal` | 1 | 上报 diagnostic ref，人工排查 |

### 7.4 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| `UpdateSdkSemanticBaseline` 输入语言集合不完整 | DTO validation / domain semantic | 返回 `Validation`，不写 baseline | 不写成功事件；可写入口诊断 |
| capability source 不存在 | source lookup | 返回 `NotFound` 或 `Dependency`，不写 truth | 不写事件 |
| `RefreshDerivedBindingView` source 不可用 | source port | 返回 `Dependency`，不保存 view | 不写 freshness success event |
| derived view 乐观锁冲突 | repository save | UoW 回滚，返回 `Conflict` | 不写成功事件 |
| `InvokeServiceCapability` fake marker 缺失 | `BoundaryGuard` | 返回 `BoundaryViolation`，不调用 fake / formal boundary | 记录 diagnostic ref，不写 truth |
| `PublishBusEvent` payload body 直接传入 | `RedactionPolicy` / `BoundaryGuard` | 返回 `BoundaryViolation`，不调用 bus boundary | 不写 bus publish success |
| `RecordCompatibilityDecision` evidence 缺失 | evidence lookup | 返回 `NotFound` 或 `Validation`，不写 decision | 不写 compatibility event |
| migration required 但缺 migration ref | compatibility domain | 返回 `Validation`，不写 decision | 不写 compatibility event |
| deprecated lifecycle 非法迁移 | deprecated domain | 返回 `Conflict`，不保存 record | 可写失败诊断，不写成功事件 |
| inbound upstream event 缺 source ref | event validation | 返回 rejected / `Validation`，不派生 ref | 可写 consumer diagnostic |
| inbound validation event evidence unredacted | evidence domain | UoW 回滚，返回 `BoundaryViolation` | 不写 evidence recorded event |
| query 对象不存在 | projection / repository lookup | 返回 `NotFound` 或空 page | 不审计，不写事件 |
| query projection stale | query service | 允许 stale 时返回 consistency marker；不允许时返回 `Dependency` | 不自动 rebuild |
| outbox append 失败 | write transaction | 回滚 truth，返回 `Dependency` | 不写业务成功事件 |
| outbox publish 失败 | publisher flow | truth 不回滚；outbox 保留 pending / retryable | 记录 publish attempt |
| projection rebuild batch 失败 | rebuild job | 回滚 batch，truth 不变 | job summary 记录失败 |

### 7.5 恢复口径表

| 失败类别 | 恢复动作 | 自动 / 手动 | 不得做的事 |
|---|---|---|---|
| validation failure | 调用方修正 request / command / job input 后重试 | 手动或上游修正 | 不得自动猜测缺失字段 |
| not found | 创建缺失对象、修正 ref 或等待 projection 可见后重试 | 手动为主 | 不得自动创建 candidate / evidence |
| version conflict | 重新读取最新版本并重新计算 command | 手动或 client 重试 | 不得覆盖 expected version |
| idempotency conflict | 使用原 payload 查询 receipt，或更换 key | 手动 | 不得用新 payload 覆盖旧 key |
| boundary violation | 移除正文 / secret，补 fake marker，生成 redacted evidence | 手动 | 不得在错误路径保存 raw body |
| source unavailable | 等 core / bus / formal API source 恢复后重跑 job | 自动可重试 | 不得复制上游 truth 到 SDK |
| runner / builder unavailable | 修复工具链、fixture、runner 环境后重跑 job | 自动可重试，失败过多后人工 | 不得写 verified / stable |
| failed verification result | 修正 candidate、docs、boundary 或测试，再生成新 evidence | 手动为主 | 不得把 failed / skipped 当 passed |
| breaking compatibility | 补 migration 或调整 API，再重新记录 decision | 手动 | 不得直接 mark stable |
| artifact orphan | 清理未被 truth 引用的 artifact | operations job | 不得把 orphan 回填到 candidate |
| outbox publish failure | 按 pending cursor 重试 publish | 自动可重试 | 不得回滚已提交 truth |
| projection rebuild failure | 从 cursor / scope 重跑 batch | 自动可重试 | 不得反写真相 |
| internal error | 保留 diagnostic ref、trace id 和最小上下文 | 人工 | 不得暴露 secret / raw body |

### 7.6 审计、诊断、日志和事件口径

| 输出类型 | 规则 |
|---|---|
| `SdkErrorEnvelope` | 必须包含 code、message、retryable、diagnostic_ref；不得包含 raw body / secret |
| CLI output | 成功输出 data；失败输出 error envelope；exit code 使用 §7.3 |
| job summary | 记录 job_run_id、目标对象 ref、结果、错误 code、diagnostic_ref；不得记录正文 |
| diagnostic ref | boundary violation、dependency、internal、runner unavailable 必须保留 |
| domain success event | 只在 truth 已提交且 outbox append 成功后出现 |
| failed evidence event | 允许发布，因为“验证失败”是已记录事实 |
| dependency failure | 不发布业务成功事件；仅保留诊断 / job summary |
| query failure | 不写审计和事件，除非 Step 15 明确要求操作日志 |

### 7.7 Step 12 统一复核

| 检查项 | 结论 |
|---|---|
| 是否新增协议错误码 | 否；沿用 Step 8 六类错误码 |
| 是否新增 HTTP / RPC server | 否；只给未来 gateway 映射 |
| 是否区分 runner 不可用和验证失败 | 是 |
| 是否区分 outbox append 和 outbox publish | 是 |
| 是否禁止 query 自动修复 projection | 是 |
| 是否定义可重试 / 不可重试 / 人工介入 | 是 |
| 是否能支撑实现错误处理代码 | 是 |

---

## 8. 回填草稿

正式 `03-详细设计.md` §11 建议按以下结构回填：

```text
11. 错误模型、异常分支与恢复口径
  11.1 错误模型总览
  11.2 错误类型表
  11.3 内部错误到对外错误映射
  11.4 异常分支处理表
  11.5 恢复口径表
  11.6 审计、诊断、日志和事件口径
  11.7 实现约束
```

回填来源：

| 正式章节 | 回填来源 |
|---|---|
| §11.1 | 本文件 §7.1 |
| §11.2 | 本文件 §7.2 |
| §11.3 | 本文件 §7.3 |
| §11.4 | 本文件 §7.4 |
| §11.5 | 本文件 §7.5 |
| §11.6 | 本文件 §7.6 |
| §11.7 | 本文件 §7.7 |

需要在正式文档中显式引用：

```text
本章结论来自 design-calibration/03_ddd_step_12_error_recovery.md。
如需理解错误来源、可重试性、异常分支和恢复策略，应继续阅读该中间产物全文。
```

---

## 9. 待确认事项

无。

已自动采用的方案：

| 决策 | 已采用方案 | 原因 |
|---|---|---|
| 对外错误码 | 沿用 Step 8 六类 `SdkProtocolError` | 避免协议面漂移 |
| runner failed result | 记录 failed evidence，不作为 dependency error | 验证失败是业务事实 |
| projection stale | query 返回 marker 或错误，不自动 rebuild | query 不写状态 |
| outbox publish failure | 保留 pending / retryable，不回滚 truth | publish 位于 truth commit 后 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 错误类型已经覆盖 domain / protocol / client / port / job / CLI | [x] |
| 外部映射已经覆盖 CLI、JSON envelope 和未来 HTTP / RPC 包装口径 | [x] |
| 异常分支已经覆盖 command、query、event、job、outbox 和 projection | [x] |
| 恢复策略已经区分可重试、不可重试和人工介入 | [x] |
| 未新增协议字段、port、状态 enum variant 或新错误码 | [x] |

下一步可进入 Step 13：定义并发、幂等与重入保护。
