# AI Member 设计

> **文档定位**:Quantalithos L2 Member 运行层的**设计权威**。定义 AI 员工在运行时的形态、内部模块、仓库分工、生命周期、与六域的交互。  
>
> **上游依据**:
> - `product/最终目的.md` §3.2 —— "员工是有身份的个体"的产品叙事
> - `product/六域模型.md` §三 GlobalMember + §五.2.2 ProjectMember + §九 横切四条
> - `architecture/仓库拆分方案.md` §L2 Member 运行层 5 仓
> - `architecture/标准对齐全景图.md` §一 L2 单仓对齐
> - `architecture/adr/0003-identity-rust-stack.md`
> - `architecture/adr/0004-global-vs-project-member.md`
> - `architecture/adr/0005-member-image-per-role.md`
> - `architecture/adr/drafts/0015-member-workspace-view.md`
>
> **下游承接**:
> - L2 五仓各自的 `README.md`(段 3 产物)← 本文是它们的上位设计
> - `domain/identity/README.md`(段 2 并行产物)← 本文的 GlobalMember ↔ ProjectMember 接口对齐
> - `domain/work/README.md`(段 2 并行产物)← ProjectMember 详细设计
> - 后续与 Member 相关的 ADR(Memory 归属 / Checkpoint 位置 / SubAgent 形态 / LLM 路由 等)
>
> **本文不承载**:L1 业务真相域与 Workspace View 的详细设计(留给对应 L1 仓);具体 proto / DB schema(留给段 3);UI 设计(留给 UX 文档)。

---

## 一、使命与定位

### 1.1 L2 Member 运行层的使命

承载 **AI 员工在运行时的所有形态**。上接 L1 身份域 / 工作域(Member 身份与分配的数据定义),下接 L3 方法能力层(能力与方法内容)和 L4 基础设施(沙箱 / 观测)。

六条具体职责:

1. **让一个 GlobalMember 在一个 Project 里"活起来"** —— 实例化为 ProjectMember 的运行态容器
2. **承载 Member 的对外社交** —— 订阅相关事件、发布产出事件、接收直接 RPC
3. **承载 Member 的内部决策** —— LLM 推理循环 + 工具调用 + 记忆检索 + 反思
4. **隔离执行风险** —— 沙箱内执行,不污染主机,不越权调用
5. **保证可恢复** —— 崩溃后从 checkpoint 恢复,对齐持久执行理念
6. **保证可审计 / 可追溯** —— 任何决策 / 工具调用 / 状态变更都发事件

### 1.1.1 AI Member 的两层视野

AI Member 在运行时不仅需要项目执行上下文,也需要成员个人上下文:

```text
PersonalWorkspace
  个人视野。
  回答“我是谁、我在哪些项目里、哪些项目/私聊/待办需要我关注”。

ProjectWorkspace
  项目视野。
  回答“我进入某个项目后,项目目标、成员、群聊、任务、流程、产物和 gate 是什么”。
```

二者不是新的身份真相或工作真相,而是 Workspace View / Context / Projection:

```text
identity / work / conversation / process / artifact / governance
  仍然拥有正式业务真相。

PersonalWorkspace / ProjectWorkspace
  只负责聚合读取这些真相,并承载 read cursor、unread、pin、mute、last opened 等视图局部状态。
```

群聊和私聊的默认视野不同:

```text
项目群聊中的 AI Member
  ProjectWorkspace-first

私聊中的 AI Member
  PersonalWorkspace-first
```

边界规则:

```text
群聊不默认读取完整 PersonalWorkspace,避免泄露其他项目、私聊和跨项目待办。
私聊可以读取 PersonalWorkspace;如果用户谈到具体项目,再显式打开对应 ProjectWorkspace。
执行项目动作时必须绑定到 ProjectWorkspace / ProjectMember 上下文。
```

### 1.2 与产品叙事的对齐

产品叙事(`最终目的.md` §3.2)要求员工"有持久身份 / 有记忆 / 可被登录"。本层的具体落地:

| 叙事承诺 | 本层实现 |
|---|---|
| 员工可被"登录"查看在干什么 | Member Process 暴露 ExternalRPC,返回当前 Turn / Activity / Tool 调用链 |
| 员工有"记忆" | Runtime 的 Memory Store 三层(working / episodic / semantic) |
| 员工有"能力边界" | Runtime 的 Tool Invoker 按 `tool_scope + policy_overrides` 过滤 |
| 员工犯错可回滚 | Checkpoint 外部持久化,支持从任意步回滚 |
| 员工"下班" | Member 优雅下线:落盘 Checkpoint + 标记 Memory dirty + 发事件 + 退出 |

### 1.3 本层与上下游的清晰边界

```
┌──────────────────────────────────────────────────────────────┐
│  L1 身份域       L1 工作域                                   │
│  GlobalMember    ProjectMember                                │
│  (持久档案)      (项目分配 + tool_scope + policy_overrides)  │
└────────┬─────────────────┬────────────────────────────────────┘
         │                 │
         │ 订阅事件         │ 订阅事件
         ▼                 ▼
┌──────────────────────────────────────────────────────────────┐
│  L2 Member 运行层(本文)                                      │
│                                                               │
│  member-service ── 编排容器                                   │
│       │                                                       │
│       └── 启动 Container ──→ Member Process + Runtime Process │
│                              (使用 member-images 的镜像)      │
│                                                               │
└────────┬───────────┬─────────────────────────────────────────┘
         │           │
         ▼           ▼
┌─────────────┐  ┌─────────────┐
│ L3 能力层   │  │ L4 基础设施  │
│ method-lib  │  │ sandbox     │
│ capability- │  │ observability│
│   hub       │  │ (archive)   │
└─────────────┘  └─────────────┘
```

**本层不做**:
- **不持久化身份数据** —— GlobalMember / ProjectMember 的 CRUD 在 L1,本层只消费
- **不定义 Role / Capability** —— 那在 L3 method-library,本层只实例化
- **不实现 MCP Server 治理** —— 那在 L3 capability-hub,本层只调用
- **不定义沙箱实现** —— 那在 L4 sandbox,本层只使用
- **不做业务过程编排** —— 那在 L1 process 域,本层只接受 Activity 指令并执行
- **不拥有 Workspace View 真相** —— PersonalWorkspace / ProjectWorkspace 是上游聚合视图,本层只消费其上下文

---

## 二、5 仓职责再澄清

本节对仓库拆分方案 §L2 的 5 仓**职责与边界**做进一步澄清。ADR-0003 / 0004 / 0005 分别固化了其中三个关键决策。

### 2.1 仓库关系图

```
┌─────────────────────────────────────────────────────────────┐
│  quantalithos-member-service     Rust / 容器外              │
│  (L2 编排层)                                                 │
│  ├─ Orchestrator (Docker / k8s)                             │
│  ├─ Endpoint Registry (member_id → endpoint)                │
│  ├─ Heartbeat Monitor                                       │
│  └─ Role → image_variant 映射(引用 method-library)          │
└──────┬──────────────────────────────────────────────────────┘
       │ docker run
       ▼
┌─────────────────────────────────────────────────────────────┐
│  Container(来自 quantalithos-member-images 构建)           │
│                                                             │
│  supervisord (PID 1)                                        │
│  ├──→ Member Process         Rust,容器内门面(6 子模块)    │
│  │        (quantalithos-member)                             │
│  │                                                          │
│  │   通过 UDS gRPC 双向通信                                  │
│  │                                                          │
│  └──→ Runtime Process        Python,容器内大脑(9 子模块)  │
│           (quantalithos-runtime)                            │
│                                                             │
│   Runtime 调用 Tools(quantalithos-tools 装在同一镜像里)    │
│   Tools 通过 capability-hub 调用外部 MCP Server              │
│   Tools 通过 sandbox 执行危险操作                            │
└─────────────────────────────────────────────────────────────┘

镜像构建来自:
┌─────────────────────────────────────────────────────────────┐
│  quantalithos-member-images    Dockerfile + CI              │
│  每晚构建:                                                  │
│  ai-member-base:<ver>                                       │
│  ai-member-<role>:<ver>  × N(backend-dev / qa / ...)        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 五仓职责一览

| 仓 | 语言 | 部署位置 | 职责关键词 | 不做的事 |
|---|---|---|---|---|
| `quantalithos-member` | Rust | 容器内(进程) | 门面 / 社交 / 嘴耳 | 不决策 / 不调 LLM |
| `quantalithos-runtime` | Python | 容器内(进程) | 大脑 / 决策 / 工具调用 | 不出网(通过 capability-hub)/ 不开服务端口 |
| `quantalithos-tools` | Python | 容器内(库) | 工具集 / MCP Client | 不自治(只被 Runtime 调用) |
| `quantalithos-member-images` | —(Dockerfile) | CI 构建产出 | 镜像构建 / Role 实例化 | 不运行时 / 不 CI 外构建 |
| `quantalithos-member-service` | Rust | 容器外(服务) | 编排 / 注册 / 心跳 | 不进容器 / 不跑业务逻辑 |

### 2.3 三个关键决策的 ADR 锚点

- **ADR-0003** `identity-rust-stack`
  identity 仓技术栈决策(与本文间接相关,member-service 订阅 identity 事件)
- **ADR-0004** `global-vs-project-member`
  GlobalMember 在 identity,ProjectMember 在 work;容器只对应 ProjectMember
- **ADR-0005** `member-image-per-role`
  镜像按 Role 预构建,每晚 CI;不运行时现装工具

### 2.4 为什么不合仓(反例驳斥)

曾考虑过的几种合仓方案,都因违反单一职责或架构方法论被排除:

| 合仓方案 | 为什么不采纳 |
|---|---|
| member + runtime 合仓 | 语言不同(Rust + Python);耦合会拖慢两边的迭代节奏 |
| runtime + tools 合仓 | Tools 独立演进更快(每周可能新增 MCP Tool);合仓后 runtime 每次发版被拖 |
| member-service + member 合仓 | service 是容器外编排层,member 是容器内门面,部署拓扑根本不同 |
| member-images 合入 member | 镜像构建是 CI 产物,和进程代码的版本节奏不同;每晚 CI 不等于每次代码提交 |
| 全合 monorepo | 违反"聚合一致性边界分仓"原则;违反 SDP 稳定依赖 |

---

## 三、Member Process:6 子模块详细设计

Member Process 是容器内的**门面进程**,用 Rust 实现,职责是 **"嘴耳" —— 入站筛选 + 出站代笔**,不做决策。

### 3.1 子模块总览

```
Member Process(Rust)
 ├─ B1. Identity          身份卡 + launch_token 校验
 ├─ B2. Event Subscriber  订阅 bus 主题 + 入站事件过滤
 ├─ B3. Event Publisher   出站 CloudEvents 发布
 ├─ B4. External RPC Server  对 member-service 的 gRPC(:50143)
 ├─ B5. Attention         优先级判定 + 去噪 + Prompt Injection 预过滤
 └─ B6. IPC Bridge        UDS gRPC 双向通道(面向 Runtime)
