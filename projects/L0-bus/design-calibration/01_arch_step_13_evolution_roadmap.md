## Step 13. 演进路线

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-bus/01-架构设计.md` §14 演进路线

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.14 演进路线
  - `standards/document/架构设计讨论流程_SOP.md` Step 13
  - `projects/L0-bus/design-calibration/01_arch_step_10_technology_choices.md`
  - `projects/L0-bus/design-calibration/01_arch_step_11_alternatives_tradeoffs.md`
  - `projects/L0-bus/design-calibration/01_arch_step_12_cross_cutting.md`
- 已确认结论：
  - P0 采用 in-memory default path 验证核心闭环。
  - Redis / Kafka、Filter DSL、多租户、effectively-once、DLQ UI 后移。
  - 配置设计需要承接 backend、store、retry、DLQ、read output 等配置。

### 3. SOP 问题回答

1. 当前阶段做到哪里才算足够？

   回答：当前阶段做到核心闭环可验证即可：基于 `L0-core` 契约接入发布材料，经默认可验证路径完成 delivery、feedback、history、retry / DLQ / replay preparation 和只读输出。

2. 第一批必须守住哪些结构？

   回答：必须守住 core / bus 边界、bus truth 数据边界、ports and adapters、durable bus store、in-memory transport default path、at-least-once、bus 级幂等锚点和授权红线。

3. 哪些能力或约束留到后续阶段演进？

   回答：生产 MQ adapter、复杂 filter、DLQ UI、多租户隔离、effectively-once、完整 ops runbook、生产性能预算和高级观测报表留到后续阶段。

4. 哪些设计债务当前可接受，哪些不可接受？

   回答：可接受的是生产后端后移、性能数字后移、Outbox relay 形态后续细化、授权承接方后续确定；不可接受的是无默认可验证路径、保存业务正文、只读输出反写、无审计 replay、业务仓编译期依赖 bus 核心。

5. 未来哪些触发条件会迫使架构调整？

   回答：吞吐或延迟超过默认路径能力、需要生产后端 SLA、多租户隔离要求出现、订阅方业务重复副作用无法接受、DLQ 操作量上升、治理或合规要求更细粒度授权时，会触发架构演进。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §13 | 旧文档以阶段 1~4 写 EventBus trait、NATS、Outbox、DLQ、Redis / Kafka | 偏实施排期和旧技术选型 |
| §14 | 风险和演进触发混写 | 难以区分当前可接受债务和真正风险 |
| 全文 | P0 / P1 / P2 边界不清 | 后续开发可能重新把四后端、DLQ UI 写回 P0 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前阶段 | EventBus trait + NATS + InMem | 核心闭环 + in-memory default path + durable store | 对齐 Step 10 |
| 后续阶段 | Outbox、DLQ、tap、Redis / Kafka 混在阶段中 | P0 / P1 / P2 按结构演进分层 | 避免任务排期化 |
| 设计债务 | 未显式区分 | 单列可接受和不可接受债务 | 防止“以后再说” |
| 触发条件 | 旧性能阈值为主 | 以生产后端、多租户、治理、DLQ 规模等触发调整 | 更贴合架构演进 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按实现任务写演进路线 | 对开发排期直观 | 变成实施计划，不是架构演进 | 不采用 |
| 方案 B：按 P0 / P1 / P2 结构能力写演进 | 能保护架构边界 | 需要实施计划再拆任务 | 采用 |
| 方案 C：把所有能力都放入 P0 | 一次性完整 | P0 过重，难以验证和交付 | 不采用 |

### 7. 结构化中间产物

#### 7.1 演进阶段表

| 阶段 | 架构目标 | 包含能力 | 不包含 |
|---|---|---|---|
| P0 | 核心闭环可验证 | `L0-core` 契约输入、in-memory default path、durable bus store、delivery、feedback、idempotency、retry / DLQ / replay preparation、只读输出 | 完整生产 MQ adapter、DLQ UI、多租户、effectively-once |
| P1 | 生产适配增强 | 首个生产 MQ adapter、配置设计落地、基础运维状态、授权承接方明确 | 多后端全量矩阵、高级 filter、多租户 |
| P2 | 企业化和高级语义 | Redis / Kafka 等多后端、Filter DSL、多租户隔离、DLQ UI、完整 ops runbook | 不改变 core / bus / sdk / governance 边界 |
| 专项 | 高级一致性 | effectively-once 或更强交付语义专项评估 | 不作为默认语义 |

#### 7.2 当前可接受设计债务

| 设计债务 | 为什么当前可接受 | 后续触发条件 |
|---|---|---|
| 生产 MQ adapter 后移 | P0 只需默认可验证路径证明核心语义 | 需要真实部署或生产 SLA 时触发 |
| 性能数字后移 | 当前无已验证实现数据 | 测试方案和实现完成后补基准 |
| Outbox relay 形态后续细化 | 当前只需确认 boundary | 容器部署和业务仓集成开始时触发 |
| 授权承接方后续确定 | 当前架构先守授权红线 | gateway / governance / runtime 集成设计开始时触发 |

#### 7.3 不可接受设计债务

| 不可接受债务 | 原因 |
|---|---|
| 没有默认可验证 delivery path | 核心闭环无法验收。 |
| 保存业务 payload body | 打穿数据所有权。 |
| 只读输出反写 bus truth | 形成第二真相写入面。 |
| 无 audit chain replay | 破坏失败恢复可信度。 |
| bus 直接编译依赖业务仓 | 打穿全局依赖方向。 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §14 “演进路线”直接摘录并润色本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 生产 MQ adapter 进入哪个阶段 | A. P0；B. P1；C. P2 | B | P0 先验证核心语义，P1 再进入生产适配 | 已确认采用 B |
| DLQ UI 进入哪个阶段 | A. P0；B. P1；C. P2 / 产品层 | C | bus 提供材料，UI 属于产品层 | 已确认采用 C |
| effectively-once 如何处理 | A. P0 默认；B. P2；C. 独立专项评估 | C | 该能力影响语义和测试矩阵，不应默认纳入 | 已确认采用 C |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 14 的待确认事项。
- 生产后端优先级、配置 schema 和性能目标进入后续设计 / 测试 / 实施。

### 10. 进入下一步条件

- 已明确 P0 / P1 / P2 / 专项演进路线。
- 已区分可接受与不可接受设计债务。
- 可以进入 Step 14 风险与待确认事项。
