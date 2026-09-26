# L5-sync 01 架构设计校准流程

> 模式：`full-restart + single-agent-serial`；当前文档：`01-架构设计.md`。
> 正式 `00-需求文档.md` 已完成并处于 `formal_stop_review`；本流程只在用户“继续完成全部 01”授权范围内推进架构 Step 1→16，完成正式 01 后立即停审，不进入 02。
> 当前 agent 独立完成全部阅读、分析、写入和审计；不创建、调用或委派任何 sub-agent、worker、team 或并行代理。

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 架构设计讨论 SOP | `standards/document/架构设计讨论流程_SOP.md` |
| 架构设计书写规范 | `standards/document/架构设计书写规范.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 真相源闭环与可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` |
| 全局依赖关系与裁剪规则 | `standards/document/全局项目依赖关系与裁剪规则.md` |
| 当前需求基线 | `projects/L5-sync/00-需求文档.md` |
| 当前项目执行台账 | `projects/L5-sync/design-calibration/project_execution_ledger.md` |
| 历史材料 | `projects/L5-sync/README.md`、旧正式 01、旧 draft；仅作 `historical_material` |

## 二、状态总览与总流程计划

| Step | 主题 | 输入 | 输出文件 | 回填章节 | 状态 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|
| 1 | 确认需求基线 | 正式 00、上游边界、全局规则 | `01_arch_step_01_requirements_baseline.md` | §1 / §3 / §16 | done | pass_with_upstream_blockers | 进入 Step 2 |
| 2 | 明确架构目标与约束 | Step 1、上游约束 | `01_arch_step_02_arch_goals_constraints.md` | §2 / §3 | done | pass_with_upstream_blockers | 进入 Step 3 |
| 3 | 职责边界 | Step 1~2 | `01_arch_step_03_responsibility_boundary.md` | §4 | done | pass_with_upstream_blockers | 进入 Step 4 |
| 4 | 系统边界与上下文 | Step 1~3、专项上游 | `01_arch_step_04_system_context.md` | §5 | done | pass_with_upstream_blockers | 进入 Step 5 |
| 5 | 限界上下文与子域划分 | Step 3~4 | `01_arch_step_05_bounded_context.md` | §6 | done | pass_with_upstream_blockers | 进入 Step 6 |
| 6 | 容器 / 部署架构 | Step 4~5 | `01_arch_step_06_container_deployment.md` | §7 | done | pass_with_upstream_blockers | 进入 Step 7 |
| 7 | 依赖方向与层间约束 | Step 5~6、全局依赖规则 | `01_arch_step_07_dependency_direction.md` | §8 | done | pass_with_upstream_blockers | 进入 Step 8 |
| 8 | 数据所有权与一致性策略 | Step 3、5、7 | `01_arch_step_08_data_ownership_consistency.md` | §9 | done | pass_with_upstream_blockers | 进入 Step 9 |
| 9 | 关键交互与通信方式 | Step 4、6、8 | `01_arch_step_09_interactions_communication.md` | §10 | done | pass_with_upstream_blockers | 进入 Step 10 |
| 10 | 关键技术选型 | Step 2、7~9 | `01_arch_step_10_technology_choices.md` | §11 | done | pass_with_upstream_blockers | 进入 Step 11 |
| 11 | 备选方案与取舍 | Step 2、10 | `01_arch_step_11_alternatives_tradeoffs.md` | §12 | done | pass_with_upstream_blockers | 进入 Step 12 |
| 12 | 横切关注点 | Step 2、7~10 | `01_arch_step_12_cross_cutting.md` | §13 | done | pass_with_upstream_blockers | 进入 Step 13 |
| 13 | 演进路线 | Step 10~12、blocker | `01_arch_step_13_evolution_roadmap.md` | §14 | done | pass_with_upstream_blockers | 进入 Step 14 |
| 14 | 风险与待确认事项 | Step 1~13、上游台账 | `01_arch_step_14_risks_open_questions.md` | §15 | done | pass_with_upstream_blockers | 进入 Step 15 |
| 15 | ADR 与需求追溯 | Step 1~14 | `01_arch_step_15_adr_traceability.md` | §16 / §17 | done | pass_with_upstream_blockers | 进入 Step 16 |
| 16 | 整理正式文档 | Step 1~15 | `01_arch_step_16_formal_assembly.md` | 全文 §1~§18 | done | formal_stop_review | 等待用户明确授权 02 |

