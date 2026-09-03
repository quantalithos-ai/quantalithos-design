# 01 架构校准 Step 10：关键技术选型

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 9 completed / pass
> 本步目的：只固定影响边界、依赖、一致性和关键交互的架构机制，并说明采用理由和代价

## 1. Step 内计划

- [x] 读取 flow、台账、Step 2 / 7 / 8 / 9。
- [x] 按“影响结构而非局部便利”筛选机制。
- [x] 逐项说明解决的问题、采用理由、代价和架构层必要性。
- [x] 区分正式采用、contract placeholder 和 deferred 产品选择。
- [x] 诊断旧语言、框架、数据库、消息、RPC、编排平台和数值指标污染。
- [x] 形成技术机制表、不采用口径、正式 §11 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 哪些机制已经上升为架构决定

1. 独立 Host Truth Center：所有宿主侧决定和事实围绕本仓唯一收口。
2. Ports and Adapters：外部 owner、事件 carrier、Sandbox 和宿主基础设施经倒置端口参与。
3. Typed Ref + Safe Snapshot + Freshness：外部 truth 只以最小引用和时点摘要进入。
4. Fail-closed Qualification：required 主语、供给、credential、binding 和承载资格共同成立才可 ready。
5. Immutable Instance Generation + Single-active Fence：restart 建立新实例世代，防止迟到结果和并发分叉。
6. Local Transaction Boundary + External Eventual Consistency：本仓 truth 内部强一致，跨 owner 以 gap / reconciliation 收敛。
7. Idempotent Command and Feedback Correlation：重复、并发、迟到、乱序与 unknown 可稳定处理。
8. Sync Acceptance / Async Feedback / Background Progression Separation：即时判断、结果回送和长时副作用分开。
9. Read-only Rebuildable Projection：safe view 和聚合视图不暴露核心结构、不成为写源。
10. Body-free Handoff and Outcome Layering：local truth / attempt / gap 与 delivered / observed / accepted 分层。

### 2.2 为什么当前值得采用

这些机制共同保护 Step 1~9 已经收稳的核心：owner 唯一、sibling 无源码耦合、外部正文不入仓、partial / unknown 不冒充 ready、活动宿主 / session 不分叉、外部失败不反写本地 truth。它们都直接改变系统结构或失败语义，后续实现不能随意替换为共享数据库、直接 SDK 调用、单一同步链或后端状态驱动，因此需要在架构层锁定。

### 2.3 每项机制的代价

- 需要维护更多显式状态：stale、blocked、partial、unknown、gap、residual、reconciliation。
- 需要端口、adapter、resolver、幂等关联和 generation fence，结构比直接调用复杂。
- 需要解释本地提交与外部完成的差异，运维 / 产品查询不能只展示一个“成功”状态。
- 需要后续文档补齐 contract、对象、存储、配置和测试，架构本身不提供开箱即用实现。

### 2.4 哪些技术当前不锁定

编程语言、框架、数据库、缓存、消息产品、RPC / HTTP / WebSocket、容器运行时、编排平台、registry 产品、序列化、持久化模式、outbox / CDC、重试算法、调度器、部署拓扑、资源参数、健康阈值、容量和性能数字。只有在后续正式文档中获得边界、workload、证据与 owner 约束后，才能在不推翻本步机制的前提下选择。

## 3. 当前材料诊断与取舍

| 历史选择 | 诊断 | 当前处理 |
|---|---|---|
| Rust + Axum / Tokio | 语言和框架 inventory，不决定本仓边界 | deferred 到实施约束具备后。 |
| PostgreSQL + Redis | 产品与缓存策略未有数据 / workload authority | deferred；只保留 durable host truth 和 rebuildable projection 需求。 |
| Kafka / NATS / 固定事件系统 | carrier 产品不应定义 handoff 语义 | deferred；只保留 event / material seam。 |
| REST / gRPC / WebSocket | 协议未闭口且不同场景可能不同 | deferred；只保留同步 / 异步 / 后台分类。 |
| Docker / Kubernetes | 宿主承载产品不应定义 host instance truth | deferred；通过 adapter 中立接入。 |
| outbox 作为必选 | 是一种实现 local truth -> event gap 的方案，但不是唯一架构路径 | 当前只锁 local-first handoff 和可追溯 gap。 |
| 分布式事务保证端到端一致 | 跨 owner 不现实且会掩盖独立完成状态 | 不采用；本地强一致 + 外围最终一致。 |
| Runtime / Member SDK 直接耦合 | 开放合同和 sibling 源码会侵入核心 | 不采用；contract placeholder port。 |

## 4. 结构化中间产物

