# L0-core 00-需求文档校准流程

> 本文件是 `projects/L0-core/00-需求文档.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态和回填章节。
> 本目录中的内容是中间产物,不替代正式 `00-需求文档.md`。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 需求文档书写规范 | `standards/document/需求文档书写规范.md` |
| 需求文档讨论 SOP | `standards/document/需求文档讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 项目文档总约定 | `projects/README.md` |
| 子项目强制规范 | `standards/子项目遵循规范清单.md` §一 L0 共享契约层 |
| 当前 README | `projects/L0-core/README.md` |
| 待校准需求文档 | `projects/L0-core/00-需求文档.md` |
| 当前架构设计 | `projects/L0-core/01-架构设计.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 本仓定位与边界 | `00_req_step_02_position_boundary.md` | §2 本仓定位与边界 |
| Step 3 | [x] | 背景与问题定义 | `00_req_step_03_problem_context.md` | §3 背景与问题定义 |
| Step 4 | [x] | 目标与非目标 | `00_req_step_04_goals_non_goals.md` | §4 目标与非目标 |
| Step 5 | [x] | 用户与角色 | `00_req_step_05_users_roles.md` | §5 用户与角色 |
| Step 6 | [x] | 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` | §6 使用方与依赖 |
| Step 7 | [x] | 核心能力闭环 | `00_req_step_07_core_capability_loop.md` | §7 核心能力闭环 |
| Step 8 | [x] | 用户故事 | `00_req_step_08_user_stories.md` | §8 用户故事 |
| Step 9 | [x] | 功能需求 | `00_req_step_09_functional_requirements.md` | §9 功能需求 |
| Step 10 | [x] | 业务规则与边界约束 | `00_req_step_10_rules_boundary_constraints.md` | §10 业务规则与边界约束 |
| Step 11 | [x] | 数据需求与数据归属 | `00_req_step_11_data_requirements_ownership.md` | §11 数据需求与数据归属 |
| Step 12 | [x] | 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` | §12 接口与依赖 |
| Step 13 | [x] | 非功能需求 | `00_req_step_13_non_functional_requirements.md` | §13 非功能需求 |
| Step 14 | [x] | 验收标准 | `00_req_step_14_acceptance_criteria.md` | §14 验收标准 |
| Step 15 | [x] | 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` | §15 风险与待确认事项 |
| Step 16 | [x] | 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` | §16 需求追溯矩阵 |
| Step 17 | [x] | 整理正式需求文档 | `00_req_step_17_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是扩写旧版 `00-需求文档.md`,而是把 L0-core 的需求收敛成最新需求规范下的仓级需求入口。

目标输出:

```text
1. 明确 L0-core 是跨仓契约单一真相源,不是业务域服务、bus 实现或 SDK 客户端。
2. 明确它对所有下游仓提供哪些稳定契约:ID、Error、CloudEvents schema、Trace、ActorContext、proto service、binding。
3. 明确功能需求只表达外部可见契约能力,不进入 crate、handler、CI 任务实现细节。
4. 明确哪些能力属于 L0-bus / L0-sdk / L1+ 各仓,避免职责外溢。
5. 形成可继续驱动 `01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md` 的需求基线。
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物,不得直接改正式 `00-需求文档.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 需求阶段不得写数据库表、Rust struct、handler、repository、事务实现或文件目录。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 未确认事项不得写成正式需求结论。
- 后续每个 Step 到达“待确认事项”时,必须列出 2~3 个可选方案,并给出推荐方案与推荐理由;用户确认后,再把该项收口为已确认结论。
