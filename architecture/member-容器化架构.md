# Member 容器化架构设计

> ⚠️ **状态:2026-05-08 定位调整**
>
> 本文成稿于 Phase 2B 阶段,作为当时"Member 容器化"方案的定稿。进入 A 方案后,**本文的核心结论(容器 = 一个 AI 员工、Member/Runtime/Tool 三段)被保留**,但需要按 A 方案重新定位:
>
> - **旧定位**:Phase 2B 及之后的权威架构文档
> - **新定位**:L2 Member 运行层(5 仓)的**原始推演来源**,核心隐喻("容器 = 一个人")仍然成立
> - **权威承接**:`architecture/仓库拆分方案.md`(A 方案 L2 五仓)+ `architecture/ai-member设计.md`(待写,系统化沉淀本文 + 本轮 6 轮讨论)
>
> **本文内容与 A 方案的几个关键差异**(读本文时请注意):
> 1. **单层 Member** → 已升级为**双层 Member**(GlobalMember 在 identity / ProjectMember 在 work),见 ADR-0004
> 2. **Member 容器 key 是 member_id** → 已修正为 ProjectMember 级容器,key 是 `<global_member_id>:<project_id>`
> 3. **Phase 2B/2C/3 分期** → 已废弃,见 `architecture/开发路线图与优先级.md` 的 N0-N9 节点
> 4. **"project-store"、"flow"、"tool-gateway" 术语** → 按 A 方案重新映射为 work/process/capability-hub
> 5. **历史引用(单runtime单agent落地设计.md 等)** → 已迁入 `architecture/legacy/`
>
> 本文保留作为 L2 设计的主要推演来源。等 `architecture/ai-member设计.md` 写成后,本文转为历史参考。

---

## 一、核心目标与设计理念

### 1.1 产品目标

Quantalithos AI 的产品叙事是 **"AI 团队像人一样协作"**：
- 用户通过聊天委派 AI 团队完成软件项目
- AI 员工有稳定身份、明确分工、专业技能
- 用户随时可观察、介入、接管、审批

这份架构文档的使命是：**让系统的技术实现对齐这份产品叙事**。

### 1.2 核心隐喻："容器 = 一个人"

```
  现实中一个人                    AI Member
  ──────────                      ─────────
  嘴 / 耳 / 社交名片          →   Member 进程
  大脑 / 决策 / 执行循环       →   Runtime 进程
  手 / 专业技能                →   Tool 组件
  
  身体（把所有部分承载起来）    →   Docker Container
```

一个 AI Member 就是一个独立的 Docker 容器：
- 容器有独立的身份（label + env）
- 容器内有对外代言的 Member 进程
- 容器内有做决策的 Runtime 进程
- 容器内按 role 装载不同的 Tool 技能

### 1.3 与其他服务的关系

```
外部服务对 Member 的视角：
  • member-service  管理所有 Member 容器的生命周期
  • conversation    给 Member 投递消息、接收 Member 发出的消息
  • flow            指定"给哪个 member_id 派什么任务"
  • tool-gateway    高副作用动作的统一治理出口（Phase 3+）
  • project-store   事实源，存放项目/任务/产物/审计

Member 内部是黑盒：
  外部只认 member_id，不关心内部如何分工
```

### 1.4 已锁定决策（Q1/Q2/Q3）

| # | 决策 | 选项 | 说明 |
|---|------|------|------|
| Q1 | 节奏 | **跳过 Phase 2 gRPC，直接做 Phase 2B** | 避免短命代码 |
| Q2 | 旧实现 | **直接切换，不保留** | git tag 保留 Phase 1 历史 |
| Q3 | 验收范围 | **中范围：3 个 Member 协作完成一个迭代** | 覆盖最小协作闭环 |

### 1.5 显式不做（范围外）

```
协作能力：
  ✗ 用户接管 AI Member（assume_control）  → Phase 3
  ✗ A2A 协议跨组织 Agent                   → Phase 3+
  ✗ 群组（AgentGroup）                     → Phase 3

Tool 能力：
  ✗ Browser / Test / LSP / Figma Skill    → Phase 2C+
  ✗ tool-gateway 独立服务                  → Phase 3

架构能力：
  ✗ Conversation 独立服务                 → Phase 2C
  ✗ 状态持久化 checkpoint                  → Phase 3
  ✗ Knowledge Base / RAG                  → Phase 3
  ✗ k8s 部署                              → Phase 3+
  ✗ Reflection / Learning                 → Phase 3+

运维能力：
  ✗ 完整 OpenTelemetry                    → Phase 2C
  ✗ 多租户                                → Phase 3+
  ✗ 水平扩展 flow + Leader Election       → Phase 3+
```

---

## 二、概念模型

### 2.1 核心实体

```
Member（协作身份）
  ─────────────────
  统一抽象，Human 和 AI 都是 Member
  稳定的业务身份（member_id）
  属性：role / profile / status / capability
  Human Member：关联 user_account
  AI Member   ：关联一个运行中的容器

Container（AI Member 的身体）
  ─────────────────
  Docker 容器，per-role image
  内部有 Member 进程 + Runtime 进程 + Tool 组件
  生命周期：create / pause / resume / destroy
  唯一标识：container_id + member_id

Member Process（门面 / 嘴耳）
  ─────────────────
  容器内唯一对外暴露端口的进程
  职责：对外通信、身份托管、输入筛选、内部路由
  不决策、不执行

Runtime Process（大脑）
  ─────────────────
  容器内的决策进程
  职责：LLM 循环、Memory、Goal/Plan、Context、Tool 调用
  通过 IPC 与 Member 通信

Tool（手 / 技能）
  ─────────────────
  被 Runtime 调用的能力组件
  按 role 装载（backend 装 code+git，qa 装 browser+test）
  低风险 tool：本地直接执行
  高风险 tool：经 tool-gateway 审计审批（Phase 3）
```

