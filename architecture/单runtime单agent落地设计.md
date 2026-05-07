# 单 runtime 单 agent 落地设计（Phase 2B）

> ⚠️ **状态：已废弃（2026-05-07）**
>
> 本文档描述的 "flow 作 supervisor + 1 runtime 进程绑 1 agent（subprocess 模式）" 方案已被 **[Member 容器化架构设计](./member-container-architecture.md)** 替代。
>
> **已失效的设计决策**：
> - ✗ flow 作为 runtime 的 supervisor  → 改为 member-service 独立服务承担
> - ✗ subprocess 模式拉起 runtime  → 改为 Docker 容器
> - ✗ 1 runtime 进程绑 1 agent  → 改为 1 Container = 1 AI Member（容器内 Member + Runtime 双进程）
> - ✗ LocalSubprocessLauncher  → 改为 ContainerOrchestrator (DockerOrchestrator)
>
> **保留价值**：仍可作为历史决策路径的参考（flow-supervised 方案的思考过程）。
>
> 后续所有"单 runtime 单 agent"相关设计，请以 [Member 容器化架构设计](./member-container-architecture.md) 为准。

---

> 状态：**定稿中**，方向已定，细节待评审。
>
> 关联文档：
> - [Agent 部署拓扑与群组协作讨论](./agent部署拓扑与群组协作讨论.md)（讨论稿，本文是其方向 A 的落地）
> - [Phase 2 gRPC 升级方案](./phase2-grpc升级方案.md)（前置）
> - [开发路线图与优先级](./开发路线图与优先级.md)

---

## 一、目标与范围

### 1.1 目标

将 Agent 部署拓扑从 Phase 1 的 **1 flow : 1 runtime : N agents（进程内协程）** 演进到 **1 flow : N runtimes : N agents（1 runtime 绑 1 agent，持久常驻）**。

### 1.2 已定决策（不再讨论）

| # | 决策 | 选项 |
|---|------|------|
| D1 | 部署拓扑 | **方案 A**：1 runtime 进程 ↔ 1 agent |
| D2 | 生命周期 | **持久常驻**：agent 存在则 runtime 存在；destroy 触发 runtime 退出 |
| D3 | supervisor | **flow 作为 runtime 的唯一 supervisor**（不经 platform） |
| D4 | 节奏 | **Phase 2B 单独立项**（Phase 2 gRPC 完成后再进行） |
| D5 | Launcher 实现 | **Phase 2B 只做 LocalSubprocessLauncher**（Docker/k8s 留后） |
| D6 | flow 崩溃行为 | **runtime 自杀**（心跳超时 self-terminate） |
| D7 | 重启策略粒度 | **最小两档**：`always` / `never`（agent 元数据声明） |
| D8 | 状态持久化 | **Phase 2B 不做 checkpoint**；崩溃即重来 |

### 1.3 显式不做（Phase 2B 范围外）

- Agent 记忆的 checkpoint / replay（留 Phase 3）
- Warm pool（冷启动优化留后评估）
- k8s / Docker Launcher（留后置 Phase）
- flow 水平扩展 + leader election（留 Phase 3+）
- 群组（AgentGroup）概念（独立专题）
- Agent 直连通信（所有 Agent 交互仍经 flow 中介）

### 1.4 Phase 2B 的前置条件

- Phase 2 gRPC 改造已完成（RuntimeService / FlowCallbackService / FlowService 均上线）
- core proto 已为 Phase 2B 预留 `runtime_instance_id` 等扩展字段（在 Phase 2 的阶段 5 末期埋入）

---

## 二、核心职责划分

### 2.1 改前（Phase 1 / Phase 2 现状）

| 组件 | 职责 |
|------|------|
| flow | BPMN 编排、事件循环、向唯一 runtime 发 node_execute |
| runtime | 进程内承载 N 个 Agent、AgentSessionManager 调度 |
| platform | 业务数据持久化 |

### 2.2 改后（Phase 2B）

