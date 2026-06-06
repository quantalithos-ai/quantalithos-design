# Step 8. 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 生成日期: 2026-06-05

---

## 1. 本步目标

明确哪些数据由 `L1-process` 拥有正式真相,哪些只是快照 / 投影,哪些只是引用关系,哪些正文 / 真相明确不拥有;并在这些归属判断成立的前提下,说明不同数据关系采用什么一致性口径,以及一致性暂时不成立时的架构层处理原则。本步不写数据库表、字段、缓存、outbox、事务机制、事件 schema、重试脚本、repository 或代码对象模型。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接职责和红线 |
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | Step 5 已完成 | 承接核心 / 支撑 / 本地影子结构 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | Step 7 已完成 | 承接依赖倒置和接缝边界 |
| `design-calibration/00_req_step_11_data_ownership.md` | 已完成 | 承接需求层数据归属 |
| `projects/L1-process/00-需求文档.md` §10 / §11 / §13 / §14 | 已重建 | 校验业务规则、数据归属、非功能和验收否决项 |

---

## 3. SOP 问题回答

### 3.1 哪些数据由本仓拥有真相?

`L1-process` 拥有过程执行事实的正式真相:

| 正式真相数据 | 判断 |
|---|---|
| Runtime Process Shape / ProcessTemplate runtime index | Process 拥有运行时过程形态,不拥有 method-library 定义正文。 |
| ProcessProfile | Process 拥有项目采用、裁剪和切换后的过程语境。 |
| ProcessInstance | Process 拥有项目过程运行事实。 |
| Activity | Process 拥有过程节点、承担语境和推进事实。 |
| Token / Gateway | Process 拥有过程流控位置和路径选择事实。 |
| waiting gate / pause context | Process 拥有等待意图、等待原因和恢复语境。 |
| Checkpoint / recovery fact | Process 拥有 Instance 级恢复连续性事实。 |
| process timing / stage / rhythm fact | Process 拥有过程节奏和阶段语境事实。 |
| process audit / traceability record | Process 拥有关键变化和维护动作的追溯事实。 |

### 3.2 哪些数据只是快照、投影或引用?

| 类别 | 数据 |
|---|---|
| 快照 / 投影 | 方法定义目录级快照;项目 / 工作语境摘要;actor / member 可承担性摘要;governance decision / policy 摘要;artifact / evidence / baseline 摘要;runtime feedback 摘要;conversation context 摘要;process read model / timeline / progress summary |
| 引用关系 | 方法定义相关 Ref;work 相关 Ref;identity 相关 Ref;governance 相关 Ref;artifact / evidence / baseline / implementation plan Ref;runtime / member-service Ref;conversation / trace / handoff Ref;observability / archive Ref |

### 3.3 哪些关系必须强一致?

强一致只用于 Process 主真相内部边界:

| 强一致场景 | 原因 |
|---|---|
| ProcessProfile 与它约束下的 ProcessInstance 形成 / 切换判断 | 否则实例可能依附错误过程语境。 |
| ProcessInstance、Activity、Token / Gateway 的推进判断 | 否则同一过程事实会出现分叉或多当前位置。 |
| waiting gate / pause context 与 ProcessExecution 等待点的建立 | 否则等待意图可能脱离实际运行节点。 |
| checkpoint / recovery fact 与同一 ProcessInstance 恢复链 | 否则恢复会产生第二份过程真相。 |
| process audit / traceability record 与关键 Process 变化 | 否则关键变化不可追溯。 |

### 3.4 哪些关系可以最终一致?

最终一致用于派生消费、跨仓快照和下游交接:

| 最终一致场景 | 原因 |
|---|---|
| Process truth -> read model / timeline / progress summary | 派生视图可滞后,但不能反写真相。 |
| Process truth -> workspace / conversation / SDK 消费面 | 下游消费滞后不影响 Process 主真相。 |
| Process truth -> observability / archive handoff | 追溯 / 归档交接可延迟,但必须可追踪。 |
| 外部 truth -> Process 本地快照 | 外部摘要可能滞后,但必须标明来源和失效状态。 |
| 事件协作输出 / 输入 | 事件传播可延迟,但重复输入不能产生重复正式事实。 |

