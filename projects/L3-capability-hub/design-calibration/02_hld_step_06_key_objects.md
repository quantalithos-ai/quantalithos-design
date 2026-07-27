# L3-capability-hub 02 概要 Step 6: 关键对象轮廓

> 创建日期: 2026-07-09
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 从 Step 5 的对象候选池逐项筛选并正式化关键对象;对象轮廓只到概要骨架层,不写完整 Rust 类型、DTO、repository、port、DDL、事件 payload、配置项或实现代码。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 关键对象轮廓 |
| 输出文件 | `design-calibration/02_hld_step_06_key_objects.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`02_hld_step_01_upstream_boundary.md`;`02_hld_step_02_goals_scope.md`;`02_hld_step_03_constraints.md`;`02_hld_step_04_code_subject_framework.md`;`02_hld_step_05_components_boundary.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 6;`概要设计书写规范.md` §4.6 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` 的 `02` Step 6 主控与对象拆分粒度 |
| 旧材料处理 | 旧 `02-概要设计.md`、旧 `03-详细设计.md` 和 README 只作后置差异审计 |
| 进入条件 | pass:Step 5 已完成且用户确认进入 Step 6 |
| next_allowed_action | Step 6 已完成,等待用户确认后进入 Step 7。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入对象候选池筛选。 |
| 对象候选池筛选:先思考 | done | 筛选规则、正式 / 后移 / 排除判断 | pass | 进入对象候选池筛选写入。 |
| 对象候选池筛选:再写入 | done | 正式对象、合并对象、后移对象和排除对象清单 | pass | 进入关键对象分布。 |
| 关键对象分布 | done | 关键对象与 8 个主要组成部分映射 | pass | 进入逐组成部分对象正式化。 |
| 逐组成部分对象正式化 | done | 43 个关键对象独立小节 | pass | 进入组成部分停审记录。 |
| 每个组成部分对象停审 | done | 8 个组成部分对象正式化停审记录 | pass | 进入 Step 8 / Step 9 反查。 |
| Step 8 / Step 9 反查 | done | 处理流和状态主语反查清单 | pass | 进入跨对象一致性审计。 |
| 跨对象 / 跨组成部分一致性审计 | done | 重复、归属、状态、接口后续承接审计表 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 旧对象污染处理表 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 §6 回填草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 完成门禁与 Step 7 进入条件 | pass | 等待用户确认 Step 7。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 6 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 6 | Step 6 必须从 Step 5 对象候选池筛选,按主要组成部分逐个正式化对象,并输出对象字段、状态、成员函数、工厂函数、禁止事项、停审记录和 Step 8 / Step 9 反查清单。 | 本 Step 不能只写对象总表;每个关键对象必须独立成节。 |
| `standards/document/概要设计书写规范.md` §4.6 | 字段表必须使用 `字段 / 类型 / 作用`;函数参数必须写成 `TypeName param_name`;不写完整 Rust 签名、返回类型、泛型、生命周期、实现或数据库列。 | 本文件对象卡片保持概要骨架层。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` | Step 1 已确认 `02` 必须继续回答关键对象轮廓,且旧 `02/03` 只能作为 historical material。 | 对象不得从旧 `ProviderContract / CapabilityDecision / CostRecord` 主线继承。 |
| `design-calibration/02_hld_step_02_goals_scope.md` | Step 2 已确认本轮概要停在可实现结构骨架,并排除 runtime、governance truth、method body、SDK client、marketplace、secret / KMS、cost / billing 和 observability store。 | 对象只能表达本仓 access truth、ref、safe summary、projection、audit / history 和 policy 边界。 |
| `design-calibration/02_hld_step_03_constraints.md` | Step 3 已收稳 truth / snapshot / ref / relation / derived view / forbidden body 分层、依赖裁剪、sync / async / background 和配置不可越界。 | 对象字段不得携带 forbidden body,派生对象不得反写核心 truth。 |
| `design-calibration/02_hld_step_04_code_subject_framework.md` | Step 4 已形成 8 个业务代码主体候选,并区分业务主体与实现分层。 | 对象必须归属到 8 个主要组成部分,不能从 Inbound、Persistence、Port 等实现层发明对象。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | Step 5 已输出对象发现维度表、各组成部分对象线索和 Step 6 展开门禁。 | 本 Step 的候选池筛选直接承接 Step 5 §5.3 与 §6,并对排除项说明理由。 |
| `projects/L3-capability-hub/00-需求文档.md` | 正式需求以 `C-CH-1~5` 和 `FR-CH-001~016` 固定 identity、registry、descriptor、governance / method seam、formal exposure / consumer view、trace / impact 主线。 | 对象必须能回指需求闭环,不新增需求外 truth owner。 |
| `projects/L3-capability-hub/01-架构设计.md` | 正式架构已收稳五个核心子域、支撑子域 / 本地引用层、数据分层、交互分层和边界红线。 | 对象状态与引用边界必须继承架构语义,不重开架构取舍。 |
| `projects/L1-governance/design-calibration/02_hld_step_06_key_objects.md` | 参考其主控文件结构、候选筛选、对象分布、附录索引和 Step 8 / Step 9 反查。 | 只参考粒度,不复制 governance 领域对象。 |
| `projects/L3-method-library/design-calibration/02_hld_step_06_key_objects.md` | 参考其完全重写、对象筛选、后移 / 排除说明和对象附录深度。 | 本仓当前对象规模可放在一个 Step 文件中,但每个对象仍独立成节。 |

---

## 3. 模块思考记录

### 3.1 对象候选池筛选:先思考

问题回答:

- Step 5 已给出 truth / state、policy / invariant、projection / read model、reference / boundary、audit / history 五类对象候选。Step 6 需要把这些候选分成正式关键对象、字段类型 / 被并入对象、留给 Step 7 或详细设计、明确排除四类。
- 本仓核心 truth 对象必须覆盖 `CapabilityIdentity`、`CapabilityRegistryEntry`、`AdapterDescriptor`、`GovernanceSeamRelation`、`CapabilityMethodBodyFreeRelation`、`FormalExposureBoundary`、`CapabilityAccessTraceabilityRecord` 和 `CapabilityChangeImpactFact`。
- 支撑对象不能被压缩成“工具对象”,因为 `SecretRef`、`ReferenceResolutionState`、`ControlledConsumerView`、`DirectorySearchBrowseProjection`、`AuditFriendlyExportSummary` 等会直接影响 Step 7 接口、Step 8 flow、Step 9 状态和 Step 10 异常边界。

诊断:

- 旧 `02/03` 中 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、`QueryCapabilities`、policy refresh 和 execution gateway 会把对象主语拉回 provider runtime、cost、secret、governance enforcement 或消费面 truth。
- Step 5 中若有同名对象跨组成部分出现,必须在 Step 6 定 owner。例如 `ControlledConsumerView` 的业务 owner 是“正式暴露与受控消费”,派生维护只负责刷新;`ObservabilityAuditRef` 的 owner 是“外部引用与安全摘要支撑”,追溯 / 影响只使用该 ref。
- history / change record 对象如果不点名,Step 8 会倾向于把审计解释写进 service 或 event payload;因此本步保留关键 change record,但不写完整事件或审计 schema。

取舍:

- 采用 43 个正式关键对象,全部来自 Step 5 候选池或 Step 5 明确的对象线索。
- 普通 ID、普通 summary 文本、service、repository、port、adapter、DTO、HTTP body、event payload、job runner、topic、database table 和 SDK client 不作为 Step 6 对象。
- 字段骨架只写 2~5 个对边界有意义的字段;状态集合只在对象拥有独立状态语义时列出;函数骨架只表达领域动作或边界检查,不写返回类型和实现。

### 3.2 对象正式化:再写入

本步按 8 个主要组成部分完成对象正式化:

1. 能力身份与接入语境:锚定 identity、接入审查事实、身份 policy、外部来源 ref 和 identity history。
2. 注册目录与生命周期:锚定 registry entry、lifecycle state、visibility policy 和 registry history。
3. 接入描述与风险摘要:锚定 descriptor、风险 / 约束摘要、secret ref / safe summary、descriptor policy 和 descriptor history。
4. 治理与方法关系:锚定 governance seam、governance ref、method relation、method ref、两类 boundary policy 和 relation history。
5. 正式暴露与受控消费:锚定 formal exposure、visibility / applicability、consumer view、freshness policy 和 exposure history。
6. 追溯、变化与影响:锚定 traceability、change / impact fact 和 downstream impact summary。
7. 派生维护与只读输出:锚定 search / browse projection、export summary、ecosystem discovery summary、reconciliation report 和 derived material policy。
8. 外部引用与安全摘要支撑:锚定 reference resolution state / policy、external document ref、runtime / tools consumer ref、SDK consumer ref 和 observability / audit ref。

---

## 4. 对象候选池筛选说明

### 4.1 正式进入 Step 6 的关键对象

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| `CapabilityIdentity` | Truth / State | 正式关键对象 | 本仓 identity truth 主体,后续 registry、descriptor、seam、relation、exposure 均围绕它。 |
| `CapabilityAccessReviewFact` | Truth / State | 正式关键对象 | 承接接入审查与风险解释,并保护其不等同 governance approval。 |
| `CapabilityIdentityPolicy` | Policy / Invariant | 正式关键对象 | 约束 identity 建立、合并、拆分、更正和退役。 |
| `ExternalCapabilitySourceRef` | Reference / Boundary | 正式关键对象 | 外部 MCP / A2A / API 来源必须以 ref 表达,不得复制外部正文。 |
| `CapabilityIdentityChangeRecord` | Audit / History | 正式关键对象 | identity 变化需要可追溯,但不写事件 payload。 |
| `CapabilityRegistryEntry` | Truth / State | 正式关键对象 | registry truth 主体,不得退化为 allowlist、runtime cache 或 listing。 |
| `RegistryLifecycleState` | Truth / State | 正式关键对象 | Step 9 的 registry 状态主语。 |
| `RegistryVisibilityPolicy` | Policy / Invariant | 正式关键对象 | 约束草稿、候选、未描述、未治理、正式可见和退出。 |
| `RegistryChangeRecord` | Audit / History | 正式关键对象 | registry 纳入、退出和可见性变化需要历史记录。 |
| `AdapterDescriptor` | Truth / State | 正式关键对象 | descriptor truth 主体,替代旧 ProviderContract 口径。 |
| `DescriptorRiskConstraintSummary` | Truth / Summary | 正式关键对象 | 风险与约束摘要是 formal exposure 和 consumer view 的输入,但不是 governance truth。 |
| `SecretRef` | Reference / Boundary | 正式关键对象 | secret 只能以 ref 出现,禁止 secret 正文入仓。 |
| `SecretHandlingSafeSummary` | Snapshot / Safe summary | 正式关键对象 | 允许的安全处理摘要必须与 secret 正文边界分离。 |
| `DescriptorBoundaryPolicy` | Policy / Invariant | 正式关键对象 | 约束 descriptor 不吸收 provider runtime、secret、quota、route、cost、failover。 |
| `DescriptorChangeRecord` | Audit / History | 正式关键对象 | descriptor 替换、风险摘要变化和安全摘要变化需要历史线索。 |
| `GovernanceSeamRelation` | Truth / Relation | 正式关键对象 | capability 与 governance result 的关系 truth。 |
| `GovernanceResultRef` | Reference / Boundary | 正式关键对象 | 治理结果只能以 ref / safe summary 承接,不保存 approval / Policy truth。 |
| `GovernanceSeamPolicy` | Policy / Invariant | 正式关键对象 | 防止 seam 生成治理 truth 或绕过治理前置。 |
| `CapabilityMethodBodyFreeRelation` | Truth / Relation | 正式关键对象 | capability 与 method asset 的 body-free relation truth。 |
| `MethodAssetRef` | Reference / Boundary | 正式关键对象 | method asset 只能以 ref 出现,禁止 method body 入仓。 |
| `MethodRelationBoundaryPolicy` | Policy / Invariant | 正式关键对象 | 防止 relation 携带方法正文或 definition source truth。 |
| `GovernanceSeamChangeRecord` | Audit / History | 正式关键对象 | seam 挂接、失效、过期和不可解析需要历史。 |
| `MethodRelationChangeRecord` | Audit / History | 正式关键对象 | method relation 建立、移除和不可解析需要历史。 |
| `FormalExposureBoundary` | Truth / State | 正式关键对象 | 服务端 formal exposure truth 主体。 |
| `FormalVisibilityApplicability` | Truth / State | 正式关键对象 | 正式可见和适用性事实,区别于 registry 本地状态和 consumer view。 |
| `FormalExposurePolicy` | Policy / Invariant | 正式关键对象 | 防止 exposure 被消费面、SDK 或 runtime 反写。 |
| `ControlledConsumerView` | Projection / Snapshot | 正式关键对象 | 受控消费快照,业务 owner 是正式暴露与受控消费。 |
| `ConsumerViewFreshnessPolicy` | Policy / Invariant | 正式关键对象 | 约束 consumer view stale / rebuild / unavailable 语义。 |
| `CapabilityExposureChangeRecord` | Audit / History | 正式关键对象 | exposure 变化和 consumer impact 的追溯来源。 |
| `CapabilityAccessTraceabilityRecord` | Audit / History | 正式关键对象 | 接入事实追溯主体。 |
| `CapabilityChangeImpactFact` | Truth / Fact | 正式关键对象 | 变化与消费影响事实主体。 |
| `DownstreamConsumptionImpactSummary` | Snapshot / Safe summary | 正式关键对象 | 下游消费影响只能是摘要,不得保存执行正文或下游 truth。 |
| `DirectorySearchBrowseProjection` | Projection / Read model | 正式关键对象 | search / browse 派生快照,不得反写 registry。 |
| `AuditFriendlyExportSummary` | Projection / Export summary | 正式关键对象 | 审计友好导出摘要,不拥有 audit store。 |
| `ReadOnlyEcosystemDiscoverySummary` | Projection / Read model | 正式关键对象 | 只读生态发现摘要,不形成 marketplace listing truth。 |
| `CapabilityReconciliationReport` | Projection / Report | 正式关键对象 | 对账和重建结果需要可解释但不得反写真相。 |
| `DerivedMaterialPolicy` | Policy / Invariant | 正式关键对象 | 约束 projection、export、discovery、reconciliation 不成为 truth 写源。 |
| `ReferenceResolutionState` | Truth / State | 正式关键对象 | 外部 ref resolved / unresolved / stale / invalid / unavailable 的统一状态主语。 |
| `ReferenceResolutionPolicy` | Policy / Invariant | 正式关键对象 | 约束 ref 不可解析时显式表达,不得补造外部 truth。 |
| `ExternalDocumentRef` | Reference / Boundary | 正式关键对象 | 指向外部协议 / 标准 / 文档,不保存正文。 |
| `RuntimeToolsConsumerRef` | Reference / Boundary | 正式关键对象 | 指向 runtime / tools consumer 边界,不保存执行正文。 |
| `SdkExposureConsumerRef` | Reference / Boundary | 正式关键对象 | 指向 SDK consumer 边界,不保存 SDK client。 |
| `ObservabilityAuditRef` | Reference / Boundary | 正式关键对象 | 指向观测 / 审计材料位置,不保存 observability store 正文。 |

