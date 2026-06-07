# Step 7. 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 回填章节: `01-架构设计.md` §8 依赖方向与层间约束
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-governance` 内部有哪些正式架构责任层 / 依赖角色,这些角色之间允许怎样依赖,哪些外部能力必须通过正式边界进入,以及跨仓关系应如何从全局依赖基线中裁剪。

本步只讨论依赖方向和层间规则,不重写限界上下文、容器部署、接口协议、数据库细节、代码目录、handler / service / repository 调用链、事件字段、部署产品或技术选型。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_04_system_context.md` | 已完成 | 提供正式上下文对象、输入 / 输出面和降级口径 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑上下文和本地影子层划分 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载和派生承载运行角色 |
| `00_req_step_06_consumers_dependencies.md` | 已完成 | 提供需求层仓际依赖裁剪和禁止依赖关系 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供能力级接口面与外部依赖边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已完成 | 提供全局依赖类型、裁剪表和 ASCII 图格式 |
| 旧 `01-架构设计.md` §7 | 旧 Draft | 作为旧依赖方向、代码层、技术承载混写问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 本仓内部层次如何划分?

本章中的“层次”不是代码目录、crate、模块、服务进程或运行容器,而是架构责任层 / 依赖角色。`L1-governance` 应收敛为五类依赖角色:

- `Governance 核心语义角色`:承载治理语境、Gate / Decision / Approval、Policy effective fact、shared rules、Control applicability、AIIA / SoA governance conclusion、Nonconformity corrective loop 和治理追溯 truth。
- `Governance 编排 / 承接角色`:承接同步变更、查询、异步输入、治理维护、报告、对账和归档准备触发,并把外部输入转换为核心可接受的引用、摘要、正式变化或派生材料。
- `外部能力接缝角色`:承接 identity、method-library、process、work、artifact、conversation、runtime、member-service、capability-hub、observability、archive、SDK、workspace、console 和 bus 等外部能力边界。
- `派生消费辅助角色`:承接治理查询视图、dashboard、report、reconciliation、公开消费摘要和 archive handoff 材料,只能从 Governance truth 派生。
- `技术承载角色`:承载真相存储、派生承载、事件协作、运行支撑和交接支撑,但不拥有治理语义定义权。

### 3.2 允许哪些依赖方向?

允许的依赖方向是外层依赖内层、接缝依赖正式边界、派生依赖核心真相、技术承载服从正式承载契约。核心语义角色只允许依赖 `L0-core` 级共享契约和本仓内部治理规则,不得依赖下游消费方、外部来源仓源码、事件主题、数据库产品、Policy engine、report 系统、GRC 产品、dashboard 或维护报告。

### 3.3 禁止哪些反向依赖?

禁止 process waiting state、work lifecycle、artifact body、conversation display、runtime cache、capability registry、observability audit store、archive package、workspace view、console 操作体验、外部 GRC 或技术设施反向定义 Governance truth。也禁止把 `L1-identity`、`L3-method-library`、`L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L2-member-service`、`L3-capability-hub`、`L4-observability`、`L4-archive`、`L0-bus`、`L0-sdk` 等运行期、事件协作或下游消费关系写成编译期源码依赖。

### 3.4 外部系统通过哪些正式边界接入?

外部能力必须通过 `外部能力接缝角色` 进入,并由 `Governance 编排 / 承接角色` 转换为核心语义可接受的 actor / role 引用、定义来源摘要、process / work 语境摘要、artifact / evidence 引用、runtime / capability feedback 摘要、observability summary、conversation context、正式裁决请求、派生材料或交接材料。

任何外部对象都不能直接写 `Governance 核心语义角色`,也不能绕过核心真相把数据放入 report / dashboard / reconciliation 后再反写真相。

### 3.5 本仓在全局依赖基线中涉及哪些跨仓依赖边?

本仓直接涉及:

