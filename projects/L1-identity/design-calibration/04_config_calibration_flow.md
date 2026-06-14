# L1-identity 配置设计校准工作台

> 对应正式文档: `projects/L1-identity/04-配置设计.md`
> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md`
> 书写规范: `standards/document/配置设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按新版正式 `03-详细设计.md` 复核并重写 `L1-identity` 的 `04-配置设计.md`
> 当前状态: Step 15 formal document assembly 已审核通过;本轮 `04-配置设计.md` 重写完成

---

## 1. 本轮重写原则

- 新版 `04` 必须直接承接已完成 Step 19.5 closure 的新版正式 `03-详细设计.md`,尤其是 §13 配置引用与外部依赖绑定、§17 风险与待确认事项和 §18 下游文档复核要求。
- 旧版 `04-配置设计.md` 和既有 `04_config_step_*.md` 只作为历史诊断输入,不得直接继承旧对象名、旧 command/job 名、旧 profile、旧 mock/stub 口径或旧配置项。
- 配置设计只定义配置语义、来源、优先级、校验、生效、失效、变更审计和下游承接,不得新增 `03` 未定义的 schema、port、state、error、DTO、runtime builder 签名或 flow。
- 影响 runtime config、builder、adapter constructor、trait / port、error、DTO 或 function flow 的配置结论,必须回写 `03-详细设计.md`;未回写前不得定稿正式 `04`。
- 配置控制面必须先从新版 `03` 的模块、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cut 推导,再列配置项。
- 本轮每个 Step 完成后停审;用户审核通过后再进入下一 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 新版草稿 | 需求边界输入;不重新定义需求目标 |
| `projects/L1-identity/01-架构设计.md` | 已完成 | 架构边界和依赖裁剪输入 |
| `projects/L1-identity/02-概要设计.md` | 新版草稿 | 配置影响轮廓输入 |
| `projects/L1-identity/03-详细设计.md` | Step 19.5 已完成,等待最终审核 | 新版 `04` 的直接上游和配置契约边界 |
| `projects/L1-identity/design-calibration/03_ddd_step_14_config_external_binding.md` | 已完成并已审核 | §13 配置绑定细节来源 |
| `projects/L1-identity/design-calibration/03_ddd_step_18_risks_open_questions.md` | 已完成并已审核 | 下游复核风险和待确认事项来源 |
| `standards/document/配置设计讨论流程_SOP.md` | 最新配置设计流程标准 | Step 1~15 执行依据 |
| `standards/document/配置设计书写规范.md` | 最新正式文档结构标准 | 正式 `04` 装配依据 |
| 旧 `04-配置设计.md` | 早于新版正式 `03` | 只作为历史诊断输入;不得直接继承 |
| 旧 `04_config_step_*.md` | 早于新版正式 `03` | 只作为历史诊断输入;必要时按 Step 重写 |
| 现有 `05/06/07` | 早于新版正式 `03/04` | 不作为新版 `04` 上游;后续需按新版 `04` 复核 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认配置输入边界 | 新版 `00/01/02/03`、旧 `04`、配置 SOP / 规范 | `04_config_step_01_upstream_boundary.md` | 无 | 已审核通过 | 上游关系、旧 `04` 降级、必须回答 / 不再回答、输入风险明确 | 已进入 Step 2 |
| 2 | 明确配置设计目标、范围和非范围 | Step 1、新版 `03` §13/17/18 | `04_config_step_02_scope.md` | Step 1 | 已审核通过 | P0/P1/P2 配置范围和无配置判定闭合 | 已进入 Step 3 |
| 3 | 建立配置控制面总览 | Step 2、新版 `03` modules/ports/entry | `04_config_step_03_control_plane.md` | Step 2 | 已审核通过 | 控制面来自详细设计绑定点,无旧名漂移 | 已进入 Step 4 |
| 4 | 定义配置分类与禁止配置化边界 | Step 3、新版 `03` invariants | `04_config_step_04_categories_boundaries.md` | Step 3 | 已审核通过 | 允许配置化 / 禁止配置化边界闭合 | 已进入 Step 5 |
| 5 | 定义配置来源、优先级与冲突处理 | Step 4 | `04_config_step_05_sources_priority_conflicts.md` | Step 4 | 已审核通过 | 来源覆盖、entry-local、test override 和 conflict fail-fast 闭合 | 已进入 Step 6 |
| 6 | 定义环境、部署 profile 与配置矩阵 | Step 5 | `04_config_step_06_environment_profiles_matrix.md` | Step 5 | 已审核通过 | profile 与 adapter mode 分离,旧环境口径只作历史输入 | 已进入 Step 7 |
| 7 | 定义配置项清单 | Step 3~6 | `04_config_step_07_config_items.md` | Step 6 | 已审核通过 | 每项有类型、默认、必填、来源、作用域、生效、敏感、失败策略和关联模块 | 已进入 Step 8 |
| 8 | 定义敏感配置与密钥管理 | Step 7 | `04_config_step_08_sensitive_secrets.md` | Step 7 | 已审核通过 | secret ref、raw secret 禁止输出和审计边界闭合 | 已进入 Step 9 |
| 9 | 定义配置加载、校验与生效机制 | Step 7~8 | `04_config_step_09_loading_validation_activation.md` | Step 8 | 已审核通过 | parse/type/range/cross-field validation、freeze timing 和 runtime builder handoff 闭合 | 已进入 Step 10 |
| 10 | 定义配置变更、审计与回滚 | Step 9 | `04_config_step_10_change_audit_rollback.md` | Step 9 | 已审核通过 | P0 hot reload、change audit、rollback 口径闭合 | 已进入 Step 11 |
| 11 | 定义失效模式与降级 / fail-fast 策略 | Step 9~10 | `04_config_step_11_failure_degradation.md` | Step 10 | 已审核通过 | startup fail-fast、job reject、entry reject、disabled/degraded/unavailable surface 闭合 | 已进入 Step 12 |
| 12 | 定义测试、验收、实施与运维承接 | Step 1~11 | `04_config_step_12_downstream_handoff.md` | Step 11 | 已审核通过 | `05/06/07/09` 承接输入明确,不写正式测试或实施 boundary | 已进入 Step 13 |
| 13 | 定义配置迁移、废弃与演进 | Step 12、旧 `04/05/06/07` | `04_config_step_13_migration_deprecation_evolution.md` | Step 12 | 已审核通过 | 旧配置名、旧 profile、旧 adapter 口径迁移规则明确 | 已进入 Step 14 |
| 14 | 风险与待确认事项 | Step 1~13 | `04_config_step_14_risks_open_questions.md` | Step 13 | 已审核通过 | 风险、待确认、`03` 回写清单和阻塞项闭合 | 已进入 Step 15 |
| 15 | 整理正式配置设计文档 | Step 1~14、书写规范 | `04_config_step_15_formal_document_assembly.md` 与 `../04-配置设计.md` | Step 14 | 已审核通过 | 正式 `04` 每章有校准来源,无未处理 `03` 回写项 | 本轮 `04` 完成 |

