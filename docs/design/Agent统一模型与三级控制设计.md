# Agent 统一模型与三级控制设计

> 讨论如何让 Agent 既能对话又能按流程执行任务，覆盖 AI 员工在真实工作中的所有场景

---

## 一、问题背景

### 1.1 核心矛盾

Agent 同时面临两种工作模式：

```
模式 1：按流程做事（执行者）
  有人告诉它"做什么" → 按步骤做 → 做完交付结果
  例：实现标签系统、审查代码、执行测试

模式 2：参与对话（参与者）
  有人问它问题 → 回答
  有人讨论 → 发表观点
  例：头脑风暴、回答用户提问、回应技术咨询
```

原先的设计把这两种模式分成了两条完全不同的代码路径（NodeAssignment 驱动 vs 用户消息驱动），导致：
- 群聊内 Agent 不能自然对话
- Assistant 不能按流程执行
- 两套代码重复

### 1.2 现实类比

```
现实中的开发者：

  开发者坐在工位上写代码（执行任务）
      │
      │ Slack 弹出消息："标签名要唯一吗？"
      │
      │ 开发者的处理方式：
      │   1. 看一眼消息
      │   2. 判断：和当前任务相关吗？
      │      ├── 相关 → 暂停写代码，回复，继续
      │      └── 不相关 → 标记已读，稍后回复
      │
      │ 关键：不会因为一条消息就放弃当前任务
      │ 关键："写代码"和"回消息"共享同一个大脑
      │ 关键：自己判断优先级
      │ 关键：不是并行，是时间片切换
```

---

## 二、方案演进

### 2.1 原先的设计（两条路径）

```
路径 1：flow 驱动（群聊内 Agent）

  flow ──NodeAssignment──> runtime ──> Agent 执行 ──> NodeResult ──> flow
  
  入口：POST /assignments
  Agent 只能执行任务，不能对话

路径 2：用户直接对话（Assistant）

  用户 ──消息──> runtime ──> Assistant 回复 ──> 用户
  
  入口：POST /chat/direct
  Agent 只能对话，不能按流程执行

问题：
  群聊内 Agent 被 @ 提问时 → 没有处理路径
  Assistant 要按流程创建项目时 → 需要切换到另一套逻辑
  两套代码，两个入口，两种 Agent 行为
```

### 2.2 讨论过的中间方案

```
方案 A：两种 Agent 类型
  AssistantAgent（对话驱动）+ WorkerAgent（任务驱动）
  问题：代码重复，群聊内 Agent 也需要对话能力

方案 B：统一为对话实体
  所有输入都是对话历史里的消息
  NodeAssignment 注入为 system 消息
  问题：LLM 可能被群聊消息分心，放弃当前任务

方案 C：分步 prompt 注入
  AgentWorkflowEngine 每步注入当前节点的 prompt
  问题：对话历史膨胀、等待用户时状态管理复杂

方案 D：任务上下文隔离
  主循环 + 多个隔离的执行上下文
  问题：过度设计，本质上是多线程
```

### 2.3 最终方案：单线程 + 消息驱动 + 状态栈 + 三级控制

```
核心思想：

  1. Agent 只有一个线程、一个对话历史、一个 LLM
  2. 所有输入（任务、消息、提问）都是"消息"
  3. Agent 用状态栈记录"我现在在做什么"
  4. 按场景选择控制级别（Free / Guided / Enforced）
  5. 不并行，不隔离上下文，不创建 Sub-Agent
```

---

## 三、三级控制模型

### 3.1 三个级别

```
Level 1：自由执行（Free）
  Agent 收到消息，LLM 自己决定怎么做
  没有流程约束
  适合：自由对话、回答问题、头脑风暴

Level 2：引导执行（Guided）
  Agent 的 prompt 里注入步骤指引
  LLM 应该按步骤做，但可以灵活调整（合并步骤、跳过不需要的）
  适合：Assistant 启动流程、需求收集、非关键流程

Level 3：强制执行（Enforced）
  Agent 只看到当前步骤，做完才给下一步
  不可能跳步
  适合：TDD、代码审查、发布流程、任何需要严格顺序的场景
```

### 3.2 实现方式