| 组件 | 职责 |
|------|------|
| **flow** | BPMN 编排 + **AgentOrchestrator**（agent 生命周期）+ **RuntimeLauncher**（spawn/kill）+ **AgentEndpointRegistry**（in-memory 路由表）+ supervisor（心跳/崩溃检测） |
| **runtime** | **单 agent 执行**（无内部调度）、向 flow 注册并心跳、优雅 Shutdown 处理 |
| **platform** | **零改动**：只管业务数据，不参与 runtime 生命周期 |

### 2.3 最小侵入特性

相比"platform 作 Registry"的方案，本方案：
- platform 完全不动
- 变更集中在 **core proto + flow + runtime** 三个项目
- 本地联调无需额外启动注册中心服务

---

## 三、架构图

### 3.1 全局视图

```
┌──────────────────────────────────────────────────────────────────────┐
│                          flow process                                 │
│                                                                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │   EventLoop     │  │ AgentOrchestrator│  │  RuntimeLauncher │     │
│  │  (BPMN 调度)    │  │ (agent 生命周期) │  │ (进程 spawn/kill)│     │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘     │
│           │                    │                      │              │
│           ▼                    ▼                      ▼              │
│  ┌──────────────────────────────────────────────────────────┐         │
│  │              AgentEndpointRegistry (in-memory)           │         │
│  │   agent_id  →  {instance_id, endpoint, state, pid}       │         │
│  │   backend_tl →  {r042, 127.0.0.1:50142, READY, 31245}    │         │
│  │   frontend_dev→ {r043, 127.0.0.1:50143, BUSY, 31246}     │         │
│  │   qa_lead    →  {r044, 127.0.0.1:50144, READY, 31247}    │         │
│  └──────────────────────────────────────────────────────────┘         │
│           │                                                           │
│           │  lookup(agent_id) → endpoint                              │
│           ▼                                                           │
│  ┌──────────────────────────────────────────────────────────┐         │
│  │              RuntimeClient Pool (gRPC channels)           │         │
│  │   keyed by agent_id / endpoint                           │         │
│  └──────────────────────────────────────────────────────────┘         │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
           │spawn/kill                │ gRPC              ▲ register/heartbeat
           │(subprocess)              │                   │ NodeResult 回调
           ▼                          ▼                   │
  ┌──────────────┐            ┌──────────────┐    ┌──────────────┐
  │ runtime r042 │            │ runtime r043 │    │ runtime r044 │
  │ ──────────── │            │ ──────────── │    │ ──────────── │
  │ agent=BE_TL  │            │ agent=FE_DEV │    │ agent=QA_LEAD│
  │ :50142       │            │ :50143       │    │ :50144       │
  │ state=READY  │            │ state=BUSY   │    │ state=READY  │
  └──────┬───────┘            └──────┬───────┘    └──────┬───────┘
         │                           │                    │
         │ LLM / MCP tools           │                    │
         ▼                           ▼                    ▼
       (外部服务)                   (外部服务)          (外部服务)


              ┌─────────────────────────────┐
              │         platform            │
              │  (业务数据存储，不管进程)    │
              │  - project / session        │
              │  - message / artifact       │
              │  - workflow state           │
              └─────────────────────────────┘
                          ▲
                          │ flow / runtime 都读写业务数据
                          │ 但 platform 不参与 runtime 生命周期
```

### 3.2 runtime 状态机

```
                 spawn()
                    │
                    ▼
             ┌─────────────┐
             │  STARTING   │──(init 失败)──> CRASHED → (cleanup)
             └──────┬──────┘
                    │ Register 成功
                    ▼
             ┌─────────────┐
             │    READY    │<─────────────┐
             └──────┬──────┘              │
                    │ node_execute        │ node 完成
                    ▼                     │
             ┌─────────────┐              │
             │    BUSY     │──────────────┘
             └──────┬──────┘
                    │ Shutdown RPC
                    │ 或 flow 心跳超时（self-terminate）
                    ▼
             ┌─────────────┐
             │SHUTTING_DOWN│ (grace period)
             └──────┬──────┘
                    │ grace 完成 / 超时
                    ▼
                 EXITED (进程退出)

异常路径：
  READY/BUSY ─(panic/OOM/kill)──> CRASHED（flow 心跳超时检测）
```

### 3.3 create_agent 时序

