# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
> 回填章节：`04-配置设计.md` §9
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_09_loading_validation_activation.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与输入

本 Step 将 Step 7/8 的配置项变成可判定的加载、解析、校验、装配和生效链。它描述配置语义，不创建 loader/builder 源码，也不新增 03 的函数或错误类型。

| 输入 | 用途 |
|---|---|
| Step 5 source/priority | defaults + 单一 external document、非法不回退 |
| Step 7 P0 item table | 四域字段和严格 JSON shape |
| Step 8 secret boundary | forbidden key/value rejection、zero-output |
| 03 Step 14 | `buildConsoleRuntime`、dependencies、availability observation、fail-closed 顺序 |
| 03 Step 12/13/15 | typed error、cancel、single-writer、diagnostic isolation |

## 2. SOP 问题回答、诊断与取舍

| 问题 | 收口回答 |
|---|---|
| 何时加载？ | bootstrap 前一次性加载；配置文档和合并结果在 runtime 生命周期内冻结。 |
| 如何 parse/type validate？ | 先严格 JSON parse（duplicate/unknown/alias拒绝），再验证顶层 object、四模块、字段类型、闭合 enum、opaque ref shape 和 no-secret rule。 |
| 交叉字段？ | `runtime.profile` 必填；每个 binding.profile 必须等 runtime.profile；slot组合必须合法；invalidation/diagnostics=true必须有对应允许 binding/profile/合同姿态；production-pending拒绝 fake/test binding；不得出现 forbidden字段。 |
| 生效方式？ | 全部 `startup`；validation通过后才构造既有 `ConsoleClientBindingConfig` 并调用既有 `buildConsoleRuntime`。不存在 hot/reload/last-known-good 在线切换。 |
| 校验失败？ | whole-document fail-fast；不暴露 partial runtime、不回退低优先级、不启动危险路径。已运行 shell若依赖绑定随后不可用，按 03 的 restricted/minimal/disabled/partial 姿态，不把运行故障归咎于配置成功。 |

## 3. 配置加载流程图

#### 配置加载流程图: L5-console 配置加载与校验

```text
[safe defaults for optional fields]
        +
[one host-provided strict JSON document with required profile]
        |
        v
[source selection + whole-document merge]
        -> [strict JSON parse / duplicate & unknown check]
        -> [module/type/enum/opaque-ref validation]
        -> [cross-field & forbidden-boundary validation]
        -> [ConsoleClientBindingConfig construction]
        -> [register injected ConsoleRuntimeDependencies]
        -> [observe adapter/state/diagnostic availability]
        -> [buildConsoleRuntime]
        -> [bootstrap shell: presentable / restricted / minimal / closed]
```

关键说明：

- 图表达配置的加载与装配顺序，不表达部署命令、网络请求、SDK method、route或 secret provider。
- `buildConsoleRuntime` 不能因为 package、flag、route、fake 或配置值存在就把 slot 标为 `bound`。
- config validation 成功只表示本地输入 shape 合法；不表示 owner service、capability、数据 fresh、audit 或 readiness 成功。

## 4. 加载 / 校验 / 生效表

| 配置项/组 | 加载时机 | parse/type | cross-field | assemble target | 生效方式 | 失败策略 |
|---|---|---|---|---|---|---|
| `runtime.profile` | bootstrap前 | strict enum string | required；与每个 binding.profile一致 | `ConsoleClientBindingConfig.profile` | startup | fail-fast |
| `bindings.adapterBindings` | bootstrap前 | array/object；slot/profile/ref shape | unique slot/profile；owner组合由registry合同判定；禁止URL/secret/body | `ConsoleClientBindingConfig.adapterBindings` | startup | whole-document reject |
| `invalidation.enableSdkInvalidation` | bootstrap前 | boolean | true需正式 envelope/id/order/dedup + exact slot；当前 profile拒绝 | `enableSdkInvalidation` | startup | reject true / false disabled |
| `diagnostics.enableDiagnostics` | bootstrap前 | boolean | true需允许 diagnostic-sink binding；production sink合同当前缺失 | `enableDiagnostics` | startup | reject true / false disabled |
| full document | bootstrap前 | strict JSON; no duplicate/unknown/alias | all above + forbidden boundary | `buildConsoleRuntime` input | startup | no partial runtime |