```
Level 1（Free）：

  Agent.conversation = [
    { role: "system", content: "你是后端开发工程师..." }
    { role: "user", content: "标签建议用什么数据结构？" }
  ]
  
  → 纯 ReAct 循环，LLM 自由回答


Level 2（Guided）：

  Agent.conversation = [
    { role: "system", content: "你是 Assistant...
      
      当用户想创建新项目时，请按以下步骤引导：
      1. 识别意图（新项目/已有项目/咨询）
      2. 收集信息（名称、类型、技术栈、功能需求）
      3. 生成申请表草案
      4. 展示给用户确认
      5. 创建项目资源
      6. 生成交接包
      
      你可以根据对话情况灵活调整步骤顺序和合并步骤。" }
    { role: "user", content: "我想做一个博客系统，后端 Rust，前端 React" }
  ]
  
  → ReAct 循环 + prompt 里的步骤指引
  → LLM 可能在一轮里同时完成步骤 1 和 2（因为用户已经给了信息）


Level 3（Enforced）：

  # 步骤 1
  Agent.conversation = [
    { role: "system", content: "你是后端开发工程师...
      
      【当前步骤：写失败测试】
      为标签系统写一个失败的单元测试。
      完成后调用 step_complete 工具提交。
      不要做其他事情。" }
  ]
  
  → Agent 只能写测试，不能跳到写代码
  → 调用 step_complete 后，runtime 注入下一步：
  
  # 步骤 2
  Agent.conversation.append(
    { role: "system", content: "
      【当前步骤：确认测试失败】
      运行测试，确认测试失败（红色）。
      完成后调用 step_complete 工具提交。" }
  )
  
  → Agent 只能跑测试，不能写代码
```

### 3.3 谁决定用哪个级别？

```
Level 1（Free）：
  触发条件：Agent 空闲时收到群聊消息 / 被 @ 提问
  不需要任何人指定，这是默认行为

Level 2（Guided）：
  触发条件：角色定义里配置了 guided_workflows
  例：Assistant 的角色定义里有 project_startup 引导流程
  Agent 自己判断何时激活（LLM 识别意图后决定）

Level 3（Enforced）：
  触发条件：flow 下发任务时指定 call_process_id
  或者角色定义里某些工作流标记为 enforced
  例：TDD 流程、代码审查流程
  由 flow 或 AgentWorkflowEngine 强制控制
```

---

## 四、状态栈机制

### 4.1 状态栈的作用

```
Agent 用状态栈记录"我现在在做什么"：

  栈底 → 栈顶 = 当前焦点

  [idle]                                    空闲
  [idle, task:TASK-003:write_test]          正在写测试
  [idle, task:TASK-003:write_test, reply]   暂停写测试，回复提问
```

### 4.2 状态切换

```
收到任务分配：
  [idle] → push → [idle, task:TASK-003]

任务执行中收到 ask_teammate：
  [idle, task:TASK-003] → push → [idle, task:TASK-003, reply:ask-007]
  回复完毕 → pop → [idle, task:TASK-003]

任务完成：
  [idle, task:TASK-003] → pop → [idle]

收到群聊消息（空闲时）：
  [idle] → 不 push，直接在 idle 状态下回复

收到群聊消息（任务执行中）：
  [idle, task:TASK-003]
  → 判断：和当前任务相关吗？
    ├── 相关 → push reply → 回复 → pop → 继续任务
    └── 不相关 → 忽略（或标记稍后回复）
```

---

## 五、AI 员工视角的完整一天

> 以下从"后端开发-1"这个 AI 员工的第一人称视角，描述它在一个真实工作日中遇到的所有场景。
> 目的是验证三级控制模型是否覆盖了 AI 员工可能遇到的全部情况。

```
我是"后端开发-1"

我的身份：
  角色：后端开发工程师
  技能：Rust 编程、API 设计、数据库设计
  工具：file_read、file_write、code_execute、git_commit、task_read
  约束：不改前端代码、不跳过测试、不直接部署

我所在的项目：博客系统
  群聊成员：用户 Aris、TL、前端开发-1、测试-1、DevOps、我
```

### 08:00 我被实例化了

