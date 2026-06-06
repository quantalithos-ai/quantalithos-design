# Step 12. 接口与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 12
> 回填章节: `00-需求文档.md` §12 接口与依赖
> 生成日期: 2026-06-06

---

## 1. 本步目标

说明 `L1-governance` 在需求层对外体现为哪些能力级接口面,以及它消费哪些外部能力级输入面。本步承接 Step 6 的依赖裁剪、Step 9 的功能需求和 Step 11 的数据归属,只写能力边界,不写 API 路径、Command 名、DTO schema、事件 schema、字段名、handler / service / repository、outbox、重试、fallback、relay 或 transaction。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定编译期、运行期、事件协作、追溯交接和下游消费依赖裁剪 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定本仓对外体现的能力主题 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 固定真相、快照、引用和禁止正文边界 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定接口不能打穿的规则边界 |
| 旧 `projects/L1-governance/00-需求文档.md` §10 | 旧版接口与依赖 | 作为 artifact、observability、runtime / capability-hub、conversation、work 等线索,不继承接口名和 SLA |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取 Gate / Policy / Control / AIIA / SoA / Nonconformity 能力边界线索,不继承 RPC、event data 或存储设计 |

---

## 3. SOP 问题回答

### 3.1 本仓对外提供哪些能力级接口?

`L1-governance` 对外提供的是治理决策与治理控制事实能力边界,不是协议方法清单:

| 能力级接口面 | 说明 |
|---|---|
| 治理语境与适用对象变更入口 | 对外体现为把 actor、scope、适用对象和治理目的收束为正式治理语境的能力入口。 |
| 关键节点治理裁决入口 | 对外体现为提出、评审、裁决、取消或过期关键节点治理裁决的能力入口。 |
| 审批与授权责任入口 | 对外体现为审批、投票、授权、替代裁决责任和决策责任追溯的能力入口。 |
| Policy 生效与授权约束入口 | 对外体现为维护 Policy 生效、范围、优先级、冲突、shared rules 和自动化授权边界的能力入口。 |
| Control 适用与复核入口 | 对外体现为维护控制适用、实施、复核、违反和整改关联的能力入口。 |
| AIIA / SoA 治理评审结论入口 | 对外体现为形成影响评估、适用性声明、控制覆盖和批准结论的能力入口。 |
| Nonconformity 纠正闭环入口 | 对外体现为提出不符合、确认原因、跟踪纠正、复验和关闭治理处置的能力入口。 |
| 治理事实查询与追溯入口 | 对外体现为授权读取治理语境、裁决、策略、控制、评审和纠正事实的能力入口。 |
| 治理事实事件输出 | 对外体现为治理事实关键变化可被相邻仓持续消费的输出能力。 |
| 治理事实维护、报告和归档准备入口 | 对外体现为后台维护、对账、生成报告和准备归档 / 恢复材料的任务能力。 |

### 3.2 本仓消费哪些能力级输入?

`L1-governance` 消费外部能力级输入,但不接管外部真相:

| 输入面 | 来源 | 说明 |
|---|---|---|
| 共享契约输入 | `L0-core` | 使用跨仓 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、配置和 evidence 基线。 |
| 事件协作输入 / 输出 | `L0-bus` | 通过事件协作发布 Governance facts 并消费相邻仓变化。 |
| actor / member / role 输入 | `L1-identity` | 用于 decision maker、policy scope、责任语境和审计 actor,不保存成员正文。 |
| process waiting / activity 语境输入 | `L1-process` | 用于过程触发 Gate、等待恢复和治理裁决回链,不拥有过程 truth。 |
| project / work / iteration 语境输入 | `L1-work` | 用于项目、工作和高风险变更治理语境,不拥有工作 truth。 |
| artifact / evidence / AIIA / SoA 正文引用输入 | `L1-artifact` | 用于评审、证据、正文引用和批准结论,不保存正文。 |
| method / AIPolicyDef / Control definition 输入 | `L3-method-library` | 用于策略和控制定义来源,不拥有定义正文。 |
| runtime / capability feedback 输入 | `L2-runtime` / `L3-capability-hub` | 用于 Policy 适用反馈、能力使用异常和工具治理线索,不保存执行正文。 |
| conversation display / context 输入 | `L1-conversation` | 用于治理显化和对话回链,不保存 conversation truth。 |
| observability alert / audit summary 输入 | `L4-observability` | 用于复核、不符合线索和审计回链,不拥有观测存储。 |

