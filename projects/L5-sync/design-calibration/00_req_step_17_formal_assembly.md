# 00 需求 Step 17 · 正式文档装配

> 状态：`completed`
> 当前文档：`00-需求文档.md`
> 输出：`projects/L5-sync/00-需求文档.md`
> gate_status：`stop_review`
> next_allowed_action：等待用户审查并明确授权进入 `01-架构设计.md`

## 1. 装配输入

正式文档逐章承接 `00_req_step_01_upstream_relationship.md` 至 `00_req_step_16_traceability.md`。装配只进行章节重排、编号统一、术语收束和来源链接，不新增需求结论；旧正式 00、README 和旧技术选择不作为正文输入。

## 2. 写入前三层门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 项目级 | pass | `project_execution_ledger.md` 允许完成 00，01~07 仍 blocked。 |
| 文档级 | pass_with_blockers | flow Step 1~16 全部完成；`SYNC-UP-001~010` 保留。 |
| Step/模块级 | pass | 各 Step 均有问题回答、诊断、取舍、结构化产物、回填草稿和自检。 |

## 3. Full-restart 装配动作

- [x] 旧 `projects/L5-sync/00-需求文档.md` 仅作 historical material，已从当前正文基线排除。
- [x] 正式正文按需求规范严格装配 §1~§16。
- [x] 每个章节在正文开始处列出具体 calibration 来源和延伸阅读。
- [x] 正文不写过程性聊天、SOP 原问题、实现组织、协议 schema、测试结果或 readiness。
- [x] 上游未闭合项统一保留为 `pending/blocked`，不由本仓补造。

## 4. 章节来源映射

| 正式章节 | 校准来源 |
|---|---|
| §1 | `00_req_step_01_upstream_relationship.md` |
| §2 | `00_req_step_02_scope_boundary.md` |
| §3 | `00_req_step_03_problem_context.md` |
| §4 | `00_req_step_04_goals_non_goals.md` |
| §5 | `00_req_step_05_users_roles.md` |
| §6 | `00_req_step_06_consumers_dependencies.md`、`00_req_step_12_interfaces_dependencies.md` |
| §7 | `00_req_step_07_core_capability_loop.md` |
| §8 | `00_req_step_08_user_stories.md` |
| §9 | `00_req_step_09_functional_requirements.md` |
| §10 | `00_req_step_10_business_rules.md` |
| §11 | `00_req_step_11_data_ownership.md` |
| §12 | `00_req_step_12_interfaces_dependencies.md` |
| §13 | `00_req_step_13_nonfunctional.md` |
| §14 | `00_req_step_14_acceptance.md` |
| §15 | `00_req_step_15_risks_open_questions.md` |
| §16 | `00_req_step_16_traceability.md` |

## 5. 污染清除审计

| 历史内容 | 处理结果 |
|---|---|
| 跨 chat/console/runner 的统一同步器、SyncTask、全平台 replay/resync | 删除出当前需求主责；仅保留为历史污染说明。 |
| 固定 `.qs-sync/metadata.json` 单文件和“永久不可删” | 收敛为受控 metadata/provenance 方向，布局、迁移和保留 pending。 |
| Rust/Tauri、Git LFS、浅克隆、固定性能/SLA 数字 | 不进入当前方案或目标；列为历史候选/待核验。 |
| 旧 ArtifactService/WorkService/GovernanceService 名称 | 不假定存在；只通过能力级 owner/SDK seam 表达。 |
| 本地 commit/上传 ACK/HTTP 200 = Artifact/Baseline/accepted | 明确禁止并进入规则、验收和 VETO。 |

## 6. 静态一致性审计

| 审计项 | 结果 |
|---|---|
| 章节结构 | pass；严格 §1~§16。 |
| 编号闭合 | pass；`CP-SYNC-01~06`、`US-SYNC-001~015`、`FR-SYNC-001~015`、`BR-SYNC-001~025`、`AC-SYNC-001~020`、`VETO-SYNC-001~005` 均回指校准来源。 |
| owner 边界 | pass；Project/Artifact/Baseline/Review/Workspace/Archive/Git remote 未转移给 Sync。 |
| 查询/变更边界 | pass；status no-write，handoff 不等于 accepted。 |
| 数据边界 | pass；local truth、snapshot、ref、forbidden body 分层。 |
| blocker 真实性 | pass；`SYNC-UP-001~010` 未关闭。 |
| 事实诚实 | pass；无实现、commit、run、测试、artifact、report、evidence、verdict、signoff、readiness。 |

## 7. 停审结论

```text
formal_00_status = formal / stop_review
formal_01_write_allowed = false_until_new_user_authorization
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
upstream_blockers = SYNC-UP-001..SYNC-UP-010 retained
```

正式 00 完成后不得自动读取或创建 01 calibration；下一动作只能是等待用户审查和明确授权。
