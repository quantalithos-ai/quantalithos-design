# L3-capability-hub 02 概要 Step 8: 关键处理流 / 重要函数数据流

> 创建日期: 2026-07-09
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 从 Step 7 的 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job / External Port Skeleton、Step 6 的 43 个关键对象和 Step 5 的 8 个主要组成部分推导关键处理流;本步只定义概要级入口、application service、domain object / policy / projection / outbox candidate / external port 和结果流向,不写完整函数实现、Rust 签名、DTO schema、SQL、topic、payload、retry、worker loop、repository trait、事务脚本或测试结果。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 8 关键处理流 / 重要函数数据流 |
| 输出文件 | `design-calibration/02_hld_step_08_processing_flows.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`02_hld_step_01_upstream_boundary.md`;`02_hld_step_02_goals_scope.md`;`02_hld_step_03_constraints.md`;`02_hld_step_04_code_subject_framework.md`;`02_hld_step_05_components_boundary.md`;`02_hld_step_06_key_objects.md`;`02_hld_step_07_api_interface_skeleton.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 8;`概要设计书写规范.md` §4.8 和 §5.3.4;`设计文档讨论中间产物规范.md` |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` 的 `02` Step 8 中间产物 |
| 旧材料处理 | 旧 `02-概要设计.md`、旧 `03-详细设计.md` 和 README 只作后置差异审计 |
| 进入条件 | pass:Step 7 已完成且用户确认进入 Step 8 |
| next_allowed_action | Step 8 已完成,等待用户确认后进入 Step 9 `状态定义与状态流转`。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入处理流候选池。 |
| 接口到处理流候选池:先思考 | done | P0 Command / Query / Inbound / Job 展开判断 | pass | 进入候选池写入。 |
| 接口到处理流候选池:再写入 | done | 处理流覆盖清单和未展开理由 | pass | 进入通用处理流骨架。 |
| 通用处理流骨架 | done | Command / Query / Inbound / Job / Outbound Event Candidate 通用图 | pass | 进入逐组成部分小循环。 |
| 能力身份与接入语境处理流 | done | identity intake / lifecycle / review fact 处理流和停审 | pass | 进入注册目录处理流。 |
| 注册目录与生命周期处理流 | done | registry write / reconciliation 处理流和停审 | pass | 进入接入描述处理流。 |
| 接入描述与风险摘要处理流 | done | descriptor write / risk / secret safe summary 处理流和停审 | pass | 进入治理与方法关系处理流。 |
| 治理与方法关系处理流 | done | seam / method relation / inbound ref consumer 处理流和停审 | pass | 进入正式暴露处理流。 |
| 正式暴露与受控消费处理流 | done | formal exposure / controlled consumer view query 与 refresh 处理流和停审 | pass | 进入追溯影响处理流。 |
| 追溯、变化与影响处理流 | done | impact fact / downstream consumer / handoff 处理流和停审 | pass | 进入派生维护处理流。 |
| 派生维护与只读输出处理流 | done | search / export / discovery / reconciliation Job 处理流和停审 | pass | 进入外部引用处理流。 |
| 外部引用与安全摘要支撑处理流 | done | reference state / inbound reference / refresh / event collaboration 处理流和停审 | pass | 进入覆盖审计。 |
| Step 9 状态触发反查 | done | 状态主题与触发处理流映射 | pass | 进入跨处理流一致性审计。 |
| 跨处理流一致性审计 | done | 接口覆盖、对象引用、owner、边界和旧材料污染审计 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式 §8 回填草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 完成门禁与 Step 9 进入条件 | pass | 等待用户确认 Step 9。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 8 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 8 | 本步必须输出通用处理流骨架、按主要组成部分组织的关键处理流清单、关键接口 ASCII 图、关键设计点、未展开理由、停审和跨处理流审计。 | 不能只列流程名;每个关键 flow 必须回指 Step 7 接口和 Step 6 对象。 |
| `standards/document/概要设计书写规范.md` §4.8 | P0 Command、会改写本地状态的 Inbound Event Consumer、影响一致性 / 可靠性的 Operations Job 必须画独立处理流;复杂 Query 也需独立处理流。 | 本步按 P0 / complex / generic 分类,简单 Query 走通用读路径并说明原因。 |
| `standards/document/概要设计书写规范.md` §5.3.4 | 每张图必须有标题、`text` 代码块和 2~5 条关键说明;处理流主方向自上而下。 | 本文件所有图使用 `#### <接口名> 处理流` 标题、`│` 和 `▼` 自上而下表达。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 必须有开工确认、Step 内计划、问题回答、先思考 / 再写入、回填草稿和门禁。 | 本步保留候选筛选、逐组成部分停审、旧材料差异审计和下一步条件。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | 已收稳 8 个主要组成部分、capability 清单、对象候选池和交互总图。 | 处理流按主要组成部分组织,不按 handler、repository、adapter 或旧模块组织。 |
| `design-calibration/02_hld_step_06_key_objects.md` | 已正式化 43 个关键对象,并明确 `ControlledConsumerView`、`ObservabilityAuditRef`、`SecretRef` 等 owner。 | 处理流只能使用这些对象、ref、summary、projection、report、policy 或 Step 7 后移的 port / job 主语。 |
| `design-calibration/02_hld_step_07_api_interface_skeleton.md` | 已完成 Command / Query / Inbound / Outbound / Job / Port 分类和 Step 8 关键处理流反查。 | 本步从 Step 7 接口族筛选独立处理流,并对未独立展开接口给出通用路径或同构流理由。 |
| `projects/L3-capability-hub/00-需求文档.md` | `FR-CH-001~016` 和 `BR-CH-001~037` 固定 capability access truth、ref / safe summary、forbidden body 和事件协作边界。 | flow 必须守住 identity、registry、descriptor、seam、relation、exposure 和 change awareness 主线。 |
| `projects/L3-capability-hub/01-架构设计.md` | 已收稳同步裁定、异步传播、后台派生三分;核心 truth 强一致,派生 / ref / 外部交接显式失败。 | Command / Query / Inbound / Job 处理流必须分开;Query 和 Job 不得修核心 truth。 |
| `projects/L1-governance/design-calibration/02_hld_step_08_processing_flows.md` | 参考其通用处理流、P0 command、consumer、job 和跨处理流审计粒度。 | 只参考结构密度,不复制 governance 领域对象。 |
| `projects/L3-method-library/design-calibration/02_hld_step_08_processing_flows.md` | 参考其从 Step 7 接口族到处理流候选池、再到逐组成部分小循环的组织方式。 | 本步采用候选池、通用骨架、逐组成部分停审和旧材料后置审计结构。 |

---

## 3. SOP 问题回答

### 3.1 每个关键 Command 的写路径如何从入口进入 application service、domain object、repository / outbox?

关键 Command 使用同一条概要写路径:入口先验证 `ActorContext`、`CommandMetadata`、`IdempotencyKey` 和 typed request;application service 装载当前 truth、ref、safe summary、policy 和必要的 freshness / resolution surface;domain object / policy 判断不变量并形成 accepted / rejected / pending / unresolved 结果;repository boundary 只保存本仓拥有的 truth、relation、safe summary、change record 或 reference state;outbound event candidate 只由已提交事实或维护状态产生,不重新计算 truth。

### 3.2 每个关键 Query 如何从入口读取 projection 或只读视图?

简单 Query 只走通用只读路径,从 truth summary、projection、safe summary、reference state、trace record 或 report 组装 view。`GetControlledConsumerView`、`SearchCapabilityDirectory`、`GetReferenceResolutionState` 这类包含 freshness、visibility、projection readiness、reference failure 或 consumer boundary 的 Query 需要独立处理流。所有 Query 都不得刷新 projection、解析 ref、创建缺失对象、修复 truth 或写出站事件。

### 3.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或记录?

Inbound Event Consumer 先检查 event envelope、source event id、source system ref、dedup key、contract version、trace context 和 forbidden body。通过后只能形成本地 ref stale / pending / unresolved / resolved 标记、安全摘要承接、downstream impact summary 或 command intent;不能绕过 Command 改写 `GovernanceSeamRelation`、`CapabilityMethodBodyFreeRelation`、`CapabilityIdentity`、`FormalExposureBoundary` 等核心 truth。

### 3.4 每个关键 Operations Job 如何基于已持久化事实做发布、重建或对账?

Operations Job 从已持久化 truth、ref、safe summary、projection source refs 或 pending event refs 出发。registry reconciliation、consumer view refresh、search / browse rebuild、audit export preparation、ecosystem discovery rebuild、derived material reconciliation、external reference refresh 和 event collaboration repair 都只能产生 projection、summary、report、freshness state 或 handoff status,不得创建、退役、更正或回滚核心 truth。

### 3.5 处理流中点名的关键函数调用,参数分别是什么类型?

本步只点名概要层函数骨架,详细签名、返回类型、错误映射和事务切口留给 `03-详细设计.md`。

| 函数骨架 | 参数类型骨架 | 使用流 |
|---|---|---|
| `CapabilityIdentityPolicy.validate_new_identity(...)` | `CapabilityAccessIntakeContext intake_context`;`ExternalCapabilitySourceRef source_ref` | `EstablishCapabilityAccessContext` |
| `CapabilityIdentityPolicy.validate_correction(...)` | `CapabilityIdentity identity`;`IdentityCorrectionReason reason` | `CorrectCapabilityIdentity`;`RetireCapabilityIdentity` |
| `CapabilityAccessReviewFact.record_from_review(...)` | `ActorContext actor_context`;`CapabilityIdentity identity`;`AccessReviewContext review_context` | `RecordCapabilityAccessReviewFact` |
| `RegistryVisibilityPolicy.evaluate_entry(...)` | `CapabilityRegistryEntry registry_entry`;`VisibilityContext visibility_context` | registry write / visibility flow |
| `DescriptorBoundaryPolicy.assert_descriptor_body_free(...)` | `AdapterDescriptor descriptor`;`ExternalDocumentRef document_ref` | descriptor write flow |
| `DescriptorBoundaryPolicy.assert_secret_reference_allowed(...)` | `SecretRef secret_ref`;`SecretHandlingSafeSummary safe_summary` | secret safe summary flow |
| `GovernanceSeamPolicy.assert_relation_allowed(...)` | `GovernanceResultRef governance_result_ref`;`CapabilityAccessReviewFact review_fact` | governance seam flow |
| `MethodRelationBoundaryPolicy.assert_body_free(...)` | `MethodAssetRef method_asset_ref`;`BodyFreeSummary relation_summary` | method relation flow |
| `FormalExposurePolicy.assert_exposure_allowed(...)` | `CapabilityRegistryEntry registry_entry`;`AdapterDescriptor descriptor`;`GovernanceSeamRelation seam_relation` | formal exposure flow |
| `ConsumerViewFreshnessPolicy.evaluate_refresh(...)` | `ControlledConsumerView consumer_view`;`FormalExposureBoundary exposure_boundary` | controlled consumer view query / refresh flow |
| `DerivedMaterialPolicy.assert_rebuild_source_allowed(...)` | `DerivedMaterialSourceRefs source_refs`;`DerivedMaterialKind material_kind` | derived maintenance jobs |
| `ReferenceResolutionPolicy.assert_reference_allowed(...)` | `ReferenceKind reference_kind`;`ReferenceResolutionState resolution_state` | reference resolution flow |

### 3.6 哪些步骤必须在概要设计点名,哪些完整函数调用链应留给详细设计?