```
 flow                                        runtime (new process)
  │
  │ ① start_process 触发
  │   需要 agent = backend_tl
  │
  │ ② AgentOrchestrator.create_agent(backend_tl, identity)
  │
  │ ③ RuntimeLauncher.spawn()
  │    - 分配端口 50142（从端口池）
  │    - 生成 instance_id = r042
  │    - 生成 launch_token（防冒充）
  │    - Registry 占位（state=STARTING）
  │    ────────────────────────────────────────> subprocess.Popen(
  │                                                  runtime_bin,
  │                                                  --agent-id=backend_tl,
  │                                                  --instance-id=r042,
  │                                                  --grpc-port=50142,
  │                                                  --flow-endpoint=127.0.0.1:50052,
  │                                                  --launch-token=<token>,
  │                                                  --identity-path=...)
  │                                              │
  │                                              │ ④ 进程启动
  │                                              │    加载 identity
  │                                              │    初始化 AgentSession
  │                                              │    监听 :50142 (gRPC server)
  │                                              │
  │                                              │ ⑤ 反向 gRPC Register
  │ <──── Register(instance_id, agent_id, ───────┘
  │        endpoint, launch_token, pid) ─────────
  │
  │ ⑥ 校验 launch_token ≡ 预期
  │    更新 Registry：state=READY
  │
  │ ───── RegisterResponse(ok=true) ─────────────>
  │                                              │
  │ ⑦ create_agent 返回完成                      │ ⑧ 启动 Heartbeat stream
  │    AgentOrchestrator 通知上层                │    进入 READY
  │                                              │
  │                                              │
  │                   ⟪ 从此可调度 ⟫              │
  │                                              │
  │ ⑨ node_execute (via gRPC :50142) ────────────>
  │                                              │    执行（READY→BUSY→READY）
  │ <──── NodeResult 回调 ───────────────────────
  │                                              │
  ▼                                              ▼
```

### 3.4 destroy_agent 时序

```
 flow                                        runtime
  │
  │ ① 流程完成 / 用户取消 / 项目关闭
  │
  │ ② AgentOrchestrator.destroy_agent(backend_tl)
  │
  │ ③ 查 Registry 拿 instance_id=r042
  │
  │ ④ gRPC Shutdown(grace_period=30s) ──────────>
  │                                              │ ⑤ state=SHUTTING_DOWN
  │                                              │    拒绝新 node_execute
  │                                              │    (返回 UNAVAILABLE)
  │                                              │    等当前任务完成
  │                                              │    或 grace 超时强退
  │ <───── ShutdownAck (或超时) ─────────────────┤
  │                                              │
  │ ⑥ RuntimeLauncher.wait_exit(pid, 3s)         │ ⑦ Deregister
  │                                              │    优雅退出 / os._exit(0)
  │    若 3s 内未退出 → SIGKILL ────────────────>
  │                                              ▼
  │ ⑧ Registry 移除 r042
  │    关闭对应 gRPC channel
  ▼
```

### 3.5 崩溃检测与重启

```
 flow                                        runtime
  │                                          │
  │                                          ▼ (panic / OOM / SIGKILL)
  │ ① Heartbeat stream 中断 + 超时 3×interval
  │   或 RuntimeLauncher 检测到 pid 已 exit
  │
  │ ② Registry 标记 state=CRASHED
  │    关闭对应 gRPC channel
  │    归档 instance（保留日志 trace）
  │
  │ ③ 查 agent 元数据 restart_policy
  │    ┌─────────────────────────────────────┐
  │    │ always  → 执行 §3.3 create_agent    │
  │    │ never   → 触发 flow 节点失败处理     │
  │    └─────────────────────────────────────┘
  │
  │ ④ 若重拉：新 instance_id (r042')
  │    restart_count++
  │    超过 max_restarts（默认 3）→ 降级为 never
  ▼
```

### 3.6 flow 崩溃时 runtime 的行为（D6 自杀）

```
 runtime
  │
  │ ① 周期性 Heartbeat RPC 到 flow
  │    每 5s 一次（streaming）
  │
  │ ② 若连续 3 次（15s）发送失败 或 stream 被对端 reset
  │    → 判定 flow 已死
  │
  │ ③ self-terminate：
  │    - 停止接收新 node_execute
  │    - 等当前任务完成（grace 10s）或强退
  │    - os._exit(99) （退出码区分 self-terminate）
  ▼
```

