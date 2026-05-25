# L1-workspace

> **目录定位**:Workspace View 仓的子项目文档占位。  
> **当前状态**:新增候选仓,尚未完成 `00-需求文档.md` 与 `01-架构设计.md` 校准。  
> **上游依据**:`architecture/adr/drafts/0015-member-workspace-view.md` + `architecture/仓库拆分方案.md` §4.7。

---

## 一、仓定位

`L1-workspace` 用于承载成员视角的跨域 Workspace View。它不是第七个业务真相域,而是六个业务真相域之上的视图 / 上下文 / 投影层:

```text
PersonalWorkspace
  GlobalMember 视角的个人首页 / inbox / 项目列表 / 私聊 / 跨项目待办视图。

ProjectWorkspace
  ProjectMember / Project 视角的项目首页 / 项目目标 / 项目成员 / 项目群聊 / 任务板 / 当前流程 / 相关产物 / gate 视图。
```

它不是 identity / work / conversation / process / artifact / governance 的替代真相源。它负责回答“某个成员当前应该看见什么”,但不负责改写这些事实本身。

---

## 二、拥有与不拥有

拥有:

```text
ReadCursor
Unread projection
Pinned / muted state
WorkspacePreference
InboxItem visibility
Last opened project
Focus / attention state
```

这些状态只表达视图体验和注意力状态,例如未读、置顶、静音、最后打开项目、inbox item 是否隐藏。

不拥有:

```text
GlobalMember truth
Project / ProjectMember / WorkItem truth
Conversation / Turn truth
ProcessInstance / Activity truth
Artifact truth
Gate decision truth
```

项目动作仍然写回对应真相域:

```text
发消息      -> conversation
更新任务    -> work
推进活动    -> process
提交产物    -> artifact
请求决策    -> governance
```

---

## 三、后续文档任务

```text
00-需求文档.md
01-架构设计.md
02-概要设计.md
03-详细设计.md
05-测试方案.md
06-验收标准.md
07-实施计划.md
```

当前先保留 README 占位,避免 `projects/README.md` 与实际目录不一致。