### 2.2 Member 内部的 3 实体 + 内联属性

```
之前讨论过的 12 内核，最终收敛为 3 实体 + 内联：

3 个独立实体：
  ① Member                     独立进程
  ② Runtime                    独立进程
  ③ Tool                       按需加载的能力组件

Member 进程内联：
  - Identity（身份卡）          Member 的字段
  - Attention（注意力过滤）     Member 的方法

Runtime 进程内联：
  - Memory（记忆）              Runtime 的子模块
  - Goal/Plan（目标栈）         Runtime 的子模块
  - Context（情境）             Runtime 的子模块
  - Constraints Check（规则校验）Runtime 的 inline 校验

跨实体共享：
  - Shared Rules（约束库）      在 core 里，所有实体可读
```

### 2.3 生命周期术语

```
Member 生命周期（业务身份）
  ─────────────────
  created   — Member 已注册身份，未启动容器
  active    — 容器运行中（status: ready/busy/paused）
  archived  — 不再活跃，容器已销毁，身份保留供审计

Container 生命周期（运行载体）
  ─────────────────
  starting       — docker run 已发起，容器正在启动
  ready          — 已 Register，可接受任务
  busy           — 正在处理任务
  paused         — 被 member-service 暂停（assume_control 用，Phase 3）
  shutting_down  — 收到 Shutdown，等 grace 期
  exited         — 容器已退出
  crashed        — 异常退出，等待重启策略决定
```

---

## 三、整体架构

### 3.1 系统全貌

```
╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
║                    Quantalithos AI 目标态架构（Member 容器化）                                   ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════╝


┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    前端层                                                      │
│     chat (web/desktop/mobile)                              console (管理后台)                   │
└────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                         │ HTTP / WebSocket
                                         ▼
                                ┌─────────────────┐
                                │      gate       │  鉴权 / 路由 / WS 聚合
                                └────────┬────────┘
                                         │
      ┌────────────────────┬─────────────┼────────────────┬─────────────────────┐
      ▼                    ▼             ▼                ▼                     ▼
┌──────────────┐  ┌────────────────────────┐  ┌──────────┐  ┌──────────────┐  ┌────────────┐
│ conversation │  │   member-service       │  │   flow   │  │project-store │  │tool-gateway│
│              │  │                        │  │          │  │              │  │  (Phase 3) │
│ (Phase 2C    │  │ ┌────────────────────┐ │  │ BPMN     │  │  (= platform)│  │            │
│  独立,现合   │  │ │ Identity Store     │ │  │ Engine   │  │              │  │            │
│  在 platform)│  │ │ (member 元数据)    │ │  │          │  │  (真相源)    │  │            │
│              │  │ └────────────────────┘ │  │ Member   │  │              │  │            │
│              │  │ ┌────────────────────┐ │  │ Assign   │  │              │  │            │
│              │  │ │ContainerOrchestrator│ │  │ Gate     │  │              │  │            │
│              │  │ │ ├─ 抽象 IF          │ │  │ Routing  │  │              │  │            │
│              │  │ │ ├─ Docker (P2B)     │ │  │          │  │              │  │            │
│              │  │ │ └─ k8s   (P3+)      │ │  │          │  │              │  │            │
│              │  │ └────────────────────┘ │  │          │  │              │  │            │
│              │  │ ┌────────────────────┐ │  │          │  │              │  │            │
│              │  │ │ Endpoint Registry  │ │  │          │  │              │  │            │
│              │  │ │ member_id →        │ │  │          │  │              │  │            │
│              │  │ │  container_endpoint│ │  │          │  │              │  │            │
│              │  │ └────────────────────┘ │  │          │  │              │  │            │
│              │  │ ┌────────────────────┐ │  │          │  │              │  │            │
│              │  │ │ Heartbeat Monitor  │ │  │          │  │              │  │            │
│              │  │ │ + Restart Policy   │ │  │          │  │              │  │            │
│              │  │ └────────────────────┘ │  │          │  │              │  │            │
└──────────────┘  └────────────┬───────────┘  └────┬─────┘  └──────┬───────┘  └────────────┘
                               │ Docker API         │               ▲
                               │                    │               │
                               ▼                    │               │
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │                       quantalithos-internal 网络                                │
  │           (所有 AI Member 容器 + 核心服务都接入此 Docker 网络)                    │
  └──────────────────────────────────────────────────────────────────────────────┘
                               │
      ┌────────────────────────┼────────────────────┬───────────────────────┐
      ▼                        ▼                    ▼                       │
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
  │  Container:  │    │  Container:  │    │  Container:  │                  │
  │  tech_lead   │    │  backend_dev │    │  qa_lead     │                  │
  │              │    │              │    │              │                  │
  │ image: TL    │    │ image: Dev   │    │ image: QA    │                  │
  │ cpu=2 mem=2G │    │ cpu=2 mem=4G │    │ cpu=1 mem=2G │                  │
  │              │    │              │    │              │                  │
  │ (详见 §3.2)  │    │              │    │              │                  │
  └──────────────┘    └──────────────┘    └──────────────┘                  │
                                                                            │
                                            对 conversation / tool-gateway  │
                                            主动出站连接                     │
                                            ────────────────────────────────┘
```

