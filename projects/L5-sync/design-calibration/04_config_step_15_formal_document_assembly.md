# Step 15. 整理正式配置设计文档

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 15。
> 输出正式文档：`projects/L5-sync/04-配置设计.md`。
> 当前模式：`full-restart + single-agent-serial`；本文件是 Step 15 中间产物，记录装配规则和审计，不替代正式 04。
> 事实边界：本 Step 只装配已停审的配置结论；不新增配置契约，不实现代码，不运行测试，不生成 artifact、report、evidence、review verdict、signoff 或 readiness。

## 1. Step 状态与开工确认

| 项目 | 状态 |
|---|---|
| 当前 Step | `15 / formal_document_assembly` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 输入基线 | Step 1～14 均 `completed / stop_review`；Step 14 当前 P0 无待回写/阻塞待确认 |
| 输出文件 | `projects/L5-sync/04-配置设计.md`；本文件 |
| 正式文档写入 | `completed / closed`；本 Step 已完成装配 |
| Step 14/前序产物 | 已完成；不修改其结论 |
| 实现 / 测试 / commit | `false / false / false` |
| 当前持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样保留 |
| 完成后门禁 | 正式 04 已停审；不得进入 05 |

### 1.1 Step 内计划

| 阶段 | 状态 | 产物 / 约束 |
|---|---|---|
| 读取 Step 1～14 与规范 | done | 15 章主链、来源入口、下游边界和 03 影响已复核 |
| 章节映射与装配计划 | done | §3 映射表；每章引用具体 calibration 文件 |
| 正式正文分批写入 | done | 已按 §1～§15 装配，只写已确认收口结论 |
| 跨配置域总审计 | done | 来源、42 leaf、profile、敏感性、加载、变更、失效、03 回写均一致 |
| 正式文档自检 | done | 章节、计数、边界和 evidence ceiling 通过静态审计 |
| 停审与台账回填 | done | flow/ledger 已切换为 `formal / stop_review`，不得进入 05 |

## 2. 本步目标、输入与装配纪律

### 2.1 目标

将 Step 1～14 的已确认结论装配为正式 `04-配置设计.md`，满足：

1. 使用配置设计规范规定的 15 章主链和章节名称；
2. 每章正文开头保留具体 `design-calibration/...` 校准来源与延伸阅读；
3. 只写收口结论，不把 SOP 问题回答、方案取舍、历史污染诊断和模块自检搬入正式正文；
4. 保持 42 个既有 leaf、38 个 required、4 个 nullable operations slot、source precedence、profile、sensitive、cold activation、failure 和 truth ownership 一致；
5. 明确下游 `05/06/07/09` 只能承接输入，当前没有测试/验收/实施/运维事实；
6. 明确当前 `03` 无待回写项，未来改变代码契约时必须先回写 03。

### 2.2 装配输入

| 输入 | 装配责任 |
|---|---|
| `04_config_step_01_upstream_boundary.md` | §1 上游映射、依赖裁剪和 blocker 语境 |
| `04_config_step_02_scope.md` | §2 P0/P1/P2、范围/非范围和完成上限 |
| `04_config_step_03_control_plane.md` | §3 控制面、loader/composition 边界和配置域总览 |
| `04_config_step_04_categories_boundaries.md` | §4 分类、冻结时机和禁止配置化边界 |
| `04_config_step_05_sources_priority_conflicts.md` | §5 来源、优先级、冲突、不可用与高优先级 no-fallback |
| `04_config_step_06_environment_profiles_matrix.md` | §6 四个 P0 profile、future profile 和来源/依赖矩阵 |
| `04_config_step_07_config_items.md` | §7 42 leaf、严格 JSON/module demo、域停审 |
| `04_config_step_08_sensitive_secrets.md` | §8 sensitive/ref-only、rotation、最小暴露和零泄露 |
| `04_config_step_09_loading_validation_activation.md` | §9 parse/type/range/ref/cross-field、builder、snapshot、activation |
| `04_config_step_10_change_audit_rollback.md` | §10 actor/risk、safe audit、cold rollback、unknown effect 边界 |
| `04_config_step_11_failure_degradation.md` | §11 fail-fast/fail-closed/degraded/delayed/unknown、drift/expiry |
| `04_config_step_12_downstream_handoff.md` | §12 05/06/07/09 承接和 evidence ceiling |
| `04_config_step_13_migration_deprecation_evolution.md` | §13 当前无迁移项、废弃/演进和 metadata 双轨 |
| `04_config_step_14_risks_open_questions.md` | §14 风险、待确认、03 影响汇总和 future triggers |
| `配置设计书写规范.md` | 15 章主链、表/图格式、来源入口和评审清单 |

