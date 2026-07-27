# L3-capability-hub 02 概要 Step 5: 主要组成部分、职责与边界

> 创建日期: 2026-07-09
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 在 Step 4 代码主体框架已经收稳的前提下,按业务主要组成部分收稳职责、非职责、代码主体、对象发现线索和跨组成部分接缝;旧 `ProviderContract / CapabilityDecision / CostRecord / QueryCapabilities / KMS / execution gateway` 只作污染审计,不得作为当前组成部分来源。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 5 主要组成部分、职责与边界 |
| 输出文件 | `design-calibration/02_hld_step_05_components_boundary.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`02_hld_step_01_upstream_boundary.md`;`02_hld_step_02_goals_scope.md`;`02_hld_step_03_constraints.md`;`02_hld_step_04_code_subject_framework.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 5;`概要设计书写规范.md` §4.5 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` 的 `02` Step 5 中间产物 |
| 旧材料处理 | 旧 `02-概要设计.md`、旧 `03-详细设计.md` 和 README 只作后置差异审计 |
| 进入条件 | pass:Step 4 已完成且用户确认进入 Step 5 |
| next_allowed_action | Step 5 已完成,等待用户确认后进入 Step 6。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入组成部分候选判断。 |
| 组成部分候选判断:先思考 | done | 候选来源、采用 / 排除规则 | pass | 进入组成部分总表。 |
| 组成部分总表:再写入 | done | 8 个主要组成部分总表 | pass | 进入能力清单和对象发现。 |
| 功能 / capability 清单 | done | 每个组成部分的功能、输入、输出、状态影响和后续承接 | pass | 进入交互总图。 |
| 各部分交互总图 | done | ASCII 图与关键说明 | pass | 进入逐组成部分小节。 |
| 逐组成部分小循环 | done | 8 个组成部分的职责、代码主体、对象线索、非职责、接缝和停审记录 | pass | 进入跨组成部分闭环审计。 |
| 对象发现维度总表 | done | truth / state / policy / projection / reference / audit 维度候选池 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 旧主体污染审计表 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 §5 回填草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 完成门禁与 Step 6 进入条件 | pass | 等待用户确认 Step 6。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 5 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 5 | Step 5 必须输出组成部分总表、功能 / capability 清单、对象发现维度表、各部分交互总图、每个组成部分独立小节、停审记录和跨组成部分闭环审计。 | 本 Step 必须按主要组成部分逐个收敛,不得把对象字段、接口契约、flow、状态机或配置项提前写入。 |
| `standards/document/概要设计书写规范.md` §4.5 | §5 必须按主要组成部分组织,并为 Step 6 提供 truth / state / policy / projection / reference / audit / history 对象候选池。 | 本 Step 使用固定表格格式,并明确 Step 6 独立展开对象候选。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` | Step 1 已明确 `02` 必须回答主要组成部分、对象候选池、接口、flow、状态和详细设计承接,且旧 `02/03` 只作 historical material。 | Step 5 只承接新版 `00/01` 与 Step 1~4,不从旧对象名反推组成部分。 |
| `design-calibration/02_hld_step_02_goals_scope.md` | Step 2 已确定 `02` 停在可实现结构骨架,排除 runtime execution、governance truth、method body、SDK client、marketplace、secret / KMS、cost / billing、observability store。 | 每个组成部分都必须写清非职责,避免后续组件膨胀。 |
| `design-calibration/02_hld_step_03_constraints.md` | Step 3 已收稳 truth owner 独立、核心轴线可分、数据分层、forbidden body、接缝依赖、sync / async / background 和配置不可越界。 | 组成部分必须围绕 capability access truth 分层,不能把派生、引用或外部正文写成核心 truth。 |
| `design-calibration/02_hld_step_04_code_subject_framework.md` | Step 4 已形成 8 个业务主要组成部分候选,并区分业务主语与实现分层。 | 本 Step 采用这 8 个业务组成部分作为有效展开轴,不新增第 9 个核心组件。 |
| `projects/L3-capability-hub/00-需求文档.md` | `C-CH-1~5`、`FR-CH-001~016`、`BR-CH-001~037` 和数据归属固定 identity、registry、descriptor、governance / method seam、formal exposure / consumer view、trace / impact 主线。 | 功能 / capability 清单必须回指这些主线,不能恢复旧 provider / query / cost / KMS 叙事。 |
| `projects/L3-capability-hub/01-架构设计.md` | 架构已收稳五个核心子域、支撑子域 / 本地引用层、运行承载、依赖方向、数据边界和交互分层。 | 组成部分边界必须与核心子域、支撑子域和本地引用层保持一致。 |
| `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md` | 参考其按组成部分输出对象候选池、交互总图、逐组件小节和停审记录的粒度。 | 只参考结构密度,不复制 governance 领域结论。 |
| `projects/L3-method-library/design-calibration/02_hld_step_05_components_boundary.md` | 参考其在 Step 5 中补齐 capability、对象来源、下游承接矩阵和旧材料污染审计的深度。 | 本 Step 也要显式保护 Step 6~9 来源链路,避免后续对象 / 接口 / 状态悬空。 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面,本仓应被划分为哪些主要组成部分?

当前 `L3-capability-hub` 在概要设计层面划分为 8 个主要组成部分:

1. 能力身份与接入语境
2. 注册目录与生命周期
3. 接入描述与风险摘要
4. 治理与方法关系
5. 正式暴露与受控消费
6. 追溯、变化与影响
7. 派生维护与只读输出
8. 外部引用与安全摘要支撑

这些是业务结构主语,不是代码目录、类名、函数名、外部系统或实现分层。`Inbound / Operations`、`Application Services`、`Domain Model and Policies`、`Ports`、`Persistence`、`Projection / Material` 和 `Collaboration / External Adapters` 只说明代码安放方式,不作为本 Step 的主要组成部分。

