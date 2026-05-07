# Agent 框架对比总结

> 综合对比各框架的设计模式，提炼对 Quantalithos AI 的设计启示

---

## 一、核心维度对比

```
┌──────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│              │ LangGraph  │ OpenAI SDK │ Anthropic  │ CrewAI     │ AutoGen    │ Temporal   │
│              │            │            │ Agent SDK  │            │            │            │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 流程控制     │ 状态图     │ Handoff链  │ Agent Loop │ Process    │ GroupChat  │ 代码定义   │
│ 方式         │ (硬约束)   │ (半强制)   │ (自由)     │ (顺序/层级)│ (对话)     │ (硬约束)   │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ Agent 能否   │ ❌ 不能    │ ⚠️ 可选择  │ ✅ 完全    │ ❌ 不能    │ ⚠️ Manager │ ❌ 不能    │
│ 跳步         │ 图的边决定 │ 不 handoff │ 自由       │ 顺序固定   │ 决定       │ 代码决定   │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 等待用户     │ checkpoint │ ❌ 无      │ ❌ 无      │ ❌ 无      │ human_input│ Signal     │
│              │ + interrupt│            │            │            │ _mode      │ (持久化)   │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 持久化       │ checkpoint │ ❌ 无      │ ❌ 无      │ ❌ 无      │ ❌ 无      │ ✅ 自动    │
│              │ (可选)     │            │            │            │            │ (核心特性) │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 多 Agent     │ 多节点     │ Handoff    │ Sub-Agent  │ Crew       │ GroupChat  │ 多 Activity│
│ 协作         │ (图内)     │ (转交)     │ (派发)     │ (角色分工) │ (对话)     │ (工作流内) │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 工作流定义   │ Python代码 │ ❌ 无      │ ❌ 无      │ Task列表   │ ❌ 无      │ Python代码 │
│ 格式         │ (StateGraph│            │            │ (代码)     │            │ (Workflow) │
│              │  API)      │            │            │            │            │            │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 条件分支     │ conditional│ Handoff    │ ❌ 无      │ ❌ 无      │ speaker    │ if/else    │
│              │ _edges     │ 选择       │            │            │ selection  │ (代码)     │
├──────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 循环         │ ✅ 边可    │ ❌ 无      │ ✅ Agent   │ ❌ 无      │ ✅ 对话    │ ✅ 代码    │
│              │ 指向前面   │            │ Loop 本身  │            │ 轮次       │ while/for  │
└──────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

## 二、各框架最值得借鉴的设计

| 框架 | 借鉴点 | 映射到我们的设计 |
|------|--------|-----------------|
| LangGraph | StateGraph 硬约束 + checkpoint | AgentWorkflowEngine 的图驱动 + 状态持久化 |
| LangGraph | conditional_edges 条件路由 | GatewayNode 的条件判断 |
| LangGraph | interrupt() 等待用户 | 门禁审批 + Assistant 等待用户回复 |
| OpenAI SDK | Guardrails 输入/输出校验 | shared_rules 的 schema 硬校验 |
| OpenAI SDK | Handoff 控制权转交 | Assistant → TL 的交接 |
| Anthropic SDK | Agent Loop (think→act) | AgentExecutor 的核心循环 |
| Anthropic SDK | Sub-Agent 独立上下文 | 工作流节点的独立执行 |
| Anthropic SDK | 精确构造子 Agent 上下文 | NodeAssignment.action + input_refs |
| CrewAI | Role + Goal + Backstory | RoleDefinition 的 identity + constraints |
| CrewAI | output_pydantic 结构化输出 | output_schema + submit_step_result |
| AutoGen | GroupChat 多人讨论 | session (collaboration) 模式 |
| AutoGen | Sequential Chat 顺序对话 | 项目级工作流的节点顺序 |
| AutoGen | Nested Chat 嵌套对话 | ask_teammate 即时沟通 |
| Temporal | Signal 等待外部输入 | 门禁审批 + 用户回复 |
| Temporal | 持久化执行 + 崩溃恢复 | 快照 + 恢复机制 |
| Temporal | Activity 重试策略 | LLM 调用重试 + 工具执行重试 |
| Superpowers | SKILL.md 行为约束 | shared_rules 的 content 字段 |
| Superpowers | 子 Agent 最小上下文 | NodeAssignment 只传必要信息 |
| Superpowers | 两阶段审查 | code_review 可拆为 spec_review + quality_review |

## 三、对 AgentWorkflowEngine 的最终设计建议

综合各框架的优点：

```
AgentWorkflowEngine 应该结合：

  LangGraph 的图驱动（硬约束流程控制）
  + Anthropic 的 Sub-Agent（每个节点独立上下文）
  + Temporal 的 Signal（等待用户输入）
  + LangGraph 的 checkpoint（状态持久化）

