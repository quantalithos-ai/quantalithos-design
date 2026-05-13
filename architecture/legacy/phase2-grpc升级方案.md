# Phase 2 gRPC 升级方案

> ⚠️ **状态：Phase 2 runtime 相关部分已跳过（2026-05-07）**  
>
> 经讨论（决策 Q1），Phase 2 的 runtime ↔ flow gRPC 改造**直接跳过**，进入 **Phase 2B Member 容器化**。
> 理由：Phase 2B 后旧 runtime 归档重写，Phase 2 的 runtime gRPC 代码将成短命代码。
>
> **权威架构**：[Member 容器化架构设计](./member-container-architecture.md)
>
> **本文的保留价值**：
> - Phase 2 的 proto 拆分思路（runtime/ / flow/ / common/ 分目录）被 Phase 2B 继承
> - 流式传输、强类型契约、跨服务 trace 等通用 gRPC 最佳实践仍适用
> - 作为"HTTP → gRPC 决策过程"的历史记录
>
> **已失效内容**：
> - ✗ runtime HTTP → gRPC 直接替换（runtime 本身将被重写）
> - ✗ Phase 2 → Phase 2B 顺序推进（改为跳过 Phase 2 runtime 部分）
> - ✗ RuntimeService / FlowCallbackService 的 Phase 2 版本定义（Phase 2B 按 Member 架构重新定义）

---

> 将 runtime ↔ flow 的通信从 HTTP + JSON 升级为 gRPC + Protobuf。
> 决策：proto 放 core 仓库、按职责拆两个服务、启用 server streaming、直接替换旧 HTTP。

> **与 Phase 2B 的关系（2026-05-06 补充，已过时）**：
> ~~Phase 2 **不涉及**部署拓扑改造，仍按 `1 flow : 1 runtime : N agents` 前提推进。~~
> ~~Phase 2B（[单 runtime 单 agent 落地设计](./单runtime单agent落地设计.md)）是 Phase 2 之后的独立阶段。~~
>
> **2026-05-07 更新**：Phase 2B 改为 Member 容器化方案（详见顶部），Phase 2 runtime 部分跳过。

---

## 一、改造范围和非范围

### 改造范围（Phase 2）

| 改造项 | 影响项目 |
|--------|---------|
| 新增 proto 文件 | quantalithos-core |
| 新增 gRPC server（RuntimeService） | quantalithos-runtime |
| 新增 gRPC server（FlowCallbackService） | quantalithos-flow |
| 新增 gRPC client（调用 runtime） | quantalithos-flow |
| 新增 gRPC client（调用 flow） | quantalithos-runtime |
| 移除 HTTP messages 路由 | runtime（api/server.py）、flow（daemon/http_api.py） |
| Docker Compose 端口调整 | quantalithos-infra |

### 不改造（保持 HTTP）

- gate → platform/runtime/flow 的转发保持 HTTP（gate 本身是 HTTP 网关）
- platform 所有 HTTP API 保持不变
- sandbox HTTP API 保持不变
- chat/console 通过 gate 访问后端，协议不变

**为什么只升级 runtime↔flow**：这是唯一高频、长耗时、需要流式的通道。其他跨服务调用（如 flow→platform 拉事件）是简单 CRUD，REST 更直观。

---

## 二、proto 定义（放 quantalithos-core/proto/）

### 目录结构

```
quantalithos-core/
├── proto/
│   ├── common/
│   │   ├── flow_message.proto    # FlowMessage、FlowMessageType
│   │   ├── payloads.proto        # NodeExecutePayload、ChatMessagePayload 等
│   │   ├── node_result.proto     # NodeResult、NodeResultType
│   │   └── agent_events.proto    # AgentEvent（用于 server streaming）
│   ├── runtime/
│   │   └── runtime_service.proto # RuntimeService
│   └── flow/
│       └── flow_callback.proto   # FlowCallbackService
├── python/src/quantalithos_core/
│   ├── protocol/                 # 旧 Pydantic 模型（保留一段时间）
│   └── grpc/                     # 生成的 gRPC 代码（通过 buf 生成）
│       ├── __init__.py
│       ├── common_pb2.py
│       ├── common_pb2_grpc.py
│       ├── runtime_service_pb2.py
│       ├── runtime_service_pb2_grpc.py
│       └── ...
└── buf.yaml                      # proto 构建配置
```

