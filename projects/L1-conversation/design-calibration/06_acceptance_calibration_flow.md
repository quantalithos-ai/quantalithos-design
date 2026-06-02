# L1-conversation 06-验收标准校准流程

> 本文件是 `projects/L1-conversation/06-验收标准.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、回填章节和当前处理状态。
> 本目录中的内容是中间产物，不替代正式 `06-验收标准.md`。
>
> 本轮状态说明:
> - 当前 `projects/L1-conversation/06-验收标准.md` 是 2026-05-16 旧版草案。
> - 旧版 `06` 仍围绕 Conversation / Turn / StreamEvents / projection 的旧主线展开，并包含未被新版需求确认的固定性能数字。
> - 正式 `06-验收标准.md` 不在 Step 1~14 修改；Step 15 统一删除旧文件并按新文件标准重建。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 验收标准书写规范 | `standards/document/验收标准书写规范.md` |
| 验收标准讨论 SOP | `standards/document/验收标准讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L1-conversation/00-需求文档.md` |
| 当前架构设计 | `projects/L1-conversation/01-架构设计.md` |
| 当前概要设计 | `projects/L1-conversation/02-概要设计.md` |
| 当前详细设计 | `projects/L1-conversation/03-详细设计.md` |
| 当前配置设计 | `projects/L1-conversation/04-配置设计.md` |
| 当前测试方案 | `projects/L1-conversation/05-测试方案.md` |
| 当前旧验收标准 | `projects/L1-conversation/06-验收标准.md` |
| 稳定上游 / 相邻仓 | `projects/L0-core/00~07`、`projects/L0-bus/00~07`、`projects/L0-sdk/00~07`、`projects/L1-identity/00~07` |

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
| Step 6 | [x] | 定义数据边界与架构红线验收 | `06_acceptance_step_06_data_architecture_redlines.md` | §6 数据边界与架构红线验收 |
| Step 7 | [x] | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_event_sync.md` | §7 接口、事件与跨仓同步验收 |
| Step 8 | [x] | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | §8 状态机、事务与一致性验收 |
| Step 9 | [x] | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional_gate.md` | §9 非功能验收门禁 |
| Step 10 | [x] | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | §10 可观测性、审计与证据门禁 |
| Step 11 | [x] | 定义一票否决项 | `06_acceptance_step_11_veto_items.md` | §11 一票否决项 |
| Step 12 | [x] | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | §12 缺陷分级、复验与放行规则 |
| Step 13 | [x] | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | §13 风险接受与遗留项 |
| Step 14 | [x] | 定义最终结论与签署口径 | `06_acceptance_step_14_final_conclusion.md` | §14 最终结论与签署 |
| Step 15 | [x] | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是修补旧版 `06-验收标准.md`，而是按新版 `00~05` 重新生成 L1-conversation 验收标准。

目标输出:

```text
1. 06 只承接需求、架构、概要、详细、配置和测试方案结论，不重新定义它们。
2. 06 按验收标准书写规范的 15 章主链组织。
3. 06 把 Conversation truth center、space / scope、fact append、authorized consumption、manifestation、handoff、outbox、operations jobs、configuration、reports / artifacts 转成可裁决 AC。
4. 06 每个 P0 AC 必须回指设计契约、TC、EV 和固定 report 路径。
5. 06 明确通过 / 有条件通过 / 不通过三值结论口径。
6. 06 不写测试执行过程、不写实施排期、不写部署命令。
7. 如果 06 发现必须改变 03、04 或 05 的设计 / 测试契约，必须回到对应文档重新校准。
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物，不得直接修改正式 `06-验收标准.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 必须包含验收裁决取舍。
- 每个 Step 必须包含至少一个结构化产物: 表格、ASCII 图、矩阵、清单或回填草稿。
- 每个 Step 如涉及图示，必须遵守验收标准 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后，才能进入下一 Step。
- 正式 `06-验收标准.md` 必须在 Step 15 删除旧文件后按新文件标准重建。
- 允许参考已收稳的 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity` 和 `L3-method-library` 前序中间产物，但不能机械搬运其他子项目的 AC。
