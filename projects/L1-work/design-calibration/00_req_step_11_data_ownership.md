# Step 11. 数据需求与数据归属

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 11
> 回填章节: `00-需求文档.md` §11 数据需求与数据归属
> 生成日期: 2026-06-02

---

## 1. 本步目标

明确 `L1-work` 在需求层拥有哪些项目工作事实真相、哪些只是外部快照、哪些只是引用、哪些正文绝不能保存。本步不写字段清单、数据库表、索引、缓存、事务、outbox / projection / rebuild、repo / service / port 或 DDL。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Work 是项目工作事实真相仓 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定上游 / 下游依赖和禁止编译期依赖 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定功能能力需要的数据支撑 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定禁止保存正文和相邻仓边界规则 |
| `projects/L1-work/00-需求文档.md` §9 | 旧版数据需求 | 提取 Project、ProjectMember、Backlog、WorkItem、Iteration 等数据线索 |
| `projects/L1-work/02-概要设计.md` §10.3 | 旧版数据所有权矩阵 | 提取 Work 真相、artifact / runtime 引用等归属线索 |

---

## 3. SOP 问题回答

### 3.1 哪些数据由本仓拥有真相？

`L1-work` 拥有项目工作事实本身的真相：

| 真相数据 | 原因 |
|---|---|
| Project | 项目工作事实的主语归 Work |
| ProjectMember | GlobalMember 在项目内的承担事实归 Work |
| Backlog 正式工作全集 | 项目正式待办全集归 Work |
| WorkItem | 团队协作级正式工作事实归 Work |
| child WorkItem | 协作级正式子任务归 Work |
| 工作依赖 / 阻塞关系 | 正式工作之间的依赖、阻塞和解除依据归 Work |
| Iteration 承诺子集 | 从 Backlog 中选择出的当前承诺范围归 Work |
| promote 结果与来源引用关系 | plan item 升级为 child WorkItem 后的正式化结果归 Work |
| 工作事实审计 / 追溯记录 | Work 关键变化的追溯事实归 Work |

### 3.2 哪些数据只是快照？

快照数据来自外部真相仓，Work 可为稳定消费或规则判断保留摘要，但不形成独立真相：

| 快照数据 | 上游真相 |
|---|---|
| ProjectMember 可承担性快照 | `L1-identity` |
| 方法定义目录级快照 | `L3-method-library` |
| planning / review / timing 摘要 | `L1-process` |
| 治理结论摘要 | `L1-governance` |
| 完成依据摘要 | `L1-artifact` |
| promote 来源摘要 | `L1-artifact` / `L2-runtime` |
| conversation context 摘要 | `L1-conversation` |
| 消费视图 / 看板 / 任务摘要 | Work 真相派生，不是独立业务真相 |

### 3.3 哪些数据只是引用？

引用数据只保存外部对象的引用关系，不拥有正文或生命周期：

| 引用数据 | 外部对象 |
|---|---|
| GlobalMemberRef / ActorRef | `L1-identity` / `L0-core` |
| TaskDefinitionRef / WorkProductDefinitionRef / ProcessTemplateDefRef / ViewProfileRef | `L3-method-library` |
| ProcessProfileRef / ProcessInstanceRef / ActivityRef | `L1-process` |
| GateDecisionRef / PolicyRef / ApprovalRef | `L1-governance` |
| ArtifactRef / EvidenceRef / BaselineRef | `L1-artifact` |
| ImplementationPlanRef / PlanItemRef | `L1-artifact` / `L2-runtime` 边界 |
| ConversationSpaceRef / ConversationFactRef / TraceContextRef / HandoffRef | `L1-conversation` |
| RuntimeExecutionRef / PromoteRequestRef | `L2-runtime` |
| ArchiveRef | `L4-archive` |

### 3.4 哪些内容绝不能保存正文？

| 禁止保存正文 | 原因 |
|---|---|
| GlobalMember / Role / actor profile 正文 | identity 真相不归 Work |
| conversation fact、聊天消息、trace / handoff 正文 | conversation 真相不归 Work |
| TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile 正文 | method-library 定义不归 Work |
| Activity、ProcessInstance、checkpoint、流程执行正文 | process 真相不归 Work |
| Gate、Policy、Control、Approval 正文 | governance 决策真相不归 Work |
| Artifact、evidence、baseline、ImplementationPlan 正文 | artifact 真相不归 Work |
| agent loop、tool invocation、plan item progress、execution step 正文 | runtime 真相不归 Work |
| PersonalWorkspace / ProjectWorkspace dashboard 正文 | workspace 聚合视图不归 Work |

