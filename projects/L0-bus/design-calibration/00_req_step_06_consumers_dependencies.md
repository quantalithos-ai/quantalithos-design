# Step 6. 使用方与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填章节: `00-需求文档.md` §6 使用方与依赖
> 生成日期: 2026-05-29

---

## 1. 本步目标

说明 `L0-bus` 在仓际协作网络中依赖谁、为谁提供能力，以及哪些依赖会阻塞当前核心能力闭环成立。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓边界 | 确认 bus 不反向定义 core，不承担 sdk / observability / governance 职责 |
| Step 5 角色结论 | 将发布方、订阅方、tap consumer、operator 等角色映射为仓际关系 |
| `L0-core` 稳定文档 | 作为 bus 最关键输入依赖 |
| 全局依赖计划 | 确认 `L0-bus` 是 `L0-core` 后的底座仓 |

---

## 3. 应问的问题与回答

### 3.1 本仓向哪些仓 / 系统提供哪些能力？

`L0-bus` 向上层提供的是传递能力、失败恢复能力和总线级只读输出，而不是业务语义：

| 使用方 | 获得能力 |
|---|---|
| L1 / L2 / L3 发布方 | 发布已提交事实或事件进入统一 bus 传递链 |
| L1 / L2 / L3 订阅方 | 接收 delivery，并围绕 ack / fail / idempotency 处理 |
| `L0-sdk` | 消费 transport contract / transport view，封装开发者体验 |
| `L4-observability` | 消费 tap、trace、bus audit material |
| `L1-governance` | 消费 failure material / dead-letter summary，进入策略与审批 |
| `L4-archive` | 按需消费事件和 audit material，形成归档输入 |
| `L5-chat` / `L5-console` / `L5-runner` / `L5-sync` | 间接通过 L1 / SDK / observability 消费事件变化和运行状态 |
| SRE / operator | 读取 lag、DLQ、replay、backend health 等运行材料 |

### 3.2 本仓依赖哪些仓 / 系统提供哪些能力？

| 依赖对象 | 提供能力 | 是否闭环前置 |
|---|---|---|
| `L0-core` | Event / Error / TraceContext / Metadata / ActorRef 等共享契约 | 是 |
| 发布方仓 | 合法业务 payload 或已提交 outbox fact | 是，但可用 fixture / sample 代表 |
| 消息后端能力 | 实际传递、持久化或测试传输能力 | 是，P0 可用默认后端或 in-memory / fake path 验证 |
| 存储能力 | delivery history、dead-letter、audit、replay material 的持久化基础 | 是 |
| `L0-sdk` | 开发者体验封装 | 否，对 bus 闭环不是前置 |
| `L4-observability` | 长期观测存储和查询 | 否，对 bus 闭环不是前置 |
| `L1-governance` | 审批和策略决策 | 否，对 bus 闭环不是前置 |
| `L4-archive` | 归档存储和恢复 | 否，对 bus 闭环不是前置 |

### 3.3 哪些依赖失效会影响当前阶段能力？

| 依赖 | 失效影响 |
|---|---|
| `L0-core` 契约不可用 | bus 无法判断合法事件包络、错误、trace 和 metadata 口径 |
| 发布方样本不可用 | 无法验证 payload / outbox fact 如何进入传递链 |
| 消息后端或 fake 后端不可用 | 无法验证 publish / delivery / ack / fail 主路径 |
| 持久化能力不可用 | 无法验证 retry、dead-letter、replay、audit 的需求闭环 |
| observability 不可用 | 不阻塞 bus 主闭环，但 tap / audit consume 只能通过 boundary 验证 |
| governance 不可用 | 不阻塞 bus 主闭环，但 failure material 只能通过 boundary 验证 |

### 3.4 哪些关系只是消费 / 引用，哪些形成强阻塞？

| 类型 | 对象 |
|---|---|
| 强输入前置 | `L0-core`、发布方样本、消息后端或 fake 后端、持久化能力 |
| 主要输出消费方 | L1 / L2 / L3 发布订阅方、`L0-sdk`、`L4-observability`、`L1-governance`、SRE / operator |
| 非阻塞下游 | `L4-archive`、L5 / L6 产品与生态层 |
| 只作为规模样本 | `architecture/bus-draft/event-catalog.md` |

---

## 4. 改动前后差异

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 上游依赖 | 写 `quantalithos-core`，但同时把 event catalog 当事件来源 | `L0-core` 是直接稳定上游，event catalog 只是规模样本 |
| 下游依赖 | 平铺所有 L1/L2/L3/L4/L5/L6 | 区分主输出消费方、非阻塞下游、只读消费方 |
| 外部后端 | NATS / Redis / Kafka 都像强前置 | P0 只要求有可验证默认或 fake backend path，完整多后端后移 |
| observability / governance | 与 bus 能力混写 | 作为只读消费方，不阻塞 bus 主闭环 |

---

## 5. 结构化中间产物

### 5.1 协作关系图

