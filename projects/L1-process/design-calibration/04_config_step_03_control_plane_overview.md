# Step 3. 建立配置控制面总览

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 3 中间产物。
> 本步建立配置来源链、装配入口、使用模块和控制面总表。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 3
- 回填章节: `projects/L1-process/04-配置设计.md` §3 配置控制面总览

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 2 范围 | 确定 P0 配置边界 | `ProcessRuntimeConfig` 既有 section 全部进入控制面 |
| `03_ddd_step_14_config_external_binding.md` | 确定读取模块和装配入口 | `infra/config.rs` 读取;`runtime_builder.rs` 装配;application / domain / contracts 不读取 |
| `01-架构设计.md` | 确定相邻仓依赖方式 | 除 `core-contracts` 外,相邻仓只通过 adapter / event / handoff / fake |
| `03_ddd_step_08_protocol_contracts.md` | 确定 event topic / job 名称 | outbox topic map 必须匹配 Step 8 `.v1` topics |

## 3. SOP 问题回答

### 3.1 当前系统配置从哪些来源读取?

P0 普通配置来源包括:

- code defaults。
- JSON config file。
- environment overrides。
- entry local args,仅用于 config source selector 或 job run 局部参数。
- secret / credential refs,只保存引用,不保存 raw secret。

P0 不启用 remote config center 或 admin override。若配置要求使用这些来源,应 fail-fast 为 unsupported profile。

### 3.2 配置进入系统的唯一或主要装配入口是什么?

主要装配入口是:

```text
infra/config.rs
  -> parse / validate ProcessRuntimeConfig
  -> infra/runtime_builder.rs
  -> assemble repository / resolver / publisher / handoff / clock / id generator
  -> api / worker / jobs receive assembled runtime handle
```

`application` 只接收已装配的 port / repository / service dependency,不直接读取配置来源。`domain` 和 `contracts` 不读取配置。

### 3.3 哪些模块读取配置,哪些模块不得直接读取配置?

| 模块 | 读取方式 | 不得做的事 |
|---|---|---|
| `infra::config` | 读取 JSON、env、secret / credential ref 和 entry args | 不读取相邻仓正文 |
| `infra::runtime_builder` | 接收已校验 config 并装配 repository / adapter / port | 不改变领域对象字段和状态机 |
| `api` | 只读取入口参数和 runtime handle | 不直接构造 store / resolver / publisher |
| `worker` | 只读取 worker profile 和 runtime handle | 不绕过 consumer dedup / outbox publisher |
| `jobs` | 只读取 job profile、run args 和 runtime handle | 不通过配置开启 truth 自动修复 |
| `application` / `domain` / `contracts` | 不直接读取配置 | 不感知配置来源 |

### 3.4 配置控制哪些行为,不控制哪些领域不变量?

配置控制:

- runtime bootstrap 和 adapter 装配。
- store / projection / idempotency / outbox / handoff / external resolver 的 adapter kind 和运行参数。
- batch、timeout、retry、retention、topic map、page limit、feature enablement。
- fake / in-memory / deterministic 默认路径。
- profile、source priority、config validation 和 failure strategy。

配置不控制:

- Process truth 归属。
- 外部正文排除。
- state matrix 允许 / 禁止转换。
- command / query / event / job DTO schema。
- idempotency duplicate / conflict 语义。
- audit / trace / outbox 必写规则。
- projection 不反写真相。
- 非 core sibling repo 的 Cargo dependency 禁止规则。

### 3.5 配置变化会影响哪些下游文档?

| 下游文档 | 影响 |
|---|---|
| `05-测试方案.md` | 需要覆盖 config loader、validation、profile matrix、fake / in-memory / configured adapter、secret redaction |
| `06-验收标准.md` | 需要设置配置 fail-fast、forbidden boundary、secret redaction、dependency discipline 门禁 |
| `07-实施计划.md` | 需要安排 config loader、validator、runtime builder、adapter binding 和 config tests 的 phase / commit |
| 部署与运维手册 | 需要承接真实环境文件、secret provider、endpoint、DB / MQ / KMS、告警和 runbook |

