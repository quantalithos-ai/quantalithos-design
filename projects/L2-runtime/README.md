# quantalithos-runtime

> **仓使命**:Runtime Process(Python 大脑进程),AI 员工容器内的**决策中枢**。9 子模块承载 LLM 推理 + 记忆 + 工具调用 + 反思。  

---

## 仓定位

- **层**:L2 Member 运行层
- **技术栈**:Python 3.12+(贴近 AI 生态)
- **运行位置**:容器内进程(与 Member Process 并列)

---

## 主要对齐

- **LangGraph StateGraph**(ReAct 硬约束 + Checkpoint)
- **Anthropic SubAgent**(独立上下文子 Agent)
- **Temporal 持久执行**(每步 checkpoint)
- **OpenAI Guardrails**(前置 / 后置 Schema 校验)
- **Research 记忆三层**(working / episodic / semantic)
- **Research 指令优先级**(shared_rules 最高)
- **Research LLM 路由**(按任务复杂度选模型)
- **ISO 42001 可解释性**(reasoning_trace 持久化)

---

## 九子模块(C1-C9)

```
Runtime Process
├─ C1 LLM Loop           ReAct + StateGraph 硬约束
├─ C2 Prompt Composer    四层(shared_rules → role → policy → context)
├─ C3 Memory Store       working / episodic / semantic 严格分离
├─ C4 Goal / Plan        目标栈 + 计划步骤
├─ C5 Context Manager    对话 / 项目 / 时间 / Goal / Memory 聚合
├─ C6 Policy Cache       governance 下发规则本地缓存
├─ C7 Checkpoint Store   每步持久化(ADR-0007)
├─ C8 Sub-Agent Spawner  独立上下文子 Agent
└─ C9 Tool Invoker       Guardrails + Policy + Schema
```

详见 `architecture/ai-member设计.md` §四。

---

## 关键依赖

### 上游
- `quantalithos-sdk`(Python SDK,访问 L1 业务真相域与 workspace 视图)
- `quantalithos-member`(容器内 IPC)
- `quantalithos-tools`(Tool 集)
- 外部:Anthropic / OpenAI / 自托管 LLM(通过 capability-hub 代理)+ 外部向量库(Memory)

### 下游
- 被 `quantalithos-member-images` 打包到容器

---

## 目录结构

```
quantalithos-runtime/
├── pyproject.toml
├── src/quantalithos_runtime/
│   ├── llm_loop.py         C1
│   ├── composer.py         C2
│   ├── memory/             C3(三层)
│   ├── goal.py             C4
│   ├── context.py          C5
│   ├── policy_cache.py     C6
│   ├── checkpoint.py       C7
│   ├── subagent.py         C8
│   ├── tool_invoker.py     C9
│   └── main.py
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` RT 条目:
- **RT1** LLM Loop 用 StateGraph 硬约束,不纯 prompt 控制
- **RT2** Prompt 分层 shared_rules → role → policy → context,最外层不可覆盖
- **RT3** Memory 三层严格分离,不混写
- **RT4** Tool 前后置 Guardrails 校验
- **RT5** 每步 Checkpoint 到外部持久层(ADR-0007)
- **RT6** Reasoning trace 完整持久化(42001 可解释性)
- **RT7** Sub-Agent 独立上下文
- **RT8** LLM 路由按任务复杂度选模型

---

## 详细设计参考

- `architecture/ai-member设计.md` §四(9 子模块详细设计)
- `architecture/adr/0006-memory-persistence-in-identity.md`(Memory)
- `architecture/adr/0007-checkpoint-persistence-in-process.md`(Checkpoint)

---

## 开放问题

参考 `architecture/ai-member设计.md` §十一。

---

## 性能

- LLM Loop 单步延迟(不含 LLM 调用)< 50ms
- Checkpoint 写入延迟 P95 < 100ms
- Memory 反思式检索 P95 < 500ms
