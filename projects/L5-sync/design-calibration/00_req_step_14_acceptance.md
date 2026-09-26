# 00 需求 Step 14 · 验收标准

> 状态：`completed`
> 前置：Step 7、9、10、11、13
> 回填章节：正式 `00` §14
> 说明：本步定义未来可判断的验收条件，不声明已有实现、测试、run、artifact、report、evidence、verdict、signoff 或 readiness。

## 1. 核心能力与功能验收

| 验收类别 | 验收 ID | 验收项 | 通过条件 | 失败/禁止条件 |
|---|---|---|---|---|
| 核心能力闭环 | `AC-SYNC-001` | 显式选择与访问语境 | 每次操作都能说明 principal、project、version/source、target、operation 和权限/姿态结果。 | 缺失、过期、不可见或冲突时仍继续 materialize/handoff。 |
| 核心能力闭环 | `AC-SYNC-002` | 来源绑定与初始化 | working copy、source/version、generation、metadata/provenance 形成可回链 binding。 | 目录、metadata 或 source 不明时静默初始化、重绑或覆盖。 |
| 核心能力闭环 | `AC-SYNC-003` | status 与增量 materialization | status 只读分层显示 source/local cursor、Git/fs、metadata、冲突、恢复和 handoff；增量结果可解释。 | status 隐式写入或 pull 在 comparator/gap/dirty 未知时继续。 |
| 核心能力闭环 | `AC-SYNC-004` | 冲突与恢复 | 冲突影响、来源和证据可见；unknown outcome 先 probe；安全 checkpoint 可恢复或进入人工处理。 | 自动 merge/rebase/push、盲重试、覆盖用户改动或删除冲突证据。 |
| 核心能力闭环 | `AC-SYNC-005` | Review handoff | 明确准备的本地候选可交给正式 Review Gate，并能回链 handoff/transport 状态。 | 本地 commit、上传 ACK、远端对象或 HTTP 200 被显示为 accepted/approved/signoff。 |
| 核心能力闭环 | `AC-SYNC-006` | 结果分层与姿态失效 | cursor、Git 状态、transport、handoff、Review decision、archive posture 和诊断互不混淆；撤销/归档 fail-closed。 | 旧缓存、日志、空结果或本地状态覆盖 owner 结论。 |
| 功能能力 | `AC-SYNC-007` | `FR-SYNC-001~004` 选择/绑定/metadata | 选择、权限、来源、目标和 metadata 失败均有 blocked/needs-action 结果。 | 猜测上下文、静默迁移或伪造 provenance。 |
| 功能能力 | `AC-SYNC-008` | `FR-SYNC-005~008` status/pull/冲突/恢复 | 查询 no-write；可验证增量受 dirty/conflict/gap 保护；恢复可探测。 | query 推进状态或未知副作用被自动重放。 |
| 功能能力 | `AC-SYNC-009` | `FR-SYNC-009~012` handoff/诊断 | 候选冻结、外部 handoff、ACK/probe/decision、redacted diagnostic 分层可见。 | Sync 生成 Review verdict、evidence/report 或接受结论。 |

## 2. 规则/边界与数据归属验收

| 验收类别 | 验收 ID | 验收项 | 验收条件 |
|---|---|---|---|
| 规则/边界 | `AC-SYNC-010` | owner 单一与禁止越界 | Sync 不创建/修改 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive 或 Git remote truth。 |
| 规则/边界 | `AC-SYNC-011` | 本地修改保护 | dirty/untracked/路径风险、source 分叉和 metadata 不一致均不会被覆盖或自动解决。 |
| 规则/边界 | `AC-SYNC-012` | Git 工具安全边界 | Git/filesystem adapter 仅承担受限观察/I/O；merge/rebase/push 不成为默认或隐式动作。 |
| 数据归属 | `AC-SYNC-013` | Sync-local truth | session、binding、cursor、mapping、conflict、checkpoint、handoff attempt 和 provenance 只解释本地操作。 |
| 数据归属 | `AC-SYNC-014` | snapshot/ref/forbidden body | owner snapshot 带来源/freshness；外部 truth 只保留安全 ref；不得保存正文、secret、credential、raw output 或正式 evidence/report。 |

## 3. 非功能验收

| 验收类别 | 验收 ID | 通过条件 | 当前不固定项 |
|---|---|---|---|
| 非功能 | `AC-SYNC-015` 性能 | 选择、来源检查、status、增量、恢复和 handoff 准备有可解释进度，不成为不可解释主链瓶颈。 | P95/P99、吞吐、仓规模、带宽和并发需权威 workload。 |
| 非功能 | `AC-SYNC-016` 可用性 | owner/网络/Git/fs 失效、冲突或归档姿态变化时提供 blocked/pending/unknown/manual action。 | 恢复时限和平台覆盖率后置。 |
| 非功能 | `AC-SYNC-017` 安全 | 无越权 truth、隐式版本、私有 seam、敏感正文泄露；unknown fail-closed。 | 具体算法、加密和工具版本后置。 |
| 非功能 | `AC-SYNC-018` 审计/可追溯 | 选择、binding、materialize、冲突、恢复、handoff 和姿态变化可回指 source/correlation/provenance。 | 正式 audit/evidence owner 指标后置。 |
| 非功能 | `AC-SYNC-019` 幂等/一致性 | 重复、重连、probe 和刷新不混淆 cursor/Git/transport/decision，也不隐式改变 owner truth。 | 重试窗口、锁和存储 TTL 后置。 |
| 非功能 | `AC-SYNC-020` 可观测性 | 安全诊断 redacted/bounded；telemetry 不决定业务成功。 | exporter、采样和 retention 后置。 |

## 4. 一票否决项

- `VETO-SYNC-001`：存在自动 merge、rebase、push、stash、覆盖用户未提交修改或盲目重放未知副作用。
- `VETO-SYNC-002`：把本地 Git commit、上传 ACK、HTTP 200、remote object、日志或 cache 当作 Artifact/Baseline/Review accepted/approved/signoff。
- `VETO-SYNC-003`：Sync 创建、修改或伪造 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive 或 Git remote truth。
- `VETO-SYNC-004`：metadata/provenance、冲突证据、credential 或外部正文被删除、伪造、泄露或静默重绑定。
- `VETO-SYNC-005`：权限、归档、来源或版本 comparator unknown 时仍执行危险 materialization/handoff。

## 5. 证据边界与自检

未来测试可验证上述条件，但本 Step 不生成或暗示测试结果、artifact、report、evidence、verdict、signoff 或 readiness。上游 blocker 保持 `blocked/pending`，不能由 fake/fixture/ACK 关闭。

- [x] 六个核心能力均有验收项。
- [x] 功能、规则、数据和六类 NFR 均有承接。
- [x] 一票否决项覆盖所有硬禁止。
- [x] 没有测试步骤、实现细节或伪造证据。

`Step 14 gate_status = pass_with_blockers`；允许进入 Step 15。