## 5. 按域装配与 activation posture

| 域 | parse/type | cross-field | 允许的 positive outcome | 当前安全上限 |
|---|---|---|---|---|
| runtime | exact profile union | profile required | 选择 posture | 不等 readiness |
| bindings | closed slot + local ref | profile/slot/owner合同 | registry可报告 `bound`（仅未来合同齐全） | 当前 owner slots `pending-contract`；空数组合法 |
| invalidation | boolean | contract/slot/profile | future `observed` path | 当前必须 false/disabled |
| diagnostics | boolean | sink binding/profile | local fake或future正式 sink | 当前 false/disabled；production positive blocked |

## 6. validation issue surface

| issue class | 输出允许 | 禁止输出 | 运行影响 |
|---|---|---|---|
| parse/duplicate/unknown | safe section/module + issue kind + local diagnosticRef | raw document/value/path | fail-fast |
| missing/invalid profile | key class + allowed enum class | raw user file/body | fail-fast |
| invalid binding shape | module + slot class + issue kind | bindingRef raw value、URL、owner body | reject document |
| cross-field mismatch | field classes + profile/slot class | full values/secret | reject document |
| forbidden key/value | forbidden class | detected raw material | security reject |
| runtime builder unavailable | adapter facet + safe posture | SDK exception/body/credential | restricted/minimal or fail-fast by composition rule |

## 7. 生效方式矩阵

| 生效方式 | 适用项 | 触发 | 回退 | 备注 |
|---|---|---|---|---|
| `startup` | 四项全部 | 新 runtime bootstrap | 无在线回退；需修正文档并重新装配 | P0唯一方式 |
| `reload` | none | 不适用 | 不提供 | 若未来需要先回写03/04 |
| `hot` | none | 不适用 | 不提供 | 禁止在P0隐式加入 |
| `build-time` | none | 不适用 | 不提供 | bundler/framework未锁定 |
| `static` | forbidden boundaries | 设计版本变更 | 走设计评审 | 不是可覆盖配置 |

## 8. 跨加载校验审计与停审

| 审计项 | 结论 | 修正/说明 |
|---|---|---|
| 必填字段有明确失败 | pass | profile缺失fail-fast，其余安全default |
| 类型/枚举/opaque ref有校验 | pass | 不接受任意string/JSON body |
| cross-field完整 | pass | profile、slot、flag、forbidden边界逐项列出 |
| high-priority非法是否回退 | no | whole-document reject |
| hot update是否有回滚 | N/A | P0不支持hot/reload |
| builder/adapter影响是否回写 | no current | 只使用既有 `buildConsoleRuntime`/dependencies |
| errors是否与03一致 | pass | 使用现有 `ConsolePortError`/safe issue surface，不发明新enum |
| 是否运行parser/test | no | 本文件是设计合同，不伪造运行结果 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 状态 |
|---|---|---|---|---|
| startup strict document→既有 `ConsoleClientBindingConfig` | 否 | loader/serialization语义 | N/A | 无回写 |
| validation后调用既有 `buildConsoleRuntime` | 否 | 承接既有函数签名 | N/A | 无回写 |
| no hot/reload/online LKG | 否 | 当前生命周期边界 | N/A | 无回写 |
| future reload/LKG/remote source | 是 | builder lifecycle/Port/error/concurrency | 03 Step 7/9/12/13/14 | 当前禁止；触发时回写 |

## 10. 回填草稿、待确认与门禁

正式 §9 应保留流程图、加载表、生效矩阵和 issue surface；明确“校验通过≠服务可用/ready”。

| 待确认 | 当前处理 |
|---|---|
| strict parser具体库 | 留07实现选择；行为要求已固定 |
| host document delivery | 留07/09；loader不读取URL/DOM/storage |
| future online reload | P2/design-change-required |

| 进入 Step 10 条件 | 结论 |
|---|---|
| parse/type/cross-field/assemble可实现性闭口 | pass |
| 生效方式与失败策略一致 | pass |
| 跨加载无 unresolved内部缺口 | pass |
| 无当前03待回写 | pass |

Step 9 `done / pass / self_reviewed`；允许串行进入 Step 10。
