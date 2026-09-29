# Step 7. 定义配置项清单

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
> 正式回填：`04-配置设计.md` §7
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 8）

## 1. Step 状态与输入

| 项 | 结论 |
|---|---|
| 当前 Step | Step 7：配置项清单 |
| 输入 | Step 3 控制面、Step 4 分类边界、Step 5 来源优先级、Step 6 profile 矩阵、03 §13 和 DDD Step 14/15 |
| 输出 | 按功能域的 P0 配置项、严格 JSON 模块 demo、完整 JSONC demo、停审记录和跨项审计 |
| 本步限制 | 不定义 secret provider API、加载函数、error enum、变更流程、部署命令或真实值；这些留 Step 8～13/下游文档 |
| 命名规则 | 以下是项目本地配置名；系统聚合时可映射为 `archive.<module>.<setting>`，不要求本地文件重复 `archive` 前缀 |
| 生效总规则 | 所有项均为 startup/new assembly，或由对应 job 在 job-run-start 固化；当前不支持 hot reload、online LKG 或动态 adapter replacement |
| 默认值总规则 | `无（必填）` 表示没有隐式零值；`Blocked`/`Disabled` 是失败或可用性姿态，不是默认成功值 |
| 下一动作 | 更新 flow/台账后进入 Step 8 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 配置项名称、类型和默认值是什么？ | P0 项按 `profile`、`assembly`、`stores`、`sources`、`authority_visibility`、`integrity_compatibility`、`storage_lifecycle`、`restore_receivers`、`inbound`、`operation_cursor`、`budgets`、`observability` 拆分。除 code declaration 的 schema/required metadata 外，不提供隐式默认；外部能力未闭合保持 `Blocked/Unknown/Unsupported`。 |
| 哪些项必填、从哪里来、作用域是什么？ | profile、local store/context、authority/visibility、已暴露 surface 所需的 exact slot、operation/cursor binding 和安全 redaction 为 required；source/receiver/inbound 按 frozen target/family 条件 required。普通值按 `DECL < JSON < ENV`，secret 只接受 opaque locator。 |
| 每项如何生效、敏感级别和失败策略是什么？ | 统一在表中给出作用域、startup/job-run-start 生效、sensitivity 和 typed fail-closed 处置；非法高优先级值不回退低优先级值。 |
| 模块 demo 如何组织？ | 每个功能域单独给严格 JSON demo；占位字符串仅表示 schema 形状，不是可部署配置。完整文档示例单独用 JSONC，注释不得被运行时 parser 接受。 |
| 是否影响 03？ | 当前项都映射到既有 typed ref/parameter/slot/builder seam，不新增业务对象、trait、port、DTO、error 或 flow；future 若需要新增代码字段，必须先回写 03。 |

## 3. 当前材料问题诊断与取舍

| 发现 | 风险 | 本 Step 裁定 |
|---|---|---|
| 旧 README/旧 05/06 有具体数据库、对象存储、保留年限和性能数字 | 历史值会伪装成默认配置 | 全部排除；只写 typed ref、required、blocked 和待 authority 数值 |
| 03 已有 11 类 slot，但没有完整用户配置清单 | 实现者可能创建动态字符串 registry 或 fallback | 每个功能域使用有限 registry / exact binding ref；required set 仍由 assembly begin 冻结 |
| workspace projection、observability material 也在 source matrix | 可能被配置成 canonical 或 audit backend | key 名明确 `workspace_projection` / `observability_material`；分类和 owner 不可被配置改变 |
| operation/cursor codec、store driver、预算数值未闭合 | 伪造稳定 codec 或零值预算会产生错误事实 | 项目保留 ref/typed bound；缺 binding/authority 即 mutation、continuation 或 job blocked |
| P1/P2 外部产品尚未选择 | 把未来产品字段写入 P0 会锁死架构 | 不列供应商、endpoint、DSN、KMS、topic、算法或真实 schema |

采用的拆分原则是：每个模块只表达一个功能边界；`storage/common/misc/runtime` 等泛化模块不承载不同职责；所有 adapter/provider 关系通过 ref/registry 表达，而不是 package dependency 或 payload override。

## 4. P0 配置项总清单

列中 `DECL/JSON/ENV` 是来源优先级缩写：具体字段只有在 registry 标注 allow-list 后才允许 ENV 覆盖。`无（必填）` 和 `Blocked` 不构成成功默认。

敏感级别在本步以简写表示：`none` 统一解释为规范的 `internal`，`ref-only`/`restricted` 统一解释为规范的 `sensitive`。真实 `secret` 是私有解析材料而不是普通配置项，不得出现在本清单或普通 JSON/ENV 中；Step 8 将正式收口这一映射。

