## Step 8. 数据所有权与一致性策略

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 8
- 回填章节：`projects/L0-bus/01-架构设计.md` §9 数据所有权与一致性策略

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.9 数据所有权与一致性策略
  - `standards/document/架构设计讨论流程_SOP.md` Step 8
  - `projects/L0-bus/00-需求文档.md` §11 数据需求与数据归属
  - `projects/L0-bus/design-calibration/01_arch_step_03_responsibility_boundary.md`
  - `projects/L0-bus/design-calibration/01_arch_step_05_bounded_context.md`
- 已确认结论：
  - bus truth、只读快照、外部引用、禁止正文四类数据边界已收稳。
  - bus 只拥有传递事实，不拥有业务正文、治理决策正文或观测长期日志正文。
  - 当前一致性默认 at-least-once + bus 级幂等锚点 + subscriber idempotency。

### 3. SOP 问题回答

1. 哪些数据由本仓拥有真相？

   回答：本仓拥有 publication acceptance fact、delivery record、ack / fail / timeout result、idempotency anchor、retry / dead-letter / replay material、bus audit trail 和 delivery history 的总线级真相。

2. 哪些数据只是快照、投影或引用？

   回答：transport view、tap / trace / metrics material、failure summary material 是只读快照或派生视图；core contract reference、payload reference、outbox fact reference、backend capability reference 是引用数据。

3. 哪些关系必须强一致？

   回答：publication acceptance 与 bus audit、delivery 状态变化与 delivery history、ack / fail / timeout 与幂等锚点、dead-letter / replay preparation 与 audit chain 必须在 bus truth 范围内保持强一致或等价的原子可追溯口径。

4. 哪些关系可以最终一致？

   回答：发布方业务事实与 bus acceptance、bus delivery 与订阅方业务处理、bus truth 与只读输出、bus failure material 与 governance 后续决策、bus tap 与 observability 存储可以最终一致。

5. 失败时靠什么口径约束、补偿或挂起？

   回答：契约非法时拒绝接入；bus store 不可用时不得形成不可追溯状态；MQ backend 不可用时 delivery 挂起或进入失败恢复；订阅方反馈失败或超时时形成可追溯结果；只读输出失败不得阻塞 bus truth；replay 必须等待 dead-letter、delivery history 和 audit chain 完整。

6. 哪些数据边界如果不写清，后续最容易串仓？

   回答：payload reference 与 payload body、failure material 与 governance decision、tap output 与 observability log body、outbox fact reference 与业务 outbox truth、idempotency anchor 与业务副作用幂等最容易串仓。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §8.1 | 旧文档直接列 EventEnvelope、Subscription、DLQEntry、outbox rows 等对象 | 对象模型和表结构倾向过强，未按四类数据边界分类 |
| §8.2 | 使用 Outbox、DLQ、tap 等实现词，但缺少 bus truth 内部强一致边界 | 实现方案被误当成一致性策略 |
| §8.3 | 表述接近运维处置 | 架构层应先定义拒绝、挂起、失败材料和不可追溯禁止口径 |
| 全文 | 缺少禁止正文边界 | 后续可能把业务正文、治理决策或观测日志写入 bus |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据分类 | 按对象或表项散列 | 按 truth / snapshot / reference / forbidden body 分类 | 对齐需求 §11 |
| 强一致范围 | Outbox 和 DLQ 实现优先 | bus truth 内部状态、历史、幂等、审计链强一致 | 保护传递事实可信度 |
| 最终一致范围 | 泛化为事件驱动 | 发布方事实、订阅方处理、只读输出、治理和观测均最终一致 | 明确跨仓边界 |
| 失败口径 | 偏运维动作 | 拒绝、挂起、失败材料、禁止不可追溯状态 | 避免无审计恢复 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按数据库表和对象定义所有权 | 对实现直接 | 提前进入详细设计，且容易遗漏禁止正文 | 不采用 |
| 方案 B：按真相、快照、引用、禁止正文定义所有权 | 与需求一致，边界清晰 | 需要详细设计再落表结构 | 采用 |
| 方案 C：把所有 event payload 都存入 bus 以方便 replay | replay 简单 | 打穿业务正文所有权和安全边界 | 不采用 |

### 7. 结构化中间产物

#### 7.1 数据所有权表

