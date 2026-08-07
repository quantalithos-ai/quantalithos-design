# L2-tools 04 配置设计全量重启校准流程

> 创建日期: 2026-08-05
> 状态: `04_completed_stop_review`
> 当前模式: full-restart / single-agent-serial
> 正式文档目标: `projects/L2-tools/04-配置设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 直接基线: 已完成并通过 review gate 的正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`
> 历史材料口径: 旧 README、旧正式 `05/06` 和旧配置描述只作 historical material 与冲突审计输入，不提供当前配置事实。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 15 | `assembly:15_chapters_traceability_total_audit` | `completed / pass; stop review` | Step 14 风险有 owner/保守处理；`待回写=0`、`阻塞待确认=0`；正式装配与总审计通过。 | 等待用户审阅；未经明确确认不得进入 Step 1 of `05-测试方案.md`。 | `04_config_step_01~15`;配置设计 SOP/书写规范;`projects/L2-tools/00~03` |

## 2. 执行纪律

- 只设计文档，不实现代码，不创建实现仓，不运行构建、测试或验收。
- `04` 必须严格按 Step 1~15 串行推进；每个 Step 先读本 Step 输入和标准，再形成中间产物，未通过门禁不得创建下一 Step。
- 正式 `04-配置设计.md` 只能在 Step 15 依据 Step 1~14 已通过结论整体装配；不得增量沿用旧文件。
- 每个 Step 必须记录：状态、输入、SOP 问题回答、当前材料诊断、改动前后对比、取舍、结构化产物、03 影响判定、回填草稿、待确认事项和下一步条件。
- 配置只能控制 infra composition、adapter/store/entry/job/projection availability、bounded parameter 和 safe reference；不得改变 `NC-L2T-001~025`。
- `L2T-UP-001~009` 继续保持 open。配置存在、endpoint/ref 填写、fake 返回成功都不能关闭外部 owner/schema/mapping/route/readiness blocker。
- 旧 README、旧正式 `05/06` 和任何与当前 `00~03` 冲突的内容均标记为 `historical_material`，不能恢复旧 Python/RPC/HTTP/DB/broker/MCP/registry/policy/executor 主线。
- 不伪造实现 commit、run_id、测试结果、验收签署、evidence alias、发布或 readiness；当前不提交 commit。
- 当前阶段为单 agent 串行，不启用 fast-track 或多 agent 分支。

## 3. 权威输入与效力

| 输入 | 效力 | 配置设计用途 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | current formal | 工具行动契约层定位、目标/非目标、安全、NFR、外部协作和配置边界输入。 |
| `projects/L2-tools/01-架构设计.md` | current formal | owner、依赖类别、运行/事件接缝、数据所有权和产品中立约束。 |
| `projects/L2-tools/02-概要设计.md` | current formal | 七工程模块、六业务组成部分、接口/flow/state 概览与配置影响轮廓。 |
| `projects/L2-tools/03-详细设计.md` | direct current input | `ToolsConfigCandidate`、`ToolsRuntimeConfig`、loader/validator/builder、七 Store、七 external Port、timeout/retry/degraded surface 和 `NC-L2T-001~025`。 |
| `projects/L2-tools/design-calibration/03_ddd_step_14_config_external_binding.md` | explanatory current | typed candidate 字段类别、唯一读取者、builder 顺序、adapter fallback 与配置失败 surface。 |
| `projects/L2-tools/05-测试方案.md` | historical / downstream direction | 仅提取配置测试方向；旧用例、阈值、结果和旧对象不作当前事实。 |
| `projects/L2-tools/06-验收标准.md` | historical / downstream direction | 仅提取配置验收方向；旧签署、结论、证据和旧主线不作当前事实。 |
| 配置 SOP/书写规范/中间产物规范/真相源标准/依赖规则 | process/result standards | 约束 Step 顺序、JSON 示例、敏感级别、回写门禁和事实纪律。 |
| `projects/L1-governance/04-配置设计.md`、`L1-artifact`、`L3-capability-hub`、`L4-sandbox`、`L4-observability`、`L0-core/bus/sdk` 04 | calibration samples only | 参考章节粒度、配置域拆分和下游承接写法，不提供 L2 配置事实。 |

