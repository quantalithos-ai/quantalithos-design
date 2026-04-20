# Hermes Agent 学习文档

## 1. 这份文档的目标

这份文档专门帮助你系统学习 `Hermes Agent`，目标不是“会安装、会打一条命令”，而是逐步达到下面 4 个层次：

- 能理解 `Hermes Agent` 的定位和它与普通聊天助手的区别
- 能独立完成一个最小可用的 `CLI Agent` 环境
- 能掌握 `Tools`、`Skills`、`Memory`、`MCP`、`Gateway`、`Cron` 等核心能力
- 能进一步理解 `Hermes Agent` 的架构、扩展方式和实际项目落地方法

你可以把这份文档当成一个从入门到实战的训练手册。

## 2. 学习建议：先学什么，后学什么

学习 `Hermes Agent` 最容易踩的坑，是一开始就把它当成“另一个命令行聊天工具”，或者一开始就冲着 `MCP`、多平台网关、插件、二次开发去，结果基础使用方式都没建立起来。

建议你按下面顺序学习：

1. 先学安装和最小 CLI 使用
2. 再学模型配置和工具配置
3. 再学 `Skills`、`Memory`、`Context Files`
4. 再学 `MCP`、`Gateway`、`Cron`、`Delegation`
5. 最后再学架构、插件、自定义工具和二次开发

一句话：**先把“会用”学清楚，再做“自动化和扩展”，最后再做“深度定制”。**

## 3. 学习 Hermes Agent 前需要知道什么

开始前，建议你已经具备这些基础：

- 会使用 Linux 或 macOS 终端
- 知道什么是 Python 虚拟环境
- 知道什么是 API Key
- 知道什么是大模型调用、工具调用、Agent
- 对 `MCP`、`RAG`、`Prompt` 有基本概念
- 能读懂 `YAML`、`JSON`、命令行参数

如果这些你还不够熟，可以先补 1 到 3 天，不然学习 `Hermes Agent` 时会觉得很多能力点同时压过来。

## 4. Hermes Agent 是什么

`Hermes Agent` 是 `Nous Research` 开源的一个“可持续运行、可记忆、可扩展、可自动化”的通用 AI Agent 系统。

它的重点不只是“调用一个模型”，而是把下面这些能力组合成一个长期可用的 Agent：

- 聊天和任务执行
- 工具调用
- 技能加载与技能生成
- 持久记忆
- 多平台消息接入
- 定时任务
- 子 Agent 并行委派
- MCP 外部工具集成
- 本地 / Docker / SSH / 远端沙箱执行

你可以把它理解成：

- `LLM` 是大脑
- `LangChain` 更偏能力编排层
- `CrewAI` 更偏多角色协作层
- `Hermes Agent` 更像一个“长期运行的通用智能代理操作系统”

它不是只服务于某一个编辑器，也不是单纯包了一层聊天界面。

## 5. Hermes Agent 核心概念地图

你后面会频繁遇到这些词，先建立最小认知。

### CLI

最基础的入口。

你运行 `hermes` 之后，会进入交互式终端界面，在里面和 Agent 对话、执行任务、切换模型、调用工具、恢复会话。

### Session

一次会话就是一段连续上下文。

`Hermes Agent` 可以保存会话历史，并支持继续上次会话。它不只是“一问一答”，而是支持长期连续任务。

### Tools

工具是 Agent 的真实能力来源。

比如：

- 文件读写
- 搜索
- 终端命令执行
- 浏览器操作
- Web 抓取
- 代码执行
- 子 Agent 委派

如果没有工具，模型只能“说”；有了工具，Agent 才能“做”。

### Toolsets

`Toolsets` 是工具分组。

它的作用是：你不用每次一个个管理工具，而是按能力域启用一组工具，比如终端、Web、技能、MCP 等。

### Skills

`Skills` 可以理解成“可复用的操作经验包”或“按需加载的知识文档”。

