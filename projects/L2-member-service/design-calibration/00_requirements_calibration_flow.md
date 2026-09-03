# L2-member-service 00-需求文档 校准流程

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`(Step 1~17)
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/需求文档书写规范.md`
> 模式: full-restart；旧材料后置差异审计；draft/ 为非正式讨论输入。2026-08-21 用户同意审计结论与修复方向，不等于逐条签署 draft 结论。
> 停审纪律: 正式 `00-需求文档.md` 装配完成后停审,未经用户确认不进入 01。

## 状态总览

- [x] Step 01. 与上游文档的关系声明
- [x] Step 02. 本仓定位与边界
- [x] Step 03. 背景与问题定义
- [x] Step 04. 目标与非目标
- [x] Step 05. 用户与角色
- [x] Step 06. 使用方与依赖
- [x] Step 07. 核心能力闭环
- [x] Step 08. 用户故事
- [x] Step 09. 功能需求
- [x] Step 10. 业务规则与边界约束
- [x] Step 11. 数据需求与数据归属
- [x] Step 12. 接口与依赖
- [x] Step 13. 非功能需求
- [x] Step 14. 验收标准
- [x] Step 15. 风险与待确认事项
- [x] Step 16. 需求追溯矩阵
- [x] Step 17. 正式整理为 00-需求文档

## 总流程计划

| Step | 输入 | 输出文件 | 前序依赖 | 状态 | 完成门禁 | 下一步许可 |
|---|---|---|---|---|---|---|
| 01 上游关系声明 | 全局依赖规则;仓库拆分方案 §5.5;上游正式文档清单;draft/README | `00_req_step_01_upstream_relation.md` | 启动纪律确认 | done | 来源映射逐行成立;不滑入边界 | Step 02 |
| 02 本仓定位与边界 | Step 01;draft/01;L4-sandbox / L2-runtime 边界结论 | `00_req_step_02_position_boundary.md` | Step 01 pass | done | 一句话定义 / 非职责 / 边界对象 / 成仓原因收敛 | Step 03 |
| 03 背景与问题定义 | Step 02;draft/01 §1;旧材料审计 | `00_req_step_03_problem_context.md` | Step 02 pass | done | 问题不含方案;业务 / 技术问题分类 | Step 04 |
| 04 目标与非目标 | Step 02/03;draft/01 §4 | `00_req_step_04_goals_non_goals.md` | Step 03 pass | done | 5 目标可承接；12 非目标带 owner / 原因；项目型-only 范围已后续回填 | Step 05 |
| 05 用户与角色 | Step 02/04 | `00_req_step_05_users_roles.md` | Step 04 pass | done | 人类 / 系统角色分开;不混依赖 | Step 06 |
| 06 使用方与依赖 | Step 02/05;draft/02;全局依赖规则 §5/§6 | `00_req_step_06_consumers_dependencies.md` | Step 05 pass | done | 内外部依赖 / 裁剪 / 类型 / 禁止 / 图 / path 判定齐；SDK authority、镜像链路与 Sandbox caller 分层 | Step 07 |
| 07 核心能力闭环 | Step 02/04/06;draft/03;ADR-0004/0005;tools/runtime/sandbox 边界 | `00_req_step_07_core_capability_loop.md` | Step 06 pass | done | 五节点闭环已重建；用户明确选择当前版项目型-only，MSVC-UP-009 已按当前范围闭合 | Step 08 |
| 08 用户故事 | Step 05/07 | `00_req_step_08_user_stories.md` | Step 07 pass | done | 15 条核心故事 + 4 条外围增强；五节点逐一停审；无孤儿、重复或串线 | Step 09 |
| 09 功能需求 | Step 07/08 | `00_req_step_09_functional_requirements.md` | Step 08 pass | done | 12 项核心 + 4 项外围功能；逐项输入 / 输出 / 触发 / 失败及双重映射齐备；无孤儿 | Step 10 |
| 10 业务规则与边界约束 | Step 02/07/09 | `00_req_step_10_business_rules_boundaries.md` | Step 09 pass | done | 50 条规则按 C-MS-1~5 串行停审；功能 / 边界映射、pending、历史污染和跨节点审计通过 | 等待用户确认后进入 Step 11 |
| 11 数据需求与数据归属 | Step 02/09/10 | `00_req_step_11_data_ownership.md` | Step 10 pass | done | 41 项数据按五节点停审；真相 / 快照 / 引用 / 禁止正文、映射、复用、pending 与历史污染审计通过 | 等待用户确认后进入 Step 12 |
| 12 接口与依赖 | Step 06/09/11 | `00_req_step_12_interfaces_dependencies.md` | Step 11 pass | done | 17 个核心 + 4 个外围能力接口、正式依赖表、功能映射、pending 与历史污染审计通过 | Step 13 |
| 13 非功能需求 | Step 07/10/11/12 | `00_req_step_13_non_functional_requirements.md` | Step 12 pass | done | 20 项 NFR 覆盖六类；判断口径、量化门禁、Step 14 承接与历史指标审计通过 | Step 14 |
| 14 验收标准 | Step 07/09/10/11/13 | `00_req_step_14_acceptance_criteria.md` | Step 13 pass | done | 39 项五类验收 + 9 项一票否决；全量映射、pending 和非结果事实审计通过 | Step 15 |
| 15 风险与待确认事项 | Step 01~14 未闭口项;MSVC-UP-001~009 | `00_req_step_15_risks_open_questions.md` | Step 14 pass | done | 13 风险 + 11 待确认；blocker 分层、兄弟状态刷新与 historical 审计通过 | Step 16 |
| 16 需求追溯矩阵 | Step 07~15 | `00_req_step_16_traceability_matrix.md` | Step 15 pass | done | 16 行主矩阵 + 接口 / NFR / blocker 补充矩阵；孤儿、重复、串线、类型冲突和污染审计通过 | Step 17 |
| 17 正式装配 | Step 01~16 全部产物 | `00-需求文档.md`(删除旧文件重建) | Step 16 pass | done | 16 章 / 16 来源块、编号、表格、边界、pending、污染与非伪造审计通过 | 停审等待用户 |

