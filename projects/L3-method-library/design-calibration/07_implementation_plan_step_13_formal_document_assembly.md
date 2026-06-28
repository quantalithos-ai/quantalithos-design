# Step 13. 整理正式实施计划文档

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 13
> 回填章节: `projects/L3-method-library/07-实施计划.md`
> 当前模块: `R13.1 formal document assembly:正式装配`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 整理正式实施计划文档 |
| 当前模块 | `R13.1 formal document assembly:正式装配` |
| 当前状态 | completed |
| 输入基线 | Step 1~Step 12 中间产物;`standards/document/实施计划书写规范.md`;当前 `00`~`06` |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`;`projects/L3-method-library/07-实施计划.md` |
| 停审方式 | 正式 `07` 已完成装配,等待用户审阅或提交指令 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1 输入边界 | completed_confirmed | 装配正式 §1 |
| Step 2 范围 | completed_confirmed | 装配正式 §2 |
| Step 3 前置条件与阅读清单 | completed_confirmed | 装配正式 §3 |
| Step 4 实施对象与交付物 | completed_confirmed | 装配正式 §4 |
| Step 5 阶段与依赖顺序 | completed_confirmed | 装配正式 §5 |
| Step 6 任务、编写顺序与提交边界 | completed_confirmed | 装配正式 §6 |
| Step 7 测试与验收门禁 | completed_confirmed | 装配正式 §7 |
| Step 8 配置、环境与外部依赖 | completed_confirmed | 装配正式 §8 |
| Step 9 Spike、风险与待确认事项 | completed_confirmed | 装配正式 §9 |
| Step 10 回退、暂停与变更控制 | completed_confirmed | 装配正式 §10 |
| Step 11 提交、评审与交付纪律 | completed_confirmed | 装配正式 §11 |
| Step 12 实施完成判定 | completed_confirmed | 装配正式 §12 |
| `standards/document/实施计划书写规范.md` | 已读取 | 校验正式章节结构、边界和提交纪律 |

## 3. SOP 问题回答

1. 正式文档是否完整覆盖书写规范章节主链。

   回答: 是。正式 `07-实施计划.md` 已包含文档元信息、§1~§13,并覆盖输入边界、范围、前置阅读、交付物、phase、commit boundary、测试验收门禁、配置环境依赖、风险、回退变更、提交纪律、完成判定和参考。

2. 每一章是否来自已确认中间产物。

   回答: 是。§1~§12 分别来自 Step 1~Step 12;§13 来自本 Step 的来源映射和标准引用。每章均列出校准来源。

3. 阶段编号、任务编号和门禁编号是否一致。

   回答: 是。正式文档沿用 PH-01~PH-11、commit-01-a~commit-11-b、SP-ML / R-ML / VETO-ML / EV-ML / TC-ML 口径,未恢复旧 MethodContent / GATE-T / AC-P0 编号体系。

4. 上游引用、测试引用和验收引用是否准确。

   回答: 正式文档引用 current `00`~`06`、`07_implementation_plan_*` 和 standards;不复制详细设计字段级契约,只保留实施所需索引和门禁。

5. 是否存在详细设计内容被复制进实施计划。

   回答: 未复制完整 object、DTO、port、flow、DDL 或状态矩阵;正式文档只保留 implementation phase / boundary / gate / risk / evidence / completion discipline。

6. 每个 phase / commit boundary 是否都有开工前字段、DTO、状态、证据和 phase boundary 复核。

   回答: §6.2 固定通用设计闭环复核;§6.3 固定 25 个 candidate boundary;§12.2 固定 boundary 完成条件。

7. 正式 `07` 是否包含交付实现前可落码闭环审计门禁。

   回答: 是。§3.4 包含永久记忆种子;§6.2 / §12.1 / §12.2 固定 design closure、boundary gate 和完成判定。

8. 是否存在未解释的空表、空图或占位内容。

   回答: 未保留空表。`<run_id>` 是执行期变量,不是未填占位。

## 4. 当前文档问题诊断

| 位置 | 装配前问题 | 装配结果 |
|---|---|---|
| 正式 `07-实施计划.md` | 旧 publish/snapshot/outbox/PostgreSQL/GATE-T 主线 | 已替换为 current `00`~`06` 的 method asset truth center 实施计划 |
| Step 1~12 | 分散在中间产物 | 已装配为正式 §1~§12,并保留来源回指 |
| Step 6 | candidate boundary 细节较多 | 正式 §6 保留通用写入顺序、闭环复核、25 个 boundary 和 ledger hook |
| Step 7 | 门禁矩阵较长 | 正式 §7 保留输出规则、phase gate 和 VETO 前置规避 |
| Step 12 | 完成判定为执行期判定 | 正式 §12 只写可送验标准,不填写假结果 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 正式 `07` 状态 | old_direction_input | full-restart formal assembly |
| 实施目标 | 旧 P0 publish / snapshot / outbox 主线 | L3 method asset definition truth center |
| 阶段 | PH-01~PH-08 旧发布同步阶段 | PH-01~PH-11 当前能力纵切 |
| 提交边界 | 旧 commit 切分 | commit-01-a~commit-11-b 25 个 candidate boundary |
| 证据路径 | 旧 GATE-T / reports 方向 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 完成判定 | 旧 AC-P0 口径 | P0 coverage、VETO、evidence integrity、design closure 和 boundary gate |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 全量复制 Step 1~12 | 信息完整 | 正式文档过长且重复中间产物 | 不采用 |
| 只写极简摘要 | 文档短 | implementation agent 缺少可执行边界 | 不采用 |
| 正式文档保留执行摘要,细节回指中间产物 | 可读且可追溯 | 需要准确来源映射 | 采用 |
| 现在创建真实 implementation ledger | 看似方便 | Step 13 只装配正式计划,不执行实现移交实例化 | 不采用 |

## 7. 结构化中间产物

### 7.1 正式章节来源映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `07_implementation_plan_step_01_input_boundary.md` |
| §2 实施目标与范围 | `07_implementation_plan_step_02_scope.md` |
| §3 实施前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` |
| §4 实施对象与交付物清单 | `07_implementation_plan_step_04_objects_deliverables.md` |
| §5 实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` |
| §6 阶段任务拆分、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| §7 测试与验收门禁嵌入 | `07_implementation_plan_step_07_test_acceptance_gates.md` |
| §8 配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` |
| §9 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` |
| §10 回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` |
| §11 提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` |
| §12 实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` |
| §13 参考 | `07_implementation_plan_step_13_formal_document_assembly.md` |