### 3.5 失败时靠什么口径约束、补偿或挂起?

| 失败类型 | 架构层处理口径 |
|---|---|
| 主真相内部强一致失败 | 明确失败或保持原状态,不得写成部分完成。 |
| 外部快照缺失 / 过期 | 标记 unresolved / stale / waiting,不得自造外部 truth。 |
| 引用目标不存在或不可解析 | 保持引用失效态或挂起相关变化,不得补写外部正文。 |
| 派生视图滞后 | 暴露 stale / rebuilding / unavailable 口径,不得反写主真相。 |
| 下游消费或 handoff 失败 | 保留待交接 / failed / retryable 语义,不得改变 Process 主事实含义。 |
| 事件重复或乱序 | 识别重复或拒绝回退,不得产生重复 Process truth 或 sequence regression。 |
| recovery 依据不足 | 挂起恢复或失败,不得创建第二份 ProcessInstance。 |

### 3.6 哪些数据边界如果不写清,后续最容易串仓?

最容易串仓的数据边界是:

1. Runtime Process Shape 与 method-library definition 正文。
2. Activity / Token / process timing 与 WorkItem / Iteration truth。
3. waiting gate / pause context 与 governance decision truth。
4. Checkpoint / recovery 与 runtime micro-checkpoint / reasoning trace / archive package 正文。
5. process read model / timeline 与 workspace dashboard / observability report。
6. runtime feedback summary 与 runtime execution log / tool call 正文。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 需求 Step 11 | 已有真相 / 快照 / 引用 / 禁止正文分类 | 需求层不展开一致性口径 | 本步补一致性策略 |
| 旧 `01-架构设计.md` | checkpoint、projection、storage 有实现线索 | 缺数据归属到一致性策略的完整映射 | 重写为归属 + 一致性 |
| 旧 `01-架构设计.md` | PostgreSQL、object storage 影响数据表达 | 技术承载不能决定数据所有权 | 本步不锁存储实现 |
| 新版需求 §15 | 存储、checkpoint 机制、证据 schema 未定 | 不阻塞架构层数据边界 | 只写架构口径,不写机制 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据归属 | 需求层已有四类归属 | 架构层补正式数据归属表 | 作为一致性策略前提 |
| 一致性策略 | 旧文档偏实现线索 | 强一致 / 最终一致 / 引用有效性 / 边界挂起分开 | 防止实现细节替代架构判断 |
| 外部正文 | 容易通过摘要、checkpoint、trace 混入 | 明确正文 / 真相不拥有 | 保护一票否决边界 |
| 失败处理 | 可能写成重试或补偿机制 | 写成挂起、显式失败、stale、unresolved 等架构口径 | 避免下沉实现 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只复用需求数据归属表 | 简洁 | 缺一致性策略 | 不采用 |
| 方案 B: 数据归属表 + 一致性策略表 | 完整,可支撑后续交互和详细设计 | 表格较长 | 采用 |
| 方案 C: 直接写事务 / outbox / projection / retry 机制 | 接近实现 | 越过详细设计和技术选型 | 不采用 |
| 方案 D: 全部使用最终一致 | 简化 | 主真相内部会丢失过程连续性 | 不采用 |

### 6.1 待确认问题的方案选择

#### Process truth 内部是否全部强一致?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 核心推进链强一致 | 能保护同一实例、节点、等待和恢复连续性 |
| 方案 B | 全部最终一致 | 会产生分叉、重复推进或不可解释恢复 |

推荐方案 A。这里的强一致是架构口径,不是具体事务实现。

