# L3-method-library 02 概要 Step 4: 代码主体框架映射

> 创建日期: 2026-06-16
> 状态: completed
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-method-library/02-概要设计.md`
> 本轮口径: 将新版 00 / 01 已收稳的核心语义、承载边界和交互机制映射为概要层代码主体骨架;旧七类 P0、fingerprint、snapshot、outbox、PostgreSQL / object storage 不作为当前代码主体结论。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 代码主体框架映射 |
| 输出文件 | `design-calibration/02_hld_step_04_code_subject_framework.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_03_constraints.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 4;`概要设计书写规范.md` 4.4 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 旧材料处理 | 旧 `02_hld_step_04_code_subject_framework.md` 只作后置差异审计 |
| 进入条件 | pass |
| next_allowed_action | Step 4 已完成,等待用户确认后进入 Step 5。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | Step 4 输出结构 | pass | 进入架构模块映射思考。 |
| 架构模块映射:先思考 | done | 架构子域 / 承载到代码主体判断 | pass | 进入架构模块映射写入。 |
| 架构模块映射:再写入 | done | 架构模块到代码主体映射图 | pass | 进入实现分层思考。 |
| 实现分层:先思考 | done | Inbound / Application / Domain / Ports 等层次判断 | pass | 进入实现分层写入。 |
| 实现分层:再写入 | done | 实现分层视图 | pass | 进入业务与分层关系思考。 |
| 业务与分层关系:先思考 | done | 业务组成部分与代码分层关系判断 | pass | 进入关系说明写入。 |
| 业务与分层关系:再写入 | done | 关系说明表和关键判断 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 差异审计表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 完成门禁 | pass | 等待用户确认 Step 5。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 4 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 4 | Step 4 必须输出架构模块到代码主体映射图、实现分层视图、业务主要组成部分与实现分层关系说明、关键判断小节。 | 本 Step 只建立代码主体骨架,不写目录树、文件路径、完整 trait、struct 或协议。 |
| `standards/document/概要设计书写规范.md` 4.4 | 两张图必须使用 text 代码块;映射图从仓 / 模块名出发,分层图展示外部调用进入 Inbound / Application / Domain / Ports 等层。 | 本 Step 使用统一 ASCII 图格式,并避免写数据库表、HTTP path、topic、字段或函数实现。 |
| `design-calibration/02_hld_step_03_constraints.md` | 已收稳定义 truth、Definition vs Use、数据归属、一致性分层、外围隔离和表达深度约束。 | 代码主体必须服从这些约束,不得吸收外部正文、下游运行 truth 或旧实现机制。 |
| `projects/L3-method-library/00-需求文档.md` | 核心能力包括定义表达、身份目录、正式化、版本边界、受控消费、消费语境分发、追溯、一致性保护和证据线索。 | 这些能力转译为本步的主要代码主体候选。 |
| `projects/L3-method-library/01-架构设计.md` | 当前子域为定义与目录、正式化与版本、受控消费、追溯一致性、关系分发、外围包 / 方法集、外部摘要 / 引用、下游影响摘要;运行承载为同步入口、异步协作、后台维护、正式状态、读取追溯。 | 这些架构模块和承载边界是本步映射图的主要来源。 |
| 旧 `02_hld_step_04_code_subject_framework.md` | 旧文件恢复了 7 类 P0、fingerprint、snapshot、outbox、PostgreSQL、object storage 等旧口径。 | 本轮整体替换,旧内容只进入差异审计。 |

---

## 3. 整体模块骨架

