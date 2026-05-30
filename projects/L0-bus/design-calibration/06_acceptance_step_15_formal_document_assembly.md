# L0-bus 06 验收标准 Step 15: 正式文档整理

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 15 中间产物。
> 本步把 Step 1~Step 14 的中间产物整理成正式 `06-验收标准.md`。
> 本步会删除旧版正式文件,再按新文件标准重建。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 15 |
| 主题 | 整理正式验收标准文档 |
| 状态 | 已确认 |
| 正式回填位置 | 完整 `06-验收标准.md` |
| 是否修改正式 `06-验收标准.md` | 是 |

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已确认 | 生成 §1 |
| `06_acceptance_step_02_scope.md` | 已确认 | 生成 §2 |
| `06_acceptance_step_03_baseline.md` | 已确认 | 生成 §3 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 生成 §4 |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 生成 §5 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 生成 §6 |
| `06_acceptance_step_07_interface_sync_gate.md` | 已确认 | 生成 §7 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已确认 | 生成 §8 |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 生成 §9 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 生成 §10 |
| `06_acceptance_step_11_blockers.md` | 已确认 | 生成 §11 |
| `06_acceptance_step_12_defects_release.md` | 已确认 | 生成 §12 |
| `06_acceptance_step_13_risk_acceptance.md` | 已确认 | 生成 §13 |
| `06_acceptance_step_14_conclusion_signoff.md` | 已确认 | 生成 §14 |
| `standards/document/验收标准书写规范.md` | 已读取 | 约束正式文档章节、表格和校准来源写法 |
| `standards/document/验收标准讨论流程_SOP.md` | 已读取 | 约束 Step 15 评审清单和禁止事项 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按 15 章主链组织? | 是。正式文档使用 §1~§15,章节名称与书写规范一致。 |
| 是否删除了 SOP 问题原文? | 是。正式文档只保留裁决结论、门禁表、清单和签署口径,不保留 SOP 问题问答。 |
| 每条 P0 门禁是否有通过条件、失败条件和证据来源? | 是。功能、边界、接口、一致性、非功能和证据门禁均保留通过条件、失败条件和证据来源。 |
| 一票否决项是否真实生效? | 是。`VETO-BUS-*` 命中时总体结论只能为不通过,不得风险接受。 |
| 风险接受是否有接受人和后续动作? | 是。风险接受表保留责任人、接受人、后续动作和截止时间。 |

---

## 4. 正式文档整理规则

| 规则 | 执行方式 |
|---|---|
| 删除旧文件再重建 | 旧版 `06-验收标准.md` 不在原结构上修补,按新文件标准重建 |
| 保留校准来源 | 每个正式章节开头列出具体 `design-calibration` 中间产物 |
| 不写测试执行记录 | 正式文档只写门禁和裁决口径,不写本次实际测试结果 |
| 不新增未确认门禁 | 只使用 Step 1~14 已确认的门禁、红线、缺陷和风险规则 |
| 固定证据路径 | 使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 结论三值 | 最终结论只允许通过、有条件通过、不通过 |

---

## 5. 评审清单结果

| 检查项 | 结果 |
|---|---|
| 基线固定 | 通过 |
| 范围清楚 | 通过 |
| 门禁可裁决 | 通过 |
| 证据可追溯 | 通过 |
| 校准来源完整 | 通过 |
| 红线明确 | 通过 |
| 一票否决有效 | 通过 |
| 风险不隐藏 | 通过 |
| 结论明确 | 通过 |
| 签署完整 | 通过 |

---

## 6. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 正式验收标准可作为实施计划输入 | 已满足 |
| 正式验收标准可作为发布准备门禁输入 | 已满足 |
| 正式文档格式通过自检 | 已满足 |
