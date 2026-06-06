# Step 11. 数据需求与数据归属

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 11
> 回填章节: `00-需求文档.md` §11 数据需求与数据归属
> 生成日期: 2026-06-05

---

## 1. 本步目标

明确 `L1-process` 在需求层拥有哪些过程执行事实真相、哪些只是外部快照、哪些只是引用、哪些正文绝不能保存。本步不写字段清单、数据库表、索引、缓存、事务、outbox / projection / rebuild、repo / service / port、DDL、保留期或归档实现策略。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Process 是过程执行真相仓 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定上游 / 下游依赖和禁止编译期依赖 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定功能能力需要的数据支撑 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定禁止保存正文和相邻仓边界规则 |
| `projects/L1-process/00-需求文档.md` §9 | 旧版数据需求 | 提取 ProcessTemplate / Profile / Instance / Activity / Token / Checkpoint 等数据线索 |
| `projects/L1-process/02-概要设计.md` §6~§7 | 旧版主流程和数据关系 | 提取运行时索引、裁剪语境、实例运行、等待、恢复和投影视图线索 |

---

## 3. SOP 问题回答

### 3.1 哪些数据由本仓拥有真相？

`L1-process` 拥有过程执行事实本身的真相:

| 真相数据 | 原因 |
|---|---|
| ProcessTemplate runtime index / 运行时过程形态 | method-library 定义进入 process 后的执行索引和运行语境归 Process |
| ProcessProfile / 项目过程裁剪语境 | 项目采用的可执行过程形态和裁剪语境归 Process |
| ProcessInstance | 项目过程运行事实主语归 Process |
| Activity 过程节点执行事实 | 过程节点、承担语境和推进位置归 Process |
| Token / Gateway 流控位置事实 | 过程流控和当前位置归 Process |
| waiting gate / pause context | 过程等待意图、等待原因和恢复语境归 Process |
| Checkpoint / recovery fact | Instance 级恢复连续性事实归 Process |
| process timing / stage / rhythm fact | planning、review、retro、stage 等过程节奏事实归 Process |
| process projection source truth / audit trail | Process 关键变化的追溯事实归 Process |

### 3.2 哪些数据只是快照？

快照数据来自外部真相仓,Process 可为稳定消费或规则判断保留摘要,但不形成独立真相:

| 快照数据 | 上游真相 |
|---|---|
| 方法定义目录级快照 | `L3-method-library` |
| 项目 / 工作语境摘要 | `L1-work` |
| actor / member 可承担性摘要 | `L1-identity` |
| governance decision / policy 摘要 | `L1-governance` |
| artifact / evidence / baseline 摘要 | `L1-artifact` |
| runtime feedback 摘要 | `L2-runtime` / `L2-member-service` |
| conversation context 摘要 | `L1-conversation` |
| process read model / timeline / progress summary | Process 真相派生,不是独立业务真相 |

### 3.3 哪些数据只是引用？

引用数据只保存外部对象的引用关系,不拥有正文或生命周期:

| 引用数据 | 外部对象 |
|---|---|
| ProcessTemplateDefRef / TaskDefinitionRef / RoleDefinitionRef / WorkProductDefinitionRef / ViewProfileRef | `L3-method-library` |
| ProjectRef / ProjectMemberRef / WorkItemRef / IterationRef / ProcessTimeboxRef | `L1-work` |
| ActorRef / GlobalMemberRef | `L1-identity` / `L0-core` |
| GateRef / PolicyRef / DecisionRef / ApprovalRef | `L1-governance` |
| ArtifactRef / EvidenceRef / BaselineRef / ImplementationPlanRef | `L1-artifact` |
| RuntimeExecutionRef / FeedbackRef / MemberServiceRunRef | `L2-runtime` / `L2-member-service` |
| ConversationSpaceRef / ConversationFactRef / TraceContextRef / HandoffRef | `L1-conversation` |
| ObservabilityRef / ArchiveRef | `L4-observability` / `L4-archive` |

### 3.4 哪些内容绝不能保存正文？

| 禁止保存正文 | 原因 |
|---|---|
| ProcessTemplateDef / TaskDefinition / Method Content 正文 | method-library 定义真相不归 Process |
| Project / ProjectMember / Backlog / WorkItem / Iteration 正文 | work 真相不归 Process |
| Gate / Policy / Control / Approval / decision 正文 | governance 决策真相不归 Process |
| Artifact / evidence / baseline / ImplementationPlan / Archive Package 正文 | artifact / archive 正文不归 Process |
| agent loop、tool invocation、runtime plan item progress、execution log、runtime micro-checkpoint 正文 | runtime 执行真相不归 Process |
| GlobalMember / actor profile / role lifecycle 正文 | identity 真相不归 Process |
| conversation fact、聊天消息、participant scope、visibility、trace / handoff 正文 | conversation 真相不归 Process |
| workspace dashboard、跨域聚合视图、reasoning trace、metrics、audit ledger 正文 | workspace / observability 真相不归 Process |

