# Quantalithos AI — 项目总览

> AI 驱动的软件研发协作平台，所有员工都是 AI Agent，用户以管理者身份发布任务、审批和查看工作流。

---

## 一句话定义

Quantalithos AI 是一个让用户"说出想法，AI 团队自动完成开发"的平台。

## 核心特性

| # | 特性 | 说明 |
|---|------|------|
| 1 | AI 团队自动组建 | 用户发起项目 → Assistant 创建 TL + 开发 + 测试，按需分配 |
| 2 | 六阶段标准流程 | 启动 → 需求 → 设计 → 开发 → 验收 → 发布，BPMN 2.0 驱动 |
| 3 | 门禁审批机制 | 关键节点人类确认（需求确认、验收审批），AI 不会失控 |
| 4 | 三级控制 | Free（自由）/ Guided（引导）/ Enforced（强制），按任务灵活选择 |
| 5 | 一键体验成果 | Runner App 直接运行 AI 开发的应用，不需要安装开发环境 |

## 不适用场景

- 不是通用 AI 对话工具（不是 ChatGPT 替代品）
- 不是低代码平台（AI 写真实代码，不是拖拽组件）
- 不是项目管理工具（Jira 替代品），虽然有看板和工单

---

## 端到端数据流

```
用户："我想做一个博客系统"
  │
  ▼
chat（聊天界面）
  │ sdk-wasm
  ▼
gate（API 网关，认证 + 路由）
  │
  ├──────────────────────────────────────────────────────┐
  │                                                      │
  ▼                                                      ▼
platform（数据中枢）                              flow（流程编排）
  │                                                      │
  │ 创建项目 + 工单 + 产物                                │ BPMN 引擎驱动
  │ 存储所有数据                                          │ Token 推进流程
  │ 事件总线通知                                          │
  │                                                      │ FlowMessage
  │                                                      │ (node_execute)
  │                                                      ▼
  │                                                runtime（Agent 运行时）
  │                                                      │
  │                                                      │ Agent think→act
  │                                                      │ LLM 调用
  │                                                      │ 工具执行
  │                                                      ▼
  │                                                sandbox（沙箱环境）
  │                                                      │
  │                                                      │ Docker 容器
  │                                                      │ 编译 / 测试 / 运行
  │                                                      │ git push → Gitea
  │                                                      │
  │◄─────── NodeResult（完成/失败）──────────────────────┘
  │
  │ 构建产物
  ▼
runner（运行器 App）
  │
  ▼
用户体验博客系统
```

---

## 14 个子项目速览

```
┌─ 前端层 ──────────────────────────────────────────────┐
│  chat        聊天界面（Vue 3，日常协作入口）            │
│  console     管理后台（Vue 3，配置和监控）              │
│  runner      运行器 App（Tauri/PWA，体验 AI 开发的应用）│
│  website     官网（VitePress，产品介绍和文档）          │
└───────────────────────────────────────────────────────┘
         │ sdk-wasm / sdk
         ▼
┌─ SDK 层 ──────────────────────────────────────────────┐
│  sdk         跨平台客户端 SDK（Rust，5 个 crate）      │
└───────────────────────────────────────────────────────┘
         │ HTTP / WebSocket
         ▼
┌─ 网关层 ──────────────────────────────────────────────┐
│  gate        API 网关（Rust axum，JWT + 路由 + WS）    │
└───────────────────────────────────────────────────────┘
         │
         ▼
┌─ 服务层 ──────────────────────────────────────────────┐
│  platform    数据中枢（Rust axum，9 个领域模块）       │
│  flow        流程编排（Python，BPMN 2.0 引擎驱动）     │
│  runtime     Agent 运行时（Python，think→act 循环）    │
│  sandbox     项目沙箱（Rust，Docker 容器化）           │
└───────────────────────────────────────────────────────┘
         │
         ▼
┌─ 基础层 ──────────────────────────────────────────────┐
│  core        共享库（Python，BPMN 引擎 + 协议 + 模型） │
│  sync        工作区同步（Rust CLI）                    │
│  marketplace 资产市场（platform 模块，Phase 2）        │
│  infra       基础设施（Docker Compose + Gitea）        │
└───────────────────────────────────────────────────────┘
```

| 子项目 | 语言 | 端口 | 一句话说明 |
|--------|------|:----:|-----------|
| core | Python | — | BPMN 引擎（策略注册表 + Token 模型）+ 通信协议 + 共享数据模型 |
| runtime | Python | 8003 | Agent 生命周期、LLM 调用、工具系统、三级控制 |
| flow | Python | 8002 | BPMN 流程编排、门禁控制、任务调度 daemon |
| platform | Rust | 8001 | 项目/工单/产物/Agent配置/快照/知识库/设计系统/Git集成/市场 |
| sdk | Rust | — | 跨平台客户端 SDK（models/api/ws/store/wasm） |
| chat | Vue 3 | 3000 | 飞书式三栏布局，聊天 + 门禁 + 进度 |
| console | Vue 3 | 3001 | 项目管理 + Agent 配置 + Git 浏览 + 沙箱监控 |
| gate | Rust | 8000 | JWT 认证 + HTTP 反向代理 + WebSocket |
| sandbox | Rust | 8004 | Docker 容器化沙箱（dev/preview/build 三种模式） |
| runner | Rust+Vue | — | 跨平台运行器（WebView + 原生桥接） |
| sync | Rust CLI | — | manifest 驱动的工作区同步 |
| marketplace | Rust | — | 流程模板/技能包/角色定义/应用作品的市场（platform 模块） |
| website | VitePress | — | 官网（产品介绍 + 文档中心） |
| infra | Docker | — | Docker Compose + Gitea + 数据库迁移 + 初始数据 |


