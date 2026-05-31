# L0-sdk 07 实施计划 Step 13: 正式文档整理

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 13 中间产物。
> 本步将 Step 1~Step 12 已确认的中间产物整理为正式 `07-实施计划.md`，并记录正式文档的整理规则、评审清单和剩余风险。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 整理正式实施计划文档 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` 全文 |
| 是否修改正式 `07-实施计划.md` | 是 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` ~ `07_implementation_plan_step_12_completion_criteria.md` | 已确认 | 作为正式文档 §1~§12 的唯一内容来源 |
| `standards/document/实施计划书写规范.md` | 已确认 | 约束章节主链、校准来源、阶段、提交、证据和完成判定 |
| `standards/document/实施计划讨论流程_SOP.md` | 已确认 | 约束 Step 13 必须输出正式文档、评审清单和流程状态更新 |
| `projects/L0-sdk/00-需求文档.md` ~ `06-验收标准.md` | 已完成 | 作为正式实施计划的上游基线 |
| `/home/aris/Projects/quantalithos-sdk` | 已确认存在 | 作为目标实现仓路径，正式文档不得指导在 design 仓写业务代码 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 正式文档是否完整覆盖书写规范章节主链 | 覆盖 §1~§13，其中 §1~§12 对应 Step 1~12，§13 汇总参考。 |
| 2. 每一章是否来自已确认中间产物 | 是。每章开头列出具体 `design-calibration` 文件和延伸阅读小节。 |
| 3. 阶段编号、任务编号和门禁编号是否一致 | 正式文档沿用 PH-01~PH-07、commit-01-a~commit-07-b、TC / AC / VETO 编号。 |
| 4. 上游引用、测试引用和验收引用是否准确 | 以 `00`~`06` 和 Step 1~12 为准，不新增未确认设计。 |
| 5. 是否存在详细设计内容被复制进实施计划 | 正式文档只保留实施顺序、交付物、门禁、提交和完成判定，不复制完整 struct / enum / API / 函数实现。 |
| 6. 是否明确实现仓语言和提交规则 | 是。SDK 实现仓 commit message、源码标识符、rustdoc、普通注释和测试名必须英文。 |
| 7. 是否明确 design-calibration 阅读规则 | 是。正式文档是实现基线；校准产物是决策背景和细节追溯；冲突时以正式文档为准，不清楚时暂停回报。 |
| 8. 是否存在未解释的空表、空图或占位内容 | 不允许。正式文档不得包含占位文本、乱码或空表占位。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 正式 `07-实施计划.md` 尚不存在 | `projects/L0-sdk/07-实施计划.md` 当前缺失 | 实施者无统一入口 | 本步创建正式文档 |
| 中间产物内容较多 | Step 1~12 已形成 3000 行以上内容 | 机械复制会过长且难抓执行主线 | 正式文档保留核心表，延伸阅读指向中间产物 |
| SDK 交付面跨 Rust / Python / TypeScript | 三语言、candidate、docs、smoke 和 reports 容易分散 | 实施者可能只实现 Rust 或把 Python / TypeScript 后移 | 正式文档把三语言写入范围、交付物、阶段、门禁和完成判定 |
| 实现仓和 design 仓规则不同 | design 仓可中文，SDK 实现仓必须英文 | 另一 agent 可能沿用 design 仓 commit 口径 | 正式文档 §11 明确实现仓英文规则 |
| 正式章节必须可追溯 | 规范要求列校准来源 | 读者无法复查决策来源 | 每章显式列校准来源和延伸阅读 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 正式文档 | 缺失 | 创建 `07-实施计划.md` | 其他 agent 可按统一入口实施 |
| 校准来源 | 分散在 Step 文件 | 每章列具体来源 | 可追溯 |
| 阶段与提交 | 分散在 Step 5 / 6 | 正式文档集中承接 PH-01~PH-07 和 13 个 commit boundary | 可执行、可 review、可回退 |
| 测试与验收 | 分散在 Step 7 / `05` / `06` | 正式文档给出阶段门禁入口和证据路径 | 不把测试后补 |
| 配置与依赖 | 分散在 Step 8 / `04` | 正式文档明确本地 path dependency、fake / fixture 和非 P0 外部依赖 | 避免复制 truth 或扩大范围 |
| 完成判定 | 分散在 Step 12 / `06` | 正式文档明确完成口径 | 避免“基本完成”等模糊结论 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 完整复制 Step 1~12 所有表格 | 信息最全 | 正式文档过长，实施者难抓主线 | 不采用 |
| 正式文档只写链接 | 最短 | 实施者无法直接执行 | 不采用 |
| 正式文档保留执行核心，细节通过延伸阅读追溯 | 可读且可执行 | 读者需要按需查看中间产物 | 采用 |

