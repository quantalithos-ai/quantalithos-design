# L2-runtime 00 需求 Step 8: 用户故事

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 8 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 5 角色、Step 7 C-L2R-1~5 |
| 小循环 | 按 C1 -> C2 -> C3 -> C4 -> C5 逐节点收敛并停审 |
| 禁止 | 接口名、功能名堆叠、内部模块、实现顺序 |

## 1. Step 内计划

| 节点 / 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| C1 stories | done_stop_review | US-L2R-001~003 | pass |
| C2 stories | done_stop_review | US-L2R-004~006 | pass |
| C3 stories | done_stop_review | US-L2R-007~009 | pass |
| C4 stories | done_stop_review | US-L2R-010~012 | pass |
| C5 stories | done_stop_review | US-L2R-013~015 | pass |
| cross-node audit | done | 无孤儿 / 重复 / 串线 | pass |
| 回填与自检 | done | 第 8 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些角色目标支撑核心闭环? | 运行触发方需要受控 run;上下文提供方需要 source-safe consumption;模型 / 工具协作方需要稳定中立的 action contract;调查 / 审查者需要可恢复和可追溯;消费方需要 safe handoff。 |
| 哪些是外围增强? | 多 model ensemble、interactive debugger、跨 run analytics、自动长期学习等不决定基础闭环。 |
| 哪些故事不应进入? | 管理 provider secret / quota / cost、创建 ToolDefinition、审批 Policy、创建 Sandbox、管理 member container、写 Artifact 正文。 |
| 是否有孤儿故事? | 否;15 个核心故事全部映射 C1~C5,外围故事单列。 |

## 3. 核心用户故事

| ID | 用户故事 | 优先级 | 核心节点 | 价值 / 验收方向 |
|---|---|---|---|---|
| `US-L2R-001` | 作为运行触发方,我希望以正式主体、目标和约束启动一次 Runtime run,以便运行不会由匿名输入或产品私有状态隐式产生。 | P0 | C1 | 正式受理或明确拒绝,不隐式创建。 |
| `US-L2R-002` | 作为运行触发方,我希望 Runtime 围绕目标维护可解释的 plan working state,以便每次继续、等待或结束都有目标来源。 | P0 | C1 | goal / plan 工作态可回链,不复制 Work / Method 正文。 |
| `US-L2R-003` | 作为运行问题调查者,我希望区分 run 的 active、waiting、blocked、cancelled、completed 与 failed 语义,以便外部依赖未就绪不会被误判为失败或成功。 | P0 | C1 | 状态语义可判断,非法推进被阻止。 |
| `US-L2R-004` | 作为正式上下文提供方,我希望 Runtime 只按 ref、scope、时点和允许摘要消费我的事实,以便源 truth 与正文仍由我拥有。 | P0 | C2 | source / owner / freshness / forbidden body 可验证。 |
| `US-L2R-005` | 作为运行触发方,我希望当前决策使用与目标相关且受预算约束的 working context,以便无关或过量上下文不会静默支配行动。 | P0 | C2 | composition 可解释,缺口与裁剪显式。 |
| `US-L2R-006` | 作为安全 / 边界审查者,我希望 working、episodic、semantic memory 语义与候选写入分开,以便 Runtime 不把检索结果或反思候选私自升级为长期真相。 | P0 | C2 | memory 分层、candidate / committed 分离。 |
| `US-L2R-007` | 作为运行触发方,我希望 Runtime 根据当前意图和约束作出 provider-neutral model choice,以便 provider 更换不改变目标与决策语义。 | P0 | C3 | model intent、candidate 与 selection 可回链。 |
| `US-L2R-008` | 作为模型适配协作方,我希望接收稳定的 model turn 语境并返回可关联结果或明确失败,以便我不需要拥有 Runtime goal / plan。 | P0 | C3 | request / result correlation 与错误分层。 |
| `US-L2R-009` | 作为运行问题调查者,我希望看到安全的 model decision summary 和来源关联,以便能解释选择与结果而不暴露隐藏推理、secret 或 provider 正文。 | P0 | C3 | 最小可解释材料,禁止 chain-of-thought body。 |
| `US-L2R-010` | 作为运行触发方,我希望 Runtime 能在 no-action、tool action 和 sub-agent delegation 中作出受控选择,以便行动只服务当前目标。 | P0 | C4 | action choice 有来源、scope 和显式 no-action。 |
| `US-L2R-011` | 作为工具行动协作方,我希望 Runtime 只通过正式 Tool 合同提交 canonical invocation 并消费 normalized outcome,以便 Runtime 不复制工具执行语义。 | P0 | C4 | Tools owner 不被旁路;governed / sandbox-required fail closed。 |
| `US-L2R-012` | 作为安全 / 边界审查者,我希望 sub-agent 拥有明确 scope、预算、隔离上下文与返回边界,以便委派不会变成无界并发或成员 / 容器生命周期管理。 | P0 | C4 | child context 隔离、结果回收、unknown side effect 明确。 |
| `US-L2R-013` | 作为运行触发方,我希望 Runtime 在稳定点 checkpoint 并从合法位置 resume,以便崩溃或暂停后不会盲目重做已发生行动。 | P0 | C5 | stable point、unknown side effect、duplicate fence 可判断。 |
| `US-L2R-014` | 作为运行问题调查者,我希望 reflection / recovery 基于已提交历史形成新决定,以便失败修复不原地改写过去或伪造外部成功。 | P0 | C5 | history immutable,新事实 / 新决定可关联。 |
| `US-L2R-015` | 作为运行材料消费方,我希望消费 body-free、可关联的 Runtime status / outcome handoff,以便外部 delivery / observed 失败不改变 Runtime 本地结果。 | P0 | C5 | local truth first;attempt / delivered / observed 分层。 |