| 配置项 | 类型 | 默认值 | 必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `profile.name` | 有限 `ArchiveRuntimeProfileRef` | 无（必填） | 是 | DECL/JSON/ENV | assembly | startup/new assembly | none | 未知 profile 或冲突→拒绝 candidate | infra/config、runtime_builder |
| `profile.schema_revision` | non-empty revision ref | 无（必填） | 是 | DECL/JSON/ENV | assembly | startup | none | 缺失/不支持→fail-fast | infra/config |
| `profile.config_revision` | opaque config revision ref | 无（必填） | 是 | JSON/ENV | assembly identity | startup/new assembly | none | 非法或重复→拒绝 candidate | infra/config、builder |
| `assembly.binding_registry_ref` | typed exact binding-registry ref | 无（必填） | 是 | JSON/ENV | assembly | startup/new assembly | ref-only | 缺失/未核验→assembly blocked | runtime_builder |
| `assembly.surface_registry_ref` | finite exposed-surface registry ref | 无（必填） | 是 | JSON/ENV | assembly | startup/new assembly | ref-only | surface 未知→不暴露 facade | runtime_builder、api、worker |
| `assembly.optional_slot_registry_ref` | validated optional-slot registry ref | 无（必填） | 是 | DECL/JSON | assembly | startup/new assembly | ref-only | 未经 registry 声明的 Disabled→fail-fast | runtime_builder |
| `stores.local_store_binding_ref` | `ArchiveStoreBindingRef` | Blocked | 是 | JSON/ENV | assembly | startup/new assembly | ref-only | 缺失或无 atomic UoW/CAS/probe→assembly blocked | infra/store_adapter |
| `stores.context_source_binding_ref` | `ArchiveAdapterBindingRef` | Blocked | 是 | JSON/ENV | assembly | startup/new assembly | ref-only | 缺失→受影响 surface blocked | infra/context_adapter |
| `stores.worker_control_binding_ref` | typed worker-control binding ref | Blocked | 条件 | JSON/ENV | worker assembly | startup/new assembly | ref-only | claim/fence 不可用→worker blocked | infra/worker_control、worker |
| `sources.identity.export_binding_ref` | exact source export binding ref | Blocked | 条件 | JSON/ENV | selected source target | startup; job-run-start 固化 | ref-only | owner 合同/coverage 缺失→该 source blocked | source_export_adapter |
| `sources.conversation.export_binding_ref` | exact source export binding ref | Blocked | 条件 | JSON/ENV | selected source target | startup; job-run-start 固化 | ref-only | 同上；不接收未授权正文 | source_export_adapter |
| `sources.work.export_binding_ref` | exact source export binding ref | Blocked | 条件 | JSON/ENV | selected source target | startup; job-run-start 固化 | ref-only | 缺 lifecycle/fence/coverage→blocked | source_export_adapter |
| `sources.process.export_binding_ref` | exact source export binding ref | Blocked | 条件 | JSON/ENV | selected source target | startup; job-run-start 固化 | ref-only | 缺 checkpoint/coverage→blocked | source_export_adapter |
| `sources.governance.export_binding_ref` | exact source/decision binding ref | Blocked | 条件 | JSON/ENV | selected source target | startup; job-run-start 固化 | ref-only | 缺 formal decision→blocked；不造 policy | source_export_adapter、governance_adapter |
| `sources.artifact.export_binding_ref` | exact artifact material/ref binding | Blocked | 条件 | JSON/ENV | selected source target | startup; job-run-start 固化 | ref-only | ref/正文/血缘闭包不明→blocked | source_export_adapter |
| `sources.workspace_projection.export_binding_ref` | `WorkspaceProjection/Auxiliary` binding | Disabled/Blocked | 条件 | JSON/ENV | selected auxiliary target | startup; job-run-start 固化 | ref-only | 缺合同→auxiliary unavailable；不得补 canonical | source_export_adapter |
| `sources.observability_material.export_binding_ref` | `ObservabilityMaterial` binding | Disabled/Blocked | 条件 | JSON/ENV | selected material target | startup; job-run-start 固化 | ref-only | `AR-UP-007` 未闭合→material handoff blocked | source_export_adapter |
| `authority_visibility.authority_binding_ref` | exact `Authority` slot ref | Blocked | 是 | JSON/ENV | assembly/surface | startup/new assembly | ref-only | Denied/Unknown/Unavailable 保持原姿态 | authority_adapter |
| `authority_visibility.visibility_binding_ref` | exact `Visibility` slot ref | Blocked | 是 | JSON/ENV | assembly/query | startup/new assembly | ref-only | 缺 current decision→不暴露 read surface | visibility_adapter |
| `authority_visibility.redaction_profile_ref` | validated redaction profile ref | 无（必填） | 是 | DECL/JSON/ENV | process/assembly | startup/new assembly | restricted | 未知或冲突→fail-fast；不 fail-open | visibility_adapter、observability |
| `integrity_compatibility.integrity_binding_ref` | exact `Integrity` slot ref | Blocked | 条件 | JSON/ENV | selected Bundle/target | startup; job-run-start 固化 | ref-only | capability unknown→assessment blocked/unknown | integrity_adapter |
| `integrity_compatibility.compatibility_binding_ref` | exact `Compatibility` slot ref | Blocked | 条件 | JSON/ENV | selected Bundle/target | startup; job-run-start 固化 | ref-only | unsupported/conflicting→不迁移、不复用 | compatibility_adapter |
| `integrity_compatibility.target_registry_ref` | finite target/capability registry ref | 无（必填） | 条件 | JSON/ENV | assessment job | startup/new assembly | ref-only | unknown target→Unsupported/Blocked | runtime_builder、assessment jobs |
| `storage_lifecycle.archive_storage_binding_ref` | exact `ArchiveStorage` slot ref | Blocked | 条件 | JSON/ENV | placement/retrieval target | startup; job-run-start 固化 | ref-only | 无 location/commit/probe 合同→不派发 | archive_storage_adapter |
| `storage_lifecycle.governance_decision_binding_ref` | exact `GovernanceDecision` slot ref | Blocked | 条件 | JSON/ENV | lifecycle target | startup; job-run-start 固化 | ref-only | decision/hold/risk 缺失→Blocked | governance_adapter |
| `storage_lifecycle.retention_schedule_ref` | schedule ref（非 policy） | Disabled/Blocked | 条件 | JSON/ENV | worker registration/job | startup; job-run-start 固化 | ref-only | schedule 不授权；缺失→不执行 cleanup | worker、lifecycle |
| `storage_lifecycle.result_retention_decision_ref` | owner-issued retention decision ref | Blocked | 条件 | JSON/ENV | result/history cleanup | startup; job-run-start 固化 | ref-only | 未核验→保留未决结果，不清理 | store adapter、worker |
| `restore_receivers.owner_binding_registry_ref` | finite `RestoreOwnerRef`→receiver binding map | Blocked | 条件 | JSON/ENV | frozen restore owner set | startup; job-run-start 固化 | ref-only | selected owner 缺 exact receiver→该 item blocked | restore_receiver_adapter |
| `restore_receivers.receiver_schema_registry_ref` | receiver capability/version registry ref | Blocked | 条件 | JSON/ENV | restore plan/handoff | startup; job-run-start 固化 | ref-only | unsupported/conflict→不派发 | restore_receiver_adapter |
| `inbound.consumer_binding_registry_ref` | finite `ArchiveInboundFamily` map | Disabled/Blocked | 条件 | JSON/ENV | worker assembly | startup/new assembly | ref-only | 未暴露 family 可省；暴露但缺合同→quarantine/no ACK success | consumer_adapter、worker |
| `inbound.trust_schema_registry_ref` | trusted envelope/schema registry ref | Blocked | 条件 | JSON/ENV | consumer assembly | startup/new assembly | ref-only | unknown schema/source→拒绝或 quarantine | consumer_adapter |
| `operation_cursor.operation_key_codec_ref` | body-free operation-key codec ref | Blocked | 是（非-Query） | JSON/ENV | command/consumer/job | startup/new assembly | ref-only | 缺失→mutation reserve blocked | application idempotency、store |
| `operation_cursor.operation_input_digest_ref` | body-free input-digest binding ref | Blocked | 是（非-Query） | JSON/ENV | command/consumer/job | startup/new assembly | ref-only | 未闭合→reserve blocked；不借 Bundle digest | application idempotency |
| `operation_cursor.public_cursor_codec_ref` | public cursor codec ref | Blocked | 条件（分页） | JSON/ENV | Query surface | startup/new assembly | ref-only | 缺失→continuation blocked；不出 private cursor | query boundary |
| `operation_cursor.repository_cursor_mapping_ref` | public/private cursor mapping ref | Blocked | 条件（分页） | JSON/ENV | Query surface | startup/new assembly | ref-only | mapping mismatch→Stale/NotAvailable | query boundary、store |
| `budgets.request_max_items` | positive bounded integer | 无（必填） | 是 | JSON/ENV | API entry | startup/new assembly | none | 缺失/非法/超范围→fail-fast或拒绝请求 | api/application |
| `budgets.request_max_bytes` | positive bounded bytes | 无（必填） | 是 | JSON/ENV | API entry | startup/new assembly | none | 同上；不截断为 accepted | api/application |
| `budgets.query_page_max_items` | positive bounded integer | 无（必填） | 是 | JSON/ENV | Query | startup/new assembly | none | 超限→Invalid/NotAvailable；不写修复 | api/application |
| `budgets.query_page_max_token_bytes` | positive bounded bytes | 无（必填） | 是 | JSON/ENV | Query | startup/new assembly | none | token 超限/不匹配→cursor error | query boundary |
| `budgets.source_batch_max_items` | positive bounded integer | 无（必填） | 条件 | JSON/ENV | source jobs | job-run-start 固化 | none | 缺失→capture blocked；不漏项 Complete | source jobs |
| `budgets.source_batch_max_bytes` | positive bounded bytes | 无（必填） | 条件 | JSON/ENV | source jobs | job-run-start 固化 | none | 超限→bounded failure/partial | source jobs |
| `budgets.bundle_entry_max_items` | positive bounded integer | 无（必填） | 条件 | JSON/ENV | Bundle assembly | job-run-start 固化 | none | 超限→closure incomplete/blocked | bundle jobs |
| `budgets.restore_batch_max_items` | positive bounded integer | 无（必填） | 条件 | JSON/ENV | restore jobs | job-run-start 固化 | none | 超限→per-item partial/blocked | restore jobs |
| `budgets.worker_max_in_flight` | positive bounded integer | 无（必填） | 是 | JSON/ENV | worker process | startup/new assembly | none | 缺失→worker assembly blocked | worker/control |
| `budgets.timeout_store_read` | positive bounded duration | 无（必填） | 是 | JSON/ENV | local store | startup/new assembly | none | timeout→typed unavailable/unknown | store adapter |
| `budgets.timeout_store_commit` | positive bounded duration | 无（必填） | 是 | JSON/ENV | local UoW | startup/new assembly | none | timeout→commit unknown；exact probe only | store adapter |
| `budgets.timeout_external_effect` | positive bounded duration | 无（必填） | 条件 | JSON/ENV | storage/receiver/source | job-run-start 固化 | none | may-have-dispatched/unknown；禁止盲重试 | external adapters |
| `budgets.timeout_shutdown` | positive bounded duration | 无（必填） | 是 | JSON/ENV | worker process | startup/new assembly | none | shutdown posture visible；不回滚外部效果 | worker |
| `budgets.retry_max_attempts` | bounded integer | 无（必填） | 条件 | JSON/ENV | selected job/effect | job-run-start 固化 | none | 缺失→不自动重试；unknown 先 probe | jobs/adapters |
| `budgets.probe_max_attempts` | bounded integer | 无（必填） | 条件 | JSON/ENV | reconcile jobs | job-run-start 固化 | none | 缺失→保持 Unknown/manual | reconcile jobs |
| `budgets.lease_duration` | positive bounded duration | 无（必填） | 条件 | JSON/ENV | worker claim | job-run-start 固化 | none | 缺失/不支持→claim blocked | worker_control |
| `budgets.lease_renew_window` | positive bounded duration | 无（必填） | 条件 | JSON/ENV | worker claim | job-run-start 固化 | none | 不满足→旧 fence 不得 effect | worker_control |
| `observability.runtime_telemetry_mode` | finite `enabled|disabled` | 无（必填） | 是 | DECL/JSON/ENV | process | startup/new assembly | none | 非法→fail-fast；disabled 仍保留业务安全边界 | infra hooks |
| `observability.runtime_sink_binding_ref` | safe runtime sink ref | Disabled/Blocked | 否 | JSON/ENV | process | startup/new assembly | ref-only | sink 不可用→丢弃/降级，不改业务结果 | infra hooks |
| `observability.audit_material_handoff_ref` | external material/ref handoff | Disabled/Blocked | 否 | JSON/ENV | selected handoff | startup/new assembly | ref-only | `AR-UP-007` 未闭合→不交接、不建 backend truth | observability seam |

