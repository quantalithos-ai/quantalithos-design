# Step 14. 整理正式概要设计文档

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 14
> 回填章节: `02-概要设计.md` 全文
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 ~ Step 13 已确认的 `L1-artifact` 概要设计结论按 `standards/document/概要设计书写规范.md` 的 14 章正式结构重组为 `projects/L1-artifact/02-概要设计.md`。

本步只做重组、压缩、润色、术语统一和交叉引用补齐,不新增未经讨论的新概要结论,不把详细设计层内容、配置项清单、测试方案、实施 boundary 或历史技术假设补进正式概要设计。

---

## 2. 正式概要设计文档重组结论

| 正式章节 | 主要来源 | 重组方式 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 摘录上游承接、历史材料降级和不再重答的边界 |
| §2 本次设计目标与范围 | Step 2 | 摘录设计目标、非范围和当前设计深度 |
| §3 约束条件 | Step 3 | 摘录结构性约束表并压缩说明 |
| §4 代码主体框架总览 | Step 4 | 摘录代码主体骨架、实现分层和分层图 |
| §5 主要组成部分、职责与边界 | Step 5 | 摘录 10 个主要组成部分和交互图 |
| §6 关键对象轮廓 | Step 6 | 摘录关键对象类别表和代表对象说明,完整对象骨架保留在附录中间产物 |
| §7 API / 接口骨架 | Step 7 | 摘录五类接口分类和代表接口组 |
| §8 关键处理流 / 重要函数数据流 | Step 8 | 摘录关键流族和通用读写路径 |
| §9 状态定义与状态流转 | Step 9 | 摘录 8 组状态机、状态传播图和红线迁移 |
| §10 异常与边界场景轮廓 | Step 10 | 摘录关键异常表和边界图 |
| §11 配置影响轮廓 | Step 11 | 摘录配置影响轮廓和禁止配置化边界 |
| §12 详细设计承接清单 | Step 12 | 摘录承接清单和概要回退规则 |
| §13 设计风险与待确认事项 | Step 13 | 摘录风险表、待确认表和进入实现前的门禁说明 |
| §14 参考 | Step 14 | 列出实际使用材料及用途 |

正式文档没有机械粘贴全部中间产物。对象字段骨架、完整状态表、接口全集、异常细分和配置实现方向仍保留在 `design-calibration/02_hld_step_*` 文件中作为延伸阅读。

---

## 3. 章节回填结论

| 中间产物 | 已回填章节 | 回填策略 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | §1 | 保留上游承接、历史材料降级和本文边界 |
| `02_hld_step_02_goals_scope.md` | §2 | 保留目标、非范围和深度控制 |
| `02_hld_step_03_constraints.md` | §3 | 保留结构性约束,删去重复诊断 |
| `02_hld_step_04_code_subject_framework.md` | §4 | 保留代码主体骨架和实现分层图 |
| `02_hld_step_05_components_boundary.md` | §5 | 保留 10 个主要组成部分总表和交互图 |
| `02_hld_step_06_key_objects*.md` | §6 | 保留关键对象类别总表和代表对象摘要 |
| `02_hld_step_07_api_interface_skeleton.md` | §7 | 保留接口分类表和代表接口组 |
| `02_hld_step_08_processing_flows.md` | §8 | 保留流族总表和通用路径规则 |
| `02_hld_step_09_state_machine.md` | §9 | 保留状态组表、传播图和红线迁移 |
| `02_hld_step_10_exceptions_boundaries.md` | §10 | 保留关键异常表和边界图 |
| `02_hld_step_11_configuration_impact.md` | §11 | 保留配置影响轮廓和禁止配置化边界 |
| `02_hld_step_12_detailed_design_handoff.md` | §12 | 保留承接清单和回退规则 |
| `02_hld_step_13_risks_open_questions.md` | §13 | 保留风险 / 待确认拆分和实现前阻塞说明 |

---

## 4. 术语统一结论

| 术语 | 统一口径 |
|---|---|
| `ArtifactFact` | 表达正式制品事实主锚点,不等同附件、URL、对象存储条目或下游展示卡片 |
| `ArtifactContentFactContext` | 表达“正文真相归 Artifact,正文来源可在外部”的内容事实语境 |
| `ArtifactVersion` | 表达正式版本锚点,不等同 current latest、自动化重算结果或消费侧当前态 |
| `ArtifactLineageLink` | 表达正式来源、依赖、替代和影响关系,不等同 trace、graph query 或 report 推断 |
| `ArtifactBaseline` | 表达正式冻结版本集合,不等同治理裁决、发布说明、项目状态或归档包 |
| `ArtifactConsumptionBackref` | 表达正式消费回指 truth,不允许藏在 Query、SDK 或下游私有状态中 |
| `ArtifactDerivedViewState` | 表达只读派生 freshness / rebuilding / unavailable 状态,不反写真相 |
| `ExternalReferenceResolutionState` | 表达外部来源解析、stale、failed 和 degraded 状态,不拥有外部 truth |

---

## 5. 交叉引用结论

- 每个正式章节开头都保留具体 `design-calibration` 校准来源块。
- Step 6 的 6 个对象附录不全文粘贴进正式 §6,而是作为延伸阅读保留。
- Step 13 的待确认事项在正式文档中保持挂起状态,没有被润色成已确认结论。
- `projects/L1-artifact/02-概要设计.md` 已从旧“新人解释 / 术语词典 / 存储心智”结构彻底重建为 14 章概要设计主链。

---

## 6. 参考材料表

| 参考材料 | 用途 |
|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | 生成流程和 Step 1~14 门禁 |
| `standards/document/概要设计书写规范.md` | 正式章节主链、校准来源块和图表约束 |
| `standards/document/设计文档讨论中间产物规范.md` | 项目台账、flow、Step 中间产物和恢复顺序约束 |
| `projects/L1-artifact/00-需求文档.md` | 需求边界、truth ownership、核心能力闭环和验收红线 |
| `projects/L1-artifact/01-架构设计.md` | 架构边界、依赖方向、数据所有权、一致性、交互方式和产品中立性 |
| `projects/L1-artifact/design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_13_risks_open_questions.md` | 正式概要设计各章的校准来源 |
| `projects/L1-governance/02-概要设计.md` | 正式概要设计章节装配样式参考 |

---

## 7. 进入下一步条件

- `projects/L1-artifact/02-概要设计.md` 已按 14 章正式结构重建。
- 每个正式章节都有具体校准来源块。
- 已确认结论都已落入对应正式章节。
- 未闭环项仍保留在 §13,没有被整理成定论。
- 没有新增未经 Step 1~13 讨论的新概要结论。
- 下一步可在用户确认后进入 `03-详细设计.md` 讨论流程。