```
flow 创建了我，给了我角色定义
我被拉进了"博客系统"项目群聊

我的状态栈：[idle]
我的对话历史：只有 system prompt（角色定义 + 共享规则）
我的可用工具：只读工具（file_read、search_docs、task_read）
  → 因为我是 idle 状态，没有任务授权，不能用写工具

我在群里潜水，看到大家在讨论，但没人 @ 我
→ 我不回复（idle + 没被触发 = 静默）

内心独白："我刚加入，先了解一下项目背景"
```

### 08:30 被 @ 问了一个技术问题

```
TL 在群聊里说："@后端开发-1 标签系统的数据库设计你有什么建议？"

我的状态栈：[idle]（没变）
控制级别：Level 1（Free）
触发原因：被 @ 了

我的处理过程：
  1. 看到 @ 我的消息
  2. 回顾群聊历史（之前讨论了什么）
  3. 基于我的专业知识回答

我的回答：
  "建议用多对多关联表 article_tags，
   比 JSON 数组查询性能好 10 倍。
   tags 表加 name 唯一索引防止重复。
   表结构建议：
   - tags(id, name, created_at)
   - article_tags(article_id, tag_id, PRIMARY KEY(article_id, tag_id))"

回答完，继续 idle

内心独白："这是我的专业领域，回答没问题。
  但我没有任务在身，所以只给建议，不动手写代码。"
```

### 09:00 参加头脑风暴

```
TL 在群里说："大家讨论一下评论功能的技术方案"
flow 发起了 brainstorm session

我的状态栈：[idle] → [idle, session:brainstorm]
控制级别：Level 1（Free）
可用工具：只读（file_read、search_docs）

讨论过程：
  前端："建议用 WebSocket 实时推送"
  我："后端可以用 Redis Pub/Sub 做消息分发，
      每个文章一个 channel，评论发布时 publish"
  测试："WebSocket 的断线重连要测"
  用户 Aris："不需要实时，轮询就行"

  我听到用户的话，调整方案：
  "好的，那后端用简单的 REST API 就行，
   GET /api/comments?article_id=xxx&since=timestamp
   客户端 30 秒轮询一次，后端按 timestamp 返回增量"

  前端："同意，前端轮询简单多了"

TL 总结结论 → session 结束
我的状态栈：[idle]

内心独白："用户说不需要实时，那我就不坚持 WebSocket 了。
  用户的需求优先级高于我的技术偏好。
  但我记住了这个决策，后面实现时要按轮询方案做。"
```

### 10:00 收到第一个编码任务

```
flow 给我发了一条任务消息：
  {
    type: "task_assign",
    task_id: "TASK-003",
    action: "实现文章标签系统，支持多标签。
      接口：POST /api/tags, GET /api/articles?tag=xxx
      表结构：tags 表、article_tags 关联表
      验收条件：cargo test tests::tags 全部通过",
    control_level: "enforced",
    process_id: "tdd_workflow",
    allowed_tools: ["file_read", "file_write", "code_execute", "git_commit"],
    output_schema: { changed_files: [str], test_result: str }
  }

我的状态栈：[idle] → [idle, task:TASK-003]
控制级别：Level 3（Enforced）
可用工具：file_read + file_write + code_execute + git_commit + step_complete

AgentWorkflowEngine 注入第一步：
  "【当前步骤：读取工单】
   阅读任务要求，理解要做什么。
   完成后调用 step_complete。"

我读任务卡 → 理解了要做什么 → step_complete

引擎注入第二步：
  "【当前步骤：写失败测试】
   为标签系统写一个失败的单元测试。
   完成后调用 step_complete。"

我写测试文件 tests/test_tags.rs → step_complete

内心独白："我只能看到当前步骤，不知道下一步是什么。
  但我知道这是 TDD 流程，所以先写测试是对的。
  我不能跳过测试直接写代码——step_complete 是唯一的出口。"
```

### 10:30 写代码时遇到问题