它不是单纯的 Prompt 片段，而是可以包含：

- 主说明文件 `SKILL.md`
- 参考资料
- 模板
- 辅助脚本
- 配置项

`Hermes Agent` 的一个重要特性是：它可以在复杂任务后沉淀技能，并在未来复用。

### Memory

`Hermes Agent` 有持久记忆机制，会跨会话保存重要信息。

它至少包含两类：

- `MEMORY.md`：偏环境、项目、工作流事实
- `USER.md`：偏用户偏好、交流方式、个人习惯

这意味着它可以逐渐“记住你是谁、你在做什么、你喜欢怎样配合”。

### Session Search

除了短小精炼的长期记忆，它还会保存历史会话，并支持检索过去讨论过的内容。

你可以把它理解成：

- `Memory` 是高价值长期事实
- `Session Search` 是可搜索的历史聊天与任务轨迹

### Context Files

上下文文件用于给 Agent 长期注入项目背景。

比如某个项目下的规范、架构说明、工作约束，可以通过上下文文件持续影响 Agent 的行为，而不是每次临时口头解释。

### Personality / SOUL.md

这是 Agent 的默认人格和表达风格入口。

如果你希望 Agent 在语气、行为边界、默认目标上更贴合你的工作方式，可以通过这类文件进行设置。

### Gateway

`Gateway` 是消息平台入口。

它可以让你通过下面这些渠道和同一个 Agent 交互：

- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- Email
- 以及更多平台

所以 Hermes 不一定只活在你的本地终端里，它可以运行在远程机器上，再通过消息平台和你协作。

### Cron

`Cron` 是定时自动化能力。

你可以让 Hermes 定时做事，比如：

- 每天早上汇总新闻
- 定期巡检服务器
- 周报生成
- 日志审计
- 备份提醒

它不是普通 shell 计划任务的简单包装，而是“定时触发 Agent 去完成任务”。

### Delegation

也就是子 Agent 委派。

`Hermes Agent` 可以把复杂任务拆给多个隔离的子 Agent 并行处理，再把结果汇总回来。

这让它不仅能做单线程问答，还能做多分支任务执行。

### MCP

`MCP` 是 `Model Context Protocol`。

它允许 `Hermes Agent` 连接外部 MCP 服务器，从而使用外部工具生态，比如：

- GitHub
- 数据库
- 文件系统
- 浏览器栈
- 企业内部 API

如果你想让 Hermes 接入现有工具系统，`MCP` 往往是最干净的方式。

### Sandboxed Execution

Hermes 支持不同执行后端，不一定直接在当前宿主机上跑命令。

常见方式包括：

- local
- Docker
- SSH
- Daytona
- Singularity
- Modal

这意味着你可以把 Agent 放在更安全、更隔离、或者更便宜的执行环境中。

### ACP

`ACP` 让 `Hermes Agent` 可以作为编辑器 Agent 服务运行，用于接入支持 `ACP` 的编辑器。

你可以把它理解成：Hermes 不只是终端产品，也可以变成 IDE 里的底层 Agent 服务。

### Architecture

如果你后面要二次开发，就要理解这些内部模块：

- CLI 入口
- Gateway 入口
- Agent Loop
- Prompt Builder
- Runtime Provider
- Tool Registry
- Session Storage
- MCP Runtime
- Plugin System

## 6. 学习路线总览

我建议你按 5 个阶段推进。

## 阶段 1：先学会最小可用的 CLI Agent

### 目标

- 理解 `Hermes Agent` 不是普通终端聊天壳
- 能独立跑通最小安装、模型配置和对话

### 学习内容

- 安装 `Hermes Agent`
- 运行 `hermes setup`
- 选择模型提供商和模型
- 启动 `hermes`
- 体验一次最小对话
- 体验恢复会话

### 你要达到的结果

