# Step 5. 主要组成部分、职责与边界

> 本版本承接 Step 4 已确认的代码主体框架，把 `L0-core` 的代码主体骨架收敛为概要设计层的主要组成部分。
> 本步只回答“哪些部分承担什么职责、包含哪些代码主体、边界在哪里”，不展开对象字段、成员函数、接口协议或完整处理流。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-core/02-概要设计.md` §5 主要组成部分、职责与边界

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 4 代码主体框架 | 已确认外部接缝、契约编排、共享契约核心、领域契约包、索引 / 投影 / 引用、后台校验、技术承载等代码主体骨架 | 作为本步拆分主要组成部分的直接来源 |
| Step 3 结构性约束 | 契约真相、Definition / Use 分离、P0 / P1 分离、发布门禁、快照兜底、事实输出、引用边界 | 作为每个组成部分职责和非职责的硬边界 |
| 架构设计 §6 | 共享契约核心、领域契约包、本地索引 / 投影 / 引用三层语义单元 | 作为业务组成部分的语义来源 |
| 架构设计 §7~§10 | 无在线运行时、正式承载结构、依赖方向、数据所有权、一致性和通信方式 | 作为组成部分间协作与支撑主体边界 |
| 旧版 `02` | 旧版仍按公共类型、枚举、错误、元信息等类型种类组织 | 作为本步需要纠偏的旧口径 |

已确认结论:

```text
本步按业务结构主线拆主要组成部分。
Inbound / Application / Domain / Ports / Persistence 是实现分层，不是主要组成部分。
技术承载与外部适配是支撑主体集合，不作为业务主要组成部分。
```

依赖的前序 Step:

```text
Step 1 已确认上游输入边界。
Step 2 已确认设计目标、非范围和当前设计深度。
Step 3 已确认结构性约束。
Step 4 已确认代码主体框架与实现分层视图。
```

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面，本仓应被划分为哪些主要组成部分？

回答：

`L0-core` 应划分为 6 个业务主要组成部分，并单独列出 1 个实现支撑主体集合。

| 类型 | 名称 | 判断 |
|---|---|---|
| 业务主要组成部分 | 契约变更承接与输入收口 | 承接外部输入，并判断候选变化是否能进入共享契约范围 |
| 业务主要组成部分 | 契约真相与领域契约组织 | 承载契约定义、范围、版本、生命周期和领域契约包 |
| 业务主要组成部分 | 兼容性门禁与发布基线 | 控制发布前兼容判断、门禁引用和正式基线形成 |
| 业务主要组成部分 | 快照派生与下游消费 | 从发布基线派生只读快照，支撑下游稳定消费和恢复 |
| 业务主要组成部分 | 引用索引与追溯查询 | 管理标准、草案、ADR、下游消费关系和追溯查询视图 |
| 业务主要组成部分 | 后台校验与事实输出 | 承接校验、派生、重建、复算和可感知事实输出 |
| 支撑主体集合 | 技术承载与外部适配 | 提供 repository、port、unit of work、outbox、event publisher 等支撑接缝，不作为业务主线 |

### 3.2 每个主要组成部分分别承担什么职责？

回答：

每个主要组成部分都必须围绕 `L0-core` 作为跨仓共享契约来源仓的闭环展开。

| 组成部分 | 核心职责 |
|---|---|
| 契约变更承接与输入收口 | 接收候选契约变化、标准 / 草案 / 评审引用和下游反馈，完成进入正式变更流程前的边界判断 |
| 契约真相与领域契约组织 | 维护契约定义、范围、版本、生命周期、演进记录和各领域契约包的语义归属 |
| 兼容性门禁与发布基线 | 在发布前完成兼容性判断、引用校验、门禁引用和正式发布基线收口 |
| 快照派生与下游消费 | 生成可被下游读取、对账和恢复的只读发布快照，并记录下游消费引用 |
| 引用索引与追溯查询 | 提供标准映射、事件目录引用、兼容追溯、只读查询和外部引用查询 |
| 后台校验与事实输出 | 处理耗时校验、快照派生、索引重建、fingerprint 复算和 outbox 事实输出 |

### 3.3 每个主要组成部分明确不承担什么职责？

回答：

每个部分都必须排除相邻仓职责和详细设计层内容。

| 组成部分 | 明确不承担 |
|---|---|
| 契约变更承接与输入收口 | 不直接改写核心真相；不做登录认证、权限裁决或治理审批本身；不吸收外部正文 |
| 契约真相与领域契约组织 | 不保存 L1 业务真相、事件实例正文、观测正文、归档正文、运行时执行正文或凭据正文 |
| 兼容性门禁与发布基线 | 不以工具链结果单独决定发布；不发布 SDK 包；不实现 CI / registry 流程 |
| 快照派生与下游消费 | 不让快照反向拥有真相；不保存下游仓内部实现；不要求跨仓强事务 |
| 引用索引与追溯查询 | 不复制标准、ADR、草案或评审正文；不在查询路径临时改写真相 |
| 后台校验与事实输出 | 不实现 `L0-bus` 的 publish / subscribe / ack / retry / dead-letter；不绕过发布门禁 |

### 3.4 每个主要组成部分包含哪些代码主体 / 模块？

回答：

本步只列代码主体 / 模块名称、类型、作用和后续展开位置。
字段、状态集合、成员函数、工厂函数留给 Step 6；接口骨架留给 Step 7；处理流留给 Step 8。

### 3.5 这些代码主体 / 模块在本部分中只需要说明到什么粒度？

回答：

粒度停在“可作为详细设计主语”的层面。

| 可写内容 | 不写内容 |
|---|---|
| 代码主体名称 | 文件路径、crate / module tree |
| 代码主体类型 | 完整 trait / struct 定义 |
| 代码主体作用 | 字段全集、函数签名、返回类型 |
| 后续展开位置 | 协议 schema、DDL、SQL、错误码全集 |
| 与其他部分的接缝 | 完整调用链、详细时序、部署拓扑 |

### 3.6 哪些内容虽然相关，但必须由相邻部分或边界外能力承担？

回答：

| 相关内容 | 承担方 | 本仓处理口径 |
|---|---|---|
| 事件投递、订阅、确认、重试、死信 | `L0-bus` | 本仓只写 outbox 事实和发布端口，不做 bus 运行时 |
| SDK 高层客户端、重试、配置、认证封装 | `L0-sdk` | 本仓只提供可派生契约来源和快照 |
| L1 业务语义和领域状态机 | L1 各业务仓 | 本仓只承载共享契约包，不实现业务真相 |
| 观测日志、trace 正文和查询 | `L4-observability` | 本仓只约束追踪上下文契约和引用 |
| 归档包正文和恢复流程 | `L4-archive` | 本仓只输出契约快照和引用边界 |
| 运行时调度、工具执行、容器编排 | L2 运行层 | 本仓只定义相关共享契约，不执行运行时动作 |
| 登录认证和权限裁决 | 安全入口 / governance | 本仓只记录 actor / gate 引用，不做认证授权 |

### 3.7 哪些职责如果不写清，后续最容易让概要设计滑进实现层或让不同部分串线？

回答：

最容易串线的是以下 5 类边界。

| 边界 | 如果不写清会导致什么问题 |
|---|---|
| 业务主要组成部分 vs 实现分层 | 会把 Inbound、Application、Domain、Ports 当成主要组成部分，导致 §5 退化为技术层清单 |
| 契约真相 vs 发布快照 | 会把快照、派生产物和查询投影视为真相，破坏来源仓边界 |
| 外部输入 vs 正式契约变更 | 会让标准、草案、下游反馈绕过正式接缝直接影响核心契约 |
| outbox 事实输出 vs bus 投递实现 | 会把本仓写成事件总线运行时 |
| 领域契约包 vs L1 业务实现 | 会把 identity / work / process 等 L1 业务真相误写进 L0-core |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `02` §5 | 按基础标识、共享对象、枚举、错误、元信息等公共类型拆分 | 会把 `L0-core` 写成公共 DTO 仓，而不是共享契约来源仓 |
| 旧版 `02` §6 | 交互章节按模块外联关系组织，缺少主要组成部分职责表 | 后续详细设计难以知道每个业务部分由哪些代码主体承接 |
| 旧版 `02` §7 | 总体架构与主要组成部分边界重叠 | 容易重复架构设计，而不是下沉到可实现结构 |
| 旧版 Step 5 中间产物 | 只有总表和交互图，缺少每个组成部分独立小节 | 不符合概要设计书写规范对 §5 的输出要求 |
| 旧版 Step 5 中间产物 | 部分代码主体名称与 Step 4 不一致，如 `CompatibilityService`、`SnapshotService`、`ContractScopePolicy` | 会导致 Step 6~8 重新发明或改名 |
| 旧版 Step 5 中间产物 | 没有单独说明技术承载与外部适配为何不是业务主要组成部分 | 后续容易把 repository / port / adapter 当成业务主线 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 拆分依据 | 公共类型种类或粗粒度能力名 | 6 个业务主要组成部分 + 1 个支撑主体集合 | 对齐 Step 4 的代码主体框架和架构语义单元 |
| 组成部分表达 | 只有总表 | 每个主要组成部分独立成节 | 满足书写规范 §5 的输出要求 |
| 技术支撑 | 混入主要组成部分 | 单独列为“技术承载与外部适配”支撑主体集合 | 避免业务部分和实现支撑混层 |
| 代码主体名称 | 部分名称未与 Step 4 对齐 | 全部沿用 Step 4 已确认主语 | 防止 Step 6~8 重新发明主语 |
| 对象细节 | 个别对象承担了字段 / 状态解释倾向 | 只说明所属部分、类型、作用和后续展开位置 | 字段、函数、状态留给 Step 6 / Step 9 |
| 接口与流程 | 总图表达较粗 | 总图 + 接缝说明，接口骨架和处理流后移 | 保持 §5 / §7 / §8 边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧公共类型拆分 | 改动少，类型清单容易写 | 与共享契约来源仓主线不一致，详细设计会退化为 DTO 实现 | 不采用 |
| 方案 B：完全按实现分层拆分 | 接近代码结构 | 会把概要设计写成 Inbound / Application / Domain / Ports 技术层清单 | 不采用 |
| 方案 C：按 6 个业务主要组成部分拆分，并单独列技术支撑集合 | 能承接需求闭环、架构语义和 Step 4 代码主体框架 | 需要维护业务主线与实现分层两条轴 | 采用 |
| 方案 D：把技术承载与外部适配也作为第 7 个主要组成部分 | 能完整承接 Step 4 主图 | 会违反“主要组成部分必须是业务结构主语”的规则 | 不采用；改为支撑主体集合 |

---

## 7. 结构化中间产物

### 7.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 契约变更承接与输入收口 | 承接候选契约输入，判断是否能进入共享契约范围和正式变更流程 | `ContractCommandApi`、`ExternalInputBoundaryGuard`、`ContractChangeService`、`ScopePolicy`、`DefinitionUseBoundaryGuard` | 不直接改写核心真相；不做认证授权；不吸收外部正文 |
| 契约真相与领域契约组织 | 承载契约定义、范围、版本、生命周期、演进记录和领域契约包语义 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractEvolutionRecord`、`IdentityContractPackage`、`ConversationContractPackage`、`WorkContractPackage`、`ProcessContractPackage`、`GovernanceContractPackage`、`ArtifactContractPackage` | 不拥有 L1 业务真相；不保存事件实例、观测、归档、运行或凭据正文 |
| 兼容性门禁与发布基线 | 在正式发布前完成兼容判断、引用校验、门禁引用和发布基线收口 | `ContractReleaseService`、`ContractCompatibilityService`、`ContractReleaseBaseline`、`CompatibilityStatus`、`ReleasePolicy`、`ReferenceValidationPolicy`、`FingerprintPolicy` | 不以工具链结果单独决定真相；不发布 SDK 包；不实现 CI / registry 流程 |
| 快照派生与下游消费 | 从发布基线派生只读发布快照，支撑下游读取、对账和恢复 | `ContractSnapshotService`、`ContractReleaseSnapshot`、`DownstreamConsumptionRef` | 不让快照反向拥有真相；不保存下游内部实现；不要求跨仓强事务 |
| 引用索引与追溯查询 | 管理标准映射、事件目录引用、兼容追溯、外部引用和只读查询视图 | `ContractQueryApi`、`ContractTraceService`、`StandardMappingIndex`、`EventCatalogReference`、`CompatibilityTraceIndex`、`ContractReadModel`、`ContractTraceProjection`、`ExternalReference` | 不复制外部正文；不在查询路径改写真相；不把引用失效伪装为正文有效 |
| 后台校验与事实输出 | 承接校验、派生、重建、复算和契约变化可感知事实输出 | `ContractOperationsTrigger`、`ContractOperationsService`、`ContractFactService`、`ContractFactRecord`、`OutboxRelayWorker`、`ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob` | 不实现 bus 投递、ack、retry、dead-letter；不绕过发布门禁；不把后台结果单独写成真相 |