### 3.2 每个主要组成部分分别承担什么职责?

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 能力身份与接入语境 | 建立外部 MCP / A2A / API 能力的正式接入语境、稳定 identity、来源引用和接入审查事实。 | `CapabilityAccessIntakeService`;`CapabilityIdentityService`;`CapabilityIdentity`;`ExternalCapabilitySourceRef`;`CapabilityAccessReviewFact` | 不执行外部调用,不托管认证或 provider runtime,不替代 governance approval。 |
| 注册目录与生命周期 | 将已识别能力纳入受控 registry,维护 entry、生命周期、可见性和目录维护事实。 | `CapabilityRegistryService`;`CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy` | 不做 allowlist、runtime cache、marketplace listing、search truth 或执行状态。 |
| 接入描述与风险摘要 | 建立 adapter descriptor、能力类型、接入方式、风险 / 约束摘要、secret ref 和安全摘要边界。 | `AdapterDescriptorService`;`AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | 不保存 secret 正文,不实现 KMS / Vault,不拥有 quota、route、cost、failover 或 provider runtime contract。 |
| 治理与方法关系 | 维护 capability 与治理结果的 seam relation、接入审查 / 治理职责分离、body-free method relation。 | `CapabilityGovernanceSeamService`;`GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodRelationService`;`CapabilityMethodBodyFreeRelation` | 不执行 approval,不拥有 Policy truth / shared_rules,不保存 method body 或方法版本正文。 |
| 正式暴露与受控消费 | 维护服务端 formal exposure、正式可见 / 适用边界和供 runtime / tools / SDK 消费的受控视图。 | `CapabilityExposureService`;`FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerViewService`;`ControlledConsumerView` | 不实现 SDK client、runtime loop、tools execution、allow / deny enforcement 或 QueryCapabilities truth。 |
| 追溯、变化与影响 | 解释 capability access truth 的来源、变化、消费影响和审计 / handoff 语义。 | `CapabilityTraceabilityService`;`CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactService`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | 不拥有 observability store、audit log store、cost ledger、runtime execution payload 或下游状态 truth。 |
| 派生维护与只读输出 | 维护 consumer view、search / browse、export、生态发现和审计友好摘要等可重建派生材料。 | `CapabilityDerivedMaintenanceService`;`ConsumerViewRefreshJob`;`DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary` | 不创造或更正 identity、registry、descriptor、seam、relation、exposure truth。 |
| 外部引用与安全摘要支撑 | 解析和维护外部来源、治理、方法、下游、SDK、observability、external document 等 ref / safe summary 的本地支撑语义。 | `CapabilityReferenceResolutionService`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;`CapabilityAccessEventCollaborationPort` | 不保存外部正文,不替代来源仓生命周期,不定义事件 payload、topic、adapter 实现或外部系统 truth。 |

### 3.3 哪些内容虽然相关,但必须由相邻部分或边界外能力承担?

| 相关内容 | 归属 | 本仓正确处理方式 |
|---|---|---|
| runtime execution、tools execution、外部 MCP / A2A / API 实际调用和调用结果 | `L2-runtime` / `L2-tools` | 本仓只提供 formal exposure、controlled consumer view、descriptor 摘要和变化感知。 |
| governance approval、Policy effective fact、shared_rules truth 和治理执行状态 | `L1-governance` | 本仓只保存 governance result ref、policy result ref、允许 safe summary 和 seam relation。 |
| Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef、method version body | `L3-method-library` | 本仓只保存 method asset ref 和 body-free relation。 |
| SDK client、多语言 binding、package、client cache、developer experience | `L0-sdk` | 本仓只维护服务端 exposure boundary 和 SDK consumer ref。 |
| secret 正文、KMS / Vault truth、API key 生命周期 | 安全基础设施 / secret 平台 | 本仓只保存 secret ref 和不含正文的 safe summary。 |
| marketplace listing、transaction、pricing、fulfillment | `L6-marketplace` | 本仓最多形成只读生态发现摘要或 marketplace object ref。 |
| observability log / trace / metric / alert / audit store | `L4-observability` | 本仓只输出审计友好摘要、业务追溯或 observability / audit ref。 |
| provider runtime、quota、route、failover、retry、cost / billing | runtime / provider orchestration / finance future | 本仓不得把这些写入 descriptor、registry 或 exposure truth。 |

### 3.4 哪些候选对象必须进入 Step 6 独立成节展开?

Step 6 必须从本 Step 对象候选池中正式筛选并独立展开以下候选:

- truth / state:`CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityRegistryEntry`;`RegistryLifecycleState`;`AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`GovernanceSeamRelation`;`CapabilityMethodBodyFreeRelation`;`FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerView`;`CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`ReferenceResolutionState`
- policy / invariant:`CapabilityIdentityPolicy`;`RegistryVisibilityPolicy`;`DescriptorBoundaryPolicy`;`GovernanceSeamPolicy`;`MethodRelationBoundaryPolicy`;`FormalExposurePolicy`;`ConsumerViewFreshnessPolicy`;`DerivedMaterialPolicy`;`ReferenceResolutionPolicy`
- projection / read model:`DirectorySearchBrowseProjection`;`ControlledConsumerView`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`
- reference / boundary:`ExternalCapabilitySourceRef`;`GovernanceResultRef`;`MethodAssetRef`;`SecretRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;`ExternalDocumentRef`
- audit / history:`CapabilityIdentityChangeRecord`;`RegistryChangeRecord`;`DescriptorChangeRecord`;`GovernanceSeamChangeRecord`;`MethodRelationChangeRecord`;`CapabilityExposureChangeRecord`;`CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`

Repository、port、adapter、trigger、DTO、HTTP body、CloudEvent schema、database table、job runner 和 SDK client 不在 Step 6 默认作为领域对象展开;它们后续进入 Step 7、Step 8 或 `03-详细设计.md`。

---

## 4. 模块思考记录

### 4.1 组成部分候选判断:先思考

问题回答:

- Step 4 已给出 8 个业务主要组成部分候选,这些候选完整覆盖 `C-CH-1~5` 与 Step 3 约束,不需要新增新的业务组件。
- 支撑能力应作为第 6~8 个组成部分保留,因为 trace / impact、派生维护、external ref / safe summary 是后续对象、接口、flow、状态和异常边界的真实来源,不能被压缩成“辅助工具”。
- 运行承载、同步入口、异步协作、后台任务、repository、projection 和 adapter 只能作为代码主体或实现层,不得成为本 Step 的业务组成部分。

诊断:

- 若按旧 `registry / contract / decision / cost / audit` 划分,descriptor 会退回 ProviderContract,formal exposure 会退回 QueryCapabilities,governance seam 会退回 policy refresh / allow-deny,trace / impact 会退回 audit store。
- 若把派生维护和外部引用完全并入核心五部分,Step 6 会缺少 projection、safe summary、reference resolution、consumer view freshness 和 handoff 的对象发现入口。
- 若把它们升级为核心 truth,又会违反 Step 3 的派生不得反写和 forbidden body 约束。

取舍:

- 保留 Step 4 的 8 个组成部分作为 Step 5 正式展开轴。
- 每个组成部分必须写 capability 清单、对象发现线索、非职责、接缝和停审记录。
- 对对象候选采用“进入 Step 6 候选池,不在 Step 5 定义字段 / 函数 / 状态迁移”的表达深度。

### 4.2 组成部分总表:再写入

见 §5.1。本表作为正式 §5 的主表草稿和 Step 6 对象候选池的上游索引。

### 4.3 各部分交互总图:先思考

问题回答:

- 交互总图必须表达主要组成部分之间的大体流向:外部接入语境先形成 identity,registry 与 descriptor 围绕 identity 成立,governance / method relation 与正式 exposure 形成正式消费前提,trace / impact 解释变化,derived / reference support 支撑只读与外部接缝。
- 图不能表达 API path、event topic、job 调度、repository 调用、数据库事务或完整时序。
- 由于 Step 5 已有 8 个组成部分,总图足以表达跨部分关系;本轮不补局部接缝图,避免把 seam / relation 提前写成接口契约。

取舍:

- 使用一张总图表达主线和支撑关系。
- 局部接缝细节留到 Step 7 / Step 8。

### 4.4 对象发现:先思考

问题回答:

- 对象发现必须按 truth / state、policy / invariant、projection / read model、reference / boundary、audit / history 维度进行,否则 Step 6 容易只得到一张对象名列表。
- identity、registry、descriptor、seam、relation、exposure、trace / impact 是本仓 truth / relation 主轴;consumer view、search / browse、export、ecosystem discovery 是 projection / snapshot;governance result、method asset、secret、runtime / tools、SDK、observability、external document 都是 ref 或 allowed safe summary。
- Step 6 要判断哪些候选正式成为关键对象,哪些只是字段类型、port、repository、DTO、job 或详细设计材料。

取舍:

- 本 Step 将候选对象放入维度表和各组成部分对象发现线索。
- 不定义对象字段、成员函数、工厂函数或状态枚举。

---

## 5. 结构化中间产物

### 5.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 能力身份与接入语境 | 建立外部能力的正式接入语境、稳定 identity、来源引用和接入审查事实。 | `CapabilityAccessIntakeService`;`CapabilityIdentityService`;`CapabilityIdentity`;`ExternalCapabilitySourceRef`;`CapabilityAccessReviewFact` | 外部调用执行、provider runtime、全局认证、governance approval。 |
| 注册目录与生命周期 | 维护 registry entry、生命周期、正式可见性前置语义和目录维护事实。 | `CapabilityRegistryService`;`CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy` | allowlist、runtime cache、marketplace listing、搜索 truth、执行状态。 |
| 接入描述与风险摘要 | 维护 adapter descriptor、能力类型、接入方式、风险 / 约束摘要和 secret safe boundary。 | `AdapterDescriptorService`;`AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | Provider Contract、secret 平台、KMS / Vault、quota、route、cost、provider runtime。 |
| 治理与方法关系 | 维护 governance seam relation、接入审查 / 治理职责分离和 capability-method body-free relation。 | `CapabilityGovernanceSeamService`;`GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodRelationService`;`CapabilityMethodBodyFreeRelation` | governance approval、Policy truth、shared_rules truth、method body、method version truth。 |
| 正式暴露与受控消费 | 维护 formal exposure、formal visibility / applicability 和 controlled consumer view 分层。 | `CapabilityExposureService`;`FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerViewService`;`ControlledConsumerView` | SDK client、runtime loop、tools execution、allow / deny enforcement、QueryCapabilities truth。 |
| 追溯、变化与影响 | 维护 access traceability、change / impact fact、消费影响摘要和审计 / handoff 解释。 | `CapabilityTraceabilityService`;`CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactService`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | observability store、audit log store、runtime execution payload、cost ledger、下游状态 truth。 |
| 派生维护与只读输出 | 维护 consumer view、search / browse、export、只读生态发现和审计友好摘要等派生材料。 | `CapabilityDerivedMaintenanceService`;`ConsumerViewRefreshJob`;`DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary` | 创造或更正核心接入 truth、审批、执行、交易、观测存储。 |
| 外部引用与安全摘要支撑 | 解析和维护 external source、governance、method、secret、downstream、SDK、observability、external document 等 ref / safe summary。 | `CapabilityReferenceResolutionService`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;`CapabilityAccessEventCollaborationPort` | 外部正文、来源仓生命周期、adapter 实现、event payload、topic、外部系统 truth。 |

### 5.2 功能 / capability 清单