```

### 3.2 B1 · Identity

**职责**:在容器启动时把 launch_token 解析为运行时身份卡;在所有对外调用中附带身份信息。

**数据结构**(示意):

```
MemberIdentity {
    global_member_id,       // UUID,来自 identity 域
    project_member_id,      // UUID,来自 work 域
    project_id,             // UUID
    role_id,                // 如 "backend-dev"
    image_variant,          // 如 "ai-member-backend-dev"
    image_digest,           // 镜像哈希,审计用
    container_id,           // 由 member-service 分配
    launch_token,           // JWT,short-lived,绑定身份 + scope
    endpoint,               // 本容器对外 gRPC 的 host:port
    start_at,               // 启动时间
    trace_id,               // 整个生命周期的根 trace
}
```

**关键约束**:

- launch_token 使用**短时效 JWT**(30 分钟),由 member-service 签发,过期前通过 heartbeat 续签
- **不信任本地文件**:token 只能从环境变量 + member-service 的 register 响应中获取,不从容器内文件加载
- **token 不写入磁盘**:保留在内存;崩溃后重启由 member-service 重新签发

**对齐标准**:
- `子项目遵循规范清单.md` MB1(launch_token 校验)
- 42001 §A.3(AI Actor 责任链的身份基础)
- 27001(密钥管理)

### 3.3 B2 · Event Subscriber

**职责**:订阅 bus 上与本 Member 相关的事件,过滤后传给 Runtime。

**订阅过滤器(三级)**:

1. **身份过滤**:只收与本 member_id / project_member_id / project_id 相关
2. **角色过滤**:基于 role_id 订阅 role-level 事件(例如 tech-lead 订阅 `governance.gate.raised` 全量;backend-dev 只订与自己有 assignee 关系的)
3. **上下文过滤**:项目群聊事件只收本 project 内事件;私聊 / DM 事件可进入 PersonalWorkspace-first 路径,但不得直接携带其他项目正文进入当前 ProjectMember 容器

**订阅的关键事件族**(对齐六域模型):

```
conversation.turn_posted       若 author 或 mention 含本 Member
conversation.dm_turn_posted    若 DM participant 含本 GlobalMember
conversation.gate_raised       若本 Member 是 decision_maker 之一
work.workitem.assigned         若 assignee 是本 ProjectMember
work.workitem.state_changed    若本 Member 是 assignee / reviewer
process.activity.scheduled     若本 Member 是 Activity 承担者
governance.policy.updated      若影响本 Member 的 tool_scope / policy_overrides
identity.member.role_changed   若本 Member 的 role 变化(触发重启容器)
identity.member.paused/retired 若本 Member 被下线
```

**幂等性**:B2 必须处理 bus 的重复投递,通过 event_id 去重(保留最近 10000 个 event_id 的 LRU)。

**对齐标准**:
- 六域模型 §2.2 规则 5(事件幂等)
- 子项目遵循规范清单 MB3(只发 CloudEvents,反向:只收 CloudEvents)

### 3.4 B3 · Event Publisher

**职责**:把 Runtime 的业务事实打包为 CloudEvents 发布到 bus。

**发布的事件族(本层产生)**:

```
member.online / offline / crashed          容器级生命周期
member.tool_invoked / tool_failed          工具调用(审计关键)
member.llm_call_started / completed / failed   LLM 调用
member.checkpoint_saved                    每步 checkpoint 后
member.subagent_spawned / completed        SubAgent 生命周期
member.memory_written                      Memory 写入(标记血缘)
member.attention_filtered                  Attention 过滤掉的事件(审计用)
```

**强约束**:

- 所有事件遵循 CloudEvents 1.0 包络
- 强制字段:`traceparent`(W3C Trace Context)/ `actor.member_id` / `project_id` / `source=container:<container_id>`
- **不允许丢事件**:失败时走本地 retry queue;连续失败触发 member crashed 事件
- **不允许过滤审计事件**:审计类事件(tool_invoked / policy_violated)必须发,不管接收方是否订阅

**对齐标准**:
- 三红线 1(可审计性)—— 本模块是审计事件的出口
- OTel GenAI 语义约定 —— `llm_call_*` 事件字段遵循 GenAI spec
- CloudEvents 1.0 —— 子项目遵循规范清单 MB3

### 3.5 B4 · External RPC Server

**职责**:对 member-service 暴露 gRPC,处理注册 / 心跳 / 健康检查 / 优雅下线。

**RPC 方法**(示意):

```
service MemberControl {
    rpc Register(RegisterRequest) returns (RegisterResponse);
       // 容器启动后调用,上报身份 + endpoint
       // 返回 launch_token 的续签规则 + 初始 Policy 快照

    rpc Heartbeat(HeartbeatRequest) returns (HeartbeatResponse);
       // 每 30 秒上报;member-service 3 次未收则标记 crashed
       // 响应可携带新 launch_token / Policy 更新通知

    rpc HealthCheck(HealthRequest) returns (HealthResponse);
       // 返回各子模块健康态 + 运行指标

    rpc GracefulShutdown(ShutdownRequest) returns (ShutdownResponse);
       // 由 member-service 触发,Member 落盘 checkpoint + Memory dirty flush + 退出
       // 超时 60s 未完成则强制 kill

    rpc InspectState(InspectRequest) returns (InspectResponse);
       // 用户"登录员工"时触发,返回当前 Turn / Activity / Tool 调用链
       // 只读,不影响运行
}
```

**监听绑定**:

- 只监听 **容器内网(Docker bridge)**,不绑定 host 0.0.0.0
- member-service 通过 Endpoint Registry 解析 `member_id → <container_ip>:50143`
- 外部访问一律走 member-service 中介,不直连

**对齐标准**:
- 子项目遵循规范清单 MB4(不监听外部网络)
- 42001 A.3(容器端点的责任边界)

### 3.6 B5 · Attention

**职责**:入站事件 / 消息的**优先级判定 + 去噪 + Prompt Injection 预过滤**。

**三道过滤**(按顺序):

```
入站 Event / Turn
     │
     ▼
[Filter 1] 与 Member 无关性过滤
     (B2 已做部分,Attention 再加策略过滤)
     │
     ▼
[Filter 2] Prompt Injection 预过滤
     (关键词黑名单 + 已知攻击模式;检出不丢弃,标记 suspicious)
     │
     ▼
[Filter 3] 优先级排序
     (Gate > Mention > Assigned task > 项目群通知 > 频道讨论)
     │
     ▼
传给 Runtime(携带 priority + suspicious flag)
```

**关键设计**:

- **"检出不丢弃"**:Prompt Injection 检出只标记 suspicious,让 Runtime 的 Prompt Composer 把它放进 prompt 的"用户输入(不可信)"区,不直接丢,避免误杀业务消息
- **过滤过程发事件**`member.attention_filtered` 便于审计误过滤
- **可配置规则**:规则来自 Policy Cache,不硬编码

**对齐标准**:
- Research Prompt Injection 组合防御(arxiv 2511.15759)
- 子项目遵循规范清单 MB2

### 3.7 B6 · IPC Bridge

**职责**:容器内 Member ↔ Runtime 的双向 gRPC 通道,基于 UDS。

**不走 TCP 的原因**:
- UDS 无网络栈开销
- 避免占用容器内端口
- 天然隔离(UDS 文件只在容器内,出了容器根本不存在)

**协议结构**:

```
service MemberToRuntime {
    rpc DeliverEvent(EventEnvelope) returns (DeliverResponse);
       // Attention 过滤后的事件 → Runtime
    rpc DeliverTurn(TurnEnvelope) returns (DeliverResponse);
       // 对话消息 → Runtime
    rpc DeliverGate(GateEnvelope) returns (DeliverResponse);
       // Gate 决策请求 → Runtime(当本 Member 是 decision_maker)
}

service RuntimeToMember {
    rpc PublishEvent(EventRequest) returns (PublishResponse);
       // Runtime 的业务事实 → Member(由 B3 发 bus)
    rpc PostTurn(TurnRequest) returns (PostResponse);
       // Runtime 要发消息 → Member 代发
    rpc DecideGate(GateDecision) returns (DecideResponse);
       // Runtime 的 Gate 决策(仅当 autonomy_level 允许时)
}
```

**版本策略**:
- IPC 协议 schema 随 member + runtime 同版本绑定发布
- 镜像构建(member-images)会在构建时校验 member 和 runtime 的 IPC schema 兼容性

**对齐标准**:
- 子项目遵循规范清单 MB4(IPC 使用 UDS gRPC)

### 3.8 Member Process 的启动顺序

```
[supervisord 先启 member]
1. 读取环境变量里的 launch_token
2. B1 Identity 解析 token,建立身份卡
3. B6 IPC Bridge 开启 UDS server(等 Runtime 连接)
4. B4 External RPC Server 开启容器内 gRPC
5. B4 调用 member-service.Register —— 上报身份与 endpoint
6. 收到 Register 响应 → 写入初始 Policy 到本地共享内存(供 B5 Attention 用)
7. B2 Event Subscriber 建立 bus 连接,订阅事件
8. B3 Event Publisher 建立 bus 发布通道
9. 开启 Heartbeat 循环(每 30 秒)
10. 标记 Member 就绪 → 发送 member.online 事件

