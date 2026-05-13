# Agent 部署拓扑与群组协作设计讨论

> 状态：**历史讨论（已演进）**。D1 拓扑已超越方案 A，最终演进到 **Member 容器化架构**。D2 群组模型仍待定。  
>
> **权威架构文档（2026-05-07 定稿）**：[Member 容器化架构设计](./member-container-architecture.md)
>
> 关联文档：
> - [Member 容器化架构设计](./member-container-architecture.md) — **权威**，替代本文 D1/D3/D4 的落地方案
> - [单 runtime 单 agent 落地设计](./单runtime单agent落地设计.md) — 已废弃（flow-supervised subprocess 方案）
> - [Phase 2 gRPC 升级方案](./phase2-grpc升级方案.md)
> - [开发路线图与优先级](./开发路线图与优先级.md)
> - [仓库拆分方案](./仓库拆分方案.md)
>
> 对照清单：本文所有方案均已对照 `research_design_principles.md`（Agent 模式、标准协议、失败模式）和 `software_design_principles.md`（SOLID、延展性、契约、DDD）。
>
> **决策状态（2026-05-07 再更新）**：
> - ✅ D1 = 方案 A → **演进到 Member 容器化**（1 Container = 1 AI Member，容器内 Member + Runtime 双进程）
> - ⏳ D2 群组模型仍待定（P1 / P2 / P3 三选一）
> - ✅ D3 = Phase 2B 单独立项（Phase 2 gRPC 已决定跳过，直接做 2B 容器化）
> - ✅ D4 = 范围扩展到 **core + flow + platform + 5 个新项目**（member / runtime 新版 / tools / member-images / member-service）

---

## 一、背景与问题定义

### 1.1 Phase 1 现状

当前 Quantalithos 的 Agent 部署拓扑是 **1 flow : 1 runtime : N agents（进程内协程）**：

```
┌──────────────┐            ┌──────────────────────────────────┐
│              │  node_exec │         runtime process           │
│     flow     │ ─────────> │  ┌────────────────────────────┐  │
│              │            │  │  asyncio event loop        │  │
│  EventLoop   │ <───────── │  │  ┌─────┐ ┌─────┐ ┌─────┐   │  │
│  编排/调度   │  NodeResult│  │  │ A1  │ │ A2  │ │ ...N│   │  │
│              │            │  │  └─────┘ └─────┘ └─────┘   │  │
└──────────────┘            │  │  共享：MCP/LLM client       │  │
                            │  └────────────────────────────┘  │
                            └──────────────────────────────────┘
```

### 1.2 现状的痛点

- **故障爆炸半径大**：任一 Agent 的内存泄漏、异常死循环、工具调用崩溃都会拖垮整个 runtime
- **不可水平扩展**：runtime 是单进程，不符合 ISO 25010 的可伸缩性要求
- **无安全边界**：Agent 共享进程空间，无法做 cgroup/seccomp 级隔离（研究结论：LLM 已能逃逸常见容器沙箱）
- **Agent 间通信未协议化**：进程内直接调用，未来要上 A2A 协议要重写
- **无"群组"概念**：Agent 是扁平集合，无法表达团队结构、职能分工、组级权限

### 1.3 本文要回答的两个问题

1. **部署拓扑问题**：flow/runtime/agent 三者的数量关系应该是什么？
2. **群组协作问题**：当需要把 Agent 组织成多个"群组"分别完成特定任务，且群组之间又需要相互协作时，如何设计？

两个问题互相耦合——拓扑方案决定了群组方案的可选空间。

---

## 二、部署拓扑方案

### 2.1 方案 0（现状）：1 flow ─ 1 runtime ─ N agents

已在 §1.1 描述。不再重复。

### 2.2 方案 A：1 flow ─ N runtimes ─ 1 agent/runtime

每个 Agent 独占一个 runtime 进程（甚至独占一个容器）。

