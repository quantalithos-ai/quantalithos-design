# conversation — 对话域详细设计

> **域定位**:对话域的详细设计文档。回答"人们怎么说话"。聚合根是 **Conversation**;Turn 是聚合内实体。
>
> **上游依据**:
> - `product/最终目的.md` §3.3 协作载体是对话
> - `product/六域模型.md` §四 对话域
> - `architecture/仓库拆分方案.md` §4.2 `quantalithos-conversation`
> - `architecture/标准对齐全景图.md` §一 `quantalithos-conversation`
> - `architecture/ai-member设计.md` §七 运行时协作时序(Turn 在 Member 间的流转)
> - 14 标准主对齐:**BPMN 2.0 Collaboration + AG-UI 17 事件**;次对齐:Scrum(5 事件)/ 9001
>
> **本文不承载**:对话内容的 LLM 处理(Runtime C1/C2)/ 跨平台桥接(Bridges 仓)/ 审计事件存储(observability)。

---

## 一、使命与边界

### 1.1 使命

**承载 Quantalithos 一切协作的载体**。产品叙事要求"协作载体是对话"(`最终目的.md` §3.3),本域把这个承诺落到**独立的聚合根**,而不是消息服务的附属。

具体职责:
- Conversation 聚合根:群聊 / 频道 / 私聊 / 线程 四形态的生命周期管理
- Turn 聚合内实体:对话发言的**不可变**记录,五种 kind(message/mention/decision/artifact/gate)
- 实时推送:AG-UI 17 事件映射,对接 Chat 前端
- 对话历史:永久可查,不做"30 天删除"这种破坏可审计性的设计
- 参与者管理:Member / User 加入 / 离开 Conversation

### 1.2 边界(不做的事)

- **不做 LLM 推理** —— 那在 Runtime C1
- **不做过程编排** —— 那在 process 域
- **不做 Gate 决策逻辑** —— 那在 governance 域(conversation 只渲染 GateCard 这类 Turn)
- **不做对话内容的业务分析** —— 如情感 / 意图 / 摘要由上层消费事件做
- **不做跨平台适配** —— 那在 Bridges 仓(bridged Turn 的语义由 Bridges 翻译)

### 1.3 与其他域的协作边界

```
┌──────────────────────────────────────────────────────────────┐
│  conversation 域(本文)                                       │
│  Conversation(4 形态)+ Turn(5 kind)                        │
└──┬───────────────────────────────────┬─────────────────────┬──┘
   │                                   │                     │
   │ 发 turn_posted 事件                │ 订阅事件            │
   ▼                                   ▼                     ▼
 Chat / Bridges                    governance                 其他域
 (通过 AG-UI 17 事件)              (Gate.raised → gate-Turn) (按需)
```

---

## 二、聚合根详细设计

### 2.1 Conversation 聚合根

#### 2.1.1 完整字段

```
Conversation {
    conversation_id:        ULID,
    kind:                   ConversationKind,    // group / channel / dm / thread
    title:                  Option<String>,      // dm / thread 可空
    description:            Option<String>,

    // 层级关系
    parent_conversation_id: Option<ConversationId>,  // channel 父是 group;thread 父是 turn
    parent_turn_id:         Option<TurnId>,          // thread 必须引用 Turn
    project_id:             Option<ProjectId>,       // group/channel 必有;dm/thread 可选

    // 参与者
    participants:           Vec<ParticipantRef>,     // 参与者集合(Member + User)
    visibility:             Visibility,              // open / closed / private

    // 元数据
    created_by:             ActorRef,
    created_at:             Timestamp,
    archived_at:            Option<Timestamp>,
    locked_at:              Option<Timestamp>,
    last_turn_at:           Timestamp,               // 冗余,加速查询

    // 生命周期
    lifecycle:              ConversationLifecycle,   // active / archived / locked

    // 桥接标记(来自 Bridges)
    bridged_from:           Option<BridgedSource>,   // 外部平台 + external_id

    // 审计
    audit_log_ref:          AuditLogRef,
    trace_id:               TraceId,
    version:                u64,                     // 乐观锁
}

ParticipantRef {
    actor_id:               ActorId,               // member_id 或 user_id
    actor_kind:             enum { member, user },
    joined_at:              Timestamp,
    joined_by:              ActorRef,              // 谁加的
    visibility_filter:      Option<VisibilityFilter>, // 用于 thread 场景
}
```

#### 2.1.2 四种形态的约束

| kind | parent | project_id | participants | 典型场景 |
|---|---|---|---|---|
| `group` | 无 | 必填 | 项目全员 | 项目主群 |
| `channel` | parent=group | 必填 | 自选子集 | 项目内子话题 |
| `dm` | 无 | 可空 | 严格 2 人 | 两人私聊 |
| `thread` | parent_turn_id 必填 | 继承父 | 自选子集 | Turn 下的讨论串 |

#### 2.1.3 生命周期状态机

```
          [创建]
             │
             ▼
       ┌───────────┐
       │  active   │  正常,可发 Turn,可加/退参与者
       └──┬────────┘
          │
   ┌──────┼──────┐
   │      │      │
 [archive]│    [lock]
   │      │      │
   ▼      │      ▼
┌──────────┐  ┌──────────┐
│ archived │  │  locked  │
└──────────┘  └──────────┘
  只读         合规锁定,不可发 Turn
  可查         也不可归档(需先解锁)
```

