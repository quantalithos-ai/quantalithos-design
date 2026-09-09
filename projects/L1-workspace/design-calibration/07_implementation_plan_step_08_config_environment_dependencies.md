# Step 8. 定义配置、环境与外部依赖准备

## 1. Step 状态

`completed / external_blocked`。

## 2. 外部依赖准备表

| 依赖 | 类型 | 阶段 | 提供方 | 检查 | 不可用处理 |
|---|---|---|---|---|---|
| quantalithos-core | compile candidate | PH-01~08 | L0-core | 查 `/home/aris/Projects/quantalithos-core` 与真实 Cargo layout | 暂停依赖真实类型的 boundary |
| L0-bus | event | PH-04/08 | L0-bus | versioned envelope/transport/replay contract | local classifier可做；正向 blocked |
| L1 owner safe query/visibility | runtime/ref | PH-03/04/08 | 各 owning project | formal conformance manifest | fail-closed/blocked |
| owner attention/baseline | runtime/event/ref | PH-04/05/08 | owning projects | identity/order/proof vector | 不推测；blocked |
| local durable store | adapter/runtime | PH-03~08 | workspace infra | driver/atomicity/restart contract | controlled only；formal blocked |
| secret/key provider | runtime/secret ref | PH-06/08 | approved provider | key ring/rotation/CSPRNG contract | synthetic local only |
| SDK/product/sync/archive | adapter/ref | PH-08 | downstream owners | read/export compatibility manifest | compatibility blocked |

## 3. Profile与配置检查

复用 04 的 `local/test/staging/production` 四 profile、strict source priority、limits、timeouts、bindings、secret/ref、redaction。缺 required key、unknown key、profile冲突、production fake、active key缺失均 fail-fast 或 blocked；不新增默认值、endpoint、schema 或配置键。

## 4. fake / controlled / disabled 边界

fake 仅可证明本地状态、错误分类、fault/barrier、write-set、redaction 和 dependency check；不得伪造 owner authorization、正式 event/order/replay、durable finality、下游 acceptance 或 readiness。formal slot 缺失时 capability disabled/blocked。

## 5. 回填与进入下一步

依赖分类、阶段使用和不可用处理已明确；允许 Step9。
