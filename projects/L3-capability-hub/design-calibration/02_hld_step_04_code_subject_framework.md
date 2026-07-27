# L3-capability-hub 02 概要 Step 4: 代码主体框架映射

> 创建日期: 2026-07-08
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 将新版 `00/01` 已收稳的 capability access truth、核心子域、运行承载和 Step 3 结构约束映射为概要层代码主体骨架;旧 `ProviderContract / CapabilityDecision / CostRecord / KMS / QueryCapabilities / allow-deny / execution gateway` 不作为当前代码主体结论。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 4 代码主体框架映射 |
| 输出文件 | `design-calibration/02_hld_step_04_code_subject_framework.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_01_upstream_boundary.md`;`design-calibration/02_hld_step_02_goals_scope.md`;`design-calibration/02_hld_step_03_constraints.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 4;`概要设计书写规范.md` §4.4 与 ASCII 图统一格式 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` 的 `02` Step 4 中间产物 |
| 旧材料处理 | 旧 `02-概要设计.md` 与旧 `03-详细设计.md` 只作后置差异审计 |
| 进入条件 | pass |
| next_allowed_action | Step 4 已完成,等待用户确认后进入 Step 5。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | Step 4 输出结构 | pass | 进入架构模块映射思考。 |
| 架构模块映射:先思考 | done | 架构子域 / 运行承载到代码主体判断 | pass | 进入架构模块映射写入。 |
| 架构模块映射:再写入 | done | 架构模块到代码主体映射图 | pass | 进入实现分层思考。 |
| 实现分层:先思考 | done | Inbound / Application / Domain / Ports / Persistence / Projection 分层判断 | pass | 进入实现分层写入。 |
| 实现分层:再写入 | done | 实现分层视图 | pass | 进入业务与分层关系思考。 |
| 业务与分层关系:先思考 | done | 业务主要组成部分候选与实现分层关系判断 | pass | 进入关系说明写入。 |
| 业务与分层关系:再写入 | done | 关系说明表与关键判断 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 差异审计表 | pass | 进入结构化中间产物。 |
| 自检与停审 | done | 完成门禁 | pass | 等待用户确认 Step 5。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 4 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 4 | Step 4 必须输出架构模块到代码主体映射图、实现分层视图、业务主要组成部分与实现分层关系说明、关键判断小节。 | 本 Step 必须画两张 ASCII 图,不写目录、文件路径、完整 trait / struct、API schema、数据库表、topic、配置项或部署结构。 |
| `standards/document/概要设计书写规范.md` §4.4 | 映射图从仓 / 模块名出发列主要组成部分和关键代码主体;分层图展示外部调用 / 事件 / 运维任务进入 Inbound / Application / Domain / Ports 等层。 | 本 Step 采用统一图标题、`text` 代码块和图后关键说明,并使用业务模块与实现分层关系说明表。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` | Step 1 已明确本文必须回答代码主体框架、主要组成部分、关键对象、接口骨架、flow、状态、配置影响和详细设计承接。 | Step 4 只解决代码主体框架,不提前进入 Step 5~12 的职责、对象、接口、flow 或状态细节。 |
| `design-calibration/02_hld_step_02_goals_scope.md` | Step 2 已确认 `02` 停在可实现结构骨架,排除完整 schema、port、DDL、事务、测试和实施 boundary。 | 代码主体名可以点出 service、domain object、projection、port、job,但不得完整契约化。 |
| `design-calibration/02_hld_step_03_constraints.md` | Step 3 已收稳 truth owner 独立、核心轴线可分、数据分层、forbidden body、依赖裁剪、sync / async / background、配置不可越界和旧材料污染排除。 | 代码主体必须围绕 capability access truth 组织,并区分核心 truth、正式入口、异步协作、后台派生和外部接缝。 |
| `projects/L3-capability-hub/00-需求文档.md` | 需求以 `C-CH-1~5` 和 `FR-CH-001~016` 固定 identity、registry、descriptor、governance / method seam、formal exposure / controlled consumer view、traceability / impact 主线。 | 代码主体必须覆盖这些主线,且不回流 execution、secret、cost、marketplace、governance truth、method body 或 SDK client。 |
| `projects/L3-capability-hub/01-架构设计.md` §6~§11 | 架构已收稳五个核心子域、支撑子域 / 本地引用层、同步 / 异步 / 后台运行承载、依赖角色、truth / snapshot / ref / forbidden body 和关键机制。 | 这些是映射图、分层图和业务 / 分层关系说明的直接来源。 |
| 旧 `projects/L3-capability-hub/02-概要设计.md` / `03-详细设计.md` | 旧材料把 registry / contract / decision / cost / audit、ProviderContract、CapabilityDecision、CostRecord、KMS、QueryCapabilities 和 allow-deny 写成代码主体。 | 本轮只作差异审计,不得从旧 `03` 的目录、对象、service、repo 或 projection 反推当前主体。 |

---

## 3. 整体模块骨架

| 模块 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 架构模块到代码主体 | 将核心子域、支撑子域、本地引用层和运行承载映射为概要层代码主体名。 | 不按旧 provider / cost / query / KMS 主线命名代码主体。 |
| 实现分层 | 说明外部调用、外部事件、运维任务如何进入 Inbound / Operations、Application Services、Domain Model、Ports、Persistence、Projection / Material 和 Collaboration。 | 不写 crate、目录、文件、trait 签名、adapter 实现、event payload 或 job schema。 |
| 业务与分层关系 | 区分“业务主要组成部分说明做什么”和“实现分层说明代码如何安放”。 | 不在本 Step 展开每个组成部分的详细职责与对象候选池,那属于 Step 5。 |
| 关键判断 | 固定哪些名称是业务主要组成部分候选,哪些只是实现分层、外部接缝或技术承载。 | 不把外部系统、相邻仓、技术产品或旧对象名当成本仓内部主体。 |
| 旧材料差异 | 标记旧代码主体框架不得继承的具体原因。 | 不从旧 `02/03` 补当前未闭口字段、接口或目录。 |

---

## 4. 模块思考记录

### 4.1 架构模块映射:先思考

问题回答:

- 架构层已经收稳的五个核心子域可以映射为五组核心业务代码主体:能力身份与接入语境、注册目录与生命周期、接入描述与风险摘要、治理与方法关系、正式暴露与受控消费。
- 支撑子域和本地引用层需要映射为三组支撑代码主体:追溯变化与影响、派生维护与只读输出、外部引用与安全摘要支撑。
- 运行承载中的同步入口、异步协作、后台维护、truth 承载和派生承载不是业务主要组成部分本身,而是这些业务主体落到代码中的实现分层和承载位置。

诊断:

- 旧 `02/03` 把 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`KMS / Vault`、`QueryCapabilities`、allow / deny 和 policy refresh 写进第一层结构,会让 Step 5~9 被旧 provider / cost / decision 主语牵引。
- 新版 `00/01` 已明确 adapter descriptor 不等于 Provider Contract,formal exposure 不等于 QueryCapabilities truth,consumer view 不能反写,secret / KMS、cost / billing、provider runtime 和 governance truth 都不归本仓。

取舍:

- 采用“架构子域 / 支撑层 -> 业务代码主体候选 -> service / domain / port / projection / job 骨架”的映射方式。
- 保留可供 `03` 继续展开的主体名,但不写字段、函数、DTO、event payload、repository 签名或目录路径。

### 4.2 架构模块映射:再写入

#### 架构模块到代码主体映射图

```text
L3-capability-hub
│
├─ 1. 能力身份与接入语境
│   ├─ CapabilityAccessIntakeService        正式承接外部能力接入输入
│   ├─ CapabilityIdentityService            编排 identity 建立 / 更正 / 退役
│   ├─ CapabilityIdentity                   承载稳定能力身份
│   ├─ ExternalCapabilitySourceRef          指向外部 MCP / A2A / API 来源
│   └─ CapabilityAccessReviewFact           表达接入审查事实,不替代治理审批
│
├─ 2. 注册目录与生命周期
│   ├─ CapabilityRegistryService            编排 registry 纳入 / 退出 / 可见性
│   ├─ CapabilityRegistryEntry              承载正式注册目录项
│   ├─ RegistryLifecycleState               表达目录生命周期语义
│   └─ RegistryVisibilityPolicy             约束草稿 / 候选 / 正式可见边界
│
├─ 3. 接入描述与风险摘要
│   ├─ AdapterDescriptorService             编排 descriptor 建立 / 替换 / 读取
│   ├─ AdapterDescriptor                    承载接入方式、能力类型和边界摘要
│   ├─ DescriptorRiskConstraintSummary      承载风险与约束摘要
│   ├─ SecretRef                            指向外部 secret,不保存 secret 正文
│   └─ SecretHandlingSafeSummary            允许的安全处理摘要
│
├─ 4. 治理与方法关系
│   ├─ CapabilityGovernanceSeamService      编排治理结果接缝关系
│   ├─ GovernanceSeamRelation               承载 capability 与治理结果关系
│   ├─ GovernanceResultRef                  指向 governance result / policy result
│   ├─ CapabilityMethodRelationService      编排 capability 与 method asset 关系
│   └─ CapabilityMethodBodyFreeRelation     承载无正文方法资产关系
│
├─ 5. 正式暴露与受控消费
│   ├─ CapabilityExposureService            编排 formal exposure / visibility
│   ├─ FormalExposureBoundary               承载服务端正式暴露边界
│   ├─ FormalVisibilityApplicability        承载正式可见 / 适用性事实
│   ├─ ControlledConsumerViewService        构建受控消费快照
│   └─ ControlledConsumerView               供 runtime / tools / SDK 消费的派生视图
│
├─ 6. 追溯、变化与影响
│   ├─ CapabilityTraceabilityService        编排来源、关系、变化和审计解释
│   ├─ CapabilityAccessTraceabilityRecord   承载接入事实追溯
│   ├─ CapabilityChangeImpactService        编排变化与消费影响解释
│   ├─ CapabilityChangeImpactFact           承载变化 / 影响事实
│   └─ DownstreamConsumptionImpactSummary   承接下游消费影响摘要
│
├─ 7. 派生维护与只读输出
│   ├─ CapabilityDerivedMaintenanceService  编排派生、对账和重建
│   ├─ ConsumerViewRefreshJob               维护受控消费快照
│   ├─ DirectorySearchBrowseProjection      维护目录搜索 / 浏览快照
│   ├─ AuditFriendlyExportSummary           形成审计友好导出摘要
│   └─ ReadOnlyEcosystemDiscoverySummary    形成只读生态发现摘要
│
└─ 8. 外部引用与安全摘要支撑
    ├─ CapabilityReferenceResolutionService  解析外部 ref 与 stale / unresolved 状态
    ├─ ExternalDocumentRef                   指向外部协议 / 标准 / 文档
    ├─ RuntimeToolsConsumerRef               指向 runtime / tools consumer
    ├─ SdkExposureConsumerRef                指向 SDK consumer 边界
    ├─ ObservabilityAuditRef                 指向观测 / 审计材料
    └─ CapabilityAccessEventCollaborationPort 输出已成立事实变化信号