### 3.3 哪些是同步能力边界,哪些是异步能力边界?

| 边界类型 | 能力边界 | 说明 |
|---|---|---|
| 同步能力边界 | 治理语境与适用对象变更入口 | 需要立即判断治理语境是否可建立或调整。 |
| 同步能力边界 | 关键节点治理裁决入口 | 需要按规则判断裁决是否可提出、评审或形成结论。 |
| 同步能力边界 | Policy / Control / AIIA / SoA / Nonconformity 变更入口 | 需要按治理规则判断正式治理事实是否可变化。 |
| 同步能力边界 | 治理事实查询与追溯入口 | 需要按授权和一致性口径读取当前治理事实。 |
| 同步 / 后台能力边界 | 治理事实维护、报告和归档准备入口 | 可由后台任务触发,也可由运维或合规维护语境触发。 |
| 异步能力边界 | 治理事实事件输出 | 变化发生后供 process、work、artifact、conversation、runtime、workspace、observability、archive 等持续消费。 |
| 异步能力边界 | process / work / artifact / runtime / observability 等输入 | 可通过事件或运行期协作影响 Governance 判断,但不改变依赖类型为编译期。 |

### 3.4 哪些依赖是输入型,哪些结果是输出型?

| 方向 | 能力边界 |
|---|---|
| 输入型 | `L0-core` 共享契约、identity actor / role、process waiting 语境、work 项目语境、artifact evidence 引用、method definition、runtime / capability feedback、conversation context、observability summary |
| 输出型 | Gate / Decision 结论、Approval / responsibility 事实、Policy effective fact、Control 适用和复核、AIIA / SoA 治理结论、Nonconformity 纠正闭环、治理查询结果和归档 / 审计材料 |
| 双向协作型 | `L0-bus` 事件协作、process waiting gate 协作、artifact 双身份 / evidence 协作、runtime / capability Policy 反馈、conversation 显化和上下文回链 |

### 3.5 哪些能力边界属于当前阶段核心闭环,哪些只是外围增强?

| 能力边界 | 能力层级 |
|---|---|
| 治理语境与适用对象变更入口 | 核心闭环能力 |
| 关键节点治理裁决入口 | 核心闭环能力 |
| 审批与授权责任入口 | 核心闭环能力 |
| Policy 生效与授权约束入口 | 核心闭环能力 |
| Control 适用与复核入口 | 核心闭环能力 |
| AIIA / SoA 治理评审结论入口 | 核心闭环能力 |
| Nonconformity 纠正闭环入口 | 核心闭环能力 |
| 治理事实查询、事件输出、维护、报告和归档准备 | 核心闭环能力 |
| 高级治理看板、Policy DSL 模拟、复杂 Gate 编排、外部 GRC 集成和容量趋势 | 外围增强能力 |

### 3.6 哪些能力边界来自 Step 6 的编译期 / 运行期 / 事件协作依赖判断?

