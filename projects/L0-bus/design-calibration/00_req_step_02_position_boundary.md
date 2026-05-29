# Step 2. 本仓定位与边界

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填章节: `00-需求文档.md` §2 本仓定位与边界
> 生成日期: 2026-05-29

---

## 1. 本步目标

建立 `L0-bus` 的正确心智，防止后续章节把事件 schema、SDK client、业务补偿、观测存储、治理决策或 MQ 产品配置混进本仓。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 1 上游关系结论 | 确认 `L0-core` 是直接稳定上游，bus 不重定义共享契约 |
| `architecture/仓库拆分方案.md` | 确认 `L0-bus` 位于 L0 共享契约层 |
| 旧 `README.md` / `00` / `02` / `03` | 提取“事件传递主干、包络、路由、DLQ、replay、tap”等可迁移事实 |
| `L0-core` 已稳定文档 | 确认 core 与 bus 的职责边界 |

---

## 3. 应问的问题与回答

### 3.1 本仓一句话定义是什么？

`L0-bus` 是 Quantalithos 基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓。

更精确地说，它不是“定义事件内容”的仓，而是“让已定义的事件可靠传递并可恢复”的仓。

### 3.2 为什么它需要单独成仓？

事件传递语义会被几乎所有上层仓使用，但它本身不属于任何一个业务域。如果没有独立的 `L0-bus`：

- L1 各仓会各自实现 publish / subscribe / retry / DLQ。
- observability 无法围绕同一条 delivery / audit 链做追溯。
- governance 无法读取统一失败材料。
- SDK 会被迫包装多套不一致 transport 语义。
- 事件后端差异会泄漏到业务仓。

因此它必须作为 L0 独立仓承载跨仓传递主干，而不是散落在业务仓、SDK 或 MQ adapter 中。

### 3.3 本仓不是什么？

| 非职责 | 原因 |
|---|---|
| 不是事件 schema 真相仓 | Event、Error、TraceContext、Metadata、ActorRef 等由 `L0-core` 承载 |
| 不是 SDK 客户端体验仓 | 高层 client、重试封装、语言包发布属于 `L0-sdk` |
| 不是 L1 业务事件语义仓 | 业务状态、业务规则和 payload 正文属于 L1 / L2 / L3 等发布方 |
| 不是 observability 存储仓 | trace、metrics、audit 查询和长期归档属于 `L4-observability` / `L4-archive` |
| 不是 governance decision 仓 | Gate、Policy、Approval 和决策结果属于 `L1-governance` |
| 不是 MQ 产品部署仓 | NATS / Redis / Kafka 的产品内部机制和集群运维不是需求主线 |
| 不是业务补偿 / Saga 编排仓 | 补偿语义属于业务域或 process / governance 协作 |

### 3.4 最容易与哪些相邻仓或概念混淆？

| 相邻对象 | 容易混淆点 | 边界结论 |
|---|---|---|
| `L0-core` | 事件包络字段、错误、trace、metadata 好像也在 bus 用 | core 定义共享契约，bus 消费这些契约并推进 delivery |
| `L0-sdk` | SDK 也会 publish / subscribe | SDK 提供调用体验，bus 提供 transport truth 和运行语义 |
| L1 / L2 / L3 发布方 | 发布方也拥有事件 payload | 发布方拥有业务正文，bus 只拥有传递包络、路由、delivery 和恢复材料 |
| `L4-observability` | bus audit / trace 与 observability audit 容易重叠 | bus 留总线级传递事实，observability 做跨系统采集、查询和长期分析 |
| `L1-governance` | dead-letter escalation 看起来像治理决策 | bus 输出失败材料，governance 决定是否审批、阻断或升级 |
| MQ 后端 | NATS / Kafka / Redis 也有 ack、offset、DLQ | bus 定义平台语义，后端只是适配实现 |
| Outbox | 业务仓 outbox 与 bus relay 容易混同 | 业务仓提交事实，bus 负责 relay 边界后的投递推进 |

---