```
┌──────────────┐           ┌─────────────┐
│              │ ────────> │ runtime r1  │ ──> agent A1（独占）
│              │           └─────────────┘
│              │           ┌─────────────┐
│     flow     │ ────────> │ runtime r2  │ ──> agent A2（独占）
│              │           └─────────────┘
│  需要：      │           ┌─────────────┐
│  - agent→    │ ────────> │ runtime r3  │ ──> agent A3（独占）
│    runtime   │           └─────────────┘
│    路由表    │           ┌─────────────┐
│  - 生命周期  │ ────────> │ runtime rN  │ ──> agent AN（独占）
│    管理      │           └─────────────┘
└──────────────┘
      1 flow            :       N runtimes      :   N agents (1:1)
```

**特性**：
- 进程级/容器级隔离，安全性最高
- 故障隔离最彻底
- 每 Agent 独立的资源配额、独立的启动/停止生命周期
- 可按 Agent 特性定制沙箱（如敏感数据 Agent 用 gVisor、代码执行 Agent 用 Firecracker）

### 2.3 方案 B：1 flow ─ N runtimes ─ M agents（池化调度，M > N）

每个 runtime 承载若干个 Agent，agents 在 runtime 池中按策略分布。

```
┌──────────────┐          ┌──────────────────────┐
│              │          │  runtime r1          │
│              │ ───────> │  ┌───┬───┬───┐       │
│              │          │  │A1 │A2 │A3 │ ...   │
│              │          │  └───┴───┴───┘       │
│              │          │  容量：例 8 agents    │
│     flow     │          └──────────────────────┘
│              │          ┌──────────────────────┐
│  需要：      │ ───────> │  runtime r2          │
│  - 调度器    │          │  ┌───┬───┬───┐       │
│  - agent     │          │  │A4 │A5 │A6 │ ...   │
│    registry  │          │  └───┴───┴───┘       │
│  - 负载均衡  │          └──────────────────────┘
│              │          ┌──────────────────────┐
│              │ ───────> │  runtime rN          │
│              │          │  ┌───┬───┬───┐       │
│              │          │  │Ax │Ay │Az │ ...   │
└──────────────┘          └──────────────────────┘
      1 flow        :       N runtimes      :   M agents (M:N，M ≫ N)
```

**特性**：
- 资源效率与隔离的折中
- 可按 runtime 工作负载特性分池（heavy/light/sandbox 池）
- Agent 可在 runtime 间迁移（前提：状态持久化）
- 单 runtime 挂掉影响其上全部 Agent

### 2.4 三种拓扑方案对比

| 维度 | 方案 0 (现状) | 方案 A (1 agent / runtime) | 方案 B (M agents / N runtimes) |
|------|--------------|---------------------------|-------------------------------|
| 故障隔离 | ✗ 一错俱错 | ✓✓✓ 进程级隔离，最高 | ✓ 一 runtime 挂掉影响其上全部 agent |
| 资源开销 | ✓✓✓ 最小（一份栈） | ✗ 每 agent 一份 Python 栈+MCP | ✓ 介于二者之间 |
| 水平扩展 | ✗ 不能 | ✓✓ 线性但代价高 | ✓✓✓ 灵活，加 runtime 即扩容 |
| 内存占用(N=50) | ~1× runtime (几百MB) | ~50× runtime (10+ GB) | ~5× (按容量 10/runtime) |
| 调度复杂度 | ✓ 无需调度 | ✗ 需 agent→runtime 路由表 | ✗✗ 需调度器+registry+placement |
| 状态管理 | ✓ 内存直接访问 | ✓ 绑定进程，天然 sticky | ⚠ 需 sticky 路由或外部状态存储 |
| 启动延迟 | ✓ 创建 agent ≈ ms | ✗ 拉起进程 1-3s (cold start) | ✓ 池内创建 agent ≈ ms |
| 安全隔离 | ✗ 进程内共享 | ✓✓ 可独立 cgroup/namespace | ⚠ 同进程 agent 共享权限 |
| OOM 爆炸半径 | ✗✗ 全部 agent | ✓ 仅该 agent | ⚠ 该 runtime 上所有 agent |
| Agent 间通信 | ✓ 进程内 in-proc | ✗ 必须过网络 (gRPC) | ⚠ 同 runtime in-proc / 跨 runtime 网络 |
| 升级/热替换 | ✗ 全停 | ✓ 逐 agent 滚动 | ✓✓ 逐 runtime 滚动 |
| 观测定位 | ✓✓ 一处日志 | ✗ 分散日志，需聚合 | ⚠ 中等，按 runtime 聚合 |
| 契合 k8s | ⚠ 单 Pod 瓶颈 | ✓ 每 agent 一 Pod，极细 | ✓✓ Pod 即 runtime，pod 内池化 |
| 契合 A2A 协议 | ✗ 全在同进程，无需 A2A | ✓✓ 天然跨进程，A2A 直接落地 | ✓ 跨 runtime 时需要 A2A |