- 能独立在本机跑通 `Hermes Agent`
- 能解释 `hermes`、`hermes setup`、`hermes model`、`hermes tools` 的作用
- 能说清楚它和普通聊天模型 CLI 的区别

## 阶段 2：掌握模型、工具和执行环境配置

### 目标

- 学会控制 Hermes 的可用能力
- 学会让 Agent 在合适的环境中安全执行任务

### 学习内容

- 模型提供商配置
- 工具启用与禁用
- 工具分组 `Toolsets`
- 本地终端执行
- Docker / SSH 等隔离执行后端
- 常见 CLI 命令和斜杠命令

### 你要达到的结果

- 能切换不同模型和不同提供商
- 能控制哪些工具开放给 Agent
- 能配置一个更安全的命令执行环境
- 能熟练使用 `/help`、`/tools`、`/model`、`/save` 等命令

## 阶段 3：掌握长期能力：Skills、Memory、Context Files

### 目标

- 理解 Hermes 为什么会“越用越顺手”
- 学会使用它的长期知识与个性化能力

### 学习内容

- `Skills` 的加载和使用
- 技能目录结构
- 技能搜索、安装、检查、更新
- `Memory` 与 `USER` Profile 的区别
- `Session Search` 的作用
- `Context Files`
- `SOUL.md` / 个性化设置

### 你要达到的结果

- 能解释 `Skills` 和普通 Prompt 的区别
- 能安装并使用一个现成技能
- 能理解 Hermes 为什么能跨会话保留有效习惯和信息
- 能为一个项目配置合适的上下文文件

## 阶段 4：掌握自动化与外部集成

### 目标

- 学会让 Hermes 从“可对话工具”升级成“持续运行的自动化 Agent”
- 学会把外部系统能力接进来

### 学习内容

- `Gateway` 多平台接入
- `Cron` 定时任务
- `Delegation` 子 Agent 委派
- `MCP` 服务器接入
- MCP 工具过滤与命名规则
- 典型自动化场景设计

### 你要达到的结果

- 能让 Hermes 从消息平台上和你交互
- 能创建一个定时自动化任务
- 能接入至少一个 MCP Server
- 能理解“内置工具”和“MCP 工具”的关系

## 阶段 5：掌握架构、扩展和二次开发

### 目标

- 理解 Hermes 的系统结构
- 能阅读源码、做基础扩展和二次开发

### 学习内容

- `Architecture` 总览
- `AIAgent` 主循环
- `Prompt Builder`
- `Tool Registry`
- `Session Storage`
- `Gateway` 内部机制
- Plugin 系统
- 自定义工具 / 技能 / 插件
- ACP 集成

### 你要达到的结果

- 能读懂 Hermes 的顶层结构
- 能定位主要入口文件和核心模块
- 能判断一个需求应该通过技能、MCP、插件还是源码修改实现

## 7. 4 周学习安排

下面是一个更适合你当前阶段的 `Hermes Agent` 专项安排。

## 第 1 周：安装、配置、最小可用

### 学习目标

- 跑通 Hermes Agent
- 熟悉最基础的 CLI 使用方式
- 能让它完成简单任务

### 重点主题

- 安装脚本
- `hermes setup`
- `hermes model`
- `hermes tools`
- `hermes`
- 恢复会话与中断任务

### 本周实践

- 完成一次本机安装
- 配置一个可用模型
- 让 Hermes 帮你查看磁盘使用、搜索文件、读取文档
- 测试中断任务和继续会话

### 本周产出

- 一个可用的本地 Hermes 环境
- 一份你自己的 CLI 基础命令笔记

## 第 2 周：学会把 Hermes 用得像真正的 Agent

### 学习目标

- 理解工具和执行环境
- 学会使用技能、记忆、上下文能力

### 重点主题

- `Tools`
- `Toolsets`
- `Skills`
- `Memory`
- `Session Search`
- `Context Files`
- `SOUL.md`

### 本周实践

