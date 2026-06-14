# Step 15. 整理正式验收标准文档

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 15
> 回填章节: 完整 `06-验收标准.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 整理正式验收标准文档 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~14 已审核通过;验收标准书写规范;中间产物规范 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_15_formal_document_assembly.md`;`projects/L1-identity/06-验收标准.md` |
| 正式文档状态 | 本 Step 重建正式 `06-验收标准.md` |
| 停审方式 | 完成正式装配和自审后停审,等待用户确认 |

## 2. 本步目标

把 Step 1~14 的已审核中间产物整理成新版正式 `06-验收标准.md`,并完成跨门禁裁决总审计、旧口径清理和自审。

本 Step 只做正式装配:

- 按书写规范生成 15 章主链。
- 每个正式章节写入具体 `design-calibration/...` 校准来源和延伸阅读。
- 将 P0 门禁、证据、VETO、缺陷、风险和最终结论口径整理成裁决文档。
- 清理旧 `06` 中的旧对象、旧流程、旧证据路径和旧通过条件。

本 Step 不新增需求、设计、测试用例、EV、artifact schema、VETO 或风险接受规则;如装配中发现缺口,不得私自补真相源。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已审核通过 | §1 与上游文档关系声明 |
| `06_acceptance_step_02_scope.md` | 已审核通过 | §2 验收目标与范围 |
| `06_acceptance_step_03_baseline.md` | 已审核通过 | §3 验收基线 |
| `06_acceptance_step_04_entry_exit.md` | 已审核通过 | §4 进入条件与退出条件 |
| `06_acceptance_step_05_function_gate.md` | 已审核通过 | §5 功能验收门禁 |
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | §6 数据边界与架构红线验收 |
| `06_acceptance_step_07_interface_sync_gate.md` | 已审核通过 | §7 接口、事件与跨仓同步验收 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已审核通过 | §8 状态机、事务与一致性验收 |
| `06_acceptance_step_09_nonfunctional.md` | 已审核通过 | §9 非功能验收门禁 |
| `06_acceptance_step_10_evidence_audit.md` | 已审核通过 | §10 可观测性、审计与证据门禁 |
| `06_acceptance_step_11_blockers.md` | 已审核通过 | §11 一票否决项 |
| `06_acceptance_step_12_defects_release.md` | 已审核通过 | §12 缺陷分级、复验与放行规则 |
| `06_acceptance_step_13_risk_acceptance.md` | 已审核通过 | §13 风险接受与遗留项 |
| `06_acceptance_step_14_conclusion_signoff.md` | 已审核通过 | §14 最终结论与签署 |
| `验收标准书写规范.md` | 当前标准 | 正式文档结构、三值结论和评审清单 |
| `设计文档讨论中间产物规范.md` | 当前标准 | 校准来源、分批写作和可追溯要求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按 15 章主链组织? | 是。正式 `06-验收标准.md` 使用书写规范的 15 章主链。 |
| 是否删除了 SOP 问题原文? | 是。正式文档只保留裁决门禁、表格和规则,不保留 Step 问答、诊断和取舍过程。 |
| 每条 P0 门禁是否有通过条件、失败条件和证据来源? | Step 5~11 已逐项闭合;正式文档按 `AC-FUNC-*`、`AC-BOUNDARY-*`、`AC-SYNC-*`、`AC-STATE/TX/IDEM/CONC-*`、`AC-NFR-*`、`AC-EV-*` 和 `VETO-ID-*` 装配。 |
| 一票否决项是否真实生效? | 是。§11 和 §14 明确任一 `VETO-ID-001~006` 命中即总体不通过,不得风险接受。 |
| 每条 P0 门禁是否能回指设计契约、测试用例和 evidence ID? | 是。正式文档保留闭环表或证据列,并以中间产物为详细追溯入口。 |
| 状态、字段、接口、事件名是否与详细设计和测试方案一致? | 是。装配只使用 Step 1~14 已收敛的新版 `03/05` 名称,并清理旧草案历史名称。 |
| 风险接受是否有接受人和后续动作? | 是。§13 要求风险 / 遗留项、影响、接受理由、后续动作、责任人、接受人和截止时间齐全。 |
| Step 5~Step 11 的验收项 / 证据 / VETO 是否全部完成停审? | 是。对应 Step 均为已审核通过。 |
| 是否存在孤儿验收项、孤儿证据、重复裁决、VETO 未覆盖、风险接受越权或 report path 不固定? | 装配目标是清理这些问题;完成后通过 §15 自审表和命令检查复核。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧章节、旧对象、旧入口族、旧证据路径与新版 `00~05` 不一致 | 按 Step 1~14 重建正式文档 |
| 旧 `06-验收标准.md` | 混有测试执行记录和实施口径 | 正式文档只保留裁决门禁 |
| 旧 `06-验收标准.md` | 缺逐章校准来源 | 每章开头补具体中间产物路径 |
| 正式装配 | 大文件容易一次性写入过大 | 按框架先行、逐章分批写入 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 文档结构 | 旧草案结构 | 15 章主链 | 对齐书写规范 |
| 权威输入 | 旧 `06` 与新版文档混读 | 新版 `00~05` + Step 1~14 | 清理旧口径 |
| 证据路径 | 泛化或历史路径 | 固定 `<run_id>` 下 artifact/report/acceptance 路径 | 可复验 |
| 裁决口径 | 容易泛化通过 | 三值结论和 VETO 强约束 | 可签署 |
| 风险接受 | 泛化遗留 | 接受人、动作、截止时间必填 | 可追踪 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否保留旧 `06` 章节做局部修补 | A. 保留;B. 重建 | 采用 B。旧结构会携带旧对象和旧 evidence 口径。 |
| 是否把 Step 问答原文写入正式文档 | A. 写入;B. 不写入,只写裁决结果 | 采用 B。正式 `06` 是裁决文档。 |
| 是否压缩所有门禁为一张总表 | A. 压缩;B. 按 15 章分主题装配 | 采用 B。便于追溯和维护。 |
| 是否在正式文档发明真实 run / 签署人 | A. 发明;B. 保留占位和必填规则 | 采用 B。当前没有送验材料时不能伪造。 |

