# Step 7. 核心能力闭环

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 7
> 回填章节: `00-需求文档.md` §7 核心能力闭环
> 生成日期: 2026-05-29

---

## 1. 本步目标

从 `L0-bus` 存在的必要性出发，收敛它成立所需的核心能力闭环；本步不按 API、对象、后端或实现阶段拆分。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓边界 | 确认闭环只包含 bus 能力，不吸收 core / sdk / observability / governance |
| Step 4 目标与非目标 | 确认 P0 主闭环与外围增强 |
| Step 6 使用方与依赖 | 确认闭环前置和输出消费方 |

---

## 3. 应问的问题与回答

### 3.1 如果没有这个仓，系统会缺什么不可替代能力？

系统会缺少统一的跨仓事件传递运行主干。即使 `L0-core` 已经定义事件和共享契约，上层仓仍会各自实现投递、订阅、重试、死信、回放、tap 和运行留痕，最终形成多套不可对账的传递语义。

### 3.2 这个仓成立必须共同具备哪些能力？

`L0-bus` 成立必须同时具备六个能力节点：

1. 契约化输入承接：接受基于 `L0-core` 的事件材料和发布方 payload / outbox fact。
2. 传递语义标准化：把输入材料纳入统一 bus 传递语义，而不是裸 MQ 消息。
3. 订阅推进：让订阅方能按统一 delivery 语义接收并反馈处理结果。
4. 结果留痕：记录 delivery、ack / fail、幂等和因果关系等总线级事实。
5. 失败恢复：失败可进入 retry、dead-letter、replay preparation 等受控链路。
6. 只读输出：向 SDK、observability、governance、operator 输出可消费的 transport view、tap、audit 或 failure material。

### 3.3 哪些能力缺一个，这个仓就不算真正成立？

| 缺失能力 | 后果 |
|---|---|
| 契约化输入承接 | bus 会退化成裸 MQ，无法对齐 `L0-core` |
| 传递语义标准化 | 不同后端 / 发布方会形成不同 delivery 语义 |
| 订阅推进 | 事件无法真正服务跨仓协作 |
| 结果留痕 | 无法判断事件是否传递、失败、重试或完成 |
| 失败恢复 | 失败消息只能丢弃或成为普通日志 |
| 只读输出 | SDK、observability、governance、operator 无法围绕同一 bus truth 消费 |

### 3.4 哪些能力只是外围增强？

| 外围增强 | 原因 |
|---|---|
| Redis / Kafka 完整生产适配 | 后端多样性增强，不决定 bus 主闭环是否成立 |
| Filter DSL | 订阅选择能力增强，主闭环可先用结构化订阅条件 |
| DLQ Console UI | 运维体验增强，UI 不属于 bus 本仓 |
| Effectively-once / exactly-once | 语义增强，当前默认 at-least-once + subscriber idempotency |
| 多租户隔离 | 企业化增强，当前可先保留边界和风险 |
| 完整 ops runbook | 运维交付增强，不是需求闭环核心节点 |

### 3.5 哪些能力根本不属于这个仓？

事件 schema 定义、业务幂等、业务补偿、SDK 高层封装、observability 存储查询、governance 决策、archive 恢复流程、MQ 产品集群部署都不属于 `L0-bus`。

---

## 4. 核心能力闭环图

```text
Core contract input
  |
  v
Transport semantic baseline
  |
  v
Delivery progression
  |
  v
Delivery result record
  |
  v
Failure recovery path
  |
  v
Read-only bus outputs
```

图示说明：

- 箭头表示能力成立的逻辑依赖，不表示运行时调用顺序。
- 图中没有接口名、事件名、对象字段、数据库动作或后端 adapter。
- `Read-only bus outputs` 不反写前面的 bus truth。

---

## 5. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 闭环组织方式 | 按 EventBus trait、后端、Outbox、DLQ、tap 等能力罗列 | 按契约化输入、传递语义、订阅推进、结果留痕、失败恢复、只读输出组织 |
| 后端位置 | 多后端容易进入核心闭环 | 后端是承载方式，核心是传递语义和恢复语义 |
| observability / governance | tap 和 escalation 容易变成下游职责混写 | 只作为 bus read-only output 消费方 |
| Outbox | 旧文档容易直接写 worker 形态 | 只作为契约化输入 / 传递入口的一种来源 |

