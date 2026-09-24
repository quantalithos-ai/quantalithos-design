# 00 需求 Step 5 · 用户与角色

> 状态：`completed`
> 前置：`00_req_step_04_goals_non_goals.md`
> 回填章节：正式 `00` §5 用户与角色

## 1. 本步目标

明确谁以什么身份接触 Runner、各角色在什么场景使用端侧运行入口，以及角色差异如何影响“选择、运行、控制、查看和诊断”的可见范围。角色不等于仓际依赖，也不在本步定义接口动作。

## 2. 输入与诊断

- Step 2 的 Runner 边界和 Step 4 的目标/非目标。
- 产品矩阵中的主要用户：运行 AI 产出软件的用户、非开发者、演示/试用者。
- 上游正式文档的 actor/context、ProjectMember、Governance、Sandbox 和 Observability 责任边界。
- 旧文档中的“管理员/用户拥有全部控制权”以及本地日志回传等越界暗示，仅作污染扫描。

## 3. 角色说明表

| 角色 | 类型 | 使用场景 | 需求层边界 |
|---|---|---|---|
| 运行用户 / 项目成员 | 人类角色 | 在获授权项目语境中选择一个 Release，查看准备与运行状态，使用允许的启动、停止和清理入口。 | 只能操作正式可见且允许的范围；不因“能看到按钮”而获得 Artifact、Governance 或 Sandbox 权限。 |
| 非开发者试用者 / 演示者 | 人类角色 | 快速查看已批准产物、启动演示实例、查看安全预览并结束本次使用。 | 不需要理解部署细节，但仍不能绕过版本、完整性、Sandbox 或 cleanup 门禁。 |
| 项目负责人 / 发布责任人 | 人类角色 | 在正式项目语境中选择指定 Release、确认运行影响并查看失败/恢复信息。 | 责任角色不等于 Governance approver；Runner 不授予或解释批准权。 |
| 支持 / 运维操作员 | 人类维护角色 | 处理端侧下载失败、资源冲突、断线、孤儿运行和清理提示，协助用户重新验证或等待 owner reconcile。 | 只能使用正式允许的诊断/清理入口；不直接改 Release、Sandbox backend 或 Runtime truth。 |
| 审计 / 安全查看者 | 人类只读角色 | 查看安全诊断摘要、source refs、版本/authority 姿态和 Observability handoff 状态。 | 只读查看，不把本地日志、预览或 handoff receipt 当正式证据、verdict 或 signoff。 |
| SDK / 产品调用方 | 系统接触角色 | 代表上层产品或客户端读取 Runner 安全状态、传递用户选择或打开运行入口。 | 通过正式 SDK/API 边界消费；不读取 Runner 内部存储，不把客户端状态当 source truth。 |
| Artifact/Release 消费适配器 | 系统接触角色 | 为 Runner 提供可验证的 Release/version、locator、manifest、digest/signature 和撤销/过期姿态（合同成立后）。 | 适配器不转移 Artifact/Governance ownership；合同缺失时只能返回 blocked/pending。 |
| Sandbox / Runtime 状态适配器 | 系统接触角色 | 接收正式运行请求，返回 boundary、lease、execution、cleanup 或结果状态的安全引用。 | 不把 ACK、进程存活或本地探针升级为正式执行成功。 |
| Observability handoff / 诊断适配器 | 系统接触角色 | 接收允许的安全诊断摘要，返回 handoff receipt/readiness/delivery 姿态。 | 不由 Runner 或适配器生成 evidence、report、verdict 或 signoff。 |
| Runner 本地维护任务 | 系统维护角色 | 在本地重建 cache 元数据、恢复 cursor、清理候选或刷新安全视图。 | 只能维护 Runner-owned local state；不修复上游 truth，不自动重放未知副作用。 |

## 4. 角色使用场景结论

