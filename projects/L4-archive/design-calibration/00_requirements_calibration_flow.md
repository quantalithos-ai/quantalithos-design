# L4-archive 00 需求文档校准流程

> 模式：`full-restart + single-agent-serial`
> 依据：`standards/document/需求文档讨论流程_SOP.md`、`standards/document/需求文档书写规范.md`、`standards/document/设计文档讨论中间产物规范.md`
> 当前范围：完成 00 的 Step 1~17；完成正式 00 后立即停审，不进入 01。

## 状态总览

| Step | 名称 | 输出文件 | 状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` | done | pass | 来源、承接、历史材料与 blocker 已通过自检 | 进入 Step 2 | AR-UP-001~009 retained |
| 2 | 本仓定位与边界 | `00_req_step_02_position_boundary.md` | done | pass | Archive-owned、消费和禁止拥有边界已收束 | 进入 Step 3 | AR-UP-002/003 retained |
| 3 | 背景与问题定义 | `00_req_step_03_problem_context.md` | done | pass | 业务与技术问题已分离，历史数字未继承 | 进入 Step 4 | AR-UP-001~009 retained |
| 4 | 目标与非目标 | `00_req_step_04_goals_non_goals.md` | done | pass | 目标、非目标与范围护栏已收束 | 进入 Step 5 | AR-UP-001~009 retained |
| 5 | 用户与角色 | `00_req_step_05_users_roles.md` | done | pass | 人类/系统角色与权限边界已收束 | 进入 Step 6 | AR-UP-002/003/009 retained |
| 6 | 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` | done | pass_with_blockers | 依赖类型与禁止边界已收束；外部合同仍开放 | 进入 Step 7 | AR-UP-001~009 retained |
| 7 | 核心能力闭环 | `00_req_step_07_core_capability_loop.md` | done | pass_with_blockers | A1~A9 能力链与失败上限已收束；外部合同仍开放 | 进入 Step 8 | AR-UP-001~009 retained |
| 8 | 用户故事 | `00_req_step_08_user_stories.md` | done | pass_with_blockers | A1~A9 故事与失败上限已收束 | 进入 Step 9 | AR-UP-001~009 retained |
| 9 | 功能需求 | `00_req_step_09_functional_requirements.md` | done | pass_with_blockers | F-AR-001~009 均有故事与能力映射 | 进入 Step 10 | AR-UP-001~009 retained |
| 10 | 业务规则与边界约束 | `00_req_step_10_business_rules_boundaries.md` | done | pass_with_blockers | 规则覆盖 A1~A9 并守住 owner/治理边界 | 进入 Step 11 | AR-UP-001~009 retained |
| 11 | 数据需求与数据归属 | `00_req_step_11_data_ownership.md` | done | pass_with_blockers | 四类数据和 source-authority matrix 已收束 | 进入 Step 12 | AR-UP-001/004/006/007/008 retained |
| 12 | 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` | done | pass_with_blockers | 能力接口与依赖类型已收束，无协议泄漏 | 进入 Step 13 | AR-UP-001~009 retained |
| 13 | 非功能需求 | `00_req_step_13_non_functional_requirements.md` | done | pass_with_blockers | 六类质量约束均有判断口径 | 进入 Step 14 | AR-UP-003/004/005/009 retained |
| 14 | 验收标准 | `00_req_step_14_acceptance_criteria.md` | done | pass_with_blockers | 五类验收和一票否决项已收束 | 进入 Step 15 | AR-UP-001~009 retained |
| 15 | 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` | done | pass_with_blockers | 风险与待确认拆表，未脑补关闭 | 进入 Step 16 | AR-UP-001~009 retained |
| 16 | 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` | done | pass_with_blockers | 主矩阵与跨能力漏项审计通过 | 进入 Step 17 | AR-UP-001~009 retained |
| 17 | 整理正式文档 | `00_req_step_17_formal_document_assembly.md` | done | stop_review | 正式 00 已 full-restart 重建并完成一致性审计 | 等待用户授权 01 | AR-UP-001~009 retained |

## 总流程计划

每个 Step 均按 `问题回答 → 旧材料诊断 → 取舍 → 结构化产物 → 复杂度判断 → 回填草稿 → 自检` 执行。未来 Step 文件只在进入该 Step 时创建或更新。

| Step | 必读输入 | 完成门禁 |
|---|---|---|
| 1 | 标准、全局规则、L1-workspace 00~07、专项 owner 00、L4 历史材料 | 来源层级、承接主题和非重定义边界清楚 |
| 2 | Step1、全局规则、draft/01 | 一句话定义、拥有/不拥有、单独成仓原因明确 |
| 3 | Step2、owner 00、workspace 00~07、旧材料 | 背景、痛点、业务/技术问题分离 |
| 4 | Step2~3 | 目标可验证、非目标具体、无无来源数字 |
| 5 | Step2~4 | 人类/系统角色及场景不与依赖混写 |
| 6 | Step2、Step5、全局依赖、workspace 01/07 | 裁剪表、类型表、禁止表、依赖图完成 |
| 7 | Step2、Step4、Step6、draft/02 | 能力节点有顺序、进入/退出条件和失败上限 |
| 8~14 | Step7 及前序；按能力节点小循环 | 每节点完成故事→功能→规则→数据→接口→NFR→验收停审 |
| 15 | Step1~14 | 风险与待确认拆表，处理口径 fail-closed |
| 16 | Step7~15 | 主矩阵、跨能力审计、漏项检查无孤儿项 |
| 17 | Step1~16 | 只重组收口结论，正式 00 可追溯并停审 |

## 当前停审状态

| 项目 | 记录 |
|---|---|
| Step | Step 17 / 正式文档装配已完成 |
| 输出文件 | `00-需求文档.md`；`design-calibration/00_req_step_17_formal_document_assembly.md` |
| 已读取通用规范 | yes |
| 已读取 SOP / 书写规范 | yes |
| 已读取前序输入 | yes；已读取 Step 1~8、L1-workspace 正式 00~07、专项 owner 文档与 draft/02~03 |
| 当前模式 | full-restart / stop_review |
| 全部 Step | Step 1~16=`pass_with_blockers`；Step 17=`stop_review` |
| 下一允许动作 | 等待用户明确授权进入 01；当前不得创建 01 flow 或改写正式 01 |

## 00 完成门禁

```text
formal_00_status = formal / stop_review
formal_01_write_allowed = false_until_new_user_authorization
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
