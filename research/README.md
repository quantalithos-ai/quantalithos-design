# research — 调研

> **目录定位**:Quantalithos 对**新技术、前沿论文、竞品、框架、协议**的调研成果。不是规范(规范在 standards/),不是方法论(方法论在 methodology/),是**未定型的探索**。

---

## 一、目录构成

```
软件开发流程标准体系.md              软件过程标准体系的整理(与 methodology 互补)
standards-and-protocols-research.md  标准与协议综合调研(feedback_research_principles 的源头)
llm-ecosystem-overview.md            LLM 生态整体综述
design-workflow-mcp-research.md      Design Workflow + MCP 专题调研

agent-patterns/                      Agent 协作模式调研
frameworks/                          框架对比(LangGraph / Anthropic SDK / Temporal / …)
protocols/                           协议调研(MCP / A2A / AG-UI / OTel GenAI / CloudEvents / …)
competitors/                         竞品分析(Cursor / Copilot / Devin / OpenClaw / Superpowers / …)
studies/                             专题研究
```

---

## 二、与其他目录的分工

| 目录 | 作用 |
|---|---|
| **research/** (本目录) | 探索 / 调研 / 未定型 |
| `methodology/` | 学习国际标准(定型) |
| `standards/` | 必守规则(强制) |
| `architecture/` | 系统分解(决策) |
| `product/` | 产品叙事(定位) |

**Research → Methodology → Standards** 的升级路径:
- 一个 Research 结论经过多次验证且值得成为"学习对象",升级为 `methodology/` 讨论文档
- 一个 `methodology/` 结论被 Quantalithos 设计明确吸纳,升级为 `standards/` 必守规则
- 这条路径是单向的(ADR 记录升级决策)

---

## 三、调研结论的应用

本目录的关键产出汇集在记忆 `feedback_research_principles.md`,包含:
- 框架借鉴要点(LangGraph / Anthropic SDK / Temporal / OpenAI SDK / AutoGen / CrewAI / Superpowers)
- 过程引擎设计原则
- 14 种多 Agent 失败模式
- 错误级联防御
- 指令冲突优先级
- AG-UI 协议
- 持久执行 ≠ Checkpoint
- 沙箱逃逸(gVisor/Firecracker)
- Prompt Injection 组合防御
- MCP 工具安全
- 记忆三层架构
- LLM 路由
- 自主性 5 级

所有设计决策在"做决策"前必须对照这份清单。

---

## 四、修订纪律

- 本目录文档允许**频繁更新**(调研本身就是 living document)
- 结论成熟后**从 research 升级到 methodology/standards** 走 ADR
- 新增调研不需要 ADR,直接加
- Research 结论与 `standards/` 冲突时,以 `standards/` 为准(除非走 ADR 升级)