**关键**:
- `archived` 和 `locked` 都不可回 `active`(INV)
- `locked` 通常用于合规冻结(如审计期间)
- group/channel 的 `archived` 由 project.archived 事件自动触发
- dm/thread 的 `archived` 由参与者显式或 TTL 触发

#### 2.1.4 不变量(INV-1 到 INV-12)

**INV-1** `conversation_id` 永不复用
**INV-2** `kind=group` 且 `project_id != null` 时,每个 project 只能有一个 group(唯一性)
**INV-3** `kind=channel` 必须有 `parent_conversation_id` 指向 group,且 parent 是 active
**INV-4** `kind=dm` 的 `participants.length == 2`,两参与者不同
**INV-5** `kind=thread` 必须有 `parent_turn_id`,引用的 Turn 必须存在
**INV-6** `lifecycle` 状态转移严格按状态机(active → archived | locked,其他方向禁止)
**INV-7** `archived` 或 `locked` 后**不可再发新 Turn**
**INV-8** `participants` 的 `actor_kind=member` 时,member_id 必须指向 active / paused 的 GlobalMember(retired 自动移除)
**INV-9** `project_id` 一旦设置不可修改
**INV-10** `bridged_from` 一旦设置不可修改
**INV-11** thread 的 parent Turn 被 hidden 后,thread **不级联 hidden**(thread 本身仍可见,但入口在 UI 上弱化)
**INV-12** 同一 (project_id, kind=group) 不允许重复创建(INV-2 的强化,创建时查重)

#### 2.1.5 操作契约

| 操作 | 前置 | 后置 | 事件 |
|---|---|---|---|
| `CreateConversation(kind, ...)` | 按 kind 满足 INV-2/3/4/5 | 创建,state=active | `conversation.created` |
| `Archive(conv_id)` | state=active | state=archived | `conversation.archived` |
| `Lock(conv_id, reason)` | state=active | state=locked | `conversation.locked` |
| `Unlock(conv_id)` | state=locked + Gate 批准 | state=active | `conversation.unlocked` |
| `AddParticipant(conv, actor)` | state=active, INV-4 不违反 | 加人 | `conversation.participant_added` |
| `RemoveParticipant(conv, actor)` | state=active, INV-4 不违反 | 移除 | `conversation.participant_removed` |
| `PostTurn(conv, turn)` | state=active | Turn 创建 | `conversation.turn_posted` |
| `HideTurn(turn_id, reason)` | Turn 未 hidden | 标记 hidden | `conversation.turn_hidden` |

### 2.2 Turn 聚合内实体

#### 2.2.1 完整字段

```
Turn {
    turn_id:              ULID,
    conversation_id:      ConversationId,

    // 发言者
    author:               ActorRef,              // member_id / user_id / system
    author_kind:          enum { member, user, system, bridged },

    // 内容
    kind:                 TurnKind,              // message / mention / decision / artifact / gate
    content:              TurnContent,           // 按 kind 不同(见 2.2.2)

    // 关系
    parent_turn_id:       Option<TurnId>,        // 回复的 Turn
    referenced_turns:     Vec<TurnId>,           // 引用(quote)
    artifacts:            Vec<ArtifactRef>,      // 引用的 Artifact(kind=artifact 必填;其他可选)
    gates:                Vec<GateRef>,          // 引用的 Gate(kind=gate 必填)

    // 时间 / 可见性
    created_at:           Timestamp,
    visibility:           TurnVisibility,        // all | subset (指定参与者)
    visibility_members:   Vec<ActorId>,          // 若 subset

    // 状态(Turn 不可变 ≠ UI 状态)
    hidden:               bool,                  // UI 是否隐藏(内容保留)
    hidden_at:            Option<Timestamp>,
    hidden_by:            Option<ActorRef>,
    hidden_reason:        Option<String>,

    // 审计
    trace_id:             TraceId,
    bridged_from:         Option<BridgedSource>, // 若来自外部平台
    audit_log_ref:        AuditLogRef,
}
```

#### 2.2.2 五种 kind 的内容结构

```
TurnContent(discriminated by kind)

kind=message:
    text:              String        // markdown
    attachments:       Vec<Attachment>

kind=mention:
    text:              String
    mentioned_members: Vec<MemberRef>

kind=decision:
    decision_type:     enum { approve / reject / propose / vote / ...}
    subject:           String
    decision_maker:    ActorRef
    rationale:         String
    related_gate_id:   Option<GateRef>

kind=artifact:
    artifact_ref:      ArtifactRef       // 必填
    display_mode:      enum { preview / link / inline }
    comment:           Option<String>

kind=gate:
    gate_ref:          GateRef           // 必填
    gate_snapshot:     GateSnapshot      // 渲染时的 Gate 状态快照(不可变)
                                          // 后续 Gate 状态变化通过新 Turn 反映
```

#### 2.2.3 不变量(INV-13 到 INV-22)

