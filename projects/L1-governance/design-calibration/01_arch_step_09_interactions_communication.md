# Step 9. 关键交互与通信方式

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 回填章节: `01-架构设计.md` §10 关键交互与通信方式
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-governance` 在正式边界上的关键交互场景分别适合采用同步请求 / 响应、异步事件 / 回调,还是后台任务 / 延后承接,并说明失败时的架构层处理口径。

本步只回答通信方式类别和边界理由,不写接口路径、接口名、事件名、回调名、topic 名、DTO、schema、协议选型、时序图、队列产品、重试实现、transaction、outbox 或内部处理步骤。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_04_system_context.md` | 已完成 | 提供正式上下文对象、输入 / 输出面和依赖失效口径 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载、派生承载和外部交接边界 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 提供核心保护、外部接缝、依赖倒置和禁止反向依赖 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供强一致、最终一致、引用有效性、失败处理和不得反写真相口径 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供需求层能力级接口面、同步 / 异步能力边界和外部依赖边界 |
| 旧 `01-架构设计.md` §6 / §8 / §10 | 旧 Draft | 作为旧接口、事件、policy distribution、artifact sync、audit / report 和外部 GRC 混写问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 哪些交互适合同步能力边界?

需要即时判断 Governance 正式真相是否成立的交互适合同步请求 / 响应类交互。包括治理语境建立或调整、关键节点 Gate / Decision 裁决、Approval / authorization responsibility 形成、Policy 生效或替代、shared rules 冲突判断、Control 适用 / 复核、AIIA / SoA 治理评审结论、Nonconformity 纠正闭环变化、治理事实查询和受控维护触发。

这些场景的共同点是调用方必须获得明确结果:已成立、被拒绝、引用不可解析、依据不足、无权读取、暂不可处理或需要人工裁决。不能先伪装为成功,再由后台补齐治理裁决、授权、Policy 生效、合规结论或纠正闭环 truth。

### 3.2 哪些交互适合异步事件?

已经成立的 Governance 事实向相邻仓传播、相邻真相域已经形成的事实或风险线索进入 Governance 边界、runtime / capability / observability 等外部反馈送达、conversation / workspace / archive / observability 等下游消费治理事实,适合异步事件 / 回调类交互。

这些场景的重点是事实传播、外部结果送达或消费感知,不要求在原始同步请求边界内完成所有下游消费,也不允许下游消费失败反向取消已经成立的 Governance truth。

### 3.3 哪些交互适合后台任务或补偿路径?

治理 read model、dashboard、report、reconciliation、维护报告、外部快照刷新、引用可解析性刷新、归档准备、追溯交接材料形成、派生视图重建和一致性检查适合后台任务 / 延后承接类交互。

这些交互可以延迟、挂起、重建或重试,但只能维护派生结果、解释状态、消费摘要或交接材料,不得创建、批准、关闭、覆盖或回滚 Governance 核心 truth。

### 3.4 哪些交互必须经过总线或正式边界,不能直接穿透?

跨仓事实传播、相邻真相域变化输入、Policy / automation boundary 下发、Control / AIIA / SoA 结论消费、Nonconformity 线索送达、observability / archive 交接和 conversation / workspace 显化都必须经过正式事件协作、同步入口或外部能力接缝,不能让来源仓、下游消费方、横切系统、外部 GRC 或技术设施直接写 Governance 核心。

Runtime cache、capability registry、artifact body、process waiting state、work lifecycle、conversation display、observability audit store、archive package、report / dashboard 和 external GRC 都不能穿透成为 Governance truth source。

### 3.5 关键依赖失效时,本仓如何降级或挂起?

| 依赖 / 场景失效 | 降级 / 挂起口径 |
|---|---|
| 同步主真相判断失败 | 明确失败、拒绝或保持原状态,不得写成部分完成。 |
| 身份 / 定义 / process / work / artifact / evidence 引用不可解析 | 标记 unresolved / pending / evidence-not-closed,或退回待补语境;不得补造外部 truth。 |
| 自动化授权依据不足 | 保守挂起、要求人工裁决或拒绝自动完成;不得用默认通过替代正式授权。 |
| 异步输入重复、乱序或过期 | 幂等识别、拒绝回退或挂起对账;不得生成重复裁决或 sequence regression。 |
| 治理事实变化传播失败 | 保留待传播 / failed / retryable / handoff-pending 语义,不得回滚已经成立的 Governance truth。 |
| 派生视图 / report / dashboard 滞后 | 返回 stale / rebuilding / unavailable 或旧视图,不得反写真相。 |
| observability / archive / external GRC 消费失败 | 保留待交接 / failed / retryable 状态,不接管物理日志、归档包正文或外部系统 truth。 |