### 7.2 各部分交互总图

```text
外部契约输入 / 标准 / 草案 / 下游反馈 / 运维触发
        |
        v
+----------------------------------------------------+
| [1] 契约变更承接与输入收口                         |
|     ContractCommandApi / ExternalInputBoundaryGuard |
+-----------------------+----------------------------+
                        |
                        | accepted candidate
                        v
+----------------------------------------------------+
| [2] 契约真相与领域契约组织                         |
|     ContractDefinition / ContractScope / ContractVersion |
|     ContractLifecycle / ContractEvolutionRecord     |
|     IdentityContractPackage / ConversationContractPackage |
|     WorkContractPackage / ProcessContractPackage    |
|     GovernanceContractPackage / ArtifactContractPackage |
+-----------------------+----------------------------+
                        |
                        | release candidate
                        v
+----------------------------------------------------+
| [3] 兼容性门禁与发布基线                           |
|     ContractReleaseBaseline / CompatibilityStatus   |
+-----------+----------------------------+-----------+
            |                            |
            | derive snapshot             | query trace
            v                            v
+-------------------------------+   +-------------------------------+
| [4] 快照派生与下游消费        |   | [5] 引用索引与追溯查询        |
|     ContractReleaseSnapshot    |   |     ContractTraceProjection   |
+---------------+---------------+   +---------------+---------------+
                |                                   ^
                | schedule / visible fact            |
                v                                   |
+---------------------------------------------------+--+
| [6] 后台校验与事实输出                              |
|     jobs / ContractFactRecord / OutboxRelayWorker   |
+-----------------------+------------------------------+
                        |
                        | fact out / snapshot ready
                        v
下游契约消费边界 / L0-bus 感知边界

支撑主体集合:
  技术承载与外部适配为 [1]~[6] 提供 repository、port、
  unit of work、audit、outbox、gate、clock、id 等接缝。
```

