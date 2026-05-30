# L0-bus 04 配置设计 Step 7: 配置项清单

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 7 中间产物。
> 本步只定义配置项清单、模块级 JSON demo、逐项说明表和完整 JSONC 文档示例。
> 本步不创建正式 `04-配置设计.md`,不新增未判定的 Rust 代码契约。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 定义配置项清单 |
| 状态 | 已确认 |
| 正式回填位置 | `04-配置设计.md` §7 |
| 是否修改正式 `04-配置设计.md` | 否 |
| 是否必须判定对 `03-详细设计.md` 的影响 | 是 |

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 配置来源链为 `code defaults -> JSON config file -> environment overrides -> secret refs / connection refs -> validated runtime config` | 确定配置项来源、读取边界和装配路径 |
| `04_config_step_04_classification_boundaries.md` | P0 配置冷更新;禁止 raw secret、payload body fallback、projection truth write、replay bypass 等配置化 | 确定敏感级别、失败策略和禁止配置项 |
| `04_config_step_05_sources_priority_conflicts.md` | 普通优先级为 `code defaults < JSON config file < environment variables`;secret / connection ref 不属于普通覆盖链 | 确定来源、覆盖规则和冲突 fail-fast |
| `04_config_step_06_profiles_matrix.md` | profile 是配置矩阵分类,不是 `RuntimeConfig.profile` 字段 | 确定不同 profile 的示例值,不新增 profile 字段 |
| `03-详细设计.md` §13 | 已定义 `RuntimeConfig` 配置绑定点和外部依赖绑定 | 配置项必须追溯到已定义的 config 组 |
| `03_ddd_step_14_config_dependencies.md` §7.3 | 已给出 `RuntimeConfig`、`StoreConfig`、`BackendConfig`、`JobConfig` 的代码契约片段 | 避免在本步无判定地扩展代码结构 |

---

## 3. SOP 问题回答

### 3.1 每个 P0 配置项的名称、类型、默认值是什么?

P0 配置项按 `03-详细设计.md` 已定义的 `RuntimeConfig` 子配置组展开:

- `store`: bus store 与 UnitOfWork adapter。
- `transport_backend`: transport backend adapter。对应详细设计中的 `BackendConfig`,本步采用更清楚的外部 JSON 名称。
- `outbox_source`: L0-core committed outbox source adapter。
- `publisher`: outbound event publisher adapter。
- `api`: inbound API entry。
- `worker`: worker loop entry。
- `jobs`: operations jobs entry。
- `projection`: read projection adapter 与 rebuild job。
- `recovery_policy`: retry、DLQ、replay eligibility 的策略引用。
- `security_boundary`: secret ref、privileged operation ref、payload redaction 等安全边界。
- `clock`: clock adapter。
- `id_generator`: id generator adapter。

配置项总表见 §7.1。默认值以 P0 可验证路径为准: in-memory store、in-memory backend、in-memory fixture source、in-memory sink、local API profile、显式启动 worker / job、ref-only secret、system clock 和 UUID generator。

### 3.2 哪些配置项必填?

本步采用“结构必填、部分字段可由默认值补齐”的口径:

| 类型 | 规则 | 示例 |
|---|---|---|
| 顶层功能模块 | 必须存在于最终 `ValidatedRuntimeConfig`;可以由 code defaults 补齐 | `store`、`api`、`security_boundary` |
| P0 默认路径字段 | 可缺省,缺省时使用 code defaults | `store.kind = "in_memory"`、`publisher.kind = "in_memory_sink"` |
| 外部依赖引用 | 当 `kind` 选择外部后端时必填;P0 in-memory 可为空 | `store.connection_ref`、`transport_backend.secret_ref` |
| 安全边界字段 | 必须由默认值或文件明确形成,且不能被覆盖到不安全值 | `secret_policy = "ref_only"`、`payload_body_policy = "reject"` |
| worker / job 运行参数 | 入口被启用时必须可解析且通过上限校验 | `worker.batch_size`、`jobs.batch_size` |

因此“配置文件中必填”和“运行时校验后必填”不同。配置文件可省略有安全默认值的字段,但 `ConfigValidator` 输出的 `ValidatedRuntimeConfig` 必须完整。

### 3.3 每个配置项从哪里来、作用域是什么?

普通配置来源遵循 Step 5 的覆盖链:

```text
code defaults
  -> JSON config file
  -> environment variables
  -> RuntimeConfig
  -> ConfigValidator
  -> ValidatedRuntimeConfig
```

secret / connection 只保存引用:

```text
JSON config file / env
  -> secret_ref / connection_ref
  -> ConfigValidator checks ref shape
  -> adapter constructor resolves through allowed provider later
```

作用域按功能边界拆分:

- entry scope: `api`、`worker`、`jobs`。
- adapter scope: `store`、`transport_backend`、`outbox_source`、`publisher`、`projection`。
- policy scope: `recovery_policy`、`security_boundary`。
- deterministic runtime scope: `clock`、`id_generator`。

### 3.4 每个配置项如何生效、是否敏感、失败策略是什么?

P0 统一采用冷更新:

