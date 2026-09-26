# Step 2. 明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2。
> 回填章节：未来正式 `projects/L5-sync/05-测试方案.md` §2。
> 状态：`completed / stop_review`；本步只收敛测试范围，不创建执行资产。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 2 / scope |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 正式 05 写入 | 仍关闭；仅允许 Step 15 装配 |
| 实现 / 测试执行 / commit | `false / false / false` |
| 直接下一步 | Step 3：抽取测试对象与测试切口 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §5～§16 | CP、FR、BR、AC、VETO、NFR 和外围能力优先级 |
| `01-架构设计.md` | Sync local truth 与 Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote 的 ownership boundary |
| `02-概要设计.md` | 五个 capability part、主流程、状态和异常范围 |
| `03-详细设计.md` §2、§5～§15 | 29 objects、public protocol、flow、state、UoW、错误、配置、观测和最小 test cuts |
| `04-配置设计.md` §2、§6、§9～§12 | P0 profile、strict source、activation、redaction、failure 和下游 handoff |
| `03_ddd_step_16_test_cuts.md` | 设计级 P0 切口及 evidence ceiling |
| `04_config_step_12_downstream_handoff.md` / `04_config_step_14_risks_open_questions.md` | 配置测试承接、VETO、blocker 与未来触发器 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 测试要证明什么？ | 证明 explicit selection/access、binding/metadata、status/pull、conflict/recovery、review handoff/provenance 和安全观测的 local contract 闭合；不能证明外部 owner 已接受或远端 truth 已改变。 |
| P0 的边界是什么？ | CP-SYNC-01～06 的本地不变量、10 Command、13 Query、3 Consumer、3 Job 的 protocol/flow 负向与可控 fake 入口、17 状态、UoW/幂等/恢复、42 配置 leaf 的解析与 fail-closed、redaction 和 dependency boundary。 |
| P1 的边界是什么？ | 真实 SDK/source/access/review/probe、metadata driver、Git/filesystem tool 的 contract/integration-like 接缝；全部受 blocker 和正式 fixture 限制。 |
| P2 的边界是什么？ | 批量预取、结果比较、归档引用消费、性能容量、LFS/浅克隆/GUI/Tauri 等外围或尚未核验选择。 |
| 哪些绝不能进入范围？ | Sync 不创建/修改外部 truth；不自动 merge/rebase/push/stash；不覆盖 dirty worktree；不把 commit、ACK、cache、telemetry、job report 当 Artifact/Baseline/accepted/evidence/readiness。 |
| 如何处理未闭合依赖？ | local unit/contract/flow/fault 可定义为 planned；正向 owner/Git/fs/physical metadata 集成固定为 `blocked/waiting`，不以 fake 伪造通过。 |

## 4. 旧材料诊断

| 旧材料倾向 | 当前诊断 | 处置 |
|---|---|---|
| 把同步视为跨端统一任务或 `SyncTask` 生命周期 | 与 03 的五个 capability part、local-only state 和 17 个状态主语冲突 | 降为 `historical_material`，不进入 P0 对象 |
| 把 Git remote、commit 或上传结果当平台状态 | 违反 00/01 的 truth ownership 和 VETO-SYNC-002/003 | 只测试 typed observation / handoff layer separation |
| 预设 Rust/Tauri、LFS、浅克隆、固定性能数值 | 当前上游没有权威支持矩阵或 workload | P2/pending，不能成为当前 exit gate |
| 以 E2E 或真实服务覆盖全部风险 | 会掩盖状态、UoW、zero-write 和 redaction 缺陷 | 先在 unit/application/controlled seam 发现问题，E2E 只做最小汇总 |
| 用报告或 ACK 关闭 blocker | 违反 evidence ceiling | 保留 blocker 原样，报告只可作为计划输出 |

## 5. 改动前后对比

| 维度 | 改动前（历史/未校准） | 改动后（05 口径） |
|---|---|---|
| 测试主线 | 模糊的 clone/sync/push 流程 | CP1～CP5 local truth 加 CP6 result/provenance boundary |
| 优先级 | 以“能跑通”为中心 | P0 local safety/contract，P1 external seams，P2 future enhancements |
| 成功语义 | 可能使用 success/accepted | 使用 typed disposition；local completed 不等 owner accepted |
| 外部集成 | 默认可执行 | 正向集成按 owner/tool/store contract 分别 blocked/waiting |
| 非功能 | 固定性能/工具选择 | 安全、可追溯、可用、幂等、可观测先行；数字留给权威 workload |
| 证据 | 旧路径或 latest | 仅计划 `artifacts/test/<run_id>/` 与 `reports/runs/<run_id>/`、`reports/acceptance/` |

## 6. 测试设计取舍