### 4.2 并入、后移或排除的候选

| 候选名称 | 来源维度 | 筛选结论 | 原因 |
|---|---|---|---|
| identity summary 线索 | Projection / Read model | 并入 | 并入 `CapabilityIdentity` 的只读摘要字段和 Step 7 query,不独立为 truth。 |
| registry visibility summary 线索 | Projection / Read model | 并入 | 并入 `RegistryVisibilityPolicy` / Step 7 query,不形成第二 registry truth。 |
| descriptor read summary 线索 | Projection / Read model | 并入 | 并入 `ControlledConsumerView` 或 Step 7 query,不独立成对象。 |
| seam / relation summary 线索 | Projection / Read model | 并入 | 并入 `GovernanceSeamRelation`、`CapabilityMethodBodyFreeRelation` 的读取摘要。 |
| trace / impact consistency policy 线索 | Policy / Invariant | 并入 | 当前由 `CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact` 和 Step 10 异常边界承接,不新增独立 policy。 |
| impact summary view 线索 | Projection / Read model | 并入 | 并入 `DownstreamConsumptionImpactSummary` 和 `CapabilityChangeImpactFact`。 |
| derived material freshness state 线索 | Truth / State | 后移 | Step 6 由各 projection 的 `freshness_state` 字段承接,完整状态词表到 Step 9。 |
| projection source refs | Reference / Boundary | 并入 | 作为 projection / report 字段类型,不独立展开。 |
| marketplace ecosystem object ref | Reference / Boundary | 后移 | 后续若进入只读生态发现,在 Step 7 / Step 8 作为 external ref 或字段类型处理。 |
| reference resolution summary 线索 | Projection / Read model | 并入 | 并入 `ReferenceResolutionState` 读取摘要和 Step 7 query。 |
| reference refresh history 线索 | Audit / History | 并入 | 并入 `CapabilityReconciliationReport` 或 traceability record,不另设 history 对象。 |
| `CapabilityAccessEventCollaborationPort` | Reference / Boundary | 后移到 Step 7 | 它是 external port,不是 domain object;Step 7 再定义事件协作接口骨架。 |
| `ConsumerViewRefreshJob` | Operations | 后移到 Step 7 / Step 8 | 它是 operations job / flow 触发器,不作为领域对象展开。 |
| service、repository、adapter、port、trigger、handler | 实现层 | 排除 | 属于接口、处理流或详细设计,不得在 Step 6 伪装成领域对象。 |
| DTO、HTTP body、CloudEvent schema、event payload | 协议层 | 排除 | 属于 Step 7 和详细设计,本步只定义对象轮廓。 |
| database table、index、outbox table、topic、consumer group | 存储 / 消息实现 | 排除 | 属于详细设计或实现,不进入概要对象轮廓。 |
| SDK client、language binding、package、client cache | 相邻仓 / 客户端实现 | 排除 | 属于 `L0-sdk`,本仓只保留服务端 exposure boundary 和 SDK consumer ref。 |
| `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities` | 旧材料对象 | 排除 | 与新版 `00/01` 冲突,只能作 historical material。 |

---

## 5. 关键对象与主要组成部分分布

| 主要组成部分 | 正式关键对象 |
|---|---|
| 能力身份与接入语境 | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` |
| 注册目录与生命周期 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` |
| 接入描述与风险摘要 | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` |
| 治理与方法关系 | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`GovernanceSeamChangeRecord`;`MethodRelationChangeRecord` |
| 正式暴露与受控消费 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`FormalExposurePolicy`;`ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`CapabilityExposureChangeRecord` |
| 追溯、变化与影响 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` |
| 派生维护与只读输出 | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`;`DerivedMaterialPolicy` |
| 外部引用与安全摘要支撑 | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef` |

对象归属说明:

- `ControlledConsumerView` 归属“正式暴露与受控消费”;“派生维护与只读输出”只负责 refresh / rebuild / reconciliation flow。
- `SecretRef` 与 `SecretHandlingSafeSummary` 归属“接入描述与风险摘要”;“外部引用与安全摘要支撑”负责 ref 解析和状态支撑。
- `GovernanceResultRef`、`MethodAssetRef` 分别归属“治理与方法关系”;“外部引用与安全摘要支撑”提供统一解析状态和不可解析语义。
- `ObservabilityAuditRef` 归属“外部引用与安全摘要支撑”;“追溯、变化与影响”只引用它做 handoff。

---

## 6. 关键对象独立小节

### 6.1 CapabilityIdentity

#### 6.1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 能力身份与接入语境 |
| 对象类型 | domain aggregate |
| 主要责任 | 承载外部 MCP / A2A / API 能力在本仓 capability access truth 中的稳定身份锚点。 |

#### 6.1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `capability_identity_id` | `CapabilityIdentityId` | 本仓内部稳定身份标识,供 registry、descriptor、seam、relation、exposure 引用。 |
| `identity_key` | `CapabilityIdentityKey` | 表达能力身份判定的业务锚点,避免 URL、provider 名或 runtime config 替代 identity。 |
| `source_ref` | `ExternalCapabilitySourceRef` | 指向外部来源,不保存外部来源正文。 |
| `identity_state` | `CapabilityIdentityState` | 表达 identity 当前是否候选、有效、更正中或退役。 |
| `review_fact_ref` | `CapabilityAccessReviewFactRef` | 关联身份层接入审查事实,但不等同 governance approval。 |

#### 6.1.3 状态集合

| 状态 | 作用 |
|---|---|
| `candidate` | 外部能力已有接入语境,但 identity 尚未正式成立。 |
| `active` | identity 已稳定成立,可被 registry、descriptor 和 exposure 引用。 |
| `correction_pending` | identity 需要合并、拆分或更正,消费面不得隐式修改。 |
| `retired` | identity 已退役,仅保留追溯和历史读取。 |
| `unresolved` | 外部来源或身份判断材料不足,不得补造正式 identity。 |

#### 6.1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `can_bind_descriptor(AdapterDescriptor descriptor)` | 判断 descriptor 是否能绑定当前 identity,不检查 provider runtime。 |
| `request_correction(ActorContext actor, IdentityCorrectionReason reason)` | 记录身份更正意图,不直接改写下游 consumer view。 |
| `retire(ActorContext actor, RetirementReason reason)` | 将 identity 退役,为 registry / exposure 后续处理提供来源事实。 |

#### 6.1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_from_intake(CapabilityAccessIntakeContext intake, ExternalCapabilitySourceRef source_ref)` | 基于正式承接语境创建候选 identity。 |
| `restore_from_history(CapabilityIdentityChangeRecord record)` | 从历史记录恢复读取语义,不创建新业务结论。 |

#### 6.1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 URL、provider 名或 tool config 替代 identity | 这些只是来源线索,不是稳定 capability identity。 |
| 保存 provider runtime、调用结果或执行状态 | execution truth 不属于本仓。 |
| 被 consumer view、SDK 或 runtime 隐式合并 / 拆分 | 身份变化只能通过正式 identity flow。 |

### 6.2 CapabilityAccessReviewFact

#### 6.2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 能力身份与接入语境 |
| 对象类型 | domain fact / audit fact |
| 主要责任 | 表达本仓对外部能力接入身份、风险和职责分离的审查事实。 |

#### 6.2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `review_fact_id` | `CapabilityAccessReviewFactId` | 审查事实标识。 |
| `capability_identity_id` | `CapabilityIdentityId` | 关联被审查的 capability identity。 |
| `review_context` | `AccessReviewContext` | 接入审查语境,不包含 governance approval 正文。 |
| `risk_summary` | `AccessRiskSummary` | 身份层风险解释摘要。 |
| `separation_marker` | `AccessGovernanceSeparationMarker` | 标记接入审查与治理审批的职责分离。 |

#### 6.2.3 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | 审查事实正在形成,不可作为正式 governance seam。 |
| `recorded` | 审查事实已记录,可供 descriptor、seam 和 traceability 引用。 |
| `superseded` | 审查事实被后续事实替代,保留历史追溯。 |
| `invalidated` | 审查事实因来源或边界问题被作废。 |

#### 6.2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `separates_from_governance(GovernanceResultRef governance_ref)` | 判断审查事实是否仍保持与治理结果的职责分离。 |
| `summarize_for_descriptor(AdapterDescriptor descriptor)` | 为 descriptor 风险摘要提供可引用的审查摘要。 |
| `invalidate(ActorContext actor, ReviewInvalidationReason reason)` | 显式作废审查事实,不回滚 governance truth。 |

#### 6.2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_from_review(ActorContext actor, CapabilityIdentity identity, AccessReviewContext context)` | 从接入审查语境记录事实。 |

#### 6.2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成 governance approval | approval / Policy truth 归 `L1-governance`。 |
| 写成 runtime allow / deny | 本对象只表达接入审查事实,不执行拦截。 |
| 保存外部敏感正文 | 只能保留允许摘要和 ref。 |

### 6.3 CapabilityIdentityPolicy

#### 6.3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 能力身份与接入语境 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 capability identity 的建立、合并、拆分、更正、退役和消费面不可反写。 |

#### 6.3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `CapabilityIdentityPolicyScope` | 标明 policy 适用于 identity 建立、变更或退役。 |
| `allowed_source_types` | `CapabilitySourceTypeSet` | 限定允许进入身份判定的来源类型。 |
| `forbidden_identity_sources` | `ForbiddenIdentitySourceSet` | 标明 URL、runtime config、SDK client 等不得替代 identity。 |

#### 6.3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_new_identity(CapabilityAccessIntakeContext intake, ExternalCapabilitySourceRef source_ref)` | 校验 identity 建立是否有正式接入语境和来源 ref。 |
| `validate_correction(CapabilityIdentity identity, IdentityCorrectionReason reason)` | 校验合并、拆分、更正是否通过正式路径。 |
| `reject_consumer_rewrite(ConsumerViewRef consumer_view_ref)` | 防止消费面反写 identity。 |

#### 6.3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_capability_hub()` | 生成 capability-hub 默认身份边界 policy。 |

#### 6.3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成配置矩阵或 policy engine | 这里只表达概要 policy,不定义实现算法。 |
| 读取 SDK / runtime 私有状态决定 identity | SDK / runtime 只能消费,不能定义 identity。 |

### 6.4 ExternalCapabilitySourceRef

#### 6.4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 能力身份与接入语境 |
| 对象类型 | reference object |
| 主要责任 | 指向外部 MCP / A2A / API 来源,为 identity 和 descriptor 提供可解析来源边界。 |

#### 6.4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref_id` | `ExternalCapabilitySourceRefId` | 本地来源引用标识。 |
| `source_kind` | `ExternalCapabilitySourceKind` | 标识 MCP、A2A、外部 API 或后续允许类别。 |
| `external_locator` | `ExternalLocatorSummary` | 外部定位摘要,不保存生产请求 / 响应正文。 |
| `resolution_state` | `ReferenceResolutionState` | 表达来源引用是否可解析。 |