### 3.5 这些数据在需求层面的生命周期口径是什么？

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 从正式建立到正式终止,形成 Process 仓内完整需求层生命周期 |
| 快照数据 | 随上游正式真相变化而更新,不形成独立真相生命周期 |
| 引用数据 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期 |
| 禁止保存正文 | 不进入 Process 仓生命周期 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §9.1 | 把 ProcessTemplate、ProcessProfile、ProcessInstance、Activity、Token、Checkpoint 列为核心实体 | 方向有价值,但以对象 / 状态表呈现,缺少快照、引用和禁止正文 | 保留为真相数据线索,补四类归属 |
| `00-需求文档.md` §9.1 | ProcessTemplate 写为聚合根 | 容易覆盖 method-library 的 ProcessTemplateDef 定义真相 | 改成 ProcessTemplate runtime index / 运行时过程形态 |
| `00-需求文档.md` §9.2 | 数据关系图写 Template -> Profile -> Instance -> current_activities / tokens / gates / checkpoint chain | 有关系线索,但偏字段和对象关系 | 转译为需求层真相数据,不写字段关系 |
| `00-需求文档.md` §9.3 | 写 active / cold / archive、checkpoint inline / object storage 等保留策略 | 滑入存储实现和归档策略 | 后移配置 / 架构 / 实施;本步只写需求层生命周期口径 |
| `00-需求文档.md` §10.1 | PostgreSQL / object storage 写成外部系统依赖 | 存储实现不属于数据归属 | 后移架构 / 配置 / 实施 |
| 旧文档整体 | checkpoint、trace、runtime feedback、artifact outputs、workitem completion policy 容易混成 Process 正文 | 会打穿相邻仓边界 | 分别落入真相数据、快照、引用和禁止保存正文 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据表达 | 核心业务实体 + 数据关系 + 保留策略 | 真相 / 快照 / 引用 / 禁止保存正文 | 对齐需求规范 4.11 |
| ProcessTemplate | 容易被读作定义真相 | 运行时过程形态 / runtime index 真相归 Process,定义正文不归 Process | 保护 method-library / Process 边界 |
| Checkpoint | 写成链和存储策略 | 写成 Instance 级恢复连续性真相,不写存储细节 | 保留恢复价值,不提前设计 |
| 投影视图 | timeline / progress summary 容易成为数据实体 | 明确是 Process 真相派生快照,不是独立业务真相 | 防止读模型变写源 |
| 外部正文 | 多处通过 outputs / workitem / gate / runtime 语境进入 Process | 明确只可快照或引用,正文禁止保存 | 防止相邻仓正文进入 Process |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧数据实体表 | 快,能覆盖主要对象 | 漏掉快照 / 引用 / 禁止正文,且 ProcessTemplate 口径危险 | 不采用 |
| 方案 B: 按四类数据归属重写 | 能防止相邻仓正文进入 Process | 表格更多,需要后续详细设计再落字段 | 采用 |
| 方案 C: 只写 Process 真相数据 | 简洁 | 无法约束外部快照、引用和禁止正文 | 不采用 |
| 方案 D: 直接写字段级归属和保留期 | 接近实现 | 违反需求层粒度,容易和详细设计 / 配置冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 ProcessTemplate 作为 Process 定义真相数据?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Process 拥有 ProcessTemplate 定义真相 | Process 会越界成为 method-library |
| 方案 B | Process 只拥有 ProcessTemplate runtime index / 运行时过程形态 | 守住 method-library 定义真相 |

推荐方案 B。原因是 Step 2、Step 10 已明确定义正文归 method-library。

#### 是否把 checkpoint 外置对象和归档策略写入本步?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写 inline / object storage / archive 保留策略 | 会提前确认存储实现和配置 |
| 方案 B | 只写 checkpoint / recovery 是 Instance 级恢复连续性真相 | 保留需求边界,实现后移 |

推荐方案 B。原因是 Step 11 不写存储、保留期或归档机制。

#### 是否保存 artifact / runtime / conversation 正文?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 保存正文以方便追溯 | Process 会越界进入 artifact、runtime、conversation |
| 方案 B | 只保存引用和必要摘要,正文禁止保存 | 保留追溯价值,同时守住正文归属 |

推荐方案 B。原因是 Process 需要过程语境,不拥有相邻正文。

---

## 7. 结构化中间产物