#### 外部快照滞后时是否允许 Process 自行补真相?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 允许补齐 | 会接管外部 truth |
| 方案 B | 不允许补齐,只能 stale / unresolved / waiting / failed | 守住相邻仓边界 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| Runtime Process Shape / ProcessTemplate runtime index | 正式真相数据 | 由 Process 拥有运行时过程形态真相。 | 不等于 ProcessTemplateDef / TaskDefinition / Method Content 定义正文。 |
| ProcessProfile | 正式真相数据 | 由 Process 拥有项目采用、裁剪和切换后的过程语境真相。 | 不等于 method-library 定义 truth 或 work 项目状态。 |
| ProcessInstance | 正式真相数据 | 由 Process 拥有项目过程运行事实。 | 不等于 Project lifecycle 或 workspace progress。 |
| Activity | 正式真相数据 | 由 Process 拥有过程节点、承担语境和推进事实。 | 不等于 WorkItem、ImplementationPlan step 或 runtime step。 |
| Token / Gateway | 正式真相数据 | 由 Process 拥有过程流控位置和路径选择事实。 | 不等于 runtime 调度队列或工具执行计划。 |
| waiting gate / pause context | 正式真相数据 | 由 Process 拥有等待意图、等待原因和恢复语境。 | 不等于 governance Gate / Policy / decision truth。 |
| Checkpoint / recovery fact | 正式真相数据 | 由 Process 拥有 Instance 级恢复连续性事实。 | 不等于 runtime micro-checkpoint、reasoning trace 或 archive package。 |
| process timing / stage / rhythm fact | 正式真相数据 | 由 Process 拥有过程节奏和阶段语境事实。 | 不等于 Work 的 Iteration truth。 |
| process audit / traceability record | 正式真相数据 | 由 Process 拥有关键变化和维护动作的追溯事实。 | 不等于 observability audit ledger 或 reasoning trace 正文。 |
| 方法定义目录级快照 | 快照 / 投影数据 | Process 可保留定义来源摘要以支撑运行判断。 | 上游正式真相仍属于 method-library。 |
| 项目 / 工作语境摘要 | 快照 / 投影数据 | Process 可保留工作语境摘要以解释过程绑定。 | 上游正式真相仍属于 Work。 |
| actor / member 可承担性摘要 | 快照 / 投影数据 | Process 可保留承担判断所需摘要。 | 上游正式真相仍属于 Identity。 |
| governance decision / policy 摘要 | 快照 / 投影数据 | Process 可保留等待恢复判断所需摘要。 | 上游正式真相仍属于 Governance。 |
| artifact / evidence / baseline 摘要 | 快照 / 投影数据 | Process 可保留追溯解释所需摘要。 | 上游正文和正式真相仍属于 Artifact。 |
| runtime feedback 摘要 | 快照 / 投影数据 | Process 可保留反馈判断所需摘要。 | 执行正文仍属于 Runtime / member-service。 |
| conversation context 摘要 | 快照 / 投影数据 | Process 可保留过程上下文摘要。 | conversation fact / 消息正文仍属于 Conversation。 |
| process read model / timeline / progress summary | 快照 / 投影数据 | 由 Process truth 派生,服务只读消费。 | 不形成新的业务真相写源。 |
| 外部对象 Ref 集合 | 引用关系数据 | Process 只保存指向外部对象、正文或材料的引用关系。 | 引用成立不等于正文归属进入 Process。 |
| method-library / work / governance / artifact / runtime / identity / conversation / workspace / observability / archive 正文 | 明确不拥有的正文 / 真相 | Process 明确不拥有这些外部正文或正式真相。 | 若吸收这些正文,会直接打穿仓边界。 |