---

## 四、数据结构与接口

### 4.1 flow 内部数据结构（in-memory）

```python
class RuntimeState(Enum):
    STARTING       = "starting"
    READY          = "ready"
    BUSY           = "busy"
    SHUTTING_DOWN  = "shutting_down"
    CRASHED        = "crashed"
    EXITED         = "exited"

class RestartPolicy(Enum):
    ALWAYS = "always"   # 崩溃总是重拉（受 max_restarts 约束）
    NEVER  = "never"    # 崩溃即放弃，由 flow 节点失败处理

@dataclass(frozen=False)
class RuntimeInstance:
    instance_id: str              # r042
    agent_id: str                 # backend_tl
    endpoint: str                 # 127.0.0.1:50142
    pid: int                      # OS 进程号
    state: RuntimeState
    launch_token: str             # 防冒充注册
    start_time: datetime
    last_heartbeat: datetime
    restart_policy: RestartPolicy
    restart_count: int = 0
    max_restarts: int = 3

class AgentEndpointRegistry:
    """仅存在于 flow 进程内，非持久化（Phase 3 可考虑落盘）"""
    _active:   dict[str, RuntimeInstance]   # agent_id → 当前活跃实例
    _archived: list[RuntimeInstance]        # 已退出实例（观测用，带上限）

    def register(self, inst: RuntimeInstance, launch_token: str) -> None: ...
    def deregister(self, instance_id: str) -> None: ...
    def lookup(self, agent_id: str) -> RuntimeInstance | None: ...
    def mark_crashed(self, instance_id: str) -> None: ...
    def update_heartbeat(self, instance_id: str, ts: datetime) -> None: ...
    def snapshot(self) -> list[RuntimeInstance]: ...   # 观测 / 调试用
```

**不变量**：
- 同一 `agent_id` 在 `_active` 中最多存在一条记录
- `launch_token` 仅用于一次 Register 握手，Register 成功后 flow 可丢弃
- `_active` 状态迁移路径必须走状态机（禁止跨状态跳）

### 4.2 core proto 新增/扩展

#### 新增 `RuntimeLifecycleService`（runtime 实现，flow 调用）

```proto
service RuntimeLifecycleService {
  // flow 主动要求 runtime 优雅关闭
  rpc Shutdown(ShutdownRequest) returns (ShutdownResponse);

  // （可选）健康检查
  rpc HealthCheck(HealthCheckRequest) returns (HealthCheckResponse);
}

message ShutdownRequest {
  string instance_id = 1;
  int32  grace_period_seconds = 2;  // 默认 30
  string reason = 3;                 // 记录用
}

message ShutdownResponse {
  bool   accepted = 1;
  string current_task_id = 2;  // 若 BUSY，返回正在执行的任务
}
```

#### 扩展 `FlowCallbackService`（flow 实现，runtime 调用）

```proto
service FlowCallbackService {
  // 已有：
  // rpc SubmitNodeResult(...) returns (...);   // Phase 2 已设计

  // Phase 2B 新增：
  rpc Register(RegisterRequest) returns (RegisterResponse);
  rpc Deregister(DeregisterRequest) returns (DeregisterResponse);
  rpc Heartbeat(stream HeartbeatRequest) returns (stream HeartbeatResponse);
}

message RegisterRequest {
  string instance_id   = 1;
  string agent_id      = 2;
  string endpoint      = 3;  // runtime 的 gRPC 地址
  string launch_token  = 4;  // flow spawn 时下发的令牌
  int32  pid           = 5;
  string runtime_version = 6;
}

message RegisterResponse {
  bool   accepted = 1;
  string reject_reason = 2;  // token 不符 / 重复注册 / 未预期 instance
  int32  heartbeat_interval_seconds = 3;  // flow 要求的心跳周期
}

message HeartbeatRequest {
  string instance_id = 1;
  RuntimeStateEnum state = 2;
  string current_task_id = 3;      // 可选，BUSY 时填
  ResourceUsage usage = 4;         // 可选
  int64  sequence = 5;             // 单调递增
}

message HeartbeatResponse {
  Directive directive = 1;         // 可选下行指令（preempt/drain）
}

enum Directive {
  NONE      = 0;
  DRAIN     = 1;  // flow 建议 runtime 开始停新任务（软关停）
  TERMINATE = 2;  // flow 要求立即 self-terminate（等价 Shutdown）
}
```