- 配置只在启动或 operations job 启动时读取。
- `ConfigLoader` 解析 JSON 和 env override。
- `ConfigValidator` 执行类型校验、范围校验、跨字段校验、禁止配置化边界校验。
- `RuntimeBuilder` 只接收 `ValidatedRuntimeConfig` 并构造 adapter / service / entry graph。

敏感级别分为:

| 敏感级别 | 含义 | 示例 |
|---|---|---|
| `public` | 可写入示例和日志 | `api.enabled` |
| `internal` | 可出现在配置和审计摘要,不应对外暴露细节 | `worker.batch_size` |
| `sensitive-ref` | 只允许引用,禁止 raw value | `transport_backend.secret_ref`、`store.connection_ref` |
| `forbidden` | 不允许作为可配置项 | raw secret、payload body fallback、projection truth write |

失败策略以 fail-fast 和 fail-closed 为主:

- 解析失败、类型错误、范围错误: fail-fast,启动失败。
- secret / connection ref 形态错误: fail-fast。
- 安全边界被配置到不安全值: fail-closed,启动失败。
- 外部 kind 选择了 P0 不支持的后端: fail-fast,提示该 kind 属于 P1/P2。

### 3.5 每个配置项关联哪些模块?

关联关系见 §7.1 的“关联模块”列。本步的原则是:

- 配置项关联实现模块,不是按对象名机械拆分。
- `contracts` 和 `domain` 不直接读取配置。
- `application` 不读取 JSON / env,只接收由 infra 构造好的 port、policy、service dependency。
- `infra` 负责加载、校验和 adapter 构造。
- `api`、`worker`、`jobs` 只消费入口级 `ValidatedRuntimeConfig` 片段和 `RuntimeGraph`。

### 3.6 每个模块的 JSON demo 应该如何写?

每个模块使用严格 JSON,并只展示该模块本地配置:

```json
{
  "api": {
    "enabled": true
  }
}
```

模块 demo 下方必须有配置项说明表,解释每个字段的类型、示例值、作用、校验和失败策略。完整配置 demo 使用 `jsonc` 作为文档注释示例,实际运行配置必须去掉注释并保持严格 JSON。

### 3.7 模块拆分是否按功能边界展开?

是。本步不使用 `common`、`misc`、`runtime`、`storage` 这类泛化模块,而按 L0-bus 的功能边界展开:

```text
entry:
  api / worker / jobs

adapter:
  store / outbox_source / transport_backend / publisher / projection

policy:
  recovery_policy / security_boundary

deterministic runtime:
  clock / id_generator
```

`store` 只承载 bus store,不把 projection、outbox source 或 publisher 放进去;`transport_backend` 只承载 backend adapter,不承载 outbound publisher。

### 3.8 项目本地配置是否避免重复项目名前缀?

是。项目本地配置文件不写:

```json
{
  "bus": {
    "api": {}
  }
}
```

而写:

```json
{
  "api": {}
}
```

如果未来存在系统级聚合配置,可以在聚合层使用 `bus.api.enabled` 这类路径,但进入 L0-bus 本地 `ConfigLoader` 前应裁剪为本项目配置结构。本步只定义项目本地配置。

### 3.9 完整配置 demo 是否需要文档注释?

需要。模块级 demo 使用严格 JSON,完整 demo 使用 `jsonc` 以便在示例中解释字段作用。必须在代码块前后明确:

- `jsonc` 只用于文档说明。
- 实际运行配置必须去掉注释。
- 运行时默认解析目标仍是严格 JSON。

---

## 4. 当前文档问题诊断

当前正式 `04-配置设计.md` 尚未创建,因此本步主要诊断“如果直接从 `03` §13 进入实施会缺什么”:

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 只有 config 组,缺少配置项清单 | `03` 定义了 `RuntimeConfig` 绑定点,但没有完整列出 JSON key、默认值、来源、失败策略 | 实施者不知道配置文件应如何写 | 用 §7.1 补全配置项总表 |
| 模块级示例缺失 | 目前没有每个功能模块的 JSON demo | 实施者可能把不同功能揉进 `storage` 或 `runtime` | 用 §7.3 按功能边界给 demo |
| 本地配置和系统聚合配置边界不清 | 容易出现 `bus.api.enabled` 与 `api.enabled` 混用 | 后续 ConfigLoader 输入结构不稳定 | 明确本地文件不重复项目名前缀 |
| 敏感配置形态未逐项约束 | `SecretRef` 口径存在,但没有落到具体配置项 | raw secret 可能被误写进配置 | 用 `sensitive-ref` 和 `forbidden` 标注 |
| 部分子 config 只在详细设计中作为组存在 | `ApiConfig`、`WorkerConfig`、`ProjectionConfig` 等未展开字段 | 实施时可能自由发挥字段名 | 本步定义外部 JSON 口径,并判定不改变 root config 组 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 配置项表达 | 只有 `RuntimeConfig` / 子 config 绑定点 | 有配置项名称、类型、默认值、来源、作用域、敏感级别、失败策略和关联模块 | 可直接指导配置 loader、validator 和测试 |
| 模块拆分 | 只知道 `infra`、`api`、`worker`、`jobs` 会用配置 | 按 `api`、`worker`、`jobs`、`store`、`outbox_source`、`transport_backend` 等功能模块拆分 | 避免泛化模块和字段混装 |
| 示例配置 | 未定义 | 每个模块有严格 JSON demo,完整示例用 JSONC 注释说明 | 便于实施和后续文档复用 |
| 安全边界 | 以禁止项散落描述 | 每个相关配置项标明 `sensitive-ref` 或 `forbidden` 规则 | 降低误用 raw secret 和不安全开关的风险 |
| 详细设计关系 | 可能误以为配置设计要重写 Rust struct | 明确配置 JSON 是外部契约,不等于 Rust 字段全集;root config 组沿用 `03` | 保持 `03` 与 `04` 边界清晰 |

