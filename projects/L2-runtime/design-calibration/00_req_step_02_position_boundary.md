# L2-runtime 00 需求 Step 2: 本仓定位与边界

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 2 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 本仓定位与边界 |
| 已读取 | 项目台账、需求 flow、Step 1、强制标准、专项上游边界章节 |
| 当前模式 | full-restart;先独立定位,后审计旧材料 |
| 禁止内容 | 功能清单、接口、字段、状态机、技术栈、部署形态 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 一句话定位 | done | owner 定义 | pass |
| 非职责排除 | done | 非 owner 清单 | pass |
| 相邻边界审计 | done | 边界对象表 | pass |
| 历史差异审计 | done | 污染项表 | pass |
| 回填草稿与自检 | done | 第 2 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓一句话定义是什么? | `L2-runtime` 是平台 AI 成员运行层中负责受控运行循环、运行时决策、上下文工作态、行动编排、恢复与运行结果交接语义的真相仓。 |
| 为什么单独成仓? | 决策循环与运行状态必须独立于工具合同、capability registry、方法定义、治理结论、隔离执行和成员宿主生命周期,否则所有相邻 owner 会被一个“大脑”概念吞并。 |
| 本仓不是什么? | 不是工具执行仓、能力目录/外部 adapter truth、方法正文仓、治理裁决仓、Sandbox、Observability backend、member-service、member-images、marketplace 或产品入口。 |
| 最易混淆对象? | Tools、Capability Hub、Method Library、Governance、Sandbox、Observability、Member Service、Artifact、Bus、SDK。 |

## 3. 当前文档问题诊断

| 旧口径 | 问题 | 新边界 |
|---|---|---|
| “AI 员工容器内的大脑进程” | 把逻辑 owner 与部署 / 容器形态绑定 | Runtime 是逻辑运行真相仓,部署后移架构。 |
| 九模块 C1~C9 | 旧模块清单直接代替仓定位 | 先定义 owner,后由能力闭环重新推导。 |
| Policy Cache | 容易把缓存误写成 Policy truth | Runtime 只消费带来源 / 有效性语境的 Governance 结论。 |
| Tool Invoker 直连 Sandbox / provider | 会越过 Tools 工具语义 owner和 adapter 边界 | Runtime 编排 canonical tool invocation,结果解释由 Tools;Sandbox 通过正式 seam。 |
| Reasoning trace 正文持久化 | 可能泄漏隐藏推理、外部正文和 secret | 只要求安全 decision summary、trace linkage 与审计材料。 |
| ExecutionInstance / WorkItem promote 主线 | 混入 Process / Work / Artifact 真相 | Runtime 只拥有自身 run / loop / plan-working-state 和正式外部 refs。 |

## 4. 设计取舍

| 取舍项 | 当前决定 | 边界理由 |
|---|---|---|
| Runtime truth 主语 | 受控 Runtime run、loop position、goal/plan working state、context working set、model/action decision、checkpoint/recovery、runtime outcome | 这些语义若外置,无法形成可恢复决策循环。 |
| Model routing | Runtime 拥有逻辑 model intent、候选评估、选择决定和 provider-neutral turn 编排 | provider secret、physical route、quota、cost、billing 与 provider runtime 不归 Runtime。 |
| Memory | Runtime 拥有 working memory 与本次运行的检索 / 候选 / 引用语境 | durable episodic / semantic body、索引和保留删除归外部 owner。 |
| Sub-agent | Runtime 拥有逻辑委派、子上下文隔离、预算 / scope、结果回收关系 | 不拥有成员容器、镜像、进程或 Sandbox lifecycle。 |
| Reflection | Runtime 拥有对已提交结果形成新 reflection decision / candidate 的语义 | 不原地改写历史,不自动写入 Method / durable memory truth。 |
| Tool action | Runtime 选择何时行动并消费 Tools canonical contract / outcome | 不拥有 ToolDefinition、normalized tool result 或 execution truth。 |
| Event handoff | Runtime 拥有已提交运行事实与本地 handoff attempt / gap | 不拥有 Bus delivery、Observability observed 或下游消费 truth。 |

## 5. 结构化边界产物

