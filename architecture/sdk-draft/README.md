# sdk-draft — SDK 仓草案

> **文档定位**:Quantalithos A 方案段 3 第三件产出 —— `quantalithos-sdk` 仓的**三语言(Python / Rust / TypeScript)客户端库**设计态草案。
>
> **最终归属**:本草案在段 3 末迁入 `quantalithos-sdk` 独立仓。
>
> **上游依据**:
> - `architecture/proto-draft/README.md`(类型与 RPC 契约来源)
> - `architecture/bus-draft/README.md`(bus 抽象)
> - `architecture/仓库拆分方案.md` §3.3 `quantalithos-sdk`
> - `standards/子项目遵循规范清单.md` SK1-SK7
> - `architecture/标准对齐全景图.md` §一 sdk 仓对齐
> - ADR-0003 / 0004 / 0005 / 0006 / 0007(运行时行为约束)
> - Research MCP / OTel GenAI
>
> **下游承接**:
> - 所有端侧产品(Chat / Runner / Sync / Console / Bridges)通过 sdk 连 Server
> - 第三方 / 企业内部开发者的集成
> - L2 Member runtime 的 python sdk 依赖
> - Marketplace 的 publisher CLI

---

## 一、使命与定位

### 1.1 使命

**让一切客户端连 Server 都走同一套 API**。sdk 是 Quantalithos 的**开放能力入口**和**内部统一接入层**:

- 所有 L5 UI 产品内部走 sdk
- 所有第三方集成走 sdk
- 所有 L2 Member runtime 的业务调用走 sdk
- 自动化测试、运维脚本、评测工具走 sdk

### 1.2 边界(不做的事)

- **不做 UI 组件**(UI 在各端侧产品)
- **不做身份管理**(OAuth 供应商集成在外部,sdk 只消费 token)
- **不做本地缓存策略**(调用方决定)
- **不做重 state 管理**(高层状态管理由调用方)
- **不做 server 端业务**(sdk 是客户端,不是 embedded server)

### 1.3 三语言定位

| 语言 | 主要消费者 | 特色 |
|---|---|---|
| **Python** | L2 runtime / 数据科学 / AI 工程 / 运维脚本 / CLI 工具 / Bridges | 最贴近 AI 生态 |
| **Rust** | L5 桌面 (Tauri) / 高性能 client / L2 member(可选调用) / 运维工具 | 零成本抽象 + 跨平台嵌入 |
| **TypeScript** | Chat 前端 / Console / Website / Node.js bridge | 前端事实标准 |

### 1.4 三语言独立发版 + 版本号同步

对齐 `子项目遵循规范清单.md` SK1:
- 三语言**独立发版**(各自 crates.io / PyPI / npm)
- 版本号**同步**:Server / AI Members / SDK 三者 major.minor 一致
- patch 可各语言独立迭代(bugfix 不等齐)

---

## 二、仓内组织

### 2.1 目录结构