- `L0-core`:唯一编译期依赖。
- `L0-bus`:事件协作主干。
- `L1-identity`:actor、member、role 和责任语境来源。
- `L3-method-library`:AIPolicyDef、Control definition、method、template、standard 定义来源。
- `L1-process`、`L1-work`、`L1-artifact`:process / work / evidence 语境输入和治理结论输出协作。
- `L1-conversation`:治理事实显化、review display 和 conversation context 回链协作。
- `L2-runtime`、`L2-member-service`、`L3-capability-hub`:Policy / autonomy / capability 约束消费和运行反馈输入协作。
- `L4-observability`、`L4-archive`:治理追溯、审计材料、观测摘要、归档 / 恢复交接协作。
- `L0-sdk`、`L1-workspace`、`L5-console`:Governance 能力、管理入口和只读消费边界。

`L5` 其他产品和 `L6` 生态项目不进入当前架构主链;它们通常应通过 `L0-sdk` 或正式产品 / 生态边界间接消费。

### 3.6 哪些依赖边进入本仓架构主链,哪些被裁剪出去?

进入主链的依赖边是与治理语境形成、裁决、Policy / Control 生效、AIIA / SoA 结论、Nonconformity 纠正、事实消费、追溯和归档准备相关的跨仓关系。被裁剪出去的是 PostgreSQL、audit store、Policy DSL engine、report system、external GRC suite、object storage、search backend、queue implementation 和部署产品假设;它们可以作为后续技术选型、配置、演进或实施候选,但不进入跨仓依赖裁剪主链。

### 3.7 哪些依赖必须倒置?

身份与责任、定义来源、process / work 语境、artifact / evidence、conversation 显化、runtime / capability feedback、observability summary、archive handoff、event bus、storage、projection、report 和 external GRC 都必须通过正式边界倒置到 `Governance 编排 / 承接角色`、`外部能力接缝角色` 或 `技术承载角色`,不能让这些外部或技术对象直接进入核心语义。

核心语义只声明自己需要的引用、摘要、正式变化、裁决结果、追溯和边界规则,外部适配和技术实现服从这些规则。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 依赖图写 `api -> application -> domain -> infra(Postgres / Bus / Artifact adapter / Runtime distributor)` | 这是代码实现层和技术承载混图,不是架构依赖角色 | 改为核心语义、编排承接、外部接缝、派生辅助、技术承载 |
| `governance-domain` / `GateEventPublisher` / `ArtifactSync` / `PolicyDistributor` | 实现对象和接口点提前进入架构 Step 7 | 本步只保留依赖倒置结论,不写实现接口名 |
| `Policy evaluation / applicable policies` 容易滑向 Policy engine / DSL | 技术机制可能反向定义 Policy truth | 改为 Policy effective fact 和 shared rules 由核心语义定义,engine / cache 后移 |
| `AIIA / SoA metadata` 与 artifact / audit 混写 | 容易让 artifact 正文或 audit store 进入 Governance truth | 改为正文 / 证据 / audit 只通过引用、摘要或交接边界进入 |
| `postgres`、`bus(outbox)`、`runtime / capability distribution` 直接作为依赖节点 | 提前固化技术产品和事件实现 | 改为技术承载角色和外部事件协作边界 |
| 跨仓依赖未严格区分编译期、运行期、事件协作 | 后续实现可能把运行关系写成 package dependency | 按全局依赖裁剪规则输出三张表和裁剪图 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 层次主语 | API / application / domain / infra | 架构责任层 / 依赖角色 | 本章讨论依赖保护,不是代码组织 |
| 核心保护 | Gate、Policy、Control、AIIA / SoA、Nonconformity 和存储 / 事件容易混在一起 | 核心语义只被正式承接角色依赖,派生不得反写 | 防止第二 truth |
| 外部来源 | identity / process / work / artifact / runtime / observability 可被看作直接依赖 | 外部来源只通过引用 / 摘要 / 正式结论边界进入 | 防止来源 truth 漂移 |
| 下游消费 | workspace / console / runtime / capability / archive 可反推核心 | 下游只能经正式边界消费或协作 | 防止消费需求统治治理模型 |
| 技术机制 | Policy engine、PostgreSQL、report system、external GRC 容易成为主依赖 | 技术和外部 GRC 只能作为后续候选或接缝,不能定义核心 | 保持架构边界稳定 |
| 跨仓依赖 | 未区分依赖类型 | `L0-core` 编译期,其他按运行期 / 事件协作 / 下游消费处理 | 防止实现阶段依赖失控 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按代码分层写 api / application / domain / infra | 对开发者熟悉 | 会提前进入概要 / 详细设计,且无法表达跨仓依赖红线 | 不采用 |
| 方案 B: 按核心语义、编排承接、外部接缝、派生辅助、技术承载写依赖角色 | 能保护 Governance truth,并承接 Step 5 / Step 6 结论 | 后续仍需在概要设计映射到代码主体 | 采用 |
| 方案 C: 把所有上下游仓都画成直接依赖 | 看似完整 | 会把运行期和事件协作误写为源码依赖 | 不采用 |
| 方案 D: 只写 `L0-core` 和 `L0-bus`,忽略 identity / process / work / artifact / runtime / observability 等 | 图更简单 | 会遗漏关键反向依赖风险 | 不采用 |
| 方案 E: 把 external GRC / Policy engine 放入当前依赖主链 | 贴近旧合规系统想象 | 会把外围增强或技术机制变成 truth 来源 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 依赖方向图

