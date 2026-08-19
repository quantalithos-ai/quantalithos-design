# L2-runtime 01 架构 Step 5: 限界上下文与子域划分

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 6 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 3 职责、Step 4 系统上下文、正式 00 五能力闭环和数据归属 |
| 目标 | 区分核心子域、支撑子域和本地索引 / 投影 / 引用，并逐单元停审 |
| 禁止 | 对象字段、数据库、代码目录、容器、接口或实现组件 |

## 1. Step 内计划

| 架构单元 | 类型 | 状态 | 停审 |
|---|---|---|---|
| Run & Goal-Plan | 核心子域 | done | pass |
| Context & Memory Mediation | 核心子域 | done | pass |
| Model Decision | 核心子域 | done | pass |
| Action & Delegation Orchestration | 核心子域 | done | pass |
| Checkpoint, Recovery & Handoff | 核心子域 | done | pass |
| Runtime Entry & Control | 支撑子域 | done | pass |
| External Truth Views | 本地索引 / 投影 / 引用 | done | pass |
| Safe Runtime Views | 本地索引 / 投影 / 引用 | done | pass |
| 跨上下文审计 | cross-unit | done | pass |

## 2. SOP 问题回答与诊断

五个核心语境对应 C-L2R-1~5，但“能力节点”不直接等同代码模块。Runtime Entry & Control 是支撑 run 受理 / 查询 / 控制的边界语境，不拥有产品入口；External Truth Views 只稳定消费上游 ref / safe snapshot；Safe Runtime Views 只从 Runtime truth 派生 body-free status / outcome / handoff material。旧 Loop / Prompt / Memory / Tools / ExecutionPlan / AgentSplit 九模块混合了职责、实现和外部 truth，其中 Tools、ExecutionPlan、Policy Cache、ReasoningTrace 正文均不能成为当前核心上下文。

## 3. 设计取舍

- 采用五核心语境，保证运行主线可按 owner 和失败边界独立审查；不采用单一“大脑状态图”吞并所有语义。
- 将入口 / 控制独立为支撑子域，避免产品 / member 私有状态进入 run truth。
- 将外部定义 / 裁决 / 工具 / 隔离 / artifact / memory 内容统一定位为本地引用视图，而非按每个上游复制一个核心子域。
- 将安全状态 / outcome / handoff 视图定位为可重建投影，不让下游消费表达反写核心真相。

## 4. 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| Run & Goal-Plan | 核心子域 | 承载 controlled run、目标 / 计划工作态和推进决定。 | 是运行主轴，为其他核心语境提供 run / turn / goal 关联。 |
| Context & Memory Mediation | 核心子域 | 承载来源选择、composition、working memory、retrieval / candidate 使用语义。 | 围绕当前 run 形成决策输入，只消费外部 ref / safe view。 |
| Model Decision | 核心子域 | 承载 provider-neutral intent、逻辑 selection、turn disposition 和安全摘要。 | 消费受控 context，为 action decision 提供语义结果。 |
| Action & Delegation Orchestration | 核心子域 | 承载 no-action / Tool / child / wait / reject 选择、前置和 incorporation。 | 消费当前 decision，通过正式边界协作但不拥有执行 truth。 |
| Checkpoint, Recovery & Handoff | 核心子域 | 承载 stable point、resume、reflection / recovery、local outcome 和 handoff attempt / gap。 | 横跨所有核心语境形成 immutable history 和 committed continuation。 |
| Runtime Entry & Control | 支撑子域 | 承载正式触发、控制请求和安全查询的 Runtime 边界语义。 | 依附 Run & Goal-Plan，不拥有 member / product 入口 truth。 |
| External Truth Views | 本地索引 / 投影 / 引用 | 为定义、治理、能力、工具、隔离、Artifact、memory 等外部 truth 提供带来源消费视图。 | 被各核心语境消费，只保存 ref / safe snapshot / availability / gap。 |
| Safe Runtime Views | 本地索引 / 投影 / 引用 | 为下游查询、事件和观察消费提供 body-free Runtime status / outcome / handoff 视图。 | 从已提交 Runtime truth 派生，可延迟 / 重建，不反写真相。 |

## 5. 上下文关系图

