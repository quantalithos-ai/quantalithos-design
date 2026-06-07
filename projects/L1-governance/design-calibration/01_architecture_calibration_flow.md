# 01 架构设计校准工作台

> 对应正式文档: `projects/L1-governance/01-架构设计.md`
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md`
> 书写规范: `standards/document/架构设计书写规范.md`
> 前置基线: `projects/L1-governance/00-需求文档.md`
> 生成日期: 2026-06-07
> 当前状态: Step 1 ~ Step 16 已完成;正式 `01-架构设计.md` 已回填
> 当前下一步: 校验并提交 L1-governance 01 架构设计成果

---

## 1. 工作台说明

本工作台用于按架构设计 SOP 逐步重建 `L1-governance` 的架构设计。它只记录本轮校准的输入边界、执行纪律、Step 状态和下一步,不替代各 `01_arch_step_*.md` 中间产物,也不替代最终正式 `01-架构设计.md`。

当前 `projects/L1-governance/01-架构设计.md` 仍保留 2026-05-11 旧 Draft 口径,包含旧日期、旧 ADR 状态、旧性能目标和旧产品设施线索。本轮新版架构讨论不得直接继承旧正文;旧文档只能作为历史输入和问题诊断来源。

正式 `01-架构设计.md` 将在 Step 16 完成后按新版架构书写规范重建。Step 16 只允许重组、摘录、压缩、术语统一和交叉引用统一,不得新增 Step 1 ~ Step 15 未确认的新架构结论。

---

## 2. 输入边界

| 输入 | 用途 |
|---|---|
| `projects/L1-governance/00-需求文档.md` | 当前架构设计的直接需求基线 |
| `projects/L1-governance/design-calibration/00_req_step_*.md` | 追溯需求校准过程、风险、验收和需求来源 |
| `projects/L1-governance/design-calibration/01_arch_step_*.md` | 承接本轮架构校准每一步正式中间产物 |
| `standards/document/架构设计讨论流程_SOP.md` | 控制 Step 顺序、问题范围和进入下一步条件 |
| `standards/document/架构设计书写规范.md` | 控制正式架构文档章节结构和回填粒度 |
| `standards/document/设计文档讨论中间产物规范.md` | 控制分批写入、校准来源和追溯纪律 |
| 旧 `projects/L1-governance/01-架构设计.md` | 历史输入和问题诊断来源,不作为新版架构真相源直接继承 |

---

## 3. 执行纪律

- 严格按 Step 1 ~ Step 16 顺序推进,不得合并 Step。
- 每个 Step 独立生成 `design-calibration/01_arch_step_*.md`。
- 每个 Step 只回答该 Step 的架构问题,不得提前写概要设计、详细设计、字段 schema、数据库表、handler 伪代码或测试用例。
- 不确定项进入风险与待确认事项,不得脑补为架构事实。
- Step 15 只建立 ADR 索引和需求追溯,不得新增前文未确认的新结论。
- Step 16 只整理正式文档,不得新增架构结论。
- 正式 `01-架构设计.md` 只在 Step 16 汇总重建。

---

## 4. Step 状态表

| Step | 名称 | 输出文件 | 状态 |
|---|---|---|---|
| Step 1 | 确认需求基线 | `01_arch_step_01_requirement_baseline.md` | 已完成 |
| Step 2 | 明确架构目标与约束 | `01_arch_step_02_goals_constraints.md` | 已完成 |
| Step 3 | 职责边界 | `01_arch_step_03_responsibility_boundary.md` | 已完成 |
| Step 4 | 系统边界与上下文 | `01_arch_step_04_system_context.md` | 已完成 |
| Step 5 | 限界上下文与子域划分 | `01_arch_step_05_bounded_context_subdomains.md` | 已完成 |
| Step 6 | 容器 / 部署架构 | `01_arch_step_06_container_deployment.md` | 已完成 |
| Step 7 | 依赖方向与层间约束 | `01_arch_step_07_dependency_direction.md` | 已完成 |
| Step 8 | 数据所有权与一致性策略 | `01_arch_step_08_data_ownership_consistency.md` | 已完成 |
| Step 9 | 关键交互与通信方式 | `01_arch_step_09_interactions_communication.md` | 已完成 |
| Step 10 | 关键技术选型 | `01_arch_step_10_technology_choices.md` | 已完成 |
| Step 11 | 备选方案与取舍 | `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 |
| Step 12 | 横切关注点 | `01_arch_step_12_cross_cutting_concerns.md` | 已完成 |
| Step 13 | 演进路线 | `01_arch_step_13_evolution_path.md` | 已完成 |
| Step 14 | 风险与待确认事项 | `01_arch_step_14_risks_open_questions.md` | 已完成 |
| Step 15 | ADR 与需求追溯 | `01_arch_step_15_adr_traceability.md` | 已完成 |
| Step 16 | 整理正式文档 | `01_arch_step_16_formal_document_assembly.md` | 已完成 |

---

## 5. 当前结论

Step 1 ~ Step 15 已完成,当前已收敛到以下架构主线:

- `L1-governance` 是 Gate / Decision、Policy effective fact、Control / AIIA / SoA governance conclusion、Nonconformity corrective loop、governance traceability 和 handoff coordination 的治理真相域。
- `L1-governance` 不拥有 external standard / evidence / artifact / method / runtime / workspace / observability / archive 正文,只通过 ref、snapshot、safe summary、marker、derived view 和 handoff 与外部协作。
- Policy / shared rules 归 Governance,低 scope policy、项目配置、runtime 默认值或 timeout fallback 不得覆盖组织级 shared rules。
- report、dashboard、external GRC export、reconciliation、archive preparation 和 projection rebuild 只能消费或派生 Governance truth,不得反写真相。
- 同步成功只表示核心治理事实成立、拒绝、挂起或失败,不表示 runtime cache、report、external GRC、observability 或 archive handoff 已完成。
- 除 `L0-core` 外,非 core sibling repo 不得成为 `L1-governance` 编译期业务依赖;跨仓协作通过运行期接缝、事件、ref、snapshot、safe summary 或 handoff 承接。

Step 14 已明确 API / Command / Query / Event / Job / DTO、对象 schema、状态集、迁移规则、产品承载、容量数字和跨仓交接 schema 等仍是后续文档的待确认事项,不阻塞 Step 15 / Step 16,但会阻塞对应详细设计或实现 boundary 自行补真相源。

Step 15 已把 C-GOV 核心闭环、FR-GOV 功能、BR-GOV 规则、数据归属、验收否决项、架构风险与已收敛架构承接结果建立追溯关系,并形成 ADR 决策候选索引。当前没有正式 `L1-governance` 专项 ADR 文件;Step 15 只记录候选索引,不伪造已评审 ADR 编号。

---

## 6. 下一步

Step 16 已完成。下一步只做校验、审查和提交:确认正式文档与 Step 1 ~ Step 16 中间产物一致,检查无未完成占位,运行 diff check,并按项目边界单独提交 L1-governance 01 架构设计成果。

后续若进入 02 概要设计,必须重新按概要设计 SOP 从 Step 1 开始,不得在 01 架构任务中提前补概要设计、详细设计或实现结论。