```

关键说明:

- 该图表达架构子域、支撑子域和本地引用层如何映射为概要层代码主体骨架,不是代码目录树。
- `1~5` 承接核心闭环;`6~8` 承接追溯、派生、引用和外围只读支撑,不得反写核心 truth。
- 图中 `Service`、`Policy`、`Fact`、`Ref`、`Summary`、`Projection`、`Job`、`Port` 只是概要层代码主体类别,不是完整 Rust 类型、trait 或实现文件。
- governance approval / Policy truth、method body、secret 正文、provider runtime、execution payload、SDK client、marketplace transaction、cost ledger 和 observability store 不作为本仓内部代码主体。

### 4.3 实现分层:先思考

问题回答:

- 实现分层应从外部调用、外部事件和运维任务进入,通过 Inbound / Operations 统一承接,再由 Application Services 编排核心用例,Domain Model 承载不变量和状态,Ports 隔离外部接缝,Persistence 与 Projection / Material 区分 truth 与派生材料。
- capability-hub 还需要显式保留 Collaboration / External Adapters 层,因为外部 MCP / A2A / API 来源、governance、method-library、runtime / tools、SDK、observability、marketplace 都只能通过 ref、safe summary、relation、controlled view 或事件协作出现。
- 本 Step 可以点名 repository、projection、job、port 和 event collaboration port,但不能定义具体 database、broker、topic、outbox payload、transport 或配置。

诊断:

- 如果 Step 4 按 `Inbound / Application / Domain / Ports` 作为业务主结构,Step 5 会把实现分层误当主要组成部分。
- 如果 Step 4 把 old `provider_service.rs`、`access_service.rs`、`accounting_service.rs` 等旧目录和文件路径写入,后续详细设计会重新回到旧 contract / decision / cost 主线。

取舍:

- 分层图只表达代码主体安放方式和依赖方向。
- 业务主要组成部分仍按 capability access truth 的业务主语组织,不按实现层组织。

### 4.4 实现分层:再写入

#### 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        │
        ▼
┌──────────────────────────────────────────────┐
│ Inbound / Operations                         │
│ command intake / query intake / event intake │
│ maintenance job trigger                      │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Application Services                         │
│ identity / registry / descriptor / seam      │
│ relation / exposure / trace / maintenance    │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Domain Model and Policies                    │
│ identity / registry / descriptor / seam      │
│ relation / exposure / trace / impact         │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Ports                                        │
│ source / governance / method / consumer      │
│ SDK / observability / bus / handoff          │
└───────────────┬────────────────┬─────────────┘
                ▼                ▼
┌────────────────────────┐ ┌────────────────────────┐
│ Persistence             │ │ Projection / Material   │
│ access truth repositories│ │ consumer view / search  │
│ ref stores / trace store │ │ export / discovery      │
└───────────────┬────────┘ └───────────────┬────────┘
                ▼                          ▼
┌──────────────────────────────────────────────┐
│ Collaboration / External Adapters            │
│ L0-core / L0-bus / external source / refs    │
│ safe summary / controlled handoff boundaries │
└──────────────────────────────────────────────┘
```

