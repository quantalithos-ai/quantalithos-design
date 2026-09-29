# L4-archive 05 测试方案校准流程

> 创建日期：2026-09-13；模式：`full-restart / single-agent-serial`。
> 用户授权：连续完成正式 05 Step 1～15；正式 05 完成后立即停审，不进入 06。
> 当前恢复点：Step 15 已完成；正式 `05-测试方案.md` 已装配并停审。旧文件仅作 `historical_material`；等待用户审查和新的明确 06 授权。

## 1. 本轮目标与事实边界

依据测试方案 SOP，将已停审的正式 00～04、详细设计测试切口和配置下游承接转译为可执行、可追溯、可留证的正式测试设计。正式 `05-测试方案.md` 只能在 Step 15 由 Step 1～14 的已完成中间产物装配；此前不得回填正式正文。

本轮只修改 `projects/L4-archive/` 下设计文档、校准材料和项目台账；不实现测试或脚本，不创建目标实现仓，不执行项目测试，不生成真实 `run_id`、bundle、digest、artifact、report、evidence、verdict、risk acceptance、signoff 或 readiness，不提交 commit。

## 2. 权威输入与历史材料

| 输入 | 状态 | 使用方式 |
|---|---|---|
| 正式 `00-需求文档.md`～`04-配置设计.md` | `formal / stop_review` | 需求、边界、对象、协议、状态、事务、错误、配置和验证上限的唯一项目内输入 |
| `03_ddd_step_16_test_cuts.md` | completed | 6 crates、26 对象、8 services、30/32 入口、18 状态、8 source classes 的最小测试入口 |
| `04_config_step_12_downstream_handoff.md`、Step 14/15 | completed | 12 配置域、55 P0 配置项、失败姿态、05 承接和 blocker |
| 测试方案 SOP / 书写规范及通用标准 | current | Step 顺序、正式 15 章、三层门禁、证据真实性和依赖裁剪 |
| L1-governance、L1-artifact、L1-workspace 正式 05 与 calibration | 参考 | 只借鉴粒度、矩阵和审计方式，不复制领域主语、数量或产品假设 |
| 旧 `05-测试方案.md`、旧 `06-验收标准.md`、README、draft | historical material | 只作污染诊断；旧对象、固定供应商/期限/性能/digest/成功口径不得继承 |

## 3. 总流程计划与状态台账

| Step | 主题 | 输出文件 | 主要产物 | 状态 | 下一许可 |
|---:|---|---|---|---|---|
| 1 | 测试输入边界 | `05_test_plan_step_01_input_boundary.md` | 输入映射、必须/不再回答、缺口姿态 | completed / pass_with_upstream_blockers | Step 2 已允许 |
| 2 | 目标、范围和非范围 | `05_test_plan_step_02_scope.md` | 优先级×执行状态、范围和一票否决 | completed / pass_with_required_blocked_positive_lanes | Step 3 已允许 |
| 3 | 测试对象与切口 | `05_test_plan_step_03_test_objects_cuts.md` | 对象/协议/状态/一致性/配置切口 | completed / pass_with_blocked_real_seams | Step 4 已允许 |
| 4 | 策略与分层 | `05_test_plan_step_04_strategy_layers.md` | 测试分层图、首要发现层 | completed / real_seam_blocked | Step 5 已允许 |
| 5 | 追溯与覆盖 | `05_test_plan_step_05_traceability_coverage.md` | FR/BR/NFR/VETO→CUT/TC/EV | completed / pass_with_blocked_positive_lanes | Step 6 已允许 |
| 6 | 场景与用例 | `05_test_plan_step_06_cases.md` | 可执行用例、逐切口停审、phase 审计 | completed / pass_with_blocked_positive_lanes | Step 7 已允许 |
| 7 | 测试数据 | `05_test_plan_step_07_test_data.md` | fixture/builder/seed、隔离和清理 | completed / data_planned_with_formal_vector_blockers | Step 8 已允许 |
| 8 | 环境与配置 | `05_test_plan_step_08_environment_config.md` | 环境拓扑、依赖分类、55-key 覆盖 | completed / environments_located_with_real_seams_blocked | Step 9 已允许 |
| 9 | 自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | suite/gate/script/output 计划 | completed / automation_planned_real_seam_gate_blocked | Step 10 已允许 |
| 10 | 专项与非功能 | `05_test_plan_step_10_nonfunctional.md` | 安全、一致性、恢复、容量、观测专项 | completed / qualitative_closed_numeric_and_real_seams_blocked | Step 11 已允许 |
| 11 | 缺陷与复验 | `05_test_plan_step_11_defects_retest.md` | S/A/B/R 分级、复验和关闭证据 | completed / executable | Step 12 已允许 |
| 12 | 进入/退出准则 | `05_test_plan_step_12_entry_exit.md` | 分层 entry/exit/pause/VETO | completed / execution_not_entered_formal_blocked | Step 13 已允许 |
| 13 | 报告与证据 | `05_test_plan_step_13_evidence.md` | machine schema、路径、真实性审计 | completed / planned_evidence_schema_closed_no_instances | Step 14 已允许 |
| 14 | 回归与残余风险 | `05_test_plan_step_14_regression_risks.md` | 变更触发、全量回归、blocker | completed / pass_with_blocked_formal_lanes | Step 15 已授权 |
| 15 | 正式文档装配 | `05_test_plan_step_15_formal_document_assembly.md` | 重建正式 05、静态总审计、停审 | completed / formal_stop_review | 等待用户审查与明确 06 授权 |