| 组成部分 | 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|---|
| 能力身份与接入语境 | 外部能力接入语境建立 | 外部 MCP / A2A / API 来源线索;管理输入;`L0-core` ref 基线 | 接入语境和 identity 建立请求结果 | identity 候选 accepted / rejected / pending / unresolved 语义线索 | Step 6 对象;Step 7 command;Step 8 flow;Step 9 state |
| 能力身份与接入语境 | capability identity 稳定识别 / 更正 / 退役 | 已承接接入语境;外部来源 ref;更正或退役原因 | 稳定 `CapabilityIdentity` 或显式变化结果 | identity 建立、合并、拆分、更正、退役变化线索 | Step 6 / 8 / 9 |
| 能力身份与接入语境 | 接入身份风险解释与审查事实 | 外部能力来源、descriptor 线索、接入审查输入 | `CapabilityAccessReviewFact` 和风险解释 | 审查事实可追溯,但不替代治理审批 | Step 6 / 8 / 10 |
| 注册目录与生命周期 | registry 纳入 / 退出 | 稳定 identity;目录管理输入 | `CapabilityRegistryEntry` 变化结果 | registry accepted / rejected / pending / retired 线索 | Step 6 / 7 / 8 / 9 |
| 注册目录与生命周期 | 生命周期和可见性语义维护 | registry entry;治理 / descriptor / exposure 前置线索 | lifecycle / visibility 语义 | 草稿、未描述、未治理、正式可见、退出等状态候选 | Step 6 / 9 |
| 注册目录与生命周期 | registry maintenance / reconciliation | 正式 registry truth;派生材料;对账触发 | 维护结果和对账摘要 | 不创造新业务结论,只标记 stale / rebuilt / inconsistent | Step 7 job;Step 8 flow;Step 10 exception |
| 接入描述与风险摘要 | adapter descriptor 建立 / 替换 | registry entry;外部 MCP / A2A / API 来源;协议 / 标准 ref | `AdapterDescriptor` 建立或替换结果 | descriptor accepted / rejected / unresolved 线索 | Step 6 / 7 / 8 / 9 |
| 接入描述与风险摘要 | 风险 / 约束摘要维护 | descriptor;接入审查输入;安全边界线索 | `DescriptorRiskConstraintSummary` | 风险解释变化,不形成 governance truth | Step 6 / 8 / 10 |
| 接入描述与风险摘要 | secret ref / safe summary 承接 | 外部 secret ref;允许安全摘要 | `SecretRef`;`SecretHandlingSafeSummary` | secret summary unresolved / unavailable 可显式表达 | Step 6 / 10 / 11 |
| 治理与方法关系 | governance seam 挂接 / 替换 / 失效 | governance result ref / policy result ref / safe summary | `GovernanceSeamRelation` 变化结果 | pending / unresolved / forbidden / expired 线索 | Step 6 / 7 / 8 / 9 |
| 治理与方法关系 | 接入审查与治理职责分离 | access review fact;governance result ref | 职责分离事实和读取解释 | 审查事实不得提升为 approval | Step 6 / 8 / 10 |
| 治理与方法关系 | capability-method body-free relation | method asset ref;capability identity / registry / descriptor | `CapabilityMethodBodyFreeRelation` 变化结果 | relation active / removed / unresolved 线索 | Step 6 / 7 / 8 / 9 |
| 正式暴露与受控消费 | formal exposure boundary 变更 | registry、descriptor、governance seam、method relation 前置事实 | `FormalExposureBoundary` | exposure accepted / pending / unavailable / retired 线索 | Step 6 / 7 / 8 / 9 |
| 正式暴露与受控消费 | formal visibility / applicability 表达 | registry lifecycle;governance result;exposure boundary | `FormalVisibilityApplicability` | 正式可见、适用、不可见、挂起语义 | Step 6 / 9 |
| 正式暴露与受控消费 | controlled consumer view 构建 | formal exposure;descriptor summary;downstream consumer ref | `ControlledConsumerView` | consumer view ready / stale / rebuilding / unavailable | Step 6 / 7 / 8 / 9 |
| 追溯、变化与影响 | 接入事实追溯 | identity、registry、descriptor、seam、relation、exposure 变化 | `CapabilityAccessTraceabilityRecord` | 形成审计和解释链路 | Step 6 / 8 / 10 |
| 追溯、变化与影响 | capability change / consumer impact 解释 | 正式 truth 变化;下游消费影响摘要 | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | 下游 partial / delayed / ignored 不回滚 truth | Step 6 / 8 / 9 / 10 |
| 追溯、变化与影响 | audit-friendly handoff 解释 | traceability record;observability / audit ref | 可交接摘要或 ref | 只输出摘要或 ref,不拥有 audit store | Step 6 / 7 / 8 |
| 派生维护与只读输出 | consumer view refresh | formal exposure;controlled consumer view 来源 truth | 刷新后的 consumer view | stale / rebuilding / failed / ready 维护线索 | Step 7 job;Step 8 flow;Step 9 |
| 派生维护与只读输出 | directory search / browse projection | registry / descriptor / exposure truth | 搜索 / 浏览快照 | 可重建且不得反写真相 | Step 6 projection;Step 7 query;Step 8 job |
| 派生维护与只读输出 | export / ecosystem discovery summary | access truth;allowed refs;safe summary | 审计导出摘要;只读生态发现摘要 | partial / unavailable / stale 线索 | Step 6 / 7 / 8 / 10 |
| 外部引用与安全摘要支撑 | 外部 ref 解析与状态维护 | external source、governance、method、secret、consumer、SDK、observability、external document ref | `ReferenceResolutionState` 和解析摘要 | resolved / unresolved / stale / invalid | Step 6 / 8 / 9 / 10 |
| 外部引用与安全摘要支撑 | 安全摘要与 external document 支撑 | secret safe summary;external standard / protocol / document ref | allowed safe summary / external document ref | 不保存正文,缺失时显式 unresolved | Step 6 / 10 / 11 |
| 外部引用与安全摘要支撑 | 事件协作边界支撑 | capability access fact 变化;`L0-bus` 协作边界 | event collaboration intent / handoff ref | 不定义 topic / payload;传播失败不回滚 truth | Step 7 event;Step 8 flow;Step 10 |

### 5.3 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| 能力身份与接入语境 | `CapabilityIdentity`;`CapabilityAccessReviewFact` | `CapabilityIdentityPolicy` | identity summary 线索 | `ExternalCapabilitySourceRef` | `CapabilityIdentityChangeRecord` | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` |
| 注册目录与生命周期 | `CapabilityRegistryEntry`;`RegistryLifecycleState` | `RegistryVisibilityPolicy` | registry visibility summary 线索 | identity ref;governance precondition ref | `RegistryChangeRecord` | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` |
| 接入描述与风险摘要 | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretHandlingSafeSummary` | `DescriptorBoundaryPolicy` | descriptor read summary 线索 | `SecretRef`;`ExternalDocumentRef`;external source ref | `DescriptorChangeRecord` | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` |
| 治理与方法关系 | `GovernanceSeamRelation`;`CapabilityMethodBodyFreeRelation` | `GovernanceSeamPolicy`;`MethodRelationBoundaryPolicy` | seam / relation summary 线索 | `GovernanceResultRef`;`MethodAssetRef` | `GovernanceSeamChangeRecord`;`MethodRelationChangeRecord` | `GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodBodyFreeRelation`;`GovernanceSeamPolicy`;`MethodRelationBoundaryPolicy` |
| 正式暴露与受控消费 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerView` | `FormalExposurePolicy`;`ConsumerViewFreshnessPolicy` | `ControlledConsumerView` | `RuntimeToolsConsumerRef`;`SdkExposureConsumerRef` | `CapabilityExposureChangeRecord` | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerView`;`FormalExposurePolicy`;`ConsumerViewFreshnessPolicy` |
| 追溯、变化与影响 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | trace / impact consistency policy 线索 | impact summary view 线索 | `ObservabilityAuditRef`;downstream consumer ref | trace / impact record 线索 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary`;`ObservabilityAuditRef` |
| 派生维护与只读输出 | derived material freshness state 线索 | `DerivedMaterialPolicy` | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | projection source refs;marketplace ecosystem object ref | rebuild / export history 线索 | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`;`DerivedMaterialPolicy` |
| 外部引用与安全摘要支撑 | `ReferenceResolutionState` | `ReferenceResolutionPolicy` | reference resolution summary 线索 | `ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;external capability source / governance / method / secret refs | reference refresh history 线索 | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef` |

### 5.4 各部分交互总图

```text
+=============================================================================+
|                    L3-capability-hub component flow                          |
+=============================================================================+
|                                                                             |
|  外部 MCP / A2A / API 来源                                                   |
|          |                                                                  |
|          v                                                                  |
|  +-------+-------------------+                                              |
|  | 1. 能力身份与接入语境      |                                              |
|  +-------+-------------------+                                              |
|          | identity / source ref / review fact                              |
|          v                                                                  |
|  +-------+-------------------+        +----------------------------------+  |
|  | 2. 注册目录与生命周期      |------->| 3. 接入描述与风险摘要            |  |
|  +-------+-------------------+        +----------------+-----------------+  |
|          | registry / lifecycle                         | descriptor       |
|          +--------------------------+-------------------+                  |
|                                     v                                      |
|  +-------------------------------+  |  +----------------------------------+  |
|  | 4. 治理与方法关系             |<-+->| 5. 正式暴露与受控消费            |  |
|  +----------------+--------------+     +----------------+-----------------+  |
|                   | seam / relation                       | exposure/view   |
|                   v                                       v                |
|  +----------------+--------------+     +----------------+-----------------+  |
|  | 6. 追溯、变化与影响           |<--->| 7. 派生维护与只读输出            |  |
|  +----------------+--------------+     +----------------+-----------------+  |
|                   ^                                       |                |
|                   | ref / safe summary / handoff          | read-only       |
|  +----------------+---------------------------------------+--------------+  |
|  | 8. 外部引用与安全摘要支撑                                      |  |
|  +----------------------------------------------------------------+  |
|                                                                             |
+=============================================================================+
```

关键说明:

- 图表达 8 个主要组成部分之间的大体交互和交接方向,不是 API 调用顺序、事件时序、数据库事务或实现部署图。
- 能力身份、注册目录和接入描述构成本仓 capability access truth 的前段;治理 / 方法关系与正式暴露把接入事实推向正式消费边界。
- 追溯 / 影响、派生维护和外部引用支撑横跨多部分,但只能解释、派生、解析和交接,不得反写核心 truth。
- 图中未表达完整协议字段、HTTP path、topic、payload、repository、job 调度、adapter 实现或状态迁移。

---

## 6. 各主要组成部分

### 6.1 能力身份与接入语境

#### 6.1.1 本部分职责

能力身份与接入语境负责把一个外部 MCP / A2A / API 能力从散落 URL、provider 名、工具配置或运行配置中抽离出来,形成本仓可引用、可审查、可注册、可描述和可被下游消费的稳定 capability identity。它还负责保存外部来源引用和身份层接入审查事实,让高风险外部连接在进入 registry 或 exposure 前先有可解释语境。

本部分是 `C-CH-1` 和 `FR-CH-001~003` 的概要承接点,也是 registry、descriptor、governance seam、method relation 和 formal exposure 的前置锚点。

#### 6.1.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 接入语境建立 | 外部来源线索;管理输入;`L0-core` ref 基线 | capability access intake result | accepted / rejected / pending / unresolved 语义线索 | Step 7 command;Step 8 flow |
| identity 稳定识别 | 接入语境;external source ref;身份判断材料 | `CapabilityIdentity` | identity 建立、合并、拆分、更正、退役候选状态 | Step 6 / 9 |
| 身份风险解释 | 外部连接主体说明;接入审查输入;descriptor 前置信息 | `CapabilityAccessReviewFact` | 风险解释变化可追溯,不替代治理审批 | Step 6 / 10 |

#### 6.1.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityAccessIntakeService` | application service | 承接外部能力接入输入,编排接入语境建立和前置裁定 | Step 8 |
| `CapabilityIdentityService` | application service | 编排 identity 建立、更正、合并、拆分、退役和引用一致性检查 | Step 8 |
| `CapabilityIdentity` | domain object | 承载稳定 capability identity 和身份锚点语义 | Step 6 |
| `ExternalCapabilitySourceRef` | reference object | 指向外部 MCP / A2A / API 来源,不保存外部正文或 provider runtime | Step 6 |
| `CapabilityAccessReviewFact` | domain fact / audit fact | 表达接入审查事实、风险解释和职责分离线索 | Step 6 |
| `CapabilityIdentityPolicy` | policy | 约束身份建立、合并、拆分、更正和退役不得被消费面隐式触发 | Step 6 |