| 场景 | 主要角色 | 次要角色 | 角色差异 |
|---|---|---|---|
| 选择并准备 Release | 运行用户、项目成员 | 项目负责人、SDK 调用方 | 选择必须显式；责任身份不能绕过 authority。 |
| 下载与完整性确认 | 运行用户、试用者 | 支持/运维、Artifact adapter | 用户看到进度和结果；适配器提供正式来源；失败不进入运行。 |
| 启动与运行观察 | 运行用户、演示者 | Sandbox/Runtime adapter | 用户发起意图；真实 running/terminal 由 owner 状态决定。 |
| 停止、清理与冲突处理 | 运行用户 | 支持/运维、Sandbox adapter | 未知或受保护状态需等待 reconcile/人工确认，不可强删。 |
| 失败诊断与安全交接 | 运行用户、支持/运维 | 审计/安全查看者、Observability adapter | 只展示安全摘要与下一步；本地材料不是正式证据。 |
| 断线恢复 | 运行用户、支持/运维 | SDK、Runtime/Sandbox adapter | 先冻结副作用，再重验语境和 owner 状态；不自动重放未知动作。 |

## 5. 权限差异矩阵（需求层）

下表只表达产品入口的角色差异；最终 authorization、ProjectMember 和 Governance 决定仍归各 owner。

| 操作 / 可见范围 | 运行用户 / 项目成员 | 试用者 / 演示者 | 项目负责人 | 支持 / 运维 | 审计 / 安全 | 系统适配器 |
|---|---|---|---|---|---|---|
| 查看当前正式可见的 Release 选项 | 允许，受 project/context 限制 | 允许，受正式分享/语境限制 | 允许，受正式 scope 限制 | 允许，仅为支持目的 | 只读，按 visibility | 仅按服务合同读取 |
| 选择并确认运行版本 | 允许在可用范围内 | 允许在可用范围内 | 允许在责任范围内 | 代操作需有正式授权 | 不允许修改 | 只承接已确认选择 |
| 发起启动意图 | 允许 | 允许 | 允许 | 仅在授权支持流程中 | 不允许 | 代提交但不替代 actor |
| 查看运行/资源/输出预览 | 允许自身/项目可见范围 | 允许本次会话范围 | 允许责任范围 | 允许受支持范围 | 只读安全摘要 | 返回正式安全 view |
| 发起停止或清理意图 | 允许自身可控运行 | 允许本次运行 | 允许责任范围 | 允许受控运维范围 | 不允许副作用操作 | 仅按 owner 合同执行 |
| 查看诊断和 handoff 状态 | 允许安全摘要 | 允许安全摘要 | 允许责任范围 | 允许较完整的安全摘要 | 允许只读审计摘要 | 不得升级为证据结论 |
| 修改 Release/manifest/approval/Sandbox policy | 不允许 | 不允许 | 不允许（除非由相邻 owner 正式入口处理） | 不允许 | 不允许 | 不允许 |
| 在 unknown 状态自动重放启动/停止/清理 | 不允许 | 不允许 | 不允许 | 不允许；先 reconcile | 不允许 | 不允许 |

## 6. 取舍与未采用方案

- 采用“用户角色 + 系统接触角色 + 本地维护角色”三类识别，不把 Artifact、Sandbox、Runtime 等仓名直接当作人类角色。
- 采用 owner authorization 与 Runner 入口权限分离，不采用“Runner 管理员拥有全局运行/批准权”。
- 采用审计角色只读安全摘要，不采用本地日志导出即审计证据。
- 采用支持/运维在 unknown 时协助 reconcile，不采用强制 kill、强删 cache 或越过 cleanup guard。

## 7. 回填草稿

正式 §5 将包含角色说明表、按角色归纳的使用场景和需求层权限差异矩阵，并明确最终授权由正式 owner 决定。不会写具体 endpoint、命令、token、数据库角色或实现权限中间件。

## 8. 自检与进入下一步门禁

- [x] 人类角色、系统接触角色和维护角色已区分。
- [x] 角色描述写使用场景和边界，没有把仓际依赖当角色。
- [x] 权限矩阵只表达入口差异，没有自行发明授权真相。
- [x] 未把接口动作、DTO、实现权限或系统内部模块写入角色章节。

`Step 5 gate_status = pass`；下一步允许进入 `Step 6 使用方与依赖`。