---

## 6. 配置设计取舍

### 6.1 顶层是否包项目名前缀

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 本地配置直接使用功能模块 key | 简洁,符合项目内 ConfigLoader 输入;避免 `bus.bus` 类重复 | 系统聚合层需要额外映射 | 采用 |
| B. 本地配置也包 `bus` | 聚合路径看起来统一 | 项目本地配置冗余,与 SOP 约束冲突 | 不采用 |
| C. 同时支持两种 | 兼容性强 | loader 复杂,容易出现冲突 | 不采用 |

结论: L0-bus 本地配置文件使用 `api`、`worker`、`store` 等顶层 key。系统聚合层如需 `bus.api.enabled`,应在进入 L0-bus 前完成裁剪或映射。

### 6.2 JSON 字段是否等于 Rust 字段全集

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. JSON 字段完全等于 Rust struct 字段 | 直观 | 04 会变相重写详细设计和代码契约 | 不采用 |
| B. JSON 是外部配置契约,经 loader / validator 映射到 `RuntimeConfig` | 保持配置文档职责清晰,允许内部类型演进 | 实施时需要写映射测试 | 采用 |
| C. 只列 config 组,不列字段 | 不影响 `03` | 无法指导实现 | 不采用 |

结论: 本步定义外部 JSON 配置契约和校验语义,不把每个 JSON key 都声明为新的 Rust 字段。只要 root config 组、加载函数和 adapter seam 不变,不触发 `03` 回写。

### 6.3 是否配置化安全红线

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 给安全红线提供 boolean 开关 | 表达简单 | 容易把禁止项误当作可关闭功能 | 不采用 |
| B. 用固定 policy 字符串表达不可变边界 | 可审计,能让 validator 明确拒绝非法值 | 示例稍长 | 采用 |
| C. 完全不出现在配置中 | 最安全 | 实施者不易看到 validator 应校验什么 | 部分采用 |

结论: `security_boundary` 中只允许出现固定安全 policy,例如 `secret_policy = "ref_only"`、`payload_body_policy = "reject"`。不出现 `allow_raw_secret` 这类容易误导的开关。

---

## 7. 结构化中间产物

