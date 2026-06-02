# Step 14. 整理正式概要设计文档

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 14
> 回填文档: `projects/L1-conversation/02-概要设计.md`
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 ~ Step 13 已确认的中间产物按 `概要设计书写规范.md` 的正式 14 章结构整理为新版 `02-概要设计.md`。

本步只做重组、润色、统一术语、统一编号和补交叉引用,不新增未经讨论的新对象、新接口、新流程、新状态、新异常、新配置项或新风险。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 回填 §1 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 回填 §2 |
| `02_hld_step_03_constraints.md` | 已完成 | 回填 §3 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 回填 §4 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 回填 §5 |
| `02_hld_step_06_key_objects.md` | 已完成 | 回填 §6 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 回填 §7 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 回填 §8 |
| `02_hld_step_09_state_machine.md` | 已完成 | 回填 §9 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 回填 §10 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 回填 §11 |
| `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 回填 §12 |
| `02_hld_step_13_risks_open_questions.md` | 已完成 | 回填 §13 |
| `概要设计书写规范.md` | 已收稳 | 提供正式章节结构和表格 / 图示约束 |

---

## 3. 正式概要设计文档重组结论

| 结论 | 处理方式 |
|---|---|
| 旧 `02-概要设计.md` 不符合最新概要设计主链 | 先删除旧文件,再按新文件标准重建 |
| Step 与正式章节不是机械复制关系 | 正式文档按 14 章结构组织,每章列出引用来源并摘录核心结论 |
| 中间产物较长的章节 | 正式文档保留可承接详细设计的主表、关键图和边界说明,细节继续指向 `design-calibration` |
| 未闭环事项 | 保留在 §13,不得润色成定论 |
| 详细设计内容 | 只在 §12 写承接方向,不在正式概要设计中展开字段全集、函数实现、DDL、错误码全集或配置 JSON |

---

## 4. 章节回填结论

| 正式章节 | 回填来源 | 回填方式 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 摘录上游边界、可继承输入和不可继承旧主线 |
| §2 本次设计目标与范围 | Step 2 | 摘录概要设计目标、范围、非范围和完成标准 |
| §3 约束条件 | Step 3 | 摘录结构性约束表和门禁说明 |
| §4 代码主体框架总览 | Step 4 | 摘录代码主体映射图、实现分层视图和业务主体 / 实现分层区别 |
| §5 主要组成部分、职责与边界 | Step 5 | 摘录 8 个主要组成部分、职责、不承担职责和接缝说明 |
| §6 关键对象轮廓 | Step 6 | 摘录对象候选池筛选、对象分布和关键对象骨架摘要 |
| §7 API / 接口骨架 | Step 7 | 摘录 Command / Query / Consumer / Event / Job 骨架表 |
| §8 关键处理流 / 重要函数数据流 | Step 8 | 摘录覆盖清单、通用处理流和处理流与对象 / 接口对应关系 |
| §9 状态定义与状态流转 | Step 9 | 摘录状态机覆盖、状态定义、迁移和传播关系 |
| §10 异常与边界场景轮廓 | Step 10 | 摘录异常表、异常影响图和异常处理边界 |
| §11 配置影响轮廓 | Step 11 | 摘录配置影响表、禁止配置化边界和详细设计配置承接方向 |
| §12 详细设计承接清单 | Step 12 | 摘录承接清单、继续展开方向和回退规则 |
| §13 设计风险与待确认事项 | Step 13 | 摘录风险表、待确认事项和当前挂起口径 |
| §14 参考 | Step 1 ~ Step 13、需求、架构、规范 | 列实际使用材料及用途 |

---

## 5. 术语统一结论

| 术语 | 统一口径 |
|---|---|
| Conversation truth center | `L1-conversation` 的核心定位,不是 Chat UI、Workspace 聚合或 Bridges 适配 |
| Conversation fact | 对话内正式结果性事实,替代旧文档的 Turn 主线 |
| Cross-domain manifestation | 外部正式事实在对话中的显化记录,不转移来源 truth |
| ExternalFactRef / ExternalFactSnapshot | 外部事实引用和安全摘要,不得保存来源正文 |
| Authorized consumption | 授权读取、变化感知、订阅和检索的统一读侧 |
| Projection / cursor / search | 派生只读支撑,不能成为第二 truth |
| Outbox / handoff | 已提交 truth 的传播或交接意图,失败不回滚 truth |

---

## 6. 交叉引用结论

- 每个正式章节开头必须列出引用的 `design-calibration/...` 来源。
- 对象、接口、处理流、状态机、异常和配置影响之间必须保持同名主语。
- §12 明确详细设计如果改变主语必须回退概要设计。
- §13 只保留未闭环风险和待确认事项,不重复已进入 §12 的稳定输入。

---

## 7. 参考材料表

| 参考材料 | 用途 |
|---|---|
| `00-需求文档.md` | 提供需求边界、能力闭环、数据归属、验收红线 |
| `01-架构设计.md` | 提供架构职责、上下文、运行承载、依赖方向、数据所有权和一致性口径 |
| `standards/document/概要设计书写规范.md` | 提供正式概要设计章节主链、表格和 ASCII 图输出规则 |
| `standards/document/概要设计讨论流程_SOP.md` | 提供 Step 1 ~ Step 14 的生成流程 |
| `standards/document/设计文档讨论中间产物规范.md` | 提供逐 Step 中间产物和正式回填纪律 |
| `projects/L0-core/00~07` | 承接共享 ID、ActorRef、TraceContext、metadata、error、evidence、配置和报告口径 |
| `projects/L0-bus/00~07` | 承接事件发布、订阅、重试、死信、replay、tap 和报告证据口径 |
| `projects/L0-sdk/00~07` | 承接默认 client / integration access 和 SDK consumer 边界 |
| `projects/L1-identity/00~07` | 承接成员、AI member、system actor 和 actor 引用来源 |

---

## 8. 待执行动作

- 删除旧 `projects/L1-conversation/02-概要设计.md`。
- 按 14 章主链重建新版正式文档。
- 更新 `02_hld_calibration_flow.md` 中 Step 14 状态。
- 复核正式文档标题层级、代码块、ASCII 图风格、引用来源和 `git diff --check`。

---

## 9. 进入收口条件

Step 14 完成后应满足:

- 新版 `02-概要设计.md` 已按 14 章主链重建。
- 每章都列出实际引用的 `design-calibration` 来源。
- 未新增未经讨论的新结论。
- 旧文档主线不再保留。
- 工作台 Step 14 标记为已完成。

---

## 10. 执行结果

| 执行动作 | 结果 |
|---|---|
| 重建 `projects/L1-conversation/02-概要设计.md` | 已完成 |
| 按 14 章主链回填正式概要设计 | 已完成 |
| 每章列出 `design-calibration` 引用来源 | 已完成 |
| 保留 §13 风险与待确认事项 | 已完成 |
| 更新概要设计校准工作台 Step 14 状态 | 已完成 |

---

## 11. 收口说明

Step 14 已把 Step 1 ~ Step 13 的中间产物整理为正式概要设计文档。后续若详细设计发现需要新增主要组成部分、关键对象、接口主语、处理流、状态机、异常影响或配置边界,不得在详细设计中自行选边,应按 `02-概要设计.md` §12.4 回退到对应概要设计 Step 修正。