关键说明：

- 图表达主要组成部分之间的大体交接关系，不表达协议字段、函数调用链或详细时序。
- `[1]~[6]` 是业务主要组成部分；技术承载与外部适配只作为支撑主体集合出现。
- `[6]` 可以由发布、快照、查询索引和运维触发调度，但不能绕过 `[3]` 直接形成发布真相。
- 下游契约消费边界和 `L0-bus` 感知边界不是本仓主要组成部分。

### 7.3 契约变更承接与输入收口

#### 7.3.1 本部分职责

接收候选契约变化、标准 / 草案 / ADR / 评审引用和下游反馈，并判断这些输入是否可以进入正式契约变更流程。
本部分是外部输入进入 `L0-core` 的边界，不是核心真相本身。

#### 7.3.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractCommandApi` | inbound api | 接收创建、更新、提交、废弃、退役等写请求 | §7 / §8 |
| `ExternalInputBoundaryGuard` | boundary guard | 判断标准、草案、下游反馈和外部引用是否允许进入正式接缝 | §6 / §8 |
| `ContractChangeService` | application service | 编排候选变更接收、范围判断和提交前准备 | §6 / §8 |
| `ScopePolicy` | domain policy | 判断候选契约是否具有跨仓共享价值 | §6 / §8 |
| `DefinitionUseBoundaryGuard` | domain policy | 防止下游 Use truth、运行实例和业务正文混入本仓 | §6 / §10 |

