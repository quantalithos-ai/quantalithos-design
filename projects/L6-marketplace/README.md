# quantalithos-marketplace

> **仓使命**:资产市场 —— 社区 + 组织 + 第三方共享 / 购买 / 发布的 ProcessTemplate / Role 定义 / MCP Tool / Deployment Package。

---

## 仓定位

- **层**:L6 生态层
- **技术栈**:TypeScript(Web)+ Python(publisher CLI)
- **产品归属**:⑩ Marketplace(`产品矩阵.md` §6.3)

---

## 主要对齐

- **ISO/IEC 29110 Deployment Package**(资产包格式)
- **ISO 42001 §A.10**(第三方上架审核)
- **ISO 9001 供应商管理**

---

## 资产类型

| 资产 | 承载位置 | 典型定价 |
|---|---|---|
| **ProcessTemplate** | method-library.ProcessTemplate | 开源 / 付费 / 订阅 |
| **Role 定义 + Member 镜像** | identity.Role + AI Members 镜像 | 付费 / 订阅 |
| **MCP Tool 集合** | capability-hub.MCPRegistry | 开源 / 付费 |
| **Deployment Package** | 方法库 + 能力池联合 | 企业方案为主 |

---

## 核心职责

- **上架流程**:发布者提交资产 → `marketplace-review` Gate → 合规 + 内容审核共批
- **搜索 / 分类 / 标签**
- **购买 / 订阅 / 下载**
- **评分 + 评论**(合规审核)
- **撤销上架**:发布者 / 审核方可撤销,通知已安装用户
- **发布者身份验证**(实名 / 组织凭证)
- **签名 + 扫描**:上架前 Trivy / Grype + cosign 签名

---

## 关键依赖

### 上游
- `@quantalithos/sdk-core`(TypeScript)+ `@quantalithos/sdk-python`(CLI)
- `quantalithos-method-library`(资产发布目标)
- `quantalithos-capability-hub`(MCP Tool 发布目标)
- `quantalithos-governance`(marketplace-review Gate)
- 外部:支付 / 订阅 / 认证(未来 billing 系统)

### 下游
- 资产消费者:用户 / 企业 / AI Members

---

## 目录结构

```
quantalithos-marketplace/
├── package.json
├── apps/
│   ├── web/                Web marketplace(TypeScript)
│   └── cli/                publisher CLI(Python)
├── packages/
│   ├── mp-core/            TypeScript
│   ├── asset-bundle/       29110 DP 打包 / 解压
│   ├── review-flow/        上架审核流
│   └── payment/            (未来)
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `产品遵循规范清单.md` MK 条目 + `子项目遵循规范清单.md` MK:
- **MK1** 上架走 marketplace-review Gate(合规 + 内容审核共批)
- **MK2** 资产使用 29110 Deployment Package 格式打包
- **MK3** 发布者身份验证(实名 / 组织凭证)
- **MK4** 购买 / 安装后的资产可审计
- **MK5** 撤销上架 + 通知已安装用户
- **MK6** Role / Member 镜像资产上架前过安全扫描

---

## 详细设计参考

- `产品遵循规范清单.md` §十.⑩ Marketplace
- `methodology/standards-discussion/ISO-IEC-29110.md`(DP 格式)

---

## 开放问题

- 计费模型(一次性 / 订阅 / 按使用量)
- 发布者与 Quantalithos 的收入分成机制
- 跨境交易的合规边界
- 开源资产 vs 付费资产的界面区分

---

## 刻意不做

- 不做 LLM 模型市场(那是 Anthropic / OpenAI 的市场)
- 不做人力服务(那是 Upwork 等)
- 不做代码片段市场(那是 GitHub Gist)