### 3.5 这些数据在需求层面的生命周期口径是什么？

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 从正式建立到正式终止，形成 Work 仓内完整生命周期 |
| 快照数据 | 随上游正式真相变化而更新，不形成独立真相生命周期 |
| 引用数据 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期 |
| 禁止保存正文 | 不进入 Work 仓生命周期 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §9.1 | 把 Project、ProjectMember、Backlog、WorkItem、Iteration 列为核心实体 | 方向正确，但以对象 / 生命周期表呈现，缺少快照、引用和禁止正文 | 保留为真相数据线索，补四类归属 |
| `00-需求文档.md` §9.2 | Project 数据关系图包含 process_profile_id | 容易把外部对象引用写成本仓真相字段 | 转译为引用数据，不写字段 |
| `00-需求文档.md` §9.3 | 写 active / archived / dissolved 的保留策略 | 滑入归档实现与生命周期细节 | 只保留需求层生命周期口径 |
| `02-概要设计.md` §10.3 | 数据所有权矩阵区分 Work 真相与 ImplementationPlan ref | 有价值，但仍偏概要设计 | 提升为需求层归属结论 |
| `02-概要设计.md` §11 | done 判据、promote、trace 等横切关注点含数据线索 | 有价值但混在横切关注点 | 分别落入引用数据和禁止保存正文 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据表达 | 核心业务实体 + 数据关系 | 真相 / 快照 / 引用 / 禁止保存正文 | 对齐需求规范 4.11 |
| ProjectMember | 容易只写为实体 | 明确只拥有项目内承担事实，不拥有 GlobalMember 正文 | 保护 identity / Work 边界 |
| ImplementationPlan | 容易挂到 WorkItem 下混成 Work 数据 | 只保存引用或 promote 来源关系，不保存正文 | 保护 artifact / runtime 边界 |
| 看板 / projection | 容易成为数据实体 | 明确是 Work 真相派生，不是独立业务真相 | 防止读模型变写源 |
| 生命周期 | 写具体状态和保留策略 | 只写需求层生命周期口径 | 避免提前进入详细设计和运维 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧数据实体表 | 快，能覆盖主要对象 | 漏掉快照 / 引用 / 禁止正文，边界风险高 | 不采用 |
| 方案 B: 按四类数据归属重写 | 能防止相邻仓正文进入 Work | 表格更多，需要后续详细设计再落字段 | 采用 |
| 方案 C: 只写 Work 真相数据 | 简洁 | 无法约束外部快照、引用和禁止正文 | 不采用 |
| 方案 D: 直接写字段级归属 | 接近实现 | 违反需求层粒度，容易和详细设计冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 ImplementationPlan 作为 Work 真相数据？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Work 拥有 ImplementationPlan 真相 | Work 会越界成为执行计划仓 |
| 方案 B | Work 只保存 ImplementationPlan / PlanItem 引用和 promote 后的正式 Work 结果 | 守住 artifact / runtime 边界 |

推荐方案 B。原因是 Step 2、Step 10 已明确 Work 只处理 promote 边界，不拥有执行计划正文。

#### 是否把看板 / 投影视图作为真相数据？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为 Work 真相数据 | 读模型可能反向污染业务真相 |
| 方案 B | 作为派生快照 / 消费数据，不形成独立真相生命周期 | 保护写真相和消费面边界 |

推荐方案 B。原因是 Step 10 已明确读模型、投影、对账结果不得成为新的业务真相写源。

#### 是否保存 artifact / evidence 正文？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 保存正文以方便 done 判据 | Work 会越界进入 artifact 仓 |
| 方案 B | 只保存引用和必要摘要，正文禁止保存 | 保留完成依据可追溯，同时守住正文归属 |

推荐方案 B。原因是 Work 需要完成依据，但不拥有外部正文。

---

## 7. 结构化中间产物

