# Step 5. 限界上下文与子域划分

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 回填章节: `01-架构设计.md` §6 限界上下文与子域划分
> 生成日期: 2026-06-05

---

## 1. 本步目标

说明 `L1-process` 内部语义结构如何划分:哪些是核心子域,哪些是支撑子域,哪些只是本地索引 / 投影 / 引用,以及它们之间的上下文映射关系。本步不写对象字段、数据库表、代码目录、函数、接口、容器部署或详细调用链。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接做 / 不做 / 易混淆职责 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 4 已完成 | 承接正式上下文对象和输入 / 输出面 |
| `projects/L1-process/00-需求文档.md` §7 / §9 / §10 / §11 | 已重建 | 承接核心闭环、功能、规则和数据归属 |
| 旧 `projects/L1-process/01-架构设计.md` §5 | 旧 Draft | 作为 Definition / Runtime / Recovery / Coordination 线索来源 |

---

## 3. SOP 问题回答

### 3.1 本仓内部有哪些子域或本地上下文?

`L1-process` 的内部语义结构围绕“过程执行事实”展开,可以分为:

| 名称 | 当前判断 |
|---|---|
| Runtime Process Shape | 从方法定义来源形成的运行时过程形态上下文 |
| Process Profile | 项目采用和裁剪后的过程语境上下文 |
| Process Execution | ProcessInstance、Activity、Token / Gateway 的运行事实上下文 |
| Gate Coordination | waiting gate / pause context 和恢复依据上下文 |
| Checkpoint & Recovery | Instance 级 checkpoint / recovery fact 上下文 |
| Process Consumption | 查询、timeline / summary 和消费视图支撑上下文 |
| Maintenance & Reconciliation | 投影重建、对账、维护证据支撑上下文 |
| External Context Mirrors | method / work / identity / governance / artifact / runtime / conversation 等外部 ref、snapshot 和本地影子结构 |

### 3.2 哪些是核心子域?

核心子域必须直接承载 C-1~C-4 的过程执行事实主线:

| 核心子域 | 判断 |
|---|---|
| Runtime Process Shape | 支撑 C-1 运行时过程形态成立 |
| Process Profile | 支撑项目采用 / 裁剪过程语境成立 |
| Process Execution | 支撑 C-2 / C-3 项目过程实例和过程节点流控成立 |
| Gate Coordination | 支撑 C-4 暂停等待恢复语境成立 |
| Checkpoint & Recovery | 支撑 C-4 恢复连续性成立 |

### 3.3 哪些是支撑子域?

支撑子域围绕核心事实存在,但不是中心真相本体:

| 支撑子域 | 判断 |
|---|---|
| Process Consumption | 支撑 C-5 可消费可追溯,但查询 / timeline / summary 不能成为写源 |
| Maintenance & Reconciliation | 支撑派生结果维护、对账和恢复消费面,但不能改变业务真相 |
| Process Traceability | 支撑关键变化、等待、恢复和维护动作可解释;它解释 Process 事实变化,不保存 reasoning trace 正文 |

`Process Traceability` 可与 Consumption / Maintenance 共享语义,但在架构语义上需要独立指出,因为审计追溯是需求一票否决项之一。

### 3.4 哪些只是外部上下文的本地索引 / 投影 / 引用?

| 本地影子结构 | 边界 |
|---|---|
| Method Definition Snapshot / Ref | 只消费 method-library 定义来源,不拥有定义正文 |
| Work Context Snapshot / Ref | 只消费 Project / WorkItem / Iteration 语境,不拥有 work truth |
| Identity Actor / Member Ref | 只消费 actor / member 语境,不拥有身份生命周期 |
| Governance Decision Ref | 只引用正式 decision / policy / gate 结论,不拥有治理真相 |
| Artifact / Evidence / Baseline Ref | 只保存引用或摘要,不保存正文 |
| Runtime Feedback Snapshot / Ref | 只保存执行反馈摘要或引用,不保存 execution log / tool call 正文 |
| Conversation Context Ref | 只保存 conversation context 回链,不拥有对话正文 |
| Observability / Archive Handoff Ref | 只保存追溯或归档交接引用,不拥有 reasoning trace 或 archive package 正文 |

