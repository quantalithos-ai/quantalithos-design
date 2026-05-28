# Step 4. 代码主体框架映射

> 本版本是概要设计重启后的 Step 4 中间产物。它把 `L0-core` 架构里已经收稳的角色、语义单元和依赖边界，翻译为代码主体框架，而不是先去展开职责边界、对象字段或接口协议。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-core/02-概要设计.md` §4 代码主体框架总览

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 2 设计目标 | 本轮概要设计要收稳代码主体框架，并交给 Step 5~11 继续展开 | 作为本步的收口深度约束 |
| Step 3 结构性约束 | 契约真相、Definition / Use 分离、P0 / P1 分离、发布门禁、快照兜底、事实输出、引用边界 | 作为代码主体命名和分层的硬边界 |
| 架构设计 §4 | 职责边界已确定：L0-core 只做跨仓共享契约来源仓，不做 bus / sdk / L1 业务实现 | 作为本步主语边界 |
| 架构设计 §5 | 系统边界、输入面、输出面、消费边界已经收稳 | 作为入口 / 编排 / 适配划分依据 |
| 架构设计 §6 | 内部语义单元已明确为共享契约核心、领域契约包、本地索引 / 投影 / 引用 | 作为代码主体分层依据 |
| 架构设计 §7 | 无在线运行时；正式承载结构包含变更入口、源码承载、校验 / 派生单元、发布快照承载和工具链支撑 | 作为后台承接与技术承载边界 |
| 架构设计 §8~§10 | 依赖角色、数据所有权、一致性、同步 / 异步 / 后台边界已收稳 | 作为实现分层和处理流方向约束 |
| 旧版 `02` | 仍用公共类型仓、工具链仓或 method-library 风格主语组织内容 | 作为要切断的旧入口 |
| 可参考样例 | `projects/L3-method-library/02-概要设计.md` 与 Step 4 样例 | 只参考写法密度，不机械搬运业务主语 |

已确认结论:

```text
本步只建立“架构角色 -> 代码主体骨架”的映射。
不写 crate / module / file tree。
不写完整 trait、struct、字段、函数签名或协议 schema。
外围增强能力在本步只保留边界感，不进入主体框架主图。
```

依赖的前序 Step:

```text
Step 1 已确认上游输入边界。
Step 2 已确认设计目标、非范围和当前设计深度。
Step 3 已确认结构性硬约束。
```

---

## 3. SOP 问题回答

### 3.1 架构层已经收稳的模块，分别应落到哪些代码主体骨架上？

回答：

架构层模块不能原样搬到概要设计里，必须先翻译成代码主体骨架主语，再交给 Step 5~8 继续展开。

| 架构层角色 / 语义单元 | 概要设计代码主体骨架 | 说明 |
|---|---|---|
| 外部接缝与输入收口 | `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger`、`ExternalInputBoundaryGuard` | 接收标准、草案、下游反馈和运维触发，完成进入正式接缝前的收口，不直接决定契约真相 |
| 契约变更与发布编排 | `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService` | 承接草稿、更新、发布、废弃、退役、兼容判断、快照、追溯、事实输出和后台运维主流程 |
| 共享契约核心 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`CompatibilityStatus`、`ContractEvolutionRecord`、`ContractFactRecord` | 承载契约真相、版本、演进、正式基线、快照和事实记录 |
| 领域契约包 | `IdentityContractPackage`、`ConversationContractPackage`、`WorkContractPackage`、`ProcessContractPackage`、`GovernanceContractPackage`、`ArtifactContractPackage` | 承载按消费域拆分的共享契约包，不等于 L1 实现仓 |
| 本地索引 / 投影 / 引用 | `StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection`、`ExternalReference`、`DownstreamConsumptionRef` | 提供标准映射、事件目录引用、兼容追溯、只读查询和外部引用入口 |
| 后台校验与事实输出 | `OutboxRelayWorker`、`ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob` | 承接异步事实传播、派生、回放、重建和复算 |
| 技术承载与外部适配 | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ReferenceRepository`、`AuditLogPort`、`OutboxPort`、`GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort`、`EventPublisherPort`、`ClockPort`、`IdGeneratorPort`、`UnitOfWork` | 保存真相、保证事务边界、写审计、写 outbox、解析引用并对接外部基础设施 |

### 3.2 哪些主体属于 Inbound / Operations，哪些属于 Application Services？