具体做法：

  1. 流程控制 = LangGraph 模式
     ProcessDefinition 的 edges = 硬约束
     Agent 不知道下一步是什么
     引擎按 edges 推进

  2. 节点执行 = Anthropic Sub-Agent 模式
     每个节点创建独立的执行上下文
     只注入当前节点需要的信息
     节点完成后结果压缩传给下一个节点
     → 解决对话历史膨胀问题

  3. 等待用户 = Temporal Signal 模式
     引擎在等待用户时暂停
     保存完整状态（当前节点、已完成节点的 output、对话历史）
     用户回复后从状态恢复继续
     → 解决 Assistant 等待用户的问题

  4. 持久化 = LangGraph checkpoint 模式
     每完成一个节点保存 checkpoint
     进程重启后从 checkpoint 恢复
     不重复执行已完成的节点
     → 解决崩溃恢复问题
```

```
最终架构：

                    ProcessDefinition (YAML)
                    nodes + edges
                           │
                           ▼
                ┌─────────────────────┐
                │ AgentWorkflowEngine │
                │                     │
                │ 图驱动（LangGraph）  │ ← 硬约束流程控制
                │ checkpoint 持久化   │ ← 崩溃恢复
                │ signal 等待用户     │ ← 人类参与
                │                     │
                └──────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         ┌─────────┐ ┌─────────┐ ┌─────────┐
         │ Node 1  │ │ Node 2  │ │ Node 3  │
         │         │ │         │ │         │
         │独立上下文│ │独立上下文│ │独立上下文│  ← Sub-Agent 模式
         │独立对话  │ │独立对话  │ │独立对话  │
         │历史     │ │历史     │ │历史     │
         │         │ │         │ │         │
         │ output  │ │ output  │ │ output  │
         │   ↓     │ │   ↓     │ │   ↓     │
         └────┬────┘ └────┬────┘ └─────────┘
              │            │
              ▼            ▼
         下一节点的    下一节点的
         input_refs   input_refs
```

## 四、参考文档

| 框架 | 调研文档 |
|------|---------|
| LangGraph | [langgraph-study-guide.md](langgraph-study-guide.md) |
| OpenAI Agents SDK | [openai-agents-sdk-study-guide.md](openai-agents-sdk-study-guide.md) |
| Anthropic Agent SDK | [anthropic-agent-sdk-study-guide.md](anthropic-agent-sdk-study-guide.md) |
| AutoGen | [autogen-study-guide.md](autogen-study-guide.md) |
| Temporal | [temporal-study-guide.md](temporal-study-guide.md) |
| OpenClaw/Superpowers | [openclaw-superpowers-study-guide.md](openclaw-superpowers-study-guide.md) |
| CrewAI | [crewai-study-guide.md](crewai-study-guide.md)（已有） |
| Hermes Agent | [hermes-agent-study-guide.md](hermes-agent-study-guide.md)（已有） |
| LangChain | [langchain-study-guide.md](langchain-study-guide.md)（已有） |