#### 扩展 `FlowMessage` / `NodeResult`

```proto
message FlowMessage {
  // 已有字段...
  string runtime_instance_id = N;  // Phase 2 预留，Phase 2B 启用（trace 用）
}
```

### 4.3 RuntimeLauncher 抽象接口

```python
class RuntimeLauncher(Protocol):
    def spawn(
        self,
        agent_id: str,
        grpc_port: int,
        identity: AgentIdentity,
        flow_endpoint: str,
        launch_token: str,
    ) -> SpawnResult:
        """
        阻塞到进程创建成功（不等待 Register）。
        返回 SpawnResult(instance_id, pid)。
        失败抛异常。
        """

    def kill(self, instance_id: str, grace_period_seconds: int) -> None:
        """
        优雅终止：先发 Shutdown RPC，超时则 SIGTERM，再超时则 SIGKILL。
        """

    def wait_exit(self, instance_id: str, timeout_seconds: float) -> int | None:
        """
        等待进程退出，返回 exit_code 或 None（超时）。
        """

    def is_alive(self, instance_id: str) -> bool:
        """
        轻量级检查（os.kill(pid, 0) 或 proc.poll()）。
        """
```

**Phase 2B 唯一实现**：`LocalSubprocessLauncher`（基于 `subprocess.Popen`）。

### 4.4 端口分配策略

```
配置：flow.runtime_port_pool = [50100, 50500]  (区间)

分配算法（简单）：
  - flow 启动时构造 set(50100..50500)
  - spawn 时：随机或顺序取一个未占用端口
  - kill 后：归还端口到池
  - 退出前：持久化占用清单到 flow 工作目录（可选，便于 flow 崩溃重启时快速恢复）

生产容器环境：
  - k8s 场景：Pod 自动分配端口（不走 flow 端口池）
  - 抽象由 RuntimeLauncher 决定（LocalSubprocessLauncher 用端口池，k8s Launcher 用 Pod DNS）
```

### 4.5 launch_token 握手协议

```
目的：防止第三方进程冒充 runtime 向 flow Register

流程：
  1. flow spawn 时生成 token = secrets.token_urlsafe(32)
  2. Registry 占位：_active[agent_id] = RuntimeInstance(state=STARTING, launch_token=token)
  3. 通过命令行 --launch-token=<token> 传给 runtime（或用环境变量 QUARKON_LAUNCH_TOKEN）
  4. runtime Register 时必须在请求中带回 token
  5. flow 校验：token ≡ _active[agent_id].launch_token，否则 reject
  6. Register 成功后 flow 可清空 launch_token 字段（一次性使用）

安全边界：
  - Phase 2B 仅覆盖"同机冒充"威胁（相同 agent_id 的伪 runtime）
  - 跨机场景的鉴权留给 Phase 3 的 mTLS / JWT 方案
```

### 4.6 心跳协议

```
- 方向：runtime → flow（server-streaming RPC）
- 周期：默认 5s（RegisterResponse 中可指定）
- 超时：flow 连续 3 × interval (15s) 未收到 → 判 CRASHED
- 载荷：state + current_task_id + resource_usage + sequence
- 返回：Directive（空/DRAIN/TERMINATE），允许 flow 下发软关停指令
```

---

## 五、模块改动清单

### 5.1 core（Python）

| 文件 | 操作 | 内容 |
|------|------|------|
| `proto/runtime_lifecycle.proto` | 新增 | `RuntimeLifecycleService`（Shutdown / HealthCheck） |
| `proto/flow_callback.proto` | 修改 | 新增 Register / Deregister / Heartbeat RPC |
| `proto/common.proto` | 修改 | 新增 `RuntimeStateEnum` / `Directive` / `ResourceUsage` |
| `proto/flow_message.proto` | 修改 | `FlowMessage` 启用 `runtime_instance_id` 字段（Phase 2 已预留） |
| 生成的 Python stub | 重新生成 | `make proto` |
| 共享数据类 | 新增 | `RuntimeInstance` / `RestartPolicy` / `RuntimeState` 的 dataclass 定义 |
| `design/详细设计.md` | 修改 | §三A 增加 lifecycle service，启用 `runtime_instance_id` |
| `design/实施计划.md` | 修改 | 新增 **阶段 6：runtime lifecycle 契约扩展** |