回答：

| 实现层 | 代码主体 | 作用 |
|---|---|---|
| Inbound / Operations | `ContractCommandApi` | 接收契约变更类写请求，如收束范围、提交发布、废弃、退役和演进变更 |
| Inbound / Operations | `ContractQueryApi` | 接收只读查询请求，如获取、列举、版本读取、追溯和快照导出 |
| Inbound / Operations | `ContractOperationsTrigger` | 接收 seed、replay、rebuild、recalculate 等运维触发 |
| Inbound / Operations | `ExternalInputBoundaryGuard` | 处理标准、草案、下游反馈等输入是否能进入正式接缝 |
| Application Services | `ContractChangeService` | 编排草稿、更新、提交等变更主用例 |
| Application Services | `ContractReleaseService` | 编排发布、废弃、退役和 supersede 等生命周期主用例 |
| Application Services | `ContractCompatibilityService` | 编排兼容判断、发布门禁和 fingerprint 协调 |
| Application Services | `ContractSnapshotService` | 编排发布快照生成、导出和下游恢复入口 |
| Application Services | `ContractTraceService` | 编排版本、快照、引用和审计追溯视图 |
| Application Services | `ContractFactService` | 编排事实输出、审计记录和可感知状态输出 |
| Application Services | `ContractOperationsService` | 编排后台运维、回放、重建和复算等动作 |

### 3.3 哪些主体属于 Domain Model / Policies / Ports / Projection？

回答：

| 实现层 | 代码主体 | 作用 |
|---|---|---|
| Domain Model | `ContractDefinition` | L0-core 的契约真相主语 |
| Domain Model | `ContractScope` | 表达共享契约范围和收束边界 |
| Domain Model | `ContractVersion` | 表达契约版本和演进位置 |
| Domain Model | `ContractLifecycle` | 表达 draft / published / deprecated / retired / superseded 等生命周期状态 |
| Domain Model | `ContractReleaseBaseline` | 表达正式发布基线 |
| Domain Model | `ContractReleaseSnapshot` | 表达发布快照与下游只读消费面 |
| Domain Model | `CompatibilityStatus` | 表达兼容性判断状态 |
| Domain Model | `ContractEvolutionRecord` | 表达契约变化记录和追溯锚点 |
| Domain Model | `ContractFactRecord` | 表达契约变化可感知事实 |
| Domain Model | `IdentityContractPackage` / `ConversationContractPackage` / `WorkContractPackage` / `ProcessContractPackage` / `GovernanceContractPackage` / `ArtifactContractPackage` | 按消费域拆分的领域契约包 |
| Domain Policy | `ScopePolicy` | 收束哪些契约可进入本仓 |
| Domain Policy | `ReleasePolicy` | 约束发布门禁和已发布不可原地改写 |
| Domain Policy | `ReferenceValidationPolicy` | 校验引用是否指向允许的正式定义版本 |
| Domain Policy | `DefinitionUseBoundaryGuard` | 防止下游 Use truth 混入本仓 |
| Domain Policy | `FingerprintPolicy` | 约束 canonical 内容与 fingerprint 生成 / 对比 |
| Domain Policy | `BoundaryGuard` | 防止外部正文、运行实例或凭据正文进入本仓 |
| Ports | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ReferenceRepository` | 面向持久化和引用存储的抽象接缝 |
| Ports | `AuditLogPort`、`OutboxPort`、`GateDecisionPort` | 面向审计、发布事实和治理门禁的抽象接缝 |
| Ports | `ReferenceResolverPort`、`BlobRefPort`、`EventPublisherPort` | 面向引用解析、blob 连接和事实传播的抽象接缝 |
| Ports | `ClockPort`、`IdGeneratorPort`、`UnitOfWork` | 面向时间、编号和事务边界的抽象接缝 |
| Projection | `ContractReadModel` | 支撑列表、详情和只读查询 |
| Projection | `ContractTraceProjection` | 支撑版本、引用、审计和事实追溯 |
| Projection | `CompatibilityTraceIndex` | 支撑兼容性追踪和审查视图 |
| Projection | `StandardMappingIndex`、`EventCatalogReference` | 支撑标准映射和事件目录引用视图 |
| Projection | `DownstreamConsumptionRef`、`ExternalReference` | 支撑消费关系和外部引用视图 |

### 3.4 哪些名称必须在概要设计层先点名，否则详细设计会重新发明主语？

回答：

必须先点名的名称分为 5 类。

| 类型 | 必须点名的名称 | 原因 |
|---|---|---|
| 应用服务 | `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService` | 这些是详细设计展开用例、事务和接口处理流的主语 |
| 领域对象 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`CompatibilityStatus`、`ContractEvolutionRecord`、`ContractFactRecord` | 这些是契约真相、状态和事实输出的共同对象主语 |
| 领域包 | `IdentityContractPackage`、`ConversationContractPackage`、`WorkContractPackage`、`ProcessContractPackage`、`GovernanceContractPackage`、`ArtifactContractPackage` | 这些是按消费域拆分的共享契约包主语 |
| 领域策略 | `ScopePolicy`、`ReleasePolicy`、`ReferenceValidationPolicy`、`DefinitionUseBoundaryGuard`、`FingerprintPolicy`、`BoundaryGuard` | 这些是收口、发布、引用和边界规则的落点 |
| 端口 / 基础设施 | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ReferenceRepository`、`AuditLogPort`、`OutboxPort`、`GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort`、`EventPublisherPort`、`ClockPort`、`IdGeneratorPort`、`UnitOfWork` | 这些是 03 继续展开 trait、事务和外部适配边界的主语 |

