# L2-runtime 04 配置设计全量校准流程

> 创建日期: 2026-08-09
> 当前模式: full-restart + controlled_reopen
> 正式目标: `projects/L2-runtime/04-配置设计.md`
> 适用 SOP: `standards/document/配置设计讨论流程_SOP.md`
> 适用规范: `standards/document/配置设计书写规范.md`

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|---|
| Step 15 | `formal_document_assembly / final_audit` | `closed_stop_review` | 正式 04 已按固定 15 章装配；13 个 JSON block、12/153/39/13x5/7x6、ID ranges、secret/lifecycle/truth boundary、03 spot check 与 diff hygiene 均通过；11 个 external blocker 保留 | 停审并等待用户明确确认；不得进入 05 |

## 2. 执行纪律

- 严格按 Step 1 -> Step 15 独立推进；每个 Step 先更新本 flow、项目台账并创建对应产物。
- 正式 `04-配置设计.md` 只在 Step 15 删除后重建；当前旧正式 04 与旧 Step 1~15 一律标记为 `historical_material`，不得直接继承。
- 旧 `README.md`、旧 `05-测试方案.md`、旧 `06-验收标准.md` 只作 `historical_material` 与下游方向输入。
- 04 只定义配置语义、来源、优先级、profile、JSON shape、校验、生效、变更、失效和承接，不定义部署命令、挂载路径、具体 secret backend、endpoint、DB、broker、scheduler 或 provider route。
- 每个 Step 必须包含“对 03 的影响判定”；存在 `待回写` 或 `阻塞待确认` 时不得进入 Step 15。
- `L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001` 必须保持 pending/blocked/waiting/fail-closed；配置不能制造 readiness。
- 不创建实现仓、不实现代码、不运行或伪造测试/验收/证据，不提交 commit。

## 3. Step 总流程

| Step | 中间产物 | 主题 | 状态 |
|---:|---|---|---|
| 1 | `04_config_step_01_upstream_boundary.md` | 配置输入边界 | `done` |
| 2 | `04_config_step_02_scope.md` | 目标、范围与非范围 | `done` |
| 3 | `04_config_step_03_control_plane.md` | 配置控制面与配置域 | `done` |
| 4 | `04_config_step_04_classification_forbidden.md` | 分类与禁止配置化边界 | `done` |
| 5 | `04_config_step_05_sources_precedence.md` | 来源、优先级与冲突 | `done` |
| 6 | `04_config_step_06_profiles_matrix.md` | 环境/profile 矩阵 | `done` |
| 7 | `04_config_step_07_items_json.md` + domain annexes | 配置项、模块 JSON 与完整 demo | `done` |
| 8 | `04_config_step_08_sensitive_secrets.md` | 敏感配置与密钥边界 | `done` |
| 9 | `04_config_step_09_loading_validation_activation.md` | 加载、校验与生效 | `done` |
| 10 | `04_config_step_10_change_audit_rollback.md` | 变更、审计与回滚 | `done` |
| 11 | `04_config_step_11_failure_degradation.md` | 失效与 fail-fast/fail-closed | `done` |
| 12 | `04_config_step_12_downstream_handoff.md` | 测试、验收、实施、运维承接 | `done` |
| 13 | `04_config_step_13_migration_deprecation.md` | 迁移、废弃与演进 | `done` |
| 14 | `04_config_step_14_risks_open_questions.md` | 风险、blocker 与 03 回写闭环 | `done` |
| 15 | `04_config_step_15_formal_assembly.md` | 正式配置设计装配 | `done_stop_review` |

## 4. 持续 blocker

`L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001` 从 03 原样传递。它们不阻塞配置 schema 对 blocked/candidate posture 的设计，但阻塞相关 external slot 的正向激活、真实 secret/route、集成测试、evidence 和 readiness。

## 5. 当前 next_allowed_action

```text
current_document = 04-配置设计.md
current_step = Step 15
current_module = formal_document_closed_stop_review
gate_status = closed_stop_review
gate_reason = step_15_document_audits_pass; no_unresolved_03_writeback; external_blockers_preserved
next_allowed_action = wait_for_explicit_user_confirmation_before_05
formal_04_write_allowed = false_after_close_except_authorized_reopen
future_step_files_allowed = false_until_user_confirmation
next_formal_document = 05-测试方案.md
next_formal_document_allowed = false_until_user_confirmation
formal_05_write_allowed = false_until_user_confirmation
commit_required = false
```