### 2.3 正式正文禁止事项

- 不新增任何未在 Step 1～14 或正式 00～03 出现的 runtime type、Port、DTO、error、state、flow、topic、schedule、产品、命令或固定版本。
- 不把 `documentation candidate` 数字/ref/profile 写成部署实例、默认运行值、SLO、测试结果或 capability proof。
- 不把 `bound`、`blocked`、`validated`、ACK、Git commit、日志、telemetry、job report 或 calibration 表写成 Artifact/Baseline/Review accepted/evidence/readiness。
- 不写 raw secret、credential、endpoint/body、provider response、文件正文、绝对路径、Git stdout/stderr 或完整 sensitive ref。
- 不声明 config center、admin override、hot reload、online LKG、自动 merge/rebase/push/stash、dirty overwrite 或外部 effect rollback 已支持。

## 3. 正式章节映射与装配状态

| 正式章节 | 校准来源 | 装配要点 | 状态 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 当前正式 00～03、专项上游、依赖类型、历史材料、blocker | ready |
| §2 本次配置设计目标与范围 | Step 2 | P0 42-leaf contract、P1/P2 上限、非范围 | ready |
| §3 配置控制面总览 | Step 3 | source selection、`src/config/*`、composition、snapshot、domain 禁止 raw read | ready |
| §4 配置分类与边界 | Step 4 | activation classes、freeze、hard boundary、禁止项 | ready |
| §5 配置来源、优先级与冲突处理 | Step 5 | default < strict JSON < allowlisted env、whole-candidate reject | ready |
| §6 环境、部署 profile 与配置矩阵 | Step 6 | `local-dev`/`ci-test`/`integration-like`/`operations-replay`，future profile | ready |
| §7 配置项清单 | Step 7 | 42 leaf 十列表、九 section、strict JSON demo 和计数 | ready |
| §8 敏感配置与密钥管理 | Step 8 | four levels、opaque refs、adapter-private、rotation、no-output | ready |
| §9 配置加载、校验与生效机制 | Step 9 | strict parse、校验链、builder、capability snapshot、P0 hot reject | ready |
| §10 配置变更、审计与回滚 | Step 10 | actor/risk、变更组、safe audit、cold rollback、external effect boundary | ready |
| §11 失效模式与降级 / fail-fast 策略 | Step 11 | failure vocabulary、42-leaf failure、surface matrix、safe signals | ready |
| §12 测试、验收、实施与运维承接 | Step 12 | planned inputs、VETO/gate、task family、09 handoff、evidence ceiling | ready |
| §13 配置迁移、废弃与演进 | Step 13 | 当前无迁移项、deprecated/rejected/removed、future queue | ready |
| §14 风险与待确认事项 | Step 14 | risk/pending/03 summary/future trigger；当前无 P0 回写 | ready |
| §15 参考 | Step 1～14、规范和正式基线 | 只列实际阅读/使用的资料 | ready |

## 4. 正式装配前门禁

