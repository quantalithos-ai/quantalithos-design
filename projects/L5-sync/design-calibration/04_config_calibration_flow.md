# L5-sync 04-配置设计校准流程

> 当前模式：`full-restart + single-agent-serial`。
> 用户授权：完成全部 `04-配置设计`，严格执行配置设计 SOP Step 1→15；Step 15 装配正式 04 后立即停审。
> 本文件是配置设计工作台，不替代正式 `projects/L5-sync/04-配置设计.md`。
> 当前 agent 独立完成全部阅读、分析、写入和审计；禁止创建、调用或委派 sub-agent、worker、team 或并行代理。

## 1. 执行边界与来源纪律

- 只修改 `projects/L5-sync/` 下的设计文档、`design-calibration/` 中间产物和项目台账。
- 正式 `04-配置设计.md` 只能在 Step 15 由 Step 1～14 已停审产物 full-restart 装配；此前不得创建。
- 当前正式 `00/01/02/03` 是唯一项目内正式输入；README、旧 `05/06`、draft 和其他项目配置只能作为 `historical_material`、方向输入或框架参考。
- 04 只细化 03 已定义的 `ValidatedSyncRuntimeConfig`、八个 config family、adapter binding、capability snapshot 和 composition 语义；不得静默新增 runtime type、Port、DTO、error 或 flow。
- 每个 Step 必须包含“对详细设计的影响判定”。若出现 `待回写` 或 `阻塞待确认`，必须先回流 03，Step 15 不得定稿。
- `SYNC-UP-001~010` 和 `SYNC-LOCAL-001~005` 保持真实状态；配置存在不等于 capability bound、依赖健康、授权成立或 readiness。
- 不实现代码、不创建实现仓、不运行测试、不生成 artifact/report/evidence/verdict/signoff/readiness、不提交 commit。

## 2. 执行依据与权威输入

