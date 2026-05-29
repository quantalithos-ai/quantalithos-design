## Step 10. 关键技术选型

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-bus/01-架构设计.md` §11 关键技术选型

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.11 关键技术选型
  - `standards/document/架构设计讨论流程_SOP.md` Step 10
  - `projects/L0-bus/design-calibration/01_arch_step_02_arch_goals_constraints.md`
  - `projects/L0-bus/design-calibration/01_arch_step_07_dependency_direction.md`
  - `projects/L0-bus/design-calibration/01_arch_step_08_data_ownership_consistency.md`
  - `projects/L0-bus/design-calibration/01_arch_step_09_interactions_communication.md`
- 已确认结论：
  - P0 必须有默认可验证 delivery path。
  - 完整 Redis / Kafka 生产 adapter 后移。
  - 后端差异不能泄漏为上层 transport semantic。

### 3. SOP 问题回答

1. 当前采用哪些关键架构机制？

   回答：采用 ports and adapters、统一 transport semantic、at-least-once delivery、bus 级 idempotency anchor、durable bus store、outbox relay boundary、dead-letter / replay preparation、read-only output projection、in-memory transport 作为默认可验证路径。

2. 每个机制解决什么问题？

   回答：ports and adapters 隔离后端和存储；统一 transport semantic 避免裸 MQ 泄漏；at-least-once 提供可实现的默认投递语义；idempotency anchor 处理重复 delivery / feedback；durable bus store 保护可追溯性；outbox relay boundary 承接已提交事实；dead-letter / replay preparation 支撑恢复；read-only projection 服务 SDK、观测和治理；in-memory transport 让 P0 可测试。

3. 为什么不用其他方案？

   回答：不直接绑定 NATS / Redis / Kafka 作为 P0 默认，因为会提前锁死后端；不采用全局 exactly-once，因为当前需求默认 at-least-once + subscriber idempotency；不把 read output 当同步强依赖，因为会阻塞主链；不把业务 payload 存入 bus，因为打穿数据所有权。

4. 每个选型带来什么代价或新风险？

   回答：ports and adapters 增加抽象设计成本；at-least-once 要求订阅方幂等；in-memory transport 只能证明默认语义路径，不代表生产后端能力；durable store 增加一致性和迁移设计负担；read-only projection 需要处理滞后和重建。

5. 哪些选型是当前阶段必要的，哪些暂不引入？

   回答：当前必要的是 ports and adapters、统一 transport semantic、at-least-once、idempotency anchor、durable store、dead-letter / replay preparation、in-memory default path。暂不引入完整 Redis / Kafka 生产 adapter、Filter DSL、多租户隔离、effectively-once 和 DLQ UI。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §9.1 | 直接选择 NATS JetStream 作为默认后端 | 与当前默认可验证路径和后端后移策略冲突 |
| §9.2 | at-least-once / effectively-once 等混在一起 | 需要明确当前只采用 at-least-once |
| §9.3 | Outbox worker 形态提前倾向内嵌 worker | Outbox relay 形态应在部署 / 取舍中保留弹性 |
| §10 | NATS / Redis / Kafka 对比提前进入主文 | 完整备选方案应在 Step 11 展开 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 默认后端 | NATS JetStream | in-memory transport 作为默认可验证路径，生产后端后续演进 | 避免 P0 依赖外部产品部署 |
| 后端策略 | 四后端 adapter 目标 | ports and adapters + adapter boundary | 当前先稳定边界 |
| 投递语义 | at-least-once 与 effectively-once 同时讨论 | 当前正式采用 at-least-once | 对齐需求 |
| 存储 | PostgreSQL / backend store 倾向 | durable bus store 作为机制，不提前定产品 | 保持架构层边界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：P0 直接绑定 NATS JetStream | 接近生产形态 | 增加部署前置，后端语义易泄漏 | 不采用为默认可验证路径 |
| 方案 B：in-memory transport + durable bus store 作为默认可验证路径 | 易测试，能验证核心语义 | 不代表生产后端能力 | 采用 |
| 方案 C：先不提供默认可验证路径 | 架构更轻 | 无法验收核心闭环 | 不采用 |

### 7. 结构化中间产物

#### 7.1 关键技术选型表

| 选型 | 解决的问题 | 代价 / 风险 | 当前口径 |
|---|---|---|---|
| Ports and adapters | 隔离入口、后端、存储和核心语义。 | 抽象设计成本更高。 | P0 必选。 |
| Unified transport semantic | 避免裸 MQ 参数泄漏为上层语义。 | 需要维护适配映射。 | P0 必选。 |
| At-least-once delivery | 提供现实可实现的默认投递语义。 | 订阅方必须处理业务幂等。 | P0 必选。 |
| Bus idempotency anchor | 识别重复 delivery / feedback。 | 不承接业务副作用幂等。 | P0 必选。 |
| Durable bus store | 保证 delivery、DLQ、audit、replay material 可追溯。 | 需要后续存储和迁移设计。 | P0 必选。 |
| Outbox relay boundary | 承接已提交事实进入 bus。 | 运行形态仍需后续细化。 | P0-min 必选。 |
| Dead-letter / replay preparation | 支撑失败恢复可信链。 | replay 授权和审计要求高。 | P0 必选。 |
| Read-only output projection | 支撑 SDK、observability、governance 和 operator 消费。 | 存在延迟和重建问题。 | P0 必选。 |
| In-memory transport default path | 提供无外部 MQ 的默认可验证路径。 | 不代表生产后端能力。 | P0 默认。 |
| Redis / Kafka production adapter | 支撑未来不同部署场景。 | 增加语义映射和测试矩阵。 | P1/P2。 |
| Filter DSL / multi-tenant / effectively-once | 支撑高级场景。 | 复杂度高。 | 后续专项。 |

#### 7.2 不采用口径结论

| 不采用项 | 当前不采用原因 |
|---|---|
| NATS 作为唯一 P0 默认 | 会把默认可验证路径绑定外部产品部署。 |
| 全局 exactly-once | 与当前需求口径不符，业务副作用幂等归订阅方。 |
| 保存业务 payload body | 打穿业务数据所有权和安全边界。 |
| 同步阻塞式只读输出 | 会让观测或治理消费反向阻塞 bus truth。 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §11 “关键技术选型”直接摘录并润色本文件 §7.1、§7.2。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 默认可验证路径采用什么传输能力 | A. NATS；B. in-memory transport；C. Redis | B | 不依赖外部产品部署，能验证核心语义 | 已确认采用 B |
| durable bus store 是否在架构层定具体产品 | A. 直接定 PostgreSQL；B. 只定 durable bus store 机制；C. 暂不要求持久化 | B | 技术机制必须明确，具体产品可后移 | 已确认采用 B |
| Redis / Kafka 是否进入 P0 | A. 进入 P0；B. P1/P2；C. 删除 | B | 当前 P0 只需默认可验证路径，完整生产 adapter 后移 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 11 的待确认事项。
- durable bus store 的具体产品、schema、迁移策略进入详细设计或实施计划。

### 10. 进入下一步条件

- 已明确当前正式采用的关键技术机制。
- 已明确默认可验证路径采用 in-memory transport。
- 已明确 Redis / Kafka、Filter DSL、多租户和 effectively-once 后移。
- 可以进入 Step 11 备选方案与取舍。
