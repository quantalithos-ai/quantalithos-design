# L2-runtime 01 架构设计全量重启校准流程

> 创建日期: 2026-08-07
> 状态: formal_01_complete_pending_user_confirmation
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L2-runtime`
> 正式文档目标: `projects/L2-runtime/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮边界: 用户已连续授权完成架构 Step 4~16;正式 `01-架构设计.md` 已完成，等待用户确认后才能进入 `02`

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 16 正式文档整理 | `formal_document_review_gate` | `blocked` | 正式 `01-架构设计.md` 已重建并完成总审计;等待用户确认，不进入 `02`。 | `await_user_confirmation_for_formal_01` | `01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_15_adr_traceability.md`;`01_arch_step_16_formal_document_assembly.md` |

## 2. 执行纪律

- 严格按架构 SOP `Step 1 -> Step 16` 推进,不得合并或跳步。
- 每个 Step 独立创建一个 `01_arch_step_*.md`;未来 Step 文件不得提前创建、清空或写占位框架。
- 正式 `01-架构设计.md` 只允许在 Step 16 删除并重建;当前不修改正式架构正文。
- 每个 Step 记录问题回答、历史诊断、取舍、结构化产物、回填草稿、自检和门禁。
- 架构阶段不写数据库表、字段 schema、Rust struct、DTO、API path、repository、handler、事务、测试用例、实现目录或实施 boundary。
- 正式章节必须列出具体校准来源;讨论过程只保留在 `design-calibration`。
- 不确定项保持 `pending` / `blocked` / `waiting` / `degraded` / `fail-closed`,不得伪造 ready、实现、证据或签署。
- 每个架构单元在 Step 5 以后逐个停审;跨单元审计完成前不得进入正式装配。

## 3. 公共输入与历史材料

| 输入 | 定位 | 本架构链用法 |
|---|---|---|
| `projects/L2-runtime/00-需求文档.md` | current_baseline | 唯一直接需求基线;架构只筛选会影响结构的结论,不重写需求全文。 |
| `projects/L2-runtime/design-calibration/00_req_step_*.md` | baseline_detail | 按需追溯需求边界、依赖、数据、验收、风险和追溯来源。 |
| `standards/document/架构设计讨论流程_SOP.md` | normative_process | 定义 Step 1~16、架构单元小循环和门禁。 |
| `standards/document/架构设计书写规范.md` | normative_result | 定义正式 18 章、图表、校准来源和架构粒度。 |
| `standards/document/设计文档讨论中间产物规范.md` | normative_process | 定义三层台账、恢复顺序、分批写入和 future Step 禁止提前落盘。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | normative_dependency | 定义全局顺序与 compile / runtime / event 裁剪规则。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | normative_truth | 约束 owner、consumer、handoff、failure、evidence 和后续可落码闭环。 |
| `projects/L2-tools/01-架构设计.md` | current_upstream | 承接工具 canonical invocation / normalized outcome / handoff 边界;不复制工具架构单元。 |
| `projects/L3-capability-hub/01-架构设计.md` | current_upstream | 承接 capability identity / registry / descriptor / formal exposure owner。 |
| `projects/L4-sandbox/01-架构设计.md` | current_upstream | 承接 isolation execution、capture、failure、handoff、cleanup owner。 |
| `projects/L4-observability/01-架构设计.md` | current_upstream | 承接 body-free observation / audit projection / observed truth owner。 |
| `projects/L3-method-library/01-架构设计.md` | current_upstream_dirty | 承接 method / role / process definition owner;不声称其关联未提交 `03` 基线不可变。 |
| `projects/L0-core/01-架构设计.md` | foundation | 共享 ID / ref / metadata / error / trace / envelope compile authority。 |
| `projects/L0-bus/01-架构设计.md` | foundation | 已提交事实的 event collaboration 主干;不拥有 Runtime 业务 schema。 |
| `projects/L0-sdk/01-架构设计.md` | downstream_boundary | SDK 是下游封装面;不反向成为 Runtime package 依赖。 |
| `projects/L1-governance/01-架构设计.md` | current_truth_input | Governance Decision / Policy effective / approval truth;Runtime 只消费。 |
| `projects/L1-artifact/01-架构设计.md` | granularity_reference | Artifact / evidence / lineage truth 与 ref / handoff 边界。 |
| 旧 `projects/L2-runtime/01-架构设计.md`、README、旧 02/03/05/06 | historical_material | 只做污染审计;不继承 StateGraph、Python、固定 SLA、对象、API、Policy Cache 或 execution plan 主线。 |

