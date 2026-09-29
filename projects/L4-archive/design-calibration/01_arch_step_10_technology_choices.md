# 01 架构 Step 10：关键技术选型

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 10。

### Step 内计划

- [x] 读取目标、依赖、数据和交互结论。
- [x] 回答哪些机制上升为架构决定、解决什么、代价是什么。
- [x] 诊断旧 Rust/PG/S3/hash/signature 产品与机制混写。
- [x] 输出关键机制、不采用项、回填和自检。

## 2. 问题回答与历史诊断

上升为架构决定的机制必须改变边界、一致性或交互主线：authority-bound snapshot、manifest-first closure、多轴验证状态、port-adapter 外部能力、异步作业与反馈、owner-specific handoff、unknown-first reconciliation。语言、数据库、对象存储品牌、算法、压缩格式、KMS 产品只是待核验载体，当前不构成架构选型。

旧材料把 Rust/PostgreSQL/S3/Glacier、hash/signature、worker 分拆直接列为“技术选型”，且没有代价和 authority。当前只保留可由正式 00/Step 7~9 推导的机制。

## 3. 设计取舍

机制选择以“是否保护 source authority、阶段独立性和恢复无写权”为判断轴。采用可判别但较复杂的局部状态与外部 seam，接受更多记录、兼容与补偿成本；拒绝以单一 Bundle 状态、统一业务模型或产品锁定换取表面简单。

## 4. 结构化中间产物

### 4.1 关键技术机制

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| Authority-bound archival snapshot/ref | 跨域材料来源、版本和覆盖不可证明 | 每份材料必须绑定 canonical owner 与 fence/coverage，才能保持真相边界 | 需要逐 source 合同、兼容处理和 partial 状态 | 影响 U2、数据所有权与恢复来源，属于架构机制。 |
| Manifest-first content closure | 固定域/文件存在无法证明包完整 | 以请求声明集合和实际集合闭包判断可暴露缺失、多余与越界 | manifest 演进和 closure finding 需要长期维护 | 改变 Bundle 核心语义，而非文件格式偏好。 |
| 多轴 verification/commit/outcome 状态 | 局部成功易被推导为全局可信 | closure、integrity、compatibility、storage、handoff 独立才能 fail-closed | 状态组合和对外解释更复杂 | 长期保护所有成功语义。 |
| Port-adapter external capability isolation | owner、storage、KMS、signature、receiver 会反向污染核心 | 外部能力经正式接缝进入，核心可在不可用时返回明确姿态 | 需要 adapter、配置、错误映射和合同测试 | 影响依赖方向与部署承载，不是局部封装。 |
| Sync admission/read + asynchronous/background execution | 长时跨域操作不适合同步锁定 | 即时边界只做可收口判断，长任务按 source/item 局部推进 | 需要作业状态、反馈关联和恢复能力 | 影响运行结构与交互方式。 |
| Owner-specific restore material and handoff | Bundle 易被误作跨域写权限 | 将业务提交交还各 owner，Archive 只协调材料与结果 | 恢复可能长期 partial/commit-unknown | 是恢复边界的核心结构决定。 |
| Intent/result separation with reconciliation | 外部 side effect 响应丢失会导致盲重试 | 保存可关联的本地意图和结果姿态，未知先核对 | provider 若无 probe 能力需人工/补偿，不能自动完成 | 影响 storage 与 handoff 的幂等/恢复语义。 |
| Version-aware compatibility gate | 历史材料可能无法被当前读者/receiver 理解 | unsupported/unknown 必须在验证和恢复前显式阻断 | 需要 schema authority 与演进合同 | 不等于选择特定 schema registry 产品。 |

### 4.2 当前不采用

| 不采用项 | 原因 |
|---|---|
| 单一全局事务 / 全局 capture timestamp | 无跨 owner 事务权，也不能证明不同版本轴可比。 |
| Archive 统一业务模型或数据库快照作为主要归档语义 | 会耦合私有 schema、复制业务 truth 并破坏演进。 |
| 事件 payload 作为唯一归档来源 | delivery/event 不等于完整 owner snapshot 与 coverage。 |
| 固定 Rust、数据库、对象存储、KMS、摘要/签名或压缩产品 | 未经实现仓、配置 authority 与外部合同核验。 |
| Archive 自建 SDK client/cache、UI、policy engine、observability backend | 均越出本仓职责或造成依赖倒置。 |

### 4.3 技术边界说明

这些机制会长期约束 U1~U6、外部接缝、数据一致性和恢复方式，因此需要在架构层固定。它们不等于具体 port、DTO、表、算法或供应商；精确选择必须在后续文档基于已关闭合同和实现仓事实决定。`AR-UP-004/005/009` 未关闭时只能设计失败分支，不能填写真实 digest、signature、storage commit 或 receiver success。fake 只验证机制分支，不提供真实集成证据。

## 5. 回填、待确认与门禁

正式 §11 承接机制表、不采用项和边界说明。所有选择可追溯到 Step 2/7~9，未用流行度或历史技术栈作为理由。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 11 备选方案与取舍`。