| 来源依赖类型 | 能力边界 |
|---|---|
| 编译期依赖 | `L0-core` 共享契约输入 |
| 事件协作依赖 | `L0-bus` 事件协作、Governance 事件输出、process / work / artifact / runtime / observability 等事件输入或消费 |
| 运行期依赖 | `L1-identity`、`L1-process`、`L1-work`、`L1-artifact`、`L3-method-library`、`L2-runtime`、`L3-capability-hub`、`L1-conversation`、`L4-observability` 的能力级输入边界 |
| 下游消费 / 追溯交接 | `L1-workspace`、`L5-console`、`L4-archive`、`L0-sdk` 对 Governance 能力、snapshot 或追溯材料的消费边界 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §10.1 | 把 PostgreSQL、artifact、observability、runtime / capability-hub、conversation、work 放入外部系统依赖表 | 混合外部系统、内部仓、实现候选和依赖类型 | Step 12 只写能力级依赖边界,PostgreSQL 后移架构 / 配置 / 实施 |
| 旧 `00-需求文档.md` §10.2 | 写 governance service、gate decided、policy cache、control violated 等上下游接口线索 | 已滑入协议、事件名和实现协作 | 改为输入 / 输出能力边界 |
| 旧 `01-架构设计.md` | 写 policy-distributor、subscriptions、ArtifactSync 等组件 | 组件和适配器属于架构 / 详细设计 | 本步只保留能力级接口和依赖 |
| `domain/governance/README.md` | 大量 RPC、事件名、event data、数据库、状态机和订阅表 | 层级过深 | 本步只提取能力边界,不继承协议名和字段 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口表达 | RPC / event / upstream / downstream 线索 | 查询接口、变更接口、事件输入 / 输出、后台任务能力 | 对齐需求规范 4.12 |
| 依赖表达 | 仓列表 + SLA + 降级 | 能力输入 / 输出边界 + 全局依赖类型 | 避免把运行期或事件协作写成 package dependency |
| PostgreSQL / audit store | 写为外部系统依赖 | 当前需求 Step 12 不定稿 | 存储实现属于后续架构 / 配置 / 实施 |
| runtime / capability-hub | 容易写成 Policy truth 来源 | 只作为 Policy 消费方和反馈输入 | 守住 Policy truth 边界 |
| artifact / AIIA / SoA | 容易写成 Governance 保存正文 | 只作为正文 / evidence 引用输入和治理结论输出 | 守住 artifact / Governance 边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧上下游接口表 | 快,覆盖已知依赖 | 混入协议、事件名、实现和错误依赖类型 | 不采用 |
| 方案 B: 按能力级接口与依赖边界重写 | 能支撑后续架构设计和依赖裁剪 | 后续仍需详细设计拆协议 | 采用 |
| 方案 C: 只写 Gate / Policy 接口面 | 文档短 | 会漏掉 Control、AIIA、SoA、Nonconformity 和维护 / 报告边界 | 不采用 |
| 方案 D: 在需求层直接列 Command / Query / Event | 接近实现 | 违反需求粒度,容易和详细设计冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否在 Step 12 写 API / Command / event 名?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写 RaiseGate、DecideGate、ActivatePolicy 等名称 | 会提前固定协议和实现边界 |
| 方案 B | 只写能力级接口面 | 保护需求层粒度,后续详细设计再拆协议 |

推荐方案 B。原因是 Step 12 目标是接口面,不是协议契约。

#### 是否把 PostgreSQL / audit store 写入外部依赖边界?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写入 Step 12 | 会把存储实现和审计物理存储提前固化 |
| 方案 B | 不写入,后移架构 / 配置 / 实施 | 保持需求层只表达能力依赖 |

推荐方案 B。原因是 Step 12 不定义存储和观测实现。

#### 是否把 bus 作为编译期依赖?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成 package dependency | 会破坏 Step 6 的依赖裁剪 |
| 方案 B | 写成事件协作依赖 | 对齐全局依赖类型 |

推荐方案 B。原因是当前 `L1-governance` 唯一编译期依赖只允许 `L0-core`。

---

## 7. 结构化中间产物

### 7.1 对外能力接口结论

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | 治理语境与适用对象变更 | 对外体现为正式建立或调整 actor、scope、适用对象和治理目的的能力入口。 | 核心闭环能力 |
| 变更接口 | 关键节点治理裁决变更 | 对外体现为提出、评审、裁决、取消或过期关键节点治理裁决的能力入口。 | 核心闭环能力 |
| 变更接口 | 审批与授权责任变更 | 对外体现为审批、投票、授权、替代裁决责任和决策责任追溯的能力入口。 | 核心闭环能力 |
| 变更接口 | Policy 生效与授权约束变更 | 对外体现为维护 Policy 生效、范围、优先级、冲突、shared rules 和自动化授权边界的能力入口。 | 核心闭环能力 |
| 变更接口 | Control 适用与复核变更 | 对外体现为维护控制适用、实施、复核、违反和整改关联的能力入口。 | 核心闭环能力 |
| 变更接口 | AIIA / SoA 治理评审结论变更 | 对外体现为形成影响评估、适用性声明、控制覆盖和批准结论的能力入口。 | 核心闭环能力 |
| 变更接口 | Nonconformity 纠正闭环变更 | 对外体现为提出不符合、确认原因、跟踪纠正、复验和关闭治理处置的能力入口。 | 核心闭环能力 |
| 查询接口 | 治理事实查询与追溯 | 对外体现为稳定读取和引用治理语境、裁决、策略、控制、评审、纠正和追溯信息的能力入口。 | 核心闭环能力 |
| 事件输出 | 治理事实变化输出 | 对外体现为 Gate、Approval、Policy、Control、AIIA / SoA、Nonconformity 等关键变化可被持续消费的输出能力。 | 核心闭环能力 |
| 后台任务接口 | 治理事实维护、报告和归档准备 | 对外体现为维护派生结果、对账、生成报告和准备归档 / 恢复材料的后台能力入口。 | 核心闭环能力 |
| 查询接口 | 高级治理看板和外部审计消费 | 对外体现为高级报表、趋势、外部 GRC 导出和合规管理消费能力。 | 外围增强能力 |

