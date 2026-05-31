# L0-sdk 06-验收标准校准流程

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、回填章节和当前处理状态。
> 本目录中的内容是中间产物,不替代正式 `06-验收标准.md`。
>
> 本轮状态说明:
> - 当前 `projects/L0-sdk/06-验收标准.md` 是 2026-05-17 旧版草案。
> - 旧版 `06` 未按新版 15 章主链组织,未承接 `04-配置设计.md` 和新版 `05-测试方案.md` 的 evidence / reports / artifacts 口径。
> - 正式 `06-验收标准.md` 不在 Step 1~14 修改;Step 15 统一删除旧文件并按新文件标准重建。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 验收标准书写规范 | `standards/document/验收标准书写规范.md` |
| 验收标准讨论 SOP | `standards/document/验收标准讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L0-sdk/00-需求文档.md` |
| 当前架构设计 | `projects/L0-sdk/01-架构设计.md` |
| 当前概要设计 | `projects/L0-sdk/02-概要设计.md` |
| 当前详细设计 | `projects/L0-sdk/03-详细设计.md` |
| 当前配置设计 | `projects/L0-sdk/04-配置设计.md` |
| 当前测试方案 | `projects/L0-sdk/05-测试方案.md` |
| 当前旧验收标准 | `projects/L0-sdk/06-验收标准.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | §2 验收目标与范围 |
| Step 3 | [x] | 固定验收基线 | `06_acceptance_step_03_baseline.md` | §3 验收基线 |
| Step 4 | [x] | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | §4 进入条件与退出条件 |
| Step 5 | [x] | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | §5 功能验收门禁 |
| Step 6 | [x] | 定义数据边界与架构红线验收 | `06_acceptance_step_06_boundary_gate.md` | §6 数据边界与架构红线验收 |
| Step 7 | [x] | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_sync_gate.md` | §7 接口、事件与跨仓同步验收 |
| Step 8 | [x] | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | §8 状态机、事务与一致性验收 |
| Step 9 | [x] | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | §9 非功能验收门禁 |
| Step 10 | [x] | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_evidence_audit.md` | §10 可观测性、审计与证据门禁 |
| Step 11 | [x] | 定义一票否决项 | `06_acceptance_step_11_blockers.md` | §11 一票否决项 |
| Step 12 | [x] | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | §12 缺陷分级、复验与放行规则 |
| Step 13 | [x] | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | §13 风险接受与遗留项 |
| Step 14 | [x] | 定义最终结论与签署口径 | `06_acceptance_step_14_conclusion_signoff.md` | §14 最终结论与签署 |
| Step 15 | [x] | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是修补旧版 `06-验收标准.md`,而是基于新版 `00~05`,把 L0-sdk 的验收目标、验收基线、功能门禁、边界红线、接口事件、状态一致性、非功能、证据审计、一票否决、缺陷放行、风险接受和最终签署口径整理成可裁决、可追溯、可被实施计划引用的正式验收标准。

目标输出:

```text
1. 06 只做裁决,不重新定义需求、设计、配置、测试用例或执行结果。
2. 06 按验收标准书写规范的 15 章主链组织。
3. 06 必须引用 05 的 TS / TC 用例 ID、EV 证据 ID、进入 / 退出准则、一票否决专项和残余风险。
4. 06 必须支持“通过 / 有条件通过 / 不通过”三值裁决。
5. 06 必须明确哪些问题是一票否决,哪些风险可以条件接受,由谁接受。
6. 06 必须固定 reports / artifacts / acceptance handoff 引用规则,不得引用 latest 或旧路径。
7. 如果 06 发现必须改变 00~05 的需求、设计、配置或测试契约,必须回到对应文档重新校准。
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物,不得直接修改正式 `06-验收标准.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 必须包含验收裁决取舍。
- 每个 Step 必须包含至少一个结构化产物: 门禁表、裁决表、清单、矩阵、ASCII 图或回填草稿。
- 每个 Step 如涉及图示,必须遵守验收标准 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 正式 `06-验收标准.md` 必须在 Step 15 删除旧文件后按新文件标准重建。
- 允许参考已收稳的 `L0-core`、`L0-bus`、`L1-identity` 和 `L3-method-library` 前序中间产物,但不能机械搬运其他子项目的验收门禁。