### flow_message.proto 核心定义

```proto
syntax = "proto3";
package quantalithos.core.common;

import "google/protobuf/timestamp.proto";
import "google/protobuf/any.proto";

enum FlowMessageType {
  FLOW_MESSAGE_TYPE_UNSPECIFIED = 0;
  AGENT_CREATE   = 1;
  AGENT_DESTROY  = 2;
  AGENT_SUSPEND  = 3;
  AGENT_RESUME   = 4;
  NODE_EXECUTE   = 5;
  NODE_CANCEL    = 6;
  CHAT_MESSAGE   = 7;
}

message FlowMessage {
  string message_id = 1;
  FlowMessageType type = 2;
  string agent_id = 3;
  string project_id = 4;
  google.protobuf.Any payload = 5;      // oneof 的替代：payload 是具体类型
  google.protobuf.Timestamp created_at = 6;
}
```

### payloads.proto（每种 payload 独立消息）

```proto
syntax = "proto3";
package quantalithos.core.common;

import "google/protobuf/struct.proto";

message NodeExecutePayload {
  string process_instance_id = 1;
  google.protobuf.Struct node = 2;               // 保留 JSON-like 结构
  string control_level = 3;                      // "free" | "guided" | "enforced"
  google.protobuf.Struct process_definition = 4; // 可选
  repeated string input_refs = 5;
  repeated string allowed_tools = 6;
  google.protobuf.Struct output_schema = 7;
  repeated string suspicion_hints = 8;
}

message NodeCancelPayload {
  string process_instance_id = 1;
  string node_id = 2;
  string reason = 3;
}

message ChatMessagePayload {
  string sender_id = 1;
  string content = 2;
  repeated string mentions = 3;
  google.protobuf.Struct reply_to = 4;
}

message AgentCreatePayload {
  string role_id = 1;
  string project_id = 2;
}

message AgentDestroyPayload {
  string reason = 1;
}
```

### node_result.proto

```proto
syntax = "proto3";
package quantalithos.core.common;

import "google/protobuf/struct.proto";

enum NodeResultType {
  NODE_RESULT_TYPE_UNSPECIFIED = 0;
  COMPLETED = 1;
  BLOCKED = 2;
  FAILED = 3;
}

message NodeResult {
  string message_id = 1;
  string agent_id = 2;
  NodeResultType result_type = 3;
  google.protobuf.Struct output = 4;
  string reason = 5;
  string reasoning_trace = 6;
}
```

### runtime_service.proto — RuntimeService（flow 调用）

```proto
syntax = "proto3";
package quantalithos.runtime.v1;

import "common/flow_message.proto";
import "common/payloads.proto";
import "common/agent_events.proto";
import "google/protobuf/empty.proto";

service RuntimeService {
  // ── Agent 生命周期 ──
  rpc CreateAgent(CreateAgentRequest) returns (CreateAgentResponse);
  rpc DestroyAgent(DestroyAgentRequest) returns (google.protobuf.Empty);
  rpc SuspendAgent(SuspendAgentRequest) returns (google.protobuf.Empty);
  rpc ResumeAgent(ResumeAgentRequest) returns (google.protobuf.Empty);
  
  // ── 节点执行 ──
  // 异步语义：立即返回 dispatched，真正结果通过 FlowCallbackService.ReportNodeResult 上报
  rpc DispatchNodeExecution(DispatchNodeExecutionRequest) returns (DispatchAck);
  rpc CancelNodeExecution(CancelNodeExecutionRequest) returns (google.protobuf.Empty);
  
  // ── 群聊消息 ──
  rpc DeliverChatMessage(DeliverChatMessageRequest) returns (DeliverChatMessageAck);
  
  // ── 观测（server streaming）──
  // 订阅某个 Agent 的执行事件流：LLM 每轮的开始/结束、工具调用、状态栈变化
  rpc WatchAgentEvents(WatchAgentEventsRequest) returns (stream AgentEvent);
  
  // ── 查询 ──
  rpc GetAgent(GetAgentRequest) returns (Agent);
  rpc ListAgents(ListAgentsRequest) returns (ListAgentsResponse);
  rpc GetTrace(GetTraceRequest) returns (ExecutionTrace);
  
  // ── 健康检查（遵循 grpc-health-checking 标准）──
  // 使用标准 grpc.health.v1.Health 服务（proto 无需自定义）
}

message CreateAgentRequest {
  string message_id = 1;
  string agent_id = 2;
  string project_id = 3;
  quantalithos.core.common.AgentCreatePayload payload = 4;
}

message CreateAgentResponse {
  string agent_id = 1;
  string status = 2;  // "created" | "already_exists"
}

message DispatchNodeExecutionRequest {
  string message_id = 1;
  string agent_id = 2;
  string project_id = 3;
  quantalithos.core.common.NodeExecutePayload payload = 4;
}

message DispatchAck {
  string message_id = 1;
  string agent_id = 2;
  string status = 3;  // "dispatched"
}

// ...其他 request/response 省略
```

