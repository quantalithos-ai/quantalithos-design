# L5-chat 07 实施计划校准流程

> 2026-10-02；full-restart / single-agent-serial。
> 授权：用户“现在完成 全部07”；本agent串行执行Step1→13，前序local设计门禁通过才创建下一Step，不创建或调用代理。
> 当前：Step1～13 done / formal_stop_review；13章正式07、实施项目台账及21planned skeleton完成并经静态审计。implementation not_started / blocked，不进入实现或提交。
> 每次patch≤180行；formal仅收口结论，过程停审/经验复核/整体审计留对应Step。

## 1. 顺序计划

| Step | 主题 | 文件 | 状态 | local gate |
|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | 07_implementation_plan_step_01_input_boundary.md | done | pass |
| 2 | 实施目标与范围 | 07_implementation_plan_step_02_scope.md | done | pass |
| 3 | 实施前置条件与阅读清单 | 07_implementation_plan_step_03_prerequisites_reading.md | done | pass |
| 4 | 实施对象与交付物清单 | 07_implementation_plan_step_04_objects_deliverables.md | done | pass |
| 5 | 实施阶段与依赖顺序 | 07_implementation_plan_step_05_phases_dependencies.md | done | pass |
| 6 | 阶段任务拆分、编写顺序与提交边界 | 07_implementation_plan_step_06_tasks_commit_boundaries.md | done | pass |
| 7 | 测试与验收门禁嵌入 | 07_implementation_plan_step_07_test_acceptance_gates.md | done | pass |
| 8 | 配置、环境与外部依赖准备 | 07_implementation_plan_step_08_config_environment_dependencies.md | done | pass |
| 9 | Spike、风险与待确认事项 | 07_implementation_plan_step_09_spikes_risks_open_questions.md | done | pass |
| 10 | 回退、暂停与变更控制 | 07_implementation_plan_step_10_rollback_pause_change_control.md | done | pass |
| 11 | 提交、评审与交付纪律 | 07_implementation_plan_step_11_commit_review_delivery.md | done | pass |
| 12 | 实施完成判定 | 07_implementation_plan_step_12_completion_criteria.md | done | pass |
| 13 | 参考 | 07_implementation_plan_step_13_formal_document_assembly.md | done | pass |

设计local gate的pass仅指已完成的文档静态规则审查；本flow不记录任何implementation gate pass。上游合同/真实环境/批准基线和实施授权继续blocked。

## 2. 输入与写入门禁

当前00～06停审文档、03§3/4/16、04配置、05 suite/TC/EV/schema/maturity与06 gate/VETO/签署是直接输入。07 SOP/书写规范、实施台账规范、中间产物§5.10、真相源§7/§9、全局依赖§4.1与语言/目录/git规范是规范输入。前序专项owner00～07和必要台账的语义阅读记录继承，当前80份正式文件刷新bytes指纹；Process按其现有正式设计补充，不将Bridges未停审材料作为输入。

每个phase与boundary逐项收稳功能增量→前置→实现批次→经验适用性→tests/gates/maturity→review/rollback→local停审；随后跨boundary审计。设计停审不是implementation Design Gate pass；有外部blocker的正向能力不得移交开工。

## 3. 已知blocker

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/owner正式消费面、Process/provider/关系、nativeorigin/window/OS/AT、生产质量预算、版本/source/release、retention/ACL继续open/blocked。目标实现仓当前不存在；SDK package存在但无正式消费可用证明。设计dirty工作树不作为已批准07 commit baseline；实施授权、实际build/run/report/EV/签署均waiting。

## 4. 台账与恢复

先读project_execution_ledger→本flow→当前/前序Step→对应SOP/书写规范→必要来源；前序已done才创建下一Step。当前下一动作停审，等待用户审阅；没有后续实施授权不创建实现仓、安装或运行。获授权后先读implementation_execution_ledger→唯一current boundary→正式07阅读矩阵与approved baseline来源。implementation_execution_ledger及全部21份implementation-boundaries骨架已在正式07收口时创建，全部planned/blocked/waiting；189实际gate blocked、无actualcommit/run/EV。38文件静态检查与来源/集合/依赖审计见Step13；当前停审，不能直接移交开工。
