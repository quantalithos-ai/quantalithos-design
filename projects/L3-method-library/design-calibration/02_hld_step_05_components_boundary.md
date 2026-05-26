# Step 5. 主要组成部分、职责与边界

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L3-method-library/02-概要设计.md` §5 主要组成部分、职责与边界

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 4 代码主体框架 | 已确认 7 个业务主要组成部分候选,并将入口、端口、持久化、adapter 归为实现分层或支撑主体 |
| Step 4 实现分层视图 | Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters |
| Step 3 约束条件 | Definition / Use 分离、P0 / P1 分离、published 不可原地修改、event + snapshot、ViewProfile 服务端解析 |
| 架构设计职责边界 | method-library 只拥有定义真相、版本、fingerprint、audit、outbox、snapshot 和 P1 组合真相 |
| 当前 02 §6 | 已有 A-H 组成部分,但 A / H 更适合作为实现分层,不是业务主要组成部分 |

已确认结论：

```text
Step 5 按业务职责主线展开,不按对象、用户故事、功能需求、代码目录或技术分层展开。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认设计目标和范围。
Step 3 已确认结构性约束。
Step 4 已确认代码主体框架和实现分层关系。
```

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面，本仓应被划分为哪些主要组成部分？

回答：

本仓应划分为 7 个业务主要组成部分。

| 编号 | 主要组成部分 | 判断理由 |
|---|---|---|
| 1 | 方法定义生命周期与发布治理 | 负责把草稿、审核、发布、废弃、退役、supersede、gate、audit、outbox 串成一致主链 |
| 2 | 方法定义真相与规则 | 负责承载 P0 7 类 MethodContent 的定义真相和领域规则 |
| 3 | 关系校验与边界保护 | 负责防止引用错误和 Definition / Use 边界污染 |
| 4 | 定义同步与快照供给 | 负责通过 outbox、event、snapshot、replay / resync 把定义变化稳定供给下游 |
| 5 | 查询解析与审计追溯 | 负责只读查询、ResolveViewProfile、版本 / fingerprint / audit trace |
| 6 | 基线初始化与恢复运维 | 负责 seed、replay、rebuild、fingerprint 复算等可审计恢复入口 |
| 7 | P1 资产打包与配置组装 | 负责 MethodPlugin / MethodConfiguration 的后置打包、组装和分发边界 |

不作为主要组成部分：

```text
Inbound / Operations
Application Services
Domain Model / Policies
Ports
Persistence / Projection / Outbound Adapters
Command API
Query API
Repository
UnitOfWork
PostgreSQL adapter
L0-bus adapter
Object storage adapter
```

这些名称是实现分层或支撑主体,不回答业务职责主线。

### 3.2 每个主要组成部分分别承担什么职责？

回答：

| 组成部分 | 承担职责 |
|---|---|
| 方法定义生命周期与发布治理 | 编排 MethodContent 从 draft 到 in_review、published、deprecated、retired、superseded 的生命周期;接入 gate;编排 version、fingerprint、audit、outbox |
| 方法定义真相与规则 | 拥有 7 类 P0 MethodContent 定义真相;维护定义元信息、内容结构、生命周期规则和 definition 引用锚点 |
| 关系校验与边界保护 | 校验 definition 间引用;保护 Qualification / Profile / Binding、Template / Instance、Definition / Use 等边界 |
| 定义同步与快照供给 | 写入 outbox event;通过 L0-bus 发布定义变化;提供 Definition Snapshot;支持 replay / resync / cold start |
| 查询解析与审计追溯 | 提供内容、版本、生命周期、fingerprint、audit trace 查询;提供 ResolveViewProfile;提供追溯视图 |
| 基线初始化与恢复运维 | 提供最小方法资产 seed;重放事件;重建查询投影;复算 fingerprint;不绕过主链规则 |
| P1 资产打包与配置组装 | 管理 MethodPlugin、MethodConfiguration、effective_content_set、package metadata,但不阻塞 P0 |

### 3.3 每个主要组成部分明确不承担什么职责？

回答：

| 组成部分 | 明确不承担 |
|---|---|
| 方法定义生命周期与发布治理 | 不拥有定义正文真相;不替下游确认消费成功;不执行 governance enforce result |
| 方法定义真相与规则 | 不保存 QualificationProfile、QualificationBinding、ProcessInstance、WorkItem、Artifact instance、policy enforce result |
| 关系校验与边界保护 | 不决定下游如何执行流程、分配任务、绑定工具、渲染 UI 或做访问裁决 |
| 定义同步与快照供给 | 不保存下游本地索引真相;不要求跨仓强事务;不把大正文塞进事件载荷 |
| 查询解析与审计追溯 | 不修改 MethodContent;不绕过发布治理暴露运行态应使用的未发布定义;不承担 UI 最终渲染 |
| 基线初始化与恢复运维 | 不作为人工绕过发布链的后门;不直接改数据库表;不改变 definition 正文语义 |
| P1 资产打包与配置组装 | 不属于 P0 首批闭环;不拥有 marketplace listing / transaction / install record;不替代 MethodContent 定义真相 |

### 3.4 每个主要组成部分包含哪些代码主体 / 模块？

回答：

各部分包含的代码主体在本步只列到“类型、作用、后续展开位置”。

| 组成部分 | 主要代码主体 |
|---|---|
| 方法定义生命周期与发布治理 | MethodContentCommandService、PublishGovernanceService、MethodContentLifecycle、PublishPolicy |
| 方法定义真相与规则 | MethodContent、Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef、DefinitionReference |
| 关系校验与边界保护 | ReferenceValidationPolicy、DefinitionUseBoundaryGuard、BoundaryViolation、FingerprintPolicy、ViewProfileMatchPolicy |
| 定义同步与快照供给 | DefinitionSyncService、SnapshotExportService、OutboxEvent、OutboxRelayWorker、DefinitionSnapshot |
| 查询解析与审计追溯 | Query API、ViewProfileResolveService、DefinitionTraceQueryService、DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection |
| 基线初始化与恢复运维 | Operations Trigger、MethodOperationsService、SeedInitialMethodAssetsJob、ReplayDefinitionEventsJob、RebuildDefinitionIndexJob、RecalculateFingerprintJob |
| P1 资产打包与配置组装 | MethodPluginService、MethodConfigurationService、PluginCompositionPolicy、MethodPlugin、MethodConfiguration |

### 3.5 这些代码主体 / 模块在本部分中只需要说明到什么粒度？

回答：

本步只说明：

```text
代码主体 / 模块名称
类型
一句话作用
后续展开位置
```

本步不说明：

```text
字段
成员函数
工厂函数
完整接口签名
协议 schema
数据库表
函数调用链
错误码
```

这些内容分别留给 Step 6、Step 7、Step 8、Step 9 和详细设计。

### 3.6 哪些内容虽然相关，但必须由相邻部分或边界外能力承担？

回答：

| 相关内容 | 正确承担方 | method-library 的边界 |
|---|---|---|
| 成员 QualificationProfile | identity | 只提供 Qualification 定义 |
| QualificationBinding / 工具接入绑定 | capability-hub | 只提供 Qualification 定义锚点 |
| ProcessInstance / Activity runtime | process | 只提供 ProcessTemplateDef / TaskDefinition 定义 |
| WorkItem / Backlog / Iteration | work | TaskDefinition 是否直接供 work 消费仍为 P1 / 待确认 |
| Artifact instance / evidence | artifact | 只提供 WorkProductDefinition |
| policy enforce result | governance | 只提供 AIPolicyDef source |
| UI session / rendering state | UI / console | 只提供 ViewProfile / ResolveViewProfile |
| listing / transaction / install record | marketplace | P1 只提供 package metadata |
| PostgreSQL / L0-bus / object storage 具体实现 | Persistence / Outbound Adapters / 详细设计 | 在本步只作为支撑主体出现,不作为业务组成部分 |

### 3.7 哪些职责如果不写清，后续最容易让概要设计滑进实现层或让不同部分串线？

回答：

| 易串线职责 | 风险 | 本步处理 |
|---|---|---|
| 入口接收 vs 生命周期编排 | 把 Command API 写成业务治理主体 | Command API 只作为入口代码主体,治理由 MethodContentCommandService / PublishGovernanceService 承担 |
| 定义真相 vs 发布治理 | 把 MethodContent 自身写成所有流程编排者 | MethodContent 承载定义与不变量,发布编排由应用服务承担 |
| 同步事件 vs 下游索引 | 把下游同步成功当成本仓强一致责任 | 本仓只保证 outbox、event、snapshot、replay;下游索引归下游 |
| ViewProfile 定义 vs UI 渲染 | 把 UI 状态写入 ViewProfile | 本仓只解析策略,不保存前端会话状态 |
| P1 打包组装 vs P0 定义发布 | 让 Plugin / Configuration 反向拖慢 P0 | P1 单独成部分,不阻塞 P0 |
| Repository / Adapter vs 业务部分 | 把技术接缝写成主要组成部分 | 端口和适配器只作为代码主体 / 实现分层 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §6.2 总体分层图 | 旧 A-H 将入口、应用、领域、同步、查询、P1、基础设施混成同一层 | 不符合“主要组成部分是业务结构主语”的最新规范 |
| §6.3 A 对外入口与访问部分 | 描述有效,但它是 Inbound / Operations 实现层 | 应保留为代码主体,不应作为业务主要组成部分 |
| §6.3 H 基础设施适配部分 | 描述有效,但它是 Persistence / Outbound Adapters 实现层 | 应保留为支撑主体,不应作为业务主要组成部分 |
| §6.4 汇总表 | A-H 表中 H 被列为“主要组成部分” | 会让后续 Step 6 / 7 / 8 按技术层展开 |
| §6.8 对象归属说明 | 很多对象归属仍按旧 A-H | 需要改成按 7 个业务主线 + 实现支撑主体归属 |
| §7 外部交互 | 外部交互可用,但引用 A-H 主体 | 后续回填时需要改成新 7 部分或实现分层名 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 主要组成部分数量 | A-H 8 个部分 | 7 个业务主要组成部分 | 移除作为业务部分的入口层和基础设施层 |
| 组成部分拆分依据 | 混合业务职责、实现层和技术适配 | 按业务职责主线、数据真相、主流程位置、变化原因拆分 | 符合最新概要设计规范 |
| A 对外入口 | 主要组成部分 | Inbound / Operations 下的代码主体 | 入口回答“请求如何进入”,不回答业务职责主线 |
| H 基础设施适配 | 主要组成部分 | Ports / Persistence / Projection / Outbound Adapters 下的代码主体 | 技术适配回答“如何承载”,不回答业务职责主线 |
| 对象展开 | 旧文中已开始对象归属和概念解释 | Step 5 只列代码主体和后续位置,对象细节留 Step 6 | 防止第 5 章吞掉第 6 章 |
| 外部交互 | 按 A-H 承接 | 按新 7 部分 + 实现分层承接 | 与 Step 4 的代码主体框架一致 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 沿用旧 A-H | 迁移成本最低,已有文本较多 | 入口层和基础设施层混入业务主要组成部分 | 不采用 |
| 按 7 类 MethodContent 拆成 7 个主要组成部分 | 看起来直观 | 会变成对象列表,无法表达发布、同步、查询、边界保护等横切职责 | 不采用 |
| 按用户故事 / 功能需求拆分 | 容易追溯需求 | 会把需求文档结构复制到概要设计,缺少可实现结构主线 | 不采用 |
| 按 7 个业务职责主线拆分,实现分层作为承载轴 | 职责边界清晰,能支撑对象、接口、处理流继续展开 | 需要重排旧 §6 / §7 / §8 的部分内容 | 采用 |

---

## 7. 结构化中间产物

### 7.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 方法定义生命周期与发布治理 | 编排草稿、审核、发布、废弃、退役、supersede、gate、version、fingerprint、audit、outbox | MethodContentCommandService、PublishGovernanceService、MethodContentLifecycle、PublishPolicy | 不拥有定义正文真相;不确认下游消费成功;不执行 policy enforce |
| 方法定义真相与规则 | 拥有 7 类 P0 MethodContent 定义真相和领域规则 | MethodContent、Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef、DefinitionReference | 不保存下游 Use truth 或运行实例真相 |
| 关系校验与边界保护 | 校验 definition 引用并保护 Definition / Use 边界 | ReferenceValidationPolicy、DefinitionUseBoundaryGuard、BoundaryViolation、FingerprintPolicy、ViewProfileMatchPolicy | 不决定下游如何执行、绑定、渲染或裁决 |
| 定义同步与快照供给 | 输出 event、snapshot、replay、resync,支撑下游最终一致 | DefinitionSyncService、SnapshotExportService、OutboxEvent、OutboxRelayWorker、DefinitionSnapshot | 不保存下游索引真相;不做跨仓强事务 |
| 查询解析与审计追溯 | 提供查询、ResolveViewProfile、trace、read model / projection | Query API、ViewProfileResolveService、DefinitionTraceQueryService、DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection | 不修改 MethodContent;不做 UI 渲染;不绕过发布治理 |
| 基线初始化与恢复运维 | 提供 seed、replay、rebuild、fingerprint 复算等运维恢复入口 | Operations Trigger、MethodOperationsService、SeedInitialMethodAssetsJob、ReplayDefinitionEventsJob、RebuildDefinitionIndexJob、RecalculateFingerprintJob | 不绕过 application / domain 规则;不直接改数据库 |
| P1 资产打包与配置组装 | 后置管理 MethodPlugin、MethodConfiguration、effective_content_set 和 package metadata | MethodPluginService、MethodConfigurationService、PluginCompositionPolicy、MethodPlugin、MethodConfiguration | 不阻塞 P0;不拥有 marketplace 交易和安装真相 |

### 7.2 各部分交互总图

```text
外部 Command / Query / Job
        |
        v