```
quantalithos-sdk/
├── README.md
├── versions.toml                      三语言版本聚合声明(CI 校验同步)
├── proto-ref.toml                     指向 core proto 的版本锁
│
├── codegen/                           buf 生成脚本
│   ├── buf.yaml
│   ├── buf.gen.python.yaml
│   ├── buf.gen.rust.yaml
│   ├── buf.gen.typescript.yaml
│   ├── gen.sh                         一键三语言生成
│   └── Makefile
│
├── sdk-python/                        Python SDK
│   ├── pyproject.toml
│   ├── src/quantalithos_sdk/
│   │   ├── _generated/                (git-ignored,buf 生成)
│   │   ├── client.py                  高层 Client
│   │   ├── events.py                  事件订阅封装
│   │   ├── auth.py                    认证
│   │   ├── tracing.py                 OTel 集成
│   │   ├── mcp.py                     MCP Client 内置
│   │   ├── retry.py                   重试策略
│   │   ├── config.py                  配置加载
│   │   └── domains/                   六域高层 API
│   │       ├── identity.py
│   │       ├── conversation.py
│   │       ├── work.py
│   │       ├── process.py
│   │       ├── governance.py
│   │       └── artifact.py
│   ├── tests/
│   └── README.md
│
├── sdk-rust/
│   ├── Cargo.toml                     workspace
│   ├── crates/
│   │   ├── quantalithos-sdk/          主 crate
│   │   ├── quantalithos-sdk-codegen/  (生成产物,publish 时包含)
│   │   ├── quantalithos-sdk-auth/
│   │   ├── quantalithos-sdk-mcp/
│   │   └── quantalithos-sdk-tracing/
│   └── README.md
│
├── sdk-typescript/
│   ├── package.json
│   ├── pnpm-workspace.yaml            monorepo
│   ├── packages/
│   │   ├── sdk-core/                  @quantalithos/sdk-core(类型 + client)
│   │   ├── sdk-events/                @quantalithos/sdk-events(AG-UI 17 封装)
│   │   ├── sdk-auth/
│   │   └── sdk-mcp/
│   └── README.md
│
├── examples/                          跨语言示例(有对应的测试)
│   ├── python/
│   │   ├── hire_member.py
│   │   ├── subscribe_gate_events.py
│   │   └── project_lifecycle.py
│   ├── rust/
│   │   ├── hire_member.rs
│   │   └── ...
│   └── typescript/
│       ├── hire_member.ts
│       └── ...
│
└── docs/
    ├── quickstart-python.md
    ├── quickstart-rust.md
    ├── quickstart-typescript.md
    ├── authentication.md
    ├── events-subscription.md
    ├── mcp-integration.md
    ├── error-handling.md
    ├── migration-guides/
    │   ├── v1-to-v2.md                 (future)
    │   └── deprecations.md
    └── api-reference/                  (从生成的代码派生)
```

---

## 三、从 proto 到 binding 的链路

### 3.1 buf 驱动生成

`proto-ref.toml` 锁定 core proto 的版本:

```toml
[source]
# 指向 quantalithos-core 仓的具体 tag / commit
core_repo = "github.com/quantalithos/quantalithos-core"
core_version = "v1.2.3"
# 或本地路径(开发时)
core_local_path = "../quantalithos-core"
```

`codegen/buf.gen.python.yaml`(示例):

```yaml
version: v2
plugins:
  - remote: buf.build/protocolbuffers/python
    out: sdk-python/src/quantalithos_sdk/_generated
  - remote: buf.build/grpc/python
    out: sdk-python/src/quantalithos_sdk/_generated
  - remote: buf.build/community/python-pyi
    out: sdk-python/src/quantalithos_sdk/_generated
```

### 3.2 一键生成命令

```bash
# 从 core 拉 proto + 生成三语言 binding
./codegen/gen.sh --version v1.2.3

# 或开发时用本地 core
./codegen/gen.sh --local
```

### 3.3 CI 流水线

```
1. core proto 新 tag 发布
   └─ 触发 sdk CI
      │
      ├─ 拉新版 proto
      ├─ 生成三语言 binding
      ├─ 三语言 lint + test
      ├─ breaking change 检测(buf breaking)
      │  └─ 若 breaking + 无 v2 路径 → CI fail
      ├─ 构建三语言包
      └─ 发布到 PyPI / crates.io / npm
```

### 3.4 类型不手写原则

对齐 `子项目遵循规范清单.md` SK2:

- 所有 proto 派生类型由 buf 生成,**不手写**
- 手写代码在高层 domain API(domains/ 下),包装生成的 stub

### 3.5 生成产物的处理

- **Python**:生成到 `_generated/`,在 git-ignore;发包时包含
- **Rust**:`crates/quantalithos-sdk-codegen/` 作为 workspace crate;CI 生成后提交(rust 生态习惯)或 build.rs 生成(可选)
- **TypeScript**:`packages/sdk-core/src/_generated/`,发 npm 时打包

---

