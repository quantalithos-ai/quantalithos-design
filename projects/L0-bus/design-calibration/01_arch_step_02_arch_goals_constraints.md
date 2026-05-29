## Step 2. 明确架构目标与约束

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-bus/01-架构设计.md` §2 业务背景与驱动力 / §3 约束条件

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.2 业务背景与驱动力
  - `standards/document/架构设计书写规范.md` §4.3 约束条件
  - `standards/document/架构设计讨论流程_SOP.md` Step 2
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/design-calibration/01_arch_step_01_requirements_baseline.md`
- 已确认 Step 1 结论：
  - 架构基线以新版 `00-需求文档.md` v0.2.0 为准。
  - `L0-bus` 不重新定义 `L0-core` 已拥有的共享契约。
  - 当前 P0 是 F-001~F-006 主闭环，P0-min 是 F-007 / F-008 支撑边界。
  - 完整 Redis / Kafka、Filter DSL、DLQ UI、多租户、effectively-once 后移。

### 3. SOP 问题回答

1. 这个仓在架构层面要确保什么成立？

   回答：必须确保 `L0-bus` 成为基于 `L0-core` 契约的事件传递主干，并让发布材料接入、传递语义形成、delivery 推进、结果留痕、失败恢复和只读输出形成可验证、可恢复、可追溯的结构主线。

2. 哪些约束是不可变的？

   回答：不可变约束包括不重新定义 core 契约、不保存 forbidden body、不泄漏后端裸参数、不允许只读输出反写、不允许 failure material 成为 governance decision、不允许缺少完整历史链时 replay、不把运行期或事件协作依赖写成编译期依赖。

3. 哪些约束是当前阶段可以接受的取舍？

   回答：当前阶段只要求一条默认可验证 delivery path，不要求完整 Redis / Kafka 同时完成；只确认 Outbox relay boundary，不锁死 worker / sidecar / CDC；只确认授权边界，不在本步决定承接方；默认 at-least-once + bus 级幂等锚点 + subscriber idempotency。

4. 哪些目标可以明确判断，甚至量化？

   回答：架构层不沿用旧文档中的 NATS P95、consumer group 数、DLQ 保留期和四后端数量指标。当前可判断的是结构目标是否成立：单一契约来源、默认可验证 delivery path、数据边界清晰、后端差异被隔离、只读输出不反写。

5. 哪些事情虽然相关，但不是本仓架构当前要解决的问题？

   回答：Event schema 定义、SDK 高层 client、业务 payload 语义、业务幂等和补偿、observability 长期存储、governance 审批裁决、MQ 集群部署、DLQ Console UI 和完整 ops runbook 都不是本仓当前架构主线。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §1.1 | 使用“事件编织型平台”“唯一主干”等大叙事，但没有收敛到新版 P0 主闭环 | 容易把所有事件相关能力都吸入 bus |
| §1.2 | 多后端适配、Outbox、trace、tap-all、DLQ / replay 混列为驱动力 | 架构目标、技术选型和实现机制层次混杂 |
| §1.3 | 使用四后端、NATS P95、DLQ 100%、后端切换 0 行等指标 | 架构目标被测试 / 实施指标替代 |
| §2.1 | CloudEvents、W3C、tap-all、Outbox、不理解业务语义混写 | 没有区分标准来源、职责边界和技术策略 |
| §2.2 | 默认 NATS、Outbox worker、DLQ 保留期、effectively-once 等写为可变约束 | 当前阶段应先确认取舍，不提前锁死后端和部署 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 背景主线 | 平台事件编织、六域消费、tap-all、archive、runtime 全部展开 | 多仓协作需要一条基于 `L0-core` 契约的事件传递、恢复和留痕主干 | 避免扩大到所有下游叙事 |
| 架构目标 | 四后端、NATS 性能、DLQ 100%、后端切换 0 行 | 承载传递主线、守住边界、隔离后端差异、支撑默认可验证路径 | 架构目标必须写结构性结果 |
| 不可变约束 | CloudEvents、W3C、tap-all、Outbox、NATS 等混合 | 不重定义 core 契约、不保存 forbidden body、不反写 truth、不绕过 replay 链 | 约束保护边界，不列工具或后端 |
| 当前取舍 | 默认 NATS、DLQ 保留期、effectively-once 默认关闭散列 | 默认可验证路径、Outbox relay 形态、授权承接方、完整后端适配、性能数字后移 | 明确当前阶段如何收缩 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：保留旧版量化成功标准作为架构目标 | 指标直观 | 把测试 / 实施指标误当架构目标 | 不采用 |
| 方案 B：用结构性结果定义架构目标 | 能支撑边界、上下文、数据和选型 | 不直接给性能数字 | 采用 |
| 方案 C：把四后端完整适配写成不可变目标 | 多后端叙事完整 | 与 P0-min 收口冲突 | 不采用 |

