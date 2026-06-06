# L1-process 07 实施计划 Step 13: 整理正式实施计划文档

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` 全文
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 整理正式实施计划文档 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 是 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_13_formal_document_assembly.md` |

本步定义正式 `07-实施计划.md` 的装配规则和校验清单。正式文档只能从 Step 1~12 已确认中间产物摘录,不得新增未确认阶段、提交边界、门禁或完成判定。

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 已完成 | §1 与上游文档关系 |
| `07_implementation_plan_step_02_scope.md` | 已完成 | §2 目标、范围、非范围 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已完成 | §3 前置条件、阅读清单、永久记忆 |
| `07_implementation_plan_step_04_deliverables.md` | 已完成 | §4 实施对象与交付物 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已完成 | §5 阶段和依赖 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已完成 | §6 任务、批次、commit boundary |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已完成 | §7 测试与验收门禁 |
| `07_implementation_plan_step_08_config_env_dependencies.md` | 已完成 | §8 配置、环境、依赖 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已完成 | §9 Spike、风险、待确认 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已完成 | §10 回退、暂停、变更 |
| `07_implementation_plan_step_11_commit_review_delivery.md` | 已完成 | §11 提交、评审、交付 |
| `07_implementation_plan_step_12_completion_criteria.md` | 已完成 | §12 完成判定 |

## 3. 正式文档章节映射

| 正式章节 | 校准来源 | 装配重点 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 明确 `00~06` 是上游,`03` 是直接实现输入 |
| §2 实施目标与范围 | Step 2 | 固定 P0/P1/P2、13/11/7/10/7、16 状态机、非范围 |
| §3 实施前置条件与阅读清单 | Step 3 | 必读文档、阶段阅读矩阵、git / dependency / permanent memory |
| §4 实施对象与交付物清单 | Step 4 | 7 crate、protocol、config/scripts/evidence、非交付物 |
| §5 实施阶段与依赖顺序 | Step 5 | PH-01~PH-10 阶段链 |
| §6 阶段任务拆分、编写顺序与提交边界 | Step 6 | 完整 commit boundary 表、PH-07/08/09 子边界、复核矩阵 |
| §7 测试与验收门禁嵌入 | Step 7 | phase gate、commit gate、evidence maturity、VF check |
| §8 配置、环境与外部依赖准备 | Step 8 | profiles、external seam、paths、config gate |
| §9 Spike、风险与待确认事项 | Step 9 | Spike、risk、blocker、risk acceptance |
| §10 回退、暂停与变更控制 | Step 10 | pause / rollback / change / recovery rules |
| §11 提交、评审与交付纪律 | Step 11 | implementation commit English, boundary, evidence delivery |
| §12 实施完成判定 | Step 12 | completion criteria、delivery checklist、final decision |
| §13 参考 | Step 13 | 列出上游文档、校准产物和标准 |

## 4. 装配约束

| 约束 | 要求 |
|---|---|
| 校准来源 | 每章开头必须列具体 `design-calibration/07_implementation_plan_step_*.md` |
| 延伸阅读 | 每章必须说明建议继续阅读中间产物哪些小节 |
| 不重复详细设计 | 不复制对象字段表、DTO schema、trait、flow 伪代码或状态矩阵 |
| 不新增设计 | 不新增未在 Step 1~12 出现的阶段、commit boundary、测试、AC 或风险 |
| 命名 | 全文使用 L1-process、PROC、Process,不得混入其他子项目测试编号或验收编号口径 |
| 数量 | 保持 7 crate、13 Command、11 Query、7 inbound、10 outbound、7 job、16 state machines |
| 路径 | 使用 `/home/aris/Projects/quantalithos-process`、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 报告成熟度 | 区分最小 evidence index 壳、最终 EV detail pages 和 acceptance handoff |

## 5. 正式文档校验清单

| 检查项 | 通过条件 |
|---|---|
| 文件存在 | `projects/L1-process/07-实施计划.md` 已创建 |
| 中间产物完整 | `07_implementation_plan_calibration_flow.md` + Step 1~13 共 14 个文件 |
| 章节完整 | 正式文档包含 §1~§13 |
| 校准来源完整 | 每章有 `> 校准来源:` 和具体 step 文件 |
| 无占位 | 无待办、待回填或待同步占位语句 |
| 无错仓词 | 新 07 文件无其他子项目测试编号、验收编号或领域对象误植 |
| 数量一致 | 13/11/7/10/7、16 state machines、7 crate 一致 |
| evidence path | 无正式 `latest`、`artifacts/test/<project>/<run_id>` 或 `reports/<project>` |
| report maturity | commit-10-a / commit-10-b 边界清晰 |
| implementation handoff closure audit | §3 有 `MEM-PROC-009`,§12 将按 PH-01~PH-10 和 `07-实施计划.md` §6 完整 commit boundary 表审计正式 `03/05/06/07` 列为完成判定 |

## 6. 回填草稿

```markdown
## 13. 参考

> 校准来源:
> - `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“正式文档章节映射”“装配约束”和“正式文档校验清单”小节。

本文参考 L1-process `00~06`、`design-calibration/07_implementation_plan_step_01*` 到 `step_13*`、实施计划书写规范、实施计划讨论 SOP、目录组织规范、依赖裁剪规则、Rust 编码规范和设计真相源闭环与可落码性标准。
```

## 7. 进入下一步条件

- Step 1~12 已全部完成。
- 正式文档装配规则已固定。
- 可以创建 `projects/L1-process/07-实施计划.md`。
