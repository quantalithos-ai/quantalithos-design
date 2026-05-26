# Step 14. 定义配置引用与外部依赖绑定

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14
- 回填章节：`03-详细设计.md` §13 配置引用与外部依赖绑定

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| 架构设计外部依赖 | PostgreSQL、object storage、L0-bus、governance、gateway、P1 cache / marketplace 后置 |
| Step 4 实现单元 | 已确认 `method_library_infra` 实现 PostgreSQL / L0-bus / object storage / governance adapter,`method_library_api` 负责 Gateway context,`method_library_worker` 负责 outbox relay / jobs |
| Step 5 模块主轴 | 已确认 domain 不读配置,application 只依赖 port / settings value,infra / api / worker 负责配置绑定 |
| Step 7 Port / Adapter 契约 | 已确认 `GovernancePort`、`BusPublisherPort`、`ObjectStoragePort`、`FeatureFlagPort`、`ObservabilityPort` 等 port 边界 |
| Step 8 / 9 协议与处理流 | 已确认 HTTP JSON 入口、Gateway headers、outbox relay、snapshot payload、governance gate、operations job |
| Step 11~13 一致性与幂等 | 已确认 outbox retry、checkpoint、lease、idempotency retention、dry_run 等实现约束 |

已确认结论：

```text
本步只定义代码需要读取哪些配置、在哪些模块绑定外部依赖、超时/重试/降级口径。
本步不编写完整配置手册、不定义部署环境变量命名规范、不替代后续配置设计文档。
Domain 层不读取配置。
Application 层可以接收已解析的 settings value 或 port trait,但不直接读取 env/file。
Infra / API / Worker 是配置绑定和 adapter 装配的主要位置。
```

依赖的前序 Step：

```text
Step 1~13 已确认范围、模块、对象、port、协议、处理流、状态、事务、错误和并发幂等规则。
```

---

## 3. SOP 问题回答

1. 哪些模块需要读取配置？

   回答：`api` 读取 HTTP 入口、Gateway trusted header 和 P1 endpoint 开关；`infra::persistence` 读取 PostgreSQL 连接池和事务超时；`infra::outbound_adapters` 读取 governance、L0-bus、object storage 连接配置；`worker` 读取 outbox relay、replay、rebuild、seed、fingerprint job 的 batch、retry、lease、dry_run 默认值；`application` 只接收 `MethodLibrarySettings` 中已解析的 value object 和 port,不直接读取 env/file；`domain` 不读取任何配置。

2. 配置项的类型、默认值和读取位置是什么？

   回答：P0 必须配置数据库连接、事件 topic、object storage bucket/prefix、governance endpoint 或 adapter 模式、Gateway trusted header、outbox retry/lease、job batch size、idempotency retention、snapshot schema version、feature flags 等。安全或外部地址类配置默认值为“无默认,必须显式配置”；batch、timeout、retry 类配置可有保守默认值；P1 feature 默认关闭。

3. 哪些外部依赖需要通过 adapter 注入？

   回答：PostgreSQL 通过 repository / `UnitOfWork` adapter 注入；governance 通过 `GovernancePort` 注入；L0-bus 通过 `BusPublisherPort` 注入；object storage 通过 `ObjectStoragePort` 注入；observability 通过 `ObservabilityPort` 注入；feature flag 可通过 `FeatureFlagPort` 注入。Gateway 不是本仓 outbound dependency,但 API adapter 必须按可信 header 契约提取上下文。

4. 外部依赖的超时、重试、降级策略是什么？

   回答：PostgreSQL 连接失败返回 `PERSISTENCE_UNAVAILABLE`,事务提交失败整体失败,不在业务层盲重试。governance 不可用阻断 publish / supersede,不阻断 draft / query。object storage 写 snapshot payload 失败阻断 publish;读 snapshot payload 失败返回外部依赖错误。L0-bus 失败不回滚已提交 truth,由 outbox retry / dead-letter / replay 恢复。observability 失败默认不阻断业务。P1 dependency 关闭或失败不得影响 P0 主链。