### 7.2 装配检查清单

| 检查项 | 结论 |
|---|---|
| 章节完整性 | 通过 |
| 每章校准来源 | 通过 |
| PH-01~PH-11 一致 | 通过 |
| commit-01-a~commit-11-b 一致 | 通过 |
| Step 7 门禁摘要保留 | 通过 |
| Step 9 blocker/residual/OQ 保留 | 通过 |
| Step 10 pause/rollback/change/recovery 保留 | 通过 |
| Step 11 实现仓英文 commit 和 body 分组规则保留 | 通过 |
| Step 12 evidence、VETO、design closure audit 保留 | 通过 |
| 无空表 / 未解释占位 | 通过 |

## 8. 回填草稿

本 Step 已直接回填正式 `projects/L3-method-library/07-实施计划.md`。不再另给草稿。

## 9. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 是否提交本轮 `07` 文档 | 等待用户明确提交指令 |
| 是否创建真实 implementation ledger / boundary ledger | 当前未创建;应在实现移交前按正式 `07` 和台账规范创建 |
| 是否需要继续精简正式文档 | 正式文档保留执行摘要,详细内容在中间产物 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 12 已确认 | 通过 | 用户已确认 |
| 正式 `07` 已装配 | 通过 | `projects/L3-method-library/07-实施计划.md` 已替换旧方向 |
| 章节来源映射完成 | 通过 | §7.1 |
| 装配检查清单完成 | 通过 | §7.2 |
| 未创建真实 implementation ledger / boundary ledger | 通过 | 符合本 Step 限制 |
| 可进入最终审阅 / 提交 | 通过 | 等待用户下一步指令 |
