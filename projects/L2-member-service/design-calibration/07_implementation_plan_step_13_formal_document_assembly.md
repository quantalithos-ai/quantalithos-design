# Step 13. 整理正式实施计划文档

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 13
> 本步状态：completed / stop_review
> 回填目标：正式 `projects/L2-member-service/07-实施计划.md`、implementation ledger 与 24 个 boundary skeleton

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / stop_review |
| current_module | formal_document_assembly |
| next_allowed_action | stop_review |
| formal_07_write_allowed | closed after assembly |
| implementation_ledger_write_allowed | planned inventory only |

### 终审补正记录（v1.0.2）

| 补正项 | 处理结果 |
|---|---|
| §2 范围可追溯 | 增加类别 / 来源 / 是否本轮实施 / 说明矩阵，分离 P0、P1/P2 与非范围 |
| §3 前置与记忆 | 增加路径列、阶段读取目的、`MEM-MS-001~008` 全字段种子表和工具环境检查；Git 示例改为 `bash` fenced block |
| §6 阶段粒度 | 增加 PH-01~PH-08 独立任务 / 批次 / 提交边界小节，补齐输入、输出、规模、验证和提交时机 |
| §7 证据报告 | 增加报告生成与人工审查矩阵，保持 raw→report→index 和无静态 evidence 规则 |
| boundary 引用 | 修正 `commit-08-c` Required Reads 的 `03` 章节引用 |

## 本步输入

Step 1~12 的中间产物、实施计划 SOP / 书写规范、代码实施台账规范、正式 `00~06`、项目 execution ledger 和只读上游/兄弟台账。

## SOP 问题回答

正式文档必须完整包含 13 个章节，且每章开头标注具体 calibration 来源；正文只承载收口结论，不复制过程讨论。阶段编号、task/batch/gate 身份必须一一对应；24 个 boundary skeleton 必须在实现移交前预创建，只有 `commit-01-a` 可以成为 current，且当前因目标仓 absent 为 blocked。implementation ledger 只能写 planned/blocked/waiting，不得出现实际 hash、run、artifact、report、evidence、verdict、signoff 或 readiness。

## 当前文档问题诊断

没有正式 07 时，无法把 03/05/06 的承接关系、阶段门禁、提交纪律和台账入口交给实现者。直接复制兄弟项目 07 又会把其对象分母、phase 或依赖误带入本仓。因此本步采用 L1-governance 粒度，但完全使用 L2-member-service 自身分母和 blocker。

## 改动前后对比

| 产物 | 改动前 | 改动后 |
|---|---|---|
| 正式 07 | 不存在 | 13 章完整装配 |
| calibration | 缺失 | 13 个独立 Step 文件 + flow |
| implementation ledger | 不存在 | 项目级状态与 24 boundary 索引 |
| boundary ledger | 不存在 | 24 个 planned skeleton，current 唯一 |

## 设计取舍

- 正式 07 采用 L1-governance 的章节粒度、表格和门禁风格，但不继承其治理对象或协议数量。
- 目标仓 absent 只阻断实现，不阻断设计文档装配；这允许先审查计划而不伪造实现事实。
- 所有外部正向能力保留 pending/blocked/placeholder，确保并行兄弟未停审时不发生 truth 污染。

## 结构化中间产物

### 正式章节来源映射

| 正式章节 | calibration 来源 |
|---|---|
| §1 与上游文档的关系声明 | 07_implementation_plan_step_01_input_boundary.md |
| §2 实施目标与范围 | 07_implementation_plan_step_02_scope.md |
| §3 实施前置条件与阅读清单 | 07_implementation_plan_step_03_prerequisites_reading.md |
| §4 实施对象与交付物清单 | 07_implementation_plan_step_04_objects_deliverables.md |
| §5 实施阶段与依赖顺序 | 07_implementation_plan_step_05_phases_dependencies.md |
| §6 阶段任务拆分、编写顺序与提交边界 | 07_implementation_plan_step_06_tasks_commit_boundaries.md |
| §7 测试与验收门禁嵌入 | 07_implementation_plan_step_07_test_acceptance_gates.md |
| §8 配置、环境与外部依赖准备 | 07_implementation_plan_step_08_config_environment_dependencies.md |
| §9 Spike、风险与待确认事项 | 07_implementation_plan_step_09_spikes_risks_open_questions.md |
| §10 回退、暂停与变更控制 | 07_implementation_plan_step_10_rollback_pause_change_control.md |
| §11 提交、评审与交付纪律 | 07_implementation_plan_step_11_commit_review_delivery.md |
| §12 实施完成判定 | 07_implementation_plan_step_12_completion_criteria.md |
| §13 参考 | 07_implementation_plan_step_13_formal_document_assembly.md |

### 正式装配检查表

| 检查项 | 结论 |
|---|---|
| 13 章齐全且顺序正确 | pass-designed |
| 每章有具体 calibration 来源 | pass-designed |
| 8 phase、24 boundary、24 gate identity 一致 | pass-designed |
| 72 task、72 batch identity 一致 | pass-designed |
| 7/29/10/6/5/1/7 分母无扩张 | pass-designed |
| P0 AC 与 P1/P2 AC-MS-018~021 范围分离 | pass-designed |
| 24 个 boundary 均有逐项经验适用性复核 | pass-designed |
| §6 每个 Phase 均有任务、批次、提交时机与验证门禁 | pass-designed |
| §3 记忆种子包含来源、刷新、失效、冲突和禁止改写字段 | pass-designed |
| §7 报告生成入口与人工审查责任明确 | pass-designed |
| Query no-write / Job no-truth-repair | pass-designed |
| 实现仓、commit、run、artifact、report、evidence 未伪造 | pass-designed |
| 上游 blocker 保持 pending/blocked/waiting | pass-designed |
| 24 skeleton 全量预创建且 future 未标 pass | pass-designed |

### 交付台账装配口径

| 产物 | 设计期状态 | 允许记录 |
|---|---|---|
| implementation_execution_ledger.md | created / not_started | path、baseline not_bound、current boundary、blocker、next action |
| implementation-boundaries/*.md | 24 created | required reads、scope、planned gate、none commit/evidence |
| target implementation repo | absent | 仅 blocker，不创建源码 |
| test artifacts/reports | not_generated | 固定 future 路径，不生成实例 |

### 总审计与停审

| 审计面 | 结论 | 后续限制 |
|---|---|---|
| source traceability | pass-designed | 正式章节回指本目录 Step 文件 |
| phase/boundary/gate | pass-designed | 只激活一个 current |
| dependency boundary | pass_with_upstream_blockers | exact sibling/Core/Bus 仍 pending |
| evidence maturity | pass-designed | 无真实 run，不可形成 verdict |
| scope safety | pass-designed | 只修改本项目目录 |

## 回填草稿

正式文档和 implementation ledger 已按本步映射装配；Step 13 完成后立即进入 stop review，不自动创建实现仓、不运行测试、不提交 commit。

## 待确认事项

- 用户对正式 07 设计结论的后续审阅与是否授权实现交接。
- 上游 exact contract 和目标实现仓创建后，是否需要重开受影响 boundary。

## 进入下一步条件

本步无下一实施 Step；正式 07、台账和 skeleton 完成后停审。任何实现动作都必须由新的用户授权、关闭相应 blocker 和重新执行 implementation preflight 触发。