#### 7.3.3 本部分不承担什么

- 不直接改写 `ContractDefinition` 的已发布真相。
- 不执行认证、授权或治理审批；只记录 actor / gate 等引用。
- 不保存外部标准、ADR、评审、草案或下游反馈正文。
- 不做 L1 业务语义解释。

#### 7.3.4 与其他部分的接缝

| 对方 | 接缝 | 说明 |
|---|---|---|
| 契约真相与领域契约组织 | accepted candidate | 只有通过输入收口的候选变化才能进入真相模型 |
| 兼容性门禁与发布基线 | release candidate | 需要发布的候选变化交给门禁与发布部分继续判断 |
| 引用索引与追溯查询 | external reference | 外部引用只以引用关系进入，不复制正文 |
| 技术承载与外部适配 | repository / gate / audit port | 通过支撑端口保存候选记录、审计和门禁引用 |

### 7.4 契约真相与领域契约组织

#### 7.4.1 本部分职责

维护共享契约定义、范围、版本、生命周期、演进记录和各领域契约包的语义归属。
这是 `L0-core` 作为共享契约来源仓成立的核心部分。

#### 7.4.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractDefinition` | domain aggregate | 表达共享契约定义真相 | §6 / §8 / §9 |
| `ContractScope` | value object / policy subject | 表达契约范围和跨仓共享边界 | §6 |
| `ContractVersion` | value object | 表达契约版本位置和演进序列 | §6 / §9 |
| `ContractLifecycle` | domain state | 表达 draft / published / deprecated / retired / superseded 等状态 | §6 / §9 |
| `ContractEvolutionRecord` | domain record | 记录新增、变更、废弃、退役和 supersede 的追溯锚点 | §6 / §8 |
| `IdentityContractPackage` | domain package | 承载 identity 对外共享契约包 | §6 |
| `ConversationContractPackage` | domain package | 承载 conversation 对外共享契约包 | §6 |
| `WorkContractPackage` | domain package | 承载 work 对外共享契约包 | §6 |
| `ProcessContractPackage` | domain package | 承载 process 对外共享契约包 | §6 |
| `GovernanceContractPackage` | domain package | 承载 governance 对外共享契约包 | §6 |
| `ArtifactContractPackage` | domain package | 承载 artifact 对外共享契约包 | §6 |
| `BoundaryGuard` | domain policy | 防止外部正文、运行实例和凭据正文进入本仓真相 | §6 / §10 |