### flow_callback.proto — FlowCallbackService（runtime 调用）

```proto
syntax = "proto3";
package quantalithos.flow.v1;

import "common/node_result.proto";
import "common/agent_events.proto";
import "google/protobuf/empty.proto";

service FlowCallbackService {
  // ── 节点执行结果上报 ──
  rpc ReportNodeResult(ReportNodeResultRequest) returns (ReportNodeResultResponse);
  
  // ── Agent 事件上报（client streaming，runtime 推送执行过程给 flow）──
  // 用于让 flow 把 think-act 中间过程转发给 chat UI
  rpc StreamAgentEvents(stream quantalithos.core.common.AgentEvent) 
    returns (StreamAgentEventsResponse);
}

message ReportNodeResultRequest {
  quantalithos.core.common.NodeResult result = 1;
}

message ReportNodeResultResponse {
  string status = 1;  // "accepted" | "duplicate"
}

message StreamAgentEventsResponse {
  int32 events_received = 1;
}
```

### agent_events.proto（用于 streaming）

```proto
syntax = "proto3";
package quantalithos.core.common;

import "google/protobuf/timestamp.proto";
import "google/protobuf/struct.proto";

message AgentEvent {
  string event_id = 1;
  string agent_id = 2;
  string project_id = 3;
  string message_id = 4;          // 关联的 node_execute message_id
  google.protobuf.Timestamp timestamp = 5;
  
  oneof event {
    RunStarted       run_started        = 10;
    RunFinished      run_finished       = 11;
    LlmCallStart     llm_call_start     = 12;
    LlmCallFinished  llm_call_finished  = 13;
    ToolCallStart    tool_call_start    = 14;
    ToolCallFinished tool_call_finished = 15;
    StateChanged     state_changed      = 16;
    ErrorOccurred    error_occurred     = 17;
  }
}

message RunStarted   { string node_id = 1; string control_level = 2; }
message RunFinished  { string result_type = 1; int64 duration_ms = 2; }
message LlmCallStart { int32 round = 1; string model = 2; }
message LlmCallFinished {
  int32 round = 1;
  int32 input_tokens = 2;
  int32 output_tokens = 3;
  bool has_tool_calls = 4;
}
message ToolCallStart    { string tool = 1; string arguments_summary = 2; }
message ToolCallFinished { string tool = 1; bool success = 2; string error = 3; }
message StateChanged     { string from_state = 1; string to_state = 2; }
message ErrorOccurred    { string error_type = 1; string message = 2; }
```

---

## 三、服务端实现

### quantalithos-runtime 侧

```
quantalithos_runtime/
├── api/
│   ├── server.py              # 旧 FastAPI（保留 /health 和观测 HTTP API）
│   └── grpc_server.py         # 新增：grpc server for RuntimeService
├── engine/
│   └── main_loop.py           # 保持不变（核心业务逻辑）
├── infra/
│   ├── flow_client.py         # 改：用 grpc stub 替代 httpx
│   └── grpc_handlers/         # 新增：各 RPC 方法的 servicer 实现
│       ├── __init__.py
│       ├── lifecycle_handler.py  # CreateAgent/DestroyAgent/Suspend/Resume
│       ├── execute_handler.py    # DispatchNodeExecution/CancelNodeExecution
│       ├── chat_handler.py       # DeliverChatMessage
│       ├── query_handler.py      # GetAgent/ListAgents/GetTrace
│       └── watch_handler.py      # WatchAgentEvents (server streaming)
└── main.py                    # 同时启动 grpc server 和 HTTP server
```