概要设计必须点名入口类别、service 编排职责、domain object / policy、truth / history / projection / ref / report 结果、event candidate 或 refresh hint 的边界。完整 DTO 字段、repository 函数、id generator、optimistic version、transaction boundary、outbox 表、topic、payload、retry、dead letter、worker loop、锁和错误码全集留给 `03-详细设计.md`。

### 3.7 哪些 P0 Command、改写本地状态的 Inbound Event、影响一致性的 Operations Job 必须画独立处理流?

P0 Command 是会建立或改变 capability access truth 主轴的入口:`EstablishCapabilityAccessContext`、`RegisterCapabilityInRegistry`、`EstablishAdapterDescriptor`、`AttachGovernanceSeamRelation`、`AttachCapabilityMethodRelation`、`EstablishFormalExposureBoundary`、`RecordCapabilityChangeImpactFact`、`RecordReferenceResolutionState`。同一状态族的更正、替换、退役、移除、挂起和摘要维护使用同构独立处理流并在覆盖清单列明。

会改写本地状态的 Inbound Event Consumer 包括 `ConsumeGovernanceResultReferenceChanged`、`ConsumeMethodAssetReferenceChanged`、`ConsumeDownstreamConsumptionImpactReported`、`ConsumeExternalCapabilitySourceReferenceChanged`、`ConsumeAuditMaterialReferenceChanged` 和 `ConsumeExternalDocumentReferenceChanged`。影响一致性、freshness、handoff 或传播可靠性的 Operations Job 全部画独立处理流。

### 3.8 哪些 Query 可以只走通用读路径,哪些 Query 必须画独立处理流?

按单一 ref 或 scope 读取 truth summary 的 Query 走通用读路径,例如 `GetCapabilityIdentity`、`GetAdapterDescriptor`、`GetGovernanceSeamRelation`、`GetCapabilityMethodRelation`、`GetCapabilityAccessTrace`。涉及 freshness / visibility / projection readiness / fallback / reference failure / consumer boundary 的 Query 必须独立展开,包括 `GetControlledConsumerView`、`SearchCapabilityDirectory`、`GetReferenceResolutionState`。

### 3.9 每个处理流属于哪个主要组成部分,承接哪个接口,使用哪些关键对象?

本文件 §7 按 8 个主要组成部分逐个展开处理流。跨组成部分对象保持 Step 6 owner: `ControlledConsumerView` 的业务读取 owner 是“正式暴露与受控消费”,刷新 Job owner 是“派生维护与只读输出”;`ObservabilityAuditRef` owner 是“外部引用与安全摘要支撑”,追溯只引用;`SecretRef` 和 `SecretHandlingSafeSummary` owner 是“接入描述与风险摘要”,reference resolution 只支撑解析状态。

### 3.10 是否存在接口没有处理流口径、处理流点名对象未定义、处理流跨组成部分但接缝未说明?

当前未发现 unresolved 缺口。Step 7 的接口已落到独立处理流、同构独立流、通用读路径、通用 inbound / event candidate 路径或通用 Job 路径。处理流中点名对象均来自 Step 6 或 Step 7 明确后移的 port / job 主语,跨组成部分 flow 均在覆盖清单说明 owner 和边界。

### 3.11 每个主要组成部分的处理流完成后是否通过停审?

§7 为每个主要组成部分保留停审记录,检查接口覆盖、对象承接、owner 分离、Query no-write、Job no-truth-repair、event no-payload-schema 和旧材料污染隔离。

---

## 4. 整体模块骨架

| 模块组 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 处理流候选筛选 | 从 Step 7 接口中判断独立处理流、同构独立流、通用读路径和统一事件产生说明。 | 不从旧 `02/03` 恢复 ProviderContract / QueryCapabilities / KMS / cost / execution flow。 |
| 通用处理流 | 建立 Command 写路径、Query 读路径、Inbound Consumer、Operations Job 和 Outbound Event Candidate 的共用骨架。 | 不替代 P0 Command / Inbound / Job 独立处理流。 |
| 独立处理流 | 为 P0 Command、改写本地状态的 Inbound、影响一致性的 Job、复杂 Query 画 ASCII 图并写关键设计点。 | 不为所有简单 Query 机械画重复图。 |
| 逐组成部分小循环 | 按 8 个主要组成部分分别判断、画图、覆盖同构接口并停审。 | 不一次性生成全仓总表后补归属。 |
| 对象与接口承接 | 每条 flow 必须回指 Step 6 对象和 Step 7 接口。 | 不在处理流中发明新领域对象、新接口、新状态或新 schema。 |
| 边界和接缝 | 点名 transaction-like 同步裁定、异步 event candidate、后台派生和 external port handoff 的概要边界。 | 不写 repository trait、outbox table、topic、payload、adapter、worker loop、retry、锁或配置 key。 |
| 回填草稿 | 准备正式 §8 的校准来源、覆盖清单和处理流摘要。 | 不修改正式 `02-概要设计.md`;正式回填等 Step 14。 |

---

## 5. Step 7 接口到处理流候选池接收

### 5.1 接口到处理流候选池:先思考

问题回答:

- Step 8 的处理流候选必须从 Step 7 的正式接口骨架出发。若某个 flow 无法回指 Step 7 接口和 Step 6 对象,则不能进入当前 Step。
- Command 不按每个 CRUD 动作机械重复,而按 truth family 画 P0 flow。更正、替换、失效、退役等同族命令必须在覆盖清单列明差异点。
- Query 默认只读。只有当 Query 需要处理 freshness、projection not ready、visibility / consumer scope、reference unresolved 或 fallback surface 时才画独立 flow。
- Inbound Event Consumer 只要会落本地状态、summary、stale marker 或 command intent,就必须有独立处理流口径。
- Operations Job 影响派生一致性、引用状态、handoff 或传播可靠性,必须有独立处理流。
- Outbound Event 本步只画统一候选产生路径,不写 reliable delivery、outbox、topic、payload、relay 或 consumer group。

诊断:

- 旧 `QueryCapabilities` 会把 formal exposure、consumer view、runtime allow / deny 和 policy refresh 混在一条查询 / 决策流里,本步必须拆开。
- 旧 `ProviderContract` flow 会把 descriptor、secret、provider runtime、quota、route、cost、failover 和 external call 执行合并,本步只保留 descriptor truth、secret ref 和 safe summary。
- 旧 execution gateway / denied invocation / cost flow 会把 runtime payload、cost ledger 和 observability store 写入本仓,必须排除。
- 如果 Step 8 不画 consumer view refresh、search rebuild、reference refresh 和 event collaboration repair,Step 9 状态和 Step 10 异常将缺少触发来源。

取舍:

- 采用 8 个 P0 Command 独立 flow、3 个 complex Query 独立 flow、6 个 Inbound Consumer 独立 / 同构 flow、8 个 Operations Job 独立 flow、1 个统一 Outbound Event Candidate flow。
- 同构 flow 在组成部分小节中明确“覆盖哪些接口、差异点是什么、为什么不重复画图”。
- 简单 ref / summary Query 只引用通用读路径,并在覆盖清单列明原因。

### 5.2 独立处理流候选总表

| 接口族 | 必须独立展开 | 同构独立 / 变体覆盖 | 默认通用路径 | 说明 |
|---|---|---|---|---|
| 能力身份与接入语境 | `EstablishCapabilityAccessContext`;`RecordCapabilityAccessReviewFact` | `CorrectCapabilityIdentity`;`RetireCapabilityIdentity` | `GetCapabilityIdentity`;`SearchCapabilityIdentities`;`GetCapabilityAccessReviewFact` | identity 建立、审查事实和 lifecycle 变化是核心 truth 起点。 |
| 注册目录与生命周期 | `RegisterCapabilityInRegistry`;`RunCapabilityRegistryReconciliation` | `UpdateRegistryLifecycleState`;`UpdateRegistryVisibilityBasis`;`RetireCapabilityRegistryEntry` | registry 查询 | registry write 与 reconciliation 均影响后续 exposure / derived freshness。 |
| 接入描述与风险摘要 | `EstablishAdapterDescriptor`;`RecordDescriptorRiskConstraintSummary` | `ReplaceAdapterDescriptor`;`AttachDescriptorSecretReference` | descriptor / risk / secret safe summary 查询 | descriptor 不得退化为 ProviderContract 或 KMS flow。 |
| 治理与方法关系 | `AttachGovernanceSeamRelation`;`AttachCapabilityMethodRelation`;`ConsumeGovernanceResultReferenceChanged`;`ConsumeMethodAssetReferenceChanged` | `ReplaceGovernanceSeamRelation`;`ExpireGovernanceSeamRelation`;`RemoveCapabilityMethodRelation` | seam / relation 查询 | relation truth 与外部 ref changed consumer 必须分开。 |
| 正式暴露与受控消费 | `EstablishFormalExposureBoundary`;`GetControlledConsumerView`;`RefreshControlledConsumerView` | `UpdateFormalVisibilityApplicability`;`SuspendFormalExposureBoundary`;`RetireFormalExposureBoundary` | exposure / visibility / SDK boundary 简单查询 | formal exposure 是 truth,consumer view 是 projection。 |
| 追溯、变化与影响 | `RecordCapabilityChangeImpactFact`;`ConsumeDownstreamConsumptionImpactReported`;`RecordTraceabilityHandoffSummary` | 无 | trace / impact / handoff 简单查询 | impact 不回滚 truth,audit handoff 不复制 store。 |
| 派生维护与只读输出 | `SearchCapabilityDirectory`;`RebuildDirectorySearchBrowseProjection`;`PrepareAuditFriendlyExportSummary`;`RebuildReadOnlyEcosystemDiscoverySummary`;`RunDerivedMaterialReconciliation` | `BrowseCapabilityDirectory` 走 search 同构读路径 | simple export / discovery / report query | 派生材料可重建,不得反写核心 truth。 |
| 外部引用与安全摘要支撑 | `RecordReferenceResolutionState`;`GetReferenceResolutionState`;`ConsumeExternalCapabilitySourceReferenceChanged`;`ConsumeAuditMaterialReferenceChanged`;`ConsumeExternalDocumentReferenceChanged`;`RefreshExternalReferenceResolution`;`RepairCapabilityAccessEventCollaboration` | `RegisterExternalDocumentReference`;`RegisterCapabilityConsumerReference` | consumer ref / document ref / audit ref simple query | reference state 和 event collaboration 是跨组件支撑边界。 |
| Outbound Event 候选 | `ProduceCapabilityAccessEventCandidate` 统一说明 | per-event candidate 由各 Command / Job 结果覆盖 | 不画 per-topic relay | 本步不定义 outbox、topic、payload 或可靠投递。 |

### 5.3 通用路径使用规则

| 通用路径 | 可覆盖接口 | 不可覆盖接口 |
|---|---|---|
| 通用 Command 写路径 | 同一 truth family 内的更正、替换、退役、移除、挂起和摘要维护,前提是 owner、对象和状态族已明确。 | P0 建立类 Command、跨仓 relation 挂接、formal exposure 建立、impact fact、reference state 建立。 |
| 通用 Query 读路径 | 简单按 ref / scope 读取 view、summary、trace、report 或 safe summary。 | consumer view freshness、directory search / browse、reference resolution failure 等需要显式 degraded surface 的 Query。 |
| 通用 Inbound Consumer 路径 | body-free ref / safe summary / marker 到达后形成 local state、stale marker 或 command intent。 | 携带正文、外部 lifecycle truth、runtime execution payload、tool result 或 SDK client state 的事件;这些不得进入本仓。 |
| 通用 Operations Job 路径 | 基于已持久化 truth / refs / source refs 刷新 projection、summary、report、handoff 或 reference state。 | Job 创建、退役、合并、更正 identity / registry / descriptor / seam / relation / exposure truth。 |
| 统一 Outbound Event Candidate 路径 | Command accepted 或 Job material refreshed 后形成 fact ref / summary ref / change kind / trace context。 | topic、payload schema、outbox relay、consumer group、retry、delivery SLA。 |