**INV-13** `turn_id` 永不复用
**INV-14** Turn 内容**一旦创建不可修改**(编辑通过新 Turn + UI 层覆盖显示)
**INV-15** Turn **一旦创建不可删除**(只能标记 hidden)
**INV-16** `kind=gate` 必须有 `gates.length >= 1` 且第一个 gate_ref 有效
**INV-17** `kind=decision` 必须有 decision_maker
**INV-18** `kind=artifact` 必须有 `artifacts.length >= 1`
**INV-19** `kind=mention` 的 mentioned_members 非空
**INV-20** Turn 的 conversation 必须 `lifecycle=active`(否则发 Turn 被拒)
**INV-21** `parent_turn_id` 引用的 Turn 必须在同一 conversation
**INV-22** `author=bridged` 时 `bridged_from` 必填(标记桥接来源)

#### 2.2.4 操作契约

| 操作 | 前置 | 后置 | 事件 |
|---|---|---|---|
| `PostTurn(conv, turn)` | INV-20 + kind 对应 INV 满足 | Turn 持久化 + 冗余更新 last_turn_at | `conversation.turn_posted` + 可能触发 `conversation.mention_triggered` / `conversation.decision_made` 等副事件 |
| `HideTurn(turn_id, reason)` | Turn 未 hidden,请求者有权限 | 标记 hidden | `conversation.turn_hidden` |
| `UnhideTurn(turn_id)` | Turn hidden,请求者有权限(Gate 批准) | 标记 hidden=false | `conversation.turn_unhidden` |

---

## 三、RPC 对外接口(proto 草案)

### 3.1 服务定义

```proto
syntax = "proto3";
package quantalithos.conversation.v1;

service ConversationService {
    // === Conversation 管理 ===
    rpc CreateConversation(CreateConversationRequest) returns (CreateConversationResponse);
    rpc ArchiveConversation(ArchiveConversationRequest) returns (ArchiveConversationResponse);
    rpc LockConversation(LockConversationRequest) returns (LockConversationResponse);
    rpc UnlockConversation(UnlockConversationRequest) returns (UnlockConversationResponse);

    rpc AddParticipant(AddParticipantRequest) returns (AddParticipantResponse);
    rpc RemoveParticipant(RemoveParticipantRequest) returns (RemoveParticipantResponse);

    rpc GetConversation(GetConversationRequest) returns (Conversation);
    rpc ListConversations(ListConversationsRequest) returns (ListConversationsResponse);
    rpc QueryConversations(QueryConversationsRequest) returns (QueryConversationsResponse);

    // === Turn 管理 ===
    rpc PostTurn(PostTurnRequest) returns (PostTurnResponse);
    rpc HideTurn(HideTurnRequest) returns (HideTurnResponse);
    rpc UnhideTurn(UnhideTurnRequest) returns (UnhideTurnResponse);

    rpc GetTurn(GetTurnRequest) returns (Turn);
    rpc ListTurns(ListTurnsRequest) returns (ListTurnsResponse);  // 按 cursor 翻页
    rpc SearchTurns(SearchTurnsRequest) returns (SearchTurnsResponse);  // 全文检索

    // === 实时推送 ===
    rpc StreamEvents(StreamEventsRequest) returns (stream AGUIEvent);
      // 按 conversation 订阅;服务端用 AG-UI 17 事件协议推送
}
```

### 3.2 PostTurn 请求

```proto
message PostTurnRequest {
    string conversation_id = 1;
    TurnKind kind = 2;
    TurnContent content = 3;               // oneof message/mention/decision/artifact/gate
    optional string parent_turn_id = 4;
    repeated string referenced_turn_ids = 5;
    TurnVisibility visibility = 6;
    repeated string visibility_members = 7;
    audit.ActorContext actor = 8;
}

message PostTurnResponse {
    string turn_id = 1;
    google.protobuf.Timestamp created_at = 2;
    int64 conversation_version = 3;        // 乐观锁,支持客户端一致性
}
```

### 3.3 StreamEvents —— AG-UI 17 事件映射

Chat / Bridges 通过 gRPC server-streaming 订阅 conversation 变化。内部事件映射到 AG-UI 17 标准事件类型:

| 内部事件 | AG-UI 对应 |
|---|---|
| `conversation.turn_posted(kind=message)` | MESSAGE_CONTENT |
| `conversation.turn_posted(kind=mention)` | MESSAGE_CONTENT + MENTION_TRIGGERED |
| `conversation.turn_posted(kind=decision)` | STATE_UPDATE(决策卡片) |
| `conversation.turn_posted(kind=artifact)` | TOOL_CALL_RESULT(展示制品) |
| `conversation.turn_posted(kind=gate)` | CUSTOM(GateCard 交互) |
| `conversation.participant_added` | STATE_UPDATE |
| `conversation.participant_removed` | STATE_UPDATE |
| `conversation.archived / locked` | RUN_END |
| `conversation.turn_hidden / unhidden` | STATE_UPDATE |

**流控与背压**:
- 每订阅者独立 buffer(默认 1000 事件)
- 超过 buffer 断开订阅 + 发 `conversation.stream_overflow` 审计事件
- 订阅者用 `last_event_id` 做断点续传(事件 append-only 支持这种模式)

