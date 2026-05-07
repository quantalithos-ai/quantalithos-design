# LangChain 与 CrewAI 学习计划

## 1. 学习目标

本计划面向希望系统掌握 LLM 应用开发的人，重点学习以下两条主线：

- `LangChain`：掌握基于大模型的提示词编排、链式调用、RAG、工具调用、记忆与工作流设计。
- `CrewAI`：掌握多 Agent 协作的角色设计、任务拆分、执行流程与真实业务场景落地。

完成本计划后，目标是能够独立完成以下项目：

- 一个基于 `LangChain` 的知识库问答系统
- 一个基于 `CrewAI` 的多 Agent 自动化任务系统
- 一个将 `LangChain + CrewAI` 结合的综合 Demo

## 2. 适用前提

默认你已经具备以下基础：

- 会使用 Python
- 了解 API 调用和 JSON
- 知道什么是 LLM、Prompt、Embedding、Vector Database、RAG
- 能使用终端、虚拟环境和包管理工具

如果以上基础还不够扎实，建议先补 3 到 5 天：

- Python 基础语法与面向对象
- `requests`、`pydantic`、`asyncio` 基础
- OpenAI 兼容接口调用方式
- 向量检索与 RAG 基本概念

## 3. 学习策略

整个学习过程遵循 4 个原则：

- 先单 Agent，后多 Agent
- 先调用框架，后理解内部抽象
- 先做小 Demo，后做复杂项目
- 每学完一个主题就产出可运行代码

建议按照 `LangChain -> CrewAI -> 二者结合` 的顺序学习，不要一开始同时深入两套抽象。

## 4. 8 周学习路线

## 第 1 周：打基础，建立 LLM 应用认知

### 目标

- 建立 LLM 应用开发的整体视角
- 能独立完成模型 API 调用与 Prompt 实验
- 理解为什么需要 LangChain 和 CrewAI

### 学习内容

- LLM 应用基本组成：模型、提示词、上下文、工具、记忆、RAG、Agent
- Chat Completions / Responses 类接口调用方式
- Prompt 设计基础
- Token、上下文窗口、结构化输出
- Function Calling / Tool Calling 概念

### 实践任务

- 编写一个最小聊天脚本
- 编写一个结构化输出脚本，要求模型返回 JSON
- 编写一个工具调用 Demo，例如“查询天气”或“查本地文件”

### 产出

- `01-chat-demo`
- `02-json-output-demo`
- `03-tool-calling-demo`

## 第 2 周：LangChain 入门

### 目标

- 理解 LangChain 的核心抽象和基本用法
- 能用 LangChain 重写第 1 周的小 Demo

### 学习内容

- LangChain 的整体架构
- Model、PromptTemplate、OutputParser
- Runnable 思想
- 链式调用与 `invoke` / `stream` / `batch`
- 基础工具封装

### 实践任务

- 用 LangChain 实现一个问答链
- 用 PromptTemplate + OutputParser 实现结构化输出
- 封装一个简单工具并让模型调用

### 产出

- `langchain-basic-chain`
- `langchain-structured-output`
- `langchain-tool-demo`

## 第 3 周：LangChain 进阶 - RAG

### 目标

- 理解 LangChain 在知识库问答中的使用方式
- 跑通一个最小可用 RAG 系统

### 学习内容

- 文档加载器与文本切分
- Embedding 与向量数据库
- Retriever 的基本工作方式
- RAG 基本流程：切分、索引、检索、生成
- 检索质量优化基础

### 实践任务

- 使用本地文档构建知识库
- 完成一个命令行问答系统
- 对比“无检索”和“有检索”的回答质量

### 产出

- `langchain-rag-cli`
- 一份 RAG 实验记录：切分策略、召回效果、典型错误

## 第 4 周：LangChain 进阶 - Agent 与工作流

### 目标

- 理解 LangChain 如何组织工具调用和多步骤任务
- 能搭建基础 Agent 工作流

### 学习内容

- Agent 的本质：规划、调用工具、观察结果、继续执行
- Tool 设计原则
- 记忆与会话状态管理
- LangGraph 或 LangChain 工作流思想
- 错误处理、重试、超时控制

### 实践任务

- 构建一个“研究助手”Agent：搜索资料、总结、输出结果
- 构建一个“任务处理流”：输入任务 -> 分析 -> 调工具 -> 输出报告

### 产出

- `langchain-agent-demo`
- `langchain-workflow-demo`

## 第 5 周：CrewAI 入门

### 目标

- 理解 CrewAI 的设计理念与多 Agent 协作方式
- 能构建最小 CrewAI 项目

### 学习内容

- CrewAI 中的 `Agent`、`Task`、`Crew`、`Process`
- 角色定义与职责边界
- 多 Agent 串行与协同流程
- 工具注入与任务上下文传递

### 实践任务

- 创建 2 到 3 个角色：研究员、分析师、写作者
- 让它们围绕一个主题协作完成一份小报告
- 比较单 Agent 与多 Agent 输出差异

### 产出

- `crewai-basic-collaboration`
- 一份多 Agent 协作观察记录

