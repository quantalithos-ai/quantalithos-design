# quantalithos-tools

> **仓使命**:Runtime 可调用的**工具集 monorepo**。含内置 Tool(file / code / git / sandbox / lsp / test)+ MCP Client(外部工具代理)。不自治,只被 Runtime 调用。

---

## 仓定位

- **层**:L2 Member 运行层
- **技术栈**:Python(与 Runtime 同栈便于调用)
- **打包形态**:Python 包(被 member-images 装入镜像)

---

## 主要对齐

- **Research MCP**(Model Context Protocol 客户端)
- **Research OpenAI Guardrails**(input / output schema)
- **CrewAI output_pydantic**(结构化输出)
- **Research 沙箱逃逸**(危险 Tool 走 L4 sandbox)
- **Research MCP 安全**(白名单 + 签名)

---

## Tool 分类

### 内置 Tool(in-process)
- `file_ops` — file_read / file_write / file_search
- `code_ops` — code_search / ast_parse / lsp_query
- `git_ops` — 本地 git(不出容器)
- `sandbox_exec` — 通过 L4 sandbox 执行
- `test_ops` — 测试框架调用
- `browse` — 网页浏览(通过 capability-hub 代理)
- `search` — 搜索(同上)
- `docs_read` — 文档检索

### 外部 Tool(MCP Client)
- 通过 `quantalithos-capability-hub` 代理调用白名单 MCP Server
- 典型 MCP Tool:图像生成 / 特定领域 API / 专业工具

---

## 关键依赖

### 上游
- `quantalithos-core`(Tool 描述 schema)
- `quantalithos-sdk`(调 capability-hub)
- `quantalithos-sandbox`(危险 Tool)
- 外部:各 Tool 特定依赖(pytest / coverage / lsp / ...)

### 下游
- 被 `quantalithos-runtime` C9 Tool Invoker 调用
- 被 `quantalithos-member-images` 装入镜像

---

## 目录结构

```
quantalithos-tools/
├── pyproject.toml
├── src/quantalithos_tools/
│   ├── registry.py              ToolDescriptor 注册
│   ├── builtin/
│   │   ├── file_ops.py
│   │   ├── code_ops.py
│   │   ├── git_ops.py
│   │   ├── test_ops.py
│   │   └── sandbox_exec.py
│   ├── mcp/                     MCP Client
│   │   ├── client.py
│   │   ├── whitelist.py         capability-hub 同步
│   │   └── transport/
│   └── extras/                  按 Role 的可选工具集
│       ├── backend_dev/         LSP / DB 客户端
│       ├── frontend_dev/        playwright / npm
│       ├── qa/                  pytest / coverage
│       └── devops/              k8s / terraform / helm
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` TL 条目:
- **TL1** 每 Tool 必须声明 input/output schema
- **TL2** 危险 Tool 必须 requires_policy_check
- **TL3** 调用发 ToolInvoked / ToolFailed / ToolCompleted 事件
- **TL4** MCP Client 只调 capability-hub 白名单
- **TL5** Tool 实现不得直接出网(走 capability-hub)

---

## 详细设计参考

- `architecture/ai-member设计.md` §5.1(Tool 分类 + 契约 + Role 绑定)

---

## 开放问题

Tool 与 sandbox 集成深度(Tool 自声明 vs Policy override)。

---

## 可选工具集(按 Role)

| Role | extras 包 |
|---|---|
| backend-dev | lsp-python / lsp-go / lsp-rust / db-client / test-framework |
| frontend-dev | lsp-typescript / npm / playwright |
| qa | pytest / coverage / e2e |
| devops | docker / kubectl / terraform / helm |
| ux | figma-export / prototype-gen / screenshot |
| auditor | log-analyzer / evidence-collector / compliance-check |

每 Role 镜像通过 extras 选择性安装。
