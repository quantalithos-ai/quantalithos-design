# Step 6. 容器 / 部署架构

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 6
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.7
> 回填位置: 正式 `01-架构设计.md` §7
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1~5 已通过;本文件通过前未创建 Step 7

## 1. 本步输入与解释口径

| 输入 | 本步承接 |
|---|---|
| Step 4 系统上下文 | AI Member 容器内 / 外正式边界与非运行关系。 |
| Step 5 BC-L2M-01~07 | 语义上下文到逻辑运行承载的映射。 |
| Runtime 正式 01 §7 | 运行承载角色不等于物理进程 / 容器 / 实例;entry、progression、continuation、feedback、state responsibility 逻辑分离。 |
| member-service / member-images 已通过 sibling 材料 | 容器 lifecycle / host health 外置;静态供给与 pinned component 方向外置且 pending。 |
| 旧正式 01 / README | 双进程、Rust、UDS gRPC、supervisord 仅作 historical audit。 |

本章的“运行单元”是逻辑承载角色,不声明实现、物理进程、容器实例、线程、存储或部署已经存在。AI Member 容器内同时存在 member boundary 与 Runtime boundary 的产品位置是当前范围前提;两者的物理进程数、进程管理器、通信载体和故障域仍未定。

## 2. SOP 问题回答

### 2.1 正式容器或运行单元

| ID | 逻辑运行单元 | 类型 | 主要职责 | 语义上下文映射 | 边界 |
|---|---|---|---|---|---|
| `RU-L2M-01` | Host / presence entry boundary | 同步 / 控制入口角色 | 受理启动主体与 host collaboration 语境,返回本地 acceptance / rejection / status | BC01;BC06 | 不拥有 host lifecycle / acceptance / health,不锁 server / client 方向。 |
| `RU-L2M-02` | Inbound fact consumption boundary | 异步输入角色 | 承接正式事件事实 / rule snapshot,交给入站语义形成 scope / screening | BC02;BC06 | 不拥有 Bus delivery / route,不保存 raw body。 |
| `RU-L2M-03` | Member interaction truth carrier | 正式状态责任 | 承载 BC01~05 的 member committed facts 与不变量 | BC01~05 | 物理存储 / schema / transaction 未定;不吸收 external truth。 |
| `RU-L2M-04` | Runtime mediation boundary | 容器内运行边界 | 承接 controlled delivery、entry result correlation 与 committed material reception | BC03;BC06 | transport / direction / schema pending;不拥有 Runtime state。 |
| `RU-L2M-05` | Outbound / safe handoff boundary | 异步输出角色 | 提交 interaction / observation safe material,记录 local attempt / gap | BC04;BC05;BC06 | 不拥有 Bus delivery / downstream / observed truth。 |
| `RU-L2M-06` | Projection / maintenance continuation | 后台 / 延后承载角色 | 重建 summary / outlet / diagnostic / explanation projection,对账 gap | BC07;BC05;BC06 | 可独立降级;不修改核心 truth。 |
| `RU-L2M-07` | Member read boundary | 只读输出角色 | 向正式消费者提供 body-free summary / outlet view | BC07 | 不触发 truth mutation;具体消费者 / protocol pending。 |
| `RU-L2M-08` | Member state storage responsibility | 正式存储责任 | 对 member truth、trace 和 projection 的物理承载责任留出边界 | BC01~07 | 只声明 responsibility;数据库、volume、durability、retention、atomicity 后移。 |

### 2.2 容器 / 部署架构图