---

## 6. 通用处理流骨架

#### GenericCommandWritePath 处理流

```text
--------------------------------------------------------------+
| <Command API>                                                |
|  - ActorContext / CommandMetadata / IdempotencyKey           |
|  - typed ref / summary / intent                              |
+-----------------------------+--------------------------------+
                              │
                              ▼
+-----------------------------+--------------------------------+
| <Application Service>                                         |
|  - 校验接口归属和 actor / idempotency 边界                   |
|  - 装载当前 truth / ref / safe summary / policy               |
|  - 编排 domain object 形成 accepted / pending / rejected      |
+-----------------------------+--------------------------------+
                              │
                              ▼
+-----------------------------+--------------------------------+
| <Domain Object / Policy / Change Record>                      |
|  - 改写本仓拥有的 truth / relation / summary / reference      |
|  - 生成 change record / trace link / refresh hint             |
+-----------------------------+--------------------------------+
                              │
                              ▼
+-----------------------------+--------------------------------+
| <Persistence Boundary / Event Candidate>                      |
|  - 保存结果摘要和幂等 replay surface                         |
|  - 产生 body-free outbound event candidate                    |
+-----------------------------+--------------------------------+
                              │
                              ▼
+-----------------------------+--------------------------------+
| <Command Result>                                              |
+--------------------------------------------------------------+
```

关键说明:
- 图表达 Command 写路径的共同结构,不是 repository trait、事务隔离或数据库设计。
- Command 只能改写本仓拥有的 truth、relation、summary、reference state 或 history。
- event candidate 必须来自已提交事实,不得由 publisher 重新计算 capability truth。

#### GenericQueryReadPath 处理流

```text
<Query API>
  - ActorContext / QueryMetadata / scope ref / consistency hint
  │
  ▼
<Query Application Service>
  - 判断读取语境、consumer boundary 和可见范围
  - 选择 truth summary / projection / view / reference state
  │
  ▼
<Read Model / Projection / Safe Summary>
  - read only
  - 返回 freshness / unresolved / unavailable / not_visible surface
  │
  ▼
<Query Result>
```

关键说明:
- Query 不打开写路径,不刷新 projection,不解析外部 ref,不创建 missing truth。
- projection stale、not ready、unresolved 或 unavailable 必须进入结果 surface。
- 简单 Query 可引用本通用路径,复杂 Query 在 §7 独立展开。

#### GenericInboundEventConsumerPath 处理流

```text
<Inbound Event>
  - event envelope / source event id / dedup key / trace context
  │
  ▼
<Event Consumer>
  - 验证 source system / contract version / forbidden body
  - 判断重复、乱序、unsupported 或 unresolved
  │
  ▼
<Application Service>
  - 解析 ref / safe summary / body-free impact summary
  - 形成 local state marker 或 command intent
  │
  ▼
<Reference / Summary / Stale Marker>
  - 保存 ref resolution、safe summary 或 pending surface
  - 不绕过 Command 改写核心 truth
  │
  ▼
<Consumer Result>
```

关键说明:
- 图表达入站事件如何从外部已成立事实变成本仓 ref / summary / marker。
- 图没有表达 topic、payload 字段全集、consumer group、retry 或 dead letter。
- 最容易误解的边界是 command intent:它不是已提交 truth,后续仍需正式 Command 或人工处理。

#### GenericOperationsJobPath 处理流

```text
<Operations Job>
  - JobMetadata / system or operator actor / scope ref / run idempotency key
  │
  ▼
<Job Application Service>
  - 装载已持久化 truth / ref / safe summary / source refs
  - 判断 job scope 与 derived material policy
  │
  ▼
<Projection / Summary / Report Builder>
  - rebuild / refresh / prepare / reconcile
  - 只生成派生材料、报告、freshness 或 handoff status
  │
  ▼
<Material Persistence / Event Candidate>
  - 保存 projection / summary / report state
  - 产生 material refreshed 或 handoff status candidate
  │
  ▼
<Job Result Surface>
```

关键说明:
- Job 不创建、不更正、不退役核心 truth。
- Job 失败只能影响 stale、rebuilding、partial、unavailable 或 report state。
- 调度、锁、worker loop、retry、checkpoint 和补偿策略留给详细设计。

#### ProduceCapabilityAccessEventCandidate 处理流

```text
<Committed Command Result / Job Result>
  - fact ref / change record ref / summary ref / freshness state
  │
  ▼
<Event Candidate Assembler>
  - 选择 allowed change kind 和 trace context
  - 过滤 forbidden body、external payload、secret、method body
  │
  ▼
<CapabilityAccessEventCollaborationPort>
  - 形成 collaboration intent / pending delivery surface
  - 不重新计算 truth
  │
  ▼
<Outbound Event Candidate>
```

关键说明:
- 图表达出站事件候选如何从已提交事实或派生维护结果产生。
- 本步不定义 outbox 表、topic、payload、relay、consumer group 或投递重试。
- 投递失败不回滚已成立 truth,只影响 event collaboration / handoff surface。

---

## 7. 按主要组成部分组织的关键处理流

### 7.1 能力身份与接入语境

#### 7.1.1 本部分处理流判断:先思考

`EstablishCapabilityAccessContext` 是 identity truth 起点,必须独立画图。`CorrectCapabilityIdentity` 与 `RetireCapabilityIdentity` 属于同一 identity lifecycle change family,使用同构独立流说明消费面不得隐式改写身份。`RecordCapabilityAccessReviewFact` 会写入接入审查事实,也需要独立流。identity 查询只读取 truth / review summary,走通用 Query 读路径。

#### EstablishCapabilityAccessContext 处理流

```text
<EstablishCapabilityAccessContext Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - ExternalCapabilitySourceRef / CapabilityAccessIntakeContext
  │
  ▼
<CapabilityAccessIntakeService>
  - 校验 external source ref 和 intake context
  - 调用 CapabilityIdentityPolicy.validate_new_identity(CapabilityAccessIntakeContext intake_context, ExternalCapabilitySourceRef source_ref)
  │
  ▼
<CapabilityIdentity / CapabilityAccessReviewFact>
  - 创建 candidate 或 active identity
  - 记录初始 access review fact 与 separation marker
  │
  ▼
<Identity Persistence / Change Record>
  - 保存 CapabilityIdentity / CapabilityAccessReviewFact
  - 追加 CapabilityIdentityChangeRecord
  │
  ▼
<CapabilityIdentityCommandResult / CapabilityIdentityChanged candidate>
```

关键说明:
- 本流程建立 capability identity 和初始接入语境,但不执行外部 MCP / A2A / API 调用。
- `CapabilityAccessReviewFact` 只表达接入审查事实,不得升级为 governance approval。
- 外部来源正文、runtime config、SDK client、marketplace listing 不得替代 identity。

#### CorrectCapabilityIdentity / RetireCapabilityIdentity 处理流

```text
<CorrectCapabilityIdentity or RetireCapabilityIdentity Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityIdentityRef / IdentityCorrectionReason or RetirementReason
  │
  ▼
<CapabilityIdentityService>
  - 装载当前 CapabilityIdentity 和相关 change record 摘要
  - 调用 CapabilityIdentityPolicy.validate_correction(CapabilityIdentity identity, IdentityCorrectionReason reason)
  │
  ▼
<CapabilityIdentity>
  - 显式合并、拆分、更正或退役
  - 拒绝 consumer view、runtime 或 SDK 隐式改写
  │
  ▼
<Identity Change Record>
  - 保存变化原因、actor context 和 trace source
  │
  ▼
<Identity Lifecycle Result / CapabilityIdentityChanged candidate>
```

关键说明:
- 本流程覆盖 identity 更正与退役同族命令,差异在 change kind 和 reason。
- 消费面、搜索、SDK 或 runtime 只能读取 identity,不能触发隐式合并或拆分。
- 完整冲突检测、重复身份合并算法和并发控制留给详细设计。

#### RecordCapabilityAccessReviewFact 处理流

```text
<RecordCapabilityAccessReviewFact Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityIdentityRef / AccessReviewContext / AccessRiskSummary
  │
  ▼
<CapabilityAccessReviewService>
  - 装载 CapabilityIdentity 和 existing review summary
  - 校验 review fact 不携带 governance approval 正文
  │
  ▼
<CapabilityAccessReviewFact>
  - 调用 CapabilityAccessReviewFact.record_from_review(ActorContext actor_context, CapabilityIdentity identity, AccessReviewContext review_context)
  - 标记 separates_from_governance
  │
  ▼
<Review Fact Persistence>
  - 保存 review fact 和 trace source
  - 可产生 identity changed / review fact updated candidate
  │
  ▼
<CapabilityAccessReviewFactCommandResult>
```

关键说明:
- 本流程只写接入审查事实和风险解释摘要,不读取或生成 approval / Policy truth。
- 审查事实可以被 descriptor、seam 和 trace 引用,但不能成为 formal exposure 的唯一前置。
- review fact 字段全集、校验细节和历史替代规则留给详细设计。

#### 7.1.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `GetCapabilityIdentity` | 通用 Query 读路径 | `CapabilityIdentity`;`ExternalCapabilitySourceRef` | 单 ref 只读,无刷新或修复。 |
| `SearchCapabilityIdentities` | 通用 Query 读路径 | identity read model | 搜索只读,不得成为 registry truth。 |
| `GetCapabilityAccessReviewFact` | 通用 Query 读路径 | `CapabilityAccessReviewFact` | 单 fact 只读,不读取 governance truth。 |
| `CapabilityIdentityChanged` | 统一 event candidate 产生路径 | `CapabilityIdentityChangeRecord` | 本步不写 per-event payload / relay。 |

#### 7.1.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | 建立、更正、退役、审查事实和查询均已覆盖。 |
| 对象是否已定义 | pass | 使用 `CapabilityIdentity`、`CapabilityAccessReviewFact`、`CapabilityIdentityPolicy`、`ExternalCapabilitySourceRef`、`CapabilityIdentityChangeRecord`。 |
| 是否越界 | pass | 未执行外部调用,未保存外部正文,未生成 governance approval。 |
| Step 9 触发是否清楚 | pass | identity lifecycle 和 review fact lifecycle 有 Command 触发来源。 |

### 7.2 注册目录与生命周期

#### 7.2.1 本部分处理流判断:先思考

`RegisterCapabilityInRegistry` 是 registry truth 起点,必须独立画图。`UpdateRegistryLifecycleState`、`UpdateRegistryVisibilityBasis` 和 `RetireCapabilityRegistryEntry` 使用同构 registry lifecycle flow。`RunCapabilityRegistryReconciliation` 影响一致性和派生维护,必须独立画图。registry 查询走通用 Query 读路径。

#### RegisterCapabilityInRegistry 处理流