```text
  +-----------------------+
  | Runtime Entry/Control |
  +-----------+-----------+
              |
              v
  +-----------------------+     +-----------------------+
  | Run & Goal-Plan       |<--->| Context & Memory      |
  +-----------+-----------+     +-----------+-----------+
              |                             |
              +-------------+---------------+
                            v
                +-----------------------+
                | Model Decision        |
                +-----------+-----------+
                            |
                            v
                +-----------------------+
                | Action & Delegation   |
                +-----------+-----------+
                            |
                            v
                +-----------------------+
                | Checkpoint/Recovery/  |
                | Handoff               |
                +-----------+-----------+
                            |
              +-------------+-------------+
              v                           v
  +-----------------------+   +-----------------------+
  | External Truth Views  |   | Safe Runtime Views    |
  +-----------------------+   +-----------------------+
```

- 图表达内部语义依附与支撑关系，不表达函数调用、事件顺序或运行时拓扑。
- Checkpoint / Recovery / Handoff 横切所有核心语境；图中纵向位置不表示只在末尾发生。
- External Truth Views 的主语是本地消费边界，不是外部 truth 副本。
- Safe Runtime Views 只读派生，本地 outcome 先于外部消费状态成立。

## 6. 逐架构单元卡片与停审

| 单元 | 正式职责 | 非职责 | 统一语言 | 本地影子边界 | 停审 |
|---|---|---|---|---|---|
| Run & Goal-Plan | run / turn、goal / plan working state、progress decision | WorkItem / ProcessInstance / Artifact / Method body | run、turn、working goal、working plan、waiting、blocked、terminal | 只持业务目标 / 计划 refs，不持正文 | pass |
| Context & Memory | composition、source precedence、budget / gap、working memory、candidate use | 外部正文、durable memory body / index / retention | source、working set、snapshot、candidate、freshness、budget、gap | safe snapshot / ref / candidate 不能升级 truth | pass |
| Model Decision | intent、logical selection、turn correlation / disposition、safe summary | provider route / secret / quota / cost、raw response、hidden reasoning | intent、candidate constraint、selection、disposition、reason category | adapter availability 只是 view，不是 provider truth | pass |
| Action & Delegation | action choice、formal preconditions、delegation scope / budget、incorporation | Tool execution / audit、approval、Sandbox run、member lifecycle | no-action、tool action、delegation、precondition、unknown side effect、incorporation | outcome / receipt 只消费 ref / summary | pass |
| Checkpoint / Recovery / Handoff | stable point、resume / retry / wait / reflection decision、outcome、attempt / gap | 外部 truth repair、delivery、observed、acceptance | checkpoint、stable point、recovery、reflection candidate、local outcome、handoff gap | 外部反馈形成新关联事实，不改历史 | pass |
| Entry & Control | formal trigger、control intent、safe query boundary | product UI、member host、SDK client lifecycle | trigger、control request、status view、reject | principal / scope 只消费正式 refs | pass |
| External Truth Views | owner-anchored ref / snapshot / availability / conflict / stale | registry、definition / policy / artifact / capture / memory body | source owner、typed ref、safe snapshot、availability、stale、conflict | 全部可失效、可刷新、不可反写 | pass |
| Safe Runtime Views | status / outcome / decision / handoff safe projection | Runtime truth mutation、observed / acceptance truth | safe view、redaction、correlation、projection gap | 可重建、可延迟、无写源能力 | pass |

## 7. 跨上下文语义审计

| 审计项 | 结论 | 状态 |
|---|---|---|
| 职责重叠 | Action 选择与 Tools / Sandbox 执行已分离；Model selection 与 route 已分离。 | pass |
| 核心子域误归类 | External Truth Views / Safe Runtime Views 均未升级为核心 truth。 | pass |
| 投影反写 | Safe Runtime Views 无 truth mutation 责任。 | pass |
| 统一语言冲突 | run outcome、Tool outcome、Sandbox result、observed、accepted 均保留限定语。 | pass |
| Memory 混层 | working、retrieval、candidate、durable truth 分层，durable owner pending。 | pass |
| 子代理串线 | delegation 属 Action，host / container / Sandbox lifecycle 保留外部。 | pass |
| 待确认保留 | model adapter、durable memory、Tools-Sandbox、event route 未被上下文划分伪装闭口。 | pass |

## 8. 回填与门禁

正式第 6 章采用划分表、关系图和统一语言边界；不将卡片误写成代码模块。所有单元已逐个停审，跨上下文审计无 unresolved 冲突。

```text
gate_status = pass
next_allowed_action = create_01_arch_step_06_container_deployment
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_06_start
```