## 第 6 周：CrewAI 进阶 - 任务拆分与业务建模

### 目标

- 学会把真实业务问题拆成多 Agent 任务
- 掌握 CrewAI 的场景建模方法

### 学习内容

- 多 Agent 系统设计方法
- 角色拆分原则：按能力拆、按流程拆、按责任拆
- Task 依赖与执行顺序
- 结果汇总、冲突处理、失败回退
- 成本与性能考量

### 实践任务

- 做一个“内容生产 Crew”：选题 -> 搜集材料 -> 撰写初稿 -> 审核修订
- 做一个“需求分析 Crew”：整理需求 -> 风险分析 -> 输出任务清单

### 产出

- `crewai-content-pipeline`
- `crewai-requirement-analysis`

## 第 7 周：LangChain 与 CrewAI 结合

### 目标

- 理解两者的边界与组合方式
- 能把 LangChain 的工具/RAG 能力提供给 CrewAI 使用

### 学习内容

- LangChain 适合做什么：工具层、RAG 层、工作流层
- CrewAI 适合做什么：角色分工、多 Agent 协作、业务任务组织
- 结合方式：CrewAI 调 LangChain 封装的工具与知识能力
- 项目结构设计：配置、Agent、任务、工具、知识库

### 实践任务

- 构建一个“行业研究助手”
- 使用 CrewAI 分配角色
- 使用 LangChain 提供检索、问答、结构化输出能力

### 产出

- `langchain-crewai-hybrid-demo`

## 第 8 周：综合项目与复盘

### 目标

- 用一个完整项目收束知识点
- 建立自己的开发模板和方法论

### 综合项目建议

从下面选择一个：

- 企业知识库问答 + 报告生成系统
- 多 Agent 市场调研助手
- 文档分析与任务拆解助手
- 技术选型研究与结论输出系统

### 项目要求

- 至少包含 1 个知识检索模块
- 至少包含 3 个 Agent 角色
- 至少包含 2 个工具
- 具备结构化输出
- 记录错误案例与优化过程

### 最终产出

- 完整项目代码
- 项目说明文档
- 架构图或流程图
- 一份复盘：做对了什么、踩了哪些坑、后续如何优化

## 5. 每周时间安排建议

如果你是业余学习，推荐每周投入 8 到 12 小时：

- 周一到周五：每天 1 小时
- 周末：3 到 5 小时做项目实践

如果你是集中学习，推荐每周投入 15 到 20 小时：

- 40% 看文档和官方示例
- 50% 动手做 Demo
- 10% 写复盘和总结

## 6. 学习重点排序

建议按照下面优先级推进：

1. LLM 基础与 Prompt
2. LangChain 基础抽象
3. LangChain 的 RAG 与工具调用
4. CrewAI 的角色、任务、协作模型
5. LangChain 与 CrewAI 结合
6. 性能、稳定性、评估与工程化

## 7. 推荐资料

### LangChain

- 官方文档
- 官方 Quickstart
- Runnable、Agents、RAG、LangGraph 相关章节
- 官方示例项目

### CrewAI

- 官方文档
- Quickstart
- Agent、Task、Crew、Tools 相关章节
- 官方示例仓库

### 通用基础

- OpenAI 兼容模型调用文档
- 向量数据库基础资料
- RAG 相关文章
- Prompt Engineering 实践资料

建议优先顺序：先看官方 Quickstart，再跑官方 Demo，再做自己的最小项目。

## 8. 检验自己是否学会

当你能做到下面这些事时，说明已经入门并接近可实战：

- 能不用抄示例，自己从零搭一个 LangChain 问答链
- 能自己实现一个最小 RAG 系统
- 能自己设计 3 个 CrewAI Agent 并让它们协作完成任务
- 能解释 LangChain 和 CrewAI 的区别与搭配方式
- 能定位常见问题，例如提示词不稳定、工具调用失败、检索质量差、Agent 跑偏

## 9. 常见误区

- 一开始就上复杂多 Agent，结果调不通
- 只看教程不写代码
- 过度依赖框架，不理解底层 LLM 调用逻辑
- 没有记录实验结果，导致优化没有依据
- 同时学太多框架，最后都停留在会跑示例

## 10. 建议的阶段性里程碑

### 里程碑 1

- 能独立完成 LangChain 基础链和工具调用 Demo

### 里程碑 2

- 能独立完成一个本地文档 RAG 问答系统

### 里程碑 3

- 能独立完成一个 3 Agent 的 CrewAI 协作任务

### 里程碑 4

- 能完成一个 LangChain + CrewAI 的综合项目

## 11. 下一步行动清单

建议你今天就开始做下面 5 件事：

1. 安装 Python 虚拟环境并准备项目目录
2. 跑通一次模型 API 调用
3. 跑通 LangChain Quickstart
4. 跑通 CrewAI Quickstart
5. 建一个学习记录文件，记录每天学了什么、遇到什么问题、下一步做什么

## 12. 一句话路线图

先掌握 `LangChain` 的单体能力，再学习 `CrewAI` 的多角色协作，最后把两者组合成一个真实可运行的 LLM 应用系统。
