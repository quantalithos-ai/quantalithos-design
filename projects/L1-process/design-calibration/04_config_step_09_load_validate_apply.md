# Step 9. 定义配置加载、校验与生效机制

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 9 中间产物。
> 本步定义配置如何加载、解析、校验、装配和生效。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
- 回填章节: `projects/L1-process/04-配置设计.md` §9 配置加载、校验与生效机制

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 7 配置项清单 | 定义类型校验和交叉校验 | 所有 P0 配置项必须 parse + typed validate |
| Step 8 敏感配置 | 定义 ref validation 和 redaction | raw secret fail-fast;ref 形态校验在 config load 阶段完成 |
| `03_ddd_step_14_config_external_binding.md` | 定义 runtime builder / adapter binding | validated `ProcessRuntimeConfig` 才能进入 `ProcessRuntimeBuilder` |
| Step 4 热更新口径 | 定义生效机制 | P0 不支持核心 hot reload;startup 或 job-run-start 生效 |

## 3. SOP 问题回答

### 3.1 配置在什么时机加载?

配置加载分两类:

- startup load: API / worker / runtime process 启动时加载全局 `ProcessRuntimeConfig`。
- job-run-start load: operations job 运行开始时读取已校验 runtime config 和 job DTO / entry args 的局部参数。

P0 不支持自动热更新。配置变更需要重启 runtime 或启动新的 job run。

### 3.2 配置如何 parse 和 type validate?

加载链固定为:

```text
defaults
  -> optional JSON file
  -> optional env overrides
  -> ordinary source merge
  -> ref-only sensitive validation
  -> typed parse
  -> cross-field validation
  -> validated ProcessRuntimeConfig
  -> ProcessRuntimeBuilder
```

JSON 必须是严格 JSON。完整文档示例可用 JSONC,但运行时配置不得包含注释。

### 3.3 哪些配置需要 cross-field validate?

需要交叉校验的配置组包括:

- `store.adapter_kind = durable` 时不能缺 durable adapter settings;P0 未定义 durable settings 时应 fail-fast。
- `idempotency.reserved_record_max_age <= idempotency.command_retention`。
- idempotency retention 不得短于配置的 retry / redelivery / rerun 窗口。
- `outbox.topic_map` 必须覆盖 10 个 `ProcessOutboxEventKind`。
- endpoint adapter 需要 endpoint ref;需要凭据时必须有 credential ref。
- handoff configured target 需要 destination ref。
- retry backoff 的 max delay 必须大于等于 initial delay。
- `features.search_enabled = true` 时必须存在 configured search adapter;当前 P0 无 search adapter,因此启用时 fail-fast。
- config 不得包含 raw secret、raw body allow-list 或 forbidden boundary override。

### 3.4 哪些配置 startup / reload / hot / build-time / static?

| 生效方式 | 配置组 | 说明 |
|---|---|---|
| startup | store、boundary、idempotency、projection adapter、external、outbox publisher、topic map、handoff target、features、runtime | runtime 启动时读取,变更需重启 |
| job-run-start | batch、parallelism、job timeout、retry backoff、job scope、report ref | job run 开始时冻结 |
| reload | P0 无核心 reload | 后续若启用需补 03 runtime contract |
| hot | P0 无 hot update | 后续若启用需补 reject / rollback / last-known-good 机制 |
| static | truth ownership、external body exclusion、state matrix、query no-write、projection no-write、dependency discipline | 不是普通配置 |

### 3.5 校验失败后如何处理?

- startup config invalid: fail-fast,不启动 runtime。
- job-run-start local args invalid: reject job run,不进入业务 UoW。
- configured adapter ref 不完整: fail-fast。
- configured adapter 运行期不可达: 按 resolver / publisher / handoff 错误映射 explicit unresolved / retry / failed marker,不得 fallback fake success。
- forbidden body / raw secret 出现: fail-fast 并 redaction-safe 报告。

## 4. 结构化中间产物

#### 配置加载流程图: L1-process 配置加载与校验

```text
[code defaults]
  -> [JSON config file]
  -> [environment overrides]
  -> [merge ordinary values]
  -> [validate ref-only sensitive values]
  -> [type validate]
  -> [cross-field validate]
  -> [validated ProcessRuntimeConfig]
  -> [ProcessRuntimeBuilder]
  -> [api / worker / jobs runtime handle]
```

关键说明:

- 图表达配置加载和校验顺序,不表达部署命令。
- raw secret 和 forbidden body 在进入 runtime builder 前必须被拒绝。
- `application`、`domain`、`contracts` 不读取配置来源。

### 4.1 加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `store.*` | startup | enum / duration / bool;durable adapter cross-field | startup | invalid fail-fast |
| `boundary.*` | startup | byte size、page limit、timeout 范围 | startup | invalid fail-fast |
| `idempotency.*` | startup | duration 范围;retention vs retry / redelivery | startup | invalid fail-fast |
| `projection.*` | startup / job-run-start | adapter enum、stale threshold、batch size | startup / job-run-start | invalid fail-fast |
| `jobs.*` | startup / job-run-start | batch、parallelism、timeout、backoff | job-run-start | invalid job rejected |
| `external.*` | startup | adapter kind、endpoint ref、credential ref、timeout、retry | startup | incomplete fail-fast;runtime unavailable explicit marker |
| `outbox.publisher` | startup | adapter kind、endpoint ref、credential ref | startup | incomplete fail-fast |
| `outbox.topic_map` | startup | all 10 event topics present,non-empty,stable suffix | startup | missing / unknown fail-fast |
| `outbox.publish_*` | job-run-start | batch and retry policy | job-run-start | invalid job rejected |
| `handoff.*` | startup / job-run-start | target config、destination ref、timeout、retry | startup / job-run-start | incomplete fail-fast;runtime unavailable failed marker |
| `features.*` | startup | bool;feature dependency check | startup | invalid fail-fast |
| `runtime.*` | startup | enum;profile compatibility | startup | invalid fail-fast |
| ref-only sensitive values | startup | non-empty ref;raw secret pattern rejection | startup | invalid fail-fast |
| forbidden boundary overrides | startup | static deny-list | startup | reject config |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 加载链为 defaults -> JSON -> env -> validate -> builder | 否 | 配置加载语义 | 无 | 无回写 |
| P0 不支持 core hot reload | 否 | 配置生效语义 | 无 | 无回写 |
| configured adapter 不得 fallback fake success | 否 | 配置安全语义 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §9 应写明配置在 startup 或 job-run-start 加载。P0 不支持核心 hot reload。配置必须经过普通来源 merge、ref-only sensitive validation、typed validation、cross-field validation 后形成 `ProcessRuntimeConfig`,再交给 `ProcessRuntimeBuilder`。configured adapter 运行期失败不得回退 fake success。

## 7. 待确认事项

- 无阻塞 Step 10 的待确认事项。
- 若未来需要 reload / hot update,必须先回写 `03-详细设计.md`。

## 8. 进入下一步条件

- 配置加载和生效行为可实现。
- 类型校验和交叉字段校验已覆盖 P0 配置。
- 详细设计影响判定为无回写。