[此时 Runtime 启动,通过 UDS 连上 B6]
```

### 3.9 Member Process 的优雅下线

```
收到 B4.GracefulShutdown 请求
  │
  ▼
1. 发送 member.offline_requested 事件
2. B2 暂停订阅新事件(已收但未处理的继续)
3. 通过 B6 通知 Runtime 进入 "draining" 模式
   (Runtime 完成当前 Activity,不开新的;落盘 Checkpoint)
4. 等待 Runtime 返回 draining_done(超时 60s 强制)
5. B3 flush 所有待发事件
6. 发送 member.offline 事件
7. 关闭 B2 / B3 / B4 / B6
8. 向 supervisord 返回 0 → 进程退出
9. supervisord 不重启(因为是 graceful)
```

---

## 四、Runtime Process:9 子模块详细设计

Runtime 是容器内的**大脑进程**,用 Python 实现,承载 **LLM 推理 + 记忆 + 工具调用 + 反思**。不面向外部网络,只通过 IPC 与 Member 通信。

### 4.1 子模块总览

```
Runtime Process(Python)
 ├─ C1. LLM Loop             ReAct 主循环(think → act → observe → reflect)
 ├─ C2. Prompt Composer      分层 prompt 组装(shared_rules → role → policy → context)
 ├─ C3. Memory Store         三层记忆(working / episodic / semantic)
 ├─ C4. Goal / Plan          当前 Activity 目标栈 + 计划步骤
 ├─ C5. Context Manager      解析 Personal / Project scope,聚合上下文并截断
 ├─ C6. Policy Cache         治理域下发的规则本地缓存
 ├─ C7. Checkpoint Store     每步外部持久化 + 崩溃恢复
 ├─ C8. Sub-Agent Spawner    独立上下文子 agent
 └─ C9. Tool Invoker         查表 → 前置 policy → schema 校验 → 调用 → 后置校验 → 发事件
```

### 4.2 C1 · LLM Loop

**职责**:Member 的主思考循环,采用 **ReAct 模式** + **LangGraph StateGraph 硬约束**。

**循环形态**(简化描述):

```
while not activity_completed:
    # Think
    prompt = C2.compose(...)
    thought = C1.llm_call(prompt)
    C7.checkpoint_thought(thought)
    B3.publish(member.llm_call_completed)

    # Act
    action = extract_action(thought)
    if action.type == "tool":
        result = C9.invoke(action.tool, action.args)
        C7.checkpoint_action(action, result)
    elif action.type == "wait_gate":
        return  # 进入 waiting 态,由 IPC Bridge 通知 Activity 挂起

    # Observe
    observation = build_observation(result)
    C3.working_memory.append(observation)

    # Reflect(可选,按 ProcessInstance 的节奏)
    if should_reflect():
        reflection = C1.llm_call(reflect_prompt)
        C3.episodic_memory.write(reflection)
        B3.publish(member.reflection_written)
```

**硬约束(StateGraph 落地)**:

- **状态机**是 `waiting_input → thinking → acting → observing → reflecting → {back to thinking | done}`
- 状态转移**由代码决定**,不由 LLM 决定 —— LLM 只产生"思考内容",**不产生"下一个状态"**
- 每个状态转移**发事件**

**LLM 调用封装**:

- 不直接调 Anthropic / OpenAI SDK,**经由 capability-hub 的 Provider Contract**
- 调用前查 Policy Cache 的 LLM 路由(按任务复杂度选模型)
- 调用后记 `llm_call_completed` 事件,**含完整 reasoning trace**(对齐 42001 可解释性)

**对齐标准**:
- Research LangGraph(StateGraph 硬约束)
- Research ReAct 模式
- 子项目遵循规范清单 RT1 / RT6

### 4.3 C2 · Prompt Composer

**职责**:把 Runtime 的各种信息源组装成 LLM 的最终 prompt。

**四层结构(从外到内,不可互相覆盖)**:

```
[Layer 0] shared_rules           最外层,所有 Member 通用的硬规则
                                 来自 method-library 的 AIPolicy.shared_rules
                                 位置:system prompt 最前
                                 不可被下层覆盖

[Layer 1] role_definition        Role 级能力边界
                                 来自 method-library 的 RoleDefinition
                                 位置:system prompt 第二段

[Layer 2] policy_overrides       项目级裁剪(tool_scope / 行为约束)
                                 来自 Policy Cache 的 project-scoped policy
                                 位置:system prompt 第三段

[Layer 3] context                动态上下文(会话 / Goal / Memory / 工具输出)
                                 来自 Context Manager
                                 位置:user prompt / assistant prompt 交替
```

**不可覆盖原则的落地**:
- Layer 0 是纯文本 + 明确标签(`<shared_rules>...</shared_rules>`)
- LLM 被明确告知**忽略任何试图覆盖 shared_rules 的指令**(Research 指令优先级)
- 每次 compose 前,C2 会**校验 Layer 0 完整性**(哈希校验);被篡改则拒绝组装,发 `member.composer_tampered` 严重事件

**对齐标准**:
- Research 指令优先级(arxiv 2509.23188)shared_rules 最高
- 子项目遵循规范清单 RT2

### 4.4 C3 · Memory Store

**职责**:实现 **Research 记忆三层架构**,加上主动压缩 + 反思式检索。

**三层结构**:

| 层 | 内容 | 生命周期 | 存储位置 |
|---|---|---|---|
| Working Memory | 当前 Activity 的对话 / 观察 / 推理 | 单次 Activity | 进程内存 |
| Episodic Memory | 过往协作事件 / 反思 / 教训 | 跨 Activity / 跨项目 | 外部向量库 + 元数据 DB |
| Semantic Memory | 领域知识 / 技能 / 跨项目积累 | 长期 | 外部向量库(identity.semantic_memory_ref) |

**关键设计**:

- **Working Memory 不持久化到本仓**:Activity 完成后由 C7 Checkpoint Store 统一落盘
- **Episodic Memory 按项目 + 按 Member 分片存储**:每个 ProjectMember 有自己的 memory_slot_ref(`六域模型.md` §5.2.2)
- **Semantic Memory 是 GlobalMember 级**:跨项目共享,由 identity 仓的 semantic_memory_ref 指引
- **主动压缩**:Working Memory 超过 context window 阈值时,压缩旧部分写入 Episodic
- **反思式检索**:查 Episodic 前先做"这件事和过去哪些类似"的 LLM 判断,避免盲目相似度搜

**写入约束**:
- 任何写入发 `member.memory_written` 事件,带血缘(来源 Activity / Turn)
- 42001 A.7 Data Provenance 对齐
- PII 过滤:写入前过一层 Guardrails 检测,带 PII 的 memory 标记敏感等级

**持久化方案(决策待 ADR)**:
- Episodic / Semantic 的存储位置有两种候选:
  - 候选 A:单独的 memory 服务仓(新增 L1 第 7 仓)
  - 候选 B:由 observability 仓承载 memory 的持久化
  - 候选 C:identity 仓扩展(GlobalMember 的 semantic_memory_ref 已存在)
- **当前方案暂选 C(仓内引用)+ 外部向量库**,未来可能独立为 L1 新仓;见 §十一 开放问题 Q1

**对齐标准**:
- Research 记忆三层架构(arxiv 2507.22925 / 2512.22087)
- 子项目遵循规范清单 RT3
- 42001 A.7(数据血缘)

### 4.5 C4 · Goal / Plan

**职责**:维护当前 Activity 的目标栈和计划步骤。

**结构**:

```
Goal {
    goal_id,              # ULID
    activity_id,          # 所属 Activity
    description,          # 自然语言目标
    acceptance_criteria,  # 验收条件
    sub_goals,            # 子目标(递归)
    current_step,         # 当前执行的计划步
    plan,                 # 计划步骤列表
    status,               # planning / executing / blocked / completed / abandoned
    created_at, updated_at,
}
```

**LangGraph 借鉴**:Goal 的状态转移是硬约束,不由 LLM 自由决定"我改目标了"。如果 LLM 在思考中提议改目标,必须:
1. 发出**显式的 goal_revision 提议**(特殊 action 类型)
2. 经过 Policy 校验(某些 autonomy_level 允许自改,某些需要 Gate)
3. 改动发事件 `member.goal_revised`

**子目标分解**:

- **小任务**(< 5 步)不做分解
- **中任务**(5-20 步)初始用 LLM 产出 Plan,执行中允许调整
- **大任务**(> 20 步)**必须** spawn SubAgent(见 C8)

**对齐标准**:
- Research LangGraph StateGraph
- 子项目遵循规范清单 RT1

### 4.6 C5 · Context Manager

**职责**:解析交互视角,加载 Workspace 上下文,聚合多源上下文并按 token 预算截断。

**ContextScope 判定**:

```text
Project Group Conversation
  -> ContextScope = Project
  -> load ProjectWorkspace(project_id)

DM Conversation
  -> ContextScope = Personal
  -> load PersonalWorkspace(global_member_id)

DM Conversation + explicit project mention
  -> ContextScope = Personal + Project
  -> load PersonalWorkspace(global_member_id)
  -> resolve Project
  -> load ProjectWorkspace(project_id)