## 四、高层 Client API(Python 示例)

### 4.1 Client 初始化

```python
from quantalithos_sdk import QuantalithosClient, Config

client = QuantalithosClient(
    config=Config(
        server_endpoint="https://api.quantalithos.example.com",
        auth=AuthMethod.oauth2(
            client_id="...",
            client_secret="...",
        ),
        # 或 mTLS
        # auth=AuthMethod.mtls(cert_path="...", key_path="..."),
        # 或 API key(开发用)
        # auth=AuthMethod.api_key("qtl_sk_..."),
        tenant_id="acme-corp",  # 多租户
        retry_policy=RetryPolicy.default(),
        tracing=TracingConfig.otel(endpoint="..."),
    ),
)
```

### 4.2 六域高层 API(类型安全 + 自文档)

```python
# 身份域
member = await client.identity.hire_member(
    name="Marcus",
    role_id="tech-lead",
    profile="...",
    initial_capabilities=[
        Capability(id="python-3.12", level=4),
        Capability(id="code-review", level=5, evidence_refs=[...]),
    ],
)
await client.identity.activate_member(
    member.member_id,
    approval_gate_id=gate_id,
)

# 工作域
project = await client.work.create_project(
    owner_user_id=alice_id,
    title="读书博客项目",
    description="...",
    context_of_use=ContextOfUse(
        target_users=[UserProfile(persona="self_use")],
        deployment_env=DeploymentEnv(kind="self_hosted"),
        compliance_profile=["gdpr"],
    ),
)

# 过程域
instance = await client.process.start_instance(
    project_id=project.project_id,
    profile_id=profile_id,
    kickoff_gate_id=kickoff_gate_id,
)

# 治理域
gate = await client.governance.raise_gate(
    kind=GateKind.REQUIREMENTS_CONFIRM,
    project_id=project.project_id,
    trigger=...,
    decision_request=...,
    candidate_options=[
        CandidateOption(id="approve", ...),
        CandidateOption(id="reject", ...),
    ],
    # ... 六段式
)

# 制品域
artifact = await client.artifact.create_artifact(
    project_id=project.project_id,
    kind=ArtifactKind.REQUIREMENT,
    title="读书博客需求 v0.1",
    content_ref=ContentRef.s3(uri="s3://...", hash="..."),
    quality_tags=["Functional Suitability", "Usability"],
)
```

### 4.3 错误处理

```python
try:
    await client.governance.decide_gate(gate_id, "approve", rationale="...")
except QuantalithosError as e:
    if e.code == ErrorCode.GOVERNANCE_INCOMPLETE_SIX_SEGMENTS:
        # 六段缺失(INV-4),不重试,提示用户
        log.error(f"Gate {gate_id} incomplete: {e.violating_invariant}")
    elif e.code == ErrorCode.ERROR_VERSION_CONFLICT:
        # 乐观锁冲突,重新读取后重试
        ...
    elif e.retryable:
        # 基础设施可重试错误,client 自动处理(默认)
        raise
    else:
        raise
```

`QuantalithosError` 映射 `common/v1/errors.proto` 的 `ErrorCode` enum + `ErrorDetails`。

### 4.4 事务 / 原子性语义

sdk 不提供"跨域事务"—— 跨域是最终一致(六域模型 §2.2)。但提供:

- **单域多操作的 idempotency_key**:同一 key 重试返回相同结果
- **乐观锁版本**:写操作携带 expected_version

---

## 五、事件订阅封装

### 5.1 高层订阅 API(Python)

```python
# 订阅特定事件
@client.events.on("governance.gate.decided")
async def handle_gate_decided(event: GovernanceGateDecidedEvent):
    # event 已自动反序列化为 typed 对象
    # trace 自动传播(当前 span 作为父)
    # 去重自动处理(LRU)
    await do_something(event.gate_id, event.chosen_option_id)

# 订阅多个类型
subscription = await client.events.subscribe(
    type_patterns=["work.project.*", "work.workitem.state_changed"],
    project_id=current_project_id,
    consumer_group="my-service.work-watcher",
    start_from=StartPosition.LATEST,
)

async for delivery in subscription:
    try:
        await handle(delivery.event)
        await delivery.ack()
    except Exception as e:
        await delivery.nack(reason=str(e))
```