- 安装 1 到 2 个公开技能
- 为一个项目准备上下文文件
- 让 Hermes 记住你的一个偏好或工作习惯
- 对比“无上下文”和“有上下文”时的使用体验

### 本周产出

- 一个带技能和上下文的 Hermes 使用环境
- 一份“我会如何长期使用 Hermes”的个人配置草案

## 第 3 周：自动化、MCP 与远程运行

### 学习目标

- 学会把 Hermes 放到持续运行场景
- 学会接外部工具生态

### 重点主题

- `Gateway`
- `Cron`
- `Delegation`
- `MCP`
- Docker / SSH 执行后端

### 本周实践

- 配置一个消息平台入口，或至少读完对应文档
- 配一个简单的 `Cron` 任务
- 接入一个 MCP Server，例如文件系统或 GitHub
- 体验把 Hermes 放到 Docker 或远程机上运行

### 本周产出

- 一个具备自动化和外部集成能力的 Hermes 实验环境
- 一份适合你场景的自动化用例清单

## 第 4 周：架构理解与实战项目

### 学习目标

- 形成对 Hermes Agent 的完整理解
- 能结合自己的工作流做一个小项目

### 重点主题

- `Architecture`
- `AIAgent`
- `Tool Registry`
- `Gateway`
- `Plugin` / `Skills` / `MCP` 的边界
- 二次开发思路

### 本周实践

从下面选一个项目：

- 个人研发助理：本地代码 + GitHub + 文档总结
- 日报 / 周报助理：定时汇总任务与输出报告
- 技术情报助理：每天抓取资讯并推送给你
- 远程运维助理：消息平台触发远端巡检与汇总

### 本周产出

- 一个可运行的 Hermes 小项目
- 一份复盘：哪些能力最好用、哪些场景需要二次开发、哪里适合接 `MCP`

## 8. Hermes Agent 官方文档应该怎么读

官方文档内容比较多，建议不要从头到尾线性硬啃，而是按目标读。

### 如果你是初学者

推荐顺序：

1. `Installation`
2. `Quickstart`
3. `CLI Usage`
4. `Configuration`
5. `Tools`

你的目标不是看完所有文档，而是先把最小工作流跑通。

### 如果你已经会基础使用

推荐顺序：

1. `Skills`
2. `Memory`
3. `Context Files`
4. `Messaging`
5. `Cron`
6. `Delegation`
7. `MCP`

这一阶段的重点是：理解 Hermes 和普通 CLI 助手真正拉开差距的地方。

### 如果你要做开发或二次定制

推荐顺序：

1. `Architecture`
2. `Agent Loop`
3. `Prompt Assembly`
4. `Provider Runtime`
5. `Tools Runtime`
6. `Session Storage`
7. `Gateway Internals`
8. `Creating Skills` / `Adding Tools` / Plugin 文档

这一阶段要形成一个判断：

- 这是“配置问题”
- 这是“技能问题”
- 这是“MCP 接入问题”
- 这是“要改源码的架构问题”

## 9. 你学习 Hermes 时最应该关注的能力点

很多人学 Hermes 会被“功能很多”弄乱，所以建议你抓下面 6 个重点。

### 1. 它如何持续工作

重点关注：

- 会话机制
- Gateway
- Cron
- 远程运行

因为 Hermes 的价值不只是“答题”，而是“持续替你做事”。

### 2. 它如何获得真实能力

重点关注：

- 内置工具
- Toolsets
- MCP
- 执行后端

因为 Agent 是否能落地，本质取决于它到底能调哪些能力。

### 3. 它如何变得越来越懂你

重点关注：

- Memory
- USER Profile
- Session Search
- Context Files
- SOUL.md

这是 Hermes 和一次性聊天机器人差异很大的地方。

### 4. 它如何沉淀经验

重点关注：

- Skills
- 技能目录结构
- 技能安装与更新
- Agent 自生成技能