**grpc_server.py 核心骨架：**

```python
# api/grpc_server.py
import grpc.aio
from quantalithos_core.grpc import runtime_service_pb2_grpc
from quantalithos_runtime.infra.grpc_handlers import RuntimeServicer

async def serve_grpc(main_loop: MainLoop, host: str, port: int):
    """启动 gRPC 服务器，注册 RuntimeService。"""
    server = grpc.aio.server(
        options=[
            ("grpc.max_send_message_length", 50 * 1024 * 1024),
            ("grpc.max_receive_message_length", 50 * 1024 * 1024),
            ("grpc.keepalive_time_ms", 30_000),
            ("grpc.keepalive_timeout_ms", 10_000),
        ]
    )
    servicer = RuntimeServicer(main_loop=main_loop)
    runtime_service_pb2_grpc.add_RuntimeServiceServicer_to_server(servicer, server)
    
    # 添加标准 gRPC 健康检查
    from grpc_health.v1 import health, health_pb2_grpc
    health_servicer = health.HealthServicer()
    health_pb2_grpc.add_HealthServicer_to_server(health_servicer, server)
    health_servicer.set("", health_pb2.HealthCheckResponse.SERVING)
    health_servicer.set("quantalithos.runtime.v1.RuntimeService", 
                        health_pb2.HealthCheckResponse.SERVING)
    
    server.add_insecure_port(f"{host}:{port}")
    await server.start()
    await server.wait_for_termination()
```

**execute_handler.py（核心，异步回调模式不变）：**

```python
# infra/grpc_handlers/execute_handler.py

class ExecuteHandler:
    async def DispatchNodeExecution(
        self,
        request: DispatchNodeExecutionRequest,
        context: grpc.aio.ServicerContext,
    ) -> DispatchAck:
        """立即返回 dispatched ACK，后台执行。"""
        agent = self.main_loop.agent_pool.get(request.agent_id)
        if agent is None:
            await context.abort(grpc.StatusCode.NOT_FOUND, f"Agent {request.agent_id} not found")
        
        if agent.current_state is StackState.EXECUTING:
            await context.abort(grpc.StatusCode.ALREADY_EXISTS, "Agent busy")
        
        # 复用现有的 handle_node_execute 逻辑（push frame + create_task）
        # 唯一区别：不再通过 POST /messages 接收，而是直接从 gRPC request 解包
        await self.main_loop.dispatch_node_execution(
            message_id=request.message_id,
            agent=agent,
            payload=request.payload,
        )
        
        return DispatchAck(
            message_id=request.message_id,
            agent_id=request.agent_id,
            status="dispatched",
        )
```

**watch_handler.py（server streaming，核心新能力）：**

```python
# infra/grpc_handlers/watch_handler.py

class WatchHandler:
    async def WatchAgentEvents(
        self,
        request: WatchAgentEventsRequest,
        context: grpc.aio.ServicerContext,
    ) -> AsyncIterator[AgentEvent]:
        """订阅某 Agent 的事件流。
        
        事件源：MainLoop 内部的 AgentEventHub（新增组件），think-act 循环中
        的每一个重要时刻都会 publish 一个 AgentEvent。
        
        客户端（flow 或 chat）订阅后会持续收到事件，直到客户端断开或 Agent 消失。
        """
        agent_id = request.agent_id
        async for event in self.main_loop.event_hub.subscribe(agent_id):
            if context.cancelled():
                break
            yield event
```

### quantalithos-flow 侧

```
quantalithos_flow/
├── daemon/
│   ├── http_api.py            # 保留（health + state 查询 HTTP API）
│   ├── grpc_server.py         # 新增：FlowCallbackService gRPC server
│   └── event_loop.py          # 保持不变
├── infra/
│   ├── runtime_client.py      # 改：用 grpc stub
│   └── grpc_handlers/
│       ├── callback_handler.py    # ReportNodeResult
│       └── event_stream_handler.py # StreamAgentEvents
└── main.py                    # 同时启动 HTTP 和 grpc
```

