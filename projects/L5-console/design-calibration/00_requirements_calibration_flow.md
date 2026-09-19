# L5-console `00-需求文档` 校准流程

> 创建日期：2026-09-15  
> 当前模式：`full-restart + single-agent-serial`  
> 目标文档：`projects/L5-console/00-需求文档.md`  
> 项目台账：`projects/L5-console/design-calibration/project_execution_ledger.md`  
> 当前授权：用户已明确授权完成 `00-需求文档.md` 后继续完成 `01-架构设计.md`；文档之间仍逐份停审、串行切换。

## 1. 状态总览

| 项 | 当前状态 |
|---|---|
| 当前文档 | `00-需求文档.md` |
| 当前 Step | Step 17 · 正式文档装配（已完成） |
| 当前模块 | `formal-document-assembly`（closed） |
| 当前模式 | `full-restart` |
| 正式文档写入 | `closed / formal_stop_review` |
| 单 agent 串行 | `active` |
| 历史材料处理 | 仅作 `historical_material` 与污染审计输入 |
| 下一停审点 | `00` 已完成停审；依现有授权可串行启动 `01`，完成后再次停审 |

## 2. 启动前必读输入

| 类别 | 文件 / 范围 | 用途 |
|---|---|---|
| 通用规范 | `standards/document/设计文档编写通则.md` | 统一正式设计文档纪律 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 三层台账、Step 内小阶段、回填门禁和重启纪律 |
| 真相源标准 | `standards/document/设计真相源闭环与可落码性标准.md` | truth owner、pending、可落码性与证据诚实 |
| 全局依赖 | `standards/document/全局项目依赖关系与裁剪规则.md` | L5 并行窗口、依赖类型和本仓裁剪 |
| 需求流程 | `standards/document/需求文档讨论流程_SOP.md` | Step 1~17 问题、输入、输出与进入条件 |
| 需求书写 | `standards/document/需求文档书写规范.md` | 正式 00 章节粒度、固定表格和阶段门禁 |
| 产品来源 | `product/产品矩阵.md`、`product/最终目的.md` | Console 的管理者产品叙事与产品边界 |
| 架构来源 | `architecture/仓库拆分方案.md` | L5-console 的仓级定位和全局分层 |
| 专项上游 | `projects/L0-sdk/`、`L1-identity/`、`L1-work/`、`L1-process/`、`L1-governance/`、`L1-artifact/`、`L1-workspace/`、`L2-member-service/`、`L3-method-library/`、`L3-capability-hub/`、`L4-observability/`、`L4-sandbox/`、`L4-archive/` 的当前正式文档和必要台账 | 只承接已停审正式边界；未闭口合同记录为 pending |
| 启动前参考 | `draft/01~03`、`console_workspace_draft_reference_audit.md` | 只作为 pre-calibration 线索和粒度参考 |
| 历史材料 | 旧 README、旧 `00/01/02/03/05/06` | 只做污染审计，不直接继承 |

## 3. 总流程计划

未来 Step 文件只在到达该 Step 时创建或改写；本表可以预先列出计划，但不表示未来 Step 已开始。