### 2.5 核心取舍

```
资源效率  ←──────────────────────────────────────→  故障/安全隔离

方案 0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        [效率王]

方案 B ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    [工程折中]

方案 A ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                                  [隔离王]
```

### 2.6 对照研究原则审视

| 研究原则 | 方案 0 | 方案 A | 方案 B |
|---------|--------|--------|--------|
| Orchestrator-Worker（flow 编排） | 弱（伪 worker） | 强 | 强 |
| 错误级联防御（arxiv 2603.04474） | 差 | 强 | 中 |
| 沙箱逃逸防御（arxiv 2603.02277） | 不可行 | 强（agent 级 gVisor） | 中（runtime 级） |
| A2A 协议落地 | 难（要重写） | 自然 | 自然 |
| 持久执行（Temporal 式） | 可行但绑进程 | 易（agent 绑 runtime） | 需状态外置 |
| ISO 25010 可伸缩性 | 不合格 | 合格 | 合格 |

---

## 三、群组概念与核心决策维度

### 3.1 "群组"的三种可能语义

在进入具体方案前，必须先对齐"群组"的语义。不同语义的边界强度决定架构强度。

| 解读 | 描述 | 协作形态 | 边界强度 |
|------|------|---------|---------|
| **解读 1：职能团队** | 长期组织结构（backend 组 / frontend 组 / QA 组） | 跨职能交付（PM→dev→QA） | 硬（有 leader、KPI、章程） |
| **解读 2：业务域** | 独立子系统（group-α 做推荐，group-β 做订单） | 偶尔商议共享契约 | 硬（版本化契约） |
| **解读 3：任务班子** | 临时小分队（"修 bug-123 小组"、"性能专项组"） | 跨班子借信息、请求支援 | 软（轻量化） |

Quantalithos 的主要场景贴近 **解读 1 + 解读 3 混合**：六阶段流程中的长期职能团队 + 项目级临时专项班子。

### 3.2 必须决策的设计维度

在设计群组架构之前，以下 7 个维度必须逐项拍板：

| 决策点 | 选项 | 影响 |
|--------|------|------|
| **组边界语义** | 硬（独立上下文/权限/内存） / 软（仅标签，共享全局） | 决定封装强度 |
| **领导模型** | 扁平（无 leader） / 单 leader（TL 代表对外） / 双头（TL+PM 分工） | 决定组内权威结构 |
| **跨组通信协议** | 直连（任意 agent 互调） / 经 leader（封装） / 经总线（pub-sub） / 经 flow（中介） | 决定协作模型 |
| **runtime 放置策略** | 组内尽量同 runtime（亲和） / 组内跨 runtime 分散（高可用） | 决定性能与可用性取舍 |
| **组级状态归属** | 组内内存 / platform 持久化 / 双层 cache | 决定恢复能力 |
| **组生命周期** | flow 定义时静态声明 / 运行时动态 spawn | 决定灵活度 |
| **可见性/权限** | 全互通（透明） / 白名单（声明式契约） | 决定信息隔离 |

这些维度将贯穿后续三种候选方案的对比。

---

## 四、群组协作候选方案

以下方案均**基于方案 B（池化 runtime）的部署拓扑**讨论（方案 0 不足以支撑群组语义，方案 A 中每个 agent 独立进程使群组归属纯粹是逻辑概念，与 B 无本质差别）。

### 4.1 方案 P1：扁平 + tag（最轻）

Agent 上只打 `group_id` 标签，不改变现有调用关系。