### 3.5 它们之间的上下文映射关系是什么?

| 关系 | 说明 |
|---|---|
| Runtime Process Shape -> Process Profile | Profile 基于运行时过程形态形成项目采用 / 裁剪语境。 |
| Process Profile -> Process Execution | ProcessInstance 和 Activity 运行事实依附于已采用的过程语境。 |
| Process Execution -> Gate Coordination | waiting gate 和 pause context 从运行事实中的等待节点产生。 |
| Process Execution -> Checkpoint & Recovery | checkpoint / recovery 围绕同一 ProcessInstance 和 Activity 链形成。 |
| Process Execution -> Process Consumption | 查询和消费视图读取运行事实,不得反向改变运行事实。 |
| Process Execution -> Maintenance & Reconciliation | 维护和对账修复派生结果,不得成为业务真相写源。 |
| External Context Mirrors -> 核心子域 | 外部 ref / snapshot 为核心子域提供稳定引用和判断语境,但不提升为核心真相。 |
| Process Traceability -> 核心 / 支撑子域 | 追溯语义覆盖关键变化和维护动作,但不替代 observability 正文。 |

### 3.6 为什么这些部分不能混成一个上下文?

| 不能混合的部分 | 原因 |
|---|---|
| Runtime Process Shape 与 method-library definition | 混合后 Process 会接管定义正文。 |
| Process Profile 与 Process Execution | Profile 是采用 / 裁剪语境,Execution 是运行事实;混合会让实例运行改写过程定义语境。 |
| Process Execution 与 Work truth | 混合后 Activity / Token 会变成 WorkItem / Iteration 状态。 |
| Gate Coordination 与 Governance decision | 混合后 waiting gate 会成为正式决策来源。 |
| Checkpoint & Recovery 与 Runtime checkpoint / Observability trace | 混合后 Process 会保存 runtime 微步或 reasoning trace 正文。 |
| Process Consumption / Maintenance 与 Process Execution | 混合后查询、投影或对账可能反向推进业务真相。 |
| External Context Mirrors 与核心子域 | 混合后外部快照 / 引用会被误写成 Process 自有真相。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §5 | Definition / Runtime / Recovery / Coordination 四个上下文 | 线索有价值,但缺 ProcessProfile、Consumption、Maintenance、Traceability 和外部影子层 | 按新版需求重划分 |
| 旧 `01-架构设计.md` §5.1 | Process Definition Index 被称为支撑子域 | 新版需求强调 runtime process shape / Profile 是核心闭环 C-1 | 拆成 Runtime Process Shape 和 Process Profile |
| 旧 `01-架构设计.md` | Recovery 与 checkpoint 有上下文,但 observability / archive 边界不足 | 新版需求禁止 reasoning trace / archive package 正文入仓 | 增加 External Context Mirrors 和 Traceability 边界 |
| 旧 `01-架构设计.md` | 查询 / 投影 / 维护没有单独上下文 | 新版需求 FR-PROC-007 / 008 要求消费和维护但不得反写真相 | 增加支撑子域 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 内部语义层次 | 4 个旧上下文 | 核心子域、支撑子域、本地索引 / 投影 / 引用三层 | 对齐架构规范 4.6 |
| Definition 语义 | Process Definition Index | Runtime Process Shape + Process Profile | 区分定义来源、运行时形态和项目采用语境 |
| Recovery 语义 | checkpoint / restore | Checkpoint & Recovery + Traceability + external handoff refs | 防止与 runtime trace / archive 正文混淆 |
| Consumption / Maintenance | 未独立表达 | Process Consumption、Maintenance & Reconciliation | 承接需求 C-5 / FR-PROC-008 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 Definition / Runtime / Recovery / Coordination 四上下文 | 简洁,保留旧线索 | 无法承接新版消费、维护、trace 和外部影子边界 | 不采用 |
| 方案 B: 按核心 / 支撑 / 本地影子三层重划分 | 层次清楚,防止外部快照升格为真相 | 表更长 | 采用 |
| 方案 C: 把所有对象都列为核心子域 | 表面完整 | 会把投影、引用和外部快照误升为核心真相 | 不采用 |
| 方案 D: 按代码模块或 crate 划分上下文 | 便于实现 | 架构阶段会过早写实现结构 | 不采用 |

