# Step 7. 定义配置项清单

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 7 中间产物。
> 本步把 P0 配置项整理成可实现、可校验、可测试的正式清单。
> 本步只把 `03-详细设计.md` 已有的 `CoreRuntimeConfig` 输入列为正式 P0 配置项;其他 adapter mode / runner mode / publisher mode 若要配置化,必须先回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-core/04-配置设计.md` §7 配置项清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 3 控制面 | storage roots、reference resolver、runtime builder、adapter 边界 | 判断哪些控制面已有正式 runtime config 字段 |
| Step 4 分类边界 | 启动配置、运行时装配配置、策略配置、敏感配置、调试配置 | 为每个配置项标注类别、敏感级别和失败风险 |
| Step 5 来源优先级 | defaults < file < env < CLI flags;secret refs 不参与普通覆盖链 | 标注配置来源和冲突规则 |
| Step 6 环境矩阵 | local-dev、ci-test、release-like、operations-replay | 标注配置作用域和测试验收承接 |
| `03-详细设计.md` §13.2 | 7 个 `CoreRuntimeConfig` 字段、类型和默认值 | 固定正式 P0 配置项的上游来源 |

已确认结论:

```text
正式 P0 配置项必须能映射到 03 已有 CoreRuntimeConfig 字段。
项目配置文件默认使用严格 JSON。
本步不新增 adapter mode、runner mode、publisher mode、runtime_profile 等配置项。
如果后续需要把这些边界做成正式配置项,必须先回写 03。
```

---

## 3. SOP 问题回答

1. 每个 P0 配置项的名称、类型、默认值是什么?

   回答：P0 正式配置项共有 7 个,分别是 `contract_source.root`、`release_snapshot.root`、`projection_index.root`、`audit.root`、`outbox.root`、`idempotency.root`、`reference_resolver.config`。它们分别映射到 03 中的 `contract_source_root`、`release_snapshot_root`、`projection_index_root`、`audit_root`、`outbox_root`、`idempotency_root`、`reference_resolver_config`。默认值沿用 03: `./contract-source`、`./release-snapshots`、`./state/projection`、`./state/audit`、`./state/outbox`、`./state/idempotency`、`ReferenceResolverConfig::default()`。

2. 哪些配置项必填?

   回答：这 7 个 P0 配置项都有默认值,因此外部配置源中不是必填;但最终装配出的 `CoreRuntimeConfig` 中必须存在有效值。也就是说,从“配置文件填写”角度看不是必填,从“runtime 装配结果”角度看是必需。若显式提供了值,值必须通过类型、路径和边界校验。

3. 每个配置项从哪里来、作用域是什么?

   回答：普通来源遵守 Step 5 的顺序: code defaults、project config file、environment variables、CLI flags。作用域覆盖 local-dev、ci-test、release-like 和 operations-replay。staging-integration 与 production-ops 继承同样语义,但具体来源和路径由部署与运维手册承接。

4. 每个配置项如何生效、是否敏感、失败策略是什么?

   回答：所有 P0 配置项都在 CLI / job 启动时读取并装配到 `CoreRuntimeConfig`,不支持热更新。7 个正式配置项本身都不是 raw secret,敏感级别为 public 或 internal;`reference_resolver.config` 可能包含外部引用策略,按 internal 处理。路径非法、目录不可访问、引用解析配置非法时 fail fast;依赖读取失败时按 03 中 fail fast / fail closed / retry / replay 口径处理。

5. 每个配置项关联哪些模块?

   回答：6 个 root 类配置关联 infra file store adapters、runtime builder 和对应 port。`reference_resolver.config` 关联 `ReferenceResolverPort` adapter、runtime builder 和引用校验 / 发布 / 快照派生流程。所有配置项都由 CLI / job entry 读取来源,由 `build_cli_runtime` / `build_job_runtime` 装配。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §7 | 尚未存在配置项清单 | 实施者无法确定正式配置 key、默认值、来源和失败策略 |
| `03-详细设计.md` §13.2 | 只有字段名,没有本地配置 key 和配置设计列 | 需要由 04 给出正式配置项清单 |
| Step 3 控制面总表 | 控制面多于 03 已有 runtime config 字段 | 如果全部列为配置项会隐式新增代码契约 |
| Step 6 profile 矩阵 | 有 fake / real-like adapter 差异 | 这些差异当前不应伪装成正式 P0 配置项 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置项名称 | 只有 03 字段名 | 增加稳定本地配置 key,并映射到 03 字段 | 让配置文件、env、测试和验收可引用 |
| 配置项范围 | 控制面和配置项混在一起 | 正式配置项仅限 7 个已有 `CoreRuntimeConfig` 输入 | 防止 04 静默新增代码契约 |
| 必填口径 | 未区分 | 外部配置源非必填,最终 runtime config 必须有有效值 | 兼容默认值和 fail fast 校验 |
| 敏感级别 | 未标注 | root path 为 internal,reference resolver config 为 internal | 为 Step 8 敏感配置继续展开 |
| adapter / runner mode | 可能被误写成 P0 配置项 | 明确暂不列入正式配置项 | 如需配置化,先回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只列 03 已有 7 个 runtime config 字段 | 不改变代码契约,可立即指导实现 | adapter mode / runner mode 暂时不作为外部配置项 | 采用 |
| 方案 B：把所有控制面都列为正式配置项 | 表面完整 | 会隐式新增 `CoreRuntimeConfig` 字段或 adapter constructor 参数 | 不采用 |
| 方案 C：不定义本地配置 key,只引用 Rust 字段名 | 改动最少 | 配置文件、env、测试和验收缺少稳定名称 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 P0 配置项清单

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `contract_source.root` | `ContractSourceRoot` | `./contract-source` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法或不可读 fail fast | `build_cli_runtime` / `build_job_runtime` / source store adapter |
| `release_snapshot.root` | `ReleaseSnapshotRoot` | `./release-snapshots` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法、不可写或快照资产不匹配 fail fast | runtime builder / snapshot store / snapshot exporter |
| `projection_index.root` | `ProjectionIndexRoot` | `./state/projection` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法 fail fast;projection 失败按 stale / rebuild | projection store / query projection / rebuild job |
| `audit.root` | `AuditRoot` | `./state/audit` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法或 audit append 不可用 fail fast;不得静默成功 | audit adapter / application services / UoW |
| `outbox.root` | `OutboxRoot` | `./state/outbox` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法 fail fast;publish 失败保留 pending / failed | outbox adapter / outbox relay / event publisher boundary |
| `idempotency.root` | `IdempotencyRoot` | `./state/idempotency` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法 fail fast;payload mismatch 返回 conflict | idempotency repository / command / job entry |
| `reference_resolver.config` | `ReferenceResolverConfig` | `ReferenceResolverConfig::default()` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 配置非法 fail fast;引用读取失败 fail closed | reference resolver adapter / release / validation / snapshot flow |

### 7.2 本地配置 key 到 `CoreRuntimeConfig` 映射

| 本地配置 key | `CoreRuntimeConfig` 字段 | 03 来源 | 是否新增代码契约 |
|---|---|---|---|
| `contract_source.root` | `contract_source_root` | `03-详细设计.md` §13.2 | 否 |
| `release_snapshot.root` | `release_snapshot_root` | `03-详细设计.md` §13.2 | 否 |
| `projection_index.root` | `projection_index_root` | `03-详细设计.md` §13.2 | 否 |
| `audit.root` | `audit_root` | `03-详细设计.md` §13.2 | 否 |
| `outbox.root` | `outbox_root` | `03-详细设计.md` §13.2 | 否 |
| `idempotency.root` | `idempotency_root` | `03-详细设计.md` §13.2 | 否 |
| `reference_resolver.config` | `reference_resolver_config` | `03-详细设计.md` §13.2 | 否 |

### 7.3 模块级示例配置

以下模块级 demo 使用严格 JSON,用于说明实际配置文件形状。

#### source store 配置 demo

```json
{
  "contract_source": {
    "root": "./contract-source"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `contract_source.root` | `ContractSourceRoot` | `./contract-source` | 契约源码输入目录,source store 从此读取 definition source、引用锚点或待发布输入 | 必须可读;不得与 `release_snapshot.root` 相同 | fail fast |

#### release snapshot store 配置 demo

```json
{
  "release_snapshot": {
    "root": "./release-snapshots"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `release_snapshot.root` | `ReleaseSnapshotRoot` | `./release-snapshots` | 发布快照输出目录,snapshot exporter 将 release baseline 派生成只读快照资产 | 必须可写或可创建;不得与 source root 混用 | fail fast |

#### projection store 配置 demo

```json
{
  "projection_index": {
    "root": "./state/projection"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projection_index.root` | `ProjectionIndexRoot` | `./state/projection` | 查询投影索引目录,projection store 只保存派生视图 | 不得与 truth / audit / outbox / idempotency root 混用 | fail fast;运行后失败按 stale / rebuild |

#### audit store 配置 demo

```json
{
  "audit": {
    "root": "./state/audit"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `audit.root` | `AuditRoot` | `./state/audit` | 审计记录目录,audit adapter 向此 append 审计记录 | 不得与 outbox / idempotency root 相同;必须可 append | fail fast;审计写入失败不得静默成功 |

#### outbox store 配置 demo

```json
{
  "outbox": {
    "root": "./state/outbox"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `outbox.root` | `OutboxRoot` | `./state/outbox` | 待发布事件目录,relay worker 从此读取 pending event 并标记 published / failed | 不得与 audit / idempotency root 相同;必须可 append / mark | fail fast;publish 失败保留 pending / failed |

#### idempotency store 配置 demo

```json
{
  "idempotency": {
    "root": "./state/idempotency"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `idempotency.root` | `IdempotencyRoot` | `./state/idempotency` | 幂等记录目录,保存 operation、idempotency key 和 payload fingerprint | 不得与 audit / outbox root 相同;必须可 reserve / complete | fail fast;payload mismatch 返回 conflict |

#### reference resolver 配置 demo

```json
{
  "reference_resolver": {
    "config": {}
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `reference_resolver.config` | `ReferenceResolverConfig` | `{}` | 装配 reference resolver;空对象表示使用 `ReferenceResolverConfig::default()` | 不得包含 raw credential;不得允许引用失败默认放行;不得吸收外部正文 | 配置非法 fail fast;引用读取失败 fail closed |

### 7.4 汇总配置示例

以下示例是带注释的 JSONC 文档示例。实际运行时配置文件必须删除注释并保持严格 JSON。

```jsonc
{
  "contract_source": {
    // 契约源码输入目录;必须可读,不得与 release_snapshot.root 相同。
    "root": "./contract-source"
  },
  "release_snapshot": {
    // 发布快照输出目录;必须可写或可创建,不得与 contract_source.root 混用。
    "root": "./release-snapshots"
  },
  "projection_index": {
    // 查询投影索引目录;只保存派生视图,不得与 truth / audit / outbox / idempotency 混用。
    "root": "./state/projection"
  },
  "audit": {
    // 审计记录目录;审计写入失败不得静默成功。
    "root": "./state/audit"
  },
  "outbox": {
    // 待发布事件 outbox 目录;publish 失败保留 pending / failed。
    "root": "./state/outbox"
  },
  "idempotency": {
    // 幂等记录目录;用于 replay、conflict 和重复提交保护。
    "root": "./state/idempotency"
  },
  "reference_resolver": {
    // ReferenceResolverConfig;空对象表示使用 ReferenceResolverConfig::default()。
    "config": {}
  }
}
```

说明:

- 该示例覆盖当前 7 个 P0 active 配置项。
- 所有路径都需要通过 parse、type validate 和 cross-field validate。
- `"config": {}` 表示使用 `ReferenceResolverConfig::default()`,不是新增配置字段。
- 注释只用于文档说明;实际 JSON 配置文件不得包含注释。
- 本示例不包含 `runtime_profile`、publisher mode、toolchain runner mode、secret provider、config center 或 admin override。

### 7.5 暂不列为正式 P0 配置项的控制面

| 控制面 | 当前处理方式 | 如果要配置化 |
|---|---|---|
| `runtime_profile` | 只作为配置矩阵分类 | 回写 03,新增字段或 enum |
| publisher mode / real bus binding | 由 adapter wiring / profile fixture 决定 | 回写 03,定义 publisher config 或 adapter constructor |
| toolchain runner mode / command args / timeout | 当前只保留 runner port 和 fake / real-like 实施口径 | 回写 03 或实施计划定义真实 runner contract |
| gate / blob adapter mode | 当前由 adapter wiring 决定 | 回写 03,定义 adapter config |
| log level / diagnostic mode | 当前不作为 P0 正式项 | 后续可在观测或实施计划中补充 |
| secret provider / KMS / Vault config | P1/P2 敏感配置边界 | 回写 03 + 部署运维手册承接 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 正式 P0 配置项只映射到 03 已有 7 个 `CoreRuntimeConfig` 字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| 本地配置 key 使用分层命名,不改变 Rust 字段名 | 否 | 项目本地配置 schema 命名 | 无 | 无回写 |
| `runtime_profile`、publisher mode、toolchain runner mode 暂不列为正式 P0 配置项 | 否 | 避免新增代码契约 | 无 | 无回写 |
| 若后续要求这些控制面配置化 | 是 | runtime config / adapter contract 变化 | `03-详细设计.md` §13 或对象 / adapter 契约章节 | 待回写 |

说明:

- 本步没有新增 `CoreRuntimeConfig` 字段、adapter constructor 参数、trait 方法或错误枚举。
- 本步最后一行是后续门禁: 若用户要求把暂不列入清单的控制面改成正式配置项,必须先回写 03。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §7。

````md
## 7. 配置项清单

> 校准来源：
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“P0 配置项清单”“模块级示例配置”“汇总配置示例”“本地配置 key 到 CoreRuntimeConfig 映射”“对详细设计的影响判定”和“待确认事项”小节，了解本章配置项如何从详细设计收敛。

本轮 P0 正式配置项只覆盖 `03-详细设计.md` 已经确认的 7 个 `CoreRuntimeConfig` 输入。项目配置文件默认使用严格 JSON;本地配置 key 按功能模块拆分,不额外包裹 `core` 项目名前缀,并映射到既有 Rust 字段,不新增代码契约。若未来存在系统级聚合配置文件,再使用 `core.<module>.<setting>` 作为聚合 key。

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `contract_source.root` | `ContractSourceRoot` | `./contract-source` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法或不可读 fail fast | runtime builder / source store |
| `release_snapshot.root` | `ReleaseSnapshotRoot` | `./release-snapshots` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法或不可写 fail fast | runtime builder / snapshot store |
| `projection_index.root` | `ProjectionIndexRoot` | `./state/projection` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法 fail fast;projection 失败 stale / rebuild | projection store |
| `audit.root` | `AuditRoot` | `./state/audit` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法或 audit append 不可用 fail fast | audit adapter |
| `outbox.root` | `OutboxRoot` | `./state/outbox` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法 fail fast;publish 失败保留 pending / failed | outbox adapter / relay |
| `idempotency.root` | `IdempotencyRoot` | `./state/idempotency` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 路径非法 fail fast;payload mismatch conflict | idempotency repository |
| `reference_resolver.config` | `ReferenceResolverConfig` | `ReferenceResolverConfig::default()` | 外部非必填;runtime 必需 | defaults / file / env / CLI flags | all P0 profiles | 启动读取 / 作业启动读取 | internal | 配置非法 fail fast;引用读取失败 fail closed | reference resolver adapter |

### 模块级示例配置

正文 §7.1 按 source store、release snapshot store、projection store、audit store、outbox store、idempotency store 和 reference resolver 分别给出严格 JSON demo,并在每个 demo 下方用表格说明配置项类型、示例值、作用、约束 / 校验和失败策略。

### 汇总配置示例

正文 §7.2 给出完整 JSONC 文档示例。该示例用于在代码块中直接注释配置作用;实际运行时配置文件必须删除注释并保持严格 JSON。

`runtime_profile`、publisher mode、toolchain runner mode、gate / blob adapter mode、secret provider config 暂不列为本轮正式 P0 配置项。若后续需要配置化,必须先回写 `03-详细设计.md`。
````

---

## 10. 待确认事项

- 是否接受正式 P0 配置项只包括 03 已有 7 个 `CoreRuntimeConfig` 输入。
- 是否接受项目本地配置 key 使用 `contract_source.root`、`release_snapshot.root`、`projection_index.root`、`audit.root`、`outbox.root`、`idempotency.root` 和 `reference_resolver.config` 命名,不额外包裹 `core` 前缀。
- 是否接受 root path 配置为 external 非必填但 runtime 必需。
- 是否接受 adapter mode、runner mode、publisher mode 暂不列为正式配置项。

---

## 11. 进入下一步条件

- [x] 用户确认 P0 配置项清单无缺口。
- [x] 用户确认本地配置 key 到 `CoreRuntimeConfig` 的映射。
- [x] 用户确认暂不列为正式配置项的控制面。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 7 状态从 `[~]` 更新为 `[x]`。