## 8. 结构化中间产物

### 8.1 正式章节装配映射

| 正式章节 | 校准来源 | 装配状态 |
|---|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` | 已写入 |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` | 已写入 |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` | 已写入 |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | 已写入 |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` | 已写入 |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_boundary_gate.md` | 已写入 |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_sync_gate.md` | 已写入 |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | 已写入 |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | 已写入 |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_evidence_audit.md` | 已写入 |
| §11 一票否决项 | `06_acceptance_step_11_blockers.md` | 已写入 |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | 已写入 |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | 已写入 |
| §14 最终结论与签署 | `06_acceptance_step_14_conclusion_signoff.md` | 已写入 |
| §15 参考 | Step 1~14、书写规范 | 已写入 |

### 8.2 跨门禁裁决总审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 正式章节是否覆盖 15 章主链 | 通过 | §1~§15 已写入 |
| 每章是否有具体校准来源 | 通过 | 每章开头均有具体 `design-calibration` 文件 |
| P0 门禁是否有通过条件、失败条件和证据来源 | 通过 | §5~§10 已按门禁表写入 |
| VETO 是否强制不通过 | 通过 | §11 / §14 均明确任一 VETO 命中不通过 |
| 风险接受是否不能覆盖 VETO/S/P0 红线 | 通过 | §13 / §14 已明确 |
| report path 是否固定 `<run_id>` | 通过 | §3 / §10 已固定路径规则 |
| 旧 identity 术语是否清理 | 通过 | residue check 无命中 |
| governance 残留是否清理 | 通过 | residue check 无命中 |
| 非正式 EV 是否清理 | 通过 | residue check 无命中 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| Step 1~14 已足够装配正式 `06` | 否 | 验收文档生成 | 正在执行 |
| 真实 `<run_id>`、签署人和送验 commit 当前未填 | 否 | 送验实例待补 | 正式文档写必填槽位,不伪造 |
| 若检查发现 P0 门禁孤儿证据 | 是 | 上游测试 / evidence 缺口 | 暂停并回写 |
| 若检查发现旧口径残留 | 否 | 装配质量问题 | 清理后再停审 |

## 10. 回填草稿

本 Step 直接回填完整 `projects/L1-identity/06-验收标准.md`。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 真实送验 source commit / build / image / `<run_id>` | 影响最终签署 | 正式 `06` 保留必填槽位 |
| 真实签署人姓名和日期 | 影响归档 | 正式 `06` 保留签署表 |
| 实际 `reports/acceptance/*` 是否已生成 | 影响最终结论 | 正式 `06` 定义检查和裁决口径 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 14 已审核通过 | 通过 | 用户已确认 |
| 正式 `06` 15 章主链已创建 | 通过 | 已写入 |
| 正式章节逐章装配完成 | 通过 | §1~§15 已写入 |
| 跨门禁总审计完成 | 通过 | 见 §8.2 |
| 旧口径 / governance / 非正式 EV 检查通过 | 通过 | residue check、sensitive key check、trailing whitespace check 和 diff check 均通过 |