### 5.2 runtime（Python）

| 文件 | 操作 | 内容 |
|------|------|------|
| 启动参数解析 | 修改 | 强制要求 `--agent-id` + `--instance-id` + `--grpc-port` + `--flow-endpoint` + `--launch-token` |
| `AgentSessionManager` | 删除 | 退化为直接持有一个 `AgentSession` |
| `handlers/create_agent.py` | 删除 | 不再作为消息处理项 |
| `handlers/destroy_agent.py` | 删除 | 同上 |
| `lifecycle/register.py` | 新增 | 启动时向 flow Register，失败则 exit |
| `lifecycle/heartbeat.py` | 新增 | 启动心跳 streaming，处理 DRAIN/TERMINATE 指令 |
| `lifecycle/shutdown.py` | 新增 | 处理 Shutdown RPC + self-terminate（flow 心跳超时） |
| `grpc_server.py` | 修改 | 注册 RuntimeLifecycleService |
| 配置文件 | 简化 | 删除 `agent_pool_size`、`scheduling_*` 等字段 |
| `design/概要设计.md` | 修改 | §1 定位从"单进程承载多 Agent"改为"单进程绑单 Agent" |
| `design/详细设计.md` | 修改 | 新增 §X "生命周期与 supervisor 协议" |
| `design/实施计划.md` | 修改 | 新增 **阶段 8：拓扑改造**（8-A 配置注入 / 8-B lifecycle 客户端 / 8-C 删多 agent 代码） |

### 5.3 flow（Python）

| 文件 | 操作 | 内容 |
|------|------|------|
| `orchestrator/agent_orchestrator.py` | 新增 | `create_agent` / `destroy_agent` / `resolve_endpoint` 的门面 |
| `launcher/base.py` | 新增 | `RuntimeLauncher` 接口（Protocol） |
| `launcher/local_subprocess.py` | 新增 | `LocalSubprocessLauncher` 实现 |
| `registry/endpoint_registry.py` | 新增 | `AgentEndpointRegistry` in-memory 实现 |
| `supervisor/heartbeat_monitor.py` | 新增 | 心跳超时检测 + CRASHED 标记 + restart 触发 |
| `supervisor/port_pool.py` | 新增 | 端口池分配与回收 |
| `callbacks/register.py` | 新增 | 实现 FlowCallbackService.Register / Deregister |
| `callbacks/heartbeat.py` | 新增 | 实现 FlowCallbackService.Heartbeat（streaming） |
| `runtime_client.py` | 修改 | 原单 endpoint → 新 channel pool（keyed by agent_id） |
| `event_loop/node_dispatcher.py` | 修改 | node_execute 前先 `resolve_endpoint(agent_id)` |
| `start_process` 入口 | 修改 | 批量 `create_agent` 并行等 ready，失败则流程拒绝启动 |
| 配置文件 | 新增 | `runtime_port_pool` / `default_restart_policy` / `heartbeat_interval` |
| `design/概要设计.md` | 修改 | §1 组件图新增 AgentOrchestrator / Launcher / Registry / Supervisor |
| `design/详细设计.md` | 修改 | 新增 §X "Agent 生命周期与 Runtime 管理" |
| `design/实施计划.md` | 修改 | 新增 **阶段 7：AgentOrchestrator 与 Launcher**（7-A Registry / 7-B Launcher / 7-C supervisor） |

### 5.4 platform

**零改动**。

### 5.5 infra

| 文件 | 操作 | 内容 |
|------|------|------|
| `deploy/local/start.sh` | 修改 | flow 启动时传入 runtime 二进制路径 + 端口池配置 |
| `Dockerfile.runtime` | 修改 | 镜像支持通过 ENV / CMD 注入单 agent 参数（容器场景预研，非 Phase 2B 交付） |
| `docs/部署手册` | 修改 | 本地开发模式说明：flow 会自动拉起 N 个 runtime 子进程 |