5. 哪些配置细节应留给配置设计文档？

   回答：具体环境变量命名、secret 管理、TLS、认证凭据、连接池容量公式、topic 命名规范、retry 曲线参数、对象存储生命周期策略、observability exporter 细节、部署覆盖规则、P1 marketplace/cache 配置细节留给后续配置设计文档。本步只保留实现者必须知道的绑定点和默认口径。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `03-详细设计.md` 端口 / adapter 章节 | 已定义 port,但没有集中说明这些 port 的配置来源和绑定位置 | 实现者知道 trait,但不知道在哪里装配 adapter |
| 旧 outbox / job 章节 | 有 retry、checkpoint、dry_run,但缺少对应配置引用表 | worker 实现容易硬编码 batch、lease 和 retry 参数 |
| 旧 API 章节 | 写了 Gateway headers,但没有把 trusted header / P1 endpoint feature flag 作为配置绑定点 | API 层安全边界和 P1 开关不够明确 |
| 旧架构 §11.5 | 配置管理只列大类 | 详细设计还需要落到模块、类型、默认值和回指位置 |
| 旧文 P1 相关配置 | P1 plugin / configuration / cache / marketplace 夹杂出现 | 需要明确 P1 配置默认关闭且不阻塞 P0 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置组织 | 分散在 API、outbox、job、adapter 文本中 | 集中为配置引用表 | 实现者可一次确认需要哪些 settings |
| 外部依赖 | 只在 port 表中出现 | 增加依赖绑定表,说明绑定位置、接口、超时/重试/降级 | 支撑 infra 装配和故障处理 |
| 配置读取位置 | 不够明确 | 明确 infra / api / worker 读取配置,application 接收 settings value,domain 不读配置 | 保持依赖方向 |
| P1 配置 | 容易和 P0 混读 | P1 feature 默认关闭,失败不影响 P0 | 保持 P0 / P1 边界 |
| retry / timeout | 散落在恢复策略中 | 作为配置项引用,具体数值可由配置设计文档细化 | 避免硬编码 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在详细设计中写完整配置手册 | 实现时看似完整 | 会过早绑定部署、secret、环境变量和运维策略 | 不采用 |
| 只说“按环境配置” | 简短 | 实现者无法知道哪些模块要读什么配置 | 不采用 |
| 详细设计只写代码绑定点,完整值和命名留配置设计文档 | 保持设计粒度正确,足够指导装配 | 后续仍需配置文档落环境变量和部署值 | 采用 |
| Application service 直接读取 env | 写起来方便 | 破坏测试性和分层边界 | 不采用 |
| Infra / API / Worker 读取配置并注入 port / settings | 依赖方向清楚,便于测试替换 adapter | 需要启动装配层 | 采用 |

---

## 7. 结构化中间产物

### 7.1 配置绑定关系图

```text
[Runtime Config Source]
  env / file / deployment secret / config service
        |
        v
[method_library_api]
  - ApiServerSettings
  - GatewayHeaderSettings
  - FeatureFlagSettings
        |
        v
[method_library_application]
  - receives MethodLibrarySettings value
  - depends on ports, not env/file
        |
        +--> [method_library_infra]
        |      - PostgresSettings -> repositories / UnitOfWork
        |      - GovernanceClientSettings -> GovernancePort
        |      - ObjectStorageSettings -> ObjectStoragePort
        |      - BusPublisherSettings -> BusPublisherPort
        |
        +--> [method_library_worker]
               - OutboxRelaySettings
               - JobSettings
               - ProjectionSettings

[method_library_domain]
  - no config read
```

关键说明：

- 配置源只在启动装配层读取,不得散落到 domain object 或 repository 调用点。
- `MethodLibrarySettings` 是已解析配置值,不是环境变量访问器。
- 外部依赖通过 port trait 注入,测试可替换为 fake / deterministic adapter。

