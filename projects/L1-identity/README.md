# quantalithos-identity

> **仓使命**:身份域服务 —— GlobalMember / Role / Capability 的持久化与生命周期管理。员工档案的单一真相源。  

---

## 仓定位

- **层**:L1 六域服务层
- **同层兄弟**:conversation / work / process / governance / artifact
- **技术栈**:Rust + PostgreSQL + axum + sqlx(ADR-0003)

---

## 主要对齐

- **SPEM 2.0**(RoleDefinition → Role;CapabilityDefinition → Capability)
- **ISO 42001 §5.3 + §A.3**(AI Actor 责任链)
- **ISO 9001 §7.2**(Competence 人力资源视角)
- **双层 Member 模型**(ADR-0004):本仓只管 GlobalMember,ProjectMember 在 work
- **Memory 持久化**(ADR-0006):semantic_memory_ref + episodic_memory_refs 挂本仓

---

## 关键依赖

### 上游
- `quantalithos-core`(proto)
- `quantalithos-bus`(Outbox)
- `quantalithos-method-library`(Role spec_source 同步)
- `quantalithos-observability`(审计事件)
- 外部:PostgreSQL / 向量库(Qdrant / pgvector)

### 下游(订阅本仓事件)
- `quantalithos-work`(career_entry 同步)
- `quantalithos-member-service`(容器启停)
- `quantalithos-conversation`(participants 更新)
- `quantalithos-governance`(AI Actor 责任链)
- `quantalithos-archive`(tombstoned 归档)
- `quantalithos-observability`(全量审计)

---

## 目录结构

```
quantalithos-identity/
├── Cargo.toml
├── src/
│   ├── domain/              聚合根 Rust 代码
│   │   ├── global_member.rs
│   │   ├── role.rs
│   │   ├── capability.rs
│   │   └── events.rs
│   ├── application/         CQRS 用例层
│   ├── infra/               PG / bus / observability 适配
│   ├── rpc/                 gRPC server 实现
│   ├── subscriptions/       跨域事件订阅 handler
│   └── main.rs
├── migrations/              sqlx migration(global_members, roles, career_entries, identity_events_outbox)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── .github/workflows/
```

---

## 构建与测试

```bash
# 单元
cargo test --lib

# 集成(需 PG + NATS)
docker-compose -f docker-compose.test.yml up -d
cargo test --test integration

# E2E
cargo test --test e2e
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` §二.2.1 ID 条目:

- **ID1** GlobalMember 是聚合根,ProjectMember 在 work 域,不反向依赖
- **ID2** Role 定义是 method-library 的索引(只存引用)
- **ID3** semantic_memory 外部化,本仓只存 ref
- **ID4** 生命周期状态机单向
- **ID5** career_history 只 append
- **ID6** 发布事件对齐 domain README §4
- **ID7** Rust + PG + axum + sqlx 栈

**15 条不变量(INV-1 到 INV-15)** 必须在代码 + 测试中覆盖(详见 `domain/identity/README.md` §2.1.3 和 §2.2.3)。

---

## 详细设计参考

- `domain/identity/README.md`(1130 行权威)
- `architecture/adr/0003-identity-rust-stack.md`
- `architecture/adr/0004-global-vs-project-member.md`
- `architecture/adr/0006-memory-persistence-in-identity.md`
- `architecture/proto-draft/identity/v1/identity_service.proto`

---

## 开放问题

见 `domain/identity/README.md` §十 Q1-Q6(Memory 归属细化 / Role 升级扩散 / tombstone 延迟期 / Capability 标准化 / 同名 UI / Assistant 特殊性)。

---

## 性能目标

- Availability ≥ 99.9%
- P95 读 < 50ms / 写 < 200ms
- Outbox 发布延迟 P95 < 5s
- 支撑 10w 活跃 Member × 50w career entry