| Step | 主题 | 必读输入（摘要） | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | 产品、架构、专项正式上游、全局依赖、历史审计 | `00_req_step_01_upstream_relation.md` | 启动前读取完成、用户授权正式 00 | `done` | 来源、承接主题和收束说明分开；不提前写边界/能力 | Step 2 |
| 2 | 本仓定位与边界 | Step 1、产品/架构定位、相邻 owner 边界 | `00_req_step_02_position_boundary.md` | Step 1 `pass` | `done` | 一句话定义、非职责、边界对象、单独成仓原因明确 | Step 3 |
| 3 | 背景与问题定义 | Step 2、产品驱动力、历史问题审计 | `00_req_step_03_problem_context.md` | Step 2 `pass` | `done` | 背景、现状、业务/技术问题分开；不写方案 | Step 4 |
| 4 | 目标与非目标 | Step 2~3 | `00_req_step_04_goals_non_goals.md` | Step 3 `pass` | `done` | 目标可验证，非目标具体，范围不漂移 | Step 5 |
| 5 | 用户与角色 | Step 2、4、identity/governance 上游 | `00_req_step_05_users_roles.md` | Step 4 `pass` | `done` | 人类/系统角色、场景和权限差异清楚 | Step 6 |
| 6 | 使用方与依赖 | Step 2、5、全局依赖及所有上游台账 | `00_req_step_06_consumers_dependencies.md` | Step 5 `pass` | `done` | 裁剪表、依赖类型表、禁止依赖表和 ASCII 图完整 | Step 7 |
| 7 | 核心能力闭环 | Step 2、4、6、draft 仅作线索 | `00_req_step_07_core_capability_loop.md` | Step 6 `pass` | `done` | 能力节点有逻辑依赖、顺序、进入/退出和停审点 | Step 8 |
| 8 | 用户故事 | Step 5、7 | `00_req_step_08_user_stories.md` | Step 7 `pass` | `done` | 故事按能力节点闭合，核心/外围/边界外分层 | Step 9 |
| 9 | 功能需求 | Step 7、8 | `00_req_step_09_functional_requirements.md` | Step 8 `pass` | `done` | 每项功能回指故事和能力；不按 CRUD/API 拆分 | Step 10 |
| 10 | 业务规则与边界约束 | Step 2、7、9、owner 边界 | `00_req_step_10_business_rules_boundaries.md` | Step 9 `pass` | `done` | 规则保护功能和边界；禁止孤儿规则与实现化 | Step 11 |
| 11 | 数据需求与数据归属 | Step 2、7、9、10 | `00_req_step_11_data_ownership.md` | Step 10 `pass` | `done` | truth/snapshot/ref/forbidden body 分层并有生命周期口径 | Step 12 |
| 12 | 接口与依赖 | Step 6、9、11、SDK/owner 正式边界 | `00_req_step_12_interfaces_dependencies.md` | Step 11 `pass` | `done` | 只写能力级 query/command/reference/export 边界，不写 path/DTO | Step 13 |
| 13 | 非功能需求 | Step 7、10、11、12、25010/a11y 语境 | `00_req_step_13_non_functional_requirements.md` | Step 12 `pass` | `done` | 六类 NFR 逐项判断；无 authority 不伪造阈值 | Step 14 |
| 14 | 验收标准 | Step 7、9~13 | `00_req_step_14_acceptance_criteria.md` | Step 13 `pass` | `done` | 能力、功能、规则、数据、NFR 和一票否决均可追溯 | Step 15 |
| 15 | 风险与待确认事项 | Step 1~14、上游 pending 台账 | `00_req_step_15_risks_open_questions.md` | Step 14 `pass` | `done` | 风险与待确认分表；当前处理口径诚实，不把 pending 写 ready | Step 16 |
| 16 | 需求追溯矩阵 | Step 7~15、能力级停审记录 | `00_req_step_16_traceability_matrix.md` | Step 15 `pass` | `done` | 无孤儿故事/功能/规则/数据/接口/NFR/验收，无跨能力串线 | Step 17 |
| 17 | 正式文档装配 | Step 1~16、旧正式 00 只作历史材料 | `00_req_step_17_formal_document_assembly.md` + `../00-需求文档.md` | Step 16 `pass`、用户已授权 | `done / formal_stop_review` | 重建正式 00；章节来源完整；静态审计通过；立即停审 | `start_01_step_1`（已获用户授权） |

## 4. Step 文件通用结构

每个 Step 文件必须独立包含：

1. Step 开工确认与 Step 内计划；
2. 本步输入、SOP 问题回答；
3. 当前材料 / 旧文档问题诊断；
4. 改动前后对比与设计取舍；
5. 结构化中间产物；
6. 复杂度判断；
7. 回填草稿；
8. 待确认事项；
9. 自检与三层门禁。

从 Step 7 开始，按能力节点逐个完成“故事 → 功能 → 规则 → 数据 → 接口/依赖 → NFR → 验收”的小循环；能力节点未停审前不得展开下一个节点。Step 16 只做跨能力审计，不新增需求。

## 5. 当前 Step 门禁

| 层级 | gate_status | gate_reason | 下一动作 |
|---|---|---|---|
| 项目级 | `pass_to_authorized_01` | Step 17 已完成、正式 00 已停审；用户已授权继续 01 | 先读取架构 SOP/书写规范，再创建 01 calibration flow 并从 Step 1 开始 |
| 文档级 | `formal_stop_review` | 正式 00 通过章节、边界、污染、pending 和追溯审计 | 保持 00 冻结；不得与 01 并行修改 |
| Step/模块级 | `pass` | `formal-document-assembly` 已完成重组和全部静态审计 | 关闭 Step 17，切换架构文档前置读取 |

## 6. 历史材料与 pending 原则

- 旧 README、旧正式文档和旧 calibration 只能被标注为 `historical_material`；不以“已有结论”形式回填。
- `L5-chat`、`L5-runner`、`L5-sync`、`L6-marketplace`、`L6-bridges` 等未停审内容只记为 pending，不复制它们的页面、API、指标或技术栈结论。
- 上游 exact query/command、visibility/degraded/freshness、Method Library 消费、Capability Hub access-review、Observability 报告、Archive/Sandbox activation、tenant/organization scope 未闭合时，需求只写能力级边界和可见上限。
- 不伪造 baseline、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。

## 7. 正式装配与停审门禁

```text
Step 1~16 gate_status = pass
  -> Step 17 只重组已确认结论
  -> 删除/重建旧正式 00（旧内容不直接编辑继承）
  -> 每章标注具体 calibration 来源
  -> 静态审计：边界、真相源、pending、追溯、历史污染
  -> project_execution_ledger 更新为 formal_stop_review
  -> 00 停审；用户已授权时，串行读取架构规范并启动 01 Step 1
```