| 模块 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 架构模块到代码主体 | 将当前架构子域、运行承载和接口能力转成可供 03 继续展开的主体名。 | 不按旧对象清单或技术实现机制命名主体。 |
| 实现分层 | 说明外部调用、事件、运维如何进入 Inbound / Application / Domain / Ports / Persistence / Projection / Collaboration。 | 不写 crate、目录、文件、trait 签名或 adapter 实现。 |
| 业务与分层关系 | 区分“业务主要组成部分说明做什么”和“实现分层说明代码如何安放”。 | 不在本 Step 展开每个组成部分的详细职责,那属于 Step 5。 |
| 关键判断 | 固定哪些名称是业务主体候选,哪些只是实现分层或技术支撑。 | 不把相邻仓、外部系统或旧实现机制当成本仓内部主体。 |
| 旧材料差异 | 标记旧代码主体框架不继承的原因。 | 不从旧 02 / 03 反推当前代码主体。 |

---

## 4. 模块思考记录

### 4.1 架构模块映射:先思考

问题回答:

- 架构已收稳的核心语义可以映射为七组业务代码主体候选:定义与目录、正式化与版本、受控消费、追溯与一致性、关系与分发、外部摘要 / 引用、后台维护。
- 外围包 / 方法集组织可以保留为外围增强主体,但不能进入核心闭环前置。
- 运行承载中的同步入口、异步协作、后台维护、正式状态和读取追溯不是业务组成部分本身,而是这些业务主体落入代码后的承载层。

诊断:

- 旧 Step 4 直接用旧 `MethodContent` 七类和具体同步机制命名代码主体,会提前决定 Step 6 对象轮廓和 Step 7 接口骨架。
- 新版 00 / 01 当前只授权抽象结构,没有授权旧算法、事件格式、存储和 snapshot/outbox 实现作为主体。

取舍:

- 使用“语义主体 + 服务/对象/材料/端口类别”的命名方式。
- 主体名称保持可让 03 展开,但不写完整对象 schema 或端口签名。

### 4.2 架构模块映射:再写入

#### 架构模块到代码主体映射图

```text
L3-method-library
│
├─ 1. 方法资产定义与目录
│   ├─ MethodAssetDefinitionService      编排定义建立与调整
│   ├─ MethodAssetCatalogService         编排身份、目录和适用语境
│   ├─ MethodAssetDefinition             承载方法资产定义语义
│   └─ MethodAssetCatalogEntry           承载目录识别语义
│
├─ 2. 正式化与版本
│   ├─ MethodAssetFormalizationService   编排正式化和前置依据承接
│   ├─ MethodAssetVersionService         编排版本语义变化
│   ├─ FormalMethodAssetVersion          承载正式版本边界
│   └─ FormalizationBasisSummary         承接治理结论或依据摘要
│
├─ 3. 受控消费
│   ├─ MethodAssetConsumptionService     编排正式消费前提判断
│   ├─ MethodAssetConsumptionMaterial    承载只读消费材料
│   ├─ MethodAssetAvailabilityView       表达可消费 / 不可消费 / 待收敛
│   └─ DownstreamConsumptionBoundary     保护下游不得反写定义 truth
│
├─ 4. 追溯与一致性保护
│   ├─ MethodAssetTraceService           聚合版本、依据、引用和影响线索
│   ├─ MethodAssetConsistencyService     编排消费一致性保护
│   ├─ MethodAssetTraceMaterial          承载追溯材料
│   └─ ConsumptionImpactSummary          承接下游影响摘要候选
│
├─ 5. 关系与分发语义
│   ├─ MethodAssetRelationService        编排定义性关系
│   ├─ MethodAssetDistributionService    编排分发语义
│   ├─ MethodAssetRelation               承载资产间定义性关系
│   └─ MethodAssetDistributionRef        指向分发或生态对象的引用
│
├─ 6. 外部摘要与引用
│   ├─ ExternalBasisAcceptanceService    承接治理、标准、ADR 等正式输入
│   ├─ ExternalSourceSummary             承载外部依据摘要
│   ├─ ExternalSourceRef                 指向外部正文或来源
│   └─ ArtifactArchiveRef                指向 artifact / archive,不保存正文
│
├─ 7. 后台维护与收敛
│   ├─ MethodAssetMaintenanceService     编排读取材料、追溯材料和引用收敛
│   ├─ ReadMaterialRefreshTask           刷新正式读取与消费材料
│   ├─ TraceMaterialRefreshTask          刷新追溯和证据线索材料
│   └─ ConsistencyRecoveryTask           推进协作和摘要的恢复收敛
│
└─ 8. 外围包与方法集组织
    ├─ MethodPackageService              外围资产包组织入口
    ├─ MethodSetAssemblyService          外围组织级方法集入口
    ├─ MethodPackage                     组织核心方法资产定义的外围对象
    └─ MethodSetAssembly                 组织级方法集语义,不替代核心 truth
```

