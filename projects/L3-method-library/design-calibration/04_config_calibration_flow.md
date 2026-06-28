# L3-method-library 04-配置设计校准流程

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md`
> 书写规范: `standards/document/配置设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-method-library/04-配置设计.md`
> 创建日期: 2026-06-24
> 当前模式: full-restart
> 当前状态: Step 15 `R15.18 全文自检与最终停审:再写入` completed_wait_user_confirm_to_05;`04-配置设计.md` full-restart formal assembly completed;等待用户确认进入 `05-测试方案.md` full-restart 开工

---

## 1. 本轮目标

按配置设计 SOP 将当前已完成 full-restart 的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md` 中的配置控制面输入,转译为可追溯、可测试、可验收、可实施承接的 `04-配置设计.md`。

当前 `projects/L3-method-library/04-配置设计.md` 已在 R15.18 完成 full-restart formal assembly。后续 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 必须按各自 SOP 继续重启,不得从旧下游材料反向覆盖当前 `03/04`。

---

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 正式上游 | 仓定位、非功能、安全、依赖裁剪、数据边界、接口与依赖、验收红线 |
| `projects/L3-method-library/01-架构设计.md` | 正式上游 | 架构边界、依赖方向、数据所有权、外部协作、横切关注点 |
| `projects/L3-method-library/02-概要设计.md` | 正式上游 | 配置影响轮廓、禁止配置化边界、处理流 / 状态 / 异常承接 |
| `projects/L3-method-library/03-详细设计.md` | 直接输入 | §13 config binding、runtime builder、adapter availability、external dependency、§16 handoff、§17 risks |
| `projects/L3-method-library/design-calibration/03_ddd_step_14_config_dependencies.md` | 直接输入 | 详细设计中配置引用与外部依赖绑定的字段级来源 |
| `projects/L3-method-library/design-calibration/02_hld_step_11_configuration_impact.md` | 解释性输入 | 概要层配置影响轮廓来源;若与正式 `02` 冲突,以正式 `02` 为准 |
| `projects/L3-method-library/05-测试方案.md` | 旧 / 待重启方向输入 | 只作为测试环境与配置矩阵方向输入;不得覆盖当前 `03/04` |
| `projects/L3-method-library/06-验收标准.md` | 旧 / 待重启方向输入 | 只作为验收环境与配置门禁方向输入;不得覆盖当前 `03/04` |
| `projects/L3-method-library/07-实施计划.md` | 旧 / 待重启方向输入 | 不作为配置项真相源;后续需按当前 `03/04/05/06` 重启 |
| `projects/L1-governance/design-calibration/04_config_*` | framework_reference | 只参考配置设计框架深度和门禁表达,不得复制 governance 领域事实 |

---

## 3. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 当前 Step 文件 |
|---|---|---|---|---|---|
| Step 15 整理正式配置设计文档 | `R15.18 全文自检与最终停审:再写入` | completed_wait_user_confirm_to_05 | R15.18 已完成正式 `04-配置设计.md` final self-check、顶部 completed 状态、Step 15 completed stop-review、flow 和 project ledger completed 同步。 | `04-配置设计.md` full-restart formal assembly completed;等待用户确认后进入 `05-测试方案.md` full-restart 开工;只允许按测试方案 SOP 创建 / 更新 `05` 的 calibration flow 和 Step 1 开工记录;不得直接写实现仓代码、正式验收标准、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 | `design-calibration/04_config_step_15_formal_document_assembly.md`;`../04-配置设计.md` |

---

## 4. Step 状态表