外围增强能力先不进入主图，后续如果需要再按单独章节或附录处理：

```text
契约接入说明
示例与可视化
额外导出格式
高级兼容报告
自动发布体验
```

### 3.5 哪些内容已经是代码目录、文件路径或框架实现，不应在本步展开？

回答：

以下内容不进入 Step 4。

| 不展开内容 | 原因 |
|---|---|
| Rust crate / module / file tree | 属于详细设计 |
| 完整 trait 名单和函数签名 | 属于详细设计对象实现契约 |
| struct / enum 字段全集 | 属于详细设计 |
| HTTP / RPC / Event / Job schema | 属于详细设计接口契约 |
| SQL 表、索引、事务伪代码 | 属于详细设计 |
| 具体缓存、搜索、消息中间件实现 | 属于详细设计或实现选型 |
| 部署拓扑、进程拆分和资源配额 | 属于架构 / 实施计划 / 运维设计 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 Step 4 的主体框架 | 仍用泛化 `Contract*` 和 method-library 风格主语组织内容 | 会把 L0-core 再次拉回到“公共类型仓 / 泛化 contract service 仓”口径 |
| 旧版 Step 4 的对象与策略 | 出现 `ViewProfile` 之类不属于 L0-core 已收稳主线的主语 | 会让后续 Step 5~9 在错误主语上继续展开 |
| 旧版 Step 4 的文本质量 | `ProcessContractPackage` 存在乱码 | 影响正式回填、检索和读者理解 |
| 旧版 Step 4 的分层表达 | 业务主线、实现分层和外围增强仍混在同一张图里 | Step 5 的职责边界和 Step 6 的对象轮廓会更难收口 |
| 当前新上游 | 00 / 01 已收稳，但旧 Step 4 仍未按 L0-core 自身语义完整重写 | 后续读者看不到“外部接缝 / 契约编排 / 共享契约核心 / 索引投影引用 / 后台校验 / 技术承载”如何落到代码主体框架 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 主体拆分 | 由泛化 `Contract*` 服务、视图解析和后置组装口径混成 | 按外部接缝、契约编排、共享契约核心、领域契约包、索引 / 投影 / 引用、后台校验和技术承载重排 | 对齐 L0-core 架构语义 |
| 技术层 | 与业务部分混在一起 | 单独用实现分层视图表达 | 避免 Step 5 混层 |
| 名称粒度 | 部分是概念词，部分是 method-library 迁移词 | 点名 service、domain object、policy、port、job、package | 支撑详细设计继续展开 |
| 文本质量 | 存在局部乱码 | 文本统一为正式主语和正式包名 | 便于正式文档回填和检索 |
| 外围增强 | 作为主图中的正式分支出现 | 只保留边界感，不进入主体框架主图 | 避免 method-library 口径污染 L0-core |
| 视图解析 | 误引入 `ViewProfile` 相关主语 | 只保留 `标准 / 事件目录 / 兼容追溯 / 接入说明` 等 L0-core 语义 | 对齐当前仓真实需求 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧的服务目录主图 | 改动小 | 会再次把 L0-core 写成泛化 contract service 仓 | 不采用 |
| 方案 B：完全按实现分层建图 | 接近代码 | 会丢失共享契约核心、领域契约包和引用索引的业务主线 | 不采用 |
| 方案 C：按架构语义单元建代码主体框架，再辅以实现分层视图 | 既保留业务主线，也能指导实现 | 需要维护两张图和一组主语 | 采用 |