### 5.2 装饰器模式

`@client.events.on(...)` 自动:
- 启动后台 worker 订阅
- 去重(LRU 默认 10000)
- trace 上下文传播
- 失败自动 nack + retry 按默认策略

### 5.3 实时流(AG-UI 17 事件,Chat 场景)

```typescript
// TypeScript Chat 场景
import { createConversationStream } from "@quantalithos/sdk-events";

const stream = createConversationStream(client, {
  conversationId: groupId,
  lastEventId: savedLastEventId,  // 断点续传
});

for await (const aguiEvent of stream) {
  // AG-UI 17 事件类型判别
  switch (aguiEvent.eventType) {
    case AGUIEventType.MESSAGE_CONTENT:
      renderMessage(aguiEvent.messageContent);
      break;
    case AGUIEventType.QUANTALITHOS_GATE_RAISED:
      renderGateCard(aguiEvent.custom);
      break;
    // ...
  }
  saveLastEventId(aguiEvent.eventId);  // 断点续传用
}
```

---

## 六、认证

### 6.1 支持的认证方式

| 方式 | 场景 | 强度 |
|---|---|---|
| **OAuth2(Authorization Code + PKCE)** | 最终用户(Chat / Console 等) | 高 |
| **OAuth2 Client Credentials** | 机器对机器(后端服务 / Bridges) | 高 |
| **mTLS** | 内部服务间 | 最高 |
| **API Key** | 开发 / 脚本 / 测试 | 中(有限 scope) |
| **Launch Token(JWT,short-lived)** | L2 Member 容器内调用 | 专用 |

### 6.2 AuthMethod API

```python
# OAuth2 User flow(Chat 用)
auth = AuthMethod.oauth2_user(
    client_id="chat-web-client",
    redirect_uri="quantalithos://callback",
    scopes=["project:read", "gate:decide"],
)
await auth.authenticate_interactive()  # 触发浏览器登录

# Client Credentials(后端服务)
auth = AuthMethod.oauth2_client(
    client_id="backend-service",
    client_secret=get_from_vault("..."),
    scopes=["tenant:*:*"],
)

# mTLS
auth = AuthMethod.mtls(
    cert_path="/etc/quantalithos/certs/service.crt",
    key_path="/etc/quantalithos/certs/service.key",
    ca_path="/etc/quantalithos/certs/ca.crt",
)

# Launch Token(L2 Member 容器内)
auth = AuthMethod.launch_token(
    token=os.environ["LAUNCH_TOKEN"],
)
```

### 6.3 Token 管理

- 访问 token 过期自动刷新(refresh token 流)
- Launch Token 即将过期时通过 member-service Heartbeat 续签
- Token 存内存,**不写磁盘**(子项目清单 MB1)

### 6.4 Scope 约定

Scope 字符串:`<resource>:<action>` 或 `tenant:<tenant>:<resource>:<action>`。典型:
- `project:read` / `project:create` / `project:archive`
- `gate:decide` / `gate:raise`
- `artifact:read` / `artifact:approve`
- `tenant:acme:*:*`(某租户全权限)

---

## 七、MCP Client 内置能力

对齐 `子项目遵循规范清单.md` SK6。sdk 内置 MCP Client,方便开发者构建 MCP-aware 工具。

### 7.1 MCP Tool 发现与调用

```python
# 列出当前租户 capability-hub 白名单中的 MCP Tool
tools = await client.mcp.list_tools()

# 调用某个 MCP Tool
result = await client.mcp.call_tool(
    tool_name="image_generation",
    arguments={"prompt": "a cat", "size": "1024x1024"},
)
```