```text
+====================================================================+
|                    L1-governance 依赖边界                          |
|                                                                    |
|   +---------------------------+       +--------------------------+ |
|   | 外部能力接缝角色          |       | 技术承载角色             | |
|   | external capability seams |       | storage / event support  | |
|   +-------------+-------------+       +-------------+------------+ |
|                 | 边界接入                          | 允许依赖    |
|                 v                                   v             |
|        +--------+-----------------------------------+------+      |
|        | Governance 编排 / 承接角色                        |      |
|        | formal intake / decision / maintain / report      |      |
|        +----------------------+----------------------------+      |
|                               | 允许依赖                          |
|                               v                                   |
|        +----------------------+----------------------------+      |
|        | Governance 核心语义角色                             |      |
|        | decision / policy / control / compliance truth     |      |
|        +----------------------+----------------------------+      |
|                               ^                                   |
|                               | 允许依赖                          |
|        +----------------------+----------------------------+      |
|        | 派生消费辅助角色                                   |      |
|        | view / dashboard / report / reconciliation        |      |
|        +---------------------------------------------------+      |
|                                                                    |
+====================================================================+
```

图示说明:

- 箭头只表示允许依赖或边界接入,不表示运行调用顺序、协议时序、事件传播顺序或代码调用链。
- `Governance 核心语义角色` 是被保护的中心,外部来源、下游消费、技术承载和派生辅助都不能反向定义它。
- `派生消费辅助角色` 可以依赖核心 truth 和授权范围,但不得形成第二 truth。
- `技术承载角色` 只服从正式承载契约,不决定治理语义、状态流转或数据归属。

