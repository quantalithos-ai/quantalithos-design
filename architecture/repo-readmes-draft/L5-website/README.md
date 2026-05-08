# quantalithos-website

> **仓使命**:营销站 + 文档站。完全独立部署,不连 Server,专注"说服"与"导航"。

---

## 仓定位

- **层**:L5 UI 层
- **技术栈**:Astro / Next.js SSG(静态站点生成)
- **产品归属**:④ Website(`产品矩阵.md` §3.4)

---

## 主要对齐

- **ISO 25010 Interaction Capability Inclusivity**(WCAG 2.2 AA 基线)
- **ISO 9001 文档控制**(文档版本与 Server 对应)
- **GDPR 基线**(Cookie / 追踪同意)

---

## 核心模块

- 首页(hero + 产品定位)
- 产品页(10 产品分别介绍)—— 每页必有"刻意不做"段落
- 文档站(docs subdomain):quickstart / API / FAQ / migration guides
- 博客 / Release Notes
- 定价页(未来)
- 登录 / 注册引流(跳转 Server 认证入口)

---

## 关键依赖

### 上游
- 无 runtime 依赖(纯静态)
- 构建期:从 `quantalithos-design` 仓拉特定公开文档 + 从各 SDK 仓拉 API reference

### 下游
- 搜索引擎 + 外部访客

---

## 目录结构

```
quantalithos-website/
├── package.json
├── astro.config.mjs
├── src/
│   ├── pages/
│   │   ├── index.astro            首页
│   │   ├── products/              10 产品
│   │   │   ├── chat.astro
│   │   │   ├── runner.astro
│   │   │   └── ...
│   │   ├── docs/                  文档(MDX)
│   │   ├── blog/
│   │   ├── pricing.astro          (未来)
│   │   └── about.astro
│   └── components/
├── content/
│   ├── docs/                      MDX 文档
│   └── blog/                      博客
├── scripts/sync-from-design.ts    从 design 仓拉取公开文档
└── .github/workflows/
    ├── build.yml
    └── docs-sync.yml              定时从 design 仓同步
```

---

## 维护纪律

对齐 `产品遵循规范清单.md` WB 条目 + `子项目遵循规范清单.md` WB:
- **WB1** WCAG 2.2 AA
- **WB2** 完全独立部署(不嵌入需要登录的动态功能)
- **WB3** 文档版本与 Server 版本对应标识
- **WB4** Cookie / 追踪同意符合 GDPR
- **WB5** 每款产品页必有"刻意不做"段落

---

## 详细设计参考

- `产品遵循规范清单.md` §四.④ Website
- `product/产品矩阵.md` §3.4

---

## 开放问题

- 多语言(中英)同时维护策略
- Web playground(在 Website 嵌入在线试用 `sdk` 的 REPL,见 sdk Q6)
- SEO 与内部搜索索引

---

## 部署

- **CDN**:Cloudflare / AWS CloudFront
- **域名**:`quantalithos.ai`(主) + `docs.quantalithos.ai`(文档)
- **构建**:每次 push 触发 Astro build + deploy

---

## 刻意不做

- 不做应用功能(那不是 Website 职责)
- 不做登录后的复杂交互(在 Chat / Console)
- 不做面向开发者的可执行 Demo(未来 Playground,暂不做)