#### 6.4.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | 来源引用当前可解析。 |
| `unresolved` | 来源引用缺失或不可解析,不得补造 identity。 |
| `stale` | 来源引用可能过期,需后续刷新或审查。 |
| `invalid` | 来源引用不符合接入边界。 |

#### 6.4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_unresolved(ReferenceFailureReason reason)` | 标记引用不可解析。 |
| `supports_descriptor(AdapterDescriptor descriptor)` | 判断该来源 ref 是否能支撑 descriptor 建立。 |

#### 6.4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_external_source(ExternalSourceInput source_input)` | 从正式输入创建来源 ref,不复制外部正文。 |

#### 6.4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存外部协议正文或生产 payload | 外部正文不属于本仓。 |
| 表示 provider runtime 可用性 | 可用性 / 执行状态属于执行侧。 |

### 6.5 CapabilityIdentityChangeRecord

#### 6.5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 能力身份与接入语境 |
| 对象类型 | history record |
| 主要责任 | 记录 capability identity 建立、合并、拆分、更正、退役的历史线索。 |

#### 6.5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_record_id` | `CapabilityIdentityChangeRecordId` | identity 变化记录标识。 |
| `capability_identity_id` | `CapabilityIdentityId` | 被变更 identity。 |
| `change_kind` | `CapabilityIdentityChangeKind` | 建立、合并、拆分、更正、退役等变化类型。 |
| `change_reason` | `IdentityChangeReason` | 变化原因摘要。 |
| `actor_context` | `ActorContext` | 触发变化的行为者语境。 |

#### 6.5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_identity_change(CapabilityIdentity identity)` | 判断记录是否能解释指定 identity 变化。 |
| `is_replayable_for_read_model()` | 判断该记录是否可用于只读材料重建。 |

#### 6.5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_change(ActorContext actor, CapabilityIdentity identity, CapabilityIdentityChangeKind change_kind)` | 创建身份变化记录。 |

#### 6.5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成 event payload 或 outbox schema | 事件协作留给 Step 7 / 详细设计。 |
| 携带外部来源正文 | 只记录 ref 和原因摘要。 |

### 6.6 CapabilityRegistryEntry

#### 6.6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 注册目录与生命周期 |
| 对象类型 | domain aggregate |
| 主要责任 | 承载外部能力进入正式 capability registry 的目录项和生命周期锚点。 |

#### 6.6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `registry_entry_id` | `CapabilityRegistryEntryId` | 注册目录项标识。 |
| `capability_identity_id` | `CapabilityIdentityId` | registry entry 绑定的稳定 identity。 |
| `lifecycle_state` | `RegistryLifecycleState` | 表达目录生命周期。 |
| `visibility_basis` | `RegistryVisibilityBasis` | 表达 registry 可见性判断依据,不等同 governance approval。 |
| `descriptor_ref` | `AdapterDescriptorRef` | 关联 descriptor,可为空或未就绪。 |

#### 6.6.3 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | registry entry 已创建但尚未满足描述或治理前置。 |
| `registered` | entry 已正式纳入 registry。 |
| `visibility_pending` | formal visibility 前置未满足或不可解析。 |
| `formal_visible` | 具备正式可见语义,仍不代表 runtime allow。 |
| `retired` | entry 退出正式目录。 |

#### 6.6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `bind_descriptor(AdapterDescriptor descriptor)` | 将 descriptor 与 registry entry 建立关联。 |
| `apply_visibility_policy(RegistryVisibilityPolicy policy)` | 根据可见性 policy 更新可见性语义。 |
| `retire(ActorContext actor, RegistryRetirementReason reason)` | 退出 registry,不删除 identity 历史。 |

#### 6.6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `register_identity(ActorContext actor, CapabilityIdentity identity)` | 从稳定 identity 创建 registry entry。 |

#### 6.6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成 runtime allowlist 或 availability cache | registry truth 不等于执行可用性。 |
| 写成 marketplace listing | listing / transaction 属于 marketplace 边界。 |
| 由 search / browse projection 反写 | 派生视图不得成为 registry 写源。 |

### 6.7 RegistryLifecycleState

#### 6.7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 注册目录与生命周期 |
| 对象类型 | state enum |
| 主要责任 | 表达 registry entry 在概要层可见的生命周期状态族,为 Step 9 状态机提供主语。 |

#### 6.7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `state_value` | `RegistryLifecycleStateValue` | 当前状态值。 |
| `state_reason` | `RegistryLifecycleReason` | 状态形成原因摘要。 |
| `effective_at` | `LifecycleEffectiveTime` | 生命周期语义生效时间点。 |

#### 6.7.3 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | 已有目录草稿,尚未正式注册。 |
| `registered` | 已纳入 registry,但未必可正式消费。 |
| `undescribed` | 缺少有效 descriptor。 |
| `ungoverned` | 治理前置未满足或不可解析。 |
| `formal_visible` | 满足正式可见前置。 |
| `retired` | 已退出目录。 |

#### 6.7.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allows_descriptor_update()` | 判断当前生命周期是否允许 descriptor 更新。 |
| `allows_formal_exposure()` | 判断是否具备进入 formal exposure 判断的前置。 |
| `is_terminal()` | 判断状态是否为终态。 |

#### 6.7.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `initial_for_registration(CapabilityRegistryEntry entry)` | 为新注册目录项创建初始生命周期状态。 |

#### 6.7.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 表达 runtime execution 状态 | 生命周期只属于 registry,不属于运行调用。 |
| 替代 governance result | `ungoverned` 只能表示本仓视角前置未满足。 |

### 6.8 RegistryVisibilityPolicy

#### 6.8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 注册目录与生命周期 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 registry entry 在目录、正式可见和消费前置之间的边界。 |

#### 6.8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `RegistryVisibilityPolicyScope` | 可见性 policy 作用范围。 |
| `required_preconditions` | `RegistryVisibilityPreconditionSet` | descriptor、seam、relation、exposure 前置要求摘要。 |
| `forbidden_visibility_sources` | `ForbiddenVisibilitySourceSet` | 标记 search、marketplace、runtime cache 等不得成为可见性来源。 |

#### 6.8.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `evaluate_entry(CapabilityRegistryEntry entry, VisibilityContext context)` | 评估 registry 可见性语义。 |
| `reject_marketplace_rewrite(MarketplaceContextRef marketplace_ref)` | 防止 marketplace listing 反写 registry 可见性。 |

#### 6.8.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_policy()` | 生成默认 registry 可见性 policy。 |

#### 6.8.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 生成 allow / deny enforcement | enforcement 属于 runtime / governance 边界。 |
| 让 search index 成为 truth | search / browse 只能派生。 |

### 6.9 RegistryChangeRecord

#### 6.9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 注册目录与生命周期 |
| 对象类型 | history record |
| 主要责任 | 记录 registry 纳入、退出、可见性和维护语义变化。 |

#### 6.9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `registry_change_record_id` | `RegistryChangeRecordId` | registry 变化记录标识。 |
| `registry_entry_id` | `CapabilityRegistryEntryId` | 被变更 registry entry。 |
| `change_kind` | `RegistryChangeKind` | 纳入、退出、可见性变化、维护标记等类型。 |
| `previous_state` | `RegistryLifecycleState` | 变化前状态摘要。 |
| `next_state` | `RegistryLifecycleState` | 变化后状态摘要。 |

#### 6.9.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_registry_state(CapabilityRegistryEntry entry)` | 判断记录是否解释 registry 当前状态。 |
| `can_feed_reconciliation()` | 判断是否可作为对账材料来源。 |

#### 6.9.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_registry_change(ActorContext actor, CapabilityRegistryEntry entry, RegistryChangeKind change_kind)` | 创建 registry 变化记录。 |

#### 6.9.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成数据库变更日志 | 本对象是业务历史,不是 DB changelog。 |
| 保存 search / browse 快照全文 | 派生材料只通过 ref 或摘要关联。 |

### 6.10 AdapterDescriptor

#### 6.10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 接入描述与风险摘要 |
| 对象类型 | domain aggregate |
| 主要责任 | 承载外部能力的接入方式、能力类型和边界摘要,是 descriptor truth 主体。 |

#### 6.10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `adapter_descriptor_id` | `AdapterDescriptorId` | descriptor 标识。 |
| `registry_entry_id` | `CapabilityRegistryEntryId` | descriptor 所描述的 registry entry。 |
| `descriptor_kind` | `AdapterDescriptorKind` | MCP、A2A、外部 API 或后续允许的接入类别。 |
| `connection_boundary_summary` | `ConnectionBoundarySummary` | 接入边界摘要,不含请求 / 响应正文。 |
| `risk_constraint_summary` | `DescriptorRiskConstraintSummary` | 风险和约束摘要。 |
| `secret_ref` | `SecretRef` | 可选 secret 引用,不保存 secret 正文。 |

#### 6.10.3 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | descriptor 草稿存在,尚未正式接受。 |
| `accepted` | descriptor 作为接入描述 truth 成立。 |
| `unresolved` | 来源、文档或 secret summary 不可解析。 |
| `replaced` | descriptor 被新版本或新描述替代。 |
| `retired` | descriptor 不再作为当前接入描述使用。 |

#### 6.10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_boundary_policy(DescriptorBoundaryPolicy policy)` | 校验 descriptor 未吸收 forbidden body。 |
| `attach_secret_ref(SecretRef secret_ref)` | 关联 secret ref,不读取 secret 正文。 |
| `replace_with(ActorContext actor, AdapterDescriptor replacement)` | 建立 descriptor 替换语义。 |

#### 6.10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_for_registry_entry(CapabilityRegistryEntry entry, ExternalCapabilitySourceRef source_ref)` | 为 registry entry 创建 descriptor。 |

#### 6.10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成旧 `ProviderContract` | ProviderContract 会吸收 secret、quota、route、cost、failover、runtime contract。 |
| 保存 API key、token 或 private key | secret 正文禁止入仓。 |
| 保存完整 MCP / A2A / API request / response schema | 协议 schema 属于后续接口或 adapter 详细设计。 |

### 6.11 DescriptorRiskConstraintSummary

#### 6.11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 接入描述与风险摘要 |
| 对象类型 | domain fact / summary |
| 主要责任 | 表达 descriptor 的风险、约束和敏感边界摘要,供 seam、exposure、consumer view 和 trace 使用。 |

#### 6.11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `summary_id` | `DescriptorRiskConstraintSummaryId` | 风险 / 约束摘要标识。 |
| `adapter_descriptor_id` | `AdapterDescriptorId` | 所属 descriptor。 |
| `risk_level` | `DescriptorRiskLevel` | 概要风险等级或分类。 |
| `constraint_summary` | `CapabilityConstraintSummary` | 接入约束摘要,不生成 Policy truth。 |
| `sensitive_boundary_marker` | `SensitiveBoundaryMarker` | 标识 secret、外部正文和安全摘要边界。 |

#### 6.11.3 状态集合

| 状态 | 作用 |
|---|---|
| `available` | 摘要可用于 exposure 和 consumer view。 |
| `partial` | 摘要不完整,读取和 exposure 必须显式表达。 |
| `unavailable` | 摘要不可用,不得伪装为低风险。 |
| `superseded` | 摘要被新事实替换。 |

#### 6.11.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_safe_for_consumer_view()` | 判断摘要是否可进入 controlled consumer view。 |
| `requires_governance_attention()` | 判断是否需要 governance seam 前置或解释。 |
| `mark_partial(SummaryGapReason reason)` | 标记摘要不完整原因。 |

#### 6.11.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `derive_from_descriptor(AdapterDescriptor descriptor, CapabilityAccessReviewFact review_fact)` | 从 descriptor 与审查事实派生风险 / 约束摘要。 |

#### 6.11.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 替代 governance approval | 这里只是风险摘要,不是审批结论。 |
| 携带 secret 正文或外部协议正文 | 只能表达安全摘要和边界标记。 |

### 6.12 SecretRef

#### 6.12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 接入描述与风险摘要 |
| 对象类型 | reference object |
| 主要责任 | 指向外部 secret 或凭据来源,确保本仓不保存 secret 正文。 |

#### 6.12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `secret_ref_id` | `SecretRefId` | secret 引用标识。 |
| `secret_provider_ref` | `ExternalSecretProviderRef` | 外部 secret 管理系统引用。 |
| `secret_usage_scope` | `SecretUsageScopeSummary` | secret 使用边界摘要。 |
| `resolution_state` | `ReferenceResolutionState` | secret ref 是否可解析。 |

#### 6.12.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | secret ref 可解析,但本仓仍不读取正文。 |
| `unresolved` | secret ref 不可解析。 |
| `unavailable` | 外部 secret 系统不可用。 |
| `forbidden` | secret ref 不符合本仓边界。 |

#### 6.12.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allows_safe_summary()` | 判断是否允许生成安全处理摘要。 |
| `mark_unavailable(ReferenceFailureReason reason)` | 标记 secret ref 不可用。 |

#### 6.12.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_external_secret_reference(ExternalSecretReferenceInput input)` | 从外部 secret 引用输入创建本地 ref。 |

