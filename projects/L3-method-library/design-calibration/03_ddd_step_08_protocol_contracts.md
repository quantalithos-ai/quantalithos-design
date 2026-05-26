# Step 8. 定义 API / Command / Query / Event / Job 协议契约

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8
- 回填章节：`03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 模块主轴 | 已确认 `api` / `worker` 只能进入 application service,不能直连 repository |
| Step 6 对象契约 | 已确认 Command / Query / Event / Job 依赖的对象、引用、snapshot、outbox、projection 对象 |
| Step 7 Port 契约 | 已确认 repository / outbound / support port 边界 |
| `03-详细设计.md` §10~§14 | 已有 Command / Query / Event / External Dependency / Operations Job 数据流草稿 |
| `03-详细设计.md` §28 | 已有 HTTP API / RPC 契约草稿 |

已确认结论：

```text
Step 8 只定义协议入口和协议数据契约。
函数级内部处理流、事务顺序、每一步调用对象和伪代码留到 Step 9。
HTTP JSON API 是第一版权威外部入口。
RPC 是可选映射,不得另起一套业务语义。
Outbound Event 通过 outbox + L0-bus 发布。
Inbound / external dependency 只承接外部证据或 adapter result,不直接改写 Definition truth。
```

依赖的前序 Step：

```text
Step 1~7 已确认上游输入、范围、实现约束、文件布局、模块主轴、对象契约和 port 契约。
```

---

## 3. SOP 问题回答

1. 本轮需要定义哪些 API / Command / Query / Event / Job？

   回答：P0 必须定义 7 个 Command、6 个 Query、4 类基础 Outbound Event、4 类 Inbound / External Dependency、4 个 Operations Job。P1 保留 plugin/configuration、compare/export/drift 等后置协议索引,不进入 P0 必实现闭环。

2. 每个协议的调用方、处理方、传输方式是什么？

   回答：Command / Query / Job 第一版通过 HTTP JSON 入口进入 `api` handler,再调用 application service。Outbound Event 由 outbox relay 通过 L0-bus 发布。Inbound / external dependency 通过 port 查询、入站 event projection 或 adapter result 进入,但只能成为 publish / replay / recovery 的证据或状态推进。

3. 外部接口使用 HTTP、RPC、event bus 还是其他方式？

   回答：第一版权威外部接口是 HTTP JSON。RPC 只作为可选内部映射,必须复用同一 DTO、service 函数和错误语义。事件统一经 outbox 写入后由 L0-bus 发布。Object storage / governance 走 port,不是业务 API。

4. 请求、响应、事件或 job 输入输出 schema 是什么？

   回答：本步按协议卡片固定请求字段、响应字段、event envelope、job request/result 字段和 JSON 示例。正式回填时每个协议必须独立小节,不得只保留总表。

5. 每个协议失败时映射成什么错误？

   回答：HTTP status 映射统一按错误类别:400 参数/gateway/idempotency 缺失,404 not found / P1 disabled,409 状态冲突,412 revision conflict,422 语义校验失败,424 gate 前置失败,500 构造失败,503 外部依赖不可用。事件和 job 保留原始 `error.code` 或 `failure_reason`。

6. 哪些协议需要幂等键或审计记录？

   回答：所有 Command 和 Operations Job 必须携带 `x-idempotency-key`。Outbound Event 以 `event_id` 幂等。Inbound Event 以外部 `event_id + payload_hash` 幂等。Query 默认不要求幂等键,且不得写 truth / audit / outbox,除非后续单独设计 query audit。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §10~§14 | 既写协议 schema,又写内部数据流 | 新版 Step 8 / Step 9 边界不清 |
| `03-详细设计.md` §28 | HTTP/RPC 契约放在很后面 | 实现者需要来回跳转才能知道入口协议 |
| `03-详细设计.md` §12 | Outbound Event 和 relay 工作流混写 | 协议 schema 与发布处理流边界不清 |
| `03-详细设计.md` §13 | External dependency 同时包含 port 查询和 inbound event projection | 需要明确哪些是协议,哪些是处理策略 |
| P1 endpoints | 已列出 P1 endpoint,但容易与 P0 混读 | 可能误认为第一批必须实现 P1 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 协议组织 | Command / Query / Event / Job 分散在旧 §10~§14 与 §28 | 新 §7 先集中定义协议契约 | 实现者先知道有哪些入口和 schema |
| HTTP/RPC | HTTP 契约后置 | HTTP JSON 作为第一版权威入口前置 | 避免实现者从 service 函数反推 API |
| 数据流 | 协议与内部处理流混写 | Step 8 写协议,Step 9 写函数级处理流 | 保持 SOP 分层 |
| Event | event schema 与 relay 流混写 | event envelope / topic / payload 先独立定义 | outbox relay 细节留 Step 9 / Step 11 |
| P1 | P1 与 P0 连续出现 | P1 单独作为后置协议索引 | 保持 P0 / P1 分离 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只保留 HTTP endpoint 表 | 简洁 | 不足以驱动 DTO / event / job 实现 | 不采用 |
| 每个协议在 Step 8 写完整内部流程 | 信息完整 | 与 Step 9 重叠,文档会再次膨胀 | 不采用 |
| Step 8 写协议卡片,Step 9 写函数级处理流 | 边界清楚,可逐步回填 | Step 8 需要维护较多小节 | 采用 |
| RPC 与 HTTP 并列为第一版权威 | 对内部调用友好 | 容易形成两套语义 | 不采用 |
| HTTP JSON 权威, RPC 可选映射 | 语义单一,实现清楚 | 后续 RPC 需要映射层 | 采用 |

---

## 7. 结构化中间产物

### 7.1 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 幂等 | 是否需要 Step 9 处理流 |
|---|---|---|---|---|---|---|
| `CreateMethodContentDraft` | P0 Command | 方法作者 / seed job | `MethodContentCommandService.create_draft` | HTTP JSON / RPC optional | `x-idempotency-key` | 是 |
| `UpdateMethodContentDraft` | P0 Command | 方法作者 | `MethodContentCommandService.update_draft` | HTTP JSON / RPC optional | `x-idempotency-key` | 是 |
| `SubmitMethodContentForReview` | P0 Command | 方法作者 / maintainer | `MethodContentCommandService.submit_for_review` | HTTP JSON / RPC optional | `x-idempotency-key` | 是 |
| `PublishMethodContent` | P0 Command | maintainer / seed job | `MethodContentCommandService.publish` | HTTP JSON / RPC optional | `x-idempotency-key` | 是 |
| `DeprecateMethodContent` | P0 Command | maintainer | `MethodContentCommandService.deprecate` | HTTP JSON / RPC optional | `x-idempotency-key` | 是 |
| `RetireMethodContent` | P0 Command | maintainer | `MethodContentCommandService.retire` | HTTP JSON / RPC optional | `x-idempotency-key` | 是 |
| `SupersedeMethodContent` | P0 Command | maintainer | `MethodContentCommandService.supersede` | HTTP JSON / RPC optional | `x-idempotency-key` | 是 |
| `GetMethodContent` | P0 Query | UI / downstream / operations | `MethodContentQueryService.get_method_content` | HTTP JSON / RPC optional | 不要求 | 是 |
| `ListMethodContents` | P0 Query | UI / console / operations | `MethodContentQueryService.list_method_contents` | HTTP JSON / RPC optional | 不要求 | 是 |
| `GetMethodContentVersion` | P0 Query | downstream / UI | `MethodContentQueryService.get_method_content_version` | HTTP JSON / RPC optional | 不要求 | 是 |
| `ExportDefinitionSnapshot` | P0 Query | downstream resync / replay | `MethodContentQueryService.export_definition_snapshot` | HTTP JSON / RPC optional | 不要求 | 是 |
| `ResolveViewProfile` | P0 Query | UI / console / process / work / artifact | `ViewProfileResolveService.resolve_view_profile` | HTTP JSON / RPC optional | 不要求 | 是 |
| `GetDefinitionTrace` | P0 Query | operations / audit / UI | `MethodContentQueryService.get_definition_trace` | HTTP JSON / RPC optional | 不要求 | 是 |
| `method_library.content.published` | P0 Outbound Event | publish / supersede / seed | downstream modules | outbox + L0-bus | `event_id` | 是 |
| `method_library.content.deprecated` | P0 Outbound Event | deprecate | downstream modules | outbox + L0-bus | `event_id` | 是 |
| `method_library.content.retired` | P0 Outbound Event | retire | downstream modules | outbox + L0-bus | `event_id` | 是 |
| `method_library.content.fingerprint_changed` | P0 Outbound Event | supersede / recalculate | downstream modules | outbox + L0-bus | `event_id` | 是 |
| `governance.publish_gate.approved` | P0 Inbound / External | governance | publish / supersede gate validation | port query or inbound event projection | external event id | 是 |
| `object_storage.snapshot_payload` | P0 External | object storage | snapshot build/export | `ObjectStoragePort` | request id / payload hash | 是 |
| `l0_bus.publish_result` | P0 External | L0-bus | outbox relay | adapter result / callback | event id | 是 |
| `downstream.replay_request` | P0 Inbound Request | downstream / operator | replay job | HTTP / RPC job trigger | job idempotency key | 是 |
| `SeedInitialMethodAssets` | P0 Operations Job | bootstrap / operator | `MethodLibraryJobService.seed_initial_method_assets` | HTTP JSON / worker trigger | `x-idempotency-key` | 是 |
| `ReplayDefinitionEvents` | P0 Operations Job | downstream / operator | `MethodLibraryJobService.replay_definition_events` | HTTP JSON / worker trigger | `x-idempotency-key` | 是 |
| `RecalculateFingerprint` | P0 Operations Job | operator | `MethodLibraryJobService.recalculate_fingerprint` | HTTP JSON / worker trigger | `x-idempotency-key` | 是 |
| `RebuildReadModels` | P0 Operations Job | operator / scheduler | `MethodLibraryJobService.rebuild_read_models` | HTTP JSON / worker trigger | `x-idempotency-key` | 是 |

### 7.2 通用 HTTP / RPC 契约

| 项 | 约定 |
|---|---|
| HTTP base path | `/api/v1/method-library` |
| request / response | `application/json` |
| JSON 字段 | `snake_case` |
| 时间格式 | RFC3339 UTC 字符串 |
| ID 格式 | JSON 中为 string,业务层转 newtype |
| Command / Job 幂等 | 必须提供 `x-idempotency-key` |
| Query 幂等 | 不要求 |
| RPC | 可选映射,必须复用 HTTP DTO 和 application service |
| 安全 | 不做身份校验,只消费 Gateway 注入上下文 |

Gateway headers:

| Header | 必填范围 | 映射对象 | 作用 |
|---|---|---|---|
| `x-request-id` | 全部请求 | `RequestMeta.request_id` | 请求 ID |
| `x-trace-id` | 全部请求 | `RequestMeta.trace_id` | 调用链 ID |
| `x-idempotency-key` | Command / Job 必填 | `RequestMeta.idempotency_key` | 幂等键 |
| `x-actor-id` | 全部请求 | `ActorContext.actor_id` | Gateway 已校验调用者 |
| `x-actor-kind` | 全部请求 | `ActorContext.actor_kind` | `human / ai_member / system` |
| `x-gateway-trusted-by` | 全部请求 | inbound adapter | 可信 header 来源 |

通用响应信封:

```json
{
  "request_id": "REQ-100",
  "result": "ok",
  "data": {}
}
```

通用错误信封:

```json
{
  "request_id": "REQ-100",
  "error": {
    "code": "REVISION_CONFLICT",
    "message": "expected revision does not match",
    "details": {}
  }
}
```

### 7.3 P0 Command 协议卡片

#### `CreateMethodContentDraft`

| 项 | 内容 |
|---|---|
| 函数签名 | `create_draft(CreateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta) -> Result<CreateMethodContentDraftResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/contents` |
| 成功 status | `201` |
| 请求字段 | `kind`、`name`、`description`、`payload`、`references`、`source_refs` |
| 响应字段 | `content_id`、`content_family_id`、`kind`、`lifecycle_state`、`revision` |
| 幂等 / 审计 | 需要幂等键;写 audit;不写 outbox |

请求 JSON:

```json
{
  "kind": "RoleDefinition",
  "name": "Backend Developer",
  "description": "Backend delivery role definition",
  "payload": {
    "role_key": "backend_developer",
    "responsibilities": ["design API"],
    "qualification_refs": []
  },
  "references": [],
  "source_refs": []
}
```

#### `UpdateMethodContentDraft`

| 项 | 内容 |
|---|---|
| 函数签名 | `update_draft(UpdateMethodContentDraftCommand command, ActorContext actor, RequestMeta meta) -> Result<UpdateMethodContentDraftResponse, MethodLibraryError>` |
| HTTP | `PATCH /api/v1/method-library/contents/{content_id}/draft` |
| 成功 status | `200` |
| 请求字段 | `content_id`、`expected_revision`、`name`、`description`、`payload`、`references` |
| 响应字段 | `content_id`、`kind`、`lifecycle_state`、`revision` |
| 幂等 / 审计 | 需要幂等键;写 audit;不写 outbox |

#### `SubmitMethodContentForReview`

| 项 | 内容 |
|---|---|
| 函数签名 | `submit_for_review(SubmitMethodContentForReviewCommand command, ActorContext actor, RequestMeta meta) -> Result<SubmitMethodContentForReviewResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/contents/{content_id}:submit-review` |
| 成功 status | `200` |
| 请求字段 | `content_id`、`expected_revision`、`review_reason`、`review_evidence_refs` |
| 响应字段 | `content_id`、`kind`、`lifecycle_state`、`revision` |
| 幂等 / 审计 | 需要幂等键;写 audit / lifecycle history;不写 outbox |

#### `PublishMethodContent`

| 项 | 内容 |
|---|---|
| 函数签名 | `publish(PublishMethodContentCommand command, ActorContext actor, RequestMeta meta) -> Result<PublishMethodContentResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/contents/{content_id}:publish` |
| 成功 status | `200` |
| 请求字段 | `content_id`、`expected_revision`、`version`、`approved_gate_ref`、`publish_reason` |
| 响应字段 | `content_id`、`kind`、`lifecycle_state`、`version`、`fingerprint`、`snapshot_ref`、`outbox_event_id`、`revision` |
| 幂等 / 审计 | 需要幂等键;写 audit / snapshot / outbox |

请求 JSON:

```json
{
  "content_id": "MC-100",
  "expected_revision": 3,
  "version": "1.0.0",
  "approved_gate_ref": {
    "gate_id": "GATE-100",
    "gate_decision_id": "GD-100",
    "approved_at": "2026-05-20T00:00:00Z"
  },
  "publish_reason": "initial release"
}
```

#### `DeprecateMethodContent`

| 项 | 内容 |
|---|---|
| 函数签名 | `deprecate(DeprecateMethodContentCommand command, ActorContext actor, RequestMeta meta) -> Result<DeprecateMethodContentResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/contents/{content_id}:deprecate` |
| 成功 status | `200` |
| 请求字段 | `content_id`、`expected_revision`、`reason`、`effective_at` |
| 响应字段 | `content_id`、`lifecycle_state`、`version`、`fingerprint`、`outbox_event_id`、`revision` |
| 幂等 / 审计 | 需要幂等键;写 audit / outbox;不新建 snapshot |

#### `RetireMethodContent`

| 项 | 内容 |
|---|---|
| 函数签名 | `retire(RetireMethodContentCommand command, ActorContext actor, RequestMeta meta) -> Result<RetireMethodContentResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/contents/{content_id}:retire` |
| 成功 status | `200` |
| 请求字段 | `content_id`、`expected_revision`、`reason`、`retire_policy` |
| 响应字段 | `content_id`、`lifecycle_state`、`version`、`fingerprint`、`outbox_event_id`、`revision` |
| 幂等 / 审计 | 需要幂等键;写 audit / outbox |

#### `SupersedeMethodContent`

| 项 | 内容 |
|---|---|
| 函数签名 | `supersede(SupersedeMethodContentCommand command, ActorContext actor, RequestMeta meta) -> Result<SupersedeMethodContentResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/contents/{old_content_id}:supersede` |
| 成功 status | `200` |
| 请求字段 | `old_content_id`、`old_expected_revision`、`new_content_id`、`new_expected_revision`、`new_version`、`approved_gate_ref`、`reason` |
| 响应字段 | `old_content_id`、`old_lifecycle_state`、`new_content_id`、`new_lifecycle_state`、`new_version`、`new_fingerprint`、`supersede_link_id`、`snapshot_ref`、`outbox_event_ids` |
| 幂等 / 审计 | 需要幂等键;写 old/new audit / snapshot / outbox |

### 7.4 P0 Query 协议卡片

#### `GetMethodContent`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_method_content(GetMethodContentQuery query, ActorContext actor, RequestMeta meta) -> Result<GetMethodContentResponse, MethodLibraryError>` |
| HTTP | `GET /api/v1/method-library/contents/{content_id}` |
| Query params | `read_mode`、`include_payload`、`include_references` |
| 响应字段 | `schema_version`、`content`、`consistency` |
| 读取规则 | 默认只读 published-like;`authoring` 模式由 Gateway 保障权限 |