## 4. 外围增强故事

| ID | 用户故事 | 边界 |
|---|---|---|
| `US-L2R-E01` | 作为 Runtime 维护者,我希望比较多种 planning / model 策略的派生结果,以便优化运行质量。 | 只读 / 实验性,不改变正式 run 历史。 |
| `US-L2R-E02` | 作为调查者,我希望使用 interactive replay preview 和跨 run analytics,以便定位复杂回归。 | 不实际重放副作用,不成为 Observability backend。 |
| `US-L2R-E03` | 作为运行触发方,我希望获得成本 / 资源优化建议,以便选择更合适的执行策略。 | 只消费外部 safe summary,不拥有 cost / quota truth。 |
| `US-L2R-E04` | 作为维护者,我希望将 reflection candidate 送交长期学习审查,以便改进后续运行。 | 只 handoff candidate,不自动写 Method / durable memory truth。 |

## 5. 边界外故事排除

| 候选故事 | 排除原因 | Owner / 正确边界 |
|---|---|---|
| 管理 ToolDefinition / provider registry | 定义和接入 truth 不归 Runtime | Tools / Capability Hub。 |
| 决定 approval / effective Policy | Runtime 不得自我授权 | Governance。 |
| 启停 Sandbox / member container / image | 隔离与宿主生命周期不归 Runtime | Sandbox / member-service / member-images。 |
| 保存 Artifact / Evidence / reasoning body | 正文 / evidence / hidden reasoning 越界 | Artifact / Observability;只交 safe ref / summary。 |
| 管理 provider key / quota / cost / bill | provider control 不归 Runtime | adapter / security / finance owner。 |

## 6. 故事与节点映射及停审

| 节点 | 核心故事 | 节点停审结论 |
|---|---|---|
| C1 | US-001~003 | trigger、goal/plan、状态语义完整;无 Context / Tool 细节串入。 |
| C2 | US-004~006 | source-safe context、composition、memory 分层完整;无 durable body owner 侵入。 |
| C3 | US-007~009 | provider-neutral selection、turn、safe explanation 完整;无 secret / route / cost truth。 |
| C4 | US-010~012 | action choice、Tools contract、sub-agent boundary 完整;无 Tool / Sandbox / container owner 侵入。 |
| C5 | US-013~015 | checkpoint、immutable recovery、safe handoff 完整;无 delivery / observed 反写。 |

## 7. 跨节点故事审计

| 检查 | 结论 |
|---|---|
| 同一角色目标被重复拆分 | 否;每个故事有唯一主节点,必要关联在功能 / 规则阶段表达。 |
| 没有节点归属的核心故事 | 否。 |
| 功能名 / API / 组件伪装成故事 | 否。 |
| 相邻仓职责进入故事 | 否;全部进入排除表。 |
| 外围增强反向成为前置 | 否。 |

## 8. 当前文档诊断与取舍

旧故事集中在 StateGraph、固定 prompt、checkpoint、Guardrail 和 WorkItem promote,缺少 model owner、external truth body boundary、unknown side effect、safe handoff。新故事按五能力节点组织,以角色价值和边界为中心;WorkItem promote 降为边界外 Work 协作,不再作为 Runtime 核心故事。

## 9. 回填草稿

正式第 8 章采用本文件 §3~§6 的 15 条核心故事、4 条外围增强故事与节点映射。故事不承诺特定 provider、框架、API 或部署,并将工具合同、治理、Sandbox、观测和外部正文 owner 保持在 Runtime 之外。

## 10. 自检与门禁

```text
gate_status = pass
story_count = 15_core + 4_peripheral
orphan_story_count = 0
next_allowed_action = create_step_09_functional_requirements
formal_document_write_allowed = false
```