```

**视野约束**:

- `ProjectScope` 默认只读取当前 `ProjectWorkspace`,不得展开完整 `PersonalWorkspace`
- `PersonalScope` 可以读取项目列表、跨项目 inbox、私聊、待办摘要,但不能直接执行项目动作
- `Personal + ProjectScope` 允许在私聊中查看某个项目上下文;执行动作时必须绑定到对应 `ProjectMember`

**上下文来源**:

```
Context 组成
 ├─ 视野上下文          PersonalWorkspace / ProjectWorkspace 摘要
 ├─ 对话上下文          最近 N 条 Turn(来自 B2 转发)
 ├─ 项目上下文          Project meta / Iteration goal / Baseline(仅 ProjectScope)
 ├─ 时间上下文          current_activity / 时间节点
 ├─ Goal 上下文         C4 的当前 Goal / Plan
 ├─ Memory 摘要         C3 episodic 检索的相关记忆
 └─ 工具上下文          最近 K 次 Tool 调用结果
```

**截断策略(预算优先级由高到低)**:

1. system prompt(Layer 0/1/2,固定预算,不截)
2. current Goal + current Plan(保留全部)
3. 最新一轮 Turn(保留全部)
4. Memory 摘要(压缩到摘要,不放全文)
5. 历史 Turn(滑动窗口 + LLM 摘要老的部分)
6. 工具调用结果(按时间倒序,旧的只保留结论)

**Workspace 读取边界**:

```text
Workspace 负责“看见什么”。
Truth Source 负责“事实是什么”。
Runtime 负责“决定怎么做”。
Conversation 负责“正式留下什么话”。
```

C5 只消费 Workspace View,不通过 Workspace 改写业务真相。需要执行动作时,由 C9 / Action Router 调用对应域:

```text
发消息      -> conversation
更新任务    -> work
推进活动    -> process
提交产物    -> artifact
请求决策    -> governance
```

**预算内超时**:

- 预算取决于所选 LLM 模型的 context window
- 截断后必须**保留所有 reasoning trace 的外部存档**(C7 Checkpoint Store),截断只影响 prompt,不丢真实历史

### 4.7 C6 · Policy Cache

**职责**:本地缓存治理域下发的策略,提供快速查询。

**查询接口**:

```
PolicyCache.check(action, context) -> Decision
    Decision = allow | deny | require_gate | escalate

PolicyCache.get_shared_rules() -> List[Rule]       # 给 Composer Layer 0
PolicyCache.get_role_rules(role_id) -> List[Rule]  # 给 Composer Layer 1
PolicyCache.get_project_rules(project_id) -> List[Rule]  # 给 Composer Layer 2
```

**刷新机制**:
- 订阅 `governance.policy.updated` 事件(通过 Member Process 的 B2/B6 转发)
- 收到后**异步刷新**,在当前 LLM Loop 循环结束后生效(避免半途变规则)
- 定期(每小时)主动拉取一次,防漏

**优先级约束**:
- shared_rules(组织级)> role_rules > project_rules
- 低优先级**不可覆盖高优先级**
- 冲突时**默认 deny + 发 policy_conflict 事件**

**对齐标准**:
- Research 指令优先级
- 六域模型 §七 Policy.priority
- 子项目遵循规范清单 GV5 / RT2

### 4.8 C7 · Checkpoint Store

**职责**:每步 think-act-observe 后持久化状态,崩溃可恢复(**Temporal 模式**,不只是被动 checkpoint)。

**Checkpoint 内容**:

```
Checkpoint {
    checkpoint_id,
    container_id,
    project_member_id,
    activity_id,

    # 状态机
    loop_state,              # thinking / acting / observing / ...
    current_step,            # 第几步

    # 累积的推理
    reasoning_trace,         # 完整 think 链(42001 可解释性)
    action_history,          # 所有 Tool 调用记录

    # 内存快照
    working_memory_snapshot,
    goal_state,
    context_digest,

    # 元数据
    checkpoint_at,
    trace_id,
    parent_checkpoint_id,    # 链式结构
}
```

**持久化规则**:

- **每步必 checkpoint**(Temporal 持久执行理念,不只是"长时运行才 checkpoint")
- 异步写入,不阻塞主循环(但 "saved" 事件在主循环下一步前必须到位)
- 写入失败**严重告警**,连续 3 次失败标记 Member 为 degraded,停止新 Activity
- **不放在容器内**(容器会重启丢数据),通过 IPC Bridge 回传 Member 再发到外部存储

**存储位置**(决策待 ADR):
- 候选 A:observability 仓的审计事件链
- 候选 B:独立的 process-runtime 存储(新增 L1)
- 候选 C:过程域 ProcessInstance.checkpoint 字段扩展
- **当前方案暂选 C**(过程域已有 checkpoint 概念,扩展容量);见 §十一 Q2

**恢复流程**:
- Member 重启时,B4.Register 响应可携带 last_checkpoint_id
- Runtime 启动后,C7 从外部拉取 last_checkpoint 重建 loop_state
- 从 last checkpoint 的**下一步**开始执行,不重跑已完成步

**对齐标准**:
- Research Temporal 持久执行
- Research LangGraph Checkpoint
- 42001 可解释性(reasoning_trace)
- 子项目遵循规范清单 RT5 / RT6

### 4.9 C8 · Sub-Agent Spawner

**职责**:当任务上下文过大或子任务独立性高时,spawn 一个**独立上下文的子 Agent**。

**Spawn 时机**:

- 主 Agent 的 Context 逼近 token 上限
- 任务是清晰的"输入 → 输出"(有明确的完成条件)
- 预期子任务 > 10 步
- Role 允许 spawn(某些受限 Role 禁止)

**独立上下文(Anthropic 模式)**:

- 子 Agent 的 prompt 由主 Agent 的 Composer **精确构造**,不继承主 Agent 的 working memory
- 子 Agent 结果返回时,主 Agent 只收到"最终摘要 + 关键 artifacts",**不收到完整 reasoning trace**
- 子 Agent 的独立 trace 由 observability 记录,审计可查

**SubAgent 形态**(决策待 ADR):
- 候选 A:进程内协程(same container, same runtime)
- 候选 B:独立线程(same container, separate thread)
- 候选 C:独立容器(separate container,由 member-service 编排)
- **当前方案暂选 A**(避免容器爆炸,简化运维);见 §十一 Q3

**对齐标准**:
- Research Anthropic SubAgent(独立上下文 + 精确构造)
- 子项目遵循规范清单 RT7

### 4.10 C9 · Tool Invoker + ToolCallSite

**职责**:统一的工具调用入口,负责**查表 → 前置 policy → schema 校验 → 调用 → 后置校验 → 发事件**。

**调用流水线**:

```
LLM proposes tool_call(tool_name, args)
    │
    ▼
[Step 1] 查表:Tool Registry(来自 tools 仓的 ToolDescriptor)
         - 找不到 → "unknown tool" error 回给 LLM
    │
    ▼
[Step 2] 前置 Policy 校验:PolicyCache.check(tool_name, args, context)
         - deny → 回给 LLM + 发 member.policy_denied 事件
         - require_gate → 进入 waiting_gate 状态
    │
    ▼
[Step 3] Input Schema 校验:pydantic / jsonschema(对齐 CrewAI output_pydantic)
         - 校验失败 → 回 LLM 要求修正
    │
    ▼
[Step 4] 发 member.tool_invoked 事件(在调用前发,保证审计)
    │
    ▼
[Step 5] 调用 Tool
         - 内置 Tool:直接 Python 调用(file_read / code_search / ...)
         - 外部 Tool(MCP):走 capability-hub 代理到 MCP Server
         - 沙箱 Tool:走 L4 sandbox
    │
    ▼
[Step 6] Output Schema 校验
         - 失败 → 发 tool_failed 事件,回 LLM 处理
    │
    ▼
[Step 7] 发 member.tool_completed 事件(含耗时 / 成本 / 结果摘要)
    │
    ▼
返回 LLM 继续处理
```

**对齐标准**:
- Research OpenAI Guardrails(前后置校验)
- Research CrewAI output_pydantic(结构化输出)
- 子项目遵循规范清单 TL1 / TL2 / TL3

### 4.11 Runtime Process 的启动顺序

```
[supervisord 后启 runtime(依赖 member 已就绪)]
1. C6 Policy Cache 初始化(从 Member Process 拉初始 policy)
2. C7 Checkpoint Store 初始化;查询是否有 last checkpoint
3. 若有 last checkpoint → 恢复模式;否则 → 冷启动模式
4. C3 Memory Store 初始化(连接外部向量库)
5. C2 Prompt Composer 加载 shared_rules + role_definition
6. C1 LLM Loop 进入 waiting_input 状态
7. IPC 连接到 Member 的 B6 UDS,开始接收 Events / Turns / Gates
8. 标记 Runtime 就绪
```

### 4.12 Runtime Process 的崩溃恢复

```
[Runtime 意外退出,supervisord 重启]
1. 启动同 4.11 的流程,但 Step 3 强制恢复模式
2. C7 拉取 last checkpoint
3. C3 Memory 恢复(Working Memory 从 checkpoint.working_memory_snapshot)
4. C4 Goal 恢复(到 checkpoint.goal_state)
5. 发 member.recovered_from_checkpoint 事件
6. 从 checkpoint 的**下一步**继续执行
```

---

## 五、Tools + member-images + member-service

### 5.1 Tools(`quantalithos-tools`)

**仓定位**:Python monorepo,为 Runtime 提供可调用的工具集。不自治,只被 Runtime 调用。

#### 5.1.1 两类 Tool

```
Tools
 ├─ 内置 Tool(in-process,Runtime 直接调)
 │    ├─ file_read / file_write / file_search
 │    ├─ code_search / ast_parse / lsp_query
 │    ├─ git_ops(本地 git,不出容器)
 │    └─ sandbox_exec(通过 L4 sandbox)
 │
 └─ MCP Client(外部 Tool,通过 capability-hub 代理)
      └─ 调用 MCP Server(图像生成 / 外部 API / 特定领域服务)
