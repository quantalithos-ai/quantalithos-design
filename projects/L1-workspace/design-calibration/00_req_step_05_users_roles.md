# L1-workspace 00 需求 Step 5：用户与角色

> 状态：`done / pass`；回填位置：正式 §5

## 1. 角色结论

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 成员/产品用户 | 人类或受限系统主体 | 读取 Personal/Project workspace，更新 read/pin/mute/preference 等局部状态。 |
| 产品/同步调用方 | 系统角色 | 通过正式 read surface 消费 workspace model。 |
| Workspace maintainer | 人类/系统维护角色 | 观察 source cursor、gap、projection status，发起 refresh/rebuild。 |
| 审计/安全查看者 | 人类角色 | 查看 provenance、visibility 裁剪、失效和降级原因。 |
| Projection worker | 系统角色 | 应用 owner event、维护投影和幂等记录。 |
| Owner query/event provider | 外部系统角色 | 提供正式 query、event、visibility decision 或 replay/baseline seam。 |

## 2. 权限边界

用户只能修改 workspace-owned local state；产品/同步只能读取正式 read model；维护者可触发受控维护但不能修复上游 truth；审计者只读；owner provider 只提供自身事实。任何角色都不能通过 workspace 形成 authorization truth 或业务命令。

## 3. 诊断与门禁

不把 identity/work/governance 等仓际依赖写成用户角色，不把 API 动作写成角色定义。结果：`gate_status = pass`，下一步为 Step 6。