#### `ListMethodContents`

| 项 | 内容 |
|---|---|
| 函数签名 | `list_method_contents(ListMethodContentsQuery query, ActorContext actor, RequestMeta meta) -> Result<ListMethodContentsResponse, MethodLibraryError>` |
| HTTP | `GET /api/v1/method-library/contents` |
| Query params | `kind`、`lifecycle_state`、`read_mode`、`cursor`、`limit`、`sort` |
| 响应字段 | `schema_version`、`items`、`page`、`consistency` |
| 读取规则 | 默认读 projection;必须分页;不得无上限扫表 |

#### `GetMethodContentVersion`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_method_content_version(GetMethodContentVersionQuery query, ActorContext actor, RequestMeta meta) -> Result<GetMethodContentVersionResponse, MethodLibraryError>` |
| HTTP | `GET /api/v1/method-library/contents/{content_id}/versions/{version}` |
| Query params | `include_snapshot_ref` |
| 响应字段 | `schema_version`、`content_version`、`consistency` |
| 读取规则 | 只读 published version history |

#### `ExportDefinitionSnapshot`

| 项 | 内容 |
|---|---|
| 函数签名 | `export_definition_snapshot(ExportDefinitionSnapshotQuery query, ActorContext actor, RequestMeta meta) -> Result<ExportDefinitionSnapshotResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/snapshots:export` |
| 请求字段 | `snapshot_id` 或 `content_id + version`、`verify_fingerprint` |
| 响应字段 | `schema_version`、`snapshot_ref`、`content_ref`、`payload`、`references`、`generated_at` |
| 读取规则 | 读 snapshot metadata + object storage payload;不得返回半截 definition |

