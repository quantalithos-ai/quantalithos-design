# Step 5. 用户与角色

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 5
- 回填章节：正式 `00-需求文档.md` §5
- gate_status：`pass`
- gate_reason：人类角色、系统角色、使用场景和权限边界已分开；仓际依赖未冒充用户角色。
- next_allowed_action：进入 Step 6 使用方与依赖。

### 1.1 Step 内计划

- [x] 读取 Step 2~4、L1-workspace 角色/边界和 draft/02。
- [x] 区分发起者、审计者、运维者、恢复操作者与 owner 系统角色。
- [x] 诊断旧文档把 governance、work、console 和“系统”混成角色的问题。
- [x] 比较“按责任角色”与“按组件/仓库列角色”的方案。
- [x] 形成角色说明表和权限矩阵。
- [x] 判断复杂度：角色有限，单表足够。
- [x] 形成回填草稿并自检。

## 2. 本步输入

- `00_req_step_02_position_boundary.md`、`00_req_step_03_problem_context.md`、`00_req_step_04_goals_non_goals.md`
- `projects/L1-workspace/00-需求文档.md`、`projects/L1-workspace/01-架构设计.md`
- `draft/02_功能推演.md`、L4 旧 README/00（仅污染审计）

## 3. SOP 问题回答

1. 本仓有哪些主要角色？

   主要人类角色为归档请求发起者、恢复申请者、归档/合规审计者和 Archive 运维者。主要系统角色为归档触发方、各 owning domain source provider、治理决定 provider、存储/签名 adapter、恢复接收方、Archive worker 和下游只读 consumer。

2. 哪些是人类角色，哪些是系统角色？

   人类角色负责提出请求、审阅材料、执行受控运维或发起恢复申请；系统角色提供正式 snapshot/export/ref、decision、存储/验证能力，或接收 owner-specific handoff。系统角色不因提供输入就转移真相所有权。

3. 各角色在什么场景下接触本仓？

   请求发起者提交归档或恢复申请；审计者查看 manifest、来源、完整性、生命周期执行和 handoff 结果；运维者处理迁移、取回、重试、补偿和对账；owner provider 响应 source capture 或 restore；下游 consumer 只读消费验证结果和安全引用。

4. 是否需要管理、审计或维护类角色？

   需要。归档与恢复涉及高风险处置和外部副作用，必须区分普通查看、请求发起、运维执行、审计查看和 owner 接收。具体授权模型由正式治理/安全 owner 提供，Archive 不自行发明身份或授权规则。

5. 是否需要进一步权限矩阵？

   需要需求层的能力级矩阵，以证明“谁可请求/查看/执行/接收”；不在本步定义认证、token、policy DSL 或 API scope。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| 旧 00 §109~§127 | 只列 Owner/Admin、Auditor、系统，未区分恢复操作者、运维者和 owner receiver | 无法表达 handoff 与高风险执行边界 |
| README §43~§54 | 以仓库名/产品名代替角色 | 把依赖关系误写成用户角色 |
| 旧 00 §132~§174 | 角色表混入项目状态和 UI 操作 | 需求角色与业务/实现语义混层 |
| draft/02 §5 | seam 类别完整但仍是候选，未落能力级权限 | 后续验收无法定位责任方 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 人类角色 | Owner/Admin、Auditor、archive 运维 | 请求发起者、恢复申请者、审计者、运维者 | 按责任和风险区分 |
| 系统角色 | “系统”笼统处理归档/恢复 | trigger、source provider、decision provider、adapter、worker、receiver、consumer | 明确输入/执行/接收责任 |
| 权限表达 | 恢复可直接把项目改 active、删除由系统执行 | Archive 仅受理/验证/执行授权动作并记录；owner 决定业务提交 | 守住 no-write 与 authority 边界 |
| 授权来源 | Archive 自己推断 Owner/Admin | 正式治理/安全 owner 提供授权语境 | 不私造 auth truth |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 按责任角色 + owner receiver 分离 | 能清楚表达谁请求、谁审计、谁执行、谁接收 | 角色数量略多 | 采用 |
| B. 仅按产品用户（Owner/Admin/Auditor） | 表格短 | 无法表达 source provider、storage adapter 和 restore receiver 责任 | 不采用 |
| C. 直接以仓库/服务名当角色 | 易和依赖图对应 | 把系统关系误当权限和使用场景 | 不采用 |

## 7. 结构化中间产物

### 7.1 角色说明表

