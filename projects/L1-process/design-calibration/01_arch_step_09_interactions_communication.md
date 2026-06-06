# Step 9. 关键交互与通信方式

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 回填章节: `01-架构设计.md` §10 关键交互与通信方式
> 生成日期: 2026-06-05

---

## 1. 本步目标

明确 `L1-process` 与外部或内部相邻部分之间的关键交互应采用同步请求 / 响应、异步事件 / 回调,还是后台任务 / 延后承接,并说明这些通信方式的边界依据。本步只讨论通信方式选择与边界理由,不写 API 路径、事件名、DTO、schema、topic、时序图、技术产品或失败机制实现。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_04_system_context.md` | Step 4 已完成 | 承接正式上下文边界 |
| `design-calibration/01_arch_step_06_container_deployment.md` | Step 6 已完成 | 承接同步入口、异步消费、后台处理运行承载 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | Step 8 已完成 | 承接强一致、最终一致、引用有效性和失败处理口径 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | 已完成 | 承接能力级接口面 |
| `projects/L1-process/00-需求文档.md` §9 / §10 / §12 / §14 | 已重建 | 校验功能能力、规则边界、接口能力和验收否决项 |

---

## 3. SOP 问题回答

### 3.1 哪些交互适合同步能力边界?

| 同步场景 | 原因 |
|---|---|
| Runtime Process Shape / ProcessProfile 形成、采用、调整和切换 | 需要即时判断定义来源、裁剪语境和边界约束是否成立。 |
| ProcessInstance 建立、推进、暂停、恢复、结束或取消 | 需要即时判断核心 Process truth 是否可变化。 |
| Activity / Token / Gateway 推进 | 需要围绕同一实例和当前位置即时收口。 |
| waiting gate 建立 / resume 判断 | 需要即时判断等待节点、外部依据和恢复语境是否有效。 |
| Process truth 查询 / 引用读取 | 需要在授权和一致性口径下返回明确读取结果或失败。 |
| 运维管理触发 | 需要即时判断是否允许进入维护或恢复边界,但实际长时处理可延后。 |

### 3.2 哪些交互适合异步事件?

| 异步场景 | 原因 |
|---|---|
| Process truth 关键变化向外传播 | 变化已在 Process 内成立后,下游消费不应阻塞主真相。 |
| method-library / work / governance / artifact / runtime / conversation 等外部能力变化送达 | 外部事实变化到达 Process 边界时适合以异步方式承接,并保持幂等。 |
| runtime / member-service Activity feedback 结果送达 | 执行结果是外部能力完成后的正式反馈,不应伪装成同步调用链。 |
| conversation / workspace 显化消费 | 显化和聚合视图是下游消费,应允许滞后。 |
| observability / archive handoff 状态传播 | 观测和归档交接可延迟,但必须可追踪。 |

### 3.3 哪些交互适合后台任务或补偿路径?

| 后台 / 延后场景 | 原因 |
|---|---|
| projection / read model rebuild | 派生视图可最终一致,不应阻塞主真相。 |
| reconciliation / consistency check | 对账和修复派生结果是维护路径,不应写成同步业务闭环。 |
| checkpoint / recovery maintenance | 恢复准备、恢复检查或恢复材料维护可能需要延后承接。 |
| archive / observability handoff retry | 交接失败不改变 Process truth,适合后台延后收敛。 |
| stale / unresolved 外部快照刷新 | 外部摘要更新可异步或后台完成,不得自造外部 truth。 |

### 3.4 哪些交互必须经过总线或正式边界,不能直接穿透?

| 交互 | 必须经过的正式边界 |
|---|---|
| 过程事实变化向相邻仓传播 | 必须经事件协作或正式消费边界,不能让下游直接读取内部写模型。 |
| 外部 truth 变化进入 Process | 必须经外部接缝和编排 / 承接角色,不能直接写核心语义。 |
| runtime 执行反馈进入 Process | 必须经 execution feedback seam,不能保存 runtime 执行正文。 |
| governance decision 恢复 waiting gate | 必须经 governance decision seam,不能由 Process 自造 decision。 |
| archive / observability 交接 | 必须经 handoff seam,不能把 archive package 或 reasoning trace 正文写入 Process。 |

### 3.5 关键依赖失效时,本仓如何降级或挂起?

| 依赖 / 场景失效 | 降级 / 挂起口径 |
|---|---|
| 同步主真相判断失败 | 明确失败或保持原状态,不得伪装完成。 |
| 异步输入重复或乱序 | 幂等识别、拒绝回退或保持等待,不得产生重复事实。 |
| 外部快照缺失或过期 | 标记 unresolved / stale / waiting,不得自造外部 truth。 |
| 下游消费失败 | 保持待消费 / failed / retryable 状态,不改变 Process truth。 |
| 后台维护失败 | 派生面标记 failed / stale,不反写主真相。 |
| recovery 依据不足 | 挂起或失败,不得创建第二份 Process truth。 |

### 3.6 哪些通信口径若不先写清,后续最容易误入协议细节?

最容易误入协议细节的口径是:

1. 把 Runtime Process Shape / ProcessProfile 形成写成具体 API 名而不是同步边界判断。
2. 把 Activity feedback 写成内部函数调用而不是外部结果送达。
3. 把 Process truth propagation 写成事件目录而不是事实传播边界。
4. 把 projection rebuild / reconciliation 写成同步接口成功。
5. 把 archive / observability handoff 写成保存外部正文或同步归档完成。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 需求 Step 12 | 已有能力级接口和同步 / 异步边界线索 | 需求层未按架构通信方式做完整判断 | 本步补场景和通信方式判断表 |
| 旧 `01-架构设计.md` | 交互中有 method-library、work、governance、artifact、runtime 等线索 | 容易滑入接口名、事件名或流程图 | 本步只保留场景与方式 |
| Step 8 | 已给出强一致 / 最终一致 | 需要映射到同步、异步和后台承接 | 本步建立关系 |
| 新版需求 §15 | API / Command / Event 名称未定 | 不阻塞本步 | 明确不写协议名和 schema |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 交互表达 | 能力边界或旧流程线索 | 关键交互场景 + 通信方式判断 | 对齐架构规范 4.10 |
| 异步表达 | 容易写事件名 | 写事实传播 / 外部结果送达 / 事件协作边界 | 避免进入 event catalog |
| 后台表达 | 容易写 worker / retry 实现 | 写延后承接和失败口径 | 避免进入实现机制 |
| 失败处理 | 可能写技术重试 | 写架构挂起、stale、unresolved、failed、retryable 口径 | 保护数据和边界语义 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接写 API / Event / Job 清单 | 接近详细设计 | 会提前锁定协议并制造冲突 | 不采用 |
| 方案 B: 按关键交互场景与通信方式分类 | 架构边界清楚 | 后续仍需详细设计拆协议 | 采用 |
| 方案 C: 所有变化都同步完成 | 语义简单 | 下游消费和外部反馈会阻塞主真相 | 不采用 |
| 方案 D: 所有变化都异步化 | 解耦 | 核心 Process truth 内部强一致会失效 | 不采用 |

### 6.1 待确认问题的方案选择

#### Activity feedback 应同步还是异步?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 同步主路径 | 会把 runtime 执行过程伪装成 Process 内部调用链 |
| 方案 B | 外部结果送达,以异步事件 / 回调类交互承接 | 保持 runtime 执行与 Process 反馈边界 |

推荐方案 B。

#### projection rebuild 是否作为同步接口完成?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 同步完成 | 会让派生视图阻塞主路径 |
| 方案 B | 后台任务 / 延后承接 | 与最终一致和不反写真相一致 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| Runtime Process Shape / ProcessProfile 管理 | 同步入口与 method definition / project context 边界 | 即时判断运行时过程形态和项目采用语境是否可成立 | 该场景改变 Process 主真相,必须在正式边界内即时收口。 |
| ProcessInstance 运行变化 | 同步入口与 Process truth 边界 | 即时判断实例开始、推进、暂停、恢复、结束或取消是否成立 | 该场景是过程执行事实主线,不适合伪装成延后完成。 |
| Activity / Token / Gateway 推进 | 同步入口或外部反馈承接边界 | 让过程节点和流控位置围绕同一实例保持一致 | 该场景要求强一致判断,但 feedback 来源可异步送达。 |
| waiting gate / resume | Process 与 governance / external decision 边界 | 建立等待语境或根据正式外部依据恢复过程 | 该场景必须区分等待意图和外部 decision truth。 |
| Activity execution feedback | Process 与 runtime / member-service 边界 | 把外部执行结果绑定回正式过程节点语境 | 该场景是外部结果送达,不应写成内部同步执行流程。 |
| Process fact propagation | Process 与 bus / downstream consumer 边界 | 将已成立的过程事实变化传播给相邻仓或消费方 | 该场景核心是事实传播,不应阻塞主真相成立。 |
| Process query / consumption | 同步入口与 read model / Process truth 边界 | 读取当前或派生过程执行事实 | 查询必须按授权和一致性口径返回,不得隐式写业务真相。 |
| Projection / read model rebuild | 后台处理与派生状态边界 | 重建或修复消费视图 | 该场景是派生面维护,不应作为同步业务成功前置。 |
| Reconciliation / consistency check | 后台处理与 Process truth / derived state 边界 | 检查外部快照、引用和派生状态是否可解释一致 | 该场景只能维护或报告,不得反向改变业务真相。 |
| Observability / archive handoff | Process 与 handoff sink 边界 | 交接 checkpoint、恢复和过程事实材料 | 该场景可以延后收敛,但不得保存外部正文。 |

### 7.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Runtime Process Shape / ProcessProfile 管理 | 同步请求 / 响应类交互 | 不宜以后置事件作为主闭环 | 明确失败或保持原语境 | 该场景需要即时判断定义来源、裁剪和采用边界是否成立。 |
| ProcessInstance 运行变化 | 同步请求 / 响应类交互 | 不宜伪装成异步已完成 | 明确失败或保持原状态 | 主真相变化必须在正式边界上给出结果。 |
| Activity / Token / Gateway 推进 | 同步请求 / 响应类交互 + 异步结果承接 | 不宜让外部反馈直接写核心事实 | feedback 未到达时保持等待或 pending | 推进判断强一致,但执行反馈可异步送达。 |
| waiting gate / resume | 同步请求 / 响应类交互 + 异步结果承接 | 不宜由 Process 自造 decision 或后台静默恢复 | 保持 waiting / unresolved 或明确失败 | 等待语境和恢复判断必须引用正式外部依据。 |
| Activity execution feedback | 异步事件 / 回调类交互 | 不宜写成 Process 主动同步执行 runtime | 保持 pending / unresolved / failed 反馈状态 | 执行结果来自 L2 边界,Process 只承接结果。 |
| Process fact propagation | 异步事件 / 回调类交互 | 不宜要求所有下游同步确认后才成立主真相 | 保持待消费 / failed / retryable | 事实传播不应阻塞 Process 主真相。 |
| Process query / consumption | 同步请求 / 响应类交互 | 不宜用后台延后承接伪装成功 | 返回当前、stale、unavailable 或明确失败 | 查询是读取边界,不得隐式写业务真相。 |
| Projection / read model rebuild | 后台任务 / 延后承接类交互 | 不宜硬写成同步接口完成 | 标记 rebuilding / stale / failed | 派生状态可最终一致。 |
| Reconciliation / consistency check | 后台任务 / 延后承接类交互 | 不宜作为业务写路径 | 输出报告、marker 或 failed 状态,不得改写主真相 | 对账维护派生结果和解释状态。 |
| Observability / archive handoff | 后台任务 / 延后承接类交互 + 异步结果承接 | 不宜作为 Process 主真相成立前置 | 保留 pending / failed / retryable handoff | 交接可延迟,但必须可追踪且不保存外部正文。 |

### 7.3 简化交互示意图

```text
----------------------+
| sync boundary        |
| truth decisions      |
+----------+-----------+
           |
           | established facts
           v