```
┌──────────────────────────────────────────────────────────────┐
│                           flow                                │
│                         (1 个 BPMN)                           │
└──────────────────────────────────────────────────────────────┘
              │ node_execute (带 group 标签)
              ▼
   ┌──────────────────────┬──────────────────────┐
   │   runtime r1         │   runtime r2         │
   │ ┌──────┐ ┌──────┐    │ ┌──────┐ ┌──────┐   │
   │ │A1@BE │ │A2@FE │    │ │A3@BE │ │A4@QA │   │
   │ └──────┘ └──────┘    │ └──────┘ └──────┘   │
   └──────────────────────┴──────────────────────┘

  agent 之间任意互调（A1 可以直接 chat A4）
  "group" 只是 agent 的一个 label
  组间协作 = 普通 chat_message + 带 group 信息
```

**优点**：
- 实现最简，现有机制几乎不用改
- 灵活度最高，动态组建/解散成本低

**缺点**：
- 边界形同虚设，封装无从谈起
- 协作失控，错误级联防御弱（违反 arxiv 2603.04474 结论）
- 无法做组级权限/隔离
- 观测定位难（"谁对谁负责"不清晰）

**适用**：解读 3（临时班子），或组概念非常弱时

---

### 4.2 方案 P2：层级 + Group Leader（TL 作组的门户）

每组有明确 leader（通常是 TL 角色），leader 是组对外的唯一入口和出口。

```
┌──────────────────────────────────────────────────────────────┐
│                          flow                                 │
│              ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│              │ Group α  │ │ Group β  │ │ Group γ  │           │
│              │  (BE)    │ │  (FE)    │ │  (QA)    │           │
│              └─────┬────┘ └─────┬────┘ └─────┬────┘           │
└────────────────────┼───────────┼────────────┼────────────────┘
                     │ 组级任务   │            │
                     ▼            ▼            ▼
┌───────────────────────┐  ┌───────────────────────┐
│   runtime pool r1     │  │   runtime pool r2     │
│  ┌─────────────────┐  │  │  ┌─────────────────┐  │
│  │ α group         │  │  │  │ β group         │  │
│  │ ┌───┐ ┌───┐┌───┐│  │  │  │ ┌───┐ ┌───┐    │  │
│  │ │TL●│ │W1 ││W2 ││  │  │  │ │TL●│ │W1 │    │  │
│  │ └───┘ └───┘└───┘│  │  │  │ └───┘ └───┘    │  │
│  └─────────────────┘  │  │  └─────────────────┘  │
│                       │  │                        │
│  ┌─────────────────┐  │  │                        │
│  │ γ group         │  │  │                        │
│  │ ┌───┐ ┌───┐     │  │  │                        │
│  │ │TL●│ │W1 │     │  │  │                        │
│  │ └───┘ └───┘     │  │  │                        │
│  └─────────────────┘  │  │                        │
└───────────────────────┘  └───────────────────────┘

       ● = Group Leader (TL)，负责组对外接口

组内通信：              组间通信：
  W1 ↔ W2 in-proc         TL_α ──RequestCollaboration──> TL_β
  W1 ↔ TL 自由对话        (via flow coordination 或直接 RPC)
                           TL_β 收到后决定：派单给 W1_β 或拒绝

流程建模（BPMN 天然支持）：
  父 flow: [需求] → [call-activity: Group α] → [call-activity: Group β]
                                │                    ▲
                                │ message event      │ message event
                                └────────────────────┘
  子流程 Group α 和 Group β 通过 BPMN message flow 通信
```

**优点**：
- 职责清晰，TL 是组的边界守门人（封装内部状态）
- 符合现实团队结构（PM/TL/Worker 映射 agent 角色）
- **天然落地 BPMN call-activity**（组 = 子流程，组间协作 = BPMN message event）
- 符合 Orchestrator-Worker 模式（嵌套：flow 编排 TL，TL 编排 Worker）
- 组间通过 TL 对话 → 可做 rate limiting / 审计 / 权限校验
- 跨组信任通过 TL 达成（贴合"怀疑机制"研究结论）

**缺点**：
- TL 成为潜在瓶颈（组内所有对外通信经它）
- 多一跳延迟（Worker_α 找 Worker_β 要经 TL_α → TL_β）
- TL 崩溃 = 组对外失联