| 检查项 | 结果 |
|---|---|
| Step 1～14 均有独立中间产物和停审记录 | pass |
| Step 3～11 所有适用配置域/配置项已逐域停审 | pass |
| Step 14 当前无 `待回写` 或 `阻塞待确认` 的 03 项 | pass |
| 42 leaf 计数固定为 `2+5+8+2+3+7+5+6+4=42` | pass |
| 38 required 与 4 nullable operations slot 一致 | pass |
| 上游 blocker 未被配置开关、fake、cache、ACK 或 log 关闭 | pass |
| 正式 04 已在本 Step 装配，未创建实现、测试或提交事实 | pass |

## 5. 跨配置域总审计结果

正式正文写入后已逐项核对：

| 审计轴 | 审计结果 | 失败处理 |
|---|---|---|
| 来源与优先级 | 通过：approved default < selected strict JSON < allowlisted environment；identity/profile 特例和高优先级 no-fallback 一致 | 若未来变更，回到 Step 5/9 |
| profile | 通过：四个 P0 语义 profile；future profile 不进入 P0 schema | 若未来变更，回到 Step 6 |
| schema | 通过：九 section、42 leaf、required/nullability、strict JSON、unknown/alias/duplicate/forbidden reject | 若未来变更，回到 Step 7/9 |
| sensitive | 通过：opaque ref、raw material 永禁、adapter-private、safe output | 若未来变更，回到 Step 8/11 |
| activation | 通过：startup/cold、job-run-start、entry-local、test harness；reload/hot reject；snapshot pinning | 若未来变更，回到 Step 9/10 |
| change/failure | 通过：safe audit、cold rollback、fail-fast/fail-closed/degraded/delayed/unknown、no silent fallback | 若未来变更，回到 Step 10/11 |
| ownership/safety | 通过：Sync 不拥有 Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote；dirty non-overwrite、provenance protection、ACK≠accepted | 若未来变更，回到 00～03/Step 4/8/11 |
| downstream/evidence | 通过：05/06/07/09 只承接 planned input；不伪造 run/report/evidence/verdict/signoff/readiness | 若未来变更，回到 Step 12/14 |

## 6. 正式文档自检清单

- [x] 承接正式 03 的配置引用、外部依赖绑定、snapshot、错误恢复和观测边界。
- [x] 使用配置设计规范规定的 15 章主链，章节名称不变。
- [x] §1～§15 每章均有具体 calibration 来源和延伸阅读。
- [x] 配置项清单完整覆盖 42 leaf，且无第 43 个 leaf。
- [x] §7 已包含九个功能配置域的严格 JSON module demo，以及完整 JSONC 文档示例。
- [x] 敏感配置独立处理，raw secret/full ref/body/path/Git output 不进入输出面。
- [x] source precedence、strict loading、cross-field validation、cold activation 和 P0 hot reject 一致。
- [x] 变更、审计、回滚、unknown effect、drift/expiry 和 fail-closed 一致。
- [x] 05/06/07/09 承接边界与 planned evidence ceiling 明确。
- [x] 当前 P0 无 03 待回写/阻塞待确认；future triggers 保留。
- [x] Step 3～11 逐域停审、跨配置域总审计无 unresolved 冲突。
- [x] 未创建 implementation ledger/boundary skeleton，未运行测试，未提交 commit。

## 7. 正式文档完成条件与停审动作

正式 `04-配置设计.md` 已满足以下关闭条件，本 Step 现已停审：

1. 15 章正文已经按 §3 映射装配，且没有过程性 SOP 问题或未确认契约混入；
2. 每章来源入口可追溯到具体 calibration 文件；
3. 跨配置域总审计没有当前 unresolved 冲突；
4. Step 14 的当前 P0 03 回写判定仍为 `待回写=0`、`阻塞待确认=0`；
5. 上游 blocker、future、planned、blocked、waiting 和 evidence ceiling 没有被升级；
6. 更新 04 flow/ledger 为 `formal_stop_review`，并明确不得进入 05。

完成后的状态为：

```text
formal_04_status = formal / stop_review
formal_04_write_allowed = completed / closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
next_allowed_action = user_review_formal_04
```