## 三、本轮架构目标

1. 把 `L5-sync` 收敛为平台与本地开发工作区之间的受控同步入口，而不是任何业务真相仓。
2. 将显式选择、权限检查、来源绑定、working-copy 保护、增量 materialization、冲突恢复和 review handoff 组织成可审计的架构边界。
3. 按架构单元逐个闭合职责、依赖、数据、通信、横切和追溯；未闭合的上游合同继续保持 `pending/blocked`。
4. 只在 Step 5 之后逐步接近可落码的结构边界；本轮不写实现、测试结果、implementation ledger 或 boundary skeleton。

## 四、执行纪律

- 每个 Step 必须按 `问题回答 → 历史污染诊断 → 设计取舍 → 结构化产物 → 回填草稿 → 自检 → 更新台账` 独立完成。
- 未来 Step 文件只能在进入该 Step 时创建或改写；flow 可以预列总流程计划，但不预写未来文件。
- 正式章节必须引用具体 calibration 文件；正文只承载收口结论，不搬入过程记录。
- `SYNC-UP-001~010` 贯穿架构全流程；上游未闭合合同只能标为 `pending/blocked`，不得用缓存、ACK、fixture、日志或历史材料关闭。
- Git LFS、浅克隆、GUI/Tauri、固定性能数字和具体协议 schema 只有在当前上游正式合同支持时才可进入正式结论；否则留在风险或历史污染审计。
- 完成 Step 16 后 flow 状态改为 `formal_stop_review`；下一动作只能等待用户对 02 的明确授权。

## 五、上游与历史材料边界

| 来源 | 本轮用途 | 当前限制 |
|---|---|---|
| `projects/L5-sync/00-需求文档.md` | 直接需求基线 | 需求结论不等于接口 schema 或实现事实 |
| `projects/L0-sdk/01-架构设计.md` | SDK 编译期 / 运行期边界线索 | 精确 surface、错误与版本兼容仍受 `SYNC-UP-001` 约束 |
| `projects/L1-identity/01-架构设计.md` | principal / identity 语境来源 | 不把身份真相或认证裁决转移给 Sync |
| `projects/L1-work/01-架构设计.md` | Project / ProjectMember / posture owner | 权限与归档动作矩阵仍受 `SYNC-UP-003` 约束 |
| `projects/L1-governance/01-架构设计.md` | Review Gate / Decision 边界 | handoff、ACK、probe、decision ref 未闭合 |
| `projects/L1-artifact/01-架构设计.md` | Artifact / version / lineage / baseline owner | materialization source 与版本水位仍受 `SYNC-UP-002` 约束 |
| `projects/L1-workspace/01-架构设计.md` | Workspace projection / view 边界 | 不把本地 working copy 写成 Workspace projection |
| `projects/L4-archive/01-架构设计.md` | archive posture / restore boundary | 不拥有归档真相；archive 关系仍需正式读取确认 |
| `projects/L4-observability/01-架构设计.md` | telemetry / audit / redaction 边界 | 观测不决定业务成功，不成为 Sync truth |
| `README.md`、旧正式 01、旧 draft | `historical_material` 污染诊断 | 不直接继承 Rust/Tauri、LFS、浅克隆、旧 RPC、固定 metadata 方案 |

## 六、持续 blocker

`SYNC-UP-001~010` 详见项目台账，并已在 Step 14 按架构影响收口。架构文档没有把任何 blocker 写成已闭合事实。

## 七、当前恢复点

```text
current_document = 01-架构设计.md
current_step = 16
current_module = formal_assembly_completed_stop_review
gate_status = formal_stop_review
next_allowed_action = wait_for_user_confirmation_before_02
formal_00_status = formal / stop_review
formal_01_status = formal / stop_review
formal_01_write_allowed = completed / closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