### 7.1 数据项分类结论

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| Project | 真相数据 | Project 由 Work 拥有正式项目工作主语真相。 | 从正式建立到正式终止，形成 Work 仓内完整生命周期。 |
| ProjectMember | 真相数据 | ProjectMember 由 Work 拥有项目内承担事实真相。 | 随项目内承担关系正式建立、变化和终止而变化。 |
| Backlog 正式工作全集 | 真相数据 | Backlog 正式工作全集由 Work 拥有正式真相。 | 随正式工作进入、变化或退出而变化。 |
| WorkItem | 真相数据 | WorkItem 由 Work 拥有团队协作级正式工作真相。 | 从正式建立到正式完成、取消或终止形成 Work 生命周期。 |
| child WorkItem | 真相数据 | child WorkItem 由 Work 拥有协作级正式子任务真相。 | 随正式拆分、升级、完成或终止而变化。 |
| 工作依赖 / 阻塞关系 | 真相数据 | 正式工作之间的依赖、阻塞和解除依据由 Work 拥有真相。 | 随正式关系建立、变化或解除而变化。 |
| Iteration 承诺子集 | 真相数据 | Iteration 承诺子集由 Work 拥有正式真相。 | 随承诺范围正式形成、变化或关闭而变化。 |
| promote 结果与来源引用关系 | 真相数据 | promote 后的 child WorkItem 正式结果和来源引用关系由 Work 拥有真相。 | 随 promote 显式发生和后续正式工作变化而变化。 |
| 工作事实审计 / 追溯记录 | 真相数据 | Work 关键变化的追溯事实由 Work 拥有真相。 | 随关键业务变化形成，不被读模型替代。 |
| ProjectMember 可承担性快照 | 快照数据 | identity 成员正式真相不属于 Work，但 Work 可保留承担判断所需快照。 | 随 identity 上游正式真相变化而更新，不形成独立真相生命周期。 |
| 方法定义目录级快照 | 快照数据 | method-library 定义正文不属于 Work，但 Work 可保留稳定消费所需目录级快照。 | 随 method-library 上游正式真相变化而更新，不形成独立真相生命周期。 |
| planning / review / timing 摘要 | 快照数据 | process 节奏真相不属于 Work，但 Work 可保留触发背景摘要。 | 随 process 上游正式真相变化而更新，不形成独立真相生命周期。 |
| 治理结论摘要 | 快照数据 | governance 决策真相不属于 Work，但 Work 可保留规则判断所需摘要。 | 随 governance 上游正式真相变化而更新，不形成独立真相生命周期。 |
| 完成依据摘要 | 快照数据 | artifact / evidence 正文不属于 Work，但 Work 可保留完成判断所需摘要。 | 随 artifact 上游正式真相变化而更新，不形成独立真相生命周期。 |
| promote 来源摘要 | 快照数据 | runtime / artifact 执行计划真相不属于 Work，但 Work 可保留 promote 判断所需摘要。 | 随上游正式真相变化而更新，不形成独立真相生命周期。 |
| conversation context 摘要 | 快照数据 | conversation 正文不属于 Work，但 Work 可保留工作上下文摘要。 | 随 conversation 上游正式真相变化而更新，不形成独立真相生命周期。 |
| 消费视图 / 看板 / 任务摘要 | 快照数据 | 消费视图由 Work 真相派生，但不形成新的业务真相。 | 随 Work 正式真相变化而更新，不形成独立真相生命周期。 |
| GlobalMemberRef / ActorRef | 引用数据 | Work 只保存平台成员和 actor 引用关系，不拥有身份正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| 方法定义相关 Ref | 引用数据 | Work 只保存方法定义引用关系，不拥有定义正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| process 相关 Ref | 引用数据 | Work 只保存流程相关引用关系，不拥有流程正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| governance 相关 Ref | 引用数据 | Work 只保存治理结论引用关系，不拥有决策正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| artifact / evidence / baseline Ref | 引用数据 | Work 只保存完成依据引用关系，不拥有外部正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| ImplementationPlanRef / PlanItemRef | 引用数据 | Work 只保存执行计划来源引用，不拥有计划正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| conversation / trace / handoff Ref | 引用数据 | Work 只保存对话上下文引用，不拥有 conversation 正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| runtime / archive Ref | 引用数据 | Work 只保存运行或归档相关引用，不拥有运行正文或归档正文。 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| 外部正文集合 | 禁止保存正文 | 相邻仓正文不属于 Work 真相范围，本仓不得保存其正文。 | 不进入 Work 仓生命周期。 |

### 7.2 数据类型结论