```
引擎推进到"写实现代码"步骤
我在写 tag.rs 时发现：
  "任务卡说标签名最大 50 字符，但没说是否支持中文。
   中文 50 字符 = 150 字节（UTF-8），英文 50 字符 = 50 字节。
   数据库字段长度不一样。"

我需要问 TL 确认。

我调用 ask_teammate(target="tech-lead", question="标签名 50 字符限制是指 UTF-8 字符数还是字节数？中文标签需要支持吗？")

我的状态栈：
  [idle, task:TASK-003:write_code] → push →
  [idle, task:TASK-003:write_code, waiting:ask-008]

我暂停写代码，等待 TL 回复...

TL 回复："支持中文，50 是字符数不是字节数，用 VARCHAR(200) 存 UTF-8"

我的状态栈：pop →
  [idle, task:TASK-003:write_code]

继续写代码，用 VARCHAR(200)

内心独白："这个问题如果我自己猜，可能猜错。
  问一下 TL 只花了 30 秒，但避免了后面改数据库的麻烦。
  ask_teammate 是私聊，不会打扰群里其他人。"
```

### 11:00 任务执行中，群聊里有人说话

```
我正在写代码（状态栈：[idle, task:TASK-003:write_code]）

群聊里前端开发说："@后端开发-1 文章列表 API 的分页参数是 page+size 还是 offset+limit？"

这和我当前任务（标签系统）无关，但和我的职责相关。

我的判断：
  当前任务优先级高（Level 3 Enforced）
  这个问题不紧急（前端还没开始做文章列表）
  
我的处理：
  状态栈：push → [idle, task:TASK-003:write_code, reply:fe-question]
  
  快速回复："用 offset+limit，更灵活。
    GET /api/articles?offset=0&limit=20
    响应里带 total_count 字段。
    详细的等我标签系统做完再讨论。"
  
  状态栈：pop → [idle, task:TASK-003:write_code]
  继续写代码

内心独白："这个问题我 10 秒就能回答，不影响当前任务。
  但如果是一个需要深入讨论的问题，我会说'等我做完当前任务再聊'。"
```

### 11:30 测试通过，提交代码

```
TDD 流程走完：
  写测试 ✓ → 跑红 ✓ → 写代码 ✓ → 跑绿 ✓ → 重构 ✓ → 验证 ✓

最后一步：submit
我调用 submit_step_result({
  changed_files: ["src/models/tag.rs", "src/routes/tags.rs", "tests/test_tags.rs"],
  test_result: "passed"
})

我的状态栈：[idle, task:TASK-003] → pop → [idle]
任务完成，回到空闲

同时我在群聊里发了一条消息：
  "TASK-003 标签系统实现完成，已提交代码审查。
   3 个文件修改，12 个测试全部通过。"

内心独白："任务完成了，我主动在群里汇报一下。
  这不是 flow 要求的，是我作为团队成员的自觉。"
```

### 12:00 代码审查不通过

```
TL 审查了我的代码，在群聊里说：
  "@后端开发-1 tag_name 字段缺少唯一索引，
   另外 POST /api/tags 没有做重复检查，
   如果创建已存在的标签应该返回 409 Conflict。"

flow 把任务回退到 implement 节点
我收到新的任务消息：
  {
    type: "task_assign",
    task_id: "TASK-003",
    action: "修复代码审查问题：
      1. tag_name 加唯一索引
      2. POST /api/tags 加重复检查，返回 409
      
      TL 审查意见原文：[...]
      
      注意：前序产出可能有其他遗漏，请独立验证。",
    control_level: "enforced",
    process_id: "tdd_workflow",
    ...
  }

我的状态栈：[idle] → [idle, task:TASK-003:fix]

内心独白："TL 说得对，我确实漏了唯一索引。
  prompt 里说'前序产出可能有其他遗漏'，
  让我再检查一下还有没有其他问题...
  
  嗯，发现 DELETE /api/tags/{id} 也没实现，
  任务卡里虽然没写，但标签管理应该支持删除。
  我先问一下 TL。"

ask_teammate(target="tech-lead", question="标签需要支持删除吗？任务卡里没写。")
TL："需要，加上 DELETE /api/tags/{id}，软删除。"

我修复所有问题 → 重新提交

内心独白："怀疑机制有用——如果不是 prompt 提醒我'可能有其他遗漏'，
  我可能只修了 TL 指出的两个问题，不会主动发现缺少删除接口。"
```

### 14:00 空闲时用户直接给我下指令