### 7.2 MCP Tool 消费遵守 Policy

- 所有 MCP 调用通过 capability-hub 代理
- capability-hub 做白名单 + policy 校验 + 成本记账
- sdk 的 `client.mcp.call_tool` 自动带 Actor / Trace / policy_check

### 7.3 A2A(Agent-to-Agent)集成

```python
# 向其他组织的外部 Agent 发起 A2A 调用
response = await client.a2a.call_remote_agent(
    target_agent_uri="agent://external.example.com/qa-specialist",
    task_description="...",
    input_artifacts=[...],
)
```

同样走 capability-hub 代理 + Policy 校验。

---

## 八、OTel Trace 自动传播

### 8.1 集成方式

```python
client = QuantalithosClient(config=Config(
    tracing=TracingConfig.otel(
        endpoint="http://otel-collector:4317",
        service_name="chat-web-client",
        additional_attributes={"app_version": "1.2.3"},
    ),
))
```

### 8.2 自动传播

- 每个 RPC 调用自动创建 span `quantalithos.<domain>.<method>`
- 每个事件订阅处理自动创建 span,`traceparent` 从 event 提取
- LLM 调用(MCP 转发到 Anthropic / OpenAI)自动记 OTel GenAI 语义属性

### 8.3 trace 属性

标准属性:
- `rpc.system = "grpc"`
- `rpc.service = "quantalithos.identity.v1.IdentityService"`
- `rpc.method = "HireMember"`
- `quantalithos.actor.id` / `quantalithos.actor.kind`
- `quantalithos.project_id` / `quantalithos.tenant_id`
- `quantalithos.trace_id`(聚合根链条)

---

## 九、重试与退避

### 9.1 默认策略

```python
class RetryPolicy:
    max_attempts: int = 3
    initial_backoff: Duration = 200ms
    max_backoff: Duration = 5s
    backoff_multiplier: float = 2.0
    retryable_codes: Set[ErrorCode] = {
        ERROR_UNAVAILABLE,
        ERROR_DEADLINE_EXCEEDED,
        ERROR_RESOURCE_EXHAUSTED,
        ERROR_ABORTED,
        # 不重试:INVALID_ARGUMENT / NOT_FOUND / PERMISSION_DENIED / FAILED_PRECONDITION
    }
```

### 9.2 Idempotency-Aware 重试

- 写操作自动带 `idempotency_key`(UUID 或用户指定)
- server 端按 key 去重,重试安全
- 不会因网络抖动重复创建聚合根

### 9.3 用户自定义

```python
# 覆盖默认策略
result = await client.work.create_project(
    ...,
    _retry=RetryPolicy(max_attempts=10, initial_backoff="1s"),
)
```

---

## 十、配置加载

### 10.1 加载顺序(从低到高覆盖)

1. **内置默认值**
2. **配置文件**(`~/.quantalithos/config.yaml` 或 `./quantalithos.yaml`)
3. **环境变量**(`QUANTALITHOS_*` 前缀)
4. **代码传入**(Config 构造器)

### 10.2 配置文件示例

```yaml
server:
  endpoint: https://api.quantalithos.example.com
  tls:
    verify: true
    ca_cert: /etc/quantalithos/ca.crt

auth:
  method: oauth2_user
  client_id: ...
  # client_secret: from env QUANTALITHOS_AUTH_CLIENT_SECRET

tenant_id: acme-corp

tracing:
  endpoint: http://otel-collector:4317
  service_name: chat-web-client

retry:
  max_attempts: 3
  initial_backoff: 200ms
```

### 10.3 敏感值处理

- `client_secret` / API key 等永不从配置文件读;必须 env var / secret manager
- 配置加载时检测到明文敏感值 → 警告

---

## 十一、Deprecation 与迁移

### 11.1 Deprecation 策略