#### `ResolveViewProfile`

| 项 | 内容 |
|---|---|
| 函数签名 | `resolve_view_profile(ResolveViewProfileQuery query, ActorContext actor, RequestMeta meta) -> Result<ResolveViewProfileResponse, MethodLibraryError>` |
| HTTP | `POST /api/v1/method-library/view-profiles:resolve` |
| 请求字段 | `role_ref`、`object_kind`、`scope` |
| 响应字段 | `schema_version`、`view_profile`、`consistency` |
| 读取规则 | 只解析 published ViewProfile;不返回 UI session / render state |

请求 JSON:

```json
{
  "role_ref": {
    "content_id": "MC-ROLE-100",
    "kind": "RoleDefinition",
    "version": "1.0.0",
    "fingerprint": "sha256:role"
  },
  "object_kind": "work_item",
  "scope": {
    "project_type": "software_delivery",
    "view": "detail"
  }
}
```

#### `GetDefinitionTrace`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_definition_trace(GetDefinitionTraceQuery query, ActorContext actor, RequestMeta meta) -> Result<GetDefinitionTraceResponse, MethodLibraryError>` |
| HTTP | `GET /api/v1/method-library/contents/{content_id}/trace` |
| Query params | `include_audit`、`include_events`、`include_snapshots`、`cursor`、`limit` |
| 响应字段 | `schema_version`、`content_id`、`trace`、`page`、`consistency` |
| 读取规则 | trace projection 优先;明细分页 |