### 7.2 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| `Governance 核心语义角色` | `L0-core` 共享契约和本仓内部治理规则 | 下游消费方、来源仓正文、外部平台对象、事件主题、数据库产品、Policy engine、report、dashboard、external GRC、维护报告 | 保护治理语境、裁决、Policy、Control、AIIA / SoA、Nonconformity 和追溯 truth 不被外部反向定义。 |
| `Governance 编排 / 承接角色` | 核心语义角色、正式外部接缝、正式承载边界、派生规则 | 绕过核心直接写存储;把外部事实原文变成本仓 truth;把下游展示状态写入核心;把 report / reconciliation 当业务写源 | 承接输入和消费,但必须把外部能力转换为核心允许的引用、摘要、正式变化或维护材料。 |
| `外部能力接缝角色` | 正式边界、编排 / 承接角色、必要的运行期协作对象 | 直接依赖核心存储结构;直接改变核心语义;越过授权范围输出事实;把运行期依赖写成源码依赖 | 外部能力只能通过受控接缝进入或消费,不能打穿核心。 |
| `派生消费辅助角色` | 核心语义角色、授权范围、正式派生规则和交接边界 | 生成新治理事实;覆盖核心事实;绕过可见性或追溯规则向下游输出;把 report / dashboard 反写核心 | 查询视图、dashboard、报告、对账和归档准备都只是消费辅助,可重建且不得反写。 |
| `技术承载角色` | 核心定义的正式状态、派生规则和承载契约 | 决定业务状态、裁决语义、Policy 生效、Control 适用、合规结论或纠正闭环含义 | 存储、事件、索引、缓存、任务调度等技术选择只能支撑架构,不能定义架构。 |

### 7.3 依赖倒置结论

| 需要倒置的依赖 | 倒置方式 | 保护目标 |
|---|---|---|
| `L1-identity` actor / member / role 来源 | 核心只保存 actor / member / role 引用、责任语境或可承担性摘要,解析与同步经正式接缝进入 | 防止身份生命周期和认证授权 truth 进入 Governance |
| `L3-method-library` 定义来源 | 核心只保存 AIPolicyDef、Control definition、method、template、standard 的引用、版本或 safe summary | 防止方法 / 控制 / 标准定义正文转移给 Governance |
| `L1-process` process waiting / Activity 语境 | process waiting、Activity、恢复语境只作为治理适用对象或裁决回链引用进入 | 防止 process execution truth 变成 Governance truth |
| `L1-work` project / work / iteration 语境 | project、work、iteration、dependency、blocker 只作为适用对象引用、摘要或风险语境进入 | 防止 work lifecycle 反向定义治理裁决 |
| `L1-artifact` evidence / AIIA / SoA 正文来源 | artifact、evidence、baseline、AIIA / SoA 正文只以引用或摘要进入 | 防止 artifact body 和合规正文被复制到 Governance |
| `L1-conversation` 显化与上下文 | conversation context、Gate 显化、review display 只作为回链或消费边界 | 防止对话展示状态定义治理事实 |
| `L2-runtime` / `L2-member-service` 执行反馈 | runtime execution、policy cache feedback、autonomy 边界和执行风险只以摘要 / marker 进入 | 防止执行 truth 或 cache 替代 Policy truth |
| `L3-capability-hub` 能力反馈 | capability、tool、provider 使用线索只以治理输入摘要进入 | 防止 capability registry 或工具结果进入治理核心 |
| `L4-observability` 观测与审计 | alert、audit summary、trace summary 只作为复核线索或追溯交接引用 | 防止 audit store / metric body 变成 Governance truth |
| `L4-archive` 归档 / 恢复交接 | archive handoff 只接收治理事实、合规材料和引用来源 | 防止 archive package body 反向定义治理事实 |
| `L0-bus` 事件协作 | 事件协作通过正式发布 / 消费边界承接 | 防止 event topic / relay 机制定义核心语义 |
| 存储 / 投影 / 缓存 / report / GRC | 作为技术承载、消费交接或外围增强实现,服从核心定义 | 防止技术产品、派生结果或外部系统成为 truth source |