## 4. 结构化中间产物

#### 配置来源链图: L1-process 配置覆盖链

```text
[code defaults]
  -> [JSON config file]
  -> [environment overrides]
  -> [secret / credential refs]
  -> [entry local args]
  -> [validated ProcessRuntimeConfig]
  -> [ProcessRuntimeBuilder]
```

关键说明:

- `secret / credential refs` 只表达引用,不表达 raw secret 值。
- entry local args 只选择 config source 或提供入口 / job 局部参数,不是全局最高优先级。
- 领域不变量和架构红线不受配置来源覆盖。

### 4.1 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 |
|---|---|---|---|
| runtime bootstrap | 加载、校验并构造 Process runtime | `infra::config`、`infra::runtime_builder`、`api`、`worker`、`jobs` | 是 |
| store profile | 装配 truth、projection、outbox、idempotency store 和 UoW | `infra::repositories`、`infra::projection_stores`、`infra::idempotency_store` | 是 |
| boundary profile | 控制 command body、query timeout、page limit 和入口保护 | `api`、`infra::runtime_builder` | 是 |
| idempotency policy | 控制 command retention、event dedup retention、job retention 和 reserved record max age | `infra::idempotency_store`、`application` idempotency flow | 是 |
| projection policy | 控制 projection store、stale threshold 和 rebuild batch | `infra::projection_stores`、`jobs::projection_rebuild` | 是 |
| jobs policy | 控制 batch、parallelism、retry backoff、timeout 和 job run policy | `jobs::*`、`worker::*` | 是 |
| external resolver | 控制 method-library、work、identity、governance、artifact、runtime、conversation resolver | `infra::source_resolvers`、`jobs::reference_refresh` | 是 |
| outbox publisher | 控制 event publisher、topic map、retry、timeout 和 fake marker | `infra::publishers`、`worker::outbox_publisher`、`jobs::outbox_publisher` | 是 |
| trace / archive handoff | 控制 trace handoff、archive handoff、redaction 和 retry | `infra::handoff_adapters`、`jobs::*handoff*` | 是 |
| feature switches | 控制 derived views、search 等外围能力 | `infra::runtime_builder`、`api`、`jobs` | 是 |
| clock / id generator | 控制 fixed/system clock 和 sequence/runtime id generator | `infra::clock_id`、`infra::runtime_builder` | 是 |
| security redaction | 控制 forbidden body、raw secret、raw payload 的拒绝和 evidence 检查 | `infra::config`、`infra::handoff_adapters`、`jobs::*`、scripts | 是 |
| remote config / admin override | 后续远程配置、受控覆盖和审计变更 | 后续配置中心 / ops 接缝 | 否,P2 |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 只有 infra / entry 层读取配置,application / domain / contracts 不读取 | 否 | 与 `03` §13 一致 | 无 | 无回写 |
| 配置来源链进入 `ProcessRuntimeBuilder`,不改变 `ProcessRuntimeConfig` 字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| remote config / admin override 为 P2,不进入 P0 | 否 | 范围裁剪 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §3 应写明配置从 code defaults、JSON config file、environment overrides、secret / credential refs 和 entry local args 进入,经过 `infra/config.rs` validation 后形成 `ProcessRuntimeConfig`,再由 `ProcessRuntimeBuilder` 装配 repository、projection、idempotency、resolver、publisher、handoff、clock 和 id generator adapters。`application`、`domain`、`contracts` 不直接读取配置。

## 7. 待确认事项

- 无阻塞 Step 4 的待确认事项。
- Step 5 需固定普通来源覆盖顺序和冲突处理。
- Step 7 需逐项展开控制面对应配置项。

## 8. 进入下一步条件

- 配置控制面和来源链清楚。
- 模块读取边界清楚。
- 详细设计影响判定为无回写。