#### 6.12.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 secret value、API key、token、password 或 private key | secret 正文永远 forbidden。 |
| 实现 KMS / Vault 生命周期 | 本仓不是 secret 平台。 |

### 6.13 SecretHandlingSafeSummary

#### 6.13.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 接入描述与风险摘要 |
| 对象类型 | safe summary / snapshot |
| 主要责任 | 表达允许展示的 secret 处理方式、安全边界和不可用状态,不携带 secret 正文。 |

#### 6.13.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `safe_summary_id` | `SecretHandlingSafeSummaryId` | 安全摘要标识。 |
| `secret_ref_id` | `SecretRefId` | 关联 secret ref。 |
| `handling_boundary` | `SecretHandlingBoundarySummary` | 允许展示的处理边界。 |
| `exposure_safety_marker` | `ExposureSafetyMarker` | 标记是否可进入 descriptor / consumer view 摘要。 |
| `freshness_state` | `SafeSummaryFreshnessState` | 安全摘要是否可用、过期或需刷新。 |

#### 6.13.3 状态集合

| 状态 | 作用 |
|---|---|
| `available` | 安全摘要可被 descriptor / trace 使用。 |
| `stale` | 摘要可能过期,需刷新。 |
| `unavailable` | 摘要不可用,读取面必须显式表达。 |
| `forbidden` | 摘要不允许展示。 |

#### 6.13.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_displayable_to_consumer()` | 判断是否可进入受控消费视图。 |
| `mark_stale(SummaryStaleReason reason)` | 标记摘要过期。 |

#### 6.13.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_from_secret_ref(SecretRef secret_ref, SafeSummaryInput safe_summary_input)` | 基于 secret ref 和允许输入创建安全摘要。 |

#### 6.13.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 携带 secret 正文或解密材料 | 只能是 safe summary。 |
| 写成 KMS policy 或 rotation plan | 这些属于安全基础设施 / 配置设计。 |

### 6.14 DescriptorBoundaryPolicy

#### 6.14.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 接入描述与风险摘要 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 descriptor 只表达接入方式、能力类型和边界摘要,不得退化为 Provider Contract。 |

#### 6.14.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `DescriptorBoundaryPolicyScope` | policy 适用的 descriptor 类别或范围。 |
| `forbidden_descriptor_fields` | `ForbiddenDescriptorFieldSet` | 标记 secret 正文、quota、route、cost、failover 等禁止内容。 |
| `allowed_summary_kinds` | `DescriptorSummaryKindSet` | 允许进入 descriptor 的摘要类型。 |

#### 6.14.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_descriptor(AdapterDescriptor descriptor)` | 校验 descriptor 是否越过 provider runtime / secret / cost 边界。 |
| `reject_provider_contract_shape(DescriptorShapeCandidate candidate)` | 显式拒绝旧 ProviderContract 形态。 |

#### 6.14.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_adapter_descriptor()` | 生成 descriptor 默认边界 policy。 |

#### 6.14.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写完整 adapter taxonomy 或协议 schema | taxonomy 和 schema 留给后续详细设计。 |
| 配置化解除 forbidden body | 配置不得改变 descriptor 边界。 |

### 6.15 DescriptorChangeRecord

#### 6.15.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 接入描述与风险摘要 |
| 对象类型 | history record |
| 主要责任 | 记录 descriptor 建立、替换、风险摘要变化、secret ref 变化和安全摘要变化。 |

#### 6.15.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `descriptor_change_record_id` | `DescriptorChangeRecordId` | descriptor 变化记录标识。 |
| `adapter_descriptor_id` | `AdapterDescriptorId` | 被变更 descriptor。 |
| `change_kind` | `DescriptorChangeKind` | 建立、替换、风险摘要变化、secret ref 变化等。 |
| `change_reason` | `DescriptorChangeReason` | 变化原因摘要。 |
| `boundary_policy_snapshot` | `DescriptorBoundaryPolicySnapshot` | 当时适用的边界 policy 摘要。 |

#### 6.15.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_descriptor(AdapterDescriptor descriptor)` | 判断记录是否解释当前 descriptor。 |
| `is_sensitive_change()` | 判断变化是否涉及 secret ref 或安全摘要。 |

#### 6.15.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_descriptor_change(ActorContext actor, AdapterDescriptor descriptor, DescriptorChangeKind change_kind)` | 创建 descriptor 变化记录。 |

#### 6.15.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 记录 secret 正文变化 | 只能记录 secret ref 或 safe summary 变化。 |
| 写成 provider runtime audit | provider runtime 不属于本仓。 |

### 6.16 GovernanceSeamRelation

#### 6.16.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | domain relation |
| 主要责任 | 承载 capability 与 governance result / policy result 之间的关系 truth。 |

#### 6.16.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `governance_seam_relation_id` | `GovernanceSeamRelationId` | seam relation 标识。 |
| `capability_identity_id` | `CapabilityIdentityId` | capability 关系端。 |
| `governance_result_ref` | `GovernanceResultRef` | 治理结果或 policy result 引用。 |
| `seam_state` | `GovernanceSeamState` | seam 当前状态。 |
| `allowed_safe_summary` | `GovernanceSafeSummary` | 允许保存的治理摘要,不含治理正文。 |

#### 6.16.3 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | seam 关系等待治理结果或引用解析。 |
| `active` | seam 关系已成立,可供 visibility / exposure 判断。 |
| `unresolved` | governance ref 不可解析。 |
| `expired` | governance ref 或摘要已过期。 |
| `forbidden` | seam 输入越界或不允许承接。 |

#### 6.16.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_governance_result(GovernanceResultRef governance_ref)` | 挂接治理结果引用。 |
| `apply_seam_policy(GovernanceSeamPolicy policy)` | 校验 seam 不生成治理 truth。 |
| `mark_unresolved(ReferenceFailureReason reason)` | 标记 governance ref 不可解析。 |

#### 6.16.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_for_capability(CapabilityIdentity identity, GovernanceResultRef governance_ref)` | 为 capability 创建 governance seam relation。 |

#### 6.16.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 执行 governance approval | approval 归 `L1-governance`。 |
| 保存 Policy effective fact 或 shared_rules truth | 只能保存 ref / allowed safe summary。 |
| 生成 runtime allow / deny | enforcement 不属于本对象。 |

### 6.17 GovernanceResultRef

#### 6.17.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | reference object |
| 主要责任 | 指向 `L1-governance` 的 governance result / policy result,不保存治理正文。 |

#### 6.17.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `governance_result_ref_id` | `GovernanceResultRefId` | governance result 引用标识。 |
| `governance_source` | `GovernanceSourceRef` | 治理结果来源引用。 |
| `result_scope_summary` | `GovernanceResultScopeSummary` | 结果作用范围摘要。 |
| `resolution_state` | `ReferenceResolutionState` | governance result 是否可解析。 |

#### 6.17.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | 引用可解析。 |
| `unresolved` | 引用不可解析,formal exposure 必须 pending 或 unavailable。 |
| `expired` | 引用过期。 |
| `forbidden` | 引用内容不符合本仓承接边界。 |

#### 6.17.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_seam_relation(GovernanceSeamRelation relation)` | 判断 ref 是否能支撑 seam relation。 |
| `mark_expired(ReferenceStaleReason reason)` | 标记治理结果过期。 |

#### 6.17.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_governance_result_reference(GovernanceResultReferenceInput input)` | 从治理结果引用输入创建 ref。 |

#### 6.17.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 approval 正文、Policy 或 shared_rules | 这些属于 governance truth。 |
| 本地生成 governance result | 本仓只能引用,不能生成。 |

### 6.18 GovernanceSeamPolicy

#### 6.18.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 governance seam 只能承接治理结果 ref / allowed safe summary,不得生成治理 truth。 |

#### 6.18.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `GovernanceSeamPolicyScope` | seam policy 作用范围。 |
| `required_ref_kinds` | `GovernanceRefKindSet` | 允许的 governance result / policy result 引用类型。 |
| `forbidden_governance_bodies` | `ForbiddenGovernanceBodySet` | 禁止进入本仓的 governance truth 正文类型。 |

#### 6.18.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_relation(GovernanceSeamRelation relation)` | 校验 seam relation 是否越过治理边界。 |
| `reject_access_review_as_approval(CapabilityAccessReviewFact review_fact)` | 防止接入审查事实被当成 approval。 |

#### 6.18.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_governance_seam()` | 生成默认 governance seam policy。 |

#### 6.18.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写 approval workflow | 治理流程不在本仓。 |
| 写 allowlist refresh truth | capability whitelist 不能反向定义 governance。 |

### 6.19 CapabilityMethodBodyFreeRelation

#### 6.19.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | domain relation |
| 主要责任 | 承载 capability 与 method asset 的无正文关系,保护 method body 不入仓。 |

#### 6.19.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `method_relation_id` | `CapabilityMethodBodyFreeRelationId` | relation 标识。 |
| `capability_identity_id` | `CapabilityIdentityId` | capability 关系端。 |
| `method_asset_ref` | `MethodAssetRef` | method asset 引用。 |
| `relation_scope` | `CapabilityMethodRelationScope` | 关系适用范围摘要。 |
| `relation_state` | `CapabilityMethodRelationState` | relation 当前状态。 |

#### 6.19.3 状态集合

| 状态 | 作用 |
|---|---|
| `pending` | method asset ref 或关系前置未满足。 |
| `active` | body-free relation 成立。 |
| `removed` | relation 已移除。 |
| `unresolved` | method asset ref 不可解析。 |
| `forbidden` | relation 试图携带 method body 或越界摘要。 |

#### 6.19.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_method_asset(MethodAssetRef method_asset_ref)` | 挂接 method asset ref。 |
| `apply_boundary_policy(MethodRelationBoundaryPolicy policy)` | 校验 relation 不携带 method body。 |
| `remove(ActorContext actor, MethodRelationRemovalReason reason)` | 移除 relation,保留历史。 |

#### 6.19.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_body_free_relation(CapabilityIdentity identity, MethodAssetRef method_asset_ref)` | 创建 capability-method body-free relation。 |

#### 6.19.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 Method Content、TaskDefinition、AIPolicyDef、ProcessTemplateDef | 方法正文归 `L3-method-library`。 |
| 表达 method version truth | 方法版本生命周期不归本仓。 |

### 6.20 MethodAssetRef

#### 6.20.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | reference object |
| 主要责任 | 指向 method-library 中的方法资产,作为 body-free relation 的 method 端。 |

#### 6.20.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `method_asset_ref_id` | `MethodAssetRefId` | method asset 引用标识。 |
| `method_asset_kind` | `MethodAssetKindSummary` | 方法资产类别摘要,不保存正文。 |
| `method_library_locator` | `MethodLibraryLocator` | 指向 method-library 的引用位置。 |
| `resolution_state` | `ReferenceResolutionState` | method asset ref 是否可解析。 |

#### 6.20.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | method asset ref 可解析。 |
| `unresolved` | method asset ref 不可解析。 |
| `stale` | method asset ref 可能过期。 |
| `forbidden` | ref 输入携带 method body 或越界内容。 |

#### 6.20.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_relation(CapabilityMethodBodyFreeRelation relation)` | 判断 ref 是否能支撑 body-free relation。 |
| `mark_unresolved(ReferenceFailureReason reason)` | 标记 method asset ref 不可解析。 |

#### 6.20.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_method_asset_reference(MethodAssetReferenceInput input)` | 从 method asset 引用输入创建 ref。 |

#### 6.20.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 method asset 正文 | 只能保存 ref 和允许摘要。 |
| 形成对 `L3-method-library` 的源码级 truth 依赖 | sibling 只能通过 ref / runtime / event 协作。 |

### 6.21 MethodRelationBoundaryPolicy

#### 6.21.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 capability-method relation 只能是 body-free relation。 |

#### 6.21.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `MethodRelationBoundaryPolicyScope` | method relation policy 作用范围。 |
| `allowed_relation_summaries` | `MethodRelationSummaryKindSet` | 允许保存的 relation 摘要类型。 |
| `forbidden_method_bodies` | `ForbiddenMethodBodySet` | 禁止保存的方法正文类型。 |

#### 6.21.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_relation(CapabilityMethodBodyFreeRelation relation)` | 校验 relation 是否 body-free。 |
| `reject_method_body(MethodBodyCandidate body_candidate)` | 拒绝方法正文进入本仓。 |

#### 6.21.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_method_relation()` | 生成默认 method relation boundary policy。 |

#### 6.21.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 复制 method-library 正文或版本对象 | 会破坏 method-library truth owner。 |
| 生成方法发布语义 | 发布和版本不属于 capability-hub。 |

### 6.22 GovernanceSeamChangeRecord

#### 6.22.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | history record |
| 主要责任 | 记录 governance seam 挂接、替换、失效、过期、不可解析和 forbidden 变化。 |

