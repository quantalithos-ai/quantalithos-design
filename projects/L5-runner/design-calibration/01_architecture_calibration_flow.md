# L5-runner · 01 架构设计校准流程

> 模式：`full-restart / single-agent / serial Step 1→16`
> 正式文档：`projects/L5-runner/01-架构设计.md`
> 当前状态：`Step 16 formal_stop_review`
> 当前授权：完成全部 01 后停审，不进入 02。

## 1. 总流程计划

| Step | 主题 | 输入 | 输出文件 | 状态 | 完成门禁 |
|---|---|---|---|---|---|
| 1 | 确认需求基线 | 正式 00、上游架构、依赖规则 | `01_arch_step_01_requirements_baseline.md` | completed | 基线、硬约束和未闭合风险可回指 |
| 2 | 架构目标与约束 | Step 1、全局架构、当前风险 | `01_arch_step_02_goals_constraints.md` | completed | 目标、不可变约束、取舍、非目标分离 |
| 3 | 职责边界 | Step 1~2、正式 00 | `01_arch_step_03_responsibility_boundary.md` | completed | 做/不做/易混淆职责和红线闭合 |
| 4 | 系统边界与上下文 | Step 1~3、上游架构 | `01_arch_step_04_system_context.md` | completed | 图、上下游表、降级口径闭合 |
| 5 | 限界上下文与子域 | Step 3~4、draft | `01_arch_step_05_bounded_contexts_subdomains.md` | completed | 核心/支撑/本地影子和单元停审 |
| 6 | 容器/部署架构 | Step 4~5、平台边界 | `01_arch_step_06_runtime_units.md` | completed | 运行承载图、单元表、非实现化 |
| 7 | 依赖方向与层间约束 | Step 3~6、全局依赖 | `01_arch_step_07_dependency_direction.md` | completed | 方向、裁剪表、禁止依赖和跨依赖审计 |
| 8 | 数据所有权与一致性 | Step 3/5/7、需求数据 | `01_arch_step_08_data_ownership_consistency.md` | completed | truth/snapshot/ref/forbidden 与一致性闭合 |
| 9 | 关键交互与通信 | Step 4/6/7/8 | `01_arch_step_09_interactions_communication.md` | completed | 场景、通信类别、失败降级和单元停审 |
| 10 | 关键技术选型 | Step 2/7/8/9 | `01_arch_step_10_technology_selection.md` | completed | 机制、理由、代价、不采用口径闭合 |
| 11 | 备选方案与取舍 | Step 2/10、历史扫描 | `01_arch_step_11_alternatives_tradeoffs.md` | completed | 路径级方案比较与正式结论闭合 |
| 12 | 横切关注点 | Step 2/8/9/10 | `01_arch_step_12_cross_cutting.md` | completed | 适用性、约束、判断口径和跨项审计闭合 |
| 13 | 演进路线 | Step 10~12、当前 blocker | `01_arch_step_13_evolution.md` | completed | 当前阶段、演进阶段、债务、触发条件闭合 |
| 14 | 风险与待确认事项 | Step 1~13 | `01_arch_step_14_risks_open_questions.md` | completed | 风险/待确认分表，状态不脑补 |
| 15 | ADR 与需求追溯 | Step 1~14 | `01_arch_step_15_adr_traceability.md` | completed | ADR、需求矩阵、孤儿项审计闭合 |
| 16 | 正式文档整理 | Step 1~15 | `01_arch_step_16_formal_assembly.md` + 正式 01 | completed / formal_stop_review | 重建、来源、图表、静态审计、停审 |

## 2. Step 内通用计划

每个 Step 必须依次完成：

```text
读取前序输入 -> 回答 SOP 问题 -> 诊断历史污染 -> 记录取舍
-> 形成结构化中间产物 -> 形成回填草稿 -> 单元/跨单元自检 -> 更新门禁
```

Step 5、7、8、9、12、15 必须按架构单元或跨单元边界逐项停审，再进入跨单元总审计。ASCII 图必须有标题、`text` 代码块和 2~5 条图后说明。

## 3. 写入与真实性门禁

- 只有当前 Step 到达时才创建对应 Step 文件，不提前批量创建未来 Step 文件。
- 正式 01 必须先删除旧文件再重建；旧 01 只作为 `historical_material` 和污染扫描输入。
- 正式章节必须逐章列出具体 `design-calibration/01_arch_step_*.md` 来源和延伸阅读。
- 不把 API、DTO、schema、函数、目录、数据库、实现仓或部署参数写成架构事实。
- 上游未闭合能力只能保持 `blocked/pending`，不使用 fake、fixture、ACK、cache 或历史数字关闭。
- 不生成代码、测试结果、baseline、run、artifact、report、evidence、verdict、signoff、readiness 或 commit 事实。
- Step 16 完成后转为 `formal_stop_review`，等待用户明确授权 02。

## 4. 当前恢复点

```text
current_document = 01-架构设计.md
current_step = 16
current_module = formal_assembly
gate_status = formal_stop_review
next_allowed_action = wait_for_user_review_and_explicit_02_authorization
formal_01_write_allowed = completed
formal_02_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
