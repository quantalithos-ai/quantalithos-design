# L0-sdk 需求文档校准工作台

> 对应文档: `projects/L0-sdk/00-需求文档.md`
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`
> 创建日期: 2026-05-30
> 当前目标: 按最新需求 SOP 校准 `L0-sdk`，并允许它依赖已经稳定的 `L0-core` 与 `L0-bus` 结论。

---

## 1. 本轮校准原则

- `L0-sdk` 可以依赖已经稳定的 `L0-core` 与 `L0-bus` 设计结论，不重新定义 ID、Error、Event、TraceContext、CloudEvents schema、publish / subscribe / ack / replay / dead-letter 等基础契约和总线语义。
- `L0-sdk` 是客户端接入层，不承载服务端业务真相，不拥有 L1/L2/L3/L4 的领域事实，也不替代 `L0-bus` 的投递运行时。
- 旧 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 只能作为旧事实和问题诊断输入，不能直接视为新版需求基线。
- 本轮先按 Step 逐个生成中间产物，最后在 Step 17 删除旧 `00-需求文档.md` 并按新文件标准重建正式需求文档。
- 每个 Step 必须独立落盘、独立更新本文状态，不合并 Step。

---

## 2. 稳定上游与可参考对象

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `L0-core` | 已完成 `00`~`07` 深度校准 | 作为直接稳定上游，承接共享契约、proto / DTO、错误、trace、metadata、配置和 evidence 口径 |
| `L0-bus` | 已完成 `00`~`07` 深度校准 | 作为直接稳定上游，承接事件发布、订阅、ack、retry、dead-letter、replay、tap 和报告证据口径 |
| `L1-identity` | 已完成深度校准 | 作为 SDK 领域 client 的消费样本，不反向定义 SDK 主需求 |
| `L3-method-library` | 已完成深度校准 | 作为 SDK 领域 client 与 Definition 查询 / 发布样本，不反向定义 SDK 主需求 |
| 旧 `L0-sdk` 文档 | 未按最新 SOP 校准 | 作为旧口径诊断和可迁移事实来源 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 与上游文档的关系声明 | 已完成 | `design-calibration/00_req_step_01_upstream_relation.md` |
| Step 2 | 本仓定位与边界 | 已完成 | `design-calibration/00_req_step_02_position_boundary.md` |
| Step 3 | 背景与问题定义 | 已完成 | `design-calibration/00_req_step_03_problem_context.md` |
| Step 4 | 目标与非目标 | 已完成 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| Step 5 | 用户与角色 | 已完成 | `design-calibration/00_req_step_05_users_roles.md` |
| Step 6 | 使用方与依赖 | 已完成 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| Step 7 | 核心能力闭环 | 已完成 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| Step 8 | 用户故事 | 已完成 | `design-calibration/00_req_step_08_user_stories.md` |
| Step 9 | 功能需求 | 已完成 | `design-calibration/00_req_step_09_functional_requirements.md` |
| Step 10 | 业务规则与边界约束 | 已完成 | `design-calibration/00_req_step_10_rules_boundary_constraints.md` |
| Step 11 | 数据需求与数据归属 | 已完成 | `design-calibration/00_req_step_11_data_requirements_ownership.md` |
| Step 12 | 接口与依赖 | 已完成 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| Step 13 | 非功能需求 | 已完成 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| Step 14 | 验收标准 | 已完成 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| Step 15 | 风险与待确认事项 | 已完成 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| Step 16 | 需求追溯矩阵 | 已完成 | `design-calibration/00_req_step_16_traceability_matrix.md` |
| Step 17 | 正式整理为 `00-需求文档.md` | 已完成 | `design-calibration/00_req_step_17_formal_document_assembly.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| D-001 | `L0-sdk` 是否重新定义 core proto / CloudEvents / ErrorCode | 否。SDK 只消费 `L0-core` 的稳定契约，并提供三语言 idiomatic 封装。 |
| D-002 | `L0-sdk` 是否重新定义 bus 投递语义 | 否。SDK 只封装 `L0-bus` 已定义的事件消费和发布视图，不成为 bus truth。 |
| D-003 | `architecture/sdk-draft` 是否作为权威设计直接继承 | 否。它是历史草案和候选事实来源，不高于新版需求 SOP、稳定 `L0-core` 与稳定 `L0-bus`。 |
| D-004 | `L0-sdk` 是否是服务端统一 gateway / facade | 否。SDK 是三语言官方客户端接入层，不拥有服务端业务真相和编排权。 |
| D-005 | 旧文档中的公共注册表发版是否作为当前问题主轴 | 否。当前问题主轴是稳定 core / bus 之后官方客户端接入层缺位；公共发包属于后续目标、发布治理或阶段裁剪问题。 |
| D-006 | 公共注册表正式发布、完整 MCP、REST / GraphQL、REPL 是否进入当前 P0 | 否。当前 P0 先收束官方 client 接入边界、本地可验证、版本规则和横切门禁；这些能力后移为发布阶段或 P1/P2 候选。 |
| D-007 | 需求角色是否继续按 L5 / L2 / L1/L3/L4 等层级命名 | 否。角色章节按使用者画像和职责角色命名；具体仓际使用方留到 Step 6。 |
| D-008 | `L0-sdk` 是否源码依赖 L1/L2/L3/L4 服务仓 | 否。SDK 只把 `L0-core` / `L0-bus` 作为编译期依赖；L1/L2/L3/L4 能力只能作为运行期正式边界封装。 |
| D-009 | `L0-sdk` 的核心闭环是否等于旧功能清单或类型生成 | 否。核心闭环是三语言稳定承接、官方客户端一致、最小可验证接入、横切默认一致、文档与兼容演进共同成立。 |

---

## 5. 下一步

需求文档校准已完成。

本步重点:

- `00-需求文档.md` 已按新版需求文档结构重建。
- Step 1~17 中间产物均已落盘。
- 下一阶段可进入 `L0-sdk` 架构设计校准。