#### 6.22.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `seam_change_record_id` | `GovernanceSeamChangeRecordId` | seam 变化记录标识。 |
| `governance_seam_relation_id` | `GovernanceSeamRelationId` | 被变更 seam relation。 |
| `change_kind` | `GovernanceSeamChangeKind` | 挂接、失效、过期、不可解析等类型。 |
| `previous_state` | `GovernanceSeamState` | 变化前 seam 状态。 |
| `next_state` | `GovernanceSeamState` | 变化后 seam 状态。 |

#### 6.22.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_seam_relation(GovernanceSeamRelation relation)` | 判断记录是否解释 seam 当前状态。 |
| `requires_exposure_recheck()` | 判断 seam 变化是否需要 formal exposure 重新评估。 |

#### 6.22.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_seam_change(ActorContext actor, GovernanceSeamRelation relation, GovernanceSeamChangeKind change_kind)` | 创建 seam 变化记录。 |

#### 6.22.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 携带 governance approval 正文 | 只记录 ref 和状态变化。 |
| 写成 policy refresh event payload | 事件 payload 后移。 |

### 6.23 MethodRelationChangeRecord

#### 6.23.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 治理与方法关系 |
| 对象类型 | history record |
| 主要责任 | 记录 capability-method relation 建立、移除、不可解析和 forbidden 变化。 |

#### 6.23.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `method_relation_change_record_id` | `MethodRelationChangeRecordId` | method relation 变化记录标识。 |
| `method_relation_id` | `CapabilityMethodBodyFreeRelationId` | 被变更 relation。 |
| `change_kind` | `MethodRelationChangeKind` | 建立、移除、不可解析、forbidden 等类型。 |
| `method_asset_ref` | `MethodAssetRef` | 关联 method asset ref。 |
| `change_reason` | `MethodRelationChangeReason` | 变化原因摘要。 |

#### 6.23.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_method_relation(CapabilityMethodBodyFreeRelation relation)` | 判断记录是否解释 relation 当前状态。 |
| `requires_consumer_view_refresh()` | 判断 relation 变化是否影响 consumer view。 |

#### 6.23.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_method_relation_change(ActorContext actor, CapabilityMethodBodyFreeRelation relation, MethodRelationChangeKind change_kind)` | 创建 method relation 变化记录。 |

#### 6.23.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 携带 method body diff | method body 不入仓。 |
| 写成 method-library history | 本对象只记录本仓 relation 变化。 |

### 6.24 FormalExposureBoundary

#### 6.24.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式暴露与受控消费 |
| 对象类型 | domain aggregate |
| 主要责任 | 承载服务端正式能力暴露边界,是下游消费视图和 SDK exposure 的 truth 来源。 |

#### 6.24.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `formal_exposure_id` | `FormalExposureBoundaryId` | formal exposure 标识。 |
| `registry_entry_id` | `CapabilityRegistryEntryId` | 被暴露的 registry entry。 |
| `descriptor_ref` | `AdapterDescriptorRef` | exposure 使用的 descriptor 摘要来源。 |
| `governance_seam_ref` | `GovernanceSeamRelationRef` | exposure 前置 governance seam。 |
| `method_relation_ref` | `CapabilityMethodRelationRef` | exposure 相关 method relation。 |
| `exposure_state` | `FormalExposureState` | exposure 当前状态。 |

#### 6.24.3 状态集合

| 状态 | 作用 |
|---|---|
| `draft` | exposure 尚在准备或前置检查中。 |
| `accepted` | 服务端正式暴露边界成立。 |
| `pending` | descriptor、governance seam 或 method relation 前置未满足。 |
| `unavailable` | 依赖 ref 或摘要不可用,读取面必须显式表达。 |
| `retired` | exposure 已停止作为正式消费边界。 |

#### 6.24.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `apply_exposure_policy(FormalExposurePolicy policy)` | 校验 exposure 只来源于正式 access truth。 |
| `derive_visibility(CapabilityRegistryEntry registry_entry, GovernanceSeamRelation seam_relation)` | 计算 formal visibility / applicability 的输入语义。 |
| `retire(ActorContext actor, ExposureRetirementReason reason)` | 停止 formal exposure,保留变化记录。 |

#### 6.24.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_from_access_truth(CapabilityRegistryEntry entry, AdapterDescriptor descriptor, GovernanceSeamRelation seam_relation)` | 从正式 access truth 创建 exposure。 |

#### 6.24.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 被 `ControlledConsumerView` 或 SDK client 反写 | consumer view / SDK 只能消费。 |
| 写成 runtime allow / deny | runtime enforcement 不属于本仓。 |
| 旧 `QueryCapabilities` 作为 truth | query view 只能派生读取。 |

### 6.25 FormalVisibilityApplicability

#### 6.25.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式暴露与受控消费 |
| 对象类型 | domain fact / state |
| 主要责任 | 表达 capability 在服务端正式语境下是否可见、适用、挂起或不可用。 |

#### 6.25.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `visibility_applicability_id` | `FormalVisibilityApplicabilityId` | 可见 / 适用事实标识。 |
| `formal_exposure_id` | `FormalExposureBoundaryId` | 关联 exposure。 |
| `visibility_state` | `FormalVisibilityState` | 正式可见性状态。 |
| `applicability_scope` | `FormalApplicabilityScope` | 服务端适用范围摘要。 |
| `basis_summary` | `FormalVisibilityBasisSummary` | registry、descriptor、seam、relation 前置摘要。 |

#### 6.25.3 状态集合

| 状态 | 作用 |
|---|---|
| `not_visible` | 不具备正式可见前置。 |
| `visible` | 可作为正式服务端能力被消费。 |
| `pending` | 前置缺失或等待外部 ref。 |
| `unavailable` | 前置不可用,不得伪装为可见。 |
| `retired` | 可见事实已终止。 |

#### 6.25.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_consumable_by(RuntimeToolsConsumerRef consumer_ref)` | 判断是否可进入特定 runtime / tools 消费边界。 |
| `is_consumable_by_sdk(SdkExposureConsumerRef sdk_ref)` | 判断是否可进入 SDK 服务端 exposure 边界。 |
| `mark_pending(FormalVisibilityPendingReason reason)` | 标记前置待满足。 |

#### 6.25.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `derive_from_exposure(FormalExposureBoundary exposure, FormalExposurePolicy policy)` | 从 exposure 和 policy 派生正式可见 / 适用事实。 |

#### 6.25.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 替代 governance approval | 可见事实只能引用治理结果,不能生成治理结论。 |
| 表达 SDK client 默认行为 | SDK client 行为属于 `L0-sdk`。 |

### 6.26 FormalExposurePolicy

#### 6.26.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式暴露与受控消费 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 formal exposure 必须来源于正式 access truth,不得由消费面或查询面反写。 |

#### 6.26.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `FormalExposurePolicyScope` | exposure policy 作用范围。 |
| `required_truth_inputs` | `FormalExposureTruthInputSet` | registry、descriptor、seam、relation 等必需输入。 |
| `forbidden_exposure_sources` | `ForbiddenExposureSourceSet` | consumer view、SDK client、runtime cache、search 等禁止来源。 |

#### 6.26.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_exposure(FormalExposureBoundary exposure)` | 校验 exposure 来源是否合规。 |
| `reject_consumer_view_rewrite(ControlledConsumerView consumer_view)` | 防止 consumer view 反写 exposure。 |
| `requires_registry_visibility(CapabilityRegistryEntry entry)` | 判断 registry entry 是否满足 exposure 前置。 |

#### 6.26.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_formal_exposure()` | 生成默认 formal exposure policy。 |

#### 6.26.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成 runtime authorization policy | runtime authorization 不属于本仓。 |
| 用配置绕过治理或 descriptor 前置 | 配置不得改变 formal boundary。 |

### 6.27 ControlledConsumerView

#### 6.27.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式暴露与受控消费 |
| 对象类型 | projection / snapshot |
| 主要责任 | 从 formal exposure、descriptor 摘要和 consumer ref 派生受控消费快照,供 runtime、tools、SDK 或只读入口消费。 |

#### 6.27.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumer_view_id` | `ControlledConsumerViewId` | 消费快照标识。 |
| `formal_exposure_id` | `FormalExposureBoundaryId` | 快照来源 exposure。 |
| `consumer_ref` | `CapabilityConsumerRef` | runtime / tools / SDK 或只读消费方引用。 |
| `descriptor_summary` | `DescriptorConsumerSummary` | 可消费 descriptor 摘要,不含 secret / provider runtime。 |
| `freshness_state` | `ConsumerViewFreshnessState` | 快照新鲜度状态。 |

#### 6.27.3 状态集合

| 状态 | 作用 |
|---|---|
| `ready` | consumer view 可读取。 |
| `stale` | 快照落后于正式 truth。 |
| `rebuilding` | 快照正在重建。 |
| `unavailable` | 快照不可用,但不回滚 exposure truth。 |
| `partial` | 快照只包含部分允许摘要。 |

#### 6.27.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `refresh_from_exposure(FormalExposureBoundary exposure)` | 从 formal exposure 重建快照。 |
| `mark_stale(ConsumerViewStaleReason reason)` | 标记快照过期。 |
| `is_safe_for_consumer(CapabilityConsumerRef consumer_ref)` | 判断快照是否适合指定消费方。 |

#### 6.27.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `build_for_consumer(FormalExposureBoundary exposure, CapabilityConsumerRef consumer_ref)` | 基于 formal exposure 和 consumer ref 构建快照。 |

#### 6.27.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 成为 formal exposure truth | view 是派生快照,不得反写。 |
| 保存 production invocation payload | 生产调用正文不入仓。 |
| 表示 SDK client cache | SDK client cache 属于 `L0-sdk`。 |

### 6.28 ConsumerViewFreshnessPolicy

#### 6.28.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式暴露与受控消费 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 controlled consumer view 的 stale、rebuild、partial 和 unavailable 语义。 |

#### 6.28.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `ConsumerViewFreshnessPolicyScope` | freshness policy 作用范围。 |
| `stale_marker_rules` | `ConsumerViewStaleMarkerSet` | 标记快照过期的规则摘要。 |
| `allowed_partial_kinds` | `ConsumerViewPartialKindSet` | 允许 partial view 的情况。 |

#### 6.28.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `evaluate_freshness(ControlledConsumerView consumer_view, FormalExposureBoundary exposure)` | 判断 consumer view 是否 stale。 |
| `should_rebuild(ControlledConsumerView consumer_view)` | 判断是否应触发重建。 |
| `reject_truth_rewrite(ControlledConsumerView consumer_view)` | 防止快照反写真相。 |

#### 6.28.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_consumer_view()` | 生成默认 consumer view freshness policy。 |

#### 6.28.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 freshness policy 改写 exposure | policy 只约束快照新鲜度。 |
| 写完整刷新调度和重试算法 | 调度和重试留给 Step 8 / 详细设计。 |

### 6.29 CapabilityExposureChangeRecord

#### 6.29.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 正式暴露与受控消费 |
| 对象类型 | history record |
| 主要责任 | 记录 formal exposure、visibility、applicability 和 consumer view 相关变化。 |

#### 6.29.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `exposure_change_record_id` | `CapabilityExposureChangeRecordId` | exposure 变化记录标识。 |
| `formal_exposure_id` | `FormalExposureBoundaryId` | 被变更 exposure。 |
| `change_kind` | `ExposureChangeKind` | 建立、调整、退役、可见性变化、consumer view 过期等类型。 |
| `previous_state` | `FormalExposureState` | 变化前 exposure 状态。 |
| `next_state` | `FormalExposureState` | 变化后 exposure 状态。 |

#### 6.29.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `requires_consumer_view_refresh()` | 判断是否触发 consumer view 刷新。 |
| `feeds_change_impact_fact()` | 判断是否需要生成 change / impact fact。 |

#### 6.29.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_exposure_change(ActorContext actor, FormalExposureBoundary exposure, ExposureChangeKind change_kind)` | 创建 exposure 变化记录。 |

#### 6.29.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 写成 runtime availability log | runtime 可用性不属于本对象。 |
| 携带 SDK client 状态 | SDK 状态不入仓。 |

### 6.30 CapabilityAccessTraceabilityRecord

#### 6.30.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯、变化与影响 |
| 对象类型 | audit / history object |
| 主要责任 | 连接 identity、registry、descriptor、seam、relation、exposure 的来源和变化解释。 |

#### 6.30.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `traceability_record_id` | `CapabilityAccessTraceabilityRecordId` | 追溯记录标识。 |
| `trace_subject` | `CapabilityTraceSubjectRef` | 被追溯的 capability 或关系主语。 |
| `source_change_ref` | `CapabilityChangeRecordRef` | 来源变化记录引用。 |
| `trace_reason` | `TraceabilityReason` | 追溯原因摘要。 |
| `handoff_refs` | `TraceabilityHandoffRefSet` | 可交接给审计或观测的 ref 集。 |

#### 6.30.3 状态集合

| 状态 | 作用 |
|---|---|
| `recorded` | 追溯记录已形成。 |
| `partial` | 部分来源不可解析。 |
| `handoff_pending` | 审计或外部 handoff 尚未完成。 |
| `superseded` | 被新追溯记录替代。 |

