# quantalithos-sdk

> **仓使命**:三语言(Python / Rust / TypeScript)client 库 + 统一接入层。所有端侧 + 内部 runtime 走同一套 sdk。

---

## 仓定位

- **层**:L0 共享契约层
- **同层兄弟**:`quantalithos-core` / `quantalithos-bus`
- **稳定性**:接口 breaking 必须 ADR + v2 路径

---

## 主要对齐

- **25010 Interaction Capability**(API Learnability / Operability / Error Protection)
- **MCP**(内置 Client 能力)
- **OTel GenAI**(自动 trace 传播)
- **CloudEvents 1.0**(事件订阅封装)

---

## 关键依赖

### 上游
- `quantalithos-core`(proto binding 来源)
- `quantalithos-bus`(wire protocol 消费)

### 下游
- **所有端侧产品**:Chat / Runner / Sync / Console / Bridges
- **L2 runtime**(Python SDK)
- **Marketplace publisher CLI**
- 第三方 / 企业内部开发者

---

## 目录结构

```
quantalithos-sdk/
├── README.md
├── versions.toml                  三语言版本聚合
├── proto-ref.toml                 core proto 版本锁
│
├── codegen/                       buf 生成脚本
│   ├── buf.gen.python.yaml
│   ├── buf.gen.rust.yaml
│   ├── buf.gen.typescript.yaml
│   └── gen.sh
│
├── sdk-python/                    PyPI 发包
├── sdk-rust/                      crates.io 发包
├── sdk-typescript/                npm 发包
│
├── examples/{python,rust,typescript}/
├── docs/
│   ├── quickstart-{lang}.md
│   ├── authentication.md
│   ├── events-subscription.md
│   ├── mcp-integration.md
│   └── migration-guides/
└── .github/workflows/
```

---

## 构建与测试

```bash
# 生成三语言 binding
cd codegen && ./gen.sh --version v1.2.3

# Python
cd sdk-python && poetry install && poetry run pytest

# Rust
cd sdk-rust && cargo test --workspace

# TypeScript
cd sdk-typescript && pnpm install && pnpm test

# 三语言一致性测试(examples 作为测试用例)
./scripts/cross-lang-smoke.sh
```

---

## 维护纪律

对齐 `标准对齐全景图.md` + `子项目遵循规范清单.md` SK 条目:

- **SK1** 三语言独立发版 + major.minor 同步
- **SK2** 类型从 core proto 自动生成(不手写)
- **SK3** Breaking change 经 Gate + 2 个 minor 过渡期
- **SK4** 每个 API 有 docstring + 示例
- **SK5** OTel trace 自动传播
- **SK6** 内置 MCP Client
- **SK7** Deprecated API 至少保留 2 个 minor

---

## 详细设计参考

- `architecture/sdk-draft/README.md`(983 行完整草案)
- `architecture/proto-draft/README.md`(binding 来源)
- `architecture/bus-draft/README.md`(事件订阅)
- `product/产品矩阵.md` §六.2(SDK 产品定位)

---

## 开放问题

- 三语言失败时发版一致性
- L2 runtime 是否单独 sdk-internal-python
- REST / GraphQL gateway
- 手工补丁策略
- AG-UI 类型来源
- REPL / playground

---

## 认证与安全

- 敏感值永不入磁盘 / 日志
- redaction 默认规则(secret / password / token / key / credential / ssn)
- 依赖 CI 扫描(Snyk / pip-audit / cargo-audit / npm audit)
- 包签名(sigstore / provenance)