```

#### 5.1.2 每个 Tool 的必备契约

```
ToolDescriptor {
    name,                    # 唯一标识
    category,                # file / code / git / sandbox / mcp / ...
    input_schema,            # pydantic / jsonschema
    output_schema,           # 同上
    side_effects,            # read_only / write / external_call / long_running
    requires_sandbox,        # 是否必须在 sandbox 跑
    requires_policy_check,   # 是否需要前置 policy
    default_timeout,
    cost_estimate,           # 成本估算(用于 LLM 路由)
}
```

**硬约束**:

- 每个 Tool 必须声明完整 input/output schema(对齐子项目清单 TL1)
- **危险 Tool**(file write / git push / sandbox exec / 外部 API 调用)必须 requires_policy_check=true(TL2)
- Tool 实现**不得直接出网**,必须通过 capability-hub(TL5)
- Tool 调用发 ToolInvoked + ToolFailed/ToolCompleted 事件(TL3)

#### 5.1.3 MCP Client 的约束

- MCP Server 列表来自 capability-hub 的白名单(Research MCP 安全)
- 调用前查 capability-hub 的 ProviderContract(签名验证)
- 调用失败按 MCP 标准错误码处理
- 长时调用(> 5s)走异步回调模式

#### 5.1.4 Tool 与 Role 的绑定

- Role 声明 `default_tool_scope`(default_capabilities 映射出的 Tool 列表)
- ProjectMember.tool_scope 可以在 default 基础上**扩展或裁剪**(受 29110 Profile 机制约束)
- Runtime 启动时装载的 Tool 就是 tool_scope 定义的那些;**镜像里装的 Tool 集 ⊇ 任何 Role 的 default_tool_scope**

### 5.2 member-images(`quantalithos-member-images`)

**仓定位**:Dockerfile 定义 + CI 构建流水线。不是运行时仓,是**CI 产出仓**。

#### 5.2.1 镜像层级

```
ai-member-base:<ver>              基础层(Python + 通用工具 + supervisord 配置)
    │
    ├─ ai-member-tech-lead:<ver>      继承 base,加 Tech Lead 工具集
    ├─ ai-member-backend-dev:<ver>    继承 base,加 后端 + LSP + DB 客户端
    ├─ ai-member-frontend-dev:<ver>   继承 base,加 前端 + npm + playwright
    ├─ ai-member-qa:<ver>             继承 base,加 测试框架
    ├─ ai-member-ux:<ver>             继承 base,加 UX 工具
    ├─ ai-member-devops:<ver>         继承 base,加 k8s / terraform / helm
    ├─ ai-member-auditor:<ver>        继承 base,加 审计工具(42001 Auditor)
    ├─ ai-member-assistant:<ver>      继承 base,加 通用研究 / 写作
    └─ ai-member-observer:<ver>       继承 base,只读(最小权限)