#### 6.30.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `covers_change(CapabilityChangeRecordRef change_ref)` | 判断追溯记录是否覆盖指定变化。 |
| `attach_handoff_ref(ObservabilityAuditRef audit_ref)` | 关联外部审计 / 观测 ref。 |
| `mark_partial(TraceabilityGapReason reason)` | 标记追溯缺口。 |

#### 6.30.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_for_change(CapabilityTraceSubjectRef trace_subject, CapabilityChangeRecordRef change_ref)` | 为 access truth 变化创建追溯记录。 |

#### 6.30.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 observability log / trace / metric 正文 | 只保存 ref 或安全摘要。 |
| 替代原 truth owner | traceability 只解释变化,不拥有原 truth。 |

### 6.31 CapabilityChangeImpactFact

#### 6.31.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯、变化与影响 |
| 对象类型 | domain fact |
| 主要责任 | 承载 capability access truth 变化对下游消费、派生材料和交接面的影响事实。 |

#### 6.31.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `impact_fact_id` | `CapabilityChangeImpactFactId` | 变化影响事实标识。 |
| `change_subject` | `CapabilityTraceSubjectRef` | 变化主语。 |
| `impact_scope` | `CapabilityImpactScope` | 影响范围摘要。 |
| `consumer_impact_summary` | `DownstreamConsumptionImpactSummary` | 下游消费影响摘要。 |
| `impact_state` | `CapabilityImpactState` | 影响感知状态。 |

#### 6.31.3 状态集合

| 状态 | 作用 |
|---|---|
| `identified` | 影响已识别。 |
| `partial` | 仅部分消费方影响已知。 |
| `delayed` | 下游感知延迟。 |
| `ignored` | 下游不需要处理该影响。 |
| `resolved` | 影响解释和必要派生已完成。 |

#### 6.31.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `affects_consumer(CapabilityConsumerRef consumer_ref)` | 判断变化是否影响指定消费方。 |
| `mark_delayed(ImpactDelayReason reason)` | 标记影响感知延迟。 |
| `summarize_for_handoff()` | 形成 handoff 摘要,不携带执行正文。 |

#### 6.31.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `derive_from_traceability(CapabilityAccessTraceabilityRecord traceability_record)` | 从追溯记录派生变化影响事实。 |

#### 6.31.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 下游失败回滚核心 truth | 下游消费失败只影响 impact / handoff。 |
| 保存 runtime execution payload | 执行正文不入仓。 |

### 6.32 DownstreamConsumptionImpactSummary

#### 6.32.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 追溯、变化与影响 |
| 对象类型 | safe summary / snapshot |
| 主要责任 | 承接 runtime、tools、SDK 或外围入口反馈的消费影响摘要,不保存下游执行 truth。 |

#### 6.32.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `impact_summary_id` | `DownstreamConsumptionImpactSummaryId` | 下游影响摘要标识。 |
| `consumer_ref` | `CapabilityConsumerRef` | 下游消费方引用。 |
| `impact_observation` | `ConsumptionImpactObservationSummary` | 下游影响观察摘要。 |
| `feedback_state` | `ConsumptionFeedbackState` | 反馈是否完整、延迟或不可用。 |

#### 6.32.3 状态集合

| 状态 | 作用 |
|---|---|
| `received` | 已收到下游影响摘要。 |
| `partial` | 下游反馈不完整。 |
| `delayed` | 下游反馈延迟。 |
| `unavailable` | 下游反馈不可用。 |
| `ignored` | 下游明确无需处理。 |

#### 6.32.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_actionable_for_impact()` | 判断摘要是否可用于 impact fact。 |
| `mark_partial(ConsumptionFeedbackGapReason reason)` | 标记反馈缺口。 |

#### 6.32.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_consumer_feedback(CapabilityConsumerRef consumer_ref, ConsumerFeedbackInput feedback_input)` | 从下游反馈创建安全摘要。 |

#### 6.32.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存下游执行正文或 runtime state | 只允许摘要。 |
| 反写 formal exposure | 下游影响不得改变 exposure truth。 |

### 6.33 DirectorySearchBrowseProjection

#### 6.33.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 派生维护与只读输出 |
| 对象类型 | projection / read model |
| 主要责任 | 从 registry、descriptor 和 exposure truth 派生目录搜索 / 浏览快照。 |

#### 6.33.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_id` | `DirectorySearchBrowseProjectionId` | 搜索 / 浏览投影标识。 |
| `source_registry_entry_id` | `CapabilityRegistryEntryId` | 投影来源 registry entry。 |
| `display_summary` | `CapabilityDirectoryDisplaySummary` | 可展示摘要,不作为 registry truth。 |
| `filter_facets` | `DirectorySearchFacetSet` | 搜索和浏览维度摘要。 |
| `freshness_state` | `DerivedMaterialFreshnessState` | 投影新鲜度。 |

#### 6.33.3 状态集合

| 状态 | 作用 |
|---|---|
| `ready` | 投影可读。 |
| `stale` | 投影落后于 truth。 |
| `rebuilding` | 投影正在重建。 |
| `unavailable` | 投影不可用,不影响核心 truth。 |

#### 6.33.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `refresh_from_registry(CapabilityRegistryEntry entry)` | 从 registry truth 刷新投影。 |
| `mark_stale(DerivedMaterialStaleReason reason)` | 标记投影过期。 |
| `is_read_only()` | 确认该投影只读且不可反写。 |

#### 6.33.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `build_from_access_truth(CapabilityRegistryEntry entry, AdapterDescriptor descriptor, FormalExposureBoundary exposure)` | 基于正式 truth 构建搜索 / 浏览投影。 |

#### 6.33.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 反写 registry 或 identity | projection 只读可重建。 |
| 写完整搜索索引 schema | 索引 schema 后移到详细设计。 |

### 6.34 AuditFriendlyExportSummary

#### 6.34.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 派生维护与只读输出 |
| 对象类型 | projection / export summary |
| 主要责任 | 形成审计友好的 access truth 摘要和 handoff 材料,不拥有 audit store。 |

#### 6.34.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `export_summary_id` | `AuditFriendlyExportSummaryId` | 导出摘要标识。 |
| `traceability_record_ref` | `CapabilityAccessTraceabilityRecordRef` | 摘要来源追溯记录。 |
| `export_scope` | `AuditExportScope` | 导出范围摘要。 |
| `allowed_summary` | `AuditAllowedSummary` | 允许导出的摘要内容。 |
| `export_state` | `AuditExportState` | 导出摘要当前状态。 |

#### 6.34.3 状态集合

| 状态 | 作用 |
|---|---|
| `ready` | 摘要可用于审计 handoff。 |
| `partial` | 仅部分摘要可用。 |
| `unavailable` | 摘要不可用。 |
| `stale` | 摘要需要重建。 |

#### 6.34.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `redact_for_audit_boundary()` | 根据审计边界进行摘要裁剪。 |
| `mark_partial(AuditExportGapReason reason)` | 标记导出缺口。 |
| `references_observability(ObservabilityAuditRef audit_ref)` | 关联观测 / 审计 ref。 |

#### 6.34.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `build_from_traceability(CapabilityAccessTraceabilityRecord traceability_record)` | 从追溯记录构建审计友好摘要。 |

#### 6.34.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw audit log 或 observability store | 只保存摘要和 ref。 |
| 作为正式验收 evidence | evidence alias 和验收签署后续 `05/06` 才能定义。 |

### 6.35 ReadOnlyEcosystemDiscoverySummary

#### 6.35.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 派生维护与只读输出 |
| 对象类型 | projection / read model |
| 主要责任 | 为生态入口或 marketplace 候选消费提供只读能力发现摘要,不形成 listing truth。 |

#### 6.35.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `ecosystem_summary_id` | `ReadOnlyEcosystemDiscoverySummaryId` | 生态发现摘要标识。 |
| `formal_exposure_id` | `FormalExposureBoundaryId` | 摘要来源 exposure。 |
| `ecosystem_context_ref` | `EcosystemContextRef` | 外围生态入口引用。 |
| `discoverability_summary` | `CapabilityDiscoverabilitySummary` | 只读发现摘要。 |
| `freshness_state` | `DerivedMaterialFreshnessState` | 摘要新鲜度。 |

#### 6.35.3 状态集合

| 状态 | 作用 |
|---|---|
| `ready` | 摘要可读。 |
| `partial` | 摘要缺少部分外围上下文。 |
| `stale` | 摘要过期。 |
| `unavailable` | 摘要不可用。 |

#### 6.35.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `refresh_from_exposure(FormalExposureBoundary exposure)` | 从 exposure 刷新只读发现摘要。 |
| `mark_unavailable(DiscoveryUnavailableReason reason)` | 标记摘要不可用。 |
| `is_listing_truth()` | 必须始终表达为 false 语义,防止误用。 |

#### 6.35.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `build_read_only_summary(FormalExposureBoundary exposure, EcosystemContextRef ecosystem_context_ref)` | 构建只读生态发现摘要。 |

#### 6.35.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 形成 marketplace listing / transaction truth | listing、交易、定价、履约归 marketplace。 |
| 阻塞核心 access truth 成立 | 生态发现是外围增强。 |

### 6.36 CapabilityReconciliationReport

#### 6.36.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 派生维护与只读输出 |
| 对象类型 | report / maintenance material |
| 主要责任 | 表达 registry、projection、consumer view、export 等派生材料的对账和重建结果。 |

#### 6.36.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `reconciliation_report_id` | `CapabilityReconciliationReportId` | 对账报告标识。 |
| `reconciliation_scope` | `CapabilityReconciliationScope` | 对账范围。 |
| `source_truth_refs` | `AccessTruthRefSet` | 对账使用的 truth 来源 ref。 |
| `finding_summary` | `ReconciliationFindingSummary` | 对账发现摘要。 |
| `report_state` | `ReconciliationReportState` | 报告状态。 |

#### 6.36.3 状态集合

| 状态 | 作用 |
|---|---|
| `completed` | 对账已完成。 |
| `partial` | 仅部分范围完成。 |
| `inconsistent` | 发现派生材料不一致。 |
| `rebuild_required` | 需要重建派生材料。 |
| `failed` | 对账失败,不回滚核心 truth。 |

#### 6.36.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `identifies_stale_material()` | 判断报告是否发现过期派生材料。 |
| `requires_rebuild()` | 判断是否需要重建 projection 或 consumer view。 |
| `does_not_change_truth()` | 明确报告不能修改核心 truth。 |

#### 6.36.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `create_for_scope(CapabilityReconciliationScope scope, AccessTruthRefSet source_truth_refs)` | 创建对账报告。 |

#### 6.36.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 根据对账报告创建新 registry entry | 维护不得创造新业务结论。 |
| 写完整 job 调度或 retry 规则 | 后移到 Step 8 / 详细设计。 |

### 6.37 DerivedMaterialPolicy

#### 6.37.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 派生维护与只读输出 |
| 对象类型 | policy / guard |
| 主要责任 | 约束 consumer view、search、browse、export、discovery、reconciliation 等派生材料只读、可重建、不得反写真相。 |

#### 6.37.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `DerivedMaterialPolicyScope` | policy 适用的派生材料范围。 |
| `truth_source_requirements` | `DerivedMaterialTruthSourceSet` | 派生材料必须读取的正式 truth 来源。 |
| `forbidden_write_targets` | `ForbiddenDerivedWriteTargetSet` | 禁止派生材料写入的核心 truth 目标。 |

#### 6.37.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_projection(DirectorySearchBrowseProjection projection)` | 校验 projection 来源与只读边界。 |
| `validate_export(AuditFriendlyExportSummary export_summary)` | 校验导出摘要不携带 forbidden body。 |
| `reject_truth_mutation(DerivedMaterialRef material_ref)` | 阻止派生材料改写核心 truth。 |

#### 6.37.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_derived_material()` | 生成默认派生材料 policy。 |

#### 6.37.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 projection 修正 identity / registry / descriptor | projection 只能读。 |
| 将 search / export 作为核心闭环前置 | 外围增强不阻塞核心 access truth。 |

### 6.38 ReferenceResolutionState

#### 6.38.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部引用与安全摘要支撑 |
| 对象类型 | domain state / reference state |
| 主要责任 | 统一表达 external source、governance、method、secret、consumer、SDK、observability、external document 等 ref 的解析状态。 |

#### 6.38.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `reference_id` | `ReferenceId` | 被解析引用标识。 |
| `reference_kind` | `ReferenceKind` | 引用类型。 |
| `resolution_value` | `ReferenceResolutionValue` | resolved、unresolved、stale、invalid、unavailable 等状态值。 |
| `resolution_reason` | `ReferenceResolutionReason` | 状态形成原因。 |
| `last_checked_at` | `ReferenceCheckedTime` | 最近解析检查时间语义。 |

#### 6.38.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | ref 可解析。 |
| `unresolved` | ref 无法解析。 |
| `stale` | ref 可能过期。 |
| `invalid` | ref 不符合本仓边界。 |
| `unavailable` | 外部来源暂不可用。 |
| `forbidden` | ref 试图携带 forbidden body。 |