未来 Step 文件只在真正到达该 Step 后创建；总计划不构成未来 Step 已开始或已完成。

## 4. 每 Step 的统一小阶段与门禁

每个 Step 串行执行：`读取输入 → Step 内计划 → SOP 问题回答 → historical 诊断 → 取舍 → 结构化产物 → 复杂度判断 → 回填草稿 → 上游影响判定 → 自检 → 同步 flow/项目台账`。

每个 Step 文件必须显式记录 `gate_status`、`gate_reason`、`next_allowed_action`、`source_files`。连续授权只免除 Step 间再次询问，不允许合并 Step、提前创建未来 Step 或跳过内部停审。

## 5. 固定分母与必须保持的边界

| 分母 / 边界 | 固定值或姿态 |
|---|---|
| 技术模块 | 6 crates：contracts/domain/application/infra/api/worker |
| 正式对象 | 26（2 contracts + 24 domain） |
| Application services | 8 |
| Port families | 7 business/local families；support ports 不扩充分母 |
| 协议入口 | 3 Command + 5 Query + 5 Consumer + 17 Job = 30 logical entries / 32 method surfaces |
| 状态主语 | 18 |
| Source classes | 8；workspace projection 永远 Auxiliary |
| Outbound | 3 candidates 全部 blocked；无 ready outbox/publisher/topic/evidence |
| Query | strict no-write；telemetry on/off 均为零本仓写和零 external effect |
| 外部正向 | owner/governance/integrity/storage/receiver/observability 等未闭合 lane 均 blocked；fake 不能关闭 |

## 6. 持续 blocker 与测试转译规则

`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 与 `AR-03-LOCAL-001~006` 全部保持开放。每项必须同时映射为：

1. 对应正向 lane 的 `blocked` 前置；
2. 可执行的本地 negative/fail-closed 测试；
3. evidence 证明上限；
4. entry/exit/VETO 或 residual risk 条件。

不得以 synthetic fake、assembly `Ready`、ACK、日志、配置存在或静态矩阵将 blocker 记为关闭。

## 7. 当前三层门禁

```text
project_gate_status = formal_05_completed_stop_review
document_gate_status = formal_05_stop_review
step_gate_status = step_15_completed
test_plan_authorized_through = step_15_and_formal_05_completion
formal_05_write_allowed = false_except_review_fixes
test_execution_allowed = false
implementation_write_allowed = false
next_allowed_action = wait_for_user_review_and_explicit_06_authorization
commit_required = false
```