### 7.1 配置项总表

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `store.kind` | enum:`in_memory` / `external` | `in_memory` | 运行时必填,文件可缺省 | code defaults / JSON / env | store adapter | 冷更新,启动构造 | internal | 非法值 fail-fast | `infra::runtime_builder`, repository adapters |
| `store.connection_ref` | string ref / null | `null` | `kind=external` 时必填 | JSON / env / connection ref provider | store adapter | 冷更新,adapter 构造 | sensitive-ref | external 缺失 fail-fast;raw connection string fail-fast | `infra::runtime_builder`, repository adapters |
| `outbox_source.kind` | enum:`in_memory_fixture` / `core_outbox` | `in_memory_fixture` | 运行时必填,文件可缺省 | code defaults / JSON / env | outbox source adapter | 冷更新,启动构造 | internal | 非法值 fail-fast;P1 kind 未实现 fail-fast | `infra::outbox_source`, `worker` |
| `outbox_source.cursor_profile` | string ref | `local-memory-cursor` | 运行时必填,文件可缺省 | code defaults / JSON / env | outbox source adapter | 冷更新,worker/job 构造 | internal | 空值或非法 ref fail-fast | `infra::outbox_source`, `worker`, `jobs` |
| `outbox_source.batch_size` | integer | `100` | 运行时必填,文件可缺省 | code defaults / JSON / env | outbox source adapter | 冷更新,worker/job 构造 | internal | 小于 1 或超过上限 fail-fast | `infra::outbox_source`, `worker`, `jobs` |
| `transport_backend.kind` | enum:`in_memory` / `external` | `in_memory` | 运行时必填,文件可缺省 | code defaults / JSON / env | transport backend adapter | 冷更新,adapter 构造 | internal | 非法值 fail-fast | `infra::transport`, application ports |
| `transport_backend.capability_profile_ref` | string ref | `in-memory-backend` | 运行时必填,文件可缺省 | code defaults / JSON / env | transport backend adapter | 冷更新,adapter 构造 | internal | ref 缺失或不匹配 fail-fast | `infra::transport`, `jobs` |
| `transport_backend.secret_ref` | string ref / null | `null` | external backend 必填 | JSON / env / secret ref provider | transport backend adapter | 冷更新,adapter 构造 | sensitive-ref | raw secret 或缺失 fail-fast | `infra::transport` |
| `transport_backend.timeout_profile` | string ref | `local-fast` | 运行时必填,文件可缺省 | code defaults / JSON / env | transport backend adapter | 冷更新,adapter 构造 | internal | ref 缺失 fail-fast | `infra::transport` |
| `publisher.kind` | enum:`in_memory_sink` / `external` | `in_memory_sink` | 运行时必填,文件可缺省 | code defaults / JSON / env | outbound publisher adapter | 冷更新,adapter 构造 | internal | 非法值 fail-fast | `infra::publisher`, outbox service |
| `publisher.secret_ref` | string ref / null | `null` | external publisher 必填 | JSON / env / secret ref provider | outbound publisher adapter | 冷更新,adapter 构造 | sensitive-ref | raw secret 或缺失 fail-fast | `infra::publisher` |
| `publisher.timeout_profile` | string ref | `local-fast` | 运行时必填,文件可缺省 | code defaults / JSON / env | outbound publisher adapter | 冷更新,adapter 构造 | internal | ref 缺失 fail-fast | `infra::publisher` |
| `api.enabled` | boolean | `true` | 运行时必填,文件可缺省 | code defaults / JSON / env | API entry | 冷更新,入口启动 | public | 非 boolean fail-fast | `api` |
| `api.bind_profile` | string ref | `local-http` | API enabled 时必填 | code defaults / JSON / env | API entry | 冷更新,入口启动 | internal | ref 缺失 fail-fast | `api` |
| `api.request_timeout_ms` | integer | `3000` | API enabled 时必填 | code defaults / JSON / env | API entry | 冷更新,入口启动 | internal | 小于等于 0 或超过上限 fail-fast | `api` |
| `worker.enabled` | boolean | `false` | 运行时必填,文件可缺省 | code defaults / JSON / env | worker entry | 冷更新,入口启动 | public | 非 boolean fail-fast | `worker` |
| `worker.poll_interval_ms` | integer | `1000` | worker enabled 时必填 | code defaults / JSON / env | worker loop | 冷更新,入口启动 | internal | 小于最小值 fail-fast | `worker` |
| `worker.batch_size` | integer | `100` | worker enabled 时必填 | code defaults / JSON / env | worker loop | 冷更新,入口启动 | internal | 小于 1 或超过上限 fail-fast | `worker`, `infra::outbox_source` |
| `worker.timeout_profile` | string ref | `local-fast` | worker enabled 时必填 | code defaults / JSON / env | worker loop | 冷更新,入口启动 | internal | ref 缺失 fail-fast | `worker` |
| `jobs.batch_size` | integer | `100` | job 启动时必填 | code defaults / JSON / env / job local args | operations job | job 启动时读取 | internal | 小于 1 或超过上限 fail-fast | `jobs` |
| `jobs.cursor_profile` | string ref | `local-memory-cursor` | job 启动时必填 | code defaults / JSON / env / job local args | operations job | job 启动时读取 | internal | ref 缺失 fail-fast | `jobs` |
| `jobs.retry_profile` | string ref | `conservative-local` | job 启动时必填 | code defaults / JSON / env / job local args | operations job | job 启动时读取 | internal | ref 缺失 fail-fast | `jobs`, recovery policy |
| `projection.kind` | enum:`in_memory` / `external_read_store` | `in_memory` | 运行时必填,文件可缺省 | code defaults / JSON / env | read projection adapter | 冷更新,adapter 构造 | internal | 非法值 fail-fast | `infra::projection`, `jobs`, query handlers |
| `projection.rebuild_mode` | enum:`manual_job_only` / `disabled` | `manual_job_only` | 运行时必填,文件可缺省 | code defaults / JSON / env | projection job | 冷更新,job 启动 | internal | 自动 rebuild 值 fail-fast | `jobs`, projection service |
| `projection.consistency_marker` | enum:`required` | `required` | 运行时必填,文件可缺省 | code defaults / JSON / env | query / projection | 冷更新,query 构造 | internal | 缺失或非法值 fail-fast | query handlers, projection repository |
| `recovery_policy.retry_profile` | string ref | `conservative-local` | 运行时必填,文件可缺省 | code defaults / JSON / env | recovery policy | 冷更新,policy 构造 | internal | ref 缺失 fail-fast | application services, `jobs` |
| `recovery_policy.dead_letter_policy` | enum:`explicit_only` | `explicit_only` | 运行时必填,文件可缺省 | code defaults / JSON / env | recovery policy | 冷更新,policy 构造 | internal | 试图隐式跳过 DLQ fail-closed | application services, `jobs` |
| `recovery_policy.replay_requires_audit_chain` | enum:`required` | `required` | 运行时必填,文件可缺省 | code defaults / JSON / env | replay policy | 冷更新,policy 构造 | internal | 非 `required` fail-closed | `jobs`, audit guard |
| `security_boundary.secret_policy` | enum:`ref_only` | `ref_only` | 运行时必填,文件可缺省 | code defaults / JSON / env | security boundary | 冷更新,validator | internal | 非 `ref_only` fail-closed | `infra::config`, all secret consumers |
| `security_boundary.payload_body_policy` | enum:`reject` | `reject` | 运行时必填,文件可缺省 | code defaults / JSON / env | security boundary | 冷更新,validator | internal | 非 `reject` fail-closed | payload guard, application services |
| `security_boundary.projection_truth_write_policy` | enum:`reject` | `reject` | 运行时必填,文件可缺省 | code defaults / JSON / env | security boundary | 冷更新,validator | internal | 非 `reject` fail-closed | projection repository, query side |
| `security_boundary.redaction_policy` | enum:`required` | `required` | 运行时必填,文件可缺省 | code defaults / JSON / env | security boundary | 冷更新,validator | internal | 非 `required` fail-closed | observability, audit, logs |
| `security_boundary.privileged_operation_ref_policy` | enum:`required` | `required` | 运行时必填,文件可缺省 | code defaults / JSON / env | security boundary | 冷更新,validator | internal | 非 `required` fail-closed | recovery jobs, admin operations |
| `clock.kind` | enum:`system` / `fixed` | `system` | 运行时必填,文件可缺省 | code defaults / JSON / env / test fixture | clock adapter | 冷更新,adapter 构造 | internal | 非法值 fail-fast;prod-like fixed fail-fast | `infra::runtime_builder`, tests |
| `id_generator.kind` | enum:`uuid_v7` / `deterministic` | `uuid_v7` | 运行时必填,文件可缺省 | code defaults / JSON / env / test fixture | id generator adapter | 冷更新,adapter 构造 | internal | 非法值 fail-fast;prod-like deterministic fail-fast | `infra::runtime_builder`, tests |