#### 6.1.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CapabilityIdentity` | Step 6 独立成节 |
| Truth / State | `CapabilityAccessReviewFact` | Step 6 独立成节 |
| Policy / Invariant | `CapabilityIdentityPolicy` | Step 6 独立成节 |
| Reference / Boundary | `ExternalCapabilitySourceRef` | Step 6 独立成节 |
| Audit / History | `CapabilityIdentityChangeRecord` | Step 6 独立成节或并入 identity history 判断 |

#### 6.1.5 本部分不承担什么

- 不执行外部 MCP / A2A / API 调用。
- 不拥有 provider runtime、URL 健康检查、调用结果、quota、route、failover、retry 或 cost。
- 不拥有全局认证、actor identity、service account 或平台权限 truth。
- 不替代 `L1-governance` 的 approval / Policy truth。
- 不把接入审查事实写成 allow / deny enforcement。

#### 6.1.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 注册目录与生命周期 | 提供稳定 identity 和接入语境作为 registry entry 前置。 | registry 不得倒推 identity。 |
| 接入描述与风险摘要 | 提供 external source ref 和身份风险语境,供 descriptor 建立。 | descriptor 不得把 provider runtime 写回 identity。 |
| 治理与方法关系 | 提供 identity 作为 seam relation 和 method relation 的 capability 端。 | governance / method 只引用 identity,不重定义 identity。 |
| 正式暴露与受控消费 | 提供 exposure 的 capability anchor。 | consumer view 不得隐式合并、拆分或更正 identity。 |
| 外部引用与安全摘要支撑 | 使用 source ref 解析、stale / unresolved 状态和外部文档引用。 | 引用解析失败不得补造 identity。 |

#### 6.1.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖接入语境、identity 和身份风险解释。 |
| 候选对象是否有功能来源 | pass | 对象回指 `FR-CH-001~003`、`BR-CH-001/010/020`。 |
| 接缝是否清楚 | pass | 与 registry、descriptor、seam、exposure 和 reference support 分开。 |
| 禁止事项是否清楚 | pass | execution、provider runtime、governance approval 和认证 truth 均排除。 |
| 是否越界 | pass | 未写字段、接口 schema、状态迁移或外部调用实现。 |

### 6.2 注册目录与生命周期

#### 6.2.1 本部分职责

注册目录与生命周期负责把稳定 identity 纳入正式 capability registry,维护 registry entry、生命周期语义、可见性前置条件和目录维护 / 对账事实。它让外部能力从单个接入语境进入可管理、可查看、可维护的正式目录,同时明确目录不是 runtime allowlist、availability bit、marketplace listing 或搜索索引。

本部分承接 `C-CH-2`、`FR-CH-004~006` 和 `FR-CH-015~016` 的 registry 侧语义,并为 formal visibility、consumer view、search / browse 派生和变化协作提供上游 truth。

#### 6.2.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| registry 纳入 / 退出 | 稳定 identity;管理输入;前置检查结果 | `CapabilityRegistryEntry` 变化结果 | accepted / rejected / pending / retired 语义线索 | Step 6 / 7 / 8 / 9 |
| 生命周期语义维护 | registry entry;descriptor / governance / exposure 前置线索 | `RegistryLifecycleState` | draft / undescribed / ungoverned / formal-visible / retired 等候选 | Step 6 / 9 |
| registry visibility policy | registry entry;formal visibility 前置条件 | visibility 判断结果 | 不把本地目录状态当治理结果 | Step 6 / 8 |
| registry maintenance / reconciliation | registry truth;派生视图;维护触发 | 维护 / 对账结果摘要 | stale / rebuilding / inconsistent / reconciled 维护线索 | Step 7 / 8 / 10 |

#### 6.2.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityRegistryService` | application service | 编排 registry 纳入、退出、生命周期语义变化和可见性维护 | Step 8 |
| `CapabilityRegistryEntry` | domain object | 承载正式注册目录项和 identity 绑定语义 | Step 6 |
| `RegistryLifecycleState` | domain state | 表达目录生命周期和正式可见前置状态族 | Step 6 / Step 9 |
| `RegistryVisibilityPolicy` | policy | 约束草稿、候选、未描述、未治理、正式可见和退出语义 | Step 6 |
| `RegistryChangeRecord` | audit / history | 记录 registry 纳入、退出、可见性和维护变化 | Step 6 |
| `CapabilityReconciliationReport` | projection / report | 表达目录对账结果和维护解释,不反写 truth | Step 6 / Step 8 |

#### 6.2.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CapabilityRegistryEntry` | Step 6 独立成节 |
| Truth / State | `RegistryLifecycleState` | Step 6 独立成节,Step 9 继续收敛状态 |
| Policy / Invariant | `RegistryVisibilityPolicy` | Step 6 独立成节 |
| Projection / Read model | registry visibility summary;`CapabilityReconciliationReport` | Step 6 判断是否独立 |
| Reference / Boundary | identity ref;governance precondition ref | Step 6 判断为引用或字段类型 |
| Audit / History | `RegistryChangeRecord` | Step 6 独立成节或并入 registry history 判断 |

#### 6.2.5 本部分不承担什么

- 不等同 runtime allowlist、tool availability cache、provider lookup cache 或 capability whitelist。
- 不拥有 marketplace listing、定价、交易、履约或生态运营 truth。
- 不把搜索、浏览、导出或管理 UI 状态写成 registry truth。
- 不通过维护任务创造新的 registry entry 或更正 identity。
- 不保存执行状态、外部调用结果或运行健康状态作为目录生命周期。

#### 6.2.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 能力身份与接入语境 | registry entry 必须锚定稳定 `CapabilityIdentity`。 | 不得先创建 registry 后倒推 identity。 |
| 接入描述与风险摘要 | registry entry 为 descriptor 建立提供正式能力主体。 | 未描述状态不得伪装成正式 descriptor 完整。 |
| 治理与方法关系 | registry visibility 可读取 governance seam 前置结果。 | registry 本地状态不得替代 governance approval。 |
| 正式暴露与受控消费 | formal exposure 只基于已满足前置的 registry / descriptor / seam。 | consumer view 不得把未治理或未描述能力暴露为正式能力。 |
| 派生维护与只读输出 | 提供 search / browse / reconciliation 来源 truth。 | search / browse 不得反写 registry。 |

#### 6.2.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖 registry 纳入 / 退出、生命周期、可见性和维护。 |
| 候选对象是否有功能来源 | pass | 回指 `FR-CH-004~006/015/016` 和 `BR-CH-002/003/021/034`。 |
| 接缝是否清楚 | pass | registry 与 identity、descriptor、seam、exposure、projection 分层。 |
| 禁止事项是否清楚 | pass | allowlist、runtime cache、listing、search truth 和维护反写均排除。 |
| 是否越界 | pass | 未写数据库表、索引、查询接口或完整状态机。 |

### 6.3 接入描述与风险摘要

#### 6.3.1 本部分职责

接入描述与风险摘要负责为已注册能力建立 adapter descriptor,说明外部能力的接入方式、能力类型、约束摘要、风险解释、secret ref 和允许的安全摘要边界。它把旧 `ProviderContract` 重裁为 descriptor truth,并明确 descriptor 不是 provider runtime contract、secret 容器、quota / route / cost 合同或调用协议正文。

本部分承接 `C-CH-3`、`FR-CH-007~009` 和 `FR-CH-E04`,并为审查、formal exposure、consumer view、SDK exposure 和 traceability 提供可解释描述。

#### 6.3.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| adapter descriptor 建立 / 替换 | registry entry;external source ref;接入方式说明 | `AdapterDescriptor` 变化结果 | accepted / rejected / unresolved / retired 线索 | Step 6 / 7 / 8 / 9 |
| 能力类型与接入边界摘要 | descriptor 输入;external document ref;协议 / 标准线索 | descriptor type / boundary summary | 类型和边界变化可追溯 | Step 6 / 8 |
| 风险 / 约束摘要维护 | 接入审查输入;安全边界;descriptor | `DescriptorRiskConstraintSummary` | 风险摘要变化不替代 governance policy | Step 6 / 10 |
| secret ref / safe summary 维护 | secret ref;允许安全摘要来源 | `SecretRef`;`SecretHandlingSafeSummary` | unresolved / unavailable / forbidden 线索 | Step 6 / 10 / 11 |

#### 6.3.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `AdapterDescriptorService` | application service | 编排 descriptor 建立、替换、读取和边界检查 | Step 8 |
| `AdapterDescriptor` | domain object | 承载接入方式、能力类型和边界摘要 | Step 6 |
| `DescriptorRiskConstraintSummary` | domain fact / summary | 承载 descriptor 相关风险、约束和敏感边界摘要 | Step 6 |
| `SecretRef` | reference object | 指向外部 secret 或安全凭据来源,不保存正文 | Step 6 |
| `SecretHandlingSafeSummary` | safe summary / snapshot | 表达允许展示的 secret 处理摘要和敏感边界 | Step 6 |
| `DescriptorBoundaryPolicy` | policy | 约束 descriptor 不得吸收 provider runtime、secret 正文、quota、route、cost 或 failover | Step 6 |