### 7.5 P0 Outbound Event 协议卡片

通用 event envelope:

```json
{
  "event_id": "EVT-100",
  "event_type": "method_library.content.published",
  "schema_version": "method-library.event.v1",
  "trace_id": "TRACE-100",
  "occurred_at": "2026-05-20T00:00:00Z",
  "payload": {}
}
```

| Event | Topic | 发布方 | 消费方 | Payload 关键字段 | 规则 |
|---|---|---|---|---|---|
| `method_library.content.published` | `method-library.definition.events` | publish / supersede / seed | identity / process / governance / UI / marketplace | `content_id`、`kind`、`version`、`fingerprint`、`snapshot_ref`、`published_at` | 不携带完整 payload |
| `method_library.content.deprecated` | `method-library.lifecycle.events` | deprecate | process / UI / marketplace | `content_id`、`kind`、`version`、`fingerprint`、`reason`、`effective_at` | 不改变 fingerprint |
| `method_library.content.retired` | `method-library.lifecycle.events` | retire | process / identity / governance / UI | `content_id`、`kind`、`version`、`fingerprint`、`reason`、`retire_policy` | 不删除下游历史 use truth |
| `method_library.content.fingerprint_changed` | `method-library.definition.events` | supersede / recalculate | downstream caches / indexes | `content_id`、`kind`、`version`、`old_fingerprint`、`new_fingerprint`、`snapshot_ref` | 下游可据此 resync |