### 7.2 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|
| `api.bind_addr` | `SocketAddr` | `method_library_api` | 无默认,必须显式配置 | 配置设计文档:API server |
| `api.request_body_limit` | `usize` | `method_library_api` | 保守默认,具体值待配置设计文档 | 配置设计文档:API limits |
| `gateway.trusted_header_name` | `String` | `method_library_api::extractors` | `x-gateway-trusted-by` | 配置设计文档:Gateway headers |
| `gateway.trusted_header_value` | `String` | `method_library_api::extractors` | 无默认,必须显式配置 | 配置设计文档:Gateway headers |
| `database.url` | `SecretString` | `method_library_infra::persistence` | 无默认,必须显式配置 | 配置设计文档:PostgreSQL |
| `database.max_connections` | `u32` | `method_library_infra::persistence` | 保守默认,具体值待容量设计 | 配置设计文档:PostgreSQL |
| `database.acquire_timeout_ms` | `u64` | `method_library_infra::persistence` | 保守默认 | 配置设计文档:PostgreSQL |
| `database.statement_timeout_ms` | `u64` | `method_library_infra::persistence` | 保守默认 | 配置设计文档:PostgreSQL |
| `idempotency.retention_days` | `u32` | `method_library_application` / `infra::persistence` | 不得短于审计结果可查询期,具体值待配置设计 | 配置设计文档:Reliability |
| `outbox.batch_size` | `u32` | `method_library_worker::outbox_relay` | 保守默认 | 配置设计文档:Outbox relay |
| `outbox.lease_timeout_ms` | `u64` | `method_library_worker::outbox_relay` | 保守默认 | 配置设计文档:Outbox relay |
| `outbox.max_attempts` | `u32` | `method_library_worker::outbox_relay` | 保守默认 | 配置设计文档:Outbox relay |
| `outbox.retry_backoff_ms` | `BackoffConfig` | `method_library_worker::outbox_relay` | 保守默认 | 配置设计文档:Outbox relay |
| `event_bus.endpoint` | `Url` | `method_library_infra::bus` | 无默认,必须显式配置 | 配置设计文档:L0-bus |
| `event_bus.topics.definition_events` | `Topic` | `method_library_infra::bus` / `worker` | 无默认,必须显式配置 | 配置设计文档:L0-bus topics |
| `event_bus.topics.lifecycle_events` | `Topic` | `method_library_infra::bus` / `worker` | 无默认,必须显式配置 | 配置设计文档:L0-bus topics |
| `event_bus.publish_timeout_ms` | `u64` | `method_library_infra::bus` | 保守默认 | 配置设计文档:L0-bus |
| `governance.endpoint` | `Option<Url>` | `method_library_infra::governance` | 无默认;若 P0 publish 依赖远程校验则必须配置 | 配置设计文档:Governance |
| `governance.validation_mode` | `GateValidationMode` | `method_library_infra::governance` | `remote_required` 或由部署显式选择 | 配置设计文档:Governance |
| `governance.timeout_ms` | `u64` | `method_library_infra::governance` | 保守默认 | 配置设计文档:Governance |
| `object_storage.backend` | `ObjectStorageBackend` | `method_library_infra::blob` | 无默认,必须显式配置 | 配置设计文档:Object storage |
| `object_storage.bucket` | `String` | `method_library_infra::blob` | 无默认,必须显式配置 | 配置设计文档:Object storage |
| `object_storage.snapshot_prefix` | `String` | `method_library_infra::blob` | 保守默认,具体命名待配置设计 | 配置设计文档:Object storage |
| `object_storage.put_timeout_ms` | `u64` | `method_library_infra::blob` | 保守默认 | 配置设计文档:Object storage |
| `snapshot.schema_version` | `SnapshotSchemaVersion` | `method_library_application::sync_services` | 当前 P0 schema 版本,由发布配置显式指定 | 配置设计文档:Snapshot |
| `fingerprint.canonical_schema_version` | `CanonicalSchemaVersion` | `method_library_application::policies` / support adapter | 当前 P0 canonical 版本,由发布配置显式指定 | 配置设计文档:Fingerprint |
| `query.default_page_size` | `u32` | `method_library_application::query_services` | 保守默认 | 配置设计文档:Query limits |
| `query.max_page_size` | `u32` | `method_library_application::query_services` | 保守默认 | 配置设计文档:Query limits |
| `projection.stale_threshold_ms` | `u64` | `method_library_application::query_services` / `worker` | 保守默认 | 配置设计文档:Projection |
| `jobs.default_batch_size` | `u32` | `method_library_worker::jobs` | 保守默认 | 配置设计文档:Operations jobs |
| `jobs.max_batch_size` | `u32` | `method_library_worker::jobs` | 保守默认 | 配置设计文档:Operations jobs |
| `jobs.default_dry_run` | `bool` | `method_library_worker::jobs` | `true` for destructive/reporting jobs where applicable | 配置设计文档:Operations jobs |
| `features.p1_plugin_enabled` | `bool` | `method_library_api` / `application` | `false` | 配置设计文档:Feature flags |
| `features.p1_configuration_enabled` | `bool` | `method_library_api` / `application` | `false` | 配置设计文档:Feature flags |
| `features.governance_inbound_projection_enabled` | `bool` | `method_library_worker` / `api` | `false` 或部署显式选择 | 配置设计文档:Feature flags |
| `observability.service_name` | `String` | `api` / `worker` / `infra` | `method-library` | 配置设计文档:Observability |
| `observability.exporter_endpoint` | `Option<Url>` | `infra::observability` | `None` | 配置设计文档:Observability |
| `cache.enabled` | `bool` | P1 / optimization adapter | `false` | 配置设计文档:Cache(P1/optimization) |