对齐 `子项目遵循规范清单.md` SK7:
- Deprecated API **至少保留 2 个 minor 过渡期**
- Deprecation 标记在代码(Python `@deprecated` / Rust `#[deprecated]` / TypeScript JSDoc)
- 运行时日志每次调用打印一次 warning
- Migration guide 写 `docs/migration-guides/`

### 11.2 Breaking Change 流程

1. 开 v2 路径(`proto/v2`)
2. sdk 同时支持 v1 和 v2(两套 client API)
3. 发 deprecation warning 给 v1
4. 至少 2 个 minor 后移除 v1
5. breaking change 本身必须 ADR(SK3)

### 11.3 Migration Guide 模板

```
# v1 → v2 Migration

## Breaking Changes
- `create_project(...)` 签名变化:`compliance_profile` 从 string 变 Vec<string>

## Before
  project = client.work.create_project(
      compliance_profile="gdpr",
  )

## After
  project = client.work.create_project(
      compliance_profile=["gdpr"],
  )

## Timeline
- v1.8.0(2026-05-01):v2 API 可用
- v1.10.0(2026-07-01):v1 API 标记 deprecated
- v2.0.0(2026-09-01):v1 API 移除
```

---

## 十二、测试策略

### 12.1 单元测试

- 每 SDK 仓内部覆盖率 ≥ 80%
- 核心:Client / EventSub / Auth / Retry / Config 加载

### 12.2 集成测试

- 针对 In-memory bus 后端的 mock server
- 所有 RPC 路径 smoke test
- 事件订阅完整流(subscribe → publish → deliver → ack)

### 12.3 跨语言兼容测试

每次 proto 更新,运行:

```
examples/python/hire_member.py    # 发布
examples/typescript/subscribe_member.ts  # 订阅
examples/rust/hire_member.rs       # 同样操作验证
```

三语言互操作必须**结果一致**。

### 12.4 示例即测试

`examples/<lang>/*.py|rs|ts` 每个都有对应的 test case,CI 运行。示例失效 = SDK 失效。

---

## 十三、性能目标

| 指标 | 目标 |
|---|---|
| Client 初始化(含 auth) | < 1s |
| 单 RPC P95 延迟(含网络) | < 100ms(内网)/ < 300ms(公网) |
| 事件订阅 delivery 处理吞吐 | > 1000 msg/s(Python)/ 10k msg/s(Rust) |
| binding 代码生成时间 | < 60s(三语言合计) |
| 三语言 binary / wheel / npm 打包大小 | Python < 5MB / Rust < 10MB / TS < 2MB |

---

## 十四、与 UI 产品的集成范式

### 14.1 Chat 前端(TypeScript)

```
sdk-typescript(@quantalithos/sdk-core + sdk-events)
    ↓
Chat 业务逻辑
    ↓
React / Svelte 组件
```

### 14.2 Console(TypeScript)

同 Chat,但多消费 observability / governance 数据。

### 14.3 Runner / Sync(Rust via Tauri 或 CLI)

```
sdk-rust
    ↓
Runner / Sync 业务
    ↓
Tauri 前端(如有 GUI)
```

### 14.4 L2 Member runtime(Python)

```
sdk-python
    ↓
Runtime 业务逻辑
    ↓
L2 Member Process(Rust)通过 IPC 调用
```

### 14.5 Bridges(Python / TypeScript)

```
sdk-python / sdk-typescript
    ↓
Bridges 的平台适配(Mattermost/Telegram/Slack/Discord)
    ↓
各平台 SDK
```

---

## 十五、安全考虑

### 15.1 敏感字段过滤

- 日志 / trace 自动 redact 敏感字段(token / secret / PII)
- 默认列表:`secret` / `password` / `token` / `key` / `credential` / `ssn`

### 15.2 依赖安全

- CI 跑依赖安全扫描(Snyk / GitHub Advanced Security / pip-audit / cargo-audit / npm audit)
- 依赖必须 pinned(`子项目遵循规范清单.md` R11)
- License 合规:禁用 GPL 类强传染 license

### 15.3 代码签名

