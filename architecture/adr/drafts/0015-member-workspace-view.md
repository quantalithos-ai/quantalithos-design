# Member Workspace View 草案

> **定位**:本文件**不是正式 ADR**,而是围绕 AI Member 个人视野 / 项目视野的新设计草案。它用于后续决定是否新增 Workspace View 仓、是否修订 `conversation` / `work` / `member` / `chat` / `console` 等文档。  
>
> **讨论日期**:2026-05-25  
> **参与者**:Aris + codex  
> **相关文档**:
> - `architecture/adr/0004-global-vs-project-member.md`
> - `architecture/ai-member设计.md`
> - `projects/L1-conversation/*`
> - `projects/L1-work/*`
> - `projects/L1-identity/*`

---

## 一、问题背景

当前架构已经区分:

```text
GlobalMember
  平台级成员身份真相

ProjectMember
  成员在某个 Project 中的项目级承担关系

Conversation
  群聊 / 私聊 / thread 的正式对话真相
```

这能解决身份真相和项目分身问题,但还没有把 AI Member 的“视野”作为一等上下文表达。

现实使用体验更接近聊天软件:

```text
个人首页 / inbox
  ├─ 项目 A 群聊
  ├─ 项目 B 群聊
  ├─ 项目 C 群聊
  └─ 私聊 / 通知 / 待办

进入项目 A 后
  ├─ 项目目标
  ├─ 项目成员
  ├─ 项目群聊
  ├─ 任务板
  ├─ 当前流程
  └─ 相关产物
```

因此需要补一个概念:

```text
AI Member 既需要个人视野,也需要项目视野。
```

---

## 二、草案结论

建议引入:

```text
PersonalWorkspace
  面向某个 GlobalMember 的个人工作台上下文。

ProjectWorkspace
  面向某个 ProjectMember / Project 的项目工作台上下文。
```

二者不是新的业务真相层,而是:

```text
Workspace View / Context / Projection 层。
```

它们聚合读取 identity / work / conversation / process / artifact / governance 的事实,并只拥有少量视图局部状态。

---

## 三、核心分层

```text
Truth Sources
  identity
    - GlobalMember
    - member summary
    - lifecycle projection

  work
    - Project
    - ProjectMember
    - WorkItem
    - Backlog / Iteration

  conversation
    - Conversation
    - Turn
    - Participant

  process
    - ProcessInstance
    - Activity

  artifact
    - Artifact

  governance
    - Gate
    - Decision
    - Risk

Workspace View
  PersonalWorkspace
  ProjectWorkspace
  InboxItem
  ReadCursor
  WorkspacePreference

Consumers
  Chat
  Console
  Assistant
  AI Member Runtime
```

关键边界:

```text
Workspace 负责“看见什么”。
Truth Source 负责“事实是什么”。
AI Runtime 负责“决定怎么做”。
Conversation 负责“正式留下什么话”。
```

---

## 四、PersonalWorkspace

`PersonalWorkspace` 是 `GlobalMember` 视角下的个人工作台。

它回答:

```text
我是谁?
我在哪些项目里?
哪些项目需要我关注?
我有哪些未读消息、待办、gate、私聊和通知?
我最近打开了哪个项目?
```

典型内容:

```text
PersonalWorkspace
  - global_member_id
  - member summary
  - project list
  - inbox
  - private conversations
  - assigned work summary
  - pending gates
  - unread count projection
  - pinned / muted projects
  - last opened project
  - attention / focus state
```

它不拥有:

```text
GlobalMember 真相
Project 真相
ProjectMember 真相
Conversation / Turn 真相
WorkItem 真相
Process / Artifact / Gate 真相
```

---

## 五、ProjectWorkspace

`ProjectWorkspace` 是某个项目上下文下的成员项目视野。

它回答:

```text
我进入这个项目后,应该看到什么?
我在这个项目中的身份是什么?
项目当前目标、群聊、任务、流程、产物和 gate 是什么状态?
```

典型内容:

```text
ProjectWorkspace
  - project_id
  - project summary
  - project_member_id
  - project member summary
  - project group conversation
  - project members
  - workitems / backlog / iteration
  - process instance / current activity
  - artifacts
  - gates / risks / decisions
```

它不拥有:

```text
Project / ProjectMember 真相
Conversation / Turn 真相
WorkItem 真相
ProcessInstance / Activity 真相
Artifact 真相
Gate decision 真相
```

---

## 六、群聊与私聊视野规则

```text
群聊 AI Member
  ProjectWorkspace-first

私聊 AI Member
  PersonalWorkspace-first
```

群聊默认绑定项目上下文:

```text
Project Group Conversation
  -> ProjectWorkspace(project_id)
  -> ProjectMember(global_member_id, project_id)
```

私聊默认绑定个人上下文:

```text
DM Conversation
  -> PersonalWorkspace(global_member_id)
```

私聊中如果用户提到某个项目,才显式打开项目上下文:

```text
DM Conversation
  -> PersonalWorkspace(global_member_id)
  -> resolve Project A
  -> ProjectWorkspace(project_id=A)
```

群聊不应默认读取完整 `PersonalWorkspace`,避免泄露其他项目、私聊或跨项目待办。

---