### 4.1 关键技术机制

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 独立 Host Truth Center | 防止宿主决定和生命周期散落到 Work、Member、Runtime、Sandbox 或 backend | 上游已从多侧排除 host lifecycle，本仓需要唯一 owner | 本仓必须维护完整历史和边界解释 | 直接决定仓存在理由与数据写入 authority。 |
| Ports and Adapters | 防止 sibling 与基础设施实现侵入核心 | 所有非 Core 关系都是 runtime / event / ref / adapter | 增加端口、映射和 qualification 维护成本 | 改变跨仓与产品接入结构。 |
| Typed Ref + Safe Snapshot + Freshness | 防止外部正文复制和隐式旧数据放行 | A1 / A2 / A4 需要可追溯时点上下文，但不能拥有源 truth | 需要 resolver、stale / unknown 和刷新语义 | 同时保护数据 ownership 与正向资格。 |
| Fail-closed Qualification | 防止 partial、unknown 或 contract pending 冒充 ready | required 主语、supply、credential、binding 与 carrier 缺一不可 | 降低依赖故障时的可用性，需要显式 waiting / blocked | 安全边界优先于便利降级。 |
| Immutable Instance Generation + Single-active Fence | 防止 restart 覆盖历史、迟到反馈污染新实例和竞争当前宿主 | A2~A5 都需要稳定实例锚和世代顺序 | 增加 generation 关联、fence 和 reconciliation 复杂度 | 影响生命周期、幂等与恢复主链。 |
| Local Transaction Boundary + External Eventual Consistency | 防止跨 owner 伪原子和外围失败回滚本地 truth | 本仓可保证自身提交，不能替外部声明完成 | 需要 gap、stale、residual 和对账 | 不预设具体数据库事务或 outbox。 |
| Idempotent Command / Feedback Correlation | 防止重复、并发、迟到和乱序形成分叉或重复副作用 | 宿主动作跨长时边界且可能 unknown | 需要稳定关联锚、重复判定和冲突处理 | 是安全重试与不盲重放的架构前提。 |
| Sync / Async / Background Separation | 防止同步成功伪装长时副作用完成，或全事件化失去即时拒绝 | Step 9 的三类交互有不同收口语义 | 增加运行角色、状态解释和跨边界追踪 | 直接影响运行承载与交互主线。 |
| Read-only Rebuildable Projection | 防止消费者绑定核心模型或查询反写 truth | P3 可为安全消费提供稳定视图 | 存在延迟、stale、rebuild 和额外承载成本 | 是消费隔离和演进空间的结构机制。 |
| Body-free Handoff + Outcome Layering | 防止敏感正文泄漏和 attempt 冒充 delivery / observed / accepted | 本仓只能对 local material / attempt / gap 负责 | 下游需要理解多层状态，调试链更复杂 | 同时保护安全、审计和 owner 分层。 |

### 4.2 机制状态与开放合同

| 机制 | 当前状态 | 不得误读为 |
|---|---|---|
| Host Truth Center、ports、ref / snapshot、fail-closed、generation fence、local-first、幂等、交互分离、projection、handoff layering | architecture_selected | 已实现、已测试或已 ready。 |
| Member / Runtime / Images / Sandbox / credential / Core / SDK 具体端口 | contract_placeholder / pending | 字段、协议、适配或真实集成已经存在。 |
| 数据库、消息、RPC、容器平台和部署产品 | deferred | 架构缺失；它们是后续在机制约束下的实现选择。 |

### 4.3 当前不采用口径

| 不采用的相邻思路 | 原因 | 正确落点 |
|---|---|---|
| 共享数据库 / 外部正文复制 | 迁移 ownership 并形成第二 truth | typed ref / safe snapshot / resolver |
| 直接 sibling 源码依赖 | 破坏 Layer 3 平行边界和合同独立演进 | runtime / event / ref ports |
| backend resource state 驱动 domain state | 设施状态机反向定义 host truth | adapter feedback -> 本仓判断 / reconciliation |
| 跨 owner 分布式事务 | 混淆独立完成状态并放大耦合 | 本地提交 + 外围最终一致 / gap |
| 全同步生命周期链 | 接受 / 决定与长时副作用完成混写 | sync acceptance + background progression + async feedback |
| 全事件化入口 | 无法即时拒绝非法主语、冲突注册或控制请求 | 同步权威判断 + 异步事实传播 |
| 本地 allowlist / host fallback | 吞并 Governance / Sandbox truth 并 fail open | 正式 qualification + unknown fail closed |
| fake 作为真实后端资格 | fake 不能证明 owner、协议、产品或正向集成 | fake-qualified 与 integration evidence 分层 |

## 5. 回填草稿

- 正式 §11 采用 10 行关键机制表、机制状态表和一段技术边界说明。
- 正式正文不列 Rust、PostgreSQL、Redis、Kafka、HTTP、gRPC、Docker、Kubernetes 或任何产品候选。
- 完整路径级替代方案比较留给 Step 11；本步只说明采用机制及代价。

## 6. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每个机制是否解决架构层问题 | pass | 均影响 owner、边界、依赖、一致性或交互。 |
| 每个机制是否有采用理由和代价 | pass | 10 项均完整。 |
| 是否把产品 / 技术栈当架构结论 | pass | 全部 deferred。 |
| 是否把 placeholder 写成实现 ready | pass | contract 与 readiness 状态明确分层。 |
| 是否提前完成备选方案比较 | pass | 仅列相邻不采用口径，完整比较留 Step 11。 |
| 是否允许创建 Step 11 | pass | 关键机制已收稳；须先同步 flow 与项目台账。 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_11
formal_01_write_allowed = false
```