### 7.2 外部依赖边界结论

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | Governance 使用共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线。 | 核心闭环能力 |
| 输入 / 输出 | 下游消费依赖 | `L0-bus` | 事件协作依赖 | Governance 通过事件协作发布治理事实变化并消费外部变化。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-identity` | 运行期依赖 | Governance 消费 actor / member / role 引用和成员生命周期边界。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L1-process` | 运行期 / 事件协作依赖 | Governance 消费过程等待 / Activity 语境并输出治理裁决结论。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L1-work` | 运行期 / 事件协作依赖 | Governance 消费项目 / 工作对象治理语境并输出治理约束与裁决结论。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L1-artifact` | 运行期 / 事件协作依赖 | Governance 消费 artifact / evidence / AIIA / SoA 正文引用并输出治理批准结论。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L3-method-library` | 运行期依赖 | Governance 消费 AIPolicyDef、method、role、control definition 等定义来源。 | 核心闭环能力 |
| 输入 / 输出 | 下游消费依赖 | `L1-conversation` | 运行期 / 事件协作依赖 | Governance 提供治理事实显化输入并消费对话上下文回链。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L2-runtime` / `L2-member-service` | 运行期 / 事件协作依赖 | Runtime / member-service 消费 Policy / autonomy 约束,并提供受控反馈线索。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L3-capability-hub` | 运行期 / 事件协作依赖 | Capability-hub 消费能力使用约束和工具治理授权,并提供能力反馈线索。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L4-observability` | 事件协作 / 追溯交接 | Governance 输出审计材料并消费观测告警 / audit summary。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L1-workspace` / `L5-console` | 下游消费 / 运行期提供 | Governance 向 workspace / console 提供只读治理事实和管理入口来源。 | 核心闭环能力 / 外围增强能力 |
| 输出 / 交接 | 下游消费 / 追溯交接依赖 | `L4-archive` | 下游消费 / 运行期提供 + 事件协作 / 追溯交接 | Governance 提供治理事实、合规材料和归档 / 恢复切片来源。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-sdk` | 下游消费 / 运行期提供 | Governance 能力由 SDK 封装给产品入口和外部调用方消费。 | 核心闭环能力 |

### 7.3 接口类型结论

| 接口类型 | 本仓使用情况 |
|---|---|
| 查询接口 | 治理事实查询与追溯、高级治理看板和外部审计消费 |
| 变更接口 | 治理语境、关键节点裁决、审批授权、Policy、Control、AIIA / SoA、Nonconformity 等正式治理变化 |
| 事件输出 | 治理事实变化输出 |
| 事件输入 | process、work、artifact、runtime、capability、observability 等事件协作输入;具体 schema 后续详细设计再定 |
| 后台任务接口 | 治理事实维护、报告和归档准备 |

### 7.4 依赖类型结论

| 依赖类型 | 本仓使用情况 |
|---|---|
| 定义来源依赖 | `L0-core` 共享契约;`L3-method-library` method / AIPolicyDef / control definition 来源 |
| 治理结论依赖 | Governance 对外提供 Gate / Decision、Policy、Control、AIIA / SoA、Nonconformity 等结论 |
| 下游消费依赖 | `L0-bus`、`L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L3-capability-hub`、`L1-workspace`、`L5-console`、`L4-observability`、`L4-archive`、`L0-sdk` 对 Governance 输出的消费 |
| 外部能力依赖 | `L1-identity`、`L1-process`、`L1-work`、`L1-artifact`、`L3-method-library`、`L2-runtime`、`L3-capability-hub`、`L1-conversation`、`L4-observability` 的能力级输入 |