+----------------------+        +----------------------+
| async boundary        |        | background boundary  |
| fact/result delivery  |        | rebuild/reconcile    |
+----------+-----------+        +----------+-----------+
           |                               |
           | consume / handoff             | maintain derived
           v                               v
+------------------------------------------------------+
| consumers / external results / handoff sinks          |
+------------------------------------------------------+
```

图示说明:

- 同步边界用于主真相判断和需要即时结果的读取。
- 异步边界用于已成立事实传播和外部结果送达。
- 后台边界用于派生视图重建、对账、维护和交接重试。
- 图不表达 API、事件名、topic、时序步骤或技术选型。

### 7.4 边界说明短文

`L1-process` 的同步交互只用于需要即时判断 Process truth 是否成立的场景,例如 Profile、Instance、Activity、waiting gate 和查询读取。异步交互用于外部结果送达和事实传播,它服务于跨仓协作和最终一致消费,不能成为绕过核心规则的直接写入通道。后台延后承接用于 projection、reconciliation、recovery maintenance 和 handoff,这些路径可以修复派生面或交接材料,但不得反向改变业务真相。本章只判断通信方式类别和失败口径,不定义 API、event、job、topic、队列或中间件产品。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 10. 关键交互与通信方式

> 校准来源:
> - `design-calibration/01_arch_step_09_interactions_communication.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“关键交互场景表”“通信方式判断表”“简化交互示意图”和“边界说明短文”小节,了解本章如何把上下文边界和一致性策略转为通信方式选择。

正式章节应摘录:

- `design-calibration/01_arch_step_09_interactions_communication.md` §7.1 关键交互场景表。
- `design-calibration/01_arch_step_09_interactions_communication.md` §7.2 通信方式判断表。
- `design-calibration/01_arch_step_09_interactions_communication.md` §7.3 简化交互示意图。
- `design-calibration/01_arch_step_09_interactions_communication.md` §7.4 边界说明短文。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | 同步边界的具体 API / Command / Query 名称 | 后续详细设计收敛 |
| Q-002 | 异步事实传播和外部结果送达的具体事件 / callback schema | 后续详细设计和测试方案收敛 |
| Q-003 | 后台任务 / 延后承接的 job surface 和 retry marker | 后续详细设计、配置设计和实施计划收敛 |
| Q-004 | pending / failed / retryable / stale / unresolved marker 的字段级 schema | 后续详细设计收敛 |

---

## 10. 进入下一步条件

- 已明确关键交互场景及正式边界位置。
- 已明确每类场景的推荐通信方式、不宜采用方式和失败处理口径。
- 未写 API 路径、事件名、DTO、schema、topic、时序图、技术产品或失败机制实现。

结论:可以进入 Step 10 `关键技术选型`。