### 3.2 单个 Member 容器内部结构

```
┌────────────────────────────────────────────────────────────────────────────────┐
│   Container: ai-member-backend_dev                                              │
│                                                                                 │
│   image:  quantalithos/ai-member-backend:v1.0                                   │
│   labels: quantalithos.member_id=backend_dev                                    │
│           quantalithos.role=backend                                             │
│           quantalithos.version=v1.0                                             │
│   env:    MEMBER_ID / LAUNCH_TOKEN / MEMBER_SVC / CONV_SVC / TOOLGW             │
│           TRACE_PARENT (W3C trace context)                                      │
│   ports:  50143/tcp (仅对 member-service 暴露)                                   │
│   cgroup: cpu=2 memory=4G pids=200                                              │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │  PID 1: supervisord                                                     │  │
│   │                                                                         │  │
│   │  • 读 /etc/supervisord.conf                                             │  │
│   │  • 按依赖顺序拉起：member → runtime                                      │  │
│   │  • 子进程崩溃按策略重启（主进程异常时反向退出容器）                       │  │
│   │  • 收 SIGTERM 时优雅停止所有子进程                                       │  │
│   └───┬─────────────────────────────────────────────────────────────────────┘  │
│       │                                                                         │
│       │    supervisord 管理以下两个主进程（+ 可选辅助进程）                       │
│       │                                                                         │
│   ════╪═══════════════════════ 对外社交层 ════════════════════════════════      │
│       ▼                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │  Member Process  (嘴耳 / 门面)                       entrypoint: member  │  │
│   │                                                                         │  │
│   │   对外 RPC Server (gRPC, :50143)                                        │  │
│   │    • Register (启动时主动调 member-service)                              │  │
│   │    • Heartbeat (streaming → member-service)                             │  │
│   │    • Lifecycle (Shutdown / HealthCheck)                                 │  │
│   │    • DeliverMessage (粗粒度消息入口)                                    │  │
│   │                                                                         │  │
│   │   Outbox Publisher                                                      │  │
│   │    • 向 conversation 发送消息                                           │  │
│   │                                                                         │  │
│   │   Inbox Receiver                                                        │  │
│   │    • 从 conversation 订阅 inbox                                         │  │
│   │                                                                         │  │
│   │   内联属性 (不是独立组件)                                                │  │
│   │    ┌───────────────────┐   ┌────────────────────┐                       │  │
│   │    │ Identity (身份卡) │   │ Attention (注意力) │                       │  │
│   │    │ member_id / role  │   │ 消息过滤 / 优先级  │                       │  │
│   │    │ profile / token   │   │ 打断 / 去噪        │                       │  │
│   │    └───────────────────┘   └────────────────────┘                       │  │
│   │                                                                         │  │
│   │   IPC Bridge (对 Runtime)                                                │  │
│   │    • UDS gRPC Server：/var/run/member/ipc.sock                          │  │
│   │    • 接受 Runtime 的：invoke_tool / report_state / submit_outbox        │  │
│   │    • 向 Runtime 推送：deliver_inbox_msg / lifecycle_directive           │  │
│   └─────────────────────────────┬───────────────────────────────────────────┘  │
│                                 │                                               │
│   ════════════════════════════ 容器内 IPC ══════════════════════════════════    │
│                                 │  Unix Domain Socket (UDS gRPC)                │
│                                 │  /var/run/member/ipc.sock                     │
│                                 │                                               │
│                                 ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │  Runtime Process  (大脑)                              entrypoint: runtime│  │
│   │                                                                         │  │
│   │   LLM Loop (ReAct 模式)                                                 │  │
│   │    • think → act → observe                                              │  │
│   │    • 由 Member 的 inbox 消息驱动                                        │  │
│   │                                                                         │  │
│   │   Prompt Builder                                                        │  │
│   │    • 组装 Identity / Memory / Goal / Context                            │  │
│   │    • 注入 Shared Rules (Constraints)                                    │  │
│   │                                                                         │  │
│   │   子模块 (不是独立组件，runtime 的内部构造)                               │  │
│   │    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐│  │
│   │    │  Memory     │  │  Goal/Plan  │  │  Context    │  │ Constraints  ││  │
│   │    │  Working    │  │  Task Stack │  │  Project    │  │   Check      ││  │
│   │    │  Episodic   │  │  Commit Q   │  │  Conv Ctx   │  │ (inline)     ││  │
│   │    │  Semantic   │  │             │  │  Temporal   │  │              ││  │
│   │    └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘│  │
│   │                                                                         │  │
│   │   Tool Invoker                                                          │  │
│   │    • 按 tool_id 查找容器内 Tool 组件                                     │  │
│   │    • 本地调用 (低风险) / 经 ToolCallSite 审计                            │  │
│   │                                                                         │  │
│   │   IPC Client (对 Member)                                                │  │
│   │    • UDS gRPC Client                                                    │  │
│   │    • 所有外部请求经 Member 转发                                          │  │
│   └─────────────────────────────┬───────────────────────────────────────────┘  │
│                                 │                                               │
│   ════════════════════════════ Tool 调用 ═══════════════════════════════════    │
│                                 │                                               │
│                                 ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────────┐  │
│   │  Tools  (手 / 技能，按 role 装载)                                         │  │
│   │                                                                         │  │
│   │   ┌───────────┐  ┌──────────────┐  ┌───────────────┐                    │  │
│   │   │   code    │  │   git_local  │  │  (按 role 定) │                    │  │
│   │   │           │  │              │  │   browser     │                    │  │
│   │   │ 读写文件  │  │ 本地 git     │  │   test        │                    │  │
│   │   │ 格式化    │  │ commit/diff  │  │   lsp-python  │                    │  │
│   │   │ 简单分析  │  │              │  │   (Phase 2C+) │                    │  │
│   │   └───────────┘  └──────────────┘  └───────────────┘                    │  │
│   │                                                                         │  │
│   │   每个 Tool：                                                            │  │
│   │    • 实现 Tool ABC 接口                                                  │  │
│   │    • 通过 pip extra 按需安装                                             │  │
│   │    • 高副作用 tool 未来走 tool-gateway (Phase 3)                         │  │
│   │                                                                         │  │
│   │   ToolCallSite (封装层)                                                  │  │
│   │    • 打 trace_id / member_id / task_id 标签                              │  │
│   │    • 记审计日志到 project-store                                          │  │
│   │    • Phase 3 引入 policy check                                           │  │
│   └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│   (可选) 辅助进程：otel-collector / log-forwarder / tool 伴生进程                 │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 关键设计决策

| 决策点 | 选择 | 理由 |
|-------|------|------|
| 容器内进程数 | Member + Runtime 两进程 | 职责分离，对外稳定，未来可扩展多 Runtime |
| 进程管理 | supervisord（PID 1） | 成熟稳定，依赖顺序清晰，子进程崩溃可独立重启 |
| 内部 IPC | UDS gRPC | 本地零延迟，复用 protobuf 强类型契约 |
| 镜像组织 | per-role image | 按需装工具，image 小，依赖清晰 |
| 网络 | quantalithos-internal Docker 网络 | DNS 服务发现，容器间白名单访问 |
| 外部暴露 | 仅 :50143 给 member-service | 最小暴露面 |
| 出站 | Member 主动连 conversation/tool-gateway | Member 是唯一外联点，便于审计 |

---

## 四、通信协议

### 4.1 外部协议（gRPC）

所有外部通信走 gRPC，契约定义在 `quantalithos-core/proto/member/` 下。

```proto
// core/proto/member/lifecycle.proto
service MemberLifecycleService {
  // member-service 发起
  rpc Shutdown(ShutdownRequest) returns (ShutdownResponse);
  rpc HealthCheck(HealthCheckRequest) returns (HealthCheckResponse);
  
  // Phase 3 新增
  // rpc Pause(PauseRequest) returns (PauseResponse);
  // rpc Resume(ResumeRequest) returns (ResumeResponse);
}

