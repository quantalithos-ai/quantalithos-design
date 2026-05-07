# LangChain 学习文档

## 1. 这份文档的目标

这份文档专门帮助你系统学习 `LangChain`，目标不是“会跑官方示例”，而是逐步达到下面 4 个层次：

- 能看懂 `LangChain` 的核心抽象
- 能独立写出一个基础问答链和结构化输出链
- 能独立实现一个最小可用的 RAG 系统
- 能进一步理解 Agent、工具调用和工作流设计

你可以把这份文档当成一个从入门到实战的训练手册。

## 2. 学习建议：先学什么，后学什么

学习 `LangChain` 最容易踩的坑，是一开始就冲 Agent、多工具、多步骤流程，结果每层抽象都没吃透。

建议你严格按下面顺序学习：

1. 先会直接调用模型
2. 再学 `PromptTemplate`
3. 再学 `OutputParser`
4. 再学 `Runnable` 和链式调用
5. 再学工具调用
6. 再学 RAG
7. 最后再学 Agent 和工作流

一句话：**先把“单次调用”学清楚，再做“多步骤系统”。**

## 3. 你学习 LangChain 前需要知道什么

开始前，建议你已经具备这些基础：

- 会 Python 基础语法
- 会创建虚拟环境
- 会安装依赖包
- 知道什么是 API Key
- 知道什么是 Prompt、Embedding、RAG
- 能读懂基本 JSON

如果这些你还不够熟，可以先补 1 到 3 天，不然学 LangChain 会觉得全是新概念叠在一起。

## 4. LangChain 是什么

`LangChain` 是一个围绕大语言模型应用开发的框架，它帮你把这些能力组织起来：

- 模型调用
- Prompt 模板化
- 输出结构化
- 工具调用
- 文档加载与切分
- 检索增强生成（RAG）
- Agent 与工作流编排

你可以把它理解成：

- `LLM` 是大脑
- `LangChain` 是把大脑接入系统的一组工程化组件

## 5. LangChain 核心概念地图

你后面会频繁遇到这些词，先建立最小认知：

### Model

负责真正调用大模型。

你可以把它理解为“和模型 API 对话的对象”。

### PromptTemplate

负责组织输入模板。

它解决的问题是：不要把提示词直接写死在代码里，而是把可变部分抽出来。

### OutputParser

负责把模型输出转成你想要的格式。

例如：

- 字符串
- JSON
- 列表
- `Pydantic` 对象

### Runnable

这是 LangChain 很关键的一层抽象。

它的核心思想是：

- 每个步骤都可以被调用
- 多个步骤可以串起来
- 链可以像管道一样组合

### Document Loader

把外部文档读进来，例如：

- txt
- markdown
- pdf
- 网页

### Text Splitter

把长文档切成更适合检索的小块。

### Embeddings

把文本转成向量，便于语义检索。

### Vector Store

存储向量并支持相似度检索。

### Retriever

根据用户问题，从知识库中召回相关片段。

### Agent

让模型按“思考 -> 调工具 -> 观察结果 -> 继续执行”的方式完成更复杂任务。

## 6. 学习路线总览

我建议你按 5 个阶段推进。

## 阶段 1：先学会最小调用

### 目标

- 理解 LangChain 不是魔法，本质还是在组织模型调用
- 能独立写出最小问答程序

### 学习内容

- 安装 LangChain 相关依赖
- 配置模型 API
- 调用一个聊天模型
- 理解输入、输出、消息格式

### 你要达到的结果

- 能写出一个最小聊天脚本
- 能解释“LangChain 只是把调用过程封装得更清晰”

## 阶段 2：掌握 Prompt 和结构化输出

### 目标

- 学会把提示词模板化
- 学会控制输出格式

### 学习内容

- `PromptTemplate`
- `ChatPromptTemplate`
- `OutputParser`
- 结构化输出

### 你要达到的结果

- 能把变量注入提示词
- 能让模型稳定输出 JSON 风格结果

## 阶段 3：掌握 Runnable 和链

### 目标

- 理解 LangChain 最常见的组合方式
- 能把多个步骤像管道一样串起来

### 学习内容

- `prompt | model | parser`
- `invoke`
- `stream`
- `batch`
- 链式组合思想

### 你要达到的结果

- 能独立写出一个“输入问题 -> 生成回答 -> 解析输出”的链

## 阶段 4：掌握 RAG

### 目标

- 学会做最小知识库问答
- 理解为什么要切分文档、做 embedding、建立 retriever

### 学习内容

- 文档加载
- 文本切分
- embedding
- vector store
- retriever
- 检索增强生成

### 你要达到的结果

- 能完成一个基于本地文档的问答程序

## 阶段 5：掌握工具调用和 Agent

### 目标

- 理解什么时候该用 Agent，什么时候不该用
- 学会把模型接到真实能力上

### 学习内容

- tools
- function calling
- agent 基本执行过程
- 多步骤任务
- 简单工作流

### 你要达到的结果

- 能实现一个最小 Agent Demo
- 能理解 Agent 和普通链的区别

## 7. 4 周学习安排

下面是一个更适合你当前阶段的 `LangChain` 专项安排。

## 第 1 周：基础调用与 Prompt

### 学习目标

- 理解 LangChain 的最小结构
- 会调用聊天模型
- 会使用 Prompt 模板
- 会让输出更稳定

### 重点主题

- 环境搭建
- `ChatOpenAI` 或兼容模型调用
- `PromptTemplate`
- `ChatPromptTemplate`
- `StrOutputParser`

### 本周实践

- 最小聊天程序
- 翻译助手
- 摘要助手
- 结构化回答 Demo

## 第 2 周：Runnable 与链式组合

### 学习目标

- 学会把多个处理步骤串起来
- 理解 LangChain 的核心组合模式

### 重点主题

- `Runnable`
- `invoke`
- `batch`
- `stream`
- 输入输出在链中的流动方式

### 本周实践

- 问答链
- 文章摘要链
- 信息提取链
- 多语言翻译链

## 第 3 周：RAG 基础

### 学习目标

- 学会让 LangChain 读取文档并做检索
- 跑通一个最小 RAG 问答系统

### 重点主题

- 文档加载器
- 文本切分器
- embeddings
- vector store
- retriever
- RAG chain

### 本周实践

- 对 markdown 文档建立知识库
- 命令行问答
- 召回结果观察
- 不同 chunk 策略对比

## 第 4 周：Tools、Agent 与工作流

### 学习目标

- 理解工具调用和 Agent 的边界
- 能做一个基础研究助手

### 重点主题

- tool 封装
- agent 执行流程
- 错误处理
- 观察日志
- 简单工作流思维

### 本周实践

- 文件查询工具
- 简单搜索工具
- 研究助手 Agent
- 任务分解小 Demo

## 8. 每个阶段该产出的 Demo

为了避免“学了很多概念，但没有作品”，建议你最少做出下面这些 Demo：

1. `langchain-chat-demo`
2. `langchain-prompt-demo`
3. `langchain-output-parser-demo`
4. `langchain-runnable-chain-demo`
5. `langchain-rag-demo`
6. `langchain-tool-demo`
7. `langchain-agent-demo`

如果你 7 个 Demo 都做完，基本已经不是“入门了解”，而是进入“可独立开发”的阶段了。

## 9. 学习时要重点理解的 5 个问题

不要只会照着敲代码，要边学边回答下面这些问题：

1. 为什么这里需要模板，而不是直接写字符串？
2. 这一层输入和输出分别是什么？
3. 这一层是 LangChain 的能力，还是模型自身的能力？
4. 为什么这里应该用普通链，而不是 Agent？
5. 如果结果不稳定，是 Prompt 问题、模型问题、还是框架组合问题？

## 10. 你最容易踩的坑

### 误区 1：把 LangChain 当黑盒

如果你不知道底层模型调用在做什么，出了问题你会完全不会排查。

### 误区 2：一开始就学 Agent

Agent 是最复杂的一层，应该后学。

### 误区 3：只会跑样例，不会自己改

你必须把官方示例改造成你自己的小功能，才算真正学会。

### 误区 4：不记录实验结果

RAG、Prompt、工具调用都很依赖实验记录。

### 误区 5：学了一堆 API，不理解抽象关系

真正重要的是你能理解：

- prompt 负责什么
- model 负责什么
- parser 负责什么
- retriever 负责什么
- agent 负责什么

## 11. 推荐学习方式

建议每学一个主题都按下面 4 步走：

1. 看官方文档中的最小示例
2. 自己手敲一遍
3. 改造成另一个相似功能
4. 用一句话总结“这个组件解决了什么问题”

比如你学 `PromptTemplate`，不要停留在“我会写模板了”，而要能说出：

> `PromptTemplate` 解决的是提示词复用和变量注入问题。

## 12. 学习检查点

当你能做到下面这些事时，说明你已经掌握了 LangChain 基础：

- 能从零写出一个 `prompt | model | parser` 的链
- 能解释 `invoke` 的作用
- 能把模型输出解析成结构化结果
- 能使用文档做一个最小 RAG
- 能解释链、工具、Agent 三者的区别

## 13. 现在就开始：第 1 课

下面是你现在应该做的第一课，不需要等。

## 第 1 课目标

今天只做一件事：**跑通一个最小 LangChain 调用。**

你今天不需要学 Agent，不需要学 RAG，不需要学复杂工作流。

只做下面 3 步：

### 第一步：准备环境

建议准备：

- Python 3.10+
- 虚拟环境
- 一个可用的大模型 API Key
- `langchain`
- `langchain-openai`
- `python-dotenv`

### 第二步：理解最小代码结构

最小结构只包含 3 个对象：

- model
- prompt
- parser

核心代码形态如下：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")
parser = StrOutputParser()

chain = prompt | model | parser
result = chain.invoke({"topic": "LangChain"})
print(result)
```

### 第三步：自己改 3 次

不要只跑通一次，至少改 3 次：

- 把 `LangChain` 改成 `RAG`
- 把“一句话解释”改成“列出 3 个要点”
- 把输出目标改成“适合初学者理解”

你只有改过，才是真的开始学会。

## 14. 第 1 周每日安排

如果你想马上进入状态，可以直接按这个节奏走。

### Day 1

- 安装依赖
- 配置 API Key
- 跑通最小 LangChain 调用
- 改写 3 个 Prompt

### Day 2

- 学 `PromptTemplate`
- 写一个翻译 Prompt
- 写一个摘要 Prompt
- 写一个角色设定 Prompt

### Day 3

- 学 `OutputParser`
- 让模型输出固定格式
- 尝试提取结构化信息

### Day 4

- 学 `ChatPromptTemplate`
- 理解 system 和 user 消息的区别
- 做一个“老师讲解器”Demo

### Day 5

- 学 `Runnable`
- 写一个 `prompt | model | parser` 链
- 尝试 `batch` 和 `stream`

### Day 6

- 做一个小项目：学习助手
- 输入一个主题
- 输出定义、关键点、应用场景、常见误区

### Day 7

- 复盘本周
- 不看资料，自己从零重写一个 Demo
- 记录哪里还不理解

## 15. 我接下来会怎么带你学

如果你愿意继续，我建议我们按下面方式推进：

- 第一步：我带你完成 LangChain 第 1 课
- 第二步：我给你布置一个很小的练习
- 第三步：你做完后，我再带你进入 `PromptTemplate`
- 第四步：再逐步进入 `Runnable`、RAG、Tool、Agent

也就是说，我们可以把这份文档变成一套连续学习流程，而不是只停留在阅读层面。

## 16. 一句话路线图

先学 `prompt + model + parser`，再学 `Runnable`，再学 `RAG`，最后学 `tools + agent`。只要这个顺序不乱，你学 LangChain 会顺很多。

## 17. 当前已学习内容记录

截至目前，你已经学习和讨论过下面这些内容：

- `LLM` 是什么
- `Prompt` 是什么
- `Embedding` 是什么
- `Vector Database` 是什么
- `RAG` 是什么
- 终端、虚拟环境、包管理工具分别是什么
- `PromptTemplate` 的作用、写法和使用场景
- `PromptTemplate` 对输出质量的影响
- `Codex CLI`、`Claude Code` 与 Prompt 系统的大致关系

这部分内容建议你反复回看，因为它们是后面学习 `ChatPromptTemplate`、`OutputParser`、`Runnable`、RAG 和 Agent 的共同基础。

## 18. 基础概念补充笔记

### LLM

`LLM` 是 `Large Language Model`，也就是大语言模型。它负责理解输入、生成回答、改写文本、总结内容和生成代码。

你可以把它理解成“负责思考和生成文本的大脑”。

常见例子有：

- `GPT`
- `Claude`
- `Gemini`
- `Qwen`
- `DeepSeek`

### Prompt

`Prompt` 是你给模型的输入指令。

例如：

- 请解释什么是 LangChain
- 请把下面内容总结成 3 个要点
- 你现在是一名 Python 老师，请用通俗语言解释装饰器

一句话理解：`Prompt` 决定你如何向模型提问。

### Embedding

`Embedding` 是把文本转换成向量表示的过程。

它不是用来直接回答问题的，而是用来表示文本语义、计算文本之间是否相似。

一句话理解：`Embedding` 让程序能比较“两段文本的意思像不像”。

### Vector Database

`Vector Database` 是专门存储向量并执行相似度检索的数据库。

当你把文档做完 embedding 之后，就需要把这些向量存起来，后面用户提问时才能去查“最相关的几段内容”。

一句话理解：它是“存语义坐标并按相似度搜索”的数据库。

### RAG

`RAG` 是 `Retrieval-Augmented Generation`，中文一般叫检索增强生成。

它的基本思路是：

1. 先去知识库检索相关资料
2. 再把检索结果交给模型
3. 最后让模型基于资料生成回答

一句话理解：`RAG = 先查资料，再回答`。

### 终端

终端是你通过命令操作电脑的地方。

比如：

- `cd` 切换目录
- `ls` 查看文件
- `python app.py` 运行脚本
- `pip install langchain` 安装依赖

### 虚拟环境

虚拟环境用于给每个 Python 项目隔离依赖。

这样不同项目可以安装不同版本的包，而不会互相冲突。

一句话理解：虚拟环境就是“每个项目自己的依赖小房间”。

### 包管理工具

包管理工具负责安装、升级和管理第三方依赖。

Python 中常见的有：

- `pip`
- `poetry`
- `uv`

在当前学习阶段，你先掌握 `pip` 就够了。

## 19. PromptTemplate 深入理解

### PromptTemplate 是什么

`PromptTemplate` 是 LangChain 中用于组织提示词模板的组件。

它的核心作用是：不要把 prompt 写死，而是把变化的内容抽成变量。

例如：

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("请用一句话解释 {topic}")
print(prompt.format(topic="LangChain"))
```

这里的 `{topic}` 就是变量占位符。

### PromptTemplate 解决了什么问题

它主要解决 3 件事：

- 提示词复用
- 动态传参
- 更容易和 `model`、`parser`、`Runnable` 组合

所以一句话总结：

> `PromptTemplate` 解决的是提示词复用和变量注入问题。

### PromptTemplate 和普通字符串的区别

普通字符串：

```python
prompt = "请用一句话解释 LangChain"
```

模板化写法：

```python
prompt = PromptTemplate.from_template("请用一句话解释 {topic}")
```

区别在于：

- 普通字符串适合临时测试
- `PromptTemplate` 更适合复用、扩展和进入 LangChain 链式调用

### PromptTemplate 的常见使用场景

- 问答
- 翻译
- 摘要
- 角色设定
- 结构化输出

例如：

```python
prompt = PromptTemplate.from_template(
    "你是一位 {role}，请用 {style} 的方式解释 {topic}，并列出 {count} 个重点。"
)
```

### 学习 PromptTemplate 时最该理解什么

你要慢慢形成下面这个意识：

- 固定规则写在模板里
- 变化内容通过变量传入
- prompt 不是随便写的话，而是程序输入设计的一部分

## 20. PromptTemplate 与输出质量

`PromptTemplate` 的好坏，确实会影响输出质量，但它不是唯一决定因素。

### PromptTemplate 会影响哪些方面

- 任务是否表达清楚
- 输出格式是否稳定
- 模型角色是否明确
- 回答边界是否可控
- 内容是否更贴近你的目标用户

### 但它不是唯一因素

输出质量还同时受这些因素影响：

- 模型本身能力
- 上下文质量
- RAG 检索结果是否准确
- 工具返回值是否可靠
- 温度等参数设置
- 系统提示词和开发者提示词

所以更准确的理解应该是：

> `PromptTemplate` 决定“你如何提问”，而系统整体质量决定“最终回答有多好”。

## 21. Codex CLI、Claude Code 与 Prompt 的关系

### 它们是否使用 PromptTemplate

严格来说，它们未必使用 LangChain 里的 `PromptTemplate` 这个类，也未必直接基于 LangChain 开发。

但是从工程思想上看，它们一定有“模板化 prompt 组织系统”。

### 它们通常不是一个单独模板

这类代码 Agent 更像是在运行时拼装多层提示信息，例如：

- 系统层指令
- 开发者层规则
- 用户任务描述
- 工具说明
- 当前工作目录和文件上下文
- 对话历史和摘要状态

所以它们更像是一个 `Prompt Stack`，而不是一个单独的 `PromptTemplate`。

### 关于本地是否能看到

以 `Codex CLI` 为例，本地通常可以看到一部分会话级指令信息，例如会话日志中的基础指令、开发者消息和上下文信息。

但一般看不到完整的最终运行时 prompt，因为真实输入往往还包含：

- 服务端附加指令
- 安全策略
- 工具 schema
- 动态上下文压缩结果

你当前阶段只需要先理解：

- 小项目里，`PromptTemplate` 常常就是一个模板对象
- 大项目里，它会演化成多层提示词组装系统

### 客户端和服务端分别会不会生成 Prompt

对于 `Codex CLI` 这类代码 Agent，更合理的理解不是“只有一端生成 prompt”，而是客户端和服务端一起参与组装最终输入。

#### 客户端通常负责什么

客户端更容易拿到本地上下文，因此通常会负责组织这些内容：

- 用户当前输入
- 当前工作目录
- 打开的文件和最近文件
- 本地工具调用结果
- shell 输出
- 本地可见的部分基础 instructions

也就是说，客户端不会只把“用户一句话”直接发给模型，而是会先做一层上下文收集和消息组装。

#### 服务端通常负责什么

服务端更适合统一控制平台级策略，因此通常还会继续补充或改写这些内容：

- 平台级 system prompt
- 安全与合规策略
- 工具 schema 或工具权限控制
- 模型路由与版本适配
- 上下文裁剪、压缩与摘要
- 灰度实验或产品级隐藏指令

#### 更准确的理解方式

最终送给模型的内容，通常不是单个 prompt，而是一套运行时拼装出来的消息上下文。

所以更准确地说：

- 客户端负责采集本地环境和部分 prompt 组织
- 服务端负责补充平台规则并生成最终模型输入

你在本地看到的 prompt，通常只是整个 `Prompt Stack` 的一部分，而不是完整最终版本。

#### 对学习 PromptTemplate 的启发

这件事对你学习 `LangChain` 很重要，因为它说明：

- 小型 Demo 常常只有一个 `PromptTemplate`
- 真实 Agent 系统通常是多层 prompt 叠加
- 工程里真正重要的是“谁负责组装哪一层上下文”

所以后面你学习 `ChatPromptTemplate` 时，不要只把它看成一个消息模板，还要开始建立“多层消息拼装”的意识。

### 一个简单结论

关于 `Codex CLI` 这类产品，你可以先记住下面这句话：

> 最终 prompt 通常不是纯客户端生成，也不是纯服务端生成，而是客户端和服务端共同组装的。

> 本地日志里能看到一部分，但通常看不到完整最终版本。

## 22. 当前阶段要记住的 6 句话

- `LLM` 负责生成和理解文本
- `Prompt` 是你给模型的任务说明
- `Embedding` 用于表示语义相似性
- `RAG` 是先检索资料再回答
- `PromptTemplate` 用于复用 prompt 和注入变量
- 大型 Agent 产品通常维护的是多层 prompt 系统，而不是单一模板

## 23. 下一步学习建议

基于你现在已经掌握的内容，下一步建议按这个顺序继续：

1. `ChatPromptTemplate`
2. `StrOutputParser`
3. `prompt | model | parser`
4. `invoke` 和链式调用
5. 再进入 RAG 基础

这条顺序能把你刚学到的 `PromptTemplate` 立刻接进真正的 LangChain 最小工作流里。

## 24. 当前阶段小结

到这里，你已经不只是“知道 LangChain 是什么”，而是已经开始进入最关键的入门层：

- 知道 LLM 应用的基础词汇
- 知道 prompt 在系统中不是装饰，而是输入接口
- 知道 `PromptTemplate` 是提示词工程的起点
- 知道真实代码 Agent 往往维护的是多层 prompt 体系

接下来继续学 `ChatPromptTemplate` 和 `OutputParser`，你就会真正把这些概念连成一条完整链路。

## 25. 先会直接调用模型

你现在决定先学“直接调用模型”，这是一个很好的顺序。

因为如果你还没有理解“模型到底怎么被调用”，后面学 `PromptTemplate`、`Runnable`、RAG 和 Agent 时会很容易把框架当成黑盒。

一句话：

> 先学会直接调用模型，再学 LangChain，思路会更清楚。

## 26. 什么叫直接调用模型

直接调用模型，指的是你先不依赖复杂框架，只做这件事：

- 准备 API Key
- 选择一个模型
- 发送一段输入
- 接收模型返回结果

也就是说，你先理解最小调用链路：

- 你写请求
- 请求发给模型服务
- 模型返回内容
- 程序把结果打印出来

这一步的核心目标不是“做复杂功能”，而是搞清楚：

- 输入长什么样
- 输出长什么样
- 调用时要传哪些参数
- 出错时通常会报什么错

## 27. 你为什么要先学这个

先会直接调用模型，有 4 个重要好处：

### 1. 知道 LangChain 底层到底在干什么

后面你写：

```python
chain = prompt | model | parser
```

如果你没学过底层调用，很容易误以为 LangChain 自己“会思考”。

其实不是，核心仍然是：程序把消息发给模型，再拿回结果。

### 2. 更容易排查问题

很多新手遇到的问题其实不是 LangChain 的问题，而是：

- API Key 错了
- base URL 错了
- 模型名写错了
- 网络不通
- 请求格式不对

如果你会直接调用模型，这类问题会更容易看明白。

### 3. 更容易理解 Prompt 的位置

你后面会发现，所谓 prompt，本质上就是“发给模型的输入内容”。

学会直接调用之后，你会明白：

- prompt 不是神秘对象
- prompt 就是请求中的一部分
- `PromptTemplate` 只是帮你更好地构造这部分输入

### 4. 后续迁移更容易

即使以后你不用 `LangChain`，你还是要会：

- 直接调 OpenAI 兼容接口
- 直接调本地模型服务
- 直接调企业内部模型网关

所以这是通用基础能力。

## 28. 直接调用模型时，你到底在调用什么

很多人会说“我在调用 GPT”或者“我在调用 Claude”，但从程序角度，更准确的说法是：

你在调用一个 **模型服务接口**。

这个接口通常要求你提供：

- `api_key`
- `model`
- `messages` 或 `input`
- 可选参数，例如 `temperature`

然后它返回：

- 模型生成的文本
- 或结构化响应对象

所以你现在可以先把“调用模型”理解为：

**向一个 AI 服务接口发送请求，并拿回响应。**

## 29. 直接调用模型的最小组成

一个最小模型调用通常有这几个部分：

### 1. API Key

用于证明你有权限调用这个模型服务。

### 2. Base URL

模型服务的接口地址。有些是官方地址，有些是兼容 OpenAI 协议的第三方地址。

### 3. Model

你要指定调用哪个模型，例如：

- `gpt-4o-mini`
- 某个兼容接口里的其他模型名

### 4. Messages

你要告诉模型“输入内容是什么”。

通常至少会有一条 `user` 消息。

### 5. Response

程序拿到模型返回内容后，再把它打印或保存。

## 30. 最小示例：直接调用聊天模型

下面先看一个最小示例。这里用的是 OpenAI 兼容写法，目的是帮助你理解调用结构。

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.openai.com/v1"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "请用一句话解释什么是 LangChain"}
    ]
)

print(response.choices[0].message.content)
```

你现在先不要被代码细节吓到，只要先看懂结构：

- `client`：连接模型服务
- `model`：指定要用哪个模型
- `messages`：告诉模型你要问什么
- `response`：模型返回的结果

## 31. 这段代码逐行在做什么

### `from openai import OpenAI`

导入客户端库，用它来发请求。

### `client = OpenAI(...)`

创建一个客户端对象，配置认证信息和服务地址。

### `client.chat.completions.create(...)`

真正发起请求。

### `model="gpt-4o-mini"`

告诉服务端你要用哪个模型。

### `messages=[...]`

告诉模型用户输入了什么。

### `response.choices[0].message.content`

从响应对象中取出模型生成的文本。

## 32. 你现在最需要理解的 3 个字段

如果你现在只记 3 个词，先记这三个：

- `model`
- `messages`
- `content`

可以把它们理解成：

- `model`：用谁来回答
- `messages`：你给了什么输入
- `content`：模型回了什么内容

## 33. messages 是什么

`messages` 是聊天模型调用中最重要的输入结构之一。

它通常是一个列表，每一项都是一条消息，例如：

```python
messages = [
    {"role": "system", "content": "你是一位面向初学者的老师"},
    {"role": "user", "content": "请解释什么是 PromptTemplate"}
]
```

这里你可以先简单理解：

- `system`：系统规则或角色设定
- `user`：用户提问
- `assistant`：模型之前的回答

在最小调用里，你甚至可以先只写 `user`。

## 34. 最小练习 1：改你的问题

把上面的示例改 3 次：

1. 把问题改成“请解释什么是 RAG”
2. 把问题改成“请列出 PromptTemplate 的 3 个作用”
3. 把问题改成“请用初学者能听懂的话解释 Embedding”

这个练习的目的不是炫技，而是让你亲手确认：

- 你改的是 `messages`
- 模型输出会跟着变化

## 35. 最小练习 2：加一条 system 消息

把最小示例改成这样：

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.openai.com/v1"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是一位面向初学者的 AI 老师"},
        {"role": "user", "content": "请解释什么是 LangChain"}
    ]
)

print(response.choices[0].message.content)
```

你对比一下：

- 不加 `system` 时，回答是什么风格
- 加了 `system` 后，回答有没有更像老师讲解

你会马上意识到：

**Prompt 的控制，最早就是从 `messages` 开始的。**

## 36. 最小练习 3：把配置移到环境变量

真实项目里不要把 API Key 写死在代码里。

更常见的方式是使用环境变量：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
)

response = client.chat.completions.create(
    model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    messages=[
        {"role": "user", "content": "请解释什么是 LangChain"}
    ]
)

print(response.choices[0].message.content)
```

这一步是为了让你逐渐养成工程习惯。

## 37. 直接调用模型时最常见的报错

你一开始最可能遇到这些问题：

### 1. API Key 错误

现象：认证失败、401、无权限。

### 2. Base URL 错误

现象：连接失败、404、接口不存在。

### 3. Model 名称错误

现象：模型不存在，或没有权限调用该模型。

### 4. 网络问题

现象：超时、无法连接、DNS 失败。

### 5. SDK 版本问题

现象：调用方法不存在，或参数不兼容。

所以你在学习阶段，先不要急着堆很多功能，先把“最小调用能稳定跑通”作为第一目标。

## 38. 直接调用模型和 LangChain 的关系

这一步学会之后，你再看 LangChain 会很清楚。

比如这段 LangChain 代码：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("请解释 {topic}")
parser = StrOutputParser()

chain = prompt | model | parser
print(chain.invoke({"topic": "LangChain"}))
```

它本质上只是把这些动作组织得更清晰：

- 构造输入
- 调模型
- 处理输出

所以你要建立这个认知：

> LangChain 不是替代模型调用，而是对模型调用进行工程化封装。

## 39. 你学完这一节后，应该达到什么程度

如果这一节学到位了，你应该能做到：

- 能解释什么叫“直接调用模型”
- 知道 `api_key`、`base_url`、`model`、`messages` 分别是什么
- 能写一个最小聊天脚本
- 能用 `system` 和 `user` 消息做最基本控制
- 知道常见报错该先查哪里

## 40. 现在就开始的行动清单

你现在可以按这个顺序开始：

1. 安装 `openai` Python SDK
2. 准备 API Key
3. 跑通最小示例
4. 修改 3 次 `messages`
5. 加一条 `system` 消息做对比
6. 再把配置改成环境变量

## 41. 我建议你下一步怎么学

当你把“直接调用模型”跑通之后，下一步最自然的顺序就是：

1. `PromptTemplate`
2. `ChatPromptTemplate`
3. `StrOutputParser`
4. `prompt | model | parser`

因为到那时你已经知道：

- prompt 最终是怎么进入请求的
- 模型响应是怎么回来的
- LangChain 只是把这些步骤模块化了

这样你学框架时就不会悬空。

## 42. 当前阶段一句话总结

先会直接调用模型，等于先把最底层调用链路摸清楚。这个基础一旦有了，后面学 `PromptTemplate` 和 `ChatPromptTemplate` 会顺很多。

## 43. 当模型想调用工具时，是如何生效的

这是理解 Agent 和现代模型 API 的关键问题。

最核心的一句话是：

> 模型不会自己真正执行工具，它只会表达“我想调用哪个工具、传什么参数”，真正执行工具的是外部程序。

一个完整的工具调用闭环通常是：

1. 客户端先声明有哪些工具可用
2. 模型判断当前问题是否需要工具
3. 模型返回一个结构化工具调用请求
4. 客户端或宿主程序真正执行工具
5. 工具结果再返回给模型
6. 模型基于工具结果继续生成最终答案

所以更准确地说：

- 模型负责决策
- 程序负责执行
- 工具结果再反馈给模型

## 44. 为什么模型不会自己执行工具

因为模型本质上是一个生成文本或结构化输出的系统。

它能做的是：

- 生成下一段文本
- 输出结构化字段
- 表达“我需要调用某个工具”

但它不能天然直接：

- 访问你的文件系统
- 执行 shell 命令
- 查询数据库
- 发起真实外部网络请求

所以真正执行这些动作的，永远是模型外部的宿主程序、框架、CLI 或后端服务。

## 45. 工具调用为什么不能只靠一段 JSON 文本

很多初学者会以为，只要模型输出一段类似下面的 JSON，系统就会自动执行工具：

```json
{
  "tool_name": "get_weather",
  "arguments": {
    "city": "北京"
  }
}
```

其实不是。

如果这段内容只是模型普通回答里的 `content` 文本，那么它本质上仍然只是文本。服务端不会因为它“长得像 JSON”就自动执行。

原因很简单：

- 它可能只是示例
- 它可能只是模型的一段说明
- 它可能不是系统约定的工具调用字段

所以：

> 不是“像工具调用的 JSON”就会生效，而是“必须符合 API 协议规定的工具调用结构”才会生效。

## 46. 客户端和服务端为什么需要一套协议

工具调用之所以能工作，是因为客户端和服务端之间通常有一套结构化协议，约定好：

- 哪个字段表示工具列表
- 哪个字段表示工具调用请求
- 哪个字段表示工具参数
- 哪种消息表示工具执行结果
- 工具结果应该如何回传

如果没有这套协议，系统无法区分：

- 这是一段普通文本
- 这是一段 JSON 示例
- 这是模型真的想调用工具
- 这是工具返回结果

所以工具调用本质上不只是“模型很聪明”，而是：

**模型能力 + API 协议 + 客户端执行器**

三者一起配合的结果。

## 47. 服务端如何知道这是客户端支持的工具

答案是：客户端会在请求一开始就把“本次会话允许使用的工具列表”告诉服务端。

也就是说，服务端知道的不是你电脑里全部可能的工具，而是这次请求中客户端显式注册过的工具集合。

例如，客户端可能在请求中声明：

- `get_weather`
- `read_file`
- `list_dir`

那么模型就只能在这些已注册工具中做选择。

如果模型输出了一个没有注册过的工具名，正常系统会：

- 拒绝执行
- 返回错误
- 或要求模型重新生成合法调用

所以真正起作用的不是模型“随口说了一个工具名”，而是：

> 工具已经被客户端预先注册，并被协议显式声明给了服务端和模型。

## 48. 一个抽象的工具调用协议示意

你现在不需要死记某一家厂商的具体字段，先理解抽象流程就够了。

### 第一步：客户端声明工具

概念上会有类似结构：

```json
{
  "model": "some-model",
  "messages": [...],
  "tools": [
    {
      "name": "get_weather",
      "description": "查询天气",
      "parameters": {
        "type": "object",
        "properties": {
          "city": { "type": "string" }
        },
        "required": ["city"]
      }
    }
  ]
}
```

这表示：

- 本次会话可用工具是 `get_weather`
- 它需要一个 `city` 参数

### 第二步：模型返回工具调用意图

模型如果决定需要用工具，返回的就不再只是普通文本，而是协议规定的结构化字段。

概念上可能像这样：

```json
{
  "tool_calls": [
    {
      "name": "get_weather",
      "arguments": {
        "city": "北京"
      }
    }
  ]
}
```

### 第三步：客户端真正执行工具

客户端看到工具调用后，才会去执行真正的程序逻辑，例如：

- 调本地函数
- 查数据库
- 调 HTTP API
- 读文件
- 执行命令

### 第四步：把结果再发回模型

工具结果会再作为新的结构化消息回传给模型，模型再继续生成最终答复。

## 49. 不同模型和不同厂商的格式是否有区别

答案是：有，而且区别通常不小。

### 常见区别包括

#### 1. 字段名字不同

有的接口使用：

- `tools`
- `tool_calls`

有的历史版本或其他厂商可能使用：

- `functions`
- `function_call`
- `input`
- `output`

#### 2. 参数格式不同

有的接口要求 `arguments` 是对象。

有的接口要求 `arguments` 是 JSON 字符串，例如：

```json
"arguments": "{\"city\":\"北京\"}"
```

#### 3. 消息结构不同

有的使用经典聊天格式：

- `messages = [{role, content}]`

有的则使用更通用的输入输出结构。

#### 4. 工具结果回传方式不同

有的要求作为 `tool` 消息发回。

有的要求放到特定的 `tool_outputs` 或响应项结构中。

所以你要记住：

> 工具调用这个思想是共通的，但具体 JSON 字段和消息格式往往因厂商和 API 版本不同而不同。

## 50. 为什么框架和 SDK 很重要

这也是为什么很多项目会使用 SDK 或框架。

因为它们会帮你屏蔽大量协议细节，例如：

- 工具定义怎么传
- 工具调用结果从哪里取
- 参数该怎么解析
- 工具结果该怎么回传

所以从学习角度看：

- 你要理解工具调用的底层原理
- 但工程实践中，往往会让 SDK 或框架帮你处理具体协议差异

## 51. 当前阶段要记住的 5 句话

- 模型不会自己执行工具，它只是提出工具调用请求
- 真正执行工具的是客户端、CLI、框架或服务端程序
- 不是任意 JSON 都会触发工具调用，必须符合协议字段和结构
- 客户端会先注册可用工具，模型只能在这些工具里选择
- 不同模型和不同厂商的工具调用格式通常有差异

## 52. 这一节和后续学习的关系

学会这一节之后，你后面再学下面这些内容会更容易：

- `ChatPromptTemplate`
- `Tool Calling`
- `LangChain Tools`
- Agent 执行循环
- `Codex CLI`、`Claude Code` 这类工具型 Agent 的工作原理

因为你已经知道：

- 工具不是模型自己执行的
- 工具调用依赖协议
- 大型 Agent 系统的关键在于“消息协议 + 工具注册 + 执行闭环”

## 53. 当前新增内容一句话总结

工具调用不是模型随便输出一段 JSON 就自动生效，而是客户端、服务端和模型通过一套明确协议共同完成的结构化交互过程。

## 54. 除了 tool 还有哪些 type

这里最容易混淆的一点是：`tool`、`function`、`text`、`image` 这些“类型”并不处在同一层。

更准确地说，模型交互里通常有 3 个不同层次：

- 消息角色层：回答“这条消息是谁说的”
- 工具定义层：回答“这是哪一类工具”
- 内容块层：回答“这段内容本身是什么形态”

所以不要把它们混为一谈。

## 55. 消息角色层：谁在说话

这一层解决的问题是：

> 当前这条消息是谁发出来的？

最常见的是：

- `system`
- `user`
- `assistant`
- `tool`

### `system`

表示系统级规则和全局设定。

例如：

- 你是一位面向初学者的老师
- 回答时尽量简洁
- 不要编造事实

它的作用是：给模型设定身份、边界和行为风格。

### `user`

表示用户输入，也就是用户真正提出的问题或任务。

例如：

- 请解释什么是 LangChain
- 北京天气怎么样
- 帮我总结这篇文章

### `assistant`

表示模型自己的回答。

它既可以是最终给用户的自然语言答案，也可以是中间过程中的说明，甚至可能包含工具调用意图。

所以你可以把它理解成：模型这一侧说出来的话。

### `tool`

表示工具执行结果。

这条消息不是用户说的，也不是模型自由生成的普通文本，而是某个工具被程序执行之后返回的结果。

例如：

- 天气工具返回天气数据
- 文件工具返回文件内容
- 搜索工具返回检索结果

## 56. 工具定义层：这是哪类工具

这一层解决的问题是：

> 本次注册给模型的工具，属于什么类别？

最常见的是：

- `function`

### `function`

`function` 表示这是一个函数型工具。

也就是说，模型可以请求系统去调用一个名字明确、参数结构明确的工具，例如：

- `get_weather(city="北京")`
- `read_file(path="a.txt")`
- `search_docs(query="LangChain")`

这里的 `function` 不是在强调某种编程语言语法，而是在协议层表示：

- 这个工具有名字
- 有描述
- 有参数 schema
- 可以被模型结构化调用

例如概念上可能会写成：

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "查询天气",
    "parameters": {
      "type": "object",
      "properties": {
        "city": { "type": "string" }
      }
    }
  }
}
```

这里的 `type = function` 是在说：这是一种函数调用型工具。

## 57. 内容块层：这段内容本身是什么

这一层解决的问题是：

> 这一段具体内容是什么形式？

在更现代的 API 里，一条消息不一定只有一段纯文本，里面可能会包含多种内容块。

常见可能包括：

- `text`
- `tool_call`
- `tool_result`
- `image`

### `text`

表示普通文本内容。

例如：

- LangChain 是一个 LLM 应用开发框架
- 请解释一下 PromptTemplate

这是最常见、最普通的一种内容类型。

### `tool_call`

表示这段内容是工具调用请求。

它的作用不是直接给用户展示，而是告诉系统：

- 我想调用哪个工具
- 参数是什么

例如概念上：

```json
{
  "type": "tool_call",
  "name": "get_weather",
  "arguments": {
    "city": "北京"
  }
}
```

### `tool_result`

表示工具执行后的结果。

例如概念上：

```json
{
  "type": "tool_result",
  "name": "get_weather",
  "content": {
    "city": "北京",
    "weather": "晴",
    "temp": "25C"
  }
}
```

它表示：工具已经执行完成，这是系统返回给模型继续使用的结果。

### `image`

表示内容块里包含图片，而不是纯文本。

在多模态场景中，消息内容可能会同时包含：

- 文本
- 图片
- 工具调用
- 工具结果

所以 `image` 回答的是：这块内容是图像类型。

## 58. 这三层到底有什么区别

你可以用下面这组问题来快速区分：

- `system / user / assistant / tool`：是谁在说话
- `function`：这是哪类工具
- `text / tool_call / tool_result / image`：这段内容是什么形态

也就是说：

- 角色层关心“身份”
- 工具定义层关心“工具类别”
- 内容块层关心“内容形态”

## 59. 最容易混淆的两个点

### `tool` 和 `tool_call` 不是一回事

- `tool_call` 表示模型正在请求调用工具
- `tool` 更常表示工具执行后的返回结果所属消息

一句话理解：

- `tool_call` 是“我要调用”
- `tool` / `tool_result` 是“我已经调用完了，这里是结果”

### `function` 和 `tool` 不是一回事

- `function` 是工具定义类别
- `tool` 是消息角色或工具结果语义

一句话理解：

- `function` 说明“工具属于哪种类型”
- `tool` 说明“这条消息来自工具结果”

## 60. 一个完整小例子

假设用户问：

> 北京天气怎么样？

### 第一步：用户消息

```json
{
  "role": "user",
  "content": "北京天气怎么样？"
}
```

这里的重点是：`role = user`，表示是用户在说话。

### 第二步：客户端注册工具

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "查询天气"
  }
}
```

这里的重点是：`type = function`，表示这是函数型工具定义。

### 第三步：模型发起工具调用

```json
{
  "type": "tool_call",
  "name": "get_weather",
  "arguments": {
    "city": "北京"
  }
}
```

这里的重点是：`type = tool_call`，表示模型想让系统执行工具。

### 第四步：工具返回结果

```json
{
  "role": "tool",
  "content": "{\"city\":\"北京\",\"weather\":\"晴\",\"temp\":\"25C\"}"
}
```

这里的重点是：`role = tool`，表示这条消息是工具执行后的结果。

### 第五步：模型继续回答

```json
{
  "role": "assistant",
  "content": "北京今天晴，25 度。"
}
```

这里的重点是：`role = assistant`，表示模型基于工具结果生成了最终答复。

## 61. 当前阶段一句话记忆法

你可以先这样记：

- `system / user / assistant / tool`：是谁在说话
- `function`：这是哪类工具
- `text / tool_call / tool_result / image`：这段内容是什么形态

只要你把这三层分清，后面学 `ChatPromptTemplate`、`Tool Calling`、Agent 协议时就不容易乱。

## 62. `system / user / assistant / tool` 在一次真实请求里是怎么串起来的

这个问题一旦理解清楚，你后面学习 `ChatPromptTemplate`、工具调用和 Agent 会顺很多。

最核心的一句话是：

> `system / user / assistant / tool` 描述的是在一次请求过程中，谁提供了哪一段信息，以及这些信息如何按顺序进入模型。

## 63. 最简单的情况：没有工具调用

如果一次请求不涉及工具，那么它通常很简单：

1. `system` 先给模型总规则
2. `user` 提出问题
3. `assistant` 基于前面的上下文生成回答

例如概念上可以写成：

```json
[
  {
    "role": "system",
    "content": "你是一位面向初学者的编程老师，请用简单语言回答。"
  },
  {
    "role": "user",
    "content": "请解释什么是 LangChain"
  },
  {
    "role": "assistant",
    "content": "LangChain 是一个帮助开发大模型应用的框架。"
  }
]
```

这时的链路就是：

```text
system -> user -> assistant
```

也就是说：

- `system` 负责定规则
- `user` 负责提问题
- `assistant` 负责给出答案

## 64. 更真实的情况：带工具调用

当模型需要实时信息或外部能力时，链路会多出中间步骤。

例如用户问：

> 北京今天天气怎么样？

模型自己不知道实时天气，所以需要借助工具。

完整链路通常会变成：

```text
system -> user -> assistant(tool_call) -> tool -> assistant(final answer)
```

## 65. 第一步：`system` 先设定规则

`system` 的作用是给模型设定身份、边界和行为方式。

例如：

```json
{
  "role": "system",
  "content": "你是一个天气助手。如果需要实时信息，请调用工具，不要猜测。"
}
```

这一步非常重要，因为它会影响模型：

- 是否应该调用工具
- 是否允许猜测
- 最终用什么风格回答

## 66. 第二步：`user` 提出问题

用户提出自己的任务。

例如：

```json
{
  "role": "user",
  "content": "北京今天天气怎么样？"
}
```

这一步很好理解，就是把用户请求送进模型上下文。

## 67. 第三步：`assistant` 发起工具调用

当模型判断自己需要工具时，它不会直接输出最终答案，而是先输出一个工具调用请求。

概念上可以理解成：

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "name": "get_weather",
      "arguments": {
        "city": "北京"
      }
    }
  ]
}
```

这里最重要的一点是：

> 发起工具调用的仍然是 `assistant`。

因为这一步本质上仍然是模型在表达：

- 我需要调用哪个工具
- 参数应该是什么

所以 `assistant` 不只是“给最终答案的人”，也可能是“发起工具调用的人”。

## 68. 第四步：外部程序执行工具，并返回 `tool`

模型本身不会真的执行工具。

真正执行 `get_weather` 的，是外部程序、框架、CLI 或后端服务。执行完成后，再把结果作为一条 `tool` 消息发回给模型。

例如：

```json
{
  "role": "tool",
  "content": "{\"city\":\"北京\",\"weather\":\"晴\",\"temp\":\"25C\"}"
}
```

这里表示：

- 这不是用户说的话
- 这不是模型自由生成的普通文本
- 这是工具执行后的真实结果

## 69. 第五步：`assistant` 基于工具结果继续回答

模型拿到 `tool` 消息之后，会继续生成最终返回给用户的自然语言答案。

例如：

```json
{
  "role": "assistant",
  "content": "北京今天晴，25 度，适合出行。"
}
```

这一步表示：

- 工具已经帮模型获得了事实数据
- 模型现在基于这些数据组织出更自然的回答

## 70. 整个顺序为什么必须这样设计

因为模型不会自己真正执行工具，所以必须拆成两个阶段：

### 阶段 1：模型做决策

`assistant` 表达：

- 要不要调用工具
- 调哪个工具
- 参数是什么

### 阶段 2：程序做执行

程序去执行工具后，再把结果作为 `tool` 消息发回。

然后模型再继续生成最终答案。

所以可以把它理解成：

- `assistant` 负责“我想做什么”
- `tool` 负责“我已经做完了，结果是什么”

## 71. 一个完整的 messages 序列示例

你可以把一次带工具的真实请求，看成这样一组顺序消息：

```json
[
  {
    "role": "system",
    "content": "你是一个天气助手。如果涉及实时信息，请调用工具。"
  },
  {
    "role": "user",
    "content": "北京今天天气怎么样？"
  },
  {
    "role": "assistant",
    "tool_calls": [
      {
        "name": "get_weather",
        "arguments": {
          "city": "北京"
        }
      }
    ]
  },
  {
    "role": "tool",
    "content": "{\"city\":\"北京\",\"weather\":\"晴\",\"temp\":\"25C\"}"
  },
  {
    "role": "assistant",
    "content": "北京今天晴，25 度。"
  }
]
```

这个序列很值得反复看，因为它说明了一件事：

> 模型不是一步做完所有事情，而是在对话流中不断接收新信息，再继续输出。

## 72. 没有工具和有工具时的区别

### 没有工具

```text
system -> user -> assistant
```

### 有工具

```text
system -> user -> assistant(tool_call) -> tool -> assistant
```

差别就在中间多出来这两步：

- `assistant` 发起工具调用
- `tool` 返回执行结果

## 73. 这对后续学习有什么意义

这件事对你后面学习这些内容很重要：

- `ChatPromptTemplate`
- `Tool Calling`
- `LangChain Tools`
- Agent 执行流程

因为一旦你理解了消息是怎么串起来的，你就会更容易明白：

- `PromptTemplate` 更偏单段文本模板
- `ChatPromptTemplate` 更偏多角色消息组织
- 工具调用本质上是在消息流里插入额外步骤

## 74. 当前阶段一句话总结

一次真实请求里，通常是 `system` 先定规则，`user` 提任务，`assistant` 决定回答或发起工具调用，`tool` 返回执行结果，最后 `assistant` 再生成最终答案。

## 75. ChatPromptTemplate 为什么天然适合组织这种多角色消息结构

这个问题的核心在于：`ChatPromptTemplate` 从设计上就不是为了拼接一整段长文本，而是为了组织一组按角色区分的消息。

一句话先记住：

> `PromptTemplate` 更像“单段文本模板”，`ChatPromptTemplate` 更像“消息列表模板”。

这就是它为什么天然适合 `system / user / assistant / tool` 这种结构。

## 76. PromptTemplate 和 ChatPromptTemplate 的根本区别

### `PromptTemplate`

它更接近这种思路：

```python
"你是一位老师，请解释 {topic}"
```

也就是说，它主要是在处理：

- 一整段字符串
- 变量插入
- 最终生成一个完整文本 prompt

它适合：

- 单轮任务
- 简单说明
- 单段输入

### `ChatPromptTemplate`

它更接近这种思路：

```python
[
  ("system", "你是一位老师"),
  ("user", "请解释 {topic}")
]
```

也就是说，它主要是在处理：

- 多条消息
- 每条消息都有角色
- 每条消息都可以模板化
- 最终生成聊天模型所需的消息列表

它更适合：

- 多角色上下文
- 聊天型模型
- 工具调用
- Agent 流程

## 77. 原因 1：它和聊天模型的输入结构天然一致

现代聊天模型的底层输入本来就通常是消息列表，例如：

```json
[
  {"role": "system", "content": "你是一位面向初学者的老师"},
  {"role": "user", "content": "请解释什么是 LangChain"}
]
```

而 `ChatPromptTemplate` 本质上就是在生成这种结构。

例如：

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位面向初学者的老师"),
    ("user", "请解释 {topic}")
])
```

这意味着：

- 它更贴近底层 API
- 它更符合聊天模型原生工作方式
- 它不需要把消息角色硬塞进一整段字符串里

## 78. 原因 2：它天然区分“谁在说话”

如果你用普通 `PromptTemplate`，你可能会写成：

```python
"""
系统要求：你是一位面向初学者的老师。
用户问题：请解释 LangChain。
"""
```

这种方式不是不能用，但本质上仍然只是一个大字符串。

也就是说：

- `system` 和 `user` 只是你在文本里模拟出来的标签
- 对模型来说，这仍然是一整段文本
- 后面一旦要接历史消息、工具结果，会越来越难维护

而 `ChatPromptTemplate` 是直接在结构层表达：

- 这一条是 `system`
- 这一条是 `user`
- 以后还可以有 `assistant` 或其他消息

所以角色边界天然更清晰。

## 79. 原因 3：它更适合多轮对话和历史消息

真实对话通常不是一轮就结束，可能会变成这样：

- `system`：你是一位老师
- `user`：请解释 LangChain
- `assistant`：LangChain 是...
- `user`：那它和 CrewAI 有什么区别？

这种情况下，如果全部用单段字符串维护，会越来越乱。

而 `ChatPromptTemplate` 本来就是为消息序列设计的，所以更适合表达：

- 历史提问
- 历史回答
- 当前问题
- 角色上下文

## 80. 原因 4：它更适合工具调用流程

你前面已经学过，一次带工具的真实请求通常像这样：

```text
system -> user -> assistant(tool_call) -> tool -> assistant
```

这说明真实交互中，输入不只是用户的一段话，还可能包含：

- 系统规则
- 用户输入
- 历史 assistant 消息
- 工具执行结果

这类结构更像“消息流”，而不是“一段静态文本”。

所以：

- `PromptTemplate` 更适合简单单段任务
- `ChatPromptTemplate` 更适合消息驱动的工具调用和 Agent 流程

## 81. 原因 5：它更适合 Agent 和复杂工作流

Agent 场景里，经常需要不断往上下文里追加新信息，例如：

- 当前任务
- 中间计划
- 工具返回值
- 下一步行动
- 历史状态

这些信息天然更适合按消息来组织，而不是塞进一个越来越长的大字符串。

所以你可以理解为：

> Agent 本质上更像“持续增长的消息流”，而 `ChatPromptTemplate` 天然适合组织这种消息流。

## 82. 原因 6：它更适合分层设计 Prompt

在真实项目里，prompt 往往不是一口气写成一个大块，而是分层设计的：

- 一层负责 `system`
- 一层负责用户输入模板
- 一层负责历史消息插槽
- 一层负责工具结果插槽

`ChatPromptTemplate` 非常适合这种分层方式，因为每一层都可以自然映射成一条或一组消息。

这比把所有内容都揉进一个长文本里更清楚，也更容易维护。

## 83. 一个最直观的对比例子

### 用 `PromptTemplate`

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("""
你是一位面向初学者的老师。
请回答下面的问题：
{question}
""")
```

这能工作，但它本质上只是单段文本。

### 用 `ChatPromptTemplate`

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位面向初学者的老师"),
    ("user", "{question}")
])
```

这里的结构明显更清楚：

- 老师身份放在 `system`
- 用户问题放在 `user`

它和真实聊天模型输入几乎是一一对应的。

## 84. 一个更真实的多角色例子

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位技术讲师，回答要清晰简洁。"),
    ("user", "请解释什么是 {topic}"),
    ("assistant", "好的，我会用初学者能理解的方式解释。"),
    ("user", "并补充一个简单例子")
])
```

这个例子能体现出它的优势：

- 不同角色分开表达
- 历史上下文更清楚
- 后续追加消息也更自然

## 85. 从学习角度应该怎么理解

你可以这样分工理解：

### `PromptTemplate`

适合先帮你理解：

- 什么是模板
- 什么是变量注入
- 什么是 prompt 复用

### `ChatPromptTemplate`

适合进一步帮你理解：

- 聊天模型如何接收消息
- `system / user / assistant` 如何协作
- 多轮对话如何组织
- 为什么它更适合工具调用和 Agent

所以 `ChatPromptTemplate` 不是要替代 `PromptTemplate`，而是更贴近聊天模型场景的升级表达方式。

## 86. 本质上一句话怎么记

真正的本质只有一句：

> 聊天模型、工具调用和 Agent 本来就是“消息序列问题”，而 `ChatPromptTemplate` 正是用消息序列来表达输入。

所以它不是“勉强可用”，而是“结构天然一致”。

## 87. 什么时候优先使用 ChatPromptTemplate

如果你的场景具备下面这些特征，就优先考虑 `ChatPromptTemplate`：

- 你使用的是聊天模型
- 你需要 `system` 角色
- 你要做多轮对话
- 你可能会接工具调用
- 你后续想扩展到 Agent

如果只是特别简单的单段说明任务，`PromptTemplate` 往往就够了。

## 88. 当前阶段一句话总结

`ChatPromptTemplate` 天然适合组织多角色消息结构，因为它直接按 `system / user / assistant / tool` 这种消息序列来建模，而真实聊天模型和工具调用流程本来就是这样工作的。

## 89. ChatPromptTemplate 是什么

`ChatPromptTemplate` 是 LangChain 中专门面向聊天模型的 prompt 模板组件。

它不是把所有输入拼成一段长文本，而是把输入组织成一组带角色的消息，例如：

- `system`
- `user`
- `assistant`

例如：

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位面向初学者的老师"),
    ("user", "请解释什么是 {topic}")
])
```

这里表示：

- 系统先设定角色
- 用户再提问
- `{topic}` 是动态变量

它最终生成的不是普通字符串，而是更接近聊天模型 API 所需的消息结构。

## 90. PromptTemplate 是什么

`PromptTemplate` 是 LangChain 中最基础的 prompt 模板，适合处理单段文本模板。

例如：

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template(
    "你是一位面向初学者的老师，请解释什么是 {topic}"
)
```

它最终产出的是一整段文本，例如：

```text
你是一位面向初学者的老师，请解释什么是 LangChain
```

所以它更像：

- 字符串模板
- 文本模板
- 单段 prompt 生成器

## 91. ChatPromptTemplate 和 PromptTemplate 的区别

最核心的区别是：

- `PromptTemplate` 处理的是一整段文本
- `ChatPromptTemplate` 处理的是一组带角色的消息

### `PromptTemplate`

- 产出的是一个字符串 prompt
- 更适合单轮任务和简单说明
- 更偏“文本思维”

### `ChatPromptTemplate`

- 产出的是一个消息列表 prompt
- 更适合聊天模型、多轮对话、工具调用和 Agent
- 更偏“对话思维”

你可以这样记：

> `PromptTemplate` 负责生成一段文本，`ChatPromptTemplate` 负责生成一组消息。

## 92. 一个最直观的对比例子

### PromptTemplate

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template(
    "你是一位老师，请解释 {topic}"
)
```

这里最终得到的是一段完整文本。

### ChatPromptTemplate

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位老师"),
    ("user", "请解释 {topic}")
])
```

这里最终得到的是结构化的消息列表。

## 93. 它们分别适合什么场景

### PromptTemplate 更适合

- 单轮任务
- 简单说明
- 快速试验
- 文本生成任务
- 不强调多角色结构的场景

### ChatPromptTemplate 更适合

- 聊天模型
- 需要 `system` 角色
- 多轮对话
- Tool Calling
- Agent
- 更贴近真实消息流的场景

## 94. 与之对应还有哪些相关类型

除了 `PromptTemplate` 和 `ChatPromptTemplate`，LangChain 里还有一些相关类型，可以看成它们的扩展或辅助组件。

### 第一类：基础模板类型

- `PromptTemplate`
- `ChatPromptTemplate`

这是你当前最需要掌握的两个核心模板。

### 第二类：单消息模板类型

这些可以理解为 `ChatPromptTemplate` 的组成零件：

- `SystemMessagePromptTemplate`
- `HumanMessagePromptTemplate`
- `AIMessagePromptTemplate`

它们分别用于单独生成某一种角色消息。

例如概念上：

```python
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("你是一位老师"),
    HumanMessagePromptTemplate.from_template("请解释 {topic}")
])
```

通常日常写法里，直接使用 `ChatPromptTemplate.from_messages()` 就够了，但知道这些类型有助于你以后做更细粒度控制。

### 第三类：消息占位类型

- `MessagesPlaceholder`

这个类型非常重要，它的作用是在 chat prompt 中预留一个位置，用来动态插入一组历史消息。

例如概念上：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位老师"),
    MessagesPlaceholder("history"),
    ("user", "{question}")
])
```

它特别适合：

- 多轮对话
- 聊天记忆
- Agent 中间上下文插入

### 第四类：Few-shot 模板类型

- `FewShotPromptTemplate`
- `FewShotChatMessagePromptTemplate`

它们的作用是先给模型几个示例，再让模型按示例风格继续完成任务。

区别是：

- `FewShotPromptTemplate` 偏单段文本场景
- `FewShotChatMessagePromptTemplate` 偏聊天消息场景

### 第五类：更组合式的模板

- `PipelinePromptTemplate`

这个更偏进阶，用于把多个 prompt 步骤组织成一个组合流程。当前阶段不需要优先学习，但可以先知道它的存在。

## 95. 当前阶段最值得掌握的几个类型

如果按学习优先级排序，建议你当前重点掌握下面 4 个：

1. `PromptTemplate`
2. `ChatPromptTemplate`
3. `MessagesPlaceholder`
4. `FewShotPromptTemplate` / `FewShotChatMessagePromptTemplate`

其中现在最重要的仍然是前两个。

## 96. 一句话总结

- `PromptTemplate`：生成一段文本
- `ChatPromptTemplate`：生成一组带角色的消息
- `ChatPromptTemplate` 更适合现代聊天模型、Tool Calling 和 Agent
- 与之对应还有 `MessagesPlaceholder`、单消息模板、Few-shot 模板等相关类型

## 97. SystemMessagePromptTemplate 详解

### 它是什么

`SystemMessagePromptTemplate` 用来生成一条 `system` 角色消息。

也就是说，它专门负责组织这类内容：

- 你是谁
- 你应该怎么回答
- 你遵守什么边界
- 你用什么风格输出

例如：

```python
from langchain_core.prompts import SystemMessagePromptTemplate

system_prompt = SystemMessagePromptTemplate.from_template(
    "你是一位{role}，请用{style}的方式回答。"
)
```

### 它解决什么问题

它解决的是：把 system 角色的提示词单独模板化。

这样做的好处是：

- 角色设定更清晰
- 系统规则更容易复用
- 不会和用户问题混在一起

### 适合什么场景

适合：

- 你想单独定义系统规则
- 你有多个不同的 system 模板
- 你想把角色设定组件化

### 一句话理解

`SystemMessagePromptTemplate` 就是“system 消息的模板器”。

## 98. HumanMessagePromptTemplate 详解

### 它是什么

`HumanMessagePromptTemplate` 用来生成一条 `human` / `user` 角色消息。

在 LangChain 语义里，`HumanMessage` 通常对应用户输入。

例如：

```python
from langchain_core.prompts import HumanMessagePromptTemplate

human_prompt = HumanMessagePromptTemplate.from_template(
    "请解释什么是{topic}"
)
```

### 它解决什么问题

它解决的是：把用户提问模板化。

当你的问题结构固定，但具体主题、对象、数量等变量会变化时，这种方式很有用。

### 适合什么场景

适合：

- 构建固定结构的问题模板
- 搭配 system prompt 一起使用
- 规范化用户输入格式

### 一句话理解

`HumanMessagePromptTemplate` 就是“user/human 消息的模板器”。

## 99. AIMessagePromptTemplate 详解

### 它是什么

`AIMessagePromptTemplate` 用来生成一条 `assistant` / `AI` 角色消息。

它不是主要用来提前替模型写最终答案，而是常用于构造：

- 历史 assistant 消息
- few-shot 示例中的 AI 回答
- 对话上下文中的已有模型回复

例如：

```python
from langchain_core.prompts import AIMessagePromptTemplate

ai_prompt = AIMessagePromptTemplate.from_template(
    "好的，我将从定义、作用和例子三个方面解释{topic}。"
)
```

### 它解决什么问题

它解决的是：把“已有 AI 回复”也作为模板化上下文的一部分来组织。

### 适合什么场景

适合：

- 多轮对话历史
- few-shot 示例对
- 模拟之前 assistant 已经说过的话

### 一句话理解

`AIMessagePromptTemplate` 就是“assistant 历史消息的模板器”。

## 100. MessagesPlaceholder 详解

### 它是什么

`MessagesPlaceholder` 是一个“消息插槽”。

它的作用是：在 `ChatPromptTemplate` 中预留一个位置，用来动态插入一整组消息。

例如：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位老师"),
    MessagesPlaceholder("history"),
    ("user", "{question}")
])
```

这里的 `history` 就是一个插槽名。

### 它解决什么问题

它解决的是：聊天历史不是固定写死的，而是运行时动态传入的。

如果没有它，你就得手动把历史消息一条条拼进去，维护成本很高。

### 为什么它很重要

因为真实系统里经常会遇到：

- 多轮历史
- 上下文记忆
- 之前的 user / assistant 消息
- 工具调用过程中的中间消息

这些都非常适合通过 `MessagesPlaceholder` 动态插入。

### 一句话理解

`MessagesPlaceholder` 不是一条消息，而是“多条消息的占位符”。

## 101. FewShotPromptTemplate 详解

### 它是什么

`FewShotPromptTemplate` 用于单段文本场景下的 few-shot prompt。

few-shot 的核心思想是：先给模型几个示例，再让模型照着做。

### 它解决什么问题

它解决的是：单靠一句指令不够稳定时，用示例来教模型输出格式或行为模式。

例如你想让模型学会：

- 把句子转成固定格式
- 做结构化信息提取
- 按指定风格输出

这时 few-shot 往往很有效。

### 典型结构

```python
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate

example_prompt = PromptTemplate.from_template(
    "问题: {input}\n答案: {output}"
)

examples = [
    {"input": "苹果", "output": "水果"},
    {"input": "胡萝卜", "output": "蔬菜"},
]

few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    suffix="问题: {input}\n答案:",
    input_variables=["input"],
)
```

### 一句话理解

`FewShotPromptTemplate` 就是“带示例的文本模板”。

## 102. FewShotChatMessagePromptTemplate 详解

### 它是什么

`FewShotChatMessagePromptTemplate` 是聊天消息版的 few-shot 模板。

它和 `FewShotPromptTemplate` 的区别在于：

- `FewShotPromptTemplate` 产出单段文本
- `FewShotChatMessagePromptTemplate` 产出聊天消息示例

### 它解决什么问题

它解决的是：当模型输入本身是 chat messages 时，示例也应该按消息结构表达，而不是揉成一个大文本块。

这更符合现代聊天模型的输入方式。

### 适合什么场景

适合：

- 聊天模型的 few-shot 学习
- 需要保留 `system / human / ai` 角色语义的示例
- 带角色结构的示例驱动任务

### 一句话理解

`FewShotChatMessagePromptTemplate` 就是“带示例的聊天消息模板”。

## 103. PipelinePromptTemplate 详解

### 它是什么

`PipelinePromptTemplate` 是一种更组合式的 prompt 模板。

它的作用是：把多个 prompt 片段或多个模板步骤组合起来，前一步的输出可以作为后一步的输入。

### 它解决什么问题

它解决的是：复杂 prompt 不是一口气写完，而是分步骤构造。

例如你可能想：

1. 先生成一个摘要片段
2. 再把这个摘要插入另一个 prompt
3. 最后形成总 prompt

### 适合什么场景

适合：

- 复杂 prompt 组装
- 多阶段模板拼接
- 大型系统中的 prompt 分层管理

### 当前阶段怎么对待它

当前阶段你不需要优先掌握它，先知道它的存在和用途就够了。

### 一句话理解

`PipelinePromptTemplate` 就是“把多个 prompt 步骤串起来的模板流水线”。

## 104. 这几个类型之间的关系

你可以把它们按层级理解成这样：

### 基础层

- `PromptTemplate`
- `ChatPromptTemplate`

### Chat 细粒度组件

- `SystemMessagePromptTemplate`
- `HumanMessagePromptTemplate`
- `AIMessagePromptTemplate`
- `MessagesPlaceholder`

### 示例增强层

- `FewShotPromptTemplate`
- `FewShotChatMessagePromptTemplate`

### 组合编排层

- `PipelinePromptTemplate`

## 105. 当前阶段学习优先级建议

如果按学习优先级排序，建议你现在这样推进：

### 第一优先级

- `PromptTemplate`
- `ChatPromptTemplate`

### 第二优先级

- `MessagesPlaceholder`

### 第三优先级

- `SystemMessagePromptTemplate`
- `HumanMessagePromptTemplate`
- `AIMessagePromptTemplate`

### 第四优先级

- `FewShotPromptTemplate`
- `FewShotChatMessagePromptTemplate`

### 第五优先级

- `PipelinePromptTemplate`

## 106. 每个类型一句话速记

- `SystemMessagePromptTemplate`：生成 system 消息
- `HumanMessagePromptTemplate`：生成 user/human 消息
- `AIMessagePromptTemplate`：生成 assistant 历史消息
- `MessagesPlaceholder`：动态插入一组历史消息
- `FewShotPromptTemplate`：带示例的文本模板
- `FewShotChatMessagePromptTemplate`：带示例的聊天消息模板
- `PipelinePromptTemplate`：把多个 prompt 步骤串成流水线

## 107. 当前阶段一句话总结

如果把 `PromptTemplate` 和 `ChatPromptTemplate` 看作主干，那么 `SystemMessagePromptTemplate`、`MessagesPlaceholder`、`FewShot...`、`PipelinePromptTemplate` 就是围绕这条主干向细粒度控制、示例增强和组合编排方向延伸出来的组件。

## 108. OutputParser 是什么

现在我们正式进入学习路线中的第 3 步：`OutputParser`。

最核心的一句话是：

> `OutputParser` 的作用，就是把模型输出变成程序真正想要的结果格式。

你前面已经学过：

- 怎么给模型输入
- 怎么用 `PromptTemplate` / `ChatPromptTemplate` 组织输入

接下来要解决的问题就是：

- 模型输出如何整理
- 如何让输出更稳定
- 如何把输出变成字符串、JSON 或结构化对象

这就是 `OutputParser` 存在的意义。

## 109. 为什么要学 OutputParser

模型默认返回的内容，并不总是程序最方便使用的格式。

有时候你想要的是：

- 普通字符串
- JSON
- 列表
- 结构化对象

但模型返回的往往可能是：

- 消息对象
- 一段自然语言文本
- 格式不稳定的内容

所以需要一个专门的组件，把输出进一步整理成后续程序更容易处理的形式。

## 110. 在 LangChain 链里它处于什么位置

最经典的最小链是：

```python
prompt | model | parser
```

分别表示：

- `prompt`：构造输入
- `model`：调用模型
- `parser`：处理输出

所以你现在可以形成一个非常重要的认识：

- `PromptTemplate` 负责“怎么问”
- `OutputParser` 负责“怎么接结果”

## 111. 为什么不用 parser 也能跑

确实，很多时候就算不加 parser，模型也一样能返回结果。

但是问题在于：

- 返回结果可能不是纯字符串
- 你后续代码处理不够方便
- 如果你想要 JSON 或结构化对象，就会更麻烦

所以 parser 的意义不是“让模型能回答”，而是：

> 让模型回答更容易被程序稳定使用。

## 112. 先学最基础的：StrOutputParser

你现在第一个要学的 parser 是：

- `StrOutputParser`

它的作用最简单也最适合入门：

> 把模型输出转成普通字符串。

## 113. 最小示例

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")
parser = StrOutputParser()

chain = prompt | model | parser

result = chain.invoke({"topic": "LangChain"})
print(result)
```

## 114. 这段代码里 parser 做了什么

这一句：

```python
parser = StrOutputParser()
```

表示模型输出之后，不直接把原始消息对象交给你，而是先帮你提取成普通字符串。

也就是说，最后的 `result` 更接近：

```python
"LangChain 是一个用于开发大模型应用的框架。"
```

而不是更复杂的消息对象。

## 115. 如果不用 StrOutputParser，会怎样

不加 parser 的时候，你通常仍然能拿到模型返回值，但这个值可能更偏向底层消息对象。

这意味着：

- 有 parser：直接拿到字符串
- 没 parser：你可能还需要自己取 `.content` 或自己再加工

对于初学者来说，先用 `StrOutputParser` 最容易建立完整链路认知。

## 116. 为什么它虽然简单却很重要

`StrOutputParser` 看起来简单，但它有一个非常重要的意义：

它让你第一次真正理解这条完整链路：

```python
prompt -> model -> parsed result
```

你前面已经学会了：

- `prompt` 怎么构造
- `model` 怎么调用

现在要补上的就是：

- `parser` 怎么把结果变成程序可用的数据

## 117. OutputParser 不只有字符串一种

`OutputParser` 不是只做字符串处理。

后面你还会遇到很多种 parser，例如：

- `StrOutputParser`
- `JsonOutputParser`
- `PydanticOutputParser`
- `StructuredOutputParser`

它们分别适合不同目标：

- 字符串输出
- JSON 输出
- 结构化对象输出
- 更强约束的结构化返回

但在当前阶段，你先把 `StrOutputParser` 学会最重要。

## 118. 一个生活化类比

你可以把模型想成一个很会回答问题的人。

- `prompt`：你怎么问他
- `model`：他开始回答
- `parser`：你把他的回答整理成你真正要保存和使用的格式

如果只是自己看，原话可能就够了。

如果你要把结果交给程序继续处理，就需要 parser 帮你整理。

## 119. OutputParser 解决的核心问题

它主要解决 3 件事：

- 统一输出格式
- 降低后续代码处理成本
- 为结构化输出做准备

所以一句话总结：

> `OutputParser` 解决的是“模型输出如何变成程序真正可用结果”的问题。

## 120. 从 LangChain 角度看它的意义

LangChain 的核心思想之一，就是把整个调用流程拆成不同职责模块。

所以：

- `PromptTemplate` 是输入模块
- `ChatOpenAI` 是模型模块
- `OutputParser` 是输出模块

这样每一层职责都更清楚，组合起来也更灵活。

## 121. 当前阶段先记住的 4 个点

你现在只需要先记住下面 4 个点：

- `OutputParser` 是用来处理模型输出的
- `StrOutputParser` 会把输出转成普通字符串
- parser 通常放在链的最后一段
- 最小链就是：`prompt | model | parser`

## 122. 当前阶段建议练习

你现在可以先跑下面这段代码：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")
parser = StrOutputParser()

chain = prompt | model | parser

print(chain.invoke({"topic": "OutputParser"}))
```

然后把 `topic` 分别改成：

- `LangChain`
- `PromptTemplate`
- `RAG`

观察你拿到的输出是否都是普通字符串。

## 123. 当前阶段一句话总结

`OutputParser` 是模型输出处理器，`StrOutputParser` 是最基础的一种，它把模型结果变成普通字符串，让 `prompt | model | parser` 这条最小链真正闭环。

## 124. 不加 parser 和加 StrOutputParser 的区别

这是学习 `OutputParser` 时最关键的第一组对比。

最核心的一句话是：

> 不加 parser 时，你拿到的是“模型原始输出对象”；加上 `StrOutputParser` 后，你拿到的是“普通字符串结果”。

## 125. 不加 parser 时会发生什么

如果你的链只有：

```python
prompt | model
```

那么模型虽然同样会返回结果，但这个结果通常不是最适合你直接继续处理的纯文本，而更像是一个消息对象。

概念上你可以理解为：

- 返回的是模型消息
- 里面包含 `content`
- 你后面通常还要自己再去取真正的文本内容

例如：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")

chain = prompt | model
result = chain.invoke({"topic": "LangChain"})

print(result)
print(type(result))
```

这时你拿到的 `result` 往往更接近一个 `AIMessage` 对象。

如果你真正想要文本，通常还需要：

```python
print(result.content)
```

## 126. 加上 StrOutputParser 时会发生什么

如果你的链变成：

```python
prompt | model | StrOutputParser()
```

那 parser 会在模型输出之后再帮你做一次整理，把结果直接转换成普通字符串。

例如：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")
parser = StrOutputParser()

chain = prompt | model | parser
result = chain.invoke({"topic": "LangChain"})

print(result)
print(type(result))
```

这时 `result` 往往就是一个普通字符串 `str`。

也就是说，你不用再额外写 `.content`。

## 127. 最核心的 3 个区别

### 1. 返回值类型不同

不加 parser：

- 返回的是模型原始消息对象
- 常见地更接近 `AIMessage`

加 `StrOutputParser`：

- 返回的是普通字符串
- 更方便后续代码直接使用

### 2. 后续处理复杂度不同

不加 parser：

- 你通常还要自己取 `.content`
- 后面继续传给其他代码时要多做一步处理

加 `StrOutputParser`：

- 直接拿到字符串
- 更容易打印、保存、传给下一个步骤

### 3. 链路是否完整不同

不加 parser：

- 你完成了“输入 -> 模型”
- 但还没有明确处理输出

加 `StrOutputParser`：

- 你完成了“输入 -> 模型 -> 输出整理”
- 更符合 LangChain 模块化思想

## 128. 为什么看起来都能跑，但还是建议加 parser

很多初学者会发现：

- 不加 parser 也能打印结果
- 好像区别不大

这是因为当前示例很简单。

但一旦你后面要做这些事情，差别就会变得明显：

- 把结果传给下一个链
- 存数据库
- 返回接口
- 做 JSON 解析
- 做结构化处理
- 做自动化流程

这时候，早点把输出规范化，会让代码更稳定也更容易维护。

## 129. 一个生活化类比

你可以把它理解成：

### 不加 parser

模型把结果连同“包装盒”一起交给你。

你还要自己拆开包装，才能拿到真正想用的内容。

### 加 `StrOutputParser`

parser 已经帮你把包装拆好了，直接把里面的文本内容交给你。

所以：

- 不加 parser = 原始交付
- 加 parser = 整理后交付

## 130. 为什么 LangChain 特别强调 parser

LangChain 不只是想让你“拿到一个回答”，它更想把整个过程拆清楚：

- 输入怎么构造
- 模型怎么调用
- 输出怎么处理

所以 parser 的存在，本质上是在提醒你：

> 模型输出不是流程终点，输出处理本身也是一个独立步骤。

## 131. 当前阶段最该记住的区别

### 不加 parser

- 你拿到的是模型原始消息对象
- 通常还要自己 `.content`

### 加 `StrOutputParser`

- 你拿到的是普通字符串
- 更适合后续程序直接使用

## 132. 当前阶段一句话总结

不加 parser，你拿到的是“模型返回的原始消息对象”；加上 `StrOutputParser`，你拿到的是“已经提取好的纯字符串结果”，链路也从“能跑”升级成了“更规范、更容易扩展”。

## 133. 为什么字符串还不够

学完 `StrOutputParser` 之后，下一个自然问题就是：

> 如果已经能拿到字符串了，为什么还需要更复杂的 parser？

答案是：因为真实项目里，很多时候你想要的不是“看得懂的一段话”，而是“程序可以稳定继续处理的数据结构”。

例如你可能希望模型返回：

- 标题
- 摘要
- 关键词列表
- 风险等级
- 是否需要继续调用下一步流程

如果这些内容只是混在一段自然语言里，虽然人能看懂，但程序后面很难稳定提取和使用。

所以这时字符串就不够了，你会开始需要结构化输出。

## 134. 什么叫结构化输出

结构化输出，指的是让模型返回更适合程序处理的固定结构，而不是随意的一段自然语言。

最常见的结构化形式就是 JSON。

例如，与其让模型返回：

```text
这个主题的标题是 LangChain，摘要是它是一个 LLM 应用开发框架，关键词包括 prompt、rag、agent。
```

不如让模型返回：

```json
{
  "title": "LangChain",
  "summary": "它是一个 LLM 应用开发框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

这样后续程序就可以非常方便地：

- 读取字段
- 保存数据库
- 传给前端
- 交给下一步处理链

## 135. JsonOutputParser 是什么

`JsonOutputParser` 是 LangChain 中用于把模型输出解析成 JSON 结构的 parser。

你可以把它理解成：

> 它帮助你把模型的回答，从“普通文本”提升成“程序更容易处理的 JSON 数据”。

这类 parser 特别适合：

- 信息提取
- 分类任务
- 结构化摘要
- 自动化流程
- 接口返回值组织

## 136. 它和 StrOutputParser 的区别

### `StrOutputParser`

- 目标是得到普通字符串
- 适合人类阅读
- 适合最简单的链路入门

### `JsonOutputParser`

- 目标是得到 JSON 结构
- 更适合程序继续处理
- 更适合固定字段输出场景

一句话理解：

- `StrOutputParser` 解决“把输出拿成文本”
- `JsonOutputParser` 解决“把输出拿成结构化数据”

## 137. 一个最小思路示例

你可以先理解思路，不急着背所有细节。

例如我们希望模型返回：

- `title`
- `summary`
- `keywords`

概念上代码会像这样：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
parser = JsonOutputParser()

prompt = ChatPromptTemplate.from_template(
    "请分析主题 {topic}，并返回包含 title、summary、keywords 的 JSON。"
)

chain = prompt | model | parser
result = chain.invoke({"topic": "LangChain"})

print(result)
```

如果成功，`result` 更接近 Python 中可处理的字典结构，而不是一大段文本。

## 138. 为什么仅靠“请输出 JSON”还不够

这也是一个很关键的问题。

你可能会想：

- 直接在 prompt 里写“请输出 JSON”不就行了吗？

理论上可以，但工程上不够稳定。

因为模型可能会：

- 在 JSON 前后多说解释文字
- 少字段
- 字段名不一致
- 数组格式不稳定
- 输出伪 JSON

所以仅靠一句“请输出 JSON”，通常不足以支撑可靠程序流程。

这也是 parser 重要的原因之一：

- 它帮助你把目标格式明确化
- 它让输出处理更加工程化
- 它为后面的结构化约束打基础

## 139. JsonOutputParser 适合什么场景

当你遇到下面这些需求时，就应该开始考虑 `JsonOutputParser`：

- 你要从文本中提取多个字段
- 你希望输出字段名固定
- 你要把结果交给程序下一步处理
- 你不想再手写字符串解析逻辑
- 你希望模型输出更接近数据而不是散文

例如：

- 提取文章标题、摘要、关键词
- 识别工单类型、优先级、负责人建议
- 输出问题分类结果和原因
- 生成结构化的页面配置或任务清单

## 140. 当前阶段你该怎么学它

你现在不用一下子把所有结构化 parser 都学完。

最好的顺序是：

1. 先吃透 `StrOutputParser`
2. 再理解为什么字符串不够
3. 再进入 `JsonOutputParser`
4. 后面再学更强约束的 `PydanticOutputParser`

也就是说，你现在并不是离开 `StrOutputParser`，而是在它的基础上继续升级认知。

## 141. 你现在最该记住的 4 个点

- `StrOutputParser` 让你拿到字符串
- `JsonOutputParser` 让你拿到结构化 JSON
- 真实项目里很多任务更适合结构化输出
- 只靠一句“请输出 JSON”通常不够稳定

## 142. 当前阶段一句话总结

当你发现“模型回答虽然能看懂，但程序不好继续处理”时，就说明你应该从 `StrOutputParser` 进入 `JsonOutputParser` 了。

## 143. 模型的结构化输出到底是谁在做

这是学习 `JsonOutputParser` 时非常关键的一个问题。

最准确的答案不是二选一，而是：

> 有时主要靠模型按要求输出结构化内容，有时会再由 parser 或其他工具做解析处理，很多真实系统里往往是两者配合，甚至再加上协议约束共同完成。

也就是说，结构化输出通常不是单独某一方完成的，而是一个组合过程。

## 144. 第一种情况：模型自己按要求结构化输出

这是最直观的一种方式。

你在 prompt 里告诉模型：

- 请返回 JSON
- 包含哪些字段
- 不要输出额外解释

模型就会尽量按这个格式输出。

例如你要求：

```text
请分析 LangChain，并只返回 JSON：
{
  "title": "...",
  "summary": "...",
  "keywords": ["..."]
}
```

模型可能返回：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

这里本质上发生的是：JSON 本身就是模型生成出来的文本内容。

也就是说，这种情况下主要是模型在按照你的要求进行结构化输出。

## 145. 这种方式的问题是什么

虽然这种方式最直观，但它不一定稳定。

模型可能会：

- 在 JSON 前后多说一句解释
- 少字段
- 字段名写错
- 输出格式不合法
- 输出看起来像 JSON，但实际上解析会失败

所以如果只是依赖“请输出 JSON”这类自然语言要求，结构化输出常常还不够工程化、不够稳定。

## 146. 第二种情况：模型先输出，再由 parser 解析

这就是 `JsonOutputParser` 这类组件常见的工作方式。

例如模型先输出一段 JSON 风格文本：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

然后 parser 再去做这些事情：

- 读取模型输出文本
- 尝试解析 JSON
- 转成 Python 字典或其他程序对象
- 交给后续代码继续使用

这里要特别注意：

> parser 通常不是替模型“重新思考一遍并生成结构”，而是在解析和转换模型已经尽量结构化好的输出。

## 147. JsonOutputParser 更像什么

你可以把 `JsonOutputParser` 理解成：

- 结构读取器
- 结构解析器
- 文本到对象的转换器

而不是“结构生成器”。

也就是说：

- 结构本身主要还是模型生成的
- parser 负责把它转成程序能直接处理的对象

如果模型根本没有按结构输出，parser 通常也无法凭空替你把散文自动变成标准 JSON。

## 148. 第三种情况：模型 + 协议约束 + parser 共同完成

这是更真实、更工程化的一种情况。

现代一些模型 API 或平台支持：

- 原生 structured outputs
- JSON schema
- response_format
- tool/function calling

这时就不只是“prompt 里要求输出 JSON”了，而是：

- 协议层明确告诉模型应该返回什么结构
- 模型在这个约束下生成结果
- parser 再负责接收、解析和转对象

这种方式通常更稳定，因为结构约束不再只是靠 prompt 文字说明，而是进入了 API 或协议层。

## 149. 所以到底是谁在结构化

你可以这样区分：

### 情况 A：只靠 prompt 要求 JSON

主要是：

- 模型自己按要求生成结构化文本
- parser 只是后续解析

### 情况 B：prompt + JsonOutputParser

主要是：

- 模型先按要求输出
- parser 再把文本解析成字典/对象

### 情况 C：原生 structured outputs / schema / tool calling

主要是：

- 模型负责生成内容
- 协议或服务端负责约束结构
- parser 负责接收、校验、转对象

所以最准确的说法是：

> 结构化输出通常是“模型生成 + parser 处理 + 可选协议约束”共同完成的。

## 150. 为什么很多人会误解 JsonOutputParser

很多初学者会误以为：

> `JsonOutputParser` 很智能，它能把模型的任意回答都自动整理成 JSON。

其实不是。

如果模型输出的是：

```text
LangChain 是一个 LLM 框架，关键词有 prompt、rag、agent。
```

普通的 `JsonOutputParser` 并不会自动把它理解成：

```json
{
  "title": "LangChain",
  "keywords": ["prompt", "rag", "agent"]
}
```

除非你额外设计了：

- 更强的抽取逻辑
- 再调用一次模型做二次结构化
- 或使用更强的原生 schema 约束能力

所以 parser 更像是在“接住已经尽量结构化的输出”，而不是替模型重新组织知识。

## 151. 一个很实用的类比

你可以把这件事想成填表。

### 方式 1：只口头要求

你对模型说：

- 请按这个表格填写

模型自己尽量照做。

这对应：prompt 要求结构化输出。

### 方式 2：填完后再录入系统

模型先把表写出来，然后 parser 再把这份表录入成程序对象。

这对应：模型输出 + parser 转结构。

### 方式 3：系统本身强制按表单录入

系统直接规定只能按 schema 提交，模型必须按结构输出。

这对应：原生 structured output / schema 约束。

## 152. 当前阶段最该记住的 4 个点

- 只靠 prompt 时，主要是模型自己按要求结构化输出
- `JsonOutputParser` 主要负责解析和转换，不是替模型重新思考
- `JsonOutputParser` 更像“把 JSON 文本变成程序对象”
- 最稳的结构化输出通常依赖模型、协议约束和 parser 三者配合

## 153. 当前阶段一句话总结

结构化输出通常不是“模型单独完成”或“parser 单独完成”，而是模型先尽量按要求生成结构，parser 再负责解析处理，更高级的系统还会通过 schema 或协议进一步约束输出。

## 154. JsonOutputParser 最小实操

现在我们正式进入 `JsonOutputParser` 的最小实操。

这一节的目标很明确：

- 不再只拿一段字符串
- 开始让模型输出固定字段
- 再把这些字段解析成程序能直接处理的结果

你可以先记住一句话：

> `StrOutputParser` 让你拿到字符串，`JsonOutputParser` 让你拿到结构化数据。

## 155. 最小示例代码

下面先看一个最小示例：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

model = ChatOpenAI(model="gpt-4o-mini")
parser = JsonOutputParser()

prompt = ChatPromptTemplate.from_template(
    "请分析主题 {topic}，并只返回 JSON，包含字段：title、summary、keywords。"
)

chain = prompt | model | parser
result = chain.invoke({"topic": "LangChain"})

print(result)
print(type(result))
```

## 156. 这段代码的目标是什么

这段代码的目标不是让模型返回一段散文说明，而是让它返回一个结构化结果，例如概念上像这样：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

如果链路工作正常，那么 `result` 在 Python 里更接近字典对象，而不是普通字符串。

## 157. 逐行理解这个最小示例

### `JsonOutputParser()`

这一句表示：

- 你期望最终输出是 JSON 结构
- parser 会尝试把模型返回内容解析成程序对象

### prompt 中的“只返回 JSON”

这一句很重要，因为 parser 不是凭空创造 JSON。

它依然需要模型尽量按结构输出。

所以 prompt 里要明确告诉模型：

- 返回 JSON
- 有哪些字段
- 不要额外解释

### `chain = prompt | model | parser`

这里就是完整结构化链路：

- prompt 负责定义输出要求
- model 负责生成内容
- parser 负责把内容解析成结构化对象

## 158. 运行后你应该观察什么

你第一次跑这段代码时，不要只看有没有结果，更要看下面两件事：

### 1. `print(result)`

你要观察它是不是类似：

```python
{
    'title': 'LangChain',
    'summary': '一个用于开发 LLM 应用的框架',
    'keywords': ['prompt', 'rag', 'agent']
}
```

### 2. `print(type(result))`

你要观察它是不是更接近程序可处理的数据结构，而不是单纯字符串。

这一步非常关键，因为这正是 `JsonOutputParser` 和 `StrOutputParser` 的区别所在。

## 159. 第一个练习：替换 topic

先不要增加复杂度，只改输入：

- `LangChain`
- `PromptTemplate`
- `RAG`
- `CrewAI`

观察模型是否都能返回同样字段结构：

- `title`
- `summary`
- `keywords`

如果字段结构比较稳定，说明你已经开始进入真正的结构化输出阶段了。

## 160. 第二个练习：增加一个字段

把 prompt 改成要求返回 4 个字段，例如：

- `title`
- `summary`
- `keywords`
- `difficulty`

例如：

```python
prompt = ChatPromptTemplate.from_template(
    "请分析主题 {topic}，并只返回 JSON，包含字段：title、summary、keywords、difficulty。"
)
```

这一步的目的是让你观察：

- 模型是否会按字段扩展输出
- parser 是否还能正确接住结构

## 161. 第三个练习：故意观察不稳定性

这一练习非常重要。

你可以尝试把 prompt 改得更模糊，例如：

```python
prompt = ChatPromptTemplate.from_template(
    "请介绍一下 {topic}，顺便给一个 JSON。"
)
```

然后观察会发生什么。

你很可能会发现：

- 模型开始输出解释性文字
- JSON 前后多了说明
- 结构不再稳定

这会帮助你真正理解：

> 结构化输出不仅依赖 parser，也非常依赖 prompt 的明确程度。

## 162. JsonOutputParser 的关键认知

学习到这里，你要开始形成下面这个认知：

- parser 不是魔法
- parser 不是替模型重新思考
- parser 的前提是模型已经尽量按结构输出

所以 `JsonOutputParser` 的真正作用更接近：

- 解析 JSON 风格输出
- 转成 Python 可处理对象
- 让后续程序更稳定地继续工作

## 163. 它最适合哪些任务

`JsonOutputParser` 特别适合下面这些任务：

- 从文本中提取固定字段
- 生成摘要 + 关键词
- 做分类并返回分类结果
- 输出任务清单
- 输出页面配置或结构化配置项

也就是说，当你开始希望模型返回“数据”，而不仅仅是“话”，就可以考虑它。

## 164. 你现在最该记住的 4 个点

- `JsonOutputParser` 的目标是拿到结构化结果
- prompt 仍然要明确要求模型输出 JSON
- parser 负责解析和转换，不是替模型重新组织内容
- 结构越明确，parser 越容易稳定工作

## 165. 当前阶段一句话总结

`JsonOutputParser` 的最小实操本质上是在训练你完成这件事：先明确要求模型按 JSON 输出，再让 parser 把结果接成程序可直接处理的结构化对象。

## 166. JsonOutputParser 和 PydanticOutputParser 的区别

现在进入结构化输出里非常关键的下一步：

- `JsonOutputParser`
- `PydanticOutputParser`

它们都和“结构化输出”有关，但关注点并不一样。

一句话先记住：

> `JsonOutputParser` 更像“把结果解析成 JSON 数据”，`PydanticOutputParser` 更像“把结果解析成符合明确数据模型的对象”。

## 167. 先说共同点

这两个 parser 的共同点是：

- 都不是只拿普通字符串
- 都希望模型输出结构化内容
- 都适合把模型结果交给程序继续处理
- 都比 `StrOutputParser` 更偏工程化

也就是说，它们都属于“结构化输出”这一层，只是约束强度不同。

## 168. JsonOutputParser 更像什么

`JsonOutputParser` 更像：

- JSON 解析器
- 结构读取器
- 文本到字典的转换器

它的目标通常是：

- 让模型返回 JSON
- parser 把这个 JSON 解析成 Python 可处理结构

所以它更适合：

- 你已经知道要哪些字段
- 但对字段的类型和校验要求还没有特别严格
- 你先想快速把输出结构化

例如你只想拿到：

- `title`
- `summary`
- `keywords`

这时 `JsonOutputParser` 往往已经够用。

## 169. PydanticOutputParser 更像什么

`PydanticOutputParser` 更像：

- 带数据模型约束的解析器
- 面向对象的结构化解析器
- “先定义 schema，再要求模型按 schema 输出”的方式

它的关键特点是：

- 你要先定义一个 `Pydantic` 模型
- 再让 parser 按这个模型解析输出
- 最后拿到的不是普通字典，而是更明确的数据对象

也就是说，它不仅关心“是不是 JSON”，还更关心：

- 字段名是否正确
- 字段类型是否正确
- 必填字段是否存在
- 整体结构是否符合模型定义

## 170. 一个最直观的对比

### JsonOutputParser 的思路

你告诉模型：

- 请返回 JSON
- 包含字段 `title`、`summary`、`keywords`

如果模型返回了一个看起来正确的 JSON，parser 就会尽量把它解析成 Python 字典。

你拿到的结果更接近：

```python
{
    "title": "LangChain",
    "summary": "一个用于开发 LLM 应用的框架",
    "keywords": ["prompt", "rag", "agent"]
}
```

### PydanticOutputParser 的思路

你先定义一个数据模型，例如：

```python
from pydantic import BaseModel
from typing import List

class TopicInfo(BaseModel):
    title: str
    summary: str
    keywords: List[str]
```

然后再让 parser 按这个模型去接收输出。

你最后拿到的结果更接近：

```python
TopicInfo(
    title="LangChain",
    summary="一个用于开发 LLM 应用的框架",
    keywords=["prompt", "rag", "agent"]
)
```

## 171. 它们最大的区别到底是什么

最核心可以归纳成 4 点：

### 1. 返回结果不同

`JsonOutputParser`：

- 更常拿到字典、列表这类 JSON 风格结果

`PydanticOutputParser`：

- 更常拿到符合某个数据模型的对象

### 2. 约束强度不同

`JsonOutputParser`：

- 主要关心“能不能解析成 JSON”

`PydanticOutputParser`：

- 更关心“是否符合我定义的字段和类型约束”

### 3. 工程严谨度不同

`JsonOutputParser`：

- 更轻量
- 更适合快速开始

`PydanticOutputParser`：

- 更严格
- 更适合稳定项目和明确 schema 的任务

### 4. 学习门槛不同

`JsonOutputParser`：

- 更容易上手
- 只要先理解 JSON 就行

`PydanticOutputParser`：

- 除了理解 parser，还要理解 `Pydantic` 数据模型
- 更适合在你已经熟悉基础结构化输出之后再学

## 172. JsonOutputParser 的优点和局限

### 优点

- 上手快
- 写法简单
- 对初学者友好
- 很适合快速做结构化提取

### 局限

- 结构约束不够强
- 字段类型问题不一定第一时间暴露得很清楚
- 后续如果项目越来越复杂，字典式结果会变得难管理

## 173. PydanticOutputParser 的优点和局限

### 优点

- 结构定义明确
- 字段和类型约束更清楚
- 更适合大型项目和长期维护
- 更适合需要稳定 schema 的流程

### 局限

- 需要先理解 `Pydantic`
- 学习成本更高一点
- 写法会比纯 JSON parser 更重一些

## 174. 当前阶段该先学哪一个

按你现在的学习顺序，建议这样推进：

1. 先学 `StrOutputParser`
2. 再学 `JsonOutputParser`
3. 最后再进入 `PydanticOutputParser`

原因很简单：

- `StrOutputParser` 帮你理解“输出处理”
- `JsonOutputParser` 帮你理解“结构化输出”
- `PydanticOutputParser` 帮你理解“带模型约束的结构化输出”

这个顺序最自然，也最不容易乱。

## 175. 什么时候用 JsonOutputParser

当你遇到下面这些场景时，优先考虑 `JsonOutputParser`：

- 你想快速拿到结构化字段
- 你希望结果是字典/列表
- 你在做信息提取、摘要、分类
- 你还不想引入更重的数据模型约束

## 176. 什么时候用 PydanticOutputParser

当你遇到下面这些场景时，更适合考虑 `PydanticOutputParser`：

- 你对字段名、字段类型要求很明确
- 你需要稳定的数据 schema
- 你希望后续代码围绕对象来写，而不是围绕字典来写
- 你要把模型输出真正接进一个工程系统里

## 177. 一个非常实用的判断标准

你以后可以这样判断：

- 如果你心里想的是“先把结果变成 JSON 再说”
  - 优先考虑 `JsonOutputParser`

- 如果你心里想的是“我已经知道这个结果应该长成一个明确的数据模型”
  - 优先考虑 `PydanticOutputParser`

## 178. 当前阶段最该记住的 5 个点

- `JsonOutputParser` 更偏 JSON 结构解析
- `PydanticOutputParser` 更偏数据模型约束
- 前者更轻量，后者更严格
- 前者更适合入门结构化输出，后者更适合工程化落地
- 你的学习顺序应该是：`StrOutputParser -> JsonOutputParser -> PydanticOutputParser`

## 179. 当前阶段一句话总结

如果说 `JsonOutputParser` 是“把模型结果变成结构化字典”，那么 `PydanticOutputParser` 更像是“把模型结果变成符合明确 schema 的对象”，它比 JSON 解析更进一步。

## 180. PydanticOutputParser 是什么

现在我们正式进入 `PydanticOutputParser`。

最核心的一句话是：

> `PydanticOutputParser` 的作用，是把模型输出解析成一个符合明确数据模型定义的对象，而不仅仅是一个普通字典。

这里的关键不只是“结构化”，而是“结构化 + 明确 schema + 字段类型约束”。

## 181. 为什么 JsonOutputParser 还不够

`JsonOutputParser` 已经能把模型输出变成 JSON 风格结果，这很好。

但如果你的项目继续往前走，很快会遇到这些问题：

- 字段名拼错怎么办
- 某个字段本来应该是列表，却返回成了字符串怎么办
- 某个字段缺失怎么办
- 后续代码到底该按什么格式取值
- 团队里不同人如何共享同一套数据结构定义

这时你会发现：

- 只有 JSON 还不够
- 你还需要一套更明确的数据模型约束

这就是 `PydanticOutputParser` 出场的原因。

## 182. 什么是 Pydantic 模型

在理解 `PydanticOutputParser` 前，你要先知道 `Pydantic` 是什么。

你可以先把它简单理解成：

> 一种用 Python 类来定义数据结构、字段类型和校验规则的方式。

例如：

```python
from pydantic import BaseModel
from typing import List

class TopicInfo(BaseModel):
    title: str
    summary: str
    keywords: List[str]
```

这个模型在表达：

- `title` 必须是字符串
- `summary` 必须是字符串
- `keywords` 必须是字符串列表

也就是说，你已经提前把“结果应该长什么样”定义清楚了。

## 183. PydanticOutputParser 的最小思路

当你有了一个 `Pydantic` 模型之后，`PydanticOutputParser` 就负责：

- 告诉模型你要按这个结构输出
- 尝试把模型返回内容解析成这个模型对象
- 让你拿到一个更明确的结果对象，而不是普通字典

最小思路代码大致像这样：

```python
from typing import List
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

class TopicInfo(BaseModel):
    title: str
    summary: str
    keywords: List[str]

model = ChatOpenAI(model="gpt-4o-mini")
parser = PydanticOutputParser(pydantic_object=TopicInfo)

prompt = ChatPromptTemplate.from_template(
    "请分析主题 {topic}，并按要求输出结构化结果。\n{format_instructions}"
)

chain = prompt | model | parser
result = chain.invoke({
    "topic": "LangChain",
    "format_instructions": parser.get_format_instructions(),
})

print(result)
print(type(result))
```

## 184. 这里最重要的变化是什么

和 `JsonOutputParser` 相比，这里最重要的变化有 3 个：

### 1. 你先定义了一个明确的数据模型

```python
class TopicInfo(BaseModel):
    title: str
    summary: str
    keywords: List[str]
```

这一步等于告诉程序和模型：

- 结果必须包含哪些字段
- 每个字段应该是什么类型

### 2. parser 不再只是面向 JSON，而是面向模型对象

```python
parser = PydanticOutputParser(pydantic_object=TopicInfo)
```

这意味着你不是只想拿一个字典，而是想拿一个符合 `TopicInfo` 结构的对象。

### 3. prompt 往往会加入格式说明

```python
parser.get_format_instructions()
```

这一点很关键，因为它能帮助模型更明确地知道：

- 你到底要什么结构
- 字段长什么样
- 输出应该遵守什么格式

## 185. 运行后你拿到的是什么

如果链路工作正常，最后的 `result` 会更接近：

```python
TopicInfo(
    title="LangChain",
    summary="一个用于开发 LLM 应用的框架",
    keywords=["prompt", "rag", "agent"]
)
```

这和 `JsonOutputParser` 最大的区别在于：

- `JsonOutputParser` 更像拿到一个字典
- `PydanticOutputParser` 更像拿到一个结构明确的对象

## 186. 为什么这种方式更严格

因为这里不是“看起来像 JSON 就行”，而是要尽量满足模型定义。

例如：

- `keywords` 应该是 `List[str]`
- 如果模型返回成了一个普通字符串，结构就可能不符合预期
- 某些字段缺失，也可能导致结果不符合模型要求

所以 `PydanticOutputParser` 比 `JsonOutputParser` 更严格，也更适合真正工程化落地。

## 187. 为什么它更适合工程系统

在真实项目里，你经常希望模型输出能直接接到：

- 后端逻辑
- 数据库存储
- 前端接口
- 工作流下一步
- 自动化决策流程

如果只是字典，虽然也能用，但后续代码会越来越依赖“约定俗成”。

如果是明确的模型对象，很多事情会更清楚：

- 字段更稳定
- 类型更清楚
- 团队协作更容易统一
- 长期维护更轻松

## 188. 它最适合什么场景

`PydanticOutputParser` 特别适合：

- 你已经知道输出 schema
- 你对字段类型有明确要求
- 你要做更稳定的工程化数据流
- 你希望模型输出能直接进入系统对象层

例如：

- 任务拆解结果对象
- 工单分类对象
- 页面配置对象
- 结构化摘要对象
- 风险评估对象

## 189. 初学时最容易误解的点

一个常见误解是：

> 只要用了 `PydanticOutputParser`，模型就一定会完美按 schema 输出。

其实不是。

更准确地说：

- `PydanticOutputParser` 会让结构目标更明确
- 也会让解析标准更严格
- 但模型本身是否稳定遵守，仍然受 prompt、模型能力和上下文影响

所以它不是“万能纠错器”，而是“更严格的结构化解析器”。

## 190. 它和 JsonOutputParser 的最实用区别

你可以这样简单区分：

### 如果你想说

- 先给我一个 JSON 字典就行

那更适合：

- `JsonOutputParser`

### 如果你想说

- 我已经知道这个结果应该长成一个明确对象
- 字段和类型最好严格一点

那更适合：

- `PydanticOutputParser`

## 191. 当前阶段学习建议

按你当前的学习顺序，建议这样推进：

1. 先真正理解 `JsonOutputParser`
2. 再理解 `Pydantic` 模型是什么
3. 再学 `PydanticOutputParser`
4. 最后再看更复杂的结构化输出工程方案

也就是说，现在你学习 `PydanticOutputParser` 的重点不是死记 API，而是建立这个认知：

> 结构化输出可以从“字典级别”继续升级到“数据模型级别”。

## 192. 当前阶段最该记住的 5 个点

- `PydanticOutputParser` 依赖你先定义一个数据模型
- 它最终拿到的更像对象，而不仅仅是字典
- 它比 `JsonOutputParser` 更严格
- 它更适合工程化和稳定 schema 的任务
- 它不是万能纠错器，而是更强约束的结构化解析器

## 193. 当前阶段一句话总结

`PydanticOutputParser` 可以看成是 `JsonOutputParser` 的进一步升级：不只要求“能解析成 JSON”，而是进一步要求“结果符合一个明确的数据模型”。

## 194. 再把 JsonOutputParser 吃透一点

在进入 `PydanticOutputParser` 的实操之前，先把 `JsonOutputParser` 再吃透一点是非常有必要的。

因为很多初学者会误以为：

- 只要用了 `JsonOutputParser`，结构化输出就稳了
- 只要 prompt 里写“请输出 JSON”，程序就一定能稳定拿到 JSON

其实不是。

更准确地说：

> `JsonOutputParser` 的作用，是把模型已经尽量结构化好的输出，解析成程序可处理的数据结构；它不是替模型重新组织内容的魔法工具。

## 195. JsonOutputParser 的本质到底是什么

一句话理解：

> `JsonOutputParser` 的本质，是把模型输出的 JSON 风格内容，解析成程序可直接使用的 Python 结构。

通常更接近：

- `dict`
- `list`
- 嵌套字典列表

所以它更像：

- JSON 解析器
- 结构读取器
- 文本到数据对象的转换器

而不是“结构生成器”。

## 196. 它在整条链里真正负责哪一段

还是看这条最经典的链：

```python
prompt | model | parser
```

这里三段职责要非常清楚：

- `prompt`：告诉模型要按什么结构输出
- `model`：尽量按要求生成 JSON 风格内容
- `JsonOutputParser`：把这段内容解析成 Python 可处理结构

所以你一定要建立这个认识：

> `JsonOutputParser` 不是结构的来源，而是结构的接收器和解析器。

## 197. 它依赖模型先做到什么程度

`JsonOutputParser` 想稳定工作，前提通常是：

- 模型已经大致按 JSON 输出
- 至少没有完全跑偏
- 字段结构大致可解析

例如模型输出：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

这时 parser 很容易处理。

但如果模型输出的是：

```text
下面是结果：

{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}

希望对你有帮助！
```

那稳定性就会下降。

所以这里最重要的认知是：

> `JsonOutputParser` 的前提，是模型已经“尽量像 JSON 一样说话”。

## 198. 为什么“请输出 JSON”还不等于稳定

很多人一开始会觉得：

- prompt 里已经写了“请输出 JSON”
- 那应该就够了

其实不够。常见问题主要有四类：

### 1. 模型会加解释文字

例如：

- 好的，下面是 JSON
- 以下是结果
- 希望对你有帮助

这些对人类很友好，但对 parser 不友好。

### 2. 字段可能不完整

你要求：

- `title`
- `summary`
- `keywords`

模型可能只返回：

- `title`
- `summary`

### 3. 字段名可能漂移

你想要：

- `keywords`

模型可能写成：

- `keyword`
- `tags`
- `key_points`

对人来说差不多，对程序来说完全不一样。

### 4. 字段值类型可能不稳定

你想要：

```json
"keywords": ["prompt", "rag", "agent"]
```

模型可能返回：

```json
"keywords": "prompt, rag, agent"
```

这样看起来也合理，但程序处理方式已经不同了。

## 199. 所以 JsonOutputParser 真正适合什么场景

它最适合下面这类任务：

- 字段结构不复杂
- 你想快速把输出变成字典
- 你接受一定程度的松散性
- 你还没到必须严格 schema 的阶段

例如：

- 文章摘要
- 标签提取
- 分类结果
- 简单配置生成
- 页面小型结构数据

## 200. 一个更稳的 prompt 写法思路

如果你想让 `JsonOutputParser` 更稳定，不能只写：

```python
"请返回 JSON"
```

更好的写法通常需要同时说明：

- 只返回 JSON
- 不要输出额外解释
- 明确字段名
- 明确字段类型或格式

例如：

```python
prompt = ChatPromptTemplate.from_template(
    """
请分析主题 {topic}。

要求：
1. 只返回 JSON
2. 不要输出任何额外解释
3. JSON 必须包含以下字段：
   - title: string
   - summary: string
   - keywords: string array
"""
)
```

这种写法通常比一句“请输出 JSON”稳定得多。

## 201. JsonOutputParser 和 StrOutputParser 的更深层区别

表面上你已经知道：

- `StrOutputParser` -> 字符串
- `JsonOutputParser` -> 结构化对象

更深层的区别在于：

### `StrOutputParser`

你主要关心：

- 模型说了什么

### `JsonOutputParser`

你开始关心：

- 模型返回的数据结构长什么样

也就是说，你的思维开始从：

- “模型怎么回答我”

转向：

- “模型怎么把数据交给我”

这一步非常关键。

## 202. 真正实战时你该观察什么

当你跑 `JsonOutputParser` 的例子时，不要只看有没有结果，更要重点观察这 4 件事：

### 1. 字段是否稳定

不同 topic 下，字段名有没有变化。

### 2. 类型是否稳定

例如 `keywords` 是否始终是列表。

### 3. 是否有额外噪音

有没有“好的，下面是结果”这种多余文字。

### 4. 结构是否便于下游使用

这个结果能不能直接：

- 存数据库
- 给前端
- 传下一步链路

## 203. 当前阶段建议做的 3 个高质量练习

### 练习 1：固定字段，换主题

一直保持字段不变：

- `title`
- `summary`
- `keywords`

只换主题：

- `LangChain`
- `PromptTemplate`
- `RAG`
- `CrewAI`

目标：观察字段结构是否稳定。

### 练习 2：固定主题，改 prompt 严谨度

同样是 `LangChain`，你写三种 prompt：

#### 版本 A：很模糊

```text
请介绍 LangChain，并给一个 JSON。
```

#### 版本 B：中等明确

```text
请介绍 LangChain，并返回包含 title、summary、keywords 的 JSON。
```

#### 版本 C：严格明确

```text
请介绍 LangChain。
要求：
1. 只返回 JSON
2. 不要输出额外解释
3. 包含字段：
   - title: string
   - summary: string
   - keywords: string array
```

目标：观察 prompt 明确度如何影响 parser 稳定性。

### 练习 3：故意让字段复杂一点

比如要求：

- `title`
- `summary`
- `keywords`
- `difficulty`
- `recommended_next_step`

目标：观察字段一多时，模型稳定性是否下降。

## 204. 当前阶段最该建立的工程意识

`JsonOutputParser` 不是“用了就稳定”，而是让你开始进入一种新的开发方式：

> 先设计输出结构，再设计 prompt，再接 parser。

正确顺序不是：

- 先让模型随便说
- 再回头想怎么解析

而是：

1. 我希望结果长什么样
2. 我怎么告诉模型按这个样子输出
3. 我怎么用 parser 接住它

这才是结构化输出的正确思路。

## 205. 什么时候说明你已经吃透 JsonOutputParser 了

如果你能做到下面这些，就说明你已经不只是“会用”，而是“理解了”：

- 能解释它不是结构生成器，而是结构解析器
- 能解释为什么只写“请输出 JSON”还不够
- 能写出更稳定的 JSON 输出 prompt
- 能判断什么时候该用字典级结构，什么时候该升级到 schema 级结构
- 能清楚区分：
  - `StrOutputParser`
  - `JsonOutputParser`
  - `PydanticOutputParser`

## 206. 当前阶段最该记住的 5 句话

- `JsonOutputParser` 的目标是把模型输出接成结构化数据
- 它依赖模型先尽量按 JSON 输出
- 它不是替模型重新思考的工具
- prompt 写得越明确，JSON 解析通常越稳定
- 它适合“先把结果结构化成字典”，再往更严格 schema 升级

## 207. 当前阶段一句话总结

`JsonOutputParser` 的关键不是“会不会用”，而是你是否真正理解：它依赖模型先按结构输出，而 parser 自己主要负责解析、接收和把结果交给程序继续处理。

## 208. JsonOutputParser 和 PydanticOutputParser 时模型输出是不是都像 JSON

这个问题很关键。

先给结论：

> 在当前这类 LangChain `OutputParser` 用法里，模型通常都会被要求尽量输出 JSON 风格内容；然后客户端再根据不同 parser，把它解析成不同层次的结果。

也就是说，大多数情况下它们在模型侧的输出目标并不是完全不同的两种格式，而是：

- 都尽量让模型按结构输出
- 都尽量接近 JSON
- 区别主要发生在客户端后处理阶段

## 209. JsonOutputParser 时通常发生什么

当使用 `JsonOutputParser` 时，常见流程是：

1. prompt 告诉模型要输出 JSON
2. 模型尽量返回 JSON 风格内容
3. parser 把这段内容解析成 Python 字典或列表

例如模型可能输出：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

客户端最后拿到的结果更接近：

```python
{
    "title": "LangChain",
    "summary": "一个用于开发 LLM 应用的框架",
    "keywords": ["prompt", "rag", "agent"]
}
```

也就是字典结构。

## 210. PydanticOutputParser 时通常发生什么

当使用 `PydanticOutputParser` 时，模型通常依然会被要求输出 JSON 风格内容。

例如模型输出依然可能是：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

但客户端不会停在“解析成字典”这一步，而是会继续尝试把它解析并校验成某个明确的数据模型对象。

例如最后拿到的结果更接近：

```python
TopicInfo(
    title="LangChain",
    summary="一个用于开发 LLM 应用的框架",
    keywords=["prompt", "rag", "agent"]
)
```

所以你可以把它理解成：

- 模型输出目标通常都还是 JSON 风格结构
- `PydanticOutputParser` 比 `JsonOutputParser` 多做了一层“按模型对象校验和转换”

## 211. 两者真正的差别不在模型输出目标，而在解析层级

最容易记住的理解方式是：

### `JsonOutputParser`

- 主要把输出接成 JSON 风格数据
- 更常拿到 `dict` / `list`

### `PydanticOutputParser`

- 在 JSON 风格数据基础上继续做模型级解析
- 更常拿到符合 schema 的对象

所以更准确的说法是：

> 它们通常都依赖模型先输出 JSON 风格结构，区别重点在客户端解析深度和约束强度，而不是模型一定输出了完全不同的格式。

## 212. 但“像 JSON”不等于“稳定 JSON”

这里还要补一个很重要的细节。

即使两者都要求模型输出 JSON 风格内容，也不代表模型每次都会返回完美、稳定、可直接解析的 JSON。

例如模型可能输出：

```text
下面是结果：
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

或者：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": "prompt, rag, agent"
}
```

这时你就会看到：

- `JsonOutputParser` 可能勉强接住，或者只暴露较浅层问题
- `PydanticOutputParser` 更容易进一步发现字段类型和结构问题

这也正好引出下一个关键问题。

## 213. 为什么 PydanticOutputParser 比 JsonOutputParser 更容易暴露错误

这是结构化输出里非常重要的一个理解点。

最核心的一句话是：

> `JsonOutputParser` 主要关心“能不能解析成 JSON”，而 `PydanticOutputParser` 更关心“这个 JSON 是否真的符合我定义的数据模型”。

也就是说，`PydanticOutputParser` 的检查层更深、更严格，所以它更容易把潜在问题暴露出来。

## 214. 第一层差别：Json 能解析，不代表结构正确

假设模型输出：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": "prompt, rag, agent"
}
```

从 JSON 角度看，这其实是合法的：

- `title` 是字符串
- `summary` 是字符串
- `keywords` 也是字符串

所以 `JsonOutputParser` 可能会认为：

- 可以解析
- 结果是一个合法字典

但如果你的真实需求是：

```python
keywords: List[str]
```

那这个结果其实已经不符合预期了。

而 `PydanticOutputParser` 更容易在这里把问题暴露出来，因为它不仅看“是不是 JSON”，还看“是不是符合 schema”。

## 215. 第二层差别：字段缺失更容易暴露

假设你定义的模型要求：

- `title`
- `summary`
- `keywords`

但模型返回的是：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架"
}
```

这仍然是合法 JSON。

所以从 `JsonOutputParser` 角度看：

- 字典能解析成功
- 程序先拿到再说

但从 `PydanticOutputParser` 角度看：

- 缺了 `keywords`
- 结果不满足模型定义

于是问题会更早暴露。

## 216. 第三层差别：字段名漂移更容易暴露

假设你期望：

- `keywords`

但模型返回：

- `tags`

例如：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "tags": ["prompt", "rag", "agent"]
}
```

这依然是合法 JSON。

所以 `JsonOutputParser` 可以正常返回这个字典。

但如果你的 `Pydantic` 模型里写的是：

```python
keywords: List[str]
```

那这个结果就无法通过你定义的对象结构要求。

于是字段漂移问题会更容易被暴露出来。

## 217. 第四层差别：PydanticOutputParser 更强调“程序真正能用”

`JsonOutputParser` 更像是在回答：

- 这段输出能不能被解析成结构化数据？

`PydanticOutputParser` 更像是在回答：

- 这段结构化数据能不能真正进入我的业务对象层？

这两者差别非常大。

因为真实系统里，很多错误不是“根本不是 JSON”，而是：

- JSON 合法，但字段不对
- JSON 合法，但类型不对
- JSON 合法，但缺关键字段
- JSON 合法，但不符合下游逻辑需求

而 `PydanticOutputParser` 更容易把这些错误提前暴露出来。

## 218. 一个很直观的类比

你可以把它理解成两种检查方式。

### `JsonOutputParser`

像是在检查：

- 你有没有按表单格式提交
- 至少能读出来

### `PydanticOutputParser`

像是在检查：

- 你不仅提交了表单
- 而且每个字段都符合要求
- 必填项都在
- 类型也对
- 整张表真的能进入系统

所以后者自然更容易发现问题。

## 219. 为什么这反而是好事

初学时很多人会觉得：

- `PydanticOutputParser` 更容易报错
- 那是不是更麻烦

其实从工程角度看，这通常是好事。

因为它能让你更早发现：

- prompt 写得不够清楚
- 模型输出不够稳定
- 字段约束没有说清
- 下游程序假设和模型输出不一致

也就是说：

> 它不是更脆弱，而是更严格、更早暴露真实问题。

## 220. 当前阶段最该记住的 5 个点

- 两种 parser 常常都依赖模型先输出 JSON 风格结构
- `JsonOutputParser` 主要检查“能不能解析成 JSON”
- `PydanticOutputParser` 还会继续检查“是否符合 schema”
- 很多“JSON 合法但业务不可用”的问题，会在 `PydanticOutputParser` 这里更早暴露
- 更容易暴露错误，通常意味着更适合工程化落地

## 221. 当前阶段一句话总结

`PydanticOutputParser` 比 `JsonOutputParser` 更容易暴露错误，不是因为它更差，而是因为它在“能解析成 JSON”之外，还进一步检查“这个结果是否真的符合你定义的数据模型”。

## 222. PydanticOutputParser 的最小实操

现在我们正式进入 `PydanticOutputParser` 的最小实操。

最核心的一句话是：

> `PydanticOutputParser` = 先定义一个明确的数据模型，再让模型按这个模型输出，最后把结果解析成该模型对象。

## 223. 最小完整示例

```python
from typing import List
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser


class TopicInfo(BaseModel):
    title: str = Field(description="主题标题")
    summary: str = Field(description="主题摘要")
    keywords: List[str] = Field(description="主题关键词列表")


model = ChatOpenAI(model="gpt-4o-mini")
parser = PydanticOutputParser(pydantic_object=TopicInfo)

prompt = ChatPromptTemplate.from_template(
    """
请分析主题：{topic}

请严格按照下面的格式要求输出：
{format_instructions}
"""
)

chain = prompt | model | parser

result = chain.invoke({
    "topic": "LangChain",
    "format_instructions": parser.get_format_instructions(),
})

print(result)
print(type(result))
print(result.title)
print(result.summary)
print(result.keywords)
```

## 224. 这段代码在做什么

这段代码可以拆成 4 步：

### 第一步：定义数据模型

```python
class TopicInfo(BaseModel):
    title: str
    summary: str
    keywords: List[str]
```

这一步是在提前定义：

- 输出必须有 `title`
- 输出必须有 `summary`
- 输出必须有 `keywords`
- `keywords` 必须是字符串列表

也就是说，你先把“结果应该长什么样”写清楚了。

### 第二步：创建 parser

```python
parser = PydanticOutputParser(pydantic_object=TopicInfo)
```

这表示：

- 这个 parser 要按 `TopicInfo` 模型来解析输出
- 你最后想拿到的不是普通字典
- 而是 `TopicInfo` 对象

### 第三步：把格式要求告诉模型

```python
parser.get_format_instructions()
```

这一点非常重要。

它会自动生成一段格式说明，帮助模型更明确地知道：

- 你到底要什么结构
- 字段长什么样
- 输出应该遵守什么格式

### 第四步：执行链并拿结果

```python
result = chain.invoke({...})
```

如果一切正常，`result` 不再是：

- 普通字符串
- 普通字典

而是一个：

- `TopicInfo` 对象

## 225. 运行后你应该看到什么

### `print(result)`

你可能会看到类似：

```python
title='LangChain' summary='一个用于开发 LLM 应用的框架' keywords=['prompt', 'rag', 'agent']
```

### `print(type(result))`

你应该看到类似：

```python
<class '__main__.TopicInfo'>
```

这一步很重要，因为它说明你现在拿到的已经不是普通字典，而是一个明确对象。

## 226. 为什么这比 JsonOutputParser 更进一步

如果你使用的是 `JsonOutputParser`，你更可能拿到：

```python
{
    "title": "LangChain",
    "summary": "一个用于开发 LLM 应用的框架",
    "keywords": ["prompt", "rag", "agent"]
}
```

如果你使用的是 `PydanticOutputParser`，你拿到的更接近：

```python
TopicInfo(
    title="LangChain",
    summary="一个用于开发 LLM 应用的框架",
    keywords=["prompt", "rag", "agent"]
)
```

区别在于：

- `JsonOutputParser`：停在字典层
- `PydanticOutputParser`：升级到“符合 schema 的对象层”

## 227. 这个最小实操里最该观察什么

第一次跑的时候，不要只看有没有结果，更要重点观察这 4 件事：

### 1. 字段是否完整

有没有：

- `title`
- `summary`
- `keywords`

### 2. 类型是否正确

尤其看：

- `keywords` 是否真的是列表

### 3. 返回值类型

确认 `type(result)` 不是：

- `str`
- `dict`

而是你的模型类。

### 4. 能不能按对象方式取值

例如：

```python
print(result.title)
print(result.keywords)
```

如果这一步很顺畅，说明你真的进入“对象级结构化输出”了。

## 228. 为什么 Field 很有用

你会看到示例里写了：

```python
title: str = Field(description="主题标题")
```

`Field` 的好处是：

- 代码可读性更好
- 字段语义更明确
- 对模型理解字段含义也有帮助
- 在复杂 schema 中更重要

虽然最小例子不写也能跑，但建议从现在开始养成这个习惯。

## 229. 第一个练习：换 topic

先不要改 schema，只改输入主题：

- `LangChain`
- `PromptTemplate`
- `RAG`
- `CrewAI`

观察结果是否都能稳定解析成：

- `TopicInfo` 对象

## 230. 第二个练习：加一个字段

给模型加一个新字段，例如：

```python
difficulty: str = Field(description="学习难度")
```

完整模型可以变成：

```python
class TopicInfo(BaseModel):
    title: str = Field(description="主题标题")
    summary: str = Field(description="主题摘要")
    keywords: List[str] = Field(description="主题关键词列表")
    difficulty: str = Field(description="学习难度")
```

然后再跑一次，看模型是否还能稳定输出。

这个练习的重点是观察：

- schema 一变，模型输出是否还能跟上
- parser 是否还能稳定接住结果

## 231. 第三个练习：故意让 prompt 变模糊

比如把 prompt 改成：

```python
prompt = ChatPromptTemplate.from_template(
    "请介绍一下 {topic}。\n{format_instructions}"
)
```

然后观察输出稳定性。

你会慢慢发现：

- 即使有 `PydanticOutputParser`
- prompt 依然需要清晰
- parser 不是万能修复器

## 232. 一个常见认知提醒

如果模型输出不符合 schema，比如：

- `keywords` 给成了字符串
- 缺字段
- 字段名漂移

那 `PydanticOutputParser` 更容易报错。

这不是坏事，反而说明：

- 它更严格
- 它更早帮你发现问题
- 它更适合工程系统

## 233. 这个最小实操的真正意义

这段练习不是为了让你死记 API，而是让你建立一个新的认知：

> 模型输出不仅可以是“人类可读文本”，还可以是“程序可依赖的数据对象”。

这一步非常关键，因为后面你做：

- 工具调用参数
- 工作流状态
- 任务拆解结果
- 页面配置
- 结构化摘要

都会依赖这种思维。

## 234. 当前阶段最该记住的 5 句话

- 先定义 `Pydantic` 模型，再定义 parser
- `PydanticOutputParser` 让你拿到对象，而不是普通字典
- `parser.get_format_instructions()` 用来帮助模型理解输出格式
- 它比 `JsonOutputParser` 更严格
- 严格不是缺点，而是更早暴露结构问题

## 235. 当前阶段一句话总结

`PydanticOutputParser` 的最小实操，就是：先定义一个 `Pydantic` 数据模型，再让模型按这个模型输出，最后把结果解析成该模型对象。

## 236. Runnable 是什么

现在正式进入学习路线里的第 4 步：`Runnable` 和链式调用。

最核心的一句话是：

> `Runnable` 可以理解成“一个可执行的处理步骤”。

它接收输入，做一件事，再输出结果。

在 LangChain 里，很多你前面已经学过的组件，本质上都可以放进这个统一抽象里理解。

## 237. 为什么链式调用本质上是在串 Runnable

LangChain 中最经典的一条最小链是：

```python
prompt | model | parser
```

这条链之所以能成立，本质上就是因为这 3 个部分都能被当作：

- 接收输入
- 输出结果
- 再把结果交给下一个步骤

也就是说，它们都符合 `Runnable` 的基本形态。

所以：

> 链式调用的本质，就是把多个 Runnable 按顺序串起来，让前一步输出变成后一步输入。

## 238. 为什么 PromptTemplate 可以看成 Runnable

先看 `PromptTemplate`。

例如：

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("请解释 {topic}")
```

它做的事情其实非常清楚：

- 输入：`{"topic": "LangChain"}`
- 处理：把变量填进模板
- 输出：格式化后的 prompt 文本

所以它完全符合 Runnable 的结构：

- 有输入
- 做转换
- 有输出

也就是说，`PromptTemplate` 本质上是一个“输入变量 -> prompt 文本”的可执行步骤。

## 239. 为什么 ChatPromptTemplate 也可以看成 Runnable

`ChatPromptTemplate` 和 `PromptTemplate` 的区别不在于“能不能执行”，而在于它产出的东西不同。

例如：

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("请解释 {topic}")
```

它做的事情可以理解成：

- 输入：`{"topic": "LangChain"}`
- 处理：把变量填进消息模板
- 输出：格式化后的消息列表或 chat prompt value

所以它同样符合 Runnable 的结构。

区别只是：

- `PromptTemplate` 更偏输出一段文本
- `ChatPromptTemplate` 更偏输出一组消息

但从“输入 -> 处理 -> 输出”的角度看，它们都可以被看成 Runnable。

## 240. 为什么 model 可以看成 Runnable

模型对象，例如：

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini")
```

也同样符合 Runnable 结构。

它做的事情可以理解成：

- 输入：prompt 或消息
- 处理：调用模型 API
- 输出：模型返回的消息对象

所以 `model` 不是一个“神奇黑盒”，而是在链里承担一个非常明确的可执行步骤：

- 接输入
- 调模型
- 出结果

这正是 Runnable 的典型形态。

## 241. 为什么 parser 也可以看成 Runnable

parser 也是一样。

例如：

```python
from langchain_core.output_parsers import StrOutputParser

parser = StrOutputParser()
```

它做的事情可以理解成：

- 输入：模型返回的消息对象
- 处理：提取并整理输出
- 输出：字符串或结构化对象

例如：

- `StrOutputParser`：输出字符串
- `JsonOutputParser`：输出字典
- `PydanticOutputParser`：输出模型对象

所以 parser 也不是附属功能，而是链里的独立处理步骤。

## 242. 把四者放在一起看

如果把你已经学过的这几个组件串起来看，就会非常清楚：

### `PromptTemplate`

- 输入：变量字典
- 输出：文本 prompt

### `ChatPromptTemplate`

- 输入：变量字典
- 输出：消息结构

### `model`

- 输入：prompt / 消息
- 输出：模型消息对象

### `parser`

- 输入：模型消息对象
- 输出：字符串 / JSON / 模型对象

也就是说，它们每一个都能独立描述成：

> 输入 -> 处理 -> 输出

这就是为什么它们都可以看成 Runnable。

## 243. 这也是为什么它们能用 `|` 串起来

现在你就可以真正理解这条链了：

```python
prompt | model | parser
```

它能工作的原因不是“LangChain 做了魔法”，而是因为：

- `prompt` 的输出，正好能作为 `model` 的输入
- `model` 的输出，正好能作为 `parser` 的输入

所以这其实就是一个标准的流水线。

也就是：

```text
变量输入 -> prompt 处理 -> 模型处理 -> parser 处理 -> 最终结果
```

## 244. 一个非常直观的最小流转图

你可以把它写成这样：

```text
{"topic": "LangChain"}
    ↓
PromptTemplate / ChatPromptTemplate
    ↓
格式化后的文本或消息
    ↓
model
    ↓
AIMessage
    ↓
parser
    ↓
str / dict / Pydantic object
```

这个图非常重要，因为它把“为什么这些组件都算 Runnable”解释得很清楚。

## 245. 这里最关键的统一抽象是什么

最关键的统一抽象就是：

> 只要一个组件能够接收输入并产出输出，它就可以作为 Runnable 放进链里。

所以 LangChain 在这里做的事情，本质上是把不同组件都统一成“可组合步骤”。

这样你就不再只是记各种类名，而是开始用统一视角理解它们。

## 246. 为什么这个理解非常重要

因为后面你要学的：

- `invoke`
- `batch`
- `stream`
- 工具调用
- RAG
- Agent

都建立在这个基础上。

如果你没理解“它们本质上都是 Runnable”，后面会觉得 LangChain 很碎。

一旦你理解了，就会发现：

- prompt 是 Runnable
- model 是 Runnable
- parser 是 Runnable
- 以后更多组件也都只是 Runnable 的不同形态

## 247. 当前阶段最该记住的 5 个点

- `Runnable` 本质上是“一个可执行处理步骤”
- `PromptTemplate` 接变量，出文本
- `ChatPromptTemplate` 接变量，出消息
- `model` 接 prompt/消息，出模型结果
- `parser` 接模型结果，出字符串或结构化对象

## 248. 当前阶段一句话总结

`PromptTemplate`、`ChatPromptTemplate`、`model`、`parser` 都可以看成 Runnable，因为它们本质上都符合同一个结构：接收输入，完成一次处理，再输出结果；而链式调用就是把这些 Runnable 依次串起来。

## 249. `invoke`、`batch`、`stream` 是什么

理解 `Runnable` 之后，下一步最自然的内容就是：

- `invoke`
- `batch`
- `stream`

它们可以理解成：

> Runnable 的几种常见执行方式。

也就是说，Runnable 不只是“能串起来”，还要解决：

- 如何执行一次
- 如何批量执行很多次
- 如何流式输出结果

## 250. `invoke` 是什么

`invoke` 是最基础、最重要的执行方法。

一句话理解：

> `invoke` = 用一组输入执行一次 Runnable 或整条链，并返回最终结果。

例如：

```python
result = chain.invoke({"topic": "LangChain"})
```

它的意思就是：

- 把这组输入送进整条链
- 跑完整个流程
- 返回最后结果

## 251. 为什么 `invoke` 最先学

因为它最符合你现在的学习阶段。

你当前最重要的是先搞清楚：

- 输入怎么进入链
- 中间步骤怎么流动
- 最终输出怎么回来

而 `invoke` 正好是最直接、最容易观察整个链路的方法。

所以在 Runnable 学习里：

- `invoke` 是起点
- `batch` 和 `stream` 是在它之上的扩展能力

## 252. `invoke` 的最小示例

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

chain = prompt | model | parser

result = chain.invoke({"topic": "Runnable"})
print(result)
```

这里发生的事情就是：

1. 输入 `{"topic": "Runnable"}` 进入 `prompt`
2. `prompt` 输出格式化后的消息
3. `model` 调模型生成结果
4. `parser` 把结果转成字符串
5. `invoke` 返回最终字符串

## 253. `batch` 是什么

`batch` 可以理解成：

> 一次给 Runnable 或整条链多组输入，让它批量执行并返回一组结果。

例如：

```python
results = chain.batch([
    {"topic": "LangChain"},
    {"topic": "PromptTemplate"},
    {"topic": "RAG"}
])
```

这表示：

- 不只跑一次
- 而是连续处理多组输入
- 最后返回多个结果

## 254. `batch` 适合什么场景

特别适合：

- 批量生成摘要
- 批量分类
- 批量翻译
- 一次处理多个主题

也就是说，当你有很多“相同结构任务，只是输入不同”时，`batch` 就很自然。

## 255. `batch` 的最小示例

```python
results = chain.batch([
    {"topic": "LangChain"},
    {"topic": "PromptTemplate"},
    {"topic": "RAG"}
])

for item in results:
    print(item)
```

这里你会拿到一个结果列表。

你可以把它理解成：

- `invoke` 是“做一次”
- `batch` 是“做很多次”

## 256. `stream` 是什么

`stream` 可以理解成：

> 在结果还没完全生成完时，就一边生成一边往外输出。

这特别适合聊天模型，因为模型往往是逐步生成 token 的。

例如你不想等整段话完全结束后再看到，而是想边生成边显示。

## 257. `stream` 的最小思路

概念上你会这样使用：

```python
for chunk in chain.stream({"topic": "LangChain"}):
    print(chunk, end="")
```

这表示：

- 输入只给一次
- 但输出不是一次性整体返回
- 而是逐块返回

## 258. `stream` 适合什么场景

特别适合：

- 聊天界面
- 长文本生成
- 用户希望尽快看到响应开始出现
- 实时感更强的交互

所以：

- `invoke` 更适合“等最终结果”
- `stream` 更适合“边生成边展示”

## 259. 三者最直观的区别

你可以先这样记：

### `invoke`

- 一次输入
- 一次完整输出

### `batch`

- 多次输入
- 多次完整输出

### `stream`

- 一次输入
- 分块输出

也就是说：

- `invoke`：单次执行
- `batch`：批量执行
- `stream`：流式执行

## 260. 为什么它们都和 Runnable 直接相关

因为只要一个东西是 Runnable，通常你就可以思考：

- 我能不能 `invoke` 它
- 我能不能 `batch` 它
- 我能不能 `stream` 它

这也是 Runnable 抽象很强大的地方。

它不只是统一了“组件长什么样”，还统一了“组件怎么执行”。

## 261. 在学习阶段最该怎么掌握它们

当前阶段你不需要一开始就把三者都学得很复杂。

建议顺序是：

1. 先吃透 `invoke`
2. 再理解 `batch` 是“多组输入的 invoke”
3. 最后理解 `stream` 是“分块返回结果”

因为 `invoke` 是最基础的，其余两者都可以看作是在它之上的扩展。

## 262. 一个很实用的类比

你可以把三者理解成同一台机器的三种工作方式。

### `invoke`

像是：

- 放进去一个订单
- 出来一个成品

### `batch`

像是：

- 一次放进去很多订单
- 出来一批成品

### `stream`

像是：

- 成品还没彻底完成
- 但制作过程已经一段一段展示给你看

## 263. 当前阶段最该记住的 5 个点

- `invoke` 是最基础的执行方式
- `batch` 是批量执行多组输入
- `stream` 是边生成边返回
- 它们本质上都是 Runnable 的执行方式
- 学习顺序应该是：`invoke -> batch -> stream`

## 264. 当前阶段一句话总结

如果说 Runnable 解决的是“步骤怎么统一”，那么 `invoke`、`batch`、`stream` 解决的就是“这些步骤怎么执行”；其中 `invoke` 是最基础的单次执行入口。

## 265. `invoke` 的输入输出到底怎么流动

这一节非常关键，因为它会把你前面学过的：

- `PromptTemplate`
- `ChatPromptTemplate`
- `model`
- `parser`

真正串成一条完整的数据流。

最核心的一句话是：

> `invoke` 做的事情，就是把你给链的输入，从左到右依次传过每个 Runnable，直到拿到最后结果。

也就是说，这条链：

```python
prompt | model | parser
```

本质上就是一个数据流水线。

## 266. 先看完整示例

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

chain = prompt | model | parser

result = chain.invoke({"topic": "LangChain"})
print(result)
```

你现在最关心的不是“它能跑”，而是：

- `{"topic": "LangChain"}` 这份输入
- 到底是怎么一步步流动
- 最后变成字符串结果的

## 267. 整条链先看成一个总流程

这条链的流动可以先粗略写成：

```text
{"topic": "LangChain"}
    ↓
prompt
    ↓
格式化后的消息
    ↓
model
    ↓
模型返回的消息对象
    ↓
parser
    ↓
普通字符串
```

所以：

- 链的起点是原始输入字典
- 链的终点是最终结果

## 268. 第一步：`invoke` 把输入送进整条链

当你执行：

```python
chain.invoke({"topic": "LangChain"})
```

这里的：

```python
{"topic": "LangChain"}
```

就是整条链的原始输入。

你可以把这一刻理解成：

- 你把一份原材料交给流水线
- 流水线从最左边第一个组件开始处理

而这条链最左边的组件，就是：

```python
prompt
```

## 269. 第二步：输入先进入 `prompt`

我们的 `prompt` 是：

```python
prompt = ChatPromptTemplate.from_template("请用一句话解释 {topic}")
```

它的职责是：

- 接收变量字典
- 把变量填进模板
- 输出格式化后的 prompt 结果

所以在这一刻：

### 输入给 prompt 的是

```python
{"topic": "LangChain"}
```

### prompt 做的事情是

把模板：

```text
请用一句话解释 {topic}
```

替换成：

```text
请用一句话解释 LangChain
```

但因为这里是 `ChatPromptTemplate`，它通常不会只输出裸字符串，而更像输出一个消息结构。

概念上可以理解成类似：

```python
[
    {"role": "user", "content": "请用一句话解释 LangChain"}
]
```

## 270. 所以 prompt 这一步的输入输出是什么

### prompt 输入

```python
{"topic": "LangChain"}
```

### prompt 输出

- 格式化后的消息结构
- 你可以先把它简单理解成“准备好发给模型的一条消息”

## 271. 第三步：prompt 的输出进入 `model`

接下来轮到：

```python
model = ChatOpenAI(model="gpt-4o-mini")
```

它的职责是：

- 接收 prompt 生成好的文本/消息
- 发给模型 API
- 拿回模型输出

所以现在输入给 `model` 的，已经不是最初的：

```python
{"topic": "LangChain"}
```

而是 `prompt` 处理后的结果。

也就是说，`model` 接收的是：

- 格式化后的 prompt
- 或格式化后的消息列表

例如概念上：

```python
[{"role": "user", "content": "请用一句话解释 LangChain"}]
```

## 272. model 这一步做了什么

它会把这个输入发给模型，然后模型返回回答。

例如模型可能回答：

```text
LangChain 是一个用于开发大模型应用的框架。
```

但这里要注意：

> `model` 输出的通常还不是最终纯字符串，而更像一个模型消息对象。

概念上你可以理解成类似：

```python
AIMessage(content="LangChain 是一个用于开发大模型应用的框架。")
```

## 273. 所以 model 这一步的输入输出是什么

### model 输入

- prompt 输出的格式化消息

### model 输出

- 模型消息对象
- 例如 `AIMessage`

你现在要建立的一个重要意识是：

> `model` 输出的不是“最后给程序的成品”，而是“模型原始结果对象”。

这也是为什么后面还需要 `parser`。

## 274. 第四步：model 的输出进入 `parser`

我们的 parser 是：

```python
parser = StrOutputParser()
```

它的职责是：

- 接收模型原始输出对象
- 提取真正的内容
- 转成程序更容易处理的结果

所以现在输入给 `parser` 的，是类似：

```python
AIMessage(content="LangChain 是一个用于开发大模型应用的框架。")
```

而 parser 做的事情就是：

- 把里面的内容提取出来
- 转成普通字符串

例如：

```python
"LangChain 是一个用于开发大模型应用的框架。"
```

## 275. 所以 parser 这一步的输入输出是什么

### parser 输入

- 模型消息对象

### parser 输出

```python
"LangChain 是一个用于开发大模型应用的框架。"
```

到这里，整条链就执行完成了。

## 276. 最终 `invoke` 返回的是什么

`invoke` 返回的是整条链最后一个步骤的输出。

在这条链里，最后一个步骤是：

```python
parser
```

而 `parser` 输出的是字符串。

所以：

```python
result = chain.invoke({"topic": "LangChain"})
```

最终 `result` 就是：

```python
"LangChain 是一个用于开发大模型应用的框架。"
```

## 277. 把整条流动写成“逐步变形”

你可以把这条链写成这样：

### 原始输入

```python
{"topic": "LangChain"}
```

### 经过 prompt

```text
请用一句话解释 LangChain
```

或等价的消息结构。

### 经过 model

```python
AIMessage(content="LangChain 是一个用于开发大模型应用的框架。")
```

### 经过 parser

```python
"LangChain 是一个用于开发大模型应用的框架。"
```

## 278. 如果不加 parser，流动会变成什么

如果你的链写成：

```python
chain = prompt | model
```

那么流动会变成：

```text
{"topic": "LangChain"}
    ↓
prompt
    ↓
格式化消息
    ↓
model
    ↓
AIMessage
```

这时 `invoke` 返回的就是：

- `AIMessage(...)`

而不是字符串。

所以你通常还要自己写：

```python
result.content
```

这正好能帮助你理解 parser 的价值。

## 279. 如果换成 JsonOutputParser，流动会怎样

如果你的链写成：

```python
chain = prompt | model | json_parser
```

那流动就会变成：

```text
{"topic": "LangChain"}
    ↓
prompt
    ↓
格式化消息
    ↓
model
    ↓
AIMessage（内容里是 JSON 风格文本）
    ↓
JsonOutputParser
    ↓
dict
```

所以你要开始记住一个特别重要的点：

> `invoke` 的返回值，不是固定类型，而是由链最后一个 Runnable 决定。

## 280. 一个最关键的统一抽象

你现在可以把每个 Runnable 都理解成一个“函数式步骤”：

### `prompt`

```text
dict -> prompt value
```

### `model`

```text
prompt value -> AIMessage
```

### `parser`

```text
AIMessage -> str
```

所以整条链其实就是函数组合：

```text
dict -> str
```

这就是 `prompt | model | parser` 最本质的含义。

## 281. 当前阶段最该记住的 5 句话

- `invoke` 会从链最左边开始执行
- 每一步都拿前一步的输出作为自己的输入
- `prompt` 把变量字典变成格式化消息
- `model` 把消息变成模型输出对象
- `parser` 把模型输出对象变成程序真正想要的结果

## 282. 当前阶段一句话总结

`invoke` 的输入输出流动，本质上就是：原始输入先进入 `prompt`，再进入 `model`，再进入 `parser`，每一步都做一次“输入 -> 处理 -> 输出”的转换，最后返回链最右侧步骤的结果。

## 283. 为什么有时 `invoke` 返回字符串，有时返回 `dict`，有时返回 `Pydantic` 对象

这是理解 Runnable 和链式调用时最重要的一个问题之一。

最核心的一句话是：

> `invoke` 本身并不决定返回类型，真正决定结果形态的是链最右边最后一个 Runnable 的输出类型。

也就是说：

- `invoke` 只负责执行整条链
- 它不会额外把结果统一改造成某种固定类型
- 它只是把“最后一步的输出”原样返回给你

## 284. 为什么 `invoke` 有时返回字符串

如果你的链最后一个步骤是：

- `StrOutputParser()`

那么它的输出就是字符串。

例如：

```python
chain = prompt | model | StrOutputParser()
result = chain.invoke({"topic": "LangChain"})
```

这里最终返回的是：

```python
"LangChain 是一个用于开发大模型应用的框架。"
```

原因不是 `invoke` 特别偏爱字符串，而是：

- 链最后一个 Runnable 是 `StrOutputParser`
- 它输出字符串
- 所以 `invoke` 返回字符串

## 285. 为什么 `invoke` 有时返回 `dict`

如果你的链最后一个步骤是：

- `JsonOutputParser()`

那么它的输出更接近：

- `dict`
- `list`
- 或更一般的 JSON 风格 Python 结构

例如：

```python
chain = prompt | model | JsonOutputParser()
result = chain.invoke({"topic": "LangChain"})
```

这时你更可能拿到：

```python
{
    "title": "LangChain",
    "summary": "一个用于开发 LLM 应用的框架",
    "keywords": ["prompt", "rag", "agent"]
}
```

原因依然一样：

- 最后一个 Runnable 是 `JsonOutputParser`
- 它输出结构化字典/列表
- 所以 `invoke` 返回结构化字典/列表

## 286. 为什么 `invoke` 有时返回 `Pydantic` 对象

如果你的链最后一个步骤是：

- `PydanticOutputParser(...)`

那么它输出的就不再只是普通字典，而是符合某个数据模型的对象。

例如：

```python
chain = prompt | model | pydantic_parser
result = chain.invoke({"topic": "LangChain"})
```

这时你更可能拿到：

```python
TopicInfo(
    title="LangChain",
    summary="一个用于开发 LLM 应用的框架",
    keywords=["prompt", "rag", "agent"]
)
```

原因还是同一个：

- 最后一个 Runnable 是 `PydanticOutputParser`
- 它输出对象
- 所以 `invoke` 返回对象

## 287. 如果最后一个 Runnable 是 `model` 呢

这个例子特别重要，因为它能帮助你彻底理解：`invoke` 不会主动帮你“美化结果”。

如果你写的是：

```python
chain = prompt | model
result = chain.invoke({"topic": "LangChain"})
```

这时最后一个步骤是 `model`。

所以 `invoke` 返回的往往更接近：

- `AIMessage`

而不是：

- 字符串
- 字典
- 对象

这进一步说明：

> `invoke` 返回什么，真的只是取决于链最后一步产出了什么。

## 288. 本质上是谁决定了最终结果形态

最准确的答案是：

> 不是 `invoke` 决定的，而是“链最后一个 Runnable 的输出签名”决定的。

你可以把每个 Runnable 都理解成一个函数：

### `prompt`

```text
dict -> prompt value
```

### `model`

```text
prompt value -> AIMessage
```

### `StrOutputParser`

```text
AIMessage -> str
```

### `JsonOutputParser`

```text
AIMessage -> dict
```

### `PydanticOutputParser`

```text
AIMessage -> TopicInfo
```

所以整条链最终是什么类型，其实取决于最后一步把数据变成了什么。

## 289. 你可以把它理解成“最后一道工序决定交付形态”

这是一个非常实用的类比。

想象一条工厂流水线：

- 前面几道工序在加工原料
- 最后一道工序决定成品以什么形式交付

例如：

- 最后一道工序负责“装箱” -> 你拿到箱装成品
- 最后一道工序负责“贴标签” -> 你拿到贴好标签的成品
- 最后一道工序负责“拆包装” -> 你拿到裸成品

LangChain 链路里也是一样：

- 前面的 Runnable 负责逐步加工数据
- 最后一个 Runnable 决定最终交给你的结果形态

## 290. 为什么这种设计很合理

这种设计的好处非常大，因为它让你可以自由控制“链最终返回什么”。

例如：

- 如果你想拿模型原始消息
  - 最后停在 `model`

- 如果你想拿字符串
  - 最后接 `StrOutputParser`

- 如果你想拿字典
  - 最后接 `JsonOutputParser`

- 如果你想拿强类型对象
  - 最后接 `PydanticOutputParser`

也就是说，返回类型不是被框架写死，而是由你怎么组链决定。

## 291. 一个最直观的对照表

- `prompt | model`
  - `invoke` 返回：`AIMessage`

- `prompt | model | StrOutputParser()`
  - `invoke` 返回：`str`

- `prompt | model | JsonOutputParser()`
  - `invoke` 返回：`dict` / `list`

- `prompt | model | PydanticOutputParser(...)`
  - `invoke` 返回：`Pydantic` 模型对象

## 292. 当前阶段最该记住的 5 个点

- `invoke` 自己不决定返回值类型
- 它只是执行整条链并返回最后一步结果
- 最后一个 Runnable 输出字符串，`invoke` 就返回字符串
- 最后一个 Runnable 输出字典，`invoke` 就返回字典
- 最后一个 Runnable 输出对象，`invoke` 就返回对象

## 293. 当前阶段一句话总结

为什么 `invoke` 有时返回字符串、有时返回 `dict`、有时返回 `Pydantic` 对象？因为 `invoke` 只是执行整条链并返回最后一步结果，而真正决定结果形态的，是链最右边最后一个 Runnable 的输出类型。

## 294. `batch` 和 `stream` 的输入输出是否也遵循同样规律

答案是：是的，本质上也遵循同样规律。

一句话先记住：

> 链最后一个 Runnable 仍然决定结果的核心形态，而 `invoke`、`batch`、`stream` 主要决定的是“结果怎么交付”。

也就是说：

- Runnable 决定“结果是什么”
- 执行方式决定“结果怎么返回”

## 295. `batch` 为什么也遵循同样规律

你可以把 `batch` 理解成：

> 把很多次 `invoke` 打包执行。

所以如果单次 `invoke` 返回的是：

- `str`

那么 `batch` 返回的通常就是：

- `List[str]`

例如：

```python
results = chain.batch([
    {"topic": "LangChain"},
    {"topic": "RAG"},
    {"topic": "PromptTemplate"}
])
```

如果链最后一步是 `StrOutputParser()`，那么你拿到的更像：

```python
[
    "LangChain 是一个用于开发大模型应用的框架。",
    "RAG 是检索增强生成。",
    "PromptTemplate 是提示词模板。"
]
```

所以你可以把它记成：

> `batch` 的返回类型，通常可以理解成“单次 `invoke` 返回类型的列表版”。

## 296. `stream` 为什么也遵循同样规律

`stream` 也遵循同样的大规律，但它比 `invoke` 和 `batch` 更特殊一点。

一句话理解：

> `stream` 不是一次性把最终结果整体返回，而是把结果的生成过程分块返回。

例如：

```python
for chunk in chain.stream({"topic": "LangChain"}):
    print(chunk, end="")
```

它的特点是：

- 输入只给一次
- 输出不是一次性整体交付
- 而是一段一段往外返回

所以：

- `invoke` 更像“最终成品一次交付”
- `stream` 更像“制作过程逐步展示”

## 297. 为什么 `stream` 在字符串场景最直观

这是一个非常重要的理解点。

最核心的原因是：

> 字符串天然就是按片段逐步生成和逐步展示最容易理解的一种结果形态。

例如模型输出一句话：

```text
LangChain 是一个用于开发大模型应用的框架。
```

在流式场景下，它可以很自然地变成：

```python
"Lang"
"Chain"
" 是一个"
" 用于开发"
" 大模型应用的框架。"
```

你一边接收，一边打印，用户体验上非常自然。

也就是说：

- 文本本来就是线性生成的
- 文本分块后依然容易读懂
- 文本分块后最终也很容易拼回去

所以字符串场景下，`stream` 最容易理解，也最适合直接展示。

## 298. 为什么在 JSON 场景会更特殊

JSON 场景就没有那么直观了。

因为 JSON 的特点不是“只要有一部分就能自然理解”，而是：

- 要求整体结构完整
- 花括号、引号、逗号、数组都要配对
- 少一块内容时，整个结构可能暂时还是不合法的

例如模型最终可能想输出：

```json
{
  "title": "LangChain",
  "summary": "一个用于开发 LLM 应用的框架",
  "keywords": ["prompt", "rag", "agent"]
}
```

但在流式生成过程中，它可能暂时只吐出了：

```text
{
  "title": "LangChain",
  "summary": "一个用于开发
```

这时候：

- 人看着就已经有点不完整
- 程序也几乎不可能立刻把它当成合法 JSON 去解析

所以 JSON 场景的流式输出更特殊，因为：

> 中间过程往往不是一个完整、可立即解析的结构。

## 299. 为什么在 Pydantic 场景会更特殊

`Pydantic` 场景其实比 JSON 还更进一步。

因为 `PydanticOutputParser` 的目标不是只拿到“长得像 JSON 的文本”，而是最终要拿到：

- 一个符合 schema 的对象

例如：

```python
TopicInfo(
    title="LangChain",
    summary="一个用于开发 LLM 应用的框架",
    keywords=["prompt", "rag", "agent"]
)
```

这意味着它通常需要：

1. 先有完整 JSON 风格结构
2. 再做字段检查
3. 再做类型检查
4. 最后才能构造成对象

所以在流式过程中，如果模型只吐出了一半内容：

- 字段可能还没齐
- 类型可能还没看清
- 整体对象也还没法构建

这就导致：

> `Pydantic` 场景的真正结果通常更适合“最终一次成型”，而不是天然按块直接展示。

## 300. 这就是为什么 `stream` 在字符串场景最自然

你可以把三种场景这样对比：

### 字符串

- 每一小块都还能读
- 边生成边显示非常自然
- 最终拼接也简单

### JSON

- 中间块往往不完整
- 常常要等整体结构闭合后才好解析
- 流式更适合“展示生成过程”，不一定适合“即时解析”

### Pydantic 对象

- 需要建立在完整结构基础上
- 还要检查字段和类型
- 通常更适合最后统一生成对象

所以如果从直观性和易用性看：

> `stream` 最天然适合字符串输出；在 JSON / Pydantic 场景中，它依然能用，但中间过程会更不完整、更依赖后处理。

## 301. 一个很实用的工程理解

你现在可以把它理解成两层：

### 第一层：生成层

模型可以逐步生成：

- token
- 文本片段
- 部分 JSON 片段

### 第二层：结果层

程序真正想要的最终结果可能是：

- 字符串
- 字典
- Pydantic 对象

字符串几乎可以直接从生成层过渡到结果层。

但 JSON 和 Pydantic 往往需要：

- 先收集更多内容
- 再完成结构解析
- 再完成对象构建

所以越往结构化方向走，流式展示越自然，流式直接“得到最终对象”越不自然。

## 302. 当前阶段最该记住的 5 个点

- `batch` 和 `stream` 本质上也遵循同样规律
- 链最后一个 Runnable 仍然决定结果的核心形态
- `batch` 更像“单次结果类型的列表版”
- `stream` 更像“结果的分块返回版”
- `stream` 在字符串场景最直观，在 JSON / Pydantic 场景更依赖后处理

## 303. 当前阶段一句话总结

为什么 `stream` 在字符串场景最直观，而在 JSON / Pydantic 场景会更特殊？因为字符串天然适合按片段逐步生成和展示，而 JSON 和 Pydantic 结果通常要等结构更完整后，才能稳定地解析和构造成最终对象。

## 304. 工具是怎么被声明给模型的

现在正式进入第 5 步：工具调用。

理解工具调用时，第一件事必须先搞清楚：

> 模型之所以能“请求调用工具”，前提是程序先把“有哪些工具可用”明确告诉了它。

也就是说，模型不是凭空知道有 `get_weather`、`read_file`、`search_docs` 这些工具的，而是客户端、后端或框架先注册工具，再通过协议把它们暴露给模型。

## 305. 工具声明本质上在告诉模型什么

当程序“声明工具”时，通常是在告诉模型下面这些信息：

- 工具名是什么
- 这个工具是干什么的
- 需要哪些参数
- 参数是什么类型
- 哪些参数是必填
- 有时还会补充返回结果的大致语义

所以你可以把工具声明理解成：

> 给模型一份“可用能力清单 + 使用说明书”。

## 306. 一个最简单的工具声明例子

比如你想给模型一个天气工具，概念上可以声明成这样：

```json
{
  "name": "get_weather",
  "description": "查询某个城市的天气",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "城市名称"
      }
    },
    "required": ["city"]
  }
}
```

这里其实就是在告诉模型：

- 这个工具名字叫 `get_weather`
- 它能查天气
- 调用时必须给一个 `city`
- `city` 的类型是字符串

## 307. 工具声明和 prompt 的区别

这是一个非常关键的区分。

### prompt 负责什么

prompt 更像是在告诉模型：

- 当前任务是什么
- 该怎么回答
- 回答边界是什么
- 行为风格是什么

### tools 负责什么

tools 更像是在告诉模型：

- 你能调用哪些外部能力
- 每个能力怎么用
- 参数应该怎么传

所以你可以把它记成：

- prompt 决定“该怎么做”
- tools 决定“能做什么”

## 308. 工具声明一般放在哪

在真实 API 里，工具声明通常不是写在普通 `content` 文本里，而是作为请求协议的一部分传给模型服务。

也就是说，请求里除了：

- `model`
- `messages`

之外，通常还会有：

- `tools`

概念上可能像这样：

```json
{
  "model": "some-model",
  "messages": [
    {
      "role": "user",
      "content": "北京今天天气怎么样？"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "查询某个城市的天气",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string",
              "description": "城市名称"
            }
          },
          "required": ["city"]
        }
      }
    }
  ]
}
```

所以工具声明更像是：

- API 请求里的结构化字段
- 而不是普通聊天文本的一部分

## 309. 为什么 `description` 和参数 schema 很重要

很多初学者只关注工具名，其实：

- `description` 决定模型能不能理解工具用途
- 参数 schema 决定模型能不能稳定构造正确参数

例如只给模型一个工具名 `get_weather`，但不告诉它参数结构，模型就可能乱猜：

- `{"location": "北京"}`
- `{"city_name": "北京"}`
- `{"query": "北京天气"}`

但如果 schema 写清楚：

- 参数叫 `city`
- 类型是 `string`
- 必填

模型就更容易稳定地产生：

```json
{"city": "北京"}
```

## 310. LangChain 里是怎么做这件事的

在 LangChain 里，你通常不会手写底层 JSON，而是通过：

- `tool`
- `StructuredTool`
- function/tool binding

这类方式定义工具。

然后 LangChain 会帮你把这些本地定义，转换成模型 API 能理解的工具声明格式。

所以从工程角度看，LangChain 做的是：

> 把“本地函数定义”翻译成“模型可读的工具说明”。

## 311. 一个非常重要的边界

工具声明告诉模型的是：

- 这些工具可以被请求调用

它不代表：

- 模型拥有真正的执行权
- 模型可以自己直接联网、读文件、跑命令

真正执行时，程序通常还会再判断：

- 工具是否真的实现了
- 参数是否合法
- 当前权限是否允许
- 是否需要用户确认

所以你一定要把这两件事分开：

- 工具声明：让模型知道能力范围
- 工具执行：由程序真正控制

## 312. 模型拿到工具声明后，是怎么判断“什么时候该调用工具”的

这是工具调用里最核心的问题之一。

最核心的一句话是：

> 模型并不是“看到工具就一定调用”，而是会根据“任务目标 + 当前上下文 + system 规则 + 工具说明”综合判断：现在是直接回答更合适，还是先调用工具更合适。

也就是说，工具调用本质上是一个“决策问题”，不是一个固定触发器。

## 313. 模型通常会看哪几类信息来做判断

模型一般会综合看下面几类信息：

### 1. 用户问题本身

它会判断：

- 这个问题靠已有上下文能不能直接回答
- 还是必须借助外部信息

例如：

- “什么是 LangChain”
  - 往往可以直接回答
- “北京今天天气怎么样”
  - 往往更适合调用天气工具

### 2. system 规则

如果 `system` 里明确写了：

- 涉及实时信息必须调用工具
- 不要猜测
- 文件内容必须先读取再回答

那模型会更倾向于调用工具。

### 3. 工具描述是否匹配

模型会看工具的：

- 名字
- 描述
- 参数结构

判断这个工具是不是适合当前任务。

如果工具描述模糊，模型就更容易：

- 选错工具
- 不调用本该调用的工具
- 参数构造不稳定

### 4. 当前上下文是否已经足够

如果前面上下文里已经有了答案，模型就不一定还会调工具。

也就是说，工具调用并不是“只要有工具就调用”，而是“当上下文不够时再调用”。

## 314. 模型通常什么时候更倾向调用工具

下面这些情况里，模型更容易选择调用工具：

- 问题需要实时信息
- 问题需要本地文件内容
- 问题需要数据库或 API 返回值
- system 明确要求“不要猜，先查”
- 工具描述和任务高度匹配

例如：

- 查天气
- 读文件
- 搜索知识库
- 获取当前系统状态
- 查某个 ID 对应的数据

## 315. 模型通常什么时候更倾向直接回答

下面这些情况里，模型更容易直接回答，而不是调用工具：

- 问题属于通用知识解释
- 当前上下文已经足够
- 工具与任务不匹配
- system 没要求必须查证
- 调工具的收益不明显

例如：

- “什么是 PromptTemplate”
- “LangChain 和 CrewAI 有什么区别”
- “解释一下什么是 RAG”

## 316. 所以工具调用不是固定规则，而是“上下文决策”

这一点非常重要。

很多人容易误以为：

- 只要提供了工具，模型就会自动调用

其实不是。

更准确地说：

- 工具声明只是给了模型一个能力选项
- 最终调不调用，要看模型基于上下文怎么判断

所以工具调用本质上更像：

> 给模型一个“可行动空间”，而不是给它一个“必须触发的按钮”。

## 317. 一个最直观的对比例子

### 例子 A：更适合直接回答

用户问：

```text
什么是 LangChain？
```

如果模型已经知道这个概念，而且上下文足够，那么更可能：

- 直接回答
- 不调用工具

### 例子 B：更适合调用工具

用户问：

```text
请读取 /tmp/a.txt 的内容并总结。
```

如果系统提供了 `read_file` 工具，那么模型更可能：

1. 先请求调用 `read_file`
2. 拿到文件内容
3. 再总结

这个过程就很符合：

- 上下文不够
- 外部工具刚好能补足
- 工具调用更合理

## 318. system 规则为什么特别重要

你前面已经学过：

- prompt 决定怎么做
- tools 决定能做什么

而在“调不调用工具”这个问题上，`system` 往往起到非常强的引导作用。

例如如果你写：

- 遇到实时信息必须调用工具
- 不允许猜测外部事实
- 涉及文件必须先读文件再回答

模型就会更明显地倾向使用工具。

也就是说：

> 工具调用不只是由用户问题决定，也强烈受到 system 约束影响。

## 319. 工具描述写得好不好，会直接影响调用判断

如果你给模型的工具说明很差，比如：

- 名字模糊
- 描述太短
- 参数不清晰

那模型很容易出现：

- 明明该调用却没调用
- 明明不该调用却硬调了
- 参数填错

所以从工程上说：

- 工具调用不是只看模型能力
- 也很依赖你把工具“说明得够不够清楚”

## 320. 当前阶段最该记住的 5 个点

- 工具不会自动触发，模型会先做决策
- 模型会综合用户问题、system 规则、上下文和工具说明来判断
- 需要外部信息时，模型更倾向调用工具
- 当前上下文足够时，模型更可能直接回答
- 工具描述越清楚，模型判断越稳定

## 321. 当前阶段一句话总结

模型拿到工具声明后，并不是机械地“看到工具就调用”，而是会根据任务目标、上下文是否足够、system 规则以及工具描述是否匹配，综合判断什么时候先调工具、什么时候直接回答。

## 322. 模型决定调用工具之后，请求是怎么返回出来的

当模型判断应该调用工具时，它通常不会直接给出最终答案，而是会先返回一个结构化的“工具调用请求”。

最核心的一句话是：

> 模型返回的不是“工具已经执行完的结果”，而是“请帮我调用这个工具”的请求描述。

## 323. 本质上模型返回了什么

模型通常会返回下面这几类信息：

- 工具名
- 参数
- 有时还会带一个调用标识 `id`

你可以把它理解成：

- 我建议调用哪个工具
- 调用时参数是什么
- 后面如果工具返回结果，可以靠这个 `id` 对应回来

## 324. 一个最简单的概念形式

为了方便理解，你可以先把它想成这样：

```json
{
  "tool_name": "get_weather",
  "arguments": {
    "city": "北京"
  }
}
```

但这只是帮助理解的简化形式。

真实系统里，这类信息通常不会只是普通文本中的一段 JSON，而更常出现在协议专门的字段里，例如：

- `tool_calls`
- `function_call`
- `output` 中的工具调用块

## 325. 更真实一点的常见返回形式

很多系统里，模型返回会更像这样：

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_123",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"city\":\"北京\"}"
      }
    }
  ]
}
```

你可以这样理解：

- `role: assistant`
  - 说明这仍然是模型这一侧发出来的消息
- `tool_calls`
  - 说明它不是普通自然语言回答，而是工具调用请求
- `name`
  - 表示工具名
- `arguments`
  - 表示参数
- `id`
  - 表示这次调用的标识，方便后面把结果对应回来

## 326. 为什么是 `assistant` 返回，而不是 `tool`

这是一个很容易混淆的点。

### `assistant`

表示：

- 模型在表达动作决策
- 比如“我现在要调用哪个工具”

### `tool`

表示：

- 工具已经被程序执行完了
- 这是工具执行结果回传给模型

所以顺序通常是：

```text
user -> assistant(tool call) -> tool(result) -> assistant(final answer)
```

也就是说：

- 工具调用请求是 `assistant` 发出来的
- 工具执行结果才是 `tool` 回来的

## 327. 客户端收到这个请求后会做什么

当客户端或后端程序收到模型返回的工具调用请求后，一般会做下面几步：

1. 读取工具名
2. 读取参数
3. 检查是否合法
4. 真正执行工具
5. 把工具结果再回传给模型

例如：

- 先读到 `get_weather`
- 再读到 `{"city": "北京"}`
- 然后检查这个工具是否已注册
- 参数是否合规
- 最后真的去查天气

## 328. 所以模型返回的是“请求”，不是“结果”

这是工具调用里最重要的边界之一。

当模型返回：

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "北京"
  }
}
```

这表示的是：

- 请去调用天气工具

而不是：

- 天气已经查好了

真正的天气结果，要等程序执行完工具之后，再返回给模型。

## 329. 为什么不能只靠普通文本来表达工具调用

比如模型如果只是输出一句：

```text
我现在要调用 get_weather(city="北京")
```

人类当然能看懂，但程序未必能稳定地把它当成“可执行请求”。

因为程序需要的是：

- 可解析
- 可验证
- 可执行

所以真实系统里通常使用的是：

- 结构化字段
- 专门的协议字段
- 明确的工具调用格式

这也是为什么会有：

- `tool_calls`
- `function_call`
- `arguments`
- `id`

这类专门字段。

## 330. 不同 API 的返回格式可能不同

虽然思想相同，但不同模型和不同厂商的 API，返回字段形式会略有差异。

常见差异包括：

- 有的叫 `tool_calls`
- 有的叫 `function_call`
- 有的 `arguments` 是 JSON 字符串
- 有的 `arguments` 是对象
- 有的返回在 `assistant` 消息里
- 有的返回在更底层的 `output items` 结构里

所以你要记住：

> “工具调用请求”这个思想是共通的，但具体字段长什么样，取决于 API 协议。

## 331. 这本质上是一个“中间态”

当模型决定调工具时，整个回答过程其实会分成两段：

### 第一段：模型先返回中间态

这里它不会给最终答案，而是先给出：

- 工具名
- 参数
- 调用意图

### 第二段：程序执行工具后再继续

工具结果回来之后，模型才会继续生成最终回答。

所以工具调用请求其实就是：

> 回答过程中的一个中间状态。

## 332. 一个完整小例子

用户问：

```text
北京今天天气怎么样？
```

### 第一步：模型先返回工具调用请求

概念上可能像这样：

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_1",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"city\":\"北京\"}"
      }
    }
  ]
}
```

### 第二步：程序执行工具后返回结果

例如：

```json
{
  "role": "tool",
  "tool_call_id": "call_1",
  "content": "{\"city\":\"北京\",\"weather\":\"晴\",\"temp\":\"25C\"}"
}
```

### 第三步：模型再生成最终答案

例如：

```json
{
  "role": "assistant",
  "content": "北京今天晴，25 度，适合出行。"
}
```

这整个过程就完整体现了：

- 模型先提工具调用请求
- 程序执行工具
- 工具结果回流
- 模型继续生成最终回答

## 333. 当前阶段最该记住的 5 个点

- 模型决定调用工具后，通常不会直接给最终答案
- 它返回的是结构化的工具调用请求
- 请求里通常包含工具名、参数，有时还有调用 ID
- 工具调用请求通常由 `assistant` 发出，不是 `tool`
- 客户端接住请求后，才会真正执行工具

## 334. 当前阶段一句话总结

模型决定调用工具之后，返回出来的通常不是最终答案，而是一个结构化的工具调用请求，其中包含工具名、参数以及可选的调用 ID；客户端接住这个请求后，才会真正执行工具并把结果再回传给模型。

## 335. 工具执行结果是怎么回传给模型的

理解工具调用时，这一步是把闭环真正补完整的关键。

最核心的一句话是：

> 工具执行结果不是模型自己“看到”的，而是由客户端或后端程序把工具结果重新作为一条结构化消息发回给模型。

也就是说，流程不是：

- 模型调工具
- 模型自动知道结果

而是：

- 模型提出工具调用请求
- 程序真正执行工具
- 程序把执行结果再喂回模型
- 模型基于结果继续回答

## 336. 为什么一定要“回传”工具结果

因为模型本身不会直接接触到：

- 你的函数返回值
- 本地文件内容
- API 响应
- shell 输出
- 检索结果

这些都是程序拿到的，不是模型天然拥有的。

所以如果你不把结果再发回去，模型只知道：

- 我刚才请求调用了一个工具

但它不知道：

- 工具到底返回了什么

那它就没法基于工具结果继续生成可靠的最终答案。

## 337. 回传的本质是什么

本质上就是在对话流里新增一条消息。

这条消息通常具备两个核心特点：

- 角色是 `tool`
- 内容是工具执行结果

概念上可能像这样：

```json
{
  "role": "tool",
  "tool_call_id": "call_1",
  "content": "{\"city\":\"北京\",\"weather\":\"晴\",\"temp\":\"25C\"}"
}
```

你可以这样理解：

- `role: tool`
  - 说明这不是用户说的话，也不是模型自己编的
  - 而是工具执行结果
- `tool_call_id`
  - 表示这条结果对应前面哪一次工具调用
- `content`
  - 表示工具执行出来的实际结果

## 338. 为什么很多系统会带 `tool_call_id`

因为模型有时一次请求里不只会调用一个工具。

例如它可能同时想调用：

- `search_docs`
- `read_file`

这时程序执行回来后，需要明确告诉模型：

- 这条结果对应哪个工具调用
- 那条结果又对应哪个工具调用

所以 `tool_call_id` 的作用就是：

> 把工具结果和之前的工具调用请求对上号。

## 339. 一个最直观的小例子

用户问：

```text
北京今天天气怎么样？
```

### 第一步：模型返回工具调用请求

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_1",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"city\":\"北京\"}"
      }
    }
  ]
}
```

### 第二步：程序执行工具

程序拿到：

- 工具名：`get_weather`
- 参数：`{"city": "北京"}`

然后真正执行：

```python
get_weather(city="北京")
```

假设得到结果：

```json
{
  "city": "北京",
  "weather": "晴",
  "temp": "25C"
}
```

### 第三步：程序把结果回传给模型

```json
{
  "role": "tool",
  "tool_call_id": "call_1",
  "content": "{\"city\":\"北京\",\"weather\":\"晴\",\"temp\":\"25C\"}"
}
```

### 第四步：模型再生成最终答案

```json
{
  "role": "assistant",
  "content": "北京今天晴，25 度，适合出行。"
}
```

这就是完整的工具回流闭环。

## 340. 所以“回传”到底是怎么做的

你可以把它理解成：

### 模型第一轮输出

不是最终答案，而是：

- 请帮我调这个工具

### 程序第二轮补消息

把工具执行结果作为：

- 一条 `tool` 消息

再送回模型。

### 模型第三轮输出

才是真正最终给用户看的答案。

所以所谓“回传”，本质上就是：

> 客户端在下一轮请求里，把工具结果作为新的上下文消息附加给模型。

## 341. 这条 `tool` 消息和普通 `assistant` 消息有什么区别

### `assistant`

表示：

- 模型自己的输出
- 可以是正常回答
- 也可以是工具调用请求

### `tool`

表示：

- 外部程序执行完工具后的结果
- 这不是模型生成的自然语言
- 而是系统注入给模型的新事实

所以你可以记：

- `assistant`：模型在说话
- `tool`：程序把工具结果塞回对话

## 342. 工具结果的 `content` 一般放什么

通常会放：

- JSON 字符串
- 文本结果
- 结构化摘要
- 工具原始返回值

比如：

### 天气工具

```json
{"city":"北京","weather":"晴","temp":"25C"}
```

### 文件读取工具

```text
这是文件的全部内容...
```

### 搜索工具

```json
[
  {"title":"文档1","snippet":"..."},
  {"title":"文档2","snippet":"..."}
]
```

核心原则是：

> 放足够让模型继续推理的信息。

## 343. 为什么很多系统喜欢把结果转成 JSON 再回传

因为 JSON 更适合：

- 模型继续读取
- 程序继续处理
- 后续结构化推理

相比一段散文式描述：

```text
北京今天天气晴朗，温度 25 度。
```

结构化结果通常更稳定：

```json
{"city":"北京","weather":"晴","temp":"25C"}
```

这样模型后续更容易：

- 提取字段
- 组织回答
- 和其他工具结果一起整合

## 344. LangChain 里怎么理解这件事

在 LangChain 里，你很多时候不会手写全部底层协议，但底层逻辑还是一样：

- 模型返回工具调用意图
- LangChain 或你的程序执行工具
- 把工具结果包装成对应消息
- 再发回模型继续链路

所以从本质上说，LangChain 帮你做的是：

> 管理工具结果回流到模型这一通道。

## 345. 为什么这是工具调用里最关键的一步之一

因为如果没有这一步，模型只能做到：

- 提出请求

但做不到：

- 基于工具结果继续完成任务

所以你可以把工具调用拆成两半：

### 前半段

- 模型判断并请求调用工具

### 后半段

- 程序执行工具并回传结果
- 模型继续生成最终答案

而真正让工具调用“闭环”的，就是后半段的回传。

## 346. 当前阶段最该记住的 5 个点

- 工具执行结果不是模型自动获得的
- 是程序执行完后再主动回传给模型的
- 回传通常通过一条 `tool` 消息完成
- 这条消息常常带 `tool_call_id` 用来对齐请求
- 模型看到 `tool` 结果后，才会继续生成最终答案

## 347. 当前阶段一句话总结

工具执行结果的回传，本质上是：程序把工具返回值包装成一条 `tool` 消息，再作为新的上下文发回给模型，让模型基于这条结果继续完成回答。

## 348. 为什么工具调用本质上是多轮对话，而不是单次请求就结束

这是理解工具调用最关键的一个抽象。

最核心的一句话是：

> 单次普通回答是模型直接生成答案；工具调用则是模型先提出请求，程序执行外部动作，再把结果回给模型，模型才继续完成答案。

也就是说，工具调用天然包含“先决策、再执行、再继续回答”这几个阶段，因此它本质上更像多轮消息往返，而不是单次请求直接结束。

## 349. 为什么普通回答通常像单轮

如果用户问：

```text
什么是 LangChain？
```

模型如果本身就知道，就可以直接返回：

```text
LangChain 是一个用于开发 LLM 应用的框架。
```

这个过程里没有外部依赖，也没有额外执行动作，所以链路很短：

```text
user -> assistant
```

这就是典型的“单次请求就结束”的情况。

## 350. 为什么工具调用不能这样结束

如果用户问：

```text
北京今天天气怎么样？
```

模型自己并不知道实时天气，所以不能可靠地直接给最终答案。

这时它必须先做一个中间动作：

- 判断需要调用天气工具
- 指定工具名
- 指定参数

所以第一轮模型给出的不是最终答案，而是类似：

- 请帮我调用 `get_weather(city="北京")`

注意，这时天气结果还没有回来，所以回答流程还不能结束。

## 351. 工具调用天然会拆成三段

### 第一段：模型做决策

模型根据：

- 用户问题
- 当前上下文
- system 规则
- 工具描述

来判断：

- 要不要调用工具
- 调哪个工具
- 参数是什么

这一轮输出的是工具调用请求，而不是最终答案。

### 第二段：程序执行工具

客户端或后端程序收到这个请求后：

- 真的去查天气
- 真的去读文件
- 真的去查数据库
- 真的去调 API

此时工具结果在程序手里，还不在模型手里。

### 第三段：模型继续回答

程序把工具结果回传给模型之后，模型才有能力基于这些新信息生成最终回答。

所以完整链路通常像这样：

```text
user -> assistant(tool call) -> tool(result) -> assistant(final answer)
```

这显然已经不是单轮了。

## 352. 本质原因：模型没有执行权

这是最根本的原因。

模型能做的是：

- 生成文本
- 生成结构化调用意图

模型不能直接做的是：

- 真正执行 Python 函数
- 真正联网
- 真正读取本地文件
- 真正访问数据库
- 真正运行 shell 命令

所以只要任务里需要真实外部能力，就必然会插入一个“程序执行”的阶段。

而一旦插入这个阶段，就必须再有一次“结果回流”。

这就天然把流程拉成了多轮。

## 353. 从 Runnable 角度看，它为什么也是多段链

你前面已经学过 Runnable。

普通回答大概可以理解成：

```text
input -> prompt -> model -> parser
```

但工具调用更像：

```text
input
-> prompt
-> model(输出 tool call)
-> tool executor
-> tool message 回流
-> model(继续回答)
-> parser
```

这里模型出现了两次：

- 第一次：判断并提出工具调用请求
- 第二次：基于工具结果继续生成答案

这本身就说明：工具调用不是“一次模型调用就结束”的简单链，而是一个更长的多阶段流程。

## 354. 一个完整小例子

用户问：

```text
请读取 /tmp/a.txt 的内容并总结。
```

### 如果按单次请求思路

模型只能：

- 猜测文件内容
- 或直接胡编

显然这不可靠。

### 实际正确流程

#### 第一步：模型先说

- 我需要调用 `read_file(path="/tmp/a.txt")`

#### 第二步：程序执行

- 真的去读取文件

#### 第三步：程序把文件内容回传

- 以 `tool` 消息形式发回模型

#### 第四步：模型再总结

- 基于真实文件内容生成总结

这其中至少已经经历了两次模型输出：

- 一次是请求调用工具
- 一次是基于工具结果生成最终答案

所以它本质上就是多轮。

## 355. 为什么很多人会误以为它是单次请求

因为很多框架把这个过程封装得很好。

例如你可能只写了一次：

```python
agent.invoke({"input": "北京今天天气怎么样？"})
```

表面上看，好像只是调用了一次。

但框架内部实际上很可能做了这些事：

1. 先调用模型
2. 发现模型要调工具
3. 执行工具
4. 把结果回填
5. 再次调用模型
6. 返回最终答案

所以：

> 对使用者来说像单次调用，对系统内部来说其实是多轮交互。

## 356. 为什么这个理解特别重要

一旦你理解“工具调用本质上是多轮”，很多事情就会突然清楚：

- 为什么需要 `assistant` 和 `tool` 两种消息
- 为什么要有 `tool_call_id`
- 为什么工具结果必须回流
- 为什么 Agent 很容易变成多步状态机
- 为什么工具调用的延迟通常更高
- 为什么调试时要看“每一轮发生了什么”

也就是说，工具调用不是普通聊天的小补丁，而是把“文本生成”升级成了“多步交互流程”。

## 357. 当前阶段最该记住的 5 个点

- 普通回答常常是 `user -> assistant`
- 工具调用通常是 `user -> assistant(tool call) -> tool(result) -> assistant`
- 工具调用会多出“程序执行”和“结果回流”两个阶段
- 模型没有执行权，所以工具调用天然需要多轮往返
- 框架可能把流程封装成一次 `invoke`，但内部本质仍然是多轮

## 358. 当前阶段一句话总结

为什么工具调用本质上是多轮对话，而不是单次请求就结束？因为模型只能先提出工具调用请求，外部程序执行后还必须把结果再发回模型，模型才能继续完成最终答案。

## 359. 什么是 RAG，为什么需要 RAG

现在正式进入学习路线里的第 6 步：RAG。

最核心的一句话是：

> RAG 的本质不是让模型“凭空更聪明”，而是让模型在回答前先去拿相关资料，再基于资料回答。

## 360. 什么是 RAG

`RAG` 是：

- `Retrieval-Augmented Generation`

中文一般叫：

- 检索增强生成

把这个名字拆开看最容易理解：

### `Retrieval`

先检索资料

### `Augmented`

把检索结果补充进上下文

### `Generation`

模型再基于这些资料生成答案

所以一句话就是：

> RAG = 先查资料，再回答。

## 361. 为什么需要 RAG

模型虽然很强，但有天然边界。

它常见的问题包括：

- 不知道你的私有文档
- 不知道最新内容
- 可能会胡编
- 有时回答太泛，不够贴近真实资料来源

例如你问：

```text
我们公司内部请假流程是什么？
```

如果没有 RAG，模型可能只能泛泛而谈。

但如果你有公司制度文档，RAG 就会让流程变成：

1. 先从公司文档里找相关内容
2. 再把这些内容交给模型
3. 再由模型基于文档回答

这样回答会更像：

- 有依据
- 有来源
- 更贴近真实资料

## 362. RAG 本质上解决什么问题

它解决的是：

> 模型上下文不够时，如何把外部知识临时补进来。

注意：这里是“临时补进来”，不是重新训练模型。

也就是说：

- 不是重新训练一个新模型
- 而是回答前先取资料
- 把资料塞进当前上下文
- 再让模型回答

所以 RAG 是一种“推理时补知识”的方法，而不是训练方法。

## 363. 一个最直观的类比

你可以把它想成考试。

### 没有 RAG

像闭卷考试。

模型只能靠自己记得的内容回答。

### 有 RAG

像开卷考试。

模型先查资料，再根据资料作答。

所以 RAG 的价值不是“换了个更聪明的大脑”，而是“让大脑能先翻资料再说”。

## 364. 一个最简单的例子

假设你有一堆文档，里面有关于 `LangChain` 的学习笔记。

用户问：

```text
LangChain 里 PromptTemplate 和 ChatPromptTemplate 有什么区别？
```

### 没有 RAG

模型可能根据自己训练知识回答，答案也许没错，但不一定和你的文档内容一致。

### 有 RAG

系统会先去检索你的文档，找到最相关的几段，比如：

- 一段讲 `PromptTemplate`
- 一段讲 `ChatPromptTemplate`
- 一段讲两者的使用场景

然后把这些片段发给模型，再让模型总结。

于是回答会更贴近：

- 你的材料
- 你的项目语境
- 你当前文档里的知识组织方式

## 365. RAG 和工具调用有什么关系

这是一个很关键的问题。

### 相同点

它们都在做一件事：

- 当模型自身上下文不够时，引入外部信息

### 不同点

#### 工具调用

更像：

- 模型主动请求外部动作
- 例如查天气、读文件、查数据库

#### RAG

更像：

- 系统先做检索
- 把资料补进上下文
- 再让模型回答

所以你可以这样理解：

- 工具调用偏“行动型外部能力”
- RAG 偏“知识型外部补充”

## 366. RAG 最核心的流程

你现在先记最基础的 4 步版本：

### 第一步：准备文档

例如：

- markdown
- txt
- pdf
- 网页内容
- 知识库文档

### 第二步：检索相关片段

用户提问后，系统从文档中找最相关的几段。

### 第三步：把片段拼进 prompt

把这些检索结果作为上下文喂给模型。

### 第四步：模型基于资料回答

模型不再只靠自己记忆，而是结合检索结果作答。

## 367. 为什么它叫“检索增强”

因为模型本身还是那个模型，真正发生变化的是：

- 回答前多了一步“检索资料”

所以“增强”的不是模型参数，而是当前回答的上下文。

这也是为什么 RAG 能够：

- 更快落地
- 不需要重新训练
- 更容易接私有数据
- 更容易接最新知识

## 368. RAG 最适合什么场景

它特别适合：

- 企业知识库问答
- 内部文档问答
- 产品文档问答
- 法律条文问答
- 技术手册问答
- 课程材料问答

一句话判断：

> 只要答案应该“基于某批文档”，RAG 通常就值得考虑。

## 369. RAG 不等于“万能正确答案”

有了 RAG，不代表一定就完全正确。

它仍然可能出问题，比如：

- 没检索到正确片段
- 检索到的片段不完整
- chunk 切分不合理
- 模型虽然拿到资料，但总结错了
- 上下文拼接方式不好

所以 RAG 不是魔法，而是一条新的工程链路。

但它确实能显著改善：

- 幻觉问题
- 私有知识缺失
- 最新信息缺失

## 370. 从 Runnable 角度看 RAG

你前面已经学过 Runnable，所以现在更容易理解：

RAG 不是一个单点功能，而是一条更长的链。

最简化地看，它像这样：

```text
用户问题
-> 检索器
-> 找到相关文档片段
-> 拼进 prompt
-> model
-> parser
```

所以从 Runnable 视角看：

> RAG = 在原来的 `prompt | model | parser` 前面，多插入一个“检索外部知识”的步骤。

这也是为什么最好先学 Runnable，再学 RAG。

## 371. 当前阶段最该记住的 5 个点

- RAG = 先查资料，再回答
- 它不是训练模型，而是增强当前回答的上下文
- 它特别适合基于文档的问答系统
- 它和工具调用相似，但更偏知识检索而不是动作执行
- 从链的角度看，RAG 本质上是在模型前加了检索步骤

## 372. 当前阶段一句话总结

RAG 的本质，是在模型回答前先从外部知识中检索相关资料，把资料补进上下文，再让模型基于这些资料生成答案。

## 373. RAG 的最小链路到底长什么样

现在我们把 RAG 再具体拆开，看看它最小链路到底长什么样。

最核心的一句话是：

> RAG 的最小链路 = 用户提问 → 检索相关资料 → 把资料拼进 prompt → 模型基于资料回答。

这已经是最小闭环了。

## 374. 先看最小运行形态

如果只从“用户提问后的运行逻辑”看，最小 RAG 可以写成：

```text
问题
→ 检索器
→ 相关文档片段
→ prompt
→ model
→ answer
```

也就是说：

- 用户先提问
- 系统先去找相关资料
- 再把这些资料和问题一起发给模型
- 模型最后基于资料作答

## 375. 和普通问答的区别

### 普通问答

```text
问题 → model → answer
```

### RAG 问答

```text
问题 → 检索资料 → model → answer
```

所以 RAG 最本质的区别就是：

> 在模型前面，多了一步“先找资料”。

## 376. 最小链路里有哪几个核心角色

你可以先记 4 个东西：

- 用户问题
- 检索器
- 文档片段
- 模型

### 用户问题

例如：

```text
LangChain 里 PromptTemplate 和 ChatPromptTemplate 有什么区别？
```

### 检索器

负责从知识库中找相关文档。

### 文档片段

例如找到 2 到 3 段和这个问题最相关的内容。

### 模型

把“问题 + 文档片段”结合起来，生成答案。

## 377. 最小 RAG 的具体步骤

### 第一步：准备文档

先要有一批可被检索的资料，例如：

- markdown
- txt
- pdf
- 网页内容
- 公司知识库文档

如果没有文档，就没有 RAG 的知识来源。

### 第二步：用户提问

例如：

```text
RAG 和 Tool Calling 有什么区别？
```

这是整个链路的起点。

### 第三步：检索器找相关片段

系统拿这个问题去知识库里找最相关的几段内容。

例如找到：

- 一段讲 RAG 定义
- 一段讲 Tool Calling 定义
- 一段讲两者区别

这一步输出的不是最终答案，而是候选知识片段。

### 第四步：把片段拼进 prompt

系统把这些文档片段连同原问题，一起组成 prompt。

概念上像这样：

```text
请基于下面资料回答问题。

资料1：
...

资料2：
...

资料3：
...

问题：
RAG 和 Tool Calling 有什么区别？
```

注意这里很关键：

> 模型不是直接去搜文档，而是系统先把文档搜出来，再塞给模型。

### 第五步：模型基于资料生成答案

模型看到：

- 用户问题
- 检索到的文档片段

然后再回答。

所以最终答案更像：

- 基于资料
- 贴近知识库
- 减少幻觉

## 378. 如果用 Runnable 视角看最小 RAG

你前面已经学了 Runnable，所以现在可以这样理解：

最小 RAG 链路大概像这样：

```text
question
→ retriever
→ docs
→ prompt
→ model
→ parser
```

也可以写得更直白一点：

```text
用户问题
→ 检索器拿资料
→ 资料拼进 prompt
→ 模型回答
→ 输出解析
```

所以从链的角度看：

> RAG 本质上是在原来的 `prompt | model | parser` 前面，再加一个 `retriever` 步骤。

## 379. 再往前一步：为什么还会有“切分、embedding、向量库”

你现在问的是“最小链路”，所以上面先只讲了用户提问后的运行过程。

但真实系统里，检索器要能工作，前面通常还要先准备知识库。

所以 RAG 通常可以拆成两层：

### A. 离线准备阶段

也就是先把资料整理好：

```text
原始文档
→ 文档切分
→ embedding
→ 存入向量库
```

### B. 在线问答阶段

也就是用户真正提问时的过程：

```text
用户问题
→ 检索
→ 找到相关片段
→ 拼接上下文
→ 模型回答
```

所以如果你只问“用户提问时最小链路是什么”，答案就是：

```text
问题 → 检索 → 拼接 → 回答
```

## 380. RAG 的检索时机：是谁决定要不要检索

这是很多人容易混淆的一点。

你可能会问：

> 检索资料是不是先提供类似 tool 的描述给模型，模型再通过 tool 指定客户端去检索？

答案是：**不一定。RAG 有两种实现思路。**

### 方式 A：经典 RAG（Pre-defined Retrieval）

```text
用户问题
→ 系统自动检索（不需要模型决策）
→ 拿到资料片段
→ 拼进 prompt
→ 模型回答
```

**特点：**

- 检索时机是**硬编码**的
- 模型**不需要知道**有检索工具存在
- 模型只是被动接收"已经找好的资料"

这是目前大多数 RAG 教程的默认方式。

### 方式 B：Agentic RAG（Tool-based Retrieval）

```text
用户问题
→ 模型判断是否需要检索
→ 模型决定调用检索工具
→ 客户端执行检索
→ 把结果回传给模型
→ 模型再回答
```

**特点：**

- 检索时机由**模型自己决策**
- 必须先声明检索工具的 Schema
- 模型主动决定"要不要查"、"查什么"

这就是你说的那种方式——**先提供类似 tool 的描述给模型，模型再通过 tool 指定客户端去检索。**

### 两者的本质区别

| 维度 | 经典 RAG | Agentic RAG |
|------|----------|-------------|
| 检索决策权 | 程序硬编码 | 模型自主判断 |
| 模型知道检索工具吗 | 不知道 | 知道（作为 Tool） |
| 灵活性 | 低（每次都查） | 高（可选择性查） |
| 实现复杂度 | 简单 | 需要多轮 Tool Calling |
| 适用场景 | 知识库问答 | 复杂 Agent 系统 |

### 最小 RAG 默认讲的是方式 A

你前面看到的"最小链路"：

```text
问题 → 检索 → 拼接 → 回答
```

这个默认是**方式 A**，也就是：

- 系统每次都先检索
- 模型不参与"要不要检索"的决策

而**方式 B** 更像是：

```text
问题 → 模型判断 → (可能调用检索工具) → 回答
```

这已经接近 Agent 了。

### 为什么会有这种区分

因为：

- **经典 RAG**：适合"知识库问答"这种场景——问题来了就一定要查资料，不需要模型判断。
- **Agentic RAG**：适合"Agent 系统"这种场景——模型可能需要查资料，也可能不需要，让它自己决定。

## 381. 一个完整但仍然简化的 RAG 全流程

你可以先记成这张图：

```text
原始文档
→ 文档切分
→ embedding
→ 向量存储

用户问题
→ 问题检索
→ 找到相关片段
→ 拼进 prompt
→ model
→ answer
```

这就是一个更完整的最小 RAG 框架。

## 382. 最小链路里每一步到底解决什么问题

### 文档切分

解决：

- 文档太长，不能整篇都拿去检索

### embedding

解决：

- 怎么把“语义相近”变成可计算的东西

### 向量存储 / 检索

解决：

- 怎么快速找到和问题最相关的片段

### prompt 拼接

解决：

- 怎么把资料变成模型能理解的上下文

### model 回答

解决：

- 怎么基于资料生成自然语言答案

## 383. 和工具调用再对比一次

因为你刚学完工具调用，这里顺手对比会很有帮助。

### Tool Calling

更像：

```text
问题 → 模型决定调工具 → 工具执行 → 结果回流 → 模型回答
```

### RAG

更像：

```text
问题 → 系统先检索资料 → 把资料喂给模型 → 模型回答
```

所以：

- Tool Calling 更偏“做动作”
- RAG 更偏“补知识”

## 384. 当前阶段最该记住的 5 个点

- RAG 最小链路是：`问题 → 检索 → 拼接 → 回答`
- 它本质上是在模型前多加一个“先找资料”的步骤
- 用户提问时的在线链路和知识库准备时的离线链路是两回事
- 在线链路最核心的是：`retriever → prompt → model`
- RAG 的目标不是让模型重训练，而是让回答更有依据

## 385. 当前阶段一句话总结

RAG 的最小链路，就是：用户提问后，系统先从外部知识中检索相关片段，再把这些片段拼进 prompt，最后让模型基于这些资料生成答案。

## 386. 经典 RAG 要如何实现

理解经典 RAG，最好拆成两段：

- **离线准备**：先把知识库建好
- **在线问答**：用户来问题时，先检索，再把检索结果喂给模型

你只要先抓住这句话：

```text
经典 RAG = 先建知识库，再“问题 → 检索 → 拼接 → 回答”
```

## 387. 先看经典 RAG 的完整流程

### A. 离线准备阶段

```text
原始文档
→ 文档切分
→ 对每个 chunk 做 embedding
→ 存入向量库
```

### B. 在线问答阶段

```text
用户问题
→ 把问题做 embedding
→ 去向量库检索相似 chunk
→ 把 chunk 拼进 prompt
→ 调用模型回答
```

这就是经典 RAG 的标准实现。

## 388. 为什么一定要分成两段

因为你不能等用户每次提问时，才临时去：

- 读所有文档
- 切分所有文档
- 给所有文档做 embedding
- 再存入向量库

那样会非常慢。

所以经典 RAG 的思路是：

- **文档侧的重活提前做**
- **用户提问时只做检索和生成**

## 389. 经典 RAG 的 5 个核心组件

### 1. Document Loader

负责把文档读进来。

比如：

- txt
- markdown
- pdf
- 网页
- 数据库记录

### 2. Text Splitter

负责把长文档切成多个 chunk。

为什么要切：

- 一整篇文档太长，不适合直接检索
- 检索时希望命中更具体的片段
- 模型上下文窗口有限

### 3. Embedding Model

负责把文本变成向量。

它解决的是：

> 怎么把“语义相近”这件事变成可计算的相似度。

比如：

- “年假怎么算”
- “员工休假规则是什么”

这两句话字面不同，但语义接近，embedding 后它们在向量空间里通常也会更接近。

### 4. Vector Store

负责存储 chunk 向量，并支持相似度检索。

你可以先这样理解：

- 它不是按关键词精确匹配
- 而是按“语义接近度”查找相关片段

### 5. Retriever

负责对外提供“检索接口”。

它做的事通常是：

- 输入：用户问题
- 输出：最相关的若干 chunk

所以你可以把它理解成：

> Retriever 是给问答链使用的检索器封装。

## 390. 在线问答时到底发生了什么

假设知识库里有很多 LangChain 文档。

用户问：

```text
PromptTemplate 和 ChatPromptTemplate 有什么区别？
```

在线链路就是：

### 第一步：把问题向量化

把这个问题变成 embedding。

### 第二步：去向量库找相似 chunk

找到最相关的几段，比如：

- 一段讲 `PromptTemplate`
- 一段讲 `ChatPromptTemplate`
- 一段讲两者适用场景

### 第三步：把资料拼到 prompt 中

例如：

```text
请基于下面资料回答问题。

资料1：
...

资料2：
...

资料3：
...

问题：
PromptTemplate 和 ChatPromptTemplate 有什么区别？
```

### 第四步：模型生成答案

模型不是凭自己“记忆”硬答，而是参考这些资料来回答。

## 391. 用最朴素的话说，经典 RAG 怎么做

你可以把它记成下面 4 句话：

### 第 1 步：准备知识

先把文档收集好。

### 第 2 步：做成可检索知识库

切分、embedding、入库。

### 第 3 步：用户提问时先查资料

不是直接问模型，而是先查最相关片段。

### 第 4 步：把查到的资料交给模型回答

模型根据资料输出答案。

## 392. 一个最小的 LangChain 代码骨架

下面这段不是为了让你死记 API，而是为了让你看清整体结构。

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate

# 1. 读文档
loader = TextLoader("docs/langchain_intro.txt", encoding="utf-8")
docs = loader.load()

# 2. 切分文档
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100,
)
chunks = splitter.split_documents(docs)

# 3. 做 embedding + 建向量库
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(chunks, embeddings)

# 4. 得到 retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 5. 用户提问
question = "PromptTemplate 和 ChatPromptTemplate 有什么区别？"

# 6. 检索相关资料
retrieved_docs = retriever.invoke(question)
context = "\n\n".join(doc.page_content for doc in retrieved_docs)

# 7. 拼 prompt
prompt = ChatPromptTemplate.from_template("""
请基于下面资料回答问题。

资料：
{context}

问题：
{question}
""")

messages = prompt.invoke({
    "context": context,
    "question": question,
})

# 8. 调用模型
model = ChatOpenAI(model="gpt-4o-mini")
answer = model.invoke(messages)

print(answer.content)
```

## 393. 你真正要看懂的是数据流

上面代码的真正本质是：

```text
docs
→ split
→ chunks
→ embeddings
→ vectorstore

question
→ retriever
→ retrieved_docs
→ prompt
→ model
→ answer
```

也就是说，经典 RAG 的实现重点不是某个神秘技巧，而是把这条数据流真正串起来。

## 394. 如果用 Runnable 视角看经典 RAG

你前面已经学过：

```text
prompt → model → parser
```

那经典 RAG 可以理解成：

```text
question
→ retriever
→ docs
→ prompt
→ model
→ parser
```

也就是在原来的链前面，再加一个“先取资料”的步骤。

## 395. 最小可用版本甚至可以不用 LangChain 全家桶

你完全可以把它理解成下面这种朴素逻辑：

```python
question = "什么是 Runnable？"

docs = retriever.invoke(question)
context = "\n\n".join(doc.page_content for doc in docs)

final_prompt = f"""
请基于下面资料回答问题。

资料：
{context}

问题：
{question}
"""

answer = model.invoke(final_prompt)
```

所以你会发现：

> RAG 的本质不是某个框架 API，而是“先检索，再增强 prompt，再生成答案”。

## 396. 经典 RAG 最容易犯的误区

### 误区 1：以为模型自己会去查资料

不会。

经典 RAG 里，是**系统先查**，模型只是接收检索结果。

### 误区 2：以为 RAG 就是把整篇文档塞给模型

不是。

一般是：

- 先切 chunk
- 再检索最相关的几个 chunk
- 只把相关片段塞进去

### 误区 3：以为有向量库就一定答得准

也不一定。

效果还取决于：

- chunk 切得好不好
- embedding 模型是否合适
- 检索出来的片段是否真的相关
- prompt 是否要求“只基于资料回答”

## 397. 你现在最该记住的实现公式

直接记这条就够了：

```text
经典 RAG 实现 =
加载文档
→ 切分文档
→ embedding
→ 存入向量库
→ 用户提问
→ 检索相关片段
→ 拼进 prompt
→ 模型回答
```

## 398. 如果公司的资料库非常庞大，这个流程还成立吗

成立。

但要补一句：

> 资料库再大，RAG 的核心流程也还是“先检索，再把少量相关资料喂给模型，再回答”。

只是工程上不会像最小示意图那么简单。

## 399. 大资料库场景下，本质流程并没有变

当公司的资料库很庞大时，主链路本质上仍然是：

```text
用户问题
→ 从大资料库里检索相关内容
→ 选出少量最相关片段
→ 拼进 prompt
→ 模型回答
```

所以你前面理解的主链路并没有错。

## 400. 为什么资料库很大时也必须这样做

因为模型不可能直接看到整个公司的所有资料：

- 文档太多
- token 装不下
- 成本太高
- 大量资料和当前问题根本无关

所以系统一定要先做一件事：

> 从海量资料里，先筛出和当前问题最相关的极少数片段。

这正是 RAG 的价值所在。

## 401. 真正变化的是：检索阶段会更复杂

当资料库很小时，你可以很粗地做：

```text
问题 → 检索 top3 → 拼 prompt → 回答
```

但当公司资料库很大时，检索通常会变成多层：

```text
问题
→ 问题理解 / 改写
→ 检索候选资料
→ 过滤 / 排序 / 去重
→ 选出最相关片段
→ 拼进 prompt
→ 模型回答
```

也就是说：

- **主流程没变**
- **只是“检索”这一步内部变复杂了**

## 402. 你可以把它类比成找资料

比如你问：

```text
公司外包员工能否申请年终奖？
```

公司资料库里可能有：

- 人事制度
- 薪酬制度
- 外包合作协议
- 部门补充规则
- 历史通知
- FAQ
- 法务说明

这时系统不会把这些全部塞给模型。

它会做的是：

### 第一步：先找候选资料

可能先找出几十段看起来相关的内容。

### 第二步：再缩小范围

比如筛到 5 到 10 段最相关片段。

### 第三步：只把这些片段给模型

模型再基于这些片段回答。

所以本质上仍然是：

```text
大资料库
→ 先缩小到小范围相关资料
→ 再让模型作答
```

## 403. 关键不是资料库大不大，而是怎么缩小上下文

你真正要抓住的是：

> RAG 不是把整个知识库交给模型，而是把知识库先压缩成当前问题需要的那一小部分上下文。

所以即使资料库很庞大，流程仍然成立。

只是这里的“检索”通常不止一步。

## 404. 在大公司场景里，常见会多出来哪些步骤

### 1. 元数据过滤

比如先按这些条件缩小范围：

- 部门
- 地区
- 文档类型
- 时间范围
- 权限范围

例如你问上海员工社保规则，就可以先过滤成：

```text
地区 = 上海
文档类型 = 人事制度
状态 = 最新有效
```

这样检索会更准。

### 2. 混合检索

不只做向量检索，还会结合关键词检索。

因为企业资料里常常有很多专有名词：

- 项目代号
- 制度编号
- 产品名
- 缩写词

这时候只靠语义检索不一定够，往往会：

```text
关键词检索 + 向量检索
```

### 3. 重排序

先粗检索一批候选，再精排。

例如：

```text
问题
→ 先召回 30 段
→ 再重排序成最相关的 5 段
→ 给模型
```

这样通常比直接取 top3 更稳。

### 4. 多路检索

有的问题需要查多个知识源。

例如：

```text
某员工跨部门转岗后，绩效和年假怎么算？
```

可能同时需要：

- HR 制度
- 绩效制度
- 转岗流程文档

所以系统可能会从多个库分别检索，再合并结果。

### 5. 多跳检索

有些问题不是单次检索就够。

例如：

```text
某产品在欧洲上线时，数据存储要求是什么？
```

可能需要先知道：

- 这个产品属于哪个业务线
- 业务线适用哪些合规规则
- 欧洲地区的数据要求是什么

这时会更像：

```text
先查产品归属
→ 再查对应合规规则
→ 再查地区要求
→ 最后汇总回答
```

但即使这样，本质仍然是 RAG，只是从“单步检索”升级成了“多步检索”。

## 405. 所以你的原始流程要稍微升级一下

你原来理解的是：

```text
问题 → 检索资料 → 喂给模型 → 模型回答
```

这个在概念上是对的。

如果换成大公司资料库，更准确的版本是：

```text
问题
→ 在大资料库中筛选候选内容
→ 排序并选出最相关片段
→ 把少量高相关资料喂给模型
→ 模型基于资料回答
```

## 406. 一个特别重要的现实点

如果问题真的需要“结合多个分散文档”才能回答，那么系统不能只检索 1 段资料。

它通常要做到：

- 检索多个 chunk
- 尽量覆盖不同角度
- 避免重复片段
- 让模型看到足够但不过载的上下文

所以企业级 RAG 的难点不是“能不能检索”，而是：

> 能不能从海量资料里，稳定拿到“够全、够准、够新、够少”的上下文。

这四点很关键：

- **够全**：别漏关键制度
- **够准**：别召回无关资料
- **够新**：别用过期制度
- **够少**：别塞太多把模型淹没

## 407. 最后一句话帮你定住

流程仍然正确。

只是当公司资料库很大时，`检索` 不再是一个简单动作，而会变成一个更复杂的“召回、过滤、排序、压缩、拼接上下文”的过程。

你可以先把它记成：

```text
小型 RAG：
问题 → 检索 → 回答

企业级 RAG：
问题 → 召回 → 过滤 → 重排 → 压缩上下文 → 回答
```

## 408. 为什么一次简单向量检索通常不够

很多初学者会把 RAG 理解成：

```text
用户问题
→ 做一次向量检索
→ 取 topk
→ 直接回答
```

这个流程在小 demo 里常常能跑通，但到了真实业务里经常不够。

原因通常有 5 个：

- 用户问题不一定和文档原文写法一致
- 业务词很多是缩写、代号、系统名、版本名
- 一个答案往往分散在多篇文档里
- 召回结果里会混入“看起来像，但其实不关键”的片段
- 资料有新旧版本，旧资料可能会误导回答

所以企业级 RAG 不是只做一次“相似度查询”，而是要想办法把“可能相关”一步步收缩成“真正可用”。

## 409. 关键词检索、向量检索、混合检索、Rerank 各解决什么

### 关键词检索

关键词检索擅长找“字面上必须命中”的内容。

它特别适合：

- 产品名
- 缩写词
- 错误码
- 接口名
- 特定制度名
- 版本号

比如用户搜 `UDS`、`SOP`、`OTA`、`H24`，关键词检索往往比纯向量检索更稳。

### 向量检索

向量检索擅长找“虽然字面不同，但语义接近”的内容。

它特别适合：

- 同义改写
- 口语化提问
- 问题和文档表述不一致
- 想找“意思相关”的片段

比如用户问“无人车升级前车端要做哪些校验”，文档可能写的是“升级前置检查”或“刷写前条件校验”，这时向量检索更容易召回。

### 混合检索

混合检索就是把关键词检索和向量检索结合起来。

一句话理解：

> 关键词检索保底命中专有词，向量检索负责补足语义相关性。

很多真实系统最后都会走到混合检索，因为它比“只做一种检索”更稳。

### Rerank

`Rerank` 解决的问题不是“多找一点”，而是“把已经找回来的候选结果重新排好顺序”。

它通常在这一步出现：

```text
先召回 20~100 条候选
→ 用 rerank 模型重新判断谁最相关
→ 只保留前几条给大模型
```

它特别适合解决：

- 初召回结果太杂
- top3 里混入边缘相关内容
- 多个片段都提到同一主题，但重点不同
- 真正回答问题的片段没有排在最前面

所以你可以先这样记：

- **关键词检索**：解决“专有词必须命中”
- **向量检索**：解决“语义相近也要找出来”
- **混合检索**：解决“只靠一种检索不稳”
- **Rerank**：解决“找回来之后排序还不够准”

## 410. 切分策略为什么直接影响效果

RAG 不是把文档一股脑丢进向量库就结束了，切分策略本身就是质量核心。

### chunk 太大

如果 chunk 太大：

- 一个 chunk 里会混很多主题
- 检索命中了，但真正有用的信息只占很小一部分
- 最终拼进 prompt 时噪音很多

### chunk 太小

如果 chunk 太小：

- 语义上下文容易断裂
- 一条完整流程被拆散
- 检索到单句话时，模型看不懂前后条件

### overlap 的作用

`chunk_overlap` 的意义，是让相邻 chunk 共享一部分上下文，减少“关键句被切断”的问题。

所以切分时，你真正要思考的是：

- 这份文档是按段落切还是按标题切
- 一段业务流程会不会被截断
- 一个 chunk 里是否只保留一个相对完整的语义单元

## 411. Embedding、向量库、Retriever 分别负责什么

这 3 个概念很容易混在一起，但它们分工不同。

### Embedding

负责把文本变成向量。

它解决的是：

> 如何把“文本”变成程序能比较相似度的表示。

### Vector Store

负责存这些向量，并提供相似度查询能力。

它解决的是：

> 这些向量放哪儿，以及怎么高效查找相似内容。

### Retriever

负责把“用户问题”变成一次可执行的检索动作。

它解决的是：

> 当用户提问时，我到底用什么规则，从库里拿出哪些片段。

所以可以把它们记成：

```text
Embedding = 把文本变成向量
Vector Store = 把向量存起来并支持查询
Retriever = 定义怎么查、查多少、返回什么
```

## 412. 一个很典型的 Agentic RAG 实战案例

你前面让我分析的 CatPaw 日志，其实就展示了一个很典型的 `Agentic RAG` 过程。

它不是程序写死“先查一次向量库”，而是模型自己决定：

1. 先用 `km_search` 搜 `无人车 OTA 流程`
2. 从搜索结果里拿到知识库页面线索，再尝试 `web_fetch`
3. 发现直接抓页面内容受限或信息不够完整
4. 再次改写查询词，继续用 `km_search` 搜更具体的词，比如 `整车 OTA 升级 流程 无人车`
5. 把多轮搜索拿到的信息综合起来，再组织最终答案

这个案例特别值得记住，因为它说明真实系统里常见的不是：

```text
查一次
→ 成功
→ 结束
```

而更像是：

```text
先粗搜
→ 发现信息不够
→ 改写关键词
→ 再检索
→ 组合多来源结果
→ 回答
```

这就是为什么我前面一直强调：

- 小型 RAG 常常只有“检索一次”
- 企业级 RAG 往往会出现“多轮检索、查询改写、结果过滤、排序重组”
- Agent 系统里的 RAG，常常会演化成模型驱动的动态检索流程

## 413. 为什么这个案例不是经典 RAG，而是 Agentic RAG

你前面问过一个很关键的问题：

> 我给你的那个事例，是经典 RAG，还是 Agentic？

更准确地说：

> **这个案例属于 Agentic RAG，不是典型的经典 RAG。**

原因很明确，因为它具备下面几个典型特征：

- **模型自己决定何时检索**，不是程序写死“用户一问就固定查一次”
- **模型自己决定检索什么**，会根据结果继续改写关键词
- **模型会连续调用多个工具**，而不是只走一个固定 retriever
- **发现信息不够后会继续搜索**，不是一次检索结束就直接回答
- **最终答案来自多轮检索结果的综合**

如果把这两类流程对比一下，就会很清楚。

经典 RAG 更像：

```text
用户问题
→ 程序固定去检索器查 topk
→ 把结果拼进 prompt
→ 模型回答
```

而这个案例更像：

```text
思考
→ 调工具检索
→ 观察结果
→ 发现不够
→ 改写查询
→ 再检索
→ 最终回答
```

所以这个案例如果一句话下结论，就是：

> **它不是“固定检索链路的经典 RAG”，而是“基于工具调用、多轮修正检索的 Agentic RAG”。**

## 414. 为什么这里不用固定检索链路的经典 RAG

这个问题的核心，其实不是“能不能查”，而是：

> **系统在一开始并不知道，应该怎么查才最容易拿到完整答案。**

而经典 RAG 更适合的前提通常是：

- 去哪个知识源查，已经确定
- 用什么检索方式查，已经确定
- 查几条，已经确定
- 一次召回后，大概率就足够回答

也就是说，经典 RAG 适合的是：

> **我已经知道该怎么查。**

但你前面给的无人车 OTA 例子，不满足这个前提。

### 1. 用户问题本身偏宽泛

比如“查询一下无人车 OTA 的流程”，这类问题并不够窄。
它可能包含：

- 总体流程
- 整车 OTA 升级流程
- 车端刷写链路
- 任务下发与校验机制

如果一开始就固定成：

```text
直接检索 top3
→ 直接回答
```

很容易只拿到“沾边但不够完整”的内容。

### 2. 信息可能分散在多个文档、多个层次

真实企业知识库里，常常不是一篇文档把所有答案写全，而是：

- 一篇讲总体流程
- 一篇讲整车 OTA
- 一篇讲 UDS 刷写
- 一篇讲车端校验
- 一篇讲任务下发

这种场景下，一次固定召回未必够，系统往往需要：

```text
先找到总入口
→ 发现细节不够
→ 再搜更具体的步骤
→ 组合多个来源
```

### 3. 检索过程中会出现“信息不足”或“抓取受限”

你前面分析的日志里，就不是一路顺畅拿到完整内容，而是：

- 先 `km_search`
- 再 `web_fetch`
- 发现抓取内容受限或信息不够
- 再改搜索词继续查

这说明系统需要做的不只是“检索增强”，而是：

- 判断结果是否可读
- 判断结果是否完整
- 判断当前工具是否合适
- 判断是否需要换个关键词继续查

这已经不是单纯的 retrieval，而是 retrieval decision。
而**检索决策**本身，就是 Agent 能力的一部分。

### 4. 查询词需要动态改写

这个案例里最能区分两者的一点，就是查询词不是固定不变的。

日志里出现的是类似这样的过程：

- `无人车 OTA 流程`
- `整车 OTA 升级 流程 无人车`
- 再继续补更具体的链路和步骤

也就是说，系统在做的是：

> **根据上一轮结果，动态生成下一轮检索词。**

这更像一个研究员查资料，而不是一条固定流水线。

### 5. 检索源本身就是多个工具

这个案例里并不是只连一个向量库 retriever，而是组合了多个工具：

- `km_search`
- `web_fetch`

一旦检索源变成多个外部工具，系统要做的就不再只是“从库里取 chunk”，而是：

- 先选工具
- 再决定参数
- 再看结果
- 再决定后续是否继续调用别的工具

这时整个系统就天然更像 Agent，而不是经典 RAG 流水线。

## 415. 什么时候该用经典 RAG，什么时候该上 Agentic RAG

这个问题最好记一句最核心的话：

> **如果“怎么查”是确定的，用经典 RAG。**
> **如果“怎么查”本身也需要边判断边决定，用 Agentic RAG。**

### 更适合经典 RAG 的场景

经典 RAG 最适合下面这类问题：

- 问题类型比较稳定
- 知识源比较明确
- 一次检索通常就够
- 检索路径可以提前设计好
- 你更在意稳定性、成本和响应速度

比如：

- “员工请假制度是什么？”
- “接口 A 的参数有哪些？”
- “这份手册里怎么配置数据库连接？”
- “根据知识库，解释一下某个术语”

这类问题的共同点是：

- 问法虽然会变化，但本质是固定问答
- 资料来源清晰
- 一次召回大概率能拿到主要答案

所以经典 RAG 就很合适：

```text
问题
→ 检索 topk
→ 拼 prompt
→ 回答
```

### 更适合 Agentic RAG 的场景

Agentic RAG 更适合下面这类问题：

- 问题比较宽泛或开放
- 信息可能分散在多个系统、多份文档中
- 一次检索经常不够
- 需要查询改写、逐步缩小范围
- 需要模型自己决定是否继续搜索、换工具、换路径

比如：

- “帮我梳理无人车 OTA 的完整流程”
- “分析这个线上故障可能涉及哪些系统，并找出证据”
- “对比两个方案的差异，并补充相关规范依据”
- “先找知识库，没有再去网页或别的系统补资料”

这类问题的共同点是：

- 不确定性更高
- 信息分散
- 检索过程本身需要推理与调整

这时更适合：

```text
问题
→ 判断先用哪个工具
→ 看结果够不够
→ 不够就调整查询
→ 再检索
→ 再观察
→ 最终回答
```

## 416. 一个最好记的选型口诀

你可以把两者理解成两种“查资料方式”。

### 经典 RAG

像一个提前写好 SOP 的文员：

- 收到问题
- 按固定规则查几条
- 交给模型回答

优点是：

- 稳定
- 简单
- 成本可控

缺点是：

- 不够灵活
- 遇到复杂问题容易查不全

### Agentic RAG

像一个会自己判断的研究员：

- 先查
- 看看够不够
- 不够再换词
- 再查别的来源
- 最后汇总

优点是：

- 灵活
- 适合复杂问题
- 能处理多轮检索与多工具协作

缺点是：

- 系统更复杂
- 成本更高
- 延迟更大
- 更依赖工具设计与约束

所以最后把它压缩成一句口诀：

```text
已知怎么查，用经典 RAG
查的过程也要边想边定，用 Agentic RAG
```

这句话虽然朴素，但在实际选型里非常好用。

## 417. LangChain 里，ChatPromptTemplate + Runnable 怎么把经典 RAG 串起来

你现在已经知道最基础的链长这样：

```python
chain = prompt | model | parser
```

这里面：

- `ChatPromptTemplate` 负责把变量组织成 prompt
- `model` 负责生成回答
- `parser` 负责把输出整理成你想要的格式

那如果放到**经典 RAG**里，核心变化只有一个：

> **在 prompt 前面，先多一个“去检索资料”的步骤。**

所以从 Runnable 视角看，经典 RAG 本质上就是：

```text
question
→ retriever
→ docs
→ context
→ prompt
→ model
→ parser
```

也就是说：

- `retriever` 先根据问题取回相关文档
- 再把文档格式化成 `context`
- `ChatPromptTemplate` 把 `context + question` 组装成最终提示词
- 然后再交给模型回答

## 418. 先把每个角色分清楚

如果你总觉得 Runnable 链一长就乱，最好的办法就是先记住每个对象到底干什么。

### 1. `retriever`

负责查资料。

输入：

- 用户问题 `question`

输出：

- 一组相关文档 `docs`

### 2. `format_docs`

负责把文档列表整理成字符串上下文。

因为 `ChatPromptTemplate` 最终通常吃的是字符串变量，而不是一堆 `Document` 对象。

比如它会把：

```python
[doc1, doc2, doc3]
```

变成：

```text
文档1内容

文档2内容

文档3内容
```

### 3. `ChatPromptTemplate`

负责把 `context` 和 `question` 拼成提示词。

比如：

- system: 你是一个基于资料回答问题的助手
- human: 基于下面资料回答问题...

### 4. `Runnable`

负责把这些步骤像管道一样串起来。

你可以把它理解成：

- 上一步输出，变成下一步输入
- 每个组件都像一个可调用节点
- 最后形成一条完整的数据流

## 419. 最小可理解代码

下面这段就是最典型的“`ChatPromptTemplate + Runnable` 串经典 RAG”的形态：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

model = ChatOpenAI(model="gpt-4o-mini")
retriever = vectorstore.as_retriever()
parser = StrOutputParser()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个问答助手。只能基于提供的资料回答；如果资料不足，就明确说不知道。"),
    ("human", "资料如下：\n{context}\n\n问题：{question}")
])

chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough(),
    }
    | prompt
    | model
    | parser
)

result = chain.invoke("什么是 Runnable？")
print(result)
```

这段代码最值得你注意的是中间这块：

```python
{
    "context": retriever | format_docs,
    "question": RunnablePassthrough(),
}
```

它的意思不是“普通 Python 字典”那么简单，而是：

- 输入进来一个问题
- 这份输入同时走两条支路
- 一条支路进 `retriever | format_docs`，生成 `context`
- 另一条支路原样保留，生成 `question`
- 最后把两路结果合成一个字典，交给 `prompt`

也就是说，当你调用：

```python
chain.invoke("什么是 Runnable？")
```

中间实际发生的是：

```text
"什么是 Runnable？"
→ retriever 检索
→ format_docs 拼成 context
→ 同时保留原问题 question
→ prompt 收到 {context, question}
→ model 回答
→ parser 转成字符串
```

## 420. 为什么这里要用 RunnablePassthrough

很多人第一次看到这里最懵的就是：

> 为什么 `question` 不直接写死，还要 `RunnablePassthrough()`？

原因是：

- 这个链的原始输入就是用户问题
- `context` 需要基于这个问题去检索
- `prompt` 又需要保留这个原始问题本身

所以我们要把同一个输入拆成两路：

- 一路去检索，生成 `context`
- 一路原样传下去，作为 `question`

而 `RunnablePassthrough()` 的作用就是：

> **把输入原封不动地继续往后传。**

如果不用它，你就得自己手工包装输入结构。
而用了它，LangChain 就能很自然地把同一份输入同时送给不同分支。

## 421. 你可以把它理解成“给 prompt 准备参数”

`ChatPromptTemplate` 本质上是在等一个这样的输入：

```python
{
    "context": "检索出来的资料文本...",
    "question": "什么是 Runnable？"
}
```

所以 Runnable 链前半段真正做的事，其实就是：

> **把原始问题加工成 prompt 需要的参数字典。**

也就是说，经典 RAG 不是神秘的黑盒，它只是多了一个“准备 `context` 参数”的步骤。

如果再压缩一下，你可以把它记成：

```text
普通链：
question → prompt → model → parser

经典 RAG 链：
question → 检索出 context
question + context → prompt → model → parser
```

## 422. 为什么 ChatPromptTemplate 在经典 RAG 里很关键

很多人学 RAG 时只盯着向量库，但其实 `ChatPromptTemplate` 也非常关键。

因为它决定了模型到底如何使用检索结果。

比如下面这两种 prompt，效果可能差很多。

### 写得比较稳的版本

```text
请只基于提供的资料回答问题。
如果资料中没有答案，就明确说明不知道，不要自己补充。
```

### 写得比较松的版本

```text
参考以下资料回答问题。
```

区别在于：

- 前者更能约束模型不要胡编
- 后者更容易让模型把自己已有知识也混进去

所以在经典 RAG 里，`ChatPromptTemplate` 不只是“拼字符串”，它实际上在定义：

- 模型怎么使用检索上下文
- 资料不足时应该怎么表现
- 回答风格和边界是什么

## 423. 你现在应该怎样理解这条链

如果用最朴素的话说，`ChatPromptTemplate + Runnable` 串经典 RAG，其实就是四步：

1. 收到用户问题
2. 用这个问题去 retriever 里查资料
3. 把资料和原问题一起塞进 `ChatPromptTemplate`
4. 再走 `model | parser` 输出最终答案

所以你完全可以把它背成下面这个公式：

```text
经典 RAG = (retriever + 上下文组装) + (prompt + model + parser)
```

前半段负责“找资料”，后半段负责“基于资料回答”。

## 424. 一段更像工程代码的拆开写法

如果你觉得链式写法太抽象，也可以先看拆开版，这样更容易理解：

```python
question = "什么是 Runnable？"

docs = retriever.invoke(question)
context = format_docs(docs)

prompt_value = prompt.invoke({
    "context": context,
    "question": question,
})

response = model.invoke(prompt_value)
answer = parser.invoke(response)

print(answer)
```

你会发现，这和前面的 Runnable 链其实是同一件事，只是展开写了。

所以你可以这样理解：

- **拆开写**：更容易学会数据流
- **链式写**：更适合真实工程组合

等你把这个理解透了，再看 LangChain 里的各种 RAG chain，你就不会再觉得它们神秘了。

## 425. 从“最小经典 RAG 链”升级到“带 source 引用”的版本

前面的最小链只做一件事：

- 检索资料
- 生成答案

也就是最后输出通常只有一个字符串：

```python
answer = chain.invoke(question)
```

但真实工程里，很多时候你还需要让系统把**答案是基于哪些资料得出来的**一起返回。

因为这样才能解决几个非常实际的问题：

- 用户想追溯答案依据
- 前端想展示“参考来源”
- 方便人工校验模型有没有乱答
- 后续可以做点击跳转、片段高亮、文档预览

所以经典 RAG 在工程里经常不是只返回：

```python
"最终答案"
```

而是返回这种结构：

```python
{
    "answer": "最终答案",
    "sources": [...]
}
```

## 426. 为什么最小链默认不会带 source

你先注意一个关键点。

前面的最小链大致是这样：

```text
question
→ retriever
→ docs
→ format_docs
→ context
→ prompt
→ model
→ parser
→ answer
```

问题就在这里：

> **一旦 `docs` 被 `format_docs` 变成纯文本 `context`，原始文档对象本身就很容易“丢了”。**

而 source 引用通常恰恰要依赖原始文档对象里的信息，比如：

- `doc.metadata["source"]`
- `doc.metadata["title"]`
- `doc.metadata["url"]`
- `doc.metadata["page"]`

所以要想返回引用来源，思路不是更复杂的模型推理，而是：

> **在链里把“给模型看的 context”和“给程序保留的 docs”同时留下来。**

## 427. 最关键的升级点：不要只传 context，要把 docs 也保留下来

最小链里，常见写法是：

```python
{
    "context": retriever | format_docs,
    "question": RunnablePassthrough(),
}
```

这个写法足够回答问题，但不够做 source 引用。

如果要升级，常见思路是把它改成：

```python
{
    "question": RunnablePassthrough(),
    "docs": retriever,
}
```

先把原始 `docs` 留住，然后再往后派生出：

- 给 prompt 用的 `context`
- 给最终结果用的 `sources`

你可以把这个变化理解成：

```text
以前：
question → 直接变成 context → 去回答

现在：
question → 先拿到 docs
        → docs 一路变成 context 给模型
        → docs 另一路提取 metadata 给 sources
```

## 428. 一个最小可用的“答案 + sources”版本

下面这段代码，是在你前面那条最小经典 RAG 链基础上，最容易理解的一种升级写法：

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnablePassthrough

model = ChatOpenAI(model="gpt-4o-mini")
retriever = vectorstore.as_retriever()
parser = StrOutputParser()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def extract_sources(docs):
    results = []
    for doc in docs:
        results.append({
            "source": doc.metadata.get("source", "unknown"),
            "title": doc.metadata.get("title"),
            "page": doc.metadata.get("page"),
        })
    return results


prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个问答助手。只能基于提供的资料回答；如果资料不足，就明确说不知道。"),
    ("human", "资料如下：\n{context}\n\n问题：{question}")
])

answer_chain = (
    {
        "context": lambda x: format_docs(x["docs"]),
        "question": lambda x: x["question"],
    }
    | prompt
    | model
    | parser
)

rag_with_sources = (
    {
        "question": RunnablePassthrough(),
        "docs": retriever,
    }
    | {
        "answer": answer_chain,
        "sources": lambda x: extract_sources(x["docs"]),
    }
)

result = rag_with_sources.invoke("什么是 Runnable？")
print(result)
```

它最后返回的就不再只是字符串，而更像：

```python
{
    "answer": "Runnable 是 LangChain 里用来组织可调用步骤的统一抽象...",
    "sources": [
        {"source": "docs/langchain_intro.md", "title": "LangChain 入门", "page": 3},
        {"source": "docs/rag.md", "title": "RAG 说明", "page": 1},
    ],
}
```

## 429. 这条升级链到底是怎么流动的

如果你觉得上面的代码比最小链复杂很多，别急，先只看数据流。

它本质上是这样：

```text
question
→ retriever
→ docs
→ 分成两路
   → 一路 format_docs，给 prompt 生成 answer
   → 一路 extract_sources，提取来源列表
→ 最后合并成 {answer, sources}
```

也就是说，这次不是只做一条线，而是：

- 一条线给模型回答
- 一条线给程序整理引用

最后再把两条线的结果合并。

## 430. 为什么这里要引入 RunnableLambda

你会发现，上面的升级版本里比之前多了一个东西：

- `RunnableLambda`

它适合做这种事情：

- 写一点轻量的数据加工逻辑
- 把普通 Python 函数接进 Runnable 链
- 在链中处理字典结构、提取字段、格式转换

虽然上面的示例里我用了 `lambda`，但在真实工程里，你也经常会把这些步骤显式写成 `RunnableLambda(...)`，这样可读性更高。

例如：

```python
from langchain_core.runnables import RunnableLambda

build_context = RunnableLambda(lambda x: {
    "context": format_docs(x["docs"]),
    "question": x["question"],
})

build_sources = RunnableLambda(lambda x: extract_sources(x["docs"]))
```

然后再接到链里。

所以你可以把 `RunnableLambda` 理解成：

> **把“普通 Python 数据处理函数”包装成 LangChain 链里的一个节点。**

## 431. source 一般从哪里来

source 引用并不是模型凭空生成的，通常来自文档本身的 `metadata`。

比如在切文档、入库时，你往往会给每个 `Document` 带上这些信息：

```python
Document(
    page_content="Runnable 是 LangChain 的基础抽象...",
    metadata={
        "source": "docs/langchain_intro.md",
        "title": "LangChain 入门",
        "page": 3,
        "url": "https://example.com/langchain_intro",
    },
)
```

这样 retriever 召回这些文档时，程序就可以直接读取：

- 来源文件
- 标题
- 页码
- URL

所以要想让 RAG 支持 source 引用，一个很重要的前置条件就是：

> **入库时就把 metadata 设计好。**

如果你的向量库里只有 `page_content`，没有来源信息，那后面就很难优雅地展示引用。

## 432. 一种更适合前端展示的 sources 结构

工程里，`sources` 最好不要只返回一串字符串。

更常见的是返回结构化对象，比如：

```python
[
    {
        "id": 1,
        "title": "LangChain 入门",
        "source": "docs/langchain_intro.md",
        "page": 3,
        "snippet": "Runnable 是 LangChain 的基础抽象...",
    },
    {
        "id": 2,
        "title": "RAG 说明",
        "source": "docs/rag.md",
        "page": 1,
        "snippet": "RAG 的核心流程是检索、增强、生成...",
    },
]
```

这样做的好处是：

- 前端能直接渲染引用卡片
- 可以给每条来源编号
- 可以展示文档标题和摘要片段
- 可以支持跳转到原文位置

所以很多时候你真正要设计的不是“有没有 source”，而是：

> **source 返回结构应该长什么样。**

## 433. 只让模型回答，不让模型编引用

这里有一个非常重要的工程原则：

> **source 最好由程序从 `docs.metadata` 里提取，而不是让模型自己编。**

因为如果你让模型自己输出：

- 它可能会伪造文件名
- 可能会混淆页码
- 可能会把没检索到的内容说成引用来源

所以比较稳的做法是：

- 模型只负责生成 `answer`
- 程序负责从召回的 `docs` 里整理 `sources`

也就是说：

- `answer` 来自 LLM
- `sources` 来自程序逻辑

这个边界非常值得记住。

## 434. 你可以把这次升级理解成什么

从学习角度看，这次升级并不是“学了一个全新 RAG”，而只是把之前那条链再往工程化推了一步。

最小链是：

```text
question → retriever → context → prompt → answer
```

升级后是：

```text
question → retriever → docs
→ docs 生成 context → prompt → answer
→ docs 提取 metadata → sources
→ 最后合并成结果
```

所以你可以把这一步记成一句话：

```text
最小 RAG 只回答问题
工程 RAG 还要把“答案依据”一起返回
```

这就是“带 source 文献引用”的核心升级。

## 435. 下一个真正关键的流程：多轮对话 RAG

如果你觉得 source 引用不是当前最关键的，那下一步最值得学的，就不是继续折腾引用格式，而是：

> **怎么让 RAG 在多轮对话里仍然能正确检索。**

因为真实用户不会永远把问题问得很完整。

更常见的是这种连续对话：

- “什么是 Runnable？”
- “它和 Chain 有什么区别？”
- “那在 RAG 里怎么用？”
- “刚才那个例子再解释一下”

这时候如果你还用最小经典 RAG：

```text
question → retriever → context → prompt → answer
```

retriever 看到的往往只有最后一句：

- `那在 RAG 里怎么用？`

问题是，检索器根本不知道这里的“它”到底是谁。

所以多轮对话场景里，真正关键的不是“直接检索”，而是：

> **先把当前问题改写成一个独立、完整、适合检索的问题，再去查资料。**

## 436. 为什么单轮 RAG 一到多轮对话就容易失效

单轮经典 RAG 默认有一个隐藏前提：

> **当前这一轮的用户输入，本身已经足够清楚。**

比如用户直接问：

- `什么是 Runnable？`

这时 retriever 很容易查到相关内容。

但多轮对话里，用户经常会说：

- `它和 Chain 有什么区别？`
- `那这个在 RAG 里怎么用？`
- `再展开讲一下`

这些句子对人类来说没问题，因为人类会自动结合上下文。
但对 retriever 来说，它只看到一段短文本，缺少关键主语、背景和约束。

于是就容易出现几种问题：

- 检索词太短，召回不准
- “它”“这个”“刚才那个”没有指代解析
- 用户真正问的是上文概念，但 retriever 只按字面查
- 多轮上下文里有约束条件，检索时却丢了

所以多轮对话 RAG 的第一步，不是直接去查，而是先做：

- **query rewrite**
- 或者说 **history-aware retrieval**

## 437. 多轮对话 RAG 的核心数据流

你可以先记住这条链：

```text
chat_history + question
→ rewrite question
→ retriever
→ docs
→ context
→ prompt
→ answer
```

也就是说，它和单轮 RAG 相比，多出来的关键步骤只有一个：

> **在检索前，先根据历史对话重写当前问题。**

例如：

```text
历史：什么是 Runnable？
当前：那它在 RAG 里怎么用？
```

系统不会直接拿：

```text
那它在 RAG 里怎么用？
```

去检索。

而是会先改写成更适合搜索的独立问题，比如：

```text
Runnable 在 RAG 里怎么用？
```

这样 retriever 才更容易召回正确资料。

## 438. 你可以把它理解成“两套 prompt”

很多人第一次学多轮对话 RAG 会晕，是因为他以为只有一个 prompt。
其实这里通常至少有两套提示词。

### 第一套：改写检索问题的 prompt

它的作用不是回答用户，而是把：

- 历史对话
- 当前问题

合成一个**适合检索的独立 query**。

比如它做的事是：

```text
把“那它在 RAG 里怎么用？”
改写成
“Runnable 在 RAG 里怎么用？”
```

### 第二套：最终回答的 prompt

这套才是真正给模型回答用的。

它会接收：

- 检索出来的 `context`
- 当前用户问题 `question`
- 有时还会接收 `chat_history`

也就是说，多轮对话 RAG 不是一个 prompt 从头包打天下，而是：

- 一个 prompt 负责“改写查询”
- 一个 prompt 负责“基于资料回答”

## 439. LangChain 里这个流程为什么自然

你前面已经学过两个很关键的东西：

- `ChatPromptTemplate`
- `MessagesPlaceholder`

而它们正好就是多轮对话 RAG 的基础。

因为这个流程天然需要把：

- 历史消息
- 当前问题

一起喂给模型。

这时候 `MessagesPlaceholder` 就特别适合拿来放 `chat_history`。

你可以先从概念上这样理解：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

rewrite_prompt = ChatPromptTemplate.from_messages([
    ("system", "请结合历史对话，把用户当前问题改写成一个独立、明确、适合检索的问题。不要回答，只做改写。"),
    MessagesPlaceholder("chat_history"),
    ("human", "{question}")
])
```

这个 prompt 的目标不是输出答案，而是输出一个**改写后的检索问题**。

## 440. 最小可理解版本：先改写，再检索，再回答

你可以先不背 API，先看最朴素的数据流：

```python
chat_history = [
    HumanMessage(content="什么是 Runnable？"),
    AIMessage(content="Runnable 是 LangChain 里的可调用抽象。"),
]

question = "那它在 RAG 里怎么用？"

standalone_question = rewrite_chain.invoke({
    "chat_history": chat_history,
    "question": question,
})

docs = retriever.invoke(standalone_question)
context = format_docs(docs)

answer = answer_chain.invoke({
    "chat_history": chat_history,
    "question": question,
    "context": context,
})
```

它做的事其实很朴素：

1. 先结合历史把问题改写清楚
2. 再拿改写后的问题去检索
3. 最后把检索结果交给回答链

所以多轮对话 RAG 的本质不是“更神秘”，而是：

> **在检索前加了一步“把当前问题说完整”。**

## 441. LangChain 里的常见实现思路

如果你把 LangChain 的思路拆开看，多轮对话 RAG 一般分成两段：

### 第一步：history-aware retriever

作用：

- 读取 `chat_history`
- 读取当前问题
- 生成一个适合检索的 standalone question
- 再去调用 retriever

### 第二步：retrieval chain

作用：

- 接收 retriever 返回的 docs
- 组装 context
- 再调用回答 prompt + model

所以你可以把它理解成：

```text
history-aware retriever
+
question-answer chain
```

这两段组合起来，才是完整的多轮对话 RAG。

## 442. 一段更接近 LangChain 习惯的代码形态

如果你后面开始接 LangChain 内置函数，你大概率会看到类似这种结构：

```python
from langchain_openai import ChatOpenAI
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

llm = ChatOpenAI(model="gpt-4o-mini")
retriever = vectorstore.as_retriever()

rewrite_prompt = ChatPromptTemplate.from_messages([
    ("system", "请结合历史对话，把用户当前问题改写成一个独立、明确、适合检索的问题。不要回答。"),
    MessagesPlaceholder("chat_history"),
    ("human", "{input}"),
])

history_aware_retriever = create_history_aware_retriever(
    llm,
    retriever,
    rewrite_prompt,
)

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个问答助手。请只基于提供的资料回答问题；如果资料不足，就明确说不知道。"),
    MessagesPlaceholder("chat_history"),
    ("human", "资料如下：\n{context}\n\n问题：{input}"),
])

qa_chain = create_stuff_documents_chain(llm, qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, qa_chain)

result = rag_chain.invoke({
    "input": "那它在 RAG 里怎么用？",
    "chat_history": chat_history,
})
```

你现在不用死记这些函数名，先记住它们背后的职责分工就够了：

- `create_history_aware_retriever`：先改写问题，再检索
- `create_stuff_documents_chain`：把 docs 塞进 prompt 去回答
- `create_retrieval_chain`：把前后两段串起来

## 443. 为什么这里的 chat_history 不一定直接参与检索

这里有个细节很容易误解。

很多人会想：

> 既然有历史对话，那是不是直接把整段历史丢给 retriever 就行？

通常不这么做。

更常见的思路是：

- 先让模型读取历史
- 产出一个更干净的 standalone question
- 再用这个 standalone question 去检索

原因是：

- 原始聊天记录往往很啰嗦
- 里面混有寒暄、追问、代词、省略句
- 直接拿去检索，噪音很大

所以真正被送进 retriever 的，往往不是整段聊天记录，而是：

> **由聊天记录改写出来的、更适合搜索的问题。**

## 444. 什么时候一定要上多轮对话 RAG

如果你的产品有这些特征，就很适合尽早引入这个流程：

- 用户是连续聊天，不是单次搜索
- 用户经常用“它 / 这个 / 刚才那个”来追问
- 问题需要承接上一轮上下文
- 你发现单轮检索经常召回错内容

反过来，如果你的场景就是一次一问一答、没有上下文依赖，那单轮经典 RAG 就够了。

所以它不是“高级才用”，而是：

> **只要产品形态是聊天式问答，多轮对话 RAG 很快就会变成刚需。**

## 445. 你现在可以怎么记这个流程

把它压缩成一句最好记的话：

```text
单轮 RAG：直接拿问题去查
多轮对话 RAG：先把问题说完整，再去查
```

或者再工程一点：

```text
chat_history + current_question
→ standalone_question
→ retriever
→ context
→ answer
```

如果你把这条链吃透，后面再看 query rewrite、history-aware retriever、conversational RAG，这些词本质上都在说同一件事。

## 446. 再下一步：不是只会查，而是要学会“查得更准”

到这里，你已经理解了两件很重要的事：

- 单轮 RAG：怎么把问题接进 retriever
- 多轮对话 RAG：怎么先把问题说完整，再去检索

那再下一步，真正该学的就不是“还能不能查”，而是：

> **怎么让检索结果更准、更稳、更适合最终回答。**

因为在真实系统里，很多时候问题并不是“完全查不到”，而是：

- 查到了很多沾边内容
- 但最关键的片段没排在前面
- 或者专有词没命中
- 或者召回范围太散，最后回答不稳

所以这一步的关键词就是：

- `query rewrite`
- `hybrid search`
- `rerank`

## 447. 你可以把它理解成“检索前、检索中、检索后”的三段优化

这几个词很多人一开始会觉得散，其实把位置放对了，就很容易理解。

### 1. 检索前：Query Rewrite

先把用户问题改写得更适合检索。

解决的是：

- 原问题太口语化
- 太短
- 有代词
- 用词和文档不一致
- 关键信息没表达完整

也就是说，它优化的是：

> **查之前，先把问题改好。**

### 2. 检索中：Hybrid Search

检索时，不只走一种方式，而是组合：

- 关键词检索
- 向量检索

解决的是：

- 专有词必须命中
- 语义相近内容也要召回
- 只靠一种检索方式不稳

也就是说，它优化的是：

> **查的时候，不要只靠一条路。**

### 3. 检索后：Rerank

先粗召回一批候选，再重新排序。

解决的是：

- 初召回结果太杂
- 真正关键片段没排在前面
- topk 里混入边缘相关内容

也就是说，它优化的是：

> **查回来之后，再把最有用的内容排到前面。**

如果把这三步串起来，你就会发现它们其实是在优化同一件事：

```text
Query Rewrite：先把问题改好
Hybrid Search：把可能相关的尽量找全
Rerank：再把真正最相关的排前面
```

## 448. 一个更像真实工程的检索链

最小 RAG 链常常是：

```text
question
→ retriever
→ topk docs
→ prompt
→ answer
```

但真实系统里，更常见的是：

```text
question
→ rewrite query
→ hybrid search
→ candidates
→ rerank
→ top docs
→ prompt
→ answer
```

你可以看到，这里并没有推翻经典 RAG。
而是在“问题进 retriever”这件事前后，加了几层优化。

所以更准确地说：

> **检索优化，不是另一个新体系，而是经典 RAG 的强化版。**

## 449. Query Rewrite 到底在优化什么

你前面刚学过多轮对话 RAG，所以最好先把 `query rewrite` 和它关联起来。

其实它们是同一家族的能力。

例如用户问：

- `那它在 RAG 里怎么用？`

如果系统直接检索，很弱。
但如果先改写成：

- `Runnable 在 RAG 里怎么用？`

召回就会明显更准。

再比如用户问：

- `无人车升级前要做哪些检查？`

文档里写的可能不是“检查”，而是：

- `前置校验`
- `刷写前条件`
- `升级前置检查`

这时候 query rewrite 也可以把用户问题改成更接近知识库写法的形式。

所以 query rewrite 不只是“把句子改一改”，它本质上在做的是：

- 补全主语
- 消解代词
- 对齐知识库术语
- 把口语问法改成检索友好问法

## 450. Hybrid Search 为什么几乎是企业场景常客

如果你只做向量检索，经常会遇到一个问题：

- 语义相关能找到
- 但专有词不一定稳

比如：

- 错误码
- 接口名
- 产品代号
- 版本号
- 缩写词

这类东西往往要求**字面必须命中**。

但如果你只做关键词检索，又会遇到另一个问题：

- 字面一样的能找到
- 字面不一样但意思相近的找不到

所以很多企业系统最后都会落到：

> **关键词检索负责兜底专有词，向量检索负责补足语义召回。**

这就是混合检索。

也可以把它记成一句很实用的话：

```text
关键词检索保“准字面”
向量检索补“近语义”
混合检索做“两手都要”
```

## 451. Rerank 为什么不是可有可无的小优化

很多人第一次做 RAG，会觉得：

- 反正已经 topk 召回了
- 直接把前几个片段喂给模型就行

但真实问题在于：

- 初召回往往只是“可能相关”
- 并不代表排序已经足够好

比如前 10 条候选里：

- 第 1 条只是标题很像
- 第 2 条只是背景说明
- 第 7 条才是真正回答问题的核心片段

如果没有 rerank，你可能就把第 1、2、3 条交给模型了。
这样模型也很难答稳。

所以 rerank 的作用不是“多找一点”，而是：

> **把真正最能回答当前问题的片段，尽量排到最前面。**

这一点在长文档、多文档、企业知识库里尤其关键。

## 452. 这三步在工程上分别解决什么问题

你可以直接记这张简化判断表：

- `Query Rewrite`：解决“问题写得不利于检索”
- `Hybrid Search`：解决“只靠关键词或只靠向量都不稳”
- `Rerank`：解决“召回回来了，但排序还不够准”

如果把它再压缩成一句话：

```text
Rewrite 解决“怎么问”
Hybrid 解决“怎么找”
Rerank 解决“怎么排”
```

这句话在你后面看各种 RAG 架构图时会非常有用。

## 453. 一个最值得记住的完整流程图

你可以把现在学到的东西暂时整成这一条：

```text
用户问题
→ 如果有多轮上下文，先结合历史做 rewrite
→ 用 rewrite 后的问题做 hybrid search
→ 召回一批候选文档
→ 用 rerank 重新排序
→ 取最相关的几个片段
→ 组装 context
→ prompt
→ model answer
```

如果你愿意再压缩一点，也可以记成：

```text
先改写
→ 再混合召回
→ 再重排
→ 再回答
```

这已经非常接近真实工程里的主干检索链了。

## 454. 为什么这一步比“继续学 source 展示”更关键

因为 source 展示主要解决的是：

- 结果可追溯
- 前端可展示
- 人工可检查

而你现在这一步解决的是更根本的问题：

- 召回准不准
- 送给模型的上下文好不好
- 最终答案稳不稳

也就是说：

- source 更偏结果呈现
- 检索优化更偏答案质量本身

所以从学习优先级上，这一步通常比“引用怎么展示”更关键。

## 455. 你现在应该怎样继续往下学

如果按最顺的学习路径走，下一步最适合继续拆开的，通常就是：

1. **先单独讲 Query Rewrite**：它和多轮对话 RAG 是怎么衔接的
2. **再讲 Hybrid Search**：为什么企业资料几乎离不开它
3. **最后讲 Rerank**：为什么粗召回后还要再精排

也就是说，后面的学习顺序可以自然变成：

```text
单轮 RAG
→ 多轮对话 RAG
→ Query Rewrite
→ Hybrid Search
→ Rerank
→ Tool Calling
→ Agentic RAG
```

这个顺序非常顺，因为你是在一层层回答同一个问题：

> **怎样让“检索增强回答”这件事越来越像真实系统。**

## 456. 先记一句总口诀

你可以先把这一段浓缩成一句口诀：

```text
能查到，不等于查得准
查得准，才更容易答得稳
```

这是从“会做 RAG demo”走向“理解真实 RAG 系统”的一个关键转折点。

## 457. Query Rewrite 怎么单独设计 prompt 和流程

前面你已经知道：

- 多轮对话 RAG 里，经常要先把问题改写成 `standalone question`
- 检索优化里，`query rewrite` 属于“检索前优化”

那接下来最值得单独拆开的，就是：

> **Query Rewrite 这个步骤本身，到底应该怎么设计。**

很多人第一次做 rewrite，容易把它理解成“随便让模型换个说法”。
但真实工程里，它不是为了把句子改得更好看，而是为了：

> **把用户问题改成更适合检索系统理解和召回的形式。**

所以 rewrite 的目标不是文学润色，而是检索效果。

## 458. 先记住 Query Rewrite 的核心目标

一个合格的 rewrite，不是“越像人工写作越好”，而是要尽量做到下面几件事：

- 补全省略的主语和背景
- 消解代词，比如“它”“这个”“刚才那个”
- 对齐知识库术语
- 保留用户真正关心的约束条件
- 让问题更适合搜索，而不是更适合聊天

比如用户原问题是：

- `那它在 RAG 里怎么用？`

一个好的 rewrite 可能是：

- `Runnable 在 RAG 里怎么使用？`

而不是：

- `请你详细介绍一下 Runnable 在 RAG 场景中的具体应用方式`

因为后者虽然更像“文章标题”，但并不一定更适合检索。

所以你可以先记一句：

```text
Rewrite 的目标不是“写得漂亮”
而是“查得更准”
```

## 459. Query Rewrite 的输入到底是什么

很多人会下意识觉得，rewrite 的输入只有当前问题。
其实真实情况通常有两类。

### 情况 1：只有当前问题

比如用户单轮提问，但问题很口语：

- `无人车升级前要做哪些检查？`

这时 rewrite 的输入可以只有：

- `question`

模型要做的是把这句话改成更接近知识库写法的检索 query。

### 情况 2：当前问题 + 对话历史

比如用户在连续追问：

- 上一轮：`什么是 Runnable？`
- 当前：`那它在 RAG 里怎么用？`

这时 rewrite 的输入通常就是：

- `chat_history`
- `question`

模型要做的是先理解“它”指什么，再输出独立 query。

所以 query rewrite 的输入边界要想清楚：

> **它不是永远只看 question，而是看你是否需要借助上下文把问题补全。**

## 460. Query Rewrite 的输出应该长什么样

一个常见误区是：

- 让模型输出一大段解释
- 甚至顺手开始回答问题

这都是不理想的。

更稳的做法是让 rewrite 只输出：

- 一个改写后的检索 query
- 或者最多输出少量候选 query

比如理想输出是：

```text
Runnable 在 RAG 里怎么用？
```

而不是：

```text
Runnable 是 LangChain 中的重要抽象。在 RAG 中，它通常用于组织检索和生成链路...
```

因为后一种已经开始回答了，会污染后续检索流程。

所以 rewrite 的输出目标最好非常克制：

> **只产出检索 query，不提前回答。**

## 461. 一个比较稳的 rewrite prompt 应该怎么写

如果你只想先做一个最小可用版本，prompt 通常要明确三件事：

- 你的任务是改写，不是回答
- 要结合历史对话理解当前问题
- 输出必须是独立、清晰、适合检索的问题

例如：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

rewrite_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "你负责把用户当前问题改写成适合检索的独立问题。"
        "请结合历史对话补全代词、省略信息和上下文。"
        "不要回答问题，不要解释，只输出改写后的检索问题。"
    ),
    MessagesPlaceholder("chat_history"),
    ("human", "{question}"),
])
```

这类 prompt 的关键不是花哨，而是边界清楚。

## 462. 一个更工程化的 rewrite prompt 版本

如果你想让它更稳一点，可以把规则写得更明确。

比如：

```python
rewrite_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "你是一个检索查询改写器。"
        "你的任务是把用户当前问题改写成适合知识库检索的独立问题。"
        "如果当前问题已经足够清晰，就尽量少改。"
        "保留原问题中的时间、对象、版本、范围、限制条件。"
        "不要回答，不要扩写成解释，不要虚构新条件。"
        "只输出改写后的问题。"
    ),
    MessagesPlaceholder("chat_history"),
    ("human", "{question}"),
])
```

这段规则里最重要的其实是两条：

- **如果已经清晰，就少改**
- **不要虚构新条件**

因为 rewrite 做得不好，最危险的不是“没改出花来”，而是：

> **把用户原意改歪了。**

## 463. Query Rewrite 最容易犯的 4 个错误

### 错误 1：把 rewrite 做成了回答

这是最常见的问题。

模型一看到问题，就忍不住开始解释。
这样会导致：

- 输出不再适合检索
- 后续 retriever 吃到太长的文本
- 混入模型自己脑补的信息

### 错误 2：改写过度

比如用户原问题已经很清晰：

- `什么是 Runnable？`

这时候最好的 rewrite 很可能就是：

- `什么是 Runnable？`

没必要强行变成：

- `请详细解释 LangChain 中 Runnable 的定义、原理和应用场景`

这会平白引入噪音。

### 错误 3：擅自补充不存在的约束

比如用户只问：

- `无人车 OTA 流程是什么？`

模型却改成：

- `无人车整车 OTA 升级流程和车端刷写流程是什么？`

这里就擅自加了“整车”“车端刷写”这些限定，可能直接改偏了。

### 错误 4：丢掉原问题里的关键限制

比如用户问：

- `H24 版本下 OTA 前置校验流程是什么？`

如果 rewrite 后把 `H24` 丢了，那检索质量会明显下降。

所以 rewrite 不是“随便压缩一下”，而是：

> **该补的补，该保留的保留，不该脑补的绝不乱加。**

## 464. 什么时候该 rewrite，什么时候不该强行 rewrite

不是每个问题都需要强改。

### 更适合 rewrite 的情况

- 问题里有代词、省略、指代
- 多轮对话承接明显
- 用户问法很口语
- 问法和知识库术语差异很大
- 原问题过短，检索信息不足

### 不要强行 rewrite 的情况

- 原问题本身已经很清晰
- 问题里有很明确的专有词、错误码、版本号
- 用户限制条件很多，过度改写容易丢信息

也就是说，rewrite 最好的状态不是“每次都大改”，而是：

> **该改时补全，不该改时尽量保持原样。**

## 465. 你可以怎样验证 rewrite 是不是有帮助

rewrite 不是写完 prompt 就结束，最好还要看它是否真的提升检索效果。

最朴素的验证方法就是对比：

- 原始问题检索结果
- 改写后问题检索结果

比如做这种对照：

```text
原问题：那它在 RAG 里怎么用？
rewrite：Runnable 在 RAG 里怎么用？

比较两边召回的 top5 文档是否更相关
```

你可以重点看这些指标：

- topk 里相关文档是否更靠前
- 召回结果是否更聚焦
- 无关文档是否减少
- 回答是否更稳定

所以 rewrite 最终不是靠“看起来合理”判断，而是看：

> **检索结果有没有因此变得更好。**

## 466. 一个最小可理解流程

如果你把它先写成最朴素的样子，其实就是：

```python
rewrite_query = rewrite_chain.invoke({
    "chat_history": chat_history,
    "question": question,
})

docs = retriever.invoke(rewrite_query)
context = format_docs(docs)

answer = answer_chain.invoke({
    "question": question,
    "context": context,
})
```

这个流程非常值得你记住，因为它其实就是：

```text
原问题
→ 先改写
→ 再检索
→ 再回答
```

你会发现，query rewrite 并没有取代 RAG，它只是让 retriever 前面的输入变得更干净、更完整。

## 467. 这一步和多轮对话 RAG 的关系到底是什么

如果你从学习路径上看，这一章其实就是上一章的细化版。

上一章你学的是：

- 多轮对话 RAG 需要先生成 `standalone question`

这一章你学的是：

- 这个 `standalone question` 到底应该怎么设计 prompt 才更稳

所以你完全可以把它理解成：

> **多轮对话 RAG 是场景，Query Rewrite 是其中一个关键机制。**

它们不是两套互相独立的知识，而是上下层关系。

## 468. 先记一句最重要的话

把这一章最后压成一句最关键的话：

```text
Query Rewrite 不是为了把问题说得更漂亮
而是为了把问题变得更适合检索
```

只要你牢牢记住这句话，后面无论你是自己写 Runnable 链，还是用 LangChain 的 history-aware retriever，本质上都不会偏。

## 469. Hybrid Search 为什么企业资料几乎离不开它

前面你已经知道：

- 关键词检索擅长命中专有词
- 向量检索擅长找语义相近内容
- 混合检索就是把两者结合起来

但如果只停在这个定义层面，还是会觉得它像一个“可选优化项”。

真实情况往往不是这样。

在企业知识库、内部文档、制度资料、技术文档里，`Hybrid Search` 往往不是锦上添花，而是：

> **只要资料一复杂，混合检索很快就会从“可选”变成“刚需”。**

## 470. 企业资料为什么天然不适合只靠一种检索方式

企业资料和教科书式 demo 文本很不一样。

它通常同时具备几种特征：

- 既有大量专有名词，也有大量口语化问法
- 同一个概念有很多不同叫法
- 文档里既有规范术语，也有内部黑话
- 新旧版本并存，命名习惯不统一
- 不同团队写文档的风格差异很大

也就是说，企业资料既有“必须字面命中”的部分，也有“只能靠语义理解”的部分。

而这两类需求恰好对应两种不同检索能力：

- **关键词检索**：保字面命中
- **向量检索**：补语义召回

所以企业知识天然就更容易逼着系统走向混合检索。

## 471. 只做向量检索，为什么经常不够稳

向量检索很强，但它并不是万能的。

在企业场景里，它经常会遇到一些特别典型的问题。

### 1. 专有词必须精确命中

比如：

- 产品代号
- 项目名
- 接口名
- 错误码
- 缩写词
- 版本号
- 制度名

这类词很多时候不是“语义相近就行”，而是：

> **必须命中这个词本身。**

例如用户搜：

- `H24`
- `UDS`
- `OTA`
- `ERR-1024`
- `审批流 V3`

如果只靠向量检索，有时能召回语义相关内容，但不一定能把“真正带这个词的片段”稳定排在前面。

### 2. 内部缩写和黑话太多

企业里经常会有这种情况：

- 一个系统简称只有内部人才懂
- 一个流程有历史叫法和正式叫法两套名称
- 某个项目在 A 团队和 B 团队里叫法不同

这时候，单纯依赖语义相似，容易出现：

- 召回很多“看起来相关”的泛化文本
- 但真正包含那个内部称呼的关键片段没有稳稳命中

### 3. 版本和编号信息很重要

比如用户问：

- `H24 版本下 OTA 前置校验流程`
- `接口 A v2 和 v3 的差异`
- `ERR-1024 的处理规范`

这些问题里，版本号、接口名、错误码不是附属信息，而是核心限定条件。

如果向量检索忽略了这些字面限制，就很容易把“相关但不是这一版”的内容也召回来。

所以只做向量检索时，最常见的问题不是“完全找不到”，而是：

> **找得到相关主题，但不一定找得到正确对象。**

## 472. 只做关键词检索，为什么也不够

反过来，只做关键词检索也有很明显的上限。

### 1. 用户问法和文档写法不一致

用户会问：

- `升级前要做哪些检查？`

但文档里可能写的是：

- `升级前置校验`
- `刷写前条件检查`
- `升级前检查项`

如果只做关键词匹配，很可能因为字面不一致而漏掉本来应该召回的内容。

### 2. 用户问的是口语，文档写的是术语

比如用户问：

- `这个接口限流了怎么办？`

文档里可能写的是：

- `流控策略`
- `限流熔断机制`
- `请求速率保护`

意思相关，但字面未必完全重合。

### 3. 用户不知道标准叫法

真实用户很多时候并不知道知识库里的正式术语。

他问的是：

- `升级前检查`

而文档写的是：

- `前置校验`

如果系统只靠关键词，就相当于要求用户先知道内部标准叫法，这在真实产品里通常不现实。

所以只做关键词检索时，常见问题也不是“系统完全坏了”，而是：

> **能命中字面一样的内容，但抓不住语义上本来应该相关的内容。**

## 473. 企业知识最常见的现实：两边的问题同时存在

这正是为什么混合检索几乎变成企业场景常客。

因为企业知识不是单一类型资料，而是混合体：

- 一部分信息依赖专有词精确命中
- 一部分信息依赖语义理解召回

比如同一个问题里，用户可能同时包含：

- 一个必须命中的产品代号
- 一个比较口语化的业务描述

例如：

- `H24 版本里无人车升级前要做哪些检查？`

这里面：

- `H24` 需要关键词能力兜底
- `升级前要做哪些检查` 更需要语义能力补召回

如果只用其中一种检索方式，通常都会丢掉一半优势。

所以混合检索真正解决的是：

> **现实问题往往同时包含“字面约束”和“语义需求”。**

## 474. 你可以把 Hybrid Search 理解成“两条腿走路”

最容易记的理解方式就是：

```text
关键词检索负责找“必须命中的词”
向量检索负责找“意思相近的内容”
Hybrid Search 负责把这两种能力合起来
```

也就是说，它不是为了追求“更复杂”，而是为了同时覆盖两类不同风险：

- 只做向量检索，怕专有词丢
- 只做关键词检索，怕语义召回差

混合检索本质上就是在做一个更现实的平衡。

## 475. 一个很典型的企业场景例子

比如用户问：

- `查询一下 H24 无人车 OTA 升级前的检查流程`

这个问题里至少混了三层信息：

- `H24`：版本限定
- `无人车 OTA`：领域限定
- `升级前的检查流程`：语义描述

如果只做关键词检索：

- 可能找到带 `H24` 和 `OTA` 的文档
- 但未必找到“升级前检查”这个语义最接近的片段

如果只做向量检索：

- 可能找到一堆“升级前置校验”“升级准备流程”相关内容
- 但未必把 `H24` 版本限定保得很稳

而混合检索的优势就在这里：

- 用关键词能力保住 `H24`、`OTA`
- 用向量能力补足“升级前检查流程”这种语义表达

所以它更像是：

> **一边防漏专有词，一边防漏语义相关。**

## 476. 为什么企业文档越多，越容易走向 Hybrid Search

在小 demo 里，文档少、术语少、表达方式也比较统一。
这时只做向量检索，往往就已经看起来“够用了”。

但一旦到企业规模，情况会迅速变化：

- 文档量上来
- 历史版本变多
- 不同团队术语不统一
- 规范文档和经验文档混在一起
- 同一问题的表达方式越来越多

这时只靠单一路径检索，稳定性就会明显下降。

也就是说，文档越多，不是越容易靠一种方法解决，而是越容易出现：

- 某些问题更需要关键词命中
- 某些问题更需要语义召回
- 大部分真实问题两者都要

所以混合检索在企业里常见，不是因为大家爱堆技术，而是因为：

> **知识形态一复杂，单一路径检索很难长期稳定。**

## 477. Hybrid Search 在工程上到底带来什么收益

从工程效果上看，它最常见的收益有几个：

- 召回更稳
- 对专有词更敏感
- 对口语问法更宽容
- 相关文档覆盖更全
- 后续 rerank 的候选池质量更高

这一点很重要。

很多人会把混合检索和 rerank 分开看，但实际上它们经常是连着的：

- `Hybrid Search` 先尽量把候选找全
- `Rerank` 再把候选排准

如果前面候选池就找歪了，后面 rerank 也很难救回来。

所以混合检索常常是在给后续排序打基础。

## 478. 为什么说它不是“高级玩法”，而是“迟早要补的一课”

很多初学者会把混合检索当成一种进阶技巧，感觉像：

- 小项目先不管
- 以后复杂了再说

这个想法不能算错，但你要知道一件事：

> **只要你的知识库里同时存在专有词和自然语言描述，混合检索迟早会进入视野。**

也就是说，它不是某种炫技配置，而是企业知识形态自然推出来的方案。

所以你现在学它，不是为了立刻把系统做复杂，而是为了建立一个正确认知：

- 真实知识库不是纯语义文本
- 真实问题也不是纯关键词搜索
- 真实系统往往需要两种能力同时在线

## 479. 你现在可以怎么记这件事

把这一章压缩成一句最核心的话：

```text
企业资料里，既有必须命中的词，也有只能靠语义理解的表达
所以混合检索几乎是必然选择
```

如果再压缩成一句更口语的话，就是：

```text
只靠关键词不够
只靠向量也不够
企业知识库通常两种都要
```

## 480. 它和你前面学过的内容怎么接起来

现在你可以把整条学习链串起来了：

- `Query Rewrite`：先把问题改得更适合查
- `Hybrid Search`：再把资料找得更全
- `Rerank`：再把结果排得更准

也就是说：

```text
先把问题改好
→ 再把候选找全
→ 再把候选排准
→ 最后交给模型回答
```

这条链已经非常接近真实企业 RAG 的主干流程了。

## 481. Rerank：怎么把候选排准

到这里，你已经把前两步串起来了：

- `Query Rewrite`：先把问题改好
- `Hybrid Search`：再把候选尽量找全

那下一步真正决定“最后喂给模型的是不是最有用那几段”的，就是：

- `Rerank`

也就是说，RAG 里不是“找到了候选就结束”，而是还要继续问一句：

> **这些候选里，谁才最值得排在最前面？**

这就是 rerank 要解决的问题。

## 482. 为什么“召回到了”不等于“排得准”

很多人第一次做 RAG，会天然觉得：

- 既然已经从检索器里拿回来了 topk
- 那前几条应该就是最好的

但真实系统里，这个假设经常不成立。

因为初召回阶段的目标，通常只是：

> **先把“可能相关”的内容找回来。**

而不是保证：

> **已经把“最适合回答当前问题的内容”排在了最前面。**

这两件事看起来像一回事，其实不是。

所以你可以先把 retriever 和 rerank 的分工分开记：

- `retriever`：尽量别漏召回
- `rerank`：尽量别排错序

## 483. 初召回为什么容易“看起来相关，但其实不够好”

初召回结果里最常见的问题，不是完全无关，而是：

- 标题很像，但正文不是答案
- 背景介绍很多，但真正步骤很少
- 同主题内容很多，但问的不是这个角度
- 提到了关键词，但不是用户想问的对象
- 相关是相关，但不是最适合回答当前问题的片段

举个很典型的例子。

用户问：

- `H24 版本下 OTA 前置校验流程是什么？`

初召回可能同时返回：

- 一篇讲 `OTA 总体流程`
- 一篇讲 `升级前准备事项`
- 一篇讲 `H24 版本变更说明`
- 一篇讲 `前置校验详细步骤`
- 一篇讲 `升级失败回滚机制`

这些内容都不算离题。
但如果没有 rerank，真正最该排前面的“前置校验详细步骤”不一定就在第一位。

这就是为什么：

> **相关，不等于最优相关。**

## 484. Rerank 本质上在重新回答什么问题

初召回做的是：

```text
哪些文档可能相关？
```

而 rerank 做的是：

```text
在这些候选里，哪些最适合回答当前问题？
```

这两个问题的重心不同：

- 初召回偏“广覆盖”
- rerank 偏“强相关”

所以 rerank 不是在重复检索，而是在更细地判断：

- 这段内容和问题的对应程度有多高
- 这段内容是不是正面回答问题
- 这段内容是不是只是泛泛提到主题
- 这段内容是不是比其他候选更值得进入最终 context

也就是说，rerank 更像是：

> **从“可能有用”里，再选出“最值得用”的。**

## 485. 你可以把 Rerank 理解成“精排层”

最容易记的方式是把整个检索链拆成两层：

### 第一层：粗召回

目标：

- 先把可能相关的候选尽量找全

特点：

- 快
- 覆盖广
- 允许有一些噪音

### 第二层：精排

目标：

- 把真正最相关的候选排到最前面

特点：

- 更细致
- 更关注问题和片段的精确匹配
- 通常候选数量更少

所以你可以把它记成：

```text
Hybrid Search 负责“找全”
Rerank 负责“排准”
```

这两步本来就是一前一后的。

## 486. Rerank 具体在“排”什么

很多人会说“rerank 就是重新排序”，但这句话太抽象。

更具体一点，它往往在排这些东西：

- 哪段最直接回答当前问题
- 哪段保留了最关键的限定条件
- 哪段和问题的角度最一致
- 哪段虽然主题相关，但只是背景噪音
- 哪段更值得进入最终 prompt

比如同样都和 `OTA` 有关：

- 一段讲总体定义
- 一段讲前置校验条件
- 一段讲升级后的验证流程

如果用户问的是“升级前检查流程”，那真正应该高排的显然是“前置校验条件”那段，而不是所有带 `OTA` 的内容都一视同仁。

## 487. 为什么 Rerank 在企业资料里特别重要

企业资料里很少只有一篇文档讲一个主题。
更常见的是：

- 一堆文档都提到了同一个词
- 但关注点不同
- 层次不同
- 版本不同
- 细节程度不同

这就意味着，初召回之后，候选池里经常会出现：

- 真正答案片段
- 背景说明片段
- 历史版本片段
- 边缘相关片段
- 泛主题片段

如果没有 rerank，最终塞给模型的 context 很容易变成：

- 看起来都相关
- 但真正最有用的没排前
- 噪音占了宝贵上下文窗口

这在企业场景下特别吃亏，因为：

> **模型上下文窗口再大，也不应该浪费在低价值候选上。**

## 488. 一个最直观的理解：Rerank 在帮模型省上下文

你可以把 rerank 理解得再朴素一点：

> **它是在尽量把最值钱的片段先挑出来，再交给模型。**

因为模型并不会自动知道：

- 哪条候选最关键
- 哪条只是背景材料
- 哪条虽然相关但不回答这个问题

如果你一股脑把排序不佳的片段塞进去，模型就得自己在一堆信息里再做筛选。

这会带来几个坏处：

- 浪费上下文
- 干扰最终回答
- 增加答偏概率
- 让“真正答案片段”被噪音稀释

所以 rerank 并不是只为了“排序好看”，而是在实质上帮助：

- 压缩高质量上下文
- 提升最终回答稳定性

## 489. 一个典型的数据流长什么样

在工程里，常见流程通常更像这样：

```text
question
→ query rewrite
→ hybrid search
→ 先召回 20~100 条候选
→ rerank 重新打分排序
→ 取前 3~10 条最相关片段
→ 组装 context
→ prompt
→ model answer
```

所以 rerank 并不是单独存在的，它通常夹在：

- 初召回之后
- 最终组装 prompt 之前

你可以把这一步记成：

```text
先找回来
→ 再重新排
→ 再决定喂给模型哪些
```

## 490. Rerank 最擅长解决什么问题

它特别擅长解决下面几类问题：

- 候选很多，但质量参差不齐
- 主题相关片段太多，模型容易被背景内容干扰
- 真正能回答问题的片段没排在最前面
- 查询词命中了，但命中的位置不对、角度不对
- 多个候选都相关，但只有少数是“正面回答”

所以如果你发现一个系统的现象是：

- “大体都能召回到”
- 但“回答还是不稳定”

那问题往往不一定出在“没检索到”，而可能出在：

> **检索到了，但没排准。**

## 491. 什么时候该优先怀疑“需要 Rerank”

你可以记几个很典型的信号。

如果系统表现出这些现象，就很该考虑 rerank：

- topk 里相关文档很多，但答案仍然飘
- 带关键词的片段总能召回，但真正回答问题的段落经常不在前面
- 用户问得越具体，系统反而越容易答偏
- 文档很多都提同一个主题，导致 context 很杂
- 换不同 topk 值时，回答波动很大

这些现象通常说明：

- 候选池可能已经够了
- 但最终排序还不够精细

## 492. 它和 Query Rewrite、Hybrid Search 的关系怎么记

现在你已经可以把三者关系记得非常清楚：

- `Query Rewrite`：先把问题改得更适合检索
- `Hybrid Search`：把可能相关的候选尽量找全
- `Rerank`：把候选里最该给模型看的内容排到最前面

也就是说：

```text
Rewrite 解决“怎么问”
Hybrid 解决“怎么找”
Rerank 解决“怎么排”
```

这里你就会发现，Rerank 并不是一个孤立技巧，而是这条检索主干链上的第三步。

## 493. 一句最值得记住的话

把这一章压成一句最关键的话：

```text
Rerank 不是为了多找内容
而是为了把最值得给模型看的内容排到前面
```

如果再说得更口语一点，就是：

```text
先找全
再排准
最后再回答
```

只要你记住这两句，后面无论你看的是 cross-encoder reranker、重排模型、精排阶段，本质上理解都不会偏。

## 494. Tool Calling 和经典 RAG / Agentic RAG 的边界

到这里，你已经把固定检索链的大部分主干都理顺了：

- `Query Rewrite`
- `Hybrid Search`
- `Rerank`

接下来最容易混的，不是某个 API，而是三个概念之间的边界：

- `Tool Calling`
- `经典 RAG`
- `Agentic RAG`

很多人学到这里会开始混淆：

- 只要调用了工具，是不是就已经是 Agent？
- 只要不是向量库，是不是就不算 RAG？
- Tool Calling 和 Agentic RAG 到底差在哪？

所以这一章最重要的目标不是教你一个新技巧，而是帮你建立一个清晰判断框架。

## 495. 先说结论：这三个东西不是同一层概念

最容易记的一句话是：

```text
Tool Calling 是能力
经典 RAG 是固定流程
Agentic RAG 是运行时动态决策的检索流程
```

也就是说，它们不是互相平级替代的三个词，而是分属不同层面。

### `Tool Calling`

说的是：

- 模型有没有能力调用外部工具
- 系统能不能把工具结果再回给模型

它解决的是“能不能接外部能力”。

### `经典 RAG`

说的是：

- 检索流程是不是提前写好的
- 用户问题进来后，系统是不是按固定步骤去查

它解决的是“固定检索链怎么工作”。

### `Agentic RAG`

说的是：

- 模型会不会在运行时决定要不要查
- 查什么
- 查几轮
- 不够时是否改 query 或换工具

它解决的是“检索过程本身是不是由模型动态决策”。

所以一定要先把这个层次感分清。

## 496. Tool Calling 本身不等于 Agent

这是最容易踩的坑。

很多人一看到模型会调工具，就会下意识觉得：

- 这已经是 Agent 了

其实不一定。

比如一个非常简单的系统可以是这样：

```text
用户问天气
→ 模型调用 weather_tool
→ 返回结果
→ 模型总结答案
```

这里确实发生了工具调用。
但它不一定意味着：

- 模型在做多步规划
- 模型在自主决定整个流程
- 模型在多轮试错和重规划

所以更准确地说：

> **Tool Calling 只是“模型可以借助外部能力”的机制，不自动等于 Agent。**

Agent 往往还意味着：

- 有目标驱动
- 有步骤决策
- 有多轮观察与调整
- 必要时会继续调用其他工具

## 497. 经典 RAG 也可以完全不用 Tool Calling

你前面学的经典 RAG 主干链，其实就说明了这一点。

比如：

```text
question
→ retriever
→ docs
→ context
→ prompt
→ answer
```

这里完全可能没有任何“模型主动发起工具调用”的过程。

而是宿主程序直接按固定流程做：

- 系统先调用 retriever
- 系统把 docs 拼成 context
- 系统把 context 塞给模型
- 模型只负责基于资料回答

这个流程仍然完全是 RAG。

所以：

> **RAG 的核心是“先检索，再增强回答”，不是“模型必须亲自调工具”。**

也就是说，经典 RAG 和 Tool Calling 不是绑定关系。

## 498. Tool Calling 也不一定是在做 RAG

反过来，模型调用工具，也不一定是在做检索增强。

比如工具可能是：

- 天气查询
- 数据库写入
- 发消息
- 下单
- 计算器
- 执行动作

这些都属于工具调用。
但它们不一定和“检索资料后回答问题”有关。

所以：

> **不是所有 Tool Calling 都是 RAG。**

只有当工具调用承担的是“找资料、补上下文、增强回答”这件事时，它才和 RAG 紧密相关。

## 499. 经典 RAG 和 Agentic RAG 最核心的区别是什么

最核心的一条判断标准，你前面已经隐约掌握了，现在把它正式落下来：

```text
经典 RAG：怎么查，是系统预先写好的
Agentic RAG：怎么查，是模型运行时边判断边决定的
```

这就是两者最本质的边界。

### 经典 RAG 更像

```text
用户问题
→ rewrite（可选）
→ hybrid search（可选）
→ rerank（可选）
→ prompt
→ answer
```

注意，哪怕里面有 rewrite、hybrid、rerank，这条链依然可能是经典 RAG。
因为：

- 步骤顺序是预先写好的
- 用哪些组件是预先确定的
- 模型并不决定“要不要查”“换不换路径”

### Agentic RAG 更像

```text
用户问题
→ 模型先判断要不要查
→ 选工具
→ 看结果够不够
→ 不够就改 query
→ 再查
→ 必要时换别的工具
→ 最后回答
```

这里最关键的不是“有没有检索”，而是：

- **检索策略本身是动态的**
- **模型在运行中会调整流程**

## 500. Tool Calling 在这两者里分别扮演什么角色

如果你把 Tool Calling 放回这张图里，就会更清楚。

### 在经典 RAG 里

Tool Calling 可能：

- 根本不用出现
- 或者只是被宿主程序封装在固定流程后面

例如：

- 系统固定调用 retriever
- 固定调用 reranker
- 固定调用文档加载器

这里即便底层实现成某种“工具”，整体仍然是经典 RAG，因为流程没有交给模型决定。

### 在 Agentic RAG 里

Tool Calling 往往是关键执行手段。

因为模型要动态决定：

- 先调哪个工具
- 结果不够时是否再调
- 是否换另一个知识源
- 是否改参数继续查

也就是说：

> **Tool Calling 是 Agentic RAG 常用的实现手段，但 Tool Calling 本身不等于 Agentic RAG。**

这句话非常值得记住。

## 501. 你可以把三者放进一张判断图里

最容易混的三个词，可以这样记：

### 1. Tool Calling

问的是：

- 模型能不能借助外部工具？

### 2. 经典 RAG

问的是：

- 检索增强回答这条链，是不是固定写好的？

### 3. Agentic RAG

问的是：

- 模型会不会自己决定检索策略，并在运行中动态调整？

如果把它压成一句判断图：

```text
有没有外部工具能力？看 Tool Calling
检索链是不是预定义？看经典 RAG
检索策略是不是动态决策？看 Agentic RAG
```

这样三者就不会再混在一起。

## 502. 一个很典型的对比例子

### 例子 A：固定知识库问答

流程：

```text
用户提问
→ 系统固定做向量检索
→ 固定 rerank
→ 固定拼 prompt
→ 模型回答
```

这属于：

- `经典 RAG`

它不需要模型来决定流程。

### 例子 B：模型调用一个网页搜索工具查资料

流程：

```text
用户提问
→ 模型调用 search_tool
→ 工具返回网页结果
→ 模型总结
```

这属于：

- `Tool Calling`

但不一定已经是 Agentic RAG。
如果它只是一次固定调用，不涉及多轮判断和重规划，那更像“带工具能力的问答”。

### 例子 C：模型先搜知识库，再抓网页，不够再改关键词继续搜

流程：

```text
用户提问
→ 模型先调知识库搜索
→ 发现结果不够
→ 再调网页抓取
→ 发现还不完整
→ 改关键词继续搜
→ 最后组织答案
```

这就很典型地属于：

- `Agentic RAG`

因为真正变化的是：

- 模型在运行时决定检索路径
- 不再只是执行一条固定链

## 503. 为什么很多系统处在中间态

真实系统里，很多东西并不是非黑即白。

你会经常看到一些“中间态”系统：

- 大部分流程是固定的
- 但某一步允许模型选工具
- 或者固定先查知识库，不够再开放网页搜索

这种系统你可以理解成：

- 以经典 RAG 为主
- 局部带一点 agent 能力

所以边界判断时，不要强迫自己每次都二选一到极致。
更重要的是看：

> **系统的主导逻辑到底是固定链，还是动态决策。**

## 504. 什么时候先停在经典 RAG，什么时候再走向 Agentic

这个判断也可以正式落下来。

### 更适合先停在经典 RAG

- 问题类型比较稳定
- 知识源比较明确
- 检索流程大体可预定义
- 你更在意稳定性、成本和可控性

### 更适合考虑 Agentic RAG

- 问题更开放
- 知识源不止一个
- 需要边查边判断怎么查
- 经常出现“查一次不够”的情况
- 需要工具之间动态切换

也就是说：

- **经典 RAG**：适合“我已经知道怎么查”
- **Agentic RAG**：适合“我还要边查边决定怎么查”

## 505. 现在把这一节和你的学习顺序接起来

到这里，你其实已经站在一个很关键的分界点上了。

你前面学的是：

- 固定检索链怎么从简到繁变得更稳

这一章开始学的是：

- 固定检索链和工具驱动动态检索之间的边界

也就是说，从学习路径上看，这一章正好是在帮你完成从：

- `RAG 主干链`

走向：

- `Tool Calling`
- `Agent`
- `工作流`

之前最关键的认知过渡。

## 506. 最后记一句最核心的话

把这一章最后压缩成一句最重要的话：

```text
Tool Calling 是能力
经典 RAG 是固定链
Agentic RAG 是动态决策链
```

如果再换一种更口语的说法：

```text
会不会调工具，和是不是 Agent，不是一回事
是不是 RAG，也不取决于有没有工具
关键看检索流程是不是固定，还是由模型动态决定
```

只要你把这两句记住，后面进入 Agent 和工作流章节时，很多概念都会一下子顺很多。

## 507. 进入 Agent 和工作流前，你现在已经具备了什么

到这里，先不要急着往下冲新概念。

你最该做的，其实是回头看一眼：

> **在正式进入 Agent 和工作流之前，你已经具备了哪些关键能力。**

这一步很重要。
因为很多人学 Agent 会觉得抽象，不是因为 Agent 本身太神秘，而是因为前面的基础能力没有在脑子里连成一条线。

而你现在其实已经不是“刚入门”，而是已经具备了进入下一阶段的核心地基。

## 508. 你已经不再只是会“调一下模型”

最开始学 LangChain 时，很多人只会做这种事：

- 给模型一段 prompt
- 拿回一段回答

也就是最基本的：

```text
prompt → model → output
```

但你现在已经不止于此。

你已经理解了：

- prompt 不是随便写几句话
- 输出不是只能看自然语言
- 一次调用可以被组织成一条可复用链
- 链可以接入检索、格式化、解析、上下文组装

也就是说，你已经从“会调模型”走到了：

> **会把模型放进一个可设计的数据流里。**

这一步其实非常关键。

## 509. 你已经掌握了构建链式系统的最小骨架

到目前为止，你已经学过并反复用过这些核心部件：

- `ChatPromptTemplate`
- `MessagesPlaceholder`
- `StrOutputParser`
- `Runnable`
- `RunnablePassthrough`

这意味着你已经具备一种很重要的能力：

> **把“输入 → 处理 → 输出”组织成一条明确的数据流。**

这件事为什么重要？

因为后面的 Agent 和工作流，表面看起来更复杂，但本质上仍然是在做这件事：

- 输入任务
- 中间经过若干步骤
- 调工具或查资料
- 再产出结果

所以你现在已经具备的，不只是几个 API 知识点，而是：

- 链式思维
- 节点思维
- 数据流思维

这三种思维会直接决定你后面看 Agent 会不会乱。

## 510. 你已经理解了“模型回答”与“系统执行”的区别

这是进入 Agent 前特别关键的一步。

你前面已经学清楚了：

- 模型不会自己真正执行工具
- 模型只会表达“它想调用什么”
- 真正执行工具的是宿主程序、框架或客户端

这个认知非常关键。

因为后面学 Agent 时，你会频繁看到：

- 模型给出下一步动作
- 系统执行动作
- 工具结果返回模型
- 模型继续判断下一步

如果你没有提前理解“模型输出”和“系统执行”是两回事，Agent 就会显得特别玄学。

而你现在其实已经具备这个分辨能力了。

## 511. 你已经理解了工具调用的本质边界

你前面不是只学了“工具怎么声明”，而是已经进一步搞清楚：

- Tool Calling 是一种能力
- 它不自动等于 Agent
- 也不自动等于 RAG

这一点非常重要。

因为后面你会不断碰到一些系统：

- 能调工具，但不一定是 Agent
- 在做检索，但不一定是 Agentic RAG
- 有工作流，但不一定每一步都由模型自由决定

你现在已经不会再把这些概念全部糊成一团了。

也就是说，你已经具备了进入 Agent 阶段最关键的前置认知之一：

> **能区分“能力”“固定链”“动态决策”这三种不同层次。**

## 512. 你已经掌握了固定检索链的主干逻辑

如果把你前面学过的 RAG 内容压缩一下，你已经不只是知道“RAG 是检索增强生成”，而是已经理解了它在工程里的主干链：

```text
问题
→ 检索
→ context
→ prompt
→ 回答
```

并且你已经把这条主干往前后都扩展过了：

- 前面加了 `Query Rewrite`
- 中间加入了 `Hybrid Search`
- 后面加入了 `Rerank`

也就是说，你已经能把真实一点的检索链理解成：

```text
先把问题改好
→ 再把候选找全
→ 再把候选排准
→ 最后交给模型回答
```

这已经不是最初级的 RAG 理解，而是已经接近真实系统视角了。

## 513. 你已经理解了“固定链”为什么会走到边界

如果前面只学到经典 RAG，你可能还会觉得：

- 固定链已经够了

但你现在已经进一步理解了：

- 有些场景里，固定链会不够灵活
- 有些问题里，系统需要边查边决定怎么查
- 多知识源、多轮检索、多次尝试时，固定流程会开始吃力

也就是说，你已经理解了：

> **为什么系统会从经典 RAG，逐渐走向 Tool Calling，再走向 Agentic RAG。**

这非常关键。

因为进入 Agent 阶段时，最怕的一种状态就是：

- 只知道 Agent 很厉害
- 但不知道它到底在解决什么前一阶段解决不了的问题

而你现在已经有这个“前后衔接感”了。

## 514. 你已经具备了判断系统复杂度的能力

这是一种比 API 更重要的能力。

你现在其实已经开始能判断：

- 什么时候一个普通链就够
- 什么时候需要 RAG
- 什么时候需要多轮对话 RAG
- 什么时候需要 Query Rewrite / Hybrid Search / Rerank
- 什么时候才该进入 Tool Calling 或 Agentic RAG

这种能力的本质，其实是：

> **你开始会按问题复杂度选择系统形态，而不是一上来就堆最大方案。**

这是非常工程化的思维。

因为真实工作里，最重要的往往不是“会不会某个高级 API”，而是：

- 能不能选对方案
- 能不能知道什么时候不该过度设计

## 515. 你已经具备了进入 Agent 的三块核心地基

如果把前面所有内容压缩成进入 Agent 前最关键的三块地基，大概就是：

### 第一块：链式系统思维

你已经理解：

- 每一步都有输入输出
- 每个组件都在数据流里扮演角色
- 系统不是一句 prompt，而是一串节点

### 第二块：外部能力接入思维

你已经理解：

- 模型可以借助工具
- 工具结果可以反哺模型
- 模型和执行器是分工协作关系

### 第三块：检索与动态决策边界思维

你已经理解：

- 固定检索链适合什么场景
- 动态检索链适合什么场景
- Tool Calling、经典 RAG、Agentic RAG 的边界是什么

这三块一旦具备，后面进入 Agent 才不会像“突然跳到新世界”。

## 516. 为什么说你现在进入 Agent 会比一开始顺很多

还记得文档最开始给你的建议吗：

- 先学调用模型
- 再学 prompt
- 再学 parser
- 再学 runnable
- 再学 tools
- 再学 RAG
- 最后再学 Agent 和工作流

这个顺序不是随便排的。

因为 Agent 本质上不是一个独立孤岛，而是把前面这些能力重新组合起来：

- 用 prompt 让模型理解目标
- 用工具让模型接入外部能力
- 用链或工作流组织步骤
- 用检索系统补知识
- 用状态和上下文驱动后续动作

所以你现在进入 Agent，比起最开始就冲 Agent，会顺很多。

因为你已经知道 Agent 底下到底是由哪些东西拼出来的。

## 517. 现在你最应该带着什么问题进入下一章

进入 Agent 和工作流之前，最好的状态不是“背更多定义”，而是带着几个明确问题进去。

比如：

- Agent 和普通链到底差在哪？
- 什么叫工作流，和 Agent 又有什么不同？
- 哪些步骤应该固定写死，哪些步骤可以交给模型决定？
- 工具调用在 Agent 里到底扮演什么角色？
- 什么情况下应该做多步规划，什么情况下不该？

如果你带着这些问题进入下一章，后面的学习会特别顺。

因为你已经不是在“盲学新词”，而是在解决前面自然生长出来的问题。

## 518. 最后给你一个阶段性总结

如果要用最朴素的话总结你现在的位置，大概就是：

> **你已经不再只是会调 LLM，而是已经能理解一个真实 LLM 系统是怎么从固定链逐步走向动态系统的。**

这句话听起来抽象，但其实非常准确。

因为你现在已经能看懂：

- 一个回答链是怎么搭起来的
- 一个 RAG 链是怎么补资料的
- 一个检索链是怎么优化的
- 一个工具调用系统是怎么闭环的
- 一个 Agentic 系统为什么会出现

这已经足够让你正式进入下一阶段了。

## 519. 先记一句进入下一章前的话

把这一章最后压缩成一句最适合过渡的话：

```text
前面学的所有东西，不是散知识点
而是在给 Agent 和工作流搭地基
```

只要你把这句话记住，后面进入 Agent 章节时，你就不会觉得是在突然换题，而会感觉：

> **终于走到了前面这些基础能力真正开始汇合的地方。**

## 520. Agent 和普通链到底差在哪

正式进入 Agent 章节后，第一件最重要的事，不是先看 API，而是先把一个最根本的问题讲清楚：

> **Agent 和普通链，到底差在哪？**

因为很多人第一次看 Agent，会觉得它好像只是“更复杂一点的链”。

这句话不能说完全错，但如果只停在这个理解上，后面会很容易混乱。

所以这一章最重要的目标，就是把：

- 普通链是什么
- Agent 多出来的到底是什么
- 什么时候该用链，什么时候才该上 Agent

这三件事讲清楚。

## 521. 先说最核心的一句话

如果要先记一句最关键的话，我建议你直接记这个：

```text
普通链：步骤是预先写好的
Agent：下一步做什么，要由模型在运行时决定
```

这句话几乎就是两者最本质的区别。

也就是说，两者的差异不在于：

- 谁代码更多
- 谁名字更高级
- 谁一定会调工具

而在于：

> **流程是不是固定的，还是要在运行时动态决定。**

## 522. 什么叫普通链

你前面已经写过很多普通链了。

比如：

```text
prompt → model → parser
```

或者：

```text
question
→ retriever
→ context
→ prompt
→ answer
```

这些都属于普通链。

它们的共同特点是：

- 步骤顺序提前写好
- 每一步的输入输出提前定义好
- 系统不会临时改变路径
- 运行时只是把这条链执行一遍

也就是说，普通链更像：

> **你已经提前画好流程图，系统只是照着走。**

## 523. 什么叫 Agent

Agent 的关键不在于“步骤多”，而在于：

- 它不是每一步都提前写死
- 模型会在运行中判断下一步该做什么

比如一个 Agent 可能会这样：

```text
收到任务
→ 先想一下该怎么做
→ 决定先调哪个工具
→ 看工具结果
→ 判断够不够
→ 不够就再调别的工具
→ 再继续
→ 最后完成任务
```

这里最关键的不是“调了多少次工具”，而是：

> **下一步动作不是程序预先写死的，而是模型根据当前状态动态选出来的。**

这就是 Agent 和普通链真正拉开差距的地方。

## 524. 普通链和 Agent 的差异，不是“简单 vs 复杂”这么粗糙

很多人会把它理解成：

- 简单的叫链
- 复杂的叫 Agent

这个理解不够准确。

更准确的说法应该是：

- **普通链**：复杂也可以复杂，但流程是固定的
- **Agent**：不一定很长，但关键在于流程有动态决策

比如一个很长的固定审批链：

```text
输入
→ 校验
→ 查数据库
→ 格式化
→ 调模型
→ 结构化输出
```

它步骤很多，但如果每一步都是提前写死的，那它仍然只是普通链或工作流，不一定是 Agent。

反过来，一个只有两三步、但中间要让模型判断“接下来该调用哪个工具”的系统，就已经开始带 Agent 特征了。

所以核心不是长度，而是：

> **有没有运行时决策。**

## 525. 你可以把两者类比成两种做事方式

这个类比通常最好记。

### 普通链

像你提前写好 SOP 的流水线：

- 第一步做什么
- 第二步做什么
- 第三步做什么

都已经定好了。

系统要做的只是：

- 按顺序执行
- 把中间结果传下去

### Agent

像一个拿到任务后需要自己决定策略的执行者：

- 先判断该从哪入手
- 看看当前结果够不够
- 不够再换工具或换路径
- 过程中不断根据新信息调整

所以两者最本质的差异是：

- **链**更像执行预定流程
- **Agent**更像执行动态决策流程

## 526. 为什么普通链更稳

普通链之所以在工程里非常重要，是因为它天然有几个优点：

- 路径固定
- 结果更可控
- 更容易测试
- 更容易调试
- 成本和延迟更容易估计

也就是说，如果一个问题本来就可以用固定步骤解决，那普通链通常是更优先的选择。

因为你不需要把“下一步怎么做”这件事也交给模型。

所以你前面学到的很多东西——例如：

- `prompt | model | parser`
- 经典 RAG
- Query Rewrite → Hybrid Search → Rerank

本质上都属于：

> **把问题拆成一条更稳、更可控的固定链。**

## 527. 为什么 Agent 更灵活，但也更贵、更难控

Agent 的优势也很明显：

- 可以面对更开放的问题
- 可以根据结果动态调整
- 可以做多步尝试
- 可以在多个工具之间切换

但它的代价同样明显：

- 系统更复杂
- 行为更难预测
- 成本更高
- 延迟更大
- 测试和排查更难

所以 Agent 不是“普通链的高级版”，更像是：

> **当固定链已经不够时，才值得引入的动态决策机制。**

这个判断非常重要。

因为真实工程里，过早上 Agent 是非常常见的过度设计。

## 528. 什么时候普通链就够了

下面这些场景，通常普通链就很合适：

- 输入类型比较稳定
- 步骤顺序可以提前确定
- 不需要运行时选择路径
- 不需要多轮试探和重规划
- 你更在意稳定性和可控性

比如：

- 固定格式摘要
- 分类和结构化抽取
- 固定知识库问答
- 固定 RAG 流程
- 固定工具调用顺序

这些任务的共同点是：

> **你大致已经知道应该怎么做。**

那就没必要让模型再去决定流程。

## 529. 什么时候开始需要 Agent

当你发现下面这些现象时，普通链就可能开始吃力：

- 任务目标更开放
- 路径不止一条
- 先做哪一步不总是确定
- 一次工具调用经常不够
- 结果出来后还要再判断下一步
- 过程中需要根据观察不断调整策略

比如：

- “帮我调研这个问题，并给出结论”
- “先查知识库，不够再去网页，再整理证据”
- “帮我定位线上问题，找可能原因并补证据”

这类任务的共同点是：

> **不是只要执行流程，而是要边执行边决定流程。**

这时 Agent 才真正有价值。

## 530. 一张最实用的判断表

你可以先直接记这组对比。

- **普通链**：步骤预定义，执行路径固定
- **Agent**：步骤不完全预定义，路径运行时决定
- **普通链**：更稳、更易测、更可控
- **Agent**：更灵活，但更难控、更贵
- **普通链**：适合问题类型稳定的任务
- **Agent**：适合开放任务、多工具、多轮决策任务

如果再压缩成一句最实用的话：

```text
已知怎么做，用链
还要边做边决定怎么做，用 Agent
```

## 531. 为什么很多系统不是“纯链”也不是“纯 Agent”

真实系统里，很多时候你会看到一种混合形态：

- 外层是固定工作流
- 某个节点里有 Agent 决策
- 或者先走固定链，不够再进入 Agent 模式

这很正常。

因为工程上常见的做法往往不是：

- 要么全固定
- 要么全动态

而是：

> **能固定的尽量固定，必须动态的那部分再交给 Agent。**

这个思路非常工程化，也很实用。

## 532. 现在你为什么能看懂这个区别了

如果一开始就讲这一章，你大概率会觉得很抽象。

但你现在已经学过：

- 普通问答链
- RAG 链
- Query Rewrite
- Hybrid Search
- Rerank
- Tool Calling
- 经典 RAG 和 Agentic RAG 的边界

所以你现在已经具备判断这个问题的前置知识了。

你已经知道：

- 什么叫固定链
- 什么叫工具接入
- 什么叫动态检索决策

所以这时候再看 Agent 和普通链的区别，就不会只停留在抽象定义，而会知道它们分别在解决什么问题。

## 533. 这一章最后记一句最关键的话

把这一章最后压成一句最适合记忆的话：

```text
普通链解决“按既定步骤完成任务”
Agent 解决“运行中决定下一步怎么做”
```

如果再换一种更口语的话：

```text
流程已经知道了，就别上 Agent
流程还要边做边判断，才需要 Agent
```

只要你把这两句记住，后面再进入“工作流和 Agent 的区别”时，理解会顺很多。

## 534. 什么叫工作流，和 Agent 又有什么不同

现在你已经把前两个概念分开了：

- `普通链`
- `Agent`

接下来第三个最容易混的词，就是：

- `工作流（Workflow）`

很多人学到这里会开始疑惑：

- 工作流是不是就是更长一点的链？
- 工作流和 Agent 到底差在哪？
- 如果已经有工作流，为什么还要 Agent？

所以这一章最重要的目标，就是把：

- 普通链
- 工作流
- Agent

放到同一张图里看清楚。

## 535. 先说一句最关键的话

如果你只先记一句，我建议记这个：

```text
普通链：固定的一条线
工作流：固定的多步骤编排
Agent：运行时动态决定下一步的执行者
```

这句话基本上就把三者关系压缩出来了。

也就是说：

- `链` 更像一条固定管道
- `工作流` 更像一张提前设计好的流程图
- `Agent` 更像一个在流程中自己判断下一步动作的执行者

## 536. 什么叫工作流

最朴素地说，工作流就是：

> **把一个任务拆成多个步骤，并按预设规则把这些步骤组织起来。**

比如一个工作流可能是：

```text
用户输入
→ 先做意图识别
→ 再查数据库
→ 再调用模型生成说明
→ 再做结构化输出
→ 最后返回前端
```

这里的关键点在于：

- 步骤不止一个
- 步骤之间有明确顺序或分支
- 这些顺序和分支通常是预先设计好的

所以工作流的本质不是“步骤多”，而是：

> **多步骤编排是系统提前定义好的。**

## 537. 工作流和普通链是什么关系

你可以把它理解成：

- **普通链**：最简单的一种工作流
- **工作流**：比普通链更丰富的流程编排

比如一个普通链可能只是：

```text
prompt → model → parser
```

而工作流可能会包含：

```text
输入
→ 分类
→ 如果是 A 类型走路径 1
→ 如果是 B 类型走路径 2
→ 汇总结果
→ 输出
```

所以普通链可以看成是工作流的极简形态。

也就是说，工作流通常比普通链多出来的是：

- 分支
- 状态
- 多节点协作
- 条件判断
- 结果汇总

但注意，这些东西即使存在，也**不自动等于 Agent**。

## 538. 工作流和 Agent 最本质的区别是什么

这才是最关键的一刀。

```text
工作流：流程图是系统提前设计好的
Agent：流程中的下一步由模型运行时决定
```

也就是说，工作流和 Agent 的差别，不在于：

- 谁节点更多
- 谁代码更长
- 谁听起来更高级

而在于：

> **流程控制权是在系统手里，还是在模型运行时手里。**

### 工作流更像

- 系统先规定好节点
- 规定好哪些条件下走哪条路
- 模型只是其中某个节点里的能力组件

### Agent 更像

- 系统给模型一个目标
- 模型根据当前上下文、工具结果和状态
- 自己决定下一步做什么

所以工作流和 Agent 的边界，本质上是：

- **工作流是预定义编排**
- **Agent 是动态决策编排**

## 539. 一个最直观的对比例子

### 例子 A：固定客服分流流程

```text
用户输入
→ 识别问题类型
→ 售后问题走售后节点
→ 技术问题走技术知识库检索
→ 最后统一输出
```

这很明显更像：

- `工作流`

因为虽然步骤不少，甚至有分支，但路径规则是系统提前写好的。

### 例子 B：研究助手自动调研

```text
用户提出开放问题
→ 模型先判断是否需要查资料
→ 先查知识库
→ 结果不够再查网页
→ 再判断是否需要补证据
→ 再继续搜索
→ 最后总结
```

这更像：

- `Agent`

因为关键不是有多少步，而是：

- 下一步不是写死的
- 模型会根据观察结果动态调整

## 540. 为什么很多工作流里也会用到模型

这也是很多人容易混淆的地方。

很多人看到系统里有模型参与多个节点，就会觉得：

- 这是不是已经是 Agent 了？

其实不一定。

比如一个工作流里可以有这些节点：

- 节点 1：模型做分类
- 节点 2：系统查数据库
- 节点 3：模型做总结
- 节点 4：系统做 JSON 校验

这里模型当然参与了很多步骤。
但如果：

- 每个节点什么时候执行
- 走哪条路
- 下一步是什么

都是系统提前定义好的，那它仍然更像工作流，而不是 Agent。

所以：

> **模型参与很多，不等于 Agent；关键还是看流程控制权。**

## 541. 为什么很多 Agent 系统外面还包着工作流

真实工程里，这一点特别常见。

很多系统其实不是：

- 纯工作流
- 或者纯 Agent

而是：

- 外层是工作流
- 内层某个节点使用 Agent

比如：

```text
用户请求
→ 先做鉴权
→ 再做任务类型判断
→ 如果是简单任务走固定链
→ 如果是复杂调研任务，进入 Agent 节点
→ Agent 完成后回到主流程
→ 最后统一输出
```

这种模式非常工程化，也非常实用。

因为它体现了一个成熟思路：

> **能固定的部分交给工作流，必须动态决策的部分再交给 Agent。**

这通常比“全系统都让模型自由发挥”更稳。

## 542. 什么时候更适合工作流，而不是 Agent

下面这些场景，通常工作流更适合：

- 步骤顺序大体已知
- 分支条件可以提前定义
- 任务虽然多步，但路径相对可控
- 你需要稳定性、审计性、可观测性
- 你希望每一步都清楚知道在干什么

比如：

- 报销审批流
- 表单处理流
- 工单分发流
- 多阶段数据处理流
- 固定的问答后处理流

这些任务的特点是：

> **虽然不只是一步，但流程图本身已经比较清楚。**

那就优先用工作流，不一定要上 Agent。

## 543. 什么时候工作流开始不够，需要 Agent 参与

当你遇到下面这些情况，纯工作流就会开始吃力：

- 分支太多，无法提前穷举
- 下一步依赖运行时观察结果
- 工具选择无法事先完全确定
- 任务目标开放，步骤不是固定模板
- 需要边试边调整策略

这时如果还强行把所有路径写成工作流，你会得到一个问题：

- 流程图越来越庞大
- 分支越来越难维护
- 规则越来越像在手写一个笨重的 Agent

所以很多时候 Agent 的价值，不是因为它“更高级”，而是因为：

> **有些决策逻辑已经复杂到不适合继续手工写死。**

## 544. 你可以把三者放在一条连续谱上看

这是最适合记忆的方式之一。

```text
普通链 → 工作流 → Agent
```

它们不是彼此无关，而是复杂度逐步上升。

### 普通链

- 一条固定线
- 节点少
- 基本没有复杂分支

### 工作流

- 多步骤
- 有分支
- 有状态
- 但流程图仍然是预定义的

### Agent

- 目标驱动
- 工具驱动
- 运行时决定下一步
- 流程不完全预定义

这样看就很容易理解：

- 不是所有问题都需要 Agent
- 很多问题到工作流就够了
- Agent 是在工作流难以穷举时才更有价值

## 545. 现在把这三个概念压成一句判断口诀

你可以先记这句非常实用的话：

```text
一条固定线，用链
多步骤固定编排，用工作流
下一步还要运行时决定，用 Agent
```

这句口诀基本够你判断大多数场景。

## 546. 为什么这一步对后面学习特别关键

因为如果这里不分清，后面你一看到这些词就会全部混在一起：

- LangGraph
- Agent 框架
- 多节点流程
- 多工具编排
- 状态机
- 调度器

而一旦你现在把：

- 链
- 工作流
- Agent

这三层关系分清，后面很多框架名词都只是实现形式，不再会让你觉得像三套完全不同的世界。

## 547. 最后记一句最关键的话

把这一章最后压成一句最适合记忆的话：

```text
工作流解决“怎么按预设步骤组织多步任务”
Agent 解决“运行中如何决定下一步动作”
```

如果再换一种更口语的话：

```text
流程图已经画出来了，用工作流
流程图画不出来，只能边做边决定，才用 Agent
```

只要你把这两句记住，后面进入更具体的 Agent / Workflow 框架时，理解会顺很多。

## 548. Agent 里“思考 -> 调工具 -> 观察 -> 再行动”到底是怎么一回事

到这里，你已经知道：

- 普通链是固定步骤执行
- 工作流是固定的多步骤编排
- Agent 是运行时动态决定下一步动作

那接下来最值得搞清楚的，就是 Agent 最核心的执行机制：

```text
思考
→ 调工具
→ 观察结果
→ 再决定下一步
```

很多人第一次看到这个循环，会觉得它非常“聪明”，甚至有点神秘。

但如果你把它拆开看，你会发现它本质上不是玄学，而是一种非常工程化的闭环。

## 549. 先记一句最关键的话

如果要先记一句最重要的话，我建议你记这个：

```text
Agent 不只是“会调工具”
而是“会根据工具结果决定下一步”
```

这句话非常关键。

因为只会调用一次工具，不一定是 Agent 的核心。
真正让 Agent 成立的，是下面这件事：

> **工具结果会反过来影响后续动作。**

也就是说，Agent 的重点不只是“有动作”，而是“动作之后还能继续判断”。

## 550. 为什么 Agent 的执行机制常被写成一个循环

普通链通常更像一条线：

```text
输入
→ 第一步
→ 第二步
→ 输出
```

而 Agent 更像一个循环：

```text
拿到目标
→ 判断现在该做什么
→ 执行动作
→ 看结果
→ 再决定下一步
→ 直到任务完成
```

为什么是循环？

因为在 Agent 场景里，系统一开始往往并不知道：

- 一定先做哪一步
- 一步是不是就够
- 当前结果能不能支撑最终回答
- 还要不要继续查、继续调工具、继续验证

所以 Agent 不是“走一遍预定义流程”，而是：

> **每完成一步，就重新看一眼当前状态，再决定接下来做什么。**

这就是它像循环的原因。

## 551. 第一步：思考，到底是在做什么

这里的“思考”不要理解得太神秘。

它本质上是在做几类判断：

- 当前任务目标是什么
- 现在缺什么信息
- 现在哪个工具最适合
- 是不是已经够回答了
- 如果还不够，下一步该补什么

也就是说，这里的“思考”其实更像：

> **基于当前状态做一个下一步动作决策。**

比如模型可能会判断：

- 先去搜知识库
- 先看本地文件
- 先用计算工具
- 先调用数据库查询
- 当前结果已经够了，可以直接回答

所以“思考”不是一定要产生长篇推理文本，而是：

- 对下一步动作做选择
- 对当前状态做判断

## 552. 第二步：调工具，到底是在做什么

这一层你前面已经有基础了。

这里的“调工具”指的是：

- 模型决定调用某个外部能力
- 系统真正去执行这个能力
- 再把执行结果回给模型

工具可能是很多种：

- 搜索知识库
- 读取文件
- 网页抓取
- 数据库查询
- 执行计算
- 发请求
- 调其他服务

所以这一步本质上不是“模型突然变强”，而是：

> **模型借助系统外部能力去拿它自己本来没有的信息或执行能力。**

这也是为什么 Agent 往往看起来比普通对话更强——它不是只靠参数知识，而是在不断接外部世界。

## 553. 第三步：观察，到底是在观察什么

这是很多人最容易忽略的一步，但它其实非常关键。

工具调用完成后，Agent 不会自动假设：

- 已经成功了
- 结果一定够用
- 现在就该结束

它还要“观察”。

这里的观察通常包括：

- 工具有没有返回结果
- 结果是否完整
- 结果是否可信
- 结果是否回答了当前问题
- 结果是否暴露出新的信息缺口

例如：

- 搜出来了，但内容太泛
- 抓到了页面，但正文不全
- 数据库查到了记录，但缺少关键字段
- 知识库里有总流程，但没有细节步骤

所以“观察”本质上是在问：

> **这一步的结果，到底够不够支撑下一阶段？**

## 554. 第四步：再行动，为什么它才是 Agent 的灵魂

如果只有“思考 -> 调一次工具 -> 输出答案”，很多系统还只是轻量工具问答。

真正让 Agent 有味道的，是它会在观察之后继续行动。

比如它可能会：

- 改 query 再查一次
- 换另一个工具
- 从知识库切到网页
- 再去补一份证据
- 再做一次验证
- 或者判断现在已经足够，进入最终回答

也就是说，Agent 的灵魂不在“用过工具”，而在：

> **它会根据结果继续调整行动。**

这一步一出现，系统就从“执行固定动作”变成了“动态闭环决策”。

## 555. 一个最小 Agent 闭环长什么样

你可以先把它记成下面这条最小闭环：

```text
用户给出目标
→ 模型判断先查什么
→ 调一个工具
→ 工具返回结果
→ 模型判断结果够不够
→ 如果不够，继续下一步
→ 如果够了，输出最终答案
```

这个结构其实已经足够体现 Agent 的核心。

注意，这里和普通链最关键的不同不是“多了工具”，而是：

- 工具结果会影响后续路径
- 路径不是一开始完全写死的

## 556. 你可以把 Agent 理解成“带反馈回路的系统”

这是一个非常工程化的理解方式。

普通链通常更像：

- 单向流动
- 一路往前
- 很少回头看前一步结果是否要求改变路径

而 Agent 更像：

- 做一步
- 看结果
- 再根据结果决定下一步

所以 Agent 的本质可以理解成：

> **系统里加入了一个“结果反馈到下一步决策”的回路。**

只要你抓住这个“反馈回路”，很多 Agent 框架背后的设计都会变得不难理解。

## 557. 为什么这和固定工作流不一样

你可能会问：

- 工作流里不是也会根据条件分支吗？

会，但差别在于：

- 工作流的条件分支通常是系统预先定义好的
- Agent 的下一步决策通常是模型基于当前上下文临时做出的

比如工作流更像：

```text
如果分类结果 = A，就走路径 A
如果分类结果 = B，就走路径 B
```

而 Agent 更像：

```text
我看完现在这些结果后，觉得下一步应该去搜这个词、调用这个工具、再补这一块证据
```

也就是说：

- 工作流的分支规则大多是提前写好的
- Agent 的分支动作很多是在运行时生成的

## 558. 一个很典型的例子

比如用户问：

- `帮我梳理无人车 OTA 的完整流程，并补充关键前置校验点`

一个 Agent 可能会这样走：

```text
先判断：问题比较宽，需要先找总流程
→ 调知识库搜索工具
→ 观察：拿到了总流程，但前置校验细节不足
→ 再决定：改关键词，专门搜前置校验
→ 再观察：有了校验步骤，但缺少版本限制
→ 再决定：补查版本相关文档
→ 最后综合输出答案
```

这里每一步都不是事先完全写死的。

真正驱动后续动作的是：

- 上一步拿到了什么
- 上一步还缺什么

这就是典型 Agent 闭环。

## 559. 为什么 Agent 看起来“聪明”

很多人觉得 Agent 比普通链“聪明”，其实原因并不神秘。

它看起来更聪明，通常是因为它同时拥有：

- 外部工具能力
- 中间状态记忆
- 基于结果继续行动的能力

也就是说，它不像一次性问答那样：

- 只回答一次
- 回答错了也就结束

而是更像：

- 先试一下
- 看看结果
- 不够再补
- 再继续

这种“边做边修正”的机制，本身就会让系统表现得更像一个执行者。

## 560. 什么时候这个循环真的有价值

不是所有任务都值得引入这个循环。

下面这些场景，Agent 闭环特别有价值：

- 任务目标开放
- 一步工具调用很难拿全信息
- 不同工具之间需要切换
- 结果质量需要持续观察
- 下一步很依赖上一步结果

而如果任务本身是：

- 路径固定
- 步骤明确
- 一次检索就够
- 不需要动态调整

那普通链或工作流通常就更合适。

所以 Agent 的这个循环，不是为了显得高级，而是为了处理：

> **那些无法提前写死完整路径的任务。**

## 561. 这一章最后记一句最关键的话

把这一章最后压成一句最值得记忆的话：

```text
Agent 的核心不是“会调用工具”
而是“会根据工具结果继续决定下一步”
```

如果再换一种更口语的话：

```text
不是调完工具就结束
而是看完结果再决定接下来干什么
```

只要你把这两句记住，后面再看 ReAct、Agent Loop、Observation、Action 这些词，都会顺很多。

## 562. ReAct 这种 Agent 思路到底在解决什么问题

现在你已经知道 Agent 的基本闭环是：

```text
思考
→ 调工具
→ 观察结果
→ 再决定下一步
```

接下来你很快就会遇到一些高频术语：

- `ReAct`
- `Thought`
- `Action`
- `Observation`
- `Agent Loop`

如果这时候你只是死记这些词，会觉得特别抽象。

但如果你把它们放回刚才那条 Agent 闭环里看，就会发现：

> **ReAct 其实不是一个神秘新世界，而是把 Agent 的基本执行逻辑明确地写出来。**

## 563. 先说结论：ReAct 解决的是“边推理边行动”

最值得先记的一句话是：

```text
ReAct = Reason + Act
```

也就是：

- 一边推理
- 一边行动

它要解决的问题，正是普通单次问答最不擅长的那种任务：

- 不能只靠脑补
- 也不能一上来盲目乱调工具
- 需要边想边做、边做边修正

所以 ReAct 的核心价值不是“多了几个英文标签”，而是：

> **把“思考”和“行动”组合成一个可循环的执行模式。**

## 564. 为什么光会想不够，光会调工具也不够

你可以先看两种失败情况。

### 情况 1：只推理，不行动

模型可能会：

- 看起来分析得很合理
- 但没有外部证据
- 缺少真实数据
- 容易幻觉

这就是“只想，不查”。

### 情况 2：只行动，不推理

模型可能会：

- 一上来就乱调工具
- 不知道先查什么更合适
- 工具调用很多，但方向混乱
- 拿到结果后不会利用

这就是“只查，不想”。

所以真正有效的 Agent 模式，通常不是二选一，而是：

```text
先判断现在该做什么
→ 再去行动
→ 再根据结果继续判断
```

ReAct 的意义，就在于把这件事结构化了。

## 565. ReAct 里的 Thought / Action / Observation 分别是什么

这三个词其实就是你前面已经理解过的闭环组件，只是换了一套更通用的命名。

### Thought

对应的是：

- 当前我怎么理解这个任务
- 现在缺什么信息
- 下一步最适合做什么

也就是说，`Thought` 本质上就是：

> **下一步动作之前的判断。**

### Action

对应的是：

- 调哪个工具
- 用什么参数
- 执行什么外部动作

也就是说，`Action` 本质上就是：

> **把刚才的判断变成实际动作。**

### Observation

对应的是：

- 工具返回了什么
- 结果够不够
- 有没有暴露出新的问题

也就是说，`Observation` 本质上就是：

> **行动之后拿到的反馈。**

所以把它压缩成一句最简单的话就是：

```text
Thought：先判断
Action：再行动
Observation：看反馈
```

## 566. 为什么 ReAct 要把这些步骤显式拆开

你可能会问：

- 模型自己不是也会想吗？为什么还要把 Thought / Action / Observation 讲得这么明确？

原因是：

> **一旦任务需要多步执行，系统必须能区分“想法”“动作”“结果”这三种不同状态。**

不然系统会很容易混乱：

- 哪些是模型的计划
- 哪些是模型真正要执行的动作
- 哪些是外部工具返回的事实结果

而 ReAct 把这三种东西拆开之后，整个系统就更容易：

- 控制
- 调试
- 观察
- 复盘

所以 ReAct 不只是“提示词技巧”，它也是一种：

> **让多步执行逻辑变得清晰可控的表达方式。**

## 567. 一个最小 ReAct 循环长什么样

你可以先把它理解成这样：

```text
Thought: 这个问题需要先查知识库确认定义
Action: 调用知识库搜索工具，关键词 = Runnable
Observation: 找到了 Runnable 定义，但缺少它在 RAG 里的应用
Thought: 还需要继续查 Runnable 在 RAG 中的用法
Action: 再次搜索，关键词 = Runnable RAG 用法
Observation: 找到了相关文档
Thought: 信息已经足够，可以给出答案
```

你会发现，这和你前面学的 Agent 闭环完全是一回事，只不过这里把每一步的角色写得更清楚了。

也就是说：

- `Thought` 负责决定方向
- `Action` 负责接外部能力
- `Observation` 负责把世界的反馈带回来

## 568. ReAct 为什么比“单次工具调用”更像 Agent

如果一个系统只是：

```text
用户提问
→ 模型调用一次工具
→ 返回结果
→ 总结答案
```

这当然可以很有用。
但它还不一定充分体现 Agent 的味道。

ReAct 更像 Agent，是因为它天然支持：

- 多轮动作
- 基于反馈继续决策
- 中途调整方向
- 直到完成目标再停

所以它和“单次工具调用问答”最本质的差别是：

> **ReAct 不把一次动作当终点，而把动作当成下一轮判断的输入。**

这非常关键。

## 569. ReAct 在工程上到底解决了什么

如果你从工程视角看，ReAct 主要解决的是这几个问题：

- 任务不是一步能完成
- 模型需要借助外部信息
- 外部结果会改变后续路径
- 系统需要在多步过程中持续修正

也就是说，它特别适合：

- 调研任务
- 多源检索任务
- 证据收集任务
- 多工具协作任务
- 需要边查边判断的任务

所以 ReAct 的作用不是让模型“更会说”，而是让系统更像一个：

> **能边执行边修正的任务处理器。**

## 570. 为什么它和前面学的 Agent 闭环是同一件事

现在你应该能看出来了：

你前面学的是中文直觉版：

```text
思考
→ 调工具
→ 观察结果
→ 再行动
```

而 ReAct 更像术语版：

```text
Thought
→ Action
→ Observation
→ Thought
→ Action
→ Observation
...
```

所以不要把它们当成两套不同知识。
更准确地说：

> **前面那条是 ReAct 的直觉解释，ReAct 是前面那条的结构化表达。**

这样你后面看各种 Agent 框架时，就不会觉得突然冒出一套新语言。

## 571. 为什么很多 Agent 框架都绕不开这种模式

因为只要一个系统需要满足下面这些条件：

- 有目标
- 有工具
- 有多步执行
- 有结果反馈
- 有路径调整

它就天然会逼近这种模式。

无论框架外面包装成什么样：

- LangChain Agent
- LangGraph Agent
- 研究助手
- 浏览器助手
- 代码 Agent

只要它真的是“边做边判断”，你往里拆，基本都会看到类似：

- 判断
- 行动
- 观察
- 再判断

这也是为什么 ReAct 这个思路会这么常见。

## 572. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
ReAct 不是在发明新能力
而是在把 Agent 的“边想边做”逻辑显式写出来
```

如果再换一种更口语的话：

```text
不是想完再一次性做完
而是想一点、做一点、看一点、再继续
```

只要你把这两句记住，后面再看 ReAct prompt、Thought/Action/Observation 日志、Agent Loop，这些词都会非常顺。

## 573. LangChain 里的 AgentExecutor 到底在替你做什么

到这里，你已经理解了三件事：

- Agent 不是固定链路
- Agent 的核心是“根据结果决定下一步”
- ReAct 是把这种闭环显式写出来

那接下来就该问一个非常自然的问题：

> **在 LangChain 里，到底是谁把这个循环真的跑起来？**

一个非常关键的答案就是：

- `Agent`
- `AgentExecutor`

很多初学者第一次看到这两个词时，会有点混：

- `Agent` 是不是已经能跑了？
- `AgentExecutor` 是不是只是一个包装壳？
- 它和工具到底怎么配合？

如果只先记一句话，可以先记这个：

```text
Agent 负责“决定下一步做什么”
AgentExecutor 负责“把这套多步过程真正执行起来”
```

## 574. 先把 Agent 和 AgentExecutor 分开理解

你可以把它们先粗略理解成：

### Agent

更像“大脑里的决策部分”，负责：

- 看当前输入
- 结合已有中间过程
- 判断下一步是直接回答
- 还是继续调用某个工具

也就是说，`Agent` 更偏：

> **决策器。**

### AgentExecutor

更像“外部运行器”，负责：

- 把用户输入交给 Agent
- 接收 Agent 决定的动作
- 真正调用工具
- 把工具结果再喂回去
- 持续循环，直到结束

也就是说，`AgentExecutor` 更偏：

> **执行闭环的调度器。**

所以它不是可有可无的小包装，而是把 Agent 从“会想”变成“能跑”的关键部分。

## 575. 为什么光有 Agent 还不够

因为“能决定下一步”不等于“系统真的把下一步做了”。

你可以想象一下，如果只有 Agent，那么它最多只能产出类似这样的判断：

```text
下一步应该调用 search_docs 工具，参数是 Runnable
```

但这还没真的完成任务。

系统还需要有人继续负责：

- 真把 `search_docs` 调起来
- 拿到工具返回结果
- 把结果追加进上下文
- 再问 Agent 下一步怎么办
- 判断什么时候停止

这些工作，就是 `AgentExecutor` 主要在做。

所以可以把它理解成：

```text
Agent 决定动作
AgentExecutor 执行动作并驱动循环
```

## 576. 如果用最直觉的话说，它其实就在跑这个循环

你可以把 `AgentExecutor` 想成是在后台反复做这件事：

```text
1. 把当前状态交给 Agent
2. Agent 说：下一步该调哪个工具，或者直接结束
3. 如果是工具调用，就去真的执行
4. 拿到工具结果后，记下来
5. 把新结果再次交给 Agent
6. 重复，直到 Agent 说可以结束
```

你看，这其实就是你前面已经学过很多遍的那条闭环：

```text
思考
→ 行动
→ 观察
→ 再思考
```

所以从实现角度说，`AgentExecutor` 干的事情，本质上就是：

> **把 ReAct 这类多步决策模式真的驱动起来。**

## 577. 它和普通 Runnable 链最大的不同是什么

这里特别值得和你前面学的 Runnable 链做个对照。

### 普通链

通常更像：

```text
输入
→ Prompt
→ Model
→ Parser
→ 输出
```

或者：

```text
输入
→ Retriever
→ Prompt
→ Model
→ 输出
```

特点是：

- 路径提前写好
- 节点顺序固定
- 不会在运行时自己决定下一步分支

### AgentExecutor 驱动的 Agent

更像：

```text
输入
→ Agent 判断
→ 调工具 / 或结束
→ 工具结果返回
→ Agent 再判断
→ ...
```

特点是：

- 路径不是预先写死
- 是否继续由运行时决定
- 下一步调用哪个工具也由运行时决定
- 可能循环多轮才结束

所以最本质差别不是“有没有模型”，而是：

> **普通链在编排时决定流程，AgentExecutor 在运行时推进流程。**

## 578. AgentExecutor 典型负责哪些事

如果你从工程实现角度去看，`AgentExecutor` 往往会负责这些核心事情：

- 接收用户输入
- 管理中间步骤
- 调用工具
- 收集 Observation
- 把历史动作和结果回传给 Agent
- 判断是否达到结束条件
- 最终整理输出

你可以发现，这里面很多事情都不是“推理本身”，而是：

> **把推理、工具、反馈、终止条件组织成一个能持续运转的循环。**

这也是为什么它叫 `Executor`，而不是别的名字。

## 579. 一个最小执行图可以怎么理解

你可以先把 LangChain 里的这套关系粗略画成这样：

```text
用户问题
→ AgentExecutor
   → Agent 判断下一步
   → 如果需要工具，就调用 Tool
   → 得到 Observation
   → 再交回 Agent
→ 最终答案
```

如果再展开一点，就是：

```text
User Input
→ AgentExecutor
→ Agent
→ Action
→ Tool
→ Observation
→ Agent
→ Final Answer
```

所以当你以后看到 `AgentExecutor(agent=..., tools=...)` 这种写法时，你脑子里不要只把它看成“初始化对象”。

更应该把它理解成：

> **我正在创建一个能够驱动 Agent 多步执行的运行器。**

## 580. 为什么它通常还要接收 tools

因为 Agent 不只是“想”，还要“做”。

而“做”这件事，往往就是通过工具完成的。

所以在 LangChain 里，常见模式通常是：

- 先定义工具集合
- 再创建 Agent
- 再把 `agent + tools` 交给 `AgentExecutor`

原因很简单：

- Agent 需要知道有哪些外部能力可用
- Executor 需要真的能调用这些能力

也就是说：

- `Agent` 负责决定“该不该用、该用哪个”
- `AgentExecutor` 负责真的去执行这个调用

这两者是配套的。

## 581. 你可以把它类比成什么

一个很实用的类比是：

### Agent

像项目负责人脑子里的判断：

- 先查资料
- 再确认版本
- 然后写结论

### AgentExecutor

像真正推动事情发生的执行系统：

- 去调用搜索
- 去拿回结果
- 去记录中间过程
- 去判断要不要继续下一轮

所以：

```text
Agent 更像“决策核心”
AgentExecutor 更像“执行引擎”
```

这个类比基本够你入门阶段使用了。

## 582. 在 LangChain 代码里你通常会怎么看到它

你后面会经常看到类似这种结构：

```python
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
result = agent_executor.invoke({"input": "什么是 Runnable？"})
```

这里最值得你注意的不是 API 细节，而是它背后的职责分工：

- `create_react_agent(...)` 更偏生成一个“会决定动作的 Agent”
- `AgentExecutor(...)` 更偏创建一个“能把这个 Agent 跑起来的执行器”
- `invoke(...)` 才是真正开始执行这轮任务

所以很多新手以为 Agent 一创建就自动完成所有事情，其实不是。

真正把任务跑起来的，通常是后面的执行器。

## 583. 这东西本质上是在帮你管理“中间步骤”

为什么很多人初学 Agent 时会觉得 `AgentExecutor` 很抽象？

因为他们只盯着最终答案，没有意识到中间其实发生了很多轮：

- 先做了什么判断
- 调了什么工具
- 返回了什么结果
- 为什么继续下一步
- 为什么最后停下

而 `AgentExecutor` 的一个很关键价值，就是把这些中间步骤串起来。

换句话说，它处理的不只是“输入和输出”，更是：

> **输出之前那一整段动态执行过程。**

## 584. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
AgentExecutor 不是在替 Agent 思考
而是在替 Agent 跑完整个“思考-行动-反馈”的循环
```

如果再换一种更口语的话：

```text
Agent 决定下一步干嘛
Executor 负责真的把这件事一轮一轮执行下去
```

只要你把这两句记住，后面再看 LangChain Agent 代码时，就不容易把 `Agent` 和 `AgentExecutor` 混在一起。

## 585. LangChain 里的 Tool 是怎么接进 Agent 的

现在你已经知道：

- Agent 负责决定下一步做什么
- AgentExecutor 负责把循环真的跑起来

那接下来最自然的问题就是：

> **Agent 想调用工具时，LangChain 里的 Tool 到底是什么？它又是怎么接进去的？**

如果只先记一句话，可以先记这个：

```text
Tool 就是“给 Agent 可调用的外部能力接口”
```

也就是说，它不是单纯一个函数名，而是：

- 一个可被模型理解的能力说明
- 一个可被程序真正执行的调用入口

所以 Tool 其实站在两个世界中间：

- 对模型，它是“你可以调用什么”
- 对程序，它是“我该实际执行什么”

## 586. 为什么普通 Python 函数不能直接等于 Tool

很多初学者会想：

- 既然工具本质上就是函数，那我直接写个 Python 函数不就行了吗？

从程序员视角看，这么想很自然。
但从 Agent 视角看，还差一层很关键的东西：

- 函数是给 Python 解释器看的
- Tool 是给“模型 + 执行系统”一起看的

一个普通函数比如：

```python
def get_weather(city: str) -> str:
    return f"{city} 晴"
```

对 Python 来说已经够了。

但对 Agent 来说，还缺少这些关键信息：

- 这个能力是干什么的
- 什么时候该用它
- 参数叫什么
- 参数类型是什么
- 返回结果大致是什么

所以 Tool 不只是“能执行”，还必须“能被模型理解并正确选择”。

## 587. Tool 本质上有两层身份

这是理解 Tool 最关键的一点。

### 第一层：给模型看的声明

这一层回答的是：

- 你有哪些工具可用
- 每个工具叫什么
- 适合处理什么问题
- 需要什么参数

这一层本质上是在帮助模型做动作决策。

### 第二层：给程序跑的实现

这一层回答的是：

- 当模型决定调用某个工具后
- 代码里真正执行哪段逻辑
- 如何把参数传进去
- 如何把结果返回回来

这一层本质上是在让工具调用真正发生。

所以 Tool 不是纯提示词对象，也不是普通函数本身，而是：

> **把“能力说明”和“实际实现”打包在一起的可调用对象。**

## 588. 从 Agent 视角看，Tool 为什么这么重要

因为 Agent 要做的不是只会回答，而是：

- 缺信息时去查
- 需要计算时去算
- 需要读数据库时去取
- 需要调 API 时去拿结果

也就是说，Agent 的“行动能力”大部分都是靠 Tool 提供的。

如果没有 Tool，Agent 再会判断，也只能停留在：

- 分析
- 推测
- 组织语言

它没法真的把外部世界接进来。

所以你可以把 Tool 理解成：

```text
LLM 提供“判断能力”
Tool 提供“行动能力”
```

这两者合在一起，Agent 才更像一个执行者。

## 589. 在 LangChain 里最常见的 Tool 来源是什么

在 LangChain 里，常见工具来源通常有三类：

- 用 `@tool` 把普通函数包装成工具
- 用 `StructuredTool` 明确声明结构化参数
- 使用框架或社区提供的现成工具

你在入门阶段，最常见的通常是第一种。

比如：

```python
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """根据城市获取天气。"""
    return f"{city} 晴"
```

这个时候，它就不再只是一个普通函数了。

它同时具备了：

- 工具名
- 描述信息
- 参数结构
- 实际执行逻辑

也就是说，LangChain 已经开始帮你把“函数”变成“Agent 可用工具”。

## 590. `@tool` 到底帮你做了什么

你可以把 `@tool` 理解成一个转换器。

它做的不是改变函数业务逻辑，而是把这个函数补齐成一个更适合 Agent 体系使用的对象。

通常它会让系统更容易拿到这些信息：

- 工具名称
- 描述说明
- 参数 schema
- 实际调用入口

所以从直觉上说：

```text
原来：只是 Python 函数
加了 @tool 后：变成 Agent 可识别、可调用的工具
```

这就是为什么很多示例里只是加了一个装饰器，整个函数的角色就变了。

## 591. 为什么 docstring 往往也很重要

很多人第一次写 Tool 时，会只写函数名，不写说明。

但对 Agent 来说，函数名往往不够。

比如一个工具叫：

- `search_docs`
- `query_db`
- `fetch_data`

如果没有额外说明，模型未必知道：

- 适合查什么
- 不适合查什么
- 参数应该怎么填
- 应该在什么场景用

所以工具的描述信息，尤其是 docstring，常常很重要。

因为它会直接影响模型是否：

- 选对工具
- 构造对参数
- 在合适的时候调用

这也是为什么前面讲 Tool Calling 时，我们反复强调：

> **description 和 schema，决定工具好不好用。**

## 592. Agent 真正调用 Tool 时，流程是怎样的

把整个过程串起来，你可以这样理解：

```text
1. LangChain 把可用工具列表告诉模型
2. 模型判断：当前问题需要某个工具
3. 模型输出工具调用请求
4. AgentExecutor 识别到这个请求
5. AgentExecutor 找到对应 Tool
6. Tool 的底层函数被真正执行
7. 返回结果作为 Observation 再交回 Agent
8. Agent 决定是否继续或直接结束
```

你会发现，这里 Tool 就像一个桥：

- 上游连接 Agent 的决策
- 下游连接真实函数执行

所以 Tool 在运行时的位置非常关键。

## 593. 一个最小例子怎么读

比如你看到这样的代码：

```python
from langchain_core.tools import tool
from langchain.agents import AgentExecutor, create_react_agent

@tool
def get_weather(city: str) -> str:
    """根据城市获取天气。"""
    return f"{city} 晴"

tools = [get_weather]
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
result = agent_executor.invoke({"input": "北京天气怎么样？"})
```

你应该这样读它：

- `get_weather` 被包装成了 Tool
- `tools = [get_weather]` 表示把这个能力暴露给 Agent
- `create_react_agent(...)` 让 Agent 知道自己有哪些工具可选
- `AgentExecutor(...)` 负责真正执行工具调用
- `invoke(...)` 开始这次任务运行

所以这里不是“函数碰巧被调用了”，而是：

> **这个函数已经被放进 Agent 的动作空间里。**

## 594. 为什么有时还会看到 `StructuredTool`

当工具参数变复杂时，只靠最简单的函数签名可能不够。

这时就经常会看到：

- `StructuredTool`
- 更明确的参数 schema
- 甚至单独定义参数模型

它的核心目标不是让代码显得高级，而是：

- 让模型更稳定地产生正确参数
- 让复杂工具更可控
- 让多参数输入更清晰

所以你可以先把它理解成：

> **比简单 `@tool` 更强调结构化输入的工具定义方式。**

入门阶段你先把 `@tool` 理解透，就已经足够了。

## 595. Tool 和 Tool Calling 之间是什么关系

这也是一个特别容易混的点。

你可以这样区分：

### Tool

更偏代码侧对象，表示：

- 系统里有哪些可用能力
- 每个能力怎么执行

### Tool Calling

更偏模型运行时行为，表示：

- 模型在某一轮里决定请求调用工具
- 并给出工具名和参数

所以它们的关系更像：

```text
Tool 是能力定义
Tool Calling 是能力使用
```

或者说：

- Tool 是静态准备
- Tool Calling 是运行时触发

这两个概念你一定要分开。

## 596. Tool 为什么正好卡在 Agent 学习路径的中间

你现在回头看，会发现整条路线其实很顺：

- 前面学 `Prompt`
- 再学 `Runnable`
- 再学 RAG
- 再学 Tool Calling
- 再学 Agent

为什么 Tool 正好卡在中间？

因为它刚好连接了两边：

- 往前，它延续了“模型如何输出结构化动作”
- 往后，它进入了“系统如何根据动作真的执行任务”

所以 Tool 是从“会说”走向“会做”的关键过渡层。

## 597. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
Tool 不是普通函数的别名
而是 Agent 可理解、可选择、可执行的外部能力接口
```

如果再换一种更口语的话：

```text
函数只是代码
Tool 是把这段代码变成 Agent 真能拿来用的能力
```

只要你把这两句记住，后面再看 LangChain 的 `@tool`、`StructuredTool`、工具列表传给 Agent 这些代码，就会顺很多。

## 598. `create_react_agent(...)` 到底替你拼好了什么

到这里，你已经有了三块关键拼图：

- `Tool` 是给 Agent 用的外部能力接口
- `AgentExecutor` 是真正跑循环的执行器
- ReAct 是 Agent 常见的“边想边做”模式

那接下来最自然的问题就是：

> **`create_react_agent(...)` 到底做了什么，为什么它一调用，好像 Agent 就出来了？**

如果只先记一句话，可以先记这个：

```text
create_react_agent(...) 不是在执行任务
而是在组装一个“按 ReAct 方式做决策”的 Agent
```

也就是说，它更像“搭建决策大脑”，而不是“启动整个系统”。

## 599. 它不是执行器，而是 Agent 的构造器

这是最容易混的一点。

很多人第一次看到：

```python
agent = create_react_agent(llm, tools, prompt)
```

会下意识以为：

- Agent 已经开始工作了
- 工具已经被调用了
- 多轮循环已经开始了

其实都还没有。

这一行更准确的含义是：

- 我正在创建一个 Agent
- 这个 Agent 的决策方式采用 ReAct 风格
- 它知道自己有哪些工具可选
- 它会按指定 prompt 的规则思考和输出动作

所以 `create_react_agent(...)` 更像：

> **把“模型 + 工具描述 + ReAct 提示结构”装配成一个可决策对象。**

## 600. 它最核心是在拼哪几样东西

你可以先把它理解成，至少在拼这几类关键部件：

- 一个 LLM
- 一组工具信息
- 一个 ReAct 风格 prompt
- 一套约定好的输出格式

这几样东西一旦拼起来，Agent 才能做下面这些事：

- 理解当前任务
- 知道自己有哪些工具
- 按 ReAct 风格决定下一步
- 以系统能识别的形式输出动作或最终答案

所以它干的不是“运行”，而是“把可运行的决策逻辑准备好”。

## 601. 为什么这里一定要有 LLM

因为 Agent 的核心能力首先还是判断。

它需要基于当前上下文判断：

- 该不该调用工具
- 该调用哪个工具
- 参数应该是什么
- 现在是否已经足够回答
- 还要不要继续下一轮

这些判断本质上还是要靠 LLM 来完成。

所以 `create_react_agent(...)` 里传入 `llm`，不是形式主义，而是因为：

> **Agent 的“脑子”本来就是模型。**

没有模型，就没有这个决策核心。

## 602. 为什么这里还一定要有 tools

因为 ReAct 不只是“思考”，还要“行动”。

而行动的候选空间，正是 tools 提供的。

把 `tools` 传给 `create_react_agent(...)`，本质上是在告诉 Agent：

- 你有哪些外部能力可以选
- 这些能力分别叫什么
- 每个能力大致适合做什么
- 参数结构是什么

所以从 Agent 的视角看，这一步相当于在建立它的“动作菜单”。

如果没有 `tools`，很多 ReAct Agent 就会变成：

- 会分析
- 会规划
- 但没法真正行动

所以工具并不是附属品，而是 Agent 动作空间的一部分。

## 603. 为什么还要传 prompt

这是另一个非常关键、但容易被低估的点。

很多人会以为：

- 既然都叫 `create_react_agent` 了
- 那是不是内部已经自动决定一切了？

其实不是。

`prompt` 往往决定了 Agent 如何：

- 理解自己的角色
- 使用工具
- 组织 Thought / Action 风格
- 遵守输出格式
- 在何时结束

也就是说，`create_react_agent(...)` 并不是凭空生成一个 Agent，而是：

> **把你提供的 prompt 作为这套决策机制的重要一部分装进去。**

所以 prompt 对 Agent 的影响，通常比新手想象得大很多。

## 604. 你可以把它理解成“组装一个会做动作决策的链”

如果用更贴近你前面学过的 LangChain 思维来看，`create_react_agent(...)` 本质上不是凭空造魔法，而更像是在组装一个特殊的 Runnable/Chain：

- 输入当前问题和中间过程
- 交给 prompt 组织上下文
- 用 LLM 做决策
- 输出“下一步动作”或“最终答案”

只是这个链不再是普通问答链，而是：

> **一个专门为多步 Agent 决策服务的链。**

这样理解，你就不会觉得 Agent 和前面学过的 Runnable 世界完全断裂。

## 605. 它产出的 Agent，真正会输出什么

从直觉上说，这个 Agent 不一定每次都直接输出自然语言答案。

它在某一轮里，可能输出的是两大类东西：

### 第一类：动作决策

也就是：

- 该调用哪个工具
- 参数是什么

### 第二类：最终回答

也就是：

- 现在信息已经够了
- 可以停止工具调用
- 直接给用户答案

所以你可以把 `create_react_agent(...)` 产出的东西理解成：

```text
一个能在“继续行动”和“结束回答”之间做判断的决策器
```

这也是它和普通问答链很不一样的地方。

## 606. 为什么它和普通 Prompt + Model 不完全一样

表面上看，好像也只是：

- 一个 prompt
- 一个 model
- 再加一点东西

但关键差别在于：

普通 Prompt + Model 更像是：

- 让模型一次性回答

而 `create_react_agent(...)` 更像是：

- 让模型按 Agent 协议做决策
- 输出可供下一步执行的动作
- 或在合适的时候输出终止结果

所以它并不只是“再包一层 prompt”，而是在建立一种不同的运行角色。

也就是：

> **从“回答者”切换成“决策者”。**

## 607. 它和 `AgentExecutor` 的分工怎么记最稳

这个地方建议你强行记一组对照，不然后面很容易混：

### `create_react_agent(...)`

负责：

- 构造 Agent
- 注入 ReAct 风格决策能力
- 告诉 Agent 有哪些工具
- 规定 Agent 按什么 prompt 来思考和输出

### `AgentExecutor(...)`

负责：

- 驱动 Agent 真正开始执行
- 接工具调用请求
- 调用工具
- 回填 Observation
- 持续循环直到结束

所以把它压成一句对照就是：

```text
create_react_agent 负责“造出会决策的 Agent”
AgentExecutor 负责“把这个 Agent 跑起来”
```

这句非常值得死记。

## 608. 一个最小例子应该怎么读

比如你看到：

```python
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
result = agent_executor.invoke({"input": "北京天气怎么样？"})
```

你应该把它拆成三句理解：

- 第一行：创建一个具备 ReAct 决策能力的 Agent
- 第二行：创建一个负责执行循环的运行器
- 第三行：真正启动这次任务

如果你能这样读，就已经不会把这三个层次混掉。

## 609. 为什么很多初学者会误会它“已经包含了一切”

因为名字确实很像“全自动完成 Agent”。

但实际上，它主要解决的是：

- Agent 如何思考
- Agent 如何知道可用工具
- Agent 如何输出下一步动作

它不直接替你完成的，是：

- 工具执行循环
- 中间步骤管理
- 终止控制
- 整个任务运行过程

这些更多是 `AgentExecutor` 的责任。

所以如果你把 `create_react_agent(...)` 看成“Agent 大脑组装器”，通常就不容易理解错。

## 610. 为什么这一步在学习路径里很关键

因为到这里，你终于把 Agent 的三层结构连起来了：

- `Tool`：外部能力
- `create_react_agent(...)`：决策大脑
- `AgentExecutor`：运行引擎

这三层一旦串起来，后面你再看 LangChain Agent 代码时，就不再只是看到一堆 API 名字，而会看到一套完整角色分工。

也就是说，你已经开始从：

- “我会抄示例”

慢慢过渡到：

- “我知道每一层为什么存在”

这一步非常重要。

## 611. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
create_react_agent 不是在跑 Agent
而是在把 LLM、tools、prompt 组装成一个按 ReAct 方式决策的 Agent
```

如果再换一种更口语的话：

```text
它负责把“大脑”搭起来
真正让事情跑起来的是后面的 Executor
```

只要你把这两句记住，后面再看 `create_react_agent(...)` 这类代码，就不会误以为“创建 Agent = 已经执行任务”。

## 612. 一次完整 Agent 运行时，数据到底是怎么流动的

到这里，你已经把 Agent 的几个核心角色分开理解了：

- `Tool`
- `create_react_agent(...)`
- `AgentExecutor`

接下来最重要的一步，就是把这些零件重新放回一条完整运行时里。

因为只有你真的看清：

- 输入怎么进去
- 动作怎么出来
- 工具结果怎么回来
- 最终答案怎么生成

你才算真正理解 Agent 不是“一个黑箱 API”，而是一条动态循环的数据流。

如果只先记一句话，可以先记这个：

```text
一次 Agent 运行，本质上是在“输入 -> 决策 -> 动作 -> 反馈 -> 再决策 -> 结束”之间循环
```

## 613. 先看最粗的一条主线

你可以先把一次完整运行压缩成下面这样：

```text
用户输入
→ Agent 判断下一步
→ 如果需要，就调用工具
→ 工具返回结果
→ Agent 根据结果继续判断
→ 直到可以给出最终答案
```

如果你已经学过 ReAct，就会立刻发现：

- 这里的“判断”就是 `Thought`
- “调用工具”就是 `Action`
- “工具返回结果”就是 `Observation`

所以一次完整 Agent 运行，本质上就是把 ReAct 闭环不断跑下去。

## 614. 第 1 步：用户输入先进入哪里

从运行时角度看，最开始通常是这样的：

```python
result = agent_executor.invoke({"input": "北京天气怎么样？"})
```

这意味着：

- 用户问题先进入 `AgentExecutor`
- 不是直接跳过执行器进到工具
- 也不是直接立刻得到最终答案

执行器收到这个输入后，接下来会做的不是马上回答，而是：

> **把当前任务状态交给 Agent 去判断下一步。**

这一步很关键。
因为 Agent 系统的第一反应不是“回答”，而是“先判断现在该做什么”。

## 615. 第 2 步：Agent 会先产出“下一步动作”还是“最终答案”

这是 Agent 和普通问答链最不同的地方之一。

普通问答链通常默认目标是：

- 直接给答案

但 Agent 在每一轮里，首先要做的是判断：

- 现在信息够不够
- 要不要用工具
- 如果用，应该用哪个
- 参数是什么
- 还是说现在就可以直接结束

所以 Agent 的一次输出，不一定是最终答案。

它更可能先产出的是：

- 一个工具调用决策
- 或一个结束决策

也就是说，Agent 的输出类型天然就是分叉的。

## 616. 如果 Agent 决定调用工具，接下来会发生什么

假设 Agent 判断：

- 现在缺真实天气信息
- 需要调用 `get_weather`
- 参数是 `city="北京"`

那这时它输出的就不再是普通自然语言答案，而更像是一条动作请求。

接下来通常发生的是：

```text
Agent 产出 Action
→ AgentExecutor 识别这是工具调用请求
→ Executor 找到对应 Tool
→ Tool 底层函数被执行
```

也就是说：

- Agent 负责“提出动作”
- Executor 负责“让动作真正发生”

你一定要把“决定调用”和“真的执行”分开。

## 617. 第 3 步：Tool 返回的结果为什么叫 Observation

当工具真正跑完后，会得到结果，比如：

```text
北京今天晴，26 度
```

这时这个结果不会直接当成最终答案发给用户。

而是会先变成：

- 当前轮动作的反馈
- 也就是 `Observation`

为什么这个词非常重要？

因为它提醒你：

> **工具结果不是流程终点，而是下一轮决策的输入。**

这正是 Agent 和“单次工具调用问答”最关键的区别之一。

如果没有 Observation 这个回填动作，系统就只是：

- 调一次工具
- 拿一次结果
- 直接结束

那就更像普通工具增强问答，而不是完整 Agent 闭环。

## 618. 第 4 步：Observation 会回到哪里

Observation 拿到后，通常不会停在执行器手里。

它真正的作用是：

- 被加入当前中间过程
- 再一起喂回 Agent
- 让 Agent 基于新事实判断下一步

所以数据流更准确地说是：

```text
用户输入
→ Agent
→ Action
→ Tool
→ Observation
→ Agent
→ ...
```

你可以看到，Agent 不是只在开头出现一次。

它会反复收到：

- 原始问题
- 已经做过的动作
- 各轮返回的 Observation

然后继续判断。

## 619. 为什么会有“中间步骤”这个东西

因为一次 Agent 运行通常不是单轮，而是多轮。

它需要记住：

- 前面已经调过什么工具
- 每次工具返回了什么
- 哪些信息已经拿到了
- 还缺什么
- 为什么要继续，或者为什么可以停

这些内容合起来，就是很多框架里常说的：

- `intermediate steps`
- `agent scratchpad`
- 中间轨迹
- 动作历史

你不需要一开始就死记这些术语，但要理解本质：

> **Agent 之所以能多步推进，是因为它不是只看当前问题，还会看已经发生过的执行过程。**

## 620. 一个最小运行例子可以怎么想

比如用户问：

```text
北京天气怎么样？顺便告诉我适不适合跑步。
```

一次可能的运行过程可以这样理解：

```text
用户输入：北京天气怎么样？顺便告诉我适不适合跑步。

Agent 判断：需要先查天气
Action: get_weather(city="北京")

Tool 返回：晴，26 度
Observation: 晴，26 度

Agent 再判断：天气信息已经有了，现在可以结合常识给建议
Final Answer: 北京今天晴，26 度，适合跑步，但建议避开中午高温时段。
```

这个例子里你就能清楚看到：

- 第一次 Agent 没有直接回答
- 它先做了动作决策
- 工具结果回来后
- 才进入最终回答

这就是完整数据流的最小闭环。

## 621. 如果一次工具调用还不够，会怎样

这正是 Agent 最有价值的地方。

如果第一轮 Observation 回来后，Agent 发现：

- 信息还不够
- 结果有冲突
- 还需要换另一个工具
- 或者需要进一步细化查询

那它就不会结束，而会继续下一轮。

例如：

```text
输入问题
→ 搜天气
→ Observation 回来
→ 发现还缺空气质量
→ 再调空气质量工具
→ Observation 回来
→ 再综合给答案
```

所以 Agent 不是“一次调用工具的问答器”，而是：

> **一个能根据反馈持续推进任务的数据流系统。**

## 622. 最终答案是在什么时候产生的

最终答案并不是“工具一有结果就自动出现”。

它出现的条件通常是：

- Agent 判断信息已经足够
- 当前没有必要继续调用工具
- 可以把已有 Observation 整合成对用户有用的回答

也就是说，最终答案本质上仍然是 Agent 的决策结果之一。

所以从运行时角度看：

- 工具结果是事实输入
- 最终答案是 Agent 基于这些事实做出的结束输出

这个边界要非常清楚。

## 623. 为什么这条数据流一旦看清，很多概念就不乱了

因为你前面学过的很多词，其实都只是这条流里的不同位置：

- `Tool`：动作能力
- `Action`：动作请求
- `Observation`：动作反馈
- `AgentExecutor`：循环驱动器
- `Final Answer`：终止输出
- `intermediate steps`：中间轨迹

一旦你把它们都放到同一条运行时流里看，就会发现：

> **这些不是分散的 API 名词，而是一套连续协作机制。**

这一步一通，后面你看 LangChain、LangGraph、甚至别的 Agent 框架都会更顺。

## 624. 和普通链的数据流差别到底在哪

你可以最后再和普通链对照一次。

### 普通链

更像：

```text
输入
→ Prompt
→ Model
→ 输出
```

### Agent

更像：

```text
输入
→ 决策
→ 动作
→ 反馈
→ 再决策
→ ...
→ 结束输出
```

普通链的核心是：

- 一次通过

而 Agent 的核心是：

- 基于反馈的循环推进

这就是两者最本质的不同。

## 625. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
Agent 运行时最重要的不是“调用了工具”
而是“工具结果会继续流回系统，推动下一步决策”
```

如果再换一种更口语的话：

```text
不是查一下就完了
而是查完以后，系统会根据结果继续往下走
```

只要你把这两句记住，后面再看 Agent 日志、Action/Observation 轨迹、LangChain 的中间步骤机制，就会顺很多。

## 626. `agent_scratchpad` 到底是什么

你前面已经知道，一次 Agent 运行不是单轮的。

它会不断经历：

- 决策
- 调工具
- 收到 Observation
- 再决策

那问题来了：

> **这些已经发生过的中间过程，到底放在哪？Agent 下一轮是怎么看见它们的？**

在 LangChain 语境里，一个非常高频的答案就是：

- `agent_scratchpad`

如果只先记一句话，可以先记这个：

```text
agent_scratchpad 就是“Agent 当前这轮运行过程中的中间轨迹输入区”
```

它不是用户问题，也不是最终答案，而是：

- 已发生动作的记录
- 已返回 Observation 的记录
- 供 Agent 下一轮继续判断的上下文

## 627. 为什么 Agent 需要这个东西

因为 Agent 不是每一轮都从零开始想。

如果系统不把前面发生过的事情重新喂回去，Agent 就会像失忆一样：

- 不知道自己刚调过什么工具
- 不知道工具刚返回了什么
- 不知道当前离目标还差多少
- 不知道为什么要继续或停止

那多步执行几乎就跑不起来。

所以 `agent_scratchpad` 的核心作用就是：

> **让 Agent 在下一轮决策时，看得见自己已经做过什么。**

这本质上就是前面讲的“中间步骤回流”。

## 628. 它和 `chat_history` 有什么根本区别

这是一个特别容易混的点。

因为你前面已经学过：

- `MessagesPlaceholder("chat_history")`

所以很多人一看到：

- `MessagesPlaceholder("agent_scratchpad")`

就会下意识以为：

- 它们都是“历史消息”

其实不是一回事。

### `chat_history`

更偏：

- 用户和助手之前的对话历史
- 关注多轮会话连续性
- 解决“用户这次问题省略了上下文”这类问题

### `agent_scratchpad`

更偏：

- 当前这次 Agent 执行内部已经发生过的动作轨迹
- 关注工具调用过程
- 解决“Agent 下一步决策要参考前面动作结果”这类问题

所以最简单的区分是：

```text
chat_history 是“对话历史”
agent_scratchpad 是“执行历史”
```

这两个词非常容易混，但职责完全不同。

## 629. 为什么它经常出现在 Agent prompt 里

因为 Agent 本质上是靠 prompt + model 做决策的。

而如果模型想在下一轮里知道：

- 上一轮调了什么工具
- 返回了什么 Observation
- 当前还差什么

那这些内容就必须被放进 prompt 上下文里。

也就是说，`agent_scratchpad` 的出现并不是为了好看，而是因为：

> **中间步骤如果不进入 prompt，模型下一轮就“看不见”它们。**

所以在很多 Agent prompt 里你才会经常看到它。

## 630. 你可以把它理解成一个专门给 Agent 留的插槽

如果借用你前面已经学过的 `MessagesPlaceholder` 思维，那么：

- `chat_history` 是对话历史插槽
- `agent_scratchpad` 是执行轨迹插槽

它们本质上都是“运行时动态注入内容的位置”。

区别只在于注入的内容不同：

- 一个注入用户/助手历史对话
- 一个注入 Agent 运行中的动作与反馈

所以你可以先把 `agent_scratchpad` 直觉理解成：

> **Prompt 里预留给中间步骤回填的位置。**

这个理解非常有用。

## 631. 一个最小 prompt 长什么样

你后面经常会看到类似这种结构：

```python
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个会使用工具的助手。必要时调用工具来完成任务。"),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])
```

这段代码里最关键的，不是语法，而是它表达的结构：

- `system`：告诉 Agent 应该怎么做
- `human`：当前用户任务
- `agent_scratchpad`：把之前已经发生过的动作轨迹插回来

也就是说，模型每轮不是只看到用户问题，而是看到：

- 当前任务
- 以及当前任务已经执行到了哪里

这就为下一轮决策提供了基础。

## 632. 它里面通常会放什么

从本质上说，`agent_scratchpad` 里放的是：

- 前面几轮的 Action
- 对应的 Observation
- 有时还包括与之配套的思考轨迹表达形式

你不必死记某个框架的具体序列化格式，但一定要理解它承载的信息类型：

```text
我刚才做了什么
结果是什么
所以接下来应该怎么继续
```

也就是说，`agent_scratchpad` 不是普通备注，而是：

> **帮助 Agent 维持多步推进行为连续性的上下文。**

## 633. 为什么没有它，Agent 容易表现得很傻

因为没有中间步骤回填，模型下一轮很可能会：

- 重复调用刚才同一个工具
- 忘记已经拿到过结果
- 无法基于 Observation 做进一步推理
- 提前结束
- 或者一直兜圈子

这其实很好理解。

如果你让一个人做多步任务，但每完成一步就把前面记录擦掉，他下一步当然容易混乱。

所以很多 Agent 看起来“变聪明”的关键，未必只是模型更强，而是：

> **系统有没有把中间轨迹正确回流给模型。**

## 634. 它和最终答案是什么关系

`agent_scratchpad` 不是给用户看的最终输出区。

它更像内部工作区。

也就是说：

- 最终答案是面向用户的
- `agent_scratchpad` 是面向 Agent 自己下一轮决策的

这两个层次你一定要分清：

```text
Final Answer 是对外输出
agent_scratchpad 是对内回填
```

所以你看到它出现在 prompt 里，不要把它理解成“额外聊天内容”，而要理解成“给 Agent 自己看的执行痕迹”。

## 635. 为什么它和 ReAct 会天然连在一起

因为 ReAct 本来就是：

- Thought
- Action
- Observation
- 再继续

而这类模式一旦要进入真实运行时，就必须有一个地方把前面已经发生的 Action / Observation 保存并再喂回去。

很多时候，这个位置就是 `agent_scratchpad`。

所以你可以把它理解成：

> **ReAct 闭环在 prompt 层的承载位置之一。**

这样看，你会发现它不是新概念，而只是前面运行时闭环的一个具体落点。

## 636. 一个最小运行直觉例子

比如：

```text
用户问题：北京天气怎么样？适合跑步吗？
```

第一轮时，模型可能看到：

- 用户问题
- 空的 `agent_scratchpad`

于是它决定：

```text
Action: get_weather(city="北京")
```

工具返回后，系统把结果整理进 `agent_scratchpad`。

第二轮时，模型看到的就不再只是原问题，而更像：

```text
用户问题：北京天气怎么样？适合跑步吗？

agent_scratchpad:
- Action: get_weather(city="北京")
- Observation: 晴，26 度
```

这时它才更有条件继续判断：

- 现在信息够了
- 可以结束并回答

这就是 `agent_scratchpad` 的实际意义。

## 637. 为什么这一步在学习路径里特别关键

因为到这里，你已经不只是理解 Agent 的外部表现了。

你开始理解它在 prompt 层到底怎么把多步执行串起来。

也就是说，你现在已经把这几层慢慢对上了：

- 运行时有中间步骤
- 中间步骤需要回流
- 回流要进入 prompt
- `agent_scratchpad` 就是这个承载位置之一

一旦这一步通了，后面你再看：

- Agent prompt
- ReAct prompt
- 中间步骤格式化
- LangChain Agent 输出解析

都会自然很多。

## 638. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
agent_scratchpad 不是聊天历史
而是 Agent 把“已经做过的动作和拿到的结果”喂回给自己的地方
```

如果再换一种更口语的话：

```text
它不是在记你和模型聊过什么
而是在记 Agent 刚才已经干了什么
```

只要你把这两句记住，后面再看 Agent prompt 里的 `agent_scratchpad`，就不会把它和普通对话历史混在一起。

## 639. LangChain 为什么还需要 `output parser`

到这里，你已经知道：

- Agent 会基于 prompt 做决策
- 它有时会决定调用工具
- 有时会决定直接给最终答案
- `agent_scratchpad` 会把中间步骤再喂回去

那接下来一个非常关键的问题就是：

> **模型这一轮吐出来的内容，系统到底怎么知道它表示“继续行动”还是“已经结束”？**

这里就会牵涉到一个非常关键的角色：

- `output parser`

如果只先记一句话，可以先记这个：

```text
在 Agent 里，output parser 的核心作用是把模型输出解释成“动作”或“结束”这两类系统可执行结果
```

## 640. 为什么 Agent 比普通链更依赖解析

你前面学普通链时，parser 主要经常负责：

- 把输出转成字符串
- 把输出转成 JSON
- 把输出转成结构化字段

但在 Agent 里，问题更进一步了。

系统不只是想知道“输出长什么样”，而是还必须知道：

- 这是让系统继续调用工具
- 还是告诉系统可以停止
- 如果要调工具，工具名是什么
- 参数是什么
- 如果结束，最终答案是什么

也就是说，Agent 里的 parser 不只是“格式整理器”，而更像：

> **模型决策和执行系统之间的翻译器。**

## 641. 为什么不能让系统“凭感觉”猜

因为模型输出本质上还是文本或消息。

如果没有明确解析层，执行系统就会很难稳定判断：

- 这是普通解释文字
- 还是工具调用请求
- 这是中间步骤
- 还是最终答案

一旦这里判断不稳，整个 Agent 系统就会很危险：

- 该调工具时没调
- 不该调时乱调
- 该结束时没结束
- 不该结束时提前停

所以 parser 的意义不是“代码优雅一点”，而是：

> **让系统能稳定识别模型当前轮到底表达了什么动作意图。**

## 642. 从运行时角度看，它到底在解析什么

把事情说得最直白一点，Agent parser 在解析的核心其实只有两大类：

### 第一类：继续行动

也就是：

- 要调用哪个工具
- 参数是什么

### 第二类：结束回答

也就是：

- 不再调用工具
- 直接把最终答案返回给用户

所以你可以把它压缩成一句最重要的话：

```text
Agent parser 最核心的任务，就是判断这轮输出属于“Action”还是“Final Answer”
```

这个判断非常关键。

## 643. 为什么经常会看到 `AgentAction` 和 `AgentFinish`

因为在很多 LangChain Agent 实现里，解析后的结果往往就会落到两类典型对象语义上：

- `AgentAction`
- `AgentFinish`

你现在不需要死记某个类的源码细节，但一定要理解这两个名字背后的意思。

### `AgentAction`

表示：

- 这一轮还没结束
- Agent 决定调用某个工具
- 系统下一步应该执行动作

### `AgentFinish`

表示：

- 这一轮已经可以结束
- 不再需要工具
- 系统应该把最终答案返回出去

所以从运行时分支上看，其实非常清晰：

```text
模型输出
→ parser 解析
→ 要么 AgentAction
→ 要么 AgentFinish
```

一旦你把这条线看懂，Agent 的运行逻辑就会清楚很多。

## 644. 这和前面讲的数据流是怎么接上的

你前面已经学过完整 Agent 数据流：

```text
输入
→ Agent 决策
→ 动作
→ Observation
→ 再决策
→ 最终答案
```

那 parser 放在这里的位置，大致可以理解成：

```text
输入
→ Prompt
→ Model
→ Output Parser
→ Action 或 Final Answer
```

也就是说，parser 是把“模型原始输出”正式接入“系统运行分支”的关键一环。

没有这一步，执行器就不知道下一步应该走哪条路。

## 645. 一个最小直觉例子怎么理解

比如模型这一轮输出的是：

```text
Action: get_weather
Action Input: {"city": "北京"}
```

那 parser 看到后，会把它理解成：

- 不是最终答案
- 而是一次工具调用请求

于是系统下一步就该：

- 找工具
- 执行工具
- 拿 Observation
- 再继续下一轮

而如果模型输出的是：

```text
Final Answer: 北京今天晴，26 度，适合跑步。
```

parser 就会把它理解成：

- 这一轮结束
- 不再调用工具
- 直接把答案返回给用户

所以 parser 在 Agent 里最本质的作用，就是：

> **替系统判断“接下来是执行动作，还是结束任务”。**

## 646. 为什么这件事在 ReAct Agent 里尤其重要

因为 ReAct 的典型运行方式，本来就依赖这种分叉：

- 有时输出 Action
- 有时输出 Final Answer

所以 ReAct prompt 只是告诉模型“应该按这种方式表达”。

但真正把这种表达变成系统行为的，是 parser。

也就是说：

- Prompt 负责约束模型怎么说
- Parser 负责判断系统该怎么做

这两者是配套关系。

如果只有 prompt，没有稳定 parser，那么系统依然可能接不住模型输出。

## 647. 为什么说 parser 也是 Agent 协议的一部分

因为 Agent 不是纯聊天。

它本质上是在运行一种“模型输出要被系统继续消费”的协议。

这个协议至少要能表达：

- 调哪个工具
- 参数是什么
- 什么时候结束
- 结束时输出什么

而 parser，正是负责把模型输出还原成这套协议语义的人。

所以从更高一层看，parser 不是附加件，而是：

> **Agent 协议落地时不可缺的一部分。**

## 648. 它和 `agent_scratchpad` 的关系是什么

这两个角色刚好一前一后，特别值得一起记。

- `agent_scratchpad` 负责把过去发生过的动作和 Observation 喂回给模型
- `output parser` 负责把模型这一轮的新输出重新翻译成系统可执行结果

也就是说：

```text
过去的轨迹 -> 通过 scratchpad 回流给模型
新的决策 -> 通过 parser 还原给系统
```

这个闭环一旦成立，Agent 才能持续往下跑。

所以你可以把它们看成：

- 一个负责“把旧信息送进模型”
- 一个负责“把新决策送回系统”

这组对照非常值得记。

## 649. 为什么很多初学者会忽略 parser 的重要性

因为他们往往只看到两头：

- prompt
- tool

于是会误以为：

- 模型自己会说清楚
- 系统自然就能懂

但真实工程里，中间缺的正是这个“可稳定解释输出”的层。

如果没有 parser 或解析协议不稳，系统很容易出现：

- 模型输出稍微变形就无法执行
- 文本里混入额外解释导致解析失败
- 工具名和参数抽取不稳定
- 结束信号识别不稳定

所以很多 Agent 系统真正难的地方，不只是“让模型更聪明”，还包括：

> **让模型输出稳定落到系统可执行语义上。**

而 parser 正是在承担这件事。

## 650. 这和普通 `StrOutputParser` 的直觉差别在哪里

普通 `StrOutputParser` 更像：

- 把模型输出当成文本结果接走

但 Agent parser 更像：

- 把模型输出当成“下一步系统指令”去识别

所以两者虽然都叫 parser，但工作目标并不在一个层级上。

最简单的对照可以记成：

```text
普通 parser：关心输出内容长什么样
Agent parser：关心系统接下来该做什么
```

这句特别关键。

## 651. 一个最值得记住的运行时分叉图

你可以把 Agent parser 的工作压成下面这张最小图：

```text
Model Output
→ Output Parser
→ AgentAction  -> 调工具 -> Observation -> 下一轮
→ AgentFinish  -> 返回最终答案
```

只要你脑子里有这张图，后面再看 LangChain Agent 代码时，就不容易迷路。

## 652. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
在 Agent 里，output parser 不是单纯整理格式，而是在判断“下一步继续行动，还是现在结束”
```

如果再换一种更口语的话：

```text
它不是只在看模型说了什么
而是在替系统判断接下来该干什么
```

只要你把这两句记住，后面再看 `AgentAction`、`AgentFinish`、ReAct 输出格式这些内容，就会顺很多。

## 653. LangChain Agent 的完整最小代码，应该怎么一行一行读

到这里，你其实已经把 Agent 的关键零件都学过了：

- `Tool`
- `create_react_agent(...)`
- `AgentExecutor`
- `agent_scratchpad`
- `output parser`

下一步最重要的，不是再背新术语，而是把这些零件重新装回一段最小代码里。

因为只有当你能把一段 Agent 代码逐行看懂，你才算真的从“概念理解”进入“能自己写”。

如果只先记一句话，可以先记这个：

```text
一段最小 Agent 代码，本质上是在把“能力、决策、执行、回流”这四件事接起来
```

## 654. 先看一段最小代码

你可以先看下面这段：

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """根据城市获取天气。"""
    return f"{city} 晴，26 度"

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个会使用工具的助手。必要时调用工具；如果信息已足够，就直接回答。"),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])

tools = [get_weather]
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)
result = agent_executor.invoke({"input": "北京天气怎么样？适合跑步吗？"})
```

这段代码不长，但里面已经把 Agent 的关键角色都串起来了。

## 655. 第 1 行到第 3 行在做什么

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
```

这三行本质上是在引入三类能力：

- Agent 构造与执行
- Prompt 组织
- Tool 定义

你可以直接把它们对应到你前面学过的三层：

- `tool`：外部能力接口
- `create_react_agent`：决策大脑组装器
- `AgentExecutor`：运行引擎

所以从一开始，这段代码的骨架就已经出来了。

## 656. `@tool` 这几行为什么是 Agent 的“行动能力”来源

```python
@tool
def get_weather(city: str) -> str:
    """根据城市获取天气。"""
    return f"{city} 晴，26 度"
```

你前面已经知道：

- 普通函数只是代码
- `Tool` 才是 Agent 真能调用的能力接口

所以这里最关键的不是函数本身多复杂，而是：

- `get_weather` 被包装成了 Tool
- Agent 后面才有可能把它当成可选动作

也就是说，这几行代码负责的是：

> **给 Agent 准备一个可行动的外部能力。**

## 657. `prompt` 这段代码到底在规定什么

```python
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个会使用工具的助手。必要时调用工具；如果信息已足够，就直接回答。"),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),
])
```

这里不是单纯在写提示词，而是在定义 Agent 每轮决策时能看到什么。

### `system`

负责规定角色和行为边界：

- 你可以用工具
- 什么时候该用
- 什么时候可以直接结束

### `human`

负责放当前任务输入。

### `agent_scratchpad`

负责把前面已经发生过的动作与 Observation 回填进来。

所以这一段本质上决定的是：

```text
Agent 每一轮决策时看到的上下文结构
```

这一点特别重要。

## 658. 为什么这里必须有 `MessagesPlaceholder("agent_scratchpad")`

因为如果没有它，模型每一轮就几乎只能看到：

- system 规则
- 当前用户问题

但看不到：

- 前面已经调过什么工具
- 工具返回了什么结果
- 现在距离结束还差多少

这样 Agent 很容易：

- 重复调用工具
- 忘记 Observation
- 无法多步推进

所以这一行虽然短，但它承担的是：

> **让中间步骤能够重新进入下一轮决策上下文。**

也就是说，它是多步 Agent 能成立的关键接口之一。

## 659. `tools = [get_weather]` 这一行为什么不能省略

```python
tools = [get_weather]
```

很多人会觉得这行很机械，好像只是把函数塞进列表。

但实际上，这行表达的是非常重要的一件事：

- 当前 Agent 有哪些动作能力可以选

如果没有这行，后面的 Agent 就没有明确的工具集合可用。

所以从直觉上说：

```text
这不是普通列表
而是 Agent 的“动作菜单”
```

这个理解非常有帮助。

## 660. `create_react_agent(...)` 这一行到底应该怎么读

```python
agent = create_react_agent(llm, tools, prompt)
```

这一行你现在应该已经能比之前读得深很多了。

它不是：

- 开始执行任务
- 直接调用工具
- 自动跑完整个流程

它真正做的是：

- 把 `llm` 作为决策核心接进去
- 把 `tools` 作为动作空间接进去
- 把 `prompt` 作为决策规则接进去
- 组装出一个按 ReAct 风格做选择的 Agent

所以最准确的读法是：

> **创建一个“会判断下一步该行动还是该结束”的 Agent。**

## 661. `AgentExecutor(...)` 这一行又在做什么

```python
agent_executor = AgentExecutor(agent=agent, tools=tools)
```

这一行不是在补充一点配置，而是在把前面的 Agent 真正放进运行系统里。

它负责的核心事情包括：

- 接收用户输入
- 调用 Agent 做决策
- 识别是否要执行工具
- 真正执行工具
- 收集 Observation
- 再把中间步骤喂回去
- 持续循环直到结束

所以它本质上是在做：

> **把“会决策的 Agent”升级成“能完整跑任务的系统”。**

## 662. `invoke(...)` 才是任务真正开始的地方

```python
result = agent_executor.invoke({"input": "北京天气怎么样？适合跑步吗？"})
```

这一行非常重要，因为它才是真正启动本次运行的地方。

也就是说：

- `Tool` 定义好了
- `prompt` 定义好了
- `Agent` 组装好了
- `Executor` 也准备好了

但在 `invoke(...)` 之前，它们都还是“待命状态”。

真正开始一次 Agent 任务，是从这里开始的。

这就是为什么前面我们一直强调：

```text
创建 Agent ≠ 已经执行任务
```

## 663. 如果把整段代码翻译成中文，会是什么

你其实可以把这段代码直接翻译成一段非常口语的话：

```text
先定义一个天气工具
再告诉模型：你是一个必要时会调用工具的助手
还要给模型留一个位置，专门放前面已经执行过的中间步骤
然后把模型、工具、提示词组装成一个 ReAct Agent
再用 AgentExecutor 驱动它运行
最后把用户问题真正送进去执行
```

如果你能把一段代码读成这种中文解释，说明你已经真的看懂它了。

## 664. 这段代码在运行时大概会经历什么

这也是你现在非常适合建立的直觉。

对这个问题：

```text
北京天气怎么样？适合跑步吗？
```

系统大致可能这样跑：

```text
1. 输入先进入 AgentExecutor
2. Agent 看 prompt + input + 空的 scratchpad
3. Agent 决定先调 get_weather
4. output parser 把输出识别成 AgentAction
5. Executor 执行工具
6. 得到 Observation：晴，26 度
7. Observation 被回填进 agent_scratchpad
8. Agent 再看一轮上下文
9. 决定现在可以给最终答案
10. parser 识别成 AgentFinish
11. Executor 返回最终结果
```

你看，前面学过的所有概念几乎都在这条线上出现了。

## 665. 为什么这段最小代码很值得反复读

因为它几乎是理解 LangChain Agent 的一个最小闭环模板。

通过它，你能同时看见：

- Tool 在哪
- Prompt 在哪
- scratchpad 在哪
- Agent 在哪
- Executor 在哪
- 任务从哪开始

也就是说，它不是“一个 demo”，而是：

> **把 Agent 关键构件全部摆在台面上的结构图。**

所以你后面看更复杂的 Agent 代码时，不要急着被细节带走，先回到这段最小结构上对照。

## 666. 你现在最应该形成的阅读顺序

以后再看到 Agent 代码，我建议你都按这个顺序读：

1. 先找 Tool 定义
2. 再找 Prompt 结构
3. 再看有没有 `agent_scratchpad`
4. 再看 Agent 是怎么创建的
5. 再看 Executor 是怎么驱动的
6. 最后看 `invoke(...)` / `stream(...)` 从哪里开始

这个顺序非常实用。

因为它能帮你快速把“哪些是能力、哪些是规则、哪些是执行入口”分清。

## 667. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
最小 Agent 代码不是几行 API 的拼接，而是在把 Tool、Prompt、Agent、Executor 这些角色按运行顺序接起来
```

如果再换一种更口语的话：

```text
你不是在看几行库代码
而是在看一个会“先判断、再行动、再根据结果继续”的小系统
```

只要你把这两句记住，后面再看 LangChain Agent 示例，就不容易只停留在“会抄代码”这一步。

## 668. 为什么 LangGraph 会出现

到这里，你其实已经把经典 LangChain Agent 的最小闭环学得很完整了：

- Tool
- Prompt
- Agent
- AgentExecutor
- scratchpad
- parser

这时候再往前走，一个非常自然的问题就是：

> **既然 AgentExecutor 已经能跑 Agent 闭环了，为什么后来还会出现 LangGraph？**

如果只先记一句话，可以先记这个：

```text
LangGraph 出现，不是为了替代 Agent，而是为了把更复杂、更可控的多步流程正式表达出来
```

## 669. 先说最核心的原因：简单闭环不够表达复杂系统

最小 Agent 闭环很强，但它最擅长的仍然是这种模式：

```text
判断
→ 调工具
→ 看结果
→ 再判断
```

这对于很多任务已经够用了。

比如：

- 问答助手
- 简单研究助手
- 单目标信息收集
- 小型工具调用系统

但一旦系统变复杂，就会出现新的需求：

- 不是只有一条闭环
- 不同步骤想分开控制
- 不同节点想单独观察
- 有些步骤是固定的，有些步骤是动态的
- 中途还可能需要重试、分支、回退、人审

这时候，一个“单个 Agent 循环”就开始不够表达整个系统了。

## 670. 经典 AgentExecutor 更像什么

你可以把经典 AgentExecutor 先理解成：

> **一个围绕单个 Agent 决策循环组织起来的执行器。**

它非常适合：

- 让 Agent 做多轮决策
- 决定是否调用工具
- 把 Observation 回填进去
- 最后给出答案

但它的主视角还是：

- 让一个 Agent 闭环持续跑下去

而不是：

- 用图结构精确表达一个复杂系统里每个节点之间怎么流转

这就是它的边界开始出现的地方。

## 671. 当系统变复杂时，工程上会冒出哪些新问题

一旦任务从“一个 Agent”升级成“一个复杂系统”，常见问题会迅速变多：

- 哪一步是固定步骤，哪一步让 Agent 决定？
- 工具调用失败后要不要重试？
- 某个条件满足时跳转到哪个分支？
- 是否要在某个节点人工审核？
- 状态要怎么保存？
- 多个子任务之间怎么共享状态？
- 中间产物怎么观察和调试？

这些问题你会发现，已经不只是“Agent 会不会调工具”了。

而是在问：

> **整个多步骤系统怎么被清晰、可控、可观察地编排。**

这正是 LangGraph 出现的土壤。

## 672. LangGraph 想解决的不是“让模型更聪明”

这个判断特别关键。

很多人第一次听到 LangGraph，会误以为它是在提供：

- 更强的模型
- 更高级的 Agent 魔法
- 更复杂的 prompt 技巧

其实都不是重点。

LangGraph 更核心的价值在于：

- 明确状态怎么流动
- 明确节点怎么连接
- 明确分支怎么选择
- 明确什么时候循环、什么时候结束
- 明确哪些步骤由程序控制，哪些步骤由模型控制

所以 LangGraph 最本质解决的，不是“智力问题”，而是：

> **复杂 Agent / 工作流系统的结构表达问题。**

## 673. 为什么“图”会成为一个合适的表达方式

因为很多真实系统根本不是一条线。

它更像：

- 有节点
- 有边
- 有分支
- 有循环
- 有状态更新
- 有终止条件

这本来就非常像图结构。

比如一个真实任务可能是：

```text
用户问题
→ 先做分类
→ 如果是知识问答，走 RAG 分支
→ 如果是操作任务，走 Agent 分支
→ 如果信息不足，进入澄清分支
→ 如果高风险，进入人工审核分支
→ 最后统一收口
```

你会发现，这种系统如果只用“一个 Agent 闭环”来想，会越来越别扭。

但如果用图来想，就自然很多。

## 674. 所以 LangGraph 和普通 Agent 的关系是什么

一个很好记的理解方式是：

- 普通 Agent 更像“一个会动态决策的执行者”
- LangGraph 更像“把多个步骤、节点、状态、分支编排起来的系统骨架”

也就是说：

```text
Agent 解决“某一步该怎么动态判断”
LangGraph 解决“整个系统的步骤和状态怎么组织”
```

这两者不是天然对立关系。

很多时候，Agent 反而是 LangGraph 里的一个节点。

这个理解非常重要。

## 675. 为什么它会被理解成“工作流 + Agent”的结合点

因为纯工作流的问题是：

- 太固定
- 太死板
- 动态性不足

而纯 Agent 的问题是：

- 太自由
- 不容易控制
- 不容易精确表达复杂系统边界

LangGraph 的价值，恰好就在中间地带。

它允许你做这种组合：

- 外层流程图是可控的
- 某些节点内部允许 Agent 动态决策
- 某些节点完全固定
- 某些节点带条件分支
- 某些节点带状态更新

所以你可以把它理解成：

> **把工作流的可控性和 Agent 的动态性放进同一个系统表达里。**

## 676. 一个非常直观的对比

### 只用普通 Agent 去想

更像：

```text
把所有问题都交给一个会自己循环的执行者
```

优点是简单、灵活。

但缺点是：

- 系统结构不够显式
- 很多分支藏在 Agent 内部
- 调试和控制会越来越难

### 用 LangGraph 去想

更像：

```text
先把系统的节点和流转画出来
再决定哪些节点里放 Agent，哪些节点写死逻辑
```

优点是：

- 结构清楚
- 状态清楚
- 边界清楚
- 更适合复杂系统

这就是两者最本质的区别之一。

## 677. 什么时候你会明显感觉到“该上 LangGraph 了”

当你遇到下面这些情况时，往往就开始逼近 LangGraph 的适用区：

- 任务不是单一闭环，而是多节点协作
- 需要显式状态管理
- 需要条件分支
- 需要多个阶段之间来回跳转
- 需要重试、回退或人工介入
- 需要更强的可观测性和调试能力
- 想把固定流程和动态 Agent 混合在一起

也就是说，当你的问题已经从：

- “怎么做一个 Agent”

变成：

- “怎么做一个复杂、可靠、可控的 Agent 系统”

那 LangGraph 通常就开始变得自然了。

## 678. LangGraph 不是“更高级 Agent”，而是“更明确系统”

这个判断非常值得单独记。

很多人会把学习路线误解成：

- LangChain Agent 是初级
- LangGraph 是高级版本

这种理解不够准确。

更准确地说：

- LangChain Agent 偏向最小动态闭环
- LangGraph 偏向复杂系统编排

所以它们的区别不是“谁更高级”，而是：

> **谁更适合当前问题的结构复杂度。**

这个判断一旦建立，你后面做技术选型时会清楚很多。

## 679. 它和你前面学的“工作流 vs Agent”怎么接上

你前面已经学过：

- 工作流是固定多步骤编排
- Agent 是运行时动态决定下一步

那 LangGraph 恰好可以被理解成：

- 让工作流表达更工程化
- 同时允许某些节点保留 Agent 性质

所以它不是简单站在“工作流”一边，也不是简单站在“Agent”一边。

它更像一个桥：

```text
把固定流程和动态决策放到同一个图结构系统里表达
```

这也是它会越来越常见的根本原因。

## 680. 一个最小的直觉例子

比如一个企业问答系统，如果只是简单版本，可能这样：

```text
用户提问
→ Agent 判断
→ 调搜索工具
→ 看结果
→ 回答
```

但如果要做成更像生产系统，可能会变成：

```text
用户提问
→ 问题分类节点
→ 若是知识问答，走检索节点
→ 若是高风险问题，走人工审核节点
→ 若资料不足，走澄清节点
→ 若可以自动处理，再进入 Agent 节点
→ 最后统一生成答案
```

你看，这时候系统重点已经不只是“Agent 会不会调工具”，而是：

- 节点怎么划分
- 状态怎么传
- 分支怎么走
- 哪些步骤固定，哪些步骤动态

这正是 LangGraph 更擅长表达的东西。

## 681. 你现在最该建立的直觉是什么

到这里你最该记住的，不是某个具体 API 名字，而是一个选型直觉：

- 如果问题主要是“让一个 Agent 自己边想边做”
  - 普通 Agent 思路就可能够用
- 如果问题主要是“把一个复杂系统的节点、状态、分支、回路组织起来”
  - LangGraph 思路就会更自然

这个直觉比背 API 更重要。

## 682. 一句最值得记住的话

把这一章最后压成一句最关键的话：

```text
LangGraph 出现，不是因为 Agent 不行，而是因为复杂系统需要比“单个 Agent 闭环”更明确的结构表达
```

如果再换一种更口语的话：

```text
不是 Agent 不能用了
而是系统一复杂，就需要把流程图和状态流正式画出来
```

只要你把这两句记住，后面再看 LangGraph，就不会把它误解成“只是另一个更高级的 Agent API”。

## 683. 这条 LangChain 主线到这里为什么可以先收尾

到这里，这份文档已经把一条很完整的主线跑通了：

- `Prompt`
- `OutputParser`
- `Runnable`
- 经典 RAG
- 多轮 RAG
- 检索优化
- Tool Calling
- Agent
- `AgentExecutor`
- `agent_scratchpad`
- `output parser` in Agent
- LangGraph 为什么出现

也就是说，你现在已经不只是“知道 LangChain 有这些词”，而是已经能把它们放回一条工程化演进路径里理解。

这时候先收尾，不是中断学习，而是因为：

> **你已经完成了从“单次调用”到“多步系统”的核心认知闭环。**

对于接下来进入 `CrewAI`，这条闭环已经足够作为前置基础。

## 684. 什么时候算这份 LangChain 学习已经阶段性毕业

如果你现在已经能比较顺地解释下面这些问题，就可以把这一阶段视为“正式收口”：

- 普通链和 Agent 的区别是什么
- RAG、Tool Calling、Agentic RAG 的边界是什么
- Agent 为什么不是“会调工具”这么简单
- `Tool / Agent / Executor / scratchpad / parser` 各自负责什么
- 为什么复杂系统最后会走向 LangGraph 这类图式表达

如果这些问题你已经不是靠死记，而是能顺着逻辑讲出来，那么从学习目标上说，这一阶段已经完成得很扎实了。

所以这份文档到这里可以先定义为：

```text
LangChain 主线第一阶段：完成
```

## 685. 为什么现在很适合切到 CrewAI

因为 `CrewAI` 更关注的问题，已经开始偏向：

- 多 Agent 角色分工
- 任务协作
- delegation
- team orchestration
- 多智能体之间的职责与流程设计

而这些内容要学得顺，前面必须先有几个基础：

- 你知道什么叫 Tool
- 你知道什么叫 Agent 闭环
- 你知道什么叫工作流与状态流
- 你知道为什么系统复杂后不能只盯着一个 Agent

这些你现在都已经具备了。

所以此时切到 `CrewAI`，是顺势进入下一层，而不是半路跳车。

## 686. 但 LangChain 其实还没有“全部学完”

这里也要说清楚。

这份文档现在适合收尾，**不等于 LangChain 已经学尽了**。

更准确地说，是：

- 核心主线已经打通
- 足够支撑你进入 CrewAI
- 但 LangChain 里仍然还有很多“进阶工程主题”以后值得回来补

所以这个收尾更像：

> **主线先毕业，支线以后再回来扩。**

这个理解最准确。

## 687. 以后最值得回来的 LangChain 主题有哪些

如果你后面学完 `CrewAI`，或者在做项目时感觉“需要补底层”，那最值得回来的通常是这些主题。

### 1. LangGraph 的真正落地层

比如：

- `State` 到底怎么设计
- `node / edge / conditional edge` 怎么理解
- 状态更新怎么写
- 多分支怎么汇合
- 人工介入节点怎么设计
- 循环终止条件怎么设计

这一层会让你从“知道为什么需要 LangGraph”，进入“真的能用它表达系统”。

### 2. 更完整的结构化输出体系

比如：

- `PydanticOutputParser`
- 更稳的 schema 约束
- 输出校验与重试
- 结构化结果如何传给下游流程

这对做多步骤系统、Agent 任务分发、CrewAI 任务结果规范化都很有帮助。

### 3. 更深入的检索工程

比如：

- 向量库选型
- chunk 策略优化
- metadata 设计
- hybrid search 细化实现
- rerank 接入方式
- retrieval evaluation

如果你后面做企业知识库、研究助手、问答系统，这一块非常值得回来深挖。

### 4. 记忆与会话状态管理

比如：

- 短期记忆怎么放
- 长期记忆怎么设计
- 对话状态和任务状态怎么区分
- memory 和 graph state 的边界

这块和多 Agent 系统也会产生很强关联。

### 5. 观察性与调试

比如：

- 中间步骤如何记录
- Tool 调用如何追踪
- parser 错误如何定位
- 一个链或 Agent 为什么失败
- 如何看 trace / run tree / execution logs

这部分很工程，但做真实项目时非常值钱。

### 6. 容错与生产化

比如：

- 工具失败后的 fallback
- 重试机制
- 超时与取消
- 幂等性
- 人工审核节点
- 高风险输出控制

这一层会让你从“能跑 demo”变成“能做可靠系统”。

### 7. Streaming、并发与性能

比如：

- `stream` / `astream`
- 并发节点
- 批处理
- 延迟优化
- 成本控制

如果以后你做长流程、多 Agent 或用户实时交互，这一块会越来越重要。

## 688. 你以后可以怎么判断“该不该回来补 LangChain”

我给你一个很实用的判断标准。

如果你以后在学 `CrewAI` 或做项目时，开始反复遇到下面这些问题，就说明该回来补 LangChain 了：

- “这个状态到底该放哪？”
- “这个步骤为什么总串不稳？”
- “为什么结果很难稳定进入下一步？”
- “为什么多 Agent 协作后调试变得很难？”
- “为什么复杂流程越来越像图，而不是一条链？”
- “为什么我需要更明确的结构化输出和状态管理？”

只要这些问题开始频繁出现，就说明你会自然需要回来补：

- LangGraph
- 结构化输出
- 状态设计
- 调试与可观测性

这时候回头再学，吸收会比现在硬学更快。

## 689. 所以最合适的策略是什么

对你现在来说，最合适的策略不是：

- 把 LangChain 所有分支一次性学完

而是：

- 先把主线学到能支撑下一阶段
- 转去学 `CrewAI`
- 在真实问题出现时，再回补 LangChain 深水区

这是最符合你当前目标的学习路径。

因为你现在需要的，不是“LangChain 百科全书式学习”，而是：

> **够用、成体系、能顺利进入下一阶段。**

这一点你现在已经达到了。

## 690. 这份文档在当前阶段的定位

所以你可以把这份 `langchain-study-guide.md` 当前阶段理解成：

```text
一份已经完成主线学习闭环的 LangChain 学习指南
```

它已经足够帮助你：

- 理解 LangChain 核心组件
- 理解 RAG 到 Agent 的演进
- 理解 Tool / Agent / LangGraph 的工程边界
- 为进入 CrewAI 做概念和工程准备

后面如果再回来补，那就不是“从头学”，而是：

- 补 LangGraph 细节
- 补工程深水区
- 补生产化能力

这个阶段感是很清楚的。

## 691. 这一阶段最后记一句话

把这次收尾最后压成一句最值得记忆的话：

```text
LangChain 这条主线先学到“能理解多步系统为什么这样设计”就足够了，后面的深水区可以等真实问题出现后再回来补
```

如果再换一种更口语的话：

```text
主线先毕业，支线以后按项目需要再回头学
```

这就是这份文档当前最合适的收尾方式。