**runtime_client.py 的变化：**

```python
# infra/runtime_client.py

class RuntimeClient:
    def __init__(self, grpc_channel: grpc.aio.Channel):
        self.channel = grpc_channel
        self.stub = runtime_service_pb2_grpc.RuntimeServiceStub(channel)
    
    async def dispatch_node_execute(
        self, 
        agent_id: str, 
        project_id: str,
        payload: NodeExecutePayload,
        message_id: str,
    ) -> DispatchAck:
        request = DispatchNodeExecutionRequest(
            message_id=message_id,
            agent_id=agent_id,
            project_id=project_id,
            payload=payload,
        )
        return await self.stub.DispatchNodeExecution(
            request,
            timeout=10.0,  # 只等 ACK，很快
        )
    
    async def watch_agent_events(self, agent_id: str) -> AsyncIterator[AgentEvent]:
        """订阅 Agent 事件（server streaming）。"""
        request = WatchAgentEventsRequest(agent_id=agent_id)
        async for event in self.stub.WatchAgentEvents(request):
            yield event
```

**FlowCallbackService 回调端点：**

```python
# daemon/grpc_handlers/callback_handler.py

class FlowCallbackServicer:
    async def ReportNodeResult(
        self,
        request: ReportNodeResultRequest,
        context: grpc.aio.ServicerContext,
    ) -> ReportNodeResultResponse:
        result = request.result
        
        # 幂等检查（和当前 HTTP 端点一致）
        existing = self.state.pending_messages.get(result.message_id)
        if existing is None:
            await context.abort(grpc.StatusCode.NOT_FOUND, "Unknown message_id")
        if existing != "dispatched":
            return ReportNodeResultResponse(status="duplicate")
        
        await self.event_loop.handle_node_result(
            NodeResult.from_proto(result)  # proto → domain model
        )
        return ReportNodeResultResponse(status="accepted")
```

---

## 四、Docker Compose 调整

```yaml
# docker-compose.yml
services:
  runtime:
    ports:
      - "8003:8003"      # HTTP（health + 观测）
      - "50051:50051"    # gRPC（RuntimeService）
  
  flow:
    ports:
      - "8002:8002"      # HTTP（health + state 查询）
      - "50052:50052"    # gRPC（FlowCallbackService）
```

**端口规划：**
- 50051 → runtime gRPC
- 50052 → flow gRPC
- 8003/8002 保留，仅用于 health 和状态查询（轻量 HTTP）

---

## 五、迁移步骤（时间估算）

### Stage 1: Proto 与工具链（1-2 天）

| 任务 | 工作量 |
|------|--------|
| 在 core 仓库创建 `proto/` 目录和所有 .proto 文件 | 4 小时 |
| 配置 buf（`buf.yaml` + `buf.gen.yaml`）或 grpc_tools 生成器 | 2 小时 |
| 生成 Python 代码并加入 `quantalithos_core.grpc` | 2 小时 |
| 补充单元测试验证 proto 序列化/反序列化 | 4 小时 |
| 提交：`feat(core): add gRPC proto definitions and codegen` | — |

### Stage 2: runtime gRPC server（2-3 天）

| 任务 | 工作量 |
|------|--------|
| 新增 `api/grpc_server.py` + `main.py` 同时启动 gRPC | 4 小时 |
| 实现 lifecycle_handler（Create/Destroy/Suspend/Resume） | 4 小时 |
| 实现 execute_handler（DispatchNodeExecution + Cancel） | 6 小时 |
| 实现 chat_handler | 2 小时 |
| 实现 query_handler（GetAgent/ListAgents/GetTrace） | 3 小时 |
| 实现 watch_handler + MainLoop 内的 AgentEventHub | 8 小时 |
| 补充单元测试（覆盖自测计划 P0 场景） | 6 小时 |
| 提交：`feat(runtime): add gRPC RuntimeService implementation` | — |

### Stage 3: flow gRPC client + callback server（2-3 天）