### 6.1 待确认问题的方案选择

#### Process Traceability 是否单独作为支撑子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 并入 Consumption / Maintenance | 文档更短,但审计追溯红线不够醒目 |
| 方案 B | 单独列为支撑子域 | 能承接关键变化可追溯和一票否决项 |

推荐方案 B。

#### Runtime Process Shape 是否属于核心子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 只作为本地索引 | 会弱化 C-1 运行时过程形态成立 |
| 方案 B | 作为核心子域,但明确不拥有定义正文 | 既承接核心闭环,又保护 method-library 边界 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| Runtime Process Shape | 核心子域 | 承载从方法定义来源形成的可执行过程形态语义。 | 是 ProcessProfile 和 ProcessExecution 的过程形态基础,不拥有 method-library 定义正文。 |
| Process Profile | 核心子域 | 承载项目采用、裁剪和切换后的过程语境。 | 依附于 Runtime Process Shape,并为 ProcessExecution 提供采用语境。 |
| Process Execution | 核心子域 | 承载 ProcessInstance、Activity、Token / Gateway 的运行事实语义。 | 是过程推进主线,受 Profile 约束并产生 waiting gate、checkpoint 和消费事实。 |
| Gate Coordination | 核心子域 | 承载 waiting gate、pause context、等待原因和恢复依据语义。 | 围绕 ProcessExecution 的等待点存在,只引用 governance 结论。 |
| Checkpoint & Recovery | 核心子域 | 承载 Instance 级 checkpoint 和恢复连续性语义。 | 围绕 ProcessExecution 保持同一事实链,不拥有 runtime checkpoint 或 trace 正文。 |
| Process Consumption | 支撑子域 | 承载授权查询、timeline / summary 和过程事实消费语义。 | 消费核心子域事实,不得反向推进核心事实。 |
| Maintenance & Reconciliation | 支撑子域 | 承载投影重建、对账和维护证据语义。 | 支撑消费面和派生结果恢复,不得成为业务真相写源。 |
| Process Traceability | 支撑子域 | 承载关键变化、等待、恢复和维护动作的解释语义。 | 覆盖核心和支撑子域的变化解释,不保存 reasoning trace 正文。 |
| External Context Mirrors | 本地索引 / 投影 / 引用 | 承载 method、work、identity、governance、artifact、runtime、conversation、observability、archive 等外部 ref / snapshot。 | 为核心和支撑子域提供稳定引用,不拥有外部正文或 truth。 |

### 7.2 上下文关系图

```text
------------------------+
| Runtime Process Shape |
+-----------+------------+
            |
            v
+-----------------------+
|    Process Profile    |
+-----------+-----------+
            |
            v
+-----------------------+
|   Process Execution   |
+----+-------------+----+
     |             |
     v             v
+----------+   +-----------------------+
| Gate     |   | Checkpoint & Recovery |
| Coord.   |   +-----------------------+
+----+-----+
     |
     v
+-----------------------+   +-----------------------+
|  Process Consumption  |   | Maintenance & Recon.  |
+-----------+-----------+   +-----------+-----------+
            |                           |
            v                           v
+-----------------------+   +-----------------------+
| Process Traceability  |   | External Context      |
|                       |   | Mirrors               |
+-----------------------+   +-----------------------+
```

图示说明:

- 图中只表达 `L1-process` 内部语义结构,不表达外部系统、接口、事件、数据库或代码模块。
- Runtime Process Shape、Process Profile、Process Execution、Gate Coordination、Checkpoint & Recovery 是核心子域。
- Process Consumption、Maintenance & Reconciliation、Process Traceability 是围绕核心事实的支撑子域。
- External Context Mirrors 是外部上下文的本地 ref / snapshot / projection 层,不得升格为核心 truth。

### 7.3 本地索引 / 投影 / 引用边界结论

