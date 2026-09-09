# L1-workspace 00 需求 Step 11：数据需求与数据归属

> 状态：`done / pass_with_blockers`；回填位置：正式 §11

| 数据 | 类型 | owner/归属 | 生命周期口径 |
|---|---|---|---|
| `WorkspacePartition`、projection revision/generation、coverage、gap、rebuild result | 真相数据 | workspace | 随 scope/projection 变化形成新 revision/generation，不覆盖历史判断。 |
| `SourceApplicationRecord`、source cursor/watermark | 真相数据 | workspace 的消费维护域 | 随事件/基线应用推进；gap/conflict 显式保留。 |
| `ReadCursor`、unread、pin/mute、preference、last-opened、focus | 真相数据 | workspace local-state | 按 principal/scope 管理；可重算结果与局部更新分离。 |
| owner safe summary、source version、visibility decision/ref | 引用/快照数据 | owner domain | workspace 只保存必要安全引用和判断语境。 |
| InboxItem projection | 快照/派生数据 | workspace | 可由 owner attention input + source facts 重建。 |
| 产品 UI、SDK cache、sync 私有状态、archive package | 禁止保存正文/外部状态 | 各自 owner | 不进入 workspace truth。 |
| L1 正文、secret、credential、runtime/tool body、policy body | 禁止保存正文 | 外部 owner | 只允许安全 ref/summary，正文不入仓。 |

数据不变量：任何派生投影都必须能回链 source owner、source ref、source version/watermark、visibility binding 和 workspace revision；缺少回链时只能处于 gap/blocked。

## 2. 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_12_interfaces_dependencies
```