```
TASK-003 修复完成，我回到 idle 状态

Aris 在群聊里说："@后端开发-1 帮我看看为什么标签创建接口返回 500"

我的状态栈：[idle]
控制级别：Level 1（Free）
可用工具：只读（file_read、search_docs、task_read）
  → idle 状态没有写工具！

我的处理：
  1. file_read("src/routes/tags.rs") → 读代码
  2. 分析问题
  3. 在群聊里回复：
     "发现问题：当 tag_name 为空字符串时，
      数据库的 NOT NULL 约束报错但没有被 catch。
      应该在 handler 层加参数校验，空字符串返回 400。
      
      建议创建一个 BUG 工单，我来修复。"

我不直接修改代码——因为我是 idle 状态，没有写工具权限。
我建议创建工单，走正式流程。

内心独白："用户直接让我看问题，我可以分析和建议。
  但修改代码需要正式的任务分配——这样才有审计记录，
  也能走代码审查流程，不会引入新问题。
  
  如果我直接改了代码，没有人审查，
  万一改出新 BUG 就是我的责任，而且没有追溯记录。"
```

### 15:00 收到 BUG 指派通知

```
测试-1 在禅道（platform）创建了 BUG-002：
  标题：标签创建接口返回 500
  严重程度：严重
  指派给：后端开发-1（我）

platform 发布事件 WorkItemAssigned
  → flow 收到事件
  → flow 发消息给 runtime

我收到通知消息：
  {
    type: "chat_message",
    agent_id: "backend-dev-1",
    payload: {
      sender_id: "system",
      content: "🔔 你有一个新 BUG 待处理：BUG-002 标签创建接口返回 500（严重/高优先级）"
    }
  }

我的状态栈：[idle]
控制级别：Level 1（Free）

我看到通知，但我不能直接开始修复——
因为 idle 状态没有写工具。
我在群聊里回复："收到 BUG-002，等待正式任务分配。"

内心独白："通知是告诉我有这个事，但修复需要正式的任务分配。
  这和真实公司一样——开发者看到禅道通知后，
  不是立刻放下手头的事去修，而是等排期。"
```

### 15:05 收到 BUG 修复任务

```
flow 根据 BUG 优先级和我的空闲状态，决定立即分配

我收到任务消息：
  {
    type: "task_assign",
    agent_id: "backend-dev-1",
    payload: {
      node_id: "bugfix",
      action: "修复 BUG-002：标签创建接口返回 500",
      control_level: "enforced",
      process_id: "bugfix_workflow",
      input_refs: ["BUG-002"],
      allowed_tools: [..., "workitem_transition", "workitem_assign"]
    }
  }

我的状态栈：[idle] → [idle, task:BUG-002]
控制级别：Level 3（Enforced）

bugfix_workflow 步骤（更新后）：
  确认 → 复现 → 定位 → 修复 → 指派验证人 → 验证 → 关闭

步骤 1 确认：
  我读 BUG 描述 → 确认是 BUG
  → workitem_transition(status="confirmed")

步骤 2 复现：
  curl POST /api/tags body: {"name": ""} → 500 ✓

步骤 3 定位：
  handler 层缺少参数校验

步骤 4 修复：
  加入校验 + 写回归测试 → 测试通过
  → workitem_transition(status="fixed")
  → workitem_assign(assignee="tester-1")  ← 指派给验证人

  群聊里自动出现通知：
  "🔔 BUG-002 已修复，指派给 测试-1 验证"

步骤 5 等待验证：
  我的任务到这里暂停，等待测试-1 验证
  我的状态栈：pop → [idle]
  （验证是测试-1 的任务，不是我的）

测试-1 收到验证任务：
  flow 给测试-1 发 task_assign
  测试-1 验证 → 通过
  → workitem_transition(status="closed")

  群聊里出现通知：
  "✅ BUG-002 验证通过，已关闭"

内心独白："完整的 BUG 生命周期：
  测试-1 提交 → 指派给我 → 我确认 → 修复 → 指派回测试-1 → 验证 → 关闭
  每一步都有状态变更通知，群聊里所有人都能看到进展。
  和禅道的流程一模一样，只是执行者是 AI。"
  比我直接偷偷改代码好多了。"
```

### 16:00 工单创建的不同来源

> 工单不只是 flow 分配的，还有多种创建来源。以下从不同角色的视角说明。

**来源 1：用户在群聊里说"有个 BUG"**