```text
<RegisterCapabilityInRegistry Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityIdentityRef / initial lifecycle intent
  │
  ▼
<CapabilityRegistryService>
  - 装载 CapabilityIdentity 和 existing registry summary
  - 判断 identity 是否可进入 registry
  │
  ▼
<CapabilityRegistryEntry / RegistryLifecycleState>
  - 创建 registry entry
  - 调用 RegistryVisibilityPolicy.evaluate_entry(CapabilityRegistryEntry registry_entry, VisibilityContext visibility_context)
  │
  ▼
<Registry Persistence / RegistryChangeRecord>
  - 保存 entry、lifecycle state、visibility basis
  - 追加 RegistryChangeRecord
  │
  ▼
<CapabilityRegistryCommandResult / CapabilityRegistryChanged candidate>
```

关键说明:
- registry truth 必须锚定稳定 `CapabilityIdentity`,不得由 URL、provider 名或 search result 直接创建。
- registry entry 不等于 allowlist、runtime cache、marketplace listing 或 execution availability。
- lifecycle 字段全集、状态迁移完整矩阵和唯一性约束留给 Step 9 / 03。

#### UpdateRegistryLifecycleState / RetireCapabilityRegistryEntry 处理流

```text
<UpdateRegistryLifecycleState or RetireCapabilityRegistryEntry Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityRegistryEntryRef / target lifecycle state / reason
  │
  ▼
<CapabilityRegistryLifecycleService>
  - 装载 registry entry、descriptor ref summary、seam precondition summary
  - 校验 target state 不由 runtime / marketplace / search 反向定义
  │
  ▼
<CapabilityRegistryEntry / RegistryLifecycleState>
  - 改变 lifecycle 或 retired surface
  - 产生 derived material refresh hint
  │
  ▼
<RegistryChangeRecord>
  - 保存 previous state / next state / change kind
  │
  ▼
<Lifecycle Command Result / CapabilityRegistryChanged candidate>
```

关键说明:
- 本流程覆盖生命周期更新、可见性依据更新和退出目录的同族动作。
- 变更可以影响 descriptor、formal exposure、consumer view 和 search freshness,但不得直接修这些对象的 truth。
- 完整状态机在 Step 9 定义,当前只固定处理流归属。

#### RunCapabilityRegistryReconciliation 处理流

```text
<RunCapabilityRegistryReconciliation Job>
  - JobMetadata / system or operator actor / registry scope / source truth refs
  │
  ▼
<RegistryReconciliationService>
  - 装载 registry entry summaries、change records、derived material refs
  - 判断 reconciliation scope 和 run idempotency key
  │
  ▼
<CapabilityReconciliationReport>
  - 记录 stale / inconsistent / rebuild_required finding
  - 不创建或修正 registry entry
  │
  ▼
<Report Persistence / DerivedMaterialRefreshed candidate>
  - 保存 report 和 freshness surface
  │
  ▼
<Registry Reconciliation Job Result>
```

关键说明:
- Job 只生成对账报告和派生状态,不修 registry truth。
- 若需要业务修复,必须回到正式 Command。
- 调度、锁、重试、报告字段全集和修复建议算法留给详细设计。

#### 7.2.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `UpdateRegistryVisibilityBasis` | registry lifecycle 同构流 | `RegistryVisibilityPolicy`;`RegistryChangeRecord` | 与 lifecycle 更新同一状态族,差异为 change kind。 |
| `GetCapabilityRegistryEntry` | 通用 Query 读路径 | `CapabilityRegistryEntry` | 单 entry 只读。 |
| `ListCapabilityRegistryEntries` | 通用 Query 读路径 | registry read model | 只读 page,不等同 search projection。 |
| `GetRegistryVisibilitySemantics` | 通用 Query 读路径 | `RegistryVisibilityPolicy`;state summary | 只解释 visibility basis,不形成 exposure。 |

#### 7.2.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | registry write、lifecycle、reconciliation、query、event 均已覆盖。 |
| 对象是否已定义 | pass | 使用 `CapabilityRegistryEntry`、`RegistryLifecycleState`、`RegistryVisibilityPolicy`、`RegistryChangeRecord`、`CapabilityReconciliationReport`。 |
| 是否越界 | pass | 未写 allowlist、marketplace listing、runtime cache 或 execution availability。 |
| Step 9 触发是否清楚 | pass | registry lifecycle 和 derived material freshness 有 Command / Job 触发来源。 |

### 7.3 接入描述与风险摘要

#### 7.3.1 本部分处理流判断:先思考

`EstablishAdapterDescriptor` 是 descriptor truth 起点,必须独立画图。`ReplaceAdapterDescriptor` 使用同构 descriptor lifecycle flow。`RecordDescriptorRiskConstraintSummary` 与 `AttachDescriptorSecretReference` 都会写 risk / safe summary 或 secret binding,必须在一个风险与安全摘要 flow 中覆盖。descriptor 查询走通用 Query 读路径。

#### EstablishAdapterDescriptor 处理流

```text
<EstablishAdapterDescriptor Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityIdentityRef / CapabilityRegistryEntryRef / ExternalCapabilitySourceRef
  - ExternalDocumentRef summary / descriptor intent
  │
  ▼
<AdapterDescriptorService>
  - 装载 identity、registry entry、external source ref、document ref
  - 调用 DescriptorBoundaryPolicy.assert_descriptor_body_free(AdapterDescriptor descriptor, ExternalDocumentRef document_ref)
  │
  ▼
<AdapterDescriptor>
  - 建立接入方式、能力类型和连接边界摘要
  - 拒绝 provider runtime、quota、route、cost、failover、request / response body
  │
  ▼
<Descriptor Persistence / DescriptorChangeRecord>
  - 保存 descriptor truth 和 change record
  - 产生 exposure / consumer view refresh hint
  │
  ▼
<AdapterDescriptorCommandResult / AdapterDescriptorChanged candidate>
```

关键说明:
- descriptor 表达接入描述 truth,不是旧 `ProviderContract`。
- external document 只作为 ref / summary,不保存协议正文或 API schema 全文。
- adapter taxonomy、字段全集、协议解析和外部 API adapter 实现留给后续文档。

#### RecordDescriptorRiskConstraintSummary / AttachDescriptorSecretReference 处理流

```text
<RecordDescriptorRiskConstraintSummary or AttachDescriptorSecretReference Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - AdapterDescriptorRef / risk input or SecretRef / SecretHandlingSafeSummary
  │
  ▼
<DescriptorRiskSummaryService>
  - 装载 AdapterDescriptor、review fact summary、secret reference state
  - 调用 DescriptorBoundaryPolicy.assert_secret_reference_allowed(SecretRef secret_ref, SecretHandlingSafeSummary safe_summary)
  │
  ▼
<DescriptorRiskConstraintSummary / SecretHandlingSafeSummary>
  - 更新风险、约束和安全处理摘要
  - 保持 secret value、KMS / Vault truth 和 provider credential body forbidden
  │
  ▼
<DescriptorChangeRecord>
  - 保存 summary change 和 trace source
  │
  ▼
<Descriptor Risk / Secret Reference Command Result>
```

关键说明:
- 本流程覆盖风险约束摘要维护和 secret ref 挂接两个同族写入。
- `SecretRef` 与 `SecretHandlingSafeSummary` 属于 descriptor 语义,但 secret 生命周期不归本仓。
- secret safe summary 的最小字段强度留给详细设计和安全边界校准。

#### 7.3.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `ReplaceAdapterDescriptor` | descriptor lifecycle 同构流 | `AdapterDescriptor`;`DescriptorChangeRecord` | 与建立 flow 同族,差异为 replacement reason 和历史保留。 |
| `GetAdapterDescriptor` | 通用 Query 读路径 | `AdapterDescriptor` | 只读 descriptor view。 |
| `GetDescriptorRiskConstraintSummary` | 通用 Query 读路径 | `DescriptorRiskConstraintSummary` | 只读风险摘要。 |
| `GetDescriptorSecretSafeSummary` | 通用 Query 读路径 | `SecretRef`;`SecretHandlingSafeSummary`;`ReferenceResolutionState` | 只读 safe summary,不调用 secret 平台。 |
| `ListDescriptorsByCapability` | 通用 Query 读路径 | descriptor read model | 列表读取,不形成 provider lookup truth。 |

#### 7.3.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | descriptor 建立 / 替换、风险摘要、secret ref 和查询均已覆盖。 |
| 对象是否已定义 | pass | 使用 `AdapterDescriptor`、`DescriptorRiskConstraintSummary`、`SecretRef`、`SecretHandlingSafeSummary`、`DescriptorBoundaryPolicy`、`DescriptorChangeRecord`。 |
| 是否越界 | pass | 未写 ProviderContract、KMS / Vault、provider runtime、quota、route、cost 或 failover。 |
| Step 9 触发是否清楚 | pass | descriptor lifecycle、risk summary availability、secret safe summary availability 有 Command 触发来源。 |

### 7.4 治理与方法关系

#### 7.4.1 本部分处理流判断:先思考

治理与方法关系有两类 truth family: `GovernanceSeamRelation` 和 `CapabilityMethodBodyFreeRelation`。挂接类 Command 必须独立,替换 / 失效 / 移除使用同构 flow。两个 Inbound Event Consumer 都会写 stale / pending / unresolved 或 command intent,必须独立说明,并与 Command 改写 relation truth 分开。

#### AttachGovernanceSeamRelation 处理流

```text
<AttachGovernanceSeamRelation Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityIdentityRef / CapabilityRegistryEntryRef / GovernanceResultRef / safe summary ref
  │
  ▼
<CapabilityGovernanceSeamService>
  - 装载 identity、registry entry、access review fact、governance result ref state
  - 调用 GovernanceSeamPolicy.assert_relation_allowed(GovernanceResultRef governance_result_ref, CapabilityAccessReviewFact review_fact)
  │
  ▼
<GovernanceSeamRelation>
  - 建立 capability 与 governance result 的 seam relation
  - 标记 pending / unresolved / forbidden 时不得伪装为 approved
  │
  ▼
<GovernanceSeamChangeRecord>
  - 保存 relation truth 和 change record
  - 产生 formal exposure / trace / derived refresh hint
  │
  ▼
<GovernanceSeamCommandResult / GovernanceSeamRelationChanged candidate>
```

关键说明:
- seam 只承接 governance result ref 或 allowed safe summary,不拥有 approval / Policy / shared_rules truth。
- access review fact 只用于职责分离,不得替代 governance result。
- `ReplaceGovernanceSeamRelation` 和 `ExpireGovernanceSeamRelation` 使用同族流,差异在 relation state 和 reason。

#### ConsumeGovernanceResultReferenceChanged 处理流

```text
<ConsumeGovernanceResultReferenceChanged Event>
  - event envelope / source event id / dedup key / GovernanceResultRef / safe summary ref
  │
  ▼
<GovernanceResultReferenceConsumer>
  - 验证 L1-governance 来源、contract version、forbidden body
  - 判断 duplicate / stale / unsupported / unresolved
  │
  ▼
<GovernanceSeamReferenceService>
  - 更新 ReferenceResolutionState 或 seam stale marker
  - 形成 seam update command intent
  │
  ▼
<GovernanceSeamRelation pending surface>
  - 不直接创建或替换 seam relation truth
  │
  ▼
<Consumer Result>
```

关键说明:
- Inbound event 只说明外部 governance ref 变化,不能绕过 Command 改写 relation truth。
- 事件输入不携带 approval、Policy、shared_rules 正文。
- command intent 的后续处理、重放和冲突规则留给详细设计。

#### AttachCapabilityMethodRelation 处理流

