# L1-conversation 07 实施计划 Step 13: 正式文档装配

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` 全文
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 整理正式实施计划文档 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 是 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` |
| 正式文档位置 | `projects/L1-conversation/07-实施计划.md` |

本步把 Step 1~Step 12 已确认中间产物装配为正式 `07-实施计划.md`。正式文档只摘录已确认结论，不新增未确认阶段、提交边界、测试门禁、风险口径或完成判定。

## 2. 本步输入

| 输入 | 状态 | 装配用途 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已确认 | 回填 §1 上游关系与输入边界 |
| `07_implementation_plan_step_02_scope.md` | 已确认 | 回填 §2 实施目标、范围和非范围 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 回填 §3 前置条件、阅读清单和阶段阅读门禁 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 回填 §4 实施对象、交付物、非交付物和依赖边界 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 回填 §5 阶段顺序、阶段表和顺序理由 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 回填 §6 编写顺序、commit boundary、复核矩阵和提交前检查 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 回填 §7 测试与验收门禁、证据和失败处理 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已确认 | 回填 §8 配置、环境和外部依赖 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 回填 §9 Spike、风险、blocker 和风险接受边界 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已确认 | 回填 §10 暂停、回退、变更和恢复规则 |
| `07_implementation_plan_step_11_commit_review_delivery.md` | 已确认 | 回填 §11 提交、评审和交付纪律 |
| `07_implementation_plan_step_12_completion_criteria.md` | 已确认 | 回填 §12 完成判定和最终交付清单 |
| `实施计划书写规范.md` | 已读取 | 约束正式章节主链、校准来源和评审清单 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 正式文档是否完整覆盖章节主链 | 是，正式文档使用 §1~§13 主链。 |
| 2. 每一章是否来自已确认中间产物 | 是，§1~§12 均标注对应 `design-calibration/07_implementation_plan_step_*.md`。 |
| 3. 阶段编号、任务编号和门禁编号是否一致 | 阶段统一为 PH-01~PH-08；commit boundary 统一为 commit-01-a 到 commit-08-b；门禁沿用 `TC-CONV-*`、`EV-CONV-*`、`AC-*`、`VETO-CONV-*`。 |
| 4. 上游引用、测试引用和验收引用是否准确 | 正式文档只引用真实存在的 `00~06`、standards 和已确认 calibration 文件。 |
| 5. 是否复制详细设计内容 | 否。正式 §7~§12 只写实施、门禁、证据、提交和完成判定，不重写详细设计字段 / 函数 / 协议。 |
| 6. 每个 phase / commit boundary 是否有开工前复核 | 是，正式 §6 包含开工前设计闭环复核矩阵摘要，并要求阅读 Step 6 全表。 |
| 7. 是否存在未解释空表、空图或占位内容 | 否，正式文档不保留占位符和空表。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 处理 |
|---|---|---|
| 正式 `07-实施计划.md` 尚不存在 | Step 1~12 只有中间产物 | 本步创建正式文档 |
| 中间产物体量较大 | Step 6、Step 7、Step 11 信息密集 | 正式文档摘录主表和关键规则，并引导读者继续阅读对应中间产物 |
| 实施计划可能重写详细设计 | 详细设计对象和协议已完整 | 正式文档只承接，不复制字段级设计 |
| 实现 agent 需要直接可执行 | 只引用中间产物会太薄 | 正式文档保留阶段表、commit boundary、gate、依赖和完成判定摘要 |

## 5. 装配取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 全量复制 Step 1~12 | 信息完整 | 正式文档过长、重复、难 review | 不采用 |
| 只写引用，不摘录核心表 | 简洁 | 实现 agent 难以直接执行 | 不采用 |
| 摘录核心执行表，细节回指中间产物 | 可执行且可追溯 | 需要保持引用清楚 | 采用 |

## 6. 正式文档装配表

| 正式章节 | 校准来源 | 摘录内容 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 输入边界、上游关系、设计缺口处理 |
| §2 实施目标与范围 | Step 2 | 目标、范围、非范围 |
| §3 实施前置条件与阅读清单 | Step 3 | 阅读清单、git config、目录 / 依赖 / 脚本检查 |
| §4 实施对象与交付物清单 | Step 4 | 实施对象、交付物、非交付物、跨仓依赖 |
| §5 实施阶段与依赖顺序 | Step 5 | 阶段依赖图、PH-01~PH-08 总表 |
| §6 阶段任务拆分、编写顺序与提交边界 | Step 6 | 全局编写顺序、commit boundary、复核矩阵摘要 |
| §7 测试与验收门禁嵌入 | Step 7 | 阶段门禁矩阵、证据归档、失败处理 |
| §8 配置、环境与外部依赖准备 | Step 8 | 依赖裁剪、配置检查、fake seam |
| §9 Spike、风险与待确认事项 | Step 9 | Spike、risk、blocker、风险接受边界 |
| §10 回退、暂停与变更控制 | Step 10 | 暂停、回退、变更、恢复规则 |
| §11 提交、评审与交付纪律 | Step 11 | commit 规范、scope、评审与交付纪律 |
| §12 实施完成判定 | Step 12 | 完成判定、证据判定、最终结论 |
| §13 参考 | Step 13 | 实际引用的正式文档、规范和中间产物 |

## 7. 评审清单

| 检查项 | 结果 |
|---|---|
| 已引用 `00~06` 上游文档 | 通过 |
| 每章都有校准来源和延伸阅读 | 通过 |
| 阶段按可验证功能增量组织 | 通过 |
| 每阶段有门禁和提交边界摘要 | 通过 |
| 实现仓英文 commit / 英文源码规则已写明 | 通过 |
| artifact / report 路径无 `<project>` 层级和 `latest` | 通过 |
| 字段 / DTO / 状态 / phase boundary 冲突处理已写明 | 通过 |
| 未创建未确认的新 phase、commit boundary 或 gate | 通过 |

## 8. 回填结论

正式 `projects/L1-conversation/07-实施计划.md` 已按 Step 1~Step 12 的确认结论装配完成。后续若实现 agent 发现设计缺口，应按正式 §10 暂停并回写 design repo，不得在实现仓自行补设计。