关键说明:

- 该图表达当前架构子域和能力主线在概要层可落成的代码主体主语,不是代码目录树。
- `1~7` 是当前核心闭环和支撑边界的代码主体候选;`8` 是外围增强位置,不作为核心闭环前置。
- 图中 `Service`、`Material`、`Summary`、`Ref`、`Task` 只是概要层主体类别,不是 Rust 类型或 trait 签名。
- 外部系统、下游仓、artifact 正文、治理执行、marketplace 交易和 UI 状态不作为本仓内部代码主体。

### 4.3 实现分层:先思考

问题回答:

- 实现分层应沿用标准层次:Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Collaboration。
- 本仓还需要把“正式状态承载”和“读取 / 追溯承载”区分开,防止读取材料成为第二 truth。
- 异步协作和后台维护应作为代码层位置出现,但不能在 Step 4 定义 event schema、topic、outbox 或 job 调度。

诊断:

- 旧 Step 4 把 outbox relay、snapshot exporter、PostgreSQL 等作为主体,会把技术承载误认为业务结构。
- 新版架构要求“不固定数据库、缓存、消息、对象存储、指纹算法、事件格式、任务调度、部署环境和代码目录”。

取舍:

- 分层图点名层和主体类别,不点名具体技术产品。
- 保留 Collaboration / Projection / Persistence 作为后续 03 展开线索,但不写实现细节。

### 4.4 实现分层:再写入

#### 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        │
        ▼
┌────────────────────────────────────────┐
│ Inbound / Operations                   │
│ command / query / consumer / task入口  │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Application Services                   │
│ 定义 / 正式化 / 消费 / 追溯 / 维护编排 │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Domain Model                           │
│ 定义 truth / 版本语义 / 关系 / 规则    │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Ports                                  │
│ id / clock / uow / repo / resolver / bus│
└──────────────┬───────────────┬─────────┘
               ▼               ▼
┌──────────────────────┐ ┌──────────────────────┐
│ Persistence           │ │ Projection / Material │
│ 正式状态与引用持久化 │ │ 读取 / 消费 / 追溯材料│
└──────────────┬───────┘ └──────────────┬───────┘
               ▼                        ▼