// core/proto/member/delivery.proto
service MemberDeliveryService {
  // flow / conversation / 其他 Member 发起
  rpc DeliverMessage(DeliverMessageRequest) returns (DeliverMessageResponse);
}

// core/proto/member/register.proto（member-service 实现）
service MemberRegistryService {
  // Member 容器启动时主动调
  rpc Register(RegisterRequest) returns (RegisterResponse);
  rpc Deregister(DeregisterRequest) returns (DeregisterResponse);
  rpc Heartbeat(stream HeartbeatRequest) returns (stream HeartbeatResponse);
}
```

### 4.2 内部 IPC 协议（UDS gRPC）

容器内 Member ↔ Runtime 的通信，契约同样在 core 下（用不同子目录标注）。

```proto
// core/proto/member/ipc.proto
service MemberIpcService {      // Member 实现（被 Runtime 调用）
  rpc SubmitOutbox(SubmitOutboxRequest) returns (SubmitOutboxResponse);
  rpc InvokeTool(InvokeToolRequest) returns (InvokeToolResponse);
  rpc ReportState(ReportStateRequest) returns (ReportStateResponse);
}

service RuntimeIpcService {      // Runtime 实现（被 Member 调用）
  rpc DeliverInboxMessage(DeliverInboxMessageRequest) returns (DeliverInboxMessageResponse);
  rpc ApplyLifecycleDirective(ApplyLifecycleDirectiveRequest) returns (ApplyLifecycleDirectiveResponse);
}
```

### 4.3 Launch Token 握手

防止第三方冒充 Member 向 member-service 注册：

```
1. member-service 调 docker.run 前生成 token = secrets.token_urlsafe(32)
2. 写入 Endpoint Registry 的 pending 槽位
3. 通过 env LAUNCH_TOKEN 注入容器
4. Member 启动后用 token 调 Register
5. member-service 校验 token 一致后接受注册，清空 token
6. 后续通信靠 instance_id + session token（Register 返回）
```

---

## 五、项目组织

### 5.1 Phase 2B 新增项目（5 个）

```
1. quantalithos-member
   ─────────────────────
   类型：Python 库（打进 Docker image）
   定位：Member 进程的实现
   
   目录结构：
     quantalithos-member/
     ├── src/quantalithos_member/
     │   ├── identity.py         # 身份卡
     │   ├── attention.py        # 注意力过滤
     │   ├── grpc_server.py      # 对外 gRPC
     │   ├── register.py         # 注册与心跳
     │   ├── inbox.py            # 从 conversation 收消息
     │   ├── outbox.py           # 往 conversation 发消息
     │   ├── ipc_bridge.py       # 对 Runtime 的 IPC 桥
     │   ├── lifecycle.py        # Shutdown/HealthCheck 处理
     │   └── main.py             # entrypoint
     ├── tests/
     └── pyproject.toml

