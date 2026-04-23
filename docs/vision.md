# Quantalithos AI — 项目愿景

## 一句话定位

一个 AI 驱动的软件研发协作平台——所有员工均为 AI Agent，用户以管理者身份发布任务、审批和查看工作流。

## 我们要解决什么问题

当前 AI 编程助手（Cursor、Copilot、Claude Code）都是单 Agent 模式：一个人对一个 AI，做一件事。但真实的软件开发是多角色协作：产品、开发、测试、运维各司其职，按流程推进。

Quantalithos AI 要做的是把这种多角色协作搬到 AI 上——用户不再亲自写每一行代码，而是像管理一个开发团队一样，发布需求、审批方案、确认发布，AI 团队负责执行。

## 核心体验

- 用户通过聊天界面与 AI 团队协作
- 群聊是协作空间，每个项目一个群组
- AI 团队按六阶段流程推进：启动 → 需求 → 设计 → 开发 → 验收 → 发布
- 关键节点设置门禁，用户确认后才能继续
- 所有过程可见、可追溯、可回退

## 与同类产品的区别

| 维度 | Cursor / Copilot | OpenClaw / Superpowers | Quantalithos AI |
|------|-------------------|------------------------|------------|
| Agent 数量 | 单 Agent | 多 Agent（CLI） | 多 Agent（可视化） |
| 交互方式 | IDE 内嵌 | 终端命令行 | 聊天群组 |
| 目标用户 | 开发者 | 高级开发者 | 包括非技术用户 |
| 流程管控 | 无 | 有（Skill 约束） | 有（daemon + 工作流 + 门禁） |
| 过程可见性 | 低 | 低 | 高（群聊实时可见） |

## 技术架构

六个子项目构成完整平台：

- **quantalithos-runtime**：Agent 运行时，负责 Agent 生命周期、LLM 调用、工具系统、记忆
- **quantalithos-flow**：流程编排引擎，负责阶段状态机、工作流模板、门禁、任务调度
- **quantalithos-chat**：聊天前端，用户与 AI 团队的交互界面
- **quantalithos-platform**：产物管理，PRD、代码、测试报告等全生命周期管理
- **quantalithos-gate**：API 网关，认证、路由、权限
- **quantalithos-infra**：基础设施，部署、监控、CI/CD

核心协作模型：

```
quantalithos-flow（daemon）编排流程
    → 下发任务卡给 quantalithos-runtime 中的 Agent
    → Agent 执行当前 step，提交产物
    → quantalithos-flow 校验并推进到下一 step
```

## 开发路线

- Phase 1：核心交互原型（用户 ↔ Agent 聊天，基础群聊）
- Phase 2：流程引擎与多角色（六阶段可运行，门禁可控）
- Phase 3：产物管理与完整闭环（版本化、追溯）
- Phase 4：扩展能力与企业级特性（知识库、沙箱、监控）