```text
<AttachCapabilityMethodRelation Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityIdentityRef / MethodAssetRef / relation scope / body-free summary
  │
  ▼
<CapabilityMethodRelationService>
  - 装载 capability identity、method asset ref state、existing relation summary
  - 调用 MethodRelationBoundaryPolicy.assert_body_free(MethodAssetRef method_asset_ref, BodyFreeSummary relation_summary)
  │
  ▼
<CapabilityMethodBodyFreeRelation>
  - 建立 capability 与 method asset 的 body-free relation
  - 拒绝 Method Content、TaskDefinition、version body 或 source truth
  │
  ▼
<MethodRelationChangeRecord>
  - 保存 relation truth 和 change record
  │
  ▼
<CapabilityMethodRelationCommandResult / CapabilityMethodRelationChanged candidate>
```

关键说明:
- relation 只保存 method asset ref 与允许摘要,不保存方法正文。
- `RemoveCapabilityMethodRelation` 使用同族流,差异为 removal reason 和 relation terminal surface。
- 完整适用性摘要、方法版本字段和关系冲突处理后移。

#### ConsumeMethodAssetReferenceChanged 处理流

```text
<ConsumeMethodAssetReferenceChanged Event>
  - event envelope / source event id / dedup key / MethodAssetRef / body-free summary
  │
  ▼
<MethodAssetReferenceConsumer>
  - 验证 L3-method-library 来源、contract version、forbidden body
  - 拒绝 method body、version body、definition source
  │
  ▼
<MethodRelationReferenceService>
  - 更新 ReferenceResolutionState 或 relation stale marker
  - 形成 relation update command intent
  │
  ▼
<CapabilityMethodBodyFreeRelation pending surface>
  - 不直接建立或移除 relation truth
  │
  ▼
<Consumer Result>
```

关键说明:
- method asset 变化进入本仓时只能是 ref / body-free summary。
- relation truth 仍由正式 Command 维护。
- event envelope、payload schema、topic 和 consumer group 留给详细设计。

#### 7.4.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `ReplaceGovernanceSeamRelation` | governance seam 同构流 | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord` | 与挂接同族,差异为 replacement reason。 |
| `ExpireGovernanceSeamRelation` | governance seam 同构流 | `GovernanceSeamRelation`;`GovernanceSeamChangeRecord` | 与挂接同族,差异为 expired / unresolved / forbidden surface。 |
| `RemoveCapabilityMethodRelation` | method relation 同构流 | `CapabilityMethodBodyFreeRelation`;`MethodRelationChangeRecord` | 与挂接同族,差异为 removal reason。 |
| seam / relation Queries | 通用 Query 读路径 | seam / relation read model | 只读 ref 和 body-free summary,不刷新 external refs。 |

#### 7.4.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | seam、method relation、两类 inbound、query、event 均已覆盖。 |
| 对象是否已定义 | pass | 使用 `GovernanceSeamRelation`、`GovernanceResultRef`、`GovernanceSeamPolicy`、`CapabilityMethodBodyFreeRelation`、`MethodAssetRef`、`MethodRelationBoundaryPolicy` 和 change records。 |
| 是否越界 | pass | 未写 governance approval、Policy truth、shared_rules、method body 或 publication。 |
| Step 9 触发是否清楚 | pass | seam lifecycle、method relation lifecycle 和 reference stale / pending 触发来源明确。 |

### 7.5 正式暴露与受控消费

#### 7.5.1 本部分处理流判断:先思考

`EstablishFormalExposureBoundary` 是服务端 formal exposure truth 起点,必须独立画图。visibility 更新、挂起和退役使用同构 formal exposure flow。`GetControlledConsumerView` 涉及 consumer boundary、freshness 和 projection readiness,必须独立画 Query flow。`RefreshControlledConsumerView` 的业务 view owner 仍是本部分,但 Job owner 在“派生维护与只读输出”,本小节先说明读取与触发边界,Job 在 §7.7 独立展开。

#### EstablishFormalExposureBoundary 处理流

```text
<EstablishFormalExposureBoundary Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityRegistryEntryRef / AdapterDescriptorRef / GovernanceSeamRelationRef / optional MethodRelationRef
  │
  ▼
<CapabilityExposureService>
  - 装载 registry、descriptor、governance seam、method relation summary
  - 调用 FormalExposurePolicy.assert_exposure_allowed(CapabilityRegistryEntry registry_entry, AdapterDescriptor descriptor, GovernanceSeamRelation seam_relation)
  │
  ▼
<FormalExposureBoundary / FormalVisibilityApplicability>
  - 建立服务端 formal exposure truth
  - 拒绝 consumer view、runtime query、SDK client 反向定义 exposure
  │
  ▼
<CapabilityExposureChangeRecord>
  - 保存 exposure truth、visibility / applicability 和 change record
  - 产生 consumer view refresh hint
  │
  ▼
<FormalExposureCommandResult / FormalExposureBoundaryChanged candidate>
```

关键说明:
- formal exposure 是服务端 truth,不等于 controlled consumer view、runtime allow / deny 或 SDK client。
- 未治理、未描述、未解析或 forbidden 前置必须显式 pending / unavailable / rejected。
- 更新可见性、挂起和退役使用同族 flow,完整状态迁移到 Step 9。

#### GetControlledConsumerView 处理流

```text
<GetControlledConsumerView Query>
  - ActorContext / QueryMetadata
  - RuntimeToolsConsumerRef or SdkExposureConsumerRef / capability scope / consistency hint
  │
  ▼
<ControlledConsumerViewQueryService>
  - 判断 consumer ref、exposure scope 和 read visibility
  - 装载 ControlledConsumerView freshness state
  │
  ▼
<ControlledConsumerView / ConsumerViewFreshnessPolicy>
  - 调用 ConsumerViewFreshnessPolicy.evaluate_refresh(ControlledConsumerView consumer_view, FormalExposureBoundary exposure_boundary)
  - 返回 ready / stale / rebuilding / unavailable surface
  │
  ▼
<Query Result>
  - 输出 consumer-safe view 和 freshness surface
  - 不刷新 view,不反写 formal exposure
```

关键说明:
- Query 只读受控消费快照,不执行 refresh job。
- stale / rebuilding / unavailable 必须显式返回,不得伪装成最新正式 exposure。
- runtime / tools / SDK consumer ref 只表达消费边界,不保存执行状态或 SDK client。

#### 7.5.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `UpdateFormalVisibilityApplicability` | formal exposure 同构流 | `FormalVisibilityApplicability`;`CapabilityExposureChangeRecord` | 与建立 exposure 同族,差异为 visibility / applicability intent。 |
| `SuspendFormalExposureBoundary` | formal exposure 同构流 | `FormalExposureBoundary`;`CapabilityExposureChangeRecord` | 与建立 exposure 同族,差异为 suspension surface。 |
| `RetireFormalExposureBoundary` | formal exposure 同构流 | `FormalExposureBoundary`;`FormalVisibilityApplicability` | 与建立 exposure 同族,差异为 terminal state。 |
| `GetFormalExposureBoundary` | 通用 Query 读路径 | `FormalExposureBoundary` | 单 truth 只读。 |
| `GetFormalVisibilityApplicability` | 通用 Query 读路径 | `FormalVisibilityApplicability` | 只解释 formal visibility,不改 view。 |
| `ListConsumableCapabilitiesForRuntimeTools` | `GetControlledConsumerView` 同构 Query | `ControlledConsumerView` | consumer-scope page 化读取,同样不刷新 view。 |
| `GetSdkExposureBoundary` | `GetControlledConsumerView` 同构 Query | `SdkExposureConsumerRef`;`FormalExposureBoundary` | 解释服务端 exposure,不定义 SDK package。 |

#### 7.5.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | exposure write、consumer view query、visibility read 和 event 候选均已覆盖。 |
| 对象是否已定义 | pass | 使用 `FormalExposureBoundary`、`FormalVisibilityApplicability`、`FormalExposurePolicy`、`ControlledConsumerView`、`ConsumerViewFreshnessPolicy`、`CapabilityExposureChangeRecord`。 |
| 是否越界 | pass | 未恢复 `QueryCapabilities`、allow / deny enforcement、runtime dispatch、SDK client 或 tools execution。 |
| Step 9 触发是否清楚 | pass | formal exposure lifecycle 和 consumer view freshness 触发来源明确。 |

### 7.6 追溯、变化与影响

#### 7.6.1 本部分处理流判断:先思考

追溯记录通常由各 Command 伴随形成,不把 trace append helper 暴露成 API。`RecordCapabilityChangeImpactFact` 会写本仓 impact fact,必须独立画图。`ConsumeDownstreamConsumptionImpactReported` 会落 `DownstreamConsumptionImpactSummary`,必须独立画 Inbound flow。`RecordTraceabilityHandoffSummary` 写 handoff marker,也需要独立 flow。trace / impact 查询走通用读路径。

#### RecordCapabilityChangeImpactFact 处理流

```text
<RecordCapabilityChangeImpactFact Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - source change record refs / DownstreamConsumptionImpactSummary / impact scope
  │
  ▼
<CapabilityChangeImpactService>
  - 装载 identity / registry / descriptor / seam / relation / exposure change records
  - 校验 downstream impact summary 为 body-free
  │
  ▼
<CapabilityChangeImpactFact / CapabilityAccessTraceabilityRecord>
  - 记录影响事实和 traceability link
  - 不回滚 source truth,不拥有 downstream truth
  │
  ▼
<Impact Persistence / Event Candidate>
  - 保存 impact fact
  - 产生 CapabilityChangeImpactIdentified candidate
  │
  ▼
<CapabilityChangeImpactCommandResult>
```

关键说明:
- impact fact 解释已成立变化与下游影响,不否定或回滚原 truth。
- downstream summary 不包含 execution payload、tool result、SDK client state 或 cost data。
- 影响聚合、排序、严重度模型和通知规则留给详细设计 / 测试方案。

#### ConsumeDownstreamConsumptionImpactReported 处理流

```text
<ConsumeDownstreamConsumptionImpactReported Event>
  - event envelope / source event id / dedup key
  - RuntimeToolsConsumerRef or SdkExposureConsumerRef / body-free impact summary
  │
  ▼
<DownstreamImpactConsumer>
  - 验证下游 consumer ref、contract version、forbidden body
  - 判断 duplicate / partial / delayed / ignored
  │
  ▼
<DownstreamConsumptionImpactSummary>
  - 保存 accepted / partial / ignored summary
  - 形成 impact fact command intent
  │
  ▼
<Impact Consumer Result>
  - 不接收 execution payload
  - 不改变 formal exposure 或 registry truth
```

关键说明:
- 下游影响回报只进入 summary,不能成为下游状态 truth。
- 该 consumer 不直接创建 `CapabilityChangeImpactFact`,只形成 command intent 或 pending surface。
- 幂等存储、乱序策略和具体 event payload 留给详细设计。

#### RecordTraceabilityHandoffSummary 处理流

```text
<RecordTraceabilityHandoffSummary Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - CapabilityAccessTraceabilityRecordRef / handoff scope / optional ObservabilityAuditRef
  │
  ▼
<TraceabilityHandoffService>
  - 装载 traceability record、change records、observability audit ref state
  - 校验 handoff 只输出 allowed summary 或 ref
  │
  ▼
<CapabilityAccessTraceabilityRecord>
  - 写入 handoff marker / unavailable / pending surface
  - 不复制 raw audit log、metric、trace 或 alert
  │
  ▼
<Traceability Handoff Persistence>
  - 保存 handoff summary ref
  - 提供 audit export job source
  │
  ▼
<TraceabilityHandoffCommandResult>
```

关键说明:
- `ObservabilityAuditRef` owner 是“外部引用与安全摘要支撑”,本流程只引用它做 handoff。
- handoff 失败不否定 capability access fact。
- audit store schema、导出字段全集和 evidence alias 不在本步伪造。