┌────────────────────────────────────────┐
│ Collaboration / External Adapters      │
│ L0-core / L0-bus / 外部摘要与引用接缝 │
└────────────────────────────────────────┘
```

关键说明:

- 该图表达代码主体如何安放到实现分层,不表达 crate、目录、进程或部署拓扑。
- `Application Services` 编排用例和一致性边界,但不拥有外部正文或下游运行 truth。
- `Domain Model` 是核心定义 truth 和规则的落点,不依赖 projection、adapter 或外部仓运行状态。
- `Persistence` 保存正式状态和引用;`Projection / Material` 支撑读取、消费和追溯,不得成为第二 truth。
- `Collaboration / External Adapters` 表达跨仓接缝,不在本 Step 定义事件 payload、topic、重试或具体 adapter。

### 4.5 业务与分层关系:先思考

问题回答:

- 业务主要组成部分回答“本仓做什么”:定义、正式化、消费、追溯、关系、外部承接、维护和外围组织。
- 实现分层回答“代码怎么安放”:入口、应用服务、领域模型、端口、持久化、投影、协作适配。
- 二者不能混用,否则 Step 5 会把 `Inbound` 或 `Persistence` 当成业务组成部分,Step 6 又会把技术层当成对象来源。

诊断:

- 旧文件的 A-H 把入口层、应用层、领域层和基础设施层混入主要组成部分。
- 当前需要先建立映射关系,让 Step 5 只讨论业务主要组成部分,并把实现分层作为每个部分内部的代码主体安放方式。

取舍:

- 本 Step 点名业务组成部分候选,但不展开职责清单。
- 详细职责和不承担什么留给 Step 5。

### 4.6 业务与分层关系:再写入

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 从当前 00 / 01 承接而来的业务结构主语,包括方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection / Material、Collaboration / External Adapters 等代码组织层。 |
| 二者关系 | 业务组成部分说明“做什么”;实现分层说明每个业务主体在代码中如何被入口、服务、领域、端口、持久化和投影承载。 |
| 使用规则 | Step 5 讨论业务主要组成部分;Step 6~9 再从这些业务部分内提取对象、接口、流程和状态,不能从实现分层直接发明业务对象。 |
| 禁止混用 | `Inbound`、`Persistence`、`Projection`、`Adapter`、`Task` 不是业务组成部分;`method asset definition truth`、`formalization`、`controlled consumption` 不是目录或文件结构。 |

### 4.7 关键判断

业务主要组成部分候选:

- 方法资产定义与目录。
- 正式化与版本。
- 受控消费。
- 追溯与一致性保护。
- 关系与分发语义。
- 外部摘要与引用。
- 后台维护与收敛。
- 外围包与方法集组织。

实现分层名称:

- Inbound / Operations。
- Application Services。
- Domain Model。
- Ports。
- Persistence。
- Projection / Material。
- Collaboration / External Adapters。

必须避免混用的原因:

- 业务主要组成部分决定 Step 5 的职责边界和 Step 6 的对象发现范围。
- 实现分层只是安放代码主体的方式,不能变成业务职责来源。
- 相邻仓、外部系统、技术产品和旧实现机制不能被伪装成本仓内部主体。

### 4.8 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| 旧 Step 4 的 7 类 P0 MethodContent 代码主体 | 不继承为当前主体。 | 新版 00 / 01 未把旧七类对象清单重新闭口为当前核心对象全集。 |
| `FingerprintPolicy`、`RecalculateFingerprintJob` 等旧主体 | 不继承为当前主体。 | 当前只确认版本稳定和显式变化,未授权 fingerprint 算法或复算 job。 |
| `OutboxRelayWorker`、`OutboxPort` 等旧主体 | 不继承为当前主体。 | 当前只确认变化可感知和异步协作,未授权 outbox 实现机制。 |
| `SnapshotExportService`、`DefinitionSnapshot` 等旧主体 | 不继承为当前主体。 | 当前只确认读取 / 消费 / 追溯材料,未授权 snapshot 作为固定机制。 |
| PostgreSQL、object storage、cache、L0-bus adapter 作为内部主体 | 不继承。 | 新版 01 明确不固定具体存储、缓存、消息或对象存储技术;`L0-bus` 是运行对接边界,不是内部业务主体。 |
| 旧 A-H 把入口、应用、领域、基础设施当成同级主要组成部分 | 不继承。 | 当前区分业务主要组成部分与实现分层,防止 Step 5 串层。 |

---

## 5. 结构化中间产物

### 5.1 架构模块到代码主体映射图

```text
L3-method-library
│
├─ 1. 方法资产定义与目录
│   ├─ MethodAssetDefinitionService
│   ├─ MethodAssetCatalogService
│   ├─ MethodAssetDefinition
│   └─ MethodAssetCatalogEntry
│
├─ 2. 正式化与版本
│   ├─ MethodAssetFormalizationService
│   ├─ MethodAssetVersionService
│   ├─ FormalMethodAssetVersion
│   └─ FormalizationBasisSummary
│
├─ 3. 受控消费
│   ├─ MethodAssetConsumptionService
│   ├─ MethodAssetConsumptionMaterial
│   ├─ MethodAssetAvailabilityView
│   └─ DownstreamConsumptionBoundary
│
├─ 4. 追溯与一致性保护
│   ├─ MethodAssetTraceService
│   ├─ MethodAssetConsistencyService
│   ├─ MethodAssetTraceMaterial
│   └─ ConsumptionImpactSummary
│
├─ 5. 关系与分发语义
│   ├─ MethodAssetRelationService
│   ├─ MethodAssetDistributionService
│   ├─ MethodAssetRelation
│   └─ MethodAssetDistributionRef
│
├─ 6. 外部摘要与引用
│   ├─ ExternalBasisAcceptanceService
│   ├─ ExternalSourceSummary
│   ├─ ExternalSourceRef
│   └─ ArtifactArchiveRef
│
├─ 7. 后台维护与收敛
│   ├─ MethodAssetMaintenanceService
│   ├─ ReadMaterialRefreshTask
│   ├─ TraceMaterialRefreshTask
│   └─ ConsistencyRecoveryTask
│
└─ 8. 外围包与方法集组织
    ├─ MethodPackageService
    ├─ MethodSetAssemblyService
    ├─ MethodPackage
    └─ MethodSetAssembly
