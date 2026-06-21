# L3-method-library 项目设计讨论执行台账

> 创建日期: 2026-06-15
> 当前模式: full-restart
> 当前任务: `02-概要设计` full-restart 已完成;等待用户确认后启动 `03-详细设计` 讨论。
> 项目目录: `projects/L3-method-library`
> 临时计划: `/tmp/l3_method_library_00_requirements_discussion_steps.md`;`/tmp/l3_method_library_step05_rewrite_plan.md`;`/tmp/l3_method_library_step05_gap_audit_framework.md`

---

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `03-详细设计.md` | not_started | `等待用户确认:启动 03 详细设计讨论` | wait_user_confirm | 正式 `02-概要设计.md` full-restart 已完成,可作为 03 输入基线;旧 `03_ddd_*` 仍为 historical material,不得直接继承。 | 等待用户确认后按详细设计 SOP 创建 / 重启 03 讨论 flow;先读取 00、01、02 完成态和历史材料隔离口径。 | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`design-calibration/02_hld_calibration_flow.md`;`design-calibration/02_hld_step_14_formal_document_assembly.md#R1.17` |

---

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | completed | 00 completed | pass | 已完成,可作为后续设计输入。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | completed | completed | pass | Step 16 已完成;正式文档可作为后续 `02-概要设计.md` 输入。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | completed | completed | pass | `R1.17` 已记录正式 02 装配完成。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | waiting_to_start | not_started | wait_user_confirm | 等待用户确认后按详细设计 SOP 启动;历史 `03_ddd_*` 只作污染审计对象。 |
| `04-配置设计.md` | not_created | blocked | not_started | blocked | blocked_by_03_not_restarted |
| `05-测试方案.md` | not_restarted | blocked | not_started | blocked | blocked_by_03_not_restarted |
| `06-验收标准.md` | not_restarted | blocked | not_started | blocked | blocked_by_03_not_restarted |
| `07-实施计划.md` | not_restarted | blocked | not_started | blocked | blocked_by_03_not_restarted |

---

## 3. 本轮 full-restart 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 旧 `00-需求文档.md` 不作为本轮需求结论 | completed | 需求文档已在本轮重启中完成装配。 |
| 旧 `01-架构设计.md` 不作为本轮架构结论 | completed | 架构文档已按本轮 Step 1~16 重建完成。 |
| 旧 `02~07` 与历史 `02/03` calibration 不反推当前结论 | active | 后续文档启动时仅作为后置差异审计或污染检查输入。 |
| 每个 Step 先列必读文档 | active | 必读文档摘要必须写入当前 Step 文件。 |
| 每个 Step 先搭整体模块,再逐模块先思考后写入 | active | 模块思考和写入记录在当前 Step 文件内,不拆新文件。 |
| 单次写入批次不等于文件长度上限 | active | 100~300 行只约束单次 patch / 写入批次。 |

---

## 4. 全局 blocker 台账

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ML-S5-GAP-001 | `02_hld_calibration_flow.md`;`project_execution_ledger.md` | resolved | flow / 台账曾指向 Step 12,与 Step 5 rewrite 裁决冲突。 | Step 5 已完成并切到 Step 6 recheck 入口。 |
| ML-S5-GAP-002 | `02-概要设计.md` §8~§9 | resolved | 正式 §8 和 §9 已按本轮回填。 | Step 10 起必须以当前正式 §5~§9 和对应中间产物为第一来源。 |
| ML-S5-GAP-003 | `02_hld_step_09_state_machine.md` | resolved | Step 9 当前中间产物和正式 §9 已完成重写、停审和回填。 | Step 10 只能承接当前状态组与传播红线,不得回流旧状态主线。 |
| ML-S14-GAP-001 | 正式 `02-概要设计.md` §2~§4 | resolved | §2、§3、§4 缺 `延伸阅读` 块,导致 Step 14 `R1.16` 自检未通过;`R1.16b` 已执行三处最小补丁,`R1.16c` 复检通过,`R1.16d` 已关闭。 | 无后续动作。 |

---

