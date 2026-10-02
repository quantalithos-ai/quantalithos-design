# L6-marketplace 02 概要设计 calibration flow

## 执行授权与恢复

2026-10-01 用户“同意 接下来完成全部02”确认01并授权本agent连续完成02内部14Step。只解除01→02等待；02完成立即stop_review，03未授权。full-restart，单agent，不实现、不提交。旧README/旧02～06仅historical_material；当前00/01为直接基线。

## 总流程计划

每Step：问题回答/诊断/取舍首次落盘 → 结构化产物 → 回填草稿 → 自检与内部停审。复杂Step5～9以U1～7逐个小循环，不提前创建未来Step。正式文件只在Step14删除旧稿、建立14章骨架、分批装配。

| Step | 目标 | 产物 | 状态 | 当前单元 | 正式落点 |
|---|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | 02_hld_step_01_upstream_relation.md | completed | cross_part_audit_pass | §1 |
| 2 | 本次设计目标与范围 | 02_hld_step_02_scope.md | completed | cross_part_audit_pass | §2 |
| 3 | 约束条件 | 02_hld_step_03_constraints.md | completed | cross_part_audit_pass | §3 |
| 4 | 代码主体框架总览 | 02_hld_step_04_code_subject_framework.md | completed | cross_part_audit_pass | §4 |
| 5 | 主要组成部分、职责与边界 | 02_hld_step_05_components_boundary.md | completed | cross_part_audit_pass | §5 |
| 6 | 关键对象轮廓 | 02_hld_step_06_key_objects.md | completed | cross_part_audit_pass | §6 |
| 7 | API / 接口骨架 | 02_hld_step_07_api_interface_skeleton.md | completed | cross_part_audit_pass | §7 |
| 8 | 关键处理流 / 重要函数数据流 | 02_hld_step_08_processing_flows.md | completed | cross_part_audit_pass | §8 |
| 9 | 状态定义与状态流转 | 02_hld_step_09_states_transitions.md | completed | cross_part_audit_pass | §9 |
| 10 | 异常与边界场景轮廓 | 02_hld_step_10_exceptions_boundaries.md | completed | cross_part_audit_pass | §10 |
| 11 | 配置影响轮廓 | 02_hld_step_11_config_impacts.md | completed | cross_part_audit_pass | §11 |
| 12 | 详细设计承接清单 | 02_hld_step_12_ddd_handoff.md | completed | cross_part_audit_pass | §12 |
| 13 | 设计风险与待确认事项 | 02_hld_step_13_risks_open_questions.md | completed | cross_part_audit_pass | §13 |
| 14 | 参考 | 02_hld_step_14_formal_assembly.md | completed | cross_part_audit_pass | §14 |

## 门禁与证据上限

- document gate：02完成后等待明确确认；03～07禁止。
- Step gate：当前Step产物、自检和台账同步后才允许下一Step。
- part gate：Step5～9各部分先思考、结构化、回填、自检；全部完成再跨部分审计。
- 正向owner/SDK资格未闭合不因文档检查pass而ready；MP-UP/SRC是本地候选，不伪造外部确认。
- 局部accepted+审计+完整原结果+耐久责任同事务；外部unknown原意图核对，不能盲发。
- Billing/Archive active lane absent；条件canonical事件无schema不得启用。
- 07时才创建implementation ledger/skeleton；不产生实现、run、digest、evidence或signoff。

## 阅读索引

SOP全部14Step；概要书写规范现行14章规范及图/术语/审查规范，历史模板不采用。中间产物规范三层台账/分批写入规则；设计通则核心与full-restart；闭环标准类型/可调用边界、metadata、原结果、状态主语、公共job与配置/证据上限。全局依赖Layer5窗口、仓库拆分§9.2/十/十一。各owner仅按受影响正式章节核验，不把接口名称当consumer support。

## 部分小循环台账

Step5～9实际进入后追加U1～7记录，禁止预填pass。

## 完成与停审

completed / stop_review。旧02已在Step14删除，正式14章从已校准产物分批重建；43对象/49独立flow/14carrier与104需求编号静态核对通过。02→03 blocked / waiting_user_confirmation；只允许审查02，不实现、不提交。详情见02_hld_step_14_formal_assembly.md与02_hld_static_review_record.md。