发布到包注册表时:
- Rust crate:用 cargo-sigstore 签名
- Python wheel:用 PyPI sigstore 签名
- npm package:用 provenance attestation(npm 原生支持)

---

## 十六、开放问题

### Q1. 三语言同时发还是异步发

**背景**:CI 触发后三语言并行构建,但某语言失败时其他是否阻塞发版?

**候选**:
- A 任一失败全部阻塞(强一致)
- B 某语言失败独立 hotfix(弱一致)

**倾向**:A(保持版本同步纪律)

**推进**:段 3 末 CI 设计时决策。

### Q2. L2 runtime 的 sdk 依赖是否与外部 SDK 相同

**背景**:L2 runtime 内部调用六域服务,用 sdk-python 是否合适(可能需要内部性能优化)?

**候选**:
- A 一样用 sdk-python(一致)
- B 单独 `sdk-internal-python`(性能定制)
- C sdk 提供 `advanced` mode 同时满足两者

**倾向**:A 起步

**推进**:性能压测后看。

### Q3. GraphQL / REST gateway 的地位

**背景**:sdk 主协议是 gRPC。外部集成是否需要 REST / GraphQL?

**候选**:
- A 只做 gRPC
- B 额外 REST gateway(通过 grpc-gateway 自动生成)
- C REST + GraphQL

**倾向**:B(grpc-gateway 低成本)

**推进**:Marketplace / 第三方集成场景触发时。

### Q4. Binding 自动生成后的手工补丁

**背景**:某些方法在特定语言需要特定包装(如 Python 的 async / TypeScript 的 Promise)。

**候选**:
- A 零手工补丁(纯 binding)
- B 允许手工补丁但必须声明(patch file + CI 校验)
- C 直接手写高层 API(domains/ 下)

**倾向**:C(domains/ 本来就是手写)

**推进**:原型阶段。

### Q5. AG-UI 事件的 TypeScript 类型是否来自 sdk

**背景**:Chat 前端消费 AG-UI 17 事件,类型从 sdk 来还是从 AG-UI 规范原生 npm 包来?

**候选**:
- A 都从 sdk(封闭生态)
- B 从 @copilotkit/runtime 等 AG-UI 官方包(开放生态)
- C sdk re-export AG-UI 官方类型(兼容)

**倾向**:C

**推进**:Chat 开发阶段。

### Q6. Binding 之外是否提供 REPL / playground

**背景**:开发者想快速试,不愿写整个 app。

**候选**:
- A 不提供(用 Python REPL / jupyter / TS playground)
- B 提供 `quantalithos-cli` 带 REPL 模式
- C Web playground(在 Website 上嵌入)

**倾向**:B 起步,C 作为 Website 增强

**推进**:Marketing 阶段。

---

## 十七、与下游文档的关系

### 17.1 本草案与 `quantalithos-sdk` 仓 README(段 3 末)

```
architecture/sdk-draft/README.md(本文)     ↔    quantalithos-sdk 仓
─────────────────────────────                    ──────────────────
§二 仓内组织                                     顶层目录结构
§三 codegen                                      codegen/
§四 高层 Client API                               sdk-<lang>/src/client.*
§五 事件订阅封装                                  sdk-<lang>/src/events.*
§六 认证                                         sdk-<lang>/src/auth.*
§七 MCP                                          sdk-<lang>/src/mcp.*
§八 Tracing                                      sdk-<lang>/src/tracing.*
§九-§十 重试 / 配置                               sdk-<lang>/src/retry.* / config.*
§十一 Deprecation                                docs/migration-guides/
§十二 测试                                        tests/
```

### 17.2 与 core / bus 的依赖

```
quantalithos-sdk
    │
    │ 依赖 proto binding
    ▼
quantalithos-core(proto + CloudEvents schema)
    │
    │ 事件流经过
    ▼
quantalithos-bus(通过 sdk 暴露高层订阅封装)
```

sdk 不直接 link bus 实现,只对接 bus 的 wire protocol(通过 gRPC / NATS client 等)。