```

### 5.2 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        │
        ▼
┌────────────────────────────────────────┐
│ Inbound / Operations                   │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Application Services                   │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Domain Model                           │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Ports                                  │
└──────────────┬───────────────┬─────────┘
               ▼               ▼
┌──────────────────────┐ ┌──────────────────────┐
│ Persistence           │ │ Projection / Material │
└──────────────┬───────┘ └──────────────┬───────┘
               ▼                        ▼
┌────────────────────────────────────────┐
│ Collaboration / External Adapters      │
└────────────────────────────────────────┘
```

### 5.3 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection / Material、Collaboration / External Adapters。 |
| 关系 | 业务组成部分说明“做什么”,实现分层说明“代码如何安放这些主体”。 |
| 后续使用 | Step 5 按业务主要组成部分展开职责边界;Step 6~9 从业务部分中提取对象、接口、流程和状态。 |

---

## 6. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` 时回填到 §4,当前不直接修改正式文档。

````md
## 4. 代码主体框架总览

> 校准来源:
> - `design-calibration/02_hld_step_04_code_subject_framework.md`

### 4.1 架构模块到代码主体映射图

```text
L3-method-library
│
├─ 1. 方法资产定义与目录
│   ├─ MethodAssetDefinitionService
│   ├─ MethodAssetCatalogService
│   ├─ MethodAssetDefinition
│   └─ MethodAssetCatalogEntry
│
├─ 2. 正式化与版本
│   ├─ MethodAssetFormalizationService
│   ├─ MethodAssetVersionService
│   ├─ FormalMethodAssetVersion
│   └─ FormalizationBasisSummary
│
├─ 3. 受控消费
│   ├─ MethodAssetConsumptionService
│   ├─ MethodAssetConsumptionMaterial
│   ├─ MethodAssetAvailabilityView
│   └─ DownstreamConsumptionBoundary
│
├─ 4. 追溯与一致性保护
│   ├─ MethodAssetTraceService
│   ├─ MethodAssetConsistencyService
│   ├─ MethodAssetTraceMaterial
│   └─ ConsumptionImpactSummary
│
├─ 5. 关系与分发语义
│   ├─ MethodAssetRelationService
│   ├─ MethodAssetDistributionService
│   ├─ MethodAssetRelation
│   └─ MethodAssetDistributionRef
│
├─ 6. 外部摘要与引用
│   ├─ ExternalBasisAcceptanceService
│   ├─ ExternalSourceSummary
│   ├─ ExternalSourceRef
│   └─ ArtifactArchiveRef
│
├─ 7. 后台维护与收敛
│   ├─ MethodAssetMaintenanceService
│   ├─ ReadMaterialRefreshTask
│   ├─ TraceMaterialRefreshTask
│   └─ ConsistencyRecoveryTask
│
└─ 8. 外围包与方法集组织
    ├─ MethodPackageService
    ├─ MethodSetAssemblyService
    ├─ MethodPackage
    └─ MethodSetAssembly
```