| 数据项 | 分类 | 所有权口径 | 一致性口径 |
|---|---|---|---|
| Publication acceptance fact | bus truth | bus 拥有发布材料进入传递链的事实。 | 与 audit / history 在 bus 内强一致。 |
| Delivery record | bus truth | bus 拥有 delivery attempt、目标范围和状态。 | 状态变化与 delivery history 强一致。 |
| Ack / fail / timeout result | bus truth | bus 拥有订阅方反馈的总线级结果。 | 与幂等锚点和 history 强一致。 |
| Idempotency anchor | bus truth | bus 拥有 delivery / feedback 层重复识别锚点。 | 与结果记录强一致，不承接业务副作用。 |
| Retry / dead-letter / replay material | bus truth | bus 拥有失败恢复所需材料。 | 与 dead-letter、history、audit chain 强一致。 |
| Bus audit trail / delivery history | bus truth | bus 拥有传递和恢复留痕。 | append-only 或保留可追溯演进链。 |
| Transport view | snapshot / projection | 面向 SDK 或消费方的只读视图。 | 从 bus truth 派生，最终一致。 |
| Tap / trace / metrics material | snapshot / projection | 面向 observability 的只读材料。 | 从 bus truth 派生，最终一致。 |
| Failure summary material | snapshot / projection | 面向 governance / operator 的失败材料摘要。 | 从 bus truth 派生，不等于治理决策。 |
| Core contract reference | reference | 指向 `L0-core` 契约。 | 随 bus truth 记录引用，不拥有正文。 |
| Payload reference | reference | 指向发布方业务 payload。 | 引用可追溯，正文归发布方。 |
| Outbox fact reference | reference | 指向已提交 outbox fact。 | 引用可追溯，业务 outbox truth 归发布方。 |
| Backend capability reference | reference | 指向后端能力或环境 profile。 | 用于解释传递路径，不定义上层语义。 |
| Business payload body | forbidden body | bus 不保存、不解释。 | 不进入 bus truth 或快照。 |
| Raw secret / credential | forbidden body | bus 不保存。 | 不进入 bus 数据边界。 |
| Governance decision body | forbidden body | governance 拥有决策正文。 | bus 只输出 failure material。 |
| Observability long-term log body | forbidden body | observability 拥有长期日志正文。 | bus 只输出 tap / audit material。 |

#### 7.2 一致性口径表

| 关系 | 一致性策略 | 约束 |
|---|---|---|
| publication acceptance -> bus audit | bus 内强一致 | 不允许无审计接入事实。 |
| delivery state -> delivery history | bus 内强一致 | 状态变化必须可追溯。 |
| ack / fail / timeout -> idempotency anchor | bus 内强一致 | 重复反馈必须可判定。 |
| dead-letter -> replay preparation | bus 内强一致 | replay 不得绕过 dead-letter 和 history。 |
| 发布方业务事实 -> bus acceptance | 最终一致 | 仅承接已提交事实或合法引用。 |
| bus delivery -> 订阅方业务处理 | 最终一致 | 订阅方负责业务副作用幂等。 |
| bus truth -> transport view / tap / failure material | 最终一致 | 派生失败不得反写或阻塞 truth。 |
| failure material -> governance decision | 最终一致 / 外部决策 | failure material 不等于治理决策。 |

#### 7.3 数据边界示意图

```text
+------------------+       +------------------+
| external truth   |       | forbidden body   |
| payload/outbox   |       | payload/secret   |
+---------+--------+       +---------+--------+
          |                          |
          v                          x
+---------+--------------------------+--------+
|                  L0-bus truth               |
| acceptance / delivery / result / audit      |
| retry / DLQ / replay material               |
+---------+--------------------------+--------+
          |
          v
+---------+-----------------------------------+
| snapshots and references                     |
| transport view / tap / failure / refs        |
+---------------------------------------------+
```

该图只表达数据所有权边界，不表达表结构、字段、事务脚本或缓存策略。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §9 “数据所有权与一致性策略”直接摘录并润色本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| bus 是否保存业务 payload body 以支持 replay | A. 保存正文；B. 只保存引用和总线事实；C. 由发布方决定 | B | 保存正文会打穿业务数据所有权和安全边界 | 已确认采用 B |
| bus 级幂等是否承接业务副作用幂等 | A. 承接；B. 不承接，只做 delivery / feedback 幂等锚点；C. 后续决定 | B | 业务副作用属于订阅方，bus 只能约束传递层 | 已确认采用 B |
| 只读输出失败是否阻塞 bus truth | A. 阻塞；B. 不阻塞，保持最终一致；C. 由消费方决定 | B | 只读派生不能影响主链传递事实 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 9 的待确认事项。
- 具体表结构、字段、事务脚本、重试实现和缓存策略后移到详细设计。

### 10. 进入下一步条件

- 已明确 bus truth、快照 / 投影、引用和禁止正文四类数据边界。
- 已明确 bus 内强一致与跨仓最终一致口径。
- 可以进入 Step 9 关键交互与通信方式。