| 任务 | 工作量 |
|------|--------|
| 改写 `RuntimeClient` 用 gRPC stub | 4 小时 |
| 新增 `daemon/grpc_server.py` + FlowCallbackService | 4 小时 |
| 实现 ReportNodeResult handler（幂等检查） | 2 小时 |
| 实现 StreamAgentEvents（可选，Phase 2.5） | 6 小时 |
| 改写 `flow_engine.py` 中的 dispatch 调用 | 3 小时 |
| 补充单元测试 | 6 小时 |
| 提交：`feat(flow): migrate runtime communication to gRPC` | — |

### Stage 4: runtime → flow 回调切换（1 天）

| 任务 | 工作量 |
|------|--------|
| runtime 的 `FlowClient` 改用 grpc stub | 3 小时 |
| 删除 runtime 的 `httpx.AsyncClient` 和相关 HTTP 回调代码 | 2 小时 |
| 联调：runtime 后台任务完成后能 ReportNodeResult 成功 | 3 小时 |
| 提交：`feat(runtime): switch flow callback to gRPC` | — |

### Stage 5: 清理旧 HTTP 路由（1 天）

| 任务 | 工作量 |
|------|--------|
| 删除 runtime `POST /messages`（api/server.py 只保留 health） | 1 小时 |
| 删除 flow `POST /internal/runtime/results` + `POST /internal/node-results` | 1 小时 |
| 调整 Docker Compose 新增 gRPC 端口 | 30 分钟 |
| 联调全流程验证 | 4 小时 |
| 更新文档（概要设计/详细设计的 §接口章节） | 3 小时 |
| 提交：`feat(runtime/flow): remove legacy HTTP messaging endpoints` | — |

### Stage 6: 集成验证（1 天）

| 任务 | 工作量 |
|------|--------|
| 端到端联调：创建项目 → flow 调度 → runtime 执行 → 回调 → 推进 | 4 小时 |
| 验证 server streaming（WatchAgentEvents）能被 flow 订阅 | 3 小时 |
| 压测：100 并发 node_execute | 2 小时 |
| 文档更新 + Phase 2 验收报告 | 3 小时 |

**总计：8-11 人天**

---

## 六、风险与回滚

| 风险 | 应对 |
|------|------|
| grpcio 和 asyncio 结合有学习曲线 | 使用 `grpc.aio` 而不是同步 grpc；参考 grpc-python 官方示例 |
| proto 改动后兼容性 | 遵循 protobuf 兼容规则（只加字段、字段号不变） |
| streaming 长连接穿越 NAT 可能掉 | 开启 keepalive（30s/10s）；客户端自动重连 |
| 观测能力暂时缺失 | 新增 gRPC interceptor 做结构化日志（替代 uvicorn 访问日志） |
| 协议迁移期间旧客户端调用 | 直接替换，不提供 HTTP fallback；所有调用方一次升级 |

**回滚策略：** 如果 Stage 2/3/4 中任一 Stage 出现阻塞问题，回退到前一个 Stage 的 commit，保持旧 HTTP 通道可用。只有 Stage 5 是"不可逆"点。

---

## 七、Phase 2 验收标准

- [ ] runtime 和 flow 的 Python 单元测试全部通过
- [ ] runtime 暴露 gRPC 端口 50051，`grpc-health-probe` 可通
- [ ] flow 暴露 gRPC 端口 50052，`grpc-health-probe` 可通
- [ ] 旧 HTTP `/messages` 和 `/internal/runtime/results` 路由已删除
- [ ] Docker Compose 启动后，端到端 node_execute 流程跑通
- [ ] flow 的 `WatchAgentEvents` 能收到 runtime 的实时事件
- [ ] 观测：grpc interceptor 日志清晰显示每个 RPC 的耗时、状态码
- [ ] 设计文档更新（runtime/flow 的 §接口定义章节全部改为 gRPC）

---

## 八、不做的事

- **不引入 gRPC-Web 或 gRPC-Gateway** — chat/console 保持通过 gate（HTTP）访问
- **不强制 TLS** — Phase 2 内部网络信任，Phase 3 再做 mTLS
- **不用 Envoy/linkerd 做 service mesh** — Docker Compose 足够
- **不引入 protobuf binary wire format 以外的东西**（如 Cap'n Proto / FlatBuffers）

---

## 九、缺口补全：Agent 主动动作 + 事件流聚合

### 9.1 缺口 1：Agent 主动动作 RPC

