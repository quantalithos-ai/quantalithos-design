# L2-member 00 需求 Step 17: 正式文档装配

> 创建日期: 2026-08-20
> 最近校准: 2026-08-22
> 状态: formal_00_complete_stop_review
> 当前模式: full-restart
> 回填位置: 正式 `00-需求文档.md` 全文

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 17 正式文档装配 |
| 输出文件 | `00_req_step_17_formal_document_assembly.md`;正式 `../00-需求文档.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(SOP Step 17:只重组润色,不新增结论;通则 §1.6 三层门禁) |
| 已读取前序输入 | yes(Step 1~16 全部 gate_status=pass) |
| 当前模式 | full-restart(删除旧 00,按 16 章重建) |
| 三层门禁 | 项目级 pass(台账允许装配 00);文档级 pass(Step 1~16 全 pass);Step 级 pass(各 Step 回填草稿与自检完成) |

## 1. 装配计划

| 批次 | 内容 | 来源 Step | 状态 |
|---|---|---|---|
| A | 删除旧 00;写头部 + 第 1~6 章 | Step 1~6 | done |
| B | 第 7~10 章 | Step 7~10 | done |
| C | 第 11~14 章 | Step 11~14 | done |
| D | 第 15~16 章 + 终检 | Step 15~16 | done |

## 2. 章节来源映射

| 正式章节 | 校准来源 |
|---|---|
| 1 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` |
| 2 本仓定位与边界 | `00_req_step_02_position_boundary.md` |
| 3 背景与问题定义 | `00_req_step_03_problem_context.md` |
| 4 目标与非目标 | `00_req_step_04_goals_non_goals.md` |
| 5 用户与角色 | `00_req_step_05_users_roles.md` |
| 6 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` |
| 7 核心能力闭环 | `00_req_step_07_core_capability_loop.md` |
| 8 用户故事 | `00_req_step_08_user_stories.md` |
| 9 功能需求 | `00_req_step_09_functional_requirements.md` |
| 10 业务规则与边界约束 | `00_req_step_10_business_rules_boundaries.md` |
| 11 数据需求与数据归属 | `00_req_step_11_data_ownership.md` |
| 12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` |
| 13 非功能需求 | `00_req_step_13_non_functional_requirements.md` |
| 14 验收标准 | `00_req_step_14_acceptance_criteria.md` |
| 15 风险与待确认事项 | `00_req_step_15_risks_open_questions.md`;`project_execution_ledger.md` |
| 16 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` |

## 3. 装配纪律

- 只重组与润色 Step 1~16 已确认结论;不新增对象、功能、规则、验收或依赖。
- 每章正文前放校准来源块(具体文件 + 延伸阅读)。
- 术语统一:在场(presence)、筛选结论、投递决定、出站决定、发布尝试 / 缺口、safe snapshot、typed ref、body-free。
- 编号统一:G-L2M / NG-L2M / C-L2M / US-L2M / FR-L2M / BR-L2M / NFR-L2M / AC-L2M / VF-L2M / R-L2M / Q-L2M / L2M-UP。
- 未闭口事项只进入第 15 章,不写成正式结论。

## 4. 装配前停审检查

| 检查项 | 结果 |
|---|---|
| Step 1~16 gate_status 全 pass | pass |
| 能力级停审(C1~C5 × Step 8~14)全部完成 | pass |
| 跨能力审计无遗留 | pass |
| 旧 00 已登记 historical 且污染审计完成 | pass |
| 装配不引入新结论 | pass(见批次后终检) |

## 5. 修复记录

| 事项 | 修复入口事实 | 本轮处置 |
|---|---|---|
| `L2M-DOC-001` | 旧 Step 17 曾将 A~D 和终检误报为 done / pass,但修复入口的正式 00 实际只有第 1~10 章,控制状态与正文不一致 | 不继承旧完成声明;以修复后的 Step 1~16 为唯一装配输入,重建正式 00 第 1~16 章并重新执行静态终检 |
| sibling 时间点 | 旧装配输入仍写 member-service Step 7、member-images pre-Step 1 | 只读复核当前台账和已通过门禁材料;更新为 member-service Step 9 pass / Step 10 pending、member-images Step 1~8 pass / Step 9 in progress,两仓正式 00 仍未停审 |
| 事实上限 | 本轮只有设计文档静态审计,没有实现或测试执行 | 只记录结构、追溯、引用、边界和污染审计结果;不生成 implementation / run / artifact / report / evidence / verdict / signoff / readiness 事实 |

## 6. 装配后终检

| 检查项 | 结果 |
|---|---|
| 16 章齐全且每章有校准来源块 | pass |
| 16 个校准来源块引用的 17 个唯一校准文件均存在 | pass |
| 编号体系无冲突、无未定义引用 | pass |
| G / NG / C / US / FR / BR / IB / DB / NFR / AC / VF / R / Q / UP 与对应 Step 的 ID 集合一致 | pass |
| Markdown 表格列结构一致 | pass |
| 正文无过程性内容(诊断 / 取舍 / blocker 建议) | pass |
| 未声明实现、测试结果、evidence、readiness | pass |
| 历史协议 / 指标只出现在明确的 historical / 否定语境,未作为当前协议回流 | pass |
| sibling 新增已通过材料未改变 owner 分界,进行中内容未被引用为结论 | pass |

## 7. 完成状态

```text
gate_status = pass
document_status = formal_00_complete_stop_review
next_allowed_action = wait_for_user_review
formal_00_write_allowed = closed_after_assembly
next_formal_document = 01-架构设计.md
next_formal_document_allowed = false
commit_required = false
```