#### 7.4.3 本部分不承担什么

- 不拥有 L1 业务聚合、业务状态机或业务数据真相。
- 不保存事件实例 payload、观测日志、trace 正文、归档正文、运行时执行记录或凭据正文。
- 不承担 SDK 客户端封装和事件总线运行时。
- 不把快照、报告摘要或引用关系反向提升为契约真相。

#### 7.4.4 与其他部分的接缝

| 对方 | 接缝 | 说明 |
|---|---|---|
| 契约变更承接与输入收口 | accepted candidate | 接收已通过边界判断的候选定义变化 |
| 兼容性门禁与发布基线 | publishable definition | 提供待发布定义、版本和演进记录给门禁部分判断 |
| 快照派生与下游消费 | release baseline source | 发布基线形成后作为快照派生来源 |
| 引用索引与追溯查询 | trace source | 向追溯查询提供版本、演进记录和领域契约包归属 |
| 后台校验与事实输出 | validation source | 被后台校验、fingerprint 复算和事实输出读取 |

### 7.5 兼容性门禁与发布基线

#### 7.5.1 本部分职责

在契约正式发布前完成兼容性判断、引用校验、fingerprint 判断、approved gate 引用和发布基线收口。
本部分保护“已发布内容不可原地改写”和“发布必须可追溯”。

#### 7.5.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractReleaseService` | application service | 编排发布、废弃、退役和 supersede 主用例 | §6 / §7 / §8 |
| `ContractCompatibilityService` | application service | 编排兼容判断、gate、fingerprint 和发布前校验 | §6 / §8 |
| `ContractReleaseBaseline` | domain record | 表达某一版本契约已经正式收口的基线 | §6 / §9 |
| `CompatibilityStatus` | domain state | 表达 compatible / incompatible / pending 等兼容判断状态 | §6 / §9 |
| `ReleasePolicy` | domain policy | 约束发布门禁、已发布不可原地改写和 supersede 规则 | §6 / §8 |
| `ReferenceValidationPolicy` | domain policy | 校验定义间引用和外部引用是否指向允许版本 | §6 / §8 / §10 |
| `FingerprintPolicy` | domain policy | 约束 canonical 内容与 fingerprint 生成 / 对比规则 | §6 / §8 |

#### 7.5.3 本部分不承担什么

- 不用工具链检查结果单独决定发布真相。
- 不负责 SDK 包构建、registry 发布、CI 命令或多语言 binding 分发。
- 不实现治理系统，只引用 approved gate 结果。
- 不直接通知所有下游完成同步。