### 3.4 认证与授权

- **内部**:mTLS + 白名单服务
- **外部**(Chat / Bridges / SDK):OAuth2
- **参与者权限**:
  - active 参与者可读 + 发 Turn
  - 非参与者不可读(除 visibility=open 的公开 Conversation)
  - Archive / Lock / AddParticipant 操作**必须是 group/channel 的 creator 或项目 owner**,或经 Gate 批准

**字段级视图裁剪(ADR-0009)**:本域 Get / List / Stream 类 RPC **不接受 Role 参数**,返回已鉴权对象的全量字段(包括 Turn.content / reasoning_trace_ref / tool_calls)。按 Role 的字段可见性(例如对非作者隐藏内部 reasoning)、脱敏、派生字段由 UI 仓消费 method-library 的 ViewProfile 完成。actor 仅用于鉴权和审计留痕。

### 3.5 常见错误码

- `CONVERSATION_NOT_FOUND` / `TURN_NOT_FOUND`
- `CONVERSATION_ARCHIVED` / `CONVERSATION_LOCKED`(发 Turn 时)
- `INVALID_TURN_KIND_CONTENT`(不变量 INV-16 到 INV-19 被违反)
- `PARTICIPANT_LIMIT_EXCEEDED`(dm 要 2 人的硬约束)
- `DUPLICATE_GROUP_FOR_PROJECT`(INV-2 违反)

---

## 四、事件 schema 细节

### 4.1 事件清单

| 事件 | 主要用途 |
|---|---|
| `conversation.created` | 广播新 Conversation |
| `conversation.archived / locked / unlocked` | 生命周期变更 |
| `conversation.participant_added / removed` | 参与者变化 |
| `conversation.turn_posted` | 新 Turn(最高频) |
| `conversation.turn_hidden / unhidden` | Turn UI 可见性变化 |
| `conversation.mention_triggered` | @ 某人(副事件,供通知订阅) |
| `conversation.decision_made` | decision-kind Turn 产生(副事件) |
| `conversation.artifact_shared` | artifact-kind Turn 产生(副事件) |
| `conversation.gate_raised_in_conversation` | gate-kind Turn 产生 |
| `conversation.stream_overflow` | 流订阅溢出(审计) |

### 4.2 核心事件 schema

#### conversation.turn_posted

```
type:       conversation.turn_posted
subject:    turn_id
source:     service:quantalithos-conversation
traceparent: ...

data: {
    turn_id,
    conversation_id,
    conversation_kind,          // 冗余,便于订阅者过滤
    project_id,                 // 冗余
    author: { actor_id, actor_kind },
    turn_kind,                  // message / mention / ...
    content_summary,            // 前 200 字符(真正的 content 不放事件,避免 bus 膨胀)
    parent_turn_id,
    artifacts_count,            // 关联 Artifact 数量
    gates_count,                // 关联 Gate 数量
    visibility,
    created_at,
}
```

**设计取舍**:事件**不带完整 content**(尤其 markdown),只带摘要。订阅方需要完整内容时通过 `GetTurn(turn_id)` 查询。这避免 bus 负载爆炸 + 保护大消息的传输成本。

#### conversation.mention_triggered(副事件)

由 PostTurn 内的 mention kind 同步产生,**不合并到 turn_posted**:

```
data: {
    conversation_id,
    turn_id,
    mentioned_member: { member_id, project_member_id? },
    by_member,
    context_summary,
}
```

**用途**:notification 服务 / Chat 红点 / Bridges 外推通知的**专用订阅**(比 turn_posted 过滤成本更低)。

#### conversation.gate_raised_in_conversation

```
data: {
    conversation_id,
    turn_id,
    gate_id,
    gate_kind,
    project_id,
    decision_maker,
}
```

**用途**:Chat / Console 的 UI 通知;Bridges 的外部平台 GateCard 推送。

### 4.3 订阅事件(来自其他域)

| 订阅 | 来源域 | 动作 |
|---|---|---|
| `work.project.created` | work | 自动创建同名 group Conversation |
| `work.project.archived` | work | 对应 group 自动 archived(级联 channels / threads) |
| `work.project.member_assigned` | work | 把新 ProjectMember 的 GlobalMember 加入 group.participants |
| `work.project.member_retired_from_project` | work | 从 group.participants 移除 |
| `governance.gate.raised` | governance | 在 related conversation 发 gate-kind Turn |
| `governance.gate.decided` | governance | 在 related conversation 发 decision-kind Turn |
| `artifact.approved` | artifact | 可选:在 related conversation 发 artifact-kind Turn 通知 |
| `identity.member.retired` | identity | 从所有 Conversation.participants 移除(Turn 历史保留作者引用) |
| `identity.member.paused` | identity | 更新展示层(不踢出) |

### 4.4 事件幂等

- 所有 handler 用 event_id LRU 去重
- turn_posted 幂等 key:`turn_id`
- participant_added/removed 幂等 key:`conversation_id + actor_id + action + at`(允许重新加入同一 actor)

---

## 五、数据持久化方案

### 5.1 存储选型

**主数据库**:PostgreSQL 15+