### 3.6 哪些通信口径若不先写清,后续最容易误入协议细节?

最容易误入协议细节的口径是:

1. 把 Gate / Decision 裁决写成事件目录,而不是同步成立 / 拒绝边界。
2. 把 Policy 生效和 shared rules 写成 runtime cache 或 policy engine 分发机制。
3. 把 Control、AIIA / SoA 和 evidence 协作写成 artifact 正文同步。
4. 把 Nonconformity 线索写成 observability alert 或 work blocker 直接落库。
5. 把 conversation / workspace / console 显化写成治理事实写源。
6. 把 report / dashboard / reconciliation 写成同步成功条件。
7. 把 archive / observability handoff 写成 Governance 保存外部正文。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| `policy-distributor`、subscriptions、gate decided 等旧线索 | 过早锁定组件名、事件名和分发机制 | 改为 Policy / Gate 事实传播和外部结果送达的通信类别 |
| API / application / PostgreSQL / bus 图 | 把代码分层、技术产品和通信方式混在一起 | 本步只写同步 / 异步 / 后台边界 |
| artifact sync、AIIA / SoA metadata、audit trail | 容易把正文、物理审计存储和治理结论混写 | 改为 evidence / artifact 引用输入、治理结论输出和追溯交接 |
| runtime / capability-hub distribution | 容易让 runtime cache / capability registry 反向定义 Policy truth | 改为 Policy 适用结论异步传播和运行反馈送达 |
| report system、external GRC、dashboard | 容易让派生 / 外部系统成为事实源 | 改为后台派生、导出消费或外围增强,不得反写真相 |
| 失败处理偏 SLA、重试、补偿脚本 | 已进入实现机制 | 改为架构层失败、挂起、stale、unresolved、failed、retryable 和不反写真相口径 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 通信主语 | API、事件、policy distributor、artifact sync、report、audit | 正式交互场景与通信方式类别 | 架构层先判断边界语义 |
| 同步边界 | 可能被事件或后台补偿伪装成成功 | 必须即时判定治理事实成立、失败、拒绝或挂起 | 防止伪同步完成 |
| 异步边界 | 容易写成事件目录或订阅列表 | 表达已成立事实传播或外部结果送达 | 防止事件名替代架构判断 |
| 后台承接 | 与核心裁决、Policy 生效和合规结论混在一起 | 只处理派生、报告、对账、刷新、交接和维护 | 防止维护任务反写真相 |
| 失败口径 | 技术重试、SLA 或外部系统补偿 | 明确失败、挂起、未解析、stale、failed、retryable 和不得伪造正文 | 对齐 Step 8 数据所有权和一致性策略 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 所有治理变化都同步完成 | 调用方心智简单 | 会强迫下游显化、runtime cache、report、archive 和 external GRC 阻塞核心 truth | 不采用 |
| 方案 B: 所有治理变化都异步化 | 解耦程度高 | Gate / Decision、Policy 生效、Control 适用和纠正闭环缺少即时成立 / 拒绝口径 | 不采用 |
| 方案 C: 同步收口核心治理事实,异步传播已成立事实和外部结果,后台承接派生 / 对账 / 交接 | 符合数据归属、依赖方向和一致性策略 | 后续详细设计必须清楚标注状态和边界 | 采用 |
| 方案 D: 先锁定 API、event、queue、policy engine 和 report system,再反推交互方式 | 实施看似直接 | 会让技术选型反向决定治理语义 | 不采用 |
| 方案 E: 让 external GRC / observability / archive 参与治理事实写入 | 贴近传统合规工具链 | 会形成第二 truth,并破坏 Governance 作为治理事实仓的定位 | 不采用 |

### 6.1 待确认问题的方案选择

#### Gate / Decision 是否可以异步补写后再视为成功?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 可以先接受请求,后台补写裁决结果 | 调用方会把未成立裁决误认为正式治理结论 |
| 方案 B | 不可以;同步边界必须返回成立、拒绝、挂起或待人工裁决 | 保持关键节点治理裁决的正式性 |