| 字段 | 内容 | 不写什么 |
|---|---|---|
| 一句话定义 | `L2-runtime` 是平台 AI 成员运行层中负责受控运行循环、运行时决策、上下文工作态、行动编排、恢复与运行结果交接语义的真相仓。 | 不写进程、框架、语言或部署。 |
| 本仓不是什么 | 它不是 tools execution、capability registry、external adapter truth、method source、governance approval、sandbox isolation、observability backend、member lifecycle、image packaging、marketplace 或产品入口。 | 不展开接口 / 数据清单。 |
| 边界对象列表 | 仓:`L2-tools`;`L3-capability-hub`;`L3-method-library`;`L1-governance`;`L4-sandbox`;`L4-observability`;`L2-member-service`;`L2-member-images`;`L1-artifact`;`L0-bus`;`L0-sdk`;概念:model provider route、durable memory body。 | 不解释调用链。 |
| 单独成仓原因 | 平台需要一个独立于定义、裁决、执行基础设施和宿主生命周期的可恢复决策运行真相边界。 | 不提前做架构选型。 |

### 5.1 Owner / consumer 边界

| 主题 | Runtime 拥有 | Runtime 只消费 / 交接 | Runtime 禁止拥有 |
|---|---|---|---|
| loop | run / loop / turn 的运行语义 | 外部触发与终止请求 | Member host lifecycle |
| goal / plan | 当前 run 的目标分解、计划工作态和推进决定 | Method / Process / Work / Artifact refs | Method body、ProcessInstance、WorkItem、ImplementationPlan body truth |
| context / memory | working set、composition decision、memory query / candidate / refs | 外部 safe snapshot / ref | 外部正文、durable episodic / semantic truth |
| model | model intent、选择决定、turn orchestration、semantic result | adapter capability / health summary | secret、physical route、quota、cost、provider raw truth |
| action | action choice、Tool invocation orchestration、sub-agent delegation | Tools outcome、Governance decision、Sandbox / adapter status through formal seam | Tool contract/outcome、approval、Sandbox run |
| recovery | Runtime checkpoint、resume position、reflection/recovery decision | external dependency status / immutable refs | Process checkpoint、external truth repair |
| handoff | Runtime outcome、safe handoff material eligibility、local attempt / gap | Bus / Observability / downstream receipt | delivery、observed、acceptance / evidence verdict |

## 6. 历史材料差异审计

| 历史项 | 处置 |
|---|---|
| Python 3.12、LangGraph、Temporal、OpenAI / Anthropic、vector store | historical technology candidate;不得进入需求定位。 |
| shared_rules 固定四层 prompt | 可作上下文优先级问题线索;具体层级与字段后续重新校准。 |
| 每步 checkpoint、固定性能数字 | “可恢复”保留为需求主题;频率和数字不继承。 |
| reasoning_trace 完整正文 | 拒绝继承;改为安全、最小、可关联 decision / outcome traceability。 |
| PlanItem promote child WorkItem | Runtime 可产生协作请求 / ref,但 Work truth 与正式 promote 归 Work owner;不作为核心 Runtime truth。 |

## 7. 回填草稿

`L2-runtime` 是平台 AI 成员运行层中负责受控运行循环、运行时决策、上下文工作态、行动编排、恢复与运行结果交接语义的真相仓。它需要单独存在,因为 Runtime 必须对“当前为何继续、等待、行动、恢复或结束”形成可追溯真相,同时不接管工具合同、能力目录、方法定义、治理裁决、隔离执行、观测存储和成员宿主生命周期。

## 8. 待确认事项

- Runtime logical model selection 已归本仓;physical provider route / secret / quota / cost 的正式 owner 仍 pending。
- Durable episodic / semantic memory owner 不在本仓内,具体归属后续只以 pending adapter boundary 承接。

## 9. 自检与门禁

| 检查 | 结果 |
|---|---|
| 3~5 句话可说明定位 | pass |
| 相邻 owner 无合并 | pass |
| model / memory / sub-agent 边界明确 | pass |
| 无接口、字段、技术栈 | pass |

```text
gate_status = pass
next_allowed_action = create_step_03_problem_context
formal_document_write_allowed = false
```
