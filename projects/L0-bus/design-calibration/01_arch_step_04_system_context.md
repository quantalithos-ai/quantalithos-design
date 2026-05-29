## Step 4. 系统边界与上下文

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-bus/01-架构设计.md` §5 系统边界与上下文

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.5 系统边界与上下文
  - `standards/document/架构设计讨论流程_SOP.md` Step 4
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/design-calibration/01_arch_step_01_requirements_baseline.md`
  - `projects/L0-bus/design-calibration/01_arch_step_03_responsibility_boundary.md`
- 已确认结论：
  - `L0-core` 是契约来源上游。
  - 发布方、订阅方、`L0-sdk`、`L4-observability`、`L1-governance`、operator 和 MQ backend 是正式上下文对象。
  - 本 Step 不展开内部职责、子域、容器、数据所有权或接口协议。

### 3. SOP 问题回答

1. 这个仓在全局系统中的位置是什么？

   回答：`L0-bus` 位于 L0 底座层，承接 `L0-core` 共享契约，并为上层发布方、订阅方和只读消费方提供跨仓事件传递主干。

2. 它有哪些正式上游？

   回答：正式上游是 `L0-core` 和发布方仓。`L0-core` 提供共享契约，发布方仓提供合法发布材料或已提交 outbox fact。

3. 它有哪些正式下游？

   回答：正式下游包括订阅方仓、`L0-sdk`、`L4-observability`、`L1-governance`、operator / SRE 和后续产品层消费方。

4. 它从外部接收哪些输入面？

   回答：接收共享契约输入、发布材料输入、outbox fact 输入、订阅方结果反馈输入、失败恢复控制输入和后端传输能力输入。

5. 它向外部提供哪些输出面？

   回答：提供 delivery 输出、结果材料、失败恢复材料、bus audit / delivery history、transport view、tap output、failure material 和运行状态材料。

6. 哪些外部系统或相邻仓构成正式上下文边界？

   回答：`L0-core`、发布方仓、订阅方仓、`L0-sdk`、`L4-observability`、`L1-governance`、MQ backend、持久化能力和 operator / SRE 构成正式上下文边界。

7. 依赖失效时，本仓的降级口径是什么？

   回答：`L0-core` 契约不可用时拒绝形成合法发布材料；发布材料不合法时拒绝接入；后端不可用时 delivery 挂起或进入失败恢复材料；持久化不可用时不得生成不可追溯状态；只读消费方不可用时不得阻塞 bus truth 正常推进。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §4.1 | 把 CloudEvents、W3C、NATS / Redis / Kafka docs 等标准和文档对象画成系统上下文 | 混淆标准来源、文档来源和运行时上下文 |
| §4.1 | 出现 L4 archive、L5/L6 等未按新版需求裁剪的下游 | 下游边界不够精确 |
| §4.2 | 上下文关系和职责清单混写 | 系统边界、职责边界和实现结构不清 |
| §4.3 | 直接列 NATS、PostgreSQL、Redis、Kafka SLA | 提前锁死后端和部署口径 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图中对象 | 标准、文档、后端产品、仓和角色混画 | 只画正式相邻仓、外部能力和消费方 | 系统上下文表达运行协作边界 |
| 上游表达 | 未突出 `L0-core` 是直接契约上游 | 明确 `L0-core` 提供共享契约，发布方提供发布材料 | 对齐 Step 1 |
| 下游表达 | 泛化为 L1、L2、archive、L5/L6 | 区分订阅方、SDK、observability、governance、operator | 避免输出面职责串线 |
| 后端表达 | NATS / Redis / Kafka 固定为系统 | 抽象为 MQ backend 和 persistence capability | 具体选型后移到 Step 10 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧 C4 图，把标准和 MQ 文档画入上下文 | 信息量大 | 混淆文档来源和运行上下文 | 不采用 |
| 方案 B：只画正式上下文对象，标准来源放到来源声明和参考 | 边界清晰 | 图中不展示所有背景资料 | 采用 |
| 方案 C：逐个画出所有发布方和订阅方仓 | 覆盖全面 | 图过载，超过架构上下文粒度 | 不采用 |

