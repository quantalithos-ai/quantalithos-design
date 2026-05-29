## Step 3. 职责边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-bus/01-架构设计.md` §4 职责边界

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.4 职责边界
  - `standards/document/架构设计讨论流程_SOP.md` Step 3
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/design-calibration/01_arch_step_01_requirements_baseline.md`
  - `projects/L0-bus/design-calibration/01_arch_step_02_arch_goals_constraints.md`
- 已确认结论：
  - `L0-bus` 是事件传递、订阅推进、失败恢复和总线留痕主干。
  - 本仓不重新定义共享契约、不拥有业务正文、不生成治理决策。
  - 只读输出不得反写 bus truth。

### 3. SOP 问题回答

1. 这个仓具体做什么？

   回答：本仓承担发布材料接入、transport semantic 形成、订阅与 delivery 推进、ack / fail / timeout 结果留痕、bus 级幂等锚点、retry / dead-letter / replay preparation 材料、bus audit / delivery history、只读输出、backend adapter 语义边界和 Outbox relay boundary 承接。

2. 这个仓具体不做什么？

   回答：本仓不定义共享契约，不做 SDK 高层 client，不拥有业务 payload 正文和业务事件语义，不做业务幂等或补偿，不做 observability 长期存储，不做 governance 决策，不做 MQ 产品集群部署，不做 DLQ Console UI。

3. 哪些能力看起来相关但必须属于其他仓？

   回答：共享契约属于 `L0-core`；开发者便利 API 属于 `L0-sdk`；业务处理属于发布方 / 订阅方；长期观测属于 `L4-observability`；治理决策属于 `L1-governance`；管理 UI 属于 `L5-console`。

4. 哪些行为绝不能隐式发生？

   回答：不得隐式创建或修改 `L0-core` 契约，不得隐式保存业务正文或 secret，不得让只读输出反写真相，不得把失败材料转成治理决策，不得绕过完整历史链 replay，不得让后端差异隐式改变上层语义。

5. 哪些边界如果不写清，后续设计最容易串线？

   回答：core 契约与 bus 传递、transport view 与 SDK client、tap output 与 observability storage、failure material 与 governance decision、Outbox relay boundary 与业务 outbox truth、backend adapter 与 MQ 运维部署、bus 级幂等与订阅方业务幂等最容易串线。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §4.2 | EventBus trait、四后端适配、Outbox client、tap-all、bus-ops CLI 被直接列为“做什么” | 实现形态和外围增强混入职责边界 |
| §4.2 | “不做什么”只排除 schema、业务含义、审计持久化、UI 推送和业务补偿 | 未覆盖 SDK、governance、observability、MQ 部署、禁止正文和只读反写 |
| §5 | API context、Adapter context、Ops context 与职责混写 | 限界上下文、技术结构和职责归属混成一章 |
| 全文 | tap-all、DLQ replay、outbox worker 频繁作为默认职责出现 | 缺少“边界承接”与“具体实现形态后置”的区分 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 职责表达 | 以 trait、adapter、worker、CLI 等实现对象列职责 | 以事件传递主线、失败恢复、留痕和只读输出列职责 | 架构职责表达归属，不提前写实现方案 |
| 不做范围 | 主要排除业务语义和 UI | 明确排除 core、sdk、observability、governance、MQ 运维、DLQ UI、业务幂等 | 对齐新版需求边界 |
| 易混淆职责 | 缺少显式分类 | 单列 transport view、tap、failure material、Outbox relay、adapter、幂等等边界 | 防止后续设计误归属 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧“EventBus trait + 四后端 + CLI”职责清单 | 接近旧实现想象 | 技术选型、容器和实施计划混入职责边界 | 不采用 |
| 方案 B：按“做 / 不做 / 易混淆职责”收敛职责归属 | 符合规范，能保护边界 | 不直接给实现结构 | 采用 |
| 方案 C：把所有事件相关能力都归入 bus | 叙事简单 | 侵入 core、sdk、observability、governance 和业务仓 | 不采用 |

### 7. 结构化中间产物

#### 7.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 基于 `L0-core` 契约的发布材料接入 | 做 | 这是事件传递主干的正式入口职责。 |
| 平台级 transport semantic 形成 | 做 | 若不由 bus 承载，上层会直接暴露后端差异。 |
| 订阅与 delivery 推进 | 做 | 这是本仓承接跨仓事件传递的核心职责。 |
| delivery 结果留痕 | 做 | bus 必须拥有 ack / fail / timeout 等传递结果事实。 |
| bus 级幂等锚点 | 做 | 本仓只负责 delivery / feedback 层面的重复识别。 |
| retry、dead-letter、replay preparation 材料 | 做 | 失败恢复必须形成可追溯材料链。 |
| bus audit 和 delivery history | 做 | 传递和恢复事实必须可审计。 |
| 只读输出 | 做 | 本仓向 SDK、observability、governance、operator 提供只读材料边界。 |
| backend adapter 语义边界 | 做 | 本仓负责吸收后端差异，避免污染上层语义。 |
| Outbox relay boundary 承接 | 做 | 本仓承接已提交事实进入传递链的边界，不拥有业务事实真相。 |
| Event、ErrorCode、TraceContext、Metadata、ActorRef 定义 | 不做 | 这些共享契约属于 `L0-core`。 |
| SDK 高层 client 与开发者便利 API | 不做 | 这些体验封装属于 `L0-sdk`。 |
| 业务 payload 正文和业务事件语义 | 不做 | 正文和业务语义属于发布方、订阅方或业务域。 |
| 订阅方业务副作用幂等和补偿 | 不做 | bus 只承载传递幂等，不拥有业务副作用。 |
| observability 长期存储、查询和报表 | 不做 | bus 只提供 tap / audit material，不做观测产品。 |
| governance 审批和策略裁决 | 不做 | bus 只输出 failure material，不生成治理决策。 |
| MQ 产品集群部署和运维 runbook | 不做 | bus 架构定义适配边界，不负责部署产品本身。 |
| DLQ Console UI | 不做 | UI 属于 `L5-console` 或产品层。 |
| transport view 与 SDK client 边界 | 易混淆职责 | transport view 是 bus 只读输出，client 体验属于 SDK。 |
| tap output 与 observability storage 边界 | 易混淆职责 | tap output 是材料出口，长期存储和查询属于 observability。 |
| failure material 与 governance decision 边界 | 易混淆职责 | failure material 是失败事实，治理决策不归 bus。 |
| Outbox relay 与业务 outbox truth 边界 | 易混淆职责 | bus 承接已提交事实引用，不拥有业务仓 outbox 真相。 |
| backend adapter 与 MQ 运维部署边界 | 易混淆职责 | adapter 负责语义映射，集群部署和运维不归 bus。 |
| bus 级幂等与业务幂等边界 | 易混淆职责 | bus 识别重复 delivery，业务副作用幂等由订阅方处理。 |

#### 7.2 边界红线清单

- 不得在 `L0-bus` 内重新定义 `L0-core` 已拥有的共享契约。
- 不得在 `L0-bus` 内保存或解释 business payload body、raw secret、governance decision body、observability long-term log body。
- 不得让 SDK transport view、tap output 或 failure material 反写 bus truth。
- 不得将 failure material 直接升级为 governance decision。
- 不得在缺少 dead-letter、delivery history 和 audit chain 时执行 replay。
- 不得把 backend adapter 差异暴露为上层 transport semantic。
- 不得把运行期依赖或事件协作依赖写成 Cargo path dependency。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §4 “职责边界”直接摘录并润色本文件 §7.1。
- §4.1 “边界红线”直接摘录本文件 §7.2。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 EventBus trait、worker、CLI 写入职责边界 | A. 写入；B. 后移到容器、技术选型或详细设计；C. 删除 | B | 它们是实现形态，不是职责归属本身 | 已确认采用 B |
| Outbox relay 是否属于 bus 正式职责 | A. 完全属于 bus；B. bus 承接 boundary，不拥有业务 outbox truth；C. 完全属于业务仓 | B | F-007 是 P0-min 支撑边界，但业务事实真相不归 bus | 已确认采用 B |
| tap / failure material 是否属于 bus 职责 | A. 属于且可反写；B. bus 只提供只读材料边界；C. 完全不属于 bus | B | 需求要求只读输出，但禁止反写 bus truth | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 4 的待确认事项。
- 具体容器、通信方式、数据所有权和接口协议进入后续 Step。

### 10. 进入下一步条件

- 已明确本仓做什么、不做什么和易混淆职责。
- 已形成职责边界表和边界红线清单。
- 已确认本 Step 不重画系统上下文图、不展开子域、数据所有权或接口协议。
- 可以进入 Step 4 系统边界与上下文。