### 7.4 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-governance` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线是治理事实跨仓表达前置。 |
| `L0-bus` | `L1-governance` 通过 `L0-bus` 发布 Gate / Policy 事件 | 协作方 | 事件协作 | 是 | 治理事实变化需要跨仓发布 / 消费能力级变化,但 bus 不写成业务源码依赖。 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1+ API | 被依赖方 | 运行期 | 是 | SDK 是产品和外部调用方默认接入 governance 能力的边界,不能反向定义 Governance 核心。 |
| `L1-identity` | Governance 运行期消费 actor / member / role 语境 | 依赖方 | 运行期 / 事件协作 | 是 | 裁决责任、授权和审计 actor 需要 identity 边界,但不接管成员生命周期。 |
| `L3-method-library` | Governance 消费 AIPolicyDef / Control definition / method / standard 定义来源 | 依赖方 | 运行期 | 是 | Policy / Control 需要定义来源,但定义正文不归 Governance。 |
| `L1-process` | 全局基线中 governance 按需消费 process 边界;process 消费 governance decision | 协作方 | 运行期 / 事件协作 | 是 | Gate 与 waiting / resume / Activity 语境协作,但 process truth 不归 Governance。 |
| `L1-work` | Work 消费 governance 能力边界;Governance 引用工作对象语境 | 协作方 | 运行期 / 事件协作 | 是 | 项目和工作高风险变更需要治理约束,Work truth 不归 Governance。 |
| `L1-artifact` | Governance 按需消费 artifact evidence boundary;artifact 按需消费 governance 引用 | 协作方 | 运行期 / 事件协作 | 是 | AIIA / SoA / evidence 正文归 artifact,治理结论归 Governance。 |
| `L1-conversation` | conversation 按需消费 governance 能力边界,Governance 保留 conversation context 回链 | 协作方 | 运行期 / 事件协作 | 是 | Gate / Policy / review 等治理事实需要显化和追溯,conversation truth 不归 Governance。 |
| `L2-runtime` | runtime 消费 Policy / autonomy 约束并提供执行反馈 | 协作方 | 运行期 / 事件协作 | 是 | runtime cache / execution truth 不能替代 Policy truth,但反馈可作为治理输入。 |
| `L2-member-service` | member-service 订阅身份、项目成员和 policy 事件 | 被依赖方 | 事件协作 | 是 | 成员容器编排需要 Policy / governance 变化输入。 |
| `L3-capability-hub` | capability-hub 消费能力治理约束并提供能力反馈 | 协作方 | 运行期 / 事件协作 | 是 | 能力注册和工具结果不归 Governance,但可作为 Policy / Control 输入线索。 |
| `L4-observability` | observability 消费 audit / trace / metrics material,并提供 alert / audit summary | 协作方 | 事件协作 / 追溯交接 | 是 | Governance 需要观测线索和审计交接,但不拥有 audit store。 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力,并承接归档相关事件 | 被依赖方 | 运行期 / 事件协作 / 追溯交接 | 是 | 治理事实、合规材料和引用来源需要归档 / 恢复交接。 |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影 | 被依赖方 | 运行期 / 事件协作 | 是 | 工作台需要 Governance 只读事实和视图来源,但 workspace 不反写真相。 |
| `L5-console` | console 经 SDK / 管理 API 消费 L1+ 管理能力 | 被依赖方 | 运行期 | 是 | Governance 管理入口需要 console 显化,但 console 操作体验不能定义核心。 |
| `L5-chat` / 其他 L5 产品 | 产品经 SDK 消费 conversation / workspace / governance | 被依赖方 | 运行期 | 否 | 当前治理架构主链不逐个展开产品仓,应经 SDK 或正式边界消费。 |
| `L6` 生态入口 | 生态经 SDK / public APIs 消费能力 | 被依赖方 | 运行期 / 事件协作 | 否 | 当前 Governance 架构主链不直接依赖生态仓。 |
| PostgreSQL / audit store / Policy engine / external GRC / report system | 旧文档实现候选或外围增强 | 非正式外部依赖 | 运行期 | 否 | 属于后续技术选型、配置、演进或实施选择,不进入跨仓依赖主链。 |