### 7. 结构化中间产物

#### 7.1 系统上下文图

```text
                 +--------------------+
                 |      L0-core       |
                 | shared contracts   |
                 +---------+----------+
                           |
                           v
+------------------+   +---+----------------+   +------------------+
| publisher repos  |-->|       L0-bus       |-->| subscriber repos |
| L1 / L2 / L3     |   | delivery backbone  |   | L1 / L2 / L3     |
+------------------+   +---+-----------+----+   +------------------+
                           |           |
             +-------------+           +-------------+
             v                                       v
      +------+-------+                         +-----+------+
      |    L0-sdk    |                         | MQ backend |
      | consume view |                         | transport  |
      +--------------+                         +-----+------+
                           |
          +----------------+----------------+
          v                v                v
   +------+-------+  +-----+------+  +------+-------+
   | observability|  | governance |  | operator/SRE|
   | tap/audit    |  | failure    |  | operations |
   +--------------+  +------------+  +--------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。

#### 7.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入 / 输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约、错误、trace、metadata、actor/ref | bus 只消费契约，不重新定义。 |
| 发布方仓 | 输入 | 来源 | 合法发布材料、payload reference、outbox fact reference | 发布方拥有业务事实和正文。 |
| MQ backend | 输入 / 输出 | 依赖 | 传输能力、后端状态 | 后端差异必须被 adapter 边界吸收。 |
| 持久化能力 | 输入 / 输出 | 依赖 | delivery、DLQ、audit、replay material 留痕能力 | 不允许生成不可追溯传递状态。 |
| 订阅方仓 | 输出 / 输入 | 消费 | delivery 输出、ack / fail / timeout 反馈 | 订阅方拥有业务处理和业务幂等。 |
| `L0-sdk` | 输出 | 消费 | transport view / consume view | SDK 封装体验，不反写 bus truth。 |
| `L4-observability` | 输出 | 消费 | tap、trace、audit material | 观测方做长期存储和查询。 |
| `L1-governance` | 输出 | 消费 | failure material / DLQ summary | 治理方做决策，bus 只给失败事实。 |
| operator / SRE | 输出 / 输入 | 入口 / 消费 | 运行状态材料、受控恢复控制 | 控制动作不得绕过授权和审计链。 |

#### 7.3 边界说明结论

`L0-bus` 位于契约和业务仓之间，承接传递运行主干，不承接业务正文和业务决策。上游契约失效、发布材料非法、后端不可用、持久化不可用和只读消费方不可用分别有不同挂起或拒绝口径。系统上下文只表达正式相邻对象和外部能力，不表达接口名、事件名、函数或数据库结构。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §5 “系统边界与上下文”直接摘录并润色本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 上下文图是否展开全部发布方和订阅方仓 | A. 展开全部仓；B. 使用 publisher / subscriber repos 聚合表达；C. 只画 L1 | B | 架构上下文关注关系类型，全部展开会导致图过载 | 已确认采用 B |
| MQ backend 是否画成 NATS / Redis / Kafka | A. 画具体产品；B. 抽象为 MQ backend；C. 不画后端 | B | 具体选型未在 Step 4 决定，但传输能力是正式上下文 | 已确认采用 B |
| 是否在上下文图中画 CloudEvents / W3C | A. 画入图中；B. 放入来源声明和参考章节；C. 完全删除 | B | 它们是标准对齐来源，不是运行时上下文对象 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 5 的待确认事项。
- 默认后端路径、容器部署、通信方式和数据所有权留到后续 Step 展开。

### 10. 进入下一步条件

- 已明确 `L0-bus` 在全局系统中的位置。
- 已画出正式上下文对象图。
- 已明确上游、下游、输入面、输出面和依赖失效口径。
- 可以进入 Step 5 限界上下文与子域划分。