关键说明:

- 该图表达实现分层和依赖方向,不表达 crate、目录、文件路径、进程、部署拓扑或具体框架。
- `Inbound / Operations` 只负责进入和触发;`Application Services` 负责编排;`Domain Model and Policies` 承载业务不变量。
- `Persistence` 承载正式 truth、引用和追溯记录;`Projection / Material` 只承载 consumer view、search、export、discovery 等派生材料。
- `Collaboration / External Adapters` 只表达跨仓和外部接缝,不得把外部正文、SDK client、runtime execution 或 governance truth 带入本仓。
- 本图不定义 event payload、topic、outbox、repository 签名、job 调度、重试策略或配置项。

### 4.5 业务与分层关系:先思考

问题回答:

- 业务主要组成部分回答“capability-hub 做什么”:能力身份、注册目录、接入描述、治理 / 方法关系、正式暴露、追溯影响、派生维护和外部引用支撑。
- 实现分层回答“代码怎么安放”:入口、应用服务、领域模型、端口、持久化、投影、协作适配。
- 二者不能混用;同一个业务组成部分会跨多个实现分层,同一个实现分层也会服务多个业务组成部分。

诊断:

- 旧材料把 registry、provider contract、decision、cost、metadata、KMS、projection 和 audit 当成并列主结构,其中一部分是旧业务主语,一部分是实现承载,一部分是边界外职责。
- 当前 Step 4 需要先把业务主语和实现层切开,让 Step 5 按业务主要组成部分展开职责与边界,而不是按目录或技术层展开。