[1] 方法定义生命周期与发布治理
        |
        | uses definition + policies
        v
[2] 方法定义真相与规则
        |
        | validate references / guard boundary
        v
[3] 关系校验与边界保护
        |
        | publish result / snapshot source
        v
[4] 定义同步与快照供给 ----------------------+
        |                                      |
        | event / snapshot                     | trace source
        v                                      v
下游 Definition Consumers              [5] 查询解析与审计追溯
 identity / process / capability-hub          ^
 artifact / governance / UI                   |
                                              | read / resolve
                                              |
运维触发                                      |
        |                                      |
        v                                      |
[6] 基线初始化与恢复运维 ----------------------+
        |
        | P1 package/config uses published definitions
        v
[7] P1 资产打包与配置组装
        |
        v
marketplace / console(P1)
```

关键说明：

- 该图表达 7 个业务主要组成部分之间的大体协作关系,不表达协议字段、函数调用链或详细时序。
- 外部入口、repository、outbox store、adapter 等实现支撑不作为图中的业务主要组成部分。
- `[4]` 和 `[5]` 都读取已发布定义,但 `[4]` 面向下游同步恢复,`[5]` 面向查询解析和审计追溯。
- `[6]` 运维恢复必须回到 application / domain 主链,不能作为绕过规则的后门。
- `[7]` 是 P1 后置能力,只消费或组合已发布定义,不反向改变 P0 定义真相。

### 7.3 方法定义生命周期与发布治理

#### 7.3.1 本部分职责

- 编排 MethodContent 的 draft / in_review / published / deprecated / retired / superseded 状态变化
- 接入 approved gate 结果
- 编排 version、fingerprint、audit record、outbox event
- 保证发布主链的一致性边界

#### 7.3.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodContentCommandService | application service | 编排草稿、审核、发布、废弃、退役、supersede 写用例 | §6 / §7 / §8 |
| PublishGovernanceService | application service | 编排 approved_gate_ref、actor_ref、发布审计和发布前校验 | §6 / §8 |
| MethodContentLifecycle | domain value object / state model | 表达 MethodContent 生命周期状态和可转换规则 | §6 / §9 |
| PublishPolicy | domain policy | 约束发布门禁、published 不可原地修改、supersede | §6 / §8 / §9 |

#### 7.3.3 本部分不承担什么

- 不拥有 MethodContent 正文真相
- 不替下游确认消费成功
- 不执行 governance runtime enforce result
- 不直接定义数据库表和事务实现

#### 7.3.4 与其他部分的接缝

| 接缝 | 对接部分 | 说明 |
|---|---|---|
| 读取 / 修改定义 | 方法定义真相与规则 | 通过领域对象和 repository port 修改定义状态 |
| 发布前校验 | 关系校验与边界保护 | 发布前调用引用校验和边界保护策略 |
| 发布后传播 | 定义同步与快照供给 | 发布成功后写 outbox 并提供 snapshot source |
| 审计查询 | 查询解析与审计追溯 | 审计记录后续由 trace 查询读取 |

### 7.4 方法定义真相与规则

#### 7.4.1 本部分职责

- 拥有 P0 7 类 MethodContent 定义真相
- 维护定义资产的核心元信息、内容结构、生命周期规则和引用锚点
- 为 version、fingerprint、snapshot、downstream index 提供稳定定义来源

#### 7.4.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodContent | domain aggregate | P0 定义资产共同聚合轮廓 | §6 / §9 |
| Qualification | domain aggregate subtype | 胜任力 / 资质定义真相 | §6 |
| RoleDefinition | domain aggregate subtype | 角色定义真相 | §6 |
| TaskDefinition | domain aggregate subtype | 任务定义真相,供 process P0 消费 | §6 |
| WorkProductDefinition | domain aggregate subtype | 制品定义真相,供 artifact 消费 | §6 |
| ProcessTemplateDef | domain aggregate subtype | 流程模板定义真相,供 process 消费 | §6 |
| ViewProfile | domain aggregate subtype | 视图策略定义真相 | §6 / §9 |
| AIPolicyDef | domain aggregate subtype | AI Policy source 定义真相 | §6 |
| DefinitionReference | value object | 表达 definition 之间的引用锚点 | §6 |

#### 7.4.3 本部分不承担什么

- 不保存 QualificationProfile、QualificationBinding、CapabilityAccessDecision
- 不保存 ProcessInstance、WorkItem、Backlog、Iteration
- 不保存 Artifact instance、evidence instance、policy enforce result
- 不按 7 类对象拆成 7 个主要组成部分

#### 7.4.4 与其他部分的接缝

| 接缝 | 对接部分 | 说明 |
|---|---|---|
| 生命周期变更 | 方法定义生命周期与发布治理 | 由发布治理编排状态变化 |
| 引用校验 | 关系校验与边界保护 | 提供 definition 引用关系供校验 |
| 快照导出 | 定义同步与快照供给 | 提供 snapshot source |
| 读取解析 | 查询解析与审计追溯 | 提供只读定义来源 |
| P1 组合 | P1 资产打包与配置组装 | P1 只引用已发布定义 |

### 7.5 关系校验与边界保护

#### 7.5.1 本部分职责

- 校验 RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef 等 definition 间引用
- 保护 Qualification / QualificationProfile / QualificationBinding 三仓边界
- 阻止下游通过 API、同步或恢复入口反向改写定义真相
- 保护 ViewProfile 唯一 active 和默认 deny 等关键边界

#### 7.5.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| ReferenceValidationPolicy | domain policy | 校验 definition 间引用是否合法 | §6 / §8 |
| DefinitionUseBoundaryGuard | domain policy | 阻止下游 Use truth 写入本仓 | §6 / §10 |
| BoundaryViolation | domain error / event candidate | 表达边界违例的概要主语 | §6 / §10 |
| FingerprintPolicy | domain policy | 约束 canonical fingerprint 的生成和对比 | §6 / §8 |
| ViewProfileMatchPolicy | domain policy | 约束 ViewProfile 匹配、唯一 active 和默认 deny | §6 / §8 / §9 |

#### 7.5.3 本部分不承担什么

- 不决定 process 如何执行 Activity
- 不决定 work 如何拆分 WorkItem
- 不决定 capability-hub 如何绑定工具或 provider
- 不决定 UI 如何渲染页面
- 不保存下游本地索引、运行实例或访问裁决

#### 7.5.4 与其他部分的接缝

| 接缝 | 对接部分 | 说明 |
|---|---|---|
| 发布前校验 | 方法定义生命周期与发布治理 | publish / supersede / retire 前调用校验 |
| 定义读取 | 方法定义真相与规则 | 读取 definition 引用和 lifecycle |
| 同步前保护 | 定义同步与快照供给 | 确保输出给下游的是合法定义 |
| 查询边界 | 查询解析与审计追溯 | 保护 ResolveViewProfile 和 trace 不暴露越界内容 |

### 7.6 定义同步与快照供给

#### 7.6.1 本部分职责

- 写入并发布 content published / retired / fingerprint_changed 等 outbox event
- 通过 L0-bus 将定义变化异步传播给下游
- 提供 Definition Snapshot 供冷启动、重建索引、错过事件和主动对账使用
- 支持 replay / resync,保证跨仓最终一致

#### 7.6.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| DefinitionSyncService | application service | 编排 outbox、event metadata、snapshot_ref、replay | §6 / §7 / §8 |
| SnapshotExportService | application service / query service | 导出下游可消费的 Definition Snapshot | §6 / §7 / §8 |
| OutboxEvent | outbox record | 可靠记录待发布定义事件 | §6 / §7 |
| OutboxRelayWorker | operations worker | 从 outbox 发布事件到 L0-bus | §7 / §8 |
| DefinitionSnapshot | DTO / snapshot artifact | 下游同步定义的稳定快照 | §6 / §7 |

#### 7.6.3 本部分不承担什么

- 不保存下游本地索引真相
- 不要求跨仓强一致
- 不替下游执行同步后的业务动作
- 不把完整大正文塞进事件载荷

#### 7.6.4 与其他部分的接缝

| 接缝 | 对接部分 | 说明 |
|---|---|---|
| 发布结果 | 方法定义生命周期与发布治理 | 发布成功后接收 outbox 写入和 snapshot source |
| 定义来源 | 方法定义真相与规则 | 读取已发布定义生成 event / snapshot |
| 边界保护 | 关系校验与边界保护 | 输出前确保定义合法且不混入 Use truth |
| 查询追溯 | 查询解析与审计追溯 | event、snapshot 和 fingerprint 进入 trace 视图 |
| 运维恢复 | 基线初始化与恢复运维 | replay / resync 由运维入口触发 |

### 7.7 查询解析与审计追溯

#### 7.7.1 本部分职责

- 提供 MethodContent 列表、详情、历史版本、生命周期、fingerprint 查询
- 提供 ResolveViewProfile 服务端解析
- 提供 GetDefinitionTrace 审计追溯视图
- 提供 read model / projection 的概要承接位置

#### 7.7.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Query API | inbound adapter | 接收只读查询请求 | §7 |
| ViewProfileResolveService | application query service | 编排 ViewProfile 匹配和默认 deny | §6 / §7 / §8 |
| DefinitionTraceQueryService | application query service | 聚合版本、fingerprint、audit、event、snapshot 追溯视图 | §6 / §7 / §8 |
| DefinitionReadModel | query projection | 支撑定义列表与详情查询 | §6 / §7 |
| DefinitionTraceProjection | query projection | 支撑审计追溯查询 | §6 / §7 |
| ViewProfileProjection | query projection | 支撑 ResolveViewProfile 高频读取 | §6 / §7 |

#### 7.7.3 本部分不承担什么

- 不修改 MethodContent
- 不绕过发布治理暴露运行态应使用的未发布定义
- 不负责 UI 最终渲染
- 不负责 marketplace 交易或安装记录

#### 7.7.4 与其他部分的接缝

| 接缝 | 对接部分 | 说明 |
|---|---|---|
| 定义读取 | 方法定义真相与规则 | 查询已发布或允许查看的定义 |
| 审计来源 | 方法定义生命周期与发布治理 | 读取 audit、version、fingerprint |
| 同步来源 | 定义同步与快照供给 | 读取 event、snapshot、outbox 状态 |
| 视图规则 | 关系校验与边界保护 | 使用 ViewProfileMatchPolicy |
| P1 读取 | P1 资产打包与配置组装 | 查询 plugin / configuration 时只读 P1 组合结果 |

### 7.8 基线初始化与恢复运维

#### 7.8.1 本部分职责

- 初始化最小方法资产基线
- 重放定义事件,帮助下游恢复索引
- 重建查询投影
- 复算 fingerprint 并生成对比结果
- 保证运维动作可审计、可幂等、不可绕过主链规则

#### 7.8.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Operations Trigger | inbound operations adapter | 接收运维触发 | §7 |
| MethodOperationsService | application service | 编排 seed、replay、rebuild、fingerprint 复算 | §6 / §7 / §8 |
| SeedInitialMethodAssetsJob | operations job | 初始化基础 Qualification、Role、Template、ViewProfile、AIPolicyDef | §7 / §8 |
| ReplayDefinitionEventsJob | operations job | 重放定义事件 | §7 / §8 |
| RebuildDefinitionIndexJob | operations job | 重建 read model / projection | §7 / §8 |
| RecalculateFingerprintJob | operations job | 复算内容 fingerprint | §7 / §8 |

#### 7.8.3 本部分不承担什么

- 不直接改数据库绕过 application / domain
- 不修改 published 定义正文语义
- 不替下游修复其本地业务状态
- 不作为普通用户主流程入口

#### 7.8.4 与其他部分的接缝

| 接缝 | 对接部分 | 说明 |
|---|---|---|
| seed 主链 | 方法定义生命周期与发布治理 | seed 仍需进入受控生命周期或受控初始化规则 |
| 定义来源 | 方法定义真相与规则 | 读取 / 初始化定义资产 |
| replay | 定义同步与快照供给 | 触发事件重放和 snapshot 重新导出 |
| projection rebuild | 查询解析与审计追溯 | 重建 read model 和 trace projection |

### 7.9 P1 资产打包与配置组装

#### 7.9.1 本部分职责

- 管理 MethodPlugin 与一组 MethodContent 的打包关系
- 管理 MethodConfiguration、selected_plugins、variability_applications、effective_content_set
- 为 marketplace / console 提供 package metadata 和配置读取入口
- 保持 P1 后置,不反向改变 P0 MethodContent 定义真相

#### 7.9.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| MethodPluginService | application service(P1) | 编排 MethodPlugin 发布和 package metadata | 本轮不展开 / P1 详细设计 |
| MethodConfigurationService | application service(P1) | 编排 MethodConfiguration 激活和 effective_content_set | 本轮不展开 / P1 详细设计 |
| PluginCompositionPolicy | domain policy(P1) | 约束 plugin 依赖、组合和 variability | 本轮不展开 / P1 详细设计 |
| MethodPlugin | domain aggregate(P1) | 方法资产包对象 | 本轮不展开 / P1 详细设计 |
| MethodConfiguration | domain aggregate(P1) | 组织方法集配置对象 | 本轮不展开 / P1 详细设计 |

#### 7.9.3 本部分不承担什么

- 不阻塞 P0 发布同步闭环
- 不拥有 marketplace listing、transaction、install record
- 不复制 MethodContent 正文真相
- 不把 variability 复杂度提前推入 P0 MethodContent 元模型

#### 7.9.4 与其他部分的接缝

| 接缝 | 对接部分 | 说明 |
|---|---|---|
| 已发布定义引用 | 方法定义真相与规则 | P1 只组合已发布或允许引用的定义 |
| 组合校验 | 关系校验与边界保护 | 校验 plugin / configuration 引用和依赖边界 |
| metadata 发布 | 定义同步与快照供给 | P1 可发布 plugin / configuration 事件 |
| 配置查询 | 查询解析与审计追溯 | P1 查询走只读出口 |

### 7.10 总体边界说明

```text
主要组成部分回答“method-library 的业务职责如何分块”。
实现分层回答“这些职责如何被入口、应用服务、领域对象、端口、持久化和 adapter 承载”。
对象轮廓回答“这些主体自身如何定义”,留到 Step 6。
接口骨架回答“对外如何调用和被消费”,留到 Step 7。
处理流回答“主链如何流动”,留到 Step 8。
状态机回答“状态如何变化”,留到 Step 9。
```

### 7.11 后续展开一致性检查结论

| 检查项 | 结论 |
|---|---|
| 主要组成部分是否为业务结构主语 | 是,7 个部分均按职责主线划分 |
| 是否把 Inbound / Persistence 当成业务主要部分 | 否,它们只作为实现分层或代码主体 |
| 是否列出每个部分包含的代码主体 / 模块 | 是 |
| 是否给出后续展开位置 | 是 |
| 是否提前展开对象字段、函数、接口 schema 或 DDL | 否 |
| P1 是否阻塞 P0 | 否,P1 单独成部分且标记本轮不展开 |

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §5。为避免正式文档过长,回填时可保留本节结构和核心表格,并按正式文档篇幅裁剪说明文字。

```md
## 5. 主要组成部分、职责与边界