### 7.1 数据项分类结论

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| ProcessTemplate runtime index / 运行时过程形态 | 真相数据 | ProcessTemplate runtime index 由 Process 拥有正式运行时真相。 | 从正式同步 / 形成到显式替换或停止使用,形成 Process 仓内生命周期。 |
| ProcessProfile / 项目过程裁剪语境 | 真相数据 | ProcessProfile 由 Process 拥有正式过程裁剪和项目采用语境真相。 | 随项目采用、调整、切换或停止使用而变化。 |
| ProcessInstance | 真相数据 | ProcessInstance 由 Process 拥有正式项目过程运行事实真相。 | 从正式开始到正式结束、取消或失败形成 Process 生命周期。 |
| Activity 过程节点执行事实 | 真相数据 | Activity 过程节点执行事实由 Process 拥有正式真相。 | 随节点进入、推进、等待、完成或终止而变化。 |
| Token / Gateway 流控位置事实 | 真相数据 | Token / Gateway 流控位置事实由 Process 拥有正式真相。 | 随过程推进、分支、合流、消费或终止而变化。 |
| waiting gate / pause context | 真相数据 | waiting gate / pause context 由 Process 拥有等待意图和暂停语境真相。 | 随等待开始、外部依据返回、恢复或终止而变化。 |
| Checkpoint / recovery fact | 真相数据 | Checkpoint / recovery fact 由 Process 拥有 Instance 级恢复连续性真相。 | 随关键推进、暂停、恢复和维护动作形成或更新。 |
| process timing / stage / rhythm fact | 真相数据 | process timing / stage / rhythm fact 由 Process 拥有过程节奏真相。 | 随过程阶段、节奏节点和运行语境变化而变化。 |
| process audit / traceability record | 真相数据 | Process 关键变化的追溯事实由 Process 拥有真相。 | 随关键业务变化形成,不被读模型替代。 |
| 方法定义目录级快照 | 快照数据 | method-library 定义正文不属于 Process,但 Process 可保留稳定消费所需目录级快照。 | 随 method-library 上游正式真相变化而更新,不形成独立真相生命周期。 |
| 项目 / 工作语境摘要 | 快照数据 | work 项目工作真相不属于 Process,但 Process 可保留过程绑定和解释所需摘要。 | 随 work 上游正式真相变化而更新,不形成独立真相生命周期。 |
| actor / member 可承担性摘要 | 快照数据 | identity 成员正式真相不属于 Process,但 Process 可保留承担判断所需摘要。 | 随 identity 上游正式真相变化而更新,不形成独立真相生命周期。 |
| governance decision / policy 摘要 | 快照数据 | governance 决策真相不属于 Process,但 Process 可保留等待恢复判断所需摘要。 | 随 governance 上游正式真相变化而更新,不形成独立真相生命周期。 |
| artifact / evidence / baseline 摘要 | 快照数据 | artifact / evidence 正文不属于 Process,但 Process 可保留追溯解释所需摘要。 | 随 artifact 上游正式真相变化而更新,不形成独立真相生命周期。 |
| runtime feedback 摘要 | 快照数据 | runtime 执行真相不属于 Process,但 Process 可保留过程反馈判断所需摘要。 | 随 runtime / member-service 上游正式真相变化而更新,不形成独立真相生命周期。 |
| conversation context 摘要 | 快照数据 | conversation 正文不属于 Process,但 Process 可保留过程上下文摘要。 | 随 conversation 上游正式真相变化而更新,不形成独立真相生命周期。 |
| process read model / timeline / progress summary | 快照数据 | process read model 由 Process 真相派生,但不形成新的业务真相。 | 随 Process 正式真相变化而更新,不形成独立真相生命周期。 |
| 方法定义相关 Ref | 引用数据 | Process 只保存方法定义引用关系,不拥有定义正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| work 相关 Ref | 引用数据 | Process 只保存项目工作引用关系,不拥有工作正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| identity 相关 Ref | 引用数据 | Process 只保存成员和 actor 引用关系,不拥有身份正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| governance 相关 Ref | 引用数据 | Process 只保存治理结论引用关系,不拥有决策正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| artifact / evidence / baseline / implementation plan Ref | 引用数据 | Process 只保存产物、证据、基线和计划引用关系,不拥有外部正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| runtime / member-service Ref | 引用数据 | Process 只保存执行反馈和运行语境引用,不拥有运行正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| conversation / trace / handoff Ref | 引用数据 | Process 只保存对话和 trace / handoff 引用,不拥有 conversation 正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| observability / archive Ref | 引用数据 | Process 只保存观测或归档引用,不拥有观测正文或归档正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| 外部正文集合 | 禁止保存正文 | 相邻仓正文不属于 Process 真相范围,本仓不得保存其正文。 | 不进入 Process 仓生命周期。 |

### 7.2 数据类型结论