Step5 U1：思考先写、结构化后写，capability/discovery/边界自检pass；附录02_hld_step_05_part_u1.md。

Step5 U2：思考先写、结构化后写，capability/discovery/边界自检pass；附录02_hld_step_05_part_u2.md。

Step5 U3：思考先写、结构化后写，capability/discovery/边界自检pass；附录02_hld_step_05_part_u3.md。

Step5 U4：思考先写、结构化后写，capability/discovery/边界自检pass；附录02_hld_step_05_part_u4.md。

Step5 U5：思考先写、结构化后写，capability/discovery/边界自检pass；附录02_hld_step_05_part_u5.md。

Step5 U6：思考先写、结构化后写，capability/discovery/边界自检pass；附录02_hld_step_05_part_u6.md。

Step5 U7：思考先写、结构化后写，capability/discovery/边界自检pass；附录02_hld_step_05_part_u7.md。

Step6 U1：候选筛选→独立卡片→回填/反查自检pass；02_hld_step_06_part_u1.md。

Step6 U2：候选筛选→独立卡片→回填/反查自检pass；02_hld_step_06_part_u2.md。

Step6 U3：候选筛选→独立卡片→回填/反查自检pass；02_hld_step_06_part_u3.md。

Step6 U4：候选筛选→独立卡片→回填/反查自检pass；02_hld_step_06_part_u4.md。

Step6 U5：候选筛选→独立卡片→回填/反查自检pass；02_hld_step_06_part_u5.md。

Step6 U6：候选筛选→独立卡片→回填/反查自检pass；02_hld_step_06_part_u6.md。

Step6 U7：候选筛选→独立卡片→回填/反查自检pass；02_hld_step_06_part_u7.md。

Step7 U1：接口/对象/上下文/读写边界自检pass；02_hld_step_07_part_u1.md。

Step7 U2：接口/对象/上下文/读写边界自检pass；02_hld_step_07_part_u2.md。

Step7 U3：接口/对象/上下文/读写边界自检pass；02_hld_step_07_part_u3.md。

Step7 U4：接口/对象/上下文/读写边界自检pass；02_hld_step_07_part_u4.md。

Step7 U5：接口/对象/上下文/读写边界自检pass；02_hld_step_07_part_u5.md。

Step7 U6：接口/对象/上下文/读写边界自检pass；02_hld_step_07_part_u6.md。

Step7 U7：接口/对象/上下文/读写边界自检pass；02_hld_step_07_part_u7.md。

Step8 U1：4独立flows，coverage与读写/knownunknown自检pass；02_hld_step_08_part_u1.md。

Step8 U2：8独立flows，coverage与读写/knownunknown自检pass；02_hld_step_08_part_u2.md。

Step8 U3：10独立flows，coverage与读写/knownunknown自检pass；02_hld_step_08_part_u3.md。

Step8 U4：7独立flows，coverage与读写/knownunknown自检pass；02_hld_step_08_part_u4.md。

Step8 U5：9独立flows，coverage与读写/knownunknown自检pass；02_hld_step_08_part_u5.md。

Step8 U6：7独立flows，coverage与读写/knownunknown自检pass；02_hld_step_08_part_u6.md。

Step8 U7：4独立flows，coverage与读写/knownunknown自检pass；02_hld_step_08_part_u7.md。

Step9 U1：2carrier，初始/终态/全矩阵/guard/trigger/传播反查pass；02_hld_step_09_part_u1.md。

Step9 U2：2carrier，初始/终态/全矩阵/guard/trigger/传播反查pass；02_hld_step_09_part_u2.md。

Step9 U3：1carrier，初始/终态/全矩阵/guard/trigger/传播反查pass；02_hld_step_09_part_u3.md。

Step9 U4：2carrier，初始/终态/全矩阵/guard/trigger/传播反查pass；02_hld_step_09_part_u4.md。

Step9 U5：2carrier，初始/终态/全矩阵/guard/trigger/传播反查pass；02_hld_step_09_part_u5.md。

Step9 U6：3carrier，初始/终态/全矩阵/guard/trigger/传播反查pass；02_hld_step_09_part_u6.md。

Step9 U7：2carrier，初始/终态/全矩阵/guard/trigger/传播反查pass；02_hld_step_09_part_u7.md。
