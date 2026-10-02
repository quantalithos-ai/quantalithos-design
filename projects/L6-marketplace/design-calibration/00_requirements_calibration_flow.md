# 00 需求校准总流程

## 当前状态

| 当前文档 | 当前 Step | gate_status | 下一动作 |
|---|---|---|---|
| 00-需求文档.md | 17 / 已装配并自检 | stop_review | 等用户明确确认；不进入01 |

来源入口：`project_execution_ledger.md`、需求 SOP、需求书写规范、中间产物规范、设计通则、真相源闭环标准、全局依赖规则、draft/01～05。旧 Marketplace 正式文档与 README 只作后置差异审计。

## 总流程计划

每步输出独立 `00_req_step_<NN>_<topic>.md`；仅当前到达的 Step 可创建。2026-10-01 用户授权连续完成全部 00 审查；前序结论为后序输入，每步仍须完成内部小阶段、自检及停审才可推进。正式章节必须引用具体产物，00 完成后停审，不进入 01。

| Step | 主题 / 输出 topic | 输入 | 门禁 | 状态 |
|---|---|---|---|---|
| 1 | upstream_relation | 规范、产品、正式上游、draft | 来源归属及未闭合输入明确 | done |
| 2 | position_boundary | Step 1 | 拥有/消费/禁止范围清晰 | done |
| 3 | problem_context | Step 1～2 | 问题与方案分离 | done |
| 4 | goals_non_goals | Step 2～3 | 目标可判别、非目标有归属 | done |
| 5 | users_roles | Step 2、4 | 角色不替代身份/授权真相 | done |
| 6 | consumers_dependencies | 前序、全局规则 | 依赖裁剪及缺口明确 | done |
| 7 | core_capability_loop | Step 2、4、6 | 能力进入/退出条件清晰 | done |
| 8 | user_stories | Step 7 | 按能力单元逐个收敛 | done |
| 9 | functional_requirements | Step 7～8 | 无孤儿功能、只写外部行为 | done |
| 10 | rules_boundary_constraints | 能力与功能 | 每规则有来源及失败姿态 | done |
| 11 | data_requirements_ownership | 功能与规则 | 真相/快照/引用/禁止正文区分 | done |
| 12 | interfaces_dependencies | Step 6、9～11 | 正式读取面/owner 缺口可追溯 | done |
| 13 | non_functional_requirements | 能力小循环 | 能力质量与全仓约束分开 | done |
| 14 | acceptance_criteria | 前序能力产物 | 正向条件、负向门禁、证明上限 | done |
| 15 | risks_open_questions | 前序 | owner、影响、未确认姿态明确 | done |
| 16 | traceability_matrix | 已停审能力、Step 1～15 | 跨能力孤儿/重复/边界审计通过 | done |
| 17 | formal_document_assembly | 已确认 Step 1～16 | 三层门禁、逐章来源、无新增结论 | done |

Step 8～14 按 Step 7 的能力节点完成小循环和能力停审，不一次性铺全仓故事/功能/规则大表。Step 17 装配后 formal_00=stop_review；01 仍 blocked_by_user_confirmation。

## 当前单元执行台账

| Step | 必读文档 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 00-17 正式装配 | 项目ledger、Step1～16及五能力停审、00规范/清单 | `00_req_step_17_formal_document_assembly.md`、`../00-需求文档.md` | done | formal assembly / cross-section audit | done | done | pass | stop_review | 16章与来源/编号/表格/边界已核验；仅需求审查完成 | 等用户确认，不进入01 | 正向contract仍MP-UP-001～008及MP-SRC相关项，见Step15；不关闭、不宣称ready |

Step1早期三批调查已由其末尾完整收敛与最终门禁替代；本flow不保留早期blocked作为当前状态。实际读取范围仍见Step1，未读上游实现章节不宣称已读；合同不qualified保持路径级blocked，不能被需求停审抹去。

## 最终文档门禁

| 文档 | 状态 | 下一许可 |
|---|---|---|
| 00 | completed / stop_review | 正式16章审查重写完成，仅等待用户确认 |
| 01～07 | waiting_user_confirmation / not_started_in_full_restart | 不读取对应SOP启动设计，不改旧正式文档 |
| 实施ledger/boundary skeleton | not_created / waiting_07 | 正式07完成时才创建，保持planned/blocked/waiting |

Step级done只代表内部需求校准，不代表用户签核、实现、integration readiness或上游blocker关闭。全程单agent；未改draft/原型或其他项目；无commit。
