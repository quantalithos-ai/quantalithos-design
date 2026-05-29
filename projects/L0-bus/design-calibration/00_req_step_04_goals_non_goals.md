# Step 4. 目标与非目标

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填章节: `00-需求文档.md` §4 目标与非目标
> 生成日期: 2026-05-29

---

## 1. 本步目标

收束 `L0-bus` 的需求范围，明确当前阶段必须达成什么、明确不做什么，以及旧文档中哪些候选能力应降为 P1/P2 或移交相邻仓。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓边界 | 保证目标不越过 core / sdk / observability / governance 边界 |
| Step 3 问题定义 | 保证目标直接回应传递主干缺失、边界混杂和失败恢复无统一口径 |
| 旧 README / 00 / 02 / 03 | 提取候选目标，重新判断 P0 / P1 / 非目标 |
| `L0-core` 稳定结论 | 确认 `L0-bus` 目标以消费 core 契约为前提 |

---

## 3. 应问的问题与回答

### 3.1 本次需求结束后，应成立哪些状态、边界或能力？

本次需求收口后，至少应成立以下状态：

- `L0-bus` 的定位稳定：它是事件传递、订阅推进、失败恢复和总线级留痕主干，而不是 schema / SDK / MQ 产品仓。
- `L0-bus` 与 `L0-core` 的关系稳定：core 定义共享契约，bus 消费契约并推进 delivery。
- 最小事件传递闭环稳定：发布方提交事件材料，bus 形成传递语义，订阅方可接收并 ack / fail，失败可进入 retry / dead-letter / replay 路径。
- 总线级留痕稳定：delivery、retry、dead-letter、replay、tap 和只读消费输出都有需求边界。
- P0 与 P1/P2 能力边界稳定：不再把旧草案所有候选能力直接当成当前阶段必做。

### 3.2 这些目标如何被验证？

验证方式不在本步展开测试用例，但每个目标必须能在后续验收中判断：

| 目标 | 验证方式 |
|---|---|
| 仓定位与边界稳定 | 后续需求章节不把 core / sdk / observability / governance / MQ 后端职责写入 bus |
| 最小事件传递闭环成立 | 后续功能需求与验收能覆盖 publish、delivery、ack/fail、retry、dead-letter、replay preparation |
| bus-level trace / audit 成立 | 后续数据归属与验收能说明 bus 拥有哪些传递事实和只读输出 |
| P0 / P1 / 非目标清晰 | 后续功能需求不把 Redis / Kafka / 三语言 client / Console DLQ 等候选能力写成 P0 |

### 3.3 哪些事项相关但不纳入当前范围？

| 事项 | 处理方式 |
|---|---|
| Event schema / Error / TraceContext / Metadata 定义 | 非目标，归 `L0-core` |
| Python / TypeScript / Rust 高层 client | 非目标，归 `L0-sdk`；bus 可保留必要 transport contract |
| Redis / Kafka 完整生产适配 | P1/P2 候选；P0 只要求后端适配边界和至少一个可验证默认路径 |
| NATS 集群部署和 MQ 产品运维 | 非目标或部署运维文档范围，不作为需求主线 |
| DLQ Console UI | 非目标，归 `L5-console` 或后续产品层 |
| Observability 长期存储和查询 | 非目标，归 `L4-observability` |
| Governance 审批决策 | 非目标，归 `L1-governance` |
| 业务补偿 / Saga 编排 | 非目标，归业务域 / process / governance 协作 |
| Exactly-once 全局语义 | 非目标；当前只收束 at-least-once + subscriber idempotency |

### 3.4 哪些事情必须交给相邻仓或后续阶段处理？

| 交给谁 | 内容 |
|---|---|
| `L0-core` | Event schema、CloudEvents fields、ErrorCode、TraceContext、Metadata、ActorRef |
| `L0-sdk` | 多语言 client、开发者便利 API、SDK 级重试和认证封装 |
| L1 / L2 / L3 发布方 | 业务 payload、业务幂等、副作用、补偿动作 |
| `L4-observability` | 全局 trace 查询、metrics 存储、审计报表 |
| `L1-governance` | 失败升级后的审批、策略裁决、放行或阻断 |
| 后续 bus 阶段 | Redis / Kafka adapter、filter DSL、multi-tenant isolation、DLQ UI、effectively-once |

---

## 4. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 后端目标 | NATS / Redis / Kafka / InMem 四后端都像 P0 | P0 固定 adapter boundary + default verifiable path；Redis / Kafka 后移 P1/P2 |
| SDK 目标 | bus 仓包含 Python / TypeScript binding | 高层 client 归 `L0-sdk`；bus 保留必要 transport contract |
| Outbox | 旧文档把 outbox worker 作为实现候选 | 需求层只定 Outbox relay boundary，具体 worker 形态后移 |
| DLQ / replay | 旧文档既是目标又是设计对象 | 需求层定义失败恢复闭环和边界，详细对象后移 |
| 性能目标 | 500 QPS / 5000 QPS 等混杂 | 当前只保留可验证方向，具体目标 Step 13 再定 |

---

## 5. 结构化中间产物

### 5.1 目标结论