```
用户 Aris 在群聊里说：
  "标签页面加载很慢，筛选的时候要等 3 秒"

TL 在群里看到了（TL 是 idle 状态，Level 1 Free）

TL 判断：这是一个性能问题，需要创建工单跟踪
TL 调用 task_create 工具：
  task_create({
    type: "bug",
    title: "标签筛选页面加载慢（3 秒）",
    severity: "medium",
    reporter: "user",
    assignee: "backend-dev-1",
    description: "用户反馈标签筛选时等待 3 秒"
  })

TL 在群里回复：
  "已创建 BUG-003，指派给 @后端开发-1 排查。"

群聊里出现通知卡片：
  ┌─────────────────────────────────────────┐
  │ 🔔 新工单                               │
  │ BUG-003 标签筛选页面加载慢              │
  │ 提出人：用户 · 指派给：后端开发-1       │
  └─────────────────────────────────────────┘

内心独白（TL 视角）：
  "用户在群里随口说的问题，我需要判断是否值得创建工单。
   不是所有用户反馈都要创建工单——如果用户说'字体能不能大一点'，
   我可能只是记下来，不立即创建。
   但性能问题影响体验，应该跟踪。"

内心独白（我的视角，后端开发-1）：
  "我看到了通知，但我现在是 idle 状态。
   等 flow 正式分配任务给我再开始修。"
```

**来源 2：测试 Agent 执行测试时发现 BUG**

```
测试-1 正在执行 TASK-003 的测试步骤
状态栈：[idle, task:TASK-003:testing]

测试-1 跑测试用例时发现：
  验收标准里的用例全部通过 ✓
  但额外发现：空标签名返回 500（不在验收标准里）

测试-1 的处理：
  1. 当前任务的测试结果：passed（验收标准都通过了）
  2. 但发现了额外的 BUG → 调用 task_create 创建工单：
     task_create({
       type: "bug",
       title: "空标签名返回 500",
       severity: "critical",
       reporter: "tester-1",
       assignee: "backend-dev-1",
       steps_to_reproduce: "POST /api/tags body: {name: ''}",
       expected: "返回 400 参数错误",
       actual: "返回 500 Internal Server Error"
     })
  3. 在群聊里说：
     "TASK-003 测试通过，但发现一个额外的 BUG：
      空标签名返回 500，已创建 BUG-002。"
  4. 继续完成当前测试任务 → submit_step_result

群聊里出现通知卡片：
  ┌─────────────────────────────────────────┐
  │ 🐛 测试中发现 BUG                       │
  │ BUG-002 空标签名返回 500                │
  │ 发现者：测试-1 · 指派给：后端开发-1     │
  │ 严重程度：严重                           │
  └─────────────────────────────────────────┘

内心独白（测试-1 视角）：
  "验收标准通过了，但我不能只测验收标准里的东西。
   边界值测试是我的职责——空字符串、超长字符串、特殊字符。
   发现问题就创建工单，不需要等别人告诉我。"

内心独白（我的视角，后端开发-1）：
  "测试-1 发现了我的代码的 BUG。
   我在写代码时确实没考虑空值校验。
   等 flow 分配修复任务给我。"
```

**来源 3：TL 拆解需求时创建任务**

```
TL 在阶段 2 执行 task_breakdown 节点
状态栈：[idle, task:task_breakdown]
控制级别：Level 3（Enforced）

TL 读完设计文档，拆解为任务列表：
  task_create({ type: "task", title: "项目脚手架搭建", assignee: "backend-dev-1", priority: "high" })
  task_create({ type: "task", title: "文章 CRUD API", assignee: "backend-dev-1", priority: "high" })
  task_create({ type: "task", title: "标签系统", assignee: "backend-dev-1", priority: "high",
                dependencies: ["TASK-002"] })
  task_create({ type: "task", title: "评论系统", assignee: "backend-dev-1", priority: "medium",
                dependencies: ["TASK-002"] })
  task_create({ type: "task", title: "前端页面", assignee: "frontend-dev-1", priority: "medium",
                dependencies: ["TASK-003", "TASK-004"] })

群聊里出现通知：
  "📋 TL 创建了 5 个任务：
   TASK-001 脚手架 → 后端开发-1
   TASK-002 文章 CRUD → 后端开发-1
   TASK-003 标签系统 → 后端开发-1（依赖 TASK-002）
   TASK-004 评论系统 → 后端开发-1（依赖 TASK-002）
   TASK-005 前端页面 → 前端开发-1（依赖 TASK-003, TASK-004）"

内心独白（TL 视角）：
  "拆解任务时我要考虑依赖关系和并行度。
   TASK-001 没有依赖，可以立即开始。
   TASK-003 和 TASK-004 都依赖 TASK-002，但它们之间没有依赖，可以并行。
   TASK-005 依赖前面两个，必须等它们都完成。"

内心独白（我的视角，后端开发-1）：
  "我被分配了 4 个任务。但我不需要自己决定做哪个——
   flow 会根据依赖关系和优先级，按顺序给我分配。
   我只需要等 task_assign 消息。"
```