推荐方案 B。

#### Policy 生效是否由 runtime cache / policy engine 成功决定?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | runtime cache / engine 分发成功才算生效 | 执行层会反向定义 Policy truth |
| 方案 B | Governance 内部 Policy effective fact 成立即为正式 truth,下游分发异步消费 | 保持 Policy truth 和执行 cache 边界 |

推荐方案 B。

#### report / dashboard / external GRC 是否可以反写治理事实?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 可以根据报表或外部 GRC 状态回写 | 派生和外部系统成为第二 truth |
| 方案 B | 只能从 Governance truth 派生或导出,不得反写 | 支撑消费和合规展示,同时保护核心 truth |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 治理语境与适用对象变更 | 下游消费 / 管理入口边界 ↔ Governance 同步入口 | 判断 actor、scope、适用对象、治理目的和责任语境是否可正式建立或调整。 | 该场景会改变 Governance truth,必须即时收口。 |
| 关键节点 Gate / Decision 裁决 | process / work / conversation / workspace / console 边界 ↔ Governance 同步入口 | 判断关键节点治理裁决是否可提出、评审、通过、拒绝、取消或过期。 | 裁决结果是治理事实主线,不能后台伪成功。 |
| Approval / authorization responsibility | identity / 管理入口 / 审批消费边界 ↔ Governance 同步入口 | 判断审批、投票、授权、替代裁决和责任归属是否成立。 | 责任事实必须绑定正式 actor / role 语境和治理范围。 |
| Policy / shared rules 生效 | 管理入口 / method / runtime / capability 边界 ↔ Governance 同步入口 | 判断 Policy 生效、范围、优先级、冲突、替代和 shared rules 是否成立。 | Governance 拥有 Policy effective fact;runtime cache 只是消费。 |
| Control 适用与复核 | method / work / artifact / observability 边界 ↔ Governance 同步入口 | 判断控制适用、实施、复核、违反和整改关联是否成立。 | Control definition 不归 Governance,但适用和复核结论归 Governance。 |
| AIIA / SoA 治理评审 | artifact / method / 管理入口边界 ↔ Governance 同步入口 | 判断影响评估、适用性声明、控制覆盖、排除和批准结论是否成立。 | 正文归 artifact / method,治理结论归 Governance。 |
| Nonconformity 纠正闭环 | observability / work / artifact / 管理入口边界 ↔ Governance 同步入口 | 判断不符合、原因、纠正、复验和关闭治理处置是否成立。 | 不符合可由外部线索触发,但闭环 truth 由 Governance 收口。 |
| 治理事实查询与追溯读取 | SDK / workspace / console / conversation / observability / archive 边界 ↔ Governance 同步入口 | 授权读取治理语境、裁决、Policy、Control、评审、纠正和追溯信息。 | 查询必须即时判断授权、可见性和 stale / unavailable 口径,但不得改变 truth。 |
| 外部语境 / 定义 / 证据 / 反馈送达 | 事件协作 / 外部能力接缝 ↔ Governance 异步输入 | 承接 identity、method、process、work、artifact、runtime、capability、observability 等已成立外部事实或摘要。 | 该场景是外部正式结果送达,不是源码穿透或正文复制。 |
| Governance 事实变化传播 | Governance truth 边界 ↔ bus / process / work / artifact / conversation / runtime / observability / archive 消费边界 | 将已经成立的治理事实变化传播给相邻仓或消费方。 | 传播失败不能反向取消已经成立的 Governance truth。 |
| Policy / automation boundary 下游消费 | Governance truth 边界 ↔ runtime / member-service / capability 消费边界 | 让执行和能力层消费 Policy 适用、自动化授权和工具治理约束。 | 下游 cache / execution result 不反向定义 Policy truth。 |
| 派生视图 / report / dashboard 维护 | Governance truth 边界 ↔ 派生承载 / 后台维护边界 | 维护治理 read model、dashboard、report 和公开消费摘要。 | 派生结果可延迟和重建,不得成为第二 truth。 |
| Reconciliation / consistency check | 后台维护边界 ↔ Governance truth / 外部引用 / 派生状态 | 检查外部引用、事件消费、派生结果和交接材料是否可解释一致。 | 对账只能输出报告、marker 或维护状态,不得改写核心 truth。 |
| Observability / archive / external GRC handoff | Governance truth / 派生材料边界 ↔ 追溯交接 / 导出消费边界 | 交接治理追溯、合规材料、报告、归档准备或外部系统导出材料。 | 交接可延迟,但不得让接收方反向定义治理事实。 |
| 受控维护与重建 | 运维 / 审计入口边界 ↔ 后台维护与派生边界 | 触发派生重建、引用刷新、维护报告或交接重试。 | 维护只能修复辅助结构或暴露异常,不得隐式覆盖业务事实。 |

