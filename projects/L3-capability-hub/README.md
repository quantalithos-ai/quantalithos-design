# quantalithos-capability-hub

> **仓使命**:能力池 —— MCP Server 注册表 + A2A Node Directory + Provider Contract(LLM 模型提供商)+ 白名单 / 成本记账。  

---

## 仓定位

- **层**:L3 方法能力层
- **同层兄弟**:method-library
- **技术栈**:Rust + PostgreSQL

---

## 主要对齐

- **Research MCP**(Model Context Protocol 注册表)
- **Research A2A**(Agent-to-Agent 协议)
- **ISO 42001 §A.10**(第三方 / 客户关系治理)
- **ISO 42001 §A.4**(Tooling Resources)
- **Research MCP 安全**(白名单 + 签名 + 审计)

---

## 核心职责

- **MCP Server 白名单**:Runtime 调外部 Tool 必经 hub
- **A2A Node 注册**:外部 Agent 接入 + 身份验证
- **Provider Contract**:Anthropic / OpenAI / 自托管 LLM 等供应商关系 + API key / 配额 / 成本记账
- **LLM 路由**(可能):按任务复杂度选模型(Research LLM 路由,见 ai-member 设计 §十一 Q4)
- **Policy 消费**:governance Policy 下发来更新白名单

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus` / `quantalithos-sdk`
- `quantalithos-governance`(订阅 Policy)
- 外部:Anthropic / OpenAI API / 各 MCP Server / 密钥管理(KMS / Vault)

### 下游
- `quantalithos-tools`(MCP Client 调用 hub)
- `quantalithos-runtime`(LLM 调用 + Policy 查询)
- `quantalithos-marketplace`(发布 MCP Tool / Role 镜像的注册)

---

## 目录结构

```
quantalithos-capability-hub/
├── Cargo.toml
├── src/
│   ├── mcp_registry/       MCP Server 注册 + 白名单
│   ├── a2a_directory/      A2A Node 注册
│   ├── provider_contract/  LLM 提供商合同 + 配额
│   ├── cost_accounting/    调用成本记账
│   ├── llm_router/         (可选)按复杂度路由
│   ├── rpc/
│   ├── subscriptions/
│   └── infra/
├── migrations/             registry / contracts / call_log / Outbox
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` L3 CH 条目:
- **CH1** MCP Server 白名单 + 签名验证
- **CH2** A2A Node 注册必须验证身份(不允许匿名)
- **CH3** Provider Contract API key 加密存储(KMS)
- **CH4** Policy 下发可动态更新白名单
- **CH5** 调用外部 Tool / Provider 必须发成本记账事件

---

## 详细设计参考

- `product/六域模型.md` §九.2 能力池横切
- `architecture/标准对齐全景图.md` capability-hub 对齐
- ADR-0006 / 0007(间接相关)

---

## 开放问题

LLM 路由是否内置到本仓还是独立服务(Q4 in ai-member 设计)。

---

## 安全

- API key 走 KMS envelope encryption,不落盘明文
- 所有外部调用走审计事件
- 白名单变更必须 Gate(governance.policy-update)
- 未白名单的 MCP Server 调用直接拒绝 + 严重审计事件