取舍:

- 本 Step 只形成业务主要组成部分候选和代码主体安放关系。
- 每个组成部分的详细职责、对象发现线索和接缝说明留给 Step 5。

### 4.6 业务与分层关系:再写入

| 项 | 说明 |
|---|---|
| 业务主要组成部分候选 | 从当前 `00/01` 承接而来的业务结构主语,包括能力身份与接入语境、注册目录与生命周期、接入描述与风险摘要、治理与方法关系、正式暴露与受控消费、追溯变化与影响、派生维护与只读输出、外部引用与安全摘要支撑。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model and Policies、Ports、Persistence、Projection / Material、Collaboration / External Adapters 等代码组织层。 |
| 二者关系 | 业务主要组成部分说明“做什么”;实现分层说明每个业务主体在代码中如何被入口、服务、领域、端口、持久化、投影和外部适配承载。 |
| 使用规则 | Step 5 按业务主要组成部分展开职责与边界;Step 6~9 再从这些业务部分内发现对象、接口、flow 和状态,不能从实现分层直接发明业务对象。 |
| 禁止混用 | `Inbound`、`Persistence`、`Projection`、`Adapter`、`Job`、`Port` 不是业务主要组成部分;`identity`、`registry`、`descriptor`、`seam`、`relation`、`exposure` 也不是目录或文件结构。 |

