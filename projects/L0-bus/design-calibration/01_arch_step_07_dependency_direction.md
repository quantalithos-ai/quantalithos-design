## Step 7. 依赖方向与层间约束

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-bus/01-架构设计.md` §8 依赖方向与层间约束

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.8 依赖方向与层间约束
  - `standards/document/架构设计讨论流程_SOP.md` Step 7
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `projects/L0-bus/design-calibration/01_arch_step_05_bounded_context.md`
  - `projects/L0-bus/design-calibration/01_arch_step_06_container_deployment.md`
- 已确认结论：
  - `L0-bus` 编译期只依赖 `L0-core`。
  - MQ backend 和 Bus store 属于运行期能力。
  - 发布方、订阅方、observability、governance、SDK、operator 与 bus 的关系不是 Cargo 直接依赖。

### 3. SOP 问题回答

1. 本仓内部层次如何划分？

   回答：内部层次按传递语义核心、应用编排层、边界适配层、基础设施接入层、只读输出层划分。核心语义层不得依赖后端、持久化或入口实现。

2. 允许哪些依赖方向？

   回答：允许外层依赖内层，入口和后台任务依赖应用编排，应用编排依赖传递语义核心和端口抽象，基础设施接入通过边界倒置实现后端和存储能力。

3. 禁止哪些反向依赖？

   回答：禁止传递语义核心依赖 MQ backend、数据库、HTTP / RPC 入口、SDK、observability、governance 或具体业务仓；禁止只读输出反写核心真相；禁止后端 adapter 决定上层 transport semantic。

4. 外部系统通过哪些正式边界接入？

   回答：发布方通过发布材料入口接入，订阅方通过 delivery 和结果反馈边界接入，MQ backend 通过 adapter 边界接入，持久化通过 store boundary 接入，observability / governance / SDK / operator 通过只读输出或受控恢复边界接入。

5. 本仓在全局依赖基线中涉及哪些跨仓依赖边？

   回答：涉及 `L0-core` 编译期依赖、消息后端和存储运行期依赖、全平台发布 / 订阅事件协作、`L0-sdk` 消费视图、`L4-observability` 消费 tap / audit material、`L1-governance` 消费 failure material。

6. 哪些依赖边进入本仓架构主链，哪些被裁剪出去？

   回答：`L0-core`、MQ backend、Bus store、发布方、订阅方、只读消费方进入主链。DLQ UI、具体管理后台、完整 Redis / Kafka 生产适配、多租户和 effectively-once 裁剪出 P0 主链。

7. 进入主链的跨仓依赖分别是编译期依赖、运行期依赖，还是事件协作依赖？

   回答：`L0-core` 是编译期依赖；MQ backend、Bus store 是运行期依赖；发布方、订阅方、observability、governance、SDK、operator 与 bus 的关系主要是事件协作、只读消费或控制边界，不是直接编译依赖。

8. 哪些依赖必须倒置，不能直接侵入核心语义层？

   回答：MQ backend、持久化、入口协议、只读输出投影、恢复控制和外部消费方都必须通过端口或边界倒置接入。

9. 哪些规则若不先写清，后续实现最容易失控？

   回答：最容易失控的是把发布方 / 订阅方写成 Cargo 依赖，把后端产品能力写成核心语义，把 observability / governance 读模型写成反写入口，把 Outbox relay 直接访问业务表写成默认做法。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §7.1 | 旧图按 crate 名和后端包名画依赖 | 源码组织、后端产品和架构层次混淆 |
| §7.2 | 上层只依赖 EventBus trait 等规则有价值，但绑定 trait 名称 | 需要提升为端口 / 边界规则 |
| §7.3 | OutboxPublisher、TapSubscriber、ReplayCommand 等直接作为接口出现 | 接口命名和函数形态应后移 |
| 全文 | 缺少编译期 / 运行期 / 事件协作依赖分类 | 容易把事件协作误写成 path dependency |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 层次划分 | crate / adapter / CLI 依赖图 | 语义核心、应用编排、边界适配、基础设施接入、只读输出 | 架构层不被源码目录牵引 |
| 跨仓依赖 | 上层依赖 EventBus trait 的泛化说法 | `L0-core` 是唯一编译期上游，其他关系分类处理 | 对齐全局依赖裁剪规则 |
| 后端关系 | NATS / Redis / Kafka adapter 并列为依赖 | MQ backend 作为运行期能力，通过 adapter boundary 接入 | 具体产品后移到选型 |
| 只读消费 | tap / observability 等关系分散 | 只读消费不反写，且不形成 Cargo 依赖 | 守住 bus truth |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：继续按 crate 和 adapter 画依赖 | 接近实现 | 提前锁死目录与包结构 | 不采用 |
| 方案 B：按架构层和依赖类型表达 | 能指导实现且不锁死细节 | 需要详细设计再落 crate | 采用 |
| 方案 C：把发布方和订阅方作为 bus 直接依赖 | 调用关系直观 | 造成事件主干依赖业务仓 | 不采用 |

### 7. 结构化中间产物

#### 7.1 层次划分结论

| 层次 | 职责 | 允许依赖 |
|---|---|---|
| 传递语义核心 | 表达 publication、delivery、feedback、recovery、audit 等核心语义。 | 只依赖 `L0-core` 契约和本层语义对象。 |
| 应用编排层 | 编排发布接入、delivery 推进、反馈处理、恢复控制和只读输出生成。 | 可依赖传递语义核心和边界端口。 |
| 边界适配层 | 承接入口、订阅方反馈、只读消费和运维控制边界。 | 可依赖应用编排层，不反向进入核心。 |
| 基础设施接入层 | 接入 MQ backend、Bus store、时间 / ID / trace 基础能力。 | 通过端口实现被应用层调用。 |
| 只读输出层 | 派生 transport view、tap、audit material、failure material。 | 只读消费 bus truth，不反写核心。 |

#### 7.2 依赖方向图

```text
                 +----------------------+
                 | boundary adapters    |
                 | api / workers / views|
                 +----------+-----------+
                            |
                            v
                 +----------+-----------+
                 | application          |
                 | orchestration        |
                 +----------+-----------+
                            |
                            v
                 +----------+-----------+
                 | delivery semantics   |
                 | core                 |
                 +----------+-----------+
                            |
                            v
                 +----------+-----------+
                 | L0-core contracts    |
                 +----------------------+

                 +----------------------+
                 | infrastructure       |
                 | MQ / store adapters  |
                 +----------------------+
                            ^
                            |
                  implemented via ports