### 7.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Runtime Process Shape 到 ProcessProfile 的采用 / 切换 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败或保持原 Profile,不得产生半切换语境 | Profile 必须依附确定的运行时过程形态。 |
| ProcessInstance、Activity、Token / Gateway 推进 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败或保持原状态,不得写成部分完成 | 过程当前位置和节点状态必须围绕同一实例一致。 |
| waiting gate / pause context 建立与恢复 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 外部依据缺失时保持 waiting / unresolved,不得自造 decision | 等待语境必须对应真实过程节点和正式外部依据。 |
| Checkpoint / recovery 与 ProcessInstance 连续性 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 恢复依据不足时挂起或失败,不得创建第二份 Process truth | 恢复连续性是一票否决边界。 |
| process audit / traceability 与关键变化 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 关键变化缺追溯时失败或保持原状态 | 关键变化不可追溯会破坏审计能力。 |
| Process truth 到 read model / timeline / progress summary | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 | 暴露 stale / rebuilding / unavailable,不得反写真相 | 派生视图滞后不等于主真相失效。 |
| Process truth 到 workspace / conversation / SDK 消费面 | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致 | 消费面延迟或失败可解释,不得改变 Process truth | 下游显化和聚合不拥有 Process 主真相。 |
| Process truth 到 observability / archive handoff | 正式真相数据 ↔ 引用关系数据 / 明确不拥有的正文 | 最终一致 + 边界约束一致 | 保留待交接 / failed / retryable 语义,不得保存外部正文 | 交接失败不能改变 Process 主事实含义。 |
| 外部 truth 到 Process 本地快照 | 快照 / 投影数据 ↔ 明确不拥有的正文 / 真相 | 最终一致 + 边界约束一致 | 标记 stale / unresolved / waiting,不得补写外部 truth | 本地快照只服务判断和解释。 |
| 外部对象引用有效性 | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 引用有效性一致 | 保持 invalid / unresolved / missing ref,不得保存正文补齐 | 引用关系成立不等于拥有正文。 |
| 事件协作重复或乱序 | 正式真相数据 / 快照 / 引用关系数据 | 幂等一致 + 顺序约束 | 重复输入返回同一结果或拒绝;乱序不得回退状态 | 防止重复事实和 sequence regression。 |
| 查询 / 投影 / 报告 / 对账维护 | 快照 / 投影数据 ↔ 正式真相数据 | 只读一致 + 不反写真相 | 维护失败只影响派生状态,不得推进业务事实 | 保护读 / 维护路径不成为写源。 |

### 7.3 简化关系示意图

```text
------------------------+
| Process truth          |
| formal owned facts     |
+-----------+------------+
            |
            | derive / expose
            v
+------------------------+        +------------------------+
| snapshots / projections|        | external refs          |
| read and explanation   |        | no external body       |
+-----------+------------+        +-----------+------------+
            |                                 |
            | boundary only                   | boundary only
            v                                 v
+----------------------------------------------------------+
| external body / external truth is explicitly not owned    |
+----------------------------------------------------------+
```

图示说明:

- Process truth 是本仓正式真相,快照 / 投影和引用只能围绕它提供消费、解释或外部边界。
- 本地存在快照或引用不代表拥有外部正文或外部正式真相。
- 派生视图和维护结果不得反向推进 Process truth。
- 外部正文 / 外部真相必须保持在 Process 仓外。

### 7.4 数据边界说明短文

`L1-process` 的数据所有权以过程执行事实为中心,本仓只拥有 runtime process shape、ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery、process timing 和 traceability 这些正式 Process truth。外部快照和引用可以本地存在,但只服务运行判断、消费展示、追溯解释或交接,不形成独立业务真相。相邻仓正文、runtime 执行正文、conversation 正文、observability 正文和 archive package 正文明确定义为不拥有,不得通过 checkpoint、摘要、报告或维护结果绕道进入 Process。这里的一致性策略只描述架构层口径,不定义事务、outbox、缓存、投影或重试实现。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 9. 数据所有权与一致性策略

> 校准来源:
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“数据归属表”“一致性策略表”“简化关系示意图”和“数据边界说明短文”小节,了解本章如何从数据归属建立一致性策略。

正式章节应摘录:

- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.1 数据归属表。
- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.2 一致性策略表。
- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.3 简化关系示意图。
- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.4 数据边界说明短文。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | 强一致在实现层采用何种事务或原子边界 | 后续详细设计和技术选型收敛 |
| Q-002 | 最终一致在实现层采用事件、投影、outbox 或重建机制 | 后续交互方式、详细设计和实施计划收敛 |
| Q-003 | stale / unresolved / waiting / failed 等 marker 的正式 schema | 后续详细设计和协议契约收敛 |
| Q-004 | checkpoint / recovery 的具体粒度和存储策略 | 后续详细设计、配置设计和测试方案收敛 |

---

## 10. 进入下一步条件

- 已明确本仓正式真相、快照 / 投影、引用关系和明确不拥有的正文 / 真相。
- 已说明每类数据为什么属于当前归属边界。
- 已明确强一致、最终一致、引用有效性一致、边界约束一致和失败处理口径。
- 未写数据库表、缓存、outbox、事务机制、协议交互或代码对象模型。

结论:可以进入 Step 9 `关键交互与通信方式`。