## 4. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `01_arch_step_01_requirement_baseline.md` | 确认需求基线 | completed_user_confirmed | pass | 进入 Step 2 | 架构需求基线、硬约束、未关闭风险三类分清。 |
| 2 | `01_arch_step_02_goals_constraints.md` | 明确架构目标与约束 | completed_user_confirmed | pass | 进入 Step 3 | 目标、约束、取舍、非目标可追溯。 |
| 3 | `01_arch_step_03_responsibility_boundary.md` | 职责边界 | completed_user_confirmed | pass | 进入 Step 4 | 做 / 不做 / 易混淆 / 红线闭合。 |
| 4 | `01_arch_step_04_system_context.md` | 系统边界与上下文 | completed_continuous_authorization | pass | 进入 Step 5 | 上下文图、上下游、输入 / 输出面闭合。 |
| 5 | `01_arch_step_05_bounded_context_subdomains.md` | 限界上下文与子域划分 | completed_continuous_authorization | pass | 进入 Step 6 | 架构单元逐个停审,跨上下文审计完成。 |
| 6 | `01_arch_step_06_container_deployment.md` | 容器 / 部署架构 | completed_continuous_authorization | pass | 进入 Step 7 | 运行单元和部署边界不下沉到源码。 |
| 7 | `01_arch_step_07_dependency_direction.md` | 依赖方向与层间约束 | completed_continuous_authorization | pass | 进入 Step 8 | 依赖裁剪表、分类表、禁止表、ASCII 图完成。 |
| 8 | `01_arch_step_08_data_ownership_consistency.md` | 数据所有权与一致性策略 | completed_continuous_authorization | pass | 进入 Step 9 | truth / snapshot / projection / ref / forbidden body 闭合。 |
| 9 | `01_arch_step_09_interactions_communication.md` | 关键交互与通信方式 | completed_continuous_authorization | pass | 进入 Step 10 | 交互方式和失败降级有架构理由。 |
| 10 | `01_arch_step_10_technology_choices.md` | 关键技术选型 | completed_continuous_authorization | pass | 进入 Step 11 | 机制级选型有来源,不锁实现细节。 |
| 11 | `01_arch_step_11_alternatives_tradeoffs.md` | 备选方案与取舍 | completed_continuous_authorization | pass | 进入 Step 12 | 选择、放弃原因、代价和承接完整。 |
| 12 | `01_arch_step_12_cross_cutting_concerns.md` | 横切关注点 | completed_continuous_authorization | pass | 进入 Step 13 | 按架构单元裁剪安全、审计、观测、性能和降级。 |
| 13 | `01_arch_step_13_evolution_path.md` | 演进路线 | completed_continuous_authorization | pass | 进入 Step 14 | 演进不破坏 truth / dependency / data 边界。 |
| 14 | `01_arch_step_14_risks_open_questions.md` | 风险与待确认事项 | completed_continuous_authorization | pass | 进入 Step 15 | 风险、待确认、处理口径分开。 |
| 15 | `01_arch_step_15_adr_traceability.md` | ADR 与需求追溯 | completed_continuous_authorization | pass | 进入 Step 16 | ADR 候选、矩阵、孤儿审计闭合。 |
| 16 | `01_arch_step_16_formal_document_assembly.md` | 整理正式文档 | completed_continuous_authorization | pass | 正式 01 停审并等待用户确认 | 正式 18 章有具体来源且不新增结论。 |

## 5. 当前门禁

```text
document_status = formal_01_complete_pending_user_confirmation
current_step = 16
current_module = formal_document_review_gate
gate_status = blocked
gate_reason = formal_01_complete_but_user_confirmation_pending
next_allowed_action = await_user_confirmation_for_formal_01
formal_01_write_allowed = false
future_step_files_allowed = false
next_formal_document_allowed = false_until_user_confirmation
commit_required = false
```