kind-specific published events:

| Event pattern | Kind | 主要消费者 |
|---|---|---|
| `method_library.qualification.published` | `Qualification` | identity / capability-hub |
| `method_library.role_definition.published` | `RoleDefinition` | identity / UI / governance |
| `method_library.task_definition.published` | `TaskDefinition` | process / work |
| `method_library.work_product_definition.published` | `WorkProductDefinition` | artifact / process / work |
| `method_library.process_template_def.published` | `ProcessTemplateDef` | process |
| `method_library.view_profile.published` | `ViewProfile` | UI / console |
| `method_library.ai_policy_def.published` | `AIPolicyDef` | governance / runtime policy consumers |

### 7.6 P0 Inbound / External Dependency 协议卡片

| 协议 | 类型 | 来源 | 消费入口 | 函数签名 / Port | 数据格式 |
|---|---|---|---|---|---|
| `governance.publish_gate.approved` | External Dependency / Inbound Reference | governance | publish / supersede | `validate_publish_gate(ApprovedGateRef approved_gate_ref, ContentId content_id, ActorContext actor, RequestMeta meta) -> Result<GateValidationResult, MethodLibraryError>` | `gate_ref`、`evidence_refs` |
| `handle_governance_gate_approved` | Optional Inbound Event | governance event bus | gate projection | `handle_governance_gate_approved(GovernanceGateApprovedEvent event, RequestMeta meta) -> Result<InboundEventAck, MethodLibraryError>` | external `event_id`、`schema_version`、`gate_ref` |
| `object_storage.snapshot_payload` | External Dependency | object storage | snapshot build/export | `put_snapshot_payload(SnapshotPayload payload, ObjectKey object_key, RequestMeta meta) -> Result<SnapshotBlobRef, MethodLibraryError>` | `blob_ref`、`expected_hash` |
| `l0_bus.publish_result` | Adapter Result | L0-bus | outbox relay | `handle_bus_publish_result(BusPublishResult result, RequestMeta meta) -> Result<OutboxPublishAck, MethodLibraryError>` | `event_id`、`bus_message_id`、`status`、`failure` |
| `downstream.replay_request` | Inbound Request / Job Trigger | downstream / operator | replay job | `replay_definition_events(ReplayDefinitionEventsJobRequest request, ActorContext actor, RequestMeta meta) -> Result<ReplayDefinitionEventsJobResult, MethodLibraryError>` | `from_cursor`、`event_types`、`consumer` |

