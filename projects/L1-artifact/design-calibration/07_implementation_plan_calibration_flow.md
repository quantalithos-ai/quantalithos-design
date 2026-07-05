# L1-artifact 07 实施计划校准流程

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/实施计划书写规范.md`
> 目标正式文档: `projects/L1-artifact/07-实施计划.md`

## 1. 当前状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `07-实施计划.md` |
| 当前阶段 | Step 13 整理正式实施计划文档 |
| 当前状态 | Step 13 已完成;待用户审查 |
| 正式文档状态 | 已创建;待用户审查 |
| 当前设计 HEAD | `50c41bb` |
| 当前输入形态 | `00`~`07` 已存在;`07` 已完成正式装配,implementation ledger 与全部 boundary skeleton 已创建 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-artifact`;当前检查未发现 |

## 2. 工作方式

- 每个 Step 单独生成 `design-calibration/07_implementation_plan_step_*.md` 中间产物。
- 每个 Step 单独更新本 flow 状态和 `project_execution_ledger.md`。
- 正式 `07-实施计划.md` 不在早期 Step 零散改写;Step 13 根据 Step 1~12 中间产物装配。
- 每个 phase / commit boundary 必须由设计者在实现移交前完成可落码闭环审计和经验复核。
- 正式 `07` 必须承接 `代码实施台账与门禁规范.md`,预创建全部 planned boundary 台账骨架,未来 boundary 使用 `planned / wait_until_current`。
- 若拆 phase / commit boundary 时发现字段、DTO、状态、port、flow、evidence、scope 或 boundary 无法 1:1 闭合,必须回写设计真相源,不得要求实现 agent 自行补 schema、port、状态或边界。

## 3. 权威输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | 已存在 | 实施目标、五个核心能力、`FR-ART-*`、`BR-ART-*`、`NFR-ART-*`、`VF-ART-*` |
| `projects/L1-artifact/01-架构设计.md` | 已存在 | Artifact truth ownership、依赖裁剪、外部正文排除、只读消费和跨仓 seam |
| `projects/L1-artifact/02-概要设计.md` | 已存在 | 主要组成部分、接口骨架、状态集合、处理流和配置影响 |
| `projects/L1-artifact/03-详细设计.md` | 已存在 | 对象、port、protocol、flow、状态、事务、错误、幂等、观测与实施承接 |
| `projects/L1-artifact/04-配置设计.md` | 已存在 | P0 profiles、strict validation、source priority、redaction、degraded/no-write 和 replay 口径 |
| `projects/L1-artifact/05-测试方案.md` | 已存在 | `TC-ART-*`、blocking suite、artifact/report root、`EV-CAND-ART-*` 和回归策略 |
| `projects/L1-artifact/06-验收标准.md` | 已存在;用户已确认 Step 15 | `AC-ART-001~058`、`VETO-ART-001~009`、risk acceptance 和最终裁决口径 |
| `standards/document/实施计划讨论流程_SOP.md` | 标准输入 | Step 1~13 讨论顺序和中间产物要求 |
| `standards/document/实施计划书写规范.md` | 标准输入 | 正式 `07` 章节结构、commit boundary、门禁和永久记忆种子 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | phase / commit boundary 的可落码闭环审计和经验复核来源 |
| `standards/document/代码实施台账与门禁规范.md` | 标准输入 | implementation ledger、boundary ledger、Commit Gate、Handoff Gate |

## 4. Step 状态

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | [x] 已完成;用户审查通过 |
| Step 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | [x] 已完成;用户审查通过 |
| Step 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | [x] 已完成;用户审查通过 |
| Step 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_objects_deliverables.md` | [x] 已完成;用户审查通过 |
| Step 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | [x] 已完成;用户审查通过 |
| Step 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | [x] 已完成;用户审查通过 |
| Step 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | [x] 已完成;用户审查通过 |
| Step 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | [x] 已完成;用户审查通过 |
| Step 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | [x] 已完成;用户审查通过 |
| Step 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | [x] 已完成;用户审查通过 |
| Step 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | [x] 已完成;用户审查通过 |
| Step 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | [x] 已完成;用户审查通过 |
| Step 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | [x] 已完成;待用户审查 |

## 5. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| `06-验收标准.md` | 用户已确认 | Step 15 已完成,可进入 `07` |
| Step 1 中间产物 | 已审查通过 | 输入边界、缺失输入风险、闭环预判和是否可进入 Step 2 已整理 |
| Step 2 中间产物 | 已审查通过 | 实施目标、实施范围、非范围和 P1 / P2 防误入已整理 |
| Step 3 中间产物 | 已审查通过 | 前置阅读、阶段阅读矩阵、实施台账入口、永久记忆种子、git / 目录 / 依赖 / 脚本检查已整理 |
| Step 4 中间产物 | 已审查通过 | 实施对象、交付物、非交付物、跨仓 / 外部依赖交付物已整理 |
| Step 5 中间产物 | 已审查通过 | phase 顺序、五个核心能力映射、phase 停审和跨 phase 审计已整理 |
| Step 6 中间产物 | 已审查通过 | commit boundary、required_reads、Boundary Gate Matrix、经验复核、planned boundary 预创建规则已整理 |
| Step 7 中间产物 | 已审查通过 | phase / commit boundary 测试门禁、AC/VETO、candidate evidence、acceptance report 审查责任已整理 |
| Step 8 中间产物 | 已审查通过 | 配置项族、P0 profile、外部依赖、fake/controlled/replay seam、phase / boundary 级环境检查已整理 |
| Step 9 中间产物 | 已审查通过 | `SP-ART-*`、`R-ART-*`、`OQ-ART-*`、上游设计回写触发和跨风险审计已整理 |
| Step 10 中间产物 | 已审查通过 | pause / rollback / change / recovery、门禁失败处理、ledger 状态控制和恢复实施流程已整理 |
| Step 11 中间产物 | 已审查通过 | 提交纪律、message 结构、type/scope、boundary body 分组、提交前检查、评审和交付纪律已整理 |
| Step 12 中间产物 | 已审查通过 | 实施完成判定、闭环完成标准、交付实现前审计、交付证据项、未完成项处理和完成结论矩阵已整理 |
| Step 13 中间产物 | 已生成 | 正式章节来源映射、装配原则、评审清单和输出文件状态已整理 |
| 正式 `07` | 已创建 | `projects/L1-artifact/07-实施计划.md` 已装配,implementation ledger 与全部 planned boundary skeleton 已预创建 |
| 下一步 | 用户审查 Step 13 | 审查正式 `07`、项目级 implementation ledger 和 `commit-01-a`~`commit-08-b` boundary skeleton;确认后可按用户要求提交或移交实现 |
