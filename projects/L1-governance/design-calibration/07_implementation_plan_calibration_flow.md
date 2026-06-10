# 07 实施计划校准流程

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/实施计划书写规范.md`
> 目标正式文档: `projects/L1-governance/07-实施计划.md`

## 1. 当前状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `07-实施计划.md` |
| 当前阶段 | Step 13 整理正式实施计划文档 |
| 当前状态 | Step 13 已完成;待最终检查与用户审查 |
| 正式文档状态 | 已创建并按章节分批装配 |
| 当前设计 HEAD | `68eb677` |
| 当前输入形态 | `00`~`06` 已存在,其中 `04` 和大量 calibration 文件当前仍为未跟踪工作区内容 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-governance`;当前检查未发现 |

## 2. 工作方式

- 每个 Step 单独生成 `design-calibration/07_implementation_plan_step_*.md` 中间产物。
- 每个 Step 单独更新本 flow 状态。
- 每个 Step 保留 SOP 问题回答、当前文档问题诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项和进入下一步条件。
- 正式 `07-实施计划.md` 不在早期 Step 中零散改写;Step 13 先搭框架,再按章节分批装配。
- 长内容按 Step 或章节分批写入;内容应尽量详尽,超过合理单批规模时拆成多个批次,不得为了满足批次行数压缩内容。
- 每个 phase / commit boundary 的设计闭环复核和经验复核由设计者在实现移交前完成,不得留给实现 agent 现场补 schema、port、状态或 boundary。

## 3. 权威输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-governance/00-需求文档.md` | 已存在 | 实施目标、P0 / P1 / P2、非范围、验收红线 |
| `projects/L1-governance/01-架构设计.md` | 已存在 | 依赖方向、truth boundary、外部协作、架构红线 |
| `projects/L1-governance/02-概要设计.md` | 已存在 | 主要组成部分、接口骨架、状态与配置影响 |
| `projects/L1-governance/03-详细设计.md` | 已存在 | 对象、port、protocol、flow、状态、事务、错误、幂等、观测与实施承接 |
| `projects/L1-governance/04-配置设计.md` | 已存在但未跟踪 | 配置 profile、adapter binding、配置门禁和外部依赖准备 |
| `projects/L1-governance/05-测试方案.md` | 已存在 | 测试切口、suite、gate、artifact/report、EV 证据族 |
| `projects/L1-governance/06-验收标准.md` | 已存在 | 验收门禁、VETO、风险接受、最终裁决口径 |
| `standards/document/实施计划讨论流程_SOP.md` | 标准输入 | Step 1~13 讨论顺序和中间产物要求 |
| `standards/document/实施计划书写规范.md` | 标准输入 | 正式 `07` 章节结构、commit boundary、门禁和永久记忆种子 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | 每个 phase / commit boundary 的可落码闭环审计和经验复核来源 |

## 4. Step 状态

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | [x] 已完成;待用户审查 |
| Step 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | [x] 已完成;自动继续后续 Step |
| Step 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | [x] 已完成;自动继续后续 Step |
| Step 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_objects_deliverables.md` | [x] 已完成;自动继续后续 Step |
| Step 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | [x] 已完成;自动继续后续 Step |
| Step 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | [x] 已完成;自动继续后续 Step |
| Step 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | [x] 已完成;自动继续后续 Step |
| Step 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | [x] 已完成;自动继续后续 Step |
| Step 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | [x] 已完成;自动继续后续 Step |
| Step 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | [x] 已完成;自动继续后续 Step |
| Step 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | [x] 已完成;自动继续后续 Step |
| Step 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | [x] 已完成;自动继续后续 Step |
| Step 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | [x] 已完成;待用户审查 |

## 5. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 1 中间产物 | 已生成 | 输入边界、缺失输入风险、闭环预复核和是否可进入 Step 2 已整理 |
| Step 2 中间产物 | 已生成 | 实施目标、P0 范围、非范围和 P1 / P2 防误入口径已整理 |
| Step 3 中间产物 | 已生成 | 阅读清单、阶段阅读矩阵、永久记忆种子和前置检查表已整理 |
| Step 4 中间产物 | 已生成 | 实施对象、交付物、非交付物和跨仓依赖交付物已整理 |
| Step 5 中间产物 | 已生成 | PH-01~PH-08 阶段依赖、可验证增量、phase 停审和跨 phase 审计已整理 |
| Step 6 中间产物 | 已生成 | commit-01-a 到 commit-08-b 的任务、批次、提交边界、经验复核和停审记录已整理 |
| Step 7 中间产物 | 已生成 | 阶段门禁、commit boundary 门禁、证据归档、报告审查、失败处理和跨门禁审计已整理 |
| Step 8 中间产物 | 已生成 | 配置、环境、外部依赖、fake/controlled/disabled 边界、不可用处理和跨依赖审计已整理 |
| Step 9 中间产物 | 已生成 | Spike、blocker、风险、待确认事项、回写设计触发和跨风险审计已整理 |
| Step 10 中间产物 | 已生成 | 暂停、回退、变更控制、门禁失败处理、恢复流程和跨控制规则审计已整理 |
| Step 11 中间产物 | 已生成 | 提交纪律、message 结构、type/scope、body 分组、正反例、评审与交付检查已整理 |
| Step 12 中间产物 | 已生成 | 实施完成判定、闭环审计、交付证据项、未完成项处理和最终交付清单已整理 |
| Step 13 中间产物 | 已生成 | 正式文档装配原则、章节来源映射、写入批次、质量检查和用户偏好已整理 |
| 正式 `07` | 已创建 | 已按骨架优先、章节分批方式由 Step 1~12 中间产物装配 |
| 下一步 | 最终检查 | 对正式文档和 `07_implementation_plan_*` 中间产物执行格式、占位词和状态检查 |