这决定了 Hermes 能不能从“每次都重新教”进化成“逐渐会做”。

### 5. 它如何安全运行

重点关注：

- 工具开关
- 审批与授权
- Docker / SSH / 隔离执行
- MCP 暴露范围控制

功能越强，越要知道哪些能力应该开放，哪些不该开放。

### 6. 它如何扩展

重点关注：

- MCP
- Plugin
- 自定义 Skills
- 二次开发入口

这决定 Hermes 能否真正接入你的现有工作流。

## 10. 推荐做的最小实践项目

学习 Hermes 不要只看文档，最好的方式是做小项目。

### 项目 1：CLI 研发助手

目标：

- 让 Hermes 在本地终端中读代码、查文件、执行命令、总结问题

你会学到：

- CLI
- Tools
- Toolsets
- 执行环境
- Context Files

### 项目 2：消息平台个人助理

目标：

- 让 Hermes 在 Telegram 或 Discord 中作为你的远程助手

你会学到：

- Gateway
- 多平台接入
- 权限控制
- 会话连续性

### 项目 3：定时情报汇总机器人

目标：

- 每天固定时间抓取 AI 资讯并推送摘要

你会学到：

- Cron
- Web 工具
- 结果投递
- 自动化任务设计

### 项目 4：GitHub / 文件系统增强助手

目标：

- 通过 MCP 把 GitHub 或文件系统能力接给 Hermes

你会学到：

- MCP Server 配置
- 工具过滤
- 外部能力接入

### 项目 5：个人长期知识助理

目标：

- 让 Hermes 记住你的项目背景、偏好和工作约定，逐渐配合得更顺手

你会学到：

- Memory
- USER Profile
- Skills
- Context Files
- Session Search

## 11. 检验自己是否学会

当你能做到下面这些事时，说明你已经从入门接近可实战：

- 能独立安装并配置 `Hermes Agent`
- 能切换模型、配置工具和执行环境
- 能解释 `Skills`、`Memory`、`Context Files` 的区别
- 能接入至少一个消息平台或一个 `MCP Server`
- 能创建一个定时自动化任务
- 能判断某个需求该用技能、MCP、插件还是源码修改解决
- 能设计一个适合自己工作流的 Hermes 使用方案

## 12. 常见误区

- 一开始就想把所有能力都配齐，结果基础 CLI 都没用熟
- 把 Hermes 当成普通聊天工具，而不是可执行的 Agent 系统
- 只关注模型，不关注工具、执行环境和安全边界
- 只会安装技能，不理解技能为什么有效
- 不做上下文和记忆配置，结果每次都重新解释背景
- 同时研究太多高级能力，导致没有一个用例真正跑通

## 13. 建议的阶段性里程碑

### 里程碑 1

- 能用 CLI 稳定完成文件读取、搜索、终端执行等基础任务

### 里程碑 2

- 能通过 `Skills`、`Memory`、`Context Files` 让 Hermes 更贴合你的工作流

### 里程碑 3

- 能完成一个消息平台接入或一个 `Cron` 自动化任务

### 里程碑 4

- 能接入一个 `MCP Server` 并理解工具暴露边界

### 里程碑 5

- 能做一个小型 Hermes 项目，并说清楚它的架构与扩展点

## 14. 下一步行动清单

建议你今天就开始做下面 6 件事：

1. 安装并启动 `Hermes Agent`
2. 配置一个你能稳定使用的模型
3. 运行一次最小 CLI 对话
4. 尝试一个终端任务和一个文件任务
5. 阅读 `Quickstart`、`CLI Usage`、`Skills`、`Memory` 这几部分官方文档
6. 写下你最想让 Hermes 帮你做的 3 个长期任务

## 15. 一句话路线图

先掌握 `Hermes Agent` 的最小 CLI 使用，再学会 `Tools + Skills + Memory + Context`，然后扩展到 `Gateway + Cron + MCP`，最后再进入架构理解和二次开发。