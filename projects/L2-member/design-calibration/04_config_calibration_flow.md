# L2-member 04 配置设计校准流程

> 目标正式文档：`projects/L2-member/04-配置设计.md`
> 适用 SOP：`standards/document/配置设计讨论流程_SOP.md`
> 适用书写规范：`standards/document/配置设计书写规范.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 创建日期：2026-09-03
> 执行模式：`full-restart + single-agent-serial`
> 当前状态：`Step 15 completed / stop_review`；正式 `04-配置设计.md` 已装配，等待用户审查。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 15：整理正式配置设计文档 | `formal-document-assembly-and-cross-domain-audit` | `in_progress` | Step 14 已完成并通过；Step 1～14 的结论已具备装配条件。所有上游与设计 blocker 继续开放。 | 完成章节映射、自检清单、跨配置域总审计和正式 `04`；正式文档完成后立即停审，不进入 `05`。 | `project_execution_ledger.md`;`04_config_step_14_risks_open_questions.md`;`04_config_calibration_flow.md`;配置设计书写规范；当前正式 `00~03` |

## 2. 本轮目标与输入效力

本轮从当前正式 `00~03` 收敛配置控制面的输入边界。`03-详细设计.md` §13 和其 Step 14 是直接代码绑定输入；`03` §14～§17 提供安全、测试切口、实施承接与风险输入。旧 README、旧 `05/06` 和旧 `00~03` 只能用于 historical / pollution audit，不能反向定义 key、默认值、环境、secret、产品、测试事实或验收事实。

| 输入类别 | 材料 | 在 04 中的作用 | 效力 / 限制 |
|---|---|---|---|
| normative | 配置 SOP、配置书写规范、编写通则、中间产物规范、真相源闭环标准、全局依赖关系与裁剪规则 | 决定 Step 顺序、JSON 规则、回写纪律、依赖分类和三层门禁 | normative authority |
| 本仓正式链 | 当前正式 `00/01/02/03` | 需求、owner、架构红线、CP、配置绑定、错误、测试切口和风险 | current formal authority |
| 直接字段输入 | `03_ddd_step_14_configuration_external_bindings.md` | raw-config 读取权、validated ref、builder、slot、Store、resolver、handoff 和不可配置化边界 | current calibration input；不替代正式 03 |
| owner / foundation | Runtime、Tools、Core、Bus、SDK、Work、Identity、Governance、Conversation、Artifact 的当前正式材料与台账 | 只确认 owner、shared primitive、event / ref / adapter seam 和开放合同 | 不产生本地 schema、route、产品或 readiness |
| 并行 sibling | member-service、member-images 的当前正式或明确可引用材料与台账 | 只确认 host / image supply 的已知 owner 方向 | exact IPC、credential、release、manifest、compatibility、handoff 与正向联调保持 pending |
| 下游方向 | 旧 `05-测试方案.md`、旧 `06-验收标准.md` | 仅识别未来 05 / 06 需要从新版 04 承接的方向和历史污染 | historical / direction input，不是当前配置真相源 |
| 本地历史 | README、旧正式 `00/01/02/03/05/06`、`draft/` | 后置差异 / 污染审计 | 不继承旧 persona、AG-UI、UDS、gRPC、launch token、固定端口、DB / broker、P95 / SLA 或部署假设 |

## 3. Step 总流程与门禁

| Step | 中间产物 | 主题 | 当前状态 | 进入门禁 | 完成门禁 |
|---:|---|---|---|---|---|
| 1 | `04_config_step_01_upstream_boundary.md` | 配置输入边界 | `completed / pass_with_explicit_blockers / stop_review` | 用户已确认进入 04；正式 03 已停审 | 输入映射、五问、历史诊断、03 影响判定和停审已完成 |
| 2 | `04_config_step_02_scope.md` | 目标、范围与非范围 | `completed / pass_with_explicit_blockers / stop_review` | Step 1 pass + 用户最新“继续” | P0/P1/P2、无配置路径、范围 / 非范围去向、03 影响判定和停审已完成 |
| 3 | `04_config_step_03_control_plane.md` | 控制面与配置域 | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 2 pass + 用户“完成全部 04” | 来源链、控制面、配置域与跨域审计已完成；下一步进入 Step 4 |
| 4 | `04_config_step_04_categories_boundaries.md` | 分类与禁止配置化边界 | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 3 pass + 已有“完成全部 04”授权 | 分类、热/冷边界、禁止项和审计已完成；下一步进入 Step 5 |
| 5 | `04_config_step_05_sources_priority_conflicts.md` | 来源、优先级与冲突 | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 4 pass + 已有“完成全部 04”授权 | 覆盖顺序、不可用与冲突规则已完成；下一步进入 Step 6 |
| 6 | `04_config_step_06_environment_profiles_matrix.md` | 环境 / profile 矩阵 | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 5 pass + 已有“完成全部 04”授权 | P0 环境差异与 05 承接已完成；下一步进入 Step 7 |
| 7 | `04_config_step_07_config_items.md` | 配置项与 JSON demo | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 6 pass + 已有“完成全部 04”授权 | 每项十列、模块 JSON 和跨项审计已完成；下一步进入 Step 8 |
| 8 | `04_config_step_08_sensitive_secrets.md` | 敏感配置与密钥边界 | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 7 pass + 已有“完成全部 04”授权 | sensitive 分类、禁止输出与轮换边界已完成；下一步进入 Step 9 |
| 9 | `04_config_step_09_loading_validation_activation.md` | 加载、校验与生效 | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 8 pass + 已有“完成全部 04”授权 | load / validate / builder / activation 语义已完成；下一步进入 Step 10 |
| 10 | `04_config_step_10_change_audit_rollback.md` | 变更、审计与回滚 | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 9 pass + 已有“完成全部 04”授权 | 变更和回滚边界已完成；下一步进入 Step 11 |
| 11 | `04_config_step_11_failure_degradation.md` | 失效与降级 / fail-fast | `completed / pass_with_upstream_and_design_blockers / stop_review` | Step 10 pass + 已有“完成全部 04”授权 | failure posture 与不变量保护已完成；下一步进入 Step 12 |
| 12 | `04_config_step_12_downstream_handoff.md` | 05 / 06 / 07 / 09 承接 | `completed / stop_review` | Step 11 pass + 已有“完成全部 04”授权 | planned handoff 已完成，不生成下游事实 |
| 13 | `04_config_step_13_migration_deprecation_evolution.md` | 迁移、废弃与演进 | `completed / stop_review` | Step 12 pass + 已有“完成全部 04”授权 | 首版 / future migration 口径已完成 |
| 14 | `04_config_step_14_risks_open_questions.md` | 风险、blocker 与 03 回写清单 | `completed / stop_review` | Step 13 pass + 已有“完成全部 04”授权 | 风险收口完成；当前无 `待回写` / `阻塞待确认` |
| 15 | `04_config_step_15_formal_document_assembly.md` | 正式 `04` 装配与总审计 | `completed / stop_review` | Step 14 pass + 已有“完成全部 04”授权 | 等待用户审查；未经新确认不得进入 `05` |

## 4. 固定执行纪律

- 严格一 Step 一文件；Step 1～15 已各自留痕并停审；未经用户新确认不得创建 `05` 的任何校准或正式文件。
- 只修改 `projects/L2-member/`；不写代码、不创建目标实现仓、不修改 sibling、不运行测试或验收、不提交 commit。
- 每个 Step 均须保留 SOP 问题回答、当前材料诊断、改动前后、取舍、结构化产物、对 03 的影响判定、回填草稿、待确认事项和下一步门禁。
- 只有 `infra/config.rs` 读取 / 校验 raw config，只有 `infra/runtime_builder.rs` 将 validated ref 装配为 local adapter、blocked seam 或 test fake；本纪律来自 03，不能由 04 改写。
- 配置不能改变双锚、truth owner、body-free、screening owner、状态迁移、Query no-write、typed replay、CAS、Unknown fence、local / external truth 分层、Core-only compile 或 24 个 blocked outbound semantic candidate 的非物化状态。
- runtime、event、ref、adapter、fake 和 persistence relation 不能伪装成 Cargo dependency；唯一 planned sibling Cargo path 仍是 `core-contracts`，并非本 Step 要验证的实现事实。
- `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 和 `L2M-UP-005` 前的 24 candidate 均保持 pending / blocked / waiting / fail-closed，不由配置产生 positive integration、evidence、verdict 或 readiness。

