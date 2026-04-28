# Quantalithos AI

AI 驱动的软件研发协作平台。所有员工均为 AI Agent，用户以管理者身份发布任务、审批和查看工作流。

> Quantalithos = Quantum（量子）+ Lithos（基石），寓意以量子级智能构建研发协作的基石。

## 子项目

| 项目 | 说明 |
|------|------|
| **quantalithos-core** | 核心共享库 — BPMN 引擎（策略注册表 + Token 驱动）、通信协议、共享数据模型、JSON Schema |
| **quantalithos-runtime** | Agent 运行时 — Agent 生命周期、LLM 调用、工具系统、记忆、三级控制（依赖 core） |
| **quantalithos-flow** | 流程编排引擎 — BPMN 2.0 流程编排、门禁控制、任务调度（依赖 core） |
| **quantalithos-platform** | 平台数据服务 — 项目管理、工单管理、产物管理、Agent 配置、快照、知识库 |
| **quantalithos-sdk** | 跨平台客户端 SDK — Rust 模块化 crate，支持 WASM/Tauri/UniFFI 绑定（对齐 core schemas） |
| **quantalithos-chat** | 聊天前端 — 私聊/群聊界面、门禁确认、Agent 实时执行（Vue 3） |
| **quantalithos-console** | 云端管理后台 — 项目管理、Agent 配置、流程编辑、产物管理、设计系统、监控（Vue 3） |
| **quantalithos-gate** | API 网关 — 认证授权、WebSocket、请求路由、权限控制 |
| **quantalithos-sandbox** | 项目沙箱 — 三种模式（dev/preview/build），Docker 容器化，Agent 隔离执行 |
| **quantalithos-runner** | 跨平台运行器 — 用户体验 AI 开发的应用（WebView + 原生桥接） |
| **quantalithos-sync** | 工作区同步工具 — Rust CLI，manifest 驱动、多源拉取/推送 |
| **quantalithos-infra** | 基础设施 — Docker/K8s、CI/CD、Gitea、监控告警、数据库迁移 |

## 架构总览

```
quantalithos-chat (聊天前端)    quantalithos-console (管理后台)    quantalithos-runner (运行器)
      │                              │                                  │
      │ sdk-wasm (WASM 绑定)         │ sdk-wasm                         │ sdk (原生/UniFFI)
      │                              │                                  │
quantalithos-sdk (跨平台 SDK Rust, 对齐 core schemas)
      │
      │ HTTP/WebSocket
      ▼
quantalithos-gate (API 网关)
      │
      ├──────────────┬──────────────┬──────────────┐
      │              │              │              │
      ▼              ▼              ▼              ▼
quantalithos-flow   quantalithos-runtime  quantalithos-platform  quantalithos-sandbox
(流程引擎)          (Agent 运行时)         (平台数据服务)          (项目沙箱)
      │              │       │                                    │
      └──────┬───────┘       │ SandboxProvider                   │
             │ pip install   └────────────────────────────────────┘
             ▼
      quantalithos-core
      (BPMN 引擎 + 协议 + 模型 + SandboxProvider 接口)

              ┌──────┴──────┐
              │             │
              ▼             ▼
        quantalithos-sync  quantalithos-infra
        (工作区同步)        (基础设施 + Gitea)
```

## 六阶段流程

```
阶段 0  项目入口与启动（Assistant → Tech Lead）
阶段 1  需求理解（硬门禁：用户确认）
阶段 2  方案拆解与实施准备（软门禁）
阶段 3  迭代开发与测试（任务级流水线）
阶段 4  验收、发布准备与最终确认
阶段 5  发布执行、发布后观察与回退控制
```

## 仓库结构

```
quantalithos-ai/
├── docs/                    # 整体项目文档
│   ├── vision.md            # 项目愿景
│   ├── architecture/        # 架构设计
│   ├── design/              # 产品设计（流程、阶段、编排）
│   └── research/            # 技术调研与学习资料
│
└── projects/                # 各子项目文档
    ├── quantalithos-core/        # BPMN 引擎 / 协议 / 共享模型
    ├── quantalithos-runtime/     # Agent 运行时
    ├── quantalithos-flow/        # 流程编排引擎
    ├── quantalithos-platform/    # 平台数据服务
    ├── quantalithos-sdk/         # 跨平台客户端 SDK
    ├── quantalithos-chat/        # 聊天前端
    ├── quantalithos-console/     # 云端管理后台
    ├── quantalithos-gate/        # API 网关
    ├── quantalithos-sandbox/     # 项目沙箱环境
    ├── quantalithos-runner/      # 跨平台运行器
    ├── quantalithos-sync/        # 工作区同步
    └── quantalithos-infra/       # 基础设施
```
