# 06-验收标准校准工作台

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md`
> 正式文档: `projects/L1-governance/06-验收标准.md`

## 1. 当前状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `06-验收标准.md` |
| 当前阶段 | Step 15 整理正式验收标准文档 |
| 当前状态 | Step 15 已完成;正式 `06` 已按章节分批装配 |
| 生成方式 | 先生成 Step 中间产物,Step 15 先搭框架再按章节分批装配正式 `06` |
| 旧文档处理 | 旧 `06` 只作为历史诊断输入,不得直接继承旧 GovernanceRequest / Gate / Decision / RiskAcceptance 主线 |

## 2. 执行原则

- 严格按 `验收标准讨论流程_SOP.md` Step 1~15 独立推进。
- 每个 Step 单独生成 `design-calibration/06_acceptance_step_*.md` 中间产物。
- 每个 Step 仍单独生成中间产物并保留停审记录;本轮 Step 8~15 按用户要求不停审连续推进。
- 正式 `06-验收标准.md` 不在早期 Step 中零散改写;Step 15 先搭 15 章框架,再按章节分批填充。
- 所有验收项后续必须闭环到需求 / 设计契约、测试用例、`EV-GOV-*` 证据族和 report path。
- 不填写真实执行结果、真实 `run_id`、缺陷状态或最终验收结论。

## 3. Step 进度

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | 已完成 |
| Step 2 | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | 已完成 |
| Step 3 | 固定验收基线 | `06_acceptance_step_03_baseline.md` | 已完成 |
| Step 4 | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | 已完成 |
| Step 5 | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | 已完成 |
| Step 6 | 定义数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` | 已完成 |
| Step 7 | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interfaces_events_sync.md` | 已完成 |
| Step 8 | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | 已完成 |
| Step 9 | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | 已完成 |
| Step 10 | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | 已完成 |
| Step 11 | 定义一票否决项 | `06_acceptance_step_11_veto.md` | 已完成 |
| Step 12 | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_retest_release.md` | 已完成 |
| Step 13 | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | 已完成 |
| Step 14 | 定义最终结论与签署口径 | `06_acceptance_step_14_final_decision_signoff.md` | 已完成 |
| Step 15 | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | 已完成 |

## 4. 旧正式文档诊断

| 旧文档问题 | 处理 |
|---|---|
| 旧 `06` 围绕 GovernanceRequest / Gate / Decision / RiskAcceptance 旧主线组织 | 不直接继承;新版验收标准必须承接 `00`~`05` 的 Governance truth center 口径 |
| 旧 `06` 直接出现 API / DB / audit entry / staging 环境式证据 | 后续必须改为 `EV-GOV-*`、`reports/runs/<run_id>` 和 `reports/acceptance/*` 证据闭环 |
| 旧 `06` 缺少 15 章正式结构和每章校准来源 | Step 15 统一重建正式结构 |
| 旧 `06` 缺少 P0/P1/P2、VETO、redaction、dependency、no-static-evidence、report audit 口径 | 后续 Step 2~14 分别闭合 |
| 旧 `06` 含有待评审结论占位 | 当前不填写最终结论;Step 14 只定义签署口径 |

## 5. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 1 中间产物 | 已生成 | 输入边界、验收必须回答 / 不回答的问题和上游缺口已整理 |
| Step 2 中间产物 | 已生成 | 验收目标、P0/P1/P2 范围、只验接缝能力和 VETO 候选已整理 |
| Step 3 中间产物 | 已生成 | 验收基线、证据入口、P0 环境配置、基线变更和不可接受基线引用已整理 |
| Step 4 中间产物 | 已生成 | 验收进入条件、退出条件、暂停 / 不可裁决条件和来源追溯已整理 |
| Step 5 中间产物 | 已生成 | AC-GOV-001~015 功能验收门禁、闭环矩阵、P1/P2 后置边界、停审记录和跨功能审计已整理 |
| Step 6 中间产物 | 已生成 | AC-GOV-016~025 数据边界与架构红线、不得保存数据清单、P1/P2 防污染规则、停审记录和跨红线审计已整理 |
| Step 7 中间产物 | 已生成 | 23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job、跨仓依赖类型、下游未就绪裁决和同步门禁审计已整理 |
| Step 8 中间产物 | 已生成 | 状态迁移、终态保护、UoW 原子性、query no-write、consumer/job no truth repair、duplicate replay、expected_version 和 commit unknown 门禁已整理 |
| Step 9 中间产物 | 已生成 | 性能 sample、降级、安全脱敏、配置 fail-fast、依赖边界、恢复重放、观测审计和证据完整性门禁已整理 |
| Step 10 中间产物 | 已生成 | P0 EV 追溯、artifact/report 配对、redaction/dependency/report audit、acceptance handoff、VETO checklist 和 no static evidence 门禁已整理 |
| Step 11 中间产物 | 已生成 | VETO-GOV-001~013、一票否决闭环矩阵、不可风险接受口径和跨 VETO 覆盖审计已整理 |
| Step 12 中间产物 | 已生成 | S/A/B/R 缺陷分级、S 级阻断判定、修复后复验、放行规则和关闭证据要求已整理 |
| Step 13 中间产物 | 已生成 | residual 风险、不可风险接受项、风险接受必填字段、接受人/后续动作/截止条件已整理 |
| Step 14 中间产物 | 已生成 | 最终结论三值规则、结论判定矩阵、签署角色、签署含义和禁止模糊结论口径已整理 |
| Step 15 中间产物 | 已生成 | 正式章节来源映射、跨门禁裁决总审计和正式文档装配策略已整理 |
| 正式 `06` 正文 | 已装配 | 先搭框架,再按 §1~§4、§5~§8、§9~§11、§12~§15 分批填充 |
| 下一步 | 用户审查 | 可审查 Step 8~15 中间产物和正式 `06` |