---

## 6. 结构化中间产物

### 6.1 仓存在必要性结论

`L0-bus` 的不可替代性在于：它把 `L0-core` 已定义的共享事件契约变成跨仓可传递、可恢复、可追溯的运行主干。

### 6.2 核心能力闭环结论

| 节点编号 | 能力节点 | 成立标准 |
|---|---|---|
| CL-001 | 契约化输入承接 | 输入必须基于 `L0-core` 契约或合法发布方材料 |
| CL-002 | 传递语义标准化 | bus 形成统一传递语义，不暴露为裸 MQ 差异 |
| CL-003 | 订阅推进 | 订阅方可以接收 delivery 并反馈结果 |
| CL-004 | 结果留痕 | delivery、ack / fail、幂等、因果链可追溯 |
| CL-005 | 失败恢复 | 失败可进入 retry、dead-letter、replay preparation |
| CL-006 | 只读输出 | SDK / observability / governance / operator 可消费 bus 输出且不反写 |

### 6.3 外围增强能力结论

| 能力 | 分类 |
|---|---|
| Redis / Kafka 完整适配 | P1/P2 增强 |
| Filter DSL | P1/P2 增强 |
| DLQ Console UI | 产品层增强 |
| Multi-tenant isolation | 企业化增强 |
| Effectively-once | 专项增强 |
| 完整 ops runbook | 运维文档增强 |

### 6.4 边界外能力结论

| 能力 | 归属 |
|---|---|
| Event schema / Error / TraceContext / Metadata | `L0-core` |
| SDK 高层 client | `L0-sdk` |
| 业务 payload 与业务幂等 | 发布方 / 订阅方 |
| Observability 存储查询 | `L4-observability` |
| Governance 决策 | `L1-governance` |
| MQ 集群部署 | 部署 / 运维文档 |

---

## 7. 回填草稿

```md
## 7. 核心能力闭环

> 校准来源：
> - `design-calibration/00_req_step_07_core_capability_loop.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“核心能力闭环图”“结构化中间产物”和“回填草稿”小节，了解本仓核心闭环如何从定位、目标和依赖关系收敛。

`L0-bus` 的不可替代性在于：它把 `L0-core` 已定义的共享事件契约变成跨仓可传递、可恢复、可追溯的运行主干。

```text
Core contract input
  |
  v
Transport semantic baseline
  |
  v
Delivery progression
  |
  v
Delivery result record
  |
  v
Failure recovery path
  |
  v
Read-only bus outputs
```

| 节点 | 能力 | 成立标准 |
|---|---|---|
| CL-001 | 契约化输入承接 | 输入必须基于 `L0-core` 契约或合法发布方材料 |
| CL-002 | 传递语义标准化 | bus 形成统一传递语义，不暴露为裸 MQ 差异 |
| CL-003 | 订阅推进 | 订阅方可以接收 delivery 并反馈结果 |
| CL-004 | 结果留痕 | delivery、ack / fail、幂等、因果链可追溯 |
| CL-005 | 失败恢复 | 失败可进入 retry、dead-letter、replay preparation |
| CL-006 | 只读输出 | SDK / observability / governance / operator 可消费 bus 输出且不反写 |

Redis / Kafka 完整适配、Filter DSL、DLQ Console UI、multi-tenant isolation、effectively-once 和完整 ops runbook 都是外围增强，不决定当前核心闭环是否成立。
```

---

## 8. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 Outbox relay 单独作为闭环节点 | 单独节点 | 作为契约化输入承接的一种来源 | 推荐 B。原因是 Outbox 是输入来源之一，不应改变主闭环结构 |
| Q-002 | 是否把 tap 单独作为闭环节点 | 单独节点 | 放在只读 bus outputs 下 | 推荐 B。原因是 tap 是只读输出的一类，不是独立主链 |

当前建议：接受上述推荐后进入 Step 8。

---

## 9. 进入下一步条件

- 已说明 `L0-bus` 的不可替代能力。
- 已收敛六个核心能力节点。
- 已区分核心能力、外围增强和边界外能力。
- 闭环图没有写成接口链、事件链、对象链或实现步骤。