## 5. 配置域停审与回指表

| 配置域 | 控制面回指 | 分类回指 | 来源/环境回指 | 03 影响 | 停审结论 |
|---|---|---|---|---|---|
| `profile` / `assembly` | runtime profile、exact assembly | startup_assembly、availability_binding | Step 5；全部 profile | 无新增代码契约 | 通过；required set 不可由配置缩减 |
| `stores` | local store/consistency | startup_assembly、sensitive_locator、bounded_parameter | Step 5；local/CI fake 仅 test | 无新增代码契约 | 通过；无 atomic UoW/CAS/probe 即 blocked |
| `sources` | source/authority/visibility | target_mapping、policy_reference | Step 5；按 selected target | 无新增代码契约 | 通过；Workspace/Observability 不升格 |
| `authority_visibility` | authority/visibility | policy_reference、sensitive_locator | Step 5；所有 profile | 无新增代码契约 | 通过；不配置 allow/deny 结果 |
| `integrity_compatibility` | integrity/compatibility | target_mapping、policy_reference | Step 5；integration/P1 条件 | 无新增代码契约 | 通过；不配置算法/key/Verified |
| `storage_lifecycle` | storage/lifecycle | target_mapping、policy_reference、bounded_parameter | Step 5；selected job | 无新增代码契约 | 通过；schedule 不授权 action |
| `restore_receivers` | per-owner receiver | target_mapping、sensitive_locator | Step 5；frozen owner set | 无新增代码契约 | 通过；无 all-owner fallback |
| `inbound` | exact consumer | availability_binding、target_mapping | Step 5；exposed family | 无新增代码契约 | 通过；未知 schema quarantine |
| `operation_cursor` | codec/mapping | startup_assembly、sensitive_locator | Step 5；Query/非-Query分界 | 无新增代码契约 | 通过；缺 codec 分别阻断 mutation/continuation |
| `budgets` | budget control | bounded_parameter | Step 5/6；profile/job-run-start | 无新增代码契约 | 通过；当前不填数值 |
| `observability` | safe telemetry/redaction | policy_reference、sensitive_locator | Step 5/6；全部 profile | 无新增代码契约 | 通过；sink 不等 evidence/backend |