1. P0 采用“底层不变量先行”：状态、typed ref、canonical digest、UoW write-set、Query zero-write、redaction 和 forbidden-effect spy 不等待真实 SDK/Git。
2. P1 只验证适配器接缝和错误归一；没有 exact owner schema、physical metadata semantics 或工具支持矩阵时不构造正向案例。
3. `status` 的“可见”与“健康/授权/accepted”分开；缺失、不可见、stale、blocked、unknown、partial 都必须成为可断言结果。
4. 对归档项目只测试姿态读取和 fail-closed handoff/materialize；不把 archive package 或 restore 变成 Sync 的测试对象。

## 7. 结构化中间产物

### 7.1 P0/P1/P2 范围矩阵

| 能力 | P0 | P1 | P2 |
|---|---|---|---|
| explicit selection/access | exact selector、owner snapshot/ref、unknown fail-closed | 真实 identity/work owner read | 批量选择优化 |
| binding/metadata | logical generation、provenance、migration/rebind guards | `.qs-sync` physical store/driver | 高级迁移/压缩 |
| clone/pull/status | plan/path safety、cursor/finalize、query no-write | source/Git/fs adapter | 性能、预取 |
| conflict/recovery | conflict fact、checkpoint、manual resolution、probe no replay | 真实 tool/effect equivalence | 自动化辅助 UI（不改变红线） |
| push-review | candidate/attempt/transport/probe/Decision 分层 | Governance/SDK handoff | 多结果比较 |
| configuration | strict JSON、42 leaf、4 profile、redaction、activation/failure | config center/secret backend（若定义） | hot reload/online override（当前非范围） |
| evidence | ID/path/schema 计划和上限 | 受控 integration report | acceptance/readiness（属于 06） |

### 7.2 设计级一票否决映射

| VETO | 05 范围内的阻断方向 |
|---|---|
| `VETO-SYNC-001` | 自动 merge/rebase/push/stash、dirty overwrite 或 blind replay 的任一调用/状态转移都必须被负向切口捕获。 |
| `VETO-SYNC-002` | local commit、ACK、HTTP 200、remote object、log/cache 不得映射为 Artifact/Baseline/accepted/approved/signoff/readiness。 |
| `VETO-SYNC-003` | 外部 truth 的 create/update/delete port 不属于 Sync 测试 graph；依赖扫描和 forbidden adapter spy 必须阻断。 |
| `VETO-SYNC-004` | provenance/冲突证据不可删除或伪造；raw body/credential/path/output 不出现在 public carrier 或计划证据。 |
| `VETO-SYNC-005` | owner/access/source/comparator unknown 时，危险 materialize/handoff 必须进入 blocked/needs-action/manual。 |

## 8. 回填草稿（未来正式 §2）

本测试方案范围覆盖 CP-SYNC-01～06 的 local contract、10 个 Command、13 个 zero-write Query、3 个 planned Consumer、3 个 Job、17 个状态主语、UoW/幂等/恢复、配置验证和 redaction。P0 不依赖真实外部服务；P1 仅在 exact owner/tool/store contract 和 fixture 可构造后验证正向接缝；P2 保留外围能力和未核验工具选择。Project、Artifact、Baseline、Review Gate、Workspace projection、Archive、Git remote truth 以及验收裁决不属于 Sync 的测试所有权。

## 9. 待确认事项

| 事项 | 当前处理 |
|---|---|
| AC/VETO 是否在 06 重新编号 | 05 继续引用 00 的 ID，06 负责最终消费和裁决。 |
| SDK/source/review exact contract | P1 blocked/waiting；不得写 provider DTO 或 endpoint。 |
| physical `.qs-sync` schema | 只测试 logical seam；physical contract 关闭前不产出 repository pass。 |
| Git LFS/浅克隆/GUI | `SYNC-UP-009` historical/pending，不进入 P0/P1 gate。 |
| 性能阈值 | 不填数字；待权威 workload 与 07/运维约束。 |

## 10. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| P0/P1/P2 目标和范围可追溯到 00～04 | pass |
| 非范围覆盖所有 ownership/VETO 红线 | pass |
| 未把外部 capability、工具或性能承诺写成事实 | pass_with_upstream_blockers |
| 旧材料仅作 historical diagnosis | pass |
| 未创建测试代码、fixture、artifact、report、evidence | pass |
| 允许进入 Step 3 | pass |

## 11. 下一步门禁

Step 3 只能从本步 P0/P1/P2 范围抽取 29 个对象、10 Command、13 Query、3 Consumer、3 Job、17 状态和横切 carrier；不得新增 scope 外的 truth owner。若对象抽取需要新增字段、状态、port、error 或配置 leaf，必须记录 design-change-required 并暂停相关切口。