2. quantalithos-runtime
   ─────────────────────
   类型：Python 库（打进 Docker image）
   定位：Runtime 进程的实现
   ⚠ 与旧 runtime 是不同的项目，旧 runtime 归档
   
   目录结构：
     quantalithos-runtime/
     ├── src/quantalithos_runtime/
     │   ├── loop.py             # LLM Loop (ReAct)
     │   ├── prompt_builder.py   # prompt 组装
     │   ├── memory/             # Memory 子模块
     │   │   ├── working.py
     │   │   ├── episodic.py
     │   │   └── semantic.py
     │   ├── goal.py             # Goal/Plan 栈
     │   ├── context.py          # Context Manager
     │   ├── constraints.py      # Constraints inline 校验
     │   ├── tool_invoker.py     # Tool 调用
     │   ├── tool_call_site.py   # 审计封装
     │   ├── ipc_client.py       # 对 Member 的 IPC 客户端
     │   └── main.py             # entrypoint
     ├── tests/
     └── pyproject.toml

3. quantalithos-tools
   ─────────────────────
   类型：Python mono-repo（多 sub-package）
   定位：所有 Tool 技能的集合
   安装：通过 pip extra 按需
   
   目录结构：
     quantalithos-tools/
     ├── src/quantalithos_tools/
     │   ├── core/               # Tool ABC 抽象
     │   ├── code/               # 代码能力（Phase 2B）
     │   ├── git_local/          # 本地 git（Phase 2B）
     │   ├── browser/            # 浏览器（Phase 2C）
     │   ├── test/               # 测试（Phase 2C）
     │   └── lsp_python/         # Python LSP（Phase 2C）
     ├── tests/
     └── pyproject.toml
     # [project.optional-dependencies]
     # code = [...]
     # git-local = [...]
     # browser = ["playwright>=1.40"]
     # ...

4. quantalithos-member-images
   ─────────────────────
   类型：Dockerfile 仓库
   定位：镜像构建项目
   
   目录结构：
     quantalithos-member-images/
     ├── base/
     │   ├── Dockerfile          # FROM python:3.12-slim
     │   └── supervisord.conf.j2 # Jinja 模板
     ├── tech-lead/
     │   └── Dockerfile          # FROM base + tools[code]
     ├── backend-dev/
     │   └── Dockerfile          # FROM base + tools[code,git-local]
     ├── qa/
     │   └── Dockerfile          # FROM base + tools[browser,test]
     ├── Makefile                # make build-base / build-backend / build-all
     └── ci/                     # CI 脚本（image push registry）

5. quantalithos-member-service
   ─────────────────────
   类型：后端服务（Rust 或 Python）
   定位：Member 身份 + 容器编排服务
   
   目录结构：
     quantalithos-member-service/
     ├── src/
     │   ├── identity_store/     # Member 身份持久化
     │   ├── orchestrator/
     │   │   ├── base.py         # ContainerOrchestrator 抽象
     │   │   ├── docker.py       # DockerOrchestrator 实现
     │   │   └── k8s.py          # KubernetesOrchestrator (Phase 3+)
     │   ├── registry.py         # Endpoint Registry
     │   ├── heartbeat.py        # Heartbeat Monitor
     │   ├── restart_policy.py   # always/never
     │   ├── grpc_server.py
     │   └── main.py
     ├── tests/
     └── pyproject.toml
```

### 5.2 改造项目（3 个）

```
6. quantalithos-core（扩展）
   ─────────────────────
   新增：
     proto/member/lifecycle.proto    # MemberLifecycleService
     proto/member/delivery.proto     # MemberDeliveryService
     proto/member/register.proto     # MemberRegistryService
     proto/member/ipc.proto          # Member↔Runtime IPC
     proto/member/types.proto        # MemberIdentity / RuntimeState 等
     shared_rules/                   # 最小 shared_rules 实现
     python/src/quantalithos_core/member_types.py  # 共享 dataclass

7. quantalithos-platform（职责调整）
   ─────────────────────
   Phase 2B 改动：
     - 保留原名（改名 project-store 留 Phase 2C）
     - audit_log 表扩展，支持 tool call 审计
     - message 表保留（Phase 2C 由 conversation 接管时迁移）
     - 其他业务数据不动

8. quantalithos-flow（简化）
   ─────────────────────
   Phase 2B 改动：
     - 删除所有"管 runtime"的代码（原 Phase 2B 旧设计的 supervisor/launcher）
     - 节点派发改为"通过 member-service 查 endpoint 后调 MemberDeliveryService"
     - BPMN 引擎、Gate、Member Assignment 核心不动
     - FlowClient 改为 MemberClient（gRPC to container）
```

### 5.3 归档项目（1 个）

```
9. quantalithos-runtime (旧)
   ─────────────────────
   操作：
     - README 顶部加"已归档，被 quantalithos-runtime (新版) + quantalithos-member 取代"
     - 主分支打 tag v1.0-phase1-archived
     - 停止接受 PR
     - 代码保留供对照，不再构建
```

### 5.4 Phase 2B 完成后的项目全景

```
8 个 Phase 1 项目：
  core (扩展) / platform (调整) / flow (简化) /
  gate / sandbox / chat / infra /
  runtime (旧) - 归档