#### 7.5.4 与其他部分的接缝

| 对方 | 接缝 | 说明 |
|---|---|---|
| 契约真相与领域契约组织 | publishable definition | 读取待发布契约定义、版本和演进记录 |
| 快照派生与下游消费 | release baseline | 发布基线形成后触发快照派生 |
| 后台校验与事实输出 | outbox fact / validation job | 发布成立后调度事实输出和后台处理 |
| 引用索引与追溯查询 | compatibility trace | 将兼容状态和发布依据暴露给追溯查询 |
| 技术承载与外部适配 | gate / audit / unit of work | 通过端口读取 gate、写审计并保证事务边界 |

### 7.6 快照派生与下游消费

#### 7.6.1 本部分职责

从正式发布基线派生下游可消费的只读发布快照，并维护下游消费引用。
本部分用于支撑下游读取、对账、恢复和重建索引。

#### 7.6.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractSnapshotService` | application service | 编排发布快照生成、导出和恢复入口 | §6 / §7 / §8 |
| `ContractReleaseSnapshot` | domain snapshot / read model source | 表达从发布基线派生出的只读消费快照 | §6 / §8 / §9 |
| `DownstreamConsumptionRef` | reference model | 表达下游仓消费某个基线或快照的引用关系 | §6 / §7 |

#### 7.6.3 本部分不承担什么

- 不让快照反向改变 `ContractDefinition`、`ContractReleaseBaseline` 或兼容状态。
- 不保存下游仓内部实现、生成产物正文或运行时消费状态。
- 不要求跨仓强事务；下游消费是最终一致。
- 不承担 SDK 包发布或客户端封装。

#### 7.6.4 与其他部分的接缝

| 对方 | 接缝 | 说明 |
|---|---|---|
| 兼容性门禁与发布基线 | release baseline | 只从正式发布基线派生快照 |
| 引用索引与追溯查询 | snapshot query | 查询侧可以读取快照状态和消费引用 |
| 后台校验与事实输出 | derive snapshot job | 快照派生可由后台任务延后承接 |
| 技术承载与外部适配 | snapshot repository / blob ref | 通过支撑端口保存快照和校验 blob 引用 |

### 7.7 引用索引与追溯查询

#### 7.7.1 本部分职责

维护标准映射、事件目录引用、兼容追溯索引、外部引用关系和只读查询视图。
本部分让读者和下游仓能够理解某个契约定义的来源、版本、状态、引用和消费关系。

#### 7.7.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractQueryApi` | inbound api | 接收获取、列举、追溯和快照读取等只读查询 | §7 / §8 |
| `ContractTraceService` | application service | 编排版本、快照、引用、审计和事实追溯视图 | §6 / §8 |
| `StandardMappingIndex` | local index | 维护外部标准概念到本仓契约语义的映射 | §6 / §7 |
| `EventCatalogReference` | reference model | 表达事件目录的本地引用入口 | §6 / §7 |
| `CompatibilityTraceIndex` | projection / index | 支撑兼容状态、破坏性变化和废弃追溯 | §6 / §8 |
| `ContractReadModel` | query projection | 支撑契约列表、详情和当前状态读取 | §6 / §7 |
| `ContractTraceProjection` | query projection | 支撑版本、引用、审计、快照和事实追溯 | §6 / §7 |
| `ExternalReference` | reference model | 表达标准、草案、ADR、评审、下游消费等外部引用 | §6 / §10 |

#### 7.7.3 本部分不承担什么

- 不复制标准、草案、ADR、评审或下游实现正文。
- 不在查询路径临时修复或改写真相。
- 不把引用失效伪装成正文有效。
- 不把 UI session state 写成本仓长期视图规则。

#### 7.7.4 与其他部分的接缝

| 对方 | 接缝 | 说明 |
|---|---|---|
| 契约真相与领域契约组织 | trace source | 读取定义、版本、演进和领域契约包归属 |
| 兼容性门禁与发布基线 | compatibility trace | 读取兼容状态、发布基线和门禁引用 |
| 快照派生与下游消费 | snapshot / consumption ref | 读取快照和下游消费引用 |
| 后台校验与事实输出 | projection rebuild | 查询投影和索引可由后台任务重建 |
| 技术承载与外部适配 | reference repository / read projection | 通过支撑端口保存和读取引用、索引与投影 |