**缓解**：
- TL 可设副手（deputy）热备
- 紧急直连通道（标 "direct" 的 message 允许跨组，但必须抄送双方 TL 做审计）
- TL 自身不执行重活，只做路由与审核，降低瓶颈概率

**适用**：解读 1（职能团队），Quantalithos 主场景

---

### 4.3 方案 P3：消息总线（pub-sub）

组间协作完全异步，通过统一事件总线。

```
┌──────────────────────────────────────────────────────────────┐
│                           flow                                │
└──────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     ┌───────────────┐              ┌───────────────┐
     │   Group α     │              │   Group β     │
     │ ┌───┐  ┌───┐  │              │ ┌───┐  ┌───┐  │
     │ │A1 │  │A2 │  │              │ │B1 │  │B2 │  │
     │ └─┬─┘  └─┬─┘  │              │ └─┬─┘  └─┬─┘  │
     └───┼──────┼────┘              └───┼──────┼────┘
         │      │                       │      │
         ▼      ▼                       ▼      ▼
    ┌─────────────────────────────────────────────────┐
    │              Event Bus (platform)               │
    │  topics:                                         │
    │   - group.α.ask_for_review                       │
    │   - group.β.api_contract_updated                 │
    │   - group.*.broadcast                            │
    └─────────────────────────────────────────────────┘
       订阅：β 订阅 group.α.ask_for_review
             α 订阅 group.β.api_contract_updated

  跨组协作完全异步、松耦合
  agent 发事件 → bus → 订阅方消费
```

**优点**：
- 最松耦合，组完全自治
- 背压天然（下游处理不过来事件就堆积）
- 高可用（单组挂不影响其他）

**缺点**：
- 异步导致"等回复"模式（request/response）很难写（需要做关联 id、超时、补偿）
- 可观测性挑战（事件流路径长，trace 难串）
- 协作语义被打散到事件里，缺乏整体视图
- 与 BPMN 的显式编排模型不够贴合

**适用**：解读 2（独立业务域、低频异步协作）

---

### 4.4 三种群组方案对比

| 维度 | P1 扁平+tag | P2 层级+TL | P3 消息总线 |
|------|-------------|-----------|------------|
| 实现难度 | 极低 | 中 | 高 |
| 协作语义清晰度 | 差 | 强 | 中 |
| 故障隔离 | 无 | 组级 | 组级 |
| 边界守门 | 无 | TL | 事件契约 |
| 符合 BPMN | 弱 | 强（子流程） | 中（event） |
| 符合 Orch-Worker | 弱 | 强（嵌套） | 弱 |
| A2A 协议落地 | 难 | 自然 | 自然 |
| 错误级联防御 | 差 | 强（TL 审查） | 中 |
| 观测/审计 | 差 | 好 | 中 |
| "人类组织"直觉 | 弱 | 强 | 弱 |
| runtime 亲和 | 简单 | 按组亲和 | 无要求 |
| 适合规模 | <10 agent | 10-100+ | 任意 |
| 适合语义解读 | 解读 3 | 解读 1 | 解读 2 |

---

## 五、方案 P2 的核心抽象（如果选定 P2 后的细化草案）

### 5.1 领域概念（DDD 视角）

```
AgentGroup（群组聚合根）
  - group_id
  - name / purpose
  - leader_agent_id      ← 组的代表，对外唯一入口
  - deputy_agent_id?      ← TL 备份
  - member_agent_ids[]
  - parent_group_id?      ← 支持组嵌套（子组/子班子）
  - shared_context_ref    ← 组共享记忆/文档空间的 handle
  - inbound_contract      ← 允许哪些外部组/消息进入（白名单）
  - outbound_contract     ← 对外可发起哪些请求
  - lifecycle_state       ← forming / active / dissolving / dissolved

GroupCollaborationRequest（组间请求值对象）
  - request_id / correlation_id
  - from_group / to_group
  - kind: [ask_review | request_capacity | share_artifact | notify | ...]
  - payload
  - expected_response_type
  - deadline
  → 自然映射到 A2A Task 模型

GroupWorkspace（组级共享工作区）
  - group_id
  - documents / notes / decisions
  - write_policy: TL-only | member-write-TL-approve | free
  - read_scope: private | siblings | public
```