5 个 Phase 2B 新增：
  member / runtime (新) / tools / member-images / member-service

总计：12 个活跃项目 + 1 个归档
```

---

## 六、关键时序

### 6.1 Member 容器创建时序（flow 发起）

```
 flow              member-service        DockerOrchestrator      Container
  │                     │                      │                      
  │ ① CreateMember      │                      │                      
  │   (member_id=be,    │                      │                      
  │    role=backend)    │                      │                      
  │ ──────────────────> │                      │                      
  │                     │                      │                      
  │                     │ ② 生成 instance_id   │                      
  │                     │   + launch_token     │                      
  │                     │   写 pending 槽位    │                      
  │                     │                      │                      
  │                     │ ③ spawn(             │                      
  │                     │   image=ai-member-   │                      
  │                     │         backend:v1,  │                      
  │                     │   env={MEMBER_ID,    │                      
  │                     │        LAUNCH_TOKEN, │                      
  │                     │        MEMBER_SVC,   │                      
  │                     │        CONV_SVC,     │                      
  │                     │        TOOLGW})      │                      
  │                     │ ──────────────────>  │                      
  │                     │                      │ ④ docker.run         
  │                     │                      │ ──────────────────> │
  │                     │                      │                     │ ⑤ 容器启动
  │                     │                      │                     │    supervisord PID 1
  │                     │                      │                     │    启 member 进程
  │                     │                      │                     │    member 监听 :50143
  │                     │                      │                     │    启 runtime 进程
  │                     │                      │                     │    runtime 连 IPC
  │                     │                      │                     │
  │                     │ <─────── ⑥ Register(member_id,              │
  │                     │             launch_token,                   │
  │                     │             endpoint="container:50143")     │
  │                     │                                             │
  │                     │ ⑦ 校验 token                                 │
  │                     │   写 Endpoint Registry                       │
  │                     │   state=READY                                │
  │                     │ ──── ⑧ RegisterResponse(ok) ────────────>   │
  │                     │                                             │
  │                     │                                             │ ⑨ 开启 Heartbeat
  │                     │ <──── Heartbeat stream ─────────────────────│    stream
  │                     │                                             │
  │ <── ⑩ CreateMember  │                                             │
  │     Response        │                                             │
  │     (member_id,     │                                             │
  │      endpoint)      │                                             │
  │                                                                    
  │     ⟪ 现在可以 DeliverMessage ⟫                                   
  │                                                                    
  ▼
```

### 6.2 节点派发时序（flow → Member → Runtime）

```
 flow              Member(container)              Runtime(container)
  │                     │                               │
  │ ① 查 member-service │                               │
  │   lookup(be)        │                               │
  │ ────>               │                               │
  │ <──── endpoint ──── │                               │
  │                     │                               │
  │ ② DeliverMessage(   │                               │
  │   msg={kind=        │                               │
  │   node_execute,     │                               │
  │   task_id=t003,     │                               │
  │   payload=...})     │                               │
  │ ──────────────────> │                               │
  │                     │                               │
  │                     │ ③ Attention 过滤             │
  │                     │   优先级评估                  │
  │                     │   写 inbox 记录               │
  │                     │                               │
  │                     │ ④ IPC DeliverInboxMessage    │
  │                     │ ─────────────────────────────>│
  │                     │                               │
  │                     │                               │ ⑤ LLM Loop
  │                     │                               │    think
  │                     │                               │    act (调 tool)
  │                     │                               │    observe
  │                     │                               │    ... 多轮 ...
  │                     │                               │
  │                     │ ⑥ IPC InvokeTool(            │
  │                     │      tool_id=code.write,     │
  │                     │      params={...})            │
  │                     │ <────────────────────────────│
  │                     │                               │
  │                     │ ⑦ 本地执行 Tool               │
  │                     │   (或经 tool-gateway)         │
  │                     │ ──── 结果 ───────────────────>│
  │                     │                               │
  │                     │                               │ ⑧ 继续 Loop
  │                     │                               │    直到完成
  │                     │                               │
  │                     │ ⑨ IPC SubmitOutbox(          │
  │                     │      msg={kind=              │
  │                     │      node_result,             │
  │                     │      status=completed,        │
  │                     │      output=...})             │
  │                     │ <────────────────────────────│
  │                     │                               │
  │                     │ ⑩ Outbox Publisher           │
  │                     │   写 conversation             │
  │                     │   (Phase 2B 暂用 platform)   │
  │                     │                               │
  │ <── NodeResult ──── │                               │
  │  (via conversation  │                               │
  │   订阅)             │                               │
  │                                                      
  │ ⑪ BPMN 推进         │                               │
  │    下一节点         │                               │
  ▼
```

### 6.3 容器崩溃与重启

```
 Container                member-service                DockerOrchestrator
   │                           │                              │
   │ (崩溃: OOM / panic)        │                              │
   │ ──────X                   │                              │
                               │                              │
                               │ ① Heartbeat 超时             │
                               │   或 docker event (die)      │
                               │                              │
                               │ ② Endpoint Registry          │
                               │   标记 state=CRASHED         │
                               │                              │
                               │ ③ 查 restart_policy           │
                               │   ┌───────────────────────┐  │
                               │   │ always → respawn      │  │
                               │   │ never  → 不重启       │  │
                               │   └───────────────────────┘  │
                               │                              │
                               │ ④ 若 always:                 │
                               │    restart_count++           │
                               │    若 < max_restarts:         │
                               │      spawn 新 instance       │
                               │    否则降级为 never           │
                               │                              │
                               │ ──── spawn ─────────────────>│
                               │                              │ ⑤ docker.run
                               │                              │   新 container
                               │                              │
                               │                              │    (走 §6.1 时序)
                               ▼