**特殊考虑**:对话域**写入频率极高**(Turn 是系统里最高频的写入),需要专门优化。

**次存储**:
- **全文检索**:PG 原生 tsvector(中文用 pg_jieba)或外挂 OpenSearch
- **对象存储**:Turn 的大 attachment(图片 / 文档)存 S3,content 只存 URI

### 5.2 表结构

#### table: `conversations`

| 列 | 类型 | 约束 |
|---|---|---|
| conversation_id | ULID (PK) | |
| kind | enum | not null |
| title | varchar(256) | nullable |
| description | text | |
| parent_conversation_id | ULID | FK self |
| parent_turn_id | ULID | FK turns |
| project_id | ULID | nullable |
| participants | jsonb | default '[]' |
| visibility | enum | not null |
| lifecycle | enum | not null |
| bridged_from | jsonb | nullable |
| created_by | varchar(128) | not null |
| created_at | timestamptz | not null |
| archived_at | timestamptz | nullable |
| locked_at | timestamptz | nullable |
| last_turn_at | timestamptz | not null |
| version | bigint | default 1 |

**索引**:
- `idx_conv_project_kind` on (project_id, kind)
- `idx_conv_parent` on (parent_conversation_id)
- `idx_conv_last_turn` on (last_turn_at desc)
- **unique** index on (project_id) where (kind='group') —— 强制 INV-2

#### table: `turns`

高频写入,**按月分区**(PG native partitioning):

```
turns  (partitioned by RANGE (created_at))
├── turns_2026_01
├── turns_2026_02
...
```

| 列 | 类型 | 约束 |
|---|---|---|
| turn_id | ULID (PK 部分键) | |
| conversation_id | ULID | FK |
| author_actor_id | varchar(128) | not null |
| author_kind | enum | not null |
| kind | enum | not null |
| content | jsonb | not null |
| parent_turn_id | ULID | FK self, nullable |
| referenced_turns | jsonb | default '[]' |
| artifacts | jsonb | default '[]' |
| gates | jsonb | default '[]' |
| created_at | timestamptz | not null(分区键) |
| visibility | enum | not null |
| visibility_members | jsonb | default '[]' |
| hidden | bool | default false |
| hidden_at | timestamptz | |
| hidden_by | varchar(128) | |
| hidden_reason | text | |
| trace_id | varchar(64) | not null |
| bridged_from | jsonb | nullable |

**索引**:
- `idx_turns_conv_created` on (conversation_id, created_at desc)
- `idx_turns_author` on (author_actor_id, created_at desc)
- `idx_turns_fts` on (content_tsv) using gin —— 全文检索
- `idx_turns_kind_conv` on (kind, conversation_id) where (kind in ('gate','decision','artifact'))

**分区策略**:
- 新月自动创建分区(pg_partman)
- 老分区可迁冷(archive 仓协调,12 个月后迁归档表,但不删)

#### table: `conversation_events_outbox`

同 identity 域的 Outbox 模式,此处不重复。

### 5.3 一致性策略

- 单 Conversation + Turn 的写入走**单事务**(PostTurn 同时更新 last_turn_at + 发 Outbox 事件)
- 冗余字段(conversations.last_turn_at)通过 trigger 更新,不依赖应用层
- Cross-conversation 一致通过事件最终一致(如 group 归档级联 channel 归档)

### 5.4 写入性能优化

- **批量 Outbox 写入**:每秒 flush 一次 pending events
- **WAL 调优**:提高 checkpoint_timeout,减少 checkpoint 频率
- **连接池**:pgbouncer in transaction pooling 模式
- **读副本**:历史查询走 replica,最新 Turn 走 primary

### 5.5 容量估算

假设 10 万活跃用户 × 日均 50 Turn = 500 万 Turn/天 ≈ 1.5 亿/月。PG 分区 + 分层存储可以应对;历史 Turn 查询走 replica。

---

## 六、与其他域的事件订阅链路

### 6.1 事件流全景

```
conversation 域 → 其他域
───────────────────────
conversation.turn_posted       → Chat(AG-UI)/ Bridges(外部平台推送)/
                                 governance(gate Turn 触发 Gate 联动)/
                                 observability(审计)
conversation.mention_triggered → notification 服务(未实现,预留)/
                                 Chat 红点
conversation.gate_raised_in_conv → Chat(UI)/ Bridges(外部提示)
conversation.archived/locked   → member-service(如有项目 group 被 lock,
                                 暂停相关容器的事件转发)

其他域 → conversation 域
───────────────────────
work.project.created              → 自动创建 group
work.project.archived             → 级联 archive 所有相关 conv
work.project.member_assigned      → 加入 group.participants
identity.member.retired           → 从所有 conv.participants 移除
governance.gate.raised            → 发 gate-kind Turn
governance.gate.decided           → 发 decision-kind Turn
artifact.approved                 → 可选,发 artifact-kind Turn
```

### 6.2 典型联动场景

#### 场景 A:立项 → group 创建 → 成员加入 → 首次对话