### 7.8 后台校验与事实输出

#### 7.8.1 本部分职责

承接同步入口不应阻塞的校验、快照派生、索引重建、fingerprint 复算和可感知事实输出。
本部分保护最终一致、恢复能力和下游感知边界。

#### 7.8.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractOperationsTrigger` | operations inbound | 接收 seed、replay、rebuild、recalculate 等运维触发 | §7 / §8 |
| `ContractOperationsService` | application service | 编排后台运维、回放、重建和复算动作 | §6 / §8 |
| `ContractFactService` | application service | 编排契约变化事实输出、审计记录和 outbox 写入 | §6 / §8 |
| `ContractFactRecord` | domain / outbox-related record | 表达契约变化可感知事实 | §6 / §8 / §9 |
| `OutboxRelayWorker` | background worker | 从 outbox 读取事实并交给事件发布端口 | §8 |
| `ValidateContractChangeJob` | operations job | 校验候选契约变化是否满足规则 | §7 / §8 |
| `DeriveReleaseSnapshotJob` | operations job | 基于发布基线派生或刷新快照 | §7 / §8 |
| `RebuildContractIndexJob` | operations job | 重建只读查询索引和追溯投影 | §7 / §8 |
| `RecalculateFingerprintJob` | operations job | 复算 canonical fingerprint 并用于漂移判断 | §7 / §8 |
| `PublishContractFactJob` | operations job | 将已提交事实整理为可传播记录 | §7 / §8 |

#### 7.8.3 本部分不承担什么

- 不实现 `L0-bus` 的投递、订阅、确认、重试或死信。
- 不绕过发布门禁形成事实。
- 不把校验摘要、兼容报告或后台结果单独提升为契约真相。
- 不承担通用任务调度平台职责。

#### 7.8.4 与其他部分的接缝

| 对方 | 接缝 | 说明 |
|---|---|---|
| 契约变更承接与输入收口 | validation job | 可校验候选变化，但不能替代输入边界判断 |
| 兼容性门禁与发布基线 | fact after release | 只有正式发布或状态变化成立后才输出事实 |
| 快照派生与下游消费 | derive / rebuild | 承接快照刷新、索引重建和恢复任务 |
| 引用索引与追溯查询 | projection rebuild | 重建 read model、trace projection 和 compatibility index |
| 技术承载与外部适配 | outbox / event publisher / clock | 通过支撑端口写 outbox、发布时间和调用发布适配器 |

### 7.9 技术承载与外部适配支撑主体集合

#### 7.9.1 定位

技术承载与外部适配不是业务主要组成部分。
它为 6 个业务主要组成部分提供 repository、port、unit of work、audit、outbox、gate、reference resolver、blob ref、event publisher、clock 和 id generator 等支撑接缝。

#### 7.9.2 支撑主体表

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ContractDefinitionRepository` | repository port | 读写契约定义真相 | §8 / 留给详细设计 trait |
| `ContractBaselineRepository` | repository port | 读写发布基线 | §8 / 留给详细设计 trait |
| `SnapshotRepository` | repository port | 读写发布快照 | §8 / 留给详细设计 trait |
| `ReferenceRepository` | repository port | 读写外部引用、标准映射和消费引用 | §8 / 留给详细设计 trait |
| `AuditLogPort` | outbound port | 写入审计记录 | §8 / 留给详细设计 trait |
| `OutboxPort` | outbound port | 写入 outbox 事件或事实记录 | §8 / 留给详细设计 trait |
| `GateDecisionPort` | outbound port | 读取或校验 approved gate 结果 | §8 / 留给详细设计 trait |
| `ReferenceResolverPort` | outbound port | 解析外部引用是否存在或可用 | §8 / 留给详细设计 trait |
| `BlobRefPort` | outbound port | 校验 blob 引用，不吸收 blob 正文 | §8 / 留给详细设计 trait |
| `EventPublisherPort` | outbound port | 将 outbox 事实交给 `L0-bus` 适配器 | §8 / 留给详细设计 trait |
| `ClockPort` | support port | 提供时间来源 | 留给详细设计 |
| `IdGeneratorPort` | support port | 提供稳定编号来源 | 留给详细设计 |
| `UnitOfWork` | transaction boundary | 保护真相、审计和 outbox 的事务边界 | §8 / 留给详细设计 |

#### 7.9.3 支撑主体边界

- 不决定契约语义。
- 不决定发布是否成立。
- 不拥有外部正文。
- 不作为业务主要组成部分出现在 §5 总表中。
- 不在概要设计层展开为完整 trait、struct、DDL 或 adapter 实现。

### 7.10 总体边界说明

```text
业务主要组成部分回答:
  L0-core 对平台提供哪些结构性能力。