### 7. 结构化中间产物

#### 7.1 业务背景结论

Quantalithos 的上层仓需要通过事件完成跨仓协作，但 `L0-core` 只提供共享契约来源，不负责事件发布、订阅推进、失败恢复和总线留痕。如果没有单独的 `L0-bus` 架构，发布方、订阅方、SDK、observability、governance 和具体 MQ 后端会围绕事件传递形成多套局部语义。因此架构设计必须把 `L0-bus` 收束为基于 `L0-core` 契约的传递主干，而不是重新定义事件契约、封装客户端体验、保存业务正文或替治理做决策。

#### 7.2 驱动力结论

| 驱动力 | 说明 |
|---|---|
| 多仓协作需要统一事件传递主干 | 否则 L1~L6 会围绕不同 MQ 或局部实现形成多套传递语义。 |
| `L0-core` 契约需要运行时传递承接方 | 否则共享契约只能定义形状，不能形成跨仓 delivery、ack/fail 和恢复链。 |
| 失败恢复必须成为正式结构 | 否则 retry、dead-letter、replay 会退化为日志、脚本或后端私有机制。 |
| bus truth 与只读输出必须隔离 | 否则 SDK、observability、governance 消费材料会反向污染总线真相。 |
| 后端差异必须被架构吸收在边界内 | 否则后端能力差异会泄漏为上层语义差异。 |
| 当前 P0 必须有默认可验证路径 | 否则核心闭环无法进入测试、验收和实施。 |

#### 7.3 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载基于 `L0-core` 契约的事件传递主干 | 否则发布方和订阅方会各自实现传递语义。 |
| 支撑发布材料接入到只读输出的核心闭环 | 否则 publish、delivery、ack/fail、retry、DLQ、replay preparation 和 audit 会被拆散。 |
| 守住 `L0-core`、`L0-bus`、`L0-sdk`、observability、governance 的职责边界 | 否则 bus 会重新定义契约、变成 SDK、观测仓或治理决策仓。 |
| 守住 bus truth、只读快照、外部引用和禁止正文的数据边界 | 否则 bus 会保存或解释不属于它的正文。 |
| 允许后端 adapter 替换而不改变上层 transport semantic | 否则后端差异会变成业务仓和订阅方可见的语义漂移。 |
| 支撑 Outbox relay 边界和默认可验证 delivery path | 否则已提交事实无法稳定进入 bus，核心闭环也无法被验证。 |
| 支撑失败恢复和 replay preparation 的可追溯链 | 否则失败恢复会绕过 delivery history、dead-letter 和 audit chain。 |

#### 7.4 不可变约束表