#### 6.3.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretHandlingSafeSummary` | Step 6 独立成节或在 descriptor 组内筛选 |
| Policy / Invariant | `DescriptorBoundaryPolicy` | Step 6 独立成节 |
| Projection / Read model | descriptor read summary 线索 | Step 6 判断是否并入 controlled view |
| Reference / Boundary | `SecretRef`;`ExternalDocumentRef`;external source ref | `SecretRef` 与 `ExternalDocumentRef` 进入 Step 6 候选 |
| Audit / History | `DescriptorChangeRecord` | Step 6 独立成节或并入 descriptor history 判断 |

#### 6.3.5 本部分不承担什么

- 不保存 provider API key、token、password、private key 或 secret 正文。
- 不实现 KMS / Vault、secret rotation、credential lifecycle 或 secret access policy。
- 不拥有 provider runtime、quota、route、cost、failover、retry、routing 或 invocation contract。
- 不写完整 MCP / A2A / API request / response schema。
- 不把风险摘要写成 governance approval、Policy truth 或执行拦截规则。

#### 6.3.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 能力身份与接入语境 | descriptor 必须绑定稳定 identity 与 external source ref。 | provider 名、URL 或临时配置不得替代 identity。 |
| 注册目录与生命周期 | descriptor 只能为已注册或受控候选能力建立。 | 未注册来源不得绕过 registry 形成正式 descriptor。 |
| 治理与方法关系 | 风险 / 约束摘要为 seam、access review 和 method relation 提供解释材料。 | 风险摘要不得替代治理结果。 |
| 正式暴露与受控消费 | formal exposure 和 consumer view 消费 descriptor 摘要。 | consumer view 不得补造 provider runtime 或 secret truth。 |
| 外部引用与安全摘要支撑 | 读取 secret ref、external document ref 和引用解析状态。 | safe summary 缺失时显式 unresolved / unavailable。 |

#### 6.3.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖 descriptor、风险摘要、secret ref / safe summary。 |
| 候选对象是否有功能来源 | pass | 回指 `FR-CH-007~009`、`FR-CH-E04`、`BR-CH-004/005/013/022/031/035`。 |
| 接缝是否清楚 | pass | 与 identity、registry、seam、exposure、reference support 分层。 |
| 禁止事项是否清楚 | pass | secret、KMS、provider runtime、quota、cost、请求响应正文均排除。 |
| 是否越界 | pass | 未写 descriptor 字段全集、协议 schema、adapter trait 或安全配置项。 |

### 6.4 治理与方法关系

#### 6.4.1 本部分职责

治理与方法关系负责维护 capability access truth 与外部治理结果、policy result、接入审查职责分离和 method asset body-free relation 的关系语义。它让能力正式可见 / 可用语境能够引用治理结果,也让方法资产可以引用外部能力边界,但不把 `L1-governance` 的 approval / Policy truth 或 `L3-method-library` 的 method body 迁入本仓。

本部分承接 `C-CH-4`、`FR-CH-010~013`、`BR-CH-006/007/014/015/019/023/024/028/029/034/035/036`,是 formal exposure 与 traceability 的关键前置。

#### 6.4.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| governance seam 挂接 / 替换 / 失效 | governance result ref;policy result ref;allowed safe summary;capability identity | `GovernanceSeamRelation` 变化结果 | pending / unresolved / forbidden / expired 线索 | Step 6 / 7 / 8 / 9 |
| 接入审查与治理职责分离 | `CapabilityAccessReviewFact`;governance result ref | 职责分离解释事实 | access review 不提升为 approval | Step 6 / 8 / 10 |
| capability-method relation 建立 / 移除 | method asset ref;capability identity / registry / descriptor | `CapabilityMethodBodyFreeRelation` 变化结果 | active / removed / unresolved / forbidden 线索 | Step 6 / 7 / 8 / 9 |
| seam / relation traceability | seam / relation 变化;traceability 输入 | 关系变化解释材料 | 审计链路更新,不复制治理或方法正文 | Step 6 / 8 / 10 |

#### 6.4.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityGovernanceSeamService` | application service | 编排 governance result ref 挂接、替换、失效和读取 | Step 8 |
| `GovernanceSeamRelation` | domain relation | 承载 capability 与治理结果 / policy result 的关系真相 | Step 6 |
| `GovernanceResultRef` | reference object | 指向 governance result / policy result,不保存治理正文 | Step 6 |
| `GovernanceSeamPolicy` | policy | 约束 seam 不得生成 approval / Policy truth 或绕过治理结果前置 | Step 6 |
| `CapabilityMethodRelationService` | application service | 编排 capability 与 method asset 的 body-free relation | Step 8 |
| `CapabilityMethodBodyFreeRelation` | domain relation | 承载 capability 与 method asset 的无正文关系 | Step 6 |
| `MethodRelationBoundaryPolicy` | policy | 约束 relation 不得保存 method body、definition source truth 或方法版本正文 | Step 6 |

#### 6.4.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `GovernanceSeamRelation`;`CapabilityMethodBodyFreeRelation` | Step 6 独立成节 |
| Policy / Invariant | `GovernanceSeamPolicy`;`MethodRelationBoundaryPolicy` | Step 6 独立成节 |
| Projection / Read model | seam / relation summary 线索 | Step 6 判断是否并入 read model |
| Reference / Boundary | `GovernanceResultRef`;`MethodAssetRef` | Step 6 独立成节或作为 ref 类型明确 |
| Audit / History | `GovernanceSeamChangeRecord`;`MethodRelationChangeRecord` | Step 6 独立成节或并入 traceability 判断 |

#### 6.4.5 本部分不承担什么

- 不执行 governance approval。
- 不拥有 Policy effective fact、shared_rules truth、治理缓存或白名单刷新 truth。
- 不保存 method body、TaskDefinition、AIPolicyDef、ProcessTemplateDef、definition source truth 或方法版本正文。
- 不通过本地 seam 状态替代正式治理结果。
- 不建立对 `L1-governance` 或 `L3-method-library` 的源码级真相依赖。

#### 6.4.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 能力身份与接入语境 | seam / relation 以 capability identity 为关系端。 | seam / relation 不改写 identity。 |
| 注册目录与生命周期 | registry 可见性和 formal visibility 读取 governance seam 前置。 | registry 本地状态不得替代治理结果。 |
| 接入描述与风险摘要 | descriptor 风险摘要可作为治理接缝解释材料。 | 风险摘要不等于 governance truth。 |
| 正式暴露与受控消费 | exposure 依赖 seam / relation 的正式关系语义。 | consumer view 不得补造 seam / relation。 |
| 追溯、变化与影响 | seam / relation 变化进入 traceability 与 impact 解释。 | trace 不复制 governance / method 正文。 |

#### 6.4.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖 governance seam、职责分离、method relation 和关系追溯。 |
| 候选对象是否有功能来源 | pass | 回指 `FR-CH-010~013` 与 governance / method 边界规则。 |
| 接缝是否清楚 | pass | governance 和 method 都通过 ref / safe summary / body-free relation 进入。 |
| 禁止事项是否清楚 | pass | approval、Policy truth、shared_rules、method body 和源码依赖均排除。 |
| 是否越界 | pass | 未写 seam 字段、method relation schema、事件 payload 或治理流程。 |

### 6.5 正式暴露与受控消费

#### 6.5.1 本部分职责

正式暴露与受控消费负责维护服务端 formal exposure boundary、formal visibility / applicability 和 controlled consumer view。它让 runtime、tools、SDK、目录浏览和产品入口可以按同一服务端能力边界消费 capability access truth,同时防止 consumer view、SDK client、runtime cache 或旧 `QueryCapabilities` 反向定义本仓 truth。

本部分承接 `C-CH-5`、`FR-CH-014~016` 和部分 `FR-CH-005/009`,并将 registry、descriptor、governance seam、method relation 的正式结果转成可消费但不反写的服务端边界。

#### 6.5.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| formal exposure boundary 建立 / 调整 | registry entry;descriptor;governance seam;method relation;管理输入 | `FormalExposureBoundary` 变化结果 | accepted / pending / unavailable / retired 线索 | Step 6 / 7 / 8 / 9 |
| formal visibility / applicability 表达 | registry lifecycle;governance result;exposure boundary | `FormalVisibilityApplicability` | formal-visible / not-visible / pending / unavailable 线索 | Step 6 / 9 |
| controlled consumer view 构建 | formal exposure;descriptor summary;consumer ref | `ControlledConsumerView` | ready / stale / rebuilding / unavailable 线索 | Step 6 / 7 / 8 / 9 |
| SDK exposure server boundary | formal exposure;SDK consumer ref | SDK 可消费的服务端边界说明 | 不形成 SDK client truth | Step 7 / 8 / 12 |

#### 6.5.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityExposureService` | application service | 编排 formal exposure、visibility 和 applicability 变化 | Step 8 |
| `FormalExposureBoundary` | domain object | 承载服务端正式能力暴露边界 | Step 6 |
| `FormalVisibilityApplicability` | domain fact / state | 表达正式可见性和适用边界事实 | Step 6 / Step 9 |
| `FormalExposurePolicy` | policy | 约束 exposure 必须来源于正式 access truth,不得由消费面反写 | Step 6 |
| `ControlledConsumerViewService` | application service | 构建和维护受控消费视图 | Step 8 |
| `ControlledConsumerView` | projection / snapshot | 供 runtime、tools、SDK 或只读入口消费的派生视图 | Step 6 |
| `ConsumerViewFreshnessPolicy` | policy | 约束 consumer view freshness、stale 和 rebuild 语义 | Step 6 |