**场景：** Agent 在 think-act 循环中主动发起的协作动作（ask_teammate、send_chat_message、request_gate），这些动作需要 flow 第一时间感知以做编排决策。

**设计原则：** 区分两类动作

| 动作类型 | 走哪里 | 理由 |
|---------|-------|------|
| 纯数据 CRUD（工单状态、产物上传） | 直连 platform HTTP | 无需编排协调，写入即完成 |
| **跨 Agent 协作** | **走 flow gRPC** | flow 要立即知道，记录 Agent 挂起状态 |
| **阶段推进信号**（request_gate） | **走 flow gRPC** | flow 是 BPMN 状态机守门人 |
| 状态查询 | 直连 platform HTTP | 只读 |

### 9.2 缺口 5：事件流聚合

**场景：** gate/chat/console 需要观察 think-act 过程（流式推送），当前每个服务都要自己连 runtime 订阅，runtime 负担重且权限难控。

**设计原则：** flow 作为**事件聚合器** — runtime 只把事件推给 flow，其他服务订阅 flow。

```
runtime ──StreamAgentEvents──> flow ──SubscribeProjectEvents──> gate/chat/console
           (单条推送流)          (多路复用/权限过滤/回放)
```

### 9.3 proto 新增定义

#### FlowCallbackService 扩展（runtime → flow）

```proto
// proto/flow/flow_callback.proto
service FlowCallbackService {
  // ── 已有 ──
  rpc ReportNodeResult(ReportNodeResultRequest) returns (ReportNodeResultResponse);
  rpc StreamAgentEvents(stream AgentEvent) returns (StreamAgentEventsResponse);
  
  // ── 新增：Agent 主动协作动作 ──
  // 询问另一个 Agent，asker 会被 flow 标记为挂起等待回复
  rpc AskTeammate(AskTeammateRequest) returns (AskTeammateAck);
  
  // 主动向项目群聊发消息（不期望回复）
  rpc SendChatMessage(SendChatMessageRequest) returns (SendChatMessageAck);
  
  // 请求创建门禁节点（Agent 认为需要用户确认）
  rpc RequestGate(RequestGateRequest) returns (RequestGateAck);
}

message AskTeammateRequest {
  string project_id = 1;
  string ask_id = 2;                 // tool_call_id，用于匹配回复
  string asker_agent_id = 3;
  string teammate_agent_id = 4;
  string question = 5;
  int32 timeout_secs = 6;            // 超时（默认 300s）
}

message AskTeammateAck {
  string ask_id = 1;
  string status = 2;                 // accepted | teammate_busy | teammate_missing | project_paused
}

message SendChatMessageRequest {
  string project_id = 1;
  string sender_agent_id = 2;
  string content = 3;
  repeated string mentions = 4;      // 可选 @ 列表
}

message SendChatMessageAck {
  string message_id = 1;             // flow 分配的消息 ID
  string status = 2;
}

message RequestGateRequest {
  string project_id = 1;
  string requester_agent_id = 2;
  string process_instance_id = 3;
  string reason = 4;                 // Agent 解释为什么需要人工审批
  google.protobuf.Struct context = 5; // 决策依据（产物链接、风险提示等）
}

message RequestGateAck {
  string gate_id = 1;                // flow 创建的门禁 ID
  string status = 2;                 // created | rejected | pending_approval
}
```

#### RuntimeService 扩展（flow → runtime）

```proto
// proto/runtime/runtime_service.proto
service RuntimeService {
  // ── 已有 ──
  rpc CreateAgent(...) returns (...);
  rpc DispatchNodeExecution(...) returns (...);
  rpc WatchAgentEvents(WatchAgentEventsRequest) returns (stream AgentEvent);
  // ...
  
  // ── 新增：心跳与连接元数据（缺口 2，顺带做）──
  rpc Heartbeat(HeartbeatRequest) returns (HeartbeatResponse);
}

message HeartbeatRequest {
  string flow_instance_id = 1;       // flow 自己的运行实例 ID（重启后变化）
  google.protobuf.Timestamp sent_at = 2;
}

message HeartbeatResponse {
  string runtime_instance_id = 1;    // runtime 自己的实例 ID
  int32 active_agent_count = 2;
  int32 pending_task_count = 3;
  google.protobuf.Timestamp received_at = 4;
}
```

