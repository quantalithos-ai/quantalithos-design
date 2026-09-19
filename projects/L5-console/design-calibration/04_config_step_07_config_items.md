# Step 7. 定义配置项清单

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节：`04-配置设计.md` §7
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_07_config_items.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与输入

本 Step 按 Step 3～6 的四个配置域逐项闭合 P0 配置。外部格式为严格 JSON；模块层只是序列化组织，不改变 03 的 `ConsoleClientBindingConfig` 字段。

| 输入 | 约束 |
|---|---|
| 03 Step 14 `ConsoleClientBindingConfig` | 只允许 `profile`、`adapterBindings`、`enableSdkInvalidation`、`enableDiagnostics` 四个字段语义 |
| Step 4 分类边界 | 全部 startup-only；无 hot/reload |
| Step 5 来源规则 | safe defaults + one host-provided strict JSON document |
| Step 6 profile 矩阵 | 三个既有 profile；环境名不新增 enum |
| Step 1 blocker | 不把 endpoint/secret/owner schema/state medium/diagnostic envelope写成配置项 |

## 2. SOP 问题回答、诊断与取舍

| 问题 | 收口回答 |
|---|---|
| P0项的名称、类型、默认、必填？ | 四项：`runtime.profile`（enum，必填无默认）、`bindings.adapterBindings`（array，默认空）、`invalidation.enableSdkInvalidation`（boolean，默认false）、`diagnostics.enableDiagnostics`（boolean，默认false）。 |
| 每项来源/作用域/生效/敏感/失败？ | 均来自 defaults 或单一 external document；作用域为单个 Console runtime；startup-only；`internal`，无 secret；错误均 whole-document reject 或安全 disabled。 |
| 是否重复项目名前缀？ | 项目本地 JSON 使用 `runtime`/`bindings`/`invalidation`/`diagnostics`，不重复 `l5-console`；系统聚合映射若未来需要，属于 09/host，不新增本地 key。 |
| 是否需要 owner 字段？ | 不需要且禁止在当前 JSON 添加。现有 `ConsoleAdapterBindingRef` 没有 owner 字段；per-owner formal slot 仍由 adapter registry/正式合同提供。若未来必须配置 owner，先回写 03。 |
| 模块 demo 如何保证严格 JSON？ | 每个 demo 是可解析 JSON；完整 demo 也是严格 JSON。文档不使用注释型 JSONC 伪装运行配置。 |
| 模块是否过粗？ | 四个模块分别对应四个已有 config 字段/语义，不使用 `common`/`misc`/`runtime` 大桶承载不同功能；`runtime` 只放 profile。 |

## 3. 配置项总表

| 配置项 | 类型 | 默认值 | 必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 | 允许值/约束 |
|---|---|---|---|---|---|---|---|---|---|---|
| `runtime.profile` | enum string | 无 | 是 | external document | 一个 runtime | `startup` | `internal` | 缺失/未知→fail-fast | `entry` | `local-fake` / `integration-pending` / `production-pending` |
| `bindings.adapterBindings` | array<object> | `[]` | 否 | default 或 external document | 一个 runtime registry | `startup` | `internal` | 非数组、重复、非法 slot/ref/profile→reject whole document | `entry`/`adapters` | 元素只允许 `slot`、`profile`、`bindingRef`；不含 owner/URL/secret/body |
| `invalidation.enableSdkInvalidation` | boolean | `false` | 否 | default 或 external document | 一个 runtime | `startup` | `internal` | true 无正式 envelope/slot/profile前置→reject；false→disabled | `entry`/`adapters`/`state` | 不创建 cursor/replay/topic；不改变 Query 主链 |
| `diagnostics.enableDiagnostics` | boolean | `false` | 否 | default 或 external document | 一个 runtime | `startup` | `internal` | true 无允许 sink binding→reject；false→disabled | `entry`/`diagnostics` | 不含 endpoint/sampling/body；失败与业务隔离 |

## 4. 按配置域的配置项批次与停审

### 4.1 `runtime` 域

| 项 | 结论 |
|---|---|
| 控制面 | runtime profile |
| 03 映射 | `ConsoleClientBindingConfig.profile` |
| 默认/必填 | 无默认；必填 |
| profile语义 | 只选择 `local-fake`、`integration-pending`、`production-pending` 姿态 |
| 禁止 | 新枚举、readiness、权限、owner truth、状态机切换 |
| 域停审 | 类型/默认/来源/作用域/生效/敏感/失败策略齐全；pass |

### 4.2 `bindings` 域

| 项 | 结论 |
|---|---|
| 控制面 | adapter binding correlation |
| 03 映射 | `ConsoleClientBindingConfig.adapterBindings` |
| 默认/必填 | 默认 `[]`；非必填 |
| 元素 shape | `slot: FormalBoundaryFacet | host-route | host-a11y | state-carrier | diagnostic-sink`；`profile` 为既有三值；`bindingRef` 为非空 local opaque ref |
| owner边界 | 当前 JSON 不含 owner；owner-required facet 的 owner 由 formal registry/contract 提供；配置不得猜 owner |
| 禁止 | endpoint、URL、SDK method、secret、credential、raw body、任意对象、重复 slot、跨profile |
| 域停审 | strict array/object/unique/ref/forbidden checks齐全；positive owner binding仍 pending；pass with explicit blocker |

### 4.3 `invalidation` 域