### 7.2 模块拆分总览

| 模块 | 配置组 | 归属类型 | 说明 |
|---|---|---|---|
| `api` | `ApiConfig` | entry | 控制 API 入口是否启动、绑定 profile 和请求超时 |
| `worker` | `WorkerConfig` | entry | 控制 worker loop 是否启动、轮询间隔、批量大小和 timeout profile |
| `jobs` | `JobConfig` | entry / operations | 控制 operations job 的 batch、cursor 和 retry |
| `store` | `StoreConfig` | adapter | 控制 bus store / UnitOfWork adapter 类型和连接引用 |
| `outbox_source` | `OutboxSourceConfig` | adapter | 控制 L0-core outbox fact source、cursor 和 batch 读取 |
| `transport_backend` | `BackendConfig` | adapter | 控制 transport backend 类型、能力 profile、secret ref 和 timeout |
| `publisher` | `PublisherConfig` | adapter | 控制 outbound publisher 类型、secret ref 和 timeout |
| `projection` | `ProjectionConfig` | adapter / read side | 控制 projection store、rebuild 模式和 consistency marker |
| `recovery_policy` | `RecoveryPolicyConfig` | policy | 控制 retry、DLQ、replay eligibility 的策略引用 |
| `security_boundary` | `SecurityBoundaryConfig` | policy / guard | 控制不可变安全边界的固定 policy |
| `clock` | `ClockConfig` | deterministic runtime | 控制时间来源,支持测试 fixture |
| `id_generator` | `IdGeneratorConfig` | deterministic runtime | 控制 ID 生成来源,支持测试 fixture |

### 7.3 分模块 JSON demo 与配置项说明

#### api 配置 demo