```text
+============================================================================+
| AI Member container                                                        |
| lifecycle / host truth: L2-member-service   supply: L2-member-images       |
|                                                                            |
|  +---------------------------------------+  +-----------------------------+ |
|  | L2-member runtime boundary            |  | L2-runtime runtime boundary | |
|  |                                       |  |                             | |
|  | +---------------+  +---------------+ |  | entry / run / checkpoint / | |
|  | | Host/presence |  | Inbound facts | |  | outcome truth              | |
|  | | entry         |  | consumption   | |  |                             | |
|  | +-------+-------+  +-------+-------+ |  +--------------+--------------+ |
|  |         |                  |         |                 ^                |
|  |         v                  v         |                 |                |
|  | +---------------------------------+  |  +--------------+--------------+ |
|  | | Member interaction truth       |<-+->| Runtime mediation boundary  | |
|  | | carrier                        |  |  +-----------------------------+ |
|  | +---------------+-----------------+  |                                  |
|  |                 |                    |                                  |
|  |        +--------+---------+          |                                  |
|  |        v                  v          |                                  |
|  | +-------------+  +----------------+  |                                  |
|  | | Safe        |  | Projection /   |  |                                  |
|  | | handoff     |  | maintenance    |  |                                  |
|  | +-------------+  +-------+--------+  |                                  |
|  |                           |           |                                  |
|  |                           v           |                                  |
|  |                    +-------------+    |                                  |
|  |                    | Read boundary|    |                                  |
|  |                    +-------------+    |                                  |
|  +---------------------------------------+                                  |
+============================================================================+
| Outside: host control | L0-bus | Work / Identity / Governance | consumers  |
+============================================================================+
```

图示说明:

- member 与 Runtime 是同一 AI Member 容器内两个逻辑 runtime boundary,不是共享 truth 的一个运行单元。
- 图中框不承诺物理进程数、线程、sidecar、supervisor 或网络 topology;只表达职责承载。
- Member truth carrier 与 projection / maintenance 分离,因此读模型失败不阻塞核心提交。
- host control、Bus 和其他 owner 在容器外;member 不直接拥有容器生命周期或外部 backend。

### 2.3 同步入口、异步消费者与后台单元

| 入口类别 | 正式承载 | 当前成立语义 | 未锁定项 |
|---|---|---|---|
| host / startup / local control 受理 | RU01 | 立即形成 accept / reject / blocked / unknown 的 member 结论 | client / server、RPC、port、credential fields。 |
| 入站事实消费 | RU02 | 到达事实进入 subscription / screening;delivery truth 外置 | topic、subscription product、event family、ack semantics。 |
| Runtime boundary | RU04 | entry submission / result correlation 与 committed material reception 分层 | UDS / TCP / gRPC / pipe / shared memory、schema、backpressure mapping。 |
| 出站 / 观测 handoff | RU05 | local decision 已提交后形成 attempt / gap | route、event family、producer contract、delivery guarantee。 |
| projection / rebuild / reconciliation | RU06 | 可延后、可重建、失败独立 | scheduler、worker、frequency、retention。 |
| read consumption | RU07 | 只读 body-free view,不改 truth | API / SDK / event / cache 载体。 |

### 2.4 数据库 / 缓存 / 总线接入

- `L0-bus` 只经 RU02 / RU05 的正式事件边界接入,不直接写 RU03 / RU08。
- RU08 只声明本仓必须有可保护 truth / projection 分离的状态责任;不预设数据库、embedded store、volume、cache 或 remote service。
- 任何 cache / projection 若后续引入,只能位于 RU06 / RU07 一侧并显式 stale,不得成为 RU03 写源。
- Runtime 的 state responsibility 与 member 的 RU08 必须保持独立 owner,即使物理上同 volume / process 的候选未来出现,也不得共享可变 truth 或事务边界。

### 2.5 哪些单元必须分开部署,哪些可以同部署

| 关系 | 当前结论 | 理由 |
|---|---|---|
| member boundary vs Runtime boundary | 逻辑必须分离;当前产品位置允许同一 AI Member 容器内共置;物理进程未定 | owner、失败与 upgrade boundary 不能因共置而合并。 |
| RU03 core truth vs RU06 / RU07 projection | 逻辑必须分离;可同部署 | projection / query failure 不得阻塞或反写核心。 |
| RU01 / RU02 / RU04 / RU05 adapters vs core truth | 逻辑必须分离;可同部署 | transport / event / host 变化不定义领域 truth。 |
| member vs member-service / Bus / external truth owners | 必须在独立系统边界;不共享 member truth | 生命周期、delivery 与外部 truth owner 不同。 |
| member-images supply vs running member | build / supply 与 runtime 必须分层 | image availability / compatibility 不等于 running presence。 |
| RU08 physical state | 未决定本地 / 外置 / durable 形态 | 无 transaction / failure / workload authority。 |

