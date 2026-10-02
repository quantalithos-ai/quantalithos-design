# 01 架构校准流程 · L6-marketplace

## 授权与恢复点

2026-10-01用户授权完成全部01。模式full-restart；当前agent单独执行；仅本项目设计/calibration/台账；不实现、不提交。00已停审，01完成即停审，不进入02。旧README/旧01～06仅historical_material，draft/原型非正式合同。

| 字段 | 值 |
|---|---|
| 当前Step/模块 | 16 / completed / stop_review |
| gate_status | pass |
| gate_reason | 01内部16Step、18章装配与静态检查完成；positive集成不关闭，02未授权 |
| next_allowed_action | 立即stop_review；用户确认前不得进入02或读取其启动SOP |
| source_files | 正式00；00 Step15/16/17；架构SOP/书写规范；通则/中间产物/闭环标准；全局依赖规则 |
| 正式回填门禁 | pass，01装配完成；01→02门禁blocked waiting_user_confirmation |

## 总流程计划与状态台账

每行输入同时包含架构SOP该Step和书写规范对应章节；前序Step的问题回答、取舍、待确认事项均为后序输入。阶段状态单独推进，不批量预建文件。门禁pass只表示允许下一文档动作，不关闭外部合同。

| Step/名称 | 必读输入 | 输出文件 | 前序依赖 | 状态 | 模块骨架/当前模块 | 思考/写入/自检 | gate_status | 完成门禁 / gate_reason | next_allowed_action | blocker |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 需求基线 | 正式00、开放项、九owner01/台账、全局架构 | 01_arch_step_01_requirements_baseline.md | 00+用户授权 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step2 | MP-UP路径级见Step14 |
| 02 目标约束 | Step01、正式00§3/4/13 | 01_arch_step_02_goals_constraints.md | 01 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step3 | MP-UP路径级见Step14 |
| 03 职责 | Step01/02、00§2/9/10 | 01_arch_step_03_responsibilities.md | 02 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step4 | MP-UP路径级见Step14 |
| 04 上下文 | Step01～03、00§6/12 | 01_arch_step_04_system_context.md | 03 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step5 | MP-UP路径级见Step14 |
| 05 子域 | Step03/04、00五能力来源 | 01_arch_step_05_bounded_contexts.md | 04 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step6 | MP-UP路径级见Step14 |
| 06 容器 | Step04/05、00§13 | 01_arch_step_06_runtime_units.md | 05 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step7 | MP-UP路径级见Step14 |
| 07 依赖 | Step05/06、全局依赖§5/6 | 01_arch_step_07_dependencies.md | 06 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step8 | MP-UP路径级见Step14 |
| 08 所有权一致性 | Step03/05/07、00§11 | 01_arch_step_08_ownership_consistency.md | 07 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step9 | MP-UP路径级见Step14 |
| 09 交互 | Step04/06/08、00§12 | 01_arch_step_09_interactions.md | 08 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step10 | MP-UP路径级见Step14 |
| 10 技术机制 | Step02/07/08/09、全局§9.2 | 01_arch_step_10_mechanisms.md | 09 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step11 | MP-UP路径级见Step14 |
| 11 备选 | Step02/10 | 01_arch_step_11_alternatives.md | 10 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step12 | MP-UP路径级见Step14 |
| 12 横切 | Step08～11、00§13/14 | 01_arch_step_12_crosscutting.md | 11 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step13 | MP-UP路径级见Step14 |
| 13 演进 | Step10～12、00非目标 | 01_arch_step_13_evolution.md | 12 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step14 | MP-UP路径级见Step14 |
| 14 风险 | Step01～13、00Step15 | 01_arch_step_14_risks_open_questions.md | 13 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step15 | MP-UP路径级见Step14 |
| 15 ADR追溯 | Step01～14、00Step16 | 01_arch_step_15_adr_traceability.md | 14 | done | done/all_stop_review | done/done/done | pass | 小循环与自检完成，外部合同缺口保留 | 进入Step16 | MP-UP路径级见Step14 |
| 16 正式装配 | Step01～15及单元审计 | 01_arch_step_16_formal_assembly.md；正式01 | 15 | done | done/all_stop_review | done/done/done | pass | 18章及总审计/静态校验完成，不是runtime-ready | stop_review，等用户确认01 | MP-UP/SRC/Q路径级，02用户门禁blocked |

## 公共执行口径

遵循中间产物规范§3三层台账、逐Step及单元先思考再写入；每Step维护开工确认、问题回答、诊断、取舍、结构化、复杂度、后置历史审计、草稿、自检、待确认。Step05/07/08/09/12/15需逐单元停审及跨单元审计。01不得提前展开Rust字段/trait/表结构/接口路径；从Step05提供可由02/03承接的模块责任、对象和状态主语、接缝、投影、事务、配置、测试及证据边界，而非假造owner DTO。

## 01结束与文档门禁

2026-10-01：16主Step/复杂Step逐单元校准、18章正式重写与静态检查完成；仅设计文档完成，不宣称运行通过。修改范围：正式01、本flow、01 Step01～16及项目台账。当前Rust/Vue约束、owner正向缺口及draft栈变更挂起见正式§15。立即stop_review；02～07等待明确确认；无实现/commit，不创建07实施台账或skeleton。恢复顺序：project_execution_ledger.md → 本flow → Step16§9/10 → 正式01。
