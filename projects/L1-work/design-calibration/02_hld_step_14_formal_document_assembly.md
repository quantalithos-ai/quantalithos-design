# Step 14. 整理正式概要设计文档

> 对应正式文档: `projects/L1-work/02-概要设计.md`
> 本步只汇总 Step 1~13 已收敛结论,不新增概要设计判断。

---

## 1. 本步目标

将 `design-calibration/02_hld_step_01_*` 到 `02_hld_step_13_*` 的校准结果整理为正式 `02-概要设计.md`,并按 `standards/document/概要设计书写规范.md` 的 14 章主链输出。

---

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `02_hld_step_01_upstream_boundary.md` | 第 1 章上游关系声明 |
| `02_hld_step_02_goals_scope.md` | 第 2 章目标与范围 |
| `02_hld_step_03_constraints.md` | 第 3 章约束条件 |
| `02_hld_step_04_code_subject_framework.md` | 第 4 章代码主体框架 |
| `02_hld_step_05_components_boundary.md` | 第 5 章主要组成部分 |
| `02_hld_step_06_key_objects*.md` | 第 6 章关键对象轮廓 |
| `02_hld_step_07_api_interface_skeleton.md` | 第 7 章 API / 接口骨架 |
| `02_hld_step_08_processing_flows.md` | 第 8 章关键处理流 |
| `02_hld_step_09_state_machine.md` | 第 9 章状态定义与流转 |
| `02_hld_step_10_exceptions_boundaries.md` | 第 10 章异常与边界场景 |
| `02_hld_step_11_configuration_impact.md` | 第 11 章配置影响轮廓 |
| `02_hld_step_12_detailed_design_handoff.md` | 第 12 章详细设计承接清单 |
| `02_hld_step_13_risks_open_questions.md` | 第 13 章风险与待确认事项 |
| `standards/document/概要设计书写规范.md` | 正式章节结构和输出约束 |

---

## 3. 组装规则

| 规则 | 处理 |
|---|---|
| 每章必须有校准来源 | 正式正文每章开头列出具体 `design-calibration` 文件 |
| 不新增未确认结论 | 只从 Step 1~13 摘录、合并和统一措辞 |
| 旧文档不局部修补 | 旧 `02-概要设计.md` 整体替换为新版 14 章结构 |
| 详细契约不提前展开 | DTO schema、完整函数签名、DDL、配置默认值、测试用例继续留给后续文档 |
| Step 6 对象较多 | 正式文档保留对象筛选、分布和关键对象骨架;完整逐对象细节仍以 Step 6 附录为延伸阅读 |

---

## 4. 章节映射

| 正式章节 | 校准来源 |
|---|---|
| 1. 与上游文档的关系声明 | Step 1 |
| 2. 本次设计目标与范围 | Step 2 |
| 3. 约束条件 | Step 3 |
| 4. 代码主体框架总览 | Step 4 |
| 5. 主要组成部分、职责与边界 | Step 5 |
| 6. 关键对象轮廓 | Step 6 主控与附录 |
| 7. API / 接口骨架 | Step 7 |
| 8. 关键处理流 / 重要函数数据流 | Step 8 |
| 9. 状态定义与状态流转 | Step 9 |
| 10. 异常与边界场景轮廓 | Step 10 |
| 11. 配置影响轮廓 | Step 11 |
| 12. 详细设计承接清单 | Step 12 |
| 13. 设计风险与待确认事项 | Step 13 |
| 14. 参考 | Step 1~13、需求、架构、标准 |

---

## 5. 输出

正式 `projects/L1-work/02-概要设计.md` 已按新版概要设计主链重建。

---

## 6. 进入下一阶段条件

- `02-概要设计.md` 采用 14 章正式结构。
- 每章保留具体校准来源与延伸阅读入口。
- 正文不保留旧版“新人说明 / 背景问题 / 项目计划”主链。
- 后续可进入 `03-详细设计.md` 校准。