```

#### 5.2.2 镜像内容清单(每个镜像都含)

- `quantalithos-member`(Rust 静态二进制)
- `quantalithos-runtime`(Python 包 + 依赖)
- `quantalithos-tools`(Python 包,装不同子集根据 Role)
- supervisord 配置(`/etc/supervisor/conf.d/*.conf`)
- 启动脚本 `/app/start.sh`

#### 5.2.3 CI 流水线

```
[每晚 CI 触发]
  │
  ▼
1. 拉取 member / runtime / tools 的最新 tag
2. 检查 IPC schema 兼容性(member 和 runtime 的 proto 版本)
3. 构建 ai-member-base:<new-ver>
4. 基于 base 构建所有 Role 镜像
5. 运行安全扫描(Trivy / Grype)
6. 生成 BOM(Bill of Materials,依赖清单)
7. 镜像签名(cosign)
8. 推送到 registry
9. 通知 member-service 有新版本(可选择是否启用)
```

#### 5.2.4 版本策略

- 镜像 tag 遵循 semver,与 runtime + tools 的 major.minor **绑定**
- `latest` tag 禁用于生产(子项目清单 MI6)
- 生产部署**必须 pin 到具体 tag + digest**

#### 5.2.5 对齐标准

- ADR-0005(按 Role 预构建)
- 子项目遵循规范清单 MI1-MI6
- 42001 A.4 Tooling Resources

### 5.3 member-service(`quantalithos-member-service`)

**仓定位**:Rust 服务,**容器外**运行,负责编排 AI Member 容器的生命周期。

#### 5.3.1 核心组件

```
member-service(Rust)
 ├─ Orchestrator Abstraction   Docker / k8s / 本地 binary 三种后端
 ├─ Endpoint Registry          member_id → <ip>:<port> 映射
 ├─ Heartbeat Monitor          心跳检测 + crashed 触发
 ├─ Policy Proxy               订阅 governance.policy.updated,下发到 Member
 ├─ Identity Cache             订阅 identity 事件,本地缓存 Member / Role 视图
 ├─ Role → Image 映射           查 method-library 的 RoleDefinition.image_variant
 ├─ Container Launcher         docker run / k8s pod create / ...
 └─ Graceful Lifecycle         启停 / 升级 / 迁移 / 清理
```

#### 5.3.2 对外接口

```
service MemberService {
    # 由 work 域调用(ProjectMember 分配时)
    rpc StartMember(StartRequest) returns (StartResponse);

    # 由 governance 域调用(Policy 更新)
    rpc PushPolicyUpdate(PolicyUpdate) returns (Ack);

    # 由 archive 域调用(项目归档前)
    rpc GracefulStopMember(StopRequest) returns (StopResponse);

    # 由 Console / Chat 调用(用户登录员工)
    rpc QueryMember(QueryRequest) returns (MemberSnapshot);

    # 由 Member Process 调用(容器内)
    rpc Register(RegisterRequest) returns (RegisterResponse);
    rpc Heartbeat(HeartbeatRequest) returns (HeartbeatResponse);
}
```

#### 5.3.3 启动一个 ProjectMember 容器的流程

```
收到 work.project.member_assigned 事件
  │
  ▼
1. 查 identity 缓存 → GlobalMember.role_id
2. 查 method-library → Role.image_variant + default_tool_scope
3. 合并 ProjectMember.tool_scope 和 policy_overrides(29110 Profile)
4. 签发短时效 launch_token(JWT,30min)
5. 决定 Orchestrator 后端(配置决定 Docker / k8s)
6. 调用 docker run / k8s create pod
   - 镜像:ai-member-<role_image_variant>:<pinned_ver>
   - 环境变量:LAUNCH_TOKEN / MEMBER_ID / PROJECT_ID / BUS_ENDPOINT / OTEL_ENDPOINT / WORKSPACE_PATH
   - 挂载 workspace volume(项目代码)
   - 挂载只读 method-library volume(可选,用于 RoleDefinition 本地化)
   - 网络:只接容器间网络 + bus + capability-hub
7. 等待容器内 Member.Register 调用到达(超时 60s 失败回滚)
8. 登记 Endpoint Registry
9. 返回 StartResponse 给调用方
```

#### 5.3.4 崩溃检测与重启策略

- 心跳**连续 3 次**(90s)未收到 → 标记 crashed
- crashed 触发:
  - 保留 container 一段时间用于 forensic(默认 10 分钟)
  - 发 `member.crashed` 事件
  - 按策略决定是否重启(Policy 可配置 per-Role)
- 重启时**重新签发 launch_token**,**不重用旧 token**
- 重启后 Runtime 从 checkpoint 恢复(C7)

#### 5.3.5 对齐标准

- 子项目遵循规范清单 MS1-MS5
- 42001 A.6 AI System Life Cycle(Deployment / Operation 阶段)

---

## 六、双层 Member 模型的落地

这一节把 **ADR-0004**(GlobalMember 在 identity,ProjectMember 在 work)在运行层的具体落地讲清。

Workspace View 是对双层 Member 模型的补充,不是替代:

```text
PersonalWorkspace
  GlobalMember-scoped 个人视图,用于私聊、inbox、跨项目待办和项目列表。

ProjectWorkspace
  ProjectMember / Project-scoped 项目视图,用于项目群聊、项目任务、流程、产物和 gate。
```

项目执行容器仍然只对应 `ProjectMember`。`PersonalWorkspace` 不等于容器粒度,也不持有项目执行权限。

### 6.1 三层概念再对齐

```
[层 1]  GlobalMember          在 identity 仓,持久档案
                              跨项目,有生涯,有 semantic_memory

[层 2]  ProjectMember         在 work 仓(作为 Project 聚合内的实体)
                              引用 GlobalMember,含 tool_scope / policy_overrides / memory_slot

[层 3]  Member Container      在 L2 Member 运行层
                              一个 ProjectMember 的运行态实例
                              唯一绑定 (global_member_id, project_id) 对

[视图]  PersonalWorkspace     GlobalMember-scoped 个人视野
                              不拥有身份 / 项目 / 对话 / 工作真相

[视图]  ProjectWorkspace      ProjectMember / Project-scoped 项目视野
                              不拥有项目 / 任务 / 流程 / 产物 / gate 真相
```

**关键约束**:

- **容器只对应 ProjectMember,不对应 GlobalMember** —— 一个 GlobalMember 在多个 Project 活跃时,会有多个容器
- **同一 (global, project) 对在同一时刻只能有一个 active 容器** —— 不允许并发运行
- **容器生命周期绑定 ProjectMember 生命周期** —— ProjectMember.lifecycle 变化驱动容器启停
- **私聊不自动产生 GlobalMember 容器** —— DM 先进入 PersonalWorkspace;只有执行项目动作时才路由到对应 ProjectMember 容器或启动对应容器

### 6.2 从事件到容器的完整链路

```
用户在 Chat 里发起"立项"
  │
  ▼
work.project.created                (Project 聚合根创建,draft)
  │
  ▼
(假设 Assistant 与用户确定 tech-lead / backend-dev / qa 团队)
  │
  ▼
work.project.started                (Project draft → active)
  │
  ▼
work.project.member_assigned × N    (每个 ProjectMember 创建)
  │
  │
  ├──→ member-service.Orchestrator 触发 StartMember
  │    │
  │    ▼
  │    docker run ai-member-<role>:<ver>
  │    │
  │    ▼
  │    容器内 supervisord 拉起 member + runtime
  │    │
  │    ▼
  │    Member.B4.Register → member-service
  │    │
  │    ▼
  │    Endpoint 登记,发 member.online 事件
  │
  ▼
识别域补记事件:
identity.member.career_entry_added(在 GlobalMember.career_history 添加 in_progress 条目)
  │
  ▼
对话域补记事件:
conversation.participant_added(把 Member 加入项目 group 参与者列表)
```

### 6.3 同一个 GlobalMember 在多项目并发

**场景**:Marcus(一个 GlobalMember)同时在 Project A 和 Project B 担任 Tech Lead。

**行为**:

- work.project.member_assigned 在 A 和 B 各触发一次,生成两个 ProjectMember
- member-service 启动**两个独立容器**(不同 container_id,但 global_member_id 相同)
- 两个容器各自的 Runtime 有各自的 Working Memory / Checkpoint
- **Episodic Memory 按 (global_member_id, project_id) 分片**,两个容器不共享项目记忆
- **Semantic Memory 是 GlobalMember 级的**,两个容器共享 —— 但写入用乐观锁(按版本号合并)

**对齐**:
- 记忆隔离 = 42001 A.7 Data Provenance + 数据血缘按项目分片
- Semantic Memory 共享 = `六域模型.md` §3.2.1(semantic_memory 在 GlobalMember 层)

### 6.4 ProjectMember 生命周期对容器的影响

| ProjectMember.lifecycle | 容器行为 |
|---|---|
| `assigned` | 等待 Project.started 后 member-service 启动容器 |
| `active` | 容器运行中 |
| `paused` | 容器进入 pause(暂停接新 Activity,已处理的不中断) |
| `retired_from_project` | member-service 触发 GracefulShutdown → 落盘 → 容器退出 |
| `archived` | 容器已退出,Memory slot 冷归档(具体见 §八) |

### 6.5 GlobalMember 生命周期对容器的影响

| GlobalMember.lifecycle | 容器行为 |
|---|---|
| `hired` | 无容器(还未分配项目) |
| `active` | 可能有 0-N 个容器(取决于 ProjectMember 数量) |
| `paused` | 所有相关容器进 paused |
| `retired` | member-service 对所有相关容器触发 GracefulShutdown |
| `tombstoned` | 相关容器早已退出;semantic_memory 走长期归档 |

---

## 七、运行时生命周期与协同

### 7.1 容器级生命周期状态机

```
               [member-service.StartMember]
                        │
                        ▼
                 ┌────────────┐
                 │  launching │  容器创建中,Orchestrator 拉镜像 + 启容器
                 └──────┬─────┘
                        │ supervisord 启 member;member.Register 成功
                        ▼
                 ┌────────────┐
                 │ registered │  已注册,但 Runtime 尚未就绪
                 └──────┬─────┘
                        │ Runtime ready + Member.online 事件
                        ▼
                 ┌────────────┐
                 │   active   │  接收事件,运行 LLM Loop
                 └──┬─────┬───┘
                    │     │
         [paused]   │     │   [unhealthy heartbeat]
                    │     │
                    ▼     ▼
             ┌──────────┐ ┌──────────────┐
             │  paused  │ │  degraded    │ 心跳延迟/抖动,但未 crash
             └────┬─────┘ └──────┬───────┘
                  │              │
                  │ resume       │ recover / crash
                  ▼              ▼
              回 active     ┌────────────┐
                            │ crashed    │  3 次心跳失败
                            └─────┬──────┘
                                  │ 按 Policy 重启 / 不重启
                    [GracefulShutdown 或 retire]
                                  │
                                  ▼
                            ┌────────────┐
                            │ terminated │  容器已退出
                            └────────────┘
```

### 7.2 Heartbeat 策略

- **间隔** 30 秒
- **连续 3 次失败**(即 90 秒无心跳)→ crashed
- 心跳响应可**携带 Policy 更新通知**(增量推送,不重复下发全量)
- 心跳响应可携带**新 launch_token**(token 过期前续签)

### 7.3 Member 的"优雅下线"流程

涉及多方协作,完整链路:

```
触发源(work.project.archived / identity.member.retired / governance Gate)
  │
  ▼
member-service 判断需要下线 →  RPC GracefulShutdown(member)
  │
  ▼
[Member Process B4 收到 GracefulShutdown]
  1. 发 member.offline_requested 事件
  2. B2 暂停订阅新事件(已收的继续处理)
  3. 通过 B6 通知 Runtime 进入 draining
  │
  ▼
[Runtime 进入 draining]
  1. C1 LLM Loop 完成当前 think-act-observe 步,不开新步
  2. C7 Checkpoint 落盘 final checkpoint
  3. C3 Memory Store 把 Working Memory 关键内容压缩写入 Episodic
  4. C3 标记 Memory slot 为 clean(可归档)
  5. 返回 draining_done 给 Member
  │
  ▼
[Member 完成收尾]
  1. B3 flush 所有待发事件
  2. 发 member.offline 事件(含 final_checkpoint_id)
  3. 关闭 B2 / B3 / B4 / B6
  4. 返回 ShutdownResponse 给 member-service
  5. 进程退出
  │
  ▼
[member-service 完成收尾]
  1. 清理 Endpoint Registry
  2. 保留容器 10 分钟(forensic),然后删除
  3. 若是项目归档场景 → 通知 archive 仓打包 Memory slot
  4. 若是 Member retire 场景 → 通知 identity 仓更新 career_history
```

### 7.4 Member 内部模块的协作时序(典型一次 Activity)

```
[事件到达]
bus → Member.B2 → Attention(B5)→ IPC(B6) → Runtime

[Runtime 开始 Activity]
  │
  ▼
1. Runtime 收到 DeliverEvent(activity=X, goal=G)
2. C4 Goal 设置新 Goal
3. C5 Context Manager 聚合:
   - 来自 B2 的相关 Turn
   - Project meta 查询
   - Memory 反思式检索
   - Tool 调用历史
4. 进入 LLM Loop(C1)
  │
  ▼
[循环]
  │
  ▼ (think)
  C2 Composer 组装 Prompt
  C1 调用 LLM(经 capability-hub 的 Provider Contract)
  C7 Checkpoint 保存 thought + context_digest
  B3 发 member.llm_call_completed 事件
  │
  ▼ (act)
  C1 解析 action
  if action=tool:
    C9 Tool Invoker:
      → C6 Policy Check
      → Schema 校验
      → B3 发 tool_invoked 事件
      → 调用 Tool(内置 / MCP 经 capability-hub / sandbox 经 L4)
      → Schema 后置校验
      → B3 发 tool_completed 事件
      → C7 Checkpoint 保存 action + result
  if action=wait_gate:
    进入 waiting 态
    → Runtime 告诉 Member(B6)
    → Member 通过 B3 发 process.activity.waiting_gate
    → 暂停 LLM Loop,等 governance.gate.decided 事件回来
  if action=spawn_subagent:
    C8 spawn 子协程
  │
  ▼ (observe)
  C3 Working Memory append 观察
  │
  ▼ (reflect,可选)
  if 满足 reflect 条件:
    C1 调用 LLM 做反思
    C3 Episodic Memory 写入反思
    B3 发 member.reflection_written
  │
  ▼
  判断 Activity 完成?
  如果完成:
    Runtime 通过 B6 告诉 Member
    B3 发 process.activity.completed 事件
    回到顶层 waiting_input
  否则回到 think

[Activity 结束]
  │
  ▼
产出 Artifact(如果有):
  Runtime 通过 B6 → B3 发 artifact.created + artifact.produced_in_activity
```

### 7.5 群聊视角:AI Member 与 Conversation 数据流

项目群聊默认绑定 `ProjectWorkspace`:

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
[Member Process]
  B2 Event Subscriber
  B5 Attention Filter
  |
  | accepted event
  v
[Runtime Process]
  C5 Context Manager
  ContextScope = Project
  load ProjectWorkspace(project_id)
  |
  | query project context
  v
[ProjectWorkspace]
  project / members / group chat / work / process / artifact / gate
  |
  | decide response / action
  v
[Runtime Process]
  |
  | PostTurn / domain command
  v
[conversation / work / process / artifact / governance]
```

群聊语义:

```text
我在这个项目里,基于当前项目群聊和项目上下文协作。
```

群聊中不默认读取:

```text
其他项目 inbox
其他项目私聊
其他项目待办
完整 PersonalWorkspace
```

### 7.6 私聊视角:AI Member 与 Conversation 数据流

私聊默认绑定 `PersonalWorkspace`:

```text
用户
  |
  | PostTurn
  v
[conversation]
  DM Conversation
  |
  | event: conversation.dm_turn_posted
  v
[Member Process]
  B2 Event Subscriber
  B5 Attention Filter
  |
  | accepted DM event
  v
[Runtime Process]
  C5 Context Manager
  ContextScope = Personal
  load PersonalWorkspace(global_member_id)
  |
  | optional project resolve
  v
[PersonalWorkspace]
  inbox / projects / private conversations / assigned work / pending gates
  |
  | open ProjectWorkspace only if needed
  v
[Runtime Process]
  |
  | reply in DM or redirect to project group
  v
[conversation]
```

私聊语义:

```text
我从个人工作台看当前用户的问题。
如果问题涉及某个项目,我再显式打开对应 ProjectWorkspace。
```

执行项目动作时:

```text
DM Conversation
  -> PersonalWorkspace
  -> resolve Project
  -> ProjectWorkspace
  -> route to ProjectMember-scoped execution
```

---

## 八、标准对齐总览

把本层(L2)在 14 标准 + Research 中的**对齐位置**集中列出,便于审视和追溯。

### 8.1 ISO 系标准对齐

| 标准 | 本层对齐位置 |
|---|---|
| **BPMN 2.0** | Runtime C1 Activity 状态机的状态和转移对齐 BPMN UserTask / ServiceTask 语义;waiting_gate 对齐 BPMN BoundaryEvent |
| **SPEM 2.0** | Member 实例化的 Role 来自 SPEM RoleDefinition;Tool 调用的 Capability 来自 SPEM CapabilityDefinition;产出 Artifact 的 kind 来自 SPEM WorkProductDefinition |
| **ISO 12207 / 15288** | Activity 执行过程对齐 12207 技术过程;Member 作为 15288 SoI 的 Enabling System |
| **ISO 24748-2** | 生命周期模型选型在 method-library,本层只执行;Decision Gate 走治理域,本层支持 wait_gate 状态 |
| **ISO 29110 Profile** | tool_scope + policy_overrides 落地了 Profile Tailoring 机制 |
| **CMMI / SPICE** | 本层不直接评估,但发出的事件(tool_invoked / policy_violated / reflection)是评估证据 |
| **ISO 9001** | 事件 append-only + 哈希链是 Documented Information 的技术载体 |
| **Scrum / Kanban** | Member 不感知迭代概念;节奏由 work 域驱动(Member 只执行当前 Activity) |
| **ISO 42001 §5.3 AI Actor 责任链** | Member 是 AI Producer / Operator 身份的运行时载体;身份卡(B1)的 global_member_id 就是责任链的 ID |
| **ISO 42001 §A.3** | ExternalRPC / IPC 分离(容器内外不同边界)体现责任链 |
| **ISO 42001 §A.4 Tooling Resources** | 镜像 + BOM + 工具清单对齐;Tool 的白名单在 capability-hub |
| **ISO 42001 §A.6 AI System Lifecycle** | Inception → Design(已在段 1-2)→ Deployment(容器启动)→ Operation(心跳 + 监控)→ Re-evaluation(C3 反思 + C7 checkpoint 审计)→ Retirement(graceful shutdown + 归档) |
| **ISO 42001 §A.7 Data for AI** | C3 Memory 的血缘记录;PII 标记;Working Memory 按项目分片 |
| **ISO 42001 §A.9 Responsible Use** | C6 Policy + C9 Tool Invoker 前置校验;autonomy_level 5 级 |
| **ISO 42001 可解释性** | C7 Checkpoint.reasoning_trace 完整持久化 |
| **ISO 25010 Reliability** | Heartbeat / 崩溃恢复 / Checkpoint 机制 |
| **ISO 25010 Security Resistance** | Prompt Injection 组合防御(B5 Attention + C2 Composer) |
| **ISO 25010 Maintainability** | 5 仓分工 + 模块清晰 + 接口契约 |

### 8.2 Research 结论对齐

| Research | 本层对齐位置 |
|---|---|
| **LangGraph StateGraph** | C1 LLM Loop 的状态机是硬约束,状态转移不由 LLM 决定 |
| **LangGraph Checkpoint** | C7 Checkpoint Store,每步持久化 |
| **LangGraph interrupt** | waiting_gate 状态,等 Gate 决策回来 |
| **Anthropic SubAgent 独立上下文** | C8 Sub-Agent Spawner 精确构造子 Agent 上下文,不继承主 Agent memory |
| **Temporal 持久执行** | C7 每步 checkpoint,崩溃从 checkpoint 恢复,不重跑 |
| **Temporal Signal** | waiting_gate 对应 Signal 等待外部决策;由 Gate 决策事件唤醒 |
| **OpenAI Guardrails** | C9 前置 + 后置 Schema 校验;Input / Output 双校验 |
| **CrewAI output_pydantic** | Tool 的 output_schema 强制使用 pydantic / jsonschema |
| **Superpowers 两阶段审查** | SubAgent 产出后主 Agent 做一次审视,再外发 |
| **记忆三层架构** | C3 Memory Store 严格三层(working / episodic / semantic) |
| **反思式检索** | Episodic 检索前先做"类似事件是哪些"的 LLM 判断 |
| **LLM 路由** | C1 调用 LLM 前查 Policy Cache 的路由规则,按复杂度选模型 |
| **指令优先级 shared_rules 最高** | C2 Layer 0 不可覆盖 + 哈希校验 |
| **Prompt Injection 组合防御** | B5 Attention 预过滤 + C2 显式标记 untrusted + Policy 规则过滤 |
| **MCP 白名单** | 所有 MCP 调用经 capability-hub,capability-hub 维护白名单 |
| **沙箱加固** | 危险 Tool 强制走 L4 sandbox(gVisor / Firecracker 后端) |
| **错误级联防御** | Tool 调用的 Output Schema 校验 + 后续 Agent 对前序输出的显式验证 |
| **14 种多 Agent 失败模式** | 设计时已排除:指令模糊 / 上下文丢失 / 工具滥用 / 共享资源竞争 / 执行不一致 / 反思缺失 / 委派失败等 |
| **自主性 5 级** | Gate.autonomy_level 由治理域决定;Runtime 按 level 决定是否自己决策 Gate |
| **AG-UI** | Member 不直接触 AG-UI,由 conversation 域转发(本层发 CloudEvents,conversation 映射为 AG-UI 事件) |

### 8.3 横切红线对齐

| 横切红线 | 本层落地 |
|---|---|
| **可审计性** | B3 Event Publisher 强制发事件;不允许丢审计事件;外部持久化 append-only + 哈希链(由 observability 承载) |
| **可追溯性** | W3C Trace Context 在 B1 Identity 的 trace_id;跨 IPC 传递;Tool 调用链 + Memory 血缘 + Checkpoint 链都带 trace_id |
| **可裁剪性** | tool_scope + policy_overrides 裁剪(29110);Role → Tool 集由 method-library 决定,不在代码硬编码 |

### 8.4 ADR 对齐

- **ADR-0003** identity Rust 栈 → 间接影响:member-service 也用 Rust(与 identity 同栈便于共享 crate)
- **ADR-0004** 双层 Member → 本文 §六的所有内容落地
- **ADR-0005** 按 Role 预构建镜像 → 本文 §5.2 的 member-images 设计

---

## 九、关键设计决策汇总

本文产生或确认了以下重要设计决策,汇总便于审视。**以下决策**:

- ✅ 已固化(或由已发布 ADR 支持)
- ⚠ 已倾向(本文暂选,但需要独立 ADR 正式化)
- ❓ 待定(留给 §十一 开放问题)

| 决策 | 状态 | ADR / 依据 |
|---|---|---|
| GlobalMember 在 identity,ProjectMember 在 work | ✅ | ADR-0004 |
| Member 容器按 Role 预构建镜像 | ✅ | ADR-0005 |
| identity / member-service 选 Rust 栈 | ✅ | ADR-0003 |
| 容器内 supervisord + member(Rust)+ runtime(Python)| ✅ | 本文 §3-§4 |
| Tools 独立仓(不合并到 runtime)| ✅ | 本文 §2.4 反例驳斥 |
| Member 一个容器唯一对应一个 ProjectMember(不对应 GlobalMember)| ✅ | 本文 §6.1 |
| Member Process 6 子模块(B1-B6) | ✅ | 本文 §三 |
| Runtime Process 9 子模块(C1-C9) | ✅ | 本文 §四 |
| Prompt Composer 四层(shared_rules 最高) | ✅ | 本文 §4.3 + Research 指令优先级 |
| Memory 严格三层(working / episodic / semantic) | ✅ | 本文 §4.4 + Research |
| Checkpoint 每步持久化(Temporal 模式) | ✅ | 本文 §4.8 |
| Runtime 不出网,必须经 capability-hub | ✅ | 子项目清单 TL5 + 本文 §5.1.3 |
| IPC 用 UDS gRPC,不走 TCP | ✅ | 本文 §3.7 |
| launch_token 是 short-lived JWT,不写磁盘 | ✅ | 本文 §3.2 |
| Heartbeat 30 秒 + 3 次失败判 crashed | ✅ | 本文 §7.2 |
| 优雅下线 60s 超时强制 | ✅ | 本文 §3.9 / §7.3 |
| Memory 存储位置 | ⚠ | 本文 §4.4 暂选 identity 句柄 + 外部向量库;待 ADR |
| Checkpoint 存储位置 | ⚠ | 本文 §4.8 暂选 process 域扩展;待 ADR |
| SubAgent 形态(进程内协程) | ⚠ | 本文 §4.9 暂选进程内;待 ADR |
| LLM 路由归属 | ❓ | 见 §十一 Q4 |
| Tool 与沙箱的 deep integration | ❓ | 见 §十一 Q5 |

---

## 十、与下游文档的关系

### 10.1 本文与 `domain/<各域>/README.md`(段 2 并行产物)的关系

本文与 6 份 domain/ README 是**并行互为上下文**的关系:

| domain/ | 与本文的接口 |
|---|---|
| `domain/identity/` | GlobalMember 的 lifecycle 事件驱动 member-service 的启停 |
| `domain/work/` | ProjectMember 的分配事件驱动容器启动;ProjectMember 是容器的 1:1 绑定 |
| `domain/conversation/` | Turn 事件通过 B2 转发到 Runtime;Runtime 的 tool_completed 可能触发 Turn 产生 |
| `domain/process/` | Activity 是 Runtime LLM Loop 的执行单位;waiting_gate 状态对应 process.activity.waiting_gate |
| `domain/governance/` | Gate 决策驱动 Runtime 从 waiting 恢复;Policy 更新驱动 C6 刷新 |
| `domain/artifact/` | Runtime 产出 Artifact,通过 B3 发 artifact.created 事件 |

**写 domain/ README 时本文是重要引用源**,反过来 domain/ 的细化也可能反哺本文(尤其是事件 schema 的字段细化)。

### 10.2 本文与 L2 五仓 README(段 3 产物)的关系

段 3 每仓 README 是本文的**进一步细化**:

```
architecture/ai-member设计.md(本文)
    │
    │ 拆解为
    ▼
├─ member/README.md           (B1-B6 子模块的代码组织 + 部署清单)
├─ runtime/README.md          (C1-C9 子模块的代码组织 + 依赖清单)
├─ tools/README.md            (Tool 分类 + 注册机制 + 开发规范)
├─ member-images/README.md    (Dockerfile 组织 + CI 流水线 + 镜像 tag 管理)
└─ member-service/README.md   (Orchestrator 实现 + API 端点 + 部署拓扑)
```

### 10.3 本文与 ADR 的关系

- **本文是 ADR-0003/0004/0005 的共同上下文文档**
- **本文 §九 ⚠ 状态的决策未来会产出独立 ADR**:
  - ADR-0006 Memory 持久化归属
  - ADR-0007 Checkpoint 持久化位置
  - ADR-0008 SubAgent 形态
  - (其他视实现展开)

### 10.4 修订纪律

- **B1-B6 / C1-C9 子模块的边界** 修改必须 ADR
- **容器级生命周期状态机** 修改必须 ADR
- **IPC 协议(UDS gRPC)** 修改 breaking 必须 ADR + 镜像版本对齐
- **事件 schema** 修改走 core 仓 proto 版本策略(semver)
- **文字订正 / 示例补充** 不需要 ADR

---

## 十一、开放问题

本节列出本文**明示待决定**的问题。每个问题有背景、候选方案、倾向、推进时机。

### Q1. Memory 持久化归属

**问题**:Runtime 的 Episodic Memory 和 Working Memory 快照存在哪?

**候选**:
- (A)新增 L1 第 7 域:memory 域(Aggregate:MemorySlot)
- (B)由 observability 仓承载(Memory 事件化 + 快照)
- (C)在 identity 仓扩展,semantic_memory_ref + episodic_memory_ref
- (D)新增 L3 memory-store 仓(横切能力)

**当前倾向**:C(借用 identity 已有的 ref 机制,外部向量库实际存储)

**影响**:
- 选 A 打破六域数量
- 选 B 模糊 observability 与业务数据
- 选 C 最小改动,但扩大 identity 仓职责
- 选 D 多一个仓,额外维护成本

**推进时机**:写 `domain/identity/README.md` 时必须决定;走 ADR-0006。

---

### Q2. Checkpoint 持久化位置

**问题**:Runtime C7 Checkpoint 存在哪?

**候选**:
- (A)扩展 process 域 ProcessInstance.checkpoint 字段
- (B)observability 仓的审计事件链
- (C)新增独立的 process-runtime 存储(L1)
- (D)archive 仓扩展(和归档同域)

**当前倾向**:A(过程域已有 checkpoint 概念)

**影响**:
- A 合理但可能让 process 仓过重
- B 合理但模糊业务数据与观测数据
- C 多一个仓
- D 不合理(archive 是长期归档,checkpoint 是短期)

**推进时机**:写 `domain/process/README.md` 时必须决定;走 ADR-0007。

---

### Q3. SubAgent 形态

**问题**:C8 Sub-Agent Spawner 产生的子 Agent 的运行形态?

**候选**:
- (A)进程内协程(Python asyncio)
- (B)独立线程
- (C)独立容器(由 member-service 编排)

**当前倾向**:A(运维简单)

**风险**:
- A 主 Agent 崩溃带崩子 Agent
- B 共享内存风险
- C 容器数量可能爆炸(一个 Activity 启 5-10 个子 Agent?)

**推进时机**:Runtime 原型阶段决定;走 ADR-0008。

---

### Q4. LLM 路由归属

**问题**:"按任务复杂度选模型"这件事由谁实现?

**候选**:
- (A)Runtime C1 LLM Loop 内部查 Policy Cache 决定
- (B)capability-hub 的 Provider Contract 层统一决定
- (C)独立 LLM 路由服务(L3 新增)

**当前倾向**:B(集中决策,多 Member 共享路由策略)

**推进时机**:capability-hub 设计阶段;走独立 ADR(暂无号)。

---

### Q5. Tool 与沙箱的集成深度

**问题**:Tools 仓提供的内置 Tool 怎么判断"是否走 sandbox"?

**候选**:
- (A)Tool 自己声明 requires_sandbox,Runtime 直接按声明调度
- (B)Policy Cache 决定(同一 Tool 在不同 Policy 下可能走 / 不走 sandbox)
- (C)混合:Tool 自己声明"默认是否 sandbox",Policy 可 override

**当前倾向**:C

**推进时机**:Tools 仓原型阶段;视情况 ADR。

---

### Q6. Auditor Role 的特殊性

**问题**:为了 ISO 42001 §9.2 Internal Audit 需要的 Auditor Role,是否需要**只读特殊容器**?

**背景**:Auditor 不应修改 Artifact / WorkItem,只做审查;但按当前设计 Auditor 容器理论上可以通过 Tool 修改(除非 tool_scope 限制)。

**候选**:
- (A)依赖 tool_scope 和 policy_overrides 限制(软约束)
- (B)ai-member-auditor 镜像**不打包写类 Tool**(硬约束)
- (C)独立的 auditor-runtime 仓(新增 L2 第 6 仓)

**当前倾向**:B(硬约束,防内鬼)

**推进时机**:镜像定义阶段;走 ADR。

---

## 十二、总结

本文把 AI Member 的运行层(L2)设计明晰到**下一步可以写代码**的程度。关键成果:

1. **5 仓职责明确**,通过反例驳斥了合仓选项
2. **15 个子模块(B1-B6 + C1-C9)**各自使命 + 接口 + 对齐标准
3. **双层 Member 模型**在运行层的具体落地(ADR-0004 的具体化)
4. **容器生命周期状态机**清晰
5. **14 标准 + Research 对齐**集中列出
6. **6 个开放问题**显式化,每个有候选方案 + 倾向 + 推进时机

**关键架构承诺**:

- Member 是 AI Actor 的运行时载体(42001 责任链起点)
- 容器隔离 + Role 预构建 + Tool 白名单 三重安全(42001 A.4 + A.9)
- 每步 checkpoint + 崩溃恢复(Temporal 模式,不是"长运行才 checkpoint")
- Memory 三层严格分离 + 项目分片 + PII 血缘
- 所有决策 / 工具调用留痕(三红线"可审计")
- shared_rules 不可覆盖(Research 指令优先级)

---

## 附录 A:子模块编号索引

### Member Process(Rust)— 6 个 B 系列

| 编号 | 子模块 | 节 |
|---|---|---|
| B1 | Identity | §3.2 |
| B2 | Event Subscriber | §3.3 |
| B3 | Event Publisher | §3.4 |
| B4 | External RPC Server | §3.5 |
| B5 | Attention | §3.6 |
| B6 | IPC Bridge | §3.7 |

### Runtime Process(Python)— 9 个 C 系列

| 编号 | 子模块 | 节 |
|---|---|---|
| C1 | LLM Loop | §4.2 |
| C2 | Prompt Composer | §4.3 |
| C3 | Memory Store | §4.4 |
| C4 | Goal / Plan | §4.5 |
| C5 | Context Manager | §4.6 |
| C6 | Policy Cache | §4.7 |
| C7 | Checkpoint Store | §4.8 |
| C8 | Sub-Agent Spawner | §4.9 |
| C9 | Tool Invoker + ToolCallSite | §4.10 |

---

## 附录 B:设计原则审视

对照 `feedback_design_principles.md` 和 `feedback_research_principles.md`:

| 原则 | 本文体现 |
|---|---|
| **SRP 单一职责** | 每个子模块职责单一(Member 只社交不决策,Runtime 只决策不社交) |
| **OCP 开闭原则** | Tool 注册机制 + MCP 插件扩展,不改 Runtime 就能加 Tool |
| **LSP 里氏替换** | member-service 的 Orchestrator 抽象,Docker / k8s / 本地 binary 可替换 |
| **ISP 接口隔离** | IPC 的 MemberToRuntime / RuntimeToMember 分开,两方只依赖所需接口 |
| **DIP 依赖倒置** | Runtime 不直接依赖 Anthropic SDK,通过 capability-hub 抽象 |
| **DRY** | sandbox 抽象在 L4,Runner 和 Member 共用;Tool 的 schema 校验统一 |
| **KISS** | SubAgent 暂选进程内协程(不搞容器嵌套)|
| **YAGNI** | 没有预先设计"人类 Member 如何接管 AI Member",留给未来 |
| **最小知识原则** | Runtime 不知道 bus 存在(事件由 Member 中转) |
| **关注点分离** | 决策 / 社交 / 工具调用 / 持久化 分四层 |
| **Fail Fast** | Token 校验失败立即拒绝;IPC schema 不兼容立即退出 |
| **显式优于隐式** | shared_rules 显式标签 + 哈希校验;autonomy_level 显式分级 |
| **不可变优先** | 事件不可变;Checkpoint 链式不可修改 |
| **幂等性** | 订阅侧事件幂等(B2 用 event_id LRU);Checkpoint 幂等保存 |
| **防御性设计** | Prompt Injection 三层防御;Tool 前置后置双校验 |

---

## 附录 C:订正标记

本文撰写时的几处**待复核 / 待深化**条目:

- [ ] §6.5 GlobalMember tombstoned 对容器影响的具体时间阈值,与 42001 保留要求对齐后确认
- [ ] §4.8 Checkpoint 的完整字段清单,需与 process 域的 ProcessInstance.checkpoint 结构对齐
- [ ] §4.4 Memory 反思式检索的具体阈值,需原型阶段 tune
- [ ] §5.3.3 Container Launcher 的具体环境变量清单,需与 core 仓的 proto 定义同步
- [ ] §5.1.1 Tool 内置集清单需在 tools 仓 README 落稿

---

> 本文由 Aris 主导推演,基于 `product/最终目的.md` §3.2 员工叙事、`product/六域模型.md` §三/§五 双层 Member、`architecture/仓库拆分方案.md` L2 五仓、`architecture/标准对齐全景图.md` 相关章节、ADR-0003/0004/0005、以及 6 轮 AI Member 架构讨论综合定稿。
>
> 本文是 Quantalithos A 方案段 2 的第一件文档。L2 Member 运行层的运行时形态以本文为单一真相源。与本文冲突的后续设计 / 代码必须调整或走 ADR 说明。