### 17.3 与端侧产品的关系

所有端侧产品**必须通过 sdk 连 Server**,不允许绕过(`产品遵循规范清单.md` C1)。

### 17.4 修订纪律

- 公共 API 的 breaking 修改必须 ADR + v2 路径
- Auth 方式新增 non-breaking
- 跨三语言的 API 风格差异(async/await / Future / Promise)由各语言惯例决定,不强求一致
- 性能目标修改不需要 ADR

---

## 十八、总结

本草案把 sdk 仓从"26 仓之一"展开到"可以实施"的程度。关键产出:

1. **三语言独立发版 + 版本号同步** 机制
2. **从 proto 自动生成 binding** 的完整链路(buf-driven)
3. **高层 Client API**(六域友好)+ 事件订阅封装
4. **五种认证方式** + Token 生命周期
5. **MCP Client + A2A** 内置支持
6. **OTel Trace 自动传播** + 跨服务链路完整
7. **Deprecation 策略**(2 个 minor 过渡 + migration guide)
8. **安全基线**(redaction / 依赖扫描 / 签名)
9. **6 个开放问题** 覆盖 CI / 内部 vs 外部 / REST gateway / 手工补丁 / AG-UI / playground

**关键承诺**:

- 所有端侧 + 内部 runtime 走同一套 sdk
- 类型不手写(proto 派生)
- Breaking change 必须有过渡期 + ADR
- OTel 自动传播,无需调用方操心
- 敏感值永不入磁盘 / 日志

---

## 附录 A:快速开始速查

### Python

```python
from quantalithos_sdk import QuantalithosClient, Config, AuthMethod

client = QuantalithosClient(Config(
    server_endpoint="...",
    auth=AuthMethod.oauth2_user(...),
))

project = await client.work.create_project(title="...", ...)
```

### Rust

```rust
use quantalithos_sdk::{Client, Config, AuthMethod};

let client = Client::new(Config {
    server_endpoint: "...".into(),
    auth: AuthMethod::OAuth2User { .. },
    ..Default::default()
}).await?;

let project = client.work().create_project(CreateProjectRequest { .. }).await?;
```

### TypeScript

```typescript
import { QuantalithosClient, OAuth2User } from "@quantalithos/sdk-core";

const client = new QuantalithosClient({
  serverEndpoint: "...",
  auth: OAuth2User.interactive({ clientId: "..." }),
});

const project = await client.work.createProject({ title: "...", ... });
```

---

## 附录 B:设计原则审视

| 原则 | 本草案体现 |
|---|---|
| SRP | sdk 只做 client,不做 server / 业务 |
| OCP | codegen + domains/ 双层:底层自动生成,高层手写可扩展 |
| DIP | 高层 API 依赖 proto 抽象,不绑具体传输层 |
| DRY | 类型 proto 派生,不手写 |
| KISS | 默认配置就能跑,进阶选项可选 |
| YAGNI | REPL / GraphQL 等留开放问题不先实现 |
| 最小知识 | sdk 不解析业务语义,只包装 RPC |
| 不可变优先 | 请求 / 响应结构 proto 生成,只读 |
| 幂等性 | idempotency_key 自动 |
| 可观察性 | OTel 自动传播 |

---

## 附录 C:订正标记

- [ ] §3.1 buf 配置的具体远程插件 tag 待 CI 建立后锁定
- [ ] §四 Python 示例的精确类型名待 proto 生成后确认
- [ ] §6.4 Scope 约定的具体清单待认证服务选型后定稿
- [ ] §十三 性能目标待原型压测后校准
- [ ] §Q1-Q6 开放问题各自在对应阶段推进

---

> 本草案是段 3 第三件产出。L0 层(core / bus / sdk)三件至此全部完成。与 proto-draft 和 bus-draft 互为兄弟,构成 Quantalithos 的**最稳定依赖层**。段 3 末迁入 `quantalithos-sdk` 独立仓。