```

该图只表达架构层依赖方向，不表达源码目录、crate、函数调用或部署顺序。

#### 7.3 本仓依赖裁剪表

| 对象 | 来自总依赖矩阵的关系 | 方向 | 类型 | 是否进入本仓主链 | 裁剪原因 |
|---|---|---|---|---|---|
| `L0-core` | `L0-bus` depends on `L0-core` | 依赖方 | 编译期 | 是 | 共享契约来源，P0 必需 |
| MQ backend | 运行期依赖 | 依赖方 | 运行期 | 是 | delivery 默认可验证路径需要传输能力 |
| Bus store / persistence | 运行期依赖 | 依赖方 | 运行期 | 是 | delivery、DLQ、audit、replay material 必须可追溯 |
| 发布方仓 | 通过 bus 发布事件 | 协作方 | 事件协作 | 是 | 提供发布材料或 outbox fact |
| 订阅方仓 | 通过 bus 订阅事件 | 协作方 | 事件协作 | 是 | 接收 delivery 并反馈结果 |
| `L0-sdk` | consumes L0-core and L0-bus | 被消费方 | 只读消费 / SDK 自身依赖 | 是 | bus 提供 transport view，不依赖 SDK |
| `L4-observability` | 通过 bus 消费 tap / audit | 被消费方 | 事件协作 / 只读消费 | 是 | bus 提供只读材料，不依赖 observability |
| `L1-governance` | 消费 failure material | 被消费方 | 事件协作 / 只读消费 | 是 | bus 提供失败事实，不生成决策 |
| `L5-console` | DLQ UI / 管理入口 | 被消费方 | 运行期消费 | 否，P1/P2 | 当前 P0 不设计 DLQ UI |
| Redis / Kafka 完整生产 adapter | 后续后端增强 | 依赖方 | 运行期 | 否，P1/P2 | 当前只要求 adapter boundary + 默认可验证路径 |

#### 7.4 依赖类型分类表

| 依赖类型 | 对象 | 能力面 | 后续落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | Event、Error、TraceContext、Metadata、ActorRef 等共享契约 | 详细设计 / 实施计划 |
| 运行期依赖 | MQ backend | 传输能力 | 容器 / 技术选型 / 实施计划 |
| 运行期依赖 | Bus store / persistence | delivery、DLQ、audit、replay material 留痕 | 数据所有权 / 技术选型 |
| 事件协作依赖 | 发布方仓 | publish / outbox fact 输入 | 关键交互 / 测试 |
| 事件协作依赖 | 订阅方仓 | delivery / feedback | 关键交互 / 测试 |
| 只读消费边界 | `L0-sdk` / observability / governance / operator | transport view、tap、failure material、运行材料 | 关键交互 / 横切关注点 |

#### 7.5 本仓禁止依赖表

| 禁止依赖 | 原因 |
|---|---|
| `L0-bus` 直接依赖任一 L1 / L2 / L3 业务仓代码 | 会让事件主干反向依赖业务域。 |
| 传递语义核心直接依赖 MQ backend SDK | 会让后端差异污染上层 transport semantic。 |
| 传递语义核心直接依赖数据库实现 | 会把存储细节写进核心语义。 |
| 只读输出反向调用核心写路径修改 truth | 会形成第二写入面。 |
| bus 直接依赖 `L0-sdk` | SDK 是消费方，不能反向定义 bus。 |
| bus 直接依赖 observability 或 governance 的正文模型 | 会打穿观测和治理边界。 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §8 “依赖方向与层间约束”直接摘录并润色本文件 §7.1、§7.2、§7.3、§7.4、§7.5。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 发布方 / 订阅方是否作为 bus 编译期依赖 | A. 是；B. 否，只作为事件协作关系；C. 由各仓决定 | B | bus 是主干，不应反向依赖业务仓 | 已确认采用 B |
| MQ backend SDK 是否可进入核心语义层 | A. 可以；B. 不可以，只能经 adapter / port；C. 当前不约束 | B | 后端差异不能污染 transport semantic | 已确认采用 B |
| `L0-sdk` 是否是 bus 依赖 | A. bus 依赖 SDK；B. SDK 消费 bus，bus 不依赖 SDK；C. 双向依赖 | B | SDK 是体验封装层，不能反向定义 bus | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 8 的待确认事项。
- 具体 crate 分层、trait 名称、adapter 包名和 Cargo path dependency 在详细设计 / 实施计划中落地。

### 10. 进入下一步条件

- 已明确内部层次和依赖方向。
- 已裁剪本仓跨仓依赖子图。
- 已区分编译期、运行期、事件协作和只读消费边界。
- 可以进入 Step 8 数据所有权与一致性策略。