```text
                      +----------------+
                      |    L0-core     |
                      | shared events  |
                      +--------+-------+
                               |
                               v
+----------------+      +------+-------+      +----------------+
| publishers     | ---> |    L0-bus    | ---> | subscribers    |
| L1/L2/L3       |      | delivery and |      | L1/L2/L3       |
+----------------+      | recovery     |      +----------------+
                        +------+-------+
                               |
             +-----------------+-----------------+
             v                 v                 v
        +---------+      +------------+     +------------+
        | L0-sdk  |      | observability |   | governance |
        | view    |      | tap/audit     |   | failure    |
        +---------+      +------------+     +------------+
```

本图表达仓际能力关系，不表达接口调用顺序、运行时调用链或数据表结构。

### 5.2 仓际能力关系结论

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享事件契约、错误、trace、metadata、actor/ref | 是 | bus 无法形成合法传递语义 |
| 输入 | 发布方仓 | 合法 payload 或 outbox fact | 是，可用样本替代 | 无法验证发布入口 |
| 输入 | 消息后端 / fake 后端 | 传输或测试传输能力 | 是 | 无法验证 delivery 主链 |
| 输入 | 持久化能力 | delivery / DLQ / replay / audit 留痕 | 是 | 无法验证恢复和审计闭环 |
| 输出 | L1 / L2 / L3 订阅方 | delivery、ack/fail 语义和恢复语义 | 是，对对方是前置 | 下游事件协作不稳定 |
| 输出 | `L0-sdk` | transport contract / consume view | 否 | SDK 封装可能延迟，但不阻塞 bus 闭环 |
| 输出 | `L4-observability` | tap、trace、audit material | 否 | 观测视图延迟，但不阻塞 bus 主传递 |
| 输出 | `L1-governance` | failure material / DLQ summary | 否 | 治理决策延迟，但 bus failure truth 保留 |
| 输出 | SRE / operator | lag、DLQ、replay、backend health 材料 | 是，对运行可控性是前置 | 无法处置运行异常 |

### 5.3 闭环前置依赖结论

当前 `L0-bus` 需求闭环的强前置是：

1. `L0-core` 稳定契约。
2. 发布方样本或 fixture。
3. 可验证消息后端路径。
4. 可验证持久化路径。

`L0-sdk`、observability、governance、archive、L5/L6 产品层是重要消费方，但不是 bus 需求闭环成立的前置条件。

---

## 6. 回填草稿

```md
## 6. 使用方与依赖

> 校准来源：
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“协作关系图”和“回填草稿”小节，了解本仓输入依赖、输出消费方和闭环前置关系如何收敛。

### 6.1 协作关系图

```text
                      +----------------+
                      |    L0-core     |
                      | shared events  |
                      +--------+-------+
                               |
                               v
+----------------+      +------+-------+      +----------------+
| publishers     | ---> |    L0-bus    | ---> | subscribers    |
| L1/L2/L3       |      | delivery and |      | L1/L2/L3       |
+----------------+      | recovery     |      +----------------+
                        +------+-------+
                               |
             +-----------------+-----------------+
             v                 v                 v
        +---------+      +------------+     +------------+
        | L0-sdk  |      | observability |   | governance |
        | view    |      | tap/audit     |   | failure    |
        +---------+      +------------+     +------------+
```

### 6.2 依赖与使用方

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 |
|---|---|---|---|
| 输入 | `L0-core` | 共享事件契约、错误、trace、metadata、actor/ref | 是 |
| 输入 | 发布方仓 | 合法 payload 或 outbox fact | 是，可用样本替代 |
| 输入 | 消息后端 / fake 后端 | 传输或测试传输能力 | 是 |
| 输入 | 持久化能力 | delivery / DLQ / replay / audit 留痕 | 是 |
| 输出 | L1 / L2 / L3 订阅方 | delivery、ack/fail 语义和恢复语义 | 对对方是前置 |
| 输出 | `L0-sdk` | transport contract / consume view | 否 |
| 输出 | `L4-observability` | tap、trace、audit material | 否 |
| 输出 | `L1-governance` | failure material / DLQ summary | 否 |
| 输出 | SRE / operator | lag、DLQ、replay、backend health 材料 | 是，对运行可控性是前置 |
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | `L0-sdk` 是否是 bus 闭环前置 | 是 | 不是，只是重要消费方 | 推荐 B。原因是 bus 传递闭环可以先独立成立，SDK 封装后续消费 |
| Q-002 | observability / governance 是否阻塞 bus 闭环 | 是 | 不是，通过 boundary view 验证即可 | 推荐 B。原因是它们消费 bus 输出，不拥有 bus truth |
| Q-003 | 真实 MQ 后端是否必须作为需求闭环前置 | 必须真实后端 | P0 可用默认或 fake backend path 验证语义 | 推荐 B。原因是需求闭环先确认平台语义，完整后端矩阵后移 |

当前建议：接受上述推荐后进入 Step 7。

---

## 8. 进入下一步条件

- 已明确 `L0-core` 是强输入前置。
- 已明确发布方样本、消息后端路径、持久化路径是闭环前置。
- 已明确 `L0-sdk`、observability、governance 是重要消费方但不阻塞 bus 主闭环。
- 没有把接口名、事件名或主链步骤写成本章主体。
