# MCP — Model Context Protocol

> Anthropic 2024 年发布的开放标准，定义 AI 模型如何连接外部工具和数据源
> 对我们的价值：runtime 工具系统应兼容 MCP，复用 1600+ 社区工具

---

## 一、概述

MCP 是 Anthropic 发布的开放协议，解决的核心问题是：**每个 AI 应用都要自己写工具集成代码，重复劳动巨大。**

```
没有 MCP：
  App A 要连 GitHub → 自己写 GitHub API 封装
  App B 要连 GitHub → 又自己写一遍
  App C 要连 GitHub → 再写一遍

有了 MCP：
  社区写一个 GitHub MCP Server
  App A/B/C 都通过 MCP 协议连接这个 Server
  → 写一次，到处用
```

当前生态：1600+ MCP Server，覆盖数据库、文件系统、API、浏览器、代码仓库等。

## 二、核心概念

### 2.1 架构

```
┌──────────────┐     MCP 协议      ┌──────────────┐
│  MCP Client  │ <──────────────> │  MCP Server  │
│  (AI 应用)   │   JSON-RPC       │  (工具提供者) │
│              │   over stdio     │              │
│  我们的      │   or HTTP+SSE    │  GitHub      │
│  runtime     │                  │  PostgreSQL  │
│              │                  │  文件系统     │
└──────────────┘                  └──────────────┘
```

### 2.2 三种能力

MCP Server 可以提供三种能力：

```
1. Tools（工具）
   Server 暴露可调用的函数
   例：github_create_issue(title, body)
   → 对应我们的 ToolDefinition

2. Resources（资源）
   Server 暴露可读取的数据
   例：file:///workspace/src/main.rs
   → 对应我们的 file_read 工具

3. Prompts（提示模板）
   Server 暴露预定义的 prompt 模板
   例：code_review_prompt(diff)
   → 对应我们的 shared_rules 的 content 部分
```

### 2.3 协议格式

```json
// Client → Server：调用工具
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "github_create_issue",
    "arguments": {
      "title": "实现标签系统",
      "body": "用户可以给文章添加标签..."
    }
  },
  "id": 1
}

// Server → Client：返回结果
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Issue #42 created successfully"
      }
    ]
  },
  "id": 1
}

// Server 声明自己有哪些工具
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "result": {
    "tools": [
      {
        "name": "github_create_issue",
        "description": "Create a new GitHub issue",
        "inputSchema": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "body": { "type": "string" }
          },
          "required": ["title"]
        }
      }
    ]
  }
}
```

### 2.4 传输方式

```
1. stdio（本地进程）
   Client 启动 Server 进程，通过 stdin/stdout 通信
   适合：本地工具（文件系统、Git）

2. HTTP + SSE（远程服务）
   Client 通过 HTTP POST 发送请求
   Server 通过 SSE 推送结果
   适合：远程服务（数据库、API）
```

## 三、与我们的工具系统对比

```
我们当前的工具系统：

class ToolDefinition:
    name: str                    # "file_read"
    description: str             # 给 LLM 看的描述
    parameters: dict             # JSON Schema
    handler: Callable            # 执行函数

MCP 的工具定义：

{
    "name": "file_read",
    "description": "Read a file",
    "inputSchema": {             # 和我们的 parameters 一样，都是 JSON Schema
        "type": "object",
        "properties": { ... }
    }
}

对比：
  字段名不同（parameters vs inputSchema），但结构相同（都是 JSON Schema）
  我们的 handler 是 Python 函数，MCP 的 handler 在 Server 进程里
  我们的工具是进程内调用，MCP 是跨进程调用（JSON-RPC）
```

## 四、兼容方案

### 4.1 runtime 作为 MCP Client

```
方案：runtime 的工具注册表同时支持两种工具来源

ToolRegistry:
  ├── 内置工具（Python 函数）
  │   file_read, file_write, code_execute, git_commit
  │   submit_step_result, ask_teammate
  │
  └── MCP 工具（通过 MCP 协议调用外部 Server）
      github_create_issue, postgres_query, browser_navigate
      → 由 MCP Client 适配器封装为 ToolDefinition
```

```python
# tools/mcp_adapter.py

class MCPToolAdapter:
    """把 MCP Server 的工具适配为我们的 ToolDefinition"""

    async def load_tools(self, server_config: dict) -> List[ToolDefinition]:
        """连接 MCP Server，获取工具列表，转换为 ToolDefinition"""
        client = MCPClient(server_config)
        mcp_tools = await client.list_tools()

        return [
            ToolDefinition(
                name=tool["name"],
                description=tool["description"],
                parameters=tool["inputSchema"],  # 直接复用 JSON Schema
                handler=lambda **args: client.call_tool(tool["name"], args),
                category="mcp",
            )
            for tool in mcp_tools
        ]
```

### 4.2 工具定义格式统一

```yaml
# 角色定义中，内置工具和 MCP 工具统一引用

role_id: backend_dev
tools:
  # 内置工具
  - file_read
  - file_write
  - code_execute
  - git_commit

  # MCP 工具（前缀标识来源）
  - mcp://github/create_issue
  - mcp://postgres/query

# MCP Server 配置
mcp_servers:
  github:
    command: "npx @modelcontextprotocol/server-github"
    env:
      GITHUB_TOKEN: "${GITHUB_TOKEN}"
  postgres:
    command: "npx @modelcontextprotocol/server-postgres"
    env:
      DATABASE_URL: "${DATABASE_URL}"
```

### 4.3 安全考虑

```
MCP 工具的安全风险（arxiv 2601.17548）：
  - 第三方 MCP Server 可能有恶意代码
  - MCP Server 可能泄露敏感数据
  - MCP Server 的 inputSchema 可能被篡改

防御措施：
  1. 白名单：只允许审核过的 MCP Server
  2. 沙箱：MCP Server 在隔离环境中运行
  3. 审计：记录所有 MCP 工具调用
  4. 权限：MCP 工具也受角色级 + 节点级权限校验
```

## 五、Phase 分期

| Phase | 范围 |
|-------|------|
| Phase 1 | 不实现 MCP，只用内置工具 |
| Phase 2 | 实现 MCP Client 适配器，支持加载 MCP Server |
| Phase 3 | MCP 工具白名单、安全审计、沙箱隔离 |

## 六、参考

- 规范：https://spec.modelcontextprotocol.io/
- GitHub：https://github.com/modelcontextprotocol
- Server 列表：https://github.com/modelcontextprotocol/servers