## 6. 严格 JSON 模块 demo

以下每段都是语法有效的严格 JSON。`<...>` 是文档占位符，不能直接作为部署配置；不会携带真实 endpoint、DSN、secret、算法或数值 baseline。

### profile 模块 demo

```json
{
  "profile": {
    "name": "<local-dev|ci-test|integration-like|operations-replay|staging-like|production-like>",
    "schema_revision": "<schema-revision>",
    "config_revision": "<config-revision>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `profile.name` | finite ref | `<...>` | 选择已登记 profile | 不得未知、重复或与文件/ENV冲突 | whole candidate reject |
| `profile.schema_revision` | revision ref | `<...>` | 选择 schema 兼容语义 | 只接受已支持 revision | fail-fast |
| `profile.config_revision` | opaque revision | `<...>` | 固定 assembly identity | old work 不用 current revision 重建 | assembly blocked |

### assembly 模块 demo

```json
{
  "assembly": {
    "binding_registry_ref": "<exact-binding-registry-ref>",
    "surface_registry_ref": "<exposed-surface-registry-ref>",
    "optional_slot_registry_ref": "<validated-optional-slot-registry-ref>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `assembly.binding_registry_ref` | typed ref | `<...>` | 定位 exact slot bindings | 必须覆盖 frozen required set | assembly blocked |
| `assembly.surface_registry_ref` | typed ref | `<...>` | 定位被暴露 surface | 不得授予额外写权 | facade 不暴露 |
| `assembly.optional_slot_registry_ref` | typed ref | `<...>` | 只声明正式 optional slot | required slot 不得被标 optional | fail-fast |

### stores 模块 demo

```json
{
  "stores": {
    "local_store_binding_ref": "<store-binding-ref>",
    "context_source_binding_ref": "<context-source-binding-ref>",
    "worker_control_binding_ref": "<worker-control-binding-ref-or-disabled>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `stores.local_store_binding_ref` | typed ref | `<...>` | 注入 local store/UoW/CAS/probe | capability 必须与 declared contract 匹配 | production assembly blocked |
| `stores.context_source_binding_ref` | typed ref | `<...>` | 注入 ID/clock/context seam | 不从配置猜 authority | affected surface blocked |
| `stores.worker_control_binding_ref` | typed ref/disabled | `<...>` | claim/fence/checkpoint seam | worker 暴露时 required | worker blocked |

### sources 模块 demo

```json
{
  "sources": {
    "identity": { "export_binding_ref": "<binding-ref>" },
    "conversation": { "export_binding_ref": "<binding-ref>" },
    "work": { "export_binding_ref": "<binding-ref>" },
    "process": { "export_binding_ref": "<binding-ref>" },
    "governance": { "export_binding_ref": "<binding-ref>" },
    "artifact": { "export_binding_ref": "<binding-ref>" },
    "workspace_projection": { "export_binding_ref": "<auxiliary-binding-ref-or-disabled>" },
    "observability_material": { "export_binding_ref": "<material-binding-ref-or-disabled>" }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `sources.<SourceClass>.export_binding_ref` | finite exact ref | `<...>` | 绑定该 SourceClass 的 owner seam | key set 固定；workspace/observability 只为 Auxiliary/Material | target-specific blocked |

### authority_visibility 模块 demo

```json
{
  "authority_visibility": {
    "authority_binding_ref": "<authority-binding-ref>",
    "visibility_binding_ref": "<visibility-binding-ref>",
    "redaction_profile_ref": "<redaction-profile-ref>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `authority_visibility.authority_binding_ref` | typed ref | `<...>` | 绑定正式 authority port | 不携带 allow/deny 决定正文 | Denied/Unknown/Unavailable 保留 |
| `authority_visibility.visibility_binding_ref` | typed ref | `<...>` | 绑定 current visibility resolver | 不复用旧权限或 cache result | Query surface blocked |
| `authority_visibility.redaction_profile_ref` | typed ref | `<...>` | 绑定 safe redaction | denylist 不可由 profile 放宽 | fail-fast/fail-closed |

### integrity_compatibility 模块 demo

```json
{
  "integrity_compatibility": {
    "integrity_binding_ref": "<integrity-binding-ref-or-blocked>",
    "compatibility_binding_ref": "<compatibility-binding-ref-or-blocked>",
    "target_registry_ref": "<target-registry-ref>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `integrity_compatibility.integrity_binding_ref` | typed ref | `<...>` | 绑定完整性能力 | 不携带算法/key/digest literal | Unknown/Blocked |
| `integrity_compatibility.compatibility_binding_ref` | typed ref | `<...>` | 绑定 schema/reader compatibility | 不自动迁移或复用 target | Unsupported/Conflicting |
| `integrity_compatibility.target_registry_ref` | finite registry ref | `<...>` | 限定可评估 target | unknown target 不自动接受 | Unsupported/Blocked |

### storage_lifecycle 模块 demo

```json
{
  "storage_lifecycle": {
    "archive_storage_binding_ref": "<archive-storage-binding-ref>",
    "governance_decision_binding_ref": "<governance-decision-binding-ref>",
    "retention_schedule_ref": "<schedule-ref-or-disabled>",
    "result_retention_decision_ref": "<owner-decision-ref-or-blocked>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `storage_lifecycle.archive_storage_binding_ref` | typed ref | `<...>` | 绑定 placement/retrieval/lifecycle seam | location/tier/provider 不在文档定值 | no dispatch/Unknown |
| `storage_lifecycle.governance_decision_binding_ref` | typed ref | `<...>` | 绑定 formal decision owner | 不生成 retention/hold/delete/risk | Blocked |
| `storage_lifecycle.retention_schedule_ref` | schedule ref | `<...>` | 触发已授权 schedule | schedule 不是 decision | cleanup disabled/blocked |
| `storage_lifecycle.result_retention_decision_ref` | decision ref | `<...>` | 保护 replay/history 义务 | 不早于 replay/reconcile/history | 不清理未决记录 |

### restore_receivers 模块 demo

```json
{
  "restore_receivers": {
    "owner_binding_registry_ref": "<owner-receiver-registry-ref>",
    "receiver_schema_registry_ref": "<receiver-schema-registry-ref>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `restore_receivers.owner_binding_registry_ref` | finite map ref | `<...>` | owner-specific receiver mapping | selected owner exact match；禁止 all-owner fallback | item blocked |
| `restore_receivers.receiver_schema_registry_ref` | typed ref | `<...>` | version/capability check | unsupported/conflict 不派发 | handoff blocked |

### inbound 模块 demo

```json
{
  "inbound": {
    "consumer_binding_registry_ref": "<consumer-registry-ref-or-disabled>",
    "trust_schema_registry_ref": "<trusted-schema-registry-ref>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `inbound.consumer_binding_registry_ref` | finite map ref | `<...>` | 绑定五类 inbound family | 未暴露可省；未知 family 不可动态订阅 | quarantine/no ACK success |
| `inbound.trust_schema_registry_ref` | trusted schema ref | `<...>` | 校验 envelope/source/schema | arrival/ACK 不等本地 commit | reject/quarantine |

### operation_cursor 模块 demo

```json
{
  "operation_cursor": {
    "operation_key_codec_ref": "<operation-key-codec-ref-or-blocked>",
    "operation_input_digest_ref": "<operation-input-digest-ref-or-blocked>",
    "public_cursor_codec_ref": "<public-cursor-codec-ref-or-blocked>",
    "repository_cursor_mapping_ref": "<repository-cursor-mapping-ref-or-blocked>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `operation_cursor.operation_key_codec_ref` | typed ref | `<...>` | stable operation namespace | 不用 debug/JSON 临时编码 | non-Query reserve blocked |
| `operation_cursor.operation_input_digest_ref` | typed ref | `<...>` | canonical input digest | 与 Bundle digest 分离 | reserve blocked |
| `operation_cursor.public_cursor_codec_ref` | typed ref | `<...>` | public cursor protection | 不回传 private cursor | continuation blocked |
| `operation_cursor.repository_cursor_mapping_ref` | typed ref | `<...>` | selector/snapshot/order mapping | binding identity mismatch 可见 | Stale/NotAvailable |

### budgets 模块 demo

```json
{
  "budgets": {
    "request_max_items": "<required-positive-bound>",
    "request_max_bytes": "<required-positive-bound>",
    "query_page_max_items": "<required-positive-bound>",
    "query_page_max_token_bytes": "<required-positive-bound>",
    "source_batch_max_items": "<required-positive-bound>",
    "source_batch_max_bytes": "<required-positive-bound>",
    "bundle_entry_max_items": "<required-positive-bound>",
    "restore_batch_max_items": "<required-positive-bound>",
    "worker_max_in_flight": "<required-positive-bound>",
    "timeout_store_read": "<required-duration>",
    "timeout_store_commit": "<required-duration>",
    "timeout_external_effect": "<required-duration>",
    "timeout_shutdown": "<required-duration>",
    "retry_max_attempts": "<required-bound>",
    "probe_max_attempts": "<required-bound>",
    "lease_duration": "<required-duration>",
    "lease_renew_window": "<required-duration>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `budgets.*` | typed positive bound/duration | `<required-...>` | 限制请求、页、批、worker、timeout、probe/retry/lease | 关系校验；不得用零值或 job payload 覆盖 | fail-fast 或受影响 job blocked |

### observability 模块 demo

```json
{
  "observability": {
    "runtime_telemetry_mode": "<enabled|disabled>",
    "runtime_sink_binding_ref": "<safe-sink-ref-or-disabled>",
    "audit_material_handoff_ref": "<approved-material-ref-or-disabled>"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `observability.runtime_telemetry_mode` | finite enum | `<enabled|disabled>` | 控制 Layer A safe telemetry | 不改变 Layer B truth/no-write | 非法→fail-fast |
| `observability.runtime_sink_binding_ref` | safe sink ref | `<...>` | 注入可丢失 runtime sink | 不包含 endpoint/secret material | sink failure→drop/degrade |
| `observability.audit_material_handoff_ref` | approved material ref | `<...>` | 预留 L4-observability 交接 | `AR-UP-007` 前不构造 backend/audit truth | handoff blocked |

## 7. 完整配置 demo（JSONC 文档示例）

下面是带注释的 JSONC 文档示例，仅用于说明模块形状；实际运行配置必须删除注释并通过 strict JSON parser。所有尖括号均为不可直接部署的占位符。

```jsonc
{
  // 实际文件必须为 strict JSON；profile 只能取 registry 中已登记的值。
  "profile": {
    "name": "<profile>",
    "schema_revision": "<schema-revision>",
    "config_revision": "<config-revision>"
  },
  "assembly": {
    "binding_registry_ref": "<exact-binding-registry-ref>",
    "surface_registry_ref": "<surface-registry-ref>",
    "optional_slot_registry_ref": "<optional-slot-registry-ref>"
  },
  "stores": {
    "local_store_binding_ref": "<store-binding-ref>",
    "context_source_binding_ref": "<context-source-binding-ref>",
    "worker_control_binding_ref": "<worker-control-binding-ref-or-disabled>"
  },
  "sources": {
    "identity": { "export_binding_ref": "<binding-ref>" },
    "conversation": { "export_binding_ref": "<binding-ref>" },
    "work": { "export_binding_ref": "<binding-ref>" },
    "process": { "export_binding_ref": "<binding-ref>" },
    "governance": { "export_binding_ref": "<binding-ref>" },
    "artifact": { "export_binding_ref": "<binding-ref>" },
    "workspace_projection": { "export_binding_ref": "<auxiliary-ref-or-disabled>" },
    "observability_material": { "export_binding_ref": "<material-ref-or-disabled>" }
  },
  "authority_visibility": {
    "authority_binding_ref": "<authority-ref>",
    "visibility_binding_ref": "<visibility-ref>",
    "redaction_profile_ref": "<redaction-ref>"
  },
  "integrity_compatibility": {
    "integrity_binding_ref": "<integrity-ref-or-blocked>",
    "compatibility_binding_ref": "<compatibility-ref-or-blocked>",
    "target_registry_ref": "<target-registry-ref>"
  },
  "storage_lifecycle": {
    "archive_storage_binding_ref": "<storage-ref-or-blocked>",
    "governance_decision_binding_ref": "<governance-ref-or-blocked>",
    "retention_schedule_ref": "<schedule-ref-or-disabled>",
    "result_retention_decision_ref": "<decision-ref-or-blocked>"
  },
  "restore_receivers": {
    "owner_binding_registry_ref": "<owner-receiver-registry-ref>",
    "receiver_schema_registry_ref": "<receiver-schema-registry-ref>"
  },
  "inbound": {
    "consumer_binding_registry_ref": "<consumer-registry-ref-or-disabled>",
    "trust_schema_registry_ref": "<trusted-schema-ref>"
  },
  "operation_cursor": {
    "operation_key_codec_ref": "<operation-codec-ref-or-blocked>",
    "operation_input_digest_ref": "<input-digest-ref-or-blocked>",
    "public_cursor_codec_ref": "<public-cursor-ref-or-blocked>",
    "repository_cursor_mapping_ref": "<repository-map-ref-or-blocked>"
  },
  "budgets": {
    "request_max_items": "<required-positive-bound>",
    "request_max_bytes": "<required-positive-bound>",
    "query_page_max_items": "<required-positive-bound>",
    "query_page_max_token_bytes": "<required-positive-bound>",
    "source_batch_max_items": "<required-positive-bound>",
    "source_batch_max_bytes": "<required-positive-bound>",
    "bundle_entry_max_items": "<required-positive-bound>",
    "restore_batch_max_items": "<required-positive-bound>",
    "worker_max_in_flight": "<required-positive-bound>",
    "timeout_store_read": "<required-duration>",
    "timeout_store_commit": "<required-duration>",
    "timeout_external_effect": "<required-duration>",
    "timeout_shutdown": "<required-duration>",
    "retry_max_attempts": "<required-bound>",
    "probe_max_attempts": "<required-bound>",
    "lease_duration": "<required-duration>",
    "lease_renew_window": "<required-duration>"
  },
  "observability": {
    "runtime_telemetry_mode": "<enabled|disabled>",
    "runtime_sink_binding_ref": "<safe-sink-ref-or-disabled>",
    "audit_material_handoff_ref": "<approved-material-ref-or-disabled>"
  }
}
```

## 8. 跨配置项闭环审计与 03 影响判定

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个项是否回指 Step 3 控制面、Step 4 分类、Step 5 来源和 Step 6 profile | 通过 | §4/§5 回指；profile 条件在表中标明 |
| 是否有泛化模块混写 | 否 | 12 个功能域按职责拆分 |
| 必填项是否都有类型、作用域、生效和失败策略 | 通过 | 每一行均给出；预算数值只给类型/边界，不写未授权值 |
| 是否存在隐式 zero/empty/default success | 否 | `无（必填）`、`Blocked`、`Disabled/Blocked` 显式区分 |
| secret 是否被当普通字符串 | 否 | 仅 ref-only locator；Step 8 继续定义读取/轮换/审计 |
| workspace projection 是否可升级 canonical | 否 | source class 和禁止边界固定 |
| 是否存在 outbound publisher/topic/outbox 配置 | 否 | `AR-HLD-Q-001` 未闭合，未创建该域 |
| 是否把 runtime/event/ref/adapter 伪装成 compile dependency | 否 | 只记录 binding ref；compile candidate 仍仅 Core contracts |
| P1/P2 是否误写成 P0 | 否 | staging/production 只在 Step 6/13/14 作为未来方向 |
| 03 是否需要当前回写 | 否 | 当前仅承接既有 refs/slots/parameters；future code change 触发器保留 |

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本 Step 的 P0 key 只映射既有 typed ref、slot、validated parameter 和 builder seam | 否 | 配置清单收口 | 不适用 | 无回写 |
| strict JSON、模块拆分和 `DECL < JSON < ENV` 仅定义配置来源/格式 | 否 | 来源与文档语义 | 不适用 | 无回写 |
| future 若要求新增 runtime field、adapter constructor、port、error、DTO、flow 或 dynamic replacement | 是（仅未来触发条件，当前未激活） | 未来代码契约变化 | 03 §4～§15 与对应 calibration Step | 无回写（触发前必须暂停并回写） |

最后一项是未来触发器，不是当前 P0 待回写；若实施或下游把它变为当前能力，必须停止正式 04 装配并先回写 03。

## 9. 配置项停审与进入下一步条件

| 条件 | 状态 |
|---|---|
| 12 个配置域均已完成清单与功能拆分 | 通过 |
| 每个 P0 项都有类型、默认/必填、来源、作用域、生效、敏感级别、失败策略、关联模块 | 通过 |
| 模块级严格 JSON demo 和完整 JSONC demo 已提供 | 通过 |
| raw secret、真实 provider、endpoint、算法、数值 baseline 未进入文档 | 通过 |
| profile/slot/source-owner/Query no-write/restore write boundary 未被配置放宽 | 通过 |
| 跨配置项审计无 unresolved 冲突 | 通过 |
| 当前无 03 `待回写` 项 | 通过；future 能力仍为阻塞触发器 |
| 可进入 Step 8 | 通过 |