```
用户在和 Assistant 的 dm 里说"立项"
  [conversation.turn_posted(kind=message, dm, by user)]
    ↓
Assistant 处理 → 触发 work.CreateProject
  [work.project.created(project=P1)]
    ↓ conversation 订阅
auto-create group
  [conversation.created(kind=group, project=P1)]
    ↓
work.project.member_assigned × N
    ↓ conversation 订阅
AddParticipant × N
  [conversation.participant_added] × N
    ↓
每个 Member 的 "Hello" Turn
  [conversation.turn_posted(kind=message)] × N
```

#### 场景 B:Gate 决策的完整链路

```
process.activity 需要 Gate
  [process.activity.waiting_gate]
    ↓ governance 订阅
governance.Gate 创建
  [governance.gate.raised]
    ↓ conversation 订阅
PostTurn(kind=gate) into related group
  [conversation.turn_posted(kind=gate)]
  [conversation.gate_raised_in_conversation]
    ↓
Chat 推送 AG-UI CUSTOM event 给用户
  (用户在 Chat 看到 GateCard)
    ↓
用户在 Chat 点击 approve
  → ChatClient 调用 governance.DecideGate
    ↓
  [governance.gate.decided]
    ↓ conversation 订阅
PostTurn(kind=decision) into same group
  [conversation.turn_posted(kind=decision)]
```

### 6.3 桥接(Bridges)的映射

Bridges 作为 conversation 域的**特殊客户端**:

- 外部平台(Mattermost 等)的 channel 映射到 Quantalithos 的 Conversation(kind=group, bridged_from=...)
- 外部消息转为 Turn(author_kind=bridged, bridged_from 标记来源)
- 本域事件通过 AG-UI 推到 Bridges,Bridges 翻译后发到外部平台

**敏感 Gate**(按产品清单 BR3)在外部平台渲染简化版本,带"打开 Chat 审批"按钮,真实决策仍走 Chat → conversation → governance。

---

## 七、性能与可用性目标

### 7.1 业务指标

| 指标 | 目标 | 说明 |
|---|---|---|
| PostTurn P95 延迟 | < 100ms | 含 DB 写 + Outbox 入队 |
| PostTurn P99 延迟 | < 300ms | |
| StreamEvents 端到端延迟 | < 500ms | Turn 创建 → Chat 收到 AG-UI 事件 |
| 查询历史 Turn(1 页 50 条)P95 | < 150ms | |
| 全文检索 P95 | < 500ms | 索引命中场景 |
| Availability | ≥ 99.9% | 30d 滚动 |
| 高峰 QPS | 5000 读 / 500 写 | 按 10w 用户估 |

### 7.2 容量假设

- 每用户日均 50 Turn(含 AI Member 产生的)
- 10w 活跃用户 → 500w Turn / 天 ≈ 1.5 亿 / 月
- 对话数量:10w 项目 × 1 group + 平均 3 channel = 40w active Conversation
- StreamEvents 并发订阅者峰值:100w(每用户的所有端共享订阅)

### 7.3 降级策略

- **全文检索失败**:fallback 到最近 N 天的精确关键字 LIKE 查询
- **Outbox 积压**:拒绝新 PostTurn(发 503)+ 告警
- **StreamEvents 过载**:每订阅者断开 + 降级为 polling(客户端行为)
- **全局 conversation 服务挂**:Chat / Bridges 显示"正在连接..." + 本地缓存最近 100 条 Turn 只读可用

### 7.4 读写分离

- **读副本**:历史查询(ListTurns、SearchTurns)
- **主库**:PostTurn + 最新 50 Turn 的 ListTurns(减少副本延迟影响)

### 7.5 监控关键点

- PostTurn QPS / P95 / 错误率
- Outbox 积压深度
- StreamEvents 活跃订阅者数量
- 全文检索命中率
- 分区表大小(每月新分区)

---

## 八、安全与合规对齐

### 8.1 42001 控制项对齐

| 控制族 | 控制项 | 本域落地 |
|---|---|---|
| A.8 信息提供 | 用户信息透明 | Turn 永久可查(INV-15)+ 可审计历史 |
| A.9 Responsible Use | 禁止滥用 | PostTurn 经 Attention 预过滤(Prompt Injection) |
| A.10 第三方 | Bridges 作为第三方 | bridged_from 标记 + 独立权限链 |

### 8.2 9001 对齐

- § 7.5 Documented Information:对话即记录(INV-15 保证)
- § 10.1 纠正措施:Lock 机制对应合规锁定

### 8.3 25010 质量特性

- **Interaction Capability 6 子特性**(通过 Chat UI 落地,本域提供事件数据)
- **Reliability**:§七 性能指标
- **Security Confidentiality**:visibility 控制;桥接内容的边界
- **Compatibility Interoperability**:AG-UI 标准事件 + Bridges 多平台支持

### 8.4 横切红线

- **可审计性**:所有 Turn 不可变、不可删;hidden 只改 UI 展示,审计仍可查
- **可追溯性**:trace_id 贯穿;Turn 关系图(parent / referenced / artifacts / gates)完整
- **可裁剪性**:visibility 可自定义;通知订阅可裁剪

### 8.5 隐私敏感点