### 7.3 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|
| PostgreSQL | `method_library_infra::persistence` | `UnitOfWork`、repository traits | acquire / statement timeout 由配置控制;事务内不做盲重试 | 不可用返回 `PERSISTENCE_UNAVAILABLE`;Command 失败回滚;Query 返回 503 |
| L0-bus | `method_library_infra::bus::L0EventPublisher` | `BusPublisherPort.publish(Topic topic, DefinitionEventEnvelope event, RequestMeta meta)` | publish timeout 由配置控制;失败进入 outbox retry/backoff | 不回滚已提交 truth;outbox retry、dead-letter、replay |
| object storage | `method_library_infra::blob` | `ObjectStoragePort.put_snapshot_payload(...)`、snapshot payload read | put/read timeout 由配置控制;可有限重试幂等 put | publish 依赖 payload 时失败阻断 publish;已提交 metadata 不被 query 修复 |
| governance | `method_library_infra::governance` | `GovernancePort.validate_approved_gate(ApprovedGateRef gate_ref, ContentId content_id, ActorContext actor, RequestMeta meta)` | validation timeout 由配置控制;短暂失败可由调用方重试 | 阻断 publish / supersede;不阻断 draft、query、outbox relay |
| Gateway trusted headers | `method_library_api::extractors` | `ActorContext::from_gateway_headers(GatewayHeaders headers)`、`RequestMeta::from_gateway_headers(...)` | 不适用 | header 缺失或不可信返回 `GATEWAY_CONTEXT_MISSING/INVALID`;本仓不做登录鉴权 |
| Observability backend | `method_library_infra::observability` | `ObservabilityPort` | exporter timeout 由配置控制;内部丢弃或异步发送 | 默认不阻断业务;关键审计仍走本地 audit / DB |
| Feature flag source | `method_library_infra::feature_flags` 或 config-backed adapter | `FeatureFlagPort.ensure_enabled(FeatureFlag flag)` | 本地读取不重试;远程 source 若引入需缓存 | P1 disabled 返回 `P1_FEATURE_DISABLED`;不得影响 P0 |
| Cache(P1/optimization) | P1 / query optimization adapter | read-through cache port,后续单独定义 | timeout / TTL 留配置设计文档 | cache 不可用回源 PostgreSQL / snapshot,不改变 truth |
| Marketplace(P1) | P1 package adapter,本轮只保留边界 | 后续 marketplace metadata publish port | 留 P1 配置设计 | 不影响 P0 publish / query / outbox relay |