---

## 7. 结构化中间产物

### 7.1 架构模块到代码主体框架图

```text
L0-core
|
+-- 1. 外部接缝与输入收口
|   +-- ContractCommandApi                    接收写请求
|   +-- ContractQueryApi                      接收只读查询
|   +-- ContractOperationsTrigger             接收运维触发
|   +-- ExternalInputBoundaryGuard            判断外部输入是否可进入正式接缝
|
+-- 2. 契约承接与发布编排
|   +-- ContractChangeService                 编排草稿 / 更新 / 提交
|   +-- ContractReleaseService                编排发布 / 废弃 / 退役 / supersede
|   +-- ContractCompatibilityService          编排 gate / fingerprint / 兼容判断
|   +-- ContractSnapshotService               编排快照生成与导出
|   +-- ContractTraceService                  编排追溯视图
|   +-- ContractFactService                   编排事实输出
|   +-- ContractOperationsService             编排 seed / replay / rebuild / recalculate
|
+-- 3. 共享契约核心
|   +-- ContractDefinition                    契约定义真相
|   +-- ContractScope                         契约范围
|   +-- ContractVersion                       契约版本
|   +-- ContractLifecycle                     契约生命周期
|   +-- ContractReleaseBaseline               正式发布基线
|   +-- ContractReleaseSnapshot               发布快照与只读消费面
|   +-- CompatibilityStatus                   兼容性状态
|   +-- ContractEvolutionRecord               契约演进记录
|   +-- ContractFactRecord                    契约变化可感知事实记录
|
+-- 4. 领域契约包
|   +-- IdentityContractPackage                identity 对外共享契约包
|   +-- ConversationContractPackage            conversation 对外共享契约包
|   +-- WorkContractPackage                    work 对外共享契约包
|   +-- ProcessContractPackage                 process 对外共享契约包
|   +-- GovernanceContractPackage              governance 对外共享契约包
|   +-- ArtifactContractPackage                artifact 对外共享契约包
|
+-- 5. 本地索引 / 投影 / 引用
|   +-- StandardMappingIndex                   标准映射本地索引
|   +-- EventCatalogReference                  事件目录引用
|   +-- CompatibilityTraceIndex                兼容追溯索引
|   +-- ContractReadModel                     只读查询模型
|   +-- ContractTraceProjection               追溯投影
|   +-- ExternalReference                     外部引用关系
|   +-- DownstreamConsumptionRef              下游消费引用
|
+-- 6. 后台校验与事实输出
|   +-- OutboxRelayWorker                      从 outbox 发布可感知事实
|   +-- ValidateContractChangeJob              校验候选契约变化
|   +-- DeriveReleaseSnapshotJob               派生发布快照
|   +-- RebuildContractIndexJob                重建查询索引
|   +-- RecalculateFingerprintJob              复算 fingerprint
|   +-- PublishContractFactJob                 形成事实输出记录
|
+-- 7. 技术承载与外部适配
    +-- ContractDefinitionRepository           读写契约真相
    +-- ContractBaselineRepository             读写发布基线
    +-- SnapshotRepository                     读写快照
    +-- ReferenceRepository                    读写引用关系
    +-- AuditLogPort                           写审计记录
    +-- OutboxPort                             写 outbox 事件
    +-- GateDecisionPort                       读取 / 校验门禁结果
    +-- ReferenceResolverPort                  解析外部引用
    +-- BlobRefPort                            校验 blob 引用
    +-- EventPublisherPort                     发布事实到 L0-bus
    +-- ClockPort / IdGeneratorPort / UnitOfWork
```

关键说明：

- 该图表达的是“架构角色与语义单元在概要设计层落成哪些代码主体主语”，不是目录树。
- `1~6` 是业务主线候选，`7` 是实现支撑主体集合，不应在 Step 5 中当成业务主线本身。
- `Command API`、`Query API`、`Operations Trigger` 是入口主体，不是契约真相主体。
- `ContractFactRecord` / `Outbox` / `EventPublisherPort` 只表达可感知事实输出边界，不表达 `L0-bus` 投递实现。
- 外围增强能力当前只保留边界感，不进入本步主图。

