# L4-observability 02-概要设计校准流程

## 流程元信息

| 项 | 内容 |
|---|---|
| 目标文档 | `projects/L4-observability/02-概要设计.md` |
| 当前模式 | full-restart |
| 启动原因 | 用户要求从头重启 `02-概要设计`,并严格执行“一个 Step 一个 Step,每步等待确认” |
| 当前状态 | Step 14 `整理正式概要设计文档` 已完成;正式 `02-概要设计.md` 已按 Step 01~13 当前产物装配 |
| Step 切换门禁 | pass_for_step_14 |
| 文档切换门禁 | blocked_for_document_switch |
| 下一允许动作 | 等待用户明确确认后,再进入 `03-详细设计` Step 01;不得自动跨文档 |

## 必读输入记录

| 类型 | 文件 |
|---|---|
| 通用规范 | `standards/document/设计文档编写通则.md` |
| 通用规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 通用规范 | `standards/document/设计真相源闭环与可落码性标准.md` |
| 依赖规范 | `standards/document/全局项目依赖关系与裁剪规则.md` |
| 概要 SOP | `standards/document/概要设计讨论流程_SOP.md` |
| 概要书写规范 | `standards/document/概要设计书写规范.md` |
| 项目台账 | `projects/L4-observability/design-calibration/project_execution_ledger.md` |
| 当前需求基线 | `projects/L4-observability/00-需求文档.md` |
| 当前架构基线 | `projects/L4-observability/01-架构设计.md` |
| 当前 Step 产物 | `projects/L4-observability/design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_14_formal_document_assembly.md` |
| Step 06 对象附录 | `02_hld_step_06_key_objects_truth_signal_audit.md`;`02_hld_step_06_key_objects_truth_guard_consumption.md`;`02_hld_step_06_key_objects_policies.md`;`02_hld_step_06_key_objects_projections.md`;`02_hld_step_06_key_objects_references.md`;`02_hld_step_06_key_objects_history_records.md` |
| 历史材料 | `projects/L4-observability/README.md`、旧正式 `02-概要设计.md`、旧 `02_hld_*` |
| 参考粒度 | `projects/L1-governance/02-概要设计.md`;`projects/L1-artifact/02-概要设计.md` |

## 历史材料处理原则

旧 `README.md`、旧正式 `02-概要设计.md`、旧 `02_hld_calibration_flow.md` 的全 Step pass 状态和旧 `02_hld_step_01~14` 中间产物均降级为 historical material。当前正式 `02-概要设计.md` 只承认本轮 Step 01~14 重建产物和本 flow 门禁。

旧 `02_hld_step_14_formal_document_assembly.md` 已由当前 Step 14 产物替换,处理状态为 `historical_material_replaced`。旧正式 `02-概要设计.md` 已由当前正式装配版替换,处理状态为 `historical_material_replaced_by_current_baseline`。

## Step 状态台账

