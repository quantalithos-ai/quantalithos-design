# 00 需求 Step 13 · 非功能需求

> 状态：`completed`
> 前置：`00_req_step_07_core_capability_loop.md`、`00_req_step_10_business_rules.md`、`00_req_step_11_data_ownership.md`、`00_req_step_12_interfaces_dependencies.md`
> 回填章节：正式 `00` §13
> 类别：性能、可用性、安全、审计/可追溯、幂等/一致性、可观测性。

## 1. 能力级质量约束

| 能力节点 | 非功能类别 | 要求 | 判断口径/目标值 |
|---|---|---|---|
| `CP-SYNC-01` | 安全 | 选择必须基于可信 principal/project/version/source 语境，不得由 `latest`、默认分支或缓存补齐。 | 缺选择、权限或 posture 结论时无可执行正向路径；unknown fail-closed。 |
| `CP-SYNC-01` | 审计/可追溯 | 选择和权限检查必须能回指 source、scope、principal 关联和检查世代。 | 能解释“谁在何项目/版本上请求了什么”；不要求无来源时间数字。 |
| `CP-SYNC-02` | 安全 | working-copy binding、metadata 和 provenance 不得与未知或另一 source 静默重绑定。 | 每个可用 binding 都有可回链来源与失效姿态。 |
| `CP-SYNC-02` | 可用性 | 初始化/迁移失败时，用户仍能看到安全恢复或人工处理方向。 | metadata/path/permission 不明只产生 blocked/needs-action，不覆盖目录。 |
| `CP-SYNC-03` | 性能 | status、来源检查和增量 materialization 应提供可解释阶段进度，不因重复读取阻塞主链。 | 后续分别测量查询、比较、I/O 和大仓场景；当前不固定秒数/吞吐。 |
| `CP-SYNC-03` | 幂等/一致性 | 相同 source/version/cursor 在无变化时重复观察或应用不得产生相互矛盾的 local result。 | local cursor、mapping、generation 与 Git state 结果可解释；不以 LWW/默认值掩盖缺口。 |
| `CP-SYNC-04` | 可用性 | 冲突、中断、版本缺口和 unknown outcome 必须提供暂停、probe、恢复或人工审查方向。 | 不确定时保持 blocked/needs-action；不得自动副作用重放。 |
| `CP-SYNC-04` | 安全 | dirty/untracked 用户改动、冲突证据和 provenance 必须受保护。 | 负向场景中不得覆盖、stash、merge、rebase 或删除证据。 |
| `CP-SYNC-05` | 审计/可追溯 | handoff、transport ACK、probe 和 Review decision 必须独立可回链。 | 能区分 prepared/submitted/pending/unknown/decision-ref-known；ACK 不升格 accepted。 |
| `CP-SYNC-05` | 安全 | Sync 不得绕过 Review Gate 或生成 verdict/signoff。 | 正向和负向审查均保持 Governance owner 单一。 |
| `CP-SYNC-06` | 可观测性 | status/diagnostic 能显示 source、freshness、coverage、degraded/blocked reason 和 correlation。 | 摘要 redacted、bounded；日志/telemetry 不成为业务成功证据。 |
| `CP-SYNC-06` | 可用性 | 归档、撤销、source 失效和观测不可用时，核心安全边界仍可解释。 | stale/revoked/archived/unavailable 显式可见，不能 fail-open。 |

## 2. 全局非功能需求

| 非功能类别 | 要求 | 判断口径/目标值 |
|---|---|---|
| 性能 | 本地状态编排、来源检查、增量更新和 handoff 准备不应成为用户理解主流程的不可解释瓶颈。 | 后续基于权威 workload 分别量化 P95/P99、规模、带宽、并发和恢复时限；当前不承诺数字。 |
| 可用性 | 上游 owner 暂不可用、网络断线、Git/filesystem 能力缺失或冲突时仍给出安全状态和下一步。 | 允许 blocked/pending/unknown/unsupported；不以降级为成功。 |
| 安全 | 不得越权拥有 Project、Artifact、Baseline、Review、Workspace、Archive、Git remote truth 或敏感正文。 | 依赖、数据和一票否决项均能证明 owner 单一；unknown fail-closed。 |
| 审计/可追溯 | 选择、binding、materialization、冲突、恢复、handoff 和姿态变化可回链。 | 每个关键 local result 有 source/correlation/provenance 关联；不声称正式 audit/evidence。 |
| 幂等/一致性 | source cursor、local cursor、Git 状态、handoff outcome 和 Review decision 不得混为单一状态。 | 重复请求、重连和刷新不会隐式改变 owner truth；unknown outcome 保持可见。 |
| 可观测性 | 本地异常和安全边界可形成低敏、有限诊断材料。 | 不含 credential/raw body/私钥；observability 失效不改变业务结果。 |

## 3. 历史数字和方案处理

旧材料的固定可用性、吞吐、延迟、大仓、LFS、浅克隆和 GUI 数字/选择没有当前权威 workload 或产品授权。本需求不继承这些数字或方案；后续只有在 SDK、Git/filesystem 支持矩阵、环境和测试 authority 闭合后，才可在对应文档量化。

## 4. 取舍与回填草稿

正式 §13 采用能力级 + 全局两层表；不写数据库、缓存、日志平台、重试算法、加密算法、监控配置或测试脚本。

## 5. 自检与门禁

- [x] 六类非功能类别均已检查并给出要求与判断口径。
- [x] 安全、审计、幂等和可观测性要求未滑入实现方案。
- [x] 所有无来源数字保持后置，不伪造目标值。
- [x] 能力级质量要求能回指 `CP-SYNC-01~06`。

`Step 13 gate_status = pass_with_blockers`；允许进入 Step 14，保留 `SYNC-UP-001~010`。
