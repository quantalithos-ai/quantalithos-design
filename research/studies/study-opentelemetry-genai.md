# OpenTelemetry GenAI Semantic Conventions

> OpenTelemetry 正在标准化 AI Agent 的可观测性语义约定
> 对我们的价值：runtime 和 flow 从 Phase 1 就按此标准埋点

---

## 一、概述

OpenTelemetry 是可观测性领域的事实标准（traces + metrics + logs）。2025 年开始扩展 GenAI 语义约定，定义 AI 系统应该记录哪些属性。

核心价值：**从第一天就按标准埋点，后续直接对接 Prometheus + Grafana + Langfuse，不需要自己发明追踪格式。**

## 二、GenAI 语义属性

```
gen_ai.system              = "openai" | "anthropic" | "local"
gen_ai.request.model       = "gpt-4" | "claude-sonnet-4-20250514"
gen_ai.request.max_tokens  = 4096
gen_ai.request.temperature = 0.7
gen_ai.response.model      = "gpt-4-0613"
gen_ai.usage.input_tokens  = 1500
gen_ai.usage.output_tokens = 800
gen_ai.usage.total_tokens  = 2300
gen_ai.response.finish_reasons = ["stop"] | ["tool_calls"]
```

## 三、与我们的映射

```
runtime 的每次 LLM 调用应记录：

Span: "gen_ai.chat"
  Attributes:
    gen_ai.system: "openai"
    gen_ai.request.model: "gpt-4"
    gen_ai.usage.input_tokens: 1500
    gen_ai.usage.output_tokens: 800
  
  我们额外加的属性：
    quantalithos.agent_id: "backend-dev-1"
    quantalithos.project_id: "blog"
    quantalithos.node_id: "implement"
    quantalithos.assignment_id: "a-042"
    quantalithos.round: 3                    # think→act 第几轮

工具调用应记录：

Span: "gen_ai.tool_call"
  Attributes:
    gen_ai.tool.name: "file_write"
    gen_ai.tool.call_id: "call_abc123"
  
  我们额外加的属性：
    quantalithos.agent_id: "backend-dev-1"
    quantalithos.tool.category: "builtin"    # builtin | dynamic | mcp
    quantalithos.tool.result: "success"
    quantalithos.tool.duration_ms: 45
```

## 四、跨服务追踪（W3C Trace Context）

```
用户请求的完整追踪链：

chat → gate → flow → runtime → LLM API
  │      │      │       │         │
  │      │      │       │         └── Span: gen_ai.chat
  │      │      │       └── Span: agent.execute
  │      │      └── Span: flow.dispatch
  │      └── Span: gate.proxy
  └── Span: chat.send_message

所有 Span 共享同一个 trace-id（W3C Trace Context）
→ 在 Grafana 里可以看到完整的调用链
→ 一眼看出延迟瓶颈在哪里
```

## 五、Phase 1 实现

```python
# runtime 的 structlog 配置，按 OpenTelemetry 格式输出

import structlog

logger = structlog.get_logger()

# LLM 调用日志
logger.info("gen_ai.chat",
    gen_ai_system="openai",
    gen_ai_request_model="gpt-4",
    gen_ai_usage_input_tokens=1500,
    gen_ai_usage_output_tokens=800,
    quantalithos_agent_id="backend-dev-1",
    quantalithos_node_id="implement",
    quantalithos_round=3,
)

# Phase 1 用 structlog JSON 输出
# Phase 2 接入 OpenTelemetry SDK，自动生成 Span
```

## 六、参考

- OpenTelemetry GenAI：https://opentelemetry.io/blog/2025/ai-agent-observability/
- 详细指南：https://uptrace.dev/blog/opentelemetry-ai-systems
- W3C Trace Context：https://www.w3.org/TR/trace-context/