gate event JSON:

```json
{
  "event_id": "GOV-EVT-100",
  "event_type": "governance.publish_gate.approved",
  "schema_version": "governance.event.v1",
  "gate_ref": {
    "gate_id": "GATE-100",
    "gate_decision_id": "GD-100",
    "target_ref": {
      "module": "L3-method-library",
      "content_id": "MC-100"
    },
    "approved_at": "2026-05-20T00:00:00Z"
  },
  "evidence_refs": []
}
```

### 7.7 P0 Operations Job 协议卡片

通用 JobRequest:

```json
{
  "job_name": "ReplayDefinitionEvents",
  "scope": {},
  "batch_size": 100,
  "dry_run": false,
  "resume": true
}
```

| Job | HTTP | 函数签名 | 请求字段 | 响应字段 | 规则 |
|---|---|---|---|---|---|
| `SeedInitialMethodAssets` | `POST /api/v1/method-library/jobs/seed-initial-method-assets:run` | `seed_initial_method_assets(SeedInitialMethodAssetsJobRequest request, ActorContext actor, RequestMeta meta) -> Result<SeedInitialMethodAssetsJobResult, MethodLibraryError>` | `job_name`、`scope.asset_set`、`scope.kinds`、`publish`、`dry_run` | `job_run_id`、`status`、`processed_count`、`skipped_count`、`failure_reason` | 必须复用 command service,不得直接 insert |
| `ReplayDefinitionEvents` | `POST /api/v1/method-library/jobs/replay-definition-events:run` | `replay_definition_events(ReplayDefinitionEventsJobRequest request, ActorContext actor, RequestMeta meta) -> Result<ReplayDefinitionEventsJobResult, MethodLibraryError>` | `from_cursor`、`event_types`、`consumer`、`batch_size`、`dry_run` | `job_run_id`、`status`、`processed_count`、`next_cursor` | 复用原 event_id |
| `RecalculateFingerprint` | `POST /api/v1/method-library/jobs/recalculate-fingerprint:run` | `recalculate_fingerprint(RecalculateFingerprintJobRequest request, ActorContext actor, RequestMeta meta) -> Result<RecalculateFingerprintJobResult, MethodLibraryError>` | `content_ids`、`kind`、`canonical_schema_version`、`dry_run` | `job_run_id`、`mismatch_report`、`status` | 默认 dry_run,不自动修复 |
| `RebuildReadModels` | `POST /api/v1/method-library/jobs/rebuild-read-models:run` | `rebuild_read_models(RebuildReadModelsJobRequest request, ActorContext actor, RequestMeta meta) -> Result<RebuildReadModelsJobResult, MethodLibraryError>` | `projection_names`、`from_cursor`、`batch_size`、`dry_run` | `job_run_id`、`status`、`next_cursor` | 只重建 projection,不反写 truth |