### 7.5 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线 | 详细设计 / 实施计划 |
| 事件协作 / 追溯交接依赖 | `L0-bus`、`L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L2-member-service`、`L3-capability-hub`、`L4-observability`、`L4-archive`、`L1-workspace` | 通过事件协作传播或消费 Gate / Decision、Policy、Control、AIIA / SoA、Nonconformity、反馈、trace / audit 和 archive handoff 材料 | 架构设计 / 测试方案 / 验收标准 |
| 运行期依赖 | `L1-identity`、`L3-method-library`、`L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L3-capability-hub`、`L4-archive` | 运行时消费身份、定义、过程、工作、证据、上下文、运行反馈、能力反馈和归档交接边界 | 架构设计 / 详细设计 |
| 下游消费 / 运行期提供 | `L0-sdk`、`L1-conversation`、`L1-workspace`、`L5-console`、`L4-observability`、`L4-archive` | 向 SDK、对话显化、workspace、console、观测审计和归档恢复提供治理事实能力、快照来源或交接材料 | 架构设计 / 实施计划 |

`L4-observability` 的双角色必须显式区分:alert / audit summary 是治理输入线索,trace / audit material 是治理输出交接;两者都不意味着 Governance 拥有物理观测存储。`L4-archive` 的双角色也必须区分:snapshot / export 读取是下游消费 / 运行期提供,handoff / 回链是事件协作 / 追溯交接。

### 7.6 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-governance -> L1-identity` 编译期依赖 | 会把成员生命周期和认证授权 truth 耦合进 Governance | 使用 `L0-core` 共享 actor / member / role ref 和运行期 / 事件协作边界 |
| `L1-governance -> L3-method-library` 编译期依赖 | 会把方法定义、AIPolicyDef、Control definition 和标准正文并入 Governance | 通过定义引用、safe summary、snapshot 或运行期 resolver 消费 |
| `L1-governance -> L1-process` 编译期依赖 | 会把 process waiting state 和 Governance decision truth 耦合 | 使用 ProcessRef、safe summary、事件或运行期能力边界 |
| `L1-governance -> L1-work` 编译期依赖 | 会把 Project / WorkItem / Iteration truth 引入治理仓 | 使用 WorkRef、ProjectRef、safe summary、事件或运行期能力边界 |
| `L1-governance -> L1-artifact` 编译期依赖 | 会把 artifact body / evidence body / version truth 引入治理仓 | 使用 artifact / evidence 引用和运行期 / 事件协作 |
| `L1-governance -> L1-conversation` 编译期依赖 | 会让显化和对话可见性反向定义治理事实 | Conversation 运行期 / 事件协作消费 Governance facts |
| `L1-governance -> L2-runtime` / `L2-member-service` 编译期依赖 | 会让 L1 反向依赖运行层,并把 execution truth 混入 Governance truth | runtime / member-service 消费 Governance Policy,必要反馈经正式边界输入 |
| `L1-governance -> L3-capability-hub` 编译期依赖 | 会把能力注册和工具适配 truth 混入 Policy truth | 使用能力引用、Policy 适用结论和正式协作边界 |
| `L1-governance -> L4-observability` / `L4-archive` 编译期依赖 | 会把横切观测、审计物理存储或归档包实现引入业务真相仓 | trace / audit / archive handoff、snapshot / export 边界 |
| `L1-governance -> L0-bus` 编译期依赖到业务实现 | Bus 是事件协作主干,但不应成为 Governance 业务核心实现依赖 | 通过正式事件协作边界接入 |
| `L1-governance -> Policy engine / external GRC / report system` 作为核心语义依赖 | 会让技术机制或外部系统定义 Policy truth、裁决和合规结论 | 作为后续技术选型、外围增强或导出消费边界,不得定义核心 |
| `L5/L6` 产品或生态仓绕过 `L0-sdk` 直接绑定 `L1-governance` 源码 | 会破坏 SDK 统一接入层和依赖裁剪规则 | 经 SDK 或正式 API / public boundary 消费 |
| 派生视图 / dashboard / report / reconciliation -> Governance truth 反写 | 派生结构可延迟和重建,不能成为第二 truth | 从核心 truth 派生,必要时重建派生结果 |
| 存储 / 缓存 / 投影产品 -> 核心语义 | 技术产品不能定义业务状态、裁决范围、Policy 生效或合规结论含义 | 技术承载服从核心规则和正式承载契约 |