#### 6.38.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_blocking_formal_exposure()` | 判断引用状态是否阻塞 formal exposure。 |
| `is_safe_for_read_model()` | 判断引用状态是否可进入只读材料。 |
| `mark_forbidden(ForbiddenBodyReason reason)` | 标记引用越界。 |

#### 6.38.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `resolved(ReferenceId reference_id, ReferenceKind reference_kind)` | 创建 resolved 状态。 |
| `unresolved(ReferenceId reference_id, ReferenceKind reference_kind, ReferenceFailureReason reason)` | 创建 unresolved 状态。 |

#### 6.38.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 根据不可解析 ref 补造 truth | 不可解析必须显式表达。 |
| 保存外部正文 | state 只表达解析状态。 |

### 6.39 ReferenceResolutionPolicy

#### 6.39.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部引用与安全摘要支撑 |
| 对象类型 | policy / guard |
| 主要责任 | 约束外部引用只能以 ref / safe summary 承接,不可解析时必须显式表达。 |

#### 6.39.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `ReferenceResolutionPolicyScope` | reference policy 作用范围。 |
| `allowed_reference_kinds` | `ReferenceKindSet` | 允许进入本仓的引用类型。 |
| `forbidden_bodies` | `ForbiddenExternalBodySet` | 禁止复制的外部正文类型。 |

#### 6.39.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `validate_reference(ReferenceCandidate reference_candidate)` | 校验引用是否可承接。 |
| `require_explicit_failure(ReferenceResolutionState state)` | 要求不可解析状态显式表达。 |
| `reject_external_body(ExternalBodyCandidate body_candidate)` | 拒绝外部正文进入本仓。 |

#### 6.39.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `default_for_capability_references()` | 生成默认引用解析 policy。 |

#### 6.39.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用字符串路径绕过 typed ref | 必须保留 ref 类型和解析状态。 |
| 静默降级为成功 | 失败必须显式表达。 |

### 6.40 ExternalDocumentRef

#### 6.40.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部引用与安全摘要支撑 |
| 对象类型 | reference object |
| 主要责任 | 指向外部协议、标准、文档或接入说明,不保存正文。 |

#### 6.40.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `external_document_ref_id` | `ExternalDocumentRefId` | 外部文档引用标识。 |
| `document_kind` | `ExternalDocumentKind` | 文档类别。 |
| `document_locator` | `ExternalDocumentLocatorSummary` | 外部定位摘要。 |
| `resolution_state` | `ReferenceResolutionState` | 文档引用解析状态。 |

#### 6.40.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | 文档 ref 可解析。 |
| `unresolved` | 文档 ref 不可解析。 |
| `stale` | 文档 ref 可能过期。 |
| `forbidden` | 文档内容不允许进入本仓摘要。 |

#### 6.40.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_descriptor(AdapterDescriptor descriptor)` | 判断文档 ref 是否可支撑 descriptor 解释。 |
| `mark_stale(ReferenceStaleReason reason)` | 标记文档引用过期。 |

#### 6.40.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_external_document_input(ExternalDocumentInput input)` | 从外部文档输入创建 ref。 |

#### 6.40.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存外部文档正文或协议全文 | 只保存 ref 和摘要。 |
| 锁定完整协议 schema | schema 后移。 |

### 6.41 RuntimeToolsConsumerRef

#### 6.41.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部引用与安全摘要支撑 |
| 对象类型 | reference object |
| 主要责任 | 指向 runtime / tools consumer 边界,供 exposure、consumer view 和 impact 使用。 |

#### 6.41.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `runtime_tools_consumer_ref_id` | `RuntimeToolsConsumerRefId` | runtime / tools consumer 引用标识。 |
| `consumer_kind` | `RuntimeToolsConsumerKind` | runtime、tools 或后续允许消费方类别。 |
| `consumer_scope` | `CapabilityConsumerScope` | 消费范围摘要。 |
| `resolution_state` | `ReferenceResolutionState` | consumer ref 是否可解析。 |

#### 6.41.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | consumer ref 可解析。 |
| `unresolved` | consumer ref 不可解析。 |
| `unavailable` | consumer 边界暂不可用。 |
| `stale` | consumer ref 需要刷新。 |

#### 6.41.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `can_consume_view(ControlledConsumerView consumer_view)` | 判断该 consumer 是否可消费给定 view。 |
| `mark_unavailable(ConsumerUnavailableReason reason)` | 标记下游不可用。 |

#### 6.41.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_runtime_tools_consumer(RuntimeToolsConsumerInput input)` | 创建 runtime / tools consumer ref。 |

#### 6.41.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 runtime execution state 或 tool result | 执行 truth 不归本仓。 |
| 反写 formal exposure | 下游 consumer 只能消费。 |

### 6.42 SdkExposureConsumerRef

#### 6.42.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部引用与安全摘要支撑 |
| 对象类型 | reference object |
| 主要责任 | 指向 SDK 消费服务端 capability exposure 的边界,不保存 SDK client 正文。 |

#### 6.42.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `sdk_consumer_ref_id` | `SdkExposureConsumerRefId` | SDK consumer 引用标识。 |
| `sdk_surface_summary` | `SdkSurfaceSummary` | SDK 可消费服务端面摘要,不是 SDK client 实现。 |
| `exposure_scope` | `SdkExposureScope` | SDK consumer 适用的 exposure 范围。 |
| `resolution_state` | `ReferenceResolutionState` | SDK consumer ref 是否可解析。 |

#### 6.42.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | SDK consumer ref 可解析。 |
| `unresolved` | SDK consumer ref 不可解析。 |
| `unavailable` | SDK 边界暂不可用。 |
| `stale` | SDK consumer ref 需要刷新。 |

#### 6.42.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_formal_exposure(FormalExposureBoundary exposure)` | 判断 ref 是否可支撑服务端 exposure handoff。 |
| `mark_unresolved(ReferenceFailureReason reason)` | 标记 SDK ref 不可解析。 |

#### 6.42.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_sdk_consumer_input(SdkConsumerInput input)` | 创建 SDK consumer ref。 |

#### 6.42.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 SDK client、binding、package 或 cache | 属于 `L0-sdk`。 |
| 让 SDK client 反写 exposure | 本仓只提供服务端边界。 |

### 6.43 ObservabilityAuditRef

#### 6.43.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 外部引用与安全摘要支撑 |
| 对象类型 | reference object |
| 主要责任 | 指向观测、审计或外部 GRC 材料位置,不保存观测 / 审计正文。 |

#### 6.43.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `observability_audit_ref_id` | `ObservabilityAuditRefId` | 观测 / 审计引用标识。 |
| `audit_material_kind` | `AuditMaterialKind` | 引用材料类别。 |
| `audit_locator` | `AuditMaterialLocatorSummary` | 外部材料定位摘要。 |
| `resolution_state` | `ReferenceResolutionState` | audit ref 是否可解析。 |

#### 6.43.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | audit ref 可解析。 |
| `unresolved` | audit ref 不可解析。 |
| `unavailable` | 外部材料暂不可用。 |
| `forbidden` | 外部材料不允许进入摘要。 |

#### 6.43.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_traceability(CapabilityAccessTraceabilityRecord traceability_record)` | 判断 ref 是否可支撑追溯 handoff。 |
| `mark_unavailable(AuditMaterialUnavailableReason reason)` | 标记外部审计材料不可用。 |

#### 6.43.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_audit_material_reference(AuditMaterialReferenceInput input)` | 创建观测 / 审计引用。 |

#### 6.43.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw log、trace、metric、alert 或 audit store 正文 | 观测存储不归本仓。 |
| 伪造 evidence alias 或验收证据 | 证据和验收后续 `05/06` 处理。 |

---

## 7. 每个主要组成部分的对象正式化停审记录

| 组成部分 | 正式对象 | 候选处理是否完成 | 功能来源是否清楚 | 排除 / 后移是否说明 | 越界检查 |
|---|---|---|---|---|---|
| 能力身份与接入语境 | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` | pass | 回指 `FR-CH-001~003`、`BR-CH-001/010/020/023/035` | identity summary 并入;service / command 后移 | 未写 provider runtime、认证 truth、governance approval。 |
| 注册目录与生命周期 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` | pass | 回指 `FR-CH-004~006/015/016`、`BR-CH-002/003/021/027/034` | registry visibility summary 并入;reconciliation report 归派生维护 | 未写 allowlist、runtime cache、listing、search truth。 |
| 接入描述与风险摘要 | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` | pass | 回指 `FR-CH-007~009`、`FR-CH-E04`、`BR-CH-004/005/013/022/031/035` | descriptor read summary 并入;protocol schema 后移 | 未写 ProviderContract、secret 正文、KMS、quota、route、cost、failover。 |
| 治理与方法关系 | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`GovernanceSeamChangeRecord`;`MethodRelationChangeRecord` | pass | 回指 `FR-CH-010~013`、`BR-CH-006/007/014/015/019/023/024/028/029/035/036` | seam / relation summary 并入;具体字段后移 | 未写 approval、Policy truth、shared_rules、method body。 |
| 正式暴露与受控消费 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`FormalExposurePolicy`;`ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`CapabilityExposureChangeRecord` | pass | 回指 `FR-CH-014~016`、`BR-CH-008/016/025/030/034/036` | SDK handoff contract 后移;consumer view refresh job 后移 | 未写 SDK client、runtime loop、tools execution、QueryCapabilities truth。 |
| 追溯、变化与影响 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | pass | 回指 `FR-CH-013/016`、`BR-CH-009/018/026/036/037` | trace / impact policy 并入;observability ref 归引用支撑 | 未写 audit store、runtime payload、cost ledger、evidence alias。 |
| 派生维护与只读输出 | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`;`DerivedMaterialPolicy` | pass | 回指 `FR-CH-006/014/016`、`FR-CH-E02/E06/E07`、`BR-CH-009/011/026/037/E001` | freshness state 后移 Step 9;job runner 后移 Step 7 / 8 | 未让 projection、export、discovery、reconciliation 反写真相。 |
| 外部引用与安全摘要支撑 | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef` | pass | 回指数据归属、接口依赖、forbidden body、引用一致性约束 | reference refresh history 并入;event collaboration port 后移 Step 7 | 未复制外部正文、SDK client、execution payload、observability store。 |

---

## 8. Step 8 / Step 9 对象反查清单

### 8.1 Step 8 关键处理流反查

| 预计处理流 | 必须能反查到的 Step 6 对象 | 说明 |
|---|---|---|
| 外部能力接入语境建立 | `CapabilityIdentity`;`ExternalCapabilitySourceRef`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`CapabilityIdentityChangeRecord` | 处理流不得直接写 provider runtime 或外部调用执行。 |
| identity 更正 / 合并 / 拆分 / 退役 | `CapabilityIdentity`;`CapabilityIdentityPolicy`;`CapabilityIdentityChangeRecord`;`CapabilityAccessTraceabilityRecord` | 消费面不得隐式修改 identity。 |
| registry 纳入 / 退出 / lifecycle 变化 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` | registry 不得退化为 allowlist 或 listing。 |
| adapter descriptor 建立 / 替换 | `AdapterDescriptor`;`DescriptorBoundaryPolicy`;`DescriptorRiskConstraintSummary`;`DescriptorChangeRecord`;`ExternalDocumentRef` | descriptor 不得成为 ProviderContract。 |
| secret ref / safe summary 承接 | `SecretRef`;`SecretHandlingSafeSummary`;`ReferenceResolutionState`;`ReferenceResolutionPolicy` | secret 正文永远 forbidden。 |
| governance seam 挂接 / 失效 | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`GovernanceSeamChangeRecord`;`ReferenceResolutionState` | seam 不生成 governance truth。 |
| capability-method relation 建立 / 移除 | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`MethodRelationChangeRecord`;`ReferenceResolutionState` | relation 必须 body-free。 |
| formal exposure 建立 / 调整 / 退役 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`FormalExposurePolicy`;`CapabilityExposureChangeRecord` | exposure 必须来源于 access truth。 |
| controlled consumer view 构建 / 刷新 | `ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`DerivedMaterialPolicy` | refresh 不反写 formal exposure。 |
| access traceability 记录 | `CapabilityAccessTraceabilityRecord`;`CapabilityIdentityChangeRecord`;`RegistryChangeRecord`;`DescriptorChangeRecord`;`GovernanceSeamChangeRecord`;`MethodRelationChangeRecord`;`CapabilityExposureChangeRecord` | trace 解释变化,不拥有原 truth。 |
| capability change / consumer impact 解释 | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary`;`ControlledConsumerView`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef` | 下游失败不回滚核心 truth。 |
| search / browse projection rebuild | `DirectorySearchBrowseProjection`;`CapabilityRegistryEntry`;`AdapterDescriptor`;`FormalExposureBoundary`;`DerivedMaterialPolicy`;`CapabilityReconciliationReport` | projection 只读可重建。 |
| audit-friendly export | `AuditFriendlyExportSummary`;`CapabilityAccessTraceabilityRecord`;`ObservabilityAuditRef`;`DerivedMaterialPolicy` | export 不保存 raw audit log。 |
| read-only ecosystem discovery | `ReadOnlyEcosystemDiscoverySummary`;`FormalExposureBoundary`;`DerivedMaterialPolicy` | 只读发现不形成 marketplace listing truth。 |
| reference resolution / safe summary refresh | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`ExternalCapabilitySourceRef`;`GovernanceResultRef`;`MethodAssetRef`;`SecretRef`;`ExternalDocumentRef`;`ObservabilityAuditRef` | 不可解析必须显式表达。 |
| event collaboration boundary | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`CapabilityExposureChangeRecord`;`ReferenceResolutionState` | Step 7 再定义 port / event skeleton,不在 Step 6 写 payload。 |