#### FlowService 新增（flow 对外开放 — 缺口 5）

```proto
// proto/flow/flow_service.proto（新增文件）
//
// flow 作为事件聚合中心对外开放的订阅服务。
// 订阅方：gate（推给 WebSocket）、console（后台观测）、未来的 UI。
// 这个服务是 flow 暴露给 gate 侧的，不是 runtime 调的。

service FlowService {
  // 订阅某项目的所有事件（AgentEvent + 门禁事件 + 阶段推进事件）
  rpc SubscribeProjectEvents(SubscribeProjectEventsRequest) returns (stream ProjectEvent);
  
  // 历史回放（比如用户刚打开页面时拉取最近 100 条）
  rpc ReplayProjectEvents(ReplayProjectEventsRequest) returns (ReplayProjectEventsResponse);
}

message SubscribeProjectEventsRequest {
  string project_id = 1;
  repeated string event_kinds = 2;   // 可选过滤，空=全部
  string cursor = 3;                 // 续订游标，空=只推新事件
}

message ProjectEvent {
  string event_id = 1;
  string project_id = 2;
  google.protobuf.Timestamp timestamp = 3;
  
  oneof kind {
    quantalithos.core.common.AgentEvent    agent_event      = 10;
    GateRequestedEvent                      gate_requested   = 11;
    GateRespondedEvent                      gate_responded   = 12;
    StageAdvancedEvent                      stage_advanced   = 13;
    NodeResultEvent                         node_result      = 14;
    ChatMessageEvent                        chat_message     = 15;
  }
}

// 各事件类型省略...
```

### 9.4 本阶段不做但保留设计

- **Agent → flow 通过 gRPC 订阅任务队列**：Phase 3 考虑，当前仍由 flow 主动 Dispatch
- **多 runtime 实例的负载均衡**：Phase 3 引入 runtime 注册表 + routing
- **gRPC-Web 网关**：Phase 3 如果 chat 要直连 flow 事件流再做

### 9.5 业务流程覆盖矩阵（补全后）

| 业务场景 | RPC 路径 |
|---------|---------|
| 项目创建 | gate→platform HTTP（不变） |
| flow 感知新项目 | flow→platform HTTP 轮询事件（不变） |
| flow 启动子流程 → 创建 Agent | **flow→runtime `CreateAgent`** |
| flow 调度节点 | **flow→runtime `DispatchNodeExecution`** |
| runtime 执行完成 | **runtime→flow `ReportNodeResult`** |
| runtime 推送中间事件 | **runtime→flow `StreamAgentEvents`** |
| **Agent 问队友** | **runtime→flow `AskTeammate`** ← 新增 |
| **Agent 发群聊消息** | **runtime→flow `SendChatMessage`** ← 新增 |
| **Agent 请求门禁** | **runtime→flow `RequestGate`** ← 新增 |
| 用户审批门禁 | chat→gate→flow HTTP `/gates/:id/respond`（不变，是用户触发） |
| chat 订阅项目事件 | **gate→flow `SubscribeProjectEvents`** ← 新增 |
| Agent 读写工单 | runtime→platform HTTP（不变，纯数据 CRUD） |
| Agent 上传产物 | runtime→platform HTTP（不变） |
| Agent 执行 sandbox 命令 | runtime→sandbox HTTP（不变） |
| 心跳 | **flow→runtime `Heartbeat`** ← 新增 |

### 9.6 时间估算调整

原方案 8-11 人天，新增 3 个 Agent 主动动作 RPC + 1 个聚合 FlowService：

| 新增任务 | 工作量 |
|---------|--------|
| proto 补充 Agent 主动动作 + FlowService | 4 小时 |
| flow 实现 AskTeammate/SendChatMessage/RequestGate handler | 8 小时 |
| runtime 改写 comm_ops 工具调用 flow RPC | 6 小时 |
| flow 实现事件聚合与 SubscribeProjectEvents | 10 小时 |
| gate 改造为订阅 flow 事件流 → WebSocket（Phase 2.5） | 8 小时 |
| 测试补充 | 6 小时 |

**调整后总计：10-13 人天**