实现分层回答:
  这些能力在代码中如何通过 inbound、application、domain、
  ports、persistence、projection、adapters 承载。

支撑主体集合回答:
  哪些 repository / port / unit of work / adapter 支撑业务主线。
```

因此：

- `契约变更承接与输入收口` 到 `后台校验与事实输出` 是本章主要组成部分。
- `技术承载与外部适配` 是支撑主体集合，不是业务主要组成部分。
- `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger` 是入口代码主体，不是单独业务主线。
- `ContractDefinitionRepository`、`OutboxPort`、`UnitOfWork` 等是支撑接缝，不拥有业务语义。

### 7.11 后续展开一致性检查结论

| 检查项 | 结论 |
|---|---|
| §5 是否按业务结构主语拆分 | 是，6 个主要组成部分均为业务结构主线 |
| 是否把实现分层当成主要组成部分 | 否，Inbound / Application / Domain / Ports 等只作为实现组织轴 |
| 是否把技术支撑当成业务主线 | 否，技术承载与外部适配单独列为支撑主体集合 |
| 是否提前展开字段 / 函数 / 协议 / DDL | 否，均留给 Step 6~8 或详细设计 |
| Step 4 已点名的主语是否有承接位置 | 是，业务主体进入 6 个组成部分，port / repository 进入支撑主体集合 |
| 后续展开位置是否悬空 | 否，均标注 §6 / §7 / §8 / §9 / §10 或留给详细设计 |

---

## 8. 回填草稿

```md
## 5. 主要组成部分、职责与边界

> 校准来源：
> - `design-calibration/02_hld_step_05_components_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/02_hld_step_05_components_boundary.md` 的“结构化中间产物”“回填草稿”和“待确认事项”小节，了解主要组成部分如何从代码主体框架收敛为可实现结构。

本章按业务结构主线说明 `L0-core` 的主要组成部分。`Inbound / Operations`、`Application Services`、`Domain Model / Policies`、`Ports`、`Persistence / Projection / External Adapters` 是实现分层，不作为主要组成部分。

### 5.1 组成部分总表

<回填 7.1 组成部分总表>

### 5.2 各部分交互总图

<回填 7.2 各部分交互总图>

### 5.3 契约变更承接与输入收口

<回填 7.3 的职责、代码主体表、非职责和接缝>

### 5.4 契约真相与领域契约组织

<回填 7.4 的职责、代码主体表、非职责和接缝>

### 5.5 兼容性门禁与发布基线

<回填 7.5 的职责、代码主体表、非职责和接缝>

### 5.6 快照派生与下游消费

<回填 7.6 的职责、代码主体表、非职责和接缝>

### 5.7 引用索引与追溯查询

<回填 7.7 的职责、代码主体表、非职责和接缝>

### 5.8 后台校验与事实输出

<回填 7.8 的职责、代码主体表、非职责和接缝>

### 5.9 技术承载与外部适配支撑主体集合

<回填 7.9 的支撑主体定位、支撑主体表和边界>

### 5.10 总体边界与后续展开一致性

<回填 7.10 和 7.11>
```

---

## 9. 待确认事项

- 无阻塞事项。
- 当前自动采用方案 C：按 6 个业务主要组成部分拆分，并把技术承载与外部适配列为支撑主体集合。

---

## 10. 进入下一步条件

- 已确认 `L0-core` 的 6 个业务主要组成部分。
- 已确认技术承载与外部适配不是业务主要组成部分，而是支撑主体集合。
- 已确认每个主要组成部分都有职责、代码主体 / 模块表、非职责和接缝说明。
- 已确认字段、函数、协议、状态机和详细处理流未提前展开。
- 可以进入 Step 6 关键对象轮廓。
