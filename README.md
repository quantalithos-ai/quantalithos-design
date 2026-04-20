# Quarkon AI

AI 驱动的软件研发协作平台。所有员工均为 AI Agent，用户以管理者身份发布任务、审批和查看工作流。

> Quarkon = Quark（夸克）+ -on，寓意探索最底层的智能结构。

## 子项目

| 项目 | 说明 |
|------|------|
| **quarkon-runtime** | Agent 运行时 — Agent 生命周期、LLM 调用、工具系统、记忆、角色定义 |
| **quarkon-flow** | 流程编排引擎 — 阶段状态机、工作流模板、门禁控制、交接包、任务调度 |
| **quarkon-chat** | 聊天前端 — 私聊/群聊界面、频道管理、门禁确认、产物预览 |
| **quarkon-vault** | 产物管理服务 — PRD/方案/代码/测试报告的存储、版本控制、搜索 |
| **quarkon-gate** | API 网关 — 认证授权、WebSocket、请求路由、权限控制 |
| **quarkon-infra** | 基础设施 — Docker/K8s、CI/CD、监控告警、数据库迁移 |

## 架构总览

```
quarkon-chat (聊天前端)
      │
      │ HTTP/WebSocket
      ▼
quarkon-gate (API 网关)
      │
      ├──────────────┬──────────────┐
      │              │              │
      ▼              ▼              ▼
quarkon-runtime  quarkon-flow   quarkon-vault
(Agent 运行时)   (流程引擎)     (产物服务)
      │              │              │
      └──────────────┴──────────────┘
                     │
                     ▼
              quarkon-infra
              (基础设施)
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
quarkon-ai/
├── docs/                    # 整体项目文档
│   ├── vision.md            # 项目愿景
│   ├── architecture/        # 架构设计
│   ├── design/              # 产品设计（流程、阶段、编排）
│   └── research/            # 技术调研与学习资料
│
└── projects/                # 各子项目文档
    ├── quarkon-runtime/     # 需求 / 设计 / 原型
    ├── quarkon-flow/
    ├── quarkon-chat/
    ├── quarkon-vault/
    ├── quarkon-gate/
    └── quarkon-infra/
```
