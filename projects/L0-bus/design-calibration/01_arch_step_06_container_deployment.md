## Step 6. 容器 / 部署架构

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-bus/01-架构设计.md` §7 容器 / 部署架构

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.7 容器 / 部署架构
  - `standards/document/架构设计讨论流程_SOP.md` Step 6
  - `projects/L0-bus/design-calibration/01_arch_step_04_system_context.md`
  - `projects/L0-bus/design-calibration/01_arch_step_05_bounded_context.md`
- 已确认结论：
  - `L0-bus` 有同步入口、异步 delivery 推进、失败恢复、只读输出和后端适配边界。
  - 当前阶段必须存在默认可验证 delivery path。
  - 具体后端产品和 Rust crate 布局后续再定。

### 3. SOP 问题回答

1. 这个仓运行时有哪些正式容器或运行单元？

   回答：正式运行单元包括 Bus API、Delivery worker、Outbox relay worker、Recovery worker、Read output worker、Bus store 和 MQ backend capability。

2. 同步入口在哪里？

   回答：同步入口位于 Bus API，承接发布材料接入、delivery 结果反馈、恢复控制和只读查询边界。

3. 异步消费者或后台任务在哪里？

   回答：Delivery worker 推进 delivery，Outbox relay worker 承接已提交事实进入 bus，Recovery worker 处理失败恢复，Read output worker 派生只读材料。

4. 数据库 / 缓存 / 总线如何接入？

   回答：Bus store 承载 delivery、DLQ、audit 和 replay preparation 等可追溯材料；MQ backend capability 承载实际传输能力；缓存不是当前架构必须容器。

5. 哪些运行单元必须分开部署，哪些可以同部署？

   回答：架构上必须分清职责，但 P0 可同部署为一个服务进程加后台任务；当吞吐、隔离或运维需要增加时，各 worker 可独立部署。

6. 哪些通信关系是正式主路径？

   回答：发布方或 outbox fact 进入 Bus API / Outbox relay，写入可追溯材料，经 Delivery worker 通过 MQ backend 推进到订阅方，再把结果回写 bus truth，并派生只读输出。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §6 | 旧图直接以 `quantalithos-bus-api`、`quantalithos-bus-nats`、`quantalithos-bus-redis` 等 crate 画容器 | 源码包和技术选型误画成运行容器 |
| §6.2 | 直接列 Rust crate 与后端产品 | 当前尚未到 Step 10，不能提前锁死后端和 package 结构 |
| §6.3 | 以 MVP-M / MVP-C / MVP-E 写具体部署 | 架构阶段应先明确运行单元和可分离边界 |
| §6.4 | 直接出现 NATS、PostgreSQL、tap-all | 部分可迁移为后续技术选型或实施，不应作为当前容器基线 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 容器单位 | Rust crate、后端 adapter、CLI 混画 | Bus API、workers、Bus store、MQ backend capability | 容器视图表达运行职责 |
| 默认路径 | 默认 NATS + 四后端演进 | 默认可验证 delivery path，具体后端 Step 10 决策 | 避免提前技术选型 |
| 部署关系 | 按 MVP 阶段写具体部署 | P0 可同部署，后续按吞吐和隔离拆分 | 架构先定义可分离边界 |
| 存储表达 | PostgreSQL / backend store 混写 | Bus store 作为可追溯材料存储边界 | 具体存储产品后续再定 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按 crate / package 画容器 | 对实现者直观 | 混淆源码组织和运行部署 | 不采用 |
| 方案 B：按运行职责画逻辑容器，允许 P0 同部署 | 边界清晰，兼顾实现起步 | 需要后续详细设计映射到 crate | 采用 |
| 方案 C：强制所有 worker 独立部署 | 隔离强 | P0 复杂度过高 | 不采用 |

### 7. 结构化中间产物

#### 7.1 容器 / 部署图

```text
              +----------------------+
              | publisher / operator |
              +----------+-----------+
                         |
                         v
              +----------+-----------+
              |      Bus API         |
              | sync entrypoints     |
              +----------+-----------+
                         |
          +--------------+--------------+
          |                             |
          v                             v
+---------+----------+        +---------+----------+
|   Bus store        |<------>|   Delivery worker  |
| truth and audit    |        | async progression  |
+---------+----------+        +---------+----------+
          ^                             |
          |                             v
+---------+----------+        +---------+----------+
| Recovery worker    |        | MQ backend         |
| retry/DLQ/replay   |        | transport ability  |
+---------+----------+        +---------+----------+
          ^                             |
          |                             v
+---------+----------+        +---------+----------+
| Outbox relay       |        | subscriber repos   |
| committed facts    |        | delivery consumers |
+---------+----------+        +--------------------+
          |
          v
+---------+----------+
| Read output worker |
| views/materials    |
+--------------------+
```

该图表达运行容器和后台处理边界，不表达源码目录、crate、接口名或事件名。

#### 7.2 容器职责表

| 容器 / 运行单元 | 职责 | 部署口径 |
|---|---|---|
| Bus API | 承接同步入口，包括发布材料、反馈、恢复控制和只读查询边界。 | P0 可与后台任务同部署。 |
| Delivery worker | 推进已接受材料到订阅方 delivery，并处理传递进度。 | P0 可同部署，后续可独立扩缩。 |
| Outbox relay worker | 承接已提交 outbox fact 进入 bus 发布材料链。 | P0 可同部署或作为后台任务，形态后续细化。 |
| Recovery worker | 推进 retry、dead-letter、replay preparation 等失败恢复路径。 | 可与主服务同部署，但必须保留受控恢复边界。 |
| Read output worker | 派生 transport view、tap、audit material、failure material。 | 不应阻塞 bus truth 写路径。 |
| Bus store | 保存 delivery、ack/fail、DLQ、audit、replay material 等可追溯材料。 | 是默认可验证路径的必要能力。 |
| MQ backend capability | 承载实际传输能力。 | 具体产品由 Step 10 决策。 |

#### 7.3 部署关系结论

- P0 默认允许单服务进程承载 Bus API 和后台任务，但逻辑容器边界必须清晰。
- Bus store 和 MQ backend capability 是默认可验证路径的必要外部能力。
- 当吞吐、隔离、恢复或观测压力上升时，Delivery worker、Recovery worker、Outbox relay worker、Read output worker 可以分别拆分部署。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §7 “容器 / 部署架构”直接摘录并润色本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| P0 是否强制拆分所有 worker | A. 全部独立部署；B. P0 可同部署但逻辑分离；C. 全部合成一个不可分单元 | B | 既能快速建立默认可验证路径，又保留后续扩展边界 | 已确认采用 B |
| 是否在 Step 6 选定 NATS / Redis / Kafka | A. 直接选 NATS；B. 只保留 MQ backend capability；C. 不画后端 | B | 技术选型应在 Step 10，Step 6 只确认运行能力边界 | 已确认采用 B |
| Read output worker 是否阻塞主链 | A. 可以阻塞；B. 不应阻塞 bus truth 写路径；C. 不提供只读输出 | B | 只读派生不能影响主链传递事实 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 7 的待确认事项。
- 具体后端产品、存储产品、crate 名称、API 路径和 worker 实现方式后移。

### 10. 进入下一步条件

- 已明确运行时容器、入口、后台处理单元和存储 / 后端能力边界。
- 已确认 P0 可同部署但逻辑职责必须分离。
- 可以进入 Step 7 依赖方向与层间约束。
