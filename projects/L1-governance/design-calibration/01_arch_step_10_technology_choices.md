# Step 10. 关键技术选型

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 10
> 回填章节: `01-架构设计.md` §11 关键技术选型
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-governance` 当前架构主线中哪些技术机制、架构手段或治理方式已经上升为架构层决定,分别解决什么结构问题、为什么当前采用、带来什么代价或约束。

本步不写技术栈清单、产品名、框架名、协议选型、数据库选型、队列产品、缓存产品、规则引擎、外部 GRC 产品、接口路径、事件名、DTO、schema、表结构、索引、P95 指标、部署参数或代码对象。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束和当前阶段取舍 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载和派生承载角色 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 提供核心保护、外部接缝、依赖倒置、跨仓裁剪和禁止反向依赖 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供正式真相、快照 / 投影、引用和一致性口径 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步 / 异步 / 后台延后承接判断 |
| `00_req_step_13_non_functional_requirements.md` | 已完成 | 提供性能、可用性、安全、追溯、幂等、一致性和可观测性判断口径 |
| 旧 `01-架构设计.md` §2 / §3 / §6 / §8 / §10 | 旧 Draft | 作为旧 PostgreSQL、audit store、Policy engine、policy-distributor、external GRC、report system 和旧性能数字问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前采用哪些关键架构机制?

当前正式采用的关键机制是:

1. 通过正式承接边界隔离外部输入与 Governance 核心语义。
2. 通过运行期接缝、引用、快照、safe summary 和事件协作承接非 `L0-core` sibling 仓。
3. 采用 Governance truth / external snapshot / reference / derived separation。
4. Governance 核心真相内部强一致,外部快照、下游消费、报告、对账和归档交接最终一致。
5. 同步核心治理事实判断、异步外部结果送达和事实传播、后台派生 / 对账 / 交接三类路径分离。
6. Policy effective fact 与 runtime cache / policy engine / capability whitelist 分离。
7. AIIA / SoA / Control / evidence 正文引用与治理结论分离。
8. Nonconformity 线索输入与治理纠正闭环 truth 分离。
9. 采用只读派生视图 / report / dashboard / reconciliation 承接下游消费和维护解释。
10. 异步输入、重复裁决请求、事件重放和消费状态采用幂等与顺序保护。
11. 关键治理变化、消费、报告、对账和归档准备采用 traceability / evidence / handoff 记录机制。
12. 具体语言、数据库、消息产品、规则引擎、外部 GRC、report 系统和性能数字暂不作为架构硬选型。

这些都是机制级架构选择,不是产品或实现清单。

### 3.2 每个机制解决什么问题?

这些机制分别解决外部来源打穿治理核心、相邻仓 truth 漂移、正文入仓、派生结果反写真相、下游消费阻塞主链、runtime cache 反向定义 Policy、artifact / method 正文被复制、alert / blocker 直接关闭 Nonconformity、重复输入产生重复裁决、关键变化不可追溯和旧技术假设污染新版架构等结构性问题。

### 3.3 为什么不用其他方案?

不采用“外部入口直接写 Governance 核心”,因为会让 process、work、artifact、conversation、runtime、observability、workspace、console 或 external GRC 反向定义治理事实。

不采用“直接依赖相邻仓源码”,因为会破坏 `L0-core` 唯一编译期依赖和 L1 平权真相域边界。

不采用“复制 artifact / method / observability / external GRC 正文”,因为会让 Governance 接管外部正文和生命周期。

不采用“runtime cache / policy engine 成功才算 Policy 生效”,因为执行层和工具层会反向定义 Policy truth。

不采用“report / dashboard / reconciliation / external GRC 反写治理事实”,因为派生和外部系统会成为第二 truth。

不采用“所有治理变化同步完成”或“所有治理变化异步化”,因为核心裁决、Policy、Control 和纠正闭环需要同步成立 / 拒绝口径,事实传播、下游消费、报告和归档交接又不应阻塞核心 truth。

### 3.4 每个选型带来什么代价或新风险?

这些机制共同带来的代价是:边界层更多、状态表达更严格、引用和快照状态需要显式维护、异步传播和交接需要可追踪、report / dashboard / reconciliation 需要 stale / rebuilding / failed 语义、Policy 生效与下游执行 cache 可能短暂不一致、后续详细设计必须持续防止实现层绕过正文边界、依赖边界和派生反写边界。

它们降低了 Governance truth 被污染的风险,但提高了对象状态、承接规则、追溯证据和运维解释的设计成本。

### 3.5 哪些选型是当前阶段必要的,哪些暂不引入?

| 类别 | 当前口径 |
|---|---|
| 当前阶段必要 | 正式承接边界、依赖倒置、truth / snapshot / reference / derived separation、核心强一致 + 外围最终一致、同步 / 异步 / 后台分离、Policy truth 与 runtime cache 分离、正文引用与治理结论分离、Nonconformity 线索与纠正闭环分离、只读派生消费、幂等 / 顺序保护、traceability / evidence / handoff |
| 当前阶段暂不硬化 | 具体语言栈、具体数据库产品、具体消息产品、具体缓存 / 搜索产品、具体 rule engine / Policy DSL、external GRC 产品、report / BI 产品、完整事件溯源方案、具体 API / event / job 协议、旧 P95 / SLA / 容量数字 |

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| Rust / PostgreSQL / audit store / bus / report system 等旧技术清单 | 技术产品和实现承载未经新版边界重新论证 | 不作为新版正式选型继承 |
| `policy-distributor`、Policy engine、runtime / capability-hub distribution | 容易让分发机制或 cache 反向定义 Policy truth | 改为 Policy effective fact 与下游消费分离机制 |
| ArtifactSync、AIIA / SoA metadata、audit trail | 容易把 artifact / evidence 正文和 observability audit store 并入 Governance | 改为正文引用与治理结论分离、追溯交接机制 |
| external GRC / report system / dashboard | 容易让外部系统和派生消费成为事实源 | 改为导出消费、派生只读和后台承接机制 |
| 旧性能数字 `150ms / 200ms / 50ms / 30s / 99.95%` | 当前缺新版负载模型和验证依据 | 作为候选 SLO 和后续测试输入,不写成本步架构硬选型 |
| API / event / subscription 线索 | 已进入协议和详细设计粒度 | 本步只锁机制,不写接口或事件目录 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 选型主语 | 产品、组件、接口、事件、性能数字混合 | 架构层技术机制 / 架构手段 | Step 10 只锁会影响边界、一致性和交互主链的机制 |
| 外部输入 | 可被 process / work / artifact / runtime / observability / GRC 直接推入治理核心 | 经正式承接边界、引用、快照、safe summary 或事件协作进入 | 保护 Governance truth |
| Policy | 倾向通过 engine / distributor / cache 表达 | Policy effective fact 和 shared rules 属于 Governance truth,下游执行异步消费 | 防止执行层反向定义治理策略 |
| 合规材料 | AIIA / SoA / Control / evidence 与正文容易混写 | 正文引用与治理结论分离 | 防止 artifact / method 正文入仓 |
| 派生消费 | report / dashboard / external GRC 容易成为结论来源 | 只读派生、导出消费和后台维护 | 防止第二 truth |
| 一致性 | 补偿、同步、订阅和重试混写 | 核心强一致,传播 / 派生 / 交接最终一致 | 对齐 Step 8 / Step 9 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接继承旧 PostgreSQL / audit store / Policy engine / report / external GRC 方案 | 看起来实施路径明确 | 过早锁定技术产品和实现细节,且可能让外部系统反向定义治理真相 | 不采用 |
| 方案 B: 按架构机制说明解决的问题、采用理由和代价 | 能承接职责、依赖、数据和通信结论 | 后续概要 / 详细设计还需落到具体实现 | 采用 |
| 方案 C: 当前采用完整事件溯源、规则引擎和外部 GRC 作为强制架构 | 对审计和合规看似完整 | 当前缺必要性证明,并会显著抬高 P0 复杂度 | 不采用 |
| 方案 D: 不写关键技术机制,全部留到详细设计 | 避免过早承诺 | 后续设计缺少机制级红线,容易反复串仓 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否当前锁定具体数据库、消息中间件、缓存、搜索、report 或外部 GRC 产品?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前直接写入具体产品 | 便于实施想象,但会在未完成数据规模、事务边界和运维约束前固化实现 |
| 方案 B | 当前只固定真相承载、事件协作、派生承载和交接机制 | 保持架构层清晰,产品后续收敛 |

推荐方案 B。

#### 是否当前选择具体 Policy DSL / rule engine?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前锁定 DSL / engine | 工具表达会反向定义 Policy truth 和 shared rules |
| 方案 B | 当前只确认 Policy effective fact、shared rules、priority、scope 和 conflict 机制 | 保留后续实现空间,保护治理语义 |

推荐方案 B。

#### 是否把完整事件溯源作为当前必选?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前完整 ES 必选 | 能强化追溯,但会提高复杂度并提前决定持久化模型 |
| 方案 B | 当前只确认 traceability、event collaboration、handoff 和 read model rebuild 机制 | 满足架构边界,具体持久化策略后移 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 通过正式承接边界隔离外部输入与 Governance 核心语义 | 防止相邻仓、运行层、横切系统、产品入口或外部 GRC 直接打穿治理事实。 | Governance 同时面对 process、work、artifact、conversation、identity、method、runtime、capability、observability、archive 等输入;若不隔离会迅速串仓。 | 增加承接层判断、输入状态、拒绝 / pending 口径和测试成本。 | 该机制决定外部能力如何进入核心边界,属于架构层结构性决定。 |
| 通过运行期接缝、引用、快照、safe summary 和事件协作承接非 core sibling 仓 | 防止相邻仓源码和外部 truth 进入 Governance 编译期依赖。 | `L0-core` 是唯一编译期依赖,其它仓只能以 ref、snapshot、summary、event、adapter 或 handoff 协作。 | 增加解析、快照刷新、不可解析状态和适配成本。 | 该机制直接保护跨仓依赖裁剪。 |
| Governance truth / external snapshot / reference / derived separation | 防止正式治理事实、外部正文、外部生命周期、消费视图和维护材料混为一体。 | Step 8 已确认 Governance 只拥有治理决策与治理控制事实,外部能力只能通过快照、引用、摘要或派生结果参与。 | 需要为旧快照、未解析引用、过期视图和派生延迟提供显式状态。 | 该机制同时影响数据归属、一致性和后续对象建模。 |
| 核心强一致 + 外围最终一致 | 防止裁决、Policy、Control、AIIA / SoA、Nonconformity 出现半成立状态,同时避免下游消费阻塞主链。 | 核心治理事实必须同步成立或拒绝;事实传播、报告、对账和归档交接可延迟。 | 需要解释 pending、failed、retryable、stale、rebuilding 和 unavailable 状态。 | 该机制定义治理事实和消费状态如何成立。 |
| 同步 / 异步 / 后台三类路径分离 | 防止外部结果和派生维护阻塞主路径,也防止后台任务隐式推进业务事实。 | Step 9 已确认三类通信方式分别服务即时判断、事实传播 / 结果送达和派生维护。 | 增加状态可见性、延迟解释和运行承载分工。 | 该机制决定关键交互如何承接,属于架构层通信结构。 |
| Policy effective fact 与 runtime cache / policy engine / capability whitelist 分离 | 防止执行层、规则工具或能力注册反向定义 Policy truth。 | Governance 拥有 Policy 生效、scope、priority、conflict、replacement 和 shared rules;runtime / capability 只是消费或反馈。 | Policy 生效与下游 cache 更新可能短暂不一致,需要传播和保守执行口径。 | 该机制保护 Policy 和 automation boundary。 |
| AIIA / SoA / Control / evidence 正文引用与治理结论分离 | 防止 artifact、method-library 或 standard 正文转移到 Governance。 | Governance 需要形成治理评审、适用性、覆盖和批准结论,但正文和定义来源归外部仓。 | 需要维护 evidence / baseline / definition 引用有效性和未闭合状态。 | 该机制保护合规结论与正文来源边界。 |
| Nonconformity 线索输入与治理纠正闭环 truth 分离 | 防止 observability alert、work blocker、bug 或 process failure 直接创建 / 关闭治理不符合。 | 外部线索可作为输入,但不符合、原因、纠正、复验和关闭必须由 Governance 语境收口。 | 需要线索归因、依据不足、待复验和关闭拒绝等状态。 | 该机制保护纠正闭环不退化为告警或任务状态。 |
| 只读派生视图 / report / dashboard / reconciliation 承接消费和维护解释 | 防止 workspace、console、external GRC、report 或 dashboard 直接依赖核心结构或反写真相。 | 下游需要稳定消费、报表、对账和导出,但核心模型不能被展示和聚合需求绑定。 | 增加派生滞后、重建、对账异常和延迟解释成本。 | 该机制影响运行承载、数据所有权和通信方式。 |
| 幂等与顺序保护 | 防止重复裁决请求、重复事件、乱序反馈或重放输入产生重复治理事实或状态回退。 | Governance 需要承接多入口同步请求、事件协作和外部结果送达,这些输入天然可能重复、乱序或延迟。 | 需要稳定业务身份、顺序依据、重复识别依据和冲突口径。 | 该机制保护治理事实唯一性和下游一致消费。 |
| traceability / evidence / handoff 记录机制 | 防止关键治理变化、消费、报告、对账和归档准备不可解释。 | 治理事实必须回答 actor、scope、依据、责任、结论、消费和交接结果。 | 增加追溯材料维护成本,且不能把外部正文顺带存入 Governance。 | 该机制支撑审计、复盘和归档恢复。 |
| 产品 / 语言 / 框架 / 指标硬选型延后 | 防止旧 Draft 技术假设未经论证进入正式架构。 | 当前架构已能确定承载角色和机制,但尚缺产品级输入、负载模型和实施约束。 | 后续仍需在概要 / 详细 / 配置 / 实施阶段补齐产品选择和指标验证。 | 该机制本质是架构治理手段,用于保护真相源闭环。 |

### 7.2 当前不采用口径表

| 不采用口径 | 不采用原因 | 正确落点 |
|---|---|---|
| 具体数据库产品作为当前关键选型 | 产品选择属于实现承载,当前只需锁定真相承载、派生承载和一致性机制。 | 概要设计、详细设计或实施计划 |
| 具体消息中间件、topic、outbox worker 或 consumer group 作为当前选型 | 这是事件协作实现细节,不是本章机制级结论。 | 详细设计、测试方案或实施计划 |
| 具体 Policy DSL / rule engine 作为当前硬选型 | 当前核心是 Policy effective fact、shared rules、scope、priority 和 conflict,不是表达工具。 | Step 11 备选方案或详细设计 |
| runtime cache / capability whitelist 作为 Policy truth | 会让执行层或能力层反向定义治理策略。 | runtime / capability 下游消费和反馈输入边界 |
| artifact / evidence / AIIA / SoA / standard 正文入 Governance | 会把正文所有权从 artifact / method / archive 转移到 Governance。 | 引用、safe summary、治理结论和 artifact / archive 边界 |
| observability audit store 或 alert stream 作为 Governance truth | 会让横切观测系统定义治理事实。 | 观测摘要输入、追溯交接和异常线索 |
| external GRC / report / dashboard 反写 Governance truth | 会让派生或外部系统成为第二 truth。 | 导出消费、只读派生、后台对账 |
| 完整事件溯源作为当前必选 | Governance 需要追溯和事件协作,但不等于必须当前采用完整 ES 持久化模型。 | Step 11 备选方案与取舍 |
| 旧 P95 / SLA / 容量数字作为本步硬选型 | 当前缺新版需求基线下的正式负载模型和验证依据。 | 测试方案、验收标准或容量验证 |
| 除 `L0-core` 之外的编译期仓依赖 | 会破坏 L1 平权真相域和全局依赖裁剪规则。 | 运行期边界、事件协作、SDK 或 adapter |

### 7.3 技术边界说明

本章采用的是机制级技术选型,不是产品清单或实现方案。`L1-governance` 当前最需要被显式固定的是治理事实如何避免被外部来源、执行 cache、正文材料、派生报表和外部 GRC 污染,因此正式承接边界、依赖倒置、数据分层、核心强一致、外围最终一致、同步 / 异步 / 后台分离、Policy truth 分离、正文引用分离、Nonconformity 线索分离、只读派生、幂等顺序和追溯交接都进入架构主线。具体数据库、消息产品、规则引擎、缓存、搜索、report 工具、外部 GRC、协议、P95 和容量数值只有在不反向改变这些机制的前提下,才可以在后续概要 / 详细设计、测试方案和实施计划中继续选择。若后续技术实现与本章机制冲突,应以本章机制为架构真相源。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §11 “关键技术选型”直接摘录并整理本文件 §7.1、§7.2 和 §7.3。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把具体数据库、消息、缓存、搜索、report 或外部 GRC 产品作为当前架构硬选型 | A. 直接锁定;B. 不锁产品,只锁承载角色和机制 | B | 当前缺产品级输入和实施约束,且产品不能反向定义治理真相 | 已确认采用 B |
| 是否当前锁定具体 Policy DSL / rule engine | A. 锁定;B. 不锁,只确认 Policy effective fact 与 shared rules 机制 | B | 规则工具不能反向定义 Policy truth | 已确认采用 B |
| 是否把完整事件溯源作为当前必选 | A. 必选;B. 暂不必选,只确认追溯、事件协作和 handoff 机制 | B | Governance 需要可追溯,但完整 ES 持久化模型需要后续取舍 | 已确认采用 B |
| 是否继承旧 P95 / SLA / 容量数字作为架构硬约束 | A. 继承;B. 不继承,后续由测试 / 验收验证 | B | 当前缺正式负载模型和测量来源 | 已确认采用 B |
| 是否允许除 `L0-core` 外引入编译期仓依赖 | A. 允许;B. 不允许,一律通过运行期 / 事件协作 / adapter / SDK 边界 | B | 对齐 Step 7 和全局依赖裁剪规则 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 11 的待确认事项。具体数据库、消息后端、缓存、搜索、rule engine、Policy DSL、report 工具、external GRC 导出、outbox、consumer、协议、P95、容量数值和代码组织留到后续概要 / 详细设计、测试方案和实施计划继续收敛。

---

## 10. 进入下一步条件

- 已明确当前进入架构主线的关键技术机制。
- 已说明每项机制解决的问题、采用理由、代价 / 约束和架构层意义。
- 已明确当前不采用的相邻技术口径。
- 已明确旧技术假设和旧性能数字不直接继承为架构硬选型。
- 未写技术栈清单、产品横向对比、接口协议、实现机制、部署环境细节或性能硬指标。
- 可以进入 Step 11“备选方案与取舍”。