### 7.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 治理语境与适用对象变更 | 同步请求 / 响应类交互 | 不宜以后置事件或后台补偿作为主路径 | 明确失败、拒绝、unresolved 或 pending | 该场景直接改变核心治理语境。 |
| 关键节点 Gate / Decision 裁决 | 同步请求 / 响应类交互 | 不宜先返回成功再后台补裁决 | 返回成立、拒绝、取消、过期、待人工或依据不足 | 裁决是关键节点正式结论。 |
| Approval / authorization responsibility | 同步请求 / 响应类交互 | 不宜由 identity 或下游入口直接生成责任 truth | 责任语境不可解析时挂起或拒绝 | 审批和授权责任必须即时绑定正式治理上下文。 |
| Policy / shared rules 生效 | 同步请求 / 响应类交互 + 异步下游消费 | 不宜由 runtime cache / engine 成功决定生效 | 冲突或定义不可解析时拒绝 / unresolved;下游消费失败保留待传播 | Policy truth 与执行 cache 分离。 |
| Control 适用与复核 | 同步请求 / 响应类交互 | 不宜由 method definition 或 observability alert 直接写核心 | 定义 / 依据缺失时挂起、拒绝或标记未闭合 | Governance 拥有适用和复核结论。 |
| AIIA / SoA 治理评审 | 同步请求 / 响应类交互 | 不宜同步保存 artifact / method 正文 | evidence 未闭合时 pending / evidence-not-closed | 正文引用和治理结论分离。 |
| Nonconformity 纠正闭环 | 同步请求 / 响应类交互 + 异步线索输入 | 不宜让 work blocker / alert 直接关闭治理不符合 | 原因 / 纠正 / 复验不足时保持未关闭 | 外部线索可送达,闭环 truth 由 Governance 收口。 |
| 治理事实查询与追溯读取 | 同步请求 / 响应类交互 | 不宜用异步推送替代正式读取判断 | 返回可见结果、不可见、stale、unavailable 或明确失败 | 读取边界要即时执行授权和一致性口径。 |
| 外部语境 / 定义 / 证据 / 反馈送达 | 异步事件 / 回调类交互 | 不宜要求来源仓同步穿透本仓核心 | 保持未送达、待解析、unresolved 或不可接受状态 | 来源事实已在来源仓成立,进入 Governance 应经正式边界。 |
| Governance 事实变化传播 | 异步事件 / 回调类交互 | 不宜要求所有下游同步确认后才成立主真相 | 保持待消费、failed、retryable 或 handoff-pending | 事实已成立,传播失败不回滚核心真相。 |
| Policy / automation boundary 下游消费 | 异步事件 / 回调类交互 + 同步只读查询 | 不宜让下游 cache 成为 Policy 生效来源 | cache 未更新时标记待传播或保守执行 | 执行层消费治理约束,不定义治理事实。 |
| 派生视图 / report / dashboard 维护 | 后台任务 / 延后承接类交互 | 不宜阻塞核心同步变更 | 保留旧视图、stale、rebuilding、failed 或 unavailable | 派生消费最终一致。 |
| Reconciliation / consistency check | 后台任务 / 延后承接类交互 | 不宜作为业务写路径 | 输出异常、报告、marker 或 failed 状态,不得改写主真相 | 对账用于解释和维护。 |
| Observability / archive / external GRC handoff | 异步事件 / 回调类交互 + 后台任务 / 延后承接 | 不宜作为 Governance truth 成立前置 | 保留 pending、failed、retryable 或待导出状态 | 交接和导出可延迟,接收方不反写真相。 |
| 受控维护与重建 | 后台任务 / 延后承接类交互 | 不宜伪装成同步业务变更成功 | 挂起、失败或输出维护异常,不得覆盖业务事实 | 维护任务只修复派生或暴露问题。 |

