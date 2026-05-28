# Step 15. 整理正式验收标准文档

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15
- 回填章节：`projects/L0-core/06-验收标准.md` 全文

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 1~14 中间产物 | `06_acceptance_step_01_*` 到 `06_acceptance_step_14_*` | 作为正式文档唯一新增口径来源 |
| `standards/document/验收标准书写规范.md` | 15 章主链、校准来源、三值结论、门禁表、证据引用规则 | 约束正式文档结构 |
| 旧 `06-验收标准.md` | shared primitive / admission 旧口径 | 仅作为问题诊断,不沿用为验收事实 |

依赖的前序 Step：Step 1~14 已确认。

## 3. SOP 问题回答

1. 正式文档是否按 15 章主链组织?

   回答：是。正式文档按 `1. 与上游文档的关系声明` 到 `15. 参考` 组织,不保留旧版 10 章结构。

2. 是否删除了 SOP 问题原文?

   回答：是。正式文档只保留裁决口径、门禁表、条件、证据、风险和签署,不把中间产物中的 SOP 问题逐条搬入正文。

3. 每条 P0 门禁是否有通过条件、失败条件和证据来源?

   回答：是。§5~§10 的门禁表保留通过条件、失败条件和 TC / EV 证据来源。进入 / 退出条件、否决项、缺陷、风险和签署用清单或裁决表表达。

4. 一票否决项是否真实生效?

   回答：是。§11 明确 AC-BLOCKER 触发后不得风险接受,最终结论只能是不通过或送验不成立。

5. 风险接受是否有接受人和后续动作?

   回答：是。§13 风险表必须包含责任人、接受人和截止时间。当前设计阶段保留角色占位,送验时必须补具体人员或授权角色。

## 4. 当前文档问题诊断

| 位置 | 问题 | 处理 |
|---|---|---|
| 旧 `06-验收标准.md` 全文 | 仍围绕 shared primitive admission、registry、bus/sdk consume base | 全量重写 |
| 旧 §1~§4 | 输入、范围、基线、功能门禁不适配新版 00~05 | 用 Step 1~5 回填 |
| 旧 §5~§7 | 非功能、红线、安全治理口径过旧 | 用 Step 6~11 回填 |
| 旧 §8~§10 | 缺陷、风险、签署太粗 | 用 Step 12~14 回填 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 文档结构 | 10 章旧结构 | 15 章新版验收主链 | 对齐书写规范 |
| 验收主语 | shared primitive 稳定器 | 跨仓共享契约来源仓 | 对齐新版需求和架构 |
| 证据口径 | registry / trace / compare 泛化描述 | TC / EV / artifact / run_id 明确引用 | 支撑可复查 |
| 结论口径 | 占位 | 通过 / 有条件通过 / 不通过三值规则 | 支撑正式裁决 |
| 风险接受 | 简单遗留表 | 接受人、责任人、后续动作、截止时间 | 支撑有条件通过 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在旧文档上局部修补 | 改动少 | 旧主语和新版证据体系断链 | 不采用 |
| B. 正式文档粘贴所有中间产物全文 | 信息完整 | 正式文档会变成讨论记录 | 不采用 |
| C. 用 Step 1~14 的回填草稿和结构化产物整理成裁决文档 | 清晰、可追溯、可执行 | 需要保持中间产物引用 | 采用 |

## 7. 结构化中间产物

### 7.1 正式文档组装清单

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_event_sync.md` |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional_gate.md` |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_audit_evidence.md` |
| §11 一票否决项 | `06_acceptance_step_11_one_vote_veto.md` |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defect_release_rules.md` |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` |
| §14 最终结论与签署 | `06_acceptance_step_14_final_decision_signoff.md` |
| §15 参考 | Step 1~14、书写规范和 SOP |

### 7.2 自审结果

| 检查项 | 结果 |
|---|---|
| 正式文档按 15 章主链组织 | 通过 |
| 每章标注具体 `design-calibration` 来源 | 通过 |
| 删除 SOP 问题原文 | 通过 |
| P0 门禁有通过条件、失败条件和证据来源 | 通过 |
| 一票否决不得被风险接受覆盖 | 通过 |
| 风险接受有接受人、责任人、后续动作和截止时间 | 通过 |
| 未写测试执行结果 | 通过 |
| 未编造实现 commit、run_id 或性能数字 | 通过 |

## 8. 回填草稿

正式文档已重写到 `projects/L0-core/06-验收标准.md`。

## 9. 待确认事项

- 送验时需要补齐 implementation repository、commit SHA、build artifact、CI run id、test run_id、config_profile 和 evidence artifact path。
- 送验时需要把风险接受表中的角色占位替换为具体人员或明确授权角色。
- 送验时需要填入签署表的结论、风险接受范围和日期。

## 10. 进入下一步条件

- [x] 验收标准可作为实施计划和发布准备门禁输入。
- [x] 可以进入最终格式和状态校验。