```

---

## 七、Image 策略

### 7.1 镜像分层

```
第 1 层：python:3.12-slim                       # 约 120 MB
第 2 层：ai-member-base                         # +80 MB
  FROM python:3.12-slim
  RUN apt-get install -y supervisor curl
  RUN pip install grpcio protobuf pydantic
  COPY supervisord.conf /etc/supervisor/
  # 不装 member/runtime，base 不是可直接运行的

第 3 层：ai-member-{role}                       # +50-500 MB
  FROM ai-member-base
  RUN pip install quantalithos-member==VER
  RUN pip install quantalithos-runtime==VER
  RUN pip install quantalithos-tools[code,git-local]  # 按 role 选 extras
  COPY profiles/backend-dev.yaml /etc/quantalithos/role.yaml
  CMD ["/usr/bin/supervisord", "-n"]
```

### 7.2 各 role 依赖矩阵

```
role              core tools        optional          镜像大小（估算）
────              ──────────        ────────          ────────────
tech-lead         code              (无)              ~300 MB
backend-dev       code, git-local   lsp-python        ~400 MB
frontend-dev      code, git-local   lsp-js, browser   ~700 MB (含 Chromium)
qa-lead           browser, test     (无)              ~700 MB
designer          (Phase 3)         figma, image-gen  预估 ~800 MB
```

### 7.3 Versioning 策略

```
member-sdk / runtime-sdk / tools 各自独立 semver
image tag 采用复合版本：v{major}.{minor}.{patch}-{gitsha-short}

示例：
  quantalithos/ai-member-base:v1.0.0-abc1234
  quantalithos/ai-member-backend:v1.0.0-abc1234
  
CI/CD 触发规则：
  • member 发版         → rebuild 所有 role image
  • runtime 发版        → rebuild 所有 role image
  • tools 发版          → rebuild 依赖它的 role image
  • role config 变更     → rebuild 该 role image