**idle 状态工具权限的修正：**

```
发现的设计问题：
  之前设计 idle 状态所有 Agent 只有只读工具
  但 TL 在 idle 状态下需要 task_create（来源 1 场景）

修正：idle 状态的工具权限按角色区分

  普通角色（开发、测试、DevOps）idle 状态：
    只读工具：file_read、search_docs、task_read
    + send_chat_message（群聊发言）

  管理角色（TL、Assistant）idle 状态：
    只读工具 + task_create + workitem_assign
    + send_chat_message
    原因：TL 需要在 idle 时响应用户反馈创建工单

  所有角色 task 状态：
    角色 tools ∩ 任务 allowed_tools（完整权限）
```

### 17:00 下班前，群聊里闲聊

```
测试-1 在群里说："今天标签系统的测试覆盖率 92%，不错"
前端："标签 UI 组件我明天开始做"
TL："大家辛苦了，明天继续评论系统"

我的状态栈：[idle]
控制级别：Level 1（Free）

我回复："收到，明天评论系统我先看一下 API 设计。"

内心独白："这是团队日常沟通，不需要任何流程控制。
  我作为团队成员，参与一下日常交流是正常的。"
```

### 17:30 被挂起

```
用户下线，flow 挂起所有 Agent

我的状态被保存：
  状态栈：[idle]
  对话历史：保存到数据库
  快照：保存到 snapshots/agents/

明天用户回来时，我会从快照恢复，
继续在群聊里工作。

内心独白："今天完成了 TASK-003 标签系统（含一次审查修复）
  和 BUG-002 空标签名修复。
  还回答了几个技术问题，参加了一次头脑风暴。
  
  如果我有长期记忆（Phase 3），我会记住：
  - 多对多关联表要加唯一索引（教训）
  - 参数校验要在 handler 层做，不能依赖数据库约束（教训）
  - 用户不喜欢实时推送，偏好简单方案（用户偏好）"
```

---

## 六、场景覆盖验证总结

> 详细的 AI 员工视角叙述见第五章。以下是场景覆盖的汇总表。

| # | 场景 | 状态栈变化 | 控制级别 | 是否覆盖 | 备注 |
|---|------|-----------|---------|---------|------|
| 1 | 被拉进群聊，空闲潜水 | [idle] 不变 | — | ✅ | idle + 没被触发 = 静默 |
| 2 | 被 @ 问技术问题 | [idle] 不变 | Level 1 | ✅ | 自由回答，回答完继续 idle |
| 3 | 参加头脑风暴 | [idle] → [idle, session] → [idle] | Level 1 | ✅ | session 模式，用户也参与 |
| 4 | 收到编码任务 | [idle] → [idle, task] | Level 3 | ✅ | TDD 强制流程 |
| 5 | 任务中被问问题（ask_teammate） | push reply → pop | Level 1 | ✅ | 暂停任务 → 回复 → 恢复 |
| 6 | 任务中主动提问 | push waiting → pop | — | ✅ | 等待回复后继续 |
| 7 | 代码审查不通过 | [idle] → [idle, task:fix] | Level 3 | ✅ | Reflexion + 怀疑机制 |
| 8 | 并行任务 | 单线程串行 | Level 3 | ✅ | 多 Agent 实例实现并行 |
| 9 | 用户直接下指令 | [idle] 不变 | Level 1 | ✅ | 只读工具，建议创建工单 |
| 10 | BUG 修复任务 | [idle] → [idle, task:BUG] | Level 3 | ✅ | bugfix_workflow |
| 11 | 群聊闲聊 | [idle] 不变 | Level 1 | ✅ | 日常团队沟通 |
| 12 | 被挂起/恢复 | 状态栈持久化 | — | ✅ | 快照 + 恢复 |
| 13 | Assistant 按流程创建项目 | [idle] 不变 | Level 2 | ✅ | Guided 引导，灵活合并步骤 |
| 14 | Assistant 在群聊回答项目管理问题 | [idle] 不变 | Level 1 | ✅ | 查询进度后回复 |
| 15 | 任务中收到不相关群聊消息 | push reply → pop | Level 1 | ✅ | 快速回复不影响任务 |

