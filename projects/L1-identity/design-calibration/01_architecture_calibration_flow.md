# L1-identity 架构设计校准工作台

> 对应正式文档: `projects/L1-identity/01-架构设计.md`
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md`
> 书写规范: `standards/document/架构设计书写规范.md`
> 当前目标: 按最新版架构 SOP 从零重建 `L1-identity` 的 `01-架构设计.md`
> 当前状态: Step 16 已完成;新版 `01-架构设计.md` 已装配完成

---

## 1. 本轮重建原则

- 旧版 `01-架构设计.md` 和旧 `01_arch_*` 正式结论已废弃,只作为历史问题诊断来源,不得作为新版架构真相源。
- 新版 `01` 必须直接承接新版 `00-需求文档.md` 和 `00_req_step_*` 中间产物。
- 每个 Step 必须维护 Step 内计划,并保留 SOP 问题回答、当前材料诊断、设计取舍、结构化中间产物、复杂度判断、回填草稿、待确认事项和进入下一步条件。
- Step 5、Step 7、Step 8、Step 9、Step 12、Step 15 必须按架构单元逐个停审,再做跨单元审计。
- 正式 `01-架构设计.md` 只能在 Step 16 从已完成中间产物装配,不得边讨论边直接补正式正文。
- 既有 `02`、`04` 和旧实现口径不得反向决定新版 `01`;它们只能在后续复核时接受新版 `01` 的约束。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 已按新版需求 SOP 重建 | 架构需求基线 |
| `projects/L1-identity/design-calibration/00_requirements_calibration_flow.md` | 已完成 | 需求总流程与能力节点来源 |
| `projects/L1-identity/design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_17_formal_document_assembly.md` | 已完成 | 需求结论追溯 |
| `standards/document/架构设计讨论流程_SOP.md` | 最新架构流程标准 | Step 1~16 执行依据 |
| `standards/document/架构设计书写规范.md` | 最新正式文档结构标准 | Step 16 装配依据 |
| `standards/document/设计文档讨论中间产物规范.md` | 最新中间产物标准 | Step 文件结构和批次纪律 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 最新闭环复核标准 | 防止后续实现阶段脑补 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 最新跨仓依赖裁剪标准 | Step 7 依赖方向依据 |
| 旧 `01-架构设计.md` / 旧 `01_arch_*` | 已废弃 | 仅作为历史问题诊断输入 |
| 现有 `02/03/04/05/06/07` | 可能与新版 `00/01` 不一致 | 不作为新版 `01` 上游;后续需重建或复核 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---|---|---|---|---|---|---|---|
| Step 1 | 确认需求基线 | 新版 `00`、`00_req_step_*`、架构 SOP / 规范 | `01_arch_step_01_requirement_baseline.md` | 无 | 已完成 | 需求基线、硬约束、旧口径降级、后移事项已明确 | 可进入 Step 2 |
| Step 2 | 明确架构目标与约束 | Step 1、`00` §4/§7/§10/§14/§15 | `01_arch_step_02_goals_constraints.md` | Step 1 | 已完成 | 架构目标、不可变约束、阶段取舍和非目标已分层 | 可进入 Step 3 |
| Step 3 | 职责边界 | Step 1~2、`00` §2/§10/§11 | `01_arch_step_03_responsibility_boundary.md` | Step 2 | 已完成 | 做 / 不做、易混职责、边界红线已闭合 | 可进入 Step 4 |
| Step 4 | 系统边界与上下文 | Step 3、`00` §6/§12 | `01_arch_step_04_system_context.md` | Step 3 | 已完成 | 上下游、输入输出面、上下文图和失败降级已收敛 | 可进入 Step 5 |
| Step 5 | 限界上下文与子域划分 | Step 3~4、`00` §7/§11 | `01_arch_step_05_bounded_context_subdomains.md` | Step 4 | 已完成 | 每个架构单元完成职责 / 非职责 / 统一语言停审 | 可进入 Step 6 |
| Step 6 | 容器与部署视图 | Step 5、`00` §12/§13 | `01_arch_step_06_container_deployment.md` | Step 5 | 已完成 | 运行单元和部署边界未滑入代码目录或产品选型 | 可进入 Step 7 |
| Step 7 | 依赖方向与层间约束 | Step 5~6、依赖裁剪规则 | `01_arch_step_07_dependency_direction.md` | Step 6 | 已完成 | 每个架构单元依赖规则停审,跨仓依赖类型明确 | 可进入 Step 8 |
| Step 8 | 数据所有权与一致性策略 | Step 3/5/7、`00` §11 | `01_arch_step_08_data_ownership_consistency.md` | Step 7 | 已完成 | 每个架构单元 truth / snapshot / reference / forbidden body 停审 | 可进入 Step 9 |
| Step 9 | 关键交互与通信方式 | Step 4/6/8、`00` §12 | `01_arch_step_09_interactions_communication.md` | Step 8 | 已完成 | 同步 / 异步 / 后台 / handoff 的边界理由和降级口径已收敛 | 可进入 Step 10 |
| Step 10 | 关键技术选型 | Step 2/7/8/9 | `01_arch_step_10_technology_choices.md` | Step 9 | 已完成 | 只记录架构机制,不提前定数据库 / 消息产品 / 框架 | 可进入 Step 11 |
| Step 11 | 备选方案与取舍 | Step 2/10 | `01_arch_step_11_alternatives_tradeoffs.md` | Step 10 | 已完成 | 替代架构路径和取舍来源已说明 | 可进入 Step 12 |
| Step 12 | 横切关注点 | Step 2/8/9/10 | `01_arch_step_12_cross_cutting_concerns.md` | Step 11 | 已完成 | 安全、审计、观测、韧性、配置等按架构单元停审 | 可进入 Step 13 |
| Step 13 | 演进路线 | Step 10~12、已知债务 | `01_arch_step_13_evolution_path.md` | Step 12 | 已完成 | 当前阶段、后续触发条件和非演进项已分离 | 可进入 Step 14 |
| Step 14 | 风险与待确认事项 | Step 1~13 | `01_arch_step_14_risks_open_questions.md` | Step 13 | 已完成 | 风险和待确认事项拆分,未把缺口润色成定论 | 可进入 Step 15 |
| Step 15 | ADR 与需求追溯 | Step 1~14、`00` 追溯矩阵 | `01_arch_step_15_adr_traceability.md` | Step 14 | 已完成 | 每个关键架构决定有需求 / 约束 / 风险来源并完成停审 | 可进入 Step 16 |
| Step 16 | 整理正式文档 | Step 1~15、架构书写规范 | `01_arch_step_16_formal_document_assembly.md` 与 `../01-架构设计.md` | Step 15 | 已完成 | 跨架构单元总审计通过,正式章节无新增未确认结论 | `01` 重建完成 |

---

## 4. Step 内统一执行模板

每个 `01_arch_step_*` 文件必须按以下结构落盘:

1. Step 状态 + Step 内计划
2. 本步输入
3. SOP 问题回答
4. 当前材料 / 旧文档问题诊断
5. 改动前后对比
6. 设计取舍
7. 结构化中间产物
8. 回填草稿
9. 待确认事项
10. 进入下一步条件

复杂 Step 必须在第 1 节说明是否需要拆架构单元、附录或批次。需要拆分时,先写主控产物,再分批补齐每个架构单元,不得用一张总表压缩。

---

## 5. 本轮必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| ARCH-WATCH-001 | 旧 `01`、旧 `02`、旧 `04` 不得反向约束新版架构 | 新版 `00` 风险 `R-ID-001` / `R-ID-006` | 只作历史诊断输入 |
| ARCH-WATCH-002 | `L0-core` 是唯一编译期依赖候选,`L0-bus` 只能是事件协作 | 依赖裁剪规则 / `VETO-ID-006` | Step 7 强制复核 |
| ARCH-WATCH-003 | `ProjectMember`、`RoleDefinition`、memory body、runtime body、credential 不得进入 identity truth | `BR-ID-003`、`BR-ID-006`~`BR-ID-012`、`VETO-ID-003` | Step 3 / 8 强制复核 |
| ARCH-WATCH-004 | “能力画像摘要”的 truth / snapshot 混合口径必须在架构层给出可继续细化的拆分原则 | `00` §11 | Step 8 强制复核 |
| ARCH-WATCH-005 | method-library 来源协议、governance basis、memory/archive handoff、visibility/privacy、性能基线仍是后移事项 | `OQ-ID-001`~`OQ-ID-005` | 不得在 `01` 主文润色成已闭口 |
| ARCH-WATCH-006 | `FR-ID-014` 投影 / 引用对账属于需求闭环,但不能在架构层扩大成自动修复相邻仓 truth | `FR-ID-014` / `BR-ID-015` / `VETO-ID-005` | Step 8 / 9 / 12 强制复核 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 旧正式 `01` | 已清空旧占位并替换为新版正式架构文档 |
| 旧 `01_arch_*` | 已替换为新版流程框架 |
| 当前完成 Step | Step 16 整理正式文档 |
| 当前下一步 | 新版 `01` 已完成;后续可按 SOP 继续重建或复核 `02~07` |
| 正式 `01` 是否可作为基线 | 是,后续 `02~07` 必须承接本文和对应 `01_arch_step_*` 中间产物 |