正式文档长度超过 500 行，但写入过程已经按批次完成；后续修改也应按章节或 Step 分批进行，不应一次性重写全文。

---

## 7. 结构化中间产物

### 7.1 正式文档章节来源表

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `07_implementation_plan_step_01_input_boundary.md` |
| §2 实施目标与范围 | `07_implementation_plan_step_02_scope.md` |
| §3 实施前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` |
| §4 实施对象与交付物清单 | `07_implementation_plan_step_04_deliverables.md` |
| §5 实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` |
| §6 阶段任务拆分、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commits.md` |
| §7 测试与验收门禁嵌入 | `07_implementation_plan_step_07_tests_acceptance_gates.md` |
| §8 配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_env_dependencies.md` |
| §9 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks.md` |
| §10 回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_change_control.md` |
| §11 提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` |
| §12 实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` |
| §13 参考 | `07_implementation_plan_step_13_formal_document_assembly.md` |

### 7.2 正式文档评审清单

| 检查项 | 通过条件 |
|---|---|
| 章节完整 | §1~§13 均存在 |
| 校准来源 | §1~§13 均列具体中间产物和延伸阅读 |
| 无占位符 | 无占位文本、乱码或空表 |
| 不替代详细设计 | 未复制完整 struct / enum / DDL / 函数实现 |
| 阶段一致 | PH-01~PH-07 与 Step 5 / Step 6 一致 |
| 提交一致 | commit-01-a~commit-07-b 与 Step 6 / Step 11 一致 |
| 三语言一致 | Rust / Python / TypeScript 均保留为 P0 |
| 证据一致 | 使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 语言边界 | 明确 design 仓和实现仓提交 / 源码语言差异 |

### 7.3 正式文档评审结果

| 检查项 | 结果 |
|---|---|
| §1~§13 章节完整 | 通过 |
| §1~§13 均有校准来源 | 通过 |
| 正式文档无占位文本或乱码 | 通过 |
| 阶段、提交、门禁编号与 Step 5~Step 7 一致 | 通过 |
| 证据路径使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 通过 |
| 已区分 design 仓和实现仓提交 / 源码语言规则 | 通过 |

---

## 8. 回填草稿

本步直接创建正式 `projects/L0-sdk/07-实施计划.md`。

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 正式文档长度 | 保留执行核心，细节追溯到中间产物 | 文档可读性与可执行性平衡 | 接受 |
| 是否复制全部 Step 表格 | 不复制全部 | 避免正式文档过长 | 只保留核心执行表 |
| 是否创建旧版备份 | 正式文件不存在 | 不需要 legacy 操作 | 直接创建 |
| 是否允许后续 agent 只读正式文档 | 不建议 | 容易漏读重对象、重协议和重门禁细节 | 必须按 §3 阶段阅读矩阵补读中间产物 |

---

## 10. 进入下一步条件

- 正式 `07-实施计划.md` 创建完成。
- 正式文档通过无占位符、章节完整、校准来源、路径和状态检查。
- Step 13 可标记为已确认。