```json
{
  "api": {
    "enabled": true,
    "bind_profile": "local-http",
    "request_timeout_ms": 3000
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `api.enabled` | boolean | `true` | 控制 API entry 是否启动 | 必须是 boolean | 非 boolean fail-fast |
| `api.bind_profile` | string ref | `"local-http"` | 指向 API 绑定 profile,具体 host / port 由实现环境或后续部署说明承接 | API enabled 时不能为空 | 缺失或非法 ref fail-fast |
| `api.request_timeout_ms` | integer | `3000` | 控制入口请求超时 | 必须大于 0 且不超过实现定义上限 | 越界 fail-fast |

#### worker 配置 demo

```json
{
  "worker": {
    "enabled": false,
    "poll_interval_ms": 1000,
    "batch_size": 100,
    "timeout_profile": "local-fast"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `worker.enabled` | boolean | `false` | 控制 worker loop 是否启动 | 必须是 boolean;P0 默认关闭,由显式运行 profile 打开 | 非 boolean fail-fast |
| `worker.poll_interval_ms` | integer | `1000` | 控制 worker 轮询间隔 | 必须大于等于实现定义的最小值 | 越界 fail-fast |
| `worker.batch_size` | integer | `100` | 控制单次从 source 拉取的最大数量 | 必须在 `1..=max_worker_batch_size` 范围内 | 越界 fail-fast |
| `worker.timeout_profile` | string ref | `"local-fast"` | worker 调用 source / backend / publisher 的 timeout profile 引用 | worker enabled 时不能为空 | 缺失或非法 ref fail-fast |

#### jobs 配置 demo

```json
{
  "jobs": {
    "batch_size": 100,
    "cursor_profile": "local-memory-cursor",
    "retry_profile": "conservative-local"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobs.batch_size` | integer | `100` | 控制 operations job 单批处理数量 | 必须在 `1..=max_job_batch_size` 范围内 | 越界 fail-fast |
| `jobs.cursor_profile` | string ref | `"local-memory-cursor"` | 控制 job cursor 的存储或 fixture profile | job 启动时不能为空 | 缺失或非法 ref fail-fast |
| `jobs.retry_profile` | string ref | `"conservative-local"` | 控制 job item retry 策略引用 | job 启动时不能为空 | 缺失或非法 ref fail-fast |

#### store 配置 demo

```json
{
  "store": {
    "kind": "in_memory",
    "connection_ref": null
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `store.kind` | enum | `"in_memory"` | 选择 bus store / UnitOfWork adapter | P0 支持 `in_memory`;`external` 属于后续实现能力 | 非法值或未实现 kind fail-fast |
| `store.connection_ref` | string ref / null | `null` | 外部 store 的连接引用 | `kind=in_memory` 必须为空;`kind=external` 时必填且只能是 ref | raw connection string 或缺失 fail-fast |

#### outbox_source 配置 demo

```json
{
  "outbox_source": {
    "kind": "in_memory_fixture",
    "cursor_profile": "local-memory-cursor",
    "batch_size": 100
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `outbox_source.kind` | enum | `"in_memory_fixture"` | 选择 committed outbox fact source adapter | P0 支持 fixture / in-memory source;真实 L0-core outbox source 由 adapter 演进承接 | 非法值 fail-fast |
| `outbox_source.cursor_profile` | string ref | `"local-memory-cursor"` | 控制 source cursor 的 profile | 不得为空 | 缺失或非法 ref fail-fast |
| `outbox_source.batch_size` | integer | `100` | 控制单次读取 committed outbox fact 的数量 | 必须在 `1..=max_source_batch_size` 范围内 | 越界 fail-fast |

#### transport_backend 配置 demo

```json
{
  "transport_backend": {
    "kind": "in_memory",
    "capability_profile_ref": "in-memory-backend",
    "secret_ref": null,
    "timeout_profile": "local-fast"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `transport_backend.kind` | enum | `"in_memory"` | 选择 transport backend adapter | P0 支持 `in_memory`;外部 MQ / broker 属于 P1/P2 adapter | 非法值或未实现 kind fail-fast |
| `transport_backend.capability_profile_ref` | string ref | `"in-memory-backend"` | 指向 backend 能力 profile,用于确认是否支持 delivery / signal 等能力 | 不得为空,且必须与 kind 兼容 | 缺失或不兼容 fail-fast |
| `transport_backend.secret_ref` | string ref / null | `null` | 外部 backend 的 secret 引用 | `in_memory` 必须为空;external backend 必须使用 ref | raw secret 或缺失 fail-fast |
| `transport_backend.timeout_profile` | string ref | `"local-fast"` | backend 调用 timeout profile 引用 | 不得为空 | 缺失或非法 ref fail-fast |

#### publisher 配置 demo

```json
{
  "publisher": {
    "kind": "in_memory_sink",
    "secret_ref": null,
    "timeout_profile": "local-fast"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `publisher.kind` | enum | `"in_memory_sink"` | 选择 outbound publisher adapter | P0 支持 `in_memory_sink`;外部 event bus 属于后续 adapter | 非法值或未实现 kind fail-fast |
| `publisher.secret_ref` | string ref / null | `null` | 外部 publisher 的 secret 引用 | `in_memory_sink` 必须为空;external publisher 必须使用 ref | raw secret 或缺失 fail-fast |
| `publisher.timeout_profile` | string ref | `"local-fast"` | publisher 调用 timeout profile 引用 | 不得为空 | 缺失或非法 ref fail-fast |

#### projection 配置 demo

```json
{
  "projection": {
    "kind": "in_memory",
    "rebuild_mode": "manual_job_only",
    "consistency_marker": "required"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projection.kind` | enum | `"in_memory"` | 选择 read projection adapter | P0 支持 `in_memory`;外部 read store 属于后续 adapter | 非法值或未实现 kind fail-fast |
| `projection.rebuild_mode` | enum | `"manual_job_only"` | 限定 projection rebuild 只能由显式 operations job 触发 | P0 不允许 query 自动 rebuild | 非 `manual_job_only` / `disabled` fail-fast |
| `projection.consistency_marker` | enum | `"required"` | 要求 query / projection 输出携带一致性标记 | 必须为 `required` | 缺失或非法值 fail-fast |

#### recovery_policy 配置 demo

```json
{
  "recovery_policy": {
    "retry_profile": "conservative-local",
    "dead_letter_policy": "explicit_only",
    "replay_requires_audit_chain": "required"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `recovery_policy.retry_profile` | string ref | `"conservative-local"` | 指向 retry 策略 profile | 不得为空 | 缺失或非法 ref fail-fast |
| `recovery_policy.dead_letter_policy` | enum | `"explicit_only"` | 限定 DLQ 处理只能由显式流程触发 | 不允许隐式跳过或静默丢弃 | 非 `explicit_only` fail-closed |
| `recovery_policy.replay_requires_audit_chain` | enum | `"required"` | 要求 replay 必须拥有审计链 | 必须为 `required` | 非 `required` fail-closed |

#### security_boundary 配置 demo

```json
{
  "security_boundary": {
    "secret_policy": "ref_only",
    "payload_body_policy": "reject",
    "projection_truth_write_policy": "reject",
    "redaction_policy": "required",
    "privileged_operation_ref_policy": "required"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `security_boundary.secret_policy` | enum | `"ref_only"` | 强制 secret 只能以引用形式出现 | 必须为 `ref_only`;不得出现 raw secret | 非 `ref_only` fail-closed |
| `security_boundary.payload_body_policy` | enum | `"reject"` | 强制 L0-bus 不保存 payload body | 必须为 `reject` | 非 `reject` fail-closed |
| `security_boundary.projection_truth_write_policy` | enum | `"reject"` | 禁止 projection 写入事实真相 | 必须为 `reject` | 非 `reject` fail-closed |
| `security_boundary.redaction_policy` | enum | `"required"` | 强制日志、审计、报告输出执行 redaction | 必须为 `required` | 非 `required` fail-closed |
| `security_boundary.privileged_operation_ref_policy` | enum | `"required"` | 要求 recovery / replay 等 privileged operation 具备受控引用 | 必须为 `required` | 非 `required` fail-closed |

#### clock 配置 demo

```json
{
  "clock": {
    "kind": "system"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `clock.kind` | enum | `"system"` | 选择 clock adapter | `system` 用于默认运行;`fixed` 仅用于测试 fixture 或受控 recovery 场景 | 非法值 fail-fast;prod-like 使用 `fixed` fail-fast |

#### id_generator 配置 demo

```json
{
  "id_generator": {
    "kind": "uuid_v7"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `id_generator.kind` | enum | `"uuid_v7"` | 选择 ID generator adapter | `uuid_v7` 用于默认运行;`deterministic` 仅用于测试 fixture | 非法值 fail-fast;prod-like 使用 `deterministic` fail-fast |

### 7.4 完整配置 demo

以下示例是文档注释示例,使用 `jsonc` 只是为了在 demo 内解释配置作用。实际运行配置必须去掉注释并保持严格 JSON。

```jsonc
{
  // API 入口配置;本地配置不额外包 bus / l0_bus 前缀。
  "api": {
    // 是否启动 API entry。
    "enabled": true,
    // API 绑定 profile;具体 host / port 由实现或部署层解析。
    "bind_profile": "local-http",
    // 单个请求的入口超时。
    "request_timeout_ms": 3000
  },

  // Worker loop 配置;P0 默认可关闭,需要显式运行时再启用。
  "worker": {
    "enabled": false,
    "poll_interval_ms": 1000,
    "batch_size": 100,
    "timeout_profile": "local-fast"
  },

  // Operations job 配置;job local args 只允许覆盖本 job 的局部输入。
  "jobs": {
    "batch_size": 100,
    "cursor_profile": "local-memory-cursor",
    "retry_profile": "conservative-local"
  },

  // Bus store / UnitOfWork adapter 配置。
  "store": {
    "kind": "in_memory",
    "connection_ref": null
  },

  // L0-core committed outbox source adapter 配置。
  "outbox_source": {
    "kind": "in_memory_fixture",
    "cursor_profile": "local-memory-cursor",
    "batch_size": 100
  },

  // Transport backend adapter 配置;raw secret 禁止出现在配置文件中。
  "transport_backend": {
    "kind": "in_memory",
    "capability_profile_ref": "in-memory-backend",
    "secret_ref": null,
    "timeout_profile": "local-fast"
  },

  // Outbound publisher adapter 配置。
  "publisher": {
    "kind": "in_memory_sink",
    "secret_ref": null,
    "timeout_profile": "local-fast"
  },

  // Read projection 配置;query 自动 rebuild 不属于 P0。
  "projection": {
    "kind": "in_memory",
    "rebuild_mode": "manual_job_only",
    "consistency_marker": "required"
  },

  // Recovery policy 配置;replay 和 DLQ 必须保留显式审计链。
  "recovery_policy": {
    "retry_profile": "conservative-local",
    "dead_letter_policy": "explicit_only",
    "replay_requires_audit_chain": "required"
  },

  // 安全边界配置;这里表达固定 policy,不是可放宽的开关。
  "security_boundary": {
    "secret_policy": "ref_only",
    "payload_body_policy": "reject",
    "projection_truth_write_policy": "reject",
    "redaction_policy": "required",
    "privileged_operation_ref_policy": "required"
  },

  // Clock adapter 配置。
  "clock": {
    "kind": "system"
  },

  // ID generator adapter 配置。
  "id_generator": {
    "kind": "uuid_v7"
  }
}
```

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 顶层配置模块沿用 `RuntimeConfig` 已有子配置组,没有新增 root config group | 否 | 无 root struct 变化 | 无 | 无回写 |
| 本地 JSON 配置不包 `bus` / `l0_bus` 项目前缀 | 否 | 配置文件外部形态细化 | 无 | 无回写 |
| `transport_backend` 作为外部 JSON key 对应详细设计中的 `BackendConfig` | 否 | 命名映射说明,非代码结构变更 | 无 | 无回写 |
| `api`、`worker`、`jobs`、`projection`、`recovery_policy`、`security_boundary`、`clock`、`id_generator` 给出字段级 JSON 契约 | 否 | 配置设计细化,不直接等同 Rust 字段全集 | 无 | 无回写 |
| `ConfigLoader::load(ConfigSource)`, `ConfigValidator::validate(RuntimeConfig)`, `RuntimeBuilder::build(ValidatedRuntimeConfig)` 函数签名不变 | 否 | 无函数签名变化 | 无 | 无回写 |
| 禁止 raw secret、payload body fallback、projection truth write、replay bypass 的校验继续沿用 `03` 禁止配置化边界 | 否 | 无安全边界变化 | 无 | 无回写 |
| 若后续实现要求把每个 JSON key 固定为 Rust struct public field | 是 | 子 config struct 字段展开 | `03-详细设计.md` §13 或对应 Step 14 | 当前不采用 |

本步判定:

```text
Step 7 不要求回写 03-详细设计.md。

理由:
- 本步没有新增 RuntimeConfig root 子配置组。
- 本步没有改变配置加载、校验、装配函数签名。
- 本步没有改变 adapter / port / trait 边界。
- 本步定义的是外部 JSON 配置契约和校验语义。
- Rust 子 config 的最终字段组织可在实现中通过 parse / validate / mapping 完成,不要求 JSON key 与 Rust public field 一一绑定。
```

---

## 9. 回填草稿

正式 `04-配置设计.md` §7 应从本文件摘录,不在回填草稿中重复完整长表。

建议回填结构:

```text
## 7. 配置项清单

> 校准来源:
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读:
> - 建议继续阅读 Step 7 §7.1~§7.4,获取配置项总表、模块拆分、模块级 JSON demo 和完整 JSONC 文档示例。

### 7.1 配置项总表

摘录 `04_config_step_07_config_items.md` §7.1。

### 7.2 模块拆分总览

摘录 `04_config_step_07_config_items.md` §7.2。

### 7.3 分模块 JSON demo 与配置项说明

摘录 `04_config_step_07_config_items.md` §7.3。

### 7.4 完整配置 demo

摘录 `04_config_step_07_config_items.md` §7.4。
```

回填时必须保留以下说明:

- 模块级 demo 是严格 JSON。
- 完整 demo 是 `jsonc` 文档注释示例,实际运行配置必须去掉注释。
- 项目本地配置不包 `bus` / `l0_bus` 前缀。
- `transport_backend` 是外部 JSON key,映射到详细设计中的 `BackendConfig`。
- `security_boundary` 表达固定 policy,不是可放宽安全红线的开关。

---

## 10. 待确认事项

| 待确认项 | 可选方案 | 推荐方案 | 原因 | 当前处理 |
|---|---|---|---|---|
| 外部 JSON key 是否使用 `transport_backend` 而不是 `backend` | A. 使用 `transport_backend`;B. 使用 `backend`;C. 同时兼容 | 推荐 A | `backend` 容易和 application / infra 后端概念混淆,`transport_backend` 更明确;只需说明映射到 `BackendConfig` | 按 A 写入本步 |
| 是否给 `security_boundary` 写固定 policy 字段 | A. 写固定 policy;B. 完全不写;C. 写 boolean 开关 | 推荐 A | A 能让 validator 有明确校验输入;C 容易误导为可关闭安全红线 | 按 A 写入本步 |
| JSON key 是否必须一一对应 Rust public field | A. 不要求一一对应;B. 必须一一对应;C. 后续实现再决定 | 推荐 A | 配置设计定义外部契约,详细设计定义代码契约;强制一一对应会把 04 变成详细设计补丁 | 按 A 写入本步 |
| P0 是否允许外部 store / MQ / publisher kind | A. 只列 P1/P2 候选并 fail-fast;B. P0 必须实现;C. 不提外部 kind | 推荐 A | A 能保留演进方向,又不阻塞 P0 可验证路径 | 按 A 写入本步 |

本步没有阻塞项。上述待确认项均已选择推荐方案作为当前配置设计口径,后续如推翻必须回到 Step 7 重新校准。

---

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 配置项清单无缺口 | 已满足 | §7.1 覆盖 entry、adapter、policy、deterministic runtime |
| 每个模块有严格 JSON demo | 已满足 | §7.3 覆盖 12 个功能模块 |
| 每个 demo 下有配置项说明表 | 已满足 | 每个模块均列出类型、示例值、作用、校验和失败策略 |
| 完整配置 demo 使用 JSONC 且说明实际配置必须为严格 JSON | 已满足 | §7.4 已说明 |
| 项目本地配置避免重复项目名前缀 | 已满足 | §3.8、§6.1、§7.4 已说明 |
| 已判定对 `03-详细设计.md` 的影响 | 已满足 | §8 判定无回写 |

结论: Step 7 可以标记为已确认,并进入 Step 8“定义敏感配置与密钥管理”。