关键说明:

- 该图表达当前架构子域和能力主线在概要层可落成的代码主体主语,不是代码目录树。
- `1~7` 是当前核心闭环和支撑边界的代码主体候选;`8` 是外围增强位置,不作为核心闭环前置。
- 外部系统、下游仓、artifact 正文、治理执行、marketplace 交易和 UI 状态不作为本仓内部代码主体。

### 4.2 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        │
        ▼
┌────────────────────────────────────────┐
│ Inbound / Operations                   │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Application Services                   │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Domain Model                           │
└──────────────────┬─────────────────────┘
                   ▼
┌────────────────────────────────────────┐
│ Ports                                  │
└──────────────┬───────────────┬─────────┘
               ▼               ▼
┌──────────────────────┐ ┌──────────────────────┐
│ Persistence           │ │ Projection / Material │
└──────────────┬───────┘ └──────────────┬───────┘
               ▼                        ▼
┌────────────────────────────────────────┐
│ Collaboration / External Adapters      │
└────────────────────────────────────────┘
```

关键说明:

- 该图表达代码主体如何安放到实现分层,不表达 crate、目录、进程或部署拓扑。
- `Domain Model` 是核心定义 truth 和规则的落点,不依赖 projection、adapter 或外部仓运行状态。
- `Persistence` 保存正式状态和引用;`Projection / Material` 支撑读取、消费和追溯,不得成为第二 truth。

### 4.3 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection / Material、Collaboration / External Adapters。 |
| 关系 | 业务组成部分说明“做什么”,实现分层说明“代码如何安放这些主体”。 |
| 后续使用 | Step 5 按业务主要组成部分展开职责边界;Step 6~9 从业务部分中提取对象、接口、流程和状态。 |
````

---

## 7. 待确认事项

| 待确认事项 | 当前处理 |
|---|---|
| `MethodAssetDefinitionService` 等概要名称是否最终作为 03 service 名 | 当前只是 02 代码主体主语;03 可在不改变职责边界的前提下细化命名。 |
| 外围包与方法集组织是否进入核心 Step 5 小循环 | 当前保留为外围增强组成部分,不得阻塞核心闭环。 |
| 下游消费影响摘要是否成为 P0 一致性保护主体 | 当前保留 `ConsumptionImpactSummary` 候选,具体机制留给后续 Step / 03。 |
| 外部治理结论摘要保存为 summary 还是 ref-only | 当前同时保留 summary/ref 主体类别,不得迁入治理执行正文。 |

---

## 8. 自检与停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否输出两张 ASCII 图 | pass | 已输出架构模块到代码主体映射图和实现分层视图。 |
| 是否区分业务组成部分与实现分层 | pass | 已用关系说明表和关键判断固定二者边界。 |
| 是否避免代码目录 / 文件路径 / 完整 contract | pass | 未写 crate、目录、文件、trait 签名、字段全集、DDL、event payload 或 HTTP path。 |
| 是否承接新版 00 / 01 | pass | 主体来自当前核心能力、子域、数据归属和交互承载。 |
| 是否排除旧材料污染 | pass | 旧七类 P0、fingerprint、snapshot、outbox、PostgreSQL/object storage 仅在差异审计或非继承语境出现。 |
| 是否允许进入 Step 5 | pass | Step 4 已完成,等待用户确认后进入 Step 5。 |