## Step 状态台账

| Step | 必读文档 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | SOP Step 1;书写规范 4.1;仓库拆分方案 §5.5 | `00_req_step_01_upstream_relation.md` | not_applicable | not_applicable | done | done | done | pass | 来源映射与主题收束成立,自检通过 | 进入 Step 02 | none |
| 02 | SOP Step 2;书写规范 4.2;Step 01 产物;draft/01 | `00_req_step_02_position_boundary.md` | not_applicable | not_applicable | done | done | done | pass | 定位 / 非职责 / 边界对象 / 成仓原因收敛,与 runtime、sandbox 停审结论对齐 | 进入 Step 03 | none |
| 03 | SOP Step 3;书写规范 4.3;Step 02 产物;draft/01 §1 | `00_req_step_03_problem_context.md` | not_applicable | not_applicable | done | done | done | pass | 三问题指向结构缺口;量化有来源;无源数字剔除 | 进入 Step 04 | none |
| 04 | SOP Step 4;书写规范 4.4;Step 02/03 产物;draft/01 §4;Step 07 用户范围确认 | `00_req_step_04_goals_non_goals.md` | not_applicable | not_applicable | done | done | done | pass | 5 目标可承接；12 非目标带 owner / 原因；NG-MS-012 已同步项目型-only 范围；fail-closed 总则成立 | 进入 Step 05 | none |
| 05 | SOP Step 5;书写规范 4.5;Step 02/04 产物 | `00_req_step_05_users_roles.md` | not_applicable | not_applicable | done | done | done | pass | 人类 / 系统角色分层;授权归 owner 尾注成立 | 进入 Step 06 | none |
| 06 | SOP Step 6;书写规范 4.6;全局依赖规则 §5/§6;Step 02/05 产物;draft/02 | `00_req_step_06_consumers_dependencies.md` | not_applicable | not_applicable | done | done | done | pass | authority 已收敛；SDK compile 基线、间接 role/image 路径与宿主级 Sandbox binding 分层成立；字段 / target pending 不伪造 ready | 进入 Step 07 | MSVC-UP-003/004/005/008 为后续合同条件 |
| 07 | SOP Step 7;书写规范 4.7;Step 02/04/06 产物;draft/03;ADR-0004/0005;tools/runtime/sandbox | `00_req_step_07_core_capability_loop.md` | not_applicable | not_applicable | done | done | done | pass | 五节点能力链与项目型双锚已收敛；用户明确选择项目型-only，非项目宿主保持未来扩展 / fail closed | 进入 Step 08 | none |
| 08 | SOP Step 8;书写规范 4.8;Step 05/07 产物 | `00_req_step_08_user_stories.md` | C-MS-1~5 + 外围 / 边界审计 | completed | done | done | done | pass | 五节点各 3 条核心故事并逐节点停审；4 条外围增强；无孤儿 / 重复 / 串线 / 非项目范围污染 | 停审；下一次继续时读取 Step 09 必读材料 | none |
| 09 | SOP Step 9;书写规范 4.9;Step 07/08 产物 | `00_req_step_09_functional_requirements.md` | C-MS-1~5 + 外围 / pending / historical 审计 | completed | done | done | done | pass | 12 项核心 + 4 项外围；能力级 I/O / 触发 / 失败、优先级、依赖和双重映射齐；孤儿故事 / 功能均为 0 | 停审；下一次继续时读取 Step 10 必读材料 | none |
| 10 | SOP Step 10;书写规范 4.10;Step 02/07/09 产物;当前已停审 `L2-member` 正式 00;兄弟 / 上游边界 | `00_req_step_10_business_rules_boundaries.md` | C-MS-1~5 + cross-cutting / peripheral / pending / historical audit | completed | done | done | done | pass | 50 条需求级规则、五节点停审、全量映射和跨节点审计通过；L2-member 需求级 owner 分工已正式消费，字段 / 协议及 member-images 合同继续 pending | 停审；下一次继续时读取 Step 11 必读材料 | none |
| 11 | SOP Step 11;书写规范 4.11;Step 02/09/10 产物;当前上游 / 兄弟数据边界 | `00_req_step_11_data_ownership.md` | C-MS-1~5 + peripheral / forbidden-body / reuse / pending / historical audit | completed | done | done | done | pass | 41 项数据四类归属、五节点停审、功能 / 规则映射、跨节点复用和污染审计通过；无重复 truth owner | 停审；下一次继续时读取 Step 12 必读材料 | none |
| 12 | SOP Step 12;书写规范 4.12;Step 06/09/11 产物;全局依赖规则;Runtime / Governance 粒度参考 | `00_req_step_12_interfaces_dependencies.md` | C-MS-1~5 + peripheral / dependency / pending / historical audit | completed | done | done | done | pass | 17 个核心 + 4 个外围接口均有功能来源；依赖类型与 Step 6 一致；无协议 / schema / 实现泄漏 | 用户已授权完成整份 00；进入 Step 13 必读复核 | none |
| 13 | SOP Step 13;书写规范 4.13;Step 07/10/11/12 产物;Runtime / Governance 粒度参考 | `00_req_step_13_non_functional_requirements.md` | six NFR classes + capability / global / metric authority / pending / historical audit | completed | done | done | done | pass | 20 项 NFR 均有判断口径和来源；六类齐；无来源数字、实现方案与 readiness 伪造为 0 | 用户已授权完成整份 00；进入 Step 14 必读复核 | none |
| 14 | SOP Step 14;书写规范 4.14;Step 07/09/10/11/13 产物;全部 pending seam | `00_req_step_14_acceptance_criteria.md` | five acceptance classes + C-MS-1~5 / veto / pending / historical audit | completed | done | done | done | pass | 39 项 AC + 9 项 veto 覆盖能力、功能、规则、数据、NFR；无测试步骤、结果事实或伪 readiness | 用户已授权完成整份 00；进入 Step 15 必读复核 | none |
| 15 | SOP Step 15;书写规范 4.15;Step 01~14 未闭口项;MSVC-UP-001~009;兄弟最新台账 | `00_req_step_15_risks_open_questions.md` | risks + open questions / blocker classification / sibling refresh / historical audit | completed | done | done | done | pass | 13 风险 + 11 Q 分表；需求成文 / 正向闭口 / readiness / reopen 四层门禁明确，无方案脑补 | 用户已授权完成整份 00；进入 Step 16 必读复核 | none |
| 16 | SOP Step 16;书写规范 4.16;Step 07~15 全部编号产物 | `00_req_step_16_traceability_matrix.md` | C-MS-1~5 trace slices + peripheral / IB / dependency / NFR / VF / risk / orphan / crossing audit | completed | done | done | done | pass | 16 功能主轴完整；全部编号集合反向覆盖，无孤儿、重复 owner、串线、依赖冲突、新需求或伪 readiness | 用户已授权完成整份 00；进入 Step 17 必读复核和正式装配 | none |
| 17 | SOP Step 17;书写规范正式结构;Step 01~16 全部 pass 产物;正式旧 00 historical audit | 正式 `00-需求文档.md` + `00_req_step_17_formal_document_assembly.md` | source blocks + chapters 1~16 / terminology / static audit / stop review | formal_00_complete_stop_review | done | done | done | pass | 终审刷新两项兄弟正式 00；16 章 / 16 来源块、全部预期编号、Markdown 表、六列追溯、pending / resolved、历史污染、非伪造与 `git diff --check` 审计通过 | 等待用户评审；不得进入 01 | none |

## 终态

```text
document_status = formal_00_complete_stop_review
gate_status = pass
next_allowed_action = wait_for_user_review
next_formal_document_allowed = false
```
