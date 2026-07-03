# L1-artifact 00 需求文档全量重启校准流程

> 创建日期: 2026-06-29
> 状态: done
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L1-artifact`
> 正式文档目标: `projects/L1-artifact/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 旧 `00-需求文档.md` 只作历史材料,从 Step 1 重新建立需求结论。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 17 | `整理正式文档:completed` | pass | Step 17 `自检与停审` 已完成,正式 `00-需求文档.md` full-restart 完成。 | 启动 `01-架构设计.md` full-restart 开工准备;先创建 / 读取对应架构校准 flow。 | `project_execution_ledger.md`;`00_req_step_17_formal_document_assembly.md`;`projects/L1-artifact/00-需求文档.md`;`standards/document/需求文档讨论流程_SOP.md`;`standards/document/需求文档书写规范.md` |

---

## 2. 执行纪律

本流程只负责 `L1-artifact` 的 `00-需求文档`。执行时必须按需求 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每个 Step 先列必读文档。
- 每个 Step 先搭整体模块,再逐模块先思考、后写入。
- 模块思考和模块写入记录在当前 Step 文件内,不拆分成额外文件。
- 旧 `L1-artifact` 正式文档只能在对应 Step 形成独立结论后做差异审计。
- 正式 `00-需求文档.md` 每章必须能追溯到具体 `00_req_step_*` 中间产物。
- 需求阶段不得写数据库表、Rust struct、repository、port、handler、事务流程或代码目录。
- 单次写入以 100~300 行为宜;该限制只约束单次写入批次,不限制 Step 文件、章节或正式文档最终长度。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | 需求 Step 顺序、Step 内小阶段、核心能力小循环。 | read |
| `standards/document/需求文档书写规范.md` | 正式需求文档章节结构和校准来源格式。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、状态表、停审和长文档分批纪律。 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止需求结论诱发后续不可落码缺口。 | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | Step 6 / Step 12 的依赖裁剪规则。 | read |
| `projects/README.md` | 项目清单、仓类型和当前设计队列背景。 | read |
| `architecture/仓库拆分方案.md` | L1 artifact 的层级和仓职责上游线索。 | read |
| `architecture/标准对齐全景图.md` | artifact 与 ISO 15288 / 9001 / 25010 / 24748-2 / 25012 / 42001 的上游线索。 | read |
| `product/六域模型.md` | artifact 在六域模型中的产品叙事来源。 | read |
| `architecture/bus-draft/event-catalog.md` | artifact 事件与下游协作线索,只作需求依赖输入。 | read |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | done | pass | 已完成;等待用户确认进入 Step 2。 | 权威输入、辅助输入、旧材料审计输入三层分清,且不提前写边界 / 能力 / 接口。 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | done | pass | 已完成;等待用户确认进入 Step 3。 | 明确本仓是什么、不是什么、拥有和不拥有的真相范围。 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | done | pass | 已完成;等待用户确认进入 Step 4。 | 只描述平台能力缺口和问题背景,不写实现方案。 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | done | pass | 已完成;等待用户确认进入 Step 5。 | 每个目标可验收,每个非目标有归属和理由。 |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | done | pass | 已完成;等待用户确认进入 Step 6。 | 区分人类角色、系统消费者和操作语境,不提前定义权限实现。 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | done | pass | 已完成;等待用户确认进入 Step 7。 | 输出依赖裁剪表、类型分类表、禁止依赖表和 ASCII 图。 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | done | pass | 已完成;等待用户确认进入 Step 8。 | 核心能力节点能驱动 Step 8~14,无孤立能力。 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | done | pass | 已完成;等待用户确认进入 Step 9。 | 每个故事回指核心能力节点,无通用故事堆砌。 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | done | pass | 已完成;等待用户确认进入 Step 10。 | 功能需求只写外部可见行为,不写实现组织。 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界约束 | done | pass | 已完成;等待用户确认进入 Step 11。 | 每条规则有能力来源、边界理由和后续验收承接。 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与数据归属 | done | pass | 已完成;等待用户确认进入 Step 12。 | 明确真相数据、快照数据、引用数据和禁止保存正文。 |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | done | pass | allow_step_13 | 已明确能力接口边界和外部依赖边界,每个接口 / 依赖均能回指能力节点和功能需求,且未滑入协议层、字段层或实现层。 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | done | pass | allow_step_14 | 每条 NFR 是可判断句,并回指能力或全局目标。 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | done | pass | allow_step_15 | 验收项覆盖能力、功能、规则、数据、接口、NFR 和一票否决项。 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认事项 | done | pass | allow_step_16 | 风险有当前处理口径;待确认项不伪装成正式结论。 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | done | pass | allow_step_17 | 无孤儿故事、功能、规则、数据、接口和验收。 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 整理正式文档 | done | pass | allow_01_architecture_full_restart | 正式每章有具体校准来源,正文不新增未确认结论。 |

---

## 5. 旧材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L1-artifact/README.md` | historical_material | 只在当前 Step 独立结论形成后做差异审计。 |
| `projects/L1-artifact/00-需求文档.md` | historical_material | 只在对应 Step 独立结论形成后做差异审计。 |
| `projects/L1-artifact/01/02/03/05/06` | historical_material | 不反推需求;后续对应文档重启时再审。 |
| `projects/L1-artifact/04-配置设计.md` | missing | 记录缺口,不阻塞 00 Step 1。 |
| `projects/L1-artifact/07-实施计划.md` | missing | 记录缺口,不阻塞 00 Step 1。 |

---

## 6. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ART-REQ-BOOT-001 | Step 1 | resolved | L1-artifact 缺 00 需求校准 flow。 | 本文件已创建。 |
| ART-REQ-DOC-GAP-001 | downstream | open | 正式 04 / 07 缺失。 | 后续进入对应文档时补齐;不阻塞当前需求 Step 1。 |

---

## 7. 当前 next_allowed_action

```text
`00-需求文档.md` full-restart 已完成;
Step 17 `整理正式文档:自检与停审` 已完成,gate_status = pass;
正式 `projects/L1-artifact/00-需求文档.md` 已写入 §1~§16 并通过最终停审;
next_allowed_action = 启动 `01-架构设计.md` full-restart 开工准备;
进入 01 前必须先创建 / 读取对应架构校准 flow,旧 `01-架构设计.md` 只能作为 historical_material 审计输入。
```