| 本地结构 | 归属类型 | 边界结论 |
|---|---|---|
| Method Definition Snapshot / Ref | 本地索引 / 引用 | 只消费 method-library 定义来源,不保存定义正文。 |
| Work Context Snapshot / Ref | 本地快照 / 引用 | 只保存 Project / WorkItem / Iteration 语境摘要或引用,不拥有 work truth。 |
| Identity Actor / Member Ref | 本地引用 | 只保存 actor / member 引用或解析结果,不拥有身份生命周期。 |
| Governance Decision Ref | 本地引用 | 只引用正式 decision / policy / gate 结论,不拥有治理真相。 |
| Artifact / Evidence / Baseline Ref | 本地引用 / 快照 | 只保存引用或摘要,不保存 artifact 正文。 |
| Runtime Feedback Snapshot / Ref | 本地快照 / 引用 | 只保存执行反馈摘要或引用,不保存执行正文。 |
| Conversation Context Ref | 本地引用 | 只保存 conversation context 回链,不拥有对话正文。 |
| Observability / Archive Handoff Ref | 本地引用 | 只保存追溯和归档交接引用,不拥有 reasoning trace 或 archive package 正文。 |

### 7.4 统一语言词汇结论

| 术语 | 定义 | 所属上下文 |
|---|---|---|
| Runtime Process Shape | 从方法定义来源形成的可执行过程形态,不等于 ProcessTemplateDef 正文。 | Runtime Process Shape |
| ProcessProfile | 项目采用和裁剪后的过程语境。 | Process Profile |
| ProcessInstance | 一次项目过程运行事实。 | Process Execution |
| Activity | ProcessInstance 内的过程节点和承担语境,不等于 WorkItem 或 runtime step。 | Process Execution |
| Token / Gateway | 过程流控位置和路径选择语义。 | Process Execution |
| waiting gate | 过程等待外部治理、反馈或人工处理的等待意图,不等于 governance decision。 | Gate Coordination |
| pause context | 过程暂停时需要保留的等待原因、关联节点和恢复语境。 | Gate Coordination |
| Checkpoint | Instance 级恢复事实,不等于 runtime 微步 checkpoint。 | Checkpoint & Recovery |
| Recovery | 从同一 Process truth 继续服务的恢复语义。 | Checkpoint & Recovery |
| Process Consumption | 授权读取、timeline / summary 和消费视图语义。 | Process Consumption |
| Reconciliation | 对派生结果和消费面进行检查 / 对账 / 修复的维护语义,不改变业务真相。 | Maintenance & Reconciliation |
| External Context Mirror | 外部上下文的本地 ref、snapshot 或 projection,不拥有外部正文。 | External Context Mirrors |

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 6. 限界上下文与子域划分

> 校准来源:
> - `design-calibration/01_arch_step_05_bounded_context_subdomains.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“子域 / 上下文划分表”“上下文关系图”“本地索引 / 投影 / 引用边界结论”和“统一语言词汇结论”小节,了解本章如何从职责边界和系统上下文收敛为仓内语义结构。

正式章节应摘录:

- `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.1 子域 / 上下文划分表。
- `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.2 上下文关系图。
- `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.3 本地索引 / 投影 / 引用边界结论。
- `design-calibration/01_arch_step_05_bounded_context_subdomains.md` §7.4 统一语言词汇结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | Runtime Process Shape、ProcessProfile 和 ProcessExecution 的具体对象关系 | 后续概要 / 详细设计收敛;当前只固定语义层次 |
| Q-002 | Process Traceability 是否独立实现为对象或由 audit / event 承载 | 后续详细设计和测试方案收敛;当前只固定支撑子域语义 |
| Q-003 | External Context Mirrors 的具体 snapshot / ref 类型 | 后续详细设计按相邻仓契约收敛;当前只固定不得拥有外部正文 |

---

## 10. 进入下一步条件

- 已明确本仓内部语义结构层次。
- 已区分核心子域、支撑子域和本地索引 / 投影 / 引用。
- 已通过关系图解释这些部分如何共同构成整体。
- 未写对象字段、数据库表、代码目录、函数接口、容器部署或实现组件。

结论:可以进入 Step 6 `容器 / 部署架构`。
