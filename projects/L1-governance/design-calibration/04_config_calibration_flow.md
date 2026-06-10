# L1-governance 04 配置设计校准工作台

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/配置设计书写规范.md`
> 目标正式文档: `projects/L1-governance/04-配置设计.md`
> 创建日期: 2026-06-09
> 当前状态: Step 1~15 已完成;正式 `04-配置设计.md` 已生成,等待用户审查

---

## 1. 本轮目标

按配置设计 SOP 将新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 中已经收稳的配置线索转译成正式 `04-配置设计.md`。

正式 `04-配置设计.md` 已在 Step 15 由 Step 1~14 中间产物装配生成。本轮不得从旧测试方案、旧验收标准或实现侧假设直接生成配置项。配置设计必须先确认配置输入边界,再逐步收敛配置控制面、配置域、配置项、来源优先级、敏感配置、加载校验、变更审计、失效策略和下游承接。

---

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 正式上游 | 需求边界、非功能、安全、数据归属、外部依赖和验收红线 |
| `projects/L1-governance/01-架构设计.md` | 正式上游 | 架构边界、依赖裁剪、外部依赖、横切约束和产品中立口径 |
| `projects/L1-governance/02-概要设计.md` | 正式上游 | 配置影响轮廓、禁止配置化边界、详细设计承接清单 |
| `projects/L1-governance/03-详细设计.md` | 直接输入 | 配置引用、runtime builder、adapter、external dependency、状态、错误、测试切口 |
| `projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md` | 直接输入 | 详细设计中配置引用与外部依赖绑定的字段级来源 |
| `projects/L1-governance/05-测试方案.md` | 旧 / 待复核草案 | 只作为测试方向输入;不得覆盖新版 `03` |
| `projects/L1-governance/06-验收标准.md` | 旧 / 待复核草案 | 只作为验收方向输入;不得覆盖新版 `03` |

---

## 3. Step 状态表

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | [x] 已完成 |
| Step 2 | 明确配置设计目标、范围和非范围 | `04_config_step_02_scope.md` | [x] 已完成 |
| Step 3 | 建立配置控制面总览 | `04_config_step_03_control_plane.md` | [x] 已完成 |
| Step 4 | 定义配置分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | [x] 已完成 |
| Step 5 | 定义配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | [x] 已完成 |
| Step 6 | 定义环境、部署 profile 与配置矩阵 | `04_config_step_06_environment_profiles_matrix.md` | [x] 已完成 |
| Step 7 | 定义配置项清单 | `04_config_step_07_config_items.md` | [x] 已完成 |
| Step 8 | 定义敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | [x] 已完成 |
| Step 9 | 定义配置加载、校验与生效机制 | `04_config_step_09_loading_validation_activation.md` | [x] 已完成 |
| Step 10 | 定义配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | [x] 已完成 |
| Step 11 | 定义失效模式与降级 / fail-fast 策略 | `04_config_step_11_failure_degradation.md` | [x] 已完成 |
| Step 12 | 定义测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | [x] 已完成 |
| Step 13 | 定义配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | [x] 已完成 |
| Step 14 | 定义风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | [x] 已完成 |
| Step 15 | 整理正式配置设计文档 | `04_config_step_15_formal_document_assembly.md` | [x] 已完成 |

---

## 4. 执行纪律

- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 完成后暂停,由用户审查后再进入下一 Step。
- 正式 `04-配置设计.md` 必须在 Step 15 由已完成的 Step 中间产物装配,不得提前直接写正式文档。
- 每个 Step 都必须包含“对详细设计的影响判定”。
- 若配置结论改变 `03-详细设计.md` 的 runtime config、builder、adapter constructor、trait / port、error、函数流或 DTO,必须回写 `03` 或标记阻塞待确认。
- 配置设计不得用配置开关改变 truth 归属、正文排除、状态机红线、query no-write、projection 不反写、outbox snapshot 来源、idempotency replay 或 external GRC 不定义 truth。