## 4. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 仓定位 | “Event Bus 抽象 + 多后端适配，跨域通信唯一主干” | “基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓” |
| schema 归属 | 容易把事件 schema、event catalog 与 bus 混写 | schema 和共享 metadata 属于 `L0-core`，bus 只消费 |
| SDK 归属 | README 写 Python / TypeScript client | 高层 client 与语言包归 `L0-sdk`，bus 保留 transport contract / adapter 边界 |
| 后端范围 | 四后端看似都是核心定位 | 多后端是候选能力，P0 范围后续 Step 4 / Step 9 决策 |
| 观测治理 | tap / DLQ / escalation 容易滑成 observability / governance 逻辑 | bus 输出只读传递事实和失败材料，不替下游做查询、存储或决策 |

---

## 5. 结构化中间产物

### 5.1 一句话定义结论

`L0-bus` 是 Quantalithos 基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓。

### 5.2 非职责结论

| 类别 | 不属于 `L0-bus` |
|---|---|
| 契约定义 | Event schema、Error、TraceContext、Metadata、ActorRef |
| 客户端体验 | 多语言 SDK、高层 API、开发者便利封装 |
| 业务语义 | 领域状态、业务规则、业务 payload 正文、补偿动作 |
| 下游系统真相 | observability 存储、archive 归档、governance decision |
| 后端产品本体 | NATS / Redis / Kafka 的产品内部机制和集群运维 |

### 5.3 边界对象结论

| 边界对象 | `L0-bus` 与它的关系 |
|---|---|
| `L0-core` | 输入稳定共享契约，是直接上游 |
| `L0-sdk` | 消费 bus transport view / client boundary，是下游封装方 |
| L1 / L2 / L3 发布方 | 提供业务 payload 和 outbox fact，是事件来源 |
| L1 / L2 / L3 订阅方 | 消费 delivery，是事件消费者 |
| `L4-observability` | 消费 tap / trace / bus audit material |
| `L1-governance` | 消费 dead-letter / escalated failure material |
| SRE / operator | 处理 lag、DLQ、replay 和运行门禁 |
| MQ backend | 提供实际传输能力，是 adapter 背后的运行依赖 |

### 5.4 单独成仓原因结论

`L0-bus` 单独成仓，是因为跨仓传递语义需要比业务仓更稳定、比 SDK 更底层、比 MQ 后端更平台化，并且被所有事件驱动仓共享。

---

## 6. 回填草稿

```md
## 2. 本仓定位与边界

> 校准来源：
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“改动前后差异”和“回填草稿”小节，了解本仓定位和边界如何收敛。

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L0-bus` 是 Quantalithos 基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓。 |
| 本仓不是什么 | 它不是事件 schema 真相仓，不是 SDK 客户端体验仓，不是 L1 业务事件语义仓，不是 observability 存储仓，不是 governance decision 仓，也不是 MQ 产品部署仓。 |
| 边界对象列表 | 仓：`L0-core`；仓：`L0-sdk`；仓：L1 / L2 / L3 发布方与订阅方；仓：`L4-observability`；仓：`L1-governance`；角色：SRE / operator；外部能力：MQ backend。 |
| 单独成仓原因 | 跨仓传递语义需要比业务仓更稳定、比 SDK 更底层、比 MQ 后端更平台化，并且被所有事件驱动仓共享。 |

`L0-bus` 的核心边界是：消费 `L0-core` 的共享契约，承载平台级 publish / subscribe / ack / retry / dead-letter / replay / tap / bus audit 语义，但不拥有业务 payload 真相、不重新定义事件 schema、不替 SDK 封装开发者体验、不替 observability 长期存储，也不替 governance 做决策。
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 `L0-bus` 定义为“共享传递主干契约仓” | 强调 envelope truth，偏设计对象 | 强调基于 core 契约的事件传递、失败恢复和留痕主干 | 推荐 B。原因是需求阶段应面向外部可见能力，避免过早对象化 |
| Q-002 | 多后端适配是否写入定位定义 | 写入一句话定义 | 放入目标 / 功能需求中决策 | 推荐 B。原因是多后端是能力范围问题，不是仓存在的唯一理由 |

当前建议：接受上述推荐后进入 Step 3。

---

## 8. 进入下一步条件

- 已能用一句话说明 `L0-bus` 的仓定位。
- 已明确它不重定义 `L0-core` 的共享契约。
- 已明确它与 `L0-sdk`、L1+ 发布订阅方、observability、governance、MQ 后端的边界。
- 尚未提前决定四后端、三语言 client 或完整 DLQ / replay 的 P0 范围。
