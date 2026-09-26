# 00 需求 Step 4 · 目标与非目标

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_03_problem_context.md`
> 回填章节：正式 `00` §4

## 1. 本步目标

把 L5-sync 的需求范围收敛为可验证的外部结果，并明确相关但不属于当前仓或当前阶段的内容。

## 2. 目标表

| ID | 目标 | 判断口径 |
|---|---|---|
| `G-SYNC-001` | 同步操作始终绑定用户显式选择的 project、version/source 和本地目标。 | 缺少任一选择或绑定失效时，操作保持 blocked/needs-action，不从目录、分支或缓存猜测。 |
| `G-SYNC-002` | principal、项目姿态、权限和来源资格在进入 materialization/handoff 前可被解释。 | 认证/权限/归档/来源结论未知时不继续产生危险副作用。 |
| `G-SYNC-003` | 本地 working copy 的初始化、status、增量 pull 和 provenance 具有可追溯的局部结果。 | 能区分 source cursor、local applied cursor、Git 状态、metadata generation 和操作结果；不把它们合并成一个成功值。 |
| `G-SYNC-004` | 用户未提交修改、来源分叉、映射冲突和 metadata 不一致得到显式保护。 | 冲突可见、可暂停、可恢复并等待人工决定；不覆盖 dirty worktree。 |
| `G-SYNC-005` | `push-review` 只形成正式 Review handoff，不绕过 Review Gate。 | 上传/提交 ACK、远端对象存在或本地 commit 均不能单独显示 accepted/approved/signoff。 |
| `G-SYNC-006` | 外部调用中断或 outcome unknown 时可安全探测和恢复。 | 重试前有 probe/幂等关联；无法证明等价时保持 blocked/needs-action。 |
| `G-SYNC-007` | 归档姿态、权限撤销和 provenance 失效会收紧本地可执行范围。 | 失效/撤销/归档项目不能凭旧缓存继续 materialize 或 handoff；来源关联不被静默删除或伪造。 |
| `G-SYNC-008` | Git/filesystem 工具适配不改变平台 truth。 | adapter 只观察和执行受限本地 I/O；merge/rebase/push 不自动发生。 |

## 3. 非目标表

| ID | 非目标 | 归属/理由 |
|---|---|---|
| `NG-SYNC-001` | 拥有或修改 Project、ProjectMember、Artifact、Baseline、Review Gate、Workspace projection 或 Archive。 | 分别由 L1-work、L1-artifact、L1-governance、L1-workspace、L4-archive 负责。 |
| `NG-SYNC-002` | 把本地 Git commit、remote branch、上传 ACK 或 HTTP 成功当作平台 Artifact/Baseline/Review truth。 | 这些只是本地或传输观察结果。 |
| `NG-SYNC-003` | 自动 merge、rebase、push、stash、覆盖用户未提交修改或替用户做冲突决定。 | 冲突和副作用决策必须显式、人工或由正式 owner 处理。 |
| `NG-SYNC-004` | 作为跨 chat/console/runner 的统一同步协调器、bus delivery/replay owner 或 Workspace read-model owner。 | 超出本仓窄域，且会制造第二套跨端 truth。 |
| `NG-SYNC-005` | 在需求阶段锁定 Rust/Tauri、Git LFS、浅克隆、数据库、固定 metadata 文件布局或性能/SLA 数字。 | 当前没有足够 authority；后续架构/配置/测试阶段另行核验。 |
| `NG-SYNC-006` | 保存 Artifact/Workspace/Review/Archive/raw Git/credential/provenance 正文或敏感 secret。 | Sync 只保存必要引用、快照和受控 local metadata。 |
| `NG-SYNC-007` | 生成正式 review verdict、acceptance、signoff、evidence、report 或 readiness。 | 这些属于治理/观测/验收 owner；本轮不伪造。 |

## 4. 范围收束与取舍

当前需求主链聚焦“显式选择与权限 → 来源绑定与本地初始化 → status/pull 与冲突保护 → push-review handoff → 恢复/溯源”。批量预取、多工作区比较、归档浏览和 GUI 体验可作为外围方向，但不阻塞核心闭环；LFS、浅克隆和 GUI 仅登记为待核验选择。

## 5. 回填草稿与自检

正式 §4 只回填目标表、非目标表和范围收束文字；不加入内部功能编号、API 或实现路径。

- [x] 每个目标都有可判断口径。
- [x] 非目标具体指出 owner 或后置阶段。
- [x] 没有无来源数字、技术方案或实现承诺。
- [x] 目标与 Step 2/3 的边界和问题一致。

`Step 4 gate_status = pass`；允许进入 Step 5。