### 4.7 关键判断

业务主要组成部分候选:

- 能力身份与接入语境。
- 注册目录与生命周期。
- 接入描述与风险摘要。
- 治理与方法关系。
- 正式暴露与受控消费。
- 追溯、变化与影响。
- 派生维护与只读输出。
- 外部引用与安全摘要支撑。

实现分层名称:

- Inbound / Operations。
- Application Services。
- Domain Model and Policies。
- Ports。
- Persistence。
- Projection / Material。
- Collaboration / External Adapters。

必须避免混用的原因:

- 业务主要组成部分决定 Step 5 的职责边界和 Step 6 的对象发现范围。
- 实现分层只是安放代码主体的方式,不能变成业务职责来源。
- 相邻仓、外部系统、技术产品和旧实现机制不能被伪装成本仓内部代码主体。
- 如果把 `QueryCapabilities`、allow / deny、KMS、CostRecord 或 provider runtime 当成业务主体,会直接违反 Step 3 的 forbidden body、formal exposure 分层和边界外职责约束。

### 4.8 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| 旧 `02` 以 registry / contract / decision / cost / audit 五部分作为主结构 | 不继承为当前 Step 4 代码主体框架。 | 新版 `00/01` 已改为 identity、registry、descriptor、seam、relation、exposure、trace / impact 和派生维护主线。 |
| 旧 `ProviderContract` / `ProviderQuota` / `SecretEnvelopeRef` 作为 domain 主体 | 不继承。 | adapter descriptor 只表达接入方式和边界摘要;secret / KMS、quota、route、cost、failover、provider runtime 均不得进入本仓 truth。 |
| 旧 `CapabilityDecision` / `AllowDenyEntry` / `QueryCapabilities` 作为核心主体 | 不继承。 | formal exposure 是服务端 truth;controlled consumer view 只是派生快照,不得把 allow / deny enforcement 或 runtime policy cache 写成本仓真相。 |
| 旧 `CostRecord` / `CapabilityCostSummaryView` / finance 输出作为主体 | 不继承。 | cost / billing / finance ledger 已被正式 `00/01` 裁出本仓职责。 |
| 旧 `KMS / Vault adapters`、`secret_store`、provider lookup、policy refresh、decision cache 目录 | 不继承目录和实现名。 | Step 4 不写目录、文件路径、产品适配和缓存实现;旧实现只能作为历史污染检查。 |
| 旧 `03` 中完整 Rust struct、repo、projection、函数骨架 | 不作为当前输入。 | 旧详细设计尚未重启,且其对象主线与新版 `00/01` 冲突。 |

---

## 5. 结构化中间产物

### 5.1 架构模块到代码主体映射图

见 §4.2。本图是 Step 5 主要组成部分划分和 Step 6 对象发现的上游输入。

### 5.2 实现分层视图

见 §4.4。本图是 Step 7 接口骨架、Step 8 flow 和 Step 12 详细设计承接的实现层输入。

### 5.3 业务主要组成部分与实现分层关系

