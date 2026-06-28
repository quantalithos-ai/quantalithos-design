# L3-method-library 06 验收标准校准流程

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md`
> 书写规范: `standards/document/验收标准书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-method-library/06-验收标准.md`
> 创建日期: 2026-06-28
> 当前模式: full-restart
> 当前状态: Step 15 `R15.2 formal document assembly:再写入` completed;正式 `06-验收标准.md` 已完成装配,等待用户确认进入 `07-实施计划.md` full-restart。

---

## 1. 本轮目标

按验收标准 SOP 将当前 full-restart 后的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md` 转译为可裁决、可追溯、可签署的 `06-验收标准.md`。

正式 `06-验收标准.md` 必须在 Step 15 由 Step 1~14 中间产物装配生成。本轮不得从旧 `06-验收标准.md`、旧 `07-实施计划.md` 或实现侧假设直接生成验收项、真实结论、实施边界、CI required check 或 release sign-off。

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 正式上游 | 核心能力、FR-ML / BR-ML / NFR-ML、验收标准表、一票否决项、风险与待确认事项。 |
| `projects/L3-method-library/01-架构设计.md` | 正式上游 | truth owner、Definition vs Use、依赖方向、数据所有权、一致性和架构红线。 |
| `projects/L3-method-library/02-概要设计.md` | 正式上游 | 八个组成部分、对象轮廓、接口骨架、处理流、状态和异常轮廓。 |
| `projects/L3-method-library/03-详细设计.md` | 直接设计输入 | 对象 / port / protocol / flow / state / transaction / error / config / observability / test cut。 |
| `projects/L3-method-library/04-配置设计.md` | 直接配置输入 | profile、config source、validation、secret/redaction、adapter availability、failure/degradation 和 handoff。 |
| `projects/L3-method-library/05-测试方案.md` | 直接测试输入 | `TC-ML-*`、`EV-ML-*`、suite / gate、artifact/report root、redaction、dependency、report audit 和 residual。 |
| `projects/L3-method-library/06-验收标准.md` | historical material | 旧主语、旧同步路径、旧基础设施和旧硬阈值口径只作污染诊断。 |
| `projects/L3-method-library/07-实施计划.md` | old direction input | 不作为验收基线、commit boundary、required check、implementation ledger 或 evidence schema 来源。 |
| `projects/L1-governance/design-calibration/06_acceptance_*` | framework_reference | 只参考验收 flow、表格和门禁深度,不得复制 governance 领域事实。 |

## 3. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 当前 Step 文件 |
|---|---|---|---|---|---|
| Step 15 整理正式验收标准文档 | `R15.2 formal document assembly:再写入` | completed_wait_user_confirm_to_07 | 已完成正式 `06-验收标准.md` 15 章装配、Step 15 回写、跨门禁裁决总审计和 completed stop-review。 | 等待用户确认后进入 `07-实施计划.md` full-restart;不得自动开始 `07`。 | `design-calibration/06_acceptance_step_15_formal_document_assembly.md` |

## 4. Step 状态表

| Step | 主题 | 中间产物 | 状态 | 当前门禁 |
|---|---|---|---|---|
| Step 1 | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | [x] completed | R1.2_completed_wait_user_confirm_to_R2.1 |
| Step 2 | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | [x] completed | R2.2_completed_wait_user_confirm_to_R3.1 |
| Step 3 | 固定验收基线 | `06_acceptance_step_03_baseline.md` | [x] completed | R3.2_completed_wait_user_confirm_to_R4.1 |
| Step 4 | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | [x] completed | R4.2_completed_wait_user_confirm_to_R5.1 |
| Step 5 | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | [x] completed | R5.2_completed_wait_user_confirm_to_R6.1 |
| Step 6 | 定义数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` | [x] completed | R6.2_completed_wait_user_confirm_to_R7.1 |
| Step 7 | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interfaces_events_sync.md` | [x] completed | R7.2_completed_wait_user_confirm_to_R8.1 |
| Step 8 | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | [x] completed | R8.2_completed_wait_user_confirm_to_R9.1 |
| Step 9 | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | [x] completed | R9.2_completed_wait_user_confirm_to_R10.1 |
| Step 10 | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | [x] completed | R10.2_completed_wait_user_confirm_to_R11.1 |
| Step 11 | 定义一票否决项 | `06_acceptance_step_11_veto.md` | [x] completed | R11.2_completed_wait_user_confirm_to_R12.1 |
| Step 12 | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_retest_release.md` | [x] completed | R12.2_completed_wait_user_confirm_to_R13.1 |
| Step 13 | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | [x] completed | R13.2_completed_wait_user_confirm_to_R14.1 |
| Step 14 | 定义最终结论与签署口径 | `06_acceptance_step_14_final_decision_signoff.md` | [x] completed | R14.2_completed_wait_user_confirm_to_R15.1 |
| Step 15 | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | [x] completed | R15.2_completed_wait_user_confirm_to_07 |

## 5. 执行纪律

- 每次继续、同意、上下文恢复或 agent 切换时,必须先读取 `project_execution_ledger.md`,再读取本 flow 和当前 Step 文件。
- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 内必须先搭整体模块,再逐模块执行“先思考 -> 再写入”。
- 用户每次确认只推进一个当前模块,不得把多个模块自动合并。
- 正式 `06-验收标准.md` 必须在 Step 15 由已确认的 Step 1~14 中间产物装配,不得在 Step 1 直接重写正式文档。
- 旧 `06-验收标准.md`、旧 `07-实施计划.md` 只作为 historical / old direction input,不得覆盖当前 `00`~`05`。
- 验收标准不得自行补需求、设计、测试用例、evidence schema、artifact schema、report schema、config key、port、state、phase boundary、真实 run 结果或 implementation boundary。
- 单次写入以 100~300 行为宜;这是写入批次规模,不是文件最终长度上限。

## 6. 历史材料处理

| 材料 | 当前定位 | 使用方式 |
|---|---|---|
| 旧 `06-验收标准.md` | historical material | 旧主语、旧同步路径、旧基础设施和旧硬阈值口径只作污染诊断。 |
| 旧 `07-实施计划.md` | old direction input | 不作为 phase、commit、CI、required_checks、implementation ledger 或 boundary 来源。 |
| L1-governance 06 文件 | framework_reference | 只参考流程、表格和门禁深度,不得复制 governance 领域对象、AC、VETO、证据或签署口径。 |

## 7. 当前 next_allowed_action

Step 15 `R15.2 formal document assembly:再写入` completed;
正式 `06-验收标准.md` 已按 Step 1~14 中间产物完成装配;
等待用户确认后进入 `07-实施计划.md` full-restart;
不得自动写 `07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
