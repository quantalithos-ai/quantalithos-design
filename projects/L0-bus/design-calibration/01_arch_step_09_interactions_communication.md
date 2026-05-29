## Step 9. 关键交互与通信方式

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-bus/01-架构设计.md` §10 关键交互与通信方式

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.10 关键交互与通信方式
  - `standards/document/架构设计讨论流程_SOP.md` Step 9
  - `projects/L0-bus/design-calibration/01_arch_step_04_system_context.md`
  - `projects/L0-bus/design-calibration/01_arch_step_06_container_deployment.md`
  - `projects/L0-bus/design-calibration/01_arch_step_08_data_ownership_consistency.md`
- 已确认结论：
  - 发布材料接入、结果反馈、恢复控制和只读查询是同步能力边界。
  - delivery 推进、失败恢复和只读输出派生是异步或后台任务。
  - 只读消费方不可用不得阻塞 bus truth。

### 3. SOP 问题回答

1. 哪些交互适合同步能力边界？

   回答：发布材料接入、delivery 结果反馈、恢复控制、只读查询和运行状态查询适合同步能力边界，因为它们需要立即返回接受、拒绝、状态或控制结果。

2. 哪些交互适合异步事件？

   回答：已接受材料向订阅方 delivery、tap 输出、audit / failure material 派发、跨仓事件消费适合异步事件，因为它们跨仓、可重试、可最终一致。

3. 哪些交互适合后台任务或补偿路径？

   回答：Outbox relay、Delivery worker、Recovery worker、Read output worker、retry、dead-letter、replay preparation 适合后台任务或补偿路径。

4. 哪些交互必须经过总线或正式边界，不能直接穿透？

   回答：发布方不得直接写订阅方；订阅方不得直接修改 bus truth；observability、governance、SDK 不得反写 bus truth；Outbox relay 不得绕过已提交事实边界；replay 不得绕过 dead-letter、delivery history 和 audit chain。

5. 关键依赖失效时，本仓如何降级或挂起？

   回答：契约非法时同步拒绝；Bus store 不可用时拒绝形成新状态；MQ backend 不可用时挂起 delivery 或形成失败恢复材料；订阅方不可用时进入 retry / fail 路径；只读输出消费方不可用时保留可重建派生，不阻塞主链。

6. 哪些通信口径若不先写清，后续最容易误入协议细节？

   回答：发布接入、delivery 推进、结果反馈、失败恢复、只读输出和 operator 控制最容易被提前写成 API 路径、事件名或 DTO，因此本 Step 只确认通信类别和边界理由。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §7 / §8 | 旧文档把 trait、OutboxPublisher、TapSubscriber、ReplayCommand 等当成边界 | 提前进入接口命名和实现层 |
| §6 / §8 | outbox worker、DLQ replay、tap-all 混写为运行路径 | 通信方式和运行容器职责混淆 |
| §9 技术选型 | NATS / at-least-once / Outbox 等混入交互方式 | 交互原则与技术选型没有分层 |
| 全文 | 缺少“只读消费失败不阻塞主链”的交互口径 | 容易让 observability / governance 反向影响 bus truth |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 同步交互 | 旧文档以 trait / command 表达 | 发布接入、反馈、恢复控制、只读查询、状态查询 | 本章只确认交互类别 |
| 异步交互 | 直接写具体后端事件流 | delivery、tap、audit、failure material 作为异步输出 | 不提前绑定后端 |
| 后台任务 | outbox / DLQ / replay 与实现混写 | Outbox relay、Delivery、Recovery、Read output 分为后台路径 | 对齐容器视图 |
| 失败口径 | 运维处置优先 | 同步拒绝、挂起、失败材料、可重建派生 | 对齐数据一致性 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在本 Step 写 API 路径和事件名 | 看起来更具体 | 违反 SOP，提前进入详细设计 | 不采用 |
| 方案 B：只写通信方式和边界理由 | 架构边界清晰 | 需要详细设计补接口契约 | 采用 |
| 方案 C：全部通过同步调用完成 | 简单直观 | 不适合跨仓 delivery、retry、tap 和最终一致 | 不采用 |

### 7. 结构化中间产物

#### 7.1 关键交互表

| 交互 | 通信方式 | 边界理由 | 失败口径 |
|---|---|---|---|
| 发布材料接入 | 同步能力边界 | 需要立即判断接受或拒绝。 | 非法契约或材料不可信时拒绝。 |
| Outbox relay 推进 | 后台任务 | 从已提交事实推进到 bus，不应阻塞业务事务。 | 重复或不可读取时挂起并留痕。 |
| delivery 推进 | 异步事件 / 后台任务 | 跨仓传递需重试和最终一致。 | 后端或订阅方不可用时 retry / fail / DLQ。 |
| delivery 结果反馈 | 同步或异步能力边界 | 订阅方需要反馈处理结果并形成总线事实。 | 重复反馈按幂等锚点处理。 |
| 失败恢复 | 后台任务 / 受控控制 | retry、dead-letter、replay preparation 需要审计链。 | 历史链不完整时拒绝 replay。 |
| 只读输出派生 | 后台任务 / 异步输出 | transport view、tap、failure material 是派生材料。 | 派生失败不反写也不阻塞 bus truth。 |
| 运行状态查询 | 同步只读边界 | operator 需要读取 lag、DLQ、backend health 等状态。 | 查询失败不改变 bus truth。 |

#### 7.2 简化交互示意图

```text
publisher/outbox
      |
      v
  sync accept
      |
      v
  bus truth  <------ feedback
      |
      v
 async delivery
      |
      v
 subscriber repos
      |
      v
 recovery / read outputs
```

该图只表达关键交互类别，不表达 API 路径、事件名、DTO、后端产品或运行时顺序细节。

#### 7.3 边界约束结论

- 发布接入和结果反馈必须形成 bus truth，不得只停留在瞬时调用结果。
- delivery、tap、failure material 和 read output 默认按最终一致处理。
- 只读输出不得反写 bus truth，消费失败不得阻塞核心传递链。
- operator 控制不得绕过授权、dead-letter、delivery history 和 audit chain。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §10 “关键交互与通信方式”直接摘录并润色本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否在架构阶段写 API 路径 / 事件名 | A. 写；B. 不写，只写通信方式；C. 只写示例 | B | 本 Step 关注通信类别和边界，协议细节后移 | 已确认采用 B |
| delivery 结果反馈用同步还是异步 | A. 只同步；B. 只异步；C. 允许同步或异步能力边界，语义统一 | C | 不同订阅方形态可能不同，但结果语义应一致 | 已确认采用 C |
| 只读输出失败是否阻塞主链 | A. 阻塞；B. 不阻塞；C. 由消费方决定 | B | 只读输出不能反向影响 bus truth | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 10 的待确认事项。
- API 路径、事件名、DTO、proto / JSON schema、具体时序图后移到详细设计。

### 10. 进入下一步条件

- 已明确同步、异步、后台任务和只读输出的通信方式。
- 已明确关键依赖失效时的拒绝、挂起、重试和派生失败口径。
- 可以进入 Step 10 关键技术选型。