| 数据类型 | 数据项 |
|---|---|
| 真相数据 | Project；ProjectMember；Backlog 正式工作全集；WorkItem；child WorkItem；工作依赖 / 阻塞关系；Iteration 承诺子集；promote 结果与来源引用关系；工作事实审计 / 追溯记录 |
| 快照数据 | ProjectMember 可承担性快照；方法定义目录级快照；planning / review / timing 摘要；治理结论摘要；完成依据摘要；promote 来源摘要；conversation context 摘要；消费视图 / 看板 / 任务摘要 |
| 引用数据 | GlobalMemberRef / ActorRef；方法定义相关 Ref；process 相关 Ref；governance 相关 Ref；artifact / evidence / baseline Ref；ImplementationPlanRef / PlanItemRef；conversation / trace / handoff Ref；runtime / archive Ref |
| 禁止保存正文 | identity 正文；conversation 正文；method-library 定义正文；process 正文；governance 正文；artifact / evidence / baseline / ImplementationPlan 正文；runtime 执行正文；workspace 聚合正文 |

### 7.3 归属说明结论

| 归属类别 | 结论 |
|---|---|
| Work 真相 | Work 只拥有项目工作事实真相，包含项目主语、项目内承担、正式工作全集、正式子任务、承诺子集、依赖阻塞、promote 后结果和追溯记录。 |
| 外部快照 | Work 可保存必要摘要以支撑稳定消费、规则判断和追溯解释，但快照不得成为独立真相。 |
| 外部引用 | Work 可保存对相邻仓对象的引用关系，但不得负责外部正文生命周期。 |
| 禁止正文 | 所有相邻仓正文和运行时执行正文都不得进入 Work 真相范围。 |

### 7.4 生命周期口径结论

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 在 Work 内由正式业务变化建立、变化和终止，形成完整 Work 生命周期。 |
| 快照数据 | 随上游正式真相变化而更新，只服务稳定消费和判断，不形成独立生命周期。 |
| 引用数据 | 随引用关系建立、变化或失效而变化，本仓不负责正文生命周期。 |
| 禁止保存正文 | 不进入 Work 仓生命周期。 |

### 7.5 数据归属与规则映射结论

| 规则 | 数据归属支撑 |
|---|---|
| BR-WORK-001~BR-WORK-006 | 通过真相数据范围保护 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和消费面边界 |
| BR-WORK-007~BR-WORK-011 | 通过禁止正文和快照 / 引用分类防止外部内容隐式写入 Work 真相 |
| BR-WORK-012~BR-WORK-016 | 通过真相数据生命周期要求关键变化显式发生 |
| BR-WORK-017~BR-WORK-024 | 通过禁止保存正文和引用数据分类保护相邻仓边界 |
| BR-WORK-025~BR-WORK-027 | 通过外部引用、快照和审计 / 追溯真相支撑治理、完成依据、阻塞和维护解释 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §11。正式文档可摘录本文件 §7.1~§7.5 的表格，不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 11. 数据需求与数据归属

> 校准来源：
> - `design-calibration/00_req_step_11_data_ownership.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“数据归属与规则映射结论”小节，了解本章如何用数据归属承接边界规则。

本文采用 `design-calibration/00_req_step_11_data_ownership.md` §7 的数据归属结论。`L1-work` 只拥有项目工作事实真相；相邻仓数据只可作为快照或引用进入；identity、conversation、method-library、process、governance、artifact、runtime、workspace 的正文不得保存到 Work。

正式数据归属表应摘录：

- `design-calibration/00_req_step_11_data_ownership.md` §7.1 数据项分类结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.2 数据类型结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.3 归属说明结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.4 生命周期口径结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.5 数据归属与规则映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 ImplementationPlan 作为 Work 真相数据 | 是 | 只保存引用和 promote 结果 | 推荐 B。原因是 Work 不拥有执行计划正文 |
| Q-002 | 是否把看板 / 投影视图作为真相数据 | 是 | 作为派生快照 / 消费数据 | 推荐 B。原因是读模型不得成为写源 |
| Q-003 | 是否保存 artifact / evidence 正文 | 保存正文 | 只保存引用和必要摘要，正文禁止保存 | 推荐 B。原因是 artifact 正文归 artifact |
| Q-004 | 是否把外部快照视为独立生命周期 | 是 | 否，随上游正式真相变化 | 推荐 B。原因是快照只服务稳定消费和判断 |

当前建议：接受上述推荐后进入 Step 12。

---

## 10. 进入下一步条件

- 已明确真相数据、快照数据、引用数据和禁止保存正文四类数据。
- 每条数据项都有数据类型、归属说明和生命周期口径。
- 已明确 `ImplementationPlan`、artifact / evidence、conversation、runtime 等外部正文不得进入 Work。
- 已说明数据归属如何支撑 Step 10 的边界规则。
- 未写字段清单、表结构、索引、事务、缓存、outbox / projection / rebuild、repo / service / port 或 DDL。