### 7.2 实现分层视图

```text
外部输入 / 下游读取 / 运维触发
  - 标准 / 草案 / ADR / 下游反馈
  - author / reviewer / admin / console
  - L0-bus / operations
        |
        v
+--------------------------------------------------------------+
| Inbound / Operations                                         |
| ContractCommandApi / ContractQueryApi                       |
| ContractOperationsTrigger / ExternalInputBoundaryGuard       |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Application Services                                          |
| ContractChangeService / ContractReleaseService               |
| ContractCompatibilityService / ContractSnapshotService       |
| ContractTraceService / ContractFactService                   |
| ContractOperationsService                                    |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Domain Model / Policies                                       |
| ContractDefinition / ContractScope / ContractVersion         |
| ContractLifecycle / ContractReleaseBaseline                  |
| ContractReleaseSnapshot / CompatibilityStatus                |
| ContractEvolutionRecord / ContractFactRecord                 |
| BoundaryGuard / ReleasePolicy / ReferenceValidationPolicy    |
| FingerprintPolicy                                            |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Ports                                                        |
| Repository / Snapshot / Reference / Audit / Outbox / Gate    |
| ReferenceResolver / BlobRef / EventPublisher                 |
| Clock / IdGenerator / UnitOfWork                             |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Persistence / Projection / External Adapters                  |
| source store / baseline store / snapshot store               |
| read model / trace projection / compatibility index          |
| outbox / L0-bus adapter / object storage adapter             |
+--------------------------------------------------------------+
```

关键说明：

- 该图表达实现承载方向，不替代业务主线划分。
- 依赖方向必须从入口到应用、领域、端口，再到外部适配。
- Domain 不依赖工具链结果、下游反馈或快照结构。
- 外围增强能力不在本图展开，后续再按需要单独讨论。

### 7.3 业务主线与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主线 | 表达 `L0-core` 在业务上承担哪些结构主线：契约变更承接、契约真相、发布基线、快照、引用、追溯、事实输出、恢复运维 |
| 实现分层 | 表达代码如何安放这些主线：Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / External Adapters |
| 二者关系 | 一个业务主线通常跨多个实现层；一个实现层也会承接多个业务主线 |
| 不能混用的原因 | 如果把入口层和基础设施层当业务主线，Step 5 会退化成技术分层；如果把业务主线当代码层，Step 6~8 会缺少稳定落点 |
| 本步边界 | 本步只收稳代码主体框架，不决定文件目录、完整接口契约、数据库表或具体框架实现 |

### 7.4 关键判断

必须作为代码主体骨架继续进入 Step 5 的名称：

```text
1. 外部接缝与输入收口
2. 契约承接与发布编排
3. 共享契约核心
4. 领域契约包
5. 本地索引 / 投影 / 引用
6. 后台校验与事实输出
7. 技术承载与外部适配
```

### 7.5 本步不进入主体框架主图的外围增强能力

```text
契约接入说明
样例与可视化
额外导出格式
高级兼容报告
自动发布体验
```

---

## 8. 回填草稿

```md
## 4. 代码主体框架总览

> 校准来源：
> - `design-calibration/02_hld_step_04_code_subject_framework.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/02_hld_step_04_code_subject_framework.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节，了解架构角色如何映射到概要设计代码主体。

本章把架构设计中已经收稳的角色、语义单元和依赖边界，转译为后续详细设计可以继续展开的代码主体框架。

#### 架构模块到代码主体框架图

```text
<回填 Step 4 的代码主体框架图>
```

#### 实现分层视图

```text
<回填 Step 4 的实现分层视图>
```

关键说明：
- 代码主体框架强调“有哪些主体”，不是“具体文件怎么放”。
- 实现分层强调“代码如何承载”，不是“业务主线如何命名”。
- 外围增强能力先不进入主体框架主图，后续按需要单独展开。
```

### 9. 待确认事项

- 无阻塞事项。
- 当前已自动确认采用方案 C：按架构语义单元建代码主体框架，再辅以实现分层视图。

### 10. 进入下一步条件

- 已确认代码主体框架图和实现分层视图。
- 已确认 `L0-core` 的代码主体主语不再沿用 method-library 风格的 plugin / viewprofile 口径。
- 可以进入 Step 5 主要组成部分、职责与边界。
