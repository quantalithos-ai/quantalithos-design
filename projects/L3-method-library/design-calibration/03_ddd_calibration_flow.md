# L3-method-library 03-详细设计校准流程

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-method-library/03-详细设计.md`
> 创建日期: 2026-06-21
> 当前模式: full-restart
> 当前状态: Step 19 `R19.26 §18 参考与最终闭环:再写入` completed_wait_user_confirm;`03-详细设计.md` formal assembly completed;等待用户确认进入 `04-配置设计.md` full-restart 开工

---

## 1. 本轮目标

按详细设计 SOP 将本轮已经重启完成的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 转译成可以 1:1 实现的 `03-详细设计.md`。

当前正式 `03-详细设计.md` 与历史 `03_ddd_*` 文件属于旧材料。它们仍包含 `MethodContent`、publish、snapshot、fingerprint、outbox、delivery、P0 / P1 等旧正向主线,只能作为污染审计和问题诊断输入,不得直接继承其 completed 状态、对象、接口、处理流、状态或章节结构。

本轮详细设计必须从当前 `02-概要设计.md` 的八个组成部分、关键对象轮廓、接口骨架、处理流、状态、异常、配置影响和详细设计承接清单重新展开。

---

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 正式上游 | 仓定位、能力边界、依赖裁剪、业务规则、接口与依赖、验收红线 |
| `projects/L3-method-library/01-架构设计.md` | 正式上游 | 职责边界、系统上下文、依赖方向、数据所有权、一致性和通信方式 |
| `projects/L3-method-library/02-概要设计.md` | 直接输入 | 代码主体框架、八个主要组成部分、对象轮廓、接口骨架、处理流、状态、异常、配置影响、详细设计承接清单 |
| `projects/L3-method-library/design-calibration/02_hld_*` | 解释性输入 | 理解概要设计结论来源;若与正式 `02` 冲突,以正式 `02` 为准 |
| `projects/L3-method-library/03-详细设计.md` | historical_material | 仅用于识别旧主线残留和旧结构污染 |
| `projects/L3-method-library/design-calibration/03_ddd_step_*.md` | historical_material | 旧 completed 状态失效;只作差异审计输入 |
| `projects/L1-governance/design-calibration/03_ddd_*` | framework_reference | 只参考框架深度、Step 组织和门禁表达,不得复制 governance 领域语义 |

---

## 3. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 当前 Step 文件 |
|---|---|---|---|---|---|
| Step 19 整理正式详细设计文档 | `R19.26 §18 参考与最终闭环:再写入` | completed_wait_user_confirm | 已将正式 `03-详细设计.md` §18 pending skeleton 替换为正式参考章节,标记 `assembled_by_R19.26`,完成 document-wide source closure、pending marker cleanup、final self-check 和 Step 19 completed stop-review;正式 `03-详细设计.md` formal assembly completed。 | `03-详细设计.md` full-restart formal assembly completed;等待用户确认后进入 `04-配置设计.md` full-restart 开工;只允许按配置设计 SOP 创建 / 更新 `04` 的 calibration flow 和 Step 1 开工记录;不得直接写实现仓代码、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 | `design-calibration/03_ddd_step_19_formal_document_assembly.md` |

---

## 4. Step 状态表

| Step | 主题 | 中间产物 | 状态 | 当前门禁 |
|---|---|---|---|---|
| Step 1 | 确认概要设计输入边界 | `03_ddd_step_01_input_boundary.md` | [x] completed | pass |
| Step 2 | 明确本轮实现范围和非范围 | `03_ddd_step_02_scope.md` | [x] completed | pass |
| Step 3 | 收稳编码规范、语言 / runtime、仓库约束 | `03_ddd_step_03_runtime_constraints.md` | [x] completed | pass |
| Step 4 | 收稳实现单元与文件布局 | `03_ddd_step_04_module_layout.md` | [x] completed | pass |
| Step 5 | 定义模块实现契约主轴 | `03_ddd_step_05_module_contracts.md` | [x] completed | pass |
| Step 6 | 逐模块定义对象实现契约 | `03_ddd_step_06_object_contracts.md` | [x] completed | pass |
| Step 7 | 逐模块定义 Trait / Port / Adapter 契约 | `03_ddd_step_07_trait_port_adapter.md` | [x] completed | pass |
| Step 8 | 定义 API / Command / Query / Event / Job 协议契约 | `03_ddd_step_08_protocol_contracts.md` | [x] completed | pass |
| Step 9 | 逐接口定义函数级处理流 | `03_ddd_step_09_function_flows.md` | [x] completed | pass |
| Step 10 | 定义状态机与转换矩阵 | `03_ddd_step_10_state_machine.md` | [x] completed | pass |
| Step 11 | 定义持久化、事务与一致性契约 | `03_ddd_step_11_persistence_tx_consistency.md` | [x] completed | R11.24_completed_wait_user_confirm_to_step12 |
| Step 12 | 定义错误模型、异常分支与恢复口径 | `03_ddd_step_12_errors_recovery.md` | [x] completed | R12.16_completed_wait_user_confirm_to_step13 |
| Step 13 | 定义并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | [x] completed | R13.16_completed_wait_user_confirm_to_step14 |
| Step 14 | 定义配置引用与外部依赖绑定 | `03_ddd_step_14_config_dependencies.md` | [x] completed | R14.14_completed_wait_user_confirm_to_step15 |
| Step 15 | 定义可观测性与审计埋点契约 | `03_ddd_step_15_observability_audit.md` | [x] completed | R15.16_completed_wait_user_confirm_to_step16 |
| Step 16 | 定义测试切口与最小验证清单 | `03_ddd_step_16_test_cut.md` | [x] completed | R16.18_completed_wait_user_confirm_to_step17 |
| Step 17 | 收口详细设计到实施计划的承接清单 | `03_ddd_step_17_implementation_handoff.md` | [x] completed | R17.14_completed_wait_user_confirm_to_step18 |
| Step 18 | 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | [x] completed | R18.14_completed_wait_user_confirm_to_step19 |
| Step 19 | 整理正式详细设计文档 | `03_ddd_step_19_formal_document_assembly.md` | [x] completed | R19.26_completed_wait_user_confirm_to_04 |

---

## 5. 执行纪律

- 每次继续、同意、上下文恢复或 agent 切换时,必须先读取 `project_execution_ledger.md`,再读取本 flow 和当前 Step 文件。
- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 内必须先搭建整体模块,再逐模块执行“先思考 -> 再写入”。
- 用户每次确认只推进当前模块,不得把多个模块自动合并。
- 正式 `03-详细设计.md` 只能在对应回填模块或 Step 19 中由已确认中间产物装配,不得从 Step 1 R1.1 直接修改。
- 单次写入以 100~300 行为宜;这是写入批次规模,不是文件最终长度上限。
- Step 6 以后必须按模块 / 功能 / capability 小循环展开对象、port、protocol、flow、state,不得退回全仓总表式生成。
- 若发现当前 `02` 输入不足、对象来源不清、port / DTO / state / mapper / config / evidence schema 缺口,必须暂停回设计闭口,不得自行补口。
- 旧 `03-详细设计.md` 和旧 `03_ddd_*` 中仍适用的事实,必须通过当前 `00/01/02` 或本轮新 Step 中间产物重新进入。

---

## 6. 历史材料处理

| 材料 | 当前定位 | 使用方式 |
|---|---|---|
| 旧 `03-详细设计.md` | historical_material | 只用于识别旧主线、旧对象、旧接口、旧状态和旧章节结构残留。 |
| 旧 `03_ddd_calibration_flow.md` | historical_material | 旧 Step completed 状态失效;本文件已重建为 full-restart flow。 |
| 旧 `03_ddd_step_*.md` | historical_material | 到对应 Step 时后置差异审计;不得作为当前 Step 第一来源。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery | historical_pollution_candidate | 不得正向进入当前详细设计主线;如有必要,只能以当前 `02` 重新命名、重新归属、重新闭口后进入。 |

---

## 7. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取 `projects/L3-method-library/design-calibration/project_execution_ledger.md`
2. 读取 `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md`
3. 读取已完成 Step 1 文件 `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md`
4. 读取已完成 Step 2 文件 `projects/L3-method-library/design-calibration/03_ddd_step_02_scope.md`
5. 确认 Step 2 completed
6. 读取 `projects/L3-method-library/00-需求文档.md`
7. 读取 `projects/L3-method-library/01-架构设计.md`
8. 读取 `projects/L3-method-library/02-概要设计.md`
9. 读取 `projects/L3-method-library/design-calibration/02_hld_step_12_detailed_design_handoff.md`
10. 读取 `projects/L3-method-library/design-calibration/02_hld_step_13_risks_open_questions.md`
11. 读取 `projects/L3-method-library/design-calibration/02_hld_step_14_formal_document_assembly.md`
12. 读取 `standards/document/详细设计讨论流程_SOP.md`
13. 读取 `standards/document/详细设计书写规范.md`
14. 读取 `standards/document/设计文档讨论中间产物规范.md`
15. 读取当前 Step 3 文件 `projects/L3-method-library/design-calibration/03_ddd_step_03_runtime_constraints.md`
16. 确认 `R3.1 开工与必读文档:先思考` completed
17. 确认 `R3.2 开工与必读文档:再写入` completed
18. 确认 `R3.3 L1-governance 框架对齐:先思考` completed
19. 确认 `R3.4 L1-governance 框架对齐:再写入` completed
20. 确认 `R3.5 规范与约束来源池:先思考` completed
21. 确认 `R3.6 规范与约束来源池:再写入` completed
22. 确认 `R3.7 语言 / runtime / 仓库约束裁决:先思考` completed
23. 确认 `R3.8 语言 / runtime / 仓库约束裁决:再写入` completed
24. 确认 `R3.9 跨仓依赖与本地 sibling repo:先思考` completed
25. 确认 `R3.10 跨仓依赖与本地 sibling repo:再写入` completed
26. 确认 `R3.11 安全 / 鉴权 / 外部边界:先思考` completed
27. 确认 `R3.12 安全 / 鉴权 / 外部边界:再写入` completed
28. 确认 `R3.13 历史 Step 3 差异审计:先思考` completed
29. 确认 `R3.14 历史 Step 3 差异审计:再写入` completed
30. 确认 `R3.15 回填草稿:先思考` completed
31. 确认 `R3.16 回填草稿:再写入` completed
32. 确认 `R3.17 自检与停审:先思考` completed
33. 确认 `R3.18 自检与停审:再写入` completed
34. 确认当前 Step = Step 4 `收稳实现单元与文件布局`
35. 确认 `R4.1 开工与必读文档:先思考` completed
36. 确认 `R4.2 开工与必读文档:再写入` completed
37. 确认 `R4.3 L1-governance 框架对齐:先思考` completed
38. 确认 `R4.4 L1-governance 框架对齐:再写入` completed
39. 确认 `R4.5 目标实现仓与命名规范核对:先思考` completed
40. 确认 `R4.6 目标实现仓与命名规范核对:再写入` completed
41. 确认 `R4.7 布局形态裁决:先思考` completed
42. 确认 `R4.8 布局形态裁决:再写入` completed
43. 确认 `R4.9 实现单元与依赖落点:先思考` completed
44. 确认 `R4.10 实现单元与依赖落点:再写入` completed
45. 确认 `R4.11 文件布局树与职责:先思考` completed
46. 确认 `R4.12 文件布局树与职责:再写入` completed
47. 确认 `R4.13 历史 Step 4 差异审计:先思考` completed
48. 确认 `R4.14 历史 Step 4 差异审计:再写入` completed
49. 确认 `R4.15 回填草稿:先思考` completed
50. 确认 `R4.16 回填草稿:再写入` completed
51. 确认 `R4.17 自检与停审:先思考` completed
52. 确认 `R4.18 自检与停审:再写入` completed
53. 读取 `design-calibration/03_ddd_step_04_module_layout.md`
54. 确认 Step 4 completed
55. 确认当前 Step = Step 5 `定义模块实现契约主轴`
56. 确认旧 `design-calibration/03_ddd_step_05_module_contracts.md` 为 historical_material,不得继承 completed 状态
57. 确认 `R5.1 开工与必读文档:先思考` completed
58. 确认 `R5.2 开工与必读文档:再写入` completed
59. 确认 `R5.3 L1-governance 框架对齐:先思考` completed
60. 确认 `R5.4 L1-governance 框架对齐:再写入` completed
61. 确认 `R5.5 Step 4 承接与模块候选池:先思考` completed
62. 确认 `R5.6 Step 4 承接与模块候选池:再写入` completed
63. 确认 `R5.7 业务组成部分到模块映射:先思考` completed
64. 确认 `R5.8 业务组成部分到模块映射:再写入` completed
65. 确认 `R5.9 依赖矩阵与暴露边界:先思考` completed
66. 确认 `R5.10 依赖矩阵与暴露边界:再写入` completed
67. 确认 `R5.11 模块主轴裁决:先思考` completed
68. 确认 `R5.12 模块主轴裁决:再写入` completed
69. 确认 `R5.13 历史 Step 5 差异审计:先思考` completed
70. 确认 `R5.14 历史 Step 5 差异审计:再写入` completed
71. 确认 `R5.15 回填草稿:先思考` completed
72. 确认 `R5.16 回填草稿:再写入` completed
73. 确认 `R5.17 自检与停审:先思考` completed
74. 确认 `R5.18 自检与停审:再写入` completed
75. 读取 `design-calibration/03_ddd_step_05_module_contracts.md`
76. 确认 Step 5 completed
77. 确认当前 Step = Step 6 `逐模块定义对象实现契约`
78. 确认旧 `design-calibration/03_ddd_step_06_object_contracts.md` 为 historical_material,不得继承 completed 状态
79. 读取 `design-calibration/03_ddd_step_06_object_contracts.md`
80. 确认 `R6.1 开工与必读文档:先思考` completed
81. 确认 `R6.2 开工与必读文档:再写入` completed
82. 确认 `R6.3 L1-governance 框架对齐:先思考` completed
83. 确认 `R6.4 L1-governance 框架对齐:再写入` completed
84. 确认 `R6.5 Step 5 承接与对象发现轴:先思考` completed
85. 确认 `R6.6 Step 5 承接与对象发现轴:再写入` completed
86. 确认 `R6.7 contracts shared refs / markers / public shell:先思考` completed
87. 确认 `R6.8 contracts shared refs / markers / public shell:再写入` completed
88. 确认 `R6.9 domain core truth 对象:先思考` completed
89. 确认 `R6.10 domain core truth 对象:再写入` completed
90. 确认 `R6.11 domain trace / relation / external / peripheral 对象:先思考` completed
91. 确认 `R6.12 domain trace / relation / external / peripheral 对象:再写入` completed
92. 确认 `R6.13 domain policy / guard / state owner 预筛:先思考` completed
93. 确认 `R6.14 domain policy / guard / state owner 预筛:再写入` completed
94. 确认 `R6.15 application helper / orchestration support object:先思考` completed
95. 确认 `R6.16 application helper / orchestration support object:再写入` completed
96. 确认 `R6.17 infra adapter state 与 runtime support object:先思考` completed
97. 确认 `R6.18 infra adapter state 与 runtime support object:再写入` completed
98. 确认 `R6.19 api / worker / jobs entry object:先思考` completed
99. 确认 `R6.20 api / worker / jobs entry object:再写入` completed
100. 确认 `R6.21 字段来源与状态主语闭环审计:先思考` completed
101. 确认 `R6.22 字段来源与状态主语闭环审计:再写入` completed
102. 确认 `R6.23 历史 Step 6 差异审计:先思考` completed
103. 确认 `R6.24 历史 Step 6 差异审计:再写入` completed
104. 确认 `R6.25 回填草稿:先思考` completed
105. 确认 `R6.26 回填草稿:再写入` completed
106. 确认 `R6.27 自检与停审:先思考` completed
107. 确认 `R6.28 自检与停审:再写入` completed
108. 读取 `design-calibration/03_ddd_step_07_trait_port_adapter.md`
109. 确认旧 Step 7 completed 状态已重置为 historical_material
110. 确认 `R7.1 开工与必读文档:先思考` completed
111. 确认 `R7.2 开工与必读文档:再写入` completed
112. 确认 `R7.3 L1-governance 框架对齐:先思考` completed
113. 确认 `R7.4 L1-governance 框架对齐:再写入` completed
114. 确认 `R7.5 Step 6 承接与接缝发现轴:先思考` completed
115. 确认 `R7.6 Step 6 承接与接缝发现轴:再写入` completed
116. 确认 `R7.7 application 基础 port / helper:先思考` completed
117. 确认 `R7.8 application 基础 port / helper:再写入` completed
118. 确认 `R7.9 domain truth repository port:先思考` completed
119. 确认 `R7.10 domain truth repository port:再写入` completed
120. 确认 `R7.11 support / trace / relation / material repository port:先思考` completed
121. 确认 `R7.12 support / trace / relation / material repository port:再写入` completed
122. 确认 `R7.13 policy / resolver / mapper / builder port:先思考` completed
123. 确认 `R7.14 policy / resolver / mapper / builder port:再写入` completed
124. 确认 `R7.15 inbound / outbound / publisher / handoff port:先思考` completed
125. 确认 `R7.16 inbound / outbound / publisher / handoff port:再写入` completed
126. 确认 `R7.17 jobs / maintenance / runtime adapter port:先思考` completed
127. 确认 `R7.18 jobs / maintenance / runtime adapter port:再写入` completed
128. 确认 `R7.19 infra implementation / entry restriction:先思考` completed
129. 确认 `R7.20 infra implementation / entry restriction:再写入` completed
130. 确认 `R7.21 跨模块接缝审计:先思考` completed
131. 确认 `R7.22 跨模块接缝审计:再写入` completed
132. 确认 `R7.23 回填草稿:先思考` completed
133. 确认 `R7.24 回填草稿:再写入` completed
134. 确认 `R7.25 自检与停审:先思考` completed
135. 确认 `R7.26 自检与停审:再写入` completed
136. 确认 Step 7 completed
137. 读取 `design-calibration/03_ddd_step_08_protocol_contracts.md`
138. 确认旧 Step 8 completed 状态为 historical_material,不得继承
139. 确认 `R8.1 开工与必读文档:先思考` completed
140. 确认 `R8.2 开工与必读文档:再写入` completed
141. 确认 `R8.3 L1-governance 框架对齐:先思考` completed
142. 确认 `R8.4 L1-governance 框架对齐:再写入` completed
143. 确认 `R8.5 Step 7 承接与协议发现轴:先思考` completed
144. 确认 `R8.6 Step 7 承接与协议发现轴:再写入` completed
145. 确认 `R8.7 shared protocol helper:先思考` completed
146. 确认 `R8.8 shared protocol helper:再写入` completed
147. 确认 `R8.9 Command protocol family:先思考` completed
148. 确认 `R8.10 Command protocol family:再写入` completed
149. 确认 `R8.11 Query protocol family:先思考` completed
150. 确认 `R8.12 Query protocol family:再写入` completed
151. 确认 `R8.13 Inbound consumer protocol family:先思考` completed
152. 确认 `R8.14 Inbound consumer protocol family:再写入` completed
153. 确认 `R8.15 Outbound event protocol family:先思考` completed
154. 确认 `R8.16 Outbound event protocol family:再写入` completed
155. 确认 `R8.17 Operations job protocol family:先思考` completed
156. 确认 `R8.18 Operations job protocol family:再写入` completed
157. 确认 `R8.19 Protocol-to-object / port closure:先思考` completed
158. 确认 `R8.20 Protocol-to-object / port closure:再写入` completed
159. 确认 `R8.21 跨协议 public surface 审计:先思考` completed
160. 确认 `R8.22 跨协议 public surface 审计:再写入` completed
161. 确认 `R8.23 回填草稿:先思考` completed
162. 确认 `R8.24 回填草稿:再写入` completed
163. 确认 `R8.25 自检与停审:先思考` completed
164. 确认 `R8.26 自检与停审:再写入` completed
165. 确认 Step 8 completed
166. 确认旧版 `R9.1`~`R9.26` completed 结论已作废,不得作为 Step 9 完成依据
167. 读取重写后的 `design-calibration/03_ddd_step_09_function_flows.md`
168. 确认 `R9.27 Step 9 重写开工与 L1 粒度差异审计:再写入` completed
169. 确认 `R9.28 Command shared template 与逐 flow 写入:再写入` completed
170. 确认 `R9.29 Query shared template 与逐 flow 写入:再写入` completed
171. 确认 `R9.30 Inbound consumer 逐 flow 写入:再写入` completed
172. 确认 `R9.31 Outbound event / publisher 逐 flow 写入:再写入` completed
173. 确认 `R9.32 Operations Job 逐 flow 写入:再写入` completed
174. 确认 `R9.33 Cross-flow closure audit 与 handoff:再写入` completed
175. 确认 `R9.34 正式 §8 候选草稿与 compact baseline 停审:再写入` completed_superseded_by_R9.35_to_R9.44
176. 确认 `R9.35 L1 粒度补全开工与扩写模板:再写入` completed
177. 确认 `R9.36 58 个 Command 的函数级执行 overlay:再写入` completed
178. 确认 `R9.37 57 个 Query 的函数级执行 overlay:再写入` completed
179. 确认 `R9.38 4 个 Inbound Consumer 的函数级执行 overlay:再写入` completed
180. 确认 `R9.39 34 个 Outbound Event / publication 的函数级执行 overlay:再写入` completed
181. 确认 `R9.40 8 个 Operations Job 的函数级执行 overlay:再写入` completed
182. 确认 `R9.41 L1 粒度 cross-flow closure audit:再写入` completed
183. 确认 `R9.42 Watch / blocker ledger 补全:再写入` completed
184. 确认 `R9.43 L1 粒度正式 §8 候选草稿补全:再写入` completed
185. 确认 `R9.44 L1 粒度补全最终停审:再写入` completed_wait_user_confirm
186. 确认 Step 9 L1-granularity completion completed,但仍停在 completed_wait_user_confirm
187. 确认 next_allowed_action = 等待用户确认后进入 Step 10 `R10.1 开工与必读文档:先思考`
188. 确认用户已同意进入 Step 10 `R10.1 开工与必读文档:先思考`
189. 读取并重置 `design-calibration/03_ddd_step_10_state_machine.md`
190. 确认旧 Step 10 completed 状态已作废,旧 `MethodContentLifecycle` / publish / outbox / fingerprint / P1 状态机只作 historical pollution
191. 确认 `R10.1 开工与必读文档:先思考` completed
192. 确认用户已同意进入 Step 10 `R10.2 开工与必读文档:再写入`
193. 确认 `R10.2 开工与必读文档:再写入` completed
194. 确认用户已同意进入 Step 10 `R10.3 L1-governance 框架对齐:先思考`
195. 确认已读取 `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md` 框架
196. 确认 `R10.3 L1-governance 框架对齐:先思考` completed
197. 确认用户已同意进入 Step 10 `R10.4 L1-governance 框架对齐:再写入`
198. 确认 `R10.4 L1-governance 框架对齐:再写入` completed
199. 确认用户已同意进入 Step 10 `R10.5 状态主语筛选与排除表:先思考`
200. 确认 `R10.5 状态主语筛选与排除表:先思考` completed
201. 确认用户已同意进入 Step 10 `R10.6 状态主语筛选与排除表:再写入`
202. 确认 `R10.6 状态主语筛选与排除表:再写入` completed
203. 确认用户已同意进入 Step 10 `R10.7 business truth 状态机:先思考`
204. 确认 `R10.7 business truth 状态机:先思考` completed
205. 确认用户已同意进入 Step 10 `R10.8 business truth 状态机:再写入`
206. 确认 `R10.8 business truth 状态机:再写入` completed
207. 确认用户已同意进入 Step 10 `R10.9 source/reference/body-boundary 状态机:先思考`
208. 确认 `R10.9 source/reference/body-boundary 状态机:先思考` completed
209. 确认用户已同意进入 Step 10 `R10.10 source/reference/body-boundary 状态机:再写入`
210. 确认 `R10.10 source/reference/body-boundary 状态机:再写入` completed
211. 确认用户已同意进入 Step 10 `R10.11 trace/audit/lineage/impact 状态机:先思考`
212. 确认 `R10.11 trace/audit/lineage/impact 状态机:先思考` completed
213. 确认用户已同意进入 Step 10 `R10.12 trace/audit/lineage/impact 状态机:再写入`
214. 确认 `R10.12 trace/audit/lineage/impact 状态机:再写入` completed
215. 确认用户已同意进入 Step 10 `R10.13 read/visibility/material freshness 状态机:先思考`
216. 确认 `R10.13 read/visibility/material freshness 状态机:先思考` completed
217. 确认用户已同意进入 Step 10 `R10.14 read/visibility/material freshness 状态机:再写入`
218. 确认 `R10.14 read/visibility/material freshness 状态机:再写入` completed
219. 确认用户已同意进入 Step 10 `R10.15 maintenance/job/report 状态机:先思考`
220. 确认 `R10.15 maintenance/job/report 状态机:先思考` completed
221. 确认用户已同意进入 Step 10 `R10.16 maintenance/job/report 状态机:再写入`
222. 确认 `R10.16 maintenance/job/report 状态机:再写入` completed
223. 确认用户已同意进入 Step 10 `R10.17 idempotency/replay/runtime/entry 状态机:先思考`
224. 确认 `R10.17 idempotency/replay/runtime/entry 状态机:先思考` completed
225. 确认用户已同意进入 Step 10 `R10.18 idempotency/replay/runtime/entry 状态机:再写入`
226. 确认 `R10.18 idempotency/replay/runtime/entry 状态机:再写入` completed_wait_user_confirm
227. 确认用户已同意进入 Step 10 `R10.19 outbound/publication/handoff 状态机:先思考`
228. 确认 `R10.19 outbound/publication/handoff 状态机:先思考` completed_wait_user_confirm
229. 确认用户已同意进入 Step 10 `R10.20 outbound/publication/handoff 状态机:再写入`
230. 确认 `R10.20 outbound/publication/handoff 状态机:再写入` completed_wait_user_confirm
231. 确认用户已同意进入 Step 10 `R10.21 跨状态机审计与 Step 11~16 handoff:先思考`
232. 确认 `R10.21 跨状态机审计与 Step 11~16 handoff:先思考` completed_wait_user_confirm
233. 确认用户已同意进入 Step 10 `R10.22 跨状态机审计与 Step 11~16 handoff:再写入`
234. 确认 `R10.22 跨状态机审计与 Step 11~16 handoff:再写入` completed_wait_user_confirm
235. 确认用户已同意进入 Step 10 `R10.23 正式 §9 候选草稿与停审:先思考`
236. 确认 `R10.23 正式 §9 候选草稿与停审:先思考` completed_wait_user_confirm
237. 确认用户已同意进入 Step 10 `R10.24 正式 §9 候选草稿与停审:再写入`
238. 确认 `R10.24 正式 §9 候选草稿与停审:再写入` completed_wait_user_confirm
239. 确认用户已同意进入 Step 11 `R11.1 开工与必读文档:先思考`
240. 确认 `R11.1 开工与必读文档:先思考` completed_wait_user_confirm
241. 确认用户已同意进入 Step 11 `R11.2 开工与必读文档:再写入`
242. 确认 `R11.2 开工与必读文档:再写入` completed_wait_user_confirm
243. 确认用户已同意进入 Step 11 `R11.3 L1-governance 框架对齐与输出骨架:先思考`
244. 确认 `R11.3 L1-governance 框架对齐与输出骨架:先思考` completed_wait_user_confirm
245. 确认用户已同意进入 Step 11 `R11.5 数据所有权与 logical store 筛选:先思考`
246. 确认 `R11.5 数据所有权与 logical store 筛选:先思考` completed_wait_user_confirm
247. 确认 `R11.5 数据所有权与 logical store 筛选:先思考` completed
248. 确认 next_allowed_action = 等待用户确认后进入 Step 11 `R11.7 core business truth 持久化契约:先思考`
249. 根据三层 gate_status 判断是否允许进入下一动作,不得根据对话记忆跳过当前模块
250. 确认用户已同意进入 Step 11 `R11.23 cross-step closure audit 与正式 §10 候选草稿停审:先思考`
251. 确认 `R11.23 cross-step closure audit 与正式 §10 候选草稿停审:先思考` completed_wait_user_confirm
252. 确认用户已同意进入 Step 11 `R11.24 cross-step closure audit 与正式 §10 候选草稿停审:再写入`
253. 确认 `R11.24 cross-step closure audit 与正式 §10 候选草稿停审:再写入` completed_wait_user_confirm
254. 确认用户已同意进入 Step 12 `R12.1 开工与必读文档:先思考`
255. 确认 `R12.1 开工与必读文档:先思考` completed_wait_user_confirm
256. 确认用户已同意进入 Step 12 `R12.2 开工与必读文档:再写入`
257. 确认 `R12.2 开工与必读文档:再写入` completed_wait_user_confirm
258. 确认用户已同意进入 Step 12 `R12.3 错误层级与类型族:先思考`
259. 确认 `R12.3 错误层级与类型族:先思考` completed_wait_user_confirm
260. 确认用户已同意进入 Step 12 `R12.4 错误层级与类型族:再写入`
261. 确认 `R12.4 错误层级与类型族:再写入` completed_wait_user_confirm
262. 确认用户已同意进入 Step 12 `R12.5 Command / accepted / rejected / duplicate 错误恢复:先思考`
263. 确认 `R12.5 Command / accepted / rejected / duplicate 错误恢复:先思考` completed_wait_user_confirm
264. 确认用户已同意进入 Step 12 `R12.6 Command / accepted / rejected / duplicate 错误恢复:再写入`
265. 确认 `R12.6 Command / accepted / rejected / duplicate 错误恢复:再写入` completed_wait_user_confirm
266. 确认用户已同意进入 Step 12 `R12.7 Query surface 与 degraded/unavailable 恢复:先思考`
267. 确认 `R12.7 Query surface 与 degraded/unavailable 恢复:先思考` completed_wait_user_confirm
268. 确认用户已同意进入 Step 12 `R12.8 Query surface 与 degraded/unavailable 恢复:再写入`
269. 确认 `R12.8 Query surface 与 degraded/unavailable 恢复:再写入` completed_wait_user_confirm
270. 确认用户已同意进入 Step 12 `R12.9 Inbound / Outbound / Handoff 错误恢复:先思考`
271. 确认 `R12.9 Inbound / Outbound / Handoff 错误恢复:先思考` completed_wait_user_confirm
272. 确认用户已同意进入 Step 12 `R12.10 Inbound / Outbound / Handoff 错误恢复:再写入`
273. 确认 `R12.10 Inbound / Outbound / Handoff 错误恢复:再写入` completed_wait_user_confirm
274. 确认用户已同意进入 Step 12 `R12.11 Job / operations recovery 错误恢复:先思考`
275. 确认 `R12.11 Job / operations recovery 错误恢复:先思考` completed_wait_user_confirm
276. 确认用户已同意进入 Step 12 `R12.12 Job / operations recovery 错误恢复:再写入`
277. 确认 `R12.12 Job / operations recovery 错误恢复:再写入` completed_wait_user_confirm
278. 确认用户已同意进入 Step 12 `R12.13 audit / side-effect failure rules:先思考`
279. 确认 `R12.13 audit / side-effect failure rules:先思考` completed_wait_user_confirm
280. 确认用户已同意进入 Step 12 `R12.14 audit / side-effect failure rules:再写入`
281. 确认 `R12.14 audit / side-effect failure rules:再写入` completed_wait_user_confirm
282. 确认用户已同意进入 Step 12 `R12.15 cross-step closure audit 与正式 §11 候选草稿停审:先思考`
283. 确认 `R12.15 cross-step closure audit 与正式 §11 候选草稿停审:先思考` completed_wait_user_confirm
284. 确认用户已同意进入 Step 12 `R12.16 cross-step closure audit 与正式 §11 候选草稿停审:再写入`
285. 确认 `R12.16 cross-step closure audit 与正式 §11 候选草稿停审:再写入` completed_wait_user_confirm
286. 确认 Step 12 completed_wait_user_confirm;next_allowed_action = 等待用户确认后进入 Step 13 `R13.1 开工与必读文档:先思考`
287. 确认用户已同意进入 Step 13 `R13.1 开工与必读文档:先思考`
288. 确认旧 `03_ddd_step_13_concurrency_idempotency.md` 为 historical_material,不得继承 completed 状态
289. 确认 `R13.1 开工与必读文档:先思考` completed_wait_user_confirm
290. 确认用户已同意进入 Step 13 `R13.2 开工与必读文档:再写入`
291. 确认 `R13.2 开工与必读文档:再写入` completed_wait_user_confirm
292. 确认用户已同意进入 Step 13 `R13.3 保护层级与类型族:先思考`
293. 确认 `R13.3 保护层级与类型族:先思考` completed_wait_user_confirm
294. 确认用户已同意进入 Step 13 `R13.4 保护层级与类型族:再写入`
295. 确认 `R13.4 保护层级与类型族:再写入` completed_wait_user_confirm
296. 确认用户已同意进入 Step 13 `R13.5 Command idempotency / concurrency:先思考`
297. 确认 `R13.5 Command idempotency / concurrency:先思考` completed_wait_user_confirm
298. 确认用户已同意进入 Step 13 `R13.6 Command idempotency / concurrency:再写入`
299. 确认 `R13.6 Command idempotency / concurrency:再写入` completed_wait_user_confirm
300. 确认用户已同意进入 Step 13 `R13.7 Query repeatability / no-write:先思考`
301. 确认 `R13.7 Query repeatability / no-write:先思考` completed_wait_user_confirm
302. 确认用户已同意进入 Step 13 `R13.8 Query repeatability / no-write:再写入`
303. 确认 `R13.8 Query repeatability / no-write:再写入` completed_wait_user_confirm
304. 确认用户已同意进入 Step 13 `R13.9 Inbound / Outbound / Handoff reentry:先思考`
305. 确认 `R13.9 Inbound / Outbound / Handoff reentry:先思考` completed_wait_user_confirm
306. 确认用户已同意进入 Step 13 `R13.10 Inbound / Outbound / Handoff reentry:再写入`
307. 确认 `R13.10 Inbound / Outbound / Handoff reentry:再写入` completed_wait_user_confirm
308. 确认用户已同意进入 Step 13 `R13.11 Job / checkpoint resume:先思考`
309. 确认 `R13.11 Job / checkpoint resume:先思考` completed_wait_user_confirm
310. 确认用户已同意进入 Step 13 `R13.12 Job / checkpoint resume:再写入`
311. 确认 `R13.12 Job / checkpoint resume:再写入` completed_wait_user_confirm
312. 确认用户已同意进入 Step 13 `R13.13 retry / lock / lease boundary:先思考`
313. 确认 `R13.13 retry / lock / lease boundary:先思考` completed_wait_user_confirm
314. 确认用户已同意进入 Step 13 `R13.14 retry / lock / lease boundary:再写入`
315. 确认 `R13.14 retry / lock / lease boundary:再写入` completed_wait_user_confirm
316. 确认用户已同意进入 Step 13 `R13.15 cross-step closure audit 与正式 §12 候选草稿停审:先思考`
317. 确认 `R13.15 cross-step closure audit 与正式 §12 候选草稿停审:先思考` completed_wait_user_confirm
318. 确认用户已同意进入 Step 13 `R13.16 cross-step closure audit 与正式 §12 候选草稿停审:再写入`
319. 确认 `R13.16 cross-step closure audit 与正式 §12 候选草稿停审:再写入` completed_wait_user_confirm;Step 13 completed;等待用户确认进入 Step 14 `R14.1 开工与必读文档:先思考`
320. 确认用户已同意进入 Step 14 `R14.1 开工与必读文档:先思考`
321. 确认旧 `03_ddd_step_14_config_dependencies.md` 为 historical_material,不得继承 completed 状态;确认 `R14.1 开工与必读文档:先思考` completed_wait_user_confirm
322. 确认用户已同意进入 Step 14 `R14.2 开工与必读文档:再写入`
323. 确认 `R14.2 开工与必读文档:再写入` completed_wait_user_confirm
324. 确认用户已同意进入 Step 14 `R14.3 配置边界与读取模块:先思考`
325. 确认 `R14.3 配置边界与读取模块:先思考` completed_wait_user_confirm
326. 确认用户已同意进入 Step 14 `R14.4 配置边界与读取模块:再写入`
327. 确认 `R14.4 配置边界与读取模块:再写入` completed_wait_user_confirm
328. 确认用户已同意进入 Step 14 `R14.5 配置引用 family 与 binding source:先思考`
329. 确认 `R14.5 配置引用 family 与 binding source:先思考` completed_wait_user_confirm
330. 确认用户已同意进入 Step 14 `R14.6 配置引用 family 与 binding source:再写入`
331. 确认 `R14.6 配置引用 family 与 binding source:再写入` completed_wait_user_confirm
332. 确认用户已同意进入 Step 14 `R14.7 外部依赖 / adapter / runtime binding:先思考`
333. 确认 `R14.7 外部依赖 / adapter / runtime binding:先思考` completed_wait_user_confirm
334. 确认用户已同意进入 Step 14 `R14.8 外部依赖 / adapter / runtime binding:再写入`
335. 确认 `R14.8 外部依赖 / adapter / runtime binding:再写入` completed_wait_user_confirm
336. 确认用户已同意进入 Step 14 `R14.9 跨仓依赖与 sibling repo 协作:先思考`
337. 确认 `R14.9 跨仓依赖与 sibling repo 协作:先思考` completed_wait_user_confirm
338. 确认用户已同意进入 Step 14 `R14.10 跨仓依赖与 sibling repo 协作:再写入`
339. 确认 `R14.10 跨仓依赖与 sibling repo 协作:再写入` completed_wait_user_confirm
340. 确认用户已同意进入 Step 14 `R14.11 runtime builder / entry binding 顺序:先思考`
341. 确认 `R14.11 runtime builder / entry binding 顺序:先思考` completed_wait_user_confirm
342. 确认用户已同意进入 Step 14 `R14.12 runtime builder / entry binding 顺序:再写入`
343. 确认 `R14.12 runtime builder / entry binding 顺序:再写入` completed_wait_user_confirm
344. 确认用户已同意进入 Step 14 `R14.13 禁止配置化边界与正式 §13 候选草稿停审:先思考`
345. 确认 `R14.13 禁止配置化边界与正式 §13 候选草稿停审:先思考` completed_wait_user_confirm
346. 确认用户已同意进入 Step 14 `R14.14 禁止配置化边界与正式 §13 候选草稿停审:再写入`
347. 确认 `R14.14 禁止配置化边界与正式 §13 候选草稿停审:再写入` completed_wait_user_confirm;Step 14 completed;等待用户确认进入 Step 15 `R15.1 开工与必读文档:先思考`
348. 确认用户已同意进入 Step 15 `R15.1 开工与必读文档:先思考`
349. 确认旧 `03_ddd_step_15_observability_audit.md` 为 historical_material,不得继承 completed 状态;确认 `R15.1 开工与必读文档:先思考` completed_wait_user_confirm
350. 确认用户已同意进入 Step 15 `R15.2 开工与必读文档:再写入`
351. 确认 `R15.2 开工与必读文档:再写入` completed_wait_user_confirm
352. 确认用户已同意进入 Step 15 `R15.3 可观测性分层与总原则:先思考`
353. 确认 `R15.3 可观测性分层与总原则:先思考` completed_wait_user_confirm
354. 确认用户已同意进入 Step 15 `R15.4 可观测性分层与总原则:再写入`
355. 确认 `R15.4 可观测性分层与总原则:再写入` completed_wait_user_confirm
356. 确认用户已同意进入 Step 15 `R15.5 structured log cuts:先思考`
357. 确认 `R15.5 structured log cuts:先思考` completed_wait_user_confirm
358. 确认用户已同意进入 Step 15 `R15.6 structured log cuts:再写入`
359. 确认 `R15.6 structured log cuts:再写入` completed_wait_user_confirm
360. 确认用户已同意进入 Step 15 `R15.7 metric cuts:先思考`
361. 确认 `R15.7 metric cuts:先思考` completed_wait_user_confirm
362. 确认用户已同意进入 Step 15 `R15.8 metric cuts:再写入`
363. 确认 `R15.8 metric cuts:再写入` completed_wait_user_confirm
364. 确认用户已同意进入 Step 15 `R15.9 trace / span / correlation cuts:先思考`
365. 确认 `R15.9 trace / span / correlation cuts:先思考` completed_wait_user_confirm
366. 确认用户已同意进入 Step 15 `R15.10 trace / span / correlation cuts:再写入`
367. 确认 `R15.10 trace / span / correlation cuts:再写入` completed_wait_user_confirm
368. 确认用户已同意进入 Step 15 `R15.11 audit / operations fact cuts:先思考`
369. 确认 `R15.11 audit / operations fact cuts:先思考` completed_wait_user_confirm
370. 确认用户已同意进入 Step 15 `R15.12 audit / operations fact cuts:再写入`
371. 确认 `R15.12 audit / operations fact cuts:再写入` completed_wait_user_confirm
372. 确认用户已同意进入 Step 15 `R15.13 redaction / sensitive boundary / handoff:先思考`
373. 确认 `R15.13 redaction / sensitive boundary / handoff:先思考` completed_wait_user_confirm
374. 确认用户已同意进入 Step 15 `R15.14 redaction / sensitive boundary / handoff:再写入`
375. 确认 `R15.14 redaction / sensitive boundary / handoff:再写入` completed_wait_user_confirm
376. 确认用户已同意进入 Step 15 `R15.15 cross-step closure and formal §14 candidate stop-review:先思考`
377. 确认 `R15.15 cross-step closure and formal §14 candidate stop-review:先思考` completed_wait_user_confirm
378. 确认用户已同意进入 Step 15 `R15.16 cross-step closure and formal §14 candidate stop-review:再写入`
379. 确认 `R15.16 cross-step closure and formal §14 candidate stop-review:再写入` completed_wait_user_confirm;Step 15 completed;等待用户确认进入 Step 16 `R16.1 开工与必读文档:先思考`
380. 确认用户已同意进入 Step 16 `R16.1 开工与必读文档:先思考`
381. 确认旧 `03_ddd_step_16_test_cut.md` 为 historical_material,不得继承 completed 状态;确认 `R16.1 开工与必读文档:先思考` completed_wait_user_confirm
382. 确认用户已同意进入 Step 16 `R16.2 开工与必读文档:再写入`
383. 确认 `R16.2 开工与必读文档:再写入` completed_wait_user_confirm
384. 确认用户已同意进入 Step 16 `R16.3 L1-governance 框架对齐与测试切口总图:先思考`
385. 确认 `R16.3 L1-governance 框架对齐与测试切口总图:先思考` completed_wait_user_confirm
386. 确认用户已同意进入 Step 16 `R16.4 L1-governance 框架对齐与测试切口总图:再写入`
387. 确认 `R16.4 L1-governance 框架对齐与测试切口总图:再写入` completed_wait_user_confirm
388. 确认用户已同意进入 Step 16 `R16.5 module test cuts:先思考`
389. 确认 `R16.5 module test cuts:先思考` completed_wait_user_confirm
390. 确认用户已同意进入 Step 16 `R16.6 module test cuts:再写入`
391. 确认 `R16.6 module test cuts:再写入` completed_wait_user_confirm
392. 确认用户已同意进入 Step 16 `R16.7 Command / Query test cuts:先思考`
393. 确认 `R16.7 Command / Query test cuts:先思考` completed_wait_user_confirm
394. 确认用户已同意进入 Step 16 `R16.8 Command / Query test cuts:再写入`
395. 确认 `R16.8 Command / Query test cuts:再写入` completed_wait_user_confirm
396. 确认用户已同意进入 Step 16 `R16.9 Inbound / Outbound / Job test cuts:先思考`
397. 确认 `R16.9 Inbound / Outbound / Job test cuts:先思考` completed_wait_user_confirm
398. 确认用户已同意进入 Step 16 `R16.10 Inbound / Outbound / Job test cuts:再写入`
399. 确认 `R16.10 Inbound / Outbound / Job test cuts:再写入` completed_wait_user_confirm
400. 确认用户已同意进入 Step 16 `R16.11 state machine test cuts:先思考`
401. 确认 `R16.11 state machine test cuts:先思考` completed_wait_user_confirm
402. 确认用户已同意进入 Step 16 `R16.12 state machine test cuts:再写入`
403. 确认 `R16.12 state machine test cuts:再写入` completed_wait_user_confirm
404. 确认用户已同意进入 Step 16 `R16.13 consistency / idempotency / concurrency cuts:先思考`
405. 确认 `R16.13 consistency / idempotency / concurrency cuts:先思考` completed_wait_user_confirm
406. 确认用户已同意进入 Step 16 `R16.14 consistency / idempotency / concurrency cuts:再写入`
407. 确认 `R16.14 consistency / idempotency / concurrency cuts:再写入` completed_wait_user_confirm
408. 确认用户已同意进入 Step 16 `R16.15 error / config / observability cuts:先思考`
409. 确认 `R16.15 error / config / observability cuts:先思考` completed_wait_user_confirm
410. 确认用户已同意进入 Step 16 `R16.16 error / config / observability cuts:再写入`
411. 确认 `R16.16 error / config / observability cuts:再写入` completed_wait_user_confirm
412. 确认用户已同意进入 Step 16 `R16.17 cross-step closure and formal §15 candidate stop-review:先思考`
413. 确认 `R16.17 cross-step closure and formal §15 candidate stop-review:先思考` completed_wait_user_confirm
414. 确认用户已同意进入 Step 16 `R16.18 cross-step closure and formal §15 candidate stop-review:再写入`
415. 确认 `R16.18 cross-step closure and formal §15 candidate stop-review:再写入` completed_wait_user_confirm;Step 16 completed;等待用户确认进入 Step 17 `R17.1 开工与必读文档:先思考`
416. 确认用户已同意进入 Step 17 `R17.1 开工与必读文档:先思考`
417. 确认旧 `03_ddd_step_17_implementation_handoff.md` 为 historical_material,不得继承 completed 状态;确认 `R17.1 开工与必读文档:先思考` completed_wait_user_confirm
418. 确认用户已同意进入 Step 17 `R17.2 开工与必读文档:再写入`
419. 确认 `R17.2 开工与必读文档:再写入` completed_wait_user_confirm
420. 确认用户已同意进入 Step 17 `R17.3 L1-governance 框架对齐与承接总图:先思考`
421. 确认 `R17.3 L1-governance 框架对齐与承接总图:先思考` completed_wait_user_confirm
422. 确认用户已同意进入 Step 17 `R17.4 L1-governance 框架对齐与承接总图:再写入`
423. 确认 `R17.4 L1-governance 框架对齐与承接总图:再写入` completed_wait_user_confirm
424. 确认用户已同意进入 Step 17 `R17.5 implementation handoff source matrix:先思考`
425. 确认 `R17.5 implementation handoff source matrix:先思考` completed_wait_user_confirm
426. 确认用户已同意进入 Step 17 `R17.6 implementation handoff source matrix:再写入`
427. 确认 `R17.6 implementation handoff source matrix:再写入` completed_wait_user_confirm
428. 确认用户已同意进入 Step 17 `R17.7 implementation preread and agent gate:先思考`
429. 确认 `R17.7 implementation preread and agent gate:先思考` completed_wait_user_confirm
```

---

## 8. 当前 next_allowed_action

```text
`03-详细设计.md` full-restart formal assembly completed;
等待用户确认后进入 `04-配置设计.md` full-restart 开工;
只允许按配置设计 SOP 创建 / 更新 `04` 的 calibration flow 和 Step 1 开工记录;
不得直接写实现仓代码;
不得写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。
```