## 5. 持续 blocker

| blocker | 对 04 的影响 | 未关闭前处理 |
|---|---|---|
| `L2M-UP-001` / `L2M-UP-006` | host、IPC、credential、session / health 的 exact binding 与敏感配置边界 | 仅 logical slot / typed ref / blocked seam；不定 endpoint、凭据正文或 host success |
| `L2M-UP-002` | image release / pinned entry 的具体 source、compatibility、handoff | 仅 availability / ref / waiting；不配置 manifest、digest 或 assembly success |
| `L2M-UP-003` / `L2M-UP-004` | Runtime entry / handoff source 的正向绑定 | 只保留 blocked-aware adapter posture；不定义 Runtime payload、route 或 executed / delivered |
| `L2M-UP-005` | 24 semantic candidate 的 event / publication configuration | 不生成 event、publisher、outbox、route、topic、retry、DLQ 或 delivery 配置项 |
| `L2M-UP-007` | screening taxonomy、policy source binding | 只消费 safe result；不配置本地 allowlist / denylist 或 default pass |
| `L2M-UP-008` | non-project execution subject | 项目型双锚之外保持 fail closed |
| `L2M-DDD-001~007`、`scope_supersede_gap`、physical Store / UoW non-choice | 实现前置、Store 产品和受影响 positive flow 的配置激活 | 不把 config default、fake 或 private state 当作修复或正向结论 |

## 6. 当前 next_allowed_action

```text
current_document = 04-配置设计.md
current_step = Step_15_formal_document_assembly_completed_stop_review
current_module = formal-04-assembly-and-cross-domain-audit
gate_status = pass_with_upstream_and_design_blockers / stop_review
gate_reason = user_explicitly_authorized_complete_all_04;step_01_to_step_15_completed_and_stop_reviewed;historical_05_06_read_only;no_current_03_writeback;upstream_and_design_blockers_preserved
next_allowed_action = wait_for_user_confirmation_before_entering_05
formal_04_write_allowed = closed_after_assembly
future_step_files_allowed = false_until_prior_step_completion
implementation_repo_write_allowed = false
commit_required = false
```