#### 7.6.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `GetCapabilityAccessTrace` | 通用 Query 读路径 | `CapabilityAccessTraceabilityRecord` | trace page 只读,不生成 audit。 |
| `GetCapabilityChangeImpact` | 通用 Query 读路径 | `CapabilityChangeImpactFact` | 只读 impact fact。 |
| `GetDownstreamConsumptionImpactSummary` | 通用 Query 读路径 | `DownstreamConsumptionImpactSummary` | 只读下游摘要,不拥有下游 truth。 |
| `GetAuditHandoffTraceSummary` | 通用 Query 读路径 | `ObservabilityAuditRef`;handoff summary | 只读 handoff surface,不输出 raw audit log。 |

#### 7.6.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | impact fact、downstream consumer、handoff 和 trace queries 均已覆盖。 |
| 对象是否已定义 | pass | 使用 `CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact`、`DownstreamConsumptionImpactSummary`、`ObservabilityAuditRef`。 |
| 是否越界 | pass | 未保存 runtime execution payload、observability store、audit log、cost ledger 或下游状态 truth。 |
| Step 9 触发是否清楚 | pass | change impact、downstream summary 和 handoff 状态触发来源明确。 |

### 7.7 派生维护与只读输出

#### 7.7.1 本部分处理流判断:先思考

本部分无业务 Command。复杂 Query `SearchCapabilityDirectory` 需要独立读路径,因为涉及 projection freshness、filters 和 non-truth 边界。所有 Job 都影响派生一致性或 handoff summary,必须独立或同构独立画图。`RefreshControlledConsumerView` 在本部分作为 Job owner 展开,但业务 view owner 仍是“正式暴露与受控消费”。

#### SearchCapabilityDirectory 处理流

```text
<SearchCapabilityDirectory Query>
  - ActorContext / QueryMetadata / directory search scope / filters / page / freshness hint
  │
  ▼
<CapabilityDirectoryQueryService>
  - 判断 search scope、visibility surface 和 projection freshness
  - 不补建 registry,不刷新 projection
  │
  ▼
<DirectorySearchBrowseProjection>
  - 读取 registry / descriptor / exposure 派生快照
  - 返回 ready / stale / rebuilding / unavailable surface
  │
  ▼
<DirectorySearchBrowseProjectionPage>
```

关键说明:
- search / browse projection 是派生快照,不得成为 registry、visibility 或 marketplace truth。
- Query 只读,projection stale 时返回 degraded surface。
- filter grammar、索引结构、排序规则和分页实现留给详细设计。

#### RefreshControlledConsumerView 处理流

```text
<RefreshControlledConsumerView Job>
  - JobMetadata / system or operator actor / FormalExposureBoundaryRef / consumer scope
  │
  ▼
<ControlledConsumerViewRefreshService>
  - 装载 formal exposure、descriptor safe summary、consumer refs
  - 调用 ConsumerViewFreshnessPolicy.evaluate_refresh(ControlledConsumerView consumer_view, FormalExposureBoundary exposure_boundary)
  │
  ▼
<ControlledConsumerView>
  - 重建 consumer-safe snapshot
  - 标记 ready / stale / rebuilding / unavailable
  │
  ▼
<Consumer View Material Persistence>
  - 保存 refreshed view 和 freshness surface
  - 产生 ControlledConsumerViewAvailabilityChanged candidate
  │
  ▼
<Consumer View Refresh Job Result>
```

关键说明:
- Job 只重建 `ControlledConsumerView`,不改写 `FormalExposureBoundary`。
- runtime / tools / SDK 只消费 view,不得把本地 cache 反写服务端 truth。
- 刷新触发、并发、缓存和传播窗口留给详细设计 / 测试 / 验收。

#### RebuildDirectorySearchBrowseProjection 处理流

```text
<RebuildDirectorySearchBrowseProjection Job>
  - JobMetadata / registry-descriptor-exposure scope / source truth refs
  │
  ▼
<DirectoryProjectionRebuildService>
  - 装载 registry entries、descriptor summaries、formal exposure refs
  - 调用 DerivedMaterialPolicy.assert_rebuild_source_allowed(DerivedMaterialSourceRefs source_refs, DerivedMaterialKind material_kind)
  │
  ▼
<DirectorySearchBrowseProjection>
  - 重建 search / browse projection
  - 标记 freshness 和 rebuild summary
  │
  ▼
<Projection Persistence / DerivedMaterialRefreshed candidate>
  │
  ▼
<Directory Projection Rebuild Result>
```

关键说明:
- projection 可重建且只读,不得补造 registry entry 或 descriptor。
- rebuild 失败只影响 projection freshness,不影响核心 truth。
- 索引后端、字段映射、批处理和 checkpoint 留给详细设计。

#### PrepareAuditFriendlyExportSummary 处理流

```text
<PrepareAuditFriendlyExportSummary Job>
  - JobMetadata / traceability scope / allowed export scope / optional ObservabilityAuditRef
  │
  ▼
<AuditFriendlyExportService>
  - 装载 traceability records、change records、handoff summary refs
  - 校验 export scope 不包含 raw audit store 或 forbidden body
  │
  ▼
<AuditFriendlyExportSummary>
  - 生成 allowed summary / partial / unavailable surface
  │
  ▼
<Export Summary Persistence / DerivedMaterialRefreshed candidate>
  │
  ▼
<Audit Export Preparation Result>
```

关键说明:
- 本流程只输出审计友好摘要或 ref,不复制 observability / audit store。
- export summary 是派生材料,不得成为 access truth。
- 具体导出格式、证据编号、签署和验收证据留给后续文档。

#### RebuildReadOnlyEcosystemDiscoverySummary 处理流

```text
<RebuildReadOnlyEcosystemDiscoverySummary Job>
  - JobMetadata / FormalExposureBoundaryRef / ecosystem context ref
  │
  ▼
<ReadOnlyEcosystemDiscoveryService>
  - 装载 formal exposure、consumer-safe descriptor summary、allowed ecosystem refs
  - 校验 marketplace listing / transaction / pricing / fulfillment forbidden
  │
  ▼
<ReadOnlyEcosystemDiscoverySummary>
  - 重建只读生态发现摘要
  - 标记 freshness / partial / unavailable
  │
  ▼
<Discovery Summary Persistence / DerivedMaterialRefreshed candidate>
  │
  ▼
<Ecosystem Discovery Rebuild Result>
```

关键说明:
- discovery summary 是只读外围增强,不形成 marketplace listing truth。
- marketplace、console 或 SDK 文档消费失败不阻塞核心闭环。
- ecosystem object ref 强度、展示字段和过滤规则后移。

#### RunDerivedMaterialReconciliation 处理流

```text
<RunDerivedMaterialReconciliation Job>
  - JobMetadata / derived material scope / source truth refs
  │
  ▼
<DerivedMaterialReconciliationService>
  - 比对 consumer view、directory projection、export summary、discovery summary source refs
  - 判断 missing / stale / inconsistent / rebuild_required
  │
  ▼
<CapabilityReconciliationReport>
  - 记录 finding summary
  - 不修改 truth 或 projection
  │
  ▼
<Reconciliation Report Persistence>
  │
  ▼
<Derived Material Reconciliation Result>
```

关键说明:
- reconciliation report 只解释不一致,不自动修复业务 truth。
- 需要重建时触发对应 Job,需要业务变更时回到正式 Command。
- finding schema、自动化策略和告警规则留给详细设计 / 运维设计。

#### 7.7.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `BrowseCapabilityDirectory` | `SearchCapabilityDirectory` 同构 Query | `DirectorySearchBrowseProjection` | 同一 projection,差异为 facet / browse scope。 |
| `GetAuditFriendlyExportSummary` | 通用 Query 读路径 | `AuditFriendlyExportSummary` | 只读 summary state。 |
| `GetReadOnlyEcosystemDiscoverySummary` | 通用 Query 读路径 | `ReadOnlyEcosystemDiscoverySummary` | 只读 discovery summary。 |
| `GetCapabilityReconciliationReport` | 通用 Query 读路径 | `CapabilityReconciliationReport` | 只读 report,不得自动修 truth。 |

#### 7.7.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | search / browse、consumer view refresh、projection rebuild、export、discovery、reconciliation 均已覆盖。 |
| 对象是否已定义 | pass | 使用 `ControlledConsumerView`、`DirectorySearchBrowseProjection`、`AuditFriendlyExportSummary`、`ReadOnlyEcosystemDiscoverySummary`、`CapabilityReconciliationReport`、`DerivedMaterialPolicy`。 |
| 是否越界 | pass | 未让派生材料反写 identity / registry / descriptor / seam / relation / exposure。 |
| Step 9 触发是否清楚 | pass | consumer view freshness、derived material freshness 和 reconciliation state 有 Job 触发来源。 |

### 7.8 外部引用与安全摘要支撑

#### 7.8.1 本部分处理流判断:先思考

本部分负责 reference state、external document / consumer / observability refs 和 event collaboration。`RecordReferenceResolutionState` 是 reference truth / state 维护起点,必须独立。`GetReferenceResolutionState` 因包含 unresolved / stale / forbidden surface,必须独立 Query flow。所有外部 ref changed consumer 会写本地 state 或 marker,必须独立或同构展开。`RefreshExternalReferenceResolution` 和 `RepairCapabilityAccessEventCollaboration` 影响 ref 一致性和传播可靠性,必须独立画图。

#### RecordReferenceResolutionState 处理流

```text
<RecordReferenceResolutionState Command>
  - ActorContext / CommandMetadata / IdempotencyKey
  - reference candidate / ReferenceKind / resolution value / reason
  │
  ▼
<CapabilityReferenceResolutionService>
  - 判断 reference kind、owner component 和 forbidden body
  - 调用 ReferenceResolutionPolicy.assert_reference_allowed(ReferenceKind reference_kind, ReferenceResolutionState resolution_state)
  │
  ▼
<ReferenceResolutionState>
  - 记录 resolved / unresolved / stale / invalid / unavailable / forbidden
  - 保留 reference trace marker
  │
  ▼
<Reference State Persistence / ReferenceResolutionChanged candidate>
  │
  ▼
<ReferenceResolutionCommandResult>
```

关键说明:
- reference state 只表达外部 ref 可解析性,不补造外部 truth。
- `RegisterExternalDocumentReference` 与 `RegisterCapabilityConsumerReference` 使用本 flow 的同构变体。
- 外部协议正文、SDK client、runtime execution state、observability store 均 forbidden。

#### GetReferenceResolutionState 处理流

```text
<GetReferenceResolutionState Query>
  - ActorContext / QueryMetadata / reference id / ReferenceKind / scope
  │
  ▼
<ReferenceResolutionQueryService>
  - 判断读取者 scope 和 reference owner
  - 读取 ReferenceResolutionState 和 ReferenceResolutionPolicy summary
  │
  ▼
<ReferenceResolutionState View>
  - 返回 resolved / unresolved / stale / invalid / unavailable / forbidden surface
  - 不自动刷新外部 ref
  │
  ▼
<ReferenceResolutionState Query Result>
```

关键说明:
- Query 不触发 external lookup 或 refresh job。
- unresolved / unavailable 必须显式返回,不得由调用方补造 truth。
- ref state 字段全集和具体 external resolver adapter 留给详细设计。

#### ConsumeExternalCapabilitySourceReferenceChanged 处理流