### 5.2 运行时放置策略（方案 B 下）

```
- 同组优先落同 runtime（亲和，降低组内 chat 的网络开销）
- TL 独立 runtime slot（隔离，防止被 Worker 拖垮 → 硬约束）
- 跨组走 gRPC（即便落在同 runtime 也经 gRPC，保证协议一致）
- placement 得分公式：
    score = w1 * affinity(group) + w2 * (-load) + w3 * isolation(role)
  权重随运维策略调整
```

### 5.3 BPMN 建模映射

| BPMN 元素 | 群组语义映射 |
|-----------|------------|
| call-activity | 启动/调用一个 Group |
| message event (between processes) | 组间 GroupCollaborationRequest |
| signal event | 组级广播 |
| sub-process | 子组（嵌套群组） |
| boundary event | 组级异常/升级处理 |

父 flow 永远看得到子 Group 的进度（通过 checkpoint），这天然满足 Temporal 式持久执行的要求。

---

## 六、踩坑点与失败模式预警

### 6.1 典型踩坑

| 坑 | 表现 | 缓解 |
|----|------|------|
| **TL 瓶颈** | TL 是 LLM 驱动的 agent，处理组间请求会慢 | 组间请求走消息+回调模式，TL 不阻塞；组内工作依然可并行 |
| **组级共享状态归属** | 组内文档/决策记录放哪？ | platform 的 GroupWorkspace 聚合根；TL 有写权限，Worker 默认只读 |
| **组间循环依赖** | α 等 β，β 等 α → 死锁 | BPMN 层做循环检测；组间请求强制超时；超时升级到 flow/人类 |
| **权限粒度** | Worker_α 能否看 Group β 内部讨论？ | 默认不能（封装）；例外通过 TL_β 显式授权 |
| **放置冲突** | 组亲和 vs. 负载均衡冲突（α 组全塞 r1） | placement 加权；TL 单独拿一个 runtime slot（硬约束） |
| **状态迁移难** | Agent 从 r1 迁到 r2 丢失上下文 | 状态外置到 platform；迁移前落盘，迁移后重载 |

### 6.2 对照多 Agent 失败模式 checklist（arxiv 2503.13657）

| 失败类 | 群组场景表现 | 防御 |
|--------|------------|------|
| **信息丢失** | 跨组传递时 payload 被截断/丢字段 | 组间契约用 Protobuf 强类型；字段版本化 |
| **冲突决策** | α 认为可以发布，β 同时决定回滚 | 组级状态经 flow 做最终一致性仲裁 |
| **过早宣称完成** | Group α 自己说"做完了"但没通知 β | BPMN 强制"组完成 = message event 送达对应下游组" |
| **死锁** | 组间循环等待 | 超时 + 升级机制 |
| **角色边界模糊** | 同一任务多组都认为是自己的 | inbound_contract 显式声明 + 路由表 |
| **能力冒充** | 某组越权做了不归自己的事 | outbound_contract 白名单校验 |

### 6.3 对照软件设计原则

| 原则 | P2 方案审视 |
|------|-----------|
| SRP（单一职责） | AgentGroup 只管组织关系，不管执行；TL 只管组边界，不管组内细节 |
| OCP（开闭原则） | 新增组类型只需注册新的 group role，不改核心 |
| DIP（依赖倒置） | 组间通信依赖 GroupCollaborationRequest 抽象，不依赖具体 Agent 实现 |
| 最小知识 | Worker_α 不需要知道 Group β 的内部成员 |
| 可演进性 | 组生命周期解耦于 flow 生命周期，可独立演进 |
| 可观测性 | 组级日志/trace 按 group_id 聚合，边界清晰 |
| 契约设计 | inbound/outbound contract 显式；TL 审核进出请求即契约强制点 |

---

## 七、未决问题清单

以下问题需要进一步讨论或实验验证，当前没有倾向性答案：

### 7.1 拓扑层面