### 2.6 正式主路径

1. Host / startup context 经 RU01 形成可归属本地 presence,但 host verdict 外置。
2. Bus / rule inputs 经 RU02 形成 screening,再由 RU03 / RU04 形成 Runtime delivery local fact。
3. Runtime committed safe material 经 RU04 受理来源,由 RU03 形成 outbound local decision,再经 RU05 handoff。
4. RU03 已提交事实向 BC05 / RU06 提供安全关联 / projection source;核心提交不等待 RU05 delivery 或 RU06 rebuild。

这些是逻辑承载关系,不是具体线程、函数或协议时序。

## 3. 部署边界与失效口径

| 失效位置 | 允许影响 | 不允许影响 |
|---|---|---|
| RU01 / host seam | 新 presence blocked / rejected;host collaboration gap | 已提交 member history 被删除;host truth 被猜测。 |
| RU02 / Bus ingress | 新入站 waiting / degraded | Runtime 代收 raw body;现有 outbound truth 回滚。 |
| RU04 Runtime seam | delivery waiting / gap;无 committed material 则不出站 | member 代答 / 创建 run / restart Runtime。 |
| RU05 handoff | attempt / gap | outbound decision / Runtime outcome 回滚;伪造 delivered。 |
| RU06 / RU07 | projection stale / unavailable | RU03 核心提交失败或 projection 反写。 |
| RU08 commit unknown | 受影响决定保持 unknown / fenced | 盲重试或部分成功声明;具体恢复机制后移。 |

`RU08 commit unknown` 是架构必须显式承接的失败类别,不是已证明的物理事务合同。详细一致性、持久化和恢复在后续文档收敛。

## 4. 当前文档问题诊断与取舍

| 旧结论 | 当前处理 | 理由 |
|---|---|---|
| 固定 `member process + runtime process` | 改为两个逻辑 runtime boundary;物理进程数未定 | 与 Runtime 正式架构的承载口径一致。 |
| supervisord 固定入口 | historical only | lifecycle / process manager 无 authority。 |
| member main / identity / subscriber / publisher / attention / ipc 模块即运行单元 | 不继承 | 混淆源码模块、子域与部署角色。 |
| UDS gRPC / external gRPC | transport pending | L2M-UP-001 / 003 未闭口。 |
| audit events 直接写 observability | RU05 safe handoff attempt / gap | observed truth 外置。 |
| 单进程内强一致 | 只锁 RU03 / RU08 state responsibility | 物理 process / store / atomicity 未定。 |

## 5. 结构化中间产物与回填草稿

- 逻辑运行单元: `RU-L2M-01~08`。
- AI Member 容器内: member runtime boundary + Runtime runtime boundary,逻辑 owner 分离;物理 topology pending。
- 容器外: host control、Bus、external truth owners、downstream consumers;build supply 单独分层。
- 核心提交不依赖 handoff delivery、projection rebuild 或 read availability。
- RU08 只声明 state responsibility,不伪造 storage / transaction readiness。

正式 §7 回填运行承载图、正式承载单元表、入口 / 后台 / 存储责任和部署边界。不得写 Rust、UDS、gRPC、supervisord、port、DB、volume、scheduler 或已经部署。

## 6. 门禁自检

| 检查项 | 结果 |
|---|---|
| 正式容器 / 运行单元、入口、后台、存储责任是否齐全 | pass |
| 图是否使用 text ASCII 且有说明 | pass |
| 语义上下文与运行单元是否区分 | pass |
| member / Runtime / host / Bus / build supply owner 是否分开 | pass |
| 是否把源码目录或技术栈写成容器 | pass:未写 |
| 是否锁定物理进程、transport、store、scheduler 或部署事实 | pass:未锁定 |
| 是否把 projection / handoff 设为核心同步前置 | pass:未设 |
| Step 6 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_07_dependency_direction.md`;正式 `01` 仍禁止修改。