---

## 六、对照原则审视

### 6.1 对照 software_design_principles.md

| 原则 | 审视结论 |
|------|---------|
| SRP | AgentOrchestrator / Launcher / Registry / Supervisor 职责各司其职 ✓ |
| OCP | Launcher 是 Protocol，未来加 Docker/k8s 实现不改核心 ✓ |
| DIP | flow 依赖 `RuntimeLauncher` 抽象而非 `subprocess` 细节 ✓ |
| ISP | Launcher 接口只有 4 个方法，不臃肿 ✓ |
| DRY | node_execute 路由逻辑集中在 endpoint resolver ✓ |
| KISS | in-memory Registry，不引入外部注册中心 ✓ |
| YAGNI | 不做 Warm pool / Docker Launcher / checkpoint（显式不做） ✓ |
| 最小知识 | runtime 不知道其他 runtime 的存在 ✓ |
| 可演进性 | 未来换 k8s Launcher 只需实现 Protocol ✓ |
| 可观测性 | Registry 状态快照可查，instance_id 贯穿 trace ✓ |
| Fail Fast | Register token 不符立即拒绝；max_restarts 超限降级 ✓ |
| 边界校验 | launch_token 握手 + 参数强制注入 ✓ |
| 契约设计 | Shutdown/Register/Heartbeat 前置/后置条件清晰 ✓ |
| 幂等性 | Deregister 幂等；Register 重放被 token 单次校验拒绝 ✓ |

### 6.2 对照 research_design_principles.md

| 原则 | 审视结论 |
|------|---------|
| Orchestrator-Worker | flow 编排，runtime 是 worker ✓ |
| 错误级联防御 | runtime 进程隔离，OOM 不再污染其他 agent ✓ |
| A2A 协议就位 | agent 间通信已跨进程，未来对接 A2A 成本低 ✓ |
| 持久执行 | Phase 2B 不做，显式留 Phase 3（状态持久化） ⚠ |
| OpenTelemetry GenAI | runtime_instance_id 纳入 trace context ✓ |
| W3C Trace Context | flow → runtime 的 gRPC metadata 携带 trace-id ✓ |
| 沙箱加固（arxiv 2603.02277） | Phase 2B 仅进程隔离；cgroup/gVisor 留后 ⚠ |
| 失败模式 checklist（arxiv 2503.13657） | 见 6.3 |

### 6.3 失败模式逐项应对（arxiv 2503.13657）

| 失败模式 | Phase 2B 表现 | 应对 |
|---------|--------------|-----|
| 任务定义不清 | 不变 | N/A（与本方案无关） |
| 角色边界模糊 | runtime 只认一个 agent_id，边界硬 | ✓ |
| 信息丢失 | 跨进程 gRPC 强契约（proto） | ✓ |
| 冲突决策 | 单 supervisor，无并发 spawn 冲突 | ✓ |
| 死锁 | Shutdown 有 grace 超时 + SIGKILL 兜底 | ✓ |
| 过早宣称完成 | NodeResult 仍按 Phase 2 契约 | ✓ |
| 无法检测错误 | 心跳 + 崩溃检测 + exit_code 观测 | ✓ |
| 过度信任 | launch_token 握手 | ✓ |

---

## 七、踩坑点预警

| 坑 | 表现 | 防御 |
|----|------|------|
| **端口泄漏** | runtime 崩溃后端口未归还，池耗尽 | RuntimeLauncher.kill 后强制 wait_exit + 端口归还；flow 启动时扫端口占用做清理 |
| **僵尸进程** | runtime 崩溃未被 flow 感知，pid 成僵尸 | flow 作为父进程必须 `waitpid` 回收；SIGCHLD handler |
| **Register 竞态** | spawn 失败但 runtime 已启动，或 flow 重启后旧 runtime 试图 Register | launch_token 一次性；Registry 中无匹配 token 的 Register 一律拒绝 |
| **心跳抖动** | 偶发网络/GIL 卡顿导致误判 CRASHED | 默认 3 次超时才判死；提供可配 |
| **cold start 放大** | start_process 一次拉 10 个 agent，串行则 30s+ | 批量 spawn 并行化；整体超时可配 |
| **max_restarts 风暴** | 配置错误的 agent 反复崩溃 | 指数退避 + 硬上限 3 次后降级为 never |
| **flow 重启后孤儿 runtime** | flow 崩溃重启，旧 runtime 还在跑 | runtime 心跳失败 self-terminate（D6 决策覆盖） |
| **打包体积** | 每 runtime 都是完整 Python 进程 | 本地开发共享 venv；生产容器基于共享 base image |