### 7.4 模块读取规则表

| 模块 | 是否可直接读取配置 | 允许读取的配置形态 | 禁止事项 |
|---|---:|---|---|
| `method_library_domain` | 否 | 无 | 不读 env/file,不依赖 feature flag、clock、DB、bus、HTTP |
| `method_library_contracts` | 否 | 无 | DTO 不读取配置,只承载字段和 schema |
| `method_library_application` | 间接 | 已解析 `MethodLibrarySettings` value、policy value、port trait | 不直接读取 env/file;不构造真实 adapter |
| `method_library_infra` | 是 | 连接字符串、endpoint、timeout、retry、secret ref | 不实现业务规则;不把配置写成 domain invariant |
| `method_library_api` | 是 | bind、gateway header、body limit、feature flag | 不实现身份认证;不绕过 application service |
| `method_library_worker` | 是 | batch、lease、retry、job dry_run、checkpoint | 不直接改 truth 绕过 application / repository 契约 |

### 7.5 配置红线

| 红线 | 说明 |
|---|---|
| Domain 不读取配置 | 领域对象和策略必须由参数驱动,保持可测试和稳定 |
| 配置不能改变 Definition / Use 边界 | 不允许通过配置让 method-library 保存 WorkItem、ProcessInstance、QualificationProfile 等 Use truth |
| 配置不能绕过 outbox | 不允许配置成 Command 直接发布 L0-bus |
| 配置不能关闭 P0 审计 / outbox 关键链路 | P0 publish/deprecate/retire/supersede 必须形成 audit/outbox |
| P1 feature 默认关闭 | P1 endpoint / service 关闭时返回 `P1_FEATURE_DISABLED`,不得阻塞 P0 |
| Secret 不进入日志 / audit | database URL、bus token、object storage credential 不得写入 audit 或 structured log |
| Retry 不得跨越业务事务重放非幂等操作 | 业务写入失败由 Command 幂等和 transaction 处理,adapter retry 只限安全边界 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 13. 配置引用与外部依赖绑定

### 13.1 配置绑定关系

```text
[Runtime Config Source]
        |
        v
[api / infra / worker]
        |
        v
[application receives settings value + ports]
        |
        v
[domain: no config read]
```

### 13.2 配置引用表

| 配置项 | 类型 | 读取模块 | 默认值 | 详细配置文档位置 |
|---|---|---|---|---|

### 13.3 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试 | 降级策略 |
|---|---|---|---|---|

### 13.4 模块读取规则

| 模块 | 是否可直接读取配置 | 允许读取的配置形态 | 禁止事项 |
|---|---:|---|---|

### 13.5 配置红线

| 红线 | 说明 |
|---|---|
````

---

## 9. 待确认事项

- 是否单独创建 `MethodLibrarySettings` / `RuntimeSettings` 对象契约。当前建议在正式 §13 引用,具体 struct 字段可在配置设计或实现阶段落地。
- governance `validation_mode` 第一版是否允许本地 ref-only 校验。当前建议 P0 publish 仍必须能校验 approved gate,具体远程 / 投影模式由部署配置决定。
- outbox claim 是否在配置中显式支持 `lease_timeout_ms`。当前建议保留,与 Step 13 的 worker reentry protection 对齐。
- `cache.enabled` 是否完全移出 P0 正式文档。当前建议保留为 P1/optimization 配置引用,但不进入 P0 必实现闭环。

---

## 10. 进入下一步条件

- 配置引用表已经覆盖 API、Gateway、database、outbox、event bus、governance、object storage、snapshot、fingerprint、query、projection、jobs、feature flag 和 observability。
- 外部依赖绑定表已经回指 Step 7 adapter / port 契约。
- 每个外部依赖的超时、重试和降级口径已经明确。
- 已明确哪些配置细节留给配置设计文档,本步不替代配置手册。
- 可以进入 Step 15 定义可观测性与审计埋点契约。