| 数据类型 | 数据项 |
|---|---|
| 真相数据 | ProcessTemplate runtime index / 运行时过程形态;ProcessProfile / 项目过程裁剪语境;ProcessInstance;Activity 过程节点执行事实;Token / Gateway 流控位置事实;waiting gate / pause context;Checkpoint / recovery fact;process timing / stage / rhythm fact;process audit / traceability record |
| 快照数据 | 方法定义目录级快照;项目 / 工作语境摘要;actor / member 可承担性摘要;governance decision / policy 摘要;artifact / evidence / baseline 摘要;runtime feedback 摘要;conversation context 摘要;process read model / timeline / progress summary |
| 引用数据 | 方法定义相关 Ref;work 相关 Ref;identity 相关 Ref;governance 相关 Ref;artifact / evidence / baseline / implementation plan Ref;runtime / member-service Ref;conversation / trace / handoff Ref;observability / archive Ref |
| 禁止保存正文 | method-library 定义正文;work 正文;governance decision 正文;artifact / evidence / baseline / implementation plan 正文;runtime 执行正文;identity 正文;conversation 正文;workspace / observability / archive 正文 |

### 7.3 归属说明结论

| 归属类别 | 结论 |
|---|---|
| Process 真相 | Process 只拥有过程执行事实真相,包含运行时过程形态、项目过程裁剪语境、过程实例、过程节点、流控位置、等待语境、恢复连续性、过程节奏和追溯记录。 |
| 外部快照 | Process 可保存必要摘要以支撑稳定消费、运行判断和追溯解释,但快照不得成为独立真相。 |
| 外部引用 | Process 可保存对相邻仓对象的引用关系,但不得负责外部正文生命周期。 |
| 禁止正文 | 所有相邻仓正文、运行时执行正文、观测正文和归档正文都不得进入 Process 真相范围。 |

### 7.4 生命周期口径结论

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 在 Process 内由正式业务变化建立、变化和终止,形成完整 Process 生命周期。 |
| 快照数据 | 随上游正式真相变化而更新,只服务稳定消费和判断,不形成独立生命周期。 |
| 引用数据 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| 禁止保存正文 | 不进入 Process 仓生命周期。 |

### 7.5 数据归属与规则映射结论

| 规则 | 数据归属支撑 |
|---|---|
| BR-PROC-001~BR-PROC-007 | 通过真相数据范围保护运行时过程形态、ProcessProfile、ProcessInstance、Activity / Token / Gateway、waiting gate、checkpoint / recovery 和消费面边界 |
| BR-PROC-008~BR-PROC-014 | 通过禁止正文和快照 / 引用分类防止相邻仓内容隐式写入 Process 真相 |
| BR-PROC-015~BR-PROC-020 | 通过真相数据生命周期要求关键变化显式发生 |
| BR-PROC-021~BR-PROC-028 | 通过禁止保存正文和引用数据分类保护相邻仓边界 |
| BR-PROC-029~BR-PROC-032 | 通过外部引用、快照和审计 / 追溯真相支撑治理、等待、恢复、对账和维护解释 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §11。正式文档可摘录本文件 §7.1~§7.5 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 11. 数据需求与数据归属

> 校准来源:
> - `design-calibration/00_req_step_11_data_ownership.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“数据归属与规则映射结论”小节,了解本章如何用数据归属承接边界规则。

本文采用 `design-calibration/00_req_step_11_data_ownership.md` §7 的数据归属结论。`L1-process` 只拥有过程执行事实真相;相邻仓数据只可作为快照或引用进入;method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 的正文不得保存到 Process。

正式数据归属表应摘录:

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
| Q-001 | 是否把 ProcessTemplate 作为 Process 定义真相数据 | 是 | 只拥有 ProcessTemplate runtime index / 运行时过程形态 | 推荐 B。原因是 Process 不拥有 method-library 定义正文 |
| Q-002 | 是否把 checkpoint 外置对象和归档策略写入本步 | 写入 inline / object storage / archive 策略 | 只写 checkpoint / recovery 是 Instance 级恢复连续性真相 | 推荐 B。原因是 Step 11 不写存储和归档机制 |
| Q-003 | 是否保存 artifact / runtime / conversation 正文 | 保存正文 | 只保存引用和必要摘要,正文禁止保存 | 推荐 B。原因是 Process 需要过程语境,不拥有相邻正文 |
| Q-004 | 是否把 read model / timeline 作为独立真相数据 | 是 | 作为派生快照 / 消费数据 | 推荐 B。原因是读模型不得成为写源 |

当前建议:接受上述推荐后进入 Step 12。

---

## 10. 进入下一步条件

- 已明确真相数据、快照数据、引用数据和禁止保存正文四类数据。
- 每条数据项都有数据类型、归属说明和生命周期口径。
- 已明确 method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 等外部正文不得进入 Process。
- 已说明数据归属如何支撑 Step 10 的边界规则。
- 未写字段清单、表结构、索引、事务、缓存、outbox / projection / rebuild、repo / service / port、DDL、保留期或归档实现策略。