| 约束 | 说明 |
|---|---|
| 不重新定义 `L0-core` 已拥有的共享契约 | 否则 core / bus 会形成多重真相。 |
| 不保存或解释业务 payload 正文真相 | 否则 bus 会侵入发布方或业务仓的数据所有权。 |
| 不保存 raw secret、governance decision body 或 observability long-term log body | 否则 bus 会吸收安全、治理和观测正文真相。 |
| 不把后端裸参数暴露为平台 transport semantic | 否则 adapter 差异会污染上层传递语义。 |
| 不允许 SDK transport view、tap output、failure material 反写 bus truth | 否则只读消费面会变成第二写入面。 |
| 不允许 failure material 直接成为 governance decision | 否则 bus 会越界进入治理裁决。 |
| 不允许缺少 dead-letter、delivery history 和 audit chain 时 replay | 否则 replay 会绕过失败恢复可信链。 |
| 不把运行期依赖或事件协作依赖写成 Cargo path dependency | 否则运行协作会被误建模为编译耦合。 |

#### 7.5 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 完整 Redis / Kafka 生产 adapter | 当前作为后续增强，P0 只要求 adapter boundary 和默认可验证路径。 |
| 默认可验证后端路径具体形态 | 当前只要求必须存在，具体在技术选型 Step 决策。 |
| Outbox relay 运行形态 | 当前只确认承接已提交 outbox fact 的边界，不提前锁死形态。 |
| tap / DLQ / replay / failure material 授权承接方 | 当前只确认必须有授权边界，具体承接方后续再定。 |
| 性能、容量、延迟和恢复时间数字 | 当前不虚构指标，测试方案补默认路径基准。 |
| exactly-once / effectively-once | 当前不纳入核心闭环，默认 at-least-once + bus 级幂等锚点 + subscriber idempotency。 |

#### 7.6 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Event schema、ErrorCode、TraceContext、Metadata、ActorRef 定义 | 这些共享契约由 `L0-core` 提供。 |
| 不设计 SDK 高层 client、认证封装或开发者便利 API | 这些属于 `L0-sdk`。 |
| 不设计业务 payload 语义、业务幂等或业务补偿 | 这些属于发布方、订阅方或业务域。 |
| 不设计 observability 长期存储、查询、报表或告警产品 | 这些属于 `L4-observability`。 |
| 不设计 governance 审批或策略裁决 | 治理决策属于 `L1-governance`。 |
| 不设计 MQ 产品集群部署和运维 runbook | 这些属于部署 / 运维文档。 |
| 不设计 DLQ Console UI | UI 归 `L5-console` 或产品层。 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §2 “业务背景与驱动力”直接摘录并润色本文件 §7.1、§7.2、§7.3。
- §3 “约束条件”直接摘录并润色本文件 §7.4、§7.5、§7.6。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 架构目标是否保留旧版性能和后端数量指标 | A. 保留旧指标；B. 改为结构性目标，性能数字后移；C. 两者混写 | B | 架构目标表达结构成立，性能和后端数量进入测试或实施 | 已确认采用 B |
| 四后端完整适配是否作为当前不可变目标 | A. 当前 P0 必须四后端；B. 当前只要求 adapter boundary + 默认可验证路径；C. 当前完全不讨论 adapter | B | 保留可替换结构，同时避免 P1/P2 能力写进 P0 | 已确认采用 B |
| Outbox relay 是否现在锁死部署形态 | A. 锁死内嵌 worker；B. 锁死 sidecar / CDC；C. 当前只确认 boundary，形态后续 Step 决策 | C | 部署形态会影响容器、交互和技术选型，Step 2 不提前定死 | 已确认采用 C |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 3 的待确认事项。
- 默认可验证后端路径、Outbox relay 形态和授权承接方进入后续 Step 决策。
- 性能、容量、延迟和恢复时间数字进入测试方案。

### 10. 进入下一步条件

- 已明确 `L0-bus` 架构必须确保的结构性目标。
- 已明确不可变约束、当前阶段可接受取舍和架构非目标。
- 已确认 Step 2 不写容器、依赖图、数据库、Rust trait 或技术选型。
- 可以进入 Step 3 职责边界。