---

## 八、实施阶段（Phase 2B）

### 阶段 2B-1：core proto 契约扩展

**产出**：
- `RuntimeLifecycleService` / `FlowCallbackService` 扩展定义
- Python stub 生成
- `RuntimeInstance` 等共享数据类

**完成标准**：core 单测通过；flow / runtime 可 import 新 stub。

### 阶段 2B-2：runtime 单 agent 模式改造

**子阶段**：
- 2B-2-A：启动参数强制注入 + AgentSessionManager 退化为单 slot
- 2B-2-B：Register / Heartbeat / Shutdown 实现
- 2B-2-C：删除 create_agent / destroy_agent 旧 handler

**完成标准**：
- 命令行启动 runtime 能成功向 mock flow Register
- Heartbeat 周期上报
- Shutdown RPC 触发优雅退出

### 阶段 2B-3：flow 编排层改造

**子阶段**：
- 2B-3-A：`AgentEndpointRegistry` + `PortPool`
- 2B-3-B：`LocalSubprocessLauncher` + `AgentOrchestrator`
- 2B-3-C：Supervisor（心跳监控 + 崩溃检测 + restart）
- 2B-3-D：`RuntimeClient` 改 channel pool + endpoint resolver
- 2B-3-E：`start_process` 入口批量 spawn

**完成标准**：
- flow 启动后可自动拉起 N 个 runtime
- flow 关闭时优雅关停所有 runtime
- kill -9 某个 runtime 后 flow 能检测并按策略重拉

### 阶段 2B-4：端到端联调

**验证项**：
- [ ] 单 agent 场景：create → node_execute → destroy 全链路
- [ ] 多 agent 并行：10 个 agent 并行 spawn，总耗时在预期内
- [ ] 崩溃恢复：kill 一个 runtime，restart_policy=always 自动重拉
- [ ] flow 崩溃：kill flow，所有 runtime 自杀（退出码 99）
- [ ] 端口池耗尽：配池大小为 5，尝试 spawn 6 个 → fail fast
- [ ] launch_token 校验：伪造 Register → 拒绝

---

## 九、未决问题（记录，非阻塞）

| # | 问题 | 建议处理时机 |
|---|------|-----------|
| U1 | cold start 延迟如果 > 5s 需要 warm pool 吗 | Phase 2B 联调后评估 |
| U2 | Docker/k8s Launcher 何时落地 | Phase 3 或首个生产部署前 |
| U3 | Agent 记忆 checkpoint 粒度（全量/增量） | Phase 3 专题 |
| U4 | flow 水平扩展（leader election） | Phase 3+ |
| U5 | 跨机场景的鉴权升级（mTLS / JWT） | 首次跨机部署前 |
| U6 | restart_policy 是否需要 exponential backoff 的精细配置 | 实战中调优 |
| U7 | 心跳协议是否需要压缩（agent 多时带宽） | 100+ agent 规模再优化 |

---

## 十、对上游决策文档的影响

本方案完成后，需同步更新：

- `docs/architecture/agent部署拓扑与群组协作讨论.md` 顶部状态：D1 已选方案 A；D3 已定 Phase 2B 单独立项；D4 范围收敛为 flow/runtime/core 三项目
- `docs/architecture/开发路线图与优先级.md` 新增 **Phase 2B** 条目
- `docs/architecture/phase2-grpc升级方案.md` 补"与 Phase 2B 的关系"一节：Phase 2 proto 预留 `runtime_instance_id`；Phase 2 内不启用 Registry 逻辑

---

> **备注**：本设计假设 Phase 2 gRPC 改造已完成。在 Phase 2 编码期间，应为本方案预留 proto 扩展点（`runtime_instance_id` 字段 + service 预留位），避免 Phase 2B 启动时再改契约。
