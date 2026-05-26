# L3-method-library 02-概要设计校准流程

> 本文件是 `projects/L3-method-library/02-概要设计.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态和回填章节。
> 本目录中的内容是中间产物,不替代正式 `02-概要设计.md`。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 概要设计书写规范 | `standards/document/概要设计书写规范.md` |
| 概要设计讨论 SOP | `standards/document/概要设计讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L3-method-library/00-需求文档.md` |
| 当前架构设计 | `projects/L3-method-library/01-架构设计.md` |
| 待校准概要设计 | `projects/L3-method-library/02-概要设计.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认上游输入边界 | `02_hld_step_01_upstream_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确本仓设计目标与当前范围 | `02_hld_step_02_scope.md` | §2 本次设计目标与范围 |
| Step 3 | [x] | 收稳约束条件 | `02_hld_step_03_constraints.md` | §3 约束条件 |
| Step 4 | [x] | 代码主体框架映射 | `02_hld_step_04_code_subject_framework.md` | §4 代码主体框架总览 |
| Step 5 | [x] | 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | §5 主要组成部分、职责与边界 |
| Step 6 | [x] | 关键对象轮廓 | `02_hld_step_06_key_objects.md` | §6 关键对象轮廓 |
| Step 7 | [x] | API / 接口骨架 | `02_hld_step_07_api_interface_skeleton.md` | §7 API / 接口骨架 |
| Step 8 | [x] | 关键处理流 / 重要函数数据流 | `02_hld_step_08_processing_flows.md` | §8 关键处理流 / 重要函数数据流 |
| Step 9 | [x] | 状态机与状态流转 | `02_hld_step_09_state_machine.md` | §9 状态定义与状态流转 |
| Step 10 | [x] | 异常与边界场景轮廓 | `02_hld_step_10_exceptions_boundaries.md` | §10 异常与边界场景轮廓 |
| Step 11 | [x] | 详细设计承接清单 | `02_hld_step_11_detail_design_handoff.md` | §11 详细设计承接清单 |
| Step 12 | [x] | 设计风险与待确认事项 | `02_hld_step_12_risks_open_questions.md` | §12 设计风险与待确认事项 |
| Step 13 | [x] | 整理正式概要设计文档 | `02_hld_step_13_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是继续扩写现有 `02-概要设计.md`,而是把它重新校准成符合最新概要设计规范的可实现结构骨架。

目标输出:

```text
1. 02 只承接需求与架构结论,不重写需求和架构取舍
2. 02 按最新 13 章主链组织
3. 02 明确代码主体框架、主要组成部分、关键对象、接口骨架、处理流和状态机
4. 02 形成可直接驱动 03-详细设计的承接清单
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物,不得直接改正式 `02-概要设计.md`
- 每个 Step 必须逐项回答 SOP 的“应问的问题”
- 每个 Step 必须包含当前文档问题诊断和改动前后对比
- 所有 ASCII 图必须使用 `text` 代码块并附关键说明
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step
- 未确认事项不得写成正式概要设计结论
