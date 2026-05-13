# quantalithos-member-service

> **仓使命**:容器编排服务 —— 管理所有 AI Member 容器的启停 / 心跳 / 健康 / 身份注册。L2 的"**编排大脑**",容器外部运行。  

---

## 仓定位

- **层**:L2 Member 运行层
- **运行位置**:容器外(k8s Pod / Docker Compose 服务 / 单机 binary)
- **技术栈**:Rust + PostgreSQL(与 identity 同栈,便于共享 crate)

---

## 主要对齐

- **ISO 42001 §A.6 AI System Life Cycle**(Deployment + Operation 阶段)
- **ADR-0004**(管理 ProjectMember 的容器,不管 GlobalMember)
- **ADR-0005**(查 Role.image_variant 拉镜像)
- **ISO 9001 §7.1 Resources**(容器资源编排)

---

## 核心组件

```
member-service
├─ Orchestrator 抽象       Docker / k8s / 本地 binary 三种后端
├─ Endpoint Registry       member_id → <container_ip>:<port>
├─ Heartbeat Monitor       心跳检测 + 重启策略
├─ Policy Proxy            订阅 governance.policy.updated,下发到容器
├─ Identity Cache          订阅 identity 事件,本地缓存 Member / Role 视图
├─ Role → Image 映射        method-library 查 RoleDefinition.image_variant
├─ Container Launcher      docker run / k8s create pod
├─ Graceful Lifecycle      启停 / 升级 / 迁移 / 清理
└─ ResolveMemberForContainer  一次性拉全 Role + Capability + Memory ref(调 identity)
```

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus` / `quantalithos-sdk`(Rust)
- `quantalithos-identity`(ResolveMemberForContainer RPC)
- `quantalithos-method-library`(Role spec_source + image_variant)
- `quantalithos-member-images`(拉取镜像)
- `quantalithos-governance`(订阅 policy)
- 外部:Docker daemon / k8s API / 容器 registry

### 下游
- 被 `quantalithos-work` 调用(ProjectMember 分配时启动容器)
- 被 `quantalithos-console` 调用(管理员查看容器状态)
- 被 `quantalithos-chat` 调用(用户登录员工)

---

## 目录结构

```
quantalithos-member-service/
├── Cargo.toml
├── src/
│   ├── orchestrator/       Docker / k8s / local binary 抽象
│   ├── registry/           Endpoint Registry(PG + 内存 cache)
│   ├── heartbeat/
│   ├── policy_proxy/
│   ├── identity_cache/
│   ├── launcher/
│   ├── rpc/                对外 + 对内容器的 RPC
│   └── main.rs
├── migrations/             endpoints / heartbeats / active_members
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` MS 条目:
- **MS1** Orchestrator 抽象支持至少 Docker + k8s
- **MS2** 容器启停发事件进 observability
- **MS3** 多租户下 PID / Network / FS 隔离
- **MS4** 订阅 identity 最终一致(秒级延迟可接受)
- **MS5** Role → image_variant 映射来自 method-library,不 hardcode

---

## 详细设计参考

- `architecture/ai-member设计.md` §5.3
- ADR-0003 / 0004 / 0005

---

## 崩溃 / 重启策略

- 心跳 30 秒 × 连续 3 次失败 → 标记 crashed
- 容器保留 10 分钟做 forensic 后删除
- 重启重新签发 launch_token(不重用)
- 重启后 Runtime 从 Checkpoint 恢复

---

## 运维

**生产默认**:k8s StatefulSet + PG HA + 多区域

**关键告警**:
- Crashed 容器数 > 阈值 → major
- Role image 拉取失败 → major
- Identity Cache 同步延迟 > 5min → warning
- Policy 下发延迟 > 30s → major

---

## 性能

- StartMember P95 < 5s(不含镜像拉取)
- 单实例并发管理容器数 ≥ 500
- Heartbeat 处理 QPS ≥ 500
