# 00 需求 Step 5 · 用户与角色

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_04_goals_non_goals.md`
> 回填章节：正式 `00` §5

## 1. 本步目标

明确谁以什么身份接触 L5-sync、各角色在什么场景下使用，以及哪些角色不能因使用 Sync 而获得上游授权或治理权。

## 2. 角色说明表

| 角色 | 类型 | 主要场景 | 需求层边界 |
|---|---|---|---|
| 开发者/项目成员 | 人类 | 显式选择项目和版本、初始化工作副本、pull、查看 status、处理冲突、发起 push-review。 | 只能在正式 Project/ProjectMember 权限和 Review Gate 规则允许的范围内操作。 |
| 项目接手人/代码评审者 | 人类 | 接收既有来源、在本地检查和修改、准备候选交给 review handoff。 | 不获得 Artifact/Baseline 创建权、Gate 接受权或跨项目默认权限。 |
| 支持/工作区维护者 | 人类 | 处理 metadata 损坏、恢复、路径冲突、unknown outcome 和归档姿态提示。 | 只能修复/重绑允许的本地状态；不得伪造 provenance 或修改上游真相。 |
| 审计/安全查看者 | 人类 | 查看来源绑定、操作关联、冲突和 handoff 的安全摘要。 | 只读；不能通过 Sync 直接批准、上传或绕过 Gate。 |
| 产品/SDK 调用方 | 系统/调用方 | 以正式 SDK/API 消费 status、source binding、handoff 状态和安全诊断。 | 不因消费 Sync 读面获得本地或平台 truth ownership。 |
| 平台 owner seam | 系统 | 提供 identity、work、artifact、workspace、governance、archive 和 observability 的正式查询/提交结果。 | owner 结论不可由 Sync 重新解释；合同不明时返回 pending/blocked。 |
| Git/filesystem 环境 | 外部系统 | 提供本地 HEAD/index/tree、路径、dirty 状态、锁和工具能力。 | 只构成本地观察边界；不成为平台 project/version/review truth。 |
| Sync 本地维护任务 | 系统 | 恢复 metadata、记录 checkpoint、重算 local status、探测 unknown outcome。 | 不修复 owner truth、不自动执行 merge/rebase/push、不把维护成功当业务成功。 |

## 3. 需求层权限差异矩阵

| 操作/能力 | 项目成员 | 接手人/评审者 | 支持维护者 | 审计查看者 | 系统调用方 | Sync 本地任务 |
|---|---|---|---|---|---|---|
| 显式选择 project/version/source | 允许（受权限检查） | 允许（受权限检查） | 仅协助确认，不代选 | 只读查看 | 传递已明确选择 | 不猜测、不代选 |
| 初始化/绑定 working copy | 允许自己的目标路径 | 允许被授权目标路径 | 可执行受控恢复/迁移 | 不允许 | 依合同调用 | 记录局部状态 |
| `status`/安全诊断读取 | 允许 | 允许 | 允许 | 允许 | 允许 | 允许 |
| `pull`/增量 materialize | 允许（未提交保护） | 允许（未提交保护） | 仅在明确维护授权下协助 | 不允许 | 仅调用正式能力 | 执行受限本地步骤，不得越权 |
| 冲突决策 | 人类显式决定 | 人类显式决定 | 可协助记录/恢复 | 只读 | 不自动决定 | 不自动解决 |
| `push-review` handoff | 依 Project/Governance 权限 | 依 Project/Governance 权限 | 不因维护身份自动获得 | 不允许 | 仅传递正式调用 | 不自动发起 |
| Review accept/approve/signoff | 不由 Sync 提供 | 不由 Sync 提供 | 不由 Sync 提供 | 只读外部结果 | 只读外部状态 | 不产生 verdict |
| 修改 Project/Artifact/Archive truth | 不由 Sync 提供 | 不由 Sync 提供 | 不由 Sync 提供 | 不允许 | 不由 Sync 提供 | 不允许 |

## 4. 角色与边界诊断

- “平台管理员”不能因为拥有平台权限就通过 Sync 绕过 Review Gate；Sync 只承接 owner 已授权的动作面。
- “系统”不是单一超级用户：SDK、owner seam、Git/filesystem 和本地维护任务各自受不同边界约束。
- 审计查看者看到的是安全摘要和引用，不意味着 Sync 保存或暴露 Artifact/Review 正文。
- 冲突解决、是否覆盖本地修改和是否提交 review 候选必须保持显式人类意图，不能由后台任务推断。

## 5. 取舍与回填草稿

正式 §5 将使用角色说明表与需求层权限矩阵；不把仓际依赖、API 动作、内部模块或用户故事写成角色定义。

## 6. 自检与门禁

- [x] 人类角色、系统角色、外部环境已分开。
- [x] 角色场景与 Step 2/4 边界一致。
- [x] 权限矩阵没有授予 Sync 以外的 truth ownership 或 Review verdict。
- [x] 未写协议、字段、实现组织或测试结果。

`Step 5 gate_status = pass`；允许进入 Step 6。