---

## 快速开始

### 环境要求

- Docker + Docker Compose
- Git
- LLM API Key（Anthropic 或 OpenAI）

### 3 步启动

```bash
# 1. 克隆仓库
git clone https://github.com/quantalithos/quarkon-ai.git
cd quarkon-ai

# 2. 配置环境变量
cp projects/quantalithos-infra/config/.env.example .env
# 编辑 .env，填入 LLM_API_KEY

# 3. 一键启动
bash projects/quantalithos-infra/scripts/setup-dev.sh
```

### 验证

```bash
# 检查所有服务是否启动
curl http://localhost:8000/health    # gate
curl http://localhost:8001/health    # platform
curl http://localhost:8002/health    # flow
curl http://localhost:8003/health    # runtime

# 打开聊天界面
open http://localhost:3000           # chat

# 打开管理后台
open http://localhost:3001           # console
```

### 第一个项目

1. 打开 `http://localhost:3000`
2. 在 Assistant 私聊中输入"我想做一个博客系统"
3. 按照 Assistant 引导填写项目信息
4. 确认创建 → AI 团队自动组建
5. 在项目群聊中观看 AI 团队工作

---

## 目录结构

```
quarkon-ai/
├── docs/                              # 整体项目文档
│   ├── OVERVIEW.md                    # ← 你正在读的这个文件
│   ├── vision.md                      # 项目愿景
│   ├── architecture/                  # 架构设计
│   │   ├── 仓库拆分方案.md             # 14 个子项目的拆分理由和依赖关系
│   │   ├── 开发路线图与优先级.md        # Phase 1/2/3 路线图
│   │   └── project-doc-writing-guide.md # 文档写作规范
│   ├── design/                        # 产品设计
│   │   ├── 端到端流程说明.md            # 博客项目六阶段完整时间线 + 设计决策汇总
│   │   ├── Agent统一模型与三级控制设计.md # Agent 架构核心文档
│   │   ├── 流程图模型与节点原语设计.md   # BPMN 元素落地决策（11/7/19）
│   │   ├── 流程图标准-BPMN2.md         # BPMN 2.0 标准参考
│   │   ├── 设计决策记录.md              # ADR 集中索引
│   │   └── 阶段0~5 设计文档             # 六阶段详细设计
│   └── research/                      # 37 份技术调研
│       ├── pattern-*.md               # Agent 模式调研
│       ├── study-*.md                 # 框架/协议调研
│       └── protocol-*.md             # 通信协议调研
│
└── projects/                          # 14 个子项目
    ├── quantalithos-core/design/      # 概要设计 + 详细设计
    ├── quantalithos-runtime/design/
    ├── quantalithos-flow/design/
    ├── quantalithos-platform/design/
    ├── quantalithos-sdk/design/
    ├── quantalithos-chat/design/
    │   └── prototype/                 # 10 个交互式 HTML 原型
    ├── quantalithos-console/design/
    ├── quantalithos-gate/design/
    ├── quantalithos-sandbox/design/
    ├── quantalithos-runner/design/
    ├── quantalithos-sync/design/
    ├── quantalithos-marketplace/design/
    ├── quantalithos-website/design/
    └── quantalithos-infra/design/
```

---

## 读码建议路径

### 1 小时：理解全貌

1. 读本文件（OVERVIEW.md）— 10 分钟
2. 读 `docs/design/端到端流程说明.md` — 20 分钟（博客项目完整时间线）
3. 读 `projects/quantalithos-core/design/概要设计.md` 第三章 — 15 分钟（BPMN 引擎设计）
4. 打开 `projects/quantalithos-chat/prototype/full-prototype.html` — 15 分钟（看产品长什么样）

### 4 小时：理解核心架构

在 1 小时基础上，继续：

5. 读 core 详细设计 — 30 分钟（FlowNode 继承体系 + Token + 策略注册表）
6. 读 runtime 概要设计 + 详细设计第三章 — 30 分钟（Agent 执行流程）
7. 读 flow 概要设计 + 详细设计第三章 — 30 分钟（流程编排 + 策略）
8. 读 platform 详细设计第二、三章 — 30 分钟（数据库 + 状态机）
9. 打开所有原型 HTML — 30 分钟（理解交互流程）
10. 读 `docs/design/流程图模型与节点原语设计.md` 第十章 — 10 分钟（BPMN 落地决策）