#### 6.5.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `FormalExposureBoundary`;`FormalVisibilityApplicability` | Step 6 独立成节 |
| Policy / Invariant | `FormalExposurePolicy`;`ConsumerViewFreshnessPolicy` | Step 6 独立成节 |
| Projection / Read model | `ControlledConsumerView` | Step 6 独立成节 |
| Reference / Boundary | `RuntimeToolsConsumerRef`;`SdkExposureConsumerRef` | Step 6 独立成节或作为 ref 类型明确 |
| Audit / History | `CapabilityExposureChangeRecord` | Step 6 独立成节或并入 traceability 判断 |

#### 6.5.5 本部分不承担什么

- 不实现 SDK client、多语言 package、client cache 或 developer experience。
- 不执行 runtime loop、tool invocation、provider lookup 或 allow / deny enforcement。
- 不让 `ControlledConsumerView`、search、browse、SDK package 或 runtime cache 成为 formal exposure truth。
- 不恢复旧 `QueryCapabilities` 作为核心 truth 或接口主语。
- 不保存 external invocation request / response 或 production payload。

#### 6.5.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 注册目录与生命周期 | exposure 依赖 registry entry 和 lifecycle / visibility 前置。 | registry 未满足前置时 exposure 只能 pending / unavailable。 |
| 接入描述与风险摘要 | exposure 和 consumer view 消费 descriptor 摘要。 | consumer view 不补 secret / provider runtime。 |
| 治理与方法关系 | formal visibility / applicability 可依赖 governance seam 和 method relation。 | exposure 不生成治理或方法正文。 |
| 追溯、变化与影响 | exposure 变化进入 traceability 和 consumer impact。 | impact 不回滚 exposure truth。 |
| 派生维护与只读输出 | consumer view 可由派生维护刷新。 | refresh 不反写 exposure。 |

#### 6.5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖 exposure、visibility、consumer view 和 SDK 服务端边界。 |
| 候选对象是否有功能来源 | pass | 回指 `FR-CH-014~016`、`BR-CH-008/016/025/030/034/036`。 |
| 接缝是否清楚 | pass | 与 registry、descriptor、seam、relation、trace、derived maintenance 分层。 |
| 禁止事项是否清楚 | pass | SDK client、runtime execution、QueryCapabilities truth 和 consumer view 反写均排除。 |
| 是否越界 | pass | 未写 API path、query DTO、SDK package、runtime cache 或状态机细节。 |

### 6.6 追溯、变化与影响

#### 6.6.1 本部分职责

追溯、变化与影响负责让 capability identity、registry、descriptor、governance seam、method relation、formal exposure 和 controlled consumer view 的来源、变化、消费影响和审计交接可解释。它记录 access traceability、change / impact fact 和 downstream consumption impact summary,但不拥有 observability store、audit log store、runtime execution payload、cost ledger 或下游状态 truth。

本部分承接 `FR-CH-013/016`、`BR-CH-009/018/026/036/037` 和架构中的 traceability / impact / handoff 语义,是 Step 8 flow、Step 10 异常边界和 Step 12 handoff 的重要输入。

#### 6.6.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| access traceability 记录 | identity、registry、descriptor、seam、relation、exposure 变化 | `CapabilityAccessTraceabilityRecord` | 形成来源、原因、操作者或外部 ref 解释线索 | Step 6 / 8 / 10 |
| capability change impact 解释 | 正式 truth 变化;consumer ref;外部引用状态 | `CapabilityChangeImpactFact` | impact scope / partial / delayed / ignored 语义线索 | Step 6 / 8 / 9 / 10 |
| downstream consumption impact summary | 下游消费反馈;runtime / tools / SDK consumer ref | `DownstreamConsumptionImpactSummary` | 下游反馈不回滚核心 truth | Step 6 / 8 / 10 |
| audit-friendly handoff | traceability record;observability / audit ref | 审计友好摘要或 handoff ref | 只输出 summary/ref,不拥有 audit store | Step 7 / 8 / 12 |

#### 6.6.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityTraceabilityService` | application service | 编排接入事实来源、关系、变化和审计解释 | Step 8 |
| `CapabilityAccessTraceabilityRecord` | audit / history object | 承载接入事实追溯记录 | Step 6 |
| `CapabilityChangeImpactService` | application service | 编排能力变化和消费影响解释 | Step 8 |
| `CapabilityChangeImpactFact` | domain fact | 承载变化和影响事实 | Step 6 |
| `DownstreamConsumptionImpactSummary` | safe summary / snapshot | 承接下游消费影响摘要,不保存执行正文 | Step 6 |
| `ObservabilityAuditRef` | reference object | 指向观测 / 审计材料位置,不保存观测正文 | Step 6 |

#### 6.6.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact` | Step 6 独立成节 |
| Policy / Invariant | trace / impact consistency policy 线索 | Step 6 判断是否形成独立 policy |
| Projection / Read model | impact summary view 线索 | Step 6 判断是否并入 impact fact 或 read model |
| Reference / Boundary | `DownstreamConsumptionImpactSummary`;`ObservabilityAuditRef` | Step 6 独立成节或作为 safe summary / ref 明确 |
| Audit / History | trace / impact record 线索 | Step 6 与 traceability record 合并判断 |

#### 6.6.5 本部分不承担什么

- 不拥有 observability log、trace、metric、alert、audit store 或 external GRC truth。
- 不保存 runtime / tools execution payload、provider invocation result 或 production request / response。
- 不拥有 cost / billing / finance ledger。
- 不把下游消费失败、反馈延迟或 handoff 失败写成核心 truth 失败。
- 不用 traceability 或 audit summary 更正 identity、registry、descriptor、seam、relation 或 exposure。

#### 6.6.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 所有核心 truth 组成部分 | 接收 identity、registry、descriptor、seam、relation、exposure 的变化事实。 | 追溯只解释变化,不替代原 truth owner。 |
| 正式暴露与受控消费 | 记录 exposure 变化和 consumer impact。 | consumer impact 不反写 exposure。 |
| 派生维护与只读输出 | 提供 export、audit summary、discovery 的来源解释。 | 派生材料不成为 trace truth。 |
| 外部引用与安全摘要支撑 | 使用 observability / audit ref、consumer ref 和 external document ref。 | ref 不迁入外部正文。 |

#### 6.6.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖 traceability、change impact、downstream summary 和 audit handoff。 |
| 候选对象是否有功能来源 | pass | 回指 `FR-CH-013/016` 与审计 / 显式变化规则。 |
| 接缝是否清楚 | pass | 只从各 truth owner 接收变化,不替代 truth owner。 |
| 禁止事项是否清楚 | pass | observability store、runtime payload、cost ledger 和 audit store 均排除。 |
| 是否越界 | pass | 未写 audit schema、event payload、证据格式或观测存储。 |

### 6.7 派生维护与只读输出

#### 6.7.1 本部分职责

派生维护与只读输出负责维护 controlled consumer view、directory search / browse projection、audit-friendly export summary、read-only ecosystem discovery summary 和 reconciliation / rebuild 结果。它服务读取、发现、审计和交接,但只能从正式 access truth、允许 safe summary 和 ref 派生,不得创造或更正核心业务结论。

本部分承接 `FR-CH-006/014/016` 和外围增强 `FR-CH-E02/E06/E07`,并落实 Step 3 中“派生维护不得创造新业务结论”的约束。

#### 6.7.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| consumer view refresh | formal exposure;descriptor summary;consumer ref | 刷新后的 `ControlledConsumerView` | stale / rebuilding / failed / ready 维护线索 | Step 7 job;Step 8 flow;Step 9 |
| directory search / browse projection | registry、descriptor、exposure truth | `DirectorySearchBrowseProjection` | 可重建、可滞后,不得反写真相 | Step 6 / 7 / 8 |
| audit-friendly export summary | traceability record;access truth 范围;allowed refs | `AuditFriendlyExportSummary` | export partial / unavailable 语义线索 | Step 6 / 7 / 8 / 10 |
| read-only ecosystem discovery | formal exposure;marketplace / external ecosystem ref | `ReadOnlyEcosystemDiscoverySummary` | 只读发现,不得形成 listing truth | Step 6 / 7 / 8 / 10 |
| reconciliation / rebuild | truth source;projection;maintenance trigger | `CapabilityReconciliationReport` | stale / inconsistent / rebuilt 维护解释 | Step 6 / 8 / 10 |

#### 6.7.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityDerivedMaintenanceService` | application service | 编排派生视图、搜索、导出、生态发现和对账维护 | Step 8 |
| `ConsumerViewRefreshJob` | operations job | 维护受控消费快照,不反写 formal exposure | Step 7 / Step 8 |
| `DirectorySearchBrowseProjection` | projection / read model | 维护目录搜索和浏览快照 | Step 6 |
| `AuditFriendlyExportSummary` | projection / export summary | 形成审计友好导出摘要 | Step 6 |
| `ReadOnlyEcosystemDiscoverySummary` | projection / read model | 形成只读生态发现摘要 | Step 6 |
| `CapabilityReconciliationReport` | report / maintenance material | 记录对账、重建和一致性维护结果 | Step 6 / Step 8 |
| `DerivedMaterialPolicy` | policy | 约束派生材料不得成为 truth 写源 | Step 6 |

#### 6.7.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | derived material freshness state 线索 | Step 6 判断是否形成独立 state object |
| Policy / Invariant | `DerivedMaterialPolicy` | Step 6 独立成节 |
| Projection / Read model | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | Step 6 独立成节或按 projection 组筛选 |
| Reference / Boundary | projection source refs;marketplace ecosystem object ref | Step 6 判断为 ref 类型或字段类型 |
| Audit / History | rebuild / export history 线索 | Step 6 判断是否并入 reconciliation report |