- **桥接** PII(外部平台用户名)存储加密
- **Turn 内容** 支持后续 PII 扫描(未实现,预留接口)
- **conversation 归档** 对长期保留有选项:
  - project 归档 → conversation 只读冷存
  - tombstone 级别处理目前按合规,具体由 archive 域协调

---

## 九、测试策略

### 9.1 单元测试重点

- **Conversation 四形态**的所有 INV-2 到 INV-5 约束(group 唯一、channel 必有 parent、dm 2 人、thread 必有 parent turn)
- **Turn 五 kind**的所有 INV-16 到 INV-19(各 kind 对应字段必填)
- **lifecycle 状态机**所有合法 / 非法转移
- **Turn 不可变 / 不可删**(INV-14 / INV-15)

### 9.2 集成测试重点

- Outbox 高并发写(每秒 500 次 PostTurn 的幂等性)
- 分区表跨月的查询正确性
- StreamEvents 的断点续传(last_event_id)
- Bridges 桥接的 Turn 双向同步

### 9.3 E2E 场景

- 立项 → group 自动创建 → 成员加入 → 首次对话
- Gate 完整链路(raise → gate-Turn → 用户审批 → decision-Turn)
- 项目归档 → 级联归档 conversation
- 桥接场景(Mattermost 消息 → Quantalithos Turn → Chat 可见)

### 9.4 性能压测

- PostTurn 5000 QPS 持续 30 分钟
- StreamEvents 1w 并发订阅者
- SearchTurns 在 1000w Turn 数据集上的 P95

### 9.5 安全测试

- 非参与者访问被拒绝
- hidden Turn 不泄漏(含在 StreamEvents 中)
- Prompt Injection 内容发出后审计可回溯

---

## 十、开放问题

### Q1. Turn 编辑的用户体验

**背景**:Turn 本身 INV-14 不可变。但用户可能手滑发错消息,希望"撤回 / 编辑"。

**候选**:
- (A)允许 30 秒内发新 Turn 覆盖旧 Turn,UI 显示"已编辑";超时后只能 hide
- (B)只允许 hide,用户重发新消息
- (C)允许完全编辑内容(违反 INV-14)

**倾向**:A

**推进**:UX 设计阶段决策;可能涉及专门的 `turn.edit_version` 字段。

### Q2. 全文检索是 PG 原生还是 OpenSearch

**背景**:Turn 高频 + 量大,PG tsvector 可能扛不住十亿级。

**候选**:
- (A)PG 原生 tsvector + 分区
- (B)OpenSearch / Elasticsearch 专门跑索引
- (C)混合:最近 3 个月走 PG,老的走 OpenSearch

**倾向**:C(平衡成本和复杂度)

**推进**:段 3 部署架构决策。

### Q3. 通知(mention / gate_raised)是独立服务还是嵌入本域

**背景**:mention 和 gate 的"通知到用户"能力包括邮件 / push / 桌面提醒。

**候选**:
- (A)本域只发事件,notification 服务独立(未存在,未来可建)
- (B)本域提供简单通知(仅 web push),复杂通知交给外部
- (C)本域不管通知,Chat 自己处理

**倾向**:A(长期)+ C(短期)

**推进**:Marketing / 产品运营阶段决策。

### Q4. thread 的 visibility 继承规则

**背景**:thread 的 parent_turn 在 group / channel 可见,thread 本身是否默认所有人可见?

**候选**:
- (A)thread 默认全部 parent 可见者可读,thread 内参与者可写
- (B)thread 严格自选参与者,默认只有 starter
- (C)由 parent conversation 的 kind 决定(group parent → 全可见;channel parent → 参与者可见)

**倾向**:A(符合"线程是扩展讨论"的直觉)

**推进**:UX 设计阶段决策。

### Q5. Bridged conversation 的 lifecycle 同步

**背景**:Mattermost 的 channel 被删除,Quantalithos 的 bridged conversation 怎么办?

**候选**:
- (A)级联 archive(Mattermost 删 → 本域 archive)
- (B)保留 Quantalithos 数据作为审计,标记 bridged_disconnected
- (C)Bridges 定期扫对齐

**倾向**:B(保证审计完整)

**推进**:Bridges 详细设计阶段;走 ADR。

### Q6. 对话的 @ 全体 / @ 角色

**背景**:mention 当前假设 @ 具体 Member。实际使用中可能需要 @all / @qa(按 Role)。

**候选**:
- (A)支持 @all / @role=<role-id>,运行时展开为具体 MemberId 列表
- (B)只支持 @ 具体 Member,不做"泛 mention"
- (C)支持 @all,但 @role 通过 Slash Command 实现

**倾向**:A

**推进**:Chat UI 设计阶段决策。

---

## 十一、与下游文档的关系

### 11.1 本文与 `quantalithos-conversation` 仓 README(段 3)

```
domain/conversation/README.md(本文)      ↔     quantalithos-conversation 仓(段 3)
─────────────────────────────                   ───────────────────────────────────
§二 聚合根                                        src/domain/
§三 RPC 接口                                    proto/
§四 事件                                        src/events/
§五 持久化                                      migrations/ + partition scripts
§六 跨域协作                                    src/subscriptions/
§九 测试                                        tests/
```

### 11.2 与 Chat / Bridges 的关系