---

## 4. Step 内统一执行模板

每个 `04_config_step_*` 文件必须按以下结构落盘:

1. Step 状态
2. 本步输入
3. SOP 问题回答
4. 当前文档问题诊断
5. 改动前后对比
6. 配置设计取舍
7. 结构化中间产物
8. 对详细设计的影响判定
9. 回填草稿
10. 待确认事项
11. 进入下一步条件

涉及配置域 / 配置项的 Step 必须按配置控制面 -> 配置域 -> 配置项小循环展开,不得先生成全局配置项大表再事后补来源、优先级、敏感性和加载校验。

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| ID-CFG-WATCH-001 | 旧 `04` 使用旧 command / job 名 | 旧 `04` 诊断 | 新版 Step 1 降级为历史输入 |
| ID-CFG-WATCH-002 | 新版正式 `03` Command / Job 名已变为 `EstablishGlobalMember`、`PublishIdentityOutbox`、`RebuildIdentityProjection` 等 | 新版 `03` §6~§8 | 后续 Step 2~7 必须使用新版名称 |
| ID-CFG-WATCH-003 | 旧 `04` 可能包含旧 lifecycle / governance basis 口径 | 新版 `03` §7~§13 | 后续必须以 `UpdateGlobalLifecycleState` 和 `GovernanceBasisSummary` 等新版 surface 复核 |
| ID-CFG-WATCH-004 | profile 与 adapter mode 仍需重新裁决是否沿用旧四 profile | 新版 `03` §13 / 配置 SOP | Step 6 重新闭口,不得直接继承旧 `04` |
| ID-CFG-WATCH-005 | 下游 `05/06/07` 早于新版正式 `03/04` | 新版 `03` §17/18 | Step 12~14 记录承接和风险 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `04-配置设计.md` | Step 15 已按 Step 1~14 装配并审核通过 |
| 当前完成 Step | Step 15 formal document assembly 已审核通过 |
| 当前下一步 | 本轮 `04` 重写完成;等待后续下游任务 |
| 是否创建 / 替换未来 Step 文件 | 未创建未来 Step |
| 旧 `04_config_step_*.md` 如何处理 | 只作历史诊断;到对应 Step 时按新版 `03` 重写 |