```text
<ConsumeExternalCapabilitySourceReferenceChanged Event>
  - event envelope / source event id / dedup key / ExternalCapabilitySourceRef / source kind
  │
  ▼
<ExternalCapabilitySourceReferenceConsumer>
  - 验证外部 MCP / A2A / API 来源边界和 forbidden body
  - 判断 candidate accepted / stale / unresolved
  │
  ▼
<ReferenceResolutionState / Identity Intake Intent>
  - 更新 source ref state
  - 必要时形成 identity intake command intent
  │
  ▼
<Consumer Result>
  - 不直接创建 CapabilityIdentity
```

关键说明:
- 外部来源变化不能直接创建 identity 或 descriptor。
- 外部来源正文、响应 body、provider runtime 和调用结果不得入仓。
- 自动发现候选与正式接入 Command 的衔接留给详细设计。

#### ConsumeAuditMaterialReferenceChanged / ConsumeExternalDocumentReferenceChanged 处理流

```text
<ConsumeAuditMaterialReferenceChanged or ConsumeExternalDocumentReferenceChanged Event>
  - event envelope / source event id / dedup key
  - ObservabilityAuditRef or ExternalDocumentRef / safe summary or document change summary
  │
  ▼
<ExternalReferenceConsumer>
  - 验证来源边界、contract version 和 forbidden body
  - 判断 audit ref 或 document ref 的 resolved / stale / forbidden
  │
  ▼
<ReferenceResolutionState>
  - 更新 audit / document ref resolution surface
  - 标记 handoff pending 或 descriptor support review needed
  │
  ▼
<Consumer Result>
  - 不复制 audit store、raw log、metric、trace、API spec 全文或 provider contract
```

关键说明:
- 两类 consumer 同构:都只更新 external ref state 和 pending surface。
- audit / document 正文禁止进入本仓。
- 具体 adapter、payload、retry、dead letter 留给详细设计。

#### RefreshExternalReferenceResolution 处理流

```text
<RefreshExternalReferenceResolution Job>
  - JobMetadata / reference scope / allowed reference kinds / run idempotency key
  │
  ▼
<ExternalReferenceRefreshService>
  - 装载 reference states、allowed policy、owner component mapping
  - 刷新 ref state surface,不读取 forbidden body
  │
  ▼
<ReferenceResolutionState>
  - 更新 resolved / unresolved / stale / unavailable
  - 产生 ReferenceResolutionChanged candidate
  │
  ▼
<Reference Refresh Job Result>
```

关键说明:
- Job 只刷新 reference state,不创建 identity、descriptor、seam、relation 或 exposure truth。
- 外部调用细节、超时、重试和 adapter 实现留给详细设计。
- ref 不可解析时应显式 unresolved / unavailable,不得补造外部事实。

#### RepairCapabilityAccessEventCollaboration 处理流

```text
<RepairCapabilityAccessEventCollaboration Job>
  - JobMetadata / event collaboration scope / pending event refs / run idempotency key
  │
  ▼
<CapabilityAccessEventCollaborationService>
  - 装载 outbound event candidates、change record refs、impact summary refs
  - 判断 collaboration intent / pending delivery / handoff status
  │
  ▼
<CapabilityAccessEventCollaborationPort>
  - 修复 pending delivery 或 handoff status surface
  - 不重新计算 truth,不改 event payload schema
  │
  ▼
<Event Collaboration Repair Result>
```

关键说明:
- event collaboration repair 只处理投递 / handoff surface,失败不回滚 truth。
- 本步不写 topic、payload、outbox、relay、consumer group、retry 或 SLA。
- `CapabilityAccessEventCollaborationPort` 是 external port skeleton,不是 Rust trait 或 adapter 实现。

#### 7.8.2 本部分覆盖清单

| 接口 | 处理流口径 | 使用对象 | 未独立画图原因 |
|---|---|---|---|
| `RegisterExternalDocumentReference` | `RecordReferenceResolutionState` 同构 Command | `ExternalDocumentRef`;`ReferenceResolutionState` | 同一 reference state 写路径,差异为 document kind。 |
| `RegisterCapabilityConsumerReference` | `RecordReferenceResolutionState` 同构 Command | `RuntimeToolsConsumerRef`;`SdkExposureConsumerRef`;`ReferenceResolutionState` | 同一 reference state 写路径,差异为 consumer kind。 |
| `GetExternalDocumentReference` | 通用 Query 读路径 | `ExternalDocumentRef`;`ReferenceResolutionState` | 只读 ref view,不返回正文。 |
| `GetRuntimeToolsConsumerReference` | 通用 Query 读路径 | `RuntimeToolsConsumerRef` | 只读 consumer ref,不读取 execution state。 |
| `GetSdkExposureConsumerReference` | 通用 Query 读路径 | `SdkExposureConsumerRef` | 只读 SDK consumer ref,不返回 SDK client。 |
| `GetObservabilityAuditReference` | 通用 Query 读路径 | `ObservabilityAuditRef` | 只读 audit ref,不读取 observability store。 |

#### 7.8.3 本部分停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 接口是否都有处理流口径 | pass | reference command、query、inbound consumer、refresh job、event collaboration job 和 port 均已覆盖。 |
| 对象是否已定义 | pass | 使用 `ReferenceResolutionState`、`ReferenceResolutionPolicy`、`ExternalDocumentRef`、`RuntimeToolsConsumerRef`、`SdkExposureConsumerRef`、`ObservabilityAuditRef`、`CapabilityAccessEventCollaborationPort`。 |
| 是否越界 | pass | 未保存外部正文、governance truth、method body、secret 正文、execution payload、SDK client、audit store 或 event payload schema。 |
| Step 9 触发是否清楚 | pass | reference resolution state、external source state、event collaboration status 有 Command / Consumer / Job 触发来源。 |

---

## 8. 处理流覆盖与未展开说明

### 8.1 全局覆盖清单

| 接口 / 接口族 | 处理流归属 | 是否独立画图 | 处理说明 |
|---|---|---|---|
| identity 建立 / 更正 / 退役 / review fact | 能力身份与接入语境 | 是 | 建立、lifecycle change、review fact 分别覆盖。 |
| registry 纳入 / lifecycle / reconciliation | 注册目录与生命周期 | 是 | registry truth 和 reconciliation report 分开。 |
| descriptor 建立 / 替换 / risk / secret summary | 接入描述与风险摘要 | 是 | descriptor truth 与风险 / secret safe summary 同族覆盖。 |
| governance seam / method relation / ref changed consumer | 治理与方法关系 | 是 | Command 改写 relation truth,Consumer 只写 stale / pending / intent。 |
| formal exposure / controlled consumer view | 正式暴露与受控消费;派生维护与只读输出 | 是 | exposure truth、view query、view refresh job 三分。 |
| change impact / downstream impact / handoff | 追溯、变化与影响 | 是 | impact fact、impact summary 和 handoff marker 分开。 |
| search / browse / export / discovery / reconciliation | 派生维护与只读输出 | 是 | search query 和派生 jobs 独立覆盖。 |
| reference state / external ref changed / event collaboration | 外部引用与安全摘要支撑 | 是 | reference command、query、consumer、refresh job、event repair job 分开。 |
| simple ref / summary / report Query | 各 owner 组成部分 | 否 | 走 `GenericQueryReadPath`,因为只读且无 freshness / fallback / unresolved 独立边界。 |
| Outbound Events | 统一 event candidate 路径 | 统一说明 | 不写 per-event payload / outbox / relay。 |

### 8.2 未展开独立处理流的取舍说明

| 未展开接口 | 使用路径 | 原因 | 后续承接 |
|---|---|---|---|
| 单对象 `Get*` Query | `GenericQueryReadPath` | 只读 ref / summary / report,无刷新或修复边界。 | `03` 定义 query response / degraded surface 字段。 |
| list / page 类简单 Query | `GenericQueryReadPath` | 只读 page,不产生新 truth。 | `03` 定义 pagination、filter、排序。 |
| per-event outbound relay | `ProduceCapabilityAccessEventCandidate` | Step 8 只定义事件候选来源,不定义投递机制。 | `03/07` 定义 outbox / relay / topic / planned boundary。 |
| repository / adapter / port method | 不在 Step 8 展开 | 属于详细设计层。 | `03` 展开 trait、adapter、transaction 和 storage。 |
| error code / retry / worker loop | 不在 Step 8 展开 | 属于详细设计、测试和实施计划。 | `03/05/07` 分别闭口。 |

---

## 9. Step 9 状态触发反查

| 状态主题 | Step 8 触发处理流 | Step 6 对象来源 | Step 9 需要继续闭口 |
|---|---|---|---|
| capability identity lifecycle | `EstablishCapabilityAccessContext`;`CorrectCapabilityIdentity / RetireCapabilityIdentity` | `CapabilityIdentity`;`CapabilityIdentityChangeRecord` | candidate / active / correction_pending / retired 等状态和禁止迁移。 |
| access review fact lifecycle | `RecordCapabilityAccessReviewFact` | `CapabilityAccessReviewFact` | draft / recorded / superseded / invalidated。 |
| registry lifecycle | `RegisterCapabilityInRegistry`;`UpdateRegistryLifecycleState / RetireCapabilityRegistryEntry` | `CapabilityRegistryEntry`;`RegistryLifecycleState` | draft / registered / visibility_pending / formal_visible / retired。 |
| descriptor lifecycle | `EstablishAdapterDescriptor`;descriptor replacement flow | `AdapterDescriptor`;`DescriptorChangeRecord` | draft / accepted / unresolved / replaced / retired。 |
| risk / secret safe summary availability | `RecordDescriptorRiskConstraintSummary / AttachDescriptorSecretReference` | `DescriptorRiskConstraintSummary`;`SecretHandlingSafeSummary` | available / unavailable / unresolved / forbidden。 |
| governance seam lifecycle | `AttachGovernanceSeamRelation`;`ConsumeGovernanceResultReferenceChanged` | `GovernanceSeamRelation`;`GovernanceResultRef` | active / pending / unresolved / expired / forbidden。 |
| method relation lifecycle | `AttachCapabilityMethodRelation`;`ConsumeMethodAssetReferenceChanged` | `CapabilityMethodBodyFreeRelation`;`MethodAssetRef` | active / stale / unresolved / removed。 |
| formal exposure lifecycle | `EstablishFormalExposureBoundary`;visibility / suspend / retire variants | `FormalExposureBoundary`;`FormalVisibilityApplicability` | pending / active / suspended / retired / unavailable。 |
| controlled consumer view freshness | `GetControlledConsumerView`;`RefreshControlledConsumerView` | `ControlledConsumerView`;`ConsumerViewFreshnessPolicy` | ready / stale / rebuilding / unavailable。 |
| change impact | `RecordCapabilityChangeImpactFact`;`ConsumeDownstreamConsumptionImpactReported` | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary` | accepted / partial / ignored / linked。 |
| traceability / audit handoff | `RecordTraceabilityHandoffSummary`;`PrepareAuditFriendlyExportSummary` | `CapabilityAccessTraceabilityRecord`;`AuditFriendlyExportSummary` | available / pending / partial / unavailable。 |
| derived material freshness | derived maintenance jobs | `DirectorySearchBrowseProjection`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | ready / stale / rebuilding / failed / inconsistent。 |
| reference resolution state | `RecordReferenceResolutionState`;ref consumers;`RefreshExternalReferenceResolution` | `ReferenceResolutionState`;`ReferenceResolutionPolicy` | resolved / unresolved / stale / invalid / unavailable / forbidden。 |
| event collaboration status | `ProduceCapabilityAccessEventCandidate`;`RepairCapabilityAccessEventCollaboration` | `CapabilityAccessEventCollaborationPort`;change records | candidate / pending_delivery / delivered / failed / handoff_unavailable。 |

---

## 10. 跨处理流一致性审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 是否存在接口没有处理流口径 | pass。Step 7 接口均落到独立 flow、同构 flow、通用读路径或统一 event candidate。 | Step 12 handoff 时继续复核。 |
| 是否存在处理流点名未定义对象 | pass。对象均来自 Step 6 或 Step 7 后移的 port / job 主语。 | `CapabilityAccessEventCollaborationPort` 继续作为 external port skeleton。 |
| 是否存在 Command / Query 混写 | pass。Query 明确 no-write,复杂 Query 只返回 degraded surface。 | `03` 不得在 Query 中刷新 projection 或 repair ref。 |
| 是否存在 Inbound Event 绕过 Command | pass。Consumer 只写 local marker / summary / state / command intent。 | relation truth 仍由正式 Command 改写。 |
| 是否存在 Job 修核心 truth | pass。所有 Job 只写 projection、summary、report、reference state 或 handoff status。 | business repair 必须回到 Command。 |
| 是否存在 owner 冲突 | pass。`ControlledConsumerView`、`ObservabilityAuditRef`、`SecretRef` 等跨流对象 owner 保持 Step 6 结论。 | 后续状态和异常继续沿 owner 分离。 |
| 是否存在 forbidden body 入仓 | pass。治理正文、方法正文、secret 正文、runtime payload、SDK client、audit store、marketplace listing 均禁止。 | `03` DTO / event payload 不得恢复正文。 |
| 是否存在旧材料回流 | pass。未恢复 `QueryCapabilities`、`ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、policy refresh、execution gateway。 | 旧材料只保留在 §11。 |
| 是否足以支撑 Step 9 | pass。状态触发来源均可回指 Step 8 flow。 | 用户确认后进入 Step 9。 |