| 目标编号 | 目标 | 验证方式 | 优先级 |
|---|---|---|---|
| G-001 | 建立基于 `L0-core` 契约的事件传递需求基线 | 正式文档不重定义 Event / Error / Trace / Metadata | P0 |
| G-002 | 定义最小事件传递闭环 | 后续需求覆盖 publish、subscribe、delivery、ack/fail | P0 |
| G-003 | 定义失败恢复闭环 | 后续需求覆盖 retry、dead-letter、replay preparation 和失败材料输出 | P0 |
| G-004 | 定义总线级留痕与 tap 边界 | 后续需求覆盖 delivery history、bus audit、tap / read-only consume | P0 |
| G-005 | 定义 Outbox relay 的需求边界 | 后续需求说明已提交事实如何进入 bus 推进链 | P0-min |
| G-006 | 定义后端适配边界 | P0 至少具备可验证默认路径，Redis / Kafka 不强行进入 P0 | P0-min |
| G-007 | 定义 SDK / observability / governance 的消费边界 | 后续需求明确它们消费 bus 输出但不反写 bus truth | P0 |

### 5.2 非目标结论

| 非目标编号 | 非目标 | 归属 |
|---|---|---|
| NG-001 | 事件 schema、ErrorCode、TraceContext、Metadata、ActorRef 定义 | `L0-core` |
| NG-002 | 多语言高层 SDK client、认证封装、开发者便利 API | `L0-sdk` |
| NG-003 | L1 / L2 / L3 业务 payload 语义和业务幂等 | 发布方 / 订阅方 |
| NG-004 | 业务补偿、Saga、流程编排 | 业务域 / `L1-process` / `L1-governance` |
| NG-005 | Observability 长期存储、查询、报表和告警产品 | `L4-observability` |
| NG-006 | Governance 审批和策略裁决 | `L1-governance` |
| NG-007 | NATS / Redis / Kafka 产品集群部署和运维 runbook | 部署 / 运维文档 |
| NG-008 | DLQ Console UI | `L5-console` 或后续产品层 |
| NG-009 | 全局 exactly-once 默认语义 | 后续专项，不作为当前需求目标 |

### 5.3 范围收束结论

当前需求范围按三层收束：

| 范围层级 | 内容 |
|---|---|
| P0 主闭环 | 基于 core 契约的 publish / delivery / subscribe / ack-fail / retry / dead-letter / replay preparation / bus audit / tap |
| P0-min 边界 | Outbox relay boundary、backend adapter boundary、SDK consume transport view、governance failure material |
| P1/P2 增强 | Redis / Kafka 完整适配、filter DSL、多租户隔离、DLQ UI、effectively-once、完整 ops runbook |

---

## 6. 回填草稿

```md
## 4. 目标与非目标

> 校准来源：
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“改动前后差异”和“回填草稿”小节，了解目标、非目标和 P0 范围如何从旧 bus 草案收敛。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立基于 `L0-core` 契约的事件传递需求基线 | bus 消费 core 契约，不重定义 Event / Error / Trace / Metadata | 后续章节不出现 core / bus 双真相 |
| 定义最小事件传递闭环 | 覆盖 publish、subscribe、delivery、ack/fail | 功能需求和验收能覆盖主传递链 |
| 定义失败恢复闭环 | 覆盖 retry、dead-letter、replay preparation 和失败材料输出 | 功能需求和验收能覆盖失败链 |
| 定义总线级留痕与 tap 边界 | 覆盖 delivery history、bus audit、tap 和只读消费输出 | 数据归属和验收能说明 bus 拥有的传递事实 |
| 定义 Outbox relay 和后端适配边界 | 说明已提交事实如何进入 bus 推进链，并保留后端可替换边界 | 不把具体 worker 形态和所有后端实现提前写死 |
| 定义 SDK / observability / governance 消费边界 | 它们消费 bus 输出，但不反写 bus truth | 边界规则和非目标清晰 |

### 4.2 非目标

| 非目标 | 不做原因 / 归属 |
|---|---|
| Event schema、ErrorCode、TraceContext、Metadata、ActorRef 定义 | 归 `L0-core` |
| 多语言高层 SDK client、认证封装、开发者便利 API | 归 `L0-sdk` |
| 业务 payload 语义、业务幂等和业务补偿 | 归发布方 / 订阅方 / 业务域 |
| Observability 长期存储、查询、报表和告警产品 | 归 `L4-observability` |
| Governance 审批和策略裁决 | 归 `L1-governance` |
| NATS / Redis / Kafka 产品集群部署和运维 runbook | 归部署 / 运维文档 |
| DLQ Console UI | 归 `L5-console` 或后续产品层 |
| 全局 exactly-once 默认语义 | 当前阶段不做，默认 at-least-once + subscriber idempotency |

### 4.3 范围收束

当前 P0 主闭环聚焦基于 `L0-core` 契约的事件传递、失败恢复和总线级留痕。Redis / Kafka 完整适配、filter DSL、多租户隔离、DLQ UI、effectively-once 和完整 ops runbook 均不作为当前 P0 目标。
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 四后端是否 P0 | NATS / Redis / Kafka / InMem 全部 P0 | P0 固定 adapter boundary + default verifiable path，Redis / Kafka 后移 | 推荐 B。原因是需求先保证主闭环，避免多后端拖慢第一批实现 |
| Q-002 | 三语言 client 是否 P0 | bus 仓交付 Rust / Python / TypeScript client | 高层 client 归 `L0-sdk`，bus 只保留 transport contract | 推荐 B。原因是 SDK 体验不是 bus 主职责 |
| Q-003 | Outbox worker 形态是否本步决定 | 直接定内嵌 / sidecar / CDC | 本步只定 Outbox relay boundary，形态后移 | 推荐 B。原因是需求阶段不提前固化部署形态 |

当前建议：接受上述推荐后进入 Step 5。

---

## 8. 进入下一步条件

- 每个目标都可验证。
- 每个非目标都有明确归属。
- 四后端、三语言 client、Outbox worker 形态未被提前强行写入 P0。
- 范围已经能支撑后续角色、依赖、闭环和功能需求展开。
