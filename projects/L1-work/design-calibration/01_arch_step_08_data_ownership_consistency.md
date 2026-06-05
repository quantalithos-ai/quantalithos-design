# Step 8. 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 生成日期: 2026-06-02
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-work` 拥有哪些正式真相数据,哪些只是快照 / 投影数据,哪些只是引用关系数据,哪些正文 / 真相必须明确排除在本仓之外,并在此基础上定义强一致、最终一致、引用有效性和边界约束的一致性口径。

本步不写字段清单、表结构、DDL、缓存策略、索引设计、outbox、事务机制、事件 schema、重试实现、repository / service / adapter 或代码对象模型。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做、易混淆职责和边界红线 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心真相、支撑上下文和本地影子层 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供真相承载和派生承载的运行承接关系 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 提供依赖方向、倒置边界和禁止反向依赖 |
| `00_req_step_11_data_ownership.md` | 已完成 | 提供需求层真相 / 快照 / 引用 / 禁止保存正文结论 |
| 旧 `01-架构设计.md` §8 | 未按最新 SOP 校准 | 作为旧数据所有权、一致性、补偿和技术策略问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 哪些数据由本仓拥有真相？

`L1-work` 拥有的正式真相数据限于项目工作事实:Project、ProjectMember、Backlog 正式工作全集、WorkItem、child WorkItem、工作依赖 / 阻塞关系、Iteration 承诺子集、promote 结果与来源引用关系、工作事实审计 / 追溯记录。

这些数据共同回答“某个软件项目是否已经成为正式工作对象、谁在项目内承担工作、哪些工作属于正式协作级工作全集、哪些进入当前承诺范围、哪些工作之间存在依赖或阻塞、哪些外部计划步骤已经被正式升级、为什么发生关键变化”。

### 3.2 哪些数据只是快照 / 投影？

ProjectMember 可承担性快照、方法定义目录级快照、planning / review / timing 摘要、治理结论摘要、完成依据摘要、promote 来源摘要、conversation context 摘要、消费视图 / 看板 / 任务摘要都只是快照 / 投影数据。

快照 / 投影可以由本仓维护,用于稳定消费、规则判断、追溯解释、看板展示、对账或维护报告,但它们不得形成独立业务真相,也不得反向修改 Project、ProjectMember、WorkItem、child WorkItem 或 Iteration。

### 3.3 哪些数据只是引用关系？

GlobalMemberRef / ActorRef、方法定义相关 Ref、process 相关 Ref、governance 相关 Ref、artifact / evidence / baseline Ref、ImplementationPlanRef / PlanItemRef、conversation / trace / handoff Ref、runtime / archive Ref 都只是引用关系数据。

引用关系可以成为 Work 事实成立、完成、promote、追溯或归档交接的依据入口,但引用成立不代表外部正文、外部生命周期或外部决策真相转移给 Work。

### 3.4 哪些正文 / 真相本仓明确不拥有？

`L1-work` 明确不拥有 identity 正文、conversation 正文、method-library 定义正文、process 正文、governance 决策正文、artifact / evidence / baseline / ImplementationPlan 正文、runtime 执行正文、workspace 聚合正文、observability 全局日志正文和 archive 长期归档包正文。

这些正文如需参与 Work 语义,只能通过引用、快照、摘要、完成依据或显式 formalize / promote 后的 Work 自身结果表达,不得直接保存为 Work 数据。

### 3.5 哪些关系必须强一致？

Work 正式真相内部关系必须强一致。Project 与 ProjectMember、Backlog、WorkItem、child WorkItem、工作依赖 / 阻塞、Iteration 承诺子集、promote 后结果和追溯记录之间不能互相漂移。一个正式 WorkItem 如果被建立,就必须属于正式项目工作语境;一个 child WorkItem 如果被建立,就必须是正式协作级子任务而不是 runtime 执行步骤;一个 Iteration 如果成立,就必须从正式工作全集中选择承诺范围。

### 3.6 哪些关系可以最终一致？

Work 真相到消费视图、看板、任务摘要、投影、对账材料、维护报告、事件输出、观测材料和归档交接可以最终一致。外部来源真相到本地快照也可以最终一致,因为本地快照只是稳定消费和判断辅助,上游正式真相不因本地刷新延迟而转移归属。

### 3.7 失败时靠什么口径约束、补偿或挂起？

强一致关系不成立时必须显式失败或保持未成立状态,不能落为部分真相。最终一致关系暂时不成立时,允许保留旧投影、过期快照、未解析引用、挂起事件输出或挂起交接,但必须保留可识别状态,不得伪造外部正文补齐。引用失效时只能表达引用不可解析、已过期、被拒绝或待刷新,不能把外部对象复制成 Work 真相。

### 3.8 哪些数据边界如果不写清,后续最容易串仓？

最容易串仓的边界是:ProjectMember vs GlobalMember 生命周期、Backlog / WorkItem vs conversation suggestion、child WorkItem vs ImplementationPlan step / runtime plan item、Iteration vs process planning、完成依据摘要 vs artifact / evidence 正文、治理结论摘要 vs governance 裁决正文、消费视图 / 看板 / 对账材料 vs Work 真相、工作追溯记录 vs observability / archive 正文。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 数据所有权矩阵直接列 Project、ProjectMember、WorkItem、Iteration、Board projection | 方向有价值,但缺少快照、引用和明确不拥有正文边界 | 改为正式真相、快照 / 投影、引用关系、明确不拥有四类 |
| 一致性层次写聚合内强一致、聚合间最终一致、跨服务最终一致 | 有价值,但基于实现聚合和服务边界,未先说明归属 | 先定义数据归属,再推导核心真相强一致、派生最终一致和引用有效性一致 |
| 补偿机制写 artifact.approved 延迟、process.instance 创建失败、governance gate 丢失 | 过早进入实现补偿和具体事件假设 | 转译为引用不可解析、外部输入延迟、交接挂起和禁止补造正文 |
| 任务拆分与进入计划规则混在数据所有权章节 | 这是业务规则 / 关键交互线索,不是数据归属主结构 | 只保留 WorkItem、child WorkItem、Iteration 和 promote 的归属 / 一致性口径 |
| PostgreSQL、projection、outbox 等实现线索靠近数据策略 | 会把技术产品误写成所有权策略 | 后移技术选型 / 详细设计 / 配置设计 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据主语 | Project / WorkItem / Iteration 与 projection 混列 | Work 正式真相、快照 / 投影、引用关系、明确不拥有正文 | 架构层先判断归属,不提前进入对象模型 |
| 外部来源 | artifact、process、governance 可被写进补偿链 | 外部来源只能以引用、快照或正式结论摘要进入 | 防止来源真相转移 |
| 派生数据 | Board projection 作为数据项出现 | 派生数据是快照 / 投影,不得反写 | 防止第二 truth |
| 一致性 | 以聚合 / 服务划分一致性 | 以数据归属推导一致性 | 保护归属优先于实现组织 |
| 失败口径 | 靠补偿和事件回放描述 | 明确失败、挂起、旧视图、未解析引用,不得伪造正文 | 防止用补偿越权 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按旧数据所有权矩阵修补 | 改动小,接近旧实现 | 无法完整约束外部正文和派生反写风险 | 不采用 |
| 方案 B: 先按归属四类划边界,再推导一致性 | 能保护 Work 真相边界,可承接后续设计 | 后续概要 / 详细设计还需继续展开对象 | 采用 |
| 方案 C: 所有数据都要求强一致 | 语义最硬 | 会让快照、投影、事件输出和归档交接变得不可实现 | 不采用 |
| 方案 D: 所有数据都最终一致 | 实现弹性大 | 会破坏项目主语、正式工作全集、Iteration 和 promote 的核心一致性 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| Project | 正式真相数据 | 由 `L1-work` 拥有正式项目工作主语真相。 | 不等同于 conversation topic、ProcessInstance、runtime context 或 workspace project view。 |
| ProjectMember | 正式真相数据 | 由本仓拥有 GlobalMember 在项目内承担工作的正式事实。 | 不拥有 GlobalMember 生命周期、RoleDefinition 或 actor profile 正文。 |
| Backlog 正式工作全集 | 正式真相数据 | 由本仓拥有项目正式协作级工作全集。 | 不包含默认个人执行步骤、聊天建议或 runtime 局部计划项。 |
| WorkItem | 正式真相数据 | 由本仓拥有团队协作级正式工作事实。 | 不等同于 process Activity、tool step、personal checklist 或 workspace task card。 |
| child WorkItem | 正式真相数据 | 由本仓拥有协作级正式子任务真相。 | 不等同于 ImplementationPlan step、PlanItem progress 或 runtime execution step。 |
| 工作依赖 / 阻塞关系 | 正式真相数据 | 由本仓拥有正式工作之间的依赖、阻塞和解除依据关系。 | 不拥有外部 evidence 正文,只可引用完成或阻塞依据。 |
| Iteration 承诺子集 | 正式真相数据 | 由本仓拥有从正式工作全集中选择出的当前承诺范围。 | 不等同于 process planning 活动、board filter 或 workspace 展示分组。 |
| promote 结果与来源引用关系 | 正式真相数据 | 由本仓拥有 plan item 显式升级后形成的正式 Work 结果和来源关系。 | 来源计划或执行正文仍归 artifact / runtime 边界。 |
| 工作事实审计 / 追溯记录 | 正式真相数据 | 由本仓拥有 Work 关键变化的追溯事实。 | 不等同于全局 observability 日志或 archive 长期归档正文。 |
| ProjectMember 可承担性快照 | 快照 / 投影数据 | 本仓可为承担判断和降级解释保留成员可承担性摘要。 | 成员正式状态和生命周期仍归 `L1-identity`。 |
| 方法定义目录级快照 | 快照 / 投影数据 | 本仓可为方法化项目工作稳定消费保留定义目录摘要。 | TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile 正文仍归 `L3-method-library`。 |
| planning / review / timing 摘要 | 快照 / 投影数据 | 本仓可保留流程节奏背景摘要。 | ProcessInstance、Activity 和 checkpoint 正文仍归 `L1-process`。 |
| 治理结论摘要 | 快照 / 投影数据 | 本仓可保留高风险变化判断所需治理摘要。 | Gate、Policy、Control、Approval 裁决正文仍归 `L1-governance`。 |
| 完成依据摘要 | 快照 / 投影数据 | 本仓可保留完成判断和追溯解释所需摘要。 | Artifact、evidence、baseline 正文和版本真相仍归 `L1-artifact`。 |
| promote 来源摘要 | 快照 / 投影数据 | 本仓可保留 promote 判断所需来源摘要。 | ImplementationPlan、PlanItem 和 runtime progress 正文不归 Work。 |
| conversation context 摘要 | 快照 / 投影数据 | 本仓可保留工作正式化所需对话上下文摘要。 | conversation fact、聊天消息和 handoff 正文仍归 `L1-conversation`。 |
| 消费视图 / 看板 / 任务摘要 | 快照 / 投影数据 | 本仓可维护从 Work 真相派生的消费辅助数据。 | 可延迟、可重建,不得反写 Work 真相。 |
| GlobalMemberRef / ActorRef | 引用关系数据 | 本仓只保存平台成员和 actor 引用关系。 | 引用存在不代表本仓拥有身份正文。 |
| 方法定义相关 Ref | 引用关系数据 | 本仓只保存方法定义对象引用。 | 引用存在不代表定义正文进入 Work。 |
| process 相关 Ref | 引用关系数据 | 本仓只保存流程相关对象引用。 | 引用存在不代表流程状态正文进入 Work。 |
| governance 相关 Ref | 引用关系数据 | 本仓只保存治理结论对象引用。 | 引用存在不代表治理决策正文进入 Work。 |
| artifact / evidence / baseline Ref | 引用关系数据 | 本仓只保存完成依据和产物相关引用。 | 引用存在不代表 artifact / evidence / baseline 正文进入 Work。 |
| ImplementationPlanRef / PlanItemRef | 引用关系数据 | 本仓只保存执行计划来源引用。 | 引用存在不代表执行计划正文或进度进入 Work。 |
| conversation / trace / handoff Ref | 引用关系数据 | 本仓只保存对话上下文、trace 和 handoff 引用。 | 引用存在不代表 conversation 正文进入 Work。 |
| runtime / archive Ref | 引用关系数据 | 本仓只保存运行或归档交接引用。 | 引用存在不代表运行正文或归档正文进入 Work。 |
| identity 正文、conversation 正文、method-library 定义正文、process 正文、governance 正文、artifact / evidence / baseline / ImplementationPlan 正文、runtime 执行正文、workspace 聚合正文、observability 全局日志正文、archive 长期归档包正文 | 明确不拥有的正文 / 真相 | 这些正文或主真相由相邻仓、运行层或横切系统拥有,本仓不得吸收为正式真相。 | 如需要参与 Work 语义,只能通过引用、快照、摘要或显式 formalize / promote 后的 Work 自身结果表达。 |

### 7.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Project 与 ProjectMember / Backlog / WorkItem / Iteration 的归属关系 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败或保持未成立状态,不得落为无项目归属的正式工作事实 | 项目主语是全部 Work 真相的归属锚点。 |
| Backlog、WorkItem、child WorkItem 与正式工作全集之间的关系 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 不能把个人步骤、对话建议或 runtime step 落为部分正式工作 | 正式工作全集若被污染,Work 仓定位失效。 |
| 工作依赖 / 阻塞关系与所关联正式工作之间的关系 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 关系不可解释、引用不可接受或形成非法关系时挂起或拒绝 | 依赖和阻塞必须围绕正式工作事实成立。 |
| Iteration 承诺子集与 Backlog 正式工作全集之间的关系 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 候选工作不属于正式全集时不得进入承诺子集 | Iteration 是全集的承诺子集,不是独立任务池。 |
| promote 来源与 child WorkItem 正式结果之间的关系 | 正式真相数据 ↔ 引用关系数据 / 快照 / 投影数据 | 强一致 + 引用有效性一致 | 来源不可解析、不可追溯或仍属执行步骤时拒绝或保持待 formalize | Work 只拥有 promote 后结果,不吞入计划正文。 |
| 完成依据、治理结论、流程节奏与 Work 判断之间的关系 | 正式真相数据 ↔ 引用关系数据 / 快照 / 投影数据 | 引用有效性一致 + 最终一致 | 外部依据延迟时可等待、挂起或保留未满足状态,不得补造结论 | 外部输入能影响判断,但不改变正文归属。 |
| 外部来源真相到本地快照 | 明确不拥有的正文 / 真相 ↔ 快照 / 投影数据 | 最终一致 | 保留旧快照、未解析状态或待刷新状态,不得复制正文补齐 | 快照服务稳定消费和判断,不改变来源归属。 |
| Work 真相到消费视图 / 看板 / 任务摘要 / 对账材料 | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 | 保留旧视图、过期标记或挂起重建,不得反写真相 | 派生辅助可以延迟和重建。 |
| Work 真相到事件输出 / observability / archive 交接材料 | 正式真相数据 ↔ 引用关系数据 / 快照 / 投影数据 | 最终一致 | 交接可挂起或延迟,已形成 Work 真相不得丢失 | 下游消费失败不能反向改变业务事实。 |
| 外部对象引用有效性变化 | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 引用有效性一致 | 表达引用失效、待刷新、已拒绝或不可解析,不得复制正文补齐 | 引用关系成立不等于正文归属转移。 |
| 明确不拥有正文被请求写入 Work | 明确不拥有的正文 / 真相 ↔ 正式真相数据 | 边界约束一致 | 拒绝、挂起或转换为引用 / 快照 / 摘要 / formalize 结果,不得作为本仓真相保存 | 这是防止串仓的最高优先级边界。 |

### 7.3 简化关系示意图

```text
+--------------------------------------------------------------+
|                       L1-work 数据边界                        |
|                                                              |
|   +--------------------------+                               |
|   | 正式真相数据             |                               |
|   | project / members / work |                               |
|   | backlog / iteration      |                               |
|   +------------+-------------+                               |
|                | 派生 / 引用                                 |
|                v                                             |
|   +------------+-------------+      +----------------------+  |
|   | 快照 / 投影数据          |      | 引用关系数据         |  |
|   | views / snaps / reports  |      | external refs        |  |
|   +------------+-------------+      +----------+-----------+  |
|                | 不反写                         | 只引用       |
+================+===============================+==============+
                 |                               |
                 v                               v
      明确不拥有的外部正文 / 外部主真相
      identity / conversation / method / process / governance
      artifact / runtime / workspace / observability / archive