### 8.2 Step 9 状态机反查

| 状态主题 | Step 6 对象来源 | 当前状态集合线索 |
|---|---|---|
| capability identity lifecycle | `CapabilityIdentity` | candidate / active / correction_pending / retired / unresolved |
| access review fact lifecycle | `CapabilityAccessReviewFact` | draft / recorded / superseded / invalidated |
| external source ref resolution | `ExternalCapabilitySourceRef`;`ReferenceResolutionState` | resolved / unresolved / stale / invalid / unavailable / forbidden |
| registry lifecycle | `CapabilityRegistryEntry`;`RegistryLifecycleState` | draft / registered / undescribed / ungoverned / formal_visible / retired |
| descriptor lifecycle | `AdapterDescriptor` | draft / accepted / unresolved / replaced / retired |
| risk / constraint summary availability | `DescriptorRiskConstraintSummary` | available / partial / unavailable / superseded |
| secret ref / safe summary | `SecretRef`;`SecretHandlingSafeSummary` | resolved / unresolved / unavailable / forbidden / stale |
| governance seam lifecycle | `GovernanceSeamRelation`;`GovernanceResultRef` | pending / active / unresolved / expired / forbidden |
| method relation lifecycle | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef` | pending / active / removed / unresolved / forbidden |
| formal exposure lifecycle | `FormalExposureBoundary`;`FormalVisibilityApplicability` | draft / accepted / pending / unavailable / retired; visible / not_visible |
| consumer view freshness | `ControlledConsumerView`;`ConsumerViewFreshnessPolicy` | ready / stale / rebuilding / unavailable / partial |
| traceability / handoff | `CapabilityAccessTraceabilityRecord` | recorded / partial / handoff_pending / superseded |
| change impact | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | identified / partial / delayed / ignored / resolved |
| derived material freshness | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | ready / stale / rebuilding / partial / unavailable / inconsistent / rebuild_required / failed |

---

## 9. 跨对象 / 跨组成部分一致性审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 是否存在重复 owner | pass。`ControlledConsumerView` 归属“正式暴露与受控消费”;派生维护只负责刷新。`ObservabilityAuditRef` 归属“外部引用与安全摘要支撑”;追溯只引用。 | Step 7 / Step 8 必须保持 owner 与维护责任分离。 |
| 是否存在核心 truth 漏项 | pass。identity、registry、descriptor、seam、method relation、formal exposure、traceability、change / impact 均已正式化。 | 后续不得新增核心 truth 对象绕过 Step 6。 |
| 是否存在 projection 反写真相风险 | 已受 `DerivedMaterialPolicy`、`ConsumerViewFreshnessPolicy` 和对象禁止事项约束。 | Step 8 flow 必须坚持 projection / view / export 只读可重建。 |
| 是否存在 forbidden body 入仓 | 未发现。secret、governance、method、runtime、SDK、marketplace、observability 均以 ref / safe summary / projection 表达。 | Step 7 接口不得把 forbidden body 写进 request / event / DTO。 |
| 是否存在状态 owner 不清 | pass。identity、registry、descriptor、seam、method relation、exposure、consumer view、reference resolution、derived material 均有 Step 6 对象来源。 | Step 9 只从本清单继续扩展状态迁移。 |
| 是否存在 service / port / job 误作对象 | 已排除。`CapabilityAccessEventCollaborationPort` 和 `ConsumerViewRefreshJob` 后移 Step 7 / 8。 | Step 7 以 interface skeleton 承接,不回改 Step 6。 |
| 是否存在旧对象名回流 | 已排除 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault 对象。 | 旧材料仅保留在差异审计。 |
| 是否满足可落码粒度 | pass。每个对象有基本信息、字段骨架、状态 / 函数 / 工厂函数按需展开、禁止事项和后续反查。 | `03-详细设计.md` 可继续展开字段全集、函数签名、repository、API DTO 和状态迁移。 |

---

## 10. 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| `ProviderContract` 作为核心对象 | 不继承;由 `AdapterDescriptor`、`DescriptorRiskConstraintSummary`、`SecretRef`、`SecretHandlingSafeSummary` 和 `DescriptorBoundaryPolicy` 分层替代。 | 旧 ProviderContract 混入 secret、quota、route、cost、failover 和 provider runtime。 |
| `CapabilityDecision` / `QueryCapabilities` 作为查询与决策对象 | 不继承;由 `FormalExposureBoundary`、`FormalVisibilityApplicability` 和 `ControlledConsumerView` 分层替代。 | 查询视图不能成为第二 truth。 |
| `CostRecord` / cost accounting | 排除。 | cost / billing / finance ledger 已被正式 `00/01` 裁出本仓。 |
| KMS / Vault、secret envelope、API key 对象 | 不继承;只保留 `SecretRef` 与 `SecretHandlingSafeSummary`。 | 本仓不是 secret 平台,不得保存 secret 正文或 KMS truth。 |
| policy refresh、allow / deny、capability whitelist | 不继承;只保留 `GovernanceSeamRelation`、`GovernanceResultRef` 和 formal exposure 前置语义。 | governance truth 和 runtime enforcement 不归本仓。 |
| execution gateway、provider lookup、runtime routing | 排除。 | runtime / tools execution、provider orchestration 和 LLM routing 是边界外职责。 |
| 旧 `03` 的 repository、DTO、service、projection、state | 不作为 Step 6 来源。 | 旧详细设计未按新版 `00/01` 重启,且 repository / DTO / service 多数属于 Step 7 / 8 / 详细设计。 |

当前新增 blocker:

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| `CH-HLD-OBJECT-001` | 旧 `02/03` 与当前 Step 6 对象候选 | resolved_for_step_6 | 旧材料把 ProviderContract、CapabilityDecision、CostRecord、KMS / Vault、QueryCapabilities、policy refresh、execution gateway 和 runtime provider state 混入对象主线。 | Step 6 已从 Step 5 候选池重建 43 个关键对象,旧对象全部隔离为 historical material 或后移 / 排除项。 |

---

## 11. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` 时回填到 §6,当前不直接修改正式文档。

````md
## 6. 关键对象轮廓

> 校准来源:
> - `design-calibration/02_hld_step_06_key_objects.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_06_key_objects.md` 的“对象候选池筛选说明”“关键对象独立小节”“Step 8 / Step 9 对象反查清单”和“跨对象 / 跨组成部分一致性审计”小节,了解对象如何从 Step 5 候选池正式化。

### 6.1 对象候选池筛选说明

本章从 Step 5 对象发现维度表筛选关键对象。正式进入概要轮廓的对象包括:

| 主要组成部分 | 正式关键对象 |
|---|---|
| 能力身份与接入语境 | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`CapabilityIdentityPolicy`;`ExternalCapabilitySourceRef`;`CapabilityIdentityChangeRecord` |
| 注册目录与生命周期 | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryVisibilityPolicy`;`RegistryChangeRecord` |
| 接入描述与风险摘要 | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary`;`DescriptorBoundaryPolicy`;`DescriptorChangeRecord` |
| 治理与方法关系 | `GovernanceSeamRelation`;`GovernanceResultRef`;`GovernanceSeamPolicy`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef`;`MethodRelationBoundaryPolicy`;`GovernanceSeamChangeRecord`;`MethodRelationChangeRecord` |
| 正式暴露与受控消费 | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`FormalExposurePolicy`;`ControlledConsumerView`;`ConsumerViewFreshnessPolicy`;`CapabilityExposureChangeRecord` |
| 追溯、变化与影响 | `CapabilityAccessTraceabilityRecord`;`CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` |
| 派生维护与只读输出 | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport`;`DerivedMaterialPolicy` |
| 外部引用与安全摘要支撑 | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`ExternalDocumentRef`;`RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ObservabilityAuditRef` |

不作为关键对象展开的名称包括 repository、port、adapter、trigger、DTO、HTTP body、CloudEvent schema、database table、job runner、SDK client、旧 `ProviderContract`、旧 `CapabilityDecision`、旧 `CostRecord`、旧 `QueryCapabilities` 和 KMS / Vault 对象。它们分别后移到 Step 7 / Step 8 / `03-详细设计.md`,或作为 historical material 排除。

### 6.2 核心关键对象摘要

| 对象 | 对象类型 | 主要责任 |
|---|---|---|
| `CapabilityIdentity` | domain aggregate | 承载外部能力在本仓 access truth 中的稳定身份锚点。 |
| `CapabilityRegistryEntry` | domain aggregate | 承载正式能力注册目录项和生命周期锚点。 |
| `AdapterDescriptor` | domain aggregate | 承载接入方式、能力类型和边界摘要。 |
| `GovernanceSeamRelation` | domain relation | 承载 capability 与 governance result / policy result 的关系 truth。 |
| `CapabilityMethodBodyFreeRelation` | domain relation | 承载 capability 与 method asset 的无正文关系。 |
| `FormalExposureBoundary` | domain aggregate | 承载服务端正式能力暴露边界。 |
| `ControlledConsumerView` | projection / snapshot | 从 formal exposure 派生受控消费快照。 |
| `CapabilityAccessTraceabilityRecord` | audit / history object | 连接 access truth 的来源和变化解释。 |
| `CapabilityChangeImpactFact` | domain fact | 承载变化对下游消费、派生材料和 handoff 的影响事实。 |
| `ReferenceResolutionState` | domain state / reference state | 统一表达外部 ref 的 resolved / unresolved / stale / invalid / unavailable 语义。 |

### 6.3 对象边界说明

- `ControlledConsumerView` 归属“正式暴露与受控消费”,派生维护只负责 refresh / rebuild。
- `SecretRef` 和 `SecretHandlingSafeSummary` 只表达 secret 引用和允许安全摘要,不保存 secret 正文。
- `GovernanceResultRef` 和 `MethodAssetRef` 只表达相邻仓引用,不迁入 governance truth 或 method body。
- `DirectorySearchBrowseProjection`、`AuditFriendlyExportSummary`、`ReadOnlyEcosystemDiscoverySummary` 和 `CapabilityReconciliationReport` 都是派生 / 维护材料,不得反写核心 truth。
- Step 8 处理流和 Step 9 状态机只能引用本章已定义对象或在本章筛选说明中明确后移的接口 / flow 主语。
````

---

## 12. 待确认事项

### 12.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 6 是否拆附录 | A. 拆 4~5 个对象附录;B. 当前先保留单文件,Step 14 正式正文只摘摘要 | B | 本仓对象数量可在单 Step 文件中维护,正式 §6 只回填摘要;后续若文档继续膨胀再拆附录 | 已采用 B |
| `ControlledConsumerView` owner | A. 正式暴露与受控消费;B. 派生维护 | A | view 的业务语义是受控消费,派生维护只负责刷新 | 已采用 A |
| `ObservabilityAuditRef` owner | A. 追溯变化与影响;B. 外部引用与安全摘要支撑 | B | 它是外部 ref,追溯只使用 handoff ref | 已采用 B |
| history / change record 是否独立 | A. 独立核心 history;B. 全部并入 traceability | A | identity、registry、descriptor、seam、relation、exposure 变化会被 Step 8 / Step 9 / Step 10 反查,需保留对象主语 | 已采用 A |

### 12.2 本 Step 未确认事项

本步不新增阻塞 Step 7 的上游 blocker。以下事项继续后移:

- API / Command / Query / Event / Operations Job / external port 的正式接口骨架。
- governance seam 字段最小集合、method relation 摘要强度、descriptor taxonomy、secret safe summary 最小内容和 SDK handoff contract。
- 状态迁移方向、禁止迁移、跨状态传播和异常场景。
- repository、port、adapter、DTO、event payload、job 调度、projection schema、数据库结构和配置项。

---

## 13. 进入下一步条件

- 已从 Step 5 对象候选池完成对象正式化筛选。
- 已明确 43 个正式关键对象及其所属主要组成部分。
- 每个正式关键对象均有基本信息、关键字段骨架、状态集合 / 成员函数 / 工厂函数 / 禁止事项中的适用内容。
- 已明确哪些候选被并入、后移或排除。
- 已完成 8 个主要组成部分对象正式化停审。
- Step 8 / Step 9 将使用的对象均能在本步找到定义或后移说明。
- 跨对象 / 跨组成部分审计没有 unresolved 冲突。
- 未写完整字段模型、完整 Rust 签名、返回类型、trait、DTO、event payload、DDL、repository、port、adapter、job runner、配置项、测试结果、证据 alias、验收签署或实现 commit。
- 可以进入 Step 7 “API / 接口骨架”,但必须等待用户确认。
