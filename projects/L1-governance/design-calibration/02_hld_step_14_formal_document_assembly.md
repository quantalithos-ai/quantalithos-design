# Step 14. 整理正式概要设计文档

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 14
> 回填章节: `02-概要设计.md` 全文
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 ~ Step 13 已确认的 `L1-governance` 概要设计结论按 `standards/document/概要设计书写规范.md` 的 14 章正式结构重组为 `projects/L1-governance/02-概要设计.md`。

本步只做重组、压缩、润色、术语统一和交叉引用补齐,不新增未经讨论的新概要结论,不把详细设计层内容、项目计划或运维实施细节补进正式概要设计。

---

## 2. 正式概要设计文档重组结论

| 正式章节 | 主要来源 | 重组方式 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 摘录上游承接、历史输入降级和暂不进入范围 |
| §2 本次设计目标与范围 | Step 2 | 摘录目标、交付给详细设计的结果和非范围 |
| §3 约束条件 | Step 3 | 摘录结构性约束表并压缩说明 |
| §4 代码主体框架总览 | Step 4 | 摘录代码主体映射和实现分层 |
| §5 主要组成部分、职责与边界 | Step 5 | 摘录 10 个主要组成部分和交互图 |
| §6 关键对象轮廓 | Step 6 | 摘录关键对象类别表,完整对象骨架保留在附录中间产物 |
| §7 API / 接口骨架 | Step 7 | 摘录接口分类和主要接口组 |
| §8 关键处理流 / 重要函数数据流 | Step 8 | 摘录处理流族和通用读写路径 |
| §9 状态定义与状态流转 | Step 9 | 摘录状态组、主线可消费状态和状态传播图 |
| §10 异常与边界场景轮廓 | Step 10 | 摘录关键异常表和异常边界图 |
| §11 配置影响轮廓 | Step 11 | 摘录配置影响表和禁止配置化边界 |
| §12 详细设计承接清单 | Step 12 | 摘录承接清单和回退规则 |
| §13 设计风险与待确认事项 | Step 13 | 摘录风险和待确认事项 |
| §14 参考 | Step 14 | 列出实际使用材料及用途 |

正式文档没有机械粘贴全部中间产物。字段骨架、对象成员函数、完整状态迁移、异常分类和配置实现方向等细节仍保留在 `design-calibration/02_hld_step_*` 文件中作为延伸阅读。

---

## 3. 章节回填结论

| 中间产物 | 已回填章节 | 回填策略 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | §1 | 保留可承接输入和旧文档降级口径 |
| `02_hld_step_02_goals_scope.md` | §2 | 保留目标、范围和交付给详细设计的结果 |
| `02_hld_step_03_constraints.md` | §3 | 保留结构性约束,删去重复诊断 |
| `02_hld_step_04_code_subject_framework.md` | §4 | 保留代码主体 map 和分层表 |
| `02_hld_step_05_components_boundary.md` | §5 | 保留主要组成部分表和交互图 |
| `02_hld_step_06_key_objects*.md` | §6 | 保留对象类别总表,完整对象骨架转为延伸阅读 |
| `02_hld_step_07_api_interface_skeleton.md` | §7 | 保留接口类别表和接口组说明 |
| `02_hld_step_08_processing_flows.md` | §8 | 保留 11 个处理流族和核心边界 |
| `02_hld_step_09_state_machine.md` | §9 | 保留状态组表、传播图和禁止迁移红线 |
| `02_hld_step_10_exceptions_boundaries.md` | §10 | 保留异常场景表和异常影响边界 |
| `02_hld_step_11_configuration_impact.md` | §11 | 保留配置影响轮廓和禁止配置化边界 |
| `02_hld_step_12_detailed_design_handoff.md` | §12 | 保留详细设计承接清单和概要回退规则 |
| `02_hld_step_13_risks_open_questions.md` | §13 | 保留风险 / 待确认拆分 |

---

## 4. 术语统一结论

| 术语 | 统一口径 |
|---|---|
| `Governance truth` | 表达本仓拥有的治理决策与治理控制事实 |
| `Gate / Decision` | 表达 Governance-owned 正式等待点和裁决结论,不等同 process waiting 或 conversation display |
| `PolicyEffectiveFact` | 表达 Governance-owned Policy 生效事实,不等同 AIPolicyDef 或 runtime cache |
| `SharedRuleSet` | 表达组织级不可被低 scope 覆盖的硬约束 |
| `AIIAConclusion` / `SoAConclusion` | 表达 Governance-owned 结论,正文归 artifact / archive |
| `NonconformityRecord` | 表达不符合纠正闭环 truth,不等同 bug、blocker 或 alert |
| `DerivedGovernanceViewState` | 表达只读派生 freshness / rebuild / failure 状态,不反写 truth |
| `ReferenceResolutionState` | 表达外部引用本地解析状态,不拥有外部 truth |

---

## 5. 交叉引用结论

- 每个正式章节开头都保留具体 `design-calibration` 校准来源块。
- 正式文档 §14 只列实际使用过的材料,并说明用途。
- Step 与正式章节不是机械复制关系:Step 是生成流程,正式文档是结果结构。
- Step 6 对象附录没有全文粘贴进正式 §6,而是作为延伸阅读保留。
- Step 13 待确认事项未在正式文档中润色为已确认结论。

---

## 6. 参考材料表

| 参考材料 | 用途 |
|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | 生成流程和 Step 1~14 门禁 |
| `standards/document/概要设计书写规范.md` | 正式章节主链、校准来源块、图表约束 |
| `standards/document/设计文档编写通则.md` | 文档分层、术语、范围和引用约束 |
| `projects/L1-governance/00-需求文档.md` | 需求边界、核心闭环、数据归属和验收红线 |
| `projects/L1-governance/01-架构设计.md` | 架构边界、依赖方向、数据所有权、一致性、通信、风险 |
| `projects/L1-governance/design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_13_risks_open_questions.md` | 正式概要各章的校准来源 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 共享 ID、ActorRef、TraceContext、metadata、error、evidence 和配置基线 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | bus 事件、投递、重放、死信和证据口径 |
| sibling L1 / L3 / L4 仓 `00`~`07` | 外部引用、snapshot、summary、handoff 和消费边界 |

---

## 7. 进入下一步条件

- `projects/L1-governance/02-概要设计.md` 已按 14 章正式结构重建。
- 每个正式章节都有具体校准来源块。
- 已确认结论已落入对应正式章节。
- 未闭环项仍保留在 §13,没有被整理成定论。
- 没有新增未经 Step 1~13 讨论的新概要结论。
- 可以进入后续 `03-详细设计.md` 讨论流程。