### 7.5 能力边界与全局依赖类型映射结论

| 能力边界 | 关联方 | 全局依赖类型 | 约束 |
|---|---|---|---|
| 共享契约输入 | `L0-core` | 编译期依赖 | 唯一允许进入 package dependency 的上游 |
| 事件协作主干 | `L0-bus` | 事件协作依赖 | 不得转写成 Cargo path dependency |
| actor / member / role 输入 | `L1-identity` | 运行期依赖 | 只消费 actor、member、role 边界 |
| process waiting / activity 输入与裁决输出 | `L1-process` | 运行期 / 事件协作依赖 | 不拥有 process truth |
| project / work 输入与治理约束输出 | `L1-work` | 运行期 / 事件协作依赖 | 不拥有 work truth |
| artifact / evidence 输入与批准结论输出 | `L1-artifact` | 运行期 / 事件协作依赖 | 不保存 artifact / evidence / AIIA / SoA 正文 |
| method / AIPolicyDef / control definition 输入 | `L3-method-library` | 运行期依赖 | 不保存定义正文 |
| conversation 显化输出与上下文输入 | `L1-conversation` | 运行期 / 事件协作依赖 | 不保存 conversation 正文 |
| policy / autonomy 输出和反馈输入 | `L2-runtime` / `L2-member-service` / `L3-capability-hub` | 运行期 / 事件协作依赖 | 不保存 execution 或 capability registry 正文 |
| observability 输入 / 输出 | `L4-observability` | 事件协作 / 追溯交接 | 不拥有 audit store、metrics 或 trace storage |
| workspace / console / archive / SDK 输出 | `L1-workspace`、`L5-console`、`L4-archive`、`L0-sdk` | 下游消费 / 运行期提供 / 追溯交接 | 只输出 Governance 能力、快照或 export 来源 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §12。正式文档可摘录本文件 §7.1~§7.5 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 12. 接口与依赖

> 校准来源:
> - `design-calibration/00_req_step_12_interfaces_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“能力边界与全局依赖类型映射结论”小节,了解本章如何承接依赖裁剪与数据归属。

本文采用 `design-calibration/00_req_step_12_interfaces_dependencies.md` §7 的能力级接口与依赖结论。`L1-governance` 对外提供治理语境、关键节点裁决、审批授权、Policy、Control、AIIA / SoA、Nonconformity、查询追溯、事件输出、维护报告和归档准备能力;外部输入来自 core 共享契约、bus 事件协作、identity actor / role、process waiting 语境、work 项目语境、artifact evidence 引用、method definition、runtime / capability feedback、conversation context 和 observability summary。除 `L0-core` 外,其他关系不得写成编译期依赖。

正式接口与依赖表应摘录:

- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.1 对外能力接口结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.2 外部依赖边界结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.3 接口类型结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.4 依赖类型结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.5 能力边界与全局依赖类型映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在 Step 12 写 API / Command / event 名 | 写 | 只写能力级接口面 | 推荐 B。原因是协议契约属于详细设计 |
| Q-002 | 是否把 PostgreSQL / audit store 写入外部依赖 | 写入 | 后移架构 / 配置 / 实施 | 推荐 B。原因是存储和审计物理实现不是需求层正式依赖 |
| Q-003 | 是否把 bus 写成编译期依赖 | 是 | 否,写为事件协作依赖 | 推荐 B。原因是唯一编译期依赖只允许 `L0-core` |
| Q-004 | 是否把 runtime / capability-hub 写成 Policy truth 来源 | 是 | 否,只作为 Policy 消费方和反馈输入 | 推荐 B。原因是执行层消费 Policy,不定义 Policy truth |

当前建议:接受上述推荐后进入 Step 13。

---

## 10. 进入下一步条件

- 已明确对外能力接口结论和外部依赖边界结论。
- 已区分查询接口、变更接口、事件输入 / 输出和后台任务接口。
- 已区分定义来源依赖、治理结论依赖、下游消费依赖和外部能力依赖。
- 已承接 Step 6 的编译期 / 运行期 / 事件协作 / 追溯交接 / 下游消费依赖判断。
- 未写 API 路径、Command 名、DTO schema、事件 schema、字段、handler / service / repository、outbox、重试、fallback、relay 或 transaction。
