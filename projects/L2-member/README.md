# quantalithos-member

> **仓使命**:Member Process(Rust 门面进程),AI 员工容器内的**"嘴耳"**。6 子模块负责入站筛选 + 出站代笔,不做决策。  

---

## 仓定位

- **层**:L2 Member 运行层
- **同层兄弟**:runtime / tools / member-images / member-service
- **技术栈**:Rust(无 GC + 容器内门面对低内存友好)
- **运行位置**:容器内进程(与 Runtime 进程并列,supervisord 管理)

---

## 主要对齐

- **CloudEvents 1.0 + W3C Trace Context**(事件订阅 / 发布)
- **AG-UI 17 事件**(通过 bus 转 conversation 推送)
- **Research Prompt Injection 组合防御**(Attention 子模块)
- **ISO 42001 §A.3**(责任链的运行时载体)
- **ADR-0005**(按 Role 预构建镜像,launch_token)

---

## 六子模块(B1-B6)

```
Member Process
├─ B1 Identity           launch_token + member_id + role 身份卡
├─ B2 Event Subscriber   订阅 bus,入站过滤
├─ B3 Event Publisher    出站 CloudEvents 发布
├─ B4 External RPC       对 member-service 的 gRPC(:50143)
├─ B5 Attention          优先级判定 + Prompt Injection 预过滤
└─ B6 IPC Bridge         容器内 UDS gRPC(连 Runtime)
```

详见 `architecture/ai-member设计.md` §三。

---

## 关键依赖

### 上游
- `quantalithos-core`(proto)
- `quantalithos-bus`(发布/订阅)
- 外部:bus 后端(NATS / Redis / Kafka)

### 下游
- `quantalithos-runtime`(容器内 Runtime 通过 UDS 连 B6 IPC)
- `quantalithos-member-service`(通过 B4 RPC 注册 / 心跳)

---

## 目录结构

```
quantalithos-member/
├── Cargo.toml
├── src/
│   ├── identity/           B1:launch_token + 身份卡
│   ├── subscriber/         B2:订阅过滤
│   ├── publisher/          B3:事件发布
│   ├── external_rpc/       B4:gRPC server
│   ├── attention/          B5:Prompt Injection 预过滤
│   ├── ipc_bridge/         B6:UDS gRPC
│   └── main.rs             supervisord 启动入口
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` MB 条目:
- **MB1** launch_token 校验(短时 JWT)
- **MB2** Attention 做 Prompt Injection 预过滤
- **MB3** Event Publisher 只发 CloudEvents
- **MB4** IPC 用 UDS,不监听外部网络
- **MB5** 崩溃被 supervisord 捕获,不静默死

---

## 详细设计参考

- `architecture/ai-member设计.md` §三(最权威,6 子模块详细设计)
- `architecture/adr/0005-member-image-per-role.md`

---

## 开放问题

参考 `architecture/ai-member设计.md` §十一(共 6 个)。

---

## 构建与测试

```bash
cargo build --release
cargo test --workspace

# 容器构建(docker image)需要通过 member-images 仓
```

---

## 性能

- 事件订阅到 Attention 过滤延迟 P95 < 20ms
- Event Publisher 到 bus 成功 P95 < 50ms
- Heartbeat 响应 < 5ms