```

---

## 八、设计原则审视

### 8.1 对照 software_design_principles.md

| 原则 | 审视结论 |
|------|---------|
| SRP | Member 只管社交、Runtime 只管决策、Tool 只管执行，职责清晰 ✓ |
| OCP | ContainerOrchestrator 抽象，加 k8s 实现不改核心；Tool 插件化 ✓ |
| LSP | DockerOrchestrator / KubernetesOrchestrator 可替换 ✓ |
| ISP | 对外只暴露 MemberLifecycle / MemberDelivery 两个小 service ✓ |
| DIP | Runtime 依赖 Tool 抽象而非具体 Tool；Member 依赖 IPC 抽象 ✓ |
| DRY | 身份/规则/IPC 协议在 core 统一定义，多端共享 ✓ |
| KISS | 容器内 3 实体（不是 12），只有 2 个主进程 ✓ |
| YAGNI | 显式列 §1.5 的不做清单，不预建未用能力 ✓ |
| 最小知识 | Member 容器之间互不通信，只通过 conversation / tool-gateway ✓ |
| 关注点分离 | 业务（Runtime）与基础设施（Member+supervisord）分层 ✓ |
| 可扩展性 | 新增 role = 新增 Dockerfile + 配置；新增 Tool = 加一个 sub-package ✓ |
| 可演进性 | Phase 2B → 2C → 3 的升级只需加组件，不需推倒 ✓ |
| 可组合性 | Tools 通过 pip extras 按需组合 ✓ |
| 可观测性 | 容器级 cgroup 指标 + Member 心跳 + ToolCallSite 审计 ✓ |
| Fail Fast | Register token 不符立即拒绝；max_restarts 超限降级 ✓ |
| 边界校验 | launch_token 握手 + proto 强类型 + shared_rules 约束 ✓ |
| 契约设计 | gRPC + proto 前置/后置条件明确 ✓ |
| 幂等性 | Deregister 幂等；Register 一次性 token ✓ |

### 8.2 对照 research_design_principles.md

| 原则 | 审视结论 |
|------|---------|
| Agent = ReAct 模式 | Runtime Loop 按 think → act → observe ✓ |
| Orchestrator-Worker | flow 编排 Member，Member 内编排 Runtime-Tools ✓ |
| State Machine 硬约束 | Container 生命周期状态机（§2.3）✓ |
| Handoff 模式 | 用户接管 Member 靠 Pause + Lease（Phase 3 落地）⏳ |
| Sub-Agent 最小上下文 | Tool 调用只传必要参数，Runtime 不泄漏给 Tool ✓ |
| BPMN 2.0 (flow) | flow 继承原 BPMN 引擎 ✓ |
| MCP 兼容 | Tool 接口兼容 MCP schema（Phase 2C+ 对齐） ⏳ |
| A2A Task 模型 | Member 间通信保留演进空间（Phase 3+） ⏳ |
| OpenTelemetry GenAI | Phase 2C 补埋点 ⏳ |
| W3C Trace Context | env 注入 TRACE_PARENT，全链路透传 ✓ |
| 持久执行（Temporal 式） | Phase 3 做 checkpoint，Phase 2B 容器重建即重来 ⏳ |
| 错误级联防御（怀疑机制） | 每个 Member 独立进程 + 独立 Memory，天然隔离 ✓ |
| 指令冲突优先级（shared_rules） | Constraints 从 core 加载，Runtime prompt 组装时最高优先 ✓ |
| 沙箱加固 | 容器 + cgroup 是基础；Phase 3 加 gVisor/seccomp ⏳ |
| Prompt Injection 防御 | 输入校验放在 Member Attention + ToolCallSite ✓ |

### 8.3 多 Agent 失败模式 checklist（arxiv 2503.13657）

| 失败模式 | 本方案应对 |
|---------|-----------|
| 规格与系统设计失败 | Member 3 实体清晰、proto 强契约 ✓ |
| 任务定义不清 | flow BPMN 明确节点语义 ✓ |
| 角色边界模糊 | Member 只认 1 个 agent_id，role 硬绑定 ✓ |
| Agent 间协调失败 | Phase 2B 暂无 A2A，所有交互经 flow/conversation ✓ |
| 信息丢失 | 容器间 proto 强类型，IPC 同样 proto ✓ |
| 冲突决策 | 单 member-service 协调，无并发 spawn 冲突 ✓ |
| 死锁 | Shutdown grace + SIGKILL 兜底 ✓ |
| 任务验证与终止失败 | NodeResult 明确 status 枚举 ✓ |
| 过早宣称完成 | flow 侧幂等检查 + 事实校验 ✓ |
| 无法检测错误 | Heartbeat + Docker event + exit_code 全面观测 ✓ |

---

## 九、未决问题

以下问题需要后续专题讨论或在 Phase 2B 实施中决议。**它们不阻塞 Phase 2B 启动**，但需要跟踪。

### 9.1 架构层面

| # | 问题 | 处理时机 |
|---|------|---------|
| U1 | 容器冷启动延迟若 > 5s 是否引入 warm pool | Phase 2B M6 联调后评估 |
| U2 | Member 进程内 Attention 如何实现（简单优先级 vs LLM 判断） | M2 实现时决定，先简单版本 |
| U3 | Runtime 内部 Memory 的持久化边界（当前内存 vs 后续 platform） | Phase 3 专题 |
| U4 | 用户接管 Member 的协议细节（Pause 时 Runtime 的状态如何保全） | Phase 3 专题 |
| U5 | 同一 member 是否允许多个活跃 container（主/备） | Phase 3 评估 |

### 9.2 通信与协议

| # | 问题 | 处理时机 |
|---|------|---------|
| U6 | IPC 用 UDS gRPC vs domain socket + msgpack | M1 验证后定 |
| U7 | 大 payload（Prompt 几十 KB）走 IPC 还是共享 volume | M2 压测后决定 |
| U8 | Heartbeat 频率（5s vs 10s）和带宽权衡 | M3 实测 |
| U9 | Register 后的 session token 是否需要定期轮换 | Phase 3（安全专题） |

### 9.3 运维

| # | 问题 | 处理时机 |
|---|------|---------|
| U10 | 容器日志如何统一收集（直接 docker logs vs fluent-bit sidecar） | M7 运维专题 |
| U11 | 生产环境镜像 registry 托管方案 | 生产上线前 |
| U12 | 多机部署时 Docker network 的跨主机方案 | Phase 3+ k8s 时解决 |

### 9.4 业务

| # | 问题 | 处理时机 |
|---|------|---------|
| U13 | 项目结束时 Member 容器的归档策略（即销即忘 vs 保留一段） | Phase 2B 收尾决定 |
| U14 | 同一项目多轮迭代时 Memory 的跨迭代共享 | Phase 3 专题 |

---

## 十、对上游决策文档的影响

本架构定稿后，以下文档需同步更新：

| 文档 | 操作 | 内容 |
|------|------|------|
| `docs/architecture/agent部署拓扑与群组协作讨论.md` | 改状态 | D1 改为"已演进到 Member 容器化"，D3/D4 改为"被本架构覆盖" |
| `docs/architecture/单runtime单agent落地设计.md` | 标过时 | 顶部加"已废弃，被 member-container-architecture.md 替代" |
| `docs/architecture/phase2-grpc升级方案.md` | 改状态 | 标注"Phase 2 runtime 相关部分跳过，详见 Q1 决策" |
| `docs/architecture/开发路线图与优先级.md` | 重写 Phase 2B | 去掉旧 Phase 2B 内容，链接到本文 |
| `docs/architecture/phase2b-实施规划.md` | 新建 | 本架构的落地执行规划（下一步产出） |
| 各项目 `design/` 文档 | 跟随 | Phase 2B 启动后按项目逐步更新 |

---

## 十一、下一步

```
Step 1: 本文评审 → 定稿 → commit
        (含同步修改上游三份文档的状态)

Step 2: 产出 docs/architecture/phase2b-实施规划.md
        - M1 ~ M7 里程碑 / 周级任务
        - 各里程碑的输入 / 输出 / 验收
        - 风险与应对
        - 具体的启动顺序

Step 3: 创建 5 个新仓库骨架（Phase 2B M1 的开场）

Step 4: core 扩展 proto（Phase 2B M1 核心工作）

Step 5: 开始按 M1 → M7 推进
```

---

> **备注**：本文是 Quantalithos AI 进入 Phase 2B 及之后的权威架构依据。任何与本文冲突的历史设计文档（尤其是 `单runtime单agent落地设计.md`），在本文正式提交后应视为过时，仅保留供历史对照。