- [ ] **Q1**：方案 A 和方案 B 是二选一，还是混合使用？（例如敏感组用 A，普通组用 B？）
- [ ] **Q2**：Agent 状态是否要从"纯内存"改造成"内存+持久化快照"？工作量评估？Phase 2 是否纳入？
- [ ] **Q3**：runtime 的容量上限如何定？按 agent 数量、内存、CPU、还是综合 quota？
- [ ] **Q4**：Agent cold start（尤其方案 A）的 1-3s 延迟是否可接受？能否用 runtime warm pool 缓解？

### 7.2 群组层面

- [ ] **Q5**：群组是"flow 定义时静态声明"还是"运行时动态 spawn"？两者是否都要支持？
- [ ] **Q6**：组嵌套（子组）是否必要？最大嵌套深度？
- [ ] **Q7**：跨组的紧急直连通道是否保留？如何防滥用？
- [ ] **Q8**：组级 KPI / 性能指标如何度量？（响应时长、任务完成率、跨组协作次数等）
- [ ] **Q9**：TL 副手（deputy）是"热备"还是"冷备"？切换协议？
- [ ] **Q10**：组解散时的清理语义（未完成任务如何处理、组级工作区是否保留为归档）

### 7.3 协议与契约层面

- [ ] **Q11**：GroupCollaborationRequest 是否直接复用 A2A Task？还是自定义一套兼容 A2A？
- [ ] **Q12**：组间契约（inbound/outbound contract）是代码层面声明还是配置化？
- [ ] **Q13**：组间通信的可靠投递语义（at-least-once / exactly-once / at-most-once）？
- [ ] **Q14**：组级事件是否也要上 OpenTelemetry GenAI 语义约定？

---

## 八、决策清单（待拍板）

以下决策需要在进入详细设计前确认：

### D1：部署拓扑最终形态 ✅ 已定

- [ ] 维持方案 0（短期）
- [x] **演进到方案 A**（1 runtime 进程绑 1 agent，持久常驻）
- [ ] 演进到方案 B
- [ ] 混合（哪些组/Agent 用 A，哪些用 B）

→ 落地设计详见 [单 runtime 单 agent 落地设计](./单runtime单agent落地设计.md)

### D2：群组架构模型 ⏳ 待定

- [ ] 方案 P1（扁平+tag）
- [ ] 方案 P2（层级+TL）
- [ ] 方案 P3（消息总线）
- [ ] 混合（如 P2 为主 + P3 作为异步事件补充）

### D3：演进节奏 ✅ 已定

- [ ] Phase 2 同步做（随 gRPC 改造一起）
- [x] **Phase 2B 单独立项**（Phase 2 gRPC 完成后启动）
- [ ] 先补齐"Agent 状态持久化"作前置，再谈拓扑与群组

→ Agent 状态持久化留 Phase 3 专题；Phase 2B 崩溃即重来

### D4：落地范围 ✅ 已定（方案 A）

- [x] **仅 flow / runtime / core 改造**（platform 零改动）
- [ ] 同时需要 platform 扩展（GroupWorkspace 聚合根）
- [ ] 同时需要 gate / infra 配合（隔离、quota、placement 调度器）

→ supervisor / launcher / registry 全部由 flow 承担（in-process），不外放到 platform

---

## 九、下一步

1. 用户阅读本讨论稿，形成倾向
2. 针对未决问题逐项讨论或实验验证
3. 决策拍板后，拆分到各项目详细设计：
   - `core`：新增群组相关 proto 契约（AgentGroup / GroupCollaborationRequest）
   - `flow`：BPMN call-activity 支持群组、跨组 message event 路由
   - `runtime`：placement 策略、组亲和、TL 隔离
   - `platform`：GroupWorkspace 聚合、组生命周期持久化
   - `gate` / `infra`：按需补充隔离与调度能力

---

> **备注**：本讨论完全符合 Phase 2 gRPC 改造后的架构基础（强契约、跨进程通信、事件 streaming）。如果选定 P2+方案 B，Phase 2 的 proto 定义需要为群组语义预留扩展点（AgentGroup / GroupCollaborationRequest 的 message 骨架），避免未来大改。