- **Chat** 通过 `StreamEvents` 订阅;通过 `PostTurn` 提交
- **Bridges** 通过 `StreamEvents`(监听本域事件)+ `PostTurn`(把外部消息翻译成 Turn)+ 外部平台 SDK
- Chat 和 Bridges 都是**客户端**,不直接操作 conversation 域的持久化

### 11.3 与 governance / work 的协作

- governance 通过事件驱动 gate-Turn 和 decision-Turn 的生成
- work 通过事件驱动 group 的生命周期(创建 / 归档 / 成员变化)

### 11.4 修订纪律

- Conversation 四形态 + Turn 五 kind 的定义修改必须 ADR
- 事件 schema 的 breaking 变更必须 ADR
- RPC / AG-UI 映射 breaking 必须 ADR + Chat / Bridges 协调
- 分区策略 / 索引 / 性能指标调整不需要 ADR(走运维 runbook)

---

## 十二、总结

本文把对话域从"一节六域模型叙事"展开到"可以实现"的程度。关键成果:

1. **Conversation 聚合根 + Turn 实体的完整字段 / 不变量(INV-1 到 INV-22)**
2. **RPC + AG-UI 17 事件映射**(Chat / Bridges 的对接协议)
3. **事件 schema**(注意 turn_posted 不带完整 content)
4. **PG 分区设计 + 全文检索**(应对高频写入和大量历史)
5. **与 Chat / Bridges / governance / work 的完整联动图**
6. **6 个开放问题**,覆盖 UX / 检索基础设施 / 通知 / 桥接等

**关键承诺**:

- Conversation 是一等聚合根(产品叙事的技术落地)
- Turn 不可变 + 不可删,对齐可审计性
- AG-UI 17 事件标准集成,不自定义私有协议
- 桥接有权限边界(敏感 Gate 不在外部完整渲染)
- 高频写入 + 历史可查 兼顾

---

## 附录 A:不变量完整清单

| 编号 | 不变量 | 节 |
|---|---|---|
| INV-1 | conversation_id 永不复用 | §2.1.4 |
| INV-2 | 每 project 唯一 group | §2.1.4 |
| INV-3 | channel 必有 group parent(active) | §2.1.4 |
| INV-4 | dm 严格 2 人 | §2.1.4 |
| INV-5 | thread 必有 parent_turn_id | §2.1.4 |
| INV-6 | lifecycle 单向转移 | §2.1.4 |
| INV-7 | archived / locked 不可发新 Turn | §2.1.4 |
| INV-8 | participants 的 member_id 对应 active / paused | §2.1.4 |
| INV-9 | project_id 不可修改 | §2.1.4 |
| INV-10 | bridged_from 不可修改 | §2.1.4 |
| INV-11 | thread 不级联 hidden | §2.1.4 |
| INV-12 | 同 project group 唯一性(INV-2 的强化) | §2.1.4 |
| INV-13 | turn_id 永不复用 | §2.2.3 |
| INV-14 | Turn 内容不可修改 | §2.2.3 |
| INV-15 | Turn 不可删除,只能 hide | §2.2.3 |
| INV-16 | gate kind 必有 gates | §2.2.3 |
| INV-17 | decision kind 必有 decision_maker | §2.2.3 |
| INV-18 | artifact kind 必有 artifacts | §2.2.3 |
| INV-19 | mention kind 必有 mentioned_members | §2.2.3 |
| INV-20 | Turn 的 conversation 必须 active | §2.2.3 |
| INV-21 | parent_turn 同一 conversation | §2.2.3 |
| INV-22 | author=bridged 必填 bridged_from | §2.2.3 |

---

## 附录 B:设计原则审视

| 原则 | 本文体现 |
|---|---|
| SRP | 只管对话,不管 Gate 决策 / 通知渲染 / 跨平台适配 |
| OCP | Turn kind 可扩展(需 ADR),AG-UI 17 事件可新增映射 |
| DRY | bridged 复用 Turn 结构,不另设桥接消息表 |
| KISS | kind = message/mention/decision/artifact/gate 五种,不过度分类 |
| YAGNI | 不做 Turn 编辑(只做 hide + 重发,Q1 待决) |
| 不可变优先 | Turn / 事件都不可变 |
| 显式优于隐式 | 22 条不变量显式声明 |
| Fail Fast | 非法 kind 组合 PostTurn 立即拒绝 |
| 幂等性 | Outbox event_id + Turn_id 双重幂等 |
| 关注点分离 | 通知 / 全文检索 / 桥接 各自独立 |

---

## 附录 C:订正标记

- [ ] §3.3 AG-UI 17 事件映射的精确字段待原型阶段校验(需参考 CopilotKit 源码)
- [ ] §5.2 分区策略的具体月度边界 / pg_partman 配置待段 3 落地
- [ ] §5.4 WAL 调优参数待压测后确定
- [ ] §6.2 场景 B 的精确时序待 Chat → governance 的 RPC 路径定稿后更新
- [ ] §10 六个开放问题分别有对应推进时机,届时可能产出新 ADR

---

> 本文是 Quantalithos A 方案段 2 的第三件文档。对话域的详细设计以本文为单一真相源。