### 5.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 方法定义生命周期与发布治理 | 编排草稿、审核、发布、废弃、退役、supersede、gate、version、fingerprint、audit、outbox | MethodContentCommandService、PublishGovernanceService、MethodContentLifecycle、PublishPolicy | 不拥有定义正文真相;不确认下游消费成功;不执行 policy enforce |
| 方法定义真相与规则 | 拥有 7 类 P0 MethodContent 定义真相和领域规则 | MethodContent、Qualification、RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile、AIPolicyDef、DefinitionReference | 不保存下游 Use truth 或运行实例真相 |
| 关系校验与边界保护 | 校验 definition 引用并保护 Definition / Use 边界 | ReferenceValidationPolicy、DefinitionUseBoundaryGuard、BoundaryViolation、FingerprintPolicy、ViewProfileMatchPolicy | 不决定下游如何执行、绑定、渲染或裁决 |
| 定义同步与快照供给 | 输出 event、snapshot、replay、resync,支撑下游最终一致 | DefinitionSyncService、SnapshotExportService、OutboxEvent、OutboxRelayWorker、DefinitionSnapshot | 不保存下游索引真相;不做跨仓强事务 |
| 查询解析与审计追溯 | 提供查询、ResolveViewProfile、trace、read model / projection | Query API、ViewProfileResolveService、DefinitionTraceQueryService、DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection | 不修改 MethodContent;不做 UI 渲染;不绕过发布治理 |
| 基线初始化与恢复运维 | 提供 seed、replay、rebuild、fingerprint 复算等运维恢复入口 | Operations Trigger、MethodOperationsService、SeedInitialMethodAssetsJob、ReplayDefinitionEventsJob、RebuildDefinitionIndexJob、RecalculateFingerprintJob | 不绕过 application / domain 规则;不直接改数据库 |
| P1 资产打包与配置组装 | 后置管理 MethodPlugin、MethodConfiguration、effective_content_set 和 package metadata | MethodPluginService、MethodConfigurationService、PluginCompositionPolicy、MethodPlugin、MethodConfiguration | 不阻塞 P0;不拥有 marketplace 交易和安装真相 |