| 角色 ID | 角色 | 类型 | 主要场景 | 可执行范围 | 明确禁止 |
|---|---|---|---|---|---|
| `ROLE-AR-001` | 归档请求发起者 | 人类/受限系统 | 提交归档请求、范围和依据 | 发起 request；查看自身请求结果 | 不批准项目状态，不绕过授权 |
| `ROLE-AR-002` | 恢复申请者 | 人类/受限系统 | 提交恢复范围、目标 owner 和原因 | 发起 restore request；查看计划/结果 | 不直接写任何 owner truth |
| `ROLE-AR-003` | 归档审计者 | 人类 | 审阅 manifest、来源、完整性、生命周期执行和 handoff | 只读验证/审计材料 | 不修改 bundle 或批准治理决定 |
| `ROLE-AR-004` | Archive 运维者 | 人类/受控系统 | 迁移、取回、重试、补偿、对账 | 执行已授权维护动作 | 不改变 source truth、policy 或 owner 结果 |
| `ROLE-AR-005` | 归档触发方 | 系统 | 传递正式归档触发/变化提示 | 发送 trigger/ref | 不定义归档批准或范围真相 |
| `ROLE-AR-006` | Source owner provider | 系统 | 提供 snapshot/export/ref、版本/fence/coverage | 返回自身获准材料 | 不让 Archive 反写自身数据 |
| `ROLE-AR-007` | Governance decision provider | 系统 | 提供 retention/hold/delete/risk decision ref | 返回正式决定及有效性 | 不由 Archive 代替其作决定 |
| `ROLE-AR-008` | Storage/integrity adapter | 系统 | 存储、取回、摘要/签名验证 | 返回能力结果和 commit 状态 | 不拥有业务 retention 或成功结论 |
| `ROLE-AR-009` | Owner restore receiver | 系统 | 接收 source-specific restore material | 返回 accepted/rejected/partial/commit-unknown | 不被 Archive 代替提交业务 truth |
| `ROLE-AR-010` | Archive worker | 系统 | 执行 capture、assembly、verify、placement、restore plan | 改变 Archive local job/material state | 不跨域写 truth 或发布 restored 事实 |
| `ROLE-AR-011` | 下游只读 consumer | 系统/人类 | 消费 manifest、验证和安全 ref | 只读 | 不把 Archive 结果当业务状态 |

### 7.2 能力级权限矩阵

| 能力 | 请求发起者 | 恢复申请者 | 审计者 | 运维者 | Source provider | Governance provider | Restore receiver | Worker |
|---|---|---|---|---|---|---|---|---|
| 提交归档请求 | 请求 | — | — | 代执行已授权任务 | 提供输入 | 提供决定/ref | — | 受理 |
| 查看 manifest/验证 | 受限 | 受限 | 只读 | 只读 | 提供 source ref | 提供 decision ref | — | 生成本地状态 |
| 存储迁移/取回 | — | — | 只读 | 执行授权动作 | — | 提供 policy/hold decision | — | 执行作业 |
| 提交恢复申请 | — | 请求 | — | 代执行已授权任务 | — | 提供恢复约束 | 接收材料 | 生成计划 |
| owner handoff | — | 查看结果 | 查看结果 | 重试/补偿 | 接收自身材料 | — | 接受/拒绝/部分提交 | 记录结果 |
| 删除/销毁 | — | — | 审计 | 仅执行正式授权 | — | 提供 delete authorization | — | 受控执行并留痕 |

权限矩阵只表达能力边界，不定义认证、token、角色继承或 governance policy 语法；缺少正式授权时对应动作必须 blocked。

## 8. 回填草稿

Archive 的使用角色分为人类责任角色和系统协作角色。人类侧包括归档请求发起者、恢复申请者、归档审计者和 Archive 运维者；系统侧包括归档触发方、各 owning domain 的 Source owner provider、Governance decision provider、Storage/Integrity adapter、Owner restore receiver、Archive worker 和下游只读 consumer。角色表只说明谁以什么责任接触 Archive，不把仓际依赖、认证模型或授权真相写入本章。

Archive 只允许在正式授权和 owner 接缝下受理、验证、存储、取回与交接。审计者只读，运维者只能执行已授权维护，Source provider 只提供自身材料，Restore receiver 决定是否接受或提交业务事实；Archive worker 只能改变 Archive-owned local state，不能反写上游或发布业务 restored 事实。

## 9. 待确认事项

- 具体人类身份、授权 scope、审批链和高风险操作分级由治理/安全 owner 提供，受 `AR-UP-002/003/009` 影响。
- Restore receiver 的最终反馈枚举和认证接缝受 `AR-UP-009` 影响。

## 10. 进入下一步条件

- [x] 人类角色与系统角色已分离。
- [x] 每个角色都有接触场景和禁止范围。
- [x] 仓际依赖未被写成角色权限。
- [x] 权限矩阵没有发明认证或治理规则。
- [x] gate_status=`pass`，允许进入 Step 6。