### 8 小时：准备开始编码

在 4 小时基础上，继续：

11. 读 sandbox 概要设计 + 详细设计 — 30 分钟（容器化方案）
12. 读 sdk 详细设计 — 20 分钟（Rust 数据模型 + API 客户端）
13. 读 gate 详细设计 — 20 分钟（认证 + 路由 + WebSocket）
14. 读 `docs/architecture/开发路线图与优先级.md` — 20 分钟（Phase 分期）
15. 读 `docs/architecture/仓库拆分方案.md` — 15 分钟（依赖关系）
16. 读 37 份 research 文档的标题 — 15 分钟（知道调研了什么）
17. 读 `memory/software_design_principles.md` — 10 分钟（设计原则审视清单）
18. 读 `memory/research_design_principles.md` — 10 分钟（调研结论）

---

## 文档导航

### 架构与设计

| 文档 | 内容 | 适合场景 |
|------|------|---------|
| docs/OVERVIEW.md | 项目总览 + 快速开始 | 初次接触项目 |
| docs/vision.md | 项目愿景 | 理解项目目标 |
| docs/architecture/仓库拆分方案.md | 14 个子项目的拆分理由和依赖关系 | 理解项目结构 |
| docs/architecture/开发路线图与优先级.md | Phase 1/2/3 路线图 + 启动顺序 | 规划开发 |
| docs/architecture/project-doc-writing-guide.md | 文档写作规范 | 写文档时参考 |
| docs/design/端到端流程说明.md | 博客项目六阶段完整时间线 + 设计决策汇总 | 理解系统如何协作 |
| docs/design/Agent统一模型与三级控制设计.md | Agent 架构核心 | 理解 Agent 设计 |
| docs/design/流程图模型与节点原语设计.md | BPMN 元素落地决策 | 理解 BPMN 范围 |
| docs/design/流程图标准-BPMN2.md | BPMN 2.0 标准参考 | 查阅 BPMN 规范 |
| docs/design/设计决策记录.md | ADR 集中索引 | 回溯"为什么这样设计" |

### 子项目设计

| 子项目 | 概要设计 | 详细设计 | 重点章节 |
|--------|---------|---------|---------|
| core | BPMN 引擎 + 协议 | 继承体系 + Token + 策略 | 概要第三章、详细第二五章 |
| runtime | Agent 架构 + 三级控制 | 执行流程 + 工具 + LLM | 详细第三七章 |
| flow | 流程编排 + 门禁 | 策略 + 事件循环 | 详细第三章 |
| platform | 9 个模块概览 | 数据库 + API + 状态机 | 详细第二三八章 |
| sdk | 5 crate 架构 | Rust 模型 + API 客户端 | 详细第二三章 |
| chat | 三栏布局 + 组件 | 目录结构 + 核心组件 | 概要第二三章 |
| console | 管理后台模块 | 页面结构 | 概要设计 |
| gate | 认证 + 路由 + WS | JWT + 代理 + 广播 | 详细第二三四章 |
| sandbox | 三种模式 | 容器管理 + API | 详细第二三章 |
| runner | 跨平台运行器 | WebView + 桥接 | 概要设计 |
| sync | CLI 命令 | manifest + restore | 详细第三章 |
| marketplace | 6 种资产类型 | 数据模型 + API | 概要设计 |
| website | 页面结构 | VitePress 配置 | 概要设计 |
| infra | Docker Compose | 迁移 + 初始数据 | 详细第二三章 |

### 原型

| 原型 | 内容 | 文件 |
|------|------|------|
| 基础布局 | 三栏布局 | prototype/index.html |
| 完整交互 | 聊天+看板+进度+团队 | prototype/full-prototype.html |
| 发起项目 | Assistant 私聊完整流程 | prototype/assistant-chat.html |
| 门禁审批 | 通过/驳回/重新提交 | prototype/gate-approval.html |
| Agent 执行 | think→act 实时面板 | prototype/agent-execution.html |
| 代码审查 | 打回→修改→重审 | prototype/code-review-branch.html |
| 并行+协作 | 多任务并行 + ask_teammate | prototype/parallel-and-ask.html |
| 多角色追踪 | 工作流追踪面板 | prototype/workflow-trace.html |
| Agent 追踪 | 单 Agent 执行详情 | prototype/agent-trace.html |
| BPMN 展示 | BPMN 对象在界面中的呈现 | prototype/bpmn-objects-showcase.html |

### 调研文档

| 类别 | 数量 | 内容 |
|------|:----:|------|
| Agent 模式 | 8 份 | ReAct / Plan-and-Execute / Reflexion / LATS / Debate 等 |
| 框架调研 | 12 份 | LangChain / LangGraph / CrewAI / AutoGen / Anthropic SDK 等 |
| 协议标准 | 5 份 | AG-UI / A2A / MCP / BPMN / ISO 5807 |
| 专题调研 | 12 份 | 持久执行 / 工具系统 / 记忆 / 安全 / 可追溯性 等 |