| Step | 主题 | 中间产物 | 状态 | 当前门禁 |
|---|---|---|---|---|
| Step 1 | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | [x] completed | R1.8_completed_wait_user_confirm_to_R2.1 |
| Step 2 | 明确配置设计目标、范围和非范围 | `04_config_step_02_scope.md` | [x] completed | R2.10_completed_wait_user_confirm_to_R3.1 |
| Step 3 | 建立配置控制面总览 | `04_config_step_03_control_plane.md` | [x] completed | R3.10_completed_wait_user_confirm_to_R4.1 |
| Step 4 | 定义配置分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | [x] completed | R4.10_completed_wait_user_confirm_to_R5.1 |
| Step 5 | 定义配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | [x] completed | R5.10_completed_wait_user_confirm_to_R6.1 |
| Step 6 | 定义环境、部署 profile 与配置矩阵 | `04_config_step_06_environment_profiles_matrix.md` | [x] completed | R6.16_completed_wait_user_confirm_to_R7.1 |
| Step 7 | 定义配置项清单 | `04_config_step_07_config_items.md` | [x] completed | R7.12_completed_wait_user_confirm_to_R8.1 |
| Step 8 | 定义敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | [x] completed | R8.4_completed_wait_user_confirm_to_R9.1 |
| Step 9 | 定义配置加载、校验与生效机制 | `04_config_step_09_loading_validation_activation.md` | [x] completed | R9.4_completed_wait_user_confirm_to_R10.1 |
| Step 10 | 定义配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | [x] completed | R10.20_completed_wait_user_confirm_to_R11.1 |
| Step 11 | 定义失效模式与降级 / fail-fast 策略 | `04_config_step_11_failure_degradation.md` | [x] completed | R11.20_completed_wait_user_confirm_to_R12.1 |
| Step 12 | 定义测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | [x] completed | R12.22_completed_wait_user_confirm_to_R13.1 |
| Step 13 | 定义配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | [x] completed | R13.10_completed_wait_user_confirm_to_R14.1 |
| Step 14 | 定义风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | [x] completed | R14.30_completed_wait_user_confirm_to_R15.1 |
| Step 15 | 整理正式配置设计文档 | `04_config_step_15_formal_document_assembly.md` | [x] completed | R15.18_completed_wait_user_confirm_to_05 |

---

## 5. 执行纪律

- 每次继续、同意、上下文恢复或 agent 切换时,必须先读取 `project_execution_ledger.md`,再读取本 flow 和当前 Step 文件。
- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 内必须先搭建整体模块,再逐模块执行“先思考 -> 再写入”。
- 用户每次确认只推进一个当前模块,不得把多个模块自动合并。
- 正式 `04-配置设计.md` 必须在 Step 15 由已确认的 Step 1~14 中间产物装配,不得在 Step 1 直接写正式文档。
- 每个 Step 都必须包含“对详细设计的影响判定”。若配置结论改变 `03-详细设计.md` 的 runtime config、builder、adapter constructor、trait / port、error、函数流或 DTO,必须回写 `03` 或标记阻塞待确认。
- 配置设计不得用配置开关改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule 或 P0 / P1 范围隔离。
- 单次写入以 100~300 行为宜;这是写入批次规模,不是文件最终长度上限。
- 即使后续 Step 2 判断本仓无配置,也必须按 SOP 生成必要中间产物和正式无配置说明文档。

---

## 6. 历史材料处理

| 材料 | 当前定位 | 使用方式 |
|---|---|---|
| R15.18 `04-配置设计.md` | formal_completed | 已完成 §1~§15 正文装配、final self-check 和 Step 15 completed stop-review。 |
| 旧 `05-测试方案.md` | old_direction_input | 只作测试环境方向输入;不得反向定义配置项、fixture 或 evidence schema。 |
| 旧 `06-验收标准.md` | old_direction_input | 只作验收环境和门禁方向输入;不得反向定义配置通过标准。 |
| 旧 `07-实施计划.md` | old_direction_input | 不作为 phase / commit / config key 真相源;后续必须重启。 |
| L1-governance 04 文件 | framework_reference | 只参考流程、表格和门禁深度,不得复制领域配置项。 |

---

## 7. 当前 next_allowed_action

`04-配置设计.md` full-restart formal assembly completed;
等待用户确认后进入 `05-测试方案.md` full-restart 开工;
只允许按测试方案 SOP 创建 / 更新 `05` 的 calibration flow 和 Step 1 开工记录;
不得直接写实现仓代码、正式验收标准、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。