| 项 | 结论 |
|---|---|
| 控制面 | optional SDK invalidation request |
| 03 映射 | `enableSdkInvalidation` |
| 默认/必填 | false；非必填 |
| true前置 | 未来 formal envelope + id/order/dedup + exact SDK slot + mapper；当前未满足 |
| 当前策略 | 所有正式环境 false；local fake 的负向测试可构造 true 输入但运行姿态仍不得越过 pending-contract；production config true 直接 reject |
| 禁止 | direct bus、topic/cursor、payload、replay、command、refresh、positive state restore |
| 域停审 | false/disabled安全闭合；true受合同 blocker；pass with explicit blocker |

### 4.4 `diagnostics` 域

| 项 | 结论 |
|---|---|
| 控制面 | optional body-free diagnostics |
| 03 映射 | `enableDiagnostics` |
| 默认/必填 | false；非必填 |
| true前置 | local fake 或未来正式 sink binding；`DiagnosticEmissionPort` 仍执行 factory/gate/availability |
| 当前 profile | local-fake可在受控测试 document中 true且必须有 `diagnostic-sink`；integration/production-pending true当前 reject |
| 禁止 | endpoint/sampling/batching/retention、arbitrary metadata、raw error/body/secret、audit/evidence/readiness |
| 域停审 | safe disabled与fake-only正向边界闭合；production sink pending；pass with explicit blocker |

## 5. 模块级严格 JSON demo 与作用说明

### 5.1 `runtime` 配置 demo

```json
{
  "runtime": {
    "profile": "local-fake"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `runtime.profile` | enum string | `local-fake` | 选择已存在的 runtime posture | 必填；只允许三值；不表示 readiness | 缺失/未知/与 binding 不匹配→fail-fast |

### 5.2 `bindings` 配置 demo

```json
{
  "bindings": {
    "adapterBindings": []
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `bindings.adapterBindings` | array<object> | `[]` | 提供可选的 slot correlation；空数组表示没有声明 binding | 元素只允许既有三字段；slot/profile/ref严格校验；当前不承诺 `bound` | 非法/重复/forbidden→reject whole document；空数组→pending/disabled安全姿态 |

### 5.3 `invalidation` 配置 demo

```json
{
  "invalidation": {
    "enableSdkInvalidation": false
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `invalidation.enableSdkInvalidation` | boolean | `false` | 请求 optional SDK hint path | 不携带 event/schema/topic；当前正式文档只能 false | true无合同/slot→reject；false→disabled |

### 5.4 `diagnostics` 配置 demo

```json
{
  "diagnostics": {
    "enableDiagnostics": false
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `diagnostics.enableDiagnostics` | boolean | `false` | 请求 optional diagnostic facade | 只控制 facade request，不含 sink details；production true需正式合同 | 无允许 sink→reject；false→disabled |

### 5.5 完整配置 demo（严格 JSON）

```json
{
  "runtime": {
    "profile": "local-fake"
  },
  "bindings": {
    "adapterBindings": []
  },
  "invalidation": {
    "enableSdkInvalidation": false
  },
  "diagnostics": {
    "enableDiagnostics": false
  }
}
```

该 demo 是文档级、可解析的安全最小姿态，不代表已创建配置文件、host、fake、SDK集成或 production readiness。若未来需要非空 binding，必须使用既有三字段，并重新通过 owner/slot/profile/opaque-ref 与 formal contract 校验；不得从本 demo推导 endpoint或权限。

## 6. 跨配置项闭环审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 每个P0项都有类型/默认/必填/来源/作用域/生效/敏感/失败 | pass | 总表逐项覆盖 |
| JSON模块按功能边界拆分 | pass | 四域一一对应四字段 |
| 本地 key 是否重复项目名前缀 | pass | 无 `l5-console.*` 前缀 |
| full demo 是否严格 JSON | pass | 无注释/trailing comma |
| adapterBindings 是否偷偷新增 owner/endpoint | no | exact 03 shape保留；owner由registry/合同 |
| sensitive/secret 是否漏项 | pass | 当前无 secret项，Step 8单独说明 future forbidden |
| 环境/profile差异是否有回指 | pass | Step 6逐profile矩阵 |
| default/flag 是否改变状态/权限 | no | 仅装配姿态，guard/observation仍必要 |
| 未确认 owner/invalidation/diagnostic 是否写成 active | no | pending/disabled/reject明确 |
| 是否需回写03 | no | 当前只序列化既有字段 |

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 四个外部 JSON module 映射既有四字段 | 否 | serialization only | N/A | 无回写 |
| adapterBindings不增加 owner字段 | 否 | 保持既有类型边界 | N/A | 无回写 |
| flags默认false、startup-only | 否 | 既有 binding/availability 细化 | N/A | 无回写 |
| 未来 per-owner config、endpoint、secret、state medium、hot reload | 是 | config/builder/adapter/flow contract | 03 Step 4/7/11/14/15 | 当前明确不进入 |

## 8. 待确认事项、回填草稿与门禁

正式 §7 应逐项承载总表、四个严格 JSON module demo、完整 demo 和“示例不代表实现/ready”声明。过程停审表留在本文件。

| 待确认事项 | 当前处理 |
|---|---|
| per-owner binding serialization | 当前禁止新增 owner字段；等待正式 03/owner contract |
| non-empty bindingRef generator/serialization | 只允许已验证 local opaque ref；具体 host source留07 |
| production diagnostic/invalidation | 当前 false/disabled；不通过 config 强启 |

| 进入 Step 8 条件 | 结论 |
|---|---|
| P0项完整且逐域停审 | pass / explicit blockers |
| strict JSON demos可解析 | pass（静态审阅；未运行 parser） |
| 跨项无重复/泛化/来源断裂 | pass |
| 无当前03待回写 | pass |

Step 7 `done / pass / self_reviewed`；允许串行进入 Step 8。未运行 parser、测试或实现。