## 七、AI Member 与 Conversation 数据流

### 7.1 群聊数据流

```text
用户 / 其他成员
  |
  | PostTurn
  v
[conversation]
  Project Group Conversation
  |
  | event: conversation.turn_posted
  v
[AI Member Process]
  Event Subscriber
  Attention Filter
  |
  | accepted event
  v
[AI Member Runtime]
  ContextScope = Project
  load ProjectWorkspace
  |
  | query project context
  v
[ProjectWorkspace]
  project / members / group chat / work / process / artifact / gate
  |
  | decide response / action
  v
[AI Member Runtime]
  |
  | PostTurn / domain command
  v
[conversation / work / process / artifact / governance]
```

### 7.2 私聊数据流

```text
用户
  |
  | PostTurn
  v
[conversation]
  DM Conversation
  |
  | event: conversation.turn_posted
  v
[AI Member Process]
  Event Subscriber
  Attention Filter
  |
  | accepted DM event
  v
[AI Member Runtime]
  ContextScope = Personal
  load PersonalWorkspace
  |
  | optional project resolve
  v
[PersonalWorkspace]
  inbox / projects / private conversations / assigned work / pending gates
  |
  | open ProjectWorkspace only if needed
  v
[AI Member Runtime]
  |
  | reply in DM or redirect to project group
  v
[conversation]
```

---

## 八、AI Member 内部处理流

```text
conversation event / direct RPC
  |
  v
[Member Process]
  Identity
  Event Subscriber
  Attention Filter
  IPC Bridge
  |
  | IPC message
  v
[Runtime Process]
  Context Resolver
    - group -> ProjectScope
    - DM -> PersonalScope
    - DM + project mention -> PersonalScope + ProjectScope

  Workspace Loader
    - load PersonalWorkspace
    - load ProjectWorkspace

  Memory Retriever
    - working memory
    - episodic memory
    - semantic memory refs

  Planner / LLM Loop
    - understand intent
    - decide action

  Tool Invoker
    - obey tool_scope

  Action Router
    - PostTurn
    - UpdateWorkItem
    - SubmitArtifact
    - RaiseGate
```

---

## 九、视图局部状态

Workspace View 可以拥有的状态仅限视图局部状态:

```text
read cursor
unread count projection
pinned projects
muted conversations
notification preferences
last opened project
inbox item visibility
focus / attention state
```

这些状态不应写入 identity / work / conversation / process / artifact / governance 的真相对象。

---

## 十、仓库归属候选

本草案当前倾向将 Workspace View 归属为独立 L1 仓:

```text
L1-workspace
```

原因:

```text
PersonalWorkspace / ProjectWorkspace 被 Chat、Console、Assistant、AI Member Runtime 共同消费。
它们需要统一 read cursor、unread、pin、mute、inbox visibility 等视图局部状态。
如果放在 UI 或 SDK,会导致多个消费者重复拼装。
如果放在 conversation,会让 conversation 越界持有 work/process/artifact/governance 聚合视图。
```

候选方案对比:

| 方案 | 说明 | 风险 |
|---|---|---|
| 新增 `L1-workspace` | 独立承载 PersonalWorkspace / ProjectWorkspace read model 和局部状态 | 新增仓库与跨域订阅成本;当前倾向采用 |
| 放入 `L1-conversation` | 与 inbox / unread / DM / group chat 接近 | 容易让 conversation 越界持有 work/process/artifact 聚合视图 |
| 放入 `L5-chat` / `L5-console` | 接近 UI 消费层 | Chat / Console / Assistant / Runtime 可能各自拼装,一致性差 |
| 放入 `L0-sdk` 聚合查询 | 调用方便 | SDK 容易承载业务语义,边界变重 |

当前倾向:

```text
新增 L1-workspace。

L1-workspace 是跨域 Workspace View 真相的拥有者,
但它只拥有视图局部状态和聚合投影,
不拥有 identity / work / conversation / process / artifact / governance 的业务真相。
```

---

## 十一、对既有 ADR-0004 的影响

本草案不推翻 ADR-0004:

```text
项目执行容器仍然 ProjectMember-scoped。
```

本草案补充:

```text
PersonalWorkspace 是 GlobalMember-scoped 个人视图。
ProjectWorkspace 是 ProjectMember / Project-scoped 项目视图。
DM 私聊可以先进入 PersonalWorkspace。
一旦执行项目动作,必须切换到对应 ProjectWorkspace / ProjectMember 上下文。
```

因此:

```text
GlobalMember 不是运行时容器粒度。
PersonalWorkspace 也不是运行时容器粒度。
ProjectMember 仍然是项目执行上下文和容器粒度。
```

---

## 十二、后续需要更新的文档

P0:

```text
architecture/adr/0004-global-vs-project-member.md
architecture/ai-member设计.md
```

P1:

```text
projects/L1-conversation/*
projects/L1-work/*
projects/L1-identity/*
projects/L1-process/*
projects/L1-artifact/*
projects/L1-governance/*
projects/L2-member/*
projects/L2-runtime/*
projects/L2-member-service/*
```

P2:

```text
projects/L5-chat/*
projects/L5-console/*
architecture/proto-draft/*
architecture/sdk-draft/*
```