| 类型 | 文件 / 材料 | 用途 |
|---|---|---|
| 配置流程 | `standards/document/配置设计讨论流程_SOP.md` | Step 1～15 唯一流程 |
| 配置结构 | `standards/document/配置设计书写规范.md` | 正式 15 章、JSON、配置项、敏感性与失效规则 |
| 中间产物纪律 | `standards/document/设计文档讨论中间产物规范.md` | 三层门禁、逐 Step、分批写入与恢复纪律 |
| 通用设计原则 | `standards/document/设计文档编写通则.md` | 正式正文边界与追溯规则 |
| 可落码性 | `standards/document/设计真相源闭环与可落码性标准.md` | config binding、metadata、idempotency、scope 与 phase 闭环 |
| 依赖裁剪 | `standards/document/全局项目依赖关系与裁剪规则.md` | Layer 5 窗口与 compile/runtime/event 分类 |
| 项目正式基线 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` | 需求红线、ownership、五 feature、代码与配置绑定契约 |
| 直接配置输入 | `03_ddd_step_14_config_dependencies.md`、Step 15～18、项目台账 | exact config family、binding、观测、测试切口、handoff 与 blocker |
| 框架参考 | `projects/L1-governance/04-配置设计.md` 及其 04 calibration | 仅参考粒度和结构，不继承 Governance 配置 truth |
| 专项上游 | L0-sdk、L1-identity/work/governance/artifact/workspace、L4-archive/observability 当前正式 04 与必要台账 | 只核验 binding 语境和 blocker，不反推 Sync API |
| 下游方向 | 当前旧 `05-测试方案.md`、`06-验收标准.md` | `historical_material / direction_only`；不得定义 04 truth |

## 3. Step 总流程与状态台账

| Step | 主题 | 输出文件 | 当前状态 | gate_status | 下一动作 / 完成门禁 |
|---:|---|---|---|---|---|
| 1 | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | completed / stop_review | pass_with_upstream_blockers | 输入映射、必答/不答清单与 03 影响基线已审计 |
| 2 | 明确目标、范围与非范围 | `04_config_step_02_scope.md` | completed / stop_review | pass_with_upstream_blockers | P0/P1/P2、非范围与完成上限已审计 |
| 3 | 建立配置控制面总览 | `04_config_step_03_control_plane.md` | completed / stop_review | pass_with_upstream_blockers | 控制面、配置域、逐域停审和跨域审计已完成；等待进入 Step 4 |
| 4 | 分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | completed / stop_review | pass_with_upstream_blockers | 配置类别、冻结边界、禁止项和跨分类审计已完成；等待进入 Step 5 |
| 5 | 来源、优先级与冲突 | `04_config_step_05_sources_priority_conflicts.md` | completed / stop_review | pass_with_upstream_blockers | 普通 source 优先级、secret 隔离、冲突和不可用策略已完成；等待进入 Step 6 |
| 6 | 环境与 profile 矩阵 | `04_config_step_06_environment_profiles_matrix.md` | completed / stop_review | pass_with_upstream_blockers | P0/P1/P2 profile、来源组合、依赖姿态和下游承接已完成；等待进入 Step 7 |
| 7 | 配置项清单 | `04_config_step_07_config_items.md` | completed / stop_review | pass_with_upstream_blockers | 42 leaf raw mapping、required/default、scope、生效、失败策略、严格 JSON demo 和跨项审计已完成 | 进入 Step 8 |
| 8 | 敏感配置与密钥 | `04_config_step_08_sensitive_secrets.md` | completed / stop_review | pass_with_upstream_blockers | opaque ref、解析/最小暴露、profile、轮换、审计和零泄露审计已完成 | 进入 Step 9 |
| 9 | 加载、校验与生效 | `04_config_step_09_loading_validation_activation.md` | completed / stop_review | pass_with_upstream_blockers | strict parse、结构/类型/范围/ref/敏感/交叉校验、builder target、cold activation 和 P0 reload/hot reject 已完成 | 进入 Step 10 |
| 10 | 变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | completed / stop_review | pass_with_upstream_blockers | 42 leaf 变更分组、actor/评审、safe audit、cold activation rollback、run/entry/test 回退、敏感轮换和 critical reject 已停审；允许进入 Step 11 |
| 11 | 失效与降级策略 | `04_config_step_11_failure_degradation.md` | completed / stop_review | pass_with_upstream_blockers | 缺失/错误/不可达/过期/漂移的 fail-fast、fail-closed、degraded、delayed、unknown、safe alert 与禁止 silent fallback 已停审；允许进入 Step 12 |
| 12 | 下游承接 | `04_config_step_12_downstream_handoff.md` | completed / stop_review | pass_with_upstream_blockers | 05/06/07/09 的配置输入、证据边界、禁止重复项和运维承接已停审；允许进入 Step 13 |
| 13 | 迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | completed / stop_review | pass_with_upstream_blockers | 当前无已发布旧配置迁移项；首版引入、重命名、废弃、兼容窗口、敏感 ref 迁移、`.qs-sync` 双轨边界和未来演进触发已停审；允许进入 Step 14 |
| 14 | 风险与待确认 | `04_config_step_14_risks_open_questions.md` | completed / stop_review | pass_with_upstream_blockers | Step 1～13 风险、待确认和 03 影响已汇总；当前 P0 无待回写/阻塞待确认项；允许进入 Step 15 |
| 15 | 正式文档装配 | `04_config_step_15_formal_document_assembly.md` | completed / stop_review | pass_with_upstream_blockers | 正式 04 已按 15 章装配、完成总审计并停审；下一动作只能是用户审阅正式 04，不得进入 05 |

未来 Step 文件不得提前创建或写占位。自动连续执行只免除逐 Step 人工确认，不免除逐 Step 落盘、门禁更新、自检和停审。

## 4. 当前 Step 开工确认

| 项目 | 当前值 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件已装配并停审） |
| 当前 Step | `15 / formal_document_assembly` |
| 当前模块 | 装配正式 04、完成跨配置域总审计与正式文档自检 |
| 当前模式 | `full-restart` |
| 项目级门禁 | pass；用户已明确授权完成全部 04 |
| 文档级门禁 | Step 15 已完成；正式 04 写入关闭，等待用户审阅 |
| Step 文件 | `04_config_step_15_formal_document_assembly.md` 已完成；正式 04 已在本 Step 装配 |
| 正式 04 写入 | `completed / closed` |
| 实现 / 测试 / commit | false / false / false |

## 5. 持续 blocker 与完成上限

- `SYNC-UP-001~010`：上游 SDK/source/access/review/probe/metadata/Git/comparator/tool contract 未因 04 启动而关闭。
- `SYNC-LOCAL-001~005`：Node/package manager/package/bin/parser/validator/test runner/Git library/SDK dependency syntax 仍为本地待确认；不属于 raw runtime config 就不得硬塞进配置项。
- 04 可以固定 raw JSON schema、source priority、profile 语义、ref-only sensitive handling、validation/activation/change/failure contract。
- 04 不能宣称 concrete adapter、secret provider、target repo、CI、test evidence 或 production profile 已建立。

## 6. 当前恢复点

```text
current_document = 04-配置设计.md
current_step = 15
current_module = formal_document_assembly (closed)
gate_status = pass_with_upstream_blockers
next_allowed_action = user_review_formal_04
formal_04_status = formal / stop_review
formal_04_calibration_write_allowed = completed / closed
formal_04_write_allowed = completed / closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