### 7.7 依赖裁剪图

#### 依赖裁剪图: L1-governance

```text
Global baseline
  |
  | crop only L1-governance related edges
  v
                         +----------------+
                         | L1-identity    |
                         +--------+-------+
                                  | [runtime/event]
                                  v
+-----------+ [compile]   +-------+--------+   [runtime] +-------------------+
| L0-core   +------------>| L1-governance  |<------------+ L3-method-library |
+-----------+             +-------+--------+             +-------------------+
                                  ^
                                  | [event]
                              +---+----+
                              | L0-bus |
                              +---+----+
                                  |
        +-------------------------+-------------------------+
        | [runtime/event/handoff] collaboration and consumers|
        v                                                   v
 process / work / artifact / conversation / runtime / capability
 member-service / workspace / console / archive / observability / SDK
```

图示说明:

- 本图只展示 `L1-governance` 相关依赖,不展示全 27 仓。
- `[compile]` 只有 `L0-core`,可进入后续 Cargo / package dependency 讨论。
- `[runtime]`、`[event]` 和 `[handoff]` 不得写成 package dependency,只能进入正式边界、adapter、event、projection、report 或 handoff 讨论。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或事件传播顺序。

### 7.8 依赖边界说明

`L1-governance` 的依赖方向以保护治理决策与治理控制 truth 为中心:外部来源可以提供引用、摘要、定义、语境、反馈或证据线索,下游可以消费授权治理事实,技术承载可以支撑存储和派生,但它们都不能反向定义核心语义。`L0-core` 是唯一可进入编译期的共享契约基线,其余跨仓关系必须按运行期、事件协作、追溯交接或下游消费处理。这个边界让后续概要设计可以继续展开代码主体骨架,但不会把 identity 生命周期、process waiting state、work lifecycle、artifact body、runtime cache、capability registry、conversation display、observability store、archive package、external GRC 或技术产品提前写进 Governance 核心。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §8 “依赖方向与层间约束”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4、§7.5、§7.6、§7.7 和 §7.8。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 核心语义能否直接依赖 identity / process / work / artifact / method-library 等仓源码 | A. 可以;B. 不可以,只能接收经边界转换后的 ref / summary / snapshot / result | B | 保护唯一编译期依赖和相邻 truth 边界 | 已确认采用 B |
| 是否把 Policy engine / external GRC 放入当前依赖主链 | A. 放入;B. 不放入,仅作为后续技术或外围增强候选 | B | 当前核心是 Policy effective fact、Control 和治理结论,不是 engine / GRC 产品 | 已确认采用 B |
| 派生 report / dashboard / reconciliation 是否可以反写 Governance truth | A. 可以;B. 不可以,只能从 truth 派生 | B | 防止派生面成为第二治理事实 | 已确认采用 B |
| `L0-bus` 是否作为编译期依赖进入业务核心 | A. 是;B. 否,只作为事件协作依赖 | B | 对齐全局依赖裁剪规则,避免 event infra 定义核心语义 | 已确认采用 B |
| `L4-observability` / `L4-archive` 是否拥有 Governance 追溯 truth | A. 拥有;B. 不拥有,只消费或承接交接材料 | B | Governance 拥有治理追溯事实;L4 负责横切存储 / 归档能力 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本 Step 没有需要阻塞下一步的未确认事项。

---

## 10. 进入下一步条件

```text
已明确 L1-governance 的内部架构责任层 / 依赖角色。
已明确允许依赖方向、禁止反向依赖和必要倒置边界。
已从全局依赖基线裁剪出 L1-governance 相关跨仓依赖边。
已明确 L0-core 是唯一编译期依赖;运行期、事件协作、追溯交接和下游消费不得写成 package dependency。
已明确派生视图、dashboard、report、reconciliation、Policy engine、external GRC、observability、archive 和技术承载不得定义 Governance truth。
可以进入 Step 8 数据所有权与一致性策略。
```