| 业务主要组成部分候选 | 主要代码主体骨架 | 主要实现层落点 | Step 5 展开提示 |
|---|---|---|---|
| 能力身份与接入语境 | `CapabilityAccessIntakeService`;`CapabilityIdentityService`;`CapabilityIdentity`;`ExternalCapabilitySourceRef`;`CapabilityAccessReviewFact` | Inbound / Application / Domain / Ports / Persistence | 需要说明 identity 如何成立、如何与 external source ref 和 access review fact 分开。 |
| 注册目录与生命周期 | `CapabilityRegistryService`;`CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy` | Application / Domain / Persistence / Projection | 需要说明 registry 与 allowlist、runtime cache、listing、search index 的边界。 |
| 接入描述与风险摘要 | `AdapterDescriptorService`;`AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | Application / Domain / Ports / Persistence | 需要说明 descriptor 与 Provider Contract、secret、provider runtime、quota / route / cost 的边界。 |
| 治理与方法关系 | `CapabilityGovernanceSeamService`;`GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodRelationService`;`CapabilityMethodBodyFreeRelation` | Application / Domain / Ports / Persistence | 需要说明 governance seam 不拥有治理 truth,method relation 不保存 method body。 |
| 正式暴露与受控消费 | `CapabilityExposureService`;`FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerViewService`;`ControlledConsumerView` | Application / Domain / Projection / Ports | 需要说明 formal exposure 与 consumer view、SDK client、runtime allow / deny 的边界。 |
| 追溯、变化与影响 | `CapabilityTraceabilityService`;`CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactService`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | Application / Domain / Persistence / Projection / Collaboration | 需要说明 trace / impact 可解释但不得携带 forbidden body。 |
| 派生维护与只读输出 | `CapabilityDerivedMaintenanceService`;`ConsumerViewRefreshJob`;`DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary` | Operations / Application / Projection / Collaboration | 需要说明派生、搜索、导出、生态发现和审计摘要不得反写核心 truth。 |
| 外部引用与安全摘要支撑 | `CapabilityReferenceResolutionService`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;`CapabilityAccessEventCollaborationPort` | Application / Ports / Persistence / Collaboration | 需要说明 ref / safe summary / event collaboration 的边界,不复制外部正文。 |

### 5.4 关键判断清单

| 判断 | 结论 |
|---|---|
| 是否按旧 provider / decision / cost 主线组织代码主体 | 否。旧主线冲突,只作 historical material。 |
| 是否把 Inbound / Application / Domain / Ports 当成业务主要组成部分 | 否。它们只是实现分层。 |
| 是否需要在 Step 4 点名 service / object / projection / port / job | 是,但只到概要骨架,不写完整契约。 |
| 是否允许 outbox / event / job 细节进入 Step 4 | 只允许点名事件协作和 job 主体类别;不写 topic、payload、outbox 表、调度、重试或补偿算法。 |
| 是否允许旧 `03` 的目录和 Rust 类型作为输入 | 否。旧 `03` 只作差异审计,不得反推当前主体。 |

---

## 6. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` 时回填到 §4,当前不直接修改正式文档。

```md
## 4. 代码主体框架总览

> 校准来源:
> - `design-calibration/02_hld_step_04_code_subject_framework.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_04_code_subject_framework.md` 的“结构化中间产物”“模块思考记录”和“旧材料差异审计”小节,了解代码主体框架如何从架构子域和 Step 3 约束转译而来。

#### 架构模块到代码主体映射图

```text
L3-capability-hub
│
├─ 1. 能力身份与接入语境
│   ├─ CapabilityAccessIntakeService
│   ├─ CapabilityIdentityService
│   ├─ CapabilityIdentity
│   └─ CapabilityAccessReviewFact
│
├─ 2. 注册目录与生命周期
│   ├─ CapabilityRegistryService
│   ├─ CapabilityRegistryEntry
│   └─ RegistryLifecycleState
│
├─ 3. 接入描述与风险摘要
│   ├─ AdapterDescriptorService
│   ├─ AdapterDescriptor
│   └─ DescriptorRiskConstraintSummary
│
├─ 4. 治理与方法关系
│   ├─ CapabilityGovernanceSeamService
│   ├─ GovernanceSeamRelation
│   ├─ CapabilityMethodRelationService
│   └─ CapabilityMethodBodyFreeRelation
│
├─ 5. 正式暴露与受控消费
│   ├─ CapabilityExposureService
│   ├─ FormalExposureBoundary
│   ├─ FormalVisibilityApplicability
│   └─ ControlledConsumerView
│
├─ 6. 追溯、变化与影响
│   ├─ CapabilityTraceabilityService
│   ├─ CapabilityAccessTraceabilityRecord
│   └─ CapabilityChangeImpactFact
│
├─ 7. 派生维护与只读输出
│   ├─ CapabilityDerivedMaintenanceService
│   ├─ ConsumerViewRefreshJob
│   └─ DirectorySearchBrowseProjection
│
└─ 8. 外部引用与安全摘要支撑
    ├─ CapabilityReferenceResolutionService
    ├─ RuntimeToolsConsumerRef
    ├─ SdkExposureConsumerRef
    └─ CapabilityAccessEventCollaborationPort
