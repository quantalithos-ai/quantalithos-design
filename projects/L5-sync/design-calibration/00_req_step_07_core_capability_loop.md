# 00 需求 Step 7 · 核心能力闭环

> 状态：`completed`
> 前置：Step 2、Step 4、Step 6、`draft/02_功能推演.md`
> 回填章节：正式 `00` §7
> 说明：本步只定义能力成立的逻辑依赖，不定义 API 时序、实现步骤、事件传播或开发 phase。

## 1. 本步目标

回答如果没有 L5-sync，平台和本地开发工作区之间会缺少什么不可替代的结构；据此拆出可逐个停审的核心能力节点，并标出外围增强和明确越界能力。

## 2. 仓存在必要性

平台 Artifact/Workspace source、Project/Governance authority 与本地 Git/filesystem 的生命周期、权限和失败语义不同。普通 Git 工具无法表达 Project/version 选择、来源 provenance、Review Gate handoff、归档姿态或未知副作用；平台 UI 也不能安全保护用户的本地 dirty worktree。L5-sync 的不可替代作用是把两侧连接为一个有明确选择、保护、分层结果和可恢复溯源的受控入口，同时不创建新的平台 truth owner。

## 3. 核心能力闭环图

```text
显式主体 / 项目 / 版本选择与权限语境
              |
              v
正式来源绑定与本地工作副本安全初始化
              |
              v
只读观察、增量获取与本地 materialization 保护
              |
              v
冲突检测、人工决策、断点恢复与幂等探测
              |
              v
候选冻结、Review handoff 与 provenance 回链
              |
              v
可解释 status / 诊断 / 归档姿态失效处理
```

箭头表示能力成立的逻辑依赖：后一个节点不能把前一个节点缺失的 authority、来源或保护语义自行补齐。

## 4. 能力节点与停审清单

| 节点 | 能力名称 | 进入条件 | 成立/退出条件 | 当前限制 |
|---|---|---|---|---|
| `CP-SYNC-01` | 显式选择与访问语境 | principal、project、version/source、目标路径和操作意图已由用户提供 | 选择、权限、项目姿态和来源资格可解释；否则 denied/blocked/needs-action | `SYNC-UP-001~004` 未闭合，不能锁具体访问协议 |
| `CP-SYNC-02` | 来源绑定与 working-copy 初始化 | `CP-SYNC-01` verified；目标路径和 metadata 可安全检查 | source/version/target/generation/provenance 形成可回链的本地 binding；未知或既有不安全目录则停止 | `.qs-sync` schema/迁移待核验 |
| `CP-SYNC-03` | status、增量获取与 materialization | binding 有效，Git/filesystem 状态和 comparator 可验证 | status 能只读解释；pull/clone 只应用可验证增量并记录 local applied cursor；dirty/缺口时不覆盖 | comparator、source materialization、LFS/浅克隆 pending |
| `CP-SYNC-04` | 冲突保护与恢复 | source/local 状态已被观察，发现分叉、未知或中断 | 冲突可见、保留证据、等待人工决定；安全步骤可恢复；副作用 unknown 先 probe | 不自动 merge/rebase/push 或盲重试 |
| `CP-SYNC-05` | Review handoff 与 provenance | 本地候选状态经过重新检查，权限/姿态仍有效 | 候选可冻结、交给正式 Gate、记录 transport/handoff ref 和下一查询；ACK 不升格为 accepted | handoff/probe/decision contract pending |
| `CP-SYNC-06` | 结果分层、归档姿态与诊断 | 任一操作形成局部或外部结果 | status/诊断分开报告 cursor、Git、transport、handoff、decision、archive posture；失效时 fail-closed | observability/archive read surface pending |

## 5. 外围增强能力

| 能力 | 处理口径 |
|---|---|
| 批量预取/多版本比较 | 可在核心 source/permission/metadata 合同闭合后讨论，不阻塞首个安全同步闭环。 |
| GUI/Tauri/其他图形外壳 | 只是 CLI/核心能力的可选消费面，当前无产品授权，不进入核心前置。 |
| Git LFS、浅克隆、大仓优化 | 作为工具适配和性能候选，必须等待上游支持矩阵和测试 workload。 |
| 跨工作区历史浏览 | 依赖 Archive/Workspace 正式 read contract，不参与当前 materialization 成功判定。 |

## 6. 边界外能力

以下能力不属于 L5-sync 核心或外围：创建/修改 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive record；跨端 bus replay/投影协调；自动 merge/rebase/push；正式 review verdict、acceptance、signoff、evidence/report/readiness；保存外部正文或 credential。

## 7. 能力停审检查表

- [x] 每个核心节点都有明确前置和安全退出姿态。
- [x] 节点顺序覆盖选择、绑定、同步、冲突/恢复、handoff、结果分层。
- [x] 外围增强与边界外能力已分开。
- [x] 能力图没有 API、对象字段、数据库、worker 或开发 phase。
- [x] `SYNC-UP-001~010` 继续作为外部 blocker，不被本步关闭。

## 8. 回填草稿

正式 §7 使用闭环图、六节点表、外围增强和边界外能力说明。后续 Step 8~14 必须按 `CP-SYNC-01→06` 逐节点小循环；每个节点完成后进行能力级停审，再进入下一个节点。

`Step 7 gate_status = pass_with_blockers`；允许进入 Step 8，保留 `SYNC-UP-001~010`。