### 7.8 P1 后置协议索引

| 名称 | 类别 | HTTP / Topic | Service | P0 边界 |
|---|---|---|---|---|
| `PublishMethodPlugin` | P1 Command | `POST /api/v1/method-library/plugins/{plugin_id}:publish` | `MethodPluginCommandService.publish_method_plugin` | 不复制 MethodContent payload |
| `ActivateMethodConfiguration` | P1 Command | `POST /api/v1/method-library/configurations/{configuration_id}:activate` | `MethodConfigurationCommandService.activate_method_configuration` | 不反向修改 P0 definition |
| `CompareFingerprint` | P1 Query | `POST /api/v1/method-library/fingerprints:compare` | `MethodContentQueryService.compare_fingerprint` | 不修复 truth |
| `ListMethodPlugins` | P1 Query | `GET /api/v1/method-library/plugins` | `MethodPluginQueryService.list_method_plugins` | 不进入 P0 query 必经路径 |
| `GetMethodConfiguration` | P1 Query | `GET /api/v1/method-library/configurations/{configuration_id}` | `MethodConfigurationQueryService.get_method_configuration` | 不作为 P0 source of truth |
| `ExportAllSnapshots` | P1 Job | `POST /api/v1/method-library/jobs/export-all-snapshots:run` | `MethodLibraryJobService.export_all_snapshots` | 只导出既有 snapshot |
| `DetectDefinitionDrift` | P1 Job | `POST /api/v1/method-library/jobs/detect-definition-drift:run` | `MethodLibraryJobService.detect_definition_drift` | 不自动修改 P0 fingerprint |
| `method_library.plugin.published` | P1 Outbound Event | `method-library.package.events` | outbox relay | 不改变 P0 truth |
| `method_library.configuration.activated` | P1 Outbound Event | `method-library.package.events` | outbox relay | 不影响 P0 event relay |

### 7.9 错误映射与幂等规则