---

## 11. 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| `QueryCapabilities` 处理流 | 不继承。拆为 formal exposure Command、controlled consumer view Query、consumer view refresh Job 和 event candidate。 | 旧流混合 formal exposure truth、runtime allow / deny、policy decision 和 consumer cache。 |
| `ProviderContract` / provider registration flow | 不继承。由 descriptor truth、secret ref / safe summary 和 reference state flow 替代。 | 旧流吸收 provider runtime、quota、route、cost、failover、secret 和 external call。 |
| `CapabilityDecision` / policy refresh flow | 不继承。governance seam 只承接 `GovernanceResultRef` / safe summary。 | governance approval / Policy truth 属于 `L1-governance`。 |
| KMS / Vault rotate / decrypt flow | 排除。 | 本仓只引用 secret ref 和 safe summary,不实现 secrets 平台。 |
| cost / denied invocation / audit event flow | 排除。 | cost / billing、runtime invocation、observability store 和 deny payload 不归本仓。 |
| runtime tools execution gateway flow | 排除。 | execution truth、tool result、provider call 和 runtime loop 归执行侧。 |
| marketplace listing / provider lookup flow | 不继承。只保留 read-only ecosystem discovery summary。 | listing / transaction / provider runtime state 是边界外。 |
| 旧 `03` repository / DTO / outbox / worker flow | 不继承。 | Step 8 只做概要处理流骨架,详细实现后续按新版 `02` 重新展开。 |

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| `CH-HLD-FLOW-001` | 旧 `02/03` 处理流主线 | resolved_for_step_8 | 旧材料把 QueryCapabilities、ProviderContract、KMS / Vault、CostRecord、policy refresh、runtime/tools execution gateway、outbox relay 和 provider lookup 混入处理流。 | Step 8 已按新版 Step 5/6/7 重建 Command / Query / Inbound / Job / Event Candidate 处理流,旧 flow 仅作 historical material。 |

---

## 12. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` §8 使用。Step 14 装配前不得直接修改正式 `02-概要设计.md`。

````md
## 8. 关键处理流 / 重要函数数据流

> 校准来源:
> - `design-calibration/02_hld_step_08_processing_flows.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_08_processing_flows.md` 的“Step 7 接口到处理流候选池接收”“通用处理流骨架”“按主要组成部分组织的关键处理流”“Step 9 状态触发反查”和“跨处理流一致性审计”小节,了解处理流如何从接口和对象推导。

### 8.1 处理流分类说明

本仓处理流分为五类:

- Command 写路径:改写本仓 capability access truth、relation、formal exposure、history / change record 或 reference state。
- Query 读路径:只读 truth summary、projection、consumer view、safe summary、trace、impact、reference state 或 report。
- Inbound Event Consumer 路径:接收外部已成立事实线索,转为 ref / safe summary / local marker / command intent。
- Operations Job 路径:基于已持久化 truth / ref / safe summary 维护派生材料、对账、reference state 和 handoff。
- Outbound Event Candidate 路径:从已提交事实或维护结果形成 body-free event candidate。

### 8.2 关键处理流覆盖表

| 处理流 | 来源接口 | 主要对象 | 边界 |
|---|---|---|---|
| 外部能力接入语境建立 | `EstablishCapabilityAccessContext` | `CapabilityIdentity`;`CapabilityAccessReviewFact`;`ExternalCapabilitySourceRef` | 不执行外部调用,不生成 governance approval。 |
| registry 纳入与生命周期变化 | `RegisterCapabilityInRegistry`;`UpdateRegistryLifecycleState`;`RetireCapabilityRegistryEntry` | `CapabilityRegistryEntry`;`RegistryLifecycleState`;`RegistryChangeRecord` | 不退化为 allowlist / runtime cache / marketplace listing。 |
| adapter descriptor 建立与风险摘要 | `EstablishAdapterDescriptor`;`RecordDescriptorRiskConstraintSummary`;`AttachDescriptorSecretReference` | `AdapterDescriptor`;`DescriptorRiskConstraintSummary`;`SecretRef`;`SecretHandlingSafeSummary` | 不保存 ProviderContract、secret 正文或 provider runtime。 |
| governance seam 与 method relation | `AttachGovernanceSeamRelation`;`AttachCapabilityMethodRelation`;ref changed consumers | `GovernanceSeamRelation`;`GovernanceResultRef`;`CapabilityMethodBodyFreeRelation`;`MethodAssetRef` | 只承接 ref / safe summary / body-free relation。 |
| formal exposure 与 controlled consumer view | `EstablishFormalExposureBoundary`;`GetControlledConsumerView`;`RefreshControlledConsumerView` | `FormalExposureBoundary`;`FormalVisibilityApplicability`;`ControlledConsumerView` | exposure 是 truth,consumer view 是 projection。 |
| change impact 与 trace handoff | `RecordCapabilityChangeImpactFact`;`ConsumeDownstreamConsumptionImpactReported`;`RecordTraceabilityHandoffSummary` | `CapabilityChangeImpactFact`;`DownstreamConsumptionImpactSummary`;`CapabilityAccessTraceabilityRecord` | 下游影响不回滚 truth,audit handoff 不复制 store。 |
| 派生材料维护 | search / export / discovery / reconciliation jobs | `DirectorySearchBrowseProjection`;`AuditFriendlyExportSummary`;`ReadOnlyEcosystemDiscoverySummary`;`CapabilityReconciliationReport` | 派生材料可重建,不得反写真相。 |
| reference resolution 与 event collaboration | `RecordReferenceResolutionState`;ref consumers;`RefreshExternalReferenceResolution`;`RepairCapabilityAccessEventCollaboration` | `ReferenceResolutionState`;`ReferenceResolutionPolicy`;`CapabilityAccessEventCollaborationPort` | 不补造外部 truth,不定义 topic / payload / relay。 |

### 8.3 通用 Command 写路径

#### GenericCommandWritePath 处理流

```text
<Command API>
  - ActorContext / CommandMetadata / IdempotencyKey / typed request
  │
  ▼
<Application Service>
  - 装载 truth / ref / safe summary / policy
  - 编排 domain object 形成 accepted / pending / rejected
  │
  ▼
<Domain Object / Policy / Change Record>
  - 改写本仓拥有的 truth、relation、summary 或 reference state
  - 生成 change record、trace link 或 refresh hint
  │
  ▼
<Command Result / Event Candidate>
```

关键说明:
- Command 不写外部正文、runtime payload、governance truth、method body、SDK client、secret 正文或 observability store。
- Event candidate 只能来自已提交事实。
- 事务、repository、错误码和 outbox 机制留给详细设计。

### 8.4 重点独立处理流说明

正式概要设计只保留处理流覆盖结论和关键边界;详细图与每个组成部分停审记录保留在校准产物中。进入详细设计前必须优先阅读 `design-calibration/02_hld_step_08_processing_flows.md` §7 的独立处理流。
````

---

## 13. 待确认事项

### 13.1 待确认项处理建议

| 待确认项 | 选项 | 建议 | 理由 | 当前处理 |
|---|---|---|---|---|
| 同构 Command 是否在 Step 8 每个都重复画图 | A. 每个命令重复;B. 按 truth family 画同构独立流并列覆盖清单 | B | 避免重复图掩盖 owner 与状态族差异;覆盖清单已列每个接口。 | 已采用 B |
| Outbound Event 是否画 per-event relay flow | A. 画;B. 只画 event candidate 产生路径 | B | Step 8 不能写 outbox、topic、payload、relay。 | 已采用 B |
| `GetControlledConsumerView` 是否作为简单 Query | A. 简单读;B. 独立处理流 | B | freshness、consumer boundary 和 unavailable surface 对 Step 9 / 10 有影响。 | 已采用 B |
| external ref changed consumer 是否直接改 relation truth | A. 直接改;B. 只写 stale / pending / command intent | B | 防止事件绕过 Command 改写 relation truth。 | 已采用 B |
| repair job 是否可修核心 truth | A. 可以;B. 不可以 | B | Job 只能维护派生、reference 或 handoff surface。 | 已采用 B |

### 13.2 本 Step 未确认事项

- 完整 Rust 函数签名、返回类型、repository trait、transaction boundary、idempotency storage、outbox 表和 error mapping 留给 `03-详细设计.md`。
- Outbound Event topic、payload 字段全集、relay、consumer group、retry、dead letter 和投递 SLA 留给 `03/05/06/07`。
- controlled consumer view、directory projection、reference refresh 的具体 freshness window 和验收阈值留给 `05/06`。
- `CapabilityAccessEventCollaborationPort` 的 planned implementation boundary 留给 `07-实施计划.md`,不得在 Step 8 伪造实现 commit 或 evidence。

---

## 14. 进入下一步条件

- 已从 Step 7 接口骨架和 Step 6 对象轮廓完成处理流候选筛选。
- 已输出通用 Command / Query / Inbound / Job / Outbound Event Candidate 处理流骨架。
- 已按 8 个主要组成部分完成独立处理流、同构覆盖、未展开理由和停审记录。
- P0 Command、会写本地状态的 Inbound Event Consumer、影响一致性 / 可靠性的 Operations Job 和复杂 Query 均有处理流口径。
- 已完成 Step 9 状态触发反查,后续状态主语均能回到 Step 8 flow。
- 已隔离旧 `QueryCapabilities`、`ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、policy refresh、execution gateway、cost / audit、outbox relay 和 provider lookup 污染。
- 正式 `02-概要设计.md` 尚未修改;Step 14 前不得装配正式 §8。

next_allowed_action:

```text
wait_user_review_to_02_step_09
```

当前不需要提交 commit。