```

关键说明:
- 该图表达架构子域、支撑子域和本地引用层如何映射为概要层代码主体骨架,不是代码目录树。
- 旧 `ProviderContract / CapabilityDecision / CostRecord / KMS / QueryCapabilities` 不作为当前代码主体。
- 外部正文、SDK client、runtime execution、governance truth、method body、marketplace transaction 和 observability store 不进入本仓内部主体。

#### 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        │
        ▼
┌──────────────────────────────────────────────┐
│ Inbound / Operations                         │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Application Services                         │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Domain Model and Policies                    │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│ Ports                                        │
└───────────────┬────────────────┬─────────────┘
                ▼                ▼
┌────────────────────────┐ ┌────────────────────────┐
│ Persistence             │ │ Projection / Material   │
└───────────────┬────────┘ └───────────────┬────────┘
                ▼                          ▼
┌──────────────────────────────────────────────┐
│ Collaboration / External Adapters            │
└──────────────────────────────────────────────┘
```

关键说明:
- 业务主要组成部分说明做什么,实现分层说明代码如何安放。
- `Persistence` 承载正式 truth、引用和追溯记录;`Projection / Material` 只承载派生材料。
- 本图不定义 crate、目录、文件路径、DTO、event payload、repository 签名、job 调度、部署拓扑或配置项。
```

---

## 7. 待确认事项

### 7.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 4 是否沿用旧 registry / contract / decision / cost / audit 主体 | A. 沿用;B. 不沿用,按新版 `00/01` 主线重建;C. 与新主线并行 | B | 旧主体与 capability access truth、forbidden body 和 formal exposure 分层冲突 | 已确认采用 B |
| Step 4 是否按实现分层作为业务主结构 | A. 是;B. 否,业务主要组成部分和实现分层分开 | B | 概要设计主线必须先表达业务主体,实现分层只说明代码安放方式 | 已确认采用 B |
| Step 4 是否直接给出 crate / module / file path | A. 是;B. 否,只点名代码主体骨架 | B | 代码目录和文件路径属于详细设计 / 实施计划层 | 已确认采用 B |
| Step 4 是否直接定义 event payload、repository trait、DTO 和状态枚举 | A. 是;B. 否,交给后续 Step 与 `03` | B | Step 4 只映射代码主体框架,不能抢占接口、对象、状态和详细契约 | 已确认采用 B |

### 7.2 本 Step 未确认事项

本步不新增阻塞 Step 5 的上游 blocker。以下内容保持为后续 Step / 文档继续闭口:

- 每个业务主要组成部分的详细职责、不承担职责、对象发现线索和接缝。
- `CapabilityAccessIntakeService` 与各业务 service 的具体命令 / 查询 / 事件入口。
- governance seam carrier、method relation summary、descriptor taxonomy、secret safe summary、SDK handoff contract。
- repository、projection、event collaboration port、job 的完整契约。
- 具体 API / DTO / state / storage / config / evidence / implementation boundary。

---

## 8. 进入下一步条件

- 已明确架构模块如何映射为代码主体骨架。
- 已输出 `架构模块到代码主体映射图` 与 `实现分层视图` 两张 ASCII 图。
- 已明确业务主要组成部分候选与实现分层的关系。
- 已说明哪些名称是业务主语,哪些只是实现分层或外部接缝。
- 未提前下沉到代码目录、文件路径、完整 trait / struct、协议 schema、event payload、数据库表、配置项或部署结构。
- 已将旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`KMS / Vault`、`QueryCapabilities`、allow / deny、policy refresh 和 execution gateway 隔离为 historical material。
- 可以进入 Step 5“主要组成部分、职责与边界”。
