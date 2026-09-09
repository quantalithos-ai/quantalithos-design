# L1-workspace 00 需求 Step 6：使用方与依赖

> 状态：`done / pass_with_blockers`；回填位置：正式 §6

## 1. 依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L1 shared contract base | 依赖方 | compile | 是，条件 | 仅使用稳定共享 ref/error/trace 类别。 |
| `L0-bus` | 事件传递主干 | 协作方 | event | 是 | 订阅 owner facts 变化；delivery truth 留在 bus。 |
| `L1-identity` | GlobalMember owner | 输入方 | runtime/event/ref | 是 | Personal scope identity anchor/summary。 |
| `L1-work` | Project/ProjectMember/WorkItem owner | 输入方 | runtime/event/ref | 是 | Project scope 与 work summary。 |
| `L1-conversation` | conversation truth owner | 输入方 | runtime/event/ref | 条件 | 只读摘要和 attention input。 |
| `L1-process` | process truth owner | 输入方 | runtime/event/ref | 条件 | 只读流程摘要。 |
| `L1-governance` | policy/decision owner | 输入方 | runtime/event/ref | 条件 | visibility/治理裁剪。 |
| `L1-artifact` | artifact truth owner | 输入方 | runtime/event/ref | 条件 | 安全 artifact ref/summary。 |
| `L0-sdk`、L5 产品、L5-sync | 访问/产品消费方 | 下游 | adapter/ref | 否 | 不拥有 workspace truth。 |
| `L4-archive` | 后续归档消费者 | 下游 | runtime/ref | 否 | 不反向定义当前 view。 |
| L2 项目 | 运行层相邻边界 | 非当前主链 | ref | 否 | 不将 execution/tool/sandbox truth 纳入 workspace。 |

## 2. 依赖类型分类

| 类型 | 关联项目 | 使用方式 |
|---|---|---|
| compile | `L0-core` | 共享契约来源；唯一候选。 |
| runtime/ref | L1 owners、SDK/product/archive | no-write query、safe ref、read/export seam。 |
| event | `L0-bus` 与 L1 owners | owner fact change 驱动 projection maintenance。 |
| adapter | SDK/product/sync/archive | 消费适配，不转移 authority。 |
| fake | 测试 seam | 仅验证本地语义，不证明集成。 |

## 3. 禁止依赖

禁止共享 L1 内部表、建立 L1 path dependency、projection 反写 owner truth、本地 allowlist、把 read cursor 写为 conversation receipt、把 bus delivery 或 archive acceptance写成 workspace state。

## 4. 依赖裁剪图

```text
L0-core --[compile]--> L1-workspace
L0-bus --[event]-----> L1-workspace
L1 owners --[runtime/ref]--> L1-workspace --[adapter/ref]--> SDK/product/sync/archive
```

## 5. Blocker

`WS-UP-001~008` 继续开放；具体 query/event/visibility/cursor 和下游 export contract 未闭口。门禁为 `pass_with_blockers`，允许进入 Step 7，但不得将条件依赖写成 ready。