#### 6.7.5 本部分不承担什么

- 不建立、合并、拆分、更正或退役 capability identity。
- 不创建 registry entry 或改变 registry lifecycle。
- 不建立 descriptor、governance seam、method relation 或 formal exposure。
- 不保存 marketplace listing、transaction、pricing、fulfillment 或 external GRC truth。
- 不把 search / browse / export / ecosystem discovery / reconciliation result 当成第二 truth。

#### 6.7.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 注册目录与生命周期 | 读取 registry truth 建立 search / browse projection。 | projection 不反写 registry。 |
| 正式暴露与受控消费 | 刷新 controlled consumer view 和消费快照。 | refresh 不反写 formal exposure。 |
| 追溯、变化与影响 | 使用 trace / impact 来源形成 export 和 audit-friendly summary。 | export 不拥有 audit store。 |
| 外部引用与安全摘要支撑 | 使用 marketplace ecosystem ref、external document ref、observability ref。 | 只读发现不形成 marketplace truth。 |

#### 6.7.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖 consumer view refresh、search / browse、export、生态发现和 reconciliation。 |
| 候选对象是否有功能来源 | pass | 回指 `FR-CH-006/014/016`、`FR-CH-E02/E06/E07` 与 `BR-CH-009/011/026/037/E001`。 |
| 接缝是否清楚 | pass | 只消费正式 truth、safe summary 和 ref。 |
| 禁止事项是否清楚 | pass | 派生反写、marketplace truth、audit store 均排除。 |
| 是否越界 | pass | 未写 projection schema、job 调度、重试、导出格式或搜索索引。 |

### 6.8 外部引用与安全摘要支撑

#### 6.8.1 本部分职责

外部引用与安全摘要支撑负责维护外部 source、governance result、method asset、secret、runtime / tools consumer、SDK exposure、observability / audit、external document 和 marketplace ecosystem object 等 ref / safe summary 的解析状态。它让各核心组成部分能够引用外部材料并显式处理 resolved / unresolved / stale / invalid / unavailable 语义,但不复制外部正文、生命周期或系统 truth。

本部分承接 Step 3 的 ref / safe summary / forbidden body 约束,也是 Step 10 异常边界和 Step 11 配置影响的重要输入。

#### 6.8.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| external source ref 解析 | external MCP / A2A / API source ref | `ReferenceResolutionState` | resolved / unresolved / stale / invalid 线索 | Step 6 / 8 / 9 / 10 |
| governance / method ref 支撑 | governance result ref;method asset ref | ref 解析摘要和安全边界 | 不迁入 governance / method 正文 | Step 6 / 8 / 10 |
| secret / safe summary 支撑 | secret ref;allowed safe summary 来源 | secret handling safe summary 或 unavailable 状态 | secret 正文永远 forbidden | Step 6 / 10 / 11 |
| downstream / SDK consumer ref 支撑 | runtime / tools consumer ref;SDK exposure consumer ref | consumer boundary ref | 下游不可用不回滚 truth | Step 6 / 8 / 10 |
| observability / external document handoff | observability / audit ref;external document ref | handoff ref 或 document ref 解析状态 | 不拥有观测或外部文档正文 | Step 6 / 7 / 8 |
| event collaboration boundary | capability access fact 变化;`L0-bus` 协作边界 | event collaboration intent / handoff ref | 不定义 topic、payload、outbox schema | Step 7 / 8 / 10 |

#### 6.8.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `CapabilityReferenceResolutionService` | application service | 编排外部 ref 解析、状态维护和 safe summary 获取 | Step 8 |
| `ReferenceResolutionState` | domain state / reference state | 表达 external ref resolved / unresolved / stale / invalid / unavailable | Step 6 / Step 9 |
| `ReferenceResolutionPolicy` | policy | 约束 ref 不得迁入外部正文,不可解析时必须显式表达 | Step 6 |
| `ExternalDocumentRef` | reference object | 指向外部协议、标准或文档,不保存正文 | Step 6 |
| `RuntimeToolsConsumerRef` | reference object | 指向 runtime / tools consumer 边界,不保存执行正文 | Step 6 |
| `SdkExposureConsumerRef` | reference object | 指向 SDK consumer 边界,不保存 SDK client 正文 | Step 6 |
| `ObservabilityAuditRef` | reference object | 指向观测 / 审计材料位置,不保存观测正文 | Step 6 |
| `CapabilityAccessEventCollaborationPort` | external port | 输出已成立 access fact 变化协作边界 | Step 7 / 详细设计 |

#### 6.8.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReferenceResolutionState` | Step 6 独立成节,Step 9 继续收敛状态 |
| Policy / Invariant | `ReferenceResolutionPolicy` | Step 6 独立成节 |
| Projection / Read model | reference resolution summary 线索 | Step 6 判断是否作为 view 或字段类型 |
| Reference / Boundary | `ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;external source / governance / method / secret refs | Step 6 独立成节或作为 ref 类型明确 |
| Audit / History | reference refresh history 线索 | Step 6 判断是否并入 traceability / maintenance |

#### 6.8.5 本部分不承担什么

- 不保存外部 MCP / A2A / API provider 正文、protocol body 或 production request / response。
- 不保存 governance approval / Policy truth、method body、secret 正文、SDK client、runtime execution、observability store 或 marketplace listing。
- 不实现 adapter runtime、bus topic、event payload、consumer group、retry 或 outbox 表。
- 不替代来源仓生命周期、可用性、权限或版本 truth。
- 不把 ref 不可解析伪装成成功。

#### 6.8.6 与其他部分的接缝

| 对接部分 | 接缝内容 | 边界 |
|---|---|---|
| 能力身份与接入语境 | 解析 external capability source ref。 | 解析失败不得补造 identity。 |
| 接入描述与风险摘要 | 支撑 secret ref、external document ref 和 safe summary。 | secret / external doc 正文不入仓。 |
| 治理与方法关系 | 支撑 governance result ref 和 method asset ref。 | 不复制治理或方法正文。 |
| 正式暴露与受控消费 | 支撑 runtime / tools / SDK consumer ref。 | 下游消费不可用不回滚 exposure。 |
| 追溯、变化与影响 / 派生维护 | 支撑 observability / audit ref、event collaboration 和 handoff。 | handoff failure 不改变 core truth。 |

#### 6.8.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | pass | 覆盖 external ref、safe summary、consumer ref、event collaboration boundary。 |
| 候选对象是否有功能来源 | pass | 回指数据归属、接口依赖、forbidden body 和引用一致性约束。 |
| 接缝是否清楚 | pass | 面向所有核心 / 支撑组成部分提供 ref 解析,但不成为 truth owner。 |
| 禁止事项是否清楚 | pass | 外部正文、event payload、adapter runtime、来源仓 truth 均排除。 |
| 是否越界 | pass | 未写 transport、topic、payload、adapter trait、重试或配置 key。 |

---

## 7. 跨组成部分闭环审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 是否存在重复对象 | 未发现 unresolved 冲突。`ControlledConsumerView` 同时出现在 formal exposure 与派生维护语境,当前归属为“正式暴露与受控消费”的 projection / snapshot,派生维护只负责刷新。 | Step 6 需明确对象 owner 与维护 owner。 |
| 是否存在职责重叠 | 存在合理协作但无未解决重叠。Trace / impact 横跨多个 truth owner,但只记录变化解释,不拥有原 truth。 | Step 8 flow 需保持“truth owner 变更 -> trace service 记录”的方向。 |
| 是否存在候选对象遗漏 | 当前已覆盖 identity、registry、descriptor、seam、relation、exposure、trace / impact、projection、ref / safe summary。 | Step 6 从 §5.3 和 §6 对象线索做正式化筛选。 |
| 是否存在接缝冲突 | governance、method、SDK、runtime / tools、observability、marketplace、secret 均以 ref / safe summary / controlled view / handoff 边界出现。 | Step 7 不得把这些接缝升级为源码依赖或正文复制。 |
| 是否存在后续展开位置冲突 | service 多数进入 Step 8;domain object / policy / projection / ref 进入 Step 6;接口和 event / job 边界进入 Step 7 / Step 8;状态进入 Step 9。 | 后续 Step 必须沿此 owner 关系展开。 |
| 是否存在实现层误作组成部分 | 未发现。Inbound、Application、Domain、Ports、Persistence、Projection、Collaboration 仍作为实现分层。 | 后续不得把 repository / port / adapter / job runner 升级为业务组成部分。 |
| 是否存在旧材料回流 | 已识别旧 ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、KMS、policy refresh、execution gateway 污染。 | 见 §8 差异审计。 |

### 7.1 Step 6 展开门禁

- Step 6 必须从 §5.3 对象发现维度表和 §6 各组成部分对象发现线索出发,不得临场新增旧对象主语。
- `Step 6 必须独立展开` 的候选对象若被排除,必须在 Step 6 的候选池筛选说明中写明原因。
- API、repository、port、adapter、trigger、DTO、HTTP body、CloudEvent schema、database table 和 job runner 默认不作为领域对象展开。
- 字段骨架、成员函数骨架、工厂函数骨架、状态集合和状态迁移不得回填到本 Step。
- 若 Step 7、Step 8 或 Step 9 使用某个对象 / 状态主语,必须能回指 Step 6 的正式对象或 Step 5 的候选池来源。

### 7.2 后续展开一致性说明

| 后续 Step | 必须承接的 Step 5 结论 | 禁止反向新增 |
|---|---|---|
| Step 6 关键对象 | 8 个组成部分的对象候选池、owner、truth / projection / reference / audit 维度 | 旧 `ProviderContract`;`CapabilityDecision`;`CostRecord`;`QueryCapabilities`;KMS secret object;provider runtime object |
| Step 7 API / 接口骨架 | 每个 service / ref / event collaboration port 的所属组成部分和边界 | API path、DTO、event payload、SDK client、adapter trait |
| Step 8 关键处理流 | capability 清单中的输入、输出、状态 / 副作用和接缝 | 完整伪代码、事务、重试、补偿算法、外部调用实现 |
| Step 9 状态定义 | identity、registry、descriptor、seam、relation、exposure、consumer view、reference resolution 等状态 owner | runtime execution state、provider state、governance approval state、SDK cache state |
| Step 10 异常边界 | ref unresolved、safe summary unavailable、consumer view stale、handoff failed 等失败口径 | 默认成功、静默补造 truth、外围失败回滚核心 truth |
| Step 11 配置影响 | 哪些组成部分、ref、summary、job、projection 可能受配置影响 | 用配置改变 truth owner、formal boundary 或 forbidden body 红线 |

---

## 8. 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| 旧 `registry / contract / decision / cost / audit` 五部分 | 不继承为当前组成部分划分。 | 新版 `00/01` 已收稳 identity、registry、descriptor、seam、relation、exposure、trace / impact、derived / ref 支撑主线。 |
| `ProviderContract` 作为核心组成部分或对象 | 改为 adapter descriptor 与 descriptor risk / constraint summary 线索。 | ProviderContract 会吸收 secret、quota、route、cost、failover 和 provider runtime。 |
| `CapabilityDecision` / `QueryCapabilities` 作为消费主线 | 改为 formal exposure + controlled consumer view 分层。 | Query / decision view 不能成为第二 truth。 |
| `CostRecord` / cost accounting 作为能力组成部分 | 不进入当前组成部分或对象候选池。 | cost / billing / finance ledger 已被 `00/01` 裁出本仓。 |
| KMS / Vault、secret envelope、API key 托管 | 只保留 `SecretRef` 和 `SecretHandlingSafeSummary` 候选。 | 本仓不是 secret 平台,不得保存 secret 正文或 KMS truth。 |
| policy refresh、allow / deny、capability whitelist | 只保留 governance seam ref / safe summary 和 formal exposure 前置语义。 | governance truth 和 execution enforcement 不归本仓。 |
| execution gateway、provider lookup、runtime routing | 不进入本 Step。 | runtime / tools execution、provider orchestration 和 LLM routing 是边界外职责。 |
| 旧 `03` 的 Rust 目录、repository、service、DTO、projection 和状态 | 不作为当前组成部分来源。 | 旧详细设计未按新版 `00/01` 重启,且 Step 5 不写目录 / 文件 / 完整契约。 |

当前新增 blocker:

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| `CH-HLD-COMPONENT-001` | 旧 `02/03` 与当前 Step 5 组成部分划分 | resolved_for_step_5 | 旧材料把 provider contract、decision、cost、KMS、query、execution gateway 和 runtime policy refresh 混入组成部分。 | Step 5 已按新版 `00/01` 和 Step 4 的 8 个业务组成部分重建职责、对象候选池和接缝,旧结构只作 historical material。 |

---

## 9. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` 时回填到 §5,当前不直接修改正式文档。