| Step | 输出文件 | 当前模块 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|
| Step 01 确认上游输入边界 | `02_hld_step_01_upstream_boundary.md` | upstream-boundary | done | done | pass | 已按新版 `00`、新版 `01`、概要 SOP Step 1、概要书写规范 4.1 和 L1 参考粒度重建 | wait_user_confirmation_before_step_02 | none |
| Step 02 本次设计目标与范围 | `02_hld_step_02_scope.md` | goals-scope | done | done | pass | 已按 Step 01、新版 `00`、新版 `01`、概要 SOP Step 2、概要书写规范 4.2 和 L1 参考粒度重建 | wait_user_confirmation_before_step_03 | none |
| Step 03 约束条件 | `02_hld_step_03_constraints.md` | constraints | done | done | pass | 已按 Step 01~02、新版 `00`、新版 `01`、概要 SOP Step 3、概要书写规范 4.3 和 L1 参考粒度重建 | wait_user_confirmation_before_step_04 | none |
| Step 04 代码主体框架总览 | `02_hld_step_04_code_subject_framework.md` | code-subject-framework | done | done | pass | 已按 Step 01~03、新版 `01`、概要 SOP Step 4、概要书写规范 4.4 和 L1 参考粒度重建 | wait_user_confirmation_before_step_05 | none |
| Step 05 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | components-boundary | done | done | pass | 已按 Step 01~04、新版 `00`、新版 `01`、概要 SOP Step 5、概要书写规范 4.5 和 L1 参考粒度重建 | wait_user_confirmation_before_step_06 | none |
| Step 06 关键对象轮廓 | `02_hld_step_06_key_objects.md` 及对象附录 | key-objects | done | done | pass | 已按 Step 01~05、新版 `00`、新版 `01`、概要 SOP Step 6、概要书写规范 4.6 和 L1 参考粒度重建 | wait_user_confirmation_before_step_07 | none |
| Step 07 API / 接口骨架 | `02_hld_step_07_api_interface_skeleton.md` | api-interface-skeleton | done | done | pass | 已按 Step 01~06、新版 `00`、新版 `01`、概要 SOP Step 7、概要书写规范 4.7 和 L1 参考粒度重建 | wait_user_confirmation_before_step_08 | none |
| Step 08 关键处理流 / 重要函数数据流 | `02_hld_step_08_processing_flows.md` | processing-flows | done | done | pass | 已按 Step 01~07、新版 `00`、新版 `01`、概要 SOP Step 8、概要书写规范 4.8 和 L1 参考粒度重建 | wait_user_confirmation_before_step_09 | none |
| Step 09 状态定义与状态流转 | `02_hld_step_09_state_machine.md` | state-machine | done | done | pass | 已按 Step 01~08、新版 `00`、新版 `01`、概要 SOP Step 9、概要书写规范 4.9 和 L1 参考粒度重建 | wait_user_confirmation_before_step_10 | none |
| Step 10 异常与边界场景轮廓 | `02_hld_step_10_exceptions_boundaries.md` | exceptions-boundaries | done | done | pass | 已按 Step 01~09、新版 `00`、新版 `01`、概要 SOP Step 10、概要书写规范 4.10 和 L1 参考粒度重建 | wait_user_confirmation_before_step_11 | none |
| Step 11 配置影响轮廓 | `02_hld_step_11_configuration_impact.md` | configuration-impact | done | done | pass | 已按 Step 01~10、新版 `00`、新版 `01`、概要 SOP Step 11、概要书写规范 4.11 和 L1 参考粒度重建 | wait_user_confirmation_before_step_12 | none |
| Step 12 详细设计承接清单 | `02_hld_step_12_detailed_design_handoff.md` | detailed-design-handoff | done | done | pass | 已按 Step 04~11、新版 `00`、新版 `01`、概要 SOP Step 12、概要书写规范 4.12 和 L1 参考粒度重建 | wait_user_confirmation_before_step_13 | none |
| Step 13 设计风险与待确认事项 | `02_hld_step_13_risks_open_questions.md` | risks-open-questions | done | done | pass | 已按 Step 04~12、新版 `00`、新版 `01`、概要 SOP Step 13、概要书写规范 4.13 和 L1 参考粒度重建 | wait_user_confirmation_before_step_14 | none |
| Step 14 整理正式概要设计文档 | `02_hld_step_14_formal_document_assembly.md`;`../02-概要设计.md` | formal-document-assembly | done | done | pass | 已按 Step 01~13 当前产物、概要 SOP Step 14、概要书写规范正式装配要求和 L1/L1-artifact 粒度参考完成正式装配 | wait_user_confirmation_before_03 | none |

## 当前上游 blocker 判断

| blocker | 判断 |
|---|---|
| 新版 `00-需求文档.md` 是否阻塞 `02` Step 14 | 不阻塞。需求层已收稳核心功能、业务规则、数据归属和 no-write / body-free / redaction 边界。 |
| 新版 `01-架构设计.md` 是否阻塞 `02` Step 14 | 不阻塞。架构层已收稳职责边界、子域划分、数据所有权、一致性、运行承载、产品中立适配和真实 evidence 边界。 |
| Step 01~13 当前产物是否阻塞 `02` Step 14 | 不阻塞。已提供正式 `02` 所需上游关系、范围、约束、代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、异常边界、配置影响、详细设计承接和风险 / 待确认事项。 |
| 旧正式 `02-概要设计.md` 和旧 `02_hld_*` 是否阻塞 `02` Step 14 | 不阻塞,但已全部作为 historical material 处理,不得作为当前真相源。 |
| 是否存在必须在 Step 14 伪造的实现 commit、真实 run id、真实 evidence alias、验收签署或测试结果 | 不存在,且已明确禁止。 |

## 当前门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 项目级门禁 | pass_for_02_step_14 | 已从 Step 01 进入并完成 Step 14。 |
| 文档级门禁 | completed_for_02 | `02-概要设计` full-restart 已完成正式装配。 |
| Step 级门禁 | pass_for_step_14 | Step 14 已完成并可停审。 |
| 正文装配门禁 | pass | 正式 `02-概要设计.md` 已完成装配。 |
| 文档切换门禁 | blocked_for_document_switch | 必须等待用户确认后才能进入 `03-详细设计`。 |

## 下一步阅读建议

若用户确认进入 `03-详细设计`,下一步应先读取:

- `standards/document/详细设计讨论流程_SOP.md`
- `standards/document/详细设计书写规范.md`
- `projects/L4-observability/02-概要设计.md`
- `projects/L4-observability/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- `projects/L4-observability/design-calibration/02_hld_step_13_risks_open_questions.md`
- `projects/L4-observability/design-calibration/02_hld_step_14_formal_document_assembly.md`
- `projects/L1-governance/03-详细设计.md`、`projects/L1-artifact/03-详细设计.md`、`projects/L0-bus/03-详细设计.md` 及相关 Step 产物