## 5. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取本文件 `project_execution_ledger.md`
2. 读取 `design-calibration/00_requirements_calibration_flow.md`
3. 读取 `design-calibration/01_architecture_calibration_flow.md`
4. 如继续核对 01,读取 `design-calibration/01_arch_step_16_formal_document_assembly.md`
5. 如继续 02,读取当前 flow 文件 `design-calibration/02_hld_calibration_flow.md`
6. 如继续 `02-概要设计`,先确认 `design-calibration/02_hld_step_05_components_boundary.md` 的 `0R.39` 已完成
7. 读取 `design-calibration/02_hld_step_06_key_objects.md`,确认 `8.45` 已关闭 Step 6
8. 读取 `design-calibration/02_hld_step_07_api_interface_skeleton.md`,确认 `R1.45` 已记录正式 §7 回填
9. 补读 `projects/L1-governance/design-calibration/02_hld_step_08_processing_flows.md`,只参考框架深度和章节顺序,不得复制领域语义
10. 读取 `design-calibration/02_hld_step_08_processing_flows.md`,确认 `R1.1` 已完成 Step 8 `开工与必读文档:先思考`
11. 确认 `R1.2` 已完成 Step 8 `开工与必读文档:再写入`
12. 确认 `R1.3` 已完成 Step 8 `L1-governance 框架对齐:先思考`
13. 确认 `R1.4` 已完成 Step 8 `L1-governance 框架对齐:再写入`
14. 确认 `R1.5` 已完成 Step 8 `接口到处理流候选池:先思考`
15. 确认 `R1.6` 已完成 Step 8 `接口到处理流候选池:再写入`
16. 确认 `R1.7` 已完成 Step 8 `通用处理流骨架:先思考`
17. 确认 `R1.8` 已完成 Step 8 `通用处理流骨架:再写入`
18. 确认 `R1.9` 已完成 Step 8 `方法资产定义与目录处理流:先思考`
19. 确认 `R1.10` 已完成 Step 8 `方法资产定义与目录处理流:再写入`
20. 确认 `R1.11` 已完成 Step 8 `正式化与版本处理流:先思考`
21. 确认 `R1.12` 已完成 Step 8 `正式化与版本处理流:再写入`
22. 确认 `R1.13` 已完成 Step 8 `受控消费处理流:先思考`
23. 确认 `R1.14` 已完成 Step 8 `受控消费处理流:再写入`
24. 确认 `R1.15` 已完成 Step 8 `追溯与一致性保护处理流:先思考`
25. 确认 `R1.16` 已完成 Step 8 `追溯与一致性保护处理流:再写入`
26. 确认 `R1.17` 已完成 Step 8 `关系与分发语义处理流:先思考`
27. 确认 `R1.18` 已完成 Step 8 `关系与分发语义处理流:再写入`
28. 确认 `R1.19` 已完成 Step 8 `外部摘要与引用处理流:先思考`
29. 确认 `R1.20` 已完成 Step 8 `外部摘要与引用处理流:再写入`
30. 确认 `R1.21` 已完成 Step 8 `后台维护与收敛处理流:先思考`
31. 确认 `R1.22` 已完成 Step 8 `后台维护与收敛处理流:再写入`
32. 确认 `R1.23` 已完成 Step 8 `外围包与方法集组织处理流:先思考`
33. 确认 `R1.24` 已完成 Step 8 `外围包与方法集组织处理流:再写入`
34. 确认 `R1.25` 已完成 Step 8 `跨处理流一致性审计:先思考`
35. 确认 `R1.26` 已完成 Step 8 `跨处理流一致性审计:再写入`
36. 确认 `R1.27` 已完成 Step 8 `旧材料差异审计:先思考`
37. 确认 `R1.28` 已完成 Step 8 `旧材料差异审计:再写入`
38. 确认 `R1.29` 已完成 Step 8 `正式 §8 回填草稿:先思考`
39. 确认 `R1.30` 已完成 Step 8 `正式 §8 回填草稿:再写入`
40. 确认 `R1.31` 已完成 Step 8 `自检与停审:先思考`
41. 确认 `R1.32` 已完成 Step 8 `自检与停审:再写入`
42. 确认 `R1.33` 已完成 Step 8 `正式 §8 回填记录:再写入`
43. 确认 `R1.1` 已完成 Step 9 `开工与必读文档:先思考`
44. 确认 `R1.2` 已完成 Step 9 `开工与必读文档:再写入`
45. 确认 `R1.3` 已完成 Step 9 `状态 owner 候选池:先思考`
46. 确认 `R1.4` 已完成 Step 9 `状态 owner 候选池:再写入`
47. 确认 `R1.5` 已完成 Step 9 `L1-governance 框架对齐:先思考`
48. 确认 `R1.6` 已完成 Step 9 `L1-governance 框架对齐:再写入`
49. 确认 `R1.7` 已完成 Step 9 `方法资产定义与目录状态:先思考`
50. 确认 `R1.8` 已完成 Step 9 `方法资产定义与目录状态:再写入`
51. 确认 `R1.9` 已完成 Step 9 `正式化与版本状态:先思考`
52. 确认 `R1.10` 已完成 Step 9 `正式化与版本状态:再写入`
53. 确认 `R1.11` 已完成 Step 9 `受控消费状态:先思考`
54. 确认 `R1.12` 已完成 Step 9 `受控消费状态:再写入`
55. 确认 `R1.13` 已完成 Step 9 `追溯与一致性保护状态:先思考`
56. 确认 `R1.14` 已完成 Step 9 `追溯与一致性保护状态:再写入`
57. 确认 `R1.15` 已完成 Step 9 `关系与分发语义状态:先思考`
58. 确认 `R1.16` 已完成 Step 9 `关系与分发语义状态:再写入`
59. 确认 `R1.17` 已完成 Step 9 `外部摘要与引用状态:先思考`
60. 确认 `R1.18` 已完成 Step 9 `外部摘要与引用状态:再写入`
61. 确认 `R1.19` 已完成 Step 9 `后台维护与收敛状态:先思考`
62. 确认 `R1.20` 已完成 Step 9 `后台维护与收敛状态:再写入`
63. 确认 `R1.21` 已完成 Step 9 `外围包与方法集组织状态:先思考`
64. 确认 `R1.22` 已完成 Step 9 `外围包与方法集组织状态:再写入`
65. 确认 `R1.23` 已完成 Step 9 `跨状态一致性审计:先思考`
66. 确认 `R1.24` 已完成 Step 9 `跨状态一致性审计:再写入`
67. 确认 `R1.25` 已完成 Step 9 `旧材料差异审计:先思考`
68. 确认 `R1.26` 已完成 Step 9 `旧材料差异审计:再写入`
69. 确认 `R1.27` 已完成 Step 9 `正式 §9 回填草稿:先思考`
70. 确认 `R1.28` 已完成 Step 9 `正式 §9 回填草稿:再写入`
71. 确认 `R1.29` 已完成 Step 9 `自检与停审:先思考`
72. 确认 `R1.30` 已完成 Step 9 `自检与停审:再写入`
73. 确认 `R1.31` 已完成 Step 9 `正式 §9 回填记录:再写入`
74. 确认 `R1.1` 已完成 Step 10 `开工与必读文档:先思考`
75. 确认 `R1.2` 已完成 Step 10 `开工与必读文档:再写入`
76. 确认 `R1.3` 已完成 Step 10 `L1-governance 框架对齐:先思考`
77. 确认 `R1.4` 已完成 Step 10 `L1-governance 框架对齐:再写入`
78. 确认 `R1.5` 已完成 Step 10 `异常 owner / 影响面候选池:先思考`
79. 确认 `R1.6` 已完成 Step 10 `异常 owner / 影响面候选池:再写入`
80. 确认 `R1.7` 已完成 Step 10 `core truth 写路径阻断异常:先思考`
81. 确认 `R1.8` 已完成 Step 10 `core truth 写路径阻断异常:再写入`
82. 确认 `R1.9` 已完成 Step 10 `Query / view / material 降级异常:先思考`
83. 确认 `R1.10` 已完成 Step 10 `Query / view / material 降级异常:再写入`
84. 确认 `R1.11` 已完成 Step 10 `external / inbound / body-free 边界异常:先思考`
85. 确认 `R1.12` 已完成 Step 10 `external / inbound / body-free 边界异常:再写入`
86. 确认 `R1.13` 已完成 Step 10 `publication / handoff / collaboration 异常:先思考`
87. 确认 `R1.14` 已完成 Step 10 `publication / handoff / collaboration 异常:再写入`
88. 确认 `R1.15` 已完成 Step 10 `maintenance / refresh / reconciliation 异常:先思考`
89. 确认 `R1.16` 已完成 Step 10 `maintenance / refresh / reconciliation 异常:再写入`
90. 确认 `R1.17` 已完成 Step 10 `peripheral package / method set / discovery 异常:先思考`
91. 确认 `R1.18` 已完成 Step 10 `peripheral package / method set / discovery 异常:再写入`
92. 确认 `R1.19` 已完成 Step 10 `跨异常一致性审计:先思考`
93. 确认 `R1.20` 已完成 Step 10 `跨异常一致性审计:再写入`
94. 确认 `R1.21` 已完成 Step 10 `旧材料差异审计:先思考`
95. 确认 `R1.22` 已完成 Step 10 `旧材料差异审计:再写入`
96. 确认 `R1.23` 已完成 Step 10 `正式 §10 回填草稿:先思考`
97. 确认 `R1.24` 已完成 Step 10 `正式 §10 回填草稿:再写入`
98. 确认 `R1.25` 已完成 Step 10 `自检与停审:先思考`
99. 确认 `R1.26` 已完成 Step 10 `自检与停审:再写入`
100. 确认 `R1.27` 已完成 Step 10 `正式 §10 回填记录:再写入`
101. Step 10 已完成正式 §10 回填,Step 11 已据此重开并完成正式 §11 回填
102. Step 11 重开时使用的输入基线为正式 §10 回填后文本、Step 10 `R1.1`~`R1.27`、Step 9 `R1.31`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论,未沿用旧 Step 11 completed 结论
103. historical Step 11 和旧完成状态只作污染审计对象,不得再作 Step 12 第一来源
104. 当前下一步只能等待用户确认后进入 Step 12 `开工与必读文档:先思考`,不得跳过 Step 12 开工模块
105. 确认 `R1.1` 已完成 Step 11 `开工与必读文档:先思考`
106. 确认 `R1.2` 已完成 Step 11 `开工与必读文档:再写入`
107. 确认 `R1.3` 已完成 Step 11 `L1-governance 框架对齐:先思考`
108. 确认 `R1.4` 已完成 Step 11 `L1-governance 框架对齐:再写入`
109. 确认 `R1.5` 已完成 Step 11 `配置影响来源池:先思考`
110. 确认 `R1.6` 已完成 Step 11 `配置影响来源池:再写入`
111. 确认 `R1.7` 已完成 Step 11 `核心组成部分间接受影响:先思考`
112. 确认 `R1.8` 已完成 Step 11 `核心组成部分间接受影响:再写入`
113. 确认 `R1.9` 已完成 Step 11 `入口 / adapter / transport / job 直接影响:先思考`
114. 确认 `R1.10` 已完成 Step 11 `入口 / adapter / transport / job 直接影响:再写入`
115. 确认 `R1.11` 已完成 Step 11 `Query / visibility / degraded 配置边界:先思考`
116. 确认 `R1.12` 已完成 Step 11 `Query / visibility / degraded 配置边界:再写入`
117. 确认 `R1.13` 已完成 Step 11 `body-free / publication / peripheral 配置边界:先思考`
118. 确认 `R1.14` 已完成 Step 11 `body-free / publication / peripheral 配置边界:再写入`
119. 确认 `R1.15` 已完成 Step 11 `禁止配置化边界:先思考`
120. 确认 `R1.16` 已完成 Step 11 `禁止配置化边界:再写入`
121. 确认 `R1.17` 已完成 Step 11 `03 / 04` 承接边界:先思考
122. 确认 `R1.18` 已完成 Step 11 `03 / 04` 承接边界:再写入
123. 确认 `R1.19` 已完成 Step 11 `旧材料差异审计:先思考`
124. 确认 `R1.20` 已完成 Step 11 `旧材料差异审计:再写入`
125. 确认 `R1.21` 已完成 Step 11 `正式 §11 回填草稿:先思考`
126. 确认 `R1.22` 已完成 Step 11 `正式 §11 回填草稿:再写入`
127. 确认 `R1.23` 已完成 Step 11 `自检与停审:先思考`
128. 确认 `R1.24` 已完成 Step 11 `自检与停审:再写入`
129. 确认 `R1.25` 已完成 Step 11 `正式 §11 回填记录:再写入`
130. Step 11 已完成正式 `§11` 回填,Step 12 当前已推进到 formal `§12` 草稿框架阶段
131. Step 12 必须以正式 `§11` 回填后文本、Step 11 `R1.1`~`R1.25`、Step 10 `R1.27`、Step 9 `R1.31`、Step 8 `R1.33`、Step 7 `R1.45`、Step 5 / Step 6 当前结论为输入基线,不得沿用旧正式 `§12` 或 historical Step 12 作为第一来源
132. Step 12 当前文件和正式 `§12` 只可作污染审计与差异检查对象,不得直接继承旧承接清单
133. 确认 `R1.1` 已完成 Step 12 `开工与必读文档:先思考`
134. 确认 `R1.2` 已完成 Step 12 `开工与必读文档:再写入`
135. 确认 `R1.3` 已完成 Step 12 `L1-governance 框架对齐:先思考`
136. 确认 `R1.4` 已完成 Step 12 `L1-governance 框架对齐:再写入`
137. 确认 `R1.5` 已完成 Step 12 `承接来源池:先思考`
138. 确认 `R1.6` 已完成 Step 12 `承接来源池:再写入`
139. 确认 `R1.7` 已完成 Step 12 `代码主体与组成部分承接:先思考`
140. 确认 `R1.8` 已完成 Step 12 `代码主体与组成部分承接:再写入`
141. 确认 `R1.9` 已完成 Step 12 `对象与接口承接:先思考`
142. 确认 `R1.10` 已完成 Step 12 `对象与接口承接:再写入`
143. 确认 `R1.11` 已完成 Step 12 `处理流、状态机与异常承接:先思考`
144. 确认 `R1.12` 已完成 Step 12 `处理流、状态机与异常承接:再写入`
145. 确认 `R1.13` 已完成 Step 12 `配置实现契约承接:先思考`
146. 确认 `R1.14` 已完成 Step 12 `配置实现契约承接:再写入`
147. 确认 `R1.19` 已完成 Step 12 `正式 §12 回填草稿:先思考`
148. 确认 `R1.20` 已完成 Step 12 `正式 §12 回填草稿:再写入`
149. 确认 `R1.21` 已完成 Step 12 `自检与停审:先思考`
150. 确认 `R1.22` 已完成 Step 12 `自检与停审:再写入`
151. 确认 `R1.23` 已完成 Step 12 `正式 §12 回填记录:再写入`
152. Step 12 已完成正式 `§12` 回填;下一步只能等待用户确认后进入 Step 13 `开工与必读文档:先思考`
153. 确认 `R1.1` 已完成 Step 13 `开工与必读文档:先思考`
154. 确认 `R1.2` 已完成 Step 13 `开工与必读文档:再写入`
155. 确认 `R1.3` 已完成 Step 13 `L1-governance 框架对齐:先思考`
156. 确认 `R1.4` 已完成 Step 13 `L1-governance 框架对齐:再写入`
157. 确认 `R1.5` 已完成 Step 13 `风险 / 待确认来源池:先思考`
158. 确认 `R1.6` 已完成 Step 13 `风险 / 待确认来源池:再写入`
159. 确认 `R1.7` 已完成 Step 13 `已收稳结论排除与非风险过滤:先思考`
160. 确认 `R1.8` 已完成 Step 13 `已收稳结论排除与非风险过滤:再写入`
161. 确认 `R1.9` 已完成 Step 13 `设计风险筛选:先思考`
162. 确认 `R1.10` 已完成 Step 13 `设计风险筛选:再写入`
163. 确认 `R1.11` 已完成 Step 13 `待确认事项筛选:先思考`
164. 确认 `R1.12` 已完成 Step 13 `待确认事项筛选:再写入`
165. 确认 `R1.13` 已完成 Step 13 `未闭环项说明:先思考`
166. 确认 `R1.14` 已完成 Step 13 `未闭环项说明:再写入`
167. 确认 `R1.15` 已完成 Step 13 `旧材料差异审计:先思考`
168. 确认 `R1.16` 已完成 Step 13 `旧材料差异审计:再写入`
169. 确认 `R1.17` 已完成 Step 13 `正式 §13 回填草稿:先思考`
170. 确认 `R1.18` 已完成 Step 13 `正式 §13 回填草稿:再写入`
171. 确认 `R1.19` 已完成 Step 13 `自检与停审:先思考`
172. 确认 `R1.20` 已完成 Step 13 `自检与停审:再写入`
173. 确认 `R1.21` 已完成 Step 13 `正式 §13 回填记录:再写入`
174. 确认 `R1.1` 已完成 Step 14 `开工与必读文档:先思考`
175. 确认 `R1.2` 已完成 Step 14 `开工与必读文档:再写入`
176. 确认 `R1.3` 已完成 Step 14 `L1-governance 框架对齐:先思考`
177. 确认 `R1.4` 已完成 Step 14 `L1-governance 框架对齐:再写入`
178. 确认 `R1.5` 已完成 Step 14 `正式章节来源矩阵:先思考`
179. 确认 `R1.6` 已完成 Step 14 `正式章节来源矩阵:再写入`
180. 确认 `R1.7` 已完成 Step 14 `全文一致性扫描:先思考`
181. 确认 `R1.8` 已完成 Step 14 `全文一致性扫描:再写入`
182. 确认 `R1.9` 已完成 Step 14 `正式全文装配草稿:先思考`
183. 确认 `R1.10` 已完成 Step 14 `正式全文装配草稿:再写入`,正式元信息 / §1~§4 已重装配
184. 确认 `R1.11` 已完成 Step 14 `正式 §14 参考与交叉引用:先思考`
185. 确认 `R1.12` 已完成 Step 14 `正式 §14 参考与交叉引用:再写入`,正式 §1~§14 已补齐校准来源 / 延伸阅读入口且 §14 参考表已重写
186. 确认 `R1.13` 已完成 Step 14 `旧材料差异审计:先思考`
187. 确认 `R1.14` 已完成 Step 14 `旧材料差异审计:再写入`,未发现需本模块立刻修正的正向旧主线残留
188. 确认 `R1.15` 已完成 Step 14 `自检与停审:先思考`,已固定最终自检清单、停审条件和失败条件
189. 确认 `R1.16` 已完成 Step 14 `自检与停审:再写入`,结论为自检未通过,原因是正式 §2、§3、§4 缺 `延伸阅读` 块
190. 确认 `R1.16a` 已完成 Step 14 `章节来源缺口修正:先思考`,已制定 §2、§3、§4 延伸阅读最小补丁策略
191. 确认 `R1.16b` 已完成 Step 14 `章节来源缺口修正:再写入`,正式 §2、§3、§4 已补 `延伸阅读`
192. 确认 `R1.16c` 已完成 Step 14 `停审复检:先思考`,§1~§14 来源追溯复检通过
193. 确认 `R1.16d` 已完成 Step 14 `最终停审记录:再写入`,Step 14 内容层关闭,`ML-S14-GAP-001` resolved
194. 确认 `R1.17` 已完成 Step 14 `正式全文回填记录:再写入`,正式 `02-概要设计.md` full-restart completed
195. 当前只能等待用户确认后启动 `03-详细设计` 讨论;启动时必须按详细设计 SOP 新建 / 重启 03 flow,不得直接继承历史 `03_ddd_*`
196. 根据三层 gate_status 判断是否允许进入下一动作,不得根据对话记忆跳过当前模块
```