````md
## 5. 主要组成部分、职责与边界

> 校准来源:
> - `design-calibration/02_hld_step_05_components_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_05_components_boundary.md` 的“结构化中间产物”“各主要组成部分”“跨组成部分闭环审计”和“旧材料差异审计”小节,了解主要组成部分、职责、对象候选池和接缝如何收敛。

### 5.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 能力身份与接入语境 | 建立外部能力的正式接入语境、稳定 identity、来源引用和接入审查事实。 | `CapabilityAccessIntakeService`;`CapabilityIdentityService`;`CapabilityIdentity`;`ExternalCapabilitySourceRef`;`CapabilityAccessReviewFact` | 外部调用执行、provider runtime、全局认证、governance approval。 |
| 注册目录与生命周期 | 维护 registry entry、生命周期、正式可见性前置语义和目录维护事实。 | `CapabilityRegistryService`;`CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy` | allowlist、runtime cache、marketplace listing、搜索 truth、执行状态。 |
| 接入描述与风险摘要 | 维护 adapter descriptor、能力类型、接入方式、风险 / 约束摘要和 secret safe boundary。 | `AdapterDescriptorService`;`AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | Provider Contract、secret 平台、KMS / Vault、quota、route、cost、provider runtime。 |
| 治理与方法关系 | 维护 governance seam relation、接入审查 / 治理职责分离和 capability-method body-free relation。 | `CapabilityGovernanceSeamService`;`GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodRelationService`;`CapabilityMethodBodyFreeRelation` | governance approval、Policy truth、shared_rules truth、method body、method version truth。 |
| 正式暴露与受控消费 | 维护 formal exposure、formal visibility / applicability 和 controlled consumer view 分层。 | `CapabilityExposureService`;`FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerViewService`;`ControlledConsumerView` | SDK client、runtime loop、tools execution、allow / deny enforcement、QueryCapabilities truth。 |
| 追溯、变化与影响 | 维护 access traceability、change / impact fact、消费影响摘要和审计 / handoff 解释。 | `CapabilityTraceabilityService`;`CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactService`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | observability store、audit log store、runtime execution payload、cost ledger、下游状态 truth。 |
| 派生维护与只读输出 | 维护 consumer view、search / browse、export、只读生态发现和审计友好摘要等派生材料。 | `CapabilityDerivedMaintenanceService`;`ConsumerViewRefreshJob`;`DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary` | 创造或更正核心接入 truth、审批、执行、交易、观测存储。 |
| 外部引用与安全摘要支撑 | 解析和维护 external source、governance、method、secret、downstream、SDK、observability、external document 等 ref / safe summary。 | `CapabilityReferenceResolutionService`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef`;`CapabilityAccessEventCollaborationPort` | 外部正文、来源仓生命周期、adapter 实现、event payload、topic、外部系统 truth。 |

### 5.2 各部分交互总图

```text
+=============================================================================+
|                    L3-capability-hub component flow                          |
+=============================================================================+
|  外部 MCP / A2A / API 来源                                                   |
|          v                                                                  |
|  1. 能力身份与接入语境                                                       |
|          v                                                                  |
|  2. 注册目录与生命周期  ----->  3. 接入描述与风险摘要                         |
|          +--------------------------+-------------------+                  |
|                                     v                                      |
|  4. 治理与方法关系 <-----------> 5. 正式暴露与受控消费                       |
|          v                                      v                           |
|  6. 追溯、变化与影响 <-------> 7. 派生维护与只读输出                         |
|          ^                                      |                           |
|          +----------- 8. 外部引用与安全摘要支撑 ----------------------------+
+=============================================================================+
```

关键说明:
- 图表达 8 个主要组成部分之间的大体交互和交接方向,不是 API 调用顺序、事件时序、数据库事务或实现部署图。
- 追溯 / 影响、派生维护和外部引用支撑只能解释、派生、解析和交接,不得反写核心 truth。

### 5.3 Step 6 展开门禁

Step 6 必须从本章对象发现维度表和各组成部分对象发现线索出发,独立完成关键对象正式化。第 5 章中的候选对象不是对象定义,不得在本章展开字段骨架、成员函数、工厂函数或状态迁移。
````

---

## 10. 待确认事项

### 10.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 5 是否新增第 9 个“外部协作 / 事件”组成部分 | A. 新增;B. 不新增,放入外部引用与安全摘要支撑及后续接口 / flow | B | 事件协作是 external port / flow / handoff 语义,不是独立业务主要组成部分 | 已确认采用 B |
| `ControlledConsumerView` 的 owner | A. 正式暴露与受控消费;B. 派生维护;C. 外部引用支撑 | A | view 的业务语义属于受控消费,派生维护只负责刷新和对账 | 已确认采用 A |
| 派生维护是否作为主要组成部分 | A. 是,但只作为支撑组成部分;B. 否,完全下沉实现层 | A | search / browse / export / consumer view refresh 是后续对象、接口和异常边界来源,但必须声明不得反写 truth | 已确认采用 A |
| 外部引用与安全摘要支撑是否作为主要组成部分 | A. 是;B. 否,全部留给 port / adapter | A | ref resolution、safe summary 和 forbidden body 是跨核心组成部分的业务边界,需要在 Step 5 提供对象候选池 | 已确认采用 A |

### 10.2 本 Step 未确认事项

本步不新增阻塞 Step 6 的上游 blocker。以下内容保持为后续 Step / 文档继续闭口:

- Step 6 中每个候选对象是否正式独立成节,以及哪些候选只是字段类型、ref 类型、port、repository、DTO 或详细设计材料。
- governance seam 的最小承载字段、method relation 摘要强度、descriptor taxonomy、secret safe summary 最小内容和 SDK handoff contract。
- API / Command / Query / Event / Operations Job / external port 的正式骨架。
- 关键处理流、状态集合、异常边界、配置影响和详细设计 handoff。

---

## 11. 进入下一步条件

- 已明确 `L3-capability-hub` 由 8 个主要组成部分构成。
- 已明确每个主要组成部分承担什么、不承担什么。
- 已明确每个主要组成部分需要完成哪些功能 / capability。
- 已明确每个主要组成部分包含哪些代码主体 / 模块,且后续展开位置没有悬空。
- 已形成对象发现维度表和各主要组成部分对象发现线索。
- 已形成各部分交互总图,且未表达协议字段、函数调用链、详细时序、数据库结构或部署拓扑。
- 已完成每个组成部分停审和跨组成部分闭环审计。
- 已隔离旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault、policy refresh、allow / deny 和 execution gateway 污染。
- 对象字段、状态集合、成员函数和工厂函数细节仍保留给 Step 6 独立展开。
- 可以进入 Step 6“关键对象轮廓”。
