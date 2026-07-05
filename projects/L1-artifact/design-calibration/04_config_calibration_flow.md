# L1-artifact 04 配置设计校准流程

> 对应正式文档: `projects/L1-artifact/04-配置设计.md`
> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md`
> 书写规范: `standards/document/配置设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按新版正式 `00/01/02/03` 复核并重写 `L1-artifact` 的 `04-配置设计.md`
> 当前状态: Step 15 已完成;等待用户审查正式 `04-配置设计.md`

---

## 1. 本轮重写原则

- 新版 `04` 必须直接承接正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md`,尤其是 `03` §13 配置引用与外部依赖绑定、§17 风险与待确认事项。
- 旧版 `04-配置设计.md` 与旧 `04_config_*` 只作为历史诊断输入,不得直接继承旧配置项、旧 profile、旧 secret 口径、旧 adapter 绑定或旧环境矩阵。
- 配置设计只定义配置语义、来源、优先级、校验、生效、失效、变更审计和下游承接,不得新增 `03` 未定义的 schema、port、state、error、DTO、runtime builder 签名或 flow。
- 影响 runtime config、builder、adapter constructor、trait / port、error、DTO 或 function flow 的配置结论,必须回写 `03-详细设计.md`;未回写前不得定稿正式 `04`。
- 配置控制面必须先从正式 `03` 的模块、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cut 推导,再列配置项。
- 本轮每个 Step 完成后停审;用户审核通过后再进入下一 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | 新版正式文档 | 需求边界输入;不重新定义需求目标 |
| `projects/L1-artifact/01-架构设计.md` | 已完成 | 架构边界和依赖裁剪输入 |
| `projects/L1-artifact/02-概要设计.md` | 已完成 | 配置影响轮廓输入 |
| `projects/L1-artifact/03-详细设计.md` | Step 19 已完成,等待用户审查 | 新版 `04` 的直接上游和配置契约边界 |
| `projects/L1-artifact/design-calibration/03_ddd_step_14_config_external_binding.md` | 已完成 | §13 配置绑定细节来源 |
| `projects/L1-artifact/design-calibration/02_hld_step_11_configuration_impact.md` | 已完成 | 概要层配置影响轮廓来源 |
| `standards/document/配置设计讨论流程_SOP.md` | 最新配置设计流程标准 | Step 1~15 执行依据 |
| `standards/document/配置设计书写规范.md` | 最新正式文档结构标准 | 正式 `04` 装配依据 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物和台账规范 | Step / flow / project ledger 纪律依据 |
| 旧 `04-配置设计.md` | 早于新版正式 `03` | 只作为历史诊断输入;不得直接继承 |
| 旧 `04_config_step_*.md` | 早于新版正式 `03` | 只作为历史诊断输入;必要时按 Step 重写 |
| 现有 `05/06/07` | 早于新版正式 `03/04` | 不作为新版 `04` 上游;后续需按新版 `04` 复核 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认配置输入边界 | 新版 `00/01/02/03`、旧 `04`、配置 SOP / 规范 | `04_config_step_01_upstream_boundary.md` | 无 | 已完成 | 上游关系、旧 `04` 降级、必须回答 / 不再回答、输入风险明确 | 待用户审查 |
| 2 | 明确配置设计目标、范围和非范围 | Step 1、新版 `03` §13/17/18 | `04_config_step_02_scope.md` | Step 1 | 已完成;待用户审查 | P0/P1/P2 配置范围和无配置判定闭合 | 待用户审查 |
| 3 | 建立配置控制面总览 | Step 2、新版 `03` modules/ports/entry | `04_config_step_03_control_plane.md` | Step 2 | 已完成;待用户审查 | 控制面来自详细设计绑定点,无旧名漂移 | 待用户审查 |
| 4 | 定义配置分类与禁止配置化边界 | Step 3、新版 `03` invariants | `04_config_step_04_categories_boundaries.md` | Step 3 | 已完成;待用户审查 | 允许配置化 / 禁止配置化边界闭合 | 待用户审查 |
| 5 | 定义配置来源、优先级与冲突处理 | Step 4 | `04_config_step_05_sources_priority_conflicts.md` | Step 4 | 已完成;待用户审查 | 来源覆盖、entry-local、test override 和 conflict fail-fast 闭合 | 待用户审查 |
| 6 | 定义环境、部署 profile 与配置矩阵 | Step 5 | `04_config_step_06_environment_profiles_matrix.md` | Step 5 | 已完成;待用户审查 | profile 与 adapter mode 分离,旧环境口径只作历史输入 | 待用户审查 |
| 7 | 定义配置项清单 | Step 3~6 | `04_config_step_07_config_items.md` | Step 6 | 已完成;待用户审查 | 每项有类型、默认、必填、来源、作用域、生效、敏感、失败策略和关联模块 | 待用户审查 |
| 8 | 定义敏感配置与密钥管理 | Step 7 | `04_config_step_08_sensitive_secrets.md` | Step 7 | 已完成;待用户审查 | secret ref、raw secret 禁止输出和审计边界闭合 | 待用户审查 |
| 9 | 定义配置加载、校验与生效机制 | Step 7~8 | `04_config_step_09_loading_validation_activation.md` | Step 8 | 已完成;待用户审查 | parse/type/range/cross-field validation、freeze timing 和 runtime builder handoff 闭合 | 待用户审查 |
| 10 | 定义配置变更、审计与回滚 | Step 9 | `04_config_step_10_change_audit_rollback.md` | Step 9 | 已完成;待用户审查 | P0 hot reload、change audit、rollback 口径闭合 | 待用户审查 |
| 11 | 定义失效模式与降级 / fail-fast 策略 | Step 9~10 | `04_config_step_11_failure_degradation.md` | Step 10 | 已完成;待用户审查 | startup fail-fast、job reject、entry reject、disabled/degraded/unavailable surface 闭合 | 待用户审查 |
| 12 | 定义测试、验收、实施与运维承接 | Step 1~11 | `04_config_step_12_downstream_handoff.md` | Step 11 | 已完成;待用户审查 | `05/06/07/09` 承接输入明确,不写正式测试或实施 boundary | 待用户审查 |
| 13 | 定义配置迁移、废弃与演进 | Step 12、旧 `04/05/06/07` | `04_config_step_13_migration_deprecation_evolution.md` | Step 12 | 已完成;待用户审查 | 当前是否存在迁移项、新配置引入规则、废弃/移除规则、future evolution queue 和 migration evidence 闭合 | 待用户审查 |
| 14 | 风险与待确认事项 | Step 1~13 | `04_config_step_14_risks_open_questions.md` | Step 13 | 已完成;待用户审查 | 风险、待确认、`03` 回写清单和阻塞项闭合,且当前 P0 无待回写与阻塞待确认项 | 待用户审查 |
| 15 | 整理正式配置设计文档 | Step 1~14、书写规范 | `04_config_step_15_formal_document_assembly.md` 与 `../04-配置设计.md` | Step 14 | 已完成;待用户审查 | 正式 `04` 每章有校准来源、含配置项总表/模块 demo/完整 JSONC 示例,且当前 P0 无未处理 `03` 回写项 | 待用户审查 |

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
| ART-CFG-WATCH-001 | 旧 `04` 可能包含旧对象名、旧 profile、旧 secret 口径 | 旧 `04` 诊断 | Step 1 降级为历史输入 |
| ART-CFG-WATCH-002 | 新版正式 `03` 已收稳 runtime config / adapter binding / external dependency 口径 | 新版 `03` §13 / §17 | 后续 Step 2~7 必须使用新版名称 |
| ART-CFG-WATCH-003 | `05/06/07` 早于新版正式 `03/04` | 新版 `03` §17/18 | Step 12~14 记录承接和风险 |
| ART-CFG-WATCH-004 | profile 与 adapter mode 必须从 `03` 绑定点重新裁决 | 新版 `03` §13 / 配置 SOP | Step 6 重新闭口 |
| ART-CFG-WATCH-005 | 影响 `03` 的配置结论必须先回写,不得在 `04` 中静默新增 | 配置 SOP / 书写规范 | Step 1~15 全程遵守 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `04-配置设计.md` | created |
| 当前完成 Step | Step 15 已完成;等待用户审查正式 `04-配置设计.md` |
| 当前下一步 | 审查正式 `04-配置设计.md`;通过后进入 `05-测试方案.md` Step 1 |
| 是否创建 / 替换未来 Step 文件 | 已创建 `04_config_step_08_sensitive_secrets.md`、`04_config_step_09_loading_validation_activation.md`、`04_config_step_10_change_audit_rollback.md`、`04_config_step_11_failure_degradation.md`、`04_config_step_12_downstream_handoff.md`、`04_config_step_13_migration_deprecation_evolution.md`、`04_config_step_14_risks_open_questions.md`、`04_config_step_15_formal_document_assembly.md` 和正式 `../04-配置设计.md` |
| 旧 `04_config_step_*.md` 如何处理 | 只作历史诊断;到对应 Step 时按新版 `03` 重写 |