| 错误类别 / 错误码 | HTTP status | 说明 |
|---|---|---|
| `GATEWAY_CONTEXT_MISSING`、`GATEWAY_CONTEXT_INVALID` | `400` | Gateway headers 缺失或非法 |
| `IDEMPOTENCY_KEY_REQUIRED`、`PATH_BODY_MISMATCH` | `400` | 请求协议错误 |
| `METHOD_CONTENT_NOT_FOUND`、`CONTENT_VERSION_NOT_FOUND`、`SNAPSHOT_NOT_FOUND` | `404` | 目标不存在 |
| `P1_FEATURE_DISABLED` | `404` | P1 endpoint 未启用 |
| `REVISION_CONFLICT` | `412` | expected_revision 不匹配 |
| `IDEMPOTENCY_CONFLICT`、`CONTENT_VERSION_CONFLICT` | `409` | 并发或唯一约束冲突 |
| `LIFECYCLE_TRANSITION_NOT_ALLOWED`、`PUBLISHED_CONTENT_IMMUTABLE` | `409` | 当前状态不允许操作 |
| `BOUNDARY_VIOLATION`、`REFERENCE_INVALID`、`REFERENCE_NOT_PUBLISHED` | `422` | 语义校验失败 |
| `PUBLISH_GATE_REQUIRED`、`PUBLISH_GATE_INVALID` | `424` | 发布 gate 前置不满足 |
| `SNAPSHOT_BUILD_FAILED`、`FINGERPRINT_BUILD_FAILED` | `500` | 本仓构造失败 |
| `BUS_PUBLISH_FAILED`、`OBJECT_STORAGE_UNAVAILABLE`、`GOVERNANCE_UNAVAILABLE` | `503` | 外部依赖不可用 |

幂等规则：

| 协议类型 | 幂等键 / 去重键 | 规则 |
|---|---|---|
| Command | `x-idempotency-key + request_hash` | 同 key 同 hash 返回既有结果;同 key 不同 hash 返回冲突 |
| Query | 无 | 不写 truth,不要求幂等键 |
| Outbound Event | `event_id` | relay / replay 必须复用原 event_id |
| Inbound Event | external `event_id + payload_hash` | 重复事件幂等处理 |
| Operations Job | `x-idempotency-key + job scope hash` | dry_run 不写正式 checkpoint |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 7. API / Command / Query / Event / Job 协议契约

### 7.1 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 幂等 | 是否需要处理流 |
|---|---|---|---|---|---|---|

### 7.2 通用 HTTP / RPC 契约

| 项 | 约定 |
|---|---|

### 7.3 P0 Command 协议

每个 Command 独立小节展开:
- 函数签名
- HTTP method/path/status
- 请求 JSON
- 响应 JSON
- 幂等、审计、错误映射

### 7.4 P0 Query 协议

每个 Query 独立小节展开:
- 函数签名
- HTTP method/path/status
- query params 或 request body
- 响应 JSON
- 读取来源、一致性字段、错误映射

### 7.5 P0 Outbound Event 协议

每个 event 独立小节展开:
- event_type
- topic
- 发布方
- 消费方
- event envelope
- payload schema
- schema version 策略

### 7.6 P0 Inbound / External Dependency 协议

按 external dependency / inbound reference 展开:
- governance gate
- object storage
- L0-bus publish result
- downstream replay request

### 7.7 P0 Operations Job 协议

每个 Job 独立小节展开:
- 触发方式
- 函数签名
- request JSON
- result JSON
- checkpoint / dry_run / resume / 幂等规则

### 7.8 P1 后置协议索引

| 名称 | 类别 | HTTP / Topic | Service | P0 边界 |
|---|---|---|---|---|

### 7.9 错误映射与幂等规则

| 错误类别 / 错误码 | HTTP status | 说明 |
|---|---|---|
````

同步写入 §6 全局索引：

```md
### 6.x API / Command / Query / Event / Job 索引

| 名称 | 类别 | 传输方式 | 处理方 | 展开章节 |
|---|---|---|---|---|
```

---

## 9. 待确认事项

- 是否第一版正式实现 RPC,还是只保留可选映射。当前建议只保留可选映射。
- 是否实现 `handle_governance_gate_approved` 入站 event projection,还是第一版只通过 `GovernancePort.validate_approved_gate(...)` 查询 governance。当前建议允许两种,但 P0 publish 只依赖 `ApprovedGateRef` 校验结果。
- P1 endpoint 是否仅进入正式文档索引,还是在第一批实现仓创建 route stub。当前建议仅索引,不创建 P0 必经实现。
- Job endpoint 第一版是否同步返回 `JobResult`。当前建议同步返回,后续长任务再单独新增异步协议。

---

## 10. 进入下一步条件

- P0 Command / Query / Event / Inbound / Job 协议清单已经确认。
- HTTP JSON 作为第一版权威入口已经确认。
- RPC 可选映射、不另起业务语义已经确认。
- 每个协议的调用方、处理方、传输方式、字段形态、错误和幂等要求已经确认。
- P1 协议已明确为后置索引,不阻塞 P0。
- 可以进入 Step 9 逐接口定义函数级处理流。