## 4. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | 前序依赖 | 完成门禁 |
|---:|---|---|---|---|---|
| 1 | `04_config_step_01_upstream_boundary.md` | 配置输入边界 | `completed / pass; stop review` | 03 review gate 已解除 | 输入、历史冲突、不再回答和 blocker 分层；无新增当前阻塞。 |
| 2 | `04_config_step_02_scope.md` | 目标、范围、非范围、P0/P1/P2 | `completed / pass; stop review` | Step 1 | 配置范围收稳，明确不是无配置项目。 |
| 3 | `04_config_step_03_control_plane.md` | 配置控制面总览 | `completed / pass; stop review` | Step 2 | 来源链、读取入口、控制面/域及停审审计闭合。 |
| 4 | `04_config_step_04_classification_boundaries.md` | 配置分类与禁止配置化边界 | `completed / pass; stop review` | Step 3 | 分类、冷/热边界和禁止项审计闭合。 |
| 5 | `04_config_step_05_sources_priority_conflicts.md` | 来源、优先级、冲突 | `completed / pass; stop review` | Step 4 | 覆盖链、secret 来源、21 域来源矩阵和冲突处理可判定。 |
| 6 | `04_config_step_06_profiles_matrix.md` | 环境/profile 矩阵 | `completed / pass; stop review` | Step 5 | P0 profile、P1/P2 candidate、来源/依赖/敏感/测试验收差异和跨 profile 审计闭合。 |
| 7 | `04_config_step_07_config_items.md` | 配置项与 JSON demo | `completed / pass` | Step 3~6 | 54 items、十模块 demo、完整 JSONC、逐域停审和跨项审计通过。 |
| 8 | `04_config_step_08_sensitive_secrets.md` | 敏感配置与密钥 | `completed / pass; stop review` | Step 7 | raw secret 禁止、opaque ref、轮换、审计和 no-output 闭合。 |
| 9 | `04_config_step_09_loading_validation_activation.md` | 加载、校验、生效 | `completed / pass; stop review` | Step 7~8 | parse/type/cross-section/builder/activation 及失败策略闭合。 |
| 10 | `04_config_step_10_change_audit_rollback.md` | 变更、审计、回滚 | `completed / pass; stop review` | Step 7~9 | 变更 actor/评审/审计/回滚和高风险门禁闭合。 |
| 11 | `04_config_step_11_failure_degradation.md` | 失效与降级 | `completed / pass; stop review` | Step 5~10 | fail-fast/fail-closed/degraded/unknown 不混淆。 |
| 12 | `04_config_step_12_downstream_handoff.md` | 测试/验收/实施/运维承接 | `completed / pass; stop review` | Step 6~11 | 05/06/07/09 输入明确且不重新定义配置契约。 |
| 13 | `04_config_step_13_migration_deprecation_evolution.md` | 迁移、废弃、演进 | `completed / pass; stop review` | Step 7~12 | 当前无旧正式配置迁移项，future trigger 明确。 |
| 14 | `04_config_step_14_risks_open_questions.md` | 风险与待确认 | `completed / pass; stop review` | Step 1~13 | 所有开放项有 owner/影响/处理；不存在未处理 03 回写项。 |
| 15 | `04_config_step_15_formal_document_assembly.md` | 正式 04 装配与总审计 | `completed / pass; stop review` | Step 1~14 | 15 章正式文档、来源、JSON、跨域审计通过；关闭写入并停审。 |

## 5. 配置域小循环主轴

| 配置域批次 | 固定顺序 | 必须闭合 |
|---|---|---|
| runtime/profile | control surface -> classification -> source -> profile -> item -> validation | profile 不产生 authority/truth；invalid profile fail-fast。 |
| seven stores/UoW/idempotency | store capability -> source/ref -> sensitivity -> builder validation -> failure | CAS、pair atomicity、replay、UoW 不可降级。 |
| boundary/entries/consumer/jobs | boundary -> schema/version -> batch/timeout/retry category -> activation | Query no-write、Consumer no-core-write、Job no-repair。 |
| external adapters/handoff | adapter slot -> blocked/available -> target/ref -> one-call fence | endpoint/ref 不等于 authority/readiness/delivery。 |
| observability/redaction | safe fields -> redaction -> diagnostic -> failure | body-free、低基数、audit 不反写。 |

## 6. 开放 blocker 继承

| ID | 配置设计允许闭合 | 配置设计必须保持 blocked |
|---|---|---|
| `L2T-UP-001~002` | Authorization adapter ref、blocked availability、fail-closed validation | owner/source/taxonomy/schema/freshness 和 positive decision provider。 |
| `L2T-UP-003~004` | Sandbox adapter ref、mapping-blocked/unknown fallback、local attempt config | generic mapping、receipt/run/capture/cleanup/DLQ/feedback positive contract。 |
| `L2T-UP-005~006` | safe material target ref、route-blocked/unknown collaboration config | producer/source/route/status/observability readiness。 |
| `L2T-UP-007` | 文件和章节来源标记、redacted config identity | immutable commit baseline 和 implementation readiness。 |
| `L2T-UP-008` | core candidate/blocked adapter selector | Tools-specific Core package/type/schema authority。 |
| `L2T-UP-009` | future server seam / blocked client selector | tools-specific SDK client/wrapper/coverage。 |

## 7. 当前 next_allowed_action

```text
current_document = 04-配置设计.md
document_status = 04_completed_stop_review
current_step = Step 15 completed / stop review
current_module = fifteen_chapters_traceability_total_audit_completed
gate_status = completed / pass; stop review
gate_reason = Step 15 completed formal assembly and total audit; pending writeback=0 and blocking confirmation=0
next_allowed_action = wait_for_user_review_before_step_05
future_step_files_allowed = none_until_user_confirmation
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