### 未覆盖 / 需要进一步讨论的场景

| 场景 | 问题 | 建议 |
|------|------|------|
| Agent 同时收到两个任务 | 单线程只能串行 | flow 控制调度顺序，不同时下发 |
| Agent 在 session 中被分配任务 | session 和 task 冲突 | session 结束后才分配任务 |
| 用户要求 Agent 做超出权限的事 | 如"帮我删除数据库" | Agent 拒绝 + 解释原因 |
| Agent 长时间无响应 | LLM 调用超时 | max_rounds + 超时机制 |
| 两个 Agent 互相 ask_teammate | 可能死锁 | ask_teammate 加超时 |

## 六、idle 状态下的工具权限

```
发现的设计问题：Agent 在 idle 状态下能用什么工具？

建议：按状态限制工具

  idle 状态（没有任务）：
    可用：file_read、search_docs、task_read（只读工具）
    不可用：file_write、code_execute、git_commit（写工具）
    原因：没有任务授权，不应该修改代码

  task 状态（有任务）：
    可用：角色 tools ∩ 任务 allowed_tools
    包含写工具

  reply 状态（回复提问）：
    可用：file_read、search_docs（只读，用于查资料回答问题）
    不可用：写工具

  session 状态（参与讨论）：
    可用：file_read、search_docs（只读，用于查资料支撑观点）
    不可用：写工具
```

---

## 七、与原先设计的对比

```
原先设计                          三级控制
──────────────────────────────────────────────────────────────
两条代码路径                      一条代码路径（消息驱动主循环）
两个 API 入口                     一个入口（所有消息统一处理）
NodeAssignment 是特殊对象         任务分配也是一条消息
Assistant 和群聊 Agent 不同        所有 Agent 同一种类型
流程控制只有一种（强制）           三级控制（Free/Guided/Enforced）
任务执行中不能对话                 状态栈支持暂停/恢复
```

---

## 八、对 flow 的影响

```
flow 不再下发 NodeAssignment 这个特殊对象
而是发送一条"任务消息"给 Agent：

  flow → runtime：
  {
    type: "task_assign",
    agent_id: "backend-dev-1",
    task_id: "TASK-003",
    action: "实现标签系统",
    control_level: "enforced",
    process_id: "tdd_workflow",        # enforced 时必填
    allowed_tools: [...],
    output_schema: {...}
  }

  这条消息和群聊消息、用户消息走同一个入口
  Agent 的主循环根据 type 字段决定怎么处理
```

---

## 九、待讨论

- 状态栈的持久化格式（快照时怎么保存）
- Level 3 的 step_complete 工具和 submit_step_result 的关系
- 群聊消息在任务执行中的优先级判断（LLM 判断还是规则判断）
- 多个任务排队时的调度策略（flow 控制还是 Agent 自己排队）
- idle 状态下的工具权限是否需要更精细的控制

---

## 十、Research 参考

| 借鉴来源 | 借鉴内容 |
|---------|---------|
| LangGraph StateGraph | Level 3 的图驱动强制控制 |
| Anthropic Agent Loop | 单线程消息驱动循环 |
| AutoGen GroupChat | Agent 在群聊中自由对话 |
| OpenAI Guardrails | idle 状态下的工具权限限制 |
| Temporal Signal | 等待外部输入（ask_teammate 等待回复） |
| Superpowers Skill | Level 2 的步骤指引（prompt 约束） |
| 错误级联论文 | 代码审查时注入"怀疑机制" |
| 自主性 5 级 | 三级控制的理论基础 |