```

图示说明:

- `正式真相数据` 是本仓唯一可以主张拥有的业务真相。
- `快照 / 投影数据` 和 `引用关系数据` 可以本地存在,但不能反写真相或吸收外部正文。
- `明确不拥有的外部正文 / 外部主真相` 只能通过引用、快照、摘要或 formalize / promote 后的 Work 结果参与。
- 该图不表达存储设计、同步流程、事件流或对象模型。

### 7.4 数据边界说明

`L1-work` 的数据所有权边界是“拥有项目工作事实,本地保留判断和消费辅助,引用外部真相,明确排除外部正文”。Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、依赖阻塞、promote 结果和追溯记录属于 Work;成员、方法定义、对话、流程、治理、产物、运行时、workspace、观测和归档正文不属于 Work。快照、投影和对账材料可以提升消费体验与维护解释,但它们的延迟、失效或重建不能改变正式工作事实。后续设计若需要写字段、表、事件、补偿或索引,必须从本章归属和一致性口径继续下沉,不能反向修改本章边界。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §9 “数据所有权与一致性策略”直接摘录并整理本文件 §7.1、§7.2、§7.3 和 §7.4。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Project、ProjectMember、Backlog、WorkItem、Iteration 是否都属于 Work 正式真相 | A. 是;B. 只 WorkItem 属于;C. 分散归属到 process / workspace | A | 它们共同构成项目工作事实闭环,应由 Work 统一拥有 | 已确认采用 A |
| ImplementationPlan / PlanItem 是否进入 Work 真相 | A. 进入;B. 不进入,只保存引用和 promote 后结果;C. 由 runtime 决定 | B | Work 不拥有执行计划正文或运行进度,只拥有显式升级后的正式工作结果 | 已确认采用 B |
| 看板 / 投影 / 对账是否可以作为事实来源 | A. 可以;B. 不可以,只能派生;C. 由实现决定 | B | 派生结构可延迟和重建,不得形成第二 truth | 已确认采用 B |
| 外部来源快照延迟时是否影响 Work 真相成立 | A. 影响全部真相;B. 只影响依赖该快照的判断,必须表达快照状态;C. 直接复制正文补齐 | B | 快照只是稳定消费和规则判断辅助,不能改变真相归属 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 9 的待确认事项。具体数据对象、字段、表结构、索引、缓存、事件 schema、outbox、重试和补偿实现留到概要 / 详细设计与测试方案继续收敛。

---

## 10. 进入下一步条件

- 已明确正式真相数据、快照 / 投影数据、引用关系数据和明确不拥有的正文 / 真相。
- 已明确核心真相内部强一致、派生和交接最终一致、引用有效性一致、边界约束一致。
- 已明确一致性暂时不成立时的显式失败、挂起、旧视图、未解析引用和禁止伪造正文口径。
- 未写数据库设计、缓存 / 投影 / outbox 实现、事务机制、协议交互或代码对象模型。
- 可以进入 Step 9“关键交互与通信方式”。