### 5.2 各部分交互总图

```text
外部 Command / Query / Job
        |
        v
[1] 方法定义生命周期与发布治理
        |
        | uses definition + policies
        v
[2] 方法定义真相与规则
        |
        | validate references / guard boundary
        v
[3] 关系校验与边界保护
        |
        | publish result / snapshot source
        v
[4] 定义同步与快照供给 ----------------------+
        |                                      |
        | event / snapshot                     | trace source
        v                                      v
下游 Definition Consumers              [5] 查询解析与审计追溯
 identity / process / capability-hub          ^
 artifact / governance / UI                   |
                                              | read / resolve
                                              |
运维触发                                      |
        |                                      |
        v                                      |
[6] 基线初始化与恢复运维 ----------------------+
        |
        | P1 package/config uses published definitions
        v
[7] P1 资产打包与配置组装
        |
        v
marketplace / console(P1)
```

关键说明：

- 该图表达 7 个业务主要组成部分之间的大体协作关系,不表达协议字段、函数调用链或详细时序。
- 外部入口、repository、outbox store、adapter 等实现支撑不作为图中的业务主要组成部分。
- `[4]` 和 `[5]` 都读取已发布定义,但 `[4]` 面向下游同步恢复,`[5]` 面向查询解析和审计追溯。
- `[6]` 运维恢复必须回到 application / domain 主链,不能作为绕过规则的后门。
- `[7]` 是 P1 后置能力,只消费或组合已发布定义,不反向改变 P0 定义真相。

后续各主要组成部分按同一格式展开:

1. 本部分职责
2. 本部分包含的代码主体 / 模块
3. 本部分不承担什么
4. 与其他部分的接缝
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 5 |
|---|---|---|
| 是否同意正式 §5 采用 7 个业务主要组成部分 | 建议采用,不再保留 A-H 为正式部分 | 阻塞 |
| 是否同意每个部分独立小节都使用“职责 / 代码主体 / 不承担 / 接缝”格式 | 建议采用,符合书写规范 | 阻塞 |
| 是否同意对象字段、函数和状态细节不在 Step 5 展开 | 建议留到 Step 6 / Step 9 | 不阻塞 |
| 是否同意 P1 资产打包与配置组装在 §5 保留,但后续标记本轮不展开 | 建议保留位置和边界 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 6 前需要确认：

- [x] 是否同意 7 个业务主要组成部分作为正式 §5 主结构
- [x] 是否同意 `对外入口与访问`、`基础设施适配` 只作为实现分层或代码主体,不作为业务主要组成部分
- [x] 是否同意各部分的代码主体 / 模块和后续展开位置
- [x] 是否同意 Step 6 再逐个展开关键对象轮廓
