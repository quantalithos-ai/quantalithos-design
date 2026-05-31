# Step 7. 定义配置项清单

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 7 中间产物。
> 本步把 P0 配置项整理成可实现、可校验、可测试的正式清单。
> 本步只在 `03-详细设计.md` 已确认的 `SdkRuntimeConfig` 配置组内细化外部 JSON key,不新增 root 配置组,不新增 `SdkRuntimeConfig.profile` 字段。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-sdk/04-配置设计.md` §7 配置项清单

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 3 控制面 | `ConfigLoader -> ConfigValidator -> SdkRuntimeBuilder -> SdkRuntimeHandle` 和 11 个控制面 | 固定配置只能经统一 loader / validator / builder 生效 |
| Step 4 分类边界 | P0 核心配置冷更新,禁止配置化红线 | 为每个配置项标注生效方式、敏感级别和失败策略 |
| Step 5 来源优先级 | `code defaults < JSON config file < environment variables`,CLI / job args 仅作局部输入 | 固定来源和冲突处理口径 |
| Step 6 profile 矩阵 | local-dev、ci-test、integration-test、candidate-validation 为 P0 | 标注配置作用域和默认值语义 |
| `03-详细设计.md` §13 | `SdkRuntimeConfig.store / sources / boundaries / runners / artifacts / outbox / projections / language_packages / policies / cli / jobs` | 固定本步只细化既有配置组 |

已确认结论:

```text
项目本地配置默认使用严格 JSON。
本地配置不额外包裹 `sdk` 或 `l0_sdk` 项目前缀。
模块层按功能边界拆分,不使用 `common`、`misc`、`runtime`、`storage` 这类泛化模块承载多个功能。
完整带注释示例只能作为 JSONC 文档示例;实际运行配置必须删除注释并保持严格 JSON。
```

## 3. SOP 问题回答

1. 每个 P0 配置项的名称、类型、默认值是什么?

   回答：P0 配置项收敛在 11 个既有配置组内,字段级 key 见 §7.1。默认值覆盖 local / in-memory store、local sibling contracts、fixture source、fake boundary、local runner、filesystem artifacts、in-memory / local outbox、in-memory / local projection、Rust / Python / TypeScript enabled 和安全策略 on。

2. 哪些配置项必填?

   回答：外部 JSON 中大部分字段不是必填,因为 code defaults 可以构造 P0 默认路径;但最终 `ValidatedSdkRuntimeConfig` 中每个配置组必须有有效值。若用户显式提供 endpoint ref、path、profile、language 或 root,该值必须合法,非法值 fail-fast,不得回退低优先级。

3. 每个配置项从哪里来、作用域是什么?

   回答：普通来源遵守 Step 5: defaults、JSON config file、environment variables。CLI / job args 只能选择 config source 或传入 operation-local 参数。作用域覆盖 local-dev、ci-test、integration-test 和 candidate-validation;staging-like / production-like 只继承 ref / profile 接缝,不把真实生产值写入本轮 P0 清单。

4. 每个配置项如何生效、是否敏感、失败策略是什么?

   回答：P0 核心配置在 runtime 或 job 启动时读取,不支持热更新。path、root、profile 和 language 为 internal;endpoint ref、secret ref、credential ref 为 sensitive-ref;raw secret / raw token 永远非法。路径不可读、profile 不支持、language 不支持、ref 格式非法、fake marker 被关闭或安全门禁被关闭均 fail-fast 或 fail-closed。

5. 每个配置项关联哪些模块?

   回答：关联模块见 §7.1。所有配置项由 `infra_adapters::config` 解析和校验,由 `SdkRuntimeBuilder` 装配到 source、boundary、runner、artifact、outbox、projection、policy、CLI 和 jobs 相关 adapter。

6. 每个模块的 JSON demo 应该如何写?

   回答：模块级 demo 使用严格 JSON,每个模块独立展示,并在 demo 下方用表格说明字段作用、类型、默认值、约束和失败策略。完整配置示例为了直接注释作用,使用 JSONC 文档示例。

7. 模块拆分是否按功能边界展开?

   回答：是。`store`、`sources`、`boundaries`、`runners`、`artifacts`、`outbox`、`projections`、`language_packages`、`policies`、`cli` 和 `jobs` 均对应详细设计已有配置组和功能边界。

8. 项目本地配置是否避免重复项目名前缀?

   回答：是。项目本地配置使用 `"store"`、`"sources"` 等 top-level key,不包裹 `"sdk"`。如果未来出现系统级聚合配置,再由聚合层映射为 `sdk.<module>.<setting>`。

9. 完整配置 demo 是否需要文档注释?

   回答：需要。完整示例使用 `jsonc` 说明字段作用;实际运行配置必须删除注释并保持严格 JSON。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §13 | 已列 11 个配置组,但没有外部 JSON key 和字段级默认值 | 实现者可能自行发明配置文件形状 |
| Step 3~6 | 已确认控制面、边界、来源和 profile,但尚未形成配置项表 | 测试和验收无法定位具体配置项 |
| 当前 `04-配置设计.md` | 尚未创建 | 无法给实施者提供可复制的 JSON demo |
| 旧 `05/06` | 未按本轮配置项重校准 | 后续需要补配置 loader / validator / profile / forbidden boundary 测试与验收 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置形状 | 只有 `SdkRuntimeConfig` 组名 | 明确项目本地 JSON top-level key 和字段级 key | 防止实现阶段脑补 schema |
| 模块拆分 | 容易用 `runtime` / `storage` 混装 | 按既有功能配置组拆为 11 个模块 | 与详细设计配置组对齐 |
| 默认值 | 只写 local / fake / in-memory 口径 | 给出每组 P0 默认值和非法值策略 | 支撑 validator、测试和验收 |
| 敏感字段 | 只说不允许 raw secret | 区分 internal 与 sensitive-ref,endpoint / credential 只保存 ref | 支撑 Step 8 敏感配置 |
| 03 回写 | 未判断 | 不新增 root 配置组、不新增 profile 字段 | 无需回写 03 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只列 11 个配置组,字段留给实现 | 文档短 | 实现者仍会发明 JSON 字段 | 不采用 |
| 方案 B：在 11 个既有配置组内细化 P0 字段级 JSON key | 可实现、可校验,不新增 root 契约 | 字段较多,需要模块 demo 约束 | 采用 |
| 方案 C：新增 `profile`、`remote_config`、`registry` 等 root 配置组 | 看似完整 | 会改变 `SdkRuntimeConfig` 和 P0 范围 | 不采用 |

推荐方案 B。

原因:

- `03` 已经把配置绑定点收敛到 11 个配置组,Step 7 应在这些组内细化,不能重新造一套配置 root。
- SDK P0 的重点是默认可验证路径,不是生产 endpoint、公共 registry 或远程配置中心全集。
- 字段级 JSON key 能直接交给 loader、validator、测试和验收使用。

## 7. 结构化中间产物

### 7.1 P0 配置项清单

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `store.kind` | `StoreKind` | `in_memory` | 外部非必填;runtime 必需 | defaults / JSON / env | P0 profiles | 启动读取 | internal | 非法 kind fail-fast | repository / UoW / builder |
| `store.root` | `PathRef` | `./state/sdk` | local filesystem 时必需 | defaults / JSON / env | local / integration / candidate | 启动读取 | internal | 路径非法 fail-fast | repository adapters |
| `sources.core_contracts_path` | `PathRef` | `../quantalithos-core/crates/contracts` | 外部非必填;编译期真实实现必需 | defaults / JSON / env | all P0 | 启动读取 | internal | 不可用则暂停真实编译,不得复制类型 | core source adapter |
| `sources.bus_contracts_path` | `PathRef` | `../quantalithos-bus/crates/contracts` | 外部非必填;编译期真实实现必需 | defaults / JSON / env | all P0 | 启动读取 | internal | 不可用则暂停真实编译,不得复制类型 | bus source adapter |
| `sources.formal_api_snapshot_ref` | `SnapshotRef` | fixture snapshot | P0 非必填 | defaults / JSON / env | integration / candidate | 启动读取 | internal | ref 不可读则 stale / pending | formal API source |
| `boundaries.formal_api_endpoint_ref` | `EndpointRef` | absent | formal profile 必填 | JSON / env | staging-like / future production-like | 启动读取 | sensitive-ref | ref 非法 fail-closed | formal boundary adapter |
| `boundaries.fake_endpoint_ref` | `EndpointRef` | local fixture endpoint | fake profile 必需 | defaults / JSON / env | all P0 | 启动读取 | internal | 缺失或未标记 fake fail-fast | fake fixture adapter |
| `boundaries.bus_event_boundary_ref` | `BoundaryRef` | local fake bus boundary | P0 非必填 | defaults / JSON / env | integration / candidate | 启动读取 | sensitive-ref | 不可用则 pending / failed | bus boundary adapter |
| `runners.generator_profile` | `RunnerProfile` | `local_process` | 外部非必填;candidate 必需 | defaults / JSON / env | candidate | job 启动读取 | internal | profile 非法 fail-fast | language generator |
| `runners.validation_profile` | `RunnerProfile` | `local_process` | candidate 必需 | defaults / JSON / env | candidate | job 启动读取 | internal | runner 不可用 evidence failed / skipped | smoke / docs / compatibility / boundary runners |
| `artifacts.root` | `PathRef` | `./artifacts/test` | 外部非必填;candidate 必需 | defaults / JSON / env | all P0 | 启动读取 | internal | 不可写或含项目名重复层级 fail-fast | artifact store |
| `artifacts.report_root` | `PathRef` | `./reports` | 外部非必填 | defaults / JSON / env / job-local | CI / candidate | job 启动读取 | internal | 不可写 fail-fast | reports generator |
| `outbox.kind` | `OutboxKind` | `in_memory` | 外部非必填 | defaults / JSON / env | all P0 | 启动读取 | internal | 非法 kind fail-fast | outbox adapter |
| `outbox.root` | `PathRef` | `./state/outbox` | local file outbox 时必需 | defaults / JSON / env | integration / candidate | 启动读取 | internal | publish 失败保留 pending / failed | outbox relay |
| `projections.kind` | `ProjectionKind` | `in_memory` | 外部非必填 | defaults / JSON / env | all P0 | 启动读取 | internal | 非法 kind fail-fast | projection store |
| `projections.root` | `PathRef` | `./state/projections` | local projection 时必需 | defaults / JSON / env | integration / candidate | 启动读取 | internal | 失败标记 stale / rebuild | query projection |
| `language_packages.enabled_languages` | `LanguageTarget[]` | `["rust","python","typescript"]` | candidate 必需 | defaults / JSON / env | candidate | job 启动读取 | public | 不支持 language fail-fast | generator / package surface |
| `language_packages.output_root` | `PathRef` | `<artifacts.root>/<run_id>/candidate/packages` | candidate 必需 | defaults / JSON / env / job-local | candidate | job 启动读取 | internal | 不可写或未绑定 run id fail-fast | package builder |
| `policies.redaction` | `PolicyProfile` | `strict` | runtime 必需 | defaults / JSON / env | all P0 | 启动读取 | public | 关闭或降级 fail-fast | redaction policy |
| `policies.credential_protection` | `PolicyProfile` | `ref_only` | runtime 必需 | defaults / JSON / env | all P0 | 启动读取 | public | raw secret / raw token fail-fast | credential policy |
| `policies.fake_marker_required` | `bool` | `true` | runtime 必需 | defaults / JSON / env | all P0 | 启动读取 | public | false fail-fast | boundary guard |
| `policies.compatibility_gate` | `PolicyProfile` | `required` | candidate 必需 | defaults / JSON / env | candidate | job 启动读取 | public | 绕过 gate fail-fast | compatibility service |
| `cli.default_config_path` | `PathRef` | `./config/sdk.json` | CLI 可选 | defaults / env / CLI selector | local / CI | CLI 启动读取 | internal | 指定文件不可读 fail-fast | cli entry |
| `cli.default_profile` | `ProfileName` | `local-dev` | CLI 可选 | defaults / JSON / env / CLI selector | local / CI | CLI 启动读取 | public | profile 不支持 fail-fast | cli entry |
| `jobs.artifact_root` | `PathRef` | `<artifacts.root>/<run_id>` | job 可选 | defaults / JSON / env / job-local | CI / candidate | job 启动读取 | internal | 不可写、缺 run id 或含项目名重复层级 fail-fast | jobs |
| `jobs.report_root` | `PathRef` | `./reports` | job 可选 | defaults / JSON / env / job-local | CI / candidate | job 启动读取 | internal | 不可写 fail-fast | jobs / reports |
| `jobs.require_run_id` | `bool` | `true` | runtime 必需 | defaults / JSON / env | CI / candidate | job 启动读取 | public | false fail-fast;缺 run id fail-fast | operations jobs |

### 7.2 模块级 JSON demo 与说明

#### store 配置 demo

```json
{
  "store": {
    "kind": "in_memory",
    "root": "./state/sdk"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `store.kind` | `StoreKind` | `in_memory` | 选择 repository / UoW store profile | P0 只允许 `in_memory` 或 `local_file` | 非法 fail-fast |
| `store.root` | `PathRef` | `./state/sdk` | local file store 根目录 | `local_file` 时可读写;不得与 artifact root 混用 | 路径非法 fail-fast |

#### sources 配置 demo

```json
{
  "sources": {
    "core_contracts_path": "../quantalithos-core/crates/contracts",
    "bus_contracts_path": "../quantalithos-bus/crates/contracts",
    "formal_api_snapshot_ref": "fixture://formal-api/default"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `sources.core_contracts_path` | `PathRef` | `../quantalithos-core/crates/contracts` | 指向 core contracts 本地依赖 | 不可复制 core 类型 | 不可用则暂停真实编译 |
| `sources.bus_contracts_path` | `PathRef` | `../quantalithos-bus/crates/contracts` | 指向 bus contracts 本地依赖 | 不可复制 bus 类型 | 不可用则暂停真实编译 |
| `sources.formal_api_snapshot_ref` | `SnapshotRef` | `fixture://formal-api/default` | 读取 formal API snapshot / fixture | 不代表生产 endpoint | 不可读则 stale / pending |

#### boundaries 配置 demo

```json
{
  "boundaries": {
    "formal_api_endpoint_ref": null,
    "fake_endpoint_ref": "fixture://sdk/fake-endpoint",
    "bus_event_boundary_ref": "fixture://bus/event-boundary"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `boundaries.formal_api_endpoint_ref` | `EndpointRef` | `null` | 后续 formal boundary endpoint 引用 | P0 可为空;不得写 raw secret | 非法 ref fail-closed |
| `boundaries.fake_endpoint_ref` | `EndpointRef` | `fixture://sdk/fake-endpoint` | P0 fake / fixture 验证目标 | fake marker required | 缺 fake marker fail-fast |
| `boundaries.bus_event_boundary_ref` | `BoundaryRef` | `fixture://bus/event-boundary` | bus event boundary 引用 | 不生成 bus runtime truth | 不可用 pending / failed |

#### runners 配置 demo

```json
{
  "runners": {
    "generator_profile": "local_process",
    "validation_profile": "local_process"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `runners.generator_profile` | `RunnerProfile` | `local_process` | 选择语言绑定生成 runner | P0 不依赖远程 runner | 非法 profile fail-fast |
| `runners.validation_profile` | `RunnerProfile` | `local_process` | 选择 smoke / docs / compatibility / boundary runner | 结果必须形成 evidence | runner 失败则 evidence failed / skipped |

#### artifacts 配置 demo

```json
{
  "artifacts": {
    "root": "./artifacts/test",
    "report_root": "./reports"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `artifacts.root` | `PathRef` | `./artifacts/test` | 保存原始机器证据 base root;实际 run 目录为 `<artifacts.root>/<run_id>` | 不含项目名重复层级;不得写 `./artifacts/sdk`;不得直接写 base root | 不可写或缺 run id fail-fast |
| `artifacts.report_root` | `PathRef` | `./reports` | 保存 reviewed human-readable reports | 不写 `reports/<project>` | 不可写 fail-fast |

#### outbox 配置 demo

```json
{
  "outbox": {
    "kind": "in_memory",
    "root": "./state/outbox"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `outbox.kind` | `OutboxKind` | `in_memory` | 选择 outbound event 暂存方式 | P0 只允许 in-memory / local file | 非法 fail-fast |
| `outbox.root` | `PathRef` | `./state/outbox` | local file outbox 根目录 | 不与 repository / projection 混用 | publish 失败保留 pending / failed |

#### projections 配置 demo

```json
{
  "projections": {
    "kind": "in_memory",
    "root": "./state/projections"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projections.kind` | `ProjectionKind` | `in_memory` | 选择 query read model store | projection 不反写真相 | 非法 fail-fast |
| `projections.root` | `PathRef` | `./state/projections` | local projection 根目录 | 只保存派生视图 | 失败标记 stale / rebuild |

#### language_packages 配置 demo

```json
{
  "language_packages": {
    "enabled_languages": ["rust", "python", "typescript"],
    "output_root": "./artifacts/test/example-run-id/candidate/packages"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `language_packages.enabled_languages` | `LanguageTarget[]` | `["rust","python","typescript"]` | 定义 P0 package candidate 语言目标 | P0 三语言必须覆盖 | 缺失或不支持 fail-fast |
| `language_packages.output_root` | `PathRef` | `./artifacts/test/example-run-id/candidate/packages` | 保存语言包输出 | 必须位于当前 run 的 artifact root 下;不等于 public registry publish | 不可写或未绑定 run id fail-fast |

#### policies 配置 demo

```json
{
  "policies": {
    "redaction": "strict",
    "credential_protection": "ref_only",
    "fake_marker_required": true,
    "compatibility_gate": "required"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `policies.redaction` | `PolicyProfile` | `strict` | 控制脱敏下限 | 只能等强或更严格 | 降级 fail-fast |
| `policies.credential_protection` | `PolicyProfile` | `ref_only` | 只允许 credential ref | raw secret / raw token 非法 | fail-fast |
| `policies.fake_marker_required` | `bool` | `true` | fake / fixture 必须显式标记 | 不得关闭 | false fail-fast |
| `policies.compatibility_gate` | `PolicyProfile` | `required` | candidate stable gate | 不得绕过 evidence | 绕过 fail-fast |

#### cli 配置 demo

```json
{
  "cli": {
    "default_config_path": "./config/sdk.json",
    "default_profile": "local-dev"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `cli.default_config_path` | `PathRef` | `./config/sdk.json` | CLI 默认读取配置文件 | CLI arg 只能选择来源 | 指定文件不可读 fail-fast |
| `cli.default_profile` | `ProfileName` | `local-dev` | CLI 默认 profile | 不是 `SdkRuntimeConfig.profile` 字段 | 不支持 fail-fast |

#### jobs 配置 demo

```json
{
  "jobs": {
    "artifact_root": "./artifacts/test/example-run-id",
    "report_root": "./reports",
    "require_run_id": true
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobs.artifact_root` | `PathRef` | `./artifacts/test/example-run-id` | job 默认 artifact root;未显式设置时由 `<artifacts.root>/<run_id>` 派生 | job-local 参数只影响本次 run;必须包含当前 run id;不得含项目名重复层级 | 不可写或缺 run id fail-fast |
| `jobs.report_root` | `PathRef` | `./reports` | job 默认 report root | 不写 `reports/<project>` | 不可写 fail-fast |
| `jobs.require_run_id` | `bool` | `true` | 强制 operations job 带 run id | 不得关闭 | false 或缺 run id fail-fast |

### 7.3 完整配置 demo

以下示例是 JSONC 文档示例,使用 `example-run-id` 表示一次具体运行。实际运行配置文件必须删除注释并保持严格 JSON,并把 `example-run-id` 替换为当前 `run_id`。

```jsonc
{
  "store": {
    // SDK truth / repository store profile;P0 默认 in_memory。
    "kind": "in_memory",
    "root": "./state/sdk"
  },
  "sources": {
    // 本地 sibling contracts 路径;不存在时不得复制上游类型。
    "core_contracts_path": "../quantalithos-core/crates/contracts",
    "bus_contracts_path": "../quantalithos-bus/crates/contracts",
    "formal_api_snapshot_ref": "fixture://formal-api/default"
  },
  "boundaries": {
    // P0 使用 fake / fixture;formal endpoint 后续只通过 ref 表达。
    "formal_api_endpoint_ref": null,
    "fake_endpoint_ref": "fixture://sdk/fake-endpoint",
    "bus_event_boundary_ref": "fixture://bus/event-boundary"
  },
  "runners": {
    // 本地 runner profile;结果必须形成 evidence。
    "generator_profile": "local_process",
    "validation_profile": "local_process"
  },
  "artifacts": {
    // 原始机器证据 base root;实际 run 目录是 artifacts/test/<run_id>。
    "root": "./artifacts/test",
    "report_root": "./reports"
  },
  "outbox": {
    "kind": "in_memory",
    "root": "./state/outbox"
  },
  "projections": {
    "kind": "in_memory",
    "root": "./state/projections"
  },
  "language_packages": {
    "enabled_languages": ["rust", "python", "typescript"],
    "output_root": "./artifacts/test/example-run-id/candidate/packages"
  },
  "policies": {
    // 安全下限不得关闭或降级。
    "redaction": "strict",
    "credential_protection": "ref_only",
    "fake_marker_required": true,
    "compatibility_gate": "required"
  },
  "cli": {
    "default_config_path": "./config/sdk.json",
    "default_profile": "local-dev"
  },
  "jobs": {
    "artifact_root": "./artifacts/test/example-run-id",
    "report_root": "./reports",
    "require_run_id": true
  }
}
```

说明:

- 该示例覆盖当前 P0 字段级配置项。
- 模块级 demo 是严格 JSON;本完整示例因包含注释,只能作为 JSONC 文档示例。
- 本示例不包含 `sdk` 项目前缀、remote config、admin override、public registry token、raw secret 或 `profile` root 配置组。
- 所有正式 artifact 必须写入 `artifacts/test/<run_id>`;report 必须写入 `reports/runs/<run_id>` 或 `reports/acceptance`;不得使用 `./artifacts/sdk`、`artifacts/test/<project>/<run_id>`、`reports/<project>` 或正式 `latest`。
- 如果未来进入系统级聚合配置,再由聚合层映射为 `sdk.<module>.<setting>`。

### 7.4 暂不列为正式 P0 配置项的控制面

| 控制面 | 当前处理方式 | 如果要配置化 |
|---|---|---|
| `SdkRuntimeConfig.profile` | profile 只是 Step 6 矩阵分类 | 先回写 03,新增字段或 enum |
| remote config / config center | P1/P2 演进方向 | 先设计 reload、审计、回滚和不可用策略 |
| public registry publish token | 不进入 P0 | 发布专项 + secret provider 设计 |
| production endpoint matrix | 只保留 endpoint ref 接缝 | 生产 adapter / 运维文档专项 |
| raw secret / raw token | 永远不是配置项 | 不允许配置化 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本步在 11 个既有 `SdkRuntimeConfig` 配置组内细化外部 JSON key | 否 | 配置 schema 细化,不改变 root 配置组 | 无 | 无回写 |
| 项目本地配置不包裹 `sdk` 或 `l0_sdk` 前缀 | 否 | 配置文件命名规则 | 无 | 无回写 |
| profile 仍作为 Step 6 矩阵分类,不新增 `SdkRuntimeConfig.profile` | 否 | 避免新增代码字段 | 无 | 无回写 |
| remote config、public registry token、production endpoint matrix 不进入 P0 | 否 | 范围裁剪 | 无 | 无回写 |

说明:

- 本步没有新增 trait、port、adapter constructor、error enum 或函数流。
- 后续如果要求新增 root 配置组或把 profile 做成正式 Rust 字段,必须回写 `03-详细设计.md` 后再进入 Step 15。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §7。

````md
## 7. 配置项清单

> 校准来源：
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“P0 配置项清单”“模块级 JSON demo 与说明”“完整配置 demo”“暂不列为正式 P0 配置项的控制面”和“对详细设计的影响判定”小节，了解本章配置项如何从详细设计配置组收敛。

本轮 P0 配置项收敛在 `SdkRuntimeConfig.store / sources / boundaries / runners / artifacts / outbox / projections / language_packages / policies / cli / jobs` 11 个既有配置组内。项目本地配置默认使用严格 JSON,top-level key 不额外包裹 `sdk` 或 `l0_sdk` 项目前缀。

正文 §7.1 回填字段级配置项清单。
正文 §7.2 按 11 个功能模块分别回填严格 JSON demo 和字段说明表。
正文 §7.3 回填完整 JSONC 文档示例,并说明实际运行配置必须删除注释。
正文 §7.4 回填暂不列为正式 P0 配置项的控制面。

`profile` 仍然只是配置矩阵分类,不是 `SdkRuntimeConfig.profile` 字段。remote config、public registry token 和 production endpoint matrix 不进入 P0 配置项清单。
````

## 10. 待确认事项

- 是否接受 P0 配置项只在 11 个既有 `SdkRuntimeConfig` 配置组内细化。
- 是否接受项目本地配置不额外包裹 `sdk` 或 `l0_sdk` 前缀。
- 是否接受 `profile` 暂不作为正式 Rust 字段。
- 是否接受 production endpoint matrix、public registry token 和 remote config 不进入 P0 清单。

## 11. 进入下一步条件

- [x] P0 配置项已覆盖 11 个既有配置组。
- [x] 每个模块已有严格 JSON demo 和字段说明表。
- [x] 完整配置 demo 已标注为 JSONC 文档示例。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 7 状态从 `[~]` 更新为 `[x]`。
