# L1-process 04 配置设计校准工作台

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md`
> 书写规范: `standards/document/配置设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 目标正式文档: `projects/L1-process/04-配置设计.md`
> 创建日期: 2026-06-06
> 当前状态: Step 1~15 已完成;正式 04 已装配

---

## 1. 本轮目标

按配置设计 SOP 将新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 中已经收稳的配置影响、运行装配、adapter 绑定、外部依赖、测试切口和风险口径,转译成可被实现、测试、验收、实施和运维共同引用的 `04-配置设计.md`。

`04-配置设计.md` 此前不存在,本轮不从旧文档修补;当前已在 Step 15 由已确认的 `04_config_step_*` 中间产物装配完成。

---

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L1-process/00-需求文档.md` | 正式上游 | Process truth 边界、外部正文排除、安全 / 审计 / 恢复 / 配置红线 |
| `projects/L1-process/01-架构设计.md` | 正式上游 | 依赖方向、运行期接缝、横切关注点、配置不得绕过架构边界 |
| `projects/L1-process/02-概要设计.md` | 直接输入 | §11 配置影响轮廓、禁止配置化边界和详细设计承接方向 |
| `projects/L1-process/03-详细设计.md` | 直接输入 | §13 配置引用与外部依赖绑定、§15 测试切口、§17 风险 |
| `projects/L1-process/design-calibration/03_ddd_step_14_config_external_binding.md` | 字段级配置输入 | `ProcessRuntimeConfig`、配置引用表、adapter 绑定、topic / route binding 和 validation rules |
| `projects/L1-process/05-测试方案.md` | 下游待同步 | 旧 / 粗口径测试方向,不得作为配置事实源 |
| `projects/L1-process/06-验收标准.md` | 下游待同步 | 旧 / 粗口径验收方向,不得作为配置事实源 |

---

## 3. Step 状态表

| Step | 主题 | 中间产物 | 回填章节 | 状态 |
|---|---|---|---|---|
| Step 1 | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | §1 | [x] 已完成 |
| Step 2 | 明确配置设计目标、范围和非范围 | `04_config_step_02_scope.md` | §2 | [x] 已完成 |
| Step 3 | 建立配置控制面总览 | `04_config_step_03_control_plane_overview.md` | §3 | [x] 已完成 |
| Step 4 | 定义配置分类与禁止配置化边界 | `04_config_step_04_classification_boundaries.md` | §4 | [x] 已完成 |
| Step 5 | 定义配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | §5 | [x] 已完成 |
| Step 6 | 定义环境、部署 profile 与配置矩阵 | `04_config_step_06_profiles_matrix.md` | §6 | [x] 已完成 |
| Step 7 | 定义配置项清单 | `04_config_step_07_config_items.md` | §7 | [x] 已完成 |
| Step 8 | 定义敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | §8 | [x] 已完成 |
| Step 9 | 定义配置加载、校验与生效机制 | `04_config_step_09_load_validate_apply.md` | §9 | [x] 已完成 |
| Step 10 | 定义配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | §10 | [x] 已完成 |
| Step 11 | 定义失效模式与降级 / fail-fast 策略 | `04_config_step_11_failure_modes.md` | §11 | [x] 已完成 |
| Step 12 | 定义测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | §12 | [x] 已完成 |
| Step 13 | 定义配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | §13 | [x] 已完成 |
| Step 14 | 定义风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | §14 | [x] 已完成 |
| Step 15 | 整理正式配置设计文档 | `04_config_step_15_formal_document_assembly.md` | 全文 | [x] 已完成 |

---

## 4. 详细设计影响判定总览

| Step | 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|---|
| Step 1 | 确认 `04` 以新版 `00/01/02/03` 为配置事实输入,`05/06` 只作下游承接参考 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 2 | 确认 P0 配置聚焦 `ProcessRuntimeConfig` 已有 section 和 fake / in-memory / deterministic 默认可验证路径 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 3 | 建立配置来源链、runtime builder 装配入口和控制面总览,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 4 | 定义配置分类、冷 / job-run 生效口径和禁止配置化边界,承接已有红线 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 5 | 定义 defaults < JSON < env 的普通来源优先级,entry args 只作局部输入,并固定 CLI / env / binary 最小参数面 | 是 | entry binary 可落码契约 | `03-详细设计.md` §15 脚本 / entry 契约;`04` §5 | 已回写 |
| Step 6 | 定义 local-dev / ci-test / integration-like / operations-replay P0 profile,staging-like / production-like 后移;integration-like 使用 `ExternalAdapterKind::Controlled` | 是 | adapter kind enum 闭合 | `03_ddd_step_14_config_external_binding.md`;`04` §6 | 已回写 |
| Step 7 | 展开 `ProcessRuntimeConfig` 既有 10 个 section / 38 个 P0 配置项,给出默认值、来源、生效、失败策略和 JSONC 示例 | 否 | 配置默认值和文档示例,无代码契约变化 | 无 | 无回写 |
| Step 8 | 明确 ref-only sensitive、credential ref、endpoint ref、topic map、handoff target 和 forbidden output 的脱敏规则 | 否 | 配置安全语义,无代码契约变化 | 无 | 无回写 |
| Step 9 | 明确 defaults -> JSON -> env -> ref validation -> typed validation -> cross-field validation -> runtime builder 的加载链,P0 不支持核心 hot reload | 否 | 配置加载和生效规则,无代码契约变化 | 无 | 无回写 |
| Step 10 | 明确 P0 配置变更通过 defaults / JSON / env / entry local args 表达,冷重启或新 job run 生效,审计记录 redacted ref / digest / outcome | 否 | 配置变更、审计和回滚规则,无代码契约变化 | 无 | 无回写 |
| Step 11 | 明确缺失、错配、敏感 ref 不可读、unsupported source、topic map 缺失、retention 冲突和 forbidden boundary 的 fail-fast / fail-closed / degraded 策略 | 否 | 配置失效策略,无代码契约变化 | 无 | 无回写 |
| Step 12 | 明确 `05/06/07/09` 对配置场景、验收门禁、实施准备和运维细节的承接边界 | 否 | 文档承接规则,无代码契约变化 | 无 | 无回写 |
| Step 13 | 明确当前无已发布旧配置迁移项,未来新增 / 废弃 / 移除配置必须经 `04` 记录并按需回写 `03` | 否 | 配置演进规则,无代码契约变化 | 无 | 无回写 |
| Step 14 | 汇总 P1/P2 演进、下游同步和目标实现仓风险,确认 Step 1~13 无 `待回写` 或 `阻塞待确认` 的 03 影响项 | 否 | 风险收口,无代码契约变化 | 无 | 无回写 |
| Step 15 | 将 Step 1~14 已确认结论整理为正式 `04-配置设计.md`,使用配置设计 15 章主链并逐章标注校准来源 | 否 | 文档装配,无代码契约变化 | 无 | 无回写 |

---

## 5. 执行纪律

- 每个 Step 必须先形成中间产物,不得直接创建或修改正式 `04-配置设计.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含“对 03-详细设计的影响判定”。
- 正式 `04-配置设计.md` 的章节必须能追溯到具体 `design-calibration/04_config_step_*.md`。
- 如配置结论会改变 `ProcessRuntimeConfig`、runtime builder、adapter constructor、trait / port、error、DTO 或函数流,必须先回写 `03-详细设计.md`,不得在 `04` 中静默新增。
- 配置项不得绕过 Process truth 归属、外部正文排除、唯一编译期依赖、metadata / idempotency、audit / outbox、query no-write、projection 不反写和状态机红线。
- 生产 DB / MQ / endpoint / KMS 产品字段全集、部署命令、runbook、告警阈值和人员流程不在 `04` 中硬编码。