### 7.3 简化交互示意图

```text
+------------------------------+       +------------------------------+
| 下游消费 / 管理入口边界       |       | 外部语境 / 定义 / 证据边界   |
| sdk / workspace / console    |       | identity / method / peers    |
| process / work / conversation|       | artifact / runtime / alerts  |
+--------------+---------------+       +--------------+---------------+
               | [sync request / response]             |
               v                                       | [async event / callback]
+--------------+---------------+       +--------------+---------------+
| Governance 同步入口           |       | Governance 异步输入消费       |
+--------------+---------------+       +--------------+---------------+
               |                                      |
               +------------------+-------------------+
                                  |
                                  v
                       +----------+-----------+
                       | Governance truth     |
                       | decision / policy /  |
                       | control / compliance |
                       +----+-------------+---+
                            |             |
              [async event] |             | [background]
                            v             v
              +-------------+------+   +--+----------------+
              | 下游 / 追溯 / 归档 |   | 派生 / 报告 /    |
              | 交接边界           |   | 对账承接         |
              +--------------------+   +-------------------+
```

图示说明:

- 同步请求 / 响应用于即时判断 Governance 核心事实是否成立,不是表达具体协议。
- 异步事件 / 回调用于已成立事实传播或外部结果送达,不是事件目录。
- 后台任务 / 延后承接用于派生、报告、对账、刷新、重建和交接材料形成,不得反写真相。
- 图不表达接口路径、事件名、处理顺序、技术产品、队列、topic 或运行部署拓扑。

### 7.4 边界说明

`L1-governance` 的通信方式按边界语义选择:核心治理事实是否成立需要同步收口,已成立事实传播和外部结果送达适合异步承接,派生、报告、对账、刷新和归档准备适合后台延后承接。同步返回成功只能表示该同步边界内的正式治理判断已经成立,不能代替下游 cache、conversation display、workspace view、report、observability、archive 或 external GRC 消费完成。异步和后台失败只能表现为未送达、待交接、旧视图、未解析、对账异常、failed 或 retryable,不能回滚已经成立的 Governance truth。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §10 “关键交互与通信方式”直接摘录并整理本文件 §7.1、§7.2、§7.3 和 §7.4。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Gate / Decision 裁决是否可以后台补写后再视为成功 | A. 可以;B. 不可以,同步边界必须明确成立、拒绝或挂起 | B | 关键节点治理裁决是核心 truth,不能伪同步完成 | 已确认采用 B |
| Policy 生效是否由 runtime cache / policy engine 成功决定 | A. 是;B. 否,Governance effective fact 是 truth,下游消费异步 | B | 防止执行层反向定义 Policy truth | 已确认采用 B |
| report / dashboard / reconciliation 是否阻塞核心写入 | A. 阻塞;B. 不阻塞,后台最终一致;C. 由实现决定 | B | 派生辅助可延迟和重建,不得阻塞核心 truth | 已确认采用 B |
| observability / archive / external GRC 交接失败是否回滚 Governance truth | A. 回滚;B. 不回滚,保留待交接 / failed / retryable | B | 横切消费和外部导出失败不能改变已经成立的治理事实 | 已确认采用 B |
| 外部 alert / work blocker / artifact evidence 是否可以直接创建或关闭 Nonconformity | A. 可以;B. 不可以,只能作为线索或依据输入,闭环由 Governance 收口 | B | 防止外部 truth 直接写治理纠正闭环 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 10 的待确认事项。具体 API / Command / Query、event 名称、callback 形态、DTO、schema、topic、队列产品、重试策略、调度机制、transaction、outbox、publisher / consumer 和处理流程留到后续概要 / 详细设计与技术选型继续收敛。

---

## 10. 进入下一步条件

- 已明确关键交互场景及其正式边界位置。
- 已明确同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接的适用场景。
- 已明确不宜采用的方式和失败处理口径。
- 已明确 Gate / Decision、Policy、Control、AIIA / SoA、Nonconformity、查询追溯、事实传播、派生报告、对账和归档交接的通信类别。
- 未写接口目录、事件目录、时序图、协议选型、技术产品、DTO schema、topic、transaction、outbox 或失败机制实现。
- 可以进入 Step 10“关键技术选型”。
