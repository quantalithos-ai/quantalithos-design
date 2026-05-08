# ADR-0003:身份域采用 Rust + PostgreSQL 技术栈

> Status: **Accepted**
> Date: 2026-05-08
> Deciders: Aris
> Consulted: `feedback_research_principles.md` / `architecture/架构设计.md` / `feedback_red_lines.md`
> Informed: L1 六域其他仓的选型决策

---

## 1. 背景

本仓 `quantalithos-identity` 承载身份域的聚合根服务:GlobalMember、Role、Capability,对外发布领域事件,对内以一致性事务管理员工档案。

在写代码之前必须先定型技术栈,避免后续大幅改造。可选方案在 A 方案推演里已浮出:Rust、Go、Python。

## 2. 决策

- **语言**:Rust(stable toolchain,MSRV ≥ 1.82)
- **Web 框架**:axum 0.8
- **数据库**:PostgreSQL 16,通过 sqlx 0.8(编译期校验 SQL)
- **事件总线**:`quantalithos-bus` 的 Rust crate,默认后端 NATS JetStream
- **对象存储**:MinIO 兼容 S3 API,用于 `semantic_memory_ref` 指向的向量库句柄
- **观测**:`quantalithos-observability` 的 OTel SDK(opentelemetry-rust)
- **gRPC**:tonic 0.12(可选对外暴露,默认关)
- **二进制分发**:静态链接 musl 构建,Docker 镜像 distroless

## 3. 理由

### 3.1 为什么 Rust

| 决策维度 | Rust 是否契合 | 证据 |
|---|---|---|
| 读多写少 + 强一致 | ✓ | 身份档案要求事务一致,Rust + sqlx 在编译期保证 SQL 正确,运行期 panic 率极低 |
| 不涉及 LLM 调用 | ✓ | 本仓**不**做 prompt 组装、**不**调模型,不需要 Python 生态 |
| 与 `core` proto 对齐 | ✓ | `core` 规划使用 prost / tonic,同语言栈共享 crate |
| 与 L2 Member 栈一致 | ✓ | `member` 和 `member-service` 也是 Rust,共享 bus client / OTel / auth middleware |
| 运行时资源 | ✓ | 身份服务预期低并发(< 100 qps)但要求低延迟(p99 < 50ms),Rust 栈天然满足 |
| 招聘难度 | ⚠️ | Rust 工程师少于 Go/Python,但身份域逻辑简单,不是常改模块 |

### 3.2 为什么不 Go

- Go 在此场景也能胜任,但与 L2 已定的 Rust 栈不一致,会增加跨仓共享 crate 的成本
- sqlx 的编译期 SQL 校验 Go 生态没有对等替代(sqlc 是代码生成,不是运行期 query macro)

### 3.3 为什么不 Python

- Python 不适合**低延迟 + 强一致 + 高 QPS**的档案服务
- FastAPI + SQLAlchemy 在大负载下 GIL 成为瓶颈
- Python 在本仓价值在**模型 / 工具链**,本仓无此需求

### 3.4 为什么 PostgreSQL

- 聚合根 + 事件外发 = 典型 Outbox 模式,PG 的事务性最佳
- JSONB 承载 `capability_profile` / `career_history` 的半结构化字段
- 行级锁 + 条件 update 保证 `lifecycle` 状态机不变量
- 运维成熟,任何云厂商都有托管版

### 3.5 为什么 axum 而非 actix-web

- axum 与 tokio 同一生态,与 sqlx / tonic / opentelemetry-rust 集成平滑
- API 语义更符合 REST + 少量 gRPC 的混合需求
- 中间件模型(Tower)跨 crate 共享,便于 L1 六仓统一 auth / tracing / rate-limit

## 4. 不采纳的替代方案

| 替代 | 为什么不采纳 |
|---|---|
| Go + sqlc + gin | 与 L2 Rust 栈跨生态;sqlc 代码生成在本仓迭代期反而拖慢 |
| Python + FastAPI + SQLAlchemy | GIL + 运行期错误率高,不符合身份服务低延迟要求 |
| Node.js + Prisma | 与整个项目的类型体系不一致 |
| 单体:identity 合入 work 仓 | 违反六域分离,GlobalMember 和 ProjectMember 的一致性边界完全不同(见 ADR-0004) |

## 5. 后果

### 5.1 正面

- 与 L0 `core` / L2 `member` / `member-service` 共享 crate,减少重复实现
- 编译期 SQL 校验消除运行期"字段不存在"类错误
- 二进制体积小(< 20 MB),启动快(< 200 ms),适合多实例部署
- OTel 集成统一,三条横切红线中的"可追溯性"自然落地

### 5.2 负面

- 招聘面比 Go / Python 窄
- 编译时间长于 Go(本仓预期仍在可接受范围内,< 30s 增量)
- 首次引入本栈的开发者需要过 Rust 借用检查器学习曲线

### 5.3 风险缓解

- 本仓逻辑简单(CRUD + 状态机 + 事件发布),不是 Rust 炫技场,避免高阶 async 魔法
- 关键路径走公共 crate(bus / observability / auth),每个 L1 仓不重复造轮子
- CI 强制 `cargo clippy` + `cargo fmt` + `cargo audit`

## 6. 约束与边界

- 本 ADR 只约束 `quantalithos-identity` 仓
- L1 其他仓(conversation / work / process / governance / artifact)参考本 ADR,但**每仓独立决策**:
  - conversation 可能需要更高并发 → 也用 Rust
  - process 的 BPMN 引擎可能用 Python(pydantic-graph / LangGraph 生态丰富)→ 独立 ADR
  - 其他仓另行 ADR
- 本 ADR 不约束 L2 / L3 / L4 / L5 / L6

## 7. 标准对齐

- `architecture/架构设计.md` §3.1 稳定依赖原则:identity 是 L1 的稳定核,被多方依赖,选择保守成熟栈符合原则
- `architecture/架构设计.md` §4.4 Outbox 模式:PG 事务 + bus 发布对齐
- `feedback_red_lines.md` 可审计性:所有写操作产生 AuditEvent,Rust 类型系统保证不遗漏
- `feedback_red_lines.md` 可追溯性:OTel trace-id 贯穿 HTTP → DB → Bus,通过 tower 中间件强制
- ISO 42001 §7.1 资源:技术栈选择可追溯,理由记录在本 ADR

## 8. 参考

- `architecture/架构设计.md` — 架构设计方法论
- `architecture/adr/0001-多模型调用架构决策.md` — 已有 ADR(风格参考)
- `methodology/standards-discussion/ISO-42001.md` §7.1 资源
- 相关后续 ADR:ADR-0004(双层 Member)、ADR-0005(Member 镜像预构建)
